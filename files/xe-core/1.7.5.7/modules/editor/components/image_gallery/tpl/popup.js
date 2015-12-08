var selected_node = null;
function getSlideShow() {
	var node, $node, selected_images = '', width, style, align, border_color, bg_color, thickness;

    // 부모창이 있는지 체크 
    if(typeof(opener)=="undefined") return;

    // 부모 위지윅 에디터에서 선택된 영역이 있으면 처리
    node  = opener.editorPrevNode;
	$node = jQuery(node);
    if($node.is('img')) {
        selected_node = node;

        width = $node.width();
        style = $node.attr('gallery_style');
        align = $node.attr('gallery_align') || 'center';
        border_color = $node.attr('border_color');
        bg_color  = $node.attr('bg_color');
        thickness = $node.attr('border_thickness') || 1;

        get_by_id('width').value = width; 
		get_by_id('gallery_style').selectedIndex = (style=='list')?1:0;
		get_by_id('gallery_align').selectedIndex = (align=='left')?1:(align=='right')?2:0;
        get_by_id('border_thickness').value = thickness; 

        get_by_id('border_color_input').value = border_color; 

        get_by_id('bg_color_input').value = bg_color; 

        selected_images = $node.attr('images_list');
    }

    // 부모창의 업로드된 파일중 이미지 목록을 모두 가져와서 세팅 
    var fo = get_by_id("fo");
    var editor_sequence = fo.editor_sequence.value;

    var parent_list_obj = opener.get_by_id("uploaded_file_list_"+editor_sequence);
    if(parent_list_obj) {

        var list_obj = get_by_id("image_list");

        for(var i=0;i<parent_list_obj.length;i++) {
            var opt = parent_list_obj.options[i];
            var file_srl = opt.value;
            if(!file_srl) return;
            var file_obj = opener.uploadedFiles[file_srl];
            var filename = file_obj.download_url.replace(request_uri,'');
            if((/(jpg|jpeg|gif|png)$/i).test(filename)) {
                var selected = false;
                if(selected_images.indexOf(filename)!=-1) selected = true;
                var opt = new Option(opt.text, opt.value, false, selected);
                list_obj.options.add(opt);
            }
        }

    }
}

function insertSlideShow() {
    if(typeof(opener)=="undefined") return;

    var list = new Array();
    var list_obj = get_by_id("image_list");
    for(var i=0;i<list_obj.length;i++) {
        var opt = list_obj.options[i];
        if(opt.selected) {
            var file_srl = opt.value;
            var file_obj = opener.uploadedFiles[file_srl];
            var filename = file_obj.download_url.replace(request_uri,'');
            list[list.length] = filename;
        }
    }

    if(!list.length) {
        window.close();
        return;
    }

    var width = get_by_id("width").value;

    var gallery_style = get_by_id("gallery_style").options[get_by_id("gallery_style").selectedIndex].value;
    var gallery_align = get_by_id("gallery_align").options[get_by_id("gallery_align").selectedIndex].value;
    var border_thickness = get_by_id("border_thickness").value;
    var border_color = get_by_id("border_color_input").value;
    var bg_color = get_by_id("bg_color_input").value;

    var images_list = "";
    for(var i=0; i<list.length;i++) {
        images_list += list[i].trim()+" ";
    }
    if(selected_node) {
        selected_node.setAttribute("width", width);
        selected_node.setAttribute("gallery_style", gallery_style);
        selected_node.setAttribute("align", gallery_align);
        selected_node.setAttribute("gallery_align", gallery_align);
        selected_node.setAttribute("border_thickness", border_thickness);
        selected_node.setAttribute("border_color", border_color);
        selected_node.setAttribute("bg_color", bg_color);
        selected_node.setAttribute("images_list", images_list);
        selected_node.style.width = width+"px";
    } else {
        var text = "<img src=\"../../../../common/img/blank.gif\" editor_component=\"image_gallery\" width=\""+width+"\" gallery_style=\""+gallery_style+"\" align=\""+gallery_align+"\" gallery_align=\""+gallery_align+"\" border_thickness=\""+border_thickness+"\" border_color=\""+border_color+"\" bg_color=\""+bg_color+"\" style=\"width:"+width+"px;border:2px dotted #4371B9;background:url(./modules/editor/components/image_gallery/tpl/image_gallery_component.gif) no-repeat center;\" images_list=\""+images_list+"\" />";
        opener.editorFocus(opener.editorPrevSrl);
        var iframe_obj = opener.editorGetIFrame(opener.editorPrevSrl)
        opener.editorReplaceHTML(iframe_obj, text);
    }

    opener.editorFocus(opener.editorPrevSrl);

    window.close();
}

/* 색상 클릭시 */
function select_color(type, code) {
  get_by_id(type+"_preview_color").style.backgroundColor = "#"+code;
  get_by_id(type+"_color_input").value = code;
}

jQuery(function($){
	getSlideShow();
});
