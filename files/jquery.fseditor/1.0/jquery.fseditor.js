/*

 jQuery Fullscreen Editor v1.0
 Fullscreen text editor plugin for jQuery.

 :For more details visit http://github.com/burakson/fseditor

 - Burak Son <hello@burakson.com>
 - http://github.com/burakson

 Licensed under MIT - http://opensource.org/licenses/MIT

*/
(function($) {
  "use strict";

  var isFullscreen = false,
      isPlaceholderDestroyed = false,
      $el,
      $wrapper,
      $editor,
      $editable,
      $icon,
      $overlay,
      transitionDuration = 300,
      settings = {
        overlay: true,
        expandOnFocus: false,
        transition: 'fade',
        placeholder: '',
        maxWidth: '',
        maxHeight: '',
        onExpand: function() {},
        onMinimize: function() {}
      };

  var methods = {

    init: function(opts) {

      settings = settings || {};
      $.extend(true, settings, settings);
      $.extend(true, settings, opts);

      $el = $(this);
      if(!$el.is('textarea')) {
        $.error('Error initializing FSEditor Plugin. It can only work on <textarea> element.');
        return;
      }

      var $elementValue = ($.trim($el.val()) !== '' ? $el.val() : '');
      $el.hide();

      var content = '<div class="fs-editor-wrapper">\
                     <div class="fs-editor"><a href="#" class="fs-icon"></a>\
                     <div class="fs-editable" contenteditable="true"></div>\
                     </div></div>';

      var $insertContent = $(content).insertAfter(this);
      $editor            = $insertContent.find('.fs-editor');
      $editable          = $editor.find('.fs-editable');
      $icon              = $editor.find('.fs-icon');

      // add height of the original element as min-height for non-fullscreen mode
      $editable.css('min-height', $el.css('height'))
               .parent('.fs-editor-wrapper')
               .css('min-height', $el.css('height'));

      // ESC = closes the fullscreen mode
      $(window).on("keyup.fseditor", function(e) {
        if(e.keyCode == 27) { 
          isFullscreen ? methods.minimize() : '';
        }
      });

      // open the fullscreen mode when user focuses on editor
      if(settings.expandOnFocus) {
        $editable.on("focus.fseditor", function() {
          methods.expand();
        });
      }

      // fullscreen icon click event
      $icon.on('click.fseditor.icon', function(e) {
        e.preventDefault();
        methods[isFullscreen ? "minimize" : "expand"]();
      });

      // add placeholder unless it has a value
      if(settings.placeholder && $el.val()==''){
        methods.placeholder();
      } else if($el.val()!='') {
        $editable.html($elementValue);
      }

      // copy textarea if there is a form
      var $closestForm = $editor.closest('form');
      $closestForm.on('submit',function(e) {
        var parse = $editable.html().replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'');
        $el.html(parse == settings.placeholder ? '' : parse);
      });

      return this;
    },

    showOverlay: function() {

      $('<div class="fs-editor-overlay" />').appendTo('body')
                                            .fadeTo(settings.transition == '' ? 0 : transitionDuration, 1)
                                            .click(function() { methods.minimize(); });

      return this;
    },

    removeOverlay: function() {

      var $overlay = $('.fs-editor-overlay');
      if($overlay.length) {
        $overlay.fadeTo(settings.transition == '' ? 0 : transitionDuration, 0, function() {
          $(this).remove();
        });
      }

      return this;
    },

    expand: function() {
      if(settings.transition=='fade') {
        $editor.fadeTo(0, 0);
      }

      settings.maxWidth  ? $editor.css('max-width',  settings.maxWidth) : ''; 
      settings.maxHeight ? $editor.css('max-height', settings.maxHeight) : '';
      if(settings.overlay) {
        methods.showOverlay();
      }

      $(window).on('resize.fseditor', function() {  
        relocate($editor);
      });

      $editor.addClass('expanded transition-'+ settings.transition);
      transitions.fx(settings.transition);

      return this;
    },

    minimize: function() {

      $(window).off('resize.fseditor', relocate($editor))
      $editor.removeClass('expanded transition-'+ settings.transition)
             .css({
                'max-width' : 'none',
                'max-height': 'none'
             });
      if(settings.transition=='fade') {
        $editor.fadeTo(0, 0);
      }
      if(settings.overlay) {
        methods.removeOverlay();
      }
      transitions.fx(settings.transition);

      return this;
    },

    placeholder: function() {

      if (typeof settings.placeholder == 'string') {
        $editable.addClass('placeholder')
                 .html(settings.placeholder)
                 .on({
                    focus: function() {
                      if(!isPlaceholderDestroyed && $editable.html() == settings.placeholder) {
                        $editable.html('')
                                 .removeClass('placeholder');
                      }
                    },
                    blur: function() {
                      if(!isPlaceholderDestroyed && $editable.html() == '') {
                        $editable.html(settings.placeholder)
                                 .addClass('placeholder');
                      }
                    }
                  });

        return this;
      }
    },

    destroy: function() {

      methods.removeOverlay();
      $el.show()
         .nextAll('.fs-editor-wrapper')
         .remove();

      $(window).off('keyup.fseditor')
               .off('resize.fseditor');

      return this;
    },
  };

  var transitions = {

    fx: function(t) {

      relocate($editor);

      switch (t) {
        case 'fade':
          (isFullscreen ? methods.fadeComplete('minimize') : $editor.fadeTo(transitionDuration, 1, methods.fadeComplete('expand')));
          break;

        case 'slide-in':
          (isFullscreen ? methods.slideInComplete('minimize') : methods.slideInComplete('expand'));
          break;

        default:
          (isFullscreen ? methods.noTransition('minimize') : methods.noTransition('expand'));
          break;
      }
    },

    noTransition: function(e) {

      if(e=='expand') {
        if(!settings.placeholder) {
          $editable.focus();
        }
        $editor.css('opacity', 1);
        isFullscreen = true;
        settings.onExpand.call(this);
      } else if(e=='minimize') {
        if(!settings.placeholder) {
          $editable.focus();
        }
        isFullscreen = false;
        settings.onMinimize.call(this);
      }

      return;
    },

    fadeComplete: function(e) {

      if(e=='expand') {
        if(!settings.placeholder) {
          $editable.focus();
        }
        isFullscreen = true;
        settings.onExpand.call(this);
      } else if(e=='minimize') {
        $editor.fadeTo(0, 1);
        if(!settings.placeholder) {
          $editable.focus();
        }
        isFullscreen = false;
        settings.onMinimize.call(this);
      }

      return;
    },

    slideInComplete: function(e) {

      if(e=='expand') {
        $editor.css({'top': -999, opacity: 1})
               .animate({top: 0|((($(window).height() - $editor.height()) / 2))}, transitionDuration);
        isFullscreen = true;
        settings.onExpand.call(this);
      }
      else if (e=='minimize')
      {
        $editor.animate({top:-999}, transitionDuration);
        isFullscreen = false;
        settings.onMinimize.call(this);
      }

      return;
    }
  };

  function relocate(el) {

    var yPos = 0|((($(window).height() - el.height()) / 2));
    var xPos = 0|(($(window).width() - el.width()) / 2);
    el.css({
      'top' : yPos,
      'left': xPos
    });

  }

  $.fn.fseditor = function(method) {
    $.extend(methods, transitions);
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.fseditor' );
    }    
  };

})(jQuery);
