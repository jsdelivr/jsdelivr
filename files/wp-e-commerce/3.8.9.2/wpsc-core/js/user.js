var testsuccess = 0;
var lnid = new Array();


function categorylist(url) {
	self.location = url;
}

var noresults=function(results) {
	return true;
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}


var getresults=function(results) {
	eval(results);
	if(window.drag_and_drop_cart_updater) {
		drag_and_drop_cart_updater();
	}
	if(document.getElementById('loadingimage') != null) {
		document.getElementById('loadingindicator').style.visibility = 'hidden';
	} else if(document.getElementById('alt_loadingimage') != null) {
		document.getElementById('alt_loadingindicator').style.visibility = 'hidden';
	}
	if((document.getElementById('sliding_cart') != null) && (document.getElementById('sliding_cart').style.display == 'none')) {
		jQuery("#fancy_collapser").attr("src", (WPSC_CORE_IMAGES_URL + "/minus.png"));
		jQuery("#sliding_cart").show("fast",function(){
			ajax.post("index.php",noresults,"ajax=true&set_slider=true&state=1");
		});
	}
	if(document.getElementById('fancy_notification') != null) {
		jQuery('#loading_animation').css("display", 'none');
	//jQuery('#fancy_notificationimage').css("display", 'none');
	}
}

function submitform(frm, show_notification)
{
	ajax.post("index.php?ajax=true&user=true",getresults,ajax.serialize(frm));
	if(document.getElementById('loadingimage') != null)	{
		document.getElementById('loadingimage').src = WPSC_CORE_IMAGES_URL + '/indicator.gif';
		document.getElementById('loadingindicator').style.visibility = 'visible';
	}else if(document.getElementById('alt_loadingimage') != null){
		document.getElementById('alt_loadingimage').src = WPSC_CORE_IMAGES_URL + '/indicator.gif';
		document.getElementById('alt_loadingindicator').style.visibility = 'visible';
	}
	
	return false;
}


function prodgroupswitch(state)
{
	if(state == 'brands'){
		jQuery('.categorydisplay').css("display", 'none');
		jQuery('.branddisplay').css("display", 'block');
	}else if(state == 'categories'){
		jQuery('.categorydisplay').css("display", 'block');
		jQuery('.branddisplay').css("display", 'none');
	}
	return false;
}

var previous_rating;
function ie_rating_rollover(id,state)
{
	target_element = document.getElementById(id);
	switch(state)
	{
		case 1:
			previous_rating = target_element.style.background;
			target_element.style.background = "url(" + WPSC_CORE_IMAGES_URL + "/blue-star.gif)";
			break;

		default:
			if(target_element.style.background != "url(" + WPSC_CORE_IMAGES_URL + "/gold-star.gif)")
			{
				target_element.style.background = previous_rating;
			}
			break;
	}
}

var apply_rating=function(results)
{
	outarr = results.split(",");
	//alert(results);
	for(i=1;i<=outarr[1];i++)
	{
		id = "star"+outarr[0]+"and"+i+"_link";
		document.getElementById(id).style.background = "url(" + WPSC_CORE_IMAGES_URL + "/gold-star.gif)";
	}

	for(i=5;i>outarr[1];i--)
	{
		id = "star"+outarr[0]+"and"+i+"_link";
		document.getElementById(id).style.background = "#c4c4b8";
	}
	lnid[outarr[0]] = 1;

	rating_id = 'rating_'+outarr[0]+'_text';
	//alert(rating_id);
	if(document.getElementById(rating_id).innerHTML != "Your Rating:")
	{
		document.getElementById(rating_id).innerHTML = "Your Rating:";
	}

	saved_id = 'saved_'+outarr[0]+'_text';
	document.getElementById(saved_id).style.display = "inline";
	update_vote_count(outarr[0]);
}

function hide_save_indicator(id)
{
	document.getElementById(id).style.display = "none";
}

function rate_item(prodid,rating)
{
	ajax.post("index.php",apply_rating,"ajax=true&rate_item=true&product_id="+prodid+"&rating="+rating);
}

