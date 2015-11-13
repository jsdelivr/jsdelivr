/**
 * Inspired by David Walsh's simple PubSub code
 * at http://davidwalsh.name/pubsub-javascript.
 */
/**
 * @class BUS
 * The bus acts as a pub/sub messaging system (as opposed to a queue). It is primarily
 * designed for asynchronous communication between javascript objects, but can also be
 * bound to DOM events.
 *
 * The most common use looks like:
 * ```js
 *   var subscriber = BUS.subscribe('test', function(){
 *     console.log('test handled');
 *   });
 *
 *   BUS.subscribeOnce('test', function(){
 *     console.log('RESPOND ONCE!');
 *   })
 *
 *   BUS.publish('test'); // Outputs "test handled" and "RESPOND ONCE".
 *
 *   BUS.publish('test'); // Outputs "test handled" only.
 *
 *   subscriber.unsubscribe(); // Removes the listener
 *
 *   BUS.publish('test'); // Outputs nothing since the subscription was removed.
 * ```
 * There are a few aliases for ease of use, including `on() --> subscribe()`,
 * `once() --> subscribeOnce()`, and `emit() --> publish()`.
 *
 * It is also possible to use a wildcard in a subscription.
 *
 * ```js
 *   var subscriber = BUS.subscribe('test.*', function(){
 *     console.log('test handled');
 *   });
 *   var subscriber = BUS.subscribe('test.create', function(){
 *     console.log('test create handled');
 *   });
 *
 *   BUS.publish('test.create'); // Outputs "test handled" and "test create handled"
 *
 *   BUS.publish('test.delete'); // Outputs "test handled"
 * ```
 * @singleton
 */
