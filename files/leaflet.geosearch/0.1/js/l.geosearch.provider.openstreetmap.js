/**
 * L.Control.GeoSearch - search for an address and zoom to it's location
 * L.GeoSearch.Provider.OpenStreetMap uses openstreetmap geocoding service
 * https://github.com/smeijer/leaflet.control.geosearch
 */

L.GeoSearch.Provider.OpenStreetMap = L.Class.extend({
    options: {

    },

    initialize: function(options) {
        options = L.Util.setOptions(this, options);
    },

    GetServiceUrl: function (qry) {
        var parameters = L.Util.extend({
            q: qry,
            format: 'json'
        }, this.options);

        return 'http://nominatim.openstreetmap.org/search'
            + L.Util.getParamString(parameters);
    },

    ParseJSON: function (data) {
        if (data.length == 0)
            return [];

        var results = [];
        for (var i = 0; i < data.length; i++) 
            results.push(new L.GeoSearch.Result(
                data[i].lon, 
                data[i].lat, 
                data[i].display_name
            ));
        
        return results;
    }
});