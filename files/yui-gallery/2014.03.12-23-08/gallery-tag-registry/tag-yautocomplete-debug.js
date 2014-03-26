YUI.add('tag-yautocomplete', function(Y) {

Y.Tag.register('yautocomplete', {
    created: function(config) {
        this.get('host').setHTML('<div class="yui3-skin-sam"><input type="text" /></div>');
        this._node = this.get('host').one('input');
        this._node.plug(Y.Plugin.AutoComplete, Y.merge({
            resultHighlighter: 'phraseMatch',
            source: 'select k from yahoo.search.suggestions where command="{query}"',
            yqlEnv: 'store://datatables.org/alltableswithkeys',
            resultListLocator: 'query.results.s',
            resultTextLocator: 'k'
        }, config));

        Y.each(Y.AutoComplete.ATTRS, function(dummy, attr) { // Proxy attrs
            this.addAttr(attr, {
                getter: function() {return this._node.ac.get(attr);},
                setter: function(value) {this._node.ac.set(attr, value);}
            });
        }, this);
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['gallery-tag', 'autocomplete', 'autocomplete-highlighters']});
