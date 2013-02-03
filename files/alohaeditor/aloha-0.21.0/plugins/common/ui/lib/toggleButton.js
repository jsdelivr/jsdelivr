define([
	'jquery',
	'ui/button',
	'jqueryui'
],
function( jQuery, Button ) {
	

	var idCounter = 0;

	/**
	 * ToggleButton control. Extends the Button component type to provide an
	 * easy way to create buttons that can transition between "checked" and
	 * "unchecked" states.
	 *
	 * @class
	 * @name ToggleButton
	 * @extends {Button}
	 */
	var ToggleButton = Button.extend({

		_checked: false,

		/**
		 * Sets the state of the toggleButton and updates its visual display
		 * accordingly.
		 *
		 * @param {boolean} toggled Whether the button is to be set to the
		 *                          "toggled/checked" state.
		 */
		setState: function( toggled ) {
			// It is very common to set the button state on every
			// selection change even if the state hasn't changed.
			// Profiling showed that this is very inefficient.
			if (this._checked === toggled) {
				return;
			}
			this._checked = toggled;
			if (toggled) {
				this.element.addClass("aloha-button-active");
			} else {
				this.element.removeClass("aloha-button-active");
			}
		},

		getState: function() {
			return this._checked;
		},

		_onClick: function() {
			this.setState( ! this._checked );
			this.click();
		}
	});

	return ToggleButton;
});
