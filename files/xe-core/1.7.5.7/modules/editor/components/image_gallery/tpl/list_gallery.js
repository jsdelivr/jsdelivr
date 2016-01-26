/**
 * @file  list_gallery.js
 * @brief List-type image gallery
 * @author NAVER (developers@xpressengine.com)
 **/

(function($){

var listShow = xe.createPlugin('list', {
	API_SHOW_LIST : function(sender, params) {
		var srl = params[0], imgs, $zone, i, c, im, scale, w1, w2, h1, h2;

		imgs = this.cast('GET_IMAGES', [srl]);

		if(!imgs.length) return;

		$zone = $('#zone_list_gallery_'+srl).empty();
		width = $zone.innerWidth();

		for(i=0,c=imgs.length; i < c; i++) {
			im = imgs[i];
			w1 = im.$obj.prop('width');
			h1 = im.$obj.prop('height');

			if (w1 == 0){
				w1 = im.$obj.attr('width');
			}
			if(h1 ==0){
				h1 = im.$obj.attr('height');
			}

			if(w1 > width - 25) {
				w2 = width - 25;
				scale =  w2 / w1;
				h2 = Math.floor(h1 * scale);

				w1 = w2; h1 = h2;
				im.$obj.attr('rel', 'xe_gallery');
			}

			$zone.append(im.$obj);
			im.$obj.css({width:w1+'px', height:h1, margin:'0 10px', display:'block'});
		}
	}
});

var gallery = xe.getApp('Gallery')[0];
if(gallery) gallery.registerPlugin(new listShow);

})(jQuery);
