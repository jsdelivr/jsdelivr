YUI.add('gallery-uuid', function(Y) {

/**
 * Contains methods for UUID generation
 * @module uuid
 */

/**
 * @class UUID
 */
var C = Y.namespace('Crypto'),
    u;

/**
 * Generate a UUID, optionally formatted according to RFC 4122
 *
 * @method generateUUID
 * @static
 * @param formatted Boolean If true, UUID will be formatted according to RFC 4122
 * @retuns string UUID either formatted with dashes or raw.
 */
C.UUID = u = function(formatted) {
    var uuid = u._randomUUID();
    return formatted ? u._formatUUIDString(uuid) : uuid;
};

Y.mix(u, {
/**
 * Format a 32-character string in the accepted format for UUIDs
 *
 * @method _formatUUIDString
 * @static
 * @private
 * @param uuid string 32-character string to have dashes added to match RFC 4122
 */
_formatUUIDString: function(uuid) {
    var work = [];
    work.push(uuid.substring(0, 8));
    work.push(uuid.substring(8, 12));
    work.push(uuid.substring(12, 16));
    work.push(uuid.substring(16, 20));
    work.push(uuid.substring(20));

    return work.join('-');
},

/**
 * Generate 32-bits of entropy and return them as an unsigned integer
 *
 * This version uses Math.random, so the entropy is only as good as the browser vendor's default random method. Further, since you can't generate an arbitary amount of entropy at once, this function is likely going to be called multiple times. It is impossible to guarantee quality of entropy using this method, but it is the fastest and simplest way to generate entropy. This is a 'good-enough' fallback formany uses, but if you need real guarantees of randomness, then you should consider other options.
 * 
 * @method _gen32BitEntropy
 * @static
 * @private
 * @returns int
 */
_gen32BitEntropy: function() { return (Math.random() * 0x100000000) | 0; },

/**
 * Convert a 32-bit integer into an 8-character hex string
 *
 * @method _intToHex
 * @static
 * @private
 * @params number int A number assumed to have been normalized to be a 32-bit unsigned integer.
 * @returns string
 */
_intToHex: function(number) { return ('00000000' + number.toString(16)).slice(-8); },

/**
 * Generate a random UUID, 128-bits of hex-enocded data, with the appopriate flags set for the random variant on UUID
 *
 * @method _randomUUID
 * @static
 * @private
 * @returns string
 */
_randomUUID: function() {
    var data = [];

    data.push(u._gen32BitEntropy());
    data.push(u._gen32BitEntropy());
    data.push(u._gen32BitEntropy());
    data.push(u._gen32BitEntropy());

    data[1] = (((data[1] >>> 4) << 4) >>> 0) + 4;
    data[2] = (((data[2] & 0xfcffffff) >>> 0) + 0x1000000);

    return u._intToHex(data[0]) + u._intToHex(data[1]) + u._intToHex(data[2]) + u._intToHex(data[3]);
}
});


}, 'gallery-2012.01.25-21-14' );
