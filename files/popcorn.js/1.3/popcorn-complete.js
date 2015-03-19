/*
 * popcorn.js version 1.3
 * http://popcornjs.org
 *
 * Copyright 2011, Mozilla Foundation
 * Licensed under the MIT license
 */

(function(global, document) {

  // Popcorn.js does not support archaic browsers
  if ( !document.addEventListener ) {
    global.Popcorn = {
      isSupported: false
    };

    var methods = ( "byId forEach extend effects error guid sizeOf isArray nop position disable enable destroy" +
          "addTrackEvent removeTrackEvent getTrackEvents getTrackEvent getLastTrackEventId " +
          "timeUpdate plugin removePlugin compose effect xhr getJSONP getScript" ).split(/\s+/);

    while ( methods.length ) {
      global.Popcorn[ methods.shift() ] = function() {};
    }
    return;
  }

  var

  AP = Array.prototype,
  OP = Object.prototype,

  forEach = AP.forEach,
  slice = AP.slice,
  hasOwn = OP.hasOwnProperty,
  toString = OP.toString,

  // Copy global Popcorn (may not exist)
  _Popcorn = global.Popcorn,

  //  Ready fn cache
  readyStack = [],
  readyBound = false,
  readyFired = false,

  //  Non-public internal data object
  internal = {
    events: {
      hash: {},
      apis: {}
    }
  },

  //  Non-public `requestAnimFrame`
  //  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimFrame = (function(){
    return global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.mozRequestAnimationFrame ||
      global.oRequestAnimationFrame ||
      global.msRequestAnimationFrame ||
      function( callback, element ) {
        global.setTimeout( callback, 16 );
      };
  }()),

  //  Non-public `getKeys`, return an object's keys as an array
  getKeys = function( obj ) {
    return Object.keys ? Object.keys( obj ) : (function( obj ) {
      var item,
          list = [];

      for ( item in obj ) {
        if ( hasOwn.call( obj, item ) ) {
          list.push( item );
        }
      }
      return list;
    })( obj );
  },

  //  Declare constructor
  //  Returns an instance object.
  Popcorn = function( entity, options ) {
    //  Return new Popcorn object
    return new Popcorn.p.init( entity, options || null );
  };

  //  Popcorn API version, automatically inserted via build system.
  Popcorn.version = "1.3";

  //  Boolean flag allowing a client to determine if Popcorn can be supported
  Popcorn.isSupported = true;

  //  Instance caching
  Popcorn.instances = [];

  //  Declare a shortcut (Popcorn.p) to and a definition of
  //  the new prototype for our Popcorn constructor
  Popcorn.p = Popcorn.prototype = {

    init: function( entity, options ) {

      var matches, nodeName,
          self = this;

      //  Supports Popcorn(function () { /../ })
      //  Originally proposed by Daniel Brooks

      if ( typeof entity === "function" ) {

        //  If document ready has already fired
        if ( document.readyState === "complete" ) {

          entity( document, Popcorn );

          return;
        }
        //  Add `entity` fn to ready stack
        readyStack.push( entity );

        //  This process should happen once per page load
        if ( !readyBound ) {

          //  set readyBound flag
          readyBound = true;

          var DOMContentLoaded  = function() {

            readyFired = true;

            //  Remove global DOM ready listener
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            //  Execute all ready function in the stack
            for ( var i = 0, readyStackLength = readyStack.length; i < readyStackLength; i++ ) {

              readyStack[ i ].call( document, Popcorn );

            }
            //  GC readyStack
            readyStack = null;
          };

          //  Register global DOM ready listener
          document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        }

        return;
      }

      if ( typeof entity === "string" ) {
        try {
          matches = document.querySelector( entity );
        } catch( e ) {
          throw new Error( "Popcorn.js Error: Invalid media element selector: " + entity );
        }
      }

      //  Get media element by id or object reference
      this.media = matches || entity;

      //  inner reference to this media element's nodeName string value
      nodeName = ( this.media.nodeName && this.media.nodeName.toLowerCase() ) || "video";

      //  Create an audio or video element property reference
      this[ nodeName ] = this.media;

      this.options = options || {};

      //  Resolve custom ID or default prefixed ID
      this.id = this.options.id || Popcorn.guid( nodeName );

      //  Throw if an attempt is made to use an ID that already exists
      if ( Popcorn.byId( this.id ) ) {
        throw new Error( "Popcorn.js Error: Cannot use duplicate ID (" + this.id + ")" );
      }

      this.isDestroyed = false;

      this.data = {

        // data structure of all
        running: {
          cue: []
        },

        // Executed by either timeupdate event or in rAF loop
        timeUpdate: Popcorn.nop,

        // Allows disabling a plugin per instance
        disabled: {},

        // Stores DOM event queues by type
        events: {},

        // Stores Special event hooks data
        hooks: {},

        // Store track event history data
        history: [],

        // Stores ad-hoc state related data]
        state: {
          volume: this.media.volume
        },

        // Store track event object references by trackId
        trackRefs: {},

        // Playback track event queues
        trackEvents: {
          byStart: [{

            start: -1,
            end: -1
          }],
          byEnd: [{
            start: -1,
            end: -1
          }],
          animating: [],
          startIndex: 0,
          endIndex: 0,
          previousUpdateTime: -1
        }
      };

      //  Register new instance
      Popcorn.instances.push( this );

      //  function to fire when video is ready
      var isReady = function() {

        // chrome bug: http://code.google.com/p/chromium/issues/detail?id=119598
        // it is possible the video's time is less than 0
        // this has the potential to call track events more than once, when they should not
        // start: 0, end: 1 will start, end, start again, when it should just start
        // just setting it to 0 if it is below 0 fixes this issue
        if ( self.media.currentTime < 0 ) {

          self.media.currentTime = 0;
        }

        self.media.removeEventListener( "loadeddata", isReady, false );

        var duration, videoDurationPlus,
            runningPlugins, runningPlugin, rpLength, rpNatives;

        //  Adding padding to the front and end of the arrays
        //  this is so we do not fall off either end
        duration = self.media.duration;

        //  Check for no duration info (NaN)
        videoDurationPlus = duration != duration ? Number.MAX_VALUE : duration + 1;

        Popcorn.addTrackEvent( self, {
          start: videoDurationPlus,
          end: videoDurationPlus
        });

        if ( self.options.frameAnimation ) {

          //  if Popcorn is created with frameAnimation option set to true,
          //  requestAnimFrame is used instead of "timeupdate" media event.
          //  This is for greater frame time accuracy, theoretically up to
          //  60 frames per second as opposed to ~4 ( ~every 15-250ms)
          self.data.timeUpdate = function () {

            Popcorn.timeUpdate( self, {} );

            // fire frame for each enabled active plugin of every type
            Popcorn.forEach( Popcorn.manifest, function( key, val ) {

              runningPlugins = self.data.running[ val ];

              // ensure there are running plugins on this type on this instance
              if ( runningPlugins ) {

                rpLength = runningPlugins.length;
                for ( var i = 0; i < rpLength; i++ ) {

                  runningPlugin = runningPlugins[ i ];
                  rpNatives = runningPlugin._natives;
                  rpNatives && rpNatives.frame &&
                    rpNatives.frame.call( self, {}, runningPlugin, self.currentTime() );
                }
              }
            });

            self.emit( "timeupdate" );

            !self.isDestroyed && requestAnimFrame( self.data.timeUpdate );
          };

          !self.isDestroyed && requestAnimFrame( self.data.timeUpdate );

        } else {

          self.data.timeUpdate = function( event ) {
            Popcorn.timeUpdate( self, event );
          };

          if ( !self.isDestroyed ) {
            self.media.addEventListener( "timeupdate", self.data.timeUpdate, false );
          }
        }
      };

      Object.defineProperty( this, "error", {
        get: function() {

          return self.media.error;
        }
      });

      if ( self.media.readyState >= 2 ) {

        isReady();
      } else {

        self.media.addEventListener( "loadeddata", isReady, false );
      }

      return this;
    }
  };

  //  Extend constructor prototype to instance prototype
  //  Allows chaining methods to instances
  Popcorn.p.init.prototype = Popcorn.p;

  Popcorn.byId = function( str ) {
    var instances = Popcorn.instances,
        length = instances.length,
        i = 0;

    for ( ; i < length; i++ ) {
      if ( instances[ i ].id === str ) {
        return instances[ i ];
      }
    }

    return null;
  };

  Popcorn.forEach = function( obj, fn, context ) {

    if ( !obj || !fn ) {
      return {};
    }

    context = context || this;

    var key, len;

    // Use native whenever possible
    if ( forEach && obj.forEach === forEach ) {
      return obj.forEach( fn, context );
    }

    if ( toString.call( obj ) === "[object NodeList]" ) {
      for ( key = 0, len = obj.length; key < len; key++ ) {
        fn.call( context, obj[ key ], key, obj );
      }
      return obj;
    }

    for ( key in obj ) {
      if ( hasOwn.call( obj, key ) ) {
        fn.call( context, obj[ key ], key, obj );
      }
    }
    return obj;
  };

  Popcorn.extend = function( obj ) {
    var dest = obj, src = slice.call( arguments, 1 );

    Popcorn.forEach( src, function( copy ) {
      for ( var prop in copy ) {
        dest[ prop ] = copy[ prop ];
      }
    });

    return dest;
  };


  // A Few reusable utils, memoized onto Popcorn
  Popcorn.extend( Popcorn, {
    noConflict: function( deep ) {

      if ( deep ) {
        global.Popcorn = _Popcorn;
      }

      return Popcorn;
    },
    error: function( msg ) {
      throw new Error( msg );
    },
    guid: function( prefix ) {
      Popcorn.guid.counter++;
      return  ( prefix ? prefix : "" ) + ( +new Date() + Popcorn.guid.counter );
    },
    sizeOf: function( obj ) {
      var size = 0;

      for ( var prop in obj ) {
        size++;
      }

      return size;
    },
    isArray: Array.isArray || function( array ) {
      return toString.call( array ) === "[object Array]";
    },

    nop: function() {},

    position: function( elem ) {

      var clientRect = elem.getBoundingClientRect(),
          bounds = {},
          doc = elem.ownerDocument,
          docElem = document.documentElement,
          body = document.body,
          clientTop, clientLeft, scrollTop, scrollLeft, top, left;

      //  Determine correct clientTop/Left
      clientTop = docElem.clientTop || body.clientTop || 0;
      clientLeft = docElem.clientLeft || body.clientLeft || 0;

      //  Determine correct scrollTop/Left
      scrollTop = ( global.pageYOffset && docElem.scrollTop || body.scrollTop );
      scrollLeft = ( global.pageXOffset && docElem.scrollLeft || body.scrollLeft );

      //  Temp top/left
      top = Math.ceil( clientRect.top + scrollTop - clientTop );
      left = Math.ceil( clientRect.left + scrollLeft - clientLeft );

      for ( var p in clientRect ) {
        bounds[ p ] = Math.round( clientRect[ p ] );
      }

      return Popcorn.extend({}, bounds, { top: top, left: left });
    },

    disable: function( instance, plugin ) {

      if ( !instance.data.disabled[ plugin ] ) {

        instance.data.disabled[ plugin ] = true;

        for ( var i = instance.data.running[ plugin ].length - 1, event; i >= 0; i-- ) {

          event = instance.data.running[ plugin ][ i ];
          event._natives.end.call( instance, null, event  );
        }
      }

      return instance;
    },
    enable: function( instance, plugin ) {

      if ( instance.data.disabled[ plugin ] ) {

        instance.data.disabled[ plugin ] = false;

        for ( var i = instance.data.running[ plugin ].length - 1, event; i >= 0; i-- ) {

          event = instance.data.running[ plugin ][ i ];
          event._natives.start.call( instance, null, event  );
        }
      }

      return instance;
    },
    destroy: function( instance ) {
      var events = instance.data.events,
          trackEvents = instance.data.trackEvents,
          singleEvent, item, fn, plugin;

      //  Iterate through all events and remove them
      for ( item in events ) {
        singleEvent = events[ item ];
        for ( fn in singleEvent ) {
          delete singleEvent[ fn ];
        }
        events[ item ] = null;
      }

      // remove all plugins off the given instance
      for ( plugin in Popcorn.registryByName ) {
        Popcorn.removePlugin( instance, plugin );
      }

      // Remove all data.trackEvents #1178
      trackEvents.byStart.length = 0;
      trackEvents.byEnd.length = 0;

      if ( !instance.isDestroyed ) {
        instance.data.timeUpdate && instance.media.removeEventListener( "timeupdate", instance.data.timeUpdate, false );
        instance.isDestroyed = true;
      }
    }
  });

  //  Memoized GUID Counter
  Popcorn.guid.counter = 1;

  //  Factory to implement getters, setters and controllers
  //  as Popcorn instance methods. The IIFE will create and return
  //  an object with defined methods
  Popcorn.extend(Popcorn.p, (function() {

      var methods = "load play pause currentTime playbackRate volume duration preload playbackRate " +
                    "autoplay loop controls muted buffered readyState seeking paused played seekable ended",
          ret = {};


      //  Build methods, store in object that is returned and passed to extend
      Popcorn.forEach( methods.split( /\s+/g ), function( name ) {

        ret[ name ] = function( arg ) {
          var previous;

          if ( typeof this.media[ name ] === "function" ) {

            // Support for shorthanded play(n)/pause(n) jump to currentTime
            // If arg is not null or undefined and called by one of the
            // allowed shorthandable methods, then set the currentTime
            // Supports time as seconds or SMPTE
            if ( arg != null && /play|pause/.test( name ) ) {
              this.media.currentTime = Popcorn.util.toSeconds( arg );
            }

            this.media[ name ]();

            return this;
          }

          if ( arg != null ) {
            // Capture the current value of the attribute property
            previous = this.media[ name ];

            // Set the attribute property with the new value
            this.media[ name ] = arg;

            // If the new value is not the same as the old value
            // emit an "attrchanged event"
            if ( previous !== arg ) {
              this.emit( "attrchange", {
                attribute: name,
                previousValue: previous,
                currentValue: arg
              });
            }
            return this;
          }

          return this.media[ name ];
        };
      });

      return ret;

    })()
  );

  Popcorn.forEach( "enable disable".split(" "), function( method ) {
    Popcorn.p[ method ] = function( plugin ) {
      return Popcorn[ method ]( this, plugin );
    };
  });

  Popcorn.extend(Popcorn.p, {

    //  Rounded currentTime
    roundTime: function() {
      return Math.round( this.media.currentTime );
    },

    //  Attach an event to a single point in time
    exec: function( id, time, fn ) {
      var length = arguments.length,
          trackEvent, sec;

      // Check if first could possibly be a SMPTE string
      // p.cue( "smpte string", fn );
      // try/catch avoid awful throw in Popcorn.util.toSeconds
      // TODO: Get rid of that, replace with NaN return?
      try {
        sec = Popcorn.util.toSeconds( id );
      } catch ( e ) {}

      // If it can be converted into a number then
      // it's safe to assume that the string was SMPTE
      if ( typeof sec === "number" ) {
        id = sec;
      }

      // Shift arguments based on use case
      //
      // Back compat for:
      // p.cue( time, fn );
      if ( typeof id === "number" && length === 2 ) {
        fn = time;
        time = id;
        id = Popcorn.guid( "cue" );
      } else {
        // Support for new forms

        // p.cue( "empty-cue" );
        if ( length === 1 ) {
          // Set a time for an empty cue. It's not important what
          // the time actually is, because the cue is a no-op
          time = -1;

        } else {

          // Get the trackEvent that matches the given id.
          trackEvent = this.getTrackEvent( id );

          if ( trackEvent ) {

            // p.cue( "my-id", 12 );
            // p.cue( "my-id", function() { ... });
            if ( typeof id === "string" && length === 2 ) {

              // p.cue( "my-id", 12 );
              // The path will update the cue time.
              if ( typeof time === "number" ) {
                // Re-use existing trackEvent start callback
                fn = trackEvent._natives.start;
              }

              // p.cue( "my-id", function() { ... });
              // The path will update the cue function
              if ( typeof time === "function" ) {
                fn = time;
                // Re-use existing trackEvent start time
                time = trackEvent.start;
              }
            }
          } else {

            if ( length >= 2 ) {

              // p.cue( "a", "00:00:00");
              if ( typeof time === "string" ) {
                try {
                  sec = Popcorn.util.toSeconds( time );
                } catch ( e ) {}

                time = sec;
              }

              // p.cue( "b", 11 );
              if ( typeof time === "number" ) {
                fn = Popcorn.nop();
              }

              // p.cue( "c", function() {});
              if ( typeof time === "function" ) {
                fn = time;
                time = -1;
              }
            }
          }
        }
      }

      //  Creating a one second track event with an empty end
      //  Or update an existing track event with new values
      Popcorn.addTrackEvent( this, {
        id: id,
        start: time,
        end: time + 1,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "cue"
        }
      });

      return this;
    },

    // Mute the calling media, optionally toggle
    mute: function( toggle ) {

      var event = toggle == null || toggle === true ? "muted" : "unmuted";

      // If `toggle` is explicitly `false`,
      // unmute the media and restore the volume level
      if ( event === "unmuted" ) {
        this.media.muted = false;
        this.media.volume = this.data.state.volume;
      }

      // If `toggle` is either null or undefined,
      // save the current volume and mute the media element
      if ( event === "muted" ) {
        this.data.state.volume = this.media.volume;
        this.media.muted = true;
      }

      // Trigger either muted|unmuted event
      this.emit( event );

      return this;
    },

    // Convenience method, unmute the calling media
    unmute: function( toggle ) {

      return this.mute( toggle == null ? false : !toggle );
    },

    // Get the client bounding box of an instance element
    position: function() {
      return Popcorn.position( this.media );
    },

    // Toggle a plugin's playback behaviour (on or off) per instance
    toggle: function( plugin ) {
      return Popcorn[ this.data.disabled[ plugin ] ? "enable" : "disable" ]( this, plugin );
    },

    // Set default values for plugin options objects per instance
    defaults: function( plugin, defaults ) {

      // If an array of default configurations is provided,
      // iterate and apply each to this instance
      if ( Popcorn.isArray( plugin ) ) {

        Popcorn.forEach( plugin, function( obj ) {
          for ( var name in obj ) {
            this.defaults( name, obj[ name ] );
          }
        }, this );

        return this;
      }

      if ( !this.options.defaults ) {
        this.options.defaults = {};
      }

      if ( !this.options.defaults[ plugin ] ) {
        this.options.defaults[ plugin ] = {};
      }

      Popcorn.extend( this.options.defaults[ plugin ], defaults );

      return this;
    }
  });

  Popcorn.Events  = {
    UIEvents: "blur focus focusin focusout load resize scroll unload",
    MouseEvents: "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave click dblclick",
    Events: "loadstart progress suspend emptied stalled play pause error " +
            "loadedmetadata loadeddata waiting playing canplay canplaythrough " +
            "seeking seeked timeupdate ended ratechange durationchange volumechange"
  };

  Popcorn.Events.Natives = Popcorn.Events.UIEvents + " " +
                           Popcorn.Events.MouseEvents + " " +
                           Popcorn.Events.Events;

  internal.events.apiTypes = [ "UIEvents", "MouseEvents", "Events" ];

  // Privately compile events table at load time
  (function( events, data ) {

    var apis = internal.events.apiTypes,
    eventsList = events.Natives.split( /\s+/g ),
    idx = 0, len = eventsList.length, prop;

    for( ; idx < len; idx++ ) {
      data.hash[ eventsList[idx] ] = true;
    }

    apis.forEach(function( val, idx ) {

      data.apis[ val ] = {};

      var apiEvents = events[ val ].split( /\s+/g ),
      len = apiEvents.length,
      k = 0;

      for ( ; k < len; k++ ) {
        data.apis[ val ][ apiEvents[ k ] ] = true;
      }
    });
  })( Popcorn.Events, internal.events );

  Popcorn.events = {

    isNative: function( type ) {
      return !!internal.events.hash[ type ];
    },
    getInterface: function( type ) {

      if ( !Popcorn.events.isNative( type ) ) {
        return false;
      }

      var eventApi = internal.events,
        apis = eventApi.apiTypes,
        apihash = eventApi.apis,
        idx = 0, len = apis.length, api, tmp;

      for ( ; idx < len; idx++ ) {
        tmp = apis[ idx ];

        if ( apihash[ tmp ][ type ] ) {
          api = tmp;
          break;
        }
      }
      return api;
    },
    //  Compile all native events to single array
    all: Popcorn.Events.Natives.split( /\s+/g ),
    //  Defines all Event handling static functions
    fn: {
      trigger: function( type, data ) {

        var eventInterface, evt;
        //  setup checks for custom event system
        if ( this.data.events[ type ] && Popcorn.sizeOf( this.data.events[ type ] ) ) {

          eventInterface  = Popcorn.events.getInterface( type );

          if ( eventInterface ) {

            evt = document.createEvent( eventInterface );
            evt.initEvent( type, true, true, global, 1 );

            this.media.dispatchEvent( evt );

            return this;
          }

          //  Custom events
          Popcorn.forEach( this.data.events[ type ], function( obj, key ) {

            obj.call( this, data );

          }, this );

        }

        return this;
      },
      listen: function( type, fn ) {

        var self = this,
            hasEvents = true,
            eventHook = Popcorn.events.hooks[ type ],
            origType = type,
            tmp;

        if ( !this.data.events[ type ] ) {
          this.data.events[ type ] = {};
          hasEvents = false;
        }

        // Check and setup event hooks
        if ( eventHook ) {

          // Execute hook add method if defined
          if ( eventHook.add ) {
            eventHook.add.call( this, {}, fn );
          }

          // Reassign event type to our piggyback event type if defined
          if ( eventHook.bind ) {
            type = eventHook.bind;
          }

          // Reassign handler if defined
          if ( eventHook.handler ) {
            tmp = fn;

            fn = function wrapper( event ) {
              eventHook.handler.call( self, event, tmp );
            };
          }

          // assume the piggy back event is registered
          hasEvents = true;

          // Setup event registry entry
          if ( !this.data.events[ type ] ) {
            this.data.events[ type ] = {};
            // Toggle if the previous assumption was untrue
            hasEvents = false;
          }
        }

        //  Register event and handler
        this.data.events[ type ][ fn.name || ( fn.toString() + Popcorn.guid() ) ] = fn;

        // only attach one event of any type
        if ( !hasEvents && Popcorn.events.all.indexOf( type ) > -1 ) {

          this.media.addEventListener( type, function( event ) {

            Popcorn.forEach( self.data.events[ type ], function( obj, key ) {
              if ( typeof obj === "function" ) {
                obj.call( self, event );
              }
            });

          }, false);
        }
        return this;
      },
      unlisten: function( type, fn ) {

        if ( this.data.events[ type ] && this.data.events[ type ][ fn ] ) {

          delete this.data.events[ type ][ fn ];

          return this;
        }

        this.data.events[ type ] = null;

        return this;
      }
    },
    hooks: {
      canplayall: {
        bind: "canplaythrough",
        add: function( event, callback ) {

          var state = false;

          if ( this.media.readyState ) {

            callback.call( this, event );

            state = true;
          }

          this.data.hooks.canplayall = {
            fired: state
          };
        },
        // declare special handling instructions
        handler: function canplayall( event, callback ) {

          if ( !this.data.hooks.canplayall.fired ) {
            // trigger original user callback once
            callback.call( this, event );

            this.data.hooks.canplayall.fired = true;
          }
        }
      }
    }
  };

  //  Extend Popcorn.events.fns (listen, unlisten, trigger) to all Popcorn instances
  //  Extend aliases (on, off, emit)
  Popcorn.forEach( [ [ "trigger", "emit" ], [ "listen", "on" ], [ "unlisten", "off" ] ], function( key ) {
    Popcorn.p[ key[ 0 ] ] = Popcorn.p[ key[ 1 ] ] = Popcorn.events.fn[ key[ 0 ] ];
  });

  // Internal Only - Adds track events to the instance object
  Popcorn.addTrackEvent = function( obj, track ) {
    var trackEvent, isUpdate, eventType;

    // Do a lookup for existing trackevents with this id
    if ( track.id ) {
      trackEvent = obj.getTrackEvent( track.id );
    }

    // If a track event by this id currently exists, modify it
    if ( trackEvent ) {
      isUpdate = true;
      // Create a new object with the existing trackEvent
      // Extend with new track properties
      track = Popcorn.extend( {}, trackEvent, track );

      // Remove the existing track from the instance
      obj.removeTrackEvent( track.id );
    }

    // Determine if this track has default options set for it
    // If so, apply them to the track object
    if ( track && track._natives && track._natives.type &&
        ( obj.options.defaults && obj.options.defaults[ track._natives.type ] ) ) {

      track = Popcorn.extend( {}, obj.options.defaults[ track._natives.type ], track );
    }

    if ( track._natives ) {
      //  Supports user defined track event id
      track._id = track.id || track._id || Popcorn.guid( track._natives.type );

      //  Push track event ids into the history
      obj.data.history.push( track._id );
    }

    track.start = Popcorn.util.toSeconds( track.start, obj.options.framerate );
    track.end   = Popcorn.util.toSeconds( track.end, obj.options.framerate );

    //  Store this definition in an array sorted by times
    var byStart = obj.data.trackEvents.byStart,
        byEnd = obj.data.trackEvents.byEnd,
        startIndex, endIndex;

    for ( startIndex = byStart.length - 1; startIndex >= 0; startIndex-- ) {

      if ( track.start >= byStart[ startIndex ].start ) {
        byStart.splice( startIndex + 1, 0, track );
        break;
      }
    }

    for ( endIndex = byEnd.length - 1; endIndex >= 0; endIndex-- ) {

      if ( track.end > byEnd[ endIndex ].end ) {
        byEnd.splice( endIndex + 1, 0, track );
        break;
      }
    }

    // Display track event immediately if it's enabled and current
    if ( track.end > obj.media.currentTime &&
        track.start <= obj.media.currentTime ) {

      track._running = true;
      obj.data.running[ track._natives.type ].push( track );

      if ( !obj.data.disabled[ track._natives.type ] ) {

        track._natives.start.call( obj, null, track );
      }
    }

    // update startIndex and endIndex
    if ( startIndex <= obj.data.trackEvents.startIndex &&
      track.start <= obj.data.trackEvents.previousUpdateTime ) {

      obj.data.trackEvents.startIndex++;
    }

    if ( endIndex <= obj.data.trackEvents.endIndex &&
      track.end < obj.data.trackEvents.previousUpdateTime ) {

      obj.data.trackEvents.endIndex++;
    }

    this.timeUpdate( obj, null, true );

    // Store references to user added trackevents in ref table
    if ( track._id ) {
      Popcorn.addTrackEvent.ref( obj, track );
    }

    // If the call to addTrackEvent was an update/modify call, fire an event
    if ( isUpdate ) {

      // Determine appropriate event type to trigger
      // they are identical in function, but the naming
      // adds some level of intuition for the end developer
      // to rely on
      if ( track._natives.type === "cue" ) {
        eventType = "cuechange";
      } else {
        eventType = "trackchange";
      }

      // Fire an event with change information
      obj.emit( eventType, {
        id: track.id,
        previousValue: {
          time: trackEvent.start,
          fn: trackEvent._natives.start
        },
        currentValue: {
          time: track.start,
          fn: track._natives.start
        }
      });
    }
  };

  // Internal Only - Adds track event references to the instance object's trackRefs hash table
  Popcorn.addTrackEvent.ref = function( obj, track ) {
    obj.data.trackRefs[ track._id ] = track;

    return obj;
  };

  Popcorn.removeTrackEvent  = function( obj, removeId ) {

    var start, end, animate,
        historyLen = obj.data.history.length,
        length = obj.data.trackEvents.byStart.length,
        index = 0,
        indexWasAt = 0,
        byStart = [],
        byEnd = [],
        animating = [],
        history = [];

    while ( --length > -1 ) {
      start = obj.data.trackEvents.byStart[ index ];
      end = obj.data.trackEvents.byEnd[ index ];

      // Padding events will not have _id properties.
      // These should be safely pushed onto the front and back of the
      // track event array
      if ( !start._id ) {
        byStart.push( start );
        byEnd.push( end );
      }

      // Filter for user track events (vs system track events)
      if ( start._id ) {

        // If not a matching start event for removal
        if ( start._id !== removeId ) {
          byStart.push( start );
        }

        // If not a matching end event for removal
        if ( end._id !== removeId ) {
          byEnd.push( end );
        }

        // If the _id is matched, capture the current index
        if ( start._id === removeId ) {
          indexWasAt = index;

          // If a _teardown function was defined,
          // enforce for track event removals
          if ( start._natives._teardown ) {
            start._natives._teardown.call( obj, start );
          }
        }
      }
      // Increment the track index
      index++;
    }

    // Reset length to be used by the condition below to determine
    // if animating track events should also be filtered for removal.
    // Reset index below to be used by the reverse while as an
    // incrementing counter
    length = obj.data.trackEvents.animating.length;
    index = 0;

    if ( length ) {
      while ( --length > -1 ) {
        animate = obj.data.trackEvents.animating[ index ];

        // Padding events will not have _id properties.
        // These should be safely pushed onto the front and back of the
        // track event array
        if ( !animate._id ) {
          animating.push( animate );
        }

        // If not a matching animate event for removal
        if ( animate._id && animate._id !== removeId ) {
          animating.push( animate );
        }
        // Increment the track index
        index++;
      }
    }

    //  Update
    if ( indexWasAt <= obj.data.trackEvents.startIndex ) {
      obj.data.trackEvents.startIndex--;
    }

    if ( indexWasAt <= obj.data.trackEvents.endIndex ) {
      obj.data.trackEvents.endIndex--;
    }

    obj.data.trackEvents.byStart = byStart;
    obj.data.trackEvents.byEnd = byEnd;
    obj.data.trackEvents.animating = animating;

    for ( var i = 0; i < historyLen; i++ ) {
      if ( obj.data.history[ i ] !== removeId ) {
        history.push( obj.data.history[ i ] );
      }
    }

    // Update ordered history array
    obj.data.history = history;

    // Update track event references
    Popcorn.removeTrackEvent.ref( obj, removeId );
  };

  // Internal Only - Removes track event references from instance object's trackRefs hash table
  Popcorn.removeTrackEvent.ref = function( obj, removeId ) {
    delete obj.data.trackRefs[ removeId ];

    return obj;
  };

  // Return an array of track events bound to this instance object
  Popcorn.getTrackEvents = function( obj ) {

    var trackevents = [],
      refs = obj.data.trackEvents.byStart,
      length = refs.length,
      idx = 0,
      ref;

    for ( ; idx < length; idx++ ) {
      ref = refs[ idx ];
      // Return only user attributed track event references
      if ( ref._id ) {
        trackevents.push( ref );
      }
    }

    return trackevents;
  };

  // Internal Only - Returns an instance object's trackRefs hash table
  Popcorn.getTrackEvents.ref = function( obj ) {
    return obj.data.trackRefs;
  };

  // Return a single track event bound to this instance object
  Popcorn.getTrackEvent = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  // Internal Only - Returns an instance object's track reference by track id
  Popcorn.getTrackEvent.ref = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  Popcorn.getLastTrackEventId = function( obj ) {
    return obj.data.history[ obj.data.history.length - 1 ];
  };

  Popcorn.timeUpdate = function( obj, event ) {

    var currentTime = obj.media.currentTime,
        previousTime = obj.data.trackEvents.previousUpdateTime,
        tracks = obj.data.trackEvents,
        end = tracks.endIndex,
        start = tracks.startIndex,
        byStartLen = tracks.byStart.length,
        byEndLen = tracks.byEnd.length,
        registryByName = Popcorn.registryByName,
        trackstart = "trackstart",
        trackend = "trackend",

        byEnd, byStart, byAnimate, natives, type, runningPlugins;

    //  Playbar advancing
    if ( previousTime <= currentTime ) {

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end <= currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd._running === true ) {

            byEnd._running = false;
            runningPlugins = obj.data.running[ type ];
            runningPlugins.splice( runningPlugins.indexOf( byEnd ), 1 );

            if ( !obj.data.disabled[ type ] ) {

              natives.end.call( obj, event, byEnd );

              obj.emit( trackend,
                Popcorn.extend({}, byEnd, {
                  plugin: type,
                  type: trackend
                })
              );
            }
          }

          end++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start <= currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;

        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byStart.end > currentTime &&
                byStart._running === false ) {

            byStart._running = true;
            obj.data.running[ type ].push( byStart );

            if ( !obj.data.disabled[ type ] ) {

              natives.start.call( obj, event, byStart );

              obj.emit( trackstart,
                Popcorn.extend({}, byStart, {
                  plugin: type,
                  type: trackstart
                })
              );
            }
          }
          start++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

    // Playbar receding
    } else if ( previousTime > currentTime ) {

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start > currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byStart._running === true ) {

            byStart._running = false;
            runningPlugins = obj.data.running[ type ];
            runningPlugins.splice( runningPlugins.indexOf( byStart ), 1 );

            if ( !obj.data.disabled[ type ] ) {

              natives.end.call( obj, event, byStart );

              obj.emit( trackend,
                Popcorn.extend({}, byStart, {
                  plugin: type,
                  type: trackend
                })
              );
            }
          }
          start--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end > currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd.start <= currentTime &&
                byEnd._running === false ) {

            byEnd._running = true;
            obj.data.running[ type ].push( byEnd );

            if ( !obj.data.disabled[ type ] ) {

              natives.start.call( obj, event, byEnd );

              obj.emit( trackstart,
                Popcorn.extend({}, byEnd, {
                  plugin: type,
                  type: trackstart
                })
              );
            }
          }
          end--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }
    }

    tracks.endIndex = end;
    tracks.startIndex = start;
    tracks.previousUpdateTime = currentTime;

    //enforce index integrity if trackRemoved
    tracks.byStart.length < byStartLen && tracks.startIndex--;
    tracks.byEnd.length < byEndLen && tracks.endIndex--;

  };

  //  Map and Extend TrackEvent functions to all Popcorn instances
  Popcorn.extend( Popcorn.p, {

    getTrackEvents: function() {
      return Popcorn.getTrackEvents.call( null, this );
    },

    getTrackEvent: function( id ) {
      return Popcorn.getTrackEvent.call( null, this, id );
    },

    getLastTrackEventId: function() {
      return Popcorn.getLastTrackEventId.call( null, this );
    },

    removeTrackEvent: function( id ) {

      Popcorn.removeTrackEvent.call( null, this, id );
      return this;
    },

    removePlugin: function( name ) {
      Popcorn.removePlugin.call( null, this, name );
      return this;
    },

    timeUpdate: function( event ) {
      Popcorn.timeUpdate.call( null, this, event );
      return this;
    },

    destroy: function() {
      Popcorn.destroy.call( null, this );
      return this;
    }
  });

  //  Plugin manifests
  Popcorn.manifest = {};
  //  Plugins are registered
  Popcorn.registry = [];
  Popcorn.registryByName = {};
  //  An interface for extending Popcorn
  //  with plugin functionality
  Popcorn.plugin = function( name, definition, manifest ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    //  Provides some sugar, but ultimately extends
    //  the definition into Popcorn.p
    var reserved = [ "start", "end" ],
        plugin = {},
        setup,
        isfn = typeof definition === "function",
        methods = [ "_setup", "_teardown", "start", "end", "frame" ];

    // combines calls of two function calls into one
    var combineFn = function( first, second ) {

      first = first || Popcorn.nop;
      second = second || Popcorn.nop;

      return function() {
        first.apply( this, arguments );
        second.apply( this, arguments );
      };
    };

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // apply safe, and empty default functions
    methods.forEach(function( method ) {
      definition[ method ] = safeTry( definition[ method ] || Popcorn.nop, name );
    });

    var pluginFn = function( setup, options ) {

      if ( !options ) {
        return this;
      }

      // When the "ranges" property is set and its value is an array, short-circuit
      // the pluginFn definition to recall itself with an options object generated from
      // each range object in the ranges array. (eg. { start: 15, end: 16 } )
      if ( options.ranges && Popcorn.isArray(options.ranges) ) {
        Popcorn.forEach( options.ranges, function( range ) {
          // Create a fresh object, extend with current options
          // and start/end range object's properties
          // Works with in/out as well.
          var opts = Popcorn.extend( {}, options, range );

          // Remove the ranges property to prevent infinitely
          // entering this condition
          delete opts.ranges;

          // Call the plugin with the newly created opts object
          this[ name ]( opts );
        }, this);

        // Return the Popcorn instance to avoid creating an empty track event
        return this;
      }

      //  Storing the plugin natives
      var natives = options._natives = {},
          compose = "",
          originalOpts, manifestOpts;

      Popcorn.extend( natives, setup );

      options._natives.type = name;
      options._running = false;

      natives.start = natives.start || natives[ "in" ];
      natives.end = natives.end || natives[ "out" ];

      if ( options.once ) {
        natives.end = combineFn( natives.end, function() {
          this.removeTrackEvent( options._id );
        });
      }

      // extend teardown to always call end if running
      natives._teardown = combineFn(function() {

        var args = slice.call( arguments ),
            runningPlugins = this.data.running[ natives.type ];

        // end function signature is not the same as teardown,
        // put null on the front of arguments for the event parameter
        args.unshift( null );

        // only call end if event is running
        args[ 1 ]._running &&
          runningPlugins.splice( runningPlugins.indexOf( options ), 1 ) &&
          natives.end.apply( this, args );
      }, natives._teardown );

      // default to an empty string if no effect exists
      // split string into an array of effects
      options.compose = options.compose && options.compose.split( " " ) || [];
      options.effect = options.effect && options.effect.split( " " ) || [];

      // join the two arrays together
      options.compose = options.compose.concat( options.effect );

      options.compose.forEach(function( composeOption ) {

        // if the requested compose is garbage, throw it away
        compose = Popcorn.compositions[ composeOption ] || {};

        // extends previous functions with compose function
        methods.forEach(function( method ) {
          natives[ method ] = combineFn( natives[ method ], compose[ method ] );
        });
      });

      //  Ensure a manifest object, an empty object is a sufficient fallback
      options._natives.manifest = manifest;

      //  Checks for expected properties
      if ( !( "start" in options ) ) {
        options.start = options[ "in" ] || 0;
      }

      if ( !options.end && options.end !== 0 ) {
        options.end = options[ "out" ] || Number.MAX_VALUE;
      }

      // Use hasOwn to detect non-inherited toString, since all
      // objects will receive a toString - its otherwise undetectable
      if ( !hasOwn.call( options, "toString" ) ) {
        options.toString = function() {
          var props = [
            "start: " + options.start,
            "end: " + options.end,
            "id: " + (options.id || options._id)
          ];

          // Matches null and undefined, allows: false, 0, "" and truthy
          if ( options.target != null ) {
            props.push( "target: " + options.target );
          }

          return name + " ( " + props.join(", ") + " )";
        };
      }

      // Resolves 239, 241, 242
      if ( !options.target ) {

        //  Sometimes the manifest may be missing entirely
        //  or it has an options object that doesn't have a `target` property
        manifestOpts = "options" in manifest && manifest.options;

        options.target = manifestOpts && "target" in manifestOpts && manifestOpts.target;
      }

      if ( options._natives ) {
        // ensure an initial id is there before setup is called
        options._id = Popcorn.guid( options._natives.type );
      }

      // Trigger _setup method if exists
      options._natives._setup && options._natives._setup.call( this, options );

      // Create new track event for this instance
      Popcorn.addTrackEvent( this, options );

      //  Future support for plugin event definitions
      //  for all of the native events
      Popcorn.forEach( setup, function( callback, type ) {

        if ( type !== "type" ) {

          if ( reserved.indexOf( type ) === -1 ) {

            this.on( type, callback );
          }
        }

      }, this );

      return this;
    };

    //  Extend Popcorn.p with new named definition
    //  Assign new named definition
    Popcorn.p[ name ] = plugin[ name ] = function( id, options ) {
      var length = arguments.length,
          trackEvent, defaults, mergedSetupOpts;

      // Shift arguments based on use case
      //
      // Back compat for:
      // p.plugin( options );
      if ( id && !options ) {
        options = id;
        id = null;
      } else {

        // Get the trackEvent that matches the given id.
        trackEvent = this.getTrackEvent( id );

        // If the track event does not exist, ensure that the options
        // object has a proper id
        if ( !trackEvent ) {
          options.id = id;

        // If the track event does exist, merge the updated properties
        } else {

          options = Popcorn.extend( {}, trackEvent, options );

          Popcorn.addTrackEvent( this, options );

          return this;
        }
      }

      this.data.running[ name ] = this.data.running[ name ] || [];

      // Merge with defaults if they exist, make sure per call is prioritized
      defaults = ( this.options.defaults && this.options.defaults[ name ] ) || {};
      mergedSetupOpts = Popcorn.extend( {}, defaults, options );

      return pluginFn.call( this, isfn ? definition.call( this, mergedSetupOpts ) : definition,
                                  mergedSetupOpts );
    };

    // if the manifest parameter exists we should extend it onto the definition object
    // so that it shows up when calling Popcorn.registry and Popcorn.registryByName
    if ( manifest ) {
      Popcorn.extend( definition, {
        manifest: manifest
      });
    }

    //  Push into the registry
    var entry = {
      fn: plugin[ name ],
      definition: definition,
      base: definition,
      parents: [],
      name: name
    };
    Popcorn.registry.push(
       Popcorn.extend( plugin, entry, {
        type: name
      })
    );
    Popcorn.registryByName[ name ] = entry;

    return plugin;
  };

  // Storage for plugin function errors
  Popcorn.plugin.errors = [];

  // Returns wrapped plugin function
  function safeTry( fn, pluginName ) {
    return function() {

      //  When Popcorn.plugin.debug is true, do not suppress errors
      if ( Popcorn.plugin.debug ) {
        return fn.apply( this, arguments );
      }

      try {
        return fn.apply( this, arguments );
      } catch ( ex ) {

        // Push plugin function errors into logging queue
        Popcorn.plugin.errors.push({
          plugin: pluginName,
          thrown: ex,
          source: fn.toString()
        });

        // Trigger an error that the instance can listen for
        // and react to
        this.emit( "pluginerror", Popcorn.plugin.errors );
      }
    };
  }

  // Debug-mode flag for plugin development
  // True for Popcorn development versions, false for stable/tagged versions
  Popcorn.plugin.debug = ( Popcorn.version === "@" + "VERSION" );

  //  removePlugin( type ) removes all tracks of that from all instances of popcorn
  //  removePlugin( obj, type ) removes all tracks of type from obj, where obj is a single instance of popcorn
  Popcorn.removePlugin = function( obj, name ) {

    //  Check if we are removing plugin from an instance or from all of Popcorn
    if ( !name ) {

      //  Fix the order
      name = obj;
      obj = Popcorn.p;

      if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
        Popcorn.error( "'" + name + "' is a protected function name" );
        return;
      }

      var registryLen = Popcorn.registry.length,
          registryIdx;

      // remove plugin reference from registry
      for ( registryIdx = 0; registryIdx < registryLen; registryIdx++ ) {
        if ( Popcorn.registry[ registryIdx ].name === name ) {
          Popcorn.registry.splice( registryIdx, 1 );
          delete Popcorn.registryByName[ name ];
          delete Popcorn.manifest[ name ];

          // delete the plugin
          delete obj[ name ];

          // plugin found and removed, stop checking, we are done
          return;
        }
      }

    }

    var byStart = obj.data.trackEvents.byStart,
        byEnd = obj.data.trackEvents.byEnd,
        animating = obj.data.trackEvents.animating,
        idx, sl;

    // remove all trackEvents
    for ( idx = 0, sl = byStart.length; idx < sl; idx++ ) {

      if ( byStart[ idx ] && byStart[ idx ]._natives && byStart[ idx ]._natives.type === name ) {

        byStart[ idx ]._natives._teardown && byStart[ idx ]._natives._teardown.call( obj, byStart[ idx ] );

        byStart.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
        if ( obj.data.trackEvents.startIndex <= idx ) {
          obj.data.trackEvents.startIndex--;
          obj.data.trackEvents.endIndex--;
        }
      }

      // clean any remaining references in the end index
      // we do this seperate from the above check because they might not be in the same order
      if ( byEnd[ idx ] && byEnd[ idx ]._natives && byEnd[ idx ]._natives.type === name ) {

        byEnd.splice( idx, 1 );
      }
    }

    //remove all animating events
    for ( idx = 0, sl = animating.length; idx < sl; idx++ ) {

      if ( animating[ idx ] && animating[ idx ]._natives && animating[ idx ]._natives.type === name ) {

        animating.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
      }
    }

  };

  Popcorn.compositions = {};

  //  Plugin inheritance
  Popcorn.compose = function( name, definition, manifest ) {

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // register the effect by name
    Popcorn.compositions[ name ] = definition;
  };

  Popcorn.plugin.effect = Popcorn.effect = Popcorn.compose;

  var rnaiveExpr = /^(?:\.|#|\[)/;

  //  Basic DOM utilities and helpers API. See #1037
  Popcorn.dom = {
    debug: false,
    //  Popcorn.dom.find( selector, context )
    //
    //  Returns the first element that matches the specified selector
    //  Optionally provide a context element, defaults to `document`
    //
    //  eg.
    //  Popcorn.dom.find("video") returns the first video element
    //  Popcorn.dom.find("#foo") returns the first element with `id="foo"`
    //  Popcorn.dom.find("foo") returns the first element with `id="foo"`
    //     Note: Popcorn.dom.find("foo") is the only allowed deviation
    //           from valid querySelector selector syntax
    //
    //  Popcorn.dom.find(".baz") returns the first element with `class="baz"`
    //  Popcorn.dom.find("[preload]") returns the first element with `preload="..."`
    //  ...
    //  See https://developer.mozilla.org/En/DOM/Document.querySelector
    //
    //
    find: function( selector, context ) {
      var node = null;

      //  Trim leading/trailing whitespace to avoid false negatives
      selector = selector.trim();

      //  Default context is the `document`
      context = context || document;

      if ( selector ) {
        //  If the selector does not begin with "#", "." or "[",
        //  it could be either a nodeName or ID w/o "#"
        if ( !rnaiveExpr.test( selector ) ) {

          //  Try finding an element that matches by ID first
          node = document.getElementById( selector );

          //  If a match was found by ID, return the element
          if ( node !== null ) {
            return node;
          }
        }
        //  Assume no elements have been found yet
        //  Catch any invalid selector syntax errors and bury them.
        try {
          node = context.querySelector( selector );
        } catch ( e ) {
          if ( Popcorn.dom.debug ) {
            throw new Error(e);
          }
        }
      }
      return node;
    }
  };

  //  Cache references to reused RegExps
  var rparams = /\?/,
  //  XHR Setup object
  setup = {
    url: "",
    data: "",
    dataType: "",
    success: Popcorn.nop,
    type: "GET",
    async: true,
    xhr: function() {
      return new global.XMLHttpRequest();
    }
  };

  Popcorn.xhr = function( options ) {

    options.dataType = options.dataType && options.dataType.toLowerCase() || null;

    if ( options.dataType &&
         ( options.dataType === "jsonp" || options.dataType === "script" ) ) {

      Popcorn.xhr.getJSONP(
        options.url,
        options.success,
        options.dataType === "script"
      );
      return;
    }

    var settings = Popcorn.extend( {}, setup, options );

    //  Create new XMLHttpRequest object
    settings.ajax  = settings.xhr();

    if ( settings.ajax ) {

      if ( settings.type === "GET" && settings.data ) {

        //  append query string
        settings.url += ( rparams.test( settings.url ) ? "&" : "?" ) + settings.data;

        //  Garbage collect and reset settings.data
        settings.data = null;
      }


      settings.ajax.open( settings.type, settings.url, settings.async );
      settings.ajax.send( settings.data || null );

      return Popcorn.xhr.httpData( settings );
    }
  };


  Popcorn.xhr.httpData = function( settings ) {

    var data, json = null,
        parser, xml = null;

    settings.ajax.onreadystatechange = function() {

      if ( settings.ajax.readyState === 4 ) {

        try {
          json = JSON.parse( settings.ajax.responseText );
        } catch( e ) {
          //suppress
        }

        data = {
          xml: settings.ajax.responseXML,
          text: settings.ajax.responseText,
          json: json
        };

        // Normalize: data.xml is non-null in IE9 regardless of if response is valid xml
        if ( !data.xml || !data.xml.documentElement ) {
          data.xml = null;

          try {
            parser = new DOMParser();
            xml = parser.parseFromString( settings.ajax.responseText, "text/xml" );

            if ( !xml.getElementsByTagName( "parsererror" ).length ) {
              data.xml = xml;
            }
          } catch ( e ) {
            // data.xml remains null
          }
        }

        //  If a dataType was specified, return that type of data
        if ( settings.dataType ) {
          data = data[ settings.dataType ];
        }


        settings.success.call( settings.ajax, data );

      }
    };
    return data;
  };

  Popcorn.xhr.getJSONP = function( url, success, isScript ) {

    var head = document.head || document.getElementsByTagName( "head" )[ 0 ] || document.documentElement,
      script = document.createElement( "script" ),
      isFired = false,
      params = [],
      rjsonp = /(=)\?(?=&|$)|\?\?/,
      replaceInUrl, prefix, paramStr, callback, callparam;

    if ( !isScript ) {

      // is there a calback already in the url
      callparam = url.match( /(callback=[^&]*)/ );

      if ( callparam !== null && callparam.length ) {

        prefix = callparam[ 1 ].split( "=" )[ 1 ];

        // Since we need to support developer specified callbacks
        // and placeholders in harmony, make sure matches to "callback="
        // aren't just placeholders.
        // We coded ourselves into a corner here.
        // JSONP callbacks should never have been
        // allowed to have developer specified callbacks
        if ( prefix === "?" ) {
          prefix = "jsonp";
        }

        // get the callback name
        callback = Popcorn.guid( prefix );

        // replace existing callback name with unique callback name
        url = url.replace( /(callback=[^&]*)/, "callback=" + callback );
      } else {

        callback = Popcorn.guid( "jsonp" );

        if ( rjsonp.test( url ) ) {
          url = url.replace( rjsonp, "$1" + callback );
        }

        // split on first question mark,
        // this is to capture the query string
        params = url.split( /\?(.+)?/ );

        // rebuild url with callback
        url = params[ 0 ] + "?";
        if ( params[ 1 ] ) {
          url += params[ 1 ] + "&";
        }
        url += "callback=" + callback;
      }

      //  Define the JSONP success callback globally
      window[ callback ] = function( data ) {
        // Fire success callbacks
        success && success( data );
        isFired = true;
      };
    }

    script.addEventListener( "load",  function() {

      //  Handling remote script loading callbacks
      if ( isScript ) {
        //  getScript
        success && success();
      }

      //  Executing for JSONP requests
      if ( isFired ) {
        //  Garbage collect the callback
        delete window[ callback ];
      }
      //  Garbage collect the script resource
      head.removeChild( script );
    }, false );

    script.src = url;

    head.insertBefore( script, head.firstChild );

    return;
  };

  Popcorn.getJSONP = Popcorn.xhr.getJSONP;

  Popcorn.getScript = Popcorn.xhr.getScript = function( url, success ) {

    return Popcorn.xhr.getJSONP( url, success, true );
  };

  Popcorn.util = {
    // Simple function to parse a timestamp into seconds
    // Acceptable formats are:
    // HH:MM:SS.MMM
    // HH:MM:SS;FF
    // Hours and minutes are optional. They default to 0
    toSeconds: function( timeStr, framerate ) {
      // Hours and minutes are optional
      // Seconds must be specified
      // Seconds can be followed by milliseconds OR by the frame information
      var validTimeFormat = /^([0-9]+:){0,2}[0-9]+([.;][0-9]+)?$/,
          errorMessage = "Invalid time format",
          digitPairs, lastIndex, lastPair, firstPair,
          frameInfo, frameTime;

      if ( typeof timeStr === "number" ) {
        return timeStr;
      }

      if ( typeof timeStr === "string" &&
            !validTimeFormat.test( timeStr ) ) {
        Popcorn.error( errorMessage );
      }

      digitPairs = timeStr.split( ":" );
      lastIndex = digitPairs.length - 1;
      lastPair = digitPairs[ lastIndex ];

      // Fix last element:
      if ( lastPair.indexOf( ";" ) > -1 ) {

        frameInfo = lastPair.split( ";" );
        frameTime = 0;

        if ( framerate && ( typeof framerate === "number" ) ) {
          frameTime = parseFloat( frameInfo[ 1 ], 10 ) / framerate;
        }

        digitPairs[ lastIndex ] = parseInt( frameInfo[ 0 ], 10 ) + frameTime;
      }

      firstPair = digitPairs[ 0 ];

      return {

        1: parseFloat( firstPair, 10 ),

        2: ( parseInt( firstPair, 10 ) * 60 ) +
              parseFloat( digitPairs[ 1 ], 10 ),

        3: ( parseInt( firstPair, 10 ) * 3600 ) +
            ( parseInt( digitPairs[ 1 ], 10 ) * 60 ) +
              parseFloat( digitPairs[ 2 ], 10 )

      }[ digitPairs.length || 1 ];
    }
  };

  // alias for exec function
  Popcorn.p.cue = Popcorn.p.exec;

  //  Protected API methods
  Popcorn.protect = {
    natives: getKeys( Popcorn.p ).map(function( val ) {
      return val.toLowerCase();
    })
  };

  // Setup logging for deprecated methods
  Popcorn.forEach({
    // Deprecated: Recommended
    "listen": "on",
    "unlisten": "off",
    "trigger": "emit",
    "exec": "cue"

  }, function( recommend, api ) {
    var original = Popcorn.p[ api ];
    // Override the deprecated api method with a method of the same name
    // that logs a warning and defers to the new recommended method
    Popcorn.p[ api ] = function() {
      if ( typeof console !== "undefined" && console.warn ) {
        console.warn(
          "Deprecated method '" + api + "', " +
          (recommend == null ? "do not use." : "use '" + recommend + "' instead." )
        );

        // Restore api after first warning
        Popcorn.p[ api ] = original;
      }
      return Popcorn.p[ recommend ].apply( this, [].slice.call( arguments ) );
    };
  });


  //  Exposes Popcorn to global context
  global.Popcorn = Popcorn;

})(window, window.document);
/*!
 * Popcorn.sequence
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */

