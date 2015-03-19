/*
 * Thickbox 2.1 - jQuery plugin for displaying content in a box above the page
 * 
 * Copyright (c) 2006, 2007 Cody Lindley (http://www.codylindley.com)
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

// on page load call TB_init
jQuery(document).ready(TB_init);

// add thickbox to href elements that have a class of .thickbox
function TB_init(){
	jQuery("a.thickbox").click(function(event){
		// stop default behaviour
		event.preventDefault();
		// remove click border
		this.blur();
	
		// get caption: either title or name attribute
		var caption = this.title || this.name || "";
		
		// get rel attribute for image groups
		var group = this.rel || false;
		
		// display the box for the elements href
		TB_show(caption, this.href, group);
	});
}

// called when the user clicks on a thickbox link
function TB_show(caption, url, rel) {
	// create iframe, overlay and box if non-existent
	if ( !jQuery("#TB_HideSelect").length ) {
		jQuery("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
		jQuery("#TB_overlay").click(TB_remove);
	}
	// TODO replace or check if event is already assigned
	jQuery(window).scroll(TB_position);
	
	// TODO replace
	TB_overlaySize();
	
	// TODO create loader only once, hide and show on demand
	jQuery("body").append("<div id='TB_load'><img src='"+fileThickboxLoadingImage+"' /></div>");
	TB_load_position();
	
	// check if a query string is involved
	var baseURL = url.match(/(.+)?/)[1] || url;

	// regex to check if a href refers to an image
	var imageURL = /\.(jpe?g|png|gif|bmp)/gi;

	// check for images
	if ( baseURL.match(imageURL) ) {
		var dummy = { caption: "", url: "", html: "" };
		
		var prev = dummy,
			next = dummy,
			imageCount = "";
			
		// if an image group is given
		if ( rel ) {
			function getInfo(image, id, label) {
				return {
					caption: image.title,
					url: image.href,
					html: "<span id='TB_" + id + "'>&nbsp;&nbsp;<a href='#'>" + label + "</a></span>"
				}
			}
		
			// find the anchors that point to the group
			var imageGroup = jQuery("a[rel='"+rel+"']").get();
			var foundSelf = false;
			var imageTitle = 'Gallery'; //default to something sane
			// loop through the anchors, looking for ourself, saving information about previous and next image
			for (var i = 0; i < imageGroup.length; i++) {
				var image = imageGroup[i];
				var urlTypeTemp = image.href.match(imageURL);
				
				// look for ourself
				if ( image.href == url ) {
					foundSelf = true;
					imageCount = "Image " + (i + 1) + " of "+ (imageGroup.length);
          if(image.rel != null) {
            imageTitle = image.rel.replace(/_/, " ");
					}
				} else {
					// when we found ourself, the current is the next image
					if ( foundSelf ) {
						next = getInfo(image, "next", "Next &gt;");
						// stop searching
						break;
					} else {
						// didn't find ourself yet, so this may be the one before ourself
						prev = getInfo(image, "prev", "&lt; Prev");
					}
				}
			}
		}
		
		imgPreloader = new Image();
		imgPreloader.onload = function() {
			imgPreloader.onload = null;

			// Resizing large images
			var pagesize = TB_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing
			
			// TODO don't use globals
      if(imageGroup.length > 1) { 
        TB_WIDTH = imageWidth + 30 + 76 + 18;
        TB_HEIGHT = imageHeight + 60; 
        // Browser detection is bad and all, but hey, its better than things not working
        if(jQuery.browser.msie) {
          TB_HEIGHT += 30; 
          if(navigator.appVersion.match(/MSIE\s6\.0/) == "MSIE 6.0") {
            TB_WIDTH += 20;
					}
				}
        
        // make additional image links and containing div
        thumbPreloader = Array();
        additional_links = "<div id='TB_additional_images'>";
        var thumb_x = 76;
        var thumb_y = imageHeight;
        
        for (var i = 0; i < imageGroup.length; i++) {
          var image = imageGroup[i];
          // look for ourself
          var image_selected = "";
          if ( image.href == url ) {
            image_selected = "class='TB_Selected'";
            }
            
          thumbPreloader[i] = new Image();
          thumbPreloader[i].onload = function() {
            //thumbPreloader[i].onload = null;    
					}  
        thumbPreloader[i].src = image.href;
        var thumbImgWidth = thumbPreloader[i].width;
        var thumbImgHeight = thumbPreloader[i].height;
        if (thumbImgWidth > thumb_x) {
          thumbImgHeight = Math.floor(thumbImgHeight * (thumb_x / thumbImgWidth)); 
          thumbImgWidth = Math.floor(thumb_x); 
          if (thumbImgHeight > thumb_y) { 
            thumbImgWidth = Math.floor(thumbImgWidth * (thumb_y / thumbImgHeight)); 
            thumbImgHeight = Math.floor(thumb_y); 
					}
				}
				if(thumbImgWidth < 1) {
          thumbImgWidth = thumb_x;				
				}
				
				if(thumbImgHeight < 1) {
          thumbImgHeight = 60				
				}
				
				if(jQuery('img',image).attr('src') == null) {
					image_src = jQuery(image).attr('rev');
				} else {
					image_src = jQuery('img',image).attr('src');
				}
				
				image_src = image_src.replace(/width=(\d)*/, "width="+thumbImgWidth);
				image_src = image_src.replace(/height=(\d)*/, "height="+thumbImgHeight);
        additional_links += "<a href='#' "+image_selected+" id='TB_ThumbnailLink_"+i+"' ><img class='TB_Thumbnail_Image' src='"+image_src+"' width='"+thumbImgWidth+"' height='"+thumbImgHeight+"' alt=''/></a>";
        }
        
        additional_links += "</div>";
       jQuery("#TB_window").append("<div id='TB_Header'><div id='TB_TopCloseAjaxWindow'><a href='#' id='TB_TopCloseWindowButton' title='Close'>close</a></div>"+imageTitle+"</div>");
        
        jQuery("#TB_window").append(additional_links);
        jQuery("#TB_TopCloseWindowButton").click(TB_remove);
        }
        else
          {
          TB_WIDTH = imageWidth + 30;
          TB_HEIGHT = imageHeight + 60;
          }
			// TODO empty window content instead
			jQuery("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + imageCount + prev.html + next.html + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div>");
			
			jQuery("#TB_closeWindowButton").click(TB_remove);
   
      function buildClickHandler(image) {
         return function() {
            jQuery("#TB_window").remove();
            jQuery("body").append("<div id='TB_window'></div>");
            TB_show(image.caption, image.url, rel);
            return false;
          };
       }   
      
      if(imageGroup.length > 1)
        {  
        goImage = Array();
        for (var i = 0; i < imageGroup.length; i++) {      
          goImage[i] = buildClickHandler(getInfo(imageGroup[i], "image_"+i+"", ""));
          jQuery("#TB_ThumbnailLink_"+i+"").click(goImage[i]);
          }
        }
			var goPrev = buildClickHandler(prev);
			var goNext = buildClickHandler(next);
			if ( prev.html ) {
				jQuery("#TB_prev").click(goPrev);
			}
			
			if ( next.html ) {		
				jQuery("#TB_next").click(goNext);
			}
			
			// TODO use jQuery, maybe with event fix plugin, or just get the necessary parts of it
			document.onkeydown = function(e) {
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				switch(keycode) {
				case 27:
					TB_remove();
					break;
				case 190:
					if( next.html ) {
						document.onkeydown = null;
						goNext();
					}
					break;
				case 188:
					if( prev.html ) {
						document.onkeydown = null;
						goPrev();
					}
					break;
				}
			}
			
			// TODO don't remove loader etc., just hide and show later
			TB_position();
			jQuery("#TB_load").remove();
			jQuery("#TB_ImageOff").click(TB_remove);
			
			// for safari using css instead of show
			// TODO is that necessary? can't test safari
			jQuery("#TB_window").css({display:"block"});
		}
		imgPreloader.src = url;
		
	} else { //code to show html pages
		//alert(url);
		var queryString = url.match(/\?(.+)/)[1];
		var params = TB_parseQuery( queryString );
		
		TB_WIDTH = (params['width']*1) + 30;
		TB_HEIGHT = (params['height']*1) + 40;

		var ajaxContentW = TB_WIDTH - 30,
			ajaxContentH = TB_HEIGHT - 45;
		
		if(url.indexOf('TB_iframe') != -1){				
			urlNoQuery = url.split('TB_');		
			jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' onload='TB_showIframe()'> </iframe>");
		} else {
			jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");
		}
				
		jQuery("#TB_closeWindowButton").click(TB_remove);
		
			if(url.indexOf('TB_inline') != -1){	
				jQuery("#TB_ajaxContent").html(jQuery('#' + params['inlineId']).html());
				TB_position();
				jQuery("#TB_load").remove();
				jQuery("#TB_window").css({display:"block"}); 
			}else if(url.indexOf('TB_iframe') != -1){
				TB_position();
				if(frames['TB_iframeContent'] == undefined){//be nice to safari
					jQuery("#TB_load").remove();
					jQuery("#TB_window").css({display:"block"});
					jQuery(document).keyup( function(e){ var key = e.keyCode; if(key == 27){TB_remove()} });
				}
			}else{
				jQuery("#TB_ajaxContent").load(url, function(){
					TB_position();
					jQuery("#TB_load").remove();
					jQuery("#TB_window").css({display:"block"}); 
				});
			}	
	}
	
	jQuery(window).resize(TB_position);
	
	document.onkeyup = function(e){ 	
		if (e == null) { // ie
			keycode = event.keyCode;
		} else { // mozilla
			keycode = e.which;
		}
		if(keycode == 27){ // close
			TB_remove();
		}	
	}
		
}

