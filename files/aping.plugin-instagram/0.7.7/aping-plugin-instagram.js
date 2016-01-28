/**
    @name: aping-plugin-instagram 
    @version: 0.7.7 (28-01-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-instagram 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_instagram", ['jtt_instagram'])
    .directive('apingInstagram', ['instagramFactory', 'apingInstagramHelper', 'apingUtilityHelper', function (instagramFactory, apingInstagramHelper, apingUtilityHelper) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingInstagram, apingInstagramHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if (typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        access_token: apingUtilityHelper.getApiCredentials(apingInstagramHelper.getThisPlatformString(), "access_token"),
                    };

                    if (typeof request.items !== "undefined") {
                        requestObject.count = request.items;
                    } else {
                        requestObject.count = appSettings.items;
                    }

                    if (requestObject.count === 0 || requestObject.count === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.count < 0 || isNaN(requestObject.count)) {
                        requestObject.count = undefined;
                    }

                    // the api has a limit of 33 items per request
                    if (requestObject.count > 33) {
                        requestObject.count = 33;
                    }

                    if (request.userId) { //search for userId
                        requestObject.userId = request.userId;

                        instagramFactory.getMediaFromUserById(requestObject).then(function (_data) {
                            apingController.concatToResults(apingInstagramHelper.getObjectByJsonData(_data, helperObject));
                        });
                    } else if (request.tag) { //search for searchterm
                        requestObject.tag = request.tag;
                        instagramFactory.getMediaByTag(requestObject).then(function (_data) {
                            apingController.concatToResults(apingInstagramHelper.getObjectByJsonData(_data, helperObject));
                        });
                    } else if (request.locationId) { //search for locationId
                        requestObject.locationId = request.locationId;
                        instagramFactory.getMediaFromLocationById(requestObject).then(function (_data) {
                            apingController.concatToResults(apingInstagramHelper.getObjectByJsonData(_data, helperObject));
                        });
                    } else if (request.lat && request.lng) { //search for coordinates
                        requestObject.lat = request.lat;
                        requestObject.lng = request.lng;
                        if (request.distance) {
                            requestObject.distance = request.distance
                        }
                        instagramFactory.getMediaByCoordinates(requestObject).then(function (_data) {
                            apingController.concatToResults(apingInstagramHelper.getObjectByJsonData(_data, helperObject));
                        });
                    }
                });
            }
        }
    }]);
;"use strict";

angular.module("jtt_aping_instagram")
    .service('apingInstagramHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "instagram";
        };

        this.getThisPlatformLink = function () {
            return "https://instagram.com/";
        };

        this.replaceHashtagWithoutSpaces = function (_string) {

            if (_string && typeof _string === "string") {
                _string = _string.replace(/#/g, " #");
                _string = _string.replace(/  #/g, " #");
            }
            return _string;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data) {
                var _this = this;
                if (_data.data && _data.data.data) {
                    angular.forEach(_data.data.data, function (value, key) {

                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = _this.getNativeItemByJsonData(value, _helperObject.model);
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

            angular.extend(socialObject, {
                blog_name: _item.user.full_name || "@" + _item.user.username,
                blog_id: "@" + _item.user.username,
                blog_link: this.getThisPlatformLink() + _item.user.username,
                intern_type: _item.type,
                timestamp: parseInt(_item.created_time) * 1000,
                post_url: _item.link,
                intern_id: _item.id,
                text: _item.caption ? _item.caption.text : undefined,
                likes: _item.likes ? _item.likes.count : undefined,
                comments: _item.comments ? _item.likes.comments : undefined,
                thumb_url: _item.images.low_resolution.url,
                img_url: _item.images.standard_resolution.url,
                native_url: _item.images.standard_resolution.url.replace("s640x640/", ""),
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            socialObject.text = this.replaceHashtagWithoutSpaces(socialObject.text);

            if (_item.type == "video") {
                socialObject.type = "video";
                socialObject.source = _item.videos;
            }


            return socialObject;
        };

        this.getVideoItemByJsonData = function (_item) {

            if (_item.type != "video") {
                return false;
            }

            var videoObject = apingModels.getNew("video", this.getThisPlatformString());

            angular.extend(videoObject, {
                blog_name: _item.user.full_name || "@" + _item.user.username,
                blog_id: "@" + _item.user.username,
                blog_link: this.getThisPlatformLink() + _item.user.username,
                intern_type: _item.type,
                timestamp: parseInt(_item.created_time) * 1000,
                post_url: _item.link,
                intern_id: _item.id,
                text: _item.caption ? _item.caption.text : undefined,
                likes: _item.likes ? _item.likes.count : undefined,
                comments: _item.comments ? _item.likes.comments : undefined,
                type: "video",
                source: _item.videos.standard_resolution ? _item.videos.standard_resolution.url : undefined,
                width: _item.videos.standard_resolution ? _item.videos.standard_resolution.width : undefined,
                height: _item.videos.standard_resolution ? _item.videos.standard_resolution.height : undefined,
                thumb_url: _item.images.low_resolution.url,
                img_url: _item.images.standard_resolution.url,
                native_url: _item.images.standard_resolution.url.replace("s640x640/", ""),
            });

            videoObject.date_time = new Date(videoObject.timestamp);
            videoObject.text = this.replaceHashtagWithoutSpaces(videoObject.text);
            return videoObject;
        };

        this.getImageItemByJsonData = function (_item) {
            if (_item.type != "image") {
                return false;
            }

            var imageObject = apingModels.getNew("image", this.getThisPlatformString());
            angular.extend(imageObject, {
                blog_name: _item.user.full_name || "@" + _item.user.username,
                blog_id: "@" + _item.user.username,
                blog_link: this.getThisPlatformLink() + _item.user.username,
                intern_type: _item.type,
                timestamp: parseInt(_item.created_time) * 1000,
                post_url: _item.link,
                intern_id: _item.id,
                text: _item.caption ? _item.caption.text : undefined,
                likes: _item.likes ? _item.likes.count : undefined,
                comments: _item.comments ? _item.likes.comments : undefined,

                thumb_url: _item.images.low_resolution.url,
                thumb_width: _item.images.low_resolution.width,
                thumb_height: _item.images.low_resolution.height,

                img_url: _item.images.standard_resolution.url,
                img_width: _item.images.standard_resolution.width,
                img_height: _item.images.standard_resolution.height,

                native_url: _item.images.standard_resolution.url.replace("s640x640/", ""),
                type: "image",
            });

            imageObject.date_time = new Date(imageObject.timestamp);
            imageObject.text = this.replaceHashtagWithoutSpaces(imageObject.text);


            return imageObject;
        };

        this.getNativeItemByJsonData = function (_item, _model) {
            var nativeItem = {};
            switch (_model) {
                case "image":
                    if (_item.type != "image") {
                        return false;
                    } else {
                        nativeItem = _item;
                    }
                    break;

                case "video":
                    if (_item.type != "video") {
                        return false;
                    } else {
                        nativeItem = _item;
                    }
                    break;
            }
            nativeItem = _item;
            return nativeItem;
        };
    }]);;"use strict";

angular.module("jtt_instagram", [])
    .factory('instagramFactory', ['$http', 'instagramSearchDataService', function ($http, instagramSearchDataService) {

        var instagramFactory = {};

        instagramFactory.getUserById = function (_params) {

            var instagramSearchData = instagramSearchDataService.getNew("userById", _params);

            return $http.jsonp(
                instagramSearchData.url,
                {
                    method: 'GET',
                    params: instagramSearchData.object,
                }
            );
        };

        instagramFactory.getMediaFromUserById = function (_params) {

            var instagramSearchData = instagramSearchDataService.getNew("mediaFromUserById", _params);

            return $http.jsonp(
                instagramSearchData.url,
                {
                    method: 'GET',
                    params: instagramSearchData.object,
                }
            );
        };

        instagramFactory.getMediaByTag = function (_params) {

            var instagramSearchData = instagramSearchDataService.getNew("mediaByTag", _params);

            return $http.jsonp(
                instagramSearchData.url,
                {
                    method: 'GET',
                    params: instagramSearchData.object,
                }
            );
        };

        instagramFactory.getMediaFromLocationById = function (_params) {

            var instagramSearchData = instagramSearchDataService.getNew("mediaFromLocationById", _params);

            return $http.jsonp(
                instagramSearchData.url,
                {
                    method: 'GET',
                    params: instagramSearchData.object,
                }
            );
        };

        instagramFactory.getMediaByCoordinates= function (_params) {

            var instagramSearchData = instagramSearchDataService.getNew("mediaByCoordinates", _params);

            return $http.jsonp(
                instagramSearchData.url,
                {
                    method: 'GET',
                    params: instagramSearchData.object,
                }
            );
        };

        return instagramFactory;
    }])
    .service('instagramSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "https://api.instagram.com/v1/";
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

            var instagramSearchData = {
                object: {
                    access_token: _params.access_token,
                    callback: "JSON_CALLBACK"
                },
                url: "",
            };

            if(typeof _params.count !== "undefined") {
                instagramSearchData.object.count = _params.count;
            }

            switch (_type) {
                case "userById":
                    instagramSearchData.object.count = undefined;
                    instagramSearchData.url = this.getApiBaseUrl()+"users/" + _params.userId;
                    break;

                case "mediaFromUserById":
                    instagramSearchData = this.fillDataInObjectByList(instagramSearchData, _params, [
                        'max_id', 'min_id', 'min_timestamp', 'max_timestamp'
                    ]);
                    instagramSearchData.url = this.getApiBaseUrl()+"users/" + _params.userId + "/media/recent";
                    break;

                case "mediaByTag":
                    instagramSearchData = this.fillDataInObjectByList(instagramSearchData, _params, [
                        'max_tag_id', 'min_tag_id', 'min_timestamp', 'max_timestamp'
                    ]);
                    instagramSearchData.url = this.getApiBaseUrl()+"tags/" + _params.tag + "/media/recent";
                    break;

                case "mediaFromLocationById":
                    instagramSearchData = this.fillDataInObjectByList(instagramSearchData, _params, [
                        'max_id', 'min_id', 'min_timestamp', 'max_timestamp'
                    ]);
                    instagramSearchData.url = this.getApiBaseUrl()+"locations/" + _params.locationId + "/media/recent";
                    break;

                case "mediaByCoordinates":
                    instagramSearchData = this.fillDataInObjectByList(instagramSearchData, _params, [
                        'lat', 'lng', 'distance', 'min_timestamp', 'max_timestamp'
                    ]);
                    instagramSearchData.url = this.getApiBaseUrl()+"media/search";
                    break;
            }

            return instagramSearchData;
        };
    });