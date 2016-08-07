/**
    @name: aping-plugin-facebook 
    @version: 0.7.8 (28-01-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-facebook 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_facebook", ['jtt_facebook'])
    .directive('apingFacebook', ['apingFacebookHelper', 'apingUtilityHelper', 'facebookFactory', 'facebookPagesImages', function (apingFacebookHelper, apingUtilityHelper, facebookFactory, facebookPagesImages) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();
                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingFacebook, apingFacebookHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                        showAvatar: request.showAvatar || false,
                    };
                    if (typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        page: request.page,
                        access_token: apingUtilityHelper.getApiCredentials(apingFacebookHelper.getThisPlatformString(), "access_token"),
                    };
                    if (typeof request.items !== "undefined") {
                        requestObject.limit = request.items;
                    } else {
                        requestObject.limit = appSettings.items;
                    }

                    if (requestObject.limit === 0 || requestObject.limit === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.limit < 0 || isNaN(requestObject.limit)) {
                        requestObject.limit = undefined;
                    }

                    // the api has a limit of 100 items per request
                    if (requestObject.limit > 100) {
                        requestObject.limit = 100;
                    }

                    if (request.page) { //search for page id

                        switch (appSettings.model) {
                            case "social":

                                if (helperObject.showAvatar === true || helperObject.showAvatar === "true") {
                                    facebookFactory.getPageById({
                                        page: requestObject.page,
                                        access_token: requestObject.access_token
                                    }).then(function (_pageData) {

                                        if (_pageData && _pageData.data && _pageData.data.id && _pageData.data.cover && _pageData.data.cover.source) {
                                            facebookPagesImages[_pageData.data.id] = _pageData.data.cover.source;
                                        }

                                        facebookFactory.getPostsFromPageById(requestObject)
                                            .then(function (_data) {
                                                if (_data) {
                                                    apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                                }
                                            });

                                    });
                                } else {
                                    facebookFactory.getPostsFromPageById(requestObject)
                                        .then(function (_data) {
                                            if (_data) {
                                                apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                            }
                                        });
                                }
                                break;

                            case "video":
                                if (helperObject.showAvatar === true || helperObject.showAvatar === "true") {
                                    facebookFactory.getPageById({
                                        page: requestObject.page,
                                        access_token: requestObject.access_token
                                    }).then(function (_pageData) {

                                        if (_pageData && _pageData.data && _pageData.data.id && _pageData.data.cover && _pageData.data.cover.source) {
                                            facebookPagesImages[_pageData.data.id] = _pageData.data.cover.source;
                                        }

                                        facebookFactory.getVideosFromPageById(requestObject)
                                            .then(function (_data) {
                                                if (_data) {
                                                    apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                                }
                                            });

                                    });
                                } else {
                                    facebookFactory.getVideosFromPageById(requestObject)
                                        .then(function (_data) {
                                            if (_data) {
                                                apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                            }
                                        });
                                }
                                break;

                            case "image":
                                facebookFactory.getPhotosFromPageById(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                        }
                                    });
                                break;

                            case "event":
                                if (helperObject.showAvatar === true || helperObject.showAvatar === "true") {
                                    facebookFactory.getPageById({
                                        page: requestObject.page,
                                        access_token: requestObject.access_token
                                    }).then(function (_pageData) {

                                        if (_pageData && _pageData.data && _pageData.data.id && _pageData.data.cover && _pageData.data.cover.source) {
                                            facebookPagesImages[_pageData.data.id] = _pageData.data.cover.source;
                                        }

                                        facebookFactory.getEventsFromPageById(requestObject)
                                            .then(function (_data) {
                                                if (_data) {
                                                    apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                                }
                                            });
                                    });
                                } else {
                                    facebookFactory.getEventsFromPageById(requestObject)
                                        .then(function (_data) {
                                            if (_data) {
                                                apingController.concatToResults(apingFacebookHelper.getObjectByJsonData(_data, appSettings));
                                            }
                                        });
                                }
                                break;
                        }
                    }
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_facebook")
    .service('apingFacebookHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', 'facebookPagesImages', function (apingModels, apingTimeHelper, apingUtilityHelper, facebookPagesImages) {
        this.getThisPlatformString = function () {
            return "facebook";
        };

        this.getThisPlatformLink = function () {
            return "https://facebook.com/";
        };

        /**
         * returns object with attributes "width" and "height" of video
         *
         * @param _format {Object}
         * @returns {Object}
         */
        this.getRatioFromFormatObject = function (_format) {
            var ratio = {
                width: undefined,
                height: undefined,
            };
            if (typeof _format !== "undefined" && _format.constructor === Array) {
                angular.forEach(_format, function (value, key) {
                    if (typeof value.filter !== "undefined") {
                        if (value.filter === "native") {
                            if (typeof value.width !== "undefined") {
                                ratio.width = value.width;
                            }
                            if (typeof value.height !== "undefined") {
                                ratio.height = value.height;
                            }
                        }
                    }
                });
                return ratio;
            }
        };

        /**
         * returns the difference between two integers
         *
         * @param _int1 {number}
         * @param _int2 {number}
         * @returns {number}
         */
        this.getDifference = function (_int1, _int2) {
            if (_int1 > _int2) {
                return _int1 - _int2;
            } else {
                return _int2 - _int1;
            }
        };

        /**
         * returns an object with images urls and dimensions
         *
         * @param _array {Array}
         * @returns {Object}
         */
        this.getImagesFromArray = function (_array, _imgPropertyName) {

            if (angular.isUndefined(_imgPropertyName)) {
                _imgPropertyName = "source";
            }

            var that = this;

            var returnObject = {
                thumb_url: undefined,
                thumb_width: undefined, // best case 200px (min)
                thumb_height: undefined,
                img_url: undefined,
                img_width: undefined, // best case 700px
                img_height: undefined,
                native_url: undefined,
                native_width: undefined,
                native_height: undefined,
            };

            if (_array.constructor === Array) {
                angular.forEach(_array, function (value, key) {

                    if (angular.isDefined(value[_imgPropertyName])) {
                        if (angular.isUndefined(returnObject.thumb_url)) {
                            returnObject.thumb_url = value[_imgPropertyName];
                            returnObject.thumb_width = value.width;
                            returnObject.thumb_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.thumb_width, 200) > that.getDifference(value.width, 200)
                                &&
                                value.width >= 200
                            ) {
                                returnObject.thumb_url = value[_imgPropertyName];
                                returnObject.thumb_width = value.width;
                                returnObject.thumb_height = value.height;
                            }
                        }

                        if (angular.isUndefined(returnObject.img_url)) {
                            returnObject.img_url = value[_imgPropertyName];
                            returnObject.img_width = value.width;
                            returnObject.img_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.img_width, 700) > that.getDifference(value.width, 700)
                            ) {
                                returnObject.img_url = value[_imgPropertyName];
                                returnObject.img_width = value.width;
                                returnObject.img_height = value.height;
                            }
                        }

                        if (angular.isUndefined(returnObject.native_url)) {
                            returnObject.native_url = value[_imgPropertyName];
                            returnObject.native_width = value.width;
                            returnObject.native_height = value.height;
                        } else {
                            if (
                                value.width > returnObject.native_width
                            ) {
                                returnObject.native_url = value[_imgPropertyName];
                                returnObject.native_width = value.width;
                                returnObject.native_height = value.height;
                            }
                        }
                    }
                });
            }

            return returnObject;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data) {

                var _this = this;

                if (_data.data && _data.data.data) {

                    angular.forEach(_data.data.data, function (value, key) {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {
                            tempResult = _this.getItemByJsonData(value, _helperObject);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                }

            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _helperObject) {
            var returnObject = {};
            if (_item && _helperObject.model) {
                switch (_helperObject.model) {
                    case "social":
                        returnObject = this.getSocialItemByJsonData(_item, _helperObject);
                        break;
                    case "video":
                        returnObject = this.getVideoItemByJsonData(_item, _helperObject);
                        break;
                    case "image":
                        returnObject = this.getImageItemByJsonData(_item, _helperObject);
                        break;
                    case "event":
                        returnObject = this.getEventItemByJsonData(_item, _helperObject);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item, _helperObject) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            angular.extend(socialObject, {
                blog_name: _item.from.name,
                blog_id: _item.from.id,
                blog_link: this.getThisPlatformLink() + _item.from.id + "/",
                intern_type: _item.type,
                intern_id: _item.id,
                thumb_url: _item.picture,
                img_url: _item.full_picture,
                native_url: _item.full_picture,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_time, 1000, 3600 * 1000)
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            switch (_item.type) {
                case 'photo':
                    socialObject.type = "image";
                    socialObject.post_url = _item.link;
                    socialObject.text = _item.message;
                    break;

                case 'status':
                    socialObject.type = "post";
                    break;

                case 'link':
                    socialObject.type = "link";
                    socialObject.post_url = this.getThisPlatformLink() + _item.id + "/";
                    socialObject.content_url = _item.link;
                    socialObject.caption = _item.name;
                    break;

                case 'video':
                    socialObject.type = "video";
                    if (_item.name) {
                        socialObject.caption = _item.name;
                    }
                    break;

                case 'event':
                    socialObject.type = "event";
                    socialObject.text = _item.description;
                    socialObject.caption = _item.caption || _item.name || undefined;
                    break;
            }

            if (!socialObject.text) {
                socialObject.text = _item.message;
            }

            if (!socialObject.text) {
                socialObject.text = _item.name;
            }


            if (!socialObject.post_url) {
                if (!_item.id) {
                    socialObject.post_url = _item.link;
                } else {
                    socialObject.post_url = this.getThisPlatformLink() + _item.id + "/";
                }
            }

            if ((_helperObject.showAvatar === true || _helperObject.showAvatar === "true") && !socialObject.img_url) {
                if (facebookPagesImages[_item.from.id]) {
                    socialObject.img_url = facebookPagesImages[_item.from.id];
                }
            }

            return socialObject;
        };

        this.getVideoItemByJsonData = function (_item, _helperObject) {
            var videoObject = apingModels.getNew("video", this.getThisPlatformString());

            angular.extend(videoObject, {
                blog_name: _item.from.name,
                blog_id: _item.from.id,
                blog_link: this.getThisPlatformLink() + _item.from.id + "/",
                intern_id: _item.id,
                post_url: _item.permalink_url,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_time, 1000, 3600 * 1000),
                text: _item.description,
                markup: _item.embed_html || undefined,
                source: _item.source || undefined,
            });

            videoObject.date_time = new Date(videoObject.timestamp);

            if (typeof _item.length !== "undefined") {
                videoObject.length = _item.length;
            }


            if (typeof _item.format !== "undefined") {
                if (_item.format.length > 0) {

                    var tempImageArray = this.getImagesFromArray(_item.format, "picture");

                    tempImageArray.thumb_width = undefined;
                    tempImageArray.thumb_height = undefined;
                    tempImageArray.img_width = undefined;
                    tempImageArray.img_height = undefined;
                    tempImageArray.native_width = undefined;
                    tempImageArray.native_height = undefined;

                    angular.extend(videoObject, tempImageArray);


                    var ratio = this.getRatioFromFormatObject(_item.format);
                    if (typeof ratio.width !== "undefined") {
                        videoObject.width = ratio.width;
                    }
                    if (typeof ratio.height !== "undefined") {
                        videoObject.height = ratio.height;
                    }
                }
            }

            if ((_helperObject.showAvatar === true || _helperObject.showAvatar === "true") && !videoObject.img_url) {
                if (facebookPagesImages[_item.from.id]) {
                    videoObject.img_url = facebookPagesImages[_item.from.id];
                }
            }

            return videoObject;
        };

        this.getImageItemByJsonData = function (_item, _helperObject) {
            var imageObject = apingModels.getNew("image", this.getThisPlatformString());

            angular.extend(imageObject, {
                blog_name: _item.from.name,
                blog_id: _item.from.id,
                blog_link: this.getThisPlatformLink() + _item.from.id + "/",
                intern_id: _item.id,
                post_url: _item.link,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_time, 1000, 3600 * 1000),
                text: _item.name || undefined,
                source: _item.images || undefined,
            });

            imageObject.date_time = new Date(imageObject.timestamp);

            if (_item.images.length > 0) {

                var tempImageArray = this.getImagesFromArray(_item.images, "source");
                angular.extend(imageObject, tempImageArray);
            }

            return imageObject;
        };

        this.getEventItemByJsonData = function (_item, _helperObject) {
            var eventObject = apingModels.getNew("event", this.getThisPlatformString());

            angular.extend(eventObject, {
                artist_name: _item.owner.name,
                artist_id: _item.owner.id,
                artist_link: this.getThisPlatformLink() + _item.owner.id + "/",
                intern_id: _item.id,
                event_url: this.getThisPlatformLink() + _item.owner.id + "_" + _item.id + "/",
                ticket_url: _item.ticket_uri || undefined,
                start_timestamp: apingTimeHelper.getTimestampFromDateString(_item.start_time, 1000, 3600 * 1000),
                end_timestamp: _item.end_time ? apingTimeHelper.getTimestampFromDateString(_item.end_time, 1000, 3600 * 1000) : undefined,
                caption: _item.name || undefined,
                text: _item.description || undefined,
                img_url: _item.cover ? _item.cover.source : undefined,
            });

            if (eventObject.start_timestamp) {
                eventObject.start_date_time = new Date(eventObject.start_timestamp);
            }
            if (eventObject.end_timestamp) {
                eventObject.end_date_time = new Date(eventObject.end_timestamp);
            }


            if (_item.place) {
                eventObject.place_name = _item.place.name || undefined;
                if (_item.place.location) {
                    eventObject.city = _item.place.location.city || undefined;
                    eventObject.country = _item.place.location.country || undefined;
                    eventObject.latitude = _item.place.location.latitude || undefined;
                    eventObject.longitude = _item.place.location.longitude || undefined;
                    eventObject.street = _item.place.location.street || undefined;
                    eventObject.zip = _item.place.location.zip || undefined;
                }
            }

            if ((_helperObject.showAvatar === true || _helperObject.showAvatar === "true") && !eventObject.img_url) {
                if (facebookPagesImages[_item.from.id]) {
                    eventObject.img_url = facebookPagesImages[_item.from.id];
                }
            }
            return eventObject;
        };
    }]);;"use strict";
