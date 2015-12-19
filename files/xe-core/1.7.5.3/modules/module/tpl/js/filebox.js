var selected_filebox = {};

// popup
function openFileBox(file_obj, filter){
    selected_filebox[file_obj.name] = file_obj;
    var url = request_uri.setQuery('module','module').setQuery('act','dispModuleFileBox').setQuery('input',file_obj.name).setQuery('filter',filter);
    popopen(url, "filebox");
}

function selectFileBoxFile(file_url, module_filebox_srl){
    if(!selected_filebox_input_name) return;
    opener.selected_filebox[selected_filebox_input_name].value = file_url;
    opener.document.getElementById('filebox_preview_'+selected_filebox_input_name).innerHTML = document.getElementById('filebox_preview_' + module_filebox_srl).innerHTML;
    opener.document.getElementById('filebox_preview_'+selected_filebox_input_name).style.display='';
    opener.document.getElementById('filebox_unselect_'+selected_filebox_input_name).style.display='';
    window.close();
}

function deleteFileBoxFile(module_filebox_srl){
    var params ={
            "module_filebox_srl":module_filebox_srl
        };

    jQuery.exec_json('module.procModuleFileBoxDelete', params, function(data){
        document.location.reload();
    });
}

function unselectFileBox(id){
    jQuery("[name="+id+"]").val('');
    jQuery('#filebox_preview_'+id).html('').hide();
    jQuery('#filebox_unselect_'+id).hide();
}

function initFileBox(id){
    if(opener && opener.selectedWidget && opener.selectedWidget.getAttribute("widget")){
        var file = opener.selectedWidget.getAttribute(id);
        if(file){
            var html = _displayMultimedia(file,"100%","100%");
            jQuery('#filebox_preview_'+id).html(html).show();
            jQuery('#filebox_unselect_'+id).show();
        }
    }
}