/*!
* ember-table v0.2.3
* Copyright 2012-2014 Addepar Inc.
* See LICENSE.
*/
(function() {

var _ref;


})();
(function() {

Ember.TEMPLATES["body-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.LazyTableBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'contentBinding': ("controller.bodyContent"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'numItemsShowingBinding': ("controller._numItemsShowing"),
    'scrollTopBinding': ("controller._scrollTop"),
    'startIndexBinding': ("controller._startIndex")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n      ");
  return buffer;
  }

  data.buffer.push("<div class=\"antiscroll-box\">\n  <div class=\"antiscroll-inner\">\n    <div class=\"ember-table-table-scrollable-wrapper\">\n      ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.LazyTableBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'contentBinding': ("controller.bodyContent"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'numItemsShowingBinding': ("controller._numItemsShowing"),
    'scrollTopBinding': ("controller._scrollTop"),
    'startIndexBinding': ("controller._startIndex")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    </div>\n  </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/ember-table"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.FooterTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "controller.hasHeader", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.BodyTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  stack1 = helpers['if'].call(depth0, "controller.hasFooter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ScrollContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ColumnSortableIndicator", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["footer-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.TableBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'contentBinding': ("controller.footerContent"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'heightBinding': ("controller.footerHeight")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.TableBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'contentBinding': ("controller.footerContent"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'heightBinding': ("controller.footerHeight")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["header-cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"ember-table-content-container\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortByColumn", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.content.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["header-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'heightBinding': ("controller.headerHeight")
  },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'heightBinding': ("controller.headerHeight")
  },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["header-row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.MultiItemViewCollectionView", {hash:{
    'contentBinding': ("view.content"),
    'itemViewClassField': ("headerCellViewClass"),
    'widthBinding': ("controller._tableColumnsWidth")
  },hashTypes:{'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["scroll-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"antiscroll-wrap\">\n  <div class=\"antiscroll-inner\">\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ScrollPanel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["table-cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<span class=\"ember-table-content\">\n  ");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>");
  return buffer;
  
});

Ember.TEMPLATES["table-row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.MultiItemViewCollectionView", {hash:{
    'rowBinding': ("view.row"),
    'contentBinding': ("view.columns"),
    'itemViewClassField': ("tableCellViewClass"),
    'widthBinding': ("controller._tableColumnsWidth")
  },hashTypes:{'rowBinding': "STRING",'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'rowBinding': depth0,'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

})();
(function() {

Ember.Table = Ember.Namespace.create();

Ember.Table.VERSION = '0.2.3';

if ((_ref = Ember.libraries) != null) {
  _ref.register('Ember Table', Ember.Table.VERSION);
}


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.ResizeHandlerMixin = Ember.Mixin.create({
  resizeEndDelay: 200,
  resizing: false,
  onResizeStart: Ember.K,
  onResizeEnd: Ember.K,
  onResize: Ember.K,
  endResize: Ember.computed(function() {
    return function(event) {
      if (this.isDestroyed) {
        return;
      }
      this.set('resizing', false);
      return typeof this.onResizeEnd === "function" ? this.onResizeEnd(event) : void 0;
    };
  }),
  handleWindowResize: function(event) {
    if (!this.get('resizing')) {
      this.set('resizing', true);
      if (typeof this.onResizeStart === "function") {
        this.onResizeStart(event);
      }
    }
    if (typeof this.onResize === "function") {
      this.onResize(event);
    }
    return Ember.run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
  },
  didInsertElement: function() {
    this._super();
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    this._removeDocumentHandlers();
    return this._super();
  },
  _setupDocumentHandlers: function() {
    if (this._resizeHandler) {
      return;
    }
    this._resizeHandler = jQuery.proxy(this.get('handleWindowResize'), this);
    return jQuery(window).on("resize." + this.elementId, this._resizeHandler);
  },
  _removeDocumentHandlers: function() {
    jQuery(window).off("resize." + this.elementId, this._resizeHandler);
    return this._resizeHandler = null;
  }
});


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.StyleBindingsMixin = Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings: ['style'],
  unitType: 'px',
  createStyleString: function(styleName, property) {
    var value;
    value = this.get(property);
    if (Ember.isNone(value)) {
      return;
    }
    if (Ember.typeOf(value) === 'number') {
      value = value + this.get('unitType');
    }
    return Ember.String.dasherize("" + styleName) + ":" + value + ";";
  },
  applyStyleBindings: function() {
    var lookup, properties, styleBindings, styleComputed, styles,
      _this = this;
    styleBindings = this.styleBindings;
    if (!styleBindings) {
      return;
    }
    lookup = {};
    styleBindings.forEach(function(binding) {
      var property, style, tmp;
      tmp = binding.split(':');
      property = tmp[0];
      style = tmp[1];
      lookup[style || property] = property;
    });
    styles = Ember.keys(lookup);
    properties = styles.map(function(style) {
      return lookup[style];
    });
    styleComputed = Ember.computed(function() {
      var styleString, styleTokens;
      styleTokens = styles.map(function(style) {
        return _this.createStyleString(style, lookup[style]);
      });
      styleString = styleTokens.join('');
      if (styleString.length !== 0) {
        return styleString;
      }
    });
    styleComputed.property.apply(styleComputed, properties);
    return Ember.defineProperty(this, 'style', styleComputed);
  },
  init: function() {
    this.applyStyleBindings();
    return this._super();
  }
});


})();
(function() {

/*
jQuery.browser shim that makes HT working with jQuery 1.8+
*/

if (!jQuery.browser) {
  (function() {
    var browser, matched, res;
    matched = void 0;
    browser = void 0;
    jQuery.uaMatch = function(ua) {
      var match;
      ua = ua.toLowerCase();
      match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    };
    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};
    if (matched.browser) {
      browser[matched.browser] = true;
      browser.version = matched.version;
    }
    if (browser.chrome) {
      browser.webkit = true;
    } else {
      if (browser.webkit) {
        browser.safari = true;
      }
    }
    res = jQuery.browser = browser;
    return res;
  })();
}


})();
(function() {


Ember.LazyContainerView = Ember.ContainerView.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: 'lazy-list-container',
  styleBindings: ['height'],
  content: null,
  itemViewClass: null,
  rowHeight: null,
  scrollTop: null,
  startIndex: null,
  init: function() {
    this._super();
    return this.onNumChildViewsDidChange();
  },
  height: Ember.computed(function() {
    return this.get('content.length') * this.get('rowHeight');
  }).property('content.length', 'rowHeight'),
  numChildViews: Ember.computed(function() {
    return this.get('numItemsShowing') + 2;
  }).property('numItemsShowing'),
  onNumChildViewsDidChange: Ember.observer(function() {
    var itemViewClass, newNumViews, numViewsToInsert, oldNumViews, view, viewsToAdd, viewsToRemove, _i, _results;
    view = this;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    newNumViews = this.get('numChildViews');
    if (!(itemViewClass && newNumViews)) {
      return;
    }
    oldNumViews = this.get('length');
    numViewsToInsert = newNumViews - oldNumViews;
    if (numViewsToInsert < 0) {
      viewsToRemove = this.slice(newNumViews, oldNumViews);
      return this.removeObjects(viewsToRemove);
    } else if (numViewsToInsert > 0) {
      viewsToAdd = (function() {
        _results = [];
        for (var _i = 0; 0 <= numViewsToInsert ? _i < numViewsToInsert : _i > numViewsToInsert; 0 <= numViewsToInsert ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function() {
        return view.createChildView(itemViewClass);
      });
      return this.pushObjects(viewsToAdd);
    }
  }, 'numChildViews', 'itemViewClass'),
  viewportDidChange: Ember.observer(function() {
    var clength, content, numShownViews, startIndex;
    content = this.get('content') || [];
    clength = content.get('length');
    numShownViews = Math.min(this.get('length'), clength);
    startIndex = this.get('startIndex');
    if (startIndex + numShownViews >= clength) {
      startIndex = clength - numShownViews;
    }
    if (startIndex < 0) {
      startIndex = 0;
    }
    return this.forEach(function(childView, i) {
      var item, itemIndex;
      if (i >= numShownViews) {
        childView = this.objectAt(i);
        childView.set('content', null);
        return;
      }
      itemIndex = startIndex + i;
      childView = this.objectAt(itemIndex % numShownViews);
      item = content.objectAt(itemIndex);
      if (item !== childView.get('content')) {
        childView.teardownContent();
        childView.set('itemIndex', itemIndex);
        childView.set('content', item);
        return childView.prepareContent();
      }
    }, this);
  }, 'content.length', 'length', 'startIndex')
});

/**
 * Lazy Item View
 * @class
 * @alias Ember.LazyItemView
*/


Ember.LazyItemView = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  itemIndex: null,
  prepareContent: Ember.K,
  teardownContent: Ember.K,
  rowHeightBinding: 'parentView.rowHeight',
  styleBindings: ['width', 'top', 'display'],
  top: Ember.computed(function() {
    return this.get('itemIndex') * this.get('rowHeight');
  }).property('itemIndex', 'rowHeight'),
  display: Ember.computed(function() {
    if (!this.get('content')) {
      return 'none';
    }
  }).property('content')
});


})();
(function() {

/**
 * Multi Item View Collection View
 * @class
 * @alias Ember.Table.MultiItemViewCollectionView
*/

Ember.MultiItemViewCollectionView = Ember.CollectionView.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  styleBindings: 'width',
  itemViewClassField: null,
  createChildView: function(view, attrs) {
    var itemViewClass, itemViewClassField;
    itemViewClassField = this.get('itemViewClassField');
    itemViewClass = attrs.content.get(itemViewClassField);
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    return this._super(itemViewClass, attrs);
  }
});

Ember.MouseWheelHandlerMixin = Ember.Mixin.create({
  onMouseWheel: Ember.K,
  didInsertElement: function() {
    var _this = this;
    this._super();
    return this.$().bind('mousewheel', function(event, delta, deltaX, deltaY) {
      return Ember.run(_this, _this.onMouseWheel, event, delta, deltaX, deltaY);
    });
  },
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.$()) != null) {
      _ref.unbind('mousewheel');
    }
    return this._super();
  }
});

