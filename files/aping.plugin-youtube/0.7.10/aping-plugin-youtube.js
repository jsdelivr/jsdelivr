/**
    @name: aping-plugin-youtube 
    @version: 0.7.10 (03-02-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-youtube 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_youtube", ['jtt_youtube'])
    .directive('apingYoutube', ['youtubeFactory', 'apingYoutubeHelper', 'apingUtilityHelper', function (youtubeFactory, apingYoutubeHelper, apingUtilityHelper) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingYoutube, apingYoutubeHelper.getThisPlatformString(), appSettings);

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
                        key: apingUtilityHelper.getApiCredentials(apingYoutubeHelper.getThisPlatformString(), "apiKey"),
                    };

                    if (typeof request.items !== "undefined") {
                        requestObject.maxResults = request.items;
                    } else {
                        requestObject.maxResults = appSettings.items;
                    }

                    if (requestObject.maxResults === 0 || requestObject.maxResults === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.maxResults < 0 || isNaN(requestObject.maxResults)) {
                        requestObject.maxResults = undefined;
                    }

                    // the api has a limit of 50 items per request
                    if (requestObject.maxResults > 50) {
                        requestObject.maxResults = 50;
                    }


                    if (request.videoId) {
                        requestObject.videoId = request.videoId;

                        youtubeFactory.getVideoById(requestObject)
                            .then(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });

                    } else if (request.channelId) { //search for channelID (and optional searchterm)

                        requestObject.channelId = request.channelId;
                        if (request.search) {
                            requestObject.q = request.search;
                        }

                        youtubeFactory.getVideosFromChannelById(requestObject)
                            .then(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });

                    } else if (request.search || (request.lat && request.lng)) { //search for searchterm and or location

                        if (request.order) {
                            requestObject.order = request.order;
                        }

                        if (request.search) {
                            requestObject.q = request.search;
                        }

                        if (request.lat && request.lng) {
                            requestObject.location = request.lat + "," + request.lng;
                        }

                        if (request.distance) {
                            requestObject.locationRadius = request.distance;
                        }

                        youtubeFactory.getVideosFromSearchByParams(requestObject)
                            .then(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });
                    } else if (request.playlistId) { //search for playlistId
                        requestObject.playlistId = request.playlistId;

                        youtubeFactory.getVideosFromPlaylistById(requestObject)
                            .then(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });
                    }
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_youtube").service('apingYoutubeHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlatformString = function () {
        return "youtube";
    };

    this.getThisPlatformLink = function () {
        return "https://www.youtube.com/";
    };

    this.convertYoutubeDurationToSeconds = function (duration) {
        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }

        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }

        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        return duration
    };

    this.getYoutubeIdFromUrl = function (_url) {
        var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        return _url.match(rx)[1] || false;
    };

    this.getYoutubeImageFromId = function (_youtubeId, size) {
        switch (size) {
            case 'default':
            case 'maxresdefault':
            case 'mqdefault':
            case 'sddefault':
                return "https://img.youtube.com/vi/" + _youtubeId + "/" + size + ".jpg";
                break;

            case 'hqdefault':
            default:
                return "https://img.youtube.com/vi/" + _youtubeId + "/hqdefault.jpg";
                break;
        }
    };

    this.getObjectByJsonData = function (_data, _helperObject) {
        var requestResults = [];
        if (_data && _data.data) {
            var _this = this;
            if (_data.data.items) {
                angular.forEach(_data.data.items, function (value, key) {
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
        var socialObject = apingModels.getNew("social", "youtube");
        angular.extend(socialObject, {
            blog_name: _item.snippet.channelTitle || undefined,
            blog_id: _item.snippet.channelId || undefined,
            blog_link: this.getThisPlatformLink() + "channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || ((_item.snippet.resourceId && _item.snippet.resourceId.videoId) ? _item.snippet.resourceId.videoId : _item.id),
            timestamp: apingTimeHelper.getTimestampFromDateString(_item.snippet.publishedAt, 1000, 7200),
        });
        socialObject.date_time = new Date(socialObject.timestamp);
        if (_item.snippet.title !== "" && _item.snippet.description !== "") {
            socialObject.caption = _item.snippet.title;
            socialObject.text = _item.snippet.description;
        } else {
            if (_item.snippet.title !== "") {
                socialObject.caption = _item.snippet.title;
            } else {
                socialObject.caption = _item.snippet.description;
            }
        }
        if (_item.id.kind == "youtube#video") {
            socialObject.type = "video";
        } else if (_item.kind == "youtube#playlistItem" && _item.snippet.resourceId && _item.snippet.resourceId.kind == "youtube#video") {
            socialObject.type = "video";
            socialObject.position = _item.snippet.position;
        }

        socialObject.source = '<iframe width="1280" height="720" src="https://www.youtube.com/embed/' + socialObject.intern_id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

        socialObject.img_url = this.getYoutubeImageFromId(socialObject.intern_id);
        socialObject.thumb_url = this.getYoutubeImageFromId(socialObject.intern_id, 'default');
        socialObject.native_url = this.getYoutubeImageFromId(socialObject.intern_id);
        socialObject.post_url = this.getThisPlatformLink() + "watch?v=" + socialObject.intern_id;

        if (_item.statistics) {
            if (_item.statistics.commentCount && _item.statistics.commentCount > 0) {
                socialObject.comments = _item.statistics.commentCount;
            }

            if (_item.statistics.likeCount && _item.statistics.likeCount > 0) {
                socialObject.likes = _item.statistics.likeCount;
            }
        }

        return socialObject;
    };

    this.getVideoItemByJsonData = function (_item) {
        var videoObject = apingModels.getNew("video", "youtube");
        angular.extend(videoObject, {
            blog_name: _item.snippet.channelTitle || undefined,
            blog_id: _item.snippet.channelId || undefined,
            blog_link: this.getThisPlatformLink() + "channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || ((_item.snippet.resourceId && _item.snippet.resourceId.videoId) ? _item.snippet.resourceId.videoId : _item.id),
            timestamp: apingTimeHelper.getTimestampFromDateString(_item.snippet.publishedAt, 1000, 7200),
        });
        videoObject.date_time = new Date(videoObject.timestamp);
        if (_item.snippet.title !== "" && _item.snippet.description !== "") {
            videoObject.caption = _item.snippet.title;
            videoObject.text = _item.snippet.description;
        } else {
            if (_item.snippet.title !== "") {
                videoObject.caption = _item.snippet.title;
            } else {
                videoObject.caption = _item.snippet.description;
            }
        }
        videoObject.img_url = this.getYoutubeImageFromId(videoObject.intern_id);
        videoObject.thumb_url = this.getYoutubeImageFromId(videoObject.intern_id, 'default');
        videoObject.native_url = this.getYoutubeImageFromId(videoObject.intern_id);
        videoObject.post_url = this.getThisPlatformLink() + "watch?v=" + videoObject.intern_id;
        videoObject.position = _item.snippet.position;
        videoObject.markup = '<iframe width="1280" height="720" src="https://www.youtube.com/embed/' + videoObject.intern_id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

        if (_item.statistics) {
            if (_item.statistics.commentCount && _item.statistics.commentCount > 0) {
                videoObject.comments = _item.statistics.commentCount;
            }

            if (_item.statistics.likeCount && _item.statistics.likeCount > 0) {
                videoObject.likes = _item.statistics.likeCount;
            }
        }

        if (_item.contentDetails && _item.contentDetails.duration) {
            videoObject.duration = this.convertYoutubeDurationToSeconds(_item.contentDetails.duration);
        }

        return videoObject;
    };
}]);;"use strict";

angular.module("jtt_youtube", [])
    .factory('youtubeFactory', ['$http', 'youtubeSearchDataService', function ($http, youtubeSearchDataService) {

        var youtubeFactory = {};

        youtubeFactory.getVideosFromChannelById = function (_params) {

            var youtubeSearchData = youtubeSearchDataService.getNew("videosFromChannelById", _params);

            return $http({
                method: 'GET',
                url: youtubeSearchData.url,
                params: youtubeSearchData.object,
            });
        };

        youtubeFactory.getVideosFromSearchByParams = function (_params) {

            var youtubeSearchData = youtubeSearchDataService.getNew("videosFromSearchByParams", _params);

            return $http({
                method: 'GET',
                url: youtubeSearchData.url,
                params: youtubeSearchData.object,
            });
        };

        youtubeFactory.getVideosFromPlaylistById = function (_params) {

            var youtubeSearchData = youtubeSearchDataService.getNew("videosFromPlaylistById", _params);

            return $http({
                method: 'GET',
                url: youtubeSearchData.url,
                params: youtubeSearchData.object,
            });
        };

        youtubeFactory.getChannelById = function (_params) {

            var youtubeSearchData = youtubeSearchDataService.getNew("channelById", _params);

            return $http({
                method: 'GET',
                url: youtubeSearchData.url,
                params: youtubeSearchData.object,
            });
        };

        youtubeFactory.getVideoById = function (_params) {

            var youtubeSearchData = youtubeSearchDataService.getNew("videoById", _params);

            return $http({
                method: 'GET',
                url: youtubeSearchData.url,
                params: youtubeSearchData.object,
            });
        };

        return youtubeFactory;
    }])
    .service('youtubeSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "https://content.googleapis.com/youtube/v3/";
        };

        this.getNew = function (_type, _params) {

            var youtubeSearchData = {
                object: {
                    key: _params.key,
                },
                url: "",
            };

            if (angular.isDefined(_params.part)) {
                youtubeSearchData.object.part = _params.part;
            }

            switch (_type) {
                case "videosFromChannelById":
                    if (angular.isUndefined(_params.part)) {
                        youtubeSearchData.object.part = "id,snippet";
                    }
                    youtubeSearchData.object.type = "video";
                    youtubeSearchData.object.channelId = _params.channelId;

                    if (angular.isDefined(_params.order)) {
                        youtubeSearchData.object.order = _params.order;
                    } else {
                        youtubeSearchData.object.order = "date";
                    }
                    if (angular.isDefined(_params.q)) {
                        youtubeSearchData.object.q = _params.q;
                    }
                    if (angular.isDefined(_params.maxResults)) {
                        youtubeSearchData.object.maxResults = _params.maxResults;
                    }
                    if (angular.isDefined(_params.publishedAfter)) {
                        youtubeSearchData.object.publishedAfter = _params.publishedAfter;
                    }
                    if (angular.isDefined(_params.publishedBefore)) {
                        youtubeSearchData.object.publishedBefore = _params.publishedBefore;
                    }
                    if (angular.isDefined(_params.regionCode)) {
                        youtubeSearchData.object.regionCode = _params.regionCode;
                    }
                    if (angular.isDefined(_params.relevanceLanguage)) {
                        youtubeSearchData.object.relevanceLanguage = _params.relevanceLanguage;
                    }
                    if (angular.isDefined(_params.safeSearch)) {
                        youtubeSearchData.object.safeSearch = _params.safeSearch;
                    }
                    if (angular.isDefined(_params.videoEmbeddable)) {
                        youtubeSearchData.object.videoEmbeddable = _params.videoEmbeddable;
                    } else {
                        youtubeSearchData.object.videoEmbeddable = true;
                    }
                    if (angular.isDefined(_params.videoLicense)) {
                        youtubeSearchData.object.videoLicense = _params.videoLicense;
                    }
                    if (angular.isDefined(_params.videoSyndicated)) {
                        youtubeSearchData.object.videoSyndicated = _params.videoSyndicated;
                    }
                    if (angular.isDefined(_params.fields)) {
                        youtubeSearchData.object.fields = _params.fields;
                    }

                    youtubeSearchData.url = this.getApiBaseUrl() + "search?";

                    if (angular.isDefined(_params.nextPageToken)) {
                        youtubeSearchData.url += "pageToken=" + _params.nextPageToken + "&";
                    }
                    break;

                case "videosFromSearchByParams":
                    if (angular.isUndefined(_params.part)) {
                        youtubeSearchData.object.part = "id,snippet";
                    }
                    youtubeSearchData.object.type = "video";
                    if (angular.isDefined(_params.order)) {
                        youtubeSearchData.object.order = _params.order;
                    } else {
                        youtubeSearchData.object.order = "date";
                    }
                    if (angular.isDefined(_params.q)) {
                        youtubeSearchData.object.q = _params.q;
                    }
                    if (angular.isDefined(_params.location)) {
                        youtubeSearchData.object.location = _params.location;
                    }
                    if (angular.isDefined(_params.locationRadius)) {
                        youtubeSearchData.object.locationRadius = _params.locationRadius;
                    } else {
                        if (angular.isDefined(_params.location)) {
                            youtubeSearchData.object.locationRadius = "5000m"
                        }
                    }
                    if (angular.isDefined(_params.maxResults)) {
                        youtubeSearchData.object.maxResults = _params.maxResults;
                    }
                    if (angular.isDefined(_params.publishedAfter)) {
                        youtubeSearchData.object.publishedAfter = _params.publishedAfter;
                    }
                    if (angular.isDefined(_params.publishedBefore)) {
                        youtubeSearchData.object.publishedBefore = _params.publishedBefore;
                    }
                    if (angular.isDefined(_params.regionCode)) {
                        youtubeSearchData.object.regionCode = _params.regionCode;
                    }
                    if (angular.isDefined(_params.relevanceLanguage)) {
                        youtubeSearchData.object.relevanceLanguage = _params.relevanceLanguage;
                    }
                    if (angular.isDefined(_params.safeSearch)) {
                        youtubeSearchData.object.safeSearch = _params.safeSearch;
                    }
                    if (angular.isDefined(_params.videoEmbeddable)) {
                        youtubeSearchData.object.videoEmbeddable = _params.videoEmbeddable;
                    } else {
                        youtubeSearchData.object.videoEmbeddable = true;
                    }
                    if (angular.isDefined(_params.videoLicense)) {
                        youtubeSearchData.object.videoLicense = _params.videoLicense;
                    }
                    if (angular.isDefined(_params.videoSyndicated)) {
                        youtubeSearchData.object.videoSyndicated = _params.videoSyndicated;
                    }
                    if (angular.isDefined(_params.fields)) {
                        youtubeSearchData.object.fields = _params.fields;
                    }

                    youtubeSearchData.url = this.getApiBaseUrl() + "search?";
                    if (angular.isDefined(_params.nextPageToken)) {
                        youtubeSearchData.url += "pageToken=" + _params.nextPageToken + "&";
                    }
                    break;

                case "videosFromPlaylistById":
                    if (angular.isUndefined(_params.part)) {
                        youtubeSearchData.object.part = "id,snippet";
                    }
                    youtubeSearchData.object.playlistId = _params.playlistId;
                    youtubeSearchData.object.type = "video";

                    if (angular.isDefined(_params.maxResults)) {
                        youtubeSearchData.object.maxResults = _params.maxResults;
                    }

                    youtubeSearchData.url = this.getApiBaseUrl() + "playlistItems?";
                    if (angular.isDefined(_params.nextPageToken)) {
                        youtubeSearchData.url += "pageToken=" + _params.nextPageToken + "&";
                    }
                    break;

                case "videoById":
                    if (angular.isUndefined(_params.part)) {
                        youtubeSearchData.object.part = "id,snippet,contentDetails,statistics";
                    }
                    youtubeSearchData.object.id = _params.videoId;

                    youtubeSearchData.url = this.getApiBaseUrl() + "videos?";
                    if (angular.isDefined(_params.nextPageToken)) {
                        youtubeSearchData.url += "pageToken=" + _params.nextPageToken + "&";
                    }
                    break;

                case "channelById":
                    if (angular.isUndefined(_params.part)) {
                        youtubeSearchData.object.part = "id,snippet";
                    }
                    youtubeSearchData.object.type = "channel";

                    youtubeSearchData.url = this.getApiBaseUrl() + "search?";
                    if (angular.isDefined(_params.nextPageToken)) {
                        youtubeSearchData.url += "pageToken=" + _params.nextPageToken + "&";
                    }
                    break;
            }

            return youtubeSearchData;
        };
    });