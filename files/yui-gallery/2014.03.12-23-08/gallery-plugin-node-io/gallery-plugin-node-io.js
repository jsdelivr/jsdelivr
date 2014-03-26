YUI.add('gallery-plugin-node-io', function(Y) {

  /**
   * Node IO provides a simple interface to load text into a node
   *
   * @class NodeIo
   * @extends Base
   * @version 1.1.0
   */
  var YL = Y.Lang;

  Y.Plugin.NodeIo = Y.Base.create('node-io', Y.Base, [], {

    ///////  P U B L I C  //////
    /**
     * Set up ioHandler and bind events
     * @since 1.1.0
     * @method initializer
     */
    initializer : function(){
      this.publish('success', {defaultFn: this._defSuccessFn });

      this.after('uriChange', this._afterUriChange);

      this._ioHandlers = {
        complete: Y.bind(this._handleResponse, this, 'complete'),
        success: Y.bind(this._handleResponse, this, 'success'),
        failure: Y.bind(this._handleResponse, this, 'failure'),
        end: Y.bind(this._handleResponse, this, 'end')
      };
    },

    /**
     * Set uri and start io
     * @since 1.0.0
     * @method load
     * @chainable
     * @return {NodeIo} A reference to this object
     */
    load : function(uri) {
      var config = this.get('ioConfig');

      if(!uri) {
        uri = this.get('uri');
      }else{
        this.set('uri', uri);
      }

      config.on = this._ioHandlers;

      this._io = Y.io(uri, config);

      return this;
    },

    /**
     * Sugar method to refresh the content
     * Not recommended if placement is not `replace`
     * @since 1.0.0
     * @method refresh
     * @chainable
     * @return {NodeIo} A reference to this object
     */
    refresh : function(){
      return this.load();
    },

    /**
     * Stops any current io
     * @since 1.0.0
     * @method abort
     * @chainable
     * @return {NodeIo} A reference to this object
     */
    abort : function() {
      this._stopIO();
      return this;
    },


    //////  P R O T E C T E D  //////

    /**
     * Local storage of the internal Y.io
     * @since 1.0.0
     * @protected
     */
    _io: null,

    /**
     * Object used to set the on of the _io
     * @since 1.1.0
     * @protected
     */
    _ioHandlers: null,

    /**
     * Aborts any current io
     * @since 1.0.0
     * @method _stopIO
     * @protected
     */
    _stopIO : function() {
      if(this._io) {
        this._io.abort();
        this._io = null;
      }
    },

    /**
     * Single interface for io responses
     * @since 1.1.0
     * @method _handleResponse
     * @protected
     */
    _handleResponse : function (type, id, o) {
      this.fire(type, {id: id, response: o});
      this._io = null;
    },

    /**
     * Default onSuccess method for io
     * Inserts response text into the host by placement
     * @since 1.1.0
     * @method _defSuccessFn
     * @protected
     */
    _defSuccessFn : function(e) {
      this.get('host').insert(e.response.responseText, this.get('placement'));
    },

    /**
     * Aborts any io when the uri is changed
     * @since 1.1.0
     * @method _afterUriChange
     * @protected
     */
    _afterUriChange : function() {
      this._stopIO();
    }

  }, {
    NS : 'io',
    ATTRS : {
      /**
       * Stores host node
       * @since 1.0.0
       * @attribute host
       * @type Y.Plugin.Host
       */
      host : {
        writeOnce : true
      },

      /**
       * Allows for advanced io configuration
       * @since 1.0.0
       * @attribute ioConfig
       * @type object
       * @default {}
       */
      ioConfig : {
        value : {},
        validator : YL.isObject
      },

      /**
       * Placement of responseText
       * @since 1.0.0
       * @attribute placement
       * @type string
       * @defautl replace
       */
      placement : {
        value : 'replace',
        validator : function(val) {
          return (/replace|(?:ap|pre)pend/).test(val);
        }
      },

      /**
       * Specifies the URI for the io
       * @since 1.0.0
       * @attribute uri
       * @type string
       */
      uri : {
        validator : YL.isString
      }
    }
  });


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin','node-base','node-pluginhost','io-base','base-build']});
