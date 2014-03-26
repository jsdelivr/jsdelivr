YUI.add('gallery-ytag-registry', function(Y) {

YUI.add('ytag-ybutton', function(Y) {
    Y.namespace('YTag.Tags').ybutton = Y.Base.create('ybutton', Y.YTag.Plugin, [], {
        initializer: function() {
            var node = this.get('host');
            node.append('<div></div>');
            this._button = new Y.Button(Y.merge(this.getData(), {
                srcNode: node.one('div'),
                render: true
            }));
        }
    }, {});
}, '', {requires: ['button']});

YUI.add('ytag-ydial', function(Y) {
    Y.namespace('YTag.Tags').ydial = Y.Base.create('ydial', Y.YTag.Plugin, [], {
        initializer: function() {
            var node = this.get('host');
            node.append('<div class="yui3-skin-sam"></div>');
            this._button = new Y.Dial(Y.merge(this.getData(), {
                srcNode: node.one('div'),
                render: true
            }));
        }
    }, {});
}, '', {requires: ['dial']});

YUI.add('ytag-ysuggest', function(Y) {
    Y.namespace('YTag.Tags').ysuggest = Y.Base.create('ysuggest', Y.YTag.Plugin, [], {
        initializer: function() {
            var node = this.get('host');
            node.append('<div class="yui3-skin-sam"><input type="text" /></div>');
            node.one('input').plug(Y.Plugin.AutoComplete, {
                resultHighlighter: 'phraseMatch',
                source: 'select * from search.suggest where query="{query}"',
                yqlEnv: 'http://pieisgood.org/yql/tables.env'
            });
        }
    }, {});
}, '', {requires: ['autocomplete', 'autocomplete-highlighters']});

Y.YTag.register('ybutton');
Y.YTag.register('ydial');
Y.YTag.register('ysuggest');


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-ytag'], skinnable:false});
