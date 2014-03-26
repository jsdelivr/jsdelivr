YUI.add('gallery-rocket-region-manager', function (Y, NAME) {

'use strict';

var Region = Y.RRegion;

function RegionManager() {
  RegionManager.superclass.constructor.apply(this, arguments);
}

RegionManager = Y.extend(RegionManager, Y.Base, {
  // private properties
  _regions: {},

  initializer: function() {},

  destructor: function() {
    this.removeRegions();
  },

  // Add multiple regions using an object literal, where
  // each key becomes the region name, and each value is
  // the region definition.
  // {body: 'body', head1: '.head1'}
  // return: {name1: region1, name2: region2}
  addRegions: function(regionDefinitions) {
    var regions = {};
    Y.each(regionDefinitions, function(selector, name) {
      //definition = { selector: definition };
      var region = this.addRegion(name, selector);
      regions[name] = region;
    }, this);
    return regions;
  },

  // Add an individual region to the region manager,
  // and return the region instance
  // both name and definition are strings
  addRegion: function(name, selector) {
    if (typeof selector !== 'string') {
      throw new Error('selector of region must be string');
    }
    var region = new Region({selector: selector});
    this._addRegion(name, region);
    return region;
  },

  // Get a region by name
  getRegion: function(name) {
    return this._regions[name];
  },

  // Reset all regions in the region manager, destroy region's currentView, but
  // leave region attached.
  resetRegions: function() {
    Y.each(this._regions, function(region, name){
      region.reset();
    }, this);
  },

  // Remove a region by name
  removeRegion: function(name) {
    var region = this._regions[name];
    this._removeRegion(name, region);
  },

  // Remove all regions in the region manager,
  // the region is nolonger exist
  removeRegions: function() {
    Y.each(this._regions, function(region, name){
      this._removeRegion(name, region);
    }, this);
    this._regions = {};
  },

  // internal method to remove a region
  // destroy the region and fire remove event
  _removeRegion: function(name, region) {
    region.removeTarget(this);
    this.fire('remove', {name: name, region: region});
    region.destroy();
    delete this._regions[name];
    this._updateLength();
  },

  // internal method to add a region
  _addRegion: function(name, region) {
    region.addTarget(this);
    this.fire('add', {name: name, region: region});
    this._regions[name] = region;
    this._updateLength();
  },

  // set the number of regions current held
  _updateLength: function() {
    this.length = Y.Object.size(this._regions);
  },

  size: function() {
    return this.length;
  }
}, {
  ATTRS: {}
});

Y.RRegionManager = RegionManager;


}, 'gallery-2013.09.18-18-49', {"requires": ["gallery-rocket-region"]});
