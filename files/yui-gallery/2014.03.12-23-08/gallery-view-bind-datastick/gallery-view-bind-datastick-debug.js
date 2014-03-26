YUI.add('gallery-view-bind-datastick', function (Y, NAME) {

function DataStick() {}

DataStick._handlers = [];

DataStick.addHandler = function(handlers) {
    handlers = Y.Array.map(Y.Array.flatten([handlers]), function(handler) {
        return Y.mix({
            updateModel: true,
            updateView: true,
            updateMethod: 'text'
        }, handler, true);
    });

    this._handlers = this._handlers.concat(handlers);
};

DataStick.prototype = {
    _modelBindings: null,

    unbindAttrs: function(model) {
        Y.Array.each(this._modelBindings, Y.bind(function(binding, i) {
            if (model && binding.model !== model) {
                return false;
            }

            binding.model.detach(binding.event, binding.fn);
            delete this._modelBindings[i];
        }, this));

        this._modelBindings = Y.Array.filter(this._modelBindings, function(b) {
            return b;
        });

        this.get('container').detach('stick' + (model ? ':' + model.get('clientId') : ''));
    },

    bindAttrs: function(optionalModel, optionalBindings) {
        var self = this,
            model = optionalModel || this.get('model');

        var namespace = 'stick:' + model.get('clientId'),
            bindings = optionalBindings || this.bindings || {};

        if (!this._modelBindings) {
            this._modelBindings = [];
        }

        this.unbindAttrs(optionalModel);

        Y.Array.each(Y.Object.keys(bindings), function(selector) {
            var container, options, modelAttr, config,
                binding = bindings[selector] || {},
                bindKey = Y.guid();

            if (selector != 'container') {
                container = self.get('container').all(selector);
            } else {
                container = Y.NodeList(self.get('container'));
                selector = '';
            }

            if (container.isEmpty()) {
                return;
            }

            if (Y.Lang.isString(binding)) {
                binding = { observe: binding };
            }

            config = getConfiguration(container, binding);

            modelAttr = config.observe;

            options = Y.mix({ bindKey: bindKey}, config.setOptions || {}, true);

            initializeAttributes(self, container, config, model, modelAttr);

            initializeVisible(self, container, config, model, modelAttr);

            if (modelAttr) {
                Y.Array.each(config.events || [], function (type) {
                    var event = type, // Need to fix to work with YUI prefixes
                        method = function(event) {
                            var val = config.getVal.call(self, container, event, config);
                            if (evaluateBoolean(self, config.updateModel, val, config)) {
                                setAttr(model, modelAttr, val, options, self, config);
                            }
                        };

                    if (selector === '') {
                        self.get('container').on(event, method);
                    } else {
                        self.get('container').delegate(event, method, selector)
                    }
                });

                Y.Array.each(Y.Array.flatten([modelAttr]), function (attr) {
                    observeModelEvent(model, self, attr + 'Change', 
                        function(e) {
                            if (e.bindKey != bindKey) {
                                var model = e.currentTarget;
                                updateViewBindEl(self, container, config, getAttr(model, modelAttr, config, self, e), model);
                            }
                        });
                });

                updateViewBindEl(self, container, config,
                                 getAttr(model, modelAttr, config, self),
                                 model, true);
            }

            applyViewFn(self, config.initialize, container, model, config);
        });

        this._originalDestroy = this.destroy;
        this.destroy = function() {
            self.unbindAttrs();
            if (self._originalDestroy) {
                self._originalDestroy.apply(arguments);
            }
        }
    }
};

/* Utility functions */

var evaluatePath = function(obj, path) {
    var parts = (path || '').split('.');
    var result = Y.Array.reduce(parts, obj, function(memo, i) {return memo[i]; });
    return result == null ? obj : result;
};

var applyViewFn = function(view, fn) {
    if (fn) {
        return (Y.Lang.isString(fn) ? view[fn] : fn).apply(view, Y.Array(arguments, 2));
    }
};

var getSelectedOption = function($select) {
    return $select.get('options').filter(function(option) {
        return option.selected;
    });
};

var evaluateBoolean = function(view, reference) {
    if (Y.Lang.isBoolean(reference)) {
        return reference;
    } else if (Y.Lang.isFunction(reference) || Y.Lang.isString(reference)) {
        return applyViewFn.apply(this, Y.Array(arguments));
    }

    return false;
};

var observeModelEvent = function(model, view, event, fn) {
    model.on(event, fn, view);
    view._modelBindings.push({
        model: model,
        event: event,
        fn: fn
    });
}

var setAttr = function(model, attr, val, options, context, config) {
    if (config.onSet) {
        val = applyViewFn(context, config.onSet, val, config);
    }
    model.set(attr, val, options);
};

var getAttr = function(model, attr, config, context, event) {
    var val, 
        retrieveVal = function(field) {
            var retrieved;
            if (event && field === event.attrName) {
                retrieved = config.escape ? Y.Escape.html(event.newVal) : event.newVal;
            } else {
                retrieved = config.escape ? Y.Escape.html(model.get(field)) : model.get(field);
            }

            return Y.Lang.isUndefined(retrieved) || Y.Lang.isNull(retrieved) ? '' : retrieved;
        };

    val = Y.Lang.isArray(attr) ? Y.Array.map(attr, retrieveVal) : retrieveVal(attr);

    return config.onGet ? applyViewFn(context, config.onGet, val, config) : val;
};

var getConfiguration = function($el, binding) {
    var handlers = [{
        updateModel: false,
        updateView: true,
        updateMethod: 'text',
        update: function($el, val, m, opts) { $el.set(opts.updateMethod, val); },
        getVal: function($el, e, opts) { return $el.get(opts.updateMethod); }
    }];

    Y.Array.each(DataStick._handlers, function(handler) {
        if ($el.item(0).test(handler.selector)) {
            handlers.push(handler);
        }
    });

    handlers.push(binding);

    var config = Y.Array.reduce(handlers, {}, function(prev, curr) {
        return Y.mix(prev, curr, true);
    });

    delete config.selector;
    return config;
}

var initializeAttributes = function(view, $el, config, model, modelAttr) {
    var props = ['autofocus', 'autoplay', 'async', 'checked', 'controls',
                 'defer', 'disabled', 'hidden', 'loop', 'multiple', 'open',
                 'readonly', 'required', 'scoped', 'selected'];

    Y.Array.each(config.attributes || [], function(attrConfig) {
        var lastClass = '',
            observed = attrConfig.observe || (attrConfig.observe = modelAttr),
            updateAttr = function() {
                var isProperty = Y.Array.indexOf(props, attrConfig.name, true) > -1,
                    updateType = isProperty ? 'prop' : 'attr',
                    val = getAttr(model, observed, attrConfig, view);

                if (attrConfig.name === 'class') {
                    $el.removeClass(lastClass).addClass(val);
                    lastClass = val;
                } else {
                    $el[updateType](attrConfig.name, val); 
                }
            };
            
        Y.Array.each(Y.Array.flatten([observed]), function(attr) {
            observeModelEvent(model, view, attr + 'Change', updateAttr);
        });
        updateAttr();
    });
}

var initializeVisible = function(view, $el, config, model, modelAttr) {
    if (config.visible == null) {
        return;
    }

    var visibleCb = function() {
        var visible = config.visible,
            visibleFn = config.visibleFn,
            val = getAttr(model, modelAttr, config, view),
            isVisible = !!val;

        if (Y.Lang.isFunction(visible) || Y.Lang.isString(visible)) {
            isVisible = applyViewFn(view, visible, val, config);
        }

        if (visibleFn) {
            applyViewFn(view, visibleFn, $el, isVisible, config);
        } else {
            if (isVisible) {
                $el.show();
            } else {
                $el.hide();
            }
        }
    };

    Y.Array.each(Y.Array.flatten([modelAttr]), function(attr) {
        observeModelEvent(model, view, attr + 'Change', visibleCb);
    });
    visibleCb();
};

var updateViewBindEl = function(view, $el, config, val, model, isInitializing) {
    if (!evaluateBoolean(view, config.updateView, val, config)) {
        return;
    }

    config.update.call(view, $el, val, model, config);

    if (!isInitializing) {
        applyViewFn(view, config.afterUpdate, $el, val, config);
    }
};

DataStick.addHandler([{
    selector: '[contenteditable="true"]',
    updateMethod: 'innerHTML',
    events: ['keyup', 'change', 'paste', 'cut']
}, {
    selector: 'input',
    events: ['keyup', 'change', 'paste', 'cut'],
    update: function($el, val) { $el.item(0).set('value', val); },
    getVal: function($el) {
        var val = $el.item(0).get('value');
        if ($el.item(0).test('[type="number"]')) {
            return val == null ? val : Number(val);
        } else {
            return val;
        }
    }
}, {
        selector: 'input[type="radio"]',
        events: ['change'],
        update: function($el, val) {
            $el.filter('[value="' + val + '"]').set('checked', true);
        },
        getVal: function($el) {
            return $el.filter(function(option) {
                return option.checked;
            }).item(0).get('value');
        }
    }, {
        selector: 'input[type="checkbox"]',
        events: ['change'],
        update: function($el, val, model, options) {
            if ($el.size() > 1) {
                Y.Array.each($el, function(el) {
                    if (Y.Array.indexOf(val, Y.one(el).get('value')) > -1) {
                        Y.one(el).set('checked', true);
                    } else {
                        Y.one(el).set('checked', false);
                    }
                });
            } else {
                if (Y.Lang.isBoolean(val)) {
                    $el.item(0).set('checked', val);
                } else {
                    $el.item(0).set('checked', val == $el.item(0).get('value'));
                }
            }
        },
        getVal: function($el) {
            var val;
            if ($el.size() > 1) {
                val = [];
                $el.each(function(node) {
                    if (node.get('checked')) {
                        val.push(node.get('value'));
                    }
                });
            } else {
                var node = $el.item(0), 
                    boxval;

                val = node.get('checked');
                boxval = node.get('value');

                if (boxval != 'on' && boxval != null) {
                    if (val) {
                        val = node.get('value');
                    } else {
                        val = null;
                    }
                }
            }
            return val;
        }
    }
]);

Y.namespace('DataBind').Stick = DataStick;


}, 'gallery-2013.10.09-22-56', {"requires": ["view"]});
