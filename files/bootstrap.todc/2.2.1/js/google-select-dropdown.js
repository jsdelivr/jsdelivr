/* ============================================================
 * google-select-dropdown.js v1.0.0
 * ============================================================
 * This is currently the same as bootstrap-dropdown.js but I'm
 * using a separate definition because I suspect it'll need to
 * change.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="g-select-dropdown"]'
    , GSelectDropdown = function (element) {
        var $el = $(element).on('click.g-select-dropdown.data-api', this.toggle)
        $('html').on('click.g-select-dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  GSelectDropdown.prototype = {

    constructor: GSelectDropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.gSelectDropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('g-select-dropdown')
      if (!data) $this.data('g-select-dropdown', (data = new GSelectDropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.gSelectDropdown.Constructor = GSelectDropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.g-select-dropdown.data-api', clearMenus)
    $('body')
      .on('click.g-select-dropdown', '.g-select-dropdown form', function (e) { e.stopPropagation() })
      .on('click.g-select-dropdown.data-api', toggle, GSelectDropdown.prototype.toggle)
  })

}(window.jQuery);