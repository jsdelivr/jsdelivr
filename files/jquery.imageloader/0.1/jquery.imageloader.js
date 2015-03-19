(function($) {

"use strict";

/**
 * jQuery.imageloader
 * (C) 2012, Takashi Mizohata
 * http://beatak.github.com/jquery-imageloader/
 * MIT LICENSE
 */

var DEFAULT_OPTIONS = {
  selector: '',
  dataattr: 'src',
  background: false,
  each: null,
  eacherror: null,
  callback: null,
  timeout: 5000
};

var init = function (_i, self, opts) {
  var q = Queue.getInstance();
  var $this = $(self);
  var defaults = $.extend({}, DEFAULT_OPTIONS, opts || {});
  var ns = '_' + ('' + (new Date()).valueOf()).slice(-7);
  var $elms;
  var len = 0;

  if (defaults.selector === '' && $this.data(defaults.dataattr) ) {
    $elms = $this;
    len = 1;
  }
  else {
    $elms = $this.find([defaults.selector, '[data-', defaults.dataattr, ']'].join(''));
    len = $elms.length;
  }

  $this.data(
    ns,
    {
      each: defaults.each,
      eacherror: defaults.eacherror,
      callback: defaults.callback,
      isLoading: true,
      loadedImageCounter: 0,
      length: len
    }
  );

  if (len === 0) {
    finishImageLoad(self, ns);
  }
  else {
    $elms.each(
      function (i, elm) {
        q.add(buildImageLoadFunc(elm, self, ns, defaults.background, defaults.dataattr, defaults.timeout));
      }
    );
    // console.log(['we are gonna load ', len, ' image(s) on ', ns].join(''));
    $this.on('loadImage.' + ns, onLoadImage);
    q.run();
  }
  return self;
};

// ===================================================================

var onLoadImage = function (ev, elm, img, isError) {
  // console.log('onLoadImage: ', ev.namespace);
  var parent = ev.currentTarget;
  var defaults = $(parent).data(ev.namespace);
  if (!defaults.isLoading) {
    // console.log('onLoadImage: is not loading but still called?');
    return;
  }
  if (isError) {
    if (typeof defaults.eacherror === 'function') {
      defaults.eacherror(elm);
    }
    else {
      if (elm.parentNode !== null) {
        elm.parentNode.removeChild(elm);
      }
    }
  }
  else if (typeof defaults.each === 'function') {
    defaults.each(elm, img);
  }
  ++defaults.loadedImageCounter;
  if (defaults.loadedImageCounter >= defaults.length) {
    finishImageLoad(parent, ev.namespace);
  }
};

var finishImageLoad = function (parent, ns) {
  // console.log('finishImageLoad: ', ns);
  var $parent = $(parent);
  var data = $parent.data();
  var callback = data[ns].callback;
  $parent.off('loadImage.' + ns, onLoadImage);
  delete data[ns];
  if (typeof callback === 'function') {
    setTimeout(
      function () {
        callback(parent);
      },
      $.imageloader.queueInterval * 2
    );
  }
};

var buildImageLoadFunc = function (elm, parent, namespace, isBg, attr, milsec_timeout) {
  var $elm = $(elm);
  var src = $elm.data(attr);
  var hasFinished = false;

  var onFinishLoagImage = function (ev, img) {
    // delete attribute
    $elm.removeAttr( ['data-', attr].join('') );
    $(parent).triggerHandler('loadImage.' + namespace, [elm, img, (ev && ev.type === 'error')]);
  };

  return function () {
    var timer_handler;
    var $img = $('<img />'); // this statement is kinda silly, but IE needs this separated.
    $img
      .bind(
        'error',
        function (ev) {
          hasFinished = true;
          clearTimeout(timer_handler);
          $(this).unbind('error').unbind('load');
          onFinishLoagImage(ev);
        }
      )
      .bind(
        'load',
        function(ev) {
          hasFinished = true;
          clearTimeout(timer_handler);
          $(this).unbind('error').unbind('load');
          if (isBg) {
            $elm.css('background-image', ['url(', src, ')'].join(''));
          }
          else {
            $elm.attr('src', src);
          }
          onFinishLoagImage(ev, $img[0]);
        }
      )
      .attr('src', src);
    timer_handler = setTimeout(
      function () {
        if (hasFinished === false) {
          // console.log('timeout');
          $img.trigger('error');
        }
      },
      milsec_timeout
    );
  };
};

// ===================================================================

var _queue_instance_;
var Queue = {
  getInstance: function () {
    if (_queue_instance_ instanceof QueueImpl === false) {
      _queue_instance_ = new QueueImpl();
    }
    return _queue_instance_;
  }
};

var QueueImpl = function () {
  this.index = 0;
  this.queue = [];
  this.isRunning = false;
};

QueueImpl.prototype.add = function (func) {
  if (typeof func !== 'function') {
    throw new Error('you can only pass function.');
  }
  this.queue.push(func);
};

QueueImpl.prototype.run = function (firenow) {
  var run = $.proxy(this.run, this);
  firenow = firenow || false;
  if (this.isRunning && !firenow) {
    return;
  }
  this.isRunning = true;
  this.queue[this.index++]();
  if (this.index < this.queue.length) {
    setTimeout(
      function () {
        run(true);
      },
      $.imageloader.queueInterval
    );
  }
  else {
    this.isRunning = false;
  }
};

// ===================================================================

$.imageloader = {
  queueInterval: 17
};

$.fn.imageloader = function (opts) {
  return this.each(
    function (i, elm) {
      init(i, elm, opts);
    }
  );
};

})(jQuery);