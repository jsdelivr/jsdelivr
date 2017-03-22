/**
    @name: aping-plugin-tumblr 
    @version: 0.7.6 (11-01-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-tumblr 
    @license: MIT
*/
"use strict";

var jjtApingTumblr = angular.module("jtt_aping_tumblr", ['jtt_tumblr'])
    .directive('apingTumblr', ['apingTumblrHelper', 'apingUtilityHelper', 'tumblrFactory', function (apingTumblrHelper, apingUtilityHelper, tumblrFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingTumblr, apingTumblrHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if(typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        api_key: apingUtilityHelper.getApiCredentials(apingTumblrHelper.getThisPlatformString(), "api_key"),
                        filter:"text",

                    };

                    if(typeof request.items !== "undefined") {
                        requestObject.limit = request.items;
                    } else {
                        requestObject.limit = appSettings.items;
                    }

                    if (requestObject.limit === 0 || requestObject.limit === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.limit < 0 || isNaN(requestObject.limit)) {
                        requestObject.limit = undefined;
                    }

                    // the api has a limit of 20 items per request
                    if(requestObject.limit > 20) {
                        requestObject.limit = 20;
                    }

                    if(typeof request.tag !== "undefined") {
                        requestObject.tag = request.tag;
                    }

                    if(request.page) {

                        requestObject.page = request.page;

                        switch(appSettings.model) {
                            case "image":
                                requestObject.type = "photo";
                                break;

                            case "video":
                                requestObject.type = "video";
                                break;

                            case "social":
                                break;

                            default:
                                return false;
                        }

                        tumblrFactory.getPostsFromPage(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingTumblrHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    }
                });
            }
        }
    }]);;"use strict";

jjtApingTumblr.service('apingTumblrHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlatformString = function () {
        return "tumblr";
    };

    this.getThisBlogLink = function (_page) {
        return "http://" + _page + ".tumblr.com/";
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
    this.getImagesFromImageArray = function (_array) {

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
                if (typeof value.url !== "undefined") {
                    if (typeof returnObject.thumb_url === "undefined") {
                        returnObject.thumb_url = value.url;
                        returnObject.thumb_width = value.width;
                        returnObject.thumb_height = value.height;
                    } else {
                        if (
                            that.getDifference(returnObject.thumb_width, 200) > that.getDifference(value.width, 200)
                            &&
                            value.width >= 200
                        ) {
                            returnObject.thumb_url = value.url;
                            returnObject.thumb_width = value.width;
                            returnObject.thumb_height = value.height;
                        }
                    }

                    if (typeof returnObject.img_url === "undefined") {
                        returnObject.img_url = value.url;
                        returnObject.img_width = value.width;
                        returnObject.img_height = value.height;
                    } else {
                        if (
                            that.getDifference(returnObject.img_width, 700) > that.getDifference(value.width, 700)
                        ) {
                            returnObject.img_url = value.url;
                            returnObject.img_width = value.width;
                            returnObject.img_height = value.height;
                        }
                    }

                    if (typeof returnObject.native_url === "undefined") {
                        returnObject.native_url = value.url;
                        returnObject.native_width = value.width;
                        returnObject.native_height = value.height;
                    } else {
                        if (
                            value.width > returnObject.native_width
                        ) {
                            returnObject.native_url = value.url;
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
        if (_data && _data.data && _data.data.response) {
            var _this = this;

            if (_data.data.response.posts) {

                angular.forEach(_data.data.response.posts, function (value, key) {
                    var tempResult;
                    if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = value;
                    } else {
                        tempResult = _this.getItemByJsonData(value, _helperObject.model);
                    }
                    if (tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            }

        }
        return requestResults;
    };

    this.getItemByJsonData = function (_item, _model) {
        var returnObject = {};
        if (_item && _model) {
            switch (_model) {
                case "social":
                    returnObject = this.getSocialItemByJsonData(_item);
                    break;
                case "video":
                    returnObject = this.getVideoItemByJsonData(_item);
                    break;
                case "image":
                    returnObject = this.getImageItemByJsonData(_item);
                    break;

                default:
                    return false;
            }
        }
        return returnObject;
    };

    this.getSocialItemByJsonData = function (_item) {
        var socialObject = apingModels.getNew("social", this.getThisPlatformString());

        //fill _item in socialObject
        $.extend(true, socialObject, {
            blog_name: _item.blog_name || undefined,
            blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
            type: _item.type || undefined,
            timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
            post_url: _item.short_url || undefined,
            intern_id: _item.id || undefined,
        });

        switch(_item.type) {
            case "photo":
                socialObject.text = _item.caption || undefined;
                if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                    socialObject.source = _item.photos;

                    var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
                    if(typeof tempImageArray.img_url !== "undefined") {
                        socialObject.img_url = tempImageArray.img_url;
                    }
                }
                break;

            case "link":
                socialObject.text = _item.description || undefined;
                if(socialObject.text) {
                    socialObject.caption = _item.title || undefined;
                } else {
                    socialObject.text = _item.title || undefined;
                }
                if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                    var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
                    if(typeof tempImageArray.img_url !== "undefined") {
                        socialObject.img_url = tempImageArray.img_url;
                    }
                }
                break;

            case "video":
                socialObject.text = _item.caption || undefined;
                if(_item.thumbnail_url) {
                    socialObject.img_url = _item.thumbnail_url;
                }
                if(_item.player) {
                    socialObject.source = _item.player;
                }
                break;

            case "text":
                socialObject.text = _item.body || undefined;
                if(socialObject.text) {
                    socialObject.caption = _item.title || undefined;
                } else {
                    socialObject.text = _item.title || undefined;
                }
                break;

            case "audio":
                socialObject.text = _item.caption || undefined;
                if(_item.player) {
                    socialObject.source = _item.player;
                }
                break;

            default:
                return false;
        }

        socialObject.date_time = new Date(socialObject.timestamp);

        return socialObject;
    };

    this.getVideoItemByJsonData = function (_item) {
        var videoObject = apingModels.getNew("video", this.getThisPlatformString());

        //fill _item in videoObject
        $.extend(true, videoObject, {
            blog_name: _item.blog_name || undefined,
            blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
            type: _item.type || undefined,
            timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
            post_url: _item.short_url || undefined,
            intern_id: _item.id || undefined,
            text: _item.caption || undefined,
            img_url: _item.thumbnail_url || undefined,
        });

        angular.forEach(_item.player, function (value, key) {

            if(typeof videoObject.markup === "undefined" || value.width > videoObject.width) {
                videoObject.markup = value.embed_code;
                videoObject.width = value.width;
            }

        });


        videoObject.date_time = new Date(videoObject.timestamp);

        return videoObject;
    };

    this.getImageItemByJsonData = function (_item) {
        var imageObject = apingModels.getNew("image", this.getThisPlatformString());

        //fill _item in imageObject
        $.extend(true, imageObject, {
            blog_name: _item.blog_name || undefined,
            blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
            type: _item.type || undefined,
            timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
            post_url: _item.short_url || undefined,
            intern_id: _item.id || undefined,
        });

        imageObject.text = _item.caption || undefined;
        if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
            imageObject.source = _item.photos;

            var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
            $.extend(true, imageObject, tempImageArray);
        }

        imageObject.date_time = new Date(imageObject.timestamp);

        return imageObject;
    };
}]);;"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/angular-tumblr-api-factory
 @licence MIT
 */

