YUI.add('gallery-badge', function (Y, NAME) {


        var B = function(config) {
            this._lazyAddAttrs = false;
            config.node = config.host;
            B.superclass.constructor.call(this, config);
        };
        
        B.NAME = "gallery-badge";

        B.NS = "badge";

        B.ATTRS = {
            node: {
                setter: function(node) {
                    return Y.one(node);
                }
            },
            type: {
                value: 'popular',
                setter: function(v) {
                    if (v !== 'user') {
                        this.set('username', '');
                    }
                    return v;
                }
            },
            header: {
                value: '',
                getter: function() {
                    var h = 'Popular Gallery Items';
                    switch (this.get('type')) {
                        case 'oncdn':
                            h = 'Gallery Items on the CDN';
                            break;
                        case 'featured':
                            h = 'Featured Gallery Items';
                            break;
                        case 'random':
                            h = 'Random Gallery Item';
                            break;
                        case 'user':
                            h = 'My Gallery Items';
                            break;
                    }
                    return h;
                }
            },
            username: {
                value: '',
                setter: function(v) {
                    if (v) {
                        this.set('header', 'My Gallery Items');
                        this._setStateVal('type', 'user');
                    }
                    return v;
                }
            },
            render: {
                value: true
            },
            data: {
                value: {}
            }
        };

        Y.extend(B, Y.Base, {
            buildUI: function(e) {
                this.set('data', e.data);
                if (e.data.error) {
                    return;
                }
                var data = e.data,
                    type = this.get('type'),
                    header = Y.Node.create('<h2>' + this.get('header') + '</h2>'),
                    node = Y.Node.create('<ul></ul>'),
                    n = this.get('node');

                if (type != 'random') {
                    if (type == 'user') {
                        header = Y.Node.create('<h2><a href="http:/'+'/yuilibrary.com/gallery/user/' + data.userinfo.username + '">' + data.userinfo.fullname + '\'s Gallery Items</a></h2>');
                    }
                    Y.each(data.modules, function(v) {
                        node.append('<li><a href="' + v.url + '">' + v.title + '</a></li>');
                    });
                } else {
                    node.append('<li><a href="' + data.modules.url + '">' + data.modules.title + '</a></li>');
                }

                n.set('innerHTML', '');
                n.append(header);
                n.append(node);
            },
            getSQL: function() {
                var type = this.get('type'), sql;
                if (type == 'user') {
                    sql = "select * from yui.gallery.user where (username = '" + this.get('username') + "')";
                } else {
                    sql = "select * from yui.gallery." + type;
                }
                return sql;
            },
            updateUserUI: function(e) {
                if (e.newVal !== '') {
                    this.updateUI();
                }
            },
            updateUI: function(e) {
                var sql = this.getSQL(), q;
                
                q = new Y.yql(sql, Y.bind(function(r) {
                    if (r.query && r.query.results && r.query.results.json) {
                        this.fire('dataReturned', { data: r.query.results.json });
                    }
                }, this), { env: 'http:/'+'/yuilibrary.com/yql/yui.env' });

            },
            initializer: function() {
                this.after('typeChange', Y.bind(this.updateUI, this));
                this.after('usernameChange', Y.bind(this.updateUserUI, this));
                this.publish('dataReturned', {
                    type: 'datareturned',
                    defaultFn: this.buildUI
                });
                if (this.get('render')) {
                    this.render();
                }
            },
            render: function() {
                this.updateUI();
            },
            refresh: function() {
                this.updateUI();
            },
            destructor: function() {
                this.get('node').set('innerHTML', '');
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.Badge = B;



}, 'gallery-2012.12.05-21-01', {"requires": ["node", "event", "gallery-yql", "base"], "supersedes": [], "optional": [], "skinnable": false});
