(function($){


var Checker,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Checker = (function() {

  function Checker($el, field) {
    this.run = __bind(this.run, this);

    var sel;
    sel = field[0], this.metric = field[1];
    this.getVal = this.makeGetVal($el, sel);
  }

  Checker.prototype.run = function() {
    return this.verify(this.metric, this.getVal());
  };

  Checker.prototype.makeGetVal = function($el, sel) {
    var inputs, name, type;
    type = $el.attr('type');
    if (type === 'checkbox') {
      return function() {
        return $el.is(':checked');
      };
    } else if (type === 'radio') {
      name = $el.attr('name');
      return function() {
        return $('[name="' + name + '"]').filter(':checked').val();
      };
    } else {
      if (this.metric === 'one-of') {
        inputs = $(sel);
        return function() {
          return inputs.map(function() {
            return $.trim(this.value);
          }).get().join('');
        };
      } else {
        return function() {
          return $.trim($el.val());
        };
      }
    }
  };

  Checker.prototype.verify = function(m, v) {
    var arg, sec, type, _ref;
    if (!!(m && m.constructor && m.call && m.apply)) {
      return m(v);
    }
    if (m instanceof RegExp) {
      return m.test(v);
    }
    _ref = $.map(m.split(':'), $.trim), type = _ref[0], arg = _ref[1], sec = _ref[2];
    if (type === 'same-as' && $(arg).length !== 1) {
      throw new Error('same-as selector must target one and only one element');
    }
    if (!v && type !== 'presence' && type !== 'one-of') {
      return true;
    }
    switch (type) {
      case 'presence':
        return !!v;
      case 'one-of':
        return !!v;
      case 'exact':
        return v === arg;
      case 'not':
        return v !== arg;
      case 'same-as':
        return v === $(arg).val();
      case 'min-num':
        return +v >= +arg;
      case 'max-num':
        return +v <= +arg;
      case 'between-num':
        return +v >= +arg && +v <= +sec;
      case 'min-length':
        return v.length >= +arg;
      case 'max-length':
        return v.length <= +arg;
      case 'exact-length':
        return v.length === +arg;
      case 'between':
        return v.length >= +arg && v.length <= +sec;
      case 'integer':
        return /^\s*\d+\s*$/.test(v);
      case 'float':
        return /^[-+]?[0-9]+(\.[0-9]+)?$/.test(v);
      case 'email':
        return this.email(v);
      default:
        throw new Error('I don\'t know ' + type + ', sorry.');
    }
  };

  Checker.prototype.email = function(v) {
    var RFC822;
    RFC822 = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
    return RFC822.test(v);
  };

  return Checker;

})();

var Listener,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Listener = (function() {

  function Listener(el, get, field) {
    this.get = get;
    this.field = field;
    this.change_status = __bind(this.change_status, this);

    this.runCheck = __bind(this.runCheck, this);

    this.delayedCheck = __bind(this.delayedCheck, this);

    this.events = __bind(this.events, this);

    this.$el = $(el);
    this.delayId = "";
    this.status = null;
    this.checker = new Checker(this.$el, this.field);
    this.msg = new Msg(this.$el, this.get, this.field);
    this.events();
  }

  Listener.prototype.events = function() {
    if (this.$el.attr('type') === 'radio') {
      return $('[name="' + this.$el.attr("name") + '"]').on('change', this.runCheck);
    } else {
      this.$el.on('change', this.runCheck);
      this.$el.on('blur', this.runCheck);
      if (this.field[1] === 'one-of') {
        $(window).on('nod-run-one-of', this.runCheck);
      }
      if (this.get.delay) {
        return this.$el.on('keyup', this.delayedCheck);
      }
    }
  };

  Listener.prototype.delayedCheck = function() {
    clearTimeout(this.delayId);
    return this.delayId = setTimeout(this.runCheck, this.get.delay);
  };

  Listener.prototype.runCheck = function() {
    return $.when(this.checker.run()).then(this.change_status);
  };

  Listener.prototype.change_status = function(status) {
    var isCorrect;
    try {
      status = eval(status);
    } catch (_error) {}
    isCorrect = !!status;
    if (this.status === isCorrect) {
      return;
    }
    this.status = isCorrect;
    this.msg.toggle(this.status);
    $(this).trigger('nod_toggle');
    if (this.field[1] === 'one-of' && status) {
      return $(window).trigger('nod-run-one-of');
    }
  };

  return Listener;

})();

var Msg,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Msg = (function() {

  function Msg($el, get, field) {
    this.$el = $el;
    this.get = get;
    this.createShowMsg = __bind(this.createShowMsg, this);

    this.toggle = __bind(this.toggle, this);

    this.createMsg = __bind(this.createMsg, this);

    this.$msg = this.createMsg(field[2]);
    this.showMsg = this.createShowMsg();
  }

  Msg.prototype.createMsg = function(msg) {
    return $('<span/>', {
      'html': msg,
      'class': this.get.helpSpanDisplay + ' ' + this.get.errorClass
    });
  };

  Msg.prototype.toggle = function(status) {
    if (status) {
      return this.$msg.remove();
    } else {
      this.showMsg();
      if (this.get.broadcastError) {
        return this.broadcast();
      }
    }
  };

  Msg.prototype.createShowMsg = function() {
    var pos, type;
    type = this.$el.attr('type');
    if (type === 'checkbox' || type === 'radio') {
      return function() {
        return this.$el.parent().append(this.$msg);
      };
    } else {
      pos = this.findPos(this.$el);
      return function() {
        return pos.after(this.$msg);
      };
    }
  };

  Msg.prototype.findPos = function($el) {
    if (this.elHasClass('parent', $el)) {
      return this.findPos($el.parent());
    }
    if (this.elHasClass('next', $el)) {
      return this.findPos($el.next());
    }
    return $el;
  };

  Msg.prototype.elHasClass = function(dir, $el) {
    var sel, _i, _len, _ref;
    _ref = this.get.errorPosClasses;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sel = _ref[_i];
      if ($el[dir](sel).length) {
        return true;
      }
    }
    return false;
  };

  Msg.prototype.broadcast = function() {
    return $(window).trigger('nod_error_fired', {
      el: this.$el,
      msg: this.$msg.html()
    });
  };

  return Msg;

})();

var Nod,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Nod = (function() {

  function Nod(form, fields, options) {
    this.form = form;
    this.formIsErrorFree = __bind(this.formIsErrorFree, this);

    this.submitForm = __bind(this.submitForm, this);

    this.toggleSubmitBtnText = __bind(this.toggleSubmitBtnText, this);

    this.toggleSubmitBtn = __bind(this.toggleSubmitBtn, this);

    this.toggleGroupClass = __bind(this.toggleGroupClass, this);

    this.toggle_status = __bind(this.toggle_status, this);

    this.massCheck = __bind(this.massCheck, this);

    this.listenForEnter = __bind(this.listenForEnter, this);

    this.events = __bind(this.events, this);

    this.createListeners = __bind(this.createListeners, this);

    if (!fields) {
      return;
    }
    this.form[0].__nod = this;
    this.get = $.extend({
      'delay': 700,
      'disableSubmitBtn': true,
      'helpSpanDisplay': 'help-inline',
      'groupClass': 'error',
      'submitBtnSelector': '[type=submit]',
      'metricsSplitter': ':',
      'errorPosClasses': ['.help-inline', '.add-on', 'button', '.input-append'],
      'silentSubmit': false,
      'broadcastError': false,
      'errorClass': 'nod_msg',
      'groupSelector': '.control-group'
    }, options);
    this.listeners = this.createListeners(fields);
    this.submit = this.form.find(this.get.submitBtnSelector);
    this.checkIfElementsExist(this.form, this.submit, this.get.disableSubmitBtn);
    this.events();
  }

  Nod.prototype.createListeners = function(fields) {
    var el, field, listeners, _i, _j, _len, _len1, _ref;
    listeners = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      if (field.length !== 3) {
        this["throw"]('field', field);
      }
      _ref = this.form.find(field[0]);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        listeners.push(new Listener(el, this.get, field));
      }
    }
    return listeners;
  };

  Nod.prototype.events = function() {
    var l, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      $(l).on('nod_toggle', this.toggle_status);
    }
    if (this.submit.length) {
      return this.submit.on('click', this.massCheck);
    } else {
      return this.form.on('keyup', this.listenForEnter);
    }
  };

  Nod.prototype.listenForEnter = function(event) {
    if (event.keyCode === 13) {
      return this.massCheck();
    }
  };

  Nod.prototype.massCheck = function(event) {
    var checks, l, _i, _len, _ref;
    if (event != null) {
      event.preventDefault();
    }
    checks = [];
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      checks.push(l.runCheck());
    }
    this.toggleSubmitBtnText();
    return $.when.apply($, checks).then(this.submitForm).then(this.toggleSubmitBtnText);
  };

  Nod.prototype.toggle_status = function(event) {
    this.toggleGroupClass(event.target.$el.parents(this.get.groupSelector));
    if (this.get.disableSubmitBtn) {
      return this.toggleSubmitBtn();
    }
  };

  Nod.prototype.toggleGroupClass = function($group) {
    if ($group.find('.' + this.get.errorClass).length) {
      return $group.addClass(this.get.groupClass);
    } else {
      return $group.removeClass(this.get.groupClass);
    }
  };

  Nod.prototype.toggleSubmitBtn = function() {
    if (this.formIsErrorFree()) {
      return this.submit.removeClass('disabled').removeAttr('disabled');
    } else {
      return this.submit.addClass('disabled').attr('disabled', 'disabled');
    }
  };

  Nod.prototype.toggleSubmitBtnText = function() {
    var tmp;
    tmp = this.submit.attr('data-loading-text');
    if (tmp) {
      this.submit.attr('data-loading-text', this.submit.html());
      return this.submit.html(tmp);
    }
  };

  Nod.prototype.submitForm = function() {
    var $form;
    if (!this.formIsErrorFree()) {
      return;
    }
    if (this.get.silentSubmit) {
      $form = $(this.form);
      return $form.trigger('silentSubmit', $form.serialize());
    } else {
      return this.form.submit();
    }
  };

  Nod.prototype.formIsErrorFree = function() {
    return !$(this.listeners).filter(function() {
      if (this.status === null) {
        this.runCheck();
      }
      return !this.status;
    }).length;
  };

  Nod.prototype.checkIfElementsExist = function(form, submit, disableSubmitBtn) {
    if (!form.selector || !form.length) {
      this["throw"]('form', form);
    }
    if (!submit.length && disableSubmitBtn) {
      return this["throw"]('submit', submit);
    }
  };

  Nod.prototype["throw"] = function(type, el) {
    var txt;
    switch (type) {
      case 'form':
        txt = 'Couldn\'t find form: ';
        break;
      case 'submit':
        txt = 'Couldn\'t find submit button: ';
        break;
      case 'field':
        txt = 'Metrics for each field must have three parts: ';
    }
    throw new Error(txt + el);
  };

  return Nod;

})();


$.fn.nod = function(fields, settings) {
  if (!(fields || settings)) {
    return this[0].__nod;
  }
  new Nod(this, fields, settings);
  return this;
};

})(jQuery);
