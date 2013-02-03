/* a few nice jquery-ui things for Obviel forms */

(function($, obviel) {
    // pretty jQuery UI buttons
    $(document).bind('button-created.obviel', function(ev) {
        $(ev.target).button();
    });

    $(document).bind('button-updated.obviel', function(ev) {
        $(ev.target).button('refresh');
    });

    $(document).bind('render-done.obviel', function (ev) {
        $('input[type="submit"]', ev.view.el).button();
        $('input[type="button"]', ev.view.el).button();
        $('button', ev.view.el).button();
    });

})(jQuery, obviel);
