(function ($){ 
    $.fn.jVanilla = function (options) 
    { 
        var defaults = {
            speed               : 50,
            animation           : 'fading',
            eventType           : 'hover',
            delay               : 100,
            isHoverClickable    : true,
            isLastRightAlign    : true
        }; 
        var settings = $.extend(defaults, options);
        return this.each(function () {
            $('body').addClass('js-enabled');
            $(this).find('li a').each(function(i, obj){
                if ($(obj).next('ul').length > 0) {
                    if (settings.isLastRightAlign) {
                        if ($(obj).parent().next().length == 0) {
                            offsetRight = ($(obj).offset().left)+($(obj).outerWidth())-$(obj).next('ul').outerWidth();
                            $(obj).next('ul').css({
                                'left' : offsetRight
                            });
                        };
                    };
                    $(obj).next('ul').mouseenter(function(){
                        $(obj).next('ul').fadeIn(settings.speed);
                    }).mouseleave(function(){
                        $(obj).next('ul').fadeOut(settings.speed);
                    });
                    if(settings.eventType == 'hover') {
                        if(!settings.isHoverClickable){
                            $(obj).css({
                                    'cursor' : 'default' 
                                });
                            $(obj).click(function(){
                                return false;
                            });
                        }
                        switch(settings.animation){
                            case 'fading': 
                                $(obj).parent().mouseenter(function(e) {
                                    $(obj).parents('ul').find('ul').fadeOut(settings.speed);
                                    if ($(obj).next('ul').css('display')!=='block') {
                                        $(obj).next('ul').stop(true, true).fadeIn(settings.speed);
                                    };
                                }).mouseleave(function() {
                                    $(obj).parents('ul').find('ul').fadeOut(settings.speed);
                                });
                            break;
                            case 'sliding':
                                $(obj).parent().mouseenter(function(e) {
                                    $(obj).parents('ul').find('ul').fadeOut(settings.speed);
                                    if ($(obj).next('ul').css('display')!=='block') {
                                        $(obj).next('ul').stop(true, true).slideDown(settings.speed);
                                    };
                                }).mouseleave(function() {
                                    $(obj).next('ul').stop(true, true).slideUp(settings.speed);
                                });
                            break;
                        }
                    }else if(settings.eventType == 'click') {
                        $(obj).parent().mouseleave(function() {
                            var t2 = window.setTimeout(function(){
                                $(obj).parents('ul').find('ul').fadeOut(settings.speed);
                            },settings.delay);
                        });
                        switch(settings.animation){
                            case 'fading': 
                                $(obj).click(function() {
                                    $(obj).parents('ul').find('ul').fadeOut();
                                    if ($(obj).next('ul').css('display')!='block') {
                                        $(obj).next('ul').stop(true, true).fadeIn(settings.speed);
                                    };
                                    return false;
                                });
                            break;
                            case 'sliding':
                                $(obj).click(function() {
                                    $(obj).parents('ul').find('ul').slideUp();
                                    if ($(obj).next('ul').css('display')!='block') {
                                        $(obj).next('ul').stop(true, true).slideDown(settings.speed);
                                    };
                                    return false;
                                });
                            break;
                        };
                    };
                };
            });
  
        }); 
    }; 
})(jQuery);


