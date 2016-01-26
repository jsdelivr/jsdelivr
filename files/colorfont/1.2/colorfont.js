

// Colorfont.js 1.2
// Copyright 2011 Manufactura Independente (Ana Carvalho & Ricardo Lafuente)
// Selection behaviour fix by Simon Budig
// Licensed under the terms of the WTFPL.
// http://sam.zoy.org/wtfpl/

noselect_style = '-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;'
position_style = 'position:absolute;top:0px;left:0px;right:0px;'

$(document).ready(function(){
  // append a span to all colorfont headers
  $('.colorfont').css({position:'relative'});
  $('.colorfont').html(function(){ 
      // if has google note
      if ($('.google-src-text').length > 0){
        var googletext = $(this).find('.google-src-text').text();
        var text = $(this).text().replace(googletext, "");
      }
      else {
        var text = $(this).text();
      }
      return '<span style="' + noselect_style + '">' + text + '</span>' +
             '<span class="colorfont-overlay" style="' + noselect_style + position_style + '">' + text + '</span>' +
             '<span style="color: rgba(0,0,0,0.0);' + position_style + '">' + text + '</span>';
  });
});

