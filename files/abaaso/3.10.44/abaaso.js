/**
 * abaaso
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/abaaso/master/LICENSE>
 * @link http://abaaso.com
 * @module abaaso
 * @version 3.10.44
 */
( function ( global ) {

var document  = global.document,
    location  = global.location,
    navigator = global.navigator,
    server    = typeof exports !== "undefined",
    $, abaaso, http, https, url;

if ( global.abaaso !== undefined ) {
	return;
}

if ( server ) {
	url     = require( "url" );
	http    = require( "http" );
	https   = require( "https" );
	mongodb = require( "mongodb" ).MongoClient;
	format  = require( "util" ).format;

	if ( typeof Storage === "undefined" ) {
		localStorage = require( "localStorage" );
	}

	if ( typeof XMLHttpRequest === "undefined" ) {
		XMLHttpRequest = null;
	}
}

/**
 * abaaso
 *
 * @namespace
 */
abaaso = ( function () {
"use strict";

var bootstrap, external, has, slice;

/**
 * Regex patterns used through abaaso
 *
 * `url` was authored by Diego Perini
 *
 * @type {Object}
 */
var regex = {
	after_space             : /\s+.*/,
	android                 : /android/i,
	allow                   : /^allow$/i,
	allow_cors              : /^access-control-allow-methods$/i,
	alphanum                : /^[a-zA-Z0-9]+$/,
	and                     : /^&/,
	asc                     : /\s+asc$/ig,
	auth                    : /\/\/(.*)\@/,
	blackberry              : /blackberry/i,
	"boolean"               : /^(true|false)?$/,
	boolean_number_string   : /boolean|number|string/,
	cdata                   : /\&|<|>|\"|\'|\t|\r|\n|\@|\$/,
	checked_disabled        : /checked|disabled/i,
	chrome                  : /chrome/i,
	complete_loaded         : /^(complete|loaded)$/i,
	csv_quote               : /^\s|\"|\n|,|\s$/,
	del                     : /^del/,
	decimal                 : /^\d+.(\d+)/,
	desc                    : /\s+desc$/i,
	domain                  : /^[\w.-_]+\.[A-Za-z]{2,}$/,
	double_slash            : /\/\//,
	down                    : /down/,
	down_up                 : /down|up/,
	email                   : /^[a-zA-Z0-9.!#$%&'*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,253}[a-zA-Z0-9])?)*$/,
	endslash                : /\/$/,
	element_update          : /innerHTML|innerText|textContent|type|src/,
	firefox                 : /firefox/i,
	get_headers             : /^(head|get|options)$/,
	get_remove_set          : /get|remove|set/,
	hash                    : /^\#/,
	hash_bang               : /^\#\!?/,
	header_replace          : /:.*/,
	header_value_replace    : /.*:\s+/,
	html                    : /^<.*>$/,
	http_body               : /200|202|203|206/,
	http_ports              : /80|443/,
	ie                      : /msie|ie/i,
	input_button            : /button|submit|reset/,
	integer                 : /(^-?\d\d*$)/,
	ip                      : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	is_xml                  : /^<\?xml.*\?>/,
	ios                     : /ipad|iphone/i,
	json_maybe              : /json|plain|javascript/,
	json_wrap               : /^[\[\{]/,
	jsonp_wrap              : /([a-zA-Z0-9\.]+\()(.*)(\))$/,
	klass                   : /^\./,
	linux                   : /linux|bsd|unix/i,
	no                      : /no/i,
	not_endpoint            : /.*\//,
	notEmpty                : /\w{1,}/,
	number                  : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)|number/,
	number_format_1         : /.*\./,
	number_format_2         : /\..*/,
	number_present          : /\d{1,}/,
	number_string           : /number|string/i,
	number_string_object    : /number|object|string/i,
	null_undefined          : /null|undefined/,
	observer_allowed        : /click|error|key|mousedown|mouseup|submit/i,
	observer_globals        : /body|document|window/i,
	object_type             : /\[object Object\]/,
	object_undefined        : /object|undefined/,
	opera                   : /opera/i,
	osx                     : /macintosh/i,
	patch                   : /^patch$/,
	phone                   : /^([0-9\(\)\/\+ \-\.]+)$/,
	playbook                : /playbook/i,
	plural                  : /s$/,
	primitive               : /^(boolean|function|number|string)$/,
	priv                    : /private/,
	put_post                : /^(post|put)$/i,
	radio_checkbox          : /^(radio|checkbox)$/i,
	reflect                 : /function\s+\w*\s*\((.*?)\)/,
	root                    : /^\/[^\/]/,
	route_nget              : /^(head|options)$/i,
	route_methods           : /^(all|delete|get|put|post|head|options)$/i,
	safari                  : /safari/i,
	scheme                  : /.*\/\//,
	select                  : /select/i,
	selector_is             : /^:/,
	selector_many           : /\:|\.|\+|\~|\[/,
	selector_complex        : /\s+|\>|\+|\~|\:|\[/,
	selector_split          : /\s+|\>|\+|\~/,
	set_del                 : /^(set|del|delete)$/,
	sort_needle             : /^.*:::/,
	sort_value              : /:::.*$/,
	space_hyphen            : /\s|-/,
	string_boolean          : /^(true|false)$/i,
	string_object           : /string|object/i,
	string_true             : /^true$/i,
	svg                     : /svg/,
	top_bottom              : /top|bottom/i,
	true_undefined          : /true|undefined/i,
	url                     : /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
	webos                   : /webos/i,
	windows                 : /windows/i,
	word                    : /^\w+$/,
	xml                     : /xml/i
};

/** @namespace array */
var array = {
	/**
	 * Adds 'arg' to 'obj' if it is not found
	 *
	 * @method add
	 * @param  {Array} obj Array to receive 'arg'
	 * @param  {Mixed} arg Argument to set in 'obj'
	 * @return {Array}     Array that was queried
	 */
	add : function ( obj, arg ) {
		if ( !array.contains( obj, arg ) ) {
			obj.push( arg );
		}

		return obj;
	},

	/**
	 * Preforms a binary search on a sorted Array
	 *
	 * @method binIndex
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    Index of `arg` within `obj`
	 */
	binIndex : function ( obj, arg ) {
		var min = 0,
		    max = obj.length - 1,
		    idx, val;

		while ( min <= max ) {
			idx = Math.floor( ( min + max ) / 2 );
			val = obj[idx];

			if ( val < arg ) {
				min = idx + 1;
			}
			else if ( val > arg ) {
				max = idx - 1;
			}
			else {
				return idx;
			}
		}

		return -1;
	},

	/**
	 * Returns an Object ( NodeList, etc. ) as an Array
	 *
	 * @method cast
	 * @param  {Object}  obj Object to cast
	 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
	 * @return {Array}       Object as an Array
	 */
	cast : function () {
		if ( server || ( !client.ie || client.version > 8 ) ) {
			return function ( obj, key ) {
				key = ( key === true );
				var o = [];

				if ( !isNaN( obj.length ) ) {
					o = slice.call( obj );
				}
				else if ( key ) {
					o = array.keys( obj );
				}
				else {
					utility.iterate( obj, function ( i ) {
						o.push( i );
					});
				}

				return o;
			};
		}
		else {
			return function ( obj, key ) {
				key   = ( key === true );
				var o = [];

				if ( !isNaN( obj.length ) ) {
					try {
						o = slice.call( obj );
					}
					catch ( e ) {
						utility.iterate( obj, function ( i, idx ) {
							if ( idx !== "length" ) {
								o.push( i );
							}
						});
					}
				}
				else if ( key ) {
					o = array.keys( obj );
				}
				else {
					utility.iterate( obj, function ( i ) {
						o.push( i );
					});
				}

				return o;
			};
		}
	},

	/**
	 * Transforms an Array to a 2D Array of chunks
	 *
	 * @method chunk
	 * @param  {Array}  obj  Array to parse
	 * @param  {Number} size Chunk size ( integer )
	 * @return {Array}       Chunked Array
	 */
	chunk : function ( obj, size ) {
		var result = [],
		    nth    = number.round( ( obj.length / size ), "up" ),
		    start  = 0,
		    i      = -1;

		while ( ++i < nth ) {
			start = i * size;
			result.push( array.limit( obj, start, size ) );
		}

		return result;
	},

	/**
	 * Clears an Array without destroying it
	 *
	 * @method clear
	 * @param  {Array} obj Array to clear
	 * @return {Array}     Cleared Array
	 */
	clear : function ( obj ) {
		return obj.length > 0 ? array.remove( obj, 0, obj.length ) : obj;
	},

	/**
	 * Clones an Array
	 *
	 * @method clone
	 * @param  {Array} obj Array to clone
	 * @return {Array}     Clone of Array
	 */
	clone : function ( obj ) {
		return obj.slice();
	},

	/**
	 * Determines if obj contains arg
	 *
	 * @method contains
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to look for
	 * @return {Boolean}   True if found, false if not
	 */
	contains : function ( obj, arg ) {
		return ( array.index( obj, arg ) > -1 );
	},

	/**
	 * Creates a new Array of the result of `fn` executed against every index of `obj`
	 *
	 * @method collect
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against indices
	 * @return {Array}        New Array
	 */
	collect : function ( obj, fn ) {
		var result = [];

		array.each( obj, function ( i ) {
			result.push( fn( i ) );
		});

		return result;
	},

	/**
	 * Compacts a Array by removing `null` or `undefined` indices
	 *
	 * @method compact
	 * @param  {Array} obj    Array to compact
	 * @param  {Boolean} diff Indicates to return resulting Array only if there's a difference
	 * @return {Array}        Compacted copy of `obj`, or null ( if `diff` is passed & no diff is found )
	 */
	compact : function ( obj, diff ) {
		var result = [];

		result = obj.filter( function ( i ) {
			return !regex.null_undefined.test( i );
		});

		return !diff ? result : ( result.length < obj.length ? result : null );
	},

	/**
	 * Counts `value` in `obj`
	 *
	 * @method count
	 * @param  {Array} obj   Array to search
	 * @param  {Mixed} value Value to compare
	 * @return {Array}       Array of counts
	 */
	count : function ( obj, value ) {
		return obj.filter( function ( i ) {
			return ( i === value );
		}).length;
	},

	/**
	 * Finds the difference between array1 and array2
	 *
	 * @method diff
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the differences
	 */
	diff : function ( array1, array2 ) {
		var result = [];

		array.each( array1, function ( i ) {
			if ( !array.contains( array2, i ) ) {
				array.add( result, i );
			}
		});

		array.each( array2, function ( i ) {
			if ( !array.contains( array1, i ) ) {
				array.add( result, i );
			}
		});

		return result;
	},

	/**
	 * Iterates obj and executes fn
	 *
	 * Parameters for fn are 'value', 'index'
	 *
	 * @method each
	 * @param  {Array}    obj   Array to iterate
	 * @param  {Function} fn    Function to execute on index values
	 * @param  {Boolean}  async [Optional] Asynchronous iteration
	 * @param  {Number}   size  [Optional] Batch size for async iteration, default is 10
	 * @return {Array}          Array
	 */
	each : function ( obj, fn, async, size ) {
		var nth = obj.length,
		    i, offset;

		if ( async !== true ) {
			for ( i = 0; i < nth; i++ ) {
				if ( fn.call( obj, obj[i], i ) === false ) {
					break;
				}
			}
		}
		else {
			size   = size || 10;
			offset = 0;

			if ( size > nth ) {
				size = nth;
			}

			utility.repeat( function () {
				var i = 0,
				    idx;

				for ( i = 0; i < size; i++ ) {
					idx = i + offset;

					if ( idx === nth || fn.call( obj, obj[idx], idx ) === false ) {
						return false;
					}
				}

				offset += size;

				if ( offset >= nth ) {
					return false;
				}
			}, undefined, undefined, false );
		}

		return obj;
	},

	/**
	 * Determines if an Array is empty
	 *
	 * @method empty
	 * @param  {Array} obj Array to inspect
	 * @return {Boolean}   `true` if there's no indices
	 */
	empty : function ( obj ) {
		return ( obj.length === 0 );
	},

	/**
	 * Determines if `a` is equal to `b`
	 *
	 * @method equal
	 * @param  {Array} a Array to compare
	 * @param  {Array} b Array to compare
	 * @return {Boolean} `true` if the Arrays match
	 */
	equal : function ( a, b ) {
		return ( json.encode( a ) === json.encode( b ) );
	},

	/**
	 * Fibonacci generator
	 *
	 * @method fib
	 * @param  {Number} arg [Optional] Amount of numbers to generate, default is 100
	 * @return {Array}      Array of numbers
	 */
	fib : function ( arg ) {
		var result = [1, 1],
		    first  = result[0],
		    second = result[1],
		    sum;

		// Subtracting 1 to account for `first` & `second`
		arg = ( arg || 100 ) - 1;
		
		if ( isNaN( arg ) || arg < 2 ) {
			throw new Error( label.error.invalidArguments );
		}

		while ( --arg ) {
			sum    = first + second;
			first  = second;
			second = sum;
			result.push( sum );
		}

		return result;
	},

	/**
	 * Fills `obj` with the evalution of `arg`, optionally from `start` to `offset`
	 *
	 * @method fill
	 * @param  {Array}  obj   Array to fill
	 * @param  {Mixed}  arg   String, Number of Function to fill with
	 * @param  {Number} start [Optional] Index to begin filling at
	 * @param  {Number} end   [Optional] Offset from start to stop filling at
	 * @return {Array}        Filled Array
	 */
	fill : function ( obj, arg, start, offset ) {
		var fn  = typeof arg === "function",
		    l   = obj.length,
		    i   = !isNaN( start ) ? start : 0,
		    nth = !isNaN( offset ) ? i + offset : l - 1;

		if ( nth > ( l - 1) ) {
			nth = l - 1;
		}

		while ( i <= nth ) {
			obj[i] = fn ? arg( obj[i] ) : arg;
			i++;
		}

		return obj;
	},

	/**
	 * Returns the first Array node
	 *
	 * @method first
	 * @param  {Array} obj The array
	 * @return {Mixed}     The first node of the array
	 */
	first : function ( obj ) {
		return obj[0];
	},

	/**
	 * Flattens a 2D Array
	 *
	 * @method flat
	 * @param  {Array} obj 2D Array to flatten
	 * @return {Array}     Flatten Array
	 */
	flat : function ( obj ) {
		var result = [];

		result = obj.reduce( function ( a, b ) {
			return a.concat( b );
		}, result );

		return result;
	},

	/**
	 * Creates a 2D Array from an Object
	 *
	 * @method fromObject
	 * @param  {Object} obj Object to convert
	 * @return {Array}      2D Array
	 */
	fromObject : function ( obj ) {
		return array.mingle( array.keys( obj ), array.cast( obj ) );
	},

	/**
	 * Facade to indexOf for shorter syntax
	 *
	 * @method index
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    The position of arg in instance
	 */
	index : function ( obj, arg ) {
		return obj.indexOf( arg );
	},

	/**
	 * Returns an Associative Array as an Indexed Array
	 *
	 * @method indexed
	 * @param  {Array} obj Array to index
	 * @return {Array}     Indexed Array
	 */
	indexed : function ( obj ) {
		var indexed = [];

		utility.iterate( obj, function ( v ) {
			indexed.push( v );
		});

		return indexed;
	},

	/**
	 * Finds the intersections between array1 and array2
	 *
	 * @method intersect
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the intersections
	 */
	intersect : function ( array1, array2 ) {
		var a = array1.length > array2.length ? array1 : array2,
		    b = ( a === array1 ? array2 : array1 );

		return a.filter( function ( key ) {
			return array.contains( b, key );
		});
	},

	/**
	 * Keeps every element of `obj` for which `fn` evaluates to true
	 *
	 * @method keepIf
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	keepIf : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		var result = [],
		    remove = [];

		result = obj.filter( fn );
		remove = array.diff( obj, result );

		array.each( remove, function ( i ) {
			array.remove( obj, array.index( obj, i ) );
		});

		return obj;
	},

	/**
	 * Sorts an Array based on key values, like an SQL ORDER BY clause
	 *
	 * @method sort
	 * @param  {Array}  obj   Array to sort
	 * @param  {String} query Sort query, e.g. "name, age desc, country"
	 * @param  {String} sub   [Optional] Key which holds data, e.g. "{data: {}}" = "data"
	 * @return {Array}        Sorted Array
	 */
	keySort : function ( obj, query, sub ) {
		query       = query.replace( /\s*asc/ig, "" ).replace( /\s*desc/ig, " desc" );
		var queries = string.explode( query ).map( function ( i ) { return i.split( " " ); }),
		    sorts   = [];

		if ( sub && sub !== "" ) {
			sub = "." + sub;
		}
		else {
			sub = "";
		}

		array.each( queries, function ( i ) {
			var desc = i[1] === "desc";

			if ( !desc ) {
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"] ) return -1;" );
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"] ) return 1;" );
			}
			else {
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"] ) return 1;" );
				sorts.push( "if ( a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"] ) return -1;" );
			}
		});

		sorts.push( "else return 0;" );

		return obj.sort( new Function( "a", "b", sorts.join( "\n" ) ) );
	},

	/**
	 * Returns the keys in an "Associative Array"
	 *
	 * @method keys
	 * @param  {Mixed} obj Array or Object to extract keys from
	 * @return {Array}     Array of the keys
	 */
	keys : function () {
		if ( typeof Object.keys === "function" ) {
			return function ( obj ) {
				return Object.keys( obj );
			};
		}
		else {
			return function ( obj ) {
				var keys = [];

				utility.iterate( obj, function ( v, k ) {
					keys.push( k );
				});

				return keys;
			};
		}
	}(),

	/**
	 * Returns the last index of the Array
	 *
	 * @method last
	 * @param  {Array}  obj Array
	 * @param  {Number} arg [Optional] Negative offset from last index to return
	 * @return {Mixed}      Last index( s ) of Array
	 */
	last : function ( obj, arg ) {
		var n = obj.length - 1;

		if ( arg >= ( n + 1 ) ) {
			return obj;
		}
		else if ( isNaN( arg ) || arg === 1 ) {
			return obj[n];
		}
		else {
			return array.limit( obj, ( n - ( --arg ) ), n );
		}
	},

	/**
	 * Returns a limited range of indices from the Array
	 *
	 * @method limit
	 * @param  {Array}  obj    Array to iterate
	 * @param  {Number} start  Starting index
	 * @param  {Number} offset Number of indices to return
	 * @return {Array}         Array of indices
	 */
	limit : function ( obj, start, offset ) {
		var result = [],
		    i      = start - 1,
		    nth    = start + offset,
		    max    = obj.length;

		if ( max > 0 ) {
			while ( ++i < nth && i < max ) {
				result.push( obj[i] );
			}
		}

		return result;
	},

	/**
	 * Finds the maximum value in an Array
	 *
	 * @method max
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	max : function ( obj ) {
		return array.last( obj.sort( array.sort ) );
	},

	/**
	 * Finds the mean of an Array ( of numbers )
	 *
	 * @method mean
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Mean of the Array ( float or integer )
	 */
	mean : function ( obj ) {
		return obj.length > 0 ? ( array.sum( obj ) / obj.length ) : undefined;
	},

	/**
	 * Finds the median value of an Array ( of numbers )
	 *
	 * @method median
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Median number of the Array ( float or integer )
	 */
	median : function ( obj ) {
		var nth    = obj.length,
		    mid    = number.round( nth / 2, "down" ),
		    sorted = obj.sort( array.sort );

		return number.odd( nth ) ? sorted[mid] : ( ( sorted[mid - 1] + sorted[mid] ) / 2 );
	},

	/**
	 * Merges `arg` into `obj`, excluding duplicate indices
	 *
	 * @method merge
	 * @param  {Array} obj Array to receive indices
	 * @param  {Array} arg Array to merge
	 * @return {Array}     obj
	 */
	merge : function ( obj, arg ) {
		array.each( arg, function ( i ) {
			array.add( obj, i );
		});

		return obj;
	},

	/**
	 * Finds the minimum value in an Array
	 *
	 * @method min
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	min : function ( obj ) {
		return obj.sort( array.sort )[0];
	},

	/**
	 * Mingles Arrays and returns a 2D Array
	 *
	 * @method mingle
	 * @param  {Array} obj1 Array to mingle
	 * @param  {Array} obj2 Array to mingle
	 * @return {Array}      2D Array
	 */
	mingle : function ( obj1, obj2 ) {
		var result;

		result = obj1.map( function ( i, idx ) {
			return [i, obj2[idx]];
		});

		return result;
	},

	/**
	 * Finds the mode value of an Array
	 *
	 * @method mode
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Mode value of the Array
	 */
	mode : function ( obj ) {
		var values = {},
		    count  = 0,
		    nth    = 0,
		    mode   = [],
		    result;

		// Counting values
		array.each( obj, function ( i ) {
			if ( !isNaN( values[i] ) ) {
				values[i]++;
			}
			else {
				values[i] = 1;
			}
		});

		// Finding the highest occurring count
		count = array.max( array.cast( values ) );

		// Finding values that match the count
		utility.iterate( values, function ( v, k ) {
			if ( v === count ) {
				mode.push( number.parse( k ) );
			}
		});

		// Determining the result
		nth = mode.length;

		if ( nth > 0 ) {
			result = nth === 1 ? mode[0] : mode;
		}

		return result;
	},

	/**
	 * Creates an Array of percentages from an Array of Numbers (ints/floats)
	 *
	 * @method percents
	 * @param  {Array}  obj       Array to iterate
	 * @param  {Number} precision [Optional] Rounding precision
	 * @param  {Number} total     [Optional] Value to compare against
	 * @return {Array}            Array of percents
	 */
	percents : function ( obj, precision, total ) {
		var result = [],
		    custom = false,
		    last, padding, sum;

		precision = precision || 0;
		
		if ( total === undefined ) {
			total = array.sum( obj );
		}
		else {
			custom = true;
		}

		array.each( obj, function ( i ) {
			result.push( number.parse( ( ( i / total ) * 100 ).toFixed( precision ) ) );
		} );

		// Dealing with the awesomeness of JavaScript "integers"
		if ( !custom ) {
			sum = array.sum( result );

			if ( sum < 100 ) {
				padding = number.parse( number.diff( sum, 100 ).toFixed( precision ) );
				last    = array.last( result ) + padding;
				result[result.length - 1] = last;
			}
			else if ( sum > 100 ) {
				padding = number.parse( number.diff( sum, 100 ).toFixed( precision ) );
				last    = number.parse( ( array.last( result ) - padding ).toFixed( precision ) );
				result[result.length - 1] = last;
			}
		}

		return result;
	},

	/**
	 * Finds the range of the Array ( of numbers ) values
	 *
	 * @method range
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Range of the array ( float or integer )
	 */
	range : function ( obj ) {
		return array.max( obj ) - array.min( obj );
	},

	/**
	 * Searches a 2D Array `obj` for the first match of `arg` as a second index
	 *
	 * @method rassoc
	 * @param  {Array} obj 2D Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Array or undefined
	 */
	rassoc : function ( obj, arg ) {
		var result;

		array.each( obj, function ( i, idx ) {
			if ( i[1] === arg ) {
				result = obj[idx];

				return false;
			}
		});

		return result;
	},

	/**
	 * Returns Array containing the items in `obj` for which `fn()` is not true
	 *
	 * @method reject
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against `obj` indices
	 * @return {Array}        Array of indices which fn() is not true
	 */
	reject : function ( obj, fn ) {
		return array.diff( obj, obj.filter( fn ) );
	},
	
	/**
	 * Replaces the contents of `obj` with `arg`
	 *
	 * @method replace
	 * @param  {Array} obj Array to modify
	 * @param  {Array} arg Array to become `obj`
	 * @return {Array}     New version of `obj`
	 */
	replace : function ( obj, arg ) {
		array.remove( obj, 0, obj.length );
		array.each( arg, function ( i ) {
			obj.push( i );
		});

		return obj;
	},

	/**
	 * Removes indices from an Array without recreating it
	 *
	 * @method remove
	 * @param  {Array}  obj   Array to remove from
	 * @param  {Mixed}  start Starting index, or value to find within obj
	 * @param  {Number} end   [Optional] Ending index
	 * @return {Array}        Modified Array
	 */
	remove : function ( obj, start, end ) {
		if ( isNaN( start ) ) {
			start = obj.index( start );

			if ( start === -1 ) {
				return obj;
			}
		}
		else {
			start = start || 0;
		}

		var length    = obj.length,
		    remaining = obj.slice( ( end || start ) + 1 || length );

		obj.length = start < 0 ? ( length + start ) : start;
		obj.push.apply( obj, remaining );

		return obj;
	},

	/**
	 * Deletes every element of `obj` for which `fn` evaluates to true
	 *
	 * @method removeIf
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	removeIf : function ( obj, fn ) {
		var remove;

		if ( typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		remove = obj.filter( fn );

		array.each( remove, function ( i ) {
			array.remove( obj, array.index ( obj, i ) );
		});

		return obj;
	},

	/**
	 * Deletes elements of `obj` until `fn` evaluates to false
	 *
	 * @method removeWhile
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	removeWhile : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		var remove = [];

		array.each( obj, function ( i ) {
			if ( fn( i ) !== false ) {
				remove.push( i );
			}
			else {
				return false;
			}
		});

		array.each( remove, function ( i ) {
			array.remove( obj, array.index( obj, i) );
		});

		return obj;
	},

	/**
	 * Returns the "rest" of `obj` from `arg`
	 *
	 * @method rest
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg [Optional] Start position of subset of `obj` ( positive number only )
	 * @return {Array}      Array of a subset of `obj`
	 */
	rest : function ( obj, arg ) {
		arg = arg || 1;

		if ( arg < 1 ) {
			arg = 1;
		}

		return array.limit( obj, arg, obj.length );
	},

	/**
	 * Finds the last index of `arg` in `obj`
	 *
	 * @method rindex
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Index or undefined
	 */
	rindex : function ( obj, arg ) {
		var result = -1;

		array.each( obj, function ( i, idx ) {
			if ( i === arg ) {
				result = idx;
			}
		});

		return result;
	},

	/**
	 * Returns new Array with `arg` moved to the first index
	 *
	 * @method rotate
	 * @param  {Array}  obj Array to rotate
	 * @param  {Number} arg Index to become the first index, if negative the rotation is in the opposite direction
	 * @return {Array}      Newly rotated Array
	 */
	rotate : function ( obj, arg ) {
		var nth = obj.length,
		    result;

		if ( arg === 0 ) {
			result = obj;
		}
		else {
			if ( arg < 0 ) {
				arg += nth;
			}
			else {
				arg--;
			}

			result = array.limit( obj, arg, nth );
			result = result.concat( array.limit( obj, 0, arg ) );
		}

		return result;
	},

	/**
	 * Generates a series Array
	 *
	 * @method series
	 * @param  {Number} start  Start value the series
	 * @param  {Number} end    [Optional] The end of the series
	 * @param  {Number} offset [Optional] Offset for indices, default is 1
	 * @return {Array}         Array of new series
	 */
	series : function ( start, end, offset ) {
		start      = start  || 0;
		end        = end    || start;
		offset     = offset || 1;
		var result = [],
		    n      = -1,
		    nth    = Math.max( 0, Math.ceil( ( end - start ) / offset ) );

		while ( ++n < nth ) {
			result[n]  = start;
			start     += offset;
		}

		return result;
	},

	/**
	 * Splits an Array by divisor
	 *
	 * @method split
	 * @param  {Array}  obj     Array to parse
	 * @param  {Number} divisor Integer to divide the Array by
	 * @return {Array}          Split Array
	 */
	split : function ( obj, divisor ) {
		var result  = [],
		    total   = obj.length,
		    nth     = Math.ceil( total / divisor ),
		    low     = Math.floor( total / divisor ),
		    lower   = Math.ceil( total / nth ),
		    lowered = false,
		    start   = 0,
		    i       = -1;

		// Finding the fold
		if ( number.diff( total, ( divisor * nth ) ) > nth ) {
			lower = total - ( low * divisor ) + low - 1;
		}

		while ( ++i < divisor ) {
			if ( !lowered && lower < divisor && i === lower ) {
				--nth;
				lowered = true;
			}

			if ( i > 0 ) {
				start = start + nth;
			}

			result.push( array.limit( obj, start, nth ) );
		}

		return result;
	},

	/**
	 * Sorts the Array by parsing values
	 *
	 * @method sort
	 * @param  {Mixed} a Argument to compare
	 * @param  {Mixed} b Argument to compare
	 * @return {Number}  Number indicating sort order
	 */
	sort : function ( a, b ) {
		var types = {a: typeof a, b: typeof b},
		    c, d, result;

		if ( types.a === "number" && types.b === "number" ) {
			result = a - b;
		}
		else {
			c = a.toString();
			d = b.toString();

			if ( c < d ) {
				result = -1;
			}
			else if ( c > d ) {
				result = 1;
			}
			else if ( types.a === types.b ) {
				result = 0;
			}
			else if ( types.a === "boolean" ) {
				result = -1;
			}
			else {
				result = 1;
			}
		}

		return result;
	},

	/**
	 * Sorts `obj` using `array.sort`
	 *
	 * @method sorted
	 * @param  {Array} obj Array to sort
	 * @return {Array}     Sorted Array
	 */
	sorted : function ( obj ) {
		return obj.sort( array.sort );
	},

	/**
	 * Finds the standard deviation of an Array ( of numbers )
	 *
	 * @method stddev
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Standard deviation of the Array ( float or integer )
	 */
	stddev : function ( obj ) {
		return Math.sqrt( array.variance( obj ) );
	},

	/**
	 * Gets the summation of an Array of numbers
	 *
	 * @method sum
	 * @param  {Array} obj Array to sum
	 * @return {Number}    Summation of Array
	 */
	sum : function ( obj ) {
		var result = 0;

		if ( obj.length > 0 ) {
			result = obj.reduce( function ( prev, cur ) {
				return prev + cur;
			});
		}

		return result;
	},

	/**
	 * Takes the first `arg` indices from `obj`
	 *
	 * @method take
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg Offset from 0 to return
	 * @return {Array}      Subset of `obj`
	 */
	take : function ( obj, arg ) {
		return array.limit( obj, 0, arg );
	},

	/**
	 * Gets the total keys in an Array
	 *
	 * @method total
	 * @param  {Array} obj Array to find the length of
	 * @return {Number}    Number of keys in Array
	 */
	total : function ( obj ) {
		return array.indexed( obj ).length;
	},

	/**
	 * Casts an Array to Object
	 *
	 * @method toObject
	 * @param  {Array} ar Array to transform
	 * @return {Object}   New object
	 */
	toObject : function ( ar ) {
		var obj = {},
		    i   = ar.length;

		while ( i-- ) {
			obj[i.toString()] = ar[i];
		}

		return obj;
	},

	/**
	 * Returns an Array of unique indices of `obj`
	 *
	 * @method unique
	 * @param  {Array} obj Array to parse
	 * @return {Array}     Array of unique indices
	 */
	unique : function ( obj ) {
		var result = [];

		array.each( obj, function ( i ) {
			array.add( result, i );
		});

		return result;
	},

	/**
	 * Finds the variance of an Array ( of numbers )
	 *
	 * @method variance
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Variance of the Array ( float or integer )
	 */
	variance : function ( obj ) {
		var nth = obj.length,
		    n   = 0,
		    mean;

		if ( nth > 0 ) {
			mean = array.mean( obj );

			array.each( obj, function ( i ) {
				n += math.sqr( i - mean );
			} );

			return n / nth;
		}
		else {
			return n;
		}
	},

	/**
	 * Converts any arguments to Arrays, then merges elements of `obj` with corresponding elements from each argument
	 *
	 * @method zip
	 * @param  {Array} obj  Array to transform
	 * @param  {Mixed} args Argument instance or Array to merge
	 * @return {Array}      Array
	 */
	zip : function ( obj, args ) {
		var result = [];

		// Preparing args
		if ( !(args instanceof Array) ) {
			args = typeof args === "object" ? array.cast( args ) : [args];
		}

		array.each( args, function ( i, idx ) {
			if ( !( i instanceof Array ) ) {
				this[idx] = [i];
			}
		});

		// Building result Array
		array.each( obj, function ( i, idx ) {
			result[idx] = [i];
			array.each( args, function ( x ) {
				result[idx].push( x[idx] || null );
			});
		});

		return result;
	}
};

/** @namespace cache */
var cache = {
	// Collection URIs
	items : {},

	/**
	 * Garbage collector for the cached items
	 *
	 * @method clean
	 * @private
	 * @return {Undefined} undefined
	 */
	clean : function () {
		return utility.iterate( cache.items, function ( v, k ) {
			if ( cache.expired( k ) ) {
				cache.expire( k, true );
			}
		});
	},

	/**
	 * Expires a URI from the local cache
	 *
	 * Events: expire    Fires when the URI expires
	 *
	 * @method expire
	 * @private
	 * @param  {String}  uri    URI of the local representation
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Undefined}      undefined
	 */
	expire : function ( uri, silent ) {
		silent = ( silent === true );
		if ( cache.items[uri] !== undefined ) {
			delete cache.items[uri];

			if ( !silent ) {
				observer.fire( uri, "beforeExpire, expire, afterExpire" );
			}

			return true;
		}
		else {
			return false;
		}
	},

	/**
	 * Determines if a URI has expired
	 *
	 * @method expired
	 * @private
	 * @param  {Object} uri Cached URI object
	 * @return {Boolean}    True if the URI has expired
	 */
	expired : function ( uri ) {
		var item = cache.items[uri];

		return item !== undefined && item.expires !== undefined && item.expires < new Date();
	},

	/**
	 * Returns the cached object {headers, response} of the URI or false
	 *
	 * @method get
	 * @private
	 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
	 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Mixed}          URI Object {headers, response} or False
	 */
	get : function ( uri, expire ) {
		uri    = utility.parse( uri ).href;
		expire = ( expire !== false );

		if ( cache.items[uri] === undefined ) {
			return false;
		}

		if ( expire && cache.expired( uri ) ) {
			cache.expire( uri );

			return false;
		}

		return utility.clone( cache.items[uri], true );
	},

	/**
	 * Sets, or updates an item in cache.items
	 *
	 * @method set
	 * @private
	 * @param  {String} uri      URI to set or update
	 * @param  {String} property Property of the cached URI to set
	 * @param  {Mixed} value     Value to set
	 * @return {Mixed}           URI Object {headers, response} or undefined
	 */
	set : function ( uri, property, value ) {
		uri = utility.parse( uri ).href;

		if ( cache.items[uri] === undefined ) {
			cache.items[uri] = {};
			cache.items[uri].permission = 0;
		}

		if ( property === "permission" ) {
			cache.items[uri].permission |= value;
		}
		else if ( property === "!permission" ) {
			cache.items[uri].permission &= ~value;
		}
		else {
			cache.items[uri][property] = value;
		}

		return cache.items[uri];
	}
};

/**
 * Channel factory
 *
 * @method channel
 * @return {Object} Channel instance
 */
var channel = function () {
	return new Channel();
};

/**
 * Channel
 *
 * @constructor
 * @return {Object} Channel instance
 */
function Channel () {
	this.queue = [];
}

// Setting constructor loop
Channel.prototype.constructor = Channel;

/**
 * Puts an item into the Channel
 *
 * @method put
 * @param  {Mixed} arg Item
 * @return {Object}     Deferred instance
 */
Channel.prototype.put = function ( arg ) {
	var defer = deferred();

	if ( this.queue.length === 0 ) {
		this.queue.push( arg );

		defer.resolve( ["continue", null] );
	}
	else {
		defer.resolve( ["pause", null] );
	}

	return defer;
};

/**
 * Takes an item from the Channel
 *
 * @method take
 * @return {Object} Deferred instance
 */
Channel.prototype.take = function () {
	var defer = deferred();

	if ( this.queue.length === 0 ) {
		defer.resolve( ["pause", null] );
	}
	else {
		defer.resolve( ["continue", this.queue.pop()] );
	}

	return defer;
};

/** @namespace client */
var client = {
	/**
	 * ActiveX support
	 *
	 * @type {Boolean}
	 */
	activex : function () {
		var result = false,
		    obj;

		if ( typeof ActiveXObject !== "undefined" ) {
			try {
				obj    = new ActiveXObject( "Microsoft.XMLHTTP" );
				result = true;
			}
			catch ( e ) {}
		}

		return result;
	}(),

	/**
	 * Android platform
	 *
	 * @type {Boolean}
	 */
	android : function () {
		return !server && regex.android.test( navigator.userAgent );
	}(),

	/**
	 * Blackberry platform
	 *
	 * @type {Boolean}
	 */
	blackberry : function () {
		return !server && regex.blackberry.test( navigator.userAgent );
	}(),

	/**
	 * Chrome browser
	 *
	 * @type {Boolean}
	 */
	chrome : function () {
		return !server && regex.chrome.test( navigator.userAgent );
	}(),

	/**
	 * Firefox browser
	 *
	 * @type {Boolean}
	 */
	firefox : function () {
		return !server && regex.firefox.test( navigator.userAgent );
	}(),

	/**
	 * Internet Explorer browser
	 *
	 * @type {Boolean}
	 */
	ie : function () {
		return !server && regex.ie.test( navigator.userAgent );
	}(),

	/**
	 * iOS platform
	 *
	 * @type {Boolean}
	 */
	ios : function () {
		return !server && regex.ios.test( navigator.userAgent );
	}(),

	/**
	 * Linux Platform
	 *
	 * @type {Boolean}
	 */
	linux : function () {
		return !server && regex.linux.test( navigator.userAgent );
	}(),

	/**
	 * Mobile platform
	 *
	 * @type {Boolean}
	 */
	mobile : function () {
		var size;

		if ( server ) {
			return false;
		}
		else {
			size = client.size();

			return ( /blackberry|iphone|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( size[0] < 720 || size[1] < 720 ) ) );
		}
	},

	/**
	 * Playbook platform
	 *
	 * @type {Boolean}
	 */
	playbook: function () {
		return !server && regex.playbook.test( navigator.userAgent );
	}(),

	/**
	 * Opera browser
	 *
	 * @type {Boolean}
	 */
	opera : function () {
		return !server && regex.opera.test( navigator.userAgent );
	}(),

	/**
	 * OSX platform
	 *
	 * @type {Boolean}
	 */
	osx : function () {
		return !server && regex.osx.test( navigator.userAgent );
	}(),

	/**
	 * Safari browser
	 *
	 * @type {Boolean}
	 */
	safari : function () {
		return !server && regex.safari.test( navigator.userAgent.replace(/chrome.*/i, "") );
	}(),

	/**
	 * Tablet platform
	 *
	 * Modern smartphone resolution makes this a hit/miss scenario
	 *
	 * @type {Boolean}
	 */
	tablet : function () {
		var size;

		if ( server ) {
			return false;
		}
		else {
			size = client.size();

			return ( /ipad|playbook|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( size[0] >= 720 || size[1] >= 720 ) ) );
		}
	},

	/**
	 * WebOS platform
	 *
	 * @type {Boolean}
	 */
	webos : function () {
		return !server && regex.webos.test( navigator.userAgent );
	}(),

	/**
	 * Windows platform
	 *
	 * @type {Boolean}
	 */
	windows : function () {
		return !server && regex.windows.test( navigator.userAgent );
	}(),

	/**
	 * Client version
	 *
	 * @type {Boolean}
	 */
	version : function () {
		var version = 0;

		if ( this.chrome ) {
			version = navigator.userAgent.replace( /(.*chrome\/|safari.*)/gi, "" );
		}
		else if ( this.firefox ) {
			version = navigator.userAgent.replace( /(.*firefox\/)/gi, "" );
		}
		else if ( this.ie ) {
			version = navigator.userAgent.replace(/(.*msie|;.*)/gi, "");
		}
		else if ( this.opera ) {
			version = navigator.userAgent.replace( /(.*version\/|\(.*)/gi, "" );
		}
		else if ( this.safari ) {
			version = navigator.userAgent.replace( /(.*version\/|safari.*)/gi, "" );
		}
		else {
			version = navigator.appVersion || "0";
		}

		version = number.parse( string.trim( version ) );

		if ( isNaN( version ) ) {
			version = 0;
		}

		if ( this.ie && document.documentMode && document.documentMode < version ) {
			version = document.documentMode;
		}

		return version;
	},

	/**
	 * Quick way to see if a URI allows a specific verb
	 *
	 * @method allows
	 * @param  {String} uri  URI to query
	 * @param  {String} verb HTTP verb
	 * @return {Boolean}     `true` if the verb is allowed, undefined if unknown
	 */
	allows : function ( uri, verb ) {
		if ( string.isEmpty( uri ) || string.isEmpty( verb ) ) {
			throw new Error( label.error.invalidArguments );
		}

		uri        = utility.parse( uri ).href;
		verb       = verb.toLowerCase();
		var result = false,
		    bit    = 0;

		if ( !cache.get( uri, false ) ) {
			result = undefined;
		}
		else {
			if ( regex.del.test( verb ) ) {
				bit = 1;
			}
			else if ( regex.get_headers.test( verb ) ) {
				bit = 4;
			}
			else if ( regex.put_post.test( verb ) ) {
				bit = 2;
			}
			else if ( regex.patch.test( verb ) ) {
				bit = 8;
			}

			result = Boolean( client.permissions( uri, verb ).bit & bit );
		}

		return result;
	},

	/**
	 * Gets bit value based on args
	 *
	 * @method bit
	 * @param  {Array} args Array of commands the URI accepts
	 * @return {Number} To be set as a bit
	 */
	bit : function ( args ) {
		var result = 0;

		array.each( args, function ( verb ) {
			verb = verb.toLowerCase();

			if ( regex.get_headers.test( verb ) ) {
				result |= 4;
			}
			else if ( regex.put_post.test( verb ) ) {
				result |= 2;
			}
			else if ( regex.patch.test( verb ) ) {
				result |= 8;
			}
			else if ( regex.del.test( verb ) ) {
				result |= 1;
			}
		});

		return result;
	},

	/**
	 * Determines if a URI is a CORS end point
	 *
	 * @method cors
	 * @param  {String} uri  URI to parse
	 * @return {Boolean}     True if CORS
	 */
	cors : function ( uri ) {
		return ( !server && uri.indexOf( "//" ) > -1 && uri.indexOf( "//" + location.host ) === -1 );
	},

	/**
	 * Caches the headers from the XHR response
	 *
	 * @method headers
	 * @param  {Object} xhr  XMLHttpRequest Object
	 * @param  {String} uri  URI to request
	 * @param  {String} type Type of request
	 * @return {Object}      Cached URI representation
	 */
	headers : function ( xhr, uri, type ) {
		var headers = string.trim( xhr.getAllResponseHeaders() ).split( "\n" ),
		    items   = {},
		    o       = {},
		    allow   = null,
		    expires = new Date(),
		    cors    = client.cors( uri );

		array.each( headers, function ( i ) {
			var header, value;

			value         = i.replace( regex.header_value_replace, "" );
			header        = i.replace( regex.header_replace, "" );
			header        = string.unhyphenate( header, true ).replace( /\s+/g, "-" );
			items[header] = value;

			if ( allow === null ) {
				if ( ( !cors && regex.allow.test( header) ) || ( cors && regex.allow_cors.test( header) ) ) {
					allow = value;
				}
			}
		});

		if ( regex.no.test( items["Cache-Control"] ) ) {
			// Do nothing
		}
		else if ( items["Cache-Control"] !== undefined && regex.number_present.test( items["Cache-Control"] ) ) {
			expires = expires.setSeconds( expires.getSeconds() + number.parse( regex.number_present.exec( items["Cache-Control"] )[0], 10 ) );
		}
		else if ( items.Expires !== undefined ) {
			expires = new Date( items.Expires );
		}
		else {
			expires = expires.setSeconds( expires.getSeconds() + $.expires );
		}

		o.expires    = expires;
		o.headers    = items;
		o.permission = client.bit( allow !== null ? string.explode( allow ) : [type] );

		if ( type === "get" ) {
			cache.set( uri, "expires",    o.expires );
			cache.set( uri, "headers",    o.headers );
			cache.set( uri, "permission", o.permission );
		}

		return o;
	},

	/**
	 * Parses an XHR response
	 *
	 * @method parse
	 * @param  {Object} xhr  XHR Object
	 * @param  {String} type [Optional] Content-Type header value
	 * @return {Mixed}       Array, Boolean, Document, Number, Object or String
	 */
	parse : function ( xhr, type ) {
		type = type || "";
		var result, obj;

		if ( ( regex.json_maybe.test( type ) || string.isEmpty( type ) ) && ( regex.json_wrap.test( xhr.responseText ) && Boolean( obj = json.decode( xhr.responseText, true ) ) ) ) {
			result = obj;
		}
		else if ( regex.xml.test( type ) ) {
			if ( type !== "text/xml" ) {
				xhr.overrideMimeType( "text/xml" );
			}

			result = xhr.responseXML;
		}
		else if ( type === "text/plain" && regex.is_xml.test( xhr.responseText) && xml.valid( xhr.responseText ) ) {
			result = xml.decode( xhr.responseText );
		}
		else {
			result = xhr.responseText;
		}

		return result;
	},

	/**
	 * Returns the permission of the cached URI
	 *
	 * @method permissions
	 * @param  {String} uri URI to query
	 * @return {Object}     Contains an Array of available commands, the permission bit and a map
	 */
	permissions : function ( uri ) {
		var cached = cache.get( uri, false ),
		    bit    = !cached ? 0 : cached.permission,
		    result = {allows: [], bit: bit, map: {partial: 8, read: 4, write: 2, "delete": 1, unknown: 0}};

		if ( bit & 1) {
			result.allows.push( "DELETE" );
		}

		if ( bit & 2) {
			result.allows.push( "POST" );
			result.allows.push( "PUT" );
		}

		if ( bit & 4) {
			result.allows.push( "GET" );
		}

		if ( bit & 8) {
			result.allows.push( "PATCH" );
		}

		return result;
	},

	/**
	 * Creates a JSONP request
	 *
	 * @method jsonp
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request ( CORS )
	 * @return {Object}           Deferred
	 */
	jsonp : function ( uri, success, failure, args ) {
		var defer    = deferred(),
		    callback = "callback", cbid, s;

		if ( external === undefined ) {
			if ( global.abaaso === undefined ) {
				utility.define( "abaaso.callback", {}, global );
			}

			external = "abaaso";
		}

		if ( args instanceof Object && args.callback !== undefined ) {
			callback = args.callback;
		}

		defer.then( function (arg ) {
			if ( typeof success === "function") {
				success( arg );
			}
		}, function ( e ) {
			if ( typeof failure === "function") {
				failure( e );
			}

			throw e;
		});

		do {
			cbid = utility.genId().slice( 0, 10 );
		}
		while ( global.abaaso.callback[cbid] !== undefined );

		uri = uri.replace( callback + "=?", callback + "=" + external + ".callback." + cbid );

		global.abaaso.callback[cbid] = function ( arg ) {
			clearTimeout( utility.timer[cbid] );
			delete utility.timer[cbid];
			delete global.abaaso.callback[cbid];
			defer.resolve( arg );
			element.destroy( s );
		};

		s = element.create( "script", {src: uri, type: "text/javascript"}, utility.$( "head" )[0] );
		
		utility.defer( function () {
			defer.reject( undefined );
		}, 30000, cbid );

		return defer;
	},

	/**
	 * Creates an XmlHttpRequest to a URI ( aliased to multiple methods )
	 *
	 * The returned Deferred will have an .xhr property decorated
	 *
	 * Events: before[type]          Fires before the XmlHttpRequest is made, type specific
	 *         failed[type]          Fires on error
	 *         progress[type]        Fires on progress
	 *         progressUpload[type]  Fires on upload progress
	 *         received[type]        Fires on XHR readystate 2
	 *         timeout[type]         Fires when XmlHttpRequest times out
	 *
	 * @method request
	 * @param  {String}   uri     URI to query
	 * @param  {String}   type    Type of request ( DELETE/GET/POST/PUT/HEAD )
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    [Optional] Data to send with the request
	 * @param  {Object}   headers [Optional] Custom request headers ( can be used to set withCredentials )
	 * @param  {Number}   timeout [Optional] Timeout in milliseconds, default is 30000
	 * @return {Object}           Deferred
	 */
	request : function ( uri, type, success, failure, args, headers, timeout ) {
		timeout = timeout || 30000;
		var cors, xhr, payload, cached, typed, contentType, doc, ab, blob, defer;

		if ( regex.put_post.test( type ) && args === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		uri         = utility.parse( uri ).href;
		type        = type.toLowerCase();
		headers     = headers instanceof Object ? headers : null;
		cors        = client.cors( uri );
		xhr         = ( client.ie && client.version < 10 && cors ) ? new XDomainRequest() : ( !client.ie || ( client.version > 8 || type !== "patch")  ? new XMLHttpRequest() : new ActiveXObject( "Microsoft.XMLHTTP" ) );
		payload     = ( regex.put_post.test( type ) || regex.patch.test( type ) ) && args !== undefined ? args : null;
		cached      = type === "get" ? cache.get( uri ) : false;
		typed       = type.capitalize();
		contentType = null;
		doc         = ( typeof Document !== "undefined" );
		ab          = ( typeof ArrayBuffer !== "undefined" );
		blob        = ( typeof Blob !== "undefined" );
		defer       = deferred();

		// Using a deferred to resolve request
		defer.then( function ( arg ) {
			if ( typeof success === "function" ) {
				success.call( uri, arg, xhr );
			}

			xhr = null;

			return arg;
		}, function ( e ) {
			if ( typeof failure === "function" ) {
				failure.call( uri, e, xhr );
			}

			xhr = null;

			throw e;
		});

		uri.fire( "before" + typed );

		if ( !cors && !regex.get_headers.test( type ) && client.allows( uri, type ) === false ) {
			xhr.status = 405;
			defer.reject( null );

			return uri.fire( "failed" + typed, null, xhr );
		}

		if ( type === "get" && Boolean( cached ) ) {
			// Decorating XHR for proxy behavior
			if ( server ) {
				xhr.readyState  = 4;
				xhr.status      = 200;
				xhr._resheaders = cached.headers;
			}

			defer.resolve( cached.response );
			uri.fire( "afterGet", cached.response, xhr );
		}
		else {
			xhr[typeof xhr.onreadystatechange !== "undefined" ? "onreadystatechange" : "onload"] = function () {
				client.response( xhr, uri, type, defer );
			};

			// Setting timeout
			try {
				if ( xhr.timeout !== undefined ) {
					xhr.timeout = timeout;
				}
			}
			catch ( e ) {}

			// Setting events
			if ( xhr.ontimeout  !== undefined ) {
				xhr.ontimeout = function ( e ) {
					uri.fire( "timeout"  + typed, e, xhr );
				};
			}

			if ( xhr.onprogress !== undefined ) {
				xhr.onprogress = function (e) {
					uri.fire( "progress" + typed, e, xhr );
				};
			}

			if ( xhr.upload !== undefined && xhr.upload.onprogress !== undefined ) {
				xhr.upload.onprogress = function ( e ) {
					uri.fire( "progressUpload" + typed, e, xhr );
				};
			}

			xhr.open( type.toUpperCase(), uri, true );

			// Setting Content-Type value
			if ( headers !== null && headers.hasOwnProperty( "Content-Type" ) ) {
				contentType = headers["Content-Type"];
			}

			if ( cors && contentType === null ) {
				contentType = "text/plain";
			}

			// Transforming payload
			if ( payload !== null ) {
				if ( payload.hasOwnProperty( "xml" ) ) {
					payload = payload.xml;
				}

				if ( doc && payload instanceof Document ) {
					payload = xml.decode( payload );
				}

				if ( typeof payload === "string" && regex.is_xml.test( payload ) ) {
					contentType = "application/xml";
				}

				if ( !( ab && payload instanceof ArrayBuffer ) && !( blob && payload instanceof Blob ) && payload instanceof Object ) {
					contentType = "application/json";
					payload = json.encode( payload );
				}

				if ( contentType === null && ((ab && payload instanceof ArrayBuffer) || (blob && payload instanceof Blob)) ) {
					contentType = "application/octet-stream";
				}

				if ( contentType === null ) {
					contentType = "application/x-www-form-urlencoded; charset=UTF-8";
				}
			}

			// Setting headers (using typeof for PATCH support in IE8)
			if ( typeof xhr.setRequestHeader !== "undefined" ) {
				if ( typeof cached === "object" && cached.headers.hasOwnProperty( "ETag" ) ) {
					xhr.setRequestHeader( "ETag", cached.headers.ETag );
				}

				if ( headers === null ) {
					headers = {};
				}

				if ( contentType !== null ) {
					headers["Content-Type"] = contentType;
				}

				if ( headers.hasOwnProperty( "callback" ) ) {
					delete headers.callback;
				}

				utility.iterate( headers, function ( v, k ) {
					if ( v !== null && k !== "withCredentials") {
						xhr.setRequestHeader( k, v );
					}
				});
			}

			// Cross Origin Resource Sharing ( CORS )
			if ( typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean" ) {
				xhr.withCredentials = headers.withCredentials;
			}

			// Firing event & sending request
			payload !== null ? xhr.send( payload ) : xhr.send();
		}

		defer.xhr = xhr;

		return defer;
	},

	/**
	 * Caches the URI headers & response if received, and fires the relevant events
	 *
	 * If abaaso.state.header is set, an application state change is possible
	 *
	 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
	 * resource
	 *
	 * Events: after[type]  Fires after the XmlHttpRequest response is received, type specific
	 *         reset        Fires if a 206 response is received
	 *         failure      Fires if an exception is thrown
	 *         headers      Fires after a possible state change, with the headers from the response
	 *
	 * @method response
	 * @param  {Object} xhr      XMLHttpRequest Object
	 * @param  {String} uri      URI to query
	 * @param  {String} type     Type of request
	 * @param  {Object} defer    Deferred to reconcile with the response
	 * @return {Undefined}       undefined
	 */
	response : function ( xhr, uri, type, defer ) {
		var typed    = string.capitalize( type.toLowerCase() ),
		    xhrState = null,
		    xdr      = client.ie && xhr.readyState === undefined,
		    shared   = true,
		    exception, o, r, t, redirect;

		// server-side exception handling
		exception = function ( e, xhr ) {
			defer.reject( e );
			utility.error( e, arguments, this, true );
			uri.fire( "failed" + typed, client.parse( xhr ), xhr );
		};

		if ( !xdr && xhr.readyState === 2) {
			uri.fire( "received" + typed, null, xhr );
		}
		else if ( !xdr && xhr.readyState === 4 ) {
			switch ( xhr.status ) {
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
				case 206:
					// Caching headers
					o = client.headers( xhr, uri, type );
					uri.fire( "headers", o.headers, xhr );

					if ( type === "head" ) {
						defer.resolve( o.headers );

						return uri.fire( "afterHead", o.headers );
					}
					else if ( type === "options" ) {
						defer.resolve( o.headers );

						return uri.fire( "afterOptions", o.headers );
					}
					else if ( type !== "delete" ) {
						if ( server && regex.priv.test( o.headers["Cache-Control"] ) ) {
							shared = false;
						}

						if ( regex.http_body.test( xhr.status ) ) {
							t = o.headers["Content-Type"] || "";
							r = client.parse( xhr, t );

							if ( r === undefined ) {
								throw new Error( label.error.serverError );
							}
						}

						if ( type === "get" && shared ) {
							cache.set( uri, "response", ( o.response = utility.clone( r, true ) ) );
						}
						else {
							cache.expire( uri, true );
						}
					}
					else if ( type === "delete" ) {
						cache.expire( uri, true );
					}

					// Application state change triggered by hypermedia ( HATEOAS )
					if ( state.getHeader() !== null && Boolean( xhrState = o.headers[state.getHeader()] ) && state.current !== xhrState ) {
						state.setCurrent( state );
					}

					switch ( xhr.status ) {
						case 200:
						case 202:
						case 203:
						case 206:
							defer.resolve( r );
							uri.fire( "after" + typed, r, xhr );
							break;
						case 201:
							if ( ( o.headers.Location === undefined || string.isEmpty ( o.headers.Location ) ) && !string.isUrl ( r ) ) {
								exception( new Error( label.error.invalidArguments ), xhr );
							}
							else {
								redirect = string.trim ( o.headers.Location || r );
								client.request( redirect, "GET", function ( arg ) {
									defer.resolve ( arg );
									uri.fire( "after" + typed, arg, xhr );
								}, function ( e ) {
									exception( e, xhr );
								} );
								break;
							}
							break;
						case 204:
							defer.resolve( null );
							uri.fire( "after" + typed, null, xhr );
							break;
						case 205:
							defer.resolve( null );
							uri.fire( "reset", null, xhr );
							break;
					}
					break;
				case 304:
					defer.resolve( r );
					uri.fire( "after" + typed, r, xhr );
					break;
				case 401:
					exception( !server ? new Error( label.error.serverUnauthorized ) : label.error.serverUnauthorized, xhr );
					break;
				case 403:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( !server ? new Error( label.error.serverForbidden ) : label.error.serverForbidden, xhr );
					break;
				case 405:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( !server ? new Error( label.error.serverInvalidMethod ) : label.error.serverInvalidMethod, xhr );
					break;
				default:
					exception( !server ? new Error( label.error.serverError ) : label.error.serverError, xhr );
					break;
			}

			try {
				xhr.onreadystatechange = null;
			}
			catch ( e ) {}
		}
		else if ( xdr ) {
			r = client.parse( xhr, "text/plain" );
			cache.set( uri, "permission", client.bit( ["get"] ) );
			cache.set( uri, "response", r );
			defer.resolve( r );
			uri.fire( "afterGet", r, xhr );
		}
	},

	/**
	 * Creates a script Element to load an external script
	 *
	 * @method script
	 * @param  {String} arg    URL to script
	 * @param  {Object} target [Optional] Element to receive the script
	 * @param  {String} pos    [Optional] Position to create the script at within the target
	 * @return {Object}        Script
	 */
	script : function ( arg, target, pos ) {
		return element.create( "script", {type: "application/javascript", src: arg}, target || utility.$( "head" )[0], pos );
	},

	/**
	 * Scrolls to a position in the view using a two point bezier curve
	 *
	 * @method scroll
	 * @param  {Array}  dest Coordinates
	 * @param  {Number} ms   [Optional] Milliseconds to scroll, default is 250, min is 100
	 * @return {Object}      Deferred
	 */
	scroll : function ( dest, ms ) {
		var defer = deferred(),
		    start = client.scrollPos(),
		    t     = 0;

		ms = ( !isNaN( ms ) ? ms : 250 ) / 100;

		utility.repeat( function () {
			var pos = math.bezier( start[0], start[1], dest[0], dest[1], ++t / 100 );

			window.scrollTo( pos[0], pos[1] );

			if ( t === 100 ) {
				defer.resolve( true );
				return false;
			}
		}, ms, "scrolling" );

		return defer;
	},

	/**
	 * Returns the current scroll position of the View
	 *
	 * @method scrollPos
	 * @return {Array} Describes the scroll position
	 */
	scrollPos : function () {
		return [
			window.scrollX || 0,
			window.scrollY || 0
		];
	},

	/**
	 * Returns the visible area of the View
	 *
	 * @method size
	 * @return {Array} Describes the View
	 */
	size : function () {
		return [
			document["documentElement" || "body"].clientWidth  || 0,
			document["documentElement" || "body"].clientHeight || 0
		];
	},

	/**
	 * Creates a link Element to load an external stylesheet
	 *
	 * @method stylesheet
	 * @param  {String} arg   URL to stylesheet
	 * @param  {String} media [Optional] Medias the stylesheet applies to
	 * @return {Objecct}      Stylesheet
	 */
	stylesheet : function ( arg, media ) {
		return element.create( "link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, utility.$( "head" )[0] );
	}
};

/** @namespace cookie */
var cookie = {
	/**
	 * Expires a cookie if it exists
	 *
	 * @method expire
	 * @param  {String}  name   Name of the cookie to expire
	 * @param  {String}  domain [Optional] Domain to set the cookie for
	 * @param  {Boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {String}  path   [Optional] Path the cookie is for
	 * @param  {String}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {String}        Name of the expired cookie
	 */
	expire : function ( name, domain, secure, path, jar ) {
		cookie.set( name, "", "-1s", domain, secure, path, jar );

		return name;
	},

	/**
	 * Gets a cookie
	 *
	 * @method get
	 * @param  {String} name Name of the cookie to get
	 * @param  {String} jar  [Optional] Cookie jar, defaults to document.cookie
	 * @return {Mixed}       Cookie or undefined
	 */
	get : function ( name, jar ) {
		return utility.coerce( cookie.list( jar )[name] );
	},

	/**
	 * Gets the cookies for the domain
	 *
	 * @method list
	 * @param  {String} jar [Optional] Cookie jar, defaults to document.cookie
	 * @return {Object}                Collection of cookies
	 */
	list : function ( jar ) {
		var result = {};

		if ( jar === undefined ) {
			jar = server ? "" : document.cookie;
		}

		if ( !string.isEmpty( jar ) ) {
			array.each( string.explode( jar, ";" ), function ( i ) {
				var item = string.explode( i, "=" );

				result[item[0]] = utility.coerce( item[1] );
			} );
		}

		return result;
	},

	/**
	 * Creates a cookie
	 *
	 * The offset specifies a positive or negative span of time as day, hour, minute or second
	 *
	 * @method set
	 * @param  {String}  name   Name of the cookie to create
	 * @param  {String}  value  Value to set
	 * @param  {String}  offset A positive or negative integer followed by "d", "h", "m" or "s"
	 * @param  {String}  domain [Optional] Domain to set the cookie for
	 * @param  {Boolean} secure [Optional] Make the cookie only accessible via SSL
	 * @param  {String}  path   [Optional] Path the cookie is for
	 * @param  {String}  jar    [Optional] Cookie jar, defaults to document.cookie
	 * @return {Undefined}      undefined
	 */
	set : function ( name, value, offset, domain, secure, path, jar ) {
		value      = ( value || "" ) + ";";
		offset     = offset || "";
		domain     = typeof domain === "string" ? ( " Domain=" + domain + ";" ) : "";
		secure     = ( secure === true ) ? " secure" : "";
		path       = typeof path === "string" ? ( " Path=" + path + ";" ) : "";
		var expire = "",
		    span   = null,
		    type   = null,
		    types  = ["d", "h", "m", "s"],
		    regex  = new RegExp(),
		    i      = types.length,
		    cookies;

		if ( !string.isEmpty( offset ) ) {
			while ( i-- ) {
				utility.compile( regex, types[i] );

				if ( regex.test( offset ) ) {
					type = types[i];
					span = number.parse( offset, 10 );
					break;
				}
			}

			if ( isNaN( span ) ) {
				throw new Error( label.error.invalidArguments );
			}

			expire = new Date();

			if ( type === "d" ) {
				expire.setDate( expire.getDate() + span );
			}
			else if ( type === "h" ) {
				expire.setHours( expire.getHours() + span );
			}
			else if ( type === "m" ) {
				expire.setMinutes( expire.getMinutes() + span );
			}
			else if ( type === "s" ) {
				expire.setSeconds( expire.getSeconds() + span );
			}
		}

		if ( expire instanceof Date) {
			expire = " Expires=" + expire.toUTCString() + ";";
		}

		if ( !server ) {
			document.cookie = ( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure );
		}
		else {
			cookies = jar.getHeader( "Set-Cookie" ) || [];
			cookies.push( ( string.trim( name.toString() ) + "=" + value + expire + domain + path + secure ).replace( /;$/, "" ) );
			jar.setHeader( "Set-Cookie", cookies );
		}
	}
};

/**
 * Decorates a DataStore on an Object
 *
 * @method decorator
 * @param  {Object} obj  Object
 * @param  {Mixed}  recs [Optional] Data to set with this.batch
 * @param  {Object} args [Optional] Arguments to set on the store
 * @return {Object}      Decorated Object
 */
var data = function ( obj, recs, args ) {
	utility.genId( obj );

	// Decorating observer if not present in prototype chain
	if ( typeof obj.fire !== "function" ) {
		observer.decorate( obj );
	}

	// Creating store
	obj.data = new DataStore( obj );

	if ( args instanceof Object ) {
		utility.merge( obj.data, args );
	}

	if ( recs !== null && typeof recs === "object" ) {
		obj.data.batch( "set", recs );
	}

	return obj;
};

/**
 * DataStore
 *
 * @constructor
 */
function DataStore ( obj ) {
	this.autosave    = false;
	this.callback    = null;
	this.collections = [];
	this.credentials = null;
	this.datalists   = [];
	this.depth       = 0;
	this.events      = false;
	this.expires     = null;
	this.headers     = {Accept: "application/json"};
	this.ignore      = [];
	this.key         = null;
	this.keys        = {};
	this.leafs       = [];
	this.loaded      = false;
	this.maxDepth    = 0;
	this.mongodb     = "";
	this.parentNode  = obj;
	this.pointer     = null;
	this.records     = [];
	this.retrieve    = false;
	this.source      = null;
	this.total       = 0;
	this.views       = {};
	this.uri         = null;
}

// Setting constructor loop
DataStore.prototype.constructor = DataStore;

/**
 * Batch sets or deletes data in the store
 *
 * Events: beforeDataBatch  Fires before the batch is queued
 *         afterDataBatch   Fires after the batch is queued
 *         failedDataBatch  Fires when an exception occurs
 *
 * @method batch
 * @param  {String}  type Type of action to perform ( set/del/delete )
 * @param  {Array}   data Array of keys or indices to delete, or Object containing multiple records to set
 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
 * @return {Object}          Deferred
 */
DataStore.prototype.batch = function ( type, data, sync ) {
	if ( !regex.set_del.test( type ) || ( sync && regex.del.test( type ) ) || typeof data !== "object" ) {
		throw new Error( label.error.invalidArguments );
	}

	sync          = ( sync === true );
	var self      = this,
	    events    = this.events,
	    defer     = deferred(),
	    deferreds = [];

	if ( events ) {
		observer.fire( self.parentNode, "beforeDataBatch", data );
	}

	if ( sync ) {
		this.clear( sync );
	}

	if ( data.length === 0 ) {
		this.loaded = true;

		if ( events ) {
			observer.fire( this.parentNode, "afterDataBatch", this.records );
		}

		defer.resolve( this.records );
	}
	else {
		if ( type === "del" ) {
			array.each( data, function ( i ) {
				deferreds.push( self.del( i, false, true ) );
			});
		}
		else {
			array.each( data, function ( i ) {
				deferreds.push( self.set( null, i, true ) );
			});
		}

		utility.when( deferreds ).then( function () {
			self.loaded = true;

			if ( events ) {
				observer.fire( self.parentNode, "afterDataBatch", self.records );
			}

			array.each( self.datalists, function ( i ) {
				i.refresh( true, true );
			});

			if ( type === "del" ) {
				self.reindex();
			}

			if ( self.autosave ) {
				self.save();
			}

			defer.resolve( self.records );
		}, function ( e ) {
			observer.fire( self.parentNode, "failedDataBatch", e );
			defer.reject( e );
		});
	}

	return defer;
};

/**
 * Builds a relative URI
 *
 * @method buildUri
 * @param  {String} key Record key
 * @return {String}     [description]
 */
DataStore.prototype.buildUri = function ( key ) {
	var parsed = utility.parse( this.uri );

	return parsed.protocol + "//" + parsed.host + parsed.pathname + ( regex.endslash.test( parsed.pathname ) ? "" : "/" ) + key;
};

/**
 * Clears the data object, unsets the uri property
 *
 * Events: beforeDataClear Fires before the data is cleared
 *         afterDataClear  Fires after the data is cleared
 *
 * @method clear
 * @param  {Boolean} sync [Optional] Boolean to limit clearing of properties
 * @return {Object}       Data store
 */
DataStore.prototype.clear = function ( sync ) {
	sync       = ( sync === true );
	var events = ( this.events === true );

	if ( !sync ) {
		if ( events ) {
			observer.fire( this.parentNode, "beforeDataClear" );
		}

		array.each( this.datalists, function ( i ) {
			i.teardown( true );
		});

		this.autosave    = false;
		this.callback    = null;
		this.collections = [];
		this.credentials = null;
		this.datalists   = [];
		this.depth       = 0;
		this.events      = true;
		this.expires     = null;
		this.headers     = {Accept: "application/json"};
		this.ignore      = [];
		this.key         = null;
		this.keys        = {};
		this.leafs       = [];
		this.loaded      = false;
		this.maxDepth    = 0;
		this.pointer     = null;
		this.records     = [];
		this.retrieve    = false;
		this.source      = null;
		this.total       = 0;
		this.views       = {};
		this.uri         = null;

		if ( events ) {
			observer.fire( this.parentNode, "afterDataClear" );
		}
	}
	else {
		this.collections = [];
		this.keys        = {};
		this.loaded      = false;
		this.records     = [];
		this.total       = 0;
		this.views       = {};

		array.each( this.datalists, function ( i ) {
			i.refresh( true, true );
		});
	}

	return this;
};

/**
 * Crawls a record's properties and creates DataStores when URIs are detected
 *
 * Events: beforeDataRetrieve Fires before crawling a record
 *         afterDataRetrieve  Fires after the store has retrieved all data from crawling
 *         failedDataRetrieve Fires if an exception occurs
 *
 * @method crawl
 * @param  {Mixed}  arg Record, key or index
 * @return {Object}     Deferred
 */
DataStore.prototype.crawl = function ( arg ) {
	var self      = this,
	    events    = ( this.events === true ),
	    record    = ( arg instanceof Object ) ? arg : this.get( arg ),
	    defer     = deferred(),
	    deferreds = [],
	    parsed    = utility.parse( this.uri || "" );

	if ( this.uri === null || record === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	if ( events ) {
		observer.fire( this.parentNode, "beforeDataRetrieve", record );
	}

	// Depth of recursion is controled by `maxDepth`
	utility.iterate( record.data, function ( v, k ) {
		var uri;

		if ( array.contains( self.ignore, k ) || array.contains( self.leafs, k ) || self.depth >= self.maxDepth || ( !( v instanceof Array ) && typeof v !== "string" ) || ( v.indexOf( "//" ) === -1 && v.charAt( 0 ) !== "/" ) ) {
			return;
		}

		array.add( self.collections, k );

		record.data[k] = data( {id: record.key + "-" + k}, null, {key: self.key, pointer: self.pointer, source: self.source, ignore: self.ignore.slice(), leafs: self.leafs.slice(), depth: self.depth + 1, maxDepth: self.maxDepth, headers: self.headers, retrieve: true} );

		if ( !array.contains( self.leafs, k ) && ( record.data[k].data.maxDepth === 0 || record.data[k].data.depth <= record.data[k].data.maxDepth ) ) {
			if ( v instanceof Array ) {
				deferreds.push( record.data[k].data.batch( "set", v ) );
			}
			else {
				if ( v.indexOf( "//" ) === -1 ) {
					// Relative path to store, i.e. a child
					if ( v.charAt( 0 ) !== "/" ) {
						uri = self.buildUri( v );
					}
					// Root path, relative to store, i.e. a domain
					else {
						uri = parsed.protocol + "//" + parsed.host + v;
					}
				}
				else {
					uri = v;
				}

				deferreds.push( record.data[k].data.setUri( uri ) );
			}
		}
	});

	if ( deferreds.length > 0 ) {
		utility.when( deferreds ).then( function () {
			if ( events ) {
				observer.fire( self.parentNode, "afterDataRetrieve", record );
			}

			defer.resolve( record );
		}, function ( e ) {
			if ( events ) {
				observer.fire( self.parentNode, "failedDataRetrieve", record );
			}

			defer.reject( e );
		});
	}
	else {
		if ( events ) {
			observer.fire( self.parentNode, "afterDataRetrieve", record );
		}

		defer.resolve( record );
	}

	return defer;
};

/**
 * Deletes a record based on key or index
 *
 * Events: beforeDataDelete  Fires before the record is deleted
 *         afterDataDelete   Fires after the record is deleted
 *         failedDataDelete  Fires if the store is RESTful and the action is denied
 *
 * @method del
 * @param  {Mixed}   record  Record, key or index
 * @param  {Boolean} reindex [Optional] `true` if DataStore should be reindexed
 * @param  {Boolean} batch   [Optional] `true` if part of a batch operation
 * @return {Object}          Deferred
 */
DataStore.prototype.del = function ( record, reindex, batch ) {
	record    = record.key ? record : this.get ( record );
	reindex   = ( reindex !== false );
	batch     = ( batch === true );
	var self  = this,
	    defer = deferred();

	if ( record === undefined ) {
		defer.reject( new Error( label.error.invalidArguments ) );
	}
	else {
		if ( this.events ) {
			observer.fire( self.parentNode, "beforeDataDelete", record );
		}

		if ( this.uri === null || this.callback !== null ) {
			this.delComplete( record, reindex, batch, defer );
		}
		else {
			client.request( this.buildUri( record.key ), "DELETE", function () {
				self.delComplete( record, reindex, batch, defer );
			}, function ( e ) {
				observer.fire( self.parentNode, "failedDataDelete", e );
				defer.reject( e );
			}, undefined, utility.merge( {withCredentials: this.credentials}, this.headers ) );
		}
	}

	return defer;
};

/**
 * Delete completion
 *
 * @method delComplete
 * @param  {Object}  record  DataStore record
 * @param  {Boolean} reindex `true` if DataStore should be reindexed
 * @param  {Boolean} batch   `true` if part of a batch operation
 * @param  {Object}  defer   Deferred instance
 * @return {Object}          DataStore instance
 */
DataStore.prototype.delComplete = function ( record, reindex, batch, defer ) {
	delete this.keys[record.key];
	this.records.remove( record.index );
	this.total--;
	this.views = {};

	array.each( this.collections, function ( i ) {
		record.data[i].teardown();
	});

	if ( !batch ) {
		if ( reindex ) {
			this.reindex();
		}

		if ( this.autosave ) {
			this.purge( record.key );
		}

		if ( this.events ) {
			observer.fire( this.parentNode, "afterDataDelete", record );
		}

		array.each( this.datalists, function ( i ) {
			i.refresh( true, true );
		});
	}

	defer.resolve( record.key );

	return this;
};

/**
 * Exports a subset or complete record set of DataStore
 *
 * @method dump
 * @public
 * @param  {Array} args   [Optional] Sub-data set of DataStore
 * @param  {Array} fields [Optional] Fields to export, defaults to all
 * @return {Array}        Records
 */
DataStore.prototype.dump = function ( args, fields ) {
	args       = args || this.records;
	var self   = this,
	    custom = ( fields instanceof Array && fields.length > 0 ),
	    fn;

	if ( custom ) {
		fn = function ( i ) {
			var record = {};

			array.each( fields, function ( f ) {
				record[f] = f === self.key ? i.key : ( !array.contains( self.collections, f ) ? utility.clone( i.data[f], true ) : i.data[f].data.uri );
			});

			return record;
		};
	}
	else {
		fn = function ( i ) {
			var record = {};

			record[self.key] = i.key;

			utility.iterate( i.data, function ( v, k ) {
				record[k] = !array.contains( self.collections, k ) ? utility.clone( v, true ) : v.data.uri;
			});

			return record;
		};
	}

	return args.map( fn );
};

/**
 * Finds needle in the haystack
 *
 * @method find
 * @param  {Mixed}  needle    String, Number, RegExp Pattern or Function
 * @param  {String} haystack  [Optional] Commma delimited string of the field( s ) to search
 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
 * @return {Array}            Array of results
 */
DataStore.prototype.find = function ( needle, haystack, modifiers ) {
	if ( needle === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	var result = [],
	    keys   = [],
	    regex  = new RegExp(),
	    fn     = typeof needle === "function";

	// Blocking unnecessary ops
	if ( this.total === 0 ) {
		return result;
	}

	// Preparing parameters
	if ( !fn ) {
		needle = typeof needle === "string" ? string.explode( needle ) : [needle];

		if ( modifiers === undefined || string.isEmpty( modifiers ) ) {
			modifiers = "gi";
		}
		else if ( modifiers === null ) {
			modifiers = "";
		}
	}

	haystack = typeof haystack === "string" ? string.explode( haystack ) : null;

	// No haystack, testing everything
	if ( haystack === null ) {
		array.each( this.records, function ( r ) {
			if ( !fn ) {
				utility.iterate( r.data, function ( v ) {
					if ( array.contains( keys, r.key ) ) {
						return false;
					}

					if ( v === null || typeof v.data === "object" ) {
						return;
					}

					array.each( needle, function ( n ) {
						utility.compile( regex, n, modifiers );

						if ( regex.test( v ) ) {
							keys.push( r.key );
							result.push( r );

							return false;
						}
					});
				});
			}
			else if ( needle( r ) === true ) {
				keys.push( r.key );
				result.push( r );
			}
		});
	}
	// Looking through the haystack
	else {
		array.each( this.records, function ( r ) {
			array.each( haystack, function ( h ) {
				if ( array.contains( keys, r.key ) ) {
					return false;
				}

				if ( r.data[h] === undefined || typeof r.data[h].data === "object" ) {
					return;
				}

				if ( !fn ) {
					array.each( needle, function ( n ) {
						utility.compile( regex, n, modifiers );

						if ( regex.test( r.data[h] ) ) {
							keys.push( r.key );
							result.push( r );

							return false;
						}
					});
				}
				else if ( needle( r.data[h] ) === true ) {
					keys.push( r.key );
					result.push( r );

					return false;
				}
			});
		});
	}

	return result;
};

/**
 * Retrieves a record based on key or index
 *
 * If the key is an integer, cast to a string before sending as an argument!
 *
 * @method get
 * @param  {Mixed}  record Key, index or Array of pagination start & end; or comma delimited String of keys or indices
 * @param  {Number} offset [Optional] Offset from `record` for pagination
 * @return {Mixed}         Individual record, or Array of records
 */
DataStore.prototype.get = function ( record, offset ) {
	var records = this.records,
	    type    = typeof record,
	    self    = this,
	    r;

	if ( type === "undefined" ) {
		r = records;
	}
	else if ( type === "string" ) {
		if ( record.indexOf( "," ) === -1 ) {
			r = records[self.keys[record]];
		}
		else {
			r = string.explode( record ).map( function ( i ) {
				if ( !isNaN( i ) ) {
					return records[parseInt( i, 10 )];
				}
				else {
					return records[self.keys[i]];
				}
			});
		}
	}
	else if ( type === "number" ) {
		if ( isNaN( offset ) ) {
			r = records[parseInt( record, 10 )];
		}
		else {
			r = array.limit( records, parseInt( record, 10 ), parseInt( offset, 10 ) );
		}
	}

	return r;
},

/**
 * Performs an (INNER/LEFT/RIGHT) JOIN on two DataStores
 *
 * @method join
 * @public
 * @param  {String} arg   DataStore to join
 * @param  {String} field Field in both DataStores
 * @param  {String} join  Type of JOIN to perform, defaults to `inner`
 * @return {Array}        Array of records
 */
DataStore.prototype.join = function ( arg, field, join ) {
	join        = join || "inner";
	var self    = this,
	    results = [],
	    key     = field === this.key,
	    keys    = array.merge( array.cast( this.records[0].data, true ), array.cast( arg.data.records[0].data, true ) ),
		fn;

	if ( join === "inner" ) {
		fn = function ( i ) {
			var where = {},
				match;

			where[field] = key ? i.key : i.data[field];
			match        = arg.data.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( i.data, true ), utility.clone( match[0].data, true ) ) );
			}
		};
	}
	else if ( join === "left" ) {
		fn = function ( i ) {
			var where  = {},
			    record = utility.clone( i.data, true ),
				match;

			where[field] = key ? i.key : i.data[field];
			match        = arg.data.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( record, true ), utility.clone( match[0].data, true ) ) );
			}
			else {
				array.each( keys, function ( i ) {
					if ( record[i] === undefined ) {
						record[i] = null;
					}
				});

				results.push( record );
			}
		};
	}
	else if ( join === "right" ) {
		fn = function ( i ) {
			var where  = {},
			    record = utility.clone( i.data, true ),
				match;

			where[field] = key ? i.key : i.data[field];
			match        = self.select( where );

			if ( match.length > 2 ) {
				throw new Error( label.error.databaseMoreThanOne );
			}
			else if ( match.length === 1 ) {
				results.push( utility.merge( utility.clone( record, true ), utility.clone( match[0].data, true ) ) );
			}
			else {
				array.each( keys, function ( i ) {
					if ( record[i] === undefined ) {
						record[i] = null;
					}
				});

				results.push( record );
			}
		};
	}

	array.each( join === "right" ? arg.data.records : this.records, fn);

	return results;
};

/**
 * Retrieves only 1 field/property
 *
 * @method only
 * @param  {String} arg Field/property to retrieve
 * @return {Array}      Array of values
 */
DataStore.prototype.only = function ( arg ) {
	if ( arg === this.key ) {
		return this.records.map( function ( i ) {
			return i.key;
		});
	}
	else {
		return this.records.map( function ( i ) {
			return i.data[arg];
		});
	}
};

/**
 * Purges DataStore or record from localStorage
 *
 * @method purge
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Record or store
 */
DataStore.prototype.purge = function ( arg ) {
	return this.storage( arg || this, "remove" );
};

/**
 * Reindexes the DataStore
 *
 * @method reindex
 * @return {Object} Data store
 */
DataStore.prototype.reindex = function () {
	var nth = this.total,
	    i   = -1;

	this.views = {};

	if ( nth > 0 ) {
		while ( ++i < nth ) {
			this.records[i].index = i;
			this.keys[this.records[i].key] = i;
		}
	}

	return this;
};

/**
 * Restores DataStore or record frome localStorage
 *
 * @method restore
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Record or store
 */
DataStore.prototype.restore = function ( arg ) {
	return this.storage( arg || this, "get" );
};

/**
 * Saves DataStore or record to localStorage, sessionStorage or MongoDB (node.js only)
 *
 * @method save
 * @param  {Mixed} arg  [Optional] String or Number for record
 * @return {Object}     Deferred
 */
DataStore.prototype.save = function ( arg ) {
	return this.storage( arg || this, "set" );
};

/**
 * Selects records based on an explcit description
 *
 * @method select
 * @param  {Object} where  Object describing the WHERE clause
 * @return {Array}         Array of records
 */
DataStore.prototype.select = function ( where ) {
	var clauses = array.fromObject( where ),
	    cond    = "return ( ";

	if ( clauses.length > 1 ) {
		array.each( clauses, function ( i, idx ) {
			var b1 = "( ";

			if ( idx > 0 ) {
				b1 = " && ( ";
			}

			if ( i[1] instanceof Function ) {
				cond += b1 + i[1].toString() + "( rec.data[\"" + i[0] + "\"] ) )";
			}
			else if ( !isNaN( i[1] ) ) {
				cond += b1 + "rec.data[\"" + i[0] + "\"] === " + i[1] + " )";
			}
			else {
				cond += b1 + "rec.data[\"" + i[0] + "\"] === \"" + i[1] + "\" )";
			}
		} );
	}
	else {
		if ( clauses[0][1] instanceof Function ) {
			cond += clauses[0][1].toString() + "( rec.data[\"" + clauses[0][0] + "\"] )";
		}
		else if ( !isNaN( clauses[0][1] ) ) {
			cond += "rec.data[\"" + clauses[0][0] + "\"] === " + clauses[0][1];
		}
		else {
			cond += "rec.data[\"" + clauses[0][0] + "\"] === \"" + clauses[0][1] + "\"";
		}
	}

	cond += " );";

	return this.records.filter( new Function( "rec", cond ) );
};

/**
 * Creates or updates an existing record
 *
 * Events: beforeDataSet  Fires before the record is set
 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
 *         failedDataSet  Fires if the store is RESTful and the action is denied
 *
 * @method set
 * @param  {Mixed}   key   [Optional] Integer or String to use as a Primary Key
 * @param  {Object}  data  Key:Value pairs to set as field values
 * @param  {Boolean} batch [Optional] True if called by data.batch
 * @return {Object}        Deferred
 */
DataStore.prototype.set = function ( key, data, batch ) {
	data       = utility.clone( data, true );
	batch      = ( batch === true );
	var self   = this,
	    events = this.events,
	    defer  = deferred(),
	    record = key !== null ? this.get( key ) || null : data[this.key] ? this.get( data[this.key] ) || null : null,
	    method = "POST",
	    parsed = utility.parse( self.uri || "" ),
	    uri;

	if ( typeof data === "string" ) {
		if ( data.indexOf( "//" ) === -1 ) {
			// Relative path to store, i.e. a child
			if ( data.charAt( 0 ) !== "/" ) {
				uri = this.buildUri( data );
			}
			// Root path, relative to store, i.e. a domain
			else if ( self.uri !== null && regex.root.test( data ) ) {
				uri = parsed.protocol + "//" + parsed.host + data;
			}
			else {
				uri = data;
			}
		}
		else {
			uri = data;
		}

		key = uri.replace( regex.not_endpoint, "" );

		if ( string.isEmpty( key ) ) {
			defer.reject( new Error( label.error.invalidArguments ) );
		}
		else {
			if ( !batch && events ) {
				observer.fire( self.parentNode, "beforeDataSet", {key: key, data: data} );
			}

			client.request( uri, "GET", function ( arg ) {
				self.setComplete( record, key, self.source ? arg[self.source] : arg, batch, defer );
			}, function ( e ) {
				observer.fire( self.parentNode, "failedDataSet", e );
				defer.reject( e );
			}, undefined, utility.merge( {withCredentials: self.credentials}, self.headers ) );
		}
	}
	else {
		if ( record === null && ( key === null || key === undefined ) ) {
			if ( this.key === null ) {
				key = utility.genId();
			}
			else if ( data[this.key] ) {
				key = data[this.key];
				delete data[this.key];
			}
			else {
				key = utility.genId();
			}
		}
		else {
			delete data[this.key];
		}

		if ( !batch && events ) {
			observer.fire( self.parentNode, "beforeDataSet", {key: key, data: data} );
		}

		if ( batch || this.uri === null ) {
			this.setComplete( record, key, data, batch, defer );
		}
		else {
			if ( key !== null ) {
				method = "PUT";
				uri    = this.buildUri( key );

				if ( client.allows( uri, "patch" ) && ( !client.ie || ( client.version > 8 || client.activex ) ) ) {
					method = "PATCH";
				}
				else if ( record !== null ) {
					utility.iterate( record.data, function ( v, k ) {
						if ( !array.contains( self.collections, k ) && !data[k] ) {
							data[k] = v;
						}
					});
				}
			}
			else {
				uri = this.uri;
			}

			client.request( uri, method, function ( arg ) {
				self.setComplete( record, key, self.source ? arg[self.source] : arg, batch, defer );
			}, function ( e ) {
				observer.fire( self.parentNode, "failedDataSet", e );
				defer.reject( e );
			}, data, utility.merge( {withCredentials: this.credentials}, this.headers ) );
		}
	}

	return defer;
};

/**
 * Set completion
 *
 * @method setComplete
 * @param  {Mixed}   record DataStore record, or `null` if new
 * @param  {String}  key    Record key
 * @param  {Object}  data   Record data
 * @param  {Boolean} batch  `true` if part of a batch operation
 * @param  {Object}  defer  Deferred instance
 * @return {Object}         DataStore instance
 */
DataStore.prototype.setComplete = function ( record, key, data, batch, defer ) {
	var self      = this,
	    deferreds = [];

	// Create
	if ( record === null ) {
		record = {
			index : this.total++,
			key   : key,
			data  : data
		};

		this.keys[key]             = record.index;
		this.records[record.index] = record;

		if ( this.retrieve ) {
			deferreds.push( this.crawl( record ) );
		}
	}
	// Update
	else {
		utility.iterate( data, function ( v, k ) {
			if ( !array.contains( self.collections, k ) ) {
				record.data[k] = v;
			}
			else if ( typeof v === "string" ) {
				deferreds.push( record.data[k].data.setUri( record.data[k].data.uri + "/" + v, true ) );
			}
			else {
				deferreds.push( record.data[k].data.batch( "set", v, true ) );
			}
		});
	}

	if ( !batch && this.events ) {
		observer.fire( self.parentNode, "afterDataSet", record );

		array.each( this.datalists, function ( i ) {
			i.refresh( true, true );
		});
	}

	if ( deferreds.length === 0 ) {
		defer.resolve( record );
	}
	else {
		utility.when( deferreds ).then( function () {
			defer.resolve( record );
		});
	}

	return this;
};

/**
 * Gets or sets an explicit expiration of data
 *
 * @method setExpires
 * @param  {Number} arg  Milliseconds until data is stale
 * @return {Object}      Data store
 */
DataStore.prototype.setExpires = function ( arg ) {
	// Expiry cannot be less than a second, and must be a valid scenario for consumption; null will disable repetitive expiration
	if ( ( arg !== null && this.uri === null ) || ( arg !== null && ( isNaN( arg ) || arg < 1000 ) ) ) {
		throw new Error( label.error.invalidArguments );
	}

	if ( this.expires === arg ) {
		return;
	}

	this.expires = arg;

	var id      = this.parentNode.id + "DataExpire",
	    expires = arg,
	    self    = this;

	utility.clearTimers( id );

	if ( arg === null ) {
		return;
	}

	utility.repeat( function () {
		if ( self.uri === null ) {
			self.setExpires( null );
			return false;
		}

		if ( !cache.expire( self.uri ) ) {
			observer.fire( self.uri, "beforeExpire, expire, afterExpire" );
		}
	}, expires, id, false);
};

/**
 * Sets the RESTful API end point
 *
 * @method setUri
 * @param  {String} arg API collection end point
 * @return {Object}     Deferred
 */
DataStore.prototype.setUri = function ( arg ) {
	var defer = deferred();

	if ( arg !== null && string.isEmpty( arg ) ) {
		throw new Error( label.error.invalidArguments );
	}

	arg = utility.parse( arg ).href;

	if ( this.uri === arg ) {
		defer.resolve( this.records );
	}
	else {
		if ( this.uri !== null) {
			observer.remove( this.uri );
		}

		this.uri = arg;

		if ( this.uri !== null ) {
			observer.add( this.uri, "expire", function () {
				this.sync();
			}, "dataSync", this);

			cache.expire( this.uri, true );

			this.sync().then( function (arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			});
		}
	}

	return defer;
};

/**
 * Returns a view, or creates a view and returns it
 *
 * Records in a view are not by reference, they are clones
 *
 * @method sort
 * @param  {String} query  SQL ( style ) order by
 * @param  {String} create [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
 * @param  {Object} where  [Optional] Object describing the WHERE clause
 * @return {Array}         View of data
 */
DataStore.prototype.sort = function ( query, create, where ) {
	create      = ( create === true || ( where instanceof Object ) );
	var view    = string.explode( query ).join( " " ).toCamelCase(),
	    records = !where ? this.records : this.select( where );

	if ( this.total === 0 ) {
		return [];
	}
	else if ( !create && this.views[view] ) {
		return this.views[view];
	}
	else {
		this.views[view] = array.keySort( records.slice(), query, "data" );

		return this.views[view];
	}
};

/**
 * Storage interface
 *
 * SQL/NoSQL backends will be used if configured in lieu of localStorage (node.js only)
 *
 * @methd storage
 * @param  {Mixed}  obj  Record ( Object, key or index ) or store
 * @param  {Object} op   Operation to perform ( get, remove or set )
 * @param  {String} type [Optional] Type of Storage to use ( local, session [local] )
 * @return {Object}      Deferred
 */
DataStore.prototype.storage = function ( obj, op, type ) {
	var self    = this,
	    record  = false,
	    mongo   = !string.isEmpty( this.mongodb ),
	    session = ( type === "session" && typeof sessionStorage !== "undefined" ),
	    defer   = deferred(),
	    data, deferreds, key, result;

	if ( !regex.number_string_object.test( typeof obj ) || !regex.get_remove_set.test( op ) ) {
		throw new Error( label.error.invalidArguments );
	}

	record = ( regex.number_string.test( typeof obj ) || ( obj.hasOwnProperty( "key" ) && !obj.hasOwnProperty( "parentNode" ) ) );

	if ( op !== "remove" ) {
		if ( record && !( obj instanceof Object ) ) {
			obj = this.get( obj );
		}

		key = record ? obj.key : obj.parentNode.id;
	}
	else if ( op === "remove" && record ) {
		key = obj.key || obj;
	}

	if ( op === "get" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					if ( db ) {
						db.close();
					}

					defer.reject( e );
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						if ( e ) {
							defer.reject( e );
							db.close();
						}
						else if ( record ) {
							collection.find( {_id: obj.key} ).limit( 1 ).toArray( function ( e, recs ) {
								if ( e ) {
									defer.reject( e );
								}
								else {
									delete recs[0]._id;

									self.set( key, recs[0], true ).then( function ( rec ) {
										defer.resolve( rec );
									}, function ( e ) {
										defer.reject( e );
									} );
								}

								db.close();
							} );
						}
						else {
							collection.find( {} ).toArray( function ( e, recs ) {
								var i   = -1,
								    nth = recs.length;
								
								if ( e ) {
									defer.reject( e );
								}
								else {
									if ( nth > 0 ) {
										self.records = recs.map( function ( r ) {
											var rec = {key: r._id, index: ++i, data: {}};

											self.keys[rec.key] = rec.index;
											rec.data = r;
											delete rec.data._id;

											return rec;
										} );
										
										self.total = nth;
									}
									
									defer.resolve( self.records );
								}

								db.close();
							} );
						}
					} );
				}
			} );
		}
		else {
			result = session ? sessionStorage.getItem( key ) : localStorage.getItem( key );

			if ( result !== null ) {
				result = json.decode( result );

				if ( record ) {
					self.set( key, result, true ).then( function ( rec ) {
						defer.resolve( rec );
					}, function ( e ) {
						defer.reject( e );
					} );
				}
				else {
					utility.merge( self, result );
					defer.resolve( self );
				}
			}
			else {
				defer.resolve( self );
			}
		}
	}
	else if ( op === "remove" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					if ( db ) {
						db.close();
					}

					defer.reject( e );
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						if ( e ) {
							if ( db ) {
								db.close();
							}

							defer.reject( e );
						}
						else {
							collection.remove( record ? {_id: key} : {}, {safe: true}, function ( e, arg ) {
								if ( e ) {
									defer.reject( e );
								}
								else {
									defer.resolve( arg );
								}

								db.close();
							} );
						}
					} );
				}
			} );
		}
		else {
			session ? sessionStorage.removeItem( key ) : localStorage.removeItem( key );
			defer.resolve( this );
		}
	}
	else if ( op === "set" ) {
		if ( mongo ) {
			mongodb.connect( this.mongodb, function( e, db ) {
				if ( e ) {
					if ( db ) {
						db.close();
					}

					defer.reject( e );
				}
				else {
					db.createCollection( self.parentNode.id, function ( e, collection ) {
						if ( e ) {
							defer.reject( e );
							db.close();
						}
						else if ( record ) {
							collection.update( {_id: obj.key}, {$set: obj.data}, {w: 1, safe: true, upsert: true}, function ( e, arg ) {
								if ( e ) {
									defer.reject( e );
								}
								else {
									defer.resolve( arg );
								}

								db.close();
							} );
						}
						else {
							// Removing all documents & re-inserting
							collection.remove( {}, {w: 1, safe: true}, function ( e ) {
								if ( e ) {
									defer.reject( e );
									db.close();
								}
								else {
									deferreds = [];

									array.each( self.records, function ( i ) {
										var data   = {},
										    defer2 = deferred();

										deferreds.push( defer2 );

										utility.iterate( i.data, function ( v, k ) {
											if ( !array.contains( self.collections, k ) ) {
												data[k] = v;
											}
										} );

										collection.update( {_id: i.key}, {$set: data}, {w:1, safe:true, upsert:true}, function ( e, arg ) {
											if ( e ) {
												defer2.reject( e );
											}
											else {
												defer2.resolve( arg );
											}
										} );
									} );

									utility.when( deferreds ).then( function ( result ) {
										defer.resolve( result );
										db.close();
									}, function ( e ) {
										defer.reject( e );
										db.close();
									} );
								}
							} );
						}
					} );
				}
			} );
		}
		else {
			data = json.encode( record ? obj.data : {total: this.total, keys: this.keys, records: this.records} );
			session ? sessionStorage.setItem( key, data ) : localStorage.setItem( key, data );
			defer.resolve( this );
		}
	}

	return defer;
};