function update_vote_count(prodid)
{
	var update_vote_count=function(results)
	{
		outarr = results.split(",");
		vote_count = outarr[0];
		prodid = outarr[1];
		vote_count_id = 'vote_total_'+prodid;
		document.getElementById(vote_count_id).innerHTML = vote_count;
	}
	ajax.post("index.php",update_vote_count,"ajax=true&get_rating_count=true&product_id="+prodid);
}


function update_preview_url(prodid)
{
	image_height = document.getElementById("image_height").value;
	image_width = document.getElementById("image_width").value;
	if(((image_height > 0) && (image_height <= 1024)) && ((image_width > 0) && (image_width <= 1024)))
	{
		new_url = "index.php?productid="+prodid+"&height="+image_height+"&width="+image_width+"";
		document.getElementById("preview_link").setAttribute('href',new_url);
	}
	else
	{
		new_url = "index.php?productid="+prodid+"";
		document.getElementById("preview_link").setAttribute('href',new_url);
	}
	return false;
}

function change_variation(product_id, variation_ids, special) {
	value_ids = '';
	special_prefix = "";
	if(special == true) {
		form_id = "specials_"+product_id;
	} else {
		form_id = "product_"+product_id;
	}
	for(var i in variation_ids) {
		if(!isNaN(parseInt(i))) {
			variation_name = "variation["+variation_ids[i]+"]";
			value_ids += "&variation[]="+document.getElementById(form_id).elements[variation_name].value;
		}
	}
	if(special == true) {
		var return_price=function(results) {
			eval(results);
			if(product_id != null) {
				target_id = "special_product_price_"+product_id;
				buynow_id = "BB_BuyButtonForm"+product_id;
				document.getElementById(target_id).firstChild.innerHTML = price;
				if (price.substring(27,price.indexOf("&"))!='')
					document.getElementById(buynow_id).item_price_1.value = price.substring(27,price.indexOf("&"));
			}
		}
	} else {
		var return_price=function(results) {
			//alert(results);
			eval(results);
			if(product_id != null) {
				target_id = "product_price_"+product_id;
				buynow_id = "BB_BuyButtonForm"+product_id;
				//document.getElementById(target_id).firstChild.innerHTML = price;
				if(jQuery("input#"+target_id).attr('type') == 'text') {
					jQuery("input#"+target_id).val(numeric_price);
				} else {
					jQuery("#"+target_id+" span.pricedisplay").html(price);
				}
			}
		}
	}
	ajax.post("index.php",return_price,"ajax=true&get_updated_price=true&product_id="+product_id+value_ids);
}
function show_details_box(id,image_id) {
	state = document.getElementById(id).style.display;
	if(state != 'block') {
		document.getElementById(id).style.display = 'block';
		document.getElementById(image_id).src = WPSC_CORE_IMAGES_URL + "/icon_window_collapse.gif";
	} else {
		document.getElementById(id).style.display = 'none';
		document.getElementById(image_id).src = WPSC_CORE_IMAGES_URL + "/icon_window_expand.gif";
	}
	return false;
}

var register_results=function(results) {
	jQuery("div#TB_ajaxContent").html(results);
	jQuery('div#checkout_login_box').css("border", '1px solid #339933');
	jQuery('div#checkout_login_box').css("background-color", '#e8fcea');
}

function submit_register_form(frm)
{
	jQuery('img#register_loading_img').css("display", 'inline');
	ajax.post("index.php?ajax=true&action=register",register_results,ajax.serialize(frm));

	return false;
}

var fadeInSuggestion = function(suggestionBox, suggestionIframe) {
	jQuery(suggestionBox).fadeTo(300,1);
};

var fadeOutSuggestion = function(suggestionBox, suggestionIframe) {
	jQuery(suggestionBox).fadeTo(300,0);
};

