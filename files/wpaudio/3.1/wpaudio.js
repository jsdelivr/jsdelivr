/* 
 * WPaudio v3.1 (http://wpaudio.com)
 * by Todd Iceton (todd@wpaudio.com)
 *
 * Converts an mp3 link to a simple player styled by HTML & CSS, powered by HTML5 with SoundManager2 Flash fallback
 *
 * Copyright 2010 Todd Iceton (email: todd@wpaudio.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */


/*
 * Player CSS
 */
_wpaudio.css = {
	inline: {
		'.wpaudio-container': {
			display: 'inline-block',
			'font-family': 'Sans-serif',
			'line-height': 1,
			'*display': 'inline',
			zoom: 1
		},
		'.wpaudio-container a': {
			color: _wpaudio.style.link_color,
			'text-decoration': 'none'
		},
		'.wpaudio-container .wpaudio': {
			'font-family': _wpaudio.style.text_font,
			'font-size': _wpaudio.style.text_size,
			'font-weight': _wpaudio.style.text_weight,
			'letter-spacing': _wpaudio.style.text_letter_spacing
		},
		'.wpaudio-play': {
			margin: '0 5px 0 0',
			width: '14px',
			height: '13px',
			background: '#ccc',
			'vertical-align': 'baseline'
		},
		'.wpaudio-slide': {
			display: 'none'
		},
		'.wpaudio-bar': {
			position: 'relative',
			margin: '2px 0 0 19px',
			height: '5px',
			'font-size': '1px',
			background: _wpaudio.style.bar_base_bg
		},
		'.wpaudio-bar-playable': {
			position: 'absolute',
			top: 0,
			left: 0,
			right: '100%',
			height: '5px',
			'z-index': 11,
			background: _wpaudio.style.bar_load_bg
		},
		'.wpaudio-bar-position': {
			position: 'absolute',
			top: 0,
			left: 0,
			right: '100%',
			height: '5px',
			'z-index': 12,
			background: _wpaudio.style.bar_position_bg
		},
		'.wpaudio-bar-click': {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			width: '100%',
			height: '5px',
			'z-index': 13,
			cursor: 'pointer'
		},
		'.wpaudio-meta': {
			margin: '3px 0 0 19px',
			'font-size': '11px',
			color: _wpaudio.style.sub_color
		},
		'.wpaudio-download': {
			float: 'right'
		}
	},
	head: {
		'.wpaudio-container a:visited': {
			color: _wpaudio.style.link_color
		},
		'.wpaudio-container a:hover': {
			color: _wpaudio.style.link_hover_color
		}
	}
};


/*
 * Append CSS to head
 */
(function(){
	/*var css = 
		'.wpaudio-container {display:inline-block; zoom:1; *display:inline; line-height: 1; font-family: Sans-serif; font-size: 18px; line-height: 1;}' +
		'.wpaudio-container a, .wpaudio-container a:visited {color: #06c; text-decoration: none;}' +
		'.wpaudio-container a:hover {color: #03a;}' + 
		'.wpaudio-play {margin: 0 5px 0 0; border: 0; width: 14px; height: 13px; background: #666; vertical-align: baseline;}' +
		'.wpaudio-slide {display: none;}' +
		'.wpaudio-bar {position: relative; margin: 2px 0 0 19px; height: 5px; font-size: 1px; background: #eee;}' +
		'.wpaudio-bar-playable {position: absolute; top: 0; left: 0; right: 100%; height: 5px; z-index: 11; background: #ccc;}' +
		'.wpaudio-bar-position {position: absolute; top: 0; left: 0; right: 100%; height: 5px; z-index: 12; background: #06c;}' +
		'.wpaudio-bar-click {position: absolute; top: 0; left: 0; right: 0; width: 100%; height: 5px; z-index: 12; cursor: pointer;}' +
		'.wpaudio-meta {margin: 3px 0 0 19px; font-size: 11px; color: #888;}' +
		'.wpaudio-download {float: right;}';*/
	var css = '';
	jQuery.each( jQuery.extend( {}, _wpaudio.css.inline, _wpaudio.css.head ), function ( css_group, css_rules ) {
		css += css_group + '{';
		jQuery.each( css_rules, function ( css_item, css_value ) {
			css += css_item + ':' + css_value + ';';
		});
		// Zero margin, border, and padding if they're not specified
		if ( !css_rules.margin ) {
			css += 'margin:0;';
		}
		if ( !css_rules.border ) {
			css += 'border:0;';
		}
		if ( !css_rules.padding ) {
			css += 'padding:0;';
		}
		css += '}';
	});
	jQuery('head').append('<style type="text/css">' + css + '</style>');
}());


/* 
 * WPaudio common parent that will be appended to the mp3 link
 *
 * All interaction happens through this object, which calls the child players' control methods.
 * This takes care of click event listening and link decoration.
 */
