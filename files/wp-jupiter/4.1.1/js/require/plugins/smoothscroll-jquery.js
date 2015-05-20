define(['jquery', 'window'], function($, window) {


    if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;

    var time = 300;
    var distance = 55;

    function wheel(event) {
        if (event.wheelDelta) delta = event.wheelDelta / 120;
        else if (event.detail) delta = -event.detail / 3;

        handle();

        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
    }

    function handle() {

        $('html, body').stop().animate({
            scrollTop: $(window).scrollTop() - (distance * delta)
        }, time);
    }


    $(document).keydown(function (e) {

        switch (e.which) {
            //up
            case 38:
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(window).scrollTop() - distance
                }, time);
                break;

                //down
            case 40:
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(window).scrollTop() + distance
                }, time);
                break;
        }
    });  

});