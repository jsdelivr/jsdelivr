/**
 * L.Control.GeoSearch - search for an address and zoom to it's location
 * L.GeoSearch.Provider.Bing uses bing geocoding service
 * https://github.com/smeijer/leaflet.control.geosearch
 */

L.GeoSearch.Provider.Bing = L.Class.extend({
    options: {

    },

    initialize: function(options) {
        options = L.Util.setOptions(this, options);
    },

    GetServiceUrl: function (qry) {
        var parameters = L.Util.extend({
            query: qry,
            jsonp: '?'
        }, this.options);

        return 'http://dev.virtualearth.net/REST/v1/Locations'
            + L.Util.getParamString(parameters);
    },

    ParseJSON: function (data) {
        if (data.resourceSets.length == 0 || data.resourceSets[0].resources.length == 0)
            return [];

        var results = [];
        for (var i = 0; i < data.resourceSets[0].resources.length; i++)
            results.push(new L.GeoSearch.Result(
                data.resourceSets[0].resources[i].point.coordinates[1], 
                data.resourceSets[0].resources[i].point.coordinates[0], 
                data.resourceSets[0].resources[i].address.formattedAddress
            ));

        return results;
    }
});