angular.module("jtt_tumblr", [])
    .factory('tumblrFactory', ['$http', 'tumblrSearchDataService', function ($http, tumblrSearchDataService) {

        var tumblrFactory = {};

        tumblrFactory.getPostsFromPage = function (_params) {
            var tumblrSearchData = tumblrSearchDataService.getNew("postsFromPage", _params);

            return $http.jsonp(
                tumblrSearchData.url,
                {
                    method: 'GET',
                    params: tumblrSearchData.object,
                }
            );
        };

        tumblrFactory.getInfoFromPage = function (_params) {
            var tumblrSearchData = tumblrSearchDataService.getNew("infoFromPage", _params);

            return $http.jsonp(
                tumblrSearchData.url,
                {
                    method: 'GET',
                    params: tumblrSearchData.object,
                }
            );
        };

        tumblrFactory.getAvatarFromPage = function (_params) {
            var tumblrSearchData = tumblrSearchDataService.getNew("avatarFromPage", _params);

            return $http.jsonp(
                tumblrSearchData.url,
                {
                    method: 'GET',
                    params: tumblrSearchData.object,
                }
            );
        };

        return tumblrFactory;
    }])
    .service('tumblrSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            var version;

            if(_params && typeof _params.version !== "undefined") {
                version = _params.version+"/";
            } else {
                version = "v2/";
            }
            return 'https://api.tumblr.com/'+version+'blog/';
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

            var tumblrSearchData = {
                object: {
                    api_key:_params.api_key || undefined,
                    callback: "JSON_CALLBACK"
                },
                url: "",
            };

            if (typeof _params.limit !== "undefined") {
                tumblrSearchData.object.limit = _params.limit;
            }

            switch (_type) {
                case "postsFromPage":
                    tumblrSearchData = this.fillDataInObjectByList(tumblrSearchData, _params, [
                        'type', 'id', 'tag', 'offset', 'reblog_info', 'notes_info', 'filter'
                    ]);

                    tumblrSearchData.url = this.getApiBaseUrl()+_params.page+".tumblr.com/posts";
                    break;

                case "infoFromPage":
                    tumblrSearchData.object.limit = undefined;

                    tumblrSearchData.url = this.getApiBaseUrl()+_params.page+".tumblr.com/info";
                    break;

                case "avatarFromPage":
                    tumblrSearchData.object.limit = undefined;

                    var size = "";

                    if (typeof _params.size !== "undefined") {
                        size = "/"+_params.size;
                    }

                    tumblrSearchData.url = this.getApiBaseUrl()+_params.page+".tumblr.com/avatar"+size;
                    break;

            }

            return tumblrSearchData;
        };
    });