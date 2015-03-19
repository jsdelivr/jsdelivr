	//The following is all for Share this.
	function wpsc_akst_share(id, url, title) {
		if ((jQuery('#wpsc_akst_form').css("display") == 'block') && (jQuery('#wpsc_akst_post_id').attr("value") == id)) {
			jQuery('#wpsc_akst_form').css("display", "none");
			return;
		}


		var offset = {};
		new_container_offset = jQuery('#wpsc_akst_link_' + id).offset();

		if(offset['left'] == null) {
			offset['left'] = new_container_offset.left;
			offset['top'] = new_container_offset.top;
		}

		jQuery("#wpsc_akst_delicious").attr("href", wpsc_akst_share_url("http://del.icio.us/post?url={url}&title={title}", url, title));
		jQuery("#wpsc_akst_digg").attr("href", wpsc_akst_share_url("http://digg.com/submit?phase=2&url={url}&title={title}", url, title));
			jQuery("#wpsc_akst_furl").attr("href", wpsc_akst_share_url("http://furl.net/storeIt.jsp?u={url}&t={title}", url, title));
		jQuery("#wpsc_akst_netscape").attr("href", wpsc_akst_share_url(" http://www.netscape.com/submit/?U={url}&T={title}", url, title));
		jQuery("#wpsc_akst_yahoo_myweb").attr("href", wpsc_akst_share_url("http://myweb2.search.yahoo.com/myresults/bookmarklet?u={url}&t={title}", url, title));
		jQuery("#wpsc_akst_stumbleupon").attr("href", wpsc_akst_share_url("http://www.stumbleupon.com/submit?url={url}&title={title}", url, title));
		jQuery("#wpsc_akst_google_bmarks").attr("href", wpsc_akst_share_url("  http://www.google.com/bookmarks/mark?op=edit&bkmk={url}&title={title}", url, title));
		jQuery("#wpsc_akst_technorati").attr("href", wpsc_akst_share_url("http://www.technorati.com/faves?add={url}", url, title));
		jQuery("#wpsc_akst_blinklist").attr("href", wpsc_akst_share_url("http://blinklist.com/index.php?Action=Blink/addblink.php&Url={url}&Title={title}", url, title));
		jQuery("#wpsc_akst_newsvine").attr("href", wpsc_akst_share_url("http://www.newsvine.com/_wine/save?u={url}&h={title}", url, title));
		jQuery("#wpsc_akst_magnolia").attr("href", wpsc_akst_share_url("http://ma.gnolia.com/bookmarklet/add?url={url}&title={title}", url, title));
		jQuery("#wpsc_akst_reddit").attr("href", wpsc_akst_share_url("http://reddit.com/submit?url={url}&title={title}", url, title));
		jQuery("#wpsc_akst_windows_live").attr("href", wpsc_akst_share_url("https://favorites.live.com/quickadd.aspx?marklet=1&mkt=en-us&url={url}&title={title}&top=1", url, title));
		jQuery("#wpsc_akst_tailrank").attr("href", wpsc_akst_share_url("http://tailrank.com/share/?link_href={url}&title={title}", url, title));

		jQuery('#wpsc_akst_post_id').value = id;
		jQuery('#wpsc_akst_form').css("left", offset['left'] + 'px');
		jQuery('#wpsc_akst_form').css("top", (offset['top']+ 14 + 3) + 'px');
		jQuery('#wpsc_akst_form').css("display", 'block');
	}

	function wpsc_akst_share_url(base, url, title) {
	  base = base.replace('{url}', url);
	  return base.replace('{title}', title);
	}

	function wpsc_akst_share_tab(tab) {
		var tab1 = document.getElementById('wpsc_akst_tab1');
		var tab2 = document.getElementById('wpsc_akst_tab2');
		var body1 = document.getElementById('wpsc_akst_social');
		var body2 = document.getElementById('wpsc_akst_email');

		switch (tab) {
			case '1':
				tab2.className = '';
				tab1.className = 'selected';
				body2.style.display = 'none';
				body1.style.display = 'block';
				break;
			case '2':
				tab1.className = '';
				tab2.className = 'selected';
				body1.style.display = 'none';
				body2.style.display = 'block';
				break;
		}
	}
	//End Share this JS

	function wpsc_shipping_same_as_billing(){
		jQuery('#shippingsameasbillingmessage').slideDown('slow');
		jQuery("input[title='billingfirstname'], input[title='billinglastname'], textarea[title='billingaddress'], input[title='billingcity'], input[title='billingpostcode'], input[title='billingphone'], input[title='billingfirstname'], input[title='billingstate']").unbind('change', wpsc_shipping_same_as_billing).unbind('keyup', wpsc_shipping_same_as_billing).keyup(wpsc_shipping_same_as_billing).change(wpsc_shipping_same_as_billing);

		jQuery("select[title='billingregion'], select[title='billingstate'], select[title='billingcountry'], input[title='billingstate']").die( 'change', wpsc_shipping_same_as_billing ).live( 'change', wpsc_shipping_same_as_billing );

		var fields = new Array(
			Array(
				"input[title='billingfirstname']",
				"input[title='shippingfirstname']"
			),
			Array(
				"input[title='billinglastname']",
				"input[title='shippinglastname']"
			),
			Array(
				"textarea[title='billingaddress']",
				"textarea[title='shippingaddress']"
			),
			Array(
				"input[title='billingcity']",
				"input[title='shippingcity']"
			),
			Array(
				"input[title='billingpostcode']",
				"input[title='shippingpostcode']"
			),
			Array(
				"input[title='billingphone']",
				"input[title='shippingphone']"
			),
			Array(
				"input[title='billingemail']",
				"input[title='shippingemail']"
			)
		);

		for(var i in fields) {
			jQuery(fields[i][1]).val(jQuery(fields[i][0]).val());
			jQuery(fields[i][1]).parents('tr:first').hide();
			if(!jQuery(fields[i][0]).hasClass('intra-field-label'))
				jQuery(fields[i][1]).removeClass('intra-field-label');
			else
				jQuery(fields[i][1]).addClass('intra-field-label');
		}

		if( jQuery("input[title='billingstate']").length ){
			jQuery("input[title='shippingstate']").val(jQuery("input[title='billingstate']").val());
			jQuery("input[title='shippingstate']").parents('tr:first').hide();
			if(!jQuery("input[title='billingstate']").hasClass('intra-field-label'))
				jQuery("input[title='shippingstate']").removeClass('intra-field-label');
			else
				jQuery("input[title='shippingstate']").addClass('intra-field-label');
		} else {
			jQuery("input[title='shippingstate']").val(jQuery("select[title='billingstate']").val());
			jQuery(".shipping_region_name").text(jQuery("select[title='billingstate'] option[selected='selected']").text());
			jQuery("input[title='shippingstate']").parents('tr:first').hide();
		}


		jQuery("input.shipping_country").val(
			jQuery("select[title='billingcountry']").val()
		).removeClass('intra-field-label').parents('tr:first').hide();

		jQuery("span.shipping_country_name").html(
			jQuery("select[title='billingcountry'] :selected").text()
		).hide();

		jQuery('select[title="shippingcountry"] option').removeAttr('selected').parents('tr:first').hide();
		jQuery('select[title="shippingcountry"] option[value="' + jQuery('select[title="billingcountry"] option:selected').val() + '"]').attr('selected', 'selected');

		jQuery('select[title="shippingstate"] option').removeAttr('selected').parents('tr:first').hide();
		jQuery('select[title="shippingstate"] option[value="' + jQuery('select[title="billingstate"] option:selected').val() + '"]').attr('selected', 'selected');

		jQuery('select[title="shippingcountry"]').change();
		jQuery('select[title="shippingstate"]').change();

		//evil. If shipping is enabled checks if shipping country is the same and billing and if shipping state is the same as billing. If not - changes shipping country and (or) state to billing.
		if(
			//if shipping is enabled this element will be present, so if it's not, then it will skip everything
			jQuery('#change_country #current_country').val()
			&&
			//also we only need to do this when shipping country is different than billing country. following code does the check
			(
				//check if countries are different
				(
					//if billing country dropdown is present
					jQuery('select[title="billingcountry"]')
					&&
					//and if the value is different from shipping
					jQuery('#change_country #current_country').val() != jQuery('select[title="billingcountry"]').val()
				)
				||
				//ceck if billing region is different
				(
					//if billing region is present
					jQuery('select[title="billingstate"]')
					&&
					//if its different from shipping
					jQuery('select[title="billingstate"]').val() != jQuery('#change_country #region').val()
				)
			)
		){
			jQuery('#current_country option').removeAttr('selected');
			jQuery('#current_country option[value="'+jQuery('select[title="billingcountry"]').val()+'"]').attr('selected', 'selected');
			jQuery('#region').remove();
			if(jQuery('select[title="billingstate"]').html()){
				jQuery('#change_country #current_country').after('<select name="region" id="region" onchange="submit_change_country();">'+jQuery('select[title="billingstate"]').html()+'</select>')
				jQuery('#region option').removeAttr('selected');
				jQuery('#region option[value='+jQuery('select[title="billingstate"]').val()+']').attr('selected', 'selected');
			}
			var request_vars = {'country' : jQuery('#current_country').val(), 'wpsc_ajax_actions' : 'update_location', 'wpsc_update_location' : true, 'wpsc_submit_zipcode' : 'Calculate' };
			if(jQuery('#region'))
				request_vars.region = jQuery('#region').val();
			if(typeof(updated_shipping_quote_after)=='undefined')
				updated_shipping_quote_after = false;
			jQuery.post(
				location.href,
				request_vars,
				function(){
					if(!updated_shipping_quote_after){
						jQuery('select[title="billingcountry"]').change();
						updated_shipping_quote_after = false;
					} else
						updated_shipping_quote_after = false;
				}
			);
		}
	}

