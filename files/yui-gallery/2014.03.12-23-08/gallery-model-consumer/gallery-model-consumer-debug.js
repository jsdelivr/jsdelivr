YUI.add('gallery-model-consumer', function(Y) {

//
// this is a *very* poor man's trait type thing, basically add our own
// properties to the config object for an attribute
//
Y.Base._ATTR_CFG.concat("mlClass");
Y.Base._ATTR_CFG_HASH.mlClass = true;
Y.Base._ATTR_CFG.concat("mClass");
Y.Base._ATTR_CFG_HASH.mClass = true;

function ModelConsumer (config) {}

ModelConsumer.prototype = {
    _setML: function (list, name) {
        var existing_list = this.get(name),
            ml_class,
            new_list
        ;

        if (existing_list) {
            return existing_list.reset(list);
        }

        ml_class = this._getAttrCfg(name).mlClass;
        if (list instanceof ml_class) {
            list.addTarget(this);

            return list;
        }

        new_list = new ml_class (
            {
                bubbleTargets: this
            }
        );
        new_list.reset(list);

        return new_list;
    },

    _setM: function (cfg, name) {
        var existing_model = this.get(name),
            m_class,
            load,
            m
        ;

        if (existing_model) {
            existing_model.removeTarget(this);
        }

        m_class = this._getAttrCfg(name).mClass;

        if (cfg instanceof m_class) {
            cfg.addTarget(this);

            return cfg;
        }
        if (! Y.Lang.isValue(cfg)) {
            return;
        }

        load = false;
        if (cfg && ! Y.Lang.isObject(cfg)) {
            // TODO: this should be the idAttribute?
            cfg = {
                id: cfg
            };
            load = true;
        }

        m = new m_class (cfg);
        if (load) {
            m.load();
        }
        m.addTarget(this);

        return m;
    }
};

Y.ModelConsumer = ModelConsumer;


}, 'gallery-2012.04.04-17-55' ,{requires:['gallery-model-consumer'], skinnable:false});