/**
 * Syncs the DataStore with a URI representation
 *
 * Events: beforeDataSync  Fires before syncing the DataStore
 *         afterDataSync   Fires after syncing the DataStore
 *         failedDataSync  Fires when an exception occurs
 *
 * @method sync
 * @return {Object} Deferred
 */
DataStore.prototype.sync = function () {
	if ( this.uri === null || string.isEmpty( this.uri ) ) {
		throw new Error( label.error.invalidArguments );
	}

	var self   = this,
	    events = ( this.events === true ),
	    defer  = deferred(),
	    success, failure;

	/**
	 * Resolves public deferred
	 *
	 * @method success
	 * @private
	 * @param  {Object} arg API response
	 * @return {Undefined}  undefined
	 */
	success = function ( arg ) {
		var data;

		if ( typeof arg !== "object" ) {
			throw new Error( label.error.expectedObject );
		}

		if ( self.source !== null ) {
			arg = utility.walk( arg, self.source );
		}

		if ( arg instanceof Array ) {
			data = arg;
		}
		else {
			data = [arg];
		}

		self.batch( "set", data, true ).then( function ( arg ) {
			if ( events ) {
				observer.fire( self.parentNode, "afterDataSync", arg );
			}

			defer.resolve( arg );
		}, failure);
	};

	/**
	 * Rejects public deferred
	 *
	 * @method failure
	 * @private
	 * @param  {Object} e Error instance
	 * @return {Undefined} undefined
	 */
	failure = function ( e ) {
		if ( events ) {
			observer.fire( self.parentNode, "failedDataSync", e );
		}

		defer.reject( e );
	};

	if ( events) {
		observer.fire( this.parentNode, "beforeDataSync", this.uri );
	}

	if ( this.callback !== null ) {
		client.jsonp( this.uri, success, failure, {callback: this.callback} );
	}
	else {
		client.request( this.uri, "GET", success, failure, null, utility.merge( {withCredentials: this.credentials}, this.headers) );
	}

	return defer;
};

