/**
    @name: aping-plugin-flickr 
    @version: 0.7.9 (21-03-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-flickr 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_flickr", ['jtt_flickr'])
    .directive('apingFlickr', ['apingFlickrHelper', 'apingUtilityHelper', 'flickrFactory', function (apingFlickrHelper, apingUtilityHelper, flickrFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingFlickr, apingFlickrHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {
                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if (typeof request.items !== "undefined") {
                        helperObject.items = request.items;
                    } else {
                        helperObject.items = appSettings.items;
                    }
                    if (typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    if (helperObject.items === 0 || helperObject.items === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (helperObject.items < 0 || isNaN(helperObject.items)) {
                        helperObject.items = undefined;
                    }

                    // the api has a limit of 20 items per request
                    if (helperObject.items > 20) {
                        helperObject.items = 20;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        items: helperObject.items,
                    };
                    if (typeof request.language !== "undefined") {
                        requestObject.lang = request.language;
                    }

                    if (request.userId) {
                        requestObject.id = request.userId;
                        flickrFactory.getImagesFromUserById(requestObject)
                            .then(function (_data) {
                                apingController.concatToResults(apingFlickrHelper.getObjectByJsonData(_data, helperObject));
                            });
                    } else if (request.tags) {
                        requestObject.tags = request.tags;

                        if (request.tagmode) {
                            requestObject.tagmode = request.tagmode;
                        }

                        flickrFactory.getImagesByTags(requestObject)
                            .then(function (_data) {
                                apingController.concatToResults(apingFlickrHelper.getObjectByJsonData(_data, helperObject));
                            });
                    }

                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_flickr")
    .service('apingFlickrHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "flickr";
        };

        this.getThisPlatformLink = function () {
            return "http://flickr.com/";
        };

        this.getUserNameFromString = function (_string) {
            var userName = _string.replace("nobody@flickr.com (", "");
            userName = userName.substr(0, userName.length - 1);
            return userName;
        };

        this.removeOverHeadFromDescription = function (_string) {
            if (angular.isDefined(_string)) {
                if (typeof _string === "string") {
                    var parts = _string.split("posted a photo:");
                    if (parts.length > 1) {
                        _string = parts[1].trim();
                    }
                    if (_string === "") {
                        _string = undefined;
                    }
                }
            }
            return _string;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data) {
                var _this = this;

                if (_data.data && _data.data.items) {

                    angular.forEach(_data.data.items, function (value, key) {
                        if (angular.isUndefined(_helperObject.items) || (_helperObject.items > 0 && requestResults.length < _helperObject.items)) {
                            var tempResult = _this.getItemByJsonData(value, _helperObject);
                            if (tempResult) {
                                requestResults.push(tempResult);
                            }
                        }
                    });
                }
            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _helperObject) {
            var returnObject = {};
            if (_item && _helperObject.model) {

                if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                    returnObject = this.getNativeItemByJsonData(_item);
                } else {
                    switch (_helperObject.model) {
                        case "social":
                            returnObject = this.getSocialItemByJsonData(_item);
                            break;
                        case "image":
                            returnObject = this.getImageItemByJsonData(_item);
                            break;

                        default:
                            return false;
                    }
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(socialObject, {
                blog_name: _item.author ? this.getUserNameFromString(_item.author) : undefined,
                blog_id: _item.author_id || undefined,
                blog_link: _item.author_id ? this.getThisPlatformLink() + _item.author_id : undefined,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.published, 1000, 3600 * 1000),
                post_url: _item.link,
                intern_id: (_item.link).split("flickr.com").length >= 2 ? (_item.link).split("flickr.com")[1] : undefined,
                thumb_url: _item.media ? _item.media.m : undefined,
                img_url: _item.media ? (_item.media.m).replace("_m.", ".") : undefined,
            });

            socialObject.native_url = socialObject.img_url;

            socialObject.text = _item.description ? this.removeOverHeadFromDescription(apingUtilityHelper.getTextFromHtml(_item.description)) : undefined;

            if (_item.title) {
                if (socialObject.text) {
                    socialObject.caption = _item.title;
                } else {
                    socialObject.text = _item.title;
                }
            }

            socialObject.date_time = new Date(socialObject.timestamp);

            if ((_item.description).indexOf("posted a photo") > -1) {
                socialObject.type = "image";
            } else {
                return false;
            }

            return socialObject;
        };

        this.getImageItemByJsonData = function (_item) {
            var imageObject = apingModels.getNew("image", this.getThisPlatformString());

            //fill _item in imageObject
            angular.extend(imageObject, {
                blog_name: _item.author ? this.getUserNameFromString(_item.author) : undefined,
                blog_id: _item.author_id || undefined,
                blog_link: _item.author_id ? this.getThisPlatformLink() + _item.author_id : undefined,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.published, 1000, 3600 * 1000),
                post_url: _item.link,
                intern_id: (_item.link).split("flickr.com").length >= 2 ? (_item.link).split("flickr.com")[1] : undefined,
                thumb_url: _item.media ? _item.media.m : undefined,
                img_url: _item.media ? (_item.media.m).replace("_m.", ".") : undefined,
            });

            imageObject.native_url = imageObject.img_url;
            imageObject.text = _item.description ? this.removeOverHeadFromDescription(apingUtilityHelper.getTextFromHtml(_item.description)) : undefined;

            if (_item.title && _item.title.toLowerCase() !== "untitled") {
                if (imageObject.text) {
                    imageObject.caption = _item.title;
                } else {
                    imageObject.text = _item.title;
                }
            }

            imageObject.date_time = new Date(imageObject.timestamp);

            if ((_item.description).indexOf("posted a photo") <= 0) {
                return false;
            }

            return imageObject;
        };

        this.getNativeItemByJsonData = function (_item) {
            if ((_item.description).indexOf("posted a photo") <= 0) {
                return false;
            }
            return _item;
        };
    }]);;"use strict";

angular.module("jtt_flickr", [])
    .factory('flickrFactory', ['$http', 'flickrSearchDataService', function ($http, flickrSearchDataService) {

        var flickrFactory = {};

        flickrFactory.getImagesFromUserById = function (_params) {

            var searchData = flickrSearchDataService.getNew("imagesFromUserById", _params);

            return $http({
                method: 'JSONP',
                url: searchData.url,
                params: searchData.object,
            });
        };

        flickrFactory.getImagesFromGroupOfUsersByIds = function (_params) {

            var searchData = flickrSearchDataService.getNew("imagesFromGroupOfUsersByIds", _params);

            return $http({
                method: 'JSONP',
                url: searchData.url,
                params: searchData.object,
            });
        };

        flickrFactory.getImagesByTags = function (_params) {

            var searchData = flickrSearchDataService.getNew("imagesByTags", _params);

            return $http({
                method: 'JSONP',
                url: searchData.url,
                params: searchData.object,
            });
        };

        return flickrFactory;
    }])
    .service('flickrSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "https://api.flickr.com/services/feeds/photos_public.gne";
        };

        this.fillDataInObjectByList = function (_object, _params, _list) {

            angular.forEach(_list, function (value, key) {
                if (angular.isDefined(_params[value])) {
                    _object.object[value] = _params[value];
                }
            });

            return _object;
        };

        this.getNew = function (_type, _params) {
            var flickrSearchData = {
                object: {
                    jsoncallback:'JSON_CALLBACK',
                    format: "json"
                },
                url: "",
            };

            switch (_type) {
                case "imagesFromUserById":
                    flickrSearchData = this.fillDataInObjectByList(flickrSearchData, _params, [
                        'lang', 'id'
                    ]);

                    flickrSearchData.url = this.getApiBaseUrl();
                    break;

                case "imagesFromGroupOfUsersByIds":
                    flickrSearchData = this.fillDataInObjectByList(flickrSearchData, _params, [
                        'lang', 'ids'
                    ]);

                    flickrSearchData.url = this.getApiBaseUrl();
                    break;

                case "imagesByTags":
                    flickrSearchData = this.fillDataInObjectByList(flickrSearchData, _params, [
                        'lang', 'tags', 'tagmode'
                    ]);

                    flickrSearchData.url = this.getApiBaseUrl();
                    break;
            }

            return flickrSearchData;
        };
    });