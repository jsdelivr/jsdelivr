YUI.add('gallery-recordset-multisort', function(Y) {


    /**
    * Adds default and custom multi field sorting functionality to the Recordset utility
    * @module recordset
    * @submodule recordset-multisort
    */

    var Compare = Y.ArraySort.compare,
    isValue = Y.Lang.isValue,
	isArray = Y.Lang.isArray;

    /**
    * Plugin that adds default and custom multi field sorting functionality to the Recordset utility
    * @class RecordsetMultiSort
    */

    function RecordsetMultiSort(fields, sorter) {
        RecordsetMultiSort.superclass.constructor.apply(this, arguments);
    }

    Y.mix(RecordsetMultiSort, {
        NS: "multisort",

        NAME: "recordsetMultiSort",

        ATTRS: {

            /**
            * @description The last properties used to sort. Consists of an object literal with the keys "fields" and "sorter"
            *
            * @attribute lastSortProperties
            * @public
            * @type object
            */
            lastSortProperties: {
                value: {
                    fields: undefined,
                    sorter: undefined
                },
                validator: function (v) {
                    return (isArray(v.fields) && isValue(v.sorter));
                }
            },

            /**
            * @description Default sort function to use if none is specified by the user.
            * Takes two records and the fields to sort by.
            *
            * @attribute defaultSorter
            * @public
            * @type function
            */
            defaultSorter: {
                value: function (recA, recB, fields) {
                    var result;
                    for (var i = 0; i < fields.length && !result; i++) {
                        result = Compare(recA.getValue(fields[i].field), recB.getValue(fields[i].field), fields[i].desc);
                    }
                    return result;
                }
            },

            /**
            * @description A boolean telling if the recordset is in a sorted state.
            *
            * @attribute defaultSorter
            * @public
            * @type function
            */
            isSorted: {
                value: false
            }
        }
    });

    Y.extend(RecordsetMultiSort, Y.Plugin.Base, {

        /**
        * @description Sets up the default function to use when the "sort" event is fired.
        *
        * @method initializer
        * @protected
        */
        initializer: function (config) {

            var self = this,
			host = this.get('host');


            this.publish("sort", {
                defaultFn: Y.bind("_defSortFn", this)
            });

            //Toggle the isSorted ATTR based on events.
            //Remove events dont affect isSorted, as they are just popped/sliced out
            this.on("sort",
				function () {
					self.set('isSorted', true);
			});

            this.onHostEvent('add',
				function () {
					self.set('isSorted', false);
				},
			host);
			
            this.onHostEvent('update',
				function () {
					self.set('isSorted', false);
				},
			host);

        },

        destructor: function (config) {
        },

        /**
        * @description Method that all sort calls go through. 
        * Sets up the lastSortProperties object with the details of the sort, and passes in parameters 
        * to the "defaultSorter" or a custom specified sort function.
        *
        * @method _defSortFn
        * @private
        */
        _defSortFn: function (e) {
            //have to work directly with _items here - changing the recordset.
            this.get("host")._items.sort(function (a, b) {
                return (e.sorter)(a, b, e.fields);
            });

            this.set('lastSortProperties', e);
        },

        /**
        * @description Sorts the recordset.
        *
        * @method sort
        * @param fields {array} of object {field, desc}.
        * @public
        */
        sort: function (fields, sorter) {
            this.fire("sort", {
                fields: fields,
                sorter: sorter || this.get("defaultSorter")
            });
        },

        /**
        * @description Resorts the recordset based on the last-used sort parameters (stored in 'lastSortProperties' ATTR)
        *
        * @method resort
        * @public
        */
        resort: function () {
            var p = this.get('lastSortProperties');
            this.fire("sort", {
                fields: p.fields,
                sorter: p.sorter || this.get("defaultSorter")
            });
        },

        /**
        * @description Reverses the recordset calling the standard array.reverse() method.
        *
        * @method reverse
        * @public
        */
        reverse: function () {
            this.get('host')._items.reverse();
        },

        /**
        * @description Sorts the recordset based on the last-used sort parameters, but flips the order. (ie: Descending becomes ascending, and vice versa).
        *
        * @method flip
        * @public
        */
        flip: function () {
            var p = this.get('lastSortProperties');

            if (isArray(p.fields)) {
                for (var i = 0; i < p.fields.length; i++)
                    p.fields[i].desc = !p.fields[i].desc;
                this.fire("sort", {
                    fields: p.fields,
                    sorter: p.sorter || this.get("defaultSorter")
                });
            }
            else {
            }
        }
    });

    Y.namespace("Plugin").RecordsetMultiSort = RecordsetMultiSort;


}, 'gallery-2011.11.30-20-58' ,{requires:['arraysort', 'recordset-base', 'plugin'], skinnable:false});
