/**
 * Created by Mike Roberto on 15/03/14.
 * https://www.PricePlow.com/api
 * contact@priceplow.com
 */
jQuery( document ).ready(function($) {
    // First, check if they want us to load the CSS file
    if(priceplow_settings.load_css) {
	var cssId = 'priceplow-css';
	if (!document.getElementById(cssId)) {
	    var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = cssId;
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = 'https://www.priceplow.com/wp-plugin/css/priceplow.min.css';
	    link.media = 'all';
	    head.appendChild(link);
	}
    }
    var api_url = priceplow_settings.api_url_prefix; // This is the base URL, we'll add to it
    $.each( priceplow_settings, function(widget_iter, this_widget_config ) {
        // Take a look at this_widget_config's settings and put together an API URL to call
        var widget_title_fallback = "Featured Products"; // We'll use this if no title was provided.
        switch(this_widget_config.feature_type) {
            case "brand":
                // Only add the brand if we actually have a brand_id to show.
                //  Otherwise, we'll default back to showing popular products
                if(this_widget_config.brand_id) {
                    // If this is a bad brand_id or not an integer, API will throw error
                    api_url += "brands/" + this_widget_config.brand_id + "/products/popular";
                    widget_title_fallback = "Related Products";
                } else {
                    console.log("PricePlow Error: Featured Brand requested, no brand_id given. Defaulting to top products.");
                    api_url += "products/popular";
                }
                break;
            case "category":
                // Same rules as brands apply to categories
                if(this_widget_config.category_id) {
                    // If this is a bad category_id or not an integer, API will throw error
                    api_url += "categories/" + this_widget_config.category_id + "/products/popular";
                    widget_title_fallback = "Related Products";
                } else {
                    console.log("PricePlow Error: Featured Category requested, no category_id given. Defaulting to top products.");
                    api_url += "products/popular";
                }
                break;
            case "new_products":
                api_url += "products/newest";
                widget_title_fallback = "New Products";
                break;
            case "product":
                // A different display case, but simple to build the URL.  Need a product_id.
                if(this_widget_config.product_id) {
                    api_url += "products/" + this_widget_config.product_id;
                    widget_title_fallback = "Featured Product:";
                } else {
                    console.log("PricePlow Error: Featured Product requested, no product_id given. Defaulting to top products.");
                    api_url += "products/popular";
                }
                break;
            case "top_products":
            default:  // We default to the popular products.
                priceplow_settings[widget_iter].feature_type = "top_products";
                this_widget_config.feature_type = "top_products";
                api_url += "products/popular";
                break;
        }

        // Hacky code here. Create a boolean that will specify when our first API param is made.
        //  So that we know to start adding & characters instead of ?
        var have_api_url_param = false;

        // If they requested a specific number, AND they're either not requesting a product or didn't provide an ID, specify a limit
        // Note: This REQUIRES a valid int from 1 to 25. A bad one will return an error.
        //  I could check for int here, but that's wasteful IMHO.
        if (this_widget_config.items_to_show && ((this_widget_config.feature_type != 'product') || (!this_widget_config.product_id))) {
            if(!have_api_url_param) {
                api_url += "?";
                have_api_url_param = true;
            } else {
                api_url += "&";
            }
            api_url += "count=" + this_widget_config.items_to_show;
        }

        if(priceplow_settings.api_key) {
            if(!have_api_url_param) {
                api_url += "?";
                have_api_url_param = true;
            } else {
                api_url += "&";
            }
            api_url += "api_key=" + priceplow_settings.api_key;
        }

        // API call is now ready!  Call it with getJSON

        var jqxhr = $.getJSON( api_url, function() {
            // console.log( "success" );
        })
            .done(function( data ) { // We have good JSON data loaded.  Work on it.
                var my_html = ''; // Populate this
                // First, make a title.  If we don't have a title, get the invented one
                if(this_widget_config.widget_title) {
                    my_html += '<h3 id="priceplow-widget">'+this_widget_config.widget_title+'</h3>';
                } else {
                    my_html += '<h3 id="priceplow-widget">'+widget_title_fallback+'</h3>';
                }
                if(this_widget_config.feature_type == "product" && this_widget_config.product_id) {
                    // Build a featured "single" product widget, which is different
                    my_html += get_single_product_content(data, priceplow_settings);
                } else {
                    // Everything else goes to the multi-widget maker
                    my_html += get_multi_product_content(data, priceplow_settings);
                }

                my_html += get_powered_by_html(priceplow_settings);

                // If they don't provide a good div_identifier, we're most likely SOL. Default to priceplow-widget
                var div_id_to_populate = ''
                if(this_widget_config.div_identifier) {
                    div_id_to_populate = this_widget_config.div_identifier;
                } else {
                    // Shot in the dark here...
                    div_id_to_populate = "priceplow-widget";
                }
                $("#"+div_id_to_populate).append($(my_html));
            })

            // This shouldn't happen because our API makes beautiful JSON ;)
            .fail(function() {
                console.log( "ERROR in getJSON" );
            })
    });

    /*
     * get_multi_product_content returns the HTML created for a featured widget that
     *  contains multiple products.  Requires the data array (iterate through each product)
     */
    function get_multi_product_content(data, priceplow_settings) {
        var multi_html = '';
        $.each( data, function( product_iter, this_product ) {
            var this_product_iteration = product_iter + 1; // Our div classes want 1-indexed stuff
            var full_name = this_product.brand.name + " " + this_product.name;
            multi_html += '<div class="priceplow-product-container priceplow-product-'+this_product_iteration+'">';
            // This link is gonna get a bit wild.  It's an icon inside of a link.
            var this_link_anchor = '<i class="priceplow-product-image" style="background-image: url('+this_product.large_image_url+');"></i>';
            if(priceplow_settings.link_to_priceplow) {
                // If we're linking to PricePlow, add the compare prices span / link dealio
                this_link_anchor += '<span class="priceplow-compare-prices-button">Compare Prices</span>';
            }
            var this_link_title = 'Click here to Compare Prices on ' + full_name;
            multi_html += build_link(this_product.url, this_link_anchor, this_link_title, priceplow_settings, true);
            // Hoverbox time!
            multi_html += '<div class="priceplow-hoverbox">';
            multi_html += '<div class="priceplow-hover-image-container">';
            this_link_anchor = '<img src="'+this_product.thumbnail_image_url+'" alt="'+full_name+'"/>'; // To be used as our anchor
            // TODO - if/then link_to_priceplow... link to store if false
            if(priceplow_settings.link_to_priceplow) {
                this_link_title = 'Click here to Compare Prices on ' + full_name;
                multi_html += build_link(this_product.url, this_link_anchor, this_link_title, priceplow_settings, true);
            } else {
                // TODO - Check if we *have* a url to link to
                if(this_product.lowest_prices[0].url) {
                    this_link_title = 'Click here to go to the best deal on ' + full_name;
                    multi_html += build_link(this_product.lowest_prices[0].url, this_link_anchor, this_link_title, priceplow_settings, false);
                }
            }
              
            multi_html += '</div>'; //priceplow-hover-image-container
            // Data container time
            multi_html += '<div class="priceplow-hover-data-container">';
            this_link_title = 'Read about ' + full_name + ' and compare prices on PricePlow';
            this_link_anchor = full_name;
            multi_html += '<div class="priceplow-hover-product-name">'+build_link(this_product.url, this_link_anchor, this_link_title, priceplow_settings, true) + '</div>';
            // To describe a single product, remove 's' at end of category
            var singular_category = this_product.category.name.replace(/s\b/, "");
            multi_html += '<div class="priceplow-hover-product-category">('+singular_category+')</div>';
            // Now build a list of each size's lowest price
            $.each(this_product.lowest_prices, function (this_size_iter, this_size_set) {
                multi_html += '<div class="priceplow-hover-product-size-set">';
                multi_html += '<div class="priceplow-hover-product-sizeunit">';
                multi_html += this_size_set.size;
                multi_html += '</div>'; // priceplow-hover-product-sizeunit
                multi_html += '<div class="priceplow-hover-product-price">';
                this_link_title = 'Go to the lowest-priced store for ' + full_name + ' ' + this_size_set.size;
                this_link_anchor = '$'+this_size_set.price;
                multi_html += build_link(this_size_set.url, this_link_anchor, this_link_title, priceplow_settings, false);
                multi_html += '</div>'; // priceplow-hover-product-price
                multi_html += '</div>'; // priceplow-hover-product-size-set
            });
            // Build a nice little compare prices button if we're linking to priceplow
            if(priceplow_settings.link_to_priceplow) {
                multi_html += '<div class="priceplow-hover-compare-container">' + build_link(this_product.url, "See all stores", "Click here to see all stores and compare prices", priceplow_settings, true, "priceplow-hover-compare-prices-button") + '</div>';
            }
            multi_html += get_powered_by_html(priceplow_settings);
            multi_html += '</div>'; //priceplow-hover-data-container
            multi_html += '</div>'; // priceplow-hoverbox

            // The main product name / link that goes under each image box.
            this_link_anchor = full_name;
            this_link_title = 'Click here to Compare Prices on ' + full_name;
            multi_html += '<div class="priceplow-product-name">'+build_link(this_product.url, this_link_anchor, this_link_title, priceplow_settings, true)+'</div>';
            this_link_anchor = '$' + this_product.lowest_prices[0].price;
            this_link_title = 'Click here to See ' + full_name + ' at the best priced store';
            multi_html += '<span class="priceplow-product-price">From ' + build_link(this_product.lowest_prices[0].price, this_link_anchor, this_link_title, priceplow_settings, false) + '</span>';
            multi_html += '</div>'; // priceplow-product-container
        });
        return multi_html;
    }

    /*
     * get_single_product_content returns the HTML created for a single featured product
     *  Requires the data array (of store prices)
     * NOTE: This function uses data that requires an PRIVILEGED API Key.  By Default, we do not provide
     *  this data to the public.  If you would like to use this function, email us at contact@priceplow.com
     */
    function get_single_product_content(product_data, priceplow_settings) {
        var single_html = '';
        single_html += '<div class="priceplow-product-price-comparison-container">';
        single_html += '<div class="priceplow-product-price-comparison-top-container">';
        single_html += build_featured_product_image_html(product_data, "left", priceplow_settings, null, true);
        single_html += '<div class="priceplow-featured-product-summary">';
        single_html += '<h4 class="priceplow-product-name-title">' + product_data.brand.name + " " + product_data.name + '</h4>';
        single_html += '<div class="priceplow-product-summary-sizes">'; // The header row
        single_html += '<div class="priceplow-product-summary-row priceplow-even">';
        single_html += '<div class="priceplow-product-summary-size priceplow-heading">Sizes:</div>';
        single_html += '<div class="priceplow-product-summary-size-price priceplow-heading">Best Price:</div>';
        single_html += '</div>'; //priceplow-product-summary-row (the header row)
        var size_iter = 1; // This will be used to keep track of even/odd
        $.each(product_data.prices, function( this_size, this_size_set ) {
            // Add a row if we have some valid data
            if(this_size_set[0]) {
                var even_odd = "even";
                if(0 == size_iter % 2) {
                    even_odd = "even";
                } else {
                    even_odd = "odd";
                }
                single_html += '<div class="priceplow-product-summary-row priceplow-'+even_odd+'">';
                single_html += '<div class="priceplow-product-summary-size">'+this_size+'</div>';
                var this_link_title = 'Click here for the best price on any '+this_size+ ' product';
                var this_link_anchor = '$' + this_size_set[0][0].price;
                single_html += '<div class="priceplow-product-summary-size-price">' + build_link(this_size_set[0][0].url, this_link_anchor, this_link_title, priceplow_settings, false) + '</div>';
                single_html += '</div>'; // product-summary-row
                size_iter++;
            }
        });
        single_html += '</div>'; // priceplow-product-summary-sizes
        single_html += '<div class="priceplow-product-summary-meta">';
        single_html += '<div class="priceplow-product-summary-row">';
        single_html += '<div class="priceplow-product-summary-category">Category:</div>';
        var this_link_title = 'Click here to read more about ' + product_data.category.name + ' at PricePlow';
        var this_link_anchor = product_data.category.name;
        single_html += '<div class="priceplow-product-summary-category-name">'+ build_link(product_data.category.url, this_link_anchor, this_link_title, priceplow_settings, true) +'</div>';
        single_html += '</div>'; // priceplow-product-summary-category
        single_html += '<div class="priceplow-product-summary-row priceplow-product-summary-brand-row">';
        single_html += '<div class="priceplow-product-summary-brand">Brand:</div>';
        this_link_title = 'Click here to see all ' + product_data.brand.name + ' products at PricePlow';
        this_link_anchor = product_data.brand.name;
        single_html += '<div class="priceplow-product-summary-brand-name">' + build_link(product_data.brand.url, this_link_anchor, this_link_title, priceplow_settings, true) + '</div>';
        single_html += '</div>'; // priceplow-product-summary-row priceplow-product-summary-brand-row
        single_html += '</div>'; // product-summary-meta
        single_html += '</div>'; // priceplow-featured-product-summary

        single_html += '</div>'; // priceplow-product-price-comparison-top-container
        single_html += '<div class="priceplow-product-price-comparison-data">';
        single_html += build_single_product_price_comparison_html(product_data, priceplow_settings);
        single_html += '</div>'; // priceplow-product-price-comparison-data
        single_html += '</div>'; // priceplow-product-price-comparison-top-container
        single_html += '</div>'; // priceplow-product-price-comparison-container
        return single_html;
    }

    /*
     * build_featured_product_image_html does just that - takes some info and builds a featured image.
     * This requires product data that is only returned to privileged API users
     *  - align should be "left" or "right" but maybe even "center".
     *  - caption is the caption string.  If not provided, we make one up
     *  - include_caption is a boolean on whether or not to include it
     */
    function build_featured_product_image_html(product_data, align, priceplow_settings, caption, include_caption) {
        var image_html = '';
        var full_name = product_data.brand.name + ' ' + product_data.name;
        // For the image, we'll make one of two outgoing links:
        //   either to PricePlow, if the user wants (or if no stores have it in stock),
        //    otherwise it will go to the cheapest store for a sale
        var this_title = 'See the best-priced deal on ' + full_name;
        var this_anchor = '<img title="'+this_title+'" src="' + product_data.large_image_url + '" alt="'+full_name+'"/>';
        var this_image_link = ''; // we'll fill this
        var outgoing_url = '';
        var creating_priceplow_link = false; // To be used if and only if we're sending user to the PP *SITE*
        var first_outgoing_url = get_first_outgoing_url(product_data);
        if(priceplow_settings.link_to_priceplow) {
            outgoing_url = product_data.url;
            creating_priceplow_link = true;
            this_image_link = build_link(outgoing_url, this_anchor, this_title, priceplow_settings, creating_priceplow_link);
        } else {
            // They don't want to go to PricePlow.  Send them to the best deal, but first check that we HAVE one to send to
            creating_priceplow_link = false;
            if(first_outgoing_url) {
                this_image_link = build_link(first_outgoing_url, this_anchor, this_title, priceplow_settings, creating_priceplow_link);
            } else {
                // Don't have a good deal to send them to.  Just display the anchor (which is the image)
                this_image_link = this_anchor;
            }

        }
        image_html += '<div class="priceplow-featured-product-image priceplow-align-' + align + '">';
        image_html += this_image_link;


        // Caption time
        if(include_caption) {
            var image_caption = ''; // Put it here
            if(!caption) {
                if(first_outgoing_url) {
                    image_caption = "Click here for the best deal on " + full_name;
                } else {
                    image_caption = full_name;
                }
            }
            image_html += '<p class="wp-caption-text">';

            image_html += build_link(outgoing_url, image_caption, this_title, priceplow_settings, creating_priceplow_link);
            image_html += '</p>';
        }

        image_html += '</div>'; // priceplow-featured-product-image
        return image_html;
    }

    /*
     * This function builds single product price comparisons and returns the HTML
     * NOTE: This function uses data that requires an PRIVILEGED API Key.  By Default, we do not provide
     *  this data to the public.  If you would like to use this function, email us at contact@priceplow.com
     */
    function build_single_product_price_comparison_html(product_data, priceplow_settings) {
        var compare_html = '<div class="priceplow-tabs">';
        var real_iter = 1;
        var checked = "checked"; // Build tabs using radio buttons. First one gets checked
        $.each( product_data.prices, function(this_size, this_size_set ) {
            compare_html += '<div class="priceplow-tab">';
            if(real_iter == 1) {
                checked = " checked";
            } else {
                checked = "";
            }
            compare_html += '<input class="priceplow-tab-radio" type="radio" id="priceplow-tab-' + real_iter + '" name="priceplow-tab-group-1"'+checked+'>';
            compare_html += '<label class="priceplow-tab-label" for="priceplow-tab-'+real_iter+'">'+this_size+'</label>';
            compare_html += '<div class="priceplow-tab-panel">';
            compare_html += '<div class="priceplow-tab-content">';
            $.each( this_size_set, function (store_iter, this_store_set) {
                var even_odd = "even";
                if(0 == store_iter % 2) {
                    // even
                    even_odd = "even";
                } else {
                    even_odd = "odd";
                }
                compare_html += '<div class="priceplow-store-container priceplow-'+even_odd+'">';
                var row_html_array = Array();  // An array where we'll store all the links
                var this_stores_prices = Array();  // Hold the prices here to do a min/max on them for display purposes
                $.each( this_store_set, function (store_set_iter, this_product_item) {
                    var sizeflavor_to_anchor = ''; // This will either be the "flavor" attribute, or the size if there is none
                    if(!this_product_item.flavor) {
                        sizeflavor_to_anchor = this_size;
                    } else {
                        sizeflavor_to_anchor = this_product_item.flavor;
                    }
                    var this_link_title = 'Go to the '+this_product_item.flavor+' product page';
                    row_html_array.push(build_link(this_product_item.url, sizeflavor_to_anchor, this_link_title, priceplow_settings, false));
                    this_stores_prices.push(this_product_item.price);
                });// End this store set loop
                // Now we have all of this store's data in two arrays.  Do some math on it.
                var this_stores_min = Math.min.apply(null, this_stores_prices);
                var this_stores_max = Math.max.apply(null, this_stores_prices);
                var this_link_anchor = '<div class="priceplow-store">' + this_store_set[0].store + '<br><span class="priceplow-price">'; // May include a value range
                var this_link_title = 'Go to the best price at Store ' + this_store_set[0].store;
                if (this_stores_max == this_stores_min) {
                    this_link_anchor += '$' + this_stores_max;
                } else {
                    this_link_anchor += '$' + this_stores_min + ' - $' + this_stores_max;
                }
                this_link_anchor += '</span>';
                compare_html += build_link(this_store_set[0].url, this_link_anchor, this_link_title, priceplow_settings, false);
                compare_html += '</div>'; // priceplow-store
                compare_html += '<div class="priceplow-detail-links">';
                compare_html += row_html_array.join(', '); // This is like PHP implode
                compare_html += '</div>'; // priceplow-detail-links
                compare_html += '</div>'; // priceplow-store-container
            }); // End this size set loop
            compare_html += '</div>'; // priceplow-tab-content
            compare_html += '</div>'; // priceplow-tab-panel
            compare_html += '</div>'; // priceplow-tab
            real_iter++;
        }); // End this product data loop
        compare_html += '</div>'; // priceplow-tabs
        return compare_html;
    }

    /*
     * get_powered_by_html returns the Powered by PricePlow HTML.
     *  It will not link to PricePlow if link_to_priceplow is false
     */
    function get_powered_by_html(priceplow_settings) {
        var power_html = '<div class="priceplow-powered-by">';
        power_html += build_link("http://www.PricePlow.com", "Powered by PricePlow", "The PricePlow Price Comparison Shopping Site", priceplow_settings, true);
        power_html += '</div>';
        return power_html;
    }

    /*
     * build_link builds HTML links depending on the settings
     *  if new_tab !== false, target="_blank"
     *  link_to_priceplow is a setting that will enable links to the main PricePlow SITE
     *  is_priceplow_link is to be set true if this IS a link going to the PricePlow SITE
     *   ^^ By SITE, we mean the user actually lands on the site, not a store link.
     *  Very few links need their own class, but if that's added, they can be used too
     */
    function build_link(url, anchor, title, priceplow_settings, is_priceplow_link, link_class) {
        // Unroll some settings:
        var link_to_priceplow = priceplow_settings.link_to_priceplow;
        // Set defaults
        var new_tab = priceplow_settings.new_tab_links;
        var campaign_id = priceplow_settings.campaign_id;
        // To not link to priceplow: it's an is_priceplow_link and link_to_priceplow is False
        //  Otherwise, build the link.
        var html_link = '';
        var creating_link = false; // If we end up creating a link, set this true.. we check it later
        if((is_priceplow_link == true && link_to_priceplow === true) || !is_priceplow_link) {
            creating_link = true;
            if(campaign_id) {
                url = url + '?ic=' + campaign_id;
            }
            html_link += '<a href="' + url+'"';
            // Add some extra anchor parameters
            if (new_tab !== false) {
                html_link += ' target="_blank"';
            }
            if (is_priceplow_link !== true) {
                html_link += ' rel="nofollow"';
            }
            if (title) {
                html_link += ' title="'+title+'"';
            }
            if (link_class) {
                html_link += ' class="'+link_class+'"';
            }

            html_link += '>';
        }

        html_link += anchor;
        if(creating_link === true) {
            html_link += '</a>';
        }
        return html_link;

        // Close the tag, if we opened one
    }

    /*
     * This is a hack function to get the first outgoing URL from a list of store product data
     *  for privileged API users.  We may be able to destroy it if we can fix the key method of our
     *  API.  Right now, the keys are the sizes, which is impossible to determine/index beforehand.
     */
    function get_first_outgoing_url(product_data) {
        var first_item_url;
        $.each( product_data.prices, function(this_size, this_size_set ) {
            first_item_url = this_size_set[0][0].url;
            return this_size_set[0][0].url; // returns out of this EACH, I believe
        });
        return first_item_url;
    }

// Set another completion function for the request above
    /*jqxhr.complete(function() {
     console.log( "Exiting priceplow.js" );
     });*/
});
