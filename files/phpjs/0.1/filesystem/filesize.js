function filesize (url) {
  // http://kevin.vanzonneveld.net
  // +   original by: Enrique Gonzalez
  // +      input by: Jani Hartikainen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: T. Wild
  // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.
  // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.
  // *     example 1: filesize('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
  // *     returns 1: '3'
  var req = this.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
  if (!req) {
    throw new Error('XMLHttpRequest not supported');
  }

  req.open('HEAD', url, false);
  req.send(null);

  if (!req.getResponseHeader) {
    try {
      throw new Error('No getResponseHeader!');
    } catch (e) {
      return false;
    }
  } else if (!req.getResponseHeader('Content-Length')) {
    try {
      throw new Error('No Content-Length!');
    } catch (e2) {
      return false;
    }
  } else {
    return req.getResponseHeader('Content-Length');
  }
}
