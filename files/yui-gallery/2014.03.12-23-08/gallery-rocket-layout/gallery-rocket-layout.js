YUI.add('gallery-rocket-layout', function (Y, NAME) {

'use strict';

var Layout = Y.Base.create('rocketLayout', Y.RView, [Y.REventBroker], {
  // public properties
  regionManager: null,

  // private properties
  _firstRender: false, // is first render

  initializer: function(config) {
    config || (config = {});
    this._firstRender = true;
    var regionDefinitions = config.regions || this.regions;
    if (regionDefinitions) {
      this._initializeRegions(regionDefinitions);
    }
  },

  destructor: function() {
    this.regionManager.destroy();
  },

  // Layout's render will use the existing region objects the
  // first time it is called. Subsequent calls will destroy the
  // views that the regions are showing and then reset the `container`
  // for the regions to the newly rendered DOM elements.
  renderer: function() {
    if (this._firstRender) {
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else if (this.get('destroyed')) {
      // a previously destroyed layout means we need to
      // completely re-initialize the regions
      this._initializeRegions(this.get('regions'));
    } else {
      // If this is not the first render call, then we need to
      // reset all the regions
      this.regionManager.resetRegions();
    }
    var args = Array.prototype.slice.apply(arguments);
    return Y.RView.prototype.renderer.apply(this, args);
  },

  bindUI: function() {
    Y.RView.prototype.bindUI.apply(this);
  },

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this layout.
  _initializeRegions: function(regionDefinitions) {
    this._initRegionManager();
    this.addRegions(regionDefinitions);
  },

  // Internal method to initialize the region manager
  // and all regions in it
  _initRegionManager: function() {
    this.regionManager = new Y.RRegionManager();
    this.listenTo(this.regionManager, "add", function(e){
      // so that you can visit the regions directly by the name
      this[e.name] = e.region;
      this.fire("regionAdd", {name: e.name, region: e.region});
    });
    this.listenTo(this.regionManager, "remove", function(e){
      delete this[e.name];
      this.fire("regionRemove", {name: e.name, region: e.region});
    });
  },

  // Add a single region, by and and selector, to the layout
  addRegion: function(name, selector) {
    var _region = this.regionManager.addRegion(name, selector);
    this[name] = _region;
    return _region;
  },

  // Add multiple regions as a {name: 'definition', name2: 'def2'} object literal
  addRegions: function(regions) {
    var _namedRegions = this.regionManager.addRegions(regions);
    Y.Object.each(_namedRegions, function(region, name) {
      this[name] = region;
    });
    return _namedRegions;
  },

  removeRegion: function(name) {
    return this.regionManager.removeRegion(name);
  }
}, {
  ATTRS: {
    // if you want to get the real regions object, use:
    // this.regionManager._regions
    regions: {
      value: null
    }
  }
});

Y.RLayout = Layout;


}, 'gallery-2013.09.18-18-49', {"requires": ["gallery-rocket-view", "gallery-rocket-region-manager"]});
