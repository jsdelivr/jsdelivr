$(document).ready(function() {

    var enterEvent = 'touchstart',
        use_sorter = false;

    if(!('ontouchstart' in window)){
        enterEvent ='mouseenter';
    }

    var searchEngine = null;
    var searchOptions = {
        sufficient: window.tbApp['/tb/live_search/max_results'],
        datumTokenizer: function(datum) {
            var nameTokens = Bloodhound.tokenizers.whitespace(datum.nm);
            var ownerTokens = Bloodhound.tokenizers.whitespace(datum.tk);

            return nameTokens.concat(ownerTokens);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        identify: function(obj) {
            return obj.id;
        },
        sorter: function(a, b, info) {
            if (!use_sorter) {
                return;
            }

            function getNumber(s) {
                // http://stackoverflow.com/questions/34851713/sort-javascript-array-based-on-a-substring-in-the-array-element
                var index = -1;

                info.query.toLowerCase().split(' ').some(function (c, i) {
                    if (~s.indexOf(c)) {
                        index = i;

                        return true;
                    }
                });

                return index;
            }

            return getNumber(a.nm.toLowerCase()) - getNumber(b.nm.toLowerCase());
        },
        searcher: function(query_tokens, result, matched_ids) {

            if (window.tbApp['/tb/live_search/max_results'] <= matched_ids.length) {
                use_sorter = false;

                return;
            }

            use_sorter = true;

            var engine = this;
            var search_model = window.tbApp['/tb/live_search/search_in_model'];

            Object.keys(engine.datums).map(function(id) {
                if (matched_ids.indexOf(id) == -1) {
                    query_tokens.forEach(function(token) {
                        if (engine.datums[id].nm.toLowerCase().indexOf(token) != -1 || search_model && engine.datums[id].md.toLowerCase().indexOf(token) != -1) {
                            if (result.every(function(element) {
                                return element.id != id;
                            })) {
                                result.push(engine.datums[id]);
                            }

                        }
                    });
                }
            });
        },
        prefetch: {
            url:   window.tbApp['/tb/url/live_search/seed'],
            cache: window.tbApp['/tb/cache_enabled'] != 0
        },
        remote: {
            url: window.tbApp['/tb/url/live_search/search'] + '&query=%QUERY',
            wildcard: '%QUERY'
        }
    };
    var suggestionTemplate = function(obj) {
        var tpl  = '<div class="tb_item border">';
            tpl += obj.im ?
                   '  <div class="thumbnail"><a href="' + obj.ur + '"><img src="' + obj.im.replace('**', tbApp['/tb/url/image_cache']) + '" /></a></div>' : '';
            tpl += '  <div class="tb_item_info">';
            tpl += '    <div class="name"><a class="' + window.tbApp['/tb/live_search/title_style'] + '" href="' + obj.ur + '">' + obj.nm + '</a></div>';
            tpl += obj.pr && !obj.sp ?
                   '    <p class="price"><span class="price-regular">' + obj.pr + '</span></p>' : '';
            tpl += obj.sp ?
                   '    <p class="price"><span class="price-old">' + obj.pr + '</span> <span class="price-new">' + obj.sp + '</span></p>' : '';
            tpl += obj.md && window.tbApp['/tb/live_search/show_model'] ?
                   '    <p class="model">' + obj.md + '</p>' : '';
            tpl += '  </div>';
            tpl += '</div>';

        return tpl;
    };

    var initTypeAhead = function($element) {

        if (searchEngine === null) {
            searchEngine = new Bloodhound(searchOptions);

            var origSearch = searchEngine.index.search;

            searchEngine.index.search = function (query) {
                var result = origSearch.apply(searchEngine.index, [query]);
                // Apply advanced results sorting if needed
                return result;
            };
        }

        $element.typeahead({
            minLength:  window.tbApp['/tb/live_search/min_length'],
            highlight:  window.tbApp['/tb/live_search/highlight_results'] != 0,
            classNames: {
                menu:    'dropdown-menu',
                dataset: 'tb_listing tb_compact_view',
                cursor:  'tb_bg_str_1'
            }
        }, {
            name: 'search-results',
            display: 'nm',
            limit: window.tbApp['/tb/live_search/max_results'],
            source: searchEngine,
            templates: {
                suggestion: suggestionTemplate
            }
        });

        $element.bind('typeahead:select', function(ev, suggestion) {
            location = suggestion.ur;
        });

        $element.bind('typeahead:open', function(ev, suggestion) {
            $(this).parent().addClass('dropdown-open');
        });

        $element.bind('typeahead:close', function(ev, suggestion) {
            $(this).parent().removeClass('dropdown-open');
        });

        tbApp.on('filterKeywordEnter', function(context) {
            if ($element.parent().find(".tb_bg_str_1").length > 0) {
                context.redirect = false;
            }
        });
    };

    tbApp.on('beforeCloneWidget', function($widget) {
        if ($widget.hasClass('tb_system_search') && $widget.addClass('typeahead')) {
            var $search = $widget.find('input[name="search"]');

            if ($search.hasClass('tt-input')) {
                $search.typeahead('destroy');
            }
        }
    });

    $('#filter_keyword').on(enterEvent, function() {

        if ($(this).hasClass('tt-input')) {
            return;
        }

        initTypeAhead($(this));

        /*
        searchEngine.search($('#filter_keyword').val(), function(datums) {
            console.log(datums);
        });
        */
    });
});
