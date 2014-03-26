YUI.add('gallery-text-resizer', function(Y) {

Y.namespace('Text').Resizer = Y.Base.create('text-resize', Y.Plugin.Base, [], {

  initializer : function() {
    Y.log('initializer', 'info', 'Y.Text.Resizer');

    var host = this.get('host');

    // set font to default
    Y.delegate('click', function(e){
      e.preventDefault();
      this.reset();
    }, host, '.text-resize-default', this);

    // set font to min
    Y.delegate('click', function(e){
      e.preventDefault();
      this.smallest();
    }, host, '.text-resize-smallest', this);

    // set font to max
    Y.delegate('click', function(e){
      e.preventDefault();
      this.largest();
    }, host, '.text-resize-largest', this);

    // increment font size
    Y.delegate('click', function(e){
      e.preventDefault();
      this.up();
    }, host, '.text-resize-up', this);

    /// decrement font size
    Y.delegate('click', function(e){
      e.preventDefault();
      this.down();
    }, host, '.text-resize-down', this);

    this.setSize(this._load() || this.get('baseSize'));
  },

  reset : function() {
    Y.log('reset', 'info', 'Y.Text.Resizer');
    this.setSize(this.get('baseSize'));
  },

  smallest : function() {
    Y.log('smallest', 'info', 'Y.Text.Resizer');
    this.setSize(this.get('smallest'));
  },

  largest : function() {
    Y.log('largest', 'info', 'Y.Text.Resizer');
    this.setSize(this.get('largest'));
  },

  up : function() {
    Y.log('up', 'info', 'Y.Text.Resizer');
    var c = this.get('currentSize');

    if(c + 1 <= this.get('largest')) {
      this.setSize(++c);
    }
  },

  down : function() {
    Y.log('down', 'info', 'Y.Text.Resizer');
    var c = this.get('currentSize');

    if(c - 1 >= this.get('smallest')) {
      this.setSize(--c);
    }
  },

  setSize : function(size) {
    Y.log('setSize', 'info', 'Y.Text.Resizer');
    this.set('currentSize', parseFloat(size, 10));
    this._save(size);
    this._update();
  },

  _update : function() {
    Y.log('_update', 'info', 'Y.Text.Resizer');
    Y.one(this.get('targetNode')).setStyle('fontSize', this.get('currentSize') + this.get('unit'));
  },

  _save : function(size) {
    Y.log('_save', 'info', 'Y.Text.Resizer');
    Y.Cookie.set(this.get('cookieName'), size + this.get('unit'), {
      'expires' : new Date("January 12, 2025"),
      'path' : '/'
    });
  },

  _load : function() {
    Y.log('_load', 'info', 'Y.Text.Resizer');
    return parseFloat(Y.Cookie.get(this.get('cookieName')), 10);
  }

}, {
  NS : 'textResizer',

  ATTRS : {
    currentSize : {
      value : 0
    },

    baseSize : {
      value : 12
    },

    smallest : {
      value : 9
    },

    largest : {
      value : 18
    },

    unit : {
      value : 'px'
    },

    cookieName : {
      value : 'YUI_TEXT_RESIZER'
    },
    
    targetNode : {
      value : 'body'
    }
  }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['node','event','cookie','base-build','plugin']});
