/**
 * Toolbox functions.
 *
 * @version 1.0
 * @author Frank Verhoeven <info@frank-verhoeven.com>
 */
(function($) {

    $(document).ready(function() {
        $('.fvch-toolbox').removeClass('fvch-hide-if-no-js');

        $('.fvch-toolbox-icon-select').click(function() {
            var element = document.getElementById( $(this).parents('.fvch-codeblock').attr('id').replace('codeblock', 'code') );

            if (document.body.createTextRange) { // ms
                var range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) { // moz, opera, webkit
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    });

})(jQuery);



