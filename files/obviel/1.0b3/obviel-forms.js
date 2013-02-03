/*global obviel:false Gettext:false
*/

obviel.forms = {};

(function($, obviel, module) {
    var _ = obviel.i18n.translate('obviel-forms');
    var ngettext = obviel.i18n.pluralize('obviel-forms');
    
    var entitize = function(s) {
        /* convert the 4 chars that must not be in XML to 'entities'
        */
        s = s.replace(/&/g, '&amp;');
        s = s.replace(/</g, '&lt;');
        s = s.replace(/>/g, '&gt;');
        s = s.replace(/"/g, '&quot;');
        return s;
    };

    // a way to determine whether an attribute name is internal
    // or not. Apparently this varies through versions of jquery
    // rather messy but I don't know of a reliable to recognize
    // a jQuery expando...
    var isInternal = function(attributeName) {
        return (attributeName === '__events__' ||
                attributeName.slice(0, 6) === 'jQuery');
    };
    
    obviel.iface('viewform');

    module.Form = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'viewform',
            name: 'default',
            html:
                '<form class="form-horizontal" ' +
                'method="POST"> ' +
                '<div class="obviel-fields"></div>' +
                '<div class="obviel-formerror"></div>' +
                '<div class="obviel-controls form-actions"></div>' +
                '</form>'
        };
        $.extend(d, settings);
        obviel.View.call(this, d);
    };

    var autoName = 0;

    module.Form.prototype = new obviel.View();

    module.Form.prototype.init = function() {
        this.widgetViews = [];
    };

    var countErrors = function(errors) {
        var result = 0;
        $.each(errors, function(key, value) {
            if (isInternal(key)) {
                return true;
            }
            if ($.isPlainObject(value)) {
                result += countErrors(value);
            } else if ($.isArray(value)) {
                $.each(value, function(index, item) {
                    result += countErrors(item);
                });
            } else if (value) {
                result++;
            }
            return true;
        });
        return result;
    };

    module.Form.prototype.errorCount = function() {
        return countErrors(this.obj.errors);
    };

    module.Form.prototype.globalErrorCount = function() {
        return countErrors(this.obj.globalErrors);
    };

    module.Form.prototype.totalErrorCount = function() {
        return this.errorCount() + this.globalErrorCount();
    };
    
    module.Form.prototype.render = function() {
        var self = this;

        var obj = self.obj;
        var el = self.el;
        
        obj.errors = obj.errors || {};
        obj.globalErrors = obj.globalErrors || {};
        obj.data = obj.data || {};

        $(el).bind('change', function(ev) {
            // if we are already updating the errors in a submit, we don't want
            // to trigger global validation again
            if (self.updatingErrors) {
                return;
            }
            var target = $(ev.target);
            // find view for target
            var widget = $(target).parentView();
            if (!widget) {
                return;
            }
            // if this widget has a global validator, revalidate
            if (widget.obj.globalValidator) {
                // revalidate this form
                self.validate();
            }
        });
        
        $(el).bind('form-change.obviel', function(ev) {
            var count = self.totalErrorCount();
            if (count > 0) {
                var msg = obviel.i18n.variables(ngettext(
                    "{count} field did not validate",
                    "{count} fields did not validate",
                    count), {count: count});
                $('.obviel-formerror', el).text(msg).addClass(
                                                        'alert alert-error');
            } else {
                $('.obviel-formerror', el).text('').removeClass(
                                                        'alert alert-error');
            }
            if (count) {
                $('button.obviel-control', el).each(function(
                index, controlEl) {
                    controlEl = $(controlEl);
                    if (!controlEl.data('obviel.noValidation')) {
                        controlEl.attr('disabled', 'true').trigger(
                            'button-updated.obviel');
                    }
                    
                });

            } else {
                $('button.obviel-control', el).each(function(
                index, controlEl) {
                    controlEl = $(controlEl);
                    if (!controlEl.data('obviel.noValidation')) {
                        controlEl.removeAttr('disabled').trigger(
                            'button-updated.obviel');
                    }
                });
            }
        });

        var formName = obj.form.name;
        if (formName === undefined) {
            formName = 'auto' + autoName.toString();
            autoName++;
            obj.form.name = formName;
        }
        self.renderWidgets();
        self.renderControls();
    };

    module.Form.prototype.renderWidgets = function() {
        var self = this;
        var obj = self.obj;

        var formEl = $('form', self.el);
        var fieldsEl = $('.obviel-fields', formEl);
        
        $.each(obj.form.widgets, function(index, widget) {
            widget.prefixedName = obj.form.name + '-' + widget.name;
            fieldsEl.append(self.renderWidget(
                widget, obj.data, obj.errors, obj.globalErrors,
                obj.form.disabled));
        });
    };

    module.Form.prototype.renderWidget = function(widget,
                                                   data,
                                                   errors,
                                                   globalErrors,
                                                   disabled) {
        var self = this;
        var fieldEl = $('<div class="obviel-field control-group"></div>');
        $.each(widget.ifaces, function(index, value) {
            fieldEl.addClass(value);
        });
        if (widget.name) {
            fieldEl.addClass('obviel-fieldname-' + widget.name);
        }
        if (widget['class']) {
            fieldEl.addClass(widget['class']);
        }
        
        if (disabled) {
            widget.disabled = true;
        }

        fieldEl.render(widget).done(function(view) {
            view.renderLabel();
            view.renderErrorArea();
            // now link everything up
            view.link(data, errors, globalErrors);
        });

        self.widgetViews.push(fieldEl.view());

        fieldEl.bind('field-error.obviel-forms', function(ev) {
            fieldEl.addClass('error');
        });

        fieldEl.bind('field-error-clear.obviel-forms', function(ev) {
            fieldEl.removeClass('error');
        });

        // somewhat nasty, but required for a lot of style issues
        // (they need an element at the end they can rely on, and
        // the field-error div gets removed from view at times)
        fieldEl.append(
            '<div class="obviel-field-clear">&#xa0;</div>');
        return fieldEl;
    };

    module.Form.prototype.renderControls = function() {
        var self = this;
        
        var formEl = $('form', self.el);
        var controlsEl = $('.obviel-controls', formEl);
        var controls = self.obj.form.controls || [];

        if (self.obj.form.disabled) {
            return;
        }
        $.each(controls, function(index, control) {
            var controlEl = self.renderControl(control);
            controlsEl.append(controlEl);
            controlEl.trigger("button-created.obviel");
        });
    };

    module.Form.prototype.renderControl = function(control) {
        var self = this;
        var controlEl = $(
                '<button class="obviel-control btn" type="button" />');
        controlEl.text(control.label || '');
        if (control['class']) {
            controlEl.addClass(control['class']);
        }
        if (control.name) {
            controlEl.attr('name', control.name);
        }

        // XXX not really nice to attach data to the control el,
        // but cleaner solution will have to wait until we have
        // a control view, which is a bigger refactoring
        if (control.noValidation) {
            controlEl.data('obviel.noValidation', true);
        }
        
        controlEl.click(function(ev) {
            self.submitControl(controlEl, control);
        });

        return controlEl;
    };

    var cleanData = function(data) {
        var clone = null;
        
        // clone the data object removing data link annotations
        if ($.isPlainObject(data)) {
            clone = {};
            $.each(data, function(key, value) {
                if (!isInternal(key)) {
                    clone[key] = cleanData(value);
                }
            });
            return clone;
        } else if ($.isArray(data)) {
            clone = [];
            $.each(data, function(index, value) {
                clone.push(cleanData(value));
            });
            return clone;
            
        } else {
            return data;
        }
    };

    var clearLinkedData = function(obj) {
        var linkedObj = $(obj);
        $.each(obj, function(key, value) {
            if (isInternal(key)) {
                return;
            }
            if ($.isPlainObject(value)) {
                clearLinkedData(value);
            } else if ($.isArray(value)) {
                $.each(value, function(index, arrayValue) {
                    clearLinkedData(arrayValue);
                });
            } else {
                linkedObj.setField(key, '');
            }
            return;
        });
    };
    
    // use setField to set values in target according to source
    // source and target must have same structure
    var setLinkedData = function(source, target) {
        var linkedTarget = $(target);
        clearLinkedData(target);
        $.each(source, function(key, sourceValue) {
            if (isInternal(key)) {
                return;
            }
            var targetValue = null;
            if ($.isPlainObject(sourceValue)) {
                targetValue = target[key];
                setLinkedData(sourceValue, targetValue);
            } else if ($.isArray(sourceValue)) {
                targetValue = target[key];
                $.each(sourceValue, function(index, arrayValue) {
                    var targetArrayValue = targetValue[index];
                    setLinkedData(arrayValue, targetArrayValue);
                });
            } else {
                linkedTarget.setField(key, sourceValue);
            }
            return;
        });
    };
    
    module.Form.prototype.cleanData = function() {
        return cleanData(this.obj.data);
    };
    
    module.Form.prototype.updateErrors = function() {
        var self = this;
        // mark that we are updating errors so we don't trigger validation
        // again during triggerChanges..
        self.updatingErrors = true;
        // trigger change event for all widgets
        self.triggerChanges();
        // trigger global validation
        return self.validate().done(function() {
            self.updatingErrors = false;
        });
    };

    module.Form.prototype.setGlobalErrors = function(data) {
        setLinkedData(data, this.obj.globalErrors);
    };
    
    module.Form.prototype.validate = function() {
        var self = this;
        
        var url = self.obj.validationUrl;
        // no global validation
        var defer = null;
        if (url === undefined) {
            defer = $.Deferred();
            defer.resolve();
            return defer.promise();
        }
        var data = self.jsonData();
        
        // otherwise do global validation and set errors accordingly
        defer = $.ajax({
            type: 'POST',
            url: url,
            data: data,
            processData: false,
            contentType: 'application/json',
            dataType: 'json'
        });
        
        defer.done(function(data) {
            self.setGlobalErrors(data);
            // for any update to error status due to validate, trigger event
            var formEl = $('form', self.el);
            formEl.trigger('form-change.obviel');
        });
        return defer;
    };
    
    module.Form.prototype.submitControl = function(controlEl, control) {
        var self = this;
        var defer = $.Deferred();
        
        if (!control.noValidation) {
            self.updateErrors().done(function() {
                // if there are  errors, disable submit
                if (self.totalErrorCount() > 0) {
                    controlEl.attr('disabled', 'true').trigger(
                        'button-updated.obviel');
                    defer.resolve();
                    return;
                }
                self.directSubmit(control).done(function() {
                    defer.resolve();
                });
            });
            return defer.promise();
        } else {
            return self.directSubmit(control);
        }
    };
    
    module.Form.prototype.submit = function(control) {
        var self = this;
        var defer = $.Deferred();
        
        self.updateErrors().done(function() {
            // don't submit if there are any errors
            if (self.totalErrorCount() > 0) {
                defer.resolve();
                return;
            }
            self.directSubmit(control).done(function() {
                defer.resolve();
            });
        });
        return defer.promise();
    };

    module.Form.prototype.jsonData = function() {
        return JSON.stringify(this.cleanData());
    };
    
    module.Form.prototype.directSubmit = function(control) {
        var self = this;
        var defer = $.Deferred();
        
        // if there is no action, we just leave: we assume that
        // some event handler is hooked up to the control, for instance
        // using the class
        var action = control.action;
        if (action === undefined) {
            defer.resolve();
            return defer.promise();
        }

        var data = null;
        if (!control.noValidation) {
            data = self.jsonData();
        } else {
            data = undefined;
        }
        
        var method = control.method || 'POST';
        var contentType = control.contentType || 'application/json';
        var viewName = control.viewName || 'default';

        $.ajax({
            type: method,
            url: action,
            data: data,
            processData: false,
            contentType: contentType,
            dataType: 'json',
            success: function(data) {
                self.el.render(data, viewName).done(function() {
                    defer.resolve();
                });
            }
        });
        return defer.promise();
    };
    
    module.Form.prototype.triggerChanges = function() {
        var self = this;
        
        $.each(self.widgetViews, function(index, view) {
            view.change();
        });
        
    };
    
    obviel.view(new module.Form());

    obviel.iface('widget');
    
    module.Widget = function(settings) {
        settings = settings || {};
        var d = {
            name: 'default'
        };
        $.extend(d, settings);
        obviel.View.call(this, d);
    };

    module.Widget.prototype = new obviel.View();
    
    module.Widget.prototype.render = function() {

    };


    obviel.view({
        iface: 'obvielFormsErrorArea',
        render: function() {
            // add in field validation or conversion failing error area
            this.el.append('<span id="' +
                           this.obj.fieldErrorId +
                           '" class="obviel-field-error"></span>');
            // add in global level validation failure error area
            this.el.append('<span id="' +
                           this.obj.globalErrorId +
                           '" class="obviel-global-error"></span>');
        }
    });
    
    module.Widget.prototype.renderErrorArea = function() {
        $('.obviel-field-input', this.el).append(
            '<span class="obviel-error-area help-inline"></div>');
        
        $('.obviel-error-area', this.el).render(
            {iface: 'obvielFormsErrorArea',
             widget: this,
             fieldErrorId: 'obviel-field-error-' + this.obj.prefixedName,
             globalErrorId: 'obviel-global-error-' + this.obj.prefixedName,
             prefixedName: this.obj.prefixedName });
    };

    module.Widget.prototype.renderLabel = function() {
        var self = this;
        if (self.obj.title) {
            var labelEl = $('<label for="obviel-field-' +
                            self.obj.prefixedName + '" ' +
                            'class="control-label">' +
                            entitize(self.obj.title) +
                            '</label>');
            if (self.obj.validate && self.obj.validate.required) {
                labelEl.addClass('obviel-required');
            }
            self.el.prepend(labelEl);
        }
        
        // add in description
        if (self.obj.description) {
            self.el.append('<div class="obviel-field-description">' +
                           entitize(self.obj.description) + '</div>');
        }
    };
    
    module.Widget.prototype.link = function(data, errors, globalErrors) {
        var self = this;
        var obj = self.obj;

        self.data = data;
        self.errors = errors;
        self.globalErrors = globalErrors;
        
        // prepare converters and back converters
        var linkContext = {};
        var errorLinkContext = {};
        var globalErrorLinkContext = {};
        
        var convertWrapper = function(value, source, target) {
            var result = self.handleConvert(value, source, target);
            if (result.error) {
                $(errors).setField(obj.name, result.error);
                // we cannot set the value later, so return undefined
                result.value = undefined;
            } else {
                $(errors).setField(obj.name, '');
            }
            // for any update to error status, trigger event
            $(source).trigger('form-change.obviel');
            
            return result.value;
        };
        
        var convertBackWrapper = function(value, source, target) {
            return self.handleConvertBack(value, source, target);
        };
        
        linkContext[obj.name] = {
            twoWay: true,
            name: 'obviel-field-' + obj.prefixedName,
            convert: convertWrapper,
            convertBack: convertBackWrapper
        };
        errorLinkContext[obj.name] = {
            twoWay: true,
            name: 'obviel-field-error-' + obj.prefixedName,
            convertBack: function(value, source, target) {
                $(target).text(value);
                if (value) {
                    $(target).trigger('field-error.obviel-forms');
                } else {
                    $(target).trigger('field-error-clear.obviel-forms');
                }
            }
        };
        globalErrorLinkContext[obj.name] = {
            twoWay: true,
            name: 'obviel-global-error-' + obj.prefixedName,
            convertBack: function(value, source, target) {
                $(target).text(value);
                if (value) {
                    $(target).trigger('global-error.obviel-forms');
                } else {
                    $(target).trigger('global-error-clear.obviel-forms');
                }
            }
        };
        
        // set up actual links
        var fieldEl = $('#obviel-field-' + obj.prefixedName,
                         self.el);
        fieldEl.link(data, linkContext);
        var errorEl = $('#obviel-field-error-' + obj.prefixedName,
                         self.el);
        errorEl.link(errors, errorLinkContext);
        var globalErrorEl = $('#obviel-global-error-' + obj.prefixedName,
                                self.el);
        globalErrorEl.link(globalErrors,
                             globalErrorLinkContext);
        
        // if there is a value, update the widget
        var linkedData = $(data);
        var existingValue = data[obj.name];
        if (existingValue !== undefined) {
            linkedData.setField(obj.name, existingValue);
        } else {
            // no value, see whether we need to set the default value
            if (obj.defaultvalue !== undefined) {
                linkedData.setField(obj.name, obj.defaultvalue);
            } else {
                // no default, start at null
                linkedData.setField(obj.name, null);
            }
        }

    };

    module.Widget.prototype.value = function() {
        return this.data[this.obj.name];
    };

    module.Widget.prototype.error = function() {
        return this.errors[this.obj.name];
    };

    module.Widget.prototype.globalError = function() {
        return this.globalErrors[this.obj.name];
    };
    
    module.Widget.prototype.handleConvert = function(value, source, target) {
        var self = this;
        // try to convert original form value
        var result = self.convert(value, source, target);
        if (result.error !== undefined) {
            // conversion error, so bail out
            return {
                error: result.error,
                value: value
            };
        }

        // this is the converted value, now validate it
        value = result.value;
        var error = self.validate(value);
        if (error !== undefined) {
            // validation error, so bail out
            return {
                error: error,
                value: value
            };
        }

        // conversion and validation both succeeded
        return {
            value: value
        };
    };

    module.Widget.prototype.handleConvertBack = function(value,
                                                          source, target) {
        var self = this;
        return self.convertBack(value, source, target);
    };
    
    module.Widget.prototype.convert = function(value) {
        return {value: value};
    };

    module.Widget.prototype.convertBack = function(value) {
        return value;
    };

    module.Widget.prototype.validate = function(value) {
        if (!this.obj.validate) {
            this.obj.validate = {};
        }
        return undefined;
    };

    module.Widget.prototype.change = function() {
        // notify that this widget changed, may need specific implementation
        // in subclasses but this is fairly generic
        var fieldEl = $('#obviel-field-' + this.obj.prefixedName);
        fieldEl.trigger('change');
    };

    obviel.iface('compositeField', 'widget');
    module.CompositeWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'compositeField'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.CompositeWidget.prototype = new module.Widget();

    module.CompositeWidget.prototype.init = function() {
        this.widgetViews = [];
    };

    module.CompositeWidget.prototype.cleanup = function() {
        $.each(this.widgetViews, function(index, view) {
            view.cleanup();
        });
    };
    
    module.CompositeWidget.prototype.render = function() {
        var self = this;
        
        var el = self.el;
        var obj = self.obj;
        
        var fieldEl = $('<div class="obviel-field-input controls" ' +
                            'id="obviel-field-' + obj.prefixedName + '">');
        
        $.each(obj.widgets, function(index, subWidget) {
            if (obj.disabled) {
                subWidget.disabled = true;
            }
            subWidget.prefixedName = (obj.prefixedName +
                                        '-' + subWidget.name);
            
            var subEl = $('<div class="obviel-field obviel-subfield">');
            subEl.addClass('obviel-fieldname-' + subWidget.name);
            $.each(subWidget.ifaces, function(i, value) {
                subEl.addClass(value);
            });
            subEl.render(subWidget).done(function(view) {
                view.renderErrorArea();
            });
            self.widgetViews.push(subEl.view());
            
            fieldEl.append(subEl);
        });
        el.append(fieldEl);
    };

    module.CompositeWidget.prototype.renderErrorArea = function() {
        // no error area
    };

    module.CompositeWidget.prototype.link = function(data, errors,
                                                     globalErrors) {
        var self = this;
        var name = self.obj.name;
        var subData = data[name];
        var subErrors = errors[name];
        var subGlobalErrors = globalErrors[name];
        if (subData === undefined) {
            subData = data[name] = {};
        }
        if (subErrors === undefined) {
            subErrors = errors[name] = {};
        }
        if (subGlobalErrors === undefined) {
            subGlobalErrors = globalErrors[name] = {};
        }
        $.each(self.widgetViews, function(index, view) {
            view.link(subData, subErrors, subGlobalErrors);
        });
    };

    module.CompositeWidget.prototype.change = function() {
        var self = this;
        $.each(self.widgetViews, function(index, view) {
            view.change();
        });
    };
    
    obviel.view(new module.CompositeWidget());

    obviel.iface('groupField', 'widget');
    module.GroupWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'groupField'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.GroupWidget.prototype = new module.Widget();

    module.GroupWidget.prototype.init = function() {
        this.widgetViews = [];
    };

    module.GroupWidget.prototype.cleanup = function() {
        $.each(this.widgetViews, function(index, view) {
            view.cleanup();
        });
    };

    module.GroupWidget.prototype.renderLabel = function() {
        // don't render label for group, fieldset already does this
    };

    module.GroupWidget.prototype.renderErrorArea = function() {
        // no error area
    };
    
    module.GroupWidget.prototype.render = function() {
        var self = this;
        var obj = self.obj;
        
        var fieldEl = $(
            '<fieldset class="obviel-fieldset obviel-fieldset-' +
                obj.name + '" ' +
                'id="obviel-fieldset-' + obj.prefixedName +
                '"></fieldset>');
        if (obj.title) {
            fieldEl.append(
                '<legend>' + entitize(obj.title) +
                    '</legend>');
        }

        $.each(obj.widgets, function(index, subWidget) {
            if (obj.disabled) {
                subWidget.disabled = true;
            }
            subWidget.prefixedName = (obj.prefixedName +
                                        '-' + subWidget.name);
            
            var subEl = $('<div class="obviel-field obviel-subfield">');
            subEl.addClass('obviel-fieldname-' + subWidget.name);
            $.each(subWidget.ifaces, function(i, value) {
                subEl.addClass(value);
            });
            if (subWidget['class']) {
                subEl.addClass(subWidget['class']);
            }
            subEl.render(subWidget).done(function(view) {
                view.renderLabel();
                view.renderErrorArea();
            });
            self.widgetViews.push(subEl.view());

            // somewhat nasty, but required for a lot of style issues
            // (they need an element at the end they can rely on, and
            // the field-error div gets removed from view at times)
            subEl.append(
                '<div class="obviel-field-clear">&#xa0;</div>');
            
            fieldEl.append(subEl);
        });
        
        self.el.append(fieldEl);
    };
    
    module.GroupWidget.prototype.link = function(data, errors,
                                                 globalErrors) {
        var self = this;
        $.each(self.widgetViews, function(index, view) {
            view.link(data, errors, globalErrors);
        });
    };

    module.GroupWidget.prototype.change = function() {
        var self = this;
        $.each(self.widgetViews, function(index, view) {
            view.change();
        });
    };
    
    obviel.view(new module.GroupWidget());

    
    obviel.iface('repeatingField', 'widget');
    module.RepeatingWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'repeatingField'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.RepeatingWidget.prototype = new module.Widget();

    module.RepeatingWidget.prototype.init = function() {
        this.widgetViews = [];
    };

    module.RepeatingWidget.prototype.cleanup = function() {
        $.each(this.widgetViews, function(index, view) {
            view.cleanup();
        });
    };
    
    module.RepeatingWidget.prototype.render = function() {
        var self = this;
        var fieldEl = $('<div class="obviel-field-input controls" ' +
                            'id="obviel-field-' + self.obj.prefixedName + '">');
        self.el.append(fieldEl);
    };

    module.RepeatingWidget.prototype.renderErrorArea = function() {
        // no error area
    };

    // receives data and error, the objects being linked
    module.RepeatingWidget.prototype.addItem = function(data,
                                                         errors,
                                                         globalErrors,
                                                         index,
                                                         removeFunc) {
        var self = this;
        var repeatEl = $('<div class="obviel-field obviel-repeatfield">');
        var compositeWidget = {
            ifaces: ['compositeField'],
            name: 'dummy',
            widgets: self.obj.widgets,
            disabled: self.obj.disabled,
            prefixedName: self.obj.prefixedName + '-' + index.toString()
        };
        repeatEl.render(compositeWidget);
        var newWidgetView = repeatEl.view();
        self.widgetViews.push(newWidgetView);
        var removeButton = $('<button class="obviel-repeat-remove-button" ' +
                              'type="button">-</button>');
        removeButton.trigger('button-created.obviel');
        removeButton.click(function() {
            $(this).parent().remove();
            removeFunc();
            // remove the widget view we added from the list too
            var newWidgetViews = [];
            $.each(self.widgetViews, function(index, widgetView) {
                if (widgetView === newWidgetView) {
                    widgetView.cleanup();
                    return;
                }
                newWidgetViews.push(widgetView);
            });
            self.widgetViews = newWidgetViews;
        });
        repeatEl.append(removeButton);

        var view = repeatEl.view();
        // XXX a hack to make sure the composite widget gets out
        // the data and errors in question
        view.link({dummy: data}, {dummy: errors}, {dummy: globalErrors});
        return repeatEl;
    };

    // receives data and errors which contain the lists to manipulate
    // not the objects being linked
    module.RepeatingWidget.prototype.removeItem = function(
        data, errors, globalErrors,
        removeItem, removeErrorItem, removeGlobalErrorItem) {
        var self = this;
        var name = self.obj.name;
        var oldItems = data[name];
        var oldErrorItems = errors[name];
        var oldGlobalErrorItems = globalErrors[name];
        var newItems = [];
        var newErrorItems = [];
        var newGlobalErrorItems = [];
        
        $.each(oldItems, function(index, item) {
            if (item === removeItem) {
                return;
            }
            newItems.push(item);
        });
        $.each(oldErrorItems, function(index, errorItem) {
            if (errorItem === removeErrorItem) {
                return;
            }
            newErrorItems.push(errorItem);
        });

        $.each(oldGlobalErrorItems, function(index, globalErrorItem) {
            if (globalErrorItem === removeGlobalErrorItem) {
                return;
            }
            newGlobalErrorItems.push(globalErrorItem);
        });
        data[name] = newItems;
        errors[name] = newErrorItems;
        globalErrors[name] = newGlobalErrorItems;
    };
    
    module.RepeatingWidget.prototype.link = function(data, errors,
                                                     globalErrors) {
        var self = this;

        var obj = this.obj;
        
        var fieldEl = $('#obviel-field-' + obj.prefixedName, self.el);
        var repeatButton = $('<button class="obviel-repeat-add-button" ' +
                              'type="button">+</button>');
        repeatButton.trigger('button-created.obviel');
        fieldEl.append(repeatButton);
        
        repeatButton.click(function() {
            var newData = {};
            var newErrors = {};
            var newGlobalErrors = {};
            var newIndex = fieldEl.data('obviel.repeat-index');
            data[obj.name].push(newData);
            errors[obj.name].push(newErrors);
            globalErrors[obj.name].push(newGlobalErrors);
            var removeFunc = function() {
                self.removeItem(data, errors, globalErrors,
                                 newData, newErrors, newGlobalErrors);
            };
            var newEl = self.addItem(newData, newErrors, newGlobalErrors,
                                       newIndex, removeFunc);
            repeatButton.before(newEl);
            fieldEl.data('obviel.repeat-index', newIndex + 1);
        });

        var items = data[obj.name];
        var errorItems = errors[obj.name];
        var globalErrorItems = globalErrors[obj.name];
        if (items === undefined) {
            items = data[obj.name] = [];
        }
        if (errorItems === undefined) {
            errorItems = errors[obj.name] = [];
        }
        if (globalErrorItems === undefined) {
            globalErrorItems = globalErrors[obj.name] = [];
        }
        
        $.each(items, function(index, newData) {
            var newErrors = errorItems[index];
            if (newErrors === undefined) {
                newErrors = {};
                errorItems.push(newErrors);
            }
            var newGlobalErrors = globalErrorItems[index];
            if (newGlobalErrors === undefined) {
                newGlobalErrors = {};
                globalErrorItems.push(newGlobalErrors);
            }
            var removeFunc = function() {
                self.removeItem(data, errors, globalErrors,
                                 newData, newErrors);
            };
            var newEl = self.addItem(newData, newErrors, newGlobalErrors,
                                       index, removeFunc);
            repeatButton.before(newEl);
        });
        fieldEl.data('obviel.repeat-index', items.length);
    };

    module.RepeatingWidget.prototype.change = function() {
        var self = this;
        $.each(self.widgetViews, function(index, view) {
            view.change();
        });
    };
    
    obviel.view(new module.RepeatingWidget());
    
    obviel.iface('inputField', 'widget');
    module.InputWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'inputField',
            obvt:
                '<div class="obviel-field-input controls">' +
                '<input type="text" data-func="attributes" name="obviel-field-{prefixedName}" data-id="obviel-field-{prefixedName}">' +
                '</div>'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.InputWidget.prototype = new module.Widget();

    module.InputWidget.prototype.attributes = function(el, variable) {
        if (variable('width')) {
            el.css('width', variable('width') + 'em');
        }
        if (variable('validate.maxLength')) {
            el.attr('maxlength', variable('validate.maxLength'));
        }
        if (variable('disabled')) {
            el.attr('disabled', variable('disabled'));
        }
    };
    
    module.InputWidget.prototype.convert = function(value) {
        if (value === '') {
            return {value: null};
        }
        return module.Widget.prototype.convert.call(this, value);
    };

    module.InputWidget.prototype.convertBack = function(value) {
        if (value === null) {
            return '';
        }
        return module.Widget.prototype.convertBack.call(this, value);
    };

    module.InputWidget.prototype.validate = function(value) {
        var self = this;
        var error = module.Widget.prototype.validate.call(this, value);
        // this can never happen but in subclasses it can, so it's
        // useful there when deriving from InputWidget
        //if (error !== undefined) {
        //    return error;
        //}
        if (self.obj.validate.required && value === null) {
            return _('this field is required');
        }
        return undefined;
    };
    
    obviel.iface('textlineField', 'inputField');

    module.TextLineWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'textlineField'
        };
        $.extend(d, settings);
        module.InputWidget.call(this, d);
    };

    module.TextLineWidget.prototype = new module.InputWidget();

    module.TextLineWidget.prototype.validate = function(value) {
        var self = this;
        var obj = self.obj;
        
        var error = module.InputWidget.prototype.validate.call(this, value);
        if (error !== undefined) {
            return error;
        }
        // if the value is empty and isn't required we're done
        if (value === null && !obj.validate.required) {
            return undefined;
        }
        
        if (obj.validate.minLength &&
            value.length < obj.validate.minLength) {
            return _('value too short');
        } else if (obj.validate.maxLength &&
                   value.length > obj.validate.maxLength) {
            return _('value too long');
        }

        if (obj.validate.regs) {
            $.each(obj.validate.regs, function(index, reg) {
                var regexp = new RegExp(reg.reg); // no flags?
                var result = regexp.exec(value);
                if (!result) {
                    error = reg.message;
                    return false;
                }
                return true;
            });
        }
        // return error; if there was a problem with the regex validation
        // that error message will be returned, otherwise undefined, meaning
        // no error
        return error;
    };

    obviel.view(new module.TextLineWidget());

    // text field (textarea)
    // even though we subclass input field, we are going to
    // reuse textlineField for most of its behavior
    obviel.iface('textField', 'inputField');
    module.TextWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'textField',
            obvt:
            '<div class="obviel-field-input controls">' +
            '<textarea data-func="attributes" name="obviel-field-{prefixedName}" data-id="obviel-field-{prefixedName}" />' +
            '</div>'
        };
        $.extend(d, settings);
        module.TextLineWidget.call(this, d);
    };

    module.TextWidget.prototype = new module.TextLineWidget();
    obviel.view(new module.TextWidget());
    
    module.TextWidget.prototype.attributes = function(el, variable) {
        module.TextLineWidget.prototype.attributes.call(this, el, variable);
        if (variable('height')) {
            el.css('height', variable('height') + 'em');
        }
    };

    obviel.iface('integerField', 'inputField');
    module.IntegerWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'integerField'
        };
        $.extend(d, settings);
        module.InputWidget.call(this, d);
    };

    module.IntegerWidget.prototype = new module.InputWidget();
    
    module.IntegerWidget.prototype.convert = function(value) {
        if (value === '') {
            return {value: null};
        }
        var asint = parseInt(value, 10);
        if (isNaN(asint)) {
            return {error: _("not a number")};
        }
        if (asint !== parseFloat(value)) {
            return {error: _("not an integer number")};
        }
        return {value: asint};
    };

    module.IntegerWidget.prototype.convertBack = function(value) {
        value = module.InputWidget.prototype.convertBack.call(this, value);
        return value.toString();
    };
 
    module.IntegerWidget.prototype.validate = function(value) {
        var self = this;
        var obj = self.obj;
        
        var error = module.InputWidget.prototype.validate.call(this, value);
        if (error !== undefined) {
            return error;
        }
        // if the value is empty and isn't required we're done
        if (value === null && !obj.validate.required) {
            return undefined;
        }

        if (!obj.validate.allowNegative && value < 0) {
            return _('negative numbers are not allowed');
        }
        if (obj.validate.length !== undefined) {
            var asstring = value.toString();
            if (asstring.charAt(0) === '-') {
                asstring = asstring.slice(1);
            }
            if (asstring.length !== obj.validate.length) {
                return Gettext.strargs(_('value must be %1 digits long'),
                                       [obj.validate.length]);
            }
        }
        return undefined;
    };

    obviel.view(new module.IntegerWidget());
    
    var isDecimal = function(sep, value) {
        var reg = '^[-]?([0-9]*)([' + sep + ']([0-9]*))?$';
        return (new RegExp(reg)).exec(value);
    };

    obviel.iface('floatField', 'inputField');
    module.FloatWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'floatField'
        };
        $.extend(d, settings);
        module.InputWidget.call(this, d);
    };

    module.FloatWidget.prototype = new module.InputWidget();

    module.FloatWidget.prototype.convert = function(value) {
        var self = this;
        var obj = self.obj;
        if (value === '') {
            return {value: null};
        }
        // XXX converter is getting information from validate,
        // but keep this for backwards compatibility
        obj.validate = obj.validate || {};
        var sep = obj.validate.separator || '.';

        if (!isDecimal(sep, value)) {
            return {error: _("not a float")};
        }
        if (sep !== '.') {
            value = value.replace(sep, '.');
        }
        var asfloat = parseFloat(value);
        if (isNaN(asfloat)) {
            return {error: _("not a float")};
        }
        return {value: asfloat};
    };

    module.FloatWidget.prototype.convertBack = function(value) {
        var self = this;
        var obj = self.obj;
        
        value = module.InputWidget.prototype.convertBack.call(this, value);
        value = value.toString();
        obj.validate = obj.validate || {};
        var sep = obj.validate.separator || '.';
        if (sep !== '.') {
            value = value.replace('.', sep);
        }
        return value;
    };
 
    module.FloatWidget.prototype.validate = function(value) {
        var self = this;
        var obj = self.obj;
        var error = module.InputWidget.prototype.validate.call(this, value);
        if (error !== undefined) {
            return error;
        }
        // if the value is empty and isn't required we're done
        if (value === null && !obj.validate.required) {
            return undefined;
        }

        if (!obj.validate.allowNegative && value < 0) {
            return _('negative numbers are not allowed');
        }
        return undefined;
    };
    obviel.view(new module.FloatWidget());

    obviel.iface('decimalField', 'inputField');
    module.DecimalWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'decimalField'
        };
        $.extend(d, settings);
        module.InputWidget.call(this, d);
    };

    module.DecimalWidget.prototype = new module.InputWidget();
    
    module.DecimalWidget.prototype.convert = function(value) {
        var self = this;
        var obj = self.obj;
        if (value === '') {
            return {value: null};
        }
        // XXX converter is getting information from validate,
        // but keep this for backwards compatibility
        obj.validate = obj.validate || {};
        var sep = obj.validate.separator || '.';

        if (!isDecimal(sep, value)) {
            return {error: _("not a decimal")};
        }
        
        // normalize to . as separator
        if (sep !== '.') {
            value = value.replace(sep, '.');
        }
        // this may be redunant but can't hurt I think
        var asfloat = parseFloat(value);
        if (isNaN(asfloat)) {
            return {error: _("not a decimal")};
        }
        // we want to return the string as we don't want to
        // lose precision due to rounding errors
        return {value: value};
    };

    module.DecimalWidget.prototype.convertBack = function(value) {
        var self = this;
        var obj = self.obj;
        value = module.InputWidget.prototype.convertBack.call(this, value);
        obj.validate = obj.validate || {};
        var sep = obj.validate.separator || '.';
        if (sep !== '.') {
            value = value.replace('.', sep);
        }
        return value;
    };
 
    module.DecimalWidget.prototype.validate = function(value) {
        var self = this;
        var obj = self.obj;
        var error = module.InputWidget.prototype.validate.call(this, value);
        if (error !== undefined) {
            return error;
        }
        // if the value is empty and isn't required we're done
        if (value === null && !obj.validate.required) {
            return undefined;
        }

        if (!obj.validate.allowNegative && value.charAt(0) === '-') {
            return _('negative numbers are not allowed');
        }
        
        var parts = value.split('.');
        var beforeSep = parts[0];
        var afterSep;
        if (parts.length > 1) {
            afterSep = parts[1];
        } else {
            afterSep = '';
        }

        if (beforeSep.charAt(0) === '-') {
            beforeSep = beforeSep.slice(1);
        }

        var minBeforeSep = obj.validate.minBeforeSep;
        
        if (minBeforeSep !== undefined &&
            beforeSep.length < minBeforeSep) {
            return Gettext.strargs(
                _('decimal must contain at least %1 digits before the decimal mark'),
                [minBeforeSep]);
        }
        var maxBeforeSep = obj.validate.maxBeforeSep;
        if (maxBeforeSep !== undefined &&
            beforeSep.length > maxBeforeSep) {
            return Gettext.strargs(
                _('decimal may not contain more than %1 digits before the decimal mark'),
                [maxBeforeSep]);
        }

        var minAfterSep = obj.validate.minAfterSep;
        if (minAfterSep !== undefined &&
            afterSep.length < minAfterSep) {
            return Gettext.strargs(
                _('decimal must contain at least %1 digits after the decimal mark'),
                [minAfterSep]);
        }

        var maxAfterSep = obj.validate.maxAfterSep;
        if (maxAfterSep !== undefined &&
            afterSep.length > maxAfterSep) {
            return Gettext.strargs(
                _('decimal may not contain more than %1 digits after the decimal mark'),
                [maxAfterSep]);
        }
        return undefined;
    };
    
    obviel.view(new module.DecimalWidget());

    obviel.iface('booleanField', 'widget');

    module.BooleanWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'booleanField',
            obvt:
            '<div class="obviel-field-input controls"><div data-unwrap="" data-if="label"><div data-unwrap="" data-if="labelBeforeInput">{label}</div></div>' +
            '<input type="checkbox" data-func="attributes" name="obviel-field-{prefixedName}" data-id="obviel-field-{prefixedName}" />' +
            '<div data-unwrap="" data-if="label"><div unwrap="" data-if="!labelBeforeInput">{label}</div></div>' +
            '</div>'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.BooleanWidget.prototype = new module.Widget();
    
    module.BooleanWidget.prototype.attributes = function(el, variable) {
        if (variable('disabled')) {
            el.attr('disabled', variable('disabled'));
        }
    };

    module.BooleanWidget.prototype.convert = function(value, source, target) {
        return {value:$(source).is(':checked')};
    };

    module.BooleanWidget.prototype.convertBack = function(
        value, source, target) {
        value = value || false;
        $(target).attr('checked', value);
    };
    
    obviel.view(new module.BooleanWidget());

    obviel.iface('choiceField', 'widget');
    
    module.ChoiceWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'choiceField',
            // XXX htmltag was used in jsontemplate for emptyOption and label
            // and value rendering
            obvt:
            '<div class="obviel-field-input controls">' +
            '<select data-func="attributes" name="obviel-field-{prefixedName}" data-id="obviel-field-{prefixedName}">' +
            '<option data-if="emptyOption" value="">{emptyOption}</option>' +
            '<option data-each="choices" value="{value}">{label}</option>' +
            '</select>'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.ChoiceWidget.prototype = new module.Widget();

    module.ChoiceWidget.prototype.attributes = function(el, variable) {
        if (variable('width')) {
            el.css('width', variable('width') + 'em');
        }
        if (variable('disabled')) {
            el.attr('disabled', variable('disabled'));
        }
    };

    module.ChoiceWidget.prototype.render = function() {
        var widget = this.obj;
        widget.validate = widget.validate || {};
        if (!widget.validate.required &&
            (widget.emptyOption === undefined) &&
            (widget.choices.length && widget.choices[0].value)) {
            $('select', this.el).prepend('<option></option>');
        }
    };
    
    module.ChoiceWidget.prototype.convert = function(value) {
        if (!value) {
            return {value: null};
        }
        return {value: value};
    };

    module.ChoiceWidget.prototype.convertBack = function(value) {
        if (value === null) {
            return '';
        }
        return value;
    };
    
    obviel.view(new module.ChoiceWidget());

    module.DisplayWidget = function (settings) {
        settings = settings || {};
        var d = {
            iface: 'displayField',
            obvt:
                '<div class="obviel-field-input controls">' +
                '<span name="obviel-field-{prefixedName}" data-id="obviel-field-{prefixedName}"> ' +
                '</span>' +
                '</div>'
        };
        $.extend(d, settings);
        module.Widget.call(this, d);
    };

    module.DisplayWidget.prototype = new module.Widget();

    module.DisplayWidget.prototype.convert = function (value) {
        return value;
    };

    module.DisplayWidget.prototype.convertBack = function(value) {
        var self = this;
        var valueToLabel = self.obj.valueToLabel || {};
        var displayValue = (valueToLabel[value] || value ||
                            self.obj.nullValue);
        $('#obviel-field-' + self.obj.prefixedName,  self.el).html(
                displayValue
        );
    };

    obviel.view(new module.DisplayWidget());

    module.HiddenWidget = function (settings) {
        settings = settings || {};
        var d = {
            iface: 'hiddenField',
            obvt:
            '<input type="hidden" name="obviel-field-{prefixed-name} data-id="obviel-field-{prefixedName}"/>'
        };
        $.extend(d, settings);
        module.DisplayWidget.call(this, d);
    };

    module.HiddenWidget.prototype = new module.DisplayWidget();

    module.HiddenWidget.prototype.convertBack = function (value) {
        var self = this;
        $('#obviel-field-' + self.obj.prefixedName).val(value);
    };

    obviel.view(new module.HiddenWidget());
    
}(jQuery, obviel, obviel.forms));
