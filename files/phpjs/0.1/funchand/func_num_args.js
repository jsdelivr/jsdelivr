function func_num_args () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: May not work in all JS implementations
  // *     example 1: function tmp_a () {return func_num_args();}
  // *     example 1: tmp_a('a', 'b');
  // *     returns 1: 2
  if (!arguments.callee.caller) {
    try {
      throw new Error('Either you are using this in a browser which does not support the "caller" property or you are calling this from a global context');
      //return false;
    } catch (e) {
      return false;
    }
  }

  return arguments.callee.caller.arguments.length;
}
