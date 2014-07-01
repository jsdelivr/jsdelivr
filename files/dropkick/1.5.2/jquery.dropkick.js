/*
 * DropKick 1.5.1
 *
 * Highly customizable <select> lists
 * https://github.com/robdel12/DropKick
 *
 * Created by: Jamie Lottering <http://github.com/JamieLottering> <http://twitter.com/JamieLottering>
 *
 *
*/

(function ($, window, document) {
  'use strict';

  var
    msVersion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/),
    msie = !!msVersion,
    ie6 = msie && parseFloat(msVersion[1]) < 7,
    isMobile = navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i),
    triggSupport = msie ? 'mousedown' : 'click',
    wheelSupport =  'onwheel' in window ? 'wheel' : // Modern browsers support "wheel"
                    'onmousewheel' in document ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                    "MouseScrollEvent" in window && 'DOMMouseScroll MozMousePixelScroll', // legacy non-standard event for older Firefox
    initOnce = {
      fired: false,
      fire: function(){ // Attach general events to the DOM only one time, on the first dropkick call
        $(document).on(triggSupport,'.dk_options a', function() { // Handle click events on individual dropdown options
          var
            $option = $(this),
            $value  = $option.parent(),
            $dk     = $option.parents('.dk_container').first()
          ;

          if(!$value.hasClass('disabled') && !$value.closest('.dk_optgroup',$dk).hasClass('disabled')){
            if (!$value.hasClass('dk_option_current')) { // Also check if this isn't the selected option
              updateFields($option, $dk);
              setCurrent($option.parent(), $dk); // IE8+, iOS4 and some Android [4.0] Browsers back to scrollTop 0 when an option is clicked and the dropdown is opened again
            }
            closeDropdown($dk);
          }

          return false;
        }).on(wheelSupport,'.dk_options_inner',function(e) {
          var delta = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail; // Gets scroll ammount
          if (msie) { this.scrollTop -= Math.round(delta/10); return false; } // Normalize IE behaviour
          return (delta > 0 && this.scrollTop <= 0 ) || (delta < 0 && this.scrollTop >= this.scrollHeight - this.offsetHeight ) ? false : true; // Finally cancels page scroll when nedded
        }).on({
            'keydown.dk_nav': function(e) { // Setup keyboard nav
              var $dk = $opened || $focused;
              $dk && handleKeyBoardNav(e, $dk);
            },
            'click': function(e) {
              var
                $eTarget = $(e.target),
                $dk
              ;
              if ($opened && $eTarget.closest(".dk_container").length === 0 ) {
                closeDropdown($opened); // Improves performance by minimizing DOM Traversal Operations
              } else if ($eTarget.is(".dk_toggle, .dk_label")) {
                $dk = $eTarget.parents('.dk_container').first();

                if ($dk.hasClass('dk_open')) {
                  closeDropdown($dk);
                } else {
                  $opened && closeDropdown($opened);
                  !$dk.attr('disabled') && openDropdown($dk,e);
                } // Avoids duplication of call to _openDropdown

                return false;
              } else if ($eTarget.attr('for') && !!$('#dk_container_'+$eTarget.attr('for'))[0] ) {
                $('#dk_container_'+$eTarget.attr('for')).trigger('focus.dropkick');
              }
            }
        });
        this.fired = true;
      }
    },

    // Public methods exposed to $.fn.dropkick()
    methods = {},

    // Cache every <select> element that gets dropkicked
    lists   = [],

    // Convenience keys for keyboard navigation
    keyMap = {
      'left'  : 37,
      'up'    : 38,
      'right' : 39,
      'down'  : 40,
      'enter' : 13,
      'tab'   : 9,
      'zero'  : 48,
      'z'     : 90,
      'last'  : 221  //support extend charsets such as Danish, Ukrainian etc.
    },

    // HTML template for the dropdowns
    dropdownTemplate = [
      '<div class="dk_container" id="dk_container_{{ id }}" tabindex="{{ tabindex }}" aria-hidden="true">',
      '<a class="dk_toggle dk_label">{{ label }}</a>',
      '<div class="dk_options">',
      '<ul class="dk_options_inner" role="main" aria-hidden="true">',
      '</ul>',
      '</div>',
      '</div>'
    ].join(''),

    // HTML template for dropdown options
    optionTemplate = '<li class="{{ current }}{{ disabled }}"><a data-dk-dropdown-value="{{ value }}">{{ text }}</a></li>',
    optgroupTemplate = '<li class="dk_optgroup{{ disabled }}"><span>{{ text }}</span>',


    // Some nice default values
    defaults = {
      startSpeed    : 400,  // I reccomend a low value (lowest is probably 100) to stop a "fade in" effect.
      theme         : false,
      changes       : false,
      syncReverse   : true,
      nativeMobile  : true,
      autoWidth     : true
    },

    // Make sure that only one dropdown is open the document
    $opened = null,

    // Make sure that only one dropdown has focus in the document
    $focused = null,

    // private
    // Update the <select> value, and the dropdown label
    updateFields = function(option, $dk, reset) {
      var
        data  = $dk.data('dropkick'),
        $select = data.$select,
        $option = option.length ? option : data.$original,
        value = $option.attr('data-dk-dropdown-value') || option.attr('value'),
        label = $option.text()
      ;

      $dk.find('.dk_label').html(!!label?label:'&nbsp;');

      !reset ? $select.val(value).trigger('change') : $select.val(value); // Let it act like a normal select when needed

      data.settings.change && !reset && !data.settings.syncReverse && data.settings.change.call($select, value, label);
    },

    // Close a dropdown
    closeDropdown = function($dk) {
      $dk.removeClass('dk_open dk_open_top');
      $opened = null;
    },

    // Report whether there is enough space in the window to drop down.
    enoughSpace = function($dk)  {
      if ($dk.data('dropkick').settings.fixedMove) {
        return $dk.data('dropkick').settings.fixedMove == 'up' ? false : true;
      }
      var
        $dk_toggle = $dk.find('.dk_toggle'),
        optionsHeight = $dk.find('.dk_options').outerHeight(),
        spaceBelow = $(window).height() - $dk_toggle.outerHeight() - $dk_toggle.offset().top + $(window).scrollTop(),
        spaceAbove = $dk_toggle.offset().top - $(window).scrollTop()
      ;
      // [Acemir] If no space above, default is opens down. If has space on top, check if will need open it to up
      return !(optionsHeight < spaceAbove) ? true : (optionsHeight < spaceBelow);
    },

    setScrollPos = function($dk, anchor, e) {
      var
        wrapper = $dk.find('.dk_options_inner'),
        height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length + (anchor.closest('.dk_optgroup',wrapper).length && anchor.closest('.dk_optgroup',wrapper).prevAll('li').outerHeight() * anchor.closest('.dk_optgroup',wrapper).prevAll('li').length),
        minHeight = wrapper.scrollTop(),
        maxHeight = wrapper.height() + wrapper.scrollTop() - anchor.outerHeight()
      ;

      ((e && e.type === 'keydown')||(height < minHeight || height > maxHeight)) && wrapper.scrollTop(height); // A more direct approach
    },

    // Open a dropdown
    openDropdown = function($dk,e) {
      var
          hasSpace  = enoughSpace($dk), // Avoids duplication of call to _enoughSpace
          openClasses =  'dk_open'+(hasSpace?'':' dk_open_top')
      ;

      $dk.find('.dk_options').css({
        top : hasSpace ? $dk.find('.dk_toggle').outerHeight() - 1 : '',
        bottom : hasSpace ? '' : $dk.find('.dk_toggle').outerHeight() - 1
      });
      $opened = $dk.addClass(openClasses);
      setScrollPos($dk,$dk.find('.dk_option_current'),e); // IE8+ needs to set scrollTop only after the dropdow is opened
    },

    // Set the currently selected option
    setCurrent = function($current, $dk, e) {
      $dk.find('.dk_option_current').removeClass('dk_option_current');
      $current.addClass('dk_option_current');
      setScrollPos($dk, $current, e);
    },

    handleKeyBoardNav = function(e, $dk) {
      var
        code     = e.keyCode,
        data     = $dk.data('dropkick'),
        letter   = String.fromCharCode(code),
        options  = $dk.find('.dk_options'),
        open     = $dk.hasClass('dk_open'),
        lis      = options.find('li:not(.disabled)'),
        current  = $dk.find('.dk_option_current'),
        parent   = current.closest('.dk_optgroup',options),
        first    = lis.first().hasClass('dk_optgroup') ? lis.first().find('li:not(.disabled)').first() : lis.first(),
        last     = lis.last().hasClass('dk_optgroup') ? lis.last().find('li:not(.disabled)').last() : lis.last(),
        relevantElements = [],
        uniqueChars,
        currentIndex,
        next,
        prev,
        now,
        list,
        i,
        l,
        $a
      ;

      switch (code) {
      case keyMap.enter:
        if (open) {
          if(!current.hasClass('disabled')){
            updateFields(current.find('a'), $dk);
            closeDropdown($dk);
          }
        } else {
          openDropdown($dk,e);
        }
        e.preventDefault();
        break;

      case keyMap.tab:
        if(open){
          current.length && updateFields(current.find('a'), $dk);
          closeDropdown($dk);
        }
        break;

      case keyMap.up:
        if (open) {
          prev = current.prevAll('li:not(.disabled)').first();
          if (prev.hasClass('dk_optgroup')) prev = prev.find('li:not(.disabled)').last();
          if (!prev.length && parent.length) prev = parent.prevAll('li:not(.disabled)').first().hasClass('dk_optgroup') ? parent.prevAll('li:not(.disabled)').first().find('li:not(.disabled)').last() : parent.prevAll('li:not(.disabled)').first();
          setCurrent(prev.length?prev:last, $dk, e);
        } else {
          openDropdown($dk,e);
        }
        e.preventDefault();
        break;

      case keyMap.down:
        if (open) {
          next = current.nextAll('li:not(.disabled)').first();
          if (next.hasClass('dk_optgroup')) next = next.find('li:not(.disabled)').first();
          if (!next.length && parent.length) next = parent.nextAll('li:not(.disabled)').first().hasClass('dk_optgroup') ? parent.nextAll('li:not(.disabled)').first().find('li:not(.disabled)').first() : parent.nextAll('li:not(.disabled)').first();
          setCurrent(next.length?next:first, $dk, e);
        } else {
          openDropdown($dk,e);
        }
        e.preventDefault();
        break;

      default:
        break;
      }
      //if typing a letter
      if (code >= keyMap.zero && code <= keyMap.z) {
        //update data
        now = new Date().getTime();
        if (data.finder === null || data.finder === undefined) {
          data.finder = letter.toUpperCase();
          data.timer = now;

        }else {
          if (now > parseInt(data.timer, 10) + 1000) {
            data.finder = letter.toUpperCase();
            data.timer =  now;
          } else {
            data.finder = data.finder + letter.toUpperCase();
            data.timer = now;
          }
        }
        //find and switch to the appropriate option
        list = lis.find('a');

        // get the unique characters for the input, "AAAAA" -> ["A"], "AFRICA" -> ["A", "F", "R", "I", "C"]
        uniqueChars = $.unique(data.finder.split(''));

        for(i = 0, l = list.length; i < l; i++){
          $a = $(list[i]);
          // get all option elements that starts with the unique character, eg. "Afghanistan", "Albania", etc. for ['A']
          // if there's more than 1 unique char, then ignore because user is actually searching by typing the options.
          if(uniqueChars.length === 1 && $a.text()[0].toUpperCase() === uniqueChars[0]){
            relevantElements.push(list[i]);
          }

          if ($a.html().toUpperCase().indexOf(data.finder) === 0 && !$a.closest('.dk_optgroup',options).hasClass('disabled') && data.finder.length > 1) {
            updateFields($a, $dk);
            setCurrent($a.parent(), $dk, e);
            break;
          }
        }

        // do the hotkey lookup only if there are relevantElements AND there's only 1 unique char
        // OR if there's only 1 character on the data.finder
        if ((data.finder.length > 1 && relevantElements.length > 1 && uniqueChars.length === 1) || data.finder.length === 1) {
          currentIndex = $.inArray(current.find('a')[0], relevantElements);

          // the new current element should be one of the relevantElements that's not currently selected
          // AND it's index is bigger than the currently selected element
          // example, if currently selected is "Australia", only "Austria" & "Azerbaijan" can be the new selected element
          // unless, the currently selected element is the last member of the relevantElements, in this case would be "Azerbaijan".
          $a = $(relevantElements).filter(function(index, el){
            return el !== current[0] && index > currentIndex;
          });

          // if currently selected element is the last elem of relevantElements, we should select the first element as the new element
          // which is "Australia", so it goes in a loop so to speak.
          $a = $a.length === 0 ? $(relevantElements[0]) : $a

          updateFields($a, $dk);
          setCurrent($a.parent(), $dk, e);
        }

        $dk.data('dropkick', data);
      }
    },

    notBlank = function(text) {
      return ($.trim(text).length > 0) ? text : false;
    },

    // Turn the dropdownTemplate into a jQuery object and fill in the variables.
    build = function (tpl, view) {
      var
        // Template for the dropdown
        buildOption = function($el) {
          var
            value = $el.val(),
            html = $el.html(),
            disabled = $el.attr('disabled') !== undefined
          ;
          return optionTemplate.replace('{{ value }}', value)
                              .replace('{{ current }}', (notBlank(value) === view.value && !disabled) ? 'dk_option_current' : '')
                              .replace('{{ disabled }}', (disabled) ? 'disabled' : '')
                              .replace('{{ text }}', !!$.trim(html) ? $.trim(html) : '&nbsp;' )
          ;
        },
        template  = tpl.replace('{{ id }}', view.id).replace('{{ label }}', view.label).replace('{{ tabindex }}', view.tabindex),
        // Holder of the dropdowns options
        options   = [],
        $dk,
        i,
        l,
        $option,
        oTemplate
      ;

      if (view.options && view.options.length) {
        for (i = 0, l = view.options.length; i < l; i++) {
          $option   = $(view.options[i]);

          if ($option.is('option')) {
            oTemplate = (i === 0 && $option.attr('selected') !== undefined && $option.attr('disabled') !== undefined) ? null : buildOption($option);
          } else if ($option.is('optgroup')) {
            oTemplate = optgroupTemplate.replace('{{ text }}', $option.attr('label') || '---').replace('{{ disabled }}', ($option.attr('disabled') !== undefined) ? ' disabled' : '');
            if ($(view.options[i]).children().length) {
              oTemplate += '<ul>';
              for (var j = 0, m = $(view.options[i]).children().length; j < m; j++ ) {
                var $optoption = $(view.options[i]).children().eq(j);
                oTemplate += buildOption($optoption);
              }
              oTemplate += '</ul>';
            }
            oTemplate += '</li>';

          }

          options[options.length] = oTemplate;
        }
      }

      $dk = $(template);
      $dk.find('.dk_options_inner').html(options.join(''));

      return $dk;
    }
  ;

  // Help prevent flashes of unstyled content
  // if (!ie6) {
  //   document.documentElement.className = document.documentElement.className + ' dk_fouc';
  // }

  // Called by using $('foo').dropkick();
  methods.init = function (settings) {
    settings = $.extend({}, defaults, settings);
    dropdownTemplate = settings.dropdownTemplate ? settings.dropdownTemplate : dropdownTemplate;
    optionTemplate = settings.optionTemplate ? settings.optionTemplate : optionTemplate;

    !initOnce.fired && initOnce.fire();

    return this.each(function () {
      var
        // The current <select> element
        $select = $(this),

        // Store a reference to the originally selected <option> element
        $original = $select.find(':selected').first(),

        // Save all of the <option> elements
        $options = $select.children(),

        // We store lots of great stuff using jQuery data
        data = $select.data('dropkick') || {},

        // This gets applied to the 'dk_container' element
        id = $select.attr('id') || $select.attr('name'),

        // Let's check if we have a fake styleing purpodes block wrapper
        $wrap = $select.parent('.dk_wrap'),

        // This gets updated to be equal to the longest <option> element
        width  = settings.width || $wrap.length ? $wrap.width() - ($select.innerWidth() - $select.width()) : $select.outerWidth(),

        // Check if we have a tabindex set or not set to 0
        tabindex  = $select.attr('tabindex') || '0',

        // Check if the select is disabled at the moment
        disabled = !!$select.attr('disabled'),

        // The completed dk_container element
        $dk = false,

        // The form relative to the select
        $form
      ;

      // Dont do anything if we've already setup dropkick on this element
      if (data.id) {
        return $select;
      }

      data.settings  = settings;
      data.tabindex  = tabindex;
      data.id        = id;
      data.$original = $original;
      data.$select   = $select;
      data.value     = notBlank($select.val()) || notBlank($original.attr('value'));
      data.label     = !!$original.text()?$original.text():'&nbsp;';
      data.options   = $options;
      data.theme     = settings.theme || 'default';

      // Build the dropdown HTML
      $dk = build(dropdownTemplate, data);

      // Make the dropdown fixed width if desired
     data.settings.autoWidth && $dk.find('.dk_toggle').css({ 'width' : width + 'px' });

     disabled && $dk.attr({disabled:'disabled',tabindex:-1});

      // Hide the <select> list and place our new one in front of it
      // $dk = $('div[id="dk_container_' + id + '"]').fadeIn(settings.startSpeed);
      // To permite cloning methods, will no more need to update the reference to $dk
      $select.before($dk).appendTo($dk.addClass('dk_theme_' + data.theme));

      if ($wrap.length) {
        $wrap.removeClass('dk_wrap');
        $dk.show();
      } else {
        $dk.fadeIn(settings.startSpeed);
      }

      // Save the updated $dk reference into our data object
      data.$dk = $dk;

      // Save the dropkick data onto the <select> element
      $select.data('dropkick', data);

      //Adds original select class to dk_container
      $dk.addClass($select.attr('class'));

      // Do the same for the dropdown, but add a few helpers
      $dk.data('dropkick', data);

      lists[lists.length] = $select;

      // Focus events
      $dk.on({
        'focus.dropkick': function() { $focused = !$dk.attr('disabled') && $dk.addClass('dk_focus'); },
        'blur.dropkick': function() { $dk.removeClass('dk_focus'); $focused = null; }
      });

      //If isMobile, triggers native selects while still mantains the styled dropkick
      isMobile && data.settings.nativeMobile && $dk.addClass('dk_mobile');

      // Sync to change events on the original <select> if requested
      if (data.settings.syncReverse) {
        $select.on('change', function (e) {
          var
            value = $select.val(),
            option = $('a[data-dk-dropdown-value="'+value+'"]', $dk),
            label = option.text()
          ;

          $dk.find('.dk_label').html(!!label?label:'&nbsp;');
          setCurrent(option.parent(), $dk, e);
          data.settings.change && data.settings.change.call($select, value, label);
        });
      }

      // Listen to a reset event to the form on the <select>
      $form = $select.attr('form') ? $('#'+$select.attr('form').replace(' ',', #')) : $select.closest('form');
      $form.length && $form.on('reset',function(){ $select.dropkick('reset'); });

      // [Issue #126] Validation do not fires in <select> is not (':visible')
      // setTimeout(function () {
      //   $select.hide();
      // }, 0);
    });
  };

  // Allows dynamic theme changes
  methods.theme = function (newTheme) {
    var
      data      = $(this).data('dropkick'),
      $dk       = data.$dk,
      oldtheme  = 'dk_theme_' + data.theme
    ;

    data.theme = newTheme || data.theme;
    $dk.removeClass(oldtheme).addClass('dk_theme_' + newTheme);
  };

  // Reset respective <select> and dropdown
  methods.reset = function (change) {
    return this.each(function () {
      var
        data      = $(this).data('dropkick'),
        $dk       = data.$dk,
        $original  = $('a[data-dk-dropdown-value="'+data.$original.attr('value')+'"]', $dk)
      ;

      data.$original.prop('selected',true);
      setCurrent($original.parent(), $dk);
      updateFields($original,$dk,!change);
    });
  };

  methods.setValue = function (value) {
    return this.each(function () {
      var
        $dk = $(this).data('dropkick').$dk,
        $option = $('.dk_options a[data-dk-dropdown-value="' + value + '"]',$dk)
      ;

      $option.length && updateFields($option, $dk) | setCurrent($option.parent(), $dk);
    });
  };

  // Reload / rebuild, in case of dynamic updates etc.
  // Credits to Jeremy (http://stackoverflow.com/users/1380047/jeremy-p)
  // Regenerating dk wrapper to update it's content
  // http://stackoverflow.com/a/13280151
  methods.refresh = function(change){
    return this.each(function () {
      var
        data          = $(this).data('dropkick'),
        $select       = data.$select,
        $dk           = data.$dk,
        $current,
        $dkopts
      ;
      // Update data options
      data.options  = $select.children();
      // Rebuild options list. filter options inner and replace
      $dkopts = build(dropdownTemplate, data).find('.dk_options_inner');
      $dk.find('.dk_options_inner').replaceWith($dkopts);
      // [Acemir] Check if the original selected option still exists in the DOM, if not, set a new original according to the new options
      if (!data.$original.parent().length) {
        data.$original = $select.find(':selected').first();
        data.label = data.$original.text();
      }
      // Re setCurrent option after refresh options list
      $current = $('a[data-dk-dropdown-value="'+$select.val()+'"]', $dk);
      setCurrent($current.parent(), $dk);
      updateFields($current,$dk,!change);
    });
  };

  methods.destroy = function() {
    return this.each(function(){
      var
        data          = $(this).data('dropkick')
      ;

      data.$dk.before(function(){
        return data.$select.removeData('dropkick');
      }).remove();
    });
  };

  methods.clone = function(init,newid,newnm) {
    var toReturn = [];

    $.each(this,function(i){
      var
        data          = $(this).data('dropkick'),
        settings      = data.settings,
        $clone        = data.$select.clone()
      ;

      if (settings.autoWidth) {
        settings.width = data.$dk.find('.dk_label').width();
      }

      newid && $clone.attr({id:newid}); // If provided, set a new 'id' attribute
      newnm && $clone.attr({name:newnm}); // If provided, set a new 'name' attribute

      $clone.removeData('dropkick');

      // If explicitly false, return only the cloned <select> element, else retrun a built clone
      if (init === false) {
        toReturn[i] = $clone[0];
      } else {
        $clone.dropkick(settings);
        toReturn[i] = $clone.data('dropkick').$dk[0];
      }

    });
  };

  methods.disable = function(bool) {
    return this.each(function(){
      var
        data          = $(this).data('dropkick'),
        $select       = data.$select,
        $dk           = data.$dk
      ;

      // If explicitly false, enable instead
      if (bool === false) {
        $select.removeAttr('disabled');
        $dk.removeAttr('disabled').attr({tabindex:data.tabindex});
      } else {
        $dk.hasClass('dk_open') && closeDropdown($dk);
        $select.attr({disabled:'disabled'});
        $dk.attr({disabled:'disabled',tabindex:-1});
      }
    });
  };

  // Expose the plugin
  $.fn.dropkick = function (method) {
    if (!ie6) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }
      if (typeof method === 'object' || ! method) {
        return methods.init.apply(this, arguments);
      }
    }
  };

}(jQuery, window, document));
