/*! elastic.js - v1.1.1 - 2013-05-24
 * https://github.com/fullscale/elastic.js
 * Copyright (c) 2013 FullScale Labs, LLC; Licensed MIT */

/*global Ext:true */

(function () {
  'use strict';

  var 

    // save reference to global object
    // `window` in browser
    // `exports` on server
    root = this,
    ejs;
  
  // create namespace
  // use existing ejs object if it exists
  if (typeof exports !== 'undefined') {
    ejs = exports;
  } else {
    if (root.ejs == null) {
      ejs = root.ejs = {};
    } else {
      ejs = root.ejs;
    }
  }

  /**
    @class
    A <code>ExtJSClient</code> is a type of <code>client</code> that uses
    ExtJS for communication with ElasticSearch.
    
    @name ejs.ExtJSClient

    @desc
    A client that uses ExtJS for communication.

    @param {String} server the ElasticSearch server location.  Leave blank if
    code is running on the same server as ElasticSearch, ie. in a plugin.  
    An example server is http://localhost:9200/.
    */  
  ejs.ExtJSClient = function (server) {
    
    // make sure CORS support is enabled
    Ext.Ajax.cors = true;
    
    var 
    
      // extjs ajax request defaults
      options = {
        headers: {'Content-Type': 'application/json'}
      },
    
      // method to ensure the path always starts with a slash
      getPath = function (path) {
        if (path.charAt(0) !== '/') {
          path = '/' + path;
        }
        
        return server + path;
      },
      
      // decodes ElasticSearch json response to actual object and call
      // the user's callback with the json object.
      wrapCb = function (cb) {
        return function (response) {
          var jsonResp = Ext.JSON.decode(response.responseText);
          if (cb != null) {
            cb(jsonResp);
          }
        };
      };
    
    
    // check that the server path does no end with a slash
    if (server == null) {
      server = '';
    } else if (server.charAt(server.length - 1) === '/') {
      server = server.substring(0, server.length - 1);
    }
      
    return {


      /**
            Sets the ElasticSearch server location.

            @member ejs.ExtJSClient
            @param {String} server The server url
            @returns {Object} returns <code>this</code> so that calls can be 
            chained. Returns {String} current value if `server` is not specified.
            */
      server: function (s) {
        if (s == null) {
          return server;
        }
        
        if (s.charAt(s.length - 1) === '/') {
          server = s.substring(0, s.length - 1);
        } else {
          server = s;
        }
        
        return this;
      },
      
      /**
            Sets a ExtJS ajax request option.

            @member ejs.ExtJSClient
            @param {String} oKey The option name
            @param {String} oVal The option value
            @returns {Object} returns <code>this</code> so that calls can be 
            chained. Returns the current value of oKey if oVal is not set.
            */
      option: function (oKey, oVal) {
        if (oKey == null) {
          return options;
        }
        
        if (oVal == null) {
          return options[oKey];
        }
        
        options[oKey] = oVal;
      },
      
      /**
            Performs HTTP GET requests against the server.

            @member ejs.ExtJSClient
            @param {String} path the path to GET from the server
            @param {Object} data an object of url parameters for the request
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns ExtJS request object.
            */
      get: function (path, data, successcb, errorcb) {
        var opt = Ext.apply({}, options);
        
        opt.method = 'GET';
        opt.url = getPath(path);
        opt.params = data;
        opt.success = wrapCb(successcb);
        opt.failure = errorcb;

        return Ext.Ajax.request(opt);
      },
      
      /**
            Performs HTTP POST requests against the server.

            @member ejs.ExtJSClient
            @param {String} path the path to POST to on the server
            @param {String} data the POST body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns ExtJS request object.
            */
      post: function (path, data, successcb, errorcb) {
        var opt = Ext.apply({}, options);
        
        opt.method = 'POST';
        opt.url = getPath(path);
        opt.jsonData = data;
        opt.success = wrapCb(successcb);
        opt.failure = errorcb;
       
        return Ext.Ajax.request(opt);  
      },
      
      /**
            Performs HTTP PUT requests against the server.

            @member ejs.ExtJSClient
            @param {String} path the path to PUT to on the server
            @param {String} data the PUT body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns ExtJS request object.
            */
      put: function (path, data, successcb, errorcb) {
        var opt = Ext.apply({}, options);
        
        opt.method = 'PUT';
        opt.url = getPath(path);
        opt.jsonData = data;
        opt.success = wrapCb(successcb);
        opt.failure = errorcb;
        
        return Ext.Ajax.request(opt);
      },
      
      /**
            Performs HTTP DELETE requests against the server.

            @member ejs.ExtJSClient
            @param {String} path the path to DELETE to on the server
            @param {String} data the DELETE body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns ExtJS request object.
            */
      del: function (path, data, successcb, errorcb) {
        var opt = Ext.apply({}, options);
        
        opt.method = 'DELETE';
        opt.url = getPath(path);
        opt.jsonData = data;
        opt.success = wrapCb(successcb);
        opt.failure = errorcb;
        
        return Ext.Ajax.request(opt);
      },
      
      /**
            Performs HTTP HEAD requests against the server. Same as 
            <code>get</code>, except only returns headers.

            @member ejs.ExtJSClient
            @param {String} path the path to HEAD to on the server
            @param {Object} data an object of url parameters.
            @param {Function} successcb a callback function that will be called with
              the an object of the returned headers.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} ExtJS request object.
            */
      head: function (path, data, successcb, errorcb) {
        var opt = Ext.apply({}, options);
        
        opt.method = 'HEAD';
        opt.url = getPath(path);
        opt.params = data;
        opt.failure = errorcb;
        opt.callback = function (options, success, xhr) {
          
          // only process on success
          if (!success) {
            return;
          }
          
          var headers = xhr.getAllResponseHeaders().split('\n'),
            resp = {},
            parts,
            i;
            
          for (i = 0; i < headers.length; i++) {
            parts = headers[i].split(':');
            if (parts.length !== 2) {
              resp[parts[0]] = parts[1];
            }
          }
          
          if (successcb != null) {
            successcb(resp);
          }
        };
        
        return Ext.Ajax.request(opt);
      }
    };
  };

}).call(this);