Ember.ScrollHandlerMixin = Ember.Mixin.create({
  onScroll: Ember.K,
  scrollElementSelector: '',
  didInsertElement: function() {
    var _this = this;
    this._super();
    return this.$(this.get('scrollElementSelector')).bind('scroll', function(event) {
      return Ember.run(_this, _this.onScroll, event);
    });
  },
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.$(this.get('scrollElementSelector'))) != null) {
      _ref.unbind('scroll');
    }
    return this._super();
  }
});

Ember.TouchMoveHandlerMixin = Ember.Mixin.create({
  onTouchMove: Ember.K,
  didInsertElement: function() {
    var startX, startY,
      _this = this;
    this._super();
    startX = startY = 0;
    this.$().bind('touchstart', function(event) {
      startX = event.originalEvent.targetTouches[0].pageX;
      startY = event.originalEvent.targetTouches[0].pageY;
    });
    return this.$().bind('touchmove', function(event) {
      var deltaX, deltaY, newX, newY;
      newX = event.originalEvent.targetTouches[0].pageX;
      newY = event.originalEvent.targetTouches[0].pageY;
      deltaX = -(newX - startX);
      deltaY = -(newY - startY);
      Ember.run(_this, _this.onTouchMove, event, deltaX, deltaY);
      startX = newX;
      startY = newY;
    });
  },
  willDestroy: function() {
    var _ref;
    if ((_ref = this.$()) != null) {
      _ref.unbind('touchmove');
    }
    return this._super();
  }
});

