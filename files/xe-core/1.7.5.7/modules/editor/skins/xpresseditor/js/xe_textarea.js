function editorStartTextarea(editor_sequence, content_key, primary_key) {
    var obj = xGetElementById('editor_'+editor_sequence);
    var use_html = xGetElementById('htm_'+editor_sequence).value;
    obj.form.setAttribute('editor_sequence', editor_sequence);

    obj.style.width = '100%';

    editorRelKeys[editor_sequence] = new Array();
    editorRelKeys[editor_sequence]["primary"] = obj.form[primary_key];
    editorRelKeys[editor_sequence]["content"] = obj.form[content_key];
    editorRelKeys[editor_sequence]["func"] = editorGetContentTextarea;

    var content = obj.form[content_key].value;
    if(use_html) {
        content = content.replace(/<br([^>]*)>/ig,"\n");
        if(use_html!='br') {
            content = content.replace(/&lt;/g, "<");
            content = content.replace(/&gt;/g, ">");
            content = content.replace(/&quot;/g, '"');
            content = content.replace(/&amp;/g, "&");
        }
    }
    obj.value = content;
}

function editorGetContentTextarea(editor_sequence) {
    var obj = xGetElementById('editor_'+editor_sequence);
    var use_html = xGetElementById('htm_'+editor_sequence).value;
    var content = obj.value.trim();
    if(use_html) {
        if(use_html!='br') {
            content = content.replace(/&/g, "&amp;");
            content = content.replace(/</g, "&lt;");
            content = content.replace(/>/g, "&gt;");
            content = content.replace(/\"/g, "&quot;");
        }
        content = content.replace(/(\r\n|\n)/g, "<br />");
    }
    return content;
}

