YUI.add('gallery-aui-state-interaction', function(A) {

var Lang = A.Lang,
	isBoolean = Lang.isBoolean,
	isString = Lang.isString,

	getClassName = A.ClassNameManager.getClassName,

	STATE = 'state',

	CSS_STATE_DEFAULT = getClassName(STATE, 'default'),
	CSS_STATE_HOVER = getClassName(STATE, 'hover'),
	CSS_STATE_ACTIVE = getClassName(STATE, 'active');

var StateInteraction = A.Component.create(
	{
		NAME: 'stateinteraction',
		NS: 'StateInteraction',

		ATTRS: {
			active: {
				value: false
			},

			activeState: {
				value: true,
				validator: isBoolean
			},

			bubbleTarget: {
				value: null
			},

			classNames: {
				value: {}
			},

			'default': {
				value: false
			},

			defaultState: {
				value: true,
				validator: isBoolean
			},

			hover: {
				value: false
			},

			hoverState: {
				value: true,
				validator: isBoolean
			},

			node: {
				value: null
			}
		},

		EXTENDS: A.Plugin.Base,

		constructor: function(config) {
			var host = config.host;
			var node = host;

			if (A.Widget && host instanceof A.Widget) {
				node = host.get('contentBox');
			}

			config.node = node;

			StateInteraction.superclass.constructor.apply(this, arguments);
		},

		prototype: {
			initializer: function() {
				var instance = this;

				var activeClass = instance.get('classNames.active');
				var defaultClass = instance.get('classNames.default');
				var hoverClass = instance.get('classNames.hover');

				instance._CSS_STATES = {
					active: isString(activeClass) ? activeClass : CSS_STATE_ACTIVE,
					'default': isString(defaultClass) ? defaultClass : CSS_STATE_DEFAULT,
					hover: isString(hoverClass) ? hoverClass : CSS_STATE_HOVER
				};

				if (instance.get('defaultState')) {
					instance.get('node').addClass(instance._CSS_STATES['default']);
				}

				instance._createEvents();

				instance._attachInteractionEvents();
			},

			_attachInteractionEvents: function() {
				var instance = this;

				var node = instance.get('node');

				node.on('click', instance._fireEvents, instance);

				node.on('mouseenter', A.rbind(instance._fireEvents, instance, 'mouseover'));
				node.on('mouseleave', A.rbind(instance._fireEvents, instance, 'mouseout'));

				instance.after('activeChange', instance._uiSetState);
				instance.after('hoverChange', instance._uiSetState);
				instance.after('defaultChange', instance._uiSetState);
			},

			_fireEvents: function(event, officialType) {
				var instance = this;

				var bubbleTarget = instance.get('bubbleTarget');

				officialType = officialType || event.type;

				if (bubbleTarget) {
					bubbleTarget.fire(officialType);
				}

				return instance.fire(officialType);
			},

			_createEvents: function() {
				var instance = this;

				var bubbleTarget = instance.get('bubbleTarget');

				if (bubbleTarget) {
					instance.addTarget(bubbleTarget);
				}

				instance.publish(
					'click',
					{
						defaultFn: instance._defClickFn,
						emitFacade: true
					}
				);

				instance.publish(
					'mouseout',
					{
						defaultFn: instance._defMouseOutFn,
						emitFacade: true
					}
				);

				instance.publish(
					'mouseover',
					{
						defaultFn: instance._defMouseOverFn,
						emitFacade: true
					}
				);
			},

			_defClickFn: function(event) {
				var instance = this;

				instance.set('active', !instance.get('active'));
			},

			_defMouseOutFn: function() {
				var instance = this;

				instance.set('hover', false);
			},

			_defMouseOverFn: function() {
				var instance = this;

				instance.set('hover', true);
			},

			_uiSetState: function(event) {
				var instance = this;

				var attrName = event.attrName;

				if (instance.get(attrName + 'State')) {
					var action = 'addClass';

					if (!event.newVal) {
						action = 'removeClass';
					}

					instance.get('node')[action](instance._CSS_STATES[attrName]);
				}
			}
		}
	}
);

A.namespace('Plugin').StateInteraction = StateInteraction;


}, 'gallery-2010.08.18-17-12' ,{skinnable:false, requires:['gallery-aui-base','plugin']});
