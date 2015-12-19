;(function(){

/**
 * Please note that when passing in custom templates for 
 * listItemTemplate and orderByTemplate to keep the classes as
 * they are used in the code at other locations as well.
 */

var defaults = {
  items              : [{a:2,b:1,c:2},{a:2,b:2,c:1},{a:1,b:1,c:1},{a:3,b:3,c:1}],
  facets             : {'a': 'Title A', 'b': 'Title B', 'c': 'Title C'},
  resultSelector     : '#results',
  facetSelector      : '#facets',
  facetContainer     : '<div class=facetsearch id=<%= id %> ></div>',
  facetTitleTemplate : '<h3 class=facettitle><%= title %></h3>',
  facetListContainer : '<div class=facetlist></div>',
  listItemTemplate   : '<div class=facetitem id="<%= id %>"><%= name %> <span class=facetitemcount>(<%= count %>)</span></div>',
  bottomContainer    : '<div class=bottomline></div>',
  orderByTemplate    : '<div class=orderby><span class="orderby-title">Sort by: </span><ul><% _.each(options, function(value, key) { %>'+
                       '<li class=orderbyitem id=orderby_<%= key %>>'+
                       '<%= value %> </li> <% }); %></ul></div>',
  countTemplate      : '<div class=facettotalcount><%= count %> Results</div>',
  deselectTemplate   : '<div class=deselectstartover>Deselect all filters</div>',
  resultTemplate     : '<div class=facetresultbox><%= name %></div>',
  noResults          : '<div class=results>Sorry, but no items match these criteria</div>',
  orderByOptions     : {'a': 'by A', 'b': 'by B', 'RANDOM': 'by random'},
  state              : {
                         orderBy : false,
                         filters : {}
                       },
  showMoreTemplate   : '<a id=showmorebutton>Show more</a>',
  enablePagination   : true,
  paginationCount    : 20
}

/**
 * This is the first function / variable that gets exported into the 
 * jQuery namespace. Pass in your own settings (see above) to initialize
 * the faceted search
 */
var settings = {};
jQuery.facetelize = function(usersettings) {
  $.extend(settings, defaults, usersettings);
  settings.currentResults = [];
  settings.facetStore     = {};
  $(settings.facetSelector).data("settings", settings);
  initFacetCount();
  filter();
  order();
  createFacetUI();
  updateResults();
}

/**
 * This is the second function / variable that gets exported into the 
 * jQuery namespace. Use it to update everything if you messed with
 * the settings object
 */
jQuery.facetUpdate = function() {
  filter();
  order();
  updateFacetUI();
  updateResults();
}

/**
 * The following section contains the logic of the faceted search
 */

/**
 * initializes all facets and their individual filters 
 */
function initFacetCount() {
  _.each(settings.facets, function(facettitle, facet) {
    settings.facetStore[facet] = {};
  });
  _.each(settings.items, function(item) {
   // intialize the count to be zero
    _.each(settings.facets, function(facettitle, facet) {
      if ($.isArray(item[facet])) {
        _.each(item[facet], function(facetitem) {
          settings.facetStore[facet][facetitem] = settings.facetStore[facet][facetitem] || {count: 0, id: _.uniqueId("facet_")}
        });
      } else {
        if (item[facet] !== undefined) {
          settings.facetStore[facet][item[facet]] = settings.facetStore[facet][item[facet]] || {count: 0, id: _.uniqueId("facet_")}
        }
      }
    });
  });
  // sort it:
  _.each(settings.facetStore, function(facet, facettitle) {
    var sorted = _.keys(settings.facetStore[facettitle]).sort();
    if (settings.facetSortOption && settings.facetSortOption[facettitle]) {
      sorted = _.union(settings.facetSortOption[facettitle], sorted);
    }
    var sortedstore = {};
    _.each(sorted, function(el) {
      sortedstore[el] = settings.facetStore[facettitle][el];
    });
    settings.facetStore[facettitle] = sortedstore;
  });
}

/**
 * resets the facet count
 */
function resetFacetCount() {
  _.each(settings.facetStore, function(items, facetname) {
    _.each(items, function(value, itemname) {
      settings.facetStore[facetname][itemname].count = 0;
    });
  });
}

/**
 * Filters all items from the settings according to the currently 
 * set filters and stores the results in the settings.currentResults.
 * The number of items in each filter from each facet is also updated
 */
function filter() {
  // first apply the filters to the items
  settings.currentResults = _.select(settings.items, function(item) {
    var filtersApply = true;
    _.each(settings.state.filters, function(filter, facet) {
      if ($.isArray(item[facet])) {
         var inters = _.intersect(item[facet], filter);
         if (inters.length == 0) {
           filtersApply = false;
         }
      } else {
        if (filter.length && _.indexOf(filter, item[facet]) == -1) {
          filtersApply = false;
        }
      }
    });
    return filtersApply;
  });
  // Update the count for each facet and item:
  // intialize the count to be zero
  resetFacetCount();
  // then reduce the items to get the current count for each facet
  _.each(settings.facets, function(facettitle, facet) {
    _.each(settings.currentResults, function(item) {
      if ($.isArray(item[facet])) {
        _.each(item[facet], function(facetitem) {
          settings.facetStore[facet][facetitem].count += 1;
        });
      } else {
        if (item[facet] !== undefined) {
          settings.facetStore[facet][item[facet]].count += 1;
        }
      }
    });
  });
  // remove confusing 0 from facets where a filter has been set
  _.each(settings.state.filters, function(filters, facettitle) {
    _.each(settings.facetStore[facettitle], function(facet) {
      if (facet.count == 0 && settings.state.filters[facettitle].length) facet.count = "+";
    });
  });
  settings.state.shownResults = 0;
}

/**
 * Orders the currentResults according to the settings.state.orderBy variable
 */ 
function order() {
  if (settings.state.orderBy) {
    $(".activeorderby").removeClass("activeorderby");
    $('#orderby_'+settings.state.orderBy).addClass("activeorderby");
    settings.currentResults = _.sortBy(settings.currentResults, function(item) {
      if (settings.state.orderBy == 'RANDOM') {
        return Math.random()*10000;
      } else {
        return item[settings.state.orderBy];
      }
    });
  }
}

/**
 * The given facetname and filtername are activated or deactivated
 * depending on what they were beforehand. This causes the items to
 * be filtered again and the UI is updated accordingly.
 */
function toggleFilter(key, value) {
  settings.state.filters[key] = settings.state.filters[key] || [] ;
  if (_.indexOf(settings.state.filters[key], value) == -1) {
    settings.state.filters[key].push(value);
  } else {
    settings.state.filters[key] = _.without(settings.state.filters[key], value);
    if (settings.state.filters[key].length == 0) {
      delete settings.state.filters[key];
    }
  }
  filter();
}

/**
 * The following section contains the presentation of the faceted search
 */

/**
 * This function is only called once, it creates the facets ui.
 */
function createFacetUI() {
  var itemtemplate  = _.template(settings.listItemTemplate);
  var titletemplate = _.template(settings.facetTitleTemplate);
  var containertemplate = _.template(settings.facetContainer);
  
  $(settings.facetSelector).html("");
  _.each(settings.facets, function(facettitle, facet) {
    var facetHtml     = $(containertemplate({id: facet}));
    var facetItem     = {title: facettitle};
    var facetItemHtml = $(titletemplate(facetItem));

    facetHtml.append(facetItemHtml);
    var facetlist = $(settings.facetListContainer);
    _.each(settings.facetStore[facet], function(filter, filtername){
      var item = {id: filter.id, name: filtername, count: filter.count};
      var filteritem  = $(itemtemplate(item));
      if (_.indexOf(settings.state.filters[facet], filtername) >= 0) {
        filteritem.addClass("activefacet");
      }
      facetlist.append(filteritem);
    });
    facetHtml.append(facetlist);
    $(settings.facetSelector).append(facetHtml);
  });
  // add the click event handler to each facet item:
  $('.facetitem').click(function(event){
    var filter = getFilterById(this.id);
    toggleFilter(filter.facetname, filter.filtername);
    $(settings.facetSelector).trigger("facetedsearchfacetclick", filter);
    order();
    updateFacetUI();
    updateResults();
  });
  // Append total result count
  var bottom = $(settings.bottomContainer);
  countHtml = _.template(settings.countTemplate, {count: settings.currentResults.length});
  $(bottom).append(countHtml);
  // generate the "order by" options:
  var ordertemplate = _.template(settings.orderByTemplate);
  var itemHtml = $(ordertemplate({'options': settings.orderByOptions}));
  $(bottom).append(itemHtml);
  $(settings.facetSelector).append(bottom);
  $('.orderbyitem').each(function(){
    var id = this.id.substr(8);
    if (settings.state.orderBy == id) {
      $(this).addClass("activeorderby");
    }
  });
  // add the click event handler to each "order by" item:
  $('.orderbyitem').click(function(event){
    var id = this.id.substr(8);
    settings.state.orderBy = id;
    $(settings.facetSelector).trigger("facetedsearchorderby", id);
    settings.state.shownResults = 0;
    order();
    updateResults();
  });
  // Append deselect filters button
  var deselect = $(settings.deselectTemplate).click(function(event){
    settings.state.filters = {};
    jQuery.facetUpdate();
  });
  $(bottom).append(deselect);
  $(settings.facetSelector).trigger("facetuicreated");
}

/**
 * get a facetname and filtername by the unique id that is created in the beginning
 */
function getFilterById(id) {
  var result = false;
  _.each(settings.facetStore, function(facet, facetname) {
    _.each(facet, function(filter, filtername){
      if (filter.id == id) {
        result =  {'facetname': facetname, 'filtername': filtername};
      }
    });
  });
  return result;
}

/**
 * This function is only called whenever a filter has been added or removed
 * It adds a class to the active filters and shows the correct number for each
 */
function updateFacetUI() {
  var itemtemplate = _.template(settings.listItemTemplate);
  _.each(settings.facetStore, function(facet, facetname) {
    _.each(facet, function(filter, filtername){
      var item = {id: filter.id, name: filtername, count: filter.count};
      var filteritem  = $(itemtemplate(item)).html();
      $("#"+filter.id).html(filteritem);
      if (settings.state.filters[facetname] && _.indexOf(settings.state.filters[facetname], filtername) >= 0) {
        $("#"+filter.id).addClass("activefacet");
      } else {
        $("#"+filter.id).removeClass("activefacet");
      }
    });
  });
  countHtml = _.template(settings.countTemplate, {count: settings.currentResults.length});
  $(settings.facetSelector + ' .facettotalcount').replaceWith(countHtml);
}

/**
 * Updates the the list of results according to the filters that have been set
 */
function updateResults() {
  $(settings.resultSelector).html(settings.currentResults.length == 0 ? settings.noResults : "");
  showMoreResults();
}

var moreButton;
function showMoreResults() {
  var showNowCount = 
      settings.enablePagination ? 
      Math.min(settings.currentResults.length - settings.state.shownResults, settings.paginationCount) : 
      settings.currentResults.length;
  var itemHtml = "";
  var template = _.template(settings.resultTemplate);
  for (var i = settings.state.shownResults; i < settings.state.shownResults + showNowCount; i++) {
    var item = $.extend(settings.currentResults[i], {
      totalItemNr    : i,
      batchItemNr    : i - settings.state.shownResults,
      batchItemCount : showNowCount
    });
    var itemHtml = itemHtml + template(item);
  }
  $(settings.resultSelector).append(itemHtml);
  if (!moreButton) {
    moreButton = $(settings.showMoreTemplate).click(showMoreResults);
    $(settings.resultSelector).after(moreButton);
  }
  if (settings.state.shownResults == 0) {
    moreButton.show();
  }
  settings.state.shownResults += showNowCount;
  if (settings.state.shownResults == settings.currentResults.length) {
    $(moreButton).hide();
  }
  $(settings.resultSelector).trigger("facetedsearchresultupdate");
}

})();
