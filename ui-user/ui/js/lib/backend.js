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
// Use array for parameters, assuming batch (i.e. sending / returning multiple objects)
// 
// Object usually always has id, name, description. Receiver may use the id
// and then call related functions in interface to get the details
// 
// For events, it only returns the type of the event and impacted entity, but 
// doesn't need to provide more details. It's client that need to use APIs 
// to fetch the updated details for the entities
// 
// Object schema
// app:{
//   id: ...
//   name: ...
//   description: ...
//   graphs: [{
//     id: ...
//     name: ...
//     description: ...
//     status: {
//       enabled: ...
//     }
//   }]
// }
// 
// graph: {
//   status: {...}
//   graph: the_graph_json
// }
// 
// spec_bundle.list: [ {
//  id: ...
//  name: ...
//  description: ...
//  
// }
// ]
// 
// bundle: see samples/spec_bundles.js
// 
// hub.list: [ {
//   id: ...
//   name: ...
//   description: ...
// }
// ]
// 
// hub: see samples/hub.js
//   
//   


// Most functions are ended with $ which indicates that they are async
var backend_interface = {
  app: {
    list$:        null,     // all apps returned in an array
    get$:         null,     // give ids array, return an array
    create$:      null,     // [{name, description}], return an array of created app
    remove$:      null,     // give ids array
    update$:      null,

    create_ui$:   null,

    create_graph$:      null,     // 
                          // TODO may create spec with graph ??
                          // TODO we provide id in client for
                          // now, but maybe should returned from backend

    // Events
    event:        null,     
  },

  graph: {
    get$:         null,

    update$:      null,
    remove$:      null,
    enable$:      null,
    event:        null,
    start$:       null,
    stop$:        null,
    get_records$: null,
    status$:      null
  },

  ui: {
    get$:        null,
    update$:     null,
    remove$:     null,
  },

  spec_bundle: {
    list$:      null,
    get$:       null,
    get_for_specs: null,    // get all neccessary bundles that contains these specs
    event:              null,
  },

  hub: {
    list$:      null,
    get$:       null,

    event:              null,
  }

};


// For now we only need one implementation of above interface
var WebBackend = {
  app: {},
  ui: {},
  graph: {},
  spec_bundle: {},
  hub: {},
};

function invoke(api) {
  var params = _.toArray(arguments);
  params.shift();
  return $Q($.ajax({
    type: "POST",
    url: "apis/user",
    data: JSON.stringify({
      api: api,
      params:params 
    }),
    contentType: "application/json",
    dataType: "json"
  }).then(function(data) {
    $hope.log("API", "[Invoke]", api, "\n            [Params]", 
      params, "\n            [Result]", data);
    return data;
  }, function(err) {
    $hope.log.warn("API", "[Invoke]", api, "\n            [Params]", 
      params, "\n            [Error ]", err.responseText, err);
    if (err.responseText) {
      return new Error(err.responseText);
    }
    return err;
  }));
}

WebBackend.app.list$ = function() {
  return invoke("app.list");
};

WebBackend.app.create_graph$ = function(app_id, graph) {
  return invoke("app.create_graph", {
    app: app_id,
    graph: graph
  });
};

WebBackend.app.create$ = function(app_name, desc) {
  return invoke("app.create", {
    name: app_name,
    desc: desc
  });
};

WebBackend.app.update$ = function(app_id, props) {
  return invoke("app.update", {
    app: app_id,
    props: props
  });
};

WebBackend.app.remove$ = function(app_id) {
  return invoke("app.remove", {
    app: app_id
  });
};

WebBackend.app.create_ui$ = function(app_id, ui) {
  return invoke("app.create_ui", {
    app: app_id,
    ui: ui
  });
};

WebBackend.app.get_widget_data$ = function(app_id, widget_id) {
  return invoke("app.get_widget_data", {
    app: app_id,
    widget: widget_id
  });
};


WebBackend.app.send_widget_data$ = function(app_id, widget_id, data) {
  return invoke("app.send_widget_data", {
    app: app_id,
    widget: widget_id,
    data: data
  });
};


WebBackend.ui.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("ui.get", ids);
};

WebBackend.ui.update$ = function(ui) {
  return invoke("ui.update", ui);
};

WebBackend.ui.remove$ = function(ids) {
  return invoke("ui.remove", ids);
};

WebBackend.graph.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  } 
  return invoke("graph.get", ids);
};

WebBackend.graph.update$ = function(graph) {
  return invoke("graph.update", graph);
};

WebBackend.graph.remove$ = function(ids) {
  return invoke("graph.remove", ids);
};

WebBackend.graph.start$ = function(ids) {
  return invoke("graph.start", ids);
};

WebBackend.graph.stop$ = function(ids) {
  return invoke("graph.stop", ids);
};

WebBackend.graph.get_records$ = function(ids) {
  return invoke("graph.get_records", ids);
};

WebBackend.graph.status$ = function(ids) {
  return invoke("graph.status", ids);
};

WebBackend.spec_bundle.list$ = function() {
  return invoke("spec_bundle.list");
};

WebBackend.spec_bundle.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("spec_bundle.get", ids);
};

WebBackend.spec_bundle.get_for_specs$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  } 
  return invoke("spec_bundle.get_for_specs", ids);
};

WebBackend.hub.list$ = function() {
  return invoke("hub.list");
};

WebBackend.hub.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  } 
  return invoke("hub.get", ids);
};



export default WebBackend;