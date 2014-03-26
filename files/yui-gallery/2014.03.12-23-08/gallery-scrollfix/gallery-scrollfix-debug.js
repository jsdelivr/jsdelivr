YUI.add('gallery-scrollfix', function (Y, NAME) {

/**
 * ScrollFix is a simple Node plugin that prevents mousewheel events inside
 * the host node from bubbling up to parent nodes if the scroll has reached the
 * bottom of the host node. This fixes an issue commonly seen in websites where
 * the user scrolls an inner-scroll area but then the whole page moves as the
 * scroll reaches the bottom of the inner-scroll area.
 *
 * @module gallery-scrollfix
 **/

/**
 * <p>
 * ScrollFix is a Node plugin that can be used to stop scroll events from
 * escaping an inner scroll area when the scroll reaches the bottom of the area.
 * </p>
 * @class NodeScrollFix
 */
function NodeScrollFix(/*config*/) {
	NodeScrollFix.superclass.constructor.apply(this, arguments);
}
NodeScrollFix.NAME = 'gallery-scrollfix';
NodeScrollFix.NS = 'scrollfix';
NodeScrollFix.ATTRS = {
	/**
	 * Defines a node or CSS selector to listen to for the mousewheel
	 * events. This defaults to the body element of the page and probably
	 * should not be altered in most cases.
	 *
	 * @attribute target
	 * @default Y.one('body')
	 * @type string | Y.Node
	 */
	target: {
		value: Y.one('body'),
		setter: function(value) {
			if (typeof value === 'string') {
				return Y.one(value);
			} else if (value instanceof Y.Node) {
				return value;
			}
			return Y.Attribute.INVALID_VALUE;
		}
	}
};
Y.extend(NodeScrollFix, Y.Plugin.Base, {
    initializer: function(/*config*/) {
		var host = this.get('host');

		host.on('mouseenter',function(/*ev*/) {
			var target = this.get('target');
			this.mouseWheelListener = target.on('mousewheel',function(ev) {
				var scrollNode = host.getDOMNode(),
					remainingHeight = scrollNode.scrollHeight - scrollNode.scrollTop,
					clientHeight = scrollNode.clientHeight;
				// decide if we should prevent scrolling or not
				if (scrollNode.scrollHeight > clientHeight) {
					// scrollbars are visible
					if (ev.wheelDelta > 0 && scrollNode.scrollTop <= 0) {
						// scrolling up, and already at top
						ev.preventDefault();
					} else if (ev.wheelDelta < 0 && remainingHeight <= clientHeight+1) {
						// scrolling down and near enough the bottom already
						ev.preventDefault();
					}
				}
			});
		},this);
		host.on('mouseleave',function(/*ev*/) {
			this.mouseWheelListener.detach();
			this.mouseWheelListener = null;
		},this);
	},
	destructor: function() {
		if (this.mouseWheelListener) {
			this.mouseWheelListener.detach();
			this.mouseWheelListener = null;
		}
	}
});
Y.namespace('Plugin').NodeScrollFix = NodeScrollFix;

}, 'gallery-2012.12.12-21-11', {"requires": ["event-mouseenter", "plugin"]});
