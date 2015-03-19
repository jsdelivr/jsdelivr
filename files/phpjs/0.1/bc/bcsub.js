function bcsub (left_operand, right_operand, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)
  // -    depends on: _phpjs_shared_bc
  // *     example 1: bcsub(1, 2);
  // *     returns 1: -1
  //  @todo: implement these testcases
  //        // set scale to zero
  //        bcscale(0);
  //
  //        bcmath.test.result('bcsub', 1, '-1', bcsub('1','2'));
  //        bcmath.test.result('bcsub', 2, '-6.0000', bcsub('-1','5', 4));
  //        bcmath.test.result('bcsub', 3, '8728932000054820705086578390258.00', bcsub('8728932001983192837219398127471','1928372132132819737213', 2));
  //        bcmath.test.result('bcsub', 4, '-1.111000', bcsub('1.123', '2.234', 6));
  //        bcmath.test.result('bcsub', 5, '-2.20', bcsub('1.123456', '3.333333', 2)); //-2.209877 note: rounding not applicable as bcmath truncates.
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

  result = libbcmath.bc_sub(first, second, scale);

  if (result.n_scale > scale) {
    result.n_scale = scale;
  }

  return result.toString();

}
