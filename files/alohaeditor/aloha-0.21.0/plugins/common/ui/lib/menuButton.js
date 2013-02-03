define([
	'jquery',
	'ui/component',
	'ui/utils',
	'jqueryui'
], function (
	$,
	Component,
	Utils
) {
	

	var MenuButton = Component.extend({
		init: function () {
			this.element = MenuButton.makeMenuButton(this);
		}
	});

	// static functions

	/**
	 * @param props button properties:
	 *        click - if provided will generate a split button,
	 *                  otherwise just a normal select button.
	 *        menu - array of props for nested buttons
	 *        text - button text
	 *        html - button html
	 *        iconUrl - button icon url
	 *        siblingContainer
	 *             - a $ object that will be searched for other split buttons.
	 *               If a split button is expanded, all the other split buttons in
	 *               this container will be closed.
	 */
	MenuButton.makeMenuButton = function (props) {
		var wrapper = $('<div>'   , {'class': 'aloha-ui-menubutton-container'});
		var expand  = Utils.makeButtonElement({'class': 'aloha-ui-menubutton-expand'});
		var menu    = $('<ul>'    , {'class': 'aloha-ui-menubutton-menu'});
		var action = null;
		var buttonset = null;

		if ($.browser.msie) {
			wrapper.addClass('aloha-ui-menubutton-iehack');
		}

		if (props.click) {
			action = Utils.makeButton(Utils.makeButtonElement({'class': 'aloha-ui-menubutton-action'}), props)
				.click(props.click);

			Utils.makeButton(expand, {}, true);

			buttonset = $('<div>')
				.buttonset()
				.append(action)
				.append(expand);
		} else {
			Utils.makeButton(expand, props, true)
			      .addClass('aloha-ui-menubutton-single');
		}

		if (!props.menu) {
			return wrapper.append(action);
		}

		function hideMenu(menu) {
			menu.hide().parent().removeClass('aloha-ui-menubutton-pressed');
		}

		expand
			.click(function (){
				wrapper.addClass('aloha-ui-menubutton-pressed');

				if (props.siblingContainer) {
					props.siblingContainer
						.find('.aloha-ui-menubutton-menu')
						.each(function (){
							if (this !== menu[0]) {
								hideMenu($(this));
							}
						});
				}

				if (menu.is(':visible')) {
					hideMenu(menu);
					return;
				}

				menu.show().position({
					my: 'left top',
					at: 'left bottom',
					of: action || expand
				});

				// In order to prevent the floating menu from being partially
				// covered by the ribbon, we use "position: relative" and an
				// invisible border to pad the top of the document.  This
				// throws off the offset to the menu button so we need to
				// compensate in ordet to ensure that the menu is placed
				// underneatht the menubutton.
				// NB: For the time being we are not using the above fix.
				/*
				var target = action || expand;
				var bodyOffset = parseInt($('body').css('border-top-width'), 10) || 0;
				menu.css('top', target.height() + target.offset().top + bodyOffset);
				*/

				$(document).bind('click', function (event){
					$(this).unbind(event);
					menu.hide();
					wrapper.removeClass('aloha-ui-menubutton-pressed');
				});

				return false;
			});

		wrapper.append(buttonset || expand).append(menu);

		menu.append(makeNestedMenus(makeCloseHandler(menu), props.menu));

		menu.hide().menu({
			'select': onSelect
		});

		return wrapper;
	};

	function makeNestedMenus(parentCloseHandler, menu){
		var elems = [];
		$.each(menu, function (_, item) {
			var elem = $('<li>');
			elem.append($('<a>', {'href': 'javascript:void 0', 'html': Utils.makeButtonLabelWithIcon(item)}));
			if (item.click) {
				elem.data('aloha-ui-menubutton-select', function (){
					parentCloseHandler();
					item.click();
				});
			}
			if (item.menu) {
				var nestedMenu = $('<ul>').appendTo(elem);
				nestedMenu.append(
					makeNestedMenus(makeCloseHandler(nestedMenu, parentCloseHandler),
									item.menu));
			}
			elems.push(elem[0]);
		});
		return elems;
	}

	function makeCloseHandler(menu, parentCloseHandler) {
		parentCloseHandler = parentCloseHandler || $.noop;
		return function (){
			// We must blur the parent menu otherwise it will remain in
			// focused state and not expand the next time it is hovered over
			// after the user has selected an item.
			menu.blur().hide();
			menu.parent().removeClass('aloha-ui-menubutton-pressed');
			parentCloseHandler();
		};
	}

	function onSelect(event, ui) {
		var clickHandler = ui.item.data('aloha-ui-menubutton-select');
		clickHandler && clickHandler(event, ui);
		// We use preventDefault() to keep a click on a menu item from
		// scrolling to the top of the page.
		event.preventDefault();
	}

	return MenuButton;
});
