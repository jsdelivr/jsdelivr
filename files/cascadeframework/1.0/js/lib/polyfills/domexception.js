(function (global) {

  window.DOMException = window.DOMException || function DOMException() { throw new TypeError("Illegal constructor"); };
  var code_to_name = {},
      name_to_code = {
        // Introduced in DOM Level 1:
        INDEX_SIZE_ERR: 1,
        DOMSTRING_SIZE_ERR: 2,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        INVALID_CHARACTER_ERR: 5,
        NO_DATA_ALLOWED_ERR: 6,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INUSE_ATTRIBUTE_ERR: 10,
        // Introduced in DOM Level 2:
        INVALID_STATE_ERR: 11,
        SYNTAX_ERR: 12,
        INVALID_MODIFICATION_ERR: 13,
        NAMESPACE_ERR: 14,
        INVALID_ACCESS_ERR: 15,
        // Introduced in DOM Level 3:
        VALIDATION_ERR: 16,
        TYPE_MISMATCH_ERR: 17,
        // From other specifications:
        SECURITY_ERR: 18,
        NETWORK_ERR: 19,
        ABORT_ERR: 20,
        URL_MISMATCH_ERR: 21,
        QUOTA_EXCEEDED_ERR: 22,
        TIMEOUT_ERR: 23,
        INVALID_NODE_TYPE_ERR: 24,
        DATA_CLONE_ERR: 25
      };

  Object.keys(name_to_code).forEach(function (n) {
    code_to_name[name_to_code[n]] = n;
    window.DOMException[n] = name_to_code[n];
  });

  var funcs = (function () {
    var funcs = [], w = window, d = document, im = d.implementation, de = DOMException;
    funcs[de.INDEX_SIZE_ERR] = function () { d.createTextNode("").splitText(1); };
    //funcs[de.DOMSTRING_SIZE_ERR] = function () {};
    funcs[de.HIERARCHY_REQUEST_ERR] = function () { d.appendChild(d); };
    funcs[de.WRONG_DOCUMENT_ERR] = function () { var dt = im.createDocumentType('x'); im.createDocument('', '', dt); im.createDocument('', '', dt); };
    funcs[de.INVALID_CHARACTER_ERR] = function () { document.createElement("!"); };
    //funcs[de.NO_DATA_ALLOWED_ERR] = function () {};
    //funcs[de.NO_MODIFICATION_ALLOWED_ERR] = function () {};
    funcs[de.NOT_FOUND_ERR] = function () { d.removeChild(null); };
    funcs[de.NOT_SUPPORTED_ERR] = function () { d.createCDATASection(); };
    funcs[de.INUSE_ATTRIBUTE_ERR] = function () { var a = d.createElement('a'), n = d.createAttribute('n'); a.setAttributeNode(n); d.createElement('b').setAttributeNode(n); };
    funcs[de.INVALID_STATE_ERR] = function () { var r = d.createRange(); r.detach(); r.detach(); };
    funcs[de.SYNTAX_ERR] = function () { d.createElement('a').contentEditable = 'bogus'; };
    //funcs[de.INVALID_MODIFICATION_ERR] = function () {};
    funcs[de.NAMESPACE_ERR] = function () { d.createAttributeNS('', 'a:b'); };
    //funcs[de.INVALID_ACCESS_ERR] = function () {};
    //funcs[de.VALIDATION_ERR] = function () {};
    //funcs[de.TYPE_MISMATCH_ERR] = function () {};
    // ...
    funcs[de.INVALID_NODE_TYPE_ERR] = function () { d.createRange().selectNode(d.createElement('a')); }; // "DOM Range Exception 2"
    funcs[de.DATA_CLONE_ERR] = function () { w.postMessage(w); };
    return funcs;
  }());

  var DOMExceptionShim = (function () {
    function DOMException(name) {
      this.name = name || 'UNKNOWN_ERR';
    }
    DOMException.prototype = new DOMException();
    return DOMException;
  }());

  window.DOMException.create = function (code) {
    code = Number(code);

    if (Object.prototype.hasOwnProperty.call(funcs, code)) {
      try {
        funcs[code]();
      } catch (e) {
        if (e.code === code) {
          e.name = e.name || code_to_name[code];
          return e;
        }
      }
    }

    var name = Object.prototype.hasOwnProperty.call(code_to_name, code) ? code_to_name[code] : null,
          ex = new DOMExceptionShim(name);
    ex.code = code;
    ex.message = ex.name + ': DOM Exception ' + String(code);
    return ex;
  };

}(self));
