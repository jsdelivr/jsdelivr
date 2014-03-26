YUI.add('gallery-rocket-list-view', function (Y, NAME) {

'use strict';

var ChildViewContainer = Y.RChildViewContainer;

// A view that iterates over a Y.ModelList
// and renders an individual ItemView for each model.
var ListView = Y.Base.create('rocketListView', Y.RView, [], {
  _showingEmptyView: false,  // is the emptyView being shown now
  children: null, // storing all of the item views

  initializer: function(config) {
    this._initChildViewStorage();
  },

  destructor: function() {
    this.removeItemViews();
  },

  // Internal method to set up the `children` object for
  // storing all of the item views
  _initChildViewStorage: function(){
    this.children = new ChildViewContainer();
  },

  // Configured the initial events that the modelList view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  bindUI: function() {
    if (this.get('modelList')) {
      this.listenTo(this.get('modelList'), "add", this.onAddChildView, this);
      this.listenTo(this.get('modelList'), "remove", this.onRemoveItemView, this);
      this.listenTo(this.get('modelList'), "reset", this.render, this);
      this.listenTo(this.get('modelList'), "*:change", this.onRefreshItemView, this);
    }
    ListView.superclass.bindUI.call(this);
  },

  // Handle a item added to the modelList
  onAddChildView: function(e) {
    this.removeEmptyView();
    var ItemView = this.get('itemView');
    var index = this.get('modelList').indexOf(e.model);
    this.addItemView(e.model, ItemView, e.index);
  },

  onRefreshItemView: function(e) {
    var view = this.children.findByModel(e.target);
    view.render();
  },

  // get the item view by model it holds, and remove it
  onRemoveItemView: function(e) {
    var view = this.children.findByModel(e.model);
    this.removeItemView(view);
    this.checkEmpty();
  },

  // Render the modelList of items. Override this method to
  // provide your own implementation of a render function for
  // the list view.
  renderer: function() {
    this._renderChildren();
  },

  // Internal method. Separated so that CompositeView can have
  // more control over events being triggered,
  // around the rendering process
  _renderChildren: function(){
    this.removeItemViews();  // clear the view first
    if (this.get('modelList') && this.get('modelList').size() > 0) {
      this.showList();
    } else {
      this.showEmptyView();
    }
  },

  showList: function() {
    this.get('modelList').each(function(model, index) {
      // TODO support different itemView types
      this.addItemView(model, this.get('itemView'));
    }, this);
  },

  // Internal method to show an empty view in place of
  // a modelList of item views, when the modelList is
  // empty
  showEmptyView: function() {
    var EmptyView = this.get('emptyView');
    if (EmptyView && !this._showingEmptyView) {
      this._showingEmptyView = true;
      this.addItemView(new Y.Model(), EmptyView, 0);
    }
  },

  removeItemView: function(view) {
    if (view) {
      this.stopListening(view);
      view.removeTarget(this);
      view.destroy(true);
      this.fire('itemRemoved', view);
    }
  },

  // remove the children views that this list view
  // is holding on to, if any
  removeItemViews: function() {
    this.children.each(function(child) {
      this.removeItemView(child);
    }, this);
    this.checkEmpty();
  },

  // Internal method to remove an existing emptyView instance
  // if one exists. Called when a modelList view has been
  // rendered empty, and then an item is added to the modelList.
  removeEmptyView: function() {
    if (this._showingEmptyView) {
      this.removeItemViews();
    }
  },

  // Build an `itemView` for every model in the modelList.
  buildItemView: function(model, ItemViewType) {
    return new ItemViewType({model: model});
  },

  // Render the item's view and add it to the
  // HTML for the list view.
  addItemView: function(model, ItemView, index) {
    // get the itemViewOptions if any were specified
    var view = this.buildItemView(model, ItemView);
    view.addTarget(this);
    this.fire('beforeItemAdd', {view: view});
    this.children.add(view);
    this.renderItemView(view, index);

    // call the "show" method if the list view
    // has already been shown
    // TODO where is shown
    if (this._isShown) {
      view.show();
    }

    this.fire('afterItemAdded', {view: view});
  },

  // render the item view
  // TODO add index support
  renderItemView: function(itemView, index) {
    // create itemTag and set id, then append it to view container
    var viewContainerId = Y.guid(),
        viewContainer = Y.Node.create('<' + this.get('itemTag') + '>');
    viewContainer.set('id', viewContainerId);
    viewContainer.appendTo(this.get('container'));

    // set the itemTag as the container of the itemView
    itemView.set('container', viewContainer);
    itemView.render();
  },
  // helper to show the empty view if the modelList is empty
  checkEmpty: function() {
    // check if empty now, and if true, show the empty view
    if (!this.get('modelList') || this.get('modelList').size() === 0){
      this.showEmptyView();
    }
  }
}, {
  ATTRS: {
    itemView: { value: null }, // itemView class
    emptyView: { value: null },
    itemTag: { value: 'li' },  // default as a <li> tag
    modelList: { value: null }
  }
});

Y.RListView = ListView;


}, 'gallery-2013.09.18-18-49', {"requires": ["gallery-rocket-view", "handlebars", "model-list", "gallery-rocket-child-view-container"]});
