YUI.add('gallery-mutex', function(Y) {

/**
 * @module gallery-mutex
 */
(function (Y) {
    'use strict';
    
    /**
    * Most people believe that Since JavaScript does not provide a
    * multi-threaded shared memory environment, JavaScript is completely
    * free from concurrency issues.  This is true at a low level;
    * JavaScript developers don't need to worry about race conditions
    * between multiple processes or threads writing to the same memory
    * location.  At a higher level, asynchronous operations still allow for
    * similar problems to occur.
    * 
    * Imagine a function that does the following:
    * <ol>
    *     <li>
    *         Check the value of a variable.
    *     </li>
    *     <li>
    *         If the value is undefined:
    *         <ol>
    *             <li>
    *                 Make a request to a server.
    *             </li>
    *             <li>
    *                 Receive data.
    *             <li>
    *                 Set the value of the variable.
    *             </li>
    *         </ol>
    *     </li>
    *     <li>
    *         Pass the variable to a callback function.
    *     </li>
    * </ol>
    * 
    * It seems common for web applications to lazy load data like this as
    * needed.  Now imagine that there are several separate modules within a
    * web application which all require this data.  It's possible for the
    * first module to call this function, the function sees that the value
    * is undefined, and sends a request to a server.  Then before the
    * request returns, the second module calls this function, the function
    * sees that the value is undefined and sends a request to a server.
    * Then before both of those requests return, the third module calls
    * this function, the function sees that the value is undefined and sends
    * a request to a server.  In this case, three requests are made to a server
    * for the same data.
    * 
    * It would be far better if the second and third calls to the function
    * just waited for the first request to complete.  Y.Mutex makes it
    * easier to accomplish this functionality.
    * 
    * Y.Mutex provides a concept of locking a resource.  Once an exclusive
    * resource lock is obtained, other parts of an application which
    * attempt to access the same resource, will have to wait until that
    * resource is unlocked.
    * 
    * The function above could be rewritten as follows:
    * <ol>
    *     <li>
    *         Obtain an exclusive lock for a variable.
    *     </li>
    *     <li>
    *         Check the value of the variable.
    *     </li>
    *     <li>
    *         If the value is undefined:
    *         <ol>
    *             <li>
    *                 Make a request to a server.
    *             </li>
    *             <li>
    *                 Receive data.
    *             <li>
    *                 Set the value of the variable.
    *             </li>
    *         </ol>
    *     </li>
    *     <li>
    *         Unlock the variable.
    *     </li>
    *     <li>
    *         Pass the variable to a callback function.
    *     </li>
    * </ol>
    * 
    * This way, second or third or more calls to the function, before the
    * first request is complete, will always wait for the request to
    * complete instead of sending multiple unnecessary requests.
    * 
    * Just like locking in multi threaded applications, there are
    * disadvantages and dangers to locking.  There is a small amount of
    * overhead added to every resource access, even when the chances for
    * concurrency issues are very small.  Once a lock is obtained, it must
    * be unlocked; so error handling and time outs are important to ensure
    * that the entire application doesn't break when something goes wrong.
    * It is possible to cause a deadlock when locking multiple resources at
    * once.
    * 
    * One advantage Y.Mutex has in JavaScript over other multi threaded
    * applications, the locks are asynchronous.  The application is not
    * blocked while waiting to acquire a lock.  Even if a deadlock occurs,
    * other parts of the application are not affected.  Y.Mutex also
    * provides multiple ways to cancel a particular lock, so there are
    * extra possibilities to recover from locking errors.
    * 
    * Y.Mutex offers exclusive locks, shared locks, and upgradable locks.
    * When a resource is locked by an exclusive lock, Y.Mutex guarantees
    * that no other locks will be granted for the resource until the
    * resource is unlocked.  When a resource is locked by a shared lock,
    * Y.Mutex allows the resource to be locked by an unlimited number of
    * other shared locks at the same time and/or one single upgradable
    * lock.  When a resource is locked by multiple shared locks, an
    * exclusive lock can not be obtained until all of the shared locks have
    * been unlocked.  An upgradable lock can be upgraded to act as an
    * exclusive lock.  Shared locks are generally used when just reading
    * values.  Exclusive locks are generally used when writing values.
    * 
    * Y.Mutex provides a way to deal with asynchronous concurrency issues,
    * but it does not prevent them.  If code from part of an application
    * uses Y.Mutex to lock a resource, there is nothing stopping code from
    * another part of the application from ignoring the lock and accessing
    * the resource directly.  Y.Mutex does not handle real multi threaded or
    * multi process concurrency issues.
    * @class Mutex
    * @static
    */
    var _Mutex = Y.namespace('Mutex'),
        
        _isEmpty = Y.Object.isEmpty,
        _later = Y.later,
        _soon = Y.soon;
        
    Y.mix(_Mutex, {
        /**
         * Obtains an exclusive lock on a resource.
         * @method exclusive
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * one argument, the unlock function which must be called to release the
         * lock.
         * @param {Number} timeout Optional.  The approximate time in
         * milliseconds to wait after the callback function has been called.
         * Once the timeout has expired, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using timeout is one way to reduce the possibility of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.
         * @return {Object} cancelObject An object with a cancel method.  When
         * the cancel method is called, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using the cancel method is one way to reduce the possibiliy of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.  The cancelObject also has a mode property set to
         * 'exclusive'.
         * @static
         */
        exclusive: function (resourceName, callbackFunction, timeout) {
            var _locks = _Mutex._locks,
                
                guid = Y.guid(),
                lock = _locks[resourceName],
                queue,
                
                unlock = function () {
                    _Mutex._unlockExclusive(guid, resourceName);
                },
                
                lockDetails = [
                    guid,
                    resourceName,
                    callbackFunction,
                    timeout,
                    unlock
                ];
                
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            if (lock.e || lock.s || lock.u) {
                queue = lock.eq;
                
                if (!queue) {
                    queue = [];
                    lock.eq = queue;
                }
                
                queue.push(lockDetails);
            } else {
                _Mutex._lockExclusive.apply(_Mutex, lockDetails);
            }

            return {
                cancel: unlock,
                mode: 'exclusive'
            };
        },
        /**
         * Obtains a shared lock on a resource.
         * @method shared
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * one argument, the unlock function which must be called to release the
         * lock.
         * @param {Number} timeout Optional.  The approximate time in
         * milliseconds to wait after the callback function has been called.
         * Once the timeout has expired, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using timeout is one way to reduce the possibility of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.
         * @return {Object} cancelObject An object with a cancel method.  When
         * the cancel method is called, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using the cancel method is one way to reduce the possibiliy of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.  The cancelObject also has a mode property set to
         * 'shared'.
         * @static
         */
        shared: function (resourceName, callbackFunction, timeout) {
            var _locks = _Mutex._locks,
                
                guid = Y.guid(),
                lock = _locks[resourceName],
                queue,
                
                unlock = function () {
                    _Mutex._unlockShared(guid, resourceName);
                },
                
                lockDetails = [
                    guid,
                    resourceName,
                    callbackFunction,
                    timeout,
                    unlock
                ];
                
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            if (lock.e || lock.eq || lock.ue) {
                queue = lock.sq;
                
                if (!queue) {
                    queue = [];
                    lock.sq = queue;
                }
                
                queue.push(lockDetails);
            } else {
                _Mutex._lockShared.apply(_Mutex, lockDetails);
            }

            return {
                cancel: unlock,
                mode: 'shared'
            };
        },
        /**
         * Obtains an upgradable lock on a resource.  When an upgradable lock is
         * obtained, it begins in shared mode and it allows other shared locks
         * to be granted for the resource.  An upgradable lock can at any time
         * be upgraded to exclusive mode.  When upgraded to exclusive mode, new
         * shared locks will not be granted and the upgradable lock will wait
         * until all existing shared locks are unlocked.  Then it will resume,
         * exclusively holding the only lock on the resource.  It can then at
         * any time return to shared mode allowing more shared locks to be
         * granted.
         * @method upgradable
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * two arguments.  The first argument is the unlock function which must
         * be called to release the lock.  The second argument is the exclusive
         * function which may be called to switch the upgradable lock to
         * exclusive mode.  The exclusive function accepts a callback function
         * as its only argument.  This callback function gets called once
         * exclusivity is achieved.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed ever to be called.  The callback function is passed
         * one argument, the shared function which may be called to switch the
         * upgradable lock back to shared mode.  The shared function accepts a
         * callback function as its only argument.  This callback function gets
         * called once exclusivity is revoked.  It is guaranteed not to be
         * called synchronously.  It is guaranteed not to be called more than
         * once.  It is not guaranteed ever to be called.  The callback function
         * is passed one argument, the exclusive function which may be called to
         * switch the upgradable lock to exclusive mode.
         * @param {Number} timeout Optional.  The approximate time in
         * milliseconds to wait after the callback function has been called.
         * Once the timeout has expired, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using timeout is one way to reduce the possibility of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.
         * @return {Object} cancelObject An object with a cancel method.  When
         * the cancel method is called, if the callback function hasn't yet
         * called the unlock function, the lock will be automatically released.
         * This does not halt, stop, or prevent anything that the callback
         * function might still be doing asynchronously; it just releases the
         * lock.  Using the cancel method is one way to reduce the possibiliy of
         * deadlocks, but it comes with the risk of allowing concurrent access
         * to the resource.  The cancelObject also has a mode property set to
         * 'upgradable'.
         * @static
         */
        upgradable: function (resourceName, callbackFunction, timeout) {
            var _locks = _Mutex._locks,
                
                guid = Y.guid(),
                lock = _locks[resourceName],
                queue,
                
                unlock = function () {
                    _Mutex._unlockUpgradable(guid, resourceName);
                },
                
                lockDetails = [
                    guid,
                    resourceName,
                    callbackFunction,
                    timeout,
                    unlock
                ];
                
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            if (lock.e || lock.eq || lock.u) {
                queue = lock.uq;
                
                if (!queue) {
                    queue = [];
                    lock.uq = queue;
                }
                
                queue.push(lockDetails);
            } else {
                _Mutex._lockUpgradable.apply(_Mutex, lockDetails);
            }

            return {
                cancel: unlock,
                mode: 'upgradable'
            };
        },
        /**
         * Cancels the time out timer on a currently held lock.
         * @method _cancelTimer
         * @param {String} guid The lock's internal id.  If this is not the id
         * of a lock currently held on this resource, with a time out, this
         * method will do nothing.
         * @param {String} resourceName The name of the locked resource.
         * @protected
         * @static
         */
        _cancelTimer: function (guid, resourceName) {
            var lock = _Mutex._locks[resourceName],
                timers = lock && lock.t,
                
                timer = timers && timers[guid];
            
            if (timer) {
                timer.cancel();
                delete timers[guid];
                
                if (_isEmpty(timers)) {
                    delete lock.t;
                }
            }
        },
        /**
         * Immediately grants an exclusive lock on a resource.
         * @method _lockExclusive
         * @param {String} guid The lock's internal id.
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * one argument, the unlock function which must be called to release the
         * lock.
         * @param {Number} timeout The approximate time in milliseconds to wait
         * after the callback function has been called.  Once the timeout has
         * expired, if the callback function hasn't yet called the unlock
         * function, the lock will be automatically released.  This does not
         * halt, stop, or prevent anything that the callback function might
         * still be doing asynchronously; it just releases the lock.  Using
         * timeout is one way to reduce the possibility of deadlocks, but it
         * comes with the risk of allowing concurrent access to the resource.
         * @param {Function} unlock The function that will unlock this lock.
         * @protected
         * @static
         */
        _lockExclusive: function (guid, resourceName, callbackFunction, timeout, unlock) {
            var _locks = _Mutex._locks,
                
                lock = _locks[resourceName];
            
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            lock.e = guid;
                
            _soon(function () {
                if (timeout) {
                    var timers = lock.t;
                    
                    if (!timers) {
                        timers = {};
                        lock.t = timers;
                    }
                    
                    timers[guid] = _later(timeout, null, unlock);
                }

                callbackFunction(unlock);
            });
        },
        /**
         * Immediately grants locks on a resource as needed, based upon
         * currently held locks and the queue of locks waiting to be granted.
         * @method _lockQueue
         * @param {String} resourceName The name of the resource to lock.
         * @protected
         * @static
         */
        _lockQueue: function (resourceName) {
            var _locks = _Mutex._locks,
                
                lock = _locks[resourceName],
                lockDetails,
                queue;
            
            if (!lock || lock.e) {
                return;
            }
            
            if (!lock.s && !lock.u) {
                queue = lock.eq;
                
                if (queue) {
                    lockDetails = queue.shift();

                    if (!queue.length) {
                        delete lock.eq;
                    }

                    if (lockDetails) {
                        _Mutex._lockExclusive.apply(_Mutex, lockDetails);
                        return;
                    }
                }
            }
            
            if (lock.u) {
                if (lock.ue && !lock.s) {
                    lock.ue();
                    return;
                }
            }
            
            if (lock.eq) {
                return;
            }
            
            queue = lock.uq;

            if (queue) {
                lockDetails = queue.shift();

                if (!queue.length) {
                    delete lock.uq;
                }

                if (lockDetails) {
                    _Mutex._lockUpgradable.apply(_Mutex, lockDetails);
                }
            }
            
            queue = lock.sq;
            
            if (queue) {
                while (queue.length) {
                    _Mutex._lockShared.apply(_Mutex, queue.shift());
                }
                
                delete lock.sq;
            }
            
            if (_isEmpty(lock)) {
                delete _locks[resourceName];
            }
        },
        /**
         * An object containing the state of currently held and queued locks.
         * @property _locks
         * @protected
         * @static
         */
        _locks: {},
        /**
         * Immediately grants a shared lock on a resource.
         * @method _lockShared
         * @param {String} guid The lock's internal id.
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * one argument, the unlock function which must be called to release the
         * lock.
         * @param {Number} timeout The approximate time in milliseconds to wait
         * after the callback function has been called.  Once the timeout has
         * expired, if the callback function hasn't yet called the unlock
         * function, the lock will be automatically released.  This does not
         * halt, stop, or prevent anything that the callback function might
         * still be doing asynchronously; it just releases the lock.  Using
         * timeout is one way to reduce the possibility of deadlocks, but it
         * comes with the risk of allowing concurrent access to the resource.
         * @param {Function} unlock The function that will unlock this lock.
         * @protected
         * @static
         */
        _lockShared: function (guid, resourceName, callbackFunction, timeout, unlock) {
            var _locks = _Mutex._locks,
                
                lock = _locks[resourceName],
                locks;
            
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            locks = lock.s;
            
            if (!locks) {
                locks = {};
                lock.s = locks;
            }
            
            locks[guid] = true;
                
            _soon(function () {
                if (timeout) {
                    var timers = lock.t;
                    
                    if (!timers) {
                        timers = {};
                        lock.t = timers;
                    }
                    
                    timers[guid] = _later(timeout, null, unlock);
                }

                callbackFunction(unlock);
            });
        },
        /**
         * Immediately grants an upgradable lock on a resource.
         * @method _lockUpgradable
         * @param {String} guid The lock's internal id.
         * @param {String} resourceName The name of the resource to lock.
         * @param {Function} callbackFunction The function that gets called when
         * the lock is obtained.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed to ever be called.  The callback function is passed
         * two arguments.  The first argument is the unlock function which must
         * be called to release the lock.  The second argument is the exclusive
         * function which may be called to switch the upgradable lock to
         * exclusive mode.  The exclusive function accepts a callback function
         * as its only argument.  This callback function gets called once
         * exclusivity is achieved.  It is guaranteed not to be called
         * synchronously.  It is guaranteed not to be called more than once.  It
         * is not guaranteed ever to be called.  The callback function is passed
         * one argument, the shared function which may be called to switch the
         * upgradable lock back to shared mode.  The shared function accepts a
         * callback function as its only argument.  This callback function gets
         * called once exclusivity is revoked.  It is guaranteed not to be
         * called synchronously.  It is guaranteed not to be called more than
         * once.  It is not guaranteed ever to be called.  The callback function
         * is passed one argument, the exclusive function which may be called to
         * switch the upgradable lock to exclusive mode.
         * @param {Number} timeout The approximate time in milliseconds to wait
         * after the callback function has been called.  Once the timeout has
         * expired, if the callback function hasn't yet called the unlock
         * function, the lock will be automatically released.  This does not
         * halt, stop, or prevent anything that the callback function might
         * still be doing asynchronously; it just releases the lock.  Using
         * timeout is one way to reduce the possibility of deadlocks, but it
         * comes with the risk of allowing concurrent access to the resource.
         * @param {Function} unlock The function that will unlock this lock.
         * @protected
         * @static
         */
        _lockUpgradable: function (guid, resourceName, callbackFunction, timeout, unlock) {
            var _locks = _Mutex._locks,
                
                lock = _locks[resourceName];
            
            if (!lock) {
                lock = {};
                _locks[resourceName] = lock;
            }
            
            lock.u = guid;
                
            _soon(function () {
                var exclusive,
                    shared,
                    timers;
                    
                exclusive = function (callbackFunction) {
                    var lock = _locks[resourceName] || {},
                    
                        exclusive = function () {
                            var lock = _locks[resourceName] || {};
                            
                            if (lock.u !== guid) {
                                return;
                            }
                            
                            lock.e = guid;
                            delete lock.u;
                            delete lock.ue;
                            
                            _soon(function () {
                                callbackFunction(shared);
                            });
                        };

                    if (lock.u !== guid) {
                        return;
                    }
                    
                    if (lock.s) {
                        lock.ue = exclusive();
                    } else {
                        exclusive();
                    }
                };
                
                shared = function (callbackFunction) {
                    var lock = _locks[resourceName] || {};
                            
                    if (lock.e !== guid) {
                        return;
                    }
                    
                    lock.u = guid;
                    delete lock.e;
                    
                    _Mutex._lockQueue(resourceName);
                    
                    _soon(function () {
                        callbackFunction(exclusive);
                    });
                };
                
                if (timeout) {
                    timers = lock.t;
                    
                    if (!timers) {
                        timers = {};
                        lock.t = timers;
                    }
                    
                    timers[guid] = _later(timeout, null, unlock);
                }

                callbackFunction(unlock, exclusive);
            });
        },
        /**
         * Unlocks a currently held exclusive lock on a resource and processes
         * the next locks in queue as needed.
         * @method _unlockExclusive
         * @param {String} guid The lock's internal id.  If this is not the id
         * of an exclusive lock currently held on this resource, this method
         * will do nothing.
         * @param {String} resourceName The name of the locked resource.
         * @protected
         * @static
         */
        _unlockExclusive: function (guid, resourceName) {
            _Mutex._cancelTimer(guid, resourceName);
            
            var lock = _Mutex._locks[resourceName] || {};
                
            if (lock.e !== guid) {
                return;
            }
            
            delete lock.e;

            _Mutex._lockQueue(resourceName);
        },
        /**
         * Unlocks a currently held shared lock on a resource and processes the
         * next locks in queue as needed.
         * @method _unlockShared
         * @param {String} guid The lock's internal id.  If this is not the id
         * of a shared lock currently held on this resource, this method will do
         * nothing.
         * @param {String} resourceName The name of the locked resource.
         * @protected
         * @static
         */
        _unlockShared: function (guid, resourceName) {
            _Mutex._cancelTimer(guid, resourceName);
            
            var lock = _Mutex._locks[resourceName] || {},
                locks = lock.s;
                
            if (!locks || !locks[guid]) {
                return;
            }
            
            delete locks[guid];
            
            if (_isEmpty(locks)) {
                delete lock.s;
            }

            _Mutex._lockQueue(resourceName);
        },
        /**
         * Unlocks a currently held upgradable lock on a resource and processes
         * the next locks in queue as needed.
         * @method _unlockUpgradable
         * @param {String} guid The lock's internal id.  If this is not the id
         * of an upgradable lock currently held on this resource, this method
         * will do nothing.
         * @param {String} resourceName The name of the locked resource.
         * @protected
         * @static
         */
        _unlockUpgradable: function (guid, resourceName) {
            _Mutex._cancelTimer(guid, resourceName);
            
            var lock = _Mutex._locks[resourceName] || {};
            
            if (lock.e === guid) {
                delete lock.e;
            } else if (lock.u === guid) {
                delete lock.u;
                delete lock.ue;
            } else {
                return;
            }

            _Mutex._lockQueue(resourceName);
        }
    });
}(Y));


}, 'gallery-2012.04.26-15-49' ,{requires:['gallery-soon'], skinnable:false});
