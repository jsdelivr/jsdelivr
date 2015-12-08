function doSearchKrZip(form, column_name) {
	var $=jQuery, $form, field_obj, params, response_tags;

	$form = $(form);
	if (!$form.filter('form').length) $form = $form.parents('form:first');
	if (!$form.length) return;

	field_obj = $form.get(0).elements['addr_search_'+column_name];
	if(!field_obj || !field_obj.value) return;

	params = {
		addr : field_obj.value,
		column_name : column_name
	};
	response_tags = 'error message address_list'.split(' ');

	exec_xml('krzip', 'getKrzipCodeList', params, completeSearchKrZip, response_tags, params, $form[0]);
}

function completeSearchKrZip(ret_obj, response_tags, callback_args, fo_obj) {
	var $=jQuery, addr_list, column_name, $zone_list, $zone_search, $select;

	if(!ret_obj['address_list']) return alert(alert_msg['address']);

	addr_list   = ret_obj['address_list'].split('\n');
	column_name = callback_args['column_name'];

	if (!($zone_list=$('#addr_list_'+column_name)).length) return;
	if (!($zone_search=$('#addr_search_'+column_name)).length) return;
	if (!($select=$(fo_obj.elements['addr_list_'+column_name])).length) return;

	for(var i=0,c=addr_list.length; i<c; i++) {
		addr_list[i] = '<option value="'+addr_list[i]+'">'+addr_list[i]+'</option>';
	}

	$select.html(addr_list.join('')).get(0).selectedIndex = 0;

	$zone_search.hide();
	$zone_list.show();
}

function doHideKrZipList(form, column_name) {
	var $=jQuery, $form, $zone_search, $zone_list;

	$form = $(form);
	if (!$form.filter('form').length) $form = $form.parents('form:first');
	if (!$form.length) return;

	if (!($zone_list=$('#addr_list_'+column_name)).length) return;
	if (!($zone_search=$('#addr_search_'+column_name)).length) return;

	$zone_search.show();
	$zone_list.hide();

	try {
		$form.get(0).elements['addr_search_'+column_name].focus();
	} catch(e){};
}

function doSelectKrZip(form, column_name) {
	var $=jQuery, $form, $zone_list, $zone_search, $zone_searched, $select;

	$form = $(form);
	if (!$form.filter('form').length) $form = $form.parents('form:first');
	if (!$form.length) return;

	if (!($zone_list=$('#addr_list_'+column_name)).length) return;
	if (!($zone_search=$('#addr_search_'+column_name)).length) return;
	if (!($zone_searched=$('#addr_searched_'+column_name)).length) return;
	if (!($select=$form.find('select[name="addr_list_'+column_name+'"]')).length) return;

	$zone_searched.show();
	$zone_list.hide();
	$zone_search.hide();

	$form.get(0).elements[column_name + '[]'][0].value = $select.val();
	$form.get(0).elements[column_name + '[]'][1].focus();
}

function doShowKrZipSearch(obj, column_name) {
	var $=jQuery;
	$('input[name="'+column_name+'[]"]').val('');
	$('#addr_list_'+column_name).hide();
	$('#addr_search_'+column_name).show();
	$('#addr_searched_'+column_name).hide();
}
