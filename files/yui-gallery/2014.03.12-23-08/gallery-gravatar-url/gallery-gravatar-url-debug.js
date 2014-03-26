YUI.add('gallery-gravatar-url', function(Y) {

/**
 * This module provides a function for creating gravatar image urls.
 * @module gallery-gravatar-url
 */
(function (Y) {
    'use strict';
    
    var _md5 = Y.YQLCrypto.md5,
        _stringify = Y.QueryString.stringify,
        _trim = Y.Lang.trim;
    
    /**
     * Create a gravatar image url.
     * @method gravatarUrl
     * @for YUI
     * @param {Object} options An object with the following optional properties:
     * <dl>
     *     <dt>
     *         defaultImage
     *     </dt>
     *     <dd>
     *         This could be a string url to an image to use when there is no
     *         matching gravatar image or it could be one of the following
     *         values: '404', 'mm', 'identicon', 'monsterid', 'wavatar', or
     *         'retro'  Refer to gravatar's documentation:
     *         http://en.gravatar.com/site/implement/images/
     *     </dd>
     *     <dt>
     *         email
     *     </dt>
     *     <dd>
     *         The user's e-mail address.
     *     </dd>
     *     <dt>
     *         force
     *     </dt>
     *     <dd>
     *         If this is a truthy value, it will force the default image to
     *         load even if there is a matching gravatar image.
     *     </dd>
     *     <dt>
     *         rating
     *     </dt>
     *     <dd>
     *         The maximum image rating that is allowed to load.  It could be
     *         one of the following values:  'g', 'pg', 'r', 'x'  Defaults to
     *         'g'.  Refer to gravatar's documentation:
     *         http://en.gravatar.com/site/implement/images/
     *     </dd>
     *     <dt>
     *         secure
     *     </dt>
     *     <dd>
     *         If this is a truthy value, the url will use the secure https
     *         protocol.
     *     </dd>
     *     <dt>
     *         size
     *     </dt>
     *     <dd>
     *         An integer representing the height and width of the image in
     *         pixels.  Values from 1 to 512 inclusive are supported.
     *         Gravatar images are square.
     *     </dd>
     * </dl>
     * @param {Function} callbackFunction This function receives the gravatar
     * url as its only parameter.
     * @param {Object} contextObject (optional) An object to provide as the
     * execution context for the callback function.
     */
    Y.gravatarUrl = function (options, callbackFunction, contextObject) {
        var defaultImage = options.defaultImage,
            force = options.force,
            queryString = '',
            rating = options.rating,
            size = options.size,
            src = ((options.secure && 'https://secure') || 'http://www') + '.gravatar.com/avatar/',
            
            complete;
            
        complete = function (md5) {
            callbackFunction.call(contextObject, src + md5 + queryString);
        };
        
        if (defaultImage || force || rating || size) {
            queryString = {};
            
            if (defaultImage) {
                queryString.d = defaultImage;
            }
            
            if (force) {
                queryString.f = 'y';
            }
            
            if (rating) {
                queryString.r = rating;
            }
            
            if (size) {
                queryString.s = size;
            }
            
            queryString = '?' + _stringify(queryString);
        }
        
        if (force && (defaultImage === '404' || defaultImage === 'mm')) {
            complete();
        } else {
            _md5(_trim(options.email || '').toLowerCase(), function (md5) {
                complete(md5);
            });
        }
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-yql-crypto', 'querystring-stringify-simple'], skinnable:false});