/**
 * Tears down a store & expires all records associated to an API
 *
 * @method teardown
 * @return {Undefined} undefined
 */
DataStore.prototype.teardown = function () {
	var uri = this.uri,
	    id;

	if ( uri !== null ) {
		cache.expire( uri, true );
		observer.remove( uri );

		id = this.parentNode.id + "DataExpire";
		utility.clearTimers( id );

		array.each( this.datalists, function (i ) {
			i.teardown();
		});

		array.each( this.records, function ( i ) {
			var recordUri = uri + "/" + i.key;

			cache.expire( recordUri, true );
			observer.remove( recordUri );

			utility.iterate( i.data, function ( v ) {
				if ( v === null ) {
					return;
				}

				if ( v.data && typeof v.data.teardown === "function" ) {
					observer.remove( v.id );
					v.data.teardown();
				}
			});
		});
	}

	this.clear( true );
	observer.fire( this.parentNode, "afterDataTeardown" );

	return this;
};

/**
 * Returns Array of unique values of `key`
 *
 * @method unique
 * @param  {String} key Field to compare
 * @return {Array}      Array of values
 */
DataStore.prototype.unique = function ( key ) {
	return array.unique( this.records.map( function ( i ) {
		return i.data[key];
	}));
};

/**
 * Applies a difference to a record
 *
 * Use `data.set()` if `data` is the complete field set
 *
 * @method update
 * @param  {Mixed}  key  Key or index
 * @param  {Object} data Key:Value pairs to set as field values
 * @return {Object}      Deferred
 */
