YUI.add('gallery-form-values', function(Y) {

Y.namespace('Form').Values = Y.Base.create('formValues', Y.Plugin.Base, [], {

  _values : null,

  initializer : function () {
    this.update();
  },

  update : function() {
    this._setFormValues();
  },

  getValues : function(){
    this.update();
    return this.get('values');
  },

  _setFormValues : function(){
    var _values = {},
        f = this.get('host');

    if(f !== null) {
      f.get('elements').each(function(field){
        var type = field.get('nodeName') + ':' + (field.get('type') || ''),
            name = field.get('name'),
            value;

        switch (type.toLowerCase()) {
          case 'input:' : // fall through intentional
          case 'input:text'   :
          case 'input:hidden' :
          case 'input:file' :
          case 'input:password' :
          case 'textarea:'    :
          case 'textarea:textarea'    :
          case 'select:'      :
          case 'select:select-one' :
            value = field.get('value');
            break;
            
          case 'select:select-multiple' :
            value = [];
            field.all('option').each(function(opt){
              if(opt.get('selected')) {
                value.push(opt.get('value'));
              }
            });
            break;

          case 'input:radio'    : // fall through intentional
          case 'input:checkbox' :
            value = field.get('checked') ? field.get('value') : undefined;
            break;
        }

        if(value !== undefined) {
          if (name in _values) {
            if(!Y.Lang.isArray(_values[name])) {
              _values[name] = [_values[name]];
            }
            _values[name].push(value);
          }else{
            _values[name] = value;
          }
        }
      });
    }

    this.set('values', _values);
  }
},{
  NS : 'values',
  ATTRS : {
    values : {
      readonly : true
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin','node-pluginhost','base-build']});
