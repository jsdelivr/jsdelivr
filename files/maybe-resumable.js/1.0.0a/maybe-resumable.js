function maybeResumable(opts) {
  var resumable = new Resumable(opts);
  if (resumable.support) {
    return resumable;
  }
  return new NotResumable(opts);
}
// Node.js-style export for Node and Component
if(typeof module != 'undefined') {
  module.exports = maybeResumable;
}