var BUS = (function(){

  var topics = [], oneoff = [], bubble = [];
  var obj = {};

  var _getTopic = function(arr,topic){
    var t = arr.filter(function(t){
      return topic.toLowerCase() === t[0].toLowerCase();
    });
    if (t.length === 0) { return null; }
    if (t.length > 1) { console.warn('NGN Event Bus: '+t[0][0]+' exists more than once.'); }
    return t[0].filter(function(el,i){return i !== 0;});
  };

  var getTopic = function(topic){
    return _getTopic.apply(this,[topics,topic]);
  };

  var getOneOffTopic = function(topic){
    return _getTopic.apply(this,[oneoff,topic]);
  };

  var getBubble = function(topic){
    return _getTopic.apply(this,[bubble,topic]);
  };

  Object.defineProperties(obj,{

    /**
     * @method subscribe
     * Subscribe to an event.
     * @param {string} event
     * The event name.
     * @param {Function} listener
     * The callback for handling an event.
     * @param {any} [listener.data=null]
     * A data payload supplied by the event.
     */
    subscribe: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: function(topic, listener) {

        // Validate input
        if (topic === null || topic === undefined || listener === null || listener === undefined){
          throw new Error('subscribe() requires a topic and listener function as arguments.');
        }

        // Create the topic if not yet created
        var t = getTopic(topic);
        t !== null && t.unshift(topic);
        t === null && (t = [topic]) && topics.push(t);
        // var x = (new Error()).lineNumber;
        // Add the listener to queue
        var index = t.push(listener);

        // Update the topic with the new queue
        topics[topics.map(function(row){return row[0]}).indexOf(topic)] = t;

        // Provide handle back for removal of topic
        return {
          unsubscribe: function() {
            t = t.splice(index,1);
            if (t.length === 0){
              topics.splice(topics.map(function(row){return row[0]}).indexOf(topic),1);
            } else {
              topics[topics.map(function(row){return row[0]}).indexOf(topic)] = t;
            }
          }
        };
      }
    },

    /**
     * @method subscribeOnce
     * Subscribe to an event. The handler/listener will only be executed the first time
     * the event is detected. The handler/listener is removed after it is executed.
     * @type {Object}
     */
    subscribeOnce: {
      enumerable:true,
      configurable: false,
      writable: false,
      value: function(topic, listener) {

        // Validate input
        if (topic === null || topic === undefined || listener === null || listener === undefined){
          throw new Error('subscribeOnce() requires a topic and listener function as arguments.');
        }

        // Create the topic if not yet created
        var t = getOneOffTopic(topic);
        t !== null && t.unshift(topic);
        t === null && (t = [topic]) && oneoff.push(t);

        // Add the listener
        t.push(listener);

        // Update the topic with the new queue
        oneoff[oneoff.map(function(row){return row[0]}).indexOf(topic)] = t;

      }
    },

    /**
     * @method on
     * Alias for #subscribe.
     */
    on: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: function(){
        return this.subscribe.apply(this,arguments);
      }
    },

    /**
     * @method once
     * Alias for #subscribeOnce.
     */
    once: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: function(){
        return this.subscribeOnce.apply(this,arguments);
      }
    },

    /**
     * @method bind
     * A special subscriber that fires one or more event in response to
     * to an event. This is used to bubble events up/down an event chain.
     *
     * For example:
     *
     * ```js
     * BUS.bind('sourceEvent', ['someEvent','anotherEvent'], {payload:true});
     * ```
     * When `sourceEvent` is published, the bind method triggers `someEvent` and
     * `anotherEvent`, passing the payload object to `someEvent` and
     * `anotherEvent` subscribers simultaneously.
     *
     * @param {String} sourceEvent
     * The event to subscribe to.
     * @param {String|Array} triggeredEvent
     * An event or array of events to fire in response to the sourceEvent.
     * @returns {Object}
     * Returns an object with a single `remove()` method.
     */
    bind: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: function(topic, trigger, meta){
        trigger = typeof trigger === 'string' ? [trigger] : trigger;

        // Create the topic if not yet created
        var t = getBubble(topic);
        t !== null && t.unshift(topic);
        t === null && (t = [topic]) && bubble.push(t);

        var me = this;
        var listener = function(info){
          trigger.forEach(function(tEvent){
            me.publish(tEvent,info !== undefined ? info : {});
          });
        };

        // Add the listener to queue
        var index = t.push(listener);

        // Update the topic with the new queue
        bubble[bubble.map(function(row){return row[0]}).indexOf(topic)] = t;

        // Provide handle back for removal of topic
        return {
          remove: function() {
            t = t.splice(index,1);
            if (t.length === 0){
              bubble.splice(bubble.map(function(row){return row[0]}).indexOf(topic),1);
            } else {
              bubble[bubble.map(function(row){return row[0]}).indexOf(topic)] = t;
            }
          }
        };
      }
    },

    /**
     * @method publish
     * Publish/trigger/fire an event.
     * @param {String} event
     * The event to fire.
     * @param {any} data
     * The payload to send to any event listeners/handlers.
     */
    publish: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: function(topic, info) {

        var t = getTopic(topic), ot = getOneOffTopic(topic), b = getBubble(topic);

        // Cycle through topics and execute listeners
        if (t !== null) {
          t.forEach(function(item){
            item(info !== undefined ? info : {});
          });
        }

        // Cycle through one-off topics and execute listeners
        if (ot !== null) {
          ot.forEach(function(item){
            item(info !== undefined ? info : {});
          });
          oneoff = oneoff.filter(function(_t){
            return _t[0].toLowerCase() !== topic.toLowerCase();
          });
        }

        // Cycle through bubble listeners
        if (b !== null) {
          b.forEach(function(item){
            item(info !== undefined ? info : {});
          });
        }

        // Execute any listeners using a wildcard event match.
        topics.filter(function(t){
          if (t[0].indexOf('*') >= 0){
            var re = new RegExp(t[0].replace('*','.*','gi'));
            return re.test(topic);
          }
          return false;
        }).map(function(arr){
          return arr.slice(1,arr.length);
        })
        .forEach(function(t){
          t.forEach(function(fn){
            fn(info !== undefined ? info : {});
          });
        });

        // Execute any one-off listeners using a wildcard event match.
        oneoff.filter(function(t){
          if (t[0].indexOf('*') >= 0){
            var re = new RegExp(t[0].replace('*','.*','gi'));
            return re.test(topic);
          }
          return false;
        }).map(function(arr){
          return arr.slice(1,arr.length);
        })
        .forEach(function(t){
          t.forEach(function(fn){
            fn(info !== undefined ? info : {});
          });
        });
        oneoff = oneoff.filter(function(t){
          if (t[0].indexOf('*') >= 0){
            var re = new RegExp(t[0].replace('*','.*','gi'));
            return !re.test(topic);
          }
          return true;
        });

        // Trigger any bubbled events using a wildcard
        bubble.filter(function(t){
          if (t[0].indexOf('*') >= 0){
            var re = new RegExp(t[0].replace('*','.*','gi'));
            return re.test(topic);
          }
          return false;
        })
        .forEach(function(t){
          t.forEach(function(fn){
            fn(info !== undefined ? info : {});
          });
        });

      }
    },

    /**
     * @method clear
     * Remove all handlers for an event.
     * @param {String} event
     * The event to trigger.
     */
    clear: {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(topic){
        topics = topics.filter(function(t){
          return t[0].toLowerCase() !== topic.toLowerCase();
        });
        oneoff = oneoff.filter(function(t){
          return t[0].toLowerCase() !== topic.toLowerCase();
        });
        bubble = bubble.filter(function(t){
          return t[0].toLowerCase() !== topic.toLowerCase();
        });
      }
    },

    /**
     * @method emit
     * An alias for #publish.
     */
    emit: {
      enumerable: true,
      configurable: false,
      writable: false,
      value: function(){
        return this.publish.apply(this,arguments);
      }
    },

    /**
     * @property {Array} subscribers
     * An array of all subscribers which currently have a registered event handler.
     */
    subscribers: {
      enumerable: true,
      get: function(){
        var sum = {};
        topics.forEach(function(t){
          sum[t[0]] = {
            persist: t.length-1,
            adhoc: 0
          };
        });
        oneoff.forEach(function(t){
          sum[t[0]] = sum[t[0]] || {persist:0};
          sum[t[0]].adhoc = t.length-1;
        });

        return sum;
      }
    },

    /**
     * @property {Array} persistentSubscribers
     * All subscribers with a persistent (i.e. normal) registered event handler.
     */
    persistentSubscribers: {
      enumerable: true,
      get: function(){
        return topics.map(function(t){
          return t[0];
        }).sort();
      }
    },

    /**
     * @property adhocSubscribers
     * All subscribers with a one-time registered event handler. The handlers of events
     * are removed after the first time the event is heard by the BUS.
     */
    adhocSubscribers: {
      enumerable: true,
      get: function(){
        return oneoff.map(function(t){
          return t[0];
        }).sort();
      }
    },

    /**
     * @property autoSubscribers
     * All subscribers established using the #bind method.
     */
    autoSubscribers: {
      enumerable: true,
      get: function(){
        return bubble.map(function(t){
          return t[0];
        }).sort();
      }
    },

    /**
     * @method pool
     * A helper command to create multiple related subscribers
     * all at once. This is a convenience function.
     * @property {string} [prefix]
     * Supply a prefix to be added to every event. For example,
     * `myScope.` would turn `someEvent` into `myScope.someEvent`.
     * @property {Object} subscriberObject
     * A key:value object where the key is the name of the
     * unprefixed event and the key is the handler function.
     * @property {Function} [callback]
     * A callback to run after the entire pool is registered. Receives
     * a single {Object} argument containing all of the subscribers for
     * each event registered within the pool.
     */
    pool: {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function(prefix,obj,callback){
        if (typeof prefix !== 'string'){
          obj = prefix;
          prefix = '';
        }
        var me = this, pool = {};
        Object.keys(obj).forEach(function(e){
          if (typeof obj[e] === 'function'){
            pool[e] = me.subscribe((prefix.trim()||'')+e,obj[e]);
          } else {
            console.warn((prefix.trim()||'')+e+' could not be pooled in the event bus because it\'s value is not a function.');
          }
        });
        callback && callback(pool);
      }
    },

    /**
     * @method attach
     * Attach a function to a topic. This can be used
     * to forward events in response to asynchronous functions.
     *
     * For example:
     *
     * ```js
     * myAsyncDataFetch(BUS.attach('topicName'));
     * ```
     *
     * This is the same as:
     *
     * ```js
     * myAsyncCall(function(data){
     *  BUS.emit('topicName', data);
     * });
     * ```
     * @returns {function}
     * Returns a function that will
     */
    attach: {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function(topic){
        var me = this;
        return function(){
          var args = Array.prototype.slice.call(arguments);
          args.unshift(topic);
          me.publish.apply(me,args);
        };
      }
    }

  });

  return obj;

})();
