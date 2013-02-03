/* linklist.js is part of Aloha Editor project http://aloha-editor.org
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
/* Aloha Link List Repository
 * --------------------------
 * A simple demo repository of links.
 */
define(
[ 'aloha', 'jquery' ],
function ( Aloha, jQuery ) {
	

	/**
	 * Internal data as array with following format:
	 *
	 * [
	 *		{ name: 'Aloha Editor - The HTML5 Editor', url: 'http://aloha-editor.org', type: 'website' },
	 *		{ name: 'Aloha Editor - Wiki', url: 'http://github.com/alohaeditor/Aloha-Editor/wiki', type: 'website' },
	 *		{ name: 'Aloha Editor - GitHub', url: 'http://github.com/alohaeditor/Aloha-Editor', type: 'website' },
	 *		{ name: 'Aloha Logo', url: 'http://www.aloha-editor.com/images/aloha-editor-logo.png', type: 'image'  }
	 * ];
	 *
	 * @private
	 */
	var urls = [
		{ name: 'Aloha Editor - The HTML5 Editor', url: 'http://aloha-editor.org', type: 'website' },
		{ name: 'Aloha Editor - Wiki', url: 'http://github.com/alohaeditor/Aloha-Editor/wiki', type: 'website' },
		{ name: 'Aloha Editor - GitHub', url: 'http://github.com/alohaeditor/Aloha-Editor', type: 'website' },
		{ name: 'Aloha Logo', url: 'http://www.aloha-editor.com/images/aloha-editor-logo.png', type: 'image' }
	];

	new ( Aloha.AbstractRepository.extend( {

		_constructor: function () {
			this._super( 'linklist' );
		},

		/**
		 * @private
		 * @type {array.<?>} Internal folder structure.
		 */
		folder: [],

		/**
		 * Initalize LinkList, parse all links, build folder structure and add
		 * additional properties to the items.
		 */
		init: function () {
			if ( Aloha.settings.repositories &&
			     Aloha.settings.repositories.linklist &&
			     Aloha.settings.repositories.linklist.data ) {
				urls = urls.concat(Aloha.settings.repositories.linklist.data);
			}

			// Add ECMA262-5 Array method filter if not supported natively.
			// But we will be very conservative and add to this single array
			// object so that we do not tamper with the native Array prototype
			// object.
			if ( !( 'filter' in Array.prototype ) ) {
				urls.filter = function ( filter, that /*opt*/ ) {
					var other = [],
					    v,
					    i = 0,
					    n = this.length;

					for ( ; i < n; i++ ) {
						if ( i in this && filter.call( that, v = this[ i ], i, this ) ) {
							other.push( v );
						}
					}

					return other;
				};
			}

			var l = urls.length;

			// generate folder structure
		    for ( var i = 0; i < l; ++i ) {
		    	var e = urls[ i ];
		    	e.repositoryId = this.repositoryId;
		    	e.id = e.id ? e.id : e.url;

		    	var u = e.uri = this.parseUri( e.url ),
					// add hostname as root folder
		    	    path = this.addFolder( '', u.host ),
				    pathparts = u.path.split( '/' );

		    	for ( var j = 0; j < pathparts.length; j++ ) {
		    		if ( pathparts[ j ] &&
		    			 // It's a file because it has an extension.
		    			 // Could improve this one :)
		    			 pathparts[ j ].lastIndexOf( '.' ) < 0 ) {
			    		path = this.addFolder( path, pathparts[ j ] );
		    		}
		    	}

		    	e.parentId = path;

				urls[ i ] = new Aloha.RepositoryDocument( e );
		    }

		    this.repositoryName = 'Linklist';
		},

		/**
		 * @param {String} path
		 * @param {String} name
		 * @return {String}
		 */
		addFolder: function ( path, name ) {
			var type = path ? 'folder' : 'hostname';
			var p = path ? path + '/' + name : name;

			if ( name && !this.folder[ p ] ) {
				this.folder[ p ] = new Aloha.RepositoryFolder( {
					id: p,
					name: name || p,
					parentId: path,
					type: 'host',
					repositoryId: this.repositoryId
				} );
			}

			return p;
		},

		/**
		 * Searches a repository for object items matching query if
		 * objectTypeFilter.  If none is found it returns null.
		 *
		 * @param {Object} p
		 * @param {Function} callback
		 */
		query: function ( p, callback ) {
			// Not supported; filter, orderBy, maxItems, skipcount, renditionFilter
			var r = new RegExp( p.queryString, 'i' );
			var d = urls.filter( function ( e, i, a ) {
				return (
					( !p.queryString || e.name.match( r ) || e.url.match( r ) ) &&
					( !p.objectTypeFilter || ( !p.objectTypeFilter.length ) || jQuery.inArray( e.type, p.objectTypeFilter ) > -1 ) &&
					true //( !p.inFolderId || p.inFolderId == e.parentId )
				);
			} );

			callback.call( this, d );
		},

		/**
		 * returns the folder structure as parsed at init
		 *
		 * @param {Object} p
		 * @param {Function} callback
		 */
		getChildren: function ( p, callback ) {
			var d = [], e;

			for ( e in this.folder ) {
				var l = this.folder[ e ].parentId;
				if ( typeof this.folder[ e ] != 'function' && ( // extjs prevention
					this.folder[ e ].parentId == p.inFolderId || // all subfolders
					( !this.folder[ e ].parentId && p.inFolderId == this.repositoryId ) // the hostname
				) ) {
					d.push( this.folder[ e ] );
				}
			}

			callback.call( this, d );
		},

		//parseUri 1.2.2
		//(c) Steven Levithan <stevenlevithan.com>
		//MIT License
		//http://blog.stevenlevithan.com/archives/parseuri
		parseUri: function(str) {
			var	o = {
					strictMode: false,
					key: [ "source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
					q: {
						name: "queryKey",
						parser: /(?:^|&)([^&=]*)=?([^&]*)/g
					},
					parser: {
						strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
						loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
					}
				},
				m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i = 14;

			while (i--) uri[o.key[i]] = m[i] || "";

			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2;
			});

			return uri;
		},

		/**
		 * Get the repositoryItem with given id
		 * Callback: {GENTICS.Aloha.Repository.Object} item with given id
		 * @param itemId {String} id of the repository item to fetch
		 * @param callback {function} callback function
		 */
		getObjectById: function ( itemId, callback ) {
			var i = 0,
			    l = urls.length,
			    d = [];

			for ( ; i < l; i++ ) {
				if ( urls[ i ].id == itemId ) {
					d.push( urls[ i ] );
				}
			}

			callback.call( this, d );
		}

	}))();

});
