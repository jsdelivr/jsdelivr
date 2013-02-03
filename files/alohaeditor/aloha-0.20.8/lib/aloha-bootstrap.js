
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

// define jquery and ext modules. They need to be available in global namespace
define('aloha/jquery',[], function() {
	// Work-around for http://bugs.jquery.com/ticket/9905
	// and https://github.com/alohaeditor/Aloha-Editor/issues/397
	if ( !Aloha.jQuery.support.getSetAttribute ) {
		( function( global ) {
			Aloha.jQuery.removeAttr = function( elem, name ) {
				elem.removeAttribute( name );
			};
		}( Aloha ));
	}

	return Aloha.jQuery;
});

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

define('aloha/ext',[], function() {
	
	// Ext seems to have an onClick handler that uses
	// QuickTips, but the handler doesn't initialize
	// QuickTips and therefore causes an error.
	// The bug occurred with the Gentics Content Node
	// integration, but if it's really a bug in Ext, then
	// it's a good idea to always initialize QuickTips here.
	Ext.QuickTips.init();
	
	return Ext; 
});

/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
define( 'util/json2', [], function(){} );

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

define('vendor/jquery.json-2.2.min',['aloha/jquery'],
function($) {$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};
});


/*
 * jQuery store - Plugin for persistent data storage using localStorage, userData (and window.name)
 *
 * Authors: Rodney Rehm
 * Web: http://medialize.github.com/jQuery-store/
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

/**********************************************************************************
 * INITIALIZE EXAMPLES:
 **********************************************************************************
 * 	// automatically detect best suited storage driver and use default serializers
 *	$.storage = new $.store();
 *	// optionally initialize with specific driver and or serializers
 *	$.storage = new $.store( [driver] [, serializers] );
 *		driver		can be the key (e.g. "windowName") or the driver-object itself
 *		serializers	can be a list of named serializers like $.store.serializers
 **********************************************************************************
 * USAGE EXAMPLES:
 **********************************************************************************
 *	$.storage.get( key );			// retrieves a value
 *	$.storage.set( key, value );	// saves a value
 *	$.storage.del( key );			// deletes a value
 *	$.storage.flush();				// deletes aall values
 **********************************************************************************
 */



define('vendor/jquery.store',[
 'aloha/jquery',
 'util/json2'
],
function($, __unused_json, undefined) {

/**********************************************************************************
 * $.store base and convinience accessor
 **********************************************************************************/

$.store = function( driver, serializers )
{
	var JSON = window.JSON
		that = this;

	if( typeof driver == 'string' )
	{
		if( $.store.drivers[ driver ] )
			this.driver = $.store.drivers[ driver ];
		else
			throw new Error( 'Unknown driver '+ driver );
	}
	else if( typeof driver == 'object' )
	{
		var invalidAPI = !$.isFunction( driver.init )
			|| !$.isFunction( driver.get )
			|| !$.isFunction( driver.set )
			|| !$.isFunction( driver.del )
			|| !$.isFunction( driver.flush );

		if( invalidAPI )
			throw new Error( 'The specified driver does not fulfill the API requirements' );

		this.driver = driver;
	}
	else
	{
		// detect and initialize storage driver
		$.each( $.store.drivers, function()
		{
			// skip unavailable drivers
			if( !$.isFunction( this.available ) || !this.available() )
				return true; // continue;

			that.driver = this;
			if( that.driver.init() === false )
			{
				that.driver = null;
				return true; // continue;
			}

			return false; // break;
		});
	}

	// use default serializers if not told otherwise
	if( !serializers )
		serializers = $.store.serializers;

	// intialize serializers
	this.serializers = {};
	$.each( serializers, function( key, serializer )
	{
		// skip invalid processors
		if( !$.isFunction( this.init ) )
			return true; // continue;

		that.serializers[ key ] = this;
		that.serializers[ key ].init( that.encoders, that.decoders );
	});
};


/**********************************************************************************
 * $.store API
 **********************************************************************************/

$.extend( $.store.prototype, {
	get: function( key )
	{
		var value = this.driver.get( key );
		return this.driver.encodes ? value : this.unserialize( value );
	},
	set: function( key, value )
	{
		this.driver.set( key, this.driver.encodes ? value : this.serialize( value ) );
	},
	del: function( key )
	{
		this.driver.del( key );
	},
	flush: function()
	{
		this.driver.flush();
	},
	driver : undefined,
	encoders : [],
	decoders : [],
	serialize: function( value )
	{
		var that = this;

		$.each( this.encoders, function()
		{
			var serializer = that.serializers[ this + "" ];
			if( !serializer || !serializer.encode )
				return true; // continue;
			try
			{
				value = serializer.encode( value );
			}
			catch( e ){}
		});

		return value;
	},
	unserialize: function( value )
	{
		var that = this;
		if( !value )
			return value;

		$.each( this.decoders, function()
		{
			var serializer = that.serializers[ this + "" ];
			if( !serializer || !serializer.decode )
				return true; // continue;

			value = serializer.decode( value );
		});

		return value;
	}
});


/**********************************************************************************
 * $.store drivers
 **********************************************************************************/

$.store.drivers = {
	// Firefox 3.5, Safari 4.0, Chrome 5, Opera 10.5, IE8
	'localStorage': {
		// see https://developer.mozilla.org/en/dom/storage#localStorage
		ident: "$.store.drivers.localStorage",
		scope: 'browser',
		available: function()
		{
			try
			{
				return !!window.localStorage;
			}
			catch(e)
			{
				// Firefox won't allow localStorage if cookies are disabled
				return false;
			}
		},
		init: $.noop,
		get: function( key )
		{
			return window.localStorage.getItem( key );
		},
		set: function( key, value )
		{
			window.localStorage.setItem( key, value );
		},
		del: function( key )
		{
			window.localStorage.removeItem( key );
		},
		flush: function()
		{
			window.localStorage.clear();
		}
	},

	// IE6, IE7
	'userData': {
		// see http://msdn.microsoft.com/en-us/library/ms531424.aspx
		ident: "$.store.drivers.userData",
		element: null,
		nodeName: 'userdatadriver',
		scope: 'browser',
		initialized: false,
		available: function()
		{
			try
			{
				return !!( document.documentElement && document.documentElement.addBehavior );
			}
			catch(e)
			{
				return false;
			}
		},
		init: function()
		{
			// $.store can only utilize one userData store at a time, thus avoid duplicate initialization
			if( this.initialized )
				return;

			try
			{
				// Create a non-existing element and append it to the root element (html)
				this.element = document.createElement( this.nodeName );
				document.documentElement.insertBefore( this.element, document.getElementsByTagName('title')[0] );
				// Apply userData behavior
				this.element.addBehavior( "#default#userData" );
				this.initialized = true;
			}
			catch( e )
			{
				return false;
			}
		},
		get: function( key )
		{
			this.element.load( this.nodeName );
			return this.element.getAttribute( key );
		},
		set: function( key, value )
		{
			this.element.setAttribute( key, value );
			this.element.save( this.nodeName );
		},
		del: function( key )
		{
			this.element.removeAttribute( key );
			this.element.save( this.nodeName );

		},
		flush: function()
		{
			// flush by expiration
			this.element.expires = (new Date).toUTCString();
			this.element.save( this.nodeName );
		}
	},

	// most other browsers
	'windowName': {
		ident: "$.store.drivers.windowName",
		scope: 'window',
		cache: {},
		encodes: true,
		available: function()
		{
			return true;
		},
		init: function()
		{
			this.load();
		},
		save: function()
		{
			window.name = $.store.serializers.json.encode( this.cache );
		},
		load: function()
		{
			try
			{
				this.cache = $.store.serializers.json.decode( window.name + "" );
				if( typeof this.cache != "object" )
					this.cache = {};
			}
			catch(e)
			{
				this.cache = {};
				window.name = "{}";
			}
		},
		get: function( key )
		{
			return this.cache[ key ];
		},
		set: function( key, value )
		{
			this.cache[ key ] = value;
			this.save();
		},
		del: function( key )
		{
			try
			{
				delete this.cache[ key ];
			}
			catch(e)
			{
				this.cache[ key ] = undefined;
			}

			this.save();
		},
		flush: function()
		{
			window.name = "{}";
		}
	}
};

/**********************************************************************************
 * $.store serializers
 **********************************************************************************/

$.store.serializers = {

	'json': {
		ident: "$.store.serializers.json",
		init: function( encoders, decoders )
		{
			encoders.push( "json" );
			decoders.push( "json" );
		},
		encode: JSON.stringify,
		decode: JSON.parse
	},

	// TODO: html serializer
	// 'html' : {},

	'xml': {
		ident: "$.store.serializers.xml",
		init: function( encoders, decoders )
		{
			encoders.unshift( "xml" );
			decoders.push( "xml" );
		},

		// wouldn't be necessary if jQuery exposed this function
		isXML: function( value )
		{
			var documentElement = ( value ? value.ownerDocument || value : 0 ).documentElement;
			return documentElement ? documentElement.nodeName.toLowerCase() !== "html" : false;
		},

		// encodes a XML node to string (taken from $.jStorage, MIT License)
		encode: function( value )
		{
			if( !value || value._serialized || !this.isXML( value ) )
				return value;

			var _value = { _serialized: this.ident, value: value };

			try
			{
				// Mozilla, Webkit, Opera
				_value.value = new XMLSerializer().serializeToString( value );
				return _value;
			}
			catch(E1)
			{
				try
				{
					// Internet Explorer
					_value.value = value.xml;
					return _value;
				}
				catch(E2){}
			}

			return value;
		},

		// decodes a XML node from string (taken from $.jStorage, MIT License)
		decode: function( value )
		{
			if( !value || !value._serialized || value._serialized != this.ident )
				return value;

			var dom_parser = ( "DOMParser" in window && (new DOMParser()).parseFromString );
			if( !dom_parser && window.ActiveXObject )
			{
				dom_parser = function( _xmlString )
				{
					var xml_doc = new ActiveXObject( 'Microsoft.XMLDOM' );
					xml_doc.async = 'false';
					xml_doc.loadXML( _xmlString );
					return xml_doc;
				}
			}

			if( !dom_parser )
			{
				return undefined;
			}

			value.value = dom_parser.call(
				"DOMParser" in window && (new DOMParser()) || window,
				value.value,
				'text/xml'
			);

			return this.isXML( value.value ) ? value.value : undefined;
		}
	}
};


	// We don't want to use window storage for ie7 with aloha because this causes massive issues when dealing with frames. 
	// Window.name will change the framename and this will cause links with target attribute to stop working properly. 
	// We remove the windowName driver and add the void driver which won't store any information.
	if ( $.browser.msie && $.browser.version  == "7.0" ) {
		delete($.store.drivers.windowName);
		var voidDriver = {
				ident: "$.store.drivers.voidDriver",
				scope: 'void',
				cache: {},
				encodes: true,
				available: function()
				{
					return true;
				},
				init: function()
				{
				},
				save: function()
				{
				},
				get: function( key )
				{
				},
				set: function( key, value )
				{
				},
				del: function( key )
				{
				},
				flush: function()
				{
				}
			};
		$.store.drivers.voidDriver=voidDriver;
	} 

});

/**
 * @license Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2011, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.1
 * Build date: 8 October 2011
 */
define( 'aloha/rangy-core', [], function(){} );
var rangy = (function() {


    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"];

    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark",
        "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    var api = {
        version: "1.2.1",
        initialized: false,
        supported: true,

        util: {
            isHostMethod: isHostMethod,
            isHostObject: isHostObject,
            isHostProperty: isHostProperty,
            areHostMethods: areHostMethods,
            areHostObjects: areHostObjects,
            areHostProperties: areHostProperties,
            isTextRange: isTextRange
        },

        features: {},

        modules: {},
        config: {
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function fail(reason) {
        window.alert("Rangy not supported in your browser. Reason: " + reason);
        api.initialized = true;
        api.supported = false;
    }

    api.fail = fail;

    function warn(msg) {
        var warningMessage = "Rangy warning: " + msg;
        if (api.config.alertOnWarn) {
            window.alert(warningMessage);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(warningMessage);
        }
    }

    api.warn = warn;

    if ({}.hasOwnProperty) {
        api.util.extend = function(o, props) {
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o[i] = props[i];
                }
            }
        };
    } else {
        fail("hasOwnProperty not supported");
    }

    var initListeners = [];
    var moduleInitializers = [];

    // Initialization
    function init() {
        if (api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
            testRange.detach();
        }

        var body = isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are implemented");
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules and call init listeners
        var allListeners = moduleInitializers.concat(initListeners);
        for (var i = 0, len = allListeners.length; i < len; ++i) {
            try {
                allListeners[i](api);
            } catch (ex) {
                if (isHostObject(window, "console") && isHostMethod(window.console, "log")) {
                    window.console.log("Init listener threw an exception. Continuing.", ex);
                }

            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var createMissingNativeApiListeners = [];

    api.addCreateMissingNativeApiListener = function(listener) {
        createMissingNativeApiListeners.push(listener);
    };

    function createMissingNativeApi(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = createMissingNativeApiListeners.length; i < len; ++i) {
            createMissingNativeApiListeners[i](win);
        }
    }

    api.createMissingNativeApi = createMissingNativeApi;

    /**
     * @constructor
     */
    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype.fail = function(reason) {
        this.initialized = true;
        this.supported = false;

        throw new Error("Module '" + this.name + "' failed to load: " + reason);
    };

    Module.prototype.warn = function(msg) {
        api.warn("Module " + this.name + ": " + msg);
    };

    Module.prototype.createError = function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
    };

    api.createModule = function(name, initFunc) {
        var module = new Module(name);
        api.modules[name] = module;

        moduleInitializers.push(function(api) {
            initFunc(api, module);
            module.initialized = true;
            module.supported = true;
        });
    };

    api.requireModules = function(modules) {
        for (var i = 0, len = modules.length, module, moduleName; i < len; ++i) {
            moduleName = modules[i];
            module = api.modules[moduleName];
            if (!module || !(module instanceof Module)) {
                throw new Error("Module '" + moduleName + "' not found");
            }
            if (!module.supported) {
                throw new Error("Module '" + moduleName + "' not supported");
            }
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before running tests

    var docReady = false;

    var loadHandler = function(e) {

        if (!docReady) {
            docReady = true;
            if (!api.initialized) {
                init();
            }
        }
    };

    // Test whether we have window and document objects that we will need
    if (typeof window == UNDEFINED) {
        fail("No window found");
        return;
    }
    if (typeof document == UNDEFINED) {
        fail("No document found");
        return;
    }

    if (isHostMethod(document, "addEventListener")) {
        document.addEventListener("DOMContentLoaded", loadHandler, false);
    }

    // Add a fallback in case the DOMContentLoaded event isn't supported
    if (isHostMethod(window, "addEventListener")) {
        window.addEventListener("load", loadHandler, false);
    } else if (isHostMethod(window, "attachEvent")) {
        window.attachEvent("onload", loadHandler);
    } else {
        fail("Window does not have required addEventListener or attachEvent method");
    }

    return api;
})();
rangy.createModule("DomUtil", function(api, module) {

    var UNDEF = "undefined";
    var util = api.util;

    // Perform feature tests
    if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
    }

    if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
    }

    var el = document.createElement("div");
    if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
    }

    // innerHTML is required for Range's createContextualFragment method
    if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
    }

    var textNode = document.createTextNode("test");
    if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
            !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
    // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
    // contains just the document as a single element and the value searched for is the document.
    var arrayContains = /*Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        }:*/

        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
    function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
    }

    function parentElement(node) {
        var parent = node.parentNode;
        return (parent.nodeType == 1) ? parent : null;
    }

    function getNodeIndex(node) {
        var i = 0;
        while( (node = node.previousSibling) ) {
            i++;
        }
        return i;
    }

    function getNodeLength(node) {
        var childNodes;
        return isCharacterDataNode(node) ? node.length : ((childNodes = node.childNodes) ? childNodes.length : 0);
    }

    function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1; n; n = n.parentNode) {
            ancestors.push(n);
        }

        for (n = node2; n; n = n.parentNode) {
            if (arrayContains(ancestors, n)) {
                return n;
            }
        }

        return null;
    }

    function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
            if (n === ancestor) {
                return true;
            } else {
                n = n.parentNode;
            }
        }
        return false;
    }

    function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node : node.parentNode;
        while (n) {
            p = n.parentNode;
            if (p === ancestor) {
                return n;
            }
            n = p;
        }
        return null;
    }

    function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
    }

    function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    // Note that we cannot use splitText() because it is bugridden in IE 9.
    function splitDataNode(node, index) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);
        return newNode;
    }

    function getDocument(node) {
        if (node.nodeType == 9) {
            return node;
        } else if (typeof node.ownerDocument != UNDEF) {
            return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
            return node.document;
        } else if (node.parentNode) {
            return getDocument(node.parentNode);
        } else {
            throw new Error("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw new Error("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw new Error("getIframeWindow: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw new Error("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    function getRootContainer(node) {
        var parent;
        while ( (parent = node.parentNode) ) {
            node = parent;
        }
        return node;
    }

    /**
	 * This is a very ugly workaround for an IE9 issue Before comparing DOM
	 * elements "normalize" them. There are cases, where anchorNode and
	 * focusNode in a nativeselection point to DOM elements with same
	 * parentNode, same previousSibling and same nextSibling, but the nodes
	 * themselves are not the same
	 * If such nodes are compared in the comparePoints method, an error occurs.
	 * To fix this, we move to the previousSibling/nextSibling/parentNode and back, to hopefully get
	 * the "correct" node in the DOM
	 * @param node node to fix
	 * @return normalized node
	 */
    function fixNode(node) {
    	if (!node) {
    		return;
    	}
    	if (node.previousSibling) {
    		return node.previousSibling.nextSibling;
    	} else if (node.nextSibling) {
    		return node.nextSibling.previousSibling;
    	} else if (node.parentNode) {
    		return node.parentNode.firstChild;
    	} else {
    		return node;
    	}
    }

    function comparePoints(nodeA, offsetA, nodeB, offsetB) {
    	// fix the nodes before comparing them
    	nodeA = fixNode(nodeA);
    	nodeB = fixNode(nodeB);
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {

            // Case 1: nodes are the same
            return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {

            // Case 2: node C (container B or an ancestor) is a child node of A
            return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {

            // Case 3: node C (container A or an ancestor) is a child node of B
            return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
        } else {

            // Case 4: containers are siblings or descendants of siblings
            root = getCommonAncestor(nodeA, nodeB);
            childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
            childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

            if (childA === childB) {
                // This shouldn't be possible

                throw new Error("comparePoints got to case 4 and childA and childB are the same!");
            } else {
                n = root.firstChild;
                while (n) {
                    if (n === childA) {
                        return -1;
                    } else if (n === childB) {
                        return 1;
                    }
                    n = n.nextSibling;
                }
                throw new Error("Should not be here!");
            }
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    function inspectNode(node) {
        if (!node) {
            return "[No node]";
        }
        if (isCharacterDataNode(node)) {
            return '"' + node.data + '"';
        } else if (node.nodeType == 1) {
            var idAttr = node.id ? ' id="' + node.id + '"' : "";
            return "<" + node.nodeName + idAttr + ">[" + node.childNodes.length + "]";
        } else {
            return node.nodeName;
        }
    }

    /**
     * @constructor
     */
    function NodeIterator(root) {
        this.root = root;
        this._next = root;
    }

    NodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            var n = this._current = this._next;
            var child, next;
            if (this._current) {
                child = n.firstChild;
                if (child) {
                    this._next = child;
                } else {
                    next = null;
                    while ((n !== this.root) && !(next = n.nextSibling)) {
                        n = n.parentNode;
                    }
                    this._next = next;
                }
            }
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.root = null;
        }
    };

    function createIterator(root) {
        return new NodeIterator(root);
    }

    /**
     * @constructor
     */
    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return this.node === pos.node & this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        }
    };

    /**
     * @constructor
     */
    function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
    }

    DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11
    };

    DOMException.prototype.toString = function() {
        return this.message;
    };

    api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );


    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;
    
    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isAncestorOf(node, range.startContainer, true) || dom.isAncestorOf(node, range.endContainer, true));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function dispatchEvent(range, type, args) {
        var listeners = range._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].call(range, {target: range, args: args});
            }
        }
    }

    function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node));
    }

    function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node) + 1);
    }

    function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (dom.isCharacterDataNode(n)) {
            if (o == n.length) {
                dom.insertAfter(node, n);
            } else {
                n.parentNode.insertBefore(node, o == 0 ? n : dom.splitDataNode(n, o));
            }
        } else if (o >= n.childNodes.length) {
            n.appendChild(node);
        } else {
            n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
    }

    function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
            partiallySelected = iterator.isPartiallySelectedSubtree();

            node = node.cloneNode(!partiallySelected);
            if (partiallySelected) {
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(cloneSubtree(subIterator));
                subIterator.detach(true);
            }

            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node, subRangeIterator; node = rangeIterator.next(); ) {
            //log.debug("iterateSubtree, partially selected: " + rangeIterator.isPartiallySelectedSubtree(), nodeToString(node));
            if (rangeIterator.isPartiallySelectedSubtree()) {
                // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of the
                // node selected by the Range.
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendant
                it = dom.createIterator(node);
                while ( (n = it.next()) ) {
                    if (func(n) === false) {
                        iteratorState.stop = true;
                        return;
                    }
                }
            }
        }
    }

    function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
            if (iterator.isPartiallySelectedSubtree()) {
                subIterator = iterator.getSubtreeIterator();
                deleteSubtree(subIterator);
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
        }
    }

    function extractSubtree(iterator) {

        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {


            if (iterator.isPartiallySelectedSubtree()) {
                node = node.cloneNode(false);
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(extractSubtree(subIterator));
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function getNodesInRange(range, nodeTypes, filter) {
        //log.info("getNodesInRange, " + nodeTypes.join(","));
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
            regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }

        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node) {
            if ((!filterNodeTypes || regex.test(node.nodeType)) && (!filterExists || filter(node))) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    function inspect(range) {
        var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

    /**
     * @constructor
     */
    function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;



        if (!range.collapsed) {
            this.sc = range.startContainer;
            this.so = range.startOffset;
            this.ec = range.endContainer;
            this.eo = range.endOffset;
            var root = range.commonAncestorContainer;

            if (this.sc === this.ec && dom.isCharacterDataNode(this.sc)) {
                this.isSingleCharacterDataNode = true;
                this._first = this._last = this._next = this.sc;
            } else {
                this._first = this._next = (this.sc === root && !dom.isCharacterDataNode(this.sc)) ?
                    this.sc.childNodes[this.so] : dom.getClosestAncestorIn(this.sc, root, true);
                this._last = (this.ec === root && !dom.isCharacterDataNode(this.ec)) ?
                    this.ec.childNodes[this.eo - 1] : dom.getClosestAncestorIn(this.ec, root, true);
            }

        }
    }

    RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,

        reset: function() {
            this._current = null;
            this._next = this._first;
        },

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            // Move to next node
            var current = this._current = this._next;
            if (current) {
                this._next = (current !== this._last) ? current.nextSibling : null;

                // Check for partially selected text nodes
                if (dom.isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                    if (current === this.ec) {

                        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                    }
                    if (this._current === this.sc) {

                        (current = current.cloneNode(true)).deleteData(0, this.so);
                    }
                }
            }

            return current;
        },

        remove: function() {
            var current = this._current, start, end;

            if (dom.isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                start = (current === this.sc) ? this.so : 0;
                end = (current === this.ec) ? this.eo : current.length;
                if (start != end) {
                    current.deleteData(start, end - start);
                }
            } else {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                } else {

                }
            }
        },

        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function() {
            var current = this._current;
            return isNonTextPartiallySelected(current, this.range);
        },

        getSubtreeIterator: function() {
            var subRange;
            if (this.isSingleCharacterDataNode) {
                subRange = this.range.cloneRange();
                subRange.collapse();
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isAncestorOf(current, this.sc, true)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isAncestorOf(current, this.ec, true)) {
                    endContainer = this.ec;
                    endOffset = this.eo;
                }

                updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
            }
            return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },

        detach: function(detachRange) {
            if (detachRange) {
                this.range.detach();
            }
            this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Exceptions

    /**
     * @constructor
     */
    function RangeException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "RangeException: " + this.codeName;
    }

    RangeException.prototype = {
        BAD_BOUNDARYPOINTS_ERR: 1,
        INVALID_NODE_TYPE_ERR: 2
    };

    RangeException.prototype.toString = function() {
        return this.message;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    /**
     * Currently iterates through all nodes in the range on creation until I think of a decent way to do it
     * TODO: Look into making this a proper iterator, not requiring preloading everything first
     * @constructor
     */
    function RangeNodeIterator(range, nodeTypes, filter) {
        this.nodes = getNodesInRange(range, nodeTypes, filter);
        this._next = this.nodes[0];
        this._position = 0;
    }

    RangeNodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            this._current = this._next;
            this._next = this.nodes[ ++this._position ];
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.nodes = null;
        }
    };

    var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
    var rootContainerNodeTypes = [2, 9, 11];
    var readonlyNodeTypes = [5, 6, 10, 12];
    var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
    var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

    function createAncestorFinder(nodeTypes) {
        return function(node, selfIsAncestor) {
            var t, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                t = n.nodeType;
                if (dom.arrayContains(nodeTypes, t)) {
                    return n;
                }
                n = n.parentNode;
            }
            return null;
        };
    }

    var getRootContainer = dom.getRootContainer;
    var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
    var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
    var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

    function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertNotDetached(range) {
        if (!range.startContainer) {
            throw new DOMException("INVALID_STATE_ERR");
        }
    }

    function assertValidNodeType(node, invalidTypes) {
        if (!dom.arrayContains(invalidTypes, node.nodeType)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
            throw new DOMException("INDEX_SIZE_ERR");
        }
    }

    function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
            throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
    }

    function assertNode(node, codeName) {
        if (!node) {
            throw new DOMException(codeName);
        }
    }

    function isOrphan(node) {
        return !dom.arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
    }

    function isValidOffset(node, offset) {
        return offset <= (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length);
    }

    function assertRangeValid(range) {
        assertNotDetached(range);
        if (isOrphan(range.startContainer) || isOrphan(range.endContainer) ||
                !isValidOffset(range.startContainer, range.startOffset) ||
                !isValidOffset(range.endContainer, range.endOffset)) {
            throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
        }
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Test the browser's innerHTML support to decide how to implement createContextualFragment
    var styleEl = document.createElement("style");
    var htmlParsingConforms = false;
    try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
    } catch (e) {
        // IE 6 and 7 throw
    }

    api.features.htmlParsingConforms = htmlParsingConforms;

    var createContextualFragment = htmlParsingConforms ?

        // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
        // discussion and base code for this implementation at issue 67.
        // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
        // Thanks to Aleks Williams.
        function(fragmentStr) {
            // "Let node the context object's start's node."
            var node = this.startContainer;
            var doc = dom.getDocument(node);

            // "If the context object's start's node is null, raise an INVALID_STATE_ERR
            // exception and abort these steps."
            if (!node) {
                throw new DOMException("INVALID_STATE_ERR");
            }

            // "Let element be as follows, depending on node's interface:"
            // Document, Document Fragment: null
            var el = null;

            // "Element: node"
            if (node.nodeType == 1) {
                el = node;

            // "Text, Comment: node's parentElement"
            } else if (dom.isCharacterDataNode(node)) {
                el = dom.parentElement(node);
            }

            // "If either element is null or element's ownerDocument is an HTML document
            // and element's local name is "html" and element's namespace is the HTML
            // namespace"
            if (el === null || (
                el.nodeName == "HTML"
                && dom.isHtmlNamespace(dom.getDocument(el).documentElement)
                && dom.isHtmlNamespace(el)
            )) {

            // "let element be a new Element with "body" as its local name and the HTML
            // namespace as its namespace.""
                el = doc.createElement("body");
            } else {
                el = el.cloneNode(false);
            }

            // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
            // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
            // "In either case, the algorithm must be invoked with fragment as the input
            // and element as the context element."
            el.innerHTML = fragmentStr;

            // "If this raises an exception, then abort these steps. Otherwise, let new
            // children be the nodes returned."

            // "Let fragment be a new DocumentFragment."
            // "Append all new children to fragment."
            // "Return fragment."
            return dom.fragmentFromNodeChildren(el);
        } :

        // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
        // previous versions of Rangy used (with the exception of using a body element rather than a div)
        function(fragmentStr) {
            assertNotDetached(this);
            var doc = getRangeDocument(this);
            var el = doc.createElement("body");
            el.innerHTML = fragmentStr;

            return dom.fragmentFromNodeChildren(el);
        };

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        attachListener: function(type, listener) {
            this._listeners[type].push(listener);
        },

        compareBoundaryPoints: function(how, range) {
            assertRangeValid(this);
            assertSameDocumentOrFragment(this.startContainer, range.startContainer);

            var nodeA, offsetA, nodeB, offsetB;
            var prefixA = (how == e2s || how == s2s) ? "start" : "end";
            var prefixB = (how == s2e || how == s2s) ? "start" : "end";
            nodeA = this[prefixA + "Container"];
            offsetA = this[prefixA + "Offset"];
            nodeB = range[prefixB + "Container"];
            offsetB = range[prefixB + "Offset"];
            return dom.comparePoints(nodeA, offsetA, nodeB, offsetB);
        },

        insertNode: function(node) {
            assertRangeValid(this);
            assertValidNodeType(node, insertableNodeTypes);
            assertNodeNotReadOnly(this.startContainer);

            if (dom.isAncestorOf(node, this.startContainer, true)) {
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }

            // No check for whether the container of the start of the Range is of a type that does not allow
            // children of the type of node: the browser's DOM implementation should do this for us when we attempt
            // to add the node

            var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
            this.setStartBefore(firstNodeInserted);
        },

        cloneContents: function() {
            assertRangeValid(this);

            var clone, frag;
            if (this.collapsed) {
                return getRangeDocument(this).createDocumentFragment();
            } else {
                if (this.startContainer === this.endContainer && dom.isCharacterDataNode(this.startContainer)) {
                    clone = this.startContainer.cloneNode(true);
                    clone.data = clone.data.slice(this.startOffset, this.endOffset);
                    frag = getRangeDocument(this).createDocumentFragment();
                    frag.appendChild(clone);
                    return frag;
                } else {
                    var iterator = new RangeIterator(this, true);
                    clone = cloneSubtree(iterator);
                    iterator.detach();
                }
                return clone;
            }
        },

        canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                    (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
            iterator.detach();
            return !boundariesInvalid;
        },

        surroundContents: function(node) {
            assertValidNodeType(node, surroundNodeTypes);

            if (!this.canSurroundContents()) {
                throw new RangeException("BAD_BOUNDARYPOINTS_ERR");
            }

            // Extract the contents
            var content = this.extractContents();

            // Clear the children of the node
            if (node.hasChildNodes()) {
                while (node.lastChild) {
                    node.removeChild(node.lastChild);
                }
            }

            // Insert the new node and add the extracted contents
            insertNodeAtPosition(node, this.startContainer, this.startOffset);
            node.appendChild(content);

            this.selectNode(node);
        },

        cloneRange: function() {
            assertRangeValid(this);
            var range = new Range(getRangeDocument(this));
            var i = rangeProperties.length, prop;
            while (i--) {
                prop = rangeProperties[i];
                range[prop] = this[prop];
            }
            return range;
        },

        toString: function() {
            assertRangeValid(this);
            var sc = this.startContainer;
            if (sc === this.endContainer && dom.isCharacterDataNode(sc)) {
                return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
            } else {
                var textBits = [], iterator = new RangeIterator(this, true);

                iterateSubtree(iterator, function(node) {
                    // Accept only text or CDATA nodes, not comments

                    if (node.nodeType == 3 || node.nodeType == 4) {
                        textBits.push(node.data);
                    }
                });
                iterator.detach();
                return textBits.join("");
            }
        },

        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function(node) {
            assertRangeValid(this);

            var parent = node.parentNode;
            var nodeIndex = dom.getNodeIndex(node);

            if (!parent) {
                throw new DOMException("NOT_FOUND_ERR");
            }

            var startComparison = this.comparePoint(parent, nodeIndex),
                endComparison = this.comparePoint(parent, nodeIndex + 1);

            if (startComparison < 0) { // Node starts before
                return (endComparison > 0) ? n_b_a : n_b;
            } else {
                return (endComparison > 0) ? n_a : n_i;
            }
        },

        comparePoint: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            if (dom.comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                return -1;
            } else if (dom.comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                return 1;
            }
            return 0;
        },

        createContextualFragment: createContextualFragment,

        toHtml: function() {
            assertRangeValid(this);
            var container = getRangeDocument(this).createElement("div");
            container.appendChild(this.cloneContents());
            return container.innerHTML;
        },

        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function(node, touchingIsIntersecting) {
            assertRangeValid(this);
            assertNode(node, "NOT_FOUND_ERR");
            if (dom.getDocument(node) !== getRangeDocument(this)) {
                return false;
            }

            var parent = node.parentNode, offset = dom.getNodeIndex(node);
            assertNode(parent, "NOT_FOUND_ERR");

            var startComparison = dom.comparePoints(parent, offset, this.endContainer, this.endOffset),
                endComparison = dom.comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },


        isPointInRange: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            return (dom.comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                   (dom.comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
        },

        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function(range, touchingIsIntersecting) {
            assertRangeValid(this);

            if (getRangeDocument(range) != getRangeDocument(this)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.endContainer, range.endOffset),
                endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.startContainer, range.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },

        intersection: function(range) {
            if (this.intersectsRange(range)) {
                var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                    endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                var intersectionRange = this.cloneRange();

                if (startComparison == -1) {
                    intersectionRange.setStart(range.startContainer, range.startOffset);
                }
                if (endComparison == 1) {
                    intersectionRange.setEnd(range.endContainer, range.endOffset);
                }
                return intersectionRange;
            }
            return null;
        },

        union: function(range) {
            if (this.intersectsRange(range, true)) {
                var unionRange = this.cloneRange();
                if (dom.comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                    unionRange.setStart(range.startContainer, range.startOffset);
                }
                if (dom.comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                    unionRange.setEnd(range.endContainer, range.endOffset);
                }
                return unionRange;
            } else {
                throw new RangeException("Ranges do not intersect");
            }
        },

        containsNode: function(node, allowPartial) {
            if (allowPartial) {
                return this.intersectsNode(node, false);
            } else {
                return this.compareNode(node) == n_i;
            }
        },

        containsNodeContents: function(node) {
            return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, dom.getNodeLength(node)) <= 0;
        },

        containsRange: function(range) {
            return this.intersection(range).equals(range);
        },

        containsNodeText: function(node) {
            var nodeRange = this.cloneRange();
            nodeRange.selectNode(node);
            var textNodes = nodeRange.getNodes([3]);
            if (textNodes.length > 0) {
                nodeRange.setStart(textNodes[0], 0);
                var lastTextNode = textNodes.pop();
                nodeRange.setEnd(lastTextNode, lastTextNode.length);
                var contains = this.containsRange(nodeRange);
                nodeRange.detach();
                return contains;
            } else {
                return this.containsNodeContents(node);
            }
        },

        createNodeIterator: function(nodeTypes, filter) {
            assertRangeValid(this);
            return new RangeNodeIterator(this, nodeTypes, filter);
        },

        getNodes: function(nodeTypes, filter) {
            assertRangeValid(this);
            return getNodesInRange(this, nodeTypes, filter);
        },

        getDocument: function() {
            return getRangeDocument(this);
        },

        collapseBefore: function(node) {
            assertNotDetached(this);

            this.setEndBefore(node);
            this.collapse(false);
        },

        collapseAfter: function(node) {
            assertNotDetached(this);

            this.setStartAfter(node);
            this.collapse(true);
        },

        getName: function() {
            return "DomRange";
        },

        equals: function(range) {
            return Range.rangesEqual(this, range);
        },

        inspect: function() {
            return inspect(this);
        }
    };

    function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;

        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
    }

    function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
    }

    function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
            assertRangeValid(this);

            var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

            var iterator = new RangeIterator(this, true);

            // Work out where to position the range after content removal
            var node, boundary;
            if (sc !== root) {
                node = dom.getClosestAncestorIn(sc, root, true);
                boundary = getBoundaryAfterNode(node);
                sc = boundary.node;
                so = boundary.offset;
            }

            // Check none of the range is read-only
            iterateSubtree(iterator, assertNodeNotReadOnly);

            iterator.reset();

            // Remove the content
            var returnValue = remover(iterator);
            iterator.detach();

            // Move to the new position
            boundaryUpdater(this, sc, so, sc, so);

            return returnValue;
        };
    }

    function createPrototypeRange(constructor, boundaryUpdater, detacher) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
            return function(node) {
                assertNotDetached(this);
                assertValidNodeType(node, beforeAfterNodeTypes);
                assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
            };
        }

        function setRangeStart(range, node, offset) {
            var ec = range.endContainer, eo = range.endOffset;
            if (node !== range.startContainer || offset !== this.startOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(ec) || dom.comparePoints(node, offset, ec, eo) == 1) {
                    ec = node;
                    eo = offset;
                }
                boundaryUpdater(range, node, offset, ec, eo);
            }
        }

        function setRangeEnd(range, node, offset) {
            var sc = range.startContainer, so = range.startOffset;
            if (node !== range.endContainer || offset !== this.endOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(sc) || dom.comparePoints(node, offset, sc, so) == -1) {
                    sc = node;
                    so = offset;
                }
                boundaryUpdater(range, sc, so, node, offset);
            }
        }

        function setRangeStartAndEnd(range, node, offset) {
            if (node !== range.startContainer || offset !== this.startOffset || node !== range.endContainer || offset !== this.endOffset) {
                boundaryUpdater(range, node, offset, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        api.util.extend(constructor.prototype, {
            setStart: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStart(this, node, offset);
            },

            setEnd: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeEnd(this, node, offset);
            },

            setStartBefore: createBeforeAfterNodeSetter(true, true),
            setStartAfter: createBeforeAfterNodeSetter(false, true),
            setEndBefore: createBeforeAfterNodeSetter(true, false),
            setEndAfter: createBeforeAfterNodeSetter(false, false),

            collapse: function(isStart) {
                assertRangeValid(this);
                if (isStart) {
                    boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                } else {
                    boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                }
            },

            selectNodeContents: function(node) {
                // This doesn't seem well specified: the spec talks only about selecting the node's contents, which
                // could be taken to mean only its children. However, browsers implement this the same as selectNode for
                // text nodes, so I shall do likewise
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);

                boundaryUpdater(this, node, 0, node, dom.getNodeLength(node));
            },

            selectNode: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, false);
                assertValidNodeType(node, beforeAfterNodeTypes);

                var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
            },

            extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

            deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            detach: function() {
                detacher(this);
            },

            splitBoundaries: function() {
                assertRangeValid(this);


                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
                var startEndSame = (sc === ec);

                if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                    dom.splitDataNode(ec, eo);

                }

                if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {

                    sc = dom.splitDataNode(sc, so);
                    if (startEndSame) {
                        eo -= so;
                        ec = sc;
                    } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                        eo++;
                    }
                    so = 0;

                }
                boundaryUpdater(this, sc, so, ec, eo);
            },

            normalizeBoundaries: function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                var mergeForward = function(node) {
                    var sibling = node.nextSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        ec = node;
                        eo = node.length;
                        node.appendData(sibling.data);
                        sibling.parentNode.removeChild(sibling);
                    }
                };

                var mergeBackward = function(node) {
                    var sibling = node.previousSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        sc = node;
                        var nodeLength = node.length;
                        so = sibling.length;
                        node.insertData(0, sibling.data);
                        sibling.parentNode.removeChild(sibling);
                        if (sc == ec) {
                            eo += so;
                            ec = sc;
                        } else if (ec == node.parentNode) {
                            var nodeIndex = dom.getNodeIndex(node);
                            if (eo == nodeIndex) {
                                ec = node;
                                eo = nodeLength;
                            } else if (eo > nodeIndex) {
                                eo--;
                            }
                        }
                    }
                };

                var normalizeStart = true;

                if (dom.isCharacterDataNode(ec)) {
                    if (ec.length == eo) {
                        mergeForward(ec);
                    }
                } else {
                    if (eo > 0) {
                        var endNode = ec.childNodes[eo - 1];
                        if (endNode && dom.isCharacterDataNode(endNode)) {
                            mergeForward(endNode);
                        }
                    }
                    normalizeStart = !this.collapsed;
                }

                if (normalizeStart) {
                    if (dom.isCharacterDataNode(sc)) {
                        if (so == 0) {
                            mergeBackward(sc);
                        }
                    } else {
                        if (so < sc.childNodes.length) {
                            var startNode = sc.childNodes[so];
                            if (startNode && dom.isCharacterDataNode(startNode)) {
                                mergeBackward(startNode);
                            }
                        }
                    }
                } else {
                    sc = ec;
                    so = eo;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            collapseToPoint: function(node, offset) {
                assertNotDetached(this);

                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStartAndEnd(this, node, offset);
            }
        });

        copyComparisonConstants(constructor);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Updates commonAncestorContainer and collapsed after boundary change
    function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
        range.commonAncestorContainer = range.collapsed ?
            range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
    }

    function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        var startMoved = (range.startContainer !== startContainer || range.startOffset !== startOffset);
        var endMoved = (range.endContainer !== endContainer || range.endOffset !== endOffset);

        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
        dispatchEvent(range, "boundarychange", {startMoved: startMoved, endMoved: endMoved});
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
        dispatchEvent(range, "detach", null);
        range._listeners = null;
    }

    /**
     * @constructor
     */
    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        this._listeners = {
            boundarychange: [],
            detach: []
        };
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    Range.rangeProperties = rangeProperties;
    Range.RangeIterator = RangeIterator;
    Range.copyComparisonConstants = copyComparisonConstants;
    Range.createPrototypeRange = createPrototypeRange;
    Range.inspect = inspect;
    Range.getRangeDocument = getRangeDocument;
    Range.rangesEqual = function(r1, r2) {
        return r1.startContainer === r2.startContainer &&
               r1.startOffset === r2.startOffset &&
               r1.endContainer === r2.endContainer &&
               r1.endOffset === r2.endOffset;
    };

    api.DomRange = Range;
    api.RangeException = RangeException;
});rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    /**
     * @constructor
     */
    var WrappedRange;
    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;



    /*----------------------------------------------------------------------------------------------------------------*/

    /*
    This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
    method. For example, in the following (where pipes denote the selection boundaries):

    <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

    var range = document.selection.createRange();
    alert(range.parentElement().id); // Should alert "ul" but alerts "b"

    This method returns the common ancestor node of the following:
    - the parentElement() of the textRange
    - the parentElement() of the textRange after calling collapse(true)
    - the parentElement() of the textRange after calling collapse(false)
     */
    function getTextRangeContainerElement(textRange) {
        var parentEl = textRange.parentElement();

        var range = textRange.duplicate();
        range.collapse(true);
        var startEl = range.parentElement();
        range = textRange.duplicate();
        range.collapse(false);
        var endEl = range.parentElement();
        var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

        return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
    }

    function textRangeIsCollapsed(textRange) {
        return textRange.compareEndPoints("StartToEnd", textRange) == 0;
    }

    // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started out as
    // an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has
    // grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange bugs, handling
    // for inputs and images, plus optimizations.
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        // TODO: Find out when. Workaround for wholeRangeContainerElement may break this
        if (!dom.isAncestorOf(wholeRangeContainerElement, containerElement, true)) {
            containerElement = wholeRangeContainerElement;

        }



        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");
        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;

        // Move the working range through the container's children, starting at the end and working backwards, until the
        // working range reaches or goes past the boundary we're interested in
        do {
            containerElement.insertBefore(workingNode, workingNode.previousSibling);
            workingRange.moveToElementText(workingNode);
        } while ( (comparison = workingRange.compareEndPoints(workingComparisonType, textRange)) > 0 &&
                workingNode.previousSibling);

        // We've now reached or gone past the boundary of the text range we're interested in
        // so have identified the node we want
        boundaryNode = workingNode.nextSibling;

        if (comparison == -1 && boundaryNode && dom.isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of the
            // node containing the text range's boundary, so we move the end of the working range to the boundary point
            // and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);


            var offset;

            if (/[\r\n]/.test(boundaryNode.data)) {
                /*
                For the particular case of a boundary within a text node containing line breaks (within a <pre> element,
                for example), we need a slightly complicated approach to get the boundary's offset in IE. The facts:

                - Each line break is represented as \r in the text node's data/nodeValue properties
                - Each line break is represented as \r\n in the TextRange's 'text' property
                - The 'text' property of the TextRange does not contain trailing line breaks

                To get round the problem presented by the final fact above, we can use the fact that TextRange's
                moveStart() and moveEnd() methods return the actual number of characters moved, which is not necessarily
                the same as the number of characters it was instructed to move. The simplest approach is to use this to
                store the characters moved when moving both the start and end of the range to the start of the document
                body and subtracting the start offset from the end offset (the "move-negative-gazillion" method).
                However, this is extremely slow when the document is large and the range is near the end of it. Clearly
                doing the mirror image (i.e. moving the range boundaries to the end of the document) has the same
                problem.

                Another approach that works is to use moveStart() to move the start boundary of the range up to the end
                boundary one character at a time and incrementing a counter with the value returned by the moveStart()
                call. However, the check for whether the start boundary has reached the end boundary is expensive, so
                this method is slow (although unlike "move-negative-gazillion" is largely unaffected by the location of
                the range within the document).

                The method below is a hybrid of the two methods above. It uses the fact that a string containing the
                TextRange's 'text' property with each \r\n converted to a single \r character cannot be longer than the
                text of the TextRange, so the start of the range is moved that length initially and then a character at
                a time to make up for any trailing line breaks not contained in the 'text' property. This has good
                performance in most situations compared to the previous two methods.
                */
                var tempRange = workingRange.duplicate();
                var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                offset = tempRange.moveStart("character", rangeLength);
                while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                    offset++;
                    tempRange.moveStart("character", 1);
                }
            } else {
                offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
        } else {


            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;



            if (nextNode && dom.isCharacterDataNode(nextNode)) {
                boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && dom.isCharacterDataNode(previousNode)) {
                boundaryPosition = new DomPosition(previousNode, previousNode.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return boundaryPosition;
    }

    // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that node.
    // This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
    // (http://code.google.com/p/ierange/)
    function createBoundaryTextRange(boundaryPosition, isStart) {
        var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
        var doc = dom.getDocument(boundaryPosition.node);
        var workingNode, childNodes, workingRange = doc.body.createTextRange();
        var nodeIsDataNode = dom.isCharacterDataNode(boundaryPosition.node);

        if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
        } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
        }

        // Position the range immediately before the node containing the boundary
        workingNode = doc.createElement("span");

        // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within the
        // element rather than immediately before or after it, which is what we want
        workingNode.innerHTML = "&#feff;";

        // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
        // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
        if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
        } else {
            boundaryParent.appendChild(workingNode);
        }

        workingRange.moveToElementText(workingNode);
        workingRange.collapse(!isStart);

        // Clean up
        boundaryParent.removeChild(workingNode);

        // Move the working range to the text offset, if required
        if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
        }

        return workingRange;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    if (api.features.implementsDomRange && (!api.features.implementsTextRange || !api.config.preferTextRange)) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function() {
            var rangeProto;
            var rangeProperties = DomRange.rangeProperties;
            var canSetRangeStartAfterEnd;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer,endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved) {
                    range.setEnd(endContainer, endOffset);
                    range.setStart(startContainer, startOffset);
                }
            }

            function detach(range) {
                range.nativeRange.detach();
                range.detached = true;
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = null;
                }
            }

            var createBeforeAfterNodeSetter;

            WrappedRange = function(range) {
                if (!range) {
                    throw new Error("Range must be specified");
                }
                this.nativeRange = range;
                updateRangeProperties(this);
            };

            DomRange.createPrototypeRange(WrappedRange, updateNativeRange, detach);

            rangeProto = WrappedRange.prototype;

            rangeProto.selectNode = function(node) {
                this.nativeRange.selectNode(node);
                updateRangeProperties(this);
            };

            rangeProto.deleteContents = function() {
                this.nativeRange.deleteContents();
                updateRangeProperties(this);
            };

            rangeProto.extractContents = function() {
                var frag = this.nativeRange.extractContents();
                updateRangeProperties(this);
                return frag;
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // TODO: Until I can find a way to programmatically trigger the Firefox bug (apparently long-standing, still
            // present in 3.6.8) that throws "Index or size is negative or greater than the allowed amount" for
            // insertNode in some circumstances, all browsers will have to use the Rangy's own implementation of
            // insertNode, which works but is almost certainly slower than the native implementation.
/*
            rangeProto.insertNode = function(node) {
                this.nativeRange.insertNode(node);
                updateRangeProperties(this);
            };
*/

            rangeProto.surroundContents = function(node) {
                this.nativeRange.surroundContents(node);
                updateRangeProperties(this);
            };

            rangeProto.collapse = function(isStart) {
                this.nativeRange.collapse(isStart);
                updateRangeProperties(this);
            };

            rangeProto.cloneRange = function() {
                return new WrappedRange(this.nativeRange.cloneRange());
            };

            rangeProto.refresh = function() {
                updateRangeProperties(this);
            };

            rangeProto.toString = function() {
                return this.nativeRange.toString();
            };

            // Create test range and node for feature detection

            var testTextNode = document.createTextNode("test");
            dom.getBody(document).appendChild(testTextNode);
            var range = document.createRange();

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
            // correct for it

            range.setStart(testTextNode, 0);
            range.setEnd(testTextNode, 0);

            try {
                range.setStart(testTextNode, 1);
                canSetRangeStartAfterEnd = true;

                rangeProto.setStart = function(node, offset) {
                    this.nativeRange.setStart(node, offset);
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    this.nativeRange.setEnd(node, offset);
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name) {
                    return function(node) {
                        this.nativeRange[name](node);
                        updateRangeProperties(this);
                    };
                };

            } catch(ex) {


                canSetRangeStartAfterEnd = false;

                rangeProto.setStart = function(node, offset) {
                    try {
                        this.nativeRange.setStart(node, offset);
                    } catch (ex) {
                        this.nativeRange.setEnd(node, offset);
                        this.nativeRange.setStart(node, offset);
                    }
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    try {
                        this.nativeRange.setEnd(node, offset);
                    } catch (ex) {
                        this.nativeRange.setStart(node, offset);
                        this.nativeRange.setEnd(node, offset);
                    }
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name, oppositeName) {
                    return function(node) {
                        try {
                            this.nativeRange[name](node);
                        } catch (ex) {
                            this.nativeRange[oppositeName](node);
                            this.nativeRange[name](node);
                        }
                        updateRangeProperties(this);
                    };
                };
            }

            rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
            rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
            rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
            rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct Firefox 2 behaviour with selectNodeContents on text nodes: it collapses the range to
            // the 0th character of the text node
            range.selectNodeContents(testTextNode);
            if (range.startContainer == testTextNode && range.endContainer == testTextNode &&
                    range.startOffset == 0 && range.endOffset == testTextNode.length) {
                rangeProto.selectNodeContents = function(node) {
                    this.nativeRange.selectNodeContents(node);
                    updateRangeProperties(this);
                };
            } else {
                rangeProto.selectNodeContents = function(node) {
                    this.setStart(node, 0);
                    this.setEnd(node, DomRange.getEndOffset(node));
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for WebKit bug that has the beahviour of compareBoundaryPoints round the wrong way for constants
            // START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &
                    range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                // This is the wrong way round, so correct for it


                rangeProto.compareBoundaryPoints = function(type, range) {
                    range = range.nativeRange || range;
                    if (type == range.START_TO_END) {
                        type = range.END_TO_START;
                    } else if (type == range.END_TO_START) {
                        type = range.START_TO_END;
                    }
                    return this.nativeRange.compareBoundaryPoints(type, range);
                };
            } else {
                rangeProto.compareBoundaryPoints = function(type, range) {
                    return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (api.util.isHostMethod(range, "createContextualFragment")) {
                rangeProto.createContextualFragment = function(fragmentStr) {
                    return this.nativeRange.createContextualFragment(fragmentStr);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Clean up
            dom.getBody(document).removeChild(testTextNode);
            range.detach();
            range2.detach();
        })();

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.createRange();
        };
    } else if (api.features.implementsTextRange) {
        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedRange = function(textRange) {
            this.textRange = textRange;
            this.refresh();
        };

        WrappedRange.prototype = new DomRange(document);

        WrappedRange.prototype.refresh = function() {
            var start, end;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true);
            } else {

                start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false);
            }

            this.setStart(start.node, start.offset);
            this.setEnd(end.node, end.offset);
        };

        DomRange.copyComparisonConstants(WrappedRange);

        // Add WrappedRange as the Range property of the global object to allow expression like Range.END_TO_END to work
        var globalObj = (function() { return this; })();
        if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedRange;
        }

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                var tr = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);



                return tr;

                //return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            } else {
                var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                var textRange = dom.getDocument(range.startContainer).body.createTextRange();
                textRange.setEndPoint("StartToStart", startRange);
                textRange.setEndPoint("EndToEnd", endRange);
                return textRange;
            }
        };
    }

    WrappedRange.prototype.getName = function() {
        return "WrappedRange";
    };

    api.WrappedRange = WrappedRange;

    api.createRange = function(doc) {
        doc = doc || document;
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = doc || document;
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        return api.createRange(dom.getIframeDocument(iframeEl));
    };

    api.createIframeRangyRange = function(iframeEl) {
        return api.createRangyRange(dom.getIframeDocument(iframeEl));
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(this);
            };
        }
        doc = win = null;
    });
});rangy.createModule("WrappedSelection", function(api, module) {
    // This will create a selection object wrapper that follows the Selection object found in the WHATWG draft DOM Range
    // spec (http://html5.org/specs/dom-range.html)

    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        windowPropertyName = "_rangySelection",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";



    function getWinSelection(winParam) {
        return (winParam || window).getSelection();
    }

    function getDocSelection(winParam) {
        return (winParam || window).document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = (winParam || window).document, nativeSel = doc.selection;

            // Check whether the selection TextRange is actually contained within the correct document
            return (nativeSel.type != "None" || dom.getDocument(nativeSel.createRange().parentElement()) == doc);
        };
    } else if (implementsWinGetSelection) {
        getSelection = getWinSelection;
        api.isSelectionValid = function() {
            return true;
        };
    } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
    }

    api.getNativeSelection = getSelection;

    var testSelection = getSelection();
    var testRange = api.createNativeRange(document);
    var body = dom.getBody(document);

    // Obtaining a range from a selection
    var selectionHasAnchorAndFocus = util.areHostObjects(testSelection, ["anchorNode", "focusNode"] &&
                                     util.areHostProperties(testSelection, ["anchorOffset", "focusOffset"]));
    api.features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

    // Test for existence of native selection extend() method
    var selectionHasExtend = util.isHostMethod(testSelection, "extend");
    api.features.selectionHasExtend = selectionHasExtend;

    // Test if rangeCount exists
    var selectionHasRangeCount = (typeof testSelection.rangeCount == "number");
    api.features.selectionHasRangeCount = selectionHasRangeCount;

    var selectionSupportsMultipleRanges = false;
    var collapsedNonEditableSelectionsSupported = true;

    if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
            typeof testSelection.rangeCount == "number" && api.features.implementsDomRange) {

        (function() {
            var iframe = document.createElement("iframe");
            body.appendChild(iframe);

            var iframeDoc = dom.getIframeDocument(iframe);
            iframeDoc.open();
            iframeDoc.write("<html><head></head><body>12</body></html>");
            iframeDoc.close();

            var sel = dom.getIframeWindow(iframe).getSelection();
            var docEl = iframeDoc.documentElement;
            var iframeBody = docEl.lastChild, textNode = iframeBody.firstChild;

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = iframeDoc.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges
            var r2 = r1.cloneRange();
            r1.setStart(textNode, 0);
            r2.setEnd(textNode, 2);
            sel.addRange(r1);
            sel.addRange(r2);

            selectionSupportsMultipleRanges = (sel.rangeCount == 2);

            // Clean up
            r1.detach();
            r2.detach();

            body.removeChild(iframe);
        })();
    }

    api.features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
    api.features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

    // ControlRanges
    var implementsControlRange = false, testControlRange;

    if (body && util.isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
            implementsControlRange = true;
        }
    }
    api.features.implementsControlRange = implementsControlRange;

    // Selection collapsedness
    if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
            return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
    } else {
        selectionIsCollapsed = function(sel) {
            return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
    }

    function updateAnchorAndFocusFromRange(sel, range, backwards) {
        var anchorPrefix = backwards ? "end" : "start", focusPrefix = backwards ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
    }

    function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
    }

    function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
    }

    function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
            nativeRange = range._selectionNativeRange;
            if (!nativeRange) {
                nativeRange = api.createNativeRange(dom.getDocument(range.startContainer));
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
                range._selectionNativeRange = nativeRange;
                range.attachListener("detach", function() {

                    this._selectionNativeRange = null;
                });
            }
        } else if (range instanceof WrappedRange) {
            nativeRange = range.nativeRange;
        } else if (api.features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
            nativeRange = range;
        }
        return nativeRange;
    }

    function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
            return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                return false;
            }
        }
        return true;
    }

    function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
            throw new Error("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

    function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
    }

    function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];

        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
    }

    function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
            updateEmptySelection(sel);
        } else {
            var controlRange = sel.docSelection.createRange();
            if (isTextRange(controlRange)) {
                // This case (where the selection type is "Control" and calling createRange() on the selection returns
                // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                // ControlRange have been removed from the ControlRange and removed from the document.
                updateFromTextRange(sel, controlRange);
            } else {
                sel.rangeCount = controlRange.length;
                var range, doc = dom.getDocument(controlRange.item(0));
                for (var i = 0; i < sel.rangeCount; ++i) {
                    range = api.createRange(doc);
                    range.selectNode(controlRange.item(i));
                    sel._ranges.push(range);
                }
                sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
        }
    }

    function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = dom.getDocument(controlRange.item(0));
        var newControlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
        }
        try {
            newControlRange.add(rangeElement);
        } catch (ex) {
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection,  "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch(ex) {
                return null;
            }
        };
    } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
            var doc = dom.getDocument(sel.anchorNode);
            var range = api.createRange(doc);
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== this.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }

            return range;
        };
    }

    /**
     * @constructor
     */
    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    api.getSelection = function(win) {
        win = win || window;
        var sel = win[windowPropertyName];
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh(win);
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            win[windowPropertyName] = sel;
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
        return api.getSelection(dom.getIframeWindow(iframeEl));
    };

    var selProto = WrappedSelection.prototype;

    function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = dom.getDocument(ranges[0].startContainer);
        var controlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, el; i < rangeCount; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
                controlRange.add(el);
            } catch (ex) {
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
            }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    // Selecting a range
    if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
            this.nativeSelection.removeAllRanges();
            updateEmptySelection(this);
        };

        var addRangeBackwards = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, backwards) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (backwards && selectionHasExtend) {
                        addRangeBackwards(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        this.nativeSelection.addRange(getNativeRange(range));

                        // Check whether adding the range was successful
                        this.rangeCount = this.nativeSelection.rangeCount;

                        if (this.rangeCount == previousRangeCount + 1) {
                            // The range was added successfully

                            // Check whether the range that we added to the selection is reflected in the last range extracted from
                            // the selection
                            if (api.config.checkSelectionRanges) {
                                var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                if (nativeRange && !DomRange.rangesEqual(nativeRange, range)) {
                                    // Happens in WebKit with, for example, a selection placed at the start of a text node
                                    range = new WrappedRange(nativeRange);
                                }
                            }
                            this._ranges[this.rangeCount - 1] = range;
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackwards(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, backwards) {
                if (backwards && selectionHasExtend) {
                    addRangeBackwards(this, range);
                } else {
                    this.nativeSelection.addRange(getNativeRange(range));
                    this.refresh();
                }
            };
        }

        selProto.setRanges = function(ranges) {
            if (implementsControlRange && ranges.length > 1) {
                createControlSelection(this, ranges);
            } else {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    this.addRange(ranges[i]);
                }
            }
        };
    } else if (util.isHostMethod(testSelection, "empty") && util.isHostMethod(testRange, "select") &&
               implementsControlRange && useDocumentSelection) {

        selProto.removeAllRanges = function() {
            // Added try/catch as fix for issue #21
            try {
                this.docSelection.empty();

                // Check for empty() not working (issue #24)
                if (this.docSelection.type != "None") {
                    // Work around failure to empty a control selection by instead selecting a TextRange and then
                    // calling empty()
                    var doc;
                    if (this.anchorNode) {
                        doc = dom.getDocument(this.anchorNode);
                    } else if (this.docSelection.type == CONTROL) {
                        var controlRange = this.docSelection.createRange();
                        if (controlRange.length) {
                            doc = dom.getDocument(controlRange.item(0)).body.createTextRange();
                        }
                    }
                    if (doc) {
                        var textRange = doc.body.createTextRange();
                        textRange.select();
                        this.docSelection.empty();
                    }
                }
            } catch(ex) {}
            updateEmptySelection(this);
        };

        selProto.addRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                addRangeToControlSelection(this, range);
            } else {
                WrappedRange.rangeToTextRange(range).select();
                this._ranges[0] = range;
                this.rangeCount = 1;
                this.isCollapsed = this._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(this, range, false);
            }
        };

        selProto.setRanges = function(ranges) {
            this.removeAllRanges();
            var rangeCount = ranges.length;
            if (rangeCount > 1) {
                createControlSelection(this, ranges);
            } else if (rangeCount) {
                this.addRange(ranges[0]);
            }
        };
    } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
    }

    selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
            throw new DOMException("INDEX_SIZE_ERR");
        } else {
            return this._ranges[index];
        }
    };

    var refreshSelection;

    if (useDocumentSelection) {
        refreshSelection = function(sel) {
            var range;
            if (api.isSelectionValid(sel.win)) {
                range = sel.docSelection.createRange();
            } else {
                range = dom.getBody(sel.win.document).createTextRange();
                range.collapse(true);
            }


            if (sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else if (isTextRange(range)) {
                updateFromTextRange(sel, range);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else if (util.isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == "number") {
        refreshSelection = function(sel) {
            if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else {
                sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                    }
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackwards(sel.nativeSelection));
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            }
        };
    } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && api.features.implementsDomRange) {
        refreshSelection = function(sel) {
            var range, nativeSel = sel.nativeSelection;
            if (nativeSel.anchorNode) {
                range = getSelectionRangeAt(nativeSel, 0);
                sel._ranges = [range];
                sel.rangeCount = 1;
                updateAnchorAndFocusFromNativeSelection(sel);
                sel.isCollapsed = selectionIsCollapsed(sel);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
    }

    selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        refreshSelection(this);
        if (checkForChanges) {
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return false;
            }
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges(), removed = false;
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (removed || range !== ranges[i]) {
                sel.addRange(ranges[i]);
            } else {
                // According to the draft WHATWG Range spec, the same range may be added to the selection multiple
                // times. removeRange should only remove the first instance, so the following ensures only the first
                // instance is removed
                removed = true;
            }
        }
        if (!sel.rangeCount) {
            updateEmptySelection(sel);
        }
    };

    if (implementsControlRange) {
        selProto.removeRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var rangeElement = getSingleElementFromRange(range);

                // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                // element contained by the supplied range
                var doc = dom.getDocument(controlRange.item(0));
                var newControlRange = dom.getBody(doc).createControlRange();
                var el, removed = false;
                for (var i = 0, len = controlRange.length; i < len; ++i) {
                    el = controlRange.item(i);
                    if (el !== rangeElement || removed) {
                        newControlRange.add(controlRange.item(i));
                    } else {
                        removed = true;
                    }
                }
                newControlRange.select();

                // Update the wrapped selection based on what's now in the native selection
                updateControlSelection(this);
            } else {
                removeRangeManually(this, range);
            }
        };
    } else {
        selProto.removeRange = function(range) {
            removeRangeManually(this, range);
        };
    }

    // Detecting if a selection is backwards
    var selectionIsBackwards;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackwards = function(sel) {
            var backwards = false;
            if (sel.anchorNode) {
                backwards = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backwards;
        };

        selProto.isBackwards = function() {
            return selectionIsBackwards(this);
        };
    } else {
        selectionIsBackwards = selProto.isBackwards = function() {
            return false;
        };
    }

    // Selection text
    // This is conformant to the new WHATWG DOM Range draft spec but differs from WebKit and Mozilla's implementation
    selProto.toString = function() {

        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
    };

    function assertNodeInSameDocument(sel, node) {
        if (sel.anchorNode && (dom.getDocument(sel.anchorNode) !== dom.getDocument(node))) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    // No current browsers conform fully to the HTML 5 draft spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.collapseToPoint(node, offset);
        this.removeAllRanges();
        this.addRange(range);
        this.isCollapsed = true;
    };

    selProto.collapseToStart = function() {
        if (this.rangeCount) {
            var range = this._ranges[0];
            this.collapse(range.startContainer, range.startOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    selProto.collapseToEnd = function() {
        if (this.rangeCount) {
            var range = this._ranges[this.rangeCount - 1];
            this.collapse(range.endContainer, range.endOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    // The HTML 5 spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.selectNodeContents(node);
        this.removeAllRanges();
        this.addRange(range);
    };

    selProto.deleteFromDocument = function() {
        // Sepcial behaviour required for Control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var element;
            while (controlRange.length) {
                element = controlRange.item(0);
                controlRange.remove(element);
                element.parentNode.removeChild(element);
            }
            this.refresh();
        } else if (this.rangeCount) {
            var ranges = this.getAllRanges();
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                ranges[i].deleteContents();
            }
            // The HTML5 spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        return this._ranges.slice(0);
    };

    selProto.setSingleRange = function(range) {
        this.setRanges( [range] );
    };

    selProto.containsNode = function(node, allowPartial) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            if (this._ranges[i].containsNode(node, allowPartial)) {
                return true;
            }
        }
        return false;
    };

    selProto.toHtml = function() {
        var html = "";
        if (this.rangeCount) {
            var container = DomRange.getRangeDocument(this._ranges[0]).createElement("div");
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                container.appendChild(this._ranges[i].cloneContents());
            }
            html = container.innerHTML;
        }
        return html;
    };

    function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

        if (typeof sel.rangeCount != "undefined") {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
            }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";

    }

    selProto.getName = function() {
        return "WrappedSelection";
    };

    selProto.inspect = function() {
        return inspect(this);
    };

    selProto.detach = function() {
        this.win[windowPropertyName] = null;
        this.win = this.anchorNode = this.focusNode = null;
    };

    WrappedSelection.inspect = inspect;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(this);
            };
        }
        win = null;
    });
});

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
/*
 * MODIFICATIONS: 
 * * The name of the "constructor" method was changed from "init" to "_constructor"
 * * Mixin Support using https://gist.github.com/1006243
 * * Modified to be a require.js module
 */
define('util/class',[],
function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  // with doing that Class is available in the global namespace.
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function() {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
	for(var i = 0; i < arguments.length; i++) {
      var prop = arguments[i];
      for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }
	}

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the _constructor method
      if ( !initializing && this._constructor )
        this._constructor.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  
  };

  	return this.Class;
  	
});
/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};

define( 'util/lang', [], function(){} );

// Start Closure
(function(window, undefined) {
	
	var
		jQuery = window.alohaQuery || window.jQuery, $ = jQuery,
		GENTICS = window.GENTICS,
		Class = window.Class,
		console = window.console;

/**
 * Takes over all properties from the 'properties' object to the target object.
 * If a property in 'target' with the same name as a property in 'properties' is already defined it is overridden.
 *
 * Example:
 *
 * var o1 = {a : 1, b : 'hello'};
 * var o2 = {a : 3, c : 'world'};
 *
 * GENTICS.Utils.applyProperties(o1, o2);
 *
 * Will result in an o1 object like this:
 *
 * {a : 3, b: 'hello', c: 'world'}
 *
 * @static
 * @return void
 */
GENTICS.Utils.applyProperties = function (target, properties) {
	var name;
	for (name in properties) {
		if (properties.hasOwnProperty(name)) {
			target[name] = properties[name];
		}
	}
};

/**
 * Generate a unique hexadecimal string with 4 charachters
 * @return {string}
 */
GENTICS.Utils.uniqeString4 = function () {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

/**
 * Generate a unique value represented as a 32 character hexadecimal string,
 * such as 21EC2020-3AEA-1069-A2DD-08002B30309D
 * @return {string}
 */
GENTICS.Utils.guid = function () {
	var S4 = GENTICS.Utils.uniqeString4;
	return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
};

})(window);

/**
 * ecma5schims.js - Shim for ECMA5 compatibility
 * (http://en.wikipedia.org/wiki/Shim_%28computing%29)
 *
 * A shim library that implements common functions that are missing on some
 * environments in order to complete ECMA5 compatibility across all major
 * browsers.
 *
 * TODO: This code needs to be refactored so as to conform to Aloha coding
 *       standards.  It is also severly lacking in documentation.  Please take
 *       note of: https://github.com/alohaeditor/Aloha-Editor/wiki/Commit-Checklist .
 */

define('aloha/ecma5shims',[], function(){
  

  var shims = {
    // Function bind
    bind: function(owner){
      var obj = this.obj || this;
      var native_method = Function.prototype.bind;          
      var args= Array.prototype.slice.call(arguments, 1);

      if(native_method){
        return native_method.apply(obj, arguments); 
      }
      else{
        return function() {
          return obj.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
        }
      }
    },

    // String trim
    trim: function(){
      var obj = this.obj || this;
      var native_method = String.prototype.trim;

      if(native_method){
        return native_method.call(obj); 
      }
      else {
        return obj.replace(/^\s+/, '').replace(/\s+$/, '');
      }
    },

    // Array methods 
    indexOf: function(find, i /*opt*/){
      var obj = this.obj || this;
      var native_method = Array.prototype.indexOf;     

      if(native_method){
        return native_method.call(obj, find, i); 
      }
      else {
        if (i===undefined) i= 0;
        if (i<0) i+= obj.length;
        if (i<0) i= 0;
        for (var n = obj.length; i<n; i++)
            if (i in obj && obj[i]===find)
                return i;
        return -1;
      }
    },
    
    forEach: function(action, that /*opt*/){
      var obj = this.obj || this;
      var native_method = Array.prototype.forEach;          

      if(native_method){
        return native_method.call(obj, action, that); 
      }
      else {
        for (var i= 0, n = obj.length; i<n; i++)
          if (i in obj)
            action.call(that, obj[i], i, obj);
      }
    },

    map: function(mapper, that /*opt*/, chain /*opt */){
      var obj = this.obj || this;
      var native_method = Array.prototype.map; 
      var returnWrapper = (typeof arguments[arguments.length - 1] == "boolean") ? Array.prototype.pop.call(arguments) : false;
      var result = [];

      if(native_method){
        result = native_method.call(obj, mapper, that); 
      }
      else {
        var other= new Array(obj.length);
        for (var i= 0, n= obj.length; i<n; i++)
            if (i in obj)
                other[i]= mapper.call(that, obj[i], i, obj);
        result = other;
      }

      return returnWrapper ? $_(result) : result;
    },

    filter: function(filterFunc, that /*opt*/, chain /*opt */){
      var obj = this.obj || this;
      var native_method = Array.prototype.filter;         
      var returnWrapper = (typeof arguments[arguments.length - 1] == "boolean") ? Array.prototype.pop.call(arguments) : false;
      var result = [];

      if(native_method){
       result = native_method.call(obj, filterFunc, that); 
      }
      else {
        var other= [], v;
        for (var i=0, n= obj.length; i<n; i++)
            if (i in obj && filterFunc.call(that, v= obj[i], i, obj))
                other.push(v);
        result = other;
      }

      return returnWrapper ? $_(result) : result;
    },

    every: function(tester, that /*opt*/) {
       var obj = this.obj || this;
       var native_method = Array.prototype.every;

       if(native_method){
         return native_method.call(obj, tester, that); 
       }
       else {
         for (var i= 0, n= obj.length; i<n; i++)
            if (i in obj && !tester.call(that, obj[i], i, obj))
                return false;
         return true;
       }
    },

    some: function(tester, that /*opt*/){
       var obj = this.obj || this;
       var native_method = Array.prototype.some;  

       if(native_method){
         return native_method.call(obj, tester, that); 
       }
       else {
         for (var i= 0, n= obj.length; i<n; i++)
           if (i in obj && tester.call(that, obj[i], i, obj))
               return true;
         return false;
       }
    },

    // Since IE7 doesn't support 'hasAttribute' method on nodes
    // TODO: raise an exception if the object is not an node
    hasAttribute: function(attr){
      var obj = this.obj || this;
      var native_method = obj.hasAttribute;  

      if(native_method){
        return obj.hasAttribute(attr); 
      }
      else {
        return (typeof obj.attributes[attr] != "undefined")
      }         
    }

  };

  var $_ = function(obj) { 
    var wrapper = function() {};
    wrapper.prototype = shims;

    var wrapper_instance = new wrapper();
    wrapper_instance.obj = obj;
    return wrapper_instance; 
  }; 

  for (var shim in shims) {
    $_[shim] = shims[shim];
  }
  

  // Node constants
  // http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1841493061
  if(typeof Node != 'undefined'){
    $_.Node = Node;
  }                
  else {
    $_.Node = {
      'ELEMENT_NODE' : 1,
      'ATTRIBUTE_NODE': 2,
      'TEXT_NODE': 3,
      'CDATA_SECTION_NODE': 4,
      'ENTITY_REFERENCE_NODE': 5,
      'ENTITY_NODE': 6,
      'PROCESSING_INSTRUCTION_NODE': 7,
      'COMMENT_NODE': 8,
      'DOCUMENT_NODE': 9,
      'DOCUMENT_TYPE_NODE': 10,
      'DOCUMENT_FRAGMENT_NODE': 11,
      'NOTATION_NODE': 12,
      //The two nodes are disconnected. Order between disconnected nodes is always implementation-specific.
      'DOCUMENT_POSITION_DISCONNECTED': 0x01,
      //The second node precedes the reference node.
      'DOCUMENT_POSITION_PRECEDING': 0x02, 
      //The node follows the reference node.
      'DOCUMENT_POSITION_FOLLOWING': 0x04,
      //The node contains the reference node. A node which contains is always preceding, too.
      'DOCUMENT_POSITION_CONTAINS': 0x08,
      //The node is contained by the reference node. A node which is contained is always following, too.
      'DOCUMENT_POSITION_CONTAINED_BY': 0x10,
      //The determination of preceding versus following is implementation-specific.
      'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC': 0x20
    } 
  };

  // http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
  // FIXME: Check if the DOMNode prototype can be set.
  $_.compareDocumentPosition = function(node1, node2) {
      
    if ('compareDocumentPosition' in document.documentElement ) {
      return node1.compareDocumentPosition(node2);
    } 
    
    if (!("contains" in document.documentElement)) {
      throw 'compareDocumentPosition nor contains is not supported by this browser.';
    }
    
    if (node1 == node2) return 0;
    
    //if they don't have the same parent, there's a disconnect
    if (getRootParent(node1) != getRootParent(node2)) return 1;
    
    //use this if both nodes have a sourceIndex (text nodes don't)
    if ("sourceIndex" in node1 && "sourceIndex" in node2) {
      return comparePosition(node1, node2);
    }
    
    //document will definitely contain the other node
    if (node1 == document) return 20;
    else if (node2 == document) return 10;
    
    //get sourceIndexes to use for both nodes
    var useNode1 = getUseNode(node1), useNode2 = getUseNode(node2);
    
    //call this function again to get the result
    var result = comparePosition(useNode1, useNode2);
    
    //clean up if needed
    if (node1 != useNode1) useNode1.parentNode.removeChild(useNode1);
    if (node2 != useNode2) useNode2.parentNode.removeChild(useNode2);
    return result;

    //node.ownerDocument gives the document object, which isn't the right info for a disconnect
    function getRootParent( node ) {
		var parent = null;

		if ( node ) {
			do { parent = node; }
			while ( node = node.parentNode );
		}

		return parent;
    }

    //Compare Position - MIT Licensed, John Resig; http://ejohn.org/blog/comparing-document-position/
    //Already checked for equality and disconnect
    function comparePosition(node1, node2) {
      return (node1.contains(node2) && 16) +
        (node2.contains(node1) && 8) +
          (node1.sourceIndex >= 0 && node2.sourceIndex >= 0 ?
            (node1.sourceIndex < node2.sourceIndex && 4) +
              (node1.sourceIndex > node2.sourceIndex && 2) :
            1);
    }

    //get a node with a sourceIndex to use
    function getUseNode(node) {
      //if the node already has a sourceIndex, use that node
      if ("sourceIndex" in node) return node;
      //otherwise, insert a comment (which has a sourceIndex but minimal DOM impact) before the node and use that
      return node.parentNode.insertBefore(document.createComment(""), node);
    }
  };

  $_.getComputedStyle = function(node, style){
    if('getComputedStyle' in window) {
      return window.getComputedStyle(node, style); 
    }
    else {
      if( node.currentStyle ) {
        return node.currentStyle;
      }
      return null;
    }
  };
     
  return $_;
});

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

// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};

define('util/dom',['aloha/jquery', 'util/class', 'aloha/ecma5shims'],
function(jQuery, Class, $_) {
	
	
	var
		GENTICS = window.GENTICS,
//		Class = window.Class,
		// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1841493061
		Node = {
    		'ELEMENT_NODE' : 1,
    		'ATTRIBUTE_NODE': 2,
    		'TEXT_NODE': 3,
    		'CDATA_SECTION_NODE': 4,
    		'ENTITY_REFERENCE_NODE': 5,
    		'ENTITY_NODE': 6,
    		'PROCESSING_INSTRUCTION_NODE': 7,
    		'COMMENT_NODE': 8,
    		'DOCUMENT_NODE': 9,
    		'DOCUMENT_TYPE_NODE': 10,
    		'DOCUMENT_FRAGMENT_NODE': 11,
    		'NOTATION_NODE': 12,
    		//The two nodes are disconnected. Order between disconnected nodes is always implementation-specific.
    		'DOCUMENT_POSITION_DISCONNECTED': 0x01,
    		//The second node precedes the reference node.
    		'DOCUMENT_POSITION_PRECEDING': 0x02, 
    		//The node follows the reference node.
    		'DOCUMENT_POSITION_FOLLOWING': 0x04,
    		//The node contains the reference node. A node which contains is always preceding, too.
    		'DOCUMENT_POSITION_CONTAINS': 0x08,
    		//The node is contained by the reference node. A node which is contained is always following, too.
    		'DOCUMENT_POSITION_CONTAINED_BY': 0x10,
    		//The determination of preceding versus following is implementation-specific.
    		'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC': 0x20
    	};

	

/**
 * @namespace GENTICS.Utils
 * @class Dom provides methods to get information about the DOM and to manipulate it
 * @singleton
 */
var Dom = Class.extend({
	/**
	 * Regex to find word characters.
	 */
	wordRegex: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0525\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971\u0972\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u2094\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCB\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA65F\uA662-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA2D\uFA30-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,

	/**
	 * Regex to find non-word characters.
	 */
	nonWordRegex: /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0525\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971\u0972\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u2094\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCB\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA65F\uA662-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA2D\uFA30-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,

	/**
	 * Tags which can safely be merged
	 * @hide
	 */
	mergeableTags: ['b', 'code', 'del', 'em', 'i', 'ins', 'strong', 'sub', 'sup', '#text'],

	/**
	 * Tags which do not mark word boundaries
	 * @hide
	 */
	nonWordBoundaryTags: ['a', 'b', 'code', 'del', 'em', 'i', 'ins', 'span', 'strong', 'sub', 'sup', '#text'],

	/**
	 * Tags which are considered 'nonempty', even if they have no children (or not data)
	 * TODO: finish this list
	 * @hide
	 */
	nonEmptyTags: ['br'],

	/**
	 * Tags which make up Flow Content or Phrasing Content, according to the HTML 5 specification,
	 * @see http://dev.w3.org/html5/spec/Overview.html#flow-content
	 * @see http://dev.w3.org/html5/spec/Overview.html#phrasing-content
	 * @hide
	 */
	tags: {
		'flow' : [ 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
				'b', 'bdi','bdo', 'blockquote', 'br', 'button', 'canvas', 'cite', 'code',
				'command', 'datalist', 'del', 'details', 'dfn', 'div', 'dl', 'em',
				'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
				'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img',
				'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math',
				'menu', 'meter', 'nav', 'noscript', 'object', 'ol', 'output', 'p',
				'pre', 'progress', 'q', 'ruby', 's', 'samp', 'script', 'section',
				'select', 'small', 'span', 'strong', 'style', 'sub', 'sup', 'svg',
				'table', 'textarea', 'time', 'u', 'ul', 'var', 'video', 'wbr', '#text' ],
		'phrasing' : [ 'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button',
				'canvas', 'cite', 'code', 'command', 'datalist', 'del', 'dfn',
				'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
				'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
				'object', 'output', 'progress', 'q', 'ruby', 'samp', 'script',
				'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
				'textarea', 'time', 'u', 'var', 'video', 'wbr', '#text' ]
	},

	/**
	 * Possible children of tags, according to the HTML 5
	 * specification.
	 * See http://dev.w3.org/html5/spec/Overview.html#elements-1
	 * Moved to http://www.whatwg.org/specs/web-apps/current-work/#elements-1
	 * @hide
	 */
	children: {
		'a' : 'phrasing', // transparent
		'abbr' : 'phrasing',
		'address' : 'flow',
		'area' : 'empty',
		'article' : 'flow',
		'aside' : 'flow',
		'audio' : 'source', // transparent
		'b' : 'phrasing',
		'base' : 'empty',
		'bdo' : 'phrasing',
		'blockquote' : 'phrasing',
		'body' : 'flow',
		'br' : 'empty',
		'button' : 'phrasing',
		'canvas' : 'phrasing', // transparent
		'caption' : 'flow',
		'cite' : 'phrasing',
		'code' : 'phrasing',
		'col' : 'empty',
		'colgroup' : 'col',
		'command' : 'empty',
		'datalist' : ['phrasing', 'option'],
		'dd' : 'flow',
		'del' : 'phrasing',
		'div' : 'flow',
		'details' : ['summary', 'flow'],
		'dfn' : 'flow',
		'dl' : ['dt','dd'],
		'dt' : 'phrasing', // varies
		'em' : 'phrasing',
		'embed' : 'empty',
		'fieldset' : ['legend', 'flow'],
		'figcaption': 'flow',
		'figure' :  ['figcaption', 'flow'],
		'footer' : 'flow',
		'form' : 'flow',
		'h1' : 'phrasing',
		'h2' : 'phrasing',
		'h3' : 'phrasing',
		'h4' : 'phrasing',
		'h5' : 'phrasing',
		'h6' : 'phrasing',
		//head
		'header' : 'flow',
		'hgroup' : ['h1','h2','h3','h4','h5','h6'],
		'hr' : 'empty',
		//html :)
		'i' : 'phrasing',
		'iframe' : '#text',
		'img' : 'empty',
		'input' : 'empty',
		'ins' : 'phrasing', // transparent
		'kbd' : 'phrasing',
		'keygen' : 'empty',
		'label' : 'phrasing',
		'legend' : 'phrasing',
		'li' : 'flow',
		'link' : 'empty',
		'map' : 'area', // transparent
		'mark' : 'phrasing',
		'menu' : ['li', 'flow'],
		'meta' : 'empty',
		'meter' : 'phrasing',
		'nav' : 'flow',
		'noscript' : 'phrasing', // varies
		'object' : 'param', // transparent
		'ol' : 'li',
		'optgroup' : 'option',
		'option' : '#text',
		'output' : 'phrasing',
		'p' : 'phrasing',
		'param' : 'empty',
		'pre' : 'phrasing',
		'progress' : 'phrasing',
		'q' : 'phrasing',
		'rp' : 'phrasing',
		'rt' : 'phrasing',
		'ruby' : ['phrasing', 'rt', 'rp'],
		's' : 'phrasing',
		'samp' : 'pharsing',
		'script' : '#script', //script
		'section' : 'flow',
		'select' : ['option', 'optgroup'],
		'small' : 'phrasing',
		'source' : 'empty',
		'span' : 'phrasing',
		'strong' : 'phrasing',
		'style' : 'phrasing', // varies
		'sub' : 'phrasing',
		'summary' : 'phrasing',
		'sup' : 'phrasing',
		'table' : ['caption', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr'],
		'tbody' : 'tr',
		'td' : 'flow',
		'textarea' : '#text',
		'tfoot' : 'tr',
		'th' : 'phrasing',
		'thead' : 'tr',
		'time' : 'phrasing',
		'title' : '#text',
		'tr' : ['th', 'td'],
		'track' : 'empty',
		'u' : 'phrasing',
		'ul' : 'li',
		'var' : 'phrasing',
		'video' : 'source', // transparent
		'wbr' : 'empty'
	},

	/**
	 * List of nodenames of blocklevel elements
	 * TODO: finish this list
	 * @hide
	 */
	blockLevelElements: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'div', 'pre'],

	/**
	 * List of nodenames of list elements
	 * @hide
	 */
	listElements: ['li', 'ol', 'ul'],

	/**
	 * Splits a DOM element at the given position up until the limiting object(s), so that it is valid HTML again afterwards.
	 * @param {RangeObject} range Range object that indicates the position of the splitting.
	 *				This range will be updated, so that it represents the same range as before the split.
	 * @param {jQuery} limit Limiting node(s) for the split.
	 *				The limiting node will not be included in the split itself.
	 *				If no limiting object is set, the document body will be the limiting object.
	 * @param {boolean} atEnd If set to true, the DOM will be splitted at the end of the range otherwise at the start.
	 * @return {object} jQuery object containing the two root DOM objects of the split, true if the DOM did not need to be split or false if the DOM could not be split
	 * @method
	 */
	split: function (range, limit, atEnd) {
		var
			splitElement = jQuery(range.startContainer),
			splitPosition = range.startOffset,
			updateRange, path, parents,
			newDom, insertElement, secondPart,
			i, pathLength, element, jqelement, children, newElement,
			next, prev, offset;


		if (atEnd) {
			splitElement = jQuery(range.endContainer);
			splitPosition = range.endOffset;
		}

		if (limit.length < 1) {
			limit = jQuery(document.body);
		}

		// we may have to update the range if it is not collapsed and we are splitting at the start
		updateRange = (!range.isCollapsed() && !atEnd);

		// find the path up to the highest object that will be splitted
		parents = splitElement.parents().get();
		parents.unshift(splitElement.get(0));

		jQuery.each(parents, function(index, element) {
			var isLimit = limit.filter(
					function(){
						return this == element;
					}).length;
			if (isLimit) {
				if (index > 0) {
					path = parents.slice(0, index);
				}
				return false;
			}
		});

		// nothing found to split -> return here
		if (! path) {
			return true;
		}

		path = path.reverse();

		// iterate over the path, create new dom nodes for every element and move
		// the contents right of the split to the new element
		for( i=0, pathLength = path.length; i < pathLength; ++i) {
			element = path[i];
			if (i === pathLength - 1) {
				// last element in the path -> we have to split it

				// split the last part into two parts
				if (element.nodeType === 3) {
					// text node
					secondPart = document.createTextNode(element.data.substring(splitPosition, element.data.length));
					element.data = element.data.substring(0, splitPosition);
				} else {
					// other nodes
					jqelement = jQuery(element);
					children = jqelement.contents();
					newElement = jqelement.clone(false).empty();
					secondPart = newElement.append(children.slice(splitPosition, children.length)).get(0);
				}

				// update the range if necessary
				if (updateRange && range.endContainer === element) {
					range.endContainer = secondPart;
					range.endOffset -= splitPosition;
					range.clearCaches();
				}

				// add the second part
				if (insertElement) {
					insertElement.prepend(secondPart);
				} else {
					jQuery(element).after(secondPart);
				}
			} else {
				// create the new element of the same type and prepend it to the previously created element
				newElement = jQuery(element).clone(false).empty();

				if (!newDom) {
					newDom = newElement;
				} else {
					insertElement.prepend(newElement);
				}
				insertElement = newElement;

				// move all contents right of the split to the new element
				while ( true ) {
					next = path[i+1].nextSibling;
					if ( !next ) { break; }
					insertElement.append(next);
				}

				// update the range if necessary
				if (updateRange && range.endContainer === element) {
					range.endContainer = newElement.get(0);
					prev = path[i+1];
					offset = 0;
					while ( true ) {
						prev = prev.previousSibling;
						if ( !prev ) { break; }
						offset++;
					}
					range.endOffset -= offset;
					range.clearCaches();
				}
			}
		}

		// append the new dom
		jQuery(path[0]).after(newDom);

		return jQuery([path[0], newDom ? newDom.get(0) : secondPart]);
	},

	/**
	 * Check whether the HTML 5 specification allows direct nesting of the given DOM
	 * objects.
	 * @param {object} outerDOMObject
	 *            outer (nesting) DOM Object
	 * @param {object} innerDOMObject
	 *            inner (nested) DOM Object
	 * @return {boolean} true when the nesting is allowed, false if not
	 * @method
	 */
	allowsNesting: function (outerDOMObject, innerDOMObject) {
		if (!outerDOMObject || !outerDOMObject.nodeName || !innerDOMObject
				|| !innerDOMObject.nodeName) {
			return false;
		}

		var outerNodeName = outerDOMObject.nodeName.toLowerCase(),
			innerNodeName = innerDOMObject.nodeName.toLowerCase();

		if (!this.children[outerNodeName]) {
			return false;
		}

		// check whether the nesting is configured by node names (like for table)
		if (this.children[outerNodeName] == innerNodeName) {
			return true;
		}
		if (jQuery.isArray(this.children[outerNodeName])
				&& jQuery.inArray(innerNodeName, this.children[outerNodeName]) >= 0) {
			return true;
		}

		if (jQuery.isArray(this.tags[this.children[outerNodeName]])
				&& jQuery.inArray(innerNodeName,
						this.tags[this.children[outerNodeName]]) >= 0) {
			return true;
		}

		return false;
	},

	/**
	 * Apply the given markup additively to the given range. The given rangeObject will be modified if necessary
	 * @param {GENTICS.Utils.RangeObject} rangeObject range to which the markup shall be added
	 * @param {jQuery} markup markup to be applied as jQuery object
	 * @param {boolean} allownesting true when nesting of the added markup is allowed, false if not (default: false)
	 * @method
	 */
	addMarkup: function (rangeObject, markup, nesting) {
		// split partially contained text nodes at the start and end of the range
		if (rangeObject.startContainer.nodeType === 3 && rangeObject.startOffset > 0
				&& rangeObject.startOffset < rangeObject.startContainer.data.length) {
			this.split(rangeObject, jQuery(rangeObject.startContainer).parent(),
				false);
		}
		if (rangeObject.endContainer.nodeType === 3 && rangeObject.endOffset > 0
				&& rangeObject.endOffset < rangeObject.endContainer.data.length) {
			this.split(rangeObject, jQuery(rangeObject.endContainer).parent(),
				true);
		}

		// get the range tree
		var rangeTree = rangeObject.getRangeTree();
		this.recursiveAddMarkup(rangeTree, markup, rangeObject, nesting);

		// cleanup DOM
		this.doCleanup({'merge' : true, 'removeempty' : true}, rangeObject);
	},

	/**
	 * Recursive helper method to add the given markup to the range
	 * @param rangeTree rangetree at the current level
	 * @param markup markup to be applied
	 * @param rangeObject range object, which eventually is updated
	 * @param nesting true when nesting of the added markup is allowed, false if not
	 * @hide
	 */
	recursiveAddMarkup: function (rangeTree, markup, rangeObject, nesting) {
		var i, innerRange, rangeLength;

		// iterate through all rangetree objects of that level
		for ( i = 0, rangeLength = rangeTree.length; i < rangeLength; ++i) {
			// check whether the rangetree object is fully contained and the markup may be wrapped around the object
			if (rangeTree[i].type == 'full' && this.allowsNesting(markup.get(0), rangeTree[i].domobj)) {
				// we wrap the object, when
				// 1. nesting of markup is allowed or the node is not of the markup to be added
				// 2. the node an element node or a non-empty text node
				if ((nesting || rangeTree[i].domobj.nodeName != markup.get(0).nodeName)
						&& (rangeTree[i].domobj.nodeType !== 3 || jQuery
								.trim(rangeTree[i].domobj.data).length !== 0)) {
					// wrap the object
					jQuery(rangeTree[i].domobj).wrap(markup);

					// TODO eventually update the range (if it changed)

					// when nesting is not allowed, we remove the markup from the inner element
					if (!nesting && rangeTree[i].domobj.nodeType !== 3) {
						innerRange = new GENTICS.Utils.RangeObject();
						innerRange.startContainer = innerRange.endContainer = rangeTree[i].domobj.parentNode;
						innerRange.startOffset = 0;
						innerRange.endOffset = innerRange.endContainer.childNodes.length;
						this.removeMarkup(innerRange, markup, jQuery(rangeTree[i].domobj.parentNode));
					}
				}
			} else {
				// TODO check whether the object may be replaced by the given markup
				if (false) {
					// TODO replace
				} else {
					// recurse into the children (if any), but not if nesting is not
					// allowed and the object is of the markup to be added
					if ((nesting || (rangeTree[i].domobj && rangeTree[i].domobj.nodeName !== markup.get(0).nodeName))
						&& rangeTree[i].children && rangeTree[i].children.length > 0) {
						this.recursiveAddMarkup(rangeTree[i].children, markup);
					}
				}
			}
		}
	},

	/**
	 * Find the highest occurrence of a node with given nodename within the parents
	 * of the start. When limit objects are given, the search stops there.
	 * The limiting object is of the found type, it won't be considered
	 * @param {DOMObject} start start object
	 * @param {String} nodeName name of the node to search for (case-insensitive)
	 * @param {jQuery} limit Limiting node(s) as jQuery object (if none given, the search will stop when there are no more parents)
	 * @return {DOMObject} the found DOM object or undefined
	 * @method
	 */
	findHighestElement: function (start, nodeName, limit) {
		nodeName = nodeName.toLowerCase();

		// this will be the highest found markup object (up to a limit object)
		var highestObject,
		// blah
			testObject = start,
		// helper function to stop when we reach a limit object
			isLimit = limit ? function () {
			return limit.filter(
					function() {
						return testObject == this;
					}
			).length;
		} : function () {
			return false;
		};

		// now get the highest parent that has the given markup (until we reached
		// one of the limit objects or there are no more parent nodes)
		while (!isLimit() && testObject) {
			if (testObject.nodeName.toLowerCase() === nodeName) {
				highestObject = testObject;
			}
			testObject = testObject.parentNode;
		}

		return highestObject;
	},

	/**
	 * Remove the given markup from the given range. The given rangeObject will be modified if necessary
	 * TODO: add parameter deep/shallow
	 * @param {GENTICS.Utils.RangeObject} rangeObject range from which the markup shall be removed
	 * @param {jQuery} markup markup to be removed as jQuery object
	 * @param {jQuery} limit Limiting node(s) as jQuery object
	 * @method
	 */
	removeMarkup: function (rangeObject, markup, limit) {
		var nodeName = markup.get(0).nodeName,
			startSplitLimit = this.findHighestElement(rangeObject.startContainer, nodeName, limit),
			endSplitLimit = this.findHighestElement(rangeObject.endContainer, nodeName, limit),
			didSplit = false,
			highestObject, root, rangeTree;

		if (startSplitLimit && rangeObject.startOffset > 0) {
			// when the start is in the start of its container, we don't split
			this.split(rangeObject, jQuery(startSplitLimit).parent(), false);
			didSplit = true;
		}

		if (endSplitLimit) {
			// when the end is in the end of its container, we don't split
			if (rangeObject.endContainer.nodeType === 3 && rangeObject.endOffset < rangeObject.endContainer.data.length) {
				this.split(rangeObject, jQuery(endSplitLimit).parent(), true);
				didSplit = true;
			}
			if (rangeObject.endContainer.nodeType === 1 && rangeObject.endOffset < rangeObject.childNodes.length) {
				this.split(rangeObject, jQuery(endSplitLimit).parent(), true);
				didSplit = true;
			}
		}

		// when we split the DOM, we maybe need to correct the range
		if (didSplit) {
			rangeObject.correctRange();
		}

		// find the highest occurrence of the markup
		highestObject = this.findHighestElement(rangeObject.getCommonAncestorContainer(), nodeName, limit);
		root = highestObject ? highestObject.parentNode : rangeObject.getCommonAncestorContainer();

		if (root) {
			// construct the range tree
			rangeTree = rangeObject.getRangeTree(root);
	
			// remove the markup from the range tree
			this.recursiveRemoveMarkup(rangeTree, markup);
	
			// cleanup DOM
			this.doCleanup({'merge' : true, 'removeempty' : true}, rangeObject, root);
		}
	},

	/**
	 * TODO: pass the range itself and eventually update it if necessary
	 * Recursive helper method to remove the given markup from the range
	 * @param rangeTree rangetree at the current level
	 * @param markup markup to be applied
	 * @hide
	 */
	recursiveRemoveMarkup: function (rangeTree, markup) {
		var i, rangeLength, content;
		// iterate over the rangetree objects of this level
		for (i = 0, rangeLength = rangeTree.length; i < rangeLength; ++i) {
			// check whether the object is the markup to be removed and is fully into the range
			if (rangeTree[i].type == 'full' && rangeTree[i].domobj.nodeName == markup.get(0).nodeName) {
				// found the markup, so remove it
				content = jQuery(rangeTree[i].domobj).contents();
				if (content.length > 0) {
					// when the object has children, we unwrap them
					content.first().unwrap();
				} else {
					// obj has no children, so just remove it
					jQuery(rangeTree[i].domobj).remove();
				}
			}

			// if the object has children, we do the recursion now
			if (rangeTree[i].children) {
				this.recursiveRemoveMarkup(rangeTree[i].children, markup);
			}
		}
	},

	/**
	 * Cleanup the DOM, starting with the given startobject (or the common ancestor container of the given range)
	 * ATTENTION: If range is a selection you need to update the selection after doCleanup
	 * Cleanup modes (given as properties in 'cleanup'):
	 * <pre>
	 * - merge: merges multiple successive nodes of same type, if this is allowed, starting at the children of the given node (defaults to false)
	 * - removeempty: removes empty element nodes (defaults to false)
	 * </pre>
	 * Example for calling this method:<br/>
	 * <code>GENTICS.Utils.Dom.doCleanup({merge:true,removeempty:false}, range)</code>
	 * @param {object} cleanup type of cleanup to be done
	 * @param {GENTICS.Utils.RangeObject} rangeObject range which is eventually updated
	 * @param {DOMObject} start start object, if not given, the commonancestorcontainer is used as startobject insted
	 * @return {boolean} true when the range (startContainer/startOffset/endContainer/endOffset) was modified, false if not
	 * @method
	 */
	doCleanup: function(cleanup, rangeObject, start) {
		var that = this, prevNode, modifiedRange, startObject, startOffset, endOffset;

		if (typeof cleanup === 'undefined') {
			cleanup = {};
		}
		if (typeof cleanup.merge === 'undefined') {
			cleanup.merge = false;
		}
		if (typeof cleanup.removeempty === 'undefined') {
			cleanup.removeempty = false;
		}

		if (typeof start === 'undefined' && rangeObject) {
			start = rangeObject.getCommonAncestorContainer();
		}
		// remember the previous node here (successive nodes of same type will be merged into this)
		prevNode = false;
		// check whether the range needed to be modified during merging
		modifiedRange = false;
		// get the start object
		startObject = jQuery(start);
		startOffset = rangeObject.startOffset;
		endOffset = rangeObject.endOffset;

		// iterate through all sub nodes
		startObject.contents().each(function(index) {
			// decide further actions by node type
			switch(this.nodeType) {
			// found a non-text node
			case 1:
				if (prevNode && prevNode.nodeName == this.nodeName) {
					// found a successive node of same type

					// now we check whether the selection starts or ends in the mother node after the current node
					if (rangeObject.startContainer === startObject && startOffset > index) {
						// there will be one less object, so reduce the startOffset by one
						rangeObject.startOffset -= 1;
						// set the flag for range modification
						modifiedRange = true;
					}
					if (rangeObject.endContainer === startObject && endOffset > index) {
						// there will be one less object, so reduce the endOffset by one
						rangeObject.endOffset -= 1;
						// set the flag for range modification
						modifiedRange = true;
					}

					// merge the contents of this node into the previous one
					jQuery(prevNode).append(jQuery(this).contents());

					// after merging, we eventually need to cleanup the prevNode again
					modifiedRange |= that.doCleanup(cleanup, rangeObject, prevNode);

					// remove this node
					jQuery(this).remove();
					
				} else {
					
					// do the recursion step here
					modifiedRange |= that.doCleanup(cleanup, rangeObject, this);

					// eventually remove empty elements
					var removed = false;
					if (cleanup.removeempty) {
						if (GENTICS.Utils.Dom.isBlockLevelElement(this) && this.childNodes.length === 0) {
//							jQuery(this).remove();
							removed = true;
						}
						if (jQuery.inArray(this.nodeName.toLowerCase(), that.mergeableTags) >= 0
								&& jQuery(this).text().length === 0 && this.childNodes.length === 0) {
//							jQuery(this).remove();
							removed = true;
						}
					}

					// when the current node was not removed, we eventually store it as previous (mergeable) tag
					if (!removed) {
						if (jQuery.inArray(this.nodeName.toLowerCase(), that.mergeableTags) >= 0) {
							prevNode = this;
						} else {
							prevNode = false;
						}
					} else {
						// now we check whether the selection starts or ends in the mother node of this
						if (rangeObject.startContainer === this.parentNode && startOffset > index) {
							// there will be one less object, so reduce the startOffset by one
							rangeObject.startOffset = rangeObject.startOffset - 1;
							// set the flag for range modification
							modifiedRange = true;
						}
						if (rangeObject.endContainer === this.parentNode && endOffset > index) {
							// there will be one less object, so reduce the endOffset by one
							rangeObject.endOffset = rangeObject.endOffset - 1;
							// set the flag for range modification
							modifiedRange = true;
						}
										
						// remove this text node
						jQuery(this).remove();

					}
				}

				break;
			// found a text node
			case 3:
				// found a text node
				if (prevNode && prevNode.nodeType === 3 && cleanup.merge) {
					// the current text node will be merged into the last one, so
					// check whether the selection starts or ends in the current
					// text node
					if (rangeObject.startContainer === this) {
						// selection starts in the current text node

						// update the start container to the last node
						rangeObject.startContainer = prevNode;

						// update the start offset
						rangeObject.startOffset += prevNode.nodeValue.length;

						// set the flag for range modification
						modifiedRange = true;
						
					} else if (rangeObject.startContainer === prevNode.parentNode
							&& rangeObject.startOffset === that.getIndexInParent(prevNode) + 1) {
						// selection starts right between the previous and current text nodes (which will be merged)

						// update the start container to the previous node
						rangeObject.startContainer = prevNode;

						// set the start offset
						rangeObject.startOffset = prevNode.nodeValue.length;

						// set the flag for range modification
						modifiedRange = true;
					}

					if (rangeObject.endContainer === this) {
						// selection ends in the current text node

						// update the end container to be the last node
						rangeObject.endContainer = prevNode;

						// update the end offset
						rangeObject.endOffset += prevNode.nodeValue.length;

						// set the flag for range modification
						modifiedRange = true;

					} else if (rangeObject.endContainer === prevNode.parentNode
							&& rangeObject.endOffset === that.getIndexInParent(prevNode) + 1) {
						// selection ends right between the previous and current text nodes (which will be merged)

						// update the end container to the previous node
						rangeObject.endContainer = prevNode;

						// set the end offset
						rangeObject.endOffset = prevNode.nodeValue.length;

						// set the flag for range modification
						modifiedRange = true;
					}

					// now append the contents of the current text node into the previous
					prevNode.data += this.data;

				// remove empty text nodes	
				} else if ( this.nodeValue === '' && cleanup.removeempty ) {
					// do nothing here.
					
				// remember it as the last text node if not empty
				} else if ( !(this.nodeValue === '' && cleanup.removeempty) ) {
					prevNode = this;
					// we are finish here don't delete this node
					break;
				}

				// now we check whether the selection starts or ends in the mother node of this
				if (rangeObject.startContainer === this.parentNode && rangeObject.startOffset > index) {
					// there will be one less object, so reduce the startOffset by one
					rangeObject.startOffset = rangeObject.startOffset - 1;
					// set the flag for range modification
					modifiedRange = true;
				}
				if (rangeObject.endContainer === this.parentNode && rangeObject.endOffset > index) {
					// there will be one less object, so reduce the endOffset by one
					rangeObject.endOffset = rangeObject.endOffset - 1;
					// set the flag for range modification
					modifiedRange = true;
				}

				// remove this text node
				jQuery(this).remove();

				break;
			}
		});

		// eventually remove the startnode itself
//		if (cleanup.removeempty
//				&& GENTICS.Utils.Dom.isBlockLevelElement(start)
//				&& (!start.childNodes || start.childNodes.length === 0)) {
//			if (rangeObject.startContainer == start) {
//				rangeObject.startContainer = start.parentNode;
//				rangeObject.startOffset = GENTICS.Utils.Dom.getIndexInParent(start);
//			}
//			if (rangeObject.endContainer == start) {
//				rangeObject.endContainer = start.parentNode;
//				rangeObject.endOffset = GENTICS.Utils.Dom.getIndexInParent(start);
//			}
//			startObject.remove();
//			modifiedRange = true;
//		}

		if (modifiedRange) {
			rangeObject.clearCaches();
		}

		return modifiedRange;
	},

	/**
	 * Get the index of the given node within its parent node
	 * @param {DOMObject} node node to check
	 * @return {Integer} index in the parent node or false if no node given or node has no parent
	 * @method
	 */
	getIndexInParent: function (node) {
		if (!node) {
			return false;
		}

		var
			index = 0,
			check = node.previousSibling;

		while(check) {
			index++;
			check = check.previousSibling;
		}

		return index;
	},

	/**
	 * Check whether the given node is a blocklevel element
	 * @param {DOMObject} node node to check
	 * @return {boolean} true if yes, false if not (or null)
	 * @method
	 */
	isBlockLevelElement: function (node) {
		if (!node) {
			return false;
		}
		if (node.nodeType === 1 && jQuery.inArray(node.nodeName.toLowerCase(), this.blockLevelElements) >= 0) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * Check whether the given node is a linebreak element
	 * @param {DOMObject} node node to check
	 * @return {boolean} true for linebreak elements, false for everything else
	 * @method
	 */
	isLineBreakElement: function (node) {
		if (!node) {
			return false;
		}
		return node.nodeType === 1 && node.nodeName.toLowerCase() == 'br';
	},

	/**
	 * Check whether the given node is a list element
	 * @param {DOMObject} node node to check
	 * @return {boolean} true for list elements (li, ul, ol), false for everything else
	 * @method
	 */
	isListElement: function (node) {
		if (!node) {
			return false;
		}
		return node.nodeType === 1 && jQuery.inArray(node.nodeName.toLowerCase(), this.listElements) >= 0;
	},

	/**
	 * This method checks, whether the passed dom object is a dom object, that would
	 * be split in cases of pressing enter. This currently is true for paragraphs
	 * and headings
	 * @param {DOMObject} el
	 *            dom object to check
	 * @return {boolean} true for split objects, false for other
	 * @method
	 */
	isSplitObject: function(el) {
		if (el.nodeType === 1){
			switch(el.nodeName.toLowerCase()) {
			case 'p':
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
			case 'li':
				return true;
			}
		}
		return false;
	},

	/**
	 * Starting with the given position (between nodes), search in the given direction to an adjacent notempty text node
	 * @param {DOMObject} parent parent node containing the position
	 * @param {Integer} index index of the position within the parent node
	 * @param {boolean} searchleft true when search direction is 'left' (default), false for 'right'
	 * @param {object} stopat define at which types of element we shall stop, may contain the following properties
	 * <pre>
	 * - blocklevel (default: true)
	 * - list (default: true)
	 * - linebreak (default: true)
	 * </pre>
	 * @return {DOMObject} the found text node or false if none found
	 * @method
	 */
	searchAdjacentTextNode: function (parent, index, searchleft, stopat) {
		if (!parent || parent.nodeType !== 1 || index < 0 || index > parent.childNodes.length) {
			return false;
		}

		if (typeof stopat === 'undefined') {
			stopat = {'blocklevel' : true, 'list' : true, 'linebreak' : true};
		}

		if (typeof stopat.blocklevel === 'undefined') {
			stopat.blocklevel = true;
		}
		if (typeof stopat.list === 'undefined') {
			stopat.list = true;
		}
		if (typeof stopat.linebreak === 'undefined') {
			stopat.linebreak = true;
		}

		if (typeof searchleft === 'undefined') {
			searchleft = true;
		}

		var
			nextNode,
			currentParent = parent;

		// start at the node left/right of the given position
		if (searchleft && index > 0) {
			nextNode = parent.childNodes[index - 1];
		}
		if (!searchleft && index < parent.childNodes.length) {
			nextNode = parent.childNodes[index];
		}
		
		//currentParent is not a number therefore it is sufficient to directly test for it with while(currentParent)
		//otherwise there would be an error if the object is null
		while (currentParent) {
		//while (typeof currentParent !== 'undefined') {
			if (!nextNode) {
				// no next node found, check whether the parent is a blocklevel element
				if (stopat.blocklevel && this.isBlockLevelElement(currentParent)) {
					// do not leave block level elements
					return false;
				} else if (stopat.list && this.isListElement(currentParent)) {
					// do not leave list elements
					return false;
				} else {
					// continue with the parent
					nextNode = searchleft ? currentParent.previousSibling : currentParent.nextSibling;
					currentParent = currentParent.parentNode;
				}
			} else if (nextNode.nodeType === 3 && jQuery.trim(nextNode.data).length > 0) {
				// we are lucky and found a notempty text node
				return nextNode;
			} else if (stopat.blocklevel && this.isBlockLevelElement(nextNode)) {
				// we found a blocklevel element, stop here
				return false;
			} else if (stopat.linebreak && this.isLineBreakElement(nextNode)) {
				// we found a linebreak, stop here
				return false;
			} else if (stopat.list && this.isListElement(nextNode)) {
				// we found a linebreak, stop here
				return false;
			} else if (nextNode.nodeType === 3) {
				// we found an empty text node, so step to the next
				nextNode = searchleft ? nextNode.previousSibling : nextNode.nextSibling;
			} else {
				// we found a non-blocklevel element, step into
				currentParent = nextNode;
				nextNode = searchleft ? nextNode.lastChild : nextNode.firstChild;
			}
		}
	},

	/**
	 * Insert the given DOM Object into the start/end of the given range. The method
	 * will find the appropriate place in the DOM tree for inserting the given
	 * object, and will eventually split elements in between. The given range will
	 * be updated if necessary. The updated range will NOT embrace the inserted
	 * object, which means that the object is actually inserted before or after the
	 * given range (depending on the atEnd parameter)
	 *
	 * @param {jQuery}
	 *				object object to insert into the DOM
	 * @param {GENTICS.Utils.RangeObject}
	 *				range range where to insert the object (at start or end)
	 * @param {jQuery}
	 *				limit limiting object(s) of the DOM modification
	 * @param {boolean}
	 *				atEnd true when the object shall be inserted at the end, false for
	 *				insertion at the start (default)
	 * @param {boolean}
	 *				true when the insertion shall be done, even if inserting the element
	 *				would not be allowed, false to deny inserting unallowed elements (default)
	 * @return true if the object could be inserted, false if not.
	 * @method
	 */
	insertIntoDOM: function (object, range, limit, atEnd, force) {
		// first find the appropriate place to insert the given object
		var parentElements = range.getContainerParents(limit, atEnd),
			that = this,
			newParent,
			container, offset, splitParts, contents;

		if (!limit) {
			limit = jQuery(document.body);
		}

		// if no parent elements exist (up to the limit), the new parent will be the
		// limiter itself
		if (parentElements.length === 0) {
			newParent = limit.get(0);
		} else {
			jQuery.each(parentElements, function (index, parent) {
				if (that.allowsNesting(parent, object.get(0))) {
					newParent = parent;
					return false;
				}
			});
		}

		if (typeof newParent === 'undefined' && limit.length > 0) {
			// found no possible new parent, so split up to the limit object
			newParent = limit.get(0);
		}

		// check whether it is allowed to insert the element at all
		if (!this.allowsNesting(newParent, object.get(0)) && !force) {
			return false;
		}

		if (typeof newParent !== 'undefined') {
			// we found a possible new parent, so we split the DOM up to the new parent
			splitParts = this.split(range, jQuery(newParent), atEnd);
			if (splitParts === true) {
				// DOM was not split (there was no need to split it), insert the new object anyway
				container = range.startContainer;
				offset = range.startOffset;
				if (atEnd) {
					container = range.endContainer;
					offset = range.endOffset;
				}
				if (offset === 0) {
					// insert right before the first element in the container
					contents = jQuery(container).contents();
					if (contents.length > 0) {
						contents.eq(0).before(object);
					} else {
						jQuery(container).append(object);
					}
					return true;
				} else {
					// insert right after the element at offset-1
					jQuery(container).contents().eq(offset-1).after(object);
					return true;
				}
			} else if (splitParts) {
				// if the DOM could be split, we insert the new object in between the split parts
				splitParts.eq(0).after(object);
				return true;
			} else {
				// could not split, so could not insert
				return false;
			}
		} else {
			// found no possible new parent, so we shall not insert
			return false;
		}
	},

	/**
	 * Remove the given DOM object from the DOM and modify the given range to reflect the user expected range after the object was removed
	 * TODO: finish this
	 * @param {DOMObject} object DOM object to remove
	 * @param {GENTICS.Utils.RangeObject} range range which eventually be modified
	 * @param {boolean} preserveContent true if the contents of the removed DOM object shall be preserved, false if not (default: false)
	 * @return true if the DOM object could be removed, false if not
	 * @hide
	 */
	removeFromDOM: function (object, range, preserveContent) {
		if (preserveContent) {
			// check whether the range will need modification
			var indexInParent = this.getIndexInParent(object),
				numChildren = jQuery(object).contents().length,
				parent = object.parentNode;

			if (range.startContainer == parent && range.startOffset > indexInParent) {
				range.startOffset += numChildren - 1;
			} else if (range.startContainer == object) {
				range.startContainer = parent;
				range.startOffset = indexInParent + range.startOffset;
			}

			if (range.endContainer == parent && range.endOffset > indexInParent) {
				range.endOffset += numChildren - 1;
			} else if (range.endContainer == object) {
				range.endContainer = parent;
				range.endOffset = indexInParent + range.endOffset;
			}

			// we simply unwrap the children of the object
			jQuery(object).contents().unwrap();

			// optionally do cleanup
			this.doCleanup({'merge' : true}, range, parent);
		} else {
			// TODO
		}
	},

	/**
	 * Remove the content defined by the given range from the DOM. Update the given
	 * range object to be a collapsed selection at the place of the previous
	 * selection.
	 * @param rangeObject range object
	 * @return true if the range could be removed, false if not
	 */
	removeRange: function (rangeObject) {
		if (!rangeObject) {
			// no range given
			return false;
		}
		if (rangeObject.isCollapsed()) {
			// the range is collapsed, nothing to delete
			return false;
		}

		// split partially contained text nodes at the start and end of the range
		if (rangeObject.startContainer.nodeType == 3 && rangeObject.startOffset > 0
			&& rangeObject.startOffset < rangeObject.startContainer.data.length) {
			this.split(rangeObject, jQuery(rangeObject.startContainer).parent(),
					   false);
		}
		if (rangeObject.endContainer.nodeType == 3 && rangeObject.endOffset > 0
			&& rangeObject.endOffset < rangeObject.endContainer.data.length) {
			this.split(rangeObject, jQuery(rangeObject.endContainer).parent(),
					   true);
		}

		// construct the range tree
		var rangeTree = rangeObject.getRangeTree();

		// collapse the range
		rangeObject.endContainer = rangeObject.startContainer;
		rangeObject.endOffset = rangeObject.startOffset;

		// remove the markup from the range tree
		this.recursiveRemoveRange(rangeTree, rangeObject);

		// do some cleanup
		this.doCleanup({'merge' : true}, rangeObject);
//		this.doCleanup({'merge' : true, 'removeempty' : true}, rangeObject);

		// clear the caches of the range object
		rangeObject.clearCaches();
	},

	recursiveRemoveRange: function (rangeTree, rangeObject) {
		// iterate over the rangetree objects of this level
		for (var i = 0; i < rangeTree.length; ++i) {
			// check for nodes fully in the range
			if (rangeTree[i].type == 'full') {
				// if the domobj is the startcontainer, or the startcontainer is inside the domobj, we need to update the rangeObject
				if (jQuery(rangeObject.startContainer).parents().andSelf().filter(rangeTree[i].domobj).length > 0) {
					rangeObject.startContainer = rangeObject.endContainer = rangeTree[i].domobj.parentNode;
					rangeObject.startOffset = rangeObject.endOffset = this.getIndexInParent(rangeTree[i].domobj);
				}

				// remove the object from the DOM
				jQuery(rangeTree[i].domobj).remove();
			} else if (rangeTree[i].type == 'partial' && rangeTree[i].children) {
				// node partially selected and has children, so do recursion
				this.recursiveRemoveRange(rangeTree[i].children, rangeObject);
			}
		}
	},

	/**
	 * Extend the given range to have start and end at the nearest word boundaries to the left (start) and right (end)
	 * @param {GENTICS.Utils.RangeObject} range range to be extended
	 * @param {boolean} fromBoundaries true if extending will also be done, if one or both ends of the range already are at a word boundary, false if not, default: false
	 * @method
	 */
	extendToWord: function (range, fromBoundaries) {
		// search the word boundaries to the left and right
		var leftBoundary = this.searchWordBoundary(range.startContainer, range.startOffset, true),
			rightBoundary = this.searchWordBoundary(range.endContainer, range.endOffset, false);

		// check whether we must not extend the range from word boundaries
		if (!fromBoundaries) {
			// we only extend the range if both ends would be different
			if (range.startContainer == leftBoundary.container && range.startOffset == leftBoundary.offset) {
				return;
			}
			if (range.endContainer == rightBoundary.container && range.endOffset == rightBoundary.offset) {
				return;
			}
		}

		// set the new boundaries
		range.startContainer = leftBoundary.container;
		range.startOffset = leftBoundary.offset;
		range.endContainer = rightBoundary.container;
		range.endOffset = rightBoundary.offset;

		// correct the range
		range.correctRange();

		// clear caches
		range.clearCaches();
	},

	/**
	 * Helper method to check whether the given DOM object is a word boundary.
	 * @param {DOMObject} object DOM object in question
	 * @return {boolean} true when the DOM object is a word boundary, false if not
	 * @hide
	 */
	isWordBoundaryElement: function (object) {
		if (!object || !object.nodeName) {
			return false;
		}
		return jQuery.inArray(object.nodeName.toLowerCase(), this.nonWordBoundaryTags) == -1;
	},

	/**
	 * Search for the next word boundary, starting at the given position
	 * @param {DOMObject} container container of the start position
	 * @param {Integer} offset offset of the start position
	 * @param {boolean} searchleft true for searching to the left, false for searching to the right (default: true)
	 * @return {object} object with properties 'container' and 'offset' marking the found word boundary
	 * @method
	 */
	searchWordBoundary: function (container, offset, searchleft) {
		if (typeof searchleft === 'undefined') {
			searchleft = true;
		}
		var boundaryFound = false, wordBoundaryPos, tempWordBoundaryPos, textNode;
		while (!boundaryFound) {
			// check the node type
			if (container.nodeType === 3) {
				// we are currently in a text node

				// find the nearest word boundary character
				if (!searchleft) {
					// search right
					wordBoundaryPos = container.data.substring(offset).search(this.nonWordRegex);
					if (wordBoundaryPos != -1) {
						// found a word boundary
						offset = offset + wordBoundaryPos;
						boundaryFound = true;
					} else {
						// found no word boundary, so we set the position after the container
						offset = this.getIndexInParent(container) + 1;
						container = container.parentNode;
					}
				} else {
					// search left
					wordBoundaryPos = container.data.substring(0, offset).search(this.nonWordRegex);
					tempWordBoundaryPos = wordBoundaryPos;
					while (tempWordBoundaryPos != -1) {
						wordBoundaryPos = tempWordBoundaryPos;
						tempWordBoundaryPos = container.data.substring(
								wordBoundaryPos + 1, offset).search(this.nonWordRegex);
						if (tempWordBoundaryPos != -1) {
							tempWordBoundaryPos = tempWordBoundaryPos + wordBoundaryPos + 1;
						}
					}

					if (wordBoundaryPos != -1) {
						// found a word boundary
						offset = wordBoundaryPos + 1;
						boundaryFound = true;
					} else {
						// found no word boundary, so we set the position before the container
						offset = this.getIndexInParent(container);
						container = container.parentNode;
					}
				}
			} else if (container.nodeType === 1) {
				// we are currently in an element node (between nodes)

				if (!searchleft) {
					// check whether there is an element to the right
					if (offset < container.childNodes.length) {
						// there is an element to the right, check whether it is a word boundary element
						if (this.isWordBoundaryElement(container.childNodes[offset])) {
							// we are done
							boundaryFound = true;
						} else {
							// element to the right is no word boundary, so enter it
							container = container.childNodes[offset];
							offset = 0;
						}
					} else {
						// no element to the right, check whether the element itself is a boundary element
						if (this.isWordBoundaryElement(container)) {
							// we are done
							boundaryFound = true;
						} else {
							// element itself is no boundary element, so go to parent
							offset = this.getIndexInParent(container) + 1;
							container = container.parentNode;
						}
					}
				} else {
					// check whether there is an element to the left
					if (offset > 0) {
						// there is an element to the left, check whether it is a word boundary element
						if (this.isWordBoundaryElement(container.childNodes[offset - 1])) {
							// we are done
							boundaryFound = true;
						} else {
							// element to the left is no word boundary, so enter it
							container = container.childNodes[offset - 1];
							offset = container.nodeType === 3 ? container.data.length : container.childNodes.length;
						}
					} else {
						// no element to the left, check whether the element itself is a boundary element
						if (this.isWordBoundaryElement(container)) {
							// we are done
							boundaryFound = true;
						} else {
							// element itself is no boundary element, so go to parent
							offset = this.getIndexInParent(container);
							container = container.parentNode;
						}
					}
				}
			}
		}

		if (container.nodeType !== 3) {
			textNode = this.searchAdjacentTextNode(container, offset, !searchleft);
			if (textNode) {
				container = textNode;
				offset = searchleft ? 0 : container.data.length;
			}
		}

		return {'container' : container, 'offset' : offset};
	},

	/**
	 * Check whether the given dom object is empty
	 * @param {DOMObject} domObject object to check
	 * @return {boolean} true when the object is empty, false if not
	 * @method
	 */
	isEmpty: function (domObject) {
		// a non dom object is considered empty
		if (!domObject) {
			return true;
		}

		// some tags are considered to be non-empty
		if (jQuery.inArray(domObject.nodeName.toLowerCase(), this.nonEmptyTags) != -1) {
			return false;
		}

		// text nodes are not empty, if they contain non-whitespace characters
		if (domObject.nodeType === 3) {
			return domObject.data.search(/\S/) == -1;
		}

		// all other nodes are not empty if they contain at least one child which is not empty
		for (var i = 0, childNodes = domObject.childNodes.length; i < childNodes; ++i) {
			if (!this.isEmpty(domObject.childNodes[i])) {
				return false;
			}
		}

		// found no contents, so the element is empty
		return true;
	},

	/**
	 * Set the cursor (collapsed selection) right after the given DOM object
	 * @param domObject DOM object
	 * @method
	 */
	setCursorAfter: function (domObject) {
		var 
			newRange = new GENTICS.Utils.RangeObject(),
			index = this.getIndexInParent(domObject),
			targetNode,
			offset;
		
		// selection cannot be set between to TEXT_NODEs
		// if domOject is a Text node set selection at last position in that node
		if ( domObject.nodeType == 3) {
			targetNode = domObject;
			offset = targetNode.nodeValue.length;

		// if domOject is a Text node set selection at last position in that node
		} else if ( domObject.nextSibling && domObject.nextSibling.nodeType == 3) {
			targetNode = domObject.nextSibling;
			offset = 0;
		} else {
			targetNode = domObject.parentNode;
			offset = this.getIndexInParent(domObject) + 1;
		}
		
		newRange.startContainer = newRange.endContainer = targetNode;
		newRange.startOffset = newRange.endOffset = offset;

		// select the range
		newRange.select();
		
		return newRange;
	},
	
	/**
	 * Select a DOM node
	 * will create a new range which spans the provided dom node and selects it afterwards
	 * @param domObject DOM object
	 * @method
	 */
	selectDomNode: function (domObject) {
		var newRange = new GENTICS.Utils.RangeObject();
		newRange.startContainer = newRange.endContainer = domObject.parentNode;
		newRange.startOffset = this.getIndexInParent(domObject);
		newRange.endOffset = newRange.startOffset + 1;
		newRange.select();
	},

	/**
	 * Set the cursor (collapsed selection) at the start into the given DOM object
	 * @param domObject DOM object
	 * @method
	 */
	setCursorInto: function (domObject) {
		// set a new range into the given dom object
		var newRange = new GENTICS.Utils.RangeObject();
		newRange.startContainer = newRange.endContainer = domObject;
		newRange.startOffset = newRange.endOffset = 0;

		// select the range
		newRange.select();
	},
	

	/**
	 * "An editing host is a node that is either an Element with a contenteditable
	 * attribute set to the true state, or the Element child of a Document whose
	 * designMode is enabled."
	 * @param domObject DOM object
	 * @method
	 */
	isEditingHost: function (node) {
		return node
			&& node.nodeType == 1 //ELEMENT_NODE
			&& (node.contentEditable == "true"
			|| (node.parentNode
			&& node.parentNode.nodeType == 9 //DOCUEMENT_NODE
			&& node.parentNode.designMode == "on"));
	},

	/**
	 * "Something is editable if it is a node which is not an editing host, does
	 * not have a contenteditable attribute set to the false state, and whose
	 * parent is an editing host or editable."
	 * @param domObject DOM object
	 * @method
	 */
	isEditable: function (node) {
		// This is slightly a lie, because we're excluding non-HTML elements with
		// contentEditable attributes.
		return node
			&& !this.isEditingHost(node)
			&& (node.nodeType != 1 || node.contentEditable != "false") // ELEMENT_NODE
			&& (this.isEditingHost(node.parentNode) || this.isEditable(node.parentNode));
	},

	/**
	 * "The editing host of node is null if node is neither editable nor an editing
	 * host; node itself, if node is an editing host; or the nearest ancestor of
	 * node that is an editing host, if node is editable."
	 * @param domObject DOM object
	 * @method
	 */
	getEditingHostOf: function(node) {
		if (this.isEditingHost(node)) {
			return node;
		} else if (this.isEditable(node)) {
			var ancestor = node.parentNode;
			while (!this.isEditingHost(ancestor)) {
				ancestor = ancestor.parentNode;
			}
			return ancestor;
		} else {
			return null;
		}
	},

	/**
	 * 
	 * "Two nodes are in the same editing host if the editing host of the first is
	 * non-null and the same as the editing host of the second."
	 * @param node1 DOM object
	 * @param node2 DOM object
	 * @method
	 */
	inSameEditingHost: function (node1, node2) {
		return this.getEditingHostOf(node1)
			&& this.getEditingHostOf(node1) == this.getEditingHostOf(node2);
	},

	// "A block node is either an Element whose "display" property does not have
	// resolved value "inline" or "inline-block" or "inline-table" or "none", or a
	// Document, or a DocumentFragment."
	isBlockNode: function (node) {
		return node
			&& ((node.nodeType == $_.Node.ELEMENT_NODE && $_( ["inline", "inline-block", "inline-table", "none"] ).indexOf($_.getComputedStyle(node).display) == -1)
			|| node.nodeType == $_.Node.DOCUMENT_NODE
			|| node.nodeType == $_.Node.DOCUMENT_FRAGMENT_NODE);
	},

	/**
	 * Get the first visible child of the given node.
	 * @param node node
	 * @param includeNode when set to true, the node itself may be returned, otherwise only children are allowed
	 * @return first visible child or null if none found
	 */
	getFirstVisibleChild: function (node, includeNode) {
		// no node -> no child
		if (!node) {
			return null;
		}

		// check whether the node itself is visible
		if ((node.nodeType == $_.Node.TEXT_NODE && this.isEmpty(node))
			|| (node.nodeType == $_.Node.ELEMENT_NODE && node.offsetHeight == 0 && jQuery.inArray(node.nodeName.toLowerCase(), this.nonEmptyTags) === -1)) {
			return null;
		}

		// if the node is a text node, or does not have children, or is not editable, it is the first visible child
		if (node.nodeType == $_.Node.TEXT_NODE
				|| (node.nodeType == $_.Node.ELEMENT_NODE && node.childNodes.length == 0)
				|| !jQuery(node).contentEditable()) {
			return includeNode ? node : null;
		}

		// otherwise traverse through the children
		for (var i = 0; i < node.childNodes.length; ++i) {
			var visibleChild = this.getFirstVisibleChild(node.childNodes[i], true);
			if (visibleChild != null) {
				return visibleChild;
			}
		}

		return null;
	},

	/**
	 * Get the last visible child of the given node.
	 * @param node node
	 * @param includeNode when set to true, the node itself may be returned, otherwise only children are allowed
	 * @return last visible child or null if none found
	 */
	getLastVisibleChild: function (node, includeNode) {
		// no node -> no child
		if (!node) {
			return null;
		}

		// check whether the node itself is visible
		if ((node.nodeType == $_.Node.TEXT_NODE && this.isEmpty(node))
			|| (node.nodeType == $_.Node.ELEMENT_NODE && node.offsetHeight == 0 && jQuery.inArray(node.nodeName.toLowerCase(), this.nonEmptyTags) === -1)) {
			return null;
		}

		// if the node is a text node, or does not have children, or is not editable, it is the first visible child
		if (node.nodeType == $_.Node.TEXT_NODE
				|| (node.nodeType == $_.Node.ELEMENT_NODE && node.childNodes.length == 0)
				|| !jQuery(node).contentEditable()) {
			return includeNode ? node : null;
		}

		// otherwise traverse through the children
		for (var i = node.childNodes.length - 1; i >= 0; --i) {
			var visibleChild = this.getLastVisibleChild(node.childNodes[i], true);
			if (visibleChild != null) {
				return visibleChild;
			}
		}

		return null;
	}
});


/**
 * Create the singleton object
 * @hide
 */
GENTICS.Utils.Dom = new Dom();

return GENTICS.Utils.Dom;

});

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

// Do not add dependencies that require depend on aloha/core
define('aloha/pluginmanager',[ 'aloha/jquery', 'util/class' ],
function( jQuery, Class ) {
	
	
	/**
	 * The Plugin Manager controls the lifecycle of all Aloha Plugins.
	 *
	 * @namespace Aloha
	 * @class PluginManager
	 * @singleton
	 */
	return new (Class.extend({
		plugins: {},

		/**
		 * Initialize all registered plugins
		 * @return void
		 * @hide
		 */
		init: function(next, userPlugins) {

			var
				me = this,
				globalSettings = ( Aloha && Aloha.settings ) ? Aloha.settings.plugins||{}: {},
				i,
				plugin,
				pluginName;

			// Global to local settings
			for ( pluginName in globalSettings ) {
				
				if ( globalSettings.hasOwnProperty( pluginName ) ) {
					
					plugin = this.plugins[pluginName] || false;
					
					if ( plugin ) {
						plugin.settings = globalSettings[ pluginName ] || {};
					}
				}
			}

			// Default: All loaded plugins are enabled
			if ( !userPlugins.length ) {
				
				for ( pluginName in this.plugins ) {
					
					if ( this.plugins.hasOwnProperty( pluginName ) ) {
						userPlugins.push( pluginName );
					}
				}
			}
			
			// Enable Plugins specified by User
			for ( i=0; i < userPlugins.length; ++i ) {
				
				pluginName = userPlugins[ i ];
				plugin = this.plugins[ pluginName ]||false;
				
				if ( plugin ) {
					
					plugin.settings = plugin.settings || {};
					
					if ( typeof plugin.settings.enabled === 'undefined' ) {
						plugin.settings.enabled = true;
					}
					
					if ( plugin.settings.enabled ) {
						if ( plugin.checkDependencies() ) {
							plugin.init();
						}
					}
				}
			}
			
			next();
		},

		/**
		 * Register a plugin
		 * @param {Plugin} plugin plugin to register
		 */
		register: function( plugin ) {
			
			if ( !plugin.name ) {
				throw new Error( 'Plugin does not have an name.' );
			}
			
			if ( this.plugins[ plugin.name ]) {
				throw new Error( 'Already registered the plugin "' + plugin.name  + '"!' );
			}
			
			this.plugins[ plugin.name ] = plugin;
		},

		/**
		 * Pass the given jQuery object, which represents an editable to all plugins, so that they can make the content clean (prepare for saving)
		 * @param obj jQuery object representing an editable
		 * @return void
		 * @hide
		 */
		makeClean: function(obj) {
			var i, plugin;
			// iterate through all registered plugins
			for ( plugin in this.plugins ) {
				if ( this.plugins.hasOwnProperty( plugin ) ) {
					if (Aloha.Log.isDebugEnabled()) {
						Aloha.Log.debug(this, 'Passing contents of HTML Element with id { ' + obj.attr('id') +
										' } for cleaning to plugin { ' + plugin + ' }');
					}
					this.plugins[plugin].makeClean(obj);
				}
			}
		},

		/**
		 * Expose a nice name for the Plugin Manager
		 * @hide
		 */
		toString: function() {
			return 'pluginmanager';
		}
		
	}))();
});
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

define('aloha/core',[
	'aloha/jquery',
	'aloha/pluginmanager'
],

function ( jQuery, PluginManager ) {
	

	// Aloha Editor does not support Internet Explorer 6.  ExtJS style fixes for
	// IE6 which are applied through the "ext-ie6" class cause visual bugs in
	// IE9, and so we remove it so that IE6 fixes are not applied.
	Aloha.ready(function() {
		jQuery('.ext-ie6').removeClass('ext-ie6');
	});

	//----------------------------------------
	// Private variables
	//----------------------------------------
	
	/**
	 * Hash table that will be populated through the loadPlugins method.
	 * Maps the names of plugins with their urls for easy assess in the getPluginsUrl method
	 */
	var pluginPaths = {};

	/**
	 * Base Aloha Object
	 * @namespace Aloha
	 * @class Aloha The Aloha base object, which contains all the core functionality
	 * @singleton
	 */
	jQuery.extend(true, Aloha, {

		/**
		 * The Aloha Editor Version we are using
		 * It should be set by us and updated for the particular branch
		 * @property
		 */
		version: '0.10.0',

		/**
		 * Array of editables that are managed by Aloha
		 * @property
		 * @type Array
		 */
		editables: [],

		/**
		 * The currently active editable is referenced here
		 * @property
		 * @type Aloha.Editable
		 */
		activeEditable: null,

		/**
		 * settings object, which will contain all Aloha settings
		 * @cfg {Object} object Aloha's settings
		 */
		settings: {},
		
		/**
		 * defaults object, which will contain all Aloha defaults
		 * @cfg {Object} object Aloha's settings
		 */
		defaults: {},
		
		/**
		 * Namespace for ui components
		 */
		ui: {},
		
		/**
		 * This represents the name of the users OS. Could be:
		 * 'Mac', 'Linux', 'Win', 'Unix', 'Unknown'
		 * @property
		 * @type string
		 */
		OSName: 'Unknown',

		/**
		 * Which stage is the aloha init process at?
		 * @property
		 * @type string
		 */
		stage: 'loadingAloha',

		/**
		 * A list of loaded plugin names. Available after the
		 * "loadPlugins" stage.
		 *
		 * @property
		 * @type array
		 * @internal
		 */
		loadedPlugins: [],

		requirePaths: [],
		/**
		 * Initialize the initialization process
		 */
		init: function () {
				
			// merge defaults and settings and provide all in settings
			Aloha.settings = jQuery.extendObjects( true, {}, Aloha.defaults, Aloha.settings );

			// initialize rangy. This is probably necessary here,
			// because due to the current loading mechanism, rangy
			// doesn't initialize itself in all browsers
			if (window.rangy) {
				window.rangy.init();
			}
			
			// Load & Initialise
			Aloha.stage = 'loadPlugins';
			Aloha.loadPlugins(function(){
				Aloha.stage = 'initAloha';
				Aloha.initAloha(function(){
					Aloha.stage = 'initPlugins';
					Aloha.initPlugins(function(){
						Aloha.stage = 'initGui';
						Aloha.initGui(function(){
							Aloha.stage = 'alohaReady';
							Aloha.trigger('aloha-ready');
						});
					});
				});
			});
		},

		/**
		 * Load Plugins
		 */
		loadPlugins: function (next) {
			// contains an array like [common/format, common/block]
			var configuredPluginsWithBundle = this.getPluginsToBeLoaded();

			if (configuredPluginsWithBundle.length) {
				var paths = {},
				    pluginNames = [],
				    requiredInitializers = [],
				    pathsToPlugins = {};

				// Background: We do not use CommonJS packages for our Plugins
				// as this breaks the loading order when these modules have
				// other dependencies.
				// We "emulate" the commonjs modules with the path mapping.
				/* require(
				 *  { paths: {
				 *      'format': 'plugins/common/format/lib',
				 *      'format/nls': 'plugins/common/format/nls',
				 *      ... for every plugin ...
				 *    }
				 *  },
				 *  ['format/format-plugin', ... for every plugin ...],
				 *  next <-- when everything is loaded, we continue
				 */
				jQuery.each(configuredPluginsWithBundle, function (i, configuredPluginWithBundle) {
					var tmp, bundleName, pluginName, bundlePath = '';

					tmp = configuredPluginWithBundle.split('/');
					bundleName = tmp[0];
					pluginName = tmp[1];

					// TODO assertion if pluginName or bundleName NULL _-> ERROR!!

					if (Aloha.settings.basePath) {
						bundlePath = Aloha.settings.basePath;
					}

					if (Aloha.settings.bundles && Aloha.settings.bundles[bundleName]) {
						bundlePath += Aloha.settings.bundles[bundleName];
					} else {
						bundlePath += '../plugins/' + bundleName;
					}

					pluginNames.push(pluginName);
					paths[pluginName] = bundlePath + '/' + pluginName + '/lib';

					pathsToPlugins[pluginName] = bundlePath + '/' + pluginName;

					// As the "nls" path lies NOT inside /lib/, but is a sibling to /lib/, we need
					// to register it explicitely. The same goes for the "css" folder.
					jQuery.each(['nls', 'css', 'vendor', 'res'], function() {
						paths[pluginName + '/' + this] = bundlePath + '/' + pluginName + '/' + this;
					});

					requiredInitializers.push(pluginName + '/' + pluginName + '-plugin');
				});

				this.loadedPlugins = pluginNames;
				this.requirePaths = paths;
				
				// Main Require.js loading call, which fetches all the plugins.
				require(
					{
						context: 'aloha',
						paths: paths,
						locale: this.settings.locale || this.defaults.locale || 'en'
					},
					requiredInitializers,
					next
				);

				pluginPaths = pathsToPlugins;
			} else {
				next();
			}
		},

		/**
		 * Fetches plugins the user wants to have loaded. Returns all plugins the user
		 * has specified with the data-plugins property as array, with the bundle
		 * name in front.
		 * It's also possible to use 'Aloha.settings.plugins.load' to define the plugins
		 * to load.
		 *
		 * @return array
		 * @internal
		 */
		getPluginsToBeLoaded: function() {
			// look for data-aloha-plugins attributes and load values
			var
				plugins = jQuery('[data-aloha-plugins]').data('aloha-plugins');

			// load aloha plugins from config
			if ( typeof Aloha.settings.plugins != 'undefined' && typeof Aloha.settings.plugins.load != 'undefined' ) {
				plugins = Aloha.settings.plugins.load;
				if (plugins instanceof Array) {
					return plugins;
				}
			}

			// Determine Plugins
			if ( typeof plugins === 'string' && plugins !== "") {
				return plugins.replace(/\s+/g, '').split(',');
			}
			// Return
			return [];
		},

		/**
		 * Returns list of loaded plugins (without Bundle name)
		 *
		 * @return array
		 */
		getLoadedPlugins: function() {
			return this.loadedPlugins;
		},

		/**
		 * Returns true if a certain plugin is loaded, false otherwise.
		 */
		isPluginLoaded: function(pluginName) {
			var found = false;
			jQuery.each(this.loadedPlugins, function() {
				if (pluginName.toString() === this.toString()) {
					found = true;
				}
			});
			return found;
		},

		/**
		 * Initialise Aloha
		 */
		initAloha: function(next){
			// check browser version on init
			// this has to be revamped, as
			if (jQuery.browser.webkit && parseFloat(jQuery.browser.version) < 532.5 || // Chrome/Safari 4
				jQuery.browser.mozilla && parseFloat(jQuery.browser.version) < 1.9 || // FF 3.5
				jQuery.browser.msie && jQuery.browser.version < 7 || // IE 7
				jQuery.browser.opera && jQuery.browser.version < 11 ) { // right now, Opera needs some work
				if (window.console && window.console.log) {
					window.console.log( 'Your browser is not supported.' );
				}
			}

			// register the body click event to blur editables
			jQuery('html').mousedown(function(e) {
				// if an Ext JS modal is visible, we don't want to loose the focus on
				// the editable as we assume that the user must have clicked somewhere
				// in the modal... where else could he click?
				// loosing the editable focus in this case hinders correct table
				// column/row deletion, as the table module will clean it's selection
				// as soon as the editable is deactivated. Fusubscriberthermore you'd have to
				// refocus the editable again, which is just strange UX
				if (Aloha.activeEditable && !Aloha.isMessageVisible() && !Aloha.eventHandled) {
					Aloha.activeEditable.blur();
					Aloha.activeEditable = null;
				}
			}).mouseup(function(e) {
				Aloha.eventHandled = false;
			});
			
			// Initialise the base path to the aloha files
			Aloha.settings.base = Aloha.getAlohaUrl();

			// initialize the Log
			Aloha.Log.init();

			// initialize the error handler for general javascript errors
			if ( Aloha.settings.errorhandling ) {
				window.onerror = function (msg, url, linenumber) {
					Aloha.Log.error(Aloha, 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
					// TODO eventually add a message to the message line?
					return true;
				};
			}

			// OS detection
			if (navigator.appVersion.indexOf('Win') != -1) {
				Aloha.OSName = 'Win';
			}
			if (navigator.appVersion.indexOf('Mac') != -1) {
				Aloha.OSName = 'Mac';
			}
			if (navigator.appVersion.indexOf('X11') != -1) {
				Aloha.OSName = 'Unix';
			}
			if (navigator.appVersion.indexOf('Linux') != -1) {
				Aloha.OSName = 'Linux';
			}

			try {
				// this will disable browsers image resizing facilities
				// disable resize handles
				var supported;
				try {
					supported = document.queryCommandSupported( 'enableObjectResizing' );
				} catch ( e ) {
					supported = false;
					Aloha.Log.log( 'enableObjectResizing is not supported.' );
				}
				
				if ( supported ) {
					document.execCommand( 'enableObjectResizing', false, false);
					Aloha.Log.log( 'enableObjectResizing disabled.' );
				}
			} catch (e) {
				Aloha.Log.error( e, 'Could not disable enableObjectResizing' );
				// this is just for others, who will not support disabling enableObjectResizing
			}
			// Forward
			next();
		},

		/**
		 * Loads plugins Aloha
		 * @return void
		 */
		initPlugins: function (next) {
			PluginManager.init(function(){
				next();
			}, this.getLoadedPlugins() );
		},

		/**
		 * Loads GUI components
		 * @return void
		 */
		initGui: function (next) {
			
			Aloha.RepositoryManager.init();

			// activate registered editables
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if ( !Aloha.editables[i].ready ) {
					Aloha.editables[i].init();
				}
			}

			// Forward
			next();
		},

		/**
		 * Activates editable and deactivates all other Editables
		 * @param {Editable} editable the Editable to be activated
		 * @return void
		 */
		activateEditable: function (editable) {

			// blur all editables, which are currently active
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if (Aloha.editables[i] != editable && Aloha.editables[i].isActive) {
					Aloha.editables[i].blur();
				}
			}

			Aloha.activeEditable = editable;
		},

		/**
		 * Returns the current Editable
		 * @return {Editable} returns the active Editable
		 */
		getActiveEditable: function() {
			return Aloha.activeEditable;
		},

		/**
		 * deactivated the current Editable
		 * @return void
		 */
		deactivateEditable: function () {

			if ( typeof Aloha.activeEditable === 'undefined' || Aloha.activeEditable === null ) {
				return;
			}

			// blur the editable
			Aloha.activeEditable.blur();
			Aloha.activeEditable = null;
		},

		/**
		 * Gets an editable by an ID or null if no Editable with that ID registered.
		 * @param {string} id the element id to look for.
		 * @return {Aloha.Editable} editable
		 */
		getEditableById: function (id) {

			// if the element is a textarea than route to the editable div
			if (jQuery('#'+id).get(0).nodeName.toLowerCase() === 'textarea' ) {
				id = id + '-aloha';
			}

			// serach all editables for id
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if (Aloha.editables[i].getId() == id) {
					return Aloha.editables[i];
				}
			}

			return null;
		},

		/**
		 * Checks wheater an object is a registered Aloha Editable.
		 * @param {jQuery} obj the jQuery object to be checked.
		 * @return {boolean}
		 */
		isEditable: function (obj) {
			for (var i=0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if ( Aloha.editables[i].originalObj.get(0) === obj ) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Logs a message to the console
		 * @param level Level of the log ("error", "warn" or "info", "debug")
		 * @param component Component that calls the log
		 * @param message log message
		 * @return void
		 * @hide
		 */
		log: function(level, component, message) {
			if (typeof Aloha.Log !== "undefined")
				Aloha.Log.log(level, component, message);
		},
		
		/**
		 * Register the given editable
		 * @param editable editable to register
		 * @return void
		 * @hide
		 */
		registerEditable: function (editable) {
			Aloha.editables.push(editable);
		},

		/**
		 * Unregister the given editable. It will be deactivated and removed from editables.
		 * @param editable editable to unregister
		 * @return void
		 * @hide
		 */
		unregisterEditable: function (editable) {

			// Find the index
			var id = Aloha.editables.indexOf( editable );
			// Remove it if really found!
			if (id != -1) {
				Aloha.editables.splice(id, 1);
			}
		},

		/**
		 * String representation
		 * @hide
		 */
		toString: function () {
			return 'Aloha';
		},

		/**
		 * Check whether at least one editable was modified
		 * @method
		 * @return {boolean} true when at least one editable was modified, false if not
		 */
		isModified: function () {
			// check if something needs top be saved
			for (var i = 0; i < Aloha.editables.length; i++) {
				if (Aloha.editables[i].isModified && Aloha.editables[i].isModified()) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Determines the Aloha Url
		 * Uses Aloha.settings.baseUrl if set.
		 * @method
		 * @return {String} alohaUrl
		 */
		getAlohaUrl: function( suffix ) {
			// aloha base path is defined by a script tag with 2 data attributes
			var requireJs = jQuery('[data-aloha-plugins]'),
				baseUrl = ( requireJs.length ) ? requireJs[0].src.replace( /\/?aloha.js$/ , '' ) : '';
			
			if ( typeof Aloha.settings.baseUrl === "string" ) {
				baseUrl = Aloha.settings.baseUrl;
			}
			
			return baseUrl;
		},

		/**
		 * Gets the Plugin Url
		 * @method
		 * @param {String} name
		 * @return {String} url
		 */
		getPluginUrl: function (name) {
			var url;

			if (name) {
				url = pluginPaths[name];
				if(url) {
					//Check if url is absolute and attach base url if it is not
					if(!url.match("^(\/|http[s]?:).*")) {
						url = Aloha.getAlohaUrl() + '/' + url;
					}
				}
			}

			return url;
		}

	});

	return Aloha;
});
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

define('aloha/console',['aloha/core', 'util/class', 'aloha/jquery'],
function(Aloha, Class, jQuery ) {
	
	
	var
//		$ = jQuery,
//		Aloha = window.Aloha,
		console = window.console;
//		Class = window.Class
//		GENTICS = window.GENTICS;

/**
 * This is the aloha Log
 * @namespace Aloha
 * @class Log
 * @singleton
 */
var alohaConsole = Class.extend({
	/**
	 * Initialize the logging
	 * @hide
	 */
	init: function() {
		
		// initialize the logging settings (if not present)
		if (typeof Aloha.settings.logLevels === 'undefined' || !Aloha.settings.logLevels) {
			Aloha.settings.logLevels = {'error' : true, 'warn' : true};
		}

		// initialize the logHistory settings (if not present)
		if (typeof Aloha.settings.logHistory === 'undefined' || !Aloha.settings.logHistory) {
			Aloha.settings.logHistory = {};
		}
		// set the default values for the loghistory
		if (!Aloha.settings.logHistory.maxEntries) {
			Aloha.settings.logHistory.maxEntries = 100;
		}
		if (!Aloha.settings.logHistory.highWaterMark) {
			Aloha.settings.logHistory.highWaterMark = 90;
		}
		if (!Aloha.settings.logHistory.levels) {
			Aloha.settings.logHistory.levels = {'error' : true, 'warn' : true};
		}
		this.flushLogHistory();
		
		Aloha.trigger('aloha-logger-ready');
	},

	/**
	 * Log History as array of Message Objects. Every object has the properties
	 * 'level', 'component' and 'message'
	 * @property
	 * @type Array
	 * @hide
	 */
	logHistory: [],

	/**
	 * Flag, which is set as soon as the highWaterMark for the log history is reached.
	 * This flag is reset on every call of flushLogHistory()
	 * @hide
	 */
	highWaterMarkReached: false,

	/**
	 * Logs a message to the console
	 * @method
	 * @param {String} level Level of the log ('error', 'warn' or 'info', 'debug')
	 * @param {String} component Component that calls the log
	 * @param {String} message log message
	 */
	log: function(level, component, message) {
		

		// log ('Logging message');
		if ( typeof component === 'undefined' ) {
			message = level;
		}
		if ( typeof component !== 'string' && component && component.toString ) {
			component = component.toString();
		}
		
		// log ('warn', 'Warning message');
		if ( typeof message === 'undefined' ) {
			message = component;
			component = undefined;
		}

		if (typeof level === 'undefined' || !level) {
			level = 'log';
		}
		
		level = level.toLowerCase();
		
		if ( typeof Aloha.settings.logLevels === "undefined" ) {
			return;
		}
		
		// now check whether the log level is activated
		if ( !Aloha.settings.logLevels[ level ] ) {
			return;
		}
		
		component = component || "Unkown Aloha Component";

		this.addToLogHistory({'level' : level, 'component' : component, 'message' : message, 'date' : new Date()});
		
		switch (level) {
		case 'error':
			if (window.console && console.error) {
				// FIXME:
				// Using console.error rather than throwing an error is very
				// problematic because we get not stack.
				// We ought to consider doing the following:
				// throw component + ': ' + message;
				if(!component && !message) {
					console.error("Error occured without message and component");
				} else {
					console.error(component + ': ' + message);
				}
			}
			break;
		case 'warn':
			if (window.console && console.warn) {
				console.warn(component + ': ' + message);
			}
			break;
		case 'info':
			if (window.console && console.info) {
				console.info(component + ': ' + message);
			}
			break;
		case 'debug':
			if (window.console && console.log) {
				console.log(component + ' [' + level + ']: ' + message);
			}
			break;
		default:
			if (window.console && console.log) {
				console.log(component + ' [' + level + ']: ' + message);
			}
			break;
		}
	},

	/**
	 * Log a message of log level 'error'
	 * @method
	 * @param {String} component Component that calls the log
	 * @param {String} message log message
	 */
	error: function(component, message) {
		this.log('error', component, message);
	},

	/**
	 * Log a message of log level 'warn'
	 * @method
	 * @param {String} component Component that calls the log
	 * @param {String} message log message
	 */
	warn: function(component, message) {
		this.log('warn', component, message);
	},

	/**
	 * Log a message of log level 'info'
	 * @method
	 * @param {String} component Component that calls the log
	 * @param {String} message log message
	 */
	info: function(component, message) {
		this.log('info', component, message);
	},

	/**
	 * Log a message of log level 'debug'
	 * @param {String} component Component that calls the log
	 * @param {String} message log message
	 */
	debug: function(component, message) {
		this.log('debug', component, message);
	},

	/**
	 * Methods to mark function as deprecated for developers.
	 * @param {String} component String that calls the log
	 * @param {String} message log message
	 */
	deprecated: function(component, message) {
		this.log( 'warn', component, message );
		// help the developer to locate the call.
		 if ( Aloha.settings.logLevels[ 'deprecated' ] ) {
			 throw new Error ( message );
		 }
	},
	
	/**
	 * Check whether the given log level is currently enabled
	 * @param {String} level
	 * @return true when log level is enabled, false if not
	 */
	isLogLevelEnabled: function(level) {
		return Aloha.settings && Aloha.settings.logLevels && Aloha.settings.logLevels[level];
	},

	/**
	 * Check whether error logging is enabled
	 * @return true if error logging is enabled, false if not
	 */
	isErrorEnabled: function() {
		return this.isLogLevelEnabled('error');
	},

	/**
	 * Check whether warn logging is enabled
	 * @return true if warn logging is enabled, false if not
	 */
	isWarnEnabled: function() {
		return this.isLogLevelEnabled('warn');
	},

	/**
	 * Check whether info logging is enabled
	 * @return true if info logging is enabled, false if not
	 */
	isInfoEnabled: function() {
		return this.isLogLevelEnabled('info');
	},

	/**
	 * Check whether debug logging is enabled
	 * @return true if debug logging is enabled, false if not
	 */
	isDebugEnabled: function() {
		return this.isLogLevelEnabled('debug');
	},

	/**
	 * Add the given entry to the log history. Check whether the highWaterMark has been reached, and fire an event if yes.
	 * @param {Object} entry entry to be added to the log history
	 * @hide
	 */
	addToLogHistory: function(entry) {
		
		if ( !Aloha.settings.logHistory ) {
			this.init();
		}

		// when maxEntries is set to something illegal, we do nothing (log history is disabled)
		// check whether the level is one we like to have logged
		if ( Aloha.settings.logHistory.maxEntries <= 0
				|| !Aloha.settings.logHistory.levels[ entry.level ]
			) {
			
			return;
		}

		// first add the entry as last element to the history array
		this.logHistory.push( entry );

		// check whether the highWaterMark was reached, if so, fire an event
		if ( !this.highWaterMarkReached ) {
			
			if ( this.logHistory.length >= Aloha.settings.logHistory.maxEntries * Aloha.settings.logHistory.highWaterMark / 100 ) {
				
				// fire the event
				Aloha.trigger('aloha-log-full');
				// set the flag (so we will not fire the event again until the logHistory is flushed)
				this.highWaterMarkReached = true;
			}
		}

		// check whether the log is full and eventually remove the oldest entries
		while ( this.logHistory.length > Aloha.settings.logHistory.maxEntries ) {
			this.logHistory.shift();
		}
	},

	/**
	 * Get the log history
	 * @return log history as array of objects
	 * @hide
	 */
	getLogHistory: function() {
		return this.logHistory;
	},

	/**
	 * Flush the log history. Remove all log entries and reset the flag for the highWaterMark
	 * @return void
	 * @hide
	 */
	flushLogHistory: function() {
		this.logHistory = [];
		this.highWaterMarkReached = false;
	}
});

/**
 * Create the Log object
 * @hide
 */
alohaConsole = new alohaConsole();

// add to log namespace for compatiblility.
return Aloha.Log = Aloha.Console = alohaConsole;

});

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
// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};

define('util/range',['aloha/jquery', 'util/dom', 'util/class', 'aloha/console', 'aloha/rangy-core'],
function(jQuery, Dom, Class, console) {
	

	var
		GENTICS = window.GENTICS,
		rangy = window.rangy;

/**
 * @namespace GENTICS.Utils
 * @class RangeObject
 * Represents a selection range in the browser that
 * has some advanced features like selecting the range.
 * @param {object} param if boolean true is passed, the range will be deducted from the current browser selection.
 * If another rangeObject is passed, it will be cloned.
 * If nothing is passed, the rangeObject will be empty.
 * @constructor
 */
GENTICS.Utils.RangeObject = Class.extend({
	_constructor: function(param){
		// Take the values from the passed object
		if (typeof param === 'object') {
			if (typeof param.startContainer !== 'undefined') {
				this.startContainer = param.startContainer;
			}
			if (typeof param.startOffset !== 'undefined') {
				this.startOffset = param.startOffset;
			}
			if (typeof param.endContainer !== 'undefined') {
				this.endContainer = param.endContainer;
			}
			if (typeof param.endOffset !== 'undefined') {
				this.endOffset = param.endOffset;
			}
		} else if (param === true) {
			this.initializeFromUserSelection();
		}
	},

	/**
	 * DOM object of the start container of the selection.
	 * This is always has to be a DOM text node.
	 * @property startContainer
	 * @type {DOMObject}
	 */
	startContainer: undefined,

	/**
	 * Offset of the selection in the start container
	 * @property startOffset
	 * @type {Integer}
	 */
	startOffset: undefined,

	/**
	 * DOM object of the end container of the selection.
	 * This is always has to be a DOM text node.
	 * @property endContainer
	 * @type {DOMObject}
	 */
	endContainer: undefined,

	/**
	 * Offset of the selection in the end container
	 * @property endOffset
	 * @type {Integer}
	 */
	endOffset: undefined,

	/**
	 * Delete all contents selected by the current range
	 * @param rangeTree a GENTICS.Utils.RangeTree object may be provided to start from. This parameter is optional
	 */
	deleteContents: function () {

		Dom.removeRange(this);

	},

	/**
	 * Output some log
	 * TODO: move this to Aloha.Log
	 * @param message log message to output
	 * @return void
	 * @deprecated
	 * @hide
	 */
	log: function(message) {
		console.deprecated( 'Utils.RangeObject', 'log() is deprecated. use ' +
				'console.log() from module "aloha/console" instead: ' + message);
	},

	/**
	 * Method to test if a range object is collapsed.
	 * A range is considered collapsed if either no endContainer exists or the endContainer/Offset equal startContainer/Offset
	 * @return {boolean} true if collapsed, false otherwise
	 * @method
	 */
	isCollapsed: function() {
		return (
			!this.endContainer || 
			(this.startContainer === this.endContainer && this.startOffset === this.endOffset)
		);
	},

	/**
	 * Method to (re-)calculate the common ancestor container and to get it.
	 * The common ancestor container is the DOM Object which encloses the
	 * whole range and is nearest to the start and end container objects.
	 * @return {DOMObject} get the common ancestor container
	 * @method
	 */
	getCommonAncestorContainer: function() {
		if (this.commonAncestorContainer) {
			// sometimes it's cached (or was set)
			return this.commonAncestorContainer;
		}
		// if it's not cached, calculate and then cache it
		this.updateCommonAncestorContainer();

		// now return it anyway
		return this.commonAncestorContainer;
	},

	/**
	 * Get the parent elements of the startContainer/endContainer up to the given limit. When the startContainer/endContainer
	 * is no text element, but a node, the node itself is returned as first element.
	 * @param {jQuery} limit limit object (default: body)
	 * @param {boolean} fromStart true to fetch the parents from the startContainer, false for the endContainer
	 * @return {jQuery} parent elements of the startContainer/endContainer as jQuery objects
	 * @method
	 */
	getContainerParents: function (limit, fromEnd) {
		// TODO cache the calculated parents
		var
			container = fromEnd ? this.endContainer : this.startContainer,
			parents, limitIndex,
			i;

		if (!container) {
			return false;
		}

		if ( typeof limit === 'undefined' || ! limit ) {
			limit = jQuery('body');
		}

		
		if (container.nodeType == 3) {
			parents = jQuery(container).parents();
		} else {
			parents = jQuery(container).parents();
			for (i = parents.length; i > 0; --i) {
				parents[i] = parents[i - 1];
			}
			parents[0] = container;
		}

		// now slice this array
		limitIndex = parents.index(limit);

		if (limitIndex >= 0) {
			parents = parents.slice(0, limitIndex);
		}

		return parents;
	},

	/**
	 * Get the parent elements of the startContainer up to the given limit. When the startContainer
	 * is no text element, but a node, the node itself is returned as first element.
	 * @param {jQuery} limit limit object (default: body)
	 * @return {jQuery} parent elements of the startContainer as jQuery objects
	 * @method
	 */
	getStartContainerParents: function(limit) {
		return this.getContainerParents(limit, false);
	},

	/**
	 * Get the parent elements of the endContainer up to the given limit. When the endContainer is
	 * no text element, but a node, the node itself is returned as first element.
	 * @param {jQuery} limit limit object (default: body)
	 * @return {jQuery} parent elements of the endContainer as jQuery objects
	 * @method
	 */
	getEndContainerParents: function(limit) {
		return this.getContainerParents(limit, true);
	},

	/**
	 * TODO: the commonAncestorContainer is not calculated correctly, if either the start or
	 * the endContainer would be the cac itself (e.g. when the startContainer is a textNode
	 * and the endContainer is the startContainer's parent <p>). in this case the cac will be set
	 * to the parent div
	 * Method to update a range object internally
	 * @param commonAncestorContainer (DOM Object); optional Parameter; if set, the parameter
	 * will be used instead of the automatically calculated CAC
	 * @return void
	 * @hide
	 */
	updateCommonAncestorContainer: function(commonAncestorContainer) {
		// if no parameter was passed, calculate it
		if (!commonAncestorContainer) {
			// this will be needed either right now for finding the CAC or later for the crossing index
			var parentsStartContainer = this.getStartContainerParents(),
				parentsEndContainer = this.getEndContainerParents(),
				i;

			// find the crossing between startContainer and endContainer parents (=commonAncestorContainer)
			if (!(parentsStartContainer.length > 0 && parentsEndContainer.length > 0)) {
				console.warn('could not find commonAncestorContainer');
				return false;
			}

			for (i = 0; i < parentsStartContainer.length; i++) {
				if (parentsEndContainer.index( parentsStartContainer[ i ] ) != -1) {
					this.commonAncestorContainer = parentsStartContainer[ i ];
					break;
				}
			}
		} else {
			this.commonAncestorContainer = commonAncestorContainer;
		}

		// if everything went well, return true :-)
		console.debug(commonAncestorContainer? 'commonAncestorContainer was set successfully' : 'commonAncestorContainer was calculated successfully');
		return true;
	},

	/**
	 * Helper function for selection in IE. Creates a collapsed text range at the given position
	 * @param container container
	 * @param offset offset
	 * @return collapsed text range at that position
	 * @hide
	 */
	getCollapsedIERange: function(container, offset) {
		// create a text range
		var
			ieRange = document.body.createTextRange(),
			tmpRange, right, parent, left;

		// search to the left for the next element
		left = this.searchElementToLeft(container, offset);
		if (left.element) {
			// found an element, set the start to the end of that element
			tmpRange = document.body.createTextRange();
			tmpRange.moveToElementText(left.element);
			ieRange.setEndPoint('StartToEnd', tmpRange);

			// and correct the start
			if (left.characters !== 0) {
				ieRange.moveStart('character', left.characters);
			} else {
				// this is a hack, when we are at the start of a text node, move the range anyway
				ieRange.moveStart('character', 1);
				ieRange.moveStart('character', -1);
			}
		} else {
			// found nothing to the left, so search right
			right = this.searchElementToRight(container, offset);
			if (false && right.element) {
				// found an element, set the start to the start of that element
				tmpRange = document.body.createTextRange();
				tmpRange.moveToElementText(right.element);
				ieRange.setEndPoint('StartToStart', tmpRange);

				// and correct the start
				if (right.characters !== 0) {
					ieRange.moveStart('character', -right.characters);
				} else {
					ieRange.moveStart('character', -1);
					ieRange.moveStart('character', 1);
				}
			} else {
				// also found no element to the right, use the container itself
				parent = container.nodeType == 3 ? container.parentNode : container;
				tmpRange = document.body.createTextRange();
				tmpRange.moveToElementText(parent);
				ieRange.setEndPoint('StartToStart', tmpRange);

				// and correct the start
				if (left.characters !== 0) {
					ieRange.moveStart('character', left.characters);
				}
			}
		}
		ieRange.collapse();

		return ieRange;
	},

	/**
	 * Sets the visible selection in the Browser based on the range object.
	 * If the selection is collapsed, this will result in a blinking cursor,
	 * otherwise in a text selection.
	 * @method
	 */
	select: function() {
		var ieRange, endRange, startRange, range, sel;

		// create a range
		range = rangy.createRange();

		// set start and endContainer
		range.setStart(this.startContainer,this.startOffset);
		range.setEnd(this.endContainer, this.endOffset);

		// update the selection
		sel = rangy.getSelection();
		sel.setSingleRange(range);
	},

	/**
	 * Starting at the given position, search for the next element to the left and count the number of characters are in between
	 * @param container container of the startpoint
	 * @param offset offset of the startpoint in the container
	 * @return object with 'element' (null if no element found) and 'characters'
	 * @hide
	 */
	searchElementToLeft: function (container, offset) {
		var
			checkElement,
			characters = 0;

		if (container.nodeType === 3) {
			// start is in a text node
			characters = offset;
			// begin check at the element to the left (if any)
			checkElement = container.previousSibling;
		} else {
			// start is between nodes, begin check at the element to the left (if any)
			if (offset > 0) {
				checkElement = container.childNodes[offset - 1];
			}
		}

		// move to the right until we find an element
		while (checkElement && checkElement.nodeType === 3) {
			characters += checkElement.data.length;
			checkElement = checkElement.previousSibling;
		}

		return {'element' : checkElement, 'characters' : characters};
	},

	/**
	 * Starting at the given position, search for the next element to the right and count the number of characters that are in between
	 * @param container container of the startpoint
	 * @param offset offset of the startpoint in the container
	 * @return object with 'element' (null if no element found) and 'characters'
	 * @hide
	 */
	searchElementToRight: function (container, offset) {
		var
			checkElement,
			characters = 0;

		if (container.nodeType === 3) {
			// start is in a text node
			characters = container.data.length - offset;

			// begin check at the element to the right (if any)
			checkElement = container.nextSibling;
		} else {
			// start is between nodes, begin check at the element to the right (if any)
			if (offset < container.childNodes.length) {
				checkElement = container.childNodes[offset];
			}
		}

		// move to the right until we find an element
		while (checkElement && checkElement.nodeType === 3) {
			characters += checkElement.data.length;
			checkElement = checkElement.nextSibling;
		}

		return {'element' : checkElement, 'characters' : characters};
	},

	/**
	 * Method which updates the rangeObject including all extending properties like commonAncestorContainer etc...
	 * TODO: is this method needed here? or should it contain the same code as Aloha.Selection.prototype.SelectionRange.prototype.update?
	 * @return void
	 * @hide
	 */
	update: function(event) {
		console.debug('now updating rangeObject');
		
		this.initializeFromUserSelection(event);
		this.updateCommonAncestorContainer();
	},

	/**
	 * Initialize the current range object from the user selection of the browser.
	 * @param event which calls the method
	 * @return void
	 * @hide
	 */
	initializeFromUserSelection: function(event) {
		var
			selection = rangy.getSelection(),
			browserRange;

		if (!selection) {
			return false;
		}

		// check if a ragne exists
		if ( !selection.rangeCount ) {
			return false;
		}

		// getBrowserRange
		browserRange = selection.getRangeAt(0);
		if (!browserRange) {
			return false;
		}

		// initially set the range to what the browser tells us
		this.startContainer = browserRange.startContainer;
		this.endContainer = browserRange.endContainer;
		this.startOffset = browserRange.startOffset;
		this.endOffset = browserRange.endOffset;

		// now try to correct the range
		this.correctRange();
		return;
	},

	/**
	 * Correct the current range. The general goal of the algorithm is to have start
	 * and end of the range in text nodes if possible and the end of the range never
	 * at the beginning of an element or text node. Details of the algorithm can be
	 * found in the code comments
	 * @method
	 */
	correctRange: function() {
		var
			adjacentTextNode,
			textNode,
			checkedElement,
			parentNode,
			offset;

		this.clearCaches();
		if (this.isCollapsed()) {
			// collapsed ranges are treated specially

			// first check if the range is not in a text node
			if (this.startContainer.nodeType === 1) {
				if (this.startOffset > 0 && this.startContainer.childNodes[this.startOffset - 1].nodeType === 3) {
					// when the range is between nodes (container is an element
					// node) and there is a text node to the left -> move into this text
					// node (at the end)
					this.startContainer = this.startContainer.childNodes[this.startOffset - 1];
					this.startOffset = this.startContainer.data.length;
					this.endContainer = this.startContainer;
					this.endOffset = this.startOffset;
					return;
				}

				if (this.startOffset > 0 && this.startContainer.childNodes[this.startOffset - 1].nodeType === 1) {
					// search for the next text node to the left
					adjacentTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(this.startContainer, this.startOffset, true);
					if (adjacentTextNode) {
						this.startContainer = this.endContainer = adjacentTextNode;
						this.startOffset = this.endOffset = adjacentTextNode.data.length;
						return;
					}
					// search for the next text node to the right
					adjacentTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(this.startContainer, this.startOffset, false);
					if (adjacentTextNode) {
						this.startContainer = this.endContainer = adjacentTextNode;
						this.startOffset = this.endOffset = 0;
						return;
					}
				}

				if (this.startOffset < this.startContainer.childNodes.length && this.startContainer.childNodes[this.startOffset].nodeType === 3) {
					// when the range is between nodes and there is a text node
					// to the right -> move into this text node (at the start)
					this.startContainer = this.startContainer.childNodes[this.startOffset];
					this.startOffset = 0;
					this.endContainer = this.startContainer;
					this.endOffset = 0;
					return;
				}
			}

			// when the selection is in a text node at the start, look for an adjacent text node and if one found, move into that at the end
			if (this.startContainer.nodeType === 3 && this.startOffset === 0) {
				adjacentTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(this.startContainer.parentNode, GENTICS.Utils.Dom.getIndexInParent(this.startContainer), true);
				if (adjacentTextNode) {
					this.startContainer = this.endContainer = adjacentTextNode;
					this.startOffset = this.endOffset = adjacentTextNode.data.length;
				}
			}
		} else {
			// expanded range found

			// correct the start, but only if between nodes
			if (this.startContainer.nodeType === 1) {
				// if there is a text node to the right, move into this
				if (this.startOffset < this.startContainer.childNodes.length && this.startContainer.childNodes[this.startOffset].nodeType === 3) {
					this.startContainer = this.startContainer.childNodes[this.startOffset];
					this.startOffset = 0;
				} else if (this.startOffset < this.startContainer.childNodes.length && this.startContainer.childNodes[this.startOffset].nodeType === 1) {
					// there is an element node to the right, so recursively check all first child nodes until we find a text node
					textNode = false;
					checkedElement = this.startContainer.childNodes[this.startOffset];
					while (textNode === false && checkedElement.childNodes && checkedElement.childNodes.length > 0) {
						// go to the first child of the checked element
						checkedElement = checkedElement.childNodes[0];
						// when this element is a text node, we are done
						if (checkedElement.nodeType === 3) {
							textNode = checkedElement;
						}
					}

					// found a text node, so move into it
					if (textNode !== false) {
						this.startContainer = textNode;
						this.startOffset = 0;
					}
				}
			}

			// check whether the start is inside a text node at the end
			if (this.startContainer.nodeType === 3 && this.startOffset === this.startContainer.data.length) {
				// check whether there is an adjacent text node to the right and if
				// yes, move into it
				adjacentTextNode = GENTICS.Utils.Dom
						.searchAdjacentTextNode(this.startContainer.parentNode, GENTICS.Utils.Dom
						.getIndexInParent(this.startContainer) + 1, false);
				if (adjacentTextNode) {
					this.startContainer = adjacentTextNode;
					this.startOffset = 0;
				}
			}

			// now correct the end
			if (this.endContainer.nodeType === 3 && this.endOffset === 0) {
				// we are in a text node at the start
				if (this.endContainer.previousSibling && this.endContainer.previousSibling.nodeType === 3) {
					// found a text node to the left -> move into it (at the end)
					this.endContainer = this.endContainer.previousSibling;
					this.endOffset = this.endContainer.data.length;
				} else if (this.endContainer.previousSibling && this.endContainer.previousSibling.nodeType === 1 && this.endContainer.parentNode) {
					// found an element node to the left -> move in between
					parentNode = this.endContainer.parentNode;
					for (offset = 0; offset < parentNode.childNodes.length; ++offset) {
						if (parentNode.childNodes[offset] == this.endContainer) {
							this.endOffset = offset;
							break;
						}
					}
					this.endContainer = parentNode;
				}
			}

			if (this.endContainer.nodeType == 1 && this.endOffset === 0) {
				// we are in an element node at the start, possibly move to the previous sibling at the end
				if (this.endContainer.previousSibling) {
					if (this.endContainer.previousSibling.nodeType === 3) {
						// previous sibling is a text node, move end into here (at the end)
						this.endContainer = this.endContainer.previousSibling;
						this.endOffset = this.endContainer.data.length;
					} else if (
							this.endContainer.previousSibling.nodeType === 1
							&& this.endContainer.previousSibling.childNodes
							&& this.endContainer.previousSibling.childNodes.length > 0) {
						// previous sibling is another element node with children,
						// move end into here (at the end)
						this.endContainer = this.endContainer.previousSibling;
						this.endOffset = this.endContainer.childNodes.length;
					}
				}
			}

			// correct the end, but only if between nodes
			if (this.endContainer.nodeType == 1) {
				// if there is a text node to the left, move into this
				if (this.endOffset > 0 && this.endContainer.childNodes[this.endOffset - 1].nodeType === 3) {
					this.endContainer = this.endContainer.childNodes[this.endOffset - 1];
					this.endOffset = this.endContainer.data.length;
				} else if (this.endOffset > 0 && this.endContainer.childNodes[this.endOffset - 1].nodeType === 1) {
					// there is an element node to the left, so recursively check all last child nodes until we find a text node
					textNode = false;
					checkedElement = this.endContainer.childNodes[this.endOffset - 1];
					while (textNode === false && checkedElement.childNodes && checkedElement.childNodes.length > 0) {
						// go to the last child of the checked element
						checkedElement = checkedElement.childNodes[checkedElement.childNodes.length - 1];
						// when this element is a text node, we are done
						if (checkedElement.nodeType === 3) {
							textNode = checkedElement;
						}
					}

					// found a text node, so move into it
					if (textNode !== false) {
						this.endContainer = textNode;
						this.endOffset = this.endContainer.data.length;
					}
				}
			}
		}
	},

	/**
	 * Clear the caches for this range. This method must be called when the range itself (start-/endContainer or start-/endOffset) is modified.
	 * @method
	 */
	clearCaches: function () {
		this.commonAncestorContainer = undefined;
	},

	/**
	 * Get the range tree of this range.
	 * The range tree will be cached for every root object. When the range itself is modified, the cache should be cleared by calling GENTICS.Utils.RangeObject.clearCaches
	 * @param {DOMObject} root root object of the range tree, if non given, the common ancestor container of the start and end containers will be used
	 * @return {RangeTree} array of RangeTree object for the given root object
	 * @method
	 */
	getRangeTree: function (root) {
		// TODO cache rangeTrees
		if (typeof root === 'undefined') {
			root = this.getCommonAncestorContainer();
		}

		this.inselection = false;
		return this.recursiveGetRangeTree(root);
	},

	/**
	 * Recursive inner function for generating the range tree.
	 * @param currentObject current DOM object for which the range tree shall be generated
	 * @return array of Tree objects for the children of the current DOM object
	 * @hide
	 */
	recursiveGetRangeTree: function (currentObject) {
		// get all direct children of the given object
		var jQueryCurrentObject = jQuery(currentObject),
			childCount = 0,
			that = this,
			currentElements = [];

		jQueryCurrentObject.contents().each(function(index) {
			var type = 'none',
				startOffset = false,
				endOffset = false,
				collapsedFound = false,
				noneFound = false,
				partialFound = false,
				fullFound = false,
				i;

			// check for collapsed selections between nodes
			if (that.isCollapsed() && currentObject === that.startContainer && that.startOffset === index) {
				// insert an extra rangetree object for the collapsed range here
				currentElements[childCount] = new GENTICS.Utils.RangeTree();
				currentElements[childCount].type = 'collapsed';
				currentElements[childCount].domobj = undefined;
				that.inselection = false;
				collapsedFound = true;
				childCount++;
			}

			if (!that.inselection && !collapsedFound) {
				// the start of the selection was not yet found, so look for it now
				// check whether the start of the selection is found here

				// check is dependent on the node type
				switch(this.nodeType) {
				case 3: // text node
					if (this === that.startContainer) {
						// the selection starts here
						that.inselection = true;

						// when the startoffset is > 0, the selection type is only partial
						type = that.startOffset > 0 ? 'partial' : 'full';
						startOffset = that.startOffset;
						endOffset = this.length;
					}
					break;
				case 1: // element node
					if (this === that.startContainer && that.startOffset === 0) {
						// the selection starts here
						that.inselection = true;
						type = 'full';
					}
					if (currentObject === that.startContainer && that.startOffset === index) {
						// the selection starts here
						that.inselection = true;
						type = 'full';
					}
					break;
				}
			}

			if (that.inselection && !collapsedFound) {
				if (type == 'none') {
					type = 'full';
				}
				// we already found the start of the selection, so look for the end of the selection now
				// check whether the end of the selection is found here

				switch(this.nodeType) {
				case 3: // text node
					if (this === that.endContainer) {
						// the selection ends here
						that.inselection = false;

						// check for partial selection here
						if (that.endOffset < this.length) {
							type = 'partial';
						}
						if (startOffset === false) {
							startOffset = 0;
						}
						endOffset = that.endOffset;
					}
					break;
				case 1: // element node
					if (this === that.endContainer && that.endOffset === 0) {
						that.inselection = false;
					}
					break;
				}
				if (currentObject === that.endContainer && that.endOffset <= index) {
					that.inselection = false;
					type = 'none';
				}
			}

			// create the current selection tree entry
			currentElements[childCount] = new GENTICS.Utils.RangeTree();
			currentElements[childCount].domobj = this;
			currentElements[childCount].type = type;
			if (type == 'partial') {
				currentElements[childCount].startOffset = startOffset;
				currentElements[childCount].endOffset = endOffset;
			}

			// now do the recursion step into the current object
			currentElements[childCount].children = that.recursiveGetRangeTree(this);

			// check whether a selection was found within the children
			if (currentElements[childCount].children.length > 0) {
				for ( i = 0; i < currentElements[childCount].children.length; ++i) {
					switch(currentElements[childCount].children[i].type) {
					case 'none':
						noneFound = true;
						break;
					case 'full':
						fullFound = true;
						break;
					case 'partial':
						partialFound = true;
						break;
					}
				}

				if (partialFound || (fullFound && noneFound)) {
					// found at least one 'partial' DOM object in the children, or both 'full' and 'none', so this element is also 'partial' contained
					currentElements[childCount].type = 'partial';
				} else if (fullFound && !partialFound && !noneFound) {
					// only found 'full' contained children, so this element is also 'full' contained
					currentElements[childCount].type = 'full';
				}
			}

			childCount++;
		});

		// extra check for collapsed selections at the end of the current element
		if (this.isCollapsed()
				&& currentObject === this.startContainer
				&& this.startOffset == currentObject.childNodes.length) {
			currentElements[childCount] = new GENTICS.Utils.RangeTree();
			currentElements[childCount].type = 'collapsed';
			currentElements[childCount].domobj = undefined;
		}

		return currentElements;
	},

	/**
	 * Find certain the first occurrence of some markup within the parents of either the start or the end of this range.
	 * The markup can be identified by means of a given comparator function. The function will be passed every parent (up to the eventually given limit object, which itself is not considered) to the comparator function as this.
	 * When the comparator function returns boolean true, the markup found and finally returned from this function as dom object.<br/>
	 * Example for finding an anchor tag at the start of the range up to the active editable object:<br/>
	 * <pre>
	 * range.findMarkup(
	 *   function() {
	 *     return this.nodeName.toLowerCase() == 'a';
	 *   },
	 *   jQuery(Aloha.activeEditable.obj)
	 * );
	 * </pre>
	 * @param {function} comparator comparator function to find certain markup
	 * @param {jQuery} limit limit objects for limit the parents taken into consideration
	 * @param {boolean} atEnd true for searching at the end of the range, false for the start (default: false)
	 * @return {DOMObject} the found dom object or false if nothing found.
	 * @method
	 */
	findMarkup: function (comparator, limit, atEnd) {
		var parents = this.getContainerParents(limit, atEnd),
			returnValue = false;
		jQuery.each(parents, function (index, domObj) {
			if (comparator.apply(domObj)) {
				returnValue = domObj;
				return false;
			}
		});

		return returnValue;
	},

	/**
	 * Get the text enclosed by this range
	 * @return {String} the text of the range
	 * @method
	 */
	getText: function() {
		if (this.isCollapsed()) {
			return '';
		} else {
			return this.recursiveGetText(this.getRangeTree());
		}
	},

	recursiveGetText: function (tree) {
		if (!tree) {
			return '';
		} else {
			var that = this,
				text = '';
			jQuery.each(tree, function() {
				if (this.type == 'full') {
					// fully selected element/text node
					text += jQuery(this.domobj).text();
				} else if (this.type == 'partial' && this.domobj.nodeType === 3) {
					// partially selected text node
					text += jQuery(this.domobj).text().substring(this.startOffset, this.endOffset);
				} else if (this.type == 'partial' && this.domobj.nodeType === 1 && this.children) {
					// partially selected element node
					text += that.recursiveGetText(this.children);
				}
			});
			return text;
		}
	}
});

/**
 * @namespace GENTICS.Utils
 * @class RangeTree
 * Class definition of a RangeTree, which gives a tree view of the DOM objects included in this range
 * Structure:
 * <pre>
 * +
 * |-domobj: <reference to the DOM Object> (NOT jQuery)
 * |-type: defines if this node is marked by user [none|partial|full|collapsed]
 * |-children: recursive structure like this
 * </pre>
 */
GENTICS.Utils.RangeTree = Class.extend({
	/**
	 * DOMObject, if the type is one of [none|partial|full], undefined if the type is [collapsed]
	 * @property domobj
	 * @type {DOMObject}
	 */
	domobj: {},

	/**
	 * type of the participation of the dom object in the range. Is one of:
	 * <pre>
	 * - none the DOMObject is outside of the range
	 * - partial the DOMObject partially in the range
	 * - full the DOMObject is completely in the range
	 * - collapsed the current RangeTree element marks the position of a collapsed range between DOM nodes
	 * </pre>
	 * @property type
	 * @type {String}
	 */
	type: null,

	/**
	 * Array of RangeTree objects which reflect the status of the child elements of the current DOMObject
	 * @property children
	 * @type {Array}
	 */
	children: []
});
	
	return GENTICS.Utils.RangeObject;
});

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
define('aloha/floatingmenu',['aloha/core', 'aloha/jquery', 'aloha/ext', 'util/class', 'aloha/console', 'vendor/jquery.store'],
function(Aloha, jQuery, Ext, Class, console) {
	
	var GENTICS = window.GENTICS;

	/**
	 * Constructor for a floatingmenu tab
	 * @namespace Aloha.FloatingMenu
	 * @class Tab
	 * @constructor
	 * @param {String} label label of the tab
	 */
	var Tab = Class.extend({
		_constructor: function(label) {
			this.label = label;
			this.groups = [];
			this.groupMap = {};
			this.visible = true;
		},

		/**
		 * Get the group with given index. If it does not yet exist, create a new one
		 * @method
		 * @param {int} group group index of the group to get
		 * @return group object
		 */
		getGroup: function(group) {
			var groupObject = this.groupMap[group];
			if (typeof groupObject === 'undefined') {
				groupObject = new Group();
				this.groupMap[group] = groupObject;
				this.groups.push(groupObject);
				// TODO resort the groups
			}

			return groupObject;
		},

		/**
		 * Get the EXT component representing the tab
		 * @return EXT component (EXT.Panel)
		 * @hide
		 */
		getExtComponent: function () {
			var that = this;

			if (typeof this.extPanel === 'undefined') {
				// generate the panel here
				this.extPanel = new Ext.Panel({
					'tbar' : [],
					'title' : this.label,
					'style': 'margin-top:0px',
					'bodyStyle': 'display:none',
					'autoScroll': true
				});

				// add the groups
				jQuery.each(this.groups, function(index, group) {
					// let each group generate its ext component and add them to the panel
					that.extPanel.getTopToolbar().add(group.getExtComponent());
				});
			}

			return this.extPanel;
		},

		/**
		 * Recalculate the visibility of all groups within the tab
		 * @hide
		 */
		doLayout: function() {
			var that = this;

			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'doLayout called for tab ' + this.label);
			}
			this.visible = false;

			// check all groups in this tab
			jQuery.each(this.groups, function(index, group) {
				that.visible |= group.doLayout();
			});

			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'tab ' + this.label + (this.visible ? ' is ' : ' is not ') + 'visible now');
			}

			return this.visible;
		}
	});

	/**
	 * Constructor for a floatingmenu group
	 * @namespace Aloha.FloatingMenu
	 * @class Group
	 * @constructor
	 */
	var Group = Class.extend({
		_constructor: function() {
			this.buttons = [];
			this.fields = [];
		},

		/**
		 * Add a button to this group
		 * @param {Button} buttonInfo to add to the group
		 */
		addButton: function(buttonInfo) {
			if (buttonInfo.button instanceof Aloha.ui.AttributeField) {
				if (this.fields.length < 2) {
					this.fields.push(buttonInfo);
				} else {
					throw new Error("Too much fields in this group");
				}
			} else {
				// Every plugin API entryPoint (method) should be securised enough
				// to avoid Aloha to block at startup even
				// if a plugin is badly designed
				if (typeof buttonInfo.button !== "undefined"){
					this.buttons.push(buttonInfo);
				}
			}
		},

		/**
		 * Get the EXT component representing the group (Ext.ButtonGroup)
		 * @return the Ext.ButtonGroup
		 * @hide
		 */
		getExtComponent: function () {
			var that = this, l,
				items = [],
				buttonCount = 0,
				columnCount = 0,
				len, idx, half;


			if (typeof this.extButtonGroup === 'undefined') {
			
				if (this.fields.length > 1) {
					columnCount = 1;
				}

				jQuery.each(this.buttons, function(index, button) {
					// count the number of buttons (large buttons count as 2)
					buttonCount += button.button.size == 'small' ? 1 : 2;
				});
				columnCount = columnCount + Math.ceil(buttonCount / 2);

				len = this.buttons.length;
				idx = 0;
				half =  Math.ceil(this.buttons.length / 2) - this.buttons.length % 2 ;

				if (this.fields.length > 0) {
					that.buttons.push(this.fields[0]);
					items.push(this.fields[0].button.getExtConfigProperties());
				}

				while (--len >= half) {
					items.push(this.buttons[idx++].button.getExtConfigProperties());
				}
				++len;
				if (this.fields.length > 1) {
					that.buttons.push(this.fields[1]);
					items.push(this.fields[1].button.getExtConfigProperties());
				}
				while (--len >=0) {
					items.push(this.buttons[idx++].button.getExtConfigProperties());
				}

				this.extButtonGroup = new Ext.ButtonGroup({
					'columns' : columnCount,
					'items': items
				});
	//			jQuery.each(this.fields, function(id, field){
	//				that.buttons.push(field);
	//			});
				// now find the Ext.Buttons and set to the GENTICS buttons
				jQuery.each(this.buttons, function(index, buttonInfo) {
					buttonInfo.button.extButton = that.extButtonGroup.findById(buttonInfo.button.id);
					// the following code is a work arround because ExtJS initializes later.
					// The ui wrapper store the information and here we use it... ugly.
					// if there are any listeners added before initializing the extButtons
					if ( buttonInfo.button.listenerQueue && buttonInfo.button.listenerQueue.length > 0 ) {
						while ( true ) {
							l = buttonInfo.button.listenerQueue.shift();
							if ( !l ) {break;}
							buttonInfo.button.extButton.addListener(l.eventName, l.handler, l.scope, l.options);
						}
					}
					if (buttonInfo.button.extButton.setObjectTypeFilter) {
						if (buttonInfo.button.objectTypeFilter) {
							buttonInfo.button.extButton.noQuery = false;
						}
						if ( buttonInfo.button.objectTypeFilter == 'all' ) {
							buttonInfo.button.objectTypeFilter = null;
						}
						buttonInfo.button.extButton.setObjectTypeFilter(buttonInfo.button.objectTypeFilter);
						if ( buttonInfo.button.displayField) {
							buttonInfo.button.extButton.displayField = buttonInfo.button.displayField;
						}
						if ( buttonInfo.button.tpl ) {
							buttonInfo.button.extButton.tpl = buttonInfo.button.tpl;
						}
					}
				});
			}

			return this.extButtonGroup;
		},

		/**
		 * Recalculate the visibility of the buttons and the group
		 * @hide
		 */
		doLayout: function () {
			var groupVisible = false,
				that = this;
			jQuery.each(this.buttons, function(index, button) {
				if (typeof button.button !== "undefined") {
					var extButton = that.extButtonGroup.findById(button.button.id),
					buttonVisible = button.button.isVisible() && button.scopeVisible;
					
					if (!extButton) {
						return;
					}
				
					if (buttonVisible && extButton.hidden) {
						extButton.show();
					} else if (!buttonVisible && extButton && !extButton.hidden) {
						extButton.hide();
					}
				
					groupVisible |= buttonVisible;
				}
			});
			if (groupVisible && this.extButtonGroup.hidden) {
				this.extButtonGroup.show();
			} else if (!groupVisible && !this.extButtonGroup.hidden) {
				this.extButtonGroup.hide();
			}
		
			return groupVisible;

		}
	});

	//=========================================================================
	//
	// Floating Menu
	//
	//=========================================================================

	var lastFloatingMenuPos = {
		top: null,
		left: null
	};

	/**
	 * Handler for window scroll event.  Positions the floating menu
	 * appropriately.
	 *
	 * @param {Aloha.FloatingMenu} floatingmenu
	 */
	function onWindowScroll( floatingmenu ) {
		if ( !Aloha.activeEditable ) {
			return;
		}

		var element = floatingmenu.obj;
		var editablePos = Aloha.activeEditable.obj.offset();
		var isTopAligned = floatingmenu.behaviour === 'topalign';
		var isAppended = floatingmenu.behaviour === 'append';
		var isManuallyPinned = floatingmenu.pinned
							 && ( parseInt( element.css( 'left' ), 10 )
								  != ( editablePos.left
									   + floatingmenu.horizontalOffset
									 ) );

		// no calculation when pinned manually or has behaviour 'append'
		if ( isTopAligned && isManuallyPinned || isAppended ) {
			return;
		}

		var floatingmenuHeight = element.height();
		var scrollTop = jQuery( document ).scrollTop();

		// This value is what the top position of the floating menu *would* be
		// if we tried to position it above the active editable.
		var floatingmenuTop = editablePos.top - floatingmenuHeight
		                    + floatingmenu.marginTop
		                    - floatingmenu.topalignOffset;

		// The floating menu does not fit in the space between the top of the
		// viewport and the editable, so position it at the top of the viewport
		// and over the editable.
		if ( scrollTop > floatingmenuTop ) {
			editablePos.top = isTopAligned
							? scrollTop + floatingmenu.marginTop
							: floatingmenu.marginTop;

		// There is enough space on top of the editable to fit the entire
		// floating menu, so we do so.
		} else if ( scrollTop <= floatingmenuTop ) {
			editablePos.top -= floatingmenuHeight
							 + ( isTopAligned
								 ? floatingmenu.marginTop +
								   floatingmenu.topalignOffset
								 : 0 );
		}

		floatingmenu.floatTo( editablePos );
	}

	/**
	 * Aloha's Floating Menu
	 * @namespace Aloha
	 * @class FloatingMenu
	 * @singleton
	 */
	var FloatingMenu = Class.extend({
		/**
		 * Define the default scopes
		 * @property
		 * @type Object
		 */
		scopes: {
			'Aloha.empty' : {
				'name' : 'Aloha.empty',
				'extendedScopes' : [],
				'buttons' : []
			},
			'Aloha.global' : {
				'name' : 'Aloha.global',
				'extendedScopes' : ['Aloha.empty'],
				'buttons' : []
			},
			'Aloha.continuoustext' : {
				'name' : 'Aloha.continuoustext',
				'extendedScopes' : ['Aloha.global'],
				'buttons' : []
			}
		},

		/**
		 * Array of tabs within the floatingmenu
		 * @hide
		 */
		tabs: [],

		/**
		 * 'Map' of tabs (for easy access)
		 * @hide
		 */
		tabMap: {},

		/**
		 * Flag to mark whether the floatingmenu is initialized
		 * @hide
		 */
		initialized: false,

		/**
		 * Array containing all buttons
		 * @hide
		 */
		allButtons: [],

		/**
		 * top part of the floatingmenu position
		 * @hide
		 */
		top: 100,

		/**
		 * left part of the floatingmenu position
		 * @hide
		 */
		left: 100,

		/**
		 * store pinned status - true, if the FloatingMenu is pinned
		 * @property
		 * @type boolean
		 */
		pinned: false,

		/**
		 * just a reference to the jQuery(window) object, which is used quite often
		 */
		window: jQuery(window),

		/**
		 * Aloha.settings.floatingmenu.behaviour
		 * 
		 * Is used to define the floating menu (fm) float behaviour.
		 *
		 * available: 
		 *  'float' (default) the fm will float next to the position where the caret is,
		 *  'topalign' the fm is fixed above the contentEditable which is active,
		 *  'append' the fm is appended to the defined 'element' element position (top/left)
		 */
		behaviour: 'float',

		/**
		 * Aloha.settings.floatingmenu.element
		 *
		 * Is used to define the element where the floating menu is positioned when
		 * Aloha.settings.floatingmenu.behaviour is set to 'append'
		 * 
		 */
		element: 'floatingmenu',

		/**
		 * topalign offset to be used for topalign behavior
		 */
		topalignOffset: 0,
		
		/**
		 * topalign offset to be used for topalign behavior
		 */
		horizontalOffset: 0,
		
		/**
		 * will only be hounoured when behaviour is set to 'topalign'. Adds a margin,
		 * so the floating menu is not directly attached to the top of the page
		 */
		marginTop: 10,
		
		/**
		 * Define whether the floating menu shall be draggable or not via Aloha.settings.floatingmanu.draggable
		 * Default is: true 
		 */
		draggable: true,
		
		/**
		 * Define whether the floating menu shall be pinned or not via Aloha.settings.floatingmanu.pin
		 * Default is: false 
		 */
		pin: false,
		
		/**
		 * A list of all buttons that have been added to the floatingmenu
		 * This needs to be tracked, as adding buttons twice will break the fm
		 */
		buttonsAdded: [],
		
		/**
		 * Will be initialized by checking Aloha.settings.toolbar, which will contain the config for
		 * the floating menu. If there is no config, tabs and groups will be generated programmatically
		 */
		fromConfig: false,

		/**
		 * Initialize the floatingmenu
		 * @hide
		 */
		init: function() {

			// check for behaviour setting of the floating menu
		    if ( Aloha.settings.floatingmenu ) {
		    	if ( typeof Aloha.settings.floatingmenu.draggable ===
				         'boolean' ) {
		    		this.draggable = Aloha.settings.floatingmenu.draggable;
		    	}

				if ( typeof Aloha.settings.floatingmenu.behaviour ===
				         'string' ) {
					this.behaviour = Aloha.settings.floatingmenu.behaviour;
				}

				if ( typeof Aloha.settings.floatingmenu.topalignOffset !==
					    'undefined' ) {
					this.topalignOffset = parseInt(
						Aloha.settings.floatingmenu.topalignOffset, 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.horizontalOffset !==
				         'undefined' ) {
					this.horizontalOffset = parseInt(
						Aloha.settings.floatingmenu.horizontalOffset , 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.marginTop ===
				         'number' ) {
				    this.marginTop = parseInt(
						Aloha.settings.floatingmenu.marginTop , 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.element ===
						'string' ) {
					this.element = Aloha.settings.floatingmenu.element;
				}
				if ( typeof Aloha.settings.floatingmenu.pin ===
						'boolean' ) {
					this.pin = Aloha.settings.floatingmenu.pin;
				}


				if ( typeof Aloha.settings.floatingmenu.width !==
				         'undefined' ) {
					this.width = parseInt( Aloha.settings.floatingmenu.width,
						10 );
				}
		    }

			jQuery.storage = new jQuery.store();

			this.currentScope = 'Aloha.global';

			var that = this;

			this.window.unload(function () {
				// store fm position if the panel is pinned to be able to restore it next time
				if (that.pinned) {
					jQuery.storage.set('Aloha.FloatingMenu.pinned', 'true');
					jQuery.storage.set('Aloha.FloatingMenu.top', that.top);
					jQuery.storage.set('Aloha.FloatingMenu.left', that.left);
					if (Aloha.Log.isInfoEnabled()) {
						Aloha.Log.info(this, 'stored FloatingMenu pinned position {' + that.left
								+ ', ' + that.top + '}');
					}
				} else {
					// delete old localStorages
					jQuery.storage.del('Aloha.FloatingMenu.pinned');
					jQuery.storage.del('Aloha.FloatingMenu.top');
					jQuery.storage.del('Aloha.FloatingMenu.left');
				}
				if (that.userActivatedTab) {
					jQuery.storage.set('Aloha.FloatingMenu.activeTab', that.userActivatedTab);
				}
			}).resize(function () {
				if (that.behaviour === 'float') {
					if (that.pinned) {
						that.fixPinnedPosition();
						that.refreshShadow();
						that.extTabPanel.setPosition(that.left, that.top);
					} else {
						var target = that.calcFloatTarget(Aloha.Selection.getRangeObject());
						if (target) {
							that.floatTo(target);
						}
					}
				}
			});
			Aloha.bind('aloha-ready', function() {
				that.generateComponent();
				that.initialized = true;
			});
			
			if (typeof Aloha.settings.toolbar === 'object') {
				this.fromConfig = true;
			}
		},

		/**
		 * jQuery reference to the extjs tabpanel
		 * @hide
		 */
		obj: null,

		/**
		 * jQuery reference to the shadow obj
		 * @hide
		 */
		shadow: null,

		/**
		 * jQuery reference to the panels body wrap div
		 * @hide
		 */
		panelBody: null,
		
		/**
		 * The panels width
		 * @hide
		 */
		width: 400,

		/**
		 * initialize tabs and groups according to the current configuration
		 */
		initTabsAndGroups: function () {
			var that = this;
			
			// if there is no toolbar config tabs and groups have been initialized before
			if (!this.fromConfig) {
				return;
			}
			
			jQuery.each(Aloha.settings.toolbar.tabs, function (tab, groups) {
				// generate or retrieve tab
				var tabObject = that.tabMap[tab];
				if (typeof tabObject === 'undefined') {
					// the tab object does not yet exist, so create a new tab and add it to the list
					tabObject = new Tab(tab);
					that.tabs.push(tabObject);
					that.tabMap[tab] = tabObject;
				}
				
				// generate groups for current tab
				jQuery.each(groups, function (group, buttons) {
					var groupObject = tabObject.getGroup(group),
						i;

					// now get all the buttons for that group
					jQuery.each(buttons, function (j, button) {
						if (jQuery.inArray(button, that.buttonsAdded) !== -1) {
							// buttons must not be added twice
							console.warn('Skipping button {' + button + '}. A button can\'t be added ' + 
								'to the floating menu twice. Config key: {Aloha.settings.toolbar.' + 
									tab + '.' + group + '}');
									return;
						}
						
						// now add the button to the group
						for (i = 0; i < that.allButtons.length; i++) {
							if (button === that.allButtons[i].button.name) {
								groupObject.addButton(that.allButtons[i]);
								// remember that we've added the button
								that.buttonsAdded.push(that.allButtons[i].button.name);
								break;
							}
						}
					});
				});
			});
		},

		/**
		 * Generate the rendered component for the floatingmenu
		 * @hide
		 */
		generateComponent: function () {
			var that = this, pinTab;

			// initialize tabs and groups first
			this.initTabsAndGroups();

			// Initialize and configure the tooltips
			Ext.QuickTips.init();
			Ext.apply(Ext.QuickTips.getQuickTip(), {
				minWidth : 10
			});

			
			
			if (this.extTabPanel) {
				// TODO dispose of the ext component
			} else {
				
				// Enable or disable the drag functionality
				var dragConfiguration = false;

				if ( that.draggable ) {
					dragConfiguration = {
						insertProxy: false,
						onDrag : function(e) {
							var pel = this.proxy.getEl();
							this.x = pel.getLeft(true);
							this.y = pel.getTop(true);
							this.panel.shadow.hide();
						},
						endDrag : function(e) {
							var top = (that.pinned) ? this.y - jQuery(document).scrollTop() : this.y;
					
							that.left = this.x;
							that.top = top;

							// store the last floating menu position when the floating menu was dragged around
							lastFloatingMenuPos.left = that.left;
							lastFloatingMenuPos.top = that.top;

							this.panel.setPosition(this.x, top);
							that.refreshShadow();
							this.panel.shadow.show();
						}
					};
				}
				// generate the tabpanel object
				this.extTabPanel = new Ext.TabPanel({
					activeTab: 0,
					width: that.width, // 336px this fits the multisplit button and 6 small buttons placed in 3 cols
					plain: false,
					draggable: dragConfiguration,
					floating: {shadow: false},
					defaults: {
						autoScroll: true
					},
					layoutOnTabChange : true,
					shadow: false,
					cls: 'aloha-floatingmenu ext-root',
					listeners : {
						'tabchange' : {
							'fn' : function(tabPanel, tab) {
								if (tab.title != that.autoActivatedTab) {
									if (Aloha.Log.isDebugEnabled()) {
										Aloha.Log.debug(that, 'User selected tab ' + tab.title);
									}
									// remember the last user-selected tab
									that.userActivatedTab = tab.title;
								} else {
									if (Aloha.Log.isDebugEnabled()) {
										Aloha.Log.debug(that, 'Tab ' + tab.title + ' was activated automatically');
									}
								}
								that.autoActivatedTab = undefined;
						
								// ok, this is kind of a hack: when the tab changes, we check all buttons for multisplitbuttons (which have the method setActiveDOMElement).
								// if a DOM Element is queued to be set active, we try to do this now.
								// the reason for this is that the active DOM element can only be set when the multisplit button is currently visible.
								jQuery.each(that.allButtons, function(index, buttonInfo) {
									if (typeof buttonInfo.button !== 'undefined'
										&& typeof buttonInfo.button.extButton !== 'undefined'
										&& buttonInfo.button.extButton !== null
										&& typeof buttonInfo.button.extButton.setActiveDOMElement === 'function') {
										if (typeof buttonInfo.button.extButton.activeDOMElement !== 'undefined') {
											buttonInfo.button.extButton.setActiveDOMElement(buttonInfo.button.extButton.activeDOMElement);
										}
									}
								});
						
								// adapt the shadow
								that.extTabPanel.shadow.show();
								that.refreshShadow();
							}
						}
					},
					enableTabScroll : true
				});
		
		
			}
			// add the tabs
			jQuery.each(this.tabs, function(index, tab) {
				// let each tab generate its ext component and add them to the panel
				try {
					that.extTabPanel.add(tab.getExtComponent());
				} catch(e) {
					Aloha.Log.error(that,"Error while inserting tab: " + e);
				}
			});

			// add the dropshadow
			this.extTabPanel.shadow = jQuery('<div id="aloha-floatingmenu-shadow" class="aloha-shadow">&#160;</div>');
			jQuery('body').append(this.extTabPanel.shadow);

			// add an empty pin tab item, store reference
			pinTab = this.extTabPanel.add({
				title : '&#160;'
			});

			// finally render the panel to the body
			this.extTabPanel.render(document.body);

			// finish the pin element after the FM has rendered (before there are noe html contents to be manipulated
			jQuery(pinTab.tabEl)
				.addClass('aloha-floatingmenu-pin')
				.html('&#160;')
				.mousedown(function (e) {
					that.togglePin();
					// Note: this event is deliberately stopped here, although normally,
					// we would set the flag GENTICS.Aloha.eventHandled instead.
					// But when the event bubbles up, no tab would be selected and
					// the floatingmenu would be rather thin.
					e.stopPropagation();
				});

			// a reference to the panels body needed for shadow size & position
			this.panelBody = jQuery('div.aloha-floatingmenu div.x-tab-panel-bwrap');

			// do the visibility
			this.doLayout();

			// bind jQuery reference to extjs obj
			// this has to be done AFTER the tab panel has been rendered
			this.obj = jQuery(this.extTabPanel.getEl().dom);

			if (jQuery.storage.get('Aloha.FloatingMenu.pinned') == 'true') {
				//this.togglePin();

				this.top = parseInt(jQuery.storage.get('Aloha.FloatingMenu.top'),10);
				this.left = parseInt(jQuery.storage.get('Aloha.FloatingMenu.left'),10);

				// do some positioning fixes
				this.fixPinnedPosition();

				if (Aloha.Log.isInfoEnabled()) {
					Aloha.Log.info(this, 'restored FloatingMenu pinned position {' + this.left + ', ' + this.top + '}');
				}

				this.refreshShadow();
			}

			// set the user activated tab stored in a localStorage
			if (jQuery.storage.get('Aloha.FloatingMenu.activeTab')) {
				this.userActivatedTab = jQuery.storage.get('Aloha.FloatingMenu.activeTab');
			}

			// for now, position the panel somewhere
			this.extTabPanel.setPosition(this.left, this.top);

			// mark the event being handled by aloha, because we don't want to recognize
			// a click into the floatingmenu to be a click into nowhere (which would
			// deactivate the editables)
			this.obj.mousedown(function (e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = true;
				//e.stopSelectionUpdate = true;
			});

			this.obj.mouseup(function (e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = false;
			});

			jQuery( window ).scroll(function() {
				onWindowScroll( that );
			});

			// don't display the drag handle bar / pin when floating menu is not draggable
			if ( !that.draggable ) {
				jQuery('.aloha-floatingmenu').hover( function() {
					jQuery(this).css({background: 'none'});
					jQuery('.aloha-floatingmenu-pin').hide();
				});
			}

			// adjust float behaviour
			if (this.behaviour === 'float') {
				// listen to selectionChanged event
				Aloha.bind('aloha-selection-changed',function(event, rangeObject) {
					if (!that.pinned) {
						var pos = that.calcFloatTarget(rangeObject);
						if (pos) {
							that.floatTo(pos);
						}
					}
				});
			} else if (this.behaviour === 'append' ) {
				var p = jQuery( "#" + that.element );
				var position = p.offset();

				if ( !position ) {
					Aloha.Log.warn(that, 'Invalid element HTML ID for floating menu: ' + that.element);
					return false;
				}

				// set the position so that it does not float on the first editable activation
				this.floatTo( position );
				
				if ( this.pin ) {
					this.togglePin( true );
				}

				Aloha.bind( 'aloha-editable-activated', function( event, data ) {
					if ( that.pinned ) {
						return;
					}
					that.floatTo( position );
				});
				
		    } else if ( this.behaviour === 'topalign' ) {
				// topalign will retain the user's pinned status
				// TODO maybe the pin should be hidden in that case?
				this.togglePin( false );

				// Float the menu to the editable that is activated.
				Aloha.bind( 'aloha-editable-activated', function( event, data ) {
					if ( that.pinned ) {
						return;
					}

					// FIXME: that.obj.height() does not return the correct
					//        height of the editable.  We need to fix this, and
					//        not hard-code the height as we currently do.
					var editable = data.editable.obj;
					var floatingmenuHeight = 90;
					var editablePos = editable.offset();
					var isFloatingmenuAboveViewport = ( (
						editablePos.top - floatingmenuHeight )
						    < jQuery( document ).scrollTop() );

					if ( isFloatingmenuAboveViewport ) {
						// Since we don't have space to place the floatingmenu
						// above the editable, we want to place it over the
						// editable instead.  But if the editable is shorter
						// than the floatingmenu, it would be completely
						// covered by it, and so, in such cases, we position
						// the editable at the bottom of the short editable.
						editablePos.top = ( editable.height()
						         < floatingmenuHeight )
							? editablePos.top + editable.height()
							: jQuery( document ).scrollTop();

						editablePos.top += that.marginTop;
					} else {
						editablePos.top -= floatingmenuHeight
						                 + that.topalignOffset;
					}

					editablePos.left += that.horizontalOffset;

					var HORIZONTAL_PADDING = 10;
					// Calculate by how much the floating menu is pocking
					// outside the width of the viewport.  A positive number
					// means that it is outside the viewport, negative means
					// it is within the viewport.
					var overhang = ( ( editablePos.left + that.width
						+ HORIZONTAL_PADDING ) - jQuery(window).width() );

					if ( overhang > 0 ) {
						editablePos.left -= overhang;	
					}

					that.floatTo( editablePos );
				});
			}
		},

		/**
		 * Fix the position of the pinned floatingmenu to keep it visible
		 */
		fixPinnedPosition: function() {
			// if not pinned, do not fix the position
			if (!this.pinned) {
				return;
			}

			// fix the position of the floatingmenu, to keep it visible
			if (this.top < 30) {
				// from top position, we want to have 30px margin
				this.top = 30;
			} else if (this.top > this.window.height() - this.extTabPanel.getHeight()) {
				this.top = this.window.height() - this.extTabPanel.getHeight();
			}
			if (this.left < 0) {
				this.left = 0;
			} else if (this.left > this.window.width() - this.extTabPanel.getWidth()) {
				this.left = this.window.width() - this.extTabPanel.getWidth();
			}
		},

		/**
		 * reposition & resize the shadow
		 * the shadow must not be repositioned outside this method!
		 * position calculation is based on this.top and this.left coordinates
		 * @method
		 */
		refreshShadow: function (resize) {
			if (this.panelBody) {
				var props = {
					'top': this.top + 24, // 24px top offset to reflect tab bar height
					'left': this.left
				};

				if(typeof resize === 'undefined' || !resize) {
					props.width = this.panelBody.width() + 'px';
					props.height = this.panelBody.height() + 'px';
				}

				this.extTabPanel.shadow.css(props);
			}
		},

		/**
		 * toggles the pinned status of the floating menu
		 * @method
		 * @param {boolean} pinned set to true to activate pin, or set to false to deactivate pin. 
		 *             leave undefined to toggle pin status automatically
		 */
		togglePin: function(pinned) {
			var el = jQuery('.aloha-floatingmenu-pin');
		       
		    if (typeof pinned === 'boolean') {
			this.pinned = !pinned;
		    }
		       
			if (this.pinned) {
				el.removeClass('aloha-floatingmenu-pinned');
				this.top = this.obj.offset().top;

				this.obj.removeClass('fixed').css({
					'top': this.top
				});

				this.extTabPanel.shadow.removeClass('fixed');
				this.refreshShadow();

				this.pinned = false;
			} else {
				el.addClass('aloha-floatingmenu-pinned');
				this.top = this.obj.offset().top - this.window.scrollTop();

				this.obj.addClass('fixed').css({
					'top': this.top // update position for fixed position
				});

				// do the same for the shadow
				this.extTabPanel.shadow.addClass('fixed');//props.start
				this.refreshShadow();

				this.pinned = true;
			}
		},

		/**
		 * Create a new scopes
		 * @method
		 * @param {String} scope name of the new scope (should be namespaced for uniqueness)
		 * @param {String} extendedScopes Array of scopes this scope extends. Can also be a single String if
		 *            only one scope is extended, or omitted if the scope should extend
		 *            the empty scope
		 */
		createScope: function(scope, extendedScopes) {
			if (typeof extendedScopes === 'undefined') {
				extendedScopes = ['Aloha.empty'];
			} else if (typeof extendedScopes === 'string') {
				extendedScopes = [extendedScopes];
			}

			// TODO check whether the extended scopes already exist

			if (this.scopes[scope]) {
				// TODO what if the scope already exists?
			} else {
				// generate the new scope
				this.scopes[scope] = {'name' : scope, 'extendedScopes' : extendedScopes, 'buttons' : []};
			}
		},

		/**
		 * Adds a button to the floatingmenu
		 * @method
		 * @param {String} scope the scope for the button, should be generated before (either by core or the plugin)
		 * @param {Button} button instance of Aloha.ui.button to add at the floatingmenu
		 * @param {String} tab label of the tab to which the button is added
		 * @param {int} group index of the button group in the tab, lowest index is left
		 */
		addButton: function(scope, button, tab, group) {
			// check whether the scope exists
			var
				scopeObject = this.scopes[scope],
				buttonInfo, tabObject, groupObject;
		
			if (!button.name) {
				console.warn('Added button with iconClass {' + button.iconClass + '} which has no property "name"');
			}
	
			if (typeof scopeObject === 'undefined') {
				Aloha.Log.error("Can't add button to given scope since the scope has not yet been initialized.", scope);
				return false;
			}

			// generate a buttonInfo object
			buttonInfo = { 'button' : button, 'scopeVisible' : false };

			// add the button to the list of all buttons
			this.allButtons.push(buttonInfo);

			// add the button to the scope
			scopeObject.buttons.push(buttonInfo);

			// if there is no toolbar config tabs and groups will be generated right away
			if (!this.fromConfig) {
				// get the tab object
				tabObject = this.tabMap[tab];
				if (typeof tabObject === 'undefined') {
					// the tab object does not yet exist, so create a new tab and add it to the list
					tabObject = new Tab(tab);
					this.tabs.push(tabObject);
					this.tabMap[tab] = tabObject;
				}

				// get the group
				groupObject = tabObject.getGroup(group);

				// now add the button to the group
				groupObject.addButton(buttonInfo);
			}

			// finally, when the floatingmenu is already initialized, we need to create the ext component now
			if (this.initialized) {
				this.generateComponent();
			}
		},

		/**
		 * Recalculate the visibility of tabs, groups and buttons (depending on scope and button hiding)
		 * @hide
		 */
		doLayout: function () {
			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'doLayout called for FloatingMenu, scope is ' + this.currentScope);
			}

			// if there's no floatingmenu don't do anything
			if ( typeof this.extTabPanel === 'undefined' ) {
				return false;
			}

			var that = this,
				firstVisibleTab = false,
				activeExtTab = this.extTabPanel.getActiveTab(),
				activeTab = false,
				floatingMenuVisible = false,
				showUserActivatedTab = false,
				pos;
			
			// let the tabs layout themselves
			jQuery.each(this.tabs, function(index, tab) {
				// remember the active tab
				if (tab.extPanel == activeExtTab) {
					activeTab = tab;
				}

				// remember whether the tab is currently visible
				var tabVisible = tab.visible;

				// let each tab generate its ext component and add them to the panel
				if (tab.doLayout()) {
					// found a visible tab, so the floatingmenu needs to be visible as well
					floatingMenuVisible = true;

					// make sure the tabstrip is visible
					if (!tabVisible) {
						if (Aloha.Log.isDebugEnabled()) {
							Aloha.Log.debug(that, 'showing tab strip for tab ' + tab.label);
						}
						that.extTabPanel.unhideTabStripItem(tab.extPanel);
					}

					// remember the first visible tab
					if (!firstVisibleTab) {
						// this is the first visible tab (in case we need to switch to it)
						firstVisibleTab = tab;
					}

					// check whether this visible tab is the last user activated tab and currently not active
					if (that.userActivatedTab == tab.extPanel.title && tab.extPanel != activeExtTab) {
						showUserActivatedTab = tab;
					}
				} else {
					// make sure the tabstrip is hidden
					if (tabVisible) {
						if (Aloha.Log.isDebugEnabled()) {
							Aloha.Log.debug(that, 'hiding tab strip for tab ' + tab.label);
						}
						that.extTabPanel.hideTabStripItem(tab.extPanel);
					}
				}
			});

			// check whether the last tab which was selected by the user is visible and not the active tab
			if (showUserActivatedTab) {
				if (Aloha.Log.isDebugEnabled()) {
					Aloha.Log.debug(this, 'Setting active tab to ' + showUserActivatedTab.label);
				}
				this.extTabPanel.setActiveTab(showUserActivatedTab.extPanel);
			} else if (typeof activeTab === 'object' && typeof firstVisibleTab === 'object') {
				// now check the currently visible tab, whether it is visible and enabled
				if (!activeTab.visible) {
					if (Aloha.Log.isDebugEnabled()) {
						Aloha.Log.debug(this, 'Setting active tab to ' + firstVisibleTab.label);
					}
					this.autoActivatedTab = firstVisibleTab.extPanel.title;
					this.extTabPanel.setActiveTab(firstVisibleTab.extPanel);
				}
			}

			// set visibility of floatingmenu
			if (floatingMenuVisible && this.extTabPanel.hidden) {
				// set the remembered position
				this.extTabPanel.show();
				this.refreshShadow();
				this.extTabPanel.shadow.show();
				this.extTabPanel.setPosition(this.left, this.top);
			} else if (!floatingMenuVisible && !this.extTabPanel.hidden) {
				// remember the current position
				pos = this.extTabPanel.getPosition(true);
				// restore previous position if the fm was pinned
				this.left = pos[0] < 0 ? 100 : pos[0];
				this.top = pos[1] < 0 ? 100 : pos[1];
				this.extTabPanel.hide();
				this.extTabPanel.shadow.hide();
			} /*else {
				var target = that.calcFloatTarget(Aloha.Selection.getRangeObject());
				if (target) {
					this.left = target.left;
					this.top = target.top;
					this.extTabPanel.show();
					this.refreshShadow();
					this.extTabPanel.shadow.show();
					this.extTabPanel.setPosition(this.left, this.top);

					that.floatTo(target);
				}
			}*/

			// let the Ext object render itself again
			this.extTabPanel.doLayout();
		},

		/**
		 * Set the current scope
		 * @method
		 * @param {String} scope name of the new current scope
		 */
		setScope: function(scope) {
			// get the scope object
			var scopeObject = this.scopes[scope];

			if (typeof scopeObject === 'undefined') {
				// TODO log an error
			} else if (this.currentScope != scope) {
				this.currentScope = scope;

				// first hide all buttons
				jQuery.each(this.allButtons, function(index, buttonInfo) {
					buttonInfo.scopeVisible = false;
				});

				// now set the buttons in the given scope to be visible
				this.setButtonScopeVisibility(scopeObject);

				// finally refresh the layout
				this.doLayout();
			}
		},

		/**
		 * Set the scope visibility of the buttons for the given scope. This method will call itself for the motherscopes of the given scope.
		 * @param scopeObject scope object
		 * @hide
		 */
		setButtonScopeVisibility: function(scopeObject) {
			var that = this;

			// set all buttons in the given scope to be visible
			jQuery.each(scopeObject.buttons, function(index, buttonInfo) {
				buttonInfo.scopeVisible = true;
			});

			// now do the recursion for the motherscopes
			jQuery.each(scopeObject.extendedScopes, function(index, scopeName) {
				var motherScopeObject = that.scopes[scopeName];
				if (typeof motherScopeObject === 'object') {
					that.setButtonScopeVisibility(motherScopeObject);
				}
			});
		},

		/**
		 * returns the next possible float target dom obj
		 * the floating menu should only float to h1-h6, p, div, td and pre elements
		 * if the current object is not valid, it's parentNode will be considered, until
		 * the limit object is hit
		 * @param obj the dom object to start from (commonly this would be the commonAncestorContainer)
		 * @param limitObj the object that limits the range (this would be the editable)
		 * @return dom object which qualifies as a float target
		 * @hide
		 */
		nextFloatTargetObj: function (obj, limitObj) {
			// if we've hit the limit object we don't care for it's type
			if (!obj || obj == limitObj) {
				return obj;
			}

			// fm will only float to h1-h6, p, div, td
			switch (obj.nodeName.toLowerCase()) {
				case 'h1':
				case 'h2':
				case 'h3':
				case 'h4':
				case 'h5':
				case 'h6':
				case 'p':
				case 'div':
				case 'td':
				case 'pre':
				case 'ul':
				case 'ol':
					return obj;
				default:
					return this.nextFloatTargetObj(obj.parentNode, limitObj);
			}
		},

		/**
		 * calculates the float target coordinates for a range
		 * @param range the fm should float to
		 * @return object containing left and top coordinates, like { left : 20, top : 43 }
		 * @hide
		 */
		calcFloatTarget: function(range) {
			var
				i, documentWidth, editableLength, left, target,
				targetObj, scrollTop, top;

			// TODO in IE8 somteimes a broken range is handed to this function - investigate this
			if (!Aloha.activeEditable || typeof range.getCommonAncestorContainer === 'undefined') {
				return false;
			}

			// check if the designated editable is disabled
			for ( i = 0, editableLength = Aloha.editables.length; i < editableLength; i++) {
				if (Aloha.editables[i].obj.get(0) == range.limitObject &&
						Aloha.editables[i].isDisabled()) {
					return false;
				}
			}

			target = this.nextFloatTargetObj(range.getCommonAncestorContainer(), range.limitObject);
			if ( ! target ) {
				return false;
			}

			targetObj = jQuery(target);
			scrollTop = GENTICS.Utils.Position.Scroll.top;
			if (!targetObj || !targetObj.offset()) {
				return false;
			}
			top = targetObj.offset().top - this.obj.height() - 50; // 50px offset above the current obj to have some space above

			// if the floating menu would be placed higher than the top of the screen...
			if ( top < scrollTop) {
				top += 80 + GENTICS.Utils.Position.ScrollCorrection.top;
				// 80px if editable element is eg h1; 50px was fine for p;
				// todo: maybe just use GENTICS.Utils.Position.ScrollCorrection.top with a better value?
				// check where this is also used ...
			}

			// if the floating menu would float off the bottom of the screen
			// we don't want it to move, so we'll return false
			if (top > this.window.height() + this.window.scrollTop()) {
				return false;
			}

			// check if the floating menu does not float off the right side
			left = Aloha.activeEditable.obj.offset().left;
			documentWidth = jQuery(document).width();
			if ( documentWidth - this.width < left ) {
					left = documentWidth - this.width - GENTICS.Utils.Position.ScrollCorrection.left;
			}
			
			return {
				left : left,
				top : top
			};
		},

		/**
		 * float the fm to the desired position
		 * the floating menu won't float if it is pinned
		 * @method
		 * @param {Object} coordinate object which has a left and top property
		 */
		floatTo: function(position) {
			// no floating if the panel is pinned
			if (this.pinned) {
				return;
			}

			var floatingmenu = this,
			    fmpos = this.obj.offset(),
				lastLeft,
				lastTop;
			
			if ( lastFloatingMenuPos.left === null ) {
				lastLeft = fmpos.left;
				lastTop = fmpos.top;
			} else {
				lastLeft = lastFloatingMenuPos.left;
				lastTop = lastFloatingMenuPos.top;
			}

			// Place the floatingmenu to the last place the user had seen it,
			// then animate it into its new position.
			if ( lastLeft != position.left || lastTop != position.top ) {
				this.obj.offset({
					left: lastLeft,
					top: lastTop
				});

				this.obj.animate( {
					top: position.top,
					left: position.left
				}, {
					queue : false,
					step : function( step, props ) {
						// update position reference
						if ( props.prop === 'top' ) {
							floatingmenu.top = props.now;
						} else if ( props.prop === 'left' ) {
							floatingmenu.left = props.now;
						}

						floatingmenu.refreshShadow( false );
					},
					complete: function() {
						// When the animation is over, remember the floatingmenu's
						// final resting position.
						lastFloatingMenuPos.left = floatingmenu.left;
						lastFloatingMenuPos.top = floatingmenu.top;
					}
				});
			}
		},

		/**
		 * Hide the floatingmenu
		 */
		hide: function() {
			if (this.obj) {
				this.obj.hide();
			}
			if (this.shadow) {
				this.shadow.hide();
			}
		},

		/**
		 * Activate the tab containing the button with given name.
		 * If the button with given name is not found, nothing changes
		 * @param name name of the button
		 */
		activateTabOfButton: function(name) {
			var tabOfButton = null;

			// find the tab containing the button
			for (var t = 0; t < this.tabs.length && !tabOfButton; t++) {
				var tab = this.tabs[t];
				for (var g = 0; g < tab.groups.length && !tabOfButton; g++) {
					var group = tab.groups[g];
					for (var b = 0; b < group.buttons.length && !tabOfButton; b++) {
						var button = group.buttons[b];
						if (button.button.name == name) {
							tabOfButton = tab;
							break;
						}
					}
				}
			}

			if (tabOfButton) {
				this.userActivatedTab = tabOfButton.label;
				this.doLayout();
			}
		}
	});
	
	var menu =  new FloatingMenu();
	menu.init();
	
	// set scope to empty if deactivated
	Aloha.bind('aloha-editable-deactivated', function() {
		menu.setScope('Aloha.empty');
	});
	
	// set scope to empty if the user selectes a non contenteditable area
	Aloha.bind('aloha-selection-changed', function() {
		if ( !Aloha.Selection.isSelectionEditable() && !Aloha.Selection.isFloatingMenuVisible() ) {
			menu.setScope('Aloha.empty');
		}
	});
	
	return menu;
});


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


define('aloha/selection',[ 'aloha/core', 'aloha/jquery', 'aloha/floatingmenu', 'util/class', 'util/range', 'aloha/rangy-core' ],
function(Aloha, jQuery, FloatingMenu, Class, Range) {
	var
//		$ = jQuery,
//		Aloha = window.Aloha,
//		Class = window.Class,
		GENTICS = window.GENTICS;

	/**
	 * @namespace Aloha
	 * @class Selection
	 * This singleton class always represents the current user selection
	 * @singleton
	 */
	var Selection = Class.extend({
		_constructor: function(){
			// Pseudo Range Clone being cleaned up for better HTML wrapping support
			this.rangeObject = {};

			this.preventSelectionChangedFlag = false; // will remember if someone urged us to skip the next aloha-selection-changed event

			// define basics first
			this.tagHierarchy = {
				'textNode' : [],
				'abbr' : ['textNode'],
				'b' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img','a','del','ins','u', 'cite', 'q', 'code', 'abbr', 'strong'],
				'pre' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img','a','del','ins','u', 'cite','q', 'code', 'abbr', 'code'],
				'blockquote' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img','a','del','ins','u', 'cite', 'q', 'code', 'abbr', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				'ins' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img','a','u', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				'ul' : ['li'],
				'ol' : ['li'],
				'li' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del', 'ins', 'u', 'a'],
				'tr' : ['td','th'],
				'table' : ['tr'],
				'div' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img', 'ul', 'ol', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del', 'ins', 'u', 'p', 'div', 'pre', 'blockquote', 'a'],
				'h1' : ['textNode', 'b', 'i', 'em', 'sup', 'sub', 'br', 'span', 'img','a', 'del', 'ins', 'u']
			};
			// now reference the basics for all other equal tags (important: don't forget to include
			// the basics itself as reference: 'b' : this.tagHierarchy.b
			this.tagHierarchy = {
				'textNode' : this.tagHierarchy.textNode,
				'abbr' : this.tagHierarchy.abbr,
				'br' : this.tagHierarchy.textNode,
				'img' : this.tagHierarchy.textNode,
				'b' : this.tagHierarchy.b,
				'strong' : this.tagHierarchy.b,
				'code' : this.tagHierarchy.b,
				'q' : this.tagHierarchy.b,
				'blockquote' : this.tagHierarchy.blockquote,
				'cite' : this.tagHierarchy.b,
				'i' : this.tagHierarchy.b,
				'em' : this.tagHierarchy.b,
				'sup' : this.tagHierarchy.b,
				'sub' : this.tagHierarchy.b,
				'span' : this.tagHierarchy.b,
				'del' : this.tagHierarchy.del,
				'ins' : this.tagHierarchy.ins,
				'u' : this.tagHierarchy.b,
				'p' : this.tagHierarchy.b,
				'pre' : this.tagHierarchy.pre,
				'a' : this.tagHierarchy.b,
				'ul' : this.tagHierarchy.ul,
				'ol' : this.tagHierarchy.ol,
				'li' : this.tagHierarchy.li,
				'td' : this.tagHierarchy.li,
				'div' : this.tagHierarchy.div,
				'h1' : this.tagHierarchy.h1,
				'h2' : this.tagHierarchy.h1,
				'h3' : this.tagHierarchy.h1,
				'h4' : this.tagHierarchy.h1,
				'h5' : this.tagHierarchy.h1,
				'h6' : this.tagHierarchy.h1,
				'table' : this.tagHierarchy.table
			};

			// When applying this elements to selection they will replace the assigned elements
			this.replacingElements = {
				'h1' : ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6','pre', 'blockquote']
			};
			this.replacingElements = {
					'h1' : this.replacingElements.h1,
					'h2' : this.replacingElements.h1,
					'h3' : this.replacingElements.h1,
					'h4' : this.replacingElements.h1,
					'h5' : this.replacingElements.h1,
					'h6' : this.replacingElements.h1,
					'pre' : this.replacingElements.h1,
					'p' : this.replacingElements.h1,
					'blockquote' : this.replacingElements.h1
			};
			this.allowedToStealElements = {
					'h1' : ['textNode']
			};
			this.allowedToStealElements = {
					'h1' : this.allowedToStealElements.h1,
					'h2' : this.allowedToStealElements.h1,
					'h3' : this.allowedToStealElements.h1,
					'h4' : this.allowedToStealElements.h1,
					'h5' : this.allowedToStealElements.h1,
					'h6' : this.allowedToStealElements.h1,
					'p' : this.tagHierarchy.b
			};
		},

		/**
		 * Class definition of a SelectionTree (relevant for all formatting / markup changes)
		 * TODO: remove this (was moved to range.js)
		 * Structure:
		 * +
		 * |-domobj: <reference to the DOM Object> (NOT jQuery)
		 * |-selection: defines if this node is marked by user [none|partial|full]
		 * |-children: recursive structure like this
		 * @hide
		 */
		SelectionTree: function() {
			this.domobj = {};
			this.selection = undefined;
			this.children = [];
		},

		/**
		 * INFO: Method is used for integration with Gentics Aloha, has no use otherwise
		 * Updates the rangeObject according to the current user selection
		 * Method is always called on selection change
		 * @param objectClicked Object that triggered the selectionChange event
		 * @return true when rangeObject was modified, false otherwise
		 * @hide
		 */
		onChange: function(objectClicked, event) {
			if (this.updateSelectionTimeout) {
				window.clearTimeout(this.updateSelectionTimeout);
				this.updateSelectionTimeout = undefined;
			}
			//we have to work around an IE bug that causes the user
			//selection to be incorrectly set on the body element when
			//the updateSelectionTimeout triggers. We remember the range
			//from the time when this onChange is triggered and provide
			//it instead of the current user selection when the timout
			//is triggered. The bug is caused by selecting some text and
			//then clicking once inside the selection (which collapses
			//the selection). Interesting fact: when the timeout is
			//increased to 500 milliseconds, the bug will not cause any
			//problems since the selection will correct itself somehow.
			var range = new Aloha.Selection.SelectionRange(true);
			this.updateSelectionTimeout = window.setTimeout(function () {
				Aloha.Selection._updateSelection(event, range);
			}, 5);
		},

		/**
		 * prevents the next aloha-selection-changed event from being triggered
		 */
		preventSelectionChanged: function () {
			this.preventSelectionChangedFlag = true;
		},

		/**
		 * will return wheter selection change event was prevented or not, and reset the preventSelectionChangedFlag
		 * @return {Boolean} true if aloha-selection-change event was prevented
		 */
		isSelectionChangedPrevented: function () {
			var prevented = this.preventSelectionChangedFlag;
			this.preventSelectionChangedFlag = false;
			return prevented;
		},
		
		/**
		 * Checks if the current rangeObject common ancector container is edtiable
		 * @return {Boolean} true if current common ancestor is editable
		 */
		isSelectionEditable: function() {
			return ( this.rangeObject.commonAncestorContainer &&
						jQuery( this.rangeObject.commonAncestorContainer )
							.contentEditable() );
		},

		/**
		 * This method checks, if the current rangeObject common ancestor container has a 'data-aloha-floatingmenu-visible' Attribute.
		 * Needed in Floating Menu for exceptional display of floatingmenu.
		 */
		isFloatingMenuVisible: function() {
			var visible = jQuery(Aloha.Selection.rangeObject
				.commonAncestorContainer).attr('data-aloha-floatingmenu-visible');
			if(visible !== 'undefined'){
				if (visible === 'true'){
					return true;
				} else {
					return false;
				}
			}
			return false;
		},

		/**
		 * INFO: Method is used for integration with Gentics Aloha, has no use otherwise
		 * Updates the rangeObject according to the current user selection
		 * Method is always called on selection change
		 * @param event jQuery browser event object
		 * @return true when rangeObject was modified, false otherwise
		 * @hide
		 */
		updateSelection: function(event) {
			return this._updateSelection(event, null);
		},

		/**
		 * Internal version of updateSelection that adds the range parameter to be
		 * able to work around an IE bug that caused the current user selection
		 * sometimes to be on the body element.
		 * @param {Object} event
		 * @param {Object} range a substitute for the current user selection. if not provided,
		 *   the current user selection will be used.
		 * @hide
		 */
		_updateSelection: function( event, range ) {
			if ( event && event.originalEvent
			     && event.originalEvent.stopSelectionUpdate === true ) {
				return false;
			}

			if ( typeof range === 'undefined' ) {
				return false;
			}

			this.rangeObject = range || new Aloha.Selection.SelectionRange( true );
			
			// Only execute the workaround when a valid rangeObject was provided
			if ( typeof this.rangeObject !== "undefined" && typeof this.rangeObject.startContainer !== "undefined" && this.rangeObject.endContainer !== "undefined") {
				// workaround for a nasty IE bug that allows the user to select text nodes inside areas with contenteditable "false"
				if ( (this.rangeObject.startContainer.nodeType === 3 && !jQuery(this.rangeObject.startContainer.parentNode).contentEditable())
						|| (this.rangeObject.endContainer.nodeType === 3 && !jQuery(this.rangeObject.endContainer.parentNode).contentEditable())) {
					Aloha.getSelection().removeAllRanges();
					return true;
				}
			} 
			
			// find the CAC (Common Ancestor Container) and update the selection Tree
			this.rangeObject.update();

			// check if aloha-selection-changed event has been prevented
			if (this.isSelectionChangedPrevented()) {
				return true;
			}

			// Only set the specific scope if an event was provided, which means
			// that somehow an editable was selected
			// TODO Bind code to aloha-selection-changed event to remove coupling to floatingmenu
			if (event !== undefined) {
				// Initiallly set the scope to 'continuoustext'
				FloatingMenu.setScope('Aloha.continuoustext');
			}

			// throw the event that the selection has changed. Plugins now have the
			// chance to react on the chancurrentElements[childCount].children.lengthged selection
			Aloha.trigger('aloha-selection-changed', [ this.rangeObject, event ]);

			return true;
		},

		/**
		 * creates an object with x items containing all relevant dom objects.
		 * Structure:
		 * +
		 * |-domobj: <reference to the DOM Object> (NOT jQuery)
		 * |-selection: defines if this node is marked by user [none|partial|full]
		 * |-children: recursive structure like this ("x.." because it's then shown last in DOM Browsers...)
		 * TODO: remove this (was moved to range.js)
		 *
		 * @param rangeObject "Aloha clean" range object including a commonAncestorContainer
		 * @return obj selection
		 * @hide
		 */
		getSelectionTree: function(rangeObject) {
			if (!rangeObject) { // if called without any parameters, the method acts as getter for this.selectionTree
				return this.rangeObject.getSelectionTree();
			}
			if (!rangeObject.commonAncestorContainer) {
				Aloha.Log.error(this, 'the rangeObject is missing the commonAncestorContainer');
				return false;
			}

			this.inselection = false;

			// before getting the selection tree, we do a cleanup
			if (GENTICS.Utils.Dom.doCleanup({'merge' : true}, rangeObject)) {
				this.rangeObject.update();
				this.rangeObject.select();
			}

			return this.recursiveGetSelectionTree(rangeObject, rangeObject.commonAncestorContainer);
		},

		/**
		 * Recursive inner function for generating the selection tree.
		 * TODO: remove this (was moved to range.js)
		 * @param rangeObject range object
		 * @param currentObject current DOM object for which the selection tree shall be generated
		 * @return array of SelectionTree objects for the children of the current DOM object
		 * @hide
		 */
		recursiveGetSelectionTree: function (rangeObject, currentObject) {
			// get all direct children of the given object
			var jQueryCurrentObject = jQuery(currentObject),
				childCount = 0,
				that = this,
				currentElements = [];

			jQueryCurrentObject.contents().each(function(index) {
				var selectionType = 'none',
					startOffset = false,
					endOffset = false,
					collapsedFound = false,
					i, elementsLength,
					noneFound = false,
					partialFound = false,
					fullFound = false;

				// check for collapsed selections between nodes
				if (rangeObject.isCollapsed() && currentObject === rangeObject.startContainer && rangeObject.startOffset == index) {
					// insert an extra selectiontree object for the collapsed selection here
					currentElements[childCount] = new Aloha.Selection.SelectionTree();
					currentElements[childCount].selection = 'collapsed';
					currentElements[childCount].domobj = undefined;
					that.inselection = false;
					collapsedFound = true;
					childCount++;
				}

				if (!that.inselection && !collapsedFound) {
					// the start of the selection was not yet found, so look for it now
					// check whether the start of the selection is found here

					// check is dependent on the node type
					switch(this.nodeType) {
					case 3: // text node
						if (this === rangeObject.startContainer) {
							// the selection starts here
							that.inselection = true;

							// when the startoffset is > 0, the selection type is only partial
							selectionType = rangeObject.startOffset > 0 ? 'partial' : 'full';
							startOffset = rangeObject.startOffset;
							endOffset = this.length;
						}
						break;
					case 1: // element node
						if (this === rangeObject.startContainer && rangeObject.startOffset === 0) {
							// the selection starts here
							that.inselection = true;
							selectionType = 'full';
						}
						if (currentObject === rangeObject.startContainer && rangeObject.startOffset === index) {
							// the selection starts here
							that.inselection = true;
							selectionType = 'full';
						}
						break;
					}
				}

				if (that.inselection && !collapsedFound) {
					if (selectionType == 'none') {
						selectionType = 'full';
					}
					// we already found the start of the selection, so look for the end of the selection now
					// check whether the end of the selection is found here

					switch(this.nodeType) {
					case 3: // text node
						if (this === rangeObject.endContainer) {
							// the selection ends here
							that.inselection = false;

							// check for partial selection here
							if (rangeObject.endOffset < this.length) {
								selectionType = 'partial';
							}
							if (startOffset === false) {
								startOffset = 0;
							}
							endOffset = rangeObject.endOffset;
						}
						break;
					case 1: // element node
						if (this === rangeObject.endContainer && rangeObject.endOffset === 0) {
							that.inselection = false;
						}
						break;
					}
					if (currentObject === rangeObject.endContainer && rangeObject.endOffset <= index) {
						that.inselection = false;
						selectionType = 'none';
					}
				}

				// create the current selection tree entry
				currentElements[childCount] = new Aloha.Selection.SelectionTree();
				currentElements[childCount].domobj = this;
				currentElements[childCount].selection = selectionType;
				if (selectionType == 'partial') {
					currentElements[childCount].startOffset = startOffset;
					currentElements[childCount].endOffset = endOffset;
				}

				// now do the recursion step into the current object
				currentElements[childCount].children = that.recursiveGetSelectionTree(rangeObject, this);
				elementsLength = currentElements[childCount].children.length;

				// check whether a selection was found within the children
				if (elementsLength > 0) {
					for ( i = 0; i < elementsLength; ++i) {
						switch(currentElements[childCount].children[i].selection) {
						case 'none':
							noneFound = true;
							break;
						case 'full':
							fullFound = true;
							break;
						case 'partial':
							partialFound = true;
							break;
						}
					}

					if (partialFound || (fullFound && noneFound)) {
						// found at least one 'partial' selection in the children, or both 'full' and 'none', so this element is also 'partial' selected
						currentElements[childCount].selection = 'partial';
					} else if (fullFound && !partialFound && !noneFound) {
						// only found 'full' selected children, so this element is also 'full' selected
						currentElements[childCount].selection = 'full';
					}
				}

				childCount++;
			});

			// extra check for collapsed selections at the end of the current element
			if (rangeObject.isCollapsed()
					&& currentObject === rangeObject.startContainer
					&& rangeObject.startOffset == currentObject.childNodes.length) {
				currentElements[childCount] = new Aloha.Selection.SelectionTree();
				currentElements[childCount].selection = 'collapsed';
				currentElements[childCount].domobj = undefined;
			}

			return currentElements;
		},

		/**
		 * Get the currently selected range
		 * @return {Aloha.Selection.SelectionRange} currently selected range
		 * @method
		 */
		getRangeObject: function() {
			return this.rangeObject;
		},

		/**
		 * method finds out, if a node is within a certain markup or not
		 * @param rangeObj Aloha rangeObject
		 * @param startOrEnd boolean; defines, if start or endContainer should be used: false for start, true for end
		 * @param markupObject jQuery object of the markup to look for
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @param limitObject dom object which limits the search are within the dom. normally this will be the active Editable
		 * @return true, if the markup is effective on the range objects start or end node
		 * @hide
		 */
		isRangeObjectWithinMarkup: function(rangeObject, startOrEnd, markupObject, tagComparator, limitObject) {
			var
				domObj = !startOrEnd?rangeObject.startContainer:rangeObject.endContainer,
				that = this,
				parents = jQuery(domObj).parents(),
				returnVal = false,
				i = -1;
			
			// check if a comparison method was passed as parameter ...
			if (typeof tagComparator !== 'undefined' && typeof tagComparator !== 'function') {
				Aloha.Log.error(this,'parameter tagComparator is not a function');
			}
			// ... if not use this as standard tag comparison method
			if (typeof tagComparator === 'undefined') {
				tagComparator = function(domobj, markupObject) {
					return that.standardTextLevelSemanticsComparator(domobj, markupObject); // TODO should actually be this.getStandardTagComparator(markupObject)
				};
			}
		
			if (parents.length > 0) {
				parents.each(function() {
					// the limit object was reached (normally the Editable Element)
					if (this === limitObject) {
						Aloha.Log.debug(that,'reached limit dom obj');
						return false; // break() of jQuery .each(); THIS IS NOT THE FUNCTION RETURN VALUE
					}
					if (tagComparator(this, markupObject)) {
						if (returnVal === false) {
							returnVal = [];
						}
						Aloha.Log.debug(that,'reached object equal to markup');
						i++;
						returnVal[i] = this;
						return true; // continue() of jQuery .each(); THIS IS NOT THE FUNCTION RETURN VALUE
					}
				});
			}
			return returnVal;
		},

		/**
		 * standard method, to compare a domobj and a jquery object for sections and grouping content (e.g. p, h1, h2, ul, ....).
		 * is always used when no other tag comparator is passed as parameter
		 * @param domobj domobject to compare with markup
		 * @param markupObject jQuery object of the markup to compare with domobj
		 * @return true if objects are equal and false if not
		 * @hide
		 */
		standardSectionsAndGroupingContentComparator: function(domobj, markupObject) {
			if  (domobj.nodeType === 1) {
				if (markupObject[0].tagName && Aloha.Selection.replacingElements[ domobj.tagName.toLowerCase() ] && Aloha.Selection.replacingElements[ domobj.tagName.toLowerCase() ].indexOf(markupObject[0].tagName.toLowerCase()) != -1) {
					return true;
				}
			} else {
				Aloha.Log.debug(this,'only element nodes (nodeType == 1) can be compared');
			}
			return false;
		},

		/**
		 * standard method, to compare a domobj and a jquery object for their tagName (aka span elements, e.g. b, i, sup, span, ...).
		 * is always used when no other tag comparator is passed as parameter
		 * @param domobj domobject to compare with markup
		 * @param markupObject jQuery object of the markup to compare with domobj
		 * @return true if objects are equal and false if not
		 * @hide
		 */
		standardTagNameComparator : function(domobj, markupObject) {
			if  (domobj.nodeType === 1) {
				if (domobj.tagName.toLowerCase() != markupObject[0].tagName.toLowerCase()) {
					//			Aloha.Log.debug(this, 'tag comparison for <' + domobj.tagName.toLowerCase() + '> and <' + markupObject[0].tagName.toLowerCase() + '> failed because tags are different');
					return false;
				}
				return true;//domobj.attributes.length
			} else {
				Aloha.Log.debug(this,'only element nodes (nodeType == 1) can be compared');
			}
			return false;
		},
		
		/**
		 * standard method, to compare a domobj and a jquery object for text level semantics (aka span elements, e.g. b, i, sup, span, ...).
		 * is always used when no other tag comparator is passed as parameter
		 * @param domobj domobject to compare with markup
		 * @param markupObject jQuery object of the markup to compare with domobj
		 * @return true if objects are equal and false if not
		 * @hide
		 */
		standardTextLevelSemanticsComparator: function(domobj, markupObject) {
			// only element nodes can be compared
			if  (domobj.nodeType === 1) {
				if (domobj.tagName.toLowerCase() != markupObject[0].tagName.toLowerCase()) {
		//			Aloha.Log.debug(this, 'tag comparison for <' + domobj.tagName.toLowerCase() + '> and <' + markupObject[0].tagName.toLowerCase() + '> failed because tags are different');
					return false;
				}
				if (!this.standardAttributesComparator(domobj, markupObject)) {
					return false;
				}
				return true;//domobj.attributes.length
			} else {
				Aloha.Log.debug(this,'only element nodes (nodeType == 1) can be compared');
			}
			return false;
		},


		/**
		 * standard method, to compare attributes of one dom obj and one markup obj (jQuery)
		 * @param domobj domobject to compare with markup
		 * @param markupObject jQuery object of the markup to compare with domobj
		 * @return true if objects are equal and false if not
		 * @hide
		 */
		standardAttributesComparator: function(domobj, markupObject) {
			var i, attr, classString, classes, classes2, classLength, attrLength, domAttrLength;

			// Cloning the domobj works around an IE7 bug that crashes
			// the browser. The exact place where IE7 crashes is when
			// the domobj.attribute[i] is read below.
			// The bug can be reproduced with an editable that contains
			// some text and and image, by clicking inside and outside the
			// editable a few times.
			domobj = domobj.cloneNode(false);

			if (domobj.attributes && domobj.attributes.length && domobj.attributes.length > 0) {
				for (i = 0, domAttrLength = domobj.attributes.length; i < domAttrLength; i++) {
					// Dereferencing attributes[i] here would crash IE7 if domobj were not cloned above
					attr = domobj.attributes[i];
					if (attr.nodeName.toLowerCase() == 'class' && attr.nodeValue.length > 0) {
						classString = attr.nodeValue;
						classes = classString.split(' ');
					}
				}
			}

			if (markupObject[0].attributes && markupObject[0].attributes.length && markupObject[0].attributes.length > 0) {
				for (i = 0, attrLength = markupObject[0].attributes.length; i < attrLength; i++) {
					attr = markupObject[0].attributes[i];
					if (attr.nodeName.toLowerCase() == 'class' && attr.nodeValue.length > 0) {
						classString = attr.nodeValue;
						classes2 = classString.split(' ');
					}
				}
			}

			if (classes && !classes2 || classes2 && !classes) {
				Aloha.Log.debug(this, 'tag comparison for <' + domobj.tagName.toLowerCase() + '> failed because one element has classes and the other has not');
				return false;
			}
			if (classes && classes2 && classes.length != classes2.length) {
				Aloha.Log.debug(this, 'tag comparison for <' + domobj.tagName.toLowerCase() + '> failed because of a different amount of classes');
				return false;
			}
			if (classes && classes2 && classes.length === classes2.length && classes.length !== 0) {
				for (i = 0, classLength = classes.length; i < classLength; i++) {
					if (!markupObject.hasClass(classes[ i ])) {
						Aloha.Log.debug(this, 'tag comparison for <' + domobj.tagName.toLowerCase() + '> failed because of different classes');
						return false;
					}
				}
			}
			return true;
		},

		/**
		 * method finds out, if a node is within a certain markup or not
		 * @param rangeObj Aloha rangeObject
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return void; TODO: should return true if the markup applied successfully and false if not
		 * @hide
		 */
		changeMarkup: function(rangeObject, markupObject, tagComparator) {
			var
				tagName = markupObject[0].tagName.toLowerCase(),
				newCAC, limitObject,
				backupRangeObject,
				relevantMarkupObjectsAtSelectionStart = this.isRangeObjectWithinMarkup(rangeObject, false, markupObject, tagComparator, limitObject),
				relevantMarkupObjectsAtSelectionEnd = this.isRangeObjectWithinMarkup(rangeObject, true, markupObject, tagComparator, limitObject),
				nextSibling, relevantMarkupObjectAfterSelection,
				prevSibling, relevantMarkupObjectBeforeSelection,
				extendedRangeObject;

			// if the element is a replacing element (like p/h1/h2/h3/h4/h5/h6...), which must not wrap each other
			// use a clone of rangeObject
			if (this.replacingElements[ tagName ]) {
				// backup rangeObject for later selection;
				backupRangeObject = rangeObject;

				// create a new range object to not modify the orginal
				rangeObject = new this.SelectionRange(rangeObject);

				// either select the active Editable as new commonAncestorContainer (CAC) or use the body
				if (Aloha.activeEditable) {
					newCAC= Aloha.activeEditable.obj.get(0);
				} else {
					newCAC = jQuery('body');
				}
				// update rangeObject by setting the newCAC and automatically recalculating the selectionTree
				rangeObject.update(newCAC);

				// store the information, that the markupObject can be replaced (not must be!!) inside the jQuery markup object
				markupObject.isReplacingElement = true;
			}
			// if the element is NOT a replacing element, then something needs to be selected, otherwise it can not be wrapped
			// therefor the method can return false, if nothing is selected ( = rangeObject is collapsed)
			else {
				if (rangeObject.isCollapsed()) {
					Aloha.Log.debug(this, 'early returning from applying markup because nothing is currently selected');
					return false;
				}
			}

			// is Start/End DOM Obj inside the markup to change
			if (Aloha.activeEditable) {
				limitObject = Aloha.activeEditable.obj[0];
			} else {
				limitObject = jQuery('body');
			}

			if (!markupObject.isReplacingElement && rangeObject.startOffset === 0) { // don't care about replacers, because they never extend
				if (prevSibling = this.getTextNodeSibling(false, rangeObject.commonAncestorContainer.parentNode, rangeObject.startContainer)) {
					relevantMarkupObjectBeforeSelection = this.isRangeObjectWithinMarkup({startContainer : prevSibling, startOffset : 0}, false, markupObject, tagComparator, limitObject);
				}
			}
			if (!markupObject.isReplacingElement && (rangeObject.endOffset === rangeObject.endContainer.length)) { // don't care about replacers, because they never extend
				if (nextSibling = this.getTextNodeSibling(true, rangeObject.commonAncestorContainer.parentNode, rangeObject.endContainer)) {
					relevantMarkupObjectAfterSelection = this.isRangeObjectWithinMarkup({startContainer: nextSibling, startOffset: 0}, false, markupObject, tagComparator, limitObject);
				}
			}

			// decide what to do (expand or reduce markup)
			// Alternative A: from markup to no-markup: markup will be removed in selection;
			// reapplied from original markup start to selection start
			if (!markupObject.isReplacingElement && (relevantMarkupObjectsAtSelectionStart && !relevantMarkupObjectsAtSelectionEnd)) {
				Aloha.Log.info(this, 'markup 2 non-markup');
				this.prepareForRemoval(rangeObject.getSelectionTree(), markupObject, tagComparator);
				jQuery(relevantMarkupObjectsAtSelectionStart).addClass('preparedForRemoval');
				this.insertCroppedMarkups(relevantMarkupObjectsAtSelectionStart, rangeObject, false, tagComparator);
			}

			// Alternative B: from markup to markup:
			// remove selected markup (=split existing markup if single, shrink if two different)
			else if (!markupObject.isReplacingElement && relevantMarkupObjectsAtSelectionStart && relevantMarkupObjectsAtSelectionEnd) {
				Aloha.Log.info(this, 'markup 2 markup');
				this.prepareForRemoval(rangeObject.getSelectionTree(), markupObject, tagComparator);
				this.splitRelevantMarkupObject(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd, rangeObject, tagComparator);
			}

			// Alternative C: from no-markup to markup OR with next2markup:
			// new markup is wrapped from selection start to end of originalmarkup, original is remove afterwards
			else if (!markupObject.isReplacingElement && ((!relevantMarkupObjectsAtSelectionStart && relevantMarkupObjectsAtSelectionEnd) || relevantMarkupObjectAfterSelection || relevantMarkupObjectBeforeSelection )) { //
				Aloha.Log.info(this, 'non-markup 2 markup OR with next2markup');
				// move end of rangeObject to end of relevant markups
				if (relevantMarkupObjectBeforeSelection && relevantMarkupObjectAfterSelection) {
					extendedRangeObject = new Aloha.Selection.SelectionRange(rangeObject);
					extendedRangeObject.startContainer = jQuery(relevantMarkupObjectBeforeSelection[ relevantMarkupObjectBeforeSelection.length-1 ]).textNodes()[0];
					extendedRangeObject.startOffset = 0;
					extendedRangeObject.endContainer = jQuery(relevantMarkupObjectAfterSelection[ relevantMarkupObjectAfterSelection.length-1 ]).textNodes().last()[0];
					extendedRangeObject.endOffset = extendedRangeObject.endContainer.length;
					extendedRangeObject.update();
					this.applyMarkup(extendedRangeObject.getSelectionTree(), rangeObject, markupObject, tagComparator);
					Aloha.Log.info(this, 'double extending previous markup(previous and after selection), actually wrapping it ...');

				} else if (relevantMarkupObjectBeforeSelection && !relevantMarkupObjectAfterSelection && !relevantMarkupObjectsAtSelectionEnd) {
					this.extendExistingMarkupWithSelection(relevantMarkupObjectBeforeSelection, rangeObject, false, tagComparator);
					Aloha.Log.info(this, 'extending previous markup');

				} else if (relevantMarkupObjectBeforeSelection && !relevantMarkupObjectAfterSelection && relevantMarkupObjectsAtSelectionEnd) {
					extendedRangeObject = new Aloha.Selection.SelectionRange(rangeObject);
					extendedRangeObject.startContainer = jQuery(relevantMarkupObjectBeforeSelection[ relevantMarkupObjectBeforeSelection.length-1 ]).textNodes()[0];
					extendedRangeObject.startOffset = 0;
					extendedRangeObject.endContainer = jQuery(relevantMarkupObjectsAtSelectionEnd[ relevantMarkupObjectsAtSelectionEnd.length-1 ]).textNodes().last()[0];
					extendedRangeObject.endOffset = extendedRangeObject.endContainer.length;
					extendedRangeObject.update();
					this.applyMarkup(extendedRangeObject.getSelectionTree(), rangeObject, markupObject, tagComparator);
					Aloha.Log.info(this, 'double extending previous markup(previous and relevant at the end), actually wrapping it ...');

				} else if (!relevantMarkupObjectBeforeSelection && relevantMarkupObjectAfterSelection) {
					this.extendExistingMarkupWithSelection(relevantMarkupObjectAfterSelection, rangeObject, true, tagComparator);
					Aloha.Log.info(this, 'extending following markup backwards');

				} else {
					this.extendExistingMarkupWithSelection(relevantMarkupObjectsAtSelectionEnd, rangeObject, true, tagComparator);
				}
			}

			// Alternative D: no-markup to no-markup: easy
			else if (markupObject.isReplacingElement || (!relevantMarkupObjectsAtSelectionStart && !relevantMarkupObjectsAtSelectionEnd && !relevantMarkupObjectBeforeSelection && !relevantMarkupObjectAfterSelection)) {
				Aloha.Log.info(this, 'non-markup 2 non-markup');
				this.applyMarkup(rangeObject.getSelectionTree(), rangeObject, markupObject, tagComparator, {setRangeObject2NewMarkup: true});
			}

			// remove all marked items
			jQuery('.preparedForRemoval').zap();

			// recalculate cac and selectionTree
			rangeObject.update();

			// update selection
			if (markupObject.isReplacingElement) {
		//		this.setSelection(backupRangeObject, true);
				backupRangeObject.select();
			} else {
		//		this.setSelection(rangeObject);
				rangeObject.select();
			}
		},

		/**
		 * method compares a JS array of domobjects with a range object and decides, if the rangeObject spans the whole markup objects. method is used to decide if a markup2markup selection can be completely remove or if it must be splitted into 2 separate markups
		 * @param relevantMarkupObjectsAtSelectionStart JS Array of dom objects, which are parents to the rangeObject.startContainer
		 * @param relevantMarkupObjectsAtSelectionEnd JS Array of dom objects, which are parents to the rangeObject.endContainer
		 * @param rangeObj Aloha rangeObject
		 * @return true, if rangeObjects and markup objects are identical, false otherwise
		 * @hide
		 */
		areMarkupObjectsAsLongAsRangeObject: function(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd, rangeObject) {
			var i, el, textNode, relMarkupEnd, relMarkupStart;

			if (rangeObject.startOffset !== 0) {
				return false;
			}

			for (i = 0, relMarkupStart = relevantMarkupObjectsAtSelectionStart.length; i < relMarkupStart; i++) {
				el = jQuery(relevantMarkupObjectsAtSelectionStart[i]);
				if (el.textNodes().first()[0] !== rangeObject.startContainer) {
					return false;
				}
			}

			for (i = 0, relMarkupEnd = relevantMarkupObjectsAtSelectionEnd.length; i < relMarkupEnd; i++) {
				el = jQuery(relevantMarkupObjectsAtSelectionEnd[i]);
				textNode = el.textNodes().last()[0];
				if (textNode !== rangeObject.endContainer || textNode.length != rangeObject.endOffset) {
					return false;
				}
			}

			return true;
		},

		/**
		 * method used to remove/split markup from a "markup2markup" selection
		 * @param relevantMarkupObjectsAtSelectionStart JS Array of dom objects, which are parents to the rangeObject.startContainer
		 * @param relevantMarkupObjectsAtSelectionEnd JS Array of dom objects, which are parents to the rangeObject.endContainer
		 * @param rangeObj Aloha rangeObject
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return true (always, since no "false" case is currently known...but might be added)
		 * @hide
		 */
		splitRelevantMarkupObject: function(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd, rangeObject, tagComparator) {
			// mark them to be deleted
			jQuery(relevantMarkupObjectsAtSelectionStart).addClass('preparedForRemoval');
			jQuery(relevantMarkupObjectsAtSelectionEnd).addClass('preparedForRemoval');

			// check if the rangeObject is identical with the relevantMarkupObjects (in this case the markup can simply be removed)
			if (this.areMarkupObjectsAsLongAsRangeObject(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd, rangeObject)) {
				return true;
			}

			// find intersection (this can always only be one dom element (namely the highest) because all others will be removed
			var relevantMarkupObjectAtSelectionStartAndEnd = this.intersectRelevantMarkupObjects(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd);

			if (relevantMarkupObjectAtSelectionStartAndEnd) {
				this.insertCroppedMarkups([relevantMarkupObjectAtSelectionStartAndEnd], rangeObject, false, tagComparator);
				this.insertCroppedMarkups([relevantMarkupObjectAtSelectionStartAndEnd], rangeObject, true, tagComparator);
			} else {
				this.insertCroppedMarkups(relevantMarkupObjectsAtSelectionStart, rangeObject, false, tagComparator);
				this.insertCroppedMarkups(relevantMarkupObjectsAtSelectionEnd, rangeObject, true, tagComparator);
			}
			return true;
		},

		/**
		 * method takes two arrays of bottom up dom objects, compares them and returns either the object closest to the root or false
		 * @param relevantMarkupObjectsAtSelectionStart JS Array of dom objects
		 * @param relevantMarkupObjectsAtSelectionEnd JS Array of dom objects
		 * @return dom object closest to the root or false
		 * @hide
		 */
		intersectRelevantMarkupObjects: function(relevantMarkupObjectsAtSelectionStart, relevantMarkupObjectsAtSelectionEnd) {
			var intersection = false, i, elStart, j, elEnd, relMarkupStart, relMarkupEnd;
			if (!relevantMarkupObjectsAtSelectionStart || !relevantMarkupObjectsAtSelectionEnd) {
				return intersection; // we can only intersect, if we have to arrays!
			}
			relMarkupStart = relevantMarkupObjectsAtSelectionStart.length;
			relMarkupEnd = relevantMarkupObjectsAtSelectionEnd.length;
			for (i = 0; i < relMarkupStart; i++) {
				elStart = relevantMarkupObjectsAtSelectionStart[i];
				for (j = 0; j < relMarkupEnd; j++) {
					elEnd = relevantMarkupObjectsAtSelectionEnd[j];
					if (elStart === elEnd) {
						intersection = elStart;
					}
				}
			}
			return intersection;
		},

		/**
		 * method used to add markup to a nonmarkup2markup selection
		 * @param relevantMarkupObjects JS Array of dom objects effecting either the start or endContainer of a selection (which should be extended)
		 * @param rangeObject Aloha rangeObject the markups should be extended to
		 * @param startOrEnd boolean; defines, if the existing markups should be extended forwards or backwards (is propably redundant and could be found out by comparing start or end container with the markup array dom objects)
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return true
		 * @hide
		 */
		extendExistingMarkupWithSelection: function(relevantMarkupObjects, rangeObject, startOrEnd, tagComparator) {
			var extendMarkupsAtStart, extendMarkupsAtEnd, objects, i, relMarkupLength, el, textnodes, nodeNr;
			if (!startOrEnd) { // = Start
				// start part of rangeObject should be used, therefor existing markups are cropped at the end
				extendMarkupsAtStart = true;
			}
			if (startOrEnd) { // = End
				// end part of rangeObject should be used, therefor existing markups are cropped at start (beginning)
				extendMarkupsAtEnd = true;
			}
			objects = [];
			for( i = 0, relMarkupLength = relevantMarkupObjects.length; i < relMarkupLength; i++){
				objects[i] = new this.SelectionRange();
				el = relevantMarkupObjects[i];
				if (extendMarkupsAtEnd && !extendMarkupsAtStart) {
					objects[i].startContainer = rangeObject.startContainer; // jQuery(el).contents()[0];
					objects[i].startOffset = rangeObject.startOffset;
					textnodes = jQuery(el).textNodes(true);

					nodeNr = textnodes.length - 1;
					objects[i].endContainer = textnodes[ nodeNr ];
					objects[i].endOffset = textnodes[ nodeNr ].length;
					objects[i].update();
					this.applyMarkup(objects[i].getSelectionTree(), rangeObject, this.getClonedMarkup4Wrapping(el), tagComparator, {setRangeObject2NewMarkup: true});
				}
				if (!extendMarkupsAtEnd && extendMarkupsAtStart) {
					textnodes = jQuery(el).textNodes(true);
					objects[i].startContainer = textnodes[0]; // jQuery(el).contents()[0];
					objects[i].startOffset = 0;
					objects[i].endContainer = rangeObject.endContainer;
					objects[i].endOffset = rangeObject.endOffset;
					objects[i].update();
					this.applyMarkup(objects[i].getSelectionTree(), rangeObject, this.getClonedMarkup4Wrapping(el), tagComparator, {setRangeObject2NewMarkup: true});
				}
			}
			return true;
		},

		/**
		 * method creates an empty markup jQuery object from a dom object passed as paramter
		 * @param domobj domobject to be cloned, cleaned and emptied
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return jQuery wrapper object to be passed to e.g. this.applyMarkup(...)
		 * @hide
		 */
		getClonedMarkup4Wrapping: function(domobj) {
			var wrapper = jQuery(domobj).clone().removeClass('preparedForRemoval').empty();
			if (wrapper.attr('class').length === 0) {
				wrapper.removeAttr('class');
			}
			return wrapper;
		},

		/**
		 * method used to subtract the range object from existing markup. in other words: certain markup is removed from the selections defined by the rangeObject
		 * @param relevantMarkupObjects JS Array of dom objects effecting either the start or endContainer of a selection (which should be extended)
		 * @param rangeObject Aloha rangeObject the markups should be removed from
		 * @param startOrEnd boolean; defines, if the existing markups should be reduced at the beginning of the tag or at the end (is propably redundant and could be found out by comparing start or end container with the markup array dom objects)
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return true
		 * @hide
		 */
		insertCroppedMarkups: function(relevantMarkupObjects, rangeObject, startOrEnd, tagComparator) {
			var cropMarkupsAtEnd,cropMarkupsAtStart,textnodes,objects,i,el,textNodes;
			if (!startOrEnd) { // = Start
				// start part of rangeObject should be used, therefor existing markups are cropped at the end
				cropMarkupsAtEnd = true;
			} else { // = End
				// end part of rangeObject should be used, therefor existing markups are cropped at start (beginning)
				cropMarkupsAtStart = true;
			}
			objects = [];
			for( i = 0; i<relevantMarkupObjects.length; i++){
				objects[i] = new this.SelectionRange();
				el = relevantMarkupObjects[i];
				if (cropMarkupsAtEnd && !cropMarkupsAtStart) {
					textNodes = jQuery(el).textNodes(true);
					objects[i].startContainer = textNodes[0];
					objects[i].startOffset = 0;
					// if the existing markup startContainer & startOffset are equal to the rangeObject startContainer and startOffset,
					// then markupobject does not have to be added again, because it would have no content (zero-length)
					if (objects[i].startContainer === rangeObject.startContainer && objects[i].startOffset === rangeObject.startOffset) {
						continue;
					}
					if (rangeObject.startOffset === 0) {
						objects[i].endContainer = this.getTextNodeSibling(false, el, rangeObject.startContainer);
						objects[i].endOffset = objects[i].endContainer.length;
					} else {
						objects[i].endContainer = rangeObject.startContainer;
						objects[i].endOffset = rangeObject.startOffset;
					}

					objects[i].update();

					this.applyMarkup(objects[i].getSelectionTree(), rangeObject, this.getClonedMarkup4Wrapping(el), tagComparator, {setRangeObject2NextSibling: true});
				}

				if (!cropMarkupsAtEnd && cropMarkupsAtStart) {
					objects[i].startContainer = rangeObject.endContainer; // jQuery(el).contents()[0];
					objects[i].startOffset = rangeObject.endOffset;
					textnodes = jQuery(el).textNodes(true);
					objects[i].endContainer = textnodes[ textnodes.length-1 ];
					objects[i].endOffset = textnodes[ textnodes.length-1 ].length;
					objects[i].update();
					this.applyMarkup(objects[i].getSelectionTree(), rangeObject, this.getClonedMarkup4Wrapping(el), tagComparator, {setRangeObject2PreviousSibling: true});
				}
			}
			return true;
		},

		/**
		 * apply a certain markup to the current selection
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @return void
		 * @hide
		 */
		changeMarkupOnSelection: function(markupObject) {
			// change the markup
			this.changeMarkup(this.getRangeObject(), markupObject, this.getStandardTagComparator(markupObject));

			// merge text nodes

			GENTICS.Utils.Dom.doCleanup({'merge' : true}, this.rangeObject);
			// update the range and select it
			this.rangeObject.update();
			this.rangeObject.select();
		},

		/**
		 * apply a certain markup to the selection Tree
		 * @param selectionTree SelectionTree Object markup should be applied to
		 * @param rangeObject Aloha rangeObject which will be modified to reflect the dom changes, after the markup was applied (only if activated via options)
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @param options JS object, with the following boolean properties: setRangeObject2NewMarkup, setRangeObject2NextSibling, setRangeObject2PreviousSibling
		 * @return void
		 * @hide
		 */
		applyMarkup: function(selectionTree, rangeObject, markupObject, tagComparator, options) {
			var optimizedSelectionTree, i, el, breakpoint;

			options = options ? options : {};
			// first same tags from within fully selected nodes for removal
			this.prepareForRemoval(selectionTree, markupObject, tagComparator);

			// first let's optimize the selection Tree in useful groups which can be wrapped together
			optimizedSelectionTree = this.optimizeSelectionTree4Markup(selectionTree, markupObject, tagComparator);
			breakpoint = true;

			// now iterate over grouped elements and either recursively dive into object or wrap it as a whole
			for ( i = 0; i < optimizedSelectionTree.length; i++) {
				 el = optimizedSelectionTree[i];
				if (el.wrappable) {
					this.wrapMarkupAroundSelectionTree(el.elements, rangeObject, markupObject, tagComparator, options);
				} else {
					Aloha.Log.debug(this,'dive further into non-wrappable object');
					this.applyMarkup(el.element.children, rangeObject, markupObject, tagComparator, options);
				}
			}
		},

		/**
		 * returns the type of the given markup (trying to match HTML5)
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @return string name of the markup type
		 * @hide
		 */
		getMarkupType: function(markupObject) {
			var nn = jQuery(markupObject)[0].nodeName.toLowerCase();
			if (markupObject.outerHtml) {
				Aloha.Log.debug(this, 'Node name detected: ' + nn + ' for: ' + markupObject.outerHtml());
			}
			if (nn == '#text') {return 'textNode';}
			if (this.replacingElements[ nn ]) {return 'sectionOrGroupingContent';}
			if (this.tagHierarchy [ nn ]) {return 'textLevelSemantics';}
			Aloha.Log.warn(this, 'unknown markup passed to this.getMarkupType(...): ' + markupObject.outerHtml());
		},

		/**
		 * returns the standard tag comparator for the given markup object
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @return function tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @hide
		 */
		getStandardTagComparator: function(markupObject) {
			var that = this, result;
			switch(this.getMarkupType(markupObject)) {
				case 'textNode':
					result = function(p1, p2) {
						return false;
					};
					break;

				case 'sectionOrGroupingContent':
					result = function(domobj, markupObject) {
						return that.standardSectionsAndGroupingContentComparator(domobj, markupObject);
					};
					break;

				case 'textLevelSemantics':
				/* falls through */
				default:
					result = function(domobj, markupObject) {
						return that.standardTextLevelSemanticsComparator(domobj, markupObject);
					};
					break;
			}
			return result;
		},

		/**
		 * searches for fully selected equal markup tags
		 * @param selectionTree SelectionTree Object markup should be applied to
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @return void
		 * @hide
		 */
		prepareForRemoval: function(selectionTree, markupObject, tagComparator) {
			var that = this, i, el;

			// check if a comparison method was passed as parameter ...
			if (typeof tagComparator !== 'undefined' && typeof tagComparator !== 'function') {
				Aloha.Log.error(this,'parameter tagComparator is not a function');
			}
			// ... if not use this as standard tag comparison method
			if (typeof tagComparator === 'undefined') {
				tagComparator = this.getStandardTagComparator(markupObject);
			}
			for ( i = 0; i<selectionTree.length; i++) {
				el = selectionTree[i];
				if (el.domobj && (el.selection == 'full' || (el.selection == 'partial' && markupObject.isReplacingElement))) {
					// mark for removal
					if (el.domobj.nodeType === 1 && tagComparator(el.domobj, markupObject)) {
						Aloha.Log.debug(this, 'Marking for removal: ' + el.domobj.nodeName);
						jQuery(el.domobj).addClass('preparedForRemoval');
					}
				}
				if (el.selection != 'none' && el.children.length > 0) {
					this.prepareForRemoval(el.children, markupObject, tagComparator);
				}

			}
		},

		/**
		 * searches for fully selected equal markup tags
		 * @param selectionTree SelectionTree Object markup should be applied to
		 * @param rangeObject Aloha rangeObject the markup will be applied to
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @param tagComparator method, which is used to compare the dom object and the jQuery markup object. the method must accept 2 parameters, the first is the domobj, the second is the jquery object. if no method is specified, the method this.standardTextLevelSemanticsComparator is used
		 * @param options JS object, with the following boolean properties: setRangeObject2NewMarkup, setRangeObject2NextSibling, setRangeObject2PreviousSibling
		 * @return void
		 * @hide
		 */
		wrapMarkupAroundSelectionTree: function(selectionTree, rangeObject, markupObject, tagComparator, options) {
			// first let's find out if theoretically the whole selection can be wrapped with one tag and save it for later use
			var objects2wrap = [], // // this will be used later to collect objects
				j = -1, // internal counter,
				breakpoint = true,
				preText = '',
				postText = '',
				prevOrNext,
				textNode2Start,
				textnodes,
				newMarkup,
				i, el, middleText;



			Aloha.Log.debug(this,'The formatting <' + markupObject[0].tagName + '> will be wrapped around the selection');

			// now lets iterate over the elements
			for (i = 0; i < selectionTree.length; i++) {
				el = selectionTree[i];

				// check if markup is allowed inside the elements parent
				if (el.domobj && !this.canTag1WrapTag2(el.domobj.parentNode.tagName.toLowerCase(), markupObject[0].tagName.toLowerCase())) {
					Aloha.Log.info(this,'Skipping the wrapping of <' + markupObject[0].tagName.toLowerCase() + '> because this tag is not allowed inside <' + el.domobj.parentNode.tagName.toLowerCase() + '>');
					continue;
				}

				// skip empty text nodes
				if (el.domobj && el.domobj.nodeType === 3 && jQuery.trim(el.domobj.nodeValue).length === 0) {
					continue;
				}

				// partial element, can either be a textnode and therefore be wrapped (at least partially)
				// or can be a nodeType == 1 (tag) which must be dived into
				if (el.domobj && el.selection == 'partial' && !markupObject.isReplacingElement) {
					if (el.startOffset !== undefined && el.endOffset === undefined) {
						j++;
						preText += el.domobj.data.substr(0,el.startOffset);
						el.domobj.data = el.domobj.data.substr(el.startOffset, el.domobj.data.length-el.startOffset);
						objects2wrap[j] = el.domobj;
					} else if (el.endOffset !== undefined && el.startOffset === undefined) {
						j++;
						postText += el.domobj.data.substr(el.endOffset, el.domobj.data.length-el.endOffset);
						el.domobj.data = el.domobj.data.substr(0, el.endOffset);
						objects2wrap[j] = el.domobj;
					} else if (el.endOffset !== undefined && el.startOffset !== undefined) {
						if (el.startOffset == el.endOffset) { // do not wrap empty selections
							Aloha.Log.debug(this, 'skipping empty selection');
							continue;
						}
						j++;
						preText += el.domobj.data.substr(0,el.startOffset);
						middleText = el.domobj.data.substr(el.startOffset,el.endOffset-el.startOffset);
						postText += el.domobj.data.substr(el.endOffset, el.domobj.data.length-el.endOffset);
						el.domobj.data = middleText;
						objects2wrap[j] = el.domobj;
					} else {
						// a partially selected item without selectionStart/EndOffset is a nodeType 1 Element on the way to the textnode
						Aloha.Log.debug(this, 'diving into object');
						this.applyMarkup(el.children, rangeObject, markupObject, tagComparator, options);
					}
				}
				// fully selected dom elements can be wrapped as whole element
				if (el.domobj && (el.selection == 'full' || (el.selection == 'partial' && markupObject.isReplacingElement))) {
					j++;
					objects2wrap[j] = el.domobj;
				}
			}

			if (objects2wrap.length > 0) {
				// wrap collected DOM object with markupObject
				objects2wrap = jQuery(objects2wrap);

				// make a fix for text nodes in <li>'s in ie
				jQuery.each(objects2wrap, function(index, element) {
					if (jQuery.browser.msie && element.nodeType == 3
							&& !element.nextSibling && !element.previousSibling
							&& element.parentNode
							&& element.parentNode.nodeName.toLowerCase() == 'li') {
						element.data = jQuery.trim(element.data);
					}
				});

				newMarkup = objects2wrap.wrapAll(markupObject).parent();
				newMarkup.before(preText).after(postText);

				if (options.setRangeObject2NewMarkup) { // this is used, when markup is added to normal/normal Text
					textnodes = objects2wrap.textNodes();

					if (textnodes.index(rangeObject.startContainer) != -1) {
						rangeObject.startOffset = 0;
					}
					if (textnodes.index(rangeObject.endContainer) != -1) {
						rangeObject.endOffset = rangeObject.endContainer.length;
					}
					breakpoint=true;
				}
				if (options.setRangeObject2NextSibling){
					prevOrNext = true;
					textNode2Start = newMarkup.textNodes(true).last()[0];
					if (objects2wrap.index(rangeObject.startContainer) != -1) {
						rangeObject.startContainer = this.getTextNodeSibling(prevOrNext, newMarkup.parent(), textNode2Start);
						rangeObject.startOffset = 0;
					}
					if (objects2wrap.index(rangeObject.endContainer) != -1) {
						rangeObject.endContainer = this.getTextNodeSibling(prevOrNext, newMarkup.parent(), textNode2Start);
						rangeObject.endOffset = rangeObject.endOffset - textNode2Start.length;
					}
				}
				if (options.setRangeObject2PreviousSibling){
					prevOrNext = false;
					textNode2Start = newMarkup.textNodes(true).first()[0];
					if (objects2wrap.index(rangeObject.startContainer) != -1) {
						rangeObject.startContainer = this.getTextNodeSibling(prevOrNext, newMarkup.parent(), textNode2Start);
						rangeObject.startOffset = 0;
					}
					if (objects2wrap.index(rangeObject.endContainer) != -1) {
						rangeObject.endContainer = this.getTextNodeSibling(prevOrNext, newMarkup.parent(), textNode2Start);
						rangeObject.endOffset = rangeObject.endContainer.length;
					}
				}
			}
		},

		/**
		 * takes a text node and return either the next recursive text node sibling or the previous
		 * @param previousOrNext boolean, false for previous, true for next sibling
		 * @param commonAncestorContainer dom object to be used as root for the sibling search
		 * @param currentTextNode dom object of the originating text node
		 * @return dom object of the sibling text node
		 * @hide
		 */
		getTextNodeSibling: function(previousOrNext, commonAncestorContainer, currentTextNode) {
			var textNodes = jQuery(commonAncestorContainer).textNodes(true),
				newIndex, index;
			
			index = textNodes.index(currentTextNode);
			if (index == -1) { // currentTextNode was not found
				return false;
			}
			newIndex = index + (!previousOrNext ? -1 : 1);
			return textNodes[newIndex] ? textNodes[newIndex] : false;
		},

		/**
		 * takes a selection tree and groups it into markup wrappable selection trees
		 * @param selectionTree rangeObject selection tree
		 * @param markupObject jQuery object of the markup to be applied (e.g. created with obj = jQuery('<b></b>'); )
		 * @return JS array of wrappable selection trees
		 * @hide
		 */
		optimizeSelectionTree4Markup: function(selectionTree, markupObject, tagComparator) {
			var groupMap = [],
				outerGroupIndex = 0,
				innerGroupIndex = 0,
				that = this,
				i,j,
				endPosition, startPosition;

			if (typeof tagComparator === 'undefined') {
				tagComparator = function(domobj, markupObject) {
					return that.standardTextLevelSemanticsComparator(markupObject);
				};
			}
			for( i = 0; i<selectionTree.length; i++) {
				// we are just interested in selected item, but not in non-selected items
				if (selectionTree[i].domobj && selectionTree[i].selection != 'none') {
					if (markupObject.isReplacingElement && tagComparator(markupObject[0], jQuery(selectionTree[i].domobj))) {
						if (groupMap[outerGroupIndex] !== undefined) {
							outerGroupIndex++;
						}
						groupMap[outerGroupIndex] = {};
						groupMap[outerGroupIndex].wrappable = true;
						groupMap[outerGroupIndex].elements = [];
						groupMap[outerGroupIndex].elements[innerGroupIndex] = selectionTree[i];
						outerGroupIndex++;

					} else
					// now check, if the children of our item could be wrapped all together by the markup object
					if (this.canMarkupBeApplied2ElementAsWhole([ selectionTree[i] ], markupObject)) {
						// if yes, add it to the current group
						if (groupMap[outerGroupIndex] === undefined) {
							groupMap[outerGroupIndex] = {};
							groupMap[outerGroupIndex].wrappable = true;
							groupMap[outerGroupIndex].elements = [];
						}
						if (markupObject.isReplacingElement) { //  && selectionTree[i].domobj.nodeType === 3
							/* we found the node to wrap for a replacing element. however there might
							 * be siblings which should be included as well
							 * although they are actually not selected. example:
							 * li
							 * |-textNode ( .selection = 'none')
							 * |-textNode (cursor inside, therefor .selection = 'partial')
							 * |-textNode ( .selection = 'none')
							 *
							 * in this case it would be useful to select the previous and following textNodes as well (they might result from a previous DOM manipulation)
							 * Think about other cases, where the parent is the Editable. In this case we propably only want to select from and until the next <br /> ??
							 * .... many possibilities, here I realize the two described cases
							 */

							// first find start element starting from the current element going backwards until sibling 0
							startPosition = i;
							for (j = i-1; j >= 0; j--) {
								if (this.canMarkupBeApplied2ElementAsWhole([ selectionTree[ j ] ], markupObject) && this.isMarkupAllowedToStealSelectionTreeElement(selectionTree[ j ], markupObject)) {
									startPosition = j;
								} else {
									break;
								}
							}

							// now find the end element starting from the current element going forward until the last sibling
							endPosition = i;
							for (j = i+1; j < selectionTree.length; j++) {
								if (this.canMarkupBeApplied2ElementAsWhole([ selectionTree[ j ] ], markupObject) && this.isMarkupAllowedToStealSelectionTreeElement(selectionTree[ j ], markupObject)) {
									endPosition = j;
								} else {
									break;
								}
							}

							// now add the elements to the groupMap
							innerGroupIndex = 0;
							for (j = startPosition; j <= endPosition; j++) {
								groupMap[outerGroupIndex].elements[innerGroupIndex]	= selectionTree[j];
								groupMap[outerGroupIndex].elements[innerGroupIndex].selection = 'full';
								innerGroupIndex++;
							}
							innerGroupIndex = 0;
						} else {
							// normal text level semantics object, no siblings need to be selected
							groupMap[outerGroupIndex].elements[innerGroupIndex] = selectionTree[i];
							innerGroupIndex++;
						}
					} else {
						// if no, isolate it in its own group
						if (groupMap[outerGroupIndex] !== undefined) {
							outerGroupIndex++;
						}
						groupMap[outerGroupIndex] = {};
						groupMap[outerGroupIndex].wrappable = false;
						groupMap[outerGroupIndex].element = selectionTree[i];
						innerGroupIndex = 0;
						outerGroupIndex++;
					}
				}
			}
			return groupMap;
		},

		/**
		 * very tricky method, which decides, if a certain markup (normally a replacing markup element like p, h1, blockquote)
		 * is allowed to extend the user selection to other dom objects (represented as selectionTreeElement)
		 * to understand the purpose: if the user selection is collapsed inside e.g. some text, which is currently not
		 * wrapped by the markup to be applied, and therefor the markup does not have an equal markup to replace, then the DOM
		 * manipulator has to decide which objects to wrap. real example:
		 * <div>
		 *	<h1>headline</h1>
		 *	some text blabla bla<br>
		 *	more text HERE THE | CURSOR BLINKING and <b>even more bold text</b>
		 * </div>
		 * when the user now wants to apply e.g. a <p> tag, what will be wrapped? it could be useful if the manipulator would actually
		 * wrap everything inside the div except the <h1>. but for this purpose someone has to decide, if the markup is
		 * allowed to wrap certain dom elements in this case the question would be, if the <p> is allowed to wrap
		 * textNodes, <br> and <b> and <h1>. therefore this tricky method should answer the question for those 3 elements
		 * with true, but for for the <h1> it should return false. and since the method does not know this, there is a configuration
		 * for this
		 *
		 * @param selectionTree rangeObject selection tree element (only one, not an array of)
		 * @param markupObject lowercase string of the tag to be verified (e.g. "b")
		 * @return true if the markup is allowed to wrap the selection tree element, false otherwise
		 * @hide
		 */
		isMarkupAllowedToStealSelectionTreeElement: function(selectionTreeElement, markupObject) {
			if (!selectionTreeElement.domobj) {
				return false;
			}
			var nodeName = selectionTreeElement.domobj.nodeName.toLowerCase(),
				markupName;
			
			nodeName = (nodeName == '#text') ? 'textNode' : nodeName;
			markupName = markupObject[0].nodeName.toLowerCase();
			// if nothing is defined for the markup, it's now allowed
			if (!this.allowedToStealElements[ markupName ]) {
				return false;
			}
			// if something is defined, but the specifig tag is not in the list
			if (this.allowedToStealElements[ markupName ].indexOf(nodeName) == -1) {
				return false;
			}
			return true;
		},

		/**
		 * checks if a selection can be completey wrapped by a certain html tags (helper method for this.optimizeSelectionTree4Markup
		 * @param selectionTree rangeObject selection tree
		 * @param markupObject lowercase string of the tag to be verified (e.g. "b")
		 * @return true if selection can be applied as whole, false otherwise
		 * @hide
		 */
		canMarkupBeApplied2ElementAsWhole: function(selectionTree, markupObject) {
			var htmlTag, i, el, returnVal;

			if (markupObject.jquery) {
				htmlTag = markupObject[0].tagName;
			}
			if (markupObject.tagName) {
				htmlTag = markupObject.tagName;
			}

			returnVal = true;
			for ( i = 0; i < selectionTree.length; i++) {
				el = selectionTree[i];
				if (el.domobj && (el.selection != "none" || markupObject.isReplacingElement)) {
					// Aloha.Log.debug(this, 'Checking, if  <' + htmlTag + '> can be applied to ' + el.domobj.nodeName);
					if (!this.canTag1WrapTag2(htmlTag, el.domobj.nodeName)) {
						return false;
					}
					if (el.children.length > 0 && !this.canMarkupBeApplied2ElementAsWhole(el.children, markupObject)) {
						return false;
					}
				}
			}
			return returnVal;
		},

		/**
		 * checks if a tag 1 (first parameter) can wrap tag 2 (second parameter).
		 * IMPORTANT: the method does not verify, if there have to be other tags in between
		 * Example: this.canTag1WrapTag2("table", "td") will return true, because the method does not take into account, that there has to be a "tr" in between
		 * @param t1 string: tagname of outer tag to verify, e.g. "b"
		 * @param t2 string: tagname of inner tag to verify, e.g. "b"
		 * @return true if tag 1 can wrap tag 2, false otherwise
		 * @hide
		 */
		canTag1WrapTag2: function(t1, t2) {
			t1 = (t1 == '#text')?'textNode':t1.toLowerCase();
			t2 = (t2 == '#text')?'textNode':t2.toLowerCase();
			if (!this.tagHierarchy[ t1 ]) {
				// Aloha.Log.warn(this, t1 + ' is an unknown tag to the method canTag1WrapTag2 (paramter 1). Sadfully allowing the wrapping...');
				return true;
			}
			if (!this.tagHierarchy[ t2 ]) {
				// Aloha.Log.warn(this, t2 + ' is an unknown tag to the method canTag1WrapTag2 (paramter 2). Sadfully allowing the wrapping...');
				return true;
			}
			var t1Array = this.tagHierarchy[ t1 ],
				returnVal = (t1Array.indexOf( t2 ) != -1) ? true : false;
			return returnVal;
		},

		/**
		 * Check whether it is allowed to insert the given tag at the start of the
		 * current selection. This method will check whether the markup effective for
		 * the start and outside of the editable part (starting with the editable tag
		 * itself) may wrap the given tag.
		 * @param tagName {String} name of the tag which shall be inserted
		 * @return true when it is allowed to insert that tag, false if not
		 * @hide
		 */
		mayInsertTag: function (tagName) {
			if (typeof this.rangeObject.unmodifiableMarkupAtStart == 'object') {
				// iterate over all DOM elements outside of the editable part
				for (var i = 0; i < this.rangeObject.unmodifiableMarkupAtStart.length; ++i) {
					// check whether an element may not wrap the given
					if (!this.canTag1WrapTag2(this.rangeObject.unmodifiableMarkupAtStart[i].nodeName, tagName)) {
						// found a DOM element which forbids to insert the given tag, we are done
						return false;
					}
				}

				// all of the found DOM elements allow inserting the given tag
				return true;
			} else {
				Aloha.Log.warn(this, 'Unable to determine whether tag ' + tagName + ' may be inserted');
				return true;
			}
		},

		/**
		 * String representation
		 * @return "Aloha.Selection"
		 * @hide
		 */
		toString: function() {
			return 'Aloha.Selection';
		},

		/**
		 * @namespace Aloha.Selection
		 * @class SelectionRange
		 * @extends GENTICS.Utils.RangeObject
		 * Constructor for a range object.
		 * Optionally you can pass in a range object that's properties will be assigned to the new range object.
		 * @param rangeObject A range object thats properties will be assigned to the new range object.
		 * @constructor
		 */
		SelectionRange: GENTICS.Utils.RangeObject.extend({
			_constructor: function(rangeObject){
				this._super(rangeObject);
				// If a range object was passed in we apply the values to the new range object
				if (rangeObject) {
					if (rangeObject.commonAncestorContainer) {
						this.commonAncestorContainer = rangeObject.commonAncestorContainer;
					}
					if (rangeObject.selectionTree) {
						this.selectionTree = rangeObject.selectionTree;
					}
					if (rangeObject.limitObject) {
						this.limitObject = rangeObject.limitObject;
					}
					if (rangeObject.markupEffectiveAtStart) {
						this.markupEffectiveAtStart = rangeObject.markupEffectiveAtStart;
					}
					if (rangeObject.unmodifiableMarkupAtStart) {
						this.unmodifiableMarkupAtStart = rangeObject.unmodifiableMarkupAtStart;
					}
					if (rangeObject.splitObject) {
						this.splitObject = rangeObject.splitObject;
					}
				}
			},

			/**
			 * DOM object of the common ancestor from startContainer and endContainer
			 * @hide
			 */
			commonAncestorContainer: undefined,

			/**
			 * The selection tree
			 * @hide
			 */
			selectionTree: undefined,

			/**
			 * Array of DOM objects effective for the start container and inside the
			 * editable part (inside the limit object). relevant for the button status
			 * @hide
			 */
			markupEffectiveAtStart: [],

			/**
			 * Array of DOM objects effective for the start container, which lies
			 * outside of the editable portion (starting with the limit object)
			 * @hide
			 */
			unmodifiableMarkupAtStart: [],

			/**
			 * DOM object being the limit for all markup relevant activities
			 * @hide
			 */
			limitObject: undefined,

			/**
			 * DOM object being split when enter key gets hit
			 * @hide
			 */
			splitObject: undefined,

			/**
			 * Sets the visible selection in the Browser based on the range object.
			 * If the selection is collapsed, this will result in a blinking cursor,
			 * otherwise in a text selection.
			 * @method
			 */
			select: function() {
				// Call Utils' select()
				this._super();

				// update the selection
				Aloha.Selection.updateSelection();
			},

			/**
			 * Method to update a range object internally
			 * @param commonAncestorContainer (DOM Object); optional Parameter; if set, the parameter
			 * will be used instead of the automatically calculated CAC
			 * @return void
			 * @hide
			 */
			update: function(commonAncestorContainer) {
				this.updatelimitObject();
				this.updateMarkupEffectiveAtStart();
				this.updateCommonAncestorContainer(commonAncestorContainer);

				// reset the selectiontree (must be recalculated)
				this.selectionTree = undefined;
			},

			/**
			 * Get the selection tree for this range
			 * TODO: remove this (was moved to range.js)
			 * @return selection tree
			 * @hide
			 */
			getSelectionTree: function () {
				// if not yet calculated, do this now
				if (!this.selectionTree) {
					this.selectionTree = Aloha.Selection.getSelectionTree(this);
				}

				return this.selectionTree;
			},

			/**
			 * TODO: move this to range.js
			 * Get an array of domobj (in dom tree order) of siblings of the given domobj, which are contained in the selection
			 * @param domobj dom object to start with
			 * @return array of siblings of the given domobj, which are also selected
			 * @hide
			 */
			getSelectedSiblings: function (domobj) {
				var selectionTree = this.getSelectionTree();

				return this.recursionGetSelectedSiblings(domobj, selectionTree);
			},

			/**
			 * TODO: move this to range.js
			 * Recursive method to find the selected siblings of the given domobj (which should be selected as well)
			 * @param domobj dom object for which the selected siblings shall be found
			 * @param selectionTree current level of the selection tree
			 * @return array of selected siblings of dom objects or false if none found
			 * @hide
			 */
			recursionGetSelectedSiblings: function (domobj, selectionTree) {
				var selectedSiblings = false,
					foundObj = false,
					i;

				for ( i = 0; i < selectionTree.length; ++i) {
					if (selectionTree[i].domobj === domobj) {
						foundObj = true;
						selectedSiblings = [];
					} else if (!foundObj && selectionTree[i].children) {
						// do the recursion
						selectedSiblings = this.recursionGetSelectedSiblings(domobj, selectionTree[i].children);
						if (selectedSiblings !== false) {
							break;
						}
					} else if (foundObj && selectionTree[i].domobj && selectionTree[i].selection != 'collapsed' && selectionTree[i].selection != 'none') {
						selectedSiblings.push(selectionTree[i].domobj);
					} else if (foundObj && selectionTree[i].selection == 'none') {
						break;
					}
				}

				return selectedSiblings;
			},

			/**
			 * TODO: move this to range.js
			 * Method updates member var markupEffectiveAtStart and splitObject, which is relevant primarily for button status and enter key behaviour
			 * @return void
			 * @hide
			 */
			updateMarkupEffectiveAtStart: function() {
				// reset the current markup
				this.markupEffectiveAtStart = [];
				this.unmodifiableMarkupAtStart = [];

				var
					parents = this.getStartContainerParents(),
					limitFound = false,
					splitObjectWasSet,
					i, el;

				for ( i = 0; i < parents.length; i++) {
					el = parents[i];
					if (!limitFound && (el !== this.limitObject)) {
						this.markupEffectiveAtStart[ i ] = el;
						if (!splitObjectWasSet && GENTICS.Utils.Dom.isSplitObject(el)) {
							splitObjectWasSet = true;
							this.splitObject = el;
						}
					} else {
						limitFound = true;
						this.unmodifiableMarkupAtStart.push(el);
					}
				}
				if (!splitObjectWasSet) {
					this.splitObject = false;
				}
				return;
			},

			/**
			 * TODO: remove this
			 * Method updates member var markupEffectiveAtStart, which is relevant primarily for button status
			 * @return void
			 * @hide
			 */
			updatelimitObject: function() {
				if (Aloha.editables && Aloha.editables.length > 0) {
					var parents = this.getStartContainerParents(),
						editables = Aloha.editables,
						i, el, j, editable;
					for ( i = 0; i < parents.length; i++) {
						 el = parents[i];
						for ( j = 0; j < editables.length; j++) {
							 editable = editables[j].obj[0];
							if (el === editable) {
								this.limitObject = el;
								return true;
							}
						}
					}
				}
				this.limitObject = jQuery('body');
				return true;
			},

			/**
			 * string representation of the range object
			 * @param	verbose	set to true for verbose output
			 * @return string representation of the range object
			 * @hide
			 */
			toString: function(verbose) {
				if (!verbose) {
					return 'Aloha.Selection.SelectionRange';
				}
				return 'Aloha.Selection.SelectionRange {start [' + this.startContainer.nodeValue + '] offset '
					+ this.startOffset + ', end [' + this.endContainer.nodeValue + '] offset ' + this.endOffset + '}';
			}

		}) // SelectionRange

	}); // Selection


/**
 * This method implements an ugly workaround for a selection problem in ie:
 * when the cursor shall be placed at the end of a text node in a li element, that is followed by a nested list,
 * the selection would always snap into the first li of the nested list
 * therefore, we make sure that the text node ends with a space and place the cursor right before it
 */
function nestedListInIEWorkaround ( range ) {
	if (jQuery.browser.msie
		&& range.startContainer === range.endContainer
		&& range.startOffset === range.endOffset
		&& range.startContainer.nodeType == 3
		&& range.startOffset == range.startContainer.data.length
		&& range.startContainer.nextSibling
		&& ["OL", "UL"].indexOf(range.startContainer.nextSibling.nodeName) !== -1) {
		if (range.startContainer.data[range.startContainer.data.length-1] == ' ') {
			range.startOffset = range.endOffset = range.startOffset-1;
		} else {
			range.startContainer.data = range.startContainer.data + ' ';
		}
	}
}

function correctRange ( range ) {
	nestedListInIEWorkaround(range);
	return range;
}

	/**
	 * Implements Selection http://html5.org/specs/dom-range.html#selection
	 * @namespace Aloha
	 * @class Selection This singleton class always represents the
	 *        current user selection
	 * @singleton
	 */
	var AlohaSelection = Class.extend({
		
		_constructor : function( nativeSelection ) {
			
			this._nativeSelection = nativeSelection;
			this.ranges = [];
			
			// will remember if urged to not change the selection
			this.preventChange = false;
			
		},
		
		/**
		 * Returns the element that contains the start of the selection. Returns null if there's no selection.
		 * @readonly
		 * @type Node
		 */
		anchorNode: null,
		
		/**
		 * Returns the offset of the start of the selection relative to the element that contains the start 
		 * of the selection. Returns 0 if there's no selection.
		 * @readonly
		 * @type int
		 */
		anchorOffset: 0,
		
		/**
		 * Returns the element that contains the end of the selection.
		 * Returns null if there's no selection.
		 * @readonly
		 * @type Node
		 */
		focusNode: null,
		
		/**
		 * Returns the offset of the end of the selection relative to the element that contains the end 
		 * of the selection. Returns 0 if there's no selection.
		 * @readonly
		 * @type int
		 */
		focusOffset: 0,
		
		/**
		 * Returns true if there's no selection or if the selection is empty. Otherwise, returns false.
		 * @readonly
		 * @type boolean
		 */
		isCollapsed: false,
		
		/**
		 * Returns the number of ranges in the selection.
		 * @readonly
		 * @type int
		 */
		rangeCount: 0,
					
		/**
		 * Replaces the selection with an empty one at the given position.
		 * @throws a WRONG_DOCUMENT_ERR exception if the given node is in a different document.
		 * @param parentNode Node of new selection
		 * @param offest offest of new Selection in parentNode
		 * @void
		 */
		collapse: function ( parentNode, offset ) {
			this._nativeSelection.collapse(  parentNode, offset );
		},
		
		/**
		 * Replaces the selection with an empty one at the position of the start of the current selection.
		 * @throws an INVALID_STATE_ERR exception if there is no selection.
		 * @void
		 */
		collapseToStart: function() {
			throw "NOT_IMPLEMENTED";
		},
		
		/** 
		 * @void
		 */
		extend: function ( parentNode, offset) {
			
		},
		
		/**
		 * @param alter DOMString 
		 * @param direction DOMString 
		 * @param granularity DOMString 
		 * @void
		 */
		modify: function ( alter, direction, granularity ) {
			
		},

		/**
		 * Replaces the selection with an empty one at the position of the end of the current selection.
		 * @throws an INVALID_STATE_ERR exception if there is no selection.
		 * @void
		 */
		collapseToEnd: function() {
			throw "NOT_IMPLEMENTED";
		},
		
		/**
		 * Replaces the selection with one that contains all the contents of the given element.
		 * @throws a WRONG_DOCUMENT_ERR exception if the given node is in a different document.
		 * @param parentNode Node the Node fully select
		 * @void
		 */
		selectAllChildren: function( parentNode ) {
			throw "NOT_IMPLEMENTED";
		},
		
		/**
		 * Deletes the contents of the selection
		 */
		deleteFromDocument: function() {
			throw "NOT_IMPLEMENTED";
		},
		
		/**
		 * NB!
		 * We have serious problem in IE.
		 * The range that we get in IE is not the same as the range we had set,
		 * so even if we normalize it during getRangeAt, in IE, we will be
		 * correcting the range to the "correct" place, but still not the place
		 * where it was originally set.
		 * 
		 * Returns the given range.
		 * The getRangeAt(index) method returns the indexth range in the list. 
		 * NOTE: Aloha Editor only support 1 range! index can only be 0
		 * @throws INDEX_SIZE_ERR DOM exception if index is less than zero or 
		 * greater or equal to the value returned by the rangeCount.
		 * @param index int 
		 * @return Range return the selected range from index
		 */
		getRangeAt: function ( index ) {
			return correctRange( this._nativeSelection.getRangeAt( index ) );
			//if ( index < 0 || this.rangeCount ) {
			//	throw "INDEX_SIZE_ERR DOM";
			//}
			//return this._ranges[index];
		},
		
		/**
		 * Adds the given range to the selection.
		 * The addRange(range) method adds the given range Range object to the list of
		 * selections, at the end (so the newly added range is the new last range). 
		 * NOTE: Aloha Editor only support 1 range! The added range will replace the 
		 * range at index 0
		 * see http://html5.org/specs/dom-range.html#selection note about addRange
		 * @throws an INVALID_NODE_TYPE_ERR exception if the given Range has a boundary point
		 * node that's not a Text or Element node, and an INVALID_MODIFICATION_ERR exception 
		 * if it has a boundary point node that doesn't descend from a Document.
		 * @param range Range adds the range to the selection
		 * @void
		 */ 
		addRange: function( range ) {
			// set readonly attributes
			this._nativeSelection.addRange( range );
			// We will correct the range after rangy has processed the native
			// selection range, so that our correction will be the final fix on
			// the range according to the guarentee's that Aloha wants to make
			this._nativeSelection._ranges[ 0 ] = correctRange( range );

			// make sure, the old Aloha selection will be updated (until all implementations use the new AlohaSelection)
			Aloha.Selection.updateSelection();
		},
		
		/**
		 * Removes the given range from the selection, if the range was one of the ones in the selection.
		 * NOTE: Aloha Editor only support 1 range! The added range will replace the 
		 * range at with index 0
		 * @param range Range removes the range from the selection
		 * @void
		 */
		removeRange: function( range ) {
			this._nativeSelection.removeRange();
		},
		
		/**
		 * Removes all the ranges in the selection.
		 * @viod
		 */
		removeAllRanges: function() {
			this._nativeSelection.removeAllRanges();
		},
				
		/**
		 * prevents the next aloha-selection-changed event from
		 * being triggered
		 * @param flag boolean defines weather to update the selection on change or not
		 */
		preventedChange: function( flag ) {
//			this.preventChange = typeof flag === 'undefined' ? false : flag;
		},

		/**
		 * will return wheter selection change event was prevented or not, and reset the
		 * preventSelectionChangedFlag
		 * @return boolean true if aloha-selection-change event
		 *         was prevented
		 */
		isChangedPrevented: function() {
//			return this.preventSelectionChangedFlag;
		},

		/**
		 * INFO: Method is used for integration with Gentics
		 * Aloha, has no use otherwise Updates the rangeObject
		 * according to the current user selection Method is
		 * always called on selection change
		 * 
		 * @param event
		 *            jQuery browser event object
		 * @return true when rangeObject was modified, false
		 *         otherwise
		 * @hide
		 */
		refresh: function(event) {

		},

		/**
		 * String representation
		 * 
		 * @return "Aloha.Selection"
		 * @hide
		 */
		toString: function() {
			return 'Aloha.Selection';
		},
		
		getRangeCount: function() {
			return this._nativeSelection.rangeCount;
		}

	});

	/**
	 * A wrapper for the function of the same name in the rangy core-depdency.
	 * This function should be preferred as it hides the global rangy object.
	 * For more information look at the following sites:
	 * http://html5.org/specs/dom-range.html
	 * @param window optional - specifices the window to get the selection of
	 */
	Aloha.getSelection = function( target ) {
		var target = ( target !== document || target !== window ) ? window : target;
        // Aloha.Selection.refresh()
		// implement Aloha Selection 
		// TODO cache
		return new AlohaSelection( window.rangy.getSelection( target ) );
	};
	
	/**
	 * A wrapper for the function of the same name in the rangy core-depdency.
	 * This function should be preferred as it hides the global rangy object.
	 * Please note: when the range object is not needed anymore,
	 *   invoke the detach method on it. It is currently unknown to me why
	 *   this is required, but that's what it says in the rangy specification.
	 * For more information look at the following sites:
	 * http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html
	 * @param document optional - specifies which document to create the range for
	 */
	Aloha.createRange = function(givenWindow) {
		return window.rangy.createRange(givenWindow);
	};
	
	var selection = new Selection();
	Aloha.Selection = selection;

	return selection;
});

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

define('aloha/markup',[
	'aloha/core',
	'util/class',
	'aloha/jquery',
	'aloha/ecma5shims'
],
function( Aloha, Class, jQuery, shims ) {



var GENTICS = window.GENTICS;

var isOldIE = !!( jQuery.browser.msie &&
				  9 > parseInt( jQuery.browser.version, 10 ) );

function isBR( node ) {
	return 'BR' === node.nodeName;
}

function isBlock( node ) {
	return 'false' === jQuery( node ).attr( 'contenteditable' );
}

function isTextNode( node ) {
	return node && 3 === node.nodeType; // Node.TEXT_NODE
}

function nodeLength( node ) {
	return !node ? 0
				 : ( isTextNode( node ) ? node.length
										: node.childNodes.length );
}

function nextVisibleNode( node ) {
	if ( !node ) {
		return null;
	}

	if ( node.nextSibling ) {
		// Skip over nodes that the user cannot see ...
		if ( isTextNode( node.nextSibling ) &&
			 !isVisibleTextNode( node.nextSibling ) ) {
			return nextVisibleNode( node.nextSibling );
		}

		// Skip over propping <br>s ...
		if ( isBR( node.nextSibling ) &&
			 node.nextSibling === node.parentNode.lastChild ) {
			return nextVisibleNode( node.nextSibling );	
		}

		// Skip over empty editable elements ...
		if ( '' === node.nextSibling.innerHTML &&
		     !isBlock( node.nextSibling ) ) {
			return nextVisibleNode( node.nextSibling );
		}

		return node.nextSibling;
	}

	if ( node.parentNode ) {
		return nextVisibleNode( node.parentNode );
	}

	return null;
}

function prevVisibleNode( node ) {
	if ( !node ) {
		return null;
	}

	if ( node.previousSibling ) {
		// Skip over nodes that the user cannot see...
		if ( isTextNode( node.previousSibling ) &&
			 !isVisibleTextNode( node.previousSibling ) ) {
			return prevVisibleNode( node.previousSibling );
		}

		// Skip over empty editable elements ...
		if ( '' === node.previousSibling.innerHTML &&
		     !isBlock( node.previousSibling ) ) {
			return prevVisibleNode( node.previouSibling );
		}

		return node.previousSibling;
	}

	if ( node.parentNode ) {
		return prevVisibleNode( node.parentNode );
	}

	return null;
}

/**
 * Determines whether the given text node is visible to the the user,
 * based on our understanding that browsers will not display
 * superfluous white spaces.
 *
 * @param {HTMLEmenent} node The text node to be checked.
 */
function isVisibleTextNode( node ) {
	return 0 < node.data.replace( /\s+/g, '' ).length;
}

function isFrontPosition( node, offset ) {
	return ( 0 === offset ) ||
		   ( offset <= node.data.length -
					   node.data.replace( /^\s+/, '' ).length );
}

function isBlockInsideEditable( $block ) {
	return $block.parent().hasClass( 'aloha-editable' );
}

function isEndPosition( node, offset ) {
	var length = nodeLength( node );

	if ( length === offset ) {
		return true;
	}

	var isText = isTextNode( node );

	// If within a text node, then ignore superfluous white-spaces,
	// since they are invisible to the user.
	if ( isText &&
		 node.data.replace( /\s+$/, '' ).length === offset ) {
		return true;
	}

	if ( 1 === length && !isText ) {
		return isBR( node.childNodes[0] );
	}

	return false;
}

function blink( node ) {
	jQuery( node )
		.stop( true )
		.css({ opacity: 0 })
		.fadeIn( 0 ).delay( 100 )
		.fadeIn(function () {
			jQuery( node ).css({ opacity: 1 });
		});

	return node;
}

/**
 * @TODO(petro): We need to be more intelligent about whether we insert a
 *               block-level placeholder or a phrasing level element.
 * @TODO(petro): test with <pre>
 */
function jumpBlock( block, isGoingLeft ) {
	var range = new GENTICS.Utils.RangeObject();
	var sibling = isGoingLeft ? prevVisibleNode( block )
	                          : nextVisibleNode( block );

	if ( !sibling || isBlock( sibling ) ) {
		var $landing = jQuery( '<div>&nbsp;</div>' );

		if ( isGoingLeft ) {
			jQuery( block ).before( $landing );
		} else {
			jQuery( block ).after( $landing );
		}

		range.startContainer = range.endContainer = $landing[0];
		range.startOffset = range.endOffset = 0;

		// Clear out any old placeholder first ...
		cleanupPlaceholders( range );

		window.$_alohaPlaceholder = $landing;
	} else {
		range.startContainer = range.endContainer = sibling;
		range.startOffset = range.endOffset = isGoingLeft ?
			nodeLength( sibling ) : ( isOldIE ? 1 : 0 );

		cleanupPlaceholders( range );
	}

	range.select();

	Aloha.trigger( 'aloha-block-selected', block );
	Aloha.Selection.preventSelectionChanged();
}

function nodeContains( node1, node2 ) {
	return isOldIE ? ( shims.compareDocumentPosition( node1, node2 ) & 16 )
	               : 0 < jQuery( node1 ).find( node2 ).length;
}

function isInsidePlaceholder( range ) {
	var start = range.startContainer;
	var end = range.endContainer;
	var $placeholder = window.$_alohaPlaceholder;

	return $placeholder.is( start )               ||
	       $placeholder.is( end )                 ||
	       nodeContains( $placeholder[0], start ) ||
	       nodeContains( $placeholder[0], end );
}

function cleanupPlaceholders( range ) {
	if ( window.$_alohaPlaceholder && !isInsidePlaceholder( range ) ) {
		if ( 0 === window.$_alohaPlaceholder.html()
		                 .replace( /^(&nbsp;)*$/, '' ).length ) {
			window.$_alohaPlaceholder.remove();
		}

		window.$_alohaPlaceholder = null;
	}
}

/**
 * Markup object
 */
Aloha.Markup = Class.extend( {

	/**
	 * Key handlers for special key codes
	 */
	keyHandlers: {},

	/**
	 * Add a key handler for the given key code
	 * @param keyCode key code
	 * @param handler handler function
	 */
	addKeyHandler: function( keyCode, handler ) {
		if ( !this.keyHandlers[ keyCode ] ) {
			this.keyHandlers[ keyCode ] = [];
		}

		this.keyHandlers[ keyCode ].push( handler );
	},

	insertBreak: function() {
		var range = Aloha.Selection.rangeObject,
		    onWSIndex,
		    nextTextNode,
		    newBreak;

		if ( !range.isCollapsed() ) {
			this.removeSelectedMarkup();
		}

		newBreak = jQuery( '<br/>' );
		GENTICS.Utils.Dom.insertIntoDOM( newBreak, range, Aloha.activeEditable.obj );

		nextTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(
			newBreak.parent().get( 0 ),
			GENTICS.Utils.Dom.getIndexInParent( newBreak.get( 0 ) ) + 1,
			false
		);

		if ( nextTextNode ) {
			// trim leading whitespace
			nonWSIndex = nextTextNode.data.search( /\S/ );
			if ( nonWSIndex > 0 ) {
				nextTextNode.data = nextTextNode.data.substring( nonWSIndex );
			}
		}

		range.startContainer = range.endContainer = newBreak.get( 0 ).parentNode;
		range.startOffset = range.endOffset = GENTICS.Utils.Dom.getIndexInParent( newBreak.get( 0 ) ) + 1;
		range.correctRange();
		range.clearCaches();
		range.select();
	},

	/**
	 * first method to handle key strokes
	 * @param event DOM event
	 * @param rangeObject as provided by Aloha.Selection.getRangeObject();
	 * @return "Aloha.Selection"
	 */
	preProcessKeyStrokes: function( event ) {
		if ( event.type !== 'keydown' ) {
			return false;
		}

		var rangeObject = Aloha.Selection.rangeObject,
		    handlers,
		    i;

		if ( this.keyHandlers[ event.keyCode ] ) {
			handlers = this.keyHandlers[ event.keyCode ];
			for ( i = 0; i < handlers.length; ++i ) {
				if ( !handlers[i]( event ) ) {
					return false;
				}
			}
		}

		// LEFT (37), RIGHT (39) keys for block detection
		if ( event.keyCode === 37 || event.keyCode === 39 ) {
			if ( this.processCursor( rangeObject, event.keyCode ) ) {
				cleanupPlaceholders( Aloha.Selection.rangeObject );
				return true;
			}

			return false;
		}

		// BACKSPACE
		if ( event.keyCode === 8 ) {
			event.preventDefault(); // prevent history.back() even on exception
			Aloha.execCommand( 'delete', false );
			return false;
		}

		// DELETE
		if ( event.keyCode === 46 ) {
			Aloha.execCommand( 'forwarddelete', false );
			return false;
		}

		// ENTER
		if  ( event.keyCode === 13 ) {
			if ( event.shiftKey ) {
				Aloha.execCommand( 'insertlinebreak', false );
				return false;
			} else {
				Aloha.execCommand( 'insertparagraph', false );
				return false;
			}
		}

		return true;
	},

	/**
	 * Processing of cursor keys.
	 * Detect blocks (elements with contenteditable=false) and will select them
	 * (normally the cursor would simply jump right past them).
	 *
	 * For each block that is selected, an 'aloha-block-selected' event will be
	 * triggered.
	 *
	 * @param {RangyRange} range A range object for the current selection.
	 * @param {number} keyCode Code of the currently pressed key.
	 * @return {boolean} False if a block was found, to prevent further events,
	 *                   true otherwise.
	 */
	processCursor: function( range, keyCode ) {
		if ( !range.isCollapsed() ) {
			return true;
		}

		var node = range.startContainer;

		if ( !node ) {
			return true;
		}

		var sibling;

		// Versions of Internet Explorer that are older that 9, will
		// erroneously allow you to enter and edit inside elements which have
		// their contenteditable attribute set to false...
		if ( isOldIE ) {
			var $parentBlock = jQuery( node ).parents(
				'[contenteditable=false]' );
			var isInsideBlock = $parentBlock.length > 0;

			if ( isInsideBlock ) {
				if ( isBlockInsideEditable( $parentBlock ) ) {
					sibling = $parentBlock[0];
				} else {
					return true;
				}
			}
		}
		
		if ( !sibling ) {
			// True if keyCode denotes LEFT or UP arrow key, otherwise they
			// keyCode is for RIGHT or DOWN in which this value will be false.
			var isLeft = (37 === keyCode || 38 === keyCode);
			var offset = range.startOffset;

			if ( isTextNode( node ) ) {
				if ( isLeft ) {
					// FIXME(Petro): Please consider if you have a better idea
					//               of how we can work around this.
					//
					// Here is the problem... with Internet Explorer:
					// ----------------------------------------------
					//
					// Versions of Internet Explorer older than 9, are buggy in
					// how they `select()', or position a selection from cursor
					// movements, when the following conditions are true:
					//
					//  * The range is collapsed.
					//  * startContainer is a contenteditable text node.
					//  * startOffset is 1.
					//  * There is a non-conenteditable element left of the
					//    startContainer.
					//  * You attempt to move left to offset 0 (we consider a
					//    range to be at "frontposition" if it is at offset 0
					//    within its startContainer).
					//
					// What happens in IE 7, and IE 8, is that the selection
					// will jump to the adjacent non-contenteditable
					// element(s), instead moving to the front of the
					// container, and the offset will be stuck at 1--even as
					// the cursor is jumping around the screen!
					//
					// Our imperfect work-around is to reckon ourselves to be
					// at the front of the next node (ie: offset 0 in other
					// browsers), as soon as we detect that we are at offset 1
					// in IEv<9.
					//
					// Considering the bug, I think this is acceptable because
					// the user can still position themselve right between the
					// block (non-contenteditable element) and the first
					// characater of the text node by clicking there with the
					// mouse, since this seems to work fine in all IE versions.
					var isFrontPositionInIE = isOldIE && 1 === offset;

					if ( !isFrontPositionInIE &&
						 !isFrontPosition( node, offset ) ) {
						return true;
					}

				} else if ( !isEndPosition( node, offset ) ) {
					return true;
				}

			} else {
				node = node.childNodes[
					offset === nodeLength( node ) ? offset - 1 : offset ];
			}

			sibling = isLeft ? prevVisibleNode( node )
			                 : nextVisibleNode( node );
		}

		if ( isBlock( sibling ) ) {
			jumpBlock( sibling, isLeft );
			return false;
		}

		return true;
	},

	/**
	 * method handling shiftEnter
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	processShiftEnter: function( rangeObject ) {
		this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject );
	},

	/**
	 * method handling Enter
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	processEnter: function( rangeObject ) {
		if ( rangeObject.splitObject ) {
			// now comes a very evil hack for ie, when the enter is pressed in a text node in an li element, we just append an empty text node
			// if ( jQuery.browser.msie
			// 		&& GENTICS.Utils.Dom
			// 				.isListElement( rangeObject.splitObject ) ) {
			// 	jQuery( rangeObject.splitObject ).append(
			// 			jQuery( document.createTextNode( '' ) ) );
			// }
			this.splitRangeObject( rangeObject );
		} else { // if there is no split object, the Editable is the paragraph type itself (e.g. a p or h2)
			this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject );
		}
	},

	/**
	 * Insert the given html markup at the current selection
	 * @param html html markup to be inserted
	 */
	insertHTMLCode: function( html ) {
		var rangeObject = Aloha.Selection.rangeObject;
		this.insertHTMLBreak( rangeObject.getSelectionTree(), rangeObject, jQuery( html ) );
	},

	/**
	 * insert an HTML Break <br /> into current selection
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @return void
	 */
	insertHTMLBreak: function( selectionTree, rangeObject, inBetweenMarkup ) {
		var i,
		    treeLength,
		    el,
		    jqEl,
		    jqElBefore,
		    jqElAfter,
		    tmpObject,
		    offset,
		    checkObj;

		inBetweenMarkup = inBetweenMarkup ? inBetweenMarkup: jQuery( '<br/>' );

		for ( i = 0, treeLength = selectionTree.length; i < treeLength; ++i ) {
			el = selectionTree[ i ];
			jqEl = el.domobj ? jQuery( el.domobj ) : undefined;

			if ( el.selection !== 'none' ) { // before cursor, leave this part inside the splitObject
				if ( el.selection == 'collapsed' ) {
					// collapsed selection found (between nodes)
					if ( i > 0 ) {
						// not at the start, so get the element to the left
						jqElBefore = jQuery( selectionTree[ i - 1 ].domobj );

						// and insert the break after it
						jqElBefore.after( inBetweenMarkup );

					} else {
						// at the start, so get the element to the right
						jqElAfter = jQuery( selectionTree[1].domobj );

						// and insert the break before it
						jqElAfter.before( inBetweenMarkup );
					}

					// now set the range
					rangeObject.startContainer = rangeObject.endContainer = inBetweenMarkup[0].parentNode;
					rangeObject.startOffset = rangeObject.endOffset = GENTICS.Utils.Dom.getIndexInParent( inBetweenMarkup[0] ) + 1;
					rangeObject.correctRange();

				} else if ( el.domobj && el.domobj.nodeType === 3 ) { // textNode
					// when the textnode is immediately followed by a blocklevel element (like p, h1, ...) we need to add an additional br in between
					if ( el.domobj.nextSibling
						 && el.domobj.nextSibling.nodeType == 1
						 && Aloha.Selection.replacingElements[
								el.domobj.nextSibling.nodeName.toLowerCase()
							] ) {
						// TODO check whether this depends on the browser
						jqEl.after( '<br/>' );
					}

					if ( this.needEndingBreak() ) {
						// when the textnode is the last inside a blocklevel element
						// (like p, h1, ...) we need to add an additional br as very
						// last object in the blocklevel element
						checkObj = el.domobj;

						while ( checkObj ) {
							if ( checkObj.nextSibling ) {
								checkObj = false;
							} else {
								// go to the parent
								checkObj = checkObj.parentNode;

								// found a blocklevel or list element, we are done
								if ( GENTICS.Utils.Dom.isBlockLevelElement( checkObj )
									 || GENTICS.Utils.Dom.isListElement( checkObj ) ) {
									break;
								}

								// reached the limit object, we are done
								if ( checkObj === rangeObject.limitObject ) {
									checkObj = false;
								}
							}
						}

						// when we found a blocklevel element, insert a break at the
						// end. Mark the break so that it is cleaned when the
						// content is fetched.
						if ( checkObj ) {
							jQuery( checkObj ).append( '<br class="aloha-cleanme" />' );
						}
					}

					// insert the break
					jqEl.between( inBetweenMarkup, el.startOffset );

					// correct the range
					// count the number of previous siblings
					offset = 0;
					tmpObject = inBetweenMarkup[0];
					while ( tmpObject ) {
						tmpObject = tmpObject.previousSibling;
						++offset;
					}

					rangeObject.startContainer = inBetweenMarkup[0].parentNode;
					rangeObject.endContainer = inBetweenMarkup[0].parentNode;
					rangeObject.startOffset = offset;
					rangeObject.endOffset = offset;
					rangeObject.correctRange();

				} else if ( el.domobj && el.domobj.nodeType === 1 ) { // other node, normally a break
					if ( jqEl.parent().find( 'br.aloha-ephemera' ).length === 0 ) {
						// but before putting it, remove all:
						jQuery( rangeObject.limitObject ).find( 'br.aloha-ephemera' ).remove();

						//  now put it:
						jQuery( rangeObject.commonAncestorContainer )
							.append( this.getFillUpElement( rangeObject.splitObject ) );
					}

					jqEl.after( inBetweenMarkup );

					// now set the selection. Since we just added one break do the currect el
					// the new position must be el's position + 1. el's position is the index
					// of the el in the selection tree, which is i. then we must add
					// another +1 because we want to be AFTER the object, not before. therefor +2
					rangeObject.startContainer = rangeObject.commonAncestorContainer;
					rangeObject.endContainer = rangeObject.startContainer;
					rangeObject.startOffset = i + 2;
					rangeObject.endOffset = i + 2;
					rangeObject.update();
				}
			}
		}
		rangeObject.select();
	},

	/**
	 * Check whether blocklevel elements need breaks at the end to visibly render a newline
	 * @return true if an ending break is necessary, false if not
	 */
	needEndingBreak: function() {
		// currently, all browser except IE need ending breaks
		return !jQuery.browser.msie;
	},

	/**
	 * Get the currently selected text or false if nothing is selected (or the selection is collapsed)
	 * @return selected text
	 */
	getSelectedText: function() {
		var rangeObject = Aloha.Selection.rangeObject;

		if ( rangeObject.isCollapsed() ) {
			return false;
		}

		return this.getFromSelectionTree( rangeObject.getSelectionTree(), true );
	},

	/**
	 * Recursive function to get the selected text from the selection tree starting at the given level
	 * @param selectionTree array of selectiontree elements
	 * @param astext true when the contents shall be fetched as text, false for getting as html markup
	 * @return selected text from that level (incluiding all sublevels)
	 */
	getFromSelectionTree: function( selectionTree, astext ) {
		var text = '', i, treeLength, el, clone;
		for ( i = 0, treeLength = selectionTree.length; i < treeLength; i++ ) {
			el = selectionTree[i];
			if ( el.selection == 'partial' ) {
				if ( el.domobj.nodeType === 3 ) {
					// partial text node selected, get the selected part
					text += el.domobj.data.substring( el.startOffset, el.endOffset );
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// partial element node selected, do the recursion into the children
					if ( astext ) {
						text += this.getFromSelectionTree( el.children, astext );
					} else {
						// when the html shall be fetched, we create a clone of the element and remove all the children
						clone = jQuery( el.domobj ).clone( false ).empty();
						// then we do the recursion and add the selection into the clone
						clone.html( this.getFromSelectionTree( el.children, astext ) );
						// finally we get the html of the clone
						text += clone.outerHTML();
					}
				}
			} else if ( el.selection == 'full' ) {
				if ( el.domobj.nodeType === 3 ) {
					// full text node selected, get the text
					text += jQuery( el.domobj ).text();
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// full element node selected, get the html of the node and all children
					text += astext ? jQuery( el.domobj ).text() : jQuery( el.domobj ).outerHTML();
				}
			}
		}

		return text;
	},

	/**
	 * Get the currently selected markup or false if nothing is selected (or the selection is collapsed)
	 * @return {?String}
	 */
	getSelectedMarkup: function() {
		var rangeObject = Aloha.Selection.rangeObject;
		return rangeObject.isCollapsed() ? null
			: this.getFromSelectionTree( rangeObject.getSelectionTree(), false );
	},

	/**
	 * Remove the currently selected markup
	 */
	removeSelectedMarkup: function() {
		var rangeObject = Aloha.Selection.rangeObject, newRange;

		if ( rangeObject.isCollapsed() ) {
			return;
		}

		newRange = new Aloha.Selection.SelectionRange();
		// remove the selection
		this.removeFromSelectionTree( rangeObject.getSelectionTree(), newRange );

		// do a cleanup now (starting with the commonancestorcontainer)
		newRange.update();
		GENTICS.Utils.Dom.doCleanup( { 'merge' : true, 'removeempty' : true }, Aloha.Selection.rangeObject );
		Aloha.Selection.rangeObject = newRange;

		// need to set the collapsed selection now
		newRange.correctRange();
		newRange.update();
		newRange.select();
		Aloha.Selection.updateSelection();
	},

	/**
	 * Recursively remove the selected items, starting with the given level in the selectiontree
	 * @param selectionTree current level of the selectiontree
	 * @param newRange new collapsed range to be set after the removal
	 */
	removeFromSelectionTree: function( selectionTree, newRange ) {
		// remember the first found partially selected element node (in case we need
		// to merge it with the last found partially selected element node)
		var firstPartialElement,
		    newdata,
		    i,
		    el,
		    adjacentTextNode,
		    treeLength;

		// iterate through the selection tree
		for ( i = 0, treeLength = selectionTree.length; i < treeLength; i++ ) {
			el = selectionTree[ i ];

			// check the type of selection
			if ( el.selection == 'partial' ) {
				if ( el.domobj.nodeType === 3 ) {
					// partial text node selected, so remove the selected portion
					newdata = '';
					if ( el.startOffset > 0 ) {
						newdata += el.domobj.data.substring( 0, el.startOffset );
					}
					if ( el.endOffset < el.domobj.data.length ) {
						newdata += el.domobj.data.substring( el.endOffset, el.domobj.data.length );
					}
					el.domobj.data = newdata;

					// eventually set the new range (if not done before)
					if ( !newRange.startContainer ) {
						newRange.startContainer = newRange.endContainer = el.domobj;
						newRange.startOffset = newRange.endOffset = el.startOffset;
					}
				} else if ( el.domobj.nodeType === 1 && el.children ) {
					// partial element node selected, so do the recursion into the children
					this.removeFromSelectionTree( el.children, newRange );

					if ( firstPartialElement ) {
						// when the first parially selected element is the same type
						// of element, we need to merge them
						if ( firstPartialElement.nodeName == el.domobj.nodeName ) {
							// merge the nodes
							jQuery( firstPartialElement ).append( jQuery( el.domobj ).contents() );

							// and remove the latter one
							jQuery( el.domobj ).remove();
						}

					} else {
						// remember this element as first partially selected element
						firstPartialElement = el.domobj;
					}
				}

			} else if ( el.selection == 'full' ) {
				// eventually set the new range (if not done before)
				if ( !newRange.startContainer ) {
					adjacentTextNode = GENTICS.Utils.Dom.searchAdjacentTextNode(
						el.domobj.parentNode,
						GENTICS.Utils.Dom.getIndexInParent( el.domobj ) + 1,
						false,
						{ 'blocklevel' : false }
					);

					if ( adjacentTextNode ) {
						newRange.startContainer = newRange.endContainer = adjacentTextNode;
						newRange.startOffset = newRange.endOffset = 0;
					} else {
						newRange.startContainer = newRange.endContainer = el.domobj.parentNode;
						newRange.startOffset = newRange.endOffset = GENTICS.Utils.Dom.getIndexInParent( el.domobj ) + 1;
					}
				}

				// full node selected, so just remove it (will also remove all children)
				jQuery( el.domobj ).remove();
			}
		}
	},

	/**
	 * split passed rangeObject without or with optional markup
	 * @param Aloha.Selection.SelectionRange of the current selection
	 * @param markup object (jQuery) to insert in between the split elements
	 * @return void
	 */
	splitRangeObject: function( rangeObject, markup ) {
		// UAAAA: first check where the markup can be inserted... *grrrrr*, then decide where to split
		// object which is split up
		var
			splitObject = jQuery( rangeObject.splitObject ),
			selectionTree, insertAfterObject, followUpContainer;

		// update the commonAncestor with the splitObject (so that the selectionTree is correct)
		rangeObject.update( rangeObject.splitObject ); // set the splitObject as new commonAncestorContainer and update the selectionTree

		// calculate the selection tree. NOTE: it is necessary to do this before
		// getting the followupcontainer, since getting the selection tree might
		// possibly merge text nodes, which would lead to differences in the followupcontainer
		selectionTree = rangeObject.getSelectionTree();

		// object to be inserted after the splitObject
		followUpContainer = this.getSplitFollowUpContainer( rangeObject );

		// now split up the splitObject into itself AND the followUpContainer
		this.splitRangeObjectHelper( selectionTree, rangeObject, followUpContainer ); // split the current object into itself and the followUpContainer

		// check whether the followupcontainer is still marked for removal
		if ( followUpContainer.hasClass( 'preparedForRemoval' ) ) {
			// TODO shall we just remove the class or shall we not use the followupcontainer?
			followUpContainer.removeClass( 'preparedForRemoval' );
		}

		// now let's find the place, where the followUp is inserted afterwards. normally that's the splitObject itself, but in
		// some cases it might be their parent (e.g. inside a list, a <p> followUp must be inserted outside the list)
		insertAfterObject = this.getInsertAfterObject( rangeObject, followUpContainer );

		// now insert the followUpContainer
		jQuery( followUpContainer ).insertAfter( insertAfterObject ); // attach the followUpContainer right after the insertAfterObject

		// in some cases, we want to remove the "empty" splitObject (e.g. LIs, if enter was hit twice)
		if ( rangeObject.splitObject.nodeName.toLowerCase() === 'li' && !Aloha.Selection.standardTextLevelSemanticsComparator( rangeObject.splitObject, followUpContainer ) ) {
			jQuery( rangeObject.splitObject ).remove();
		}

		rangeObject.startContainer = null;
		// first check whether the followUpContainer starts with a <br/>
		// if so, place the cursor right before the <br/>
		var followContents = followUpContainer.contents();
		if ( followContents.length > 0
			 && followContents.get( 0 ).nodeType == 1
			 && followContents.get( 0 ).nodeName.toLowerCase() === 'br' ) {
			rangeObject.startContainer = followUpContainer.get( 0 );
		}

		if ( !rangeObject.startContainer ) {
			// find a possible text node in the followUpContainer and set the selection to it
			// if no textnode is available, set the selection to the followup container itself
			rangeObject.startContainer = followUpContainer.textNodes( true, true ).first().get( 0 );
		}
		if ( !rangeObject.startContainer ) { // if no text node was found, select the parent object of <br class="aloha-ephemera" />
			rangeObject.startContainer = followUpContainer.textNodes( false ).first().parent().get( 0 );
		}
		if ( rangeObject.startContainer ) {
			// the cursor is always at the beginning of the followUp
			rangeObject.endContainer = rangeObject.startContainer;
			rangeObject.startOffset = 0;
			rangeObject.endOffset = 0;
		} else {
			rangeObject.startContainer = rangeObject.endContainer = followUpContainer.parent().get( 0 );
			rangeObject.startOffset = rangeObject.endOffset = GENTICS.Utils.Dom.getIndexInParent( followUpContainer.get( 0 ) );
		}

		// finally update the range object again
		rangeObject.update();

		// now set the selection
		rangeObject.select();
	},

	/**
	 * method to get the object after which the followUpContainer can be inserted during splitup
	 * this is a helper method, not needed anywhere else
	 * @param rangeObject Aloha.Selection.SelectionRange of the current selection
	 * @param followUpContainer optional jQuery object; if provided the rangeObject will be split and the second part will be insert inside of this object
	 * @return object after which the followUpContainer can be inserted
	 */
	getInsertAfterObject: function( rangeObject, followUpContainer ) {
		var passedSplitObject, i, el;

		for ( i = 0; i < rangeObject.markupEffectiveAtStart.length; i++ ) {
			el = rangeObject.markupEffectiveAtStart[ i ];

			// check if we have already passed the splitObject (some other markup might come before)
			if ( el === rangeObject.splitObject ) {
				passedSplitObject = true;
			}

			// if not passed splitObject, skip this markup
			if ( !passedSplitObject ) {
				continue;
			}

			// once we are passed, check if the followUpContainer is allowed to be inserted into the currents el's parent
			if ( Aloha.Selection.canTag1WrapTag2( jQuery( el ).parent()[0].nodeName, followUpContainer[0].nodeName ) ) {
				return el;
			}
		}

		return false;
	},

	/**
	 * @fixme: Someone who knows what this function does, please refactor it.
	 *			1. splitObject arg is not used at all
	 *			2. Would be better to use ternary operation would be better than if else statement
	 *
	 * method to get the html code for a fillUpElement. this is needed for empty paragraphs etc., so that they take up their expected height
	 * @param splitObject split object (dom object)
	 * @return fillUpElement HTML Code
	 */
	getFillUpElement: function( splitObject ) {
		if ( jQuery.browser.msie ) {
			return false;
		} else {
			return jQuery( '<br class="aloha-cleanme"/>' );
		}
	},

	/**
	 * removes textNodes from passed array, which only contain contentWhiteSpace (e.g. a \n between two tags)
	 * @param domArray array of domObjects
	 * @return void
	 */
	removeElementContentWhitespaceObj: function( domArray ) {
		var correction = 0,
		    removeLater = [],
		    i,
		    el, removeIndex;

		for ( i = 0; i < domArray.length; ++i ) {
			el = domArray[ i ];
			if ( el.isElementContentWhitespace ) {
				removeLater[ removeLater.length ] = i;
			}
		}

		for ( i = 0; i < removeLater.length; ++i ) {
			removeIndex = removeLater[ i ];
			domArray.splice( removeIndex - correction, 1 );
			++correction;
		}
	},

	/**
	 * recursive method to parallelly walk through two dom subtrees, leave elements before startContainer in first subtree and move rest to other
	 * @param selectionTree tree to iterate over as contained in rangeObject. must be passed separately to allow recursion in the selection tree, but not in the rangeObject
	 * @param rangeObject Aloha.Selection.SelectionRange of the current selection
	 * @param followUpContainer optional jQuery object; if provided the rangeObject will be split and the second part will be insert inside of this object
	 * @param inBetweenMarkup jQuery object to be inserted between the two split parts. will be either a <br> (if no followUpContainer is passed) OR e.g. a table, which must be inserted between the splitobject AND the follow up
	 * @return void
	 */
	splitRangeObjectHelper: function( selectionTree, rangeObject,
									  followUpContainer, inBetweenMarkup ) {
		if ( !followUpContainer ) {
			Aloha.Log.warn( this, 'no followUpContainer, no inBetweenMarkup, nothing to do...' );
		}

		var fillUpElement = this.getFillUpElement( rangeObject.splitObject ),
		    splitObject = jQuery( rangeObject.splitObject ),
		    startMoving = false,
		    el,
		    i,
		    completeText,
		    jqObj,
		    mirrorLevel,
		    parent,
		    treeLength;

		if ( selectionTree.length > 0 ) {
			mirrorLevel = followUpContainer.contents();

			// if length of mirrorLevel and selectionTree are not equal, the mirrorLevel must be corrected. this happens, when the mirrorLevel contains whitespace textNodes
			if ( mirrorLevel.length !== selectionTree.length ) {
				this.removeElementContentWhitespaceObj( mirrorLevel );
			}

			for ( i = 0, treeLength = selectionTree.length; i < treeLength; ++i ) {
				el = selectionTree[ i ];

				// remove all objects in the mirrorLevel, which are BEFORE the cursor
				// OR if the cursor is at the last position of the last Textnode (causing an empty followUpContainer to be appended)
				if ( ( el.selection === 'none' && startMoving === false ) ||
					 ( el.domobj && el.domobj.nodeType === 3
						&& el === selectionTree[ ( selectionTree.length - 1 ) ]
						&& el.startOffset === el.domobj.data.length ) ) {
					// iteration is before cursor, leave this part inside the splitObject, remove from followUpContainer
					// however if the object to remove is the last existing textNode within the followUpContainer, insert a BR instead
					// otherwise the followUpContainer is invalid and takes up no vertical space

					if ( followUpContainer.textNodes().length > 1
						 || ( el.domobj.nodeType === 1 && el.children.length === 0 ) ) {
						// note: the second part of the if (el.domobj.nodeType === 1 && el.children.length === 0) covers a very special condition,
						// where an empty tag is located right before the cursor when pressing enter. In this case the empty tag would not be
						// removed correctly otherwise
						mirrorLevel.eq( i ).remove();

					} else if ( GENTICS.Utils.Dom.isSplitObject( followUpContainer[0] ) ) {
						if ( fillUpElement ) {
							followUpContainer.html( fillUpElement ); // for your zoological german knowhow: ephemera = Eintagsfliege
						} else {
							followUpContainer.empty();
						}

					} else {
						followUpContainer.empty();
						followUpContainer.addClass( 'preparedForRemoval' );
					}

					continue;

				} else {
					// split objects, which are AT the cursor Position or directly above
					if ( el.selection !== 'none' ) { // before cursor, leave this part inside the splitObject
						// TODO better check for selection == 'partial' here?
						if ( el.domobj && el.domobj.nodeType === 3 && el.startOffset !== undefined ) {
							completeText = el.domobj.data;
							if ( el.startOffset > 0 ) {// first check, if there will be some text left in the splitObject
								el.domobj.data = completeText.substr( 0, el.startOffset );
							} else if ( selectionTree.length > 1 ) { // if not, check if the splitObject contains more than one node, because then it can be removed. this happens, when ENTER is pressed inside of a textnode, but not at the borders
								jQuery( el.domobj ).remove();
							} else { // if the "empty" textnode is the last node left in the splitObject, replace it with a ephemera break
								// if the parent is a blocklevel element, we insert the fillup element
								parent = jQuery( el.domobj ).parent();
								if ( GENTICS.Utils.Dom.isSplitObject( parent[0] ) ) {
									if ( fillUpElement ) {
										parent.html( fillUpElement );
									} else {
										parent.empty();
									}

								} else {
									// if the parent is no blocklevel element and would be empty now, we completely remove it
									parent.remove();
								}
							}
							if ( completeText.length - el.startOffset > 0 ) {
								// first check if there is text left to put in the followUpContainer's textnode. this happens, when ENTER is pressed inside of a textnode, but not at the borders
								mirrorLevel[i].data = completeText.substr( el.startOffset, completeText.length );
							} else if ( mirrorLevel.length > 1 ) {
								// if not, check if the followUpContainer contains more than one node, because if yes, the "empty" textnode can be removed
								mirrorLevel.eq( ( i ) ).remove();
							} else if ( GENTICS.Utils.Dom.isBlockLevelElement( followUpContainer[0] ) ) {
								// if the "empty" textnode is the last node left in the followUpContainer (which is a blocklevel element), replace it with a ephemera break
								if ( fillUpElement ) {
									followUpContainer.html( fillUpElement );
								} else {
									followUpContainer.empty();
								}

							} else {
								// if the "empty" textnode is the last node left in a non-blocklevel element, mark it for removal
								followUpContainer.empty();
								followUpContainer.addClass( 'preparedForRemoval' );
							}
						}

						startMoving = true;

						if ( el.children.length > 0 ) {
							this.splitRangeObjectHelper( el.children, rangeObject, mirrorLevel.eq( i ), inBetweenMarkup );
						}

					} else {
						// remove all objects in the origin, which are AFTER the cursor
						if ( el.selection === 'none' && startMoving === true ) {
							// iteration is after cursor, remove from splitObject and leave this part inside the followUpContainer
							jqObj = jQuery( el.domobj ).remove();
						}
					}
				}
			}
		} else {
			Aloha.Log.error( this, 'can not split splitObject due to an empty selection tree' );
		}

		// and finally cleanup: remove all fillUps > 1
		splitObject.find( 'br.aloha-ephemera:gt(0)' ).remove(); // remove all elements greater than (gt) 0, that also means: leave one
		followUpContainer.find( 'br.aloha-ephemera:gt(0)' ).remove(); // remove all elements greater than (gt) 0, that also means: leave one

		// remove objects prepared for removal
		splitObject.find( '.preparedForRemoval' ).remove();
		followUpContainer.find( '.preparedForRemoval' ).remove();

		// if splitObject / followUp are empty, place a fillUp inside
		if ( splitObject.contents().length === 0
			 && GENTICS.Utils.Dom.isSplitObject( splitObject[0] )
			 && fillUpElement ) {
			splitObject.html( fillUpElement );
		}

		if ( followUpContainer.contents().length === 0
			 && GENTICS.Utils.Dom.isSplitObject( followUpContainer[0] )
			 && fillUpElement ) {
			followUpContainer.html( fillUpElement );
		}
	},

	/**
	 * returns a jQuery object fitting the passed splitObject as follow up object
	 * examples,
	 * - when passed a p it will return an empty p (clone of the passed p)
	 * - when passed an h1, it will return either an h1 (clone of the passed one) or a new p (if the collapsed selection was at the end)
	 * @param rangeObject Aloha.RangeObject
	 * @return void
	 */
	getSplitFollowUpContainer: function( rangeObject ) {
		var tagName = rangeObject.splitObject.nodeName.toLowerCase(),
		    returnObj,
		    inside,
		    lastObj;

		switch ( tagName ) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				// get the last textnode in the splitobject, but don't consider aloha-cleanme elements
				lastObj = jQuery( rangeObject.splitObject ).textNodes( ':not(.aloha-cleanme)' ).last()[0];
				// special case: when enter is hit at the end of a heading, the followUp should be a <p>
				if ( lastObj && rangeObject.startContainer === lastObj
					 && rangeObject.startOffset === lastObj.length ) {
					returnObj = jQuery( '<p></p>' );
					inside = jQuery( rangeObject.splitObject ).clone().contents();
					returnObj.append( inside );
					return returnObj;
				}
				break;

			case 'li':
				// TODO check whether the li is the last one
				// special case: if enter is hit twice inside a list, the next item should be a <p> (and inserted outside the list)
				if ( rangeObject.startContainer.nodeName.toLowerCase() === 'br'
					 && jQuery( rangeObject.startContainer ).hasClass( 'aloha-ephemera' ) ) {
					returnObj = jQuery( '<p></p>' );
					inside = jQuery( rangeObject.splitObject ).clone().contents();
					returnObj.append( inside );
					return returnObj;
				}
				// when the li is the last one and empty, we also just return a <p>
				if ( !rangeObject.splitObject.nextSibling
					 && jQuery.trim( jQuery( rangeObject.splitObject ).text() ).length === 0 ) {
					returnObj = jQuery( '<p></p>' );
					return returnObj;
				}
		}

		return jQuery( rangeObject.splitObject ).clone();
	},

	/**
	 * Transform the given domobj into an object with the given new nodeName.
	 * Preserves the content and all attributes. If a range object is given, also the range will be preserved
	 * @param domobj dom object to transform
	 * @param nodeName new node name
	 * @param range range object
	 * @api
	 * @return new object as jQuery object
	 */
	transformDomObject: function( domobj, nodeName, range ) {
		// first create the new element
		var jqOldObj = jQuery( domobj ),
		    jqNewObj = jQuery( '<' + nodeName + '></' + nodeName + '>' ),
		    i;

		// TODO what about events? css properties?

		// copy attributes
		if ( jqOldObj[0].attributes ) {
			for ( i = 0; i < jqOldObj[0].attributes.length; ++i ) {
				jqNewObj.attr(
					jqOldObj[0].attributes[ i ].nodeName,
					jqOldObj[0].attributes[ i ].nodeValue
				);
			}
		}

		// copy inline CSS
		if ( jqOldObj[0].style && jqOldObj[0].style.cssText ) {
			jqNewObj[0].style.cssText = jqOldObj[0].style.cssText;
		}

		// now move the contents of the old dom object into the new dom object
		jqOldObj.contents().appendTo( jqNewObj );

		// finally replace the old object with the new one
		jqOldObj.replaceWith( jqNewObj );

		// preserve the range
		if ( range ) {
			if ( range.startContainer == domobj ) {
				range.startContainer = jqNewObj.get( 0 );
			}

			if ( range.endContainer == domobj ) {
				range.endContainer = jqNewObj.get( 0 );
			}
		}

		return jqNewObj;
	},

	/**
	 * String representation
	 * @return {String}
	 */
	toString: function() {
		return 'Aloha.Markup';
	}

} );

Aloha.Markup = new Aloha.Markup();

return Aloha.Markup;

} );

/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright � 2010-2011 Gentics Software GmbH, aloha@gentics.com
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

define('aloha/observable',['aloha/jquery'],
function(jQuery, undefined) {
	
	
	var
		$ = jQuery;

	return {
		_eventHandlers: null,

		/**
		 * Attach a handler to an event
		 *
		 * @param {String} eventType A string containing the event name to bind to
		 * @param {Function} handler A function to execute each time the event is triggered
		 * @param {Object} scope Optional. Set the scope in which handler is executed
		 */
		bind: function(eventType, handler, scope) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				this._eventHandlers[eventType] = [];
			}
			this._eventHandlers[eventType].push({
				handler: handler,
				scope: (scope ? scope : window)
			});
		},

		/**
		 * Remove a previously-attached event handler
		 *
		 * @param {String} eventType A string containing the event name to unbind
		 * @param {Function} handler The function that is to be no longer executed. Optional. If not given, unregisters all functions for the given event.
		 */
		unbind: function(eventType, handler) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				return;
			}
			if (!handler) {
				// No handler function given, unbind all event handlers for the eventType
				this._eventHandlers[eventType] = [];
			} else {
				this._eventHandlers[eventType] = $.grep(this._eventHandlers[eventType], function(element) {
					if (element.handler === handler) {
						return false;
					}
					return true;
				});
			}
		},

		/**
		 * Execute all handlers attached to the given event type.
		 * All arguments except the eventType are directly passed to the callback function.
		 *
		 * @param (String} eventType A string containing the event name for which the event handlers should be invoked.
		 */
		trigger: function(eventType) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				return;
			}

			// preparedArguments contains all arguments except the first one.
			var preparedArguments = [];
			$.each(arguments, function(i, argument) {
				if (i>0) {
					preparedArguments.push(argument);
				}
			});

			$.each(this._eventHandlers[eventType], function(index, element) {
				element.handler.apply(element.scope, preparedArguments);
			});
		},

		/**
		 * Clears all event handlers. Call this method when cleaning up.
		 */
		unbindAll: function() {
			this._eventHandlers = null;
		}
	};
});
/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */

/**
 * Registry base class.
 * TODO: document that it also contains Observable.
 *
 */
define('aloha/registry',['aloha/jquery', 'aloha/observable'],
function(jQuery, Observable) {
	

	return Class.extend(Observable, {

		_entries: null,

		_constructor: function() {
			this._entries = {};
		},

		/**
		 * @event register
		 * @param entry
		 * @param id
		 */
		register: function(id, entry) {
			this._entries[id] = entry;
			this.trigger('register', entry, id);
		},

		/**
		 * @event unregister
		 * @param odEntry
		 * @param id
		 */
		unregister: function(id) {
			var oldEntry = this._entries[id];
			delete this._entries[id];
			this.trigger('unregister', oldEntry, id);
		},
		
		get: function(id) {
			return this._entries[id];
		},
		
		has: function(id) {
			return (this._entries[id] ? true : false);
		},
		
		getEntries: function() {
			// clone the entries so the user does not accidentally modify our _entries object.
			return jQuery.extend({}, this._entries);
		}
	});
});
/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define('aloha/contenthandlermanager',['aloha/jquery', 'aloha/registry'],
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
/*!
 * This file is part of Aloha Editor Project http://aloha-editor.org
 * Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
 * Contributors http://aloha-editor.org/contribution.php
 * Licensed unter the terms of http://www.aloha-editor.org/license.html
 *
 * Aloha Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * ( at your option ) any later version.*
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

define('aloha/editable',[
	'aloha/core',
	'util/class',
	'aloha/jquery',
	'aloha/pluginmanager',
	'aloha/floatingmenu',
	'aloha/selection',
	'aloha/markup',
	'aloha/contenthandlermanager',
	'aloha/console'
], function( Aloha, Class, jQuery, PluginManager, FloatingMenu, Selection,
	         Markup, ContentHandlerManager, console ) {
	

	var unescape = window.unescape,
	    GENTICS = window.GENTICS,

	    // True, if the next editable activate event should not be handled
	    ignoreNextActivateEvent = false;

	// default supported and custom content handler settings
	// @TODO move to new config when implemented in Aloha
	Aloha.defaults.contentHandler = {};
	Aloha.defaults.contentHandler.initEditable = [ 'sanitize' ];
	Aloha.defaults.contentHandler.getContents = [ 'sanitize' ];

	// The insertHtml contenthandler ( paste ) will, by default, use all
	// registered content handlers.
	//Aloha.defaults.contentHandler.insertHtml = void 0;

	if ( typeof Aloha.settings.contentHandler === 'undefined' ) {
		Aloha.settings.contentHandler = {};
	}

	var defaultContentSerializer = function(editableElement){
		return jQuery(editableElement).html();
	};

	var contentSerializer = defaultContentSerializer;

	/**
	 * Editable object
	 * @namespace Aloha
	 * @class Editable
	 * @method
	 * @constructor
	 * @param {Object} obj jQuery object reference to the object
	 */
	Aloha.Editable = Class.extend( {

		_constructor: function( obj ) {
			// check wheter the object has an ID otherwise generate and set
			// globally unique ID
			if ( !obj.attr( 'id' ) ) {
				obj.attr( 'id', GENTICS.Utils.guid() );
			}

			// store object reference
			this.obj = obj;
			this.originalObj = obj;
			this.ready = false;

			// delimiters, timer and idle for smartContentChange
			// smartContentChange triggers -- tab: '\u0009' - space: '\u0020' - enter: 'Enter'
			// backspace: U+0008 - delete: U+007F
			this.sccDelimiters = [ ':', ';', '.', '!', '?', ',',
				unescape( '%u0009' ), unescape( '%u0020' ), unescape( '%u0008' ), unescape( '%u007F' ), 'Enter' ];
			this.sccIdle = 5000;
			this.sccDelay = 500;
			this.sccTimerIdle = false;
			this.sccTimerDelay = false;

			// see keyset http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html
			this.keyCodeMap = {
				 93 : 'Apps',         // The Application key
				 18 : 'Alt',          // The Alt ( Menu ) key.
				 20 : 'CapsLock',     // The Caps Lock ( Capital ) key.
				 17 : 'Control',      // The Control ( Ctrl ) key.
				 40 : 'Down',         // The Down Arrow key.
				 35 : 'End',          // The End key.
				 13 : 'Enter',        // The Enter key.
				112 : 'F1',           // The F1 key.
				113 : 'F2',           // The F2 key.
				114 : 'F3',           // The F3 key.
				115 : 'F4',           // The F4 key.
				116 : 'F5',           // The F5 key.
				117 : 'F6',           // The F6 key.
				118 : 'F7',           // The F7 key.
				119 : 'F8',           // The F8 key.
				120 : 'F9',           // The F9 key.
				121 : 'F10',          // The F10 key.
				122 : 'F11',          // The F11 key.
				123 : 'F12',          // The F12 key.

				// Anybody knows the keycode for F13-F24?
				 36 : 'Home',         // The Home key.
				 45 : 'Insert',       // The Insert ( Ins ) key.
				 37 : 'Left',         // The Left Arrow key.
				224 : 'Meta',         // The Meta key.
				 34 : 'PageDown',     // The Page Down ( Next ) key.
				 33 : 'PageUp',       // The Page Up key.
				 19 : 'Pause',        // The Pause key.
				 44 : 'PrintScreen',  // The Print Screen ( PrintScrn, SnapShot ) key.
				 39 : 'Right',        // The Right Arrow key.
				145 : 'Scroll',       // The scroll lock key
				 16 : 'Shift',        // The Shift key.
				 38 : 'Up',           // The Up Arrow key.
				 91 : 'Win',          // The left Windows Logo key.
				 92 : 'Win'           // The right Windows Logo key.
			};

			this.placeholderClass = 'aloha-placeholder';

			Aloha.registerEditable( this );

			this.init();
		},

		/**
		 * Initialize the editable
		 * @return void
		 * @hide
		 */
		init: function() {
			var me = this;

			// TODO make editables their own settings.
			this.settings = Aloha.settings;

			// smartContentChange settings
			// @TODO move to new config when implemented in Aloha
			if ( Aloha.settings && Aloha.settings.smartContentChange ) {
				if ( Aloha.settings.smartContentChange.delimiters ) {
					this.sccDelimiters = Aloha.settings.smartContentChange.delimiters;
				}

				if ( Aloha.settings.smartContentChange.idle ) {
					this.sccIdle = Aloha.settings.smartContentChange.idle;
				}

				if ( Aloha.settings.smartContentChange.delay ) {
					this.sccDelay = Aloha.settings.smartContentChange.delay;
				}
			}

			// check if Aloha can handle the obj as Editable
			if ( !this.check( this.obj ) ) {
				//Aloha.log( 'warn', this, 'Aloha cannot handle {' + this.obj[0].nodeName + '}' );
				this.destroy();
				return;
			}

			// apply content handler to clean up content
			if ( typeof Aloha.settings.contentHandler.initEditable === 'undefined' ) {
				Aloha.settings.contentHandler.initEditable = Aloha.defaults.contentHandler.initEditable;
			}
			
			var content = me.obj.html();
			content = ContentHandlerManager.handleContent( content, {
				contenthandler: Aloha.settings.contentHandler.initEditable
			} );
			me.obj.html( content );

			// only initialize the editable when Aloha is fully ready (including plugins)
			Aloha.bind( 'aloha-ready', function() {
				// initialize the object
				me.obj.addClass( 'aloha-editable' ).contentEditable( true );

				// add focus event to the object to activate
				me.obj.mousedown( function( e ) {
					// check whether the mousedown was already handled
					if ( !Aloha.eventHandled ) {
						Aloha.eventHandled = true;
						return me.activate( e );
					}
				} );

				me.obj.mouseup( function( e ) {
					Aloha.eventHandled = false;
				} );

				me.obj.focus( function( e ) {
					return me.activate( e );
				} );

				// by catching the keydown we can prevent the browser from doing its own thing
				// if it does not handle the keyStroke it returns true and therefore all other
				// events (incl. browser's) continue
				me.obj.keydown( function( event ) {
					var letEventPass = Markup.preProcessKeyStrokes( event );
					me.keyCode = event.which;
					if (!letEventPass) {
						// the event will not proceed to key press, therefore trigger smartContentChange
						me.smartContentChange( event );
					}
					return letEventPass;
				} );

				// handle keypress
				me.obj.keypress( function( event ) {
					// triggers a smartContentChange to get the right charcode
					// To test try http://www.w3.org/2002/09/tests/keys.html
					Aloha.activeEditable.smartContentChange( event );
				} );

				// handle shortcut keys
				me.obj.keyup( function( event ) {
					if ( event.keyCode === 27 ) {
						Aloha.deactivateEditable();
						return false;
					}
				} );

				// register the onSelectionChange Event with the Editable field
				me.obj.contentEditableSelectionChange( function( event ) {
					Selection.onChange( me.obj, event );
					return me.obj;
				} );

				// mark the editable as unmodified
				me.setUnmodified();

				// we don't do the sanitizing on aloha ready, since some plugins add elements into the content and bind events to it.
				// if we sanitize by replacing the html, all events would get lost. TODO: think about a better solution for the sanitizing, without
				// destroying the events
//				// apply content handler to clean up content
//				var content = me.obj.html();
//				if ( typeof Aloha.settings.contentHandler.initEditable === 'undefined' ) {
//					Aloha.settings.contentHandler.initEditable = Aloha.defaults.contentHandler.initEditable;
//				}
//				content = ContentHandlerManager.handleContent( content, {
//					contenthandler: Aloha.settings.contentHandler.initEditable
//				} );
//				me.obj.html( content );

				me.snapshotContent = me.getContents();

				// FF bug: check for empty editable contents ( no <br>; no whitespace )
				if ( jQuery.browser.mozilla ) {
					me.initEmptyEditable();
				}

				me.initPlaceholder();

				me.ready = true;

				// throw a new event when the editable has been created
				/**
				 * @event editableCreated fires after a new editable has been created, eg. via $( '#editme' ).aloha()
				 * The event is triggered in Aloha's global scope Aloha
				 * @param {Event} e the event object
				 * @param {Array} a an array which contains a reference to the currently created editable on its first position
				 */
				Aloha.trigger( 'aloha-editable-created', [ me ] );
			} );
		},

		/**
		 * True, if this editable is active for editing
		 * @property
		 * @type boolean
		 */
		isActive: false,

		/**
		 * stores the original content to determine if it has been modified
		 * @hide
		 */
		originalContent: null,

		/**
		 * every time a selection is made in the current editable the selection has to
		 * be saved for further use
		 * @hide
		 */
		range: undefined,

		/**
		 * Check if object can be edited by Aloha Editor
		 * @return {boolean } editable true if Aloha Editor can handle else false
		 * @hide
		 */
		check: function() {
			/* TODO check those elements
			'map', 'meter', 'object', 'output', 'progress', 'samp',
			'time', 'area', 'datalist', 'figure', 'kbd', 'keygen',
			'mark', 'math', 'wbr', 'area',
			*/

			// Extract El
			var	me = this,
			    obj = this.obj,
			    el = obj.get( 0 ),
			    nodeName = el.nodeName.toLowerCase(),

				// supported elements
			    textElements = [ 'a', 'abbr', 'address', 'article', 'aside',
						'b', 'bdo', 'blockquote',  'cite', 'code', 'command',
						'del', 'details', 'dfn', 'div', 'dl', 'em', 'footer',
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'i',
						'ins', 'menu', 'nav', 'p', 'pre', 'q', 'ruby',
						'section', 'small', 'span', 'strong', 'sub', 'sup',
						'var' ],
			    i, div;

			for ( i = 0; i < textElements.length; ++i ) {
				if ( nodeName === textElements[ i ] ) {
					return true;
				}
			}

			// special handled elements
			switch ( nodeName ) {
				case 'label':
				case 'button':
					// TODO need some special handling.
					break;
				case 'textarea':
					// Create a div alongside the textarea
					div = jQuery( '<div id="' + this.getId() +
							'-aloha" class="aloha-textarea" />' )
								.insertAfter( obj );

					// Resize the div to the textarea and
					// Populate the div with the value of the textarea
					// Then, hide the textarea
					div.height( obj.height() )
					   .width( obj.width() )
					   .html( obj.val() );

					obj.hide();

					// Attach a onsubmit to the form to place the HTML of the
					// div back into the textarea
					obj.parents( 'form:first' ).submit( function() {
						obj.val( me.getContents() );
					} );

					// Swap textarea reference with the new div
					this.obj = div;

					// Supported
					return true;
				default:
					break;
			}

			// the following elements are not supported
			/*
			'canvas', 'audio', 'br', 'embed', 'fieldset', 'hgroup', 'hr',
			'iframe', 'img', 'input', 'map', 'script', 'select', 'style',
			'svg', 'table', 'ul', 'video', 'ol', 'form', 'noscript',
			 */
			return false;
		},

		/**
		 * Init Placeholder
		 *
		 * @return void
		 */
		initPlaceholder: function() {
			if ( Aloha.settings.placeholder && this.isEmpty() ) {
				this.addPlaceholder();
			}
		},

		/**
		 * Check if the conteneditable is empty.
		 *
		 * @return {Boolean}
		 */
		isEmpty: function() {
			var editableTrimedContent = jQuery.trim( this.getContents() ),
				onlyBrTag = ( editableTrimedContent === '<br>' ) ? true : false;
			return ( editableTrimedContent.length === 0 || onlyBrTag );
		},

		/**
		 * Check if the editable div is not empty. Fixes a FF browser bug
		 * see issue: https://github.com/alohaeditor/Aloha-Editor/issues/269
		 *
		 * @return {undefined}
		 */
		initEmptyEditable: function( ) {
			var obj = this.obj;
			if ( this.empty( this.getContents() ) ) {
				jQuery( obj ).prepend( '<br class="aloha-cleanme" />' );
			}
		},

		/**
		 * Add placeholder in editable
		 *
		 * @return void
		 */
		addPlaceholder: function() {
			var div = jQuery( '<div>' ),
			    span = jQuery( '<span>' ),
			    el,
			    obj = this.obj;

			if ( GENTICS.Utils.Dom.allowsNesting( obj[0], div[0] ) ) {
				el = div;
			} else {
				el = span;
			}

			jQuery( obj ).append( el.addClass( this.placeholderClass ) );
			jQuery.each(
				Aloha.settings.placeholder,
				function( selector, selectorConfig ) {
					if ( obj.is( selector ) ) {
						el.html( selectorConfig );
					}
				}
			);

			// remove browser br
			jQuery( 'br', obj ).remove();

			// delete div, span, el;
		},

		/**
		 * remove placeholder from contenteditable. If setCursor is true,
		 * will also set the cursor to the start of the selection. However,
		 * this will be ASYNCHRONOUS, so if you rely on the fact that
		 * the placeholder is removed after calling this method, setCursor
		 * should be false ( or not set )
		 *
		 * @return void
		 */
		removePlaceholder: function( obj, setCursor ) {
			var placeholderClass = this.placeholderClass,
			    range;

			// remove browser br
			// jQuery( 'br', obj ).remove();

			// set the cursor // remove placeholder
			if ( setCursor === true ) {
				range = Selection.getRangeObject();
				if ( !range.select ) {
					return;
				}
				range.startContainer = range.endContainer = obj.get( 0 );
				range.startOffset = range.endOffset = 0;
				range.select();

				window.setTimeout( function() {
					jQuery( '.' + placeholderClass, obj ).remove();
				}, 20 );

			} else {
				jQuery( '.' + placeholderClass, obj ).remove();
			}
		},

		/**
		 * destroy the editable
		 * @return void
		 */
		destroy: function() {
			// leave the element just to get sure
			if ( this === Aloha.getActiveEditable() ) {
				this.blur();

				// also hide the floating menu if the current editable was active
				FloatingMenu.hide();
			}

			// special handled elements
			switch ( this.originalObj.get( 0 ).nodeName.toLowerCase() ) {
				case 'label':
				case 'button':
					// TODO need some special handling.
					break;
				case 'textarea':
					// restore content to original textarea
					this.originalObj.val( this.getContents() );
					this.obj.remove();
					this.originalObj.show();
					break;
				default:
					break;
			}

			// now the editable is not ready any more
			this.ready = false;

			// remove the placeholder if needed.
			this.removePlaceholder( this.obj );

			// initialize the object and disable contentEditable
			// unbind all events
			// TODO should only unbind the specific handlers.
			this.obj.removeClass( 'aloha-editable' )
			    .contentEditable( false )
			    .unbind( 'mousedown click dblclick focus keydown keypress keyup' );

			/* TODO remove this event, it should implemented as bind and unbind
			// register the onSelectionChange Event with the Editable field
			this.obj.contentEditableSelectionChange( function( event ) {
				Aloha.Selection.onChange( me.obj, event );
				return me.obj;
			} );
			*/

			// throw a new event when the editable has been created
			/**
			 * @event editableCreated fires after a new editable has been destroyes, eg. via $( '#editme' ).mahalo()
			 * The event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to the currently created editable on its first position
			 */
			Aloha.trigger( 'aloha-editable-destroyed', [ this ] );

			// finally register the editable with Aloha
			Aloha.unregisterEditable( this );
		},

		/**
		 * marks the editables current state as unmodified. Use this method to inform the editable
		 * that it's contents have been saved
		 * @method
		 */
		setUnmodified: function() {
			this.originalContent = this.getContents();
		},

		/**
		 * check if the editable has been modified during the edit process#
		 * @method
		 * @return boolean true if the editable has been modified, false otherwise
		 */
		isModified: function() {
			return this.originalContent !== this.getContents();
		},

		/**
		 * String representation of the object
		 * @method
		 * @return Aloha.Editable
		 */
		toString: function() {
			return 'Aloha.Editable';
		},

		/**
		 * check whether the editable has been disabled
		 */
		isDisabled: function() {
			return !this.obj.contentEditable()
				|| this.obj.contentEditable() === 'false';
		},

		/**
		 * disable this editable
		 * a disabled editable cannot be written on by keyboard
		 */
		disable: function() {
			return this.isDisabled() || this.obj.contentEditable( false );
		},

		/**
		 * enable this editable
		 * reenables a disabled editable to be writteable again
		 */
		enable: function() {
			return this.isDisabled() && this.obj.contentEditable( true );
		},


		/**
		 * activates an Editable for editing
		 * disables all other active items
		 * @method
		 */
		activate: function( e ) {
			// get active Editable before setting the new one.
			var oldActive = Aloha.getActiveEditable();

			// We need to ommit this call when this flag is set to true.
			// This flag will only be set to true before the removePlaceholder method
			// is called since that method invokes a focus event which will again trigger
			// this method. We want to avoid double invokation of this method.
			if ( ignoreNextActivateEvent ) {
				ignoreNextActivateEvent = false;
				return;
			}

			// handle special case in which a nested editable is focused by a click
			// in this case the "focus" event would be triggered on the parent element
			// which actually shifts the focus away to it's parent. this if is here to
			// prevent this situation
			if ( e && e.type === 'focus' && oldActive !== null
			     && oldActive.obj.parent().get( 0 ) === e.currentTarget ) {
				return;
			}

			// leave immediately if this is already the active editable
			if ( this.isActive || this.isDisabled() ) {
				// we don't want parent editables to be triggered as well, so return false
				return;
			}

			this.obj.addClass( 'aloha-editable-active' );

			Aloha.activateEditable( this );

			ignoreNextActivateEvent = true;
			this.removePlaceholder ( this.obj, true );
			ignoreNextActivateEvent = false;

			this.isActive = true;

			/**
			 * @event editableActivated fires after the editable has been activated by clicking on it.
			 * This event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to last active editable on its first position, as well
			 * as the currently active editable on it's second position
			 */
			// trigger a 'general' editableActivated event
			Aloha.trigger( 'aloha-editable-activated', {
				'oldActive' : oldActive,
				'editable'  : this
			} );
		},

		/**
		 * handle the blur event
		 * this must not be attached to the blur event, which will trigger far too often
		 * eg. when a table within an editable is selected
		 * @hide
		 */
		blur: function() {
			this.obj.blur();
			this.isActive = false;
			this.initPlaceholder();
			this.obj.removeClass( 'aloha-editable-active' );

			/**
			 * @event editableDeactivated fires after the editable has been activated by clicking on it.
			 * This event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to this editable
			 */
			Aloha.trigger( 'aloha-editable-deactivated', { editable : this } );

			/**
			 * @event smartContentChanged
			 */
			Aloha.activeEditable.smartContentChange( { type : 'blur' }, null );
		},

		/**
		 * check if the string is empty
		 * used for zerowidth check
		 * @return true if empty or string is null, false otherwise
		 * @hide
		 */
		empty: function( str ) {
			// br is needed for chrome
			return ( null === str )
				|| ( jQuery.trim( str ) === '' || str === '<br/>' );
		},

		/**
		 * Get the contents of this editable as a HTML string
		 * @method
		 * @return contents of the editable
		 */
		getContents: function( asObject ) {
			var clonedObj = this.obj.clone( false );

			// do core cleanup
			clonedObj.find( '.aloha-cleanme' ).remove();
			this.removePlaceholder( clonedObj );
			PluginManager.makeClean( clonedObj );

			return asObject ? clonedObj.contents() : contentSerializer(clonedObj[0]);
		},

		/**
		 * Set the contents of this editable as a HTML string
		 * @param content as html
		 * @param return as object or html string
		 * @return contents of the editable
		 */
		setContents: function( content, asObject ) {
			var reactivate = null;

			if ( Aloha.getActiveEditable() === this ) {
				Aloha.deactivateEditable();
				reactivate = this;
			}

			this.obj.html( content );

			if ( null !== reactivate ) {
				reactivate.activate();
			}

			this.smartContentChange({type : 'set-contents'});

			return asObject ? this.obj.contents() : contentSerializer(this.obj[0]);
		},

		/**
		 * Get the id of this editable
		 * @method
		 * @return id of this editable
		 */
		getId: function() {
			return this.obj.attr( 'id' );
		},

		/**
		 * Generates and signals a smartContentChange event.
		 *
		 * A smart content change occurs when a special editing action, or a
		 * combination of interactions are performed by the user during the
		 * course of editing within an editable.
		 * The smart content change event would therefore signal to any
		 * component that is listening to this event, that content has been
		 * inserted into the editable that may need to be prococessed in a
		 * special way
		 * This is used for smart actions within the content/while editing.
		 * @param {Event} event
		 * @hide
		 */
		smartContentChange: function( event ) {
			var me = this,
			    uniChar = null,
			    re,
			    match;

			// ignore meta keys like crtl+v or crtl+l and so on
			if ( event && ( event.metaKey || event.crtlKey || event.altKey ) ) {
				return false;
			}

			if ( event && event.originalEvent ) {
				// regex to strip unicode
				re = new RegExp( "U\\+(\\w{4})" );
				match = re.exec( event.originalEvent.keyIdentifier );

				// Use keyIdentifier if available
				if ( event.originalEvent.keyIdentifier && 1 === 2 ) {
					// @fixme: Because of "&& 1 === 2" above, this block is
					// unreachable code
					if ( match !== null ) {
						uniChar = unescape( '%u' + match[1] );
					}
					if ( uniChar === null ) {
						uniChar = event.originalEvent.keyIdentifier;
					}

				// FF & Opera don't support keyIdentifier
				} else {
					// Use among browsers reliable which http://api.jquery.com/keypress
					uniChar = ( this.keyCodeMap[ this.keyCode ] ||
								String.fromCharCode( event.which ) || 'unknown' );
				}
			}

			// handle "Enter" -- it's not "U+1234" -- when returned via "event.originalEvent.keyIdentifier"
			// reference: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html
			if ( jQuery.inArray( uniChar, this.sccDelimiters ) >= 0 ) {
				clearTimeout( this.sccTimerIdle );
				clearTimeout( this.sccTimerDelay );

				this.sccTimerDelay = setTimeout( function() {
					Aloha.trigger( 'aloha-smart-content-changed', {
						'editable'        : me,
						'keyIdentifier'   : event.originalEvent.keyIdentifier,
						'keyCode'         : event.keyCode,
						'char'            : uniChar,
						'triggerType'     : 'keypress', // keypress, timer, blur, paste
						'snapshotContent' : me.getSnapshotContent()
					} );

					console.debug( 'Aloha.Editable',
						'smartContentChanged: event type keypress triggered' );
					/*
					var r = Aloha.Selection.rangeObject;
					if ( r.isCollapsed() && r.startContainer.nodeType == 3 ) {
						var posDummy = jQuery( '<span id="GENTICS-Aloha-PosDummy" />' );
						GENTICS.Utils.Dom.insertIntoDOM(
							posDummy,
							r,
							this.obj,
							null,
							false,
							false
						);
						console.log( posDummy.offset().top, posDummy.offset().left );
						GENTICS.Utils.Dom.removeFromDOM(
							posDummy,
							r,
							false
						);
						r.select();
					}
					*/
				}, this.sccDelay );

			} else if ( event && event.type === 'paste' ) {
				Aloha.trigger( 'aloha-smart-content-changed', {
					'editable'        : me,
					'keyIdentifier'   : null,
					'keyCode'         : null,
					'char'            : null,
					'triggerType'     : 'paste',
					'snapshotContent' : me.getSnapshotContent()
				} );

			} else if ( event && event.type === 'blur' ) {
				Aloha.trigger( 'aloha-smart-content-changed', {
					'editable'        : me,
					'keyIdentifier'   : null,
					'keyCode'         : null,
					'char'            : null,
					'triggerType'     : 'blur',
					'snapshotContent' : me.getSnapshotContent()
				} );

			} else if ( uniChar !== null ) {
				// in the rare case idle time is lower then delay time
				clearTimeout( this.sccTimerDelay );
				clearTimeout( this.sccTimerIdle );
				this.sccTimerIdle = setTimeout( function() {
					Aloha.trigger( 'aloha-smart-content-changed', {
						'editable'        : me,
						'keyIdentifier'   : null,
						'keyCode'         : null,
						'char'            : null,
						'triggerType'     : 'idle',
						'snapshotContent' : me.getSnapshotContent()
					} );
				}, this.sccIdle );
			}
		},

		/**
		 * Get a snapshot of the active editable as a HTML string
		 * @hide
		 * @return snapshot of the editable
		 */
		getSnapshotContent: function() {
			var ret = this.snapshotContent;
			this.snapshotContent = this.getContents();
			return ret;
		}
	} );

	/**
	 * Sets the serializer function to be used for the contents of all editables.
	 *
	 * The default content serializer will just call the jQuery.html()
	 * function on the editable element (which gets the innerHTML property).
	 *
	 * This method is a static class method and will affect the result
	 * of editable.getContents() for all editables that have been or
	 * will be constructed.
	 *
	 * @param serializerFunction
	 *        A function that accepts a DOM element and returns the serialized
	 *        XHTML of the element contents (excluding the start and end tag of
	 *        the passed element).
	 */
	Aloha.Editable.setContentSerializer = function( serializerFunction ) {
		contentSerializer = serializerFunction;
	};
} );

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

define('aloha/message',['aloha/core', 'util/class', 'aloha/jquery'],
function( Aloha, Class, jQuery ) {
	
	
	var
//		Aloha = window.Aloha,
//		Class = window.Class,
		GENTICS = window.GENTICS;

/**
 * Message Object
 * @namespace Aloha
 * @class Message
 * @constructor
 * @param {Object} data object which contains the parts of the message
 *		title: the title
 *		text: the message text to be displayed
 *		type: one of Aloha.Message.Type
 *		callback: callback function, which will be triggered after the message was confirmed, closed or accepted
 */
Aloha.Message = Class.extend({
	_constructor: function (data) {
		this.title = data.title;
		this.text = data.text;
		this.type = data.type;
		this.callback = data.callback;
	},



	/**
	 * Returns a textual representation of the message
	 * @return textual representation of the message
	 * @hide
	 */
	toString: function () {
	  return this.type + ': ' + this.message;
	}
});

/**
 * Message types enum. Contains all allowed types of messages
 * @property
 */
Aloha.Message.Type = {
	// reserved for messages
	//	SUCCESS : 'success',
	//	INFO : 'info',
	//	WARN : 'warn',
	//	CRITICAL : 'critical',
	CONFIRM : 'confirm', // confirm dialog, like js confirm()
	ALERT : 'alert', // alert dialog like js alert()
	WAIT : 'wait' // wait dialog with loading bar. has to be hidden via Aloha.hideMessage()
};

/**
 * This is the message line
 * @hide
 */
Aloha.MessageLine = Class.extend({
	messages: [],

	/**
	 * Add a new message to the message line
	 * @param message message to add
	 * @return void
	 * @hide
	 */
	add: function(message) {
		var messageline = '',
			messagesLength = this.messages.length,
			i;
		
		// dummy implementation to add a message
		this.messages[messagesLength] = message;
		while(messagesLength > 4) {
			this.messages.shift();
			--messagesLength;
		}

		for ( i = 0; i < messagesLength; i++) {
			messageline += this.messages[i].toString() + '<br/>';
		}
		jQuery('#gtx_aloha_messageline').html(messageline);
	}
});

/**
 * Message Line Object
 * @hide
 */
Aloha.MessageLine = new Aloha.MessageLine();

});

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

define('aloha/plugin',['aloha/core', 'aloha/jquery', 'util/class', 'aloha/pluginmanager', 'aloha/console'],
function(Aloha, jQuery, Class, PluginManager, console ) {
	
	
	/**
	 * Abstract Plugin Object
	 * @namespace Aloha
	 * @class Plugin
	 * @constructor
	 * @param {String} pluginPrefix unique plugin prefix
	 */
	var Plugin = Class.extend({
		
		name: null,

		/**
		 * contains the plugin's default settings object
		 * @cfg {Object} default settings for the plugin
		 */
		defaults: {},

		/**
		 * contains the plugin's settings object
		 * @cfg {Object} settings the plugins settings stored in an object
		 */
		settings: {},
		
		/**
		 * Names of other plugins which must be loaded in order for this plugin to
		 * function.
		 * @cfg {Array}
		 */
		dependencies: [],

		_constructor: function( name ) {
			/**
			 * Settings of the plugin
			 */
			if (typeof name !== "string") {
				console.error('Cannot initialise unnamed plugin, skipping');
			} else {
				this.name = name;
			}
		},

		/**
		 * @return true if dependencies satisfied, false otherwise
		 */
		checkDependencies: function() {
			var 
				dependenciesSatisfied = true, 
				that = this;
			
			jQuery.each(this.dependencies, function() {
				
				if (!Aloha.isPluginLoaded(this)) {
					dependenciesSatisfied = false;
					console.error('plugin.' + that.name, 'Required plugin "' + this + '" not found.');
				}
			});
			
			return dependenciesSatisfied;
		},

		/**
		 * Init method of the plugin. Called from Aloha Core to initialize this plugin
		 * @return void
		 * @hide
		 */
		init: function() {},

		/**
		 * Get the configuration settings for an editable obj.
		 * Handles both conf arrays or conf objects
		 * <ul>
		 * <li>Array configuration parameters are:
		 * <pre>
		 * "list": {
		 *		config : [ 'b', 'h1' ],
		 *		editables : {
		 *			'#title'	: [ ],
		 *			'div'		: [ 'b', 'i' ],
		 *			'.article'	: [ 'h1' ]
		 *		}
		 *	}
		 * </pre>
		 *
		 * The hash keys of the editables are css selectors. For a
		 *
		 * <pre>
		 *  <div class="article">content</div>
		 * </pre>
		 *
		 *  the selectors 'div' and '.article' match and the returned configuration is
		 *
		 * <pre>
		 *  [ 'b', 'i', 'h1']
		 * </pre>
		 *
		 * The '#title' object would return an empty configuration.
		 *
		 * <pre>
		 *  [ ]
		 * </pre>
		 *
		 *  All other objects would get the 'config' configuration. If config is not set
		 * the plugin default configuration is returned.
		 *
		 * <pre>
		 *  [ 'b', 'h1']
		 * </pre></li>
		 * <li>Object configuration parameters are :
		 * <pre>
		 *	"image": {
		 *		config : { 'img': { 'max_width': '50px',
		 *		'max_height': '50px' }},
		 *		editables : {
		 *			'#title': {},
		 *			'div': {'img': {}},
		 *			'.article': {'img': { 'max_width': '150px',
		 *			'max_height': '150px' }}
		 *		}
		 *	}
		 * </pre>
		 *  The '#title' object would return an empty configuration.<br/>
		 *  The 'div' object would return the default configuration.<br/>
		 *  the '.article' would return :
		 *  <pre>
		 *		{'img': { 'max_width': '150px',
		 *		'max_height': '150px' }}
		 *  </pre>
		 * </li>
		 *
		 * @param {jQuery} obj jQuery object of an Editable Object
		 * @return {Array} config A Array with configuration entries
		 */
		getEditableConfig: function (obj) {
			var configObj = null,
				configSpecified = false,
				that = this;

			if ( this.settings.editables ) {
				// check if the editable's selector matches and if so add its configuration to object configuration
				jQuery.each( this.settings.editables, function (selector, selectorConfig) {
					if ( obj.is(selector) ) {
						configSpecified = true;
						if (selectorConfig instanceof Array) {
							configObj = [];
							configObj = jQuery.merge(configObj, selectorConfig);
						} else if (typeof selectorConfig === "object") {
							configObj = {};
							for (var k in selectorConfig) {
								if ( selectorConfig.hasOwnProperty(k) ) {
									if (selectorConfig[k] instanceof Array) {

									} else if (typeof selectorConfig[k] === "object") {
										configObj[k] = {};
										configObj[k] = jQuery.extend(true, configObj[k], that.config[k], selectorConfig[k]);									
									} else {
										configObj[k] = selectorConfig[k];
									}
								}
							}
						} else {
							configObj = selectorConfig;
						}
					}
				});
			}

			// fall back to default configuration
			if ( !configSpecified ) {
				if ( typeof this.settings.config === 'undefined' || !this.settings.config ) {
					configObj = this.config;
				} else {
					configObj = this.settings.config;
				}
			}

			return configObj;
		},

		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * @param obj jQuery object to make clean
		 * @return void
		 */
		makeClean: function ( obj ) {},

		/**
		 * Make a system-wide unique id out of a plugin-wide unique id by prefixing it with the plugin prefix
		 * @param id plugin-wide unique id
		 * @return system-wide unique id
		 * @hide
		 * @deprecated
		 */
		getUID: function(id) {
			console.deprecated ('plugin', 'getUID() is deprecated. Use plugin.name instead.');
			return this.name;
		},

		/**
		 * Localize the given key for the plugin.
		 * @param key key to be localized
		 * @param replacements array of replacement strings
		 * @return localized string
		 * @hide
		 * @deprecated
		 */
		i18n: function(key, replacements) {
			console.deprecated ('plugin', 'i18n() is deprecated. Use plugin.t() instead.');
			return Aloha.i18n(this, key, replacements);
		},

		/**
		 * Return string representation of the plugin, which is the prefix
		 * @return name
		 * @hide
		 * @deprecated
		 */
		toString: function() {
			return this.name;
		},
		
		/**
		 * Log a plugin message to the logger
		 * @param level log level
		 * @param message log message
		 * @return void
		 * @hide
		 * @deprecated
		 */
		log: function (level, message) {
			console.deprecated ('plugin', 'log() is deprecated. Use Aloha.console instead.');
			console.log(level, this, message);
		}
	});
	
	/**
	 * Static method used as factory to create plugins.
	 * 
	 * @param {String} pluginName name of the plugin
	 * @param {Object} definition definition of the plugin, should have at least an "init" and "destroy" method.
	 */
	Plugin.create = function(pluginName, definition) {
		
		var pluginInstance = new ( Plugin.extend( definition ) )( pluginName );
		pluginInstance.settings = jQuery.extendObjects( true, pluginInstance.defaults, Aloha.settings[pluginName] );
		PluginManager.register( pluginInstance );
		
		return pluginInstance;
	};

	return Plugin;
});

define('aloha/engine',['aloha/ecma5shims', 'aloha/jquery'],
function($_, jQuery) {
	

var htmlNamespace = "http://www.w3.org/1999/xhtml";

var cssStylingFlag = false;

// This is bad :(
var globalRange = null;

// Commands are stored in a dictionary where we call their actions and such
var commands = {};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// Utility functions //////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//@{

/**
 * Method to count the number of styles in the given style
 */
function getStyleLength(node) {
	if (!node) {
		return 0;
	} else if (!node.style) {
		return 0;
	}

	// some browsers support .length on styles
	if (typeof node.style.length !== 'undefined') {
		return node.style.length;
	} else {
		// others don't, so we will count
		var styleLength = 0;
		for (var s in node.style) {
			if (node.style[s] && node.style[s] !== 0 && node.style[s] !== 'false') {
				styleLength++;
			}
		}

		return styleLength;
	}
}

function toArray(obj) {
	if (!obj) {
		return null;
	}
	var array = [], i, l = obj.length;
	// iterate backwards ensuring that length is an UInt32
	for (i = l >>> 0; i--;) {
		array[i] = obj[i];
	}
	return array;
}

function nextNode(node) {
	if (node.hasChildNodes()) {
		return node.firstChild;
	}
	return nextNodeDescendants(node);
}

function previousNode(node) {
	if (node.previousSibling) {
		node = node.previousSibling;
		while (node.hasChildNodes()) {
			node = node.lastChild;
		}
		return node;
	}
	if (node.parentNode
	&& node.parentNode.nodeType == $_.Node.ELEMENT_NODE) {
		return node.parentNode;
	}
	return null;
}

function nextNodeDescendants(node) {
	while (node && !node.nextSibling) {
		node = node.parentNode;
	}
	if (!node) {
		return null;
	}
	return node.nextSibling;
}

/**
 * Returns true if ancestor is an ancestor of descendant, false otherwise.
 */
function isAncestor(ancestor, descendant) {
	return ancestor
		&& descendant
		&& Boolean($_.compareDocumentPosition(ancestor, descendant) & $_.Node.DOCUMENT_POSITION_CONTAINED_BY);
}

/**
 * Returns true if ancestor is an ancestor of or equal to descendant, false
 * otherwise.
 */
function isAncestorContainer(ancestor, descendant) {
	return (ancestor || descendant)
		&& (ancestor == descendant || isAncestor(ancestor, descendant));
}

/**
 * Returns true if descendant is a descendant of ancestor, false otherwise.
 */
function isDescendant(descendant, ancestor) {
	return ancestor
		&& descendant
		&& Boolean($_.compareDocumentPosition(ancestor, descendant) & $_.Node.DOCUMENT_POSITION_CONTAINED_BY);
}

/**
 * Returns true if node1 is before node2 in tree order, false otherwise.
 */
function isBefore(node1, node2) {
	return Boolean($_.compareDocumentPosition(node1,node2) & $_.Node.DOCUMENT_POSITION_FOLLOWING);
}

/**
 * Returns true if node1 is after node2 in tree order, false otherwise.
 */
function isAfter(node1, node2) {
	return Boolean($_.compareDocumentPosition(node1,node2) & $_.Node.DOCUMENT_POSITION_PRECEDING);
}

function getAncestors(node) {
	var ancestors = [];
	while (node.parentNode) {
		ancestors.unshift(node.parentNode);
		node = node.parentNode;
	}
	return ancestors;
}

function getDescendants(node) {
	var descendants = [];
	var stop = nextNodeDescendants(node);
	while ((node = nextNode(node))
	&& node != stop) {
		descendants.push(node);
	}
	return descendants;
}

function convertProperty(property) {
	// Special-case for now
	var map = {
		"fontFamily": "font-family",
		"fontSize": "font-size",
		"fontStyle": "font-style",
		"fontWeight": "font-weight",
		"textDecoration": "text-decoration"
	};
	if (typeof map[property] != "undefined") {
		return map[property];
	}

	return property;
}

// Return the <font size=X> value for the given CSS size, or undefined if there
// is none.
function cssSizeToLegacy(cssVal) {
	return {
		"xx-small": 1,
		"small": 2,
		"medium": 3,
		"large": 4,
		"x-large": 5,
		"xx-large": 6,
		"xxx-large": 7
	}[cssVal];
}

// Return the CSS size given a legacy size.
function legacySizeToCss(legacyVal) {
	return {
		1: "xx-small",
		2: "small",
		3: "medium",
		4: "large",
		5: "x-large",
		6: "xx-large",
		7: "xxx-large"
	}[legacyVal];
}

// Opera 11 puts HTML elements in the null namespace, it seems.
function isHtmlNamespace(ns) {
	return ns === null
		|| !ns
		|| ns === htmlNamespace;
}

// "the directionality" from HTML.  I don't bother caring about non-HTML
// elements.
//
// "The directionality of an element is either 'ltr' or 'rtl', and is
// determined as per the first appropriate set of steps from the following
// list:"
function getDirectionality(element) {
	// "If the element's dir attribute is in the ltr state
	//     The directionality of the element is 'ltr'."
	if (element.dir == "ltr") {
		return "ltr";
	}

	// "If the element's dir attribute is in the rtl state
	//     The directionality of the element is 'rtl'."
	if (element.dir == "rtl") {
		return "rtl";
	}

	// "If the element's dir attribute is in the auto state
	// "If the element is a bdi element and the dir attribute is not in a
	// defined state (i.e. it is not present or has an invalid value)
	//     [lots of complicated stuff]
	//
	// Skip this, since no browser implements it anyway.

	// "If the element is a root element and the dir attribute is not in a
	// defined state (i.e. it is not present or has an invalid value)
	//     The directionality of the element is 'ltr'."
	if (!isHtmlElement(element.parentNode)) {
		return "ltr";
	}

	// "If the element has a parent element and the dir attribute is not in a
	// defined state (i.e. it is not present or has an invalid value)
	//     The directionality of the element is the same as the element's
	//     parent element's directionality."
	return getDirectionality(element.parentNode);
}

//@}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// DOM Range functions /////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//@{

function getNodeIndex(node) {
	var ret = 0;
	while (node.previousSibling) {
		ret++;
		node = node.previousSibling;
	}
	return ret;
}

// "The length of a Node node is the following, depending on node:
//
// ProcessingInstruction
// DocumentType
//   Always 0.
// Text
// Comment
//   node's length.
// Any other node
//   node's childNodes's length."
function getNodeLength(node) {
	switch (node.nodeType) {
		case $_.Node.PROCESSING_INSTRUCTION_NODE:
		case $_.Node.DOCUMENT_TYPE_NODE:
			return 0;

		case $_.Node.TEXT_NODE:
		case $_.Node.COMMENT_NODE:
			return node.length;

		default:
			return node.childNodes.length;
	}
}

/**
 * The position of two boundary points relative to one another, as defined by
 * DOM Range.
 */
function getPosition(nodeA, offsetA, nodeB, offsetB) {
	// "If node A is the same as node B, return equal if offset A equals offset
	// B, before if offset A is less than offset B, and after if offset A is
	// greater than offset B."
	if (nodeA == nodeB) {
		if (offsetA == offsetB) {
			return "equal";
		}
		if (offsetA < offsetB) {
			return "before";
		}
		if (offsetA > offsetB) {
			return "after";
		}
	}

	// "If node A is after node B in tree order, compute the position of (node
	// B, offset B) relative to (node A, offset A). If it is before, return
	// after. If it is after, return before."
	if ($_.compareDocumentPosition(nodeB, nodeA) & $_.Node.DOCUMENT_POSITION_FOLLOWING) {
		var pos = getPosition(nodeB, offsetB, nodeA, offsetA);
		if (pos == "before") {
			return "after";
		}
		if (pos == "after") {
			return "before";
		}
	}

	// "If node A is an ancestor of node B:"
	if ($_.compareDocumentPosition(nodeB, nodeA) & $_.Node.DOCUMENT_POSITION_CONTAINS) {
		// "Let child equal node B."
		var child = nodeB;

		// "While child is not a child of node A, set child to its parent."
		while (child.parentNode != nodeA) {
			child = child.parentNode;
		}

		// "If the index of child is less than offset A, return after."
		if (getNodeIndex(child) < offsetA) {
			return "after";
		}
	}

	// "Return before."
	return "before";
}

/**
 * Returns the furthest ancestor of a Node as defined by DOM Range.
 */
function getFurthestAncestor(node) {
	var root = node;
	while (root.parentNode != null) {
		root = root.parentNode;
	}
	return root;
}

/**
 * "contained" as defined by DOM Range: "A Node node is contained in a range
 * range if node's furthest ancestor is the same as range's root, and (node, 0)
 * is after range's start, and (node, length of node) is before range's end."
 */
function isContained(node, range) {
	var pos1 = getPosition(node, 0, range.startContainer, range.startOffset);
	var pos2 = getPosition(node, getNodeLength(node), range.endContainer, range.endOffset);

	return getFurthestAncestor(node) == getFurthestAncestor(range.startContainer)
		&& pos1 == "after"
		&& pos2 == "before";
}

/**
 * Return all nodes contained in range that the provided function returns true
 * for, omitting any with an ancestor already being returned.
 */
function getContainedNodes(range, condition) {
	if (typeof condition == "undefined") {
		condition = function() { return true };
	}
	var node = range.startContainer;
	if (node.hasChildNodes()
	&& range.startOffset < node.childNodes.length) {
		// A child is contained
		node = node.childNodes[range.startOffset];
	} else if (range.startOffset == getNodeLength(node)) {
		// No descendant can be contained
		node = nextNodeDescendants(node);
	} else {
		// No children; this node at least can't be contained
		node = nextNode(node);
	}

	var stop = range.endContainer;
	if (stop.hasChildNodes()
	&& range.endOffset < stop.childNodes.length) {
		// The node after the last contained node is a child
		stop = stop.childNodes[range.endOffset];
	} else {
		// This node and/or some of its children might be contained
		stop = nextNodeDescendants(stop);
	}

	var nodeList = [];
	while (isBefore(node, stop)) {
		if (isContained(node, range)
		&& condition(node)) {
			nodeList.push(node);
			node = nextNodeDescendants(node);
			continue;
		}
		node = nextNode(node);
	}
	return nodeList;
}

/**
 * As above, but includes nodes with an ancestor that's already been returned.
 */
function getAllContainedNodes(range, condition) {
	if (typeof condition == "undefined") {
		condition = function() { return true };
	}
	var node = range.startContainer;
	if (node.hasChildNodes()
	&& range.startOffset < node.childNodes.length) {
		// A child is contained
		node = node.childNodes[range.startOffset];
	} else if (range.startOffset == getNodeLength(node)) {
		// No descendant can be contained
		node = nextNodeDescendants(node);
	} else {
		// No children; this node at least can't be contained
		node = nextNode(node);
	}

	var stop = range.endContainer;
	if (stop.hasChildNodes()
	&& range.endOffset < stop.childNodes.length) {
		// The node after the last contained node is a child
		stop = stop.childNodes[range.endOffset];
	} else {
		// This node and/or some of its children might be contained
		stop = nextNodeDescendants(stop);
	}

	var nodeList = [];
	while (isBefore(node, stop)) {
		if (isContained(node, range)
		&& condition(node)) {
			nodeList.push(node);
		}
		node = nextNode(node);
	}
	return nodeList;
}

// Returns either null, or something of the form rgb(x, y, z), or something of
// the form rgb(x, y, z, w) with w != 0.
function normalizeColor(color) {
	if (color.toLowerCase() == "currentcolor") {
		return null;
	}

	var outerSpan = document.createElement("span");
	document.body.appendChild(outerSpan);
	outerSpan.style.color = "black";

	var innerSpan = document.createElement("span");
	outerSpan.appendChild(innerSpan);
	innerSpan.style.color = color;
	color = $_.getComputedStyle(innerSpan).color;

	if (color == "rgb(0, 0, 0)") {
		// Maybe it's really black, maybe it's invalid.
		outerSpan.color = "white";
		color = $_.getComputedStyle(innerSpan).color;
		if (color != "rgb(0, 0, 0)") {
			return null;
		}
	}

	document.body.removeChild(outerSpan);

	// I rely on the fact that browsers generally provide consistent syntax for
	// getComputedStyle(), although it's not standardized.  There are only two
	// exceptions I found:
	if (/^rgba\([0-9]+, [0-9]+, [0-9]+, 1\)$/.test(color)) {
		// IE10PP2 seems to do this sometimes.
		return color.replace("rgba", "rgb").replace(", 1)", ")");
	}
	if (color == "transparent") {
		// IE10PP2, Firefox 7.0a2, and Opera 11.50 all return "transparent" if
		// the specified value is "transparent".
		return "rgba(0, 0, 0, 0)";
	}
	return color;
}

// Returns either null, or something of the form #xxxxxx, or the color itself
// if it's a valid keyword.
function parseSimpleColor(color) {
	color = color.toLowerCase();
	if ($_(["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
	"bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
	"burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
	"cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
	"darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
	"darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
	"darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
	"darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
	"dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite",
	"forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
	"gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred",
	"indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen",
	"lemonchiffon", "lightblue", "lightcoral", "lightcyan",
	"lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey",
	"lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
	"lightslategray", "lightslategrey", "lightsteelblue", "lightyellow",
	"lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
	"mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
	"mediumslateblue", "mediumspringgreen", "mediumturquoise",
	"mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
	"navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange",
	"orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
	"palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum",
	"powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown",
	"salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver",
	"skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen",
	"steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet",
	"wheat", "white", "whitesmoke", "yellow", "yellowgreen"]).indexOf(color) != -1) {
		return color;
	}

	color = normalizeColor(color);
	var matches = /^rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)$/.exec(color);
	if (matches) {
		return "#"
			+ parseInt(matches[1]).toString(16).replace(/^.$/, "0$&")
			+ parseInt(matches[2]).toString(16).replace(/^.$/, "0$&")
			+ parseInt(matches[3]).toString(16).replace(/^.$/, "0$&");
	}
	return null;
}

//@}

//////////////////////////////////////////////////////////////////////////////
/////////////////////////// Edit command functions ///////////////////////////
//////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////
///// Methods of the HTMLDocument interface /////
/////////////////////////////////////////////////
//@{

var executionStackDepth = 0;

// Helper function for common behavior.
function editCommandMethod(command, prop, range, callback) {
	// Set up our global range magic, but only if we're the outermost function
	if (executionStackDepth == 0 && typeof range != "undefined") {
		globalRange = range;
	} else if (executionStackDepth == 0) {
		globalRange = null;
		globalRange = range;
	}

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	//
	// We can't throw a real one, but a string will do for our purposes.
	if (!(command in commands)) {
		throw "NOT_SUPPORTED_ERR";
	}

	// "If command has no action, raise an INVALID_ACCESS_ERR exception."
	// "If command has no indeterminacy, raise an INVALID_ACCESS_ERR
	// exception."
	// "If command has no state, raise an INVALID_ACCESS_ERR exception."
	// "If command has no value, raise an INVALID_ACCESS_ERR exception."
	if (prop != "enabled"
	&& !(prop in commands[command])) {
		throw "INVALID_ACCESS_ERR";
	}

	executionStackDepth++;
	try {
		var ret = callback();
	} catch(e) {
		executionStackDepth--;
		throw e;
	}
	executionStackDepth--;
	return ret;
}

function myExecCommand(command, showUi, value, range) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	// "If only one argument was provided, let show UI be false."
	//
	// If range was passed, I can't actually detect how many args were passed
	// . . .
	if (arguments.length == 1
	|| (arguments.length >=4 && typeof showUi == "undefined")) {
		showUi = false;
	}

	// "If only one or two arguments were provided, let value be the empty
	// string."
	if (arguments.length <= 2
	|| (arguments.length >=4 && typeof value == "undefined")) {
		value = "";
	}

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	//
	// "If command has no action, raise an INVALID_ACCESS_ERR exception."
	return editCommandMethod(command, "action", range, (function(command, showUi, value) { return function() {
		// "If command is not enabled, return false."
		if (!myQueryCommandEnabled(command)) {
			return false;
		}

		// "Take the action for command, passing value to the instructions as an
		// argument."
		commands[command].action(value, range);

		// always fix the range after the command is complete
		setActiveRange(range);
		
		// "Return true."
		return true;
	}})(command, showUi, value));
}

function myQueryCommandEnabled(command, range) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	return editCommandMethod(command, "action", range, (function(command) { return function() {
		// "Among commands defined in this specification, those listed in
		// Miscellaneous commands are always enabled. The other commands defined
		// here are enabled if the active range is not null, and disabled
		// otherwise."
		return $_( ["copy", "cut", "paste", "selectall", "stylewithcss", "usecss"] ).indexOf(command) != -1
			|| range !== null;
	}})(command));
}

function myQueryCommandIndeterm(command, range) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	//
	// "If command has no indeterminacy, raise an INVALID_ACCESS_ERR
	// exception."
	return editCommandMethod(command, "indeterm", range, (function(command) { return function() {
		// "If command is not enabled, return false."
		if (!myQueryCommandEnabled(command, range)) {
			return false;
		}

		// "Return true if command is indeterminate, otherwise false."
		return commands[command].indeterm( range );
	}})(command));
}

function myQueryCommandState(command, range) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	//
	// "If command has no state, raise an INVALID_ACCESS_ERR exception."
	return editCommandMethod(command, "state", range, (function(command) { return function() {
		// "If command is not enabled, return false."
		if (!myQueryCommandEnabled(command, range)) {
			return false;
		}

		// "If the state override for command is set, return it."
		if (typeof getStateOverride(command, range) != "undefined") {
			return getStateOverride(command, range);
		}

		// "Return true if command's state is true, otherwise false."
		return commands[command].state( range );
	}})(command));
}

// "When the queryCommandSupported(command) method on the HTMLDocument
// interface is invoked, the user agent must return true if command is
// supported, and false otherwise."
function myQueryCommandSupported(command) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	return command in commands;
}

function myQueryCommandValue(command, range) {
	// "All of these methods must treat their command argument ASCII
	// case-insensitively."
	command = command.toLowerCase();

	// "If command is not supported, raise a NOT_SUPPORTED_ERR exception."
	//
	// "If command has no value, raise an INVALID_ACCESS_ERR exception."
	return editCommandMethod(command, "value", range, function() {
		// "If command is not enabled, return the empty string."
		if (!myQueryCommandEnabled(command, range)) {
			return "";
		}

		// "If command is "fontSize" and its value override is set, convert the
		// value override to an integer number of pixels and return the legacy
		// font size for the result."
		if (command == "fontsize"
		&& getValueOverride("fontsize", range) !== undefined) {
			return getLegacyFontSize(getValueOverride("fontsize", range));
		}

		// "If the value override for command is set, return it."
		if (typeof getValueOverride(command, range) != "undefined") {
			return getValueOverride(command, range);
		}

		// "Return command's value."
		return commands[command].value();
	});
}
//@}

//////////////////////////////
///// Common definitions /////
//////////////////////////////
//@{

// "An HTML element is an Element whose namespace is the HTML namespace."
//
// I allow an extra argument to more easily check whether something is a
// particular HTML element, like isHtmlElement(node, "OL").  It accepts arrays
// too, like isHtmlElement(node, ["OL", "UL"]) to check if it's an ol or ul.
function isHtmlElement(node, tags) {
	if (typeof tags == "string") {
		tags = [tags];
	}
	if (typeof tags == "object") {
		tags = $_( tags ).map(function(tag) { return tag.toUpperCase() });
	}
	return node
		&& node.nodeType == $_.Node.ELEMENT_NODE
		&& isHtmlNamespace(node.namespaceURI)
		&& (typeof tags == "undefined" || $_( tags ).indexOf(node.tagName) != -1);
}

// "A prohibited paragraph child name is "address", "article", "aside",
// "blockquote", "caption", "center", "col", "colgroup", "dd", "details",
// "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer",
// "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li",
// "listing", "menu", "nav", "ol", "p", "plaintext", "pre", "section",
// "summary", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", or
// "xmp"."
var prohibitedParagraphChildNames = ["address", "article", "aside",
	"blockquote", "caption", "center", "col", "colgroup", "dd", "details",
	"dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer",
	"form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li",
	"listing", "menu", "nav", "ol", "p", "plaintext", "pre", "section",
	"summary", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
	"xmp"];

// "A prohibited paragraph child is an HTML element whose local name is a
// prohibited paragraph child name."
function isProhibitedParagraphChild(node) {
	return isHtmlElement(node, prohibitedParagraphChildNames);
}

// "A block node is either an Element whose "display" property does not have
// resolved value "inline" or "inline-block" or "inline-table" or "none", or a
// Document, or a DocumentFragment."
function isBlockNode(node) {
	
	return node
		&& ((node.nodeType == $_.Node.ELEMENT_NODE && $_( ["inline", "inline-block", "inline-table", "none"] ).indexOf($_.getComputedStyle(node).display) == -1)
		|| node.nodeType == $_.Node.DOCUMENT_NODE
		|| node.nodeType == $_.Node.DOCUMENT_FRAGMENT_NODE);
}

// "An inline node is a node that is not a block node."
function isInlineNode(node) {
	return node && !isBlockNode(node);
}

// "An editing host is a node that is either an Element with a contenteditable
// attribute set to the true state, or the Element child of a Document whose
// designMode is enabled."
function isEditingHost(node) {
	return node
		&& node.nodeType == $_.Node.ELEMENT_NODE
		&& (node.contentEditable == "true"
		|| (node.parentNode
		&& node.parentNode.nodeType == $_.Node.DOCUMENT_NODE
		&& node.parentNode.designMode == "on"));
}

// "Something is editable if it is a node which is not an editing host, does
// not have a contenteditable attribute set to the false state, and whose
// parent is an editing host or editable."
function isEditable(node) {
	// This is slightly a lie, because we're excluding non-HTML elements with
	// contentEditable attributes.
	return node
		&& !isEditingHost(node)
		&& (node.nodeType != $_.Node.ELEMENT_NODE || node.contentEditable != "false" || jQuery(node).hasClass('aloha-table-wrapper'))
		&& (isEditingHost(node.parentNode) || isEditable(node.parentNode));
}

// Helper function, not defined in the spec
function hasEditableDescendants(node) {
	for (var i = 0; i < node.childNodes.length; i++) {
		if (isEditable(node.childNodes[i])
		|| hasEditableDescendants(node.childNodes[i])) {
			return true;
		}
	}
	return false;
}

// "The editing host of node is null if node is neither editable nor an editing
// host; node itself, if node is an editing host; or the nearest ancestor of
// node that is an editing host, if node is editable."
function getEditingHostOf(node) {
	if (isEditingHost(node)) {
		return node;
	} else if (isEditable(node)) {
		var ancestor = node.parentNode;
		while (!isEditingHost(ancestor)) {
			ancestor = ancestor.parentNode;
		}
		return ancestor;
	} else {
		return null;
	}
}

// "Two nodes are in the same editing host if the editing host of the first is
// non-null and the same as the editing host of the second."
function inSameEditingHost(node1, node2) {
	return getEditingHostOf(node1)
		&& getEditingHostOf(node1) == getEditingHostOf(node2);
}

// "A collapsed line break is a br that begins a line box which has nothing
// else in it, and therefore has zero height."
function isCollapsedLineBreak(br) {
	if (!isHtmlElement(br, "br")) {
		return false;
	}

	// Add a zwsp after it and see if that changes the height of the nearest
	// non-inline parent.  Note: this is not actually reliable, because the
	// parent might have a fixed height or something.
	var ref = br.parentNode;
	while ($_.getComputedStyle(ref).display == "inline") {
		ref = ref.parentNode;
	}

	var refStyle = $_( ref ).hasAttribute("style") ? ref.getAttribute("style") : null;
	ref.style.height = "auto";
	ref.style.maxHeight = "none";
	ref.style.minHeight = "0";
	var space = document.createTextNode("\u200b");
	var origHeight = ref.offsetHeight;
	if (origHeight == 0) {
		throw "isCollapsedLineBreak: original height is zero, bug?";
	}
	br.parentNode.insertBefore(space, br.nextSibling);
	var finalHeight = ref.offsetHeight;
	space.parentNode.removeChild(space);
	if (refStyle === null) {
		// Without the setAttribute() line, removeAttribute() doesn't work in
		// Chrome 14 dev.  I have no idea why.
		ref.setAttribute("style", "");
		ref.removeAttribute("style");
	} else {
		ref.setAttribute("style", refStyle);
	}

	// Allow some leeway in case the zwsp didn't create a whole new line, but
	// only made an existing line slightly higher.  Firefox 6.0a2 shows this
	// behavior when the first line is bold.
	return origHeight < finalHeight - 5;
}

// "An extraneous line break is a br that has no visual effect, in that
// removing it from the DOM would not change layout, except that a br that is
// the sole child of an li is not extraneous."
//
// FIXME: This doesn't work in IE, since IE ignores display: none in
// contenteditable.
function isExtraneousLineBreak(br) {
	if (!isHtmlElement(br, "br")) {
		return false;
	}

	if (isHtmlElement(br.parentNode, "li")
	&& br.parentNode.childNodes.length == 1) {
		return false;
	}

	// Make the line break disappear and see if that changes the block's
	// height.  Yes, this is an absurd hack.  We have to reset height etc. on
	// the reference node because otherwise its height won't change if it's not
	// auto.
	var ref = br.parentNode;
	while ($_.getComputedStyle(ref).display == "inline") {
		ref = ref.parentNode;
	}
	var refStyle = $_( ref ).hasAttribute("style") ? ref.getAttribute("style") : null;
	ref.style.height = "auto";
	ref.style.maxHeight = "none";
	ref.style.minHeight = "0";
	var brStyle = $_( br ).hasAttribute("style") ? br.getAttribute("style") : null;
	var origHeight = ref.offsetHeight;
	if (origHeight == 0) {
		throw "isExtraneousLineBreak: original height is zero, bug?";
	}
	br.setAttribute("style", "display:none");
	var finalHeight = ref.offsetHeight;
	if (refStyle === null) {
		// Without the setAttribute() line, removeAttribute() doesn't work in
		// Chrome 14 dev.  I have no idea why.
		ref.setAttribute("style", "");
		ref.removeAttribute("style");
	} else {
		ref.setAttribute("style", refStyle);
	}
	if (brStyle === null) {
		br.removeAttribute("style");
	} else {
		br.setAttribute("style", brStyle);
	}

	return origHeight == finalHeight;
}

// "A whitespace node is either a Text node whose data is the empty string; or
// a Text node whose data consists only of one or more tabs (0x0009), line
// feeds (0x000A), carriage returns (0x000D), and/or spaces (0x0020), and whose
// parent is an Element whose resolved value for "white-space" is "normal" or
// "nowrap"; or a Text node whose data consists only of one or more tabs
// (0x0009), carriage returns (0x000D), and/or spaces (0x0020), and whose
// parent is an Element whose resolved value for "white-space" is "pre-line"."
function isWhitespaceNode(node) {
	return node
		&& node.nodeType == $_.Node.TEXT_NODE
		&& (node.data == ""
		|| (
			/^[\t\n\r ]+$/.test(node.data)
			&& node.parentNode
			&& node.parentNode.nodeType == $_.Node.ELEMENT_NODE
			&& $_( ["normal", "nowrap"] ).indexOf($_.getComputedStyle(node.parentNode).whiteSpace) != -1
		) || (
			/^[\t\r ]+$/.test(node.data)
			&& node.parentNode
			&& node.parentNode.nodeType == $_.Node.ELEMENT_NODE
			&& $_.getComputedStyle(node.parentNode).whiteSpace == "pre-line"
		) || (
			/^[\t\n\r ]+$/.test(node.data)
			&& node.parentNode
			&& node.parentNode.nodeType == $_.Node.DOCUMENT_FRAGMENT_NODE
		));
}

/**
 * Collapse sequences of ignorable whitespace (tab (0x0009), line feed (0x000A), carriage return (0x000D), space (0x0020)) to only one space.
 * Preserve the given range if necessary.
 * @param node text node
 * @param range range
 */
function collapseWhitespace(node, range) {
	// "If node is neither editable nor an editing host, abort these steps."
	if (!isEditable(node) && !isEditingHost(node)) {
		return;
	}

	// if the given node is not a text node, return
	if (!node || node.nodeType !== $_.Node.TEXT_NODE) {
		return;
	}

	// if the node is in a pre or pre-wrap node, return
	if ($_(["pre", "pre-wrap"]).indexOf($_.getComputedStyle(node.parentNode).whiteSpace) != -1) {
		return;
	}

	// if the given node does not contain sequences of at least two consecutive ignorable whitespace characters, return
	if (!/[\t\n\r ]{2,}/.test(node.data)) {
		return;
	}

	var newData = '';
	var correctStart = range.startContainer == node;
	var correctEnd = range.endContainer == node;
	var wsFound = false;

	// iterate through the node data
	for (var i = 0; i < node.data.length; ++i) {
		if (/[\t\n\r ]/.test(node.data[i])) {
			// found a whitespace
			if (!wsFound) {
				// this is the first whitespace in the current sequence
				// add a whitespace to the new data sequence
				newData += ' ';
				// remember that we found a whitespace
				wsFound = true;
			} else {
				// this is not the first whitespace in the sequence, so omit this character
				if (correctStart && newData.length < range.startOffset) {
					range.startOffset--;
				}
				if (correctEnd && newData.length < range.endOffset) {
					range.endOffset--;
				}
			}
		} else {
			newData += node.data[i];
			wsFound = false;
		}
	}

	// set the new data
	node.data = newData;
}

// "node is a collapsed whitespace node if the following algorithm returns
// true:"
function isCollapsedWhitespaceNode(node) {
	// "If node is not a whitespace node, return false."
	if (!isWhitespaceNode(node)) {
		return false;
	}

	// "If node's data is the empty string, return true."
	if (node.data == "") {
		return true;
	}

	// "Let ancestor be node's parent."
	var ancestor = node.parentNode;

	// "If ancestor is null, return true."
	if (!ancestor) {
		return true;
	}

	// "If the "display" property of some ancestor of node has resolved value
	// "none", return true."
	if ($_( getAncestors(node) ).some(function(ancestor) {
		return ancestor.nodeType == $_.Node.ELEMENT_NODE
			&& $_.getComputedStyle(ancestor).display == "none";
	})) {
		return true;
	}

	// "While ancestor is not a block node and its parent is not null, set
	// ancestor to its parent."
	while (!isBlockNode(ancestor)
	&& ancestor.parentNode) {
		ancestor = ancestor.parentNode;
	}

	// "Let reference be node."
	var reference = node;

	// "While reference is a descendant of ancestor:"
	while (reference != ancestor) {
		// "Let reference be the node before it in tree order."
		reference = previousNode(reference);

		// "If reference is a block node or a br, return true."
		if (isBlockNode(reference)
		|| isHtmlElement(reference, "br")) {
			return true;
		}

		// "If reference is a Text node that is not a whitespace node, or is an
		// img, break from this loop."
		if ((reference.nodeType == $_.Node.TEXT_NODE && !isWhitespaceNode(reference))
		|| isHtmlElement(reference, "img")) {
			break;
		}
	}

	// "Let reference be node."
	reference = node;

	// "While reference is a descendant of ancestor:"
	var stop = nextNodeDescendants(ancestor);
	while (reference != stop) {
		// "Let reference be the node after it in tree order, or null if there
		// is no such node."
		reference = nextNode(reference);

		// "If reference is a block node or a br, return true."
		if (isBlockNode(reference)
		|| isHtmlElement(reference, "br")) {
			return true;
		}

		// "If reference is a Text node that is not a whitespace node, or is an
		// img, break from this loop."
		if ((reference && reference.nodeType == $_.Node.TEXT_NODE && !isWhitespaceNode(reference))
		|| isHtmlElement(reference, "img")) {
			break;
		}
	}

	// "Return false."
	return false;
}

// "Something is visible if it is a node that either is a block node, or a Text
// node that is not a collapsed whitespace node, or an img, or a br that is not
// an extraneous line break, or any node with a visible descendant; excluding
// any node with an ancestor container Element whose "display" property has
// resolved value "none"."
function isVisible(node) {
	if (!node) {
		return false;
	}

	if ($_( getAncestors(node).concat(node) )
	.filter(function(node) { return node.nodeType == $_.Node.ELEMENT_NODE }, true)
	.some(function(node) { return $_.getComputedStyle(node).display == "none" })) {
		return false;
	}

	if (isBlockNode(node)
	|| (node.nodeType == $_.Node.TEXT_NODE && !isCollapsedWhitespaceNode(node))
	|| isHtmlElement(node, "img")
	|| (isHtmlElement(node, "br") && !isExtraneousLineBreak(node))) {
		return true;
	}

	for (var i = 0; i < node.childNodes.length; i++) {
		if (isVisible(node.childNodes[i])) {
			return true;
		}
	}

	return false;
}

// "Something is invisible if it is a node that is not visible."
function isInvisible(node) {
	return node && !isVisible(node);
}

// "A collapsed block prop is either a collapsed line break that is not an
// extraneous line break, or an Element that is an inline node and whose
// children are all either invisible or collapsed block props and that has at
// least one child that is a collapsed block prop."
function isCollapsedBlockProp(node) {
	if (isCollapsedLineBreak(node)
	&& !isExtraneousLineBreak(node)) {
		return true;
	}

	if (!isInlineNode(node)
	|| node.nodeType != $_.Node.ELEMENT_NODE) {
		return false;
	}

	var hasCollapsedBlockPropChild = false;
	for (var i = 0; i < node.childNodes.length; i++) {
		if (!isInvisible(node.childNodes[i])
		&& !isCollapsedBlockProp(node.childNodes[i])) {
			return false;
		}
		if (isCollapsedBlockProp(node.childNodes[i])) {
			hasCollapsedBlockPropChild = true;
		}
	}

	return hasCollapsedBlockPropChild;
}

function setActiveRange( range ) {
	var rangeObject = new window.GENTICS.Utils.RangeObject();
	
	rangeObject.startContainer = range.startContainer;
	rangeObject.startOffset = range.startOffset;
	rangeObject.endContainer = range.endContainer;
	rangeObject.endOffset = range.endOffset;
	
	rangeObject.select();
}

// Please note: This method is deprecated and will be removed. 
// Every command should use the value and range parameter. 
// 
// "The active range is the first range in the Selection given by calling
// getSelection() on the context object, or null if there is no such range."
//
// We cheat and return globalRange if that's defined.  We also ensure that the
// active range meets the requirements that selection boundary points are
// supposed to meet, i.e., that the nodes are both Text or Element nodes that
// descend from a Document.
function getActiveRange() {
	var ret;
	if (globalRange) {
		ret = globalRange;
	} else if (Aloha.getSelection().rangeCount) {
		ret = Aloha.getSelection().getRangeAt(0);
	} else {
		return null;
	}
	if ($_( [$_.Node.TEXT_NODE, $_.Node.ELEMENT_NODE] ).indexOf(ret.startContainer.nodeType) == -1
	|| $_( [$_.Node.TEXT_NODE, $_.Node.ELEMENT_NODE] ).indexOf(ret.endContainer.nodeType) == -1
	|| !ret.startContainer.ownerDocument
	|| !ret.endContainer.ownerDocument
	|| !isDescendant(ret.startContainer, ret.startContainer.ownerDocument)
	|| !isDescendant(ret.endContainer, ret.endContainer.ownerDocument)) {
		throw "Invalid active range; test bug?";
	}
	return ret;
}

// "For some commands, each HTMLDocument must have a boolean state override
// and/or a string value override. These do not change the command's state or
// value, but change the way some algorithms behave, as specified in those
// algorithms' definitions. Initially, both must be unset for every command.
// Whenever the number of ranges in the Selection changes to something
// different, and whenever a boundary point of the range at a given index in
// the Selection changes to something different, the state override and value
// override must be unset for every command."
//
// We implement this crudely by using setters and getters.  To verify that the
// selection hasn't changed, we copy the active range and just check the
// endpoints match.  This isn't really correct, but it's good enough for us.
// Unset state/value overrides are undefined.  We put everything in a function
// so no one can access anything except via the provided functions, since
// otherwise callers might mistakenly use outdated overrides (if the selection
// has changed).
var getStateOverride, setStateOverride, unsetStateOverride,
	getValueOverride, setValueOverride, unsetValueOverride;
(function() {
	var stateOverrides = {};
	var valueOverrides = {};
	var storedRange = null;

	function resetOverrides(range) {
		if (!storedRange
		|| storedRange.startContainer != range.startContainer
		|| storedRange.endContainer != range.endContainer
		|| storedRange.startOffset != range.startOffset
		|| storedRange.endOffset != range.endOffset) {
			stateOverrides = {};
			valueOverrides = {};
			storedRange = range.cloneRange();
		}
	}

	getStateOverride = function(command, range) {
		resetOverrides(range);
		return stateOverrides[command];
	};

	setStateOverride = function(command, newState, range) {
		resetOverrides(range);
		stateOverrides[command] = newState;
	};

	unsetStateOverride = function(command, range) {
		resetOverrides(range);
		delete stateOverrides[command];
	}

	getValueOverride = function(command, range) {
		resetOverrides(range);
		return valueOverrides[command];
	}

	// "The value override for the backColor command must be the same as the
	// value override for the hiliteColor command, such that setting one sets
	// the other to the same thing and unsetting one unsets the other."
	setValueOverride = function(command, newValue, range) {
		resetOverrides(range);
		valueOverrides[command] = newValue;
		if (command == "backcolor") {
			valueOverrides.hilitecolor = newValue;
		} else if (command == "hilitecolor") {
			valueOverrides.backcolor = newValue;
		}
	}

	unsetValueOverride = function(command, range) {
		resetOverrides(range);
		delete valueOverrides[command];
		if (command == "backcolor") {
			delete valueOverrides.hilitecolor;
		} else if (command == "hilitecolor") {
			delete valueOverrides.backcolor;
		}
	}
})();

//@}

/////////////////////////////
///// Common algorithms /////
/////////////////////////////

///// Assorted common algorithms /////
//@{

function movePreservingRanges(node, newParent, newIndex, range) {
	// For convenience, I allow newIndex to be -1 to mean "insert at the end".
	if (newIndex == -1) {
		newIndex = newParent.childNodes.length;
	}

	// "When the user agent is to move a Node to a new location, preserving
	// ranges, it must remove the Node from its original parent (if any), then
	// insert it in the new location. In doing so, however, it must ignore the
	// regular range mutation rules, and instead follow these rules:"

	// "Let node be the moved Node, old parent and old index be the old parent
	// (which may be null) and index, and new parent and new index be the new
	// parent and index."
	var oldParent = node.parentNode;
	var oldIndex = getNodeIndex(node);

	// We only even attempt to preserve the global range object and the ranges
	// in the selection, not every range out there (the latter is probably
	// impossible).
	var ranges = [range];
	for (var i = 0; i < Aloha.getSelection().rangeCount; i++) {
		ranges.push(Aloha.getSelection().getRangeAt(i));
	}
	var boundaryPoints = [];
	$_( ranges ).forEach(function(range) {
		boundaryPoints.push([range.startContainer, range.startOffset]);
		boundaryPoints.push([range.endContainer, range.endOffset]);
	});

	$_( boundaryPoints ).forEach(function(boundaryPoint) {
		// "If a boundary point's node is the same as or a descendant of node,
		// leave it unchanged, so it moves to the new location."
		//
		// No modifications necessary.

		// "If a boundary point's node is new parent and its offset is greater
		// than new index, add one to its offset."
		if (boundaryPoint[0] == newParent
		&& boundaryPoint[1] > newIndex) {
			boundaryPoint[1]++;
		}

		// "If a boundary point's node is old parent and its offset is old index or
		// old index + 1, set its node to new parent and add new index − old index
		// to its offset."
		if (boundaryPoint[0] == oldParent
		&& (boundaryPoint[1] == oldIndex
		|| boundaryPoint[1] == oldIndex + 1)) {
			boundaryPoint[0] = newParent;
			boundaryPoint[1] += newIndex - oldIndex;
		}

		// "If a boundary point's node is old parent and its offset is greater than
		// old index + 1, subtract one from its offset."
		if (boundaryPoint[0] == oldParent
		&& boundaryPoint[1] > oldIndex + 1) {
			boundaryPoint[1]--;
		}
	});

	// Now actually move it and preserve the ranges.
	if (newParent.childNodes.length == newIndex) {
		newParent.appendChild(node);
	} else {
		newParent.insertBefore(node, newParent.childNodes[newIndex]);
	}

	// if we're off actual node boundaries this implies that the move was
	// part of a deletion process (backspace). If that's the case we 
	// attempt to fix this by restoring the range to the first index of
	// the node that has been moved
	if (boundaryPoints[0][1] > boundaryPoints[0][0].childNodes.length
	&& boundaryPoints[1][1] > boundaryPoints[1][0].childNodes.length) {
		range.setStart(node, 0);
		range.setEnd(node, 0);
	} else {
		range.setStart(boundaryPoints[0][0], boundaryPoints[0][1]);
		range.setEnd(boundaryPoints[1][0], boundaryPoints[1][1]);

		Aloha.getSelection().removeAllRanges();
		for (var i = 1; i < ranges.length; i++) {
			var newRange = Aloha.createRange();
			newRange.setStart(boundaryPoints[2*i][0], boundaryPoints[2*i][1]);
			newRange.setEnd(boundaryPoints[2*i + 1][0], boundaryPoints[2*i + 1][1]);
			Aloha.getSelection().addRange(newRange);
		}
		if (newRange) {
			range = newRange;
		}
	}
}

function setTagName(element, newName, range) {
	// "If element is an HTML element with local name equal to new name, return
	// element."
	if (isHtmlElement(element, newName.toUpperCase())) {
		return element;
	}

	// "If element's parent is null, return element."
	if (!element.parentNode) {
		return element;
	}

	// "Let replacement element be the result of calling createElement(new
	// name) on the ownerDocument of element."
	var replacementElement = element.ownerDocument.createElement(newName);

	// "Insert replacement element into element's parent immediately before
	// element."
	element.parentNode.insertBefore(replacementElement, element);

	// "Copy all attributes of element to replacement element, in order."
	for (var i = 0; i < element.attributes.length; i++) {
		if (typeof replacementElement.setAttributeNS === 'function') {
			replacementElement.setAttributeNS(element.attributes[i].namespaceURI, element.attributes[i].name, element.attributes[i].value);
		} else {
			replacementElement.setAttribute(element.attributes[i].name, element.attributes[i].value);
		}
	}

	// "While element has children, append the first child of element as the
	// last child of replacement element, preserving ranges."
	while (element.childNodes.length) {
		movePreservingRanges(element.firstChild, replacementElement, replacementElement.childNodes.length, range);
	}

	// "Remove element from its parent."
	element.parentNode.removeChild(element);

	// if the range still uses the old element, we modify it to the new one
	if (range.startContainer === element) {
		range.setStart(replacementElement, range.startOffset);
	}
	if (range.endContainer === element) {
		range.setEnd(replacementElement, range.endOffset);
	}

	// "Return replacement element."
	return replacementElement;
}

function removeExtraneousLineBreaksBefore(node) {
	// "Let ref be the previousSibling of node."
	var ref = node.previousSibling;

	// "If ref is null, abort these steps."
	if (!ref) {
		return;
	}

	// "While ref has children, set ref to its lastChild."
	while (ref.hasChildNodes()) {
		ref = ref.lastChild;
	}

	// "While ref is invisible but not an extraneous line break, and ref does
	// not equal node's parent, set ref to the node before it in tree order."
	while (isInvisible(ref)
	&& !isExtraneousLineBreak(ref)
	&& ref != node.parentNode) {
		ref = previousNode(ref);
	}

	// "If ref is an editable extraneous line break, remove it from its
	// parent."
	if (isEditable(ref)
	&& isExtraneousLineBreak(ref)) {
		ref.parentNode.removeChild(ref);
	}
}

function removeExtraneousLineBreaksAtTheEndOf(node) {
	// "Let ref be node."
	var ref = node;

	// "While ref has children, set ref to its lastChild."
	while (ref.hasChildNodes()) {
		ref = ref.lastChild;
	}

	// "While ref is invisible but not an extraneous line break, and ref does
	// not equal node, set ref to the node before it in tree order."
	while (isInvisible(ref)
	&& !isExtraneousLineBreak(ref)
	&& ref != node) {
		ref = previousNode(ref);
	}

	// "If ref is an editable extraneous line break, remove it from its
	// parent."
	if (isEditable(ref)
	&& isExtraneousLineBreak(ref)) {
		ref.parentNode.removeChild(ref);
	}
}

// "To remove extraneous line breaks from a node, first remove extraneous line
// breaks before it, then remove extraneous line breaks at the end of it."
function removeExtraneousLineBreaksFrom(node) {
	removeExtraneousLineBreaksBefore(node);
	removeExtraneousLineBreaksAtTheEndOf(node);
}

//@}
///// Wrapping a list of nodes /////
//@{

function wrap(nodeList, siblingCriteria, newParentInstructions, range) {
	// "If not provided, sibling criteria returns false and new parent
	// instructions returns null."
	if (typeof siblingCriteria == "undefined") {
		siblingCriteria = function() { return false };
	}
	if (typeof newParentInstructions == "undefined") {
		newParentInstructions = function() { return null };
	}

	// "If node list is empty, or the first member of node list is not
	// editable, return null and abort these steps."
	if (!nodeList.length
	|| !isEditable(nodeList[0])) {
		return null;
	}

	// "If node list's last member is an inline node that's not a br, and node
	// list's last member's nextSibling is a br, append that br to node list."
	if (isInlineNode(nodeList[nodeList.length - 1])
	&& !isHtmlElement(nodeList[nodeList.length - 1], "br")
	&& isHtmlElement(nodeList[nodeList.length - 1].nextSibling, "br")) {
		nodeList.push(nodeList[nodeList.length - 1].nextSibling);
	}

	// "If the previousSibling of the first member of node list is editable and
	// running sibling criteria on it returns true, let new parent be the
	// previousSibling of the first member of node list."
	var newParent;
	if (isEditable(nodeList[0].previousSibling)
	&& siblingCriteria(nodeList[0].previousSibling)) {
		newParent = nodeList[0].previousSibling;

	// "Otherwise, if the nextSibling of the last member of node list is
	// editable and running sibling criteria on it returns true, let new parent
	// be the nextSibling of the last member of node list."
	} else if (isEditable(nodeList[nodeList.length - 1].nextSibling)
	&& siblingCriteria(nodeList[nodeList.length - 1].nextSibling)) {
		newParent = nodeList[nodeList.length - 1].nextSibling;

	// "Otherwise, run new parent instructions, and let new parent be the
	// result."
	} else {
		newParent = newParentInstructions();
	}

	// "If new parent is null, abort these steps and return null."
	if (!newParent) {
		return null;
	}

	// "If new parent's parent is null:"
	if (!newParent.parentNode) {
		// "Insert new parent into the parent of the first member of node list
		// immediately before the first member of node list."
		nodeList[0].parentNode.insertBefore(newParent, nodeList[0]);

		// "If any range has a boundary point with node equal to the parent of
		// new parent and offset equal to the index of new parent, add one to
		// that boundary point's offset."
		//
		// Try to fix range
		var startContainer = range.startContainer, startOffset = range.startOffset,
			endContainer = range.endContainer, endOffset = range.endOffset;
		if (startContainer == newParent.parentNode
		&& startOffset >= getNodeIndex(newParent)) {
			range.setStart(startContainer, startOffset + 1);
		}
		if (endContainer == newParent.parentNode
		&& endOffset >= getNodeIndex(newParent)) {
			range.setEnd(endContainer, endOffset + 1);
		}

		// Only try to fix the global range. TODO remove globalRange here
		if (globalRange && globalRange !== range) {
			startContainer = globalRange.startContainer, startOffset = globalRange.startOffset,
				endContainer = globalRange.endContainer, endOffset = globalRange.endOffset;
			if (startContainer == newParent.parentNode
			&& startOffset >= getNodeIndex(newParent)) {
				globalRange.setStart(startContainer, startOffset + 1);
			}
			if (endContainer == newParent.parentNode
			&& endOffset >= getNodeIndex(newParent)) {
				globalRange.setEnd(endContainer, endOffset + 1);
			}
		}
	}

	// "Let original parent be the parent of the first member of node list."
	var originalParent = nodeList[0].parentNode;

	// "If new parent is before the first member of node list in tree order:"
	if (isBefore(newParent, nodeList[0])) {
		// "If new parent is not an inline node, but the last child of new
		// parent and the first member of node list are both inline nodes, and
		// the last child of new parent is not a br, call createElement("br")
		// on the ownerDocument of new parent and append the result as the last
		// child of new parent."
		if (!isInlineNode(newParent)
		&& isInlineNode(newParent.lastChild)
		&& isInlineNode(nodeList[0])
		&& !isHtmlElement(newParent.lastChild, "BR")) {
			newParent.appendChild(newParent.ownerDocument.createElement("br"));
		}

		// "For each node in node list, append node as the last child of new
		// parent, preserving ranges."
		for (var i = 0; i < nodeList.length; i++) {
			movePreservingRanges(nodeList[i], newParent, -1, range);
		}

	// "Otherwise:"
	} else {
		// "If new parent is not an inline node, but the first child of new
		// parent and the last member of node list are both inline nodes, and
		// the last member of node list is not a br, call createElement("br")
		// on the ownerDocument of new parent and insert the result as the
		// first child of new parent."
		if (!isInlineNode(newParent)
		&& isInlineNode(newParent.firstChild)
		&& isInlineNode(nodeList[nodeList.length - 1])
		&& !isHtmlElement(nodeList[nodeList.length - 1], "BR")) {
			newParent.insertBefore(newParent.ownerDocument.createElement("br"), newParent.firstChild);
		}

		// "For each node in node list, in reverse order, insert node as the
		// first child of new parent, preserving ranges."
		for (var i = nodeList.length - 1; i >= 0; i--) {
			movePreservingRanges(nodeList[i], newParent, 0, range);
		}
	}

	// "If original parent is editable and has no children, remove it from its
	// parent."
	if (isEditable(originalParent) && !originalParent.hasChildNodes()) {
		originalParent.parentNode.removeChild(originalParent);
	}

	// "If new parent's nextSibling is editable and running sibling criteria on
	// it returns true:"
	if (isEditable(newParent.nextSibling)
	&& siblingCriteria(newParent.nextSibling)) {
		// "If new parent is not an inline node, but new parent's last child
		// and new parent's nextSibling's first child are both inline nodes,
		// and new parent's last child is not a br, call createElement("br") on
		// the ownerDocument of new parent and append the result as the last
		// child of new parent."
		if (!isInlineNode(newParent)
		&& isInlineNode(newParent.lastChild)
		&& isInlineNode(newParent.nextSibling.firstChild)
		&& !isHtmlElement(newParent.lastChild, "BR")) {
			newParent.appendChild(newParent.ownerDocument.createElement("br"));
		}

		// "While new parent's nextSibling has children, append its first child
		// as the last child of new parent, preserving ranges."
		while (newParent.nextSibling.hasChildNodes()) {
			movePreservingRanges(newParent.nextSibling.firstChild, newParent, -1, range);
		}

		// "Remove new parent's nextSibling from its parent."
		newParent.parentNode.removeChild(newParent.nextSibling);
	}

	// "Remove extraneous line breaks from new parent."
	removeExtraneousLineBreaksFrom(newParent);

	// "Return new parent."
	return newParent;
}


//@}
///// Allowed children /////
//@{

// "A name of an element with inline contents is "a", "abbr", "b", "bdi",
// "bdo", "cite", "code", "dfn", "em", "h1", "h2", "h3", "h4", "h5", "h6", "i",
// "kbd", "mark", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "small",
// "span", "strong", "sub", "sup", "u", "var", "acronym", "listing", "strike",
// "xmp", "big", "blink", "font", "marquee", "nobr", or "tt"."
var namesOfElementsWithInlineContents = ["a", "abbr", "b", "bdi", "bdo",
	"cite", "code", "dfn", "em", "h1", "h2", "h3", "h4", "h5", "h6", "i",
	"kbd", "mark", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "small",
	"span", "strong", "sub", "sup", "u", "var", "acronym", "listing", "strike",
	"xmp", "big", "blink", "font", "marquee", "nobr", "tt"];

// "An element with inline contents is an HTML element whose local name is a
// name of an element with inline contents."
function isElementWithInlineContents(node) {
	return isHtmlElement(node, namesOfElementsWithInlineContents);
}

function isAllowedChild(child, parent_) {
	// "If parent is "colgroup", "table", "tbody", "tfoot", "thead", "tr", or
	// an HTML element with local name equal to one of those, and child is a
	// Text node whose data does not consist solely of space characters, return
	// false."
	if (($_( ["colgroup", "table", "tbody", "tfoot", "thead", "tr"] ).indexOf(parent_) != -1
	|| isHtmlElement(parent_, ["colgroup", "table", "tbody", "tfoot", "thead", "tr"]))
	&& typeof child == "object"
	&& child.nodeType == $_.Node.TEXT_NODE
	&& !/^[ \t\n\f\r]*$/.test(child.data)) {
		return false;
	}

	// "If parent is "script", "style", "plaintext", or "xmp", or an HTML
	// element with local name equal to one of those, and child is not a Text
	// node, return false."
	if (($_( ["script", "style", "plaintext", "xmp"] ).indexOf(parent_) != -1
	|| isHtmlElement(parent_, ["script", "style", "plaintext", "xmp"]))
	&& (typeof child != "object" || child.nodeType != $_.Node.TEXT_NODE)) {
		return false;
	}

	// "If child is a Document, DocumentFragment, or DocumentType, return
	// false."
	if (typeof child == "object"
	&& (child.nodeType == $_.Node.DOCUMENT_NODE
	|| child.nodeType == $_.Node.DOCUMENT_FRAGMENT_NODE
	|| child.nodeType == $_.Node.DOCUMENT_TYPE_NODE)) {
		return false;
	}

	// "If child is an HTML element, set child to the local name of child."
	if (isHtmlElement(child)) {
		child = child.tagName.toLowerCase();
	}

	// "If child is not a string, return true."
	if (typeof child != "string") {
		return true;
	}

	// "If parent is an HTML element:"
	if (isHtmlElement(parent_)) {
		// "If child is "a", and parent or some ancestor of parent is an a,
		// return false."
		//
		// "If child is a prohibited paragraph child name and parent or some
		// ancestor of parent is an element with inline contents, return
		// false."
		//
		// "If child is "h1", "h2", "h3", "h4", "h5", or "h6", and parent or
		// some ancestor of parent is an HTML element with local name "h1",
		// "h2", "h3", "h4", "h5", or "h6", return false."
		var ancestor = parent_;
		while (ancestor) {
			if (child == "a" && isHtmlElement(ancestor, "a")) {
				return false;
			}
			if ($_( prohibitedParagraphChildNames ).indexOf(child) != -1
			&& isElementWithInlineContents(ancestor)) {
				return false;
			}
			if (/^h[1-6]$/.test(child)
			&& isHtmlElement(ancestor)
			&& /^H[1-6]$/.test(ancestor.tagName)) {
				return false;
			}
			ancestor = ancestor.parentNode;
		}

		// "Let parent be the local name of parent."
		parent_ = parent_.tagName.toLowerCase();
	}

	// "If parent is an Element or DocumentFragment, return true."
	if (typeof parent_ == "object"
	&& (parent_.nodeType == $_.Node.ELEMENT_NODE
	|| parent_.nodeType == $_.Node.DOCUMENT_FRAGMENT_NODE)) {
		return true;
	}

	// "If parent is not a string, return false."
	if (typeof parent_ != "string") {
		return false;
	}

	// "If parent is on the left-hand side of an entry on the following list,
	// then return true if child is listed on the right-hand side of that
	// entry, and false otherwise."
	switch (parent_) {
		case "colgroup":
			return child == "col";
		case "table":
			return $_( ["caption", "col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"] ).indexOf(child) != -1;
		case "tbody":
		case "thead":
		case "tfoot":
			return $_( ["td", "th", "tr"] ).indexOf(child) != -1;
		case "tr":
			return $_( ["td", "th"] ).indexOf(child) != -1;
		case "dl":
			return $_( ["dt", "dd"] ).indexOf(child) != -1;
		case "dir":
		case "ol":
		case "ul":
			return $_( ["dir", "li", "ol", "ul"] ).indexOf(child) != -1;
		case "hgroup":
			return /^h[1-6]$/.test(child);
	}

	// "If child is "body", "caption", "col", "colgroup", "frame", "frameset",
	// "head", "html", "tbody", "td", "tfoot", "th", "thead", or "tr", return
	// false."
	if ($_( ["body", "caption", "col", "colgroup", "frame", "frameset", "head",
	"html", "tbody", "td", "tfoot", "th", "thead", "tr"] ).indexOf(child) != -1) {
		return false;
	}

	// "If child is "dd" or "dt" and parent is not "dl", return false."
	if ($_( ["dd", "dt"] ).indexOf(child) != -1
	&& parent_ != "dl") {
		return false;
	}

	// "If child is "li" and parent is not "ol" or "ul", return false."
	if (child == "li"
	&& parent_ != "ol"
	&& parent_ != "ul") {
		return false;
	}

	// "If parent is on the left-hand side of an entry on the following list
	// and child is listed on the right-hand side of that entry, return false."
	var table = [
		[["a"], ["a"]],
		[["dd", "dt"], ["dd", "dt"]],
		[["h1", "h2", "h3", "h4", "h5", "h6"], ["h1", "h2", "h3", "h4", "h5", "h6"]],
		[["li"], ["li"]],
		[["nobr"], ["nobr"]],
		[namesOfElementsWithInlineContents, prohibitedParagraphChildNames],
		[["td", "th"], ["caption", "col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"]]
	];
	for (var i = 0; i < table.length; i++) {
		if ($_( table[i][0] ).indexOf(parent_) != -1
		&& $_( table[i][1] ).indexOf(child) != -1) {
			return false;
		}
	}

	// "Return true."
	return true;
}


//@}

//////////////////////////////////////
///// Inline formatting commands /////
//////////////////////////////////////

///// Inline formatting command definitions /////
//@{

// "A node node is effectively contained in a range range if range is not
// collapsed, and at least one of the following holds:"
function isEffectivelyContained(node, range) {
	if (range.collapsed) {
		return false;
	}

	// "node is contained in range."
	if (isContained(node, range)) {
		return true;
	}

	// "node is range's start node, it is a Text node, and its length is
	// different from range's start offset."
	if (node == range.startContainer
	&& node.nodeType == $_.Node.TEXT_NODE
	&& getNodeLength(node) != range.startOffset) {
		return true;
	}

	// "node is range's end node, it is a Text node, and range's end offset is
	// not 0."
	if (node == range.endContainer
	&& node.nodeType == $_.Node.TEXT_NODE
	&& range.endOffset != 0) {
		return true;
	}

	// "node has at least one child; and all its children are effectively
	// contained in range; and either range's start node is not a descendant of
	// node or is not a Text node or range's start offset is zero; and either
	// range's end node is not a descendant of node or is not a Text node or
	// range's end offset is its end node's length."
	if (node.hasChildNodes()
	&& $_(node.childNodes).every(function(child) { return isEffectivelyContained(child, range) })
	&& (!isDescendant(range.startContainer, node)
	|| range.startContainer.nodeType != $_.Node.TEXT_NODE
	|| range.startOffset == 0)
	&& (!isDescendant(range.endContainer, node)
	|| range.endContainer.nodeType != $_.Node.TEXT_NODE
	|| range.endOffset == getNodeLength(range.endContainer))) {
		return true;
	}

	return false;
}

// Like get(All)ContainedNodes(), but for effectively contained nodes.
function getEffectivelyContainedNodes(range, condition) {
	if (typeof condition == "undefined") {
		condition = function() { return true };
	}
	var node = range.startContainer;
	while (isEffectivelyContained(node.parentNode, range)) {
		node = node.parentNode;
	}

	var stop = nextNodeDescendants(range.endContainer);

	var nodeList = [];
	while (isBefore(node, stop)) {
		if (isEffectivelyContained(node, range)
		&& condition(node)) {
			nodeList.push(node);
			node = nextNodeDescendants(node);
			continue;
		}
		node = nextNode(node);
	}
	return nodeList;
}

function getAllEffectivelyContainedNodes(range, condition) {
	if (typeof condition == "undefined") {
		condition = function() { return true };
	}
	var node = range.startContainer;
	while (isEffectivelyContained(node.parentNode, range)) {
		node = node.parentNode;
	}

	var stop = nextNodeDescendants(range.endContainer);

	var nodeList = [];
	while (isBefore(node, stop)) {
		if (isEffectivelyContained(node, range)
		&& condition(node)) {
			nodeList.push(node);
		}
		node = nextNode(node);
	}
	return nodeList;
}

// "A modifiable element is a b, em, i, s, span, strong, sub, sup, or u element
// with no attributes except possibly style; or a font element with no
// attributes except possibly style, color, face, and/or size; or an a element
// with no attributes except possibly style and/or href."
function isModifiableElement(node) {
	if (!isHtmlElement(node)) {
		return false;
	}

	if ($_( ["B", "EM", "I", "S", "SPAN", "STRIKE", "STRONG", "SUB", "SUP", "U"] ).indexOf(node.tagName) != -1) {
		if (node.attributes.length == 0) {
			return true;
		}

		if (node.attributes.length == 1
		&& $_( node ).hasAttribute("style")) {
			return true;
		}
	}

	if (node.tagName == "FONT" || node.tagName == "A") {
		var numAttrs = node.attributes.length;

		if ($_( node ).hasAttribute("style")) {
			numAttrs--;
		}

		if (node.tagName == "FONT") {
			if ($_( node ).hasAttribute("color")) {
				numAttrs--;
			}

			if ($_( node ).hasAttribute("face")) {
				numAttrs--;
			}

			if ($_( node ).hasAttribute("size")) {
				numAttrs--;
			}
		}

		if (node.tagName == "A"
		&& $_( node ).hasAttribute("href")) {
			numAttrs--;
		}

		if (numAttrs == 0) {
			return true;
		}
	}

	return false;
}

function isSimpleModifiableElement(node) {
	// "A simple modifiable element is an HTML element for which at least one
	// of the following holds:"
	if (!isHtmlElement(node)) {
		return false;
	}

	// Only these elements can possibly be a simple modifiable element.
	if ($_( ["A", "B", "EM", "FONT", "I", "S", "SPAN", "STRIKE", "STRONG", "SUB", "SUP", "U"] ).indexOf(node.tagName) == -1) {
		return false;
	}

	// "It is an a, b, em, font, i, s, span, strike, strong, sub, sup, or u
	// element with no attributes."
	if (node.attributes.length == 0) {
		return true;
	}

	// If it's got more than one attribute, everything after this fails.
	if (node.attributes.length > 1) {
		return false;
	}

	// "It is an a, b, em, font, i, s, span, strike, strong, sub, sup, or u
	// element with exactly one attribute, which is style, which sets no CSS
	// properties (including invalid or unrecognized properties)."
	//
	// Not gonna try for invalid or unrecognized.
	if ($_( node ).hasAttribute("style")
	&& getStyleLength(node) == 0) {
		return true;
	}

	// "It is an a element with exactly one attribute, which is href."
	if (node.tagName == "A"
	&& $_( node ).hasAttribute("href")) {
		return true;
	}

	// "It is a font element with exactly one attribute, which is either color,
	// face, or size."
	if (node.tagName == "FONT"
	&& ($_( node ).hasAttribute("color")
	|| $_( node ).hasAttribute("face")
	|| $_( node ).hasAttribute("size")
	)) {
		return true;
	}

	// "It is a b or strong element with exactly one attribute, which is style,
	// and the style attribute sets exactly one CSS property (including invalid
	// or unrecognized properties), which is "font-weight"."
	if ((node.tagName == "B" || node.tagName == "STRONG")
	&& $_( node ).hasAttribute("style")
	&& getStyleLength(node) == 1
	&& node.style.fontWeight != "") {
		return true;
	}

	// "It is an i or em element with exactly one attribute, which is style,
	// and the style attribute sets exactly one CSS property (including invalid
	// or unrecognized properties), which is "font-style"."
	if ((node.tagName == "I" || node.tagName == "EM")
	&& $_( node ).hasAttribute("style")
	&& getStyleLength(node) == 1
	&& node.style.fontStyle != "") {
		return true;
	}

	// "It is an a, font, or span element with exactly one attribute, which is
	// style, and the style attribute sets exactly one CSS property (including
	// invalid or unrecognized properties), and that property is not
	// "text-decoration"."
	if ((node.tagName == "A" || node.tagName == "FONT" || node.tagName == "SPAN")
	&& $_( node ).hasAttribute("style")
	&& getStyleLength(node) == 1
	&& node.style.textDecoration == "") {
		return true;
	}

	// "It is an a, font, s, span, strike, or u element with exactly one
	// attribute, which is style, and the style attribute sets exactly one CSS
	// property (including invalid or unrecognized properties), which is
	// "text-decoration", which is set to "line-through" or "underline" or
	// "overline" or "none"."
	if ($_( ["A", "FONT", "S", "SPAN", "STRIKE", "U"] ).indexOf(node.tagName) != -1
	&& $_( node ).hasAttribute("style")
	&& getStyleLength(node) == 1
	&& (node.style.textDecoration == "line-through"
	|| node.style.textDecoration == "underline"
	|| node.style.textDecoration == "overline"
	|| node.style.textDecoration == "none")) {
		return true;
	}

	return false;
}

// "Two quantities are equivalent values for a command if either both are null,
// or both are strings and they're equal and the command does not define any
// equivalent values, or both are strings and the command defines equivalent
// values and they match the definition."
function areEquivalentValues(command, val1, val2) {
	if (val1 === null && val2 === null) {
		return true;
	}

	if (typeof val1 == "string"
	&& typeof val2 == "string"
	&& val1 == val2
	&& !("equivalentValues" in commands[command])) {
		return true;
	}

	if (typeof val1 == "string"
	&& typeof val2 == "string"
	&& "equivalentValues" in commands[command]
	&& commands[command].equivalentValues(val1, val2)) {
		return true;
	}

	return false;
}

// "Two quantities are loosely equivalent values for a command if either they
// are equivalent values for the command, or if the command is the fontSize
// command; one of the quantities is one of "xx-small", "small", "medium",
// "large", "x-large", "xx-large", or "xxx-large"; and the other quantity is
// the resolved value of "font-size" on a font element whose size attribute has
// the corresponding value set ("1" through "7" respectively)."
function areLooselyEquivalentValues(command, val1, val2) {
	if (areEquivalentValues(command, val1, val2)) {
		return true;
	}

	if (command != "fontsize"
	|| typeof val1 != "string"
	|| typeof val2 != "string") {
		return false;
	}

	// Static variables in JavaScript?
	var callee = areLooselyEquivalentValues;
	if (callee.sizeMap === undefined) {
		callee.sizeMap = {};
		var font = document.createElement("font");
		document.body.appendChild(font);
		$_( ["xx-small", "small", "medium", "large", "x-large", "xx-large",
		"xxx-large"] ).forEach(function(keyword) {
			font.size = cssSizeToLegacy(keyword);
			callee.sizeMap[keyword] = $_.getComputedStyle(font).fontSize;
		});
		document.body.removeChild(font);
	}

	return val1 === callee.sizeMap[val2]
		|| val2 === callee.sizeMap[val1];
}

//@}
///// Assorted inline formatting command algorithms /////
//@{

function getEffectiveCommandValue(node, command) {
	// "If neither node nor its parent is an Element, return null."
	if (node.nodeType != $_.Node.ELEMENT_NODE
	&& (!node.parentNode || node.parentNode.nodeType != $_.Node.ELEMENT_NODE)) {
		return null;
	}

	// "If node is not an Element, return the effective command value of its
	// parent for command."
	if (node.nodeType != $_.Node.ELEMENT_NODE) {
		return getEffectiveCommandValue(node.parentNode, command);
	}

	// "If command is "createLink" or "unlink":"
	if (command == "createlink" || command == "unlink") {
		// "While node is not null, and is not an a element that has an href
		// attribute, set node to its parent."
		while (node
		&& (!isHtmlElement(node)
		|| node.tagName != "A"
		|| !$_( node ).hasAttribute("href"))) {
			node = node.parentNode;
		}

		// "If node is null, return null."
		if (!node) {
			return null;
		}

		// "Return the value of node's href attribute."
		return node.getAttribute("href");
	}

	// "If command is "backColor" or "hiliteColor":"
	if (command == "backcolor"
	|| command == "hilitecolor") {
		// "While the resolved value of "background-color" on node is any
		// fully transparent value, and node's parent is an Element, set
		// node to its parent."
		//
		// Another lame hack to avoid flawed APIs.
		while (($_.getComputedStyle(node).backgroundColor == "rgba(0, 0, 0, 0)"
		|| $_.getComputedStyle(node).backgroundColor === ""
		|| $_.getComputedStyle(node).backgroundColor == "transparent")
		&& node.parentNode
		&& node.parentNode.nodeType == $_.Node.ELEMENT_NODE) {
			node = node.parentNode;
		}

		// "If the resolved value of "background-color" on node is a fully
		// transparent value, return "rgb(255, 255, 255)"."
		if ($_.getComputedStyle(node).backgroundColor == "rgba(0, 0, 0, 0)"
        || $_.getComputedStyle(node).backgroundColor === ""
        || $_.getComputedStyle(node).backgroundColor == "transparent") {
			return "rgb(255, 255, 255)";
		}

		// "Otherwise, return the resolved value of "background-color" for
		// node."
		return $_.getComputedStyle(node).backgroundColor;
	}

	// "If command is "subscript" or "superscript":"
	if (command == "subscript" || command == "superscript") {
		// "Let affected by subscript and affected by superscript be two
		// boolean variables, both initially false."
		var affectedBySubscript = false;
		var affectedBySuperscript = false;

		// "While node is an inline node:"
		while (isInlineNode(node)) {
			var verticalAlign = $_.getComputedStyle(node).verticalAlign;

			// "If node is a sub, set affected by subscript to true."
			if (isHtmlElement(node, "sub")) {
				affectedBySubscript = true;
			// "Otherwise, if node is a sup, set affected by superscript to
			// true."
			} else if (isHtmlElement(node, "sup")) {
				affectedBySuperscript = true;
			}

			// "Set node to its parent."
			node = node.parentNode;
		}

		// "If affected by subscript and affected by superscript are both true,
		// return the string "mixed"."
		if (affectedBySubscript && affectedBySuperscript) {
			return "mixed";
		}

		// "If affected by subscript is true, return "subscript"."
		if (affectedBySubscript) {
			return "subscript";
		}

		// "If affected by superscript is true, return "superscript"."
		if (affectedBySuperscript) {
			return "superscript";
		}

		// "Return null."
		return null;
	}

	// "If command is "strikethrough", and the "text-decoration" property of
	// node or any of its ancestors has resolved value containing
	// "line-through", return "line-through". Otherwise, return null."
	if (command == "strikethrough") {
		do {
			if ($_.getComputedStyle(node).textDecoration.indexOf("line-through") != -1) {
				return "line-through";
			}
			node = node.parentNode;
		} while (node && node.nodeType == $_.Node.ELEMENT_NODE);
		return null;
	}

	// "If command is "underline", and the "text-decoration" property of node
	// or any of its ancestors has resolved value containing "underline",
	// return "underline". Otherwise, return null."
	if (command == "underline") {
		do {
			if ($_.getComputedStyle(node).textDecoration.indexOf("underline") != -1) {
				return "underline";
			}
			node = node.parentNode;
		} while (node && node.nodeType == $_.Node.ELEMENT_NODE);
		return null;
	}

	if (!("relevantCssProperty" in commands[command])) {
		throw "Bug: no relevantCssProperty for " + command + " in getEffectiveCommandValue";
	}

	// "Return the resolved value for node of the relevant CSS property for
	// command."
	return $_.getComputedStyle(node)[commands[command].relevantCssProperty].toString();
}

function getSpecifiedCommandValue(element, command) {
	// "If command is "backColor" or "hiliteColor" and element's display
	// property does not have resolved value "inline", return null."
	if ((command == "backcolor" || command == "hilitecolor")
	&& $_.getComputedStyle(element).display != "inline") {
		return null;
	}

	// "If command is "createLink" or "unlink":"
	if (command == "createlink" || command == "unlink") {
		// "If element is an a element and has an href attribute, return the
		// value of that attribute."
		if (isHtmlElement(element)
		&& element.tagName == "A"
		&& $_( element ).hasAttribute("href")) {
			return element.getAttribute("href");
		}

		// "Return null."
		return null;
	}

	// "If command is "subscript" or "superscript":"
	if (command == "subscript" || command == "superscript") {
		// "If element is a sup, return "superscript"."
		if (isHtmlElement(element, "sup")) {
			return "superscript";
		}

		// "If element is a sub, return "subscript"."
		if (isHtmlElement(element, "sub")) {
			return "subscript";
		}

		// "Return null."
		return null;
	}

	// "If command is "strikethrough", and element has a style attribute set,
	// and that attribute sets "text-decoration":"
	if (command == "strikethrough"
	&& element.style.textDecoration != "") {
		// "If element's style attribute sets "text-decoration" to a value
		// containing "line-through", return "line-through"."
		if (element.style.textDecoration.indexOf("line-through") != -1) {
			return "line-through";
		}

		// "Return null."
		return null;
	}

	// "If command is "strikethrough" and element is a s or strike element,
	// return "line-through"."
	if (command == "strikethrough"
	&& isHtmlElement(element, ["S", "STRIKE"])) {
		return "line-through";
	}

	// "If command is "underline", and element has a style attribute set, and
	// that attribute sets "text-decoration":"
	if (command == "underline"
	&& element.style.textDecoration != "") {
		// "If element's style attribute sets "text-decoration" to a value
		// containing "underline", return "underline"."
		if (element.style.textDecoration.indexOf("underline") != -1) {
			return "underline";
		}

		// "Return null."
		return null;
	}

	// "If command is "underline" and element is a u element, return
	// "underline"."
	if (command == "underline"
	&& isHtmlElement(element, "U")) {
		return "underline";
	}

	// "Let property be the relevant CSS property for command."
	var property = commands[command].relevantCssProperty;

	// "If property is null, return null."
	if (property === null) {
		return null;
	}

	// "If element has a style attribute set, and that attribute has the
	// effect of setting property, return the value that it sets property to."
	if (element.style[property] != "") {
		return element.style[property];
	}

	// "If element is a font element that has an attribute whose effect is
	// to create a presentational hint for property, return the value that the
	// hint sets property to.  (For a size of 7, this will be the non-CSS value
	// "xxx-large".)"
	if (isHtmlNamespace(element.namespaceURI)
	&& element.tagName == "FONT") {
		if (property == "color" && $_( element ).hasAttribute("color")) {
			return element.color;
		}
		if (property == "fontFamily" && $_( element ).hasAttribute("face")) {
			return element.face;
		}
		if (property == "fontSize" && $_( element ).hasAttribute("size")) {
			// This is not even close to correct in general.
			var size = parseInt(element.size);
			if (size < 1) {
				size = 1;
			}
			if (size > 7) {
				size = 7;
			}
			return {
				1: "xx-small",
				2: "small",
				3: "medium",
				4: "large",
				5: "x-large",
				6: "xx-large",
				7: "xxx-large"
			}[size];
		}
	}

	// "If element is in the following list, and property is equal to the
	// CSS property name listed for it, return the string listed for it."
	//
	// A list follows, whose meaning is copied here.
	if (property == "fontWeight"
	&& (element.tagName == "B" || element.tagName == "STRONG")) {
		return "bold";
	}
	if (property == "fontStyle"
	&& (element.tagName == "I" || element.tagName == "EM")) {
		return "italic";
	}

	// "Return null."
	return null;
}

function reorderModifiableDescendants(node, command, newValue, range) {
	// "Let candidate equal node."
	var candidate = node;

	// "While candidate is a modifiable element, and candidate has exactly one
	// child, and that child is also a modifiable element, and candidate is not
	// a simple modifiable element or candidate's specified command value for
	// command is not equivalent to new value, set candidate to its child."
	while (isModifiableElement(candidate)
	&& candidate.childNodes.length == 1
	&& isModifiableElement(candidate.firstChild)
	&& (!isSimpleModifiableElement(candidate)
	|| !areEquivalentValues(command, getSpecifiedCommandValue(candidate, command), newValue))) {
		candidate = candidate.firstChild;
	}

	// "If candidate is node, or is not a simple modifiable element, or its
	// specified command value is not equivalent to new value, or its effective
	// command value is not loosely equivalent to new value, abort these
	// steps."
	if (candidate == node
	|| !isSimpleModifiableElement(candidate)
	|| !areEquivalentValues(command, getSpecifiedCommandValue(candidate, command), newValue)
	|| !areLooselyEquivalentValues(command, getEffectiveCommandValue(candidate, command), newValue)) {
		return;
	}

	// "While candidate has children, insert the first child of candidate into
	// candidate's parent immediately before candidate, preserving ranges."
	while (candidate.hasChildNodes()) {
		movePreservingRanges(candidate.firstChild, candidate.parentNode, getNodeIndex(candidate), range);
	}

	// "Insert candidate into node's parent immediately after node."
	node.parentNode.insertBefore(candidate, node.nextSibling);

	// "Append the node as the last child of candidate, preserving ranges."
	movePreservingRanges(node, candidate, -1, range);
}

function recordValues(nodeList) {
	// "Let values be a list of (node, command, specified command value)
	// triples, initially empty."
	var values = [];

	// "For each node in node list, for each command in the list "subscript",
	// "bold", "fontName", "fontSize", "foreColor", "hiliteColor", "italic",
	// "strikethrough", and "underline" in that order:"
	$_( nodeList ).forEach(function(node) {
		$_( ["subscript", "bold", "fontname", "fontsize", "forecolor",
		"hilitecolor", "italic", "strikethrough", "underline"] ).forEach(function(command) {
			// "Let ancestor equal node."
			var ancestor = node;

			// "If ancestor is not an Element, set it to its parent."
			if (ancestor.nodeType != $_.Node.ELEMENT_NODE) {
				ancestor = ancestor.parentNode;
			}

			// "While ancestor is an Element and its specified command value
			// for command is null, set it to its parent."
			while (ancestor
			&& ancestor.nodeType == $_.Node.ELEMENT_NODE
			&& getSpecifiedCommandValue(ancestor, command) === null) {
				ancestor = ancestor.parentNode;
			}

			// "If ancestor is an Element, add (node, command, ancestor's
			// specified command value for command) to values. Otherwise add
			// (node, command, null) to values."
			if (ancestor && ancestor.nodeType == $_.Node.ELEMENT_NODE) {
				values.push([node, command, getSpecifiedCommandValue(ancestor, command)]);
			} else {
				values.push([node, command, null]);
			}
		});
	});

	// "Return values."
	return values;
}

function restoreValues(values, range) {
	// "For each (node, command, value) triple in values:"
	$_( values ).forEach(function(triple) {
		var node = triple[0];
		var command = triple[1];
		var value = triple[2];

		// "Let ancestor equal node."
		var ancestor = node;

		// "If ancestor is not an Element, set it to its parent."
		if (!ancestor || ancestor.nodeType != $_.Node.ELEMENT_NODE) {
			ancestor = ancestor.parentNode;
		}

		// "While ancestor is an Element and its specified command value for
		// command is null, set it to its parent."
		while (ancestor
		&& ancestor.nodeType == $_.Node.ELEMENT_NODE
		&& getSpecifiedCommandValue(ancestor, command) === null) {
			ancestor = ancestor.parentNode;
		}

		// "If value is null and ancestor is an Element, push down values on
		// node for command, with new value null."
		if (value === null
		&& ancestor
		&& ancestor.nodeType == $_.Node.ELEMENT_NODE) {
			pushDownValues(node, command, null, range);

		// "Otherwise, if ancestor is an Element and its specified command
		// value for command is not equivalent to value, or if ancestor is not
		// an Element and value is not null, force the value of command to
		// value on node."
		} else if ((ancestor
		&& ancestor.nodeType == $_.Node.ELEMENT_NODE
		&& !areEquivalentValues(command, getSpecifiedCommandValue(ancestor, command), value))
		|| ((!ancestor || ancestor.nodeType != $_.Node.ELEMENT_NODE)
		&& value !== null)) {
			forceValue(node, command, value, range);
		}
	});
}


//@}
///// Clearing an element's value /////
//@{

function clearValue(element, command, range) {
	// "If element is not editable, return the empty list."
	if (!isEditable(element)) {
		return [];
	}

	// "If element's specified command value for command is null, return the
	// empty list."
	if (getSpecifiedCommandValue(element, command) === null) {
		return [];
	}

	// "If element is a simple modifiable element:"
	if (isSimpleModifiableElement(element)) {
		// "Let children be the children of element."
		var children = Array.prototype.slice.call(toArray(element.childNodes));

		// "For each child in children, insert child into element's parent
		// immediately before element, preserving ranges."
		for (var i = 0; i < children.length; i++) {
			movePreservingRanges(children[i], element.parentNode, getNodeIndex(element), range);
		}

		// "Remove element from its parent."
		element.parentNode.removeChild(element);

		// "Return children."
		return children;
	}

	// "If command is "strikethrough", and element has a style attribute that
	// sets "text-decoration" to some value containing "line-through", delete
	// "line-through" from the value."
	if (command == "strikethrough"
	&& element.style.textDecoration.indexOf("line-through") != -1) {
		if (element.style.textDecoration == "line-through") {
			element.style.textDecoration = "";
		} else {
			element.style.textDecoration = element.style.textDecoration.replace("line-through", "");
		}
		if (element.getAttribute("style") == "") {
			element.removeAttribute("style");
		}
	}

	// "If command is "underline", and element has a style attribute that sets
	// "text-decoration" to some value containing "underline", delete
	// "underline" from the value."
	if (command == "underline"
	&& element.style.textDecoration.indexOf("underline") != -1) {
		if (element.style.textDecoration == "underline") {
			element.style.textDecoration = "";
		} else {
			element.style.textDecoration = element.style.textDecoration.replace("underline", "");
		}
		if (element.getAttribute("style") == "") {
			element.removeAttribute("style");
		}
	}

	// "If the relevant CSS property for command is not null, unset the CSS
	// property property of element."
	if (commands[command].relevantCssProperty !== null) {
		element.style[commands[command].relevantCssProperty] = '';
		if (element.getAttribute("style") == "") {
			element.removeAttribute("style");
		}
	}

	// "If element is a font element:"
	if (isHtmlNamespace(element.namespaceURI) && element.tagName == "FONT") {
		// "If command is "foreColor", unset element's color attribute, if set."
		if (command == "forecolor") {
			element.removeAttribute("color");
		}

		// "If command is "fontName", unset element's face attribute, if set."
		if (command == "fontname") {
			element.removeAttribute("face");
		}

		// "If command is "fontSize", unset element's size attribute, if set."
		if (command == "fontsize") {
			element.removeAttribute("size");
		}
	}

	// "If element is an a element and command is "createLink" or "unlink",
	// unset the href property of element."
	if (isHtmlElement(element, "A")
	&& (command == "createlink" || command == "unlink")) {
		element.removeAttribute("href");
	}

	// "If element's specified command value for command is null, return the
	// empty list."
	if (getSpecifiedCommandValue(element, command) === null) {
		return [];
	}

	// "Set the tag name of element to "span", and return the one-node list
	// consisting of the result."
	return [setTagName(element, "span", range)];
}


//@}
///// Pushing down values /////
//@{

function pushDownValues(node, command, newValue, range) {
	// "If node's parent is not an Element, abort this algorithm."
	if (!node.parentNode
	|| node.parentNode.nodeType != $_.Node.ELEMENT_NODE) {
		return;
	}

	// "If the effective command value of command is loosely equivalent to new
	// value on node, abort this algorithm."
	if (areLooselyEquivalentValues(command, getEffectiveCommandValue(node, command), newValue)) {
		return;
	}

	// "Let current ancestor be node's parent."
	var currentAncestor = node.parentNode;

	// "Let ancestor list be a list of Nodes, initially empty."
	var ancestorList = [];

	// "While current ancestor is an editable Element and the effective command
	// value of command is not loosely equivalent to new value on it, append
	// current ancestor to ancestor list, then set current ancestor to its
	// parent."
	while (isEditable(currentAncestor)
	&& currentAncestor.nodeType == $_.Node.ELEMENT_NODE
	&& !areLooselyEquivalentValues(command, getEffectiveCommandValue(currentAncestor, command), newValue)) {
		ancestorList.push(currentAncestor);
		currentAncestor = currentAncestor.parentNode;
	}

	// "If ancestor list is empty, abort this algorithm."
	if (!ancestorList.length) {
		return;
	}

	// "Let propagated value be the specified command value of command on the
	// last member of ancestor list."
	var propagatedValue = getSpecifiedCommandValue(ancestorList[ancestorList.length - 1], command);

	// "If propagated value is null and is not equal to new value, abort this
	// algorithm."
	if (propagatedValue === null && propagatedValue != newValue) {
		return;
	}

	// "If the effective command value for the parent of the last member of
	// ancestor list is not loosely equivalent to new value, and new value is
	// not null, abort this algorithm."
	if (newValue !== null
	&& !areLooselyEquivalentValues(command, getEffectiveCommandValue(ancestorList[ancestorList.length - 1].parentNode, command), newValue)) {
		return;
	}

	// "While ancestor list is not empty:"
	while (ancestorList.length) {
		// "Let current ancestor be the last member of ancestor list."
		// "Remove the last member from ancestor list."
		var currentAncestor = ancestorList.pop();

		// "If the specified command value of current ancestor for command is
		// not null, set propagated value to that value."
		if (getSpecifiedCommandValue(currentAncestor, command) !== null) {
			propagatedValue = getSpecifiedCommandValue(currentAncestor, command);
		}

		// "Let children be the children of current ancestor."
		var children = Array.prototype.slice.call(toArray(currentAncestor.childNodes));

		// "If the specified command value of current ancestor for command is
		// not null, clear the value of current ancestor."
		if (getSpecifiedCommandValue(currentAncestor, command) !== null) {
			clearValue(currentAncestor, command, range);
		}

		// "For every child in children:"
		for (var i = 0; i < children.length; i++) {
			var child = children[i];

			// "If child is node, continue with the next child."
			if (child == node) {
				continue;
			}

			// "If child is an Element whose specified command value for
			// command is neither null nor equivalent to propagated value,
			// continue with the next child."
			if (child.nodeType == $_.Node.ELEMENT_NODE
			&& getSpecifiedCommandValue(child, command) !== null
			&& !areEquivalentValues(command, propagatedValue, getSpecifiedCommandValue(child, command))) {
				continue;
			}

			// "If child is the last member of ancestor list, continue with the
			// next child."
			if (child == ancestorList[ancestorList.length - 1]) {
				continue;
			}

			// "Force the value of child, with command as in this algorithm
			// and new value equal to propagated value."
			forceValue(child, command, propagatedValue, range);
		}
	}
}


//@}
///// Forcing the value of a node /////
//@{

function forceValue(node, command, newValue, range) {
	// "If node's parent is null, abort this algorithm."
	if (!node.parentNode) {
		return;
	}

	// "If new value is null, abort this algorithm."
	if (newValue === null) {
		return;
	}

	// "If node is an allowed child of "span":"
	if (isAllowedChild(node, "span")) {
		// "Reorder modifiable descendants of node's previousSibling."
		reorderModifiableDescendants(node.previousSibling, command, newValue, range);

		// "Reorder modifiable descendants of node's nextSibling."
		reorderModifiableDescendants(node.nextSibling, command, newValue, range);

		// "Wrap the one-node list consisting of node, with sibling criteria
		// returning true for a simple modifiable element whose specified
		// command value is equivalent to new value and whose effective command
		// value is loosely equivalent to new value and false otherwise, and
		// with new parent instructions returning null."
		wrap([node],
			function(node) {
				return isSimpleModifiableElement(node)
					&& areEquivalentValues(command, getSpecifiedCommandValue(node, command), newValue)
					&& areLooselyEquivalentValues(command, getEffectiveCommandValue(node, command), newValue);
			},
			function() { return null },
			range
		);
	}

	// "If the effective command value of command is loosely equivalent to new
	// value on node, abort this algorithm."
	if (areLooselyEquivalentValues(command, getEffectiveCommandValue(node, command), newValue)) {
		return;
	}

	// "If node is not an allowed child of "span":"
	if (!isAllowedChild(node, "span")) {
		// "Let children be all children of node, omitting any that are
		// Elements whose specified command value for command is neither null
		// nor equivalent to new value."
		var children = [];
		for (var i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeType == $_.Node.ELEMENT_NODE) {
				var specifiedValue = getSpecifiedCommandValue(node.childNodes[i], command);

				if (specifiedValue !== null
				&& !areEquivalentValues(command, newValue, specifiedValue)) {
					continue;
				}
			}
			children.push(node.childNodes[i]);
		}

		// "Force the value of each Node in children, with command and new
		// value as in this invocation of the algorithm."
		for (var i = 0; i < children.length; i++) {
			forceValue(children[i], command, newValue, range);
		}

		// "Abort this algorithm."
		return;
	}

	// "If the effective command value of command is loosely equivalent to new
	// value on node, abort this algorithm."
	if (areLooselyEquivalentValues(command, getEffectiveCommandValue(node, command), newValue)) {
		return;
	}

	// "Let new parent be null."
	var newParent = null;

	// "If the CSS styling flag is false:"
	if (!cssStylingFlag) {
		// "If command is "bold" and new value is "bold", let new parent be the
		// result of calling createElement("b") on the ownerDocument of node."
		if (command == "bold" && (newValue == "bold" || newValue == "700")) {
			newParent = node.ownerDocument.createElement("b");
		}

		// "If command is "italic" and new value is "italic", let new parent be
		// the result of calling createElement("i") on the ownerDocument of
		// node."
		if (command == "italic" && newValue == "italic") {
			newParent = node.ownerDocument.createElement("i");
		}

		// "If command is "strikethrough" and new value is "line-through", let
		// new parent be the result of calling createElement("s") on the
		// ownerDocument of node."
		if (command == "strikethrough" && newValue == "line-through") {
			newParent = node.ownerDocument.createElement("s");
		}

		// "If command is "underline" and new value is "underline", let new
		// parent be the result of calling createElement("u") on the
		// ownerDocument of node."
		if (command == "underline" && newValue == "underline") {
			newParent = node.ownerDocument.createElement("u");
		}

		// "If command is "foreColor", and new value is fully opaque with red,
		// green, and blue components in the range 0 to 255:"
		if (command == "forecolor" && parseSimpleColor(newValue)) {
			// "Let new parent be the result of calling createElement("span")
			// on the ownerDocument of node."
			// NOTE: modified this process to create span elements with style attributes
			// instead of oldschool font tags with color attributes
			newParent = node.ownerDocument.createElement("span");

			// "If new value is an extended color keyword, set the color
			// attribute of new parent to new value."
			//
			// "Otherwise, set the color attribute of new parent to the result
			// of applying the rules for serializing simple color values to new
			// value (interpreted as a simple color)."
			jQuery(newParent).css('color', parseSimpleColor(newValue));
		}

		// "If command is "fontName", let new parent be the result of calling
		// createElement("font") on the ownerDocument of node, then set the
		// face attribute of new parent to new value."
		if (command == "fontname") {
			newParent = node.ownerDocument.createElement("font");
			newParent.face = newValue;
		}
	}

	// "If command is "createLink" or "unlink":"
	if (command == "createlink" || command == "unlink") {
		// "Let new parent be the result of calling createElement("a") on the
		// ownerDocument of node."
		newParent = node.ownerDocument.createElement("a");

		// "Set the href attribute of new parent to new value."
		newParent.setAttribute("href", newValue);

		// "Let ancestor be node's parent."
		var ancestor = node.parentNode;

		// "While ancestor is not null:"
		while (ancestor) {
			// "If ancestor is an a, set the tag name of ancestor to "span",
			// and let ancestor be the result."
			if (isHtmlElement(ancestor, "A")) {
				ancestor = setTagName(ancestor, "span", range);
			}

			// "Set ancestor to its parent."
			ancestor = ancestor.parentNode;
		}
	}

	// "If command is "fontSize"; and new value is one of "xx-small", "small",
	// "medium", "large", "x-large", "xx-large", or "xxx-large"; and either the
	// CSS styling flag is false, or new value is "xxx-large": let new parent
	// be the result of calling createElement("font") on the ownerDocument of
	// node, then set the size attribute of new parent to the number from the
	// following table based on new value: [table omitted]"
	if (command == "fontsize"
	&& $_( ["xx-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"] ).indexOf(newValue) != -1
	&& (!cssStylingFlag || newValue == "xxx-large")) {
		newParent = node.ownerDocument.createElement("font");
		newParent.size = cssSizeToLegacy(newValue);
	}

	// "If command is "subscript" or "superscript" and new value is
	// "subscript", let new parent be the result of calling
	// createElement("sub") on the ownerDocument of node."
	if ((command == "subscript" || command == "superscript")
	&& newValue == "subscript") {
		newParent = node.ownerDocument.createElement("sub");
	}

	// "If command is "subscript" or "superscript" and new value is
	// "superscript", let new parent be the result of calling
	// createElement("sup") on the ownerDocument of node."
	if ((command == "subscript" || command == "superscript")
	&& newValue == "superscript") {
		newParent = node.ownerDocument.createElement("sup");
	}

	// "If new parent is null, let new parent be the result of calling
	// createElement("span") on the ownerDocument of node."
	if (!newParent) {
		newParent = node.ownerDocument.createElement("span");
	}

	// "Insert new parent in node's parent before node."
	node.parentNode.insertBefore(newParent, node);

	// "If the effective command value of command for new parent is not loosely
	// equivalent to new value, and the relevant CSS property for command is
	// not null, set that CSS property of new parent to new value (if the new
	// value would be valid)."
	var property = commands[command].relevantCssProperty;
	if (property !== null
	&& !areLooselyEquivalentValues(command, getEffectiveCommandValue(newParent, command), newValue)) {
		newParent.style[property] = newValue;
	}

	// "If command is "strikethrough", and new value is "line-through", and the
	// effective command value of "strikethrough" for new parent is not
	// "line-through", set the "text-decoration" property of new parent to
	// "line-through"."
	if (command == "strikethrough"
	&& newValue == "line-through"
	&& getEffectiveCommandValue(newParent, "strikethrough") != "line-through") {
		newParent.style.textDecoration = "line-through";
	}

	// "If command is "underline", and new value is "underline", and the
	// effective command value of "underline" for new parent is not
	// "underline", set the "text-decoration" property of new parent to
	// "underline"."
	if (command == "underline"
	&& newValue == "underline"
	&& getEffectiveCommandValue(newParent, "underline") != "underline") {
		newParent.style.textDecoration = "underline";
	}

	// "Append node to new parent as its last child, preserving ranges."
	movePreservingRanges(node, newParent, newParent.childNodes.length, range);

	// "If node is an Element and the effective command value of command for
	// node is not loosely equivalent to new value:"
	if (node.nodeType == $_.Node.ELEMENT_NODE
	&& !areEquivalentValues(command, getEffectiveCommandValue(node, command), newValue)) {
		// "Insert node into the parent of new parent before new parent,
		// preserving ranges."
		movePreservingRanges(node, newParent.parentNode, getNodeIndex(newParent), range);

		// "Remove new parent from its parent."
		newParent.parentNode.removeChild(newParent);

		// "Let children be all children of node, omitting any that are
		// Elements whose specified command value for command is neither null
		// nor equivalent to new value."
		var children = [];
		for (var i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeType == $_.Node.ELEMENT_NODE) {
				var specifiedValue = getSpecifiedCommandValue(node.childNodes[i], command);

				if (specifiedValue !== null
				&& !areEquivalentValues(command, newValue, specifiedValue)) {
					continue;
				}
			}
			children.push(node.childNodes[i]);
		}

		// "Force the value of each Node in children, with command and new
		// value as in this invocation of the algorithm."
		for (var i = 0; i < children.length; i++) {
			forceValue(children[i], command, newValue, range);
		}
	}
}


//@}
///// Setting the selection's value /////
//@{

function setSelectionValue(command, newValue, range) {
	
	// Use current selected range if no range passed
	range = range || getActiveRange();
	
	// "If there is no editable text node effectively contained in the active
	// range:"
	if (!$_( getAllEffectivelyContainedNodes(range) )
	.filter(function(node) { return node.nodeType == $_.Node.TEXT_NODE}, true)
	.some(isEditable)) {
		// "If command has inline command activated values, set the state
		// override to true if new value is among them and false if it's not."
		if ("inlineCommandActivatedValues" in commands[command]) {
			setStateOverride(command, 
      $_(commands[command].inlineCommandActivatedValues).indexOf(newValue) != -1,
      range);
		}

		// "If command is "subscript", unset the state override for
		// "superscript"."
		if (command == "subscript") {
			unsetStateOverride("superscript", range);
		}

		// "If command is "superscript", unset the state override for
		// "subscript"."
		if (command == "superscript") {
			unsetStateOverride("subscript", range);
		}

		// "If new value is null, unset the value override (if any)."
		if (newValue === null) {
			unsetValueOverride(command, range);

		// "Otherwise, if command has a value specified, set the value override
		// to new value."
		} else if ("value" in commands[command]) {
			setValueOverride(command, newValue, range);
		}

		// "Abort these steps."
		return;
	}

	// "If the active range's start node is an editable Text node, and its
	// start offset is neither zero nor its start node's length, call
	// splitText() on the active range's start node, with argument equal to the
	// active range's start offset. Then set the active range's start node to
	// the result, and its start offset to zero."
	if (isEditable(range.startContainer)
	&& range.startContainer.nodeType == $_.Node.TEXT_NODE
	&& range.startOffset != 0
	&& range.startOffset != getNodeLength(range.startContainer)) {
		// Account for browsers not following range mutation rules
		var newNode = range.startContainer.splitText(range.startOffset);
		var newActiveRange = Aloha.createRange();
		if (range.startContainer == range.endContainer) {
			var newEndOffset = range.endOffset - range.startOffset;
			newActiveRange.setEnd(newNode, newEndOffset);
			range.setEnd(newNode, newEndOffset);
		}
		newActiveRange.setStart(newNode, 0);
		Aloha.getSelection().removeAllRanges();
		Aloha.getSelection().addRange(newActiveRange);

		range.setStart(newNode, 0);
	}

	// "If the active range's end node is an editable Text node, and its end
	// offset is neither zero nor its end node's length, call splitText() on
	// the active range's end node, with argument equal to the active range's
	// end offset."
	if (isEditable(range.endContainer)
	&& range.endContainer.nodeType == $_.Node.TEXT_NODE
	&& range.endOffset != 0
	&& range.endOffset != getNodeLength(range.endContainer)) {
		// IE seems to mutate the range incorrectly here, so we need correction
		// here as well.  The active range will be temporarily in orphaned
		// nodes, so calling getActiveRange() after splitText() but before
		// fixing the range will throw an exception.
		// TODO: check if this is still neccessary 
		var activeRange = range;
		var newStart = [activeRange.startContainer, activeRange.startOffset];
		var newEnd = [activeRange.endContainer, activeRange.endOffset];
		activeRange.endContainer.splitText(activeRange.endOffset);
		activeRange.setStart(newStart[0], newStart[1]);
		activeRange.setEnd(newEnd[0], newEnd[1]);

		Aloha.getSelection().removeAllRanges();
		Aloha.getSelection().addRange(activeRange);
	}

	// "Let element list be all editable Elements effectively contained in the
	// active range.
	//
	// "For each element in element list, clear the value of element."
	$_( getAllEffectivelyContainedNodes(getActiveRange(), function(node) {
		return isEditable(node) && node.nodeType == $_.Node.ELEMENT_NODE;
	}) ).forEach(function(element) {
		clearValue(element, command, range);
	});

	// "Let node list be all editable nodes effectively contained in the active
	// range.
	//
	// "For each node in node list:"
	$_( getAllEffectivelyContainedNodes(range, isEditable) ).forEach(function(node) {
		// "Push down values on node."
		pushDownValues(node, command, newValue, range);

		// "Force the value of node."
		forceValue(node, command, newValue, range);
	});
}


//@}
///// The backColor command /////
//@{
commands.backcolor = {
	// Copy-pasted, same as hiliteColor
	action: function(value) {
		// Action is further copy-pasted, same as foreColor

		// "If value is not a valid CSS color, prepend "#" to it."
		//
		// "If value is still not a valid CSS color, or if it is currentColor,
		// abort these steps and do nothing."
		//
		// Cheap hack for testing, no attempt to be comprehensive.
		if (/^([0-9a-fA-F]{3}){1,2}$/.test(value)) {
			value = "#" + value;
		}
		if (!/^(rgba?|hsla?)\(.*\)$/.test(value)
		&& !parseSimpleColor(value)
		&& value.toLowerCase() != "transparent") {
			return;
		}

		// "Set the selection's value to value."
		setSelectionValue("backcolor", value);
	}, standardInlineValueCommand: true, relevantCssProperty: "backgroundColor",
	equivalentValues: function(val1, val2) {
		// "Either both strings are valid CSS colors and have the same red,
		// green, blue, and alpha components, or neither string is a valid CSS
		// color."
		return normalizeColor(val1) === normalizeColor(val2);
	}
};

//@}
///// The bold command /////
//@{
commands.bold = {
	action: function(value, range) {
		// "If queryCommandState("bold") returns true, set the selection's
		// value to "normal". Otherwise set the selection's value to "bold"."
		if (myQueryCommandState("bold", range)) {
			setSelectionValue("bold", "normal", range);
		} else {
			setSelectionValue("bold", "bold", range);
		}
	}, 
	inlineCommandActivatedValues: ["bold", "600", "700", "800", "900"],
	relevantCssProperty: "fontWeight",
	equivalentValues: function(val1, val2) {
		// "Either the two strings are equal, or one is "bold" and the other is
		// "700", or one is "normal" and the other is "400"."
		return val1 == val2
			|| (val1 == "bold" && val2 == "700")
			|| (val1 == "700" && val2 == "bold")
			|| (val1 == "normal" && val2 == "400")
			|| (val1 == "400" && val2 == "normal");
	}
};

//@}
///// The createLink command /////
//@{
commands.createlink = {
	action: function(value) {
		// "If value is the empty string, abort these steps and do nothing."
		if (value === "") {
			return;
		}

		// "For each editable a element that has an href attribute and is an
		// ancestor of some node effectively contained in the active range, set
		// that a element's href attribute to value."
		//
		// TODO: We don't actually do this in tree order, not that it matters
		// unless you're spying with mutation events.
		$_( getAllEffectivelyContainedNodes(getActiveRange()) ).forEach(function(node) {
			$_( getAncestors(node) ).forEach(function(ancestor) {
				if (isEditable(ancestor)
				&& isHtmlElement(ancestor, "a")
				&& $_( ancestor ).hasAttribute("href")) {
					ancestor.setAttribute("href", value);
				}
			});
		});

		// "Set the selection's value to value."
		setSelectionValue("createlink", value);
	}, standardInlineValueCommand: true
};

//@}
///// The fontName command /////
//@{
commands.fontname = {
	action: function(value) {
		// "Set the selection's value to value."
		setSelectionValue("fontname", value);
	}, standardInlineValueCommand: true, relevantCssProperty: "fontFamily"
};

//@}
///// The fontSize command /////
//@{

// Helper function for fontSize's action plus queryOutputHelper.  It's just the
// middle of fontSize's action, ripped out into its own function.
function normalizeFontSize(value) {
	// "Strip leading and trailing whitespace from value."
	//
	// Cheap hack, not following the actual algorithm.
	value = $_(value).trim();

	// "If value is a valid floating point number, or would be a valid
	// floating point number if a single leading "+" character were
	// stripped:"
	if (/^[-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?$/.test(value)) {
		var mode;

		// "If the first character of value is "+", delete the character
		// and let mode be "relative-plus"."
		if (value[0] == "+") {
			value = value.slice(1);
			mode = "relative-plus";
		// "Otherwise, if the first character of value is "-", delete the
		// character and let mode be "relative-minus"."
		} else if (value[0] == "-") {
			value = value.slice(1);
			mode = "relative-minus";
		// "Otherwise, let mode be "absolute"."
		} else {
			mode = "absolute";
		}

		// "Apply the rules for parsing non-negative integers to value, and
		// let number be the result."
		//
		// Another cheap hack.
		var num = parseInt(value);

		// "If mode is "relative-plus", add three to number."
		if (mode == "relative-plus") {
			num += 3;
		}

		// "If mode is "relative-minus", negate number, then add three to
		// it."
		if (mode == "relative-minus") {
			num = 3 - num;
		}

		// "If number is less than one, let number equal 1."
		if (num < 1) {
			num = 1;
		}

		// "If number is greater than seven, let number equal 7."
		if (num > 7) {
			num = 7;
		}

		// "Set value to the string here corresponding to number:" [table
		// omitted]
		value = {
			1: "xx-small",
			2: "small",
			3: "medium",
			4: "large",
			5: "x-large",
			6: "xx-large",
			7: "xxx-large"
		}[num];
	}

	return value;
}

commands.fontsize = {
	action: function(value) {
		// "If value is the empty string, abort these steps and do nothing."
		if (value === "") {
			return;
		}

		value = normalizeFontSize(value);

		// "If value is not one of the strings "xx-small", "x-small", "small",
		// "medium", "large", "x-large", "xx-large", "xxx-large", and is not a
		// valid CSS absolute length, then abort these steps and do nothing."
		//
		// More cheap hacks to skip valid CSS absolute length checks.
		if ($_(["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"]).indexOf(value) == -1
		&& !/^[0-9]+(\.[0-9]+)?(cm|mm|in|pt|pc)$/.test(value)) {
			return;
		}

		// "Set the selection's value to value."
		setSelectionValue("fontsize", value);
	}, 
	indeterm: function() {
		// "True if among editable Text nodes that are effectively contained in
		// the active range, there are two that have distinct effective command
		// values.  Otherwise false."
		return $_( getAllEffectivelyContainedNodes(getActiveRange(), function(node) {
			return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE;
		}) ).map(function(node) {
			return getEffectiveCommandValue(node, "fontsize");
		}, true).filter(function(value, i, arr) {
			return $_(arr.slice(0, i)).indexOf(value) == -1;
		}).length >= 2;
	}, 
	value: function(range) {
		// "Let pixel size be the effective command value of the first editable
		// Text node that is effectively contained in the active range, or if
		// there is no such node, the effective command value of the active
		// range's start node, in either case interpreted as a number of
		// pixels."
		var node = getAllEffectivelyContainedNodes(range, function(node) {
			return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE;
		})[0];
		if (node === undefined) {
			node = range.startContainer;
		}
		var pixelSize = getEffectiveCommandValue(node, "fontsize");

		// "Return the legacy font size for pixel size."
		return getLegacyFontSize(pixelSize);
	}, relevantCssProperty: "fontSize"
};

function getLegacyFontSize(size) {
	// For convenience in other places in my code, I handle all sizes, not just
	// pixel sizes as the spec says.  This means pixel sizes have to be passed
	// in suffixed with "px", not as plain numbers.
	size = normalizeFontSize(size);

	if ($_(["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"]).indexOf(size) == -1
	&& !/^[0-9]+(\.[0-9]+)?(cm|mm|in|pt|pc|px)$/.test(size)) {
		// There is no sensible legacy size for things like "2em".
		return null;
	}

	var font = document.createElement("font");
	document.body.appendChild(font);
	if (size == "xxx-large") {
		font.size = 7;
	} else {
		font.style.fontSize = size;
	}
	var pixelSize = parseInt($_.getComputedStyle(font).fontSize);
	document.body.removeChild(font);

	// "Let returned size be 1."
	var returnedSize = 1;

	// "While returned size is less than 7:"
	while (returnedSize < 7) {
		// "Let lower bound be the resolved value of "font-size" in pixels
		// of a font element whose size attribute is set to returned size."
		var font = document.createElement("font");
		font.size = returnedSize;
		document.body.appendChild(font);
		var lowerBound = parseInt($_.getComputedStyle(font).fontSize);

		// "Let upper bound be the resolved value of "font-size" in pixels
		// of a font element whose size attribute is set to one plus
		// returned size."
		font.size = 1 + returnedSize;
		var upperBound = parseInt($_.getComputedStyle(font).fontSize);
		document.body.removeChild(font);

		// "Let average be the average of upper bound and lower bound."
		var average = (upperBound + lowerBound)/2;

		// "If pixel size is less than average, return the one-element
		// string consisting of the digit returned size."
		if (pixelSize < average) {
			return String(returnedSize);
		}

		// "Add one to returned size."
		returnedSize++;
	}

	// "Return "7"."
	return "7";
}

//@}
///// The foreColor command /////
//@{
commands.forecolor = {
	action: function(value) {
		// Copy-pasted, same as backColor and hiliteColor

		// "If value is not a valid CSS color, prepend "#" to it."
		//
		// "If value is still not a valid CSS color, or if it is currentColor,
		// abort these steps and do nothing."
		//
		// Cheap hack for testing, no attempt to be comprehensive.
		if (/^([0-9a-fA-F]{3}){1,2}$/.test(value)) {
			value = "#" + value;
		}
		if (!/^(rgba?|hsla?)\(.*\)$/.test(value)
		&& !parseSimpleColor(value)
		&& value.toLowerCase() != "transparent") {
			return;
		}

		// "Set the selection's value to value."
		setSelectionValue("forecolor", value);
	}, standardInlineValueCommand: true, relevantCssProperty: "color",
	equivalentValues: function(val1, val2) {
		// "Either both strings are valid CSS colors and have the same red,
		// green, blue, and alpha components, or neither string is a valid CSS
		// color."
		return normalizeColor(val1) === normalizeColor(val2);
	}
};

//@}
///// The hiliteColor command /////
//@{
commands.hilitecolor = {
	// Copy-pasted, same as backColor
	action: function(value) {
		// Action is further copy-pasted, same as foreColor

		// "If value is not a valid CSS color, prepend "#" to it."
		//
		// "If value is still not a valid CSS color, or if it is currentColor,
		// abort these steps and do nothing."
		//
		// Cheap hack for testing, no attempt to be comprehensive.
		if (/^([0-9a-fA-F]{3}){1,2}$/.test(value)) {
			value = "#" + value;
		}
		if (!/^(rgba?|hsla?)\(.*\)$/.test(value)
		&& !parseSimpleColor(value)
		&& value.toLowerCase() != "transparent") {
			return;
		}

		// "Set the selection's value to value."
		setSelectionValue("hilitecolor", value);
	}, indeterm: function() {
		// "True if among editable Text nodes that are effectively contained in
		// the active range, there are two that have distinct effective command
		// values.  Otherwise false."
		return $_( getAllEffectivelyContainedNodes(getActiveRange(), function(node) {
			return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE;
		}) ).map(function(node) {
			return getEffectiveCommandValue(node, "hilitecolor");
		}, true).filter(function(value, i, arr) {
			return $_(arr.slice(0, i)).indexOf(value) == -1;
		}).length >= 2;
	}, standardInlineValueCommand: true, relevantCssProperty: "backgroundColor",
	equivalentValues: function(val1, val2) {
		// "Either both strings are valid CSS colors and have the same red,
		// green, blue, and alpha components, or neither string is a valid CSS
		// color."
		return normalizeColor(val1) === normalizeColor(val2);
	}
};

//@}
///// The italic command /////
//@{
commands.italic = {
	action: function( value, range ) {
		// "If queryCommandState("italic") returns true, set the selection's
		// value to "normal". Otherwise set the selection's value to "italic"."
		if (myQueryCommandState("italic", range)) {
			setSelectionValue("italic", "normal", range);
		} else {
			setSelectionValue("italic", "italic", range);
		}
	}, inlineCommandActivatedValues: ["italic", "oblique"],
	relevantCssProperty: "fontStyle"
};

//@}
///// The removeFormat command /////
//@{
commands.removeformat = {
	action: function() {
		// "A removeFormat candidate is an editable HTML element with local
		// name "abbr", "acronym", "b", "bdi", "bdo", "big", "blink", "cite",
		// "code", "dfn", "em", "font", "i", "ins", "kbd", "mark", "nobr", "q",
		// "s", "samp", "small", "span", "strike", "strong", "sub", "sup",
		// "tt", "u", or "var"."
		function isRemoveFormatCandidate(node) {
			return isEditable(node)
				&& isHtmlElement(node, ["abbr", "acronym", "b", "bdi", "bdo",
				"big", "blink", "cite", "code", "dfn", "em", "font", "i",
				"ins", "kbd", "mark", "nobr", "q", "s", "samp", "small",
				"span", "strike", "strong", "sub", "sup", "tt", "u", "var"]);
		}

		// "Let elements to remove be a list of every removeFormat candidate
		// effectively contained in the active range."
		var elementsToRemove = getAllEffectivelyContainedNodes(getActiveRange(), isRemoveFormatCandidate);

		// "For each element in elements to remove:"
		$_( elementsToRemove ).forEach(function(element) {
			// "While element has children, insert the first child of element
			// into the parent of element immediately before element,
			// preserving ranges."
			while (element.hasChildNodes()) {
				movePreservingRanges(element.firstChild, element.parentNode, getNodeIndex(element), range);
			}

			// "Remove element from its parent."
			element.parentNode.removeChild(element);
		});

		// "If the active range's start node is an editable Text node, and its
		// start offset is neither zero nor its start node's length, call
		// splitText() on the active range's start node, with argument equal to
		// the active range's start offset. Then set the active range's start
		// node to the result, and its start offset to zero."
		if (isEditable(getActiveRange().startContainer)
		&& getActiveRange().startContainer.nodeType == $_.Node.TEXT_NODE
		&& getActiveRange().startOffset != 0
		&& getActiveRange().startOffset != getNodeLength(getActiveRange().startContainer)) {
			// Account for browsers not following range mutation rules
			if (getActiveRange().startContainer == getActiveRange().endContainer) {
				var newEnd = getActiveRange().endOffset - getActiveRange().startOffset;
				var newNode = getActiveRange().startContainer.splitText(getActiveRange().startOffset);
				getActiveRange().setStart(newNode, 0);
				getActiveRange().setEnd(newNode, newEnd);
			} else {
				getActiveRange().setStart(getActiveRange().startContainer.splitText(getActiveRange().startOffset), 0);
			}
		}

		// "If the active range's end node is an editable Text node, and its
		// end offset is neither zero nor its end node's length, call
		// splitText() on the active range's end node, with argument equal to
		// the active range's end offset."
		if (isEditable(getActiveRange().endContainer)
		&& getActiveRange().endContainer.nodeType == $_.Node.TEXT_NODE
		&& getActiveRange().endOffset != 0
		&& getActiveRange().endOffset != getNodeLength(getActiveRange().endContainer)) {
			// IE seems to mutate the range incorrectly here, so we need
			// correction here as well.  Have to be careful to set the range to
			// something not including the text node so that getActiveRange()
			// doesn't throw an exception due to a temporarily detached
			// endpoint.
			var newStart = [getActiveRange().startContainer, getActiveRange().startOffset];
			var newEnd = [getActiveRange().endContainer, getActiveRange().endOffset];
			getActiveRange().setEnd(document.documentElement, 0);
			newEnd[0].splitText(newEnd[1]);
			getActiveRange().setStart(newStart[0], newStart[1]);
			getActiveRange().setEnd(newEnd[0], newEnd[1]);
		}

		// "Let node list consist of all editable nodes effectively contained
		// in the active range."
		//
		// "For each node in node list, while node's parent is a removeFormat
		// candidate in the same editing host as node, split the parent of the
		// one-node list consisting of node."
		$_( getAllEffectivelyContainedNodes(getActiveRange(), isEditable) ).forEach(function(node) {
			while (isRemoveFormatCandidate(node.parentNode)
			&& inSameEditingHost(node.parentNode, node)) {
				splitParent([node], range);
			}
		});

		// "For each of the entries in the following list, in the given order,
		// set the selection's value to null, with command as given."
		$_( [
			"subscript",
			"bold",
			"fontname",
			"fontsize",
			"forecolor",
			"hilitecolor",
			"italic",
			"strikethrough",
			"underline",
		] ).forEach(function(command) {
			setSelectionValue(command, null);
		});
	}
};

//@}
///// The strikethrough command /////
//@{
commands.strikethrough = {
	action: function() {
		// "If queryCommandState("strikethrough") returns true, set the
		// selection's value to null. Otherwise set the selection's value to
		// "line-through"."
		if (myQueryCommandState("strikethrough")) {
			setSelectionValue("strikethrough", null);
		} else {
			setSelectionValue("strikethrough", "line-through");
		}
	}, inlineCommandActivatedValues: ["line-through"]
};

//@}
///// The subscript command /////
//@{
commands.subscript = {
	action: function() {
		// "Call queryCommandState("subscript"), and let state be the result."
		var state = myQueryCommandState("subscript");

		// "Set the selection's value to null."
		setSelectionValue("subscript", null);

		// "If state is false, set the selection's value to "subscript"."
		if (!state) {
			setSelectionValue("subscript", "subscript");
		}
	}, indeterm: function() {
		// "True if either among editable Text nodes that are effectively
		// contained in the active range, there is at least one with effective
		// command value "subscript" and at least one with some other effective
		// command value; or if there is some editable Text node effectively
		// contained in the active range with effective command value "mixed".
		// Otherwise false."
		var nodes = getAllEffectivelyContainedNodes(getActiveRange(), function(node) {
			return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE;
		});
		return ($_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "subscript") == "subscript" })
			&& $_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "subscript") != "subscript" }))
			|| $_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "subscript") == "mixed" });
	}, inlineCommandActivatedValues: ["subscript"]
};

//@}
///// The superscript command /////
//@{
commands.superscript = {
	action: function() {
		// "Call queryCommandState("superscript"), and let state be the
		// result."
		var state = myQueryCommandState("superscript");

		// "Set the selection's value to null."
		setSelectionValue("superscript", null);

		// "If state is false, set the selection's value to "superscript"."
		if (!state) {
			setSelectionValue("superscript", "superscript");
		}
	}, indeterm: function() {
		// "True if either among editable Text nodes that are effectively
		// contained in the active range, there is at least one with effective
		// command value "superscript" and at least one with some other
		// effective command value; or if there is some editable Text node
		// effectively contained in the active range with effective command
		// value "mixed".  Otherwise false."
		var nodes = getAllEffectivelyContainedNodes(getActiveRange(),
				function(node) {
			return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE;
		});
		return ($_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "superscript") == "superscript" })
			&& $_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "superscript") != "superscript" }))
			|| $_( nodes ).some(function(node) { return getEffectiveCommandValue(node, "superscript") == "mixed" });
	}, inlineCommandActivatedValues: ["superscript"]
};

//@}
///// The underline command /////
//@{
commands.underline = {
	action: function() {
		// "If queryCommandState("underline") returns true, set the selection's
		// value to null. Otherwise set the selection's value to "underline"."
		if (myQueryCommandState("underline")) {
			setSelectionValue("underline", null);
		} else {
			setSelectionValue("underline", "underline");
		}
	}, inlineCommandActivatedValues: ["underline"]
};

//@}
///// The unlink command /////
//@{
commands.unlink = {
	action: function() {
		// "Let hyperlinks be a list of every a element that has an href
		// attribute and is contained in the active range or is an ancestor of
		// one of its boundary points."
		//
		// As usual, take care to ensure it's tree order.  The correctness of
		// the following is left as an exercise for the reader.
		var range = getActiveRange();
		var hyperlinks = [];
		for (
			var node = range.startContainer;
			node;
			node = node.parentNode
		) {
			if (isHtmlElement(node, "A")
			&& $_( node ).hasAttribute("href")) {
				hyperlinks.unshift(node);
			}
		}
		for (
			var node = range.startContainer;
			node != nextNodeDescendants(range.endContainer);
			node = nextNode(node)
		) {
			if (isHtmlElement(node, "A")
			&& $_( node ).hasAttribute("href")
			&& (isContained(node, range)
			|| isAncestor(node, range.endContainer)
			|| node == range.endContainer)) {
				hyperlinks.push(node);
			}
		}

		// "Clear the value of each member of hyperlinks."
		for (var i = 0; i < hyperlinks.length; i++) {
			clearValue(hyperlinks[i], "unlink", range);
		}
	}, standardInlineValueCommand: true
};

//@}

/////////////////////////////////////
///// Block formatting commands /////
/////////////////////////////////////

///// Block formatting command definitions /////
//@{

// "An indentation element is either a blockquote, or a div that has a style
// attribute that sets "margin" or some subproperty of it."
function isIndentationElement(node) {
	if (!isHtmlElement(node)) {
		return false;
	}

	if (node.tagName == "BLOCKQUOTE") {
		return true;
	}

	if (node.tagName != "DIV") {
		return false;
	}

	if (typeof node.style.length !== 'undefined') {
		for (var i = 0; i < node.style.length; i++) {
			// Approximate check
			if (/^(-[a-z]+-)?margin/.test(node.style[i])) {
				return true;
			}
		}
	} else {
		for (var s in node.style) {
			if (/^(-[a-z]+-)?margin/.test(s) && node.style[s] && node.style[s] !== 0) {
				return true;
			}
		}
	}

	return false;
}

// "A simple indentation element is an indentation element that has no
// attributes other than one or more of
//
//   * "a style attribute that sets no properties other than "margin", "border",
//     "padding", or subproperties of those;
//   * "a class attribute;
//   * "a dir attribute."
function isSimpleIndentationElement(node) {
	if (!isIndentationElement(node)) {
		return false;
	}

	if (node.tagName != "BLOCKQUOTE" && node.tagName != "DIV") {
		return false;
	}

	for (var i = 0; i < node.attributes.length; i++) {
		if (!isHtmlNamespace(node.attributes[i].namespaceURI)
		|| $_(["style", "class", "dir"]).indexOf(node.attributes[i].name) == -1) {
			return false;
		}
	}

	if (typeof node.style.length !== 'undefined') {
		for (var i = 0; i < node.style.length; i++) {
			// This is approximate, but it works well enough for my purposes.
			if (!/^(-[a-z]+-)?(margin|border|padding)/.test(node.style[i])) {
				return false;
			}
		}
	} else {
		for (var s in node.style) {
			// This is approximate, but it works well enough for my purposes.
			if (!/^(-[a-z]+-)?(margin|border|padding)/.test(s) && node.style[s] && node.style[s] !== 0 && node.style[s] !== 'false') {
				return false;
			}
		}
	}

	return true;
}

// "A non-list single-line container is an HTML element with local name
// "address", "div", "h1", "h2", "h3", "h4", "h5", "h6", "listing", "p", "pre",
// or "xmp"."
function isNonListSingleLineContainer(node) {
	return isHtmlElement(node, ["address", "div", "h1", "h2", "h3", "h4", "h5",
		"h6", "listing", "p", "pre", "xmp"]);
}

// "A single-line container is either a non-list single-line container, or an
// HTML element with local name "li", "dt", or "dd"."
function isSingleLineContainer(node) {
	return isNonListSingleLineContainer(node)
		|| isHtmlElement(node, ["li", "dt", "dd"]);
}

// "The default single-line container name is "p"."
var defaultSingleLineContainerName = "p";


//@}
///// Assorted block formatting command algorithms /////
//@{

function fixDisallowedAncestors(node, range) {
	// "If node is not editable, abort these steps."
	if (!isEditable(node)) {
		return;
	}

	// "If node is not an allowed child of any of its ancestors in the same
	// editing host, and is not an HTML element with local name equal to the
	// default single-line container name:"
	if ($_(getAncestors(node)).every(function(ancestor) {
		return !inSameEditingHost(node, ancestor)
			|| !isAllowedChild(node, ancestor)
	})
	&& !isHtmlElement(node, defaultSingleLineContainerName)) {
		// "If node is a dd or dt, wrap the one-node list consisting of node,
		// with sibling criteria returning true for any dl with no attributes
		// and false otherwise, and new parent instructions returning the
		// result of calling createElement("dl") on the context object. Then
		// abort these steps."
		if (isHtmlElement(node, ["dd", "dt"])) {
			wrap([node],
				function(sibling) { return isHtmlElement(sibling, "dl") && !sibling.attributes.length },
				function() { return document.createElement("dl") },
				range
			);
			return;
		}

		// "If node is not a prohibited paragraph child, abort these steps."
		if (!isProhibitedParagraphChild(node)) {
			return;
		}

		// "Set the tag name of node to the default single-line container name,
		// and let node be the result."
		node = setTagName(node, defaultSingleLineContainerName, range);

		// "Fix disallowed ancestors of node."
		fixDisallowedAncestors(node, range);

		// "Let descendants be all descendants of node."
		var descendants = getDescendants(node);

		// "Fix disallowed ancestors of each member of descendants."
		for (var i = 0; i < descendants.length; i++) {
			fixDisallowedAncestors(descendants[i], range);
		}

		// "Abort these steps."
		return;
	}

	// "Record the values of the one-node list consisting of node, and let
	// values be the result."
	var values = recordValues([node]);

	// "While node is not an allowed child of its parent, split the parent of
	// the one-node list consisting of node."
	while (!isAllowedChild(node, node.parentNode)) {
		// If the parent contains only this node and possibly empty text nodes, we rather want to unwrap the node, instead of splitting.
		// With splitting, we would get empty nodes, like:
		// split: <p><p>foo</p></p> -> <p></p><p>foo</p> (bad)
		// unwrap: <p><p>foo</p></p> -> <p>foo</p> (good)

		// First remove empty text nodes that are children of the parent and correct the range if necessary
		// we do this to have the node being the only child of its parent, so that we can replace the parent with the node
		for (var i = node.parentNode.childNodes.length - 1; i >= 0; --i) {
			if (node.parentNode.childNodes[i].nodeType == 3 && node.parentNode.childNodes[i].data.length == 0) {
				// we remove the empty text node
				node.parentNode.removeChild(node.parentNode.childNodes[i]);

				// if the range points to somewhere behind the removed text node, we reduce the offset
				if (range.startContainer == node.parentNode && range.startOffset > i) {
					range.startOffset--;
				}
				if (range.endContainer == node.parentNode && range.endOffset > i) {
					range.endOffset--;
				}
			}
		}

		// now that the parent has only the node as child (because we
		// removed any existing empty text nodes), we can safely unwrap the
		// node, and correct the range if necessary
		if (node.parentNode.childNodes.length == 1) {
			var correctStart = false;
			var correctEnd = false;
			if (range.startContainer === node.parentNode) {
				correctStart = true;
			}
			if (range.endContainer === node.parentNode) {
				correctEnd = true;
			}
			jQuery(node).unwrap();
			if (correctStart) {
				range.startContainer = node.parentNode;
				range.startOffset = range.startOffset + getNodeIndex(node);
			}
			if (correctEnd) {
				range.endContainer = node.parentNode;
				range.endOffset = range.endOffset + getNodeIndex(node);
			}
		} else {
			splitParent([node], range);
		}
	}

	// "Restore the values from values."
	restoreValues(values, range);
}

/**
 * This method "normalizes" sublists of the given item (which is supposed to be a LI):
 * If sublists are found in the LI element, they are moved directly into the outer list.
 * @param item item
 * @param range range, which will be modified if necessary
 */
function normalizeSublists(item, range) {
	// "If item is not an li or it is not editable or its parent is not
	// editable, abort these steps."
	if (!isHtmlElement(item, "LI")
	|| !isEditable(item)
	|| !isEditable(item.parentNode)) {
		return;
	}

	// "Let new item be null."
	var newItem = null;

	// "While item has an ol or ul child:"
	while ($_(item.childNodes).some( function (node) { return isHtmlElement(node, ["OL", "UL"]) })) {
		// "Let child be the last child of item."
		var child = item.lastChild;

		// "If child is an ol or ul, or new item is null and child is a Text
		// node whose data consists of zero of more space characters:"
		if (isHtmlElement(child, ["OL", "UL"])
		|| (!newItem && child.nodeType == $_.Node.TEXT_NODE && /^[ \t\n\f\r]*$/.test(child.data))) {
			// "Set new item to null."
			newItem = null;

			// "Insert child into the parent of item immediately following
			// item, preserving ranges."
			movePreservingRanges(child, item.parentNode, 1 + getNodeIndex(item), range);

		// "Otherwise:"
		} else {
			// "If new item is null, let new item be the result of calling
			// createElement("li") on the ownerDocument of item, then insert
			// new item into the parent of item immediately after item."
			if (!newItem) {
				newItem = item.ownerDocument.createElement("li");
				item.parentNode.insertBefore(newItem, item.nextSibling);
			}

			// "Insert child into new item as its first child, preserving
			// ranges."
			movePreservingRanges(child, newItem, 0, range);
		}
	}
}

/**
 * This method is the exact opposite of normalizeSublists.
 * List nodes directly nested into each other are corrected to be nested in li elements (so that the resulting lists conform the html5 specification)
 * @param item list node
 * @param range range, which is preserved when modifying the list
 */
function unNormalizeSublists(item, range) {
	// "If item is not an ol or ol or it is not editable or its parent is not
	// editable, abort these steps."
	if (!isHtmlElement(item, ["OL", "UL"])
	|| !isEditable(item)) {
		return;
	}

	var $list = jQuery(item);
	$list.children("ol,ul").each(function(index, sublist) {
		if (isHtmlElement(sublist.previousSibling, "LI")) {
			// move the sublist into the LI
			movePreservingRanges(sublist, sublist.previousSibling, sublist.previousSibling.childNodes.length, range);
		}
	});
}

function getSelectionListState() {
	// "Block-extend the active range, and let new range be the result."
	var newRange = blockExtend(getActiveRange());

	// "Let node list be a list of nodes, initially empty."
	//
	// "For each node contained in new range, append node to node list if the
	// last member of node list (if any) is not an ancestor of node; node is
	// editable; node is not an indentation element; and node is either an ol
	// or ul, or the child of an ol or ul, or an allowed child of "li"."
	var nodeList = getContainedNodes(newRange, function(node) {
		return isEditable(node)
			&& !isIndentationElement(node)
			&& (isHtmlElement(node, ["ol", "ul"])
			|| isHtmlElement(node.parentNode, ["ol", "ul"])
			|| isAllowedChild(node, "li"));
	});

	// "If node list is empty, return "none"."
	if (!nodeList.length) {
		return "none";
	}

	// "If every member of node list is either an ol or the child of an ol or
	// the child of an li child of an ol, and none is a ul or an ancestor of a
	// ul, return "ol"."
	if ($_(nodeList).every(function(node) {
		return isHtmlElement(node, "ol")
			|| isHtmlElement(node.parentNode, "ol")
			|| (isHtmlElement(node.parentNode, "li") && isHtmlElement(node.parentNode.parentNode, "ol"));
	})
	&& !$_( nodeList ).some(function(node) { return isHtmlElement(node, "ul") || ("querySelector" in node && node.querySelector("ul")) })) {
		return "ol";
	}

	// "If every member of node list is either a ul or the child of a ul or the
	// child of an li child of a ul, and none is an ol or an ancestor of an ol,
	// return "ul"."
	if ($_(nodeList).every(function(node) {
		return isHtmlElement(node, "ul")
			|| isHtmlElement(node.parentNode, "ul")
			|| (isHtmlElement(node.parentNode, "li") && isHtmlElement(node.parentNode.parentNode, "ul"));
	})
	&& !$_( nodeList ).some(function(node) { return isHtmlElement(node, "ol") || ("querySelector" in node && node.querySelector("ol")) })) {
		return "ul";
	}

	var hasOl = $_( nodeList ).some(function(node) {
		return isHtmlElement(node, "ol")
			|| isHtmlElement(node.parentNode, "ol")
			|| ("querySelector" in node && node.querySelector("ol"))
			|| (isHtmlElement(node.parentNode, "li") && isHtmlElement(node.parentNode.parentNode, "ol"));
	});
	var hasUl = $_( nodeList ).some(function(node) {
		return isHtmlElement(node, "ul")
			|| isHtmlElement(node.parentNode, "ul")
			|| ("querySelector" in node && node.querySelector("ul"))
			|| (isHtmlElement(node.parentNode, "li") && isHtmlElement(node.parentNode.parentNode, "ul"));
	});
	// "If some member of node list is either an ol or the child or ancestor of
	// an ol or the child of an li child of an ol, and some member of node list
	// is either a ul or the child or ancestor of a ul or the child of an li
	// child of a ul, return "mixed"."
	if (hasOl && hasUl) {
		return "mixed";
	}

	// "If some member of node list is either an ol or the child or ancestor of
	// an ol or the child of an li child of an ol, return "mixed ol"."
	if (hasOl) {
		return "mixed ol";
	}

	// "If some member of node list is either a ul or the child or ancestor of
	// a ul or the child of an li child of a ul, return "mixed ul"."
	if (hasUl) {
		return "mixed ul";
	}

	// "Return "none"."
	return "none";
}

function getAlignmentValue(node) {
	// "While node is neither null nor an Element, or it is an Element but its
	// "display" property has resolved value "inline" or "none", set node to
	// its parent."
	while ((node && node.nodeType != $_.Node.ELEMENT_NODE)
	|| (node.nodeType == $_.Node.ELEMENT_NODE
	&& $_(["inline", "none"]).indexOf($_.getComputedStyle(node).display) != -1)) {
		node = node.parentNode;
	}

	// "If node is not an Element, return "left"."
	if (!node || node.nodeType != $_.Node.ELEMENT_NODE) {
		return "left";
	}

	var resolvedValue = $_.getComputedStyle(node).textAlign
		// Hack around browser non-standardness
		.replace(/^-(moz|webkit)-/, "")
		.replace(/^auto$/, "start");

	// "If node's "text-align" property has resolved value "start", return
	// "left" if the directionality of node is "ltr", "right" if it is "rtl"."
	if (resolvedValue == "start") {
		return getDirectionality(node) == "ltr" ? "left" : "right";
	}

	// "If node's "text-align" property has resolved value "end", return
	// "right" if the directionality of node is "ltr", "left" if it is "rtl"."
	if (resolvedValue == "end") {
		return getDirectionality(node) == "ltr" ? "right" : "left";
	}

	// "If node's "text-align" property has resolved value "center", "justify",
	// "left", or "right", return that value."
	if ($_(["center", "justify", "left", "right"]).indexOf(resolvedValue) != -1) {
		return resolvedValue;
	}

	// "Return "left"."
	return "left";
}

//@}
///// Block-extending a range /////
//@{

// "A boundary point (node, offset) is a block start point if either node's
// parent is null and offset is zero; or node has a child with index offset −
// 1, and that child is either a visible block node or a visible br."
function isBlockStartPoint(node, offset) {
	return (!node.parentNode && offset == 0)
		|| (0 <= offset - 1
		&& offset - 1 < node.childNodes.length
		&& isVisible(node.childNodes[offset - 1])
		&& (isBlockNode(node.childNodes[offset - 1])
		|| isHtmlElement(node.childNodes[offset - 1], "br")));
}

// "A boundary point (node, offset) is a block end point if either node's
// parent is null and offset is node's length; or node has a child with index
// offset, and that child is a visible block node."
function isBlockEndPoint(node, offset) {
	return (!node.parentNode && offset == getNodeLength(node))
		|| (offset < node.childNodes.length
		&& isVisible(node.childNodes[offset])
		&& isBlockNode(node.childNodes[offset]));
}

// "A boundary point is a block boundary point if it is either a block start
// point or a block end point."
function isBlockBoundaryPoint(node, offset) {
	return isBlockStartPoint(node, offset)
		|| isBlockEndPoint(node, offset);
}

function blockExtend(range) {
	// "Let start node, start offset, end node, and end offset be the start
	// and end nodes and offsets of the range."
	var startNode = range.startContainer;
	var startOffset = range.startOffset;
	var endNode = range.endContainer;
	var endOffset = range.endOffset;

	// "If some ancestor container of start node is an li, set start offset to
	// the index of the last such li in tree order, and set start node to that
	// li's parent."
	var liAncestors = $_( getAncestors(startNode).concat(startNode) )
		.filter(function(ancestor) { return isHtmlElement(ancestor, "li") })
		.slice(-1);
	if (liAncestors.length) {
		startOffset = getNodeIndex(liAncestors[0]);
		startNode = liAncestors[0].parentNode;
	}

	// "If (start node, start offset) is not a block start point, repeat the
	// following steps:"
	if (!isBlockStartPoint(startNode, startOffset)) do {
		// "If start offset is zero, set it to start node's index, then set
		// start node to its parent."
		if (startOffset == 0) {
			startOffset = getNodeIndex(startNode);
			startNode = startNode.parentNode;

		// "Otherwise, subtract one from start offset."
		} else {
			startOffset--;
		}

		// "If (start node, start offset) is a block boundary point, break from
		// this loop."
	} while (!isBlockBoundaryPoint(startNode, startOffset));

	// "While start offset is zero and start node's parent is not null, set
	// start offset to start node's index, then set start node to its parent."
	while (startOffset == 0
	&& startNode.parentNode) {
		startOffset = getNodeIndex(startNode);
		startNode = startNode.parentNode;
	}

	// "If some ancestor container of end node is an li, set end offset to one
	// plus the index of the last such li in tree order, and set end node to
	// that li's parent."
	var liAncestors = $_( getAncestors(endNode).concat(endNode) )
		.filter(function(ancestor) { return isHtmlElement(ancestor, "li") })
		.slice(-1);
	if (liAncestors.length) {
		endOffset = 1 + getNodeIndex(liAncestors[0]);
		endNode = liAncestors[0].parentNode;
	}

	// "If (end node, end offset) is not a block end point, repeat the
	// following steps:"
	if (!isBlockEndPoint(endNode, endOffset)) do {
		// "If end offset is end node's length, set it to one plus end node's
		// index, then set end node to its parent."
		if (endOffset == getNodeLength(endNode)) {
			endOffset = 1 + getNodeIndex(endNode);
			endNode = endNode.parentNode;

		// "Otherwise, add one to end offset.
		} else {
			endOffset++;
		}

		// "If (end node, end offset) is a block boundary point, break from
		// this loop."
	} while (!isBlockBoundaryPoint(endNode, endOffset));

	// "While end offset is end node's length and end node's parent is not
	// null, set end offset to one plus end node's index, then set end node to
	// its parent."
	while (endOffset == getNodeLength(endNode)
	&& endNode.parentNode) {
		endOffset = 1 + getNodeIndex(endNode);
		endNode = endNode.parentNode;
	}

	// "Let new range be a new range whose start and end nodes and offsets
	// are start node, start offset, end node, and end offset."
	var newRange = Aloha.createRange();
	newRange.setStart(startNode, startOffset);
	newRange.setEnd(endNode, endOffset);

	// "Return new range."
	return newRange;
}

function followsLineBreak(node) {
	// "Let offset be zero."
	var offset = 0;

	// "While (node, offset) is not a block boundary point:"
	while (!isBlockBoundaryPoint(node, offset)) {
		// "If node has a visible child with index offset minus one, return
		// false."
		if (0 <= offset - 1
		&& offset - 1 < node.childNodes.length
		&& isVisible(node.childNodes[offset - 1])) {
			return false;
		}

		// "If offset is zero or node has no children, set offset to node's
		// index, then set node to its parent."
		if (offset == 0
		|| !node.hasChildNodes()) {
			offset = getNodeIndex(node);
			node = node.parentNode;

		// "Otherwise, set node to its child with index offset minus one, then
		// set offset to node's length."
		} else {
			node = node.childNodes[offset - 1];
			offset = getNodeLength(node);
		}
	}

	// "Return true."
	return true;
}

function precedesLineBreak(node) {
	// "Let offset be node's length."
	var offset = getNodeLength(node);

	// "While (node, offset) is not a block boundary point:"
	while (!isBlockBoundaryPoint(node, offset)) {
		// "If node has a visible child with index offset, return false."
		if (offset < node.childNodes.length
		&& isVisible(node.childNodes[offset])) {
			return false;
		}

		// "If offset is node's length or node has no children, set offset to
		// one plus node's index, then set node to its parent."
		if (offset == getNodeLength(node)
		|| !node.hasChildNodes()) {
			offset = 1 + getNodeIndex(node);
			node = node.parentNode;

		// "Otherwise, set node to its child with index offset and set offset
		// to zero."
		} else {
			node = node.childNodes[offset];
			offset = 0;
		}
	}

	// "Return true."
	return true;
}

//@}
///// Recording and restoring overrides /////
//@{

function recordCurrentOverrides( range ) {
	// "Let overrides be a list of (string, string or boolean) ordered pairs,
	// initially empty."
	var overrides = [];

	// "If there is a value override for "createLink", add ("createLink", value
	// override for "createLink") to overrides."
	if (getValueOverride("createlink" ,range) !== undefined) {
		overrides.push(["createlink", getValueOverride("createlink", range)]);
	}

	// "For each command in the list "bold", "italic", "strikethrough",
	// "subscript", "superscript", "underline", in order: if there is a state
	// override for command, add (command, command's state override) to
	// overrides."
	$_( ["bold", "italic", "strikethrough", "subscript", "superscript",
	"underline"] ).forEach(function(command) {
		if (getStateOverride(command, range) !== undefined) {
			overrides.push([command, getStateOverride(command, range)]);
		}
	});

	// "For each command in the list "fontName", "fontSize", "foreColor",
	// "hiliteColor", in order: if there is a value override for command, add
	// (command, command's value override) to overrides."
	$_( ["fontname", "fontsize", "forecolor",
	"hilitecolor"] ).forEach(function(command) {
		if (getValueOverride(command, range) !== undefined) {
			overrides.push([command, getValueOverride(command, range)]);
		}
	});

	// "Return overrides."
	return overrides;
}

function recordCurrentStatesAndValues(range) {
	// "Let overrides be a list of (string, string or boolean) ordered pairs,
	// initially empty."
	var overrides = [];

	// "Let node be the first editable Text node effectively contained in the
	// active range, or null if there is none."
	var node = $_( getAllEffectivelyContainedNodes(range) )
		.filter(function(node) { return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE })[0];

	// "If node is null, return overrides."
	if (!node) {
		return overrides;
	}

	// "Add ("createLink", value for "createLink") to overrides."
	overrides.push(["createlink", commands.createlink.value(range)]);

	// "For each command in the list "bold", "italic", "strikethrough",
	// "subscript", "superscript", "underline", in order: if node's effective
	// command value for command is one of its inline command activated values,
	// add (command, true) to overrides, and otherwise add (command, false) to
	// overrides."
	$_( ["bold", "italic", "strikethrough", "subscript", "superscript",
	"underline"] ).forEach(function(command) {
		if ($_(commands[command].inlineCommandActivatedValues)
		.indexOf(getEffectiveCommandValue(node, command)) != -1) {
			overrides.push([command, true]);
		} else {
			overrides.push([command, false]);
		}
	});

	// "For each command in the list "fontName", "foreColor", "hiliteColor", in
	// order: add (command, command's value) to overrides."

	$_( ["fontname", "fontsize", "forecolor", "hilitecolor"] ).forEach(function(command) {
		overrides.push([command, commands[command].value(range)]);
	});

	// "Add ("fontSize", node's effective command value for "fontSize") to
	// overrides."
	overrides.push("fontsize", getEffectiveCommandValue(node, "fontsize"));

	// "Return overrides."
	return overrides;
}

function restoreStatesAndValues(overrides, range) {
	// "Let node be the first editable Text node effectively contained in the
	// active range, or null if there is none."
	var node = $_( getAllEffectivelyContainedNodes(range) )
		.filter(function(node) { return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE })[0];

	// "If node is not null, then for each (command, override) pair in
	// overrides, in order:"
	if (node) {
		for (var i = 0; i < overrides.length; i++) {
			var command = overrides[i][0];
			var override = overrides[i][1];

			// "If override is a boolean, and queryCommandState(command)
			// returns something different from override, call
			// execCommand(command)."
			if (typeof override == "boolean"
			&& myQueryCommandState(command) != override) {
				myExecCommand(command);

			// "Otherwise, if override is a string, and command is not
			// "fontSize", and queryCommandValue(command) returns something not
			// equivalent to override, call execCommand(command, false,
			// override)."
			} else if (typeof override == "string"
			&& command != "fontsize"
			&& !areEquivalentValues(command, myQueryCommandValue(command), override)) {
				myExecCommand(command, false, override);

			// "Otherwise, if override is a string; and command is "fontSize";
			// and either there is a value override for "fontSize" that is not
			// equal to override, or there is no value override for "fontSize"
			// and node's effective command value for "fontSize" is not loosely
			// equivalent to override: call execCommand("fontSize", false,
			// override)."
			} else if (typeof override == "string"
			&& command == "fontsize"
			&& (
				(
					getValueOverride("fontsize", range) !== undefined
					&& getValueOverride("fontsize", range) !== override
				) || (
					getValueOverride("fontsize", range) === undefined
					&& !areLooselyEquivalentValues(command, getEffectiveCommandValue(node, "fontsize"), override)
				)
			)) {
				myExecCommand("fontsize", false, override);

			// "Otherwise, continue this loop from the beginning."
			} else {
				continue;
			}

			// "Set node to the first editable Text node effectively contained
			// in the active range, if there is one."
			node = $_( getAllEffectivelyContainedNodes(range) )
				.filter(function(node) { return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE })[0]
				|| node;
		}

	// "Otherwise, for each (command, override) pair in overrides, in order:"
	} else {
		for (var i = 0; i < overrides.length; i++) {
			var command = overrides[i][0];
			var override = overrides[i][1];

			// "If override is a boolean, set the state override for command to
			// override."
			if (typeof override == "boolean") {
				setStateOverride(command, override, range);
			}

			// "If override is a string, set the value override for command to
			// override."
			if (typeof override == "string") {
				setValueOverride(command, override, range);
			}
		}
	}
}

//@}
///// Deleting the contents of a range /////
//@{

function deleteContents() {
	// We accept several different calling conventions:
	//
	// 1) A single argument, which is a range.
	//
	// 2) Two arguments, the first being a range and the second flags.
	//
	// 3) Four arguments, the start and end of a range.
	//
	// 4) Five arguments, the start and end of a range plus flags.
	//
	// The flags argument is a dictionary that can have up to two keys,
	// blockMerging and stripWrappers, whose corresponding values are
	// interpreted as boolean.  E.g., {stripWrappers: false}.
	var range;
	var flags = {};

	if (arguments.length < 3) {
		range = arguments[0];
	} else {
		range = Aloha.createRange();
		range.setStart(arguments[0], arguments[1]);
		range.setEnd(arguments[2], arguments[3]);
	}
	if (arguments.length == 2) {
		flags = arguments[1];
	}
	if (arguments.length == 5) {
		flags = arguments[4];
	}

	var blockMerging = "blockMerging" in flags ? !!flags.blockMerging : true;
	var stripWrappers = "stripWrappers" in flags ? !!flags.stripWrappers : true;

	// "If range is null, abort these steps and do nothing."
	if (!range) {
		return;
	}

	// "Let start node, start offset, end node, and end offset be range's start
	// and end nodes and offsets."
	var startNode = range.startContainer;
	var startOffset = range.startOffset;
	var endNode = range.endContainer;
	var endOffset = range.endOffset;

	// "While start node has at least one child:"
	while (startNode.hasChildNodes()) {
		// "If start offset is start node's length, and start node's parent is
		// in the same editing host, and start node is an inline node, set
		// start offset to one plus the index of start node, then set start
		// node to its parent and continue this loop from the beginning."
		if (startOffset == getNodeLength(startNode)
		&& inSameEditingHost(startNode, startNode.parentNode)
		&& isInlineNode(startNode)) {
			startOffset = 1 + getNodeIndex(startNode);
			startNode = startNode.parentNode;
			continue;
		}

		// "If start offset is start node's length, break from this loop."
		if (startOffset == getNodeLength(startNode)) {
			break;
		}

		// "Let reference node be the child of start node with index equal to
		// start offset."
		var referenceNode = startNode.childNodes[startOffset];

		// "If reference node is a block node or an Element with no children,
		// or is neither an Element nor a Text node, break from this loop."
		if (isBlockNode(referenceNode)
		|| (referenceNode.nodeType == $_.Node.ELEMENT_NODE
		&& !referenceNode.hasChildNodes())
		|| (referenceNode.nodeType != $_.Node.ELEMENT_NODE
		&& referenceNode.nodeType != $_.Node.TEXT_NODE)) {
			break;
		}

		// "Set start node to reference node and start offset to 0."
		startNode = referenceNode;
		startOffset = 0;
	}

	// "While end node has at least one child:"
	while (endNode.hasChildNodes()) {
		// "If end offset is 0, and end node's parent is in the same editing
		// host, and end node is an inline node, set end offset to the index of
		// end node, then set end node to its parent and continue this loop
		// from the beginning."
		if (endOffset == 0
		&& inSameEditingHost(endNode, endNode.parentNode)
		&& isInlineNode(endNode)) {
			endOffset = getNodeIndex(endNode);
			endNode = endNode.parentNode;
			continue;
		}

		// "If end offset is 0, break from this loop."
		if (endOffset == 0) {
			break;
		}

		// "Let reference node be the child of end node with index equal to end
		// offset minus one."
		var referenceNode = endNode.childNodes[endOffset - 1];

		// "If reference node is a block node or an Element with no children,
		// or is neither an Element nor a Text node, break from this loop."
		if (isBlockNode(referenceNode)
		|| (referenceNode.nodeType == $_.Node.ELEMENT_NODE
		&& !referenceNode.hasChildNodes())
		|| (referenceNode.nodeType != $_.Node.ELEMENT_NODE
		&& referenceNode.nodeType != $_.Node.TEXT_NODE)) {
			break;
		}

		// "Set end node to reference node and end offset to the length of
		// reference node."
		endNode = referenceNode;
		endOffset = getNodeLength(referenceNode);
	}

	// "If (end node, end offset) is not after (start node, start offset), set
	// range's end to its start and abort these steps."
	if (getPosition(endNode, endOffset, startNode, startOffset) !== "after") {
		range.setEnd(range.startContainer, range.startOffset);
		return;
	}

	// "If start node is a Text node and start offset is 0, set start offset to
	// the index of start node, then set start node to its parent."
	if (startNode.nodeType == $_.Node.TEXT_NODE
	&& startOffset == 0
	&& startNode != endNode) {
//		startOffset = getNodeIndex(startNode);
//		startNode = startNode.parentNode;
	}

	// "If end node is a Text node and end offset is its length, set end offset
	// to one plus the index of end node, then set end node to its parent."
	if (endNode.nodeType == $_.Node.TEXT_NODE
	&& endOffset == getNodeLength(endNode)
	&& startNode != endNode) {
		endOffset = 1 + getNodeIndex(endNode);
		endNode = endNode.parentNode;
	}

	// "Set range's start to (start node, start offset) and its end to (end
	// node, end offset)."
	range.setStart(startNode, startOffset);
	range.setEnd(endNode, endOffset);

	// "Let start block be the start node of range."
	var startBlock = range.startContainer;

	// "While start block's parent is in the same editing host and start block
	// is an inline node, set start block to its parent."
	while (inSameEditingHost(startBlock, startBlock.parentNode)
	&& isInlineNode(startBlock)) {
		startBlock = startBlock.parentNode;
	}

	// "If start block is neither a block node nor an editing host, or "span"
	// is not an allowed child of start block, or start block is a td or th,
	// set start block to null."
	if ((!isBlockNode(startBlock) && !isEditingHost(startBlock))
	|| !isAllowedChild("span", startBlock)
	|| isHtmlElement(startBlock, ["td", "th"])) {
		startBlock = null;
	}

	// "Let end block be the end node of range."
	var endBlock = range.endContainer;
	
	// "While end block's parent is in the same editing host and end block is
	// an inline node, set end block to its parent."
	while (inSameEditingHost(endBlock, endBlock.parentNode)
	&& isInlineNode(endBlock)) {
		endBlock = endBlock.parentNode;
	}
	
	// "If end block is neither a block node nor an editing host, or "span" is
	// not an allowed child of end block, or end block is a td or th, set end
	// block to null."
	if ((!isBlockNode(endBlock) && !isEditingHost(endBlock))
	|| !isAllowedChild("span", endBlock)
	|| isHtmlElement(endBlock, ["td", "th"])) {
		endBlock = null;
	}

	// "Record current states and values, and let overrides be the result."
	var overrides = recordCurrentStatesAndValues(range);
	// "If start node and end node are the same, and start node is an editable
	// Text node:"
	if (startNode == endNode
	&& isEditable(startNode)
	&& startNode.nodeType == $_.Node.TEXT_NODE) {
		// "Let parent be the parent of node."
		var parent_ = startNode.parentNode;

		// "Call deleteData(start offset, end offset − start offset) on start
		// node."
		startNode.deleteData(startOffset, endOffset - startOffset);

		// "Canonicalize whitespace at (start node, start offset)."
		canonicalizeWhitespace(startNode, startOffset);

		// "Set range's end to its start."
		range.setEnd(range.startContainer, range.startOffset);

		// "Restore states and values from overrides."
		restoreStatesAndValues(overrides, range);

		// "If parent is editable or an editing host, is not an inline node,
		// and has no children, call createElement("br") on the context object
		// and append the result as the last child of parent."
		// only do this, if the offsetHeight is 0
		if ((isEditable(parent_) || isEditingHost(parent_))
		&& !isInlineNode(parent_)
		&& parent_.offsetHeight === 0) {
			parent_.appendChild(createEndBreak());
		}

		// "Abort these steps."
		return;
	}

	// "If start node is an editable Text node, call deleteData() on it, with
	// start offset as the first argument and (length of start node − start
	// offset) as the second argument."
	if (isEditable(startNode)
	&& startNode.nodeType == $_.Node.TEXT_NODE) {
		startNode.deleteData(startOffset, getNodeLength(startNode) - startOffset);
	}

	// "Let node list be a list of nodes, initially empty."
	//
	// "For each node contained in range, append node to node list if the last
	// member of node list (if any) is not an ancestor of node; node is
	// editable; and node is not a thead, tbody, tfoot, tr, th, or td."
	var nodeList = getContainedNodes(range,
		function(node) {
			return isEditable(node)
				&& !isHtmlElement(node, ["thead", "tbody", "tfoot", "tr", "th", "td"]);
		}
	);

	// "For each node in node list:"
	for (var i = 0; i < nodeList.length; i++) {
		var node = nodeList[i];

		// "Let parent be the parent of node."
		var parent_ = node.parentNode;

		// "Remove node from parent."
		parent_.removeChild(node);

		// "If strip wrappers is true or parent is not an ancestor container of
		// start node, while parent is an editable inline node with length 0,
		// let grandparent be the parent of parent, then remove parent from
		// grandparent, then set parent to grandparent."
		if (stripWrappers
		|| (!isAncestor(parent_, startNode) && parent_ != startNode)) {
			while (isEditable(parent_)
			&& isInlineNode(parent_)
			&& getNodeLength(parent_) == 0) {
				var grandparent = parent_.parentNode;
				grandparent.removeChild(parent_);
				parent_ = grandparent;
			}
		}

		// "If parent is editable or an editing host, is not an inline node,
		// and has no children, call createElement("br") on the context object
		// and append the result as the last child of parent."
		// only do this, if the offsetHeight is 0
		if ((isEditable(parent_) || isEditingHost(parent_))
		&& !isInlineNode(parent_)
		&& !parent_.hasChildNodes()
		&& parent_.offsetHeight === 0) {
			parent_.appendChild(createEndBreak());
		}
	}

	// "If end node is an editable Text node, call deleteData(0, end offset) on
	// it."
	if (isEditable(endNode)
	&& endNode.nodeType == $_.Node.TEXT_NODE) {
		endNode.deleteData(0, endOffset);
	}

	// "Canonicalize whitespace at range's start."
	canonicalizeWhitespace(range.startContainer, range.startOffset);

	// "Canonicalize whitespace at range's end."
	canonicalizeWhitespace(range.endContainer, range.endOffset);

	// "If block merging is false, or start block or end block is null, or
	// start block is not in the same editing host as end block, or start block
	// and end block are the same:"
	if (!blockMerging
	|| !startBlock
	|| !endBlock
	|| !inSameEditingHost(startBlock, endBlock)
	|| startBlock == endBlock) {
		// "Set range's end to its start."
		range.setEnd(range.startContainer, range.startOffset);

		// "Restore states and values from overrides."
		restoreStatesAndValues(overrides, range);

		// "Abort these steps."
		return;
	}

	// "If start block has one child, which is a collapsed block prop, remove
	// its child from it."
	if (startBlock.children.length == 1
	&& isCollapsedBlockProp(startBlock.firstChild)) {
		startBlock.removeChild(startBlock.firstChild);
	}

	// "If end block has one child, which is a collapsed block prop, remove its
	// child from it."
	if (endBlock.children.length == 1
	&& isCollapsedBlockProp(endBlock.firstChild)) {
		endBlock.removeChild(endBlock.firstChild);
	}

	// "If start block is an ancestor of end block:"
	if (isAncestor(startBlock, endBlock)) {
		// "Let reference node be end block."
		var referenceNode = endBlock;

		// "While reference node is not a child of start block, set reference
		// node to its parent."
		while (referenceNode.parentNode != startBlock) {
			referenceNode = referenceNode.parentNode;
		}

		// "Set the start and end of range to (start block, index of reference
		// node)."
		range.setStart(startBlock, getNodeIndex(referenceNode));
		range.setEnd(startBlock, getNodeIndex(referenceNode));

		// "If end block has no children:"
		if (!endBlock.hasChildNodes()) {
			// "While end block is editable and is the only child of its parent
			// and is not a child of start block, let parent equal end block,
			// then remove end block from parent, then set end block to
			// parent."
			while (isEditable(endBlock)
			&& endBlock.parentNode.childNodes.length == 1
			&& endBlock.parentNode != startBlock) {
				var parent_ = endBlock;
				parent_.removeChild(endBlock);
				endBlock = parent_;
			}

			// "If end block is editable and is not an inline node, and its
			// previousSibling and nextSibling are both inline nodes, call
			// createElement("br") on the context object and insert it into end
			// block's parent immediately after end block."

			if (isEditable(endBlock)
			&& !isInlineNode(endBlock)
			&& isInlineNode(endBlock.previousSibling)
			&& isInlineNode(endBlock.nextSibling)) {
				endBlock.parentNode.insertBefore(document.createElement("br"), endBlock.nextSibling);
			}

			// "If end block is editable, remove it from its parent."
			if (isEditable(endBlock)) {
				endBlock.parentNode.removeChild(endBlock);
			}

			// "Restore states and values from overrides."
			restoreStatesAndValues(overrides, range);

			// "Abort these steps."
			return;
		}

		// "If end block's firstChild is not an inline node, restore states and
		// values from overrides, then abort these steps."
		if (!isInlineNode(endBlock.firstChild)) {
			restoreStatesAndValues(overrides, range);
			return;
		}

		// "Let children be a list of nodes, initially empty."
		var children = [];

		// "Append the first child of end block to children."
		children.push(endBlock.firstChild);

		// "While children's last member is not a br, and children's last
		// member's nextSibling is an inline node, append children's last
		// member's nextSibling to children."
		while (!isHtmlElement(children[children.length - 1], "br")
		&& isInlineNode(children[children.length - 1].nextSibling)) {
			children.push(children[children.length - 1].nextSibling);
		}

		// "Record the values of children, and let values be the result."
		var values = recordValues(children);

		// "While children's first member's parent is not start block, split
		// the parent of children."
		while (children[0].parentNode != startBlock) {
			splitParent(children, range);
		}

		// "If children's first member's previousSibling is an editable br,
		// remove that br from its parent."
		if (isEditable(children[0].previousSibling)
		&& isHtmlElement(children[0].previousSibling, "br")) {
			children[0].parentNode.removeChild(children[0].previousSibling);
		}

	// "Otherwise, if start block is a descendant of end block:"
	} else if (isDescendant(startBlock, endBlock)) {
		// "Set the start and end of range to (start block, length of start
		// block)."
		range.setStart(startBlock, getNodeLength(startBlock));
		range.setEnd(startBlock, getNodeLength(startBlock));

		// "Let reference node be start block."
		var referenceNode = startBlock;

		// "While reference node is not a child of end block, set reference
		// node to its parent."
		while (referenceNode.parentNode != endBlock) {
			referenceNode = referenceNode.parentNode;
		}

		// "If reference node's nextSibling is an inline node and start block's
		// lastChild is a br, remove start block's lastChild from it."
		if (isInlineNode(referenceNode.nextSibling)
		&& isHtmlElement(startBlock.lastChild, "br")) {
			startBlock.removeChild(startBlock.lastChild);
		}

		// "Let nodes to move be a list of nodes, initially empty."
		var nodesToMove = [];

		// "If reference node's nextSibling is neither null nor a br nor a
		// block node, append it to nodes to move."
		if (referenceNode.nextSibling
		&& !isHtmlElement(referenceNode.nextSibling, "br")
		&& !isBlockNode(referenceNode.nextSibling)) {
			nodesToMove.push(referenceNode.nextSibling);
		}

		// "While nodes to move is nonempty and its last member's nextSibling
		// is neither null nor a br nor a block node, append it to nodes to
		// move."
		if (nodesToMove.length
		&& nodesToMove[nodesToMove.length - 1].nextSibling
		&& !isHtmlElement(nodesToMove[nodesToMove.length - 1].nextSibling, "br")
		&& !isBlockNode(nodesToMove[nodesToMove.length - 1].nextSibling)) {
			nodesToMove.push(nodesToMove[nodesToMove.length - 1].nextSibling);
		}

		// "Record the values of nodes to move, and let values be the result."
		var values = recordValues(nodesToMove);

		// "For each node in nodes to move, append node as the last child of
		// start block, preserving ranges."
		$_( nodesToMove ).forEach(function(node) {
			movePreservingRanges(node, startBlock, -1, range);
		});

		// "If the nextSibling of reference node is a br, remove it from its
		// parent."
		if (isHtmlElement(referenceNode.nextSibling, "br")) {
			referenceNode.parentNode.removeChild(referenceNode.nextSibling);
		}

	// "Otherwise:"
	} else {
		// "Set the start and end of range to (start block, length of start
		// block)."
		range.setStart(startBlock, getNodeLength(startBlock));
		range.setEnd(startBlock, getNodeLength(startBlock));

		// "If end block's firstChild is an inline node and start block's
		// lastChild is a br, remove start block's lastChild from it."
		if (isInlineNode(endBlock.firstChild)
		&& isHtmlElement(startBlock.lastChild, "br")) {
			startBlock.removeChild(startBlock.lastChild);
		}

		// "Record the values of end block's children, and let values be the
		// result."
		var values = recordValues([].slice.call(toArray(endBlock.childNodes)));

		// "While end block has children, append the first child of end block
		// to start block, preserving ranges."
		while (endBlock.hasChildNodes()) {
			movePreservingRanges(endBlock.firstChild, startBlock, -1, range);
		}

		// "While end block has no children, let parent be the parent of end
		// block, then remove end block from parent, then set end block to
		// parent."
		while (!endBlock.hasChildNodes()) {
			var parent_ = endBlock.parentNode;
			parent_.removeChild(endBlock);
			endBlock = parent_;
		}
	}

	// "Restore the values from values."
	restoreValues(values, range);

	// "If start block has no children, call createElement("br") on the context
	// object and append the result as the last child of start block."
	if (!startBlock.hasChildNodes() && startBlock.offsetHeight == 0) {
		startBlock.appendChild(createEndBreak());
	}

	// "Restore states and values from overrides."
	restoreStatesAndValues(overrides, range);
}


//@}
///// Splitting a node list's parent /////
//@{

function splitParent(nodeList, range) {
	// "Let original parent be the parent of the first member of node list."
	var originalParent = nodeList[0].parentNode;

	// "If original parent is not editable or its parent is null, do nothing
	// and abort these steps."
	if (!isEditable(originalParent)
	|| !originalParent.parentNode) {
		return;
	}

	// "If the first child of original parent is in node list, remove
	// extraneous line breaks before original parent."
	if ($_(nodeList).indexOf(originalParent.firstChild) != -1) {
		removeExtraneousLineBreaksBefore(originalParent);
	}

	// "If the first child of original parent is in node list, and original
	// parent follows a line break, set follows line break to true. Otherwise,
	// set follows line break to false."
	var followsLineBreak_ = $_(nodeList).indexOf(originalParent.firstChild) != -1
		&& followsLineBreak(originalParent);

	// "If the last child of original parent is in node list, and original
	// parent precedes a line break, set precedes line break to true.
	// Otherwise, set precedes line break to false."
	var precedesLineBreak_ = $_(nodeList).indexOf(originalParent.lastChild) != -1
		&& precedesLineBreak(originalParent);

	// "If the first child of original parent is not in node list, but its last
	// child is:"
	if ($_(nodeList).indexOf(originalParent.firstChild) == -1
	&& $_(nodeList).indexOf(originalParent.lastChild) != -1) {
		// "For each node in node list, in reverse order, insert node into the
		// parent of original parent immediately after original parent,
		// preserving ranges."
		for (var i = nodeList.length - 1; i >= 0; i--) {
			movePreservingRanges(nodeList[i], originalParent.parentNode, 1 + getNodeIndex(originalParent), range);
		}

		// "If precedes line break is true, and the last member of node list
		// does not precede a line break, call createElement("br") on the
		// context object and insert the result immediately after the last
		// member of node list."
		if (precedesLineBreak_
		&& !precedesLineBreak(nodeList[nodeList.length - 1])) {
			nodeList[nodeList.length - 1].parentNode.insertBefore(document.createElement("br"), nodeList[nodeList.length - 1].nextSibling);
		}

		// "Remove extraneous line breaks at the end of original parent."
		removeExtraneousLineBreaksAtTheEndOf(originalParent);

		// "Abort these steps."
		return;
	}

	// "If the first child of original parent is not in node list:"
	if ($_(nodeList).indexOf(originalParent.firstChild) == -1) {
		// "Let cloned parent be the result of calling cloneNode(false) on
		// original parent."
		var clonedParent = originalParent.cloneNode(false);

		// "If original parent has an id attribute, unset it."
		originalParent.removeAttribute("id");

		// "Insert cloned parent into the parent of original parent immediately
		// before original parent."
		originalParent.parentNode.insertBefore(clonedParent, originalParent);

		// "While the previousSibling of the first member of node list is not
		// null, append the first child of original parent as the last child of
		// cloned parent, preserving ranges."
		while (nodeList[0].previousSibling) {
			movePreservingRanges(originalParent.firstChild, clonedParent, clonedParent.childNodes.length, range);
		}
	}

	// "For each node in node list, insert node into the parent of original
	// parent immediately before original parent, preserving ranges."
	for (var i = 0; i < nodeList.length; i++) {
		movePreservingRanges(nodeList[i], originalParent.parentNode, getNodeIndex(originalParent), range);
	}

	// "If follows line break is true, and the first member of node list does
	// not follow a line break, call createElement("br") on the context object
	// and insert the result immediately before the first member of node list."
	if (followsLineBreak_
	&& !followsLineBreak(nodeList[0])) {
		nodeList[0].parentNode.insertBefore(document.createElement("br"), nodeList[0]);
	}

	// "If the last member of node list is an inline node other than a br, and
	// the first child of original parent is a br, and original parent is not
	// an inline node, remove the first child of original parent from original
	// parent."
	if (isInlineNode(nodeList[nodeList.length - 1])
	&& !isHtmlElement(nodeList[nodeList.length - 1], "br")
	&& isHtmlElement(originalParent.firstChild, "br")
	&& !isInlineNode(originalParent)) {
		originalParent.removeChild(originalParent.firstChild);
	}

	// "If original parent has no children:"
	if (!originalParent.hasChildNodes()) {
		// if the current range is collapsed and at the end of the originalParent.parentNode
		// the offset will not be available anymore after the next step (remove child)
		// that's why we need to fix the range to prevent a bogus offset
		if (originalParent.parentNode === range.startContainer
		&& originalParent.parentNode === range.endContainer
		&& range.startContainer === range.endContainer
		&& range.startOffset === range.endOffset
		&& originalParent.parentNode.childNodes.length === range.startOffset) {
			range.startOffset = originalParent.parentNode.childNodes.length - 1;
			range.endOffset = range.startOffset;
		}

		// "Remove original parent from its parent."
		originalParent.parentNode.removeChild(originalParent);

		// "If precedes line break is true, and the last member of node list
		// does not precede a line break, call createElement("br") on the
		// context object and insert the result immediately after the last
		// member of node list."
		if (precedesLineBreak_
		&& !precedesLineBreak(nodeList[nodeList.length - 1])) {
			nodeList[nodeList.length - 1].parentNode.insertBefore(document.createElement("br"), nodeList[nodeList.length - 1].nextSibling);
		}

	// "Otherwise, remove extraneous line breaks before original parent."
	} else {
		removeExtraneousLineBreaksBefore(originalParent);
	}

	// "If node list's last member's nextSibling is null, but its parent is not
	// null, remove extraneous line breaks at the end of node list's last
	// member's parent."
	if (!nodeList[nodeList.length - 1].nextSibling
	&& nodeList[nodeList.length - 1].parentNode) {
		removeExtraneousLineBreaksAtTheEndOf(nodeList[nodeList.length - 1].parentNode);
	}
}

// "To remove a node node while preserving its descendants, split the parent of
// node's children if it has any. If it has no children, instead remove it from
// its parent."
function removePreservingDescendants(node, range) {
	if (node.hasChildNodes()) {
		splitParent([].slice.call(toArray(node.childNodes)), range);
	} else {
		node.parentNode.removeChild(node);
	}
}


//@}
///// Canonical space sequences /////
//@{

function canonicalSpaceSequence(n, nonBreakingStart, nonBreakingEnd) {
	// "If n is zero, return the empty string."
	if (n == 0) {
		return "";
	}

	// "If n is one and both non-breaking start and non-breaking end are false,
	// return a single space (U+0020)."
	if (n == 1 && !nonBreakingStart && !nonBreakingEnd) {
		return " ";
	}

	// "If n is one, return a single non-breaking space (U+00A0)."
	if (n == 1) {
		return "\xa0";
	}

	// "Let buffer be the empty string."
	var buffer = "";

	// "If non-breaking start is true, let repeated pair be U+00A0 U+0020.
	// Otherwise, let it be U+0020 U+00A0."
	var repeatedPair;
	if (nonBreakingStart) {
		repeatedPair = "\xa0 ";
	} else {
		repeatedPair = " \xa0";
	}

	// "While n is greater than three, append repeated pair to buffer and
	// subtract two from n."
	while (n > 3) {
		buffer += repeatedPair;
		n -= 2;
	}

	// "If n is three, append a three-element string to buffer depending on
	// non-breaking start and non-breaking end:"
	if (n == 3) {
		buffer +=
			!nonBreakingStart && !nonBreakingEnd ? " \xa0 "
			: nonBreakingStart && !nonBreakingEnd ? "\xa0\xa0 "
			: !nonBreakingStart && nonBreakingEnd ? " \xa0\xa0"
			: nonBreakingStart && nonBreakingEnd ? "\xa0 \xa0"
			: "impossible";

	// "Otherwise, append a two-element string to buffer depending on
	// non-breaking start and non-breaking end:"
	} else {
		buffer +=
			!nonBreakingStart && !nonBreakingEnd ? "\xa0 "
			: nonBreakingStart && !nonBreakingEnd ? "\xa0 "
			: !nonBreakingStart && nonBreakingEnd ? " \xa0"
			: nonBreakingStart && nonBreakingEnd ? "\xa0\xa0"
			: "impossible";
	}

	// "Return buffer."
	return buffer;
}

function canonicalizeWhitespace(node, offset) {
	// "If node is neither editable nor an editing host, abort these steps."
	if (!isEditable(node) && !isEditingHost(node)) {
		return;
	}

	// "Let start node equal node and let start offset equal offset."
	var startNode = node;
	var startOffset = offset;

	// "Repeat the following steps:"
	while (true) {
		// "If start node has a child in the same editing host with index start
		// offset minus one, set start node to that child, then set start
		// offset to start node's length."
		if (0 <= startOffset - 1
		&& inSameEditingHost(startNode, startNode.childNodes[startOffset - 1])) {
			startNode = startNode.childNodes[startOffset - 1];
			startOffset = getNodeLength(startNode);

		// "Otherwise, if start offset is zero and start node does not follow a
		// line break and start node's parent is in the same editing host, set
		// start offset to start node's index, then set start node to its
		// parent."
		} else if (startOffset == 0
		&& !followsLineBreak(startNode)
		&& inSameEditingHost(startNode, startNode.parentNode)) {
			startOffset = getNodeIndex(startNode);
			startNode = startNode.parentNode;

		// "Otherwise, if start node is a Text node and its parent's resolved
		// value for "white-space" is neither "pre" nor "pre-wrap" and start
		// offset is not zero and the (start offset − 1)st element of start
		// node's data is a space (0x0020) or non-breaking space (0x00A0),
		// subtract one from start offset."
		} else if (startNode.nodeType == $_.Node.TEXT_NODE
		&& $_(["pre", "pre-wrap"]).indexOf($_.getComputedStyle(startNode.parentNode).whiteSpace) == -1
		&& startOffset != 0
		&& /[ \xa0]/.test(startNode.data[startOffset - 1])) {
			startOffset--;

		// "Otherwise, break from this loop."
		} else {
			break;
		}
	}

	// "Let end node equal start node and end offset equal start offset."
	var endNode = startNode;
	var endOffset = startOffset;

	// "Let length equal zero."
	var length = 0;

	// "Let follows space be false."
	var followsSpace = false;

	// "Repeat the following steps:"
	while (true) {
		// "If end node has a child in the same editing host with index end
		// offset, set end node to that child, then set end offset to zero."
		if (endOffset < endNode.childNodes.length
		&& inSameEditingHost(endNode, endNode.childNodes[endOffset])) {
			endNode = endNode.childNodes[endOffset];
			endOffset = 0;

		// "Otherwise, if end offset is end node's length and end node does not
		// precede a line break and end node's parent is in the same editing
		// host, set end offset to one plus end node's index, then set end node
		// to its parent."
		} else if (endOffset == getNodeLength(endNode)
		&& !precedesLineBreak(endNode)
		&& inSameEditingHost(endNode, endNode.parentNode)) {
			endOffset = 1 + getNodeIndex(endNode);
			endNode = endNode.parentNode;

		// "Otherwise, if end node is a Text node and its parent's resolved
		// value for "white-space" is neither "pre" nor "pre-wrap" and end
		// offset is not end node's length and the end offsetth element of
		// end node's data is a space (0x0020) or non-breaking space (0x00A0):"
		} else if (endNode.nodeType == $_.Node.TEXT_NODE
		&& $_(["pre", "pre-wrap"]).indexOf($_.getComputedStyle(endNode.parentNode).whiteSpace) == -1
		&& endOffset != getNodeLength(endNode)
		&& /[ \xa0]/.test(endNode.data[endOffset])) {
			// "If follows space is true and the end offsetth element of end
			// node's data is a space (0x0020), call deleteData(end offset, 1)
			// on end node, then continue this loop from the beginning."
			if (followsSpace
			&& " " == endNode.data[endOffset]) {
				endNode.deleteData(endOffset, 1);
				continue;
			}

			// "Set follows space to true if the end offsetth element of end
			// node's data is a space (0x0020), false otherwise."
			followsSpace = " " == endNode.data[endOffset];

			// "Add one to end offset."
			endOffset++;

			// "Add one to length."
			length++;

		// "Otherwise, break from this loop."
		} else {
			break;
		}
	}

	// "Let replacement whitespace be the canonical space sequence of length
	// length. non-breaking start is true if start offset is zero and start
	// node follows a line break, and false otherwise. non-breaking end is true
	// if end offset is end node's length and end node precedes a line break,
	// and false otherwise."
	var replacementWhitespace = canonicalSpaceSequence(length,
		startOffset == 0 && followsLineBreak(startNode),
		endOffset == getNodeLength(endNode) && precedesLineBreak(endNode));

	// "While (start node, start offset) is before (end node, end offset):"
	while (getPosition(startNode, startOffset, endNode, endOffset) == "before") {
		// "If start node has a child with index start offset, set start node
		// to that child, then set start offset to zero."
		if (startOffset < startNode.childNodes.length) {
			startNode = startNode.childNodes[startOffset];
			startOffset = 0;

		// "Otherwise, if start node is not a Text node or if start offset is
		// start node's length, set start offset to one plus start node's
		// index, then set start node to its parent."
		} else if (startNode.nodeType != $_.Node.TEXT_NODE
		|| startOffset == getNodeLength(startNode)) {
			startOffset = 1 + getNodeIndex(startNode);
			startNode = startNode.parentNode;

		// "Otherwise:"
		} else {
			// "Remove the first element from replacement whitespace, and let
			// element be that element."
			var element = replacementWhitespace[0];
			replacementWhitespace = replacementWhitespace.slice(1);

			// "If element is not the same as the start offsetth element of
			// start node's data:"
			if (element != startNode.data[startOffset]) {
				// "Call insertData(start offset, element) on start node."
				startNode.insertData(startOffset, element);

				// "Call deleteData(start offset + 1, 1) on start node."
				startNode.deleteData(startOffset + 1, 1);
			}

			// "Add one to start offset."
			startOffset++;
		}
	}
}


//@}
///// Indenting and outdenting /////
//@{

function indentNodes(nodeList, range) {
	// "If node list is empty, do nothing and abort these steps."
	if (!nodeList.length) {
		return;
	}

	// "Let first node be the first member of node list."
	var firstNode = nodeList[0];

	// "If first node's parent is an ol or ul:"
	if (isHtmlElement(firstNode.parentNode, ["OL", "UL"])) {
		// "Let tag be the local name of the parent of first node."
		var tag = firstNode.parentNode.tagName;

		// "Wrap node list, with sibling criteria returning true for an HTML
		// element with local name tag and false otherwise, and new parent
		// instructions returning the result of calling createElement(tag) on
		// the ownerDocument of first node."
		wrap(nodeList,
			function(node) { return isHtmlElement(node, tag) },
			function() { return firstNode.ownerDocument.createElement(tag) },
			range
		);

		// "Abort these steps."
		return;
	}

	// "Wrap node list, with sibling criteria returning true for a simple
	// indentation element and false otherwise, and new parent instructions
	// returning the result of calling createElement("blockquote") on the
	// ownerDocument of first node. Let new parent be the result."
	var newParent = wrap(nodeList,
		function(node) { return isSimpleIndentationElement(node) },
		function() { return firstNode.ownerDocument.createElement("blockquote") },
		range
	);

	// "Fix disallowed ancestors of new parent."
	fixDisallowedAncestors(newParent, range);
}

function outdentNode(node, range) {
	// "If node is not editable, abort these steps."
	if (!isEditable(node)) {
		return;
	}

	// "If node is a simple indentation element, remove node, preserving its
	// descendants.  Then abort these steps."
	if (isSimpleIndentationElement(node)) {
		removePreservingDescendants(node, range);
		return;
	}

	// "If node is an indentation element:"
	if (isIndentationElement(node)) {
		// "Unset the class and dir attributes of node, if any."
		node.removeAttribute("class");
		node.removeAttribute("dir");

		// "Unset the margin, padding, and border CSS properties of node."
		node.style.margin = "";
		node.style.padding = "";
		node.style.border = "";
		if (node.getAttribute("style") == "") {
			node.removeAttribute("style");
		}

		// "Set the tag name of node to "div"."
		setTagName(node, "div", range);

		// "Abort these steps."
		return;
	}

	// "Let current ancestor be node's parent."
	var currentAncestor = node.parentNode;

	// "Let ancestor list be a list of nodes, initially empty."
	var ancestorList = [];

	// "While current ancestor is an editable Element that is neither a simple
	// indentation element nor an ol nor a ul, append current ancestor to
	// ancestor list and then set current ancestor to its parent."
	while (isEditable(currentAncestor)
	&& currentAncestor.nodeType == $_.Node.ELEMENT_NODE
	&& !isSimpleIndentationElement(currentAncestor)
	&& !isHtmlElement(currentAncestor, ["ol", "ul"])) {
		ancestorList.push(currentAncestor);
		currentAncestor = currentAncestor.parentNode;
	}

	// "If current ancestor is not an editable simple indentation element:"
	if (!isEditable(currentAncestor)
	|| !isSimpleIndentationElement(currentAncestor)) {
		// "Let current ancestor be node's parent."
		currentAncestor = node.parentNode;

		// "Let ancestor list be the empty list."
		ancestorList = [];

		// "While current ancestor is an editable Element that is neither an
		// indentation element nor an ol nor a ul, append current ancestor to
		// ancestor list and then set current ancestor to its parent."
		while (isEditable(currentAncestor)
		&& currentAncestor.nodeType == $_.Node.ELEMENT_NODE
		&& !isIndentationElement(currentAncestor)
		&& !isHtmlElement(currentAncestor, ["ol", "ul"])) {
			ancestorList.push(currentAncestor);
			currentAncestor = currentAncestor.parentNode;
		}
	}

	// "If node is an ol or ul and current ancestor is not an editable
	// indentation element:"
	if (isHtmlElement(node, ["OL", "UL"])
	&& (!isEditable(currentAncestor)
	|| !isIndentationElement(currentAncestor))) {
		// "Unset the reversed, start, and type attributes of node, if any are
		// set."
		node.removeAttribute("reversed");
		node.removeAttribute("start");
		node.removeAttribute("type");

		// "Let children be the children of node."
		var children = [].slice.call(toArray(node.childNodes));

		// "If node has attributes, and its parent is not an ol or ul, set the
		// tag name of node to "div"."
		if (node.attributes.length
		&& !isHtmlElement(node.parentNode, ["OL", "UL"])) {
			setTagName(node, "div", range);

		// "Otherwise:"
		} else {
			// "Record the values of node's children, and let values be the
			// result."
			var values = recordValues([].slice.call(toArray(node.childNodes)));

			// "Remove node, preserving its descendants."
			removePreservingDescendants(node, range);

			// "Restore the values from values."
			restoreValues(values, range);
		}

		// "Fix disallowed ancestors of each member of children."
		for (var i = 0; i < children.length; i++) {
			fixDisallowedAncestors(children[i], range);
		}

		// "Abort these steps."
		return;
	}

	// "If current ancestor is not an editable indentation element, abort these
	// steps."
	if (!isEditable(currentAncestor)
	|| !isIndentationElement(currentAncestor)) {
		return;
	}

	// "Append current ancestor to ancestor list."
	ancestorList.push(currentAncestor);

	// "Let original ancestor be current ancestor."
	var originalAncestor = currentAncestor;

	// "While ancestor list is not empty:"
	while (ancestorList.length) {
		// "Let current ancestor be the last member of ancestor list."
		//
		// "Remove the last member of ancestor list."
		currentAncestor = ancestorList.pop();

		// "Let target be the child of current ancestor that is equal to either
		// node or the last member of ancestor list."
		var target = node.parentNode == currentAncestor
			? node
			: ancestorList[ancestorList.length - 1];

		// "If target is an inline node that is not a br, and its nextSibling
		// is a br, remove target's nextSibling from its parent."
		if (isInlineNode(target)
		&& !isHtmlElement(target, "BR")
		&& isHtmlElement(target.nextSibling, "BR")) {
			target.parentNode.removeChild(target.nextSibling);
		}

		// "Let preceding siblings be the preceding siblings of target, and let
		// following siblings be the following siblings of target."
		var precedingSiblings = [].slice.call(toArray(currentAncestor.childNodes), 0, getNodeIndex(target));
		var followingSiblings = [].slice.call(toArray(currentAncestor.childNodes), 1 + getNodeIndex(target));

		// "Indent preceding siblings."
		indentNodes(precedingSiblings, range);

		// "Indent following siblings."
		indentNodes(followingSiblings, range);
	}

	// "Outdent original ancestor."
	outdentNode(originalAncestor, range);
}


//@}
///// Toggling lists /////
//@{

function toggleLists(tagName, range) {
	// "Let mode be "disable" if the selection's list state is tag name, and
	// "enable" otherwise."
	var mode = getSelectionListState() == tagName ? "disable" : "enable";

	tagName = tagName.toUpperCase();

	// "Let other tag name be "ol" if tag name is "ul", and "ul" if tag name is
	// "ol"."
	var otherTagName = tagName == "OL" ? "UL" : "OL";

	// "Let items be a list of all lis that are ancestor containers of the
	// range's start and/or end node."
	//
	// It's annoying to get this in tree order using functional stuff without
	// doing getDescendants(document), which is slow, so I do it imperatively.
	var items = [];
	(function(){
		for (
			var ancestorContainer = range.endContainer;
			ancestorContainer != range.commonAncestorContainer;
			ancestorContainer = ancestorContainer.parentNode
		) {
			if (isHtmlElement(ancestorContainer, "li")) {
				items.unshift(ancestorContainer);
			}
		}
		for (
			var ancestorContainer = range.startContainer;
			ancestorContainer;
			ancestorContainer = ancestorContainer.parentNode
		) {
			if (isHtmlElement(ancestorContainer, "li")) {
				items.unshift(ancestorContainer);
			}
		}
	})();

	// "For each item in items, normalize sublists of item."
	$_( items ).forEach( function( thisArg ) {
			normalizeSublists( thisArg, range);
	});

	// "Block-extend the range, and let new range be the result."
	var newRange = blockExtend(range);

	// "If mode is "enable", then let lists to convert consist of every
	// editable HTML element with local name other tag name that is contained
	// in new range, and for every list in lists to convert:"
	if (mode == "enable") {
		$_( getAllContainedNodes(newRange, function(node) {
			return isEditable(node)
				&& isHtmlElement(node, otherTagName);
		}) ).forEach(function(list) {
			// "If list's previousSibling or nextSibling is an editable HTML
			// element with local name tag name:"
			if ((isEditable(list.previousSibling) && isHtmlElement(list.previousSibling, tagName))
			|| (isEditable(list.nextSibling) && isHtmlElement(list.nextSibling, tagName))) {
				// "Let children be list's children."
				var children = [].slice.call(toArray(list.childNodes));

				// "Record the values of children, and let values be the
				// result."
				var values = recordValues(children);

				// "Split the parent of children."
				splitParent(children, range);

				// "Wrap children, with sibling criteria returning true for an
				// HTML element with local name tag name and false otherwise."
				wrap(children, 
					function(node) { return isHtmlElement(node, tagName) },
					function() {return null },
					range
				);

				// "Restore the values from values."
				restoreValues(values, range);

			// "Otherwise, set the tag name of list to tag name."
			} else {
				setTagName(list, tagName, range);
			}
		});
	}

	// "Let node list be a list of nodes, initially empty."
	//
	// "For each node node contained in new range, if node is editable; the
	// last member of node list (if any) is not an ancestor of node; node
	// is not an indentation element; and either node is an ol or ul, or its
	// parent is an ol or ul, or it is an allowed child of "li"; then append
	// node to node list."
	var nodeList = getContainedNodes(newRange, function(node) {
		return isEditable(node)
		&& !isIndentationElement(node)
		&& (isHtmlElement(node, ["OL", "UL"])
		|| isHtmlElement(node.parentNode, ["OL", "UL"])
		|| isAllowedChild(node, "li"));
	});

	// "If mode is "enable", remove from node list any ol or ul whose parent is
	// not also an ol or ul."
	if (mode == "enable") {
		nodeList = $_( nodeList ).filter(function(node) {
			return !isHtmlElement(node, ["ol", "ul"])
				|| isHtmlElement(node.parentNode, ["ol", "ul"]);
		});
	}

	// "If mode is "disable", then while node list is not empty:"
	if (mode == "disable") {
		while (nodeList.length) {
			// "Let sublist be an empty list of nodes."
			var sublist = [];

			// "Remove the first member from node list and append it to
			// sublist."
			sublist.push(nodeList.shift());

			// "If the first member of sublist is an HTML element with local
			// name tag name, outdent it and continue this loop from the
			// beginning."
			if (isHtmlElement(sublist[0], tagName)) {
				outdentNode(sublist[0], range);
				continue;
			}

			// "While node list is not empty, and the first member of node list
			// is the nextSibling of the last member of sublist and is not an
			// HTML element with local name tag name, remove the first member
			// from node list and append it to sublist."
			while (nodeList.length
			&& nodeList[0] == sublist[sublist.length - 1].nextSibling
			&& !isHtmlElement(nodeList[0], tagName)) {
				sublist.push(nodeList.shift());
			}

			// "Record the values of sublist, and let values be the result."
			var values = recordValues(sublist);

			// "Split the parent of sublist."
			splitParent(sublist, range);

			// "Fix disallowed ancestors of each member of sublist."
			for (var i = 0; i < sublist.length; i++) {
				fixDisallowedAncestors(sublist[i], range);
			}

			// "Restore the values from values."
			restoreValues(values, range);
		}

	// "Otherwise, while node list is not empty:"
	} else {
		while (nodeList.length) {
			// "Let sublist be an empty list of nodes."
			var sublist = [];

			// "While either sublist is empty, or node list is not empty and
			// its first member is the nextSibling of sublist's last member:"
			while (!sublist.length
			|| (nodeList.length
			&& nodeList[0] == sublist[sublist.length - 1].nextSibling)) {
				// "If node list's first member is a p or div, set the tag name
				// of node list's first member to "li", and append the result
				// to sublist. Remove the first member from node list."
				if (isHtmlElement(nodeList[0], ["p", "div"])) {
					sublist.push(setTagName(nodeList[0], "li", range));
					nodeList.shift();

				// "Otherwise, if the first member of node list is an li or ol
				// or ul, remove it from node list and append it to sublist."
				} else if (isHtmlElement(nodeList[0], ["li", "ol", "ul"])) {
					sublist.push(nodeList.shift());

				// "Otherwise:"
				} else {
					// "Let nodes to wrap be a list of nodes, initially empty."
					var nodesToWrap = [];

					// "While nodes to wrap is empty, or node list is not empty
					// and its first member is the nextSibling of nodes to
					// wrap's last member and the first member of node list is
					// an inline node and the last member of nodes to wrap is
					// an inline node other than a br, remove the first member
					// from node list and append it to nodes to wrap."
					while (!nodesToWrap.length
					|| (nodeList.length
					&& nodeList[0] == nodesToWrap[nodesToWrap.length - 1].nextSibling
					&& isInlineNode(nodeList[0])
					&& isInlineNode(nodesToWrap[nodesToWrap.length - 1])
					&& !isHtmlElement(nodesToWrap[nodesToWrap.length - 1], "br"))) {
						nodesToWrap.push(nodeList.shift());
					}

					// "Wrap nodes to wrap, with new parent instructions
					// returning the result of calling createElement("li") on
					// the context object. Append the result to sublist."
					sublist.push(
						wrap(nodesToWrap,
							undefined,
							function() { return document.createElement("li") },
							range
						)
					);
				}
			}

			// "If sublist's first member's parent is an HTML element with
			// local name tag name, or if every member of sublist is an ol or
			// ul, continue this loop from the beginning."
			if (isHtmlElement(sublist[0].parentNode, tagName)
			|| $_(sublist).every(function(node) { return isHtmlElement(node, ["ol", "ul"]) })) {
				continue;
			}

			// "If sublist's first member's parent is an HTML element with
			// local name other tag name:"
			if (isHtmlElement(sublist[0].parentNode, otherTagName)) {
				// "Record the values of sublist, and let values be the
				// result."
				var values = recordValues(sublist);

				// "Split the parent of sublist."
				splitParent(sublist, range);

				// "Wrap sublist, with sibling criteria returning true for an
				// HTML element with local name tag name and false otherwise,
				// and new parent instructions returning the result of calling
				// createElement(tag name) on the context object."
				wrap(sublist,
					function(node) { return isHtmlElement(node, tagName) },
					function() { return document.createElement(tagName) },
					range
				);

				// "Restore the values from values."
				restoreValues(values, range);

				// "Continue this loop from the beginning."
				continue;
			}

			// "Wrap sublist, with sibling criteria returning true for an HTML
			// element with local name tag name and false otherwise, and new
			// parent instructions being the following:"
			// . . .
			// "Fix disallowed ancestors of the previous step's result."
			fixDisallowedAncestors(
				wrap(sublist,
					function(node) { return isHtmlElement(node, tagName) },
					function() {
						// "If sublist's first member's parent is not an editable
						// simple indentation element, or sublist's first member's
						// parent's previousSibling is not an editable HTML element
						// with local name tag name, call createElement(tag name)
						// on the context object and return the result."
						if (!isEditable(sublist[0].parentNode)
						|| !isSimpleIndentationElement(sublist[0].parentNode)
						|| !isEditable(sublist[0].parentNode.previousSibling)
						|| !isHtmlElement(sublist[0].parentNode.previousSibling, tagName)) {
							return document.createElement(tagName);
						}
	
						// "Let list be sublist's first member's parent's
						// previousSibling."
						var list = sublist[0].parentNode.previousSibling;
	
						// "Normalize sublists of list's lastChild."
						normalizeSublists(list.lastChild, range);
	
						// "If list's lastChild is not an editable HTML element
						// with local name tag name, call createElement(tag name)
						// on the context object, and append the result as the last
						// child of list."
						if (!isEditable(list.lastChild)
						|| !isHtmlElement(list.lastChild, tagName)) {
							list.appendChild(document.createElement(tagName));
						}
	
						// "Return the last child of list."
						return list.lastChild;
					},
					range
				)
				, range
			);
		}
	}
}


//@}
///// Justifying the selection /////
//@{

function justifySelection(alignment, range) {
	
	// "Block-extend the active range, and let new range be the result."
	var newRange = blockExtend(range);

	// "Let element list be a list of all editable Elements contained in new
	// range that either has an attribute in the HTML namespace whose local
	// name is "align", or has a style attribute that sets "text-align", or is
	// a center."
	var elementList = getAllContainedNodes(newRange, function(node) {
		return node.nodeType == $_.Node.ELEMENT_NODE
			&& isEditable(node)
			// Ignoring namespaces here
			&& (
				$_( node ).hasAttribute("align")
				|| node.style.textAlign != ""
				|| isHtmlElement(node, "center")
			);
	});

	// "For each element in element list:"
	for (var i = 0; i < elementList.length; i++) {
		var element = elementList[i];

		// "If element has an attribute in the HTML namespace whose local name
		// is "align", remove that attribute."
		element.removeAttribute("align");

		// "Unset the CSS property "text-align" on element, if it's set by a
		// style attribute."
		element.style.textAlign = "";
		if (element.getAttribute("style") == "") {
			element.removeAttribute("style");
		}

		// "If element is a div or span or center with no attributes, remove
		// it, preserving its descendants."
		if (isHtmlElement(element, ["div", "span", "center"])
		&& !element.attributes.length) {
			removePreservingDescendants(element, range);
		}

		// "If element is a center with one or more attributes, set the tag
		// name of element to "div"."
		if (isHtmlElement(element, "center")
		&& element.attributes.length) {
			setTagName(element, "div", range);
		}
	}

	// "Block-extend the active range, and let new range be the result."
	newRange = blockExtend(globalRange);

	// "Let node list be a list of nodes, initially empty."
	var nodeList = [];

	// "For each node node contained in new range, append node to node list if
	// the last member of node list (if any) is not an ancestor of node; node
	// is editable; node is an allowed child of "div"; and node's alignment
	// value is not alignment."
	nodeList = getContainedNodes(newRange, function(node) {
		return isEditable(node)
			&& isAllowedChild(node, "div")
			&& getAlignmentValue(node) != alignment;
	});

	// "While node list is not empty:"
	while (nodeList.length) {
		// "Let sublist be a list of nodes, initially empty."
		var sublist = [];

		// "Remove the first member of node list and append it to sublist."
		sublist.push(nodeList.shift());

		// "While node list is not empty, and the first member of node list is
		// the nextSibling of the last member of sublist, remove the first
		// member of node list and append it to sublist."
		while (nodeList.length
		&& nodeList[0] == sublist[sublist.length - 1].nextSibling) {
			sublist.push(nodeList.shift());
		}

		// "Wrap sublist. Sibling criteria returns true for any div that has
		// one or both of the following two attributes and no other attributes,
		// and false otherwise:"
		//
		//   * "An align attribute whose value is an ASCII case-insensitive
		//     match for alignment.
		//   * "A style attribute which sets exactly one CSS property
		//     (including unrecognized or invalid attributes), which is
		//     "text-align", which is set to alignment.
		//
		// "New parent instructions are to call createElement("div") on the
		// context object, then set its CSS property "text-align" to alignment
		// and return the result."
		wrap(sublist,
			function(node) {
				return isHtmlElement(node, "div")
					&& $_(node.attributes).every(function(attr) {
						return (attr.name == "align" && attr.value.toLowerCase() == alignment)
							|| (attr.name == "style" && getStyleLength(node) == 1 && node.style.textAlign == alignment);
					});
			},
			function() {
				var newParent = document.createElement("div");
				newParent.setAttribute("style", "text-align: " + alignment);
				return newParent;
			},
			range
		);
	}
}


//@}
///// Create an end break /////
//@{
function createEndBreak() {
	var endBr = document.createElement("br");
	endBr.setAttribute("class", "aloha-end-br");
	return endBr;
}


//@}
///// The delete command /////
//@{
commands["delete"] = {
	action: function(value, range) {
		// "If the active range is not collapsed, delete the contents of the
		// active range and abort these steps."
		if (!range.collapsed) {
			deleteContents(range);
			return;
		}

		// "Canonicalize whitespace at (active range's start node, active
		// range's start offset)."
		canonicalizeWhitespace(range.startContainer, range.startOffset);

		// "Let node and offset be the active range's start node and offset."
		var node = range.startContainer;
		var offset = range.startOffset;
		var isBr = false;
		var isHr = false;

		// "Repeat the following steps:"
		while ( true ) {
			// we need to reset isBr and isHr on every interation of the loop
			if ( offset > 0 ) {
				isBr = isHtmlElement(node.childNodes[offset - 1], "br") || false;
				isHr = isHtmlElement(node.childNodes[offset - 1], "hr") || false;
			}

			// "If offset is zero and node's previousSibling is an editable
			// invisible node, remove node's previousSibling from its parent."
			if (offset == 0
			&& isEditable(node.previousSibling)
			&& isInvisible(node.previousSibling)) {
				node.parentNode.removeChild(node.previousSibling);

			// "Otherwise, if node has a child with index offset − 1 and that
			// child is an editable invisible node, remove that child from
			// node, then subtract one from offset."
			} else if (0 <= offset - 1
			&& offset - 1 < node.childNodes.length
			&& isEditable(node.childNodes[offset - 1])
			&& (isInvisible(node.childNodes[offset - 1]) || isBr || isHr )) {
				node.removeChild(node.childNodes[offset - 1]);
				offset--;
				if (isBr || isHr) {
					range.setStart(node, offset);
					range.setEnd(node, offset);
					return;
				}

			// "Otherwise, if offset is zero and node is an inline node, or if
			// node is an invisible node, set offset to the index of node, then
			// set node to its parent."
			} else if ((offset == 0
			&& isInlineNode(node))
			|| isInvisible(node)) {
				offset = getNodeIndex(node);
				node = node.parentNode;

			// "Otherwise, if node has a child with index offset − 1 and that
			// child is an editable a, remove that child from node, preserving
			// its descendants. Then abort these steps."
			} else if (0 <= offset - 1
			&& offset - 1 < node.childNodes.length
			&& isEditable(node.childNodes[offset - 1])
			&& isHtmlElement(node.childNodes[offset - 1], "a")) {
				removePreservingDescendants(node.childNodes[offset - 1], range);
				return;

			// "Otherwise, if node has a child with index offset − 1 and that
			// child is not a block node or a br or an img, set node to that
			// child, then set offset to the length of node."
			} else if (0 <= offset - 1
			&& offset - 1 < node.childNodes.length
			&& !isBlockNode(node.childNodes[offset - 1])
			&& !isHtmlElement(node.childNodes[offset - 1], ["br", "img"])) {
				node = node.childNodes[offset - 1];
				offset = getNodeLength(node);

			// "Otherwise, break from this loop."
			} else {
				break;
			}
		}

		// collapse whitespace sequences
		collapseWhitespace(node, range);
		offset = range.startOffset;

		// "If node is a Text node and offset is not zero, call collapse(node,
		// offset) on the Selection. Then delete the contents of the range with
		// start (node, offset − 1) and end (node, offset) and abort these
		// steps."
		if (node.nodeType == $_.Node.TEXT_NODE
		&& offset != 0) {
			range.setStart(node, offset);
			range.setEnd(node, offset);
			// fix range start container offset according to old code
			// so we can still pass our range and have it modified, but
			// also conform with the previous implementation
			range.startOffset -= 1;
			deleteContents(range);
			return;
		}

		// "If node is an inline node, abort these steps."
		if (isInlineNode(node)) {
			return;
		}

		// "If node has a child with index offset − 1 and that child is a br or
		// hr or img, call collapse(node, offset) on the Selection. Then delete
		// the contents of the range with start (node, offset − 1) and end
		// (node, offset) and abort these steps."
		if (0 <= offset - 1
		&& offset - 1 < node.childNodes.length
		&& isHtmlElement(node.childNodes[offset - 1], ["br", "hr", "img"])) {
			range.setStart(node, offset);
			range.setEnd(node, offset);
			deleteContents(range);
			return;
		}

		// "If node is an li or dt or dd and is the first child of its parent,
		// and offset is zero:"
		if (isHtmlElement(node, ["li", "dt", "dd"])
		&& node == node.parentNode.firstChild
		&& offset == 0) {
			// "Let items be a list of all lis that are ancestors of node."
			//
			// Remember, must be in tree order.
			var items = [];
			for (var ancestor = node.parentNode; ancestor; ancestor = ancestor.parentNode) {
				if (isHtmlElement(ancestor, "li")) {
					items.unshift(ancestor);
				}
			}

			// "Normalize sublists of each item in items."
			for (var i = 0; i < items.length; i++) {
				normalizeSublists(items[i], range);
			}

			// "Record the values of the one-node list consisting of node, and
			// let values be the result."
			var values = recordValues([node]);

			// "Split the parent of the one-node list consisting of node."
			splitParent([node], range);

			// "Restore the values from values."
			restoreValues(values, range);

			// "If node is a dd or dt, and it is not an allowed child of any of
			// its ancestors in the same editing host, set the tag name of node
			// to the default single-line container name and let node be the
			// result."
			if (isHtmlElement(node, ["dd", "dt"])
			&& $_(getAncestors(node)).every(function(ancestor) {
				return !inSameEditingHost(node, ancestor)
					|| !isAllowedChild(node, ancestor)
			})) {
				node = setTagName(node, defaultSingleLineContainerName, range);
			}

			// "Fix disallowed ancestors of node."
			fixDisallowedAncestors(node, range);

			// fix the lists to be html5 conformant
			for (var i = 0; i < items.length; i++) {
				unNormalizeSublists(items[i].parentNode, range);
			}

			// "Abort these steps."
			return;
		}

		// "Let start node equal node and let start offset equal offset."
		var startNode = node;
		var startOffset = offset;

		// "Repeat the following steps:"
		while (true) {
			// "If start offset is zero, set start offset to the index of start
			// node and then set start node to its parent."
			if (startOffset == 0) {
				startOffset = getNodeIndex(startNode);
				startNode = startNode.parentNode;

			// "Otherwise, if start node has an editable invisible child with
			// index start offset minus one, remove it from start node and
			// subtract one from start offset."
			} else if (0 <= startOffset - 1
			&& startOffset - 1 < startNode.childNodes.length
			&& isEditable(startNode.childNodes[startOffset - 1])
			&& isInvisible(startNode.childNodes[startOffset - 1])) {
				startNode.removeChild(startNode.childNodes[startOffset - 1]);
				startOffset--;

			// "Otherwise, break from this loop."
			} else {
				break;
			}
		}

		// "If offset is zero, and node has an editable ancestor container in
		// the same editing host that's an indentation element:"
		if (offset == 0
		&& $_( getAncestors(node).concat(node) ).filter(function(ancestor) {
			return isEditable(ancestor)
				&& inSameEditingHost(ancestor, node)
				&& isIndentationElement(ancestor);
		}).length) {
			// "Block-extend the range whose start and end are both (node, 0),
			// and let new range be the result."
			var newRange = Aloha.createRange();
			newRange.setStart(node, 0);
			newRange.setEnd(node, 0);
			newRange = blockExtend(newRange);

			// "Let node list be a list of nodes, initially empty."
			//
			// "For each node current node contained in new range, append
			// current node to node list if the last member of node list (if
			// any) is not an ancestor of current node, and current node is
			// editable but has no editable descendants."
			var nodeList = getContainedNodes(newRange, function(currentNode) {
				return isEditable(currentNode)
					&& !hasEditableDescendants(currentNode);
			});

			// "Outdent each node in node list."
			for (var i = 0; i < nodeList.length; i++) {
				outdentNode(nodeList[i], range);
			}

			// "Abort these steps."
			return;
		}

		// "If the child of start node with index start offset is a table,
		// abort these steps."
		if (isHtmlElement(startNode.childNodes[startOffset], "table")) {
			return;
		}

		// "If start node has a child with index start offset − 1, and that
		// child is a table:"
		if (0 <= startOffset - 1
		&& startOffset - 1 < startNode.childNodes.length
		&& isHtmlElement(startNode.childNodes[startOffset - 1], "table")) {
			// "Call collapse(start node, start offset − 1) on the context
			// object's Selection."
			range.setStart(startNode, startOffset - 1);

			// "Call extend(start node, start offset) on the context object's
			// Selection."
			range.setEnd(startNode, startOffset);

			// "Abort these steps."
			return;
		}

		// "If offset is zero; and either the child of start node with index
		// start offset minus one is an hr, or the child is a br whose
		// previousSibling is either a br or not an inline node:"
		if (offset == 0
		&& (isHtmlElement(startNode.childNodes[startOffset - 1], "hr")
			|| (
				isHtmlElement(startNode.childNodes[startOffset - 1], "br")
				&& (
					isHtmlElement(startNode.childNodes[startOffset - 1].previousSibling, "br")
					|| !isInlineNode(startNode.childNodes[startOffset - 1].previousSibling)
				)
			)
		)) {
			// "Call collapse(node, offset) on the Selection."
			range.setStart(node, offset);
			range.setEnd(node, offset);

			// "Delete the contents of the range with start (start node, start
			// offset − 1) and end (start node, start offset)."
			deleteContents(startNode, startOffset - 1, startNode, startOffset);

			// "Abort these steps."
			return;
		}

		// "If the child of start node with index start offset is an li or dt
		// or dd, and that child's firstChild is an inline node, and start
		// offset is not zero:"
		if (isHtmlElement(startNode.childNodes[startOffset], ["li", "dt", "dd"])
		&& isInlineNode(startNode.childNodes[startOffset].firstChild)
		&& startOffset != 0) {
			// "Let previous item be the child of start node with index start
			// offset minus one."
			var previousItem = startNode.childNodes[startOffset - 1];

			// "If previous item's lastChild is an inline node other than a br,
			// call createElement("br") on the context object and append the
			// result as the last child of previous item."
			if (isInlineNode(previousItem.lastChild)
			&& !isHtmlElement(previousItem.lastChild, "br")) {
				previousItem.appendChild(document.createElement("br"));
			}

			// "If previous item's lastChild is an inline node, call
			// createElement("br") on the context object and append the result
			// as the last child of previous item."
			if (isInlineNode(previousItem.lastChild)) {
				previousItem.appendChild(document.createElement("br"));
			}
		}

		// "If the child of start node with index start offset is an li or dt
		// or dd, and its previousSibling is also an li or dt or dd, set start
		// node to its child with index start offset − 1, then set start offset
		// to start node's length, then set node to start node's nextSibling,
		// then set offset to 0."
		if (isHtmlElement(startNode.childNodes[startOffset], ["li", "dt", "dd"])
		&& isHtmlElement(startNode.childNodes[startOffset - 1], ["li", "dt", "dd"])) {
			startNode = startNode.childNodes[startOffset - 1];
			startOffset = getNodeLength(startNode);
			node = startNode.nextSibling;
			offset = 0;

		// "Otherwise, while start node has a child with index start offset
		// minus one:"
		} else {
			while (0 <= startOffset - 1
			&& startOffset - 1 < startNode.childNodes.length) {
				// "If start node's child with index start offset minus one is
				// editable and invisible, remove it from start node, then
				// subtract one from start offset."
				if (isEditable(startNode.childNodes[startOffset - 1])
				&& isInvisible(startNode.childNodes[startOffset - 1])) {
					startNode.removeChild(startNode.childNodes[startOffset - 1]);
					startOffset--;

				// "Otherwise, set start node to its child with index start
				// offset minus one, then set start offset to the length of
				// start node."
				} else {
					startNode = startNode.childNodes[startOffset - 1];
					startOffset = getNodeLength(startNode);
				}
			}
		}

		// "Delete the contents of the range with start (start node, start
		// offset) and end (node, offset)."
		var delRange = Aloha.createRange();
		delRange.setStart(startNode, startOffset);
		delRange.setEnd(node, offset);
		deleteContents(delRange);

		if (!isAncestorContainer(document.body, range.startContainer)) {
			if (delRange.startContainer.hasChildNodes() || delRange.startContainer.nodeType == $_.Node.TEXT_NODE) {
				range.setStart(delRange.startContainer, delRange.startOffset);
				range.setEnd(delRange.startContainer, delRange.startOffset);
			} else {
				range.setStart(delRange.startContainer.parentNode, getNodeIndex(delRange.startContainer));
				range.setEnd(delRange.startContainer.parentNode, getNodeIndex(delRange.startContainer));
			}
		}
	}
};

//@}
///// The formatBlock command /////
//@{
// "A formattable block name is "address", "dd", "div", "dt", "h1", "h2", "h3",
// "h4", "h5", "h6", "p", or "pre"."
var formattableBlockNames = ["address", "dd", "div", "dt", "h1", "h2", "h3",
	"h4", "h5", "h6", "p", "pre"];

commands.formatblock = {
	action: function(value) {
		// "If value begins with a "<" character and ends with a ">" character,
		// remove the first and last characters from it."
		if (/^<.*>$/.test(value)) {
			value = value.slice(1, -1);
		}

		// "Let value be converted to ASCII lowercase."
		value = value.toLowerCase();

		// "If value is not a formattable block name, abort these steps and do
		// nothing."
		if ($_(formattableBlockNames).indexOf(value) == -1) {
			return;
		}

		// "Block-extend the active range, and let new range be the result."
		var newRange = blockExtend(getActiveRange());

		// "Let node list be an empty list of nodes."
		//
		// "For each node node contained in new range, append node to node list
		// if it is editable, the last member of original node list (if any) is
		// not an ancestor of node, node is either a non-list single-line
		// container or an allowed child of "p" or a dd or dt, and node is not
		// the ancestor of a prohibited paragraph child."
		var nodeList = getContainedNodes(newRange, function(node) {
			return isEditable(node)
				&& (isNonListSingleLineContainer(node)
				|| isAllowedChild(node, "p")
				|| isHtmlElement(node, ["dd", "dt"]))
				&& !$_( getDescendants(node) ).some(isProhibitedParagraphChild);
		});

		// "Record the values of node list, and let values be the result."
		var values = recordValues(nodeList);

		// "For each node in node list, while node is the descendant of an
		// editable HTML element in the same editing host, whose local name is
		// a formattable block name, and which is not the ancestor of a
		// prohibited paragraph child, split the parent of the one-node list
		// consisting of node."
		for (var i = 0; i < nodeList.length; i++) {
			var node = nodeList[i];
			while ($_( getAncestors(node) ).some(function(ancestor) {
				return isEditable(ancestor)
					&& inSameEditingHost(ancestor, node)
					&& isHtmlElement(ancestor, formattableBlockNames)
					&& !$_( getDescendants(ancestor) ).some(isProhibitedParagraphChild);
			})) {
				splitParent([node], range);
			}
		}

		// "Restore the values from values."
		restoreValues(values, range);

		// "While node list is not empty:"
		while (nodeList.length) {
			var sublist;

			// "If the first member of node list is a single-line
			// container:"
			if (isSingleLineContainer(nodeList[0])) {
				// "Let sublist be the children of the first member of node
				// list."
				sublist = [].slice.call(toArray(nodeList[0].childNodes));

				// "Record the values of sublist, and let values be the
				// result."
				var values = recordValues(sublist);

				// "Remove the first member of node list from its parent,
				// preserving its descendants."
				removePreservingDescendants(nodeList[0], range);

				// "Restore the values from values."
				restoreValues(values, range);

				// "Remove the first member from node list."
				nodeList.shift();

			// "Otherwise:"
			} else {
				// "Let sublist be an empty list of nodes."
				sublist = [];

				// "Remove the first member of node list and append it to
				// sublist."
				sublist.push(nodeList.shift());

				// "While node list is not empty, and the first member of
				// node list is the nextSibling of the last member of
				// sublist, and the first member of node list is not a
				// single-line container, and the last member of sublist is
				// not a br, remove the first member of node list and
				// append it to sublist."
				while (nodeList.length
				&& nodeList[0] == sublist[sublist.length - 1].nextSibling
				&& !isSingleLineContainer(nodeList[0])
				&& !isHtmlElement(sublist[sublist.length - 1], "BR")) {
					sublist.push(nodeList.shift());
				}
			}

			// "Wrap sublist. If value is "div" or "p", sibling criteria
			// returns false; otherwise it returns true for an HTML element
			// with local name value and no attributes, and false otherwise.
			// New parent instructions return the result of running
			// createElement(value) on the context object. Then fix disallowed
			// ancestors of the result."
			fixDisallowedAncestors(
				wrap(sublist,
					$_(["div", "p"]).indexOf(value) == - 1
						? function(node) { return isHtmlElement(node, value) && !node.attributes.length }
						: function() { return false },
					function() { return document.createElement(value) },
					range
				),
				range
			);
		}
	}, indeterm: function() {
		// "Block-extend the active range, and let new range be the result."
		var newRange = blockExtend(getActiveRange());

		// "Let node list be all visible editable nodes that are contained in
		// new range and have no children."
		var nodeList = getAllContainedNodes(newRange, function(node) {
			return isVisible(node)
				&& isEditable(node)
				&& !node.hasChildNodes();
		});

		// "If node list is empty, return false."
		if (!nodeList.length) {
			return false;
		}

		// "Let type be null."
		var type = null;

		// "For each node in node list:"
		for (var i = 0; i < nodeList.length; i++) {
			var node = nodeList[i];

			// "While node's parent is editable and in the same editing host as
			// node, and node is not an HTML element whose local name is a
			// formattable block name, set node to its parent."
			while (isEditable(node.parentNode)
			&& inSameEditingHost(node, node.parentNode)
			&& !isHtmlElement(node, formattableBlockNames)) {
				node = node.parentNode;
			}

			// "Let current type be the empty string."
			var currentType = "";

			// "If node is an editable HTML element whose local name is a
			// formattable block name, and node is not the ancestor of a
			// prohibited paragraph child, set current type to node's local
			// name."
			if (isEditable(node)
			&& isHtmlElement(node, formattableBlockNames)
			&& !$_( getDescendants(node) ).some(isProhibitedParagraphChild)) {
				currentType = node.tagName;
			}

			// "If type is null, set type to current type."
			if (type === null) {
				type = currentType;

			// "Otherwise, if type does not equal current type, return true."
			} else if (type != currentType) {
				return true;
			}
		}

		// "Return false."
		return false;
	}, value: function() {
		// "Block-extend the active range, and let new range be the result."
		var newRange = blockExtend(getActiveRange());

		// "Let node be the first visible editable node that is contained in
		// new range and has no children. If there is no such node, return the
		// empty string."
		var nodes = getAllContainedNodes(newRange, function(node) {
			return isVisible(node)
				&& isEditable(node)
				&& !node.hasChildNodes();
		});
		if (!nodes.length) {
			return "";
		}
		var node = nodes[0];

		// "While node's parent is editable and in the same editing host as
		// node, and node is not an HTML element whose local name is a
		// formattable block name, set node to its parent."
		while (isEditable(node.parentNode)
		&& inSameEditingHost(node, node.parentNode)
		&& !isHtmlElement(node, formattableBlockNames)) {
			node = node.parentNode;
		}

		// "If node is an editable HTML element whose local name is a
		// formattable block name, and node is not the ancestor of a prohibited
		// paragraph child, return node's local name, converted to ASCII
		// lowercase."
		if (isEditable(node)
		&& isHtmlElement(node, formattableBlockNames)
		&& !$_( getDescendants(node) ).some(isProhibitedParagraphChild)) {
			return node.tagName.toLowerCase();
		}

		// "Return the empty string."
		return "";
	}
};

//@}
///// The forwardDelete command /////
//@{
commands.forwarddelete = {
	action: function(value, range) {
	
		// "If the active range is not collapsed, delete the contents of the
		// active range and abort these steps."
		if (!range.collapsed) {
			deleteContents(range);
			return;
		}

		// "Canonicalize whitespace at (active range's start node, active
		// range's start offset)."
		canonicalizeWhitespace(range.startContainer, range.startOffset);

		// "Let node and offset be the active range's start node and offset."
		var node = range.startContainer;
		var offset = range.startOffset;
		var isBr = false;
		var isHr = false;

		// "Repeat the following steps:"
		while (true) {
			// check whether the next element is a br or hr
			if ( offset < node.childNodes.length ) {
				isBr = isHtmlElement(node.childNodes[offset], "br") || false;
				isHr = isHtmlElement(node.childNodes[offset], "hr") || false;
			}

			// "If offset is the length of node and node's nextSibling is an
			// editable invisible node, remove node's nextSibling from its
			// parent."
			if (offset == getNodeLength(node)
			&& isEditable(node.nextSibling)
			&& isInvisible(node.nextSibling)) {
				node.parentNode.removeChild(node.nextSibling);

			// "Otherwise, if node has a child with index offset and that child
			// is an editable invisible node, remove that child from node."
			} else if (offset < node.childNodes.length
			&& isEditable(node.childNodes[offset])
			&& (isInvisible(node.childNodes[offset]) || isBr || isHr )) {
				node.removeChild(node.childNodes[offset]);
				if (isBr || isHr) {
					range.setStart(node, offset);
					range.setEnd(node, offset);
					return;
				}

			// "Otherwise, if node has a child with index offset and that child
			// is a collapsed block prop, add one to offset."
			} else if (offset < node.childNodes.length
			&& isCollapsedBlockProp(node.childNodes[offset])) {
				offset++;

			// "Otherwise, if offset is the length of node and node is an
			// inline node, or if node is invisible, set offset to one plus the
			// index of node, then set node to its parent."
			} else if ((offset == getNodeLength(node)
			&& isInlineNode(node))
			|| isInvisible(node)) {
				offset = 1 + getNodeIndex(node);
				node = node.parentNode;

			// "Otherwise, if node has a child with index offset and that child
			// is not a block node or a br or an img, set node to that child,
			// then set offset to zero."
			} else if (offset < node.childNodes.length
			&& !isBlockNode(node.childNodes[offset])
			&& !isHtmlElement(node.childNodes[offset], ["br", "img"])) {
				node = node.childNodes[offset];
				offset = 0;

			// "Otherwise, break from this loop."
			} else {
				break;
			}
		}

		// collapse whitespace in the node, if it is a text node
		collapseWhitespace(node, range);
		offset = range.startOffset;

		// "If node is a Text node and offset is not node's length:"
		if (node.nodeType == $_.Node.TEXT_NODE
		&& offset != getNodeLength(node)) {
			// "Call collapse(node, offset) on the Selection."
			range.setStart(node, offset);
			range.setEnd(node, offset);

			// "Let end offset be offset plus one."
			var endOffset = offset + 1;

			// "While end offset is not node's length and the end offsetth
			// element of node's data has general category M when interpreted
			// as a Unicode code point, add one to end offset."
			//
			// TODO: Not even going to try handling anything beyond the most
			// basic combining marks, since I couldn't find a good list.  I
			// special-case a few Hebrew diacritics too to test basic coverage
			// of non-Latin stuff.
			while (endOffset != node.length
			&& /^[\u0300-\u036f\u0591-\u05bd\u05c1\u05c2]$/.test(node.data[endOffset])) {
				endOffset++;
			}

			// "Delete the contents of the range with start (node, offset) and
			// end (node, end offset)."
			deleteContents(node, offset, node, endOffset);

			// "Abort these steps."
			return;
		}

		// "If node is an inline node, abort these steps."
		if (isInlineNode(node)) {
			return;
		}

		// "If node has a child with index offset and that child is a br or hr
		// or img, call collapse(node, offset) on the Selection. Then delete
		// the contents of the range with start (node, offset) and end (node,
		// offset + 1) and abort these steps."
		if (offset < node.childNodes.length
		&& isHtmlElement(node.childNodes[offset], ["br", "hr", "img"])) {
			range.setStart(node, offset);
			range.setEnd(node, offset);
			deleteContents(node, offset, node, offset + 1);
			return;
		}

		// "Let end node equal node and let end offset equal offset."
		var endNode = node;
		var endOffset = offset;

		// "Repeat the following steps:"
		while (true) {
			// "If end offset is the length of end node, set end offset to one
			// plus the index of end node and then set end node to its parent."
			if (endOffset == getNodeLength(endNode)) {
				endOffset = 1 + getNodeIndex(endNode);
				endNode = endNode.parentNode;

			// "Otherwise, if end node has a an editable invisible child with
			// index end offset, remove it from end node."
			} else if (endOffset < endNode.childNodes.length
			&& isEditable(endNode.childNodes[endOffset])
			&& isInvisible(endNode.childNodes[endOffset])) {
				endNode.removeChild(endNode.childNodes[endOffset]);

			// "Otherwise, break from this loop."
			} else {
				break;
			}
		}

		// "If the child of end node with index end offset minus one is a
		// table, abort these steps."
		if (isHtmlElement(endNode.childNodes[endOffset - 1], "table")) {
			return;
		}

		// "If the child of end node with index end offset is a table:"
		if (isHtmlElement(endNode.childNodes[endOffset], "table")) {
			// "Call collapse(end node, end offset) on the context object's
			// Selection."
			range.setStart(endNode, endOffset);

			// "Call extend(end node, end offset + 1) on the context object's
			// Selection."
			range.setEnd(endNode, endOffset + 1);

			// "Abort these steps."
			return;
		}

		// "If offset is the length of node, and the child of end node with
		// index end offset is an hr or br:"
		if (offset == getNodeLength(node)
		&& isHtmlElement(endNode.childNodes[endOffset], ["br", "hr"])) {
			// "Call collapse(node, offset) on the Selection."
			range.setStart(node, offset);
			range.setEnd(node, offset);

			// "Delete the contents of the range with end (end node, end
			// offset) and end (end node, end offset + 1)."
			deleteContents(endNode, endOffset, endNode, endOffset + 1);

			// "Abort these steps."
			return;
		}

		// "While end node has a child with index end offset:"
		while (endOffset < endNode.childNodes.length) {
			// "If end node's child with index end offset is editable and
			// invisible, remove it from end node."
			if (isEditable(endNode.childNodes[endOffset])
			&& isInvisible(endNode.childNodes[endOffset])) {
				endNode.removeChild(endNode.childNodes[endOffset]);

			// "Otherwise, set end node to its child with index end offset and
			// set end offset to zero."
			} else {
				endNode = endNode.childNodes[endOffset];
				endOffset = 0;
			}
		}

		// "Delete the contents of the range with start (node, offset) and end
		// (end node, end offset)."
		deleteContents(node, offset, endNode, endOffset);
	}
};

//@}
///// The indent command /////
//@{
commands.indent = {
	action: function() {
		// "Let items be a list of all lis that are ancestor containers of the
		// active range's start and/or end node."
		//
		// Has to be in tree order, remember!
		var items = [];
		for (var node = getActiveRange().endContainer; node != getActiveRange().commonAncestorContainer; node = node.parentNode) {
			if (isHtmlElement(node, "LI")) {
				items.unshift(node);
			}
		}
		for (var node = getActiveRange().startContainer; node != getActiveRange().commonAncestorContainer; node = node.parentNode) {
			if (isHtmlElement(node, "LI")) {
				items.unshift(node);
			}
		}
		for (var node = getActiveRange().commonAncestorContainer; node; node = node.parentNode) {
			if (isHtmlElement(node, "LI")) {
				items.unshift(node);
			}
		}

		// "For each item in items, normalize sublists of item."
		for (var i = 0; i < items.length; i++) {
			normalizeSublists(items[i, range]);
		}

		// "Block-extend the active range, and let new range be the result."
		var newRange = blockExtend(getActiveRange());

		// "Let node list be a list of nodes, initially empty."
		var nodeList = [];

		// "For each node node contained in new range, if node is editable and
		// is an allowed child of "div" or "ol" and if the last member of node
		// list (if any) is not an ancestor of node, append node to node list."
		nodeList = getContainedNodes(newRange, function(node) {
			return isEditable(node)
				&& (isAllowedChild(node, "div")
				|| isAllowedChild(node, "ol"));
		});

		// "If the first member of node list is an li whose parent is an ol or
		// ul, and its previousSibling is an li as well, normalize sublists of
		// its previousSibling."
		if (nodeList.length
		&& isHtmlElement(nodeList[0], "LI")
		&& isHtmlElement(nodeList[0].parentNode, ["OL", "UL"])
		&& isHtmlElement(nodeList[0].previousSibling, "LI")) {
			normalizeSublists(nodeList[0].previousSibling, range);
		}

		// "While node list is not empty:"
		while (nodeList.length) {
			// "Let sublist be a list of nodes, initially empty."
			var sublist = [];

			// "Remove the first member of node list and append it to sublist."
			sublist.push(nodeList.shift());

			// "While the first member of node list is the nextSibling of the
			// last member of sublist, remove the first member of node list and
			// append it to sublist."
			while (nodeList.length
			&& nodeList[0] == sublist[sublist.length - 1].nextSibling) {
				sublist.push(nodeList.shift());
			}

			// "Indent sublist."
			indentNodes(sublist, range);
		}
	}
};

//@}
///// The insertHorizontalRule command /////
//@{
commands.inserthorizontalrule = {
	action: function(value, range) {
		
		// "While range's start offset is 0 and its start node's parent is not
		// null, set range's start to (parent of start node, index of start
		// node)."
		while (range.startOffset == 0
		&& range.startContainer.parentNode) {
			range.setStart(range.startContainer.parentNode, getNodeIndex(range.startContainer));
		}

		// "While range's end offset is the length of its end node, and its end
		// node's parent is not null, set range's end to (parent of end node, 1
		// + index of start node)."
		while (range.endOffset == getNodeLength(range.endContainer)
		&& range.endContainer.parentNode) {
			range.setEnd(range.endContainer.parentNode, 1 + getNodeIndex(range.endContainer));
		}

		// "Delete the contents of range, with block merging false."
		deleteContents(range, {blockMerging: false});

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(getActiveRange().startContainer)
		&& !isEditingHost(getActiveRange().startContainer)) {
			return;
		}

		// "If the active range's start node is a Text node and its start
		// offset is zero, set the active range's start and end to (parent of
		// start node, index of start node)."
		if (getActiveRange().startContainer.nodeType == $_.Node.TEXT_NODE
		&& getActiveRange().startOffset == 0) {
			getActiveRange().setStart(getActiveRange().startContainer.parentNode, getNodeIndex(getActiveRange().startContainer));
			getActiveRange().collapse(true);
		}

		// "If the active range's start node is a Text node and its start
		// offset is the length of its start node, set the active range's start
		// and end to (parent of start node, 1 + index of start node)."
		if (getActiveRange().startContainer.nodeType == $_.Node.TEXT_NODE
		&& getActiveRange().startOffset == getNodeLength(getActiveRange().startContainer)) {
			getActiveRange().setStart(getActiveRange().startContainer.parentNode, 1 + getNodeIndex(getActiveRange().startContainer));
			getActiveRange().collapse(true);
		}

		// "Let hr be the result of calling createElement("hr") on the
		// context object."
		var hr = document.createElement("hr");

		// "Run insertNode(hr) on the range."
		range.insertNode(hr);

		// "Fix disallowed ancestors of hr."
		fixDisallowedAncestors(hr, range);

		// "Run collapse() on the Selection, with first argument equal to the
		// parent of hr and the second argument equal to one plus the index of
		// hr."
		//
		// Not everyone actually supports collapse(), so we do it manually
		// instead.  Also, we need to modify the actual range we're given as
		// well, for the sake of autoimplementation.html's range-filling-in.
		range.setStart(hr.parentNode, 1 + getNodeIndex(hr));
		range.setEnd(hr.parentNode, 1 + getNodeIndex(hr));
		Aloha.getSelection().removeAllRanges();
		Aloha.getSelection().addRange(range);
	}
};

//@}
///// The insertHTML command /////
//@{
commands.inserthtml = {
	action: function(value, range) {
		
		
		// "Delete the contents of the active range."
		deleteContents(range);

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(range.startContainer)
		&& !isEditingHost(range.startContainer)) {
			return;
		}

		// "Let frag be the result of calling createContextualFragment(value)
		// on the active range."
		var frag = range.createContextualFragment(value);

		// "Let last child be the lastChild of frag."
		var lastChild = frag.lastChild;

		// "If last child is null, abort these steps."
		if (!lastChild) {
			return;
		}

		// "Let descendants be all descendants of frag."
		var descendants = getDescendants(frag);

		// "If the active range's start node is a block node:"
		if (isBlockNode(range.startContainer)) {
			// "Let collapsed block props be all editable collapsed block prop
			// children of the active range's start node that have index
			// greater than or equal to the active range's start offset."
			//
			// "For each node in collapsed block props, remove node from its
			// parent."
			$_(range.startContainer.childNodes).filter(function(node, range) {
				return isEditable(node)
					&& isCollapsedBlockProp(node)
					&& getNodeIndex(node) >= range.startOffset;
			}, true).forEach(function(node) {
				node.parentNode.removeChild(node);
			});
		}

		// "Call insertNode(frag) on the active range."
		range.insertNode(frag);

		// "If the active range's start node is a block node with no visible
		// children, call createElement("br") on the context object and append
		// the result as the last child of the active range's start node."
		if (isBlockNode(range.startContainer)
		&& !$_(range.startContainer.childNodes).some(isVisible)) {
			range.startContainer.appendChild(createEndBreak());
		}

		// "Call collapse() on the context object's Selection, with last
		// child's parent as the first argument and one plus its index as the
		// second."
		range.setStart(lastChild.parentNode, 1 + getNodeIndex(lastChild));
		range.setEnd(lastChild.parentNode, 1 + getNodeIndex(lastChild));

		// "Fix disallowed ancestors of each member of descendants."
		for (var i = 0; i < descendants.length; i++) {
			fixDisallowedAncestors(descendants[i], range);
		}
		
		setActiveRange( range );
	}
};

//@}
///// The insertImage command /////
//@{
commands.insertimage = {
	action: function(value) {
		// "If value is the empty string, abort these steps and do nothing."
		if (value === "") {
			return;
		}

		// "Let range be the active range."
		var range = getActiveRange();

		// "Delete the contents of range, with strip wrappers false."
		deleteContents(range, {stripWrappers: false});

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(getActiveRange().startContainer)
		&& !isEditingHost(getActiveRange().startContainer)) {
			return;
		}

		// "If range's start node is a block node whose sole child is a br, and
		// its start offset is 0, remove its start node's child from it."
		if (isBlockNode(range.startContainer)
		&& range.startContainer.childNodes.length == 1
		&& isHtmlElement(range.startContainer.firstChild, "br")
		&& range.startOffset == 0) {
			range.startContainer.removeChild(range.startContainer.firstChild);
		}

		// "Let img be the result of calling createElement("img") on the
		// context object."
		var img = document.createElement("img");

		// "Run setAttribute("src", value) on img."
		img.setAttribute("src", value);

		// "Run insertNode(img) on the range."
		range.insertNode(img);

		// "Run collapse() on the Selection, with first argument equal to the
		// parent of img and the second argument equal to one plus the index of
		// img."
		//
		// Not everyone actually supports collapse(), so we do it manually
		// instead.  Also, we need to modify the actual range we're given as
		// well, for the sake of autoimplementation.html's range-filling-in.
		range.setStart(img.parentNode, 1 + getNodeIndex(img));
		range.setEnd(img.parentNode, 1 + getNodeIndex(img));
		Aloha.getSelection().removeAllRanges();
		Aloha.getSelection().addRange(range);

		// IE adds width and height attributes for some reason, so remove those
		// to actually do what the spec says.
		img.removeAttribute("width");
		img.removeAttribute("height");
	}
};

//@}
///// The insertLineBreak command /////
//@{
commands.insertlinebreak = {
	action: function(value, range) {
		// "Delete the contents of the active range, with strip wrappers false."
		deleteContents(range, {stripWrappers: false});

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(range.startContainer)
		&& !isEditingHost(range.startContainer)) {
			return;
		}

		// "If the active range's start node is an Element, and "br" is not an
		// allowed child of it, abort these steps."
		if (range.startContainer.nodeType == $_.Node.ELEMENT_NODE
		&& !isAllowedChild("br", range.startContainer)) {
			return;
		}

		// "If the active range's start node is not an Element, and "br" is not
		// an allowed child of the active range's start node's parent, abort
		// these steps."
		if (range.startContainer.nodeType != $_.Node.ELEMENT_NODE
		&& !isAllowedChild("br", range.startContainer.parentNode)) {
			return;
		}

		// "If the active range's start node is a Text node and its start
		// offset is zero, call collapse() on the context object's Selection,
		// with first argument equal to the active range's start node's parent
		// and second argument equal to the active range's start node's index."
		if (range.startContainer.nodeType == $_.Node.TEXT_NODE
		&& range.startOffset == 0) {
			var newNode = range.startContainer.parentNode;
			var newOffset = getNodeIndex(range.startContainer);
			Aloha.getSelection().collapse(newNode, newOffset);
			range.setStart(newNode, newOffset);
			range.setEnd(newNode, newOffset);
		}

		// "If the active range's start node is a Text node and its start
		// offset is the length of its start node, call collapse() on the
		// context object's Selection, with first argument equal to the active
		// range's start node's parent and second argument equal to one plus
		// the active range's start node's index."
		if (range.startContainer.nodeType == $_.Node.TEXT_NODE
		&& range.startOffset == getNodeLength(range.startContainer)) {
			var newNode = range.startContainer.parentNode;
			var newOffset = 1 + getNodeIndex(range.startContainer);
			Aloha.getSelection().collapse(newNode, newOffset);
			range.setStart(newNode, newOffset);
			range.setEnd(newNode, newOffset);
		}

		// "Let br be the result of calling createElement("br") on the context
		// object."
		var br = document.createElement("br");

		// "Call insertNode(br) on the active range."
		range.insertNode(br);

		// "Call collapse() on the context object's Selection, with br's parent
		// as the first argument and one plus br's index as the second
		// argument."
		Aloha.getSelection().collapse(br.parentNode, 1 + getNodeIndex(br));
		range.setStart(br.parentNode, 1 + getNodeIndex(br));
		range.setEnd(br.parentNode, 1 + getNodeIndex(br));

		// "If br is a collapsed line break, call createElement("br") on the
		// context object and let extra br be the result, then call
		// insertNode(extra br) on the active range."
		if (isCollapsedLineBreak(br)) {
			range.insertNode(createEndBreak());

			// Compensate for nonstandard implementations of insertNode
			Aloha.getSelection().collapse(br.parentNode, 1 + getNodeIndex(br));
			range.setStart(br.parentNode, 1 + getNodeIndex(br));
			range.setEnd(br.parentNode, 1 + getNodeIndex(br));
		}
	}
};

//@}
///// The insertOrderedList command /////
//@{
commands.insertorderedlist = {
	// "Toggle lists with tag name "ol"."
	action: function() { toggleLists("ol") },
	// "True if the selection's list state is "mixed" or "mixed ol", false
	// otherwise."
	indeterm: function() { return /^mixed( ol)?$/.test(getSelectionListState()) },
	// "True if the selection's list state is "ol", false otherwise."
	state: function() { return getSelectionListState() == "ol" }
};

//@}
///// The insertParagraph command /////
//@{
commands.insertparagraph = {
	action: function(value, range) {
		
		// "Delete the contents of the active range."
		deleteContents(range);

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(range.startContainer)
		&& !isEditingHost(range.startContainer)) {
			return;
		}

		// "Let node and offset be the active range's start node and offset."
		var node = range.startContainer;
		var offset = range.startOffset;

		// "If node is a Text node, and offset is neither 0 nor the length of
		// node, call splitText(offset) on node."
		if (node.nodeType == $_.Node.TEXT_NODE
		&& offset != 0
		&& offset != getNodeLength(node)) {
			node.splitText(offset);
		}

		// "If node is a Text node and offset is its length, set offset to one
		// plus the index of node, then set node to its parent."
		if (node.nodeType == $_.Node.TEXT_NODE
		&& offset == getNodeLength(node)) {
			offset = 1 + getNodeIndex(node);
			node = node.parentNode;
		}

		// "If node is a Text or Comment node, set offset to the index of node,
		// then set node to its parent."
		if (node.nodeType == $_.Node.TEXT_NODE
		|| node.nodeType == $_.Node.COMMENT_NODE) {
			offset = getNodeIndex(node);
			node = node.parentNode;
		}

		// "Call collapse(node, offset) on the context object's Selection."
		Aloha.getSelection().collapse(node, offset);
		range.setStart(node, offset);
		range.setEnd(node, offset);

		// "Let container equal node."
		var container = node;

		// "While container is not a single-line container, and container's
		// parent is editable and in the same editing host as node, set
		// container to its parent."
		while (!isSingleLineContainer(container)
		&& isEditable(container.parentNode)
		&& inSameEditingHost(node, container.parentNode)) {
			container = container.parentNode;
		}

		// "If container is not editable or not in the same editing host as
		// node or is not a single-line container:"
		if (!isEditable(container)
		|| !inSameEditingHost(container, node)
		|| !isSingleLineContainer(container)) {
			// "Let tag be the default single-line container name."
			var tag = defaultSingleLineContainerName;

			// "Block-extend the active range, and let new range be the
			// result."
			var newRange = blockExtend(range);

			// "Let node list be a list of nodes, initially empty."
			//
			// "Append to node list the first node in tree order that is
			// contained in new range and is an allowed child of "p", if any."
			var nodeList = getContainedNodes(newRange, function(node) { return isAllowedChild(node, "p") })
				.slice(0, 1);

			// "If node list is empty:"
			if (!nodeList.length) {
				// "If tag is not an allowed child of the active range's start
				// node, abort these steps."
				if (!isAllowedChild(tag, range.startContainer)) {
					return;
				}

				// "Set container to the result of calling createElement(tag)
				// on the context object."
				container = document.createElement(tag);

				// "Call insertNode(container) on the active range."
				range.insertNode(container);

				// "Call createElement("br") on the context object, and append
				// the result as the last child of container."
				container.appendChild(createEndBreak());

				// "Call collapse(container, 0) on the context object's
				// Selection."
				// TODO: remove selection from command
				Aloha.getSelection().collapse(container, 0); 
				range.setStart(container, 0);
				range.setEnd(container, 0);

				// "Abort these steps."
				return;
			}

			// "While the nextSibling of the last member of node list is not
			// null and is an allowed child of "p", append it to node list."
			while (nodeList[nodeList.length - 1].nextSibling
			&& isAllowedChild(nodeList[nodeList.length - 1].nextSibling, "p")) {
				nodeList.push(nodeList[nodeList.length - 1].nextSibling);
			}

			// "Wrap node list, with sibling criteria returning false and new
			// parent instructions returning the result of calling
			// createElement(tag) on the context object. Set container to the
			// result."
			container = wrap(nodeList,
				function() { return false },
				function() { return document.createElement(tag) },
				range
			);
		}

		// "If container's local name is "address", "listing", or "pre":"
		if (container.tagName == "ADDRESS"
		|| container.tagName == "LISTING"
		|| container.tagName == "PRE") {
			// "Let br be the result of calling createElement("br") on the
			// context object."
			var br = document.createElement("br");

			// remember the old height
			var oldHeight = container.offsetHeight;

			// "Call insertNode(br) on the active range."
			range.insertNode(br);

			// determine the new height
			var newHeight = container.offsetHeight;

			// "Call collapse(node, offset + 1) on the context object's
			// Selection."
			Aloha.getSelection().collapse(node, offset + 1);
			range.setStart(node, offset + 1);
			range.setEnd(node, offset + 1);

			// "If br is the last descendant of container, let br be the result
			// of calling createElement("br") on the context object, then call
			// insertNode(br) on the active range." (Fix: only do this, if the container height did not change by inserting a single <br/>)
			//
			// Work around browser bugs: some browsers select the
			// newly-inserted node, not per spec.
			if (oldHeight == newHeight && !isDescendant(nextNode(br), container)) {
				range.insertNode(createEndBreak());
				Aloha.getSelection().collapse(node, offset + 1);
				range.setEnd(node, offset + 1);
			}

			// "Abort these steps."
			return;
		}

		// "If container's local name is "li", "dt", or "dd"; and either it has
		// no children or it has a single child and that child is a br:"
		if ($_(["LI", "DT", "DD"]).indexOf(container.tagName) != -1
		&& (!container.hasChildNodes()
		|| (container.childNodes.length == 1
		&& isHtmlElement(container.firstChild, "br")))) {
			// "Split the parent of the one-node list consisting of container."
			splitParent([container], range);

			// "If container has no children, call createElement("br") on the
			// context object and append the result as the last child of
			// container."
			// only do this, if inserting the br does NOT modify the offset height of the container
			if (!container.hasChildNodes()) {
				var oldHeight = container.offsetHeight, endBr = createEndBreak();
				container.appendChild(endBr);
				if (container.offsetHeight !== oldHeight) {
					container.removeChild(endBr);
				}
			}

			// "If container is a dd or dt, and it is not an allowed child of
			// any of its ancestors in the same editing host, set the tag name
			// of container to the default single-line container name and let
			// container be the result."
			if (isHtmlElement(container, ["dd", "dt"])
			&& $_( getAncestors(container) ).every(function(ancestor) {
				return !inSameEditingHost(container, ancestor)
					|| !isAllowedChild(container, ancestor)
			})) {
				container = setTagName(container, defaultSingleLineContainerName, range);
			}

			// "Fix disallowed ancestors of container."
			fixDisallowedAncestors(container, range);

			// fix invalid nested lists
			if (isHtmlElement(container, "li")
			&& isHtmlElement(container.nextSibling, "li")
			&& isHtmlElement(container.nextSibling.firstChild, ["ol", "ul"])) {
				// we found a li containing only a br followed by a li containing a list as first element: merge the two li's
				var listParent = container.nextSibling, length = container.nextSibling.childNodes.length;
				for (var i = 0; i < length; i++) {
					container.appendChild(listParent.childNodes[i]);
				}
				listParent.parentNode.removeChild(listParent);
			}

			// "Abort these steps."
			return;
		}

		// "Let new line range be a new range whose start is the same as
		// the active range's, and whose end is (container, length of
		// container)."
		var newLineRange = Aloha.createRange();
		newLineRange.setStart(range.startContainer, range.startOffset);
		newLineRange.setEnd(container, getNodeLength(container));

		// "While new line range's start offset is zero and its start node is
		// not container, set its start to (parent of start node, index of
		// start node)."
		while (newLineRange.startOffset == 0
		&& newLineRange.startContainer != container) {
			newLineRange.setStart(newLineRange.startContainer.parentNode, getNodeIndex(newLineRange.startContainer));
		}

		// "While new line range's start offset is the length of its start node
		// and its start node is not container, set its start to (parent of
		// start node, 1 + index of start node)."
		while (newLineRange.startOffset == getNodeLength(newLineRange.startContainer)
		&& newLineRange.startContainer != container) {
			newLineRange.setStart(newLineRange.startContainer.parentNode, 1 + getNodeIndex(newLineRange.startContainer));
		}

		// "Let end of line be true if new line range contains either nothing
		// or a single br, and false otherwise."
		var containedInNewLineRange = getContainedNodes(newLineRange);
		var endOfLine = !containedInNewLineRange.length
			|| (containedInNewLineRange.length == 1
			&& isHtmlElement(containedInNewLineRange[0], "br"));

		// "If the local name of container is "h1", "h2", "h3", "h4", "h5", or
		// "h6", and end of line is true, let new container name be the default
		// single-line container name."
		var newContainerName;
		if (/^H[1-6]$/.test(container.tagName)
		&& endOfLine) {
			newContainerName = defaultSingleLineContainerName;

		// "Otherwise, if the local name of container is "dt" and end of line
		// is true, let new container name be "dd"."
		} else if (container.tagName == "DT"
		&& endOfLine) {
			newContainerName = "dd";

		// "Otherwise, if the local name of container is "dd" and end of line
		// is true, let new container name be "dt"."
		} else if (container.tagName == "DD"
		&& endOfLine) {
			newContainerName = "dt";

		// "Otherwise, let new container name be the local name of container."
		} else {
			newContainerName = container.tagName.toLowerCase();
		}

		// "Let new container be the result of calling createElement(new
		// container name) on the context object."
		var newContainer = document.createElement(newContainerName);

		// "Copy all non empty attributes of the container to new container."
		for ( var i = 0; i < container.attributes.length; i++ ) {
			if ( typeof newContainer.setAttributeNS === 'function' ) {
				newContainer.setAttributeNS(container.attributes[i].namespaceURI, container.attributes[i].name, container.attributes[i].value);
			} else if ( container.attributes[i].value.length > 0 
						&& container.attributes[i].value != 'null'
						&& container.attributes[i].value > 0) {
				newContainer.setAttribute(container.attributes[i].name, container.attributes[i].value);
			}
		}

		// "If new container has an id attribute, unset it."
		newContainer.removeAttribute("id");

		// "Insert new container into the parent of container immediately after
		// container."
		container.parentNode.insertBefore(newContainer, container.nextSibling);

		// "Let contained nodes be all nodes contained in new line range."
		var containedNodes = getAllContainedNodes(newLineRange);

		// "Let frag be the result of calling extractContents() on new line
		// range."
		var frag = newLineRange.extractContents();

		// "Unset the id attribute (if any) of each Element descendant of frag
		// that is not in contained nodes."
		var descendants = getDescendants(frag);
		for (var i = 0; i < descendants.length; i++) {
			if (descendants[i].nodeType == $_.Node.ELEMENT_NODE
			&& $_(containedNodes).indexOf(descendants[i]) == -1) {
				descendants[i].removeAttribute("id");
			}
		}

		var fragChildren = [], fragChild = frag.firstChild;
		if (fragChild) {
			do {
				if (!isWhitespaceNode(fragChild)) {
					fragChildren.push(fragChild);
				}
			} while(fragChild = fragChild.nextSibling);
		}

		// if newContainer is a li and frag contains only a list, we add a br in the li (but only if the height would not change)
		if (isHtmlElement(newContainer, "li") && fragChildren.length && isHtmlElement(fragChildren[0], ["ul", "ol"])) {
			var oldHeight = newContainer.offsetHeight;
			var endBr = createEndBreak();
			newContainer.appendChild(endBr);
			var newHeight = newContainer.offsetHeight;
			if (oldHeight !== newHeight) {
				newContainer.removeChild(endBr);
			}
		}

		// "Call appendChild(frag) on new container."
		newContainer.appendChild(frag);

		// "If container has no visible children, call createElement("br") on
		// the context object, and append the result as the last child of
		// container."
		if (container.offsetHeight == 0 && !$_(container.childNodes).some(isVisible)) {
			container.appendChild(createEndBreak());
		}

		// "If new container has no visible children, call createElement("br")
		// on the context object, and append the result as the last child of
		// new container."
		if (newContainer.offsetHeight == 0 && !$_(newContainer.childNodes).some(isVisible)) {
			newContainer.appendChild(createEndBreak());
		}

		// "Call collapse(new container, 0) on the context object's Selection."
		Aloha.getSelection().collapse(newContainer, 0);
		range.setStart(newContainer, 0);
		range.setEnd(newContainer, 0);
	}
};

//@}
///// The insertText command /////
//@{
commands.inserttext = {
	action: function(value, range) {
		// "Delete the contents of the active range, with strip wrappers
		// false."
		deleteContents(range, {stripWrappers: false});

		// "If the active range's start node is neither editable nor an editing
		// host, abort these steps."
		if (!isEditable(range.startContainer)
		&& !isEditingHost(range.startContainer)) {
			return;
		}

		// "If value's length is greater than one:"
		if (value.length > 1) {
			// "For each element el in value, take the action for the
			// insertText command, with value equal to el."
			for (var i = 0; i < value.length; i++) {
				commands.inserttext.action( value[i], range );
			}

			// "Abort these steps."
			return;
		}

		// "If value is the empty string, abort these steps."
		if (value == "") {
			return;
		}

		// "If value is a newline (U+00A0), take the action for the
		// insertParagraph command and abort these steps."
		if (value == "\n") {
			commands.insertparagraph.action( '', range );
			return;
		}

		// "Let node and offset be the active range's start node and offset."
		var node = range.startContainer;
		var offset = range.startOffset;

		// "If node has a child whose index is offset − 1, and that child is a
		// Text node, set node to that child, then set offset to node's
		// length."
		if (0 <= offset - 1
		&& offset - 1 < node.childNodes.length
		&& node.childNodes[offset - 1].nodeType == $_.Node.TEXT_NODE) {
			node = node.childNodes[offset - 1];
			offset = getNodeLength(node);
		}

		// "If node has a child whose index is offset, and that child is a Text
		// node, set node to that child, then set offset to zero."
		if (0 <= offset
		&& offset < node.childNodes.length
		&& node.childNodes[offset].nodeType == $_.Node.TEXT_NODE) {
			node = node.childNodes[offset];
			offset = 0;
		}

		// "If value is a space (U+0020), and either node is an Element whose
		// resolved value for "white-space" is neither "pre" nor "pre-wrap" or
		// node is not an Element but its parent is an Element whose resolved
		// value for "white-space" is neither "pre" nor "pre-wrap", set value
		// to a non-breaking space (U+00A0)."
		var refElement = node.nodeType == $_.Node.ELEMENT_NODE ? node : node.parentNode;
		if (value == " "
		&& refElement.nodeType == $_.Node.ELEMENT_NODE
		&& $_(["pre", "pre-wrap"]).indexOf($_.getComputedStyle(refElement).whiteSpace) == -1) {
			value = "\xa0";
		}

		// "Record current overrides, and let overrides be the result."
		var overrides = recordCurrentOverrides( range );

		// "If node is a Text node:"
		if (node.nodeType == $_.Node.TEXT_NODE) {
			// "Call insertData(offset, value) on node."
			node.insertData(offset, value);

			// "Call collapse(node, offset) on the context object's Selection."
			Aloha.getSelection().collapse(node, offset);
			range.setStart(node, offset);

			// "Call extend(node, offset + 1) on the context object's
			// Selection."
			Aloha.getSelection().extend(node, offset + 1);
			range.setEnd(node, offset + 1);

		// "Otherwise:"
		} else {
			// "If node has only one child, which is a collapsed line break,
			// remove its child from it."
			//
			// FIXME: IE incorrectly returns false here instead of true
			// sometimes?
			if (node.childNodes.length == 1
			&& isCollapsedLineBreak(node.firstChild)) {
				node.removeChild(node.firstChild);
			}

			// "Let text be the result of calling createTextNode(value) on the
			// context object."
			var text = document.createTextNode(value);

			// "Call insertNode(text) on the active range."
			range.insertNode(text);

			// "Call collapse(text, 0) on the context object's Selection."
			Aloha.getSelection().collapse(text, 0);
			range.setStart(text, 0);

			// "Call extend(text, 1) on the context object's Selection."
			Aloha.getSelection().extend(text, 1);
			range.setEnd(text, 1);
		}

		// "Restore states and values from overrides."
		restoreStatesAndValues(overrides);

		// "Canonicalize whitespace at the active range's start."
		canonicalizeWhitespace(range.startContainer, range.startOffset);

		// "Canonicalize whitespace at the active range's end."
		canonicalizeWhitespace(range.endContainer, range.endOffset);

		// "Call collapseToEnd() on the context object's Selection."
		Aloha.getSelection().collapseToEnd();
		range.collapse(false);
	}
};

//@}
///// The insertUnorderedList command /////
//@{
commands.insertunorderedlist = {
	// "Toggle lists with tag name "ul"."
	action: function() { toggleLists("ul") },
	// "True if the selection's list state is "mixed" or "mixed ul", false
	// otherwise."
	indeterm: function() { return /^mixed( ul)?$/.test(getSelectionListState()) },
	// "True if the selection's list state is "ul", false otherwise."
	state: function() { return getSelectionListState() == "ul" }
};

//@}
///// The justifyCenter command /////
//@{
commands.justifycenter = {
	// "Justify the selection with alignment "center"."
	action: function(value, range) { justifySelection("center", range) },
	indeterm: function() {
		// "Block-extend the active range. Return true if among visible
		// editable nodes that are contained in the result and have no
		// children, at least one has alignment value "center" and at least one
		// does not. Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return $_( nodes ).some(function(node) { return getAlignmentValue(node) == "center" })
			&& $_( nodes ).some(function(node) { return getAlignmentValue(node) != "center" });
	}, state: function() {
		// "Block-extend the active range. Return true if there is at least one
		// visible editable node that is contained in the result and has no
		// children, and all such nodes have alignment value "center".
		// Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return nodes.length
			&& $_( nodes ).every(function(node) { return getAlignmentValue(node) == "center" });
	}, value: function() {
		// "Block-extend the active range, and return the alignment value of
		// the first visible editable node that is contained in the result and
		// has no children. If there is no such node, return "left"."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		if (nodes.length) {
			return getAlignmentValue(nodes[0]);
		} else {
			return "left";
		}
	}
};

//@}
///// The justifyFull command /////
//@{
commands.justifyfull = {
	// "Justify the selection with alignment "justify"."
	action: function(value, range) { justifySelection("justify", range) },
	indeterm: function() {
		// "Block-extend the active range. Return true if among visible
		// editable nodes that are contained in the result and have no
		// children, at least one has alignment value "justify" and at least
		// one does not. Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return $_( nodes ).some(function(node) { return getAlignmentValue(node) == "justify" })
			&& $_( nodes ).some(function(node) { return getAlignmentValue(node) != "justify" });
	}, state: function() {
		// "Block-extend the active range. Return true if there is at least one
		// visible editable node that is contained in the result and has no
		// children, and all such nodes have alignment value "justify".
		// Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return nodes.length
			&& $_( nodes ).every(function(node) { return getAlignmentValue(node) == "justify" });
	}, value: function() {
		// "Block-extend the active range, and return the alignment value of
		// the first visible editable node that is contained in the result and
		// has no children. If there is no such node, return "left"."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		if (nodes.length) {
			return getAlignmentValue(nodes[0]);
		} else {
			return "left";
		}
	}
};

//@}
///// The justifyLeft command /////
//@{
commands.justifyleft = {
	// "Justify the selection with alignment "left"."
	action: function(value, range) { justifySelection("left", range) },
	indeterm: function() {
		// "Block-extend the active range. Return true if among visible
		// editable nodes that are contained in the result and have no
		// children, at least one has alignment value "left" and at least one
		// does not. Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return $_( nodes ).some(function(node) { return getAlignmentValue(node) == "left" })
			&& $_( nodes ).some(function(node) { return getAlignmentValue(node) != "left" });
	}, state: function() {
		// "Block-extend the active range. Return true if there is at least one
		// visible editable node that is contained in the result and has no
		// children, and all such nodes have alignment value "left".  Otherwise
		// return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return nodes.length
			&& $_( nodes ).every(function(node) { return getAlignmentValue(node) == "left" });
	}, value: function() {
		// "Block-extend the active range, and return the alignment value of
		// the first visible editable node that is contained in the result and
		// has no children. If there is no such node, return "left"."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		if (nodes.length) {
			return getAlignmentValue(nodes[0]);
		} else {
			return "left";
		}
	}
};

//@}
///// The justifyRight command /////
//@{
commands.justifyright = {
	// "Justify the selection with alignment "right"."
	action: function(value, range) { justifySelection("right", range) },
	indeterm: function() {
		// "Block-extend the active range. Return true if among visible
		// editable nodes that are contained in the result and have no
		// children, at least one has alignment value "right" and at least one
		// does not. Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return $_( nodes ).some(function(node) { return getAlignmentValue(node) == "right" })
			&& $_( nodes ).some(function(node) { return getAlignmentValue(node) != "right" });
	}, state: function() {
		// "Block-extend the active range. Return true if there is at least one
		// visible editable node that is contained in the result and has no
		// children, and all such nodes have alignment value "right".
		// Otherwise return false."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		return nodes.length
			&& $_( nodes ).every(function(node) { return getAlignmentValue(node) == "right" });
	}, value: function() {
		// "Block-extend the active range, and return the alignment value of
		// the first visible editable node that is contained in the result and
		// has no children. If there is no such node, return "left"."
		var nodes = getAllContainedNodes(blockExtend(getActiveRange()), function(node) {
			return isEditable(node) && isVisible(node) && !node.hasChildNodes();
		});
		if (nodes.length) {
			return getAlignmentValue(nodes[0]);
		} else {
			return "left";
		}
	}
};

//@}
///// The outdent command /////
//@{
commands.outdent = {
	action: function() {
		// "Let items be a list of all lis that are ancestor containers of the
		// range's start and/or end node."
		//
		// It's annoying to get this in tree order using functional stuff
		// without doing getDescendants(document), which is slow, so I do it
		// imperatively.
		var items = [];
		(function(){
			for (
				var ancestorContainer = getActiveRange().endContainer;
				ancestorContainer != getActiveRange().commonAncestorContainer;
				ancestorContainer = ancestorContainer.parentNode
			) {
				if (isHtmlElement(ancestorContainer, "li")) {
					items.unshift(ancestorContainer);
				}
			}
			for (
				var ancestorContainer = getActiveRange().startContainer;
				ancestorContainer;
				ancestorContainer = ancestorContainer.parentNode
			) {
				if (isHtmlElement(ancestorContainer, "li")) {
					items.unshift(ancestorContainer);
				}
			}
		})();

		// "For each item in items, normalize sublists of item."
		$_( items ).forEach( function( thisArg) {
			normalizeSublists( thisArg, range);
		});

		// "Block-extend the active range, and let new range be the result."
		var newRange = blockExtend(getActiveRange());

		// "Let node list be a list of nodes, initially empty."
		//
		// "For each node node contained in new range, append node to node list
		// if the last member of node list (if any) is not an ancestor of node;
		// node is editable; and either node has no editable descendants, or is
		// an ol or ul, or is an li whose parent is an ol or ul."
		var nodeList = getContainedNodes(newRange, function(node) {
			return isEditable(node)
				&& (!$_( getDescendants(node) ).some(isEditable)
				|| isHtmlElement(node, ["ol", "ul"])
				|| (isHtmlElement(node, "li") && isHtmlElement(node.parentNode, ["ol", "ul"])));
		});

		// "While node list is not empty:"
		while (nodeList.length) {
			// "While the first member of node list is an ol or ul or is not
			// the child of an ol or ul, outdent it and remove it from node
			// list."
			while (nodeList.length
			&& (isHtmlElement(nodeList[0], ["OL", "UL"])
			|| !isHtmlElement(nodeList[0].parentNode, ["OL", "UL"]))) {
				outdentNode(nodeList.shift(), range);
			}

			// "If node list is empty, break from these substeps."
			if (!nodeList.length) {
				break;
			}

			// "Let sublist be a list of nodes, initially empty."
			var sublist = [];

			// "Remove the first member of node list and append it to sublist."
			sublist.push(nodeList.shift());

			// "While the first member of node list is the nextSibling of the
			// last member of sublist, and the first member of node list is not
			// an ol or ul, remove the first member of node list and append it
			// to sublist."
			while (nodeList.length
			&& nodeList[0] == sublist[sublist.length - 1].nextSibling
			&& !isHtmlElement(nodeList[0], ["OL", "UL"])) {
				sublist.push(nodeList.shift());
			}

			// "Record the values of sublist, and let values be the result."
			var values = recordValues(sublist);

			// "Split the parent of sublist, with new parent null."
			splitParent(sublist, range);

			// "Fix disallowed ancestors of each member of sublist."
			$_( sublist ).forEach(fixDisallowedAncestors);

			// "Restore the values from values."
			restoreValues(values, range);
		}
	}
};

//@}

//////////////////////////////////
///// Miscellaneous commands /////
//////////////////////////////////

///// The selectAll command /////
//@{
commands.selectall = {
	// Note, this ignores the whole globalRange/getActiveRange() thing and
	// works with actual selections.  Not suitable for autoimplementation.html.
	action: function() {
		// "Let target be the body element of the context object."
		var target = document.body;

		// "If target is null, let target be the context object's
		// documentElement."
		if (!target) {
			target = document.documentElement;
		}

		// "If target is null, call getSelection() on the context object, and
		// call removeAllRanges() on the result."
		if (!target) {
			Aloha.getSelection().removeAllRanges();

		// "Otherwise, call getSelection() on the context object, and call
		// selectAllChildren(target) on the result."
		} else {
			Aloha.getSelection().selectAllChildren(target);
		}
	}
};

//@}
///// The styleWithCSS command /////
//@{
commands.stylewithcss = {
	action: function(value) {
		// "If value is an ASCII case-insensitive match for the string
		// "false", set the CSS styling flag to false. Otherwise, set the
		// CSS styling flag to true."
		cssStylingFlag = String(value).toLowerCase() != "false";
	}, state: function() { return cssStylingFlag }
};

//@}
///// The useCSS command /////
//@{
commands.usecss = {
	action: function(value) {
		// "If value is an ASCII case-insensitive match for the string "false",
		// set the CSS styling flag to true. Otherwise, set the CSS styling
		// flag to false."
		cssStylingFlag = String(value).toLowerCase() == "false";
	}
};
//@}

// Some final setup
//@{
(function() {
// Opera 11.50 doesn't implement Object.keys, so I have to make an explicit
// temporary, which means I need an extra closure to not leak the temporaries
// into the global namespace.  >:(
var commandNames = [];
for (var command in commands) {
	commandNames.push(command);
}
$_( commandNames ).forEach(function(command) {
	// "If a command does not have a relevant CSS property specified, it
	// defaults to null."
	if (!("relevantCssProperty" in commands[command])) {
		commands[command].relevantCssProperty = null;
	}

	// "If a command has inline command activated values defined but
	// nothing else defines when it is indeterminate, it is indeterminate
	// if among editable Text nodes effectively contained in the active
	// range, there is at least one whose effective command value is one of
	// the given values and at least one whose effective command value is
	// not one of the given values."
	if ("inlineCommandActivatedValues" in commands[command]
	&& !("indeterm" in commands[command])) {
		commands[command].indeterm = function( range ) {
			var values = $_( getAllEffectivelyContainedNodes(range, function(node) {
				return isEditable(node)
					&& node.nodeType == $_.Node.TEXT_NODE;
			}) ).map(function(node) { return getEffectiveCommandValue(node, command) });

			var matchingValues = $_( values ).filter(function(value) {
				return $_( commands[command].inlineCommandActivatedValues ).indexOf(value) != -1;
			});

			return matchingValues.length >= 1
				&& values.length - matchingValues.length >= 1;
		};
	}

	// "If a command has inline command activated values defined, its state
	// is true if either no editable Text node is effectively contained in
	// the active range, and the active range's start node's effective
	// command value is one of the given values; or if there is at least
	// one editable Text node effectively contained in the active range,
	// and all of them have an effective command value equal to one of the
	// given values."
	if ("inlineCommandActivatedValues" in commands[command]) {
		commands[command].state = function(range) {
			var nodes = getAllEffectivelyContainedNodes(range, function(node) {
				return isEditable(node)
					&& node.nodeType == $_.Node.TEXT_NODE;
			});

			if (nodes.length == 0) {
				return $_( commands[command].inlineCommandActivatedValues )
					.indexOf(getEffectiveCommandValue(range.startContainer, command)) != -1;
				return ret;
			} else {
				return $_( nodes ).every(function(node) {
					return $_( commands[command].inlineCommandActivatedValues )
						.indexOf(getEffectiveCommandValue(node, command)) != -1;
				});
			}
		};
	}

	// "If a command is a standard inline value command, it is
	// indeterminate if among editable Text nodes that are effectively
	// contained in the active range, there are two that have distinct
	// effective command values. Its value is the effective command value
	// of the first editable Text node that is effectively contained in the
	// active range, or if there is no such node, the effective command
	// value of the active range's start node."
	if ("standardInlineValueCommand" in commands[command]) {
		commands[command].indeterm = function() {
			var values = $_(getAllEffectivelyContainedNodes(getActiveRange()))
				.filter(function(node) { return isEditable(node) && node.nodeType == $_.Node.TEXT_NODE }, true)
				.map(function(node) { return getEffectiveCommandValue(node, command) });
			for (var i = 1; i < values.length; i++) {
				if (values[i] != values[i - 1]) {
					return true;
				}
			}
			return false;
		};

		commands[command].value = function(range) {
			var refNode = getAllEffectivelyContainedNodes(range, function(node) {
				return isEditable(node)
					&& node.nodeType == $_.Node.TEXT_NODE;
			})[0];

			if (typeof refNode == "undefined") {
				refNode = range.startContainer;
			}

			return getEffectiveCommandValue(refNode, command);
		};
	}
});
})();
//@}
return {
	commands: commands,
	execCommand: myExecCommand,
	queryCommandIndeterm: myQueryCommandIndeterm,
	queryCommandState: myQueryCommandState,
	queryCommandValue: myQueryCommandValue,
	queryCommandEnabled: myQueryCommandEnabled,
	queryCommandSupported: myQueryCommandSupported
}
}); // end define
// vim: foldmarker=@{,@} foldmethod=marker
/*!
* CommandManager file is part of Aloha Editor Project http://aloha-editor.org
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
* along with CommandManager program. If not, see <http://www.gnu.org/licenses/>.
*/

define('aloha/command',[ 'aloha/core', 'aloha/registry', 'aloha/engine', 'util/dom', 'aloha/contenthandlermanager' ],
function( Aloha, Registry, Engine, Dom, ContentHandlerManager ) {

//			Action: What the command does when executed via execCommand(). Every command defined
//			in CommandManager specification has an action defined for it in the relevant section. For example, 
//			the bold command's action generally makes the current selection bold, or removes bold if 
//			the selection is already bold. An editing toolbar might provide buttons that execute the
//			action for a command if clicked, or a script might run an action without user interaction
//			to achieve some particular effect.
//			
//			Indeterminate: A boolean value returned by queryCommandIndeterm(), depending on the
//			current state of the document. Generally, a command that has a state defined will be 
//			indeterminate if the state is true for part but not all of the current selection, and a
//			command that has a value defined will be indeterminate if different parts of the 
//			selection have different values. An editing toolbar might display a button or control
//			in a special way if the command is indeterminate, like showing a "bold" button as 
//			partially depressed, or leaving a font size selector blank instead of showing the font
//			size of the current selection. As a rule, a command can only be indeterminate if its
//			state is false, supposing it has a state.
//			
//			State: A boolean value returned by queryCommandState(), depending on the current state
//			of the document. The state of a command is true if it is already in effect, in some 
//			sense specific to the command. Most commands that have a state defined will take opposite
//			actions depending on whether the state is true or false, such as making the selection
//			bold if the state is false and removing bold if the state is true. Others will just 
//			have no effect if the state is true, like the justifyCenter command. Still others will 
//			have the same effect regardless, like the styleWithCss command. An editing toolbar might
//			display a button or control differently depending on the state and indeterminacy of the
//			command.
//			
//			Value: A string returned by queryCommandValue(), depending on the current state of the 
//			document. A command usually has a value instead of a state if the property it modifies 
//			can take more than two different values, like the foreColor command. If the command is 
//			indeterminate, its value is generally based on the start of the selection. Otherwise, 
//			in most cases the value holds true for the entire selection, but see the justifyCenter 
//			command and its three companions for an exception. An editing toolbar might display the
//			value of a command as selected in a drop-down or filled in in a text box, if the command
//			isn't indeterminate.
//			
//			Relevant CSS property: CommandManager is defined for certain inline formatting commands, and 
//			is used in algorithms specific to those commands. It is an implementation detail, and 
//			is not exposed to authors. If a command does not have a relevant CSS property 
//			specified, it defaults to null.

	var CommandManager = {
			
		execCommand: function( commandId, showUi, value, range ) {
			
			// Read current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt( 0 );
			}
			
			// For the insertHTML command we provide contenthandler API
			if ( commandId == 'insertHTML' ) {
				//if (typeof Aloha.settings.contentHandler.insertHtml === 'undefined') {
				//	use all registered content handler; used for copy & paste atm (or write log message)
				//	Aloha.settings.contentHandler.insertHtml = Aloha.defaults.contentHandler.insertHtml;
				//}
				value = ContentHandlerManager.handleContent( value, {
					contenthandler: Aloha.settings.contentHandler.insertHtml
				});
			}

			Engine.execCommand( commandId, showUi, value, range );

			if ( Aloha.getSelection().getRangeCount() ) {
				// Read range after engine modification
				range = Aloha.getSelection().getRangeAt( 0 );

				// FIX: doCleanup should work with W3C range
				var startnode = range.commonAncestorContainer.parentNode;
				var rangeObject = new window.GENTICS.Utils.RangeObject();
				rangeObject.startContainer = range.startContainer;
				rangeObject.startOffset = range.startOffset;
				rangeObject.endContainer = range.endContainer;
				rangeObject.endOffset = range.endOffset;
				Dom.doCleanup({merge:true, removeempty: false}, rangeObject, startnode);
				rangeObject.select();
			}

			Aloha.trigger('aloha-command-executed', commandId);
		},
		
		// If command is available and not disabled or the active range is not null 
		// the command is enabled
		queryCommandEnabled: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandEnabled( commandId, range );
		},

		// "Return true if command is indeterminate, otherwise false."
		queryCommandIndeterm: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandIndeterm( commandId, range );

		},
		
		queryCommandState: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandState( commandId, range );

		},
		
		// "When the queryCommandSupported(command) method on the HTMLDocument
		// interface is invoked, the user agent must return true if command is
		// supported, and false otherwise."
		queryCommandSupported: function( commandId ) {

			return Engine.queryCommandSupported( commandId );		
		},
		
		queryCommandValue: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}

			// "Return command's value."
			return Engine.queryCommandValue( commandId, range );
		},
		querySupportedCommands: function() {

			var 
				commands = [],
				command;
			
			for ( command in Engine.commands ) {
				commands.push( command );
			}
			return commands;
		}
	};
	
	// create an instance
	CommandManager = new ( Registry.extend( CommandManager ) )();
	
	/**
	 * Executes a registered command.
	 * http://aryeh.name/spec/editing/editing.html#methods-of-the-htmldocument-interface
	 * @method
	 * @param command name of the command
	 * @param showUI has no effect for Aloha Editor and is only here because in spec...
	 * @param value depends on the used command and it impementation 
	 * @range optional a range on which the command will be executed if not specified 
	 * 		  the current selection will be used as range
	 */
	Aloha.execCommand = CommandManager.execCommand;
	
	/**
	 * Check wheater the command in enabled.
	 * If command is not supported, raise a NOT_SUPPORTED_ERR exception.
	 * @param command name of the command
	 * @return true if command is enabled, false otherwise.
	 */
	Aloha.queryCommandEnabled = CommandManager.queryCommandEnabled;
	
	/**
	 * Check if the command has an indetermed state. 
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command has no indeterminacy, INVALID_ACCESS_ERR exception is thrown
	 * If command is not enabled, return false.
	 * @param command name of the command
	 * @range optional a range on which the command will be executed if not specified 
	 * 		  the current selection will be used as range
	 * @return true if command is indeterminate, otherwise false.
	 */
	Aloha.queryCommandIndeterm = CommandManager.queryCommandIndeterm;
	
	/**
	 * Returns the state of a given command
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command has no state, an INVALID_ACCESS_ERR exception is thrown
	 * If command is not enabled, return false
	 * If the state override for command is set, it returns the state
	 * @param command name of the command
	 * @return state override or true if command's state is true, otherwise false.
	 */
	Aloha.queryCommandState = CommandManager.queryCommandState;

	/**
	 * Check if a given command is supported
	 * @return true if command is supported, and false otherwise.
	 */
	Aloha.queryCommandSupported = CommandManager.queryCommandSupported;

	/**
	 * Returns the Value of a given Command
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command is not enabled, returns an empty string
	 * If command is "fontSize" and its value override is set, an integer 
	 * number of pixels is returned as font size for the result.
	 * If the value override for command is set, it returns that.
	 * @return command's value.
	 */
	Aloha.queryCommandValue = CommandManager.queryCommandValue;
	
	Aloha.querySupportedCommands = CommandManager.querySupportedCommands;
	
	return CommandManager;
});

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

define('aloha/jquery.patch',[ 'aloha/jquery' ],
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

define('aloha/jquery.aloha',[ 'aloha/core', 'aloha/selection', 'aloha/jquery', 'aloha/console' ],
function( Aloha, Selection, jQuery, console ) {
	
	
	var
//		$ = jQuery,
//		Aloha = window.Aloha,
//		console = window.console,
		XMLSerializer = window.XMLSerializer;

	/**
	 * jQuery between Extension
	 *
	 * insert either html code, a dom object OR a jQuery object inside of an existing text node.
	 * if the chained jQuery object is not a text node, nothing will happen.
	 *
	 * @param content HTML Code, DOM object or jQuery object to be inserted
	 * @param offset character offset from the start where the content should be inserted
	 */
	jQuery.fn.between = function(content, offset) {
		var
			offSize,
			fullText;

		if (this[0].nodeType !== 3) {
			// we are not in a text node, just insert the element at the corresponding position
			offSize = this.children().size();
			if (offset > offSize) {
				offset = offSize;
			}
			if (offset <= 0) {
				this.prepend(content);
			} else {
				this.children().eq(offset -1).after(content);
			}
		} else {
			// we are in a text node so we have to split it at the correct position
			if (offset <= 0) {
				this.before(content);
			} else if (offset >= this[0].length) {
				this.after(content);
			} else {
				fullText = this[0].data;
				this[0].data = fullText.substring(0, offset);
				this.after(fullText.substring(offset, fullText.length));
				this.after(content);
			}
		}
	};

	/**
	 * Make the object contenteditable. Care about browser version (name of contenteditable attribute depends on it)
	 */
	jQuery.fn.contentEditable = function( b ) {
		// ie does not understand contenteditable but contentEditable
		// contentEditable is not xhtml compatible.
		var	$el = jQuery(this);
		var	ce = 'contenteditable';

		// Check
		if (jQuery.browser.msie && parseInt(jQuery.browser.version,10) == 7 ) {
			ce = 'contentEditable';
		}
		
		if (typeof b === 'undefined' ) {
			
			// For chrome use this specific attribute. The old ce will only
			// return 'inherit' for nested elements of a contenteditable.
			// The isContentEditable is a w3c standard compliant property which works in IE7,8,FF36+, Chrome 12+
			if (typeof $el[0] === 'undefined' ) {
				console.error('The jquery object did not contain any valid elements.');
				return undefined;
			}
			if (typeof $el[0].isContentEditable === 'undefined') {
				console.warn('Could not determine whether the is editable or not. I assume it is.');
				return true;
			} else { 
				return $el[0].isContentEditable;
			}
		} else if (b === '') {
			$el.removeAttr(ce);
		} else {
			if (b && b !== 'false') {
				b = 'true';
			} else {
				b = 'false';
			}
			$el.attr(ce, b);
		}

		return $el;
	};

	/**
	 * jQuery Aloha Plugin
	 *
	 * turn all dom elements to continous text
	 * @return	jQuery object for the matched elements
	 * @api
	 */
	jQuery.fn.aloha = function() {
		var $this = jQuery( this );

		Aloha.bind( 'aloha-ready', function() {
			$this.each( function() {
				// create a new aloha editable object for each passed object
				if ( !Aloha.isEditable( this ) ) {
					new Aloha.Editable( jQuery( this ) );
				}
			});
		});

		// Chain
		return $this;
	};

	/**
	 * jQuery destroy elements as editable
	 *
	 * destroy all mached elements editable capabilities
	 * @return	jQuery object for the matched elements
	 * @api
	 */
	jQuery.fn.mahalo = function() {
		return this.each(function() {
			if (Aloha.isEditable(this)) {
				Aloha.getEditableById(jQuery(this).attr('id')).destroy();
			}
		});
	};

	/**
	 * jQuery Extension
	 * new Event which is triggered whenever a selection (length >= 0) is made in
	 * an Aloha Editable element
	 */
	jQuery.fn.contentEditableSelectionChange = function(callback) {
		var that = this;

		// update selection when keys are pressed
		this.keyup(function(event){
			var rangeObject = Selection.getRangeObject();
			callback(event);
		});

		// update selection on doubleclick (especially important for the first automatic selection, when the Editable is not active yet, but is at the same time activated as the selection occurs
		this.dblclick(function(event) {
			callback(event);
		});

		// update selection when text is selected
		this.mousedown(function(event){
			// remember that a selection was started
			that.selectionStarted = true;
		});
		jQuery(document).mouseup(function(event) {
			Selection.eventOriginalTarget = that;
			if (that.selectionStarted) {
				callback(event);
			}
			Selection.eventOriginalTarget = false;
			that.selectionStarted = false;
		});

		return this;
	};

	/**
	 * Fetch the outerHTML of an Element
	 * @version 1.0.0
	 * @date February 01, 2011
	 * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
	 * @author Benjamin Arthur Lupton {@link http://balupton.com}
	 * @copyright 2011 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 * @return {String} outerHtml
	 */
	jQuery.fn.outerHtml = jQuery.fn.outerHtml || function(){
		var
			$el = jQuery(this),
			el = $el.get(0);
			if (typeof el.outerHTML != 'undefined') {
				return el.outerHTML;
			} else {
				try {
					// Gecko-based browsers, Safari, Opera.
					return (new XMLSerializer()).serializeToString(el);
				 } catch (e) {
					try {
					  // Internet Explorer.
					  return el.xml;
					} catch (e) {}
				}
			}
	
	};


	jQuery.fn.zap = function () {
		return this.each(function(){ jQuery(this.childNodes).insertBefore(this); }).remove();
	};

	jQuery.fn.textNodes = function(excludeBreaks, includeEmptyTextNodes) {
			var
				ret = [],
				doSomething = function(el){
					if (
						(el.nodeType === 3 && jQuery.trim(el.data) && !includeEmptyTextNodes) ||
						(el.nodeType === 3 && includeEmptyTextNodes) ||
						(el.nodeName =="BR" && !excludeBreaks)) {
						ret.push(el);
					} else {
						for (var i=0, childLength = el.childNodes.length; i < childLength; ++i) {
							doSomething(el.childNodes[i]);
						}
					}
				};
			
			doSomething(this[0]);

			return jQuery(ret);
	};

	/**
	 * extendObjects is like jQuery.extend, but it does not extend arrays
	 */
	jQuery.extendObjects = jQuery.fn.extendObjects = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						if (jQuery.isArray(copy)) {
							// don't extend arrays
							target[ name ] = copy;
						} else {
							target[ name ] = jQuery.extendObjects( deep, clone, copy );
						}

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.isBoolean = function(b) {
		return b === true || b === false;
	},

	jQuery.isNumeric = function(o) {
		return ! isNaN (o-0);
	}
});

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

/**
 * @todo: - Make the sidebars resizable using drag handles
 *		  - Make overlayPage setting settable from external config
 */

define('aloha/sidebar',[
    'aloha/core',
	'aloha/jquery',
	'aloha/selection'
	// 'aloha/plugin' // For when we plugify sidebar
], function ( Aloha, jQuery, Selection, Plugin ) {
	
	
	var $ = jQuery;
	var undefined = void 0;
	// Pseudo-namespace prefix for Sidebar elements
	// Rational:
	// We use a prefix instead of an enclosing class or id because we need to
	// be paranoid of unintended style inheritance in an environment like the
	// one in which Aloha-Editor operates in, with its numerous custom plugins.
	// eg: .inner or .btn can be used in several plugins, with eaching adding
	// to the class styles properties that we don't want.
	var ns = 'aloha-sidebar';
	var uid  = +( new Date );
	// namespaced classnames
	var nsClasses = {
			'bar'                      : nsClass( 'bar' ),
			'handle'                   : nsClass( 'handle' ),
			'inner'                    : nsClass( 'inner' ),
			'panels'                   : nsClass( 'panels' ),
			'config-btn'               : nsClass( 'config-btn' ),
			'handle-icon'              : nsClass( 'handle-icon' ),
			'panel-content'            : nsClass( 'panel-content' ),
			'panel-content-inner'      : nsClass( 'panel-content-inner' ),
			'panel-content-inner-text' : nsClass( 'panel-content-inner-text' ),
			'panel-title'              : nsClass( 'panel-title' ),
			'panel-title-arrow'        : nsClass( 'panel-title-arrow' ),
			'panel-title-text'         : nsClass( 'panel-title-text' )
		};
	
	// Extend jQuery easing animations
	if ( !jQuery.easing.easeOutExpo ) {
		jQuery.extend(jQuery.easing, {
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var m=Math,s=1.70158,p=0,a=c;
				if(!t)return b;
				if((t/=d)==1)return b+c;
				if(!p)p=d*.3;
				if(a<m.abs(c)){a=c;var s=p/4;}else var s=p/(2*m.PI)*m.asin(c/a);
				return a*m.pow(2,-10*t)*m.sin((t*d-s)*(2*m.PI)/p)+c+b;
			}
		});
	}
	
	// ------------------------------------------------------------------------
	// Local (helper) functions
	// ------------------------------------------------------------------------
	
	/**
	 * Simple templating
	 *
	 * @param {String} str - The string containing placeholder keys in curly
	 *                       brackets
	 * @param {Object} obj - Associative array of replacing placeholder keys
	 *                       with corresponding values
	 */
	function supplant ( str, obj ) {
		 return str.replace( /\{([a-z0-9\-\_]+)\}/ig, function ( str, p1, offset, s ) {
			 var replacement = obj[ p1 ] || str;
			 return ( typeof replacement == 'function' ) ? replacement() : replacement;
		 } );
	};
	
	/**
	 * Wrapper to call the supplant method on a given string, taking the
	 * nsClasses object as the associative array containing the replacement
	 * pairs
	 *
	 * @param {String} str
	 * @return {String}
	 */
	function renderTemplate ( str ) {
		return ( typeof str == 'string' ) ? supplant( str, nsClasses ) : str;
	};
	
	/**
	 * Generates a selector string with this plugins's namespace prefixed the
	 * each classname
	 *
	 * Usage:
	 * 		nsSel('header,', 'main,', 'foooter ul')
	 * 		will return
	 * 		".aloha-myplugin-header, .aloha-myplugin-main, .aloha-mypluzgin-footer ul"
	 *
	 * @return {String}
	 */
	function nsSel () {
		var strBldr = [], prx = ns;
		jQuery.each( arguments, function () {
			strBldr.push( '.' + ( this == '' ? prx : prx + '-' + this ) );
		} );
		return jQuery.trim( strBldr.join( ' ' ) );
	};
	
	/**
	 * Generates a string with this plugins's namespace prefixed the each
	 * classname
	 *
	 * Usage:
	 *		nsClass('header', 'innerheaderdiv')
	 *		will return
	 *		"aloha-myplugin-header aloha-myplugin-innerheaderdiv"
	 *
	 * @return {String}
	 */
	function nsClass () {
		var strBldr = [], prx = ns;
		jQuery.each( arguments, function () {
			strBldr.push( this == '' ? prx : prx + '-' + this );
		} );
		return jQuery.trim( strBldr.join(' ') );
	};
	
	// ------------------------------------------------------------------------
	// Sidebar constructor
	// Only instance properties are to be defined here
	// ------------------------------------------------------------------------
	var Sidebar = function Sidebar ( opts ) {
		var sidebar = this;
		
		this.id = nsClass( ++uid );
		this.panels = {};
		this.container = jQuery( renderTemplate(
			'<div class="{bar}">' +
				'<div class="{handle}">' +
					'<span class="{handle-icon}"></span>' +
				'</div>' +
				'<div class="{inner}">' +
					'<ul class="{panels}"></ul>' +
				'</div>' +
			'</div>'
		) );
		// defaults
		this.width = 300;
		this.opened = false;
		this.isOpen = false;
		
		this.settings = {
			// We automatically set this to true when we are in IE, where rotating
			// elements using filters causes undesirable rendering ugliness.
			// Our solution is to fallback to swapping icon images.
			// We set this as a sidebar property so that it can overridden by
			// whoever thinks they are smarter than we are.
			rotateIcons : !jQuery.browser.msie,
			overlayPage : true
		};
		
		// Initialize after dom is ready
		jQuery( function () {
			if ( !( ( typeof Aloha.settings.sidebar != 'undefined' ) &&
					Aloha.settings.sidebar.disabled ) ) {
				sidebar.init( opts );
			}
		} );
		
	};
	
	// ------------------------------------------------------------------------
	// Sidebar prototype
	// All properties to be shared across Sidebar instances can be placed in
	// the prototype object
	// ------------------------------------------------------------------------
	jQuery.extend(Sidebar.prototype, {
		
		// Build as much of the sidebar as we can before appending it to DOM to
		// minimize reflow.
		init: function (opts) {
			var that = this;
			var panels;
			
			// Pluck panels list from opts
			if (typeof opts == 'object') {
				panels = opts.panels;
				delete opts.panels;
			}
			
			// Copy any implements, and overrides in opts to this Sidebar instance
			jQuery.extend(this, opts);
			
			if (typeof panels == 'object') {
				jQuery.each(panels, function () {
					that.addPanel(this, true);
				});
			}
			
			var bar = this.container;
			
			if (this.position == 'right') {
				bar.addClass(nsClass('right'));
			}
			
			// Place the bar into the DOM
			bar.hide()
			   .appendTo(jQuery('body'))
			   .click(function () {that.barClicked.apply(that, arguments);})
			   .find(nsSel('panels')).width(this.width);
			
			// IE7 needs us to explicitly set the container width, since it is
			// unable to determine it on its own
			bar.width(this.width);
			
			this.width = bar.width();
			
			jQuery(window).resize(function () {
				that.updateHeight();
			});
			
			this.updateHeight();
			this.roundCorners();
			this.initToggler();
			
			this.container.css(this.position == 'right' ? 'marginRight' : 'marginLeft', -this.width);
			
			if (this.opened) {
				this.open(0);
			}
			
			this.toggleHandleIcon(this.isOpen);
			
			this.subscribeToEvents();
			
			jQuery(window).resize(function () {
				that.correctHeight();
			});
			
			this.correctHeight();
		},
		
		show: function () {
			this.container.css( 'display', 'block' );
				//.animate({opacity: 1}, 1000);
			return this;
		},
		
		hide: function () {
			this.container.css( 'display','none' );
			//	.animate({opacity: 0}, 1000, function () {
			//		jQuery(this).css('display', 'block')
			//	});
			return this;
		},
		
		/**
		 * Determines the effective elements at the current selection.
		 * Iterates through all panels and checks whether the panel should be
		 * activated for any of the effective elements in the selection.
		 *
		 * @param {Object} range - The Aloha.RangeObject
		 */
		checkActivePanels: function( range ) {
			var effective = [];
			
			if ( typeof range != 'undefined' &&
					typeof range.markupEffectiveAtStart != 'undefined' ) {
				var l = range.markupEffectiveAtStart.length;
				for ( var i = 0; i < l; ++i ) {
					effective.push( jQuery( range.markupEffectiveAtStart[ i ] ) );
				}
			}
			
			var that = this;
			
			jQuery.each( this.panels, function () {
				that.showActivePanel( this, effective );
			} );
			
			this.correctHeight();
		},
		
		subscribeToEvents: function () {
			var that = this;
			var $container = this.container;
			
			Aloha.bind( 'aloha-selection-changed', function( event, range ) {
				that.checkActivePanels( range );
			} );
			
			$container.mousedown( function( e ) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = true;
				//e.stopSelectionUpdate = true;
			} );
			
			$container.mouseup( function ( e ) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = false;
			} );
			
			Aloha.bind( 'aloha-editable-deactivated', function ( event, params ) { 
				that.checkActivePanels();
			} );
		},
		
		/**
		 * Dynamically set appropriate heights for panels.
		 * The height for each panel is determined by the amount of space that
		 * is available in the viewport and the number of panels that need to
		 * share that space.
		 */
		correctHeight: function () {
			var height = this.container.find(nsSel('inner')).height() - (15 * 2);
			var panels = [];
			
			jQuery.each(this.panels, function () {
				if (this.isActive) {
					panels.push(this);
				}
			});
			
			if (panels.length == 0) {
				return;
			}
			
			var remainingHeight = height - ((panels[0].title.outerHeight() + 10) * panels.length);
			var panel;
			var targetHeight;
			var panelInner;
			var panelText;
			var undone;
			var toadd = 0;
			var math = Math; // Local reference for quicker lookup
			
			while (panels.length > 0 && remainingHeight > 0) {
				remainingHeight += toadd;
				
				toadd = 0;
				undone = [];
				
				for (var j = panels.length - 1; j >= 0; --j) {
					panel = panels[j];
					panelInner = panel.content.find(nsSel('panel-content-inner'));
					
					targetHeight = math.min(
						panelInner.height('auto').height(),
						math.floor(remainingHeight / (j + 1))
					);
					
					panelInner.height(targetHeight);
					
					remainingHeight -= targetHeight;
					
					panelText = panelInner.find(nsSel('panel-content-inner-text'));
					
					if (panelText.height() > targetHeight) {
						undone.push(panel);
						toadd += targetHeight;
						panelInner.css({
							'overflow-x': 'hidden',
							'overflow-y': 'scroll'
						});
					} else {
						panelInner.css('overflow-y', 'hidden');
					}
					
					if (panel.expanded) {
						panel.expand();
					}
				}
				
				panels = undone;
			}
		},
		
		/**
		 * Checks whether this panel should be activated (ie: made visible) for
		 * any of the elements specified in a given list of elements.
		 *
		 * We have to add a null object to the list of elements to allow us to
		 * check whether the panel should be visible when we have no effective
		 * elements in the current selection
		 *
		 * @param {Object} panel - The Panel object we will test
		 * @param {Array} elements - The effective elements (jQuery), any of
		 *							 which may activate the panel
		 */
		showActivePanel: function (panel, elements) {
			elements.push(null);
			
			var j = elements.length;
			var count = 0;
			var li = panel.content.parent('li');
			var activeOn = panel.activeOn;
			var effective = jQuery();
			
			for (var i = 0; i < j; ++i) {
				if (activeOn(elements[i])) {
					++count;
					if (elements[i]) {
						jQuery.merge(effective, elements[i]);
					}
				}
			}
			
			if (count) { 
				panel.activate(effective);
			} else {
				panel.deactivate();
			}
			
			this.roundCorners();
		},
		
		/**
		 * Sets up the functionality, event listeners, and animation of the
		 * sidebar handle
		 */
		initToggler: function () {
			var that = this;
			var bar = this.container;
			var icon = bar.find(nsSel('handle-icon'));
			var toggledClass = nsClass('toggled');
			var bounceTimer;
			var isRight = (this.position == 'right');
			
			if (this.opened) {
				this.rotateHandleArrow(isRight ? 0 : 180, 0);
			}

			// configure the position of the sidebar handle
			jQuery( function () {
				if ( typeof Aloha.settings.sidebar != 'undefined' &&
						Aloha.settings.sidebar.handle &&
						Aloha.settings.sidebar.handle.top ) {
					jQuery(bar.find(nsSel('handle'))).get(0).style.top = Aloha.settings.sidebar.handle.top;
				}
			} );

			bar.find(nsSel('handle'))
				.click(function () {
					if (bounceTimer) {
						clearInterval(bounceTimer);
					}
					
					icon.stop().css('marginLeft', 4);
					
					if (that.isOpen) {
						jQuery(this).removeClass(toggledClass);
						that.close();
						that.isOpen = false;
					} else {
						jQuery(this).addClass(toggledClass);
						that.open();
						that.isOpen = true;
					}
				}).hover(
					function () {
						var flag = that.isOpen ? -1 : 1;
						
						if (bounceTimer) {
							clearInterval(bounceTimer);
						}
						
						icon.stop();
						
						jQuery(this).stop().animate(
							isRight ? {marginLeft: '-=' + (flag * 5)} : {marginRight: '-=' + (flag * 5)},
							200
						);
						
						bounceTimer = setInterval(function () {
							flag *= -1;
							icon.animate(
								isRight ? {left: '-=' + (flag * 4)} : {right: '-=' + (flag * 4)},
								300
							);
						}, 300);
					},
					
					function () {
						if (bounceTimer) {
							clearInterval(bounceTimer);
						}
						
						icon.stop().css(isRight ? 'left' : 'right', 5);
						
						jQuery(this).stop().animate(
							isRight ? {marginLeft: 0} : {marginRight: 0},
							600, 'easeOutElastic'
						);
					}
				);
		},
		
		/**
		 * Rounds the top corners of the first visible panel, and the bottom
		 * corners of the last visible panel elements in the panels ul list
		 */
		roundCorners: function () {
			var bar = this.container;
			var lis = bar.find(nsSel('panels>li:not(', 'deactivated)'));
			var topClass = nsClass('panel-top');
			var bottomClass = nsClass('panel-bottom');
			
			bar.find(nsSel('panel-top,', 'panel-bottom'))
			   .removeClass(topClass)
			   .removeClass(bottomClass);
			
			lis.first().find(nsSel('panel-title')).addClass(topClass);
			lis.last().find(nsSel('panel-content')).addClass(bottomClass);
		},
		
		/**
		 * Updates the height of the inner div of the sidebar. This is done
		 * whenever the viewport is resized
		 */
		updateHeight: function () {
			var h = jQuery(window).height();
			this.container.height(h).find(nsSel('inner')).height(h);
		},
		
		/**
		 * Delegate all sidebar onclick events to the container.
		 * Then use handleBarclick method until we bubble up to the first
		 * significant element that we can interact with
		 */
		barClicked: function (ev) {
			this.handleBarclick(jQuery(ev.target));
		},
		
		/**
		 * We handle all click events on the sidebar from here--dispatching
		 * calls to which ever methods that should be invoked for the each
		 * interaction
		 */
		handleBarclick: function (el) {
			if (el.hasClass(nsClass('panel-title'))) {
				this.togglePanel(el);
			} else if (el.hasClass(nsClass('panel-content'))) {
				// Aloha.Log.log('Content clicked');
			} else if (el.hasClass(nsClass('handle'))) {
				// Aloha.Log.log('Handle clicked');
			} else if (el.hasClass(nsClass('bar'))) {
				// Aloha.Log.log('Sidebar clicked');
			} else {
				this.handleBarclick(el.parent());
			}
		},
		
		getPanelById: function (id) {
			return this.panels[id];
		},
		
		getPanelByElement: function (el) {
			var li = (el[0].tagName == 'LI') ? el : el.parent('li');
			return this.getPanelById(li[0].id);
		},
		
		togglePanel: function (el) {
			this.getPanelByElement(el).toggle();
		},
		
		/**
		 * Animation to rotate the sidebar arrow
		 *
		 * @param {Number} angle - The angle two which the arrow should rotate
		 *						   (0 or 180)
		 * @param {Number|String} duration - (Optional) How long the animation
		 *									 should play for
		 */
		rotateHandleIcon: function (angle, duration) {
			var arr = this.container.find(nsSel('handle-icon'));
			arr.animate({angle: angle}, {
				duration : (typeof duration == 'number' || typeof duration == 'string') ? duration : 500,
				easing   : 'easeOutExpo',
				step     : function (val, fx) {
					arr.css({
						'-o-transform'      : 'rotate(' + val + 'deg)',
						'-webkit-transform' : 'rotate(' + val + 'deg)',
						'-moz-transform'    : 'rotate(' + val + 'deg)',
						'-ms-transform'     : 'rotate(' + val + 'deg)'
					  // We cannot use Microsoft Internet Explorer filters
					  // because Microsoft Internet Explore 8 does not support
					  // Microsoft Internet Explorer filters correctly. It
					  // breaks the layout
					  // filter             : 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (angle / 90) + ')'
					});
				}
			});
		},
		
		/**
		 * Sets the handle icon to the "i am opened, click me to close the
		 * sidebar" state, or vice versa. The direction of the arrow depends
		 * on whether the sidebar is on the left or right, and whether it is
		 * in an opened state or not.
		 *
		 *	Question:
		 *		Given that the arrow icon is by default pointing right, should
		 *		we make it point left?
		 *
		 *	Answer:
		 *		isRight & isOpen   : no
		 *		isRight & isClosed : yes
		 *		isLeft  & isOpen   : yes
		 *		isLeft  & isClosed : no
		 *
		 *	Truth table:
		 *		 isRight | isOpen | XOR
		 *      ---------+--------+-----
		 *		 T       | T      | F
		 *		 T       | F      | T
		 *		 F       | T      | T
		 *		 F       | F      | F
		 *
		 * Therefore:
		 *		isPointingLeft = isRight XOR isOpen
		 *
		 * @param {Boolean} isOpened - Whether or not the sidebar is in the
		 *							   opened state
		 */
		toggleHandleIcon: function (isOpen) {
			var isPointingLeft = (this.position == 'right') ^ isOpen;
			
			if (this.settings.rotateIcons) {
				this.rotateHandleIcon(isPointingLeft ? 180 : 0, 0);
			} else {
				var icon = this.container.find(nsSel('handle-icon'));
				
				if (isPointingLeft) {
					icon.addClass(nsClass('handle-icon-left'));
				} else {
					icon.removeClass(nsClass('handle-icon-left'));
				}
			}
		},
		
		/**
		 * Slides the sidebar into view
		 */
		open: function (duration, callback) {
			if (this.isOpen) {
				return this;
			}
			
			var isRight = (this.position == 'right');
			var anim = isRight ? {marginRight: 0} : {marginLeft: 0};
			
			this.toggleHandleIcon(true);
			
			this.container.animate(
				anim,
				(typeof duration == 'number' || typeof duration == 'string')
					? duration : 500,
				'easeOutExpo'
			);
			
			if (!this.settings.overlayPage) {
				jQuery('body').animate(
					isRight ? {marginRight: '+=' + this.width} : {marginLeft: '+=' + this.width},
					500, 'easeOutExpo'
				);
			}
			
			this.isOpen = true;

			jQuery('body').trigger(nsClass('opened'), this);
			
			return this;
		},
		
		/**
		 * Slides that sidebar out of view
		 */
		close: function (duration, callback) {
			if (!this.isOpen) {
				return this;
			}

			var isRight = (this.position == 'right');
			var anim = isRight ? {marginRight: -this.width} : {marginLeft: -this.width};
			
			this.toggleHandleIcon(false);
			
			this.container.animate(
				anim,
				(typeof duration == 'number' || typeof duration == 'string')
					? duration : 500,
				'easeOutExpo'
			);
			
			if (!this.settings.overlayPage) {
				jQuery('body').animate(
					isRight ? {marginRight: '-=' + this.width} : {marginLeft: '-=' + this.width},
					500, 'easeOutExpo'
				);
			}

			this.isOpen = false;

			return this;
		},
		
		/**
		 * Activates the given panel and passes to it the given element as the
		 * the effective that we want it to think activated it.
		 *
		 * @param {Object|String} panel - Panel instance or the id of a panel
		 *								  object
		 * @param {jQuery} element - Element to pass to the panel as effective
		 *							 element (the element that activated it)
		 */
		activatePanel: function (panel, element) {
			if (typeof panel == 'string') {
				panel = this.getPanelById(panel);
			}
			
			if (panel){
				panel.activate(element);
			}
			
			this.roundCorners();
			
			return this;
		},
		
		/**
		 * Invokes the expand method for the given panel so that it expands its
		 * height to display its contents
		 *
		 * @param {Object|String} panel - Panel instance or the id of a panel
		 *								  object
		 * @param {Funtion} callback
		 */
		expandPanel: function (panel, callback) {
			if (typeof panel == 'string') {
				panel = this.getPanelById(panel);
			}
			
			if (panel){
				panel.expand(callback);
			}
			
			return this;
		},
		
		/**
		 * Collapses the panel contents by invoking the given panel's collapse
		 * method.
		 *
		 * @param {Object|String} panel - Panel instance or the id of a panel
		 *								  object
		 * @param {Funtion} callback
		 */
		collapsePanel: function (panel, callback) {
			if (typeof panel == 'string') {
				panel = this.getPanelById(panel);
			}
			
			if (panel){
				panel.collapse(callback);
			}
			
			return this;
		},
		
		/**
		 * Adds a panel to this sidebar instance.
		 * We try and build as much of the panel DOM as we can before inserting
		 * it into the DOM in order to reduce reflow.
		 *
		 * @param {Object} panel - either a panel instance or an associative
		 *			   array containing settings for the construction
		 *			   of a new panel.
		 * @param {Boolean} deferRounding - (Optional) If true, the rounding-off
		 *				    of the top most and bottom most panels
		 *				    will not be automatically done. Set
		 *				    this to true when adding a lot of panels
		 *				    at once.
		 * @return {Object} - The newly created panel.
		 */
		addPanel: function (panel, deferRounding) {
			if (!(panel instanceof Panel)) {
				if (!panel.width) {
					panel.width = this.width;
				}
				panel.sidebar = this;
				panel = new Panel(panel);
			}
			
			this.panels[panel.id] = panel;
			
			this.container.find(nsSel('panels')).append(panel.element);
			
			if (deferRounding !== true) {
				this.roundCorners();
			}
			this.checkActivePanels(Selection.getRangeObject());
			return panel;
		}
		
	});
	
	// ------------------------------------------------------------------------
	// Panel constructor
	// ------------------------------------------------------------------------
	var Panel = function Panel (opts) {
		this.id		  = null;
		this.folds	  = {};
		this.button	  = null;
		this.title	  = jQuery(renderTemplate('						 \
			<div class="{panel-title}">							 \
				<span class="{panel-title-arrow}"></span>		 \
				<span class="{panel-title-text}">Untitled</span> \
			</div>												 \
		'));
		this.content  = jQuery(renderTemplate('					\
			<div class="{panel-content}">					\
				<div class="{panel-content-inner}">			\
					<div class="{panel-content-inner-text}">\
					</div>									\
				</div>										\
			</div>											\
		'));
		this.element  = null;
		this.expanded = false;
		this.effectiveElement = null;
		this.isActive = true;
		
		this.init(opts);
	};
	
	// ------------------------------------------------------------------------
	// Panel prototype
	// ------------------------------------------------------------------------
	jQuery.extend(Panel.prototype, {
		
		init: function (opts) {
			this.setTitle(opts.title)
				.setContent(opts.content);
			
			delete opts.title;
			delete opts.content;
			
			jQuery.extend(this, opts);
			
			if (!this.id) {
				this.id = nsClass(++uid);
			}
			
			var li = this.element =
				jQuery('<li id="' +this.id + '">')
					.append(this.title, this.content);
			
			if (this.expanded){
				this.content.height('auto');
			}
			
			this.toggleTitleIcon(this.expanded);
			
			this.coerceActiveOn();
			
			// Disable text selection on title element
			this.title
				.attr('unselectable', 'on')
				.css('-moz-user-select', 'none')
				.each(function() {this.onselectstart = function() {return false;};});
			
			if (typeof this.onInit == 'function') {
				this.onInit.apply(this);
			}
		},
		
		/**
		 * @param {Boolean} isExpanded - Whether or not the panel is in an
		 *								 expanded state
		 */
		toggleTitleIcon: function (isExpanded) {
			if (this.sidebar.settings.rotateIcons) {
				this.rotateTitleIcon(isExpanded ? 90 : 0);
			} else {
				var icon = this.title.find(nsSel('panel-title-arrow'));
				
				if (isExpanded) {
					icon.addClass(nsClass('panel-title-arrow-down'));
				} else {
					icon.removeClass(nsClass('panel-title-arrow-down'));
				}
			}
		},
		
		/**
		 * Normalizes the activeOn property into a predicate function
		 */
		coerceActiveOn: function () {
			if (typeof this.activeOn != 'function') {
				var activeOn = this.activeOn;
				
				this.activeOn = (function () {
					var typeofActiveOn = typeof activeOn,
						fn;
					
					if (typeofActiveOn == 'boolean') {
						fn = function () {
							return activeOn;
						};
					} else if (typeofActiveOn == 'undefined') {
						fn = function () {
							return true;
						};
					} else if (typeofActiveOn == 'string') {
						fn = function (el) {
							return el ? el.is(activeOn) : false;
						};
					} else {
						fn = function () {
							return false;
						};
					}
					
					return fn;
				})();
			}
		},
		
		/**
		 * Activates (displays) this panel
		 */
		activate: function (effective) {
			this.isActive = true;
			this.content.parent('li').show().removeClass(nsClass('deactivated'));
			this.effectiveElement = effective;
			if (typeof this.onActivate == 'function') {
				this.onActivate.call(this, effective);
			}
		},
		
		/**
		 * Hides this panel
		 */
		deactivate: function () {
			this.isActive = false;
			this.content.parent('li').hide().addClass(nsClass('deactivated'));
			this.effectiveElement = null;
		},
		
		toggle: function () {
			if (this.expanded) {
				this.collapse();
			} else {
				this.expand();
			}
		},
		
		/**
		 * Displays the panel's contents
		 */
		expand: function (callback) {
			var that = this;
			var el = this.content;
			var old_h = el.height();
			var new_h = el.height('auto').height();
			
			el.height(old_h).stop().animate(
				{height: new_h}, 500, 'easeOutExpo',
				function () {
					if (typeof callback == 'function') {
						callback.call(that);
					}
				}
			);
			
			this.element.removeClass('collapsed');
			this.toggleTitleIcon(true);
			
			this.expanded = true;
			
			return this;
		},
		
		/**
		 * Hides the panel's contents--leaving only it's header
		 */
		collapse: function (duration, callback) {
			var that = this;
			this.element.addClass('collapsed');
			this.content.stop().animate(
				{height: 5}, 250, 'easeOutExpo',
				function () {
					if (typeof callback == 'function') {
						callback.call(that);
					}
				}
			);
			
			this.toggleTitleIcon(false);
			
			this.expanded = false;
			
			return this;
		},
		
		/**
		 * May also be called by the Sidebar to update title of panel
		 *
		 * @param html - Markup string, DOM object, or jQuery object
		 */
		setTitle: function (html) {
			this.title.find(nsSel('panel-title-text')).html(html);
			return this;
		},
		
		/**
		 * May also be called by the Sidebar to update content of panel
		 *
		 * @param html - Markup string, DOM object, or jQuery object
		 */
		setContent: function (html) {
			// We do this so that empty panels don't appear collapsed
			if (!html || html == '') {
				html = '&nbsp;';
			}
			
			this.content.find(nsSel('panel-content-inner-text')).html(html);
			return this;
		},
		
		rotateTitleIcon: function (angle, duration) {
			var arr = this.title.find(nsSel('panel-title-arrow'));
			arr.animate({angle: angle}, {
				duration : (typeof duration == 'number') ? duration : 500,
				easing   : 'easeOutExpo',
				step     : function (val, fx) {
					arr.css({
						'-o-transform'      : 'rotate(' + val + 'deg)',
						'-webkit-transform' : 'rotate(' + val + 'deg)',
						'-moz-transform'    : 'rotate(' + val + 'deg)',
						'-ms-transform'     : 'rotate(' + val + 'deg)'
					 // filter              : 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (angle / 90) + ')'
					});
				}
			});
		},
		
		/**
		 * Walks up the ancestors chain for the given effective element, and
		 * renders subpanels using the specified renderer function.
		 *
		 * @param {jQuery} effective - The effective element, whose lineage we
		 *							   want to render
		 * @param {Function} renderer - (Optional) function that will render
		 *								 each element in the parental lineage
		 *								 of the effective element
		 */
		renderEffectiveParents: function (effective, renderer) {
			var el = effective.first();
			var content = [];
			var path = [];
			var activeOn = this.activeOn;
			var l;
			var pathRev;
			
			while (el.length > 0 && !el.is('.aloha-editable')) {
				
				if (activeOn(el)) {
					path.push('<span>' + el[0].tagName.toLowerCase() + '</span>');
					l = path.length;
					pathRev = [];
					while (l--) {
						pathRev.push(path[l]);
					}
					content.push(supplant(
						'<div class="aloha-sidebar-panel-parent">' +
							'<div class="aloha-sidebar-panel-parent-path">{path}</div>' +
							'<div class="aloha-sidebar-panel-parent-content aloha-sidebar-opened">{content}</div>' +
						 '</div>',
						{
							path	: pathRev.join(''),
							content	: (typeof renderer == 'function') ? renderer(el) : '----'
						}
					));
				}
				
				el = el.parent();
			}
			
			this.setContent(content.join(''));
			
			jQuery('.aloha-sidebar-panel-parent-path').click(function () {
				var c = jQuery(this).parent().find('.aloha-sidebar-panel-parent-content');
				
				if (c.hasClass('aloha-sidebar-opened')) {
					c.hide().removeClass('aloha-sidebar-opened');
				} else {
					c.show().addClass('aloha-sidebar-opened');
				}
			});
			
			this.content.height('auto').find('.aloha-sidebar-panel-content-inner').height('auto');
		}
		
	});
	
	var left = new Sidebar({
		position : 'left',
		width	 : 250 // TODO define in config
	});
	
	var right = new Sidebar({
		position : 'right',
		width	 : 250 // TODO define in config
	});
	
	Aloha.Sidebar = {
		left  : left,
		right : right
	};
	
	return Aloha.Sidebar;
	
});

/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
// Start Closure
// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};
define('util/position',['aloha/jquery'],
function(jQuery) {
	
	
	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Class = window.Class,
		console = window.console;

/**
 * position utility, which will provide scroll and mouse positions
 * please note that the positions provided by this class are not
 * realtime - instead they are calculated with a 0.5 second delay
 */
GENTICS.Utils.Position = {};

/**
 * jquery reference to the window object
 */
GENTICS.Utils.Position.w = jQuery(window);

/**
 * contains the current scroll top and left position, and indicates if the user is currently scrolling
 * @api
 */
GENTICS.Utils.Position.Scroll = {
		top : 0,
		left : 0,
		isScrolling : false
};

/**
 * contains the scroll corrections to apply on special cases (ribbon for example)
 * @api
 */
GENTICS.Utils.Position.ScrollCorrection = {
		top : 100,
		left : 50
};

/**
 * contains the current mouse position (x,y) as well as an indicator if the mouse is moving
 * @api
 */
GENTICS.Utils.Position.Mouse = {
		x : 0,
		y : 0,
		oldX : 0,
		oldY : 0,
		isMoving : false,
		triggeredMouseStop : true
};

/**
 * contains all mousestop callbacks
 */
GENTICS.Utils.Position.mouseStopCallbacks = [];

/**
 * contains all mousemove callbacks
 */
GENTICS.Utils.Position.mouseMoveCallbacks = [];

/**
 * updates scroll position and the scrolling status
 */
GENTICS.Utils.Position.update = function () {
	// update scroll position
	var
		st = this.w.scrollTop(),
		sl = this.w.scrollLeft(),
		i;

	if (this.Scroll.isScrolling) {
		if (this.Scroll.top == st && this.Scroll.left == sl) {
			// stopped scrolling
			this.Scroll.isScrolling = false;
		}
	} else {
		if (this.Scroll.top != st || this.Scroll.left != sl) {
			// started scrolling
			this.Scroll.isScrolling = true;
		}
	}

	// update scroll positions
	this.Scroll.top = st;
	this.Scroll.left = sl;

	// check wether the user has stopped moving the mouse
	if (this.Mouse.x == this.Mouse.oldX && this.Mouse.y == this.Mouse.oldY) {
		this.Mouse.isMoving = false;
		// now check if we've triggered the mousestop event
		if (!this.Mouse.triggeredMouseStop) {
			this.Mouse.triggeredMouseStop = true;
			// iterate callbacks
			for (i=0; i<this.mouseStopCallbacks.length; i++) {
				this.mouseStopCallbacks[i].call();
			}
		}
	} else {
		this.Mouse.isMoving = true;
		this.Mouse.triggeredMouseStop = false;
		// iterate callbacks
		for (i=0; i<this.mouseMoveCallbacks.length; i++) {
			this.mouseMoveCallbacks[i].call();
		}
	}

	// update mouse positions
	this.Mouse.oldX = this.Mouse.x;
	this.Mouse.oldY = this.Mouse.y;
};

/**
 * adds a callback method which is invoked when the mouse has stopped moving
 * @param	callback	the callback method to be invoked
 * @return	index of the callback
 */
GENTICS.Utils.Position.addMouseStopCallback = function (callback) {
	this.mouseStopCallbacks.push(callback);
	return (this.mouseStopCallbacks.length - 1);
};

/**
 * adds a callback method which is invoked when the mouse is moving
 * @param	callback	the callback method to be invoked
 * @return	index of the callback
 */
GENTICS.Utils.Position.addMouseMoveCallback = function (callback) {
	this.mouseMoveCallbacks.push(callback);
	return (this.mouseMoveCallbacks.length - 1);
};


// Mousemove Hooks
jQuery(function () {
	setInterval(function (){
		GENTICS.Utils.Position.update();
	}, 500);
});

jQuery('html').mousemove(function (e) {
	GENTICS.Utils.Position.Mouse.x = e.pageX;
	GENTICS.Utils.Position.Mouse.y = e.pageY;
});

});

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

define('aloha/repositorymanager',[
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
			timer = setTimeout( function() {
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

					jQuery.merge( allitems, items );

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
			timer = setTimeout( function() {
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

/**
 * @license RequireJS i18n 0.24.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, navigator: false, define: false */

/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i18n!nls/colors".
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function () {
    //regexp for reconstructing the master bundle name from parts of the regexp match
    //nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
    //["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
    //nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
    //["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
    //so, if match[5] is blank, it means this is the top bundle definition.
    var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;

    //Helper function to avoid repeating code. Lots of arguments in the
    //desire to stay functional and support RequireJS contexts without having
    //to know about the RequireJS contexts.
    function addPart(locale, master, needed, toLoad, prefix, suffix) {
        if (master[locale]) {
            needed.push(locale);
            if (master[locale] === true || master[locale] === 1) {
                toLoad.push(prefix + locale + '/' + suffix);
            }
        }
    }

    function addIfExists(req, locale, toLoad, prefix, suffix) {
        var fullName = prefix + locale + '/' + suffix;
        if (require._fileExists(req.nameToUrl(fullName, null))) {
            toLoad.push(fullName);
        }
    }

    define('i18n',{
        version: '0.24.0',
        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, req, onLoad, config) {
            config = config || {};

            var masterName,
                match = nlsRegExp.exec(name),
                prefix = match[1],
                locale = match[4],
                suffix = match[5],
                parts = locale.split("-"),
                toLoad = [],
                value = {},
                i, part, current = "";

            //If match[5] is blank, it means this is the top bundle definition,
            //so it does not have to be handled. Locale-specific requests
            //will have a match[4] value but no match[5]
            if (match[5]) {
                //locale-specific bundle
                prefix = match[1];
                masterName = prefix + suffix;
            } else {
                //Top-level bundle.
                masterName = name;
                suffix = match[4];
                locale = config.locale || (config.locale =
                        typeof navigator === "undefined" ? "root" :
                        (navigator.language ||
                         navigator.userLanguage || "root").toLowerCase());
                parts = locale.split("-");
            }

            if (config.isBuild) {
                //Check for existence of all locale possible files and
                //require them if exist.
                toLoad.push(masterName);
                addIfExists(req, "root", toLoad, prefix, suffix);
                for (i = 0; (part = parts[i]); i++) {
                    current += (current ? "-" : "") + part;
                    addIfExists(req, current, toLoad, prefix, suffix);
                }
                req(toLoad);
                onLoad();
            } else {
                //First, fetch the master bundle, it knows what locales are available.
                req([masterName], function (master) {
                    //Figure out the best fit
                    var needed = [];

                    //Always allow for root, then do the rest of the locale parts.
                    addPart("root", master, needed, toLoad, prefix, suffix);
                    for (i = 0; (part = parts[i]); i++) {
                        current += (current ? "-" : "") + part;
                        addPart(current, master, needed, toLoad, prefix, suffix);
                    }

                    //Load all the parts missing.
                    req(toLoad, function () {
                        var i, partBundle;
                        for (i = needed.length - 1; i > -1 && (part = needed[i]); i--) {
                            partBundle = master[part];
                            if (partBundle === true || partBundle === 1) {
                                partBundle = req(prefix + part + '/' + suffix);
                            }
                            require.mixin(value, partBundle);
                        }
						
						// MODIFICATION FROM ALOHA START: add a t() function
						value.t = function(key) {
							if (this[key]) {
								return this[key];
							} else {
								return key;
							}
						}
						// END OF ALOHA MODIFICATION

						//All done, notify the loader.
                        onLoad(value);
                    });
                });
            }
        }
    });
}());

define('aloha/nls/i18n',{
	'root':  {
		'plugin.abbr.floatingmenu.tab.abbr': 'Abbreviation',
		'floatingmenu.tab.format': 'Format',
		'floatingmenu.tab.insert': 'Insert',
		'yes': 'Yes',
		'no': 'No',
		'cancel': 'Cancel',
		'repository.no_item_found': 'No item found.',
		'repository.loading': 'Loading',
		'repository.no_items_found_yet': 'No items found yet...'
	},
	'de':  true
/*	'eo':  true,
	'fi':  true,
	'fr':  true,
	'it':  true,
	'pl':  true,
	'ru':  true*/
} );
/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright � 2010-2011 Gentics Software GmbH, aloha@gentics.com
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

define('aloha/ext-alohaproxy',[
	'aloha/jquery',
	'aloha/ext',
	'aloha/repositorymanager',
	'aloha/console',
	'i18n!aloha/nls/i18n'
], function ( jQuery, Ext, RepositoryManager, console ) {
	
	
	Ext.data.AlohaProxy = function () {
		// Must define a dummy api with "read" action to satisfy
		// Ext.data.Api#prepare *before* calling super
		var api = {};
		api[ Ext.data.Api.actions.read ] = true;
		Ext.data.AlohaProxy.superclass.constructor.call( this, { api: api } );
		
		this.params = {
			queryString      : null,
			objectTypeFilter : null,
			filter           : null,
			inFolderId       : null,
			orderBy          : null,
			maxItems         : null,
			skipCount        : null,
			renditionFilter  : null,
			repositoryId     : null
		};
	};
	
	var i18n = Aloha.require( 'i18n!aloha/nls/i18n' );
	
	Ext.extend( Ext.data.AlohaProxy, Ext.data.DataProxy, {
		
		doRequest: function ( action, rs, params, reader, cb, scope, arg ) {
			jQuery.extend( this.params, params );
			
			try {
				RepositoryManager.query( this.params, function ( items ) {
					cb.call( scope, reader.readRecords( items ), arg, true );
				} );
			} catch ( ex ) {
				console.error( 'Ext.data.AlohaProxy',
					'An error occured while querying repositories.' );
				
				this.fireEvent( 'loadexception', this, null, arg, ex );
				this.fireEvent( 'exception', this, 'response', action, arg, null, ex );
				
				return false;
			}
		},
		
		setObjectTypeFilter: function ( otFilter ) {
			this.params.objectTypeFilter = otFilter;
		},
		
		getObjectTypeFilter: function () {
			return this.params.objectTypeFilter;
		},
		
		setParams: function ( p ) {
			jQuery.extend( this.params, p );
		}
		
	} );
	
} );

/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright � 2010-2011 Gentics Software GmbH, aloha@gentics.com
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

define('aloha/ext-alohareader',['aloha/ext'],
function(Ext) {
	

Ext.data.AlohaObjectReader = function(meta, recordType) {
	meta = {};
    Ext.applyIf(meta, {
		idProperty: 'id',
		root: 'items',
		totalProperty: 'results',
		// TODO implement all defined optional attributes
		fields: [
			'id',
			'url',
			'name',
			'type',
			'weight',
			'path',
			'repositoryId'
		]
    });
    Ext.data.JsonReader.superclass.constructor.call(this, meta, meta.fields);
};

Ext.extend(Ext.data.AlohaObjectReader, Ext.data.JsonReader, {
	// extend of necessary
});

});

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

define('aloha/ext-alohatreeloader',['aloha/ext', 'aloha/repositorymanager'],
function(Ext, RepositoryManager) {
	

Ext.tree.AlohaTreeLoader = function(config) {
	Ext.apply(this, config);
	Ext.tree.AlohaTreeLoader.superclass.constructor.call(this);
};

Ext.extend( Ext.tree.AlohaTreeLoader, Ext.tree.TreeLoader, {
	paramOrder: ['node', 'id'],
	nodeParameter: 'id',
	directFn : function(node, id, callback) {
		var
			params = {
				inFolderId: node.id,
				objectTypeFilter: this.objectTypeFilter,
				repositoryId: node.repositoryId
			};

		RepositoryManager.getChildren ( params, function( items ) {
			var response = {};

			response = {
				status: true,
				scope: this,
				argument: {callback: callback, node: node}
			};

			if(typeof callback === 'function'){
				callback(items, response);
			}
		});
	},
	createNode: function(node) {
		if ( node.name ) {
			node.text = node.name;
		}
		if ( node.hasMoreItems ) {
			node.leaf = !node.hasMoreItems;
		}
		if ( node.objectType ) {
			node.cls = node.objectType;
		}
        return Ext.tree.TreeLoader.prototype.createNode.call(this, node);
    },
	objectTypeFilter : null,
	setObjectTypeFilter : function (otFilter) {
		this.objectTypeFilter = otFilter;
	},
	getObjectTypeFilter : function () {
		return this.objectTypeFilter;
	}
});

});

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

define('aloha/ui',['aloha/core', 'util/class', 'aloha/jquery', 'aloha/floatingmenu', 'aloha/ext', 'aloha/console', 'i18n!aloha/nls/i18n'],
function(Aloha, Class, jQuery, FloatingMenu, Ext, console, i18n) {
	
	
	var
//		$ = jQuery,
//		Aloha = window.Aloha,
//		Ext = window.Ext,
//		Class = window.Class;
	GENTICS = window.GENTICS;

	// Ensure Namespace
	Aloha.ui = Aloha.ui || {};
	
	// internationalize ext js message box buttons
	Ext.MessageBox.buttonText.yes = i18n.t('yes');
	Ext.MessageBox.buttonText.no = i18n.t('no');
	Ext.MessageBox.buttonText.cancel = i18n.t('cancel');

	/**
	 * This is the Gentics Version of the ExtJS Menu. It is necessary to extend the
	 * Ext.menu.Menu in order to stop propagation of the mousedown event on the DOM
	 * element of the menu, because a click in the menu shall not deactivate the
	 * editable.
	 */
	Ext.ux.GENTICSMenu = Ext.extend(Ext.menu.Menu, {
		/**
         * overwrite onRender
         */
		onRender: function() {
            // call the super method
            Ext.ux.GENTICSMenu.superclass.onRender.apply(this, arguments);

            // stop propagation of the mousedown event
            jQuery(this.el.dom).mousedown(function (e) {
                e.stopPropagation();
            });
		}
	});

/**
 * Constructor for an Aloha button.
 * @namespace Aloha.ui
 * @class Button
 * @param {Object} properties Properties of the button:
 * - label: Label that is displayed on the button.
 * - onclick: Callback function of the button when activated.
 * - menu: Array of Aloha.ui.Button elements that are displayed as drop-down menu.
 * - iconClass: Icon displayed on the button.
 * - icon: URL to an icon that is displayed on the button.
 * - toggle: Boolean that indicates if the button is a toggle button.
 */
Aloha.ui.Button = Class.extend({
	_constructor: function(properties) {
		this.init(properties);
	},

	/**
	 * Init method for an Aloha button.
	 * This method is necessary due to JS specific initalization.
	 * @namespace Aloha.ui
	 * @class Button
	 * @param {Object} properties Properties of the button:
	 * - label: Label that is displayed on the button.
	 * - onclick: Callback function of the button when activated.
	 * - menu: Array of Aloha.ui.Button elements that are displayed as drop-down menu.
	 * - iconClass: Icon displayed on the button.
	 * - icon: URL to an icon that is displayed on the button.
	 * - toggle: Boolean that indicates if the button is a toggle button.
	 */
	init: function(properties) {
		/**
		 * Label that is displayed on the button
		 * @hide
		 */
		this.label = false;

		/**
		 * Name for the button
		 */
		this.name = false;
		
		/**
		 * CSS class for an icon on the button
		 * @hide
		 */
		this.iconClass = false;

		/**
		 * URL to an icon to display on the button
		 * @hide
		 */
		this.icon = false;

		/**
		 * Callback function when the button is activated.
		 * The "this" variable refers to the button inside the callback function.
		 * @hide
		 */
		this.onclick = false;

		/**
		 * Array of buttons that are displayed in a drop down menu.
		 * If a menu is provided and no onclick callback then clicking the button also opens the menu
		 * @hide
		 */
		this.menu = null;

		/**
		 * Indicates if the button is a toggle button
		 * @hide
		 */
		this.toggle = false;

		/**
		 * Property that indicates if the button is in pressed state
		 * @hide
		 */
		this.pressed = false;

		/**
		 * Property that indicates whether the button is currently visible
		 * @hide
		 */
		this.visible = true;

		/**
		 * Property that indicates whether the button is currently enabled
		 * @hide
		 */
		this.enabled = true;

		/**
		 * Tooltip text
		 * @hide
		 */
		this.tooltip = false;

		/**
		 * holds the ext object of the button
		 * @hide
		 */
		this.extButton = null;

		/**
		 * holds the listeners of the button
		 * @hide
		 */
		this.listenerQueue = [];

		GENTICS.Utils.applyProperties(this, properties);

		// use icon class as a fallback for name		
		if (this.name === false) {
			this.name = this.iconClass;
		}

		/**
		 * Unique Id of the button
		 * @hide
		 */
		this.id = this.generateId();
	},

	/**
	 * Generate a unique id for the button
	 * @return unique id
	 * @hide
	 */
	generateId: function () {
		Aloha.ui.Button.idCounter = Aloha.ui.Button.idCounter + 1;
		return 'aloha-button' + Aloha.ui.Button.idCounter;
	},

	/**
	 * Set the 'pressed' state of the button if it is a toggle button
	 * @param {bool} pressed true when the button shall be 'pressed', false if not
	 */
	setPressed: function(pressed) {
		if (this.toggle) {
			this.pressed = pressed;
			if (typeof this.extButton === 'object' && this.extButton != null && this.extButton.pressed != pressed) {
				this.extButton.toggle(this.pressed);
			}
		}
	},

	/**
	 * Indicates if the button is currently in "pressed" state.
	 * This is only relevant if the button is a toggle button.
	 * If the button is no toggle button this function always returns false.
	 * @return {bool} True if the button is pressed, false otherwise.
	 */
	isPressed: function() {
		if (this.toggle) {
			return this.pressed;
		}
		return false;
	},

	/**
	 * Show the button. When this button is added to the FloatingMenu, it is
	 * necessary to call FloatingMenu.doLayout() after the visibility
	 * of the button is changed
	 */
	show: function() {
		this.visible = true;
	},

	/**
	 * Hide the button. When this button is added to the FloatingMenu, it is
	 * necessary to call FloatingMenu.doLayout() after the visibility
	 * of the button is changed
	 */
	hide: function() {
		this.visible = false;
	},

	/**
	 * Check whether the button is visible or not
	 * @return true when the button is visible, false if not
	 */
	isVisible: function() {
		return this.visible;
	},

	/**
	 * Enable the button - make it clickable
	 */
	enable: function() {
		this.enabled = true;
		if (typeof this.extButton === 'object') {
			this.extButton.enable();
		}
	},

	/**
	 * Disable the button
	 */
	disable: function() {
		this.enabled = false;
		if (typeof this.extButton === 'object') {
			this.extButton.disable();
		}
	},

	/**
	 * Check whether the button is currently enabled
	 * @return true when the button is enabled, false if it is disabled
	 */
	isEnabled: function() {
		return this.enabled;
	},

	/**
	 * Get the Ext menu from this button
	 * @return Ext menu
	 * @hide
	 */
	getExtMenu: function() {
		var menu, i, entry;
		if ( this.menu && typeof this.menu === 'object') {
			// build the drop down menu
			menu = new Ext.ux.GENTICSMenu();
			for (i = 0; i < this.menu.length; ++i) {
				entry = this.menu[i];
				menu.addItem(new Ext.menu.Item(entry.getExtMenuConfigProperties()));
			}
		}
		return menu;
	},

	/**
	 * Get the config properties for this button as menu entry
	 * @return config properties for this button as menu entry
	 * @hide
	 */
	getExtMenuConfigProperties: function() {
		var me = this,
			submenu = this.getExtMenu();

		return {
			text: this.label,
			icon: this.icon,
			iconCls: this.iconClass,
			handler: function () {
				if (typeof me.onclick == 'function') {
					me.onclick();
				}
			},
			menu: submenu
		};
	},

	/**
	 * Return an object containing the config properties to generate this button
	 * @return config properties
	 * @hide
	 */
	getExtConfigProperties: function() {
		var me = this,
			menu = this.getExtMenu(),

		// configuration for the button
			buttonConfig = {
			text : this.label,
			enableToggle: this.toggle,
			pressed : this.pressed,
			icon: this.icon,
			iconCls: this.iconClass,
			scale : this.scale||this.size,
			width : this.width||undefined,
			rowspan : this.rowspan || ((this.size == 'large' || this.size == 'medium') ? 2 : 1),
			menu : menu,
			handler : function(element, event) {
				if (typeof me.onclick === 'function') {
					me.onclick.apply(me, [element, event]);
				}
				if ( me.toggle ) {
					me.pressed = !me.pressed;
				}
			},
			xtype : (menu && typeof this.onclick == 'function') ? 'splitbutton' : 'button',
			tooltipType : 'qtip',
			tooltip : this.tooltip,
			id : this.id,
		    arrowAlign: this.arrowAlign || (this.size == 'large' || this.size == 'small' ? 'right' : 'bottom')
		};

		return buttonConfig;
	}
});

/**
 * id counter, for generation of unique id's for the buttons
 * @hide
 */
Aloha.ui.Button.idCounter = 0;

/**
 * extJS Multi Split Button
 *
 * Display a Word-like formatting selection button
 * Selection images are typically 52*42 in size
 *
 * Example configuration
 * xtype : 'genticsmultisplitbutton',
 * items : [{
 *   'name'  : 'normal', // the buttons name, used to identify it
 *   'title' : 'Basic Text', // the buttons title, which will be displayed
 *	 'icon'  : 'img/icon.jpg', // source for the icon
 *	 'click' : function() { alert('normal'); } // callback if the button is clicked
 *   'wide'  : false // wether it's a wide button, which would be dispalyed at the bottom
 * }]
 *
 * you might want to check out the tutorial at
 * http://www.extjs.com/learn/Tutorial:Creating_new_UI_controls
 * @hide
 */
Ext.ux.MultiSplitButton = Ext.extend(Ext.Component, {
	initComponent: function() {
		var me = this;
		this.on('beforehide', function() {
			me.closePanel();
		});
	},
	/**
	 * add a css class to the wrapper-div autogenerated by extjs
	 * @hide
	 */
	autoEl: {
		cls: 'aloha-multisplit-wrapper'
	},

	/**
	 * will contain a reference to the ul dom object
	 * @hide
	 */
	ulObj: null,

	/**
	 * holds a reference to the expand button
	 * @hide
	 */
	panelButton: null,

	/**
	 * hold a reference to the wrapper div
	 * @hide
	 */
	wrapper: null,

	/**
	 * true if the panel is expanded
	 * @hide
	 */
	panelOpened: false,

	/**
	 * get items for the multisplit button according to config
	 * configuration for a multisplit button has to be stored
	 * within an array:
	 *
	 *		Aloha.settings.components.[MULTISPLITBUTTON-NAME] = [ 'item1', 'item2' ];
	 *
	 * An example for that would be:
	 *
	 *		// settings for phrasing element for the format plugin
	 *		Aloha.settings.components.phrasing = [ 'h1', 'h2', 'h3', 'removeFormat' ];
	 *
	 * if there is no config available, it will just use all items available
	 * @return button items for this multisplit button
	 */
	_getItems: function() {
		var that = this,
			items = [],
			i, length;
		
		if (Aloha.settings.components &&
			Aloha.settings.components[this.name] &&
			typeof Aloha.settings.components[this.name] === 'object') {
			// iterate over all buttons in our config...
			jQuery.each(Aloha.settings.components[this.name], function (idx, button) {
				for (i = 0, length = that.items.length; i < length; i++) {
					if (that.items[i].name === button) {
						// ... and find the appropriate internal button
						items.push(that.items[i]);
						break;
					}
				}
			});
			return items;
		} else {
			return this.items;
		}
	},

	/**
	 * render the multisplit button
	 * @return void
	 * @hide
	 */
	onRender: function() {
		Ext.ux.MultiSplitButton.superclass.onRender.apply(this, arguments);
		// create a reference to this elements dom object
		this.wrapper = jQuery(this.el.dom);

		var
			me = this,
			i,
			item,
			items,
			html = '<ul class="aloha-multisplit">';

		items = this._getItems(); 

		// add a new button to the list for each configured item
		for (i=0; i<items.length; i++) {
			item = items[i];
			if (typeof item.visible == 'undefined') {
				item.visible = true;
			}
			// wide buttons will always be rendered at the bottom of the list
			if (item.wide) {
				continue;
			}
			html += '<li>' +
				'<button xmlns:ext="http://www.extjs.com/" class="' + item.iconClass + '" ext:qtip="' + item.tooltip + '" gtxmultisplititem="' + i + '">&#160;</button>' +
				'</li>';
		}

        // now add the wide buttons at the bottom of the list
		for (i=0; i<items.length; i++) {
			item = items[i];
			// now only wide buttons will be rendered
			if (!item.wide) {
				continue;
			}

			html += '<li>' +
				'<button xmlns:ext="http://www.extjs.com/" class="aloha-multisplit-wide ' + item.iconClass + '" ext:qtip="' + item.tooltip + '" gtxmultisplititem="' + i + '">' +
				item.text + '</button>' +
				'</li>';
		}

		html += '</ul>';

		// register on move event, which occurs when the panel was dragged
		// this should be done within the constructor, but ist not possible there
		// since the extTabPanel will not be initialized at this moment
		FloatingMenu.extTabPanel.on('move', function () {
			me.closePanel();
		});
		FloatingMenu.extTabPanel.on('tabchange', function () {
			me.closePanel();
		});

		// add onclick event handler
		this.ulObj = jQuery(this.el.createChild(html).dom)
		.click(function (event) {
			me.onClick(event);
		});

		// add the expand button
		this.panelButton = jQuery(
			this.el.createChild('<button class="aloha-multisplit-toggle aloha-multisplit-toggle-open">&#160;</button>').dom
		)
		.click(function () {
			me.togglePanel();
		});
  },

	/**
	 * callback if a button has been clicked
	 * @param event jquery event object
	 * @return void
	 * @hide
	 */
  onClick: function(event) {
		// check if the element has a gtxmultisplititem attribute assigned
		if (!event.target.attributes.gtxmultisplititem) {
			return;
		}
		var el = jQuery(event.target);

		// collapse the panel
		this.closePanel();

		// wide buttons cannot become the active element
		if (!el.hasClass('aloha-multisplit-wide')) {
			this.setActiveDOMElement(el);
		}

		// invoke the items function
		this.items[event.target.attributes.gtxmultisplititem.value].click();
  },

	/**
	 * set the active item specified by its name
	 * @param name the name of the item to be marked as active
	 * @return void
	 * @hide
	 */
	setActiveItem: function(name) {
		var button;

		// collapse the panel
		this.closePanel();

		button = jQuery('#' + this.id + ' .aloha-button-' + name);
		if (button.length === 1) {
			this.setActiveDOMElement(button);
			this.activeItem = name;
		} else {
			this.setActiveDOMElement(null);
			this.activeItem = null;
		}
    },

	/**
	 * mark an item as active
	 * @param el jquery obj for item to be marked as active
	 * @return void
	 * @hide
	 */
	setActiveDOMElement: function(el) {
		// when the component (or one of its owners) is currently hidden, we need to set the active item later
		var ct = this, top;
		while (typeof ct !== 'undefined') {
			if (ct.hidden) {
				this.activeDOMElement = el;
				return;
			}
			ct = ct.ownerCt;
		}

		jQuery(this.ulObj).find('.aloha-multisplit-activeitem').removeClass('aloha-multisplit-activeitem');
		if(el) {
			el.parent().addClass('aloha-multisplit-activeitem');
		}

		if ( !el || el.parent().is(':hidden')) {
			return;
		}

		// reposition multisplit contents to the active item
		if ( el && this.ulObj ) {
			this.ulObj.css('margin-top', 0);
			top = el.position().top;
			this.ulObj.css({
				'margin-top': - top + 6,
				'height': 46 + top - 6
			});
		}

		this.activeDOMElement = undefined;
    },
	/**
	 * toggle the panel display from closed to expanded or vice versa
	 * @return void
	 * @hide
	 */
	togglePanel: function() {
		if (this.panelOpened) {
			this.closePanel();
		} else {
			this.openPanel();
		}
    },

    /**
     * expand the button panel
     * @return void
     * @hide
     */
    openPanel: function() {
		if (this.panelOpened) {
			return;
		}

		var o = this.wrapper.offset();

		// detach the ul element and reattach it onto the body
		this.ulObj
			.appendTo(jQuery('body'))
			.addClass('aloha-multisplit-expanded')
			.mousedown(function (e) {
				e.stopPropagation();
			})
			.css({
				// relocate the ul
				'top': o.top - 1,
				'left': o.left - 1
			})
			.animate({
				// display expand animation
				height: (this.ulObj.prop)?this.ulObj.prop('scrollHeight'):this.ulObj.attr('scrollHeight')
			});

		// TODO change to css
		this.panelButton
			.removeClass('aloha-multisplit-toggle-open')
			.addClass('aloha-multisplit-toggle-close');
		this.panelOpened = true;
    },

    /**
     * collapses the panel
     * @return void
     * @hide
     */
    closePanel: function() {
		if (!this.panelOpened) {
			return;
		}

		this.ulObj
			.removeClass('aloha-multisplit-expanded')
			.appendTo(this.wrapper);

		// TODO change to css
		this.panelButton
			.addClass('aloha-multisplit-toggle-open')
			.removeClass('aloha-multisplit-toggle-close');
		this.panelOpened = false;
	},

	/**
	 * hides a multisplit item
	 * @return void
	 * @hide
	 */
	hideItem: function(name) {
		for (var i = 0; i<this.items.length; i++) {
			if (this.items[i].name == name) {
				this.items[i].visible = false;
				// hide the corresponding dom object
				jQuery('#' + this.id + ' [gtxmultisplititem=' + i + ']').parent().hide();
				return;
			}
		}
	},

	/**
	 * shows an item
	 * @return void
	 * @hide
	 */
	showItem: function(name) {
		for (var i = 0; i<this.items.length; i++) {
			if (this.items[i].name == name) {
				this.items[i].visible = true;
				// hide the corresponding dom object
				jQuery('#' + this.id + ' [gtxmultisplititem=' + i + ']').parent().show();
				return;
			}
		}
	}
});
Ext.reg('alohamultisplitbutton', Ext.ux.MultiSplitButton);

/**
 * Aloha MultiSplit Button
 * @namespace Aloha.ui
 * @class MultiSplitButton
 * @param {Object} properties properties object for the new multisplit button
 *		however you just have to fill out the items property of this object
 *		items : [{
 *			'name'  : 'normal', // the buttons name, used to identify it
 *			'tooltip' : 'Basic Text', // the buttons tooltip, which will be displayed on hover
 *			'text'	: 'Basic Text', // text to display on wide buttons
 *			'icon'  : 'img/icon.jpg', // source for the icon
 *			'click' : function() { alert('normal'); } // callback if the button is clicked
 *			'wide'  : false // whether it's a wide button, which would be dispalyed at the bottom
 *		}]
 */
Aloha.ui.MultiSplitButton = Class.extend({
	_constructor: function(properties) {
		/**
		 * Items in the Multisplit Button
		 * @hide
		 */
		this.items = [];
		GENTICS.Utils.applyProperties(this, properties);

		/**
		 * unique id for all buttons
		 * @hide
		 */
		this.id = this.generateId();
	},

	/**
	 * Generate a unique id for the button
	 * @return unique id
	 * @hide
	 */
	generateId: function () {
		Aloha.ui.MultiSplitButton.idCounter = Aloha.ui.MultiSplitButton.idCounter + 1;
		return 'aloha-multisplitbutton' + Aloha.ui.MultiSplitButton.idCounter;
	},

	/**
	 * Return an object containing the config properties to generate this button
	 * @return config properties
	 * @hide
	 */
	getExtConfigProperties: function() {
		return {
			'xtype' : 'alohamultisplitbutton',
			'items' : this.items,
			'name' : this.name,
			'id' : this.id
		};
	},

	/**
	 * Set the active item of the multisplitbutton
	 * @param {String} name	name of the item to be set active
	 */
	setActiveItem: function(name) {
		if (this.extButton && typeof name !== 'undefined') {
			this.extButton.setActiveItem(name);
		}
	},

	/**
	 * check whether the multisplit button is visible
	 * @return boolean true if visible
	 */
	isVisible: function() {
		// if all items are hidden, disable this item
		for (var i=0; i<this.items.length; i++) {
			// if just one item is visible that's enough
			if (this.items[i].visible) {
				return true;
			}
		}
		return false;
	},

	/**
	 * shows an item of the multisplit button
	 * @param {String} name the item's name
	 */
	showItem: function(name) {
		if (typeof this.extButton === 'undefined') {
			return;
		}
		this.extButton.showItem(name);
	},

	/**
	 * hides an item of the multisplit button
	 * @param {String} name the item's name
	 */
	hideItem: function(name) {
		if (typeof this.extButton === 'undefined') {
			return;
		}
		this.extButton.hideItem(name);
	}
});

/**
 * Method to access translations
 * @deprecated
 * This will be removed in one of the next version
 */
Aloha.i18n = function(component, key, replacements) {
	console.deprecated ('Aloha', 'i18n() is deprecated. Use module "i18n!aloha/nls/i18n" instead.');
	return key;
};


/**
 * Displays a message according to it's type
 * @method
 * @param {Aloha.Message} message the Aloha.Message object to be displayed
 */
Aloha.showMessage = function (message) {

	if (FloatingMenu.obj) {
		FloatingMenu.obj.css('z-index', 8900);
	}

	switch (message.type) {
		case Aloha.Message.Type.ALERT:
			Ext.MessageBox.alert(message.title, message.text, message.callback);
			break;
		case Aloha.Message.Type.CONFIRM:
			Ext.MessageBox.confirm(message.title, message.text, message.callback);
			break;
		case Aloha.Message.Type.WAIT:
			Ext.MessageBox.wait(message.text, message.title);
			break;
		default:
			Aloha.log('warn', this, 'Unknown message type for message {' + message.toString() + '}');
			break;
	}
};

/**
 * Hides the currently active modal, which was displayed by showMessage()
 * @method
 */
Aloha.hideMessage = function () {
	Ext.MessageBox.hide();
};

/**
 * checks if a modal dialog is visible right now
 * @method
 * @return true if a modal is currently displayed
 */
Aloha.isMessageVisible = function () {
	return Ext.MessageBox.isVisible();
};

/**
 * id counter, for generation of unique id's for the buttons
 * @hide
 */
Aloha.ui.MultiSplitButton.idCounter = 0;

return Aloha.ui;

});

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

define('aloha/ui-attributefield',[ 'aloha/core', 'aloha/jquery', 'aloha/ext', 'i18n!aloha/nls/i18n', 'aloha/ui',
  'aloha/repositorymanager', 'aloha/selection', 'aloha/ext-alohaproxy',
  'aloha/ext-alohareader'
], function ( Aloha, jQuery, Ext, i18n, Ui, RepositoryManager, Selection ) {
// TODO add parameter for UI class after refactoring UI to requirejs
	

var undefined = void 0;

var extTemplate = function ( tpl ) {
	if ( tpl ) {
		tpl = '<tpl for="."><div class="x-combo-list-item">' +
			'<tpl if="this.hasRepositoryTemplate(values)">{[ this.renderRepositoryTemplate(values) ]}</tpl>' +
			'<tpl if="!this.hasRepositoryTemplate(values)">' + tpl + '</tpl>' +
			'</div></tpl>';
	} else {
		tpl = '<tpl for="."><div class="x-combo-list-item">' +
			'<tpl if="this.hasRepositoryTemplate(values)">{[ this.renderRepositoryTemplate(values) ]}</tpl>' +
			'<tpl if="!this.hasRepositoryTemplate(values)"><span><b>{name}</b></span></tpl>' +
			'</div></tpl>';
	}
	return new Ext.XTemplate(
		tpl,
		{
			hasRepositoryTemplate : function ( values ) {
				var rep = RepositoryManager.getRepository( values.repositoryId );
				return rep && rep.hasTemplate();
			},
			renderRepositoryTemplate : function ( values ) {
				var rep = RepositoryManager.getRepository( values.repositoryId );
				if ( rep && rep.hasTemplate() ) {
				// create extTemplate if template changed
				if ( !rep._ExtTPL || rep.template !== rep._ExtTPLcache ) {
					rep._ExtTPL = new Ext.XTemplate( rep.template );
					rep._ExtTPLcache = rep.template;
				}
				return rep._ExtTPL.apply( values );
			}
		}
	} );
};


// This will store the last attribute value. We need to keep track of this value
// due to decide whether to update the value on finish editing
var lastAttributeValue;

Ext.ux.AlohaAttributeField = Ext.extend( Ext.form.ComboBox, {
	typeAhead     : false,
	mode          : 'remote',
	triggerAction : 'all',
	width         : 300,
	hideTrigger   : true,
	minChars      : 3,
	valueField    : 'id',
	displayField  : 'name',
	listEmptyText : i18n.t( 'repository.no_item_found' ),
	loadingText   : i18n.t( 'repository.loading' ) + '...',
	enableKeyEvents : true,
	store: new Ext.data.Store( {
		proxy: new Ext.data.AlohaProxy(),
		reader: new Ext.data.AlohaObjectReader()
	} ),
    clickAttached: false, // remember that the click event has been attached to the innerList, as this is not implemented in the combobox
    tpl      : extTemplate(),
    onSelect : function ( item ) {
		this.setItem( item.data );
		if ( typeof this.alohaButton.onSelect == 'function' ) {
			this.alohaButton.onSelect.call( this.alohaButton, item.data );
		}
		this.collapse();
	},
	finishEditing : function () {
		var target = jQuery( this.getTargetObject() ), color;
		
		// Remove the highlighting and restore original color if was set before
		if ( target ) {
			if ( color = target.attr( 'data-original-background-color' ) ) {
				jQuery( target ).css( 'background-color', color );
			} else {
				jQuery( target ).css( 'background-color', '' );
			}
			jQuery( target ).removeAttr( 'data-original-background-color' );
		}
		
		// Check whether the attribute was changed since the last focus event. Return early when the attribute was not changed.
		if ( lastAttributeValue === target.attr( this.targetAttribute ) ) {
			return;
		}

		// when no resource item was selected, remove any marking of the target object
		if ( !this.resourceItem ) {
			RepositoryManager.markObject( this.targetObject );
		}

		if ( this.getValue() === '' ) {
			if ( this.wrap ) {
				jQuery( this.wrap.dom.children[0] ).css( 'color', '#AAA' );
			}
			this.setValue( this.placeholder );
		}
	},
    listeners: {
		// repository object types could have changed
		'beforequery': function ( event ) {
			if ( this.noQuery ) {
				event.cancel = true;
				return;
			}
			if ( this.store !== null && this.store.proxy !== null ) {
				this.store.proxy.setParams( {
					objectTypeFilter: this.getObjectTypeFilter(),
					queryString: event.query
				} );
			}
		},
		'afterrender': function ( obj, event ) {
			jQuery( this.wrap.dom.children[0] ).css( 'color', '#AAA' );
			this.setValue( this.placeholder );
		},
		'keydown': function ( obj, event ) {
			// on ENTER or ESC leave the editing
			// just remember here the status and remove cursor on keyup event
			// Otherwise cursor moves to content and no more blur event happens!!??
			if ( event.keyCode == 13 || event.keyCode == 27 ) {
				if ( this.isExpanded() ) {
					this.ALOHAwasExpanded = true;
				} else {
					this.ALOHAwasExpanded = false;
				}
				event.preventDefault();
			}
		},
		'keyup': function ( obj, event ) {
			if ( ( event.keyCode == 13 || event.keyCode == 27 ) &&
					!this.ALOHAwasExpanded ) {
				// work around stupid behavior when moving focus
				setTimeout( function () {
					// Set focus to link element and select the object
					Selection.getRangeObject().select();
				}, 0 );
			}

			// when a resource item was (initially) set, but the current value
			// is different from the reference value, we unset the resource item
			if ( this.resourceItem &&
					this.resourceValue !== this.wrap.dom.children[0].value ) {
				this.resourceItem = null;
				this.resourceValue = null;
			}

			// update attribute, but only if no resource item was selected
			if ( !this.resourceItem ) {
				var v = this.wrap.dom.children[0].value;
				this.setAttribute( this.targetAttribute, v );
			}
		},
		'focus': function ( obj, event ) {
			// set background color to give visual feedback which link is modified
			var	target = jQuery( this.getTargetObject() ),
				s = target.css( 'background-color' );
			
			if ( this.getValue() === this.placeholder ) {
				this.setValue( '' );
				jQuery( this.wrap.dom.children[0] ).css( 'color', 'black' );
			}
			if ( target && target.context && target.context.style &&
					target.context.style[ 'background-color' ] ) {
				target.attr( 'data-original-background-color',
					target.context.style[ 'background-color' ] );
			}
			target.css( 'background-color', '#80B5F2' );
		},
		'blur': function ( obj, event ) {
			this.finishEditing();
		},
		'hide': function ( obj, event ) {
			this.finishEditing();
		},
		'expand': function ( combo ) {
			if ( this.noQuery ) {
				this.collapse();
			}
			if ( !this.clickAttached ) {
				var that = this;
				// attach the mousedown event to set the event handled,
				// so that the editable will not get deactivated
				this.mon( this.innerList, 'mousedown', function ( event ) {
					Aloha.eventHandled = true;
				}, this );
				// in the mouseup event, the flag will be reset
				this.mon( this.innerList, 'mouseup', function ( event ) {
					Aloha.eventHandled = false;
				}, this );
				this.clickAttached = true;
			}
		}
	},
	setItem: function ( item, displayField ) {
		this.resourceItem = item;
		
		if ( item ) {
			displayField = ( displayField ) ? displayField : this.displayField;
			// TODO split display field by '.' and get corresponding attribute, because it could be a properties attribute.
			var v = item[ displayField ];
			// set the value into the field
			this.setValue( v );
			// store the value to be the "reference" value for the currently selected resource item
			this.resourceValue = v;
			// set the attribute to the target object
			this.setAttribute( this.targetAttribute, item[ this.valueField ] );
			// call the repository marker
			RepositoryManager.markObject( this.targetObject, item );
		} else {
			// unset the reference value, since no resource item is selected
			this.resourceValue = null;
		}
	},
	getItem: function () {
		return this.resourceItem;
	},
	// Private hack to allow attribute setting by regex
	setAttribute: function ( attr, value, regex, reference ) {
		var setAttr = true, regxp;
		if ( this.targetObject) {
			// check if a reference value is submitted to check against with a regex
			if ( typeof reference != 'undefined' ) {
				regxp = new RegExp( regex );
				if ( !reference.match( regxp ) ) {
					setAttr = false;
				}
			}

			// if no regex was successful or no reference value
			// was submitted remove the attribute
			if ( setAttr ) {
				jQuery( this.targetObject ).attr( attr, value );
			} else {
				jQuery( this.targetObject ).removeAttr( attr );
			}
		}
	},
	setTargetObject : function ( obj, attr ) {
	    var that = this;
		this.targetObject = obj;
	    this.targetAttribute = attr;
	    this.setItem( null );
	    
	    if ( obj && attr ) {
	    	lastAttributeValue = jQuery( obj ).attr( attr );
	    }

		if ( this.targetObject && this.targetAttribute ) {
			this.setValue( jQuery( this.targetObject ).attr( this.targetAttribute ) );
		} else {
			this.setValue( '' );
		}

		// check whether a repository item is linked to the object
		var that = this;
		RepositoryManager.getObject( obj, function ( items ) {
			if ( items && items.length > 0 ) {
				that.setItem( items[0] );
			}
		} );
	},
	getTargetObject : function () {
	    return this.targetObject;
	},
	setObjectTypeFilter : function ( otFilter ) {
		this.objectTypeFilter = otFilter;
	},
	getObjectTypeFilter : function () {
		return this.objectTypeFilter;
	},
	noQuery: true
});

/**
 * Register the Aloha attribute field
 * @hide
 */
Ext.reg( 'alohaattributefield', Ext.ux.AlohaAttributeField );

/**
 * Aloha Attribute Field Button
 * @namespace Aloha.ui
 * @class AttributeField
 */
Ui.AttributeField = Ui.Button.extend( {
	_constructor: function ( properties ) {
		/**
		 * @cfg Function called when an element is selected
		 */
		this.onSelect = null;
		this.listenerQueue = [];
		this.objectTypeFilter = null;
		this.tpl = null;
		this.displayField = null;
		this.valueField = null;

		this.init( properties );
	},

	/**
	 * Create a extjs alohaattributefield
	 * @hide
	 */
	getExtConfigProperties: function () {
		var props = {
		    alohaButton : this,
		    xtype       : 'alohaattributefield',
		    rowspan     : this.rowspan || undefined,
		    width       : this.width || undefined,
		    placeholder : this.placeholder || undefined,
		    id          : this.id,
		    cls         : this.cls || undefined
		};
		if ( this.valueField ) {
			props.valueField = this.valueField;
		}
		if ( this.displayField ) {
			props.displayField = this.displayField;
		}
		if ( this.minChars ) {
			props.minChars = this.minChars;
		}
		return props;
	},

	/**
	 * Sets the target Object of which the Attribute should be modified
	 * @param {jQuery} obj the target object
	 * @param {String} attr Attribute to be modified ex. "href" of a link
	 * @void
	 */
	setTargetObject: function ( obj, attr ) {
		if ( this.extButton ) {
			this.extButton.setTargetObject( obj, attr );
		}
	},

	/**
	 * @return {jQuery} object Returns the current target Object
	 */
	getTargetObject: function () {
		return this.extButton ? this.extButton.getTargetObject() : null;
	},

	/**
	 * Focus to this field
	 * @void
	 */
	focus: function () {
		if ( this.extButton ) {
			this.extButton.focus();
			if ( this.extButton.getValue().length > 0 ) {
				this.extButton.selectText( 0, this.extButton.getValue().length );
			}
		}
	},

	/**
	 * Adding a listener to the field
	 * @param {String} eventname The name of the event. Ex. 'keyup'
	 * @param {function} handler The function that should be called when the event happens.
	 * @param {Object} scope The scope object which the event should be attached
	 */
	addListener: function ( eventName, handler, scope ) {
		var listener;

		if ( this.extButton ) {
			this.extButton.addListener( eventName, handler, null );
		} else {
			// if extButton not yet initialized adding listeners could be a problem
			// so all events are collected in a queue and added on initalizing
			listener = {
				'eventName' : eventName,
				'handler'   : handler,
				'scope'     : scope,
				'options'   : null
			};
			this.listenerQueue.push( listener );
		}
	},

	/**
	 * Sets an attribute optionally based on a regex on reference
	 * @param {String} attr The Attribute name which should be set. Ex. "lang"
	 * @param {String} value The value to set. Ex. "de-AT"
	 * @param {String} regex The regex when the attribute should be set. The regex is applied to the value of refernece.
	 * @param {String} reference The value for the regex.
	 */
	setAttribute: function ( attr, value, regex, reference ) {
		if ( this.extButton ) {
			this.extButton.setAttribute( attr, value, regex, reference );
		}
	},

	/**
	 * When at least on objectType is set the value in the Attribute field does a query to all registered repositories.
	 * @param {Array} objectTypeFilter The array of objectTypeFilter to be searched for.
	 * @void
	 */
	setObjectTypeFilter: function ( objectTypeFilter ) {
		if ( this.extButton ) {
			this.noQuery = false;
			this.extButton.setObjectType( objectTypeFilter );
		} else {
			if ( !objectTypeFilter ) {
				objectTypeFilter = 'all';
			}
			this.objectTypeFilter = objectTypeFilter;
		}
	},

	/**
	 * Sets an item to the link tag.
	 * @param {resourceItem} item
	 */
	setItem: function ( item , displayField ) {
		if ( this.extButton ) {
			this.extButton.setItem( item, displayField );
		}
	},

	/**
	 * Gets current item set.
	 * @return {resourceItem} item
	 */
	getItem: function () {
		if ( this.extButton ) {
			return this.extButton.getItem();
		}
		return null;
	},

	/**
	 * Returns the current value
	 * @return {String} attributeValue
	 */
	getValue: function () {
		if ( this.extButton ) {
			return this.extButton.getValue();
		}
		return null;
	},

	/**
	 * Sets the current value
	 * @param {String} v an attributeValue
	 */
	setValue: function ( v ) {
		if ( this.extButton ) {
			this.extButton.setValue( v );
		}
	},

	/**
	 * Returns the current query value.
	 * @return {String} queryValue
	 */
	getQueryValue: function () {
		if ( this.extButton ) {
			return this.extButton.getValue();

			// Petro:
			// It is not clear why the value was being read in this "low-level" way and
			// not through `getValue()'. In any case, doing so, occasionally caused
			// errors, when this.extButton.wrap is `undefined'. We will therefore read
			// the value in the manner we do above.
			// return this.extButton.wrap.dom.children[0].value;
		}
		return null;
	},

	/**
	 * Set the display field, which is displayed in the combobox
	 * @param {String} displayField name of the field to be displayed
	 * @return display field name on success, null otherwise
	 */
	setDisplayField: function ( displayField ) {
		var result;
		if ( this.extButton ) {
			result = this.extButton.displayField = displayField;
		} else {
			result = this.displayField = displayField;
		}
		return result;
	},

	/**
	 * Set the row template for autocomplete hints. The default template is:
	 * <span><b>{name}</b><br />{url}</span>
	 * @param {String} tpl template to be rendered for each row
	 * @return template on success or null otherwise
	 */
	setTemplate: function ( tpl ) {
		var result;
		if ( this.extButton ) {
			result = this.extButton.tpl = extTemplate( tpl );
		} else {
			result = this.tpl = extTemplate( tpl );
		}
		return result;
	}

} );

} );

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

define('aloha/ui-browser',['aloha/ext', 'aloha/ui'],
function(Ext, ui) {
	

	var
//		$ = jQuery,
//		GENTICS = window.GENTICS,
//		Aloha = window.Aloha,
		Class = window.Class;

/**
 * !!!! ATTENTION !!!!
 * This is work in progress. This implemenation may change heavily.
 * Not yet implemented:
 * - configuring and templating the list
 * - DnD
 * - passing all possible query attributes to the repository
 * - query of subtree
 * - icon representation
 */
ui.Browser = Class.extend({
	_constructor: function () {

		/**
		 * @cfg Function called when an element is selected
		 */
		this.onSelect = null;

		var that = this;

		// define the grid that represents the filelist
		this.grid = new Ext.grid.GridPanel( {
			region : 'center',
			autoScroll : true,
			// the datastore can be used by the gridpanel to fetch data from
			// repository manager
			store : new Ext.data.Store( {
				proxy : new Ext.data.AlohaProxy(),
				reader : new Ext.data.AlohaObjectReader()
			}),
			columns : [ {
				id : 'name',
				header : 'Name',
				width : 100,
				sortable : true,
				dataIndex : 'name'
			}, {
				header : 'URL',
				renderer : function(val) {
					return val;
				},
				width : 300,
				sortable : true,
				dataIndex : 'url'
			} ],
			stripeRows : true,
			autoExpandColumn : 'name',
			height : 350,
			width : 600,
			title : 'Objectlist',
			stateful : true,
			stateId : 'grid',
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners : {
				'dblclick' : function(e) {
					that.onItemSelect();
				}
			}
		});
			this.grid.getSelectionModel().on({
				'selectionchange' : function(sm, n, node){
					var resourceItem = that.grid.getSelectionModel().getSelected();
					if (resourceItem) {
									this.win.buttons[1].enable();
					} else {
									this.win.buttons[1].disable();
					}
					},
					scope:this
			});


		// define the treepanel
		this.tree = new Ext.tree.TreePanel( {
			region : 'center',
			useArrows : true,
			autoScroll : true,
			animate : true,
			enableDD : true,
			containerScroll : true,
			border : false,
			loader : new Ext.tree.AlohaTreeLoader(),
			root : {
				nodeType : 'async',
				text : 'Aloha Repositories',
				draggable : false,
				id : 'aloha'
			},
			rootVisible : false,
			listeners : {
				'beforeload' : function(node) {
					this.loader.baseParams = {
						node : node.attributes
					};
				}
			}
		});
			this.tree.getSelectionModel().on({
					'selectionchange' : function(sm, node){
							if (node) {
								var resourceItem = node.attributes;
							that.grid.store.load({ params: {
								inFolderId: resourceItem.id,
								objectTypeFilter: that.objectTypeFilter,
								repositoryId: resourceItem.repositoryId
							}});
							}
					},
					scope:this
			});

		// nest the tree within a panel
		this.nav = new Ext.Panel( {
			title : 'Navigation',
			region : 'west',
			width : 300,
			layout : 'fit',
			collapsible : true,
			items : [ this.tree ]
		});

		// add the nested tree and grid (filelist) to the window
		this.win = new Ext.Window( {
			title : 'Resource Selector',
			layout : 'border',
			width : 800,
			height : 300,
			closeAction : 'hide',
			onEsc: function () {
				this.hide();
			},
			defaultButton: this.nav,
			plain : true,
			initHidden: true,
			items : [ this.nav, this.grid ],
			buttons : [{
				text : 'Close',
				handler : function() {
					that.win.hide();
				}
			}, {
				text : 'Select',
				disabled : true,
				handler : function() {
					that.onItemSelect();
				}
			}],
				toFront : function(e) {
						this.manager = this.manager || Ext.WindowMgr;
						this.manager.bringToFront(this);
						this.setZIndex(9999999999); // bring really to front (floating menu is not registered as window...)
						return this;
				}
		});

		this.onItemSelect = function () {
			var
				sm =  this.grid.getSelectionModel(),
				sel = (sm) ? sm.getSelected() : null,
				resourceItem = (sel) ? sel.data : null;
			this.win.hide();
			if ( typeof this.onSelect === 'function' ) {
				this.onSelect.call(this, resourceItem);
			}
		};
	},

	setObjectTypeFilter: function(otf) {
		this.objectTypeFilter = otf;
	},

	getObjectTypeFilter: function() {
		return this.objectTypeFilter;
	},

	show: function() {
		this.win.show(); // first show,
		this.win.toFront(true);
		this.win.focus();
	}
});

});

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

define('aloha/repository',[ 'aloha/core', 'util/class', 'aloha/repositorymanager' ],
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

/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define('aloha/repositoryobjects',[ 'aloha/core', 'util/class'],
function( Aloha, Class ) {
	
	
	var
//		Aloha = window.Aloha,
//		Class = window.Class,
	GENTICS = window.GENTICS;

	Aloha.RepositoryObject = function() {};
	
	/**
	 * @namespace Aloha.Repository
	 * @class Document
	 * @constructor
	 *
	 * Abstract Document suitable for most Objects.<br /><br />
	 *
	 * Example:
	 *
	<pre><code>
	 var item = new Aloha.Repository.Document({
		id: 1,
		repositoryId: 'myrepository',
		name: 'Aloha Editor - The HTML5 Editor',
		type: 'website',
		url:'http://aloha-editor.com',
	 });
	</code></pre>
	 *
	 * @param {Object} properties An object with the data.
	 * <div class="mdetail-params"><ul>
	 * <li><code>id</code> : String <div class="sub-desc">Unique identifier</div></li>
	 * <li><code>repositoryId</code> : String <div class="sub-desc">Unique repository identifier</div></li>
	 * <li><code>name</code> : String <div class="sub-desc">Name of the object. This name is used to display</div></li>
	 * <li><code>type</code> : String <div class="sub-desc">The specific object type</div></li>
	 * <li><code>partentId</code> : String (optional) <div class="sub-desc"></div></li>
	 * <li><code>mimetype</code> : String (optional) <div class="sub-desc">MIME type of the Content Stream</div></li>
	 * <li><code>filename</code> : String (optional) <div class="sub-desc">File name of the Content Stream</div></li>
	 * <li><code>length</code> : String (optional) <div class="sub-desc">Length of the content stream (in bytes)</div></li>
	 * <li><code>url</code> : String (optional) <div class="sub-desc">URL of the content stream</div></li>
	 * <li><code>renditions</code> : Array (optional) <div class="sub-desc">Array of different renditions of this object</div></li>
	 * <li><code>localName</code> : String (optional) <div class="sub-desc">Name of the object. This name is used internally</div></li>
	 * <li><code>createdBy</code> : String (optional) <div class="sub-desc">User who created the object</div></li>
	 * <li><code>creationDate</code> : Date (optional) <div class="sub-desc">DateTime when the object was created</div></li>
	 * <li><code>lastModifiedBy</code> : String (optional) <div class="sub-desc">User who last modified the object</div></li>
	 * <li><code>lastModificationDate</code> : Date (optional) <div class="sub-desc">DateTime when the object was last modified</div></li>
	 * </ul></div>
	 *
	 */
	Aloha.RepositoryDocument = Class.extend({
			_constructor: function (properties) {
	
				var p = properties;
	
				this.type = 'document';
	
				// Basic error checking for MUST attributes
				if (!p.id ||
					!p.name ||
					!p.repositoryId
				) {
	//				Aloha.Log.error(this, "No valid Aloha Object. Missing MUST property");
					return;
				}
	
				GENTICS.Utils.applyProperties(this, properties);
	
				this.baseType = 'document';
			}
	//		/**
	//		 * Not implemented method to generate this JS API doc correctly.
	//		 */
	//		,empty = function() }
	
		});
	
	
	
	/**
	 * @namespace Aloha.Repository
	 * @class Folder
	 * @constructor
	 * Abstract Folder suitable for most strucural Objects.<br /><br />
	 *
	 * Example:
	 *
	<pre><code>
	 var item = new Aloha.Repository.Folder({
		id: 2,
		repositoryId: 'myrepository',
		name: 'images',
		type: 'directory',
		parentId:'/www'
	 });
	</code></pre>
	 * @param {Object} properties An object with the data.
	 * <div class="mdetail-params"><ul>
	 * <li><code>id</code> : String <div class="sub-desc">Unique identifier</div></li>
	 * <li><code>repositoryId</code> : String <div class="sub-desc">Unique repository identifier</div></li>
	 * <li><code>name</code> : String <div class="sub-desc">Name of the object. This name is used to display</div></li>
	 * <li><code>type</code> : String <div class="sub-desc">The specific object type</div></li>
	 * <li><code>partentId</code> : String (optional) <div class="sub-desc"></div></li>
	 * <li><code>localName</code> : String (optional) <div class="sub-desc">Name of the object. This name is used internally</div></li>
	 * <li><code>createdBy</code> : String (optional) <div class="sub-desc">User who created the object</div></li>
	 * <li><code>creationDate</code> : Date (optional) <div class="sub-desc">DateTime when the object was created</div></li>
	 * <li><code>lastModifiedBy</code> : String (optional) <div class="sub-desc">User who last modified the object</div></li>
	 * <li><code>lastModificationDate</code> : Date (optional) <div class="sub-desc">DateTime when the object was last modified</div></li>
	 * </ul></div>
	 *
	 */
	Aloha.RepositoryFolder = Class.extend({
		
		_constructor: function(properties) {
	
			var p = properties;
		
			this.type = 'folder';
		
			// Basic error checking for MUST attributes
			if (!p.id ||
				!p.name ||
				!p.repositoryId
			) {
		//		Aloha.Log.error(this, "No valid Aloha Object. Missing MUST property");
				return;
			}
		
			GENTICS.Utils.applyProperties(this, properties);
		
			this.baseType = 'folder';
			
		}
	//	/**
	//	* Not implemented method to generate this JS API doc correctly.
	//	*/
	//	,empty = function() {};
	
	});
});

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
( function () {
	'use strict'
	
	// load jQuery with noConflict (true) to remove anyway from global namespace
	// a user may add it by its own with var jQuery = $ = Aloha.jQuery;
	var 
	    jQuery = window.jQuery.noConflict( true ),
	    deferredReady,
	    alohaRequire;
	
	// Ensure Aloha settings namespace and default
	window.Aloha = window.Aloha || {};
	
	// reset defaults. Users should use settings. 
	Aloha.defaults = {};
	
	// guarantee the settings namespace even if not set by user
	Aloha.settings = Aloha.settings || {};
	
	// set jQuery to buildin of not otherwise set
	// From here on Aloha.jQuery is always available
	Aloha.jQuery = Aloha.settings.jQuery || Aloha.jQuery || jQuery || null;
	
	// Aloha define, require, preserve original require
	Aloha._require = require;
	Aloha.define = define;
	
	// Determins the base path of Aloha Editor which is supposed to be the path of aloha.js (this file)
	Aloha.settings.baseUrl = Aloha.settings.baseUrl || getBaseUrl();
	
	// aloha base path is defined by a script tag with the data attribute 
	// data-aloha-plugins and the filename aloha.js
	// no jQuery at this stage...
	function getBaseUrl () {
		var
		    baseUrl = './',
		    script,
		    scripts = document.getElementsByTagName( 'script' ),
		    i, j = scripts.length,
		    regexAlohaJs = /\/aloha.js$/,
		    regexJs = /[^\/]*\.js$/;
		
		for ( i = 0; i < j && ( script = scripts[ i ] ); ++i ) {
			// take aloha.js or first ocurrency of data-aloha-plugins 
			// and script ends with .js
			if ( regexAlohaJs.test( script.src ) ) {
				baseUrl = script.src.replace( regexAlohaJs , '' );
				break;
			}            
			if ( baseUrl === './' && script.getAttribute( 'data-aloha-plugins' )
				&& regexJs.test(script.src ) ) {
				baseUrl = script.src.replace( regexJs , '' );
			}
		}
        
		return baseUrl;
	};
	
	// prepare the require config object and remember it
	Aloha.settings.requireConfig = {
		context: 'aloha',
		baseUrl: Aloha.settings.baseUrl,
		locale: Aloha.settings.locale
	};
	
	// configure require and expose the Aloha.require function
	alohaRequire = require.config( Aloha.settings.requireConfig );
	Aloha.require = function ( callback ) {
		// passes the Aloha object to the passed callback function
		if ( arguments.length == 1 && typeof callback === 'function' ) {
			return alohaRequire( [ 'aloha' ], callback );
		}
		return alohaRequire.apply( this, arguments );
	};
	
	// create promise for 'aloha-ready' when Aloha is not yet ready
	// and fire later when 'aloha-ready' is triggered all other events bind
	deferredReady = Aloha.jQuery.Deferred();
	Aloha.bind = function ( type, fn ) {
		if ( type == 'aloha-ready' ) {
			if ( Aloha.stage != 'alohaReady' ) {
				deferredReady.done( fn );
			} else {
				fn();
			}
		} else {
			Aloha.jQuery( Aloha, 'body' ).bind( type, fn );
		}
	
		return this;
	};
	
	Aloha.trigger = function ( type, data ) {
		if ( type == 'aloha-ready' ) {
			// resolve all deferred events on dom ready and delete local var
			Aloha.jQuery( deferredReady.resolve );
		}
		Aloha.jQuery( Aloha, 'body' ).trigger( type, data );
		return this;
	};
	
	Aloha.ready = function ( fn ) {
		this.bind( 'aloha-ready', fn );
		return this;
	};
	
	// Async Module Dependency error handling
	// Aloha will intercept RequireJS errors in order to facilitate more
	// flexible and more graceful degredation where possible
	( function ( origOnError ) {
		 require.onError = function ( err ) {
			var fatalTimeouts = [];
			var failedModules = Aloha.jQuery.trim( err.requireModules )
									 .split( ' ' );
			
			for ( var i = 0; i < failedModules.length; i++ ) {
				switch ( err.requireType ) {
				case 'timeout':
					// We only catch failures which do not rise from Aloha core
					// files. If a core file fails to load properly, it is
					// always a fatal error.
					if ( !/^aloha\/.+/.test( failedModules[ i ] ) ) {
						if ( window.console &&
								typeof window.console.error === 'function' ) {
							window.console.error( 'Aloha-Editor Error: ' +
								'The following module failed to load: ' +
								failedModules[ i ] );
						}
					} else {
						fatalTimeouts.push( failedModules[ i ] );
					}
					break;
				default:
					// "timeout" is currently, the only defined
					// err.requireType . But in case of any future custom
					// err.requireType which we do not handle, we will pass it
					// back to the original require.onError function.
					origOnError.apply( {}, arguments );
				}
			}
			
			throw 'Aloha-Editor Exception: The following core file' +
				( fatalTimeouts.length ? 's have' : ' has' ) +
				' timed-out while loading: ' + fatalTimeouts.join( ', ' );
		};
	} )( require.onError );
	
} )();

// define aloha object
define( 'aloha', [], function () {
	return Aloha;
} );

//load Aloha dependencies
require( 
	Aloha.settings.requireConfig, 
	[
		'aloha/jquery',
		'aloha/ext',
		'util/json2',
	],
	function () {
		// load Aloha core files
		require(
			Aloha.settings.requireConfig, 
			[
				'vendor/jquery.json-2.2.min',
				'vendor/jquery.store',
				'aloha/rangy-core',
				'util/class',
				'util/lang',
				'util/range',
				'util/dom',
				'aloha/core',
				'aloha/editable',
				'aloha/console',
				'aloha/markup',
				'aloha/message',
				'aloha/plugin',
				'aloha/selection',
				'aloha/command',
				'aloha/jquery.patch',
				'aloha/jquery.aloha',
				'aloha/sidebar',
				'util/position',
				'aloha/ext-alohaproxy',
				'aloha/ext-alohareader',
				'aloha/ext-alohatreeloader',
				'aloha/ui',
				'aloha/ui-attributefield',
				'aloha/ui-browser',
				'aloha/floatingmenu',
				'aloha/repositorymanager',
				'aloha/repository',
				'aloha/repositoryobjects',
				'aloha/contenthandlermanager'
			],
			function () {
				// jQuery calls the init method when the dom is ready
				Aloha.jQuery( Aloha.init );
			}
		);
	}
);
