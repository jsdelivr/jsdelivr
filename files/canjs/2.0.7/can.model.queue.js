/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:33 GMT
 * Licensed MIT
 * Includes: can/model/queue
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## util/object/object.js
    var __m16 = (function(can) {
        var isArray = can.isArray;

        can.Object = {};

        var same = can.Object.same = function(a, b, compares, aParent, bParent, deep) {
            var aType = typeof a,
                aArray = isArray(a),
                comparesType = typeof compares,
                compare;
            if (comparesType === 'string' || compares === null) {
                compares = compareMethods[compares];
                comparesType = 'function';
            }
            if (comparesType === 'function') {
                return compares(a, b, aParent, bParent);
            }
            compares = compares || {};
            if (a === null || b === null) {
                return a === b;
            }
            if (a instanceof Date || b instanceof Date) {
                return a === b;
            }
            if (deep === -1) {
                return aType === 'object' || a === b;
            }
            if (aType !== typeof b || aArray !== isArray(b)) {
                return false;
            }
            if (a === b) {
                return true;
            }
            if (aArray) {
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    compare = compares[i] === undefined ? compares['*'] : compares[i];
                    if (!same(a[i], b[i], a, b, compare)) {
                        return false;
                    }
                }
                return true;
            } else if (aType === 'object' || aType === 'function') {
                var bCopy = can.extend({}, b);
                for (var prop in a) {
                    compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!same(a[prop], b[prop], compare, a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                    delete bCopy[prop];
                }
                // go through bCopy props ... if there is no compare .. return false
                for (prop in bCopy) {
                    if (compares[prop] === undefined || !same(undefined, b[prop], compares[prop], a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };

        can.Object.subsets = function(checkSet, sets, compares) {
            var len = sets.length,
                subsets = [];
            for (var i = 0; i < len; i++) {
                //check this subset
                var set = sets[i];
                if (can.Object.subset(checkSet, set, compares)) {
                    subsets.push(set);
                }
            }
            return subsets;
        };

        can.Object.subset = function(subset, set, compares) {
            // go through set {type: 'folder'} and make sure every property
            // is in subset {type: 'folder', parentId :5}
            // then make sure that set has fewer properties
            // make sure we are only checking 'important' properties
            // in subset (ones that have to have a value)
            compares = compares || {};
            for (var prop in set) {
                if (!same(subset[prop], set[prop], compares[prop], subset, set)) {
                    return false;
                }
            }
            return true;
        };
        var compareMethods = {
            'null': function() {
                return true;
            },
            i: function(a, b) {
                return ('' + a)
                    .toLowerCase() === ('' + b)
                    .toLowerCase();
            }
        };
        return can.Object;
    })(window.can);

    // ## map/backup/backup.js
    var __m15 = (function(can) {
        var flatProps = function(a, cur) {
            var obj = {};
            for (var prop in a) {
                if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
                    obj[prop] = a[prop];
                } else {
                    obj[prop] = cur.attr(prop);
                }
            }
            return obj;
        };
        can.extend(can.Map.prototype, {


                backup: function() {
                    this._backupStore = this._attrs();
                    return this;
                },


                isDirty: function(checkAssociations) {
                    return this._backupStore && !can.Object.same(this._attrs(), this._backupStore, undefined, undefined, undefined, !! checkAssociations);
                },


                restore: function(restoreAssociations) {
                    var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore, this);
                    if (this.isDirty(restoreAssociations)) {
                        this._attrs(props, true);
                    }
                    return this;
                }
            });
        return can.Map;
    })(window.can, undefined, __m16);

    // ## model/queue/queue.js
    var __m1 = (function(can) {
        var cleanAttrs = function(changedAttrs, attrs) {
            var newAttrs = can.extend(true, {}, attrs),
                current, path;
            if (changedAttrs) {
                // go through the attributes returned from the server
                // and remove those that were changed during the current
                // request batch
                for (var i = 0; i < changedAttrs.length; i++) {
                    current = newAttrs;
                    path = changedAttrs[i].split('.');
                    while (path.length > 1) {
                        current = current && current[path.shift()];
                    }
                    if (current) {
                        delete current[path.shift()];
                    }
                }
            }
            return newAttrs;
        }, queueRequests = function(success, error, method, callback) {
                this._changedAttrs = this._changedAttrs || [];
                var def = new can.Deferred(),
                    self = this,
                    attrs = this.serialize(),
                    queue = this._requestQueue,
                    changedAttrs = this._changedAttrs,
                    reqFn, index;
                reqFn = function(self, type, success, error) {
                    // Function that performs actual request
                    return function() {
                        // pass already serialized attributes because we want to 
                        // save model in state it was when request was queued, not
                        // when request is ran
                        return self.constructor._makeRequest([
                                self,
                                attrs
                            ], type || (self.isNew() ? 'create' : 'update'), success, error, callback);
                    };
                }(this, method, function() {
                    // resolve deferred with results from the request
                    def.resolveWith(self, arguments);
                    // remove current deferred from the queue 
                    queue.splice(0, 1);
                    if (queue.length > 0) {
                        // replace queued wrapper function with deferred
                        // returned from the makeRequest function so we 
                        // can access it's `abort` function
                        queue[0] = queue[0]();
                    } else {
                        // clean up changed attrs since there is no more requests in the queue
                        changedAttrs.splice(0);
                    }
                }, function() {
                    // reject deferred with results from the request
                    def.rejectWith(self, arguments);
                    // since we failed remove all pending requests from the queue
                    queue.splice(0);
                    // clean up changed attrs since there is no more requests in the queue
                    changedAttrs.splice(0);
                });
                // Add our fn to the queue
                index = queue.push(reqFn) - 1;
                // If there is only one request in the queue, run
                // it immediately.
                if (queue.length === 1) {
                    // replace queued wrapper function with deferred
                    // returned from the makeRequest function so we 
                    // can access it's `abort` function
                    queue[0] = queue[0]();
                }
                def.abort = function() {
                    var abort;
                    // check if this request is running, if it's not
                    // just remove it from the queue
                    // also all subsequent requests should be removed too
                    abort = queue[index].abort && queue[index].abort();
                    // remove aborted request and any requests after it
                    queue.splice(index);
                    // if there is no more requests in the queue clean up
                    // the changed attributes array
                    if (queue.length === 0) {
                        changedAttrs.splice(0);
                    }
                    return abort;
                };
                // deferred will be resolved with original success and
                // error functions
                def.then(success, error);
                return def;
            }, _changes = can.Model.prototype._changes,
            destroyFn = can.Model.prototype.destroy,
            setupFn = can.Model.prototype.setup;
        can.each([
                'created',
                'updated',
                'destroyed'
            ], function(fn) {
                var prototypeFn = can.Model.prototype[fn];
                can.Model.prototype[fn] = function(attrs) {
                    if (attrs && typeof attrs === 'object') {
                        attrs = attrs.attr ? attrs.attr() : attrs;
                        // Create backup of last good known state returned
                        // from the server. This allows users to restore it
                        // if API returns error
                        this._backupStore = attrs;
                        attrs = cleanAttrs(this._changedAttrs || [], attrs);
                    }
                    // call the original function with the cleaned up attributes
                    prototypeFn.call(this, attrs);
                };
            });
        can.extend(can.Model.prototype, {
                setup: function() {
                    setupFn.apply(this, arguments);
                    this._requestQueue = new can.List();
                },
                _changes: function(ev, attr, how, newVal, oldVal) {
                    // record changes if there is a request running
                    if (this._changedAttrs) {
                        this._changedAttrs.push(attr);
                    }
                    _changes.apply(this, arguments);
                },
                hasQueuedRequests: function() {
                    return this._requestQueue.attr('length') > 1;
                },
                save: function() {
                    return queueRequests.apply(this, arguments);
                },
                destroy: function(success, error) {
                    if (this.isNew()) {
                        // if it's a new instance, call default destroy method
                        return destroyFn.call(this, success, error);
                    }
                    return queueRequests.call(this, success, error, 'destroy', 'destroyed');
                }
            });
        return can;
    })(window.can, undefined, __m15);

})();