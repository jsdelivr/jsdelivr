// ScrollTo Plugin 1.4.2 | Copyright (c) 2007-2009 Ariel Flesler | GPL/MIT License
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

jetpack = {
	numModules: 0,
	container: null,
	arrow: null,
	linkClicked: null,
	resizeTimeout: null,
	resizeTimer: null,
	shadowTimer: null,
	statusText: null,
	isRTL: !( 'undefined' == typeof isRtl || !isRtl ),
	didDebug: false,

	init: function() {
		jetpack.numModules = jQuery( 'div.jetpack-module' ).not( '.placeholder' ).size();
		jetpack.container = jQuery( 'div.module-container' );

		jetpack.level_modules();
		jetpack.level_placeholders();
		jetpack.level_placeholders_on_resize();

		jQuery( 'a.more-info-link', 'div.jetpack-module' ).bind( 'click', function(e) {
			e.preventDefault();
			jetpack.hide_shadows();

			if ( jetpack.linkClicked && jetpack.linkClicked.parents( 'div.jetpack-module' ).attr( 'id' ) == jQuery(this).parents( 'div.jetpack-module' ).attr( 'id' ) ) {
				jetpack.close_learn_more( function() { jetpack.show_shadows(); } );
			} else {
				jetpack.linkClicked = jQuery(this);
				jetpack.insert_learn_more( jQuery(this).parents( 'div.jetpack-module' ), function() { jetpack.show_shadows(); } );
				jQuery( 'a.jetpack-deactivate-button' ).hide();
				jQuery( 'a.jetpack-configure-button' ).show();
				jetpack.linkClicked.parents( 'div.jetpack-module' ).children( '.jetpack-module-actions' ).children( 'a.jetpack-deactivate-button' ).show();
				jetpack.linkClicked.parents( 'div.jetpack-module' ).children( '.jetpack-module-actions' ).children( 'a.jetpack-configure-button' ).hide();
			}
		} );

		jQuery( window ).bind( 'resize', function() {
			jetpack.hide_shadows();

			clearTimeout( jetpack.shadowTimer );
			jetpack.shadowTimer = setTimeout( function() { jetpack.show_shadows(); }, 200 );
		});

		jQuery( 'a#jp-debug' ).bind( 'click', function(e) {
			e.preventDefault();
			if ( !jetpack.didDebug ) {
				jetpack.didDebug = true;
				jQuery( '#jetpack-configuration' ).load( this.href, function() {
					jQuery.scrollTo( 'max', 'fast' );
				} );
			}

			jetpack.toggle_debug();
		});

		var widerWidth = 0;
		jQuery( '#jp-disconnect a' ).click( function() {
			if ( confirm( jetpackL10n.ays_disconnect ) ) {
				jQuery( this ).addClass( 'clicked' ).css( {
					"background-image": 'url( ' + userSettings.url + 'wp-admin/images/wpspin_light.gif )',
					"background-position": '9px 5px',
					"background-size": '16px 16px'
				} ).unbind( 'click' ).click( function() { return false; } );
			} else {
				return false;
			}
		} );
		jQuery( '#jp-unlink a' ).click( function() {
			if ( confirm( jetpackL10n.ays_unlink ) ) {
				jQuery( this ).css( {
					"background-image": 'url( ' + userSettings.url + 'wp-admin/images/wpspin_light.gif )',
					"background-position": '9px 5px',
					"background-size": '16px 16px'
				} ).unbind( 'click' ).click( function() { return false; } );
			} else {
				return false;
			}
		} );

		jQuery( '#screen-meta, #screen-meta-links' ).wrapAll( '<div class="screen-meta-wrap" />' );
	},

	level_modules: function() {
		var max_height = 0;

		// Get the tallest module card and set them all to be that tall.
		jQuery( 'div.jetpack-module', 'div.module-container' ).each( function() {
			max_height = Math.max( max_height, jQuery(this).height() );
		} ).height( max_height );
	},

	level_placeholders: function( w ) {
		jQuery( 'div.placeholder' ).show();

		var containerWidth = jetpack.container.width(),
		    needed = 5 * parseInt( containerWidth / 242, 10 ) - jetpack.numModules

		if ( jetpack.numModules * 242 > containerWidth )
			jQuery( 'div.placeholder' ).slice( needed ).hide();
		else
			jQuery( 'div.placeholder' ).hide();
	},

	level_placeholders_on_resize: function() {
		jQuery( window ).bind( 'resize', function() {
			if ( jetpack.resizeTimer ) {
				return;
			}

			jetpack.resizeTimer = setTimeout( function() {
				jetpack.resizeTimer = false;
				jetpack.level_placeholders();
				jetpack.level_placeholders_on_resize();
			}, 100 );
		} );
	},

	insert_learn_more: function( card, callback ) {
		var perRow = parseInt( jetpack.container.width() / 242, 10 ),
		    cardPosition = 0,
		    cardRow = 0,
		    learnMoreOffset = jetpack.isRTL ? 144 : 28;

		// Get the position of the card clicked.
		jQuery( 'div.jetpack-module', 'div.module-container' ).each( function( i, el ) {
			if ( jQuery(el).attr('id') == jQuery(card).attr('id') )
				cardPosition = i;
		} );

		cardRow = 1 + parseInt( cardPosition / perRow, 10 );

		// Insert the more info box after the last item of the row.
		jQuery( 'div.jetpack-module', 'div.module-container' ).each( function( i, el ) {
			if ( i + 1 == ( perRow * cardRow ) ) {
				// More info box already exists.
				if ( jQuery( 'div.more-info' ).length ) {
					if ( jQuery( el ).next().hasClass( 'more-info' ) ) {
						jQuery( 'div.more-info div.jp-content' ).fadeOut( 100 );
						jetpack.learn_more_content( jQuery(card).attr( 'id' ) );
						jQuery( window ).scrollTo( ( jQuery( 'div.more-info' ).prev().offset().top ) - 70, 600, function() { if ( typeof callback == 'function' ) callback.call( this ); } );
					} else {
						jQuery( 'div.more-info div.jp-content' ).hide();
						jQuery( 'div.more-info' ).css( { height: '230px', minHeight: 0 } ).slideUp( 200, function() {
							var $this = jQuery(this);
							$this.detach().insertAfter( el );
							jQuery( 'div.more-info div.jp-content' ).hide();
							jetpack.learn_more_content( jQuery(card).attr( 'id' ) );
							$this.css( { height: '230px', minHeight: 0 } ).slideDown( 300, function() {
								$this.css( { height: 'auto', minHeight: '230px' } );
							} );
							jQuery( window ).scrollTo( ( $this.prev().offset().top ) - 70, 600, function() { if ( typeof callback == 'function' ) callback.call( this ); } );
						} );
					}

				// More info box does not exist.
				} else {
					// Insert the box.
					jQuery( el ).after( '<div id="message" class="more-info jetpack-message"><div class="arrow"></div><div class="jp-content"></div><div class="jp-close">&times;</div><div class="clear"></div></div>' );

					// Show the box
					jQuery( 'div.more-info' ).css( { height: '230px', minHeight: 0 } );
					jQuery( 'div.more-info', 'div.module-container' ).hide().slideDown( 400, function() {
						jQuery( 'div.more-info' ).css( { height: 'auto', minHeight: '230px' } );
						// Load the content and scroll to it
						jetpack.learn_more_content( jQuery(card).attr( 'id' ) );
						jQuery( window ).scrollTo( ( jQuery( 'div.more-info' ).prev().offset().top ) - 70, 600 );

						if ( typeof callback == 'function' ) callback.call( this );
					} );

					jQuery( 'div.more-info' ).children( 'div.arrow' ).animate( { left: jQuery(card).offset().left - jetpack.container.offset().left + learnMoreOffset + 'px' }, 300 );
				}
				jQuery( 'div.more-info' ).children( 'div.arrow' ).animate( { left: jQuery(card).offset().left - jetpack.container.offset().left + learnMoreOffset + 'px' }, 300 );

				return;
			}
		} );

		// Listen for resize
		jQuery( window ).bind( 'resize', function() {
			jetpack.reposition_learn_more( card );
			jetpack.level_placeholders_on_resize();
		} );

		// Listen for close.
		jQuery( 'div.more-info div.jp-close' ).unbind( 'click' ).bind( 'click', function() {
			jetpack.close_learn_more();
		} );
	},

	reposition_learn_more: function( card ) {
		var perRow = parseInt( jetpack.container.width() / 242, 10 );
		var cardPosition = 0;

		// Get the position of the card clicked.
		jQuery( 'div.jetpack-module', 'div.module-container' ).each( function( i, el ) {
			if ( jQuery(el).attr('id') == jQuery(card).attr('id') )
				cardPosition = i;
		} );

		var cardRow = 1 + parseInt( cardPosition / perRow, 10 );

		jQuery( 'div.jetpack-module', 'div.module-container' ).each( function( i, el ) {
			if ( i + 1 == ( perRow * cardRow ) ) {
				jQuery( 'div.more-info' ).detach().insertAfter( el );
				jQuery( 'div.more-info' ).children( 'div.arrow' ).css( { left: jQuery(card).offset().left - jetpack.container.offset().left + 28 + 'px' }, 300 );
			}
		} );
	},

	learn_more_content: function( module_id ) {
		response = jQuery( '#jp-more-info-' + module_id ).html();
		jQuery( 'div.more-info div.jp-content' ).html( response ).hide().fadeIn( 300 );
	},

	close_learn_more: function( callback ) {
		jQuery( 'div.more-info div.jp-content' ).hide();

		jQuery( 'div.more-info' ).css( { height: '230px', minHeight: 0 } ).slideUp( 200, function() {
			jQuery( this ).remove();
				jQuery( 'a.jetpack-deactivate-button' ).hide();
				jetpack.linkClicked.parents( 'div.jetpack-module' ).children( '.jetpack-module-actions' ).children( 'a.jetpack-configure-button' ).show();
			jetpack.linkClicked = null;

			if ( typeof callback == 'function' ) callback.call( this );
		} );
	},

	toggle_debug: function() {
		jQuery('div#jetpack-configuration').toggle( 0, function() {
			if ( jQuery( this ).is( ':visible' ) ) {
				jQuery.scrollTo( 'max', 'fast' );
			}
		} );
	},

	hide_shadows: function() {
		jQuery( 'div.jetpack-module, div.more-info' ).css( { '-webkit-box-shadow': 'none' } );
	},

	show_shadows: function() {
		jQuery( 'div.jetpack-module' ).css( { '-webkit-box-shadow': 'inset 0 1px 0 #fff, inset 0 0 20px rgba(0,0,0,0.05), 0 1px 2px rgba( 0,0,0,0.1 )' } );
		jQuery( 'div.more-info' ).css( { '-webkit-box-shadow': 'inset 0 0 20px rgba(0,0,0,0.05), 0 1px 2px rgba( 0,0,0,0.1 )' } );
	}
}
jQuery( function() { jetpack.init(); } );
