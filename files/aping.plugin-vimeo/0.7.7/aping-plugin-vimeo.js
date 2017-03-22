/**
    @name: aping-plugin-vimeo 
    @version: 0.7.7 (26-01-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-vimeo 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_vimeo", ['jtt_vimeo'])
    .directive('apingVimeo', ['apingVimeoHelper', 'apingUtilityHelper', 'vimeoFactory', function (apingVimeoHelper, apingUtilityHelper, vimeoFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingVimeo, apingVimeoHelper.getThisPlattformString(), appSettings);

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
                        access_token: apingUtilityHelper.getApiCredentials(apingVimeoHelper.getThisPlattformString(), "access_token"),
                    };

                    if(typeof request.items !== "undefined") {
                        requestObject.per_page = request.items;
                    } else {
                        requestObject.per_page = appSettings.items;
                    }

                    if (requestObject.per_page === 0 || requestObject.per_page === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.per_page < 0 || isNaN(requestObject.per_page)) {
                        requestObject.per_page = undefined;
                    }

                    // the api has a limit of 50 items per request
                    if(requestObject.per_page > 50) {
                        requestObject.per_page = 50;
                    }


                    if(typeof request.search !== "undefined") {
                        requestObject.query = request.search;
                    }

                    if (request.user) { //search for videos by user

                        requestObject.user = request.user;
                        requestObject.filter = "embeddable";
                        requestObject.filter_embeddable = true;

                        vimeoFactory.getVideosFromUser(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingVimeoHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });

                    } else if (request.channel) { //search for videos by channel

                        requestObject.channel = request.channel;
                        requestObject.filter = "embeddable";
                        requestObject.filter_embeddable = true;

                        vimeoFactory.getVideosFromChannel(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingVimeoHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });

                    } else if (request.tag) { //search for videos by tag
                        requestObject.tag = request.tag;

                        vimeoFactory.getVideosFromTag(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingVimeoHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });

                    } else if (request.category) { //search for videos by category
                        requestObject.category = request.category;
                        requestObject.filter = "embeddable";
                        requestObject.filter_embeddable = true;

                        vimeoFactory.getVideosFromCategory(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingVimeoHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    }
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_vimeo")
    .service('apingVimeoHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlattformString = function () {
            return "vimeo";
        };

        this.getThisPlattformLink = function () {
            return "https://vimeo.com/";
        };

        this.getIdFromUri = function (_uri) {
            return _uri.split("/").slice(-1)[0];
        };

        this.getActionCounter = function (_connections, _action) {
            if (_connections[_action]) {
                return _connections[_action].total || undefined;
            }
        };

        this.getGoodQualityImage = function (_sizesArray) {
            var favoritePosition = 4;

            if (_sizesArray.length >= favoritePosition) {
                return _sizesArray[favoritePosition - 1].link;
            } else {
                return _sizesArray[_sizesArray.length - 1].link;
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
                    if (typeof value.link !== "undefined") {
                        if (typeof returnObject.thumb_url === "undefined") {
                            returnObject.thumb_url = value.link;
                            returnObject.thumb_width = value.width;
                            returnObject.thumb_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.thumb_width, 200) > that.getDifference(value.width, 200)
                                &&
                                value.width >= 200
                            ) {
                                returnObject.thumb_url = value.link;
                                returnObject.thumb_width = value.width;
                                returnObject.thumb_height = value.height;
                            }
                        }

                        if (typeof returnObject.img_url === "undefined") {
                            returnObject.img_url = value.link;
                            returnObject.img_width = value.width;
                            returnObject.img_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.img_width, 700) > that.getDifference(value.width, 700)
                            ) {
                                returnObject.img_url = value.link;
                                returnObject.img_width = value.width;
                                returnObject.img_height = value.height;
                            }
                        }

                        if (typeof returnObject.native_url === "undefined") {
                            returnObject.native_url = value.link;
                            returnObject.native_width = value.width;
                            returnObject.native_height = value.height;
                        } else {
                            if (
                                value.width > returnObject.native_width
                            ) {
                                returnObject.native_url = value.link;
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
            if (_data && _data.data) {
                var _this = this;

                if (_data.data.data) {

                    angular.forEach(_data.data.data, function (value, key) {
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

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item) {
            var socialObject = apingModels.getNew("social", this.getThisPlattformString());

            $.extend(true, socialObject, {
                blog_name: _item.user.name,
                blog_id: this.getIdFromUri(_item.user.uri),
                blog_link: _item.user.link,
                intern_type: "video",
                type: "video",
                intern_id: this.getIdFromUri(_item.uri),
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_time, 1000, 3600 * 1000),
                post_url: _item.link,
                caption: _item.name,
                text: _item.description,
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            if (_item.pictures && _item.pictures.sizes.length > 0) {
                var tempImageArray = this.getImagesFromImageArray(_item.pictures.sizes);
                socialObject.img_url = tempImageArray.img_url || undefined;
                socialObject.thumb_url = tempImageArray.thumb_url || undefined;
                socialObject.native_url = tempImageArray.native_url || undefined;
            }

            if (_item.embed && _item.embed.html) {
                socialObject.source = _item.embed.html;
            }

            if (!socialObject.text) {
                socialObject.text = socialObject.caption;
                socialObject.caption = "";
            }

            if (_item.metadata && _item.metadata.connections) {
                socialObject.likes = this.getActionCounter(_item.metadata.connections, "likes");
                socialObject.comments = this.getActionCounter(_item.metadata.connections, "comments");
            }

            return socialObject;
        };

        this.getVideoItemByJsonData = function (_item) {
            var videoObject = apingModels.getNew("video", this.getThisPlattformString());

            $.extend(true, videoObject, {
                blog_name: _item.user.name,
                blog_id: this.getIdFromUri(_item.user.uri),
                blog_link: _item.user.link,
                intern_id: this.getIdFromUri(_item.uri),
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_time, 1000, 3600 * 1000),
                post_url: _item.link,
                caption: _item.name,
                text: _item.description,
                duration: _item.duration, // in seconds
                width: _item.width,
                height: _item.height,
            });

            if (_item.pictures && _item.pictures.sizes.length > 0) {
                var tempImageArray = this.getImagesFromImageArray(_item.pictures.sizes);
                videoObject.img_url = tempImageArray.img_url || undefined;
                videoObject.thumb_url = tempImageArray.thumb_url || undefined;
                videoObject.native_url = tempImageArray.native_url || undefined;
            }

            videoObject.date_time = new Date(videoObject.timestamp);

            if (_item.embed && _item.embed.html) {
                videoObject.markup = _item.embed.html;
            } else {
                return false;
            }

            if (!videoObject.text) {
                videoObject.text = videoObject.caption;
                videoObject.caption = "";
            }

            if (_item.metadata && _item.metadata.connections) {
                videoObject.likes = this.getActionCounter(_item.metadata.connections, "likes");
                videoObject.comments = this.getActionCounter(_item.metadata.connections, "comments");
            }

            return videoObject;
        };

    }]);;"use strict";

angular.module("jtt_vimeo", [])
    .factory('vimeoFactory', ['$http', 'vimeoSearchDataService', function ($http, vimeoSearchDataService) {

        var vimeoFactory = {};

        vimeoFactory.getVideosFromChannel = function (_params) {

            if(!_params.channel) {
                return false;
            }

            var searchData = vimeoSearchDataService.getNew("videosFromChannel", _params);

            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        vimeoFactory.getVideosFromCategory = function (_params) {

            if(!_params.category) {
                return false;
            }

            var searchData = vimeoSearchDataService.getNew("videosFromCategory", _params);

            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        vimeoFactory.getVideosFromTag = function (_params) {

            if(!_params.tag) {
                return false;
            }

            var searchData = vimeoSearchDataService.getNew("videosFromTag", _params);

            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        vimeoFactory.getVideosFromUser = function (_params) {

            if(!_params.user) {
                return false;
            }

            var searchData = vimeoSearchDataService.getNew("videosFromUser", _params);

            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        return vimeoFactory;
    }])
    .service('vimeoSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "https://api.vimeo.com/";
        };

        this.fillDataInObjectByList = function (_object, _params, _list) {

            angular.forEach(_list, function (value, key) {
                if (typeof _params[value] !== "undefined") {
                    _object.object[value] = _params[value];
                }
            });

            return _object;
        };

        this.getNew = function (_type, _params) {

            var vimeoSearchData = {
                object: {
                    access_token: _params.access_token,
                },
                url: "",
            };

            switch (_type) {
                case "videosFromChannel":
                    vimeoSearchData = this.fillDataInObjectByList(vimeoSearchData, _params, [
                        'page', 'query', 'filter', 'filter_embeddable', 'sort', 'direction', 'per_page'
                    ]);

                    vimeoSearchData.url = this.getApiBaseUrl() + "channels/" + _params.channel + "/videos";
                    break;

                case "videosFromCategory":
                     vimeoSearchData = this.fillDataInObjectByList(vimeoSearchData, _params, [
                        'page', 'query', 'filter', 'filter_embeddable', 'sort', 'direction', 'per_page'
                    ]);

                    vimeoSearchData.url = this.getApiBaseUrl() + "categories/" + _params.category + "/videos";
                    break;

                case "videosFromTag":
                    vimeoSearchData = this.fillDataInObjectByList(vimeoSearchData, _params, [
                        'page', 'query', 'sort', 'direction', 'per_page'
                    ]);

                    vimeoSearchData.url = this.getApiBaseUrl() + "tags/" + _params.tag + "/videos";
                    break;

                case "videosFromUser":
                    vimeoSearchData = this.fillDataInObjectByList(vimeoSearchData, _params, [
                        'page', 'query', 'filter', 'filter_embeddable', 'sort', 'direction', 'per_page'
                    ]);

                    vimeoSearchData.url = this.getApiBaseUrl() + "users/" + _params.user + "/videos";
                    break;
            }

            return vimeoSearchData;
        };
    });