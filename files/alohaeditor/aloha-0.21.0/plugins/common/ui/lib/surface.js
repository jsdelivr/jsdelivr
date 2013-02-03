define([
	'aloha/core',
	'jquery',
	'util/class',
	'ui/container'
], function(
	Aloha,
	$,
	Class,
	Container
) {
	

	var Surface;

	/**
	 * The Surface class and manager.
	 *
	 * @class
	 * @base
	 */
	Surface = Class.extend({

		_constructor: function(context) {
			context.surfaces.push(this);
		},

		/**
		 * Check for whether or not this surface is active--that is, whether is
		 * is visible and the user can interact with it.
		 *
		 * @eturn {boolean} True if this surface is visible.
		 */
		isActive: function() {
			return true;
		}

	});

	// Static fields for the Surface class.

	$.extend( Surface, {

		/**
		 * The range of the current selection.
		 * 
		 * Interacting with a surface removes focus from the editable, so the
		 * surface is responsible for keeping track of the range that should be
		 * modified by the components.
		 * 
		 * @static
		 * @type {Aloha.Selection}
		 */
		range: null,

		/**
		 * Shows all surfaces for a given context.
		 *
		 * @param {!Object} context.
		 */
		show: function(context) {
			$.each(context.surfaces, function(i, surface) {
				surface.show();
			});
		},

		/**
		 * Hides all surfaces for a given context.
		 *
		 * @param {!Object} context
		 */
		hide: function(context) {
			$.each(context.surfaces, function (i, surface) {
				surface.hide();
			});
		},

		/**
		 * Track editable and range when interacting with a surface.
		 *
		 * @param {jQuery<HTMLElement>} element A component or surface for
		 *                                      which we wish to keep track of
		 *                                      the current selection range
		 *                                      when the user interacts with
		 *                                      it.
		 */
		trackRange: function(element) {
			element.bind('mousedown', function(e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = true;
				Surface.suppressHide = true;

				if (Aloha.activeEditable) {
					var selection = Aloha.getSelection();
					Surface.range = (0 < selection.getRangeCount())
					              ? selection.getRangeAt(0)
								  : null;
				}
			});
			
			element.bind('mouseup', function(e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = false;
				Surface.suppressHide = false;
			});
		}
	});

	return Surface;
});
