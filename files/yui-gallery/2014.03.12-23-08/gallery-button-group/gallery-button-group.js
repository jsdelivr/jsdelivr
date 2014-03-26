YUI.add('gallery-button-group', function(Y) {

var YL = Y.Lang;

Y.ButtonGroup = Y.Base.create('button-group', Y.Widget, [Y.WidgetParent,Y.WidgetChild], {

  labelNode : null,

  initializer : function(config) {

    this.labelNode = Y.Node.create('<span class="' + this.getClassName('label') + '"/>');
  },

  renderUI : function() {

    this.get('boundingBox').prepend(this.labelNode);
  },

  bindUI : function() {

    this.on('button:press', function(e) {
      if(this.get('alwaysSelected')) {
        var selection = this.get('selection'),
            button = e.target;

        if(selection === button || ( // selection is the button OR
          selection instanceof Y.ArrayList && // selection is an array AND
          selection.size() === 1 && // there is only one item AND
          selection.item(0) === button) // that one itme is the button
        ) {
          e.preventDefault();
        }

      }
    },this);
  },

  syncUI : function() {

    this.labelNode.set('text',this.get('label'));
  }

}, {
  ATTRS : {

    label : {
      validator : YL.isString,
      setter : function(val) {
        this.labelNode.set('text', val);
        return val;
      }
    },

    defaultChildType : {
      value : Y.Button
    },

    alwaysSelected : {
      value : false
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['widget-parent','widget-child']});
