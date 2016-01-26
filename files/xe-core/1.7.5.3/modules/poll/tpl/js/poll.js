/* 설문 참여 함수 */
function doPoll(fo_obj) {

    var checkcount = new Array();
    var item = new Array();

    for(var i=0;i<fo_obj.length;i++) {
        var obj = fo_obj[i];
        if(obj.nodeName != 'INPUT') continue;

        var name = obj.name;
        if(name.indexOf('checkcount')>-1) {
            var t = name.split('_');
            var poll_srl_index = parseInt(t[1],10);
            checkcount[poll_srl_index] = obj.value;
            item[poll_srl_index] = new Array();

        } else if(name.indexOf('item_')>-1) {
            var t = name.split('_');
            var poll_srl = parseInt(t[1],10); 
            var poll_srl_index = parseInt(t[2],10); 
            if(obj.checked == true) item[poll_srl_index][item[poll_srl_index].length] = obj.value;
        }
    }

    var poll_srl_indexes = "";
    for(var poll_srl_index in checkcount) {
	if(!checkcount.hasOwnProperty(poll_srl_index)) continue;
        var count = checkcount[poll_srl_index];
        var items = item[poll_srl_index];
        if(items.length < 1 || count < items.length) {
            alert(poll_alert_lang);
            return false;
        }

        poll_srl_indexes += items.join(',')+',';
    }
    fo_obj.poll_srl_indexes.value = poll_srl_indexes;

	fo_obj.submit();
}

jQuery(function($){
	/* View poll result */
	$('._poll_result').click(function(){
		var cls = $(this).attr('class'), srl, skin;

		try{
			srl  = cls.match(/\b_srl_(\d+)\b/)[1];
			skin = cls.match(/\b_skin_(.+?)\b/)[1];
		}catch(e){ };

		if(!srl) return false;
		if(!skin) skin = 'default';

		function on_complete(ret) {
			var $poll = $('#poll_'+srl), width;

			width  = $poll.width();
			$poll.html(ret['tpl']);
			$poll.width(width);
		}

		exec_xml(
			'poll', // module
			'procPollViewResult', // act
			{poll_srl:srl, skin:skin}, // parameters
			on_complete,
			['error','message','tpl']
		);

		return false;
	});
});
