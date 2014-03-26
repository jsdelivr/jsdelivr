YUI.add('gallery-ac-list-scaler', function(Y) {

var HOST        = 'host',
    CONTENT_BOX = 'contentBox';

Y.ACListScaler = Y.Base.create('ac-list-scaler', Y.Plugin.Base, [], {
    _afterRender : function (e) {
        var host = this.get(HOST),
            hostCb = host.get(CONTENT_BOX);
        hostCb.setStyle('overflow', 'auto');
    },
    
    _afterResults : function(e) {
        var host = this.get(HOST),
            hostCb, cbRegion, vpRegion;

        if (host.get('visible')) {
            hostCb = host.get(CONTENT_BOX);
            vpRegion = Y.DOM.viewportRegion();

            hostCb.setStyle('height', '');
            cbRegion = hostCb.get('region');
            if (cbRegion.height + cbRegion.top > vpRegion.height) {
                hostCb.setStyle('height', (vpRegion.height - cbRegion.top) + 'px');
            }
        }
    },

    initializer : function () {
        this.doAfter('render', this._afterRender);
        this.doAfter('results', this._afterResults);
    },

    destructor : function () {
        var host = this.get(HOST),
            hostCb = host.get(CONTENT_BOX);
        hostCb.setStyle('overflow', '');
    }
}, {
    NS : 'scaler'
});


}, 'gallery-2011.02.02-21-07' ,{requires:['base-build', 'plugin', 'autocomplete-list']});
