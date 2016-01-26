/*
picstrips by Steve Claridge (http://www.moreofless.co.uk)
*/
(function( $ ){

  $.fn.picstrips = function( options ) {  

    var settings = $.extend( {
      'splits': 8, 
      'hgutter': '10px', 
      'vgutter': '60px', 
      'bgcolor': '#fff'
    }, options );

    return this.each( function() {     
  
      var that = this;   

      function doStrips() {
        var h = $(that).height(),
            w = $(that).width(),
            sw = (w / settings.splits), //width of a strip
	        clstyle = "position: relative; float:left; margin-right: " + settings.hgutter + "; background-image: url('" + that.src + "'); width: " + sw + "px; height: " + h + "px;",
            spstyle = "position: absolute; left: 0px; width: " + sw + "px; height: " + settings.vgutter + "; background-color: " + settings.bgcolor + "; top: ";

        var cnt = $("[id^=molbars_]").length + 1;
 
        $( '<div id="molbars_' + cnt + '"></div>' ).insertAfter( $(that) );

        for ( var lp = 0; lp < settings.splits; lp++ ) {
          var voffs = lp % 2 != 0 ? '0px' : (h - parseInt( settings.vgutter )) + 'px';
          clstyle += " background-position: -" + (w - ((settings.splits - lp) * sw)) + "px 100%;";
          $( '<div style="' + clstyle + '"><span style="' + spstyle + voffs + '"></span></div>' ).appendTo( $( '#molbars_' + cnt ) );  
        };
        $(that).hide();
      }

      //make sure image has finished loading
      if ( !this.complete || this.width + this.height == 0 ) {
        var img = new Image; 
        img.src = this.src;
        $(img).load( function () {
          doStrips();
        });
      }
      else {
        doStrips();
      }

    });
  };
})( jQuery );
