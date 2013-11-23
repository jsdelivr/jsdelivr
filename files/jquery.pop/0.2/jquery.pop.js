//
//  pop! for jQuery
//  v0.2 requires jQuery v1.2 or later
//  
//  Licensed under the MIT:
//  http://www.opensource.org/licenses/mit-license.php
//  
//  Copyright 2007,2008 SEAOFCLOUDS [http://seaofclouds.com]
//

(function($) {
  
  $.pop = function(options){
    
    // settings
    var settings = {
     pop_class : '.pop',
     pop_toggle_text : ''
    }
    
    // inject html wrapper
    function initpops (){
      $(settings.pop_class).each(function() {
        var pop_classes = $(this).attr("class");
        $(this).addClass("pop_menu");
        $(this).wrap("<div class='"+pop_classes+"'></div>");
        $(".pop_menu").attr("class", "pop_menu");
        $(this).before(" \
          <div class='pop_toggle'>"+settings.pop_toggle_text+"</div> \
          ");
      });
    }
    initpops();
    
    // assign reverse z-indexes to each pop
    var totalpops = $(settings.pop_class).size() + 1000;
    $(settings.pop_class).each(function(i) {
     var popzindex = totalpops - i;
     $(this).css({ zIndex: popzindex });
    });
    // close pops if user clicks outside of pop
    activePop = null;
    function closeInactivePop() {
      $(settings.pop_class).each(function (i) {
        if ($(this).hasClass('active') && i!=activePop) {
          $(this).removeClass('active');
          }
      });
      return false;
    }
    $(settings.pop_class).mouseover(function() { activePop = $(settings.pop_class).index(this); });
    $(settings.pop_class).mouseout(function() { activePop = null; });

    $(document.body).click(function(){ 
     closeInactivePop();
    });
    // toggle that pop
    $(".pop_toggle").click(function(){
      $(this).parent(settings.pop_class).toggleClass("active");
    });
  }

})(jQuery);