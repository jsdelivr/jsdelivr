/**
 * @file   modules/importer/js/importer_admin.js
 * @author NAVER (developers@xpressengine.com)
 * @brief  importer에서 사용하는 javascript
 **/
jQuery(function($){

// Note : Module finder is defined modules/admin/tpl/js/admin.js

// Check whether the xml file exists
$('.checkxml')
	.find('input:text')
		.change(function(){
			$(this).closest('.checkxml').find('.x_help-inline').hide();
		})
	.end()
	.find('button')
		.click(function(){
			var $this, $container, $input, $messages, $loading, $form, $syncmember, count;

			$this      = $(this).prop('disabled', true);
			$form      = $this.closest('form');
			$container = $this.closest('.checkxml');
			$input     = $container.find('input').prop('disabled', true).addClass('loading');
			$message   = $container.find('.x_help-inline').hide();

			function on_complete(data) {
				var $ul, $ttxml, $xml;

				//$ul    = $this.closest('ul');
				$xml   = $form.find('>.xml');
				$ttxml = $form.find('>.ttxml');

				$message.text(data.result_message);
					
				// when the file doesn't exists or any other error occurs
				if(data.error || data.exists != 'true') {
					$message.attr('class', 'x_help-inline').fadeIn(300);
					$ttxml = $ttxml.filter(':visible');
					$ttxml.eq(-1).slideUp(100, function(){
						$ttxml = $ttxml.slice(0,-1).eq(-1).slideUp(100,arguments.callee);
					});
					$form.find(':submit').attr('disabled','disabled');
					return restore();
				}

				$message.attr('class', 'x_help-inline').fadeIn(300);
				$form.find(':submit').removeAttr('disabled');

				$syncmember = $form.find('.syncmember:hidden');
				
				$input.prop('disabled', false).removeClass('loading');
				$this.prop('disabled', false);
				
				if(data.type == 'XML') {
					$xml.not(':visible').add($syncmember).slideDown(300);
				} else if(data.type == 'TTXML') {
					$ttxml.not(':visible').add($syncmember).slideDown(300);
					$form.find('input[name=type]').val('ttxml');
				}
			};

			function restore() {
				$input.prop('disabled', false).removeClass('loading');
				$this.prop('disabled', false);
				$form.find('.syncmember:visible').slideUp(100);
				return false;
			};

			show_waiting_message = false;
			$.exec_json('importer.procImporterAdminCheckXmlFile', {filename:$.trim($input.val())}, on_complete);
		})
	.end()
	.find('.x_help-inline').hide().end()
	.closest('form').find('>.ttxml').hide().end().end()
	.closest('form').find(':submit').attr('disabled','disabled');

// hide 'sync member' block
$('.syncmember').hide();

});

/**
 * 회원정보와 게시글/댓글등의 동기화 요청 및 결과 처리 함수
 **/
function doSync(fo_obj) {
    exec_xml(
		'importer',
		'procImporterAdminSync', 
		[],
		function(ret){
			alert(ret.message);
			location.href = location.href;
		}
	);
    return false;
}

/**
 * xml파일을 DB입력전에 extract를 통해 분할 캐싱을 요청하는 함수
 **/
function doPreProcessing(form, formId) {
	var xml_file, type, resp, prepared = false, $ = jQuery, $status, $process, $form;

	xml_file = form.elements['xml_file'].value;
	type     = form.elements['type'].value;

    if(!xml_file) return false;

	// show modal window
	$process = $('#process');
	if(!$('body').children('.x_modal-backdrop').length) $('body').append('<div class="x_modal-backdrop" />');
	$('a[href="#process"].modalAnchor').trigger('open.mw');

    exec_xml(
		'importer', // module
		'procImporterAdminPreProcessing', // action
		{type:type, xml_file:xml_file}, // parameters
		on_complete, // callback
		resp=['error','message','type','total','cur','key','status'] // response tags
	);

	function on_complete(ret) {
		var $reload, $cont, fo_proc, elems, i, c, key, to_copy, fo_import;

		prepared = true;

		// when fail prepare
		if(ret.status == -1) {
			return alert(ret.message);
		}

		fo_proc = get_by_id('fo_process');
		elems   = fo_proc.elements;

		for(i=0,c=resp.length; i < c; i++) {
			key = resp[i];
			elems[key]?elems[key].value=ret[key]:0;
		}

		fo_import = get_by_id(formId);
		if(fo_import) {
			to_copy = ['target_module','guestbook_target_module','user_id', 'unit_count'];
			for(i=0,c=to_copy.length; i < c; i++) {
				key = to_copy[i];
				if(fo_import.elements[key]) fo_proc.elements[key].value = fo_import.elements[key].value;
			}
		}

		jQuery('#preProgressMsg').hide();
		jQuery('#progressMsg').show();
		doImport(formId);
	}

    return false;
}

/* @brief Start importing */
function doImport(formId) {
    var form = get_by_id('fo_process'), elems = form.elements, i, c, params={}, resp;

	for(i=0,c=elems.length; i < c; i++) {
		params[elems[i].name] = elems[i].value;
	}

	function on_complete(ret, response_tags) {
		var i, c, key, fo_import;
		
		for(i=0,c=resp.length; i < c; i++) {
			key = resp[i];
			//elems[key]?elems[key].value=ret_obj[key]:0;
			elems[key]?elems[key].value=ret[key]:0;
		}

		ret.total = parseInt(ret.total, 10) || 0;
		ret.cur   = parseInt(ret.cur, 10) || 0;
		percent = parseInt((ret.cur/ret.total)*100);

		jQuery('#totalCount').text(ret.total);
		jQuery('#completeCount').text(ret.cur);
		jQuery('#progressBar').width(percent+'%');
		jQuery('#progressPercent').html(percent + "%");

		if(ret.total > ret.cur) {
			doImport(formId);
		} else {
			function resultAlertMessage()
			{
				alert(ret.message);
				jQuery('a[href="#process"].modalAnchor')
					.unbind('before-close.mw')
					.trigger('close.mw')
					.find('#progressBar').width(1).end()
					.find('#progressPercent').html('0%').end();

				try {
					form.reset();
					get_by_id(formId).reset();
				} catch(e){ };

				jQuery('span.btn > input[type=submit]').attr('disabled','disabled');
			}

			fo_import = get_by_id(formId);
			if(fo_import != null && fo_import.isSync.checked)
			{
				exec_xml(
					'importer', // module
					'procImporterAdminSync', // act
					params,
					function(ret){if(ret && (!ret.error || ret.error == '0'))resultAlertMessage()}, // callback
					resp = ['error','message'] // response tags
				);
			}
			else resultAlertMessage();
		}
	}

    show_waiting_message = false;
    exec_xml(
		'importer', // module
		'procImporterAdminImport', // act
		params,
		on_complete, // callback
		resp = ['error','message','type','total','cur','key'] // response tags
	);
    show_waiting_message = true;

    return false;
}

/* display progress */
function displayProgress(total, cur) {
	var per, stat, $stat;

	per = Math.max(total?Math.round(cur/total*100):100, 1);

	$stat = jQuery('#status');
	if(!$stat.find('div.progress1').length) {
		$stat.html( '<div class="progressBox"><div class="progress1"></div><div class="progress2"></div></div>' );
	}

	$stat
		.find('div.progress1')
			.html(per+'&nbsp;')
			.css('width', per+'%')
		.end()
		.find('div.progress2')
			.text(cur+'/'+total);
}

