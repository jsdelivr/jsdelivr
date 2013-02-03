/* genericcontenthandler.js is part of Aloha Editor project http://aloha-editor.org
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
define(
['aloha', 'jquery', 'aloha/contenthandlermanager'],
function(Aloha, jQuery, ContentHandlerManager) {
	

	var
		GENTICS = window.GENTICS;

	/**
	 * Register the generic content handler
	 */
	var GenericContentHandler = ContentHandlerManager.createHandler({
		/**
		 * Handle the pasting. Remove all unwanted stuff.
		 * @param content
		 */
		handleContent: function( content ) {

			if (null == content) {
				return;
			}

			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' );
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content);
			}

			// If we find an aloha-block inside the pasted content,
			// we do not modify the pasted stuff, as it most probably
			// comes from Aloha and not from other sources, and does
			// not need to be cleaned up.
			if (content.find('.aloha-block').length > 0) {
				return;
			}

			// clean lists
			this.cleanLists(content);

			// transform tables
			this.transformTables(content);

			// remove comments
			this.removeComments(content);

			// unwrap font and span tags
			this.unwrapTags(content);

			// remove styles
			this.removeStyles(content);

			// remove namespaced elements
			this.removeNamespacedElements(content);

			// transform formattings
			var transformFormattingsEnabled = true;
			if ( Aloha.settings 
				&& Aloha.settings.contentHandler
				&& Aloha.settings.contentHandler.handler
				&& Aloha.settings.contentHandler.handler.generic
				&& typeof Aloha.settings.contentHandler.handler.generic.transformFormattings !== 'undefinded'
				&& !Aloha.settings.contentHandler.handler.generic.transformFormattings ) {
					transformFormattingsEnabled = false;
			}

			if ( transformFormattingsEnabled === true ) {
			    this.transformFormattings(content);
			}

			// transform links
			//this.transformLinks(content);

			return content.html();
		},

		/**
		 * Clean lists: The only allowed children of ol or ul elements are li's. Everything else will be removed
		 * @param content
		 */
		cleanLists: function(content) {
			content.find('ul,ol').each(function() {
				var $list = jQuery(this);
				$list.contents(':not(li,ul,ol)').each(function() {
					jQuery(this).remove();
				});
			});
		},

		/**
		 * Transform tables which were pasted
		 * @param content
		 */
		transformTables: function(content) {
			// remove border, cellspacing, cellpadding from all tables
			// @todo what about width, height?
			content.find('table').each(function() {
				jQuery(this).removeAttr('border').removeAttr('cellspacing').removeAttr('cellpadding');
			});
			
			// remove unwanted attributes and cleanup single empty p-tags
			content.find('td').each(function() {
				// remove width, height and valign from all table cells
				jQuery(this).removeAttr('width').removeAttr('height').removeAttr('valign');
				
				if ( this.innerHTML.replace(/[\s\xA0]+/g,'') === '<p><br></p>' ) {
					this.innerHTML = '&nbsp;';
				}
				
				if ( jQuery(this).find('p').length === 1) {
					jQuery(this).find('p').contents().unwrap();
				}
			});
			
			// remove unwanted attributes from tr also? (tested with paste from open/libre office)
			// @todo or do this all via sanitize.js 
			content.find('tr').each(function() {
				// remove width, height and valign from all table cells
				jQuery(this).removeAttr('width').removeAttr('height').removeAttr('valign');
			});
			
			// completely colgroup tags
			// @TODO should we remove colgroup? use sanitize for that?
			content.find('colgroup').remove();
		},

		/**
		 * Transform formattings
		 * @param content
		 */
		transformFormattings: function( content ) {
			// find all formattings we will transform
			// @todo this makes troubles -- don't change semantics! at least in this way...
			content.find('strong,em,s,u,strike').each(function() {
				if (this.nodeName === 'STRONG') {
					// transform strong to b
					Aloha.Markup.transformDomObject(jQuery(this), 'b');
				} else if (this.nodeName === 'EM') {
					// transform em to i
					Aloha.Markup.transformDomObject(jQuery(this), 'i');
				} else if (this.nodeName === 'S' || this.nodeName == 'STRIKE') {
					// transform s and strike to del
					Aloha.Markup.transformDomObject(jQuery(this), 'del');
				} else if (this.nodeName === 'U') {
					// transform u?
					jQuery(this).contents().unwrap();
				}
			});
		},

		/**
		 * Transform links
		 * @param content
		 */
		transformLinks: function( content ) {
			// find all links and remove the links without href (will be destination anchors from word table of contents)
			// aloha is not supporting anchors at the moment -- maybe rewrite anchors in headings to "invisible"
			// in the test document there are anchors for whole paragraphs --> the whole P appear as link
			content.find('a').each(function() {
				if ( typeof jQuery(this).attr('href') === 'undefined' ) {
					jQuery(this).contents().unwrap();
				}
			});
		},

		/**
		 * Remove all comments
		 * @param content
		 */
		removeComments: function( content ) {
			var that = this;

			// ok, remove all comments
			content.contents().each(function() {
				if (this.nodeType === 8) {
					jQuery(this).remove();
				} else {
					// do recursion
					that.removeComments(jQuery(this));
				}
			});
		},

		/**
		 * Remove some unwanted tags from content pasted
		 * @param content
		 */
		unwrapTags: function( content ) {
			var that = this;

			// Note: we exclude all elements (they will be spans) here, that have the class aloha-wai-lang
			// TODO find a better solution for this (e.g. invent a more generic aloha class for all elements, that are
			// somehow maintained by aloha, and are therefore allowed)
			content.find('span,font,div').not('.aloha-wai-lang').each(function() {
				if (this.nodeName == 'DIV') {
					// safari and chrome cleanup for plain text paste with working linebreaks
					if (this.innerHTML === '<br>') {
						jQuery(this).contents().unwrap();
					} else {
						jQuery( Aloha.Markup.transformDomObject(jQuery(this), 'p').append('<br>') ).contents().unwrap();
					}
				} else {
					jQuery(this).contents().unwrap();
				}
			});
		},

		/**
		 * Remove styles
		 * @param content
		 */
		removeStyles: function( content ) {
			var that = this;

			// completely remove style tags
			content.children('style').filter(function() {
				return this.contentEditable !== 'false';
			}).remove();

			// remove style attributes and classes
			content.children().filter(function() {
				return this.contentEditable !== 'false';
			}).each(function() {
				jQuery(this).removeAttr('style').removeClass();
				that.removeStyles(jQuery(this));
			});
		},

		/**
		 * Remove all elements which are in different namespaces
		 * @param content
		 */
		removeNamespacedElements: function( content ) {
			// get all elements
			content.find('*').each(function() {
				// try to determine the namespace prefix ('prefix' works for W3C
				// compliant browsers, 'scopeName' for IE)

				var nsPrefix = this.prefix ? this.prefix
						: (this.scopeName ? this.scopeName : undefined);
				// when the prefix is set (and different from 'HTML'), we remove the
				// element
				if ((nsPrefix && nsPrefix !== 'HTML') || this.nodeName.indexOf(':') >= 0 ) {
					var $this = jQuery(this), $contents = $this.contents();
					if ($contents.length) {
						// the element has contents, so unwrap the contents
						$contents.unwrap();
					} else {
						// the element is empty, so remove it
						$this.remove();
					}
				}
			});
		}
	});

	return GenericContentHandler;
});
