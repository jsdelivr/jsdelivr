YUI.add('gallery-aui-panel', function(A) {

/**
 * The Panel Utility - Panel is a container that has specific functionality
 * and structural components that make it the good for building block for
 * application-oriented user interfaces. Panel also provides built-in
 * expandable and collapsible behavior, along with a variety of prebuilt tool
 * buttons that can be wired up to provide other customized behavior. Panels
 * can be easily dropped into any Container or layout.
 *
 * @module aui-panel
 */

var Lang = A.Lang,
	isArray = Lang.isArray,
	isBoolean = Lang.isBoolean,

	BOUNDING_BOX = 'boundingBox',
	COLLAPSE = 'collapse',
	COLLAPSED = 'collapsed',
	COLLAPSIBLE = 'collapsible',
	ICON = 'icon',
	MINUS = 'minus',
	PANEL = 'panel',
	PLUS = 'plus',
	TITLE = 'title',
	ICONS = 'icons',
	VISIBLE = 'visible',

	getClassName = A.ClassNameManager.getClassName,

	CSS_CLEARFIX = getClassName('helper', 'clearfix'),
	CSS_COLLAPSED = getClassName(PANEL, COLLAPSED),
	CSS_PANEL = getClassName(PANEL),
	CSS_PANEL_HD_TEXT = getClassName(PANEL, 'hd', 'text'),
	CSS_PANEL_ICONS = getClassName(PANEL, 'icons'),

	CSS_PANELS = {
		body: 'bd',
		footer: 'ft',
		header: 'hd'
	},

	NODE_BLANK_TEXT = document.createTextNode(''),

	TPL_HEADER_TEXT = '<span class="' + CSS_PANEL_HD_TEXT + '"></span>';

/**
 * <p><img src="assets/images/aui-panel/main.png"/></p>
 *
 * A base class for Panel, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Built-in expandable and collapsible behavior</li>
 *    <li>Prebuilt tool buttons that can be wired up to provide other customized behavior</li>
 *    <li>Good for building block for application-oriented user interfaces</li>
 *    <li>Can be easily dropped into any Container or layout</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.Panel({
 *	collapsible: true,
 *  collapsed: true,
 *	headerContent: 'Panel 1',
 *	bodyContent: 'Content'
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="Panel.html#configattributes">Configuration Attributes</a> available for
 * Panel.
 *
 * @class Panel
 * @constructor
 * @extends Component
 * @uses WidgetStdMod
 * @param config {Object} Object literal specifying widget configuration properties.
 */
var Panel = function() {};

/**
 * Static property used to define the default attribute
 * configuration for the Panel.
 *
 * @property Panel.ATTRS
 * @type Object
 * @static
 */
Panel.ATTRS = {
	/**
	 * Whether the panel is displayed collapsed.
	 *
	 * @attribute collapsed
	 * @default false
	 * @type boolean
	 */
	collapsed: {
		value: false,
		validator: isBoolean
	},

	/**
	 * Whether the panel is able to be collapsed.
	 *
	 * @attribute collapsible
	 * @default false
	 * @type boolean
	 */
	collapsible: {
		value: false,
		validator: isBoolean
	},

	/**
	 * The title to be displayed on the Panel.
	 *
	 * @attribute title
	 * @default ''
	 * @type Boolean | String
	 */
	title: {
		value: '',
		validator: function(v) {
			return Lang.isString(v) || isBoolean(v);
		}
	},

	/**
	 * <p>Array of <a href="ButtonItem.html">ButtonItem</a> configuration objects to be displayed as icons
     * on the Panel title.</p>
	 *
	 * Example:
	 *
	 * <pre><code>icons: [ { icon: 'close', id: 'close' } ]</code></pre>
	 *
	 * For more information how to use this option see
     * <a href="ButtonItem.html">ButtonItem</a>.
	 *
	 * @attribute icons
	 * @default []
	 * @type Array
	 */
	icons: {
		value: [],
		validator: isArray
	}
};

Panel.prototype = {
	/**
	 * Construction logic executed during Panel instantiation. Lifecycle.
	 *
	 * @method initializer
	 * @protected
	 */
	initializer: function(config) {
		var instance = this;

		if (!config.bodyContent) {
			instance.set('bodyContent', NODE_BLANK_TEXT);
		}

		if (!config.headerContent) {
			instance.set('headerContent', NODE_BLANK_TEXT);
		}

		instance.after('collapsedChange', instance._afterCollapsedChange);
		instance.after('render', instance._afterPanelRender);
		instance.after('titleChange', instance._afterTitleChange);
	},

	/**
	 * Collapse the panel setting the
     * <a href="Panel.html#config_collapsed">collapsed</a> attribute to
     * <code>true</code>.
	 *
	 * @method collapse
	 */
	collapse: function() {
		var instance = this;

		instance.set(COLLAPSED, true);
	},

	/**
	 * Expand the panel setting the
     * <a href="Panel.html#config_collapsed">collapsed</a> attribute to
     * <code>false</code>.
	 *
	 * @method expand
	 */
	expand: function() {
		var instance = this;

		instance.set(COLLAPSED, false);
	},

	/**
	 * Toggle the visibility of the Panel toggling the value of the
     * <a href="Widget.html#config_visible">visible</a> attribute.
	 *
	 * @method toggle
	 */
	toggle: function() {
		var instance = this;

		instance.set(
			VISIBLE,
			!instance.get(VISIBLE)
		);
	},

	/**
	 * Toggle the <a href="Panel.html#config_collapsed">collapsed</a> value.
     * Expanding and collapsing the Panel.
	 *
	 * @method toggleCollapse
	 */
	toggleCollapse: function() {
		var instance = this;

		if (instance.get(COLLAPSED)) {
			instance.expand();
		}
		else {
			instance.collapse();
		}
	},

	/**
	 * Add css classes neede for the Panel in the passed <code>section</code>.
	 *
	 * @method _addPanelClass
	 * @param {String} section <a href="WidgetStdMod.html">WidgetStdMod</a> section (i.e., body, header, footer).
	 * @protected
	 */
	_addPanelClass: function(section) {
		var instance = this;

		var sectionNode = instance[section + 'Node'];

		if (sectionNode) {
			var rootCssClass = CSS_PANELS[section];
			var cssClassMod = getClassName(PANEL, rootCssClass);

			// using instance.name to add the correct component name
			// when Panel is used to build another component using A.build
			var instanceName = instance.name;
			var cssClass = getClassName(instanceName, rootCssClass);

			sectionNode.addClass(cssClassMod);
			sectionNode.addClass(cssClass);
		}
	},

	/**
	 * Render the <a href="Panel.html#config_icons">icons</a>.
	 *
	 * @method _renderIconButtons
	 * @protected
	 */
	_renderIconButtons: function() {
		var instance = this;
		var icons = instance.get(ICONS);

		if (instance.get(COLLAPSIBLE)) {
			var icon = instance.get(COLLAPSED) ? PLUS : MINUS;

			icons.unshift(
				{
					icon: icon,
					id: COLLAPSE,
					handler: {
						fn: instance.toggleCollapse,
						context: instance
					}
				}
			);
		}

		instance.icons = new A.Toolbar(
			{
				children: icons
			}
		)
		.render(instance.headerNode);

		instance.icons.get(BOUNDING_BOX).addClass(CSS_PANEL_ICONS);
	},

	/**
	 * Render the Panel header text with the value of
     * <a href="Panel.html#config_title">title</a>.
	 *
	 * @method _renderHeaderText
	 * @protected
	 */
	_renderHeaderText: function() {
		var instance = this;
		var headerNode = instance.headerNode;
		var headerTextNode = A.Node.create(TPL_HEADER_TEXT);
		var html = headerNode.html();

		headerNode.empty();

		headerTextNode.addClass(CSS_PANEL_HD_TEXT);

		headerNode.prepend(headerTextNode);

		/**
		 * Stores the created node for the header of the Panel.
		 *
		 * @property headerTextNode
		 * @type Node
		 * @protected
		 */
		instance.headerTextNode = headerTextNode;

		if (!instance.get(TITLE)) {
			instance.set(TITLE, html);
		}

		instance._syncTitleUI();
	},

	/**
	 * Sync the UI for the collapsed status (i.e., icons, height etc).
	 *
	 * @method _syncCollapsedUI
	 * @protected
	 */
	_syncCollapsedUI: function() {
		var instance = this;

		if (instance.get(COLLAPSIBLE)) {
			var bodyNode = instance.bodyNode;
			var boundingBox = instance.get(BOUNDING_BOX);
			var collapsed = instance.get(COLLAPSED);

			if (instance.icons) {
				var icons = instance.icons;
				var collapseItem = icons.item(COLLAPSE);

				if (collapseItem) {
					collapseItem.set(
						ICON,
						collapsed ? PLUS : MINUS
					);
				}
			}

			if (collapsed) {
				bodyNode.hide();
				boundingBox.addClass(CSS_COLLAPSED);
			}
			else {
				bodyNode.show();
				boundingBox.removeClass(CSS_COLLAPSED);
			}
		}
	},

	/**
	 * Sync the
     * <a href="Panel.html#property_headerTextNode">headerTextNode</a> with the
     * value of the <a href="Panel.html#config_title">title</a>.
	 *
	 * @method _syncTitleUI
	 * @protected
	 */
	_syncTitleUI: function() {
		var instance = this;
		var title = instance.get(TITLE);

		instance.headerTextNode.html(title);
	},

	/**
	 * Fires after the value of
     * <a href="Panel.html#config_collapsed">collapsed</a> change.
	 *
	 * @method _afterCollapsedChange
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterCollapsedChange: function(event) {
		var instance = this;

		instance._syncCollapsedUI();
	},

	/**
	 * Fires after render phase.
	 *
	 * @method _afterPanelRender
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterPanelRender: function(event) {
		var instance = this;

		instance.headerNode.addClass(CSS_CLEARFIX);

		instance._addPanelClass('body');
		instance._addPanelClass('footer');
		instance._addPanelClass('header');

		instance._renderHeaderText();
		instance._renderIconButtons();

		instance._syncCollapsedUI();
	},

	/**
	 * Fires after the value of
     * <a href="Panel.html#config_title">title</a> change.
	 *
	 * @method _afterTitleChange
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterTitleChange: function(event) {
		var instance = this;

		instance._syncTitleUI();
	}
}

A.Panel = A.Base.build(PANEL, A.Component, [Panel, A.WidgetStdMod]);


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-component','widget-stdmod','gallery-aui-toolbar']});
