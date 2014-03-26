YUI.add('gallery-dataschema-class', function(Y) {

var L = Y.Lang,
    isFunction = L.isFunction,
    isObject   = L.isObject;

/**
 * Abstract class encapsulation for any DataSchema implementation.  Pass the
 * constructor configuration an object containing these keys:
 *
 * <ul>
 *   <li><code>type</code> - "json", "JSON", Y.DataSchema.JSON, a custom
 *       implementation object (must provide an apply method), or a custom
 *       function used as the apply method.</li>
 *   <li><code>schema</code> - the object containing the appropriate schema
 *       key:values for the specified type of schema parser.  What you would
 *       pass as the first argument to
 *       Y.DataSchema.JSON.apply( SCHEMA, data );</li>
 * </ul>
 *
 * This class constructor replaces the Y.DataSchema object namespace.  All
 * loaded schema parser implementations are preserved.
 *
 * @module dataschema
 * @submodule dataschema-class
 * @class DataSchema
 * @constructor
 * @param config {Object} object containing keys "type" and "schema"
 */
function DataSchema(config) {
    this._init(config);
}

DataSchema.prototype = {
    /**
     * Initialize the instance, resolve the configured schema parser
     * implementation, and add any other properties or custom methods onto this
     * object.  Generally, the "any other properties" should be just the
     * schema.
     *
     * @method _init
     * @param config {Object} object passed in from constructor
     * @protected
     */
    _init: function (config) {
        config = isObject(config) ? config : {};

        Y.mix(this, config);

        this._impl = this._resolve(config.type || 'Base');
    },

    /**
     * <p>Resolves the configured type to an implementation object (e.g.
     * Y.DataSchema.JSON).</p>
     *
     * <p>Accepts type as a string, object, or function.  Defalts to
     * Y.DataSchema.Base.</p>
     *
     * <p>If a string is supplied, an implementation is searched for as a
     * static property of Y.DataSchema.  If one cannot be found, two more
     * attempts are made with the string in upper case and then the string with
     * first letter capitalized.</p>
     *
     * <p>If an object that contains a method named "apply" is passed, that
     * object is used.</p>
     *
     * <p>If a function is passed, that function is treated as the "apply"
     * method of a Y.DataSchema.Base implementation.</p>
     *
     * @method _resolve
     * @param type {Object|String|Function} schema parser implemantation, its
     *  name, or a custom apply function to use over Base implementation
     * @return {Object} DataSchema parser implementation object
     * @protected
     */
    _resolve: function (type) {
        var impl;

        if (L.isString(type)) {
            // Tries e.g. DataSchema.json, DataSchema.JSON, then DataSchema.Json
            impl = DataSchema[type] || DataSchema[type.toUpperCase()] ||
                   DataSchema[type.charAt(0).toUpperCase() + type.slice(1)];
        } else if (isFunction(type)) {
            impl = Y.Object(DataSchema.Base);
            impl.apply = type;
        } else if (isObject(type) && isFunction(type.apply)) {
            impl = type;
        }

        if (!impl) {
            Y.log(type + " DataSchema not found. Defaulting to Base", "warn", "dataSchema");
        }

        return impl || DataSchema.Base;
    },

    /**
     * Pass the data to the schema parser implementation with the configured
     * schema.
     *
     * @method apply
     * @param data {mixed} input data to be parsed by the schema implementation
     * @return {Object} Schema-parsed data
     */
    apply: function (data) {
        var args = Y.Array(arguments,0,true);
        args.unshift(this.schema);

        return this._impl.apply.apply(this._impl, args);
    }

};

// Replace the object namespace with the constructor, migrating all
// schema implementations to static properties.
Y.DataSchema = Y.mix(DataSchema, Y.DataSchema);


}, 'gallery-2010.01.13-20' ,{requires:['dataschema-base']});
