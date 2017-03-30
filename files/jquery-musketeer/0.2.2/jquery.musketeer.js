/* @license MIT LICENSE https://github.com/grenouille220/jquery-musketeer/blob/master/LICENSE */
(function( root, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery' ], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory( require( 'jquery' ) );
	} else {
		root.musketeer = factory( root.jQuery );
	}
}( this, function( $  ) {

	function Musketeer( options ) {
		this.init();
	}

	// Parse borrowed from jquery pjax
	function parseHTMLHead( data ) {
		var htmlHead = data.match( /<head[^>]*>([\s\S.]*)<\/head>/i )[ 0 ];
		return $( '<head />' ).html( $.parseHTML( htmlHead, document, true ) );
	}

	function parseHTMLBody( data ) {
		var htmlBody = data.replace( /(\r\n|\n|\r)/gm, '').replace( /([^]+<body[^>]*>|<\/body>[^]+)/g );
		return $( '<div />' ).html( $.parseHTML( htmlBody, document, true ) );
	}

	Musketeer.defaults = {
		debug: "0",
		i18n: {},
		barbajs: {
			head: [ 
				"meta[name='keywords']",
				"meta[name='description']",
				"meta[property^='og']",
				"meta[name^='twitter']",
				"meta[itemprop]",
				"link[itemprop]",
				"link[rel='prev']",
				"link[rel='next']",
				"link[rel='canonical']",
				"script[ lang ]"
			 ].join( ','  )
		}
	};

	Musketeer.prototype.log = function() {};

	Musketeer.prototype.init = function() {
		var self = this;
		$( document ).ready( function() {
			var $setting = $( '#musketeer-setting' );
			if ( $setting.length ) {
				self.options = $.extend( true, self.constructor.defaults, JSON.parse( $setting.html() ) );
			}
			else if ( self.options ) {
				self.options = $.extend( true, self.constructor.defaults, self.options );
			}
			parseInt( self.debug || '', 10 );
			if ( ! isNaN( self.options.debug ) && self.options.debug > 0 ) {
				self.log = function( mtd, msg ) {
					if ( arguments.length === 1 ) {
						if ( window.console && window.console.log ) {
							window.console.log( arguments[ 0 ] );
						}
					}
					else if ( window.console && window.console[ mtd ] ) {
						window.console[ mtd ]( 'jQuery Musketeer: ' + msg );
					}
				}
			}
			self.lang = $.jStorage.get( 'lang', self.options.i18n.base );
			self.getRemoteData();
			self.pjaxify();
		});
	};

	Musketeer.prototype.urlfaker = function( url ) {
		var self = this;
		self.log( 'info', 'urlfaker(' + ( url || '' ) + ')' );
		var ptc = window.location.protocol,
			hst = window.location.host,
			pme = '',
			sch = '',
			hsh = '';
		if ( ! url ) { // No url provided. Using current location
			url = document.location.href;
			pme = window.location.pathname;
			sch = window.location.search;
			hsh = window.location.hash;
		}
		else { // Specific url
			// Getting a pathname from url
			pme = url.replace( ptc + '//' + hst, '' ); // Remove domain like http(s)://www.foo.com
			pme = pme.replace( /\?.*/, '' ); // Remove extra parameters like ?foo=bar
			pme = pme.replace( /#.*/, '' ); // Remove anchor
			// Getting parameters from url
			if ( /\?/.test( url ) ) {
				sch = '?' + url.split( '?' )[ 1 ].split( '#' )[ 0 ];
			}
			// Getting hash from url
			if ( /#/.test( url ) ) {
				hsh = '#' + url.split( '#' )[ 1 ];
			}
		}
		// Remove language dependencies from pathname
		$.each( self.options.i18n.langs, function() {
			pme = pme.replace( new RegExp( '^/' + this.toString() + '/' ), '/' );
		});
		// Remove language dependencies from parameters
		if ( /lang/.test( sch || '' ) ) {
			sch = sch.replace( /lang\=[a-zA-Z-_]+/, '' );
			if ( sch.length < 2 ) {
				sch = '';
			}
		}
		// Remove language dependencies from hash tags
		if ( $.inArray( ( hsh || '' ).replace( '#', '' ), self.options.i18n.langs ) > -1 ) {
			hsh = '';
		}
		// If not base language, we need a fake url
		if ( self.lang !== self.options.i18n.base ) {
			hst += '/' + self.lang;
		}
		url = [
			window.location.protocol,
			'//',
			hst,
			pme,
			sch,
			hsh
		].join( '' );
		self.log( 'The following url was generated:' + url );
		return url;
	};


	Musketeer.prototype.triggerLang = function( lang ) {
		$( this.options.i18n.menu ).find( "a[ lang='" + lang + "' ],a[ hreflang='" + lang + "' ]" ).trigger( 'click' );
	};

	Musketeer.prototype.pjaxify = function() {
		var self = this,
			docEl = document.documentElement || {};
		if ( ! window.Barba || ! this.options.barbajs ) {
			return false;
		}
		// Prevent Barba from caching contents
		Barba.Pjax.cacheEnabled = false;
		// Disable Barba library native pushstate
		// By using the linkCliked dispatcher
		// And overriding Barba.Utils.getCurrentUrl && Barba.Pjax.goTo
		var linkClicked  = true,
			requestedURL = document.location.href; // First use in Barba's "history"
		$.each( self.options.i18n.langs, function() {
			requestedURL = requestedURL.replace( new RegExp( '/' + this.toString() + '/' ), '/' );
		});
		Barba.Dispatcher.on( 'linkClicked', function( HTMLElement, MouseEvent ) {
			// Barbajs only dispatch the event if the link is valid
			linkClicked = true;
		});
		Barba.Pjax.getCurrentUrl = function() {
			self.log( 'info', 'Barba.Pjax.getCurrentUrl()' );
			if ( ! linkClicked ) {
				// Prev / Next Button
				self.log( 'warn', 'URL requested from browser back / next buttons' );
				var pme = window.location.pathname,
					fnd = 0,
					reg;
				$.each( self.options.i18n.langs, function() {
					reg = new RegExp( '^/' + this.toString() + '/' );
					if ( ! fnd && reg.test( pme ) && new RegExp( pme.replace( reg, '/' ) ).test( requestedURL ) ) {
						fnd = 1;
						self.triggerLang( this.toString() );
					}
				});
				if ( ! fnd && new RegExp( window.location.pathname ).test( requestedURL ) ) {
					fnd = 1;
					self.triggerLang( self.options.i18n.base );
				}
				if ( ! fnd ) {
					fnd = 1;
					requestedURL = [
						window.location.protocol,
						'//',
						window.location.host,
						pme,
						window.location.search,
						window.hash
					].join( '' );
				}
			}
			return requestedURL;
		};
		Barba.Pjax.goTo = function( url ) {
			self.log( 'info', 'Barbar.Pjax.goTo(' + url + ')' );
			requestedURL = url;
			Barba.Pjax.onStateChange(); // Triggers Barba.Pjax.getCurrentURL
			window.history.pushState( null, null, self.urlfaker( url ) );
			linkClicked = false;
		};
		// Go on
		Barba.Pjax.start();
		linkClicked = false;
		Barba.Dispatcher.on( 'newPageReady', function( currentStatus, oldStatus, container, newPageRawHTML ) {
			var $newPageHead = parseHTMLHead( newPageRawHTML );
			var headConfig = self.options.barbajs.head;
			$( 'head' ).find( headConfig ).remove(); // Remove current head tags
			$newPageHead.find( headConfig ).appendTo( 'head' ); // Append new tags to the head
			var currLang = docEl.lang || "en"; // Trigger new lang
			self.triggerLang( currLang );
			if ( window.ga ) {
				window.ga( 'send', 'pageview', window.location.pathname + window.location.search );
			}
		});
	};

	Musketeer.prototype.i18n = function() {
		if ( ! this.options || ! this.options.i18n ) {
			return false;
		}
		if ( ! this.options.i18n.langs || ! this.options.i18n.langs.length ) {
			return false;
		}
		var refreshSocialButtons = function() {
			var $sel = $( '.' + Barba.Pjax.Dom.containerClass ),
				_selfTwttr = window.twttr || false;
			if ( _selfTwttr ) {
				_selfTwttr.widgets.load( $sel[ $sel.length-1 ] );
			}
		};
		var self = this,
		   	docEl = document.documentElement || {};
		docEl.lang = docEl.lang || "en";
		var switchLanguage = function( lang ) {
			self.log( 'info', 'Switching Language to ' + lang );
	   		self.lang = lang; // Current lang
	   		$.jStorage.set( 'lang', lang );
			// Switch global document language and update body classnames
		   	var $body = $( 'body' );
			if ( ! $body.hasClass( self.lang ) ) {
				$body.removeClass( docEl.lang );
   				docEl.lang = self.lang;
			   	$body.addClass( self.lang );
			}
			// Change url state too if need
			var url = self.urlfaker();
			if ( url !== document.location.href ) {
				window.history.pushState( null, null, url );
			}
			// Switch html head tags
			var $metas = $( '#head-' + lang );
			if ( $metas.length ) {
				var metaCfg = JSON.parse( $metas.html() );
				var $head   = $( 'head' );
				$( 'head' ).find( self.options.barbajs.head ).filter( ':not( script )' ).remove();
				for ( var tagName in metaCfg ) {
					if ( metaCfg.hasOwnProperty( tagName ) ) {
						if ( ! /title/.test( tagName ) ) {
							var tags =  metaCfg[ tagName ];
							for ( var i=0,tag,attrs, lim=tags.length; i<lim; i++ ) {
								attrs = tags[ i ];
								tag = '<'+tagName;
								for ( var attr in attrs ) {
									tag += ' ' + attr + '="' + attrs[  attr  ] + '"';
								}
								tag += '>';
								$head.append( tag );
							}
						}
						else {
							document.title = metaCfg[ tagName ];
						}
					}
				}
			}
			// Switch hardcoded html / json parts
			$.each( self.options.i18n.langs, function() {
				lang = this.toString();
				if ( lang !== self.lang ) {
					$body.find( self.options.i18n.selector.replace( '%lang', lang ) ).each( function(){
						var $el = $( this );
						if ( $el.length ) {
							if ( ! /script/.test( ( $el[ 0 ].tagName || '' ).toLowerCase() ) ) {
								if ( $( this ).children().length ) {
									$( this ).data( 'cached', $( this ).html() );
								}
								$( this ).empty().css( 'display', 'none' );
							}
						}
					});
				}
			});
			$body.find( self.options.i18n.selector.replace( '%lang', self.lang ) ).each( function(){
				var $el = $( this );
				if ( $el.length ) {
					if ( /script/.test( ( $el[ 0 ].tagName || '' ).toLowerCase() ) ) {
						var json = JSON.parse( $el.html() );
						if ( json && json.id && json.content ) {
							$( '#' + json.id ).html( $( '<textarea/>' ).html( json.content ).text() ).data( 'cached', null );
						}
					}
					else if ( ! $el.children().length && $el.data( 'cached' ) ) {
						$el.html( $el.data( 'cached' ) ).css( 'display', 'block' ).data( 'cached', null );
					}
				}
			});
			// Refresh
		   	refreshSocialButtons();
        	$( document ).trigger( 'musketeer:ready' );
		};
		if ( this.options.i18n.menu ) {
			var $menu = $( this.options.i18n.menu );
			$menu.find( 'a' ).bind( 'click', function( event ) {
				event.preventDefault();
				switchLanguage( $( this ).attr( 'hreflang' ) || $( this ).attr( 'lang' ) );
				$menu.find( '.ui-state-active' ).removeClass( 'ui-state-active' );
				$( this ).addClass( 'ui-state-active' );
			});
		}
		// Hard requested language
		var reqLang = [];
		if ( /lang/.test( document.location.href ) ) {
			// Lang requested via url param: index.html?lang=fr
			reqLang = document.location.href.match( /lang\=([a-zA-Z_-]+)/ );
		}
		else if ( window.location.hash && window.location.hash.length > 1 ) {
			// Lang requested via hash: index.html#fr
			reqLang = window.location.hash.match( /\#([a-zA-Z_-]+)/ );
		}
		else {
			// Lang requested via directory: /fr/index.html
			reqLang = window.location.pathname.match( /^\/([a-zA-Z_-]+)\// );
		}
		// Initialize
		if ( reqLang && reqLang.length && reqLang[ 1 ] && $.inArray( reqLang[ 1 ], this.options.i18n.langs ) > -1 ) {
			self.triggerLang( reqLang[ 1 ] );
		}
		else {
			switchLanguage( $.jStorage.get( 'lang', docEl.lang ) );
		}
	};

	Musketeer.prototype.getRemoteData = function() {
		var self	 = this,
			$remotes = $( '[data-remote]' ),
			async	 = $remotes.length;
		if ( async < 1 ) {
			self.i18n();
			return 1;
		}
		$remotes.each(function() {
			var $el = $( this ), 
				id  = $el.attr( 'id' ) || false;
			if ( id ) {
				Barba.Utils.xhr( $el.attr( 'data-remote' ) ).then(function( data ) {
					async--;
					$( this ).html( $( parseHTMLBody( data  ) ).find( '#' + id ).html() );
					var $jsonHead = $( parseHTMLHead( data ) ).find( 'script[lang]' );
					if ( $jsonHead.length ) {
						$( '#' + $jsonHead.attr( 'id' ) ).remove();
						$( 'head' ).append( $jsonHead );
					}
					if ( async < 1 ) {
						self.i18n();
					}
				}, function ( error ) {
					self.log( error.message );
				});
				$el.removeAttr( 'data-remote' );
			}
			else {
				self.log( 'warn', 'Missing id attribute on el' + $el );
				$el.remove();
			}
		});
	};

	return new Musketeer();

}));