// this function is for binding actions to events and rebinding them after they are replaced by AJAX
// these functions are bound to events on elements when the page is fully loaded.
jQuery(document).ready(function ($) {
	if(jQuery('#checkout_page_container .wpsc_email_address input').val())
		jQuery('#wpsc_checkout_gravatar').attr('src', 'https://secure.gravatar.com/avatar/'+MD5(jQuery('#checkout_page_container .wpsc_email_address input').val().split(' ').join(''))+'?s=60&d=mm');
	jQuery('#checkout_page_container .wpsc_email_address input').keyup(function(){
		jQuery('#wpsc_checkout_gravatar').attr('src', 'https://secure.gravatar.com/avatar/'+MD5(jQuery(this).val().split(' ').join(''))+'?s=60&d=mm');
	});

	jQuery('#fancy_notification').appendTo('body');

	//this bit of code runs on the checkout page. If the checkbox is selected it copies the valus in the billing country and puts it in the shipping country form fields. 23.07.09
	//Added 6/25/2012 - Added function to update shiping quotes.  This whole file is a bit of a mess in need of some Gary magic.
	if(jQuery("#shippingSameBilling").is(":checked"))
		wpsc_shipping_same_as_billing();

	jQuery("#shippingSameBilling").change(function(){

		if(jQuery(this).is(":checked")){
			var data = {
				action: 'wpsc_shipping_same_as_billing',
				wpsc_shipping_same_as_billing: true
			};

			jQuery.post(wpsc_ajax.ajaxurl, data, function(response) {
			});
			wpsc_shipping_same_as_billing();
		} else {
			var data = {
				action: 'wpsc_shipping_same_as_billing',
				wpsc_shipping_same_as_billing: false
			};
			jQuery.post(wpsc_ajax.ajaxurl, data, function(response) {
			});
			jQuery(this).parents('table:first').find('tr').show();
			jQuery('.shipping_country_name').show();
			jQuery('#shippingsameasbillingmessage').hide();
			jQuery("select[title='billingregion'], select[title='billingstate'], select[title='billingcountry'], input[title='billingstate']").die( 'change', wpsc_shipping_same_as_billing );
			jQuery("input[title='billingfirstname'], input[title='billinglastname'], textarea[title='billingaddress'], input[title='billingcity'], input[title='billingpostcode'], input[title='billingphone'], input[title='billingfirstname'], input[title='billingstate']").unbind('change', wpsc_shipping_same_as_billing).unbind('keyup', wpsc_shipping_same_as_billing);
		}

		wpsc_update_shipping_quotes();

	});


	/**
	 * Update shipping quotes when "Shipping same as Billing" is checked or unchecked.
	 * @since 3.8.8
	 */
	function wpsc_update_shipping_quotes() {

		var original_shipping_region           = jQuery('select#region');
		var original_shipping_zip              = jQuery('input#zipcode');
		var original_country                   = jQuery('select#current_country');
		var shipping_same_as_billing_region    = jQuery('input[title="shippingstate"]');
		var shipping_same_as_billing_zip       = jQuery('input[title="shippingpostcode"]');
		var shipping_same_as_billing_country   = jQuery('input[title="shippingcountry"]');

		jQuery('p.validation-error').remove();

		//Checks if state and ZIP are different than the initial shipping state/ZIP.  We can simply return if they are the same.

		if ( original_shipping_region.val() == shipping_same_as_billing_region.val() && original_shipping_zip.val() == shipping_same_as_billing_zip.val() )
			return;

		if ( ! jQuery('input#shippingSameBilling').is(':checked') )
			return;

		//Update shipping quotes
		var data = {
			action  : 'shipping_same_as_billing_update',
			region  : shipping_same_as_billing_region.val(),
			country : shipping_same_as_billing_country.val(),
			zipcode : shipping_same_as_billing_zip.val()
		};
		var success = function(response) {

			// If the the data pushed through results in no shipping quotes, display error.
			if ( '0' == response ) {
				//No shipping quotes were returned, display an error.
				jQuery('input#shippingSameBilling').after( '<p class="validation-error">' + wpsc_ajax.no_quotes + '</p>' );

			} else if ('-1' !== response) {
				jQuery('table.productcart:eq(0)').html( response );
			}
			jQuery('img.ajax-feedback').remove();
		};

		jQuery('input#shippingSameBilling').after( '<img class="ajax-feedback" src="' + wpsc_ajax.spinner + '" alt="" />' );

		jQuery.post(wpsc_ajax.ajaxurl, data, success, 'html');

	}

	// Submit the product form using AJAX
	jQuery("form.product_form, .wpsc-add-to-cart-button-form").live('submit', function() {
		// we cannot submit a file through AJAX, so this needs to return true to submit the form normally if a file formfield is present
		file_upload_elements = jQuery.makeArray(jQuery('input[type="file"]', jQuery(this)));
		if(file_upload_elements.length > 0) {
			return true;
		} else {
			form_values = jQuery(this).serialize();
			// Sometimes jQuery returns an object instead of null, using length tells us how many elements are in the object, which is more reliable than comparing the object to null
			if(jQuery('#fancy_notification').length == 0) {
				jQuery('div.wpsc_loading_animation',this).css('visibility', 'visible');
			}
			jQuery.post( 'index.php?ajax=true', form_values, function(returned_data) {
				eval(returned_data);
				jQuery('div.wpsc_loading_animation').css('visibility', 'hidden');

				if(jQuery('#fancy_notification') != null) {
					jQuery('#loading_animation').css("display", 'none');
				//jQuery('#fancy_notificationimage').css("display", 'none');
				}

			});
			wpsc_fancy_notification(this);
			return false;
		}
	});


	jQuery('a.wpsc_category_link, a.wpsc_category_image_link').click(function(){
		product_list_count = jQuery.makeArray(jQuery('ul.category-product-list'));
		if(product_list_count.length > 0) {
			jQuery('ul.category-product-list', jQuery(this).parent()).toggle();
			return false;
		}
	});

	//  this is for storing data with the product image, like the product ID, for things like dropshop and the the ike.
	jQuery("form.product_form").livequery(function(){
		product_id = jQuery('input[name="product_id"]',this).val();
		image_element_id = 'product_image_'+product_id;
		jQuery("#"+image_element_id).data("product_id", product_id);
		parent_container = jQuery(this).parents('div.product_view_'+product_id);
		jQuery("div.item_no_image", parent_container).data("product_id", product_id);
	});
	//jQuery("form.product_form").trigger('load');

	// Toggle the additional description content
	jQuery("a.additional_description_link").click(function() {
		parent_element = jQuery(this).parent(".additional_description_container, .additional_description_span");
		jQuery('.additional_description',parent_element).slideToggle('fast');
		return false;
	});

	// update the price when the variations are altered.
	jQuery(".wpsc_select_variation").live('change', function() {
		jQuery('option[value="0"]', this).attr('disabled', 'disabled');
		var parent_form = jQuery(this).closest("form.product_form");
		if ( parent_form.length == 0 )
			return;
		var prod_id = jQuery("input[name='product_id']",parent_form).val();
		var form_values =jQuery("input[name='product_id'], .wpsc_select_variation",parent_form).serialize( );
		jQuery.post( 'index.php?update_product_price=true', form_values, function(response) {
			var stock_display = jQuery('div#stock_display_' + prod_id),
				price_field = jQuery('input#product_price_' + prod_id),
				price_span = jQuery('#product_price_' + prod_id + '.pricedisplay, #product_price_' + prod_id + ' .currentprice'),
				donation_price = jQuery('input#donation_price_' + prod_id),
				old_price = jQuery('#old_product_price_' + prod_id),
				save = jQuery('#yousave_' + prod_id),
				buynow = jQuery('#BB_BuyButtonForm' + prod_id);
			if ( response.variation_found ) {
				if ( response.stock_available ) {
					stock_display.removeClass('out_of_stock').addClass('in_stock');
				} else {
					stock_display.addClass('out_of_stock').removeClass('in_stock');
				}
			}

			stock_display.html(response.variation_msg);
			if ( response.price !== undefined ) {
				if (price_field.length && price_field.attr('type') == 'text') {
					price_field.val(response.numeric_price);
					old_price.parent().hide();
					save.parent().hide();
				} else {
					price_span.html(response.price);
					old_price.html(response.old_price);
					save.html(response.you_save);
					if (response.numeric_old_price > response.numeric_price) {
						old_price.parent().show();
						save.parent().show();
					} else {
						old_price.parent().hide();
						save.parent().hide();
					}
				}
				donation_price.val(response.numeric_price);
			}
		}, 'json');
	});

	// Object frame destroying code.
	jQuery("div.shopping_cart_container").livequery(function(){
		object_html = jQuery(this).html();
		window.parent.jQuery("div.shopping-cart-wrapper").html(object_html);
	});


	// Ajax cart loading code.
	jQuery("div.wpsc_cart_loading").livequery(function(){
		form_values = "ajax=true"
		jQuery.post( 'index.php?wpsc_ajax_action=get_cart', form_values, function(returned_data) {
			eval(returned_data);
		});
	});

	// Object frame destroying code.
	jQuery("form.wpsc_product_rating").livequery(function(){
		jQuery(this).rating();
	});

	jQuery("form.wpsc_empty_the_cart").livequery(function(){
		jQuery(this).submit(function() {
			form_values = "ajax=true&";
			form_values += jQuery(this).serialize();
			jQuery.post( 'index.php', form_values, function(returned_data) {
				eval(returned_data);
			});
			return false;
		});
	});

	jQuery("form.wpsc_empty_the_cart a.emptycart").live('click',function(){
		parent_form = jQuery(this).parents("form.wpsc_empty_the_cart");
		form_values = "ajax=true&";
		form_values += jQuery(parent_form).serialize();
		jQuery.post( 'index.php', form_values, function(returned_data) {
			eval(returned_data);
		});
		return false;
	});

	//Shipping bug fix by James Collins
	var radios = jQuery(".productcart input:radio[name='shipping_method']");
	if (radios.length == 1) {
		// If there is only 1 shipping quote available during checkout, automatically select it
		jQuery(radios).click();
	} else if (radios.length > 1) {
		// There are multiple shipping quotes, simulate a click on the checked one
		jQuery(".productcart input:radio[name='shipping_method']:checked").click();
	}
});

