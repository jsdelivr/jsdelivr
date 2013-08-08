/*
  Formalize - version 1.2

  Note: This file depends on the YUI library.
*/

YUI.add('formalize', function(Y) {
  // Internet Explorer detection.
  function IE(version) {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + version + ']><br><![endif]-->';
    return !!b.getElementsByTagName('br').length;
  }

  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var IE6 = IE(6);
  var IE7 = IE(7);

  // Expose innards of Formalize.
  Y.formalize = {
    // Y.formalize.go
    go: function() {
      var i, j = this.init;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    // Y.formalize.init
    init: {
      // Y.formalize.init.disable_link_button
      disable_link_button: function() {
        Y.one(document.documentElement).delegate('click', function(ev) {
          ev.preventDefault();
        }, 'a.button_disabled');
      },
      // Y.formalize.init.full_input_size
      full_input_size: function() {
        if (!IE7 || !Y.all('textarea, input.input_full')) {
          return;
        }

        // This fixes width: 100% on <textarea> and class="input_full".
        // It ensures that form elements don't go wider than container.
        Y.all('textarea, input.input_full').each(function(el) {
          var wrapper = Y.Node.create('<span class="input_full_wrap"></span>');
          wrapper.append(el.replace(wrapper));
        });
      },
      // Y.formalize.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !Y.all('input, select, textarea')) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        Y.all('input').each(function(el) {
          // Is it a button?
          if (el.getAttribute('type').match(button_regex)) {
            el.addClass('ie6_button');

            /* Is it disabled? */
            if (el.disabled) {
              el.addClass('ie6_button_disabled');
            }
          }
          // Or is it a textual input?
          else if (el.getAttribute('type').match(type_regex)) {
            el.addClass('ie6_input');

            /* Is it disabled? */
            if (el.disabled) {
              el.addClass('ie6_input_disabled');
            }
          }
        });

        Y.all('textarea, select').each(function(el) {
          /* Is it disabled? */
          if (el.disabled) {
            el.addClass('ie6_input_disabled');
          }
        });
      },
      // Y.formalize.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !Y.one('[autofocus]')) {
          return;
        }

        var el = Y.Node.getDOMNode(Y.one('[autofocus]'));

        if (!el.disabled) {
          el.focus();
        }
      },
      // Y.formalize.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !Y.one('[placeholder]')) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        Y.formalize.misc.add_placeholder();

        Y.all('[placeholder]').each(function(el) {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (el.getAttribute('type') === 'password') {
            return;
          }

          var text = el.getAttribute('placeholder');
          var form = el.ancestor('form');

          function add_placeholder() {
            if (!el.get('value') || el.get('value') === text) {
              el.set('value', text).addClass('placeholder_text');
            }
          }

          el.on('focus', function() {
            if (el.get('value') === text) {
              el.set('value', '').removeClass('placeholder_text');
            }
          });

          el.on('blur', function() {
            Y.formalize.misc.add_placeholder();
          });

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          form && form.on('submit', function() {
            if (el.get('value') === text) {
              el.set('value', '').removeClass('placeholder_text');
            }
          });

          form && form.on('reset', function() {
            setTimeout(Y.formalize.misc.add_placeholder, 50);
          });
        });
      }
    },
    // Y.formalize.misc
    misc: {
      // Y.formalize.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !Y.one('[placeholder]')) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        Y.all('[placeholder]').each(function(el) {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (el.getAttribute('type') === 'password') {
            return;
          }

          var text = el.getAttribute('placeholder');

          if (!el.get('value') || el.get('value') === text) {
            el.set('value', text).addClass('placeholder_text');
          }
        });
      }
    }
  };
}, '1.1', {requires: ['node', 'event']});