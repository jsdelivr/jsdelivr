jQuery.fn.slideNews = function(settings) {
    alert("test");
    settings = jQuery.extend({
        headline: "Shopping Cart",
        newsWidth: 74,
        newsSpeed: "normal"
    }, settings);
    return this.each(function(i){
        //jQuery(".messaging",this).css("display","none");
        //jQuery("a:eq(0)",this).attr("href","#skip_to_news_" + i);
        //jQuery("a:eq(4)",this).attr("name","skip_to_news_" + i);
        itemLength = jQuery(".item",this).length;
        newsContainerWidth = itemLength * settings.newsWidth;
        jQuery(".container",this).css("width",newsContainerWidth + "px");
        //jQuery(".news_items",this).prepend("<p class='view_all'>" + settings.headline + " [ " + itemLength + " total ] &nbsp;-&nbsp; <a href='#'>View All</a></p>");
        /*jQuery("a:eq(3)",this).click(function() {
            thisSlider = jQuery(this).parent().parent().parent();
            jQuery(".next",thisSlider).css("display","none");
            jQuery(".prev",thisSlider).css("display","none");
            jQuery(".container",thisSlider).css("left","0px");
            jQuery(".container",thisSlider).css("width",settings.newsWidth * 2 + "px");
           //jQuery(".view_all",thisSlider).css("display","none");
        });*/
        jQuery(".next",this).css("display","block");
        animating = false;
        jQuery(".next",this).click(function() {
            thisParent = jQuery(this).parent();
            if (animating == false) {
                animating = true;
                animateLeft = parseInt(jQuery(".container",thisParent).css("left")) - (settings.newsWidth * 1);
                if (animateLeft + parseInt(jQuery(".container",thisParent).css("width")) > 0) {
                    jQuery(".prev",thisParent).css("display","block");
                    jQuery(".container",thisParent).animate({left: animateLeft}, settings.newsSpeed, function() {
                        jQuery(this).css("left",animateLeft);
                        if (parseInt(jQuery(".container",thisParent).css("left")) + parseInt(jQuery(".container",thisParent).css("width")) <= settings.newsWidth * 2) {
                            jQuery(".next",thisParent).css("display","none");
                        }
                        animating = false;
                    });
                } else {
                    animating = false;
                }
                return false;
            }
        });
        jQuery(".prev",this).click(function() {
            thisParent = jQuery(this).parent();
            if (animating == false) {
                animating = true;
                animateLeft = parseInt(jQuery(".container",thisParent).css("left")) + (settings.newsWidth * 1);
                if ((animateLeft + parseInt(jQuery(".container",thisParent).css("width"))) <= parseInt(jQuery(".container",thisParent).css("width"))) {
                    jQuery(".next",thisParent).css("display","block");
                    jQuery(".container",thisParent).animate({left: animateLeft}, settings.newsSpeed, function() {
                        jQuery(this).css("left",animateLeft);
                        if (parseInt(jQuery(".container",thisParent).css("left")) == 0) {
                            jQuery(".prev",thisParent).css("display","none");
                        }
                        animating = false;
                    });
                } else {
                    animating = false;
                }
                return false;
            }
        });
    });
};