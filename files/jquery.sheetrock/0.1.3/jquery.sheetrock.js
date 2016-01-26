/*
 * jQuery Sheetrock v0.1.3
 * Quickly connect to, query, and lazy-load data from Google Spreadsheets
 * Requires jQuery >=1.6
 * http://github.com/chriszarate/sheetrock
 */

;(function(sheetrock) {

  "use strict";

  /* AMD support */

  if(typeof define === 'function' && define.amd) {
    define('jquery.sheetrock', ['jquery'], sheetrock);
  } else {
    sheetrock(window.jQuery);
  }

})(function($) {

  "use strict";

  $.fn.sheetrock = function(options, data) {

    // Validate and store `this`.
    options.target = (this.length) ? this : false;

    // Load and validate options.
    options = _options(options);

    if(options) {

      if(_def(data) && data !== null) {
        // Process bootstrapped data.
        _data(options, data);
      } else {
        // Proceed if options are valid.
        _init(options);
      }

    }

    // Allow jQuery object chaining.
    return this;

  };


  /* Setup */

  // Column labels storage
  var _columns = {},

  // Callback index
  _callbackIndex = 0,

  // Data labels
  _error  = 'sheetrockError',
  _loaded = 'sheetrockLoaded',
  _offset = 'sheetrockRowOffset',


  /* Task runners */

  // Load data from API.
  _init = function(options) {

    // Chain off of previous promise.
    $.fn.sheetrock.promise = $.fn.sheetrock.promise

      // Prefetch column labels.
      .pipe(function() {
        return _prefetch(options);
      })

      // Fetch data.
      .pipe(function() {
        return _fetch(options);
      });

  },

  // Load local data.
  _data = function(options, data) {

    // Populate user-facing indicators.
    _begin(options);

    // Validate and load data.
    _validate.call(options, data);

    // Clean up.
    _always.call(options);

  },


  /* Fetch */

  // Prefetch column labels.
  _prefetch = function(options) {

    // Options for prefetching column labels
    var prefetch = {
      sql: 'select * limit 1',
      dataHandler: _columns_hash,
      userCallback: $.noop,
      target: false
    };

    if(options.sql.indexOf('%') !== -1 && !_get_columns(options)) {
      _log('Prefetching column labels.');
      return _fetch($.extend({}, options, prefetch));
    } else {
      return $.Deferred().resolve();
    }

  },

  // Send request with prevalidated options.
  _fetch = function(options) {

    // Populate user-facing indicators.
    _begin(options);

    // Enable chunking, if requested, and store offset as jQuery.data.
    if(options.chunkSize && options.target) {
      options.sql += ' limit ' + (options.chunkSize + 1) + ' offset ' + options.offset;
      _put(options.target, _offset, options.offset + options.chunkSize);
    }

    // Create callback environment
    options.callback = 'sheetrock_' + _callbackIndex++;

    // Create AJAX request.
    var request = {

      data: _params(options),
      context: options,
      url: $.fn.sheetrock.server,

      dataType: 'jsonp',
      cache: true,
      jsonp: false,
      jsonpCallback: options.callback

    };

    // Debug request.
    _log(request, options.debug);

    // Send request.
    return $.ajax(request)
      .promise()
      .done(_validate)
      .fail(_fail)
      .always(_always);

  },


  /* Data parsing */

  // Populate user-facing indicators.
  _begin = function(options) {

    // Show loading indicator.
    options.loading.show();

    // Increment the `working` flag.
    $.fn.sheetrock.working++;

  },

  // Validate returned data.
  _validate = function(data) {

    // Enumerate warnings.
    _enumerate(data, 'warnings');

    // Enumerate errors.
    _enumerate(data, 'errors');

    // Debug returned data.
    _log(data, this.debug);

    // Check for successful response types.
    if(_has(data, 'status', 'table') && _has(data.table, 'cols', 'rows')) {
      this.dataHandler.call(_extend.call(this, data), data);
    } else {
      _fail.call(this, data);
    }

  },

  // Generic error handler for AJAX errors.
  _fail = function() {
    _put(this.target, _error, 1);
    _log('Request failed.');
  },

  // Generic cleanup function for AJAX requests.
  _always = function() {

    // Hide loading indicator.
    this.loading.hide();

    // Let the user know we're done.
    this.userCallback(this);

    // Decrement the `working` flag.
    $.fn.sheetrock.working--;

  },

  // Enumerate messages.
  _enumerate = function(data, state) {
    if(_has(data, state)) {
      $.each(data[state], function(i, status) {
        if(_has(status, 'detailed_message')) {
          _log(status.detailed_message);
        } else if(_has(status, 'message')) {
          _log(status.message);
        }
      });
    }
  },

  // Extract information about the response and extend the options hash.
  _extend = function(data) {

    // Store reference to options hash.
    var options = this;

    // Initialize parsed options hash.
    options.parsed = {};

    // The Google API generates an unrecoverable error when the 'offset'
    // is larger than the number of available rows. As a workaround, we
    // request one more row than we need and stop when we see less rows
    // than we requested.

    options.parsed.last   = (options.chunkSize) ? Math.min(data.table.rows.length, options.chunkSize) : data.table.rows.length;
    options.parsed.loaded = (!options.chunkSize || options.parsed.last < options.chunkSize) ? 1 : 0;

    // Determine if Google has extracted column labels from a header row.
    options.parsed.header = ($.map(data.table.cols, _map_label).length) ? 1 : 0;

    // If no column labels are provided (or if there are too many or too
    // few), use the returned column labels.
    options.parsed.labels = (options.labels && options.labels.length === data.table.cols.length) ? options.labels : $.map(data.table.cols, _map_label_letter);

    // Store loaded status on target element.
    _put(options.target, _loaded, options.parsed.loaded);

    // Return extended options.
    return options;

  },

  // Parse data, row by row.
  _parse = function(data) {

    // Store reference to options hash.
    var options = this;

    // Output a header row if needed.
    if(!options.offset && !options.headersOff) {
      if(options.parsed.header || !options.headers) {
        options.target.append(options.rowHandler({
          num: 0,
          cells: _arr_to_obj(options.parsed.labels)
        }));
      }
    }

    // Each table cell ('c') can contain two properties: 'p' contains
    // formatting and 'v' contains the actual cell value.

    $.each(data.table.rows, function(i, obj) {

      if(_has(obj, 'c') && i < options.parsed.last) {

        var counter = _nat(options.offset + i + 1 + options.parsed.header - options.headers),
            objData = {num: counter, cells: {}};

        // Suppress header row if requested.
        if(counter || !options.headersOff) {

          $.each(obj.c, function(x, cell) {
            var style = (options.formatting) ? _style(cell) : false,
                value = (cell && _has(cell, 'v')) ? options.cellHandler(cell.v) : '';
            objData.cells[options.parsed.labels[x]] = (style) ? _wrap(value, 'span', style) : value;
          });

          // Pass to row handler and append to target.
          options.target.append(options.rowHandler(objData));

        }

      }

    });

  },

  // Store a columns hash in the plugin scope.
  _columns_hash = function(data) {
    var hash = {};
    $.each(data.table.cols, function(i, col) {
      hash[col.id] = _map_label_letter(col);
    });
    _columns[this.key + this.gid] = hash;
  },

  // Determine the best available columns hash, if any.
  _get_columns = function(options) {
    if($.isEmptyObject(options.columns)) {
      return _columns[options.key + options.gid] || false;
    } else {
      return options.columns;
    }
  },


  /* Validation and assembly */

  // Validate user-passed options.
  _options = function(options) {

    // Extend defaults.
    options = $.extend({}, $.fn.sheetrock.options, options);

    // Get spreadsheet key and gid.
    options.key = _key(options.url);
    options.gid = _gid(options.url);

    // Validate chunk size and header rows.
    options.chunkSize = (options.target) ? _nat(options.chunkSize) : 0;
    options.headers = _nat(options.headers);

    // Retrieve offset.
    options.offset = (options.chunkSize) ? _get(options.target, _offset) : 0;

    // Make sure `loading` is a jQuery object.
    options.loading = _val_jquery(options.loading);

    // Require `this` or a handler to receive the data.
    if(!options.target && options.dataHandler === _parse) {
      return _log('No element targeted or data handler provided.');
    // Abandon already-completed requests.
    } else if(_get(options.target, _loaded)) {
      return _log('No more rows to load!');
    // Abandon error-generating requests.
    } else if(_get(options.target, _error)) {
      return _log('A previous request for this resource failed.');
    // Require a spreadsheet URL.
    } else if(!options.url) {
      return _log('No spreadsheet URL provided.');
    // Require a spreadsheet key.
    } else if(!options.key) {
      return _log('Could not find a key in the provided URL.');
    // Require a spreadsheet gid.
    } else if(!options.gid) {
      return _log('Could not find a gid in the provided URL.');
    }

    // Debug options.
    _log(options, options.debug);

    return options;

  },

  // Create AJAX request paramater object.
  _params = function(options) {

    var params = {
      key: options.key,
      gid: options.gid,
      tqx: 'responseHandler:' + options.callback
    };

    // Optional SQL request.
    if(options.sql) {
      params.tq = _swap(options.sql, _get_columns(options));
    }

    return params;

  },


  /* Miscellaneous functions */

  // Trim string.
  _trim = function(str) {
    return str.toString().replace(/^ +/, '').replace(/ +$/, '');
  },

  // Parse as natural number (>=0).
  _nat = function(str) {
    return Math.max(0, parseInt(str, 10) || 0);
  },

  // Shorthand object property lookup. Accepts multiple properties.
  _has = function(obj) {
    for(var i = 1; i < arguments.length; i++) {
      if(!_def(obj[arguments[i]])) {
        return false;
      }
    }
    return true;
  },

  // Shorthand test for variable definition.
  _def = function(def) {
    return (typeof def === 'undefined') ? false : true;
  },

  // Shorthand log to console.
  _log = function(msg, show) {
    show = !_def(show) || (_def(show) && show);
    if(show && window.console && console.log) {
      console.log(msg);
    }
    return false;
  },

  // Shorthand data retrieval.
  _get = function(el, key) {
    return (el.length) ? $.data(el[0], key) || 0 : 0;
  },

  // Shorthand data storage.
  _put = function(el, key, val) {
    return (el.length) ? $.data(el[0], key, val) || 0 : 0;
  },

  // Extract the key from a spreadsheet URL.
  _key = function(url) {
    var keyRegExp = new RegExp('key=([a-z0-9-]{30,})&?','i');
    return (keyRegExp.test(url)) ? url.match(keyRegExp)[1] : false;
  },

  // Extract the gid from a spreadsheet URL.
  _gid = function(url) {
    var gidRegExp = new RegExp('gid=([0-9]+)','i');
    return (gidRegExp.test(url)) ? url.match(gidRegExp)[1] : false;
  },

  // Extract a label without whitespace.
  _label = function(col) {
    return (_has(col, 'label')) ? col.label.replace(/\s/g, '') : false;
  },

  // Map function: Return column label.
  _map_label = function(col) {
    return _label(col) || null;
  },

  // Map function: Return column label or letter.
  _map_label_letter = function(col) {
    return _label(col) || col.id;
  },

  // Swap column %labels% with column letters.
  _swap = function(sql, columns) {
    $.each(columns, function(key, val) {
      sql = sql.replace(new RegExp('%' + val + '%', 'g'), key);
    });
    return sql;
  },

  // Validate jQuery object or selector.
  _val_jquery = function(ref) {
    return (ref && !(ref instanceof $)) ? $(ref) : ref;
  },

  // Convert array to object.
  _arr_to_obj = function(arr) {
    var obj = {};
    $.each(arr, function(i, str) { obj[str] = str; });
    return obj;
  },

  // Extract formatting from a Google spreadsheet cell.
  _style = function(cell) {
    return (cell && _has(cell, 'p') && _has(cell.p, 'style')) ? cell.p.style : false;
  },

  // Output object to HTML (default row handler).
  _output = function(row) {
    var prop, str = '', tag = (row.num) ? 'td' : 'th';
    for(prop in row.cells) {
      if(_has(row.cells, prop)) {
        str += _wrap(row.cells[prop], tag, '');
      }
    }
    return _wrap(str, 'tr', '');
  },

  // Wrap string in tag.
  _wrap = function(str, tag, style) {
    var attr = (style) ? ' style="' + style + '"' : '';
    return '<' + tag + attr + '>' + str + '</' + tag + '>';
  };


  /* Default options */

  $.fn.sheetrock.options = {

    // Documentation is available at:
    // http://github.com/chriszarate/sheetrock

    url:          '',       // String  -- Google spreadsheet URL
    sql:          '',       // String  -- Google Visualization API query
    chunkSize:    0,        // Integer -- Number of rows to fetch (0 = all)
    columns:      {},       // Object  -- Hash of column letters and labels
    labels:       [],       // Array   -- Override *returned* column labels
    rowHandler:   _output,  // Function
    cellHandler:  _trim,    // Function
    dataHandler:  _parse,   // Function
    userCallback: $.noop,   // Function
    loading:      $(),      // jQuery object or selector
    debug:        false,    // Boolean -- Output raw data to the console
    headers:      0,        // Integer -- Number of header rows
    headersOff:   false,    // Boolean -- Suppress header row output
    formatting:   false     // Boolean -- Include Google HTML formatting

  };

  // Google API endpoint.
  $.fn.sheetrock.server = 'https://spreadsheets.google.com/tq';

  // This property is set to the number of active requests. This can be useful
  // for monitoring or for infinite scroll bindings.
  $.fn.sheetrock.working = 0;

  // This property contains a jQuery promise for the most recent request.
  $.fn.sheetrock.promise = $.Deferred().resolve();

  // Version number.
  $.fn.sheetrock.version = '0.1.3';

});
