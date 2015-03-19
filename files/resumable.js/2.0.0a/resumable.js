/*
 * MIT Licensed
 * @link http://www.23developer.com/opensource
 * @link http://github.com/23/resumable.js
 * @author Steffen Tiedemann Christensen, steffen@23company.com
 * @version 2.0.0
 */

/**
 * Resumable is a library providing multiple simultaneous, stable and
 * resumable uploads via the HTML5 File API.
 * @param [opts]
 * @param {number} [opts.chunkSize]
 * @param {bool} [opts.forceChunkSize]
 * @param {number} [opts.simultaneousUploads]
 * @param {bool} [opts.singleFile]
 * @param {string} [opts.fileParameterName]
 * @param {number} [opts.progressCallbacksInterval]
 * @param {number} [opts.speedSmoothingFactor]
 * @param {Object|Function} [opts.query]
 * @param {Object} [opts.headers]
 * @param {bool} [opts.withCredentials]
 * @param {Function} [opts.preprocess]
 * @param {string} [opts.method]
 * @param {bool} [opts.prioritizeFirstAndLastChunk]
 * @param {string} [opts.target]
 * @param {number} [opts.maxChunkRetries]
 * @param {number} [opts.chunkRetryInterval]
 * @param {Array.<number>} [opts.permanentErrors]
 * @param {Function} [opts.generateUniqueIdentifier]
 * @constructor
 */
