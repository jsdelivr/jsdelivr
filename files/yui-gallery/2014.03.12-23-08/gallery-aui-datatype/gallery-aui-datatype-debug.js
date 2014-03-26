YUI.add('gallery-aui-datatype', function(A) {

/**
 * The Datatype Utility
 *
 * @module aui-datatype
 */

var L = A.Lang,
	FALSE = 'false',
	TRUE = 'true',

	/**
	 * DataType.Boolean provides a set of utility to parse <code>falsey</code>
     * value to <code>false</code> and <code>non-falsey</code> to
     * <code>true</code>.
	 *
	 * @class DataType.Boolean
	 * @static
	 */
	DB = A.namespace('DataType.Boolean'),

	/**
	 * DataType.String provides a set of utility to provides a simple function
     * that evaluates a string to a primitive value (if possible). Supports
     * <code>true</code> and <code>false</code> also.
	 *
	 * @class DataType.String
	 * @static
	 */
	DS = A.namespace('DataType.String');

/**
 * Parses any <code>falsey</code> value to <code>false</code> and
 * <code>non-falsey</code> to <code>true</code>.
 * 
 * @for DataType.Boolean
 * @method parse
 * @param {*} data falsey or non-falsey values (i.e., falsey values: null, false, undefined, NaN; non-falsey values: 1, true, 'abc').
 * @return {boolean} Parsed value
 */
DB.parse = function(data) {
	data = A.Lang.trim(data);

	return (data == FALSE) ? false : !!data;
};

/**
 * Evaluates a string to a primitive value (if possible). Supports
 * <code>true</code> and <code>false</code> also. Unrecognized strings are
 * returned without any modification.
 * 
 * @for DataType.String
 * @method evaluate
 * @param {*} data Input data to be evaluated.
 * @return {boolean | null | number | String | undefined} Parsed value
 */
DS.evaluate = function(data) {
	var trimmedData = A.Lang.trim(data);

	// booleans
	if (trimmedData == TRUE || trimmedData == FALSE) {
		return DB.parse(data);
	}

	// Handle positive & negative numbers (integer or float)
	// Handle hexadecimal numbers: 0xFF -> 255
	// Handle exponential notation: 1e5 -> 100000
	if (trimmedData && L.isString(trimmedData)) {
		var number = +trimmedData;

		if (!isNaN(number)) {
			return number;
		}
	}

	return data;
};


}, 'gallery-2010.08.18-17-12' ,{skinnable:false, requires:['gallery-aui-base']});
