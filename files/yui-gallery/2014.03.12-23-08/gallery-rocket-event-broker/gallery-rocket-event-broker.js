YUI.add('gallery-rocket-event-broker', function (Y, NAME) {

'use strict';

function EventBroker() {}

EventBroker.prototype = {
  //1. model.on('change', callback);
  //     => listenTo(model, 'change', callback)
  //node.on('click', callback);
  //Y.on('click', callback, 'selector'/node);
  //     => listenTo('click', callback, 'selector'/node)
  //Y.delegate('click', callback, '.container'/node, 'selector', this);
  //     => listenTo('click', callback, 'selector')
  //2. this.get('container').delegate('click', callback, '.row', this);
  //     => listenTo('selector', 'click', callback)
  //3. this.get('container').delegate('key', callback, 'enter,tab', 'selector', this);
  //Equal to Y.delegate('key', callback, '.container'/node, 'enter,tab', 'selector', this);
  //     => listenTo('selector', 'key', 'enter, tab', callback)
  //4. listenTo(eventHandler);
  listenTo: function(spec, type, keyFilter, callback) {
    var listeners = this._listeners || (this._listeners = {}),
        subscription = null,
        listenerId = null;

    if (type === 'key') {
      // type 3
      subscription = this.get('container').delegate('key', callback, keyFilter, spec, this);
      listenerId = spec;
    } else {
      callback = keyFilter;
      keyFilter = null;

      if (typeof spec === 'string') {
        // type 2
        subscription = this.get('container').delegate(type, callback, spec, this);
        listenerId = spec;
      } else if (arguments.length === 1 && spec instanceof Y.EventHandle){
        // type 4
        subscription = spec;
        listenerId = 'this';
      } else {
        // type 1
        subscription = spec.on(type, callback, this);
        listenerId = spec._listenerId || (spec._listenerId = Y.guid('l'));
      }
    }

    listeners[listenerId] = listeners[listenerId] || [];
    listeners[listenerId].push(subscription);

    return subscription;
  },

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  stopListening: function(spec) {
    if (spec instanceof Y.EventHandle) {
      spec.detach();
      return this;
    }

    var listeners = this._listeners;
    if (!listeners) return this;

    if (spec) {
      // only detach the spec related events
      var listenerId = (spec._listenerId) ? spec._listenerId : spec;
      Y.Array.each(listeners[listenerId], function(handle) {
        if (handle) { handle.detach(); }
      });
      delete listeners[listenerId];
    } else {
      // detach all events
      Y.each(listeners, function(handles, listenerId) {
        Y.Array.each(handles, function(handle) {
          if (handle) { handle.detach(); }
        });
      });
      delete this._listeners;
    }
    return this;
  }
};

Y.REventBroker = EventBroker;


}, 'gallery-2013.09.18-18-49', {"requires": ["event", "event-key"]});
