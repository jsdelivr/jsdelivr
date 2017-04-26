function notiBar (opt) {
	if (typeof opt == 'string') opt = { 'message': opt }

	var settings = {
		'message': '',
		'closeButton': true,
		'font': 'sans-serif',
		'fontSize': '13px',
		'minHeight': '41px',
		'color': '#2895F1',
		'bgColor': '#f0f9ff',
		'borderBottomColor': '#96c4ea',
	};

	for (var i in opt) {
      if (opt.hasOwnProperty(i)) {
         settings[i] = opt[i];
      }
   }

    // Container 
	var noti_container = document.createElement('div');
	noti_container.id = 'duyetdev-top-notification-bar-container';
	
	// Message
	var noti_msg = document.createElement('div');
	noti_msg.className = 'top-notification-bar';
	noti_msg.innerHTML = settings.message;
	noti_container.appendChild(noti_msg);

	// Close
	if (settings.closeButton) {
		var noti_close = document.createElement('a');
		var noti_close_img = document.createElement('img');
		
		noti_close.className = 'top-notification-bar-dismiss'
		noti_close_img.src = 'https://2.bp.blogspot.com/-E8HfTec8iS8/WLptC-Qe99I/AAAAAAAAjz0/qxyVCyhcR2YOiGKx9isPzrvzsNB_ZEVzgCK4B/s400/rsz_close-button-png-23.png';
		noti_close.appendChild(noti_close_img);
		noti_close.addEventListener('click', function() {
			var notibar = document.getElementById('duyetdev-top-notification-bar-container');
			if (notibar) {
				notibar.style.display = 'none';
			}
		});

		noti_container.appendChild(noti_close);
	}

	var css = "#duyetdev-top-notification-bar-container { \
		border-bottom: 1px solid #96c4ea; \
		display: block; \
		position: fixed; \
		top: 0; \
		left: 0; \
		z-index: 9; \
		width: 100%; \
		min-height: 41px; \
		width: 100%; \
		line-height: 11px; \
	} \
	#duyetdev-top-notification-bar-container .top-notification-bar-dismiss { \
		position: absolute; \
		right: 15px; \
		top: 50%; \
		margin-top: -7px; \
		text-decoration: none; \
		cursor: pointer; \
	} \
	#duyetdev-top-notification-bar-container .top-notification-bar-dismiss img { \
		width: 10px; \
		height: 10px; \
	} \
	#duyetdev-top-notification-bar-container div.top-notification-bar { \
		text-align: center; \
		padding-top: 15px; \
	}";

	var generate_css = function(name, css_object) {
		var css_str = '' + name + '{ ';
		for (var k in css_object) {
			var v = css_object[k];
			if (parseFloat(v)) {
				css_str += k + ': ' + parseFloat(v) + 'px;';
			} else {
				css_str += k + ': ' + v + ';';
			}
		}

		return css_str + '}';
	}

	css += generate_css('#duyetdev-top-notification-bar-container', {
		'min-height': settings.minHeight,
		'background-color': settings.bgColor,
		'border-bottom-color': settings.borderBottomColor,
	});

	css += generate_css('#duyetdev-top-notification-bar-container div.top-notification-bar', {
		'font-family': settings.font,
		'font-size': settings.fontSize,
		'color': settings.color,
	});

	css += generate_css('#duyetdev-top-notification-bar-container div.top-notification-bar a', {
		'color': settings.color,
	});

	document.addEventListener("DOMContentLoaded", function(event) { 
		var body = document.body || document.getElementsByTagName('body')[0];
		var head = document.head || document.getElementsByTagName('head')[0];

		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
		body.appendChild(noti_container);
	});
}
