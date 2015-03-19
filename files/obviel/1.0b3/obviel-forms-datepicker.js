/*global obviel: true, jQuery: true, templateUrl: true
  alert: true , browser: true, document: true, appUrl: true,
  window: true
*/

(function($, obviel, module) {
    var _ = obviel.i18n.translate('obviel-forms');
    
    obviel.iface('datepickerField', 'textlineField');
    module.DatePickerWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'datepickerField'
        };
        $.extend(d, settings);
        module.TextLineWidget.call(this, d);
    };

    module.DatePickerWidget.prototype = new module.TextLineWidget();

    var ensureOptions = function(widget) {
        var options = widget.datepickerOptions || {};
        widget.datepickerOptions = options;
        // XXX use $.extend?
        options.dateFormat = options.dateFormat || 'mm/dd/yy';
        options.showOn = options.showOn || 'button';
        options.constrainInput = options.constrainInput || false;
    };
    
    module.DatePickerWidget.prototype.render = function() {
        module.TextLineWidget.prototype.render.call(this);
        
        var inputEl = $('#obviel-field-' + this.obj.prefixedName, this.el);
        
        ensureOptions(this.obj);
        if (!this.obj.disabled) {
            inputEl.datepicker(this.obj.datepickerOptions);
        }
    };

    module.DatePickerWidget.prototype.convert = function(value) {
        if (value === '') {
            return {value: null};
        }
        var result = module.TextLineWidget.prototype.convert.call(
            this, value);

        ensureOptions(this.obj);

        var date = null;
        try {
            date = $.datepicker.parseDate(
                this.obj.datepickerOptions.dateFormat,
                result.value);
        } catch(e) {
            return {error: _('invalid date')};
        }
        return {value: $.datepicker.formatDate('yy-mm-dd', date)};
    };

    module.DatePickerWidget.prototype.convertBack = function(value) {
        value = module.TextLineWidget.prototype.convertBack.call(
            this, value);
        if (value === '') {
            return '';
        }
        ensureOptions(this.obj);
        
        var date = $.datepicker.parseDate('yy-mm-dd', value);
        return $.datepicker.formatDate(this.obj.datepickerOptions.dateFormat,
                                       date);
    };
    
    obviel.view((new module.DatePickerWidget()));
    
}(jQuery, obviel, obviel.forms));
