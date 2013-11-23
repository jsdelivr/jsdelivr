function bcmul (left_operand, right_operand, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)
  // -    depends on: _phpjs_shared_bc
  // *     example 1: bcmul(1, 2);
  // *     returns 1: 3
  //  @todo: implement these testcases
  //        bcscale(0);
  //
  //        bcmath.test.result('bcmul', 1, '2', bcmul("1", "2"));
  //        bcmath.test.result('bcmul', 2, '-15', bcmul("-3", "5"));
  //        bcmath.test.result('bcmul', 3, '12193263111263526900', bcmul("1234567890", "9876543210"));
  //        bcmath.test.result('bcmul', 4, '3.75', bcmul("2.5", "1.5", 2));
  //        bcmath.test.result('bcmul', 5, '13008.1522', bcmul("5573.33", "2.334", 4));
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

  result = libbcmath.bc_multiply(first, second, scale);

  if (result.n_scale > scale) {
    result.n_scale = scale;
  }
  return result.toString();
}
