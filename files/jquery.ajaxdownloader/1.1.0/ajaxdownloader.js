/***************************************************************************************************
AjaxDownloader - A jQuery Plugin to perform Ajax style downloads
    Author          : Gaspare Sganga
    Version         : 1.1.0
    License         : MIT
    Documentation   : http://gasparesganga.com/labs/jquery-ajax-downloader/
****************************************************************************************************/
(function($, undefined){
    $.AjaxDownloader = function(options){
        // Settings
        var settings = $.extend(true, {}, {
            data    : $.ajaxSetup()["data"] || {},
            url     : $.ajaxSetup()["url"]
        }, options);
        
        // Create Form
        var form = $("<form>", {
            action  : settings.url,
            method  : "POST",
            target  : "AjaxDownloaderIFrame",
        }).appendTo("body");
        
        // Append Data
        $.each(settings.data, function(key, val){
            $("<input>", {
                type    : "hidden",
                name    : key,
                value   : (typeof val == "object") ? JSON.stringify(val) : val
            }).appendTo(form);
        });
        
        // Submit Form
        form.submit();
        form.remove();
    };

    // Create AjaxDownloaderIFrame
    $(document).ready(function(){
        $("<iframe>", {
            name    : "AjaxDownloaderIFrame"
        })
        .hide()
        .appendTo("body");
    });
}(jQuery));