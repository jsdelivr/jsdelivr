/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
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

define( [
	'aloha/core',
	'util/class',
	'aloha/jquery',
	'aloha/console'
], function( Aloha, Class, jQuery, console ) {
	

	/**
	 * Repository Manager
	 * @namespace Aloha
	 * @class RepositoryManager
	 * @singleton
	 */
	Aloha.RepositoryManager = Class.extend( {

		repositories  : [],
		settings: {},

		/**
		 * Initialize all registered repositories
		 * Before we invoke each repositories init method, we merge the global
		 * repository settings into each repository's custom settings
		 *
		 * @todo: Write unit tests to check that global and custom settings are
		 * applied correctly
		 *
		 * @return void
		 * @hide
		 */
		init: function() {
			var repositories = this.repositories,
			    i = 0,
			    j = repositories.length,
			    repository;

			if ( Aloha.settings && Aloha.settings.repositories ) {
				this.settings = Aloha.settings.repositories;
			}
			
			// use the configured repository manger query timeout or 5 sec
			this.settings.timeout = this.settings.timeout || 5000;
			
			for ( ; i < j; ++i ) {
				repository = repositories[ i ];

				if ( !repository.settings ) {
					repository.settings = {};
				}

				if ( this.settings[ repository.repositoryId ] ) {
					jQuery.extend(
						repository.settings,
						this.settings[ repository.repositoryId ]
					);
				}

				repository.init();
			}
		},

		/**
		 * Register a Repository.
		 *
		 * @param {Aloha.Repository} repository Repository to register
		 */
		register: function( repository ) {
			if ( !this.getRepository( repository.repositoryId ) ) {
				this.repositories.push( repository );
			} else {
				console.warn( this, 'A repository with name { ' +
					repository.repositoryId +
					' } already registerd. Ignoring this.' );
			}
		},

		/**
		 * Returns the repository object identified by repositoryId.
		 *
		 * @param {String} repositoryId - the name of the repository
		 * @return {?Aloha.Repository} a repository or null if name not found
		 */
		getRepository: function( repositoryId ) {
			var repositories = this.repositories,
			    i = 0,
			    j = repositories.length;

			for ( ; i < j; ++i ) {
				if ( repositories[ i ].repositoryId === repositoryId ) {
					return repositories[ i ];
				}
			}

			return null;
		},

		/**
		 * Searches a all repositories for repositoryObjects matching query and
		 * repositoryObjectType.
		 *
		<pre><code>
			var params = {
					queryString: 'hello',
					objectTypeFilter: ['website'],
					filter: null,
					inFolderId: null,
					orderBy: null,
					maxItems: null,
					skipCount: null,
					renditionFilter: null,
					repositoryId: null
			};
			Aloha.RepositoryManager.query( params, function( items ) {
				// do something with the result items
				console.log(items);
			});
		</code></pre>
		 *
		 * @param {Object <String,Mixed>} params object with properties
		 * <div class="mdetail-params"><ul>
		 * <li><code> queryString</code> :  String <div class="sub-desc">The query string for full text search</div></li>
		 * <li><code> objectTypeFilter</code> : array  (optional) <div class="sub-desc">Object types that will be returned.</div></li>
		 * <li><code> filter</code> : array (optional) <div class="sub-desc">Attributes that will be returned.</div></li>
		 * <li><code> inFolderId</code> : boolean  (optional) <div class="sub-desc">This is indicates whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).</div></li>
		 * <li><code> inTreeId</code> : boolean  (optional) <div class="sub-desc">This indicates whether or not a candidate object is a descendant-object of the folder object identified by the given inTreeId (objectId).</div></li>
		 * <li><code> orderBy</code> : array  (optional) <div class="sub-desc">ex. [{lastModificationDate:’DESC’, name:’ASC’}]</div></li>
		 * <li><code> maxItems</code> : Integer  (optional) <div class="sub-desc">number items to return as result</div></li>
		 * <li><code> skipCount</code> : Integer  (optional) <div class="sub-desc">This is tricky in a merged multi repository scenario</div></li>
		 * <li><code> renditionFilter</code> : array  (optional) <div class="sub-desc">Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter</div></li>
		 * </ul></div>
		 * @param {Function} callback - defines a callback function( items ) which will be called when all repositories returned their results or after a time out of 5sec.
		 * "items" is an Array of objects construced with Document/Folder.
		 * @void
		 */
		query: function( params, callback ) {
			var that = this,
			    repo,
			    // The merged results, collected from repository responses
			    allitems = [],
			    // the merge metainfo, collected from repository responses
			    allmetainfo = { numItems: 0, hasMoreItems: false },
			    // The set of repositories towhich we want to delegate work
			    repositories = [],
			    // A counting semaphore (working in reverse, ie: 0 means free)
			    numOpenCallbacks = 0,
			    // When this timer times-out, whatever has been collected in
			    // allitems will be returned to the calling client, and
			    // numOpenCallbacks will be reset to 0
			    timer,
			    i, j,
				/**
				 * Invoked by each repository when it wants to present its
				 * results to the manager.
				 *
				 * Collects the results from each repository, and decrements
				 * the numOpenCallbacks semaphore to indicate that there is one
				 * less repository for which we are waiting a reponse.
				 *
				 * If a repository invokes this callback after all
				 * openCallbacks have been closed (ie: numOpenCallbacks == 0),
				 * then the repository was too late ("missed the ship"), and
				 * will be ignored.
				 *
				 * If numOpenCallbacks decrements to 0 during this call, it
				 * means that the the manager is ready to report the results
				 * back to the client through the queryCallback method.
				 *
				 * nb: "this" is reference to the calling repository.
				 *
				 * @param {Array} items - Results returned by the repository
				 * @param {Object<String,Number>} metainfo - optional Metainfo returned by the repository
				 */
				processResults = function( items, metainfo ) {
					if ( numOpenCallbacks === 0 ) {
						return;
					}

					var j = items ? items.length : 0;

					if ( j ) {
						// Add the repositoryId for each item if a negligent
						// repository did not do so.
						if ( !items[0].repositoryId ) {
							var repoId = this.repositoryId,
							    i;
							for ( i = 0; i < j; ++i ) {
								items[ i ].repositoryId = repoId;
							}
						}

						jQuery.merge( allitems, items );
					}

					if ( metainfo && allmetainfo ) {
						if ( jQuery.isNumeric( metainfo.numItems ) &&
								jQuery.isNumeric( allmetainfo.numItems ) ) {
							allmetainfo.numItems += metainfo.numItems;
						} else {
							allmetainfo.numItems = undefined;
						}

						if ( jQuery.isBoolean( metainfo.hasMoreItems ) &&
								jQuery.isBoolean( allmetainfo.hasMoreItems ) ) {
							allmetainfo.hasMoreItems = allmetainfo.hasMoreItems || metainfo.hasMoreItems;
						} else {
							allmetainfo.hasMoreItems = undefined;
						}
					} else {
						// at least one repository did not return metainfo, so
						// we have no aggregated metainfo at all
						allmetainfo = undefined;
					}

					// TODO how to return the metainfo here?
					if ( --numOpenCallbacks === 0 ) {
						that.queryCallback( callback, allitems, allmetainfo, timer );
					}
				};

			// Unless the calling client specifies otherwise, we will wait a
			// maximum of 5 seconds for all repositories to be queried and
			// respond. 5 seconds is deemed to be the reasonable time to wait
			// when querying the repository manager in the context of something
			// like autocomplete
			var timeout = parseInt( params.timeout, 10 ) || this.settings.timeout;
			timer = window.setTimeout( function() {
				numOpenCallbacks = 0;
				that.queryCallback( callback, allitems, allmetainfo, timer );
			}, timeout );

			// If repositoryId or a list of repository ids, is not specified in
			// the params object, then we will query all registered
			// repositories
			if ( params.repositoryId ) {
				repositories.push( this.getRepository( params.repositoryId ) );
			} else {
				repositories = this.repositories;
			}

			j = repositories.length;

			var repoQueue = [];

			// We need to know how many callbacks we will open before invoking
			// the query method on each, so that as soon as the first one does
			// callback, the correct number of open callbacks will be available
			// to check.

			for ( i = 0; i < j; ++i ) {
				repo = repositories[ i ];

				if ( typeof repo.query === 'function' ) {
					++numOpenCallbacks;
					repoQueue.push( repo );
				}
			}

			j = repoQueue.length;

			for ( i = 0; i < j; ++i ) {
				repo = repoQueue[ i ];
				repo.query(
					params,
					function() {
						processResults.apply( repo, arguments );
					}
				);
			}

			// If none of the repositories implemented the query method, then
			// don't wait for the timeout, simply report to the client
			if ( numOpenCallbacks === 0 ) {
				this.queryCallback( callback, allitems, allmetainfo, timer );
			}
		},

		/**
		 * Passes all the results we have collected to the client through the
		 * callback it specified
		 *
		 * @param {Function} callback - Callback specified by client when
		 *								invoking the query method
		 * @param {Array} items - Results, collected from all repositories
		 * @param {Object<String,Number>} metainfo - optional object containing metainfo
		 * @param {Timer} timer - We need to clear this timer
		 * @return void
		 * @hide
		 */
		queryCallback: function( callback, items, metainfo, timer ) {
			if ( timer ) {
				clearTimeout( timer );
				timer = undefined;
			}

			// TODO: Implement sorting based on repository specification
			// sort items by weight
			//items.sort( function( a, b ) {
			//	return ( b.weight || 0 ) - ( a.weight || 0 );
			//} );

			// prepare result data for the JSON Reader
			var result = {
				items   : items,
				results : items.length
			};

			if ( metainfo ) {
				result.numItems = metainfo.numItems;
				result.hasMoreItems = metainfo.hasMoreItems;
			}

			callback.call( this, result );
		},

		/**
		 * @todo: This method needs to be covered with some unit tests
		 *
		 * Returns children items. (see query for an example)
		 * @param {Object<String,Mixed>} params - object with properties
		 * <div class="mdetail-params"><ul>
		 * <li><code> objectTypeFilter</code> : array  (optional) <div class="sub-desc">Object types that will be returned.</div></li>
		 * <li><code> filter</code> : array  (optional) <div class="sub-desc">Attributes that will be returned.</div></li>
		 * <li><code> inFolderId</code> : boolean  (optional) <div class="sub-desc">This indicates whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).</div></li>
		 * <li><code> orderBy</code> : array  (optional) <div class="sub-desc">ex. [{lastModificationDate:’DESC’, name:’ASC’}]</div></li>
		 * <li><code> maxItems</code> : Integer  (optional) <div class="sub-desc">number items to return as result</div></li>
		 * <li><code> skipCount</code> : Integer  (optional) <div class="sub-desc">This is tricky in a merged multi repository scenario</div></li>
		 * <li><code> renditionFilter</code> : array  (optional) <div class="sub-desc">Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter</div></li>
		 * </ul></div>
		 * @param {Function} callback - defines a callback function( items ) which will be called when all repositories returned their results or after a time out of 5sec.
		 * "items" is an Array of objects construced with Document/Folder.
		 * @void
		 */
		getChildren: function( params, callback ) {
			var that = this,
			    repo,
			    // The marged results, collected from repository responses
			    allitems = [],
			    // The set of repositories towhich we want to delegate work
			    repositories = [],
			    // A counting semaphore (working in reverse, ie: 0 means free)
			    numOpenCallbacks = 0,
			    // When this timer times-out, whatever has been collected in
			    // allitems will be returned to the calling client, and
			    // numOpenCallbacks will be reset to 0
			    timer,
			    i, j,
			    processResults = function( items ) {
					if ( numOpenCallbacks === 0 ) {
						return;
					}

					if (allitems && items) {
						jQuery.merge( allitems, items );
					}

					if ( --numOpenCallbacks === 0 ) {
						that.getChildrenCallback( callback, allitems, timer );
					}
				};

			// If the inFolderId is the default id of 'aloha', then return all
			// registered repositories
			if ( params.inFolderId === 'aloha' ) {
				var repoFilter = params.repositoryFilter,
				    hasRepoFilter = ( repoFilter && repoFilter.length );

				j = this.repositories.length;

				for ( i = 0; i < j; ++i ) {
					repo = this.repositories[ i ];
					if ( !hasRepoFilter || jQuery.inArray( repo.repositoryId, repoFilter ) > -1 ) {
						repositories.push(
							new Aloha.RepositoryFolder( {
								id           : repo.repositoryId,
								name         : repo.repositoryName,
								repositoryId : repo.repositoryId,
								type         : 'repository',
								hasMoreItems : true
							} )
						);
					}
				}

				that.getChildrenCallback( callback, repositories, null );

				return;
			} else {
				repositories = this.repositories;
			}

			var timeout = parseInt( params.timeout, 10 ) || this.settings.timeout;
			timer = window.setTimeout( function() {
				numOpenCallbacks = 0;
				that.getChildrenCallback( callback, allitems, timer );
			}, timeout );

			j = repositories.length;

			for ( i = 0; i < j; ++i ) {
				repo = repositories[ i ];

				if ( typeof repo.getChildren === 'function' ) {
					++numOpenCallbacks;

					repo.getChildren(
						params,
						function() {
							processResults.apply( repo, arguments );
						}
					);
				}
			}

			if ( numOpenCallbacks === 0 ) {
				this.getChildrenCallback( callback, allitems, timer );
			}
		},

		/**
		 * Returns results for getChildren to calling client
		 *
		 * @return void
		 * @hide
		 */
		getChildrenCallback: function( callback, items, timer ) {
			if ( timer ) {
				clearTimeout( timer );
				timer = undefined;
			}

			callback.call( this, items );
		},

		/**
		 * @fixme: Not tested, but the code for this function does not seem to
		 *        compute repository.makeClean will be undefined
		 *
		 * @todo: Rewrite this function header comment so that is clearer
		 *
		 * Pass an object, which represents an marked repository to corresponding
		 * repository, so that it can make the content clean (prepare for saving)
		 *
		 * @param {jQuery} obj - representing an editable
		 * @return void
		 */
		makeClean: function( obj ) {
			// iterate through all registered repositories
			var that = this,
			    repository = {},
			    i = 0,
			    j = that.repositories.length;

			// find all repository tags
			obj.find( '[data-gentics-aloha-repository=' + this.prefix + ']' )
				.each( function() {
					for ( ; i < j; ++i ) {
						repository.makeClean( obj );
					}
					console.debug( that,
						'Passing contents of HTML Element with id { ' +
						this.attr( 'id' ) + ' } for cleaning to repository { ' +
						repository.repositoryId + ' }' );
					repository.makeClean( this );
				} );
		},

		/**
		 * Marks an object as repository of this type and with this item.id.
		 * Objects can be any DOM objects as A, SPAN, ABBR, etc. or
		 * special objects such as aloha-aloha_block elements.
		 * This method marks the target obj with two private attributes:
		 * (see http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data)
		 * * data-gentics-aloha-repository: stores the repositoryId
		 * * data-gentics-aloha-object-id: stores the object.id
		 *
		 * @param {DOMObject} obj - DOM object to mark
		 * @param {Aloha.Repository.Object} item - the item which is applied to obj,
		 *		if set to null, the data-GENTICS-... attributes are removed
		 * @return void
		 */
		markObject: function( obj, item ) {
			if ( !obj ) {
				return;
			}

			if ( item ) {
				var repository = this.getRepository( item.repositoryId );

				if ( repository ) {
					jQuery( obj ).attr( {
						'data-gentics-aloha-repository' : item.repositoryId,
						'data-gentics-aloha-object-id'  : item.id
					} );

					repository.markObject( obj, item );
				} else {
					console.error( this,
						'Trying to apply a repository { ' + item.name +
						' } to an object, but item has no repositoryId.' );
				}
			} else {
				jQuery( obj )
					.removeAttr( 'data-gentics-aloha-repository' )
					.removeAttr( 'data-gentics-aloha-object-id' );
			}
		},

		/**
		 * Get the object for which the given DOM object is marked from the
		 * repository.
		 *
		 * @param {DOMObject} obj - DOM object which probably is marked
		 * @param {Function} callback - callback function
		 */
		getObject: function( obj, callback ) {
			var that = this,
			    $obj = jQuery( obj ),
			    repository = this.getRepository( $obj.attr( 'data-gentics-aloha-repository' ) ),
			    itemId = $obj.attr( 'data-gentics-aloha-object-id' );

			if ( repository && itemId ) {
				// initialize the item cache (per repository) if not already done
				this.itemCache = this.itemCache || [];
				this.itemCache[ repository.repositoryId ] = this.itemCache[ repository.repositoryId ] || [];

				// when the item is cached, we just call the callback method
				if ( this.itemCache[ repository.repositoryId ][ itemId ] ) {
					callback.call( this, [ this.itemCache[ repository.repositoryId ][ itemId ] ] );
				} else {
					// otherwise we get the object from the repository
					repository.getObjectById( itemId, function( items ) {
						// make sure the item is in the cache (for subsequent calls)
						that.itemCache[ repository.repositoryId ][ itemId ] = items[0];
						callback.call( this, items );
					} );
				}
			}
		},

		/**
		 * @return {String} name of repository manager object
		 */
		toString: function() {
			return 'repositorymanager';
		}

	} );

	Aloha.RepositoryManager = new Aloha.RepositoryManager();

	// We return the constructor, not the instance of Aloha.RepositoryManager
	return Aloha.RepositoryManager;
} );
