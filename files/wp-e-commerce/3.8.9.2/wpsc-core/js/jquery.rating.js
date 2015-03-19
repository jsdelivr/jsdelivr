/**
 * Star Rating - jQuery plugin
 *
 * Copyright (c) 2007 Wil Stuckey
 * Modified by John Resig
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a degradeable star rating interface out of a simple form structure.
 * Returns a modified jQuery object containing the new interface.
 *   
 * @example jQuery('form.rating').rating();
 * @cat plugin
 * @type jQuery 
 *
 */
jQuery.fn.rating = function(){
    return this.each(function(){
        var div = jQuery("<div/>").attr({
            title: this.title,
            'class': this.className
        }).insertAfter( this );
        product_id = jQuery("input.wpsc_rating_product_id", this).val();

        var selected_rating = jQuery("select option:selected", this).val();
        jQuery("select option", this).each(function(){
        		
						className = '';
						//console.log(jQuery(this).attr('selected'));
						if(this.value <= selected_rating) {
							className = 'selected';
						}
            div.append( "<div class='star'><a class='" + className + "' href='#" + this.value + "' title='Give it a " + this.value + " Star Rating' rel="+product_id+">" + this.value + "</a></div>" );
        });

        var averageRating = this.title,
            url = this.action,
            averageIndex = 1,
            averagePercent = 1;

        // hover events and focus events added
        var stars = div.find("div.star")
            .mouseover(drainFill).focus(drainFill)
            .mouseout(drainReset).blur(drainReset)
            .click(click);

        // cancel button events
        div.find("div.cancel")
            .mouseover(drainAdd).focus(drainAdd)
            .mouseout(resetRemove).blur(resetRemove)
            .click(click);

        reset();

        
        div.mouseout(function(){
           //console.log(this);
						selected_element = jQuery("div.star a:contains("+selected_rating+")", this).parent("div.star");
           //console.log(selected_element);
						previous_elements = jQuery(selected_element, this).prevAll();
						next_elements = jQuery(selected_element, this).nextAll();
						jQuery('a',previous_elements).addClass('selected');
						jQuery('a',next_elements).removeClass('selected');

				});

        function drainFill(){ drain(); fill(this); }
        function drainReset(){ drain(); reset(); }
        function resetRemove(){ reset(); jQuery(this).removeClass('on'); }
        function drainAdd(){ drain(); jQuery(this).addClass('on'); }

        function click(){
        		//console.log(jQuery(this));
        		product_id = jQuery('a',this).attr('rel');
        		rating = jQuery('a',this).html();

						form_values = "ajax=true&";
						form_values += "wpsc_ajax_action=rate_product&";
						form_values += "product_id="+product_id+"&";
						form_values += "product_rating="+rating;
						jQuery.post( 'index.php', form_values, function(returned_data) {
							eval(returned_data);
						});
        		selected_rating = rating;
        		
        		parent_element = jQuery(this).parent();
						previous_elements = jQuery(this, this_parent).prevAll();
						next_elements = jQuery(this, this_parent).nextAll();
						
						jQuery('a',previous_elements).addClass('selected');
						jQuery('a',next_elements).removeClass('selected');
						
        		//jQuery('div.star a', parent_element).removeClass('selected');
        		jQuery('a',this).addClass('selected');
            return false;
        }

        // fill to the current mouse position.
        function fill( elem ){
						this_parent = jQuery(elem).parent();
						previous_elements = jQuery(elem, this_parent).prevAll();
						next_elements = jQuery(elem, this_parent).nextAll();

						jQuery('a',previous_elements).addClass('selected');
						jQuery('a',next_elements).removeClass('selected');

						
        		//jQuery('div.star a', parent_element).removeClass('selected');
        		//jQuery('a',this).addClass('selected');

            //stars.find("a").css("width", "100%");
        }
    
        // drain all the stars.
        function drain(){
            stars.removeClass("on hover");
        }

        // Reset the stars to the default index.
        function reset(){
            //stars.lt(averageIndex).addClass("on");

            //var percent = averagePercent ? averagePercent * 10 : 0;
            //if (percent > 0)
            //    stars.eq(averageIndex).addClass("on").children("a").css("width", percent + "%");
        }
    }).remove();
};

// fix ie6 background flicker problem.
if ( jQuery.browser.msie == true )
    document.execCommand('BackgroundImageCache', false, true);
