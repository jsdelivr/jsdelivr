/*global jQuery:true, templateUrl:true,
  alert:true , browser:true, document:true, appUrl:true,
  window:true
*/

/* depends on Obviel and jGrowl */

(function($, obviel) {

    obviel.view({
        iface: 'message',
        ephemeral: true,
        render: function() {
            var m = {
                life: this.obj.life || 7000,
                theme: getMessageTheme(this.obj),
                sticky: this.obj.sticky || false
            };
            $.jGrowl(this.obj.message, m);
        }
    });
    
    var getMessageTheme = function(message) {
        var theme = null;
        if (message.theme !== undefined) {
            theme = message.theme;
        } else {
            if (message.status !== undefined) {
                theme = 'jgrowl-' + message.status;
            } else {
                theme = 'jgrowl-feedback';
            }
        }
        return theme;
    };
})(jQuery, obviel);