DataStore.prototype.update = function ( key, data ) {
	var record = this.get( key ),
	    defer  = deferred();

	if ( record === undefined ) {
		throw new Error( label.error.invalidArguments );
	}

	utility.iterate( record.data, function ( v, k ) {
		data[v] = k;
	});
	
	this.set( key, data ).then( function ( arg ) {
		defer.resolve( arg );
	}, function ( e ) {
		defer.reject( e );
	});

	return defer;
};

/** @namespace datalist */
var datalist = {
	/**
	 * Creates an instance of datalist
	 *
	 * @method factory
	 * @param  {Object} target   Element to receive the DataList
	 * @param  {Object} store    Data store to feed the DataList
	 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
	 * @param  {Object} options  Optional parameters to set on the DataList
	 * @return {Object}          DataList instance
	 */
	factory : function ( target, store, template, options ) {
		var ref = [store],
		    obj, instance;

		if ( !( target instanceof Element ) || typeof store !== "object" || !regex.string_object.test( typeof template ) ) {
			throw new Error( label.error.invalidArguments );
		}

		obj = element.create( "ul", {"class": "list", id: store.parentNode.id + "-datalist"}, target );

		// Creating instance
		instance = new DataList( obj, ref[0], template );

		if ( options instanceof Object) {
			utility.merge( instance, options );
		}

		instance.store.datalists.push( instance );

		// Rendering if not tied to an API or data is ready
		if ( instance.store.uri === null || instance.store.loaded ) {
			instance.refresh( true, true );
		}

		return instance;
	},

	/**
	 * Calculates the total pages
	 *
	 * @method pages
	 * @private
	 * @return {Number} Total pages
	 */
	pages : function () {
		if ( isNaN( this.pageSize ) ) {
			throw new Error( label.error.invalidArguments );
		}

		return number.round( ( !this.filter ? this.total : this.filtered.length ) / this.pageSize, "up" );
	},

	/**
	 * Calculates the page size as an Array of start & finish
	 *
	 * @method range
	 * @private
	 * @return {Array}  Array of start & end numbers
	 */
	range : function () {
		var start = ( this.pageIndex * this.pageSize ) - this.pageSize,
		    end   = this.pageSize;

		return [start, end];
	}
};

/**
 * DataList factory
 *
 * @constructor
 */
function DataList ( element, store, template ) {
	this.callback    = null;
	this.element     = element;
	this.emptyMsg    = "Nothing to display";
	this.filter      = null;
	this.filtered    = [];
	this.id          = utility.genId();
	this.pageIndex   = 1;
	this.pageSize    = null;
	this.pageRange   = 5;
	this.pagination  = "bottom"; // "top" or "bottom|top" are also valid
	this.placeholder = "";
	this.order       = "";
	this.records     = [];
	this.current     = [];
	this.template    = template;
	this.total       = 0;
	this.store       = store;
	this.where       = null;
}

// Setting constructor loop
DataList.prototype.constructor = DataList;

/**
 * Exports data list records
 *
 * @method dump
 * @return {Array} Record set
 */
DataList.prototype.dump = function () {
	return this.store.dump( this.records );
};

/**
 * Changes the page index of the DataList
 *
 * @method page
 * @param  {Boolean} redraw [Optional] Boolean to force clearing the DataList, default is `true`, false toggles "hidden" class of items
 * @param  {Boolean} create [Optional] Recreates cached View of data
 * @return {Object}         DataList instance
 */
DataList.prototype.page = function ( arg, redraw, create ) {
	this.pageIndex = arg;

	return this.refresh( redraw, create );
};

/**
 * Adds pagination Elements to the View
 *
 * @method pages
 * @return {Object}  DataList instance
 */
DataList.prototype.pages = function () {
	var obj   = this.element,
	    page  = this.pageIndex,
	    pos   = this.pagination,
	    range = this.pageRange,
	    mid   = number.round( number.half( range ), "down" ),
	    start = page - mid,
	    end   = page + mid,
	    self  = this,
	    total = datalist.pages.call( this ),
	    diff;

	if ( !regex.top_bottom.test( pos ) ) {
		throw new Error( label.error.invalidArguments );
	}

	// Removing the existing controls
	array.each( utility.$( "#" + obj.id + "-pages-top, #" + obj.id + "-pages-bottom" ), function ( i ) {
		if ( i ) {
			element.destroy( i );
		}
	});
	
	// Halting because there's 1 page, or nothing
	if ( ( this.filter && this.filtered.length === 0 ) || this.total === 0 || total === 1 ) {
		return this;
	}

	// Getting the range to display
	if ( start < 1 ) {
		diff  = number.diff( start, 1 );
		start = start + diff;
		end   = end   + diff;
	}

	if ( end > total ) {
		end   = total;
		start = ( end - range ) + 1;

		if ( start < 1 ) {
			start = 1;
		}
	}

	if ( number.diff( start, end ) >= range ) {
		--end;
	}

	array.each( string.explode( pos ), function ( i ) {
		var current = false,
		    more    = page > 1,
		    next    = ( page + 1 ) <= total,
		    last    = ( page >= total ),
		    el, n;

		// Setting up the list
		el = element.create( "ul", {"class": "list pages hidden " + i, id: obj.id + "-pages-" + i}, obj, i === "bottom" ? "after" : "before" );

		// First page
		element.create( more ? "a" : "span", {"class": "first page", "data-page": 1, innerHTML: "&lt;&lt;"}, element.create( "li", {}, el) );

		// Previous page
		element.create( more ? "a" : "span", {"class": "prev page", "data-page": (page - 1), innerHTML: "&lt;"}, element.create( "li", {}, el) );

		// Rendering the page range
		for ( n = start; n <= end; n++ ) {
			current = ( n === page );
			element.create( current ? "span" : "a", {"class": current ? "current page" : "page", "data-page": n, innerHTML: n}, element.create( "li", {}, el) );
		}

		// Next page
		element.create( next ? "a" : "span", {"class": "next page", "data-page": next ? (page + 1) : null, innerHTML: "&gt;"}, element.create( "li", {}, el) );

		// Last page
		element.create( last ? "span" : "a", {"class": "last page", "data-page": last ? null : total, innerHTML: "&gt;&gt;"}, element.create( "li", {}, el) );

		// Adding to DOM
		element.klass( el, "hidden", false );

		// Click handler scrolls to top the top of page
		observer.add( el, "click", function (e ) {
			var target = utility.target( e );

			utility.stop( e );

			if ( target.nodeName === "A" ) {
				self.page( element.data( target, "page") );
				element.scrollTo( obj );
			}
		}, "pagination");
	});

	return this;
};

/**
 * Refreshes element
 *
 * Events: beforeDataListRefresh  Fires from the element containing the DataList
 *         afterDataListRefresh   Fires from the element containing the DataList
 *
 * @method refresh
 * @param  {Boolean} redraw [Optional] Boolean to force clearing the DataList ( default ), false toggles "hidden" class of items
 * @param  {Boolean} create [Optional] Recreates cached View of data
 * @return {Object}         DataList instance
 */
DataList.prototype.refresh = function ( redraw, create ) {
	var el       = this.element,
	    template = ( typeof this.template === "object" ),
	    filter   = this.filter !== null,
	    items    = [],
	    self     = this,
	    callback = ( typeof this.callback === "function" ),
	    reg      = new RegExp(),
	    registry = [], // keeps track of records in the list ( for filtering )
	    range    = [],
	    fn, ceiling;

	redraw = ( redraw !== false );
	create = ( create === true );

	observer.fire( el, "beforeDataListRefresh" );

	// Function to create templates for the html rep
	if ( !template ) {
		fn = function ( i ) {
			var html  = self.template,
			    items = array.unique( html.match( /\{\{[\w\.\-\[\]]+\}\}/g ) );

			// Replacing record key
			html = html.replace( "{{" + self.store.key + "}}", i.key );
			
			// Replacing dot notation properties
			array.each( items, function ( attr ) {
				var key   = attr.replace( /\{\{|\}\}/g, "" ),
				    value = utility.walk( i.data, key );

				reg.compile( string.escape( attr ), "g" );
				html = html.replace( reg, value );
			});

			// Filling in placeholder value
			html = html.replace( /\{\{.*\}\}/g, self.placeholder );

			return "<li data-key=\"" + i.key + "\">" + html + "</li>";
		};
	}
	else {
		fn = function ( i ) {
			var obj   = json.encode( self.template ),
			    items = array.unique( obj.match( /\{\{[\w\.\-\[\]]+\}\}/g ) );

			// Replacing record key
			obj = obj.replace( "{{" + self.store.key + "}}", i.key );
			
			// Replacing dot notation properties
			array.each( items, function ( attr ) {
				var key   = attr.replace( /\{\{|\}\}/g, "" ),
				    value = utility.walk( i.data, key );

				reg.compile( string.escape( attr ), "g" );

				// Stripping first and last " to concat to valid JSON
				obj = obj.replace( reg, json.encode( value ).replace( /(^")|("$)/g, "" ) );
			});

			// Filling in placeholder value
			obj = json.decode( obj.replace( /\{\{.*\}\}/g, self.placeholder ) );

			return {li: obj};
		};
	}

	// Creating view of DataStore
	if ( create ) {
		// Consuming records based on sort
		if ( this.where === null ) {
			this.records = string.isEmpty( this.order ) ? this.store.get() : this.store.sort( this.order, create );
		}
		else {
			this.records = string.isEmpty( this.order ) ? this.store.select( this.where ) : this.store.sort( this.order, create, this.where );
		}

		this.total    = this.records.length;
		this.filtered = [];
	}

	// Resetting 'view' specific arrays
	this.current  = [];

	// Filtering records (if applicable)
	if ( filter && create ) {
		array.each( this.records, function ( i ) {
			utility.iterate( self.filter, function ( v, k ) {
				var reg, key;

				if ( array.contains( registry, i.key ) ) {
					return false;
				}
				
				v   = string.explode( v );
				reg = new RegExp(),
				key = ( k === self.store.key );

				array.each( v, function ( query ) {
					var value = !key ? utility.walk( i.data, k ) : "";

					utility.compile( reg, query, "i" );

					if ( ( key && reg.test( i.key ) ) || reg.test( value ) ) {
						registry.push( i.key );
						self.filtered.push( i );

						return false;
					}
				});
			});
		});
	}

	// Pagination
	if ( typeof this.pageIndex === "number" && typeof this.pageSize === "number" ) {
		ceiling = datalist.pages.call( this );

		// Passed the end, so putting you on the end
		if ( ceiling > 0 && this.pageIndex > ceiling ) {
			return this.page( ceiling );
		}

		// Paginating the items
		else if ( this.total > 0 ) {
			range        = datalist.range.call( this );
			this.current = array.limit( !filter ? this.records : this.filtered, range[0], range[1] );
		}
	}
	else {
		this.current = !filter ? this.records : this.filtered;
	}

	// Processing records & generating templates
	array.each( this.current, function ( i ) {
		items.push( {key: i.key, template: fn( i )} );
	});

	// Preparing the target element
	if ( redraw ) {
		if ( items.length === 0 ) {
			el.innerHTML = "<li class=\"empty\">" + this.emptyMsg + "</li>";
		}
		else {
			el.innerHTML = items.map( function ( i ) {
				return i.template;
			}).join( "\n" );

			if ( callback ) {
				array.each( element.find( el, "> li" ), function ( i ) {
					self.callback( i );
				});
			}
		}
	}
	else {
		array.each( element.find( el, "> li" ), function ( i ) {
			element.addClass( i, "hidden" );
		});

		array.each( items, function ( i ) {
			array.each( element.find( el, "> li[data-key='" + i.key + "']" ), function ( o ) {
				element.removeClass( o, "hidden" );
			});
		});
	}

	// Rendering pagination elements
	if ( regex.top_bottom.test( this.pagination ) && typeof this.pageIndex === "number" && typeof this.pageSize === "number") {
		this.pages();
	}
	else {
		array.each( utility.$( "#" + el.id + "-pages-top, #" + el.id + "-pages-bottom" ), function ( i ) {
			element.destroy( i );
		});
	}

	observer.fire( el, "afterDataListRefresh" );

	return this;
};

/**
 * Sorts data list & refreshes element
 *
 * @method sort
 * @param  {String}  order  SQL "order by" statement
 * @param  {Boolean} create [Optional] Recreates cached View of data store
 * @return {Object}         DataList instance
 */
DataList.prototype.sort = function ( order, create ) {
	this.order = order;

	return this.refresh( true, create );
};

/**
 * Tears down references to the DataList
 *
 * @method teardown
 * @param  {Boolean} destroy [Optional] `true` will remove the DataList from the DOM
 * @return {Object}  DataList instance
 */
DataList.prototype.teardown = function ( destroy ) {
	destroy  = ( destroy === true );
	var self = this,
	    id   = this.element.id;

	observer.remove( id );

	array.each( utility.$( "#" + id + "-pages-top, #" + id + "-pages-bottom" ), function ( i ) {
		observer.remove( i );
	});

	array.each( this.store.datalists, function ( i, idx ) {
		if ( i.id === self.id ) {
			this.remove( idx );

			return false;
		}
	});

	if ( destroy ) {
		element.destroy( this.element );
		this.element = null;
	}

	return this;
};

/**
 * deferred factory
 *
 * @method deferred
 * @return {Object} Deferred instance
 */
var deferred = function () {
	return new Deferred();
};

/**
 * Deferred
 *
 * @constructor
 */
function Deferred () {
	var self      = this;

	this.promise  = promise.factory();
	this.onDone   = [];
	this.onAlways = [];
	this.onFail   = [];

	// Setting handlers to execute Arrays of Functions
	this.promise.then( function ( arg ) {
		promise.delay( function () {
			array.each( self.onDone, function ( i ) {
				i( arg );
			});

			array.each( self.onAlways, function ( i ) {
				i( arg );
			});

			self.onAlways = [];
			self.onDone   = [];
			self.onFail   = [];
		});
	}, function ( arg ) {
		promise.delay( function () {
			array.each( self.onFail, function ( i ) {
				i( arg );
			});

			array.each( self.onAlways, function ( i ) {
				i( arg );
			});

			self.onAlways = [];
			self.onDone   = [];
			self.onFail   = [];
		});
	});
}

// Setting constructor loop
Deferred.prototype.constructor = Deferred;

/**
 * Registers a function to execute after Promise is reconciled
 *
 * @method always
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred instance
 */
Deferred.prototype.always = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onAlways.push( arg );

	return this;
};

/**
 * Registers a function to execute after Promise is resolved
 *
 * @method done
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred instance
 */
Deferred.prototype.done = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onDone.push( arg );

	return this;
};

/**
 * Registers a function to execute after Promise is rejected
 *
 * @method fail
 * @param  {Function} arg Function to execute
 * @return {Object}       Deferred instance
 */
Deferred.prototype.fail = function ( arg ) {
	if ( typeof arg !== "function" ) {
		throw new Error( label.error.invalidArguments );
	}
	else if ( this.promise.state > 0 ) {
		throw new Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.value ) );
	}

	this.onFail.push( arg );

	return this;
};

/**
 * Determines if Deferred is rejected
 *
 * @method isRejected
 * @return {Boolean} `true` if rejected
 */
Deferred.prototype.isRejected = function () {
	return ( this.promise.state === promise.state.FAILED );
};

/**
 * Determines if Deferred is resolved
 *
 * @method isResolved
 * @return {Boolean} `true` if resolved
 */
Deferred.prototype.isResolved = function () {
	return ( this.promise.state === promise.state.SUCCESS );
};

/**
 * Rejects the Promise
 *
 * @method reject
 * @param  {Mixed} arg Rejection outcome
 * @return {Object}    Deferred instance
 */
Deferred.prototype.reject = function ( arg ) {
	this.promise.reject.call( this.promise, arg );

	return this;
};

/**
 * Resolves the Promise
 *
 * @method resolve
 * @param  {Mixed} arg Resolution outcome
 * @return {Object}    Deferred instance
 */
Deferred.prototype.resolve = function ( arg ) {
	this.promise.resolve.call( this.promise, arg );

	return this;
};

/**
 * Gets the state of the Promise
 *
 * @method state
 * @return {String} Describes the state
 */
Deferred.prototype.state = function () {
	return this.promise.state;
};

/**
 * Registers handler(s) for the Promise
 *
 * @method then
 * @param  {Function} success Executed when/if promise is resolved
 * @param  {Function} failure [Optional] Executed when/if promise is broken
 * @return {Object}           New Promise instance
 */
Deferred.prototype.then = function ( success, failure ) {
	return this.promise.then( success, failure );
};

/** @namespace element */
var element = {
	/**
	 * Gets or sets an Element attribute
	 *
	 * @method attr
	 * @param  {Mixed}  obj   Element
	 * @param  {String} name  Attribute name
	 * @param  {Mixed}  value Attribute value
	 * @return {Object}       Element
	 */
	attr : function ( obj, key, value ) {
		var target, result;

		if ( regex.svg.test( obj.namespaceURI ) ) {
			if ( value === undefined ) {
				result = obj.getAttributeNS( obj.namespaceURI, key );

				if ( result === null || string.isEmpty( result ) ) {
					result = undefined;
				}
				else {
					result = utility.coerce( result );
				}
			}
			else {
				obj.setAttributeNS( obj.namespaceURI, key, value );
			}
		}
		else {
			if ( typeof value === "string" ) {
				value = string.trim( value );
			}

			if ( regex.checked_disabled.test( key ) && value === undefined ) {
				return utility.coerce( obj[key] );
			}
			else if ( regex.checked_disabled.test( key ) && value !== undefined ) {
				obj[key] = value;
			}
			else if ( obj.nodeName === "SELECT" && key === "selected" && value === undefined) {
				return utility.$( "#" + obj.id + " option[selected=\"selected\"]" )[0] || utility.$( "#" + obj.id + " option" )[0];
			}
			else if ( obj.nodeName === "SELECT" && key === "selected" && value !== undefined ) {
				target = utility.$( "#" + obj.id + " option[selected=\"selected\"]" )[0];

				if ( target !== undefined ) {
					target.selected = false;
					target.removeAttribute( "selected" );
				}

				target = utility.$( "#" + obj.id + " option[value=\"" + value + "\"]" )[0];
				target.selected = true;
				target.setAttribute( "selected", "selected" );
			}
			else if ( value === undefined ) {
				result = obj.getAttribute( key );

				if ( result === null || string.isEmpty( result ) ) {
					result = undefined;
				}
				else {
					result = utility.coerce( result );
				}

				return result;
			}
			else {
				obj.setAttribute( key, value );
			}
		}

		return obj;
	},

	/**
	 * Clears an object's innerHTML, or resets it's state
	 *
	 * @method clear
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	clear : function ( obj ) {
		if ( typeof obj.reset === "function" ) {
			obj.reset();
		}
		else if ( obj.value !== undefined ) {
			element.update( obj, {innerHTML: "", value: ""} );
		}
		else {
			element.update( obj, {innerHTML: ""} );
		}

		return obj;
	},

	/**
	 * Creates an Element in document.body or a target Element
	 *
	 * An id is generated if not specified with args
	 *
	 * @method create
	 * @param  {String} type   Type of Element to create
	 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
	 * @param  {Mixed}  target [Optional] Target Element
	 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
	 * @return {Mixed}         Element that was created, or an Array if `type` is a String of multiple Elements (frag)
	 */
	create : function ( type, args, target, pos ) {
		var svg  = false,
		    frag = false,
		    obj, uid, result;

		// Removing potential HTML template formatting
		type = type.replace( /\t|\n|\r/g, "" );

		if ( target !== undefined ) {
			svg = ( target.namespaceURI !== undefined && regex.svg.test( target.namespaceURI ) );
		}
		else {
			target = document.body;
		}
		
		if ( args instanceof Object && args.id !== undefined && utility.$( "#" + args.id ) === undefined ) {
			uid = args.id;
			delete args.id;
		}
		else if ( !svg ) {
			uid = utility.genId( undefined, true );
		}

		// String injection, create a frag and apply it
		if ( regex.html.test( type ) ) {
			frag   = true;
			obj    = element.frag( type );
			result = obj.childNodes.length === 1 ? obj.childNodes[0] : array.cast( obj.childNodes );
		}
		// Original syntax
		else {
			if ( !svg && !regex.svg.test( type ) ) {
				obj = document.createElement( type );
			}
			else {
				obj = document.createElementNS( "http://www.w3.org/2000/svg", type );
			}

			if ( uid !== undefined ) {
				obj.id = uid;
			}

			if ( args instanceof Object ) {
				element.update( obj, args );
			}
		}

		if ( pos === undefined || pos === "last" ) {
			target.appendChild( obj );
		}
		else if ( pos === "first" ) {
			element.prependChild( target, obj );
		}
		else if ( pos === "after" ) {
			pos = {};
			pos.after = target;
			target    = target.parentNode;
			target.insertBefore( obj, pos.after.nextSibling );
		}
		else if ( pos.after !== undefined ) {
			target.insertBefore( obj, pos.after.nextSibling );
		}
		else if ( pos === "before" ) {
			pos = {};
			pos.before = target;
			target     = target.parentNode;
			target.insertBefore( obj, pos.before );
		}
		else if ( pos.before !== undefined ) {
			target.insertBefore( obj, pos.before );
		}
		else {
			target.appendChild( obj );
		}

		return !frag ? obj : result;
	},

	/**
	 * Gets or sets a CSS style attribute on an Element
	 *
	 * @method css
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   CSS to put in a style tag
	 * @param  {String} value [Optional] Value to set
	 * @return {Object}       Element
	 */
	css : function ( obj, key, value ) {
		key = string.toCamelCase( key );

		if ( value !== undefined ) {
			obj.style[key] = value;
			return obj;
		}
		else {
			return obj.style[key];
		}
	},

	/**
	 * Data attribute facade acting as a getter (with coercion) & setter
	 *
	 * @method data
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   Data key
	 * @param  {Mixed}  value Boolean, Number or String to set
	 * @return {Mixed}        undefined, Element or value
	 */
	data : function ( obj, key, value ) {
		if ( value !== undefined ) {
			obj.setAttribute( "data-" + key, regex.json_wrap.test( value ) ? json.encode( value ) : value );
			return obj;
		}
		else {
			return utility.coerce( obj.getAttribute( "data-" + key ) );
		}
	},

	/**
	 * Destroys an Element
	 *
	 * @method destroy
	 * @param  {Mixed} obj Element
	 * @return {Undefined} undefined
	 */
	destroy : function ( obj ) {
		observer.remove( obj );

		if ( obj.parentNode !== null ) {
			obj.parentNode.removeChild( obj );
		}

		return undefined;
	},

	/**
	 * Disables an Element
	 *
	 * @method disable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	disable : function ( obj ) {
		if ( typeof obj.disabled === "boolean" && !obj.disabled ) {
			obj.disabled = true;
		}

		return obj;
	},

	/**
	 * Dispatches a DOM Event from an Element
	 *
	 * `data` will appear as `Event.detail`
	 *
	 * @method dispatch
	 * @param  {Object}  obj        Element which dispatches the Event
	 * @param  {String}  type       Type of Event to dispatch
	 * @param  {Object}  data       Data to include with the Event
	 * @param  {Boolean} bubbles    [Optional] Determines if the Event bubbles, defaults to `true`
	 * @param  {Boolean} cancelable [Optional] Determines if the Event can be canceled, defaults to `true`
	 * @return {Object}             Element which dispatches the Event
	 */
	dispatch : function () {
		if ( typeof CustomEvent === "function" ) {
			return function ( obj, type, data, bubbles, cancelable ) {
				var ev = new CustomEvent( type );

				bubbles    = ( bubbles    !== false );
				cancelable = ( cancelable !== false );

				ev.initCustomEvent( type, bubbles, cancelable, data || {} );

				obj.dispatchEvent(ev);

				return obj;
			};
		}
		else if ( document !== undefined && typeof document.createEvent === "function" ) {
			return function ( obj, type, data, bubbles, cancelable ) {
				var ev = document.createEvent( "HTMLEvents" );

				bubbles    = ( bubbles    !== false );
				cancelable = ( cancelable !== false );

				ev.initEvent( type, bubbles, cancelable );

				ev.detail = data || {};

				obj.dispatchEvent(ev);

				return obj;
			};
		}
		else if ( document !== undefined && typeof document.createEventObject === "object" ) {
			return function ( obj, type, data, bubbles ) {
				var ev = document.createEventObject();

				ev.cancelBubble = ( bubbles !== false );
				ev.detail       = data || {};

				obj.fireEvent( "on" + type, ev );
			};
		}
		else {
			return function () {
				throw new Error( label.error.notSupported );
			};
		}
	}(),

	/**
	 * Enables an Element
	 *
	 * @method enable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	enable : function ( obj ) {
		if ( typeof obj.disabled === "boolean" && obj.disabled ) {
			obj.disabled = false;
		}

		return obj;
	},

	/**
	 * Finds descendant childNodes of Element matched by arg
	 *
	 * @method find
	 * @param  {Mixed}  obj Element to search
	 * @param  {String} arg Comma delimited string of descendant selectors
	 * @return {Mixed}      Array of Elements or undefined
	 */
	find : function ( obj, arg ) {
		var result = [];

		utility.genId( obj, true );

		array.each( string.explode( arg ), function ( i ) {
			result = result.concat( utility.$( "#" + obj.id + " " + i ) );
		});

		return result;
	},

	/**
	 * Creates a document fragment
	 *
	 * @method frag
	 * @param  {String} arg [Optional] innerHTML
	 * @return {Object}     Document fragment
	 */
	frag : function ( arg ) {
		var obj = document.createDocumentFragment();

		if ( arg ) {
			array.each( array.cast( element.create( "div", {innerHTML: arg}, obj ).childNodes ), function ( i ) {
				obj.appendChild( i );
			});

			obj.removeChild( obj.childNodes[0] );
		}

		return obj;
	},

	/**
	 * Determines if Element has descendants matching arg
	 *
	 * @method has
	 * @param  {Mixed}   obj Element or Array of Elements or $ queries
	 * @param  {String}  arg Type of Element to find
	 * @return {Boolean}     True if 1 or more Elements are found
	 */
	has : function ( obj, arg ) {
		var result = element.find( obj, arg );

		return ( !isNaN( result.length ) && result.length > 0 );
	},

	/**
	 * Determines if obj has a specific CSS class
	 *
	 * @method hasClass
	 * @param  {Mixed} obj Element
	 * @return {Mixed}     Element, Array of Elements or undefined
	 */
	hasClass : function ( obj, klass ) {
		return obj.classList.contains( klass );
	},

	/**
	 * Returns a Boolean indidcating if the Object is hidden
	 *
	 * @method hidden
	 * @param  {Mixed} obj Element
	 * @return {Boolean}   True if hidden
	 */
	hidden : function ( obj ) {
		return obj.style.display === "none" || ( typeof obj.hidden === "boolean" && obj.hidden );
	},

	/**
	 * Gets or sets an Elements innerHTML
	 *
	 * @method html
	 * @param  {Object} obj Element
	 * @param  {String} arg [Optional] innerHTML value
	 * @return {Object}     Element
	 */
	html : function ( obj, arg ) {
		if ( arg === undefined ) {
			return obj.innerHTML;
		}
		else {
			 obj.innerHTML = arg;
			 return obj;
		}
	},

	/**
	 * Determines if Element is equal to arg, supports nodeNames & CSS2+ selectors
	 *
	 * @method is
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Property to query
	 * @return {Boolean}     True if a match
	 */
	is : function ( obj, arg ) {
		if ( regex.selector_is.test( arg ) ) {
			utility.id( obj );
			return ( element.find( obj.parentNode, obj.nodeName.toLowerCase() + arg ).filter( function ( i ) {
				return ( i.id === obj.id );
			}).length === 1 );
		}
		else {
			return new RegExp( arg, "i" ).test( obj.nodeName );
		}
	},

	/**
	 * Tests if Element value or text is alpha-numeric
	 *
	 * @method isAlphaNum
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isAlphaNum : function ( obj ) {
		return obj.nodeName === "FORM" ? false : validate.test( {alphanum  : obj.value || element.text( obj )} ).pass;
	},

	/**
	 * Tests if Element value or text is a boolean
	 *
	 * @method isBoolean
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isBoolean : function ( obj ) {
		return obj.nodeName === "FORM" ? false : validate.test( {"boolean" : obj.value || element.text( obj )} ).pass;
	},

	/**
	 * Tests if Element value or text is checked
	 *
	 * @method isChecked
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isChecked : function ( obj ) {
		return obj.nodeName !== "INPUT" ? false : element.attr( obj, "checked" );
	},

	/**
	 * Tests if Element value or text is a date
	 *
	 * @method isDate
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDate : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isDate( obj.value   || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is disabled
	 *
	 * @method isDisabled
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDisabled: function ( obj ) {
		return obj.nodeName !== "INPUT" ? false : element.attr( obj, "disabled" );
	},

	/**
	 * Tests if Element value or text is a domain
	 *
	 * @method isDomain
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDomain : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isDomain( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an email address
	 *
	 * @method isEmail
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isEmail  : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isEmail( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is empty
	 *
	 * @method isEmpty
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isEmpty  : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isEmpty( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an IP address
	 *
	 * @method isIP
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isIP : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isIP( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an integer
	 *
	 * @method isInt
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isInt : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isInt( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is numeric
	 *
	 * @method isNumber
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isNumber : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isNumber( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is a phone number
	 *
	 * @method isPhone
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isPhone : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isPhone( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is a URL
	 *
	 * @method isUrl
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isUrl : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isUrl( obj.value || element.text( obj ) );
	},

	/**
	 * Adds or removes a CSS class
	 *
	 * @method klass
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Class to add or remove ( can be a wildcard )
	 * @param  {Boolean} add Boolean to add or remove, defaults to true
	 * @return {Object}      Element
	 */
	klass : function ( obj, arg, add ) {
		add = ( add !== false );
		arg = string.explode( arg, " " );

		if ( add ) {
			array.each( arg, function ( i ) {
				obj.classList.add( i );
			});
		}
		else {
			array.each( arg, function ( i ) {
				if ( i !== "*" ) {
					obj.classList.remove( i );
				}
				else {
					array.each( obj.classList, function ( x ) {
						this.remove( x );
					});

					return false;
				}
			});
		}

		return obj;
	},

	/**
	 * Finds the position of an element
	 *
	 * @method position
	 * @param  {Mixed} obj Element
	 * @return {Array}     Coordinates [left, top, right, bottom]
	 */
	position : function ( obj ) {
		obj = obj || document.body;
		var left, top, right, bottom, height, width;

		left   = top = 0;
		width  = obj.offsetWidth;
		height = obj.offsetHeight;

		if ( obj.offsetParent ) {
			top    = obj.offsetTop;
			left   = obj.offsetLeft;

			while ( obj = obj.offsetParent ) {
				left += obj.offsetLeft;
				top  += obj.offsetTop;
			}

			right  = document.body.offsetWidth  - ( left + width );
			bottom = document.body.offsetHeight - ( top  + height );
		}
		else {
			right  = width;
			bottom = height;
		}

		return [left, top, right, bottom];
	},

	/**
	 * Prepends an Element to an Element
	 *
	 * @method prependChild
	 * @param  {Object} obj   Element
	 * @param  {Object} child Child Element
	 * @return {Object}       Element
	 */
	prependChild : function ( obj, child ) {
		return obj.childNodes.length === 0 ? obj.appendChild( child ) : obj.insertBefore( child, obj.childNodes[0] );
	},

	/**
	 * Removes an Element attribute
	 *
	 * @method removeAttr
	 * @param  {Mixed}  obj Element
	 * @param  {String} key Attribute name
	 * @return {Object}     Element
	 */
	removeAttr : function ( obj, key ) {
		var target;

		if ( regex.svg.test( obj.namespaceURI ) ) {
			obj.removeAttributeNS( obj.namespaceURI, key );
		}
		else {
			if ( obj.nodeName === "SELECT" && key === "selected") {
				target = utility.$( "#" + obj.id + " option[selected=\"selected\"]" )[0];

				if ( target !== undefined ) {
					target.selected = false;
					target.removeAttribute( "selected" );
				}
			}
			else {
				obj.removeAttribute( key );
			}
		}

		return obj;
	},

	/**
	 * Scrolls to the position of an Element
	 *
	 * @method scrollTo
	 * @param  {Object} obj Element to scroll to
	 * @param  {Number} ms  [Optional] Milliseconds to scroll, default is 250, min is 100
	 * @return {Object}     Deferred
	 */
	scrollTo : function ( obj, ms ) {
		return client.scroll( array.remove( element.position( obj ), 2, 3 ), ms );
	},

	/**
	 * Serializes the elements of an Element
	 *
	 * @method serialize
	 * @param  {Object}  obj    Element
	 * @param  {Boolean} string [Optional] true if you want a query string, default is false ( JSON )
	 * @param  {Boolean} encode [Optional] true if you want to URI encode the value, default is true
	 * @return {Mixed}          String or Object
	 */
	serialize : function ( obj, string, encode ) {
		string       = ( string === true );
		encode       = ( encode !== false );
		var children = [],
		    registry = {},
		    result;

		children = obj.nodeName === "FORM" ? ( obj.elements !== undefined ? array.cast( obj.elements ) : obj.find( "button, input, select, textarea" ) ) : [obj];

		array.each( children, function ( i ) {
			if ( i.nodeName === "FORM" ) {
				utility.merge( registry, json.decode( element.serialize( i ) ) );
			}
			else if ( registry[i.name] === undefined ) {
				registry[i.name] = element.val( i );
			}
		});

		if ( !string ) {
			result = json.encode( registry );
		}
		else {
			result = "";

			utility.iterate( registry, function ( v, k ) {
				encode ? result += "&" + encodeURIComponent( k ) + "=" + encodeURIComponent( v ) : result += "&" + k + "=" + v;
			});

			result = result.replace( regex.and, "?" );
		}

		return result;
	},

	/**
	 * Returns the size of the Object
	 *
	 * @method size
	 * @param  {Mixed} obj Element
	 * @return {Object}    Size {height: n, width:n}
	 */
	size : function ( obj ) {
		var parse = function ( arg ) {
			return number.parse(arg, 10);
		};

		return {
			height : obj.offsetHeight + parse( obj.style.paddingTop  || 0 ) + parse( obj.style.paddingBottom || 0 ) + parse( obj.style.borderTop  || 0 ) + parse( obj.style.borderBottom || 0 ),
			width  : obj.offsetWidth  + parse( obj.style.paddingLeft || 0 ) + parse( obj.style.paddingRight  || 0 ) + parse( obj.style.borderLeft || 0 ) + parse( obj.style.borderRight  || 0 )
		};
	},

	/**
	 * Getter / setter for an Element's text
	 *
	 * @method text
	 * @param  {Object} obj Element
	 * @param  {String} arg [Optional] Value to set
	 * @return {Object}     Element
	 */
	text : function ( obj, arg ) {
		var key     = obj.textContent !== undefined ? "textContent" : "innerText",
		    payload = {},
		    set     = false;

		if ( typeof arg !== "undefined" ) {
			set          = true;
			payload[key] = arg;
		}

		return set ? element.update( obj, payload ) : obj[key];
	},

	/**
	 * Toggles a CSS class
	 *
	 * @method toggleClass
	 * @param  {Object} obj Element, or $ query
	 * @param  {String} arg CSS class to toggle
	 * @return {Object}     Element
	 */
	toggleClass : function ( obj, arg ) {
		obj.classList.toggle( arg );

		return obj;
	},

	/**
	 * Updates an Element
	 *
	 * @method update
	 * @param  {Mixed}  obj  Element
	 * @param  {Object} args Collection of properties
	 * @return {Object}      Element
	 */
	update : function ( obj, args ) {
		args = args || {};

		utility.iterate( args, function ( v, k ) {
			if ( regex.element_update.test( k ) ) {
				obj[k] = v;
			}
			else if ( k === "class" ) {
				!string.isEmpty( v ) ? element.klass( obj, v ) : element.klass( obj, "*", false );
			}
			else if ( k.indexOf( "data-" ) === 0 ) {
				element.data( obj, k.replace( "data-", "" ), v );
			}
			else if ( k === "id" ) {
				var o = observer.listeners;

				if ( o[obj.id] !== undefined ) {
					o[k] = o[obj.id];
					delete o[obj.id];
				}
			}
			else {
				element.attr ( obj, k, v );
			}
		});

		return obj;
	},

	/**
	 * Gets or sets the value of Element
	 *
	 * @method val
	 * @param  {Mixed}  obj   Element
	 * @param  {Mixed}  value [Optional] Value to set
	 * @return {Object}       Element
	 */
	val : function ( obj, value ) {
		var event = "input",
		    output;

		if ( value === undefined ) {
			if ( regex.radio_checkbox.test( obj.type ) ) {
				if ( string.isEmpty( obj.name ) ) {
					throw new Error( label.error.expectedProperty );
				}

				array.each( utility.$( "input[name='" + obj.name + "']" ), function ( i ) {
					if ( i.checked ) {
						output = i.value;
						return false;
					}
				});
			}
			else if ( regex.select.test( obj.type ) ) {
				output = obj.options[obj.selectedIndex].value;
			}
			else if ( "value" in obj ) {
				output = obj.value;
			}
			else {
				output = element.text( obj );
			}

			if ( output !== undefined ) {
				output = utility.coerce( output );
			}

			if ( typeof output === "string" ) {
				output = string.trim( output );
			}
		}
		else {
			value = value.toString();

			if ( regex.radio_checkbox.test( obj.type ) ) {
				event = "click";

				array.each( utility.$( "input[name='" + obj.name + "']" ), function ( i ) {
					if ( i.value === value ) {
						i.checked = true;
						output = i;
						return false;
					}
				});
			}
			else if ( regex.select.test( obj.type ) ) {
				event = "change";

				array.each( element.find( obj, "> *" ), function ( i ) {
					if ( i.value === value ) {
						i.selected = true;
						output = i;
						return false;
					}
				});
			}
			else {
				obj.value !== undefined ? obj.value = value : element.text( obj, value );
			}

			element.dispatch( obj, event );

			output = obj;
		}

		return output;
	},

	/**
	 * Validates the contents of Element
	 *
	 * @method validate
	 * @param  {Object} obj Element to test
	 * @return {Object}     Result of test
	 */
	validate : function ( obj ) {
		return obj.nodeName === "FORM" ? validate.test( obj ) : !string.isEmpty( obj.value || element.text( obj ) );
	}
};

