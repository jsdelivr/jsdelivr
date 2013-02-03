define([
	'aloha/core',
	'jquery',
	'ui/container',
	'ui/component',
	'PubSub',
	'jqueryui'
], function (
	Aloha,
	$,
	Container,
	Component,
	PubSub
) {
	

	var idCounter = 0;

	/**
	 * Defines a Container object that represents a collection of related
	 * component groups to be rendered together on the toolbar.  Tabs are
	 * organized by feature and functionality so that related controls can be
	 * brought in and out of view depending on whether they are
	 * appropriate for a given user context.
	 *
	 * Tabs can be defined declaritively in the Aloha configuration in the
	 * following manner:
	 *
	 *    Aloha.settings.toolbar: [
	 *      {
	 *         label: 'Lists',
	 *         showOn: 'ul,ol,*.parent(.aloha-editable ul,.aloha-editable ol)',
	 *         components: [ [ 'orderedList', 'unorderedList' ] ]
	 *      }
	 *    ]
	 *
	 * Alternatively, tabs can also be created imperatively in this way:
	 * new Tab( options, components ).
	 *
	 * @class
	 * @extends {Container}
	 */
	var Tab = Container.extend({

		_elemBySlot: null,
		_groupBySlot: null,
		_groupByComponent: null,

		/**
		 * All that this constructor does is save the components array into a
		 * local variable, to be used during instantialization.
		 *
		 * @param {object} settings
		 * @param {Array.<Array<string>>} components
		 * @constructor
		 */
		_constructor: function (context, settings, components) {
			var thisTab = this,
			    i, j,
			    elem,
			    groupedComponents,
			    group,
			    groupProps,
			    componentName;

			this._elemBySlot = {};
			this._groupBySlot = {};
			this._groupByComponent = {};
			this._super(context, settings);

			this.container = settings.container;
			this.list = this.container.data('list');
			this.panels = this.container.data('panels');
			this.id = 'tab-ui-container-' + (++idCounter);
			this.panel = $('<div>', {id : this.id, 'unselectable': 'on'});
			this.handle = $('<li><a href="#' + this.id + '">' +
				settings.label + '</a></li>');

			for (i = 0; i < components.length; i++) {
				if (typeof components[i] === 'string') {
					if (1 === components[i].length && components[i].charCodeAt(0) === 10) {
						this.panel.append('<div>', {'unselectable': 'on'});
					} else {
						elem = $('<span>', {'unselectable': 'on'});
						this._elemBySlot[components[i]] = elem;
						this.panel.append(elem);
					}
				} else {
					group = $('<div>', {
						'class': 'aloha-ui-component-group',
						'unselectable': 'on'
					}).appendTo(this.panel);
					groupProps = {element: group, visibleCounter: 0};
					groupedComponents = components[i];
					for (j = 0; j < groupedComponents.length; j++) {
						this._groupBySlot[groupedComponents[j]] = groupProps;
						if (1 === groupedComponents[j].length &&
						    groupedComponents[j].charCodeAt(0) === 10) {
							group.append($('<div>', {'unselectable': 'on'}));
						} else {
							componentName = groupedComponents[j];
							elem = $('<span>', {'unselectable': 'on'});
							this._elemBySlot[groupedComponents[j]] = elem;
							group.append(elem);
						}
					}
				}
			}

			this.panel.append($('<div>', {'class': 'aloha-ui-clear', 'unselectable': 'on'}));
			this.handle.appendTo(this.list);
			this.panel.appendTo(this.panels);
			this.container.tabs('refresh');

			var alohaTabs = settings.container.data('aloha-tabs');
			this.index = alohaTabs.length;
			alohaTabs.push(this);
		},

		adoptInto: function(slot, component) {
			var elem = this._elemBySlot[slot],
			    group;
			if (!elem) {
				return false;
			}
			component.adoptParent(this);
			elem.append(component.element);
			group = this._groupBySlot[slot];
			if (group) {
				this._groupByComponent[component.id] = group;
				if (component.isVisible()) {
					group.visibleCounter += 1;
				}
			}
			return true;
		},

		foreground: function() {
			this.container.tabs('select', this.index);
		},

		childForeground: function(childComponent) {
			this.foreground();
		},

		childVisible: function(childComponent, visible) {
			var group = this._groupByComponent[childComponent.id];
			if (!group) {
				return;
			}
			if (visible) {
				if (0 === group.visibleCounter) {
					group.element.removeClass('aloha-ui-hidden');
				}
				group.visibleCounter += 1;
			} else {
				group.visibleCounter -= 1;
				if (0 === group.visibleCounter) {
					group.element.addClass('aloha-ui-hidden');
				}
			}
		},

		/**
		 * @override
		 */
		show: function() {
			if (!this.list.children().length) {
				return;
			}
			this.handle.show();
			this.visible = true;

			// If no tabs are selected, then select the tab which was just shown.
			if (   !this.container.find('.ui-tabs-active').length
			    ||  this.container.tabs('option', 'selected') === this.index) {
				this.foreground();
			}
		},

		/**
		 * @override
		 */
		hide: function() {
			var tabs = this.list.children();
			if ( 0 === tabs.length ) {
				return;
			}
			this.handle.hide();
			this.visible = false;

			// If the tab we just hid was the selected tab, then we need to
			// select another tab in its stead.  We will select the first
			// visible tab we find, or else we deselect all tabs.
			if ( this.index === this.container.tabs( 'option', 'selected' ) ) {
				tabs = this.container.data( 'aloha-tabs' );

				var i;
				for ( i = 0; i < tabs.length; ++i ) {
					if ( tabs[ i ].visible ) {
						this.container.tabs( 'select', i );
						return;
					}
				}

				// This does not work...
				// this.container.tabs( 'select', -1 );

				this.handle.removeClass( 'ui-tabs-active' );
			}
		}

	});

	$.extend(Tab, {

		/**
		 * Creates holding elements for jQuery UI Tabs for a surface.
		 *
		 * @static
		 * @return {jQuery.<HTMLElement>} The holder container on which we
		 *                                invoke jQuery UI Tabs once it is
		 *                                populated with tab containers.
		 */
		createContainer: function () {
			var $container = $('<div>', {'unselectable': 'on'});
			var $list = $('<ul>', {'unselectable': 'on'}).appendTo($container);
			var $panels = $('<div>', {'unselectable': 'on'}).appendTo($container);

			$container
				.data('list', $list)
				.data('panels', $panels)
				.data('aloha-tabs', [])
				.tabs({
					select: function (event, ui) {
						var tabs = $container.data('aloha-tabs');
						$container.data('aloha-active-container', tabs[ui.index]);
						PubSub.pub('aloha.ui.container.selected', {data: tabs[ui.index]});
					}
				});

			return $container;
		}
	});

	return Tab;
});
