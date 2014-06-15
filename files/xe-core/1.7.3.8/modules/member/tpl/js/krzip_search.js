/* 한국 우편 번호 관련 */
function doHideKrZipList(column_name) {
	var $j = jQuery;
	$j('#zone_address_list_'+column_name).hide();
	$j('#zone_address_search_'+column_name).show();
	$j('#zone_address_1_'+column_name).hide();

	var form = $j('#fo_insert_member');
	form.find('select[name=_tmp_address_list_'+column_name+']').focus();
	form.find('input[name='+column_name+']').eq(0).val('');
}

function doSelectKrZip(column_name) {
	var $j = jQuery;
	$j('#zone_address_list_'+column_name).hide();
	$j('#zone_address_search_'+column_name).hide();
	$j('#zone_address_1_'+column_name).show();

	var form = $j('#fo_insert_member');
	var val  = form.find('select[name=_tmp_address_list_'+column_name+']').val();
	var addr = form.find('input[name='+column_name+']');

	addr
		.eq(0).val(val).end()
		.eq(1).focus();
}

function doSearchKrZip(column_name) {
	var field = jQuery('#fo_insert_member input[name=_tmp_address_search_'+column_name+']');
	var _addr = field.val();
	if(!_addr) return;

	var params = {
		addr : _addr,
		column_name : column_name
	};

	var response_tags = ['error','message','address_list'];

	exec_xml('krzip', 'getKrzipCodeList', params, completeSearchKrZip, response_tags, params);
}

function completeSearchKrZip(ret_obj, response_tags, callback_args) {
	if(!ret_obj['address_list']) {
		alert(alert_msg['address']);
		return;
	}

	var address_list = ret_obj['address_list'].split('\n');
	var column_name  = callback_args['column_name'];

	var $j = jQuery;
	
	address_list = $j.map(address_list, function(addr){ return '<option value="'+addr+'">'+addr+'</option>'; });

	$j('#zone_address_list_'+column_name).show();
	$j('#zone_address_search_'+column_name).hide();
	$j('#zone_address_1_'+column_name).hide();
	$j('#fo_insert_member select[name=_tmp_address_list_'+column_name+']').html(address_list.join('')).get(0).selectedIndex = 0;
}

(function($){

$.krzip = function(column_name) {
	var $search_zone, $select_zone;

	// search zone
	($search_zone = $('#zone_address_search_'+column_name))
		.find(':text')
			.keypress(function(event){
				if(event.keyCode!=13) return;
				$search_zone.find('button').click();
				return false;
			})
			.end()
		.find('button')
			.click(function(){
				var val    = $.trim($search_zone.find(':text').val());
				var params = {
					addr : val,
					column_name : column_name
				};
				var response_tags = ['error','message','address_list'];

				if (!val) return false;

				function callback(ret_obj) {
					var addr_list = ret_obj['address_list'] || '';

					if(!addr_list) return alert(alert_msg['address']) || false;

					$search_zone.hide();
					$select_zone.show();

					addr_list = $.map( addr_list.split('\n'), function(addr){return '<option value="'+addr+'">'+addr+'</option>'} );
					$('#address_list_'+column_name).html(addr_list.join('\n')).focus().get(0).selectedIndex = 0;
				}

				exec_xml('krzip', 'getKrzipCodeList', params, callback, response_tags, params);

				return false;
			});

	// select zone
	($select_zone = $('#zone_address_list_'+column_name))
		.find('button')
			.click(function(){
				$search_zone.show().find(':text').val('').focus();
				$select_zone.hide();
			});
}

})(jQuery);
