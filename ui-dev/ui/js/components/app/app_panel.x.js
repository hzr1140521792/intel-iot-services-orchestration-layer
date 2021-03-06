/******************************************************************************
Copyright (c) 2015, Intel Corporation

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*****************************************************************************/
import {Row, ModalTrigger, OverlayTrigger, Popover, Button} from "react-bootstrap";
import {Navigation} from "react-router";
import DlgCreate from "../ide/dlg_create.x";

var AppPanel = React.createClass({

  mixins: [Navigation],

  propTypes: {
    app: React.PropTypes.object.isRequired,
    working: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      is_editing: false,
      is_modified: false
    };
  },

  get_status() {
    var app = this.props.app;
    var working = this.props.working;
    var status = app.graphs.length ? (working.length ? "Working" : "Stopped") : "Idle";

    return status;
  },

  _on_double_click: function(e) {
    this.setState({
      is_editing: true
    });
  },

  _on_blur: function(e) {
    var app = this.props.app;
    e.preventDefault();
    e.stopPropagation();
    if (this.state.is_editing && this.state.is_modified) {
      $hope.trigger_action("app/update/app", {
        id: app.id,
        props: {
          description: app.description
        }
      });
    }

    this.setState({
      is_editing: false,
      is_modified: false
    });
  },

  _on_desc_change: function(e) {
    var app = this.props.app;
    if (app.description !== e.target.value) {
      app.description = e.target.value;
      this.setState({
        is_modified: true
      });
    }
  },

  _on_control: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var app = this.props.app;
    var graphs = _.pluck(app.graphs, "id");
    if (graphs.length === 0) {
      return;
    }

    if (this.get_status() === "Working") {
      if (this.props.working.length === 0) {
        return;
      }
      $hope.trigger_action("graph/stop", {
        graphs: this.props.working
      });
    }
    else {
      var torun = _.difference(graphs, this.props.working);
      if (torun.length === 0) {
        return;
      }
      $hope.trigger_action("graph/start", {
        graphs: graphs
      });
    }
  },

  _on_addui: function(data) {
    var name = data && data.name && data.name.trim();
    if (!name) {
      return $hope.notify("error", "Invalid UI name");
    }
    var app = $hope.app.stores.app.get_app(this.props.app.id);
    if (_.find(app.uis, "name", name)) {
      return $hope.notify("error", "This name already exists in the App");
    }
    var ui = $hope.app.stores.ui.create_ui(this.props.app.id, {
      id: $hope.uniqueId("UI_"),
      name: name,
      description: data.description
    });

    this.transitionTo("ui_ide", {id: ui.id});
  },

  _on_home: function(id, e) {
    e.preventDefault();
    e.stopPropagation();

    var app = this.props.app;
    if (app && app.main_ui !== id) {
      $hope.trigger_action("app/update/app", {
        id: app.id,
        props: {
          main_ui: id
        }
      });
    }
  },

  _on_go: function(id, e) {
    e.preventDefault();
    e.stopPropagation();

    this.transitionTo("ui_ide", {id: id});
  },

  _on_trash: function(id, e) {
    e.preventDefault();
    e.stopPropagation();

    $hope.confirm("Delete from Server", 
      "This would delete the ui deployed on the server. Please make sure this is what you expect!",
      "warning", () => {
      var app = this.props.app;
      if (app && app.main_ui === id) {
        $hope.trigger_action("app/update/app", {
          id: app.id,
          props: {
            main_ui: ""
          }
        });
      }
      $hope.trigger_action("ui/remove", {
        uis: [id]
      });
    });
  },

  _on_ui_event: function(e) {
    $hope.log("event", "AppPanel", e);
    $hope.log("forceUpdate", "AppPanel");

    var app = this.props.app;
    switch(e.event) {
      case "removed":
        if (app) {
          _.remove(app.uis, ui => ui.id === e.id);
        }
        $hope.notify("success", "UI successfully removed!");
        break;
    }

    this.forceUpdate();
  },

  componentDidMount: function() {
    $hope.app.stores.ui.on("ui", this._on_ui_event);
  },

  componentWillUnmount: function() {
    $hope.app.stores.ui.removeListener("ui", this._on_ui_event);
  },

  render: function() {
    var app = this.props.app;
    var sts = this.get_status();

    return (
      <div className="hope-app-panel">
        <Row className="hope-app-panel-name hope-app-panel-shadow-border">
          <div>{app.name}</div>
        </Row>
        <Row>
          <OverlayTrigger trigger="hover" placement="bottom" rootClose overlay={<Popover>Double Click to edit the description</Popover>}>
            <textarea className="hope-app-panel-desc"
              value={app.description}
              type="text"
              readOnly={!this.state.is_editing}
              onChange={this._on_desc_change}
              onBlur={this._on_blur}
              onDoubleClick={this._on_double_click} />
          </OverlayTrigger>
        </Row>
        <Row className="text-center hope-app-panel-sep hope-app-panel-shadow-border">
          <div>Status Control</div>
        </Row>
        <Row className="text-center">
          <Button onClick={this._on_control} bsStyle={sts === "Working" ? "warning" : "primary"} className="hope-app-panel-btn">
            {sts === "Working" ? "Stop" : "Run"}
          </Button>
        </Row>
        <Row className="text-center hope-app-panel-sep hope-app-panel-shadow-border">
          <div>UI for End User</div>
        </Row>
        <Row className="hope-app-panel-ui-list">
        {
          _.map(app.uis, ui =>
            <div className="hope-app-panel-ui" key={ui.id}>
              <div onClick={this._on_go.bind(this, ui.id)}
                className="hope-app-panel-ui-name">{ui.name || ui.id}</div>
              <i onClick={this._on_home.bind(this, ui.id)}
                className={"hope-app-panel-ui-home fa fa-home" + (app.main_ui === ui.id ? " home-ui" : "")}/>
              <i onClick={this._on_trash.bind(this, ui.id)}
                className="hope-app-panel-ui-trash fa fa-trash"/>
            </div>)
        }
        { !app.is_builtin &&
          <ModalTrigger modal={<DlgCreate title="Create UI" onClickCreate={this._on_addui}/>}>
            <div className="text-center hope-app-panel-ui add-new">
              <i className="fa fa-plus"/>
            </div>
          </ModalTrigger>
        }
        </Row>
      </div>
    );
  }
});

export default AppPanel;