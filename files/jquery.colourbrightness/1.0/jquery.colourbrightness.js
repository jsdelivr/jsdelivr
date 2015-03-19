/*
 *  colourBrightness.js
 *
 *  Copyright 2013, Jamie Brittain - http://jamiebrittain.com
 *  Released under the WTFPL license
 *  http://sam.zoy.org/wtfpl/
 *
 *  Github:  http://github.com/jamiebrittain/colourBrightness.js
 *  Version: 1.0
 */

(function($){
  $.fn.colourBrightness = function(){
    var r,g,b,brightness,
        colour = this.css("background-color");

    if (colour.match(/^rgb/)) {
      colour = colour.match(/rgb\(([^)]+)\)/)[1];
      colour = colour.split(/ *, */).map(Number);
      r = colour[0];
      g = colour[1];
      b = colour[2];
    } else if ('#' == colour[0] && 7 == colour.length) {
      r = parseInt(colour.slice(1, 3), 16);
      g = parseInt(colour.slice(3, 5), 16);
      b = parseInt(colour.slice(5, 7), 16);
    } else if ('#' == colour[0] && 4 == colour.length) {
      r = parseInt(colour[1] + colour[1], 16);
      g = parseInt(colour[2] + colour[2], 16);
      b = parseInt(colour[3] + colour[3], 16);
    }

    brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness < 125) {
      // white text
      this.removeClass("light").addClass("dark");
    } else {
      // black text
      this.removeClass("dark").addClass("light");
    }
  }
})(jQuery);