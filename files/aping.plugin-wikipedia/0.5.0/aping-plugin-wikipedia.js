/**
    @name: aping-plugin-wikipedia 
    @version: 0.5.0 (20-06-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-wikipedia 
    @license: MIT
*/
"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-wikipedia
 @licence MIT
 */

angular.module("jtt_aping_wikipedia", ['jtt_wikipedia'])
    .directive('apingWikipedia', ['apingWikipediaHelper', 'apingUtilityHelper', 'wikipediaFactory', function (apingWikipediaHelper, apingUtilityHelper, wikipediaFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingWikipedia, apingWikipediaHelper.getThisPlatformString(), appSettings);

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

                    //create requestObject for api request call

                    var requestObject = {
                        pithumbsize: 700,
                    };

                    if (angular.isDefined(request.items)) {
                        requestObject.gsrlimit = request.items;
                    } else {
                        requestObject.gsrlimit = appSettings.items;
                    }

                    if (requestObject.gsrlimit === 0 || requestObject.gsrlimit === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.gsrlimit < 0 || isNaN(requestObject.gsrlimit)) {
                        requestObject.gsrlimit = undefined;
                    }

                    // the api has a limit of 500 items per request
                    if (requestObject.gsrlimit > 500) {
                        requestObject.gsrlimit = 500;
                    }

                    if (angular.isDefined(request.language)) {
                        requestObject.lang = request.language;
                    }

                    if (angular.isDefined(request.title)) {
                        requestObject.term = request.title;
                        wikipediaFactory.getArticle(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingWikipediaHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    } else if (angular.isDefined(request.search)) {
                        requestObject.term = request.search;

                        if (angular.isDefined(request.textSearch) && (request.textSearch === 'true' || request.textSearch === true)) {
                            wikipediaFactory.searchArticles(requestObject)
                                .then(function (_data) {
                                    if (_data) {
                                        apingController.concatToResults(apingWikipediaHelper.getObjectByJsonData(_data, helperObject));
                                    }
                                });
                        } else {
                            wikipediaFactory.searchArticlesByTitle(requestObject)
                                .then(function (_data) {
                                    if (_data) {
                                        apingController.concatToResults(apingWikipediaHelper.getObjectByJsonData(_data, helperObject));
                                    }
                                });
                        }
                    }
                });
            }
        }
    }]);;"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-wikipedia
 @licence MIT
 */

