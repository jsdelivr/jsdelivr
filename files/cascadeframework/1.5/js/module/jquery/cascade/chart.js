Cascade.drawchart = function(selector, heightquotient, data, options) {
    $(selector).css({
        'width': '100%',
        'height': $(selector).width() / heightquotient
    });
    $.plot(selector, data, options);
    $(window).resize(function() {
        $(selector).css({
            'height': $(selector).width() / heightquotient
        });
        $.plot($(selector), data, options);
    });
}