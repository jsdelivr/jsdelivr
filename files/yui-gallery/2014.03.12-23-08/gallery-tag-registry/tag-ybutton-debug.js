YUI.add('tag-ybutton', function(Y) {

Y.Tag.register('ybutton', {
    created: function(config) {
        this.get('host').setHTML('<button></button>');
        this._widget = new Y.Button(Y.merge(config, {
            srcNode: this.get('host').one('button')
        }));

        Y.each(Y.Button.ATTRS, function(dummy, attr) { // Proxy attrs
            this.addAttr(attr, {
                getter: function() {return this._widget.get(attr);},
                setter: function(value) {this._widget.set(attr, value);}
            });
        }, this);

        this.onHostEvent('tag:inserted', function() {this._widget.render();}, this);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'button']});
