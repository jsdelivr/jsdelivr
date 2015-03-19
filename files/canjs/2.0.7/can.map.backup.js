/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:33 GMT
 * Licensed MIT
 * Includes: can/map/backup
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## util/object/object.js
    var __m13 = (function(can) {
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
    var __m1 = (function(can) {
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
    })(window.can, undefined, __m13);

})();