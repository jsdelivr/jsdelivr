/**
 * popup으로 열렸을 경우 부모창의 위지윅에디터에 select된 block이 있는지 체크하여
 * 있으면 가져와서 원하는 곳에 삽입
 **/

/**
 * 부모창의 위지윅에디터에 데이터를 삽입
 **/
function completeInsertPoll(ret_obj) {
    if(typeof(opener)=="undefined") return null;

    var fo_obj = get_by_id('fo_component');
    var skin = fo_obj.skin.options[fo_obj.skin.selectedIndex].value;

    var poll_srl = ret_obj["poll_srl"];
    if(!poll_srl) return null;

    var text = "<img src=\"../../../../common/img/blank.gif\" poll_srl=\""+poll_srl+"\" editor_component=\"poll_maker\" skin=\""+skin+"\" style=\"display:block;width:400px;height:300px;border:2px dotted #4371B9;background:url(./modules/editor/components/poll_maker/tpl/poll_maker_component.gif) no-repeat center;\"  />";

    alert(ret_obj['message']);

	opener.editorFocus(opener.editorPrevSrl);

	var iframe_obj = opener.editorGetIFrame(opener.editorPrevSrl)

	opener.editorReplaceHTML(iframe_obj, text);
	opener.editorFocus(opener.editorPrevSrl);
    window.close();

    return null;
}

jQuery(function($){
	var $node, poll_last_idx = 1;

	$node = $(opener.editorPrevNode);
	if($node.length && $node.attr('editor_component') == 'poll_maker') {
		alert(msg_poll_cannot_modify);
		return window.close();
	}

	// Add a new poll
	$('#add_poll').click(function(){
		addPoll();
		setFixedPopupSize();
	});

	// Add a new item
	$('button._add_item').click(function(){
		var $tr_src, $tr_new, $th, idx;

		$tr_src = $(this).prev().children('table').find('>tbody>tr:last');
		$tr_new = $tr_src.clone();

		match = $tr_src.find('td>input').attr('name').match(/item_(\d+)_(\d+)$/);
		if(!match) return;

		match[2]++;

		($th=$tr_new.find('th')).html( $th.html().replace(/ \d+/, ' '+match[2]) );
		$tr_new.find('td>input').attr('name', 'item_'+match[1]+'_'+match[2]);

		$tr_src.after($tr_new);

		setFixedPopupSize();
	});

	// delete an item
	$('button._del_item').click(function(){
		var $tr, match;

		$tr = $(this).prevAll('div').children('table').find('>tbody>tr:last');
		match = $tr.find('td>input').attr('name').match(/item_(\d+)_(\d+)/);
		if(!match || match[2] == 2) return;

		$tr.remove();

		setFixedPopupSize();
	});

	// delete a poll
	$('button._del_poll').click(function(){
		$(this).parent('.poll_box').remove();

		reindex();
	});

	function reindex() {
		var $polls = $('.poll_box'); $inputs = $polls.find('input'), poll_idx = 0;

		$inputs.attr('name', function(idx, val) {
			if(/^checkcount_/.test(val)) poll_idx++;
			return val.replace(/^([a-z]+_)(?:tidx|\d+)/, '$1'+poll_idx);
		});

		// If there are two or more polls, show 'delete poll' button.
		// Otherwise hide the button.
		if($polls.length > 1) {
			$polls.find('button._del_poll').show();
		} else {
			$polls.find('button._del_poll').hide();
		}
	}

	function addPoll() {
		var $src = $('#poll_source');

		$src.before(
			$src.clone(true)
				.removeAttr('id')
				.addClass('poll_box')
				.css('display', 'block')
		);

		reindex();
	}

	// add a poll
	addPoll();
});

jQuery(window).load(setFixedPopupSize);
