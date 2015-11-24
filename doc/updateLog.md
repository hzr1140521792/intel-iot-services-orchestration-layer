### 2015-11-24

#### update log

`message/package.json`
    
update:
    
    "dependencies" : {
        "socket.io": "^1.3.7"
    }

add:
    
    "dependencies" : {
        "engine.io": "^1.5.4",
        "socket.io-client": "^1.3.7",
        "socket.io-parser": "^2.2.5"
    }

    
`ui-dev/bower.json`
    
update:

    "socket.io-client": "~1.3.7"

`ui-dev/package.json`
    
update:

    "dependencies" : {
        "socket.io": "^1.3.7",
        "socket.io-client": "^1.3.7",
    }
    "devDependencies" : {
        "gulp-useref": "~3.0.2",
        "gulp-util": "~3.0.7",
    }

add:

    "dependencies" : {
        "wrappy": "~1.0.1",
        "glob": "~6.0.1",
        "minimatch": "~3.0.0"
    }
    "devDependencies": {
        "end-of-stream": "^1.1.0",
        "nodes": "~0.1.0",
        "readable-stream": "~2.0.4",
        "xtend": "~4.0.1"
    }

`ui-user/package.json`

add:
    
    "devDependencies" : {
        "core-util-is": "~1.0.2",
        "isarray": "~0.0.1"
    }



`ui-widgets/package.json`
    
add:

    "devDependencies" : {
        "to-fast-properties": "~1.0.1",
        "esutils": "~2.0.2",
        "repeating": "~2.0.0",
        "globals": "~8.12.0",
        "line-numbers": "~0.2.0",
        "js-tokens": "~1.0.2",
        "chalk": "~1.1.1",
        "babylon": "~6.2.0",
        "convert-source-map": "~1.1.2",
        "minimatch": "~3.0.0",
        "slash": "~1.0.0",
        "path-exists": "~2.1.0",
        "json5": "~0.4.0",
        "path-is-absolute": "~1.0.0",
        "shebang-regex": "~1.0.0",
        "source-map": "~0.5.3",
        "detect-indent": "~4.0.0",
        "trim-right": "~1.0.1",
        "is-integer": "~1.0.6",
        "try-resolve": "~1.0.1",
        "debug": "~2.2.0",
        "babel-plugin-constant-folding": "~1.0.1",
        "babel-plugin-eval": "~1.0.1",
        "babel-plugin-remove-debugger": "~1.0.1",
        "babel-plugin-remove-console": "~1.0.1",
        "babel-plugin-inline-environment-variables": "~1.0.1",
        "babel-plugin-dead-code-elimination": "~1.0.2",
        "babel-plugin-react-display-name": "~2.0.0",
        "babel-plugin-undeclared-variables-check": "~6.1.18",
        "babel-plugin-react-constant-elements": "~1.0.3",
        "regexpu": "~1.3.0",
        "babel-plugin-proto-to-assign": "~1.0.4",
        "babel-plugin-undefined-to-void": "~1.1.6",
        "regenerator": "~0.8.42",
        "babel-plugin-runtime": "~1.0.7",
        "babel-plugin-member-expression-literals": "~1.0.1",
        "babel-plugin-property-literals": "~1.0.1",
        "babel-plugin-jscript": "~1.0.4"
    }


`ui-dev/gulpfile.js`

    // var assets = $.useref.assets({searchPath: [".tmp", "ui"]});
    var assets = $.useref({searchPath: [".tmp", "ui"]});


