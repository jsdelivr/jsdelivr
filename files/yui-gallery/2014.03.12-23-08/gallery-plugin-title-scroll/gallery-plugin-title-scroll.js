YUI.add('gallery-plugin-title-scroll', function(Y) {

  Y.Plugin.TitleScroll = Y.Base.create('title-scroll', Y.Plugin.Base, [], {

    _timer : new Y.Timer(),

    _originalTitle : '',

    _newTitle : '',

    initializer : function() {
      this._captureOriginal();
      this._timer.set('callback', Y.bind(this._scrollTitle, this));
    },

    start : function(){
      this._captureOriginal();
      this._newTitle = this._normalize(this._originalTitle + this._getWhiteSpace());
      this._timer.set('length', this.get('speed'));
      if(this.get('scrollOnce')) {
        this._timer.set('repeatCount', this._newTitle.length);
      }
      this._timer.start();
      return this;
    },

    stop : function(original) {
      this._timer.stop();
      if(original) {
        this._setTitle(this._originalTitle);
      }
      return this;
    },

    _normalize : function(val) {
      return val.replace(/ /gi, String.fromCharCode(160));
    },

    _getWhiteSpace : function() {
      var i, count = this.get('whiteSpace') || 1, space = '';
      for(i = 0; i < count; i++ ) {
        space += ' ';
      }
      return space;
    },

    _captureOriginal : function() {
      this._originalTitle = this.get('host').get('title');
    },

    _scrollTitle : function(e) {
      var n = this.get('direction') == 'right' ?
              this._newTitle.slice(this._newTitle.length - 1) + this._newTitle.slice(0,this._newTitle.length - 1) :
              this._newTitle.slice(1) + this._newTitle.slice(0,1);

      this._newTitle = n;
      this._setTitle(n);
    },

    _setTitle : function(val) {
      this.get('host').set('title', val);
    }

  }, {
    NS : 'scroll',
    ATTRS : {
      whiteSpace : {
        value : 1
      },
      direction: {
        value : 'left', // optional 'right'
        validator : function(val) {
          val = val.toString().toLowerCase();
          if(val === 'left' || val === 'right') {
            return true;
          }
          return false;
        }
      },
      speed : {
        value : 200
      },
      scrollOnce : {
        value : false
      }
    }
  });


}, 'gallery-2011.03.11-23-49' ,{requires:['plugin','gallery-timer']});