// update the totals when shipping methods are changed.
function switchmethod( key, key1 ){
	data = {
		ajax : 'true',
		wpsc_ajax_action : 'update_shipping_price',
		option : key,
		method : key1
	}
	jQuery.post( 'index.php', data, function(returned_data) {
		eval(returned_data);
	});
}

// submit the country forms.
function submit_change_country(){
	document.forms.change_country.submit();
}

// submit the fancy notifications forms.
function wpsc_fancy_notification(parent_form){
	if(typeof(WPSC_SHOW_FANCY_NOTIFICATION) == 'undefined'){
		WPSC_SHOW_FANCY_NOTIFICATION = true;
	}
	if((WPSC_SHOW_FANCY_NOTIFICATION == true) && (jQuery('#fancy_notification') != null)){
		var options = {
			margin: 1 ,
			border: 1 ,
			padding: 1 ,
			scroll: 1
		};

		form_button_id = jQuery(parent_form).attr('id') + "_submit_button";
		var button_offset = jQuery('#'+form_button_id).offset();

		jQuery('#fancy_notification').css("left", (button_offset.left - 130) + 'px');
		jQuery('#fancy_notification').css("top", (button_offset.top + 40) + 'px');


		jQuery('#fancy_notification').css("display", 'block');
		jQuery('#loading_animation').css("display", 'block');
		jQuery('#fancy_notification_content').css("display", 'none');
	}
}

