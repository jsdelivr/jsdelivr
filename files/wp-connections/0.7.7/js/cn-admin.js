/**
 * @author Steven A. Zahm
 */

// Use jQuery() instead of $()for WordPress compatibility with the included prototype js library which uses $()
// http://ipaulpro.com/blog/tutorials/2008/08/jquery-and-wordpress-getting-started/
// See http://chrismeller.com/using-jquery-in-wordpress
jQuery(document).ready(function($){
	
	/*
	 * Hide the image loading spinner and show the image.
	 */
	$('.connections').cn_preloader({
		delay:200,
		imgSelector:'.cn-image img.photo, .cn-image img.logo',
		beforeShow:function(){
			$(this).closest('.cn-image img').css('visibility','hidden');
		},
		afterShow:function(){
			//var image = $(this).closest('.cn-image');
			//$(image).spin(false);
		}
	});
	
	jQuery(function() {
		jQuery('a.detailsbutton')
			.css("cursor","pointer")
			.attr("title","Click to show details.")
			.click(function()
			{
				jQuery('.child-'+this.id).each(function(i, elem)
				{
					jQuery(elem).toggle(jQuery(elem).css('display') == 'none');
				});

				return false;		
			})
			.toggle
			(
				function() 
				{
					jQuery(this).html('Hide Details');
					jQuery(this).attr("title","Click to hide details.")
				},
				
				function() 
				{
					jQuery(this).html('Show Details');
					jQuery(this).attr("title","Click to show details.")
				}
			);
		//jQuery('tr[@class^=child-]').hide().children('td');
		return false;
	});
	
	
	jQuery(function() {
		jQuery('input#entry_type_0')
			.click(function(){
				jQuery('#family').slideUp();
				jQuery('.namefield').slideDown();
				jQuery('#contact_name').slideUp();
				jQuery('.celebrate').slideDown();
				jQuery('.celebrate-disabled').slideUp();
			});
	});
	
	jQuery(function() {
		jQuery('input#entry_type_1')
			.click(function(){
				jQuery('#family').slideUp();
				jQuery('.namefield').slideUp();
				jQuery('#contact_name').slideDown();
				jQuery('.celebrate').slideUp();
				jQuery('.celebrate-disabled').slideDown();
			});
	});
	
	jQuery(function() {
		jQuery('input#entry_type_2')
			.click(function(){
				jQuery('#family').slideDown();
				jQuery('.namefield').slideUp();
				jQuery('.celebrate').slideUp();
				jQuery('.celebrate-disabled').slideDown();
			});
	});
	
	
	jQuery(function() {
		var $entryType = (jQuery('input[name^=entry_type]:checked').val());
		
		switch ($entryType)
		{
			case 'individual':
				jQuery('#family').slideUp();
				jQuery('#contact_name').slideUp();
				jQuery('.celebrate-disabled').slideUp();
				break;
			
			case 'organization':
				jQuery('#family').slideUp();
				jQuery('.namefield').slideUp();
				jQuery('.celebrate').slideUp();
				jQuery('.celebrate-disabled').slideDown();
				break;
			
			case 'family':
				jQuery('.namefield').slideUp();
				jQuery('.celebrate').slideUp();
				jQuery('.celebrate-disabled').slideDown();
				break;
		}
	
	});
	
	/*
	 * Add relations to the family entry type.
	 */
	$('#add-relation').click(function() {
		var template = (jQuery('#relation-template').text());
		var d = new Date();
		var token = Math.floor( Math.random() * d.getTime() );
		
		template = template.replace(
			new RegExp('::FIELD::', 'gi'),
			token
			);
		
		$('#relations').append( '<div id="relation-row-' + token + '" class="relation" style="display: none;">' + template + '<a href="#" class="cn-remove cn-button button button-warning" data-type="relation" data-token="' + token + '">Remove</a>' + '</div>' );
		$('#relation-row-' + token).slideDown();
		
		/*
		 * Add jQuery Chosen to the family name and relation fields.
		 */
		$('.family-member-name, .family-member-relation').chosen();
		
		return false
	});
	
	/*
	 * Add jQuery Chosen to the family name and relation fields.
	 */
	if ($.fn.chosen) {
		$('.family-member-name, .family-member-relation').chosen();
	}
	
	$('a.cn-add.cn-button').click(function() {
		var $this = $(this);
		var type = $this.attr('data-type');
		var container = '#' + $this.attr('data-container');
		var id = '#' + type + '-template';
		//console.log(id);
		
		var template = $(id).text();
		//console.log(template);
		
		var d = new Date();
		var token = Math.floor( Math.random() * d.getTime() );
		
		template = template.replace(
										new RegExp('::FIELD::', 'gi'),
										token
									);
		//console.log(template);
		//console.log(container);
		
		$(container).append( '<div class="widget ' + type + '" id="' + type + '-row-' + token + '" style="display: none;">' + template + '</div>' );
		$('#' + type + '-row-' + token).slideDown();
		
		return false;
	});
	
	$('a.cn-remove.cn-button').live('click', function() {
		var $this = $(this);
		var token = $this.attr('data-token');
		var type = $this.attr('data-type');
		var id = '#' + type + '-row-' + token;
		//alert(id);
		$(id).slideUp('fast', function(){ $(this).remove(); });
		return false;
	});
	
	
	/*
	 * Switching Visual/HTML Modes With TinyMCE
	 * http://www.keighl.com/2010/04/switching-visualhtml-modes-with-tinymce/
	 */
	
	jQuery('a#toggleBioEditor').click(
		function() {
			id = 'bio';
			if (tinyMCE.get(id))
			{
				tinyMCE.execCommand('mceRemoveControl', false, id);
			}
			else
			{
				tinyMCE.execCommand('mceAddControl', false, id);
			}
		}
	);

	jQuery('a#toggleNoteEditor').click(
		function() {
			id = 'note';
			if (tinyMCE.get(id))
			{
				tinyMCE.execCommand('mceRemoveControl', false, id);
			}
			else
			{
				tinyMCE.execCommand('mceAddControl', false, id);
			}
		}
	);
	
	
	/*
	 * Add the jQuery UI Datepicker to the date input fields.
	 */
	if ($.fn.datepicker) {
		
		$('.datepicker').live('focus', function() {
			$(this).datepicker({
				changeMonth: true,
				changeYear: true,
				showOtherMonths: true,
				selectOtherMonths: true,
				yearRange: 'c-100:c+10'
			});
		});
	}
	
	/*
	 * Geocode the address
	 */
	$('a.geocode.button').live('click', function() {
		var address = new Object();
		var $this = $(this);
		var lat;
		var lng;
		
		var uid = $this.attr('data-uid');
		//console.log(uid);
		
		address.line_1 = $('input[name=address\\[' + uid + '\\]\\[line_1\\]]').val();
		address.line_2 = $('input[name=address\\[' + uid + '\\]\\[line_2\\]]').val();
		address.line_3 = $('input[name=address\\[' + uid + '\\]\\[line_3\\]]').val();
		
		address.city = $('input[name=address\\[' + uid + '\\]\\[city\\]]').val();
		address.state = $('input[name=address\\[' + uid + '\\]\\[state\\]]').val();
		address.zipcode = $('input[name=address\\[' + uid + '\\]\\[zipcode\\]]').val();
		
		address.country = $('input[name=address\\[' + uid + '\\]\\[country\\]]').val();
		
		//console.log(address);
		
		$( '#map-' + uid ).fadeIn('slow' , function() {
			$( '#map-' + uid ).goMap({
				maptype: 'ROADMAP'/*,
				latitude: 40.366502,
				longitude: -75.887637,
				zoom: 14*/
			});
			
			$.goMap.clearMarkers();
			
			$.goMap.createMarker({
				address: '\'' + address.line_1 + ', ' + address.city + ', ' + address.state + ', ' + address.zipcode + ', ' +  '\'' , id: 'baseMarker' , draggable: true
			});
			
			$.goMap.setMap({ address: '\'' + address.line_1 + ', ' + address.city + ', ' + address.state + ', ' + address.zipcode + ', ' +  '\'' , zoom: 18 });
			
			
			
			$.goMap.createListener( {type:'marker', marker:'baseMarker'} , 'idle', function(event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				
				console.log(lat);
				console.log(lng);
				
				$('input[name=address\\[' + uid + '\\]\\[latitude\\]]').val(lat);
				$('input[name=address\\[' + uid + '\\]\\[longitude\\]]').val(lng);
			});
			
			$.goMap.createListener( {type:'marker', marker:'baseMarker'} , 'dragend', function(event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				
				console.log(lat);
				console.log(lng);
				
				$('input[name=address\\[' + uid + '\\]\\[latitude\\]]').val(lat);
				$('input[name=address\\[' + uid + '\\]\\[longitude\\]]').val(lng);
			});
			
		});
		
		
		// There has to be a better way than setting a delay. I know I have to use a callback b/c the geocode is an asyn request.
		setTimeout( function(){
			setLatLngInfo(uid);
		}, 1500)
		
		return false;
	});
	
	function setLatLngInfo(uid)
	{
		var baseMarkerPosition = $( '#map-' + uid ).data('baseMarker').getPosition();
		$('input[name=address\\[' + uid + '\\]\\[latitude\\]]').val( baseMarkerPosition.lat() );
		$('input[name=address\\[' + uid + '\\]\\[longitude\\]]').val( baseMarkerPosition.lng() );
		
	}
});