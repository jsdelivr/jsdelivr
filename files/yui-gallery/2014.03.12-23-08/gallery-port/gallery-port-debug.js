YUI.add('gallery-port', function(Y) {

    var YAHOO = {
        lang: Y.Lang,
        extend: Y.extend,
        util: {
            Dom: Y.DOM,
            Event: {
                on: Y.Event.nativeAdd,
                getTarget: function(ev) {
                    return ev.target;
                },
                stopEvent: function(ev) {
                    ev.halt();
                },
                stopPropagation: function(ev) {
                    ev.stopPropagation();
                },
                preventDefault: function(ev) {
                    ev.preventDefault();
                }
            },
            Element: Y.Base
        },
        getAttributes: function() {
        }
    },
    Port, PortBase;
    // HACK
    // So the build system doesn't remove this line..
    YAHOO['log'] = Y['log'];

    YAHOO.util.Dom.get = function(id) {
        if (Y.Lang.isString(id)) {
            id = '#' + id;
        }
        return Y.get(id);
    };
    YAHOO.util.Dom.getChildren = function(el) {
        return Y.Selector.query('> *', el);
    };

    Port = function(args) {
        return YAHOO;
    };

    Y.Port = Port;

    PortBase = function(attrs) {
        this._lazyAddAttrs = false;
        this._portAttrs = attrs;
        PortBase.superclass.constructor.apply(this, arguments);    
    };

    PortBase.NAME = 'PortBase';

    PortBase.ATTRS = {
        node: {
            setter: function(node) {
                var n = Y.get(node);
                return n.item(0);
            }
        },
        element: {
            getter: function() {
                return this.get('node');
            },
            setter: function(n) {
                this.set('node', n);
                return this.get('node');
            }
        }
    };

    Y.extend(PortBase, Y.Base, {
        DOM_EVENTS: {
            'click': true,
            'dblclick': true,
            'keydown': true,
            'keypress': true,
            'keyup': true,
            'mousedown': true,
            'mousemove': true,
            'mouseout': true, 
            'mouseover': true, 
            'mouseup': true,
            'focus': true,
            'blur': true,
            'submit': true,
            'change': true
        },
        initializer: function() {
            this.initAttributes(this._portAttrs);
        },
        initAttributes: function() {
        },
        setAttributeConfig: function(name, config) {
            if (config.method) {
                config.setter = config.method;
                delete config.method;
            }
            this.addAttr(name, config);
        },
        addListener: function(name, fn, ctxt, args) {
            if (ctxt) {
                if (args) {
                    fn = Y.rbind(fn, args, ctxt);
                } else {
                    fn = Y.bind(fn, ctxt);
                }
            }
            if (this.DOM_EVENTS[name]) {
                this.get('node').on(name, fn);
            } else {
                this.on(name, fn);
            }
            //console.log('addListener: ', arguments);
        },
        getElementsByClassName: function(className, tagName) {
            var sel = tagName + ' .' + className;
            //console.log('getElementsByClassName', this.constructor.NAME, arguments, sel);
            return this.get('node').query(sel) || [];
        },
        getElementsByTagName: function(tagName) {
            var n = this.get('node');
            return ((n) ? n.query(tagName) : []);
        },
        addClass: function(className) {
            var n = this.get('node');
            if (!n) { return false; }
            return n.addClass(className);
        },
        removeClass: function(className) {
            var n = this.get('node');
            if (!n) { return false; }
            return n.removeClass(className);
        },
        hasClass: function(className) {
            var n = this.get('node');
            if (!n) { return false; }
            return n.hasClass(className);
        },
        appendTo: function(el) {
            Y.get(el).appendChild(this.get('node'));
        },
        fireEvent: function(type, args) {
            if (args.target) {
                delete args.target;
            }
            if (args.ev) {
                args.ev = new Y.DOMEventFacade(args.ev);
            }
            var ret = false, e;
            this.publish(type, {
                defaultFn: function() {
                    ret = true;
                }
            });
            e = this.fire(type, args);
            Y.log('fireEvent: ' + type);
            return ret;
        }
    });

    Y.PortBase = PortBase;



}, 'gallery-2009.11.02-20' ,{requires:['base','node']});
