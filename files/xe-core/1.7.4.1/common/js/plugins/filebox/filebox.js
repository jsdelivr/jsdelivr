;(function($) {

    var defaults = {
    };

    var filebox = {
        selected : null,
        /**
         * pop up the file box
         */
        open : function(input_obj, filter) {
            this.selected = input_obj;

            var url = request_uri
                .setQuery('module', 'module')
                .setQuery('act', 'dispModuleFileBox')
                .setQuery('input', this.selected.name)
                .setQuery('filter', filter);

            popopen(url, 'filebox');
        },

        /**
         * select a file
         */
        selectFile : function(file_url, module_filebox_srl){
            var target = $(opener.XE.filebox.selected);
            var target_name = target.attr('name');

            target.val(file_url);
            var html = _displayMultimedia(file_url, '100%', '100%');
            $('#filebox_preview_' + target_name, opener.document).html(html).show();
            $('#filebox_cancel_' + target_name, opener.document).show();

            window.close();
        },

        /**
         * cancel
         */
        cancel : function(name) {
            $('[name=' + name + ']').val('');
            $('#filebox_preview_' + name).hide().html('');
            $('#filebox_cancel_' + name).hide();
        },

        /**
         * delete a file
         */
        deleteFile : function(module_filebox_srl){
            var params = {
                'module_filebox_srl' : module_filebox_srl
            };

            $.exec_json('module.procModuleFileBoxDelete', params, function() { document.location.reload(); });
        },

        /**
         * initialize
         */
        init : function(name) {
            var file;

            if(opener && opener.selectedWidget && opener.selectedWidget.getAttribute("widget")) {
                file = opener.selectedWidget.getAttribute(name);
            } else if($('[name=' + name + ']').val()) {
                file = $('[name=' + name + ']').val();
            }

            if(file) {
                var html = _displayMultimedia(file, '100%', '100%');
                $('#filebox_preview_' + name).html(html).show();
                $('#filebox_cancel_' + name).show();
            }
        }
    };

    // put the file into XE
    $.extend(window.XE, {'filebox' : filebox});

}) (jQuery);

function addRow(){
	var $ = jQuery;
	var $attributes = $('.__attribute');
	var $last = $attributes.last();
	var count = $last.data('count') + 1;
	var $clone = $last.clone().data('count', count);
	
	
	$last.find('.__addBtn').hide();

	$clone.find('.__attribute_name').attr('value', '').attr("id", "attribute_name"+count);
	$clone.find('.__attribute_name_label').attr('for', 'attribute_name'+count);
	$clone.find('.__attribute_value').attr('value', '').attr("id", "attribute_value"+count);
	$clone.find('.__attribute_value_label').attr('for', 'attribute_value'+count);

	$last.after($clone);
}

function clearRow(target){
	var $ = jQuery;
	var $attributes = $('.__attribute');
	var $controlGroup = $(target).closest('.x_control-group');
	var count = $attributes.length;
	
	if (count <= 1){
		return;
	}

	$controlGroup.remove();
	$('.__attribute').last().find('.__addBtn').show();
}

var $current_filebox;

jQuery(document).ready(function($){
	$('.filebox').bind('before-open.mw', function(){
		var $attributes = $('.__attribute');
		var count = $attributes.length;
		for(var i = count - 1; i > 0; i--){
			clearRow($($attributes.get(i)));
		}
		$('#new_filebox_upload').find('input[name^=attribute_name], input[name^=attribute_value], input[name=addfile]').val('');
	});
	
	$('.filebox').click(function(){
		$current_filebox = $(this);
	});

	$('#new_filebox_upload').submit(function(){
		if ($('iframe[name=iframeTarget]').length < 1){
			var $iframe = $(document.createElement('iframe'));

			$iframe.css('display', 'none');
			$iframe.attr('src', '#');
			$iframe.attr('name', 'iframeTarget');
			$iframe.load(function(){
				var data = eval('(' + $(window.iframeTarget.document.getElementsByTagName("body")[0]).html() + ')');

				if (data.error){
					alert(data.message);
					return;
				}

				$current_filebox.trigger('filebox.selected', [data.save_filename]);
				$current_filebox.trigger('close.mw');
			});

			$('body').append($iframe.get(0));

			$(this).attr('target', 'iframeTarget');
		}
	});
});
