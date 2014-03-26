YUI.add('gallery-zui-attribute', function (Y, NAME) {

/**
 * The Attribute module provides more methods for Attribute object
 * support for older browsers
 *
 * @module gallery-zui-attribute
 */

/**
 * A augmentable implementation for Attribute, providing extended
 * methods for Attribute management such as toggle() and set_again()
 *
 * @namespace zui
 * @class Attribute
*/
function ZAttribute() {}

ZAttribute.prototype = {
    /**
     * toggle the value of an attribute.
     *
     * @method toggle
     * @param name {String} The name of the attribute.
     * @chainable
     */
    toggle: function (name) {
        if (this.set && this.get) {
            this.set(name, this.get(name) ? false : true);
        }

        return this;
    },

    /**
     * set the value of an attribute to current value, to trigger setter function or valueChange event.
     *
     * @method set_again
     * @param name {String} The name of the attribute.
     * @chainable
     */
    set_again: function (name) {
        if (this.set && this.get) {
            this.set(name, this.get(name));
        }
        return this;
    },

    /**
     * set the value of an attribute, this wrapped function help to maintain a value change stack for revert().
     *
     * @method set
     * @param name {String} The name of the attribute.
     * @param value {String} The value of the attribute.
     * @param cfg {Object} Optional event data to be mixed into the event facade passed to subscribers of the attribute's change event.
     * @chainable
     */
    set: function (name, value, cfg) {
       /**
         * When the obejct have _doRevert property , enable the revert() behavior on all properties
         *
         * @property _doRevert
         * @type Boolean
         * @protected
         */
        var doRevert = this._doRevert;

       /**
         * When the obejct have _revertList property , enable the revert() behavior on listed properties
         *
         * @property _revertList
         * @type Object
         * @protected
         */
        if (!doRevert && this._revertList) {
            doRevert = this._revertList[name];
        }

        if (doRevert) {
           /**
             * Used to keep data stack for revert()
             *
             * @property _revertStack
             * @type Object
             * @protected
             */
            if (!this._revertStack) {
                this._revertStack = {};
            }
            if (!this._revertStack[name]) {
                this._revertStack[name] = [];
            }
            this._revertStack[name].push(value);
        }

        return this._setAttr(name, value, cfg);
    },

    /**
     * revert the value of an attribute. If no older value, do nothing.
     *
     * @method revert
     * @param name {String} The name of the attribute.
     * @chainable
     */
    revert: function (name) {
        if (!this._revertStack || !this._revertStack[name] || (this._revertStack[name].length < 2)) {
            return this;
        }

        this._revertStack[name].pop();

        return this._setAttr(name, this._revertStack[name][this._revertStack[name].length - 1]);
    },

    /**
     * sync an attribute from other Object when the attribute value of other object changed, everytime.
     *
     * @method sync
     * @param name {String} The name of the attribute.
     * @param source {Attribute} The source Attribute owner Object you want to sync.
     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can omit this parameter.
     * @chainable
     */
    sync: function (name, source, fname) {
        var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name;

        if (!this.syncHandlers) {
            this.syncHandlers = {};
        }

        this.syncHandlers[[name, id, sid, from].join('_')] = source.after(from + 'Change', function (E) {
            this.set(name, E.newVal);
        }, this);

        this.set(name, source.get(from));

        return this;
    },

    /**
     * Stop attribute syncing
     *
     * @method unsync
     * @param name {String} The name of the attribute.
     * @param source {Attribute} The source Attribute owner Object you want to sync.
     * @param sourceName {String} The source Attribute name. If the source attribute name is same with target, you can o
mit this parameter.
     * @chainable
     */
    unsync: function (name, source, fname) {
        var id = Y.stamp(this),
            sid = Y.stamp(source),
            from = fname || name,
            hid = [name, id, sid, from].join('_');

        if (!this.syncHandlers) {
            this.syncHandlers = {};
        }

        if (this.syncHandlers[hid]) {
            this.syncHandlers[hid].detach();
            delete this.syncHandlers[hid];
        }

        return this;
    }
};

Y.namespace('zui').Attribute = ZAttribute;


}, 'gallery-2013.02.07-15-27', {"requires": ["attribute-base"]});
