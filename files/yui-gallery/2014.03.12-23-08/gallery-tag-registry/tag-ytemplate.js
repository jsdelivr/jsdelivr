YUI.add('tag-ytemplate', function(Y) {

Y.Tag.register('ytemplate', {
    created: function(config) {
        var host = this.get('host');
        host.setHTML('<script type="text/x-template">' + host.getHTML() + '</script>');

        this._node = host.one('script');

        this.addAttr('html', {
            getter: function() {return this._node.getHTML();},
            setter: function(value) {this._node.setHTML(value);}
        });
    },

    compile: function(params) {
        return Y.Lang.sub(this.get('html'), params);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag']});
