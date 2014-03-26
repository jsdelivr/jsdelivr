YUI.add('gallery-rocket-child-view-container', function (Y, NAME) {

'use strict';

var ChildViewContainer = function(views) {
  this._views = {};
  this._indexByModel = {};
  this._updateLength();
  Y.each(views, this.add, this);
};

ChildViewContainer.prototype = {
  add: function(view) {
    var viewClientId = view.get('clientId');
    // store the view
    this._views[viewClientId] = view;
    // index it by model
    if (view.get('model')) {
      this._indexByModel[view.get('model').get('clientId')] = viewClientId;
    }
    this._updateLength();
  },

  findByModel: function(model) {
    return this.findByModelClientId(model.get('clientId'));
  },

  findByModelClientId: function(modelClientId) {
    var viewClientId = this._indexByModel[modelClientId];
    return this.findByClientId(viewClientId);
  },

  findByClientId: function(clientId) {
    return this._views[clientId];
  },

  findByIndex: function(index) {
    return Y.Object.values(this._views)[index];
  },

  remove: function(view) {
    var viewClientId = view.get('clientId');
    // delete model index
    if (view.get('model')) {
      delete this._indexByModel[view.get('model').get('clientId')];
    }
    // remove the view from the container
    delete this._views[viewClientId];
    this._updateLength();
  },

  // Update the `.length` attribute on this container
  _updateLength: function() {
    this.length = Y.Object.size(this._views);
  },

  size: function() {
    return this.length;
  },

  // * @param {Function} fn Function to execute on each enumerable property.
  // *   @param {View} fn.view current view.
  // *   @param {Object} fn.views Views being enumerated.
  each: function(fn, thisObj) {
    var clientId;
    for (clientId in this._views) {
      var view = this._views[clientId];
      fn.call(thisObj || view, view, this._views);
    }
  }
};

Y.RChildViewContainer = ChildViewContainer;


}, 'gallery-2013.09.18-18-49', {"requires": ["yui-base"]});
