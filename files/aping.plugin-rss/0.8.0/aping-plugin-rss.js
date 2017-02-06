/**
    @name: aping-plugin-rss 
    @version: 0.8.0 (06-02-2017) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-rss#readme 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_rss", [])
    .directive('apingRss', ['apingRssHelper', 'apingUtilityHelper', 'jsonloaderFactory', function (apingRssHelper, apingUtilityHelper, jsonloaderFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingRss, apingRssHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };

                    if (angular.isDefined(appSettings.getNativeData)) {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    if (request.parseImage === "false" || request.parseImage === false) {
                        helperObject.parseImage = false;
                    } else {
                        helperObject.parseImage = true;
                    }

                    //create requestObject for api request call
                    var requestObject = {};

                    if (angular.isDefined(request.items)) {
                        helperObject.items = request.items;
                    } else {
                        helperObject.items = appSettings.items;
                    }

                    if (helperObject.items === 0 || helperObject.items === '0') {
                        return false;
                    }

                    if (request.protocol === "http" || request.protocol === "https") {
                        requestObject.protocol = request.protocol + "://";
                    } else if (appSettings.protocol === "http" || appSettings.protocol === "https") {
                        requestObject.protocol = appSettings.protocol + "://";
                    } else {
                        requestObject.protocol = "//";
                    }

                    if (request.path) {
                        requestObject.path = requestObject.protocol + 'api.rss2json.com/v1/api.json?rss_url=' + request.path
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.num < 0 || isNaN(requestObject.num)) {
                        requestObject.num = undefined;
                    }

                    jsonloaderFactory.getJsonData(requestObject)
                        .then(function (_data) {
                            if (_data) {
                                apingController.concatToResults(apingRssHelper.getObjectByJsonData(_data, helperObject));
                            }
                        });
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_rss")
    .service('apingRssHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "rss";
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data && _data.data && _data.data.items) {

                var _this = this;
                var tempResult;

                angular.forEach(_data.data.items, function (value, key) {
                    if (typeof _helperObject.items === "undefined" || requestResults.length < _helperObject.items) {
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {

                            value.blog_link = _data.data.feed.link || _data.data.feed.feedUrl || undefined;
                            value.blog_author = _data.data.feed.author || _data.data.feed.title || undefined;

                            tempResult = _this.getItemByJsonData(value, _helperObject);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    }
                });
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

                    case "native":
                    case "rss":
                        returnObject = _item;
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item, _helperObject) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(socialObject, {
                blog_name: _item.blog_author || undefined,
                blog_link: _item.blog_link || undefined,
                post_url: _item.link || undefined,
                source: (_item.categories && _item.categories.length > 0) ? _item.categories : undefined
            });

            if (_item.content) {
                socialObject.text = apingUtilityHelper.getTextFromHtml(_item.content);
                socialObject.caption = _item.title || undefined;
            } else {
                socialObject.text = _item.title || undefined;
            }

            if (_item.content && _helperObject.parseImage) {
                var imagesArray = apingUtilityHelper.getFirstImageFromHtml(_item.content);
                if (imagesArray && imagesArray.length > 1) {
                    socialObject.img_url = imagesArray[1];
                    socialObject.thumb_url = imagesArray[1];
                    socialObject.native_url = imagesArray[1];
                }
            }

            socialObject.date_time = _item.publishedDate ? new Date(_item.publishedDate) : undefined;
            socialObject.timestamp = socialObject.date_time ? socialObject.date_time.getTime() : undefined;

            return socialObject;
        };
    }]);