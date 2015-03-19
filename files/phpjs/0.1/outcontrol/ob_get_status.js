function ob_get_status (full_status) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ob_get_status(true);
  // *     returns 1: [{chunk_size:4096, name:myCallback, del:true, type:1,status:0}]

  var i = 0,
    retObj = {},
    ob = {},
    retArr = [],
    name = '';
  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };

  this.php_js = this.php_js || {};
  var phpjs = this.php_js,
    ini = phpjs.ini,
    obs = phpjs.obs;

  if (!obs || !obs.length) {
    if (ini && ini.output_buffering && (typeof ini.output_buffering.local_value !== 'string' || ini.output_buffering.local_value.toLowerCase() !== 'off')) { // handler itself is stored in 'output_handler' ini
      retObj = {
        type: 1,
        status: 0,
        name: 'default output handler',
        del: true
      };
      if (full_status) {
        retObj.chunk_size = 4096;
        return [retObj];
      } else {
        retObj.level = 1;
        return retObj;
      }
    }
    return retArr;
  }
  if (full_status) {
    for (i = 0; i < obs.length; i++) {
      ob = obs[i];
      name = ob.callback && getFuncName(ob.callback) ? (getFuncName(ob.callback) === 'URLRewriter' ? 'URL-Rewriter' : getFuncName(ob.callback)) : undefined;
      retObj = {
        chunk_size: ob.chunk_size,
        name: name,
        del: ob.erase,
        type: ob.type,
        status: ob.status
      };
      if (ob.size) {
        retObj.size = ob.size;
      }
      if (ob.block_size) {
        retObj.block_size = ob.block_size;
      }
      retArr.push(retObj);
    }
    return retArr;
  }
  ob = obs[phpjs.obs.length - 1];
  name = getFuncName(ob.callback);
  return {
    level: phpjs.obs.length,
    name: name,
    del: ob.erase,
    type: ob.type,
    status: ob.status
  };
}
