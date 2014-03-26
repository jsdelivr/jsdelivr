YUI.add('gallery-recordset-storage-lite', function(Y) {

'use strict';

var _class;

_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.NAME = 'RecordsetStorageLite';

_class.NS = 'storageLite';

Y.extend(_class, Y.Plugin.Base, {
    initializer: function () {
        this.publish('failure');
        this.publish('store');
    },
    store: function (key) {
        Y.StorageLite.on('storage-lite:ready', function () {
            var host = this.get('host'),
                records = host.getRecordsByIndex(0, host.getLength());

            Y.each(records, function (record, index, records) {
                records[index] = record.getValue();
            });

            try {
                Y.StorageLite.setItem(key, records, true);
                this.fire('store', {}, key, records);
            } catch (e) {
                this.fire('failure', {}, e);
            }
        }, this);
    }
});

Y.Plugin.RecordsetStorageLite = _class;


}, 'gallery-2011.04.06-19-44' ,{requires:['gallery-storage-lite','plugin']});
