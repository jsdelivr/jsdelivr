/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.flipText.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 16/01/13 22.49
 *  *****************************************************************************
 */

/*Browser detection patch*/
(function(){if(!(8>jQuery.fn.jquery.split(".")[1])){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.msie=!1;var a=navigator.userAgent;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if(jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=a.substring(b+6),-1!=(b= a.indexOf("Version")))jQuery.browser.fullVersion=a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))jQuery.browser.webkit=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion= a.substring(b+8)}else if(-1!=(b=a.indexOf("Firefox")))jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))jQuery.browser.name=a.substring(c,b),jQuery.browser.fullVersion=a.substring(b+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName);if(-1!=(a=jQuery.browser.fullVersion.indexOf(";")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, a);if(-1!=(a=jQuery.browser.fullVersion.indexOf(" ")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,a);jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}})(jQuery);

(function($) {
  var isIE=$.browser.msie;
  jQuery.fn.encHTML = function() {
    return this.each(function(){
      var me   = $(this);
      var html = me.text();
      me.text(html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g, escape("'")).replace(/"/g,escape('"')));
//      me.text(html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g, "’").replace(/"/g,"“"));
    });
  };
  $.mbflipText= {
    author:"Matteo Bicocchi",
    version:"1.1",
    flipText:function(tb){
      var UTF8encoded=$("meta[http-equiv=Content-Type]").attr("content") && $("meta[http-equiv=Content-Type]").attr("content").indexOf("utf-8")>-1;
      return this.each(function(){
        var el= $(this);
        var h="";
        var w="";

        var label="";
        var bgcol=(el.css("background-color") && el.css("background-color") != "rgba(0, 0, 0, 0)") ? el.css("background-color"):"#fff";
        var fontsize= parseInt(el.css('font-size'))>0?parseInt(el.css('font-size')):14;
        var fontfamily=el.css('font-family')?el.css('font-family').replace(/\'/g, '').replace(/"/g,''):"Arial";
        var fontcolor=el.css('color')? el.css('color'):"#000";

        if ($.browser.msie){
          if(!tb) el.css({'writing-mode': 'tb-rl', height:h, filter: 'fliph() flipv("") ', whiteSpace:"nowrap", lineHeight:fontsize+2+"px"}).css('font-weight', 'normal');
          label=$("<span style='writing-mode: tb-rl; whiteSpace:nowrap; height:"+h+"; width:"+w+"; line-height:"+(fontsize+2)+"px'>"+el.html()+"</span>");
        }else{

          var dim=el.getFlipTextDim(false);

          h=dim[1];
          w=dim[0];
          if(!isIE ) el.encHTML();
          var txt= el.text();

          var rot="-90";
          var ta="end";
          var xFix=0;
          var yFix=$.browser.opera ? parseInt(w)-(parseInt(w)/4): $.browser.safari?5:0;
          if (tb){
            yFix=$.browser.opera?20:0;
            xFix= $.browser.safari?(fontsize/4):0;
            rot="90, "+((parseInt(w)/2)-xFix)+", "+parseInt(w)/2;
            ta="start";
          }
          var onClick= el.attr("onclick") || el.attr("href");
          var clickScript= onClick?"<div class='pointer' style='position:absolute;top:0;left:0;width:100%;height:100%;background:transparent'/>":"";

          label=$("<object class='flip_label' style='height:"+h+"px; width:"+w+"px;' type='image/svg+xml' data='data:image/svg+xml; charset=utf-8 ," +
                  "<svg xmlns=\"http://www.w3.org/2000/svg\">" +
                  "<rect x=\"0\" y=\"0\" width=\""+w+"px\" height=\""+h+"px\" fill=\""+bgcol+"\" stroke=\"none\"/>"+
                  "<text  x=\"-"+xFix+"\" y=\""+yFix+"\" font-family=\""+fontfamily+"\"  fill=\""+fontcolor+"\" font-size=\""+fontsize+"\"  style=\"text-anchor: "+ta+"; " +
                  "dominant-baseline: hanging\" transform=\"rotate("+rot+")\" text-rendering=\"optimizeSpeed\">"+txt+"</text></svg>'></object>" +
                  clickScript +
                  "");
        }
        var wrapper= onClick ? $("<div/>").css("position","relative"): $("");
        var cssPos= el.wrap(wrapper).css("position")!="absolute" || el.css("position")!="fixed"  ?"relative" : el.css("position");
        el.html(label).css({position:cssPos, width:w});
      });
    },
    getFlipTextDim:function(enc){
      var el= $(this);
//      if(!enc && !isIE) el.encHTML();
      var txt= el.html();
      var fontsize= parseInt(el.css('font-size'));
      var fontfamily=el.css('font-family').replace(/'/g, '').replace(/"/g,'');
      if (fontfamily==undefined) fontfamily="Arial";
      var placeHolder=$("<span/>").css({position:"absolute",top:-100, whiteSpace:"noWrap", fontSize:fontsize, fontFamily: fontfamily});
      placeHolder.text(txt);
      $("body").append(placeHolder);
      var h = (placeHolder.outerWidth()!=0?placeHolder.outerWidth():(16+txt.length*fontsize*.60));
      var w = (placeHolder.outerHeight()!=0?placeHolder.outerHeight()+5:50);
      placeHolder.remove();
      return [w,h];
    }
  };
  $.fn.mbFlipText=$.mbflipText.flipText;
  $.fn.getFlipTextDim=$.mbflipText.getFlipTextDim;

})(jQuery);