function shopping_cart_collapser() {
	switch(jQuery("#sliding_cart").css("display")) {
		case 'none':
			jQuery("#sliding_cart").slideToggle("fast",function(){
				jQuery.post( 'index.php', "ajax=true&set_slider=true&state=1", function(returned_data) { });
				jQuery("#fancy_collapser").attr("src", (WPSC_CORE_IMAGES_URL + "/minus.png"));
			});
			break;

		default:
			jQuery("#sliding_cart").slideToggle("fast",function(){
				jQuery.post( 'index.php', "ajax=true&set_slider=true&state=0", function(returned_data) { });
				jQuery("#fancy_collapser").attr("src", (WPSC_CORE_IMAGES_URL + "/plus.png"));
			});
			break;
	}
	return false;
}

function set_billing_country(html_form_id, form_id){
	var billing_region = '';
	country = jQuery(("div#"+html_form_id+" select[class='current_country']")).val();
	region = jQuery(("div#"+html_form_id+" select[class='current_region']")).val();
	if(/[\d]{1,}/.test(region)) {
		billing_region = "&billing_region="+region;
	}

	form_values = "wpsc_ajax_action=change_tax&form_id="+form_id+"&billing_country="+country+billing_region;
	jQuery.post( 'index.php', form_values, function(returned_data) {
		eval(returned_data);
		if(jQuery("#shippingSameBilling").is(':checked')){
			jQuery('.shipping_region').parent().parent().hide();
			jQuery('.shipping_country_name').parent().parent().hide();
		}
	});
}
function set_shipping_country(html_form_id, form_id){
	var shipping_region = '';
	country = jQuery(("div#"+html_form_id+" select[class='current_country']")).val();

	if(country == 'undefined'){
		country =  jQuery("select[title='billingcountry']").val();
	}

	region = jQuery(("div#"+html_form_id+" select[class='current_region']")).val();
	if(/[\d]{1,}/.test(region)) {
		shipping_region = "&shipping_region="+region;
	}

	form_values = {
		wpsc_ajax_action: "change_tax",
		form_id: form_id,
		shipping_country: country,
		shipping_region: region
	}

	jQuery.post( 'index.php', form_values, function(returned_data) {
		eval(returned_data);
		if(jQuery("#shippingSameBilling").is(':checked')){
			jQuery('.shipping_region').parent().parent().hide();
			jQuery('.shipping_country_name').parent().parent().hide();
		}
	});

}

