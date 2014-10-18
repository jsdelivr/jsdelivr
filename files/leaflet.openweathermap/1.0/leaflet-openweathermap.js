/**
 * A JavaScript library for using OpenWeatherMap's layers and OWM's city/station data for leaflet based maps without hassle.
 * License: CC0 (Creative Commons Zero), see http://creativecommons.org/publicdomain/zero/1.0/
 * Project page: https://github.com/buche/leaflet-openweathermap/
 */

L.OWM = L.TileLayer.extend({
	baseUrl: "http://{s}.tile.openweathermap.org/map/{layername}/{z}/{x}/{y}.png",
	options: {
		maxZoom: 18,
		showLegend: true,
		legendImagePath: null,
		legendPosition: 'bottomleft',
		attribution: 'Weather from <a href="http://openweathermap.org/" alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>'
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
		this._map = null;
		this._legendControl = null;
		this._legendId = null;
		L.TileLayer.prototype.initialize.call(this, this._owmtileurl, options);
	},

	onAdd: function(map) {
		this._map = map;
		if (this.options.showLegend && this.options.legendImagePath != null) {
			this._legendControl = this._getLegendControl();
			this._legendId = this._legendControl.addLegend(this.options.legendImagePath);
		}
		L.TileLayer.prototype.onAdd.call(this, map);
	},

	onRemove: function(map) {
		if (this._legendControl != null) {
			this._legendControl.removeLegend(this._legendId);
			this._legendControl = null;
			this._legendId = null;
		}
		L.TileLayer.prototype.onRemove.call(this, map);
		this._map = null;
	},

	_getLegendControl: function() {
		if (typeof this._map._owm_legendcontrol == 'undefined' || !this._map._owm_legendcontrol) {
			this._map._owm_legendcontrol = new L.OWM.LegendControl({position: this.options.legendPosition});
			this._map.addControl(this._map._owm_legendcontrol);
		}
		return this._map._owm_legendcontrol;
	}
});

(function () {

	L.OWM.Precipitation = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'precipitation')
	});
	L.OWM.precipitation = function (options) { return new L.OWM.Precipitation(options); };

	L.OWM.PrecipitationClassic = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'precipitation_cls')
	});
	L.OWM.precipitationClassic = function (options) {
		var layer = new L.OWM.PrecipitationClassic(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/PR.png';
		}
		return layer;
	};

	L.OWM.Rain = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'rain')
	});
	L.OWM.rain = function (options) { return new L.OWM.Rain(options); };

	L.OWM.RainClassic = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'rain_cls')
	});
	L.OWM.rainClassic = function (options) {
		var layer = new L.OWM.RainClassic(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/RN.png';
		}
		return layer;
	};

	L.OWM.Snow = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'snow')
	});
	L.OWM.snow = function (options) { 
		var layer = new L.OWM.Snow(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/SN.png';
		}
		return layer; 
	};

	L.OWM.Clouds = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'clouds')
	});
	L.OWM.clouds = function (options) { return new L.OWM.Clouds(options); };

	L.OWM.CloudsClassic = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'clouds_cls')
	});
	L.OWM.cloudsClassic = function (options) {
		var layer = new L.OWM.CloudsClassic(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/NT.png';
		}
		return layer;
	};

	L.OWM.Pressure = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'pressure')
	});
	L.OWM.pressure = function (options) {
		var layer = new L.OWM.Pressure(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/PN.png';
		}
		return layer;
	};

	L.OWM.PressureContour = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'pressure_cntr')
	});
	L.OWM.pressureContour = function (options) { return new L.OWM.PressureContour(options); };

	L.OWM.Temperature = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'temp')
	});
	L.OWM.temperature = function (options) { 
		var layer = new L.OWM.Temperature(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/TT.png';
		}
		return layer;
	};

	L.OWM.Wind = L.OWM.extend({
		_owmtileurl: L.OWM.prototype.baseUrl.replace('{layername}', 'wind')
	});
	L.OWM.wind = function (options) { 
		var layer = new L.OWM.Wind(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'http://openweathermap.org/img/a/UV.png';
		}
		return layer;
	};

}());

L.OWM.LegendControl = L.Control.extend({
	options: {
		position: "bottomleft"
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._container = L.DomUtil.create('div', 'owm-legend-container');
		this._container.style.display = 'none';
		this._legendCounter = 0;
		this._legendContainer = new Array();
	},

	onAdd: function(map) {
		return this._container;
	},

	addLegend: function(legendImagePath) {
		var legendId = this._legendCounter++;
		this._legendContainer[legendId] = legendImagePath;
		this._redrawLegend();
		this._container.style.display = 'block';
		return legendId;
	},

	removeLegend: function(legendId) {
		if (typeof this._legendContainer[legendId] != 'undefined') {
			delete this._legendContainer[legendId];
		}
		// reset counter if no legend is in collection
		var containerEmpty = true;
		for (var idx in this._legendContainer) {
			containerEmpty = false;
			break;
		}
		if (containerEmpty) {
			this._legendCounter = 0;
			this._container.style.display = 'none';
		}
		this._redrawLegend();
	},

	_redrawLegend: function() {
		this._container.innerHTML = ''; // clear container
		var isLeft = this.options.position.indexOf('left') !== -1;
		var cssFloat = isLeft ? 'left' : 'right';
		for (var idx in this._legendContainer) {
			var imgPath = this._legendContainer[idx];
			var item = L.DomUtil.create('div', 'owm-legend-item', this._container);
			item.style.cssFloat = cssFloat;
			if (isLeft) {
				item.style.marginRight = '10px';
			} else {
				item.style.marginLeft = '10px';
			}
			item.innerHTML = '<img src="' + imgPath + '" border="0" />';
		}
	}
});

/**
 * Layer for current weather (cities and stations).
 */
