YUI.add('gallery-lazy-load', function(Y) {

/**
 * A little helper function for when you want to load more modules into an
 * existing Y instance.
 * @module gallery-lazy-load
 */

(function (Y) {
    'use strict';
    
    var _Array = Y.Array,
        _Env = Y.Env,
        _Lang = Y.Lang,
        
        _attached = _Env._attached,
        _config = Y.config,
        _loader = _Env._loader,
        
        _each = Y.each,
        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _use = Y.use;
    
    /**
     * A little helper function for when you want to load more modules into an
     * existing Y instance.
     * @method lazyLoad
     * @for YUI
     * @param modules* {String} 1-n modules to bind (uses arguments array).
     * @param *callback {Function} callback function executed when the instance
     * has the required functionality.  If included, it must be the last
     * parameter.  This function receives two arguments:
     * <dl>
     *     <dt>
     *         errors
     *     </dt>
     *     <dd>
     *         This will be an array of error objects if something went wrong.
     *         This will be null if everything is okay.
     *     </dd>
     *     <dt>
     *         attached
     *     </dt>
     *     <dd>
     *         This is an object.  This object's keys are the names of modules
     *         that were attached to this YUI instance during this load.
     *         (Virtual rollups aren't listed here.)
     *     </dd>
     * </dl>
     * @return {YUI} the YUI instance.
     */
    Y.lazyLoad = function () {
        var args = _Array(arguments),
            alreadyAttached = {},
            callbackFunction = args[args.length - 1],
            errors = [],
            loadErrorFn = _config.loadErrorFn,
            onFailure = _loader.onFailure,
            onTimeout = _loader.onTimeout;
 
        if (_isFunction(callbackFunction)) {
            args.pop();
        } else {
            callbackFunction = null;
        }
        
        if (_isArray(args[0])) {
            args = args[0];
        }
        
        if (!callbackFunction) {
            return _use.apply(Y, args);
        }
        
        _each(_attached, function (value, key) {
            if (value) {
                alreadyAttached[key] = value;
            }
        });
        
        delete _config.loadErrorFn;
        
        _loader.onFailure = function (error) {
            errors.push(error);
        };
        
        _loader.onTimeout = function (error) {
            errors.push(error);
        };
        
        args.push(function () {
            _config.loadErrorFn = loadErrorFn;
            _loader.onFailure = onFailure;
            _loader.onTimeout = onTimeout;
            
            var attached = {};
                                
            _each(_attached, function (value, key) {
                if (value && !alreadyAttached[key]) {
                    attached[key] = value;
                }
            });
            
            callbackFunction(errors.length ? errors : null, attached);
        });
        
        return _use.apply(Y, args);
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['oop'], skinnable:false});
