
;(function($) {
    var orig_width = 0;
    var orig_height = 0;
    var $form = $;

    function getImage() {
        var image_url = $form.find('#image_url').val();

        // url이 미리 입력되어 있을 경우 scale구해줌
        if(image_url) {
            getImageScale();
            return;
        }

        // 부모 위지윅 에디터에서 선택된 영역이 있으면 처리
        var node = opener.editorPrevNode;
        if(!node || node.nodeName != 'IMG') {
            return;
        }

        var src = node.getAttribute('src');
        var border = (node.style.borderWidth) ? node.style.borderWidth.match('[0-9]+') : node.getAttribute('border');
        var align = (node.style.cssFloat) ? node.style.cssFloat : node.style.styleFloat;
        var margin = (node.style.margin) ? node.style.margin.match('[0-9]+') : node.getAttribute('margin');
        var alt = node.getAttribute('alt');
		var width = node.getAttribute('width');
		var height = node.getAttribute('height');
        var link_url = node.getAttribute('link_url');
        var open_window = node.getAttribute('open_window');


        orig_width = width;
        orig_height = height;

        if(!align) {
            align = (node.style.verticalAlign) ? node.style.verticalAlign : node.getAttribute('align');
        }

        $form.find('#image_url').val(src);
        $form.find('#image_alt').val(alt);

        if(link_url) {
            link_url = link_url.replace(/<([^>]*)>/ig,'').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>').replace(/&amp;/ig,'&');
            $form.find('#link_url').val(link_url);
        }
        if(open_window == 'Y') $form.find('#open_window').attr('checked', true);

        switch(align) {
            case 'left' : $form.find('#align_left').attr('checked', true); break;
            case 'middle' : $form.find('#align_middle').attr('checked', true); break;
            case 'right' : $form.find('#align_right').attr('checked', true); break;
            default : $form.find('#align_normal').attr('checked', true); break;
        }

        if(margin) {
            $form.find('#image_margin').val(margin);
        }

        if(border) {
            $form.find('#image_border').val(border);
        }

        $form.find('#width').val(width);
        $form.find('#height').val(height);
    }

    function insertImage() {
        if(typeof(opener) == "undefined") return;

        var text = '';
        var link_url = $form.find('#link_url').val();
        var open_window = 'N';

        if(link_url) link_url = link_url.replace(/&/ig,'&amp;').replace(/</ig,'&lt;').replace(/>/ig,'&gt;');
        if($form.find('#open_window').attr('checked')) open_window = 'Y';

        var url = $form.find('#image_url').val();
        var alt = $form.find('#image_alt').val();
        var align = '';
        var border = parseInt($form.find('#image_border').val(), 10);
        var margin = parseInt($form.find('#image_margin').val(), 10);

        if($form.find('#align_normal').attr('checked') == 'checked') align = '';
        else if($form.find('#align_left').attr('checked') == 'checked') align = 'left';
        else if($form.find('#align_middle').attr('checked') == 'checked') align = 'middle';
        else if($form.find('#align_right').attr('checked') == 'checked') align = 'right';

        var width = $form.find('#width').val();
        var height = $form.find('#height').val();

        if(!url) {
          window.close();
          return;
        }

        url = url.replace(request_uri,'');
        var $component = $('<span><img editor_component="image_link" /></span>');
        var img_attrs = {};
        var img_style = {};

        img_attrs.src = url;
        if(alt) img_attrs.alt = alt;
        if(width) {
            img_attrs.width = width;
            img_style.width = width;
        }
        if(height) {
            img_attrs.height = height;
            img_style.height = height;
        }
        if(link_url) img_attrs.link_url = link_url;
        if(open_window == 'Y') img_attrs.open_window = 'Y';
        if(border) {
            img_attrs.border = border;
            img_style.border = border+'px solid';
        }
        if(margin) img_attrs.margin = margin;
        if(align == 'left' || align == 'right') {
            img_style.float = align;
        } else if(align == 'middle')  {
            img_style.verticalAlign = align;
        }

        $component.find('img').attr(img_attrs);
        $component.find('img').css(img_style);

        var iframe_obj = opener.editorGetIFrame(opener.editorPrevSrl)

		try {
			var prevNode = opener.editorPrevNode;
			prevNode.parentNode.insertBefore($component.find('img').get(0), prevNode);
			prevNode.parentNode.removeChild(prevNode);
		}catch(e){
			try {
				text = $component.html();
				opener.editorReplaceHTML(iframe_obj, text);
			} catch(ee) { }
		};
        opener.editorFocus(opener.editorPrevSrl);

        window.close();
    }

    function getImageScale() {
        var url = $form.find('#image_url').val();
        if(!url) return;

        var img = new Image();
        img.src = url;

        $form.find('#width').val(img.width);
        $form.find('#height').val(img.height);

        orig_width = img.width;
        orig_height = img.height;
    }

    function setScale(type) {
        switch(type) {
            case 'width' :
                    if(!orig_height) return;
                    var n_width = $form.find('#width').val();
                    var p = n_width / orig_width;
                    var n_height = parseInt(orig_height * p, 10);
                    $form.find('#height').val(n_height);
                break;
            case 'height' :
                    if(!orig_width) return;
                    var n_height = $form.find('#height').val();
                    var p = n_height / orig_height;
                    var n_width = parseInt(orig_width * p, 10);
                    $form.find('#width').val(n_width);
                break;
        }
    }

    /* DOM READY */
    $(function() {
        $form = $('#fo');
        $form.find('#btn_insert').click(insertImage);
        if(typeof(opener) != "undefined") getImage();
		$form.find('#image_url').blur(getImageScale);
		$form.find('#get_scale').click(getImageScale);
		$form.find('#width').blur(function() { setScale('width') });
		$form.find('#height').blur(function() { setScale('height') });

    });

}) (jQuery);
