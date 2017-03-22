/**
    @name: aping-plugin-rss 
    @version: 0.7.7 (20-01-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-rss#readme 
    @license: MIT
*/
"use strict";

var jjtApingRss = angular.module("jtt_aping_rss", [])
    .directive('apingRss', ['apingRssHelper', 'apingUtilityHelper', 'rssFactory', function (apingRssHelper, apingUtilityHelper, rssFactory) {
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
                    if(typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    if(request.parseImage === "false" || request.parseImage === false) {
                        helperObject.parseImage = false;
                    } else {
                        helperObject.parseImage = true;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        v:"1.0",
                        callback: "JSON_CALLBACK",
                    };

                    if(typeof request.items !== "undefined") {
                        requestObject.num = request.items;
                    } else {
                        requestObject.num = appSettings.items;
                    }

                    if (requestObject.num === 0 || requestObject.num === '0') {
                        return false;
                    }

                    if(request.path) {
                        requestObject.q = request.path;
                    }

                    if(request.protocol === "http" || request.protocol === "https") {
                        requestObject.protocol = request.protocol+"://";
                    } else {
                        requestObject.protocol = "//";
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.num < 0 || isNaN(requestObject.num)) {
                        requestObject.num = undefined;
                    }

                    //get _data for each request
                    rssFactory.getData(requestObject)
                        .then(function (_data) {
                            if (_data) {
                                apingController.concatToResults(apingRssHelper.getObjectByJsonData(_data, helperObject));
                            }
                        });
                });
            }
        }
    }]);;"use strict";

jjtApingRss.factory('rssFactory', ['$http', function ($http) {
    var rssFactory = {};
    rssFactory.getData = function (_requestObject) {

        var url = _requestObject.protocol + 'ajax.googleapis.com/ajax/services/feed/load';
        _requestObject.protocol = undefined;

        return $http.jsonp(
            url,
            {
                method: 'GET',
                params: _requestObject
            }
        );
    };
    return rssFactory;
}]);;"use strict";

jjtApingRss.service('apingRssHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlatformString = function () {
        return "rss";
    };

    this.getObjectByJsonData = function (_data, _helperObject) {
        var requestResults = [];
        if (_data && _data.data && _data.data.responseData) {
            if (_data.data.responseData.feed && _data.data.responseData.feed.entries) {

                var _this = this;

                angular.forEach(_data.data.responseData.feed.entries, function (value, key) {
                    var tempResult;
                    if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = value;
                    } else {

                        value.blog_link = _data.data.responseData.feed.link || _data.data.responseData.feed.feedUrl || undefined;
                        value.blog_author = _data.data.responseData.feed.author || _data.data.responseData.feed.title || undefined;

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
        $.extend(true, socialObject, {
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
            }
        }

        socialObject.date_time = _item.publishedDate ? new Date(_item.publishedDate) : undefined;
        socialObject.timestamp = socialObject.date_time ? socialObject.date_time.getTime() : undefined;

        return socialObject;
    };

}]);