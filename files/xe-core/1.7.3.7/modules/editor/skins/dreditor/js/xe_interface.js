/**
 * @file xe_interface.js
 * @brief XE Editor Standard Interface
 * @author NHN (developers@xpressengine.com)
 */
(function($){

// get editor app
var editor = xe.getApp('DrEditor');
if ($.isArray(editor)) editor = editor[0];

function _get_content(editor_sequence) {
	var content = editor.cast('GET_CONTENT', [editor_sequence]);
	return $.isArray(content)?content[0]:content;
}

function _set_content(editor_sequence, content) {
	editor.cast('SET_CONTENT', [editor_sequence, content]);
}

function _create(editor_sequence, primary_key, content_key, editor_height, colorset, content_style, content_font, content_font_size) {
	if (!colorset) colorset = 'white';
	if (!content_style) content_style = 'xeStyle';
	if (!content_font) content_font = '';
	if (!content_font_size) content_font_size = '';

	var seq  = editor_sequence;
	var form = $('#dreditor_dummy_'+editor_sequence).parents('form:first').get(0);
	var target_src = request_uri+'modules/editor/styles/'+content_style+'/editor.html';
	var content = form[content_key].value;

	try {
		form.setAttribute('editor_sequence', seq);
	} catch(e) {
		form.edtior_sequence = seq;
	}

	// Set Standard API
	if (editorRelKeys) {
		editorRelKeys[seq] = {
			primary : form[primary_key],
			content : form[content_key],
			editor  : null,
			func      : function(){ return editor.cast('GET_CONTENT', [seq]) },
			pasteHTML : function(content){ editor.cast('SET_CONTENT', [seq, content]); }
		};
	}

	editor.cast('CREATE_EDITOR', [seq, form]); // create new editor

	jQuery(function(){
		editor.cast('SET_CONTENT', [seq, content]);
		if (editorRelKeys) editorRelKeys[seq].content.value = editorRelKeys[seq].func();
	});

	// Auto save
	if (form._disable_autosaved) {
		editorRemoveSavedDoc();
	} else {
		if (form._saved_doc_title && form._saved_doc_title.value) { // Check auto-saved document
			var saved_title = form._saved_doc_title.value;
			var saved_content = form._saved_doc_content.value;

			if (saved_title || saved_content) {
				// 자동저장된 문서 활용여부를 물은 후 사용하지 않는다면 자동저장된 문서 삭제
				if(confirm(form._saved_doc_message.value)) {
					if(typeof(form.title)!='undefined') form.title.value = saved_title;
					if(editorRelKeys){
						$(function(){
							editorRelKeys[seq].content.value = saved_content;
							editorRelKeys[seq].pasteHTML(saved_content);
						});
					}
				} else {
					editorRemoveSavedDoc();
				}
			}
		}
		editorEnableAutoSave(form, editor_sequence);
	}
}

// before unload
window.onbeforeunload = function(e) {
	var msg = '';
	$.each(editorRelKeys, function(seq, obj){
		if (!obj) return  true;

		var content = obj.func();

		if (content != obj.content.value) {
			msg = msg_close_before_write;
			return false;
		}
	});

	if (msg) {
		if ($.browser.msie) window.event.returnValue = msg;
		else return msg;
	}
};

// register as global function
window.editorStart_xe = _create;
window.editorGetContentTextarea_xe = _get_content;

})(jQuery);
