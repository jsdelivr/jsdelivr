/* ====================================================================
 * bootstrap-ajax.js v0.6.0
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

/*global Spinner:true*/

!function ($) {

  'use strict'; // jshint ;_;

  var Ajax = function () {}

  Ajax.prototype.click = function (e) {
    var $this = $(this)
      , url = $this.attr('href')
      , method = $this.attr('data-method')

    if (!method) {
      method = 'get'
    }
    
    spin($this)
    
    e.preventDefault()
    
    $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      statusCode: {
        200: function(data) {
          processData(data, $this)
        },
        500: function() {
          $this.trigger('bootstrap-ajax:error', [$this, 500])
        },
        404: function() {
          $this.trigger('bootstrap-ajax:error', [$this, 404])
        }
      }
    })
  }
  
  Ajax.prototype.submit = function (e) {
    var $this = $(this)
      , url = $this.attr('action')
      , method = $this.attr('method')
      , data = new FormData($this[0])
      , button = $this.find('input[type=submit],button[type=submit]')
    
    button.attr('disabled', 'disabled')
    
    spin($this)
    
    e.preventDefault()
    
    $.ajax({
      url: url,
      type: method,
      data: data,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      statusCode: {
        200: function(data) {
            $this.find('input[type=text],textarea').val('')
            processData(data, $this)
        },
        500: function() {
          $this.trigger('bootstrap-ajax:error', [$this, 500])
        },
        404: function() {
          $this.trigger('bootstrap-ajax:error', [$this, 404])
        }
      },
      complete: function() {
        button.removeAttr('disabled')
      }
    })
  }
  
  Ajax.prototype.cancel = function(e) {
    var $this = $(this)
      , selector = $this.attr('data-cancel-closest')
    
    e.preventDefault()
    
    $this.closest(selector).remove()
  }
  
  if (typeof Spinner !== 'undefined') { // http://fgnass.github.com/spin.js/
    $.fn.spin = function(opts) {
      this.each(function() {
        var $this = $(this)
          , data = $this.data()

        if (data.spinner) {
          data.spinner.stop();
          delete data.spinner
        }
        if (opts !== false) {
          data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this)
        }
      })
      return this
    }
  }
  
  function spin($el) { // http://fgnass.github.com/spin.js/
    if ($.fn.spin !== undefined) {
      var spinner_selector = $el.attr('data-spinner')
        , spinner_selector_replace = $el.attr('data-spinner-replace')
        , spinner_selector_replace_closest = $el.attr('data-spinner-replace-closest')
        , opts = {lines: 11, length:0, width:6, radius:9, rotate:0, trail:89, speed:1.4}
        
        if (spinner_selector) {
          $(spinner_selector).spin(opts)
        } else if (spinner_selector_replace) {
          $(spinner_selector_replace).html("").spin(opts)
        } else if (spinner_selector_replace_closest) {
          $el.closest(spinner_selector_replace_closest).html("").spin(opts)
        } else {
          $el.html("").spin(opts)
        }
    }
  }
  
  function stop_spin($el) {
    if ($el.stop !== undefined) {
      $el.stop()
    }
  }
  
  function processData(data, $el) {
    if (data.location) {
      window.location.href = data.location
    } else {
      var replace_selector = $el.attr('data-replace')
        , replace_closest_selector = $el.attr('data-replace-closest')
        , replace_inner_selector = $el.attr('data-replace-inner')
        , replace_closest_inner_selector = $el.attr('data-replace-closest-inner')
        , append_selector = $el.attr('data-append')
        , prepend_selector = $el.attr('data-prepend')
        , refresh_selector = $el.attr('data-refresh')
        , refresh_closest_selector = $el.attr('data-refresh-closest')
        , clear_selector = $el.attr('data-clear')
        , remove_selector = $el.attr('data-remove')
        , clear_closest_selector = $el.attr('data-clear-closest')
        , remove_closest_selector = $el.attr('data-remove-closest')
      
      if (replace_selector) {
        $(replace_selector).replaceWith(data.html)
      }
      if (replace_closest_selector) {
        $el.closest(replace_closest_selector).replaceWith(data.html)
      }
      if (replace_inner_selector) {
        $(replace_inner_selector).html(data.html)
      }
      if (replace_closest_inner_selector) {
        $el.closest(replace_closest_inner_selector).html(data.html)
      }
      if (append_selector) {
        $(append_selector).append(data.html)
      }
      if (prepend_selector) {
        $(prepend_selector).prepend(data.html)
      }
      if (refresh_selector) {
        $.each($(refresh_selector), function(index, value) {
          $.getJSON($(value).data('refresh-url'), function(data) {
            $(value).replaceWith(data.html)
          })
        })
      }
      if (refresh_closest_selector) {
        $.each($(refresh_closest_selector), function(index, value) {
          $.getJSON($(value).data('refresh-url'), function(data) {
            $el.closest($(value)).replaceWith(data.html)
          })
        })
      }
      if (clear_selector) {
        $(clear_selector).html('')
      }
      if (remove_selector) {
        $(remove_selector).remove()
      }
      if (clear_closest_selector) {
        $el.closest(clear_closest_selector).html('')
      }
      if (remove_closest_selector) {
        $el.closest(remove_closest_selector).remove()
      }
    }
    
    if (data.fragments) {
      for (var s in data.fragments) {
        $(s).replaceWith(data.fragments[s])
      }
    }
    if (data['inner-fragments']) {
      for (var i in data['inner-fragments']) {
        $(i).html(data['inner-fragments'][i])
      }
    }
    if (data['append-fragments']) {
      for (var a in data['append-fragments']) {
        $(a).append(data['append-fragments'][a])
      }
    }
    if (data['prepend-fragments']) {
      for (var p in data['prepend-fragments']) {
        $(p).prepend(data['prepend-fragments'][p])
      }
    }
    $el.trigger('bootstrap-ajax:success', [data, $el]);
  }
  
  $(function () {
    $('body').on('click', 'a.ajax', Ajax.prototype.click)
    $('body').on('submit', 'form.ajax', Ajax.prototype.submit)
    $('body').on('click', 'a[data-cancel-closest]', Ajax.prototype.cancel)
  })
}(window.jQuery);