//helper functions below

function TB_showIframe(){
	jQuery("#TB_load").remove();
	jQuery("#TB_window").css({display:"block"});
}

function TB_remove() {
 	jQuery("#TB_imageOff").unbind("click");
	jQuery("#TB_overlay").unbind("click");
	jQuery("#TB_closeWindowButton").unbind("click");
  jQuery("#TB_TopCloseWindowButton").unbind("click");
	jQuery("#TB_window").fadeOut("fast",function(){jQuery('#TB_window,#TB_overlay,#TB_HideSelect').remove();});
	jQuery("#TB_load").remove();
	return false;
}

function TB_position() {
	var pagesize = TB_getPageSize();	
	var arrayPageScroll = TB_getPageScrollTop();
	var style = {width: TB_WIDTH, left: (arrayPageScroll[0] + (pagesize[0] - TB_WIDTH)/2), top: (arrayPageScroll[1] + (pagesize[1]-TB_HEIGHT)/2)};
	jQuery("#TB_window").css(style);
	jQuery("#TB_window").css("margin-top", 0);
}

function TB_overlaySize(){
	if (window.innerHeight && window.scrollMaxY || window.innerWidth && window.scrollMaxX) {	
		yScroll = window.innerHeight + window.scrollMaxY;
		xScroll = window.innerWidth + window.scrollMaxX;
		var deff = document.documentElement;
		var wff = (deff&&deff.clientWidth) || document.body.clientWidth || window.innerWidth || self.innerWidth;
		var hff = (deff&&deff.clientHeight) || document.body.clientHeight || window.innerHeight || self.innerHeight;
		xScroll -= (window.innerWidth - wff);
		yScroll -= (window.innerHeight - hff);
	} else if (document.body.scrollHeight > document.body.offsetHeight || document.body.scrollWidth > document.body.offsetWidth){ // all but Explorer Mac
		yScroll = document.body.scrollHeight;
		xScroll = document.body.scrollWidth;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		yScroll = document.body.offsetHeight;
		xScroll = document.body.offsetWidth;
  	}
	jQuery("#TB_overlay").css({"height": yScroll, "width": xScroll});
	jQuery("#TB_HideSelect").css({"height": yScroll,"width": xScroll});
}

