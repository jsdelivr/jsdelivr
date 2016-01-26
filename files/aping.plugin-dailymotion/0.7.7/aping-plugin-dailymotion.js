/**
    @name: aping-plugin-dailymotion 
    @version: 0.7.7 (24-01-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-dailymotion#readme 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_dailymotion", ['jtt_dailymotion'])
    .directive('apingDailymotion', ['apingDailymotionHelper', 'apingUtilityHelper', 'dailymotionFactory', function (apingDailymotionHelper, apingUtilityHelper, dailymotionFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingDailymotion, apingDailymotionHelper.getThisPlattformString(), appSettings);

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

                    if (request.protocol === "http" || request.protocol === "https") {
                        helperObject.protocol = request.protocol + "://";
                    }


                    //create requestObject for api request call
                    var requestObject = {};

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

                    if (typeof request.search !== "undefined") {
                        requestObject.search = request.search;
                    }

                    if (typeof request.tags !== "undefined") {
                        requestObject.tags = request.tags;
                    }

                    if (request.userId) {

                        requestObject.id = request.userId;
                        requestObject.sort = 'recent';

                        if (typeof request.channelId !== "undefined") {
                            requestObject.channel = request.channelId;
                        }

                        dailymotionFactory.getVideosFromUserById(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingDailymotionHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    } else if (request.channelId) {

                        requestObject.id = request.channelId;
                        requestObject.sort = 'recent';

                        dailymotionFactory.getVideosFromChannelById(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingDailymotionHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    } else if (request.playlistId) {

                        requestObject.id = request.playlistId;
                        requestObject.sort = 'recent';

                        dailymotionFactory.getVideosFromPlaylistById(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingDailymotionHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    } else {

                        if (typeof request.genre !== "undefined") {
                            requestObject.genre = request.genre;
                        }

                        if (typeof request.country !== "undefined") {
                            requestObject.country = request.country;
                        }

                        if (typeof request.language !== "undefined") {
                            requestObject.detected_language = request.language;
                        }

                        dailymotionFactory.getVideosByParams(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingDailymotionHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    }

                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_dailymotion")
    .service('apingDailymotionHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlattformString = function () {
            return "dailymotion";
        };

        this.getThisPlatformLink = function () {
            return "https://dailymotion.com/";
        };

        this.getObjectByJsonData = function (_data, _helperObject) {

            var requestResults = [];
            if (_data) {

                var _this = this;

                if (_data) {

                    angular.forEach(_data.data.list, function (value, key) {
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
                        returnObject = this.getSocialItemByJsonData(_item);
                        break;
                    case "video":
                        returnObject = this.getVideoItemByJsonData(_item, _helperObject);
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
                "blog_name": _item['owner.screenname'] || undefined,
                "blog_id": _item['owner.id'] || undefined,
                "blog_link": _item['owner.url'] || undefined,
                "type": _item.item_type || _item.media_type || undefined,
                "timestamp": _item.created_time * 1000,
                "source": _item.embed_html || undefined,
                "post_url": _item.url,
                "intern_id": _item.id,
                "text": apingUtilityHelper.getTextFromHtml(_item.description),
                "caption": _item.title,
                "img_url": _item.thumbnail_url,
                "likes": _item.bookmarks_total,
                "comments": _item.comments_total,
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            return socialObject;
        };

        this.getVideoItemByJsonData = function (_item, _helperObject) {
            var videoObject = apingModels.getNew("video", this.getThisPlattformString());

            $.extend(true, videoObject, {
                blog_name: _item['owner.screenname'] || undefined,
                blog_id: _item['owner.id'] || undefined,
                blog_link: _item['owner.url'] || undefined,
                type: _item.item_type || _item.media_type || undefined,
                timestamp: _item.created_time * 1000,
                markup: _item.embed_html || undefined,
                post_url: _item.url,
                intern_id: _item.id,
                text: apingUtilityHelper.getTextFromHtml(_item.description),
                caption: _item.title,
                img_url: _item.thumbnail_url,
                likes: _item.bookmarks_total,
                comments: _item.comments_total,
                duration: _item.duration, // in seconds
            });

            if(_helperObject.protocol) {
                videoObject.markup = videoObject.markup.replace('src=\"//', 'src=\"'+_helperObject.protocol);
            }

            videoObject.date_time = new Date(videoObject.timestamp);

            return videoObject;
        };
    }]);;"use strict";

angular.module("jtt_dailymotion", [])
    .factory('dailymotionFactory', ['$http', 'dailymotionSearchDataService', function ($http, dailymotionSearchDataService) {

        var dailymotionFactory = {};

        dailymotionFactory.getVideosFromUserById = function (_params) {

            if(!_params.id) {
                return false;
            }

            var searchData = dailymotionSearchDataService.getNew("videosFromUserById", _params);
            //https://developer.dailymotion.com/tools/apiexplorer#/reverse/user/videos/list
            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        dailymotionFactory.getVideosFromChannelById = function (_params) {

            if(!_params.id) {
                return false;
            }

            var searchData = dailymotionSearchDataService.getNew("videosFromChannelById", _params);
            //https://developer.dailymotion.com/tools/apiexplorer#/channel/videos/list
                return $http({
                        method: 'GET',
                        url: searchData.url,
                        params: searchData.object,
                    }
                );
        };

        dailymotionFactory.getVideosFromPlaylistById = function (_params) {

            if(!_params.id) {
                return false;
            }

            var searchData = dailymotionSearchDataService.getNew("videosFromPlaylistById", _params);
            //https://developer.dailymotion.com/tools/apiexplorer#/playlist/videos/list
            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        dailymotionFactory.getVideosByParams = function (_params) {
            //https://developer.dailymotion.com/tools/apiexplorer#/video/list
            var searchData = dailymotionSearchDataService.getNew("videosByParams", _params);

            return $http({
                    method: 'GET',
                    url: searchData.url,
                    params: searchData.object,
                }
            );
        };

        return dailymotionFactory;
    }])
    .service('dailymotionSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "https://api.dailymotion.com/";
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

            var dailymotionSearchData = {
                object: {},
                url: "",
            };

            switch (_type) {

                case "videosFromUserById":
                    dailymotionSearchData.object.fields = 'bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_url,title,updated_time,url,';

                    dailymotionSearchData = this.fillDataInObjectByList(dailymotionSearchData, _params, [
                        'fields', 'channel', 'created_after', 'created_before', 'genre', 'nogenre', 'page', 'limit', 'search', 'tags'
                    ]);

                    dailymotionSearchData.url = this.getApiBaseUrl() + "user/" + _params.id + "/videos";
                    break;

                case "videosFromChannelById":
                    dailymotionSearchData.object.fields = 'bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_url,title,updated_time,url,';

                    dailymotionSearchData = this.fillDataInObjectByList(dailymotionSearchData, _params, [
                        'fields', 'channel', 'created_after', 'created_before', 'search', 'sort', 'tags', 'page', 'limit',
                    ]);

                    dailymotionSearchData.url = this.getApiBaseUrl() + "channel/" + _params.id + "/videos";
                    break;

                case "videosFromPlaylistById":
                    dailymotionSearchData.object.fields = 'bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_url,title,updated_time,url,';

                    dailymotionSearchData = this.fillDataInObjectByList(dailymotionSearchData, _params, [
                        'fields', 'search', 'sort', 'tags', 'page', 'limit',
                    ]);

                    dailymotionSearchData.url = this.getApiBaseUrl() + "playlist/" + _params.id + "/videos";
                    break;

                case "videosByParams":
                    dailymotionSearchData.object.fields = 'bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_url,title,updated_time,url,';

                    dailymotionSearchData = this.fillDataInObjectByList(dailymotionSearchData, _params, [
                        'fields', 'channel', 'country', 'created_after', 'created_before', 'detected_language', 'exclude_ids', 'featured', 'genre', 'has_game', 'hd', 'ids', 'in_history', 'languages', 'list', 'live', 'live_offair', 'live_onair', 'live_upcoming', 'longer_than', 'no_live', 'no_premium', 'nogenre', 'owners', 'partner', 'poster', 'premium', 'private', 'search', 'shorter_than', 'sort', 'svod', 'tags', 'tvod', 'ugc', 'verified', 'page', 'limit'
                    ]);

                    dailymotionSearchData.url = this.getApiBaseUrl() + "videos";
                    break;
            }

            return dailymotionSearchData;
        };
    });