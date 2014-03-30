// source: https://github.com/emikhalev/leaflet-2gis
// author: Eugene Mikhalev
// license: MIT
L.DGis = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		attribution: '',
		opacity: 0.99
	},

	// Init object
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},

	// Layer events	
	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// Create map container
		this._initContainer();

		// Deferred loading
		var th = this;
		window.DG.load(function() {
			// Create map object
			th._initMapObject();

			// Setting events handlers
			th._setHandlers();

			map._controlCorners.bottomright.style.marginBottom = "3em";
			th._reset();
		});
	},
	onRemove: function() {
		// Remove map container
		this._map._container.removeChild(this._container);
		// Unset events handlers
		this._unsetHandlers();
		this._map._controlCorners.bottomright.style.marginBottom = "0em";
	},

	// Methods
	getAttribution: function() {
		return this.options.attribution;
	},

	setOpacity: function(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function(e, size) {
		e.style.width = size.x + "px";
		e.style.height = size.y + "px";
	},

	// Helpers
	_initContainer: function() {
		var tilePane = this._map._container,
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-2gis-layer leaflet-top leaflet-left leaflet-zoom-hide');
			this._container.id = "_2GisContainer_" + L.Util.stamp(this);
			this._container.style.zIndex = "auto";
		}

		if (this.options.overlay) {
			first = this._map._container.getElementsByClassName('leaflet-map-pane')[0];
			first = first.nextSibling;
			// XXX: Bug with layer order
			if (L.Browser.opera)
				this._container.className += " leaflet-objects-pane";
		}
		tilePane.insertBefore(this._container, first);

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._container, this._map.getSize());
	},

	_initMapObject: function() {
		// Init main object
		if (typeof this._map == "undefined") {
			return;
		}
		if (typeof this._dg == "undefined") {
			this._dg = new window.DG.Map(this._container);
			this._dg.fullscreen.disable();
			this._dg.geoclicker.disable();
		}

		// Set map center and zoom
		this._setCenter();

		var zoom = this._map.getZoom();
		this._dg.setZoom(zoom);
	},

	_setCenter: function(){
		var center = this._map.getCenter();
		this._dg.setCenter(new window.DG.GeoPoint(center.lng, center.lat) );
	},

	_setHandlers: function(){
		this._map.on('viewreset', this._resetCallback, this);
		this._limitedUpdate = L.Util.limitExecByInterval(this._move, 150, this);
		this._map.on('move', this._move, this);
		this._map.on('moveend', this._move, this);
	},

	_unsetHandlers: function(){
		this._map.off('viewreset', this._resetCallback, this);
		this._map.off('move', this._move, this);
		this._map.off('moveend', this._move, this);
	},

	// Event handlers
	_resetCallback: function(e) {
		this._reset(e.hard);
	},

	_reset: function() {
		this._initContainer();
	},

	_move: function(force) {
		if (typeof this._dg == "undefined") {
			return;
		}
		if (!this._map) return;
		this._resize(force);
		// Zoom
		var zoom = this._map.getZoom();
		if (force || this._dg.getZoom() != zoom)
			this._dg.setZoom(zoom);

		// Position
		var llCenter = this._map.getCenter(); // L.LatLng
		var dgCenter = this._dg.getCenter();  // DG.GeoPoint
		var dgllCenter = [dgCenter.lat, dgCenter.lon]; // L.LatLng <- DG.GeoPoint

		var llCenterPx = this._map.project(llCenter); // L.Point
		var dgCenterPx = this._map.project(dgllCenter); // L.Point

		var offsetX = dgCenterPx.x - llCenterPx.x;
		var offsetY = dgCenterPx.y - llCenterPx.y;

		this._dg.moveE( -offsetX ); // X-offset (East)
		this._dg.moveN( offsetY ); // Y-offset (North)

	},

	_resize: function(force) {
		if (typeof this._dg == "undefined") {
			return;
		}
		var size = this._map.getSize(), style = this._container.style;
		if (style.width == size.x + "px" && style.height == size.y + "px" && !force)
			return;
		this.setElementSize(this._container, size);
		//var b = this._map.getBounds(), sw = b.getSouthWest(), ne = b.getNorthEast();
		this._dg.redraw();
	}
});

(function() {
	var el = document.createElement('script');
	el.type = 'text/javascript';
	el.src = 'http://maps.api.2gis.ru/1.0?loadByRequire=1';
	document.getElementsByTagName('head')[0].appendChild(el);
})();

if( !('layerList' in window) )
	window.layerList = { list: {} };
window.layerList.list["2GIS"] = "new L.DGis()";
