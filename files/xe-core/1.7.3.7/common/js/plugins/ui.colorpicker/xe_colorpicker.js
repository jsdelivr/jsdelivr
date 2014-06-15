/**
 * @brief XE Colorpicker
 * @author NHN (developers@xpressengine.com)
 **/
jQuery(function($){

    $.fn.xe_colorpicker = function(settings){
		return this.jPicker(settings);
    }

    $('input.color-indicator').xe_colorpicker();
});
