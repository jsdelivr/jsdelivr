/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define(
['aloha', 'aloha/plugin', 'aloha/jquery', 'aloha/floatingmenu', 'i18n!format/nls/i18n', 'i18n!aloha/nls/i18n', 'aloha/console',
 		'css!format/css/format.css'],
function(Aloha, Plugin, jQuery, FloatingMenu, i18n, i18nCore) {
	
	var
		GENTICS = window.GENTICS;

	/**
	 * register the plugin with unique name
	 */
	return Plugin.create('format', {
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de', 'fr', 'eo', 'fi', 'ru', 'it', 'pl'],

		/**
		 * default button configuration
		 */
		config: [ 'strong', 'em', 'b', 'i','s','sub','sup', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat'],

		/**
		 * Initialize the plugin and set initialize flag on true
		 */
		init: function () {
			// Prepare
			var me = this;

			this.initButtons();

			// apply specific configuration if an editable has been activated
			Aloha.bind('aloha-editable-activated',function (e, params) {
				me.applyButtonConfig(params.editable.obj);
			});

			/*
			Aloha.defaults.supports = jQuery.merge(Aloha.defaults.supports, {
					elements: [ 'strong', 'em', 'b', 'i','del','sub','sup', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre' ]
			});
			*/

		},

		/**
		 * applys a configuration specific for an editable
		 * buttons not available in this configuration are hidden
		 * @param {Object} id of the activated editable
		 * @return void
		 */
		applyButtonConfig: function (obj) {

			var config = this.getEditableConfig(obj),
				button, i, len;
			// now iterate all buttons and show/hide them according to the config
			for ( button in this.buttons) {
				if (jQuery.inArray(button, config) != -1) {
					this.buttons[button].button.show();
				} else {
					this.buttons[button].button.hide();
				}
			}

			// and the same for multisplit items
			len = this.multiSplitItems.length;
			for (i = 0; i < len; i++) {
				if (jQuery.inArray(this.multiSplitItems[i].name, config) != -1) {
					this.multiSplitButton.showItem(this.multiSplitItems[i].name);
				} else {
					this.multiSplitButton.hideItem(this.multiSplitItems[i].name);
				}
			}
		},

		/**
		 * initialize the buttons and register them on floating menu
		 * @param event event object
		 * @param editable current editable object
		 */
		initButtons: function () {
			var
				scope = 'Aloha.continuoustext',
				that = this;

			// reset
			this.buttons = {};

			// collect the multisplit items here
			this.multiSplitItems = [];
			//this.multiSplitButton;

			//iterate configuration array an push buttons to buttons array
			jQuery.each(this.config, function(j, button) {
				switch( button ) {
					// text level semantics:
					case 'u':
					case 'em':
					case 'strong':
					case 'b':
					case 'i':
					case 'cite':
					case 'q':
					case 'code':
					case 'abbr':
					case 'del':
					case 's':
					case 'sub':
					case 'sup':
						that.buttons[button] = {'button' : new Aloha.ui.Button({
							'name' : button,
							'iconClass' : 'aloha-button aloha-button-' + button,
							'size' : 'small',
							'onclick' : function () {
								var
									markup = jQuery('<'+button+'></'+button+'>'),
									rangeObject = Aloha.Selection.rangeObject,
									foundMarkup,
									selectedCells = jQuery('.aloha-cell-selected');

								// formating workaround for table plugin
								if ( selectedCells.length > 0 ) {
									var cellMarkupCounter = 0;
									selectedCells.each( function () {
										var cellContent = jQuery(this).find('div'),
											cellMarkup = cellContent.find(button);
										
										if ( cellMarkup.length > 0 ) {
											// unwrap all found markup text
											// <td><b>text</b> foo <b>bar</b></td>
											// and wrap the whole contents of the <td> into <b> tags
											// <td><b>text foo bar</b></td>
											cellMarkup.contents().unwrap();
											cellMarkupCounter++;
										}
										cellContent.contents().wrap('<'+button+'></'+button+'>');
									});

									// remove all markup if all cells have markup
									if ( cellMarkupCounter == selectedCells.length ) {
										selectedCells.find(button).contents().unwrap();
									}
									return false;
								}
								// formating workaround for table plugin

								// check whether the markup is found in the range (at the start of the range)
								foundMarkup = rangeObject.findMarkup(function() {
									return this.nodeName.toLowerCase() == markup.get(0).nodeName.toLowerCase();
								}, Aloha.activeEditable.obj);

								if ( foundMarkup ) {
									// remove the markup
									if (rangeObject.isCollapsed()) {
										// when the range is collapsed, we remove exactly the one DOM element
										GENTICS.Utils.Dom.removeFromDOM(foundMarkup, rangeObject, true);
									} else {
										// the range is not collapsed, so we remove the markup from the range
										GENTICS.Utils.Dom.removeMarkup(rangeObject, markup, Aloha.activeEditable.obj);
									}
								} else {
									// when the range is collapsed, extend it to a word
									if (rangeObject.isCollapsed()) {
										GENTICS.Utils.Dom.extendToWord(rangeObject);
									}

									// add the markup
									GENTICS.Utils.Dom.addMarkup(rangeObject, markup);
								}
								// select the modified range
								rangeObject.select();
								return false;
							},
							'tooltip' : i18n.t('button.' + button + '.tooltip'),
							'toggle' : true
						}), 'markup' : jQuery('<'+button+'></'+button+'>')};

						FloatingMenu.addButton(
							scope,
							that.buttons[button].button,
							i18nCore.t('floatingmenu.tab.format'),
							1
						);
						break;

					case 'p':
					case 'h1':
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
					case 'pre':
						that.multiSplitItems.push({
							'name' : button,
							'tooltip' : i18n.t('button.' + button + '.tooltip'),
							'iconClass' : 'aloha-button ' + i18n.t('aloha-button-' + button),
							'markup' : jQuery('<'+button+'></'+button+'>'),
							'click' : function() {
								var selectedCells = jQuery('.aloha-cell-selected');
								// formating workaround for table plugin
								if ( selectedCells.length > 0 ) {
									var cellMarkupCounter = 0;
									selectedCells.each( function () {
										var cellContent = jQuery(this).find('div'),
											cellMarkup = cellContent.find(button);
										
										if ( cellMarkup.length > 0 ) {
											// unwrap all found markup text
											// <td><b>text</b> foo <b>bar</b></td>
											// and wrap the whole contents of the <td> into <b> tags
											// <td><b>text foo bar</b></td>
											cellMarkup.contents().unwrap();
											cellMarkupCounter++;
										}
										cellContent.contents().wrap('<'+button+'></'+button+'>');
									});

									// remove all markup if all cells have markup
									if ( cellMarkupCounter == selectedCells.length ) {
										selectedCells.find(button).contents().unwrap();
									}
									return false;
								}
								// formating workaround for table plugin

								Aloha.Selection.changeMarkupOnSelection(jQuery('<' + button + '></' + button + '>'));
							}
						});
						break;

					// wide multisplit buttons
					case 'removeFormat':
						that.multiSplitItems.push({
							'name' : button,
							'text' : i18n.t('button.' + button + '.text'),
							'tooltip' : i18n.t('button.' + button + '.tooltip'),
							'iconClass' : 'aloha-button aloha-button-' + button,
							'wide' : true,
							'click' : function() {
								that.removeFormat();
							}
						});
						break;
					//no button defined
					default:
						Aloha.log('warn', this, 'Button "' + button + '" is not defined');
						break;
				}
			});

			if (this.multiSplitItems.length > 0) {
				this.multiSplitButton = new Aloha.ui.MultiSplitButton({
					'name' : 'phrasing',
					'items' : this.multiSplitItems
				});
				FloatingMenu.addButton(
					scope,
					this.multiSplitButton,
					i18nCore.t('floatingmenu.tab.format'),
					3
				);
			}

			// add the event handler for selection change
			Aloha.bind('aloha-selection-changed',function(event,rangeObject){
				// iterate over all buttons
				var
					statusWasSet = false, effectiveMarkup,
					foundMultiSplit, i, j, multiSplitItem;

				jQuery.each(that.buttons, function(index, button) {
					statusWasSet = false;
					for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++) {
						effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];
						if (Aloha.Selection.standardTextLevelSemanticsComparator(effectiveMarkup, button.markup)) {
							button.button.setPressed(true);
							statusWasSet = true;
						}
					}
					if (!statusWasSet) {
						button.button.setPressed(false);
					}
				});

				if (that.multiSplitItems.length > 0) {
					foundMultiSplit = false;

					// iterate over the markup elements
					for ( i = 0; i < rangeObject.markupEffectiveAtStart.length && !foundMultiSplit; i++) {
						effectiveMarkup = rangeObject.markupEffectiveAtStart[ i ];

						for ( j = 0; j < that.multiSplitItems.length && !foundMultiSplit; j++) {
							multiSplitItem = that.multiSplitItems[j];

							if (!multiSplitItem.markup) {
								continue;
							}

							// now check whether one of the multiSplitItems fits to the effective markup
							if (Aloha.Selection.standardTextLevelSemanticsComparator(effectiveMarkup, multiSplitItem.markup)) {
								that.multiSplitButton.setActiveItem(multiSplitItem.name);
								foundMultiSplit = true;
							}
						}
					}

					if (!foundMultiSplit) {
						that.multiSplitButton.setActiveItem(null);
					}
				}
			});

		},

		/**
		 * Removes all formatting from the current selection.
		 */
		removeFormat: function() {
			var formats = [ 'strong', 'em', 'b', 'i', 'cite', 'q', 'code', 'abbr', 'del', 'sub', 'sup'],
				rangeObject = Aloha.Selection.rangeObject,
				i;
			
			// formats to be removed by the removeFormat button may now be configured using Aloha.settings.plugins.format.removeFormats = ['b', 'strong', ...]
			if (this.settings.removeFormats) {
				formats = this.settings.removeFormats;
			}

			if (rangeObject.isCollapsed()) {
				return;
			}

			for (i = 0; i < formats.length; i++) {
				GENTICS.Utils.Dom.removeMarkup(rangeObject, jQuery('<' + formats[i] + '></' + formats[i] + '>'), Aloha.activeEditable.obj);
			}

			// select the modified range
			rangeObject.select();
			// TODO: trigger event - removed Format

		},

		/**
		* toString method
		* @return string
		*/
		toString: function () {
			return 'format';
		}
	});
});
