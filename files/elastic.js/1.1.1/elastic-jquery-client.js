/*! elastic.js - v1.1.1 - 2013-05-24
 * https://github.com/fullscale/elastic.js
 * Copyright (c) 2013 FullScale Labs, LLC; Licensed MIT */

/*jshint jquery:true */

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
    A <code>jQueryClient</code> is a type of <code>client</code> that uses
    jQuery for communication with ElasticSearch.
    
    @name ejs.jQueryClient

    @desc
    A client that uses jQuery for communication.

    @param {String} server the ElasticSearch server location.  Leave blank if
    code is running on the same server as ElasticSearch, ie. in a plugin.  
    An example server is http://localhost:9200/.
    */  
  ejs.jQueryClient = function (server) {
    var 
    
      // jQuery defaults
      options = {
        contentType: 'application/json',
        dataType: 'json',
        processData: false
      },
    
      // method to ensure the path always starts with a slash
      getPath = function (path) {
        if (path.charAt(0) !== '/') {
          path = '/' + path;
        }
        
        return server + path;
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

            @member ejs.jQueryClient
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
            Sets a jQuery ajax option.

            @member ejs.jQueryClient
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

            @member ejs.jQueryClient
            @param {String} path the path to GET from the server
            @param {Object} data an object of url parameters for the request
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns jQuery <code>jqXHR</code> for the request.
            */
      get: function (path, data, successcb, errorcb) {
        var opt = jQuery.extend({}, options);
        
        opt.type = 'GET';
        opt.url = getPath(path);
        opt.data = data;
        opt.success = successcb;
        opt.error = errorcb;

        return jQuery.ajax(opt);
      },
      
      /**
            Performs HTTP POST requests against the server.

            @member ejs.jQueryClient
            @param {String} path the path to POST to on the server
            @param {String} data the POST body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns jQuery <code>jqXHR</code> for the request.
            */
      post: function (path, data, successcb, errorcb) {
        var opt = jQuery.extend({}, options);
        
        opt.type = 'POST';
        opt.url = getPath(path);
        opt.data = data;
        opt.success = successcb;
        opt.error = errorcb;
       
        return jQuery.ajax(opt);  
      },
      
      /**
            Performs HTTP PUT requests against the server.

            @member ejs.jQueryClient
            @param {String} path the path to PUT to on the server
            @param {String} data the PUT body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns jQuery <code>jqXHR</code> for the request. 
            */
      put: function (path, data, successcb, errorcb) {
        var opt = jQuery.extend({}, options);
        
        opt.type = 'PUT';
        opt.url = getPath(path);
        opt.data = data;
        opt.success = successcb;
        opt.error = errorcb;
        
        return jQuery.ajax(opt);
      },
      
      /**
            Performs HTTP DELETE requests against the server.

            @member ejs.jQueryClient
            @param {String} path the path to DELETE to on the server
            @param {String} data the DELETE body
            @param {Function} successcb a callback function that will be called with
              the results of the request.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns jQuery <code>jqXHR</code> for the request. 
            */
      del: function (path, data, successcb, errorcb) {
        var opt = jQuery.extend({}, options);
        
        opt.type = 'DELETE';
        opt.url = getPath(path);
        opt.data = data;
        opt.success = successcb;
        opt.error = errorcb;
        
        return jQuery.ajax(opt);
      },
      
      /**
            Performs HTTP HEAD requests against the server. Same as 
            <code>get</code>, except only returns headers.

            @member ejs.jQueryClient
            @param {String} path the path to HEAD to on the server
            @param {Object} data an object of url parameters.
            @param {Function} successcb a callback function that will be called with
              the an object of the returned headers.
            @param {Function} errorcb a callback function that will be called
              when there is an error with the request
            @returns {Object} returns jQuery <code>jqXHR</code> for the request.
            */
      head: function (path, data, successcb, errorcb) {
        var opt = jQuery.extend({}, options);
        
        opt.type = 'HEAD';
        opt.url = getPath(path);
        opt.data = data;
        opt.error = errorcb;
        opt.complete = function (jqXHR, textStatus) {
          // only parse headers on success
          if (textStatus !== 'success') {
            return;
          }
          
          var headers = jqXHR.getAllResponseHeaders().split('\n'),
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
        
        return jQuery.ajax(opt);
      }
    };
  };

}).call(this);