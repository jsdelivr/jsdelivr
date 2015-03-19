(function($) {

    $.fn.dynamo = function() {

        return this.each(function(i, v) {
            var v = $(v);
            var delay = parseInt(v.attr('data-delay')) || 3000;
            var speed = parseInt(v.attr('data-speed')) || 350;

            var lines = v.attr('data-lines').split(v.attr('data-delimiter') || ',');

            // wrap the original contents in a span
            v.html($('<span></span>').text(v.text()));

            // grab the width of the span
            var max = v.find('span:eq(0)').width();

            // for each item in data-lines, create a span with item as its content
            // compare the width of this span with the max
            for (var k in lines) {
                var span = $('<span></span>').text(lines[k]);
                v.append(span);
                max = Math.max(max, span.width());
            }

            // replace all the spans with inline-div's
            v.find('span').each(function(i, ele) {
                
                var s = $(ele).remove();
                var d = $('<div></div>').text(s.text());
                d.width(max);
                v.append(d);
            });

            // set the height of the dynamo container
            var height = v.find('>:first-child').height();

            // style
            v
                .width(max)
                .height(height)
                .css({
                    'display' : 'inline-block',
                    'position' : 'relative', 
                    'overflow' : 'hidden', 
                    'vertical-align' : 'bottom',
                    'text-align' : 'left' 
                });

            // manually center it if we need to
            if (v.attr('data-center'))
                v.css('text-align', 'center');

            // now, animate it
            var transition = function() {
                v.find('div:first').slideUp(speed, function() { 
                    v.append($(this).show());
                });
            };

            setInterval(transition, delay);
        });
    };
    
    // automatically initiate cycles on elements of class 'dynamo'
    $('.dynamo').dynamo();

})(jQuery);​