angular.module("jtt_aping_facebook")
    .config(['$provide', function ($provide) {

        $provide.value("facebookPagesImages", {});

    }]);
;"use strict";

angular.module("jtt_facebook", [])
    .factory('facebookFactory', ['$http', 'facebookSearchDataService', function ($http, facebookSearchDataService) {

        var facebookFactory = {};

        facebookFactory.getPostsFromPageById = function (_params) {
            var facebookSearchData = facebookSearchDataService.getNew("postsFromPageById", _params);

            return $http({
                method: 'GET',
                url: facebookSearchData.url,
                params: facebookSearchData.object,
            });
        };

        facebookFactory.getPhotosFromPageById = function (_params) {
            var facebookSearchData = facebookSearchDataService.getNew("photosFromPageById", _params);

            return $http({
                method: 'GET',
                url: facebookSearchData.url,
                params: facebookSearchData.object,
            });
        };

        facebookFactory.getVideosFromPageById = function (_params) {
            var facebookSearchData = facebookSearchDataService.getNew("videosFromPageById", _params);

            return $http({
                method: 'GET',
                url: facebookSearchData.url,
                params: facebookSearchData.object,
            });
        };

        facebookFactory.getEventsFromPageById = function (_params) {
            var facebookSearchData = facebookSearchDataService.getNew("eventsFromPageById", _params);

            return $http({
                method: 'GET',
                url: facebookSearchData.url,
                params: facebookSearchData.object,
            });
        };

        facebookFactory.getPageById = function (_params) {
            var facebookSearchData = facebookSearchDataService.getNew("pageById", _params);

            return $http({
                method: 'GET',
                url: facebookSearchData.url,
                params: facebookSearchData.object,
            });
        };

        return facebookFactory;
    }])
    .service('facebookSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            var version;

            if(_params && typeof _params.version !== "undefined") {
                version = _params.version+"/";
            } else {
                version = "v2.5/";
            }
            return "https://graph.facebook.com/"+version;
        };

        this.fillDataInObjectByList = function(_object, _params, _list) {

            angular.forEach(_list, function (value, key) {
                if(typeof _params[value] !== "undefined") {
                    _object.object[value] = _params[value];
                }
            });

            return _object;
        };

        this.getNew = function (_type, _params) {

            var facebookSearchData = {
                object: {
                    access_token:_params.access_token || undefined,
                },
                url: "",
            };

            if (typeof _params.limit !== "undefined") {
                facebookSearchData.object.limit = _params.limit;
            }

            switch (_type) {
                case "postsFromPageById":
                    facebookSearchData.object.fields = "id,message,story,created_time,full_picture,from,link,description,type,shares,source,picture,object_id";

                    facebookSearchData = this.fillDataInObjectByList(facebookSearchData, _params, [
                        '__paging_token', 'until', 'since', '__previous'
                    ]);

                    facebookSearchData.url = this.getApiBaseUrl()+_params.page+"/posts?";
                    break;

                case "photosFromPageById":

                    facebookSearchData.object.fields = "id,created_time,from,link,picture,album,name,images,width,height";

                    facebookSearchData = this.fillDataInObjectByList(facebookSearchData, _params, [
                        'before', 'after'
                    ]);

                    facebookSearchData.url = this.getApiBaseUrl()+_params.page+"/photos?";
                    break;

                case "videosFromPageById":

                    facebookSearchData.object.fields = "id,created_time,from,description,source,picture,format,title,embed_html,permalink_url,length";

                    facebookSearchData = this.fillDataInObjectByList(facebookSearchData, _params, [
                        'before', 'after'
                    ]);

                    facebookSearchData.url = this.getApiBaseUrl()+_params.page+"/videos?";
                    break;

                case "eventsFromPageById":

                    facebookSearchData.object.fields = "id,owner,description,picture{url},end_time,name,cover,category,place,start_time,ticket_uri";

                    facebookSearchData = this.fillDataInObjectByList(facebookSearchData, _params, [
                        'before', 'after'
                    ]);

                    facebookSearchData.url = this.getApiBaseUrl()+_params.page+"/events?";
                    break;

                case "pageById":

                    facebookSearchData.object.fields = "cover,link,picture{url},username,name";

                    facebookSearchData.object.limit = undefined;

                    facebookSearchData.url = this.getApiBaseUrl()+_params.page+"/";
                    break;

            }

            return facebookSearchData;
        };
    });