function file (url) {
  // http://kevin.vanzonneveld.net
  // +   original by: Legaev Andrey
  // +      input by: Jani Hartikainen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.
  // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.
  // %        note 1: To avoid browser blocking issues's consider using jQuery's: $('#divId').load('http://url') instead.
  // *     example 1: file('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
  // *     returns 1: {0: '123'}
  var req = this.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
  if (!req) {
    throw new Error('XMLHttpRequest not supported');
  }

  req.open("GET", url, false);
  req.send(null);

  return req.responseText.split('\n');
}
