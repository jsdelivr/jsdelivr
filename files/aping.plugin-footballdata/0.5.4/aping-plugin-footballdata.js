/**
    @name: aping-plugin-footballdata 
    @version: 0.5.4 (25-06-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-footballdata 
    @license: MIT
*/
"use strict";

angular.module("jtt_aping_footballdata", ['jtt_footballdata'])
    .directive('apingFootballdata', ['apingFootballDataHelper', 'apingUtilityHelper', 'footballdataFactory', function (apingFootballDataHelper, apingUtilityHelper, footballdataFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();
                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingFootballdata, apingFootballDataHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };

                    if(angular.isDefined(appSettings.getNativeData)) {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }
                    //create requestObject for api request call

                    var requestObject = {
                        apiKey: apingUtilityHelper.getApiCredentials(apingFootballDataHelper.getThisPlatformString(), "api_key"),
                    };

                    if(angular.isDefined(request.items)) {
                        if (request.items === 0 || request.items === '0') {
                            return false;
                        }

                        // -1 is "no explicit limit". same for NaN value
                        if(request.items < 0 || isNaN(request.items)) {
                            request.items = undefined;
                        }
                    }

                    switch(helperObject.model) {
                        case 'fbd-team':
                            if(angular.isDefined(request.teamId)) {

                                requestObject.id = request.teamId;

                                footballdataFactory.getTeam(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            } else if (angular.isDefined(request.leagueId)) {
                                requestObject.id = request.leagueId;

                                footballdataFactory.getTeamsBySeason(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            }
                            break;

                        case 'fbd-league':
                            if(angular.isDefined(request.year)) {

                                if(request.year !== '$CURRENT') {
                                    requestObject.season = request.year;
                                }

                                footballdataFactory.getSeasons(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            } else if(angular.isDefined(request.leagueId)) {
                                requestObject.id = request.leagueId;

                                footballdataFactory.getSeason(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            }
                            break;

                        case 'fbd-player':
                            if(angular.isDefined(request.teamId)) {

                                requestObject.id = request.teamId;

                                footballdataFactory.getPlayersByTeam(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            }
                            break;

                        case 'fbd-table':
                            if(angular.isDefined(request.leagueId)) {

                                requestObject.id = request.leagueId;

                                if(angular.isDefined(request.matchday)) {
                                    requestObject.matchday = request.matchday;
                                }

                                footballdataFactory.getLeagueTableBySeason(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            }
                            break;

                        case 'fbd-fixture':
                            if(angular.isDefined(request.fixtureId)) {

                                requestObject.id = request.fixtureId;

                                footballdataFactory.getFixture(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            } else if(angular.isDefined(request.leagueId)) {
                                requestObject.id = request.leagueId;

                                if(angular.isDefined(request.timeFrame)) {
                                    requestObject.timeFrame = request.timeFrame;
                                }

                                if(angular.isDefined(request.matchday)) {
                                    requestObject.matchday = request.matchday;
                                }

                                footballdataFactory.getFixturesBySeason(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            } else if(angular.isDefined(request.teamId)) {
                                requestObject.id = request.teamId;

                                if(angular.isDefined(request.timeFrame)) {
                                    requestObject.timeFrame = request.timeFrame;
                                }

                                if(angular.isDefined(request.year)) {
                                    if(request.year !== '$CURRENT') {
                                        requestObject.season = request.year;
                                    }
                                }

                                if(angular.isDefined(request.venue)) {
                                    requestObject.venue = request.venue;
                                }

                                footballdataFactory.getFixturesByTeam(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            } else {
                                if(angular.isDefined(request.timeFrame)) {
                                    requestObject.timeFrame = request.timeFrame;
                                }

                                if(angular.isDefined(request.leagueCodes)) {
                                    requestObject.league = request.leagueCodes;
                                }

                                footballdataFactory.getFixtures(requestObject)
                                    .then(function (_data) {
                                        if (_data) {
                                            apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                        }
                                    });
                            }
                            break;
                    }



                });
            }
        }
    }]);;"use strict";

angular.module("jtt_aping_footballdata")
    .service('apingFootballDataHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "footballdata";
        };

        this.getIdByLinksObject = function (_linksObject, _property) {
            if (angular.isUndefined(_property)) {
                _property = 'self';
            }

            var returnValue;
            if (_linksObject && _linksObject[_property] && _linksObject[_property].href) {
                var tempValue = _linksObject[_property].href.split('/').pop();
                if (tempValue.length > 0) {
                    returnValue = tempValue;
                }
            }
            return returnValue;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {

            var requestResults = [];
            if (_data && _data.data) {
                var _this = this;

                var scope = [];

                switch (_helperObject.model) {
                    case 'fbd-team':
                        if (angular.isDefined(_data.data.teams)) {
                            scope = _data.data.teams;
                        } else {
                            scope.push(_data.data);
                        }
                        break;

                    case 'fbd-table':
                        scope.push(_data.data);
                        break;

                    case 'fbd-league':
                        if (_data.data.constructor === Array) {
                            scope = _data.data;
                        } else {
                            scope.push(_data.data);
                        }

                        break;

                    case 'fbd-player':
                        if (_data.data.players && _data.data.players.length > 0) {
                            scope = _data.data.players;
                        }
                        break;

                    case 'fbd-fixture':
                        if (angular.isDefined(_data.data.fixture)) {
                            scope.push(_data.data.fixture);
                        } else if (angular.isDefined(_data.data.fixtures)) {
                            scope = _data.data.fixtures;
                        }
                        break;
                }

                if (scope.constructor === Array && scope.length > 0) {
                    angular.forEach(scope, function (value, key) {
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
                    case "fbd-team":
                        returnObject = this.getFbdTeamItemByJsonData(_item);
                        break;

                    case "fbd-league":
                        returnObject = this.getFbdLeagueItemByJsonData(_item);
                        break;

                    case "fbd-player":
                        returnObject = this.getFbdPlayerItemByJsonData(_item);
                        break;

                    case "fbd-table":
                        returnObject = this.getFbdTableItemByJsonData(_item);
                        break;

                    case "fbd-fixture":
                        returnObject = this.getFbdFixtureItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getFbdTeamItemByJsonData = function (_item) {
            var fbdTeamObject = apingModels.getNew("fbd-team", this.getThisPlatformString());

            angular.extend(fbdTeamObject, {
                teamId: _item._links ? this.getIdByLinksObject(_item._links) : undefined,
                code: _item.code || undefined,
                shortName: _item.shortName || undefined,
                name: _item.name || undefined,
                squadMarketValue: _item.squadMarketValue || undefined,
                crestUrl: _item.crestUrl ? _item.crestUrl.replace('http://', 'https://') : undefined
            });

            return fbdTeamObject;
        };

        this.getFbdLeagueItemByJsonData = function (_item) {
            var fbdLeagueObject = apingModels.getNew("fbd-league", this.getThisPlatformString());

            angular.extend(fbdLeagueObject, {
                leagueId: _item.id || undefined,
                league: _item.league || undefined,
                caption: _item.caption || undefined,
                currentMatchday: _item.currentMatchday || undefined,
                lastUpdated: _item.lastUpdated || undefined,
                numberOfGames: _item.numberOfGames || undefined,
                numberOfMatchdays: _item.numberOfMatchdays || undefined,
                numberOfTeams: _item.numberOfTeams || undefined,
                year: _item.year || undefined,
            });

            return fbdLeagueObject;
        };

        this.getFbdPlayerItemByJsonData = function (_item) {
            var fbdPlayerObject = apingModels.getNew("fbd-player", this.getThisPlatformString());

            angular.extend(fbdPlayerObject, {
                contractUntil: _item.contractUntil || undefined,
                dateOfBirth: _item.dateOfBirth || undefined,
                jerseyNumber: _item.jerseyNumber || undefined,
                marketValue: _item.marketValue || undefined,
                name: _item.name || undefined,
                nationality: _item.nationality || undefined,
                position: _item.position || undefined,
            });

            return fbdPlayerObject;
        };

        this.getFbdTableItemByJsonData = function (_item) {
            var fbdTableObject = apingModels.getNew("fbd-table", this.getThisPlatformString());

            var that = this;

            angular.extend(fbdTableObject, {
                leagueId: _item._links ? that.getIdByLinksObject(_item._links, 'soccerseason') : undefined,
                leagueCaption: _item.leagueCaption || undefined,
                matchday: _item.matchday || undefined,
            });

            if (_item.standing && _item.standing.constructor === Array && _item.standing.length > 0) {
                fbdTableObject.standing = [];
                angular.forEach(_item.standing, function (value, key) {
                    fbdTableObject.standing.push({
                        teamId: value.teamId || (value._links ? that.getIdByLinksObject(value._links, 'team') : undefined),
                        away: value.away || undefined,
                        crestURI: value.crestURI ? value.crestURI.replace('http://', 'https://') : undefined,
                        draws: angular.isDefined(value.draws) ? value.draws : undefined,
                        goalDifference: angular.isDefined(value.goalDifference) ? value.goalDifference : undefined,
                        goals: angular.isDefined(value.goals) ? value.goals : undefined,
                        goalsAgainst: angular.isDefined(value.goalsAgainst) ? value.goalsAgainst : undefined,
                        home: value.home || undefined,
                        losses: angular.isDefined(value.losses) ? value.losses : undefined,
                        playedGames: angular.isDefined(value.playedGames) ? value.playedGames : undefined,
                        points: angular.isDefined(value.points) ? value.points : undefined,
                        position: angular.isDefined(value.position) ? value.position : undefined,
                        rank: angular.isDefined(value.rank) ? value.rank : undefined,
                        teamName: value.teamName || undefined,
                        wins: angular.isDefined(value.wins) ? value.wins : undefined,
                        group: value.group || undefined,
                        team: value.team || undefined,
                    });
                });
            } else if (typeof _item.standings === 'object' && _item.standings !== null) {
                fbdTableObject.groups = [];
                angular.forEach(_item.standings, function (groupValue, groupKey) {
                    var standing = [];

                    angular.forEach(groupValue, function (value, key) {
                        standing.push({
                            teamId: value.teamId || (value._links ? that.getIdByLinksObject(value._links, 'team') : undefined),
                            away: value.away || undefined,
                            crestURI: value.crestURI ? value.crestURI.replace('http://', 'https://') : undefined,
                            draws: angular.isDefined(value.draws) ? value.draws : undefined,
                            goalDifference: angular.isDefined(value.goalDifference) ? value.goalDifference : undefined,
                            goals: angular.isDefined(value.goals) ? value.goals : undefined,
                            goalsAgainst: angular.isDefined(value.goalsAgainst) ? value.goalsAgainst : undefined,
                            home: value.home || undefined,
                            losses: angular.isDefined(value.losses) ? value.losses : undefined,
                            playedGames: angular.isDefined(value.playedGames) ? value.playedGames : undefined,
                            points: angular.isDefined(value.points) ? value.points : undefined,
                            position: angular.isDefined(value.position) ? value.position : undefined,
                            rank: angular.isDefined(value.rank) ? value.rank : undefined,
                            teamName: value.teamName || undefined,
                            wins: angular.isDefined(value.wins) ? value.wins : undefined,
                            group: value.group || undefined,
                            team: value.team || undefined,
                        });
                    });

                    fbdTableObject.groups.push({
                        name: groupKey,
                        standing: standing
                    })
                });
            }
            return fbdTableObject;
        };

        this.getFbdFixtureItemByJsonData = function (_item) {
            var fbdFixtureObject = apingModels.getNew("fbd-fixture", this.getThisPlatformString());

            angular.extend(fbdFixtureObject, {
                fixtureId: _item._links ? this.getIdByLinksObject(_item._links) : undefined,
                awayTeamName: _item.awayTeamName || undefined,
                date: _item.date || undefined,
                homeTeamName: _item.homeTeamName || undefined,
                matchday: _item.matchday || undefined,
                result: _item.result || undefined,
                status: _item.status || undefined,
            });

            return fbdFixtureObject;
        };
    }]);;"use strict";

angular.module("jtt_footballdata", [])
    .factory('footballdataFactory', ['$http', 'footballdataSearchDataService', function ($http, footballdataSearchDataService) {

        var footballdataFactory = {};

        footballdataFactory.getSeasons = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getSeasons", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey,
                }
            });
        };

        footballdataFactory.getSeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getSeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey,
                }
            });
        };

        footballdataFactory.getTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getPlayersByTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getPlayersByTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixtures = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixtures", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixture = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixture", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixturesByTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixturesByTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getTeamsBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getTeamsBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getLeagueTableBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getLeagueTableBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixturesBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixturesBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        return footballdataFactory;
    }])
    .service('footballdataSearchDataService', function () {
        this.getApiBaseUrl = function () {
            return 'http://api.football-data.org/v1/';
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

            var footballdataSearchData = {
                object: {},
                url: '',
            };

            switch (_type) {
                case "getSeasons":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'season',
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/';
                    break;

                case "getSeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey',
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id;
                    break;

                case "getTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'teams/' + _params.id;
                    break;

                case "getPlayersByTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'teams/' + _params.id + '/players';
                    break;

                case "getFixtures":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'league', 'timeFrame'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/fixtures';
                    break;

                case "getFixture":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'head2head'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/fixtures/' + _params.id;
                    break;

                case "getTeamsBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [

                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/teams';
                    break;

                case "getLeagueTableBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'matchday'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/leagueTable';
                    break;

                case "getFixturesBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'matchday', 'timeFrame'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/fixtures';
                    break;

                case "getFixturesByTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'season', 'timeFrame', 'venue'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/teams/' + _params.id + '/fixtures';
                    break;

            }
            return footballdataSearchData;
        };
    });