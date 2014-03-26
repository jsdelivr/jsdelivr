YUI.add('gallery-model-list-union', function (Y, NAME) {

/**
Creates a model list that is the union of two or more other model lists.
@module gallery-model-list-union
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _Array = Y.Array,
        _ModelList = Y.ModelList,

        _flatten = _Array.flatten,
        _invoke = _Array.invoke,
        _isString = Y.Lang.isString;

    /**
    Creates a model list that is the union of two or more other model lists.
    The new model list stays up to date as the source lists change.  This
    function can accept any number of model lists or arrays of model lists.
    Nested arrays will be flattened.  The first argument determines the type of
    model list that is created.
    @method union
    @for ModelList
    @param {Function|ModelList|String} modelListType The first argument
    determines the type of model list that is created; it may be a constructor
    function or a string namespace to a constructor function stored on Y.  If
    the first argument is an instance of ModelList, its constructor is used.
    @param {ModelList} modelList* 1-n ModelList objects to union.
    @return {ModelList}
    @static
    */
    Y.ModelList.union = function () {
        var ModelListConstructor,

            modelList,
            modelLists = _flatten(arguments),
            modelListType = modelLists[0],

            updateModelList = function () {
                return modelList.reset(_flatten(_invoke(modelLists, 'toArray')));
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

}, 'gallery-2013.05.10-00-54', {"requires": ["model-list"]});
