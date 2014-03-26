YUI.add('gallery-google-maps-frame', function(Y) {

/**
 * @module gallery-google-maps-frame
 */
(function (Y, moduleName) {
    'use strict';

    var _Base = Y.Base,
        _Frame = Y.Frame;
        
    /**
     * @class GoogleMapsFrame
     * @constructor
     * @extends Base
     * @param {Object} config
     */
    Y.GoogleMapsFrame = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            var me = this;
            
            /**
             * Fired when Google Maps Loader fails.
             * @event failure
             */
            me.publish('failure');
            
            /**
             * Fired when Google Maps Loader succeeds.
             * @event load
             * @fireOnce
             */
            me.publish('load', {
                fireOnce: true
            });
            
            /**
             * Fired when Google Maps Loader times out.
             * @event timeout
             */
            me.publish('timeout');

            var frame = new _Frame({
                content: '<div id="map"></div>',
                extracss: 'body, html, #map {height: 100%; width: 100%;}',
                use: []
            });

            frame.on('ready', function () {
                var iY = frame.getInstance();

                iY.config.win.YUI = YUI;
                iY.Get.jsOptions.doc = iY.config.doc;
                
                iY.use('gallery-google-maps-loader', 'node', function (iY) {
                    var googleMapsLoader,
                        source = me.get('source'),
                        timeout = me.get('timeout');
                    
                    if (source !== null) {
                        googleMapsLoader = {
                            source: source
                        };
                        
                        if (timeout !== null) {
                            googleMapsLoader.timeout = timeout;
                        }
                    } else if (timeout !== null) {
                        googleMapsLoader = {
                            timeout: timeout
                        }
                    }
                    
                    googleMapsLoader = new iY.GoogleMapsLoader(googleMapsLoader);

                    googleMapsLoader.on('failure', function () {
                        me.fire('failure');
                    });
                    
                    googleMapsLoader.on('success', function () {
                        me.google = iY.config.win.google;
                        me._set('loaded', true);
                        me.fire('load');
                    });
                    
                    googleMapsLoader.on('timeout', function () {
                        me.fire('timeout');
                    });
                    
                    googleMapsLoader.load(me.get('parameters'));

                    me._set('domNode', iY.one('#map').getDOMNode());
                    me._set('frame', frame);
                });
            });

            frame.render(me.get('container'));
        }
    }, {
        ATTRS: {
            /**
             * A selector string or node object which will contain the iframe.
             * @attribute container
             * @initOnly
             * @type Node|String
             */
            container: {
                value: null,
                writeOnce: 'initOnly'
            },
            /**
             * Reference to an empty div created inside the iframe. (This is not
             * an instance of Node.)
             * @attribute domNode
             * @readOnly
             */
            domNode: {
                readOnly: true,
                value: null
            },
            /**
             * The Y.Frame instance that created the iframe.
             * @attribute frame
             * @readOnly
             */
            frame: {
                readOnly: true,
                value: null
            },
            /**
             * @attribute loaded
             * @default false
             * @readOnly
             * @type Boolean
             */
            loaded: {
                readOnly: true,
                value: false
            },
            /**
             * The location of the Google Maps JavaScrpt API.  If left as null,
             * uses the default value of GoogleMapsLoader.
             * @attribute source
             * @default null
             * @type String
             */
            source: {
                value: null
            },
            /**
             * The timeout in milliseconds used by JSONP.  If left null, uses
             * the default value of GoogleMapsLoader.
             * @attribute timeout
             * @default null
             * @type Number
             */
            timeout: {
                value: null
            },
            /**
             * An optional parameters object passed to GoogleMapsLoader. (see
             * gallery-google-maps-loader's load method for information)
             * @attribute parameters
             * @initOnly
             * @type Object
             */
            parameters: {
                value: null,
                writeOnce: 'initOnly'
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['base', 'frame'], skinnable:false});
