/*
 *  Project: prettyCheckable
 *  Description: jQuery plugin to replace checkboxes and radios for custom images
 *  Author: Arthur Gouveia
 *  License: Licensed under the MIT License
 */

;(function ( $, window, undefined ) {

    var pluginName = 'prettyCheckable',
      document = window.document,
      defaults = {
        labelPosition: 'right',
        customClass: '',
        color: 'blue'
      };

    function Plugin( element, options ) {
      this.element = element;
      this.options = $.extend( {}, defaults, options) ;

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    function addCheckableEvents(element){

      element.find('a, label').on('touchstart click', function(e){

        e.preventDefault();

        var clickedParent = $(this).closest('.clearfix');
        var input = clickedParent.find('input');
        var fakeCheckable = clickedParent.find('a');

        if (input.attr('type') == 'radio') {

          $('input[name="' + input.attr('name') + '"]').each(function(index, el){
            $(el).removeAttr('checked').parent().find('a').removeClass('checked');
          });

        }

        if (input.attr('checked') !== undefined) {

          input.removeAttr('checked').change();

        } else {

          input.attr('checked', 'checked').change();

        }

        fakeCheckable.toggleClass('checked');

      });

      element.find('a').on('keyup', function(e){

        if (e.keyCode === 32) {

          $(this).click();

        }

      });

    }

    Plugin.prototype.init = function () {

      var el = $(this.element);

      el.css('display', 'none');

      var classType = el.data('type') !== undefined ? el.data('type') : el.attr('type');

      var label = el.data('label') !== undefined ? el.data('label') : '';

      var labelPosition = el.data('labelposition') !== undefined ? 'label' + el.data('labelposition') : 'label' + this.options.labelPosition;

      var customClass = el.data('customclass') !== undefined ? el.data('customclass') : this.options.customClass;

      var color =  el.data('color') !== undefined ? el.data('color') : this.options.color;

      var containerClasses = ['pretty' + classType, labelPosition, customClass, color].join(' ');

      el.wrap('<div class="clearfix ' + containerClasses + '"></div>').parent().html();
      
      var dom = [];
      var isChecked = el.attr('checked') !== undefined ? 'checked' : '';

      if (labelPosition === 'labelright') {

        dom.push('<a href="#" class="' + isChecked + '"></a>');
        dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');

      } else {

        dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');
        dom.push('<a href="#" class="' + isChecked + '"></a>');

      }

      el.parent().append(dom.join('\n'));
      addCheckableEvents(el.parent());

    };

    $.fn[pluginName] = function ( options ) {
      this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });
      return this;
    };

}(jQuery, window));