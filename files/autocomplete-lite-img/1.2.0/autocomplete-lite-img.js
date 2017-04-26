/*
    Author : mridul ahuja
    Github : https://github.com/mridah/autocomplete-lite-img

    HOW TO USE :

    >> Load JQuery library
    >> Load autocomplete-lite-img.js library
    >> Initialize autocomplete on element and pass autocomplete list as an array

    EXAMPLE :

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="autocomplete-lite-img.js"></script>
    <input type="text" id="autocomplete_input">
    <script>
        var autocomplete_items = ["person1", "person2", "person3", "person4", "person5", "person6"];
        var autocomplete_images = ["person1.png", "person2.png", "person3.png", "person4.png", "person5", "person6.png"];

        function callback_function(elem, index)
        {
            alert("Selected : " + elem.val() + '. Item index : ' + index);
        }

        // initializing
        $('#autocomplete_input').autocomplete_img_init({
            items: autocomplete_items, 
            images: autocomplete_images,
            callback: callback_function
        });
    </script>

*/

(function($) {

jQuery.fn.extend({
    autocomplete_img_init: function (params) {
        self = this;

        /* checking if element exists */
        if(! self.length)
        {
            console.error('Error : autocomplete-lite-img failed to initialize on [' + self.selector + ']. ' + ' Element does not exist');
            return;
        }

        var defaults = {
                items: '',
                images: '',
                args: []
            };

        params = $.extend(defaults, params);

        var item_data = params.items, callback = params.callback, image_data = params.images;

        if (! Array.isArray(params.args)) 
        {
            console.error('Error : autocomplete-lite-img failed to initialize on [' + self.selector + ']. ' + ' args is not an array');
            return;
        }

        if(callback === undefined)
        {
            callback = callback_dummy;
        }
        else
        {
           if(typeof callback !== 'function')
           {
                console.error('Error : autocomplete-lite-img failed to initialize on [' + self.selector + ']. ' + callback + ' is not a function');
                return;
           }
        }


        var item_data_length = item_data.length; 

        if(item_data_length === image_data.length)
        {
            var img_map = {};
            for(let i=0; i<item_data_length; i++)
            {
                img_map[item_data[i].toLowerCase() + '#' + i] = image_data[i];
            }

            mridautocomplete(self, self.selector, item_data, img_map, callback, params.args);
        }
        else
        {
            console.error('Error : autocomplete-lite-img failed to initialize on [' + self.selector + ']. Item count does not match the image count');
        }

    },

    autocomplete_img_destroy: function () {
        self = this;

        if(self.hasClass('autocomplete-lite-img-input-node') && self.next().hasClass('mridautocomplete-list'))
        {
            /* removing class */
            self.removeClass('autocomplete-lite-img-input-node');

            /* removing autocomplete div */
            self.next().remove();

            /* removing event listeners */
            self.off('click');
            self.off('keyup');
            self.off('keydown');
        }
    }
});


function callback_dummy() {}

function mridautocomplete(input, o_selector, item_data, image_data, callback, callback_args) {

    input.addClass('autocomplete-lite-img-input-node');
    var mridautocomplete_timer = 0, img_dimensions;

    /* not defining img dimensions in style since different initializations of the plugin can have different image sizes */
    img_dimensions = (parseInt(input.css('font-size')) - 2 ) + 'px';

    /* adding common css styling for this plugin in case it's not already defined */
    if(!$('#mridautocomplete_css').length )
    {        
        $('body').prepend('<style id="mridautocomplete_css">.mridautocomplete-list::-webkit-scrollbar{width: 12px;}.mridautocomplete-list::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 2px;}.mridautocomplete-list::-webkit-scrollbar-thumb{border-radius: 2px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);} </style>');
    }

    var item_dataList = [];

    if (Array.isArray(item_data)) {
        item_dataList = item_dataList.concat(item_data);
    } else {
        console.error('Error : autocomplete-lite-img failed to initialize on [' + o_selector + ']. Expected array, ' + typeof item_data + ' given');
        return;
    }

    /* 
        this function will return true even if text partially matches input

        Example : is_substring_partial('ple', 'apple') => true
                  is_substring_partial('pe', 'apple') => true
                                               ^  ^
                  is_substring_partial('banna', 'banana') => true
                                                 ^^^ ^^
    */
    var is_substring_partial  = function(input, text) {
        input = input.toLowerCase();
        text = text.toLowerCase();
        var found = 0;
        var nextChar = input.charAt(found);
        for (let i=0, l=text.length; i<l; i++) {
            if (text.charAt(i) === nextChar) {
                found++;
                if (found === input.length)
                    return true;
                nextChar = input.charAt(found);
            }
        }
    };

    /* 
        this function will return true if text contains input

        Example : is_substring_exact('ple', 'apple') => true
                  is_substring_exact('pe', 'apple') => false
    */
    var is_substring_exact  = function(input, text) {
        input = input.toLowerCase();
        text = text.toLowerCase();
        if(text.includes(input)) {
            return true;
        }
        else {
            return false;
        }
    };

    var matchitem_data = function(input, item_dataList) {
        var result = item_dataList.map(function(item, index) {
            if (is_substring_exact(input, item)) {
                return [item, index];
            }
            return 0;
        });
        return result.filter(isNaN);
    };

    var changeInput = function(input, item_dataList) {
        var val = input.val().toLowerCase();
        var res = input.next(); /* res is the autocomplete div which is added immediately after the input */

        res.empty().hide();

        var autoCompleteResult = matchitem_data(val, item_dataList);
        if (val == "" || autoCompleteResult.length == 0) {
            return;
        }

        autoCompleteResult.forEach(function(e) {
            var p = $('<div />');
            var to_ins = false;

            p.css({
              'margin': '0px',
              'padding-left': parseInt(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10),
              'text-align': 'left',
              'font-size': input.css('font-size'),
              'cursor': 'default'
            });

            p.addClass('mrid-autocomplete-item');

            e[0] = e[0].toLowerCase();

            if(e[0].includes(val))
            {
                var first_part = e[0].split(val)[0];
                var second_part = e[0].split(val).splice(1).join(val);

                p.attr('_ix', e[1]);
                p.html('<img src="' + image_data[e[0]+'#'+e[1]] + '" class="mridautocomplete-item-image" style="height: ' + img_dimensions + '; width: ' + img_dimensions + ';" onerror="this.src=\'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\'; this.removeAttribute(\'onerror\'); this.removeAttribute(\'onload\');" onload="this.removeAttribute(\'onerror\'); this.removeAttribute(\'onload\');">' + first_part + '<span style="color: #4682B4; font-weight: bold;">' + val + '</span>' + second_part);
                to_ins = true;
            }

            p.click(function() {
                input.val(p.text());
                args = callback_args.concat([res.prev(), p.attr('_ix')]);

                /*
                    if interval is set to 0 => callbacks like alert will fire
                    before the autocomplete div is hidden
                */
                res.empty().removeAttr('style').hide(1,function() {
                    callback.apply(this, args);
                });
            });

            p.mouseenter(function() {
                $('.mrid-autocomplete-item').css("background-color", "white");
                $('.mrid-autocomplete-item').removeClass('autocomplete-lite-item-selected');
                $(this).addClass('autocomplete-lite-item-selected');
                $(this).css("background-color", "#DCDCDC");
            }).mouseleave(function() {
                $(this).removeClass('autocomplete-lite-item-selected');
                $(this).css("background-color", "white");
            });

            if(to_ins){
                res.append(p);
            }
        });

        res.css({
            'left': input.position().left,
            'width': input.css('width'),
            'position': 'absolute',
            'background-color': "white",
            'border': '1px solid #dddddd',
            'max-height': '150px',
            'overflow': 'scroll',
            'overflow-x': 'hidden',
            'font-family': input.css('font-family'),
            'font-size' : input.css('font-size'),
            'z-index' : '8888'
        }).insertAfter(input).show();
    };

    var res = $("<div class='mridautocomplete-list' style='display: none;'/>");
    res.insertAfter(input);


    input.click(function(){
        if(! res.is(":visible") )
        {
            clearTimeout(mridautocomplete_timer);
            mridautocomplete_timer = setTimeout(function() {
                changeInput(input, item_dataList);
            }, 0);
        }
    });

    input.keyup(function(e) {
        /* if key pressed is not enter or arrow keys */
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13 && e.keyCode != 9)
        {
            clearTimeout(mridautocomplete_timer);
            mridautocomplete_timer = setTimeout(function() {
               changeInput(input, item_dataList);
            }, 100);
        }

    });

    input.keydown(function(e) {
        var autocomplete_div = input.next();
        if(e.keyCode == 40) /* down arrow */
        {
            e.preventDefault();
            var tmp;
            $('mrid-autocomplete-item').css("background-color", "white");
            if(input.next().find('.autocomplete-lite-item-selected').length > 0)
            {
                tmp = input.next().find('.autocomplete-lite-item-selected');

                /* checking if this is the last item */
                if(tmp.next().hasClass('mrid-autocomplete-item'))
                {
                    tmp.css("background-color", "white");
                    tmp.removeClass('autocomplete-lite-item-selected');
                    tmp.next().css("background-color", "#DCDCDC");
                    tmp.next().addClass('autocomplete-lite-item-selected');
                    autocomplete_div.animate({
                        scrollTop: tmp.offset().top - autocomplete_div.offset().top + autocomplete_div.scrollTop()
                    }, 50);
                }
            }
            else
            {
                first = input.next().find('.mrid-autocomplete-item').first();
                first.css("background-color", "#DCDCDC");
                first.addClass('autocomplete-lite-item-selected');
                tmp = first;
            }
        }
        else if(e.keyCode == 38) /* up arrow */
        {
            e.preventDefault();
            var tmp, up_height = 2 * input.next().find('.mrid-autocomplete-item').css('height').replace('px','');
            $('mrid-autocomplete-item').css("background-color", "white");
            if(input.next().find('.autocomplete-lite-item-selected').length > 0)
            {
                tmp = input.next().find('.autocomplete-lite-item-selected');
                tmp.css("background-color", "white");
                tmp.removeClass('autocomplete-lite-item-selected');
                tmp.prev().css("background-color", "#DCDCDC");
                tmp.prev().addClass('autocomplete-lite-item-selected');
                autocomplete_div.animate({
                    scrollTop: tmp.offset().top - autocomplete_div.offset().top + autocomplete_div.scrollTop() - up_height
                }, 50);
            }
        }
        else if(e.keyCode == 13) /* enter key */
        {
            tmp = input.next().find('.autocomplete-lite-item-selected');
            input.val(tmp.text());
            args = callback_args.concat([res.prev(), tmp.attr('_ix')]);
            res.empty().removeAttr('style').hide(1,function() {
                callback.apply(this, args);
            });
        }
        else if(e.keyCode == 9) /* tab key */
        {
            res.removeAttr('style');
            res.empty().hide();
        }
        else
        {
            clearTimeout(mridautocomplete_timer);
        }
    });

    /*
        NOTE : blur cannot be used here since blur is called after losing focus.
               focusout is called just before losing focus.

               If user has selected an item ( causing input to lose focus )
                   => input.next().find('.autocomplete-lite-item-selected').length != 0
                Else
                   => input.next().find('.autocomplete-lite-item-selected').length == 0

    */
    input.focusout(function(e) {
        if(!input.next().find('.autocomplete-lite-item-selected').length)
        {
            res.removeAttr('style');
            res.empty().hide();
        }
    });

}

})(jQuery);