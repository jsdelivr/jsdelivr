YUI.add('gallery-raphael', function(Y) {

(function() {
    
    // paths to raphael source
    var RAPHAEL_SRC = {
            raw: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael.js',
            min: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael-min.js'
        },
        // Raphael functions I'm shimming
        methods = ['rect', 'circle', 'ellipse', 'path', 'text', 'image', 'clear', 'setSize', 'set'],
        statics = ['getRGB', 'setWindow', 'angle', 'rad', 'deg', 'snapTo', 'getColor', 'registerFont'];
    
    /*
     * This is the loader attached to Y that is used to lazy-load Raphael and any plugins. Options contain
     * type='raw' or 'min'. (default is min)
     */
    function RaphaelLoader(opts) {
        var NAME = 'RaphaelLoader',
            loadedScripts = {},
            opts = opts || {},
            defaults = {
                type: 'min'
            };
        opts = Y.mix(opts, defaults);
        return {
            /* Loads Raphael first, then on success, loads any specified plugins. Calls _ready() on every
             * plugin script load.
             */
            use: function() {
				var self = this, scriptOpts = {},
				    plugins = Y.Lang.isArray(arguments[0]) ? arguments[0] : (Y.Lang.isString(arguments[0]) ? [arguments[0]] : []);

			    this.callback = Y.Lang.isFunction(arguments[0]) ? arguments[0] : arguments[1];
			    // on successful Raphael.js load, load plugins
                scriptOpts.onSuccess = function(d) { 
                    Y.log('raphael.js is loaded');
                    loadedScripts[RAPHAEL_SRC[opts.type]] = true;
                    Y.Array.each(plugins, function(plugin) {
    				    loadedScripts[plugin] = false;
    				    Y.Get.script(plugin, {
    				        onSuccess: function(d) {
    				            self._ready.call(self, d);
    				        }
    				    });
    				});
                };
                scriptOpts.onEnd = function(d) {
                    self._ready.call(self, d);
                }

                loadedScripts[RAPHAEL_SRC[opts.type]] = false;
				Y.Get.script( RAPHAEL_SRC[opts.type], scriptOpts );
				
            },
            // keeps track of loaded scripts and runs the callback when everything is loaded
            _ready: function(d) {
                var files = [], rdy = true;
                Y.Array.each(d.nodes, function(script) {
                    var name = script.getAttribute('src');
                    loadedScripts[name] = true;
                    Y.log(name + ' ready');
                });
                
                Y.log('checking for loaded scripts...');
                Y.Object.each(loadedScripts, function(v, k, o) {
                    if (!v) {
                        Y.log('not ready. missing ' + k);
                        rdy = false;
                        return;
                    }
                });
                
                if (!rdy) return;
                // RaphWrapper is the Raphael facade
                this.callback(RaphWrapper);
            }
        };
    }
    
    /* This is a facade for Raphael. All calls that users make to Raphael are actually calls made 
     * on this. It is a constructor that delegates to Raphael() as well as adding lots of function
     * shims on the resulting Raphael instance so we can add functionality to vectors.
     */
    function RaphWrapper() {
        var raph = Raphael.apply(Raphael, arguments), 
            raphInst = {}, 
            cache = {};
        
        // Attaches a Y.Node to SVG objects and mixes in Y.EventTarget. If the object
        // is actually the Raphael instance, just returns it for chaining.
        function wrapVector(vect) {
            if (vect === raph) {
                return vect; // not a vector, just chaining
            } else if (vect.type && vect.type === 'set') {
				return vect; // this is a Set
			}
            vect.$node = new Y.Node(vect.node);
            return Y.augment(vect, Y.EventTarget);
        }
        
        // augment methods
        Y.Array.each(methods, function(fnName) {
            raphInst[fnName] = function() {
                return wrapVector(raph[fnName].apply(raph, arguments));
            };
        });
        
        // this handles plugin addons to the main canvas
        Y.Object.each(Raphael.fn, function(fn, fnName) {
            raphInst[fnName] = function() {
                return wrapVector(raph[fnName].apply(raph, arguments));
            };
        });
        // plugins using Raphael.el to add methods to SVG elements just work without help
        
		// finally, mix in the properties
        return Y.mix(raphInst, raph);
    }
    
    // augmenting static methods
    Y.Array.each(statics, function(fnName) {
        RaphWrapper[fnName] = function() {
            return Raphael.prototype.raphael[fnName].apply(Raphael, arguments);
        }
    });
    
    Y.Raphael = RaphaelLoader;
    
}());


}, 'gallery-2010.09.29-18-36' ,{requires:['oop', 'event-custom', 'event', 'node']});
