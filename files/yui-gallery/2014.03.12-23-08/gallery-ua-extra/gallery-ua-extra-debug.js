YUI.add('gallery-ua-extra', function(Y) {

	var UA = Y.UA,
		HTML = Y.one('html'),
		uaStr,
		browser;
	
	/* ADD THE OS */
	if (UA.os == 'macintosh') {
		HTML.addClass('mac');
	} else if (UA.os == 'windows') {
		HTML.addClass('win');
	} else {
		HTML.addClass(UA.os);
	}
	
	/* ADD THE RENDERER */
	if(UA.ie){
		UA.renderer = 'trident';
	}else if(UA.gecko){
		UA.renderer = 'gecko';
	}else if(UA.webkit){
		UA.renderer = 'webkit';
	}else if(UA.opera){
		UA.renderer = 'presto';
	}
	HTML.addClass(UA.renderer);
	
	/* ADD THE BROWSER */
	uaStr = Y.config.win && Y.config.win.navigator && Y.config.win.navigator.userAgent;
	if(uaStr){
		browser = /(Firefox|Opera|Chrome|Safari|KDE|iCab|Flock|IE)/.exec(uaStr);
		browser = ((!browser || !browser.length) ? (/(Mozilla)/.exec(uaStr) || ['']) : browser);
		UA.browser = browser[0].toLowerCase();
		HTML.addClass(UA.browser);
	}
	
	/* ADD MOBILE AND SECURE */
	if(UA.mobile){//add in mobile
		HTML.addClass('mobile');
	}
	if(UA.secure){//add in secure
		HTML.addClass('secure');
	}


}, 'gallery-2010.08.25-19-45' ,{requires:['node-base']});
