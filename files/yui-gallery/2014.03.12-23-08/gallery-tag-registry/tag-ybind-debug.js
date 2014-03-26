YUI.add('tag-ybind', function(Y) {

Y.Tag.register('ybind, [ybind]', {
    created: function(config) {
        if (!this._created(config)) { // Node may not be available yet, try again
            Y.later(0, this, this._created, config);
        }
    },

    _created: function(config) {
        var selector = config.ybind || this.get('host').getAttribute('ybind'),
            ref = selector ? Y.one(selector).tag : this;

        if (!ref) {
            return false;
        }

        Y.each(config, function(fn, type) {
            var e = {};

            if (type.indexOf('on') === 0) {
                e.type = type.substr(2);
                e.target = Y.Node.DOM_EVENTS[e.type] ? this.get('host') : this;
            }
            else if (type.indexOf('ref') === 0) {
                e.type = type.substr(3);
                e.target = Y.Node.DOM_EVENTS[e.type] ? ref.get('host') : ref;
            }

            if (e.type) {
                e.target.on(e.type, ref[fn] ? Y.rbind(ref[fn], ref, this) : Y.bind(this._defaultFn, this));
            }
        }, this);

        return true;
    },

    _defaultFn: function(e, ref) {
        var host = this.get('host'),
            value = e.newVal ? e.newVal : e.target.get('value');

        if (host.get('tagName') === 'INPUT') {
            host.set('value', value);
        }
        else {
            host.setHTML(value);
        }
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'event']});
