/*global jsontemplate:false */

if (typeof obviel === "undefined") {
    var obviel = {};
}

if (typeof console === "undefined") {
    var console = {
        log: function(text) {
        }
    };
}

(function($) {
    // a fallback i18n module that doesn't do any translation.
    // this way we can use obviel with the obviel i18n API without
    // actually having to load obviel-i18n.js. of course it won't
    // do any translations in that case either, but one can't have everything

    // XXX fake Gettext.strargs in fake obviel i18n?
    
    if (typeof obviel.i18n !== 'undefined') {
        return;
    }
    obviel.i18n = {};
    var module = obviel.i18n;
    module.translationSource = function(data) {
        return null;
    };
    module.translationSourceFromJsonUrl = function(url) {
        return null;
    };
    module.emptyTranslationSource = function() {
        return null;
    };
    module.registerTranslation = function(locale, translationSource, domain) {
    };
    module.clearTranslations = function() {
    };
    module.clearLocale = function() {
    };
    module.setLocale = function(locale) {
        var defer = $.Deferred();
        defer.resolve();
        return defer.promise();
    };
    module.getLocale = function() {
        return null;
    };
    module.getTranslation = function() {
        return null;
    };
    module.getTemplateDomain = function() {
        return 'default';
    };
    module.getTranslationFunc = function(domain) {
        return function(msgid) {
            return msgid;
        };
    };
    module.translate = function(domain) {
        return module.getTranslationFunc(domain);
    };
    module.getPluralTranslationFunc = function(domain) {
        return function(msgid, pluralMsgid, count) {
            if (count === 1) {
                return msgid;
            }
            return pluralMsgid;
        };
    };
    module.pluralize = function(domain) {
        return module.getPluralTranslationFunc(domain);
    };
    module.load = function() {
        var defer = $.Deferred();
        defer.resolve();
        return defer.promise();
    };
    // alias
    if (typeof obviel.template !== 'undefined') {
        module.variables = obviel.template.variables;
    }
}(jQuery));