/**
 * DataListFilter factory
 *
 * @method factory
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist Data list linked to the data store
 * @param  {String} filters  Comma delimited string of fields to filter by
 * @param  {Number} debounce [Optional] Milliseconds to debounce
 * @return {Object}          DataListFilter instance
 */
var filter = function ( obj, datalist, filters, debounce ) {
	debounce = debounce || 250;
	var ref  = [datalist];

	if ( !( obj instanceof Element ) || ( datalist !== undefined && datalist.store === undefined ) || ( typeof filters !== "string" || string.isEmpty( filters ) ) ) {
		throw new Error( label.error.invalidArguments );
	}

	return new DataListFilter( obj, ref[0], debounce ).set( filters ).init();
};

/**
 * DataListFilter
 *
 * @constructor
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist Data list linked to the data store
 * @param  {Number} debounce [Optional] Milliseconds to debounce
 */
function DataListFilter ( element, datalist, debounce ) {
	this.element  = element;
	this.datalist = datalist;
	this.debounce = debounce;
	this.filters  = {};
}

// Setting constructor loop
DataListFilter.prototype.constructor = DataListFilter;

/**
 * Initiate all event listeners
 *
 * @method init
 * @return {Object} DataListFilter instance
 */
DataListFilter.prototype.init = function () {
	observer.add( this.element, "keyup", this.update, "filter", this );
	observer.add( this.element, "input", this.update, "value",  this );

	return this;
};

/**
 * Set the filters
 *
 * Create an object based on comma separated key string
 *
 * @method set
 * @param  {String} fields Comma separated filters
 * @return {Object}        DataListFilter instance
 */
DataListFilter.prototype.set = function ( fields ) {
	var obj = {};

	array.each( string.explode( fields ), function ( v ) {
		obj[v] = "";
	});

	this.filters = obj;

	return this;
};

/**
 * Cancel all event listeners
 *
 * @method teardown
 * @return {Object} DataListFilter instance
 */
DataListFilter.prototype.teardown = function () {
	observer.remove( this.element, "keyup", "filter" );
	observer.remove( this.element, "input", "value" );

	return this;
};

/**
 * Update the results list
 *
 * @method update
 * @return {Object} DataListFilter instance
 */
DataListFilter.prototype.update = function () {
	var self = this;

	utility.defer( function () {
		var val = element.val( self.element ).toString();
		
		if ( !string.isEmpty( val ) ) {
			utility.iterate( self.filters, function ( v, k ) {
				var queries = string.explode( val );

				// Ignoring trailing commas
				queries = queries.filter( function ( i ) {
					return !string.isEmpty( i );
				});

				// Shaping valid pattern
				array.each( queries, function ( i, idx ) {
					this[idx] = "^.*" + string.escape( i ).replace( /(^\*|\*$)/g, "" ).replace( /\*/g, ".*" ) + ".*";
				});

				this[k] = queries.join( "," );
			});

			self.datalist.filter = self.filters;
		}
		else {
			self.datalist.filter = null;
		}

		self.datalist.pageIndex = 1;
		self.datalist.refresh( true, true );
	}, this.debounce, this.element.id + "Debounce");

	return this;
};

/**
 * DataGrid factory
 *
 * @method grid
 * @param  {Object}  element     Element to receive DataGrid
 * @param  {Object}  store       DataStore
 * @param  {Array}   fields      Array of fields to display
 * @param  {Array}   sortable    [Optional] Array of sortable columns/fields
 * @param  {Object}  options     [Optional] DataList options
 * @param  {Boolean} filtered    [Optional] Create an input to filter the data grid
 * @param  {Number}  debounce    [Optional] DataListFilter input debounce, default is 250
 * @return {Object}              DataGrid instance
 */
var grid = function ( element, store, fields, sortable, options, filtered, debounce ) {
	var ref = [store];

	return new DataGrid( element, ref[0], fields, sortable, options, filtered ).init( debounce );
};

/**
 * DataGrid factory
 *
 * @constructor
 * @param  {Object}  element  Element to receive DataGrid
 * @param  {Object}  store    DataStore
 * @param  {Array}   fields   Array of fields to display
 * @param  {Array}   sortable [Optional] Array of sortable columns/fields
 * @param  {Object}  options  [Optional] DataList options
 * @param  {Boolean} filtered [Optional] Create an input to filter the DataGrid
 */
function DataGrid ( element, store, fields, sortable, options, filtered ) {
	var sortOrder;

	if ( options.order && !string.isEmpty( options.order ) ) {
		sortOrder = string.explode( options.order ).map( function ( i ) {
			return i.replace( regex.after_space, "" );
		});
	}

	this.element     = element;
	this.fields      = fields;
	this.filter      = null;
	this.filtered    = ( filtered === true );
	this.initialized = false;
	this.list        = null;
	this.options     = options   || {};
	this.store       = store;
	this.sortable    = sortable  || [];
	this.sortOrder   = sortOrder || sortable || [];
}

// Setting constructor loop
DataGrid.prototype.constructor = DataGrid;

/**
 * Exports data grid records
 *
 * @method dump
 * @return {Array} Record set
 */
DataGrid.prototype.dump = function () {
	return this.store.dump( this.list.records, this.fields );
};

/**
 * Initializes DataGrid
 *
 * @method init
 * @param  {Number} debounce [Optional] Debounce value for DataListFilter, defaults to 250
 * @return {Object}          DataGrid instance
 */
DataGrid.prototype.init = function ( debounce ) {
	var self, ref, template, container, header, width, css, sort;

	if ( !this.initialized ) {
		self      = this;
		ref       = [];
		template  = "";
		container = element.create( "section", {"class": "grid"}, this.element );
		header    = element.create( "li", {}, element.create( "ul", {"class": "header"}, container ) );
		width     = ( 100 / this.fields.length ) + "%";
		css       = "display:inline-block;width:" + width;
		sort      = this.options.order ? string.explode( this.options.order ) : [];

		// Creating DataList template based on fields
		array.each( this.fields, function ( i ) {
			var trimmed =  i.replace( /.*\./g, "" ),
			    obj     = element.create( "span", {innerHTML: string.capitalize( string.unCamelCase( string.unhyphenate( trimmed, true ) ), true ), style: css, "class": trimmed, "data-field": i}, header );

			// Adding CSS class if "column" is sortable
			if ( self.sortable.contains( i ) ) {
				element.klass( obj, "sortable", true );

				// Applying default sort, if specified
				if ( sort.filter( function ( x ) { return ( x.indexOf( i ) === 0 ); } ).length > 0 ) {
					element.data( obj, "sort", array.contains( sort, i + " desc" ) ? "desc" : "asc" );
				}
			}

			template += "<span class=\"" + i + "\" data-field=\"" + i + "\" style=\"" + css + "\">{{" + i + "}}</span>";
		});

		// Setting click handler on sortable "columns"
		if ( this.sortable.length > 0 ) {
			observer.add( header, "click", this.sort, "sort", this );
		}

		// Creating DataList
		ref.push( datalist.factory( container, this.store, template, this.options ) );

		// Setting by-reference DataList on DataGrid
		this.list = ref[0];

		if ( this.filtered === true ) {
			// Creating DataListFilter
			ref.push( filter( element.create( "input", {"class": "filter"}, container, "first" ), ref[0], this.fields.join( "," ), debounce || 250 ) );
			
			// Setting by-reference DataListFilter on DataGrid
			this.filter = ref[1];
		}

		this.initialized = true;
	}

	return this;
};

/**
 * Refreshes the DataGrid
 *
 * @method refresh
 * @return {Object} DataGrid instance
 */
DataGrid.prototype.refresh = function () {
	var sort = [],
	    self = this;

	if ( this.sortOrder.length > 0 ) {
		array.each( this.sortOrder, function ( i ) {
			var obj = element.find( self.element, ".header span[data-field='" + i + "']" )[0];

			sort.push( string.trim( i + " " + ( element.data( obj, "sort" ) || "" ) ) );
		});

		this.options.order = this.list.order = sort.join( ", " );
	}

	this.list.where = null;
	utility.merge( this.list, this.options );

	this.list.refresh( true, true );

	return this;
};

/**
 * Sorts the DataGrid when a column header is clicked
 *
 * @method sort
 * @param  {Object} e Event
 * @return {Object}   DataGrid instance
 */
DataGrid.prototype.sort = function ( e ) {
	var target = utility.target( e ),
	    field;

	// Stopping event propogation
	utility.stop( e );

	// Refreshing list if target is sortable
	if ( element.hasClass( target, "sortable" ) ) {
		field = element.data( target, "field" );

		element.data( target, "sort", element.data( target, "sort" ) === "asc" ? "desc" : "asc" );
		array.remove( this.sortOrder, field );
		this.sortOrder.splice( 0, 0, field );
		this.refresh();
	}

	return this;
};

/**
 * Tears down the DataGrid
 *
 * @method teardown
 * @return {Object} DataGrid instance
 */
DataGrid.prototype.teardown = function () {
	if ( this.filter !== null ) {
		this.filter.teardown();
	}

	this.list.teardown();

	// Removing click handler on DataGrid header
	observer.remove( element.find( this.element, ".header" )[0], "click", "sort" );

	// Destroying DataGrid (from DOM)
	element.destroy( element.find( this.element, ".grid" )[0] );

	return this;
};

/** @namespace json */
var json = {
	/**
	 * Transforms JSON to CSV
	 *
	 * @method csv
	 * @param  {String}  arg JSON  string to transform
	 * @param  {String}  delimiter [Optional] Character to separate fields
	 * @param  {Boolean} header    [Optional] False to not include field names as first row
	 * @return {String}            CSV string
	 */
	csv : function ( arg, delimiter, header ) {
		delimiter  = delimiter || ",";
		header     = ( header !== false );
		var obj    = json.decode( arg, true ) || arg,
		    result = "",
		    prepare;

		// Prepares input based on CSV rules
		prepare = function ( input ) {
			var output;

			if ( input instanceof Array ) {
				output = "\"" + input.toString() + "\"";

				if ( regex.object_type.test( output ) ) {
					output = "\"" + json.csv( input, delimiter ) + "\"";
				}
			}
			else if ( input instanceof Object ) {
				output = "\"" + json.csv( input, delimiter ) + "\"";
			}
			else if ( regex.csv_quote.test( input ) ) {
				output = "\"" + input.replace( /"/g, "\"\"" ) + "\"";
			}
			else {
				output = input;
			}

			return output;
		};

		if ( obj instanceof Array ) {
			if ( obj[0] instanceof Object ) {
				if ( header ) {
					result = ( array.keys( obj[0] ).join( delimiter ) + "\n" );
				}

				result += obj.map( function ( i ) {
					return json.csv( i, delimiter, false );
				}).join( "\n" );
			}
			else {
				result += ( prepare( obj, delimiter ) + "\n" );
			}

		}
		else {
			if ( header ) {
				result = ( array.keys( obj ).join( delimiter ) + "\n" );
			}

			result += ( array.cast( obj ).map( prepare ).join( delimiter ) + "\n" );
		}

		return result.replace(/\n$/, "");
	},

	/**
	 * Decodes the argument
	 *
	 * @method decode
	 * @param  {String}  arg    String to parse
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {Mixed}          Entity resulting from parsing JSON, or undefined
	 */
	decode : function ( arg, silent ) {
		try {
			return JSON.parse( arg );
		}
		catch ( e ) {
			if ( silent !== true ) {
				utility.error( e, arguments, this );
			}

			return undefined;
		}
	},

	/**
	 * Encodes the argument as JSON
	 *
	 * @method encode
	 * @param  {Mixed}   arg    Entity to encode
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {String}         JSON, or undefined
	 */
	encode : function ( arg, silent ) {
		try {
			return JSON.stringify( arg );
		}
		catch ( e ) {
			if ( silent !== true) {
				utility.error( e, arguments, this );
			}

			return undefined;
		}
	}
};

/** @namespace label */
var label = {
	// Common labels
	common : {
		back        : "Back",
		cancel      : "Cancel",
		clear       : "Clear",
		close       : "Close",
		cont        : "Continue",
		create	    : "Create",
		customRange : "Custom Range",
		del         : "Delete",
		edit        : "Edit",
		find        : "Find",
		from        : "From",
		gen         : "Generate",
		go          : "Go",
		loading     : "Loading",
		next        : "Next",
		login       : "Login",
		ran         : "Random",
		reset       : "Reset",
		save        : "Save",
		search      : "Search",
		submit      : "Submit",
		to          : "To",
		today       : "Today",
		yesterday   : "Yesterday"
	},

	// Days of the week
	day : {
		0 : "Sunday",
		1 : "Monday",
		2 : "Tuesday",
		3 : "Wednesday",
		4 : "Thursday",
		5 : "Friday",
		6 : "Saturday"
	},

	// Error messages
	error : {
		databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
		databaseNotSupported  : "Client does not support local database storage",
		databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
		databaseMoreThanOne   : "More than one match found",
		elementNotCreated     : "Could not create the Element",
		elementNotFound       : "Could not find the Element",
		expectedArray         : "Expected an Array",
		expectedArrayObject   : "Expected an Array or Object",
		expectedBoolean       : "Expected a Boolean value",
		expectedNumber        : "Expected a Number",
		expectedProperty      : "Expected a property, and it was not set",
		expectedObject        : "Expected an Object",
		invalidArguments      : "One or more arguments is invalid",
		invalidDate           : "Invalid Date",
		invalidFields         : "The following required fields are invalid: ",
		invalidRoute          : "The route could not be found",
		invalidStateNoHeaders : "INVALID_STATE_ERR: Headers have not been received",
		invalidStateNoSync    : "Synchronous XMLHttpRequest requests are not supported",
		invalidStateNotOpen   : "INVALID_STATE_ERR: Object is not open",
		invalidStateNotSending: "INVALID_STATE_ERR: Object is sending",
		invalidStateNotUsable : "INVALID_STATE_ERR: Object is not usable",
		notAvailable          : "Requested method is not available",
		notSupported          : "This feature is not supported by this platform",
		propertyNotFound      : "Could not find the requested property",
		promisePending        : "The promise cannot be resolved while pending result",
		promiseResolved       : "The promise has been resolved: {{outcome}}",
		serverError           : "Server error has occurred",
		serverForbidden       : "Forbidden to access URI",
		serverInvalidMethod   : "Method not allowed",
		serverUnauthorized    : "Authorization required to access URI",
		readOnly              : "Property is read only",
		upgrade               : "Your browser is too old to use abaaso, please upgrade"
	},

	// Months of the Year
	month : {
		0  : "January",
		1  : "February",
		2  : "March",
		3  : "April",
		4  : "May",
		5  : "June",
		6  : "July",
		7  : "August",
		8  : "September",
		9  : "October",
		10 : "November",
		11 : "December"
	}
};

/**
 * LRU factory
 *
 * @method lru
 * @param  {Number} max [Optional] Max size of cache, default is 1000
 * @return {Object}     LRU instance
 */
var lru = function ( max ) {
	return new LRU( max );
};

/**
 * Least Recently Used cache
 *
 * @constructor
 * @param  {Number} max [Optional] Max size of cache, default is 1000
 */
function LRU ( max ) {
	this.cache  = {};
	this.max    = max || 1000;
	this.first  = null;
	this.last   = null;
	this.length = 0;
}

// Setting constructor loop
LRU.prototype.constructor = LRU;

/**
 * Evicts the least recently used item from cache
 *
 * @method evict
 * @return {Object} LRU instance
 */
LRU.prototype.evict = function () {
	if ( this.last !== null ) {
		this.remove( this.last );
	}

	return this;
};

/**
 * Gets cached item and moves it to the front
 *
 * @method get
 * @param  {String} key Item key
 * @return {Mixed}      Undefined or Item value
 */
LRU.prototype.get = function ( key ) {
	var item = this.cache[key];

	if ( item === undefined ) {
		return;
	}

	this.set( key, item.value );

	return item.value;
};

/**
 * Removes item from cache
 *
 * @method remove
 * @param  {String} key Item key
 * @return {Object}     LRUItem instance
 */
LRU.prototype.remove = function ( key ) {
	var item = this.cache[ key ];

	if ( item !== undefined ) {
		delete this.cache[key];

		this.length--;

		if ( item.previous !== null ) {
			this.cache[item.previous].next = item.next;
		}

		if ( item.next !== null ) {
			this.cache[item.next].previous = item.previous;
		}

		if ( this.first === key ) {
			this.first = item.previous;
		}

		if ( this.last === key ) {
			this.last = item.next;
		}
	}

	return item;
};

/**
 * Sets item in cache as `first`
 *
 * @method set
 * @param  {String} key   Item key
 * @param  {Mixed}  value Item value
 * @return {Object}       LRU instance
 */
LRU.prototype.set = function ( key, value ) {
	var item = this.remove( key );

	if ( item === undefined ) {
		item = new LRUItem( value );
	}
	else {
		item.value = value;
	}

	item.next       = null;
	item.previous   = this.first;
	this.cache[key] = item;

	if ( this.first !== null ) {
		this.cache[this.first].next = key;
	}

	this.first = key;

	if ( this.last === null ) {
		this.last = key;
	}

	if ( ++this.length > this.max ) {
		this.evict();
	}

	return this;
};

/**
 * LRU Item factory
 *
 * @constructor
 * @param {Mixed} value Item value
 */
function LRUItem ( value ) {
	this.next     = null;
	this.previous = null;
	this.value    = value;
}

// Setting prototype & constructor loop
LRUItem.prototype.constructor = LRUItem;

/** @namespace map */
var math = {
	/**
	 * Generates bezier curve coordinates for up to 4 points, last parameter is `t`
	 *
	 * Two point example: (0, 10, 0, 0, 1) means move straight up
	 *
	 * @method bezier
	 * @return {Array} Coordinates
	 */
	bezier : function () {
		var a = array.cast( arguments ),
		    t = a.pop(),
		    P = array.chunk( a, 2 ),
		    n = P.length,
		    c, S0, Q0, Q1, Q2, C0, C1, C2, C3;

		if ( n < 2 || n > 4 ) {
			throw new Error( label.error.invalidArguments );
		}

		// Setting variables
		c  = [];
		S0 = 1 - t;
		Q0 = math.sqr( S0 );
		Q1 = 2 * S0 * t;
		Q2 = math.sqr( t );
		C0 = Math.pow( S0, 3 );
		C1 = 3 * Q0 * t;
		C2 = 3 * S0 * Q2;
		C3 = Math.pow( t, 3 );

		// Straight
		if ( n === 2 ) {
			c.push( ( S0 * P[0][0] ) + ( t * P[1][0] ) );
			c.push( ( S0 * P[0][1] ) + ( t * P[1][1] ) );
		}
		// Quadratic
		else if ( n === 3 ) {
			c.push( ( Q0 * P[0][0] ) + ( Q1 * P[1][0] ) + ( Q2 + P[2][0] ) );
			c.push( ( Q0 * P[0][1] ) + ( Q1 * P[1][1] ) + ( Q2 + P[2][1] ) );
		}
		// Cubic
		else if ( n === 4 ) {
			c.push( ( C0 * P[0][0] ) + ( C1 * P[1][0] ) + ( C2 * P[2][0] ) + ( C3 * P[3][0] ) );
			c.push( ( C0 * P[0][1] ) + ( C1 * P[1][1] ) + ( C2 * P[2][1] ) + ( C3 * P[3][1] ) );
		}

		return c;
	},

	/**
	 * Finds the distance between 2 Arrays of coordinates
	 *
	 * @method dist
	 * @param  {Array} a Coordinates [x, y]
	 * @param  {Array} b Coordinates [x, y]
	 * @return {Number}  Distance between `a` & `b`
	 */
	dist : function ( a, b ) {
		return Math.sqrt( math.sqr( b[0] - a[0] ) + math.sqr( b[1] - a[1] ) );
	},

	/**
	 * Squares a Number
	 *
	 * @method sqr
	 * @param  {Number} n Number to square
	 * @return {Number}   Squared value
	 */
	sqr : function ( n ) {
		return n * n;
	}
};

/** @namespace message */
var message = {
	/**
	 * Clears the message listener
	 *
	 * @method clear
	 * @return {Object} abaaso
	 */
	clear : function ( state ) {
		state = state || "all";

		return observer.remove( global, "message", "message", state );
	},

	/**
	 * Posts a message to the target
	 *
	 * @method send
	 * @param  {Object} target Object to receive message
	 * @param  {Mixed}  arg    Entity to send as message
	 * @return {Object}        target
	 */
	send : function ( target, arg ) {
		try {
			target.postMessage( arg, "*" );
		}
		catch ( e ) {
			utility.error( e, arguments, this );
		}

		return target;
	},

	/**
	 * Sets a handler for recieving a message
	 *
	 * @method recv
	 * @param  {Function} fn Callback function
	 * @return {Object}      abaaso
	 */
	recv : function ( fn, state ) {
		state = state || "all";

		return observer.add( global, "message", fn, "message", global, state );
	}
};

/** @namespace mouse */
var mouse = {
	//Indicates whether mouse tracking is enabled
	enabled : false,

	// Indicates whether to try logging co-ordinates to the console
	log : false,

	// Mouse coordinates
	diff : {x: null, y: null},
	pos  : {x: null, y: null},
	prev : {x: null, y: null},

	// Caching the view
	view    : function () {
		return client.ie && client.version < 9 ? "documentElement" : "body";
	},

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @param  {Mixed} arg Boolean to enable/disable tracking, or Mouse Event
	 * @return {Object}    $.mouse
	 */
	track : function ( arg ) {
		var type = typeof arg;

		if ( type === "object" ) {
			var v = document[mouse.view],
			    x = arg.pageX ? arg.pageX : ( v.scrollLeft + arg.clientX ),
			    y = arg.pageY ? arg.pageY : ( v.scrollTop  + arg.clientY ),
			    c = false;

			if ( mouse.pos.x !== x ) {
				c = true;
			}

			$.mouse.prev.x = mouse.prev.x = number.parse( mouse.pos.x, 10 );
			$.mouse.pos.x  = mouse.pos.x  = x;
			$.mouse.diff.x = mouse.diff.x = mouse.pos.x - mouse.prev.x;

			if ( mouse.pos.y !== y ) {
				c = true;
			}

			$.mouse.prev.y = mouse.prev.y = number.parse( mouse.pos.y, 10 );
			$.mouse.pos.y  = mouse.pos.y  = y;
			$.mouse.diff.y = mouse.diff.y = mouse.pos.y - mouse.prev.y;

			if ( c && $.mouse.log ) {
				utility.log( [mouse.pos.x, mouse.pos.y, mouse.diff.x, mouse.diff.y] );
			}
		}
		else if ( type === "boolean" ) {
			arg ? observer.add( document, "mousemove", mouse.track, "tracking" ) : observer.remove( document, "mousemove", "tracking" );
			$.mouse.enabled = mouse.enabled = arg;
		}

		return $.mouse;
	}
};

/** @namespace number */
var number = {
	/**
	 * Returns the difference of arg
	 *
	 * @method odd
	 * @param {Number} arg Number to compare
	 * @return {Number}    The absolute difference
	 */
	diff : function ( num1, num2 ) {
		if ( isNaN( num1 ) || isNaN( num2 ) ) {
			throw new Error( label.error.expectedNumber );
		}

		return Math.abs( num1 - num2 );
	},

	/**
	 * Tests if an number is even
	 *
	 * @method even
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if even, or undefined
	 */
	even : function ( arg ) {
		return arg % 2 === 0;
	},

	/**
	 * Formats a Number to a delimited String
	 *
	 * @method format
	 * @param  {Number} arg       Number to format
	 * @param  {String} delimiter [Optional] String to delimit the Number with
	 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
	 * @return {String}           Number represented as a comma delimited String
	 */
	format : function ( arg, delimiter, every ) {
		if ( isNaN( arg ) ) {
			throw new Error( label.error.expectedNumber );
		}

		arg       = arg.toString();
		delimiter = delimiter || ",";
		every     = every     || 3;

		var d = arg.indexOf( "." ) > -1 ? "." + arg.replace( regex.number_format_1, "" ) : "",
		    a = arg.replace( regex.number_format_2, "" ).split( "" ).reverse(),
		    p = Math.floor( a.length / every ),
		    i = 1, n, b;

		for ( b = 0; b < p; b++ ) {
			n = i === 1 ? every : ( every * i ) + ( i === 2 ? 1 : ( i - 1 ) );
			a.splice( n, 0, delimiter );
			i++;
		}

		a = a.reverse().join( "" );

		if ( a.charAt( 0 ) === delimiter ) {
			a = a.substring( 1 );
		}

		return a + d;
	},

	/**
	 * Returns half of a, or true if a is half of b
	 *
	 * @method half
	 * @param  {Number} a Number to divide
	 * @param  {Number} b [Optional] Number to test a against
	 * @return {Mixed}    Boolean if b is passed, Number if b is undefined
	 */
	half : function ( a, b ) {
		return b !== undefined ? ( ( a / b ) === 0.5 ) : ( a / 2 );
	},

	/**
	 * Tests if a number is odd
	 *
	 * @method odd
	 * @public
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if odd, or undefined
	 */
	odd : function ( arg ) {
		return !number.even( arg );
	},

	/**
	 * Parses the number
	 *
	 * @method parse
	 * @param  {Mixed}  arg  Number to parse
	 * @param  {Number} base Integer representing the base or radix
	 * @return {Number}      Integer or float
	 */
	parse : function ( arg, base ) {
		return ( base === undefined ) ? parseFloat( arg ) : parseInt( arg, base );
	},

	/**
	 * Generates a random number between 0 and arg
	 *
	 * @method random
	 * @param  {Number} arg Ceiling for random number, default is 100
	 * @return {Number}     Random number
	 */
	random : function ( arg ) {
		arg = arg || 100;

		return Math.floor( Math.random() * ( arg + 1 ) );
	},

	/**
	 * Rounds a number up or down
	 *
	 * @method round
	 * @param  {Number} arg       Number to round
	 * @param  {String} direction [Optional] "up" or "down"
	 * @return {Number}           Rounded interger
	 */
	round : function ( arg, direction ) {
		arg = number.parse( arg );

		if ( direction === undefined || string.isEmpty( direction ) ) {
			return number.parse( arg.toFixed( 0 ) );
		}
		else if ( regex.down.test( direction ) ) {
			return ~~( arg );
		}
		else {
			return Math.ceil( arg );
		}
	}
};

