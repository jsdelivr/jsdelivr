/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define([
    'aloha',
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'format/format-plugin',
	'util/dom',
	'i18n!cite/nls/i18n',
	'i18n!aloha/nls/i18n'
], function CiteClosure (Aloha, jQuery, Plugin, FloatingMenu, Format, domUtils, i18n, i18nCore) {
	
	
	Aloha.require( ['css!cite/css/cite.css'] );
	
	var 
		GENTICS = window.GENTICS,
		$ = jQuery,
		ns  = 'aloha-cite',
		uid = +new Date,
		animating = false;
	
	// namespaced classnames
	var nsClasses = {
		quote         : nsClass('quote'),
		blockquote    : nsClass('blockquote'),
		'panel-label' : nsClass('panel-label'),
		'panel-field' : nsClass('panel-field'),
		'panel-btns'  : nsClass('panel-btns'),
		'link-field'  : nsClass('link-field'),
		'note-field'  : nsClass('note-field'),
		references    : nsClass('references')
	};
	
	// ------------------------------------------------------------------------
	// Local (helper) functions
	// ------------------------------------------------------------------------
	
	/**
	 * Simple templating
	 *
	 * @param {String} str - The string containing placeholder keys in curly
	 *                       brackets
	 * @param {Object} obj - Associative array of replacing placeholder keys
	 *                       with corresponding values
	 */
	function supplant (str, obj) {
		 return str.replace(/\{([a-z0-9\-\_]+)\}/ig, function (str, p1, offset, s) {
			 var replacement = obj[p1] || str;
			 return (typeof replacement === 'function') ? replacement() : replacement;
		 });
	};
	
	/**
	 * Wrapper to call the supplant method on a given string, taking the
	 * nsClasses object as the associative array containing the replacement
	 * pairs
	 *
	 * @param {String} str
	 * @return {String}
	 */
	function renderTemplate (str) {
		return (typeof str === 'string') ? supplant(str, nsClasses) : str;
	};
	
	/**
	 * Generates a selector string with this plugins's namespace prefixed the
	 * each classname
	 *
	 * Usage:
	 * 		nsSel('header,', 'main,', 'foooter ul')
	 * 		will return
	 * 		".aloha-myplugin-header, .aloha-myplugin-main, .aloha-mypluzgin-footer ul"
	 *
	 * @return {String}
	 */
	function nsSel () {
		var strBldr = [], prx = ns;
		$.each(arguments, function () { strBldr.push('.' + (this == '' ? prx : prx + '-' + this)); });
		return $.trim(strBldr.join(' '));
	};
	
	/**
	 * Generates a string with this plugins's namespace prefixed the each
	 * classname
	 *
	 * Usage:
	 *		nsClass('header', 'innerheaderdiv')
	 *		will return
	 *		"aloha-myplugin-header aloha-myplugin-innerheaderdiv"
	 *
	 * @return {String}
	 */
	function nsClass () {
		var strBldr = [], prx = ns;
		$.each(arguments, function () { strBldr.push(this == '' ? prx : prx + '-' + this); });
		return $.trim(strBldr.join(' '));
	};
	
	/**
	 * Coverts hexidecimal string #00ffcc into rgb array [0, 255, 127]
	 *
	 * @param {String} hex - Hexidecimal string representing color. In the form
	 *						 #ff3344 or #f34
	 * @return {Array} rgb representation of hexidecimal color
	 */
	function hex2rgb (hex) {
		var hex = hex.replace('#', '').split('');
		
		if (hex.length == 3) {
			hex[5] = hex[4] = hex[2];
			hex[3] = hex[2] = hex[1];
			hex[1] = hex[0];
		}
		
		var rgb = [];
		
		for (var i = 0; i < 3; ++i) {
			rgb[i] = parseInt('0x' + hex[i * 2] + hex[i * 2 + 1], 16);
		}
		
		return rgb;
	};
	
	// ------------------------------------------------------------------------
	// Plugin
	// ------------------------------------------------------------------------
	
	return Plugin.create('cite', {
		
		citations: [],
		referenceContainer: null,
		settings: null,
		
		init: function () {
			var that = this;
			
			// Harverst configuration options that may be defined outside of
			// the plugin
			if (Aloha.settings				&&
				Aloha.settings.plugins		&&
				Aloha.settings.plugins.cite) {
				var referenceContainer = $(Aloha.settings.plugins.cite.referenceContainer);
				
				if (referenceContainer.length > 0) {
					this.referenceContainer = referenceContainer;
				}
				
				if ( typeof Aloha.settings.plugins.cite != 'undefinded' ) {
					that.settings = Aloha.settings.plugins.cite;
				}

				if ( typeof that.settings.sidebar === 'undefinded' ) {
					that.settings.sidebar = {};
				}

				if ( typeof that.settings.sidebar.open === 'undefinded' ) {
					that.settings.sidebar.open = true;
				}
			}
			
			// Add the inline quote button in the floating menu, in the
			// standard manner...
			this.buttons = [];
			this.buttons[0] = new Aloha.ui.Button({
				name      : 'quote',
				text      : 'Quote',					// that.i18n('button.' + button + '.text'),
				tooltip   : i18n.t('cite.button.add.quote'),	// that.i18n('button.' + button + '.tooltip'),
				iconClass : nsClass('button','inline-button'),
				size      : 'small',
				toggle    : true,
				onclick   : function() {
					that.addInlineQuote();
				}
			});
			FloatingMenu.addButton(
				'Aloha.continuoustext',
				this.buttons[0],
				i18nCore.t('floatingmenu.tab.format'),
				1
			);
			
			// We brute-forcishly push our button settings into the
			// multiSplitButton. The multiSplitButton will pick it up and
			// render it. Nevertheless, because this button is added so late,
			// it means that it will not be automatically shown when doLayout
			// is called on the FloatingMenu. We therefore have to do it
			// ourselves at aloha-selection-changed.
			Format.multiSplitButton.items.push({
				name      : 'blockquote',
				text      : 'Blockquote',					// that.i18n('button.' + button + '.text'),
				tooltip   : i18n.t('cite.button.add.blockquote'),	// that.i18n('button.' + button + '.tooltip'),
				iconClass : nsClass('button', 'block-button'),
				click     : function() {
					that.addBlockQuote();
				}
			});
			
			this.sidebar = null;
			
			var citePlugin = this;
			
			// Note that if the sidebar is not loaded,
			// aloha-sidebar-initialized will not fire and this listener will
			// not be called, which is what we would want if there are no
			// sidebars
			Aloha.ready( function (ev) {
				citePlugin.sidebar = Aloha.Sidebar.right.show();
				// citePlugin.sidebar.settings.overlayPage = false;
				citePlugin.sidebar.addPanel({
					id       : nsClass('sidebar-panel'),
					title    : 'Citation',
					content  : '',
					expanded : true,
					activeOn : '.aloha-cite-wrapper',
					
					// Executed once, when this panel object is instantialized
					onInit   : function () {
						var that = this;
						var content = this.setContent(renderTemplate(
							   '<div class="{panel-label}">Link:</div>\
								<div class="{panel-field} {link-field}" style="margin: 5px;"><input type="text" /></div>'
								+ (citePlugin.referenceContainer
									? '<div class="{panel-label}">Note:</div>\
									   <div class="{panel-field} {note-field}" style="margin: 5px;"><textarea></textarea></div>'
									: '')
							)).content;
						
						content.find('input, textarea').bind('keypress change', function () {
							var content = that.content;
							
							citePlugin.addCiteDetails(
								content.attr('data-cite-id'),
								content.find(nsSel('link-field input')).val(),
								content.find(nsSel('note-field textarea')).val()
							);
						});
					},
					
					/**
					 * Invoked during aloha-selection-changed, if activeOn
					 * function returns true for the current selection.
					 * Will populate panel fields with the details of the
					 * selected citation if they are already available.
					 * If no citation exists for the selected quotation, then
					 * one will be created for it first.
					 */
					onActivate: function (effective) {
						var uid     = effective.attr('data-cite-id');
						var index   = that.getIndexOfCitation(uid);
						var content = this.content;
						
						if (index == -1) {
							index = that.citations.push({
								uid   : uid,
								link  : null,
								notes : null
							}) - 1;
						}
						
						content.attr('data-cite-id', uid);
						content.find(nsSel('link-field input')).val(effective.attr('cite')); //.focus();
						content.find(nsSel('note-field textarea')).val(that.citations[index].note);
					}
					
				});
			});
			
			Aloha.bind('aloha-selection-changed', function(event, rangeObject){
				Format.multiSplitButton.showItem('blockquote');
				
				var buttons = $('button' + nsSel('button'));
				
				$.each(that.buttons, function(index, button) {
					// set to false to prevent multiple buttons being active when they should not
					var statusWasSet = false;
					var tagName;
					var effective = rangeObject.markupEffectiveAtStart;
					var i = effective.length;
					
					// check whether any of the effective items are citation tags
					while (i--) {
						tagName = effective[i].tagName.toLowerCase();
						if ('q' == tagName || 'blockquote' == tagName) {
							statusWasSet = true;
							break;
						}
					}
					
					buttons.filter(nsSel('block-button')).removeClass(nsClass('pressed'));
					that.buttons[0].setPressed(false);
					
					if (statusWasSet) {
						if(tagName == 'q') {
							that.buttons[0].setPressed(true);
						} else {
							buttons.filter(nsSel('block-button'))
								.addClass(nsClass('pressed'));
						}
						
						// We've got what we came for, so return false to break the each loop
						return false;
					}
				});
			});
		},
		
		/**
		 * Do a binary search through all citations for a given uid.
		 * The bit shifting may be a *bit* of an overkill, but with big lists
		 * it proves to be significantly more performant
		 *
		 * @param {String} uid - uid of citation
		 */
		getIndexOfCitation: function (uid) {
			var c   = this.citations;
			var max = c.length;
			var min = 0;
			var mid;
			var cuid;
			
			// Infinite loop guard for debugging.
			// So your tab/browser doesn't freeze up like a Christmas turkey ;-)
			// var __guard = 1000;
			
			while (min < max /* && --__guard */) {
				mid = (min + max) >> 1; // Math.floor(i) / 2 == i >> 1 == ~~(i / 2)
				if ((cuid = c[mid].uid) == uid) {
					return mid;
				} else if (cuid > uid) {
					max = mid;
				} else if (cuid < uid) {
					min = mid + 1;
				}
			}
			
			return -1;
		},
		
		addBlockQuote: function () {
			var that = this;
			var classes = [nsClass('wrapper'), nsClass(++uid)].join(' ');
			var markup = $(supplant(
					'<blockquote class="{classes}" data-cite-id="{uid}"></blockquote>',
					{uid:uid, classes:classes}
				));
			
			// now re enable the editable
			if (Aloha.activeEditable) {
				jQuery(Aloha.activeEditable.obj[0]).click();
			}
			
			Aloha.Selection.changeMarkupOnSelection(markup);
			
			this.referenceContainer && this.addCiteToReferences(uid);
			
			if (this.sidebar && that.settings.sidebar.open === true) {
				this.sidebar.open();
			}
			//	.activatePanel(nsClass('sidebar-panel'), markup);
		},
		
		addInlineQuote: function () {
			var classes = [nsClass('wrapper'), nsClass(++uid)].join(' ');
			var markup = $(supplant(
					'<q class="{classes}" data-cite-id="{uid}"></q>',
					{uid:uid, classes:classes}
				));
			var rangeObject = Aloha.Selection.rangeObject;
			var foundMarkup;
			var that = this;

			// now re enable the editable
			if (Aloha.activeEditable) {
				jQuery(Aloha.activeEditable.obj[0]).click();
			}

			// check whether the markup is found in the range (at the start of the range)
			foundMarkup = rangeObject.findMarkup(function() {
				if (this.nodeName && markup.get(0) &&
					(typeof this.nodeName === 'string') &&
					(typeof markup.get(0).nodeName === 'string')) {
					return this.nodeName.toLowerCase() == markup.get(0).nodeName.toLowerCase();
				}
				
				return false;
			}, Aloha.activeEditable.obj);

			if (foundMarkup) {
				// remove the markup
				if (rangeObject.isCollapsed()) {
					// when the range is collapsed, we remove exactly the one DOM element
					domUtils.removeFromDOM(foundMarkup, rangeObject, true);
				} else {
					// the range is not collapsed, so we remove the markup from the range
					domUtils.removeMarkup(rangeObject, markup, Aloha.activeEditable.obj);
				}
			} else {
				// when the range is collapsed, extend it to a word
				if (rangeObject.isCollapsed()) {
					domUtils.extendToWord(rangeObject);
				}

				// add the markup
				domUtils.addMarkup(rangeObject, markup);
			}
			
			// select the modified range
			rangeObject.select();
			
			this.referenceContainer && this.addCiteToReferences(uid);

			if (this.sidebar && that.settings.sidebar.open === true) {
				this.sidebar.open();
			}
			//	.activatePanel(nsClass('sidebar-panel'), markup);
			
			return false;
		},
		
		/**
		 * Adds an item for the citation matching the given uid to the
		 * references list. If no OL list for references exist, we create one.
		 * This method will assume that this.referenceContainer is a jQuery
		 * object container into which the references list should be built.
		 *
		 * @param {String} uid - uid of citation
		 */
		addCiteToReferences: function (uid) {
			var index = this.getIndexOfCitation(uid);
			
			if (index == -1) {
				return;
			}
			
			var wrapper = $('.aloha-editable-active ' + nsSel(uid));
			var note    = 'cite-note-' + uid;
			var ref     = 'cite-ref-'  + uid;
			
			wrapper.append(
				supplant(
					'<sup id="{ref}" contenteditable="false"><a href="#{note}">[{count}]</a></sup>',
					{
						ref   : ref,
						note  : note,
						count : index + 1
					}
				)
			);
			
			if (this.referenceContainer.find('ol.references').length == 0) {
				this.referenceContainer
					.append('<h2>References</h2>')
					.append('<ol class="references"></ol>');
			}
			
			this.referenceContainer.find('ol.references').append(
				supplant(
					'<li id="{note}"><a href="#{ref}">^</a> &nbsp; <span></span></li>',
					{
						ref  : ref,
						note : note
					}
				)
			);
		},
		
		/**
		 * Responsible for updating the citation reference in memory, and in
		 * the references list when a user adds or changes information for a
		 * given citation
		 *
		 * @param {String} uid
		 * @param {String} link
		 * @param {String} note
		 */
		addCiteDetails: function (uid, link, note) {
			this.citations[this.getIndexOfCitation(uid)] = {
				uid  : uid,
				link : link,
				note : note
			};
			
			if (link) {
				// Update link attribute
				var el = $(nsSel(uid)).attr('cite', link);
				
				// Highlight animation for happy user
				var round = Math.round;
				var from  = hex2rgb('#fdff9a');
				var to    = hex2rgb('#fdff9a');
				
				from.push(1);
				to.push(0);
				
				var diff = [ to[0] - from[0],
							 to[1] - from[1],
							 to[2] - from[2],
							 to[3] - from[3] ];
				
				el.css({
					__tick: 0,
					'background-color': 'rgba(' + from.join(',') + ')',
					'box-shadow': '0 0 20px rgba(' + from.join(',') + ')'
				})
				if ( !animating ) {
					animating = true;
					el.animate({__tick: 1}, {
						duration: 500,
						easing: 'linear',
						step: function (val, fx) {
							var rgba = [ round(from[0] + diff[0] * val),
							             round(from[1] + diff[1] * val),
							             round(from[2] + diff[2] * val),
							             from[3] + diff[3] * val   ];
							
							$(this).css({
								'background-color': 'rgba(' + rgba.join(',') + ')',
								'box-shadow': '0 0 ' + (20 * (1 - val)) + 'px rgba(' + from.join(',') + ')'
							});
						},
						complete: function() {
							animating = false;
						}
					});
				}
			}
			
			// Update information in references list for this citation
			if (this.referenceContainer) {
				$('li#cite-note-' + uid + ' span').html(
					supplant(
						link ? '<a class="external" target="_blank" href="{url}">{url}</a>' : '',
						{url:link}
					) + (note ? '. ' + note : '')
				)
			}
		},
		
		toString: function () {
			return 'aloha-citiation-plugin';
		}
		
	});
	
});

