/**
 * @file   modules/point/js/point_admin.js
 * @author NAVER (developers@xpressengine.com)
 * @brief  point 모듈의 관리자용 javascript
 **/

jQuery(function($){

$('button.calc_point').click(function(){
	var $this, form, elems, reset, el, fn, i=0;
	
	$this = $(this);
	$expr = $('input.level_expression');
	form  = this.form;
	elems = form.elements;
	reset = $this.hasClass('_reset');

	if(reset || !$expr.val()) $expr.val('Math.pow(i,2) * 90');

	try {
		fn = new Function('i', 'return ('+$expr.val()+')');
	} catch(e){
		fn = null;
	}

	if(!fn) return;

	while(el = elems['level_step_'+(++i)]) el.value = fn(i);
});

});

/**
 * @brief 포인트를 전부 체크하여 재계산하는 action 호출
 **/
function doPointRecal() {
	var resp, $recal;

	function on_complete(ret) {
		if(!$recal) $recal = jQuery('#pointReCal');

		$recal.html(ret.message);

		if(ret.position == ret.total) {
			alert(message);
			location.reload();
		} else {
			exec_xml(
				'point',
				'procPointAdminApplyPoint',
				{position : ret.position, total : ret.total},
				on_complete,
				resp
			);
		}
	}

    exec_xml(
		'point', // module
		'procPointAdminReCal', // procedure
		{}, // parameters
		on_complete, // callback
		resp=['error','message','total','position'] // response tags
	);
}

function updatePoint(member_srl)
{
	var $point = jQuery('#point_'+member_srl);
	get_by_id('update_member_srl').value = member_srl;
	get_by_id('update_point').value = $point.val();

    var hF = get_by_id('updateForm');
	hF.submit();
}


function doPointReset(module_srls) {
    exec_xml(
		'point',
		'procPointAdminReset',
		{module_srls : module_srls},
		function(ret_obj){document.location.reload();},
		['error','message']
	);
}