function TB_load_position() {
	var pagesize = TB_getPageSize();
	var arrayPageScroll = TB_getPageScrollTop();
	jQuery("#TB_load")
		.css({left: (arrayPageScroll[0] + (pagesize[0] - 100)/2), top: (arrayPageScroll[1] + ((pagesize[1]-100)/2)) })
		.css({display:"block"});
}

function TB_parseQuery ( query ) {
	// return empty object
	if( !query )
		return {};
	var params = {};
	
	// parse query
	var pairs = query.split(/[;&]/);
	for ( var i = 0; i < pairs.length; i++ ) {
		var pair = pairs[i].split('=');
		if ( !pair || pair.length != 2 )
			continue;
		// unescape both key and value, replace "+" with spaces in value
		params[unescape(pair[0])] = unescape(pair[1]).replace(/\+/g, ' ');
   }
   return params;
}

function TB_getPageScrollTop(){
	var yScrolltop;
	var xScrollleft;
	if (self.pageYOffset || self.pageXOffset) {
		yScrolltop = self.pageYOffset;
		xScrollleft = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop || document.documentElement.scrollLeft ){	 // Explorer 6 Strict
		yScrolltop = document.documentElement.scrollTop;
		xScrollleft = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScrolltop = document.body.scrollTop;
		xScrollleft = document.body.scrollLeft;
	}
	arrayPageScroll = new Array(xScrollleft,yScrolltop) 
	return arrayPageScroll;
}

function TB_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight
	arrayPageSize = new Array(w,h) 
	return arrayPageSize;
}
