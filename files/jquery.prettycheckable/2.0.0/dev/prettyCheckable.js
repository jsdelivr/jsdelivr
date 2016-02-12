/*
 *  Project: prettyCheckable
 *  Description: jQuery plugin to replace checkboxes and radios for custom images
 *  Author: Arthur Gouveia
 *  License: Licensed under the MIT License
 */
/* global jQuery:true, ko:true */
;(function ( $, window, document, undefined ) {
    'use strict';

    var pluginName = 'prettyCheckable',
        dataPlugin = 'plugin_' + pluginName,
        defaults = {
            label: '',
            labelPosition: 'right',
            customClass: '',
            color: 'blue'
        };

    var addCheckableEvents = function (element) {

        if (window.ko) {

            $(element).on('change', function(e) {

                e.preventDefault();

                //only changes from knockout model
                if (e.originalEvent === undefined) {

                    var clickedParent = $(this).closest('.clearfix'),
                        fakeCheckable = $(clickedParent).find('a:first'),
                        isChecked = fakeCheckable.hasClass('checked');

                    if (isChecked === true) {

                        fakeCheckable.addClass('checked');

                    } else {

                        fakeCheckable.removeClass('checked');

                    }

                }

            });

        }

        element.find('a:first, label').on('touchstart click', function(e){

            e.preventDefault();

            var clickedParent = $(this).closest('.clearfix'),
                input = clickedParent.find('input'),
                fakeCheckable = clickedParent.find('a:first');

            if (fakeCheckable.hasClass('disabled') === true) {

                return;

            }

            if (input.prop('type') === 'radio') {

                $('input[name="' + input.attr('name') + '"]').each(function(index, el){

                    $(el).prop('checked', false).parent().find('a:first').removeClass('checked');

                });

            }

            if (window.ko) {

                ko.utils.triggerEvent(input[0], 'click');

            } else {

                if (input.prop('checked')) {

                    input.prop('checked', false).change();

                } else {

                    input.prop('checked', true).change();

                }

            }

            fakeCheckable.toggleClass('checked');

        });

        element.find('a:first').on('keyup', function(e){

            if (e.keyCode === 32) {

                $(this).click();

            }

        });

    };

    var Plugin = function ( element ) {
        this.element = element;
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {

        init: function ( options ) {

            $.extend( this.options, options );

            var el = $(this.element);

            el.parent().addClass('has-pretty-child');

            el.css('display', 'none');

            var classType = el.data('type') !== undefined ? el.data('type') : el.attr('type');

            var label = null,
                elLabelId = el.attr('id');

            if (elLabelId !== undefined) {

                var elLabel = $('label[for=' + elLabelId + ']');

                if (elLabel.length > 0) {

                    label = elLabel.text();

                    elLabel.remove();

                }

            }

            if (this.options.label === '') {

                this.options.label = label;

            }

            label = el.data('label') !== undefined ? el.data('label') : this.options.label;

            var labelPosition = el.data('labelposition') !== undefined ? 'label' + el.data('labelposition') : 'label' + this.options.labelPosition;

            var customClass = el.data('customclass') !== undefined ? el.data('customclass') : this.options.customClass;

            var color =  el.data('color') !== undefined ? el.data('color') : this.options.color;

            var disabled = el.prop('disabled') === true ? 'disabled' : '';

            var containerClasses = ['pretty' + classType, labelPosition, customClass, color].join(' ');

            el.wrap('<div class="clearfix ' + containerClasses + '"></div>').parent().html();

            var dom = [];
            var isChecked = el.prop('checked') ? 'checked' : '';

            if (labelPosition === 'labelright') {

                dom.push('<a href="#" class="' + isChecked + ' ' + disabled + '"></a>');
                dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');

            } else {

                dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');
                dom.push('<a href="#" class="' + isChecked + ' ' + disabled + '"></a>');

            }

            el.parent().append(dom.join('\n'));
            addCheckableEvents(el.parent());

        },

        check: function () {

            if ($(this.element).prop('type') === 'radio') {

                $('input[name="' + $(this.element).attr('name') + '"]').each(function(index, el){

                    $(el).prop('checked', false).attr('checked', false).parent().find('a:first').removeClass('checked');

                });

            }

            $(this.element).prop('checked', true).attr('checked', true).parent().find('a:first').addClass('checked');

        },

        uncheck: function () {

            $(this.element).prop('checked', false).attr('checked', false).parent().find('a:first').removeClass('checked');

        },

        enable: function () {

            $(this.element).removeAttr('disabled').parent().find('a:first').removeClass('disabled');

        },

        disable: function () {

            $(this.element).attr('disabled', 'disabled').parent().find('a:first').addClass('disabled');

        },

        destroy: function () {

            var el = $(this.element),
                clonedEl = el.clone(),
                label = null,
                elLabelId = el.attr('id');

            if (elLabelId !== undefined) {

                var elLabel = $('label[for=' + elLabelId + ']');

                if (elLabel.length > 0) {

                    elLabel.insertBefore(el.parent());

                }

            }

            clonedEl.removeAttr('style').insertAfter(elLabel);

            el.parent().remove();

        }

    };

    $.fn[ pluginName ] = function ( arg ) {

        var args, instance;

        if (!( this.data( dataPlugin ) instanceof Plugin )) {

            this.data( dataPlugin, new Plugin( this ) );

        }

        instance = this.data( dataPlugin );

        instance.element = this;

        if (typeof arg === 'undefined' || typeof arg === 'object') {

            if ( typeof instance.init === 'function' ) {
                instance.init( arg );
            }

        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {

            args = Array.prototype.slice.call( arguments, 1 );

            return instance[arg].apply( instance, args );

        } else {

            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

        }
    };

}(jQuery, window, document));