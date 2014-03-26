YUI.add('gallery-model-sync-multi', function(Y) {

/**
 * Allows multiple model sync implementations to be used by a single model.
 * @module gallery-model-sync-multi
 */
(function (Y) {
    'use strict';

    /**
     * This is a class extension for Y.Module allowing multiple model sync
     * implementations to be used by a single model.  When a class is created
     * extending Y.Model, this class extension must come after all other class
     * extensions which implement sync.  Model classes using this extension
     * should have a static SYNCS property.  The SYNCS property will be an
     * object of key/value pairs.  There should be a value for each other sync
     * implementation extension.  The keys can be any name you want to give that
     * implementation.  When calling the sync methods such as load or save, the
     * options argument object should be given a sync property which matches the
     * name of one of the SYNCS to use.
     * @class Multi
     * @constructor
     * @namespace ModelSync
     */
    var _class = function () {};
    
    _class.prototype = {
        /**
         * This sync method passes to one of the other sync methods based on the
         * value of options.sync.  If there is no matching sync method, this
         * does nothing.
         * @method sync
         * @param action
         * @param options
         * @param callbackFunction
         * @protected
         */
        sync: function (action, options) {
            options = options || {};
            
            var Sync = this.constructor.SYNCS[options.sync];
            
            return Sync && Sync.prototype.sync.apply(this, arguments);
        }
    };
    
    Y.namespace('ModelSync').Multi = _class;
}(Y));


}, 'gallery-2012.10.10-19-59' ,{requires:['yui-base'], skinnable:false});