/**
* Table Row Array Proxy
* @class
* @alias Ember.Table.RowArrayProxy
*/


Ember.Table.RowArrayController = Ember.ArrayController.extend({
  itemController: null,
  content: null,
  rowContent: Ember.computed(function() {
    return [];
  }).property(),
  controllerAt: function(idx, object, controllerClass) {
    var container, subController, subControllers;
    container = this.get('container');
    subControllers = this.get('_subControllers');
    subController = subControllers[idx];
    if (subController) {
      return subController;
    }
    subController = this.get('itemController').create({
      target: this,
      parentController: this.get('parentController') || this,
      content: object
    });
    subControllers[idx] = subController;
    return subController;
  }
});

Ember.Table.ShowHorizontalScrollMixin = Ember.Mixin.create({
  mouseEnter: function(event) {
    var $horizontalScroll, $tablesContainer;
    $tablesContainer = $(event.target).parents('.ember-table-tables-container');
    $horizontalScroll = $tablesContainer.find('.antiscroll-scrollbar-horizontal');
    return $horizontalScroll.addClass('antiscroll-scrollbar-shown');
  },
  mouseLeave: function(event) {
    var $horizontalScroll, $tablesContainer;
    $tablesContainer = $(event.target).parents('.ember-table-tables-container');
    $horizontalScroll = $tablesContainer.find('.antiscroll-scrollbar-horizontal');
    return $horizontalScroll.removeClass('antiscroll-scrollbar-shown');
  }
});


})();
(function() {


Ember.Table.ColumnDefinition = Ember.Object.extend({
  headerCellName: void 0,
  contentPath: void 0,
  minWidth: void 0,
  maxWidth: void 0,
  defaultColumnWidth: 150,
  isResizable: true,
  isSortable: true,
  textAlign: 'text-align-right',
  canAutoResize: true,
  headerCellView: 'Ember.Table.HeaderCell',
  headerCellViewClass: Ember.computed.alias('headerCellView'),
  tableCellView: 'Ember.Table.TableCell',
  tableCellViewClass: Ember.computed.alias('tableCellView'),
  getCellContent: function(row) {
    var path;
    path = this.get('contentPath');
    Ember.assert("You must either provide a contentPath or override " + "getCellContent in your column definition", path != null);
    return Ember.get(row, path);
  },
  setCellContent: Ember.K,
  columnWidth: Ember.computed.oneWay('defaultColumnWidth'),
  resize: function(width) {
    return this.set('columnWidth', width);
  }
});


})();
(function() {


Ember.Table.Row = Ember.ObjectProxy.extend({
  content: null,
  isSelected: Ember.computed(function(key, val) {
    if (arguments.length > 1) {
      this.get('parentController').setSelected(this, val);
    }
    return this.get('parentController').isSelected(this);
  }).property('parentController._selection.[]'),
  isShowing: true,
  isHovered: false
});


})();
(function() {


Ember.Table.TableContainer = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: ['ember-table-table-container'],
  styleBindings: ['height', 'width']
});

