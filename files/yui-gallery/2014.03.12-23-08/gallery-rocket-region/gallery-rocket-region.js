YUI.add('gallery-rocket-region', function (Y, NAME) {

'use strict';

var DESTROYED = 'destroyed',
    View = Y.RView;

function Region() {
  Region.superclass.constructor.apply(this, arguments);
}

Region = Y.extend(Region, Y.Base, {
  initializer: function(config) {
  },

  destructor: function() {
    this.reset();
  },

  hide: function() {
    //hide the currentView
    this.get('currentView') && this.get('currentView').hide();
  },

  show: function(view) {
    // if the view is blank, show the currentView
    if (!view) { this.get('currentView') && this.get('currentView').show(); return; }
    // the view must be instance or subinstance of rocket view
    if (!(view instanceof View)) { throw new Error('view of region must be instance/subinstance of rocket view'); }
    // if the view is different from currentView, reset the region first.
    if (view !== this.get('currentView')) { this.reset(); }
    view._set('container', this.get('selector'));
    view.render();
    view.addTarget(this);
    this.set('currentView', view);
    this.fire('show', {view: view});
  },

  // Destroy the currentView, and fires a reset event.
  reset: function() {
    var view = this.get('currentView');
    if (!view || view.get(DESTROYED)){ return; }
    view.removeTarget(this);
    view.destroy(false);   // destory the view, but keep the container
    this.set('currentView', null);
    this.fire('reset');
  }
}, {
  ATTRS: {
    selector: { value: null },
    currentView: { value: null }
  }
});

Y.RRegion = Region;


}, 'gallery-2013.09.18-18-49', {"requires": ["gallery-rocket-view"]});
