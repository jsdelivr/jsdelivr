/*
 * flickrBomb v1
 * www.ZURB.com/playground
 * Copyright 2011, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

// @param [key] Optionally pass a Flickr API key on instantiation, or just hardcode it below.
var flickrBomb = function flickrBomb(key) {
    if (!(this instanceof flickrBomb)) return new flickrBomb(arguments[0]);
    
    var flickrbombAPIkey = key || '66b5c17019403c96779e8fe88d5b576d',  // replace with your Flickr API key (fallback)
    
        /*  flickrbombLicenseTypes values (comma delimited)

            empty means all license types
            0: All Rights Reserved
            4: Attribution License http://creativecommons.org/licenses/by/2.0/
            6: Attribution-NoDerivs License http://creativecommons.org/licenses/by-nd/2.0/
            3: Attribution-NonCommercial-NoDerivs License http://creativecommons.org/licenses/by-nc-nd/2.0/
            2: Attribution-NonCommercial License http://creativecommons.org/licenses/by-nc/2.0/
            1: Attribution-NonCommercial-ShareAlike License http://creativecommons.org/licenses/by-nc-sa/2.0/
            5: Attribution-ShareAlike License http://creativecommons.org/licenses/by-sa/2.0/
            7: No known copyright restrictions http://www.flickr.com/commons/usage/
            8: United States Government Work http://www.usa.gov/copyright.shtml

            ex. flickrbombLicenseTypes = '5,7,8';
        */
        flickrbombLicenseTypes = '',
        localStorage,
        localSync;
        
    if (!flickrbombAPIkey) return new Error('flickr API key required');
    
    function supports_local_storage() { try { return 'localStorage' in window && window.localStorage !== null; } catch(e){ return false; } }

    if (supports_local_storage()) {

        // A simple module to replace `Backbone.sync` with *localStorage*-based
        // persistence. Models are given GUIDS, and saved into a JSON object. Simple
        // as that.

        // Generate four random hex digits.
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        // Generate a pseudo-GUID by concatenating random hexadecimal.
        var guid = function() {
            return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
        };

        // Our Store is represented by a single JS object in *localStorage*. Create it
        // with a meaningful name, like the name you'd give a table.
        var Store = function(name) {
            this.name = name;
            var store = window.localStorage.getItem(this.name);
            this.data = (store && JSON.parse(store)) || {};
        };

        _.extend(Store.prototype, {

            // Save the current state of the **Store** to *localStorage*.
            save: function() {
                window.localStorage.setItem(this.name, JSON.stringify(this.data));
            },

            // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
            // have an id of it's own.
            create: function(model) {
                if (!model.id) model.id = model.attributes.id = guid();
                this.data[model.id] = model;
                this.save();
                return model;
            },

            // Update a model by replacing its copy in `this.data`.
            update: function(model) {
                this.data[model.id] = model;
                this.save();
                return model;
            },

            // Retrieve a model from `this.data` by id.
            find: function(model) {
                return this.data[model.id];
            },

            // Return the array of all models currently in storage.
            findAll: function() {
                return _.values(this.data);
            },

            // Delete a model from `this.data`, returning it.
            destroy: function(model) {
                delete this.data[model.id];
                this.save();
                return model;
            }

        });
        // Override `Model.sync`, `Collection.sync`, or `Backbone.sync` to use delegate to the model or collection's
        // *localStorage* property, which should be an instance of `Store`.
        localSync = function(method, model, cb) {

            var resp,
                store = model.localStorage || model.collection.localStorage;

            switch (method) {
                case 'read':    resp = model.id ? store.find(model) : store.findAll(); break;
                case 'create':  resp = store.create(model);                            break;
                case 'update':  resp = store.update(model);                            break;
                case 'delete':  resp = store.destroy(model);                           break;
            }

            if (resp && cb && cb.success) {
                cb.success(resp);
            } else {
                // Swallow errors for now
                // error('Record not found');
            }
        };

        localStorage = new Store('flickrBombImages');
    } else {
        localStorage = null;
    }

    var FlickrImage = Backbone.Model.extend({
            sync: localSync,

            fullsize_url: function () {
              return this.image_url('medium');
            },

            thumb_url: function () {
              return this.image_url('square');
            },

            image_url: function (size) {
                var size_code;
                switch (size) {
                  case 'square': size_code = '_s'; break; // 75x75
                  case 'medium': size_code = '_z'; break; // 640 on the longest side
                  case 'large': size_code = '_b'; break; // 1024 on the longest side
                  default: size_code = '';
                }
                return 'http://farm' + this.get('farm') + '.static.flickr.com/' + this.get('server') + '/' + this.get('id') + '_' + this.get('secret') + size_code + '.jpg';
            }

        }),

        Image = Backbone.Model.extend({
            sync: localSync,

            localStorage: localStorage,

            initialize: function () {
                _.bindAll(this, 'loadFirstImage');
                this.flickrImages = new FlickrImages();
                this.flickrImages.fetch(this.get('keywords'), this.loadFirstImage);
                this.set({id: this.get('id') || this.get('keywords')});

                this.bind('change:src', this.changeSrc);
            },

            changeSrc: function () {
                this.save();
            },

            loadFirstImage: function () {
                if (this.get('src') === undefined) {
                    this.set({src: this.flickrImages.first().image_url()});
                }
            }
        }),

        FlickrImages = Backbone.Collection.extend({
            sync: localSync,

            model: FlickrImage,

            key: flickrbombAPIkey,

            page: 1,

            fetch: function (keywords, success) {
                var self = this;
                success = success || $.noop;
                this.keywords = keywords || this.keywords;
                $.ajax({
                    url: 'http://api.flickr.com/services/rest/',
                    data: {
                        api_key: self.key,
                        format: 'json',
                        method: 'flickr.photos.search',
                        tags: this.keywords,
                        per_page: 9,
                        page: this.page,
                        license: flickrbombLicenseTypes
                    },
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    success: function (response) {
                        self.add(response.photos.photo);
                        success();
                    }
                });
            },

            nextPage: function (callback) {
                this.page += 1;
                this.remove(this.models);
                this.fetch(null, callback);
            },

            prevPage: function(callback) {
                if (this.page > 1) {this.page -= 1;}
                this.remove(this.models);
                this.fetch(null, callback);
            }

        }),

        FlickrImageView = Backbone.View.extend({

            tagName: 'a',

            template: _.template("<img src='<%= thumb_url() %>' />"),

            className: 'photo',

            events: {'click': 'setImageSrc'},

            render: function() {
                $(this.el).html(this.template(this.model));
                $(this.el).addClass('photo');
                return this;
            },

            setImageSrc: function (event) {
                this.options.image.set({'src': this.model.fullsize_url()});
            }

        }),

        ImageView = Backbone.View.extend({

            tagName: 'div',

            className: 'flickrbombContainer',

            lock: false,

            template: _.template('<div id="<%= id %>" class="flickrbombWrapper"><img class="flickrbomb" src="" /><a href="#" title="Setup" class="setupIcon"></a></div><div class="flickrbombFlyout"><div class="flickrbombContent"><a href="#" title="Previous Page" class="prev">&#9664;</a><a href="#" title="Next Page" class="next">&#9654;</a></div></div>'),

            initialize: function (options) {
                _.bindAll(this, 'addImage', 'updateSrc', 'setDimentions', 'updateDimentions');
                var keywords = options.img.attr('src').replace('flickr://', '');

                this.$el = $(this.el);
                this.ratio = this.options.img.attr('data-ratio');

                this.image = new Image({keywords: keywords, id: options.img.attr('id')});
                this.image.flickrImages.bind('add', this.addImage);
                this.image.bind('change:src', this.updateSrc);
            },

            events: {
                'click .setupIcon'                  : 'clickSetup',
                'click .flickrbombFlyout a.photo'   : 'selectImage',
                'click .flickrbombFlyout a.next'    : 'nextFlickrPhotos',
                'click .flickrbombFlyout a.prev'    : 'prevFlickrPhotos'
            },

            render: function() {
                $(this.el).html(this.template({ id: this.image.id.replace(' ', '') }));
                this.image.fetch();

                if (!this.ratio) {
                    this.resize();
                } else {
                    this.$('.flickrbombWrapper').append('<img style="width: 100%;" class="placeholder" src="http://placehold.it/' + this.ratio + '" />');
                }
                return this;
            },

            updateSrc: function (model, src) {
                var self = this;

                this.$('img.flickrbomb')
                    .css({top: 'auto', left: 'auto', width: 'auto', height: 'auto'})
                    .attr('src', '')
                    .bind('load', self.setDimentions)
                    .attr('src', src);
            },

            setDimentions: function (event) {
                this.image.set({
                    width: this.$('img').width(),
                    height: this.$('img').height()
                });
                this.updateDimentions(this.image);
                $(event.target).unbind('load');
            },

            updateDimentions: function () {
                var image = this.$('img.flickrbomb'),
                    flickrWidth = this.image.get('width'),
                    flickrHeight = this.image.get('height'),
                    flickrAspectRatio = flickrWidth / flickrHeight,
                    clientWidth = this.$('div.flickrbombWrapper').width(),
                    clientHeight = this.$('div.flickrbombWrapper').height(),
                    clientAspectRatio = clientWidth / clientHeight;

                if (flickrAspectRatio < clientAspectRatio) {
                    image.css({
                        width: '100%',
                        height: null
                    });
                    image.css({
                        top: ((clientHeight - image.height()) / 2) + 'px',
                        left: null
                    });
                } else {
                    image.css({
                        height: '100%',
                        width: null
                    });
                    image.css({
                        left: ((clientWidth - image.width()) / 2) + 'px',
                        top: null
                    });
                }
            },

            addImage: function (image) {
                this.flickrImageView = new FlickrImageView({model: image, image: this.image});
                this.$('.flickrbombFlyout').append(this.flickrImageView.render().el);
            },

            clickSetup: function (event) {
                event.preventDefault();
                this.toggleFlyout();
            },

            toggleFlyout: function (event) {
                this.$('.flickrbombFlyout').toggle();
            },

            selectImage: function (event) {
                event.preventDefault();

                this.toggleFlyout();
            },

            nextFlickrPhotos: function (event) {
                event.preventDefault();
                var self = this;
                if(!this.lock) {
                    this.lock = true;
                    this.$('.flickrbombFlyout').find('a.photo').remove();
                    this.image.flickrImages.nextPage(function() {
                        self.lock = false;
                    });
                }
            },
            prevFlickrPhotos: function (event) {
                event.preventDefault();
                var self = this;
                if(!this.lock) {
                    this.lock = true;
                    this.$('.flickrbombFlyout').find('a.photo').remove();
                    this.image.flickrImages.prevPage(function() {
                        self.lock = false;
                    });
                }
            },

            resize: function () {
                this.$('div.flickrbombWrapper').css({
                    width: this.width() + 'px', 
                    height: this.height() + 'px'
                });
            },

            width: function () {
                return parseInt(this.options.img.width(), 10);
            },

            height: function () {
                return parseInt(this.options.img.height(), 10);
            }

        });
    
    // Replace any placeholders with flickr images
    this.bomb = function() {
        var self = this;
        
        $("img[src^='flickr://']").each(function () {
            var img = $(this),
                imageView = new ImageView({img: img});
                
            img.replaceWith(imageView.render().el);
        });
    };

    // Listener to close any open flickrbomb menus if you click on body
    $('body').click(function(event) {
        if (!$(event.target).closest('.setupIcon').length && !$(event.target).closest('.flickrbombFlyout').length) {
            $('.flickrbombFlyout').hide();
        }
    });    
};
    
// Bomb on sight! Just on include.
if ($("img[src^='flickr://']").length) flickrBomb().bomb();