Ember.Table.TableBlock = Ember.CollectionView.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: ['ember-table-table-block'],
  styleBindings: ['width', 'height'],
  itemViewClass: Ember.computed.alias('controller.tableRowViewClass'),
  columns: null,
  content: null,
  scrollLeft: null,
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft'),
  height: Ember.computed(function() {
    return this.get('controller._headerHeight');
  }).property('controller._headerHeight')
});

Ember.Table.LazyTableBlock = Ember.LazyContainerView.extend({
  classNames: ['ember-table-table-block'],
  styleBindings: ['width'],
  itemViewClass: Ember.computed.alias('controller.tableRowViewClass'),
  rowHeight: Ember.computed.alias('controller.rowHeight'),
  columns: null,
  content: null,
  scrollLeft: null,
  scrollTop: null,
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft')
});

Ember.Table.TableRow = Ember.LazyItemView.extend({
  templateName: 'table-row',
  classNames: 'ember-table-table-row',
  classNameBindings: ['row.isHovered:ember-table-hover', 'row.isSelected:ember-table-selected', 'row.rowStyle', 'isLastRow:ember-table-last-row'],
  styleBindings: ['width', 'height'],
  row: Ember.computed.alias('content'),
  columns: Ember.computed.alias('parentView.columns'),
  width: Ember.computed.alias('controller._rowWidth'),
  height: Ember.computed.alias('controller.rowHeight'),
  isLastRow: Ember.computed(function() {
    return this.get('row') === this.get('controller.bodyContent.lastObject');
  }).property('controller.bodyContent.lastObject', 'row'),
  mouseEnter: function(event) {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', true);
    }
  },
  mouseLeave: function(event) {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', false);
    }
  },
  teardownContent: function() {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', false);
    }
  }
});

Ember.Table.TableCell = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  templateName: 'table-cell',
  classNames: ['ember-table-cell'],
  classNameBindings: 'column.textAlign',
  styleBindings: 'width',
  init: function() {
    this._super();
    this.contentPathDidChange();
    return this.contentDidChange();
  },
  row: Ember.computed.alias('parentView.row'),
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.columnWidth'),
  contentDidChange: function() {
    return this.notifyPropertyChange('cellContent');
  },
  contentPathWillChange: (function() {
    var contentPath;
    contentPath = this.get('column.contentPath');
    if (contentPath) {
      return this.removeObserver("row." + contentPath, this, this.contentDidChange);
    }
  }).observesBefore('column.contentPath'),
  contentPathDidChange: (function() {
    var contentPath;
    contentPath = this.get('column.contentPath');
    if (contentPath) {
      return this.addObserver("row." + contentPath, this, this.contentDidChange);
    }
  }).observesBefore('column.contentPath'),
  cellContent: Ember.computed(function(key, value) {
    var column, row;
    row = this.get('row');
    column = this.get('column');
    if (!(row && column)) {
      return;
    }
    if (arguments.length === 1) {
      value = column.getCellContent(row);
    } else {
      column.setCellContent(row, value);
    }
    return value;
  }).property('row.isLoaded', 'column')
});

Ember.Table.HeaderBlock = Ember.Table.TableBlock.extend({
  classNames: ['ember-table-header-block'],
  itemViewClass: 'Ember.Table.HeaderRow',
  content: Ember.computed(function() {
    return [this.get('columns')];
  }).property('columns')
});