function wpsc_set_profile_country(html_form_id, form_id) {
	var country_field = jQuery('#' + html_form_id);
	var form_values = {
		wpsc_ajax_action : "change_profile_country",
		form_id : form_id,
		country : country_field.val()
	};

	jQuery.post(location.href, form_values, function(response) {
		country_field.siblings('select').remove();
		if (response.has_regions) {
			country_field.after('<br />' + response.html);
			jQuery('input[name="collected_data[' + response.region_field_id + ']"]').closest('tr').hide();
		} else {
			jQuery('input[name="collected_data[' + response.region_field_id + ']"]').closest('tr').show();
		}
	}, 'json');
}

jQuery(document).ready(function(){
	jQuery('.wpsc_checkout_table input, .wpsc_checkout_table textarea').each(function(){
		var real_value = jQuery(this).val();
		value = jQuery('label[for="'+jQuery(this).attr('id')+'"]').html();
		if(null != value){
			value = value.replace(/<span class="?asterix"?>\*<\/span>/i,'');
		}

		if( jQuery.fn.inlineFieldLabel )
		    jQuery(this).inlineFieldLabel({label:jQuery.trim(value)});
		if(real_value != '')
			jQuery(this).val(real_value).removeClass('intra-field-label');
	});
});

//Javascript for variations: bounce the variation box when nothing is selected and return false for add to cart button.
jQuery(document).ready(function(){
	jQuery('.productcol, .textcol, .product_grid_item, .wpsc-add-to-cart-button').each(function(){
		jQuery('.wpsc_buy_button', this).click(function(){
			var dropdowns = jQuery(this).closest('form').find('.wpsc_select_variation');
			var not_selected = false;
			dropdowns.each(function(){
				var t = jQuery(this);
				if(t.val() <= 0){
					not_selected = true;
					t.css('position','relative');
					t.animate({'left': '-=5px'}, 50, function(){
						t.animate({'left': '+=10px'}, 100, function(){
							t.animate({'left': '-=10px'}, 100, function(){
								t.animate({'left': '+=10px'}, 100, function(){
									t.animate({'left': '-=5px'}, 50);
								});
							});
						});
					});
				}
			});
			if (not_selected)
				return false;
		});
	});
});

