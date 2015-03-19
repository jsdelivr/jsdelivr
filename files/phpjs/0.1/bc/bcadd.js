function bcadd (left_operand, right_operand, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)
  // -    depends on: _phpjs_shared_bc
  // *     example 1: bcadd(1, 2);
  // *     returns 1: 3
  //  @todo: implement these testcases
  //        bcscale(0);
  //
  //        bcmath.test.result('bcadd', 1, '3', bcadd("1", "2"));
  //        bcmath.test.result('bcadd', 2, '4.0000', bcadd("-1", "5", 4));
  //        bcmath.test.result('bcadd', 3, '8728932003911564969352217864684.00', bcadd("1928372132132819737213", "8728932001983192837219398127471", 2));
  //        bcmath.test.result('bcadd', 4, '3.357000', bcadd('1.123', '2.234', 6));
  var libbcmath = this._phpjs_shared_bc();

  var first, second, result;

  if (typeof scale === 'undefined') {
    scale = libbcmath.scale;
  }
  scale = ((scale < 0) ? 0 : scale);

  // create objects
  first = libbcmath.bc_init_num();
  second = libbcmath.bc_init_num();
  result = libbcmath.bc_init_num();

  first = libbcmath.php_str2num(left_operand.toString());
  second = libbcmath.php_str2num(right_operand.toString());


  result = libbcmath.bc_add(first, second, scale);

  if (result.n_scale > scale) {
    result.n_scale = scale;
  }

  return result.toString();
}
