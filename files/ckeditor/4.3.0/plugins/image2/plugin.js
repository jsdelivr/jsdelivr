/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function() {

	var template = '<img alt="" src="" />',
		templateBlock = '<figure class="caption">' +
				template +
				'<figcaption>Caption</figcaption>' +
			'</figure>',
		regexPercent = /^\s*(\d+\%)\s*$/i;

	CKEDITOR.plugins.add( 'image2', {
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		requires: 'widget,dialog',
		icons: 'image2',
		hidpi: true,

		onLoad: function( editor ) {
			CKEDITOR.addCss(
			'.cke_editable.cke_image2_sw, .cke_editable.cke_image2_sw *{cursor:sw-resize !important}' +
			'.cke_editable.cke_image2_se, .cke_editable.cke_image2_se *{cursor:se-resize !important}' +
			'.cke_image2_resizer{' +
				'display:none;' +
				'position:absolute;' +
				'width:10px;' +
				'height:10px;' +
				'bottom:-5px;' +
				'right:-5px;' +
				'background:#000;' +
				'outline:1px solid #fff;' +
				'cursor:se-resize;' +
			'}' +
			'.cke_image2_resizer_wrapper{' +
				'position:relative;' +
				'display:inline-block;' +
				'line-height:0;' +
			'}' +
			// Bottom-left corner style of the resizer.
			'.cke_image2_resizer.cke_image2_resizer_left{' +
				'right:auto;' +
				'left:-5px;' +
				'cursor:sw-resize;' +
			'}' +
			'.cke_widget_wrapper:hover .cke_image2_resizer,' +
			'.cke_image2_resizer.cke_image2_resizing{' +
				'display:block' +
			'}' );
		},

		init: function( editor ) {

			// Adapts configuration from original image plugin. Should be removed
			// when we'll rename image2 to image.
			var config = editor.config,
				lang = editor.lang.image2;
			config.filebrowserImage2BrowseUrl = config.filebrowserImageBrowseUrl;
			config.filebrowserImage2UploadUrl = config.filebrowserImageUploadUrl;

			// Add custom elementspath names to widget definition.
			image2.pathName = lang.pathName;
			image2.editables.caption.pathName = lang.pathNameCaption;

			// Register the widget.
			editor.widgets.add( 'image2', image2 );

			// Add toolbar button for this plugin.
			editor.ui.addButton && editor.ui.addButton( 'image2', {
				label: editor.lang.common.image,
				command: 'image2',
				toolbar: 'insert,10'
			} );

			// Register context menu option for editing widget.
			if ( editor.contextMenu ) {
				editor.addMenuGroup( 'image2', 10 );

				editor.addMenuItem( 'image2', {
					label: lang.menu,
					command: 'image2',
					group: 'image2'
				} );
			}

			CKEDITOR.dialog.add( 'image2', this.path + 'dialogs/image2.js' );
		},

		afterInit: function( editor ) {
			var align = { left:1,right:1,center:1,block:1 },
				integrate = alignCommandIntegrator( editor );

			for ( var value in align )
				integrate( value );
		}
	} );

	// Image2 widget definition.
	var image2 = {
		// Widget-specific rules for Allowed Content Filter.
		allowedContent: {
			// This widget may need <div> centering wrapper.
			div: {
				match: isCenterWrapper,
				styles: 'text-align'
			},
			figcaption: true,
			figure: {
				classes: '!caption',
				styles: 'float,display'
			},
			img: {
				attributes: '!src,alt,width,height',
				styles: 'float'
			},
			// This widget may need <p> centering wrapper.
			p: {
				match: isCenterWrapper,
				styles: 'text-align'
			}
		},

		// This widget converts style-driven dimensions to attributes.
		contentTransformations: [
			[ 'img[width]: sizeToAttribute' ]
		],

		// This widget has an editable caption.
		editables: {
			caption: {
				selector: 'figcaption',
				allowedContent: 'br em strong sub sup u s; a[!href]'
			}
		},

		parts: {
			image: 'img',
			caption: 'figcaption'
		},

		// The name of this widget's dialog.
		dialog: 'image2',

		// Template of the widget: plain image.
		template: template,

		data: function() {
			var widget = this,
				editor = widget.editor,
				oldState = widget.oldData,
				newState = widget.data;

			// Convert the internal form of the widget from the old state to the new one.
			widget.shiftState( {
				element: widget.element,
				oldState: oldState,
				newState: newState,

				// Destroy the widget.
				destroy: function() {
					if ( this.destroyed )
						return;

					// Remember whether widget was focused before destroyed.
					if ( editor.widgets.focused == widget )
						this.focused = true;

					editor.widgets.destroy( widget );

					// Mark widget was destroyed.
					this.destroyed = true;
				},

				init: function( element ) {
					// Create a new widget. This widget will be either captioned
					// non-captioned, block or inline according to what is the
					// new state of the widget.
					if ( this.destroyed ) {
						widget = editor.widgets.initOn( element, 'image2', widget.data );

						// The focus must be transferred from the old one (destroyed)
						// to the new one (just created).
						if ( this.focused ) {
							widget.focus();
							delete this.focused;
						}

						delete this.destroyed;
					}

					// If now widget was destroyed just update wrapper's alignment.
					// According to the new state.
					else
						setWrapperAlign( widget );
				}
			} );

			widget.parts.image.setAttributes( {
				src: widget.data.src,

				// This internal is required by the editor.
				'data-cke-saved-src': widget.data.src,

				alt: widget.data.alt
			} );

			// Set dimensions of the image according to gathered data.
			setDimensions( widget );

			// Cache current data.
			widget.oldData = CKEDITOR.tools.extend( {}, widget.data );
		},

		init: function() {
			var helpers = CKEDITOR.plugins.image2,
				image = this.parts.image,
				data = {
					hasCaption: !!this.parts.caption,
					src: image.getAttribute( 'src' ),
					alt: image.getAttribute( 'alt' ) || '',
					width: image.getAttribute( 'width' ) || '',
					height: image.getAttribute( 'height' ) || '',

					// Lock ratio is on by default (#10833).
					lock: this.ready ? helpers.checkHasNaturalRatio( image ) : true
				};

			// Read initial float style from figure/image and
			// then remove it. This style will be set on wrapper in #data listener.
			if ( !data.align ) {
				data.align = this.element.getStyle( 'float' ) || image.getStyle( 'float' ) || 'none';
				this.element.removeStyle( 'float' );
				image.removeStyle( 'float' );
			}

			// Get rid of extra vertical space when there's no caption.
			// It will improve the look of the resizer.
			if ( !data.hasCaption )
				this.wrapper.setStyle( 'line-height', '0' );

			this.setData( data );

			// Setup dynamic image resizing with mouse.
			setupResizer( this );

			this.shiftState = helpers.stateShifter( this.editor );

			// Add widget editing option to its context menu.
			this.on( 'contextMenu', function( evt ) {
				evt.data.image2 = CKEDITOR.TRISTATE_OFF;
			} );

			// Pass the reference to this widget to the dialog.
			this.on( 'dialog', function( evt ) {
				evt.data.widget = this;
			}, this );
		},

		upcast: upcastWidgetElement,
		downcast: downcastWidgetElement
	};

	CKEDITOR.plugins.image2 = {
		stateShifter: function( editor ) {
			// Tag name used for centering non-captioned widgets.
			var centerElement = editor.config.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div',

				doc = editor.document,
				editable = editor.editable(),

				// The order that stateActions get executed. It matters!
				shiftables = [ 'hasCaption', 'align' ],

				// Atomic procedures, one per state variable.
				stateActions = {
					align: function( data, oldValue, newValue ) {
						var hasCaptionAfter = data.newState.hasCaption,
							element = data.element;

						// Alignment changed.
						if ( changed( data, 'align' ) ) {
							// No caption in the new state.
							if ( !hasCaptionAfter ) {
								// Changed to "center" (non-captioned).
								if ( newValue == 'center' ) {
									data.destroy();
									data.element = wrapInCentering( element );
								}

								// Changed to "non-center" from "center" while caption removed.
								if ( !changed( data, 'hasCaption' ) && oldValue == 'center' && newValue != 'center' ) {
									data.destroy();
									data.element = unwrapFromCentering( element );
								}
							}
						}

						// Alignment remains and "center" removed caption.
						else if ( newValue == 'center' && changed( data, 'hasCaption' ) && !hasCaptionAfter ) {
							data.destroy();
							data.element = wrapInCentering( element );
						}

						// Finally set display for figure.
						if ( element.is( 'figure' ) ) {
							if ( newValue == 'center' )
								element.setStyle( 'display', 'inline-block' );
							else
								element.removeStyle( 'display' );
						}
					},

					hasCaption:	function( data, oldValue, newValue ) {
						// This action is for real state change only.
						if ( !changed( data, 'hasCaption' ) )
							return;

						var element = data.element,
							oldState = data.oldState,
							newState = data.newState,
							img;

						// Switching hasCaption always destroys the widget.
						data.destroy();

						// There was no caption, but the caption is to be added.
						if ( newValue ) {
							// Get <img> from element. As element may be either
							// <img> or centering <p>, consider it now.
							img = element.findOne( 'img' ) || element;

							// Create new <figure> from widget template.
							var figure = CKEDITOR.dom.element.createFromHtml( templateBlock, doc );

							// Replace element with <figure>.
							replaceSafely( figure, element );

							// Use old <img> instead of the one from the template,
							// so we won't lose additional attributes.
							img.replace( figure.findOne( 'img' ) );

							// Update widget's element.
							data.element = figure;
						}

						// The caption was present, but now it's to be removed.
						else {
							// Unwrap <img> from figure.
							img = element.findOne( 'img' );
							img.replace( element );

							// Update widget's element.
							data.element = img;
						}
					}
				};

			function getValue( state, name ) {
				return state && state[ name ] !== undefined ? state[ name ] : null;
			}

			function changed( data, name ) {
				if ( !data.oldState )
					return false;
				else
					return data.oldState[ name ] !== data.newState[ name ];
			}

			function wrapInCentering( element ) {
				// When widget gets centered. Wrapper must be created.
				// Create new <p|div> with text-align:center.
				var center = doc.createElement( centerElement, {
					styles: { 'text-align': 'center' }
				} );

				// Replace element with centering wrapper.
				replaceSafely( center, element );
				element.move( center );

				return center;
			}

			function unwrapFromCentering( element ) {
				var img = element.findOne( 'img' );

				img.replace( element );

				return img;
			}

			function replaceSafely( replacing, replaced ) {
				if ( replaced.getParent() ) {
					var range = editor.createRange();

					// Move the range before old element and insert element into it.
					range.moveToPosition( replaced, CKEDITOR.POSITION_BEFORE_START );
					editable.insertElementIntoRange( replacing, range );

					// Remove old element.
					replaced.remove();
				}
				else
					replacing.replace( replaced );
			}

			return function( data ) {
				var oldState = data.oldState,
					newState = data.newState,
					name;

				// Iterate over possible state variables.
				for ( var i = 0; i < shiftables.length; i++ ) {
					name = shiftables[ i ];

					stateActions[ name ]( data,
						oldState ? oldState[ name ] : null,
						newState[ name ] );
				}

				data.init( data.element );
			};
		},

		// Checks whether current ratio of the image match the natural one.
		// by comparing dimensions.
		// @param {CKEDITOR.dom.element} image
		// @returns {Boolean}
		checkHasNaturalRatio: function( image ) {
			var $ = image.$,
				natural = this.getNatural( image );

			// The reason for two alternative comparisons is that the rounding can come from
			// both dimensions, e.g. there are two cases:
			// 	1. height is computed as a rounded relation of the real height and the value of width,
			//	2. width is computed as a rounded relation of the real width and the value of heigh.
			return Math.round( $.clientWidth / natural.width * natural.height ) == $.clientHeight ||
				Math.round( $.clientHeight / natural.height * natural.width ) == $.clientWidth;
		},

		// Returns natural dimensions of the image. For modern browsers
		// it uses natural(Width|Height) for old ones (IE8), creates
		// a new image and reads dimensions.
		// @param {CKEDITOR.dom.element} image
		// @returns {Object}
		getNatural: function( image ) {
			var dimensions;

			if ( image.$.naturalWidth ) {
				dimensions = {
					width: image.$.naturalWidth,
					height: image.$.naturalHeight
				};
			} else {
				var img = new Image();
				img.src = image.getAttribute( 'src' );

				dimensions = {
					width: img.width,
					height: img.height
				};
			}

			return dimensions;
		}
	};

	function setWrapperAlign( widget ) {
		var wrapper = widget.wrapper,
			align = widget.data.align;

		if ( align == 'center' ) {
			if ( !widget.inline )
				wrapper.setStyle( 'text-align', 'center' );

			wrapper.removeStyle( 'float' );
		} else {
			if ( !widget.inline )
				wrapper.removeStyle( 'text-align' );

			if ( align == 'none' )
				wrapper.removeStyle( 'float' );
			else
				wrapper.setStyle( 'float', align );
		}
	}

	// Creates widgets from all <img> and <figure class="caption">.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function upcastWidgetElement( el, data ) {
		var dimensions = { width:1,height:1 },
			name = el.name,
			image;

		// #11110 Don't initialize on pasted fake objects.
		if ( el.attributes[ 'data-cke-realelement' ] )
			return;

		// If a center wrapper is found. So the element is:
		// 		<div style="text-align:center"><figure>...</figure></div>.
		// Centering is done by widget.wrapper in such case. Hence, replace
		// centering wrapper with figure.
		// The other case is:
		// 		<p style="text-align:center"><img></p>.
		// Then <p> takes charge of <figure> and nothing is to be changed.
		if ( isCenterWrapper( el ) ) {
			if ( name == 'div' ) {
				var figure = el.getFirst( 'figure' );
				el.replaceWith( figure );
				el = figure;
			}

			data.align = 'center';

			image = el.getFirst( 'img' );
		}

		// No center wrapper has been found.
		else if ( name == 'figure' && el.hasClass( 'caption' ) )
			image = el.getFirst( 'img' );

		// Inline widget from plain img.
		else if ( name == 'img' )
			image = el;

		if ( !image )
			return;

		// If there's an image, then cool, we got a widget.
		// Now just remove dimension attributes expressed with %.
		for ( var d in dimensions ) {
			var dimension = image.attributes[ d ];

			if ( dimension && dimension.match( regexPercent ) )
				delete image.attributes[ d ];
		}

		return el;
	}

	// Transforms the widget to the external format according to the current configuration.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function downcastWidgetElement( el ) {
		var attrs = el.attributes,
			align = this.data.align;

		// De-wrap the image from resize handle wrapper.
		// Only block widgets have one.
		if ( !this.inline ) {
			var resizeWrapper = el.getFirst( 'span' ),
				img = resizeWrapper.getFirst( 'img' );

			resizeWrapper.replaceWith( img );
		}

		if ( align && align != 'none' ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );

			// If centering, wrap downcasted element.
			// Wrappers for <img> and <figure> are <p> and <div>, respectively.
			if ( align == 'center' && el.name != 'p' ) {
				var name = el.name == 'img' ? 'p' : 'div';

				el = el.wrapWith( new CKEDITOR.htmlParser.element( name, {
					'style': 'text-align:center'
				} ) );
			}

			// If left/right, add float style to the downcasted element.
			else if ( align in { left:1,right:1 } )
				styles[ 'float' ] = align;

			// Update element styles.
			if ( !CKEDITOR.tools.isEmpty( styles ) )
				attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		return el;
	}

	function isCenterWrapper( el ) {
		// Wrapper must be either <div> or <p>.
		if ( !( el.name in { div:1,p:1 } ) )
			return false;

		var children = el.children;

		// Centering wrapper can have only one child.
		if ( children.length !== 1 )
			return false;

		var child = children[ 0 ],
			childName = child.name;

		// The only child of centering wrapper can be <figure> with
		// class="caption" or plain <img>.
		if ( childName != 'img' && !( childName == 'figure' && child.hasClass( 'caption' ) ) )
			return false;

		var styles = CKEDITOR.tools.parseCssText( el.attributes.style || '', true );

		// Centering wrapper got to be... centering.
		if ( styles[ 'text-align' ] == 'center' )
			return true;

		return false;
	}

	// Sets width and height of the widget image according to current widget data.
	//
	// @param {CKEDITOR.plugins.widget} widget
	function setDimensions( widget ) {
		var data = widget.data,
			dimensions = { width: data.width, height: data.height },
			image = widget.parts.image;

		for ( var d in dimensions ) {
			if ( dimensions[ d ] )
				image.setAttribute( d, dimensions[ d ] );
			else
				image.removeAttribute( d );
		}
	}

	// Defines all features related to drag-driven image resizing.
	//
	// @param {CKEDITOR.plugins.widget} widget
	function setupResizer( widget ) {
		var editor = widget.editor,
			editable = editor.editable(),
			doc = editor.document,
			resizer = doc.createElement( 'span' );

		resizer.addClass( 'cke_image2_resizer' );
		resizer.setAttribute( 'title', editor.lang.image2.resizer );
		resizer.append( new CKEDITOR.dom.text( '\u200b', doc ) );

		// Inline widgets don't need a resizer wrapper as an image spans the entire widget.
		if ( !widget.inline ) {
			var oldResizeWrapper = widget.element.getFirst(),
				resizeWrapper = doc.createElement( 'span' );

			resizeWrapper.addClass( 'cke_image2_resizer_wrapper' );
			resizeWrapper.append( widget.parts.image );
			resizeWrapper.append( resizer );
			widget.element.append( resizeWrapper, true );

			// Remove the old wrapper which could came from e.g. pasted HTML
			// and which could be corrupted (e.g. resizer span has been lost).
			if ( oldResizeWrapper.is( 'span' ) )
				oldResizeWrapper.remove();
		} else
			widget.wrapper.append( resizer );

		// Calculate values of size variables and mouse offsets.
		resizer.on( 'mousedown', function( evt ) {
			var image = widget.parts.image,

				// "factor" can be either 1 or -1. I.e.: For right-aligned images, we need to
				// subtract the difference to get proper width, etc. Without "factor",
				// resizer starts working the opposite way.
				factor = widget.data.align == 'right' ? -1 : 1,

				// The x-coordinate of the mouse relative to the screen
				// when button gets pressed.
				startX = evt.data.$.screenX,
				startY = evt.data.$.screenY,

				// The initial dimensions and aspect ratio of the image.
				startWidth = image.$.clientWidth,
				startHeight = image.$.clientHeight,
				ratio = startWidth / startHeight,

				listeners = [],

				// A class applied to editable during resizing.
				cursorClass = 'cke_image2_s' + ( !~factor ? 'w' : 'e' ),

				nativeEvt, newWidth, newHeight, updateData,
				moveDiffX, moveDiffY, moveRatio;

			// Save the undo snapshot first: before resizing.
			editor.fire( 'saveSnapshot' );

			// Mousemove listeners are removed on mouseup.
			attachToDocuments( 'mousemove', onMouseMove, listeners );

			// Clean up the mousemove listener. Update widget data if valid.
			attachToDocuments( 'mouseup', onMouseUp, listeners );

			// The entire editable will have the special cursor while resizing goes on.
			editable.addClass( cursorClass );

			// This is to always keep the resizer element visible while resizing.
			resizer.addClass( 'cke_image2_resizing' );

			// Attaches an event to a global document if inline editor.
			// Additionally, if framed, also attaches the same event to iframe's document.
			function attachToDocuments( name, callback, collection ) {
				var globalDoc = CKEDITOR.document,
					listeners = [];

				if ( !doc.equals( globalDoc ) )
					listeners.push( globalDoc.on( name, callback ) );

				listeners.push( doc.on( name, callback ) );

				if ( collection ) {
					for ( var i = listeners.length; i--; )
						collection.push( listeners.pop() );
				}
			}

			// Calculate with first, and then adjust height, preserving ratio.
			function adjustToX() {
				newWidth = startWidth + factor * moveDiffX;
				newHeight = Math.round( newWidth / ratio );
			}

			// Calculate height first, and then adjust width, preserving ratio.
			function adjustToY() {
				newHeight = startHeight - moveDiffY;
				newWidth = Math.round( newHeight * ratio );
			}

			// This is how variables refer to the geometry.
			// Note: x corresponds to moveOffset, this is the position of mouse
			// Note: o corresponds to [startX, startY].
			//
			// 	+--------------+--------------+
			// 	|              |              |
			// 	|      I       |      II      |
			// 	|              |              |
			// 	+------------- o -------------+ _ _ _
			// 	|              |              |      ^
			// 	|      VI      |     III      |      | moveDiffY
			// 	|              |         x _ _ _ _ _ v
			// 	+--------------+---------|----+
			// 	               |         |
			// 	                <------->
			// 	                moveDiffX
			function onMouseMove( evt ) {
				nativeEvt = evt.data.$;

				// This is how far the mouse is from the point the button was pressed.
				moveDiffX = nativeEvt.screenX - startX;
				moveDiffY = startY - nativeEvt.screenY;

				// This is the aspect ratio of the move difference.
				moveRatio = Math.abs( moveDiffX / moveDiffY );

				// Left, center or none-aligned widget.
				if ( factor == 1 ) {
					if ( moveDiffX <= 0 ) {
						// Case: IV.
						if ( moveDiffY <= 0 )
							adjustToX();

						// Case: I.
						else {
							if ( moveRatio >= ratio )
								adjustToX();
							else
								adjustToY();
						}
					} else {
						// Case: III.
						if ( moveDiffY <= 0 ) {
							if ( moveRatio >= ratio )
								adjustToY();
							else
								adjustToX();
						}

						// Case: II.
						else
							adjustToY();
					}
				}

				// Right-aligned widget. It mirrors behaviours, so I becomes II,
				// IV becomes III and vice-versa.
				else {
					if ( moveDiffX <= 0 ) {
						// Case: IV.
						if ( moveDiffY <= 0 ) {
							if ( moveRatio >= ratio )
								adjustToY();
							else
								adjustToX();
						}

						// Case: I.
						else
							adjustToY();
					} else {
						// Case: III.
						if ( moveDiffY <= 0 )
							adjustToX();

						// Case: II.
						else {
							if ( moveRatio >= ratio )
								adjustToX();
							else
								adjustToY();
						}
					}
				}

				// Don't update attributes if less than 10.
				// This is to prevent images to visually disappear.
				if ( newWidth >= 15 && newHeight >= 15 ) {
					image.setAttributes( { width: newWidth, height: newHeight } );
					updateData = true;
				} else
					updateData = false;
			}

			function onMouseUp( evt ) {
				var l;

				while ( ( l = listeners.pop() ) )
					l.removeListener();

				if ( updateData ) {
					widget.setData( { width: newWidth, height: newHeight } );

					// Save another undo snapshot: after resizing.
					editor.fire( 'saveSnapshot' );
				}

				// Restore default cursor by removing special class.
				editable.removeClass( cursorClass );

				// This is to bring back the regular behaviour of the resizer.
				resizer.removeClass( 'cke_image2_resizing' );

				// Don't update data twice or more.
				updateData = false;
			}
		} );

		// Change the position of the widget resizer when data changes.
		widget.on( 'data', function() {
			resizer[ widget.data.align == 'right' ? 'addClass' : 'removeClass' ]( 'cke_image2_resizer_left' );
		} );
	}

	// Integrates widget alignment setting with justify
	// plugin's commands (execution and refreshment).
	// @param {CKEDITOR.editor} editor
	// @param {String} value 'left', 'right', 'center' or 'block'
	function alignCommandIntegrator( editor ) {
		var execCallbacks = [];

		return function( value ) {
			var command = editor.getCommand( 'justify' + value );

			// Most likely, the justify plugin isn't loaded.
			if ( !command )
				return;

			// This command will be manually refreshed along with
			// other commands after exec.
			execCallbacks.push( function() {
				command.refresh( editor, editor.elementPath() );
			} );

			if ( value in { right:1,left:1,center:1 } ) {
				command.on( 'exec', function( evt ) {
					var widget = getFocusedWidget( editor );

					if ( widget ) {
						widget.setData( 'align', value );

						// Once the widget changed its align, all the align commands
						// must be refreshed: the event is to be cancelled.
						for ( var i = execCallbacks.length; i--; )
							execCallbacks[ i ]();

						evt.cancel();
					}
				} );
			}

			command.on( 'refresh', function( evt ) {
				var widget = getFocusedWidget( editor ),
					allowed = { right:1,left:1,center:1 };

				if ( !widget )
					return;

				this.setState(
					( widget.data.align == value ) ?
							CKEDITOR.TRISTATE_ON
						:
							( value in allowed ) ?
									CKEDITOR.TRISTATE_OFF
								:
									CKEDITOR.TRISTATE_DISABLED );

				evt.cancel();
			} );
		};
	}

	// Returns the focused widget, if of the type specific for this plugin.
	// If no widget is focused, `null` is returned.
	//
	// @param {CKEDITOR.editor}
	// @returns {CKEDITOR.plugins.widget}
	function getFocusedWidget( editor ) {
		var widget = editor.widgets.focused;

		if ( widget && widget.name == 'image2' )
			return widget;

		return null;
	}
})();