Ember.Table.HeaderRow = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  templateName: 'header-row',
  classNames: ['ember-table-table-row', 'ember-table-header-row'],
  styleBindings: ['width'],
  columns: Ember.computed.alias('content'),
  width: Ember.computed.alias('controller._rowWidth'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  sortableOption: Ember.computed(function() {
    return {
      axis: 'x',
      containment: 'parent',
      cursor: 'move',
      helper: 'clone',
      items: ".ember-table-header-cell.sortable",
      opacity: 0.9,
      placeholder: 'ui-state-highlight',
      scroll: true,
      tolerance: 'intersect',
      update: jQuery.proxy(this.onColumnSortDone, this),
      stop: jQuery.proxy(this.onColumnSortStop, this),
      sort: jQuery.proxy(this.onColumnSortChange, this)
    };
  }),
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft'),
  didInsertElement: function() {
    this._super();
    if (this.get('controller.enableColumnReorder')) {
      return this.$('> div').sortable(this.get('sortableOption'));
    }
  },
  onScroll: function(event) {
    this.set('scrollLeft', event.target.scrollLeft);
    return event.preventDefault();
  },
  onColumnSortStop: function(event, ui) {
    return this.set('controller._isShowingSortableIndicator', false);
  },
  onColumnSortChange: function(event, ui) {
    var left;
    left = this.$('.ui-state-highlight').offset().left - this.$().closest('.ember-table-tables-container').offset().left;
    this.set('controller._isShowingSortableIndicator', true);
    return this.set('controller._sortableIndicatorLeft', left);
  },
  onColumnSortDone: function(event, ui) {
    var column, newIndex, view;
    newIndex = ui.item.index();
    view = Ember.View.views[ui.item.attr('id')];
    column = view.get('column');
    this.get('controller').onColumnSort(column, newIndex);
    return this.set('controller._isShowingSortableIndicator', false);
  }
});

Ember.Table.HeaderCell = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  templateName: 'header-cell',
  classNames: ['ember-table-cell', 'ember-table-header-cell'],
  classNameBindings: ['column.isSortable:sortable', 'column.textAlign'],
  styleBindings: ['width', 'height'],
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.columnWidth'),
  height: Ember.computed(function() {
    return this.get('controller._headerHeight');
  }).property('controller._headerHeight'),
  resizableOption: Ember.computed(function() {
    return {
      handles: 'e',
      minHeight: 40,
      minWidth: this.get('column.minWidth') || 100,
      maxWidth: this.get('column.maxWidth') || 500,
      grid: this.get('column.snapGrid'),
      resize: jQuery.proxy(this.onColumnResize, this),
      stop: jQuery.proxy(this.onColumnResize, this)
    };
  }),
  didInsertElement: function() {
    this.elementSizeDidChange();
    if (this.get('column.isResizable')) {
      this.$().resizable(this.get('resizableOption'));
      this._resizableWidget = this.$().resizable('widget');
    }
  },
  onColumnResize: function(event, ui) {
    this.elementSizeDidChange();
    if (this.get('controller.forceFillColumns') && this.get('controller.columns').filterProperty('canAutoResize').length > 1) {
      this.set('column.canAutoResize', false);
    }
    return this.get("column").resize(ui.size.width);
  },
  elementSizeDidChange: function() {
    var maxHeight;
    maxHeight = 0;
    $('.ember-table-header-block .ember-table-content').each(function() {
      var thisHeight;
      thisHeight = $(this).outerHeight();
      if (thisHeight > maxHeight) {
        return maxHeight = thisHeight;
      }
    });
    this.set('controller._contentHeaderHeight', maxHeight);
  }
});

Ember.Table.ColumnSortableIndicator = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: 'ember-table-column-sortable-indicator',
  classNameBindings: 'controller._isShowingSortableIndicator:active',
  styleBindings: ['left', 'height'],
  left: Ember.computed.alias('controller._sortableIndicatorLeft'),
  height: Ember.computed.alias('controller._height')
});

Ember.Table.HeaderTableContainer = Ember.Table.TableContainer.extend(Ember.Table.ShowHorizontalScrollMixin, {
  templateName: 'header-container',
  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-header-container'],
  height: Ember.computed.alias('controller._headerHeight'),
  width: Ember.computed.alias('controller._tableContainerWidth')
});

Ember.Table.BodyTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin, Ember.ScrollHandlerMixin, Ember.Table.ShowHorizontalScrollMixin, {
  templateName: 'body-container',
  classNames: ['ember-table-table-container', 'ember-table-body-container', 'antiscroll-wrap'],
  height: Ember.computed.alias('controller._bodyHeight'),
  width: Ember.computed.alias('controller._width'),
  scrollTop: Ember.computed.alias('controller._tableScrollTop'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  scrollElementSelector: '.antiscroll-inner',
  onScroll: function(event) {
    this.set('scrollTop', event.target.scrollTop);
    return event.preventDefault();
  },
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});

