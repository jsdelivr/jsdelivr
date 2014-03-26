YUI.add('gallery-jump-list-fader', function(Y) {

Y.namespace('Plugin').JumpListFader = Y.Base.create('jump-list-fader', Y.Plugin.Base, [], {

  _anims : [],

  _animBase : {
    on : {
      start : function(e){
        e.currentTarget.get('node').setStyle('overflow','hidden');
      },
      end: function(e){
        e.currentTarget.get('node').setStyle('overflow','hidden');
      }
    }
  },

  _animHideTo : { height: 0, opacity: 0 },

  _animShowTo : { opacity: 1 },

  initializer : function(config) {

    // set base anim duration
    this._animBase.easing = this.get('easing');
    this._animBase.duration = this.get('duration');

    // clean up the back to top options
    this._hideShowAllLinks();
    Y.one(this.get('container')).all('.back-to-top').set('text','Show All').on('click',function(e){
      e.preventDefault();
      this._showAll();
    },this);

    // register initial selection
    this.get('selection');

    // add in delegation for links
    Y.delegate('click', function(e){

      var href = e.currentTarget.getAttribute('href'),
        target, hash;

      // make sure the link we clicked has a hash and is for this page
      if('#' !== href.substring(0,1)){
        return;
      }

      // if we made it this far let's prevent the link from firing
      e.preventDefault();

      // get the hash from the clicked href
      hash = href.substring(1);

      // find the target in the container with the hash
      target = Y.one(this.get('container')).one('a[name=' + hash + ']') ||
               Y.one(this.get('container')).one('#' + hash);

      if(target !== null) {
         this.set('selection',target);
      }

    }, this.get('host'), this.get('selector'), this);
  },

  _clearAnims : function() {
    // stop and remove all animations
    Y.Array.invoke(this._anims, 'stop', false);
    this._anims = [];
  },

  _runAnims : function() {
    Y.Array.invoke(this._anims, 'run');
  },


  _addAnimToGroup : function(group,anim) {
    group.each(function(o){
      switch (anim) {
        case 'hide' :
          if(parseInt(o.getStyle('opacity'),10) === 0) {
            return;
          }
          var animConfig = this._animBase;
          animConfig.to = this._animHideTo;
          animConfig.node = o;
          this._anims.push(new Y.Anim(animConfig));
          break;

        case 'show' :
          this._anims.push(this._getOpenAnim(o));
          break;
      }
    },this);
  },

  _getOpenAnim : function(node) {
    var mH = 0, styles = {},
        animConfig = this._animBase;

    styles.height = node.getStyle('height');
    styles.overflow = node.getStyle('overflow');
    styles.opactiy = node.getStyle('opacity');
    styles.visibility = node.getStyle('visibility');

    // record max height
    node.setStyles({
      'height' : 'auto',
      'overflow' : 'auto',
      'opacity' : 1,
      'visibility' : 'visible'
    });

    mH = node.get('offsetHeight');

    // set styles changed back to what they were
    node.setStyles(styles);

    animConfig.to = this._animShowTo;
    animConfig.to.height = mH + 'px';
    animConfig.node = node;
    return new Y.Anim(animConfig);
  },

  _showAll : function() {
    this._clearAnims();
    this._addAnimToGroup(Y.one(this.get('container')).all('.' + this.get('groupClass')), 'show');
    this._runAnims();
    this._hideShowAllLinks();
    this._setActiveSelector();
  },

  _hideAll : function() {
    this._clearAnims();
    this._addAnimToGroup(Y.one(this.get('container')).all('.' + this.get('groupClass')), 'hide');
    this._runAnims();
    this._setActiveSelector();
  },

  _hideAllExcept : function(target) {
    var groupClass = this.get('groupClass'),
        groups = Y.one(this.get('container')).all('.' + groupClass),
        animTarget, index;

    this._clearAnims();

    // remove the current target from the groups node list
    animTarget = target;
    if(!animTarget.hasClass(groupClass)) {
      animTarget = animTarget.ancestor('.' + groupClass);
    }
    index = groups.refresh().indexOf(animTarget);
    if(index > -1) {
      groups._nodes.splice(index,1);
    }

    this._addAnimToGroup(groups, 'hide');

    if(animTarget.getStyle('opacity') != 1) {
      this._anims.push(this._getOpenAnim(animTarget));
    }

    this._runAnims();

    this._hideShowAllLinks(animTarget);

    // set the current selected to active
    this._setActiveSelector('#' + (target.get('name') || target.get('id')));
  },

  _hideShowAllLinks : function(show) {
    Y.one(this.get('container')).all('.back-to-top').setStyle('visibility','hidden');
    if(show) {
      show.all('.back-to-top').setStyle('visibility','visible');
    }
  },

  _setActiveSelector : function(hash) {
    this.get('host').all('.active').removeClass('active');
    if(hash) {
      this.get('host').all(this.get('selector') + '[href=' + hash + ']').addClass('active');
    }
  }


}, {
  NS : 'jumpListFader',
  ATTRS : {
    selector : {
      value : 'a'
    },
    container : {
      value : '#jump-to-container'
    },
    groupClass : {
      value : 'jump-group'
    },
    easing : {
      easing : Y.Easing.easeOutStrong
    },
    duration : {
      value : 0.28
    },
    selection : {
      value : 'all',
      setter : function(val) {
        if(val === null) {
          this._hideAll();
        }else if(val === 'all') {
          this._showAll();
        }else if(val instanceof Y.Node) {
          this._hideAllExcept(val);
        }
        return val;
      }
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['node-pluginhost','anim-easing','event-base','event-delegate','plugin','base-build','collection']});
