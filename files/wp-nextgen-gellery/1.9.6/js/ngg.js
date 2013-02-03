jQuery("document").ready(function(){
	// register ajax gallery-navigation listeners
	jQuery("a.page-numbers").click(function(e) {
		return ngg_ajax_navigation(e, this);
	});
	jQuery("a.prev").click(function(e) {
		return ngg_ajax_navigation(e, this);
	});
	jQuery("a.next").click(function(e) {
		return ngg_ajax_navigation(e, this);
	});
	
	// register ajax browser-navigation listeners
	jQuery("a.ngg-browser-next").click(function(e) {
		return ngg_ajax_browser_navigation(e, this);
	});
	jQuery("a.ngg-browser-prev").click(function(e) {
		return ngg_ajax_browser_navigation(e, this);
	});
});

function ngg_ajax_navigation(e, obj) {
	// try to find page number
	var pageNumber = 0;
	if (jQuery(obj).hasClass("page-numbers")) {
		pageNumber = jQuery(obj).contents()[0].data;
	} else if (jQuery(obj).hasClass("prev")) {
		pageNumber = jQuery(obj).attr("id").substr(9);
	} else if (jQuery(obj).hasClass("next")) {
		pageNumber = jQuery(obj).attr("id").substr(9);
	}
	
	// try to find gallery number by checking the parents ID until we find a matching one
	var currentNode = obj.parentNode;
	while (null != currentNode.parentNode && !jQuery.nodeName(currentNode.parentNode, "body") && "ngg-gallery-" != jQuery(currentNode.parentNode).attr("id").substring(0, 12)) {
		currentNode = currentNode.parentNode;
	}
	
	if (jQuery(currentNode.parentNode).attr("id")) {
		var gallery = jQuery(currentNode.parentNode);

		// we found a gallery, let's extract the post id & gallery id
		var payload = gallery.attr("id").substring(12);
		var separatorPosition = parseInt(payload.indexOf("-"));
		
		var galleryId = payload.substr(0, separatorPosition);
		var postId = payload.substr(separatorPosition + 1);

		if ( (galleryId.length == 0) || (postId.length == 0) ) {
			return true;
		}
				
		ngg_show_loading(e);
		
		// load gallery content
		jQuery.get(ngg_ajax.callback, {p: postId, galleryid: galleryId, nggpage: pageNumber, type: "gallery"}, function (data, textStatus) {
			
			// delete old content
			gallery.children().remove();
			
			// add new content
			gallery.replaceWith(data);
			
			// add ajax-navigation, again
			jQuery("document").ready(function(){
				// remove old listeners to avoid double-clicks
				jQuery("a.page-numbers").unbind("click");
				jQuery("a.prev").unbind("click");
				jQuery("a.next").unbind("click");
				
				// add shutter-listeners again
				shutterReloaded.init('sh');
				
				jQuery("a.page-numbers").click(function(e) {
					return ngg_ajax_navigation(e, this);
				});
				jQuery("a.prev").click(function(e) {
					return ngg_ajax_navigation(e, this);
				});
				jQuery("a.next").click(function(e) {
					return ngg_ajax_navigation(e, this);
				});
				
				ngg_remove_loading();
			});
		});
		
		// deactivate HTML link
		return false;
	}
	
	// an error occurred, use traditional HTML link
	return true;
};

function ngg_ajax_browser_navigation(e, obj) {
	

	// try to find gallery number
	if ("ngg-prev-" == jQuery(obj).attr("id").substr(0, 9) || "ngg-next-" == jQuery(obj).attr("id").substr(0, 9)) {
		
		// extract the image-id
		var imageNumber = jQuery(obj).attr("id").substr(9);

		// find the image-browser-container
		var currentNode = obj;
		while (null != currentNode.parentNode && !jQuery.nodeName(currentNode.parentNode, "body") && !jQuery(currentNode.parentNode).hasClass("ngg-imagebrowser")) {
			currentNode = currentNode.parentNode;
		}
		
		if (jQuery(currentNode.parentNode).hasClass("ngg-imagebrowser")) {
			var gallery = jQuery(currentNode.parentNode);

			// let's extract the post id & gallery id
			var payload = gallery.attr("id").substring(17);
			var separatorPosition = parseInt(payload.indexOf("-"));
			
			var galleryId = payload.substr(0, separatorPosition);
			var postId = payload.substr(separatorPosition + 1);
			
			if ( (galleryId.length == 0) || (postId.length == 0) ) {
				return true;
			}
			
			ngg_show_loading(e);
			
			// get content
			jQuery.get(ngg_ajax.callback, {p: postId, galleryid: galleryId, pid: imageNumber, type: "browser"}, function (data, textStatus) {
				// delete old content
				gallery.children().remove();
				
				// add new content
				gallery.replaceWith(data);
				
				// add ajax-navigation, again
				jQuery("document").ready(function(){
					// remove old listeners to avoid double-clicks
					jQuery("a.ngg-browser-next").unbind("click");
					jQuery("a.ngg-browser-prev").unbind("click");
					
					// add shutter-listeners again
					shutterReloaded.init('sh');
					
					// register ajax browser-navigation listeners
					jQuery("a.ngg-browser-next").click(function(e) {
						return ngg_ajax_browser_navigation(e, this);
					});
					jQuery("a.ngg-browser-prev").click(function(e) {
						return ngg_ajax_browser_navigation(e, this);
					});
					
					ngg_remove_loading();
				});
			});
	
			// deactivate HTML link
			return false;
		}
	}
	
	return true;
}

var loadingImage;
function ngg_show_loading(obj) {
	loadingImage = jQuery(document.createElement("img")).attr("src", ngg_ajax.path + "images/ajax-loader.gif").attr("alt", ngg_ajax.loading);

	jQuery("body").append(loadingImage);
	
	jQuery(loadingImage).css({
		position: "absolute",
		top: (obj.pageY + 15) + "px",
		left: (obj.pageX + 15) + "px"
	});
	
	jQuery(document).mousemove(function(e) {
		loadingImage.css({
			top: (e.pageY + 15) + "px",
			left: (e.pageX + 15) + "px"
		});
	});
}

function ngg_remove_loading() {
	jQuery(document).unbind("mousemove");
	
	jQuery(loadingImage).remove();
}