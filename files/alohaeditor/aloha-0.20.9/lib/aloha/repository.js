/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*
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

define(
[ 'aloha/core', 'util/class', 'aloha/repositorymanager' ],
function( Aloha, Class, RepositoryManager ) {
	
	
//	var
//		$ = jQuery,
//		GENTICS = window.GENTICS,
//		Aloha = window.Aloha,
//		Class = window.Class;

/**
 * Abstract Repository Class. Implement that class for your own repository.
 * @namespace Aloha.Repository
 * @class Repository
 * @constructor
 * @param {String} repositoryId unique repository identifier
 * @param {String} repositoryName (optional) is the displyed name for this Repository instance
 */
var AbstractRepository = Class.extend({
	_constructor: function(repositoryId, repositoryName) {
		/**
		 * @property repositoryId is the unique Id for this Repository instance
		 */
		this.repositoryId = repositoryId;

		/**
		 * contains the repository's settings object
		 * @property settings {Object} the repository's settings stored in an object
		 */
		this.settings = {};

		/**
		 * @property repositoryName is the name for this Repository instance
		 */
		this.repositoryName = (repositoryName) ? repositoryName : repositoryId;

		RepositoryManager.register(this);
	},

	/**
	 * Init method of the repository. Called from Aloha Core to initialize this repository
	 * @return void
	 * @hide
	 */
	init: function() {},

	/**
	 * Searches a repository for object items matching queryString if none found returns null.
	 * The returned object items must be an array of Aloha.Repository.Object
	 *
	<pre><code>
	// simple delicious implementation
	Aloha.Repositories.myRepository.query = function (params, callback) {

		// make local var of this to use in ajax function
		var that = this;

		// handle each word as tag
		var tags = p.queryString.split(' ');

		// if we have a query and no tag matching return
		if ( p.queryString && tags.length == 0 ) {
			callback.call( that, []);
			return;
		}

		// no handling of objectTypeFilter, filter, inFolderId, etc...
		// in real implementation you should handle all parameters

		jQuery.ajax({ type: "GET",
			dataType: "jsonp",
			url: 'http://feeds.delicious.com/v2/json/' + tags.join('+'),
			success: function(data) {
				var items = [];
				// convert data to Aloha objects
				for (var i = 0; i < data.length; i++) {
					if (typeof data[i] != 'function' ) {
						items.push(new Aloha.Repository.Document ({
							id: data[i].u,
							name: data[i].d,
							repositoryId: that.repositoryId,
							type: 'website',
							url: data[i].u
						}));
					}
				}
				callback.call( that, items);
			}
		});
	};
	</code></pre>
	 *
	 * @param {object} params object with properties
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
	 * @param {function} callback this method must be called with all result items</div></li>
	 */
	query: null,
	/*
	query: function( params, callback ) {
		if (typeof callback === 'function') {
			callback([]);
		}
	},
	*/

	/**
	 * Returns all children of a given motherId.
	 *
	 * @param {object} params object with properties
	 * <div class="mdetail-params"><ul>
	 * <li><code> objectTypeFilter</code> : array  (optional) <div class="sub-desc">Object types that will be returned.</div></li>
	 * <li><code> filter</code> : array  (optional) <div class="sub-desc">Attributes that will be returned.</div></li>
	 * <li><code> inFolderId</code> : boolean  (optional) <div class="sub-desc">This indicates whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).</div></li>
	 * <li><code> orderBy</code> : array  (optional) <div class="sub-desc">ex. [{lastModificationDate:’DESC’, name:’ASC’}]</div></li>
	 * <li><code> maxItems</code> : Integer  (optional) <div class="sub-desc">number items to return as result</div></li>
	 * <li><code> skipCount</code> : Integer  (optional) <div class="sub-desc">This is tricky in a merged multi repository scenario</div></li>
	 * <li><code> renditionFilter</code> : array  (optional) <div class="sub-desc">Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter</div></li>
	 * </ul></div>
	 * @param {function} callback this method must be called with all result items
	 */
	getChildren: null,
	/*
	getChildren: function( params, callback ) {
		if (typeof callback === 'function') {
			callback([]);
		}
	},
	*/

	/**
	 * Make the given jQuery object (representing an object marked as object of this type)
	 * clean. All attributes needed for handling should be removed.
	 *
	<pre><code>
	Aloha.Repositories.myRepository.makeClean = function (obj) {
		obj.removeAttr('data-myRepository-name');
	};
	</code></pre>
	 * @param {jQuery} obj jQuery object to make clean
	 * @return void
	 */
	makeClean: function (obj) {},

	/**
	 * This method will be called when a user chooses an item from a repository and wants
	 * to insert this item in his content.
	 * Mark or modify an object as needed by that repository for handling, processing or identification.
	 * Objects can be any DOM object as A, SPAN, ABBR, etc. or
	 * special objects such as aloha-aloha_block elements.
	 * (see http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data)
	 *
	<pre><code>
	Aloha.Repositories.myRepository.markObject = function (obj, resourceItem) {
		obj.attr('data-myRepository-name').text(resourceItem.name);
	};
	</code></pre>
	 *
	 *
	 * @param obj jQuery target object to which the repositoryItem will be applied
	 * @param repositoryItem The selected item. A class constructed from Document or Folder.
	 * @return void
	 */
	markObject: function (obj, repositoryItem) {},

	/**
	 * Set a template for rendering objects of this repository
	 * @param {String} template
	 * @return void
	 * @method
	 */
	setTemplate: function (template) {
		if (template) {
			this.template = template;
		} else {
			this.template = null;
		}
	},

	/**
	 * Checks whether the repository has a template
	 * @return {boolean} true when the repository has a template, false if not
	 * @method
	 */
	hasTemplate: function () {
		return this.template ? true : false;
	},

	/**
	 * Get the parsed template
	 * @return {Object} parsed template
	 * @method
	 */
	getTemplate: function () {
		return this.template;
	},

	/**
	 * Get the repositoryItem with given id
	 * @param itemId {String} id of the repository item to fetch
	 * @param callback {function} callback function
	 * @return {Aloha.Repository.Object} item with given id
	 */
	getObjectById: function ( itemId, callback ) { return true; }
});

	// expose the AbstractRepository
	Aloha.AbstractRepository = AbstractRepository;
	
	return AbstractRepository;
});
