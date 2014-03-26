YUI.add('gallery-widget-fillviewport', function(Y) {

var BIND_UI = 'bindUI',
	SYNC_UI = 'syncUI',
	ES = '',
	CHILDREN_CONTAINER = 'childrenContainer',
	HEADER_CONTENT = 'headerContent',
	BODY_CONTENT = 'bodyContent',
	FOOTER_CONTENT = 'footerContent',
	BODY = 'body',
	RESIZE = 'resize',
	WIDTH = 'width',
	HEIGHT = 'height',
	FILL_VIEWPORT = 'fillViewport',
	FILL_VIEWPORT_CHANGE = 'fillViewportChange';


function WidgetFillViewport () {
	Y.before(this._bindUIFillVP, this, BIND_UI);
	Y.before(this._syncUIFillVP, this, SYNC_UI);
}

WidgetFillViewport.ATTRS = {
	fillViewport : {
		value : true
	}
};

WidgetFillViewport.prototype = {
	_originalWidth : null,
	_originalHeight : null,

	_resizeListener : null,

	_maximize : function (e) {
		var vpRegion = Y.DOM.viewportRegion();
		this.setAttrs({
			width : vpRegion.width,
			height : vpRegion.height
		});
	},

	_setUIFillVP : function (fill) {
		Y.one(BODY).setStyles({
			padding: (fill ? 0 : ES),
			margin: (fill ? 0 : ES)
		});

		if (fill) {
			this._originalWidth = this.get(WIDTH);
			this._originalHeight = this.get(HEIGHT);

			this._resizeListener = Y.on(RESIZE, Y.bind(this._maximize, this), window);
			this._maximize();
		} else if (this._resizeListener) {
			this._resizeListener.detach();
			this._resizeListener = null;

			this.set(WIDTH, this._originalWidth);
			this.set(HEIGHT, this._originalHeight);
		}
	},

	_bindUIFillVP : function () {
		this.after(FILL_VIEWPORT_CHANGE, function (e) {
			this._setUIFillVP(e.newVal);
		}, this);
	},
	_syncUIFillVP : function () {
		var fillVp = this.get(FILL_VIEWPORT);
		this._setUIFillVP(fillVp);
	}
};

Y.WidgetFillViewport = WidgetFillViewport;


}, 'gallery-2010.10.27-19-38' ,{requires:['widget-base']});
