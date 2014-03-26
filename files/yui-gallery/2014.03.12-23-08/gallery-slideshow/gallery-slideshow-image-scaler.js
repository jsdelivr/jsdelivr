YUI.add('gallery-slideshow-image-scaler', function(Y) {

var ImageScaling = function(config) {
	this._ss = config.host;

	ImageScaling.superclass.constructor.apply(this, arguments);
};

ImageScaling.NS = 'scaling';
ImageScaling.NAME = 'slideshowImageScaler';

ImageScaling.ATTRS = {
	height: {
		validator: Y.Lang.isNumber
	},
	width: {
		validator: Y.Lang.isNumber
	},
	scaleFactor: {
		validator: Y.Lang.isNumber
	}
};

Y.extend(ImageScaling, Y.Plugin.Base, {
	initializer: function(config) {
		this.doAfter("_createImage", this._scaleImage);
	},
	_scaleImage: function(img) {
		var scaleFactor = this.get('scaleFactor'),
		    width = img.width || this.get('width'),
		    height = img.height || this.get('height'),
		    imageNode = img._node.one('img');

		if (scaleFactor) {
			imageNode.setStyles({height: scaleFactor + '%', width: scaleFactor + '%'});
		} else {
			if (width) { imageNode.setStyle('width', width); }
			if (height){ imageNode.setStyle('height', height); }
		}
	}
});

Y.SlideShow.ImageScaler = ImageScaling;


}, 'gallery-2010.03.23-17-54' ,{requires:['gallery-slideshow', 'plugin']});
