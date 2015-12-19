/*! jCarousel - v0.3.0beta1 - 2012-08-21
* http://sorgalla.com/jcarousel/
* Copyright (c) 2012 Jan Sorgalla; Licensed MIT, GPL */

(function ($) {
    'use strict';

    $.jcarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target:    '+=1',
            interval:  3000,
            autostart: true
        },
        _timer: null,
        _init: function () {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel().one('createend.jcarousel', $.proxy(this._create, this));
            }, this);
            this.onAnimateEnd = $.proxy(this.start, this);
        },
        _create: function() {
            this.carousel()
                .one('destroy.jcarousel', this.onDestroy);

            if (this.options('autostart')) {
                this.start();
            }
        },
        _destroy: function() {
            this.stop();
            this.carousel()
                .unbind('destroy.jcarousel', this.onDestroy);
        },
        start: function() {
            this.stop();

            this.carousel().one('animateend.jcarousel', this.onAnimateEnd);

            this._timer = setTimeout($.proxy(function() {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));

            return this;
        },
        stop: function() {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }

            this.carousel().unbind('animateend.jcarousel', this.onAnimateEnd);

            return this;
        }
    });
}(jQuery));