/** @namespace observer */
var observer = {
	/**
	 * Collection of listeners
	 *
	 * @type {Object}
	 */
	listeners  : {},

	/**
	 * Array copy of listeners for observer.fire()
	 *
	 * @type {Object}
	 */
	alisteners : {},

	/**
	 * Event listeners
	 *
	 * @type {Object}
	 */
	elisteners : {},

	/**
	 * Tracks count of listeners per event across all states
	 *
	 * @type {Object}
	 */
	clisteners : {},

	/**
	 * Boolean indicating if events are logged to the console
	 *
	 * @type {Boolean}
	 */
	log : false,

	/**
	 * Queue of events to fire
	 *
	 * @type {Array}
	 */
	queue : [],

	/**
	 * If `true`, events are queued
	 *
	 * @type {Boolean}
	 */
	silent : false,

	/**
	 * If `true`, events are ignored
	 *
	 * @type {Boolean}
	 */
	ignore : false,

	/**
	 * Adds a handler to an event
	 *
	 * @method add
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Event, or Events being fired ( comma delimited supported )
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	add : function ( obj, event, fn, id, scope, st ) {
		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( event !== undefined ) {
			event = string.explode( event );
		}

		id = id || utility.genId();

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    ev       = observer.elisteners,
		    cl       = observer.clisteners,
		    gr       = regex.observer_globals,
		    ar       = regex.observer_allowed,
		    o        = observer.id( obj ),
		    add, reg;

		if ( o === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( l[o] === undefined ) {
			l[o]  = {};
			a[o]  = {};
			cl[o] = {};
		}

		array.each( event, function ( i ) {
			var eid = o + "_" + i;

			if ( l[o][i] === undefined ) {
				l[o][i]  = {};
				a[o][i]  = {};
				cl[o][i] = 0;
			}

			if ( l[o][i][st] === undefined ) {
				l[o][i][st] = {};
				a[o][i][st] = [];
			}

			instance = ( gr.test( o ) || (!/\//g.test( o ) && o !== "abaaso" ) ) ? obj : null;

			// Setting up event listener if valid
			if ( instance !== null && instance !== undefined && i.toLowerCase() !== "afterjsonp" && ev[eid] === undefined && ( gr.test( o ) || typeof instance.listeners === "function" ) ) {
				add = ( typeof instance.addEventListener === "function" );
				reg = ( typeof instance.attachEvent === "object" || add );

				if ( reg ) {
					// Registering event listener
					ev[eid] = function ( e ) {
						if ( !ar.test( e.type ) ) {
							utility.stop( e );
						}

						observer.fire( obj, i, e );
					};

					// Hooking event listener
					instance[add ? "addEventListener" : "attachEvent"]( ( add ? "" : "on" ) + i, ev[eid], false );
				}
			}

			l[o][i][st][id] = {fn: fn, scope: scope};
			observer.sync( o, i, st );
			cl[o][i]++;
		});

		return obj;
	},

	/**
	 * Decorates `obj` with `observer` methods
	 *
	 * @method decorate
	 * @param  {Object} obj Object to decorate
	 * @return {Object}     Object to decorate
	 */
	decorate : function ( obj ) {
		var methods = [
			["fire",      function () { return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) ); }],
			["listeners", function ( event ) { return observer.list(this, event ); }],
			["on",        function ( event, listener, id, scope, standby ) { return observer.add( this, event, listener, id, scope, standby ); }],
			["once",      function ( event, listener, id, scope, standby ) { return observer.once( this, event, listener, id, scope, standby ); }],
			["un",        function ( event, id ) { return observer.remove( this, event, id ); }]
		];

		array.each( methods, function ( i ) {
			utility.property( obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Discard observer events
	 *
	 * @method discard
	 * @param  {Boolean} arg [Optional] Boolean indicating if events will be ignored
	 * @return {Boolean}     Current setting
	 */
	discard : function ( arg ) {
		return arg === undefined ? observer.ignore : ( observer.ignore = ( arg === true ) );
	},

	/**
	 * Fires an event
	 *
	 * @method fire
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event Event, or Events being fired ( comma delimited supported )
	 * @return {Mixed}        Primitive
	 */
	fire : function ( obj, event ) {
		var quit = false,
		    a    = array.remove( array.cast( arguments ), 0, 1 ),
		    o, s, log, list;

		if ( observer.ignore ) {
			return obj;
		}

		o = observer.id( obj );

		if ( o === undefined || event === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( observer.silent ) {
			observer.queue.push( {obj: obj, event: event} );
		}
		else {
			s   = state.getCurrent();
			log = $.logging;

			array.each( string.explode( event ), function ( e ) {
				if ( log ) {
					utility.log(o + " firing " + e );
				}

				list = observer.list( obj, e, observer.alisteners );

				if ( list.all !== undefined ) {
					array.each( list.all, function ( i ) {
						var result = i.fn.apply( i.scope, a );

						if ( result === false ) {
							quit = true;

							return result;
						}
					});
				}

				if ( !quit && s !== "all" && list[s] !== undefined ) {
					array.each( list[s], function ( i ) {
						return i.fn.apply( i.scope, a );
					});
				}
			});
		}

		return obj;
	},

	/**
	 * Gets the Observer id of arg
	 *
	 * @method id
	 * @param  {Mixed}  Object or String
	 * @return {String} Observer id
	 */
	id : function ( arg ) {
		var id;

		if ( arg === global ) {
			id = "window";
		}
		else if ( !server && arg === document ) {
			id = "document";
		}
		else if ( !server && arg === document.body ) {
			id = "body";
		}
		else {
			utility.genId( arg );
			id = arg.id || ( typeof arg.toString === "function" ? arg.toString() : arg );
		}

		return id;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @param  {Mixed}  obj    Primitive
	 * @param  {String} event  Event being queried
	 * @param  {Object} target [Optional] Listeners collection to access, default is `observer.listeners`
	 * @return {Mixed}         Primitive
	 */
	list : function ( obj, event, target ) {
		var l = target || observer.listeners,
		    o = observer.id( obj ),
		    r;

		if ( l[o] === undefined && event === undefined ) {
			r = {};
		}
		else if ( l[o] !== undefined && ( event === undefined || string.isEmpty( event ) ) ) {
			r = l[o];
		}
		else if ( l[o] !== undefined && l[o][event] !== undefined ) {
			r = l[o][event];
		}
		else {
			r = {};
		}

		return r;
	},

	/**
	 * Adds a listener for a single execution
	 *
	 * @method once
	 * @param  {Mixed}    obj   Primitive
	 * @param  {String}   event Event being fired
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Primitive
	 */
	once : function ( obj, event, fn, id, scope, st ) {
		var uuid = id || utility.genId();

		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( obj === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw new Error( label.error.invalidArguments );
		}

		observer.add( obj, event, function () {
			fn.apply( scope, arguments );
			observer.remove( obj, event, uuid, st );
		}, uuid, scope, st);

		return obj;
	},

	/**
	 * Pauses observer events, and queues them
	 *
	 * @method pause
	 * @param  {Boolean} arg Boolean indicating if events will be queued
	 * @return {Boolean}     Current setting
	 */
	pause : function ( arg ) {
		if ( arg === true ) {
			observer.silent = arg;
		}
		else if ( arg === false ) {
			observer.silent = arg;

			array.each( observer.queue, function ( i ) {
				observer.fire( i.obj, i.event );
			});

			observer.queue = [];
		}

		return arg;
	},

	/**
	 * Removes listeners
	 *
	 * @method remove
	 * @param  {Mixed}  obj   Primitive
	 * @param  {String} event [Optional] Event, or Events being fired ( comma delimited supported )
	 * @param  {String} id    [Optional] Listener id
	 * @param  {String} st    [Optional] Application state, default is current
	 * @return {Mixed}        Primitive
	 */
	remove : function ( obj, event, id, st ) {
		st = st || state.getCurrent();

		var l   = observer.listeners,
		    a   = observer.alisteners,
		    ev  = observer.elisteners,
		    cl  = observer.clisteners,
		    o   = observer.id( obj ),
		    add = ( typeof obj.addEventListener === "function" ),
		    reg = ( typeof obj.attachEvent === "object" || add ),
		    fn;

		/**
		 * Removes DOM event hook
		 *
		 * @method fn
		 * @private
		 * @param  {Mixed}  event String or null
		 * @param  {Number} i     Amount of listeners being removed
		 * @return {Undefined}    undefined
		 */
		fn = function ( event, i ) {
			var unhook = ( typeof i === "number" && ( cl[o][event] = ( cl[o][event] - i ) ) === 0 );

			if ( unhook && reg ) {
				obj[add ? "removeEventListener" : "detachEvent"]( ( add ? "" : "on" ) + event, ev[o + "_" + event], false );
				delete ev[o + "_" + event];
			}
		};

		if ( l[o] === undefined ) {
			return obj;
		}

		if ( event === undefined || event === null ) {
			if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
				utility.iterate( ev, function ( v, k ) {
					if ( k.indexOf( o + "_" ) === 0) {
						fn( k.replace( /.*_/, "" ), 1 );
					}
				});
			}

			delete l[o];
			delete a[o];
			delete cl[o];
		}
		else {
			array.each( string.explode( event ), function ( e ) {
				var sync = false;

				if ( l[o][e] === undefined ) {
					return;
				}

				if ( id === undefined ) {
					if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
						fn( e, array.keys( l[o][e][st] ).length );
					}

					l[o][e][st] = {};
					sync = true;
				}
				else if ( l[o][e][st][id] !== undefined ) {
					fn( e, 1 );
					delete l[o][e][st][id];
					sync = true;
				}

				if ( sync ) {
					observer.sync( o, e, st );
				}
			});
		}

		return obj;
	},

	/**
	 * Returns the sum of active listeners for one or all Objects
	 *
	 * @method sum
	 * @param  {Mixed} obj [Optional] Entity
	 * @return {Object}    Object with total listeners per event
	 */
	sum : function ( obj ) {
		return obj ? observer.clisteners[observer.id( obj )] : array.keys( observer.clisteners ).length;
	},

	/**
	 * Syncs `alisteners` with `listeners`
	 *
	 * @method sync
	 * @param  {String} obj   Object ID
	 * @param  {String} event Event
	 * @param  {String} st    Application state
	 * @return {Undefined}    undefined
	 */
	sync : function ( obj, event, st ) {
		observer.alisteners[obj][event][st] = array.cast( observer.listeners[obj][event][st] );
	}
};

/** @namespace promise */
var promise = {
	/**
	 * Async delay strategy
	 *
	 * @method delay
	 * @return {Function} Delay method
	 */
	delay : function () {
		if ( typeof setImmediate !== "undefined" ) {
			return setImmediate;
		}
		else if ( typeof process !== "undefined" ) {
			return process.nextTick;
		}
		else {
			return function ( arg ) {
				setTimeout( arg, 0 );
			};
		}
	}(),

	/**
	 * Promise factory
	 *
	 * @method factory
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		return new Promise();
	},

	/**
	 * Pipes a reconciliation from `parent` to `child`
	 *
	 * @method pipe
	 * @param  {Object} parent Promise
	 * @param  {Object} child  Promise
	 * @return {Undefined}     undefined
	 */
	pipe : function ( parent, child ) {
		parent.then( function ( arg ) {
			child.resolve( arg );
		}, function ( e ) {
			child.reject( e );
		});
	},

	/**
	 * Initiates processing a Promise
	 *
	 * @memberOf process
	 * @param  {Object} obj   Promise instance
	 * @param  {Mixed}  arg   Promise value
	 * @param  {Number} state State, e.g. "1"
	 * @return {Object}       Promise instance
	 */
	process : function ( obj, arg, state ) {
		if ( obj.state > promise.state.PENDING ) {
			return;
		}

		obj.value = arg;
		obj.state = state;

		if ( !obj.deferred ) {
			promise.delay( function () {
				obj.process();
			});

			obj.deferred = true;
		}

		return obj;
	},

	/**
	 * States of a Promise
	 *
	 * @type {Object}
	 */
	state : {
		PENDING : 0,
		FAILURE : 1,
		SUCCESS : 2
	}
};

/**
 * Promise
 *
 * @method Promise
 * @constructor
 * @return {Object} Promise instance
 */
function Promise () {
	this.deferred = false;
	this.handlers = [];
	this.state    = promise.state.PENDING;
	this.value    = null;
}

// Setting constructor loop
Promise.prototype.constructor = Promise;

/**
 * Processes `handlers` queue
 *
 * @method process
 * @return {Object} Promise instance
 */
Promise.prototype.process = function() {
	var result, success, value;

	this.deferred = false;

	if ( this.state === promise.state.PENDING ) {
		return;
	}

	value   = this.value;
	success = this.state === promise.state.SUCCESS;

	array.each( this.handlers.slice(), function ( i ) {
		var callback = i[success ? "success" : "failure" ],
		    child    = i.promise;

		if ( !callback || typeof callback !== "function" ) {
			if ( value && typeof value.then === "function" ) {
				promise.pipe( value, child );
			}
			else {
				if ( success ) {
					child.resolve( value );
				} else {
					child.reject( value );
				}
			}

			return;
		}

		try {
			result = callback( value );
		}
		catch ( e ) {
			utility.error( e, value, this );
			child.reject( e );

			return;
		}

		if ( result && typeof result.then === "function" ) {
			promise.pipe( result, promise );
		}
		else {
			child.resolve( result );
		}
	});

	return this;
};

/**
 * Breaks a Promise
 *
 * @method reject
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise instance
 */
Promise.prototype.reject = function ( arg ) {
	return promise.process( this, arg, promise.state.FAILURE );
};

/**
 * Resolves a Promise
 *
 * @method resolve
 * @param  {Mixed} arg Promise value
 * @return {Object}    Promise instance
 */
Promise.prototype.resolve = function ( arg ) {
	return promise.process( this, arg, promise.state.SUCCESS );
};

/**
 * Registers handler(s) for a Promise
 *
 * @method then
 * @param  {Function} success [Optional] Success handler for eventual value
 * @param  {Function} failure [Optional] Failure handler for eventual value
 * @return {Object}           New Promise instance
 */
Promise.prototype.then = function ( success, failure ) {
	var self  = this,
	    child = new Promise();

	this.handlers.push( {
		success : success,
		failure : failure,
		promise : child
	} );

	if ( this.state > promise.state.PENDING && !this.deferred ) {
		promise.delay( function () {
			self.process();
		});

		this.deferred = true;
	}

	return child;
};

/**
 * Prototype hooks
 *
 * @private
 * @type {Object}
 */
var prototypes = {
	// Array.prototype
	array : {
		add : function ( arg ) {
			return array.add( this, arg );
		},
		addClass : function ( arg ) {
			return array.each( this, function ( i ) {
				element.klass( i, arg );
			});
		},
		after : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "after" ) );
			});

			return result;
		},
		append : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "last" ) );
			});

			return result;
		},
		attr : function ( key, value ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.attr( i, key, value ) );
			});

			return result;
		},
		before : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "before" ) );
			});

			return result;
		},
		binIndex : function ( arg ) {
			return array.binIndex( this, arg );
		},
		chunk : function ( size ) {
			return array.chunk( this, size );
		},
		clear : function () {
			return !server && ( this[0] instanceof Element ) ? array.each( this, function ( i ) {
				element.clear(i);
			}) : array.clear( this );
		},
		clone : function () {
			return utility.clone( this );
		},
		collect : function ( arg ) {
			return array.collect( this, arg );
		},
		compact : function () {
			return array.compact( this );
		},
		contains : function ( arg ) {
			return array.contains( this, arg );
		},
		count : function ( arg ) {
			return array.count( this, arg );
		},
		create : function ( type, args, position ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, position ) );
			});

			return result;
		},
		css : function ( key, value ) {
			return array.each( this, function ( i ) {
				element.css( i, key, value );
			});
		},
		data : function ( key, value ) {
			var result = [];

			array.each( this, function (i) {
				result.push( element.data( i, key, value ) );
			});

			return result;
		},
		diff : function ( arg ) {
			return array.diff( this, arg );
		},
		disable : function () {
			return array.each( this, function ( i ) {
				element.disable( i );
			});
		},
		dispatch : function ( event, data, bubbles, cancelable ) {
			return array.each( this, function ( i ) {
				element.dispatch( i, event, data, bubbles, cancelable );
			});
		},
		destroy : function () {
			array.each( this, function ( i ) {
				element.destroy( i );
			});

			return [];
		},
		each : function ( arg, async, size ) {
			return array.each( this, arg, async, size );
		},
		empty : function () {
			return array.empty( this );
		},
		enable : function () {
			return array.each( this, function ( i ) {
				element.enable( i );
			});
		},
		equal : function ( arg ) {
			return array.equal( this, arg );
		},
		fib : function ( arg ) {
			return array.fib( arg );
		},
		fill : function ( arg, start, offset ) {
			return array.fill( this, arg, start, offset );
		},
		find : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				i.find( arg ).each( function ( r ) {
					result.add( r );
				});
			});

			return result;
		},
		fire : function () {
			var args = arguments;

			return array.each( this, function ( i ) {
				observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
			});
		},
		first : function () {
			return array.first( this );
		},
		flat : function () {
			return array.flat( this );
		},
		fromObject : function ( arg ) {
			return array.fromObject( arg );
		},
		genId : function () {
			return array.each( this, function ( i ) {
				utility.genId( i );
			});
		},
		get : function ( uri, headers ) {
			var result = [];

			array.each( this, function ( i, idx ) {
				i.get( uri, headers, function ( arg ) {
					result[idx] = arg;
				}, function ( e ) {
					result[idx] = e;
				});
			});

			return result;
		},
		has : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.has( i, arg ) );
			});

			return result;
		},
		hasClass : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.hasClass( i, arg ) );
			});

			return result;
		},
		html : function ( arg ) {
			var result;

			if ( arg !== undefined ) {
				return array.each( this, function ( i ) {
					element.html( i, arg );
				});
			}
			else {
				result = [];
				array.each( this, function ( i ) {
					result.push( element.html( i ) );
				});

				return result;
			}
		},
		index : function ( arg ) {
			return array.index( this, arg );
		},
		indexed : function () {
			return array.indexed( this );
		},
		intersect : function ( arg ) {
			return array.intersect( this, arg );
		},
		is : function ( arg ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.is( i, arg ) );
			});

			return result;
		},
		isAlphaNum : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isAlphaNum() );
			});

			return result;
		},
		isBoolean : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isBoolean() );
			});

			return result;
		},
		isChecked : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isChecked() );
			});

			return result;
		},
		isDate : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isDate() );
			});

			return result;
		},
		isDisabled : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.isDisabled( i ) );
			});

			return result;
		},
		isDomain : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isDomain() );
			});

			return result;
		},
		isEmail : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isEmail() );
			});

			return result;
		},
		isEmpty : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isEmpty() );
			});

			return result;
		},
		isHidden : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.isHidden( i ) );
			});

			return result;
		},
		isIP : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isIP() );
			});

			return result;
		},
		isInt : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isInt() );
			});

			return result;
		},
		isNumber : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isNumber() );
			});

			return result;
		},
		isPhone : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isPhone() );
			});

			return result;
		},
		isUrl : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( i.isUrl() );
			});

			return result;
		},
		keepIf : function ( fn ) {
			return array.keepIf( this, fn );
		},
		keySort : function ( query, sub ) {
			return array.keySort( this, query, sub );
		},
		keys : function () {
			return array.keys( this );
		},
		last : function ( arg ) {
			return array.last( this, arg );
		},
		limit : function ( start, offset ) {
			return array.limit( this, start, offset );
		},
		listeners: function ( event ) {
			var result = [];

			array.each( this, function ( i ) {
				array.merge(result, observer.listeners( i, event ) );
			});

			return result;
		},
		loading : function () {
			return array.each( this, function ( i ) {
				utility.loading( i );
			});
		},
		max : function () {
			return array.max( this );
		},
		mean : function () {
			return array.mean( this );
		},
		median : function () {
			return array.median( this );
		},
		merge : function ( arg ) {
			return array.merge( this, arg );
		},
		min : function () {
			return array.min( this );
		},
		mingle : function ( arg ) {
			return array.mingle( this, arg );
		},
		mode : function () {
			return array.mode( this );
		},
		on : function ( event, listener, id, scope, state ) {
			return array.each( this, function ( i ) {
				observer.add( i, event, listener, id, scope || i, state );
			});
		},
		once : function ( event, listener, id, scope, state ) {
			return array.each( this, function ( i ) {
				observer.once( i, event, listener, id, scope || i, state );
			});
		},
		percents : function ( precision, total ) {
			return array.percents( this, precision, total );
		},
		position : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.position( i ) );
			});

			return result;
		},
		prepend : function ( type, args ) {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.create( type, args, i, "first" ) );
			});

			return result;
		},
		range : function () {
			return array.range( this );
		},
		rassoc : function ( arg ) {
			return array.rassoc( this, arg );
		},
		reject : function ( fn ) {
			return array.reject( this, fn );
		},
		remove : function ( start, end ) {
			return array.remove( this, start, end );
		},
		removeIf : function ( fn ) {
			return array.removeIf( this, fn );
		},
		removeWhile: function ( fn ) {
			return array.removeWhile( this, fn );
		},
		removeAttr : function ( key ) {
			array.each( this, function ( i ) {
				element.removeAttr( i, key );
			});

			return this;
		},
		removeClass: function ( arg ) {
			return array.each( this, function ( i ) {
				element.klass( i, arg, false );
			});
		},
		replace : function ( arg ) {
			return array.replace( this, arg );
		},
		rest : function ( arg ) {
			return array.rest( this, arg );
		},
		rindex : function ( arg ) {
			return array.rindex( this, arg );
		},
		rotate : function ( arg ) {
			return array.rotate( this, arg );
		},
		serialize : function ( string, encode ) {
			return element.serialize( this, string, encode );
		},
		series : function ( start, end, offset ) {
			return array.series( start, end, offset );
		},
		size : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.size( i ) );
			});

			return result;
		},
		sorted : function () {
			return array.sorted( this );
		},
		split : function ( size ) {
			return array.split( this, size );
		},
		stddev : function () {
			return array.stddev( this );
		},
		sum : function () {
			return array.sum( this );
		},
		take : function ( arg ) {
			return array.take( this, arg );
		},
		text : function ( arg ) {
			return array.each( this, function ( node ) {
				if ( typeof node !== "object") {
					node = utility.object( node );
				}

				if ( typeof node.text === "function") {
					node.text( arg );
				}
			});
		},
		tpl : function ( arg ) {
			return array.each( this, function ( i ) {
				utility.tpl ( arg, i );
			});
		},
		toggleClass : function ( arg ) {
			return array.each( this, function ( i ) {
				element.toggleClass( i, arg );
			});
		},
		total : function () {
			return array.total( this );
		},
		toObject : function () {
			return array.toObject( this );
		},
		un : function ( event, id, state ) {
			return array.each( this, function ( i ) {
				observer.remove( i, event, id, state );
			});
		},
		unique : function () {
			return array.unique( this );
		},
		update : function ( arg ) {
			return array.each( this, function ( i ) {
				element.update( i, arg );
			});
		},
		val : function ( arg ) {
			var a    = [],
			    type = null,
			    same = true;

			array.each( this, function ( i ) {
				if ( type !== null ) {
					same = ( type === i.type );
				}

				type = i.type;

				if ( typeof i.val === "function" ) {
					a.push( element.val( i, arg ) );
				}
			});

			return same ? a[0] : a;
		},
		validate : function () {
			var result = [];

			array.each( this, function ( i ) {
				result.push( element.validate( i ) );
			});

			return result;
		},
		variance : function () {
			return array.variance( this );
		},
		zip : function () {
			return array.zip( this, arguments );
		}
	},
	// Element.prototype
	element : {
		addClass : function ( arg ) {
			return element.klass( this, arg, true );
		},
		after : function ( type, args ) {
			return element.create( type, args, this, "after" );
		},
		append : function ( type, args ) {
			return element.create( type, args, this, "last" );
		},
		attr : function ( key, value ) {
			return element.attr( this, key, value );
		},
		before : function ( type, args ) {
			return element.create( type, args, this, "before" );
		},
		clear : function () {
			return element.clear( this );
		},
		create : function ( type, args, position ) {
			return element.create( type, args, this, position );
		},
		css : function ( key, value ) {
			return element.css( this, key, value );
		},
		data : function ( key, value ) {
			return element.data( this, key, value );
		},
		destroy : function () {
			return element.destroy( this );
		},
		disable : function () {
			return element.disable( this );
		},
		dispatch : function ( event, data, bubbles, cancelable ) {
			return element.dispatch( this, event, data, bubbles, cancelable );
		},
		enable : function () {
			return element.enable( this );
		},
		find : function ( arg ) {
			return element.find( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
		},
		genId : function () {
			return utility.genId( this );
		},
		get : function ( uri, success, failure, headers, timeout ) {
			var self  = this,
			    defer = deferred();

			defer.then( function ( arg ) {
				element.html( self, arg );
				observer.fire( self, "afterGet" );

				if ( typeof success === "function") {
					success.call( self, arg );
				}
			}, function ( e ) {
				element.html( self, e || label.error.serverError );
				observer.fire( self, "failedGet" );

				if ( typeof failure === "function") {
					failure.call( self, e );
				}

				throw e;
			});

			observer.fire( this, "beforeGet" );

			uri.get( function ( arg ) {
				defer.resolve( arg );
			}, function ( e ) {
				defer.reject( e );
			}, headers, timeout);

			return defer;
		},
		has : function ( arg ) {
			return element.has( this, arg );
		},
		hasClass : function ( arg ) {
			return element.hasClass( this, arg );
		},
		html : function ( arg ) {
			return element.html( this, arg );
		},
		is : function ( arg ) {
			return element.is( this, arg );
		},
		isAlphaNum : function () {
			return element.isAlphaNum( this );
		},
		isBoolean : function () {
			return element.isBoolean( this );
		},
		isChecked : function () {
			return element.isChecked( this );
		},
		isDate : function () {
			return element.isDate( this );
		},
		isDisabled : function () {
			return element.isDisabled( this );
		},
		isDomain : function () {
			return element.isDomain( this );
		},
		isEmail : function () {
			return element.isEmail( this );
		},
		isEmpty : function () {
			return element.isEmpty( this );
		},
		isHidden : function () {
			return element.hidden( this );
		},
		isIP : function () {
			return element.isIP( this );
		},
		isInt : function () {
			return element.isInt( this );
		},
		isNumber : function () {
			return element.isNumber( this );
		},
		isPhone : function () {
			return element.isPhone( this );
		},
		isUrl : function () {
			return element.isUrl( this );
		},
		jsonp : function ( uri, property, callback ) {
			var target = this,
			    arg    = property;

			return client.jsonp( uri, function ( response ) {
				var self = target,
				    node = response,
				    prop = arg,
				    result;

				try {
					if ( prop !== undefined ) {
						prop = prop.replace( /\]|'|"/g , "" ).replace( /\./g, "[" ).split( "[" );

						prop.each( function ( i ) {
							node = node[!!isNaN( i ) ? i : number.parse( i, 10 )];

							if ( node === undefined ) {
								throw new Error( label.error.propertyNotFound );
							}
						});

						result = node;
					}
					else {
						result = response;
					}
				}
				catch ( e ) {
					result = label.error.serverError;
					utility.error( e, arguments, this );
				}

				element.html( self, result );
			}, function ( e ) {
				element.html( target, label.error.serverError );

				throw e;
			}, callback );
		},
		listeners : function ( event ) {
			return observer.list( this, event );
		},
		loading : function () {
			return utility.loading( this );
		},
		on : function ( event, listener, id, scope, state ) {
			return observer.add(  this, event, listener, id, scope || this, state );
		},
		once : function ( event, listener, id, scope, state ) {
			return observer.once( this, event, listener, id, scope || this, state );
		},
		prepend : function ( type, args ) {
			return element.create( type, args, this, "first" );
		},
		prependChild : function ( child ) {
			return element.prependChild( this, child );
		},
		position : function () {
			return element.position( this );
		},
		removeAttr : function ( key ) {
			return element.removeAttr( this, key );
		},
		removeClass : function ( arg ) {
			return element.klass( this, arg, false );
		},
		scrollTo  : function ( ms ) {
			return element.scrollTo( this, ms );
		},
		serialize : function ( string, encode ) {
			return element.serialize( this, string, encode );
		},
		size : function () {
			return element.size( this );
		},
		text : function ( arg ) {
			return element.text( this, arg );
		},
		toggleClass : function ( arg ) {
			return element.toggleClass( this, arg );
		},
		tpl : function ( arg ) {
			return utility.tpl( arg, this );
		},
		un : function ( event, id, state ) {
			return observer.remove( this, event, id, state );
		},
		update : function ( args ) {
			return element.update( this, args );
		},
		val : function ( arg ) {
			return element.val( this, arg );
		},
		validate : function () {
			return element.validate( this );
		}
	},
	// Function.prototype
	"function": {
		reflect : function () {
			return utility.reflect( this );
		},
		debounce : function ( ms ) {
			return utility.debounce( this, ms );
		}
	},
	// Math
	math : {
		bezier : math.bezier,
		dist   : math.dist,
		sqr    : math.sqr
	},
	// Number.prototype
	number : {
		diff : function ( arg ) {
			return number.diff( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this.toString()].concat( array.cast( arguments ) ) );
		},
		format : function ( delimiter, every ) {
			return number.format( this, delimiter, every );
		},
		half : function ( arg ) {
			return number.half( this, arg );
		},
		isEven : function () {
			return number.even( this );
		},
		isOdd : function () {
			return number.odd( this );
		},
		listeners : function ( event ) {
			return observer.list( this.toString(), event );
		},
		on : function ( event, listener, id, scope, state ) {
			observer.add(  this.toString(), event, listener, id, scope || this, state );

			return this;
		},
		once : function ( event, listener, id, scope, state ) {
			observer.once( this.toString(), event, listener, id, scope || this, state );

			return this;
		},
		random : function () {
			return number.random( this );
		},
		round : function () {
			return number.round( this );
		},
		roundDown : function () {
			return number.round( this, "down" );
		},
		roundUp : function () {
			return number.round( this, "up" );
		},
		un : function ( event, id, state ) {
			observer.remove( this.toString(), event, id, state );

			return this;
		}
	},
	// String.prototype
	string : {
		allows : function ( arg ) {
			return client.allows( this, arg );
		},
		capitalize: function ( arg ) {
			return string.capitalize( this, arg );
		},
		del : function ( success, failure, headers ) {
			return client.request( this, "DELETE", success, failure, null, headers );
		},
		escape : function () {
			return string.escape( this );
		},
		expire : function ( silent ) {
			return cache.expire( this, silent );
		},
		explode : function ( arg ) {
			return string.explode( this, arg );
		},
		fire : function () {
			return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
		},
		get : function ( success, failure, headers ) {
			return client.request( this, "GET", success, failure, null, headers );
		},
		headers : function ( success, failure ) {
			return client.request( this, "HEAD", success, failure );
		},
		hyphenate : function ( camel ) {
			return string.hyphenate( this, camel );
		},
		isAlphaNum : function () {
			return string.isAlphaNum( this );
		},
		isBoolean : function () {
			return string.isBoolean( this );
		},
		isDate : function () {
			return string.isDate( this );
		},
		isDomain : function () {
			return string.isDomain( this );
		},
		isEmail : function () {
			return string.isEmail( this );
		},
		isEmpty : function () {
			return string.isEmpty( this );
		},
		isIP : function () {
			return string.isIP( this );
		},
		isInt : function () {
			return string.isInt( this );
		},
		isNumber : function () {
			return string.isNumber( this );
		},
		isPhone : function () {
			return string.isPhone( this );
		},
		isUrl : function () {
			return string.isUrl( this );
		},
		jsonp : function ( success, failure, callback ) {
			return client.jsonp( this, success, failure, callback );
		},
		listeners : function ( event ) {
			return observer.list( this, event );
		},
		patch : function ( success, failure, args, headers ) {
			return client.request( this, "PATCH", success, failure, args, headers );
		},
		post : function ( success, failure, args, headers ) {
			return client.request( this, "POST", success, failure, args, headers );
		},
		put : function ( success, failure, args, headers ) {
			return client.request( this, "PUT", success, failure, args, headers );
		},
		on : function ( event, listener, id, scope, state ) {
			return observer.add( this, event, listener, id, scope, state );
		},
		once : function ( event, listener, id, scope, state ) {
			return observer.add( this, event, listener, id, scope, state );
		},
		options : function ( success, failure ) {
			return client.request( this, "OPTIONS", success, failure );
		},
		permissions : function () {
			return client.permissions( this );
		},
		singular : function () {
			return string.singular( this );
		},
		toCamelCase : function () {
			return string.toCamelCase( this );
		},
		toNumber : function ( base ) {
			return number.parse( this, base );
		},
		trim : function () {
			return string.trim( this );
		},
		un : function ( event, id, state ) {
			return observer.remove( this, event, id, state );
		},
		unCamelCase : function () {
			return string.unCamelCase( this );
		},
		uncapitalize : function () {
			return string.uncapitalize( this );
		},
		unhyphenate: function ( arg ) {
			return string.unhyphenate( this, arg );
		}
	}
};