angular.module("jtt_aping_wikipedia")
    .service('apingWikipediaHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "wikipedia";
        };

        this.getThisPlatformLink = function (_lang) {
            return 'https://'+_lang+'.wikipedia.org/wiki/';
        };

        this.getObjectByJsonData = function (_data, _helperObject) {

            var requestResults = [];
            if (_data && _data.data && _data.data.query && _data.data.query.pages) {
                var _this = this;

                if (_data.data.query.pages) {

                    angular.forEach(_data.data.query.pages, function (value, key) {
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
                    /*
                    case "image":
                        returnObject = this.getImageItemByJsonData(_item);
                        break;
                    */
                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(socialObject, {
                //blog_name: undefined,
                //blog_id: undefined,
                //blog_link: undefined,
                //type: undefined,
                timestamp: apingTimeHelper.getTimestampFromDateString(_item.touched, 1000, 3600 * 1000),
                post_url: _item.pagelanguage ? this.getThisPlatformLink(_item.pagelanguage) + encodeURI(_item.title) : undefined,
                intern_id: _item.pageid,
                text: apingUtilityHelper.getTextFromHtml(_item.extract),
                caption: _item.title,
                img_url: _item.thumbnail ? _item.thumbnail.source : undefined,
                thumb_url: _item.thumbnail ? _item.thumbnail.source : undefined,
                native_url: _item.thumbnail ? _item.thumbnail.source : undefined,
                source: _item.extract,
                //likes: undefined,
                //shares: undefined,
                //comments: undefined,
                position: _item.index
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            return socialObject;
        };

        /*
        this.getImageItemByJsonData = function (_item) {
            var imageObject = apingModels.getNew("image", this.getThisPlatformString());

            //fill _item in imageObject
            angular.extend(imageObject, {
                blog_name: undefined, //NAME of blog (channel / youtube uploader / facebook page, instagram account, ..)
                blog_id: undefined, //ID of channel / page / account, ...
                blog_link: undefined, //link to channel / uploader / page / account, ...
                timestamp: undefined,
                date_time: undefined,
                post_url: undefined, //URL to the  image ...
                intern_id: undefined, // INTERN ID of image (facebook id, instagram id, ...)
                text: undefined,
                caption: undefined,
                thumb_url: undefined, // best case 200px
                thumb_width: undefined,
                thumb_height: undefined,
                img_url: undefined, // best case 700px
                img_width: undefined,
                img_height: undefined,
                native_url: undefined,
                native_width: undefined,
                native_height: undefined,
                source: undefined,
                likes: undefined,
                shares: undefined,
                comments: undefined,
                position: undefined,
            });

            imageObject.date_time = new Date(imageObject.timestamp);

            return imageObject;
        };
        */
    }]);;"use strict";

angular.module("jtt_wikipedia", [])
    .factory('wikipediaFactory', ['$http', 'wikipediaSearchDataService', function ($http, wikipediaSearchDataService) {

        var wikipediaFactory = {};

        wikipediaFactory.searchArticlesByTitle = function (_params) {

            var wikipediaSearchData = wikipediaSearchDataService.getNew("searchArticlesByTitle", _params);

            return $http.jsonp(
                wikipediaSearchData.url,
                {
                    method: 'GET',
                    params: wikipediaSearchData.object,
                }
            );
        };

        wikipediaFactory.searchArticles = function (_params) {

            var wikipediaSearchData = wikipediaSearchDataService.getNew("searchArticles", _params);

            return $http.jsonp(
                wikipediaSearchData.url,
                {
                    method: 'GET',
                    params: wikipediaSearchData.object,
                }
            );
        };

        wikipediaFactory.getArticle = function (_params) {

            var wikipediaSearchData = wikipediaSearchDataService.getNew("getArticle", _params);

            return $http.jsonp(
                wikipediaSearchData.url,
                {
                    method: 'GET',
                    params: wikipediaSearchData.object,
                }
            );
        };

        return wikipediaFactory;
    }])
    .service('wikipediaSearchDataService', function () {
        this.getApiBaseUrl = function (_lang) {
            return 'https://' + _lang + ".wikipedia.org/w/api.php";
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

            var wikipediaSearchData = {
                object: {
                    callback: "JSON_CALLBACK",
                    action: 'query',
                    format: 'json',
                    formatversion: 2,
                },
                url: "",
            };

            if (angular.isUndefined(_params.lang)) {
                _params.lang = 'en'
            }

            if (angular.isUndefined(_params.pithumbsize)) {
                _params.pithumbsize = '400'
            }

            switch (_type) {
                case "searchArticlesByTitle":
                    wikipediaSearchData.object.prop = 'extracts|pageimages|info';
                    wikipediaSearchData.object.generator = 'search';
                    wikipediaSearchData.object.gsrsearch = 'intitle:' + _params.term;
                    wikipediaSearchData.object.pilimit = 'max';
                    wikipediaSearchData.object.exlimit = 'max';
                    wikipediaSearchData.object.exintro = '';

                    wikipediaSearchData = this.fillDataInObjectByList(wikipediaSearchData, _params, [
                        'prop', 'generator', 'gsrsearch', 'pilimit', 'exlimit', 'exintro', 'rvparse', 'formatversion', 'prop', 'pithumbsize', 'gsrlimit'
                    ]);
                    wikipediaSearchData.url = this.getApiBaseUrl(_params.lang);
                    break;

                case "searchArticles":
                    wikipediaSearchData.object.prop = 'extracts|pageimages|info';
                    wikipediaSearchData.object.generator = 'search';
                    wikipediaSearchData.object.gsrsearch = _params.term;
                    wikipediaSearchData.object.pilimit = 'max';
                    wikipediaSearchData.object.exlimit = 'max';
                    wikipediaSearchData.object.exintro = '';

                    wikipediaSearchData = this.fillDataInObjectByList(wikipediaSearchData, _params, [
                        'prop', 'generator', 'gsrsearch', 'pilimit', 'exlimit', 'exintro', 'rvparse', 'formatversion', 'prop', 'pithumbsize', 'gsrlimit'
                    ]);
                    wikipediaSearchData.url = this.getApiBaseUrl(_params.lang);
                    break;

                case "getArticle":
                    wikipediaSearchData.object.prop = 'extracts|pageimages|images|info';
                    wikipediaSearchData.object.titles = _params.term;

                    wikipediaSearchData = this.fillDataInObjectByList(wikipediaSearchData, _params, [
                        'prop', 'rvparse', 'formatversion', 'prop', 'pithumbsize'
                    ]);
                    wikipediaSearchData.url = this.getApiBaseUrl(_params.lang);
                    break;
            }
            return wikipediaSearchData;
        };
    });