/*!
 *         ,/
 *       ,'/
 *     ,' /
 *   ,'  /_____,
 * .'____    ,'
 *      /  ,'
 *     / ,'
 *    /,'
 *   /'
 *
 * Selectric Ϟ v1.6.5 - http://lcdsantos.github.io/jQuery-Selectric/
 *
 * Copyright (c) 2014 Leonardo Santos; Dual licensed: MIT/GPL
 *
 */

;(function ($) {
  var pluginName = 'selectric',
      // Replace diacritics
      _replaceDiacritics = function(s) {
        // /[\340-\346]/g, // a
        // /[\350-\353]/g, // e
        // /[\354-\357]/g, // i
        // /[\362-\370]/g, // o
        // /[\371-\374]/g, // u
        // /[\361]/g, // n
        // /[\347]/g, // c
        // /[\377]/g // y
        var k, d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' ');

        for (k in d) {
          if (!d.hasOwnProperty(k))
            return;
          s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));
        }
        return s;
      },
      init = function(element, options) {
        var options = $.extend({
              onOpen: $.noop,
              onClose: $.noop,
              onChange: $.noop,
              maxHeight: 300,
              keySearchTimeout: 500,
              arrowButtonMarkup: '<b class="button">&#x25be;</b>',
              disableOnMobile: true,
              openOnHover: false,
              expandToItemText: false,
              responsive: false,
              customClass: {
                prefix: 'selectric',
                postfixes: 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive',
                camelCase: true
              }
            }, options),
            customClass = options.customClass,
            postfixes = customClass.postfixes.split(' '),
            arrClasses = [],
            currPostfix;

        if (options.disableOnMobile && /android|ip(hone|od|ad)/i.test(navigator.userAgent)) return;

        // generate classNames for elements
        while (currPostfix = postfixes.shift())
          arrClasses.push(customClass.camelCase ?
            customClass.prefix + currPostfix :
            (customClass.prefix + currPostfix).replace(/([A-Z])/g, "-$&").toLowerCase()
          );

        var $original = $(element),
            _input = $('<input type="text" class="' + arrClasses[0] + '"/>'),
            $wrapper = $('<div class="' + customClass.prefix + '"><p class="label"/>' + options.arrowButtonMarkup + '</div>'),
            $items = $('<div class="' + arrClasses[1] + '" tabindex="-1"></div>'),
            $outerWrapper = $original.data(pluginName, true).wrap('<div>').parent().append($wrapper.add($items).add(_input)),
            selectItems = [],
            isOpen,
            $label = $('.label', $wrapper),
            $li,
            bindSufix = '.sl',
            $doc = $(document),
            $win = $(window),
            clickBind = 'click' + bindSufix,
            resetStr,
            classOpen = arrClasses[2],
            classDisabled = arrClasses[3],
            tempClass = arrClasses[4],
            selectStr = 'selected',
            selected,
            currValue,
            itemsHeight,
            closeTimer,
            finalWidth,
            optionsLength,
            inputEvt = 'oninput' in _input[0] ? 'input' : 'keyup';

        $original.wrap('<div class="' + arrClasses[5] + '">');

        function _populate() {
          var $options = $original.children();
              _$li = '<ul>',
              selectedIndex = $options.filter(':' + selectStr).index();

          currValue = (selected = ~selectedIndex ? selectedIndex : 0);

          if ( optionsLength = $options.length ) {
            // Build options markup
            $options.each(function(i){
              var $elm = $(this),
                  optionText = $elm.html(),
                  selectDisabled = $elm.prop('disabled');

              selectItems[i] = {
                value: $elm.val(),
                text: optionText,
                slug: _replaceDiacritics(optionText),
                disabled: selectDisabled
              };

              _$li += '<li class="' + (i == currValue ? selectStr : '') + (i == optionsLength - 1 ? ' last' : '') + (selectDisabled ? ' disabled' : '') + '">' + optionText + '</li>';
            });

            $items.html(_$li + '</ul>');

            $label.html(selectItems[currValue].text);
          }

          $wrapper.add($original).off(bindSufix);
          $outerWrapper.data(pluginName, true).prop('class', [arrClasses[6], $original.prop('class'), classDisabled, options.responsive ? arrClasses[8] : ''].join(' '));

          if ( !$original.prop('disabled') ){
            // Not disabled, so... Removing disabled class and bind hover
            $outerWrapper.removeClass(classDisabled).hover(function(){
              $(this).toggleClass(arrClasses[7]);
            });

            // Click on label and :focus on original select will open the options box
            options.openOnHover && $wrapper.on('mouseenter' + bindSufix, _open);

            // Toggle open/close
            $wrapper.on(clickBind, function(e){
              isOpen ? _close() : _open(e);
            });

            function _handleSystemKeys(e){
              // Tab / Enter / ESC
              if ( /^(9|13|27)$/.test(e.keyCode || e.which) ) {
                e.stopPropagation();
                _select(selected, true);
              }
            }

            _input.off().on({
              keypress: _handleSystemKeys,
              keydown: function(e){
                _handleSystemKeys(e);

                // Clear search
                clearTimeout(resetStr);
                resetStr = setTimeout(function(){
                  _input.val('');
                }, options.keySearchTimeout);

                var key = e.keyCode || e.which;

                // If it's a directional key
                // 37 => Left
                // 38 => Up
                // 39 => Right
                // 40 => Down
                if ( key > 36 && key < 41 )
                  _select( key < 39 ? previousEnabledItem() : nextEnabledItem() );
              },
              focusin: function(e){
                // Stupid, but necessary... Prevent the flicker when
                // focusing out and back again in the browser window
                _input.one('blur', function(){
                  _input.blur();
                });

                isOpen || _open(e);
              }
            }).on(inputEvt, function(){
              if ( _input.val().length ){
                // Search in select options
                $.each(selectItems, function(i, elm){
                  if ( RegExp('^' + _input.val(), 'i').test(elm.slug) && !elm.disabled ){
                    _select(i);
                    return false;
                  }
                });
              }
            });

            // Remove styles from items box
            // Fix incorrect height when refreshed is triggered with fewer options
            $li = $('li', $items.removeAttr('style')).click(function(){
              // The second parameter is to close the box after click
              _select($(this).index(), true);

              // Chrome doesn't close options box if select is wrapped with a label
              // We need to 'return false' to avoid that
              return false;
            });
          } else
            _input.prop('disabled', true);
        }

        _populate();

        function _calculateOptionsDimensions(){
          var visibleParent = $items.closest(':visible').children(':hidden'),
              maxHeight = options.maxHeight;

          // Calculate options box height
          // Set a temporary class on the hidden parent of the element
          visibleParent.addClass(tempClass);

          var itemsWidth = $items.outerWidth(),
              wrapperWidth = $wrapper.outerWidth() - (itemsWidth - $items.width());

          // Set the dimensions, minimum is wrapper width, expand for long items if option is true
          if ( !options.expandToItemText || wrapperWidth > itemsWidth )
            finalWidth = wrapperWidth;
          else {
            // Make sure the scrollbar width is included
            $items.css('overflow', 'scroll');

            // Set a really long width for $outerWrapper
            $outerWrapper.width(9e4);
            finalWidth = itemsWidth;
            // Set scroll bar to auto
            $items.css('overflow', '');
            $outerWrapper.width('');
          }

          $items.width(finalWidth).height() > maxHeight && $items.height(maxHeight);

          // Remove the temporary class
          visibleParent.removeClass(tempClass);
        }

        // Open the select options box
        function _open(e) {
          e.preventDefault();
          e.stopPropagation();

          _calculateOptionsDimensions();

          // Find any other opened instances of select and close it
          $('.' + classOpen).removeClass(classOpen);

          isOpen = true;
          itemsHeight = $items.outerHeight();

          _isInViewport();

          // Give dummy input focus
          _input.val('').is(':focus') || _input.focus();

          $doc.on(clickBind, _close);

          // Delay close effect when openOnHover is true
          if (options.openOnHover){
            clearTimeout(closeTimer);
            $outerWrapper.one('mouseleave' + bindSufix, function(){
              closeTimer = setTimeout(_close, 500);
            });
          }

          // Toggle options box visibility
          $outerWrapper.addClass(classOpen);
          _detectItemVisibility(selected);

          options.onOpen(element);
        }

        // Detect is the options box is inside the window
        function _isInViewport() {
          if (isOpen){
            _calculateOptionsDimensions();
            $items.css('top', ($outerWrapper.offset().top + $outerWrapper.outerHeight() + itemsHeight > $win.scrollTop() + $win.height()) ? -itemsHeight : '');
            setTimeout(_isInViewport, 100);
          }
        }

        // Close the select options box
        function _close(e) {
          if ( !e && currValue != selected ){
            var text = selectItems[selected].text;

            // Apply changed value to original select
            $original
              .prop('selectedIndex', currValue = selected)
              .data('value', text)
              .trigger('change', [text, currValue]);

            options.onChange(element);

            // Change label text
            $label.html(text);
          }

          // Remove click on document
          $doc.off(bindSufix);

          // Remove visible class to hide options box
          $outerWrapper.removeClass(classOpen);

          isOpen = false;

          options.onClose(element);
        }

        // Select option
        function _select(index, close) {
          // If element is disabled, can't select it
          if ( !selectItems[selected = index].disabled ){
            // If 'close' is false (default), the options box won't close after
            // each selected item, this is necessary for keyboard navigation
            $li.removeClass(selectStr).eq(index).addClass(selectStr);
            _detectItemVisibility(index);
            close && _close();
          }
        }

        // Detect if currently selected option is visible and scroll the options box to show it
        function _detectItemVisibility(index) {
          var liHeight = $li.eq(index).outerHeight(),
              liTop = $li[index].offsetTop,
              itemsScrollTop = $items.scrollTop(),
              scrollT = liTop + liHeight * 2;

          $items.scrollTop(
            scrollT > itemsScrollTop + itemsHeight ? scrollT - itemsHeight :
              liTop - liHeight < itemsScrollTop ? liTop - liHeight :
                itemsScrollTop
          );
        }

        function nextEnabledItem(next) {
          if ( selectItems[ next = (selected + 1) % optionsLength ].disabled )
            while ( selectItems[ next = (next + 1) % optionsLength ].disabled ){}

          return next;
        }

        function previousEnabledItem(previous) {
          if ( selectItems[ previous = (selected > 0 ? selected : optionsLength) - 1 ].disabled )
            while ( selectItems[ previous = (previous > 0 ? previous : optionsLength) - 1 ].disabled ){}

          return previous;
        }

        $original.on({
          refresh: _populate,
          destroy: function() {
            // Unbind and remove
            $items.add($wrapper).add(_input).remove();
            $original.removeData(pluginName).removeData('value').off(bindSufix + ' refresh destroy open close').unwrap().unwrap();
          },
          open: _open,
          close: _close
        });
      };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args, options) {
    return this.each(function() {
      if ( !$(this).data(pluginName ))
        init(this, args || options);
      else if ( ''+args === args )
        $(this).trigger(args);
    });
  };
}(jQuery));