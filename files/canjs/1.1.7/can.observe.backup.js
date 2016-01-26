/*!
 * CanJS - 1.1.7
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Wed, 24 Jul 2013 00:23:54 GMT
 * Licensed MIT
 * Includes: can/observe/backup
 * Download from: http://canjs.com
 */
(function(can) {
    var flatProps = function(a) {
        var obj = {};
        for (var prop in a) {
            if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
                obj[prop] = a[prop]
            }
        }
        return obj;
    };

    can.extend(can.Observe.prototype, {


            backup: function() {
                this._backupStore = this._attrs();
                return this;
            },


            isDirty: function(checkAssociations) {
                return this._backupStore && !can.Object.same(this._attrs(),
                    this._backupStore,
                    undefined,
                    undefined,
                    undefined, !! checkAssociations);
            },


            restore: function(restoreAssociations) {
                var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)

                if (this.isDirty(restoreAssociations)) {
                    this._attrs(props);
                }

                return this;
            }

        })

    return can.Observe;
})(can);