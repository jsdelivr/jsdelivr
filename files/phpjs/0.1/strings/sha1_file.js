function sha1_file (str_filename) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // -    depends on: file_get_contents
  // -    depends on: sha1
  // *     example 1: sha1_file('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
  // *     returns 1: '40bd001563085fc35165329ea1ff5c5ecbdbbeef'
  var buf = this.file_get_contents(str_filename);
  return this.sha1(buf);
}