function Resumable(opts) {
  "use strict";

  /**
   * Library version
   * @name Resumable.version
   * @type {string}
   */
  this.version = '2.0.0';

  /**
   * Supported by browser?
   * @name Resumable.support
   * @type {boolean}
   */
  this.support = (
    typeof File !== 'undefined'
    && typeof Blob !== 'undefined'
    && typeof FileList !== 'undefined'
    && (
      !!Blob.prototype.slice
      || !!Blob.prototype.webkitSlice
      || !!Blob.prototype.mozSlice
      || false
    ) // slicing files support
  );

  if (!this.support) {
    return ;
  }

  /**
   * Alias of Resumable
   * @type {Resumable}
   */
  var $ = this;

  /**
   * List of ResumableFile objects
   * @name Resumable.files
   * @type {Array.<ResumableFile>}
   */
  $.files = [];

  /**
   * Default options for resumable.js
   * @name Resumable.defaults
   * @type {Object}
   */
  $.defaults = {
    chunkSize: 1024 * 1024,
    forceChunkSize: false,
    simultaneousUploads: 3,
    singleFile: false,
    fileParameterName: 'file',
    progressCallbacksInterval: 500,
    speedSmoothingFactor: 0.1,
    query: {},
    headers: {},
    withCredentials: false,
    preprocess: null,
    method: 'multipart',
    prioritizeFirstAndLastChunk: false,
    target: '/',
    testChunks: true,
    generateUniqueIdentifier: null,
    maxChunkRetries: 0,
    chunkRetryInterval: null,
    permanentErrors: [404, 415, 500, 501]
  };

  /**
   * Current options
   * @name Resumable.opts
   * @type {Object}
   */
  $.opts = {};

  /**
   * List of events:
   *  even indexes stand for event names
   *  odd indexes stands for event callbacks
   * @name Resumable.events
   * @type {Array}
   */
  $.events = [];

  /**
   * Private helper functions
   */
  var $h = {};

  /**
   * Extends the destination object `dst` by copying all of the properties from
   * the `src` object(s) to `dst`. You can specify multiple `src` objects.
   * @function
   * @name $h.extend
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   * @returns {Object} Reference to `dst`.
   */
  $h.extend = function (dst) {
    $h.each(arguments, function(obj) {
      if (obj !== dst) {
        $h.each(obj, function(key, value){
          dst[key] = value;
        });
      }
    });
    return dst;
  };

  /**
   * Iterate each element of an object
   * @function
   * @name $h.each
   * @param {Array|Object} o object or an array to iterate
   * @param {Function} callback for array firs argument stands for a value,
   *  for object first arguments stands for a key and second for a value.
   */
  $h.each = function (o, callback) {
    if (typeof(o.length) !== 'undefined') {
      // Array
      for (var i = 0; i < o.length; i++) {
        if (callback(o[i]) === false) {
          return;
        }
      }
    } else {
      for (i in o) {
        // Object
        if (o.hasOwnProperty(i) && callback(i, o[i]) === false) {
          return;
        }
      }
    }
  };

  /**
   * Generate unique identifier for a file
   * @function
   * @name $h.generateUniqueIdentifier
   * @param {ResumableFile} file
   * @returns {string}
   */
  $h.generateUniqueIdentifier = function (file) {
    var custom = $.opts.generateUniqueIdentifier;
    if (typeof custom === 'function') {
      return custom(file);
    }
    // Some confusion in different versions of Firefox
    var relativePath = file.webkitRelativePath || file.fileName || file.name;
    var size = file.size;
    return size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, '');
  };

  /**
   * Get target option with query params
   * @function
   * @name $h.getTarget
   * @param params
   * @returns {string}
   */
  $h.getTarget = function(params){
    var target = $.opts.target;
    if(target.indexOf('?') < 0) {
      target += '?';
    } else {
      target += '&';
    }
    return target + params.join('&');
  };

  /**
   * On drop event
   * @function
   * @param {MouseEvent} event
   */
  var onDrop = function (event) {
    event.stopPropagation();
    event.preventDefault();
    appendFilesFromFileList(event.dataTransfer.files, event);
  };

  /**
   * On drag over event
   * @function
   * @param {MouseEvent} event
   */
  var onDragOver = function (event) {
    event.preventDefault();
  };

  /**
   * Append files from file list object
   * @function
   * @param {FileList} fileList
   * @param {Event} [event] event is optional
   */
  var appendFilesFromFileList = function (fileList, event) {
    var files = [];
    $h.each(fileList, function (file) {
      // Directories have size `0` and name `.`
      // Ignore already added files
      if (!(!file.size && (file.name == '.' || file.fileName == '.')) &&
          !$.getFromUniqueIdentifier($h.generateUniqueIdentifier(file))) {
        var f = new ResumableFile($, file);
        if ($.fire('fileAdded', f, event)) {
          files.push(f);
        }
      }
    });
    if ($.fire('filesAdded', files, event)) {
      $h.each(files, function (file) {
        if ($.opts.singleFile && $.files.length > 0) {
          $.removeFile($.files[0]);
        }
        $.files.push(file);
      });
    }
    $.fire('filesSubmitted', files, event);
  };

  /**
   * ResumableFile class
   * @name ResumableFile
   * @param {Resumable} resumableObj
   * @param {File} file
   * @constructor
   */
  function ResumableFile(resumableObj, file) {
    /**
     * Alias for this
     * @type {ResumableFile}
     */
    var $ = this;

    /**
     * Reference to parent Resumable instance
     * @name ResumableFile.resumableObj
     * @type {Resumable}
     */
    $.resumableObj = resumableObj;

    /**
     * Reference to file
     * @name ResumableFile.file
     * @type {File}
     */
    $.file = file;

    /**
     * File name. Some confusion in different versions of Firefox
     * @name ResumableFile.name
     * @type {string}
     */
    $.name = file.fileName || file.name;

    /**
     * File size
     * @name ResumableFile.size
     * @type {number}
     */
    $.size = file.size;

    /**
     * Relative file path
     * @name ResumableFile.relativePath
     * @type {string}
     */
    $.relativePath = file.webkitRelativePath || $.name;

    /**
     * File unique identifier
     * @name ResumableFile.uniqueIdentifier
     * @type {string}
     */
    $.uniqueIdentifier = $h.generateUniqueIdentifier(file);

    /**
     * List of chunks
     * @name ResumableFile.chunks
     * @type {Array.<ResumableChunk>}
     */
    $.chunks = [];

    /**
     * Indicated if file is paused
     * @name ResumableFile.paused
     * @type {boolean}
     */
    $.paused = false;

    /**
     * Indicated if file has encountered an error
     * @name ResumableFile.error
     * @type {boolean}
     */
    $.error = false;

    /**
     * Average upload speed
     * @name ResumableFile.averageSpeed
     * @type {number}
     */
    $.averageSpeed = 0;

    /**
     * Current upload speed
     * @name ResumableFile.currentSpeed
     * @type {number}
     */
    $.currentSpeed = 0;

    /**
     * Date then progress was called last time
     * @name ResumableFile._lastProgressCallback
     * @type {number}
     * @private
     */
    $._lastProgressCallback = Date.now();

    /**
     * Previously uploaded file size
     * @name ResumableFile._prevUploadedSize
     * @type {number}
     * @private
     */
    $._prevUploadedSize = 0;

    /**
     * Holds previous progress
     * @name ResumableFile._prevProgress
     * @type {number}
     * @private
     */
    $._prevProgress = 0;


    /**
     * Update speed parameters
     * @link http://stackoverflow.com/questions/2779600/how-to-estimate-download-time-remaining-accurately
     * @function
     */
    function measureSpeed() {
      var smoothingFactor = $.resumableObj.opts.speedSmoothingFactor;
      var timeSpan = Date.now() - $._lastProgressCallback;
      var uploaded = $.sizeUploaded();
      // Prevent negative upload speed after file upload resume
      $.currentSpeed = Math.max((uploaded - $._prevUploadedSize) / timeSpan * 1000, 0);
      $.averageSpeed = smoothingFactor * $.currentSpeed + (1 - smoothingFactor) * $.averageSpeed;
      $._prevUploadedSize = uploaded;
    }

    /**
     * For internal usage only.
     * Callback when something happens within the chunk.
     * @name ResumableFile.chunkEvent
     * @function
     * @param {string} event can be 'progress', 'success', 'error' or 'retry'
     * @param {string} message
     */
    $.chunkEvent = function (event, message) {
      switch (event) {
        case 'progress':
          if (Date.now() - $._lastProgressCallback <
              $.resumableObj.opts.progressCallbacksInterval) {
            break;
          }
          measureSpeed();
          $.resumableObj.fire('fileProgress', $);
          $.resumableObj.fire('progress');
          $._lastProgressCallback = Date.now();
          break;
        case 'error':
          $.error = true;
          $.abort();
          $.chunks = [];
          $.resumableObj.fire('fileError', $, message);
          $.resumableObj.fire('error', message, $);
          break;
        case 'success':
          if ($.error) {
            return;
          }
          $.resumableObj.fire('fileProgress', $);
          $.resumableObj.fire('progress');
          if ($.isComplete()) {
            $.resumableObj.fire('fileSuccess', $, message);
          }
          break;
        case 'retry':
          $.resumableObj.fire('fileRetry', $);
          break;
      }
    };

    /**
     * Pause file upload
     * @name ResumableFile.pause
     * @function
     */
    $.pause = function() {
      $.paused = true;
      $.abort();
    };

    /**
     * Resume file upload
     * @name ResumableFile.resume
     * @function
     */
    $.resume = function() {
      $.paused = false;
      $.resumableObj.upload();
    };

    /**
     * Abort current upload
     * @name ResumableFile.abort
     * @function
     */
    $.abort = function () {
      $.currentSpeed = 0;
      $.averageSpeed = 0;
      $h.each($.chunks, function (c) {
        if (c.status() == 'uploading') {
          c.abort();
          $.resumableObj.uploadNextChunk();
        }
      });
    };

    /**
     * Cancel current upload and remove from a list
     * @name ResumableFile.cancel
     * @function
     */
    $.cancel = function () {
      $.resumableObj.removeFile($);
    };

    /**
     * Retry aborted file upload
     * @name ResumableFile.retry
     * @function
     */
    $.retry = function () {
      $.bootstrap();
      $.resumableObj.upload();
    };

    /**
     * Clear current chunks and slice file again
     * @name ResumableFile.bootstrap
     * @function
     */
    $.bootstrap = function () {
      $.abort();
      $.error = false;
      // Rebuild stack of chunks from file
      $.chunks = [];
      $._prevProgress = 0;
      var round = $.resumableObj.opts.forceChunkSize ? Math.ceil : Math.floor;
      var chunks = Math.max(
        round($.file.size / $.resumableObj.opts.chunkSize), 1
      );
      for (var offset = 0; offset < chunks; offset++) {
        $.chunks.push(
          new ResumableChunk($.resumableObj, $, offset)
        );
      }
    };

    /**
     * Get current upload progress status
     * @name ResumableFile.progress
     * @function
     * @returns {number} from 0 to 1
     */
    $.progress = function () {
      if ($.error) {
        return 1;
      }
      // Sum up progress across everything
      var bytesLoaded = 0;
      $h.each($.chunks, function (c) {
        bytesLoaded += c.progress() * (c.endByte - c.startByte); // get chunk progress relative to entire file
      });
      var percent = bytesLoaded / $.size;
      // We don't want to lose percentages when an upload is paused
      $._prevProgress = Math.max($._prevProgress, percent > 0.999 ? 1 : percent);
      return $._prevProgress;
    };

    /**
     * Indicates if file is being uploaded at the moment
     * @name ResumableFile.isUploading
     * @function
     * @returns {boolean}
     */
    $.isUploading = function () {
      var uploading = false;
      $h.each($.chunks, function (chunk) {
        if (chunk.status() == 'uploading') {
          uploading = true;
          return false;
        }
      });
      return uploading;
    };

    /**
     * Indicates if file is has finished uploading and received a response
     * @name ResumableFile.isComplete
     * @function
     * @returns {boolean}
     */
    $.isComplete = function () {
      var outstanding = false;
      $h.each($.chunks, function (chunk) {
        var status = chunk.status();
        if (status == 'pending'
            || status == 'uploading'
            || chunk.preprocessState === 1) {
          outstanding = true;
          return false;
        }
      });
      return !outstanding;
    };

    /**
     * Count total size uploaded
     * @name ResumableFile.sizeUploaded
     * @function
     * @returns {number}
     */
    $.sizeUploaded = function () {
      var size = 0;
      $h.each($.chunks, function (chunk) {
        // can't sum only chunk.loaded values, because it is bigger than chunk size
        if (chunk.status() == 'success') {
          size += chunk.endByte - chunk.startByte;
        } else {
          size += chunk.loaded;
        }
      });
      return size;
    };

    /**
     * Time remaining in seconds
     * @name ResumableFile.timeRemaining
     * @function
     * @returns {number}
     */
    $.timeRemaining = function () {
      if (!$.averageSpeed) {
        return 0;
      }
      return Math.floor(Math.max(file.size - $.sizeUploaded(), 0) / $.averageSpeed);
    };

    /**
     * Get file type
     * @name ResumableFile.getType
     * @function
     * @returns {string}
     */
    $.getType = function () {
      return $.file.type && $.file.type.split('/')[1];
    };

    /**
     * Get file extension
     * @name ResumableFile.getExtension
     * @function
     * @returns {string}
     */
    $.getExtension = function () {
      return $.name.substr((~-$.name.lastIndexOf(".") >>> 0) + 2).toLowerCase();
    };

    $.bootstrap();
  }

  /**
   * Class for storing a single chunk
   * @name ResumableChunk
   * @param {Resumable} resumableObj
   * @param {ResumableFile} fileObj
   * @param {number} offset
   * @constructor
   */
  function ResumableChunk(resumableObj, fileObj, offset) {
    /**
     * Alias for this
     * @type {ResumableChunk}
     */
    var $ = this;

    /**
     * Reference to parent resumable object
     * @name ResumableChunk.resumableObj
     * @type {Resumable}
     */
    $.resumableObj = resumableObj;

    /**
     * Reference to parent ResumableFile object
     * @name ResumableChunk.fileObj
     * @type {ResumableFile}
     */
    $.fileObj = fileObj;

    /**
     * File size
     * @name ResumableChunk.fileObjSize
     * @type {number}
     */
    $.fileObjSize = fileObj.size;

    /**
     * File offset
     * @name ResumableChunk.offset
     * @type {number}
     */
    $.offset = offset;

    /**
     * Indicates if chunk existence was checked on the server
     * @name ResumableChunk.tested
     * @type {boolean}
     */
    $.tested = false;

    /**
     * Number of retries performed
     * @name ResumableChunk.retries
     * @type {number}
     */
    $.retries = 0;

    /**
     * Pending retry
     * @name ResumableChunk.pendingRetry
     * @type {boolean}
     */
    $.pendingRetry = false;

    /**
     * Preprocess state
     * @name ResumableChunk.preprocessState
     * @type {number} 0 = unprocessed, 1 = processing, 2 = finished
     */
    $.preprocessState = 0;

    /**
     * Bytes transferred from total request size
     * @name ResumableChunk.loaded
     * @type {number}
     */
    $.loaded = 0;

    /**
     * Total request size
     * @name ResumableChunk.total
     * @type {number}
     */
    $.total = 0;

    /**
     * Size of a chunk
     * @type {number}
     */
    var chunkSize = $.resumableObj.opts.chunkSize;

    /**
     * Chunk start byte in a file
     * @name ResumableChunk.startByte
     * @type {number}
     */
    $.startByte = $.offset * chunkSize;

    /**
     * Chunk end byte in a file
     * @name ResumableChunk.endByte
     * @type {number}
     */
    $.endByte = Math.min($.fileObjSize, ($.offset + 1) * chunkSize);

    /**
     * XMLHttpRequest
     * @name ResumableChunk.xhr
     * @type {XMLHttpRequest}
     */
    $.xhr = null;

    if ($.fileObjSize - $.endByte < chunkSize
        && !$.resumableObj.opts.forceChunkSize) {
      // The last chunk will be bigger than the chunk size,
      // but less than 2*chunkSize
      $.endByte = $.fileObjSize;
    }

    /**
     * Get params for a request
     * @function
     * @name ResumableChunk.getParams
     */
    $.getParams = function () {
      return {
        resumableChunkNumber: $.offset + 1,
        resumableChunkSize: $.resumableObj.opts.chunkSize,
        resumableCurrentChunkSize: $.endByte - $.startByte,
        resumableTotalSize: $.fileObjSize,
        resumableIdentifier: $.fileObj.uniqueIdentifier,
        resumableFilename: $.fileObj.name,
        resumableRelativePath: $.fileObj.relativePath,
        resumableTotalChunks: $.fileObj.chunks.length
      };
    };

    /**
     * Makes a GET request without any data to see if the chunk has already
     * been uploaded in a previous session
     * @function
     * @name ResumableChunk.test
     */
    $.test = function () {
      // Set up request and listen for event
      $.xhr = new XMLHttpRequest();
      $.xhr.addEventListener("load", testHandler, false);
      $.xhr.addEventListener("error", testHandler, false);
      var data = prepareXhrRequest('GET');
      $.xhr.send(data);
    };

    /**
     * Finish preprocess state
     * @function
     * @name ResumableChunk.preprocessFinished
     */
    $.preprocessFinished = function () {
      $.preprocessState = 2;
      $.send();
    };

    /**
     * Uploads the actual data in a POST call
     * @function
     * @name ResumableChunk.send
     */
    $.send = function () {
      var preprocess = $.resumableObj.opts.preprocess;
      if (typeof preprocess === 'function') {
        switch ($.preprocessState) {
          case 0:
            preprocess($);
            $.preprocessState = 1;
            return;
          case 1:
            return;
          case 2:
            break;
        }
      }
      if ($.resumableObj.opts.testChunks && !$.tested) {
        $.test();
        return;
      }

      $.loaded = 0;
      $.total = 0;
      $.pendingRetry = false;

      var func = ($.fileObj.file.slice ? 'slice' :
        ($.fileObj.file.mozSlice ? 'mozSlice' :
          ($.fileObj.file.webkitSlice ? 'webkitSlice' :
            'slice')));
      var bytes = $.fileObj.file[func]($.startByte, $.endByte);

      // Set up request and listen for event
      $.xhr = new XMLHttpRequest();
      $.xhr.upload.addEventListener('progress', progressHandler, false);
      $.xhr.addEventListener("load", doneHandler, false);
      $.xhr.addEventListener("error", doneHandler, false);

      var data = prepareXhrRequest('POST', $.resumableObj.opts.method, bytes);

      $.xhr.send(data);
    };

    /**
     * Abort current xhr request
     * @function
     * @name ResumableChunk.abort
     */
    $.abort = function () {
      // Abort and reset
      var xhr = $.xhr;
      $.xhr = null;
      if (xhr) {
        xhr.abort();
      }
    };

    /**
     * Retrieve current chunk upload status
     * @function
     * @name ResumableChunk.status
     * @returns {string} 'pending', 'uploading', 'success', 'error'
     */
    $.status = function () {
      if ($.pendingRetry) {
        // if pending retry then that's effectively the same as actively uploading,
        // there might just be a slight delay before the retry starts
        return 'uploading';
      } else if (!$.xhr) {
        return 'pending';
      } else if ($.xhr.readyState < 4) {
        // Status is really 'OPENED', 'HEADERS_RECEIVED'
        // or 'LOADING' - meaning that stuff is happening
        return 'uploading';
      } else {
        if ($.xhr.status == 200) {
          // HTTP 200, perfect
          return 'success';
        } else if ($.resumableObj.opts.permanentErrors.indexOf($.xhr.status) > -1
            || $.retries >= $.resumableObj.opts.maxChunkRetries) {
          // HTTP 415/500/501, permanent error
          return 'error';
        } else {
          // this should never happen, but we'll reset and queue a retry
          // a likely case for this would be 503 service unavailable
          $.abort();
          return 'pending';
        }
      }
    };

    /**
     * Get response from xhr request
     * @function
     * @name ResumableChunk.message
     * @returns {String}
     */
    $.message = function () {
      return $.xhr ? $.xhr.responseText : '';
    };

    /**
     * Get upload progress
     * @function
     * @name ResumableChunk.progress
     * @returns {number}
     */
    $.progress = function () {
      if ($.pendingRetry) {
        return 0;
      }
      var s = $.status();
      switch (s) {
        case 'success':
        case 'error':
          return 1;
        case 'pending':
          return 0;
        default:
          return $.total > 0 ? $.loaded / $.total : 0;
      }
    };

    /**
     * Prepare Xhr request. Set query, headers and data
     * @param {string} method GET or POST
     * @param {string} [paramsMethod] octet or form
     * @param {Blob} [blob] to send
     * @returns {FormData|Blob|Null} data to send
     */
    function prepareXhrRequest(method, paramsMethod, blob) {
      // Add data from the query options
      var query = $.resumableObj.opts.query;
      if (typeof query == "function") {
        query = query($.fileObj, $);
      }
      query = $h.extend($.getParams(), query);

      var target = $.resumableObj.opts.target;
      var data = null;
      if (method == 'GET' || paramsMethod == 'octet') {
        // Add data from the query options
        var params = [];
        $h.each(query, function (k, v) {
          params.push([encodeURIComponent(k), encodeURIComponent(v)].join('='));
        });
        target = $h.getTarget(params);
        data = blob || null;
      } else {
        // Add data from the query options
        data = new FormData();
        $h.each(query, function (k, v) {
          data.append(k, v);
        });
        data.append($.resumableObj.opts.fileParameterName, blob);
      }

      $.xhr.open(method, target);
      $.xhr.withCredentials = $.resumableObj.opts.withCredentials;

      // Add data from header options
      $h.each($.resumableObj.opts.headers, function (k, v) {
        $.xhr.setRequestHeader(k, v);
      });

      return data;
    }

    /**
     * Catch progress event
     * @param {ProgressEvent} event
     */
    function progressHandler(event) {
      if (event.lengthComputable) {
        $.loaded = event.loaded ;
        $.total = event.total;
      }
      $.fileObj.chunkEvent('progress');
    }

    /**
     * Catch test event
     * @param {Event} event
     */
    function testHandler(event) {
      var status = $.status();
      if (status == 'success') {
        $.tested = true;
        $.fileObj.chunkEvent(status, $.message());
        $.resumableObj.uploadNextChunk();
      } else if (!$.fileObj.paused) {// Error might be caused by file pause method
        $.tested = true;
        $.send();
      }
    }

    /**
     * Upload has stopped
     * @param {Event} event
     */
    function doneHandler(event) {
      var status = $.status();
      if (status == 'success' || status == 'error') {
        $.fileObj.chunkEvent(status, $.message());
        $.resumableObj.uploadNextChunk();
      } else {
        $.fileObj.chunkEvent('retry', $.message());
        $.pendingRetry = true;
        $.abort();
        $.retries++;
        var retryInterval = $.resumableObj.opts.chunkRetryInterval;
        if (retryInterval !== null) {
          setTimeout($.send, retryInterval);
        } else {
          $.send();
        }
      }
    }
  }

  //
  // Public api begin
  //

  /**
   * Set a callback for an event, possible events:
   * fileSuccess(file), fileProgress(file), fileAdded(file, event),
   * fileRetry(file), fileError(file, message), complete(),
   * progress(), error(message, file), pause()
   * @name Resumable.on
   * @function
   * @param {string} event
   * @param {Function} callback
   */
  $.on = function (event, callback) {
    $.events.push(event.toLowerCase(), callback);
  };

  /**
   * Fire an event
   * @name Resumable.fire
   * @function
   * @param {string} event event name
   * @param [...] arguments fo a callback
   * @return {bool} value is false if at least one of the event handlers which handled this event
   * returned false. Otherwise it returns true.
   */
  $.fire = function (event) {
    // `arguments` is an object, not array, in FF, so:
    var args = Array.prototype.slice.call(arguments);
    // Find event listeners, and support pseudo-event `catchAll`
    event = event.toLowerCase();
    var preventDefault = false;
    for (var i = 0; i <= $.events.length; i += 2) {
      if ($.events[i] == event) {
        preventDefault = $.events[i + 1].apply($, args.slice(1)) === false || preventDefault;
      }
      if ($.events[i] == 'catchall') {
        preventDefault = $.events[i + 1].apply(null, args) === false || preventDefault;
      }
    }
    return !preventDefault;
  };

  /**
   * Upload next chunk from the queue
   * @function
   * @name Resumable.uploadNextChunk
   * @returns {boolean}
   * @private
   */
  $.uploadNextChunk = function () {
    var found = false;

    // In some cases (such as videos) it's really handy to upload the first
    // and last chunk of a file quickly; this let's the server check the file's
    // metadata and determine if there's even a point in continuing.
    if ($.opts.prioritizeFirstAndLastChunk) {
      $h.each($.files, function (file) {
        if (!file.paused && file.chunks.length
            && file.chunks[0].status() == 'pending'
            && file.chunks[0].preprocessState === 0) {
          file.chunks[0].send();
          found = true;
          return false;
        }
        if (!file.paused && file.chunks.length > 1
            && file.chunks[file.chunks.length - 1].status() == 'pending'
            && file.chunks[0].preprocessState === 0) {
          file.chunks[file.chunks.length - 1].send();
          found = true;
          return false;
        }
      });
      if (found) {
        return true;
      }
    }

    // Now, simply look for the next, best thing to upload
    $h.each($.files, function (file) {
      file.paused || $h.each(file.chunks, function (chunk) {
        if (chunk.status() == 'pending' && chunk.preprocessState === 0) {
          chunk.send();
          found = true;
          return false;
        }
      });
      if (found) {
        return false;
      }
    });
    if (found) {
      return true;
    }

    // The are no more outstanding chunks to upload, check is everything is done
    var outstanding = false;
    $h.each($.files, function (file) {
      if (!file.isComplete()) {
        outstanding = true;
        return false;
      }
    });
    if (!outstanding) {
      // All chunks have been uploaded, complete
      $.fire('complete');
    }
    return false;
  };


  /**
   * Assign a browse action to one or more DOM nodes.
   * @function
   * @name Resumable.assignBrowse
   * @param {Element|Array.<Element>} domNodes
   * @param {boolean} isDirectory Pass in true to allow directories to
   * @param {boolean} singleFile prevent multi file upload
   * be selected (Chrome only).
   */
  $.assignBrowse = function (domNodes, isDirectory, singleFile) {
    if (typeof domNodes.length == 'undefined') domNodes = [domNodes];

    // We will create an <input> and overlay it on the domNode
    // (crappy, but since HTML5 doesn't have a cross-browser.browse() method
    // we haven't a choice. FF4+ allows click() for this though:
    // https://developer.mozilla.org/en/using_files_from_web_applications)
    $h.each(domNodes, function (domNode) {
      var input;
      if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
        input = domNode;
      } else {
        input = document.createElement('input');
        input.setAttribute('type', 'file');
        // Place <input /> with the dom node an position the input to fill the
        // entire space
        domNode.style.display = 'inline-block';
        domNode.style.position = 'relative';
        input.style.position = 'absolute';
        input.style.top = input.style.left = 0;
        input.style.bottom = input.style.right = 0;
        input.style.opacity = 0;
        input.style.cursor = 'pointer';
        domNode.appendChild(input);
      }
      if (!$.opts.singleFile && !singleFile) {
        input.setAttribute('multiple', 'multiple');
      }
      if (isDirectory) {
        input.setAttribute('webkitdirectory', 'webkitdirectory');
      }
      // When new files are added, simply append them to the overall list
      input.addEventListener('change', function (e) {
        appendFilesFromFileList(e.target.files, e);
        e.target.value = '';
      }, false);
    });
  };

  /**
   * Assign one or more DOM nodes as a drop target.
   * @function
   * @name Resumable.assignDrop
   * @param {Element|Array.<Element>} domNodes
   */
  $.assignDrop = function (domNodes) {
    if (typeof domNodes.length == 'undefined') {
      domNodes = [domNodes];
    }
    $h.each(domNodes, function (domNode) {
      domNode.addEventListener('dragover', onDragOver, false);
      domNode.addEventListener('drop', onDrop, false);
    });
  };

  /**
   * Un-assign drop event from DOM nodes
   * @function
   * @name Resumable.unAssignDrop
   * @param domNodes
   */
  $.unAssignDrop = function (domNodes) {
    if (typeof domNodes.length == 'undefined') {
      domNodes = [domNodes];
    }
    $h.each(domNodes, function (domNode) {
      domNode.removeEventListener('dragover', onDragOver);
      domNode.removeEventListener('drop', onDrop);
    });
  };

  /**
   * Returns a boolean indicating whether or not the instance is currently
   * uploading anything.
   * @function
   * @name Resumable.isUploading
   * @returns {boolean}
   */
  $.isUploading = function () {
    var uploading = false;
    $h.each($.files, function (file) {
      if (file.isUploading()) {
        uploading = true;
        return false;
      }
    });
    return uploading;
  };

  /**
   * Start or resume uploading.
   * @function
   * @name Resumable.upload
   */
  $.upload = function () {
    // Make sure we don't start too many uploads at once
    if ($.isUploading()) {
      return;
    }
    // Kick off the queue
    $.fire('uploadStart');
    for (var num = 1; num <= $.opts.simultaneousUploads; num++) {
      $.uploadNextChunk();
    }
  };

  /**
   * Resume uploading.
   * @function
   * @name Resumable.resume
   */
  $.resume = function () {
    $h.each($.files, function (file) {
      file.resume();
    });
  };

  /**
   * Pause uploading.
   * @function
   * @name Resumable.pause
   */
  $.pause = function () {
    // Resume all chunks currently being uploaded
    $h.each($.files, function (file) {
      file.pause();
    });
  };

  /**
   * Cancel upload of all ResumableFile objects and remove them from the list.
   * @function
   * @name Resumable.cancel
   */
  $.cancel = function () {
    for (var i = $.files.length - 1; i >= 0; i--) {
      $.files[i].cancel();
    }
  };

  /**
   * Returns a number between 0 and 1 indicating the current upload progress
   * of all files.
   * @function
   * @name Resumable.progress
   * @returns {number}
   */
  $.progress = function () {
    var totalDone = 0;
    var totalSize = 0;
    // Resume all chunks currently being uploaded
    $h.each($.files, function (file) {
      totalDone += file.progress() * file.size;
      totalSize += file.size;
    });
    return totalSize > 0 ? totalDone / totalSize : 0;
  };

  /**
   * Add a HTML5 File object to the list of files.
   * @function
   * @name Resumable.addFile
   * @param {File} file
   * @param {Event} [event] event is optional
   */
  $.addFile = function (file, event) {
    appendFilesFromFileList([file], event);
  };

  /**
   * Add a HTML5 File object to the list of files.
   * @function
   * @name Resumable.addFiles
   * @param {FileList|Array} files
   * @param {Event} [event] event is optional
   */
  $.addFiles = function (files, event) {
    appendFilesFromFileList(files, event);
  };

  /**
   * Cancel upload of a specific ResumableFile object from the list.
   * @function
   * @name Resumable.removeFile
   * @param {ResumableFile} file
   */
  $.removeFile = function (file) {
    for (var i = $.files.length - 1; i >= 0; i--) {
      if ($.files[i] === file) {
        $.files.splice(i, 1);
        file.abort();
      }
    }
  };

  /**
   * Look up a ResumableFile object by its unique identifier.
   * @function
   * @name Resumable.getFromUniqueIdentifier
   * @param {string} uniqueIdentifier
   * @returns {boolean|ResumableFile} false if file was not found
   */
  $.getFromUniqueIdentifier = function (uniqueIdentifier) {
    var ret = false;
    $h.each($.files, function (f) {
      if (f.uniqueIdentifier == uniqueIdentifier) {
        ret = f;
      }
    });
    return ret;
  };

  /**
   * Returns the total size of all files in bytes.
   * @function
   * @name Resumable.getSize
   * @returns {number}
   */
  $.getSize = function () {
    var totalSize = 0;
    $h.each($.files, function (file) {
      totalSize += file.size;
    });
    return totalSize;
  };

  /**
   * ResumableFile constructor
   * @name Resumable.ResumableFile
   * @type {ResumableFile}
   */
  $.ResumableFile = ResumableFile;

  /**
   * ResumableFile constructor
   * @name Resumable.ResumableChunk
   * @type {ResumableChunk}
   */
  $.ResumableChunk = ResumableChunk;

  /**
   * Current options
   * @name Resumable.opts
   * @type {Object}
   */
  $.opts = $h.extend({}, $.defaults, opts || {});
}

// Node.js-style export for Node and Component
if (typeof module != 'undefined') {
  module.exports = Resumable;
}