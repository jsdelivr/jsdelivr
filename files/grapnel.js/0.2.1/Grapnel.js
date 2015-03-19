/****
 * Grapnel.js
 * https://github.com/gregsabia/Grapnel.js 
 * 
 * @author Greg Sabia
 * @link http://gregsabia.com
 * @version 0.2.1
 * 
 * Released under MIT License. See LICENSE.txt or http://opensource.org/licenses/MIT
*/

function Grapnel(hook){
    "use strict";
    var self = this, // Scope reference
        util = {
            actions : [],
            listeners : []
        };
    // Current action if matched (default: null)
    this.action = null;
    // Hook (default: ":")
    this.hook = hook || ':';
    // Current value if matched (default: null)
    this.value = null;
    // Named parameters
    this.params = [];
    // Anchor
    this.anchor = { default : window.location.hash };
    // Version
    this.version = '0.2.1';
    /**
     * Add an action and handler
     * 
     * @param {String|RegExp} action name
     * @param {Function} callback
     * @return self
    */
    this.add = function(name, handler){
        var invoke = function(){
            // If action is instance of RegEx, match the action
            var regex = (self.action && name instanceof RegExp) ? self.anchor.get().match(name) : false;
            // Test matches against current action
            if(regex || name === self.action || self.anchor.get() == name){
                // Match found
                util.trigger('match', self.value, self.params, self.action);
                // Push object to actions array
                util.actions.push({ name : name, handler : handler });
                // Callback
                handler.call(self, self.value, self.params);
            }
            // Return self to force context
            return self;
        }
        // Invoke and add listeners
        return invoke().on(['initialized', 'hashchange'], invoke);
    }
    /**
     * Fire an event listener
     * 
     * @private
     * @param {String} event
     * @return self
    */
    util.trigger = function(event){
        var params = Array.prototype.slice.call(arguments, 1);
        // Call matching events
        util.forEach(util.listeners, function(listener){
            // Apply callback
            if(listener.event == event) listener.handler.apply(self, params);
        });

        return self;
    }
    /**
     * Add an event listener
     * 
     * @param {String|Array} event
     * @param {Function} callback
     * @return self
    */
    this.on = function(event, handler){
        var events = (typeof event === 'string') ? event.split() : event;
        // Add listeners
        util.forEach(events, function(event){
            util.listeners.push({ event : event, handler : handler });
        });

        return this;
    }
    /**
     * Map Array workaround for compatibility issues with archaic browsers
     * 
     * @private
     * @param {Array} to iterate
     * @param {Function} callback
    */
    util.map = function(a, callback){
        if(typeof Array.prototype.map === 'function') return Array.prototype.map.call(a, callback);
        // Replicate map()
        return function(c, next){
            var other = new Array(this.length);
            for(var i=0, n=this.length; i<n; i++){
                if(i in this) other[i] = c.call(next, this[i], i, this);
            }

            return other;
        }.call(a, callback);
    }
    /**
     * ForEach workaround
     * 
     * @private
     * @param {Array} to iterate
     * @param {Function} callback
    */
    util.forEach = function(a, callback){
        if(typeof Array.prototype.forEach === 'function') return Array.prototype.forEach.call(a, callback);
        // Replicate forEach()
        return function(c, next){
            for(var i=0, n = this.length; i<n; ++i){
                c.call(next, this[i], i, this);
            }
        }.call(a, callback);
    }
    /**
     * Create a matchable RegExp Route
     *
     * @private
     * @param {String} Path of route
     * @param {Array} Array of keys to fill
     * @param {Bool} Case sensitive comparison
     * @param {Bool} Strict mode
    */
    util.routeRegExp = function(path, keys, sensitive, strict){
        if(path instanceof RegExp) return path;
        if(path instanceof Array) path = '(' + path.join('|') + ')';
        // Build route RegExp
        path = path.concat(strict ? '' : '/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/\+/g, '__plus__')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
                keys.push({ name : key, optional : !!optional });
                slash = slash || '';
                
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/__plus__/g, '(.+)')
            .replace(/\*/g, '(.*)');

        return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    }
    // Get anchor
    this.anchor.get = function(){
        return (window.location.hash) ? window.location.hash.split('#')[1] : '';
    }
    // Change anchor
    this.anchor.set = function(anchor){
        window.location.hash = (!anchor) ? '' : anchor;
        return self;
    }
    // Reset anchor
    this.anchor.clear = function(){
        return this.set(false);
    }
    // Parse
    this.parse = function(){
        var anchor = this.anchor.get(),
            pieces = anchor.split(this.hook),
            glue = anchor.match(this.hook),
            action = pieces[0], // First index is the action
            params = [],
            value;
        
        if(this.anchor.get().match(this.hook)){
            params = pieces.slice(1);
            value = params.join(glue[0]);
        }

        // Trigger successfully parsed URL
        util.trigger('parse', pieces);

        return {
            value : value,
            action : action,
            params : params
        };
    }
    // Return matched actions
    this.matches = function(){
        var matches = [];

        util.forEach(util.actions, function(action){
            // If action is instance of RegEx, match the action
            var regex = (action.name instanceof RegExp && self.action.match(action.name));
            // Test matches against current action
            if(regex || action.name === self.action){
                // Match found
                matches.push(action);
            }
        });

        return matches;
    }
    // Enable routing
    this.router = function(){
        // Set Grapnel hook as a forward slash
        this.hook = /\//gi;
        // Add GET method callable through API
        this.get = function(path, handler){
            var keys = [];
            var regex = new util.routeRegExp(path, keys);
            // Add listener
            this.add(regex, function(){
                var req = { params : {} };
                // Build parameters
                util.forEach(keys, function(key, i){
                    req.params[key.name] = (self.params && self.params[i]) ? self.params[i] : undefined;
                });
                // Call handler
                // Notice how a handler for a route passes `params` as the second argument, instead of `self.value`
                handler.call(self, req);
            });

            return self;
        }
        // There can be only one
        delete this.router;

        return util.trigger('initialized');
    }
    // Run hook action when state changes
    this.on(['initialized', 'hashchange'], function(){
        var parsed = this.parse();
        // Parse Hashtag in URL
        this.action = parsed.action;
        this.value = parsed.value;
        this.params = parsed.params;
        // Reset actions
        util.actions = [];
    });
    // Check current hash change event
    if(typeof window.onhashchange === 'function') this.on('hashchange', window.onhashchange);
    /**
     * Hash change event
     * TODO: increase browser compatibility. "window.onhashchange" can be supplemented in older browsers with setInterval()
    */
    window.onhashchange = function(){
        util.trigger('hashchange');
    }

    return util.trigger('initialized');
}