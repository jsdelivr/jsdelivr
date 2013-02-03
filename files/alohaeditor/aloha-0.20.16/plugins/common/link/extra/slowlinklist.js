/*!
 * Aloha Editor
 * Author & Copyright (c) 2011 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 *
 * Aloha Link List Repository
 * --------------------------
 * A simple demo repository of links, which is deliberatly slow, in order to
 * simulate lags when querying repositories.
 */

define(
[ 'aloha', 'aloha/jquery' ],
function ( Aloha, jQuery ) {
	'use strict'
	
	/**
	 * Internal data as array with following format:
	 *
	 * [
	 *   { name: 'Aloha Editor - The HTML5 Editor', url:'http://aloha-editor.com', type:'website' },
	 *   { name: 'Aloha Logo', url:'http://www.aloha-editor.com/images/aloha-editor-logo.png', type:'image'  }
	 * ];
	 *
	 * @private
	 */
	var urlset = [
		{ name: 'Aloha Test', url: '#alohatest', type: 'website' },
		{ name: 'Test One', url: '#test1', type: 'website' },
		{ name: 'Test Two', url: '#test2', type: 'website' },
		{ name: 'Test Three', url: '#test3', type: 'website' },
		{ name: 'Test Four', url: '#test4', type: 'image' }
	];
	
	new ( Aloha.AbstractRepository.extend( {
		
		_constructor: function () {
			this._super( 'slowlinklist' );
		},
		
		/**
		 * Internal folder structure
		 * @hide
		 */
		folder: [],
		
		/**
		 * initalize LinkList, parse all links, build folder structure and add
		 * additional properties to the items
		 */
		init: function () {
			// Add ECMA262-5 Array method filter if not supported natively.
			// But we will be very conservative and add to this single array
			// object so that we do not tamper with the native Array prototype
			// object
			if ( !( 'filter' in Array.prototype ) ) {
				urlset.filter = function ( filter, that /*opt*/ ) {
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
			
			var l = urlset.length;
			
			// generate folder structure
		    for ( var i = 0; i < l; ++i ) {
		    	var e = urlset[ i ];
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
		    	
				urlset[ i ] = new Aloha.RepositoryDocument( e );
		    }
			
		    this.repositoryName = 'Linklist';
		},
		
		/**
		 * @param {String} path
		 * @param {String} name
		 * @return {String}
		 */
		addFolder: function ( path, name ) {
			var type = path ? 'folder' : 'hostname',
			    p = path ? path + '/' + name : name;
			
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
		 * objectTypeFilter. If none is found it returns null.
		 *
		 * @param {Object} p
		 * @param {Function} callback
		 */
		query: function ( p, callback ) {
			// Not supported; filter, orderBy, maxItems, skipcount, renditionFilter
			var r = new RegExp( p.queryString, 'i' );
			
			var d = urlset.filter( function ( e, i, a ) {
				return (
					( !p.queryString || e.name.match( r ) || e.url.match( r ) ) &&
					( !p.objectTypeFilter || ( !p.objectTypeFilter.length ) || jQuery.inArray( e.type, p.objectTypeFilter ) > -1 ) &&
					true //( !p.inFolderId || p.inFolderId == e.parentId )
				);
			} );
			
			window.setTimeout( function () {
				callback.call( this, d );
			}, 2000 );
		},
		
		/**
		 * returns the folder structure as parsed at init
		 *
		 * @param {Object} p
		 * @param {Function} callback
		 */
		getChildren: function ( p, callback ) {
			var d = [],
			    e;
			
			for ( e in this.folder ) {
				var l = this.folder[ e ].parentId;
				if ( typeof this.folder[ e ] != 'function' && ( // extjs prevention
					this.folder[ e ].parentId == p.inFolderId || // all subfolders
					( !this.folder[ e ].parentId && p.inFolderId == this.repositoryId ) // the hostname
				) ) {
					d.push( this.folder[ e ] );
				}
			}
			
			window.setTimeout( function () {
				callback.call( this, d );
			}, 2000 );
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
			    l = urlset.length,
			    d = [];
			
			for ( ; i < l; i++ ) {
				if ( urlset[ i ].id == itemId ) {
					d.push( urlset[ i ] );
				}
			}
			
			callback.call( this, d );
		}
		
	} ) )();

} );