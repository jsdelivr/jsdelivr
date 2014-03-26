YUI.add('gallery-bitly', function (Y, NAME) {

/*jshint maxlen: 200 */


/**
Bitly API Access
@module gallery-bitly
*/

/**
Bitly API Access
@class bitly
@constructor
@param {Object} config Config object
*/
    var B = function(config) {
        B.superclass.constructor.call(this, config);
    };

    B.NAME = 'bitly';

    B.ATTRS = {
        username: {
            value: ''
        },
        key: {
            value: ''
        }
    };

    Y.extend(B, Y.Base, {
        api: 'http:/'+'/api.bit.ly/',
        initializer: function() {
            if (!this.get('key') || !this.get('username')) {
                Y.error('You must give a username and an API key. If you do not have an apiKey, sign up for a bitly account and go to your Account page to get your apiKey. (http:/'+'/bit.ly/)');
            }
        },
        destructor: function() {
        },
        _buildURL: function(path, param) {
            return this.api + path + '?version=2.0.1&login=' + this.get('username') + '&apiKey=' + this.get('key') + '&' + param;
        },
        _handleAPI: function(name, url, cb) {
            Y.log('handleAPI: ' + name + ' : ' + url, 'info');

            var stamp = Y.guid().replace(/-/g,'_');

            YUI[stamp] = Y.bind(function(e) {
                if (e.results) {
                    if (name === 'stats') {
                        this.fire(name, e.results);
                        if (cb) {
                            cb = Y.bind(cb, this);
                            cb(e.results);
                        }
                    } else {
                        Y.each(e.results, function(v) {
                            this.fire(name, v);
                            if (cb) {
                                cb = Y.bind(cb, this);
                                cb(v);
                            }
                        }, this);
                    }
                }
                delete YUI[stamp];
            }, this);

            Y.Get.script(url + '&callback=YUI.' + stamp);
        },
        shorten: function(url, cb) {
            var api = this._buildURL('shorten', 'longUrl=' + encodeURIComponent(url));
            this._handleAPI('shorten', api, cb);
        },
        expand: function(p, cb) {
            var path = ((p.url) ? 'shortUrl=' + encodeURIComponent(p.url) : 'hash=' + p.hash),
                api = this._buildURL('expand', path);

            this._handleAPI('expand', api, cb);

        },
        expandByURL: function(v, cb) {
            return this.expand({ url: v }, cb);
        },
        expandByHash: function(v, cb) {
            return this.expand({ hash: v }, cb);
        },
        info: function(p, cb) {
            var path = ((p.url) ? 'shortUrl=' + encodeURIComponent(p.url) : 'hash=' + p.hash),
                api = this._buildURL('info', path);

            this._handleAPI('info', api, cb);

        },
        infoByURL: function(v, cb) {
            return this.info({ url: v }, cb);
        },
        infoByHash: function(v, cb) {
            return this.info({ hash: v }, cb);
        },
        stats: function(p, cb) {
            var path = ((p.url) ? 'shortUrl=' + encodeURIComponent(p.url) : 'hash=' + p.hash),
                api = this._buildURL('stats', path);

            this._handleAPI('stats', api, cb);

        },
        statsByURL: function(v, cb) {
            return this.stats({ url: v }, cb);
        },
        statsByHash: function(v, cb) {
            return this.stats({ hash: v }, cb);
        }
    });

    Y.bitly = B;


}, 'gallery-2012.12.05-21-01', {"requires": ["base", "get"], "supersedes": [], "optional": [], "skinnable": false});