Ember.Table.FooterTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin, Ember.Table.ShowHorizontalScrollMixin, {
  templateName: 'footer-container',
  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-footer-container'],
  styleBindings: 'top',
  height: Ember.computed.alias('controller.footerHeight'),
  width: Ember.computed.alias('controller._tableContainerWidth'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  top: Ember.computed(function() {
    var bodyHeight, contentHeight, headerHeight;
    headerHeight = this.get('controller._headerHeight');
    contentHeight = this.get('controller._tableContentHeight') + headerHeight;
    bodyHeight = this.get('controller._bodyHeight') + headerHeight;
    if (contentHeight < bodyHeight) {
      return contentHeight;
    } else {
      return bodyHeight;
    }
  }).property('controller._bodyHeight', 'controller._headerHeight', 'controller._tableContentHeight'),
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});

Ember.Table.ScrollContainer = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.ScrollHandlerMixin, {
  templateName: 'scroll-container',
  classNames: ['ember-table-scroll-container'],
  styleBindings: ['left', 'width', 'height'],
  scrollElementSelector: '.antiscroll-inner',
  width: Ember.computed.alias('controller._scrollContainerWidth'),
  height: 10,
  left: Ember.computed.alias('controller._fixedColumnsWidth'),
  scrollTop: Ember.computed.alias('controller._tableScrollTop'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  didInsertElement: function() {
    this._super();
    return this.onScrollLeftDidChange();
  },
  onScroll: function(event) {
    this.set('scrollLeft', event.target.scrollLeft);
    return event.preventDefault();
  },
  onScrollLeftDidChange: Ember.observer(function() {
    var selector;
    selector = this.get('scrollElementSelector');
    return this.$(selector).scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft', 'scrollElementSelector')
});

Ember.Table.ScrollPanel = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: ['ember-table-scroll-panel'],
  styleBindings: ['width', 'height'],
  width: Ember.computed.alias('controller._tableColumnsWidth'),
  height: Ember.computed.alias('controller._tableContentHeight')
});


})();
(function() {


Ember.Table.EmberTableComponent = Ember.Component.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.AddeparMixins.ResizeHandlerMixin, {
  layoutName: 'components/ember-table',
  classNames: ['ember-table-tables-container'],
  classNameBindings: ['enableContentSelection:ember-table-content-selectable'],
  styleBindings: ['height'],
  content: null,
  columns: null,
  numFixedColumns: 0,
  numFooterRow: 0,
  rowHeight: 30,
  minHeaderHeight: 30,
  footerHeight: 30,
  hasHeader: true,
  hasFooter: true,
  forceFillColumns: false,
  enableColumnReorder: true,
  enableContentSelection: false,
  selectionMode: 'single',
  selection: Ember.computed(function(key, val) {
    var content, _i, _len, _ref, _ref1;
    if (arguments.length > 1 && val) {
      if (this.get('selectionMode') === 'single') {
        this.get('persistedSelection').clear();
        this.get('persistedSelection').add(this.findRow(val));
      } else {
        this.get('persistedSelection').clear();
        for (_i = 0, _len = val.length; _i < _len; _i++) {
          content = val[_i];
          this.get('persistedSelection').add(this.findRow(content));
        }
      }
      this.get('rangeSelection').clear();
    }
    if (this.get('selectionMode') === 'single') {
      return (_ref = this.get('_selection')) != null ? (_ref1 = _ref[0]) != null ? _ref1.get('content') : void 0 : void 0;
    } else {
      return this.get('_selection').toArray().map(function(row) {
        return row.get('content');
      });
    }
  }).property('_selection.[]', 'selectionMode'),
  init: function() {
    this._super();
    if (!$.ui) {
      throw 'Missing dependency: jquery-ui';
    }
    if (!$().mousewheel) {
      throw 'Missing dependency: jquery-mousewheel';
    }
    if (!$().antiscroll) {
      throw 'Missing dependency: antiscroll.js';
    }
  },
  actions: {
    addColumn: Ember.K,
    sortByColumn: Ember.K
  },
  height: Ember.computed.alias('_tablesContainerHeight'),
  tableRowView: 'Ember.Table.TableRow',
  tableRowViewClass: Ember.computed.alias('tableRowView'),
  onColumnSort: function(column, newIndex) {
    var columns;
    columns = this.get('tableColumns');
    columns.removeObject(column);
    return columns.insertAt(newIndex, column);
  },
  bodyContent: Ember.computed(function() {
    return Ember.Table.RowArrayController.create({
      target: this,
      parentController: this,
      container: this.get('container'),
      itemController: Ember.Table.Row,
      content: this.get('content')
    });
  }).property('content'),
  footerContent: Ember.computed(function(key, value) {
    if (value) {
      return value;
    } else {
      return Ember.A();
    }
  }).property(),
  fixedColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    columns = columns.slice(0, numFixedColumns) || [];
    this.prepareTableColumns(columns);
    return columns;
  }).property('columns.@each', 'numFixedColumns'),
  tableColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    columns = columns.slice(numFixedColumns, columns.get('length')) || [];
    this.prepareTableColumns(columns);
    return columns;
  }).property('columns.@each', 'numFixedColumns'),
  prepareTableColumns: function(columns) {
    return columns.setEach('controller', this);
  },
  didInsertElement: function() {
    this._super();
    this.set('_tableScrollTop', 0);
    return this.elementSizeDidChange();
  },
  onResizeEnd: function() {
    return Ember.run(this, this.elementSizeDidChange);
  },
  elementSizeDidChange: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.set('_width', this.$().parent().outerWidth());
    this.set('_height', this.$().parent().outerHeight());
    return Ember.run.next(this, this.updateLayout);
  },
  updateLayout: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.$('.antiscroll-wrap').antiscroll().data('antiscroll').rebuild();
    if (this.get('forceFillColumns')) {
      return this.doForceFillColumns();
    }
  },
  doForceFillColumns: function() {
    var additionWidthPerColumn, availableContentWidth, columnsToResize, contentWidth, fixedColumnsWidth, remainingWidth, tableColumns, totalWidth;
    totalWidth = this.get('_width');
    fixedColumnsWidth = this.get('_fixedColumnsWidth');
    tableColumns = this.get('tableColumns');
    contentWidth = this._getTotalWidth(tableColumns);
    availableContentWidth = totalWidth - fixedColumnsWidth;
    remainingWidth = availableContentWidth - contentWidth;
    columnsToResize = tableColumns.filterProperty('canAutoResize');
    additionWidthPerColumn = Math.floor(remainingWidth / columnsToResize.length);
    return columnsToResize.forEach(function(column) {
      var columnWidth;
      columnWidth = column.get('columnWidth') + additionWidthPerColumn;
      return column.set('columnWidth', columnWidth);
    });
  },
  onBodyContentLengthDidChange: Ember.observer(function() {
    return Ember.run.next(this, function() {
      return Ember.run.once(this, this.updateLayout);
    });
  }, 'bodyContent.length'),
  _tableScrollTop: 0,
  _tableScrollLeft: 0,
  _width: null,
  _height: null,
  _contentHeaderHeight: null,
  _hasVerticalScrollbar: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (height < contentHeight) {
      return true;
    } else {
      return false;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _hasHorizontalScrollbar: Ember.computed(function() {
    var contentWidth, tableWidth;
    contentWidth = this.get('_tableColumnsWidth');
    tableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > tableWidth) {
      return true;
    } else {
      return false;
    }
  }).property('_tableColumnsWidth', '_width', '_fixedColumnsWidth'),
  _tablesContainerHeight: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (contentHeight < height) {
      return contentHeight;
    } else {
      return height;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _fixedColumnsWidth: Ember.computed(function() {
    return this._getTotalWidth(this.get('fixedColumns'));
  }).property('fixedColumns.@each.columnWidth'),
  _tableColumnsWidth: Ember.computed(function() {
    var availableWidth, contentWidth;
    contentWidth = (this._getTotalWidth(this.get('tableColumns'))) + 3;
    availableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > availableWidth) {
      return contentWidth;
    } else {
      return availableWidth;
    }
  }).property('tableColumns.@each.columnWidth', '_width', '_fixedColumnsWidth'),
  _rowWidth: Ember.computed(function() {
    var columnsWidth, nonFixedTableWidth;
    columnsWidth = this.get('_tableColumnsWidth');
    nonFixedTableWidth = this.get('_tableContainerWidth') - this.get('_fixedColumnsWidth');
    if (columnsWidth < nonFixedTableWidth) {
      return nonFixedTableWidth;
    }
    return columnsWidth;
  }).property('_fixedColumnsWidth', '_tableColumnsWidth', '_tableContainerWidth'),
  _headerHeight: Ember.computed(function() {
    var contentHeaderHeight, minHeight;
    minHeight = this.get('minHeaderHeight');
    contentHeaderHeight = this.get('_contentHeaderHeight');
    if (contentHeaderHeight < minHeight) {
      return minHeight;
    } else {
      return contentHeaderHeight;
    }
  }).property('_contentHeaderHeight', 'minHeaderHeight'),
  _footerHeight: Ember.computed(function() {
    if (this.get('hasFooter')) {
      return this.get('footerHeight');
    } else {
      return 0;
    }
  }).property('footerHeight', 'hasFooter'),
  _bodyHeight: Ember.computed(function() {
    var bodyHeight;
    bodyHeight = this.get('_tablesContainerHeight');
    if (this.get('hasHeader')) {
      bodyHeight -= this.get('_headerHeight');
    }
    if (this.get('hasFooter')) {
      bodyHeight -= this.get('footerHeight');
    }
    return bodyHeight;
  }).property('_tablesContainerHeight', '_hasHorizontalScrollbar', '_headerHeight', 'footerHeight', 'hasHeader', 'hasFooter'),
  _tableBlockWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _fixedBlockWidthBinding: '_fixedColumnsWidth',
  _tableContentHeight: Ember.computed(function() {
    return this.get('rowHeight') * this.get('bodyContent.length');
  }).property('rowHeight', 'bodyContent.length'),
  _tableContainerWidth: Ember.computed(function() {
    return this.get('_width');
  }).property('_width'),
  _scrollContainerWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _numItemsShowing: Ember.computed(function() {
    return Math.floor(this.get('_bodyHeight') / this.get('rowHeight'));
  }).property('_bodyHeight', 'rowHeight'),
  _startIndex: Ember.computed(function() {
    var index, numContent, numViews, rowHeight, scrollTop;
    numContent = this.get('bodyContent.length');
    numViews = this.get('_numItemsShowing');
    rowHeight = this.get('rowHeight');
    scrollTop = this.get('_tableScrollTop');
    index = Math.floor(scrollTop / rowHeight);
    if (index + numViews >= numContent) {
      index = numContent - numViews;
    }
    if (index < 0) {
      return 0;
    } else {
      return index;
    }
  }).property('bodyContent.length', '_numItemsShowing', 'rowHeight', '_tableScrollTop'),
  _getTotalWidth: function(columns, columnWidthPath) {
    var widths;
    if (columnWidthPath == null) {
      columnWidthPath = 'columnWidth';
    }
    if (!columns) {
      return 0;
    }
    widths = columns.getEach(columnWidthPath) || [];
    return widths.reduce((function(total, w) {
      return total + w;
    }), 0);
  },
  isSelected: function(row) {
    return this.get('_selection').contains(row);
  },
  setSelected: function(row, val) {
    this.persistSelection();
    if (val) {
      return this.get('persistedSelection').add(row);
    } else {
      return this.get('persistedSelection').remove(row);
    }
  },
  persistedSelection: Ember.computed(function() {
    return new Ember.Set();
  }),
  rangeSelection: Ember.computed(function() {
    return new Ember.Set();
  }),
  _selection: Ember.computed(function() {
    return this.get('persistedSelection').copy().addEach(this.get('rangeSelection'));
  }).property('persistedSelection.[]', 'rangeSelection.[]'),
  click: function(event) {
    var curIndex, lastIndex, maxIndex, minIndex, row;
    row = this.getRowForEvent(event);
    if (!row) {
      return;
    }
    if (this.get('selectionMode') === 'none') {
      return;
    }
    if (this.get('selectionMode') === 'single') {
      this.get('persistedSelection').clear();
      return this.get('persistedSelection').add(row);
    } else {
      if (event.shiftKey) {
        this.get('rangeSelection').clear();
        lastIndex = this.rowIndex(this.get('lastSelected'));
        curIndex = this.rowIndex(this.getRowForEvent(event));
        minIndex = Math.min(lastIndex, curIndex);
        maxIndex = Math.max(lastIndex, curIndex);
        return this.get('rangeSelection').addObjects(this.get('bodyContent').slice(minIndex, maxIndex + 1));
      } else {
        if (!event.ctrlKey && !event.metaKey) {
          this.get('persistedSelection').clear();
          this.get('rangeSelection').clear();
        } else {
          this.persistSelection();
        }
        if (this.get('persistedSelection').contains(row)) {
          this.get('persistedSelection').remove(row);
        } else {
          this.get('persistedSelection').add(row);
        }
        return this.set('lastSelected', row);
      }
    }
  },
  findRow: function(content) {
    var row, _i, _len, _ref;
    _ref = this.get('bodyContent');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      if (row.get('content') === content) {
        return row;
      }
    }
  },
  rowIndex: function(row) {
    var _ref;
    return (_ref = this.get('bodyContent')) != null ? _ref.indexOf(row) : void 0;
  },
  persistSelection: function() {
    this.get('persistedSelection').addEach(this.get('rangeSelection'));
    return this.get('rangeSelection').clear();
  },
  getRowForEvent: function(event) {
    var $rowView, view;
    $rowView = $(event.target).parents('.ember-table-table-row');
    view = Ember.View.views[$rowView.attr('id')];
    if (view) {
      return view.get('row');
    }
  }
});

Ember.Handlebars.helper('table-component', Ember.Table.EmberTableComponent);


})();