YUI.add('gallery-plugin-collapse', function(Y) {


  Y.namespace('Plugin').Collapse = Y.Base.create('collapse', Y.Plugin.Base, [], {

    /**
     * track anim to reverse animations
     */
     _anim : null,

    /**
     * width to animate to when lockWidth is false
     */
    _maxWidth : 0,

    /**
     * height to animate to when lockHeight is false
     */
    _maxHeight : 0,

    /**
     * sets the initial _maxWidth and/or _maxHeight based on lock values
     * animates to initial state
     */
    initializer : function() {
      var host = this.get('host'),styles = {};

      this._maxWidth = host.get('offsetWidth');
      this._maxHeight = host.get('offsetHeight');

      if(this.get('state') === 'closed') {
        styles.overflow = this.get('endOverflow');


          if(!this.get('lockWidth')) {
            styles.width = 0;
          }else{
            styles.width = this._maxWidth;
          }

          if(!this.get('lockHeight')) {
            styles.height = 0;
          }else{
            styles.height = this._maxHeight;
          }

          host.setStyles(styles);
      }
    },

    /**
     * animates the panel open
     */
    open : function() {
      if(this._anim && this._anim.get('running')) {
        this._anim.stop(false);
      }

      var to = {}, config = this._getBaseConfig();

      if(!this.get('lockWidth')) {
        to.width = this._maxWidth;
      }

      if(!this.get('lockHeight')) {
        to.height = this._maxHeight;
      }

      config.to = to;

      this._anim = new Y.Anim(config);

      this._anim.run();

      this.set('state', 'opened');
    },

    /**
     * animates the panel closed
     */
    close : function() {
      if(this._anim && this._anim.get('running')) {
        this._anim.stop(false);
      }

      var to = {}, config = this._getBaseConfig();

      if(!this.get('lockWidth')) {
        to.width = 0;
      }else{
        to.width = this._maxWidth;
      }

      if(!this.get('lockHeight')) {
        to.height = 0;
      }else{
        to.height = this._maxHeight;
      }

      config.to = to;

      this._anim = new Y.Anim(config);

      this._anim.run();

      this.set('state', 'closed');
    },

    toggle : function() {
      if(this.get('state') === 'closed') {
        this.open();
      }else{
        this.close();
      }
    },

    /**
     * updates _maxWidth and/or _maxHeight based on lock values
     * you will generally want to call this when the content
     *   of the host is altered
     */
    refresh : function() {
      var styles = {}, host = this.get('host'),
          lockW = this.get('lockWidth'),
          lockH = this.get('lockHeight');

        styles.height = host.getStyle('height');
        styles.width = host.getStyle('width');
        styles.overflow = host.getStyle('overflow');
        styles.opactiy = host.getStyle('opacity');
        styles.visibility = host.getStyle('visibility');

        // record max height
        host.setStyles({
          'overflow' : 'auto',
          'opacity' : 1,
          'visibility' : 'visible'
        });

        if(!lockW) {
          host.setStyle('width','auto');
        }

        if(!lockH) {
          host.setStyle('height','auto');
          this._maxHeight = host.get('offsetHeight');
        }

        // couldn't do this earlier in case the height wasn't locked
        if(!lockW) {
          this._maxWidth = host.get('offsetWidth');
        }

        // set styles changed back to what they were
        host.setStyles(styles);
    },

    /**
     * internal sugar for base anim config
     */
    _getBaseConfig : function(){
      return {
        node : this.get('host'),
        easing : this.get('easing'),
        duration : this.get('duration'),
        on : {
          start : function(e) {
            e.currentTarget.get('node').setStyle('overflow','hidden');
          },
          end : function(e) {
            e.currentTarget.get('node').setStyle('overflow', this.get('endOverflow'));
          }
        }
      };
    }

  }, {
    NS : 'collapse',
    ATTRS : {

      /**
       * true | keep panel width
       * false | animate panel width
       */
      lockWidth : {
        value : true
      },

      /**
       * true | keep panel height
       * false | animate panel height
       */
      lockHeight : {
        value : false
      },

      /**
       * initial state
       * @param String opened|closed
       */
      state : {
        value : 'opened'
      },

      /**
       * style open and close animations occur
       */
      easing : {
        value : Y.Easing.easeOutStrong
      },

      /**
       * speed open and close animations occur
       */
      duration : {
        value : 0.5
      },

      /**
       * allows custom end overflow value in case hidden doesn't
       *   work for open panels
       */
      endOverflow : {
        value : 'hidden'
      }
    }
  });
  


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin','node-pluginhost','anim-easing','base-build']});
