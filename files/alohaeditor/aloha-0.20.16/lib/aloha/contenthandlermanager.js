/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define(
['aloha/jquery', 'aloha/registry'],
function( jQuery, Registry ) {
	

	/**
	 * Create an contentHandler from the given definition. Acts as a factory method
	 * for contentHandler.
	 *
	 * @param {Object} definition
	 */
	return new ( Registry.extend({

		createHandler: function( definition ) {
			
			if ( typeof definition.handleContent != 'function' ) {
				throw 'ContentHandler has no function handleContent().';
			}

			var AbstractContentHandler = Class.extend({
				handleContent: function( content ) {
					// Implement in subclass!
				}
			}, definition);
			
			return new AbstractContentHandler();
		},
		
		handleContent: function ( content, options ) {
			var handler,
				handlers = this.getEntries();

			if ( typeof options.contenthandler === 'undefined') {
				options.contenthandler = [];
				for ( handler in handlers ) {
					if ( handlers.hasOwnProperty(handler) ) {
						options.contenthandler.push(handler);
					}
				}
			}

			for ( handler in handlers ) {
				if ( handlers.hasOwnProperty(handler) ) {
					if (jQuery.inArray( handler, options.contenthandler ) < 0 ) {
						continue;
					}
					
					if ( typeof handlers[handler].handleContent === 'function') {
						content = handlers[handler].handleContent( content, options );
					} else {
						console.error( 'A valid content handler needs the method handleContent.' );
					}
				}
			}

			return content;
		}
	}))();
});