function echo () {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +   improved by: echo is bad
  // +   improved by: Nate
  // +    revised by: Der Simon (http://innerdom.sourceforge.net/)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Eugene Bulkin (http://doubleaw.com/)
  // +   input by: JB
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: EdorFaus
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
  // %        note 1: we wouldn't need any such long code (even most of the code below). See
  // %        note 1: link below for a cross-browser implementation in JavaScript. HTML5 might
  // %        note 1: possibly support DOMParser, but that is not presently a standard.
  // %        note 2: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
  // %        note 2: use with a temporary holder before appending to the DOM (as is our last resort below),
  // %        note 2: since it may not work in an XML context
  // %        note 3: Using innerHTML to directly add to the BODY is very dangerous because it will
  // %        note 3: break all pre-existing references to HTMLElements.
  // *     example 1: echo('<div><p>abc</p><p>abc</p></div>');
  // *     returns 1: undefined
  // Fix: This function really needs to allow non-XHTML input (unless in true XHTML mode) as in jQuery
  var arg = '',
    argc = arguments.length,
    argv = arguments,
    i = 0,
    holder, win = this.window,
    d = win.document,
    ns_xhtml = 'http://www.w3.org/1999/xhtml',
    ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'; // If we're in a XUL context
  var stringToDOM = function (str, parent, ns, container) {
    var extraNSs = '';
    if (ns === ns_xul) {
      extraNSs = ' xmlns:html="' + ns_xhtml + '"';
    }
    var stringContainer = '<' + container + ' xmlns="' + ns + '"' + extraNSs + '>' + str + '</' + container + '>';
    var dils = win.DOMImplementationLS,
      dp = win.DOMParser,
      ax = win.ActiveXObject;
    if (dils && dils.createLSInput && dils.createLSParser) {
      // Follows the DOM 3 Load and Save standard, but not
      // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
      // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
      // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
      var lsInput = dils.createLSInput();
      // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
      lsInput.stringData = stringContainer;
      var lsParser = dils.createLSParser(1, null); // synchronous, no schema type
      return lsParser.parse(lsInput).firstChild;
    } else if (dp) {
      // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
      try {
        var fc = new dp().parseFromString(stringContainer, 'text/xml');
        if (fc && fc.documentElement && fc.documentElement.localName !== 'parsererror' && fc.documentElement.namespaceURI !== 'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
          return fc.documentElement.firstChild;
        }
        // If there's a parsing error, we just continue on
      } catch (e) {
        // If there's a parsing error, we just continue on
      }
    } else if (ax) { // We don't bother with a holder in Explorer as it doesn't support namespaces
      var axo = new ax('MSXML2.DOMDocument');
      axo.loadXML(str);
      return axo.documentElement;
    }
/*else if (win.XMLHttpRequest) { // Supposed to work in older Safari
      var req = new win.XMLHttpRequest;
      req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
      if (req.overrideMimeType) {
        req.overrideMimeType('application/xml');
      }
      req.send(null);
      return req.responseXML;
    }*/
    // Document fragment did not work with innerHTML, so we create a temporary element holder
    // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
    //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
    if (d.createElementNS && // Browser supports the method
    (d.documentElement.namespaceURI || // We can use if the document is using a namespace
    d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
    (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
    )) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
      holder = d.createElementNS(ns, container);
    } else {
      holder = d.createElement(container); // Document fragment did not work with innerHTML
    }
    holder.innerHTML = str;
    while (holder.firstChild) {
      parent.appendChild(holder.firstChild);
    }
    return false;
    // throw 'Your browser does not support DOM parsing as required by echo()';
  };


  var ieFix = function (node) {
    if (node.nodeType === 1) {
      var newNode = d.createElement(node.nodeName);
      var i, len;
      if (node.attributes && node.attributes.length > 0) {
        for (i = 0, len = node.attributes.length; i < len; i++) {
          newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
        }
      }
      if (node.childNodes && node.childNodes.length > 0) {
        for (i = 0, len = node.childNodes.length; i < len; i++) {
          newNode.appendChild(ieFix(node.childNodes[i]));
        }
      }
      return newNode;
    } else {
      return d.createTextNode(node.nodeValue);
    }
  };

  var replacer = function (s, m1, m2) {
    // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
    // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
    if (m1 !== '\\') {
      return m1 + eval(m2);
    } else {
      return s;
    }
  };

  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    ini = phpjs.ini,
    obs = phpjs.obs;
  for (i = 0; i < argc; i++) {
    arg = argv[i];
    if (ini && ini['phpjs.echo_embedded_vars']) {
      arg = arg.replace(/(.?)\{?\$(\w*?\}|\w*)/g, replacer);
    }

    if (!phpjs.flushing && obs && obs.length) { // If flushing we output, but otherwise presence of a buffer means caching output
      obs[obs.length - 1].buffer += arg;
      continue;
    }

    if (d.appendChild) {
      if (d.body) {
        if (win.navigator.appName === 'Microsoft Internet Explorer') { // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
          d.body.appendChild(stringToDOM(ieFix(arg)));
        } else {
          var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div').cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
          if (unappendedLeft) {
            d.body.appendChild(unappendedLeft);
          }
        }
      } else {
        d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description')); // We will not actually append the description tag (just using for providing XUL namespace by default)
      }
    } else if (d.write) {
      d.write(arg);
    }
/* else { // This could recurse if we ever add print!
      print(arg);
    }*/
  }
}
