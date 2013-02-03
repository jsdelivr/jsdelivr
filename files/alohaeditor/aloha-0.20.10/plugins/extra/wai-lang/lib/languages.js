/*!
 * Aloha Editor
 * Author & Copyright (c) 2011 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 *
 * Language Repository
 * -------------------
 * Provides a set of language codes and images
 */

define(
[ 'aloha', 'aloha/jquery' ],
function( Aloha, jQuery ) {
	

	return new ( Aloha.AbstractRepository.extend( {

		/**
		 * Set of language codes
		 */
		languageCodes: [],

		_constructor: function() {
			this._super( 'wai-languages' );
		},

		/**
		 * Initialize WAI Languages, load the language file and prepare the data.
		 */
		init: function() {
			// Load the language codes
			jQuery.ajax( {
				url      : Aloha.getPluginUrl( 'wai-lang' ) + '/lib/language-codes.json',
				dataType : 'json',
				success  : jQuery.proxy( this.storeLanguageCodes, this ),
				error    : this.errorHandler
			} );

		    this.repositoryName = 'WaiLanguages';
		},

		markObject: function( obj, item ) {
			//copied from wai-lang-plugin makeVisible to avoid a circular dependency
			// We do not need to add this class here since it already being
			// done in the wai-lang plugin
			// jQuery( obj ).addClass( 'aloha-wai-lang' );
		},

		/**
		 * This method will invoked if a error occurres while loading data via ajax
		 */
		errorHandler: function( text, error ) {
			//TODO log error here
		},

		/**
		 * Stores the retrieved language code data in this object
		 */
		storeLanguageCodes: function( data ) {
			var that = this,
			    flagsIconsPath = Aloha.getPluginUrl( 'flag-icons' ),
			    el;

			// Transform loaded json into a set of repository documents
			jQuery.each( data, function( key, value ) {
				el = value;
				el.id = key;
				el.repositoryId = that.repositoryId;
				el.type = 'language';
				el.url =  flagsIconsPath + '/img/flags/' + el.id + '.png';
				// el.renditions.url = "img/flags/" + e.id + ".png";
				// el.renditions.kind.thumbnail = true;
				that.languageCodes.push( new Aloha.RepositoryDocument( el ) );
			} );
		},

		/**
		 * Searches a repository for object items matching query if objectTypeFilter.
		 * If none found it returns null.
		 * Not supported: filter, orderBy, maxItems, skipcount, renditionFilter
		 */
		query: function( p, callback ) {
			var query = new RegExp( '^' + p.queryString, 'i' ),
			    i,
			    d = [],
			    matchesName,
			    matchesType,
			    currentElement;

			for ( i = 0; i < this.languageCodes.length; ++i ) {
				currentElement = this.languageCodes[ i ];
				matchesName = ( !p.queryString || currentElement.name.match( query )  || currentElement.nativeName.match( query ) );
				matchesType = ( !p.objectTypeFilter || ( !p.objectTypeFilter.length ) || jQuery.inArray( currentElement.type, p.objectTypeFilter ) > -1 );

				if ( matchesName && matchesType ) {
					d.push( currentElement );
				}
			}

			callback.call( this, d );
		}

	} ) )();
} );