/* jslint forin: true, maxerr: 50, indent: 4, es5: true  */
/* global Popcorn: true */

// Requires Popcorn.js
(function( global, Popcorn ) {

  // TODO: as support increases, migrate to element.dataset
  var doc = global.document,
      location = global.location,
      rprotocol = /:\/\//,
      // TODO: better solution to this sucky stop-gap
      lochref = location.href.replace( location.href.split("/").slice(-1)[0], "" ),
      // privately held
      range = function(start, stop, step) {

        start = start || 0;
        stop = ( stop || start || 0 ) + 1;
        step = step || 1;

        var len = Math.ceil((stop - start) / step) || 0,
            idx = 0,
            range = [];

        range.length = len;

        while (idx < len) {
         range[idx++] = start;
         start += step;
        }
        return range;
      };

  Popcorn.sequence = function( parent, list ) {
    return new Popcorn.sequence.init( parent, list );
  };

  Popcorn.sequence.init = function( parent, list ) {

    // Video element
    this.parent = doc.getElementById( parent );

    // Store ref to a special ID
    this.seqId = Popcorn.guid( "__sequenced" );

    // List of HTMLVideoElements
    this.queue = [];

    // List of Popcorn objects
    this.playlist = [];

    // Lists of in/out points
    this.inOuts = {

      // Stores the video in/out times for each video in sequence
      ofVideos: [],

      // Stores the clip in/out times for each clip in sequences
      ofClips: []

    };

    // Store first video dimensions
    this.dims = {
      width: 0, //this.video.videoWidth,
      height: 0 //this.video.videoHeight
    };

    this.active = 0;
    this.cycling = false;
    this.playing = false;

    this.times = {
      last: 0
    };

    // Store event pointers and queues
    this.events = {

    };

    var self = this,
        clipOffset = 0;

    // Create `video` elements
    Popcorn.forEach( list, function( media, idx ) {

      var video = doc.createElement( "video" );

      video.preload = "auto";

      // Setup newly created video element
      video.controls = true;

      // If the first, show it, if the after, hide it
      video.style.display = ( idx && "none" ) || "" ;

      // Seta registered sequence id
      video.id = self.seqId + "-" + idx ;

      // Push this video into the sequence queue
      self.queue.push( video );

      var //satisfy lint
       mIn = media["in"],
       mOut = media["out"];

      // Push the in/out points into sequence ioVideos
      self.inOuts.ofVideos.push({
        "in": ( mIn !== undefined && mIn ) || 1,
        "out": ( mOut !== undefined && mOut ) || 0
      });

      self.inOuts.ofVideos[ idx ]["out"] = self.inOuts.ofVideos[ idx ]["out"] || self.inOuts.ofVideos[ idx ]["in"] + 2;

      // Set the sources
      video.src = !rprotocol.test( media.src ) ? lochref + media.src : media.src;

      // Set some squence specific data vars
      video.setAttribute("data-sequence-owner", parent );
      video.setAttribute("data-sequence-guid", self.seqId );
      video.setAttribute("data-sequence-id", idx );
      video.setAttribute("data-sequence-clip", [ self.inOuts.ofVideos[ idx ]["in"], self.inOuts.ofVideos[ idx ]["out"] ].join(":") );

      // Append the video to the parent element
      self.parent.appendChild( video );


      self.playlist.push( Popcorn("#" + video.id ) );

    });

    self.inOuts.ofVideos.forEach(function( obj ) {

      var clipDuration = obj["out"] - obj["in"],
          offs = {
            "in": clipOffset,
            "out": clipOffset + clipDuration
          };

      self.inOuts.ofClips.push( offs );

      clipOffset = offs["out"] + 1;
    });

    Popcorn.forEach( this.queue, function( media, idx ) {

      function canPlayThrough( event ) {

        // If this is idx zero, use it as dimension for all
        if ( !idx ) {
          self.dims.width = media.videoWidth;
          self.dims.height = media.videoHeight;
        }

        media.currentTime = self.inOuts.ofVideos[ idx ]["in"] - 0.5;

        media.removeEventListener( "canplaythrough", canPlayThrough, false );

        return true;
      }

      // Hook up event listeners for managing special playback
      media.addEventListener( "canplaythrough", canPlayThrough, false );

      // TODO: consolidate & DRY
      media.addEventListener( "play", function( event ) {

        self.playing = true;

      }, false );

      media.addEventListener( "pause", function( event ) {

        self.playing = false;

      }, false );

      media.addEventListener( "timeupdate", function( event ) {

        var target = event.srcElement || event.target,
            seqIdx = +(  (target.dataset && target.dataset.sequenceId) || target.getAttribute("data-sequence-id") ),
            floor = Math.floor( media.currentTime );

        if ( self.times.last !== floor &&
              seqIdx === self.active ) {

          self.times.last = floor;

          if ( floor === self.inOuts.ofVideos[ seqIdx ]["out"] ) {

            Popcorn.sequence.cycle.call( self, seqIdx );
          }
        }
      }, false );
    });

    return this;
  };

  Popcorn.sequence.init.prototype = Popcorn.sequence.prototype;

  //
  Popcorn.sequence.cycle = function( idx ) {

    if ( !this.queue ) {
      Popcorn.error("Popcorn.sequence.cycle is not a public method");
    }

    var // Localize references
    queue = this.queue,
    ioVideos = this.inOuts.ofVideos,
    current = queue[ idx ],
    nextIdx = 0,
    next, clip;


    var // Popcorn instances
    $popnext,
    $popprev;


    if ( queue[ idx + 1 ] ) {
      nextIdx = idx + 1;
    }

    // Reset queue
    if ( !queue[ idx + 1 ] ) {

      nextIdx = 0;
      this.playlist[ idx ].pause();

    } else {

      next = queue[ nextIdx ];
      clip = ioVideos[ nextIdx ];

      // Constrain dimentions
      Popcorn.extend( next, {
        width: this.dims.width,
        height: this.dims.height
      });

      $popnext = this.playlist[ nextIdx ];
      $popprev = this.playlist[ idx ];

      // When not resetting to 0
      current.pause();

      this.active = nextIdx;
      this.times.last = clip["in"] - 1;

      // Play the next video in the sequence
      $popnext.currentTime( clip["in"] );

      $popnext[ nextIdx ? "play" : "pause" ]();

      // Trigger custom cycling event hook
      this.trigger( "cycle", {

        position: {
          previous: idx,
          current: nextIdx
        }

      });

      // Set the previous back to it's beginning time
      // $popprev.currentTime( ioVideos[ idx ].in );

      if ( nextIdx ) {
        // Hide the currently ending video
        current.style.display = "none";
        // Show the next video in the sequence
        next.style.display = "";
      }

      this.cycling = false;
    }

    return this;
  };

  var excludes = [ "timeupdate", "play", "pause" ];

  // Sequence object prototype
  Popcorn.extend( Popcorn.sequence.prototype, {

    // Returns Popcorn object from sequence at index
    eq: function( idx ) {
      return this.playlist[ idx ];
    },
    // Remove a sequence from it's playback display container
    remove: function() {
      this.parent.innerHTML = null;
    },
    // Returns Clip object from sequence at index
    clip: function( idx ) {
      return this.inOuts.ofVideos[ idx ];
    },
    // Returns sum duration for all videos in sequence
    duration: function() {

      var ret = 0,
          seq = this.inOuts.ofClips,
          idx = 0;

      for ( ; idx < seq.length; idx++ ) {
        ret += seq[ idx ]["out"] - seq[ idx ]["in"] + 1;
      }

      return ret - 1;
    },

    play: function() {

      this.playlist[ this.active ].play();

      return this;
    },
    // Attach an event to a single point in time
    exec: function ( time, fn ) {

      var index = this.active;

      this.inOuts.ofClips.forEach(function( off, idx ) {
        if ( time >= off["in"] && time <= off["out"] ) {
          index = idx;
        }
      });

      //offsetBy = time - self.inOuts.ofVideos[ index ].in;

      time += this.inOuts.ofVideos[ index ]["in"] - this.inOuts.ofClips[ index ]["in"];

      // Creating a one second track event with an empty end
      Popcorn.addTrackEvent( this.playlist[ index ], {
        start: time - 1,
        end: time,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "exec"
        }
      });

      return this;
    },
    // Binds event handlers that fire only when all
    // videos in sequence have heard the event
    listen: function( type, callback ) {

      var self = this,
          seq = this.playlist,
          total = seq.length,
          count = 0,
          fnName;

      if ( !callback ) {
        callback = Popcorn.nop;
      }

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {
        Popcorn.forEach( seq, function( video ) {

          video.listen( type, function( event ) {

            event.active = self;

            if ( excludes.indexOf( type ) > -1 ) {

              callback.call( video, event );

            } else {
              if ( ++count === total ) {
                callback.call( video, event );
              }
            }
          });
        });

      } else {

        // If no events registered with this name, create a cache
        if ( !this.events[ type ] ) {
          this.events[ type ] = {};
        }

        // Normalize a callback name key
        fnName = callback.name || Popcorn.guid( "__" + type );

        // Store in event cache
        this.events[ type ][ fnName ] = callback;
      }

      // Return the sequence object
      return this;
    },
    unlisten: function( type, name ) {
      // TODO: finish implementation
    },
    trigger: function( type, data ) {
      var self = this;

      // Handling for DOM and Media events
      if ( Popcorn.Events.Natives.indexOf( type ) > -1 ) {

        //  find the active video and trigger api events on that video.
        return;

      } else {

        // Only proceed if there are events of this type
        // currently registered on the sequence
        if ( this.events[ type ] ) {

          Popcorn.forEach( this.events[ type ], function( callback, name ) {
            callback.call( self, { type: type }, data );
          });

        }
      }

      return this;
    }
  });


  Popcorn.forEach( Popcorn.manifest, function( obj, plugin ) {

    // Implement passthrough methods to plugins
    Popcorn.sequence.prototype[ plugin ] = function( options ) {

      // console.log( this, options );
      var videos = {}, assignTo = [],
      idx, off, inOuts, inIdx, outIdx, keys, clip, clipInOut, clipRange;

      for ( idx = 0; idx < this.inOuts.ofClips.length; idx++  ) {
        // store reference
        off = this.inOuts.ofClips[ idx ];
        // array to test against
        inOuts = range( off["in"], off["out"] );

        inIdx = inOuts.indexOf( options.start );
        outIdx = inOuts.indexOf( options.end );

        if ( inIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            start: inOuts[ inIdx ],
            clipIdx: inIdx
          });
        }

        if ( outIdx > -1 ) {
          videos[ idx ] = Popcorn.extend( {}, off, {
            end: inOuts[ outIdx ],
            clipIdx: outIdx
          });
        }
      }

      keys = Object.keys( videos ).map(function( val ) {
                return +val;
              });

      assignTo = range( keys[ 0 ], keys[ 1 ] );

      //console.log( "PLUGIN CALL MAPS: ", videos, keys, assignTo );
      for ( idx = 0; idx < assignTo.length; idx++ ) {

        var compile = {},
        play = assignTo[ idx ],
        vClip = videos[ play ];

        if ( vClip ) {

          // has instructions
          clip = this.inOuts.ofVideos[ play ];
          clipInOut = vClip.clipIdx;
          clipRange = range( clip["in"], clip["out"] );

          if ( vClip.start ) {
            compile.start = clipRange[ clipInOut ];
            compile.end = clipRange[ clipRange.length - 1 ];
          }

          if ( vClip.end ) {
            compile.start = clipRange[ 0 ];
            compile.end = clipRange[ clipInOut ];
          }

          //compile.start += 0.1;
          //compile.end += 0.9;

        } else {

          compile.start = this.inOuts.ofVideos[ play ]["in"];
          compile.end = this.inOuts.ofVideos[ play ]["out"];

          //compile.start += 0.1;
          //compile.end += 0.9;

        }

        // Handling full clip persistance
        //if ( compile.start === compile.end ) {
          //compile.start -= 0.1;
          //compile.end += 0.9;
        //}

        // Call the plugin on the appropriate Popcorn object in the playlist
        // Merge original options object & compiled (start/end) object into
        // a new fresh object
        this.playlist[ play ][ plugin ](

          Popcorn.extend( {}, options, compile )

        );

      }

      // Return the sequence object
      return this;
    };

  });
})( this, Popcorn );
(function( Popcorn ) {
  document.addEventListener( "DOMContentLoaded", function() {

    //  Supports non-specific elements
    var dataAttr = "data-timeline-sources",
        medias = document.querySelectorAll( "[" + dataAttr + "]" );

    Popcorn.forEach( medias, function( idx, key ) {

      var media = medias[ key ],
          hasDataSources = false,
          dataSources, data, popcornMedia;

      //  Ensure that the DOM has an id
      if ( !media.id ) {

        media.id = Popcorn.guid( "__popcorn" );
      }

      //  Ensure we're looking at a dom node
      if ( media.nodeType && media.nodeType === 1 ) {

        popcornMedia = Popcorn( "#" + media.id );

        dataSources = ( media.getAttribute( dataAttr ) || "" ).split( "," );

        if ( dataSources[ 0 ] ) {

          Popcorn.forEach( dataSources, function( source ) {

            // split the parser and data as parser!file
            data = source.split( "!" );

            // if no parser is defined for the file, assume "parse" + file extension
            if ( data.length === 1 ) {

              // parse a relative URL for the filename, split to get extension
              data = source.match( /(.*)[\/\\]([^\/\\]+\.\w+)$/ )[ 2 ].split( "." );

              data[ 0 ] = "parse" + data[ 1 ].toUpperCase();
              data[ 1 ] = source;
            }

            //  If the media has data sources and the correct parser is registered, continue to load
            if ( dataSources[ 0 ] && popcornMedia[ data[ 0 ] ] ) {

              //  Set up the media and load in the datasources
              popcornMedia[ data[ 0 ] ]( data[ 1 ] );

            }
          });

        }

        //  Only play the media if it was specified to do so
        if ( !!popcornMedia.autoplay() ) {
          popcornMedia.play();
        }

      }
    });
  }, false );

})( Popcorn );(function( global, Popcorn ) {

  var navigator = global.navigator;

  // Initialize locale data
  // Based on http://en.wikipedia.org/wiki/Language_localisation#Language_tags_and_codes
  function initLocale( arg ) {

    var locale = typeof arg === "string" ? arg : [ arg.language, arg.region ].join( "-" ),
        parts = locale.split( "-" );

    // Setup locale data table
    return {
      iso6391: locale,
      language: parts[ 0 ] || "",
      region: parts[ 1 ] || ""
    };
  }

  // Declare locale data table
  var localeData = initLocale( navigator.userLanguage || navigator.language );

  Popcorn.locale = {

    // Popcorn.locale.get()
    // returns reference to privately
    // defined localeData
    get: function() {
      return localeData;
    },

    // Popcorn.locale.set( string|object );
    set: function( arg ) {

      localeData = initLocale( arg );

      Popcorn.locale.broadcast();

      return localeData;
    },

    // Popcorn.locale.broadcast( type )
    // Sends events to all popcorn media instances that are
    // listening for locale events
    broadcast: function( type ) {

      var instances = Popcorn.instances,
          length = instances.length,
          idx = 0,
          instance;

      type = type || "locale:changed";

      // Iterate all current instances
      for ( ; idx < length; idx++ ) {
        instance = instances[ idx ];

        // For those instances with locale event listeners,
        // trigger a locale change event
        if ( type in instance.data.events  ) {
          instance.trigger( type );
        }
      }
    }
  };
})( this, this.Popcorn );(function( Popcorn ) {

  var

  AP = Array.prototype,
  OP = Object.prototype,

  forEach = AP.forEach,
  slice = AP.slice,
  hasOwn = OP.hasOwnProperty,
  toString = OP.toString;

  // stores parsers keyed on filetype
  Popcorn.parsers = {};

  // An interface for extending Popcorn
  // with parser functionality
  Popcorn.parser = function( name, type, definition ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    // fixes parameters for overloaded function call
    if ( typeof type === "function" && !definition ) {
      definition = type;
      type = "";
    }

    if ( typeof definition !== "function" || typeof type !== "string" ) {
      return;
    }

    // Provides some sugar, but ultimately extends
    // the definition into Popcorn.p

    var natives = Popcorn.events.all,
        parseFn,
        parser = {};

    parseFn = function( filename, callback ) {

      if ( !filename ) {
        return this;
      }

      var that = this;

      Popcorn.xhr({
        url: filename,
        dataType: type,
        success: function( data ) {

          var tracksObject = definition( data ),
              tracksData,
              tracksDataLen,
              tracksDef,
              idx = 0;

          tracksData = tracksObject.data || [];
          tracksDataLen = tracksData.length;
          tracksDef = null;

          //  If no tracks to process, return immediately
          if ( !tracksDataLen ) {
            return;
          }

          //  Create tracks out of parsed object
          for ( ; idx < tracksDataLen; idx++ ) {

            tracksDef = tracksData[ idx ];

            for ( var key in tracksDef ) {

              if ( hasOwn.call( tracksDef, key ) && !!that[ key ] ) {

                that[ key ]( tracksDef[ key ] );
              }
            }
          }
          if ( callback ) {
            callback();
          }
        }
      });

      return this;
    };

    // Assign new named definition
    parser[ name ] = parseFn;

    // Extend Popcorn.p with new named definition
    Popcorn.extend( Popcorn.p, parser );

    // keys the function name by filetype extension
    //Popcorn.parsers[ name ] = true;

    return parser;
  };
})( Popcorn );(function( Popcorn ) {

  // combines calls of two function calls into one
  var combineFn = function( first, second ) {

    first = first || Popcorn.nop;
    second = second || Popcorn.nop;

    return function() {

      first.apply( this, arguments );
      second.apply( this, arguments );
    };
  };

  //  ID string matching
  var rIdExp  = /^(#([\w\-\_\.]+))$/;

  var audioExtensions = "ogg|oga|aac|mp3|wav",
      videoExtensions = "ogg|ogv|mp4|webm",
      mediaExtensions = audioExtensions + "|" + videoExtensions;

  var audioExtensionRegexp = new RegExp( "^.*\\.(" + audioExtensions + ")($|\\?)" ),
      mediaExtensionRegexp = new RegExp( "^.*\\.(" + mediaExtensions + ")($|\\?)" );

  Popcorn.player = function( name, player ) {

    // return early if a player already exists under this name
    if ( Popcorn[ name ] ) {

      return;
    }

    player = player || {};

    var playerFn = function( target, src, options ) {

      options = options || {};

      // List of events
      var date = new Date() / 1000,
          baselineTime = date,
          currentTime = 0,
          readyState = 0,
          volume = 1,
          muted = false,
          events = {},

          // The container div of the resource
          container = typeof target === "string" ? Popcorn.dom.find( target ) : target,
          basePlayer = {},
          timeout,
          popcorn;

      if ( !Object.prototype.__defineGetter__ ) {

        basePlayer = container || document.createElement( "div" );
      }

      // copies a div into the media object
      for( var val in container ) {

        // don't copy properties if using container as baseplayer
        if ( val in basePlayer ) {

          continue;
        }

        if ( typeof container[ val ] === "object" ) {

          basePlayer[ val ] = container[ val ];
        } else if ( typeof container[ val ] === "function" ) {

          basePlayer[ val ] = (function( value ) {

            // this is a stupid ugly kludgy hack in honour of Safari
            // in Safari a NodeList is a function, not an object
            if ( "length" in container[ value ] && !container[ value ].call ) {

              return container[ value ];
            } else {

              return function() {

                return container[ value ].apply( container, arguments );
              };
            }
          }( val ));
        } else {

          Popcorn.player.defineProperty( basePlayer, val, {
            get: (function( value ) {

              return function() {

                return container[ value ];
              };
            }( val )),
            set: Popcorn.nop,
            configurable: true
          });
        }
      }

      var timeupdate = function() {

        date = new Date() / 1000;

        if ( !basePlayer.paused ) {

          basePlayer.currentTime = basePlayer.currentTime + ( date - baselineTime );
          basePlayer.dispatchEvent( "timeupdate" );
          timeout = setTimeout( timeupdate, 10 );
        }

        baselineTime = date;
      };

      basePlayer.play = function() {

        this.paused = false;

        if ( basePlayer.readyState >= 4 ) {

          baselineTime = new Date() / 1000;
          basePlayer.dispatchEvent( "play" );
          timeupdate();
        }
      };

      basePlayer.pause = function() {

        this.paused = true;
        basePlayer.dispatchEvent( "pause" );
      };

      Popcorn.player.defineProperty( basePlayer, "currentTime", {
        get: function() {

          return currentTime;
        },
        set: function( val ) {

          // make sure val is a number
          currentTime = +val;
          basePlayer.dispatchEvent( "timeupdate" );

          return currentTime;
        },
        configurable: true
      });

      Popcorn.player.defineProperty( basePlayer, "volume", {
        get: function() {

          return volume;
        },
        set: function( val ) {

          // make sure val is a number
          volume = +val;
          basePlayer.dispatchEvent( "volumechange" );
          return volume;
        },
        configurable: true
      });

      Popcorn.player.defineProperty( basePlayer, "muted", {
        get: function() {

          return muted;
        },
        set: function( val ) {

          // make sure val is a number
          muted = +val;
          basePlayer.dispatchEvent( "volumechange" );
          return muted;
        },
        configurable: true
      });

      Popcorn.player.defineProperty( basePlayer, "readyState", {
        get: function() {

          return readyState;
        },
        set: function( val ) {

          readyState = val;
          return readyState;
        },
        configurable: true
      });

      // Adds an event listener to the object
      basePlayer.addEventListener = function( evtName, fn ) {

        if ( !events[ evtName ] ) {

          events[ evtName ] = [];
        }

        events[ evtName ].push( fn );
        return fn;
      };

      // Removes an event listener from the object
      basePlayer.removeEventListener = function( evtName, fn ) {

        var i,
            listeners = events[ evtName ];

        if ( !listeners ){

          return;
        }

        // walk backwards so we can safely splice
        for ( i = events[ evtName ].length - 1; i >= 0; i-- ) {

          if( fn === listeners[ i ] ) {

            listeners.splice(i, 1);
          }
        }

        return fn;
      };

      // Can take event object or simple string
      basePlayer.dispatchEvent = function( oEvent ) {

        var evt,
            self = this,
            eventInterface,
            eventName = oEvent.type;

        // A string was passed, create event object
        if ( !eventName ) {

          eventName = oEvent;
          eventInterface  = Popcorn.events.getInterface( eventName );

          if ( eventInterface ) {

            evt = document.createEvent( eventInterface );
            evt.initEvent( eventName, true, true, window, 1 );
          }
        }

        if ( events[ eventName ] ) {

          for ( var i = events[ eventName ].length - 1; i >= 0; i-- ) {

            events[ eventName ][ i ].call( self, evt, self );
          }
        }
      };

      // Attempt to get src from playerFn parameter
      basePlayer.src = src || "";
      basePlayer.duration = 0;
      basePlayer.paused = true;
      basePlayer.ended = 0;

      options && options.events && Popcorn.forEach( options.events, function( val, key ) {

        basePlayer.addEventListener( key, val, false );
      });

      // true and undefined returns on canPlayType means we should attempt to use it,
      // false means we cannot play this type
      if ( player._canPlayType( container.nodeName, src ) !== false ) {

        if ( player._setup ) {

          player._setup.call( basePlayer, options );
        } else {

          // there is no setup, which means there is nothing to load
          basePlayer.readyState = 4;
          basePlayer.dispatchEvent( "loadedmetadata" );
          basePlayer.dispatchEvent( "loadeddata" );
          basePlayer.dispatchEvent( "canplaythrough" );
        }
      } else {

        // Asynchronous so that users can catch this event
        setTimeout( function() {
          basePlayer.dispatchEvent( "error" );
        }, 0 );
      }

      popcorn = new Popcorn.p.init( basePlayer, options );

      if ( player._teardown ) {

        popcorn.destroy = combineFn( popcorn.destroy, function() {

          player._teardown.call( basePlayer, options );
        });
      }

      return popcorn;
    };

    playerFn.canPlayType = player._canPlayType = player._canPlayType || Popcorn.nop;

    Popcorn[ name ] = Popcorn.player.registry[ name ] = playerFn;
  };

  Popcorn.player.registry = {};

  Popcorn.player.defineProperty = Object.defineProperty || function( object, description, options ) {

    object.__defineGetter__( description, options.get || Popcorn.nop );
    object.__defineSetter__( description, options.set || Popcorn.nop );
  };

  // player queue is to help players queue things like play and pause
  // HTML5 video's play and pause are asynch, but do fire in sequence
  // play() should really mean "requestPlay()" or "queuePlay()" and
  // stash a callback that will play the media resource when it's ready to be played
  Popcorn.player.playerQueue = function() {

    var _queue = [],
        _running = false;

    return {
      next: function() {

        _running = false;
        _queue.shift();
        _queue[ 0 ] && _queue[ 0 ]();
      },
      add: function( callback ) {

        _queue.push(function() {

          _running = true;
          callback && callback();
        });

        // if there is only one item on the queue, start it
        !_running && _queue[ 0 ]();
      }
    };
  };

  // smart will attempt to find you a match, if it does not find a match,
  // it will attempt to create a video element with the source,
  // if that failed, it will throw.
  Popcorn.smart = function( target, src, options ) {
    var playerType,
        elementTypes = [ "AUDIO", "VIDEO" ],
        sourceNode,
        firstSrc,
        node = Popcorn.dom.find( target ),
        i, srcResult,
        canPlayTypeTester = document.createElement( "video" ),
        canPlayTypes = {
          "ogg": "video/ogg",
          "ogv": "video/ogg",
          "oga": "audio/ogg",
          "webm": "video/webm",
          "mp4": "video/mp4",
          "mp3": "audio/mp3"
        };

    var canPlayType = function( type ) {

      return canPlayTypeTester.canPlayType( canPlayTypes[ type ] );
    };

    var canPlaySrc = function( src ) {

      srcResult = mediaExtensionRegexp.exec( src );

      if ( !srcResult || !srcResult[ 1 ] ) {
        return false;
      }

      return canPlayType( srcResult[ 1 ] );
    };

    if ( !node ) {

      Popcorn.error( "Specified target " + target + " was not found." );
      return;
    }

    // For when no src is defined.
    // Usually this is a video element with a src already on it.
    if ( elementTypes.indexOf( node.nodeName ) > -1 && !src ) {

      if ( typeof src === "object" ) {

        options = src;
        src = undefined;
      }

      return Popcorn( node, options );
    }

    // if our src is not an array, create an array of one.	
    if ( typeof( src ) === "string" ) {

      src = [ src ];
    }

    // go through each src, and find the first playable.
    // this only covers player sources popcorn knows of,
    // and not things like a youtube src that is private.
    // it will still consider a private youtube video to be playable.
    for ( i = 0, srcLength = src.length; i < srcLength; i++ ) {

      // src is a playable HTML5 video, we don't need to check custom players.
      if ( canPlaySrc( src[ i ] ) ) {

        src = src[ i ];
        break;
      }

      // for now we loop through and use the first valid player we find.
      for ( var key in Popcorn.player.registry ) {

        if ( Popcorn.player.registry.hasOwnProperty( key ) ) {

          if ( Popcorn.player.registry[ key ].canPlayType( node.nodeName, src[ i ] ) ) {

            // Popcorn.smart( player, src, /* options */ )
            return Popcorn[ key ]( node, src[ i ], options );
          }
        }
      }
    }

    // Popcorn.smart( div, src, /* options */ )
    // attempting to create a video in a container
    if ( elementTypes.indexOf( node.nodeName ) === -1 ) {

      firstSrc = typeof( src ) === "string" ? src : src.length ? src[ 0 ] : src;

      target = document.createElement( !!audioExtensionRegexp.exec( firstSrc ) ? elementTypes[ 0 ] : elementTypes[ 1 ] );

      // Controls are defaulted to being present
      target.controls = true;

      node.appendChild( target );
      node = target;
    }

    options && options.events && options.events.error && node.addEventListener( "error", options.events.error, false );
    node.src = src;

    return Popcorn( node, options );

  };
})( Popcorn );
// PLUGIN: mediaspawner
/**
  * mediaspawner Popcorn Plugin.
  * Adds Video/Audio to the page using Popcorns players
  * Start is the time that you want this plug-in to execute
  * End is the time that you want this plug-in to stop executing
  *
  * @param {HTML} options
  *
  * Example:
    var p = Popcorn('#video')
      .mediaspawner( {
        source: "http://www.youtube.com/watch?v=bUB1L3zGVvc",
        target: "mediaspawnerdiv",
        start: 1,
        end: 10,
        caption: "This is a test. We are assuming conrol. We are assuming control."
      })
  *
  */
(function ( Popcorn, global ) {
  var PLAYER_URL = "http://popcornjs.org/code/modules/player/popcorn.player.js",
      urlRegex = /(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu|vimeo|soundcloud|baseplayer)/,
      forEachPlayer,
      playerTypeLoading = {},
      playerTypesLoaded = {
        "vimeo": false,
        "youtube": false,
        "soundcloud": false,
        "module": false
      };

  Object.defineProperty( playerTypeLoading, forEachPlayer, {
    get: function() {
      return playerTypesLoaded[ forEachPlayer ];
    },
    set: function( val ) {
      playerTypesLoaded[ forEachPlayer ] = val;
    }
  });

  Popcorn.plugin( "mediaspawner", {
    manifest: {
      about: {
        name: "Popcorn Media Spawner Plugin",
        version: "0.1",
        author: "Matthew Schranz, @mjschranz",
        website: "mschranz.wordpress.com"
      },
      options: {
        source: {
          elem: "input",
          type: "text",
          label: "Media Source",
          "default": "http://www.youtube.com/watch?v=CXDstfD9eJ0"
        },
        caption: {
          elem: "input",
          type: "text",
          label: "Media Caption",
          "default": "Popcorn Popping",
          optional: true
        },
        target: "mediaspawner-container",
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        autoplay: {
          elem: "input",
          type: "checkbox",
          label: "Autoplay Video",
          optional: true
        },
        width: {
          elem: "input",
          type: "number",
          label: "Media Width",
          "default": 400,
          units: "px",
          optional: true
        },
        height: {
          elem: "input",
          type: "number",
          label: "Media Height",
          "default": 200,
          units: "px",
          optional: true
        }
      }
    },
    _setup: function( options ) {
      var target = document.getElementById( options.target ) || {},
          mediaType,
          container,
          capContainer,
          regexResult;

      regexResult = urlRegex.exec( options.source );
      if ( regexResult ) {
        mediaType = regexResult[ 1 ];
        // our regex only handles youtu ( incase the url looks something like youtu.be )
        if ( mediaType === "youtu" ) {
          mediaType = "youtube";
        }
      }
      else {
        // if the regex didn't return anything we know it's an HTML5 source
        mediaType = "HTML5";
      }

      // Store Reference to Type for use in end
      options._type = mediaType;

      // Create separate container for plugin
      options._container = document.createElement( "div" );
      container = options._container;
      container.id = "mediaSpawnerdiv-" + Popcorn.guid();

      // Default width and height of media
      options.width = options.width || 400;
      options.height = options.height || 200;

      // Captions now need to be in their own container, due to the problem with flash players
      // described in start/end
      if ( options.caption ) {
        capContainer = document.createElement( "div" );
        capContainer.innerHTML = options.caption;
        capContainer.style.display = "none";
        options._capCont = capContainer;
        container.appendChild( capContainer );
      }

      target && target.appendChild( container );

      function constructMedia(){

        function checkPlayerTypeLoaded() {
          if ( mediaType !== "HTML5" && !window.Popcorn[ mediaType ] ) {
            setTimeout( function() {
              checkPlayerTypeLoaded();
            }, 300 );
          } else {
            options.id = options._container.id;
            // Set the width/height of the container before calling Popcorn.smart
            // Allows youtube to pickup on the specified height an create the player
            // with specified dimensions
            options._container.style.width = options.width + "px";
            options._container.style.height = options.height + "px";
            options.popcorn = Popcorn.smart( "#" + options.id, options.source );

            if ( mediaType === "HTML5" ) {
              options.popcorn.controls( true );
            }
            
            // Set them to 0 now so it is hidden
            options._container.style.width = "0px";
            options._container.style.height = "0px";
            options._container.style.visibility = "hidden";
            options._container.style.overflow = "hidden";
          }
        }

        if ( mediaType !== "HTML5" && !window.Popcorn[ mediaType ] && !playerTypeLoading[ mediaType ] ) {
          playerTypeLoading[ mediaType ] = true;
          Popcorn.getScript( "http://popcornjs.org/code/players/" + mediaType + "/popcorn." + mediaType + ".js", function() {
            checkPlayerTypeLoaded();
          });
        }
        else {
          checkPlayerTypeLoaded();
        }

      }

      // If Player script needed to be loaded, keep checking until it is and then fire readycallback
      function isPlayerReady() {
        if ( !window.Popcorn.player ) {
          setTimeout( function () {
            isPlayerReady();
          }, 300 );
        } else {
          constructMedia();
        }
      }

      // If player script isn't present, retrieve script
      if ( !window.Popcorn.player && !playerTypeLoading.module ) {
        playerTypeLoading.module = true;
        Popcorn.getScript( PLAYER_URL, isPlayerReady );
      } else {
        isPlayerReady();
      }

    },
    start: function( event, options ) {
      if( options._capCont ) {
        options._capCont.style.display = "";
      }

      /* Using this style for Start/End is required because of the flash players
       * Without it on end an internal cleanup is called, causing the flash players
       * to be out of sync with Popcorn, as they are then rebuilt.
       */
      options._container.style.width = options.width + "px";
      options._container.style.height = options.height + "px";
      options._container.style.visibility = "visible";
      options._container.style.overflow = "visible";

      if ( options.autoplay ) {
        options.popcorn.play();
      }
    },
    end: function( event, options ) {
      if( options._capCont ) {
        options._capCont.style.display = "none";
      }

      /* Using this style for Start/End is required because of the flash players
       * Without it on end an internal cleanup is called, causing the flash players
       * to be out of sync with Popcorn, as they are then rebuilt.
       */
      options._container.style.width = "0px";
      options._container.style.height = "0px";
      options._container.style.visibility = "hidden";
      options._container.style.overflow = "hidden";

      // Pause all popcorn instances on exit
      options.popcorn.pause();

    },
    _teardown: function( options ) {
      if ( options.popcorn && options.popcorn.destory ) {
        options.popcorn.destroy();
      }
      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
    }
  });
})( Popcorn, this );
// PLUGIN: Code

(function ( Popcorn ) {

  /**
   * Code Popcorn Plug-in
   *
   * Adds the ability to run arbitrary code (JavaScript functions) according to video timing.
   *
   * @param {Object} options
   *
   * Required parameters: start, end, template, data, and target.
   * Optional parameter: static.
   *
   *   start: the time in seconds when the mustache template should be rendered
   *          in the target div.
   *
   *   end: the time in seconds when the rendered mustache template should be
   *        removed from the target div.
   *
   *   onStart: the function to be run when the start time is reached.
   *
   *   onFrame: [optional] a function to be run on each paint call
   *            (e.g., called ~60 times per second) between the start and end times.
   *
   *   onEnd: [optional] a function to be run when the end time is reached.
   *
   * Example:
     var p = Popcorn('#video')

        // onStart function only
        .code({
          start: 1,
          end: 4,
          onStart: function( options ) {
            // called on start
          }
        })

        // onStart + onEnd only
        .code({
          start: 6,
          end: 8,
          onStart: function( options ) {
            // called on start
          },
          onEnd: function ( options ) {
            // called on end
          }
        })

        // onStart, onEnd, onFrame
        .code({
          start: 10,
          end: 14,
          onStart: function( options ) {
            // called on start
          },
          onFrame: function ( options ) {
            // called on every paint frame between start and end.
            // uses mozRequestAnimationFrame, webkitRequestAnimationFrame,
            // or setTimeout with 16ms window.
          },
          onEnd: function ( options ) {
            // called on end
          }
        });
  *
  */

  Popcorn.plugin( "code" , function( options ) {
    var running = false,
        instance = this;

    // Setup a proper frame interval function (60fps), favouring paint events.
    var step = (function() {

      var buildFrameRunner = function( runner ) {
        return function( f, options ) {

          var _f = function() {
            running && f.call( instance, options );
            running && runner( _f );
          };

          _f();
        };
      };

      // Figure out which level of browser support we have for this
      if ( window.webkitRequestAnimationFrame ) {
        return buildFrameRunner( window.webkitRequestAnimationFrame );
      } else if ( window.mozRequestAnimationFrame ) {
        return buildFrameRunner( window.mozRequestAnimationFrame );
      } else {
        return buildFrameRunner( function( f ) {
          window.setTimeout( f, 16 );
        });
      }

    })();

    if ( !options.onStart || typeof options.onStart !== "function" ) {

      options.onStart = Popcorn.nop;
    }

    if ( options.onEnd && typeof options.onEnd !== "function" ) {

      options.onEnd = undefined;
    }

    if ( options.onFrame && typeof options.onFrame !== "function" ) {

      options.onFrame = undefined;
    }

    return {
      start: function( event, options ) {
        options.onStart.call( instance, options );

        if ( options.onFrame ) {
          running = true;
          step( options.onFrame, options );
        }
      },

      end: function( event, options ) {
        if ( options.onFrame ) {
          running = false;
        }

        if ( options.onEnd ) {
          options.onEnd.call( instance, options );
        }
      }
    };
  },
  {
    about: {
      name: "Popcorn Code Plugin",
      version: "0.1",
      author: "David Humphrey (@humphd)",
      website: "http://vocamus.net/dave"
    },
    options: {
      start: {
       elem: "input",
       type: "number",
       label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      onStart: {
        elem: "input",
        type: "function",
        label: "onStart"
      },
      onFrame: {
        elem: "input",
        type: "function",
        label: "onFrame",
        optional: true
      },
      onEnd: {
        elem: "input",
        type: "function",
        label: "onEnd"
      }
    }
  });
})( Popcorn );
// PLUGIN: Flickr
(function (Popcorn) {

  /**
   * Flickr popcorn plug-in
   * Appends a users Flickr images to an element on the page.
   * Options parameter will need a start, end, target and userid or username and api_key.
   * Optional parameters are numberofimages, height, width, padding, and border
   * Start is the time that you want this plug-in to execute (in seconds)
   * End is the time that you want this plug-in to stop executing (in seconds)
   * Userid is the id of who's Flickr images you wish to show
   * Tags is a mutually exclusive list of image descriptor tags
   * Username is the username of who's Flickr images you wish to show
   *  using both userid and username is redundant
   *  an api_key is required when using username
   * Apikey is your own api key provided by Flickr
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * Numberofimages specify the number of images to retreive from flickr, defaults to 4
   * Height the height of the image, defaults to '50px'
   * Width the width of the image, defaults to '50px'
   * Padding number of pixels between images, defaults to '5px'
   * Border border size in pixels around images, defaults to '0px'
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .flickr({
          start:          5,                 // seconds, mandatory
          end:            15,                // seconds, mandatory
          userid:         '35034346917@N01', // optional
          tags:           'dogs,cats',       // optional
          numberofimages: '8',               // optional
          height:         '50px',            // optional
          width:          '50px',            // optional
          padding:        '5px',             // optional
          border:         '0px',             // optional
          target:         'flickrdiv'        // mandatory
        } )
   *
   */

  var idx = 0;

  Popcorn.plugin( "flickr" , function( options ) {
    var containerDiv,
        target = document.getElementById( options.target ),
        _userid,
        _uri,
        _link,
        _image,
        _count = options.numberofimages || 4,
        _height = options.height || "50px",
        _width = options.width || "50px",
        _padding = options.padding || "5px",
        _border = options.border || "0px";

    // create a new div this way anything in the target div is left intact
    // this is later populated with Flickr images
    containerDiv = document.createElement( "div" );
    containerDiv.id = "flickr" + idx;
    containerDiv.style.width = "100%";
    containerDiv.style.height = "100%";
    containerDiv.style.display = "none";
    idx++;

    target && target.appendChild( containerDiv );

    // get the userid from Flickr API by using the username and apikey
    var isUserIDReady = function() {
      if ( !_userid ) {

        _uri  = "http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&";
        _uri += "username=" + options.username + "&api_key=" + options.apikey + "&format=json&jsoncallback=flickr";
        Popcorn.getJSONP( _uri, function( data ) {
          _userid = data.user.nsid;
          getFlickrData();
        });

      } else {

        setTimeout(function () {
          isUserIDReady();
        }, 5 );
      }
    };

    // get the photos from Flickr API by using the user_id and/or tags
    var getFlickrData = function() {

      _uri  = "http://api.flickr.com/services/feeds/photos_public.gne?";

      if ( _userid ) {
        _uri += "id=" + _userid + "&";
      }
      if ( options.tags ) {
        _uri += "tags=" + options.tags + "&";
      }

      _uri += "lang=en-us&format=json&jsoncallback=flickr";

      Popcorn.xhr.getJSONP( _uri, function( data ) {

        var fragment = document.createElement( "div" );

        fragment.innerHTML = "<p style='padding:" + _padding + ";'>" + data.title + "<p/>";

        Popcorn.forEach( data.items, function ( item, i ) {
          if ( i < _count ) {

            _link = document.createElement( "a" );
            _link.setAttribute( "href", item.link );
            _link.setAttribute( "target", "_blank" );
            _image = document.createElement( "img" );
            _image.setAttribute( "src", item.media.m );
            _image.setAttribute( "height",_height );
            _image.setAttribute( "width", _width );
            _image.setAttribute( "style", "border:" + _border + ";padding:" + _padding );
            _link.appendChild( _image );
            fragment.appendChild( _link );

          } else {

            return false;
          }
        });

        containerDiv.appendChild( fragment );
      });
    };

    if ( options.username && options.apikey ) {
      isUserIDReady();
    }
    else {
      _userid = options.userid;
      getFlickrData();
    }
    return {
      /**
       * @member flickr
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        containerDiv.style.display = "inline";
      },
      /**
       * @member flickr
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        containerDiv.style.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( containerDiv );
      }
    };
  },
  {
    about: {
      name: "Popcorn Flickr Plugin",
      version: "0.2",
      author: "Scott Downe, Steven Weerdenburg, Annasob",
      website: "http://scottdowne.wordpress.com/"
    },
    options: {
      start: {
        elem: "input",
        type: "number",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      userid: {
        elem: "input",
        type: "text",
        label: "User ID",
        optional: true
      },
      tags: {
        elem: "input",
        type: "text",
        label: "Tags"
      },
      username: {
        elem: "input",
        type: "text",
        label: "Username",
        optional: true
      },
      apikey: {
        elem: "input",
        type: "text",
        label: "API Key",
        optional: true
      },
      target: "flickr-container",
      height: {
        elem: "input",
        type: "text",
        label: "Height",
        "default": "50px",
        optional: true
      },
      width: {
        elem: "input",
        type: "text",
        label: "Width",
        "default": "50px",
        optional: true
      },
      padding: {
        elem: "input",
        type: "text",
        label: "Padding",
        optional: true
      },
      border: {
        elem: "input",
        type: "text",
        label: "Border",
        "default": "5px",
        optional: true
      },
      numberofimages: {
        elem: "input",
        type: "number",
        "default": 4,
        label: "Number of Images"
      }
    }
  });
})( Popcorn );
// PLUGIN: Footnote/Text

(function ( Popcorn ) {

  /**
   * Footnote popcorn plug-in
   * Adds text to an element on the page.
   * Options parameter will need a start, end, target and text.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Text is the text that you want to appear in the target
   * Target is the id of the document element that the text needs to be
   * attached to, this target element must exist on the DOM
   *
   * @param {Object} options
   *
   * Example:
   *  var p = Popcorn('#video')
   *    .footnote({
   *      start: 5, // seconds
   *      end: 15, // seconds
   *      text: 'This video made exclusively for drumbeat.org',
   *      target: 'footnotediv'
   *    });
   **/

  Popcorn.plugin( "footnote", {

    manifest: {
      about: {
        name: "Popcorn Footnote Plugin",
        version: "0.2",
        author: "@annasob, @rwaldron",
        website: "annasob.wordpress.com"
      },
      options: {
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        text: {
          elem: "input",
          type: "text",
          label: "Text"
        },
        target: "footnote-container"
      }
    },

    _setup: function( options ) {

      var target = Popcorn.dom.find( options.target );

      options._container = document.createElement( "div" );
      options._container.style.display = "none";
      options._container.innerHTML  = options.text;

      target.appendChild( options._container );
    },

    /**
     * @member footnote
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      options._container.style.display = "inline";
    },

    /**
     * @member footnote
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      options._container.style.display = "none";
    },

    _teardown: function( options ) {
      var target = Popcorn.dom.find( options.target );
      if ( target ) {
        target.removeChild( options._container );
      }
    }

  });
})( Popcorn );
// PLUGIN: Text

(function ( Popcorn ) {

  /**
   * Text Popcorn plug-in
   *
   * Places text in an element on the page.  Plugin options include:
   * Options parameter will need a start, end.
   *   Start: Is the time that you want this plug-in to execute
   *   End: Is the time that you want this plug-in to stop executing
   *   Text: Is the text that you want to appear in the target
   *   Escape: {true|false} Whether to escape the text (e.g., html strings)
   *   Multiline: {true|false} Whether newlines should be turned into <br>s
   *   Target: Is the ID of the element where the text should be placed. An empty target
   *           will be placed on top of the media element
   *
   * @param {Object} options
   *
   * Example:
   *  var p = Popcorn('#video')
   *
   *    // Simple text
   *    .text({
   *      start: 5, // seconds
   *      end: 15, // seconds
   *      text: 'This video made exclusively for drumbeat.org',
   *      target: 'textdiv'
   *     })
   *
   *    // HTML text, rendered as HTML
   *    .text({
   *      start: 15, // seconds
   *      end: 20, // seconds
   *      text: '<p>This video made <em>exclusively</em> for drumbeat.org</p>',
   *      target: 'textdiv'
   *    })
   *
   *    // HTML text, escaped and rendered as plain text
   *    .text({
   *      start: 20, // seconds
   *      end: 25, // seconds
   *      text: 'This is an HTML p element: <p>paragraph</p>',
   *      escape: true,
   *      target: 'textdiv'
   *    })
   *
   *    // Multi-Line HTML text, escaped and rendered as plain text
   *    .text({
   *      start: 25, // seconds
   *      end: 30, // seconds
   *      text: 'This is an HTML p element: <p>paragraph</p>\nThis is an HTML b element: <b>bold</b>',
   *      escape: true,
   *      multiline: true,
   *      target: 'textdiv'
   *    });
   *
   *    // Subtitle text
   *    .text({
   *      start: 30, // seconds
   *      end: 40, // seconds
   *      text: 'This will be overlayed on the video',
   *     })
   **/

  /**
   * HTML escape code from mustache.js, used under MIT Licence
   * https://github.com/janl/mustache.js/blob/master/mustache.js
   **/
  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;'
  };

  function escapeHTML( string, multiline ) {
    return String( string ).replace( /&(?!\w+;)|[<>"']/g, function ( s ) {
      return escapeMap[ s ] || s;
    });
  }

  function newlineToBreak( string ) {
    // Deal with both \r\n and \n
    return string.replace( /\r?\n/gm, "<br>" );
  }

  // Subtitle specific functionality
  function createSubtitleContainer( context, id ) {

    var ctxContainer = context.container = document.createElement( "div" ),
        style = ctxContainer.style,
        media = context.media;

    var updatePosition = function() {
      var position = context.position();
      // the video element must have height and width defined
      style.fontSize = "18px";
      style.width = media.offsetWidth + "px";
      style.top = position.top  + media.offsetHeight - ctxContainer.offsetHeight - 40 + "px";
      style.left = position.left + "px";

      setTimeout( updatePosition, 10 );
    };

    ctxContainer.id = id || "";
    style.position = "absolute";
    style.color = "white";
    style.textShadow = "black 2px 2px 6px";
    style.fontWeight = "bold";
    style.textAlign = "center";

    updatePosition();

    context.media.parentNode.appendChild( ctxContainer );

    return ctxContainer;
  }

  Popcorn.plugin( "text", {

    manifest: {
      about: {
        name: "Popcorn Text Plugin",
        version: "0.1",
        author: "@humphd"
      },
      options: {
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        text: {
          elem: "input",
          type: "text",
          label: "Text",
          "default": "Popcorn.js"
        },
        escape: {
          elem: "input",
          type: "checkbox",
          label: "Escape"
        },
        multiline: {
          elem: "input",
          type: "checkbox",
          label: "Multiline"
        }
      }
    },

    _setup: function( options ) {

      var target,
          text,
          container = options._container = document.createElement( "div" );

      container.style.display = "none";

      if ( options.target ) {
        // Try to use supplied target
        target = Popcorn.dom.find( options.target );

        if ( !target ) {
          target = createSubtitleContainer( this, options.target );
        }
        else if ( [ "VIDEO", "AUDIO" ].indexOf( target.nodeName ) > -1 ) {
          target = createSubtitleContainer( this, options.target + "-overlay" );
        }

      } else if ( !this.container ) {
        // Creates a div for all subtitles to use
        target = createSubtitleContainer( this );

      } else {
        // Use subtitle container
        target = this.container;
      }

      // cache reference to actual target container
      options._target = target;

      // Escape HTML text if requested
      text = !!options.escape ? escapeHTML( options.text ) :
                                    options.text;

      // Swap newline for <br> if requested
      text = !!options.multiline ? newlineToBreak ( text ) : text;
      container.innerHTML = text || "";

      target.appendChild( container );
    },

    /**
     * @member text
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ) {
      options._container.style.display = "inline";
    },

    /**
     * @member text
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ) {
      options._container.style.display = "none";
    },

    _teardown: function( options ) {
      var target = options._target;
      if ( target ) {
        target.removeChild( options._container );
      }
    }
  });
})( Popcorn );

// PLUGIN: Google Maps
var googleCallback;
(function ( Popcorn ) {

  var i = 1,
    _mapFired = false,
    _mapLoaded = false,
    geocoder, loadMaps;
  //google api callback
  googleCallback = function ( data ) {
    // ensure all of the maps functions needed are loaded
    // before setting _maploaded to true
    if ( typeof google !== "undefined" && google.maps && google.maps.Geocoder && google.maps.LatLng ) {
      geocoder = new google.maps.Geocoder();
      Popcorn.getScript( "//maps.stamen.com/js/tile.stamen.js", function() {
        _mapLoaded = true;
      });
    } else {
      setTimeout(function () {
        googleCallback( data );
      }, 1);
    }
  };
  // function that loads the google api
  loadMaps = function () {
    // for some reason the Google Map API adds content to the body
    if ( document.body ) {
      _mapFired = true;
      Popcorn.getScript( "//maps.google.com/maps/api/js?sensor=false&callback=googleCallback" );
    } else {
      setTimeout(function () {
        loadMaps();
      }, 1);
    }
  };

  function buildMap( options, location, mapDiv ) {
    var type = options.type ? options.type.toUpperCase() : "HYBRID",
      layer;

    // See if we need to make a custom Stamen map layer
    if ( type === "STAMEN-WATERCOLOR" ||
         type === "STAMEN-TERRAIN"    ||
         type === "STAMEN-TONER" ) {
      // Stamen types are lowercase
      layer = type.replace("STAMEN-", "").toLowerCase();
    }

    var map = new google.maps.Map( mapDiv, {
      // If a custom layer was specified, use that, otherwise use type
      mapTypeId: layer ? layer : google.maps.MapTypeId[ type ],
      // Hide the layer selection UI
      mapTypeControlOptions: { mapTypeIds: [] }
    });

    if ( layer ) {
      map.mapTypes.set( layer, new google.maps.StamenMapType( layer ));
    }
    map.getDiv().style.display = "none";

    return map;
  }

  /**
   * googlemap popcorn plug-in
   * Adds a map to the target div centered on the location specified by the user
   * Options parameter will need a start, end, target, type, zoom, lat and lng, and location
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Type [optional] either: HYBRID (default), ROADMAP, SATELLITE, TERRAIN, STREETVIEW, or one of the
   *                          Stamen custom map types (http://http://maps.stamen.com): STAMEN-TONER,
   *                          STAMEN-WATERCOLOR, or STAMEN-TERRAIN.
   * -Zoom [optional] defaults to 0
   * -Heading [optional] STREETVIEW orientation of camera in degrees relative to true north (0 north, 90 true east, ect)
   * -Pitch [optional] STREETVIEW vertical orientation of the camera (between 1 and 3 is recommended)
   * -Lat and Lng: the coordinates of the map must be present if location is not specified.
   * -Height [optional] the height of the map, in "px" or "%". Defaults to "100%".
   * -Width [optional] the width of the map, in "px" or "%". Defaults to "100%".
   * -Location: the adress you want the map to display, must be present if lat and lng are not specified.
   * Note: using location requires extra loading time, also not specifying both lat/lng and location will
   * cause and error.
   *
   * Tweening works using the following specifications:
   * -location is the start point when using an auto generated route
   * -tween when used in this context is a string which specifies the end location for your route
   * Note that both location and tween must be present when using an auto generated route, or the map will not tween
   * -interval is the speed in which the tween will be executed, a reasonable time is 1000 ( time in milliseconds )
   * Heading, Zoom, and Pitch streetview values are also used in tweening with the autogenerated route
   *
   * -tween is an array of objects, each containing data for one frame of a tween
   * -position is an object with has two paramaters, lat and lng, both which are mandatory for a tween to work
   * -pov is an object which houses heading, pitch, and zoom paramters, which are all optional, if undefined, these values default to 0
   * -interval is the speed in which the tween will be executed, a reasonable time is 1000 ( time in milliseconds )
   *
   * @param {Object} options
   *
   * Example:
   var p = Popcorn("#video")
   .googlemap({
   start: 5, // seconds
   end: 15, // seconds
   type: "ROADMAP",
   target: "map",
   lat: 43.665429,
   lng: -79.403323
   } )
   *
   */
  Popcorn.plugin( "googlemap", function ( options ) {
    var newdiv, map, location,
        target = document.getElementById( options.target );

    options.type = options.type || "ROADMAP";
    options.zoom = options.zoom || 1;
    options.lat = options.lat || 0;
    options.lng = options.lng || 0;

    // if this is the firest time running the plugins
    // call the function that gets the sctipt
    if ( !_mapFired ) {
      loadMaps();
    }

    // create a new div this way anything in the target div is left intact
    // this is later passed on to the maps api
    newdiv = document.createElement( "div" );
    newdiv.id = "actualmap" + i;
    newdiv.style.width = options.width || "100%";

    // height is a little more complicated than width.
    if ( options.height ) {
      newdiv.style.height = options.height;
    } else if ( target && target.clientHeight ) {
      newdiv.style.height = target.clientHeight + "px";
    } else {
      newdiv.style.height = "100%";
    }

    i++;

    target && target.appendChild( newdiv );

    // ensure that google maps and its functions are loaded
    // before setting up the map parameters
    var isMapReady = function () {
      if ( _mapLoaded ) {
        if ( newdiv ) {
          if ( options.location ) {
            // calls an anonymous google function called on separate thread
            geocoder.geocode({
              "address": options.location
            }, function ( results, status ) {
              // second check for newdiv since it could have disappeared before
              // this callback is actual run
              if ( newdiv && status === google.maps.GeocoderStatus.OK ) {
                options.lat = results[ 0 ].geometry.location.lat();
                options.lng = results[ 0 ].geometry.location.lng();
                location = new google.maps.LatLng( options.lat, options.lng );
                map = buildMap( options, location, newdiv );
              }
            });
          } else {
            location = new google.maps.LatLng( options.lat, options.lng );
            map = buildMap( options, location, newdiv );
          }
        }
      } else {
          setTimeout(function () {
            isMapReady();
          }, 5);
        }
      };

    isMapReady();

    return {
      /**
       * @member webpage
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        var that = this,
            sView;

        // ensure the map has been initialized in the setup function above
        var isMapSetup = function() {
          if ( map ) {
            options._map = map;

            map.getDiv().style.display = "block";
            // reset the location and zoom just in case the user plaid with the map
            google.maps.event.trigger( map, "resize" );
            map.setCenter( location );

            // make sure options.zoom is a number
            if ( options.zoom && typeof options.zoom !== "number" ) {
              options.zoom = +options.zoom;
            }

            map.setZoom( options.zoom );

            //Make sure heading is a number
            if ( options.heading && typeof options.heading !== "number" ) {
              options.heading = +options.heading;
            }
            //Make sure pitch is a number
            if ( options.pitch && typeof options.pitch !== "number" ) {
              options.pitch = +options.pitch;
            }

            if ( options.type === "STREETVIEW" ) {
              // Switch this map into streeview mode
              map.setStreetView(
              // Pass a new StreetViewPanorama instance into our map

                sView = new google.maps.StreetViewPanorama( newdiv, {
                  position: location,
                  pov: {
                    heading: options.heading = options.heading || 0,
                    pitch: options.pitch = options.pitch || 0,
                    zoom: options.zoom
                  }
                })
              );

              //  Function to handle tweening using a set timeout
              var tween = function( rM, t ) {

                var computeHeading = google.maps.geometry.spherical.computeHeading;
                setTimeout(function() {

                  var current_time = that.media.currentTime;

                  //  Checks whether this is a generated route or not
                  if ( typeof options.tween === "object" ) {

                    for ( var i = 0, m = rM.length; i < m; i++ ) {

                      var waypoint = rM[ i ];

                      //  Checks if this position along the tween should be displayed or not
                      if ( current_time >= ( waypoint.interval * ( i + 1 ) ) / 1000 &&
                         ( current_time <= ( waypoint.interval * ( i + 2 ) ) / 1000 ||
                           current_time >= waypoint.interval * ( m ) / 1000 ) ) {

                        sView3.setPosition( new google.maps.LatLng( waypoint.position.lat, waypoint.position.lng ) );

                        sView3.setPov({
                          heading: waypoint.pov.heading || computeHeading( waypoint, rM[ i + 1 ] ) || 0,
                          zoom: waypoint.pov.zoom || 0,
                          pitch: waypoint.pov.pitch || 0
                        });
                      }
                    }

                    //  Calls the tween function again at the interval set by the user
                    tween( rM, rM[ 0 ].interval );
                  } else {

                    for ( var k = 0, l = rM.length; k < l; k++ ) {

                      var interval = options.interval;

                      if( current_time >= (interval * ( k + 1 ) ) / 1000 &&
                        ( current_time <= (interval * ( k + 2 ) ) / 1000 ||
                          current_time >= interval * ( l ) / 1000 ) ) {

                        sView2.setPov({
                          heading: computeHeading( rM[ k ], rM[ k + 1 ] ) || 0,
                          zoom: options.zoom,
                          pitch: options.pitch || 0
                        });
                        sView2.setPosition( checkpoints[ k ] );
                      }
                    }

                    tween( checkpoints, options.interval );
                  }
                }, t );
              };

              //  Determines if we should use hardcoded values ( using options.tween ),
              //  or if we should use a start and end location and let google generate
              //  the route for us
              if ( options.location && typeof options.tween === "string" ) {

              //  Creating another variable to hold the streetview map for tweening,
              //  Doing this because if there was more then one streetview map, the tweening would sometimes appear in other maps
              var sView2 = sView;

                //  Create an array to store all the lat/lang values along our route
                var checkpoints = [];

                //  Creates a new direction service, later used to create a route
                var directionsService = new google.maps.DirectionsService();

                //  Creates a new direction renderer using the current map
                //  This enables us to access all of the route data that is returned to us
                var directionsDisplay = new google.maps.DirectionsRenderer( sView2 );

                var request = {
                  origin: options.location,
                  destination: options.tween,
                  travelMode: google.maps.TravelMode.DRIVING
                };

                //  Create the route using the direction service and renderer
                directionsService.route( request, function( response, status ) {

                  if ( status == google.maps.DirectionsStatus.OK ) {
                    directionsDisplay.setDirections( response );
                    showSteps( response, that );
                  }

                });

                var showSteps = function ( directionResult, that ) {

                  //  Push new google map lat and lng values into an array from our list of lat and lng values
                  var routes = directionResult.routes[ 0 ].overview_path;
                  for ( var j = 0, k = routes.length; j < k; j++ ) {
                    checkpoints.push( new google.maps.LatLng( routes[ j ].lat(), routes[ j ].lng() ) );
                  }

                  //  Check to make sure the interval exists, if not, set to a default of 1000
                  options.interval = options.interval || 1000;
                  tween( checkpoints, 10 );

                };
              } else if ( typeof options.tween === "object" ) {

                //  Same as the above to stop streetview maps from overflowing into one another
                var sView3 = sView;

                for ( var i = 0, l = options.tween.length; i < l; i++ ) {

                  //  Make sure interval exists, if not, set to 1000
                  options.tween[ i ].interval = options.tween[ i ].interval || 1000;
                  tween( options.tween, 10 );
                }
              }
            }

            if ( options.onmaploaded ) {
              options.onmaploaded( options, map );
            }

          } else {
            setTimeout(function () {
              isMapSetup();
            }, 13);
          }

        };
        isMapSetup();
      },
      /**
       * @member webpage
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function ( event, options ) {
        // if the map exists hide it do not delete the map just in
        // case the user seeks back to time b/w start and end
        if ( map ) {
          map.getDiv().style.display = "none";
        }
      },
      _teardown: function ( options ) {

        var target = document.getElementById( options.target );

        // the map must be manually removed
        target && target.removeChild( newdiv );
        newdiv = map = location = null;

        options._map = null;
      }
    };
  }, {
    about: {
      name: "Popcorn Google Map Plugin",
      version: "0.1",
      author: "@annasob",
      website: "annasob.wordpress.com"
    },
    options: {
      start: {
        elem: "input",
        type: "start",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "start",
        label: "End"
      },
      target: "map-container",
      type: {
        elem: "select",
        options: [ "ROADMAP", "SATELLITE", "STREETVIEW", "HYBRID", "TERRAIN", "STAMEN-WATERCOLOR", "STAMEN-TERRAIN", "STAMEN-TONER" ],
        label: "Map Type",
        optional: true
      },
      zoom: {
        elem: "input",
        type: "text",
        label: "Zoom",
        "default": 0,
        optional: true
      },
      lat: {
        elem: "input",
        type: "text",
        label: "Lat",
        optional: true
      },
      lng: {
        elem: "input",
        type: "text",
        label: "Lng",
        optional: true
      },
      location: {
        elem: "input",
        type: "text",
        label: "Location",
        "default": "Toronto, Ontario, Canada"
      },
      heading: {
        elem: "input",
        type: "text",
        label: "Heading",
        "default": 0,
        optional: true
      },
      pitch: {
        elem: "input",
        type: "text",
        label: "Pitch",
        "default": 1,
        optional: true
      }
    }
  });
})( Popcorn );

// PLUGIN: IMAGE

(function ( Popcorn ) {

/**
 * Images popcorn plug-in
 * Shows an image element
 * Options parameter will need a start, end, href, target and src.
 * Start is the time that you want this plug-in to execute
 * End is the time that you want this plug-in to stop executing
 * href is the url of the destination of a anchor - optional
 * Target is the id of the document element that the iframe needs to be attached to,
 * this target element must exist on the DOM
 * Src is the url of the image that you want to display
 * text is the overlayed text on the image - optional
 *
 * @param {Object} options
 *
 * Example:
   var p = Popcorn('#video')
      .image({
        start: 5, // seconds
        end: 15, // seconds
        href: 'http://www.drumbeat.org/',
        src: 'http://www.drumbeat.org/sites/default/files/domain-2/drumbeat_logo.png',
        text: 'DRUMBEAT',
        target: 'imagediv'
      } )
 *
 */

  var VIDEO_OVERLAY_Z = 2000,
      CHECK_INTERVAL_DURATION = 10;

  function trackMediaElement( mediaElement ) {
    var checkInterval = -1,
        container = document.createElement( "div" ),
        videoZ = getComputedStyle( mediaElement ).zIndex;

    container.setAttribute( "data-popcorn-helper-container", true );

    container.style.position = "absolute";

    if ( !isNaN( videoZ ) ) {
      container.style.zIndex = videoZ + 1;
    }
    else {
      container.style.zIndex = VIDEO_OVERLAY_Z;
    }

    document.body.appendChild( container );

    function check() {
      var mediaRect = mediaElement.getBoundingClientRect(),
          containerRect = container.getBoundingClientRect();

      if ( containerRect.left !== mediaRect.left ) {
        container.style.left = mediaRect.left + "px";
      }
      if ( containerRect.top !== mediaRect.top ) {
        container.style.top = mediaRect.top + "px";
      }
    }

    return {
      element: container,
      start: function() {
        checkInterval = setInterval( check, CHECK_INTERVAL_DURATION );
      },
      stop: function() {
        clearInterval( checkInterval );
        checkInterval = -1;
      },
      destroy: function() {
        document.body.removeChild( container );
        if ( checkInterval !== -1 ) {
          clearInterval( checkInterval );
        }
      }
    };
  }

  Popcorn.plugin( "image", {
      manifest: {
        about: {
          name: "Popcorn image Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options: {
          start: {
            elem: "input",
            type: "number",
            label: "Start"
          },
          end: {
            elem: "input",
            type: "number",
            label: "End"
          },
          src: {
            elem: "input",
            type: "url",
            label: "Image URL",
            "default": "http://mozillapopcorn.org/wp-content/themes/popcorn/images/for_developers.png"
          },
          href: {
            elem: "input",
            type: "url",
            label: "Link",
            "default": "http://mozillapopcorn.org/wp-content/themes/popcorn/images/for_developers.png",
            optional: true
          },
          target: "image-container",
          text: {
            elem: "input",
            type: "text",
            label: "Caption",
            "default": "Popcorn.js",
            optional: true
          }
        }
      },
      _setup: function( options ) {
        var img = document.createElement( "img" ),
            target = document.getElementById( options.target );

        options.anchor = document.createElement( "a" );
        options.anchor.style.position = "relative";
        options.anchor.style.textDecoration = "none";
        options.anchor.style.display = "none";

        // add the widget's div to the target div.
        // if target is <video> or <audio>, create a container and routinely 
        // update its size/position to be that of the media
        if ( target ) {
          if ( [ "VIDEO", "AUDIO" ].indexOf( target.nodeName ) > -1 ) {
            options.trackedContainer = trackMediaElement( target );
            options.trackedContainer.element.appendChild( options.anchor );
          }
          else {
            target && target.appendChild( options.anchor );
          }          
        }

        img.addEventListener( "load", function() {

          // borders look really bad, if someone wants it they can put it on their div target
          img.style.borderStyle = "none";

          options.anchor.href = options.href || options.src || "#";
          options.anchor.target = "_blank";

          var fontHeight, divText;

          img.style.height = target.style.height;
          img.style.width = target.style.width;

          options.anchor.appendChild( img );

          // If display text was provided, display it:
          if ( options.text ) {
            fontHeight = ( img.height / 12 ) + "px";
            divText = document.createElement( "div" );

            Popcorn.extend( divText.style, {
              color: "black",
              fontSize: fontHeight,
              fontWeight: "bold",
              position: "relative",
              textAlign: "center",
              width: img.style.width || img.width + "px",
              zIndex: "10"
            });

            divText.innerHTML = options.text || "";

            divText.style.top = ( ( img.style.height.replace( "px", "" ) || img.height ) / 2 ) - ( divText.offsetHeight / 2 ) + "px";
            options.anchor.insertBefore( divText, img );
          }
        }, false );

        img.src = options.src;
      },

      /**
       * @member image
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options.anchor.style.display = "inline";
        if ( options.trackedContainer ) {
          options.trackedContainer.start();
        }
      },
      /**
       * @member image
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.anchor.style.display = "none";
        if ( options.trackedContainer ) {
          options.trackedContainer.stop();
        }
      },
      _teardown: function( options ) {
        if ( options.trackedContainer ) {
          options.trackedContainer.destroy();
        }
        else if ( options.anchor.parentNode ) {
          options.anchor.parentNode.removeChild( options.anchor );
        }
      }
  });
})( Popcorn );
// PLUGIN: Google Feed
(function ( Popcorn ) {

  var i = 1,
      scriptLoaded  = false;

  /**
   * googlefeed popcorn plug-in
   * Adds a feed from the specified blog url at the target div
   * Options parameter will need a start, end, target, url and title
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Url is the url of the blog's feed you are trying to access
   * -Title is the title of the blog you want displayed above the feed
   * -Orientation is the orientation of the blog, accepts either Horizontal or Vertical, defaults to Vertical
   * @param {Object} options
   *
   * Example:
    var p = Popcorn("#video")
      .googlefeed({
       start: 5, // seconds
       end: 15, // seconds
       target: "map",
       url: "http://zenit.senecac.on.ca/~chris.tyler/planet/rss20.xml",
       title: "Planet Feed"
    } )
  *
  */

  Popcorn.plugin( "googlefeed", function( options ) {

    var dynamicFeedLoad = function() {
      var dontLoad = false,
          k = 0,
          links = document.getElementsByTagName( "link" ),
          len = links.length,
          head = document.head || document.getElementsByTagName( "head" )[ 0 ],
          css = document.createElement( "link" ),
          resource = "//www.google.com/uds/solutions/dynamicfeed/gfdynamicfeedcontrol.";

      if ( !window.GFdynamicFeedControl ) {

        Popcorn.getScript( resource + "js", function() {
          scriptLoaded = true;
        });

      } else {
        scriptLoaded = true;
      }

      //  Checking if the css file is already included
      for ( ; k < len; k++ ){
        if ( links[ k ].href === resource + "css" ) {
          dontLoad = true;
        }
      }

      if ( !dontLoad ) {
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href =  resource + "css";
        head.insertBefore( css, head.firstChild );
      }
    };

    if ( !window.google ) {

      Popcorn.getScript( "//www.google.com/jsapi", function() {

        google.load( "feeds", "1", {

          callback: function () {

            dynamicFeedLoad();
          }
        });
      });

    } else {
      dynamicFeedLoad();
    }

    // create a new div and append it to the parent div so nothing
    // that already exists in the parent div gets overwritten
    var newdiv = document.createElement( "div" ),
        target = document.getElementById( options.target ),
    initialize = function() {
      //ensure that the script has been loaded
      if ( !scriptLoaded ) {
        setTimeout( function () {
          initialize();
        }, 5 );
      } else {
        // Create the feed control using the user entered url and title
        options.feed = new GFdynamicFeedControl( options.url, newdiv, {
          vertical: options.orientation.toLowerCase() === "vertical" ? true : false,
          horizontal: options.orientation.toLowerCase() === "horizontal" ? true : false,
          title: options.title = options.title || "Blog"
        });
      }
    };

    // Default to vertical orientation if empty or incorrect input
    if( !options.orientation || ( options.orientation.toLowerCase() !== "vertical" &&
      options.orientation.toLowerCase() !== "horizontal" ) ) {
      options.orientation = "vertical";
    }

    newdiv.style.display = "none";
    newdiv.id = "_feed" + i;
    newdiv.style.width = "100%";
    newdiv.style.height = "100%";
    i++;

    target && target.appendChild( newdiv );

    initialize();

    return {
      /**
       * @member webpage
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ){
        newdiv.setAttribute( "style", "display:inline" );
      },
      /**
       * @member webpage
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ){
        newdiv.setAttribute( "style", "display:none" );
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( newdiv );
        delete options.feed;
      }
    };
  },
  {
    about: {
      name: "Popcorn Google Feed Plugin",
      version: "0.1",
      author: "David Seifried",
      website: "dseifried.wordpress.com"
    },
    options: {
      start: {
        elem: "input",
        type: "number",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      target: "feed-container",
      url: {
        elem: "input",
        type: "url",
        label: "Feed URL",
        "default": "http://planet.mozilla.org/rss20.xml"
      },
      title: {
        elem: "input",
        type: "text",
        label: "Title",
        "default": "Planet Mozilla",
        optional: true
      },
      orientation: {
        elem: "select",
        options: [ "Vertical", "Horizontal" ],
        label: "Orientation",
        "default": "Vertical",
        optional: true
      }
    }
  });
})( Popcorn );
// PLUGIN: Subtitle

(function ( Popcorn ) {

  var i = 0,
      createDefaultContainer = function( context, id ) {

        var ctxContainer = context.container = document.createElement( "div" ),
            style = ctxContainer.style,
            media = context.media;

        var updatePosition = function() {
          var position = context.position();
          // the video element must have height and width defined
          style.fontSize = "18px";
          style.width = media.offsetWidth + "px";
          style.top = position.top  + media.offsetHeight - ctxContainer.offsetHeight - 40 + "px";
          style.left = position.left + "px";

          setTimeout( updatePosition, 10 );
        };

        ctxContainer.id = id || Popcorn.guid();
        style.position = "absolute";
        style.color = "white";
        style.textShadow = "black 2px 2px 6px";
        style.fontWeight = "bold";
        style.textAlign = "center";

        updatePosition();

        context.media.parentNode.appendChild( ctxContainer );

        return ctxContainer;
      };

  /**
   * Subtitle popcorn plug-in
   * Displays a subtitle over the video, or in the target div
   * Options parameter will need a start, and end.
   * Optional parameters are target and text.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Target is the id of the document element that the content is
   *  appended to, this target element must exist on the DOM
   * Text is the text of the subtitle you want to display.
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .subtitle({
          start:            5,                 // seconds, mandatory
          end:              15,                // seconds, mandatory
          text:             'Hellow world',    // optional
          target:           'subtitlediv',     // optional
        } )
   *
   */

  Popcorn.plugin( "subtitle" , {

      manifest: {
        about: {
          name: "Popcorn Subtitle Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options: {
          start: {
            elem: "input",
            type: "text",
            label: "Start"
          },
          end: {
            elem: "input",
            type: "text",
            label: "End"
          },
          target: "subtitle-container",
          text: {
            elem: "input",
            type: "text",
            label: "Text"
          }
        }
      },

      _setup: function( options ) {
        var newdiv = document.createElement( "div" );

        newdiv.id = "subtitle-" + i++;
        newdiv.style.display = "none";

        // Creates a div for all subtitles to use
        ( !this.container && ( !options.target || options.target === "subtitle-container" ) ) &&
          createDefaultContainer( this );

        // if a target is specified, use that
        if ( options.target && options.target !== "subtitle-container" ) {
          // In case the target doesn't exist in the DOM
          options.container = document.getElementById( options.target ) || createDefaultContainer( this, options.target );
        } else {
          // use shared default container
          options.container = this.container;
        }

        document.getElementById( options.container.id ) && document.getElementById( options.container.id ).appendChild( newdiv );
        options.innerContainer = newdiv;

        options.showSubtitle = function() {
          options.innerContainer.innerHTML = options.text || "";
        };
      },
      /**
       * @member subtitle
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ){
        options.innerContainer.style.display = "inline";
        options.showSubtitle( options, options.text );
      },
      /**
       * @member subtitle
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.innerContainer.style.display = "none";
        options.innerContainer.innerHTML = "";
      },

      _teardown: function ( options ) {
        options.container.removeChild( options.innerContainer );
      }

  });

})( Popcorn );
// PLUGIN: TWITTER

(function ( Popcorn ) {
  var scriptLoading = false;

  /**
   * Twitter popcorn plug-in
   * Appends a Twitter widget to an element on the page.
   * Options parameter will need a start, end, target and source.
   * Optional parameters are height and width.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Src is the hash tag or twitter user to get tweets from
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * Height is the height of the widget, defaults to 200
   * Width is the width of the widget, defaults to 250
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .twitter({
          start:          5,                // seconds, mandatory
          end:            15,               // seconds, mandatory
          src:            '@stevesong',     // mandatory, also accepts hash tags
          height:         200,              // optional
          width:          250,              // optional
          target:         'twitterdiv'      // mandatory
        } )
   *
   */

  Popcorn.plugin( "twitter" , {

      manifest: {
        about: {
          name: "Popcorn Twitter Plugin",
          version: "0.1",
          author: "Scott Downe",
          website: "http://scottdowne.wordpress.com/"
        },
        options:{
          start: {
            elem: "input",
            type: "number",
            label: "Start"
          },
          end: {
            elem: "input",
            type: "number",
            label: "End"
          },
          src: {
            elem: "input",
            type: "text",
            label: "Tweet Source (# or @)",
            "default": "@popcornjs"
          },
          target: "twitter-container",
          height: {
            elem: "input",
            type: "number",
            label: "Height",
            "default": "200",
            optional: true
          },
          width: {
            elem: "input",
            type: "number",
            label: "Width",
            "default": "250",
            optional: true
          }
        }
      },

      _setup: function( options ) {

        if ( !window.TWTR && !scriptLoading ) {
          scriptLoading = true;
          Popcorn.getScript( "//widgets.twimg.com/j/2/widget.js" );
        }

        var target = document.getElementById( options.target );
        // create the div to store the widget
        // setup widget div that is unique per track
        options.container = document.createElement( "div" );
        // use this id to connect it to the widget
        options.container.setAttribute( "id", Popcorn.guid() );
        // display none by default
        options.container.style.display = "none";

         // add the widget's div to the target div
        target && target.appendChild( options.container );

        // setup info for the widget
        var src = options.src || "",
            width = options.width || 250,
            height = options.height || 200,
            profile = /^@/.test( src ),
            widgetOptions = {
              version: 2,
              // use this id to connect it to the div
              id: options.container.getAttribute( "id" ),
              rpp: 30,
              width: width,
              height: height,
              interval: 6000,
              theme: {
                shell: {
                  background: "#ffffff",
                  color: "#000000"
                },
                tweets: {
                  background: "#ffffff",
                  color: "#444444",
                  links: "#1985b5"
                }
              },
              features: {
                loop: true,
                timestamp: true,
                avatars: true,
                hashtags: true,
                toptweets: true,
                live: true,
                scrollbar: false,
                behavior: 'default'
              }
            };

        // create widget
        var isReady = function( that ) {
          if ( window.TWTR ) {
            if ( profile ) {

              widgetOptions.type = "profile";

              new TWTR.Widget( widgetOptions ).render().setUser( src ).start();

            } else {

              widgetOptions.type = "search";
              widgetOptions.search = src;
              widgetOptions.subject = src;

              new TWTR.Widget( widgetOptions ).render().start();

            }
          } else {
            setTimeout( function() {
              isReady( that );
            }, 1);
          }
        };

        isReady( this );
      },

      /**
       * @member Twitter
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options.container.style.display = "inline";
      },

      /**
       * @member Twitter
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        options.container.style.display = "none";
      },
      _teardown: function( options ) {

        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options.container );
      }
    });

})( Popcorn );
// PLUGIN: WEBPAGE

(function ( Popcorn ) {

  /**
   * Webpages popcorn plug-in
   * Creates an iframe showing a website specified by the user
   * Options parameter will need a start, end, id, target and src.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Id is the id that you want assigned to the iframe
   * Target is the id of the document element that the iframe needs to be attached to,
   * this target element must exist on the DOM
   * Src is the url of the website that you want the iframe to display
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .webpage({
          id: "webpages-a",
          start: 5, // seconds
          end: 15, // seconds
          src: 'http://www.webmademovies.org',
          target: 'webpagediv'
        } )
   *
   */
  Popcorn.plugin( "webpage" , {
    manifest: {
      about: {
        name: "Popcorn Webpage Plugin",
        version: "0.1",
        author: "@annasob",
        website: "annasob.wordpress.com"
      },
      options: {
        id: {
          elem: "input",
          type: "text",
          label: "Id",
          optional: true
        },
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        src: {
          elem: "input",
          type: "url",
          label: "Webpage URL",
          "default": "http://mozillapopcorn.org"
        },
        target: "iframe-container"
      }
    },
    _setup: function( options ) {

      var target = document.getElementById( options.target );

      // make src an iframe acceptable string
      options.src = options.src.replace( /^(https?:)?(\/\/)?/, "//" );

      // make an iframe
      options._iframe = document.createElement( "iframe" );
      options._iframe.setAttribute( "width", "100%" );
      options._iframe.setAttribute( "height", "100%" );
      options._iframe.id = options.id;
      options._iframe.src = options.src;
      options._iframe.style.display = "none";

      // add the hidden iframe to the DOM
      target && target.appendChild( options._iframe );

    },
    /**
     * @member webpage
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      // make the iframe visible
      options._iframe.src = options.src;
      options._iframe.style.display = "inline";
    },
    /**
     * @member webpage
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      // make the iframe invisible
      options._iframe.style.display = "none";
    },
    _teardown: function( options ) {

      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._iframe );
    }
  });
})( Popcorn );
// PLUGIN: WIKIPEDIA


var wikiCallback;

(function ( Popcorn ) {

  /**
   * Wikipedia popcorn plug-in
   * Displays a wikipedia aricle in the target specified by the user by using
   * new DOM element instead overwriting them
   * Options parameter will need a start, end, target, lang, src, title and numberofwords.
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the document element that the text from the article needs to be
   * attached to, this target element must exist on the DOM
   * -Lang (optional, defaults to english) is the language in which the article is in.
   * -Src is the url of the article
   * -Title (optional) is the title of the article
   * -numberofwords (optional, defaults to 200) is  the number of words you want displaid.
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn("#video")
        .wikipedia({
          start: 5, // seconds
          end: 15, // seconds
          src: "http://en.wikipedia.org/wiki/Cape_Town",
          target: "wikidiv"
        } )
   *
   */
  Popcorn.plugin( "wikipedia" , {

    manifest: {
      about:{
        name: "Popcorn Wikipedia Plugin",
        version: "0.1",
        author: "@annasob",
        website: "annasob.wordpress.com"
      },
      options:{
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        lang: {
          elem: "input",
          type: "text",
          label: "Language",
          "default": "english",
          optional: true
        },
        src: {
          elem: "input", 
          type: "url", 
          label: "Wikipedia URL",
          "default": "http://en.wikipedia.org/wiki/Cat"
        },
        title: {
          elem: "input",
          type: "text",
          label: "Title",
          "default": "Cats",
          optional: true
        },
        numberofwords: {
          elem: "input",
          type: "number",
          label: "Number of Words",
          "default": "200",
          optional: true
        },
        target: "wikipedia-container"
      }
    },
    /**
     * @member wikipedia
     * The setup function will get all of the needed
     * items in place before the start function is called.
     * This includes getting data from wikipedia, if the data
     * is not received and processed before start is called start
     * will not do anything
     */
    _setup : function( options ) {
      // declare needed variables
      // get a guid to use for the global wikicallback function
      var  _text, _guid = Popcorn.guid();

      // if the user didn't specify a language default to english
      if ( !options.lang ) {
        options.lang = "en";
      }

      // if the user didn't specify number of words to use default to 200
      options.numberofwords  = options.numberofwords || 200;

      // wiki global callback function with a unique id
      // function gets the needed information from wikipedia
      // and stores it by appending values to the options object
      window[ "wikiCallback" + _guid ]  = function ( data ) {

        options._link = document.createElement( "a" );
        options._link.setAttribute( "href", options.src );
        options._link.setAttribute( "target", "_blank" );

        // add the title of the article to the link
        options._link.innerHTML = options.title || data.parse.displaytitle;

        // get the content of the wiki article
        options._desc = document.createElement( "p" );

        // get the article text and remove any special characters
        _text = data.parse.text[ "*" ].substr( data.parse.text[ "*" ].indexOf( "<p>" ) );
        _text = _text.replace( /((<(.|\n)+?>)|(\((.*?)\) )|(\[(.*?)\]))/g, "" );

        _text = _text.split( " " );
        options._desc.innerHTML = ( _text.slice( 0, ( _text.length >= options.numberofwords ? options.numberofwords : _text.length ) ).join (" ") + " ..." ) ;

        options._fired = true;
      };

      if ( options.src ) {
        Popcorn.getScript( "//" + options.lang + ".wikipedia.org/w/api.php?action=parse&props=text&redirects&page=" +
          options.src.slice( options.src.lastIndexOf( "/" ) + 1 )  + "&format=json&callback=wikiCallback" + _guid );
      }

    },
    /**
     * @member wikipedia
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      // dont do anything if the information didn't come back from wiki
      var isReady = function () {

        if ( !options._fired ) {
          setTimeout( function () {
            isReady();
          }, 13);
        } else {

          if ( options._link && options._desc ) {
            if ( document.getElementById( options.target ) ) {
              document.getElementById( options.target ).appendChild( options._link );
              document.getElementById( options.target ).appendChild( options._desc );
              options._added = true;
            }
          }
        }
      };

      isReady();
    },
    /**
     * @member wikipedia
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      // ensure that the data was actually added to the
      // DOM before removal
      if ( options._added ) {
        document.getElementById( options.target ).removeChild( options._link );
        document.getElementById( options.target ).removeChild( options._desc );
      }
    },

    _teardown: function( options ){

      if ( options._added ) {
        options._link.parentNode && document.getElementById( options.target ).removeChild( options._link );
        options._desc.parentNode && document.getElementById( options.target ).removeChild( options._desc );
        delete options.target;
      }
    }
  });

})( Popcorn );
// PLUGIN: Mustache

(function ( Popcorn ) {

  /**
   * Mustache Popcorn Plug-in
   *
   * Adds the ability to render JSON using templates via the Mustache templating library.
   *
   * @param {Object} options
   *
   * Required parameters: start, end, template, data, and target.
   * Optional parameter: static.
   *
   *   start: the time in seconds when the mustache template should be rendered
   *          in the target div.
   *
   *   end: the time in seconds when the rendered mustache template should be
   *        removed from the target div.
   *
   *   target: a String -- the target div's id.
   *
   *   template: the mustache template for the plugin to use when rendering.  This can be
   *             a String containing the template, or a Function that returns the template's
   *             String.
   *
   *   data: the data to be rendered using the mustache template.  This can be a JSON String,
   *         a JavaScript Object literal, or a Function returning a String or Literal.
   *
   *   dynamic: an optional argument indicating that the template and json data are dynamic
   *            and need to be loaded dynamically on every use.  Defaults to True.
   *
   * Example:
     var p = Popcorn('#video')

        // Example using template and JSON strings.
        .mustache({
          start: 5, // seconds
          end:  15,  // seconds
          target: 'mustache',
          template: '<h1>{{header}}</h1>'                         +
                    '{{#bug}}'                                    +
                    '{{/bug}}'                                    +
                    ''                                            +
                    '{{#items}}'                                  +
                    '  {{#first}}'                                +
                    '    <li><strong>{{name}}</strong></li>'      +
                    '  {{/first}}'                                +
                    '  {{#link}}'                                 +
                    '    <li><a href="{{url}}">{{name}}</a></li>' +
                    '  {{/link}}'                                 +
                    '{{/items}}'                                  +
                    ''                                            +
                    '{{#empty}}'                                  +
                    '  <p>The list is empty.</p>'                 +
                    '{{/empty}}'                                  ,

          data:     '{'                                                        +
                    '  "header": "Colors", '                                   +
                    '  "items": [ '                                            +
                    '      {"name": "red", "first": true, "url": "#Red"}, '    +
                    '      {"name": "green", "link": true, "url": "#Green"}, ' +
                    '      {"name": "blue", "link": true, "url": "#Blue"} '    +
                    '  ],'                                                     +
                    '  'empty': false'                                         +
                    '}',
          dynamic: false // The json is not going to change, load it early.
        } )

        // Example showing Functions instead of Strings.
        .mustache({
          start: 20,  // seconds
          end:   25,  // seconds
          target: 'mustache',
          template: function(instance, options) {
                      var template = // load your template file here...
                      return template;
                    },
          data:     function(instance, options) {
                      var json = // load your json here...
                      return json;
                    }
        } );
  *
  */

  Popcorn.plugin( "mustache" , function( options ){

    var getData, data, getTemplate, template;

    Popcorn.getScript( "http://mustache.github.com/extras/mustache.js" );

    var shouldReload = !!options.dynamic,
        typeOfTemplate = typeof options.template,
        typeOfData = typeof options.data,
        target = document.getElementById( options.target );

    options.container = target || document.createElement( "div" );

    if ( typeOfTemplate === "function" ) {
      if ( !shouldReload ) {
        template = options.template( options );
      } else {
        getTemplate = options.template;
      }
    } else if ( typeOfTemplate === "string" ) {
      template = options.template;
    } else {
      template = "";
    }

    if ( typeOfData === "function" ) {
      if ( !shouldReload ) {
        data = options.data( options );
      } else {
        getData = options.data;
      }
    } else if ( typeOfData === "string" ) {
      data = JSON.parse( options.data );
    } else if ( typeOfData === "object" ) {
      data = options.data;
    } else {
      data = "";
    }

    return {
      start: function( event, options ) {

        var interval = function() {

          if( !window.Mustache ) {
            setTimeout( function() {
              interval();
            }, 10 );
          } else {

            // if dynamic, freshen json data on every call to start, just in case.
            if ( getData ) {
              data = getData( options );
            }

            if ( getTemplate ) {
              template = getTemplate( options );
            }

            var html = Mustache.to_html( template,
                                         data
                                       ).replace( /^\s*/mg, "" );
            options.container.innerHTML = html;
          }
        };

        interval();

      },

      end: function( event, options ) {
        options.container.innerHTML = "";
      },
      _teardown: function( options ) {
        getData = data = getTemplate = template = null;
      }
    };
  },
  {
    about: {
      name: "Popcorn Mustache Plugin",
      version: "0.1",
      author: "David Humphrey (@humphd)",
      website: "http://vocamus.net/dave"
    },
    options: {
      start: {
        elem: "input",
        type: "number",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      target: "mustache-container",
      template: {
        elem: "input",
        type: "text",
        label: "Template"
      },
      data: {
        elem: "input",
        type: "text",
        label: "Data"
      },
      dynamic: {
        elem: "input",
        type: "checkbox",
        label: "Dynamic",
        "default": true
      }
    }
  });
})( Popcorn );
// PLUGIN: OPENMAP
( function ( Popcorn ) {

  /**
   * openmap popcorn plug-in
   * Adds an OpenLayers map and open map tiles (OpenStreetMap [default], NASA WorldWind, or USGS Topographic)
   * Based on the googlemap popcorn plug-in. No StreetView support
   * Options parameter will need a start, end, target, type, zoom, lat and lng
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Type [optional] either: ROADMAP (OpenStreetMap), SATELLITE (NASA WorldWind / LandSat), or TERRAIN (USGS).
   *                          The Stamen custom map types can also be used (http://maps.stamen.com): STAMEN-TONER,
   *                          STAMEN-TERRAIN, or STAMEN-WATERCOLOR.
   * -Zoom [optional] defaults to 2
   * -Lat and Lng are the coordinates of the map if location is not named
   * -Location is a name of a place to center the map, geocoded to coordinates using TinyGeocoder.com
   * -Markers [optional] is an array of map marker objects, with the following properties:
   * --Icon is the URL of a map marker image
   * --Size [optional] is the radius in pixels of the scaled marker image (default is 14)
   * --Text [optional] is the HTML content of the map marker -- if your popcorn instance is named 'popped', use <script>popped.currentTime(10);</script> to control the video
   * --Lat and Lng are coordinates of the map marker if location is not specified
   * --Location is a name of a place for the map marker, geocoded to coordinates using TinyGeocoder.com
   *  Note: using location requires extra loading time, also not specifying both lat/lng and location will
   * cause a JavaScript error.
   * @param {Object} options
   *
   * Example:
     var p = Popcorn( '#video' )
        .openmap({
          start: 5,
          end: 15,
          type: 'ROADMAP',
          target: 'map',
          lat: 43.665429,
          lng: -79.403323
        })
   *
   */
  var newdiv,
      i = 1;

  function toggle( container, display ) {
    if ( container.map ) {
      container.map.div.style.display = display;
      return;
    }

    setTimeout(function() {
      toggle( container, display );
    }, 10 );
  }

  Popcorn.plugin( "openmap", function( options ){
    var newdiv,
        centerlonlat,
        projection,
        displayProjection,
        pointLayer,
        selectControl,
        popup,
        isGeoReady,
        target = document.getElementById( options.target );

    // create a new div within the target div
    // this is later passed on to the maps api
    newdiv = document.createElement( "div" );
    newdiv.id = "openmapdiv" + i;
    newdiv.style.width = "100%";
    newdiv.style.height = "100%";
    i++;

    target && target.appendChild( newdiv );

    // callback function fires when the script is run
    isGeoReady = function() {
      if ( ! ( window.OpenLayers && window.OpenLayers.Layer.Stamen ) ) {
        setTimeout(function() {
          isGeoReady();
        }, 50);
      } else {
        if ( options.location ) {
          // set a dummy center at start
          location = new OpenLayers.LonLat( 0, 0 );
          // query TinyGeocoder and re-center in callback
          Popcorn.getJSONP(
            "//tinygeocoder.com/create-api.php?q=" + options.location + "&callback=jsonp",
            function( latlng ) {
              centerlonlat = new OpenLayers.LonLat( latlng[ 1 ], latlng[ 0 ] );
            }
          );
        } else {
          centerlonlat = new OpenLayers.LonLat( options.lng, options.lat );
        }

        options.type = options.type || "ROADMAP";
        switch( options.type ) {
          case "SATELLITE" :
            // add NASA WorldWind / LANDSAT map
            options.map = new OpenLayers.Map({
              div: newdiv,
              maxResolution: 0.28125,
              tileSize: new OpenLayers.Size( 512, 512 )
            });
            var worldwind = new OpenLayers.Layer.WorldWind(
              "LANDSAT",
              "//worldwind25.arc.nasa.gov/tile/tile.aspx",
              2.25, 4,
              { T: "105" }
            );
            options.map.addLayer( worldwind );
            displayProjection = new OpenLayers.Projection( "EPSG:4326" );
            projection = new OpenLayers.Projection( "EPSG:4326" );
            break;
          case "TERRAIN":
            // add terrain map ( USGS )
            displayProjection = new OpenLayers.Projection( "EPSG:4326" );
            projection = new OpenLayers.Projection( "EPSG:4326" );
            options.map = new OpenLayers.Map({
              div: newdiv,
              projection: projection
            });
            var relief = new OpenLayers.Layer.WMS(
              "USGS Terraserver",
              "//terraserver-usa.org/ogcmap.ashx?",
              { layers: "DRG" }
            );
            options.map.addLayer( relief );
            break;
          case "STAMEN-TONER":
          case "STAMEN-WATERCOLOR":
          case "STAMEN-TERRAIN":
            var layerName = options.type.replace("STAMEN-", "").toLowerCase();
            var sLayer = new OpenLayers.Layer.Stamen( layerName );
            displayProjection = new OpenLayers.Projection( "EPSG:4326" );
            projection = new OpenLayers.Projection( 'EPSG:900913' );
            centerlonlat = centerlonlat.transform( displayProjection, projection );
            options.map = new OpenLayers.Map( {
              div: newdiv,
              projection: projection,
              displayProjection: displayProjection,
              controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanPanel(),
                new OpenLayers.Control.ZoomPanel()
              ]
            } );
            options.map.addLayer( sLayer );
            break;
          default: /* case "ROADMAP": */
            // add OpenStreetMap layer
            projection = new OpenLayers.Projection( 'EPSG:900913' );
            displayProjection = new OpenLayers.Projection( 'EPSG:4326' );
            centerlonlat = centerlonlat.transform( displayProjection, projection );
            options.map = new OpenLayers.Map({
              div: newdiv,
              projection: projection,
              "displayProjection": displayProjection
            });
            var osm = new OpenLayers.Layer.OSM();
            options.map.addLayer( osm );
            break;
        }

        if ( options.map ) {
          options.map.setCenter(centerlonlat, options.zoom || 10);
          options.map.div.style.display = "none";
        }
      }
    };

    isGeoReady();

    return {

      /**
       * @member openmap
       * The setup function will be executed when the plug-in is instantiated
       */
      _setup: function( options ) {

        // insert openlayers api script once
        if ( !window.OpenLayers ) {
          Popcorn.getScript( "//openlayers.org/api/OpenLayers.js", function() {
            Popcorn.getScript( "//maps.stamen.com/js/tile.stamen.js" );
          } );
        }

        var isReady = function() {
          // wait until OpenLayers has been loaded, and the start function is run, before adding map
          if ( !options.map ) {
            setTimeout(function() {
              isReady();
            }, 13 );
          } else {

            // default zoom is 2
            options.zoom = options.zoom || 2;

            // make sure options.zoom is a number
            if ( options.zoom && typeof options.zoom !== "number" ) {
              options.zoom = +options.zoom;
            }

            // reset the location and zoom just in case the user played with the map
            options.map.setCenter( centerlonlat, options.zoom );
            if ( options.markers ) {
              var layerStyle = OpenLayers.Util.extend( {} , OpenLayers.Feature.Vector.style[ "default" ] ),
                  featureSelected = function( clickInfo ) {
                    clickedFeature = clickInfo.feature;
                    if ( !clickedFeature.attributes.text ) {
                      return;
                    }
                    popup = new OpenLayers.Popup.FramedCloud(
                      "featurePopup",
                      clickedFeature.geometry.getBounds().getCenterLonLat(),
                      new OpenLayers.Size( 120, 250 ),
                      clickedFeature.attributes.text,
                      null,
                      true,
                      function( closeInfo ) {
                        selectControl.unselect( this.feature );
                      }
                    );
                    clickedFeature.popup = popup;
                    popup.feature = clickedFeature;
                    options.map.addPopup( popup );
                  },
                  featureUnSelected = function( clickInfo ) {
                    feature = clickInfo.feature;
                    if ( feature.popup ) {
                      popup.feature = null;
                      options.map.removePopup( feature.popup );
                      feature.popup.destroy();
                      feature.popup = null;
                    }
                  },
                  gcThenPlotMarker = function( myMarker ) {
                    Popcorn.getJSONP(
                      "//tinygeocoder.com/create-api.php?q=" + myMarker.location + "&callback=jsonp",
                      function( latlng ) {
                        var myPoint = new OpenLayers.Geometry.Point( latlng[1], latlng[0] ).transform( displayProjection, projection ),
                            myPointStyle = OpenLayers.Util.extend( {}, layerStyle );
                        if ( !myMarker.size || isNaN( myMarker.size ) ) {
                          myMarker.size = 14;
                        }
                        myPointStyle.pointRadius = myMarker.size;
                        myPointStyle.graphicOpacity = 1;
                        myPointStyle.externalGraphic = myMarker.icon;
                        var myPointFeature = new OpenLayers.Feature.Vector( myPoint, null, myPointStyle );
                        if ( myMarker.text ) {
                          myPointFeature.attributes = {
                            text: myMarker.text
                          };
                        }
                        pointLayer.addFeatures( [ myPointFeature ] );
                      }
                    );
                  };
              pointLayer = new OpenLayers.Layer.Vector( "Point Layer", { style: layerStyle } );
              options.map.addLayer( pointLayer );
              for ( var m = 0, l = options.markers.length; m < l ; m++ ) {
                var myMarker = options.markers[ m ];
                if( myMarker.text ){
                  if( !selectControl ){
                    selectControl = new OpenLayers.Control.SelectFeature( pointLayer );
                    options.map.addControl( selectControl );
                    selectControl.activate();
                    pointLayer.events.on({
                      "featureselected": featureSelected,
                      "featureunselected": featureUnSelected
                    });
                  }
                }
                if ( myMarker.location ) {
                  var geocodeThenPlotMarker = gcThenPlotMarker;
                  geocodeThenPlotMarker( myMarker );
                } else {
                  var myPoint = new OpenLayers.Geometry.Point( myMarker.lng, myMarker.lat ).transform( displayProjection, projection ),
                      myPointStyle = OpenLayers.Util.extend( {}, layerStyle );
                  if ( !myMarker.size || isNaN( myMarker.size ) ) {
                    myMarker.size = 14;
                  }
                  myPointStyle.pointRadius = myMarker.size;
                  myPointStyle.graphicOpacity = 1;
                  myPointStyle.externalGraphic = myMarker.icon;
                  var myPointFeature = new OpenLayers.Feature.Vector( myPoint, null, myPointStyle );
                  if ( myMarker.text ) {
                    myPointFeature.attributes = {
                      text: myMarker.text
                    };
                  }
                  pointLayer.addFeatures( [ myPointFeature ] );
                }
              }
            }
          }
        };

        isReady();
      },

      /**
       * @member openmap
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        toggle( options, "block" );
      },

      /**
       * @member openmap
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
          toggle( options, "none" );
      },

      _teardown: function( options ) {

        target && target.removeChild( newdiv );
        newdiv = map = centerlonlat = projection = displayProjection = pointLayer = selectControl = popup = null;
      }
    };
  },
  {
    about:{
      name: "Popcorn OpenMap Plugin",
      version: "0.3",
      author: "@mapmeld",
      website: "mapadelsur.blogspot.com"
    },
    options:{
      start: {
        elem: "input",
        type: "number",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      target: "map-container",
      type: {
        elem: "select",
        options: [ "ROADMAP", "SATELLITE", "TERRAIN" ],
        label: "Map Type",
        optional: true
      },
      zoom: {
        elem: "input",
        type: "number",
        label: "Zoom",
        "default": 2
      },
      lat: {
        elem: "input",
        type: "text",
        label: "Lat",
        optional: true
      },
      lng: {
        elem: "input",
        type: "text",
        label: "Lng",
        optional: true
      },
      location: {
        elem: "input",
        type: "text",
        label: "Location",
        "default": "Toronto, Ontario, Canada"
      },
      markers: {
        elem: "input",
        type: "text",
        label: "List Markers",
        optional: true
      }
    }
  });
}) ( Popcorn );
/**
* Pause Popcorn Plug-in
*
* When this plugin is used, links on the webpage, when clicked, will pause
* popcorn videos that especified 'pauseOnLinkClicked' as an option. Links may
* cause a new page to display on a new window, or may cause a new page to
* display in the current window, in which case the videos won't be available
* anymore. It only affects anchor tags. It does not affect objects with click
* events that act as anchors.
*
* Example:
 var p = Popcorn('#video', { pauseOnLinkClicked : true } )
   .play();
*
*/

document.addEventListener( "click", function( event ) {

  var targetElement = event.target;

  //Some browsers use an element as the target, some use the text node inside
  if ( targetElement.nodeName === "A" || targetElement.parentNode && targetElement.parentNode.nodeName === "A" ) {
    Popcorn.instances.forEach( function( video ) {
      if ( video.options.pauseOnLinkClicked ) {
        video.pause();
      }
    });
  }
}, false );
// PLUGIN: Wordriver

(function ( Popcorn ) {

  var container = {},
      spanLocation = 0,
      setupContainer = function( target ) {

        container[ target ] = document.createElement( "div" );

        var t = document.getElementById( target );
        t && t.appendChild( container[ target ] );

        container[ target ].style.height = "100%";
        container[ target ].style.position = "relative";

        return container[ target ];
      },
      // creates an object of supported, cross platform css transitions
      span = document.createElement( "span" ),
      prefixes = [ "webkit", "Moz", "ms", "O", "" ],
      specProp = [ "Transform", "TransitionDuration", "TransitionTimingFunction" ],
      supports = {},
      prop;

  document.getElementsByTagName( "head" )[ 0 ].appendChild( span );

  for ( var sIdx = 0, sLen = specProp.length; sIdx < sLen; sIdx++ ) {

    for ( var pIdx = 0, pLen = prefixes.length; pIdx < pLen; pIdx++ ) {

      prop = prefixes[ pIdx ] + specProp[ sIdx ];

      if ( prop in span.style ) {

        supports[ specProp[ sIdx ].toLowerCase() ] = prop;
        break;
      }
    }
  }

  // Garbage collect support test span
  document.getElementsByTagName( "head" )[ 0 ].appendChild( span );

  /**
   * Word River popcorn plug-in
   * Displays a string of text, fading it in and out
   * while transitioning across the height of the parent container
   * for the duration of the instance  (duration = end - start)
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn( '#video' )
        .wordriver({
          start: 5,                      // When to begin the Word River animation
          end: 15,                       // When to finish the Word River animation
          text: 'Hello World',           // The text you want to be displayed by Word River
          target: 'wordRiverDiv',        // The target div to append the text to
          color: "blue"                  // The color of the text. (can be Hex value i.e. #FFFFFF )
        } )
   *
   */

  Popcorn.plugin( "wordriver" , {

      manifest: {
        about:{
          name: "Popcorn WordRiver Plugin"
        },
        options: {
          start: {
            elem: "input",
            type: "number",
            label: "Start"
          },
          end: {
            elem: "input",
            type: "number",
            label: "End"
          },
          target: "wordriver-container",
          text: {
            elem: "input",
            type: "text",
            label: "Text",
            "default": "Popcorn.js"
          },
          color: {
            elem: "input",
            type: "text",
            label: "Color",
            "default": "Green",
            optional: true
          }
        }
      },

      _setup: function( options ) {

        options._duration = options.end - options.start;
        options._container = container[ options.target ] || setupContainer( options.target );

        options.word = document.createElement( "span" );
        options.word.style.position = "absolute";

        options.word.style.whiteSpace = "nowrap";
        options.word.style.opacity = 0;

        options.word.style.MozTransitionProperty = "opacity, -moz-transform";
        options.word.style.webkitTransitionProperty = "opacity, -webkit-transform";
        options.word.style.OTransitionProperty = "opacity, -o-transform";
        options.word.style.transitionProperty = "opacity, transform";

        options.word.style[ supports.transitionduration ] = 1 + "s, " + options._duration + "s";
        options.word.style[ supports.transitiontimingfunction ] = "linear";

        options.word.innerHTML = options.text;
        options.word.style.color = options.color || "black";
      },
      start: function( event, options ){

        options._container.appendChild( options.word );

        // Resets the transform when changing to a new currentTime before the end event occurred.
        options.word.style[ supports.transform ] = "";

        options.word.style.fontSize = ~~( 30 + 20 * Math.random() ) + "px";
        spanLocation = spanLocation % ( options._container.offsetWidth - options.word.offsetWidth );
        options.word.style.left = spanLocation + "px";
        spanLocation += options.word.offsetWidth + 10;
        options.word.style[ supports.transform ] = "translateY(" +
          ( options._container.offsetHeight - options.word.offsetHeight ) + "px)";

        options.word.style.opacity = 1;

        // automatically clears the word based on time
        setTimeout( function() {

		      options.word.style.opacity = 0;
        // ensures at least one second exists, because the fade animation is 1 second
		    }, ( ( (options.end - options.start) - 1 ) || 1 ) * 1000 );
      },
      end: function( event, options ){

        // manually clears the word based on user interaction
        options.word.style.opacity = 0;
      },
      _teardown: function( options ) {

        var target = document.getElementById( options.target );
        // removes word span from generated container
        options.word.parentNode && options._container.removeChild( options.word );

        // if no more word spans exist in container, remove container
        container[ options.target ] &&
          !container[ options.target ].childElementCount &&
          target && target.removeChild( container[ options.target ] ) &&
          delete container[ options.target ];
      }
  });

})( Popcorn );
// PLUGIN: Timeline
(function ( Popcorn ) {

  /**
     * timeline popcorn plug-in
     * Adds data associated with a certain time in the video, which creates a scrolling view of each item as the video progresses
     * Options parameter will need a start, target, title, and text
     * -Start is the time that you want this plug-in to execute
     * -End is the time that you want this plug-in to stop executing, tho for this plugin an end time may not be needed ( optional )
     * -Target is the id of the DOM element that you want the timeline to appear in. This element must be in the DOM
     * -Title is the title of the current timeline box
     * -Text is text is simply related text that will be displayed
     * -innerHTML gives the user the option to add things such as links, buttons and so on
     * -direction specifies whether the timeline will grow from the top or the bottom, receives input as "UP" or "DOWN"
     * @param {Object} options
     *
     * Example:
      var p = Popcorn("#video")
        .timeline( {
         start: 5, // seconds
         target: "timeline",
         title: "Seneca",
         text: "Welcome to seneca",
         innerHTML: "Click this link <a href='http://www.google.ca'>Google</a>"
      } )
    *
  */

  var i = 1;

  Popcorn.plugin( "timeline" , function( options ) {

    var target = document.getElementById( options.target ),
        contentDiv = document.createElement( "div" ),
        container,
        goingUp = true;

    if ( target && !target.firstChild ) {
      target.appendChild ( container = document.createElement( "div" ) );
      container.style.width = "inherit";
      container.style.height = "inherit";
      container.style.overflow = "auto";
    } else {
      container = target.firstChild;
    }

    contentDiv.style.display = "none";
    contentDiv.id = "timelineDiv" + i;

    //  Default to up if options.direction is non-existant or not up or down
    options.direction = options.direction || "up";
    if ( options.direction.toLowerCase() === "down" ) {

      goingUp = false;
    }

    if ( target && container ) {
      // if this isnt the first div added to the target div
      if( goingUp ){
        // insert the current div before the previous div inserted
        container.insertBefore( contentDiv, container.firstChild );
      }
      else {

        container.appendChild( contentDiv );
      }

    }

    i++;

    //  Default to empty if not used
    //options.innerHTML = options.innerHTML || "";

    contentDiv.innerHTML = "<p><span id='big' style='font-size:24px; line-height: 130%;' >" + options.title + "</span><br />" +
    "<span id='mid' style='font-size: 16px;'>" + options.text + "</span><br />" + options.innerHTML;

    return {

      start: function( event, options ) {
        contentDiv.style.display = "block";

        if( options.direction === "down" ) {
          container.scrollTop = container.scrollHeight;
        }
      },

      end: function( event, options ) {
        contentDiv.style.display = "none";
      },

      _teardown: function( options ) {

        ( container && contentDiv ) && container.removeChild( contentDiv ) && !container.firstChild && target.removeChild( container );
      }
    };
  },
  {

    about: {
      name: "Popcorn Timeline Plugin",
      version: "0.1",
      author: "David Seifried @dcseifried",
      website: "dseifried.wordpress.com"
    },

    options: {
      start: {
        elem: "input",
        type: "number",
        label: "Start"
      },
      end: {
        elem: "input",
        type: "number",
        label: "End"
      },
      target: "feed-container",
      title: {
        elem: "input",
        type: "text",
        label: "Title"
      },
      text: {
        elem: "input",
        type: "text",
        label: "Text"
      },
      innerHTML: {
        elem: "input",
        type: "text",
        label: "HTML Code",
        optional: true
      },
      direction: {
        elem: "select",
        options: [ "DOWN", "UP" ],
        label: "Direction",
        optional: true
      }
    }
  });

})( Popcorn );
// PLUGIN: documentcloud

(function( Popcorn, document ) {

  /**
   * Document Cloud popcorn plug-in
   *
   * @param {Object} options
   *
   * Example:
   *  var p = Popcorn("#video")
   *     // Let the pdf plugin load your PDF file for you using pdfUrl.
   *     .documentcloud({
   *       start: 45
   *       url: "http://www.documentcloud.org/documents/70050-urbina-day-1-in-progress.html", // or .js
   *       width: ...,
   *       height: ...,
   *       zoom: ...,
   *       page: ...,
   *       container: ...
   *     });

api - https://github.com/documentcloud/document-viewer/blob/master/public/javascripts/DV/controllers/api.js

   */

   // track registered plugins by document
   var documentRegistry = {};

  Popcorn.plugin( "documentcloud", {

    manifest: {
      about: {
        name: "Popcorn Document Cloud Plugin",
        version: "0.1",
        author: "@humphd, @ChrisDeCairos",
        website: "http://vocamus.net/dave"
      },
      options: {
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        target: "documentcloud-container",
        width: {
          elem: "input",
          type: "text",
          label: "Width",
          optional: true
        },
        height: {
          elem: "input",
          type: "text",
          label: "Height",
          optional: true
        },
        src: {
          elem: "input",
          type: "url",
          label: "PDF URL",
          "default": "http://www.documentcloud.org/documents/70050-urbina-day-1-in-progress.html"
        },
        preload: {
          elem: "input",
          type: "checkbox",
          label: "Preload",
          "default": true
        },
        page: {
          elem: "input",
          type: "number",
          label: "Page Number",
          optional: true
        },
        aid: {
          elem: "input",
          type: "number",
          label: "Annotation Id",
          optional: true
        }
      }
    },

    _setup: function( options ) {
      var DV = window.DV = window.DV || {},
          that = this;

      //setup elem...
      function load() {
        DV.loaded = false;
        // swap .html URL to .js for API call
        var url = options.url.replace( /\.html$/, ".js" ),
          target = options.target,
          targetDiv = document.getElementById( target ),
          containerDiv = document.createElement( "div" ),
          containerDivSize = Popcorn.position( targetDiv ),
          // need to use size of div if not given
          width = options.width || containerDivSize.width,
          height = options.height || containerDivSize.height,
          sidebar = options.sidebar || true,
          text = options.text || true,
          pdf = options.pdf || true,
          showAnnotations = options.showAnnotations || true,
          zoom = options.zoom || 700,
          search = options.search || true,
          page = options.page,
          container;

        function setOptions( viewer ) {
          options._key = viewer.api.getId();

          options._changeView = function ( viewer ) {
            if ( options.aid ) {
              viewer.pageSet.showAnnotation( viewer.api.getAnnotation( options.aid ) );
            } else {
              viewer.api.setCurrentPage( options.page );
            }
          };
        }

        function documentIsLoaded( url ) {
          var found = false;
          Popcorn.forEach( DV.viewers, function( viewer, idx ) {
            if( viewer.api.getSchema().canonicalURL === url ) {
              var targetDoc;
              setOptions( viewer );
              targetDoc = documentRegistry[ options._key ];
              options._containerId = targetDoc.id;
              targetDoc.num += 1;
              found = true;
              DV.loaded = true;
            }
          });
          return found;
        }

        function createRegistryEntry() {
          var entry = {
            num: 1,
            id: options._containerId
          };
          documentRegistry[ options._key ] = entry;
          DV.loaded = true;
        }

        if ( !documentIsLoaded( options.url ) ) {

          containerDiv.id = options._containerId = Popcorn.guid( target );
          container = "#" + containerDiv.id;
          targetDiv.appendChild( containerDiv );
          that.trigger( "documentready" );

          // Figure out if we need a callback to change the page #
          var afterLoad = options.page || options.aid ?
            function( viewer ) {
              setOptions( viewer );
              options._changeView( viewer );
              containerDiv.style.visibility = "hidden";
              viewer.elements.pages.hide();
              createRegistryEntry();
            } :
            function( viewer ) {
              setOptions( viewer );
              createRegistryEntry();
              containerDiv.style.visibility = "hidden";
              viewer.elements.pages.hide();
            };
          DV.load( url, {
            width: width,
            height: height,
            sidebar: sidebar,
            text: text,
            pdf: pdf,
            showAnnotations: showAnnotations,
            zoom: zoom,
            search: search,
            container: container,
            afterLoad: afterLoad
          });
        }
      }
      function readyCheck() {
        if( window.DV.loaded ) {
          load();
        } else {
          setTimeout( readyCheck, 25 );
        }
      }

      // If the viewer is already loaded, don't repeat the process.
      if ( !DV.loading ) {
        DV.loading = true;
        DV.recordHit = "//www.documentcloud.org/pixel.gif";

        var link = document.createElement( "link" ),
            head = document.getElementsByTagName( "head" )[ 0 ];

        link.rel = "stylesheet";
        link.type = "text/css";
        link.media = "screen";
        link.href = "//s3.documentcloud.org/viewer/viewer-datauri.css";

        head.appendChild( link );

        // Record the fact that the viewer is loaded.
        DV.loaded = false;

        // Request the viewer JavaScript.
        Popcorn.getScript( "http://s3.documentcloud.org/viewer/viewer.js", function() {
          DV.loading = false;
          load();
        });
      } else {

        readyCheck();
      }

    },

    start: function( event, options ) {
      var elem = document.getElementById( options._containerId ),
          viewer = DV.viewers[ options._key ];
      ( options.page || options.aid ) && viewer &&
        options._changeView( viewer );

      if ( elem && viewer) {
        elem.style.visibility = "visible";
        viewer.elements.pages.show();
      }
    },

    end: function( event, options ) {
      var elem = document.getElementById( options._containerId );

      if ( elem && DV.viewers[ options._key ] ) {
        elem.style.visibility = "hidden";
        DV.viewers[ options._key ].elements.pages.hide();
      }
    },

    _teardown: function( options ) {
      var elem = document.getElementById( options._containerId ),
          key = options._key;
      if ( key && DV.viewers[ key ] && --documentRegistry[ key ].num === 0 ) {
        DV.viewers[ key ].api.unload();

        while ( elem.hasChildNodes() ) {
          elem.removeChild( elem.lastChild );
        }
        elem.parentNode.removeChild( elem );
      }
    }
  });
})( Popcorn, window.document );
// PARSER: 0.3 JSON

(function (Popcorn) {
  Popcorn.parser( "parseJSON", "JSON", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        manifestData = {}, 
        dataObj = data;
    
    
    /*
      TODO: add support for filling in source children of the video element
      
      
      remote: [
        { 
          src: "whatever.mp4", 
          type: 'video/mp4; codecs="avc1, mp4a"'
        }, 
        { 
          src: "whatever.ogv", 
          type: 'video/ogg; codecs="theora, vorbis"'
        }
      ]

    */
    
        
    Popcorn.forEach( dataObj.data, function ( obj, key ) {
      retObj.data.push( obj );
    });

    return retObj;
  });

})( Popcorn );
// PARSER: 0.1 SBV

(function (Popcorn) {

  /**
   * SBV popcorn parser plug-in 
   * Parses subtitle files in the SBV format.
   * Times are expected in H:MM:SS.MIL format, with hours optional
   * Subtitles which don't match expected format are ignored
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   * 
   * @param {Object} data
   * 
   * Example:
    0:00:02.400,0:00:07.200
    Senator, we're making our final approach into Coruscant.
   */
  Popcorn.parser( "parseSBV", function( data ) {
  
    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        lines,
        i = 0,
        len = 0,
        idx = 0;
    
    // [H:]MM:SS.MIL string to SS.MIL
    // Will thrown exception on bad time format
    var toSeconds = function( t_in ) {
      var t = t_in.split( ":" ),
          l = t.length-1,
          time;
      
      try {
        time = parseInt( t[l-1], 10 )*60 + parseFloat( t[l], 10 );
        
        // Hours optionally given
        if ( l === 2 ) { 
          time += parseInt( t[0], 10 )*3600;
        }
      } catch ( e ) {
        throw "Bad cue";
      }
      
      return time;
    };
    
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };
  
    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( /(?:\r\n|\r|\n)/gm );
    len = lines.length;
    
    while ( i < len ) {
      var sub = {},
          text = [],
          time = lines[i++].split( "," );
      
      try {
        sub.start = toSeconds( time[0] );
        sub.end = toSeconds( time[1] );
        
        // Gather all lines of text
        while ( i < len && lines[i] ) {
          text.push( lines[i++] );
        }
        
        // Join line breaks in text
        sub.text = text.join( "<br />" );
        subs.push( createTrack( "subtitle", sub ) );
      } catch ( e ) {
        // Bad cue, advance to end of cue
        while ( i < len && lines[i] ) {
          i++;
        }
      }
      
      // Consume empty whitespace
      while ( i < len && !lines[i] ) {
        i++;
      }
    }
    
    retObj.data = subs;

    return retObj;
  });

})( Popcorn );
// PARSER: 0.3 SRT
(function (Popcorn) {
  /**
   * SRT popcorn parser plug-in 
   * Parses subtitle files in the SRT format.
   * Times are expected in HH:MM:SS,MIL format, though HH:MM:SS.MIL also supported
   * Ignore styling, which may occur after the end time or in-text
   * While not part of the "official" spec, majority of players support HTML and SSA styling tags
   * SSA-style tags are stripped, HTML style tags are left for the browser to handle:
   *    HTML: <font>, <b>, <i>, <u>, <s>
   *    SSA:  \N or \n, {\cmdArg1}, {\cmd(arg1, arg2, ...)}
   
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   * 
   * @param {Object} data
   * 
   * Example:
    1
    00:00:25,712 --> 00:00:30.399
    This text is <font color="red">RED</font> and has not been {\pos(142,120)} positioned.
    This takes \Nup three \nentire lines.
    This contains nested <b>bold, <i>italic, <u>underline</u> and <s>strike-through</s></u></i></b> HTML tags
    Unclosed but <b>supported tags are left in
    <ggg>Unsupported</ggg> HTML tags are left in, even if <hhh>not closed.
    SSA tags with {\i1} would open and close italicize {\i0}, but are stripped
    Multiple {\pos(142,120)\b1}SSA tags are stripped
   */
  Popcorn.parser( "parseSRT", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        i = 0,
        idx = 0,
        lines,
        time,
        text,
        endIdx,
        sub;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( /(?:\r\n|\r|\n)/gm );
    endIdx = lastNonEmptyLine( lines ) + 1;

    for( i=0; i < endIdx; i++ ) {
      sub = {};
      text = [];

      sub.id = parseInt( lines[i++], 10 );

      // Split on '-->' delimiter, trimming spaces as well
      time = lines[i++].split( /[\t ]*-->[\t ]*/ );

      sub.start = toSeconds( time[0] );

      // So as to trim positioning information from end
      idx = time[1].indexOf( " " );
      if ( idx !== -1) {
        time[1] = time[1].substr( 0, idx );
      }
      sub.end = toSeconds( time[1] );

      // Build single line of text from multi-line subtitle in file
      while ( i < endIdx && lines[i] ) {
        text.push( lines[i++] );
      }

      // Join into 1 line, SSA-style linebreaks
      // Strip out other SSA-style tags
      sub.text = text.join( "\\N" ).replace( /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, "" );
      
      // Escape HTML entities
      sub.text = sub.text.replace( /</g, "&lt;" ).replace( />/g, "&gt;" );

      // Unescape great than and less than when it makes a valid html tag of a supported style (font, b, u, s, i)
      // Modified version of regex from Phil Haack's blog: http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
      // Later modified by kev: http://kevin.deldycke.com/2007/03/ultimate-regular-expression-for-html-tag-parsing-with-php/
      sub.text = sub.text.replace( /&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)(\/?)&gt;/gi, "<$1$3$7>" );
      sub.text = sub.text.replace( /\\N/gi, "<br />" );
      subs.push( createTrack( "subtitle", sub ) );
    }

    retObj.data = subs;
    return retObj;
  });

  function createTrack( name, attributes ) {
    var track = {};
    track[name] = attributes;
    return track;
  }

  // Simple function to convert HH:MM:SS,MMM or HH:MM:SS.MMM to SS.MMM
  // Assume valid, returns 0 on error
  function toSeconds( t_in ) {
    var t = t_in.split( ':' );

    try {
      var s = t[2].split( ',' );

      // Just in case a . is decimal seperator
      if ( s.length === 1 ) {
        s = t[2].split( '.' );
      }

      return parseFloat( t[0], 10 ) * 3600 + parseFloat( t[1], 10 ) * 60 + parseFloat( s[0], 10 ) + parseFloat( s[1], 10 ) / 1000;
    } catch ( e ) {
      return 0;
    }
  }

  function lastNonEmptyLine( linesArray ) {
    var idx = linesArray.length - 1;

    while ( idx >= 0 && !linesArray[idx] ) {
      idx--;
    }

    return idx;
  }
})( Popcorn );
// PARSER: 0.3 SSA/ASS

(function ( Popcorn ) {
  /**
   * SSA/ASS popcorn parser plug-in
   * Parses subtitle files in the identical SSA and ASS formats.
   * Style information is ignored, and may be found in these
   * formats: (\N    \n    {\pos(400,570)}     {\kf89})
   * Out of the [Script Info], [V4 Styles], [Events], [Pictures],
   * and [Fonts] sections, only [Events] is processed.
   * Data parameter is given by Popcorn, will need a text.
   * Text is the file contents to be parsed
   *
   * @param {Object} data
   *
   * Example:
     [Script Info]
      Title: Testing subtitles for the SSA Format
      [V4 Styles]
      Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
      Style: Default,Arial,20,65535,65535,65535,-2147483640,-1,0,1,3,0,2,30,30,30,0,0
      [Events]
      Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
      Dialogue: 0,0:00:02.40,0:00:07.20,Default,,0000,0000,0000,,Senator, {\kf89}we're \Nmaking our final \napproach into Coruscant.
      Dialogue: 0,0:00:09.71,0:00:13.39,Default,,0000,0000,0000,,{\pos(400,570)}Very good, Lieutenant.
      Dialogue: 0,0:00:15.04,0:00:18.04,Default,,0000,0000,0000,,It's \Na \ntrap!
   *
   */

  // Register for SSA extensions
  Popcorn.parser( "parseSSA", function( data ) {
    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: [  ]
        },
        rNewLineFile = /(?:\r\n|\r|\n)/gm,
        subs = [  ],
        lines,
        headers,
        i = 0,
        len;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( rNewLineFile );
    len = lines.length;

    // Ignore non-textual info
    while ( i < len && lines[ i ] !== "[Events]" ) {
      i++;
    }

    headers = parseFieldHeaders( lines[ ++i ] );

    while ( ++i < len && lines[ i ] && lines[ i ][ 0 ] !== "[" ) {
      try {
        subs.push( createTrack( "subtitle", parseSub( lines[ i ], headers ) ) );
      } catch ( e ) {}
    }

    retObj.data = subs;
    return retObj;
  });

  function parseSub( line, headers ) {
    // Trim beginning 'Dialogue: ' and split on delim
    var fields = line.substr( 10 ).split( "," ),
        rAdvancedStyles = /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi,
        rNewLineSSA = /\\N/gi,
        sub;

    sub = {
      start: toSeconds( fields[ headers.start ] ),
      end: toSeconds( fields[ headers.end ] )
    };

    // Invalid time, skip
    if ( sub.start === -1 || sub.end === -1 ) {
      throw "Invalid time";
    }

    // Eliminate advanced styles and convert forced line breaks
    sub.text = getTextFromFields( fields, headers.text ).replace( rAdvancedStyles, "" ).replace( rNewLineSSA, "<br />" );

    return sub;
  }

  // h:mm:ss.cc (centisec) string to SS.mmm
  // Returns -1 if invalid
  function toSeconds( t_in ) {
    var t = t_in.split( ":" );

    // Not all there
    if ( t_in.length !== 10 || t.length < 3 ) {
      return -1;
    }

    return parseInt( t[ 0 ], 10 ) * 3600 + parseInt( t[ 1 ], 10 ) * 60 + parseFloat( t[ 2 ], 10 );
  }

  function getTextFromFields( fields, startIdx ) {
    var fieldLen = fields.length,
        text = [  ],
        i = startIdx;

    // There may be commas in the text which were split, append back together into one line
    for( ; i < fieldLen; i++ ) {
      text.push( fields[ i ] );
    }

    return text.join( "," );
  }

  function createTrack( name, attributes ) {
    var track = {};
    track[ name ] = attributes;
    return track;
  }

  function parseFieldHeaders( line ) {
    // Trim 'Format: ' off front, split on delim
    var fields = line.substr( 8 ).split( ", " ),
        result = {},
        len,
        i;

     //Find where in Dialogue string the start, end and text info is
    for ( i = 0, len = fields.length; i < len; i++ ) {
      if ( fields[ i ] === "Start" ) {
        result.start = i;
      } else if ( fields[ i ] === "End" ) {
        result.end = i;
      } else if ( fields[ i ] === "Text" ) {
        result.text = i;
      }
    }

    return result;
  }
})( Popcorn );
// PARSER: 1.0 TTML
(function ( Popcorn ) {
  /**
   * TTML popcorn parser plug-in
   * Parses subtitle files in the TTML format.
   * Times may be absolute to the timeline or relative
   *   Absolute times are ISO 8601 format (hh:mm:ss[.mmm])
   *   Relative times are a fraction followed by a unit metric (d.ddu)
   *     Relative times are relative to the time given on the parent node
   * Styling information is ignored
   * Data parameter is given by Popcorn, will need an xml.
   * Xml is the file contents to be processed
   *
   * @param {Object} data
   *
   * Example:
    <tt xmlns:tts="http://www.w3.org/2006/04/ttaf1#styling" xmlns="http://www.w3.org/2006/04/ttaf1">
      <body region="subtitleArea">
        <div>
          <p xml:id="subtitle1" begin="0.76s" end="3.45s">
            It seems a paradox, does it not,
          </p>
        </div>
      </body>
    </tt>
   */

  var rWhitespace = /^[\s]+|[\s]+$/gm,
      rLineBreak = /(?:\r\n|\r|\n)/gm;

  Popcorn.parser( "parseTTML", function( data ) {
    var returnData = {
          title: "",
          remote: "",
          data: []
        },
        node;

    // Null checks
    if ( !data.xml || !data.xml.documentElement ) {
      return returnData;
    }

    node = data.xml.documentElement.firstChild;

    if ( !node ) {
      return returnData;
    }

    // Find body tag
    while ( node.nodeName !== "body" ) {
      node = node.nextSibling;
    }

    if ( node ) {
      returnData.data = parseChildren( node, 0 );
    }

    return returnData;
  });

  // Parse the children of the given node
  function parseChildren( node, timeOffset, region ) {
    var currNode = node.firstChild,
        currRegion = getNodeRegion( node, region ),
        retVal = [],
        newOffset;

    while ( currNode ) {
      if ( currNode.nodeType === 1 ) {
        if ( currNode.nodeName === "p" ) {
          // p is a textual node, process contents as subtitle
          retVal.push( parseNode( currNode, timeOffset, currRegion ) );
        } else if ( currNode.nodeName === "div" ) {
          // div is container for subtitles, recurse
          newOffset = toSeconds( currNode.getAttribute( "begin" ) );

          if (newOffset < 0 ) {
            newOffset = timeOffset;
          }

          retVal.push.apply( retVal, parseChildren( currNode, newOffset, currRegion ) );
        }
      }

      currNode = currNode.nextSibling;
    }

    return retVal;
  }

  // Get the "region" attribute of a node, to know where to put the subtitles
  function getNodeRegion( node, defaultTo ) {
    var region = node.getAttribute( "region" );

    if ( region !== null ) {
      return region;
    } else {
      return defaultTo || "";
    }
  }

  // Parse a node for text content
  function parseNode( node, timeOffset, region ) {
    var sub = {};

    // Trim left and right whitespace from text and convert non-explicit line breaks
    sub.text = ( node.textContent || node.text ).replace( rWhitespace, "" ).replace( rLineBreak, "<br />" );
    sub.id = node.getAttribute( "xml:id" ) || node.getAttribute( "id" );
    sub.start = toSeconds ( node.getAttribute( "begin" ), timeOffset );
    sub.end = toSeconds( node.getAttribute( "end" ), timeOffset );
    sub.target = getNodeRegion( node, region );

    if ( sub.end < 0 ) {
      // No end given, infer duration if possible
      // Otherwise, give end as MAX_VALUE
      sub.end = toSeconds( node.getAttribute( "duration" ), 0 );

      if ( sub.end >= 0 ) {
        sub.end += sub.start;
      } else {
        sub.end = Number.MAX_VALUE;
      }
    }

    return { subtitle : sub };
  }

  // Convert time expression to SS.mmm
  // Expression may be absolute to timeline (hh:mm:ss.ms)
  //   or relative ( decimal followed by metric ) ex: 3.4s, 5.7m
  // Returns -1 if invalid
  function toSeconds( t_in, offset ) {
    var i;

    if ( !t_in ) {
      return -1;
    }

    try {
      return Popcorn.util.toSeconds( t_in );
    } catch ( e ) {
      i = getMetricIndex( t_in );
      return parseFloat( t_in.substring( 0, i ) ) * getMultipler( t_in.substring( i ) ) + ( offset || 0 );
    }
  }

  // In a time string such as 3.4ms, get the index of the first character (m) of the time metric (ms)
  function getMetricIndex( t_in ) {
    var i = t_in.length - 1;

    while ( i >= 0 && t_in[ i ] <= "9" && t_in[ i ] >= "0" ) {
      i--;
    }

    return i;
  }

  // Determine multiplier for metric relative to seconds
  function getMultipler( metric ) {
    return {
      "h" : 3600,
      "m" : 60,
      "s" : 1,
      "ms" : 0.001
    }[ metric ] || -1;
  }
})( Popcorn );
// PARSER: 0.1 TTXT

(function (Popcorn) {

  /**
   * TTXT popcorn parser plug-in 
   * Parses subtitle files in the TTXT format.
   * Style information is ignored.
   * Data parameter is given by Popcorn, will need an xml.
   * Xml is the file contents to be parsed as a DOM tree
   * 
   * @param {Object} data
   * 
   * Example:
     <TextSample sampleTime="00:00:00.000" text=""></TextSample>
   */
  Popcorn.parser( "parseTTXT", function( data ) {

    // declare needed variables
    var returnData = {
          title: "",
          remote: "",
          data: []
        };

    // Simple function to convert HH:MM:SS.MMM to SS.MMM
    // Assume valid, returns 0 on error
    var toSeconds = function(t_in) {
      var t = t_in.split(":");
      var time = 0;
      
      try {        
        return parseFloat(t[0], 10)*60*60 + parseFloat(t[1], 10)*60 + parseFloat(t[2], 10);
      } catch (e) { time = 0; }
      
      return time;
    };

    // creates an object of all atrributes keyed by name
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };

    // this is where things actually start
    var node = data.xml.lastChild.lastChild; // Last Child of TextStreamHeader
    var lastStart = Number.MAX_VALUE;
    var cmds = [];
    
    // Work backwards through DOM, processing TextSample nodes
    while (node) {
      if ( node.nodeType === 1 && node.nodeName === "TextSample") {
        var sub = {};
        sub.start = toSeconds(node.getAttribute('sampleTime'));
        sub.text = node.getAttribute('text');
      
        if (sub.text) { // Only process if text to display
          // Infer end time from prior element, ms accuracy
          sub.end = lastStart - 0.001;
          cmds.push( createTrack("subtitle", sub) );
        }
        lastStart = sub.start;
      }
      node = node.previousSibling;
    }
    
    returnData.data = cmds.reverse();

    return returnData;
  });

})( Popcorn );
// PARSER: 0.3 WebSRT/VTT

(function ( Popcorn ) {
  /**
   * WebVTT popcorn parser plug-in
   * Parses subtitle files in the WebVTT format.
   * Specification here: http://www.whatwg.org/specs/web-apps/current-work/webvtt.html
   * Styles which appear after timing information are presently ignored.
   * Inline styling tags follow HTML conventions and are left in for the browser to handle (or ignore if VTT-specific)
   * Data parameter is given by Popcorn, text property holds file contents.
   * Text is the file contents to be parsed
   *
   * @param {Object} data
   *
   * Example:
    00:32.500 --> 00:00:33.500 A:start S:50% D:vertical L:98%
    <v Neil DeGrass Tyson><i>Laughs</i>
   */
  Popcorn.parser( "parseVTT", function( data ) {

    // declare needed variables
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        subs = [],
        i = 0,
        len = 0,
        lines,
        text,
        sub,
        rNewLine = /(?:\r\n|\r|\n)/gm;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.text.split( rNewLine );
    len = lines.length;

    // Check for BOF token
    if ( len === 0 || lines[ 0 ] !== "WEBVTT" ) {
      return retObj;
    }

    i++;

    while ( i < len ) {
      text = [];

      try {
        i = skipWhitespace( lines, len, i );
        sub = parseCueHeader( lines[ i++ ] );

        // Build single line of text from multi-line subtitle in file
        while ( i < len && lines[ i ] ) {
          text.push( lines[ i++ ] );
        }

        // Join lines together to one and build subtitle text
        sub.text = text.join( "<br />" );
        subs.push( createTrack( "subtitle", sub ) );
      } catch ( e ) {
        i = skipNonWhitespace( lines, len, i );
      }
    }

    retObj.data = subs;
    return retObj;
  });

  // [HH:]MM:SS.mmm string to SS.mmm float
  // Throws exception if invalid
  function toSeconds ( t_in ) {
    var t = t_in.split( ":" ),
        l = t_in.length,
        time;

    // Invalid time string provided
    if ( l !== 12 && l !== 9 ) {
      throw "Bad cue";
    }

    l = t.length - 1;

    try {
      time = parseInt( t[ l-1 ], 10 ) * 60 + parseFloat( t[ l ], 10 );

      // Hours were given
      if ( l === 2 ) {
        time += parseInt( t[ 0 ], 10 ) * 3600;
      }
    } catch ( e ) {
      throw "Bad cue";
    }

    return time;
  }

  function createTrack( name, attributes ) {
    var track = {};
    track[ name ] = attributes;
    return track;
  }

  function parseCueHeader ( line ) {
    var lineSegments,
        args,
        sub = {},
        rToken = /-->/,
        rWhitespace = /[\t ]+/;

    if ( !line || line.indexOf( "-->" ) === -1 ) {
      throw "Bad cue";
    }

    lineSegments = line.replace( rToken, " --> " ).split( rWhitespace );

    if ( lineSegments.length < 2 ) {
      throw "Bad cue";
    }

    sub.id = line;
    sub.start = toSeconds( lineSegments[ 0 ] );
    sub.end = toSeconds( lineSegments[ 2 ] );

    return sub;
  }

  function skipWhitespace ( lines, len, i ) {
    while ( i < len && !lines[ i ] ) {
      i++;
    }

    return i;
  }

  function skipNonWhitespace ( lines, len, i ) {
    while ( i < len && lines[ i ] ) {
      i++;
    }

    return i;
  }
})( Popcorn );
// PARSER: 0.1 XML

(function (Popcorn) {

  /**
   *
   *
   */
  Popcorn.parser( "parseXML", "XML", function( data ) {

    // declare needed variables
    var returnData = {
          title: "",
          remote: "",
          data: []
        },
        manifestData = {};

    // Simple function to convert 0:05 to 0.5 in seconds
    // acceptable formats are HH:MM:SS:MM, MM:SS:MM, SS:MM, SS
    var toSeconds = function(time) {
      var t = time.split(":");
      if (t.length === 1) {
        return parseFloat(t[0], 10);
      } else if (t.length === 2) {
        return parseFloat(t[0], 10) + parseFloat(t[1] / 12, 10);
      } else if (t.length === 3) {
        return parseInt(t[0] * 60, 10) + parseFloat(t[1], 10) + parseFloat(t[2] / 12, 10);
      } else if (t.length === 4) {
        return parseInt(t[0] * 3600, 10) + parseInt(t[1] * 60, 10) + parseFloat(t[2], 10) + parseFloat(t[3] / 12, 10);
      }
    };

    // turns a node tree element into a straight up javascript object
    // also converts in and out to start and end
    // also links manifest data with ids
    var objectifyAttributes = function ( nodeAttributes ) {

      var returnObject = {};

      for ( var i = 0, nal = nodeAttributes.length; i < nal; i++ ) {

        var key  = nodeAttributes.item(i).nodeName,
            data = nodeAttributes.item(i).nodeValue,
            manifestItem = manifestData[ data ];

        // converts in into start
        if (key === "in") {
          returnObject.start = toSeconds( data );
        // converts out into end
        } else if ( key === "out" ){
          returnObject.end = toSeconds( data );
        // this is where ids in the manifest are linked
        } else if ( key === "resourceid" ) {
          for ( var item in manifestItem ) {
            if ( manifestItem.hasOwnProperty( item ) ) {
              if ( !returnObject[ item ] && item !== "id" ) {
                returnObject[ item ] = manifestItem[ item ];
              }
            }
          }
        // everything else
        } else {
          returnObject[key] = data;
        }

      }

      return returnObject;
    };

    // creates an object of all atrributes keyd by name
    var createTrack = function( name, attributes ) {
      var track = {};
      track[name] = attributes;
      return track;
    };

    // recursive function to process a node, or process the next child node
    var parseNode = function ( node, allAttributes, manifest ) {
      var attributes = {};
      Popcorn.extend( attributes, allAttributes, objectifyAttributes( node.attributes ), { text: node.textContent || node.text } );

      var childNodes = node.childNodes;

      // processes the node
      if ( childNodes.length < 1 || ( childNodes.length === 1 && childNodes[0].nodeType === 3 ) ) {

        if ( !manifest ) {
          returnData.data.push( createTrack( node.nodeName, attributes ) );
        } else {
          manifestData[attributes.id] = attributes;
        }

      // process the next child node
      } else {

        for ( var i = 0; i < childNodes.length; i++ ) {

          if ( childNodes[i].nodeType === 1 ) {
            parseNode( childNodes[i], attributes, manifest );
          }

        }
      }
    };

    // this is where things actually start
    var x = data.documentElement.childNodes;

    for ( var i = 0, xl = x.length; i < xl; i++ ) {

      if ( x[i].nodeType === 1 ) {

        // start the process of each main node type, manifest or timeline
        if ( x[i].nodeName === "manifest" ) {
          parseNode( x[i], {}, true );
        } else { // timeline
          parseNode( x[i], {}, false );
        }

      }
    }

    return returnData;
  });

})( Popcorn );
(function() {

  var scriptLoaded = false,
      loading = false;
  Popcorn.player( "soundcloud", {
    _canPlayType: function( nodeName, url ) {

      return (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(soundcloud)/).test( url ) && nodeName.toLowerCase() !== "video";
    },
    _setup: function( options ) {

      var media = this,
          container = document.createElement( "iframe" ),
          lastVolume = 1,
          currentTime = 0,
          paused = true,
          realPaused = true,
          widget,
          duration = 0,
          muted = false,
          playerQueue = Popcorn.player.playerQueue();

      options._container = container;
      media.style.visibility = "hidden";

      media.play = function() {

        paused = false;
        playerQueue.add(function() {

          if ( realPaused ) {

            widget && widget.play();
          } else {
            playerQueue.next();
          }
        });
      };

      media.pause = function() {

        paused = true;

        playerQueue.add(function() {

          if ( !realPaused ) {

            widget && widget.pause();
          } else {
            playerQueue.next();
          }
        });
      };

      // getter and setter for muted property, multiply volume by 100 as that is the scale soundcloud works on
      Object.defineProperties( media, {
        muted: {
          set: function( val ) {
            if ( val ) {
              widget && widget.getVolume(function( data ) {
                lastVolume = data / 100;
              });
              widget && widget.setVolume( 0 );
              muted = true;
            } else {
              widget && widget.setVolume( lastVolume * 100 );
              muted = false;
            }
            media.dispatchEvent( "volumechange" );
          },
          get: function() {
            return muted;
          }
        },
        volume: {
          set: function( val ) {
            widget && widget.setVolume( val * 100 );
            lastVolume = val ;
            media.dispatchEvent( "volumechange" );
          },
          get: function() {
            return muted ? 0 : lastVolume;
          }
        },
        currentTime: {
          set: function( val ) {
            currentTime = val;
            widget && widget.seekTo( val * 1000 );
            media.dispatchEvent( "seeked" );
            media.dispatchEvent( "timeupdate" );
          },
          get: function() {
            return currentTime;
          }
        },
        duration: {
          get: function() {
            return duration;
          }
        },
        paused: {
          get: function() {
            return paused;
          }
        }
      });
      // called when the SoundCloud api script has loaded
      function scriptReady() {
        scriptLoaded = true;

        SC.initialize({
          client_id: "PRaNFlda6Bhf5utPjUsptg"
        });

        SC.get( "/resolve", {
          url: media.src
        }, function( data ) {
          media.width = media.style.width ? "" + media.offsetWidth : "560";
          media.height = media.style.height ? "" + media.offsetHeight : "315";
          // TODO: There are quite a few options here that we should pass on to the user
          container.scrolling = "no";
          container.frameborder = "no";
          container.id = "soundcloud-" + Popcorn.guid();
          container.src = "http://w.soundcloud.com/player/?url=" + data.uri +
          "&show_artwork=false" +
          "&buying=false" +
          "&liking=false" +
          "&sharing=false";

          container.width = "100%";
          container.height = "100%";

          options.loadListener = function( e ) {
            options.widget = widget = SC.Widget( container.id );
            // setup all of our listeners
            widget.bind(SC.Widget.Events.FINISH, function() {
              media.pause();

              media.dispatchEvent( "ended" );
            });

            widget.bind(SC.Widget.Events.PLAY_PROGRESS, function( data ) {

              currentTime = data.currentPosition / 1000;
              media.dispatchEvent( "timeupdate" );
            });

            widget.bind(SC.Widget.Events.PLAY, function( data ) {

              paused = realPaused = false;

              media.dispatchEvent( "play" );
              media.dispatchEvent( "playing" );
              media.currentTime = currentTime;

              playerQueue.next();
            });

            widget.bind(SC.Widget.Events.PAUSE, function( data ) {

              paused = realPaused = true;
              media.dispatchEvent( "pause" );

              playerQueue.next();
            });
            widget.bind(SC.Widget.Events.READY, function( data ) {
              widget.getDuration(function( data ) {

                duration = data / 1000;

                media.style.visibility = "visible";
                media.dispatchEvent( "durationchange" );
                // update the readyState after we have the duration
                media.readyState = 4;
                media.dispatchEvent( "readystatechange" );
                media.dispatchEvent( "loadedmetadata" );
                media.dispatchEvent( "loadeddata" );
                media.dispatchEvent( "canplaythrough" );
                media.dispatchEvent( "load" );
                !media.paused && media.play();
              });
              widget.getVolume(function( data ) {
                lastVolume = data / 100;
              });
            });
          };

          container.addEventListener( "load", options.loadListener, false );
          media.appendChild( container );
        });
      }

      // load the SoundCloud API script if it doesn't exist
      function loadScript() {
        if ( !loading ) {
          loading = true;
          Popcorn.getScript( "http://w.soundcloud.com/player/api.js", function() {
            Popcorn.getScript( "http://connect.soundcloud.com/sdk.js", function() {
              scriptReady();
            });
          });
        } else {
          (function isReady() {
            setTimeout(function() {
              if ( !scriptLoaded ) {
                isReady();
              } else {
                scriptReady();
              }
            }, 100 );
          })();
        }
      }

      if ( !scriptLoaded ) {
        loadScript();
      } else {
        scriptReady();
      }
    },
    _teardown: function( options ) {
      var widget = options.widget,
          events = SC.Widget.Events,
          container = options._container,
          parentContainer = container.parentNode;

      options.destroyed = true;

      // if the widget never got setup, remove the containers load listener and return
      if ( !widget ) {
        container.removeEventListener( "load", options.loadEventListener, false );
        return;
      }

      // remove all bound soundcloud listeners
      for ( var prop in events ) {
        widget && widget.unbind( events[ prop ] );
      }
    }
  });
})();
(function() {

  // parseUri 1.2.2
  // http://blog.stevenlevithan.com/archives/parseuri
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License

  function parseUri (str) {
    var	o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });

    return uri;
  }

  parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
      name:   "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };

  function canPlayType( nodeName, url ) {
    return ( /player.vimeo.com\/video\/\d+/ ).test( url ) ||
           ( /vimeo.com\/\d+/ ).test( url );
  }

  Popcorn.player( "vimeo", {

    _canPlayType: canPlayType,
    _setup: function( options ) {

      var TIMEUPDATE_INTERVAL_MS  = 250,
          CURRENT_TIME_MONITOR_MS = 16,
          MediaErrorInterface = {
            MEDIA_ERR_ABORTED: 1,
            MEDIA_ERR_NETWORK: 2,
            MEDIA_ERR_DECODE: 3,
            MEDIA_ERR_SRC_NOT_SUPPORTED: 4
          },
          guid,
          media = this,
          commands = {
            q: [],
            queue: function queue( fn ) {
              this.q.push( fn );
              this.process();
            },
            process: function process() {
              if ( !vimeoReady ) {
                return;
              }

              while ( this.q.length ) {
                var fn = this.q.shift();
                fn();
              }
            }
          },
          currentTimeId,
          timeUpdateId,
          vimeoReady,
          vimeoContainer = document.createElement( "iframe" ),
          // Loosely based on HTMLMediaElement + HTMLVideoElement IDL
          impl = {
            // error state
            error: null,

            // network state
            src: media.src,
            NETWORK_EMPTY: 0,
            NETWORK_IDLE: 1,
            NETWORK_LOADING: 2,
            NETWORK_NO_SOURCE: 3,
            networkState: 0,

            // ready state
            HAVE_NOTHING: 0,
            HAVE_METADATA: 1,
            HAVE_CURRENT_DATA: 2,
            HAVE_FUTURE_DATA: 3,
            HAVE_ENOUGH_DATA: 4,
            readyState: 0,
            seeking: false,

            // playback state
            currentTime: 0,
            duration: NaN,
            paused: true,
            ended: false,
            autoplay: false,
            loop: false,

            // controls
            volume: 1,
            muted: false,

            // Video attributes
            width: 0,
            height: 0
          };

      var readOnlyAttrs = "error networkState readyState seeking duration paused ended";
      Popcorn.forEach( readOnlyAttrs.split(" "), function( value ) {
        Object.defineProperty( media, value, {
          get: function() {
            return impl[ value ];
          }
        });
      });

      Object.defineProperties( media, {
        "src": {
          get: function() {
            return impl.src;
          },
          set: function( value ) {
            // Is there any sort of logic that determines whether to load the video or not?
            impl.src = value;
            media.load();
          }
        },
        "currentTime": {
          get: function() {
            return impl.currentTime;
          },
          set: function( value ) {
            commands.queue(function() {
              sendMessage( "seekTo", value );
            });
            impl.seeking = true;
            media.dispatchEvent( "seeking" );
          }
        },
        "autoplay": {
          get: function() {
            return impl.autoplay;
          },
          set: function( value ) {
            impl.autoplay = !!value;
          }
        },
        "loop": {
          get: function() {
            return impl.loop;
          },
          set: function( value) {
            impl.loop = !!value;
            commands.queue(function() {
              sendMessage( "setLoop", loop );
            });
          }
        },
        "volume": {
          get: function() {
            return impl.volume;
          },
          set: function( value ) {
            impl.volume = value;
            commands.queue(function() {
              sendMessage( "setVolume", impl.muted ? 0 : impl.volume );
            });
            media.dispatchEvent( "volumechange" );
          }
        },
        "muted": {
          get: function() {
            return impl.muted;
          },
          set: function( value ) {
            impl.muted = !!value;
            commands.queue(function() {
              sendMessage( "setVolume", impl.muted ? 0 : impl.volume );
            });
            media.dispatchEvent( "volumechange" );
          }
        },
        "width": {
          get: function() {
            return vimeoContainer.width;
          },
          set: function( value ) {
            vimeoContainer.width = value;
          }
        },
        "height": {
          get: function() {
            return vimeoContainer.height;
          },
          set: function( value ) {
            vimeoContainer.height = value;
          }
        }
      });

      function sendMessage( method, params ) {
        var url = vimeoContainer.src.split( "?" )[ 0 ],
            data = JSON.stringify({
              method: method,
              value: params
            });

        if ( url.substr( 0, 2 ) === "//" ) {
          url = window.location.protocol + url;
        }

        // The iframe has been destroyed, it just doesn't know it
        if ( !vimeoContainer.contentWindow ) {
          media.unload();
          return;
        }

        vimeoContainer.contentWindow.postMessage( data, url );
      }

      var vimeoAPIMethods = {
        "getCurrentTime": function( data ) {
          impl.currentTime = parseFloat( data.value );
        },
        "getDuration": function( data ) {
          impl.duration = parseFloat( data.value );
          maybeReady();
        },
        "getVolume": function( data ) {
          impl.volume = parseFloat( data.value );
        }
      };

      var vimeoAPIEvents = {
        "ready": function( data ) {
          sendMessage( "addEventListener", "loadProgress" );
          sendMessage( "addEventListener", "playProgress" );
          sendMessage( "addEventListener", "play" );
          sendMessage( "addEventListener", "pause" );
          sendMessage( "addEventListener", "finish" );
          sendMessage( "addEventListener", "seek" );
          sendMessage( "getDuration" );
          vimeoReady = true;
          commands.process();
          media.dispatchEvent( "loadstart" );
        },
        "loadProgress": function( data ) {
          media.dispatchEvent( "progress" );
          // loadProgress has a more accurate duration than getDuration
          impl.duration = parseFloat( data.data.duration );
        },
        "playProgress": function( data ) {
          impl.currentTime = parseFloat( data.data.seconds );
        },
        "play": function( data ) {
          // Vimeo plays video if seeking from an unloaded state
          if ( impl.seeking ) {
            impl.seeking = false;
            media.dispatchEvent( "seeked" );
          }
          impl.paused = false;
          impl.ended = false;
          startUpdateLoops();
          media.dispatchEvent( "play" );
        },
        "pause": function( data ) {
          impl.paused = true;
          stopUpdateLoops();
          media.dispatchEvent( "pause" );
        },
        "finish": function( data ) {
          impl.ended = true;
          stopUpdateLoops();
          media.dispatchEvent( "ended" );
        },
        "seek": function( data ) {
          impl.currentTime = parseFloat( data.data.seconds );
          impl.seeking = false;
          impl.ended = false;
          media.dispatchEvent( "timeupdate" );
          media.dispatchEvent( "seeked" );
        }
      };

      function messageListener( event ) {
        if ( event.origin !== "http://player.vimeo.com" ) {
          return;
        }

        var data;
        try {
          data = JSON.parse( event.data );
        } catch ( ex ) {
          console.warn( ex );
        }

        if ( data.player_id != guid ) {
          return;
        }

        // Methods
        if ( data.method && vimeoAPIMethods[ data.method ] ) {
          vimeoAPIMethods[ data.method ]( data );
        }

        // Events
        if ( data.event && vimeoAPIEvents[ data.event ] ) {
          vimeoAPIEvents[ data.event ]( data );
        }
      }

      media.load = function() {
        vimeoReady = false;
        guid = Popcorn.guid();

        var src = parseUri( impl.src ),
            combinedOptions = {},
            optionsArray = [],
            vimeoAPIOptions = {
              api: 1,
              player_id: guid
            };

        if ( !canPlayType( media.nodeName, src.source ) ) {
          setErrorAttr( impl.MEDIA_ERR_SRC_NOT_SUPPORTED );
          return;
        }

        // Add Popcorn ctor options, url options, then the Vimeo API options
        Popcorn.extend( combinedOptions, options );
        Popcorn.extend( combinedOptions, src.queryKey );
        Popcorn.extend( combinedOptions, vimeoAPIOptions );

        // Create the base vimeo player string. It will always have query string options
        src = "http://player.vimeo.com/video/" + ( /\d+$/ ).exec( src.path ) + "?";

        for ( var key in combinedOptions ) {
          if ( combinedOptions.hasOwnProperty( key ) ) {
            optionsArray.push( encodeURIComponent( key ) + "=" + encodeURIComponent( combinedOptions[ key ] ) );
          }
        }
        src += optionsArray.join( "&" );

        impl.loop = !!src.match( /loop=1/ );
        impl.autoplay = !!src.match( /autoplay=1/ );

        vimeoContainer.width = media.style.width ? media.style.width : 500;
        vimeoContainer.height = media.style.height ? media.style.height : 281;
        vimeoContainer.frameBorder = 0;
        vimeoContainer.webkitAllowFullScreen = true;
        vimeoContainer.mozAllowFullScreen = true;
        vimeoContainer.allowFullScreen = true;
        vimeoContainer.src = src;
        media.appendChild( vimeoContainer );
      };

      function setErrorAttr( value ) {
        impl.error = {};
        Popcorn.extend( impl.error, MediaErrorInterface );
        impl.error.code = value;
        media.dispatchEvent( "error" );
      }

      function maybeReady() {
        if ( !isNaN( impl.duration ) ) {
          impl.readyState = 4;
          media.dispatchEvent( "durationchange" );
          media.dispatchEvent( "loadedmetadata" );
          media.dispatchEvent( "loadeddata" );
          media.dispatchEvent( "canplay" );
          media.dispatchEvent( "canplaythrough" );
        }
      }

      function startUpdateLoops() {
        if ( !timeUpdateId ) {
          timeUpdateId = setInterval(function() {
            media.dispatchEvent( "timeupdate" );
          }, TIMEUPDATE_INTERVAL_MS );
        }

        if ( !currentTimeId ) {
          currentTimeId = setInterval(function() {
            sendMessage( "getCurrentTime" );
          }, CURRENT_TIME_MONITOR_MS );
        }
      }

      function stopUpdateLoops() {
        if ( timeUpdateId ) {
          clearInterval( timeUpdateId );
          timeUpdateId = 0;
        }

        if ( currentTimeId ) {
          clearInterval( currentTimeId );
          currentTimeId = 0;
        }
      }

      media.unload = function() {
        stopUpdateLoops();
        window.removeEventListener( "message", messageListener, false );
      };

      media.play = function() {
        commands.queue(function() {
          sendMessage( "play" );
        });
      };

      media.pause = function() {
        commands.queue(function() {
          sendMessage( "pause" );
        });
      };

      // Start the load process now, players behave like `preload="metadata"` is set
      // Do it asynchronously so that users can attach event listeners
      setTimeout(function() {
        window.addEventListener( "message", messageListener, false );
        media.load();
      }, 0 );
    },
    _teardown: function( options ) {
      // If the baseplayer doesn't call _setup
      if ( this.unload ) {
        this.unload();
      }
    }
  });
})();
(function( window, Popcorn ) {
  // A global callback for youtube... that makes me angry
  window.onYouTubePlayerAPIReady = function() {

    onYouTubePlayerAPIReady.ready = true;
    for ( var i = 0; i < onYouTubePlayerAPIReady.waiting.length; i++ ) {
      onYouTubePlayerAPIReady.waiting[ i ]();
    }
  };

  // existing youtube references can break us.
  // remove it and use the one we can trust.
  if ( window.YT ) {
    window.quarantineYT = window.YT;
    window.YT = null;
  }

  onYouTubePlayerAPIReady.waiting = [];

  var _loading = false;

  Popcorn.player( "youtube", {
    _canPlayType: function( nodeName, url ) {

      return typeof url === "string" && (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu)/).test( url ) && nodeName.toLowerCase() !== "video";
    },
    _setup: function( options ) {
      if ( !window.YT && !_loading ) {
        _loading = true;
        Popcorn.getScript( "//youtube.com/player_api" );
      }

      var media = this,
          autoPlay = false,
          container = document.createElement( "div" ),
          currentTime = 0,
          paused = true,
          seekTime = 0,
          firstGo = true,
          seeking = false,
          fragmentStart = 0,

          // state code for volume changed polling
          lastMuted = false,
          lastVolume = 100,
          playerQueue = Popcorn.player.playerQueue();

      var createProperties = function() {

        Popcorn.player.defineProperty( media, "currentTime", {
          set: function( val ) {

            if ( options.destroyed ) {
              return;
            }

            seeking = true;
            // make sure val is a number
            currentTime = Math.round( +val * 100 ) / 100;
          },
          get: function() {

            return currentTime;
          }
        });

        Popcorn.player.defineProperty( media, "paused", {
          get: function() {

            return paused;
          }
        });

        Popcorn.player.defineProperty( media, "muted", {
          set: function( val ) {

            if ( options.destroyed ) {

              return val;
            }

            if ( options.youtubeObject.isMuted() !== val ) {

              if ( val ) {

                options.youtubeObject.mute();
              } else {

                options.youtubeObject.unMute();
              }

              lastMuted = options.youtubeObject.isMuted();
              media.dispatchEvent( "volumechange" );
            }

            return options.youtubeObject.isMuted();
          },
          get: function() {

            if ( options.destroyed ) {

              return 0;
            }

            return options.youtubeObject.isMuted();
          }
        });

        Popcorn.player.defineProperty( media, "volume", {
          set: function( val ) {

            if ( options.destroyed ) {

              return val;
            }

            if ( options.youtubeObject.getVolume() / 100 !== val ) {

              options.youtubeObject.setVolume( val * 100 );
              lastVolume = options.youtubeObject.getVolume();
              media.dispatchEvent( "volumechange" );
            }

            return options.youtubeObject.getVolume() / 100;
          },
          get: function() {

            if ( options.destroyed ) {

              return 0;
            }

            return options.youtubeObject.getVolume() / 100;
          }
        });

        media.play = function() {

          if ( options.destroyed ) {

            return;
          }

          paused = false;
          playerQueue.add(function() {

            if ( options.youtubeObject.getPlayerState() !== 1 ) {

              seeking = false;
              options.youtubeObject.playVideo();
            } else {
              playerQueue.next();
            }
          });
        };

        media.pause = function() {

          if ( options.destroyed ) {

            return;
          }

          paused = true;
          playerQueue.add(function() {

            if ( options.youtubeObject.getPlayerState() !== 2 ) {

              options.youtubeObject.pauseVideo();
            } else {
              playerQueue.next();
            }
          });
        };
      };

      container.id = media.id + Popcorn.guid();
      options._container = container;
      media.appendChild( container );

      var youtubeInit = function() {

        var src, query, params, playerVars, queryStringItem, firstPlay = true;

        var timeUpdate = function() {

          if ( options.destroyed ) {
            return;
          }

          if ( !seeking ) {
            currentTime = options.youtubeObject.getCurrentTime();
            media.dispatchEvent( "timeupdate" );
          } else if ( currentTime === options.youtubeObject.getCurrentTime() ) {

            seeking = false;
            media.dispatchEvent( "seeked" );
            media.dispatchEvent( "timeupdate" );
          } else {

            // keep trying the seek until it is right.
            options.youtubeObject.seekTo( currentTime );
          }
          setTimeout( timeUpdate, 250 );
        };

        // delay is in seconds
        var fetchDuration = function( delay ) {
          var ytDuration = options.youtubeObject.getDuration();

          if ( isNaN( ytDuration ) || ytDuration === 0 ) {
            setTimeout( function() {
              fetchDuration( delay * 2 );
            }, delay*1000 );
          } else {
            // set duration and dispatch ready events
            media.duration = ytDuration;
            media.dispatchEvent( "durationchange" );
            
            media.dispatchEvent( "loadedmetadata" );
            media.dispatchEvent( "loadeddata" );
            
            media.readyState = 4;

            timeUpdate();
            media.dispatchEvent( "canplaythrough" );
          }
        };

        options.controls = +options.controls === 0 || +options.controls === 1 ? options.controls : 1;
        options.annotations = +options.annotations === 1 || +options.annotations === 3 ? options.annotations : 1;

        src = /^.*(?:\/|v=)(.{11})/.exec( media.src )[ 1 ];

        query = ( media.src.split( "?" )[ 1 ] || "" )
                           .replace( /v=.{11}/, "" );
        query = query.replace( /&t=(?:(\d+)m)?(?:(\d+)s)?/, function( all, minutes, seconds ) {

          // Make sure we have real zeros
          minutes = minutes | 0; // bit-wise OR
          seconds = seconds | 0; // bit-wise OR

          fragmentStart = ( +seconds + ( minutes * 60 ) );
          return "";
        });
        query = query.replace( /&start=(\d+)?/, function( all, seconds ) {

          // Make sure we have real zeros
          seconds = seconds | 0; // bit-wise OR

          fragmentStart = seconds;
          return "";
        });

        autoPlay = ( /autoplay=1/.test( query ) );

        params = query.split( /[\&\?]/g );
        playerVars = { wmode: "transparent" };

        for( var i = 0; i < params.length; i++ ) {
          queryStringItem = params[ i ].split( "=" );
          playerVars[ queryStringItem[ 0 ] ] = queryStringItem[ 1 ];
        }
        
        options.youtubeObject = new YT.Player( container.id, {
          height: "100%",
          width: "100%",
          wmode: "transparent",
          playerVars: playerVars,
          videoId: src,
          events: {
            "onReady": function(){

              // pulling initial volume states form baseplayer
              lastVolume = media.volume;
              lastMuted = media.muted;

              volumeupdate();

              paused = media.paused;
              createProperties();
              options.youtubeObject.playVideo();

              media.currentTime = fragmentStart;
              // wait to dispatch ready events until we get a duration
            },
            "onStateChange": function( state ){

              if ( options.destroyed || state.data === -1 ) {
                return;
              }

              // state.data === 2 is for pause events
              // state.data === 1 is for play events
              if ( state.data === 2 ) {
                paused = true;
                media.dispatchEvent( "pause" );
                playerQueue.next();
              } else if ( state.data === 1 && !firstPlay ) {
                paused = false;
                media.dispatchEvent( "play" );
                media.dispatchEvent( "playing" );
                playerQueue.next();
              } else if ( state.data === 0 ) {
                media.dispatchEvent( "ended" );
              } else if ( state.data === 1 && firstPlay ) {
                firstPlay = false;

                // pulling initial paused state from autoplay or the baseplayer
                // also need to explicitly set to paused otherwise.
                if ( autoPlay || !media.paused ) {
                  paused = false;
                }

                if ( paused ) {
                  options.youtubeObject.pauseVideo();
                }
                
                fetchDuration( 0.025 );
              }
            },
            "onError": function( error ) {

              if ( [ 2, 100, 101, 150 ].indexOf( error.data ) !== -1 ) {
                media.error = {
                  customCode: error.data
                };
                media.dispatchEvent( "error" );
              }
            }
          }
        });

        var volumeupdate = function() {

          if ( options.destroyed ) {

            return;
          }

          if ( lastMuted !== options.youtubeObject.isMuted() ) {

            lastMuted = options.youtubeObject.isMuted();
            media.dispatchEvent( "volumechange" );
          }

          if ( lastVolume !== options.youtubeObject.getVolume() ) {

            lastVolume = options.youtubeObject.getVolume();
            media.dispatchEvent( "volumechange" );
          }

          setTimeout( volumeupdate, 250 );
        };
      };

      if ( onYouTubePlayerAPIReady.ready ) {

        youtubeInit();
      } else {

        onYouTubePlayerAPIReady.waiting.push( youtubeInit );
      }
    },
    _teardown: function( options ) {

      options.destroyed = true;

      var youtubeObject = options.youtubeObject;
      if( youtubeObject ){
        youtubeObject.stopVideo();
        youtubeObject.clearVideo && youtubeObject.clearVideo();
      }

      this.removeChild( document.getElementById( options._container.id ) );
    }
  });
}( window, Popcorn ));
// EFFECT: applyclass

(function (Popcorn) {

  /**
   * apply css class to jquery selector
   * selector is relative to plugin target's id
   * so .overlay is actually jQuery( "#target .overlay")
   *
   * @param {Object} options
   * 
   * Example:
     var p = Popcorn('#video')
        .footnote({
          start: 5, // seconds
          end: 15, // seconds
          text: 'This video made exclusively for drumbeat.org',
          target: 'footnotediv',
          effect: 'applyclass',
          applyclass: 'selector: class'
        })
   *
   */

  var toggleClass = function( event, options ) {

    var idx = 0, len = 0, elements;

    Popcorn.forEach( options.classes, function( key, val ) {

      elements = [];

      if ( key === "parent" ) {

        elements[ 0 ] = document.querySelectorAll("#" + options.target )[ 0 ].parentNode;
      } else {

        elements = document.querySelectorAll("#" + options.target + " " + key );
      }

      for ( idx = 0, len = elements.length; idx < len; idx++ ) {

        elements[ idx ].classList.toggle( val );
      }
    });
  };

  Popcorn.compose( "applyclass", {
    
    manifest: {
      about: {
        name: "Popcorn applyclass Effect",
        version: "0.1",
        author: "@scottdowne",
        website: "scottdowne.wordpress.com"
      },
      options: {}
    },
    _setup: function( options ) {

      options.classes = {};
      options.applyclass = options.applyclass || "";

      var classes = options.applyclass.replace( /\s/g, "" ).split( "," ),
          item = [],
          idx = 0, len = classes.length;

      for ( ; idx < len; idx++ ) {

        item = classes[ idx ].split( ":" );

        if ( item[ 0 ] ) {
          options.classes[ item[ 0 ] ] = item[ 1 ] || "";
        }
      }
    },
    start: toggleClass,
    end: toggleClass
  });
})( Popcorn );
