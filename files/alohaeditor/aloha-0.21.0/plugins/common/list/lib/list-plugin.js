/* list-plugin.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
 */
define([
	'aloha',
	'jquery',
	'aloha/plugin',
	'ui/ui',
	'ui/scopes',
	'ui/button',
	'ui/toggleButton',
	'i18n!list/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/engine',
	'PubSub'
], function(
	Aloha,
	jQuery,
	Plugin,
	Ui,
	Scopes,
	Button,
	ToggleButton,
	i18n,
	i18nCore,
	Engine,
	PubSub
) {
	

	var GENTICS = window.GENTICS;

	/**
	 * Register the ListPlugin as Aloha.Plugin
	 */
	var ListPlugin = Plugin.create('list', {
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de', 'fr', 'eo', 'fi', 'ru', 'it'],

		/**
		 * default button configuration
		 */
		config: [ 'ul', 'ol' ],

		/**
		 * List of transformable elements
		 */
		transformableElements: {'p' : true, 'h1' : true, 'h2' : true, 'h3' : true, 'h4' : true, 'h5' : true, 'h6' : true, 'ul' : true, 'ol' : true},

		/**
		 * Initialize the plugin, register the buttons
		 */
		init: function() {

			var that = this;

			this._orderedListButton = Ui.adopt("orderedList", ToggleButton, {
				tooltip: i18n.t("button.createolist.tooltip"),
				icon: "aloha-icon aloha-icon-orderedlist",
				scope: 'Aloha.continuoustext',
				click: function(){
					that.transformList(true);
				}
			});

			this._unorderedListButton = Ui.adopt("unorderedList", ToggleButton, {
				tooltip: i18n.t("button.createulist.tooltip"),
				icon: "aloha-icon aloha-icon-unorderedlist",
				scope: 'Aloha.continuoustext',
				click: function(){
					that.transformList(false);
				}
			});

			this._indentListButton = Ui.adopt("indentList", Button, {
				tooltip: i18n.t('button.indentlist.tooltip'),
				icon: 'aloha-icon aloha-icon-indent',
				scope: 'Aloha.continuoustext',
				click: function() {
					that.indentList();
				}
			});

			this._outdentListButton = Ui.adopt("outdentList", Button, {
				tooltip: i18n.t('button.outdentlist.tooltip'),
				icon: 'aloha-icon aloha-icon-outdent',
				scope: 'Aloha.continuoustext',
				click: function() {
					that.outdentList();
				}
			});

			Scopes.createScope('Aloha.List', 'Aloha.continuoustext');

			// add the event handler for context selection change
			PubSub.sub('aloha.selection.context-change', function(message){
				var i,
					effectiveMarkup,
					rangeObject = message.range;
				
				// Hide all buttons in the list tab will make the list tab disappear
				that._outdentListButton.show(false);
				that._indentListButton.show(false);
				that._unorderedListButton.setState(false);
				that._orderedListButton.setState(false);
				
				for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
					effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
					if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ul></ul>'))) {
						that._unorderedListButton.setState(true);
						// Show all buttons in the list tab
						that._outdentListButton.show(true);
						that._indentListButton.show(true);
						break;
					}
					if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ol></ol>'))) {
						that._orderedListButton.setState(true);
						// Show all buttons in the list tab
						that._outdentListButton.show(true);
						that._indentListButton.show(true);
						break;
					}
				}

				if (Aloha.activeEditable) {
					that.applyButtonConfig(Aloha.activeEditable.obj);
				}
			});

			// add the key handler for Tab
			Aloha.Markup.addKeyHandler(9, function(event) {
				return that.processTab(event);
			});
		},

		/**
		 * Applys a configuration specific for an editable
		 * buttons not available in this configuration are hidden
		 * @param {jQuery} obj jQuery object of the activated editable
		 */
		applyButtonConfig: function (obj) {
			var config = this.getEditableConfig(obj);

			if (Aloha.Selection.rangeObject.unmodifiableMarkupAtStart[0]) {
				// show/hide them according to the config
				if (jQuery.inArray('ul', config) != -1 && Aloha.Selection.canTag1WrapTag2(Aloha.Selection.rangeObject.unmodifiableMarkupAtStart[0].nodeName, "ul") != -1) {
					this._unorderedListButton.show(true);
				} else {
					this._unorderedListButton.show(false);
				}

				if (jQuery.inArray('ol', config) != -1 && Aloha.Selection.canTag1WrapTag2(Aloha.Selection.rangeObject.unmodifiableMarkupAtStart[0].nodeName, "ol") != -1) {
					this._orderedListButton.show(true);
				} else {
					this._orderedListButton.show(false);
				}

			}
		},
		
		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * Find all li tags and remove editing attributes
		 * @param obj jQuery object to make clean
		 * @return void
		 */
		makeClean: function (obj) {
			// find all li tags
			obj.find('li').each(function () {
				// Remove IE attributes
				jQuery(this).removeAttr('hidefocus');
				jQuery(this).removeAttr('hideFocus');
				jQuery(this).removeAttr('tabindex');
				jQuery(this).removeAttr('tabIndex');
			});
		},

		/**
		 * Process Tab and Shift-Tab pressed in lists
		 */
		processTab: function (event) {
			if (event.keyCode === 9/*tab*/ ) {
				if (event.shiftKey) {
					return this.outdentList();
				} else {
					return this.indentList();
				}
			}
			return true;
		},

		/**
		 * For the current selection, get the DOM object, which will be transformed to/from the list
		 * @return dom object or false
		 */
		getStartingDomObjectToTransform: function () {
			var rangeObject = Aloha.Selection.rangeObject,
				i, effectiveMarkup;

			for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
				effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
				if (this.transformableElements[effectiveMarkup.nodeName.toLowerCase()]) {
					return effectiveMarkup;
				}
			}

			return false;
		},

		/**
		 * For the current selection, get the nearest list item as dom object
		 * @return dom object or false
		 */
		getNearestSelectedListItem: function () {
			var rangeObject = Aloha.Selection.rangeObject,
				i, effectiveMarkup;

			for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
				effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
				if (GENTICS.Utils.Dom.isListElement(effectiveMarkup)) {
					return effectiveMarkup;
				}
			}

			return false;
		},

		/**
		 * Transform the current selection to/from a list
		 * @param ordered true when transforming to/from an ordered list, false for unordered lists
		 */
		transformList: function (ordered) {
			var domToTransform = this.getStartingDomObjectToTransform(),
				lastLi, i, jqNewLi, jqList, selectedSiblings, jqParentList,
				newPara, jqToTransform, nodeName;

			// visible is set to true, but the button is not visible
			this._outdentListButton.show(true);
			this._indentListButton.show(true);

			if (!domToTransform) {
				// wrap a paragraph around the selection
				Aloha.Selection.changeMarkupOnSelection(jQuery('<p></p>'));
				domToTransform = this.getStartingDomObjectToTransform();

				if (!domToTransform) {
					if ( Aloha.Selection.rangeObject.startContainer.contentEditable ) {
						// create a new list with an empty item
						jqList = ordered ? jQuery('<ol></ol>') : jQuery('<ul></ul>');
						jqNewLi = jQuery('<li></li>');
						jqList.append(jqNewLi);
						
						var li = jqNewLi.get(0);
						var editable = Aloha.getActiveEditable().obj;
						//IE7 requires an (empty or non-empty) text node
						//inside the li for the selection to work.
						li.appendChild(document.createTextNode(""));

						editable.append(jqList);
						editable.focus();

						var range = Aloha.createRange();
						var selection = Aloha.getSelection();
						range.setStart( li.firstChild, 0 );
						range.setEnd( li.firstChild, 0 );
						selection.removeAllRanges();
						selection.addRange( range );
						Aloha.Selection.updateSelection();
						
						return;
					} else {
					Aloha.Log.error(this, 'Could not transform selection into a list');
					return;
				}
			}
			}

			// check the dom object
			nodeName = domToTransform.nodeName.toLowerCase();

			if (nodeName == 'ul' && !ordered) {
				// first check whether the list is nested into another list
				jqList = jQuery(domToTransform);

				jqParentList = jqList.parent();
				if (jqParentList.length > 0
						&& GENTICS.Utils.Dom.isListElement(jqParentList.get(0))) {
					// when the list is nested into another, our list items will be
					// added to the list items of the outer list

					// find the place where to put the children of the inner list
					if (jqParentList.get(0).nodeName.toLowerCase() === 'li') {
						// inner table is nested in a li (this conforms to the html5 spec)
						jqParentList.after(jqList.children());
						jqList.remove();
					} else {
						// inner table is nested in the outer list directly (this violates the html5 spec)
						jqList.children().unwrap();
					}
				} else {
					// we are in an unordered list and shall transform it to paragraphs

					// transform all li into p
					jqToTransform = jQuery(domToTransform);
					jQuery.each(jqToTransform.children('li'), function(index, li) {
						newPara = Aloha.Markup.transformDomObject(li, 'p', Aloha.Selection.rangeObject);
						// if any lists are in the paragraph, move the to after the paragraph
						newPara.after(newPara.children('ol,ul'));
					});

					// unwrap the li (remove the enclosing ul)
					jqToTransform.children().unwrap();
				}
			} else if (nodeName == 'ul' && ordered) {
				// we are in an unordered list and shall transform it to an ordered list

				// transform the ul into an ol
				Aloha.Markup.transformDomObject(domToTransform, 'ol', Aloha.Selection.rangeObject);

				// merge adjacent lists
				this.mergeAdjacentLists(jQuery(domToTransform));
			} else if (nodeName == 'ol' && !ordered) {
				// we are in an ordered list and shall transform it to an unordered list

				// transform the ol into an ul
				Aloha.Markup.transformDomObject(domToTransform, 'ul', Aloha.Selection.rangeObject);

				// merge adjacent lists
				this.mergeAdjacentLists(jQuery(domToTransform));
			} else if (nodeName == 'ol' && ordered) {
				// first check whether the list is nested into another list
				jqList = jQuery(domToTransform);

				jqParentList = jqList.parent();
				if (jqParentList.length > 0
						&& GENTICS.Utils.Dom.isListElement(jqParentList.get(0))) {
					// when the list is nested into another, our list items will be
					// added to the list items of the outer list

					// find the place where to put the children of the inner list
					if (jqParentList.get(0).nodeName.toLowerCase() === 'li') {
						// inner table is nested in a li (this conforms to the html5 spec)
						jqParentList.after(jqList.children());
						jqList.remove();
					} else {
						// inner table is nested in the outer list directly (this violates the html5 spec)
						jqList.children().unwrap();
					}
				} else {
					// we are in an unordered list and shall transform it to paragraphs

					// transform all li into p
					jqToTransform = jQuery(domToTransform);
					jQuery.each(jqToTransform.children('li'), function(index, li) {
						newPara = Aloha.Markup.transformDomObject(li, 'p', Aloha.Selection.rangeObject);
						// if any lists are in the paragraph, move the to after the paragraph
						newPara.after(newPara.children('ol,ul'));
					});

					// unwrap the li (remove the enclosing ul)
					jqToTransform.children().unwrap();
				}
			} else {
				// we are in something different from a list and shall transform it into a list

				// get the also selected siblings of the dom object
				selectedSiblings = Aloha.Selection.rangeObject.getSelectedSiblings(domToTransform);

				// create a new list
				jqList = ordered ? jQuery('<ol></ol>') : jQuery('<ul></ul>');
				// add a new list item
				jqNewLi = jQuery('<li></li>');
				// add the li into the list
				jqList.append(jqNewLi);
				// append the contents of the old dom element to the li
				jQuery(domToTransform).contents().appendTo(jqNewLi);
				// replace the old dom element with the new list
				jQuery(domToTransform).replaceWith(jqList);

				// update the selection range
				if (Aloha.Selection.rangeObject.startContainer == domToTransform) {
					Aloha.Selection.rangeObject.startContainer = jqNewLi.get(0);
				}
				if (Aloha.Selection.rangeObject.endContainer == domToTransform) {
					Aloha.Selection.rangeObject.endContainer = jqNewLi.get(0);
				}

				var lastAppendedLi = jqNewLi;

				// now also transform all siblings
				if (selectedSiblings) {
					lastLi = false;
					for ( i = 0; i < selectedSiblings.length; ++i) {
						if (GENTICS.Utils.Dom.isBlockLevelElement(selectedSiblings[i])) {
							if (lastLi) {
								lastLi = false;
							}

							// transform the block level element
							jqNewLi = Aloha.Markup.transformDomObject(selectedSiblings[i], 'li', Aloha.Selection.rangeObject);
							jqList.append(jqNewLi);
							lastAppendedLi = jqNewLi;
						} else {
							if (selectedSiblings[i].nodeType == 3
									&& jQuery.trim(selectedSiblings[i].data).length === 0) {
								continue;
							}
							if (!lastLi) {
								lastLi = jQuery('<li></li>');
								jqList.append(lastLi);
								lastAppendedLi = lastLi;
							}
							lastLi.append(selectedSiblings[i]);
						}
					}
				}

				// merge adjacent lists
				this.mergeAdjacentLists(jqList);

				//use rangy to change the selection to the contents of
				//the last li that was appended to the list
				var li = lastAppendedLi.get(0);
				if (GENTICS.Utils.Dom.isEmpty(li)) {
					var range = Aloha.createRange();
					var selection = Aloha.getSelection();
					//IE7 requires an (empty or non-empty) text node
					//inside the li for the selection to work.
					li.appendChild(document.createTextNode(""));
					range.selectNodeContents( li.lastChild );
					selection.removeAllRanges();
					selection.addRange( range );
					Aloha.Selection.updateSelection();
				}
			}

			// refresh the selection
			this.refreshSelection();
		},

		/**
		 * Indent the selected list items by moving them into a new created, nested list
		 */
		indentList: function () {
			var listItem = this.getNearestSelectedListItem(),
				i, jqNewList, selectedSiblings, jqOldList, jqItemBefore;

			if (listItem) {
				jqItemBefore = jQuery(listItem).prev('li');

				// when we are in the first li of a list, there is no indenting
				if (jqItemBefore.length === 0) {
					// but we handled the TAB keystroke
					return false;
				}
				jqOldList = jQuery(listItem).parent();

				// get the also selected siblings of the dom object
				selectedSiblings = Aloha.Selection.rangeObject.getSelectedSiblings(listItem);

				// create the new list element by cloning the selected list element's parent
				jqNewList = jQuery(listItem).parent().clone(false).empty();
				jqNewList.append(listItem);

				// we found a list item before the first selected one, so append the new list to it
				jqItemBefore.append(jqNewList);

				// check for multiple selected items
				if (selectedSiblings) {
					for ( i = 0; i < selectedSiblings.length; ++i) {
						jqNewList.append(jQuery(selectedSiblings[i]));
					}
				}

				// merge adjacent lists
				this.mergeAdjacentLists(jqNewList, true);

				// refresh the selection
				this.refreshSelection();

				return false;
			}

			return true;
		},

		/**
		 * Outdent nested list items by moving them into the outer list
		 */
		outdentList: function () {
			var
				listItem = this.getNearestSelectedListItem(),
				i, jqNewPostList,
				jqListItem, jqList, jqParentList, wrappingLi,
				selectedSiblings, lastSelected;

			if (listItem) {
				// check whether the list is nested into another list
				jqListItem = jQuery(listItem);
				jqList = jqListItem.parent();

				// get the parent list
				jqParentList = jqList.parents('ul,ol');

				// check whether the inner list is directly inserted into a li element
				wrappingLi = jqList.parent('li');

				if (jqParentList.length > 0
						&& GENTICS.Utils.Dom.isListElement(jqParentList.get(0))) {
					// the list is nested into another list

					// get the also selected siblings of the dom object
					selectedSiblings = Aloha.Selection.rangeObject.getSelectedSiblings(listItem);

					// check for multiple selected items
					if (selectedSiblings && selectedSiblings.length > 0) {
						lastSelected = jQuery(selectedSiblings[selectedSiblings.length - 1]);
					} else {
						lastSelected = jqListItem;
					}

					// check whether we found not selected li's after the selection
					if (lastSelected.nextAll('li').length > 0) {
						jqNewPostList = jqList.clone(false).empty();
						jqNewPostList.append(lastSelected.nextAll());
						lastSelected.append(jqNewPostList);
					}

					// now move all selected li's into the higher list
					if (wrappingLi.length > 0) {
						wrappingLi.after(jqListItem);
					} else {
						jqList.before(jqListItem);
					}

					// check for multiple selected items
					if (selectedSiblings && selectedSiblings.length > 0) {
						for ( i = selectedSiblings.length - 1; i >= 0; --i) {
							jqListItem.after(jQuery(selectedSiblings[i]));
						}
					}

					// finally check whether there are elements left in the list
					if (jqList.contents('li').length === 0) {
						// list is completely empty, so remove it
						jqList.remove();
					}

					// check whether the wrapping li is empty now
					if (wrappingLi.length > 0 && wrappingLi.contents().length === 0) {
						wrappingLi.remove();
					}

					// refresh the selection
					this.refreshSelection();
				}

				return false;
			}

			return true;
		},

		/**
		 * Refresh the current selection and set to focus to the current editable again
		 */
		refreshSelection: function () {
			Aloha.Selection.rangeObject.update();
			Aloha.Selection.rangeObject.select();
			Aloha.Selection.updateSelection();
		},

		/**
		 * Merge adjacent lists (of same type) into the first list
		 * @param jqList jQuery object of a list
		 * @param allTypes true if all types of lists may be merged, false if only same types may be merged
		 */
		mergeAdjacentLists: function (jqList, allTypes) {
			// first get the first previous sibling of same type
			var firstList = jqList.get(0), jqNextList;

			while (
				firstList.previousSibling
				&& firstList.previousSibling.nodeType === 1
				&& this.isMergable(firstList.previousSibling, firstList, allTypes)
			) {
				firstList = firstList.previousSibling;
			}

			jqList = jQuery(firstList);
			// now merge all adjacent lists into this one
			while (
				firstList.nextSibling
				&& (
					(
						firstList.nextSibling.nodeType === 1
						&& this.isMergable(firstList.nextSibling, firstList, allTypes)
					) || (
						firstList.nextSibling.nodeType === 3
						&& jQuery.trim(firstList.nextSibling.data).length === 0
					)
				)
			) {
				jqNextList = jQuery(firstList.nextSibling);
				if (firstList.nextSibling.nodeType == 1) {
					jqNextList.contents().appendTo(jqList);
				}
				jqNextList.remove();
			}
		},

		/**
		 * Check whether the given DOM element toCheck is mergeable into the DOM element mergeInto
		 * @param toCheck DOM element to check
		 * @param mergeInto DOM element into which toCheck shall be merged
		 * @param allTypes true if all types of lists may be merged, false if only same types may be merged
		 */
		isMergable: function (toCheck, mergeInto, allTypes) {
			if (allTypes) {
				return toCheck.nodeName.toLowerCase() == 'ul' || toCheck.nodeName.toLowerCase() == 'ol';
			} else {
				return toCheck.nodeName == mergeInto.nodeName;
			}
		}
	});

	/**
	 * 
	 */
	Engine.commands['insertorderedlist'] = {
		action: function(value, range) {
			ListPlugin.transformList(true);
			if (range && Aloha.Selection.rangeObject) {
				range.startContainer = Aloha.Selection.rangeObject.startContainer;
				range.startOffset = Aloha.Selection.rangeObject.startOffset;
				range.endContainer = Aloha.Selection.rangeObject.endContainer;
				range.endOffset = Aloha.Selection.rangeObject.endOffset;
			}
		},
		indeterm: function() {
			// TODO
		},
		state: function() {
			for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
				effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
				if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ul></ul>'))) {
					return false;
				}
				if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ol></ol>'))) {
					return true;
				}
			}

			return false;
		}
	};

	Engine.commands['insertunorderedlist'] = {
		action: function(value, range) {
			ListPlugin.transformList(false);
			if (range && Aloha.Selection.rangeObject) {
				range.startContainer = Aloha.Selection.rangeObject.startContainer;
				range.startOffset = Aloha.Selection.rangeObject.startOffset;
				range.endContainer = Aloha.Selection.rangeObject.endContainer;
				range.endOffset = Aloha.Selection.rangeObject.endOffset;
			}
		},
		indeterm: function() {
			// TODO
		},
		state: function() {
			for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
				effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
				if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ul></ul>'))) {
					return true;
				}
				if (Aloha.Selection.standardTagNameComparator(effectiveMarkup, jQuery('<ol></ol>'))) {
					return false;
				}
			}

			return false;
		}
	};

	Engine.commands['indent'] = {
		action: function(value, range) {
			ListPlugin.indentList();
			if (range && Aloha.Selection.rangeObject) {
				range.startContainer = Aloha.Selection.rangeObject.startContainer;
				range.startOffset = Aloha.Selection.rangeObject.startOffset;
				range.endContainer = Aloha.Selection.rangeObject.endContainer;
				range.endOffset = Aloha.Selection.rangeObject.endOffset;
			}
		},
		indeterm: function() {
			// TODO
		},
		state: function() {
			// TODO
			return false;
		}
	};

	Engine.commands['outdent'] = {
		action: function(value, range) {
			ListPlugin.outdentList();
			if (range && Aloha.Selection.rangeObject) {
				range.startContainer = Aloha.Selection.rangeObject.startContainer;
				range.startOffset = Aloha.Selection.rangeObject.startOffset;
				range.endContainer = Aloha.Selection.rangeObject.endContainer;
				range.endOffset = Aloha.Selection.rangeObject.endOffset;
			}
		},
		indeterm: function() {
			// TODO
		},
		state: function() {
			// TODO
			return false;
		}
	};

	/**
	 * A key handler that should be run as a keyup handler for the
	 * backspace and del keys. keyup fires after the browser has already
	 * performed the delete - this handler will perform a cleanup if
	 * necessary.
	 *
	 * Will work around an IE bug which breaks nested lists in the
	 * following situation, where [] is the selection, if backspace is
	 * pressed (same goes for the del key if the selection is at the end
	 * of the li that occurs before the selection):
	 *
	 * <ul>
	 *  <li>one</li>
	 *  <li><ul><li>two</li></ul></li>
	 * </ul>
	 * <p>[]</p>
	 *
	 * The browser behaviour, if one would presses backspace, results in
	 * the following:
	 *
	 * <ul>
	 *  <li>one</li>
	 *  <ul><li>two</li></ul>
	 * </ul>
	 *
	 * which is invalid HTML since the <ul>s are nested directly inside
	 * each other.
	 *
	 * Also, the following situation will cause the kind of invalid HTML
	 * as above.
	 * <ul>
	 *   <li>one</li>
	 *   <li><ul><li>two</li></ul></li>
	 *   <li>[]three</li>
	 * </ul>
	 *
	 * Also, the following situtation:
	 * <ul>
	 *   <li>one</li>
	 *   <li><ul><li>two</li></ul>
	 *       <p>[]three</p>
	 *       <li>four</li>
	 *   </li>
	 * </ul>
	 *
	 * And similar situations, some of which are not so easy to reproduce.
	 * 
	 * @param event a jQuery key event
	 * @return false if no action needed to be taken, true if cleanup has been performed
	 */
	function deleteWorkaroundHandler(event) {
		if (8/*backspace*/ != event.keyCode && 46/*del*/ != event.keyCode) {
			return false;
		}

		var rangeObj = Aloha.getSelection().getRangeAt(0);
		var startContainer = rangeObj.startContainer;

		//the hack is only relevant if after the deletion has been
		//performed we are inside a li of a nested list
		var $nestedList = jQuery(startContainer).closest('ul, ol');
		if ( ! $nestedList.length ) {
			return false;
		}
		var $parentList = $nestedList.parent().closest('ul, ol');
		if ( ! $parentList.length ) {
			return false;
		}

		var ranges = Aloha.getSelection().getAllRanges();

		var actionPerformed = false;
		$parentList.each(function(){
			actionPerformed = actionPerformed || fixListNesting(jQuery(this));
		});

		if (actionPerformed) {
			Aloha.getSelection().setRanges(ranges);
			for (var i = 0; i < ranges.length; i++) {
				ranges[i].detach();
			}
		}

		return actionPerformed;
	}

	/**
	 * If uls or ols are nested directly inside the given list (invalid
	 * HTML), they will be cleaned up by being appended to the preceding
	 * li.
	 */
	function fixListNesting($list) {
		var actionPerformed = false;
		$list.children('ul, ol').each(function(){
			Aloha.Log.debug("performing list-nesting cleanup");
			if ( ! jQuery(this).prev('li').append(this).length ) {
				//if there is no preceding li, create a new one and append to that
				jQuery(this).parent().prepend(document.createElement('li')).append(this);
			}
			actionPerformed = true;
		});
		return actionPerformed;
	}

	return ListPlugin;
});
