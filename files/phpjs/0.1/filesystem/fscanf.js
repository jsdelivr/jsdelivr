function fscanf (handle, format) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: fgets
  // -    depends on: sscanf
  // *     example 1: var handle = fopen('http://example.com/names_and_professions.html', 'r');
  // *     example 1: fscanf(handle, '%s\t%s\t%s\n');
  // *     returns 1: ['robert', 'slacker', 'us']

  var mixed; // Could be an array or an integer

  mixed = this.sscanf.apply(this, [fgets(handle), format].concat(Array.prototype.slice.call(arguments, 2)));

  return mixed;
}
