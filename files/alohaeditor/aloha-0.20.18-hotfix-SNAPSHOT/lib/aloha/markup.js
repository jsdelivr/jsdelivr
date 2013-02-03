/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
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

define([
	'aloha/core',
	'util/class',
	'aloha/jquery',
	'aloha/ecma5shims'
],
function( Aloha, Class, jQuery, shims ) {



var GENTICS = window.GENTICS;

var isOldIE = !!( jQuery.browser.msie &&
				  9 > parseInt( jQuery.browser.version, 10 ) );

function isBR( node ) {
	return 'BR' === node.nodeName;
}

function isBlock( node ) {
	return 'false' === jQuery( node ).attr( 'contenteditable' );
}

function isTextNode( node ) {
	return node && 3 === node.nodeType; // Node.TEXT_NODE
}

function nodeLength( node ) {
	return !node ? 0
				 : ( isTextNode( node ) ? node.length
										: node.childNodes.length );
}

function nextVisibleNode( node ) {
	if ( !node ) {
		return null;
	}

	if ( node.nextSibling ) {
		// Skip over nodes that the user cannot see ...
		if ( isTextNode( node.nextSibling ) &&
			 !isVisibleTextNode( node.nextSibling ) ) {
			return nextVisibleNode( node.nextSibling );
		}

		// Skip over propping <br>s ...
		if ( isBR( node.nextSibling ) &&
			 node.nextSibling === node.parentNode.lastChild ) {
			return nextVisibleNode( node.nextSibling );	
		}

		// Skip over empty editable elements ...
		if ( '' === node.nextSibling.innerHTML &&
		     !isBlock( node.nextSibling ) ) {
			return nextVisibleNode( node.nextSibling );
		}

		return node.nextSibling;
	}

	if ( node.parentNode ) {
		return nextVisibleNode( node.parentNode );
	}

	return null;
}

function prevVisibleNode( node ) {
	if ( !node ) {
		return null;
	}

	if ( node.previousSibling ) {
		// Skip over nodes that the user cannot see...
		if ( isTextNode( node.previousSibling ) &&
			 !isVisibleTextNode( node.previousSibling ) ) {
			return prevVisibleNode( node.previousSibling );
		}

		// Skip over empty editable elements ...
		if ( '' === node.previousSibling.innerHTML &&
		     !isBlock( node.previousSibling ) ) {
			return prevVisibleNode( node.previouSibling );
		}

		return node.previousSibling;
	}

	if ( node.parentNode ) {
		return prevVisibleNode( node.parentNode );
	}

	return null;
}

/**
 * Determines whether the given text node is visible to the the user,
 * based on our understanding that browsers will not display
 * superfluous white spaces.
 *
 * @param {HTMLEmenent} node The text node to be checked.
 */
function isVisibleTextNode( node ) {
	return 0 < node.data.replace( /\s+/g, '' ).length;
}

function isFrontPosition( node, offset ) {
	return ( 0 === offset ) ||
		   ( offset <= node.data.length -
					   node.data.replace( /^\s+/, '' ).length );
}

function isBlockInsideEditable( $block ) {
	return $block.parent().hasClass( 'aloha-editable' );
}

function isEndPosition( node, offset ) {
	var length = nodeLength( node );

	if ( length === offset ) {
		return true;
	}

	var isText = isTextNode( node );

	// If within a text node, then ignore superfluous white-spaces,
	// since they are invisible to the user.
	if ( isText &&
		 node.data.replace( /\s+$/, '' ).length === offset ) {
		return true;
	}

	if ( 1 === length && !isText ) {
		return isBR( node.childNodes[0] );
	}

	return false;
}

function blink( node ) {
	jQuery( node )
		.stop( true )
		.css({ opacity: 0 })
		.fadeIn( 0 ).delay( 100 )
		.fadeIn(function () {
			jQuery( node ).css({ opacity: 1 });
		});

	return node;
}

/**
 * @TODO(petro): We need to be more intelligent about whether we insert a
 *               block-level placeholder or a phrasing level element.
 * @TODO(petro): test with <pre>
 */
function jumpBlock( block, isGoingLeft ) {
	var range = new GENTICS.Utils.RangeObject();
	var sibling = isGoingLeft ? prevVisibleNode( block )
	                          : nextVisibleNode( block );

	if ( !sibling || isBlock( sibling ) ) {
		var $landing = jQuery( '<div>&nbsp;</div>' );

		if ( isGoingLeft ) {
			jQuery( block ).before( $landing );
		} else {
			jQuery( block ).after( $landing );
		}

		range.startContainer = range.endContainer = $landing[0];
		range.startOffset = range.endOffset = 0;

		// Clear out any old placeholder first ...
		cleanupPlaceholders( range );

		window.$_alohaPlaceholder = $landing;
	} else {
		range.startContainer = range.endContainer = sibling;
		range.startOffset = range.endOffset = isGoingLeft ?
			nodeLength( sibling ) : ( isOldIE ? 1 : 0 );

		cleanupPlaceholders( range );
	}

	range.select();

	Aloha.trigger( 'aloha-block-selected', block );
	Aloha.Selection.preventSelectionChanged();
}

function nodeContains( node1, node2 ) {
	return isOldIE ? ( shims.compareDocumentPosition( node1, node2 ) & 16 )
	               : 0 < jQuery( node1 ).find( node2 ).length;
}

function isInsidePlaceholder( range ) {
	var start = range.startContainer;
	var end = range.endContainer;
	var $placeholder = window.$_alohaPlaceholder;

	return $placeholder.is( start )               ||
	       $placeholder.is( end )                 ||
	       nodeContains( $placeholder[0], start ) ||
	       nodeContains( $placeholder[0], end );
}

function cleanupPlaceholders( range ) {
	if ( window.$_alohaPlaceholder && !isInsidePlaceholder( range ) ) {
		if ( 0 === window.$_alohaPlaceholder.html()
		                 .replace( /^(&nbsp;)*$/, '' ).length ) {
			window.$_alohaPlaceholder.remove();
		}

		window.$_alohaPlaceholder = null;
	}
}

/**
 * Markup object
 */
Aloha.Markup = Class.extend( {

	/**
	 * Key handlers for special key codes
	 */
	keyHandlers: {},

	/**
	 * Add a key handler for the given key code
	 * @param keyCode key code
	 * @param handler handler function
	 */
	addKeyHandler: function( keyCode, handler ) {
		if ( !this.keyHandlers[ keyCode ] ) {
			this.keyHandlers[ keyCode ] = [];
		}

		this.keyHandlers[ keyCode ].push( handler );
	},

	insertBreak: function() {
		var range = Aloha.Selection.rangeObject,
		    onWSIndex,
		    nextTextNode,
		    newBreak;

		if ( !range.isCollapsed() ) {
			this.removeSelectedMarkup();
		}

		newBreak = jQuery( '<br/>' );
		GENTICS.Utils.Dom.insertIntoDOM( newBreak, range, Aloha.activeEditable.obj );

		nextTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(
			newBreak.parent().get( 0 ),
			GENTICS.Utils.Dom.getIndexInParent( newBreak.get( 0 ) ) + 1,
			false
		);

		if ( nextTextNode ) {
			// trim leading whitespace
			nonWSIndex = nextTextNode.data.search( /\S/ );
			if ( nonWSIndex > 0 ) {
				nextTextNode.data = nextTextNode.data.substring( nonWSIndex );
			}
		}

		range.startContainer = range.endContainer = newBreak.get( 0 ).parentNode;
		range.startOffset = range.endOffset = GENTICS.Utils.Dom.getIndexInParent( newBreak.get( 0 ) ) + 1;
		range.correctRange();
		range.clearCaches();
		range.select();
	},

	/**
	 * first method to handle key strokes
	 * @param event DOM event
	 * @param rangeObject as provided by Aloha.Selection.getRangeObject();
	 * @return "Aloha.Selection"
	 */
	preProcessKeyStrokes: function( event ) {
		if ( event.type !== 'keydown' ) {
			return false;
		}

		var rangeObject = Aloha.Selection.rangeObject,
		    handlers,
		    i;

		if ( this.keyHandlers[ event.keyCode ] ) {
			handlers = this.keyHandlers[ event.keyCode ];
			for ( i = 0; i < handlers.length; ++i ) {
				if ( !handlers[i]( event ) ) {
					return false;
				}
			}
		}

		// LEFT (37), RIGHT (39) keys for block detection
		if ( event.keyCode === 37 || event.keyCode === 39 ) {
			if ( this.processCursor( rangeObject, event.keyCode ) ) {
				cleanupPlaceholders( Aloha.Selection.rangeObject );
				return true;
			}

			return false;
		}

		// BACKSPACE
		if ( event.keyCode === 8 ) {
			event.preventDefault(); // prevent history.back() even on exception
			Aloha.execCommand( 'delete', false );
			return false;
		}

		// DELETE
		if ( event.keyCode === 46 ) {
			Aloha.execCommand( 'forwarddelete', false );
			return false;
		}

		// ENTER
		if  ( event.keyCode === 13 ) {
			if ( event.shiftKey ) {
				Aloha.execCommand( 'insertlinebreak', false );
				return false;
			} else {
				Aloha.execCommand( 'insertparagraph', false );
				return false;
			}
		}

		return true;
	},

	/**
	 * Processing of cursor keys.
	 * Detect blocks (elements with contenteditable=false) and will select them
	 * (normally the cursor would simply jump right past them).
	 *
	 * For each block that is selected, an 'aloha-block-selected' event will be
	 * triggered.
	 *
	 * @param {RangyRange} range A range object for the current selection.
	 * @param {number} keyCode Code of the currently pressed key.
	 * @return {boolean} False if a block was found, to prevent further events,
	 *                   true otherwise.
	 */
	processCursor: function( range, keyCode ) {
		if ( !range.isCollapsed() ) {
			return true;
		}

		var node = range.startContainer;

		if ( !node ) {
			return true;
		}

		var sibling;

		// Versions of Internet Explorer that are older that 9, will
		// erroneously allow you to enter and edit inside elements which have
		// their contenteditable attribute set to false...
		if ( isOldIE && !jQuery(node).contentEditable() ) {
			var $parentBlock = jQuery( node ).parents(
				'[contenteditable=false]' );
			var isInsideBlock = $parentBlock.length > 0;

			if ( isInsideBlock ) {
				if ( isBlockInsideEditable( $parentBlock ) ) {
					sibling = $parentBlock[0];
				} else {
					return true;
				}
			}
		}
		
		if ( !sibling ) {
			// True if keyCode denotes LEFT or UP arrow key, otherwise they
			// keyCode is for RIGHT or DOWN in which this value will be false.
			var isLeft = (37 === keyCode || 38 === keyCode);
			var offset = range.startOffset;

			if ( isTextNode( node ) ) {
				if ( isLeft ) {
					// FIXME(Petro): Please consider if you have a better idea
					//               of how we can work around this.
					//
					// Here is the problem... with Internet Explorer:
					// ----------------------------------------------
					//
					// Versions of Internet Explorer older than 9, are buggy in
					// how they `select()', or position a selection from cursor
					// movements, when the following conditions are true:
					//
					//  * The range is collapsed.
					//  * startContainer is a contenteditable text node.
					//  * startOffset is 1.
					//  * There is a non-conenteditable element left of the
					//    startContainer.
					//  * You attempt to move left to offset 0 (we consider a
					//    range to be at "frontposition" if it is at offset 0
					//    within its startContainer).
					//
					// What happens in IE 7, and IE 8, is that the selection
					// will jump to the adjacent non-contenteditable
					// element(s), instead moving to the front of the
					// container, and the offset will be stuck at 1--even as
					// the cursor is jumping around the screen!
					//
					// Our imperfect work-around is to reckon ourselves to be
					// at the front of the next node (ie: offset 0 in other
					// browsers), as soon as we detect that we are at offset 1
					// in IEv<9.
					//
					// Considering the bug, I think this is acceptable because
					// the user can still position themselve right between the
					// block (non-contenteditable element) and the first
					// characater of the text node by clicking there with the
					// mouse, since this seems to work fine in all IE versions.
					var isFrontPositionInIE = isOldIE && 1 === offset;

					if ( !isFrontPositionInIE &&
						 !isFrontPosition( node, offset ) ) {
						return true;
					}

				} else if ( !isEndPosition( node, offset ) ) {
					return true;
				}

			} else {
				node = node.childNodes[
					offset === nodeLength( node ) ? offset - 1 : offset ];
			}

			sibling = isLeft ? prevVisibleNode( node )
			                 : nextVisibleNode( node );
		}

		if ( isBlock( sibling ) ) {
			jumpBlock( sibling, isLeft );
			return false;
		}

		return true;
	},

	/**
	 * method handling shiftEnter
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	processShiftEnter: function( rangeObject ) {
		this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject );
	},

	/**
	 * method handling Enter
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	processEnter: function( rangeObject ) {
		if ( rangeObject.splitObject ) {
			// now comes a very evil hack for ie, when the enter is pressed in a text node in an li element, we just append an empty text node
			// if ( jQuery.browser.msie
			// 		&& GENTICS.Utils.Dom
			// 				.isListElement( rangeObject.splitObject ) ) {
			// 	jQuery( rangeObject.splitObject ).append(
			// 			jQuery( document.createTextNode( '' ) ) );
			// }
			this.splitRangeObject( rangeObject );
		} else { // if there is no split object, the Editable is the paragraph type itself (e.g. a p or h2)
			this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject );
		}
	},

	/**
	 * Insert the given html markup at the current selection
	 * @param html html markup to be inserted
	 */
	insertHTMLCode: function( html ) {
		var rangeObject = Aloha.Selection.rangeObject;
		this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject, jQuery( html ) );
	},

	/**
	 * insert an HTML Break <br /> into current selection
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	insertHTMLBreak: function( selectionTree, rangeObject, inBetweenMarkup ) {
		var i,
		    treeLength,
		    el,
		    jqEl,
		    jqElBefore,
		    jqElAfter,
		    tmpObject,
		    offset,
		    checkObj;

		inBetweenMarkup = inBetweenMarkup ? inBetweenMarkup: jQuery( '<br/>' );

		for ( i = 0, treeLength = selectionTree.length; i < treeLength; ++i ) {
			el = selectionTree[ i ];
			jqEl = el.domobj ? jQuery( el.domobj ) : undefined;

			if ( el.selection !== 'none' ) { // before cursor, leave this part inside the splitObject
				if ( el.selection == 'collapsed' ) {
					// collapsed selection found (between nodes)
					if ( i > 0 ) {
						// not at the start, so get the element to the left
						jqElBefore = jQuery( selectionTree[ i - 1 ].domobj );

						// and insert the break after it
						jqElBefore.after( inBetweenMarkup );

					} else {
						// at the start, so get the element to the right
						jqElAfter = jQuery( selectionTree[1].domobj );

						// and insert the break before it
						jqElAfter.before( inBetweenMarkup );
					}

					// now set the range
					rangeObject.startContainer = rangeObject.endContainer = inBetweenMarkup[0].parentNode;
					rangeObject.startOffset = rangeObject.endOffset = GENTICS.Utils.Dom.getIndexInParent( inBetweenMarkup[0] ) + 1;
					rangeObject.correctRange();

				} else if ( el.domobj && el.domobj.nodeType === 3 ) { // textNode
					// when the textnode is immediately followed by a blocklevel element (like p, h1, ...) we need to add an additional br in between
					if ( el.domobj.nextSibling
						 && el.domobj.nextSibling.nodeType == 1
						 && Aloha.Selection.replacingElements[
								el.domobj.nextSibling.nodeName.toLowerCase()
							] ) {
						// TODO check whether this depends on the browser
						jqEl.after( '<br/>' );
					}

					if ( this.needEndingBreak() ) {
						// when the textnode is the last inside a blocklevel element
						// (like p, h1, ...) we need to add an additional br as very
						// last object in the blocklevel element
						checkObj = el.domobj;

						while ( checkObj ) {
							if ( checkObj.nextSibling ) {
								checkObj = false;
							} else {
								// go to the parent
								checkObj = checkObj.parentNode;

								// found a blocklevel or list element, we are done
								if ( GENTICS.Utils.Dom.isBlockLevelElement( checkObj )
									 || GENTICS.Utils.Dom.isListElement( checkObj ) ) {
									break;
								}

								// reached the limit object, we are done
								if ( checkObj === rangeObject.limitObject ) {
									checkObj = false;
								}
							}
						}

						// when we found a blocklevel element, insert a break at the
						// end. Mark the break so that it is cleaned when the
						// content is fetched.
						if ( checkObj ) {
							jQuery( checkObj ).append( '<br class="aloha-cleanme" />' );
						}
					}

					// insert the break
					jqEl.between( inBetweenMarkup, el.startOffset );

					// correct the range
					// count the number of previous siblings
					offset = 0;
					tmpObject = inBetweenMarkup[0];
					while ( tmpObject ) {
						tmpObject = tmpObject.previousSibling;
						++offset;
					}

					rangeObject.startContainer = inBetweenMarkup[0].parentNode;
					rangeObject.endContainer = inBetweenMarkup[0].parentNode;
					rangeObject.startOffset = offset;
					rangeObject.endOffset = offset;
					rangeObject.correctRange();

				} else if ( el.domobj && el.domobj.nodeType === 1 ) { // other node, normally a break
					if ( jqEl.parent().find( 'br.aloha-ephemera' ).length === 0 ) {
						// but before putting it, remove all:
						jQuery( rangeObject.limitObject ).find( 'br.aloha-ephemera' ).remove();

						//  now put it:
						jQuery( rangeObject.commonAncestorContainer )
							.append( this.getFillUpElement( rangeObject.splitObject ) );
					}

					jqEl.after( inBetweenMarkup );

					// now set the selection. Since we just added one break do the currect el
					// the new position must be el's position + 1. el's position is the index
					// of the el in the selection tree, which is i. then we must add
					// another +1 because we want to be AFTER the object, not before. therefor +2
					rangeObject.startContainer = rangeObject.commonAncestorContainer;
					rangeObject.endContainer = rangeObject.startContainer;
					rangeObject.startOffset = i + 2;
					rangeObject.endOffset = i + 2;
					rangeObject.update();
				}
			}
		}
		rangeObject.select();
	},

	/**
	 * Check whether blocklevel elements need breaks at the end to visibly render a newline
	 * @return true if an ending break is necessary, false if not
	 */
	needEndingBreak: function() {
		// currently, all browser except IE need ending breaks
		return !jQuery.browser.msie;
	},

	/**
	 * Get the currently selected text or false if nothing is selected (or the selection is collapsed)
	 * @return selected text
	 */
	getSelectedText: function() {
		var rangeObject = Aloha.Selection.rangeObject;

		if ( rangeObject.isCollapsed() ) {
			return false;
		}

		return this.getFromSelectionTree( rangeObject.getSelectionTree(), true );
	},

	/**
	 * Recursive function to get the selected text from the selection tree starting at the given level
	 * @param selectionTree array of selectiontree elements
	 * @param astext true when the contents shall be fetched as text, false for getting as html markup
	 * @return selected text from that level (incluiding all sublevels)
	 */
	getFromSelectionTree: function( selectionTree, astext ) {
		var text = '', i, treeLength, el, clone;
		for ( i = 0, treeLength = selectionTree.length; i < treeLength; i++ ) {
			el = selectionTree[i];
			if ( el.selection == 'partial' ) {
				if ( el.domobj.nodeType === 3 ) {
					// partial text node selected, get the selected part
					text += el.domobj.data.substring( el.startOffset, el.endOffset );
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// partial element node selected, do the recursion into the children
					if ( astext ) {
						text += this.getFromSelectionTree( el.children, astext );
					} else {
						// when the html shall be fetched, we create a clone of
						// the element and remove all the children
						clone = jQuery( el.domobj.outerHTML ).empty();
						// then we do the recursion and add the selection into the clone
						clone.html( this.getFromSelectionTree( el.children, astext ) );
						// finally we get the html of the clone
						text += clone.outerHTML();
					}
				}
			} else if ( el.selection == 'full' ) {
				if ( el.domobj.nodeType === 3 ) {
					// full text node selected, get the text
					text += jQuery( el.domobj ).text();
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// full element node selected, get the html of the node and all children
					text += astext ? jQuery( el.domobj ).text() : jQuery( el.domobj ).outerHTML();
				}
			}
		}

		return text;
	},

	/**
	 * Get the currently selected markup or false if nothing is selected (or the selection is collapsed)
	 * @return {?String}
	 */
	getSelectedMarkup: function() {
		var rangeObject = Aloha.Selection.rangeObject;
		return rangeObject.isCollapsed() ? null
			: this.getFromSelectionTree( rangeObject.getSelectionTree(), false );
	},

	/**
	 * Remove the currently selected markup
	 */
	removeSelectedMarkup: function() {
		var rangeObject = Aloha.Selection.rangeObject, newRange;

		if ( rangeObject.isCollapsed() ) {
			return;
		}

		newRange = new Aloha.Selection.SelectionRange();
		// remove the selection
		this.removeFromSelectionTree( rangeObject.getSelectionTree(), newRange );

		// do a cleanup now (starting with the commonancestorcontainer)
		newRange.update();
		GENTICS.Utils.Dom.doCleanup( { 'merge' : true, 'removeempty' : true }, Aloha.Selection.rangeObject );
		Aloha.Selection.rangeObject = newRange;

		// need to set the collapsed selection now
		newRange.correctRange();
		newRange.update();
		newRange.select();
		Aloha.Selection.updateSelection();
	},

	/**
	 * Recursively remove the selected items, starting with the given level in the selectiontree
	 * @param selectionTree current level of the selectiontree
	 * @param newRange new collapsed range to be set after the removal
	 */
	removeFromSelectionTree: function( selectionTree, newRange ) {
		// remember the first found partially selected element node (in case we need
		// to merge it with the last found partially selected element node)
		var firstPartialElement,
		    newdata,
		    i,
		    el,
		    adjacentTextNode,
		    treeLength;

		// iterate through the selection tree
		for ( i = 0, treeLength = selectionTree.length; i < treeLength; i++ ) {
			el = selectionTree[ i ];

			// check the type of selection
			if ( el.selection == 'partial' ) {
				if ( el.domobj.nodeType === 3 ) {
					// partial text node selected, so remove the selected portion
					newdata = '';
					if ( el.startOffset > 0 ) {
						newdata += el.domobj.data.substring( 0, el.startOffset );
					}
					if ( el.endOffset < el.domobj.data.length ) {
						newdata += el.domobj.data.substring( el.endOffset, el.domobj.data.length );
					}
					el.domobj.data = newdata;

					// eventually set the new range (if not done before)
					if ( !newRange.startContainer ) {
						newRange.startContainer = newRange.endContainer = el.domobj;
						newRange.startOffset = newRange.endOffset = el.startOffset;
					}
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// partial element node selected, so do the recursion into the children
					this.removeFromSelectionTree( el.children, newRange );

					if ( firstPartialElement ) {
						// when the first parially selected element is the same type
						// of element, we need to merge them
						if ( firstPartialElement.nodeName == el.domobj.nodeName ) {
							// merge the nodes
							jQuery( firstPartialElement ).append( jQuery( el.domobj ).contents() );

							// and remove the latter one
							jQuery( el.domobj ).remove();
						}

					} else {
						// remember this element as first partially selected element
						firstPartialElement = el.domobj;
					}
				}

			} else if ( el.selection == 'full' ) {
				// eventually set the new range (if not done before)
				if ( !newRange.startContainer ) {
					adjacentTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(
						el.domobj.parentNode,
						GENTICS.Utils.Dom.getIndexInParent( el.domobj ) + 1,
						false,
						{ 'blocklevel' : false }
					);

					if ( adjacentTextNode ) {
						newRange.startContainer = newRange.endContainer = adjacentTextNode;
						newRange.startOffset = newRange.endOffset = 0;
					} else {
						newRange.startContainer = newRange.endContainer = el.domobj.parentNode;
						newRange.startOffset = newRange.endOffset = GENTICS.Utils.Dom.getIndexInParent( el.domobj ) + 1;
					}
				}

				// full node selected, so just remove it (will also remove all children)
				jQuery( el.domobj ).remove();
			}
		}
	},

	/**
	 * split passed rangeObject without or with optional markup
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @param markup object (jQuery) to insert in between the split elements
	 * @return void
	 */
	splitRangeObject: function( rangeObject, markup ) {
		// UAAAA: first check where the markup can be inserted... *grrrrr*, then decide where to split
		// object which is split up
		var
			splitObject = jQuery( rangeObject.splitObject ),
			selectionTree, insertAfterObject, followUpContainer;

		// update the commonAncestor with the splitObject (so that the selectionTree is correct)
		rangeObject.update( rangeObject.splitObject ); // set the splitObject as new commonAncestorContainer and update the selectionTree

		// calculate the selection tree. NOTE: it is necessary to do this before
		// getting the followupcontainer, since getting the selection tree might
		// possibly merge text nodes, which would lead to differences in the followupcontainer
		selectionTree = rangeObject.getSelectionTree();

		// object to be inserted after the splitObject
		followUpContainer = this.getSplitFollowUpContainer( rangeObject );

		// now split up the splitObject into itself AND the followUpContainer
		this.splitRangeObjectHelper( selectionTree, rangeObject, followUpContainer ); // split the current object into itself and the followUpContainer

		// check whether the followupcontainer is still marked for removal
		if ( followUpContainer.hasClass( 'preparedForRemoval' ) ) {
			// TODO shall we just remove the class or shall we not use the followupcontainer?
			followUpContainer.removeClass( 'preparedForRemoval' );
		}

		// now let's find the place, where the followUp is inserted afterwards. normally that's the splitObject itself, but in
		// some cases it might be their parent (e.g. inside a list, a <p> followUp must be inserted outside the list)
		insertAfterObject = this.getInsertAfterObject( rangeObject, followUpContainer );

		// now insert the followUpContainer
		jQuery( followUpContainer ).insertAfter( insertAfterObject ); // attach the followUpContainer right after the insertAfterObject

		// in some cases, we want to remove the "empty" splitObject (e.g. LIs, if enter was hit twice)
		if ( rangeObject.splitObject.nodeName.toLowerCase() === 'li' && !Aloha.Selection.standardTextLevelSemanticsComparator( rangeObject.splitObject, followUpContainer ) ) {
			jQuery( rangeObject.splitObject ).remove();
		}

		rangeObject.startContainer = null;
		// first check whether the followUpContainer starts with a <br/>
		// if so, place the cursor right before the <br/>
		var followContents = followUpContainer.contents();
		if ( followContents.length > 0
			 && followContents.get( 0 ).nodeType == 1
			 && followContents.get( 0 ).nodeName.toLowerCase() === 'br' ) {
			rangeObject.startContainer = followUpContainer.get( 0 );
		}

		if ( !rangeObject.startContainer ) {
			// find a possible text node in the followUpContainer and set the selection to it
			// if no textnode is available, set the selection to the followup container itself
			rangeObject.startContainer = followUpContainer.textNodes( true, true ).first().get( 0 );
		}
		if ( !rangeObject.startContainer ) { // if no text node was found, select the parent object of <br class="aloha-ephemera" />
			rangeObject.startContainer = followUpContainer.textNodes( false ).first().parent().get( 0 );
		}
		if ( rangeObject.startContainer ) {
			// the cursor is always at the beginning of the followUp
			rangeObject.endContainer = rangeObject.startContainer;
			rangeObject.startOffset = 0;
			rangeObject.endOffset = 0;
		} else {
			rangeObject.startContainer = rangeObject.endContainer = followUpContainer.parent().get( 0 );
			rangeObject.startOffset = rangeObject.endOffset = GENTICS.Utils.Dom.getIndexInParent( followUpContainer.get( 0 ) );
		}

		// finally update the range object again
		rangeObject.update();

		// now set the selection
		rangeObject.select();
	},

	/**
	 * method to get the object after which the followUpContainer can be inserted during splitup
	 * this is a helper method, not needed anywhere else
	 * @param rangeObject Aloha.Selection.SelectionRange of the current selection
	 * @param followUpContainer optional jQuery object; if provided the rangeObject will be split and the second part will be insert inside of this object
	 * @return object after which the followUpContainer can be inserted
	 */
	getInsertAfterObject: function( rangeObject, followUpContainer ) {
		var passedSplitObject, i, el;

		for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++ ) {
			el = rangeObject.markupEffectiveAtStart[ i ];

			// check if we have already passed the splitObject (some other markup might come before)
			if ( el === rangeObject.splitObject ) {
				passedSplitObject = true;
			}

			// if not passed splitObject, skip this markup
			if ( !passedSplitObject ) {
				continue;
			}

			// once we are passed, check if the followUpContainer is allowed to be inserted into the currents el's parent
			if ( Aloha.Selection.canTag1WrapTag2( jQuery( el ).parent()[0].nodeName, followUpContainer[0].nodeName ) ) {
				return el;
			}
		}

		return false;
	},

	/**
	 * @fixme: Someone who knows what this function does, please refactor it.
	 *			1. splitObject arg is not used at all
	 *			2. Would be better to use ternary operation would be better than if else statement
	 *
	 * method to get the html code for a fillUpElement. this is needed for empty paragraphs etc., so that they take up their expected height
	 * @param splitObject split object (dom object)
	 * @return fillUpElement HTML Code
	 */
	getFillUpElement: function( splitObject ) {
		if ( jQuery.browser.msie ) {
			return false;
		} else {
			return jQuery( '<br class="aloha-cleanme"/>' );
		}
	},

	/**
	 * removes textNodes from passed array, which only contain contentWhiteSpace (e.g. a \n between two tags)
	 * @param domArray array of domObjects
	 * @return void
	 */
	removeElementContentWhitespaceObj: function( domArray ) {
		var correction = 0,
		    removeLater = [],
		    i,
		    el, removeIndex;

		for ( i = 0; i < domArray.length; ++i ) {
			el = domArray[ i ];
			if ( el.isElementContentWhitespace ) {
				removeLater[ removeLater.length ] = i;
			}
		}

		for ( i = 0; i < removeLater.length; ++i ) {
			removeIndex = removeLater[ i ];
			domArray.splice( removeIndex - correction, 1 );
			++correction;
		}
	},

	/**
	 * recursive method to parallelly walk through two dom subtrees, leave elements before startContainer in first subtree and move rest to other
	 * @param selectionTree tree to iterate over as contained in rangeObject. must be passed separately to allow recursion in the selection tree, but not in the rangeObject
	 * @param rangeObject Aloha.Selection.SelectionRange of the current selection
	 * @param followUpContainer optional jQuery object; if provided the rangeObject will be split and the second part will be insert inside of this object
	 * @param inBetweenMarkup jQuery object to be inserted between the two split parts. will be either a <br> (if no followUpContainer is passed) OR e.g. a table, which must be inserted between the splitobject AND the follow up
	 * @return void
	 */
	splitRangeObjectHelper: function( selectionTree, rangeObject,
									  followUpContainer, inBetweenMarkup ) {
		if ( !followUpContainer ) {
			Aloha.Log.warn( this, 'no followUpContainer, no inBetweenMarkup, nothing to do...' );
		}

		var fillUpElement = this.getFillUpElement( rangeObject.splitObject ),
		    splitObject = jQuery( rangeObject.splitObject ),
		    startMoving = false,
		    el,
		    i,
		    completeText,
		    jqObj,
		    mirrorLevel,
		    parent,
		    treeLength;

		if ( selectionTree.length > 0 ) {
			mirrorLevel = followUpContainer.contents();

			// if length of mirrorLevel and selectionTree are not equal, the mirrorLevel must be corrected. this happens, when the mirrorLevel contains whitespace textNodes
			if ( mirrorLevel.length !== selectionTree.length ) {
				this.removeElementContentWhitespaceObj( mirrorLevel );
			}

			for ( i = 0, treeLength = selectionTree.length; i < treeLength; ++i ) {
				el = selectionTree[ i ];

				// remove all objects in the mirrorLevel, which are BEFORE the cursor
				// OR if the cursor is at the last position of the last Textnode (causing an empty followUpContainer to be appended)
				if ( ( el.selection === 'none' && startMoving === false ) ||
					 ( el.domobj && el.domobj.nodeType === 3
						&& el === selectionTree[ ( selectionTree.length - 1 ) ]
						&& el.startOffset === el.domobj.data.length ) ) {
					// iteration is before cursor, leave this part inside the splitObject, remove from followUpContainer
					// however if the object to remove is the last existing textNode within the followUpContainer, insert a BR instead
					// otherwise the followUpContainer is invalid and takes up no vertical space

					if ( followUpContainer.textNodes().length > 1
						 || ( el.domobj.nodeType === 1 && el.children.length === 0 ) ) {
						// note: the second part of the if (el.domobj.nodeType === 1 && el.children.length === 0) covers a very special condition,
						// where an empty tag is located right before the cursor when pressing enter. In this case the empty tag would not be
						// removed correctly otherwise
						mirrorLevel.eq( i ).remove();

					} else if ( GENTICS.Utils.Dom.isSplitObject( followUpContainer[0] ) ) {
						if ( fillUpElement ) {
							followUpContainer.html( fillUpElement ); // for your zoological german knowhow: ephemera = Eintagsfliege
						} else {
							followUpContainer.empty();
						}

					} else {
						followUpContainer.empty();
						followUpContainer.addClass( 'preparedForRemoval' );
					}

					continue;

				} else {
					// split objects, which are AT the cursor Position or directly above
					if ( el.selection !== 'none' ) { // before cursor, leave this part inside the splitObject
						// TODO better check for selection == 'partial' here?
						if ( el.domobj && el.domobj.nodeType === 3 && el.startOffset !== undefined ) {
							completeText = el.domobj.data;
							if ( el.startOffset > 0 ) {// first check, if there will be some text left in the splitObject
								el.domobj.data = completeText.substr( 0, el.startOffset );
							} else if ( selectionTree.length > 1 ) { // if not, check if the splitObject contains more than one node, because then it can be removed. this happens, when ENTER is pressed inside of a textnode, but not at the borders
								jQuery( el.domobj ).remove();
							} else { // if the "empty" textnode is the last node left in the splitObject, replace it with a ephemera break
								// if the parent is a blocklevel element, we insert the fillup element
								parent = jQuery( el.domobj ).parent();
								if ( GENTICS.Utils.Dom.isSplitObject( parent[0] ) ) {
									if ( fillUpElement ) {
										parent.html( fillUpElement );
									} else {
										parent.empty();
									}

								} else {
									// if the parent is no blocklevel element and would be empty now, we completely remove it
									parent.remove();
								}
							}
							if ( completeText.length - el.startOffset > 0 ) {
								// first check if there is text left to put in the followUpContainer's textnode. this happens, when ENTER is pressed inside of a textnode, but not at the borders
								mirrorLevel[i].data = completeText.substr( el.startOffset, completeText.length );
							} else if ( mirrorLevel.length > 1 ) {
								// if not, check if the followUpContainer contains more than one node, because if yes, the "empty" textnode can be removed
								mirrorLevel.eq( ( i ) ).remove();
							} else if ( GENTICS.Utils.Dom.isBlockLevelElement( followUpContainer[0] ) ) {
								// if the "empty" textnode is the last node left in the followUpContainer (which is a blocklevel element), replace it with a ephemera break
								if ( fillUpElement ) {
									followUpContainer.html( fillUpElement );
								} else {
									followUpContainer.empty();
								}

							} else {
								// if the "empty" textnode is the last node left in a non-blocklevel element, mark it for removal
								followUpContainer.empty();
								followUpContainer.addClass( 'preparedForRemoval' );
							}
						}

						startMoving = true;

						if ( el.children.length > 0 ) {
							this.splitRangeObjectHelper( el.children, rangeObject, mirrorLevel.eq( i ), inBetweenMarkup );
						}

					} else {
						// remove all objects in the origin, which are AFTER the cursor
						if ( el.selection === 'none' && startMoving === true ) {
							// iteration is after cursor, remove from splitObject and leave this part inside the followUpContainer
							jqObj = jQuery( el.domobj ).remove();
						}
					}
				}
			}
		} else {
			Aloha.Log.error( this, 'can not split splitObject due to an empty selection tree' );
		}

		// and finally cleanup: remove all fillUps > 1
		splitObject.find( 'br.aloha-ephemera:gt(0)' ).remove(); // remove all elements greater than (gt) 0, that also means: leave one
		followUpContainer.find( 'br.aloha-ephemera:gt(0)' ).remove(); // remove all elements greater than (gt) 0, that also means: leave one

		// remove objects prepared for removal
		splitObject.find( '.preparedForRemoval' ).remove();
		followUpContainer.find( '.preparedForRemoval' ).remove();

		// if splitObject / followUp are empty, place a fillUp inside
		if ( splitObject.contents().length === 0
			 && GENTICS.Utils.Dom.isSplitObject( splitObject[0] )
			 && fillUpElement ) {
			splitObject.html( fillUpElement );
		}

		if ( followUpContainer.contents().length === 0
			 && GENTICS.Utils.Dom.isSplitObject( followUpContainer[0] )
			 && fillUpElement ) {
			followUpContainer.html( fillUpElement );
		}
	},

	/**
	 * returns a jQuery object fitting the passed splitObject as follow up object
	 * examples,
	 * - when passed a p it will return an empty p (clone of the passed p)
	 * - when passed an h1, it will return either an h1 (clone of the passed one) or a new p (if the collapsed selection was at the end)
	 * @param rangeObject Aloha.RangeObject
	 * @return void
	 */
	getSplitFollowUpContainer: function( rangeObject ) {
		var tagName = rangeObject.splitObject.nodeName.toLowerCase(),
		    returnObj,
		    inside,
		    lastObj;

		switch ( tagName ) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				// get the last textnode in the splitobject, but don't consider aloha-cleanme elements
				lastObj = jQuery( rangeObject.splitObject ).textNodes( ':not(.aloha-cleanme)' ).last()[0];
				// special case: when enter is hit at the end of a heading, the followUp should be a <p>
				if ( lastObj && rangeObject.startContainer === lastObj
					 && rangeObject.startOffset === lastObj.length ) {
					returnObj = jQuery( '<p></p>' );
					inside = jQuery( rangeObject.splitObject.outerHTML ).contents();
					returnObj.append( inside );
					return returnObj;
				}
				break;

			case 'li':
				// TODO check whether the li is the last one
				// special case: if enter is hit twice inside a list, the next item should be a <p> (and inserted outside the list)
				if ( rangeObject.startContainer.nodeName.toLowerCase() === 'br'
					 && jQuery( rangeObject.startContainer ).hasClass( 'aloha-ephemera' ) ) {
					returnObj = jQuery( '<p></p>' );
					inside = jQuery( rangeObject.splitObject.outerHTML ).contents();
					returnObj.append( inside );
					return returnObj;
				}
				// when the li is the last one and empty, we also just return a <p>
				if ( !rangeObject.splitObject.nextSibling
					 && jQuery.trim( jQuery( rangeObject.splitObject ).text() ).length === 0 ) {
					returnObj = jQuery( '<p></p>' );
					return returnObj;
				}
		}

		return jQuery( rangeObject.splitObject.outerHTML );
	},

	/**
	 * Transform the given domobj into an object with the given new nodeName.
	 * Preserves the content and all attributes. If a range object is given, also the range will be preserved
	 * @param domobj dom object to transform
	 * @param nodeName new node name
	 * @param range range object
	 * @api
	 * @return new object as jQuery object
	 */
	transformDomObject: function( domobj, nodeName, range ) {
		// first create the new element
		var jqOldObj = jQuery( domobj ),
		    jqNewObj = jQuery( '<' + nodeName + '></' + nodeName + '>' ),
		    i;

		// TODO what about events?

		// copy attributes
		if ( jqOldObj[0].attributes ) {
			for ( i = 0; i < jqOldObj[0].attributes.length; ++i ) {
				if (jqOldObj[0].attributes[i].specified) {
					jqNewObj.attr(
							jqOldObj[0].attributes[ i ].nodeName,
							jqOldObj[0].attributes[ i ].nodeValue
					);
				}
			}
		}

		// copy inline CSS
		if ( jqOldObj[0].style && jqOldObj[0].style.cssText ) {
			jqNewObj[0].style.cssText = jqOldObj[0].style.cssText;
		}

		// now move the contents of the old dom object into the new dom object
		jqOldObj.contents().appendTo( jqNewObj );

		// finally replace the old object with the new one
		jqOldObj.replaceWith( jqNewObj );

		// preserve the range
		if ( range ) {
			if ( range.startContainer == domobj ) {
				range.startContainer = jqNewObj.get( 0 );
			}

			if ( range.endContainer == domobj ) {
				range.endContainer = jqNewObj.get( 0 );
			}
		}

		return jqNewObj;
	},

	/**
	 * String representation
	 * @return {String}
	 */
	toString: function() {
		return 'Aloha.Markup';
	}

} );

Aloha.Markup = new Aloha.Markup();

return Aloha.Markup;

} );