/** @namespace state */
var state = ( function () {
	var prop = {current: "active", previous: null, header: null},
	    getCurrent, setCurrent, getHeader, setHeader, getPrevious, setPrevious;

	/**
	 * Gets current application state
	 *
	 * @method getCurrent
	 * @private
	 * @return {String} Application state
	 */
	getCurrent = function () {
		return prop.current;
	};

	/**
	 * Sets current application state
	 *
	 * @method setCurrent
	 * @private
	 * @param  {String} arg New application state
	 * @return {String}     Application state
	 */
	setCurrent = function ( arg ) {
		if ( arg === null || typeof arg !== "string" || prop[0] === arg || string.isEmpty( arg ) ) {
			throw new Error( label.error.invalidArguments );
		}

		prop.previous = prop.current;
		prop.current  = arg;

		observer.fire( abaaso, "state", arg );

		return arg;
	};

	/**
	 * Gets current application state header
	 *
	 * @method getHeader
	 * @private
	 * @return {String} Application state header
	 */
	getHeader = function () {
		return prop.header;
	};

	/**
	 * Sets current application state header
	 *
	 * @method setHeader
	 * @private
	 * @param  {String} arg New application state header
	 * @return {String}     Application state header
	 */
	setHeader = function ( arg ) {
		if ( arg !== null && ( typeof arg !== "string" || prop.header === arg || string.isEmpty( arg ) ) ) {
			throw new Error( label.error.invalidArguments );
		}

		prop.header = arg;

		return arg;
	};

	/**
	 * Gets previous application state
	 *
	 * @method getPrevious
	 * @private
	 * @return {String} Previous application state
	 */
	getPrevious = function () {
		return prop.previous;
	};

	/**
	 * Exists because you can't mix accessor & data descriptors
	 *
	 * @method setPrevious
	 * @private
	 * @return {Undefined} undefined
	 */
	setPrevious = function () {
		throw new Error( label.error.readOnly );
	};

	// interface
	return {
		getCurrent  : getCurrent,
		setCurrent  : setCurrent,
		getHeader   : getHeader,
		setHeader   : setHeader,
		getPrevious : getPrevious,
		setPrevious : setPrevious
	};
})();

