/*! Copyright 2011, Ben Lin (http://dreamerslab.com/)
* Licensed under the MIT License (LICENSE.txt).
*
* Version: 1.1.0
*
* Requires: jQuery 1.2.6+
*/
;( function( $, window ){
  $.fn.center = function( opt ){
    var $w        = $( window ); // cache gobal
    var scrollTop = $w.scrollTop();

    return this.each( function(){
      var $this = $( this ); // cache $( this )
      // merge user options with default configs
      var configs = $.extend({
        against       : 'window',
        top           : false,
        topPercentage : 0.5,
        resize        : true
      }, opt );

      var centerize = function(){
        var against = configs.against;
        var $against;

        if( against === 'window' ){
          $against = $w;
        }else if( against === 'parent' ){
          $against = $this.parent();
          scrollTop = 0;
        }else{
          $against = $this.parents( against );
          scrollTop = 0;
        }

        var x = (( $against.width()) - ( $this.outerWidth())) * 0.5;
        var y = (( $against.height()) - ( $this.outerHeight())) * configs.topPercentage + scrollTop;

        if( configs.top ) y = configs.top + scrollTop;

        $this.css({
          'left' : x,
          'top' : y
        });
      };

      // apply centerization
      centerize();
      if( configs.resize === true ) $w.resize( centerize );
    });
  };
})( jQuery, window );