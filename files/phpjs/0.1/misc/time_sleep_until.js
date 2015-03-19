function time_sleep_until (timestamp) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note: For study purposes. Current implementation could lock up the user's browser.
  // %          note: Expects a timestamp in seconds, so DO NOT pass in a JavaScript timestamp which are in milliseconds (e.g., new Date()) or otherwise the function will lock up the browser 1000 times longer than probably intended.
  // %          note: Consider using setTimeout() instead.
  // *     example 1: time_sleep_until(1233146501) // delays until the time indicated by the given timestamp is reached
  // *     returns 1: true
  while (new Date() < timestamp * 1000) {}
  return true;
}
