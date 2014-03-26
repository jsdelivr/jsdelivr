YUI.add('tag-ycalendar', function(Y) {

Y.Tag.register('ycalendar', {
    created: function(config) {
        this.get('host').setHTML('<div class="yui3-skin-sam"></div>');
        this._widget = new Y.Calendar(Y.merge(config, {
            contentBox: this.get('host').one('div')
        }));

        Y.each(Y.Calendar.ATTRS, function(dummy, attr) { // Proxy attrs
            this.addAttr(attr, {
                getter: function() {return this._widget.get(attr);},
                setter: function(value) {this._widget.set(attr, value);}
            });
        }, this);

        this.onHostEvent('tag:inserted', function() {this._widget.render();}, this);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'calendar']});