jQuery(document).ready(function(){
	jQuery('.attachment-gold-thumbnails').click(function(){
		jQuery(this).parents('.imagecol:first').find('.product_image').attr('src', jQuery(this).parent().attr('rev'));
		jQuery(this).parents('.imagecol:first').find('.product_image').parent('a:first').attr('href', jQuery(this).parent().attr('href'));
		return false;
	});
});

//MD5 function for gravatars
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('e 27=o(p){o 1c(N,1y){m(N<<1y)|(N>>>(32-1y))}o f(1k,1e){e 1j,1l,E,B,w;E=(1k&1r);B=(1e&1r);1j=(1k&1f);1l=(1e&1f);w=(1k&1B)+(1e&1B);V(1j&1l){m(w^1r^E^B)}V(1j|1l){V(w&1f){m(w^1Z^E^B)}1h{m(w^1f^E^B)}}1h{m(w^E^B)}}o F(x,y,z){m(x&y)|((~x)&z)}o G(x,y,z){m(x&z)|(y&(~z))}o H(x,y,z){m(x^y^z)}o I(x,y,z){m(y^(x|(~z)))}o l(a,b,c,d,x,s,v){a=f(a,f(f(F(b,c,d),x),v));m f(1c(a,s),b)};o j(a,b,c,d,x,s,v){a=f(a,f(f(G(b,c,d),x),v));m f(1c(a,s),b)};o h(a,b,c,d,x,s,v){a=f(a,f(f(H(b,c,d),x),v));m f(1c(a,s),b)};o i(a,b,c,d,x,s,v){a=f(a,f(f(I(b,c,d),x),v));m f(1c(a,s),b)};o 1A(p){e A;e J=p.1g;e 1q=J+8;e 1D=(1q-(1q%1G))/1G;e 1m=(1D+1)*16;e t=1z(1m-1);e K=0;e q=0;24(q<J){A=(q-(q%4))/4;K=(q%4)*8;t[A]=(t[A]|(p.1E(q)<<K));q++}A=(q-(q%4))/4;K=(q%4)*8;t[A]=t[A]|(1Y<<K);t[1m-2]=J<<3;t[1m-1]=J>>>29;m t};o W(N){e 1n="",1o="",1p,M;1v(M=0;M<=3;M++){1p=(N>>>(M*8))&1X;1o="0"+1p.1U(16);1n=1n+1o.1V(1o.1g-2,2)}m 1n};o 1C(p){p=p.1W(/\\r\\n/g,"\\n");e u="";1v(e n=0;n<p.1g;n++){e c=p.1E(n);V(c<1i){u+=D.C(c)}1h V((c>1T)&&(c<25)){u+=D.C((c>>6)|26);u+=D.C((c&1s)|1i)}1h{u+=D.C((c>>12)|2c);u+=D.C(((c>>6)&1s)|1i);u+=D.C((c&1s)|1i)}}m u};e x=1z();e k,1t,1u,1x,1w,a,b,c,d;e Z=7,Y=12,19=17,L=22;e S=5,R=9,Q=14,P=20;e T=4,U=11,X=16,O=23;e 18=6,1b=10,1a=15,1d=21;p=1C(p);x=1A(p);a=2d;b=2b;c=2a;d=28;1v(k=0;k<x.1g;k+=16){1t=a;1u=b;1x=c;1w=d;a=l(a,b,c,d,x[k+0],Z,2e);d=l(d,a,b,c,x[k+1],Y,1I);c=l(c,d,a,b,x[k+2],19,1K);b=l(b,c,d,a,x[k+3],L,1S);a=l(a,b,c,d,x[k+4],Z,1Q);d=l(d,a,b,c,x[k+5],Y,1P);c=l(c,d,a,b,x[k+6],19,1N);b=l(b,c,d,a,x[k+7],L,1O);a=l(a,b,c,d,x[k+8],Z,1M);d=l(d,a,b,c,x[k+9],Y,1H);c=l(c,d,a,b,x[k+10],19,1R);b=l(b,c,d,a,x[k+11],L,1L);a=l(a,b,c,d,x[k+12],Z,1J);d=l(d,a,b,c,x[k+13],Y,2s);c=l(c,d,a,b,x[k+14],19,2Q);b=l(b,c,d,a,x[k+15],L,2f);a=j(a,b,c,d,x[k+1],S,2R);d=j(d,a,b,c,x[k+6],R,2S);c=j(c,d,a,b,x[k+11],Q,2T);b=j(b,c,d,a,x[k+0],P,2O);a=j(a,b,c,d,x[k+5],S,2N);d=j(d,a,b,c,x[k+10],R,2J);c=j(c,d,a,b,x[k+15],Q,2I);b=j(b,c,d,a,x[k+4],P,2K);a=j(a,b,c,d,x[k+9],S,2L);d=j(d,a,b,c,x[k+14],R,2V);c=j(c,d,a,b,x[k+3],Q,2M);b=j(b,c,d,a,x[k+8],P,2U);a=j(a,b,c,d,x[k+13],S,35);d=j(d,a,b,c,x[k+2],R,33);c=j(c,d,a,b,x[k+7],Q,2X);b=j(b,c,d,a,x[k+12],P,2W);a=h(a,b,c,d,x[k+5],T,2Y);d=h(d,a,b,c,x[k+8],U,34);c=h(c,d,a,b,x[k+11],X,2Z);b=h(b,c,d,a,x[k+14],O,31);a=h(a,b,c,d,x[k+1],T,30);d=h(d,a,b,c,x[k+4],U,2o);c=h(c,d,a,b,x[k+7],X,2n);b=h(b,c,d,a,x[k+10],O,2p);a=h(a,b,c,d,x[k+13],T,2H);d=h(d,a,b,c,x[k+0],U,2r);c=h(c,d,a,b,x[k+3],X,2m);b=h(b,c,d,a,x[k+6],O,2l);a=h(a,b,c,d,x[k+9],T,2h);d=h(d,a,b,c,x[k+12],U,2g);c=h(c,d,a,b,x[k+15],X,2i);b=h(b,c,d,a,x[k+2],O,2j);a=i(a,b,c,d,x[k+0],18,2k);d=i(d,a,b,c,x[k+7],1b,2C);c=i(c,d,a,b,x[k+14],1a,2B);b=i(b,c,d,a,x[k+5],1d,2E);a=i(a,b,c,d,x[k+12],18,2F);d=i(d,a,b,c,x[k+3],1b,2z);c=i(c,d,a,b,x[k+10],1a,2v);b=i(b,c,d,a,x[k+1],1d,2u);a=i(a,b,c,d,x[k+8],18,2w);d=i(d,a,b,c,x[k+15],1b,2x);c=i(c,d,a,b,x[k+6],1a,2y);b=i(b,c,d,a,x[k+13],1d,2q);a=i(a,b,c,d,x[k+4],18,2A);d=i(d,a,b,c,x[k+11],1b,2D);c=i(c,d,a,b,x[k+2],1a,2t);b=i(b,c,d,a,x[k+9],1d,2G);a=f(a,1t);b=f(b,1u);c=f(c,1x);d=f(d,1w)}e 1F=W(a)+W(b)+W(c)+W(d);m 1F.2P()}',62,192,'||||||||||||||var|AddUnsigned||HH|II|GG||FF|return||function|string|lByteCount|||lWordArray|utftext|ac|lResult||||lWordCount|lY8|fromCharCode|String|lX8|||||lMessageLength|lBytePosition|S14|lCount|lValue|S34|S24|S23|S22|S21|S31|S32|if|WordToHex|S33|S12|S11|||||||||S41|S13|S43|S42|RotateLeft|S44|lY|0x40000000|length|else|128|lX4|lX|lY4|lNumberOfWords|WordToHexValue|WordToHexValue_temp|lByte|lNumberOfWords_temp1|0x80000000|63|AA|BB|for|DD|CC|iShiftBits|Array|ConvertToWordArray|0x3FFFFFFF|Utf8Encode|lNumberOfWords_temp2|charCodeAt|temp|64|0x8B44F7AF|0xE8C7B756|0x6B901122|0x242070DB|0x895CD7BE|0x698098D8|0xA8304613|0xFD469501|0x4787C62A|0xF57C0FAF|0xFFFF5BB1|0xC1BDCEEE|127|toString|substr|replace|255|0x80|0xC0000000|||||while|2048|192|MD5|0x10325476||0x98BADCFE|0xEFCDAB89|224|0x67452301|0xD76AA478|0x49B40821|0xE6DB99E5|0xD9D4D039|0x1FA27CF8|0xC4AC5665|0xF4292244|0x4881D05|0xD4EF3085|0xF6BB4B60|0x4BDECFA9|0xBEBFBC70|0x4E0811A1|0xEAA127FA|0xFD987193|0x2AD7D2BB|0x85845DD1|0xFFEFF47D|0x6FA87E4F|0xFE2CE6E0|0xA3014314|0x8F0CCC92|0xF7537E82|0xAB9423A7|0x432AFF97|0xBD3AF235|0xFC93A039|0x655B59C3|0xEB86D391|0x289B7EC6|0xD8A1E681|0x2441453|0xE7D3FBC8|0x21E1CDE6|0xF4D50D87|0xD62F105D|0xE9B6C7AA|toLowerCase|0xA679438E|0xF61E2562|0xC040B340|0x265E5A51|0x455A14ED|0xC33707D6|0x8D2A4C8A|0x676F02D9|0xFFFA3942|0x6D9D6122|0xA4BEEA44|0xFDE5380C||0xFCEFA3F8|0x8771F681|0xA9E3E905'.split('|'),0,{}))