L.OWM.Current = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		appId: null, // get your free Application ID at www.openweathermap.org
		type: 'city', // available types: 'city', 'station'
		lang: 'en', // available: 'en', 'de', 'ru', 'fr', 'nl', 'es', 'ca' (not every language is finished yet)
		minZoom: 7,
		interval: 0, // interval for rereading city/station data in minutes
		progressControl: true, // available: true, false
		imageLoadingUrl: 'owmloading.gif', // URL of loading image relative to HTML document
		imageLoadingBgUrl: null, // URL of background image for progress control
		temperatureUnit: 'C', // available: 'K' (Kelvin), 'C' (Celsius), 'F' (Fahrenheit)
		temperatureDigits: 1,
		speedUnit: 'ms', // available: 'ms' (m/s), 'kmh' (km/h), 'mph' (mph)
		speedDigits: 0,
		popup: true, // available: true, false
		keepPopup: true, // available: true, false
		showOwmStationLink: true, // available: true, false
		showWindSpeed: 'both', // available: 'speed', 'beaufort', 'both'
		showWindDirection: 'both', // available: 'deg', 'desc', 'both'
		showTimestamp: true, // available: true, false
		showTempMinMax: true, // available: true, false
		useLocalTime: true, // available: true, false
		clusterSize: 150,
		imageUrlCity: 'http://openweathermap.org/img/w/{icon}.png',
		imageWidth: 50,
		imageHeight: 50,
		imageUrlStation: 'http://openweathermap.org/img/s/istation.png',
		imageWidthStation: 25,
		imageHeightStation: 25,
		imageUrlPlane: 'http://openweathermap.org/img/s/iplane.png',
		imageWidthPlane: 25,
		imageHeightPlane: 25,
		markerFunction: null, // user defined function for marker creation
		popupFunction: null, // user defined function for popup creation
		caching: true, // use caching of current weather data
		cacheMaxAge: 15, // maximum age of cache content in minutes before it gets invalidated
		keepOnMinZoom: false // keep or remove markers when zoom < minZoom
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._layer = L.layerGroup();
		this._timeoutId = null;
		this._requests = {};
		this._markers = new Array();
		this._markedMarker = null;
		this._map = null;
		this._urlTemplate = 'http://api.openweathermap.org/data/2.5/box/{type}?{appId}cnt=300&format=json&units=metric&bbox={minlon},{minlat},{maxlon},{maxlat},10';
		this._directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
		this._msbft = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.0, 41.5, 46.2, 51.0, 56.1, 61.3]; // Beaufort scala
		this._tempUnits = { K: 'K', C: '°C', F: 'F'};
		this._progressCtrl = null;
		if (this.options.progressControl) {
			var bgIcon;
			if (this.options.imageLoadingBgUrl) {
				bgIcon = this.options.imageLoadingBgUrl;
			} else {
				bgIcon = this.options.imageUrlCity.replace('{icon}', '10d');
				if (this.options.type != 'city') {
					var bgIcon = this.options.imageUrlStation;
				}
			}
			this._progressCtrl = L.OWM.progressControl({
					type: this.options.type
					, bgImage: bgIcon
					, imageLoadingUrl: this.options.imageLoadingUrl
					, owmInstance: this
			});
		}
		this._cache = L.OWM.currentCache({ maxAge: this.options.cacheMaxAge });
	},

	onAdd: function(map) {
		this._map = map;
		this._map.addLayer(this._layer);
		this._map.on('moveend', this.update, this);
		// add progress control
		if (this._progressCtrl != null) {
			this._map.addControl(this._progressCtrl);
		}
		this.update();
	},

	onRemove: function(map) {
		// clear timeout
		if (this._timeoutId !== null) {
			window.clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}
		// remove progress control
		if (this._progressCtrl != null) {
			this._map.removeControl(this._progressCtrl);
		}
		// remove layer and markers
		this._map.off('moveend', this.update, this);
		this._map.removeLayer(this._layer);
		this._layer.clearLayers();
		this._map = null;
		this._cache.clear();
	},

	getAttribution: function() {
		return 'Weather from <a href="http://openweathermap.org/" '
			+ 'alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>';
	},

	update: function() {
		// clear existing timeout
		if (this._timeoutId) {
			window.clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}

		var _this = this;

		// clear requests for all types
		for (var typ in this._requests) {
			var request = this._requests[typ];
			this.fire('owmloadingend', {type: typ});
			request.abort();
		}
		this._requests = {};

		if (this._map.getZoom() < this.options.minZoom) {
			this.fire('owmloadingend', {type: _this.options.type});
			if (!this.options.keepOnMinZoom) {
				this._layer.clearLayers();
			}
			return;
		}

		// try to get cached data first
		var bounds = this._map.getBounds();
		var data = null;
		if (this.options.caching) {
			data = this._cache.get(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth());
		}
		if (data !== null) {
			// using cached data
			this._processRequestedData(this, data);
		} else {
			// fetch new data from OWM
			this.fire('owmloadingstart', {type: _this.options.type});
			var url = this._urlTemplate
						.replace('{appId}', this.options.appId ? 'APPID=' + this.options.appId + '&' : '')
						.replace('{type}', this.options.type)
						.replace('{minlon}', bounds.getWest())
						.replace('{minlat}', bounds.getSouth())
						.replace('{maxlon}', bounds.getEast())
						.replace('{maxlat}', bounds.getNorth())
						;
			this._requests[this.options.type] = L.OWM.Utils.jsonp(url, function(data) {
				delete _this._requests[_this.options.type];

				if (!_this._map) {
					// Nothing to do if layer is gone but this request is still active
					return;
				}

				if (_this.options.caching) {
					_this._cache.set(data, _this._map.getBounds());
				}
				_this._processRequestedData(_this, typeof data.list == 'undefined' ? new Array() : data.list);
				_this.fire('owmloadingend', {type: _this.options.type});
			});
		}
		if (this.options.interval && this.options.interval > 0) {
			this._timeoutId = window.setTimeout(function() {_this.update()}, 60000*this.options.interval);
		}
	},

	_processRequestedData: function(_this, data) {

		// read all stations/cities
		var stations = {};
		for (var i in data) {
			var stat = data[i];
			if (!_this._map) { // maybe layer is gone while we are looping here
				return;
			}
			// only use stations/cities having a minimum distance of some pixels on the map
			var pt = _this._map.latLngToLayerPoint(new L.LatLng(stat.coord.lat, stat.coord.lon));
			var key = '' + (Math.round(pt.x/_this.options.clusterSize)) + "_" + (Math.round(pt.y/_this.options.clusterSize));
			if (!stations[key] || parseInt(stations[key].rang) < parseInt(stat.rang)) {
				stations[key] = stat;
			}
		}

		// hide LayerGroup from map and remove old markers
		var markerWithPopup = null;
		if (_this.options.keepPopup) {
			markerWithPopup = _this._getMarkerWithPopup(_this._markers);
		}
		if (_this._map && _this._map.hasLayer(_this._layer)) {
			_this._map.removeLayer(_this._layer);
		}
		_this._layer.clearLayers();

		// add the stations/cities as markers to the LayerGroup
		_this._markers = new Array();
		for (var key in stations) {
			var marker;
			if (_this.options.markerFunction != null && typeof _this.options.markerFunction == 'function') {
				marker = _this.options.markerFunction.call(_this, stations[key]);
			} else {
				marker = _this._createMarker(stations[key]);
			}
			marker.options.owmId = stations[key].id;
			_this._layer.addLayer(marker);
			_this._markers.push(marker);
			if (_this.options.popup) {
				if (_this.options.popupFunction != null && typeof _this.options.popupFunction == 'function') {
					marker.bindPopup(_this.options.popupFunction.call(_this, stations[key]));
				} else {
					marker.bindPopup(_this._createPopup(stations[key]));
				}
			}
			if (markerWithPopup != null
					&& typeof markerWithPopup.options.owmId != 'undefined'
					&& markerWithPopup.options.owmId == marker.options.owmId) {
				markerWithPopup = marker;
			}
		}

		// add the LayerGroup to the map
		_this._map && _this._map.addLayer(_this._layer);
		if (markerWithPopup != null) {
			markerWithPopup.openPopup();
		}
		_this.fire('owmlayeradd', {markers: _this._markers});
	},

	_getMarkerWithPopup: function(markers) {
		var marker = null;
		for (var idx in markers) {
			var m = markers[idx];
			if (m._popup && m._map && m._map.hasLayer(m._popup)) {
				marker = m;
				break;
			}
		}
		return marker;
	},

	_createPopup: function(station) {
		var showLink = typeof station.id != 'undefined' && this.options.showOwmStationLink;
		var txt = '<div class="owm-popup-name">';
		if (showLink) {
			var typ = 'station';
			if (typeof station.weather != 'undefined') {
				typ = 'city';
			}
			txt += '<a href="http://openweathermap.org/' + typ + '/' + station.id + '" target="_blank" title="'
				+ this.i18n('owmlinktitle', 'Details at OpenWeatherMap') + '">';
		}
		txt += station.name;
		if (showLink) {
			txt += '</a>';
		}
		txt += '</div>';
		if (typeof station.weather != 'undefined' && typeof station.weather[0] != 'undefined') {
			if (typeof station.weather[0].description != 'undefined' && typeof station.weather[0].id != 'undefined') {
				txt += '<div class="owm-popup-description">'
					+ this.i18n('id'+station.weather[0].id, station.weather[0].description + ' (' + station.weather[0].id + ')')
					+ '</div>';
			}
		}
		var imgData = this._getImageData(station);
		txt += '<div class="owm-popup-main"><img src="' + imgData.url + '" width="' + imgData.width
				+ '" height="' + imgData.height + '" border="0" />';
		if (typeof station.main != 'undefined' && typeof station.main.temp != 'undefined') {
			txt += '<span class="owm-popup-temp">' + this._temperatureConvert(station.main.temp)
				+ '&nbsp;' + this._displayTemperatureUnit() + '</span>';
		}
		txt += '</div>';
		txt += '<div class="owm-popup-details">';
		if (typeof station.main != 'undefined') {
			if (typeof station.main.humidity != 'undefined') {
				txt += '<div class="owm-popup-detail">'
					+ this.i18n('humidity', 'Humidity')
					+ ': ' + station.main.humidity + '&nbsp;%</div>';
			}
			if (typeof station.main.pressure != 'undefined') {
				txt += '<div class="owm-popup-detail">'
					+ this.i18n('pressure', 'Pressure')
					+ ': ' + station.main.pressure + '&nbsp;hPa</div>';
			}
			if (this.options.showTempMinMax) {
				if (typeof station.main.temp_max != 'undefined' && typeof station.main.temp_min != 'undefined') {
					txt += '<div class="owm-popup-detail">'
						+ this.i18n('temp_minmax', 'Temp. min/max')
						+ ': '
							+ this._temperatureConvert(station.main.temp_min)
						+ '&nbsp;/&nbsp;'
						+ this._temperatureConvert(station.main.temp_max)
						+ '&nbsp;' + this._displayTemperatureUnit() + '</div>';
				}
			}
		}
		if (typeof station.rain != 'undefined' && typeof station.rain['1h'] != 'undefined') {
			txt += '<div class="owm-popup-detail">'
				+ this.i18n('rain_1h', 'Rain (1h)')
				+ ': ' + station.rain['1h'] + '&nbsp;ml</div>';
		}
		if (typeof station.wind != 'undefined') {
			if (typeof station.wind.speed != 'undefined') {
				txt += '<div class="owm-popup-detail">';
				if (this.options.showWindSpeed == 'beaufort' || this.options.showWindSpeed == 'both') {
					txt += this.i18n('windforce', 'Wind Force')
						+ ': ' + this._windMsToBft(station.wind.speed);
					if (this.options.showWindSpeed == 'both') {
						txt += '&nbsp;(' + this._convertSpeed(station.wind.speed) + '&nbsp;'
							+ this._displaySpeedUnit() + ')';
					}
				} else {
					txt += this.i18n('wind', 'Wind') + ': '
						+ this._convertSpeed(station.wind.speed) + '&nbsp;'
						+ this._displaySpeedUnit();
				}
				txt += '</div>';
			}
			if (typeof station.wind.gust != 'undefined') {
				txt += '<div class="owm-popup-detail">';
				if (this.options.showWindSpeed == 'beaufort' || this.options.showWindSpeed == 'both') {
					txt += this.i18n('gust', 'Gust')
						+ ': ' + this._windMsToBft(station.wind.gust);
					if (this.options.showWindSpeed == 'both') {
						txt += '&nbsp;(' + this._convertSpeed(station.wind.gust) + '&nbsp;'
							+ this._displaySpeedUnit() + ')';
					}
				} else {
					txt += this.i18n('gust', 'Gust') + ': '
						+ this._convertSpeed(station.wind.gust) + '&nbsp;'
						+ this._displaySpeedUnit();
				}
				txt += '</div>';
			}
			if (typeof station.wind.deg != 'undefined') {
				txt += '<div class="owm-popup-detail">';
				txt += this.i18n('direction', 'Windrichtung') + ': ';
				if (this.options.showWindDirection == 'desc' || this.options.showWindDirection == 'both') {
					txt += this._directions[(station.wind.deg/22.5).toFixed(0)];
					if (this.options.showWindDirection == 'both') {
						txt += '&nbsp;(' + station.wind.deg + '°)';
					}
				} else {
					txt += station.wind.deg + '°';
				}
				txt += '</div>';
			}
		}
		if (typeof station.dt != 'undefined' && this.options.showTimestamp) {
			txt += '<div class="owm-popup-timestamp">';
			txt += '(' + this._convertTimestamp(station.dt) + ')';
			txt += '</div>';
		}
		txt += '</div>';
		return txt;
	},

	_getImageData: function(station) {
		var imageUrl;
		var imageWidth = this.options.imageWidth;
		var imageHeight = this.options.imageHeight;
		var imageUrlTemplate = this.options.imageUrlCity;
		if (station.weather && station.weather[0] && station.weather[0].icon) {
			imageUrl = imageUrlTemplate.replace('{icon}', station.weather[0].icon);
		} else if (station.type && station.type == 1) {
			imageUrl = this.options.imageUrlPlane;
			imageWidth = this.options.imageWidthPlane;
			imageHeight = this.options.imageWidthPLane;
		} else {
			imageUrl = this.options.imageUrlStation;
			imageWidth = this.options.imageWidthStation;
			imageHeight = this.options.imageWidthStation;
		}
		return {url: imageUrl, width: imageWidth, height: imageHeight};
	},

	_createMarker: function(station) {
		var imageData = this._getImageData(station);
		var icon = L.divIcon({
						className: ''
						, iconAnchor: new L.Point(25, imageData.height/2)
						, popupAnchor: new L.Point(0, -10)
						, html: this._icondivtext(station, imageData.url, imageData.width, imageData.height)
					});
		var marker = L.marker([station.coord.lat, station.coord.lon], {icon: icon});
		return marker;
	},

	_icondivtext: function(station, imageurl, width, height) {
		var txt = '';
		txt += '<div class="owm-icondiv">'
			+ '<img src="' + imageurl + '" border="0" width="' + width + '" height="' + height + '" />';
		if (typeof station.main != 'undefined' && typeof station.main.temp != 'undefined') {
			txt += '<div class="owm-icondiv-temp">' + this._temperatureConvert(station.main.temp)
				+ '&nbsp;' + this._displayTemperatureUnit() + '</div>';
		}
		txt += '</div>';
		return txt;
	},

	_temperatureConvert: function(tempC) {
		var temp = tempC;
		switch (this.options.temperatureUnit) {
			case 'K':
				temp = (tempC + 273.15);
				break;
			case 'C':
				break;
			case 'F':
				temp = ((tempC + 273.15)*1.8-459.67);
				break;
		}
		return temp.toFixed(this.options.temperatureDigits);
	},

	_displayTemperatureUnit: function() {
		var unit = this._tempUnits['K'];
		if (typeof this._tempUnits[this.options.temperatureUnit] != 'undefined') {
			unit = this._tempUnits[this.options.temperatureUnit];
		}
		return unit;
	},

	_windMsToBft: function(ms) {
		var bft = 18;
		for (var key in this._msbft) {
			if (ms < this._msbft[key]) {
				bft = key;
				break;
			}
		}
		return bft;
	},

	_displaySpeedUnit: function() {
		var unit = 'm/s';
		switch (this.options.speedUnit) {
			case 'kmh':
				unit = 'km/h'
				break;
			case 'mph':
				unit = 'mph'
				break;
		}
		return unit;
	},

	_convertSpeed: function(speed) {
		var sp = speed;
		switch (this.options.speedUnit) {
			case 'kmh':
				sp = 3.6*sp;
				break;
			case 'mph':
				sp = 2.236*sp;
				break;
		}
		return sp.toFixed(this.options.speedDigits);
	},

	_convertTimestamp: function(tstmp) {
		if (this.options.useLocalTime) {
			return (new Date(tstmp*1000));
		} else {
			return (new Date(tstmp*1000)).toUTCString();
		}
	},

	i18n: function(key, fallback) {
		var lang = this.options.lang;
		if (typeof L.OWM.Utils.i18n != 'undefined'
				&& typeof L.OWM.Utils.i18n[lang] != 'undefined'
				&& typeof L.OWM.Utils.i18n[lang][key] != 'undefined') {
			return  L.OWM.Utils.i18n[lang][key]
		}
		return fallback;
	}

});
L.OWM.current = function(options) { return new L.OWM.Current(options); };

