jQuery(function($){

var is_popup = window._isPoped;

/**
 * @brief Get emoticon list by name
 * @params String emoticon name
 */
function getEmoticons(emoName) {
	var params    = {component:'emoticon', emoticon:emoName, method:'getEmoticonList'};
	var resp_tags = 'error message emoticons'.split(' ');

	exec_xml('editor', 'procEditorCall', params, completeGetEmoticons, resp_tags);
}

/**
 * @brief Load callback
 */
function completeGetEmoticons(ret_obj) {
    var emoticons = ret_obj['emoticons'].split("\n");
    var html = [];
    for(var i=0;i<emoticons.length;i++) {
		html[html.length] = '<img src="./modules/editor/components/emoticon/tpl/images/'+emoticons[i]+'" class="emoticon" />';
    }
	jQuery('#emoticons').html(html.join('')).find('img.emoticon').click(insertEmoticon);
}

/**
 * @brief  Insert a selected emoticon into the document
 * @params Event jQuery event
 */
function insertEmoticon() {
	var url, html, iframe, win = is_popup?opener:window;

	if(!win) return;

	html = '<img src="'+this.src+'" class="emoticon" />';

	win.editorFocus(win.editorPrevSrl);
	win.editorRelKeys[win.editorPrevSrl].pasteHTML(html);

	if (is_popup) window.focus();

	return false;
}

// load default emoticon set
getEmoticons('msn');
$('#selectEmoticonList').change(function(){ getEmoticons(this.value) });

});