function Wpaudio (elem) {
	this.elem = elem;
	var player;
	this.player = player;
	
	var getUrl = function () {
		return _wpaudio.enc[elem.id] ? _wpaudio.enc[elem.id] : elem.href;
	};
	this.getUrl = getUrl;
	
	var isPlaying = function () {
		return player.isPlaying();
	};
	this.isPlaying = isPlaying;
	
	var play = function () {
		// Pause all playing players before starting this one
		jQuery('.wpaudio-playing').each(function(i,v){
			v.wpaudio.pause();
		});
		player.play();
		// Mark as playing and slide down
		jQuery(elem).addClass('wpaudio-playing').parent().find('.wpaudio-slide:hidden').slideDown();
	};
	this.play = play;
	
	var pause = function () {
		player.pause();
		jQuery(elem).removeClass('wpaudio-playing');
	};
	this.pause = pause;
	
	var seek = function ( percent ) {
		if ( !isPlaying() ) {
			play();
		}
		player.seek(percent);
	};
	this.seek = seek;
	
	// Update button image, progress bars, time
	var updateDisplay = function () {
		// Get info from player
		var info = player.getInfo();
		// Set button image based on play/pause (check current and change if necessary)
		var button_url = (info.is_playing) ? _wpaudio.url + '/wpaudio-pause.png' : _wpaudio.url + '/wpaudio-play.png';
		if ( button_url !== jQuery(elem).children('.wpaudio-play').attr('src') ) {
			jQuery(elem).children('.wpaudio-play').attr( 'src', button_url );
		}
		// Set bar positions
		jQuery(elem).parent().find('.wpaudio-bar-position').css({
			left: String((info.playable_start/info.duration) || 0) + '%',
			width: String((info.position - info.playable_start) / info.duration * 100 || 0) + '%'
		});
		jQuery(elem).parent().find('.wpaudio-bar-playable').css({
			left: String((info.playable_start/info.duration) || 0) + '%',
			width: String((info.playable_end - info.playable_start) / info.duration * 100 || 0) + '%'
		});
		
		// Set time
		var min = Math.floor(info.position / 60);
		var sec = Math.floor(info.position % 60);
		var time_string = min + ':';
		if ( sec < 10 ) {
			time_string += '0'; // Add leading 0 to seconds if necessary
		}
		time_string += sec;
		jQuery(elem).parent().find('.wpaudio-position').text(time_string);
	};
	this.updateDisplay = updateDisplay;
	
	// Define the slider HTML so the next bit doesn't get too messy
	var slider =
		'<div class="wpaudio-slide">' +
			'<div class="wpaudio-bar">' +
				'<div class="wpaudio-bar-playable"></div>' +
				'<div class="wpaudio-bar-position"></div>' +
				'<div class="wpaudio-bar-click"></div>' +
			'</div>' +
			'<div class="wpaudio-meta">' +
				String( jQuery(elem).hasClass('wpaudio-nodl') ? '' : '<a class="wpaudio-download" href="' + elem.href + '">Download</a>' ) +
				'<div class="wpaudio-position"></div>' +
			'</div>' +
		'</div>';
	
	// Toggle play/pause on click and style the player
	jQuery(elem).click(function(){
		if ( isPlaying() ) {
			pause();
		}
		else {
			play();
		}
		jQuery(this).blur();
		return false;
	}).prepend('<img class="wpaudio-play" src="' + _wpaudio.url + '/wpaudio-play.png"/>').wrap('<span class="wpaudio-container"></span>').after(slider);

	// Fix slide width for IE -- in a timeout b/c Chrome shits otherwise
	jQuery(elem).parent().children('.wpaudio-slide').width(jQuery(elem).width());

	// Click bar to seek
	jQuery(elem).parent().find('.wpaudio-bar-click').mouseup(function (e) {
		if ( e.pageX ) {
			var percent = ( e.pageX - jQuery(this).offset().left ) / jQuery(this).width();
			seek(percent);
		}
	});
	
	// Initialize the player
	player = new this.Player(this);
}

/*
 * HTML5 player
 *
 * This contains controls and event handling for the native player
 */
function WpaudioHTML5 (parent) {
	var player = document.createElement('audio');
	this.player = player;
	
	this.parent = parent;
	player.src = parent.getUrl();
	player.volume = 1;
	jQuery(player).bind('play pause ended timeupdate progress canplaythrough', parent.updateDisplay);
		
	var isPlaying = function () {
		return !player.paused;
	};
	this.isPlaying = isPlaying;
	
	var getInfo = function () {
		var pos, dur, start, end;
		try {
			pos = player.currentTime;
			dur = player.duration;
			start = player.seekable.start();
			end = player.seekable.end();
		}
		catch (e) {
			pos = 0;
			dur = 0;
			start = 0;
			end = 0;
		}
		return {
			is_playing: isPlaying(),
			position: pos,
			duration: dur,
			playable_start: start,
			playable_end: end
		};
	};
	this.getInfo = getInfo;
	
	var play = function () {
		player.play();
	};
	this.play = play;
	
	this.pause = function () {
		player.pause();
	};
	
	this.seek = function ( fraction ) {
		player.currentTime = player.duration * fraction;
	};
	
	return this;
}


