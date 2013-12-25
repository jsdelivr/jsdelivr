/*
 * List of public-use layers.
 */
window._tempLL = window.layerList;

window.layerList = {
	// some entries in this list were adapted from the https://github.com/leaflet-extras/leaflet-providers list (it has BSD 2-clause license)
	list: {
		"OpenStreetMap": "L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a>', minZoom: 0, maxZoom: 19 })",
		"OpenStreetMap DE": "L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a>', minZoom: 0, maxZoom: 18 })",
		"OpenStreetMap FR": "L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { subdomains: 'abc', attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> | Tiles &copy <a href=\"http://tile.openstreetmap.fr/\">OSM France</a>', minZoom: 0, maxZoom: 20 })",
		"Hike & Bike": "L.layerGroup([ L.tileLayer('http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://hikebikemap.de/\">Colin Marquardt</a>' } ), L.tileLayer('http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png', { minZoom: 0, maxZoom: 17 }) ])",
		"CycleMap": "L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",
		"OpenMapSurfer": "L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 })",
		"OpenMapSurfer Contour": "L.layerGroup([ L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 }), L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}') ])",
		"OpenMapSurfer Grayscale": "L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 })",
		"Humanitarian": "L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> | Tiles &copy; <a href=\"http://hot.openstreetmap.org\">Humanitarian OSM Team</a>', minZoom: 0, maxZoom: 19 })",
		"Transport": "L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",
		"Landscape": "L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",
		"Outdoors": "L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",
		"MapQuest Open": "L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.mapquest.com/\">MapQuest</a>', subdomains: '1234', minZoom: 0, maxZoom: 18 })",
		"Stamen Toner": "L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 0, maxZoom: 20 })",
		"Stamen Toner Lite": "L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 0, maxZoom: 20 })",
		"Stamen Watercolor": "L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 3, maxZoom: 16 })",
		"Cloudmade": "L.tileLayer('http://{s}.tile.cloudmade.com/{apiKey}/{styleID}/256/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://cloudmade.com\">CloudMade</a>', apiKey: '{key:http://account.cloudmade.com/register}', styleID: '1', minZoom: 0, maxZoom: 18 })",
		"MapBox": "L.tileLayer('http://{s}.tiles.mapbox.com/v3/{key:https://www.mapbox.com/#signup}/{z}/{x}/{y}.png', { subdomains: 'abcd', attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a>' })"
	},

	getSortedKeys: function() {
		var result = [], k;
		for( k in this.list )
			if( this.list.hasOwnProperty(k) )
				result.push(k);
		result.sort();
		return result;
	},

	requiresKey: function( layer ) {
		var reKeyC = /{key(?::[^}]+)?}/,
			l = this.list[layer];
		return l && reKeyC.test(l);
	},

	getKeyLink: function( layer ) {
		var reKeyC = /{key:([^}]+)}/,
			l = this.list[layer],
			m = l && l.match(reKeyC);
		return m && m.length > 1 && m[1] ? m[1] : '';
	},

	getLayerName: function( layer ) {
		if( typeof layer !== 'string' )
			return '';
		var p1 = layer.indexOf(':'),
			p2 = layer.indexOf('|'),
			p = p1 > p2 && p2 > 0 ? p2 : p1;
		return p > 0 ? layer.substring(0, p) : layer;
	},

	getLeafletLayer: function( layerId, LL ) {
		/* jshint unused: false */
		var L = LL || window.L,
			reKeyC = /{key(?::[^}]+)?}/,
			m = layerId.match(/^(.+?\|)?(.+?)(?::([^'"]+))?$/);
		var idx = m && m.length > 2 && m[2] ? m[2] : '',
			title = m && m.length > 1 && m[1] && m[1].length > 0 ? m[1] : idx,
			keys = m && m.length > 3 && m[3] ? m[3].split(':') : [];
		if( this.list[idx] ) {
			var layer = this.list[idx], keyPos = 0;
			while( reKeyC.test(layer) && keyPos < keys.length ) {
				layer = layer.replace(reKeyC, keys[keyPos++]);
			}
			if( !reKeyC.test(layer) ) {
				try {
					var done = eval(layer);
					if( done ) {
						if( !done.options )
							done.options = {};
						done.options.name = title;
						return done;
					}
				} catch(e) {}
			}
		}
		return null;
	},

	getLeafletLayers: function( layers, LL ) {
		var l = typeof layers === 'string' ? layers.split(',') : layers,
			result = [], i, osmidx = -1;

		for( i = 0; i < l.length; i++ ) {
			var layer = this.getLeafletLayer(l[i], LL);
			if( layer ) {
				result.push(layer);
				if( osmidx < 0 && this.isOpenStreetMapLayer(layer) )
					osmidx = result.length - 1;
			}
		}

		if( osmidx > 0 ) {
			var tmp = result[osmidx];
			result[osmidx] = result[0];
			result[0] = tmp;
		} else if( osmidx < 0 && result.length > 0 ) {
			result.unshift(this.getLeafletLayer('OpenStreetMap', LL));
		}

		return result;
	},

	isOpenStreetMapLayer: function( layer ) {
		if( typeof layer === 'string' || layer.substring )
			return layer.indexOf('openstreetmap.org') > 0;
		var l = layer.options && layer._url ? layer : (layer.getLayers ? layer.getLayers()[0] : {});
		if( l.options && l._url )
			return (l.options.attribution && l.options.attribution.indexOf('openstreetmap.org') > 0) || l._url.indexOf('tile.openstreetmap.') > 0 || l._url.indexOf('opencyclemap.org') > 0 || l._url.indexOf('stamen.com') > 0 || l._url.indexOf('server.arcgisonline.com') > 0;
		return false;
	}
};

// merge layerList entries that were added before this script was loaded
if( window._tempLL ) {
	if( window._tempLL.list ) {
		var i;
		for( i in window._tempLL.list ) {
			if( window._tempLL.list.hasOwnProperty(i) )
				window.layerList.list[i] = window._tempLL.list[i];
		}
	}
	delete window._tempLL;
}
