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

	if ( ! $.parseJSON ) {
    	$.parseJSON = function( str ) {
        	var obj;
        	try {
            	obj = JSON.parse( str );
            } catch ( e ) {
            	if ( window.console && window.console.log ) {
                	window.console.log( e );
                }
            	obj = null;
            }
        	return obj;			
        };
    }

	function Musketeer( options ) {
		this.init();
	}

	// Parsers borrowed from jquery pjax
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
			var $setting = $( '#musketeer-options' );
			if ( $setting.length ) {
				self.options = $.extend( true, self.constructor.defaults, $.parseJSON( $setting.html() ) );
			}
			else if ( self.options ) {
				self.options = $.extend( true, self.constructor.defaults, self.options );
			}
			else {
				self.options = self.constructor.defaults;
			}
			self.options.debug = parseInt( self.options.debug || 0, 10 );
			if ( ! isNaN( self.options.debug ) && self.options.debug > 0 ) {
				self.log = function( mtd, msg ) {
					if ( arguments.length === 1 ) {
						if ( window.console && window.console.log ) {
							window.console.log( 'jQuery Musketeer: ' + arguments[ 0 ] );
						}
					}
					else if ( window.console && window.console[ mtd ] ) {
						window.console[ mtd ]( 'jQuery Musketeer: ' + msg );
					}
				};
			}
			self.lang = $.jStorage.get( 'lang', self.options.i18n.base );
			self.getRemoteData(function() {
				self.i18n();
			});
			self.pjaxify();
		});
	};


	Musketeer.prototype.url2path = function( url ) {
		var pme = ( url || '' ).replace([
			window.location.protocol,
			'//',
			window.location.host
		].join( '' ), '' ); // Remove domain like http(s)://www.foo.com
		pme = pme.replace( /\?.*/, '' ); // Remove extra parameters like ?foo=bar
		pme = pme.replace( /#.*/, '' ); // Remove anchor
		return pme;
	};


	Musketeer.prototype.urlfaker = function( url ) {
		var self = this;
		self.log( 'info', 'urlfaker(' + ( url || '' ) + ')' );
		var ptc = window.location.protocol,
			hst = window.location.host,
			pme = window.location.pathname,
			sch = window.location.search,
			hsh = window.location.hash;
		if ( ! url ) { // No url provided. Using current location
			url = document.location.href;
		}
		else { // Specific url
			// Getting a pathname from url
			pme = self.url2path( url );
			// Getting parameters from url
			sch = /\?/.test( url ) ? '?' + url.split( '?' )[ 1 ].split( '#' )[ 0 ] : '';
			// Getting hash from url
			hsh = /#/.test( url ) ? '#' + url.split( '#' )[ 1 ] : '';
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


	Musketeer.prototype.urlunfaker = function() {
		var self = this;
		self.log( 'info', 'urlunfaker()' );
		var ptc = window.location.protocol,
			hst = window.location.host,
			pme = window.location.pathname,
			sch = window.location.search,
			hsh = window.location.hash,
			url = '';
		$.each( self.options.i18n.langs, function() {
			var lng = this.toString(),
				reg = new RegExp( '^/' + lng + '/' );
			if ( reg.test( pme ) ) {
				pme = pme.replace( reg, '/' );
				if ( sch.length ) {
					sch += '&lang=' + lng;
				}
				else {
					sch = '?lang=' + lng;
				}
				return true;
			}
		});
		url = [
			ptc,
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
		// This only disables the 'dom' content
		// Ajax requests are handled with default settings
		Barba.Pjax.cacheEnabled = false;
		// Override Barba library native pushstate
		// The pushState is initially called in Barba.Pjax.goTo
		// So overriding Barba.Pjax.goTo first
		var requestedURL = '';
		Barba.Pjax.getCurrentUrl = function() {
			return requestedURL; // Return as it is
		};
		Barba.Pjax.goTo = function( url ) {
			self.log( 'info', 'Barbar.Pjax.goTo(' + url + ')' );
			// Keep the real one to fetch the real page via xhr
			requestedURL = url; 
			// Pjax.onStateChange triggers Pjax.getCurrentURL
			Barba.Pjax.onStateChange();
			// Own custom pushState, display cleaned faked url if need be
			window.history.pushState( null, null, self.urlfaker( url ) );
		};
		// And overriding Barbar.Pjax.onStateChange
		// We differenciate normal click and back button thanks to linkClicked
		// Barba only dispatchs this event if the link is valid :-)
		var linkClicked = false;
		Barba.Dispatcher.on( 'linkClicked', function( HTMLElement, MouseEvent ) {
			linkClicked = true;
		});
		// Standard js hack. Same way as explained here: http://barbajs.org/faq.html
		Barba.Pjax.originalOnStateChange  = Barba.Pjax.onStateChange;
		Barba.Pjax.onStateChange = function() {
			if ( linkClicked ) {  // Normal Click
		   		Barba.Pjax.originalOnStateChange.call( this );
				linkClicked = false;
				return;
			}
			// Prev / Next Button
			self.log( 'warn', 'URL requested from browser back / next buttons' );
			var wpme = window.location.pathname.replace( /index\.\w+$/, '' ),
				upme = self.url2path( requestedURL ).replace( /index\.\w+$/, '' ),
				fnd  = 0;
			if ( wpme === upme ) {
				// Same page, revert to the base language
				return self.triggerLang( self.options.i18n.base );
			}
			$.each( self.options.i18n.langs, function() {
				// Same page, revert to a different language
				var reg = new RegExp( '^/' + this.toString() + '/' );
				if ( reg.test( wpme ) && new RegExp( wpme.replace( reg, '/' ) ) === upme ) {
					fnd = 1;
					self.triggerLang( this.toString() );
					return false; // Same as break; 
				}
			});
			if ( fnd > 0 ) {
				return;
			}
			// Other page
    	    Barba.Dispatcher.trigger( 'linkClicked' );
			requestedURL = self.urlunfaker();
			Barba.Pjax.onStateChange();
		};
		// Go on
		Barba.Pjax.start();
		Barba.Dispatcher.on( 'newPageReady', function( currentStatus, oldStatus, container, newPageRawHTML ) {
			var $newPageHead = parseHTMLHead( newPageRawHTML );
			var headConfig = self.options.barbajs.head;
			$( 'head' ).find( headConfig ).remove(); // Remove current head tags
			$newPageHead.find( headConfig ).appendTo( 'head' ); // Append new tags to the head
			var currLang = docEl.lang || "en"; // Trigger new lang
			self.getRemoteData(function() {
				self.triggerLang( currLang );
			});
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
        	if ( ! window.Barba ) {
            	return true;
            }
			var $sel = $( '.' + Barba.Pjax.Dom.containerClass ),
				_selfTwttr = window.twttr || false,
				_selfFbSdk = window.FB || false,
				_selfGpApi = window.gapi || false;
			if ( _selfTwttr && _selfTwttr.widgets ) {
				_selfTwttr.widgets.load( $sel[ $sel.length-1 ] );
			}
			if ( _selfFbSdk && _selfFbSdk.XFBML ) {
				_selfFbSdk.XFBML.parse( $sel[ $sel.length-1 ] );
			}
			if ( _selfGpApi && _selfGpApi.plusone ) {
				_selfGpApi.plusone.go();
			}
		};
		var self = this,
		   	docEl = document.documentElement || {};
		docEl.lang = docEl.lang || "en";
		var switchLanguage = function( lang ) {
			self.log( 'info', 'Switching Language to ' + lang );
			$( document ).trigger( 'musketeer:ready' );
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
				if ( window.history && window.history.pushState ) {
					window.history.pushState( null, null, url );
				}
			}
			// Switch html head tags
			var $metas = $( '#head-' + lang );
			if ( $metas.length ) {
				var metaCfg = $.parseJSON( $metas.html() );
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
						var json = $.parseJSON( $el.html() );
						if ( json && json.id && json.content ) {
							$( '#' + json.id ).html( json.content ).data( 'cached', null );
						}
					}
					else if ( ! $el.children().length && $el.data( 'cached' ) ) {
						$el.html( $el.data( 'cached' ) ).css( 'display', 'block' ).data( 'cached', null );
					}
				}
			});
			// Refresh
		   	refreshSocialButtons();
			$( document ).trigger( 'musketeer:complete' );
		};
		if ( this.options.i18n.menu ) {
			var $menu = $( this.options.i18n.menu );
			$menu.on( 'click', 'a', function( event ) {
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

	Musketeer.prototype.getRemoteData = function( callback ) {
		var self	 = this,
			$remotes = $( '[data-remote]' ),
			async	 = $remotes.length;
		if ( async < 1 ) {
			if ( callback && typeof callback === 'function' ) {
				callback();
			}
			return 1;
		}
		$remotes.each(function() {
			var $el = $( this ), 
				id  = $el.attr( 'id' ) || false;
			if ( id ) {
				var complete = function( data ) {
					async--;
					$el.html( $( parseHTMLBody( data  ) ).find( '#' + id ).html() );
					var $jsonHead = $( parseHTMLHead( data ) ).find( 'script[lang]' );
					if ( $jsonHead.length ) {
						$( '#' + $jsonHead.attr( 'id' ) ).remove();
						$( 'head' ).append( $jsonHead );
					}
					if ( async < 1 ) {
						if ( callback && typeof callback === 'function' ) {
							callback();
						}
					}
				};
				var failed = function( error ) {
					self.log( error.message );
				};
				if ( ! window.Barba ) {
					$.ajax({
						url: $el.attr( 'data-remote' ),
						success: complete,
						error: failed
					});
				}
				else {
					Barba.Utils.xhr( $el.attr( 'data-remote' ) ).then( complete, failed );
				}
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