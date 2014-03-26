YUI.add('gallery-geo', function(Y) {

/*global YUI*/

/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 * Written by Nicholas C. Zakas, nczonline.net
 */

/**
 * Geolocation API
 * @module gallery-geo
 */
 
/*(intentionally not documented)
 * Tries to get the current position by using the native geolocation API.
 * If the user denies permission, then no further attempt is made to get
 * the location. If an error occurs, then an attempt is made to get the
 * location information by IP address.
 * @param callback {Function} The callback function to call when the
 *      request is complete. The object passed into the request has
 *      four properties: success (true/false), coords (an object), 
 *      timestamp, and source ("native" or "geoplugin").
 * @param scope {Object} (Optional) The this value for the callback function.
 * @param opts {Object} (Optional) The PositionOptions object passed to
 *      the getCurrentPosition function and has three optional properties:
 *      enableHighAccuracy (true/false), timeout (number), maximumAge (number).
 */
function getCurrentPositionByAPI(callback, scope, opts){
    navigator.geolocation.getCurrentPosition(
        function(data){
            callback.call(scope, {
                success: true,
                coords: {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                    accuracy: data.coords.accuracy,
                    altitude: data.coords.altitude,
                    altitudeAccuracy: data.coords.altitudeAccuracy,
                    heading: data.coords.heading,
                    speed: data.coords.speed
                },
                timestamp: data.timestamp,
                source: "native"
            });
        }, 
        function(error){
            if (error.code == 1) {  //user denied permission, so don't do anything
                callback.call(scope, { success: false, denied: true });
            } else {    //try Geo IP Lookup instead
                getCurrentPositionByGeoIP(callback,scope);        
            }
        },
        opts
    );
}

/*(intentionally not documented)
 * Tries to get the current position by using the IP address.
 * @param callback {Function} The callback function to call when the
 *      request is complete. The object passed into the request has
 *      four properties: success (true/false), coords (an object), 
 *      timestamp, and source ("native" or "pidgets.geoip").
 * @param scope {Object} (Optional) The this value for the callback function.
 * @param opts {Object} (Optional) The PositionOptions object passed to
 *      the getCurrentPosition function and has three optional properties:
 *      enableHighAccuracy (true/false) which is ingored, timeout (number),
 *      maximumAge (number) passed to YQL request as maxAge URL-query param.
 */
function getCurrentPositionByGeoIP(callback, scope, opts){

    opts = opts || {};
    var params = Y.Lang.isNumber(opts.maximumAge) ?
        { _maxage: opts.maximumAge } : {};
    
    Y.jsonp("http://freegeoip.net/json/?callback={callback}", {
        on: {
            success: function(response){
                var results;
                
                if (response.error){
                    callback.call(scope, { success: false });
                } else {
                    callback.call(scope, {
                        success: true,
                        coords: {
                            latitude: parseFloat(response.latitude),
                            longitude: parseFloat(response.longitude),
                            accuracy: Infinity    //TODO: Figure out better value
                        },
                        timestamp: +new Date(),
                        source: "freegeoip.net"
                    });   
                }
            },
            failure: function(){
                callback.call(scope, { success: false });
            },
            timeout: function(){
                callback.call(scope, { success: false });
            }
        },
        timeout: opts.timeout
    }, params);

}

/**
 * Geolocation API
 * @class Geo
 * @static
 */
Y.Geo = {
    
    /**
     * Get the current position. This tries to use the native geolocation
     * API if available. Otherwise it uses the GeoPlugin site to do an
     * IP address lookup.
     * @param callback {Function} The callback function to call when the
     *      request is complete. The object passed into the request has
     *      four properties: success (true/false), coords (an object), 
     *      timestamp, and source ("native" or "geoplugin").
     * @param scope {Object} (Optional) The this value for the callback function.     
     */
    getCurrentPosition: navigator.geolocation ?
        getCurrentPositionByAPI :
        getCurrentPositionByGeoIP

};


}, 'gallery-2011.10.20-23-28' ,{requires:['yql']});
