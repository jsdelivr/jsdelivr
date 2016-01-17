$(document).ready(function(){

    //CREATE PAGE METHODS
    var page = {
        init: function() {
            this.buttons = $('#main-nav a');

            this.activateNav();
            this.disableDemoButtons();
        },

        activateNav: function() {
            var that = this;

            this.buttons.click(function(e) {
                e.preventDefault();
                var currentButton = $(e.currentTarget);
                var buttonId = currentButton.attr('href');

                //DESELECT ALL BUTTONS & SELECT CURRRENT ONE
                that.buttons.parent().removeClass('selected');
                currentButton.parent().addClass('selected');

                //ANIMATE SCROLL EFFECT
                $("html, body").animate({
                    scrollTop: $(buttonId).offset().top - 100
                }, 'slow');

            });
        },

        disableDemoButtons: function() {
            $('.showcase [href^=#]').on('click', function(e) {
                e.preventDefault();
            });
        }
    };

    //INITIALIZE PAGE
    page.init();
});