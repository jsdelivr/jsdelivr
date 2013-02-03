/*!
 * NextGEN Slideshow based on jQuery Cycle Plugin
 * Copyright (c) 2010-2012 Alex Rabe
 * Version: 1.0.6
 * Requires: jQuery v1.2.6 or later
 */
jQuery.fn.nggSlideshow = function ( args ) { 
    
    var defaults = { id:    1,
                     width: 320,
                     height: 240,
                     fx: 	'fade',
                     domain: '',
                     timeout: 5000 };
                     
    var s = jQuery.extend( {}, defaults, args);
    
    var obj = this.selector;
    var stack = [];
    var url = s.domain + 'index.php?callback=json&api_key=true&format=json&method=gallery&id=' + s.id;
	/*  
		the stackLength var will store stack length for ref - it is quicker to ref memory than make a call to find an obj property
		stack length is first collected in jQuery.getJSON(); stack length is auto-decremented in loadImage() + jCycle_onBefore()
	*/
	var stackLength = 0; 

	jQuery.getJSON(url, function(r){
		
		if (r.stat == "ok"){
            
            for (img in r.images) {
				var photo = r.images[img];
                //populate images into an array
                stack.push( decodeURI( photo['imageURL'] ) );
            }
			stackLength = stack.length; 
			// init loading first 3 images (param 1 in func is first pass)
			loadImage(1); 
		}
	});
	
	// load image and bind appendImage() to the img load - here we are making sure the loads do not get displaced
	function loadImage(num){
         // check that stack is not empty and we haven't alreay loaded 3 images	   
         if(stackLength > 0 && num <= 3) { 
            var img = new Image(); 
            img.src = stack.shift();
			stackLength--;
			// wait to append image until the load is complete
        	jQuery( img ).one('load', function() { appendImage(img, num); }).each(function(){
        		// IE browser : in case it's already cached
        		if(this.complete) jQuery(this).trigger('load');	
        	});
         }
	}
	
	// append image to obj
	function appendImage(img, num){
	     // Hide them first, Cycle plugin will show them
         jQuery( img ).hide();
         // Add the image now and resize after loaded 
		 jQuery( obj ).append( imageResize(img, s.width , s.height) );
         // start slideshow with third image, load next image if not
		 if (num == 3 || stackLength == 0 ) { 
         	startSlideshow(); 
		 } else {
		 	loadImage(++num); // increase index and load next image
         }
		 
	}

    function startSlideshow() {

        // hide the loader icon
    	jQuery( obj + '-loader' ).empty().remove();
        // Start the slideshow
        jQuery(obj + ' img:first').fadeIn(1000, function() {
       	    // Start the cycle plugin
        	jQuery( obj ).cycle( {
        		fx: 	s.fx,
                containerResize: 1,
                fit: 1,
                timeout: s.timeout,
                next:   obj,
                before: jCycle_onBefore
        	});
        });
        
    }

    //Resize Image and keep ratio on client side, better move to server side later
    function imageResize(img, maxWidth , maxHeight) {

        // we need to wait until the image is loaded
        if ( !img.complete )
            jQuery( img ).bind('load', function() { imageResize(img, maxWidth , maxHeight) });

        // in some cases the image is not loaded, we can't resize them
        if (img.height == 0 || img.width == 0)
            return img;
 
        var width, height;

        if (img.width * maxHeight > img.height * maxWidth) {
            // img has a wider ratio than target size, make width fit
    		if (img.width > maxWidth) {
    			width = maxWidth;
    			height = Math.round(img.height / img.width * maxWidth);
    		}
        } else {
            // img has a less wide ratio than target size, make height fit
    		if (img.height > maxHeight) {
    			height = maxHeight;
    			width = Math.round(img.width / img.height * maxHeight);
    		}
        }
  
        jQuery( img ).css({
          'height': height,
          'width': width
        });
                
        return img;
	};

    // add images to slideshow step by step
    function jCycle_onBefore(curr, next, opts) {
        if (opts.addSlide)
            if (stackLength > 0){ // check that stack is not empty
                var img = new Image(); 
                img.src = stack.shift();
				stackLength--;
                jQuery( img ).bind('load', function() {
                    opts.addSlide( imageResize(this, s.width , s.height) );                     
                });
            }
    }; 
}