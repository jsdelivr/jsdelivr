YUI.add('gallery-yquery', function(Y) {



/**
* YQuery is a widget for YUI3 that simplifies implementing both jQuery and jQuery plugins into your code
*
*
*
*
* Project Home - http://kickballcreative.com/yui/modules/yquery/
* Copyright (c) 2010 Lauren Smith
* YUI BSD - http://developer.yahoo.com/yui/license.html
*
*
*/

var opts = {}, win = window, JQUERY_BASE = 'http://ajax.googleapis.com/ajax/libs/jquery/';

function YQuery( src ) {

	return {

		// Allows for override of the version to use
		version : '1.4.2',

		// Allows for override of autodetection
		autodetect : true,

		// Allows for override to use dev version
		type : 'production',
		
		// Undocumented but allows for override of the setTimeout function; in milliseconds
		timeout : 10000,
		
		// Undocumented but allows for overriding the callback if ever necessary
		callback : null,

		use : function() {

			var queue			= Array.prototype.slice.call( arguments, 0 );
				opts.timeout	= this.timeout;
				opts.scope		= this;

			var type = ( this.type === 'production' ) ? '.min' : '';
			
			if ( Y.Lang.isNull( this.callback ) ) { this.callback = queue.pop(); }

			if ( this.autodetect || Y.Lang.isObject( this.version ) ) {

				if ( Y.Lang.isArray( queue[0] ) ) { queue = queue[0]; }

				if ( typeof( jQuery ) === 'undefined' && this.autodetect && ! Y.Lang.isObject( this.version ) ) {
					queue.unshift( JQUERY_BASE + this.version + '/jquery' + type +'.js' );
				}

				if ( Y.Lang.isObject( this.version ) ) {

					if ( typeof( jQuery) === 'undefined' && this.autodetect ) {

						for( var i = 0; i < this.version.length; i++ ) {

							var url = JQUERY_BASE + this.version[ i ].version + '/jquery' + type + '.js';

							var c = ( queue.length <= 0 && i == ( this.version.length - 1 ) ) ? true : false;

							opts.data 	= {
								space		: this.version[ i ].namespace,
								callback	: c
							};
							
							opts.onSuccess	= function( d ) {
								if ( ! Y.Lang.isUndefined( d.data.space ) ) { win[d.data.space] = jQuery.noConflict( true ); }
								if ( d.data.callback ) { this.scope._invokeReady(); }
							};
							opts.onTimeout  = function( d ) {
								if ( ! Y.Lang.isUndefined( d.data.space ) ) { win[d.data.space] = jQuery.noConflict( true ); }
								if ( d.data.callback ) { this.scope._invokeReady(); }
							};

							Y.Get.script( url, opts );

						}

					}

				}

				if( queue.length > 0 ) {

					opts.onSuccess	= function( d ) { this.scope._invokeReady(); };
					opts.onTimeout  = function( d ) { this.scope._invokeReady(); };

					Y.Get.script( queue, opts );

				}

			} else {
				
				// This gets fired if jQuery autodetect has been overridden
				this._invokeReady();

			}

		},
		
		_invokeReady : function() {

			Y.on( 'domready', function() { this.callback(); }, this );
			
		}

	};

}

Y.YQuery = YQuery;


}, 'gallery-2010.03.30-17-26' ,{requires:['get','event']});
