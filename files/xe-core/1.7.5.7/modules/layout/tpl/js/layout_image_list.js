var input_image = null;

function popupLayoutImageList(layout_srl){
    input_image = jQuery('#background-image');
    if(!layout_srl) return;
    var url = request_uri.setQuery('module','layout').setQuery('act','dispLayoutAdminLayoutImageList').setQuery('layout_srl',layout_srl);
    popopen(url, "LayoutImageList");
}

function selectLayoutImage(url){
    opener.input_image.val(url);
    window.close();
}
