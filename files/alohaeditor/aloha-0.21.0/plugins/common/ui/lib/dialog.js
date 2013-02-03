define([
	'jquery',
	'ui/component'
],
function($, Component) {
	

	function makeDialogDiv(props) {
		var textOrHtml = {};
		if (props.text) {
			textOrHtml['text'] = props.text;
		}
		if (props.html) {
			textOrHtml['html'] = props.html;
		}
		return $('<div>', textOrHtml);
	}

	function wrapDialogButtons(buttons) {
		// Buttons automatically close the dialog for convenience
		for (var title in buttons) {
			if (buttons.hasOwnProperty(title)) {
				buttons[title] = (function(orgCallback){
					return function(){
						orgCallback.apply(this);
						$(this).dialog('destroy').remove();
					};
				})(buttons[title]);
			}
		}
		return buttons;
	}

	function makeDialogProps(props, defaultTitle){
		// All root elements of widgets added to the page by aloha should have the class 'aloha'.
		// aloha-dialog is used for a hack to prevent a click in the
		// dialog from bluggin the editable search for aloha-dialog in
		// the aloha core for more information.
		var cls = 'aloha aloha-dialog';
		if (props.cls) {
			cls += ' ' + props.cls;
		}
		return {
			'resizable': false,
			'modal': true,
			'title': props.title || defaultTitle,
			'dialogClass': cls,
			'zIndex': 10200
		};
	}

	return {
		/**
		 * Shows a confirm dialog.
		 *
		 * A confirm dialog has a confirm icon and style and yes and no buttons.
		 *
		 * @param props is an object with the following properties (all optional):
		 *          title - the title of the dialog
		 *           text - either the text inside the dialog
		 *           html - or the html inside the dialog
		 *            yes - makes a "Yes" button in the dialog and invokes the given callback if it is pressed.
		 *             no - makes a "No" button in the dialog and invokes the given callback if it is pressed.
		 *         answer - makes a "Yes" and "No" button in the dialog and pressing either will invoke the
		 *                  callback with the answer as a boolean argument. Does not interfere with yes and
		 *                  no properties.
		 *            cls - the root element of the dialog will receive this class
         *        buttons - an object where the properties are button titles and the values are callbacks
		 *        Button callbacks will receive the dialog element as context.
		 *        Pressing any buttons in the dialog will automatically close the dialog.
		 * @return
		 *        A function that can be called to close the dialog.
		 */
		'confirm': function(props) {
			var buttons = props.buttons || {};
			buttons['Yes'] = buttons['Yes'] || props.yes || $.noop;
			buttons['No']  = buttons['No']  || props.no  || $.noop;
			if (props.answer) {
				var yes = buttons['Yes'];
				var no  = buttons['No'];
				buttons['Yes'] = function(){
					yes();
					props.answer(true);
				};
				buttons['No'] = function(){
					no();
					props.answer(false);
				};
			}
			var dialog = makeDialogDiv(props).dialog(
				$.extend(makeDialogProps(props, 'Confirm'), {
					'buttons': wrapDialogButtons(buttons)
				})
			);
			return function() {
				dialog.dialog('destroy').remove();
			};
		},
		/**
		 * Shows an alert dialog.
		 *
		 * An alert dialog has an alert icon and style and a dismiss button.
		 *
		 * @param props is an object with the following properties (all optional)
		 *        title - the title of the dialog
		 *        text - either the text inside the dialog
		 *        html - or the html inside the dialog
		 *        cls - the root element of the dialog will receive this class
		 * @return
		 *        A function that can be called to close the dialog.
		 */
		'alert': function(props) {
			var dialog = makeDialogDiv(props).dialog(
				$.extend(makeDialogProps(props, 'Alert'), {
					'buttons': wrapDialogButtons({
						'Dismiss': $.noop
					})
				})
			);
			return function() {
				dialog.dialog('destroy').remove();
			};
		},
		/**
		 * Shows a progress dialog.
		 *
		 * A progress dialog shows a progressbar and a message to
		 * indicate that some process is in progress.
		 *
		 * @param props is an object with the following properties (all optional)
		 *        title - the title of the dialog
		 *         text - either the text inside the dialog
		 *         html - or the html inside the dialog
		 *          cls - the root element of the dialog will receive this class
		 *        value - the intial value of the progressbar from 0 to 100
		 * @return
		 *        A function that can be called to update the progress bar with a value from 0 to 100.
		 *        If null or undefined is passed, the dialog will be closed.
		 */
		'progress': function(props) {
			var progressbar = $("<div>").progressbar({
				// TODO if no initial value is specific, show a full but an animated progress bar instead
				value: null != props.value ? props.value : 100
			});
			var dialog = makeDialogDiv(props).dialog(
				$.extend(makeDialogProps(props, 'Progress'), {
					open: function(){
						$(this).append(progressbar);
					}
				})
			);
			return function(value){
				if (null != value) {
					progressbar.progressbar({ value: value });
				} else {
					dialog.dialog('destroy').remove();
				}
			};
		}
	};
});
