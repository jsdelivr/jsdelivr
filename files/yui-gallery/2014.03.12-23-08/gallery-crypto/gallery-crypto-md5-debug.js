YUI.add('gallery-crypto-md5', function(Y) {

var _C = Y.Crypto || { };

Y.mix(_C, {
	/**
	 * Adds two numerics as if they were 32-bit integers.
	 *
	 * @method add32Bit
	 * 
	 * @param {int} first operand 
	 * @param {int} second operand
	 * 
	 * @static
	 */ 
	add32Bit: function (x,y) {
		return (x  + y) & 0xffffffff;
	},
  /**
	 * Converts a standard JavaScript string (utf16) to a UTF8 string
	 *
	 * @method utf16ToUtf8
	 * 
	 * @param {string} The utf16 encoded string to convert to a utf8 array
	 * 
	 * @static
	 */ 
	utf16ToUtf8: function(string) {
		var output = "", cd, pr, i = 0;
		
		while (i < string.length) {
			cd = string.charCodeAt(i);
			pr = i + 1 < string.length ? string.charCodeAt(i + 1) : 0;
			
			if (0xd800 <= cd && cd <= 0xdbff && 0xdc00 <= pr && pr <= 0xdfff) {
				// Surrogate Pair
				cd = 0x10000 + ((cd & 0x3ff) + (pr & 0x03ff));
				i += 1;
			}
			
			if (cd <= 0x007f) {
				output += String.fromCharCode(cd);
			} else if (cd <= 0x07ff) {
				output += String.fromCharCode(0xc0 | ((cd >>> 6) & 15),
																			0x80 |  (cd & 63));
			} else if (cd <= 0xffff) {
				output += String.fromCharCode(0xe0 | ((cd >>> 12) & 15 ),
																			0x80 | ((cd >>>  6) & 63),
																			0x80 |  (cd & 63));
			} else if (cd <= 0x1fffff) {
				output += String.fromCharCode(0xf0 | ((cd >>> 18) & 15),
																			0x80 | ((cd >>> 12) & 63),
																			0x80 | ((cd >>>  6) & 63),
																			0x80 |  (cd & 63));
			}
			i += 1;
		}
		return output;
	},
	/**
	 * Converts a utf8 encoded string to a byte array. It's important to use a
	 * utf8 encoded string, because otherwise characters with individual bytes
	 * greater than 255 will be silently dropped.
	 *
	 * @method utf8ToByteArray
	 * 
	 * @param {string} The utf8 encoded string to convert to a byte array
	 * 
	 * @static
	 */ 
	utf8ToByteArray: function(string) {
		var output = Array(string.length >> 2), i, j;
		for (i = 0 ; i < output.length ; i += 1) { output[i] = 0; }
		for (i = 0 ; i < string.length ; i += 1) {
			j = i * 8;
			output[j >> 5] |= (string.charCodeAt(i) & 0xff) << (j % 32);
		}
		return output;
	},
	byteArrayToString: function(array) {
		var output = "", i, code;
		for (i = 0 ; i < array.length * 32 ; i += 8) {
			code = (array[i >> 5] >>> (i % 32));
			output += String.fromCharCode(code & 0xff);
		}
		return output;
	},
	utf8ToHex: function(string) {
		var output = "", i, cd, chars = "0123456789abcdef";
		for (i = 0 ; i < string.length ; i += 1) {
			cd = string.charCodeAt(i);
			output += chars.charAt(( cd >>> 4) & 0x0f) +
							  chars.charAt( cd & 0x0f);
		}
		return output;
	},
	/**
	 * Converts a standard JavaScript string (utf16) to a Byte Array
	 *
	 * @method stringToByteArray
	 * 
	 * @param {string} The utf16 encoded string to convert to a byte array
	 * 
	 * @static
	 */ 
	stringToByteArray: function(string) {
		return _C.utf8ToByteArray(_C.utf16ToUtf8(string));
	}
});

Y.Crypto = _C;

_C = Y.Crypto;

_C.MD5 = function (msg) {
	var rotate_left = function(x, n) {
			return ((x) << (n)) | (x >>> (32-n));
		},
		transform_common = function (v, a, b, x, s, ac) {
			var t = _C.add32Bit(_C.add32Bit(_C.add32Bit(a, v), x || 0), ac);
			return _C.add32Bit(rotate_left(t, s), b);
		},
		FF = function(a, b, c, d, x, s, ac) {
			return transform_common(((b & c) | ((~b) & d)), a, b, x, s, ac);
		},
		GG = function(a, b, c, d, x, s, ac) {
			return transform_common(((b & d) | (c & (~d))), a, b, x, s, ac);
		},
		HH = function(a, b, c, d, x, s, ac) {
			return transform_common((b ^ c ^ d), a, b, x, s, ac);
		},
		II = function(a, b, c, d, x, s, ac) {
			return transform_common((c ^ (b | (~d))), a, b, x, s, ac);
		},
		data = _C.stringToByteArray(msg), 
		len = msg.length * 8,
		a = 0x67452301,
		b = 0xefcdab89,
		c = 0x98badcfe,
		d = 0x10325476, i, s1, s2, s3, s4;
  data[len >> 5] |= 0x80 << ((len) % 32);
	data[(((len + 64) >>> 9) << 4) + 14] = len;
	for ( i = 0 ; i < data.length ; i += 16) {
		s1 = a; s2 = b; s3 = c; s4 = d;
		
			/* Round 1 */
	  a = FF (a, b, c, d, data[i + 0], 7, 0xd76aa478); /* 1 */
	  d = FF (d, a, b, c, data[i + 1], 12, 0xe8c7b756); /* 2 */
	  c = FF (c, d, a, b, data[i + 2], 17, 0x242070db); /* 3 */
	  b = FF (b, c, d, a, data[i + 3], 22, 0xc1bdceee); /* 4 */
	  a = FF (a, b, c, d, data[i + 4], 7, 0xf57c0faf); /* 5 */
	  d = FF (d, a, b, c, data[i + 5], 12, 0x4787c62a); /* 6 */
	  c = FF (c, d, a, b, data[i + 6], 17, 0xa8304613); /* 7 */
	  b = FF (b, c, d, a, data[i + 7], 22, 0xfd469501); /* 8 */
	  a = FF (a, b, c, d, data[i + 8], 7, 0x698098d8); /* 9 */
	  d = FF (d, a, b, c, data[i + 9], 12, 0x8b44f7af); /* 10 */
	  c = FF (c, d, a, b, data[i +10], 17, 0xffff5bb1); /* 11 */
	  b = FF (b, c, d, a, data[i +11], 22, 0x895cd7be); /* 12 */
	  a = FF (a, b, c, d, data[i +12], 7, 0x6b901122); /* 13 */
	  d = FF (d, a, b, c, data[i +13], 12, 0xfd987193); /* 14 */
	  c = FF (c, d, a, b, data[i +14], 17, 0xa679438e); /* 15 */
	  b = FF (b, c, d, a, data[i +15], 22, 0x49b40821); /* 16 */
	
	 /* Round 2 */
	  a = GG (a, b, c, d, data[i + 1], 5, 0xf61e2562); /* 17 */
	  d = GG (d, a, b, c, data[i + 6], 9, 0xc040b340); /* 18 */
	  c = GG (c, d, a, b, data[i +11], 14, 0x265e5a51); /* 19 */
	  b = GG (b, c, d, a, data[i + 0], 20, 0xe9b6c7aa); /* 20 */
	  a = GG (a, b, c, d, data[i + 5], 5, 0xd62f105d); /* 21 */
	  d = GG (d, a, b, c, data[i +10], 9,  0x2441453); /* 22 */
	  c = GG (c, d, a, b, data[i +15], 14, 0xd8a1e681); /* 23 */
	  b = GG (b, c, d, a, data[i + 4], 20, 0xe7d3fbc8); /* 24 */
	  a = GG (a, b, c, d, data[i + 9], 5, 0x21e1cde6); /* 25 */
	  d = GG (d, a, b, c, data[i +14], 9, 0xc33707d6); /* 26 */
	  c = GG (c, d, a, b, data[i + 3], 14, 0xf4d50d87); /* 27 */
	  b = GG (b, c, d, a, data[i + 8], 20, 0x455a14ed); /* 28 */
	  a = GG (a, b, c, d, data[i +13], 5, 0xa9e3e905); /* 29 */
	  d = GG (d, a, b, c, data[i + 2], 9, 0xfcefa3f8); /* 30 */
	  c = GG (c, d, a, b, data[i + 7], 14, 0x676f02d9); /* 31 */
	  b = GG (b, c, d, a, data[i +12], 20, 0x8d2a4c8a); /* 32 */
	
	  /* Round 3 */
	  a = HH (a, b, c, d, data[i + 5], 4, 0xfffa3942); /* 33 */
	  d = HH (d, a, b, c, data[i + 8], 11, 0x8771f681); /* 34 */
	  c = HH (c, d, a, b, data[i +11], 16, 0x6d9d6122); /* 35 */
	  b = HH (b, c, d, a, data[i +14], 23, 0xfde5380c); /* 36 */
	  a = HH (a, b, c, d, data[i + 1], 4, 0xa4beea44); /* 37 */
	  d = HH (d, a, b, c, data[i + 4], 11, 0x4bdecfa9); /* 38 */
	  c = HH (c, d, a, b, data[i + 7], 16, 0xf6bb4b60); /* 39 */
	  b = HH (b, c, d, a, data[i +10], 23, 0xbebfbc70); /* 40 */
	  a = HH (a, b, c, d, data[i +13], 4, 0x289b7ec6); /* 41 */
	  d = HH (d, a, b, c, data[i + 0], 11, 0xeaa127fa); /* 42 */
	  c = HH (c, d, a, b, data[i + 3], 16, 0xd4ef3085); /* 43 */
	  b = HH (b, c, d, a, data[i + 6], 23,  0x4881d05); /* 44 */
	  a = HH (a, b, c, d, data[i + 9], 4, 0xd9d4d039); /* 45 */
	  d = HH (d, a, b, c, data[i +12], 11, 0xe6db99e5); /* 46 */
	  c = HH (c, d, a, b, data[i +15], 16, 0x1fa27cf8); /* 47 */
	  b = HH (b, c, d, a, data[i + 2], 23, 0xc4ac5665); /* 48 */
	
	  /* Round 4 */
	  a = II (a, b, c, d, data[i + 0], 6, 0xf4292244); /* 49 */
	  d = II (d, a, b, c, data[i + 7], 10, 0x432aff97); /* 50 */
	  c = II (c, d, a, b, data[i +14], 15, 0xab9423a7); /* 51 */
	  b = II (b, c, d, a, data[i + 5], 21, 0xfc93a039); /* 52 */
	  a = II (a, b, c, d, data[i +12], 6, 0x655b59c3); /* 53 */
	  d = II (d, a, b, c, data[i + 3], 10, 0x8f0ccc92); /* 54 */
	  c = II (c, d, a, b, data[i +10], 15, 0xffeff47d); /* 55 */
	  b = II (b, c, d, a, data[i + 1], 21, 0x85845dd1); /* 56 */
	  a = II (a, b, c, d, data[i + 8], 6, 0x6fa87e4f); /* 57 */
	  d = II (d, a, b, c, data[i +15], 10, 0xfe2ce6e0); /* 58 */
	  c = II (c, d, a, b, data[i + 6], 15, 0xa3014314); /* 59 */
	  b = II (b, c, d, a, data[i +13], 21, 0x4e0811a1); /* 60 */
	  a = II (a, b, c, d, data[i + 4], 6, 0xf7537e82); /* 61 */
	  d = II (d, a, b, c, data[i +11], 10, 0xbd3af235); /* 62 */
	  c = II (c, d, a, b, data[i + 2], 15, 0x2ad7d2bb); /* 63 */
	  b = II (b, c, d, a, data[i + 9], 21, 0xeb86d391); /* 64 */
	  
	  a = _C.add32Bit(a, s1);
	  b = _C.add32Bit(b, s2);
	  c = _C.add32Bit(c, s3);
	  d = _C.add32Bit(d, s4);
	}
	return _C.utf8ToHex(_C.byteArrayToString([a, b, c, d]));
};


}, 'gallery-2009.11.19-20' );
