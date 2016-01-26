function gmstrftime (format, timestamp) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   input by: Alex
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: strftime
  // *     example 1: gmstrftime("%A", 1062462400);
  // *     returns 1: 'Tuesday'
  var dt = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
  (typeof timestamp === 'object') ? new Date(timestamp) : // Javascript Date()
  new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
  );
  timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;
  return this.strftime(format, timestamp);
}
