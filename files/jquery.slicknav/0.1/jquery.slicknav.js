/*!
	SlickNav Responsive Mobile Menu
	(c) 2013 Josh Cope
	licensed under GPL and MIT
*/
(function ($, document, window) {
	var
	// default settings object.
	defaults = {
		label: 'MENU',
		duplicate: true,
		duration: 200,
		easingOpen: 'swing',
		easingClose: 'swing',
		closedSymbol: '&#9658;',
		openedSymbol: '&#9660;',
		prependTo: 'body',
		parentTag: 'a',
		closeOnClick: false,
		allowParentLinks: false
	},
	mobileMenu = 'slicknav',
	prefix = 'slicknav';
	
	$.fn[mobileMenu] = function (options) {
		return this.each(function() {
			var $this = $(this);
			var settings = $.extend({}, defaults, options);
			
			// clone menu if needed
			if (settings.duplicate) {
				var mobileNav = $this.clone();
				//remove ids from clone to prevent css issues
				mobileNav.removeAttr('id');
				mobileNav.find('*').each(function(i,e){
					$(e).removeAttr('id');
				});
			}
			else
				var mobileNav = $this;
			
			// styling class for the button
			var iconClass = prefix+'_icon';
			
			if (settings.label == '') {
				iconClass += ' '+prefix+'_no-text';
			}
			
			if (settings.parentTag == 'a') {
				settings.parentTag = 'a href="#"';
			}
			
			// create menu bar
			mobileNav.attr('class', prefix+'_nav');
			var menuBar = $('<div class="'+prefix+'_menu"></div>');
			var btn = $('<'+settings.parentTag+' aria-haspopup="true" tabindex="0" class="'+prefix+'_btn"><span class="'+prefix+'_menutxt">'+settings.label+'</span><span class="'+iconClass+'"><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span></span></a>');
			$(menuBar).append(btn);		
			$(settings.prependTo).prepend(menuBar);
			menuBar.append(mobileNav);
			
			// iterate over structure adding additional structure
			var items = mobileNav.find('li');
			$(items).each(function () {
				var item = $(this);
				data = {};
				data.children = item.children('ul').attr('role','menu');
				item.data("menu", data);
				
				// if a list item has a nested menu
				if (data.children.length > 0) {
				
					// select all text before the child menu
					var a = item.contents();
					var nodes = [];
					$(a).each(function(){
						if(!$(this).is("ul")) {
							nodes.push(this);
						}
						else {
							return false;
						}
					});
					
					// wrap item text with tag and add classes
					var wrap = $(nodes).wrapAll('<'+settings.parentTag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="'+prefix+'_item"/>').parent();
					
					item.addClass(prefix+'_collapsed');
					item.addClass(prefix+'_parent');
					
					// create parent arrow
					$(nodes).last().after('<span class="'+prefix+'_arrow">'+settings.closedSymbol+'</span>');
					
				
				} else if ( item.children().length == 0) {
					 item.addClass(prefix+'_txtnode');
				}
				
				// accessibility for links
				item.children('a').attr('role', 'menuitem').click(function(){
					//Emulate menu close if set
					if (settings.closeOnClick)
						$(btn).click();
				});
			});
			
			// structure is in place, now hide appropriate items
			$(items).each(function () {
				var data = $(this).data("menu");
				visibilityToggle(data.children, false);
			});
			
			// finally toggle entire menu
			visibilityToggle(mobileNav, false);
			
			// accessibility for menu button
			mobileNav.attr('role','menu');
			
			// outline prevention when using mouse
			$(document).mousedown(function(){
				outlines(false);
			});
			
			$(document).keyup(function(){
				outlines(true);
			});
			
			// menu button click
			$(btn).click(function (e) {
				e.preventDefault();
				visibilityToggle(mobileNav, true);
			});
			
			// click on menu parent
			mobileNav.on('click', '.'+prefix+'_item', function(e){
				e.preventDefault();
				itemClick($(this));
			});
			
			// check for enter key on menu button and menu parents
			$(btn).keydown(function (e) {
				var ev = e || event;
					if(ev.keyCode == 13) {
					e.preventDefault();
					visibilityToggle(mobileNav, true);
				}
			});
			
			mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
				var ev = e || event;
				if(ev.keyCode == 13) {
					e.preventDefault();
					itemClick($(e.target));
				}
			});
			
			// allow links clickable within parent tags if set
			if (settings.allowParentLinks) {
				$('.'+prefix+'_item a').click(function(e){
						e.stopImmediatePropagation();
				});
			}
			
			// toggle clicked items
			function itemClick(el) {
				var data = el.data("menu");
				if (!data) {
					data = {};
					data.arrow = el.children('.'+prefix+'_arrow');
					data.ul = el.next('ul');
					data.parent = el.parent();
					el.data("menu", data);
				}
				if (el.parent().hasClass(prefix+'_collapsed')) {
					data.arrow.html(settings.openedSymbol);
					data.parent.removeClass(prefix+'_collapsed');
					visibilityToggle(data.ul, true);
				} else {
					data.arrow.html(settings.closedSymbol);
					data.parent.addClass(prefix+'_collapsed');
					visibilityToggle(data.ul, true);
				}
			}

			// toggle actual visibility and accessibility tags
			function visibilityToggle(el, animate) {
				var items = getActionItems(el);
				var duration = 0;
				if (animate)
					duration = settings.duration;
				
				if (el.hasClass(prefix+'_hidden')) {
					el.removeClass(prefix+'_hidden');
					el.slideDown(duration, settings.easingOpen);
					el.attr('aria-hidden','false');
					items.attr('tabindex', '0');
					setVisAttr(el, false);
					
				} else {
					el.addClass(prefix+'_hidden');
					el.slideUp(duration, settings.easingClose, function() {
						el.attr('aria-hidden','true');
						items.attr('tabindex', '-1');
						setVisAttr(el, true);
					});
				}
			}
			
			// set attributes of element and children based on visibility
			function setVisAttr(el, hidden) {
			
				// select all parents that aren't hidden
				var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');
				
				// iterate over all items setting appropriate tags
				if (!hidden) {
					nonHidden.each(function(){
						var ul = $(this);
						ul.attr('aria-hidden','false');
						var items = getActionItems(ul);
						items.attr('tabindex', '0');
						setVisAttr(ul, hidden);
					});
				} else {
					nonHidden.each(function(){
						var ul = $(this);
						ul.attr('aria-hidden','true');
						var items = getActionItems(ul);
						items.attr('tabindex', '-1');
						setVisAttr(ul, hidden);
					});
				}
			}
			
			// get all 1st level items that are clickable
			function getActionItems(el) {
				var data = el.data("menu");
				if (!data) {
					data = {};
					var items = el.children('li');
					var anchors = items.children('a');
					data.links = anchors.add(items.children('.'+prefix+'_item'));
					el.data("menu", data);
				}
				return data.links;
			}
			
			function outlines(state) {
				if (!state) {
					$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
				} else {
					$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
				}
			}
		});
	};
}(jQuery, document, window));