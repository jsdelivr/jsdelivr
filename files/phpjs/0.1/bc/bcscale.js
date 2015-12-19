function bcscale (scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)this.
  // -    depends on: _phpjs_shared_bc
  // *     example 1: bcscale(1);
  // *     returns 1: 3
  //  @todo: implement these testcases
  //        bcscale(0);
  //
  //        bcmath.test.result('bcscale', 1, false, bcscale('fail'));
  //        bcmath.test.result('bcscale', 2, false, bcscale(-1));
  //        bcmath.test.result('bcscale', 3, true, bcscale(5));
  //        bcmath.test.result('bcscale', 4, true, bcscale(0));
  var libbcmath = this._phpjs_shared_bc();

  scale = parseInt(scale, 10);
  if (isNaN(scale)) {
    return false;
  }
  if (scale < 0) {
    return false;
  }
  libbcmath.scale = scale;
  return true;
}
