YUI.add('gallery-model-relate-autogen', function(Y) {

function ModelRelateAutoGen (config) {
    Y.Do.after(this._modelRelateAutoGenAfterParse, this, "parse");
    Y.Do.after(this._modelRelateAutoGenAfterSetAttrs, this, "setAttrs");

    this._loadModelRelateAutoGenRelated(config);
}

ModelRelateAutoGen.prototype = {
    _modelRelateAutoGenAfterParse: function () {
        this._loadModelRelateAutoGenRelated(Y.Do.currentRetVal);
    },

    _modelRelateAutoGenAfterSetAttrs: function (config, options) {
        var relationships,
            rel,
            key,
            existingModel,
            i
        ;

        if (config) {
            relationships = this.constructor.RELATIONSHIPS;

            for (key in config) {
                if (relationships[key] && Y.Lang.isValue(config[key])) {
                    rel = relationships[key];

                    if (rel.type === "toOne") {
                        existingModel = Y.ModelStore.find(rel.relatedModel, config[key][rel.relatedKey]);
                        existingModel.setAttrs(config[key]);
                    }
                    else if (rel.type === "toMany") {
                        for (i = 0; i < config[key].length; ++i) {
                            existingModel = Y.ModelStore.find(rel.relatedModel, config[key][i][rel.key]);
                            existingModel.setAttrs(config[key][i]);
                        }
                    }
                }
            }
        }
    },

    _loadModelRelateAutoGenRelated: function (config) {
        var relationships,
            rel,
            existingModel,
            newModel,
            newModelClass,
            key,
            i
        ;

        if (config) {
            relationships = this.constructor.RELATIONSHIPS;

            for (key in config) {
                if (relationships[key] && Y.Lang.isValue(config[key])) {
                    rel = relationships[key];

                    newModelClass = Y.ModelStore._getModelCtor(rel.relatedModel);

                    if (rel.type === "toOne") {
                        existingModel = Y.ModelStore.find(rel.relatedModel, config[key][rel.relatedKey]);
                        if (! existingModel) {
                            newModel = new newModelClass (config[key]);

                            Y.ModelStore.registerModel(newModel);
                        }
                    }
                    else if (rel.type === "toMany") {
                        for (i = 0; i < config[key].length; ++i) {
                            existingModel = Y.ModelStore.find(rel.relatedModel, config[key][i][rel.relatedModel.idAttribute]);
                            if (! existingModel) {
                                existingModel = new newModelClass (config[key][i]);

                                Y.ModelStore.registerModel(existingModel);
                            }
                        }
                    }
                }
            }
        }
    }
};

Y.ModelRelateAutoGen = ModelRelateAutoGen;


}, 'gallery-2012.04.04-17-55' ,{requires:['gallery-model-relate'], skinnable:false});
