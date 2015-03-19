/*!
 * jQuery Message Queuing - v1.0 - 1/5/2010
 * http://benalman.com/projects/jquery-message-queuing-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery Message Queuing: Get all your JavaScript ducks in a row
//
// *Version: 1.0, Last updated: 1/5/2010*
// 
// Project Home - http://benalman.com/projects/jquery-message-queuing-plugin/
// GitHub       - http://github.com/cowboy/jquery-message-queuing/
// Source       - http://github.com/cowboy/jquery-message-queuing/raw/master/jquery.ba-jqmq.js
// (Minified)   - http://github.com/cowboy/jquery-message-queuing/raw/master/jquery.ba-jqmq.min.js (1.2kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Serial AJAX - http://benalman.com/code/projects/jquery-message-queuing/examples/ajax/
// Throttling  - http://benalman.com/code/projects/jquery-message-queuing/examples/throttling/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4a2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-4, Chrome, Opera 9.6-10.
// Unit Tests      - http://benalman.com/code/projects/jquery-message-queuing/unit/
// 
// About: Release History
// 
// 1.0 - (1/5/2010) Initial release

(function($,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Queue defaults.
  var defaults = {
    delay: 100,
    batch: 1,
    /*
    callback: null,
    complete: null,
    paused: false,
    */
    queue: []
  };
  
  // Method: jQuery.jqmq
  // 
  // Create a new queue.
  // 
  // Usage:
  // 
  // > var queueObj = jQuery.jqmq( options );
  // 
  // Arguments:
  // 
  //  options - (Object) An object containing options specific to this queue.
  // 
  // Options:
  // 
  //   delay - (Number) Time in milliseconds between each callback execution. If
  //     delay is -1, queue will wait for a <queueObj.next> call instead of
  //     auto-executing. Defaults to 100.
  //   batch - (Number) Number of queue items to process at a time. If less than
  //     this number of items remain in the queue, the remainder will be
  //     processed. Defaults to 1.
  //   queue - (Array) Populate the queue initially with these items. Defaults
  //     to an empty initial queue.
  //   callback - (Function) Called for each queue item or batch of items, every
  //     delay milliseconds. This function is passed a single argument, which is
  //     the single queue item if batch is 1, or an array of queue items if
  //     batch is > 1. If callback returns true, the queue item(s) will be re-
  //     added back onto the front of the queue for the next callback execution
  //     to retry. Inside this function, `this` refers to the queueObj object.
  //   complete - (Function) Called whenever there are no longer any queue items
  //     to process. After completion, if more queue items are added and the
  //     queue completes again, this function will be called again. Inside this
  //     function, `this` refers to the queueObj object.
  //   paused - (Boolean) If true, initialize this queue in a paused state.
  //     Defaults to false.
  // 
  // Returns:
  // 
  //  (Object) a reference to the jqmq queue object.
  
  $.jqmq = function( opts ) {
    
    // The queue object to be returned.
    var self = {},
      
      // Initialize queue with passed options.
      options = $.extend( true, {}, defaults, opts ),
      
      // The actual queue.
      queue = options.queue,
      
      paused = options.paused,
      recent = [],
      timeout_id,
      cleared,
      
      // Method references.
      addEach,
      size,
      start;
    
    // Method: queueObj.add
    // 
    // Add a single item onto the queue. If you want to add multiple items onto
    // the queue individually, use <queueObj.addEach>. If the queue was empty and
    // not paused, processing will resume immediately.
    // 
    // Usage:
    // 
    // > queueObj.add( item [, priority ] );
    // 
    // Arguments:
    // 
    //  item - (Anything) A single item to add to the queue.
    //  priority - (Boolean) If true, the item is added to the front of the
    //    queue, otherwise the item is added to the end of the queue. Defaults
    //    to false.
    // 
    // Returns:
    // 
    //  (Number) The length of the queue, after the item has been added.
    
    self.add = function( item, priority ) {
      return addEach( [ item ], priority );
    };
    
    // Method: queueObj.addEach
    // 
    // Add multiple items onto the queue, individually. If you want to add a
    // single item onto the queue, use <queueObj.add>. If the queue was empty and
    // not paused, processing will resume immediately.
    // 
    // Usage:
    // 
    // > queueObj.addEach( items [, priority ] );
    // 
    // Arguments:
    // 
    //  items - (Array) An array of items to add to the queue.
    //  priority - (Boolean) If true, the items are added to the front of the
    //    queue, otherwise the items are added to the end of the queue. Defaults
    //    to false.
    // 
    // Returns:
    // 
    //  (Number) The length of the queue, after the items have been added.
    
    self.addEach = addEach = function( items, priority ) {
      if ( items ) {
        // Unset "cleared" status.
        cleared = false;
        
        // Push all items, individually, onto the queue. If priority is true, send
        // them to the beginning, otherwise, send them to the end.
        queue = priority
          ? items.concat( queue )
          : queue.concat( items );
        
        // If queue isn't explicitly paused, restart it.
        paused || start();
      }
      
      return size();
    };
    
    // Method: queueObj.start
    // 
    // Start a currently paused queue. If an empty queue is started, it will
    // automatically start processing items as soon as they are added.
    // 
    // Usage:
    // 
    // > queueObj.start();
    // 
    // Returns:
    // 
    //  Nothing.
    
    self.start = start = function() {
      // Flag queue as un-paused.
      paused = false;
      
      if ( size() && !timeout_id && !recent.length ) {
        
        (function loopy(){
          var delay = options.delay,
            batch = options.batch,
            complete = options.complete,
            callback = options.callback;
          
          // Clear timeout_id.
          stop();
          
          // If queue is empty, call the "complete" method if it exists and quit.
          if ( !size() ) {
            cleared = true;
            complete && complete.call( self );
            return;
          }
          
          // Queue has items, so shift off the first `batch` items.
          recent = queue.splice( 0, batch );
          
          // If "callback" method returns true, unshift the queue items for
          // another attempt.
          if ( callback && callback.call( self, batch === 1 ? recent[0] : recent ) === true ) {
            queue = recent.concat( queue );
            recent = [];
          }
          
          // Repeatedly loop if the delay is a number >= 0, otherwise wait for a
          // $.jqmqNext() call.
          if ( typeof delay === 'number' && delay >= 0 ) {
            recent = [];
            timeout_id = setTimeout( loopy, delay );
          }
        })();
      }
    };
    
    // Method: queueObj.next
    // 
    // Intended to be called from within the <jQuery.jqmq> callback, this method
    // will continue a queue with a delay of -1. This is most useful for queues
    // of asynchronous-but-serial actions, like AJAX requests that must execute
    // in order, but not overlap.
    // 
    // Usage:
    // 
    // > queueObj.next( [ retry ] );
    // 
    // Arguments:
    // 
    //  retry - (Boolean) If true, the queue item(s) will be re-added back to
    //    the front of the queue to be retried on the next queue execution.
    // 
    // Returns:
    // 
    //  Nothing.
    
    self.next = function( retry ) {
      var complete = options.complete;
      
      // If retry is true, unshift the most recent items for another attempt.
      if ( retry ) {
        queue = recent.concat( queue );
      }
      
      // Reset the recent items list.
      recent = [];
      
      // If queue is empty (but not from calling .clear), call the "complete"
      // method if it exists, otherwise continue processing the queue (if not
      // paused).
      if ( size() ) {
        paused || start();
      } else if ( !cleared ) {
        cleared = true;
        complete && complete.call( self );
      }
    };
    
    // Method: queueObj.clear
    // 
    // Clear a queue completely. The paused/started status of the queue is
    // unchanged.
    // 
    // Usage:
    // 
    // > queueObj.clear();
    // 
    // Returns:
    // 
    //  (Array) The previous queue contents.
    
    self.clear = function() {
      var result = queue;
      
      // Stop the queue if it is running.
      stop();
      
      // Clear the queue.
      queue = [];
      cleared = true;
      
      // Reset the recent items list.
      recent = [];
      
      // Return the previous queue, in case it's needed for some reason.
      return result;
    };
    
    // Method: queueObj.pause
    // 
    // Pause a currently running queue. A paused but empty queue will need to be
    // manually restarted with <queueObj.start> even after new items are added.
    // 
    // Usage:
    // 
    // > queueObj.pause();
    // 
    // Returns:
    // 
    //  Nothing.
    
    self.pause = function() {
      // Stop the queue if it is running.
      stop();
      
      // Flag it as paused.
      paused = true;
    };
    
    // Method: queueObj.update
    // 
    // Update an existing queue's options.
    // 
    // Usage:
    // 
    // > queueObj.update( options );
    // 
    // Arguments:
    // 
    //  options - (Object) An object containing options specific to this queue.
    // 
    // Options:
    // 
    //   The delay, batch, callback and complete options from <jQuery.jqmq> can
    //   be updated. The queue and paused state can be changed using the other
    //   queueObj methods.
    // 
    // Returns:
    // 
    //  Nothing.
    
    self.update = function( opts ) {
      $.extend( options, opts );
    };
    
    // Method: queueObj.size
    // 
    // Get the current queue length.
    // 
    // Usage:
    // 
    // > queueObj.size();
    // 
    // Returns:
    // 
    //  (Number) The length of the queue.
    
    self.size = size = function() {
      return queue.length;
    };
    
    // Method: queueObj.indexOf
    // 
    // Get the current index in the queue of the passed item.
    // 
    // Usage:
    // 
    // > queueObj.indexOf( item );
    // 
    // Arguments:
    // 
    //  item - (Anything) An item to test the index of.
    // 
    // Returns:
    // 
    //  (Number) The index of the passed item in the queue. Returns -1 if not
    //  found.
    
    self.indexOf = function( item ) {
      return $.inArray( item, queue );
    };
    
    // Stop a running queue, optionally flagging it as paused.
    function stop() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // If queue isn't explicitly paused, start it.
    paused || start();
    
    return self;
  };
  
  // Method: jQuery.fn.jqmqAdd
  // 
  // Add a jQuery collection of elements onto the queue. If you want to add each
  // selected element onto the queue individually, use <jQuery.fn.jqmqAddEach>. If
  // the queue was empty and not paused, processing will resume immediately.
  // 
  // Usage:
  // 
  // > jQuery('selector').jqmqAdd( queueObj [, priority ] );
  // 
  // Arguments:
  // 
  //  queueObj - (Object) A valid jqmq object, returned from <jQuery.jqmq>.
  //  priority - (Boolean) If true, the item is added to the front of the
  //    queue, otherwise the item is added to the end of the queue. Defaults
  //    to false.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  $.fn.jqmqAdd = function( queueObj, priority ) {
    queueObj.add( this.get(), priority );
    return this;
  };
  
  // Method: jQuery.fn.jqmqAddEach
  // 
  // Add each selected element from a jQuery collection onto the queue,
  // individually. If you want to add the entire jQuery collection of elements
  // onto the queue as a single item, use <jQuery.fn.jqmqAdd>. If the queue was
  // empty and not paused, processing will resume immediately.
  // 
  // Usage:
  // 
  // > jQuery('selector').jqmqAddEach( queueObj [, priority ] );
  // 
  // Arguments:
  // 
  //  queueObj - (Object) A valid jqmq object, returned from <jQuery.jqmq>.
  //  priority - (Boolean) If true, the items are added to the front of the
  //    queue, otherwise the items are added to the end of the queue. Defaults
  //    to false.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  $.fn.jqmqAddEach = function( queueObj, priority ) {
    queueObj.addEach( this.get(), priority );
    return this;
  };
  
})(jQuery);
