/*
 * Storage for jQuery Collapse
 * --
 * source: http://github.com/danielstocks/jQuery-Collapse/
 * site: http://webcloud.se/code/jQuery-Collapse
 *
 * @author Daniel Stocks (http://webcloud.se)
 * Copyright 2012, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */

!function($) {

  var STORAGE_KEY = "jQuery-Collapse";

  function Storage(id) {
    this.id = id;
    this.db = window.localStorage || $.fn.collapse.cookieStorage;
    this.data = [];
  }
  Storage.prototype = {
    write: function(position, state) {
      var _this = this;
      _this.data[position] = state ? 1 : 0;
      // Pad out data array with zero values
      $.each(_this.data, function(i) {
        if(typeof _this.data[i] == 'undefined') {
          _this.data[i] = 0;
        }
      });
      var obj = this.getDataObject();
      obj[this.id] = this.data;
      this.db.setItem(STORAGE_KEY, JSON.stringify(obj));
    },
    read: function() {
      var obj = this.getDataObject();
      return obj[this.id] || [];
    },
    getDataObject: function() {
      var string = this.db.getItem(STORAGE_KEY);
      return string ? JSON.parse(string) : {}
    }
  }

  jQueryCollapseStorage = Storage;

}(jQuery);
