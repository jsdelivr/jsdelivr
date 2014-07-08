/*!
 * Globalize v1.0.0-alpha.3
 *
 * http://github.com/jquery/globalize
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-27T18:22Z
 */
(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define( [ "cldr", "../globalize" ], factory );
	} else if ( typeof exports === "object" ) {

		// Node, CommonJS
		module.exports = factory( require( "cldrjs" ), require( "globalize" ) );
	} else {

		// Extend global
		factory( root.Cldr, root.Globalize );
	}
}(this, function( Cldr, Globalize ) {


var arrayIsArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};




var alwaysArray = function( stringOrArray ) {
	return arrayIsArray( stringOrArray ) ?  stringOrArray : [ stringOrArray ];
};




/**
 * .loadMessages( json )
 *
 * @json [JSON]
 *
 * Load messages (translation) data for default/instance locale.
 */
Globalize.loadMessages =
Globalize.prototype.loadMessages = function( json ) {
	var customData = {
		"globalize-messages": {}
	};
	customData[ "globalize-messages" ][ this.cldr.attributes.languageId ] = json;
	Cldr.load( customData );
};

/**
 * .translate( path )
 *
 * @path [String or Array]
 *
 * Translate item given its path.
 */
Globalize.translate =
Globalize.prototype.translate = function( path ) {
	path = alwaysArray( path );
	return this.cldr.get( [ "globalize-messages/{languageId}" ].concat( path ) );
};

return Globalize;




}));