function change_pics(command){
	location1 = window.location.href;

	if (command == 1){
		document.getElementById('out_view_type').innerHTML = "<input type='hidden' id='view_type' name='view_type' value='default'>";
		document.getElementById('out_default_pic').innerHTML ="<img id='default_pic' src='" + WPSC_CORE_IMAGES_URL + "/default-on.gif'>";
		document.getElementById('out_grid_pic').innerHTML ="<img id='grid_pic' style='cursor:pointer;' onclick='change_pics(0)' src='" + WPSC_CORE_IMAGES_URL + "/grid-off.gif'>";
		if (location1.search(/view_type/)!=-1) {
			$new_location = location1.replace("grid","default");
		} else {
			if (location1.search(/\?/)!=-1) {
				$new_location = location1+"&view_type=default";
			} else {
				$new_location = location1+"?view_type=default";
			}
		}
		window.location = $new_location;
	} else {
		document.getElementById('out_view_type').innerHTML = "<input type='hidden' id='view_type' name='view_type' value='grid'>";
		document.getElementById('out_default_pic').innerHTML ="<img id='default_pic'  style='cursor:pointer;' onclick='change_pics(1)' src='" + WPSC_CORE_IMAGES_URL + "/default-off.gif'>";
		document.getElementById('out_grid_pic').innerHTML ="<img id='grid_pic' src='" + WPSC_CORE_IMAGES_URL + "/grid-on.gif'>";
		if (location1.search(/view_type/)!=-1) {
			$new_location = location1.replace("default","grid");
		} else {
			if (location1.search(/\?/)!=-1) {
				$new_location = location1+"&view_type=grid";
			} else {
				$new_location = location1+"?view_type=grid";
			}
		}

		window.location = $new_location;
	}
}

function log_buynow(form){
	id = form.product_id.value;
	price = form.item_price_1.value;
	ajax.post("index.php",noresults,"ajax=true&buynow=true&product_id="+id+"price="+price);
}

function gotoexternallink(link, target){
	if (target == '') {
		target = '_self';
	}
	window.open(link, target);
	return false;
}

function manage_extras(product_id, extras_id, special) {
	value_ids = '';
	special_prefix = "";
	extra_idss='';
	document.getElementById('extras_indicator'+product_id+extras_id).style.display='block';
	if(special == true) {
		form_id = "specials_"+product_id;
	} else {
		form_id = "product_"+product_id;
	}

	jQuery(document).ready(function(){
		extra_ids=jQuery("input.extras_"+product_id+":checked");
	});

	jQuery.each(extra_ids, function(key, value) {
		extra_idss += "&extra[]="+extra_ids[key].value;
	});
	pm='stay';

	if(special == true) {
		var return_price=function(results) {
			//alert(results);
			eval(results);
			if(product_id != null) {
				target_id = "special_product_price_"+product_id;
				buynow_id = "BB_BuyButtonForm"+product_id;
				document.getElementById(target_id).firstChild.innerHTML = price;
				if (price.substring(27,price.indexOf("&"))!='')
					document.getElementById(buynow_id).item_price_1.value = price.substring(27,price.indexOf("&"));
			}
			document.getElementById('extras_indicator'+product_id+extras_id).style.display='none';
		}
	} else {
		var return_price=function(results) {
			eval(results);
			if(product_id != null) {
				target_id = "product_price_"+product_id;
				buynow_id = "BB_BuyButtonForm"+product_id;
				document.getElementById(target_id).firstChild.innerHTML = price;
				if (price.substring(27,price.indexOf("&"))!='')
					document.getElementById(form_id).item_price_1.value = price.substring(27,price.indexOf("&"));
			}
			document.getElementById('extras_indicator'+product_id+extras_id).style.display='none';
		}
	}
	ajax.post("index.php",return_price,"ajax=true&get_updated_price=true&pm="+pm+"&product_id="+product_id+extra_idss);
}

function store_list(){
	address = document.getElementById('user_address').value;
	city = document.getElementById('user_city').value;
	if ((address != '') && (city != '')) {
		document.getElementById('gloc_loading').style.display='block';
		ajax.post("index.php",return_store_list,"ajax=true&store_list=true&addr="+address+"&city="+city);
	}
}

