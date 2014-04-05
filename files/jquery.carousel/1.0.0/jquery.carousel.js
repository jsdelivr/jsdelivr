/*!
 * jQuery Carousel Plugin v1.0.0
 * https://github.com/samuelmaudo/jquery-carousel
 *
 * Copyright 2014 Samuel Maudo
 * Released under the MIT license
 */
(function( factory ) {
  if ( typeof define === 'function' && define.amd ){
    // AMD
    define( ['jquery'], factory );
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    factory( require('jquery') );
  } else {
    // Browser globals
    factory( jQuery );
  }
}(function( $ ){

  var methods = {
    //
    // Initialzie plugin
    //
    init : function(options){

      var options = $.extend({}, $.fn.carousel.defaults, options);

      return this.each(function(){

        var $carousel = $( this ),
            data = $carousel.data( 'carousel' );

        if ( ! data ){

          var $carousel_container = $carousel.find( options.container ),
              $carousel_controls = $carousel.next().filter( '.controls' ),
              $items = $carousel_container.find( options.items ),
              $goto_links = $carousel_controls.find( '.go-to-slide' ),
              original_width = 0;

          $items.each(function(){ original_width += $(this).outerWidth(true) });
          $carousel_container.width( original_width );

          // first item
          $first = $items.filter( ':first' );
          $first.addClass( 'active' );
          $goto_links.filter( ':first' ).addClass( 'active' );

          // infinite carousel
          if ( options.infinite ){

            original_width = original_width * 3;
            $carousel_container.width( original_width );

            $items.clone().addClass( '-before' ).insertBefore( $first );
            $items.clone().addClass( '-after' ).insertAfter( $items.filter(':last') );
            $carousel.scrollLeft( $carousel.scrollLeft() + $first.position().left );

            $items = $carousel_container.find( options.items );

          }

          $carousel.goto_links = $goto_links;
          $carousel.interval = null;
          $carousel.items = $items;
          $carousel.options = options;

          // attach events
          $carousel.on( 'nextSlide', function( event, duration ){

            var scroll = $carousel.scrollLeft(),
                x = 0,
                slide = 0;

            $items.each(function( i ){
              if ( x == 0 && $( this ).position().left > 1 ){
                x = $( this ).position().left;
                slide = i;
              }
            });

            if ( x > 0 && $carousel_container.outerWidth() - scroll - $carousel.width() > 0 ){
              slideTo( event, $carousel, scroll+x, slide );
            } else if ( options.loop ){
              // return to first
              slideTo( event, $carousel, 0, 0, 'slow' );
            }

          });
          $carousel.on( 'prevSlide', function( event, duration ){

            var scroll = $carousel.scrollLeft(),
                x = 0,
                slide = 0;

            $items.each(function( i ){
              if ( $( this ).position().left < 0 ){
                x = $( this ).position().left;
                slide = i;
              }
            });

            if ( x ){
              slideTo( event, $carousel, scroll+x, slide )
            } else if ( options.loop ){
              // return to last
              var a = $carousel_container.outerWidth() - $carousel.width();
              var b = $items.filter( ':last' ).position().left;
              slide = $items.length - 1;
              if ( a > b ){
                slideTo( event, $carousel, b, slide, 'slow' );
              } else {
                slideTo( event, $carousel, a, slide, 'slow' );
              }
            }

          });
          $carousel.on( 'nextPage', function( event, duration ){

            var scroll = $carousel.scrollLeft(),
                width = $carousel.width(),
                x = 0,
                slide = 0;

            $items.each(function( i ){
              if ( $( this ).position().left < 1 + width ){
                x = $( this ).position().left;
                slide = i;
              }
            });

            if ( x > 0 && scroll + width < original_width ){
              slideTo( event, $carousel, scroll+x, slide, 'slow' );
            } else if ( options.loop ){
              // return to first
              slideTo( event, $carousel, 0, 0, 'slow' );
            }

          });
          $carousel.on( 'prevPage', function( event, duration ){

            var scroll = $carousel.scrollLeft(),
                width = $carousel.width(),
                x = 0,
                slide = 0;

            $items.each(function( i ){
              if ( $( this ).position().left < 1 - width ){
                x = $( this ).position().left;
                slide = i;
              }
            });

            if ( scroll ){
              if ( x == 0 ){
                slideTo( event, $carousel, 0, 0 );
              } else {
                slideTo( event, $carousel, scroll+x, slide );
              }
            } else if ( options.loop ) {
              // return to last
              var a = $carousel_container.outerWidth() - width;
              var b = $items.filter( ':last' ).position().left;
              if ( a > b ){
                slideTo( event, $carousel, b, slide, 'slow' );
              } else {
                slideTo( event, $carousel, a, slide, 'slow' );
              }
            }

          });
          $carousel.on( 'slideTo', function( event, i, duration ){

            if ( options.infinite ) {
              i += $carousel.items.filter( '.-before' ).length;
            }
            slideTo(
              event, $carousel,
              $carousel.scrollLeft() + $items.filter( ':eq(' + i +')' ).position().left,
              i, duration );

          });
          $carousel.on( 'play', function( event, interval ){

            if ( typeof interval === 'undefined' ){
              interval = options.interval;
            }
            $carousel.trigger( 'stop' );
            $carousel.interval = window.setInterval(function(){
                $carousel.trigger( 'nextSlide' );
            }, interval);

          });
          $carousel.on( 'stop', function( event ){

            if ( $carousel.interval !== null ){
              window.clearInterval( $carousel.interval );
              $carousel.interval = null;
            }

          });

          // controls
          $carousel_controls.find( ".next-slide" ).on("click", function(event){
            checkDelay( $carousel );
            $carousel.trigger( "nextSlide" );
            event.preventDefault();
          });
          $carousel_controls.find( ".prev-slide" ).on("click", function(event){
            checkDelay( $carousel );
            $carousel.trigger( "prevSlide" );
            event.preventDefault();
          });
          $carousel_controls.find( ".next-page" ).on("click", function(event){
            checkDelay( $carousel );
            $carousel.trigger( "nextPage" );
            event.preventDefault();
          });
          $carousel_controls.find( ".prev-page" ).on("click", function(event){
            checkDelay( $carousel );
            $carousel.trigger( "prevPage" );
            event.preventDefault();
          });
          $carousel_controls.find( ".go-to-slide" ).on("click", function(event){
            checkDelay( $carousel );
            $carousel.trigger( "slideTo", $(this).text() - 1 );
            event.preventDefault();
          });
          $carousel_controls.find( ".play-carousel" ).on("click", function(event){
            $carousel.trigger( "play" );
            event.preventDefault();
          });
          $carousel_controls.find( ".stop-carousel" ).on("click", function(event){
            $carousel.trigger( "stop" );
            event.preventDefault();
          });

          $carousel.data( 'carousel', {
            'target'  : $carousel,
            'options' : options
          })

          // automatic play
          if ( options.autoplay ){
            $carousel.trigger( 'play' );
          }

        }

      });

    },
    //
    // Destroy plugin
    //
    destroy : function(){

      return this.each(function(){

        var $carousel = $( this ),
            $carousel_controls = $carousel.next().filter( '.controls' ),
            data = $carousel.data( 'carousel' );

        $carousel.trigger( "stop" );

        $carousel.off( 'nextSlide' );
        $carousel.off( 'prevSlide' );
        $carousel.off( 'nextPage' );
        $carousel.off( 'prevPage' );
        $carousel.off( 'slideTo' );
        $carousel.off( 'play' );
        $carousel.off( 'stop' );

        $carousel_controls.find( '.next-slide' ).off( 'click' );
        $carousel_controls.find( '.prev-slide' ).off( 'click' );
        $carousel_controls.find( '.next-page' ).off( 'click' );
        $carousel_controls.find( '.prev-page' ).off( 'click' );
        $carousel_controls.find( '.go-to-slide' ).off( 'click' );
        $carousel_controls.find( '.play-carousel' ).off( 'click' );
        $carousel_controls.find( '.stop-carousel' ).off( 'click' );

        $carousel.removeData( 'carousel' );

      });

    }
  }

  function slideTo( event, $carousel, x, slide, duration ){

    $carousel.items.filter( ':eq(' + slide + ')' ).addClass( 'active' )
                   .siblings( '.active' ).removeClass( 'active' );


    if ( $carousel.options.infinite ) {
      var $active = $carousel.items.filter( '.active' );
      if ( $active.hasClass( '-before' ) ){
        // Nothing to do.
      } else if ( $active.hasClass( '-after' ) ){
        slide -= $carousel.items.filter( ':not(.-after)' ).length;
      } else {
        slide -= $carousel.items.filter( '.-before' ).length;
      }
    }
    $carousel.goto_links.filter( ':eq(' + slide + ')' ).addClass( 'active' )
                        .siblings( '.active' ).removeClass( 'active' );

    if ( typeof duration === 'undefined' ){
      duration = $carousel.options.speed;
    }
    if ( duration ){
      $carousel.animate({ 'scrollLeft' : x }, duration, function(){
        checkInfinite( $carousel );
      });
    } else {
      $carousel.scrollLeft( x );
      checkInfinite( $carousel );
    }
  }

  function checkDelay( $carousel ){
    if ( $carousel.interval && $carousel.options.delay ){
      $carousel.trigger( "stop" );
      window.setTimeout(function(){
        $carousel.trigger( "play" );
      }, $carousel.options.delay );
    }
  }

  function checkInfinite( $carousel ){
    if ( $carousel.options.infinite ) {
      var $active = $carousel.items.filter( '.active' );
      if ( $active.hasClass( '-before' ) ){
        $active.removeClass( 'active' );
        var slide = $active.prevAll().length;
        $active = $carousel.items.filter( ':not(.-before):eq(' + slide + ')' );
        $active.addClass( 'active' );
        $carousel.scrollLeft( $carousel.scrollLeft() + $active.position().left );
      } else if ( $active.hasClass( '-after' ) ){
        $active.removeClass( 'active' );
        var slide = $active.prevAll( '.-after' ).length;
        $active = $carousel.items.filter( ':not(.-before):eq(' + slide + ')' );
        $active.addClass( 'active' );
        $carousel.scrollLeft( $carousel.scrollLeft() + $active.position().left );
      }
    }
  }

  $.fn.carousel = function( method ){
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || !method ){
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.carousel' );
    }
  };

  $.fn.carousel.defaults = {
    'container' : '> *:first',
    'items'     : '> *',
    'loop'      : true,
    'infinite'  : false,
    'speed'     : 400,
    'interval'  : 5000,
    'delay'     : 2500,
    'autoplay'  : false
  }

}));
