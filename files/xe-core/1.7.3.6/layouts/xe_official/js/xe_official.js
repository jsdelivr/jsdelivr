jQuery(function($){
	// Language Select
	$('.language>.toggle').click(function(){
		$('.selectLang').toggle();
	});
    // Global Navigation Bar
    var gMenu = $('.header>div.gnb');
    var gItem = gMenu.find('>ul>li');
    var ggItem = gMenu.find('>ul>li>ul>li');
    var lastEvent = null;
    gItem.find('>ul').hide();
	gItem.filter(':first').addClass('first');
    function gMenuToggle(){
        var t = $(this);
        if (t.next('ul').is(':hidden') || t.next('ul').length == 0) {
            gItem.find('>ul').slideUp(200);
            gItem.find('a').removeClass('hover');
            t.next('ul').slideDown(200);
            t.addClass('hover');            
        }; 
    };
    function gMenuOut(){
        gItem.find('ul').slideUp(200);
        gItem.find('a').removeClass('hover');
    };
    gItem.find('>a').mouseover(gMenuToggle).focus(gMenuToggle);
    gItem.mouseleave(gMenuOut);
});