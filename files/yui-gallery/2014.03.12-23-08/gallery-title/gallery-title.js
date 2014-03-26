YUI.add('gallery-title', function(Y) {

Y.Title = Y.Base.create('title', Y.Base, [Y.Plugin.Host], {

  doc : Y.config.doc,

  initializer : function() {
    this.after('titleChange', this._afterTitleChange);
    this.after('indicatorChange', this._afterIndicatorChange);
    this.after('separatorChange', this._afterSeparatorChange);

    if(this.get('title') === undefined) {
      this.set('title', this.doc.title);
    }

    this.refresh();
  },

  refresh : function() {
    var indicator = this.get('indicator'),
        title = this.get('title'),
        separator = this.get('separator'),
        display = this.get('displayTemplate'),
        displayConfig = {indicator:'', separator:'', title:''};

    if(indicator) {
      displayConfig.indicator = indicator;

      if(separator) {
        displayConfig.separator = separator;
      }

    }

    displayConfig.title = title;

    this.doc.title = Y.substitute(display, displayConfig);
  },

  _afterTitleChange : function(e) {
    this.refresh();
  },

  _afterIndicatorChange : function(e) {
    this.refresh();
  },

  _afterSeparatorChange : function(e) {
    this.refresh();
  }

}, {
  ATTRS : {

    title : {},

    indicator : {
      value : ''
    },

    separator : {
      value : ' : '
    },

    displayTemplate : {
      value : '{indicator}{separator}{title}'
    }

  }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['base','event','substitute','plugin-host']});
