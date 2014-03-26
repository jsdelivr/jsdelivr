YUI.add('tag-yapp', function(Y) {

Y.Tag.register('yapp', {
    created: function(config) {
        this.get('host').setHTML('<div class="view-container">' + this.get('host').getHTML() + '</div><div class="container"></div>');
        this._instance = new Y.App(Y.merge(config, {
            container: this.get('host').one('.container'),
            viewContainer: this.get('host').one('.view-container')
        }));

        Y.each(Y.App.ATTRS, function(dummy, attr) { // Proxy attrs
            this.addAttr(attr, {
                getter: function() {return this._instance.get(attr);},
                setter: function(value) {this._instance.set(attr, value);}
            });
        }, this);

        this.onHostEvent('tag:inserted', function() {
            this._instance.render();
        }, this);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'app-base']});
