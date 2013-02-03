define([
	'jquery',
	'aloha/core',
	'ui/surface',
	'ui/tab',
	'ui/floating',
	'ui/context',
	'i18n!ui/nls/i18n',
	'jqueryui'
], function (
	$,
	Aloha,
	Surface,
	Tab,
	floating,
	Context,
	i18n
) {
	

	/**
	 * The toolbar is configured via `settings.toolbar` and is defined as an
	 * array of tabs with component groups, where the groups are arrays of
	 * controls.
	 *
	 * There are separate components for each context, but only the components
	 * for the active context are shown.
	 *
	 * As a container for tabs, the toolbar serves to group together groups of
	 * control components so that they can be shown and hidden together in
	 * their feature/functional set.  For exmaple groups of table controls
	 * would be placed in a table tab, groups of list controls in an image tab,
	 * and so forth.
	 *
	 * Toolbar class and manager
	 *
	 * @class
	 * @extends {Surface}
	 */
	var Toolbar = Surface.extend({

		_moveTimeout: null,
		$_container: null,
		_tabBySlot: null,
		_tabs: [],

		/**
		 * Toolbar constructor.
		 *
		 * @param {!Array.<(Object|Array|string)>} tabs
		 * @constructor
		 * @override
		 */
		_constructor: function(context, tabs) {
			var tabSettings,
			    tabInstance,
			    i, key;

			this._super(context);
			this.$element = $('<div>', {'class': 'aloha-ui-toolbar', 'unselectable': 'on'});
			this.$_container = Tab.createContainer().appendTo(this.$element);
			this._tabBySlot = {};

			for (i = 0; i < tabs.length; i++) {
				tabSettings = tabs[i];

				tabInstance = new Tab(context, {
					label: i18n.t(tabSettings.label, ''),
					showOn: tabSettings.showOn,
					container: this.$_container
				}, tabSettings.components);

				for (key in tabInstance._elemBySlot) {
					if (tabInstance._elemBySlot.hasOwnProperty(key)) {
						this._tabBySlot[key] = tabInstance;
					}
				}

				this._tabs.push({tab: tabInstance, settings: tabSettings});
			}

			// Pinning behaviour is global in that if one toolbar is pinned,
			// then all other toolbars will be pinned to that position.
			floating.makeFloating(this, Toolbar);
		},

		adoptInto: function(slot, component){
			var tab = this._tabBySlot[slot];
			return tab && tab.adoptInto(slot, component);
		},

		getActiveContainer: function () {
			return this.$_container.data('aloha-active-container');
		},

		getContainers: function () {
			return this.$_container.data('aloha-tabs');
		},

		_move: function (duration) {
			// We need to order the invocation of the floating animation to
			// occur after a sequence point so that the element's height will
			// be correct.
			var that = this;
			if (this._moveTimeout) {
				clearTimeout(this._moveTimeout);
			}
			this._moveTimeout = setTimeout(function () {
				that._moveTimeout = null;
				if (Aloha.activeEditable && Toolbar.isFloatingMode) {
					that.$element.stop();
					floating.floatSurface(that, Aloha.activeEditable, duration,
						function (position) {
							Toolbar.setFloatingPosition(position);
						});
				}
				// 20ms should be small enough to be near instant to
				// the user but large enough to avoid doing unnecessary
				// work when selection changes multiple times during a
				// short time frame.
			}, 20);
		},

		addPin: function () {
			var $pin = $('<div class="aloha-ui-pin">');
			var $element = this.$element;

			$element.find('.ui-tabs').append($pin);
			$element.find('.ui-tabs').hover(function () {
				$element.addClass('aloha-ui-hover');
			}, function () {
				$element.removeClass('aloha-ui-hover');
			});

			if (!Toolbar.isFloatingMode) {
				$pin.addClass('aloha-ui-pin-down');
			}

			var surface = this;

			$pin.click(function () {
				Toolbar.isFloatingMode = !Toolbar.isFloatingMode;

				var position;

				if (Toolbar.isFloatingMode) {
					position = {
						top: Toolbar.pinTop,
						left: Toolbar.pinLeft
					};
				} else {
					position = surface.$element.offset();
					position.top -= $(window).scrollTop();
				}

				Toolbar.setFloatingPosition(position);

				floating.togglePinSurface(surface, position, Toolbar.isFloatingMode);
			});
		},

		/**
		 * Shows the toolbar.
		 */
		show: function () {
			Toolbar.$surfaceContainer.children().detach();
			Toolbar.$surfaceContainer.append(this.$element);
			Toolbar.$surfaceContainer.stop().fadeTo(200, 1);

			var position = Toolbar.getFloatingPosition();

			this.$element.stop().css({
				top: position.top,
				left: position.left
			});

			this._move();
		},

		/**
		 * Hides the toolbar.
		 */
		hide: function () {
			Toolbar.$surfaceContainer.stop().fadeOut(200, function () {
				Toolbar.$surfaceContainer.children().detach();
			});
		}
	});

	$.extend(Toolbar, {

		/**
		 * An element on which all toolbar surfaces are to be rendered on the
		 * page.
		 * @type {jQuery.<HTMLElement>}
		 */
		$surfaceContainer: null,

		/**
		 * Whether or not floating toolbar surfaces should be pinned.
		 * @type {boolean}
		 */
		isFloatingMode: true,

		/**
		 * Left position of pinned toolbars.
		 * @type {number}
		 */
		pinLeft: 0,

		/**
		 * Top position of pinned toolbars.
		 * @type {number}
		 */
		pinTop: 0,

		/**
		 * Initializes the toolbar manager.  Adds the surface container
		 * element, and sets up floating behaviour settings.
		 */
		init: function () {
			// TODO should use context.js to get the context element
			Toolbar.$surfaceContainer = $('<div>', {
				'class': 'aloha aloha-surface aloha-toolbar',
				'unselectable': 'on'
			}).hide();

			// In the built aloha.js, init will happend before the body has
			// finished loading, so we have to defer appending the element.
			$(function(){ Toolbar.$surfaceContainer.appendTo('body'); });

			Surface.trackRange(Toolbar.$surfaceContainer);

			var pinState = floating.getPinState();
			Toolbar.pinTop = pinState.top;
			Toolbar.pinLeft = pinState.left;
			Toolbar.isFloatingMode = !pinState.isPinned;
		},

		setFloatingPosition: function (position) {
			Toolbar.pinTop = position.top;
			Toolbar.pinLeft = position.left;
		},

		getFloatingPosition: function () {
			return {
				top: Toolbar.pinTop,
				left: Toolbar.pinLeft
			};
		}
	});

	Toolbar.init();

	return Toolbar;
});