L.OWM.ProgressControl = L.Control.extend({
	includes: L.Mixin.Events, 

	options: {
		position: "topleft",
		type: 'city',
		bgImage: null // bgImage is set in L.OWM.Current when creating this ProgressControll instance
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._container = L.DomUtil.create('div', 'leaflet-control-layers');
		if (this.options.bgImage != null) {
			this._container.style.backgroundImage ='url(' + this.options.bgImage + ')';
			this._container.style.backgroundRepeat = 'no-repeat';
			this._container.style.backgroundPosition = 'center center';
		}
		L.DomEvent.disableClickPropagation(this._container);
		this._container.innerHTML = '<img src="' + this.options.imageLoadingUrl + '" width="50" height="50" />';
	},

	onAdd: function(map) {
		this._map = map;
		this.options.owmInstance.on('owmloadingstart', this._activate, this);
		this.options.owmInstance.on('owmloadingend', this._deactivate, this);
		return this._container;
	},

	_activate: function(e) {
		if (e.target.options.type == this.options.type) {
			this._container.style.display = 'block';
		}
	},

	_deactivate: function(e) {
		if (e.target.options.type == this.options.type) {
			this._container.style.display = 'none';
		}
	},

	onRemove: function(map) {
		this.options.owmInstance.off('owmloadingstart', this._activate, this);
		this.options.owmInstance.off('owmloadingend', this._deactivate, this);
		this._container.style.display = 'none';
		this._map = null;
	}

});
L.OWM.progressControl = function(options) { return new L.OWM.ProgressControl(options); };

