/*
    Author : mridul ahuja
    Github : https://github.com/mridah/select2tag

    For documentation and examples, visit github

*/

(function($) {

jQuery.fn.extend({
    select2tag: function (params) {
        var me = $(this);

        var defaults = {
                           maxSelection: null,
                           maxSelectionError: max_selected_error,
                           maxSelectionErrorArgs: [],
                           onItemSelection: null,
                           onItemRemoval: null,
                           readOnly: false,
                           theme: 'default',
                           class: {
                               tagManager: '',
                               tagManagerItems: '',
                               tagManagerInput: '',
                               tagManagerAutocompleteList: ''
                           }

                       };

        params = $.extend(defaults, params);


        select2tag_init(me, params);
    },
    click_outside: function(callback) {
        var clicked = false;
        var parent = this;

        parent.click(function() {
            clicked = true;
        });

        $(document).click(function(event) { 
            var self = $(this);
            if (!clicked) {
                callback(parent, event, self);
            }
            clicked = false;
        });
    }
});

var mridautocomplete_timer = 0;

function select2tag_init(select_box, params) {
    var res = null;
    if(!$('#mridtagmanager_css').length )
    {
        $('body').prepend('<style id="mridtagmanager_css">.mridautocomplete-list::-webkit-scrollbar{width: 6px;}.mridautocomplete-list::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius:0;}.mridautocomplete-list::-webkit-scrollbar-thumb{border-radius: 2px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);} .mridlist{overflow:auto;list-style-type:none;margin:0;padding:0;float:left}.mridlistitem{position:relative;border-right:1px solid #aaa;margin-top:5px;margin-left:5px;background-color:#C8C8C8;-webkit-transition:all .5s ease;float:left;border-radius:2px;cursor:default;padding:2px;padding-right:15px;border:none;}.mridlistitem:last-child{border-right:none}.mridlistitem a{text-decoration:none;color:#000;padding:0 8px;}.mridlistitem .delete-button{position:absolute;top:25%;right:5px;cursor:pointer;display:inline;padding:0 2px;background-color:transparent;border:none;text-align:center;font-size:13px;color:#696969;opacity:0.6;}.mridlistitem .delete-button:after{content:\'✖\'}.mridlistitem .delete-button:hover{color:#A52A2A;font-weight:700;opacity:1;}.tag-div{background:#ffffff;float:left;overflow-y:wrap;cursor:text;padding-right:5px;}.tag-manager-container{position:absolute;} .tag-manager-container .noselect{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;} .tag-manager-input:focus{outline-width:0;outline:none;} .tag-manager-container .disabled{opacity:0.4;cursor:not-allowed;pointer-events:none;} </style>');
    }

    select_box.attr('multiple', 'multiple');

    /* taking arguments */
    var maxSelection = params.maxSelection,
        maxSelectionError = params.maxSelectionError,
        maxSelectionErrorArgs = params.maxSelectionErrorArgs,
        onItemSelection = params.onItemSelection,
        onItemRemoval = params.onItemRemoval,
        theme = params.theme,
        tagManagerClass = params.class.tagManager === undefined ? '' : params.class.tagManager,
        tagManagerItemsClass = params.class.tagManagerItems === undefined ? '' : params.class.tagManagerItems,
        tagManagerInputClass = params.class.tagManagerInput === undefined ? '' : params.class.tagManagerInput,
        tagManagerAutocompleteListClass = params.class.tagManagerAutocompleteList === undefined ? '' : params.class.tagManagerAutocompleteList;


    var select_option_val_map = {}, select_data_1d = [], previously_selected_items = [], currently_selected_vals = [], tmp_counter = 0;


    $(select_box).find('option').each(function() {
        select_option_val_map[$(this).text() + '#' + tmp_counter++] = $(this).val();
        select_data_1d.push($(this).text());
        if($(this)[0].hasAttribute('selected'))
        {
            previously_selected_items.push($(this).text());
            currently_selected_vals.push($(this).val());
        }
    });
    select_box.val(currently_selected_vals);

    var dataList = select_data_1d;   

    var container = $('<div class="tag-manager-container"></div>');
    container.css({
        'font-size' : select_box.css('font-size')
    });
    container.insertAfter(select_box);

    /* disabling tag manager if readonly */
    if(params.readOnly)
    {
        container.css({
            'opacity': '0.4',
            'cursor': 'not-allowed',
            'pointer-events': 'none'
        });
    }


    var tag_manager = $('<div class="form-control tag-div ' + tagManagerClass + '" style="height:auto;"></div>');
    tag_manager.html('<ul class="mridlist">' +
                        '<li class="mridlistitem" style="background: transparent; cursor: text; border: none;"><input type="text" class="tag-manager-input ' + tagManagerInputClass + '" style="border: none; border: 1px solid grey; margin-bottom: 5px; min-width: 10px; max-width: '+(parseInt(select_box.css('width').replace('px', ''))-10)+'px; padding-left: 5px; padding-right: 5px; font-size:' + (parseInt(select_box.css('font-size').replace('px', ''))-2)+'px; width: 15px; visibility: hidden;" autocomplete="off" /><span style="display:none;"></span></li>' +
                     '</ul>');

    /* assigning input position to tag manager div */
    container.css(select_box.offset());

    tag_manager.css({
            'width': select_box.css('width'),
            'border': '1px solid #dddddd',
            'min-height': select_box.css('height'),
            'font-family': select_box.css('font-family'),
            'font-size' : select_box.css('font-size'),
            'z-index' : '888',
            'position': 'relative',
            'top' : '0px'
    });

    container.append(tag_manager);    

    var tag_manager_taglist = tag_manager.find('ul');

    var tag_manager_input = tag_manager.find('input');

    tag_manager_input.click_outside(function(e, clicked_on){
            tag_manager_input.val('');
            tag_manager_input.css('width', '15px');

            res.removeAttr('style');
            res.empty().hide();
    });

    container.click(function(){
        tag_manager_input.css('visibility', 'visible').focus();
    }).focusout(function(){
        tag_manager_input.css('visibility', 'hidden');
    });

    select_box.css('display', 'none');

    tmp_counter = 0;

    /* selecting previously selected items */
    previously_selected_items.forEach(function(item) {
        var tab =$("<li class='mridlistitem noselect " + tagManagerItemsClass + "' myval='" + currently_selected_vals[tmp_counter++] + "'><a>" + item + "</a></li>");
        tag_manager_input.parent().before(tab);
        var del_button = $("<span class='delete-button tags-del'></span>");
        del_button.click(function(){
            remove_item($(this));
        });
        tab.append(del_button);
    });


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

   var changeInput = function(input, dataList) {
        var val = input.val();
        res = tag_manager.next();

        res.empty().hide();

        tag_manager_taglist_items = tag_manager_taglist.find('li');


        var autoCompleteResult = matchitem_data(val, dataList);
        if (val == "" || autoCompleteResult.length == 0) {
            return;
        }

        autoCompleteResult.forEach(function(e) {
            var p = $('<div />');
            p.css({
              'margin': '0px',
              'padding-left': parseInt(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10),
              'text-align': 'left',
              'font-size': input.css('font-size'),
              'cursor': 'default'
            });

            p.addClass('mrid-autocomplete-item');

            var tmp_e = e[0].toLowerCase();

            if(tmp_e.includes(val))
            {
                var first_part = tmp_e.split(val)[0];
                var second_part = tmp_e.split(val).splice(1).join(val); 

                p.html(first_part + '<span style="color: #4682B4; font-weight: bold;">' + val + '</span>' + second_part);
                p.attr('data', e[0]);
                p.attr('ai', e[1]);
                p.attr('_val', select_option_val_map[ e[0] + '#' + e[1] ]);
            }

            p.click(function() {

                /* adding item in ul */
                var itemFound = false;
                var input_val = p.text().toLowerCase();
                var li_count = res.prev().find('li').length;
                var onItemSelectionArgs = [];

                if(li_count-1 === maxSelection)
                {
                    args = maxSelectionErrorArgs.concat([select_box, p.attr('data')]);
                    res.removeAttr('style').empty().hide(1, function(){
                        maxSelectionError.apply(this, args);
                    });

                    return;
                }

                for(i=0; i<li_count-1; i++)
                {
                    if ( tag_manager_taglist_items.eq(i).text().toLowerCase() === input_val)
                    {
                        itemFound = true;
                    }                     
                }

                if ( !itemFound )
                {
                    var value = p.attr('data');
                    var tab =$("<li class='mridlistitem noselect " + tagManagerItemsClass + "' myval='" + p.attr('_val') + "'><a>" + p.attr('data') + "</a></li>");

                    tag_manager_input.parent().before(tab);
                    var del_button = $("<span class='delete-button tags-del'></span>");
                    del_button.click(function(){
                        remove_item($(this));
                    });
                    tab.append(del_button);

                    currently_selected_vals.push(p.attr('_val'));
                    select_box.val(currently_selected_vals);

                }

                tag_manager_input.focus();

                res.empty().hide(1, function(){
                    if(!!onItemSelection)
                    {
                        onItemSelectionArgs.push(p.attr('_val'));
                        onItemSelectionArgs.push(currently_selected_vals);
                        onItemSelection.apply(this, onItemSelectionArgs);
                    }
                });

            });

            p.mouseenter(function() {
                $(this).parent().find('.mrid-autocomplete-item').css('background-color', '#ffffff');
                $(this).parent().find('.autocomplete-lite-item-selected').removeClass('autocomplete-lite-item-selected');
                $(this).css("background-color", "#DCDCDC");
                $(this).addClass('autocomplete-lite-item-selected');
            }).mouseleave(function() {
                $(this).css("background-color", "#ffffff");
                $(this).removeClass('autocomplete-lite-item-selected');
            });
            res.append(p);
        });

        res.css({
            'left': tag_manager.position().left,
            'width': tag_manager.outerWidth() - 2,
            'top': tag_manager.css('height'),
            'position': 'absolute',
            'background-color': "#ffffff",
            'border': '1px solid #dddddd',
            'max-height': '150px',
            'overflow': 'scroll',
            'overflow-x': 'hidden',
            'font-family': tag_manager.css('font-family'),
            'font-size' : tag_manager.css('font-size'),
            'z-index' : '8888'
        }).insertAfter(tag_manager).show();
    };

    var resize_input_box = function(text){
        var self = $(this);
        self.next().text(text);
        var $inputSize = self.next().width() + 15;
        self.css("width", $inputSize);
    };

    res = $("<div class='mridautocomplete-list noselect " + tagManagerAutocompleteListClass + "' />");
    res.insertAfter(tag_manager);

    tag_manager_input.keyup(function(e) {
        /* if key pressed is not enter or arrow keys */
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13 && e.keyCode != 9)
        {
            clearTimeout(mridautocomplete_timer);
            mridautocomplete_timer = setTimeout(function() {
               changeInput(tag_manager_input, dataList);
            }, 100);
        }

    });

    tag_manager_input.keydown(function(e) {
        var autocomplete_div = tag_manager.next();
        if(e.keyCode == 40) /* down arrow */
        {
            e.preventDefault();
            var tmp;
            $('mrid-autocomplete-item').css("background-color", "white");
            if(tag_manager.next().find('.autocomplete-lite-item-selected').length > 0)
            {
                tmp = tag_manager.next().find('.autocomplete-lite-item-selected');

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
                first = tag_manager.next().find('.mrid-autocomplete-item').first();
                first.css("background-color", "#DCDCDC");
                first.addClass('autocomplete-lite-item-selected');
                tmp = first;
            }
        }
        else if(e.keyCode == 38) /* up arrow */
        {
            e.preventDefault();
            var tmp, up_height = 2 * tag_manager.next().find('.mrid-autocomplete-item').css('height').replace('px','');
            $('mrid-autocomplete-item').css("background-color", "white");
            if(tag_manager.next().find('.autocomplete-lite-item-selected').length > 0)
            {
                tmp = tag_manager.next().find('.autocomplete-lite-item-selected');
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
            /* adding item in ul */
            var itemFound = false;
            var input_val = tag_manager.next().find('.autocomplete-lite-item-selected').text();
            var selected_autocomplete_item = tag_manager.next().find('.autocomplete-lite-item-selected');
            var data = selected_autocomplete_item.attr('data');
            var li_count = res.prev().find('li').length;
            var onItemSelectionArgs = [];

            if(input_val === '' || input_val === undefined)
                return;

            if(li_count-1 === maxSelection)
            {
                tag_manager_input.val('').css('width', '15px');
                args = maxSelectionErrorArgs.concat([select_box, data]);
                res.removeAttr('style').empty().hide(1, function(){
                    maxSelectionError.apply(this, args);
                });

                return;
            }

            for(i=0; i<li_count-1; i++)
            {
                if ( tag_manager_taglist_items.eq(i).text().toLowerCase() === input_val)
                {
                    itemFound = true;
                }                     
            }

            if ( !itemFound )
            {
                var tab =$("<li class='mridlistitem noselect " + tagManagerItemsClass + "' myval='" + selected_autocomplete_item.attr('_val') + "'><a>" + data + "</a></li>");

                tag_manager_input.parent().before(tab);
                var del_button = $("<span class='delete-button tags-del'></span>");
                del_button.click(function(){
                    remove_item($(this));
                });
                tab.append(del_button);

                currently_selected_vals.push(selected_autocomplete_item.attr('_val'));
                select_box.val(currently_selected_vals);

            }

            tag_manager_input.val('').css('width', '15px').focus();

            res.empty().hide(1, function(){
                if(!!onItemSelection)
                {
                    onItemSelectionArgs.push(selected_autocomplete_item.attr('_val'));
                    onItemSelectionArgs.push(currently_selected_vals);
                    onItemSelection.apply(this, onItemSelectionArgs);
                }
            });

        }
        else if(e.keyCode == 9) /* tab key */
        {
            hide_autocomplete();
        }
        else
        {
            clearTimeout(mridautocomplete_timer);
        }
    });

    var hide_autocomplete = function(){
        var r = $('.mridautocomplete-list');
        r.removeAttr('style');
        r.empty().hide();
    }

    tag_manager_input.on('input', function() {
        var self = $(this);
        resize_input_box.call(self, self.val());
    });

    var remove_item = function(item) {
        var val_to_remove = item.parents('.mridlistitem').attr('myval');
        var index = currently_selected_vals.indexOf(val_to_remove);
        currently_selected_vals.splice(index, 1);
        select_box.val(currently_selected_vals);
        $(item).parents('.mridlistitem').hide(1, function(){
            if(!!onItemRemoval)
            {
                onItemRemoval.apply(this, [val_to_remove, currently_selected_vals]);
            }
            $(this).remove();
        });
        tag_manager_input.focus();
    }


    if (/*@cc_on!@*/false) { /* check for Internet Explorer */
        document.onfocusout = function(){
            hide_autocomplete();
        }
    } else {
        window.onblur = function(){
            hide_autocomplete();
        }
    }

}

function max_selected_error(select) {
    alert('You have already selected the max no. of items allowed');
}


})(jQuery);