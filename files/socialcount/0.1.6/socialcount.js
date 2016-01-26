/*! SocialCount - v0.1.6 - 2013-08-08
* https://github.com/filamentgroup/SocialCount
* Copyright (c) 2013 zachleat; Licensed MIT */

;(function( win, doc, $ ) {

	var $loadingIndicator,
		$count;

	function featureTest( prop, unprefixedProp ) {
		var style = doc.createElement('social').style,
			prefixes = 'webkit Moz o ms'.split(' ');

		if( unprefixedProp in style ) {
			return true;
		}
		for( var j = 0, k = prefixes.length; j < k; j++ ) {
			if( ( prefixes[ j ] + prop ) in style ) {
				return true;
			}
		}
		return false;
	}

	function removeFileName( src ) {
		var split = src.split( '/' );
		split.pop();
		return split.join( '/' ) + '/';
	}

	function resolveServiceDir() {
		var baseUrl;

		$( 'script' ).each(function() {
			var src = this.src || '',
				dir;
			if( src.match( SocialCount.scriptSrcRegex ) ) {
				baseUrl = removeFileName( src );
				return false;
			}
		});

		return baseUrl;
	}

	var SocialCount = {
		// For A-grade experience, require querySelector (IE8+) and not BlackBerry or touchscreen
		isGradeA: 'querySelectorAll' in doc && !win.blackberry && !('ontouchstart' in window) &&
			// Note that this feature test does not account for the Windows Phone version that includes IE9
			// IE 10 desktop (non-touch) returns 0 for msMaxTouchPoints
			( typeof window.navigator.msMaxTouchPoints === 'undefined' || window.navigator.msMaxTouchPoints === 0 ),
		minCount: 1,
		serviceUrl: 'service/index.php',
		initSelector: '.socialcount',
		classes: {
			js: 'js',
			gradeA: 'grade-a',
			active: 'active',
			touch: 'touch',
			hover: 'hover',
			noTransforms: 'no-transforms',
			showCounts: 'counts',
			countContent: 'count',
			minCount: 'minimum',
			activateOnHover: 'activate-on-hover',
			activateOnClick: 'activate-on-click'
		},
		thousandCharacter: 'K',
		millionCharacter: 'M',
		missingResultText: '-',
		activateOnClick: false, // default is hover
		selectors: {
			facebook: '.facebook',
			twitter: '.twitter',
			googleplus: '.googleplus'
		},
		locale: (function() {
			var locale = doc.documentElement ? ( doc.documentElement.lang || '' ) : '';
			locale = locale.replace(/\-/, '_');
			return locale.match(/\w{2}_\w{2}/) ? locale : '';
		})(),
		googleplusTooltip: 'table.gc-bubbleDefault',
		scriptSrcRegex: /socialcount[\w.]*.js/i,
		plugins: {
			init: [],
			bind: []
		},

		// private, but for testing
		cache: {},

		removeFileName: removeFileName,
		resolveServiceDir: resolveServiceDir,

		isCssAnimations: function() {
			return featureTest( 'AnimationName', 'animationName' );
		},
		isCssTransforms: function() {
			return featureTest( 'Transform', 'transform' );
		},
		getUrl: function( $el ) {
			return $el.attr('data-url') || location.href;
		},
		// Currently only available on Twitter
		getShareText: function( $el ) {
			return $el.attr('data-share-text' ) || '';
		},
		getFacebookAction: function( $el ) {
			return ( $el.attr('data-facebook-action' ) || 'like' ).toLowerCase();
		},
		isCountsEnabled: function( $el ) {
			return $el.attr('data-counts') === 'true';
		},
		isSmallSize: function( $el ) {
			return $el.is( '.socialcount-small' );
		},
		getCounts: function( $el, url ) {
			var map = SocialCount.selectors,
				cache = SocialCount.cache,
				counts = {},
				$networkNode,
				$countNode,
				j;

			for( j in map ) {
				$networkNode = $el.find( map[ j ] );
				$countNode = $networkNode.find( '.' + SocialCount.classes.countContent );

				if( $countNode.length ) {
					counts[ j ] = $countNode;
				} else {
					counts[ j ] = $count.clone();
					$networkNode.append( counts[ j ] );
				}
			}

			if( !cache[ url ] ) {
				cache[ url ] = $.ajax({
					url: resolveServiceDir() + SocialCount.serviceUrl,
					data: {
						url: url
					},
					dataType: 'json'
				});
			}

			cache[ url ].done( function complete( data ) {
				for( var j in data ) {
					if( data.hasOwnProperty( j ) ) {
						if( counts[ j ] && data[ j ] > SocialCount.minCount ) {
							counts[ j ].addClass( SocialCount.classes.minCount )
								.html( SocialCount.normalizeCount( data[ j ] ) );
						}
					}
				}
			});

			return cache[ url ];
		},
		init: function( $el ) {
			var facebookAction = SocialCount.getFacebookAction( $el ),
				classes = [ facebookAction ],
				isSmall = SocialCount.isSmallSize( $el ),
				url = SocialCount.getUrl( $el ),
				initPlugins = SocialCount.plugins.init,
				countsEnabled = SocialCount.isCountsEnabled( $el );

			classes.push( SocialCount.classes.js );

			if( SocialCount.isGradeA ) {
				classes.push( SocialCount.classes.gradeA );
			}
			if( !SocialCount.isCssTransforms() ) {
				classes.push( SocialCount.classes.noTransforms );
			}
			if( countsEnabled ) {
				classes.push( SocialCount.classes.showCounts );
			}
			if( SocialCount.activateOnClick ) {
				classes.push( SocialCount.classes.activateOnClick );
			} else {
				classes.push( SocialCount.classes.activateOnHover );
			}
			if( SocialCount.locale ) {
				classes.push( SocialCount.locale );
			}
			$el.addClass( classes.join(' ') );

			for( var j = 0, k = initPlugins.length; j < k; j++ ) {
				initPlugins[ j ].call( $el );
			}

			if( SocialCount.isGradeA ) {
				SocialCount.bindEvents( $el, url, facebookAction, isSmall );
			}

			if( countsEnabled && !isSmall ) {
				SocialCount.getCounts( $el, url );
			}
		},
		normalizeCount: function( count ) {
			if( !count && count !== 0 ) {
				return SocialCount.missingResultText;
			}
			// > 1M
			if( count >= 1000000 ) {
				return Math.floor( count / 1000000 ) + SocialCount.millionCharacter;
			}
			// > 100K
			if( count >= 100000 ) {
				return Math.floor( count / 1000 ) + SocialCount.thousandCharacter;
			}
			if( count > 1000 ) {
				return ( count / 1000 ).toFixed( 1 ).replace( /\.0/, '' ) + SocialCount.thousandCharacter;
			}
			return count;
		},
		bindEvents: function( $el, url, facebookAction, isSmall ) {
			function bind( $a, html, jsUrl ) {
				// IE bug (tested up to version 9) with :hover rules and iframes.
				var isTooltipActive = false,
					isHoverActive = false;

				$a.closest( 'li' ).bind( 'mouseenter', function( event ) {
					var $li = $( this ).closest( 'li' );

					$li.addClass( SocialCount.classes.hover );

					isHoverActive = true;

					$( document ).on( 'mouseenter.socialcount mouseleave.socialcount', SocialCount.googleplusTooltip, function( event ) {
						isTooltipActive = event.type === 'mouseenter';

						if( !isTooltipActive && !isHoverActive ) {
							$li.removeClass( SocialCount.classes.hover );
						}
					});
				}).bind( 'mouseleave', function( event ) {
					var self = this;
					window.setTimeout(function() {
						isHoverActive = false;

						if( !isTooltipActive && !isHoverActive ) {
							$( document ).off( '.socialcount' );
							$( self ).closest( 'li' ).removeClass( SocialCount.classes.hover );
						}
					}, 0);
				});

				$a.one( SocialCount.activateOnClick ? 'click' : 'mouseover', function( event ) {
					if( SocialCount.activateOnClick ) {
						event.preventDefault();
						event.stopPropagation();
					}

					var $self = $( this ),
						$parent = $self.closest( 'li' ),
						$loading = $loadingIndicator.clone(),
						$content = $( html ),
						$button = $( '<div class="button"/>' ).append( $content ),
						js,
						$iframe,
						deferred = $.Deferred();

					deferred.promise().always(function() {
						// Remove Loader
						var $iframe = $parent.find('iframe');

						if( $iframe.length ) {
							$iframe.bind( 'load', function() {
								$loading.remove();
							});
						} else {
							$loading.remove();
						}
					});

					$parent
						.addClass( SocialCount.classes.active )
						.append( $loading )
						.append( $button );

					if( jsUrl ) {
						js = doc.createElement( 'script' );
						js.src = jsUrl;

						// IE8 doesn't do script onload.
						if( js.attachEvent ) {
							js.attachEvent( 'onreadystatechange', function() {
								if( js.readyState === 'loaded' || js.readyState === 'complete' ) {
									deferred.resolve();
								}
							});
						} else {
							$( js ).bind( 'load', deferred.resolve );
						}

						doc.body.appendChild( js );
					} else if( $content.is( 'iframe' ) ) {
						deferred.resolve();
					}
				});
			} // end bind()

			if( !isSmall ) {
				var shareText = SocialCount.getShareText( $el );

				bind( $el.find( SocialCount.selectors.facebook + ' a' ),
					'<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent( url ) +
						( SocialCount.locale ? '&locale=' + SocialCount.locale : '' ) +
						'&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=true&amp;action=' + facebookAction +
						'&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>' );

				bind( $el.find( SocialCount.selectors.twitter + ' a' ),
					'<a href="https://twitter.com/share" class="twitter-share-button"' +
						' data-url="' + encodeURIComponent( url ) + '"' +
						( shareText ? ' data-text="' + shareText + '"': '' ) +
						' data-count="none" data-dnt="true">Tweet</a>',
					'//platform.twitter.com/widgets.js' );

				bind( $el.find( SocialCount.selectors.googleplus + ' a' ),
					'<div class="g-plusone" data-size="medium" data-annotation="none"></div>',
					'//apis.google.com/js/plusone.js' );
			}

			// Bind events on other non-stock widgets, like sharethis
			var bindPlugins = SocialCount.plugins.bind;
			for( var j = 0, k = bindPlugins.length; j < k; j++ ) {
				bindPlugins[ j ].call( $el, bind, url, isSmall );
			}
		} // end bindEvents()
	};

	$(function() {
		// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
		$loadingIndicator = $('<div>')
			.addClass('loading')
			.html( SocialCount.isCssAnimations() ? new Array(4).join('<div class="dot"></div>') : 'Loading' );

		$count = $('<span>')
			.addClass( SocialCount.classes.countContent )
			.html('&#160;');

		$( SocialCount.initSelector ).each(function() {
			var $el = $(this);
			SocialCount.init($el);
		});
	});

	window.SocialCount = SocialCount;

}( window, window.document, jQuery ));