/** @namespace string */
var string = {
	/**
	 * Capitalizes the String
	 *
	 * @method capitalize
	 * @param  {String}  obj String to capitalize
	 * @param  {Boolean} all [Optional] Capitalize each word
	 * @return {String}      Capitalized String
	 */
	capitalize : function ( obj, all ) {
		all = ( all === true );

		var result;

		if ( all ) {
			result = string.explode( obj, " " ).map( function ( i ) {
				return i.charAt( 0 ).toUpperCase() + i.slice( 1 );
			}).join(" ");
		}
		else {
			result = obj.charAt( 0 ).toUpperCase() + obj.slice( 1 );
		}

		return result;
	},

	/**
	 * Escapes meta characters within a string
	 *
	 * @method escape
	 * @param  {String} obj String to escape
	 * @return {String}     Escaped string
	 */
	escape : function ( obj ) {
		return obj.replace( /[\-\[\]{}()*+?.,\\\^\$|#\s]/g, "\\$&" );
	},

	/**
	 * Splits a string on comma, or a parameter, and trims each value in the resulting Array
	 *
	 * @method explode
	 * @param  {String} obj String to capitalize
	 * @param  {String} arg String to split on
	 * @return {Array}      Array of the exploded String
	 */
	explode : function ( obj, arg ) {
		arg = arg || ",";

		return string.trim( obj ).split( new RegExp( "\\s*" + arg + "\\s*" ) );
	},

	/**
	 * Replaces all spaces in a string with dashes
	 *
	 * @method hyphenate
	 * @param  {String} obj   String to hyphenate
	 * @param {Boolean} camel [Optional] Hyphenate camelCase
	 * @return {String}       String with dashes instead of spaces
	 */
	hyphenate : function ( obj, camel ) {
		var result = string.trim( obj ).replace( /\s+/g, "-" );

		if ( camel === true ) {
			result = result.replace( /([A-Z])/g, "-$1" ).toLowerCase();
		}

		return result;
	},

	/**
	 * Tests if a string is alpha-numeric
	 *
	 * @method isAlphaNum
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isAlphaNum : function ( obj ) {
		return validate.test( {alphanum: obj} ).pass;
	},

	/**
	 * Tests if a string is a boolean
	 *
	 * @method isBoolean
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isBoolean : function ( obj ) {
		return validate.test( {"boolean": obj} ).pass;
	},

	/**
	 * Tests if a string a date
	 *
	 * @method isDate
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isDate : function ( obj ) {
		return validate.test( {date: obj} ).pass;
	},

	/**
	 * Tests if a string is a domain
	 *
	 * @method isDomain
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isDomain : function ( obj ) {
		return validate.test( {domain: obj} ).pass;
	},

	/**
	 * Tests if a string is an email address
	 *
	 * @method isEmail
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isEmail : function ( obj ) {
		return validate.test( {email: obj} ).pass;
	},

	/**
	 * Tests if a string is empty
	 *
	 * @method isEmpty
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isEmpty : function ( obj ) {
		return ( string.trim( obj ) === "" );
	},

	/**
	 * Tests if a string is an IP address
	 *
	 * @method isIP
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isIP : function ( obj ) {
		return validate.test( {ip: obj} ).pass;
	},

	/**
	 * Tests if a string is an integer
	 *
	 * @method isInt
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isInt : function ( obj ) {
		return validate.test( {integer: obj} ).pass;
	},

	/**
	 * Tests if a string is a number
	 *
	 * @method isNumber
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isNumber : function ( obj ) {
		return validate.test( {number: obj} ).pass;
	},

	/**
	 * Tests if a string is a phone number
	 *
	 * @method isPhone
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isPhone : function ( obj ) {
		return validate.test( {phone: obj} ).pass;
	},

	/**
	 * Tests if a string is a URL
	 *
	 * @method isUrl
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isUrl : function ( obj ) {
		return validate.test( {url: obj} ).pass;
	},

	/**
	 * Returns singular form of the string
	 *
	 * @method singular
	 * @param  {String} obj String to transform
	 * @return {String}     Transformed string
	 */
	singular : function ( obj ) {
		return obj.replace( /oe?s$/, "o" ).replace( /ies$/, "y" ).replace( /ses$/, "se" ).replace( /s$/, "" );
	},

	/**
	 * Transforms the case of a String into CamelCase
	 *
	 * @method toCamelCase
	 * @param  {String} obj String to capitalize
	 * @return {String}     Camel case String
	 */
	toCamelCase : function ( obj ) {
		var s = string.trim( obj ).replace( /\.|_|-|\@|\[|\]|\(|\)|\#|\$|\%|\^|\&|\*|\s+/g, " " ).toLowerCase().split( regex.space_hyphen ),
		    r = [];

		array.each( s, function ( i, idx ) {
			r.push( idx === 0 ? i : string.capitalize( i ) );
		});

		return r.join( "" );
	},

	/**
	 * Trims the whitespace around a String
	 *
	 * @method trim
	 * @param  {String} obj String to capitalize
	 * @return {String}     Trimmed String
	 */
	trim : function ( obj ) {
		return obj.replace( /^(\s+|\t+)|(\s+|\t+)$/g, "" );
	},

	/**
	 * Uncamelcases the String
	 *
	 * @method unCamelCase
	 * @param  {String} obj String to uncamelcase
	 * @return {String}     Uncamelcased String
	 */
	unCamelCase : function ( obj ) {
		return string.trim( obj.replace( /([A-Z])/g, " $1" ).toLowerCase() );
	},

	/**
	 * Uncapitalizes the String
	 *
	 * @method uncapitalize
	 * @param  {String} obj String to uncapitalize
	 * @return {String}     Uncapitalized String
	 */
	uncapitalize : function ( obj ) {
		obj = string.trim( obj );

		return obj.charAt( 0 ).toLowerCase() + obj.slice( 1 );
	},

	/**
	 * Replaces all hyphens with spaces
	 *
	 * @method unhyphenate
	 * @param  {String}  obj  String to unhypenate
	 * @param  {Boolean} caps [Optional] True to capitalize each word
	 * @return {String}       Unhyphenated String
	 */
	unhyphenate : function ( obj, caps ) {
		if ( caps !== true ) {
			return string.explode( obj, "-" ).join( " " );
		}
		else {
			return string.explode( obj, "-" ).map( function ( i ) {
				return string.capitalize( i );
			}).join( " " );
		}
	}
};

/** @namespace utility */
var utility = {
	// Collection of timers
	timer : {},

	// Collection of repeating functions
	repeating: {},

	/**
	 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
	 *
	 * @method $
	 * @param  {String} arg Comma delimited string of CSS selectors
	 * @return {Mixed}      Element or Array of Elements
	 */
	$ : function ( arg ) {
		var result;

		if ( !arg ) {
			return;
		}

		arg = string.trim( arg );

		if ( arg.indexOf( "," ) === -1 ) {
			result = utility.dom( arg );
		}
		else {
			result = [];

			array.each( string.explode( arg ), function ( query ) {
				var obj = utility.dom( query );

				if ( obj instanceof Array ) {
					result = result.concat( obj );
				}
				else if ( obj ) {
					result.push( obj );
				}
			});
		}

		return result;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @param  {Object} obj    Object receiving aliasing
	 * @param  {Object} origin Object providing structure to obj
	 * @return {Object}        Object receiving aliasing
	 */
	alias : function ( obj, origin ) {
		var o = obj,
		    s = origin;

		utility.iterate( s, function ( v, k ) {
			var getter, setter;

			if ( !( v instanceof RegExp ) && typeof v === "function" ) {
				o[k] = v.bind( o[k] );
			}
			else if ( !(v instanceof RegExp ) && !(v instanceof Array ) && v instanceof Object ) {
				if ( o[k] === undefined ) {
					o[k] = {};
				}

				utility.alias( o[k], s[k] );
			}
			else {
				getter = function () {
					return s[k];
				};

				setter = function ( arg ) {
					s[k] = arg;
				};

				utility.property( o, k, {enumerable: true, get: getter, set: setter, value: s[k]} );
			}
		});

		return obj;
	},

	/**
	 * Clears deferred & repeating functions
	 *
	 * @method clearTimers
	 * @param  {String} id ID of timer( s )
	 * @return {Undefined} undefined
	 */
	clearTimers : function ( id ) {
		if ( id === undefined || string.isEmpty( id ) ) {
			throw new Error( label.error.invalidArguments );
		}

		// deferred
		if ( utility.timer[id] !== undefined ) {
			clearTimeout( utility.timer[id] );
			delete utility.timer[id];
		}

		// repeating
		if ( utility.repeating[id] !== undefined ) {
			clearTimeout( utility.repeating[id] );
			delete utility.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @param {Object}  obj     Object to clone
	 * @param {Boolean} shallow [Optional] Create a shallow clone, which doesn't maintain prototypes, default is `false`
	 * @return {Object}     Clone of obj
	 */
	clone : function ( obj, shallow ) {
		var clone;

		if ( shallow === true ) {
			return json.decode( json.encode( obj ) );
		}
		else if ( !obj || regex.primitive.test( typeof obj ) || ( obj instanceof RegExp ) ) {
			return obj;
		}
		else if ( obj instanceof Array ) {
			return obj.slice();
		}
		else if ( !server && !client.ie && obj instanceof Document ) {
			return xml.decode( xml.encode( obj ) );
		}
		else if ( typeof obj.__proto__ !== "undefined" ) {
			return utility.extend( obj.__proto__, obj );
		}
		else if ( obj instanceof Object ) {
			// If JSON encoding fails due to recursion, the original Object is returned because it's assumed this is for decoration
			clone = json.encode( obj, true );

			if ( clone !== undefined ) {
				clone = json.decode( clone );

				// Decorating Functions that would be lost with JSON encoding/decoding
				utility.iterate( obj, function ( v, k ) {
					if ( typeof v === "function" ) {
						clone[k] = v;
					}
				});
			}
			else {
				clone = obj;
			}

			return clone;
		}
		else {
			return obj;
		}
	},

	/**
	 * Coerces a String to a Type
	 *
	 * @method coerce
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Primitive version of the String
	 */
	coerce : function ( value ) {
		var tmp;

		if ( value === null || value === undefined ) {
			return undefined;
		}
		else if ( value === "true" ) {
			return true;
		}
		else if ( value === "false" ) {
			return false;
		}
		else if ( value === "null" ) {
			return null;
		}
		else if ( value === "undefined" ) {
			return undefined;
		}
		else if ( value === "" ) {
			return value;
		}
		else if ( !isNaN( tmp = Number( value ) ) ) {
			return tmp;
		}
		else if ( regex.json_wrap.test( value ) ) {
			return json.decode( value, true ) || value;
		}
		else {
			return value;
		}
	},

	/**
	 * Recompiles a RegExp by reference
	 *
	 * This is ideal when you need to recompile a regex for use within a conditional statement
	 *
	 * @method compile
	 * @param  {Object} regex     RegExp
	 * @param  {String} pattern   Regular expression pattern
	 * @param  {String} modifiers Modifiers to apply to the pattern
	 * @return {Boolean}          true
	 */
	compile : function ( reg, pattern, modifiers ) {
		reg.compile( pattern, modifiers );

		return true;
	},

	/**
	 * Creates a CSS stylesheet in the View
	 *
	 * @method css
	 * @param  {String} content CSS to put in a style tag
	 * @param  {String} media   [Optional] Medias the stylesheet applies to
	 * @return {Object}         Element created or undefined
	 */
	css : function ( content, media ) {
		var ss, css;

		ss = element.create( "style", {type: "text/css", media: media || "print, screen"}, utility.$( "head" )[0] );

		if ( ss.styleSheet ) {
			ss.styleSheet.cssText = content;
		}
		else {
			css = document.createTextNode( content );
			ss.appendChild( css );
		}

		return ss;
	},

	/**
	 * Debounces a function
	 *
	 * @method debounce
	 * @param  {Function} fn    Function to execute
	 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {Mixed}    scope `this` context during execution, default is `global`
	 * @return {Undefined}      undefined
	 */
	debounce : function ( fn, ms, scope ) {
		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			setTimeout( function () {
				fn.apply( scope, arguments );
			}, ms);
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
	 * @param  {String} args  Dot delimited string of the structure
	 * @param  {Mixed}  value Value to set
	 * @param  {Object} obj   Object receiving value
	 * @return {Object}       Object receiving value
	 */
	define : function ( args, value, obj ) {
		args    = args.split( "." );
		var p   = obj,
		    nth = args.length;

		if ( obj === undefined ) {
			obj = this;
		}

		if ( value === undefined ) {
			value = null;
		}

		array.each( args, function ( i, idx ) {
			var num = idx + 1 < nth && !isNaN( number.parse( args[idx + 1], 10 ) ),
			    val = value;

			if ( !isNaN( number.parse( i, 10 ) ) )  {
				i = number.parse( i, 10 );
			}
			
			// Creating or casting
			if ( p[i] === undefined ) {
				p[i] = num ? [] : {};
			}
			else if ( p[i] instanceof Object && num ) {
				p[i] = array.cast( p[i] );
			}
			else if ( p[i] instanceof Object ) {
				// Do nothing
			}
			else if ( p[i] instanceof Array && !num ) {
				p[i] = array.toObject( p[i] );
			}
			else {
				p[i] = {};
			}

			// Setting reference or value
			idx + 1 === nth ? p[i] = val : p = p[i];
		});

		return obj;
	},

	/**
	 * Defers the execution of Function by at least the supplied milliseconds
	 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
	 *
	 * @method defer
	 * @param  {Function} fn     Function to defer execution of
	 * @param  {Number}   ms     Milliseconds to defer execution
	 * @param  {Number}   id     [Optional] ID of the deferred function
	 * @param  {Boolean}  repeat [Optional] Describes the execution, default is `false`
	 * @return {String}          ID of the timer
	 */
	defer : function ( fn, ms, id, repeat ) {
		var op;

		ms     = ms || 0;
		repeat = ( repeat === true );

		if ( id !== undefined ) {
			utility.clearTimers( id );
		}
		else {
			id = utility.uuid( true );
		}

		op = function () {
			utility.clearTimers( id );
			fn();
		};

		utility[repeat ? "repeating" : "timer"][id] = setTimeout( op, ms );

		return id;
	},

	/**
	 * Queries DOM with fastest method
	 *
	 * @method dom
	 * @param  {String} arg DOM query
	 * @return {Mixed}      undefined, Element, or Array of Elements
	 */
	dom : function ( arg ) {
		var result;

		if ( !regex.selector_complex.test( arg ) ) {
			if ( regex.hash.test( arg ) ) {
				result = document.getElementById( arg.replace( regex.hash, "" ) ) || undefined;
			}
			else if ( regex.klass.test( arg ) ) {
				result = array.cast( document.getElementsByClassName( arg.replace( regex.klass, "" ) ) );
			}
			else if ( regex.word.test( arg ) ) {
				result = array.cast( document.getElementsByTagName( arg ) );
			}
			else {
				result = array.cast( document.querySelectorAll( arg ) );
			}
		}
		else {
			result = array.cast( document.querySelectorAll( arg ) );
		}

		return result;
	},

	/**
	 * Encodes a UUID to a DOM friendly ID
	 *
	 * @method domId
	 * @param  {String} UUID
	 * @return {String} DOM friendly ID
	 */
	domId : function ( arg ) {
		return "a" + arg.replace( /-/g, "" ).slice( 1 );
	},

	/**
	 * Error handling, with history in .log
	 *
	 * @method error
	 * @param  {Mixed}   e       Error object or message to display
	 * @param  {Array}   args    Array of arguments from the callstack
	 * @param  {Mixed}   scope   Entity that was "this"
	 * @param  {Boolean} warning [Optional] Will display as console warning if true
	 * @return {Undefined}       undefined
	 */
	error : function ( e, args, scope, warning ) {
		warning = ( warning === true );
		var o   = {
			"arguments" : args !== undefined ? array.cast( args ) : [],
			message     : e.message || e,
			number      : e.number !== undefined ? ( e.number & 0xFFFF ) : undefined,
			scope       : scope,
			stack       : e.stack   || undefined,
			timestamp   : new Date().toUTCString(),
			type        : e.type    || "TypeError"
		};

		utility.log( o.stack || o.message, !warning ? "error" : "warn" );
		utility.error.log.push( o );
		observer.fire( abaaso, "error", o );

		return undefined;
	},

	/**
	 * Creates a "class" extending Object, with optional decoration
	 *
	 * @method extend
	 * @param  {Object} obj Object to extend
	 * @param  {Object} arg [Optional] Object for decoration
	 * @return {Object}     Decorated obj
	 */
	extend : function () {
		if ( typeof Object.create === "function" ) {
			return function ( obj, arg ) {
				var o;

				if ( obj === undefined ) {
					throw new Error( label.error.invalidArguments );
				}

				o = Object.create( obj );

				if ( arg instanceof Object ) {
					utility.merge( o, arg );
				}

				return o;
			};
		}
		else {
			return function ( obj, arg ) {
				function Extended () {}

				var o;

				if ( obj === undefined ) {
					throw new Error( label.error.invalidArguments );
				}

				Extended.prototype = obj;

				o = new Extended();

				if ( arg instanceof Object ) {
					utility.merge( o, arg );
				}

				return o;
			};
		}
	}(),

	/**
	 * Fibonacci calculator
	 *
	 * @method fib
	 * @param  {Number}  i Number to calculate
	 * @param  {Boolean} r Recursive if `true`
	 * @return {Number}    Calculated number
	 */
	fib : function ( i, r ) {
		if ( r === true ) {
			return i > 1 ? utility.fib( i - 1, r ) + utility.fib( i - 2, r ) : i;
		}
		else {
			return array.last( array.fib( i ) );
		}
	},

	/**
	 * Generates an ID value
	 *
	 * @method genId
	 * @param  {Mixed}   obj [Optional] Object to receive id
	 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {Mixed}       Object or id
	 */
	genId : function ( obj, dom ) {
		dom = ( dom === true );
		var id;

		if ( obj !== undefined && ( ( obj.id !== undefined && obj.id !== "" ) || ( obj instanceof Array ) || ( obj instanceof String || typeof obj === "string" ) ) ) {
			return obj;
		}

		if ( dom ) {
			do {
				id = utility.domId( utility.uuid( true) );
			}
			while ( utility.$( "#" + id ) !== undefined );
		}
		else {
			id = utility.domId( utility.uuid( true) );
		}

		if ( typeof obj === "object" ) {
			obj.id = id;

			return obj;
		}
		else {
			return id;
		}
	},

	/**
	 * Getter / setter for the hashbang
	 *
	 * @method hash
	 * @param  {String} arg Route to set
	 * @return {String}     Current route
	 */
	hash : function ( arg ) {
		if ( arg !== undefined ) {
			document.location.hash = arg;
		}

		return document.location.hash;
	},

	/**
	 * Converts RGB to HEX
	 *
	 * @method hex
	 * @param  {String} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
	 * @return {String}       Color as HEX
	 */
	hex : function ( color ) {
		var digits, red, green, blue, result, i, nth;

		if ( color.charAt( 0 ) === "#" ) {
		    result = color;
		}
		else {
			digits = string.explode( color.replace( /.*\(|\)/g, "" ) );
			red    = number.parse( digits[0] || 0 );
			green  = number.parse( digits[1] || 0 );
			blue   = number.parse( digits[2] || 0 );
			result = ( blue | ( green << 8 ) | ( red << 16 ) ).toString( 16 );

			if ( result.length < 6 ) {
				nth = number.diff( result.length, 6 );
				i   = -1;

				while ( ++i < nth ) {
					result = "0" + result;
				}
			}

			result = "#" + result;
		}

		return result;
	},

	/**
	 * Iterates an Object and executes a function against the properties
	 *
	 * Iteration can be stopped by returning false from fn
	 *
	 * @method iterate
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	iterate : function () {
		if ( typeof Object.keys === "function" ) {
			return function ( obj, fn ) {
				if ( typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( Object.keys( obj ), function ( i ) {
					return fn.call( obj, obj[i], i );
				});

				return obj;
			};
		}
		else {
			return function ( obj, fn ) {
				var i, result;

				if ( typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				for ( i in obj ) {
					if ( has.call( obj, i ) ) {
						result = fn.call( obj, obj[i], i );

						if ( result === false ) {
							break;
						}
					}
					else {
						break;
					}
				}

				return obj;
			};
		}
	}(),

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @param  {Mixed} obj Element
	 * @return {Mixed}     Element
	 */
	loading : function ( obj ) {
		var l = abaaso.loading;

		if ( l.url === null || obj === undefined ) {
			throw new Error( label.error.invalidArguments );
		}

		// Setting loading image
		if ( l.image === undefined ) {
			l.image     = new Image();
			l.image.src = l.url;
		}

		// Clearing target element
		element.clear( obj );

		// Creating loading image in target element
		element.create( "img", {alt: label.common.loading, src: l.image.src}, element.create( "div", {"class": "loading"}, obj ) );

		return obj;
	},

	/**
	 * Writes argument to the console
	 *
	 * @method log
	 * @param  {String} arg    String to write to the console
	 * @param  {String} target [Optional] Target console, default is "log"
	 * @return {Undefined}     undefined
	 */
	log : function ( arg, target ) {
		var ts, msg;

		if ( typeof console !== "undefined" ) {
			ts  = typeof arg !== "object";
			msg = ts ? "[" + new Date().toLocaleTimeString() + "] " + arg : arg;
			console[target || "log"]( msg );
		}
	},

	/**
	 * Merges obj with arg
	 *
	 * @method merge
	 * @param  {Object} obj Object to decorate
	 * @param  {Object} arg Decoration
	 * @return {Object}     Decorated Object
	 */
	merge : function ( obj, arg ) {
		utility.iterate( arg, function ( v, k ) {
			if ( ( obj[k] instanceof Array ) && ( v instanceof Array ) ) {
				array.merge( obj[k], v );
			}
			else if ( ( obj[k] instanceof Object ) && ( v instanceof Object ) ) {
				utility.iterate( v, function ( x, y ) {
					obj[k][y] = utility.clone( x );
				});
			}
			else {
				obj[k] = utility.clone( v );
			}
		});

		return obj;
	},
	
	/**
	 * Registers a module on abaaso
	 *
	 * @method module
	 * @param  {String} arg Module name
	 * @param  {Object} obj Module structure
	 * @return {Object}     Module registered
	 */
	module : function ( arg, obj ) {
		if ( $[arg] !== undefined || !obj instanceof Object ) {
			throw new Error( label.error.invalidArguments );
		}
		
		$[arg] = obj;

		return $[arg];
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @private
	 * @param  {Mixed} obj Entity or $ query
	 * @return {Mixed}     Entity
	 */
	object : function ( obj ) {
		return typeof obj === "object" ? obj : ( obj.charAt && obj.charAt( 0 ) === "#" ? utility.$( obj ) : obj );
	},

	/**
	 * Parses a URI into an Object
	 *
	 * @method parse
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function ( uri ) {
		var obj    = {},
		    parsed = {};

		if ( uri === undefined ) {
			uri = !server ? location.href : "";
		}

		uri = decodeURIComponent( uri );

		if ( !server ) {
			obj = document.createElement( "a" );
			obj.href = uri;
		}
		else {
			obj = url.parse( uri );
		}

		if ( server ) {
			utility.iterate( obj, function ( v, k ) {
				if ( v === null ) {
					obj[k] = undefined;
				}
			});
		}

		parsed = {
			auth     : server ? null : regex.auth.exec( uri ),
			protocol : obj.protocol || "http:",
			hostname : obj.hostname || "localhost",
			port     : obj.port ? number.parse( obj.port, 10 ) : "",
			pathname : obj.pathname,
			search   : obj.search   || "",
			hash     : obj.hash     || "",
			host     : obj.host     || "localhost"
		};

		// 'cause IE is ... IE; required for data.batch()
		if ( client.ie ) {
			if ( parsed.protocol === ":" ) {
				parsed.protocol = location.protocol;
			}

			if ( string.isEmpty( parsed.hostname ) ) {
				parsed.hostname = location.hostname;
			}

			if ( string.isEmpty( parsed.host ) ) {
				parsed.host = location.host;
			}

			if ( parsed.pathname.charAt( 0 ) !== "/" ) {
				parsed.pathname = "/" + parsed.pathname;
			}
		}

		parsed.auth  = obj.auth || ( parsed.auth === null ? "" : parsed.auth[1] );
		parsed.href  = obj.href || ( parsed.protocol + "//" + ( string.isEmpty( parsed.auth ) ? "" : parsed.auth + "@" ) + parsed.host + parsed.pathname + parsed.search + parsed.hash );
		parsed.path  = obj.path || parsed.pathname + parsed.search;
		parsed.query = utility.queryString( null, parsed.search );

		return parsed;
	},

	/**
	 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
	 *
	 * @method property
	 * @param  {Object} obj        Object to decorate
	 * @param  {String} prop       Name of property to set
	 * @param  {Object} descriptor Descriptor of the property
	 * @return {Object}            Object receiving the property
	 */
	property : function () {
		if ( ( server || ( !client.ie || client.version > 8 ) ) && typeof Object.defineProperty === "function" ) {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw new Error( label.error.invalidArguments );
				}

				if ( descriptor.value !== undefined && descriptor.get !== undefined ) {
					delete descriptor.value;
				}

				Object.defineProperty( obj, prop, descriptor );
			};
		}
		else {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw new Error( label.error.invalidArguments );
				}

				obj[prop] = descriptor.value;

				return obj;
			};
		}
	},

	/**
	 * Sets methods on a prototype object
	 *
	 * Allows hooks to be overwritten
	 *
	 * @method proto
	 * @param  {Object} obj  Object receiving prototype extension
	 * @param  {String} type Identifier of obj, determines what Arrays to apply
	 * @return {Object}      obj or undefined
	 */
	proto : function ( obj, type ) {
		var target = obj.prototype || obj;

		utility.iterate( prototypes[type], function ( v, k ) {
			if ( !target[k] ) {
				utility.property( target, k, {value: v, configurable: true, writable: true} );
			}
		});

		return obj;
	},

	/**
	 * Parses a query string & coerces values
	 *
	 * @method queryString
	 * @param  {String} arg     [Optional] Key to find in the querystring
	 * @param  {String} qstring [Optional] Query string to parse
	 * @return {Mixed}          Value or Object of key:value pairs
	 */
	queryString : function ( arg, qstring ) {
		var obj    = {},
		    result = qstring !== undefined ? ( qstring.indexOf( "?" ) > -1 ? qstring.replace( /.*\?/, "" ) : null) : ( server || string.isEmpty( location.search ) ? null : location.search.replace( "?", "" ) ),
		    item;

		if ( result !== null && !string.isEmpty( result ) ) {
			result = result.split( "&" );
			array.each( result, function (prop ) {
				item = prop.split( "=" );

				if ( string.isEmpty( item[0] ) ) {
					return;
				}

				if ( item[1] === undefined || string.isEmpty( item[1] ) ) {
					item[1] = "";
				}
				else if ( string.isNumber( item[1] )) {
					item[1] = Number(item[1] );
				}
				else if ( string.isBoolean( item[1] )) {
					item[1] = (item[1] === "true" );
				}

				if ( obj[item[0]] === undefined ) {
					obj[item[0]] = item[1];
				}
				else if ( !(obj[item[0]] instanceof Array) ) {
					obj[item[0]] = [obj[item[0]]];
					obj[item[0]].push( item[1] );
				}
				else {
					obj[item[0]].push( item[1] );
				}
			});
		}

		if ( arg !== null && arg !== undefined ) {
			obj = obj[arg];
		}

		return obj;
	},

	/**
	 * Returns an Array of parameters of a Function
	 *
	 * @method reflect
	 * @param  {Function} arg Function to reflect
	 * @return {Array}        Array of parameters
	 */
	reflect : function ( arg ) {
		if ( arg === undefined ) {
			arg = this || utility.$;
		}

		arg = arg.toString().match( regex.reflect )[1];

		return string.explode( arg );
	},

	/**
	 * Creates a recursive function
	 *
	 * Return false from the function to halt recursion
	 *
	 * @method repeat
	 * @param  {Function} fn  Function to execute repeatedly
	 * @param  {Number}   ms  Milliseconds to stagger the execution
	 * @param  {String}   id  [Optional] Timeout ID
	 * @param  {Boolean}  now Executes `fn` and then setup repetition, default is `true`
	 * @return {String}       Timeout ID
	 */
	repeat : function ( fn, ms, id, now ) {
		ms  = ms || 10;
		id  = id || utility.uuid( true );
		now = ( now !== false );

		// Could be valid to return false from initial execution
		if ( now && fn() === false ) {
			return;
		}

		// Creating repeating execution
		utility.defer( function () {
			var recursive = function ( fn, ms, id ) {
				var recursive = this;

				if ( fn() !== false ) {
					utility.repeating[id] = setTimeout( function () {
						recursive.call( recursive, fn, ms, id );
					}, ms );
				}
				else {
					delete utility.repeating[id];
				}
			};

			recursive.call( recursive, fn, ms, id );
		}, ms, id, true );

		return id;
	},

	/**
	 * Stops an Event from bubbling
	 *
	 * @method stop
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	stop : function ( e ) {
		if ( e.cancelBubble !== undefined ) {
			e.cancelBubble = true;
		}

		if ( typeof e.preventDefault === "function" ) {
			e.preventDefault();
		}

		if ( typeof e.stopPropagation === "function" ) {
			e.stopPropagation();
		}

		// Assumed to always be valid, even if it's not decorated on `e` ( I'm looking at you IE8 )
		e.returnValue = false;

		return e;
	},

	/**
	 * Returns the Event target
	 *
	 * @method target
	 * @param  {Object} e Event
	 * @return {Object}   Event target
	 */
	target : function ( e ) {
		return e.target || e.srcElement;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @param  {Object} data   JSON Object describing HTML
	 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {Object}        New Element created from the template
	 */
	tpl : function ( arg, target ) {
		var frag;

		if ( typeof arg !== "object" || (!(regex.object_undefined.test( typeof target ) ) && ( target = target.charAt( 0 ) === "#" ? utility.$( target ) : utility.$( target )[0] ) === undefined ) ) {
			throw new Error( label.error.invalidArguments );
		}

		if ( target === undefined ) {
			target = utility.$( "body" )[0];
		}

		frag  = document.createDocumentFragment();

		if ( arg instanceof Array ) {
			array.each( arg, function ( i ) {
				element.html( element.create( array.cast( i, true )[0], frag ), array.cast(i)[0] );
			});
		}
		else {
			utility.iterate( arg, function ( v, k ) {
				if ( typeof v === "string" ) {
					element.html( element.create( k, undefined, frag ), v );
				}
				else if ( ( v instanceof Array ) || ( v instanceof Object ) ) {
					utility.tpl( v, element.create( k, undefined, frag ) );
				}
			});
		}

		target.appendChild( frag );

		return array.last( target.childNodes );
	},

	/**
	 * Generates a version 4 UUID
	 *
	 * @method uuid
	 * @param  {Boolean} safe [Optional] Strips - from UUID
	 * @return {String}       UUID
	 */
	uuid : function ( safe ) {
		var s = function () { return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ); },
		    r = [8, 9, "a", "b"],
		    o;

		o = ( s() + s() + "-" + s() + "-4" + s().substr( 0, 3 ) + "-" + r[Math.floor( Math.random() * 4 )] + s().substr( 0, 3 ) + "-" + s() + s() + s() );

		if ( safe === true ) {
			o = o.replace( /-/g, "" );
		}

		return o;
	},

	/**
	 * Walks a structure and returns arg
	 *
	 * @method  walk
	 * @param  {Mixed}  obj  Object or Array
	 * @param  {String} arg  String describing the property to return
	 * @return {Mixed}       arg
	 */
	walk : function ( obj, arg ) {
		array.each( arg.replace( /\]$/, "" ).replace( /\]/g, "." ).replace( /\.\./g, "." ).split( /\.|\[/ ), function ( i ) {
			obj = obj[i];
		});

		return obj;
	},

	/**
	 * Accepts Deferreds or Promises as arguments or an Array
	 *
	 * @method when
	 * @return {Object} Deferred
	 */
	when : function () {
		var i     = 0,
		    defer = deferred(),
		    args  = array.cast( arguments ),
		    nth;

		// Did we receive an Array? if so it overrides any other arguments
		if ( args[0] instanceof Array ) {
			args = args[0];
		}

		// How many instances to observe?
		nth = args.length;

		// None, end on next tick
		if ( nth === 0 ) {
			defer.resolve( null );
		}
		// Setup and wait
		else {
			array.each( args, function ( p ) {
				p.then( function () {
					if ( ++i === nth && !defer.isResolved()) {
						if ( args.length > 1 ) {
							defer.resolve( args.map( function ( obj ) {
								return obj.value || obj.promise.value;
							}));
						}
						else {
							defer.resolve( args[0].value || args[0].promise.value );
						}
					}
				}, function () {
					if ( !defer.isResolved() ) {
						if ( args.length > 1 ) {
							defer.reject( args.map( function ( obj ) {
								return obj.value || obj.promise.value;
							}));
						}
						else {
							defer.reject( args[0].value || args[0].promise.value );
						}
					}
				});
			});
		}

		return defer;
	}
};

/** @namespace validate */
var validate = {
	/**
	 * Validates args based on the type or pattern specified
	 *
	 * @method test
	 * @param  {Object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
	 * @return {Object}      Results
	 */
	test : function ( args ) {
		var exception = false,
		    invalid   = [],
		    value     = null,
		    c         = [],
		    p;

		if ( args.nodeName !== undefined && args.nodeName === "FORM" ) {
			if ( string.isEmpty( args.id ) ) {
				utility.genId( args );
			}

			c = utility.$( "#" + args.id + " input, #" + args.id + " select" );

			array.each( c, function ( i ) {
				var z = {},
				    p, v, r;

				p = regex[i.nodeName.toLowerCase()] ? regex[i.nodeName.toLowerCase()] : ( ( !string.isEmpty( i.id ) && regex[i.id.toLowerCase()] ) ? regex[i.id.toLowerCase()] : "notEmpty" );
				v = element.val( i );

				if ( v === null ) {
					v = "";
				}

				z[p] = v;
				r    = validate.test( z );

				if ( !r.pass ) {
					invalid.push( {element: i, test: p, value: v} );
					exception = true;
				}
			});
		}
		else {
			utility.iterate( args, function ( v, k ) {
				if ( v === undefined || v === null ) {
					invalid.push( {test: k, value: v} );
					exception = true;
					return;
				}

				value = v.toString().charAt( 0 ) === "#" ? ( utility.$( v ) !== undefined ? element.val( utility.$( v ) ) : "" ) : v;

				if ( k === "date" ) {
					if ( isNaN( new Date( value ).getYear() ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else if ( k === "domain" ) {
					if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else if ( k === "domainip" ) {
					if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) || !regex.ip.test( value ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
				else {
					p = regex[k] || k;

					if ( !p.test( value ) ) {
						invalid.push( {test: k, value: value} );
						exception = true;
					}
				}
			});
		}

		return {pass: !exception, invalid: invalid};
	}
};

/**
 * XMLHttpRequest shim for node.js
 *
 * @method xhr
 * @return {Object} XMLHttpRequest instance
 */
var xhr = function () {
	var UNSENT           = 0,
	    OPENED           = 1,
	    HEADERS_RECEIVED = 2,
	    LOADING          = 3,
	    DONE             = 4,
	    ready            = new RegExp( HEADERS_RECEIVED + "|" + LOADING ),
	    XMLHttpRequest, headers, handler, handlerError, state;

	headers = {
		"User-Agent"   : "abaaso/3.10.44 node.js/" + process.versions.node.replace( /^v/, "" ) + " (" + string.capitalize( process.platform ) + " V8/" + process.versions.v8 + " )",
		"Content-Type" : "text/plain",
		"Accept"       : "*/*"
	};

	/**
	 * Changes the readyState of an XMLHttpRequest
	 *
	 * @method state
	 * @param  {String} arg New readyState
	 * @return {Object}     XMLHttpRequest instance
	 */
	state = function ( arg ) {
		if ( this.readyState !== arg ) {
			this.readyState = arg;
			this.dispatchEvent( "readystatechange" );

			if ( this.readyState === DONE && !this._error ) {
				this.dispatchEvent( "load" );
				this.dispatchEvent( "loadend" );
			}
		}

		return this;
	};

	/**
	 * Response handler
	 *
	 * @method handler
	 * @param  {Object} res HTTP(S) Response Object
	 * @return {undefined}  undefined
	 */
	handler = function ( res ) {
		var self = this;

		state.call( this, HEADERS_RECEIVED );

		this.status      = res.statusCode;
		this._resheaders = res.headers;

		if ( this._resheaders["set-cookie"] !== undefined && this._resheaders["set-cookie"] instanceof Array ) {
			this._resheaders["set-cookie"] = this._resheaders["set-cookie"].join( ";" );
		}

		res.on( "data", function ( arg ) {
			res.setEncoding( "utf8" );

			if ( self._send ) {
				if ( arg ) {
					self.responseText += arg;
				}

				state.call( self, LOADING );
			}
		});

		res.on( "end", function () {
			if ( self._send ) {
				state.call( self, DONE );
				self._send = false;
			}
		});
	};

	/**
	 * Response error handler
	 *
	 * @method handlerError
	 * @param  {Object} e Error
	 * @return {Undefined} undefined
	 */
	handlerError = function ( e ) {
		this.status       = 500;
		this.statusText   = e;
		this.responseText = e !== undefined ? ( e.stack || e ) : e;
		this._error       = true;
		this._send        = false;
		this.dispatchEvent( "error" );
		state.call( this, DONE );
	};

	/**
	 * XMLHttpRequest
	 *
	 * @method XMLHttpRequest
	 * @constructor
	 * @return {Object} XMLHttpRequest instance
	 */
	XMLHttpRequest = function () {
		this.onabort            = null;
		this.onerror            = null;
		this.onload             = null;
		this.onloadend          = null;
		this.onloadstart        = null;
		this.onreadystatechange = null;
		this.readyState         = UNSENT;
		this.response           = null;
		this.responseText       = "";
		this.responseType       = "";
		this.responseXML        = null;
		this.status             = UNSENT;
		this.statusText         = "";

		// Psuedo private for prototype chain
		this._id                = utility.genId();
		this._error             = false;
		this._headers           = {};
		this._listeners         = {};
		this._params            = {};
		this._request           = null;
		this._resheaders        = {};
		this._send              = false;
	};

	/**
	 * Aborts a request
	 *
	 * @method abort
	 * @return {Object} XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.abort = function () {
		if ( this._request !== null ) {
			this._request.abort();
			this._request = null;
		}

		this.responseText = "";
		this.responseXML  = "";
		this._error       = true;
		this._headers     = {};

		if ( this._send === true || ready.test( this.readyState ) ) {
			this._send = false;
			state.call( this, DONE );
		}

		this.dispatchEvent( "abort" );
		this.readyState = UNSENT;

		return this;
	};

	/**
	 * Adds an event listener to an XMLHttpRequest instance
	 *
	 * @method addEventListener
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.addEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			this._listeners[event] = [];
		}

		this._listeners[event].add( fn );

		return this;
	};

	/**
	 * Dispatches an event
	 *
	 * @method dispatchEvent
	 * @param  {String} event Name of event
	 * @return {Object}       XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.dispatchEvent = function ( event ) {
		var self = this;

		if ( typeof this["on" + event] === "function" ) {
			this["on" + event]();
		}

		if ( this._listeners.hasOwnProperty( event )) {
			array.each( this._listeners[event], function ( i ) {
				if ( typeof i === "function" ) {
					i.call( self );
				}
			});
		}

		return this;
	};

	/**
	 * Gets all response headers
	 *
	 * @method getAllResponseHeaders
	 * @return {Object} Response headers
	 */
	XMLHttpRequest.prototype.getAllResponseHeaders = function () {
		var result = "";

		if ( this.readyState < HEADERS_RECEIVED ) {
			throw new Error( label.error.invalidStateNoHeaders );
		}

		utility.iterate( this._resheaders, function ( v, k ) {
			result += k + ": " + v + "\n";
		});

		return result;
	};

	/**
	 * Gets a specific response header
	 *
	 * @method getResponseHeader
	 * @param  {String} header Header to get
	 * @return {String}        Response header value
	 */
	XMLHttpRequest.prototype.getResponseHeader = function ( header ) {
		var result;

		if ( this.readyState < HEADERS_RECEIVED || this._error ) {
			throw new Error( label.error.invalidStateNoHeaders );
		}

		result = this._resheaders[header] || this._resheaders[header.toLowerCase()];

		return result;
	};

	/**
	 * Prepares an XMLHttpRequest instance to make a request
	 *
	 * @method open
	 * @param  {String}  method   HTTP method
	 * @param  {String}  url      URL to receive request
	 * @param  {Boolean} async    [Optional] Asynchronous request
	 * @param  {String}  user     [Optional] Basic auth username
	 * @param  {String}  password [Optional] Basic auth password
	 * @return {Object}           XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.open = function ( method, url, async, user, password ) {
		var self = this;

		if ( async !== undefined && async !== true) {
			throw new Error( label.error.invalidStateNoSync );
		}

		this.abort();
		this._error  = false;
		this._params = {
			method   : method,
			url      : url,
			async    : async    || true,
			user     : user     || null,
			password : password || null
		};

		utility.iterate( headers, function ( v, k ) {
			self._headers[k] = v;
		});

		this.readyState = OPENED;

		return this;
	};

	/**
	 * Overrides the Content-Type of the request
	 *
	 * @method overrideMimeType
	 * @param  {String} mime Mime type of the request ( media type )
	 * @return {Object}      XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.overrideMimeType = function ( mime ) {
		this._headers["Content-Type"] = mime;

		return this;
	};

	/**
	 * Removes an event listener from an XMLHttpRequest instance
	 *
	 * @method removeEventListener
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.removeEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			return;
		}

		this._listeners[event].remove( fn );

		return this;
	};

	/**
	 * Sends an XMLHttpRequest request
	 *
	 * @method send
	 * @param  {Mixed} data [Optional] Payload to send with the request
	 * @return {Object}     XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.send = function ( data ) {
		data     = data || null;
		var self = this,
		    options, parsed, request, obj;

		if ( this.readyState < OPENED ) {
			throw new Error( label.error.invalidStateNotOpen );
		}
		else if ( this._send ) {
			throw new Error( label.error.invalidStateNotSending );
		}

		parsed      = utility.parse( this._params.url );
		parsed.port = parsed.port || ( parsed.protocol === "https:" ? 443 : 80 );

		if ( this._params.user !== null && this._params.password !== null ) {
			parsed.auth = this._params.user + ":" + this._params.password;
		}

		// Specifying Content-Length accordingly
		if ( regex.put_post.test( this._params.method ) ) {
			this._headers["Content-Length"] = data !== null ? Buffer.byteLength( data ) : 0;
		}

		this._headers.Host = parsed.hostname + ( !regex.http_ports.test( parsed.port ) ? ":" + parsed.port : "" );

		options = {
			hostname : parsed.hostname,
			path     : parsed.path,
			port     : parsed.port,
			method   : this._params.method,
			headers  : this._headers
		};

		if ( parsed.protocol === "https:" ) {
			options.rejectUnauthorized = false;
			options.agent              = false;
		}

		if ( parsed.auth !== undefined ) {
			options.auth = parsed.auth;
		}

		self._send = true;
		self.dispatchEvent( "readystatechange" );

		obj = parsed.protocol === "http:" ? http : https;

		request = obj.request( options, function ( arg ) {
			handler.call( self, arg );
		}).on( "error", function ( e ) {
			handlerError.call( self, e );
		});

		data === null ? request.setSocketKeepAlive( true, 10000 ) : request.write( data, "utf8" );
		this._request = request;
		request.end();

		self.dispatchEvent( "loadstart" );

		return this;
	};

	/**
	 * Sets a request header of an XMLHttpRequest instance
	 *
	 * @method setRequestHeader
	 * @param {String} header HTTP header
	 * @param {String} value  Header value
	 * @return {Object}       XMLHttpRequest instance
	 */
	XMLHttpRequest.prototype.setRequestHeader = function ( header, value ) {
		if ( this.readyState !== OPENED ) {
			throw new Error( label.error.invalidStateNotUsable );
		}
		else if ( this._send ) {
			throw new Error( label.error.invalidStateNotSending );
		}

		this._headers[header] = value;

		return this;
	};

	return XMLHttpRequest;
};

/** @namespace xml */
var xml = {
	/**
	 * Returns XML (Document) Object from a String
	 *
	 * @method decode
	 * @param  {String} arg XML String
	 * @return {Object}     XML Object or undefined
	 */
	decode : function () {
		if ( server || !client.ie || client.version > 8 ) {
			return function ( arg ) {
				if ( typeof arg !== "string" || string.isEmpty( arg ) ) {
					throw new Error( label.error.invalidArguments );
				}

				return new DOMParser().parseFromString( arg, "text/xml" );
			};
		}
		else {
			return function ( arg ) {
				var x;

				if ( typeof arg !== "string" || string.isEmpty( arg ) ) {
					throw new Error( label.error.invalidArguments );
				}

				x = new ActiveXObject( "Microsoft.XMLDOM" );
				x.async = "false";
				x.loadXML( arg );

				return x;
			};
		}
	}(),

	/**
	 * Returns XML String from an Object or Array
	 *
	 * @method encode
	 * @param  {Mixed} arg Object or Array to cast to XML String
	 * @return {String}    XML String or undefined
	 */
	encode : function ( arg, wrap ) {
		try {
			if ( arg === undefined ) {
				throw new Error( label.error.invalidArguments );
			}

			wrap    = ( wrap !== false );
			var x   = wrap ? "<xml>" : "",
			    top = ( arguments[2] !== false ),
			    node;

			/**
			 * Encodes a value as a node
			 *
			 * @method node
			 * @private
			 * @param  {String} name  Node name
			 * @param  {Value}  value Node value
			 * @return {String}       Node
			 */
			node = function ( name, value ) {
				var output = "<n>v</n>";

				output = output.replace( "v", ( regex.cdata.test( value ) ? "<![CDATA[" + value + "]]>" : value ) );
				return output.replace(/<(\/)?n>/g, "<$1" + name + ">");
			};

			if ( arg !== null && arg.xml !== undefined ) {
				arg = arg.xml;
			}

			if ( arg instanceof Document ) {
				arg = ( new XMLSerializer() ).serializeToString( arg );
			}

			if ( regex.boolean_number_string.test( typeof arg ) ) {
				x += node( "item", arg );
			}
			else if ( typeof arg === "object" ) {
				utility.iterate( arg, function ( v, k ) {
					x += xml.encode( v, ( typeof v === "object" ), false ).replace( /item|xml/g, isNaN( k ) ? k : "item" );
				});
			}

			x += wrap ? "</xml>" : "";

			if ( top ) {
				x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;
			}

			return x;
		}
		catch ( e ) {
			utility.error( e, arguments, this );

			return undefined;
		}
	},

	/**
	 * Validates `arg` is XML
	 *
	 * @method valid
	 * @param  {String} arg String to validate
	 * @return {Boolean}    `true` if valid XML
	 */
	valid : function () {
		if ( server || !client.ie || client.version > 8 ) {
			return function ( arg ) {
				return ( xml.decode( arg ).getElementsByTagName( "parsererror" ).length === 0 );
			};
		}
		else {
			return function ( arg ) {
				return ( xml.decode( arg ).parseError.errorCode === 0 );
			};
		}
	}()
};

/**
 * Bootstraps framework and sets on $
 *
 * @method bootstrap
 * @private
 * @return {Undefined} undefined
 */
bootstrap = function () {
	var self = this,
	    cleanup, fn;

	// Removes references to deleted DOM elements, avoiding memory leaks
	cleanup = function ( obj ) {
		observer.remove( obj );
		array.each( array.cast( obj.childNodes ), function ( i ) {
			cleanup( i );
		});
	};

	// Repeating function to call init()
	fn = function () {
		if ( regex.complete_loaded.test( document.readyState ) ) {
			if ( typeof self.init === "function" ) {
				self.init.call( self );
			}

			return false;
		}
	};

	// Blocking multiple executions
	delete this.bootstrap;

	// Creating error log
	this.error.log = [];

	// Describing the Client
	if ( !server ) {
		this.client.version = client.version = client.version();
		this.client.mobile  = client.mobile.call( this );
		this.client.tablet  = client.tablet.call( this );

		// IE7 and older is not supported
		if ( client.ie && client.version < 8 ) {
			throw new Error( label.error.upgrade );
		}

		// Strategies
		this.array.cast = array.cast();
		this.mouse.view = mouse.view();
		this.property   = utility.property = utility.property();

		if ( Array.prototype.filter === undefined ) {
			Array.prototype.filter = function ( fn, self ) {
				self       = self || this;
				var result = [];

				if ( self === undefined || self === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					if ( fn.call( self, i ) ) {
						result.push( i );
					}
				});

				return result;
			};
		}

		if ( Array.prototype.forEach === undefined ) {
			Array.prototype.forEach = function ( fn, self ) {
				self = self || this;

				if ( this === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					fn.call( self, i );
				});
			};
		}

		if ( Array.prototype.indexOf === undefined ) {
			Array.prototype.indexOf = function( arg, start ) {
				var nth = this.length >> 0,
				    i   = ( start || 0 ) -1;

				if ( this === undefined || this === null || arg === undefined ) {
					throw new Error( label.error.invalidArguments );
				}

				while ( ++i < nth ) {
					if ( this[i] === arg ) {
						return i;
					}
				}

				return -1;
			};
		}

		if ( Array.prototype.map === undefined ) {
			Array.prototype.map = function ( fn, self ) {
				self       = self || this;
				var result = [];

				if ( self === undefined || self === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				array.each( self, function ( i ) {
					result.push( fn.call( self, i ) );
				});

				return result;
			};
		}

		if ( Array.prototype.reduce === undefined ) {
			Array.prototype.reduce = function ( fn, x ) {
				var nth = this.length >> 0,
				    i   = 0;

				if ( this === undefined || this === null || typeof fn !== "function" ) {
					throw new Error( label.error.invalidArguments );
				}

				if ( x === undefined ) {
					if ( nth === 0 ) {
						throw new Error( label.error.invalidArguments );
					}

					x = this[0];
					i = 1;
				}

				i--;

				while ( ++i < nth ) {
					x = fn.call( this, x, this[i] );
				}

				return x;
			};
		}

		if ( Element.prototype.getElementsByClassName === undefined ) {
			( function () {
				var getElementsByClassName = function ( arg ) {
					return document.querySelectorAll( "." + arg );
				};

				if ( typeof HTMLDocument != "undefined" ) {
					Element.prototype.getElementsByClassName = HTMLDocument.prototype.getElementsByClassName = getElementsByClassName;
				}
				else {
					Element.prototype.getElementsByClassName = getElementsByClassName;
				}
			})();
		}

		if ( document.documentElement.classList === undefined ) {
			( function ( view ) {
				var ClassList, getter, proto, target, descriptor;

				if ( !( "HTMLElement" in view ) && !( "Element" in view ) ) {
					return;
				}

				ClassList = function ( obj ) {
					var classes = string.explode( obj.className, " " ),
					    self    = this;

					array.each( classes, function (i) {
						self.push( i );
					});

					this.updateClassName = function () {
						obj.className = this.join( " " );
					};
				};

				getter = function () {
					return new ClassList( this );
				};

				proto  = ClassList.prototype = [];
				target = ( view.HTMLElement || view.Element ).prototype;

				proto.add = function ( arg ) {
					if ( !array.contains( this, arg ) ) {
						this.push( arg );
						this.updateClassName();
					}
				};

				proto.contains = function ( arg ) {
					return array.contains( this, arg );
				};

				proto.remove = function ( arg ) {
					if ( array.contains(this, arg) ) {
						array.remove( this, arg );
						this.updateClassName();
					}
				};

				proto.toggle = function ( arg ) {
					array[array.contains( this, arg) ? "remove" : "add"]( this, arg );
					this.updateClassName();
				};

				if ( Object.defineProperty ) {
					descriptor = {
						get          : getter,
						enumerable   : !client.ie || client.version > 8 ? true : false,
						configurable : true
					};

					Object.defineProperty( target, "classList", descriptor );
				}
				else if ( Object.prototype.__defineGetter__) {
					target.__defineGetter__( "classList", getter );
				}
				else {
					throw new Error( "Could not create classList shim" );
				}
			})( global );
		}

		if ( Function.prototype.bind === undefined ) {
			Function.prototype.bind = function ( arg ) {
				var fn    = this,
				    args  = slice.call( arguments, 1 );

				return function () {
					return fn.apply( arg, args.concat( slice.call( arguments ) ) );
				};
			};
		}
	}
	else {
		// Strategies
		this.array.cast = array.cast();
		this.property   = utility.property = utility.property();

		// XHR shim
		XMLHttpRequest = xhr();
	}

	// Caching functions
	has   = Object.prototype.hasOwnProperty;
	slice = Array.prototype.slice;

	// Binding helper & namespace to $
	$ = utility.$;
	utility.merge( $, this );
	delete $.init;
	delete $.loading;

	// Hooking abaaso into native Objects
	utility.proto( Array, "array" );

	if ( typeof Element !== "undefined" ) {
		utility.proto( Element, "element" );
	}

	if ( client.ie && client.version === 8 ) {
		utility.proto( HTMLDocument, "element" );
	}

	utility.proto( Function, "function" );
	utility.proto( Math,     "math" );
	utility.proto( Number,   "number" );
	utility.proto( String,   "string" );

	// Setting events & garbage collection
	if ( !server ) {
		observer.add( global, "error", function ( e ) {
			observer.fire( abaaso, "error", e );
		}, "error", global, "all");

		observer.add( global, "hashchange", function ()  {
			observer.fire( abaaso, "beforeHash, hash, afterHash", location.hash );
		}, "hash", global, "all" );

		observer.add( global, "load", function ()  {
			observer.fire( abaaso, "render" );
			observer.remove( abaaso, "render" );
			observer.remove( this, "load" );
		});

		if ( typeof Object.observe === "function" ) {
			observer.add( global, "DOMNodeInserted", function ( e ) {
				var obj = utility.target( e );

				Object.observe( obj, function ( arg ) {
					observer.fire( obj, "change", arg );
				});
			}, "mutation", global, "all");
		}

		observer.add( global, "DOMNodeRemoved", function (e ) {
			var obj = utility.target( e );

			if ( obj.id !== undefined && !string.isEmpty( obj.id ) && ( e.relatedNode instanceof Element ) ) {
				cleanup( obj );
			}
		}, "mutation", global, "all");
	}

	// Creating a public facade for `state`
	if ( !client.ie || client.version > 8 ) {
		utility.property( this.state, "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( this.state, "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( this.state, "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
		utility.property( $.state,    "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( $.state,    "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( $.state,    "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
	}
	else {
		// Pure hackery, only exists when needed
		$.state.current   = this.state.current   = this.state._current;
		$.state.change    = this.state.change    = function ( arg) { return self.state.current = state.setCurrent(arg ); };
		$.state.setHeader = this.state.setHeader = function ( arg) { return self.state.header  = state.setHeader(arg ); };
	}

	$.ready = this.ready = true;

	// Initializing
	if ( typeof exports !== "undefined" || typeof define == "function" || regex.complete_loaded.test( document.readyState ) ) {
		this.init();
	}
	else if ( typeof document.addEventListener === "function" ) {
		document.addEventListener( "DOMContentLoaded" , function () {
			self.init.call( self );
		}, false);
	}
	else if ( typeof document.attachEvent === "function" ) {
		document.attachEvent( "onreadystatechange" , fn );
	}
	else {
		utility.repeat( fn );
	}
};

return {
	// Classes
	array           : array,
	callback        : {},
	client          : {
		activex    : client.activex,
		android    : client.android,
		blackberry : client.blackberry,
		chrome     : client.chrome,
		firefox    : client.firefox,
		ie         : client.ie,
		ios        : client.ios,
		linux      : client.linux,
		mobile     : client.mobile,
		opera      : client.opera,
		osx        : client.osx,
		playbook   : client.playbook,
		safari     : client.safari,
		tablet     : client.tablet,
		version    : 0,
		webos      : client.webos,
		windows    : client.windows,
		del        : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "DELETE", success, failure, null, headers, timeout );
		},
		get        : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "GET", success, failure, null, headers, timeout );
		},
		headers    : function ( uri, success, failure, timeout ) {
			return client.request( uri, "HEAD", success, failure, null, null, timeout );
		},
		patch      : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PATCH", success, failure, args, headers, timeout );
		},
		post       : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "POST", success, failure, args, headers, timeout );
		},
		put        : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PUT", success, failure, args, headers, timeout );
		},
		jsonp      : function ( uri, success, failure, callback ) {
			return client.jsonp(uri, success, failure, callback );
		},
		options    : function ( uri, success, failure, timeout ) {
			return client.request(uri, "OPTIONS", success, failure, null, null, timeout );
		},
		permissions: client.permissions,
		scrollPos  : client.scrollPos,
		size       : client.size
	},
	cookie          : cookie,
	element         : element,
	json            : json,
	label           : label,
	loading         : {
		create  : utility.loading,
		url     : null
	},
	math            : math,
	message         : message,
	mouse           : mouse,
	number          : number,
	regex           : regex,
	state           : {},
	string          : string,
	xml             : xml,

	// Methods & Properties
	alias           : utility.alias,
	allows          : client.allows,
	append          : function ( type, args, obj ) {
		if ( obj instanceof Element ) {
			obj.genId();
		}

		return element.create( type, args, obj, "last" );
	},
	bootstrap       : bootstrap,
	channel         : channel,
	clear           : element.clear,
	clearTimer      : utility.clearTimers,
	clone           : utility.clone,
	coerce          : utility.coerce,
	compile         : utility.compile,
	create          : element.create,
	css             : utility.css,
	data            : data,
	datalist        : datalist.factory,
	discard         : function ( arg ) {
		return observer.discard( arg );
	},
	debounce        : utility.debounce,
	decode          : json.decode,
	defer           : deferred,
	define          : utility.define,
	del             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "DELETE", success, failure, null, headers, timeout );
	},
	delay           : utility.defer,
	destroy         : element.destroy,
	each            : array.each,
	encode          : json.encode,
	error           : utility.error,
	expire          : cache.clean,
	expires         : 120000,
	fib             : utility.fib,
	extend          : utility.extend,
	filter          : filter,
	fire            : function ( obj, event ) {
		var all  = typeof obj === "object",
		    o    = all ? obj   : this,
		    e    = all ? event : obj,
		    args = [o, e].concat( array.remove( array.cast( arguments ), 0, !all ? 0 : 1 ) );

		return observer.fire.apply( observer, args );
	},
	frag            : element.frag,
	genId           : utility.genId,
	get             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "GET", success, failure, null, headers, timeout );
	},
	grid            : grid,
	guid            : function () {
		return utility.uuid().toUpperCase();
	},
	hash            : utility.hash,
	headers         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "HEAD", success, failure, null, {}, timeout );
	},
	hex             : utility.hex,
	hidden          : element.hidden,
	hook            : observer.decorate,
	id              : "abaaso",
	init            : function () {
		// Stopping multiple executions
		delete abaaso.init;

		// Cache garbage collector (every minute)
		utility.repeat( function () {
			cache.clean();
		}, 60000, "cacheGarbageCollector");

		// Firing events to setup
		return observer.fire( this, "init, ready" ).un( this, "init, ready" );
	},
	iterate         : utility.iterate,
	jsonp           : function ( uri, success, failure, callback) {
		return client.jsonp( uri, success, failure, callback );
	},
	listeners       : function ( obj, event ) {
		return observer.list( typeof obj === "object" ? obj : this, event );
	},
	listenersTotal  : observer.sum,
	log             : utility.log,
	logging         : observer.log,
	lru             : lru,
	merge           : utility.merge,
	module          : utility.module,
	object          : utility.object,
	observerable    : observer.decorate,
	on              : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = this;
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) {
			s = o;
		}

		return observer.add( o, e, l, i, s, st );
	},
	once            : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = this;
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) {
			s = o;
		}

		return observer.once( o, e, l, i, s, st );
	},
	options         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
	},
	parse           : utility.parse,
	patch           : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PATCH", success, failure, args, headers, timeout );
	},
	pause           : function ( arg ) {
		return observer.pause( ( arg !== false ) );
	},
	permissions     : client.permissions,
	position        : element.position,
	post            : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "POST", success, failure, args, headers, timeout );
	},
	prepend         : function ( type, args, obj ) {
		if ( obj instanceof Element ) {
			obj.genId();
		}

		return element.create( type, args, obj, "first" );
	},
	promise         : promise.factory,
	property        : utility.property,
	put             : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PUT", success, failure, args, headers, timeout );
	},
	queryString     : function ( key, string ) {
		return utility.queryString( key, string );
	},
	random          : number.random,
	ready           : false,
	reflect         : utility.reflect,
	repeat          : utility.repeat,
	repeating       : function () {
		return array.keys( utility.repeating );
	},
	script          : client.script,
	scroll          : client.scroll,
	scrollTo        : element.scrollTo,
	stylesheet      : client.stylesheet,
	stop            : utility.stop,
	store           : data,
	target          : utility.target,
	tpl             : utility.tpl,
	un              : function ( obj, event, id, state ) {
		var all = typeof obj === "object",
		    o, e, i, s;

		if ( all ) {
			o = obj;
			e = event;
			i = id;
			s = state;
		}
		else {
			o = this;
			e = obj;
			i = event;
			s = id;
		}

		return observer.remove( o, e, i, s );
	},
	update          : element.update,
	uuid            : utility.uuid,
	validate        : validate.test,
	version         : "3.10.44",
	walk            : utility.walk,
	when            : utility.when
};

})();

// Bootstrapping the framework
abaaso.bootstrap();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = $;
}
else if ( typeof define === "function" ) {
	define( "abaaso", function () {
		return $;
	});
}
else {
	global.abaaso = $;
}
})( this );
