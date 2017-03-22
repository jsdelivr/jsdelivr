/**
    @name: aping-plugin-bandsintown 
    @version: 0.7.8 (28-01-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-bandsintown 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_bandsintown", ['jtt_bandsintown'])
    .directive('apingBandsintown', ['apingBandsintownHelper', 'apingUtilityHelper', 'bandsintownFactory', function (apingBandsintownHelper, apingUtilityHelper, bandsintownFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingBandsintown, apingBandsintownHelper.getThisPlattformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                        showAvatar: request.showAvatar || false,
                        artist: request.artist || undefined
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

                    //create requestObject for api request call
                    var requestObject = {
                        app_id: apingUtilityHelper.getApiCredentials(apingBandsintownHelper.getThisPlattformString(), "app_id") || 'apiNG',
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

                    if (request.artist) {

                        requestObject.artist = request.artist;

                        if (typeof request.artist_id !== "undefined") {
                            requestObject.artist_id = request.artist_id;
                        }

                        if (typeof request.date !== "undefined") {
                            requestObject.date = request.date;
                        }

                        if (typeof request.start_date !== "undefined" && typeof request.end_date !== "undefined") {
                            requestObject.date = request.start_date + "," + request.end_date;
                        }

                        if (typeof request.location !== "undefined"
                            || (typeof request.lat !== "undefined" && typeof request.lng !== "undefined" )
                            || typeof request.ip_address !== "undefined"
                        ) {
                            if (typeof request.location !== "undefined") {
                                requestObject.location = request.location;
                            } else if (typeof request.lat !== "undefined" && typeof request.lng !== "undefined") {
                                requestObject.location = request.lat + "," + request.lng;
                            } else {
                                requestObject.location = request.ip_address;
                            }

                            if (typeof request.distance !== "undefined") {
                                requestObject.radius = request.distance;
                            }

                            if (request.recommended === true || request.recommended === "true") {

                                if (typeof request.exclude !== "undefined") {
                                    requestObject.only_recs = request.exclude;
                                }

                                bandsintownFactory.getRecommendedEventsFromArtistByLocation(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingBandsintownHelper.getObjectByJsonData(_data, helperObject));
                                            return;
                                        }
                                    });
                            } else {
                                bandsintownFactory.getEventsFromArtistByLocation(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingBandsintownHelper.getObjectByJsonData(_data, helperObject));
                                            return;
                                        }
                                    });
                            }
                        } else {
                            bandsintownFactory.getEventsFromArtist(requestObject)
                                .then(function (_data) {
                                    if (_data) {
                                        apingController.concatToResults(apingBandsintownHelper.getObjectByJsonData(_data, helperObject));
                                    }
                                });
                        }
                    }
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_bandsintown")
    .service('apingBandsintownHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlattformString = function () {
            return "bandsintown";
        };

        this.getThisPlatformLink = function () {
            return "http://bandsintown.com/";
        };

        this.compareStrings = function (_string1, _string2) {
            return _string1.toLowerCase().trim().replace(/ /g, "") === _string2.toLowerCase().trim().replace(/ /g, "");

        };

        this.getArtistFromArray = function (_array, _artistName) {
            var returnObject = {
                artist_name: undefined,
                artist_id: undefined,
                artist_link: undefined,
                img_url: undefined,
            };
            var found = false;
            if (_array.length > 0) {
                var _this = this;
                angular.forEach(_array, function (value, key) {
                    if (typeof value.name !== "undefined" && !found) {
                        if (_this.compareStrings(value.name, _artistName)) {
                            returnObject = {
                                artist_name: value.name,
                                artist_id: value.mbid || undefined,
                                artist_link: value.website || value.facebook_tour_dates_url || undefined,
                                img_url: value.image_url || value.thumb_url || undefined,
                            };
                            found = true;
                        }
                    }
                });
                if (!found) {
                    returnObject = {
                        artist_name: _array[0].name,
                        artist_id: _array[0].mbid || undefined,
                        artist_link: _array[0].website || _array[0].facebook_tour_dates_url || undefined,
                        img_url: _array[0].image_url || _array[0].thumb_url || undefined,
                    };
                }
            }
            return returnObject;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data) {
                var _this = this;

                angular.forEach(_data.data, function (value, key) {

                    if (typeof _helperObject.items === "undefined" || (_helperObject.items > 0 && requestResults.length < _helperObject.items)) {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {
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
                    case "event":
                        returnObject = this.getEventItemByJsonData(_item, _helperObject);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getEventItemByJsonData = function (_item, _helperObject) {
            var eventObject = apingModels.getNew("event", this.getThisPlattformString());

            angular.extend(eventObject, {
                start_timestamp: _item.datetime ? new Date(_item.datetime).getTime() : undefined,
                start_date_time: _item.datetime ? new Date(_item.datetime) : undefined,
                event_url: _item.facebook_rsvp_url || undefined, //URL to the event
                ticket_url: _item.ticket_url || undefined, //URL to the ticket
                intern_id: _item.id || undefined, // INTERN ID of event
                caption: _item.title || undefined,
                source: _item.artists || undefined,
                sold_out: _item.ticket_status ? _item.ticket_status === "unavailable" : undefined,
            });

            if (_item.artists && _item.artists.length > 0) {
                var artistTempObject = this.getArtistFromArray(_item.artists, _helperObject.artist);

                if (typeof artistTempObject.artist_name !== "undefined") {
                    eventObject.artist_name = artistTempObject.artist_name;
                }
                if (typeof artistTempObject.artist_id !== "undefined") {
                    eventObject.artist_id = artistTempObject.artist_id;
                }
                if (typeof artistTempObject.artist_link !== "undefined") {
                    eventObject.artist_link = artistTempObject.artist_link;
                }
                if (typeof artistTempObject.img_url !== "undefined" && _helperObject.showAvatar) {
                    eventObject.img_url = artistTempObject.img_url;
                }
            }

            if (typeof _item.venue !== "undefined") {
                eventObject.place_name = _item.venue.name || undefined;
                eventObject.city = _item.venue.city || undefined;
                eventObject.country = _item.venue.country || undefined;
                eventObject.latitude = _item.venue.latitude || undefined;
                eventObject.longitude = _item.venue.longitude || undefined;
            }

            return eventObject;
        };
    }]);;"use strict";

angular.module("jtt_bandsintown", [])
    .factory('bandsintownFactory', ['$http', 'bandsintownSearchDataService', function ($http, bandsintownSearchDataService) {

        var bandsintownFactory = {};

        bandsintownFactory.getArtist = function (_params) {
            var bandsintownSearchData = bandsintownSearchDataService.getNew("artist", _params);

            return $http.jsonp(
                bandsintownSearchData.url,
                {
                    method: 'GET',
                    params: bandsintownSearchData.object,
                }
            );
        };

        bandsintownFactory.getEventsFromArtist = function (_params) {
            var bandsintownSearchData = bandsintownSearchDataService.getNew("eventsFromArtist", _params);

            return $http.jsonp(
                bandsintownSearchData.url,
                {
                    method: 'GET',
                    params: bandsintownSearchData.object,
                }
            );
        };

        bandsintownFactory.getEventsFromArtistByLocation = function (_params) {
            var bandsintownSearchData = bandsintownSearchDataService.getNew("eventsFromArtistByLocation", _params);

            return $http.jsonp(
                bandsintownSearchData.url,
                {
                    method: 'GET',
                    params: bandsintownSearchData.object,
                }
            );
        };

        bandsintownFactory.getRecommendedEventsFromArtistByLocation = function (_params) {
            var bandsintownSearchData = bandsintownSearchDataService.getNew("recommendedEventsFromArtistByLocation", _params);

            return $http.jsonp(
                bandsintownSearchData.url,
                {
                    method: 'GET',
                    params: bandsintownSearchData.object,
                }
            );
        };

        return bandsintownFactory;
    }])
    .service('bandsintownSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return 'http://api.bandsintown.com/';
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

            var bandsintownSearchData = {
                object: {
                    format:"json",
                    api_version: "2.0",
                    app_id:_params.app_id || "angular-bandsintown-api-factory",
                    callback: "JSON_CALLBACK",
                },
                url: "",
            };

            if (typeof _params.limit !== "undefined") {
                bandsintownSearchData.object.limit = _params.limit;
            }

            switch (_type) {

                case "artist":
                    bandsintownSearchData = this.fillDataInObjectByList(bandsintownSearchData, _params, [
                        'artist_id'
                    ]);


                    bandsintownSearchData.url = this.getApiBaseUrl()+"artists/"+_params.artist+".json";
                    break;

                case "eventsFromArtist":
                    bandsintownSearchData = this.fillDataInObjectByList(bandsintownSearchData, _params, [
                        'date', 'artist_id'
                    ]);

                    bandsintownSearchData.url = this.getApiBaseUrl()+"artists/"+_params.artist+"/events.json";
                    break;

                case "eventsFromArtistByLocation":
                    bandsintownSearchData = this.fillDataInObjectByList(bandsintownSearchData, _params, [
                        'date', 'artist_id', 'location', 'radius'
                    ]);

                    bandsintownSearchData.url = this.getApiBaseUrl()+"artists/"+_params.artist+"/events/search.json";
                    break;

                case "recommendedEventsFromArtistByLocation":
                    bandsintownSearchData = this.fillDataInObjectByList(bandsintownSearchData, _params, [
                        'date', 'artist_id', 'location', 'radius', 'only_recs'
                    ]);

                    bandsintownSearchData.url = this.getApiBaseUrl()+"artists/"+_params.artist+"/events/recommended";
                    break;
            }

            return bandsintownSearchData;
        };
    });