

(function( $ ){
	
	/* ----------------------
	      NAVIGATION
      $(obj).bfNavigation();
	------------------------- */
	
    $.fn.bfNavigation = function( options ) {
	   
	    bfNavigation_settings = {
			container: '.bf_container'
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfNavigation_settings, options );
			}
			var obj = $(this);
			
			var all_containers = $(bfNavigation_settings.container);
			
			$('a', obj).click( function(){
				var a = $(this);
				var li = a.parent();
				var id = (a.attr('href')).split('#')[1];
				if(id!='')
				{
					var container = $('.__'+id.toLowerCase());
					$('li', obj).stop(true, true).removeClass('active');
					li.stop(true, true).addClass('active');
					all_containers.stop(true,true).removeClass('__active');
					container.stop(true,true).addClass('__active');
				}
			});
			
			var hash = (window.location.href).split('#')[1];
			if(hash!=null && hash!='')
			{
				$('a[href="#'+hash+'"]').click();
			}
			
		});
		
    };
	
	
	/* ----------------------
	      CLICKER
      $(obj).bfClicker();
	------------------------- */
	
    $.fn.bfClicker = function( options ) {
	   
	    bfClicker_settings = {
			// no options
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfClicker_settings, options );
			}
			var obj = $(this);
			
			obj.click( function(){
				$(this).prev().click();
			});
			
		});
		
    };
	
   
    /* ----------------------
	      COLOR PICKER
      $(obj).bfColorPicker();
	------------------------- */
	
    $.fn.bfColorPicker = function( options ) {
	   
	    bfColorPicker_settings = {
			// no options
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfColorPicker_settings, options );
			}
			var obj = $(this);
			
			obj.ColorPicker({
				onSubmit: function(hsb, hex, rgb, el) {
					$(el).attr('value', '#' + hex.toUpperCase());
					$(el).css('backgroundColor', '#' + hex);
					$(el).ColorPickerHide();
				},
				onBeforeShow: function () {
					obj.ColorPickerSetColor(this.value);
				},
				onChange: function (hsb, hex, rgb) {
					obj.attr('value', '#' + hex.toUpperCase());
					obj.css('backgroundColor', '#' + hex);
				}
			});
			
		});
		
    };
	
	
	/* ----------------------
	      CHECKBOX
      $(obj).bfCheckbox();
	------------------------- */
	
    $.fn.bfCheckbox = function( options ) {
	   
	    bfCheckbox_settings = {
			// no options
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfCheckbox_settings, options );
			}
			var obj = $(this);
			
			obj.click( function(){
				if(obj.val()=='0')
					obj.stop(true,true).attr('value',1).removeClass('_off').addClass('_on');
				else
					obj.stop(true,true).attr('value',0).removeClass('_on').addClass('_off');
			});
			
		});
		
    };
	
	
	/* ----------------------
	      RADIO BUTTON
      $(obj).bfRadio();
	------------------------- */
	
    $.fn.bfRadio = function( options ) {
	   
	    bfRadio_settings = {
			// no options
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfRadio_settings, options );
			}
			var obj = $(this);
			
			obj.click( function(){
				var obj = $(this);
				var scope = $(this).parent().parent();
				obj.addClass('__radio-selected');
				$('.bf__radio', scope).stop(true,true).attr('value',0).removeClass('_on').addClass('_off');
				obj.stop(true,true).removeClass('__radio-selected').attr('value',1).removeClass('_off').addClass('_on');
			});
			
		});
		
    };
	
	
	/* ----------------------
	      UPLOAD IMAGE
      $(obj).bfUploadImage();
	------------------------- */
	
    $.fn.bfUploadImage = function( options ) {
	   
	    bfUploadImage_settings = {
			_custom_upload : false,
			_upload_image : function(container)
			{
				bfUploadImage_settings._custom_upload = true;
				var tbframe_interval = setInterval(function() {jQuery('#TB_iframeContent').contents().find('.savesend .button').val(container.attr('alt')?container.attr('alt'):'Use This Image');}, 2000);
				tb_show("Image Manager", 'media-upload.php?type=image&TB_iframe=1');
				window.original_send_to_editor = window.send_to_editor;
				window.send_to_editor = function(html)
				{
					clearInterval(tbframe_interval);
					if(bfUploadImage_settings._custom_upload)
					{
						var value = jQuery(html).attr('href');
		
						var parent = container.parent();
						var rem_link = jQuery('a.bf__img_remove', parent);
						var button = jQuery('input.button', parent);
						var img = jQuery('img', parent);
						var img_width = img.attr('width');
						var img_height = img.attr('height');
						
						// Update the preview
						parent_prev_width = parent.css('width');
						parent.css({width:'0px'});
						button.fadeOut();
						img.attr({'src':value});
						img.fadeIn('fast');
						parent.animate({'width':parent_prev_width}, 500, function(){rem_link.fadeIn();});
						//end
						
						container.val(value);
						tb_remove();
						bfUploadImage_settings._custom_upload = false;
					}
					else
						window.original_send_to_editor(html);
				}
			}
		};
	
		return this.each( function(){        
		
			if ( options ) { 
			  $.extend( bfUploadImage_settings, options );
			}
			var obj = $(this);
			
			$('.__imageupload', obj).click( function(){
				var input_field = $(this).prev();
				bfUploadImage_settings._upload_image(input_field);
			});
			$('.__imageuploadid', obj).click( function(){
				var parent = $(this).parent();
				var input_class = $('a.bf__img_remove', parent).attr('rel');
				var input_field = $('input[name="'+input_class+'"]', parent);
				bfUploadImage_settings._upload_image(input_field);
			});
			
			$('a.bf__img_remove', obj).click( function(){
				var a = $(this);
				var parent = a.parent();
				var input_class = a.attr('rel');
				var input_field = $('input[name="'+input_class+'"]', parent);
				var img = $('img', parent);
				var button = $('input.button', parent);
				input_field.val('');
				a.fadeOut('slow', function(){
					img.fadeOut('fast', function(){
						button.fadeIn();	
					});
				});
				return false;
			});
			
			// hide img if no source
			var img = $('img', obj);
			var button = $('input.button', obj);
			var remove = $('a.bf__img_remove', obj);
			if(img.attr('src')=='')
			{
			    img.hide();
				remove.hide();
			}
			else
			{
			    button.hide();
			}
			
		});
		
    };
   
})( jQuery );


jQuery(document).ready( function($){
	
	// NAVIGATION
	$('.bf_navs').bfNavigation({container:'.bf_container'});
	
	// BIND CLICK
	$('.bf-label.allow-click').bfClicker();
	
	// COLOR PICKER
	$('.bf__color').bfColorPicker();
	
	// CHECKBOX
	$('.bf__checkbox').bfCheckbox();
	
	// RADIO BUTTON
	$('.bf__radio').bfRadio();
	
	// UPLOAD IMAGES
	$('.bf__img_preview').bfUploadImage();
	
});



