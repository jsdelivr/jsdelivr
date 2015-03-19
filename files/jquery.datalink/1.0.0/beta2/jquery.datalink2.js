/*!
 * jQuery Data Link plugin 1.0.0pre
 *
 * BETA2 INVESTIGATION
 *
 * http://github.com/jquery/jquery-datalink
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.5-vsdoc.js" />
/// <reference path="../jquery-1.5.1.js" />

(function($, undefined) {

var linkSettings, decl,
	fnSetters = {
		value: "val",
		html: "html",
		text: "text"
	},

	linkAttr = "data-jq-linkto",
	bindAttr = "data-jq-linkfrom",
	pathAttr = "data-jq-path",

	unsupported = {
		"htmlhtml": 1,
		"arrayobject": 1,
		"objectarray": 1
	}

	getEventArgs = {
		pop: function( arr, args ) {
			if ( arr.length ) {
				return { change: "remove", oldIndex: arr.length - 1, oldItems: [ arr[arr.length - 1 ]]};
			}
		},
		push: function( arr, args ) {
			return { change: "add", newIndex: arr.length, newItems: [ args[ 0 ]]};
		},
		reverse: function( arr, args ) {
			if ( arr.length ) {
				return { change: "reset" };
			}
		},
		shift: function( arr, args ) {
			if ( arr.length ) {
				return { change: "remove", oldIndex: 0, oldItems: [ arr[ 0 ]]};
			}
		},
		sort: function( arr, args ) {
			if ( arr.length ) {
				return { change: "reset" };
			}
		},
		splice: function( arr, args ) {
			var index = args[ 0 ],
				numToRemove = args[ 1 ],
				elementsToRemove,
				elementsToAdd = args.slice( 2 );
			if ( numToRemove <= 0 ) {
				if ( elementsToAdd.length ) {
					return { change: "add", newIndex: index, newItems: elementsToAdd };
				}
			} else {
				elementsToRemove = arr.slice( index, index + numToRemove );
				if ( elementsToAdd.length ) {
					return { change: "move", oldIndex: index, oldItems: elementsToRemove, newIndex: index, newItems: elementsToAdd };
				} else {
					return { change: "remove", oldIndex: index, oldItems: elementsToRemove };
				}
			}
		},
		unshift: function( arr, args ) {
			return { change: "add", newIndex: 0, newItems: [ args[ 0 ]]};
		},
		move: function( arr, args ) {
			var fromIndex,
				numToMove = arguments[ 1 ];
			if ( numToMove > 0 ) {
				fromIndex = arguments[ 0 ];
				return { change: "move", oldIndex: fromIndex, oldItems: arr.splice( fromIndex, numToMove ), newIndex: arguments[ 2 ]};
			}
		}
	};

function changeArray( array, eventArgs ) {
	var $array = $([ array ]);

	switch ( eventArgs.change ) {
		case "add":
			array.push( eventArgs.newItems[0] ); // Todo - use concat or iterate, for inserting multiple items
		break;

		case "remove":
			array.splice( eventArgs.oldIndex, eventArgs.oldItems.length );
		break;

		case "reset":
		break;

		case "move":
			array.splice( eventArgs.newIndex, 0, array.splice( eventArgs.oldIndex, eventArgs.number));
		break;
	}
	if ( eventArgs ) {
		$array.triggerHandler( "arrayChange!", eventArgs );
	}
}

function renderTmpl( el, data, tmpl ) {
	$( el ).html(
		$( tmpl ).tmplRender( data, { annotate: true })
	);
//	var viewInfo = $.data( el, "_jqDataLink" );
}

function addBinding( map, from, to, callback, links, addViewItems, viewItem ) {

	// ============================
	// Helpers for "toObject" links

	function setFields( sourceObj, basePath, cb ) {
		var field, isObject, sourceVal;

		if ( typeof sourceObj === "object" ) {
			for ( field in sourceObj ) {
				sourceVal = sourceObj[ field ];
				if ( sourceObj.hasOwnProperty(field) && !$.isFunction( sourceVal ) && !( typeof sourceVal === "object" && sourceVal.toJSON )) {
					setFields( sourceVal, (basePath ? basePath + "." : basePath) + field, cb );
				}
			}
		} else {
			cb( sourceObj, basePath, thisMap.convert, sourceObj )
		}
	}

	function convertAndSetField( val, path, cnvt, sourceObj ) {
		//path = isFromHtml ? getLinkedPath( sourceObj, path )[0] : path;  // TODO do we need to pass in path?
		$.setField( toObj, path, cnvt
			? cnvt( val, path, sourceObj, toObj, thisMap )
			: val
		);
	}
	// ============================
	// Helper for --- TODO clean up between different cases....

	var	j, l, link, innerMap, isArray, path, item, items,
		thisMap = typeof map === "string" ? { to: thisMap } : map && $.extend( {}, map ),
	// Note: "string" corresponds to 'to'. Is this intuitive? It is useful for filtering object copy: $.link( person, otherPerson, ["lastName", "address.city"] );
		tmpl = thisMap.tmpl,
		fromPath = thisMap.from,
		fromObj = from[0],
		fromType = objectType( from ),
		toType = objectType( to ),
		isFromHtml = (fromType === "html"),
		toObj = to[0],
		eventType = isFromHtml ? "change" : fromType + "Change",


		// TODO Verify optimization for memory footprint in closure captured by handlers, and perf optimization for using function declaration rather than statement?
		handler = function( ev, eventArgs ) {
			var cancel, sourceValue, sourcePath,
				source = ev.target,

			fromHandler = {
				"html": function() {
					var setter, fromAttr, $source;

					fromAttr = thisMap.fromAttr;
					if ( !fromAttr ) {
						// Merge in the default attribute bindings for this source element
						fromAttr = linkSettings.merge[ source.nodeName.toLowerCase() ];
						fromAttr = fromAttr ? fromAttr.from.fromAttr : "text";
					}
					setter = fnSetters[ fromAttr ];
					$source = $( source );
					sourceValue = setter ? $source[setter]() : $source.attr( fromAttr );
				},
				"object": function() {
					// For objectChange events, eventArgs provides the path (name), and value of the changed field
					var mapFrom = thisMap.from || (toType !== "html") && thisMap.to;
					if ( eventArgs ) {
						sourceValue = eventArgs.value;
						sourcePath = eventArgs.path;
						if ( mapFrom && sourcePath !== mapFrom ) {
							sourceValue = undefined;
						}
					} else {
						// This is triggered by .trigger(), where source is an object. So no eventArgs passed.
						sourcePath = mapFrom || sourcePath;
	//	TODO - verify for undefined source fields. Do we set target to ""?	sourceValue = sourcePath ? getField( source, sourcePath ) : "";
						sourceValue = sourcePath && getField( source, sourcePath ) || linkAttr;  // linkAttr used as a marker of trigger events
					}
				},
				"array": function() {
					// For objectChange events, eventArgs is a data structure of info on the array change
					sourceValue = eventArgs ? eventArgs.change : linkAttr;  // linkAttr used as a marker of trigger events
				}
			},

			toHandler = {
				"html": function() {
					to.each( function( _, el ) {
						var setter, targetPath , matchLinkAttr,
							targetValue = sourceValue,
							$target = $( el );

						function setTarget( all, attr, toPath, convert, toPathWithConvert ) {
							attr = attr || thisMap.toAttr;
							toPath = toPath || toPathWithConvert;
							convert = window[ convert ] || thisMap.convert; // TODO support for named converters

							matchLinkAttr = (!sourcePath || sourcePath === toPath );
							if ( !eventArgs ) {
								// This is triggered by trigger(), and there is no thisMap.from specified,
								// so use the declarative specification on each target element to determine the sourcePath.
								// So need to get the field value and run converter
								targetValue = getField( source, toPath );
							}
							// If the eventArgs is specified, then this came from a real field change event (not ApplyLinks trigger)
							// so only modify target elements which have a corresponding target path.
							if ( targetValue !== undefined && matchLinkAttr) {
								if ( convert && $.isFunction( convert )) {
									targetValue = convert( targetValue, source, sourcePath, el, thisMap );
								}
								if ( !attr ) {
									// Merge in the default attribute bindings for this target element
									attr = linkSettings.merge[ el.nodeName.toLowerCase() ];
									attr = attr? attr.to.toAttr : "text";
								}

								if ( css = attr.indexOf( "css-" ) === 0 && attr.substr( 4 ) ) {
									if ( $target.css( css ) !== targetValue ) {
										$target.css( css, targetValue );
									}
								} else {
									setter = fnSetters[ attr ];
									if ( setter && $target[setter]() !== targetValue ) {
										$target[setter]( targetValue );
									} else if ( $target.attr( attr ) !== targetValue ){
										$target.attr( attr, targetValue );
									}
								}
							}
						}

						if ( fromType === "array" ) {
							if ( eventArgs ) {
								//htmlArrayOperation[ eventArgs.change ](); // TODO support incremental rendering for different operations
								renderTmpl( el, source, thisMap.tmpl );
								$.dataLink( source, el, thisMap.tmpl ).pushValues();
							}
						} else {
							// Find path using thisMap.from, or if not specified, use declarative specification
							// provided by decl.applyBindInfo, applied to target element
							targetPath = thisMap.from;
							if ( targetPath ) {
								setTarget( "", "", targetPath );
							} else {
								viewItem = viewItem || $.viewItem( el );
								if ( !viewItem || viewItem.data === source ) {
									decl.applyBindInfo( el, setTarget );
								}
							}
						}
					});
				},
				"object": function() {

					// Find toPath using thisMap.to, or if not specified, use declarative specification
					// provided by decl.applyLinkInfo, applied to source element
					var convert = thisMap.Convert,
						toPath = thisMap.to || !isFromHtml && sourcePath;

					if (toPath ) {
						convertAndSetField( sourceValue, toPath, thisMap.convert, source );
					} else if ( !isFromHtml ) {
						// This is triggered by trigger(), and there is no thisMap.from or thisMap.to specified.
						// This will set fields on existing objects or subobjects on the target, but will not create new subobjects, since
						// such objects are not linked so this would not trigger events on them. For deep copying without triggering events, use $.extend.
						setFields( source, "", convertAndSetField );
					} else { // from html. (Mapping from array to object not supported)
						decl.applyLinkInfo( source, function(all, path, declCnvt){
							// TODO support for named converters
							var cnvt = window[ declCnvt ] || convert;

							viewItem = $.viewItem( source );

							$.setField( viewItem.data, path, cnvt
								? cnvt( sourceValue, path, source, viewItem.data, thisMap )
								: sourceValue
							);
						});
					}
				},
				"array": function() {
					// For arrayChange events, eventArgs is a data structure of info on the array change
					if ( fromType === "array" ) {
						if ( !eventArgs ) {
							var args = $.map( fromObj, function( obj ){
								return $.extend( true, {}, obj );
							});
							args.unshift( toObj.length );
							args.unshift( 0 );
							eventArgs = getEventArgs.splice( toObj, args );
						}
						changeArray( toObj, eventArgs );
					}
				}
			};

			fromHandler[ fromType ]();

			if ( !callback || !(cancel = callback.call( thisMap, ev, eventArgs, to, thisMap ) === false )) {
				if ( toObj && sourceValue !== undefined ) {
					toHandler[ toType ]();
				}
			}
			if ( cancel ) {
				ev.stopImmediatePropagation();
			}
		},

		link = {
			handler: handler,
			from: from,
			to: to,
			map: thisMap,
			type: eventType
		};

	if ( addViewItems && thisMap.decl ) {
		items = setViewItems( toObj, from[ 0 ], thisMap, callback, links );
		viewItem = items[0];
		for ( j=1, l = items.length; j < l; j++ ) {
			item = items[ j ];
			addBinding( thisMap, $( item.data ), $( item.bind ), callback, links, false, item );
		}
		//DO object bindings on returned content- since now  bindings are added to items.
	}

	switch ( fromType + toType ) {
		case "htmlarray" :
			for ( j=0, l=toObj.length; j<l; j++ ) {
				addBinding( thisMap, from, $( toObj[j] ), callback, links );
			}
			return; // Don't add link since not adding binding
		break;

		case "objecthtml" :
			if ( viewItem ) {
				if ( viewItem.bind ) {
					to = $( viewItem.bind );
					viewItem.handler = handler;
				} else  {
					return;
				}
			}
		break;

		case "arrayhtml" :
//			item = $.data( toObj, "_jsViewItem" );
			if ( viewItem ) {
				if ( viewItem.handler ) {
					return;
				}
				viewItem.handler = handler;
			}
	}
// Store binding on html element, and override clean, to unbind from object or array. Also, if possible, remove from return linkset??
	from.bind( eventType, handler );

	links.push( link );

	// If from an object and the 'from' path points to a field of a descendant 'leaf object',
	// bind not only from leaf object, but also from intermediate objects
	if ( fromType === "object" && fromPath ) {
		fromPath = fromPath.split(".");
		if ( fromPath.length > 1 ) {
			fromObj = fromObj[ fromPath.shift() ];
			if ( fromObj ) {
				innerMap = $.extend( { inner: 1 }, thisMap ) // 1 is special value for 'inner' maps on intermediate objects, to prevent trigger() calling handler.
				innerMap.from = fromPath.join(".");
				addBinding( innerMap, $( fromObj ), to, callback, links );
			}
		}
	}
}

// ============================
// Helpers

function setViewItems( root, object, map, callback, links ) {
	// If bound add to nodes. If new path create new item, if prev path add to prev item. (LATER WILL ADD TEXT SIBLINGS). If bound add to prev item bindings.
	// Walk all elems. Find bound elements. Look up parent chain.

	var nodes, bind, prevPath, prevNode, item, elems, i, l, index = 0;
		items = [];

	function addItem( el, path ) {
		var parent;
		bind = [];
		nodes = [];
		if ( path ) {
			index = 0;
		} else if ( path !== undefined ) {
			path = "" + index++;
		}
		unbindLinkedElem( el );
		item = {
			path: path,
			nodes: nodes,
			bind: bind
		};

		if ( path === undefined ) {
			item.data = object;
		} else {
			item.parent = parent = $.viewItem( el );
			item.data = getPathObject( parent.data, path );
		}
		items.push( item );
		item = $.data( el, "_jsViewItem", item );
	}

	function processElem( el ) {
		var node = prevNode = el,
			path = el.getAttribute( pathAttr ),
			binding = el.getAttribute( bindAttr );
		if ( el.parentNode === prevNode ) {
			index = -1;
		}
 		if ( path !== null ) {
			addItem( el, path );
			nodes.push( node );
			while ( node = node.nextSibling ) {
				if ( node.nodeType === 1 ) {
					if ( node.getAttribute( pathAttr ) === null ) {
						$.data( node, "_jsViewItem", item );
					} else {
						break;
					}
				}
				nodes.push( node );
			}
			// TODO Later support specifying preceding text nodes
		}
		if ( binding ) {
			bind.push( el );
		}
	}

	addItem( root );

//	$.data( root, "_jqDataLink", { viewItems: items,  });

	if ( map.decl ) {
		// Walk all elems. Find bound elements. Look up parent chain.
		elems = root.getElementsByTagName( "*" );
		for ( i = 0, l = elems.length; i < l; i++ ) {
			processElem( elems[ i ]);
		}
	} else {
		bind.push( root );
	}
	return items;
}

function objectType( object ) {
	object = object[0];
	return object
		? object.nodeType
			? "html"
			: $.isArray( object )
				? "array"
				: "object"
		: "none";
}

function wrapObject( object ) {
	return object instanceof $ ? object : $.isArray( object ) ? $( [object] ) : $( object ); // Ensure that an array is wrapped as a single array object
}

function getField( object, path ) {
	if ( object && path ) {
		var leaf = getLeafObject( object, path );
		object = leaf[0];
		if ( object ) {
			return object[ leaf[1] ];
		}
	}
}

function getLinkedPath( el ) {
	var path, result = [];
	// TODO Do we need basePath? If so, result = basePath ? [ basePath ] : []'
	while ( !$.data( el, "_jqDataLink" )) {
		if ( path = el.getAttribute( "_jsViewItem" )) {
			result.unshift( path );
		}
		el = el.parentNode;
	}
	return [ result.join( "." ), el ];
}

function getLeafObject( object, path ) {
	if ( object && path ) {
		var parts = path.split(".");

		path = parts.pop();
		while ( object && parts.length ) {
			object = object[ parts.shift() ];
		}
		return [ object, path ];
	}
	return [];
}

function getPathObject( object, path ) {
	if ( object && path ) {
		var parts = path.split(".");
		while ( object && parts.length ) {
			object = object[ parts.shift() ];
		}
		return object;
	}
}

function unbindLinkedElem( el ) {
	var item = $.data( el, "_jsViewItem" );
	if ( item && item.handler ) {
		var isArray = $.isArray( item.data );
		if ( isArray ) {
			$( [item.data] ).unbind( "arrayChange", item.handler );
		} else {
			$( item.data ).unbind( "objectChange", item.handler );
		}
	}
}

// ============================

var oldcleandata = $.cleanData;

$.extend({
	cleanData: function( elems ) {
		for ( var j, i = 0, el; (el = elems[i]) != null; i++ ) {
			// remove any links with this element as the target
			unbindLinkedElem( el );
		}
		oldcleandata( elems );
	},

	dataLink: function( from, to, maps, callback ) {
		var args = $.makeArray( arguments ),
			l = args.length - 1;

		if ( !callback && $.isFunction( args[ l ])) {
			// Last argument is a callback.
			// So make it the fourth parameter (our named callback parameter)
			args[3] = args.pop();
			return $.dataLink.apply( $, args );
		}

		var i, map, links = [],
			linkset = {   // TODO Consider exposing as prototype, for extension
				links: links,
				pushValues: function() {
					var link, i = 0, l = links.length;
					while ( l-- ) {
						link = links[ l ];
						if ( !link.map.inner ) { // inner: 1 - inner map for intermediate object.
							link.from.each( function(){
								link.handler({
									type: link.type,
									target: this
								});
							});
						}
					}
					return linkset;
				},
				render: function() {
					var topLink = linkset.links[0];
					topLink.to.each( function() {
						renderTmpl( this, topLink.from[0], topLink.map.tmpl );
					});
					return linkset;
				},
				unlink: function() {
					var link, l = links.length;
					while ( l-- ) {
						link = links[ l ];
						link.from.unbind( link.type, link.handler );
					}
					return linkset;
				}
			},
			from = wrapObject( from ),
			to = wrapObject( to ),
			targetElems = to,
			fromType = objectType( from ),
			toType = objectType( to ),
			tmpl = (toType === "html" && typeof maps === "string") && maps;

		if ( tmpl ) {
			maps = undefined;
		}

		maps = maps
			|| !unsupported[ fromType + toType ]
			&& {
				decl: true,
				tmpl: tmpl
			};

		if ( fromType === "html" && maps.decl ) {
			maps.from = "input[" + linkAttr + "]";
		}

		maps = $.isArray( maps ) ? maps : [ maps ];

		i = maps.length;

		while ( i-- ) {
			map = maps[ i ];
			if ( toType === "html" ) {
				path = map.to;
				if ( path ) {
					targetElems = to.find( path ).add( to.filter( path ));
					map.to = undefined;
				}
				targetElems.each( function(){
					addBinding( map, from, $( this ), callback, links, true );
				});
			} else {
				addBinding( map, from, to, callback, links );
			}
		}
		return linkset;
	},

	dataPush: function( from, to, maps, callback ) {
		// TODO - provide implementation
	},
	dataPull: function( from, to, maps, callback ) {
		// TODO - provide implementation
	},
	setField: function( object, path, value ) { // TODO add support for passing in object (map) with newValues to copy from.
		if ( path ) {
			var $object = $( object ),
				args = [{ path: path, value: value }],
				leaf = getLeafObject( object, path );

			object = leaf[0], path = leaf[1];
			if ( object && (object[ path ] !== value )) {
			//	$object.triggerHandler( setFieldEvent + "!", args );
				object[ path ] = value;
				$object.triggerHandler( "objectChange!", args );
			}
		}
	},
	getField: function( object, path ) {
		return getField( object, path );
	},
	viewItem: function( el ) {
		var item, node = el;
		while ( (node = node.parentNode) && node.nodeType === 1 && !(item = $.data( node, "_jsViewItem" ))) {}
		return item;
	},

	// operations: pop push reverse shift sort splice unshift move
	changeArray: function( array, operation ) {
		var args = $.makeArray( arguments );
		args.splice( 0, 2 );
		return changeArray( array, getEventArgs[ operation ]( array, args ));
	},

	dataLinkSettings: {
		decl: {
			linkAttr: linkAttr,
			bindAttr: bindAttr,
			pathAttr: pathAttr,
			applyLinkInfo: function( el, setTarget ){
				var linkInfo = el.getAttribute( decl.linkAttr );
				if ( linkInfo !== null ) {
									//  toPath:          convert     end
					linkInfo.replace( /([\w\.]*)(?:\:\s*(\w+)\(\)\s*)?$/, setTarget );
				}
//lastName:convert1()
//	Alternative using name attribute:
//	return el.getAttribute( decl.linkAttr ) || (el.name && el.name.replace( /\[(\w+)\]/g, function( all, word ) {
//		return "." + word;
//	}));
			},
			applyBindInfo: function( el, setTarget ){
				var bindInfo = el.getAttribute( decl.bindAttr );
				if ( bindInfo !== null ) {
										// toAttr:               toPath    convert(  toPath  )        end
					bindInfo.replace( /(?:([\w\-]+)\:\s*)?(?:(?:([\w\.]+)|(\w+)\(\s*([\w\.]+)\s*\))(?:$|,))/g, setTarget );
				}
			}
		},
		merge: {
			input: {
				from: {
					fromAttr: "value"
				},
				to: {
					toAttr: "value"
				}
			}
		}
	}
});

linkSettings = $.dataLinkSettings;
decl = linkSettings.decl;

})( jQuery );
