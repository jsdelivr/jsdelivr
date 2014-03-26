YUI.add('gallery-model-list-difference', function (Y, NAME) {

/**
Creates a model list that is the difference of two or more other model lists.
@module gallery-model-list-difference
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _ModelList = Y.ModelList,

        _filter = _Array.filter,
        _flatten = _Array.flatten,
        _indexOf = _Array.indexOf,
        _invoke = _Array.invoke,
        _isString = Y.Lang.isString,
        _reduce = _Array.reduce,

        _reduceFn = function (previousArray, currentArray) {
            if (!previousArray) {
                return currentArray;
            }

            return _filter(previousArray, function (value) {
                return _indexOf(currentArray, value) === -1;
            });
        };

    /**
    Creates a model list that is the difference of two or more other model
    lists.  The new model list stays up to date as the source lists change.
    This function can accept any number of model lists or arrays of model lists.
    Nested arrays will be flattened.  The first argument determines the type of
    model list that is created.
    @method difference
    @for ModelList
    @param {Function|ModelList|String} modelListType The first argument
    determines the type of model list that is created; it may be a constructor
    function or a string namespace to a constructor function stored on Y.  If
    the first argument is an instance of ModelList, its constructor is used.
    @param {ModelList} modelList* 1-n ModelList objects to difference.  Order is
    important.
    @return {ModelList}
    @static
    */
    Y.ModelList.difference = function () {
        var ModelListConstructor,

            modelList,
            modelLists = _flatten(arguments),
            modelListType = modelLists[0],

            updateModelList = function () {
                return modelList.reset(_reduce(_invoke(modelLists, 'toArray'), 0, _reduceFn));
            };

        if (_isString(modelListType)) {
            modelLists.shift();
            ModelListConstructor = Y.namespace(modelListType);
        } else if (modelListType instanceof _ModelList) {
            ModelListConstructor = modelListType.constructor;
        }

        modelList = new ModelListConstructor();

        _invoke(modelLists, 'after', [
            'add',
            'remove',
            'reset'
        ], updateModelList);

        return updateModelList();
    };
}(Y));

}, 'gallery-2013.05.02-22-59', {"requires": ["model-list"]});