(function($, module) {
    var _ifaces = {
        'base': []
    };

    module.clearIface = function() {
        _ifaces = {
            'base': []
        };
    };
    
    module.IfaceError = function(message) {
        this.name = 'IfaceError';
        this.message = message;
    };

    module.IfaceError.prototype = new Error();
    module.IfaceError.prototype.constructor = module.IfaceError;
    
    module.IfaceError.prototype.toString = function() {
        return this.message;
    };
    
    module.LookupError = function(obj, viewName) {
        this.name = 'LookupError';
        this.obj = obj;
        this.viewName = viewName;
        var ifaces = module.ifaces(this.obj);
        this.message = ("view lookup error for ifaces [" + ifaces.join(', ') +
                        "] and name '" + this.viewName + "'");
    };

    module.LookupError.prototype = new Error();
    module.LookupError.prototype.constructor = module.LookupError;
    
    module.LookupError.prototype.toString = function() {
        return "LookupError: " + this.message;
    };
    
    module.CompilerError = function(message) {
        this.name = 'CompilerError';
        this.message = message;
    };

    module.CompilerError.prototype = new Error();
    module.CompilerError.prototype.constructor = module.CompilerError;
    
    module.CompilerError.prototype.toString = function() {
        return "CompilerError: " + this.message;
    };
    
    /**
     * Register an interface (iface)
     * @param name: interface name (string)
     *
     * register an iface with name 'name' (string), if other arguments
     * are passed to this function, consider the rest base ifaces
     * (supers) that this iface extends.
     *
     * ifaces are just strings, used as markers
     *
     * note that registered ifaces automatically always
     * extend the iface 'base'
     */
    module.iface = function(name) {
        if (_ifaces[name]) {
            throw new module.IfaceError("duplicate iface: " + name);
        }
        var bases = [];
        var i;
        if (arguments.length > 1) {
            for (i=arguments.length; i > 1; i--) {
                bases.unshift(arguments[i-1]);
            }
        } else {
            bases = ['base'];
        }

        for (i=0; i < bases.length; i++) {
            var basebases = _ifaces[bases[i]];
            if (basebases === undefined) {
                throw new module.IfaceError('while registering iface ' +
                                            name + ': ' +
                                            'base iface ' + bases[i] +
                                            ' not found!');
            }
        }

        _ifaces[name] = bases;
    };
    
    /**
     * Returns true if obj implements iface.
     * @param base: the iface to check
     */
    module.provides = function(obj, base) {
        var ifaces = module.ifaces(obj);
        for (var i=0; i < ifaces.length; i++) {
            if (ifaces[i] === base) {
                return true;
            }
        }
        return false;
    };

    /* Register a new base for an interface.
     * @param name: an iface (string)
     * @param base: base iface (string)
     */
    module.extendsIface = function(name, base) {
        var basebases = _ifaces[base];
        if (basebases === undefined) {
            throw new module.IfaceError('unknown iface: ' + base);
        }
        if (_ifaces[name] === undefined) {
            throw new module.IfaceError('unknown iface: ' + name);
        }
        for (var i=0; i < basebases.length; i++) {
            if (basebases[i] === name) {
                throw new module.IfaceError('iface ' + name +
                                            ' cannot depend on itself');
            }
        }
        _ifaces[name].push(base);
    };

    /**
     * Return the interfaces of an obj, breadth first.
     * @param obj: the object
     *
     * The object can have an ifaces attributes. If not,
     * the JS type of the object is returned.
     */
    module.ifaces = function(obj) {
        /* return the interfaces of an obj, breadth first
        */
        /* either get iface or ifaces, but not both */
        var ifaces = [];
        if (obj.iface !== undefined) {
            ifaces.push(obj.iface);
        }
        if (obj.ifaces !== undefined) {
            // if we already have ifaces, report error
            if (ifaces.length !== 0) {
                throw new module.IfaceError(
                    "object has both ifaces as well as iface property");
            }
            // a string instead of an array for ifaces will also work,
            // as it's added by concat too
            ifaces = ifaces.concat(obj.ifaces);
        }
        if (ifaces.length === 0) {
            return [typeof obj];
        }
        var ret = [];
        var bases = [].concat(ifaces);
        while (bases.length) {
            var base = bases.shift();
            if (base === 'base') {
                continue;
            }
            var duplicate = false;
            for (var i=0; i < ret.length; i++) {
                if (base === ret[i]) {
                    duplicate = true;
                    break;
                }
            }
            if (duplicate) {
                continue;
            }
            ret.push(base);
            var basebases = _ifaces[base];
            if (basebases) {
                // XXX should we warn/error on unknown interfaces?
                bases = bases.concat(basebases);
            }
        }
        // XXX hrmph, dealing with base here to avoid having it in the list
        // too early... does that make sense?
        ret.push('base');
        ret.push(typeof obj);
        return ret;
    };

    module.View = function(settings) {
        settings = settings || {};
        var d = {
            name: 'default',
            iface: 'object',
            subviews: {},
            events: {},
            objectEvents: {},
            domain: obviel.i18n.getTemplateDomain()
        };
        $.extend(d, settings);
        $.extend(this, d);
    };

    module.View.prototype.init = function() {
    };

    module.View.prototype.clone = function(settings) {
        // prototypical inheritance
        var F = function() {};
        F.prototype = this;
        var clone = new F();
        $.extend(clone, settings);
        clone.init();
        return clone;
    };
    
    module.View.prototype.cleanup = function() {
    };

    module.View.prototype.render = function() {
    };

    module.View.prototype.doCleanup = function() {
        var self = this;
        self.el.data('obviel.renderedView', null);
        self.el.unbind('render.obviel');
        
        self.unbindEvents();
        self.unbindObjectEvents();

        self.cleanup();
    };

    module.View.prototype.before = function() {
        // a noop, but can be overridden to manipulate obj
    };
    
    module.View.prototype.doRender = function() {
        var self = this;
        // run cleanup for any previous view if this view isn't ephemeral
        if (!self.ephemeral) {
            var previousView = self.el.data('obviel.renderedView');
            if (previousView) {
                previousView.doCleanup();
            }
        }

        self.before();

        module.compilers.render(self).done(function() {
            var renderPromise = self.render();
            // pretend we have a resolved render promise if we don't
            // get one from render
            if (renderPromise === undefined) {
                renderPromise = $.Deferred();
                renderPromise.resolve();
            }

            renderPromise.done(function() {
                var subviewsPromise = self.renderSubviews();
                
                subviewsPromise.done(function() {
                    self.bindEvents();
                    self.bindObjectEvents();
                    
                    self.finalize();
                    self.defer.resolve(self);
                });
            });
        });
    };
    
    module.View.prototype.getHandler = function(name) {
        var self = this;
        var f = this[name];
        
        if (f === undefined) {
            return null;
        }
        
        return function(ev) {
            ev.view = self;
            ev.args = Array.prototype.slice.call(arguments, 1);
            f.call(self, ev);
            self.registry.eventHook();
        };
    };

    module.View.prototype.getMethodByName = function(name) {
        var self = this;
        var f = this[name];
        if (f === undefined) {
            return null;
        }
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return f.apply(self, args);
        };
    };
    
    module.View.prototype.wrapHandler = function(handler) {
        var self = this;
        var wrappedHandler = null;
        
        if (typeof handler === 'string') {
            wrappedHandler = function(ev) {
                ev.view = self;
                ev.args = Array.prototype.slice.call(arguments, 1);
                self[handler].call(self, ev);
            };
        } else {
            wrappedHandler = function(ev) {
                ev.view = self;
                ev.args = Array.prototype.slice.call(arguments, 1);
                handler(ev);
            };
        }

        return wrappedHandler;
    };

    module.View.prototype.bindEvents = function() {
        var self = this;
        self.boundHandlers = [];
        $.each(self.events, function(eventName, events) {
            $.each(events, function(selector, handler) {
                var el = $(selector, self.el);
                var wrappedHandler = self.wrapHandler(handler);
                el.bind(eventName, wrappedHandler);
                self.boundHandlers.push({
                    name: eventName,
                    selector: selector,
                    handler: wrappedHandler
                });
            });
        });
    };
    
    module.View.prototype.unbindEvents = function() {
        var self = this;
        if (self.boundHandlers === undefined) {
            return;
        }
        $.each(self.boundHandlers, function(index, eventInfo) {
            var el = $(eventInfo.selector, self.el);
            el.unbind(eventInfo.name, eventInfo.handler);
        });
    };
    
    module.View.prototype.bindObjectEvents = function() {
        var self = this;
        self.boundObjectHandlers = [];
        $.each(self.objectEvents, function(eventName, handler) {
            var wrappedHandler = self.wrapHandler(handler);

            $(self.obj).bind(eventName, wrappedHandler);

            self.boundObjectHandlers.push({
                name: eventName,
                handler: wrappedHandler
            });
        });
    };
    
    module.View.prototype.unbindObjectEvents = function() {
        var self = this;
        if (self.boundObjectHandlers === undefined) {
            return;
        }
        $.each(self.boundObjectHandlers, function(index, eventInfo) {
            $(self.obj).unbind(eventInfo.name, eventInfo.handler);
        });
    };

    module.View.prototype.finalize = function() {
        var self = this;
        self.storeView();
        var ev = $.Event('render-done.obviel');
        ev.view = self;
        self.el.trigger(ev);
    };
    
    module.View.prototype.renderSubviews = function() {
        var self = this;
        var promises = [];
        
        $.each(self.subviews, function(selector, attr) {
            var el = $(selector, self.el);
            var name = 'default';
            if ($.isArray(attr)) {
                name = attr[1];
                attr = attr[0];
            }
            var obj = self.obj[attr];
            if ((obj === undefined) || !obj) {
                return;
            }
            var promise = self.registry.render(el, obj, name);
            promises.push(promise);
        });

        // this is how to pass an array to $.when!
        return $.when.apply(null, promises);
    };

    module.View.prototype.rerender = function() {
        this.el.render(this.obj, this.name);
    };
    
    module.View.prototype.storeView = function() {
        var self = this;
        if (self.ephemeral) {
            return;
        }
        // attach rendered view to element if not ephemeral
        self.el.data('obviel.renderedView', self);
        // event handler here to render it next time
        self.el.bind(
            'render.obviel',
            function(ev) {
                var view = ev.view;
                // only render view if a previous view here worked
                // for that iface
                var el = $(this);
                var previousView = el.data('obviel.renderedView');
                if ((view.iface !== previousView.iface) ||
                    (view.name !== previousView.name)) {
                    return;
                }
                // the el with which we get called gets replaced
                // by this one, where the view is actually rendered
                view.el = el;
                ev.renderHandled = true;
                view.doRender();
                ev.stopPropagation();
                ev.preventDefault();
                el.unbind(ev);
            }
        );
    };

    module.View.prototype.location = function() {
        var result = this.iface;
        if (this.name !== 'default') {
            result += '|' + this.name;
        }
        return result;
    };
    
    /* a tranformer that doesn't do anything */
    var nullTransformer = function(obj, url, name) {
        return obj;
    };

    var nullEventHook = function() {
    };
    
    module.Registry = function() {
        this.views = {};
        /* the default transformer doesn't do anything */
        this.transformerHook = nullTransformer;
        this.eventHook = nullEventHook;
    };

    module.Registry.prototype.register = function(view) {
        if (!(view instanceof module.View)) {
            view = new module.View(view);
        }
        if (!this.views[view.iface]) {
            this.views[view.iface] = {};
        }
        this.views[view.iface][view.name] = view;
    };

    module.Registry.prototype.lookup = function(obj, name) {
        var ifaces = module.ifaces(obj);
        
        for (var i=0; i < ifaces.length; i++) {
            var matchingViews = this.views[ifaces[i]];
            if (matchingViews) {
                var view = matchingViews[name];
                if (view) {
                    return view;
                }
            }
        }
        return null;
    };

    module.Registry.prototype.cloneView = function(el, obj, name, defer) {
        name = name || 'default';
        var viewPrototype = this.lookup(obj, name);
        if (viewPrototype === null) {
            throw new module.LookupError(obj, name);
        }
        return viewPrototype.clone({
            el: el,
            obj: obj,
            registry: this,
            defer: defer
        });
    };

    module.Registry.prototype.triggerRender = function(view) {
        var ev = $.Event('render.obviel');
        ev.view = view; // XXX can we add our own attributes to event objects?
        view.el.trigger(ev);
        // renderHandled is a hack to make sure that we handle render
        // events globally if we are dealing with an unattached element
        // in jQuery 1.6.4 events would fall back to $(document) level handlers
        // no matter what, but in jQuery 1.7 and later this would not
        // happen anymore
        // for unattached elements, only for attached ones
        // XXX I wish there were a way to register an event handler globally no
        // matter what. see: http://bugs.jquery.com/ticket/11891
        if (!ev.renderHandled) {
            $(document).trigger(ev);
            ev.renderHandled = false;
        }
    };

    module.Registry.prototype.render = function(el, obj, name) {
        var self = this;
        var url = null;
        if (typeof obj === 'string') {
            url = obj;
        }
        var promise;
        var defer = $.Deferred();
        if (url !== null) {
            promise = self.viewForUrl(el, url, name, defer);
        } else {
            promise = self.viewForObj(el, obj, name, defer);
        }
        
        promise.done(function(view) {
            self.triggerRender(view);
        });
        return defer.promise();
    };
    
    module.Registry.prototype.viewForObj = function(el, obj, name, viewDefer) {
        var defer = $.Deferred();
        var view = this.cloneView(el, obj, name, viewDefer);
        defer.resolve(view);
        return defer.promise();
    };
    
    module.Registry.prototype.viewForUrl = function(el, url, name, defer) {
        var self = this;
        return $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json'
        }).pipe(function(obj) {
            obj = self.transformerHook(obj, url, name);
            var view = self.cloneView(el, obj, name, defer);
            view.fromUrl = url;
            return view;
        });
    };
    
    module.Registry.prototype.registerTransformer = function(transformer) {
        if (transformer === null || transformer === undefined) {
            transformer = nullTransformer;
        }
        this.transformerHook = transformer;
    };

    module.Registry.prototype.registerEventHook = function(eventHook) {
        if (eventHook === null || eventHook === undefined) {
            eventHook = nullEventHook;
        }
        this.eventHook = eventHook;
    };
    
    module.registry = new module.Registry();

    module.clearRegistry = function() {
        module.registry = new module.Registry();
    };

    module.renderTemplate = function(view) {
    };
    
    module.CachedTemplates = function() {
        this.cached = {};
    };
    
    module.CachedTemplates.prototype.register = function(key, template) {
        this.cached[key] = template;
    };

    module.CachedTemplates.prototype.clear = function() {
        this.cached = {};
    };
    
    module.CachedTemplates.prototype.get = function(key) {
        var template = this.cached[key];
        if (template === undefined) {
            return null;
        }
        return template;
    };
    
    module.cachedTemplates = new module.CachedTemplates();

    module.clearTemplateCache = function() {
        module.cachedTemplates.clear();
    };
    
    module.SourceLoaderError = function(text) {
        this.name = 'SourceLoaderError';
        this.text = text;
        this.message = this.toString();
    };

    module.SourceLoaderError.toString = function() {
        return "could not load source: " + this.text;
    };
    
    module.InlineSourceLoader = function(compilerIdentifier, source) {
        this.compilerIdentifier = compilerIdentifier;
        this.source = source;
        this.type = 'inline';
    };

    module.InlineSourceLoader.prototype.key = function() {
        return (this.type + '_' +
                this.compilerIdentifier + '_' +
                this.source);
    };

    module.InlineSourceLoader.prototype.location = function() {
        return this.compilerIdentifier;
    };
    
    module.InlineSourceLoader.prototype.load = function() {
        var defer = $.Deferred();
        defer.resolve(this.source);
        return defer.promise();
    };
    
    module.ScriptSourceLoader = function(compilerIdentifier, scriptId) {
        this.compilerIdentifier = compilerIdentifier;
        this.scriptId = scriptId;
        this.type = 'script';
    };

    module.ScriptSourceLoader.prototype.key = function() {
        return (this.type + '_' +
                this.compilerIdentifier + '_' +
                this.scriptId);
    };

    module.ScriptSourceLoader.prototype.location = function() {
        return (this.compilerIdentifier + "Script:" +
                this.scriptId);
    };

    module.ScriptSourceLoader.prototype.load = function() {
        var defer = $.Deferred();
        var scriptEl = $('#' + this.scriptId);
        if (scriptEl.length === 0) {
            throw new module.SourceLoaderError(
                "no script element found with id: " + this.scriptId);
        }
        if (scriptEl.length > 1) {
            throw new module.SourceLoaderError(
                "too many script elements found with id: " + this.scriptId);
        }
        defer.resolve(scriptEl.html());
        return defer.promise();
    };
    
    module.UrlSourceLoader = function(compilerIdentifier, url) {
        this.compilerIdentifier = compilerIdentifier;
        this.url = url;
        this.type = 'url';
    };
    
    module.UrlSourceLoader.prototype.key = function() {
        return (this.type + '_' +
                this.compilerIdentifier + '_' +
                this.url);
    };

    module.UrlSourceLoader.prototype.location = function() {
        return (this.compilerIdentifier + "Url:" + this.url);
    };

    module.UrlSourceLoader.prototype.load = function() {
        return $.ajax({
            type: 'GET',
            url: this.url,
            dataType: 'text'
        }).fail(function(jqXHR, errorType, exc) {
            throw new module.SourceLoaderError(
                "could not load url: " + this.url);
        });
    };
    
    module.Compilers = function() {
        this.compilers = {};
    };

    module.Compilers.prototype.register = function(identifier, compiler) {
        this.compilers[identifier] = compiler;
    };
    
    module.Compilers.prototype.getLoaderForCompiler = function(
        identifier, obj) {
        var source = obj[identifier];
        if (source !== undefined) {
            return new module.InlineSourceLoader(identifier, source);
        }
        var sourceScript = obj[identifier + 'Script'];
        if (sourceScript !== undefined) {
            return new module.ScriptSourceLoader(identifier, sourceScript);
        }
        var sourceUrl = obj[identifier + 'Url'];
        if (sourceUrl !== undefined) {
            return new module.UrlSourceLoader(identifier, sourceUrl);
        }
        return null;
    };

    module.Compilers.prototype.getLoader = function(view) {
        var compiler, loader;
        for (var identifier in this.compilers) {
            compiler = this.compilers[identifier];
            loader = this.getLoaderForCompiler(identifier, view.obj);
            if (loader !== null) {
                return loader;
            }
            loader = this.getLoaderForCompiler(identifier, view);
            if (loader !== null) {
                return loader;
            }
        }
        return null;
    };

    module.Compilers.prototype.compile = function(loader, view) {
        var self = this;
        var defer = $.Deferred();
        loader.load().done(function(source) {
            var location = view.location() + ' ' + loader.location();
            var compiler = self.compilers[loader.compilerIdentifier];
            var template = compiler.compile(location, source);
            defer.resolve(template);
        });
        return defer.promise();
    };

    module.Compilers.prototype.render = function(view) {
        var template;
        
        // get template loader
        var loader = this.getLoader(view);
        // no template to load, so nothing to do
        if (loader === null) {
            var defer = $.Deferred();
            defer.resolve();
            return defer.promise();
        }
        // special shortcut for inline html, no need to cache this
        if (loader.compilerIdentifier === 'html' &&
            loader.type === 'inline') {
            template = new module.HtmlTemplate(loader.location(),
                                               loader.source);
            return template.render(view);
        }
        var key = loader.key();
        // see whether we have a cached template for loader, use it if so
        template = module.cachedTemplates.get(key);
        if (template !== null) {
            return template.render(view);
        }
        // otherwise compile source indicated by loader, and render
        return this.compile(loader, view).pipe(function(template) {
            module.cachedTemplates.register(key, template);
            return template.render(view);
        });
    };
    
    module.HtmlCompiler = function() {
    };
    
    module.HtmlCompiler.prototype.compile = function(location, source) {
        return new module.HtmlTemplate(location, source);
    };
    
    module.HtmlTemplate = function(location, source) {
        this.location = location;
        this.source = source;
    };

    module.HtmlTemplate.prototype.render = function(view) {
        var defer = $.Deferred();
        view.el.html(this.source);
        defer.resolve();
        return defer.promise();
    };
    
    module.ObvielTemplateCompiler = function() {
    };

    var exceptionInfo = function(location, e) {
        return (e.toString() + " (" + location + ' ' +
                obviel.template.getXpath(e.el) + ')');
    };
    
    module.ObvielTemplateCompiler.prototype.compile = function(location, source) {
        try {
            return new module.ObvielTemplate(location, source);
        } catch (e) {
            var text = exceptionInfo(location, e);
            console.log("obvt compiler error: " + text);
            throw new obviel.template.CompilationError(e.el, text);
        }
    };
    
    module.ObvielTemplate = function(location, source) {
        this.location = location;
        this.compiled = new obviel.template.Template(source);
    };
    
    module.ObvielTemplate.prototype.render = function(view) {
        var context = {
            getHandler: function(name) {
                return view.getHandler(name);
            },
            getFormatter: function(name) {
                var formatter = view.getMethodByName(name);
                if (!formatter) {
                    formatter = obviel.template.getFormatter(name);
                }
                return formatter;
            },
            getFunc: function(name) {
                var func = view.getMethodByName(name);
                if (!func) {
                    func = obviel.template.getFunc(name);
                }
                return func;
            },
            getTranslation: obviel.i18n.getTranslationFunc(view.domain),
            getPluralTranslation: obviel.i18n.getPluralTranslationFunc(
                view.domain)
        };
        try {
            return this.compiled.render(view.el, view.obj, context);
        } catch (e) {
            var text = exceptionInfo(this.location, e);
            console.log("obvt render error: " + text);
            throw new obviel.template.RenderError(e.el, text);
        }
    };
    
    module.JsontCompiler = function() {
    };

    module.JsontCompiler.prototype.compile = function(location, source) {
        return new module.JsontTemplate(location, source);
    };

    module.JsontTemplate = function(location, source) {
        this.location = location;
        this.compiled = new jsontemplate.fromString(source);
    };

    module.JsontTemplate.prototype.render = function(view) {
        var defer = $.Deferred();
        view.el.html(this.compiled.expand(view.obj));
        defer.resolve();
        return defer.promise();
    };
    
    module.FailingCompiler = function(name) {
        this.name = name;
    };

    module.FailingCompiler.prototype.compile = function(source) {
        throw new module.CompilerError("compiler not installed for: " +
                                       this.name);
    };

    module.compilers = new module.Compilers();
    
    module.compilers.register('html', new module.HtmlCompiler());
    
    if (typeof jsontemplate !== "undefined") {
        module.compilers.register('jsont', new module.JsontCompiler());
    } else {
        module.compilers.register('jsont', new module.FailingCompiler('jsont'));
    }
    if (obviel.template !== undefined) {
        module.compilers.register('obvt', new module.ObvielTemplateCompiler());
    } else {
        module.compilers.register('obvt', new module.FailingCompiler('obvt'));
    }
    
    module.view = function(view) {
        module.registry.register(view);
    };

    module.transformer = function(transformer) {
        module.registry.registerTransformer(transformer);
    };

    module.eventHook = function(eventHook) {
        module.registry.registerEventHook(eventHook);
    };
    
    $.fn.render = function(obj, name) {
        // if we have no name argument, we set it to default
        if (name === undefined) {
            name = 'default';
        }
        var el = $(this);
        return module.registry.render(el, obj, name);
    };

    $.fn.rerender = function() {
        var el = $(this),
            previousView = el.view(),
            defer;
        if (!previousView) {
            defer = $.Deferred();
            defer.resolve(null);
            return defer.promise();
        }

        var obj = null;
        if (previousView.fromUrl) {
            obj = previousView.fromUrl;
        } else {
            obj = previousView.obj;
        }
        
        return previousView.registry.render(el, obj, previousView.name);
    };
    
    $.fn.view = function() {
        var el = $(this);
        return el.data('obviel.renderedView');
    };

    $.fn.parentView = function() {
        var el = $(this);
        var view = null;
        while (el.length > 0) {
            view = el.data('obviel.renderedView');
            if (view) {
                return view;
            }
            el = el.parent();
        }
        return null;
    };
    
    $.fn.unview = function() {
        var view = $(this).view();
        if (view) {
            view.doCleanup();
        }
    };

    $(document).on(
        'render.obviel',
        function(ev) {
            ev.renderHandled = true;
            ev.view.doRender($(ev.target));
            ev.stopPropagation();
            ev.preventDefault();
        }
    );

}(jQuery, obviel));
