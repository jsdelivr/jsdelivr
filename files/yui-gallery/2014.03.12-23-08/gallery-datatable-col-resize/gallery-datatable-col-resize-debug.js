YUI.add('gallery-datatable-col-resize', function (Y, NAME) {

    function DatatableColResizePlugin(config) {
        DatatableColResizePlugin.superclass.constructor.apply(this, arguments);
    }

    // Define Static properties NAME (to identify the class) and NS (to identify the namespace)
    DatatableColResizePlugin.NAME = 'DatatableColResizePlugin';
    DatatableColResizePlugin.NS = 'ddr';

    // Attribute definitions for the plugin
    DatatableColResizePlugin.ATTRS = {
    	gripClass:{value: 'grip'},
      ellipsis: {value: true}

    };

    // Extend Plugin.Base
    Y.extend(DatatableColResizePlugin, Y.Plugin.Base, {

    _host : null,

    initializer : function() {
      Y.log('initializer', 'info', 'plugin-resize');
      this._host = this.get('host');
      this._host.get('boundingBox').addClass(this._host.getClassName('resize'));
      if(this.get("ellipsis")){
        this._host.get('boundingBox').addClass(this._host.getClassName('ellipsis'));
      }
      this.afterHostEvent('render', function(e){
      	var thead = this._host.get('boundingBox').one("thead");
      	var cells = thead.all("th");
      	this._afterHostSetHeaders(cells);
      }, this)
    },

    /**
     * House keeping after a we are unplugged
     *
     */
    destructor : function() {
      Y.log('destructor', 'info', 'plugin-resize');
      this._host.get('boundingBox').removeClass(this._host.getClassName('resize'));
      this._host.get('boundingBox').removeClass(this._host.getClassName('ellipsis'));
      this._removeGrips();
    },


    //  P R O T E C T E D  //

    /**
     *
     */
    _afterHostSetHeaders : function(headerCells) {
      this._removeGrips();

      headerCells.each(function(cell){
        var grip = Y.Node.create('<span class="yui3-icon ' + this.get('gripClass') + '"></span>');

        grip.plug(Y.Plugin.Drag);

        grip.dd.on('drag:drag', this._handleDrag, this);

        grip.setData('target', cell);

        grip.setStyle('opacity', (this.get('visible')) ? 1 : 0 );

        cell.append(grip);

      }, this);
    },

    _handleDrag : function(e) {
      var handle = e.target.get('node'),
          target = handle.getData('target');

      handle.setStyle('left', 'auto');

      target.setStyle('width', e.target.actXY[0] + parseInt(target.getStyle('width'),10) - e.target.lastXY[0]);

      // dont update the handle position
      e.preventDefault();
    },

    _removeGrips : function() {
      this._host.get('boundingBox').all('.' + this.get('gripClass')).remove(true);
    }

    });

    Y.DatatableColResizePlugin = DatatableColResizePlugin;

}, 'gallery-2012.12.05-21-01', {"skinnable": false, "requires": ["plugin", "datatable", "node", "dd-plugin"]});
