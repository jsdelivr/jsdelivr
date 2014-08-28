/**
 * Gallery App
 */
(function($){

var g = xe.createApp('Gallery', {
	_imgs   : {},
	_styles : {},

	init : function() {
		this._imgs = {};
	},
	API_ADD_IMAGE : function(sender, params) {
		var srl = params[0], path = params[1], key = '@'+srl;

		if(/^files/.test(path)) path = request_uri + path;
		if(!is_def(this._imgs[key])) this._imgs[key] = [];

		this._imgs[key].push({path:path,loaded:false});
	},
	API_ONREADY : function(sender, params) {
		var i, c, key, img, imgs = this._imgs;

		// image cache
		for(key in imgs) {
			if(!imgs.hasOwnProperty(key)) continue;

			for(i=0,c=imgs[key].length; i < c; i++) {
				img = imgs[key][i];
				img.$obj = $('<img />').attr('src', img.path);
				img.$obj.load({img:img}, function(event){
					var im = event.data.img;

					im.loaded = true;
					im.$obj.unbind('load');
				});
			}
		}
	},
	API_GET_IMAGES : function(sender, params) {
		var srl = params[0];

		return this._imgs['@'+srl] || [];
	},
	API_SET_STYLE : function(sender, params) {
		var srl = params[0], sty = params[1];

		this._styles['@'+srl] = sty;
	},
	API_ONLOAD : function() {
		var key, sty;

		for(key in this._imgs) {
			if(!this._imgs.hasOwnProperty(key)) continue;
			sty = this._styles[key] || 'list';

			this.cast('SHOW_'+sty.toUpperCase(), [key.substr(1)]);
		}
	}
});

xe.registerApp(new g);

})(jQuery);
