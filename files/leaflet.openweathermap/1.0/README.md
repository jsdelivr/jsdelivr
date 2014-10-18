# OpenWeatherMap for Leaflet based maps

## Description
[OpenWeatherMap](http://openweathermap.org/) (OWM) is a service providing weather related data, visualizing it using an OpenLayers based map. This is a Leaflet based script providing easy access to OWM's features for Leaflet based maps.

In short: A JavaScript library for including OWM's layers and OWM's current city/station data in leaflet based maps without hassle.

Feel free to flattr me if you like it: [![alttext](http://api.flattr.com/button/flattr-badge-large.png)](http://flattr.com/thing/1193685/)

## Demo

An example map using many features of this library can be seen here: http://map.comlu.com/openweathermap/
Its "Wind Rose" overlay is a complex example of a user defined marker to give you an idea what can be achieved by user defined functions for markers.

## License

This code is licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/ "Creative Commons Zero - Public Domain").

## Using TileLayers

OWM offers some TileLayers: Clouds, Clouds Classic, Precipitation, Precipitation Classic, Rain, Rain Classic, Snow, Temperature, Wind Speed, Pressure and Pressure Contours.

### Initializing TileLayers

Here's how to initialize these TileLayers:

* var clouds = L.OWM.clouds();
* var cloudscls = L.OWM.cloudsClassic();
* var precipitation = L.OWM.precipitation();
* var precipitationcls = L.OWM.precipitationClassic();
* var rain = L.OWM.rain();
* var raincls = L.OWM.rainClassic();
* var snow = L.OWM.snow();
* var pressure = L.OWM.pressure();
* var pressurecntr = L.OWM.pressureContour();
* var temp = L.OWM.temperature();
* var wind = L.OWM.wind();

### Options for TileLayers

Beyond standard options for Leaflet TileLayers there are additional ones:

* *showLegend*: **true** or false. If true and option 'legendImagePath' is set there will be a legend image on the map.
* *legendImagePath*: URL (is set to a default image for some layers, **null** for others, see below). URL or relative path to an image which is a legend to this layer.
* *legendPosition*: **'bottomleft'**. Position of the legend images on the map. Available are standard positions for Leaflet controls ('topright', 'topleft', 'bottomright', 'bottomleft').

Out of the box a legend image is only available for Pressure, Precipitation Classic, Clouds Classic, Rain Classic, Snow, Temperature and Wind Speed. Please add your own images if you need some more.

## Using current data for cities and stations

Weather data for cities and stations are fetched using the OpenWeatherMap API. They are added as a LayerGroup of markers, one for cities and another one for stations. These layers can be refreshed every *n* minutes (set *n* with the option *intervall* but do not use less than 10 minutes, please).

### Initialization

Here's how to initialize these dynamically created layers:

* var city = L.OWM.current( /* options */ );
* var station = L.OWM.current({type: 'station' /*, additional options */ });

### Options

A lot of *options* are available to configure the behaviour of the city/station data ( **default value** is bold). But don't be scared about the large number of options, you don't need to set any if you are pleased with the defaults:

* *appId*: String ( **null** ). Please get a free API key (called APPID) if you're using OWM's current weather data regulary.
* *type*: **'city'** or 'station'. Get city data or station data.
* *lang*: **'en'**, 'de', 'ru', 'fr', 'es', 'ca'. Language of popup texts. Note: not every translation is finished yet.
* *minZoom*: Number ( **7** ). Minimal zoom level for fetching city/station data. Use smaller values only at your own risk.
* *interval*: Number ( **0** ). Time in minutes to reload city or station data. Please do not use less than 10 minutes. 0 no reload (default)
* *progressControl*: **true** or false. Whether a progress control should be used to tell the user that data is being loaded at the moment.
* *imageLoadingUrl*: URL ( **'owmloading.gif'** ). URL of the loading image, or a path relative to the HTML document. This is important when the image is not in the same directory as the HTML document!
* *imageLoadingBgUrl*: URL ( **null** ). URL of background image for progress control if you don't like the default one.
* *temperatureUnit*: **'C'**, 'F', 'K'. Display temperature in Celsius, Fahrenheit or Kelvin.
* *temperatureDigits*: Number ( **1** ). Number of decimal places for temperature.
* *speedUnit*: **'ms'**, 'kmh' or 'mph'. Unit of wind speed (m/s, km/h or mph).
* *speedDigits*: Number ( **0** ). Number of decimal places for wind speed.
* *popup*: **true** or false. Whether to bind a popup to the city/station marker.
* *keepPopup*: **true** or false. When true it tries to reopen an already open popup on move or reload. Can result in an additional map move (after reopening the popup) with closing and reopening the popup once again.
* *showOwmStationLink*: **true** or false. Whether to link city/station name to OWM.
* *showWindSpeed*: 'speed', 'beaufort' or **'both'**. Show wind speed as speed in speedUnit or in beaufort scala or both.
* *showWindDirection*: 'deg', 'desc' or **'both'**. Show wind direction as degree, as description (e.g. NNE) or both.
* *showTimestamp*: **true** or false. Whether to show the timestamp of the data.
* *showTempMinMax*: **true** or false. Whether to show temperature min/max.
* *useLocalTime*: **true** or false. Whether to use local time or UTC for the timestamp.
* *clusterSize*: Number ( **150** ). If some stations are too close to each other, they are hidden. In an area of the size clusterSize pixels * clusterSize pixels only one city or one station is allowed.
* *imageUrlCity*: URL ( **'http://openweathermap.org/img/w/{icon}.png'** ). URL template for weather condition images of cities. {icon} will be replaced by the icon property of city's data. See http://openweathermap.org/img/w/ for some standard images.
* *imageWidth*: Number ( **50** ). Width of city's weather condition image.
* *imageHeight*: Number ( **50** ). Height of city's weather condition image.
* *imageUrlPlane*: URL ( **'http://openweathermap.org/img/s/iplane.png'** ). Image URL for stations of type 1.
* *imageWidthPlane*: Number ( **25** ). Width of image for station type 1.
* *imageHeightPlane*: Number ( **25** ). Height of image for station type 1.
* *imageUrlStation*: URL ( **'http://openweathermap.org/img/s/istation.png'** ). Image URL for stations of type unequal to 1.
* *imageWidthStation*: Number ( **25** ). Width of image for station type unequal to 1.
* *imageHeightStation*: Number ( **25** ). Height of image for station type unequal to 1.
* *markerFunction*: Function ( **null** ). User defined function for marker creation. Needs one parameter for station data.
* *popupFunction*: Function ( **null** ). User defined function for popup creation. Needs one parameter for station data.
* *caching*: **true** or false. Use caching of current weather data. Cached data is reloaded when it is too old or the new bounding box doesn't fit inside the cached bounding box.
* *cacheMaxAge*: Number ( **15** ). Maximum age in minutes for cached data before it is considered as too old.
* *keepOnMinZoom*: **false** or true. Keep or remove markers when zoom < minZoom.

## Simple Example 

Here are the most important lines:

```html
<head>
	<script type="text/javascript" src="leaflet.js"></script>
	<link rel="stylesheet" type="text/css" href="leaflet-openweathermap.css" />
	<script type="text/javascript" src="leaflet-openweathermap.js"></script>
</head>
```

```js
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18, attribution: '[insert correct attribution here!]' });

var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5});
var city = L.OWM.current({intervall: 15, lang: 'de'});

var map = L.map('map', { center: new L.LatLng(51.5, 10), zoom: 10, layers: [osm] });
var baseMaps = { "OSM Standard": osm };
var overlayMaps = { "Clouds": clouds, "Cities": city };
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
```

## Example with user provided marker/popup functions for current weather

Provide one functions for creating markers and another one for creating popups.
Add the options *markerFunction* and *popupFunction* to your call to *L.OWM.current*.
The data structure you get as a parameter isn't well documented at the moment. You
get what OWM sends. Just look at the data and keep in mind that most entries are optional.
The context (this) of the functions is the L.OWM.Current instance you created. Therefore
you have access to options (e.g. this.options.temperatureUnit) and other attributes.

```html
<head>
	<script type="text/javascript" src="leaflet.js"></script>
	<link rel="stylesheet" type="text/css" href="leaflet-openweathermap.css" />
	<script type="text/javascript" src="leaflet-openweathermap.js"></script>
</head>
```

```js
function myOwmMarker(data) {
	// just a Leaflet default marker
	return L.marker([data.coord.lat, data.coord.lon]);
}

function myOwmPopup(data) {
	// just a Leaflet default popup with name as content
	return L.popup().setContent(data.name);
}

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18, attribution: '[insert correct attribution here!]' });

var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5});
var city = L.OWM.current({intervall: 15, lang: 'de',
			markerFunction: myOwmMarker, popupFunction: myOwmPopup});

var map = L.map('map', { center: new L.LatLng(51.5, 10), zoom: 10, layers: [osm] });
var baseMaps = { "OSM Standard": osm };
var overlayMaps = { "Clouds": clouds, "Cities": city };
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
```


## Please help me

* Translations for de, ru, fr (see `L.OWM.Utils.i18n[lang]`) are incomplete. Someone out there knowing the correct terms?