var return_store_list=function(results) {
	document.getElementById('gloc_storelist').innerHTML=results;
	document.getElementById('gloc_loading').style.display='none';
	return true;
}

function statusTextKeyPress(event){
	if(!event){
		event=window.event;
	}
	if(event.keyCode){
		keyPressed=event.keyCode;
	}else if(event.which){
		keyPressed=event.which;
	}
	if(keyPressed==9){
		return false;
	}
	if(keyPressed==13){
		newstatus = document.getElementById('status_change_text').value;
		ajax.post("index.php",submit_user_status,"ajax=true&submitstatus=true&status="+newstatus);
		return false;
	}
	if(keyPressed==27){
		document.getElementById('edit_status_select').style.display='none';
		return false;
	}
	return true;
}
// function switchmethod(key,key1){
// // 	total=document.getElementById("shopping_cart_total_price").value;
// 	ajax.post("index.php",usps_method_switch,"ajax=true&uspsswitch=true&key1="+key1+"&key="+key+"&total="+total);
// }

var usps_method_switch=function (results){
	shipping = results.split('---');
	shipping1 = shipping[1];
	jQuery("#checkout_total").html(shipping[0]);

	jQuery('.total > .pricedisplay').remove();
	jQuery('.total > .totalhead').after(shipping[0]);
	jQuery('.postage > .pricedisplay').remove();
	jQuery('.postage > .postagehead').after(shipping1);
}

function add_meta_box(results){
	jQuery(".wpsc_buy_button").before(results);
	jQuery('.time_requested').datepicker({
		dateFormat: 'yy-mm-dd'
	});
}

function submit_purchase(){
	document.forms.ideal_form.submit();
}

function do_nothing() {
	return;
}

jQuery(document).ready(
	function() {
		if (jQuery("#openair").val() == 1) {
			var max_height = 0;
			var min_offset = 9999;
			var max_left_offset = 0;
			var top_offset = 0;
			jQuery("div.product_grid_item").each(
				function() {
					jQuery(this).css('margin','0');
					if (jQuery(this).height() > max_height) {
						max_height = jQuery(this).height();
					}
					var offset = jQuery(this).offset();
					if (offset.left <= min_offset) {
						min_offset = offset.left;
					}
					if (offset.top > top_offset) {
						top_offset = offset.top;
					}
					if (offset.left > max_left_offset) {
						max_left_offset = offset.left;
					}
				}
				);

			jQuery("div.product_grid_item:last").each(
				function() {
					var offset = jQuery(this).offset();

					if (offset.left != max_left_offset) {
						jQuery(this).css('border-right','1px solid #ddd');
					}
				}
				);

			jQuery("div.product_grid_item").each(
				function() {



					var offset = jQuery(this).offset();
					if (offset.left == min_offset) {
						setTimeout('do_nothing', 200);
						jQuery(this).css('border-left','0px solid #ddd');
					}

					if (offset.top == top_offset) {
						jQuery(this).css('border-bottom','0px solid #ddd');
					}
					jQuery(this).height(max_height+30);
				}
				);
		}



		jQuery("div.custom_gateway table").each(
			function() {
				if(jQuery(this).css('display') == 'none') {
					jQuery('input', this).attr( 'disabled', true);
				}
			}
			);
		
		function selectCustomGateway() {
			var parent_div = jQuery(this).parents("div.custom_gateway");

			jQuery('table input',parent_div).attr( 'disabled', false);
			jQuery('table',parent_div).show();
			jQuery("div.custom_gateway table").not(jQuery('table',parent_div)).hide();
			jQuery("div.custom_gateway table input").not(jQuery('table input',parent_div)).attr( 'disabled', true);
		}
		
		jQuery("input.custom_gateway").change(
			function() {
				if(jQuery(this).is(':checked') == true) {
					selectCustomGateway.call(this);
				}
			}
			);
			
		selectCustomGateway.call(jQuery('input.custom_gateway:checked'));
	}
	);