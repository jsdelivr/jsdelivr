/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*//*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @todo: - Make the sidebars resizable using drag handles.
 *        - Make overlayPage setting settable from external config.
 */

define([
    'aloha/core',
    'aloha/jquery',
    'aloha/selection',
    'PubSub'
], function (
	Aloha,
	$,
	Selection,
	PubSub
) {
	

	var uid  = +(new Date());

	// Extend jQuery easing animations.
	//debugger;
	if (!$.easing.easeOutExpo) {
		$.extend($.easing, {
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var m=Math,s=1.70158,p=0,a=c;
				if(!t)return b;
				if((t/=d)==1)return b+c;
				if(!p)p=d*.3;
				if(a<m.abs(c)){a=c;var s=p/4;}else var s=p/(2*m.PI)*m.asin(c/a);
				return a*m.pow(2,-10*t)*m.sin((t*d-s)*(2*m.PI)/p)+c+b;
			}
		});
	}

	var Panel = function Panel(opts) {
		this.id = null;
		this.folds = {};
		this.button	= null;
		this.title = $('<div class="aloha-sidebar-panel-title">' +
				'<span class="aloha-sidebar-panel-title-arrow"></span>' +
				'<span class="aloha-sidebar-panel-title-text">Untitled</span>' +
			'</div>');
		this.content = $('<div class="aloha-sidebar-panel-content">' +
				'<div class="aloha-sidebar-panel-content-inner">' +
					'<div class="aloha-sidebar-panel-content-inner-text"></div>' +
				'</div>' +
			'</div>');
		this.element  = null;
		this.effectiveElement = null;
		this.expanded = false;
		this.isActive = true;
		this.init(opts);
	};

	var Sidebar = function Sidebar(opts) {
		var sidebar = this;
		this.id = 'aloha-sidebar-' + (++uid);
		this.panels = {};
		this.container = $('<div class="aloha-sidebar-bar">' +
				'<div class="aloha-sidebar-handle">' +
					'<span class="aloha-sidebar-handle-icon"></span>' +
				'</div>' +
				'<div class="aloha-sidebar-inner">' +
					'<ul class="aloha-sidebar-panels"></ul>' +
				'</div>' +
			'</div>');
		this.width = 300;
		this.opened = false;
		this.isOpen = false;
		this.settings = {
			// We automatically set this to true when we are in IE, where
			// rotating elements using filters causes undesirable rendering
			// ugliness.  Our solution is to fallback to swapping icon images.
			// We set this as a sidebar property so that it can overridden by
			// whoever thinks they are smarter than we are.
			rotateIcons : !$.browser.msie,
			overlayPage : true
		};

		$(function () {
			if (!((typeof Aloha.settings.sidebar !== 'undefined') &&
					Aloha.settings.sidebar.disabled)) {
				sidebar.init(opts);
			}
		});
	};

	/**
	 * The last calculated view port height.
	 * @type {number}
	 */
	var previousViewportHeight = null;
	var previousActivePanelIds = null;

	$.extend(Sidebar.prototype, {

		// We build as much of the sidebar as we can before appending it to DOM
		// to minimize reflow.
		init: function (opts) {
			var that = this;
			var panels;

			if (typeof opts === 'object') {
				panels = opts.panels;
				delete opts.panels;
			}

			$.extend(this, opts);

			if (typeof panels === 'object') {
				$.each(panels, function () {
					that.addPanel(this, true);
				});
			}

			var bar = this.container;

			if (this.position === 'right') {
				bar.addClass('aloha-sidebar-right');
			}

			bar.hide()
			   .appendTo($('body'))
			   .click(function () { that.barClicked.apply(that, arguments); })
			   .find('.aloha-sidebar-panels').width(this.width);

			// IE7 needs us to explicitly set the container width, since it is
			// unable to determine it on its own.
			bar.width(this.width);
			this.width = bar.width();

			$(window).resize(function () {
				that.updateHeight();
			});

			this.updateHeight();
			this.initToggler();

			this.container.css(this.position === 'right'
				? 'marginRight' : 'marginLeft', -this.width);

			if (this.opened) {
				this.open(0);
			}

			this.toggleHandleIcon(this.isOpen);
			this.subscribeToEvents();

			$(window).resize(function () {
				that.correctHeight();
			});

			this.correctHeight();
		},

		show: function () {
			this.container.css('display', 'block');
			return this;
		},

		hide: function () {
			this.container.css('display','none');
			return this;
		},

		/**
		 * Determines the effective elements at the current selection.
		 * Iterates through all panels and checks whether the panel should be
		 * activated for any of the effective elements in the selection.
		 *
		 * @param {Aloha.RangeObject} range The current selection range.
		 */
		checkActivePanels: function (range) {
			var effective = [];

			if (typeof range !== 'undefined' &&
					typeof range.markupEffectiveAtStart !== 'undefined') {
				var l = range.markupEffectiveAtStart.length;
				var i;
				for (i = 0; i < l; ++i) {
					effective.push($(range.markupEffectiveAtStart[i]));
				}
			}

			var that = this;

			$.each(this.panels, function () {
				that.showActivePanel(this, effective);
			});

			this.correctHeight();
		},

		subscribeToEvents: function () {
			var that = this;
			var $container = this.container;

			// add the event handler for context selection change
			PubSub.sub('aloha.selection.context-change', function (message) {
					that.checkActivePanels(message.range);
				});

			$container.mousedown(function (e) {
					e.originalEvent.stopSelectionUpdate = true;
					Aloha.eventHandled = true;
					//e.stopSelectionUpdate = true;
				});

			$container.mouseup(function (e) {
					e.originalEvent.stopSelectionUpdate = true;
					Aloha.eventHandled = false;
				});

			Aloha.bind('aloha-editable-deactivated', function (event, params) {
					that.checkActivePanels();
				});
		},

		/**
		 * Dynamically set appropriate heights for panels.
		 * The height for each panel is determined by the amount of space that
		 * is available in the viewport and the number of panels that need to
		 * share that space.
		 */
		correctHeight: function () {
			if (!this.isOpen) {
				return;
			}

			var viewportHeight = $(window).height();
			var activePanelIds = [];
			var panels = [];
			var panelId;
			for (panelId in this.panels) if (this.panels.hasOwnProperty(panelId)) {
				if (this.panels[panelId].isActive) {
					panels.push(this.panels[panelId]);
					activePanelIds.push(panelId);
				}
			}

			if (0 === panels.length) {
				return;
			}

			activePanelIds = activePanelIds.sort().join(',');

			if (previousActivePanelIds === activePanelIds &&
			    previousViewportHeight === viewportHeight) {
				return;
			}

			previousViewportHeight = viewportHeight;
			previousActivePanelIds = activePanelIds;

			var height = this.container.find('.aloha-sidebar-inner').height();
			var remainingHeight = height - ((panels[0].title.outerHeight() + 10) * panels.length);
			var panel;
			var targetHeight;
			var panelInner;
			var panelText;
			var undone;
			var toadd = 0;
			var math = Math;
			var j;

			while (panels.length > 0 && remainingHeight > 0) {
				remainingHeight += toadd;
				toadd = 0;
				undone = [];

				for (j = panels.length - 1; j >= 0; --j) {
					panel = panels[j];
					panelInner = panel.content.find('.aloha-sidebar-panel-content-inner');

					targetHeight = math.min(
						panelInner.height('auto').height(),
						math.floor(remainingHeight / (j + 1))
					);

					panelInner.height(targetHeight);
					remainingHeight -= targetHeight;
					panelText = panelInner.find('.aloha-sidebar-panel-content-inner-text');

					if (panelText.height() > targetHeight) {
						undone.push(panel);
						toadd += targetHeight;
						panelInner.css({
							'overflow-x': 'hidden',
							'overflow-y': 'scroll'
						});
					} else {
						panelInner.css('overflow-y', 'hidden');
					}

					if (panel.expanded) {
						panel.expand();
					}
				}

				panels = undone;
			}
		},

		/**
		 * Checks whether this panel should be activated (ie: made visible) for
		 * any of the elements specified in a given list of elements.
		 *
		 * We have to add a null object to the list of elements to allow us to
		 * check whether the panel should be visible when we have no effective
		 * elements in the current selection
		 *
		 * @param {object} panel The Panel object we will test
		 * @param {Array.<jQuery.<HTMLElement>>} elements The effective
		 *                                                elements, any of
		 *                                                which may activate
		 *                                                the panel.
		 */
		showActivePanel: function (panel, elements) {
			elements.push(null);

			var li = panel.content.parent('li');
			var activeOn = panel.activeOn;
			var effective = $();
			var count = 0;
			var j = elements.length;
			var i;

			for (i = 0; i < j; ++i) {
				if (activeOn(elements[i])) {
					++count;
					if (elements[i]) {
						$.merge(effective, elements[i]);
					}
				}
			}

			if (count) {
				panel.activate(effective);
			} else {
				panel.deactivate();
			}
		},

		/**
		 * Sets up the functionality, event listeners, and animation of the
		 * sidebar handle
		 */
		initToggler: function () {
			var that = this;
			var bar = this.container;
			var icon = bar.find('.aloha-sidebar-handle-icon');
			var toggledClass = 'aloha-sidebar-toggled';
			var bounceTimer;
			var isRight = (this.position === 'right');

			if (this.opened) {
				this.rotateHandleArrow(isRight ? 0 : 180, 0);
			}

			// configure the position of the sidebar handle
			$(function () {
				if (typeof Aloha.settings.sidebar !== 'undefined' &&
						Aloha.settings.sidebar.handle &&
						Aloha.settings.sidebar.handle.top) {
					$(bar.find('.aloha-sidebar-handle'))[0].style.top =
						Aloha.settings.sidebar.handle.top;
				}
			});

			bar.find('.aloha-sidebar-handle')
				.click(function () {
					if (bounceTimer) {
						clearInterval(bounceTimer);
					}

					icon.stop().css('marginLeft', 4);

					if (that.isOpen) {
						$(this).removeClass(toggledClass);
						that.close();
						that.isOpen = false;
					} else {
						$(this).addClass(toggledClass);
						that.open();
						that.isOpen = true;
					}
				}).hover(function () {
					var flag = that.isOpen ? -1 : 1;

					if (bounceTimer) {
						clearInterval(bounceTimer);
					}

					icon.stop();

					$(this).stop().animate(
						isRight ? {marginLeft: '-=' + (flag * 5)}
								: {marginRight: '-=' + (flag * 5)},
						200);

					bounceTimer = setInterval(function () {
						flag *= -1;
						icon.animate(
							isRight ? {left: '-=' + (flag * 4)}
									: {right: '-=' + (flag * 4)},
							300
						);
					}, 300);
				}, function () {
					if (bounceTimer) {
						clearInterval(bounceTimer);
					}

					icon.stop().css(isRight ? 'left' : 'right', 5);

					$(this).stop().animate(
						isRight ? {marginLeft: 0} : {marginRight: 0},
						600, 'easeOutElastic');
				});
		},

		/**
		 * Rounds the top corners of the first visible panel, and the bottom
		 * corners of the last visible panel elements in the panels ul list.
		 * @deprecated
		 * @fixme: css3
		 */
		roundCorners: function () {

			var bar = this.container;
			var lis = bar.find('.aloha-sidebar-panels>li:not(.aloha-sidebar-deactivated)');
			var topClass = 'aloha-sidebar-panel-top';
			var bottomClass = 'aloha-sidebar-panel-bottom';

			bar.find('.aloha-sidebar-panel-top, .aloha-sidebar-panel-bottom')
			   .removeClass(topClass)
			   .removeClass(bottomClass);

			lis.first().find('.aloha-sidebar-panel-title').addClass(topClass);
			lis.last().find('.aloha-sidebar-panel-content').addClass(bottomClass);
		},

		/**
		 * Updates the height of the inner div of the sidebar. This is done
		 * whenever the viewport is resized.
		 */
		updateHeight: function () {
			var h = $(window).height();
			this.container.height(h).find('.aloha-sidebar-inner').height(h);
		},

		/**
		 * Delegate all sidebar onclick events to the container.
		 * Then use handleBarclick method until we bubble up to the first
		 * significant element that we can interact with.
		 */
		barClicked: function (ev) {
			this.handleBarclick($(ev.target));
		},

		/**
		 * We handle all click events on the sidebar from here--dispatching
		 * calls to which ever methods that should be invoked for the each
		 * interaction.
		 */
		handleBarclick: function (el) {
			if (el.hasClass('aloha-sidebar-panel-title')) {
				this.togglePanel(el);
			} else if (!el.hasClass('aloha-sidebar-panel-content') &&
                       !el.hasClass('aloha-sidebar-handle') &&
                       !el.hasClass('aloha-sidebar-bar')) {
				this.handleBarclick(el.parent());
			}
		},

		getPanelById: function (id) {
			return this.panels[id];
		},

		getPanelByElement: function (el) {
			var li = (el[0].tagName === 'LI') ? el : el.parent('li');
			return this.getPanelById(li[0].id);
		},

		togglePanel: function (el) {
			this.getPanelByElement(el).toggle();
		},

		/**
		 * Animation to rotate the sidebar arrow
		 *
		 * @param {number} angle The angle two which the arrow should rotate
		 *						 (0 or 180).
		 * @param {number|String} duration (Optional) How long the animation
		 *                                 should play for.
		 */
		rotateHandleIcon: function (angle, duration) {
			var arr = this.container.find('.aloha-sidebar-handle-icon');
			arr.animate({angle: angle}, {
				duration : (typeof duration === 'number' ||
                            typeof duration === 'string') ? duration : 500,
				easing   : 'easeOutExpo',
				step     : function (val, fx) {
					arr.css({
						'-o-transform'      : 'rotate(' + val + 'deg)',
						'-webkit-transform' : 'rotate(' + val + 'deg)',
						'-moz-transform'    : 'rotate(' + val + 'deg)',
						'-ms-transform'     : 'rotate(' + val + 'deg)'
					  // We cannot use Microsoft Internet Explorer filters
					  // because Microsoft Internet Explore 8 does not support
					  // Microsoft Internet Explorer filters correctly. It
					  // breaks the layout
					  // filter             : 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (angle / 90) + ')'
					});
				}
			});
		},

		/**
		 * Sets the handle icon to the "i am opened, click me to close the
		 * sidebar" state, or vice versa. The direction of the arrow depends
		 * on whether the sidebar is on the left or right, and whether it is
		 * in an opened state or not.
		 *
		 * @param {boolean} isOpen Whether or not the sidebar is in the opened
		 *                         state.
		 */
		toggleHandleIcon: function (isOpen) {
			var isPointingLeft = (this.position === 'right') ^ isOpen;

			if (this.settings.rotateIcons) {
				this.rotateHandleIcon(isPointingLeft ? 180 : 0, 0);
			} else {
				var icon = this.container.find('.aloha-sidebar-handle-icon');

				if (isPointingLeft) {
					icon.addClass('aloha-sidebar-handle-icon-left');
				} else {
					icon.removeClass('aloha-sidebar-handle-icon-left');
				}
			}
		},

		/**
		 * Slides the sidebar into view
		 */
		open: function (duration, callback) {
			if (this.isOpen) {
				return this;
			}

			var isRight = (this.position === 'right');
			var anim = isRight ? {marginRight: 0} : {marginLeft: 0};

			this.toggleHandleIcon(true);
			this.container.animate(anim,
				(typeof duration === 'number' || typeof duration === 'string')
					? duration : 500,
				'easeOutExpo');

			if (!this.settings.overlayPage) {
				$('body').animate(
					isRight ? {marginRight: '+=' + this.width}
					        : {marginLeft: '+=' + this.width},
					500, 'easeOutExpo');
			}

			this.isOpen = true;
			this.correctHeight();

			$('body').trigger('aloha-sidebar-opened', this);

			return this;
		},

		/**
		 * Slides that sidebar out of view.
		 */
		close: function (duration, callback) {
			if (!this.isOpen) {
				return this;
			}

			var isRight = (this.position === 'right');
			var anim = isRight ? {marginRight: -this.width} : {marginLeft: -this.width};

			this.toggleHandleIcon(false);
			this.container.animate(anim,
				(typeof duration === 'number' || typeof duration === 'string')
					? duration : 500,
				'easeOutExpo');

			if (!this.settings.overlayPage) {
				$('body').animate(
					isRight ? {marginRight: '-=' + this.width}
					        : {marginLeft: '-=' + this.width},
					500, 'easeOutExpo');
			}

			this.isOpen = false;

			return this;
		},

		/**
		 * Activates the given panel and passes to it the given element as the
		 * the effective that we want it to think activated it.
		 *
		 * @param {object|String} panel Panel instance or the id of a panel
		 *								object.
		 * @param {jQuery} element Element to pass to the panel as effective
		 *	                       element (the element that activated it).
		 */
		activatePanel: function (panel, element) {
			if (typeof panel === 'string') {
				panel = this.getPanelById(panel);
			}

			if (panel) {
				panel.activate(element);
			}

			this.roundCorners();

			return this;
		},

		/**
		 * Invokes the expand method for the given panel so that it expands its
		 * height to display its contents
		 *
		 * @param {object|String} panel Panel instance or the id of a panel
		 *                              object.
		 * @param {funtion} callback
		 */
		expandPanel: function (panel, callback) {
			if (typeof panel === 'string') {
				panel = this.getPanelById(panel);
			}

			if (panel) {
				panel.expand(callback);
			}

			return this;
		},

		/**
		 * Collapses the panel contents by invoking the given panel's collapse
		 * method.
		 *
		 * @param {object|String} panel Panel instance or the id of a panel
		 *								object.
		 * @param {funtion} callback
		 */
		collapsePanel: function (panel, callback) {
			if (typeof panel === 'string') {
				panel = this.getPanelById(panel);
			}

			if (panel) {
				panel.collapse(callback);
			}

			return this;
		},

		/**
		 * Adds a panel to this sidebar instance.
		 * We try and build as much of the panel DOM as we can before inserting
		 * it into the DOM in order to reduce reflow.
		 *
		 * @param {object} panel - either a panel instance or an associative
		 *			   array containing settings for the construction
		 *			   of a new panel.
		 * @param {boolean} deferRounding - (Optional) If true, the rounding-off
		 *				    of the top most and bottom most panels
		 *				    will not be automatically done. Set
		 *				    this to true when adding a lot of panels
		 *				    at once.
		 * @return {object} The newly created panel.
		 */
		addPanel: function (panel, deferRounding) {
			if (!(panel instanceof Panel)) {
				if (!panel.width) {
					panel.width = this.width;
				}
				panel.sidebar = this;
				panel = new Panel(panel);
			}

			this.panels[panel.id] = panel;
			this.container.find('.aloha-sidebar-panels').append(panel.element);
			this.checkActivePanels(Selection.getRangeObject());
			return panel;
		}

	});

	// ------------------------------------------------------------------------
	// Panel prototype
	// ------------------------------------------------------------------------
	$.extend(Panel.prototype, {

		init: function (opts) {
			this.setTitle(opts.title).setContent(opts.content);

			delete opts.title;
			delete opts.content;

			$.extend(this, opts);

			if (!this.id) {
				this.id = 'aloha-sidebar-' + (++uid);
			}

			var li = this.element =
				$('<li id="' + this.id + '">').append(this.title, this.content);

			if (this.expanded) {
				this.content.height('auto');
			}

			this.toggleTitleIcon(this.expanded);
			this.coerceActiveOn();

			// Disable text selection on title element.
			this.title
				.attr('unselectable', 'on')
				.css('-moz-user-select', 'none')
				.each(function () { this.onselectstart = function () { return false; }; });

			if (typeof this.onInit === 'function') {
				this.onInit.apply(this);
			}
		},

		/**
		 * @param {boolean} isExpanded Whether or not the panel is in an
		 *                             expanded state.
		 */
		toggleTitleIcon: function (isExpanded) {
			if (this.sidebar.settings.rotateIcons) {
				this.rotateTitleIcon(isExpanded ? 90 : 0);
			} else {
				var icon = this.title.find('.aloha-sidebar-panel-title-arrow');

				if (isExpanded) {
					icon.addClass('aloha-sidebar-panel-title-arrow-down');
				} else {
					icon.removeClass('aloha-sidebar-panel-title-arrow-down');
				}
			}
		},

		/**
		 * Normalizes the activeOn property into a predicate function.
		 */
		coerceActiveOn: function () {
			if (typeof this.activeOn !== 'function') {
				var activeOn = this.activeOn;

				this.activeOn = (function () {
					var typeofActiveOn = typeof activeOn,
						fn;

					if (typeofActiveOn === 'boolean') {
						fn = function () {
							return activeOn;
						};
					} else if (typeofActiveOn === 'undefined') {
						fn = function () {
							return true;
						};
					} else if (typeofActiveOn === 'string') {
						fn = function (el) {
							return el ? el.is(activeOn) : false;
						};
					} else {
						fn = function () {
							return false;
						};
					}

					return fn;
				}());
			}
		},

		/**
		 * Activates (displays) this panel.
		 */
		activate: function (effective) {
			if (this.isActive) {
				return;
			}
			this.isActive = true;
			this.content.parent('li').show().removeClass('aloha-sidebar-deactivated');
			this.effectiveElement = effective;
			if (typeof this.onActivate === 'function') {
				this.onActivate.call(this, effective);
			}
		},

		/**
		 * Hides this panel.
		 */
		deactivate: function () {
			if (!this.isActive) {
				return;
			}
			this.isActive = false;
			this.content.parent('li').hide().addClass('aloha-sidebar-deactivated');
			this.effectiveElement = null;
		},

		toggle: function () {
			if (this.expanded) {
				this.collapse();
			} else {
				this.expand();
			}
		},

		/**
		 * Displays the panel's contents.
		 */
		expand: function (callback) {
			var that = this;
			var el = this.content;
			var old_h = el.height();
			var new_h = el.height('auto').height();
			el.height(old_h).stop().animate(
				{height: new_h}, 500, 'easeOutExpo',
				function () {
					if (typeof callback === 'function') {
						callback.call(that);
					}
				}
			);
			this.element.removeClass('collapsed');
			this.toggleTitleIcon(true);
			this.expanded = true;
			return this;
		},

		/**
		 * Hides the panel's contents--leaving only it's header.
		 */
		collapse: function (duration, callback) {
			var that = this;
			this.element.addClass('collapsed');
			this.content.stop().animate({height: 5}, 250, 'easeOutExpo',
				function () {
					if (typeof callback === 'function') {
						callback.call(that);
					}
				});
			this.toggleTitleIcon(false);
			this.expanded = false;
			return this;
		},

		/**
		 * May also be called by the Sidebar to update title of panel
		 *
		 * @param {string} html Markup string, DOM object, or jQuery object.
		 */
		setTitle: function (html) {
			this.title.find('.aloha-sidebar-panel-title-text').html(html);
			return this;
		},

		/**
		 * May also be called by the Sidebar to update content of panel
		 *
		 * @param {string|jQuery.<HTMLElement>|HTMLElement} html Markup string,
		 *                                                       DOM object, or
		 *                                                       jQuery object.
		 */
		setContent: function (html) {
			// We do this so that empty panels don't appear collapsed
			if (!html || html === '') {
				html = '&nbsp;';
			}

			this.content.find('.aloha-sidebar-panel-content-inner-text').html(html);
			return this;
		},

		rotateTitleIcon: function (angle, duration) {
			var arr = this.title.find('.aloha-sidebar-panel-title-arrow');
			arr.animate({angle: angle}, {
				duration : (typeof duration === 'number') ? duration : 500,
				easing   : 'easeOutExpo',
				step     : function (val, fx) {
					arr.css({
						'-o-transform'      : 'rotate(' + val + 'deg)',
						'-webkit-transform' : 'rotate(' + val + 'deg)',
						'-moz-transform'    : 'rotate(' + val + 'deg)',
						'-ms-transform'     : 'rotate(' + val + 'deg)'
					 // filter              : 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (angle / 90) + ')'
					});
				}
			});
		},

		/**
		 * Walks up the ancestors chain for the given effective element, and
		 * renders subpanels using the specified renderer function.
		 *
		 * @param {jQuery.<HTMLElement>} effective The effective element, whose
		 *                                         lineage we want to render.
		 * @param {function} renderer (Optional) function that will render each
		 *                                       element in the parental
		 *                                       lineage of the effective
		 *                                       element.
		 */
		renderEffectiveParents: function (effective, renderer) {
			var el = effective.first();
			var content = [];
			var path = [];
			var activeOn = this.activeOn;
			var l;
			var pathRev;

			while (el.length > 0 && !el.is('.aloha-editable')) {
				if (activeOn(el)) {
					path.push('<span>' + el[0].tagName.toLowerCase() + '</span>');
					l = path.length;
					pathRev = [];
					while (l--) {
						pathRev.push(path[l]);
					}
					content.push('<div class="aloha-sidebar-panel-parent">' +
						'<div class="aloha-sidebar-panel-parent-path">' +
							pathRev.join('') +
						'</div>' +
						'<div class="aloha-sidebar-panel-parent-content' +
							'aloha-sidebar-opened">' + (
							(typeof renderer === 'function')
								? renderer(el)
								: '----'
							) +
						'</div>' +
					 '</div>');
				}
				el = el.parent();
			}

			this.setContent(content.join(''));

			$('.aloha-sidebar-panel-parent-path').click(function () {
				var $content = $(this).parent().find(
					'.aloha-sidebar-panel-parent-content');
				if ($content.hasClass('aloha-sidebar-opened')) {
					$content.hide().removeClass('aloha-sidebar-opened');
				} else {
					$content.show().addClass('aloha-sidebar-opened');
				}
			});

			this.content.height('auto').find(
				'.aloha-sidebar-panel-content-inner').height('auto');
		}

	});

	var left = new Sidebar({
		position : 'left',
		width	 : 250 // TODO define in config
	});

	var right = new Sidebar({
		position : 'right',
		width	 : 250 // TODO define in config
	});

	Aloha.Sidebar = {
		left  : left,
		right : right
	};

	return Aloha.Sidebar;
});
