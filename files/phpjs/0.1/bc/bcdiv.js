function bcdiv (left_operand, right_operand, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)
  // -    depends on: _phpjs_shared_bc
  // *     example 1: bcdiv(1, 2);
  // *     returns 1: 3
  //  @todo: implement these testcases
  //        bcscale(0);
  //
  //        bcmath.test.result('bcdiv', 1, '0', bcdiv("1", "2"));
  //        bcmath.test.result('bcdiv', 2, '0.50', bcdiv("1", "2", 2));
  //        bcmath.test.result('bcdiv', 3, '-0.2000', bcdiv("-1", "5", 4));
  //        bcmath.test.result('bcdiv', 4, '3333.3333', bcdiv("10000.0000", "3", 4));
  //        bcmath.test.result('bcdiv', 5, '2387.8877', bcdiv("5573.33", "2.334", 4));
  //        bcmath.test.result('bcdiv', 7, '1.00', bcdiv('6.00', '6.00', 2));
  //        bcmath.test.result('bcdiv', 8, '1.00', bcdiv('2.00', '2.00', 2));
  //        bcmath.test.result('bcdiv', 9, '59.51111111', bcdiv('66.95', '1.125', 8));
  //        bcmath.test.result('bcdiv', 10, '4526580661.75', bcdiv('8728932001983192837219398127471.00', '1928372132132819737213.00', 2));
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

  result = libbcmath.bc_divide(first, second, scale);
  if (result === -1) {
    // error
    throw new Error(11, "(BC) Division by zero");
  }
  if (result.n_scale > scale) {
    result.n_scale = scale;
  }
  return result.toString();
}
