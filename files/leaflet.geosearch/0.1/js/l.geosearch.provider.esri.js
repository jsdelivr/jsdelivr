/**
 * L.Control.GeoSearch - search for an address and zoom to it's location
 * L.GeoSearch.Provider.Esri uses arcgis geocoding service
 * https://github.com/smeijer/leaflet.control.geosearch
 */

L.GeoSearch.Provider.Esri = L.Class.extend({
    options: {

    },

    initialize: function(options) {
        options = L.Util.setOptions(this, options);
    },
    
    GetServiceUrl: function (qry) {
        var parameters = L.Util.extend({
            text: qry,
            f: 'pjson'
        }, this.options);

        return location.protocol 
            + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find'
            + L.Util.getParamString(parameters);
    },

    ParseJSON: function (data) {
        if (data.locations.length == 0)
            return [];
        
        var results = [];
        for (var i = 0; i < data.locations.length; i++)
            results.push(new L.GeoSearch.Result(
                data.locations[i].feature.geometry.x, 
                data.locations[i].feature.geometry.y, 
                data.locations[i].name
            ));
        
        return results;
    }
});
