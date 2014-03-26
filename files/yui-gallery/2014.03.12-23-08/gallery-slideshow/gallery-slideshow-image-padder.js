YUI.add('gallery-slideshow-image-padder', function(Y) {

var ImagePadding = function(config) {
	this._ss = config.host;

	ImagePadding.superclass.constructor.apply(this, arguments);
};

ImagePadding.NS = 'padder';
ImagePadding.NAME = 'slideshowImagePadder';

Y.extend(ImagePadding, Y.Plugin.Base, {
	initializer: function(config) {
		this.doAfter("_createImage", this._padImage);
	},
	_padImage: function(img) {
		Y.later(500, this, function(imageNode, contentBox) {
			var height = parseInt(contentBox.getStyle('height'), 10),
			    width  = parseInt(contentBox.getStyle('width'), 10),
			    img_height = parseInt(imageNode.one('img').getStyle('height'), 10),
			    img_width = parseInt(imageNode.one('img').getStyle('width'), 10),
			    padding_width = (width - img_width)/2,
			    padding_height = (height - img_height)/2;
			imageNode.setStyle('padding', padding_height + ' ' + padding_width); 
		}, [img._node, this._ss.get('bodyNode')]);
	}
});

Y.SlideShow.ImagePadder = ImagePadding;


}, 'gallery-2010.03.23-17-54' ,{requires:['gallery-slideshow', 'plugin']});
