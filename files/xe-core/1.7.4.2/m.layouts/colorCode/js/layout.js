jQuery(function($){
    var lang = $('.link .lang');
    var lang_lst = $('.lang .lang_lst')
    lang.click(function(){
        if(lang.hasClass('on')){
            lang.removeClass('on').addClass('off');
            lang_lst.hide();
        }else if(lang.hasClass('off')){
            lang.removeClass('off').addClass('on');
            lang_lst.show();
        }
    })    
}); // end of ready