/*
 * SoundManager2 player
 *
 * This contains controls and event handling for the Flash player
 */
function WpaudioSM2 (par) {
	var that = this, player, parent;
	this.player = player;
	this.parent = parent;
	
	this.parent = par;
	this.player = soundManager.createSound({
		id: (par.elem.id && jQuery('#' + par.elem.id).length === 1) ? par.elem.id : 'wpaudio-' + String(Math.random()).split('.')[1] + String((new Date()).getTime()),
		url: par.getUrl(),
		onplay: par.updateDisplay,
		onresume: par.updateDisplay,
		onpause: par.updateDisplay,
		onfinish: par.updateDisplay,
		whileplaying: par.updateDisplay,
		whileloading: par.updateDisplay,
		volume: 100
	});
	
	var isPlaying = function () {
		return !(that.player.paused || that.player.playState === 0);
	};
	this.isPlaying = isPlaying;
	
	var getInfo = function () {
		return {
			is_playing: isPlaying(),
			position: that.player.position / 1000 || 0,
			duration: (((that.player.bytesLoaded == that.player.bytesTotal) ? that.player.duration : that.player.durationEstimate) / 1000) || 0,
			playable_start: 0,
			playable_end: ((that.player.bytesLoaded / that.player.bytesTotal) * that.player.duration) / 1000 || 0
		};
	};
	this.getInfo = getInfo;
	
	var play = function () {
		that.player.togglePause();
	};
	this.play = play;
	
	this.pause = function () {
		that.player.togglePause();
	};
	
	this.seek = function ( fraction ) {
		if ( !isPlaying() ) {
			play();
		}
		that.player.setPosition(((that.player.bytesLoaded == that.player.bytesTotal) ? that.player.duration : that.player.durationEstimate) * fraction);
	};
	
	return this;
}


/*
 * WPaudio ready
 *
 * When WPaudio is loaded, style and autoplay. Consider moving autoplay to the Wpaudio object (play if autoplay and no .wpaudio-playing).
 */
function wpaudioReady () {
	// Apply CSS
	jQuery.each( _wpaudio.css.inline, function ( css_group, css_rules ) {
		jQuery( css_group ).css( css_rules );
		// Zero margin, border, and padding if they're not specified
		if ( !css_rules.margin ) {
			jQuery( css_group ).css('margin', 0);
		}
		if ( !css_rules.border ) {
			jQuery( css_group ).css('border', 0);
		}
		if ( !css_rules.padding ) {
			jQuery( css_group ).css('padding', 0);
		}
	});
	// Autoplay
	if ( jQuery('.wpaudio-autoplay:first').length ) {
		jQuery('.wpaudio-autoplay:first')[0].wpaudio.play();
	}
}


/*
 * Initialize WPaudio players
 *
 * Detect HTML5 support, set WPaudio player to either HTML5 or SM2, and initialize WPaudio players
 */
jQuery(document).ready(function(){
	var wpaudio_selector = '.wpaudio, .wpaudio-autoplay';
	// Handle all mp3 links if selected
	if ( _wpaudio.convert_mp3_links ) {
		jQuery('a[href$=.mp3]').addClass('wpaudio');
	}
	// Detect HTML5
	var _wpaudio_html5 = document.createElement('audio');
	if (!!(_wpaudio_html5.canPlayType && _wpaudio_html5.canPlayType('audio/mpeg;').replace(/no/, ''))) {
		Wpaudio.prototype.Player = WpaudioHTML5;
		jQuery(wpaudio_selector).each(function(i,v){
			v.wpaudio = new Wpaudio(v);
		});
		wpaudioReady();
	}
	// SoundManager2 fallback
	else {
		if ( typeof soundManager !== 'object' ) {
			jQuery.getScript( _wpaudio.url + '/sm2/soundmanager2-nodebug-jsmin.js', function () {
				if ( typeof soundManager === 'object' ) {
					soundManager.debugMode = false;
					soundManager.url =  _wpaudio.url + '/sm2/';
					soundManager.nullURL = 'about:blank'; //_wpaudio.url + '/sm2/null.mp3';
					soundManager.useHighPerformance = true;
					soundManager.useFastPolling = false;
					soundManager.waitForWindowLoad = false;
					soundManager.onready(function(){
						jQuery(wpaudio_selector).each(function(i,v){
							v.wpaudio = new Wpaudio(v);
						});
						wpaudioReady();
					});
				}
			});
		}
		Wpaudio.prototype.Player = WpaudioSM2;
	}
});


// Preload play + pause images -- play first!
(function(){
	var play = new Image(), pause = new Image();
	play.src = _wpaudio.url + '/wpaudio-play.png';
	jQuery( play ).load(function () {
		pause.src = _wpaudio.url + '/wpaudio-pause.png';
	});
}());