/* ====================================================================
 * eldarion-ajax-handlers.js v0.1.0
 * ====================================================================
 * Copyright (c) 2013, Eldarion, Inc.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 * 
 *     * Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 * 
 *     * Neither the name of Eldarion, Inc. nor the names of its contributors may
 *       be used to endorse or promote products derived from this software without
 *       specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ==================================================================== */

!function ($) {
  'use strict';

  var Handlers = function () {};

  Handlers.prototype.redirect = function(e, $el, data) {
    if (data.location) {
      window.location.href = data.location;
      return false;
    }
  };
  Handlers.prototype.replace = function(e, $el, data) {
    $($el.data('replace')).replaceWith(data.html);
  };
  Handlers.prototype.replaceClosest = function(e, $el, data) {
    $el.closest($el.data('replace-closest')).replaceWith(data.html);
  };
  Handlers.prototype.replaceInner = function(e, $el, data) {
    $($el.data('replace-inner')).html(data.html);
  };
  Handlers.prototype.replaceClosestInner = function(e, $el, data) {
    $el.closest($el.data('replace-closest-inner')).html(data.html);
  };
  Handlers.prototype.append = function(e, $el, data) {
    $($el.data('append')).append(data.html);
  };
  Handlers.prototype.prepend = function(e, $el, data) {
    $($el.data('prepend')).prepend(data.html);
  };
  Handlers.prototype.refresh = function(e, $el, data) {
    $.each($($el.data('refresh')), function(index, value) {
      $.getJSON($(value).data('refresh-url'), function(data) {
        $(value).replaceWith(data.html);
      });
    });
  };
  Handlers.prototype.refreshClosest = function(e, $el, data) {
    $.each($($el.data('refresh-closest')), function(index, value) {
      $.getJSON($(value).data('refresh-url'), function(data) {
        $el.closest($(value)).replaceWith(data.html);
      });
    });
  };
  Handlers.prototype.clear = function(e, $el, data) {
    $($el.data('clear')).html('');
  };
  Handlers.prototype.remove = function(e, $el, data) {
     $($el.data('remove')).remove();
  };
  Handlers.prototype.clearClosest = function(e, $el, data) {
    $el.closest($el.data('clear-closest')).html('');
  };
  Handlers.prototype.removeClosest = function(e, $el, data) {
    $el.closest($el.data('remove-closest')).remove();
  };
  Handlers.prototype.fragments = function(e, $el, data) {
    if (data.fragments) {
      for (var s in data.fragments) {
        $(s).replaceWith(data.fragments[s]);
      }
    }
    if (data['inner-fragments']) {
      for (var i in data['inner-fragments']) {
        $(i).html(data['inner-fragments'][i]);
      }
    }
    if (data['append-fragments']) {
      for (var a in data['append-fragments']) {
        $(a).append(data['append-fragments'][a]);
      }
    }
    if (data['prepend-fragments']) {
      for (var p in data['prepend-fragments']) {
        $(p).prepend(data['prepend-fragments'][p]);
      }
    }
  };

  $(function () {
    $(document).on('eldarion-ajax:success', Handlers.prototype.redirect);
    $(document).on('eldarion-ajax:success', Handlers.prototype.fragments);
    $(document).on('eldarion-ajax:success', '[data-replace]', Handlers.prototype.replace);
    $(document).on('eldarion-ajax:success', '[data-replace-closest]', Handlers.prototype.replaceClosest);
    $(document).on('eldarion-ajax:success', '[data-replace-inner]', Handlers.prototype.replaceInner);
    $(document).on('eldarion-ajax:success', '[data-replace-closest-inner]', Handlers.prototype.replaceClosestInner);
    $(document).on('eldarion-ajax:success', '[data-append]', Handlers.prototype.append);
    $(document).on('eldarion-ajax:success', '[data-prepend]', Handlers.prototype.prepend);
    $(document).on('eldarion-ajax:success', '[data-refresh]', Handlers.prototype.refresh);
    $(document).on('eldarion-ajax:success', '[data-refresh-closest]', Handlers.prototype.refreshClosest);
    $(document).on('eldarion-ajax:success', '[data-clear]', Handlers.prototype.clear);
    $(document).on('eldarion-ajax:success', '[data-remove]', Handlers.prototype.remove);
    $(document).on('eldarion-ajax:success', '[data-clear-closest]', Handlers.prototype.clearClosest);
    $(document).on('eldarion-ajax:success', '[data-remove-closest]', Handlers.prototype.removeClosest);
  });
}(window.jQuery);
