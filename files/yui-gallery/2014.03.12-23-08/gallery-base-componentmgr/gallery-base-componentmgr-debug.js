YUI.add('gallery-base-componentmgr', function(Y) {

	/*!
	 * Base Component Manager
	 * 
	 * Oddnut Software
	 * Copyright (c) 2010-2011 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var ComponentMgr,
		
		REQUIRES			= 'requires',
		INITIALIZER			= 'initializer',
		DESTRUCTOR			= 'destructor',
		INSTANCE			= 'instance',
		
		E_INIT_COMPONENT	= 'initComponent',
		E_INIT_COMPONENTS	= 'initComponents',
		E_DESTROY_COMPONENT	= 'destroyComponent',
		
		YLang				= Y.Lang,
		isArray				= YLang.isArray,
		isString			= YLang.isString,
		isObject			= YLang.isObject,
		isFunction			= YLang.isFunction,
		noop				= function(){};
		
	// *** Constructor *** //
	
	ComponentMgr = function () {
		
		Y.log('constructor callled', 'info', 'baseComponentMgr');
		this._initComponentMgr.apply(this, arguments);
	};
	
	// *** Static *** //
	
	ComponentMgr._COMPONENT_CFG = [REQUIRES, INITIALIZER, DESTRUCTOR, INSTANCE];
	
	// *** Prototype *** //
	
	ComponentMgr.prototype = {
		
		// *** Instance Members *** //
		
		_components : null,
		
		// *** Lifecycle Methods *** //
		
		_initComponentMgr : function () {
			
			// Holds the goods
			this._components = new Y.State();
			this._initComponentHierarchy();
			
			/**
			 * Fired right after init event to allow implementers to add components to be eagerly initialized.
			 * A <code>componentsToInit</code> array is passed to subscribers whom can push on components to be initialized,
			 * components can be referenced by string name or object reference.
			 * 
			 * @event initComponents
			 * @param event {Event} The event object for initComponents; has property: componentsToInit
			 */
			this.publish(E_INIT_COMPONENTS, {
				defaultFn	: this._defInitComponentsFn,
				fireOnce	: true
			});
			
			/**
			 * Fired when a component is going to be initialized.
			 * The <code>componentToInit</code> property is the String name of the component going to be initialized.
			 * Developers can listen to the 'on' moment to prevent the default action of initializing the component.
			 * Listening to the 'after' moment, a <code>component</code> property on the Event Object is the component instance.
			 * 
			 * @event initComponent
			 * @param event {Event} The event object for initComponent; has properties: componentToInit, component
			 */
			this.publish(E_INIT_COMPONENT, { defaultFn: this._defInitComponentFn });
			
			/**
			 * Fired when a component is going to be destroyed.
			 * The <code>component</code> property is the String name of the component going to be destroyed.
			 * Developers can listen to the 'on' moment to prevent the default action of destroying the component.
			 * 
			 * @event destroyComponent
			 * @param event {Event} The event object for destoryComponent; has properties: component
			 */
			this.publish(E_DESTROY_COMPONENT, { defaultFn: this._defDestoryComponentFn });
			
			// Fire initComponents during Y.Base initialization
			if (this.get('initialized')) {
				this.fire(E_INIT_COMPONENTS, { componentsToInit: [] });
			} else {
				this.after('initializedChange', function(e){
					this.fire(E_INIT_COMPONENTS, { componentsToInit: [] });
				});
			}
			
//			this.after('destroy', this._destroyComponents);
			Y.before(this._destroyComponents, this, '_destroyHierarchy', this);
		},
		
		// *** Public Methods *** //
		
		/**
		 * Adds a component to the Class.
		 * Components are added by giving an name and configuration.
		 * The Component Manager uses the requires and initializer function to create the component instance on demand.
		 * 
		 * @method addComponent
		 * @param name {String} name of the component to add
		 * @param config {Object} defining: {Array} requires, {function} initializer
		 * @return void
		 */
		addComponent : function (name, config) {
			
			if ( ! isString(name)) { return; }		// string name
			if ( ! isObject(config)) { return; }	// config object
			
			var components	= this._components,
				requires	= config.requires,
				initializer	= config.initializer,
				destructor	= config.destructor,
				instance	= config.instance;
				
			initializer	= isFunction(initializer) ? initializer :
						  isString(initializer) && isFunction(this[initializer]) ? this[initializer] : null;
						  
			destructor	= isFunction(destructor) ? destructor :
						  isString(destructor) && isFunction(this[destructor]) ? this[destructor] : null;
			
			components.add(name, REQUIRES, requires);
			components.add(name, INITIALIZER, initializer);
			components.add(name, DESTRUCTOR, destructor);
			components.add(name, INSTANCE, instance);
		},
				
		/**
		 * Retrieves component an instance by string name.
		 * The component must have previously been initialized otherwise null is returned.
		 * 
		 * @method getComponent
		 * @param component	{String} component to get instance of
		 * @return instance	{Object|undefined} the component instance if previously initialized, otherwise undefined
		 */
		getComponent : function (component) {
			
			Y.log('getComponent called', 'info', 'baseComponentMgr');
			return this._components.get(component, INSTANCE);
		},
		
		/**
		 * Destroys a component or set of components by string name.
		 * This will call the component???s configured destructor fn (preferred), or
		 * if the instance has a <code>destroy</code> method that will be used by convention.
		 * 
		 * @method destroyComponent
		 * @param component	{String | String... | Array} components to destroy
		 * @return void
		 */
		destroyComponent : function () {
			
			var args		= Y.Array(arguments, 0, true),
				components	= isArray(args[0]) ? args[0] : args;
			
			Y.log('destroyComponent called', 'info', 'baseComponentMgr');
			Y.Array.each(components, function(c){
				if (this._components.get(c, INSTANCE)) {
					this._destroyComponent(c);
				}
			}, this);
		},
		
		/**
		 * Supplies the callback with component instance(s) that were requested by string name,
		 * any non-initialized components will be initialized.
		 * Component instance(s) will be passed to the callback as arguments in the order requested.
		 * 
		 * @method useComponent
		 * @param component* {String} 1-n components to use and/or create instances of
		 * @param *callback {function} callback to pass component instances to
		 * @return void
		 */
		useComponent : function () {
			
			Y.log('useComponent called', 'info', 'baseComponentMgr');
			
			var args		= Y.Array(arguments, 0, true),
				callback	= isFunction(args[args.length-1]) ? args[args.length-1] : noop,	// last param or noop
				components	= callback === noop ? args : args.slice(0, -1),					// if callback is noop then all params, otherwise all but last params
				instances	= [],
				initialized;
			
			if (components.length < 1) {
				Y.log('getComponent: no components, returning', 'info', 'baseComponentMgr');
				callback.call(this);
				return;
			}
			
			initialized = Y.Array.partition(components, function(c){
				var instance = this.getComponent(c);
				instances.push(instance);
				return instance;
			}, this);
			
			if (initialized.rejects.length > 0) {
				Y.log('getComponent: components require initialization', 'info', 'baseComponentMgr');
				Y.use.apply(Y, this._getRequires(initialized.rejects).concat(Y.bind(function(Y){
					Y.log('getComponent: required modules loaded', 'info', 'baseComponentMgr');
					var instances = [];
					Y.Array.each(initialized.rejects, this._initComponent, this);
					Y.Array.each(components, function(c){
						instances.push(this.getComponent(c));
					}, this);
					callback.apply(this, instances);
				}, this)));
			} else {
				callback.apply(this, instances);
			}
		},
		
		// *** Private Methods *** //
		
		_initComponentHierarchy : function () {
			
			var classes					= this._getClasses(),
				components				= {},
				componentConfigProps	= ComponentMgr._COMPONENT_CFG,
				i, mergeComponentConfigs;
			
			// Loop over the Class Hierarchy, aggregating the Component configs
				
			mergeComponentConfigs = function (config, name) {
				
				if ( ! components[name]) {
					components[name] = Y.mix({}, config, true, componentConfigProps);
				} else {
					Y.mix(components[name], config, true, componentConfigProps);
				}
			};
			
			for (i = classes.length-1; i >= 0; i--) {
				Y.Object.each(classes[i].COMPONENTS, mergeComponentConfigs);
			}
			
			// Add the components defined in the static COMPONENTS object
			Y.Object.each(components, function(config, name){
				this.addComponent(name, config);
			}, this);
		},
		
		_getRequires : function (components) {
			
			components = isArray(components) ? components : [components];
			var requires = [];
			
			Y.Array.each(components, function(c){
				requires = requires.concat(this._components.get(c, REQUIRES) || []);
			}, this);
			
			return Y.Array.unique(requires);
		},
		
		_initComponent : function (c) {
			
			this.fire(E_INIT_COMPONENT, { componentToInit: c });
		},
		
		_destroyComponent : function (c) {
			
			this.fire(E_DESTROY_COMPONENT, { component: c });
		},
		
		_destroyComponents : function () {
			
			var instances = this._components.data[INSTANCE];
			
			Y.each(instances, function(instance, component){
				if (instance) {
					this._destroyComponent(component);
				}
			}, this);
		},
		
		_defInitComponentsFn : function (e) {
			
			var components	= e.componentsToInit,
			requires	= this._getRequires(components);
			
			Y.use.apply(Y, requires.concat(Y.bind(function(Y){
				Y.Array.each(components, this._initComponent, this);
			}, this)));
		},
		
		_defInitComponentFn : function (e) {
			
			var components	= this._components,
				component	= e.componentToInit,
				initializer	= components.get(component, INITIALIZER),
				instance	= components.get(component, INSTANCE);
			
			if ( ! instance && isFunction(initializer)) {
				instance = initializer.call(this);
				// Add us as an event bubble target for the instance
				if (instance._yuievt && isFunction(instance.addTarget)) {
					instance.addTarget(this);
				}
				components.add(component, INSTANCE, instance);
			}
			
			e.component = instance;
		},
		
		_defDestoryComponentFn : function (e) {
			
			var components	= this._components,
				component	= e.component,
				destructor	= components.get(component, DESTRUCTOR),
				instance	= components.get(component, INSTANCE);
			
			if ( ! instance ) { return; }
			
			// removes us as an event bubble target for the instance
			if (instance._yuievt && isFunction(instance.removeTarget)) {
				instance.removeTarget(this);
			}
			
			// prefer the configured destructor fn, or use use destroy instance method by convention
			if (isFunction(destructor)) {
				destructor.call(this, instance);
			} else if (isFunction(instance.destroy)) {
				instance.destroy();
			}
			
			components.remove(component, INSTANCE);
		}
		
	};
	
	/**
	 * Alias for useComponent
	 * 
	 * @method use
	 * @alias useComponent
	 */
	ComponentMgr.prototype.use = ComponentMgr.prototype.useComponent;
	
	// *** Namespace *** //
	
	Y.BaseComponentMgr = ComponentMgr;


}, 'gallery-2011.05.04-20-03' ,{requires:['base-base', 'collection']});
