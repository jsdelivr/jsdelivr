// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {
  $(function(){

    Holder.add_theme("new", { background: "#AC92EC", foreground: "#fff", size: 12 }).run()

    $('.tooltip-demo').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    })

    $('.checkbox input').iCheck({
        checkboxClass: 'icheckbox_flat',
        increaseArea: '20%'
    })

    $('.radio input').iCheck({
        radioClass: 'iradio_flat',
        increaseArea: '20%'
    })

    $("#accordion1").collapse({
      accordion: true,
      open: function() {
        this.addClass("open");
        this.css({ height: this.children().outerHeight() });
      },
      close: function() {
        this.css({ height: "0" });
        this.removeClass("open");
      }
    });

    $("#accordion2").collapse({
      accordion: true,
      open: function() {
        this.addClass("open");
        this.css({ height: this.children().outerHeight() });
      },
      close: function() {
        this.css({ height: "0" });
        this.removeClass("open");
      }
    });
    
  })
}(window.jQuery)

