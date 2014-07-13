/**
 * @file  slide_gallery.js
 * @brief Slideshow type image gallery plugin
 * @author NAVER (developers@xpressengine.com)
 **/

(function($){

var slideShow = xe.createPlugin('slideShow', {
	_holders : {},
	_thumbs  : {},
	_current : {},

	init : function() {
		this._holders = {};
		this._thumbs  = {};
		this._current = {};
	},

	API_SHOW_SLIDE : function(sender, params) {
		var self=this, srl = params[0], key = '@'+srl, imgs, $zone, $thumb, $holder, i, c;
		var p = params;
		imgs = this.cast('GET_IMAGES', [srl]);
		if(!imgs.length) return;

		for(var i=0, nLen=imgs.length; i<nLen; i++){
			if(!imgs[i].loaded){
				setTimeout(function(){
					self.cast('SHOW_SLIDE', params);
				}, 200);
				return;
			}
		}

		$zone   = $('#zone_slide_gallery_'+srl);
		$holder = $zone.find('.slide_gallery_placeholder').css('overflow', 'hidden');

		// remove loading message
		$zone.find('.slide_gallery_loading_text').remove();

		// create thumbnails
		$thumb = $zone.find('.slide_gallery_thumbnail_image_box').show();
		for(i=0,c=imgs.length; i < c; i++) {
			imgs[i].$obj.clone()
				.css({
					cursor  : 'pointer',
					width   : '60px',
					height  : '60px',
					margin  : '5px',
					opacity : 0.5
				})
				.click({idx:i}, function(event){
					self.cast('SET_SLIDE', [srl, event.data.idx]);
				})
				.appendTo($thumb);
		}

		$('#zone_gallery_navigator_status_'+srl).click(function(){ $thumb.toggle() });

		// navigation
		$zone
			.find('.__prev')
				.click(function(){ self.cast('PREV_SLIDE', [srl]); return false; })
			.end()
			.find('.__next')
				.click(function(){ self.cast('NEXT_SLIDE', [srl]); return false; })

		this._holders[key] = $holder;
		this._thumbs[key]  = $thumb;
		this._current[key] = 0;

		this.cast('SET_SLIDE', [srl, 0]);
	},
	_showSideSlide : function(srl, pos) {
		var imgs, cur, side;

		imgs = this.cast('GET_IMAGES', [srl]);
		if(!imgs.length) return;

		cur  = this._current['@'+srl];
		side = cur + pos;

		if(side < 0) side = imgs.length - 1;
		else if(side >= imgs.length) side = 0;

		this.cast('SET_SLIDE', [srl, side]);
	},
	API_NEXT_SLIDE : function(sender, params) {
		this._showSideSlide(params[0], +1);
	},
	API_PREV_SLIDE : function(sender, params) {
		this._showSideSlide(params[0], -1);
	},
	API_SET_SLIDE : function(sender, params) {
		var srl = params[0], idx = params[1], imgs, im, $holder, iwidth, w1, w2, h1, h2, scale;

		imgs = this.cast('GET_IMAGES', [srl]);
		if(!imgs.length) return;
		if(!is_def(im=imgs[idx])) return;

		// set current
		this._current['@'+srl] = idx;

		// change index indicator
		$('#zone_gallery_navigator_status_'+srl).text((idx+1)+'/'+imgs.length);

		// highlight next thunmbnail
		this._thumbs['@'+srl]
			.find('img')
				.eq(idx)
					.animate({opacity:1})
				.end()
				.not(':eq('+idx+')')
					.animate({opacity:0.5});

		// show next image smoothly
		$holder = this._holders['@'+srl];
		iwidth = $holder.parent().innerWidth();
		w1 = im.$obj.prop('width');
		h1 = im.$obj.prop('height');

		if (w1 == 0){
			w1 = im.$obj.attr('width');
		}
		if(h1 ==0){
			h1 = im.$obj.attr('height');
		}

		if(w1 > iwidth - 20) {
			w2 = iwidth - 20;
			scale = w2 / w1;
			h2 = Math.floor(h1 * scale);

			w1 = w2; h1 = h2;
			im.$obj.css('cursor', 'pointer');
			im.$obj.attr('rel', 'xe_gallery');
		}

		im.$obj.css({width:w1, height:h1, margin:'0 10px'});
		$holder.empty().append(im.$obj);
	}
});

var gallery = xe.getApp('Gallery')[0];
if(gallery) gallery.registerPlugin(new slideShow);

})(jQuery);
