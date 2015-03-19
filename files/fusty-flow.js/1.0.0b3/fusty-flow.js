(function (Flow, window, document, undefined) {
  'use strict';

  var extend = Flow.extend;
  var each = Flow.each;

  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  }

  function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  }

  function removeElement(element) {
    element.parentNode.removeChild(element);
  }

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Not resumable file upload library, for IE7-IE9 browsers
   * @name FustyFlow
   * @param [opts]
   * @param {bool} [opts.singleFile]
   * @param {string} [opts.fileParameterName]
   * @param {Object|Function} [opts.query]
   * @param {Object} [opts.headers]
   * @param {string} [opts.target]
   * @param {Function} [opts.generateUniqueIdentifier]
   * @param {bool} [opts.matchJSON]
   * @constructor
   */
  function FustyFlow(opts) {
    // Shortcut of "r instanceof Flow"
    this.support = false;

    this.files = [];
    this.events = [];
    this.defaults = {
      simultaneousUploads: 3,
      fileParameterName: 'file',
      query: {},
      target: '/',
      generateUniqueIdentifier: null,
      matchJSON: false
    };

    var $ = this;

    this.inputChangeEvent = function (event) {
      var input = event.srcElement;
      removeEvent(input, 'change', $.inputChangeEvent);
      var newClone = input.cloneNode(false);
      // change current input with new one
      input.parentNode.replaceChild(newClone, input);
      // old input will be attached to hidden form
      $.addFile(input, event);
      // reset new input
      newClone.value = '';
      addEvent(newClone, 'change', $.inputChangeEvent);
    };

    this.opts = Flow.extend({}, this.defaults, opts || {});
  }

  FustyFlow.prototype = {
    on: Flow.prototype.on,
    fire: Flow.prototype.fire,
    cancel: Flow.prototype.cancel,
    assignBrowse: function (domNodes) {
      if (typeof domNodes.length == 'undefined') {
        domNodes = [domNodes];
      }
      each(domNodes, function (domNode) {
        var input;
        if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
          input = domNode;
        } else {
          input = document.createElement('input');
          input.setAttribute('type', 'file');

          extend(domNode.style, {
            display: 'inline-block',
            position: 'relative',
            overflow: 'hidden',
            verticalAlign: 'top'
          });

          extend(input.style, {
            position: 'absolute',
            top: 0,
            right: 0,
            fontFamily: 'Arial',
            // 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
            fontSize: '118px',
            margin: 0,
            padding: 0,
            opacity: 0,
            filter: 'alpha(opacity=0)',
            cursor: 'pointer'
          });

          domNode.appendChild(input);
        }
        // When new files are added, simply append them to the overall list
        addEvent(input, 'change', this.inputChangeEvent);
      }, this);
    },
    assignDrop: function () {
      // not supported
    },
    unAssignDrop: function () {
      // not supported
    },
    isUploading: function () {
      var uploading = false;
      each(this.files, function (file) {
        if (file.isUploading()) {
          uploading = true;
          return false;
        }
      });
      return uploading;
    },
    upload: function () {
      // Kick off the queue
      var files = 0;
      each(this.files, function (file) {
        if (file.progress() == 1) {
          return;
        }
        if (file.isUploading()) {
          files++;
          return;
        }
        if (files++ >= this.opts.simultaneousUploads) {
          return false;
        }
        if (files == 1) {
          this.fire('uploadStart');
        }
        file.send();
      }, this);
      if (!files) {
        this.fire('complete');
      }
    },
    pause: function () {
      each(this.files, function (file) {
        file.abort();
      });
    },
    resume: function () {
      this.upload();
    },
    progress: function () {
      var totalDone = 0;
      var totalFiles = 0;
      each(this.files, function (file) {
        totalDone += file.progress();
        totalFiles++;
      });
      return totalFiles > 0 ? totalDone / totalFiles : 0;
    },
    addFiles: function (elementsList, event) {
      var files = [];
      each(elementsList, function (element) {
        // is domElement ?
        if (element.nodeType === 1 && element.value) {
          var f = new FustyFlowFile(this, element);
          if (this.fire('fileAdded', f, event)) {
            files.push(f);
          }
        }
      }, this);
      if (this.fire('filesAdded', files, event)) {
        each(files, function (file) {
          if (this.opts.singleFile && this.files.length > 0) {
            this.removeFile(this.files[0]);
          }
          this.files.push(file);
        }, this);
      }
      this.fire('filesSubmitted', files, event);
    },
    addFile: function (file, event) {
      this.addFiles([file], event);
    },
    generateUniqueIdentifier: function (element) {
      var custom = this.opts.generateUniqueIdentifier;
      if (typeof custom === 'function') {
        return custom(element);
      }
      return 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    getFromUniqueIdentifier: function (uniqueIdentifier) {
      var ret = false;
      each(this.files, function (f) {
        if (f.uniqueIdentifier == uniqueIdentifier) ret = f;
      });
      return ret;
    },
    removeFile: function (file) {
      for (var i = this.files.length - 1; i >= 0; i--) {
        if (this.files[i] === file) {
          this.files.splice(i, 1);
        }
      }
    },
    getSize: function () {
      // undefined
    },
    timeRemaining: function () {
      // undefined
    },
    sizeUploaded: function () {
      // undefined
    }
  };

  function FustyFlowFile(flowObj, element) {
    this.flowObj = flowObj;
    this.element = element;
    this.name = element.value && element.value.replace(/.*(\/|\\)/, "");
    this.relativePath = this.name;
    this.uniqueIdentifier = flowObj.generateUniqueIdentifier(element);
    this.iFrame = null;

    this.finished = false;
    this.error = false;

    var $ = this;
    this.iFrameLoaded = function (event) {
      // when we remove iframe from dom
      // the request stops, but in IE load
      // event fires
      if (!$.iFrame || !$.iFrame.parentNode) {
        return;
      }
      $.finished = true;
      try {
        // fixing Opera 10.53
        if ($.iFrame.contentDocument &&
          $.iFrame.contentDocument.body &&
          $.iFrame.contentDocument.body.innerHTML == "false") {
          // In Opera event is fired second time
          // when body.innerHTML changed from false
          // to server response approx. after 1 sec
          // when we upload file with iframe
          return;
        }
      } catch (error) {
        //IE may throw an "access is denied" error when attempting to access contentDocument
        $.error = true;
        $.abort();
        $.flowObj.fire('fileError', $, error);
        return;
      }
      // iframe.contentWindow.document - for IE<7
      var doc = $.iFrame.contentDocument || $.iFrame.contentWindow.document;
      var innerHtml = doc.body.innerHTML;
      if ($.flowObj.opts.matchJSON) {
        innerHtml = /(\{.*\})/.exec(innerHtml)[0];
      }

      $.abort();
      $.flowObj.fire('fileSuccess', $, innerHtml);
      $.flowObj.upload();
    };
    this.bootstrap();
  }

  FustyFlowFile.prototype = {
    getExtension: Flow.FlowFile.prototype.getExtension,
    getType: function () {
      // undefined
    },
    send: function () {
      if (this.finished) {
        return;
      }
      var o = this.flowObj.opts;
      var form = this.createForm();
      var params = o.query;
      if (isFunction(params)) {
        params = params(this);
      }
      params[o.fileParameterName] = this.element;
      params['flowFilename'] = this.name;
      params['flowRelativePath'] = this.relativePath;
      params['flowIdentifier'] = this.uniqueIdentifier;

      this.addFormParams(form, params);
      addEvent(this.iFrame, 'load', this.iFrameLoaded);
      form.submit();
      removeElement(form);
    },
    abort: function () {
      if (this.iFrame) {
        this.iFrame.setAttribute('src', 'java' + String.fromCharCode(115) + 'cript:false;');
        removeElement(this.iFrame);
        this.iFrame = null;
      }
    },
    cancel: function () {
      this.abort();
      this.flowObj.removeFile(this);
    },
    retry: function () {
      this.bootstrap();
      this.flowObj.upload();
    },
    bootstrap: function () {
      this.abort();
      this.error = false;
    },
    timeRemaining: function () {
      // undefined
    },
    sizeUploaded: function () {
      // undefined
    },
    resume: function () {
      this.flowObj.upload();
    },
    pause: function () {
      this.abort();
    },
    isUploading: function () {
      return this.iFrame !== null;
    },
    isComplete: function () {
      return this.progress() === 1;
    },
    progress: function () {
      if (this.error) {
        return 1;
      }
      return this.finished ? 1 : 0;
    },

    createIframe: function () {
      var iFrame = (/MSIE (6|7|8)/).test(navigator.userAgent) ?
        document.createElement('<iframe name="' + this.uniqueIdentifier + '_iframe' + '">') :
        document.createElement('iframe');

      iFrame.setAttribute('id', this.uniqueIdentifier + '_iframe_id');
      iFrame.setAttribute('name', this.uniqueIdentifier + '_iframe');
      iFrame.style.display = 'none';
      document.body.appendChild(iFrame);
      return iFrame;
    },
    createForm: function() {
      var target = this.flowObj.opts.target;
      var form = document.createElement('form');
      form.encoding = "multipart/form-data";
      form.method = "POST";
      form.setAttribute('action', target);
      if (!this.iFrame) {
        this.iFrame = this.createIframe();
      }
      form.setAttribute('target', this.iFrame.name);
      form.style.display = 'none';
      document.body.appendChild(form);
      return form;
    },
    addFormParams: function(form, params) {
      var input;
      each(params, function (value, key) {
        if (value && value.nodeType === 1) {
          input = value;
        } else {
          input = document.createElement('input');
          input.setAttribute('value', value);
        }
        input.setAttribute('name', key);
        form.appendChild(input);
      });
    }
  };

  FustyFlow.FustyFlowFile = FustyFlowFile;

  if (typeof module !== 'undefined') {
    module.exports = FustyFlow;
  } else if (typeof define === "function" && define.amd) {
    // AMD/requirejs: Define the module
    define(function(){
      return FustyFlow;
    });
  } else {
    window.FustyFlow = FustyFlow;
  }
})(window.Flow, window, document);

