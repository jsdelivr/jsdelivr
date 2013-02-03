/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define( [
    'aloha',
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'format/format-plugin',
	'util/dom',
	'i18n!cite/nls/i18n',
	'i18n!aloha/nls/i18n'
],
function CiteClosure( Aloha, jQuery, Plugin, FloatingMenu, Format, domUtils,
                      i18n, i18nCore ) {
	

	Aloha.require([ 'css!cite/css/cite.css' ]);

	var $ = jQuery,
		ns  = 'aloha-cite',
		uid = (new Date()).getTime(),
		animating = false;

	// namespaced classnames
	var nsClasses = {
		quote         : nsClass( 'quote' ),
		blockquote    : nsClass( 'blockquote' ),
		'panel-label' : nsClass( 'panel-label' ),
		'panel-field' : nsClass( 'panel-field' ),
		'panel-btns'  : nsClass( 'panel-btns' ),
		'link-field'  : nsClass( 'link-field' ),
		'note-field'  : nsClass( 'note-field' ),
		references    : nsClass( 'references' )
	};

	/**
	 * Simple templating
	 *
	 * @param {String} str - The string containing placeholder keys in curly
	 *                       brackets
	 * @param {Object} obj - Associative array of replacing placeholder keys
	 *                       with corresponding values
	 */
	function supplant( str, obj ) {
		 return str.replace( /\{([a-z0-9\-\_]+)\}/ig,
		 	function( str, p1, offset, s ) {
				 var replacement = obj[ p1 ] || str;
				 return ( typeof replacement === 'function' ) ?
				 	replacement() :
					replacement;
			 } );
	}

	/**
	 * Wrapper to call the supplant method on a given string, taking the
	 * nsClasses object as the associative array containing the replacement
	 * pairs
	 *
	 * @param {String} str
	 * @return {String}
	 */
	function renderTemplate( str ) {
		return ( typeof str === 'string' ) ? supplant( str, nsClasses ) : str;
	}

	/**
	 * Generates a selector string with this plugins's namespace prefixed the
	 * each classname.
	 *
	 * Usage:
	 * 		nsSel('header,', 'main,', 'foooter ul')
	 * 		will return
	 * 		".aloha-myplugin-header, .aloha-myplugin-main, .aloha-mypluzgin-footer ul"
	 *
	 * @return {string}
	 */
	function nsSel() {
		var strBldr = [], prx = ns;
		jQuery.each( arguments, function() {
			strBldr.push( '.' + ( '' === this ? prx : prx + '-' + this ) );
		});
		return jQuery.trim( strBldr.join( ' ' ) );
	}

	/**
	 * Generates a string with this plugins's namespace prefixed the each
	 * classname.
	 *
	 * Usage:
	 *		nsClass('header', 'innerheaderdiv')
	 *		will return
	 *		"aloha-myplugin-header aloha-myplugin-innerheaderdiv"
	 *
	 * @return {string}
	 */
	function nsClass() {
		var strBldr = [], prx = ns;
		jQuery.each( arguments, function() {
			strBldr.push( '' === this ? prx : prx + '-' + this );
		} );
		return jQuery.trim( strBldr.join( ' ' ) );
	}

	/**
	 * Coverts hexidecimal string #00ffcc into rgb array [0, 255, 127]
	 *
	 * @param {string} hex Hexidecimal string representing color. In the form
	 *					   #ff3344 or #f34 or f34.
	 * @return {Array.<number>} RGB representation of hexidecimal color.
	 */
	function hex2rgb( hex ) {
		hex = hex.replace( '#', '' ).split( '' );
		if ( 3 === hex.length ) {
			hex[ 5 ] = hex[ 4 ] = hex[ 2 ];
			hex[ 3 ] = hex[ 2 ] = hex[ 1 ];
			hex[ 1 ] = hex[ 0 ];
		}
		var rgb = [];
		var i;
		for ( i = 0; i < 3; ++i ) {
			rgb[ i ] = parseInt( '0x' + hex[ i * 2 ] + hex[ i * 2 + 1 ], 16 );
		}
		return rgb;
	}

	return Plugin.create( 'cite', {

		citations: [],
		referenceContainer: null,
		settings: null,
		sidebar: null,
		config: {
			active: true
		},
		
		init: function() {
			var that = this;

			// Harverst configuration options that may be defined outside of
			// the plugin.
			if ( Aloha.settings &&
			     Aloha.settings.plugins &&
			     Aloha.settings.plugins.cite ) {
				var referenceContainer = jQuery(
					Aloha.settings.plugins.cite.referenceContainer );

				if ( referenceContainer.length ) {
					that.referenceContainer = referenceContainer;
				}

				if ( typeof Aloha.settings.plugins.cite !== 'undefined' ) {
					that.settings = Aloha.settings.plugins.cite;
				}

				if ( typeof that.settings.sidebar === 'undefined' ) {
					that.settings.sidebar = {};
				}

				if ( typeof that.settings.sidebar.open === 'undefined' ) {
					that.settings.sidebar.open = true;
				}

			}

			// Add the inline quote button in the floating menu, in the
			// standard manner...
			this.buttons = [];

			this.buttons[ 0 ] = new Aloha.ui.Button({
				name      : 'quote',
				text      : 'Quote', // that.i18n('button.' + button + '.text'),
				tooltip   : i18n.t( 'cite.button.add.quote' ), // that.i18n('button.' + button + '.tooltip'),
				iconClass : nsClass( 'button','inline-button' ),
				size      : 'small',
				toggle    : true,
				onclick   : function() {
					that.addInlineQuote();
				}
			});

			FloatingMenu.addButton(
				'Aloha.continuoustext',
				this.buttons[ 0 ],
				i18nCore.t( 'floatingmenu.tab.format' ),
				1
			);

			// We brute-forcishly push our button settings into the
			// multiSplitButton.  The multiSplitButton will pick it up and
			// render it.  Nevertheless, because this button is added late, it
			// means that it will not be automatically shown when doLayout is
			// called on the FloatingMenu.  We therefore have to do it
			// ourselves at aloha-selection-changed.
			Format.multiSplitButton.items.push({
				name      : 'blockquote',
				text      : 'Blockquote', // that.i18n('button.' + button + '.text'),
				tooltip   : i18n.t( 'cite.button.add.blockquote' ),	// that.i18n('button.' + button + '.tooltip'),
				iconClass : nsClass( 'button', 'block-button' ),
				click     : function() {
					that.addBlockQuote();
				}
			});

			var citePlugin = this;

			// Note that if the sidebar is not loaded,
			// aloha-sidebar-initialized will not fire and this listener will
			// not be called, which is what we would want if there are no
			// sidebars
			Aloha.ready( function( ev ) {
				citePlugin.sidebar = Aloha.Sidebar.right.show();
				// citePlugin.sidebar.settings.overlayPage = false;
				citePlugin.sidebar.addPanel({
					id       : nsClass( 'sidebar-panel' ),
					title    : 'Citation',
					content  : '',
					expanded : true,
					activeOn : '.aloha-cite-wrapper',

					// Executed once, when this panel object is instantialized
					onInit   : function() {
						var that = this;
						var content = this.setContent( renderTemplate(
							   '<div class="{panel-label}">Link:</div>\
								<div class="{panel-field} {link-field}" \
								style="margin: 5px;"><input type="text" /></div>'
								+ ( citePlugin.referenceContainer
									? '<div class="{panel-label}">Note:</div>\
									   <div class="{panel-field} {note-field}"\
									   style="margin: 5px;">\
									   <textarea></textarea></div>'
									: '' )
							) ).content;

						content
							.find( 'input, textarea' )
							.bind( 'keypress change', function() {
								citePlugin.addCiteDetails(
									that.content.attr( 'data-cite-id' ),
									that.content.find( nsSel( 'link-field input' ) ).val(),
									that.content.find( nsSel( 'note-field textarea' ) ).val()
								);
							});
					},

					/**
					 * Invoked during aloha-selection-changed, if activeOn
					 * function returns true for the current selection.  Will
					 * populate panel fields with the details of the selected
					 * citation if they are already available.  If no citation
					 * exists for the selected quotation, then one will be
					 * created for it first.
					 */
					onActivate: function( effective ) {
						var uid = effective.attr( 'data-cite-id' );
						var index = that.getIndexOfCitation( uid );

						if ( -1 === index ) {
							index = that.citations.push({
								uid   : uid,
								link  : null,
								notes : null
							}) - 1;
						}

						this.content.attr( 'data-cite-id', uid );
						this.content.find( nsSel( 'link-field input' ) )
						    .val( effective.attr( 'cite' ) );
						this.content.find( nsSel( 'note-field textarea' ) )
						    .val( that.citations[ index ].note );
					}

				});
			});

			Aloha.bind( 'aloha-editable-activated', function( event, params) {
				var config = that.getEditableConfig( params.editable.obj );
				
				if ( !config ) {
					return;
				}
				
				if ( jQuery.inArray( 'quote', config ) !== -1 ) {
					that.buttons[ 0 ].show();
				} else {
					that.buttons[ 0 ].hide();
				}
				
				if ( jQuery.inArray( 'blockquote', config ) !== -1 ) {
					Format.multiSplitButton.showItem( 'blockquote' );
				} else {
					Format.multiSplitButton.hideItem( 'blockquote' );
				}
			});

			Aloha.bind( 'aloha-selection-changed', function( event, rangeObject ) {
				var buttons = jQuery( 'button' + nsSel( 'button' ) ); // not used?

				jQuery.each( that.buttons, function( index, button ) {
					// Set to false to prevent multiple buttons being active
					// when they should not.
					var statusWasSet = false;
					var tagName;
					var effective = rangeObject.markupEffectiveAtStart;
					var i = effective.length;

					// Check whether any of the effective items are citation
					// tags.
					while ( i ) {
						tagName = effective[ --i ].tagName.toLowerCase();
						if ( tagName === 'q' || tagName === 'blockquote' ) {
							statusWasSet = true;
							break;
						}
					}

					buttons.filter( nsSel( 'block-button' ) )
					       .removeClass( nsClass( 'pressed' ) );

					that.buttons[ 0 ].setPressed( false );
					//button.setPressed( false ); // should it be this instead of that.buttons...?

					if ( statusWasSet ) {
						if( 'q' === tagName ) {
							that.buttons[ 0 ].setPressed( true );
							//button.setPressed( true ); // should it be this instead of that.buttons...?
						} else {
							buttons.filter( nsSel( 'block-button' ) )
							       .addClass( nsClass( 'pressed' ) );
						}

						// We've got what we came for, so return false to break
						// the each loop.
						return false;
					}
				});
				
				// switch item visibility according to config
				var config = [];
				if ( Aloha.activeEditable ) {
		        	var config = that.getEditableConfig( Aloha.activeEditable.obj );
				}
				
				// quote
				if ( jQuery.inArray( 'quote', config ) != -1 ) {
	        		that.buttons[0].show();
	        	} else {
	        		that.buttons[0].hide();
	        	}
				
				// blockquote
				if ( jQuery.inArray( 'blockquote', config ) != -1 ) {
					Format.multiSplitButton.showItem( 'blockquote' );
	        	} else {
	        		Format.multiSplitButton.hideItem( 'blockquote' );
	        	}
				
				FloatingMenu.doLayout();
			});
		},

		/**
		 * Do a binary search through all citations for a given uid.  The bit
		 * shifting may be a *bit* of an overkill, but with big lists it proves
		 * to be significantly more performant.
		 *
		 * @param {string} uid Th uid of the citation to retreive.
		 * @return {number} The 0-based index of the first citation found that
		 *                  matches the given uid. -1 of no citation is found
		 *                  for the given uid,
		 */
		getIndexOfCitation: function( uid ) {
			var c = this.citations;
			var max = c.length;
			var min = 0;
			var mid;
			var cuid;

			// Infinite loop guard for debugging...  So your tab/browser
			// doesn't freeze up like a Christmas turkey ;-)
			// var __guard = 1000;

			while ( min < max /* && --__guard */ ) {
				mid = ( min + max ) >> 1; // Math.floor(i) / 2 == i >> 1 == ~~(i / 2)
				cuid = c[ mid ].uid;

				if ( cuid == uid ) {
					return mid;
				}
				
				if ( cuid > uid ) {
					max = mid;
				} else if ( cuid < uid ) {
					min = mid + 1;
				}
			}

			return -1;
		},

		addBlockQuote: function() {
			var classes = [ nsClass( 'wrapper' ), nsClass( ++uid ) ].join( ' ' );
			var markup = jQuery( supplant(
					'<blockquote class="{classes}" data-cite-id="{uid}"></blockquote>',
					{ uid: uid, classes: classes }
				) );

			// Now re-enable the editable...
			if ( Aloha.activeEditable ) {
				jQuery( Aloha.activeEditable.obj[ 0 ] ).click();
			}

			Aloha.Selection.changeMarkupOnSelection( markup );

			if ( this.referenceContainer ) {
				this.addCiteToReferences( uid );
			}

			if ( this.sidebar && this.settings && this.settings.sidebar &&
			     this.settings.sidebar.open ) {
				this.sidebar.open();
			}
			//	.activatePanel(nsClass('sidebar-panel'), markup);
		},

		addInlineQuote: function() {
			var classes = [ nsClass( 'wrapper' ), nsClass( ++uid ) ].join( ' ' );
			var markup = jQuery( supplant(
					'<q class="{classes}" data-cite-id="{uid}"></q>',
					{ uid: uid, classes: classes }
				) );
			var rangeObject = Aloha.Selection.rangeObject;
			var foundMarkup;

			if ( Aloha.activeEditable ) {
				jQuery( Aloha.activeEditable.obj[ 0 ] ).click();
			}

			// Check whether the markup is found in the range (at the start of
			// the range).
			foundMarkup = rangeObject.findMarkup( function() {
				if ( this.nodeName && markup.length &&
					( typeof this.nodeName === 'string' ) &&
					( typeof markup[ 0 ].nodeName === 'string' ) ) {
					return this.nodeName.toLowerCase() ===
						markup[ 0 ].nodeName.toLowerCase();
				}

				return false;
			}, Aloha.activeEditable.obj );

			// If the we click the quote button on a range that contains quote
			// markup, then we will remove the quote markup, otherwise we will
			// wrap the selection in a quote.

			if ( foundMarkup ) {
				if ( rangeObject.isCollapsed() ) {
					// The range is collapsed; remove exactly the one DOM
					// element.
					domUtils.removeFromDOM( foundMarkup, rangeObject, true );
				} else {
					// The range is not collapsed; remove the markup from the
					// range.
					domUtils.removeMarkup( rangeObject, markup,
						Aloha.activeEditable.obj );
				}
			} else {
				// When the range is collapsed, extend it to a word.
				if ( rangeObject.isCollapsed() ) {
					domUtils.extendToWord( rangeObject );
				}

				domUtils.addMarkup( rangeObject, markup );
			}

			// select the modified range
			rangeObject.select();

			if ( this.referenceContainer ) {
				this.addCiteToReferences(uid);
			}

			if ( this.sidebar && this.settings && this.settings.sidebar &&
			     this.settings.sidebar.open ) {
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
		 * @param {string} uid The uid of the citation to add.
		 */
		addCiteToReferences: function( uid ) {
			var index = this.getIndexOfCitation( uid );

			if ( -1 === index ) {
				return;
			}

			var wrapper = jQuery( '.aloha-editable-active ' + nsSel( uid ) );
			var note = 'cite-note-' + uid;
			var ref = 'cite-ref-'  + uid;

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

			if ( 0 === this.referenceContainer.find( 'ol.references' ).length ) {
				this.referenceContainer
				    .append( '<h2>References</h2>' )
				    .append( '<ol class="references"></ol>' );
			}

			this.referenceContainer.find( 'ol.references' ).append(
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
		 * given citation.
		 *
		 * @param {string} uid
		 * @param {string} link
		 * @param {string} note
		 */
		addCiteDetails: function( uid, link, note ) {
			this.citations[ this.getIndexOfCitation( uid ) ] = {
				uid  : uid,
				link : link,
				note : note
			};

			if ( link ) {
				// Update link attribute
				var el = jQuery( nsSel( uid ) ).attr( 'cite', link );

				if ( !animating ) {
					// Highlight animation for happy user.
					var round = Math.round;
					var from  = hex2rgb( '#fdff9a' );
					var to    = hex2rgb( '#fdff9a' );

					from.push( 1 );
					to.push( 0 );

					var diff = [ to[ 0 ] - from[ 0 ],
								 to[ 1 ] - from[ 1 ],
								 to[ 2 ] - from[ 2 ],
								 to[ 3 ] - from[ 3 ] ];

					var origBg = el[0].style.backgroundColor;
					var origShadow = el[0].style.boxShadow;

					el.css({
						__tick: 0, // Our increment.
						'background-color': 'rgba(' + from.join( ',' ) + ')',
						'box-shadow': '0 0 20px rgba(' + from.join( ',' ) + ')'
					});

					animating = true;

					el.animate( { __tick: 1 }, {
						duration: 500,
						easing: 'linear',
						step: function( val, fx ) {
							var rgba = [ round( from[ 0 ] + diff[ 0 ] * val ),
							             round( from[ 1 ] + diff[ 1 ] * val ),
							             round( from[ 2 ] + diff[ 2 ] * val ),
							             from[ 3 ] + diff[ 3 ] * val ];

							jQuery( this ).css({
								'background-color': 'rgba(' + rgba.join( ',' ) + ')',
								'box-shadow': '0 0 ' + ( 20 * ( 1 - val ) ) +
									'px rgba(' + from.join( ',' ) + ')'
							});
						},
						complete: function() {
							animating = false;
							this.style.backgroundColor = origBg;
							this.style.boxShadow = origShadow;
						}
					} );
				}
			}

			// Update information in references list for this citation.
			if ( this.referenceContainer ) {
				jQuery( 'li#cite-note-' + uid + ' span' ).html(
					supplant(
						link ? '<a class="external" target="_blank" href="{url}">{url}</a>' : '',
						{ url: link }
					) + ( note ? '. ' + note : '' )
				)
			}
		},

		toString: function() {
			return 'aloha-citiation-plugin';
		}

	});

});