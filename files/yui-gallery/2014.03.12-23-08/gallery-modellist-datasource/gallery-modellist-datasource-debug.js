YUI.add('gallery-modellist-datasource', function(Y) {

Y.namespace('Plugin').ModelListDataSource = Y.Base.create('modellist-datasource', Y.Plugin.Base, [], {
    _setClearOnRequest : function (clear) {
        var source = this.get('source'),
            host = this.get('host');

        if (clear) {
            this._requestHandler = source.after('request', function (e) {
                host.reset();
            });
        } else if (this._requestHandler) {
            this._requestHandler.detach();
        }
    },

    initializer : function () {
        var source = this.get('source'),
            host = this.get('host'),
            stack = this.get('stack');

        if (!source instanceof Y.DataSource.Local) {
            Y.log('Source must be a DataSource', 'error');
            return false;
        }

        this._responseHandler = source.after('response', function (e) {
            if (stack) {
                host.add(e.response.results);
            } else {
                host.reset(e.response.results);
            }
        }, this);

        this.after('clearOnRequestChange', function (e) {
            this._setClearOnRequest(e.newVal);
        });
        this._setClearOnRequest(this.get('clearOnRequest'));
    },

    destructor : function () {
        if (this._requestHandler) {
            this._requestHandler.detach();
        }
        this._responseHandler.detach();
    }
}, {
    NS : 'dataSource',
    ATTRS : {
        clearOnRequest : {
            value : false
        },
        source : {
        },
        stack : {
            value : false
        }
    }
});


}, 'gallery-2012.01.04-22-09' ,{requires:['plugin','base-build','datasource-local','model-list']});
