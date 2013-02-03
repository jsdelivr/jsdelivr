/*
 * Dynamic To Top Plugin Settings
 * http://www.mattvarone.com
 *
 * By Matt Varone
 * @sksmatt
 *
*/
jQuery(document).ready(function ($) {

    // GRAB ELEMENTS
    /////////////////////////////////////////////////////////

    var preview = $('#dynamic-to-top-button'),
        preview_button_version = $('#dynamic-to-top-button #dtt-image'),
        preview_text_version = $('#dynamic-to-top-button #dtt-text'),
        hide_on_button = $('#text-text, #slider-font-size, #checkbox-bold, #checkbox-text-shadow, #farbtastic-text-color, #farbtastic-shadow-color').parent().parent();

    // INITIALIZE
    /////////////////////////////////////////////////////////

    toggle_text_version();
    update_preview();
    update_position();

    // EVENTS
    /////////////////////////////////////////////////////////

    $('#checkbox-text-version').on('click', function () {
        toggle_text_version();
    });

    $('#checkbox-bold, #checkbox-inset, #checkbox-shadow, #checkbox-text-shadow, .colorvalue').on('change', function () {
        update_preview();
    });

    $('#select-position').on('change', function () {
        update_position();
    });

    $('#text-text').on('keyup', function () {
        update_preview();
    });

    $('.ddt-bg-colors a').on('click',function (e) {
        e.preventDefault();
        $('#dynamic-to-top-preview').css('background-color', $(this).attr('title') || 'white');
    });

    // SLIDERS
    /////////////////////////////////////////////////////////

    // Radius
    var slider = jQuery("#slider-radius").hide(),
        slider_val = jQuery('span#radius-val').html(slider.val());

    jQuery('#slider-picker-radius').slider({
        range: "min",
        value: slider.val(),
        min: 0,
        max: 30,
        slide: function (event, ui) {
            slider.val(ui.value);
            slider_val.html(ui.value);
            preview.css('border-radius', ui.value + 'px');
        }
    });

    // Border Width
    var slider_2 = jQuery("#slider-border-width").hide(),
        slider_val_2 = jQuery('span#border-val').html(slider_2.val());

    jQuery('#slider-picker-border-width').slider({
        range: "min",
        value: slider_2.val(),
        min: 0,
        max: 10,
        slide: function (event, ui) {
            slider_2.val(ui.value);
            slider_val_2.html(ui.value);
            preview.css('border-width', ui.value + 'px');
        }
    });

    // Speed
    var slider_3 = jQuery('#slider-speed').hide(),
        slider_val_3 = jQuery('span#speed-val').html(slider_3.val());

    jQuery('#slider-picker-speed').slider({
        range: "max",
        value: slider_3.val(),
        min: 100,
        step: 100,
        max: 3000,
        slide: function (event, ui) {
            slider_3.val(ui.value);
            slider_val_3.html(ui.value);
        }
    });

    // Padding Top/Bottom
    var slider_4 = jQuery("#slider-padding-top-bottom").hide(),
        slider_val_4 = jQuery('span#padding-top-bottom-val').html(slider_4.val());

    jQuery('#slider-picker-padding-top-bottom').slider({
        range: "min",
        value: slider_4.val(),
        min: 2,
        max: 21,
        slide: function (event, ui) {
            slider_4.val(ui.value);
            slider_val_4.html(ui.value);
            preview.css({
                paddingTop: ui.value + 'px',
                paddingBottom: ui.value + 'px'
            });
        }
    });

    // Padding Left/Right
    var slider_5 = jQuery("#slider-padding-left-right").hide(),
        slider_val_5 = jQuery('span#padding-left-right-val').html(slider_5.val());

    jQuery('#slider-picker-padding-left-right').slider({
        range: "min",
        value: slider_5.val(),
        min: 2,
        max: 40,
        slide: function (event, ui) {
            slider_5.val(ui.value);
            slider_val_5.html(ui.value);
            preview.css({
                paddingLeft: ui.value + 'px',
                paddingRight: ui.value + 'px'
            });
        }
    });

    // Font Size
    var slider_6 = jQuery("#slider-font-size").hide(),
        slider_val_6 = jQuery('span#font-size-val').html(slider_6.val());

    jQuery('#slider-picker-font-size').slider({
        range: "min",
        value: slider_6.val(),
        min: 0.8,
        max: 2,
        step: 0.05,
        slide: function (event, ui) {
            slider_6.val(ui.value);
            slider_val_6.html(ui.value);
            preview.css({
                fontSize: ui.value + 'em'
            });
        }
    });

    jQuery('.dtt-slider').css('width', '25em');


    // PICKERS
    /////////////////////////////////////////////////////////

    var Picker = function(picker) {
        this.picker = picker;
        this.input = this.picker.prev().prev();
        this.anchor = this.picker.prev();
        this.combined = this.input.add(this.anchor);
        this.open = false;
        this.init();
    };

    Picker.prototype = function(){
        var init = function(){
                this.picker.farbtastic(this.input).hide().css('margin-bottom', '15px').on( 'mouseup', function () {
                    update_preview();
                });
                this.combined.on( 'click' , {p: this}, function (e) {
                    e.preventDefault();
                    tooglePicker.call(e.data.p);
                });
            },
            tooglePicker = function() {
               var id = this.picker.attr('id');
               $('.dtt-farbtastic').each(function(){
                   if ( $(this).attr('id') != id ) {
                       var other_prev = $(this).prev();
                       if ( other_prev.hasClass('picker-opened') ) {
                           var open = other_prev.attr('data-open');
                           other_prev.removeClass('picker-opened');
                           other_prev.html(open);
                           $(this).toggle();
                       }
                   }
               });
               this.picker.toggle();
               var open = this.anchor.attr('data-open');
               if (this.anchor.html() === open) {
                   this.anchor.html(this.anchor.attr('data-closed'));
                   this.anchor.addClass('picker-opened');
               } else {
                   this.anchor.removeClass('picker-opened');
                   this.anchor.html(open);
               }
            };
        return {
            init: init
        };
    }();

    $('.dtt-farbtastic').each(function(index,item){
        new Picker($(item));
    });

    function toggle_text_version() {
        if (jQuery('#checkbox-text-version').attr('checked')) {
            preview_button_version.hide();
            preview_text_version.show();
            preview.removeClass('button-version');
            hide_on_button.show();
        } else {
            preview_button_version.show().css('display', 'block');
            preview_text_version.hide();
            preview.addClass('button-version');
            hide_on_button.hide();
        }
    }

    function update_position() {
        var preview_position = $('#select-position').val();

        switch (preview_position) {
        case 'top-left':
            preview.css({
                top: '10px',
                left: '10px',
                bottom: '',
                right: ''
            });
            break;

        case 'top-right':
            preview.css({
                top: '10px',
                right: '10px',
                bottom: '',
                left: ''
            });
            break;

        case 'bottom-left':
            preview.css({
                bottom: '10px',
                left: '10px',
                top: '',
                right: ''
            });
            break;

        case 'bottom-right':
            preview.css({
                bottom: '10px',
                right: '10px',
                top: '',
                left: ''
            });
            break;
        }
    }

    function update_preview() {
        preview.text = $('#text-text').val();
        preview.border_width = $('#slider-border-width').val();
        preview.border_radius = $('#slider-radius').val();
        preview.text_color = $('#farbtastic-text-color').val();
        preview.bg_color = $('#farbtastic-background-color').val();
        preview.border_color = $('#farbtastic-border-color').val();
        preview.padding_top_bottom = $('#slider-padding-top-bottom').val();
        preview.padding_left_right = $('#slider-padding-left-right').val();
        preview.find('#dtt-text').font_size = $('#slider-font-size').val();
        preview.shadow = $('#checkbox-shadow').attr("checked");
        preview.inset = $('#checkbox-inset').attr("checked");
        preview.bold = $('#checkbox-bold').attr("checked");
        preview.text_shadow = $('#checkbox-text-shadow').attr("checked");
        preview.text_shadow_color = $('#farbtastic-shadow-color').val();

        preview.css({
            borderStyle: 'solid',
            borderWidth: preview.border_width + 'px',
            borderRadius: preview.border_radius + 'px',
            borderColor: preview.border_color,
            backgroundColor: preview.bg_color,
            color: preview.text_color,
            paddingTop: preview.padding_top_bottom + 'px',
            paddingBottom: preview.padding_top_bottom + 'px',
            paddingLeft: preview.padding_left_right + 'px',
            paddingRight: preview.padding_left_right + 'px',
            fontSize: preview.font_size + 'em'
        }).find('#dtt-text').html(preview.text);

        if (preview.bold) {
            preview.css('font-weight', 'bold');
        } else {
            preview.css('font-weight', 'normal');
        }

        if (preview.shadow) {
            preview.addClass('dynamic-to-top-shadow');
        } else {
            preview.removeClass('dynamic-to-top-shadow');
        }

        if (preview.inset) {
            preview.addClass('dynamic-to-top-inset');
        } else {
            preview.removeClass('dynamic-to-top-inset');
        }

        if (preview.text_shadow) {
            preview.css('text-shadow', '0 1px 0 ' + preview.text_shadow_color);
        } else {
            preview.css('text-shadow', '');
        }
    }
});
