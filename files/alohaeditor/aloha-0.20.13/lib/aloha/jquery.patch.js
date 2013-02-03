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

// use specified jQuery or load jQuery

define(
[ 'aloha/jquery' ],
function( jQuery ) {

	//PATCH FOR A JQUERY BUG IN 1.6.1 & 1.6.2
	//An additional sanity check was introduced to prevent IE from crashing when cache[id] does not exist
	jQuery.data = ( function( jQuery ) {
		return function( elem, name, data, pvt /* Internal Use Only */ ) {
			if ( !jQuery.acceptData( elem ) ) {
				return;
			}
			
			var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

				// We have to handle DOM nodes and JS objects differently because IE6-7
				// can't GC object references properly across the DOM-JS boundary
				isNode = elem.nodeType,

				// Only DOM nodes need the global jQuery cache; JS object data is
				// attached directly to the object so GC can occur automatically
				cache = isNode ? jQuery.cache : elem,

				// Only defining an ID for JS objects if its cache already exists allows
				// the code to shortcut on the same path as a DOM node with no cache
				id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

			// Avoid doing any more work than we need to when trying to get data on an
			// object that has no data at all
			//if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			if ( (!id || (pvt && id && (!cache[id] || !cache[ id ][ internalKey ]))) && getByName && data === undefined ) {
				return;
			}

			if ( !id ) {
				// Only DOM nodes need a new unique ID for each element since their data
				// ends up in the global cache
				if ( isNode ) {
					elem[ jQuery.expando ] = id = ++jQuery.uuid;
				} else {
					id = jQuery.expando;
				}
			}

			if ( !cache[ id ] ) {
				cache[ id ] = {};

				// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
				// metadata on plain JS objects when the object is serialized using
				// JSON.stringify
				if ( !isNode ) {
					cache[ id ].toJSON = jQuery.noop;
				}
			}

			// An object can be passed to jQuery.data instead of a key/value pair; this gets
			// shallow copied over onto the existing cache
			if ( typeof name === "object" || typeof name === "function" ) {
				if ( pvt ) {
					cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
				} else {
					cache[ id ] = jQuery.extend(cache[ id ], name);
				}
			}

			thisCache = cache[ id ];

			// Internal jQuery data is stored in a separate object inside the object's data
			// cache in order to avoid key collisions between internal data and user-defined
			// data
			if ( pvt ) {
				if ( !thisCache[ internalKey ] ) {
					thisCache[ internalKey ] = {};
				}

				thisCache = thisCache[ internalKey ];
			}

			if ( data !== undefined ) {
				thisCache[ jQuery.camelCase( name ) ] = data;
			}

			// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
			// not attempt to inspect the internal events object using jQuery.data, as this
			// internal data object is undocumented and subject to change.
			if ( name === "events" && !thisCache[name] ) {
				return thisCache[ internalKey ] && thisCache[ internalKey ].events;
			}

			return getByName ? thisCache[ jQuery.camelCase( name ) ] : thisCache;
		};
	})( jQuery );

});