L.OWM.CurrentCache = L.Class.extend({

	options: {
		maxAge: 15 // age in minutes before cache data is invalidated
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this.clear();
	},

	clear: function() {
		this._cachedData = null;
		this._cachedTime = 0;
		this._cachedBBox = {minLon: 181, minLat: 91, maxLon: -181, maxLat: -91};
	},

	get: function(minLon, minLat, maxLon, maxLat) {
		if (this._cachedData == null) {
			// no cached data available
			return null;
		}
		if ((new Date()).getTime() - this._cachedTime > 60000*this.options.maxAge) {
			// cached data is too old
			this.clear();
			return null;
		}
		if (minLon <= this._cachedBBox.minLon || minLat <= this._cachedBBox.minLat
				|| maxLon >= this._cachedBBox.maxLon || maxLat >= this._cachedBBox.maxLat) {
			// new area is outside of cached area
			this.clear();
			return null;
		}

		// clip cached data to bounds
		var clippedStations = new Array();
		var cnt = 0;
		for (var k in this._cachedData.list) {
			var station = this._cachedData.list[k];
			if (station.coord.lon >= minLon && station.coord.lon <= maxLon
					&& station.coord.lat >= minLat && station.coord.lat <= maxLat) {
				clippedStations[k] = station;
				cnt++;
			}
		}
		return clippedStations;
	},

	set: function(data, bounds) {
		this._cachedData = data;
		this._cachedBBox.minLon = bounds.getWest();
		this._cachedBBox.minLat = bounds.getSouth();
		this._cachedBBox.maxLon = bounds.getEast();
		this._cachedBBox.maxLat = bounds.getNorth();
		this._cachedTime = (new Date()).getTime();
	}

});
L.OWM.currentCache = function(options) { return new L.OWM.CurrentCache(options); };


