
// === msgpack ===
// MessagePack -> http://msgpack.sourceforge.net/

this.msgpack || (function(globalScope) {

globalScope.msgpack = {
    pack:       msgpackpack,    // msgpack.pack(data:Mix):ByteArray
    unpack:     msgpackunpack,  // msgpack.unpack(data:BinaryString/ByteArray):Mix
    worker:     "msgpack.js",   // msgpack.worker - WebWorkers script filename
    upload:     msgpackupload,  // msgpack.upload(url:String, option:Hash, callback:Function)
    download:   msgpackdownload // msgpack.download(url:String, option:Hash, callback:Function)
};

var _ie         = /MSIE/.test(navigator.userAgent),
    _bit2num    = {}, // BitStringToNumber      { "00000000": 0, ... "11111111": 255 }
    _bin2num    = {}, // BinaryStringToNumber   { "\00": 0, ... "\ff": 255 }
    _num2bin    = {}, // NumberToBinaryString   { 0: "\00", ... 255: "\ff" }
    _num2b64    = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                   "abcdefghijklmnopqrstuvwxyz0123456789+/").split(""),
    _sign       = { 8: 0x80, 16: 0x8000, 32: 0x80000000 },
    _split8char = /.{8}/g;

// for WebWorkers Code Block
self.importScripts && (onmessage = function(event) {
    if (event.data.method === "pack") {
        postMessage(base64encode(msgpackpack(event.data.data)));
    } else {
        postMessage(msgpackunpack(event.data.data));
    }
});

// msgpack.pack
function msgpackpack(data) { // @param Mix:
                             // @return ByteArray:
    return encode([], data);
}

// msgpack.unpack
function msgpackunpack(data) { // @param BinaryString/ByteArray:
                               // @return Mix:
    return { data: typeof data === "string" ? toByteArray(data)
                                            : data,
             index: -1, decode: decode }.decode();
}

// inner - encoder
function encode(rv,    // @param ByteArray: result
                mix) { // @param Mix: source data
    var size = 0, i = 0, iz, c, ary, hash,
        high, low, i64 = 0, sign, exp, frac;

    if (mix == null) { // null or undefined
        rv.push(0xc0);
    } else {
        switch (typeof mix) {
        case "boolean":
            rv.push(mix ? 0xc3 : 0xc2);
            break;
        case "number":
            if (mix !== mix) { // isNaN
                rv.push(0xcb, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff); // quiet NaN
            } else if (mix === Infinity) {
                rv.push(0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00); // positive infinity
            } else if (Math.floor(mix) === mix) {
                if (mix < 0) { // int
                    if (mix >= -32) { // negative fixnum
                        rv.push(0xe0 + mix + 32);
                    } else if (mix > -0x80) {
                        rv.push(0xd0, mix + 0x100);
                    } else if (mix > -0x8000) {
                        mix += 0x10000;
                        rv.push(0xd1, mix >> 8, mix & 0xff);
                    } else if (mix > -0x80000000) {
                        mix += 0x100000000;
                        rv.push(0xd2, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        ++i64;
                    }
                } else { // uint
                    if (mix < 0x80) {
                        rv.push(mix); // positive fixnum
                    } else if (mix < 0x100) { // uint 8
                        rv.push(0xcc, mix);
                    } else if (mix < 0x10000) { // uint 16
                        rv.push(0xcd, mix >> 8, mix & 0xff);
                    } else if (mix < 0x100000000) { // uint 32
                        rv.push(0xce, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        ++i64;
                    }
                }
                if (i64) {
                    high = Math.floor(mix / 0x100000000);
                    low = mix & (0x100000000 - 1);
                    rv.push(mix < 0 ? 0xd3 : 0xcf,
                                  (high >> 24) & 0xff, (high >> 16) & 0xff,
                                  (high >>  8) & 0xff,         high & 0xff,
                                  (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                                  (low  >>  8) & 0xff,          low & 0xff);
                }
            } else { // double
                // THX! edvakf
                // http://javascript.g.hatena.ne.jp/edvakf/20100614/1276503044
                hash = _bit2num;
                sign = mix < 0;
                sign && (mix *= -1);

                // add offset 1023 to ensure positive
                exp  = Math.log(mix) / Math.LN2 + 1023 | 0;

                // shift 52 - (exp - 1023) bits to make integer part exactly 53 bits,
                // then throw away trash less than decimal point
                frac = (Math.floor(mix * Math.pow(2, 52 + 1023 - exp))).
                        toString(2).slice(1);

                // exp is between 1 and 2047. make it 11 bits
                exp  = ("000000000" + exp.toString(2)).slice(-11);

                ary  = (+sign + exp + frac).match(_split8char);
                rv.push(0xcb, hash[ary[0]], hash[ary[1]],
                              hash[ary[2]], hash[ary[3]],
                              hash[ary[4]], hash[ary[5]],
                              hash[ary[6]], hash[ary[7]]);
            }
            break;
        case "string":
            // utf8.encode
            for (ary = [], iz = mix.length, i = 0; i < iz; ++i) {
                c = mix.charCodeAt(i);
                if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
                    ary.push(c & 0x7f);
                } else if (c < 0x0800) {
                    ary.push(((c >>>  6) & 0x1f) | 0xc0, (c & 0x3f) | 0x80);
                } else if (c < 0x10000) {
                    ary.push(((c >>> 12) & 0x0f) | 0xe0,
                             ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                }
            }
            setType(rv, 32, ary.length, [0xa0, 0xda, 0xdb]);
            Array.prototype.push.apply(rv, ary);
            break;
        default: // array or hash
            if (Object.prototype.toString.call(mix) === "[object Array]") { // array
                size = mix.length;
                setType(rv, 16, size, [0x90, 0xdc, 0xdd]);
                for (; i < size; ++i) {
                    encode(rv, mix[i]);
                }
            } else { // hash
                if (Object.keys) {
                    size = Object.keys(mix).length;
                } else {
                    for (i in mix) {
                        mix.hasOwnProperty(i) && ++size;
                    }
                }
                setType(rv, 16, size, [0x80, 0xde, 0xdf]);
                for (i in mix) {
                    encode(rv, i);
                    encode(rv, mix[i]);
                }
            }
        }
    }
    return rv;
}

// inner - decoder
function decode() { // @return Mix:
    var rv, undef, size, i = 0, iz, msb = 0, c, sign, exp, frac, key,
        that = this,
        data = that.data,
        type = data[++that.index];

    if (type >= 0xe0) {         // Negative FixNum (111x xxxx) (-32 ~ -1)
        return type - 0x100;
    }
    if (type < 0x80) {          // Positive FixNum (0xxx xxxx) (0 ~ 127)
        return type;
    }
    if (type < 0x90) {          // FixMap (1000 xxxx)
        size = type - 0x80;
        type = 0x80;
    } else if (type < 0xa0) {   // FixArray (1001 xxxx)
        size = type - 0x90;
        type = 0x90;
    } else if (type < 0xc0) {   // FixRaw (101x xxxx)
        size = type - 0xa0;
        type = 0xa0;
    }
    switch (type) {
    case 0xc0:  return null;
    case 0xc2:  return false;
    case 0xc3:  return true;
    case 0xca:  rv = readByte(that, 4);     // float
                sign = rv & _sign[32];      //  1bit
                exp  = (rv >> 23) & 0xff;   //  8bits
                frac = rv & 0x7fffff;       // 23bits
                if (!rv || rv === 0x80000000) { // 0.0 or -0.0
                    return 0;
                }
                if (exp === 0xff) { // NaN or Infinity
                    return frac ? NaN : Infinity;
                }
                return (sign ? -1 : 1) *
                            (frac | 0x800000) * Math.pow(2, exp - 127 - 23); // 127: bias
    case 0xcb:  rv = readByte(that, 4);     // double
                sign = rv & _sign[32];      //  1bit
                exp  = (rv >> 20) & 0x7ff;  // 11bits
                frac = rv & 0xfffff;        // 52bits - 32bits (high word)
                if (!rv || rv === 0x80000000) { // 0.0 or -0.0
                    return 0;
                }
                if (exp === 0x7ff) { // NaN or Infinity
                    readByte(that, 4); // seek index
                    return frac ? NaN : Infinity;
                }
                return (sign ? -1 : 1) *
                            ((frac | 0x100000)   * Math.pow(2, exp - 1023 - 20) // 1023: bias
                             + readByte(that, 4) * Math.pow(2, exp - 1023 - 52));
    case 0xcf:  return readByte(that, 4) * Math.pow(2, 32) +
                       readByte(that, 4);                       // uint 64
    case 0xce:  return readByte(that, 4);                       // uint 32
    case 0xcd:  return readByte(that, 2);                       // uint 16
    case 0xcc:  return readByte(that, 1);                       // uint 8
    case 0xd3:  return decodeInt64(that);                       // int 64
    case 0xd2:  rv = readByte(that, 4);                         // int 32
    case 0xd1:  rv === undef && (rv = readByte(that, 2));       // int 16
    case 0xd0:  rv === undef && (rv = readByte(that, 1));       // int 8
                msb = 4 << ((type & 0x3) + 1); // 8, 16, 32
                return rv < _sign[msb] ? rv : rv - _sign[msb] * 2;
    case 0xdb:  size = readByte(that, 4);                       // raw 32
    case 0xda:  size === undef && (size = readByte(that, 2));   // raw 16
    case 0xa0:  i = that.index + 1;                             // raw
                that.index += size;
                // utf8.decode
                for (rv = [], ri = -1, iz = i + size; i < iz; ++i) {
                    c = data[i]; // first byte
                    if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
                        rv[++ri] = c;
                    } else if (c < 0xe0) {
                        rv[++ri] = (c & 0x1f) <<  6 | (data[++i] & 0x3f);
                    } else if (c < 0xf0) {
                        rv[++ri] = (c & 0x0f) << 12 | (data[++i] & 0x3f) << 6
                                                    | (data[++i] & 0x3f);
                    }
                }
                return String.fromCharCode.apply(null, rv);
    case 0xdf:  size = readByte(that, 4);                       // map 32
    case 0xde:  size === undef && (size = readByte(that, 2));   // map 16
    case 0x80:  for (rv = {}; i < size; ++i) {                  // map
                    key = that.decode();
                    rv[key] = that.decode(); // key/value pair
                }
                return rv;
    case 0xdd:  size = readByte(that, 4);                       // array 32
    case 0xdc:  size === undef && (size = readByte(that, 2));   // array 16
    case 0x90:  for (rv = []; i < size; ++i) {                  // array
                    rv.push(that.decode());
                }
    }
    return rv;
}

// inner - read byte
function readByte(that,   // @param Object:
                  size) { // @param Number:
                          // @return Number:
    var rv = 0, data = that.data, i = that.index;

    switch (size) {
    case 4: rv += data[++i] * 0x1000000 + (data[++i] << 16);
    case 2: rv += data[++i] << 8;
    case 1: rv += data[++i];
    }
    that.index = i;
    return rv;
}

// inner - decode int64
function decodeInt64(that) { // @param Object:
                             // @return Number:
    var rv, overflow = 0,
        bytes = that.data.slice(that.index + 1, that.index + 9);

    that.index += 8;

    // avoid overflow
    if (bytes[0] & 0x80) {

        ++overflow;
        bytes[0] ^= 0xff;
        bytes[1] ^= 0xff;
        bytes[2] ^= 0xff;
        bytes[3] ^= 0xff;
        bytes[4] ^= 0xff;
        bytes[5] ^= 0xff;
        bytes[6] ^= 0xff;
        bytes[7] ^= 0xff;
    }
    rv = bytes[0] * 0x100000000000000
       + bytes[1] *   0x1000000000000
       + bytes[2] *     0x10000000000
       + bytes[3] *       0x100000000
       + bytes[4] *         0x1000000
       + bytes[5] *           0x10000
       + bytes[6] *             0x100
       + bytes[7];
    return overflow ? (rv + 1) * -1 : rv;
}

// inner - set type and fixed size
function setType(rv,      // @param ByteArray: result
                 fixSize, // @param Number: fix size. 16 or 32
                 size,    // @param Number: size
                 types) { // @param ByteArray: type formats. eg: [0x90, 0xdc, 0xdd]
    if (size < fixSize) {
        rv.push(types[0] + size);
    } else if (size < 0x10000) { // 16
        rv.push(types[1], size >> 8, size & 0xff);
    } else if (size < 0x100000000) { // 32
        rv.push(types[2], size >>> 24, (size >> 16) & 0xff,
                                       (size >>  8) & 0xff, size & 0xff);
    }
}

// msgpack.download - load from server
function msgpackdownload(url,        // @param String:
                         option,     // @param Hash: { worker, timeout, before, after }
                                     //    option.worker - Boolean(= false): true is use WebWorkers
                                     //    option.timeout - Number(= 10): timeout sec
                                     //    option.before  - Function: before(xhr, option)
                                     //    option.after   - Function: after(xhr, option, { status, ok })
                         callback) { // @param Function: callback(data, option, { status, ok })
                                     //    data   - Mix/null:
                                     //    option - Hash:
                                     //    status - Number: HTTP status code
                                     //    ok     - Boolean:
    option.method = "GET";
    option.binary = true;
    ajax(url, option, callback);
}

// msgpack.upload - save to server
function msgpackupload(url,        // @param String:
                       option,     // @param Hash: { data, worker, timeout, before, after }
                                   //    option.data - Mix:
                                   //    option.worker - Boolean(= false): true is use WebWorkers
                                   //    option.timeout - Number(= 10): timeout sec
                                   //    option.before  - Function: before(xhr, option)
                                   //    option.after   - Function: after(xhr, option, { status, ok })
                       callback) { // @param Function: callback(data, option, { status, ok })
                                   //    data   - String: responseText
                                   //    option - Hash:
                                   //    status - Number: HTTP status code
                                   //    ok     - Boolean:
    option.method = "PUT";
    option.binary = true;

    if (option.worker && globalScope.Worker) {
        var worker = new Worker(msgpack.worker);

        worker.onmessage = function(event) {
            option.data = event.data;
            ajax(url, option, callback);
        };
        worker.postMessage({ method: "pack", data: option.data });
    } else {
        // pack and base64 encode
        option.data = base64encode(msgpackpack(option.data));
        ajax(url, option, callback);
    }
}

// inner -
function ajax(url,        // @param String:
              option,     // @param Hash: { data, ifmod, method, timeout,
                          //                header, binary, before, after, worker }
                          //    option.data    - Mix: upload data
                          //    option.ifmod   - Boolean: true is "If-Modified-Since" header
                          //    option.method  - String: "GET", "POST", "PUT"
                          //    option.timeout - Number(= 10): timeout sec
                          //    option.header  - Hash(= {}): { key: "value", ... }
                          //    option.binary  - Boolean(= false): true is binary data
                          //    option.before  - Function: before(xhr, option)
                          //    option.after   - Function: after(xhr, option, { status, ok })
                          //    option.worker  - Boolean(= false): true is use WebWorkers
              callback) { // @param Function: callback(data, option, { status, ok })
                          //    data   - String/Mix/null:
                          //    option - Hash:
                          //    status - Number: HTTP status code
                          //    ok     - Boolean:
    function readyStateChange() {
        if (xhr.readyState === 4) {
            var data, status = xhr.status, worker, byteArray,
                rv = { status: status, ok: status >= 200 && status < 300 };

            if (!run++) {
                if (method === "PUT") {
                    data = rv.ok ? xhr.responseText : "";
                } else {
                    if (rv.ok) {
                        if (option.worker && globalScope.Worker) {
                            worker = new Worker(msgpack.worker);
                            worker.onmessage = function(event) {
                                callback(event.data, option, rv);
                            };
                            worker.postMessage({ method: "unpack",
                                                 data: xhr.responseText });
                            gc();
                            return;
                        } else {
                            byteArray = _ie ? toByteArrayIE(xhr)
                                            : toByteArray(xhr.responseText);
                            data = msgpackunpack(byteArray);
                        }
                    }
                }
                after && after(xhr, option, rv);
                callback(data, option, rv);
                gc();
            }
        }
    }

    function ng(abort, status) {
        if (!run++) {
            var rv = { status: status || 400, ok: false };

            after && after(xhr, option, rv);
            callback(null, option, rv);
            gc(abort);
        }
    }

    function gc(abort) {
        abort && xhr && xhr.abort && xhr.abort();
        watchdog && (clearTimeout(watchdog), watchdog = 0);
        xhr = null;
        globalScope.addEventListener &&
            globalScope.removeEventListener("beforeunload", ng, false);
    }

    var watchdog = 0,
        method = option.method || "GET",
        header = option.header || {},
        before = option.before,
        after = option.after,
        data = option.data || null,
        xhr = globalScope.XMLHttpRequest ? new XMLHttpRequest() :
              globalScope.ActiveXObject  ? new ActiveXObject("Microsoft.XMLHTTP") :
              null,
        run = 0, i,
        overrideMimeType = "overrideMimeType",
        setRequestHeader = "setRequestHeader",
        getbinary = method === "GET" && option.binary;

    try {
        xhr.onreadystatechange = readyStateChange;
        xhr.open(method, url, true); // ASync

        before && before(xhr, option);

        getbinary && xhr[overrideMimeType] &&
            xhr[overrideMimeType]("text/plain; charset=x-user-defined");
        data &&
            xhr[setRequestHeader]("Content-Type",
                                  "application/x-www-form-urlencoded");

        for (i in header) {
            xhr[setRequestHeader](i, header[i]);
        }

        globalScope.addEventListener &&
            globalScope.addEventListener("beforeunload", ng, false); // 400: Bad Request

        xhr.send(data);
        watchdog = setTimeout(function() {
            ng(1, 408); // 408: Request Time-out
        }, (option.timeout || 10) * 1000);
    } catch (err) {
        ng(0, 400); // 400: Bad Request
    }
}

// inner - BinaryString To ByteArray
function toByteArray(data) { // @param BinaryString: "\00\01"
                             // @return ByteArray: [0x00, 0x01]
    var rv = [], bin2num = _bin2num, remain,
        ary = data.split(""),
        i = -1, iz;

    iz = ary.length;
    remain = iz % 8;

    while (remain--) {
        ++i;
        rv[i] = bin2num[ary[i]];
    }
    remain = iz >> 3;
    while (remain--) {
        rv.push(bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]]);
    }
    return rv;
}

// inner - BinaryString to ByteArray
function toByteArrayIE(xhr) {
    var rv = [], data, remain,
        charCodeAt = "charCodeAt",
        loop, v0, v1, v2, v3, v4, v5, v6, v7,
        i = -1, iz;

    iz = vblen(xhr);
    data = vbstr(xhr);
    loop = Math.ceil(iz / 2);
    remain = loop % 8;

    while (remain--) {
        v0 = data[charCodeAt](++i); // 0x00,0x01 -> 0x0100
        rv.push(v0 & 0xff, v0 >> 8);
    }
    remain = loop >> 3;
    while (remain--) {
        v0 = data[charCodeAt](++i);
        v1 = data[charCodeAt](++i);
        v2 = data[charCodeAt](++i);
        v3 = data[charCodeAt](++i);
        v4 = data[charCodeAt](++i);
        v5 = data[charCodeAt](++i);
        v6 = data[charCodeAt](++i);
        v7 = data[charCodeAt](++i);
        rv.push(v0 & 0xff, v0 >> 8, v1 & 0xff, v1 >> 8,
                v2 & 0xff, v2 >> 8, v3 & 0xff, v3 >> 8,
                v4 & 0xff, v4 >> 8, v5 & 0xff, v5 >> 8,
                v6 & 0xff, v6 >> 8, v7 & 0xff, v7 >> 8);
    }
    iz % 2 && rv.pop();

    return rv;
}

// inner - base64.encode
function base64encode(data) { // @param ByteArray:
                              // @return Base64String:
    var rv = [],
        c = 0, i = -1, iz = data.length,
        pad = [0, 2, 1][data.length % 3],
        num2bin = _num2bin,
        num2b64 = _num2b64;

    if (globalScope.btoa) {
        while (i < iz) {
            rv.push(num2bin[data[++i]]);
        }
        return btoa(rv.join(""));
    }
    --iz;
    while (i < iz) {
        c = (data[++i] << 16) | (data[++i] << 8) | (data[++i]); // 24bit
        rv.push(num2b64[(c >> 18) & 0x3f],
                num2b64[(c >> 12) & 0x3f],
                num2b64[(c >>  6) & 0x3f],
                num2b64[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");
    return rv.join("");
}

// --- init ---
(function() {
    var i = 0, v;

    for (; i < 0x100; ++i) {
        v = String.fromCharCode(i);
        _bit2num[("0000000" + i.toString(2)).slice(-8)] = i;
        _bin2num[v] = i; // "\00" -> 0x00
        _num2bin[i] = v; //     0 -> "\00"
    }
    // http://twitter.com/edvakf/statuses/15576483807
    for (i = 0x80; i < 0x100; ++i) { // [Webkit][Gecko]
        _bin2num[String.fromCharCode(0xf700 + i)] = i; // "\f780" -> 0x80
    }
})();

_ie && document.write('<script type="text/vbscript">\
Function vblen(b)vblen=LenB(b.responseBody)End Function\n\
Function vbstr(b)vbstr=CStr(b.responseBody)+chr(0)End Function</'+'script>');

})(this);
