/*global define:true */
/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
['aloha', 'jquery', 'aloha/contenthandlermanager'],
function (Aloha, jQuery, ContentHandlerManager) {
	

	/**
	 * Function to prepare the content for editing
	 */
	var prepareEditing = function () {
		var $this = jQuery(this);
		// 1. remove completely empty blocklevel elements
		$this.filter('h1:empty,h2:empty,h3:empty,h4:empty,h5:empty,h6:empty,p:empty,pre:empty,blockquote:empty').remove();

		// 2. if editing in IE: remove end-br's
		if (jQuery.browser.msie && jQuery.browser.version > 7) {
			$this.filter('br.aloha-end-br').remove();
		}

		// 3. if not editing in IE, append end-br's to every li (that does not happen to have one)
		if (!jQuery.browser.msie) {
			$this.filter('li').each(function () {
				var $this = jQuery(this);
				if (!(this.lastChild && this.lastChild.nodeName.toLowerCase() === 'br' &&
						jQuery(this.lastChild).hasClass('aloha-end-br'))) {
					$this.append('<br class="aloha-end-br"/>');
				}
			});
		}

		// proceed with all non-block child elements
		$this.children(':not(.aloha-block)').each(prepareEditing);
	};

	/**
	 * Make sure, that every blocklevel elements ends with an end-br
	 */
	var fixEndBr = function () {
		var $this = jQuery(this);
		if ($this.filter('p,h1,h2,h3,h4,h5,h6,pre,blockquote').length > 0) {
			if (!(this.lastChild && this.lastChild.nodeName.toLowerCase() === 'br' && jQuery(this.lastChild).hasClass('aloha-end-br'))) {
				$this.append('<br class="aloha-end-br"/>');
			}
		}
		// proceed for all non blocks
		$this.children(':not(.aloha-block)').each(fixEndBr);
	};

	/**
	 * Register the blockelement content handler
	 */
	var BlockElementContentHandler = ContentHandlerManager.createHandler({
		/**
		 * Handle all blockelements
		 * @param content
		 * @param options
		 */
		handleContent: function (content, options) {
			if (typeof content === 'string') {
				content = jQuery('<div>' + content + '</div>');
			} else if (content instanceof jQuery) {
				content = jQuery('<div>').append(content);
			}

			options = options || {};

			if (options.command === 'initEditable') {
				content.children(':not(.aloha-block)').each(prepareEditing);
			} else if (options.command === 'getContents') {
				content.children(':not(.aloha-block)').each(fixEndBr);

				// remove end-br's in li's (they are not necessary for rendering)
				content.find('li > br.aloha-end-br').remove();
			}

			return content.html();
		}
	});

	return BlockElementContentHandler;
});
