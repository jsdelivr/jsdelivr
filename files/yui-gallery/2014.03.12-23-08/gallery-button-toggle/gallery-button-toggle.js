YUI.add('gallery-button-toggle', function(Y) {

var YL = Y.Lang,
    DESELECTED_CALLBACK = 'deselectedCallback';

Y.ButtonToggle = Y.Base.create('button', Y.Button, [], {

    _defPressFn : function(e) {
      var newSelected = (this.get('selected') === 0) ? 1 : 0;
        this.set('selected', newSelected);

        if(newSelected) {
          this._executeCallback(e);
        }else{
          this._executeDeselectCallback(e);
        }
    },

    _executeDeselectCallback : function(e) {
      if(this.get(DESELECTED_CALLBACK)) {
        (this.get(DESELECTED_CALLBACK))(e);
      }
    }

}, {
    ATTRS : {
        deselectedCallback : {
            validator : YL.isFunction
        }
    }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['gallery-button']});
