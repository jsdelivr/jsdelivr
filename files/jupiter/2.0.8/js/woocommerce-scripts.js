jQuery.exists = function (selector) {
    return (jQuery(selector).length > 0);
};
jQuery(document).ready(function() {
jQuery(window).load(function() {

if(jQuery.exists('.mk-products')) {
jQuery('.mk-products').each(function() {

if(!jQuery(this).parents('.mk-woocommerce-carousel').length) {
	        $woo_container = jQuery(this);
            $container_item = '.mk-products .product';

            $woo_container.isotope({
                itemSelector: $container_item,
                masonry: {
                columnWidth: 1
                } 

            });

            jQuery(window)
            .on("debouncedresize", function (event) {
            $woo_container.isotope('reLayout');
        });

 jQuery('.mk-products > .product')
                .each(function (i) {
                jQuery(this)
                    .delay(i * 100)
                    .animate({
                    'opacity': 1
                }, 'fast');

            })
                .promise()
                .done(function () {
                setTimeout(function () {
                    $woo_container.isotope('reLayout');
                }, 100);
            });
}
});
}


jQuery('.mk-woocommerce-orientation a').on('click', function() {
        jQuery(this).siblings().removeClass('current').end().addClass('current');
        if(jQuery(this).hasClass('mk-grid-view')) {
            jQuery('.mk-products').removeClass('mk-woocommerce-list').addClass('mk-woocommerce-grid');
          
        } else {
            jQuery('.mk-products').removeClass('mk-woocommerce-grid').addClass('mk-woocommerce-list');
        }
        setTimeout(function () {
                    $woo_container.isotope('reLayout');
         }, 50);
        return false;
    });

});
});