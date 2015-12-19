/*global obviel: true, jQuery: true, templateUrl: true
  alert: true , browser: true, document: true, appUrl: true,
  window: true
*/

(function($, obviel, module) {

    obviel.iface('autocompleteField', 'textlineField');

    var _ = obviel.i18n.translate('obviel-forms');
    
    module.AutocompleteWidget = function(settings) {
        settings = settings || {};
        var d = {
            iface: 'autocompleteField'
        };
        $.extend(d, settings);
        module.TextLineWidget.call(this, d);
    };

    module.AutocompleteWidget.prototype = new module.TextLineWidget();

    module.AutocompleteWidget.prototype.render = function() {
        var self = this;
        var obj = self.obj;
        var el = self.el;
        module.TextLineWidget.prototype.render.call(this);
        
        var autocompleteOptions = obj.autocompleteOptions || {};
        var inputEl = $('#obviel-field-' + obj.prefixedName, el);
        var cloneEl = inputEl.clone();
        self.cloneEl = cloneEl;
        cloneEl.removeAttr('id');
        cloneEl.attr('name', 'obviel-field-cloned-' + obj.prefixedName);
        inputEl.hide();
        inputEl.after(cloneEl);
        
        var autocompleteData = obj.data;
        // obj.data can point to a list of mappings with keys 'label'
        // and 'value', and even though autocomplete() supports a similar
        // structure, we deal with these objects in a different way (mostly
        // because the autocomplete() places the value in the input on
        // autocomplete, which is rather ugly)
        var labelToValue = null;
        var valueToLabel = null;
        var labels = null;
        var source = null;
        if (typeof autocompleteData === 'string' || autocompleteData.url) {
            // obj.data is a string, meaning we get an url and possibly
            // a value to fill into the input, we provide a source
            // function for the autocomplete widget that retrieves
            // {'value': ..., 'label': ...} structures from the server
            // and then processes them for the rest of the mechanism
            var url = autocompleteData.url || autocompleteData;
            source = function(data, autocompleteCallback) {
                $.ajax({
                    type: 'GET',
                    url: url,
                    data: {
                        identifier: data.identifier,
                        term: data.term,
                        limit: autocompleteOptions.limit || 10
                    },
                    dataType: 'json',
                    success: function(data) {
                        labelToValue = {};
                        valueToLabel = {};
                        labels = [];

                        self.labelToValue = self.labelToValue || {};
                        self.valueToLabel = self.labelToValue || {};

                        $.each(data, function(index, item) {
                            self.labelToValue[item.label] = item.value;
                            self.valueToLabel[item.value] = item.label;
                            labels.push(item.label);
                        });
                        autocompleteCallback(labels);
                    },
                    error: function(xhr, status, error) {
                        // XXX must always call autocomplete callback
                        // even when there's an error?
                    }
                });
            };
        } else if (autocompleteData.length &&
                   typeof autocompleteData[0] !== 'string') {
            labelToValue = {};
            valueToLabel = {};
            labels = [];
            $.each(autocompleteData, function(index, item) {
                labelToValue[item.label] = item.value;
                valueToLabel[item.value] = item.label;
                labels.push(item.label);
            });
            self.labelToValue = labelToValue;
            self.valueToLabel = valueToLabel;
            source = labels;
        }

        self.source = source;
        
        autocompleteOptions.source = source;
        var ignoreBlur = false;
        autocompleteOptions.open = function(ev) {
            ignoreBlur = true;
        };
        autocompleteOptions.close = function(ev) {
            ignoreBlur = false;
            // it is possible that the close was not preceded by a
            // selection but an immediate blur (by pressing tab).
            // since we ignored the blur, we want to trigger
            // a change explicitly so we can report errors
            inputEl.val(cloneEl.val());
            var changeEv = $.Event('change');
            changeEv.target = inputEl;
            inputEl.trigger(changeEv);
        };
        cloneEl.autocomplete(autocompleteOptions);
        // when the user blurs away from the field, we want to validate the
        // field unless we blurred away because we opened the autocomplete
        // popup
        cloneEl.blur(function(ev) {
            if (ignoreBlur) {
                return;
            }
            inputEl.val(cloneEl.val());
            var changeEv = $.Event('change');
            changeEv.target = inputEl;
            inputEl.trigger(changeEv);
        });
    };
    
    module.AutocompleteWidget.prototype.validate = function(value) {
        var result = module.TextLineWidget.prototype.validate.call(this, value);
        if (result !== undefined) {
            return result;
        }
        return undefined;
    };

    module.AutocompleteWidget.prototype.convert = function(value) {
        var result = module.TextLineWidget.prototype.convert.call(
            this, value);
        if (result.error !== undefined) {
            return result;
        }
        if (result.value === null) {
            return result;
        }
        value = this.labelToValue[result.value];
        if (value === undefined) {
            return {error: _('unknown value')};
        }
        return {value: value};
    };

    module.AutocompleteWidget.prototype.convertBack = function(
        value, source, target) {
        var self = this;
        var result = module.TextLineWidget.prototype.convertBack.call(
            this, value);
        target = $(target);
        if (result === null) {
            target.val('');
            this.cloneEl.val('');
        }

        var setValue = function() {
            value = self.valueToLabel[result];
            if (value === undefined) {
                target.val(''); // XXX should never happen?
                self.cloneEl.val('');
            }
            // set the value in the input
            target.val(value);
            // set the value in the cloned element too
            self.cloneEl.val(value);
        };

        if (!$.isFunction(this.source)) {
            setValue();
        } else if (this.valueToLabel === undefined ||
                    this.valueToLabel[value] === undefined) {
            this.source.call(this, {identifier: value}, setValue);
        } else {
            setValue();
        }
    };
    
    obviel.view(new module.AutocompleteWidget());

}(jQuery, obviel, obviel.forms));
