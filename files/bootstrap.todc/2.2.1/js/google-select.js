/* ===========================================================
 * google-select.js v1.0.0
 * http://todc.github.com/google-bootstrap
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CLASS DEFINITION
  * ================ */

  var GSelect = function (element) {
    var $el = $(element);
    $el.hide();

    var $container = $('<div>').addClass('btn-group');
    var $btn = $('<a>', { text: 'Select...'}).addClass('btn g-select');
    var $menu = $('<ul>').addClass('g-select-dropdown scrollable');

    $btn.addClass($el.attr('class'));

    $.each(element.options, function(i, opt) {
      var $menuItem = $('<li>', { text: opt.text });

      $menuItem.data('val', opt.value ? opt.value : opt.text);

      $menu.append( $menuItem );
    });

    $el.after($container);
    $container.append($btn);
    $btn.after($menu);

    $.each($menu.children(), function(i, menuItem) {
      $(menuItem).click(function() {
        $btn.text($(this).text());
        $el.val($(this).data('val')).change();
      })
    })

    $btn.gSelectDropdown();
  }

  GSelect.prototype = {

    constructor: GSelect

  , toggle: function (e) {
      
    }

  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.gSelect = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('gSelect')
      if (!data) $this.data('gSelect', (data = new GSelect(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.gSelect.Constructor = GSelect


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */
/*
  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })
*/

}(window.jQuery);