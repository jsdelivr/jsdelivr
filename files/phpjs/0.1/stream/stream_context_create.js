function stream_context_create (options, params) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Can be made to work as a wrapper for proprietary contexts as well
  // *     example 1: var opts = {http:{ method:'GET', header: 'Accept-language: en\r\nCookie: foo=bar\r\n' } };
  // *     example 1: var context = stream_context_create(opts);
  // *     example 1: get_resource_type(context);
  // *     returns 1: 'stream-context'
  var resource = {};
  options = options || {};
  // params.notification is only property currently in PHP for params
  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.resourceIdCounter = this.php_js.resourceIdCounter || 0;

  function PHPJS_Resource(type, id, opener) { // Can reuse the following for other resources, just changing the instantiation
    // See http://php.net/manual/en/resource.php for types
    this.type = type;
    this.id = id;
    this.opener = opener;
  }
  PHPJS_Resource.prototype.toString = function () {
    return 'Resource id #' + this.id;
  };
  PHPJS_Resource.prototype.get_resource_type = function () {
    return this.type;
  };
  PHPJS_Resource.prototype.var_dump = function () {
    return 'resource(' + this.id + ') of type (' + this.type + ')';
    // return 'resource('+this.id+'), '+this.type+')'; another format
  };
  // END REDUNDANT
  this.php_js.resourceIdCounter++;

  resource = new PHPJS_Resource('stream-context', this.php_js.resourceIdCounter, 'stream_context_create');
  resource.stream_options = options;
  resource.stream_params = params;

  return resource;
}
