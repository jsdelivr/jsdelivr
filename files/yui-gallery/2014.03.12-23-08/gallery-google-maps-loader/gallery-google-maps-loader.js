YUI.add('gallery-google-maps-loader', function(Y) {

/**
 * @module gallery-google-maps-loader
 */
(function (Y, moduleName) {
    'use strict';

    var _Base = Y.Base,

        _isArray = Y.Lang.isArray,
        _stringify = Y.QueryString.stringify;

    /**
     * @class GoogleMapsLoader
     * @constructor
     * @extends Base
     * @param {Object} config Configuration object.
     */
    Y.GoogleMapsLoader = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            var me = this;

            /**
             * Fired when JSONP fails.
             * @event failure
             */
            me.publish('failure');

            /**
             * Fired when JSONP succeeds.
             * @event success
             * @fireOnce
             */
            me.publish('success', {
                fireOnce: true
            });

            /**
             * Fired when JSONP times out.
             * @event timeout
             */
            me.publish('timeout');
        },
        /**
         * Loads the Google Maps JavaScript API through JSONP.  Does nothing if
         * this object has already loaded it.
         * @method load
         * @chainable
         * @param {Object} parameters An optional object with the following
         * optional properties:
         * <dl>
         *     <dt>
         *         client
         *     </dt>
         *     <dd>
         *         This is your client id when using Google Maps API for
         *         Business.
         *     </dd>
         *     <dt>
         *         language
         *     </dt>
         *     <dd>
         *         The language code to override the browser's default language.
         *     </dd>
         *     <dt>
         *         libraries
         *     </dt>
         *     <dd>
         *         An array or comma separated string of library names.
         *     </dd>
         *     <dt>
         *         key
         *     </dt>
         *     <dd>
         *         This is your Google Maps v3 API key.
         *     </dd>
         *     <dt>
         *         region
         *     </dt>
         *     <dd>
         *         A Unicode region subtag identifier to override the default
         *         region.
         *     </dd>
         *     <dt>
         *         sensor
         *     </dt>
         *     <dd>
         *         Set this to a truthy value if your application determines the
         *         user's location via a sensor.
         *     </dd>
         *     <dt>
         *         source
         *     </dt>
         *     <dd>
         *         Location of the Google Maps JavaScript API to override the
         *         attribute.
         *     </dd>
         *     <dt>
         *         timeout
         *     </dt>
         *     <dd>
         *         Timeout in milliseconds to override the attribute.
         *     </dd>
         *     <dt>
         *         version
         *     </dt>
         *     <dd>
         *         The version of the Google Maps JavaScript API to load.
         *     </dd>
         * </dl>
         * If other properties not listed here are included in the parameters
         * object, they will also be included the the Google Maps API request.
         */
        load: function (parameters) {
            parameters = parameters || {};

            var me = this,

                libraries = parameters.libraries,
                timeout = parameters.timeout || me.get('timeout'),
                url = parameters.source || me.get('source');

            if (me.get('loaded')) {
                return me;
            }

            if (_isArray(libraries)) {
                parameters.libraries = libraries.join(',');
            }

            parameters.sensor = parameters.sensor ? 'true' : 'false';
            parameters.v = parameters.v || parameters.version;

            delete parameters.callback;
            delete parameters.source;
            delete parameters.timeout;
            delete parameters.version;

            if (url.indexOf('?') === -1) {
                url += '?';
            }

            Y.jsonp(url + _stringify(parameters) + '&callback={callback}', {
                on: {
                    failure: function () {
                        me.fire('failure');
                    },
                    success: function () {
                        me._set('loaded', true);
                        me.fire('success');
                    },
                    timeout: function () {
                        me.fire('timeout');
                    }
                },
                timeout: timeout
            });

            return me;
        }
    }, {
        ATTRS: {
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
             * The location of the Google Maps JavaScrpt API.
             * @attribute source
             * @default 'http://maps.google.com/maps/api/js'
             * @type String
             */
            source: {
                value: 'http://maps.google.com/maps/api/js'
            },
            /**
             * The timeout in milliseconds used by JSONP.
             * @attribute timeout
             * @default 30000
             * @type Number
             */
            timeout: {
                value: 30000
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.09.05-20-01' ,{requires:['base', 'jsonp', 'querystring-stringify'], skinnable:false});