L.OWM.Utils = {

	callbacks: {},
	callbackCounter: 0,

	jsonp: function(url, callbackFn) {
		var _this = this;
		var elem = document.createElement('script');
		var counter = this.callbackCounter++;
		var callback = 'L.OWM.Utils.callbacks[' + counter + ']';
		var abort = function() {
			if (elem.parentNode) {
				return elem.parentNode.removeChild(elem);
			}
		};

		this.callbacks[counter] = function(data) {
			delete _this.callbacks[counter];
			return callbackFn(data);
		};

		elem.src = '' + url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callback;
		elem.type = 'text/javascript';
		document.getElementsByTagName('body')[0].appendChild(elem);
		return { abort: abort };
	},

	i18n: {
		en: {
			owmlinktitle: 'Details at OpenWeatherMap'
			, temperature: 'Temperature'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Wind'
			, gust: 'Gust'
			, windforce: 'Wind Force'
			, direction: 'Direction'
			, rain_1h: 'Rain'
			, humidity: 'Humidity'
			, pressure: 'Pressure'

		// weather conditions, see http://openweathermap.org/wiki/API/Weather_Condition_Codes
			, id200: 'Thunderstorm with Light Rain'
			, id201: 'Thunderstorm with Rain'
			, id202: 'Thunderstorm with Heavy Rain'
			, id210: 'Light Thunderstorm'
			, id211: 'Thunderstorm'
			, id212: 'Heavy Thunderstorm'
			, id221: 'Ragged Thunderstorm'
			, id230: 'Thunderstorm with Light Drizzle'
			, id231: 'Thunderstorm with Drizzle'
			, id232: 'Thunderstorm with Heavy Drizzle'

			, id300: 'Light Intensity Drizzle'
			, id301: 'Drizzle'
			, id302: 'Heavy Intensity Drizzle'
			, id310: 'Light Intensity Drizzle Rain'
			, id311: 'Drizzle Rain'
			, id312: 'Heavy Intensity Drizzle Rain'
			, id321: 'Shower Drizzle'

			, id500: 'Light Rain'
			, id501: 'Moderate Rain'
			, id502: 'Heavy Intensity Rain'
			, id503: 'Very Heavy Rain'
			, id504: 'Extreme Rain'
			, id511: 'Freezing Rain'
			, id520: 'Light Intensity Shower Rain'
			, id521: 'Shower Rain'
			, id522: 'Heavy Intensity Shower Rain'

			, id600: 'Light Snow'
			, id601: 'Snow'
			, id602: 'Heavy Snow'
			, id611: 'Sleet'
			, id621: 'Shower Snow'
			, id622: 'Heavy Shower Snow'

			, id701: 'Mist'
			, id711: 'Smoke'
			, id721: 'Haze'
			, id731: 'Sand/Dust Whirls'
			, id741: 'Fog'
			, id751: 'Sand'

			, id800: 'Sky is Clear'
			, id801: 'Few Clouds'
			, id802: 'Scattered Clouds'
			, id803: 'Broken Clouds'
			, id804: 'Overcast Clouds'

			, id900: 'Tornado'
			, id901: 'Tropical Storm'
			, id902: 'Hurricane'
			, id903: 'Cold'
			, id904: 'Hot'
			, id905: 'Windy'
			, id906: 'Hail'
		},

		de: {
			owmlinktitle: 'Details bei OpenWeatherMap'
			, temperature: 'Temperatur'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Wind'
			, gust: 'Windböen'
			, windforce: 'Windstärke'
			, direction: 'Windrichtung'
			, rain_1h: 'Regen'
			, humidity: 'Luftfeuchtigkeit'
			, pressure: 'Luftdruck'

		// Wetterbedingungen, siehe http://openweathermap.org/wiki/API/Weather_Condition_Codes
			, id200: 'Gewitter mit leichtem Regen' // 'Thunderstorm with Light Rain'
			, id201: 'Gewitter mit Regen' // 'Thunderstorm with Rain'
			, id202: 'Gewitter mit Starkregen' // 'Thunderstorm with Heavy Rain'
			, id210: 'Leichtes Gewitter' // 'Light Thunderstorm'
			, id211: 'Mäßiges Gewitter' // 'Thunderstorm'
			, id212: 'Starkes Gewitter' // 'Heavy Thunderstorm'
		//	, id221: 'Ragged Thunderstorm'
		//	, id230: 'Thunderstorm with Light Drizzle'
		//	, id231: 'Thunderstorm with Drizzle'
		//	, id232: 'Thunderstorm with Heavy Drizzle'

			, id300: 'Leichter Nieselregen' // 'Light Intensity Drizzle'
			, id301: 'Nieselregen' // 'Drizzle'
			, id302: 'Starker Nieselregen' // 'Heavy Intensity Drizzle'
		//	, id310: 'Light Intensity Drizzle Rain'
		//	, id311: 'Drizzle Rain'
		//	, id312: 'Heavy Intensity Drizzle Rain'
		//	, id321: 'Shower Drizzle'

			, id500: 'Leichter Regen' // 'Light Rain'
			, id501: 'Mäßiger Regen' // 'Moderate Rain'
			, id502: 'Starker Regen' // 'Heavy Intensity Rain'
			, id503: 'Ergiebiger Regen' // 'Very Heavy Rain'
			, id504: 'Starkregen' // 'Extreme Rain'
			, id511: 'Gefrierender Regen' // 'Freezing Rain'
			, id520: 'Leichte Regenschauer' // 'Light Intensity Shower Rain'
			, id521: 'Mäßige Regenschauer' // 'Shower Rain'
			, id522: 'Wolkenbruchartige Regenschauer' // 'Heavy Intensity Shower Rain'

			, id600: 'Leichter Schneefall' // 'Light Snow'
			, id601: 'Mäßiger Schneefall' // 'Snow'
			, id602: 'Starker Schneefall' // 'Heavy Snow'
			, id611: 'Schneeregen' // 'Sleet'
			, id621: 'Schneeschauer' // 'Shower Snow'
			, id622: 'Starke Schneeschauer' // 'Heavy Shower Snow'

			, id701: 'Dunst' // 'Mist'
			, id711: 'Rauch' // 'Smoke'
			, id721: 'Eingetrübt' // 'Haze'
			, id731: 'Sand-/Staubwirbel' // 'Sand/Dust Whirls'
			, id741: 'Nebel' // 'Fog'
			, id751: 'Sand' // 'Sand'

			, id800: 'Wolkenlos' // 'Sky is Clear'
			, id800d: 'Sonnig' // 'Sky is Clear' at day
			, id800n: 'Klar' // 'Sky is Clear' at night
			, id801: 'Leicht bewölkt' // 'Few Clouds'
			, id802: 'Wolkig' // 'Scattered Clouds'
			, id803: 'Stark bewölkt' // 'Broken Clouds'
			, id804: 'Bedeckt' // 'Overcast Clouds'

			, id900: 'Tornado' // 'Tornado'
			, id901: 'Tropischer Sturm' // 'Tropical Storm'
			, id902: 'Orkan' // 'Hurricane'
			, id903: 'Kälte' // 'Cold'
			, id904: 'Hitze' // 'Hot'
			, id905: 'Windig' // 'Windy'
			, id906: 'Hagel' // 'Hail'
		},

		ru: {
			owmlinktitle: 'Информация в OpenWeatherMap'
			, temperature: 'Температура'
			, temp_minmax: 'Макс./Мин. темп'
			, wind: 'Ветер'
			, gust: 'Порывы'
			, windforce: 'Сила'
			, direction: 'направление'
			, rain_1h: 'Дождь'
			, humidity: 'Влажность'
			, pressure: 'Давление'

		// weather conditions, see http://openweathermap.org/wiki/API/Weather_Condition_Codes
		//	, id200: 'Thunderstorm with Light Rain'
		//	, id201: 'Thunderstorm with Rain'
		//	, id202: 'Thunderstorm with Heavy Rain'
		//	, id210: 'Light Thunderstorm'
		//	, id211: 'Thunderstorm'
		//	, id212: 'Heavy Thunderstorm'
		//	, id221: 'Ragged Thunderstorm'
		//	, id230: 'Thunderstorm with Light Drizzle'
		//	, id231: 'Thunderstorm with Drizzle'
		//	, id232: 'Thunderstorm with Heavy Drizzle'

		//	, id300: 'Light Intensity Drizzle'
			, id301: 'Морось' // 'Drizzle'
		//	, id302: 'Heavy Intensity Drizzle'
		//	, id310: 'Light Intensity Drizzle Rain'
		//	, id311: 'Drizzle Rain'
		//	, id312: 'Heavy Intensity Drizzle Rain'
		//	, id321: 'Shower Drizzle'

			, id500: 'Небольшой дождь' //'Light Rain'
			, id501: 'Дождь' // 'Moderate Rain'
			, id502: 'Сильный дождь' //'Heavy Intensity Rain'
			, id503: 'Очень сильный дождь' //'Very Heavy Rain'
			, id504: 'Сильный ливень' // 'Extreme Rain'
			, id511: 'Ледяной дождь' // 'Freezing Rain'
			, id520: 'Кратковременный слабый дождь' //'Light Intensity Shower Rain'
			, id521: 'Кратковременный дождь' //'Shower Rain'
			, id522: 'Кратковременный сильный дождь' //'Heavy Intensity Shower Rain'

			, id600: 'Слабый снег' // 'Light Snow'
			, id601: 'Снег' // 'Snow'
			, id602: 'Сильный снег' // 'Heavy Snow'
			, id611: 'Снег с дождем' //'Sleet' 
			, id621: 'Кратковременный снег' // 'Shower Snow'
			, id622: 'Кратковременный сильный снег' //'Heavy Shower Snow'

		//	, id701: 'Mist'
			, id711: 'Задымление' //'Smoke'
		//	, id721: 'Haze'
		//	, id731: 'Sand/Dust Whirls'
		//	, id741: 'Fog'
		//	, id751: 'Sand'

			, id800: 'Ясно' // 'Sky is Clear'
			, id801: 'Малооблачно' // 'Few Clouds'
			, id802: 'Переменная облачность' // 'Scattered Clouds'
			, id803: 'Облачно с прояснениями' // 'Broken Clouds'
			, id804: 'Облачно' // 'Overcast Clouds'

			, id900: 'Торнадо' // 'Tornado'
		//	, id901: 'Tropical Storm'
			, id902: 'Ураган' // 'Hurricane'
			, id903: 'Холод'//'Cold'
			, id904: 'Жара'//'Hot'
			, id905: 'Ветрено'//'Windy'
			, id906: 'Γрад' // 'Hail'
		},

		fr: {
			owmlinktitle: 'Détails à OpenWeatherMap'
			, temperature: 'Température'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Vent'
			, gust: 'Rafales'
			, windforce: 'Force du vent'
			, direction: 'Direction'
			, rain_1h: 'Pluie'
			, humidity: 'Humidité'
			, pressure: 'Pression'

		// Les conditions météorologiques, voir http://openweathermap.org/wiki/API/Weather_Condition_Codes
			, id200: 'Orage avec pluie légère' // 'Thunderstorm with Light Rain'
			, id201: 'Orage avec pluie' // 'Thunderstorm with Rain'
			, id202: 'Orage avec fortes précipitations' // 'Thunderstorm with Heavy Rain'
		//	, id210: 'Light Thunderstorm'
			, id211: 'Orage'
			, id212: 'Orage violent' // 'Heavy Thunderstorm'
		//	, id221: 'Ragged Thunderstorm'
			, id230: 'Orage avec bruine faible' // 'Thunderstorm with Light Drizzle'
			, id231: 'Orage avec bruine' // 'Thunderstorm with Drizzle'
		//	, id232: 'Thunderstorm with Heavy Drizzle'

		//	, id300: 'Light Intensity Drizzle'
			, id301: 'Bruine' // 'Drizzle'
		//	, id302: 'Heavy Intensity Drizzle'
		//	, id310: 'Light Intensity Drizzle Rain'
		//	, id311: 'Drizzle Rain'
		//	, id312: 'Heavy Intensity Drizzle Rain'
		//	, id321: 'Shower Drizzle'

			, id500: 'Pluie légère' // 'Light Rain'
			, id501: 'Pluie modérée' // 'Moderate Rain'
			, id502: 'Pluie battante' // 'Heavy Intensity Rain'
		//	, id503: 'Very Heavy Rain'
		//	, id504: 'Extreme Rain'
			, id511: 'Pluie verglassante' // 'Freezing Rain'
			, id520: 'Averses de pluie fine' // 'Light Intensity Shower Rain'
		//	, id521: 'Shower Rain'
		//	, id522: 'Heavy Intensity Shower Rain'

			, id600: 'Légers flocons' // 'Light Snow'
			, id601: 'Neige' // 'Snow'
			, id602: 'Fortes chutes de neige' // 'Heavy Snow'
			, id611: 'Neige fondue' // 'Sleet'
			, id621: 'Averses de neige' // 'Shower Snow'
			, id622: 'Fortes chutes de neige' // 'Heavy Shower Snow'

			, id701: 'Brume' // 'Mist'
			, id711: 'Fumée' // 'Smoke'
			, id721: 'Brume' // 'Haze'
			, id731: 'Tourbillons de sable/poussière' // 'Sand/Dust Whirls'
			, id741: 'Brouillard' // 'Fog'
		//	, id751: 'Sand'

			, id800: 'Ciel dégagé' // 'Sky is Clear'
			, id801: 'Ciel voilé'
			, id802: 'Nuageux' // 'Scattered Clouds'
			, id803: 'Nuageux' // 'Broken Clouds'
			, id804: 'Ciel couvert' // 'Overcast Clouds'

			, id900: 'Tornade' // 'Tornado'
			, id901: 'Tempête tropicale'// 'Tropical Storm'
			, id902: 'Ouragan' // 'Hurricane'
			, id903: 'Froid' // 'Cold'
			, id904: 'Chaleur' // 'Hot'
			, id905: 'Venteux' // 'Windy'
			, id906: 'Grêle' // 'Hail'
		},

		nl: { //dutch translation
			owmlinktitle: 'Details op OpenWeatherMap'
			, temperature: 'Temperatuur'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Wind'
			, gust: 'Windvlaag'
			, windforce: 'Windkracht'
			, direction: 'Richting'
			, rain_1h: 'Regen'
			, humidity: 'Luchtvochtigheid'
			, pressure: 'Luchtdruk'

		// weeercondities, see http://openweathermap.org/wiki/API/Weather_Condition_Codes
			, id200: 'Onweer met lichte regen'
			, id201: 'Onweer met met regen'
			, id202: 'Onweer met hevige regen'
			, id210: 'Lichte onweersbui'
			, id211: 'Onweersbui'
			, id212: 'Hevig onweer'
			, id221: 'Onregelmatige onweersbui'
			, id230: 'Onweer met licht motregen'
			, id231: 'Onweer met motregen'
			, id232: 'Onweer met hevige motregen'

			, id300: 'Lichte motregen'
			, id301: 'Motregen'
			, id302: 'Hevige motregen'
			, id310: 'Lichte motregen / regen'
			, id311: 'Motregen / regen'
			, id312: 'Hevige motregen / regen'
			, id321: 'Douche motregen'

			, id500: 'Lichte regen'
			, id501: 'Gematigde regen'
			, id502: 'Hevige regen'
			, id503: 'Erg hevige regen'
			, id504: 'Extreme regen'
			, id511: 'Hagel'
			, id520: 'Lichte miezerregen'
			, id521: 'Miezerregen'
			, id522: 'Hevige miezerregen'

			, id600: 'Lichte sneeuwval'
			, id601: 'Sneeuw'
			, id602: 'Hevige sneeuwval'
			, id611: 'Ijzel'
			, id621: 'Douche sneeuw'
			, id622: 'Hevige douche sneeuw'

			, id701: 'Mist'
			, id711: 'Rook'
			, id721: 'Nevel'
			, id731: 'Zand/stof werveling'
			, id741: 'Mist'
			, id751: 'Zand'

			, id800: 'Onbewolkt'
			, id801: 'Licht bewolkt'
			, id802: 'Half bewolkt'
			, id803: 'Overwegend bewolkt'
			, id804: 'Bewolkt'

			, id900: 'Tornado'
			, id901: 'Tropische Storm'
			, id902: 'Orkaan'
			, id903: 'Koud'
			, id904: 'Heet'
			, id905: 'Winderig'
			, id906: 'Hagel'
		},

		es: { //spanish translation
			owmlinktitle: 'Detalles en OpenWeatherMap'
			, temperature: 'Temperatura'
			, temp_minmax: 'Temp. mín/máx'
			, wind: 'Viento'
			, gust: 'Ráfagas'
			, windforce: 'Fuerza del viento'
			, direction: 'Dirección'
			, rain_1h: 'Lluvia'
			, humidity: 'Humedad'
			, pressure: 'Presión'

		// weather conditions, see http://openweathermap.org/weather-conditions
			// Thunderstorm
			, id200: 'Tormenta con lluvia débil'
			, id201: 'Tormenta con lluvia'
			, id202: 'Tormenta con lluvia fuerte'
			, id210: 'Tormenta débil'
			, id211: 'Tormenta'
			, id212: 'Tormenta fuerte'
			, id221: 'Tormenta irregular'
			, id230: 'Tormenta con llovizna débil'
			, id231: 'Tormenta con llovizna'
			, id232: 'Tormenta con llovizna fuerte'

			// Drizzle
			, id300: 'Llovizna débil'
			, id301: 'Llovizna'
			, id302: 'Llovizna fuerte'
			, id310: 'Lluvia/llovizna débil'
			, id311: 'Lluvia/llovizna'
			, id312: 'Lluvia/llovizna fuerte'
			, id321: 'Chubasco de llovizna'

			// Rain
			, id500: 'Lluvia débil'
			, id501: 'Lluvia moderada'
			, id502: 'Lluvia fuerte'
			, id503: 'Lluvia muy fuerte'
			, id504: 'Lluvia extrema'
			, id511: 'Granizo'
			, id520: 'Chubasco de lluvia débil'
			, id521: 'Chubasco de lluvia'
			, id522: 'Chubasco de lluvia fuerte'
			, id531: 'Chubasco de lluvia irregular'

			// Snow
			, id600: 'Nieve débil'
			, id601: 'Nieve'
			, id602: 'Nieve fuerte'
			, id611: 'Aguanieve'
			, id612: 'Chubasco de aguanieve'
			, id615: 'Lluvia y nieve débiles'
			, id616: 'Lluvia y nieve'
			, id620: 'Chubasco de nieve débil'
			, id621: 'Chubasco de nieve'
			, id622: 'Chubasco de nieve fuerte'

			// Atmosphere
			, id701: 'Bruma'
			, id711: 'Humo'
			, id721: 'Neblina'
			, id731: 'Torbellinos de arena/polvo'
			, id741: 'Niebla'
			, id751: 'Arena'
			, id761: 'Polvo'
			, id762: 'Ceniza volcánica'
			, id771: 'Tempestad'
			, id781: 'Tornado'

			// Clouds
			, id800: 'Cielo despejado'
			, id801: 'Algunas nubes'
			, id802: 'Nubes dispersas'
			, id803: 'Intérvalos nubosos'
			, id804: 'Nublado'

			// Extreme
			, id900: 'Tornado'
			, id901: 'Tormenta tropical'
			, id902: 'Huracán'
			, id903: 'Bajas temperaturas'
			, id904: 'Altas temperaturas'
			, id905: 'Ventoso'
			, id906: 'Granizo'

			// Additional
			, id951: 'Calma'
			, id952: 'Brisa ligera'
			, id953: 'Brisa suave'
			, id954: 'Brisa moderada'
			, id955: 'Brisa fresca'
			, id956: 'Brisa fuerte'
			, id957: 'Viento fuerte, próximo a vendaval'
			, id958: 'Vendaval'
			, id959: 'Vendaval fuerte'
			, id960: 'Tempestad'
			, id961: 'Tempestad violenta'
			, id962: 'Huracán'
		},

		ca: { //catalan translation
			owmlinktitle: 'Detalls en OpenWeatherMap'
			, temperature: 'Temperatura'
			, temp_minmax: 'Temp. mín/màx'
			, wind: 'Vent'
			, gust: 'Ràfegues'
			, windforce: 'Força del vent'
			, direction: 'Direcció'
			, rain_1h: 'Pluja'
			, humidity: 'Humitat'
			, pressure: 'Pressió'

		// weather conditions, see http://openweathermap.org/weather-conditions
			// Thunderstorm
			, id200: 'Tempesta amb pluja feble'
			, id201: 'Tempesta amb pluja'
			, id202: 'Tempesta amb pluja forta'
			, id210: 'Tempesta feble'
			, id211: 'Tempesta'
			, id212: 'Tempesta forta'
			, id221: 'Tempesta irregular'
			, id230: 'Tempesta amb plugim feble'
			, id231: 'Tempesta amb plugim'
			, id232: 'Tempesta amb plugim fort'

			// Drizzle
			, id300: 'Plugim feble'
			, id301: 'Plugim'
			, id302: 'Plugim fort'
			, id310: 'Pluja/plugim feble'
			, id311: 'Pluja/plugim'
			, id312: 'Pluja/plugim fort'
			, id321: 'Ruixat de plugim'

			// Rain
			, id500: 'Pluja feble'
			, id501: 'Pluja moderada'
			, id502: 'Pluja forta'
			, id503: 'Pluja molt forta'
			, id504: 'Pluja extrema'
			, id511: 'Calabruix'
			, id520: 'Ruixat de pluja feble'
			, id521: 'Ruixat de pluja'
			, id522: 'Ruixat de pluja fort'
			, id531: 'Ruixat de pluja irregular'

			// Snow
			, id600: 'Neu feble'
			, id601: 'Neu'
			, id602: 'Neu forta'
			, id611: 'Aiguaneu'
			, id612: 'Ruixat de aguanieve'
			, id615: 'Pluja i neu febles'
			, id616: 'Pluja i neu'
			, id620: 'Ruixat de neu feble'
			, id621: 'Ruixat de neu'
			, id622: 'Ruixat de neu fort'

			// Atmosphere
			, id701: 'Bruma'
			, id711: 'Fum'
			, id721: 'Boirina'
			, id731: 'Torbellinos de arena/polvo'
			, id741: 'Boira'
			, id751: 'Sorra'
			, id761: 'Pols'
			, id762: 'Cendra volcànica'
			, id771: 'Tempestat'
			, id781: 'Tornado'

			// Clouds
			, id800: 'Cel clar'
			, id801: 'Alguns núvols'
			, id802: 'Núvols dispersos'
			, id803: 'Intervals nuvolosos'
			, id804: 'Ennuvolat'

			// Extreme
			, id900: 'Tornado'
			, id901: 'Tempesta tropical'
			, id902: 'Huracà'
			, id903: 'Temperatures baixes'
			, id904: 'Temperatures altes'
			, id905: 'Ventós'
			, id906: 'Calabruix'

			// Additional
			, id951: 'Calma'
			, id952: 'Brisa lleugera'
			, id953: 'Brisa suau'
			, id954: 'Brisa moderada'
			, id955: 'Brisa fresca'
			, id956: 'Brisa forta'
			, id957: 'Vent fort, pròxim a vendaval'
			, id958: 'Ventada'
			, id959: 'Ventada forta'
			, id960: 'Tempesta'
			, id961: 'Tempesta violenta'
			, id962: 'Huracà'
		}

	}
};
