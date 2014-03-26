YUI.add('gallery-yql-execute', function(Y) {

/**
* This module Executes JavaScript remotely.
* @module gallery-yql-execute.
*/

(function (Y) {
    'use strict';
    
    /**
     * Execute JavaScript remotely.
     * @for YQL
     * @method execute
     * @param {String} code The code to execute
     * @param {Fucntion} callbackFunction Passes through to YQL.
     * @param {Object} params Passes through to YQL.
     * @param {Object} opts Passes through to YQL.
     * @static
     */
    Y.YQL.execute = function (code, callbackFunction, params, opts) {
        Y.YQL("SELECT * FROM execute WHERE code = '" + code.replace(/'/g, '\\\'') + "'", callbackFunction, params, opts);
    };
    
    /**
     * Helper function to get the deeply nested result.
     * @method execute.getResult
     * @param {Object} result
     * @returns {Object}
     * @static
     */
    Y.YQL.execute.getResult = function (result) {
        result = result && result.query;
        result = result && result.results;
        return result && result.result;
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['yql'], skinnable:false});
