/**
    @name: aping-plugin-openweathermap 
    @version: 0.8.0 (26-09-2016) 
    @author: Jonathan Hornung <jonathan.hornung@gmail.com> 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-openweathermap 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_openweathermap", ['jtt_openweathermap'])
    .directive('apingOpenweathermap', ['apingOpenWeatherMapHelper', 'apingUtilityHelper', 'openweathermapFactory', function (apingOpenWeatherMapHelper, apingUtilityHelper, openweathermapFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingOpenweathermap, apingOpenWeatherMapHelper.getThisPlatformString(), appSettings);
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
                        appid: apingUtilityHelper.getApiCredentials(apingOpenWeatherMapHelper.getThisPlatformString(), "api_key"),
                        lang: request.language || false,
                        units: request.units || "metric",
                    };
                    
                    if (request.units === 'kelvin') {
                        requestObject.units = undefined;
                    }

                    if (request.cityName) {
                        requestObject.q = request.cityName;
                        if (request.countryCode) {
                            requestObject.q += "," + request.countryCode;
                        }
                        if (request.type) {
                            requestObject.type = request.type;
                        }
                        
                        if(request.timeSlot === "forecast5") {
                            openweathermapFactory.getForecast5FromCitySearchByName(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        } else {
                            openweathermapFactory.getWeatherFromCitySearchByName(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        }
                    } else if (request.cityId) {
                        requestObject.id = request.cityId;
    
                        if(request.timeSlot === "forecast5") {
                            openweathermapFactory.getForecast5FromCityById(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        } else {
                            openweathermapFactory.getWeatherFromCityById(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        }
                    } else if (request.lat && request.lng) {
                        requestObject.lat = request.lat;
                        requestObject.lon = request.lng;
    
                        if(request.timeSlot === "forecast5") {
                            openweathermapFactory.getForecast5FromLocationByCoordinates(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        } else {
                            openweathermapFactory.getWeatherFromLocationByCoordinates(requestObject)
                                .then(function (_data) {
                                    apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                                });
                        }
                    } else if (request.zip) {
                        requestObject.zip = request.zip;
                        if (request.countryCode) {
                            requestObject.zip += "," + request.countryCode;
                        }
                        openweathermapFactory.getWeatherFromLocationByZipcode(requestObject)
                            .then(function (_data) {
                                apingController.concatToResults(apingOpenWeatherMapHelper.getObjectByJsonData(_data, helperObject));
                            });
                    }
                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_openweathermap")
    .service('apingOpenWeatherMapHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "openweathermap";
        };

        this.getThisPlatformLink = function () {
            return "https://openweathermap.org/";
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            
            var requestResults = [];

            if (_data && _data.data) {
                var _this = this;

                if (_data.data.constructor === Array) {
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
                } else {
                    
                    if (typeof _data.data.list !== "undefined"  && _data.data.list.constructor === Array) {
                        angular.forEach(_data.data.list, function (value, key) {
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
                    } else {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = _data.data;
                        } else {
                            tempResult = _this.getItemByJsonData(_data.data, _helperObject.model);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    }
                }
            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _model) {
            var returnObject = {};
            if (_item && _model) {
                switch (_model) {
                    case "weather":
                        returnObject = this.getWeatherItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getRainInfoFromObject = function (_rain) {

            var returnObject = {
                duration: undefined,
                volume: undefined,
            };

            if (typeof _rain === "object") {
                angular.forEach(_rain, function (value, key) {
                    returnObject.duration = key;
                    returnObject.volume = value;
                });
            }

            return returnObject;
        };

        this.getWeatherInfoFromArray = function (_weatherArray) {

            var returnObject = {
                code: undefined,
                caption: undefined,
                text: undefined,
                icon_name: undefined,
                icon_url: undefined,
            };

            if (_weatherArray.constructor === Array) {
                returnObject.code = _weatherArray[0].id || undefined;
                returnObject.caption = _weatherArray[0].main || undefined;
                returnObject.text = _weatherArray[0].description || undefined;
                returnObject.icon_name = _weatherArray[0].icon || undefined;
                returnObject.icon_url = _weatherArray[0].icon ? "https://openweathermap.org/img/w/" + _weatherArray[0].icon + ".png" : undefined;
            }

            return returnObject;
        };

        this.getWeatherItemByJsonData = function (_item) {
            var weatherObject = apingModels.getNew("weather", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(weatherObject, {
                //weather_code: undefined,
                //weather_caption: undefined, //rain
                //weather_text : undefined, //light rain
                //weather_icon_name: undefined,
                //weather_icon_url: undefined,

                temp: _item.main ? _item.main.temp : undefined,
                pressure: _item.main ? _item.main.pressure : undefined,
                humidity: _item.main ? _item.main.humidity : undefined,
                temp_min: _item.main ? _item.main.temp_min : undefined,
                temp_max: _item.main ? _item.main.temp_max : undefined,
                sea_level: _item.main ? _item.main.sea_level : undefined,
                grnd_level: _item.main ? _item.main.grnd_level : undefined,
                wind_speed: _item.wind ? _item.wind.speed : undefined,
                wind_deg: _item.wind ? _item.wind.deg : undefined,
                //rain_duration: undefined,
                //rain_volume: undefined,
                clouds: _item.clouds ? _item.clouds.all : undefined,

                sunrise_timestamp: _item.sys ? _item.sys.sunrise : undefined,
                sunrise_date_time: _item.sys ? new Date(_item.sys.sunrise) : undefined,
                sunset_timestamp: _item.sys ? _item.sys.sunset : undefined,
                sunset_date_time: _item.sys ? new Date(_item.sys.sunset) : undefined,

                loc_city: _item.name || undefined,
                loc_city_id: _item.id || undefined,
                loc_country: _item.sys ? _item.sys.country : undefined,
                loc_lat: _item.coord ? _item.coord.lat : undefined,
                loc_lng: _item.coord ? _item.coord.lon : undefined,
                //loc_zip : undefined,
            });
            
            if(_item.dt) {
                weatherObject.timestamp =_item.dt * 1000;
                weatherObject.date_time = new Date(weatherObject.timestamp);
            } else {
                weatherObject.timestamp = Date.now();
                weatherObject.date_time = new Date();
            }

            if (_item.rain) {
                var tempRainObject = this.getRainInfoFromObject(_item.rain);
                weatherObject.rain_duration = tempRainObject.duration || undefined;
                weatherObject.rain_volume = tempRainObject.volume || undefined;
            }

            if (_item.weather) {
                var tempWeatherObject = this.getWeatherInfoFromArray(_item.weather);
                weatherObject.weather_code = tempWeatherObject.code || undefined;
                weatherObject.weather_caption = tempWeatherObject.caption || undefined;
                weatherObject.weather_text = tempWeatherObject.text || undefined;
                weatherObject.weather_icon_name = tempWeatherObject.icon_name || undefined;
                weatherObject.weather_icon_url = tempWeatherObject.icon_url || undefined;
            }

            return weatherObject;
        };
    }]);;"use strict";

angular.module("jtt_openweathermap", [])
    .factory('openweathermapFactory', ['$http', 'openweathermapSearchDataService', function ($http, openweathermapSearchDataService) {

        var openweathermapFactory = {};

        openweathermapFactory.getWeatherFromCitySearchByName = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("citySearchByName", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getWeatherFromCityById = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("cityById", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getWeatherFromGroupOfCitiesById = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("citiesById", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getWeatherFromLocationByCoordinates = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("locationByCoordinates", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getWeatherFromLocationByZipcode = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("locationByZipcode", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getForecast5FromCitySearchByName = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("cityForecast5SearchByName", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getForecast5FromCityById = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("cityForecast5ById", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        openweathermapFactory.getForecast5FromLocationByCoordinates = function (_params) {
            var searchData = openweathermapSearchDataService.getNew("locationForecast5ByCoordinates", _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        return openweathermapFactory;
    }])
    .service('openweathermapSearchDataService', function () {
        this.getApiBaseUrl = function (_params) {
            return "http://api.openweathermap.org/data/2.5/";
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

            var openweathermapSearchData = {
                object: {
                    appid: _params.appid,
                },
                url: "",
            };

            switch (_type) {
                case "citySearchByName":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'q', 'lang', 'type', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "weather";
                    break;

                case "cityById":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'id', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "weather";
                    break;

                case "citiesById":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'id', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "group";
                    break;

                case "locationByCoordinates":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'lat', 'lon', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "weather";
                    break;

                case "locationByZipcode":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'zip', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "weather";
                    break;

                case "cityForecast5SearchByName":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'q', 'lang', 'type', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "forecast";
                    break;

                case "cityForecast5ById":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'id', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "forecast";
                    break;

                case "locationForecast5ByCoordinates":
                    openweathermapSearchData = this.fillDataInObjectByList(openweathermapSearchData, _params, [
                        'lat', 'lon', 'lang', "units",
                    ]);
                    openweathermapSearchData.url = this.getApiBaseUrl() + "forecast";
                    break;

            }
            return openweathermapSearchData;
        };
    });
