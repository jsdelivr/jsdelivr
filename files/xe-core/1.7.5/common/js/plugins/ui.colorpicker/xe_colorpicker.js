/**
 * @brief XE Colorpicker
 * @author NAVER (developers@xpressengine.com)
 **/
jQuery(function($){

    $.fn.xe_colorpicker = function(settings){
		return this.jPicker(settings);
    }

    $('input.color-indicator').xe_colorpicker();
});
