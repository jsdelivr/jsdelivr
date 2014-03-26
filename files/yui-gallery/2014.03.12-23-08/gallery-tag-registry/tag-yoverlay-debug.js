YUI.add('tag-yoverlay', function(Y) {

Y.Tag.register('yoverlay', {
    created: function(config) {
        var html = this.get('host').getHTML();
        this.get('host').setHTML('<div class="yui3-overlay-loading">' + html + '</div>');

        this._widget = new Y.Overlay(Y.merge(config, {
            srcNode: this.get('host').one('div')
        }));

        Y.each(Y.Overlay.ATTRS, function(dummy, attr) { // Proxy attrs
            this.addAttr(attr, {
                getter: function() {return this._widget.get(attr);},
                setter: function(value) {this._widget.set(attr, value);}
            });
        }, this);

        this.onHostEvent('tag:inserted', function() {this._widget.render();}, this);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'overlay']});
