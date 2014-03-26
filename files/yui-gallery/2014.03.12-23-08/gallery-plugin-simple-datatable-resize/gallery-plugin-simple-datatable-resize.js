YUI.add('gallery-plugin-simple-datatable-resize', function(Y) {

Y.Plugin.SDTResize= Y.Base.create('simple-datatable-resize', Y.Plugin.Base, [], {

  _host : null,

  _tHead : null,

  initializer : function() {
    this._host = this.get('host');
    this._host.get('boundingBox').addClass(this._host.getClassName('resize'));
    this.afterHostMethod('setHeaders', this._afterHostSetHeaders);
    if(this._host.headersSet) {
      this._afterHostSetHeaders();
    }
  },

  /**
   * House keeping after a we are unplugged
   *
   */
  destructor : function() {
    this._host.get('boundingBox').removeClass(this._host.getClassName('resize'));
    this._removeGrips();
  },

  //  P R O T E C T E D  //

  /**
   *
   */
  _afterHostSetHeaders : function() {

    this.publish('sort', {defaultFn: this._defSortFn});
    
    this._removeGrips();
    this._tHead = this._host.get('contentBox').one('thead');
    
    this._tHead.all('th:not([resizable="false"]) .yui3-sdt-liner').each(function(header){
      var grip = Y.Node.create('<div class="' + this.get('gripClass') + '"><span class="yui3-icon"></span></div>');

      grip.plug(Y.Plugin.Drag);

      grip.dd.on('drag:drag', this._handleDrag, this);

      grip.setData('target', header);

      grip.setStyle('opacity', (this.get('visible')) ? 1 : 0 );

      header.append(grip);

    }, this);
  },

  _handleDrag : function(e) {
    var handle = e.target.get('node'),
        target = handle.getData('target'),
        th = target.ancestor('th');

    handle.setStyle('left', 'auto');

    th.setStyle('width', e.target.lastXY[0] + parseInt(handle.getStyle('width'),10) - th.getX());

    // dont update the handle position
    e.preventDefault();
  },

  _removeGrips : function() {
    this._host.get('boundingBox').all('.' + this.get('gripClass')).remove(true);
  }


}, {

  NS : 'resize',

  ATTRS : {
    gripClass : {
      value : 'yui3-icon-vgrip'
    },
    minWidth : {
      value : 50
    },
    visible: {
      value : true
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin','dd-constrain','dd-plugin']});
