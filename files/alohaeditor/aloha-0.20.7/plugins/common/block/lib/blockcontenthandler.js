/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define(
['aloha/jquery', 'aloha/contenthandlermanager', 'block/blockmanager'],
function(jQuery, ContentHandlerManager, BlockManager) {

	/**
	 * @name block.BlockContentHandler
	 * @class Special block content handler
	 *
	 * The blog content handler handles pasting of blocks in editables. Pasted
	 * block markup will be replaced by a freshly rendered block instance.
	 */
	var BlockContentHandler = ContentHandlerManager.createHandler(
	/** @lends block.BlockContentHandler */
	{
		/**
		 * Handle the pasting. Remove all unwanted stuff.
		 * @param {jQuery} content
		 */
		handleContent: function( content ) {
			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' );
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content);
			}

			content.find('.aloha-block').each(function() {
				var oldBlock = jQuery(this);

				// TODO: use block.serialize();

				var dataAttributes = {};
				jQuery.each(oldBlock.data(), function(k, v) {
					dataAttributes['data-' + k] = v;
				})

				var newBlock = jQuery('<' + this.tagName + '/>')
					.attr(jQuery.extend({
							about: oldBlock.attr('about'),
							'class': oldBlock.attr('class')
						}, dataAttributes))
					.removeClass('aloha-block-active');

				oldBlock.replaceWith(newBlock);
				BlockManager._blockify(newBlock);
			});
			
			return content.html();
		}
	});
	return BlockContentHandler;
});
