//**************************************************************************************************/
//	Lytebox v5.5
//
//	 Author: Markus F. Hay
//  Website: http://lytebox.com  (http://dolem.com/lytebox)
//	   Date: January 26, 2012
//	License: Creative Commons Attribution 3.0 License (http://creativecommons.org/licenses/by/3.0/)
//**************************************************************************************************/
function Lytebox(bInitialize, aHttp) {
	/*** Language Configuration ***/
	
		// English - configure for your language or customize as needed. 
		// Note that these values will be seen by users when mousing over buttons.
		this.label = new Object();
		this.label['close']		= 'Close (Esc)';
		this.label['prev'] 		= 'Previous (\u2190)';	// Previous (left arrow)
		this.label['next'] 		= 'Next (\u2192)'; 		// Next (right arrow)
		this.label['play'] 		= 'Play (spacebar)';
		this.label['pause'] 	= 'Pause (spacebar)';
		this.label['print'] 	= 'Print';
		this.label['image'] 	= 'Image %1 of %2';		// %1 = active image, %2 = total images
		this.label['page'] 		= 'Page %1 of %2'; 		// %1 = active page, %2 = total pages
		
	
	/*** Configure Lytebox ***/
	
		this.theme   			= (typeof lyteboxTheme !== 'undefined') && /^(black|grey|red|green|blue|gold|orange)$/i.test(lyteboxTheme) ? lyteboxTheme : 'black'; // themes: black (default), grey, red, green, blue, gold, orange
		this.roundedBorder		= true; 		// controls whether or not the viewer uses rounded corners (false = square corners)
		this.innerBorder		= true;			// controls whether to show the inner border around image/html content
		this.outerBorder		= true;			// controls whether to show the outer grey (or theme) border
		this.resizeSpeed		= 5;			// controls the speed of the image resizing (1=slowest and 10=fastest)
		this.maxOpacity			= 80;			// higher opacity = darker overlay, lower opacity = lighter overlay
		this.borderSize			= 12;			// if you adjust the padding in the CSS, you will need to update this variable -- otherwise, leave this alone...
		this.appendQS			= false;		// if true, will append request_from=lytebox to the QS. Use this with caution as it may cause pages to not render
		this.fixedPosition		= this.isMobile() ? false : true;	// if true, viewer will remain in a fixed position, otherwise page scrolling will be allowed
		this.inherit			= true;			// controls whether or not data-lyte-options are inherited from the first link in a grouped set
		
		this.__hideObjects		= true;			// controls whether or not objects (such as Flash, Java, etc.) should be hidden when the viewer opens
		this.__autoResize		= true;			// controls whether or not images should be resized if larger than the browser window dimensions
		this.__doAnimations		= true;			// controls ALL animation effects (i.e. overlay fade in/out, image resize transition, etc.)
		this.__animateOverlay	= false;		// controls ONLY the overlay (background darkening) effects, and whether or not to fade in/out
		this.__forceCloseClick 	= false;		// if true, users are forced to click on the "Close" button when viewing content
		this.__refreshPage		= false;		// force page refresh after closing Lytebox
		this.__showPrint		= false;		// true to show print button, false to hide
		this.__navType			= 3;			// 1 = "Prev/Next" buttons on top left and left
												// 2 = "Prev/Next" buttons in navigation bar
												// 3 = navType_1 + navType_2 (show both)
													
		// These two options control the position of the title/counter and navigation buttons. Note that for mobile devices,
		// the title is displayed on top and the navigation on the bottom. This is due to the view area being limited.
		// You can customize this for non-mobile devices by changing the 2nd condition (: false) to true (: true)
		this.__navTop			= this.isMobile() ? false : false; // true to show the buttons on the top right, false to show them on bottom right (default)
		this.__titleTop			= this.isMobile() ? true : false;  // true to show the title on the top left, false to show it on the bottom left (default)
	
	
	/*** Configure HTML Content / Media Viewer Options ***/
	
		this.__width			= '80%';		// default width of content viewer
		this.__height			= '80%';		// default height of content viewer
		this.__scrolling		= 'auto';		// controls whether or not scrolling is allowed in the content viewer -- options are auto|yes|no
		this.__loopPlayback		= false;		// controls whether or not embedded media is looped (swf, avi, mov, etc.)
		this.__autoPlay			= true;			// controls whether or not to autoplay embedded media
		this.__autoEmbed		= true;			// controls whether or not to automatically embed media in an object tag
	
	
	/*** Configure Slideshow Options ***/
	
		this.__slideInterval	= 4000;			// change value (milliseconds) to increase/decrease the time between "slides"
		this.__showNavigation	= false;		// true to display Next/Prev buttons/text during slideshow, false to hide
		this.__showClose		= true;			// true to display the Close button, false to hide
		this.__showDetails		= true;			// true to display image details (caption, count), false to hide
		this.__showPlayPause	= true;			// true to display pause/play buttons next to close button, false to hide
		this.__autoEnd			= true;			// true to automatically close Lytebox after the last image is reached, false to keep open
		this.__pauseOnNextClick	= false;		// true to pause the slideshow when the "Next" button is clicked
		this.__pauseOnPrevClick = true;			// true to pause the slideshow when the "Prev" button is clicked
		this.__loopSlideshow	= false;		// true to continuously loop through slides, false otherwise
	
	
	/*** Configure Event Callbacks ***/
	
		this.__beforeStart		= '';			// function to call before the viewer starts
		this.__afterStart		= '';			// function to call after the viewer starts
		this.__beforeEnd		= '';			// function to call before the viewer ends (after close click)
		this.__afterEnd			= '';			// function to call after the viewer ends
	
		
	/*** Configure Lytetip (tooltips) Options ***/
		this.__changeTipCursor 	= true; 		// true to change the cursor to 'help', false to leave default (inhereted)
		this.__tipDecoration	= 'dotted';		// controls the text-decoration (underline) of the tip link (dotted|solid|none)
		this.__tipStyle 		= 'classic';	// sets the default tip style if none is specified via data-lyte-options. Possible values are classic, info, help, warning, error
		this.__tipRelative		= true;			// if true, tips will be positioned relative to the element. if false, tips will be absolutely positioned on the page.
												// if you are having issues with tooltips not being properly positioned, then set this to false


	this.navTypeHash = new Object();
	this.navTypeHash['Hover_by_type_1'] 	= true;
	this.navTypeHash['Display_by_type_1'] 	= false;
	this.navTypeHash['Hover_by_type_2'] 	= false;
	this.navTypeHash['Display_by_type_2']	= true;
	this.navTypeHash['Hover_by_type_3'] 	= true;
	this.navTypeHash['Display_by_type_3'] 	= true;
	this.resizeWTimerArray		= new Array();
	this.resizeWTimerCount		= 0;
	this.resizeHTimerArray		= new Array();
	this.resizeHTimerCount		= 0;
	this.changeContentTimerArray= new Array();
	this.changeContentTimerCount= 0;
	this.overlayTimerArray		= new Array();
	this.overlayTimerCount		= 0;
	this.imageTimerArray		= new Array();
	this.imageTimerCount		= 0;
	this.timerIDArray			= new Array();
	this.timerIDCount			= 0;
	this.slideshowIDArray		= new Array();
	this.slideshowIDCount		= 0;
	this.imageArray	 = new Array();
	this.slideArray	 = new Array();
	this.frameArray	 = new Array();
	this.contentNum = null;
	this.aPageSize = new Array();
	this.overlayLoaded = false;
	this.checkFrame();
	this.isSlideshow 	= false;
	this.isLyteframe 	= false;
	this.tipSet	 		= false;
	this.ieVersion = this.ffVersion = this.chromeVersion = this.operaVersion = this.safariVersion = -1;
	this.ie = this.ff = this.chrome = this.opera = this.safari = false;
	this.setBrowserInfo();
	this.classAttribute = (((this.ie && this.doc.compatMode == 'BackCompat') || (this.ie && this.ieVersion <= 7)) ? 'className' : 'class');
	this.classAttribute = (this.ie && (document.documentMode == 8 || document.documentMode == 9)) ? 'class' : this.classAttribute;
	this.isReady = false;
	if (bInitialize) {
		this.http = aHttp;
		this.bodyOnscroll = document.body.onscroll;
		if(this.resizeSpeed > 10) { this.resizeSpeed = 10; }
		if(this.resizeSpeed < 1) { this.resizeSpeed = 1; }
		var ie8Duration = 2;
			var isWinXP = (navigator.userAgent.match(/windows nt 5.1/i) || navigator.userAgent.match(/windows nt 5.2/i) ? true : false);
		this.resizeDuration = (11 - this.resizeSpeed) * (this.ie ? (this.ieVersion >= 9 ? 6 : (this.ieVersion == 8 ? (this.doc.compatMode == 'BackCompat' ? ie8Duration : ie8Duration - 1) : 3)) : 7);
			this.resizeDuration = this.ff ? (11 - this.resizeSpeed) * (this.ffVersion < 6 ? 3 : (isWinXP ? 6 : 12)) : this.resizeDuration;
		this.resizeDuration = this.chrome ? (11 - this.resizeSpeed) * 5 : this.resizeDuration;
		this.resizeDuration = this.safari ? (11 - this.resizeSpeed) * 20 : this.resizeDuration;
			this.resizeDuration = this.isMobile() ? (11 - this.resizeSpeed) * 2 : this.resizeDuration;
		if (window.name != 'lbIframe') {
			this.initialize();
		}
	} else {
		this.http = new Array();
		if (typeof $ == 'undefined') {
			$ = function (id) {
					if ($.cache[id] === undefined) {
						$.cache[id] = document.getElementById(id) || false;
					}
					return $.cache[id];
				};
			$.cache = {};
		}
	}
}
Lytebox.prototype.setBrowserInfo = function() {
	var ua = navigator.userAgent.toLowerCase();
	this.chrome = ua.indexOf('chrome') > -1;
	this.ff = ua.indexOf('firefox') > -1;
	this.safari = !this.chrome && ua.indexOf('safari') > -1;
	this.opera = ua.indexOf('opera') > -1;
	this.ie = false;
	if (this.chrome) {
		var re = new RegExp("chrome/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			this.chromeVersion = parseInt( RegExp.$1 );
		}
	}
	if (this.ff) {
		var re = new RegExp("firefox/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			this.ffVersion = parseInt( RegExp.$1 );
		}
	}
	if (this.ie) {
		var re = new RegExp("msie ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			this.ieVersion = parseInt( RegExp.$1 );
		}
	}
	if (this.opera) {
		var re = new RegExp("opera/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			this.operaVersion = parseInt( RegExp.$1 );
		}
	}
	if (this.safari) {
		var re = new RegExp("version/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			this.safariVersion = parseInt( RegExp.$1 );
		}
	}
};
Lytebox.prototype.initialize = function() {
	this.updateLyteboxItems();
	var oBody = this.doc.getElementsByTagName('body').item(0);
	if (this.doc.$('lbOverlay')) { oBody.removeChild(this.doc.$('lbOverlay')); }
	if (this.doc.$('lbMain')) {	oBody.removeChild(this.doc.$('lbMain')); }
	if (this.doc.$('lbLauncher')) { oBody.removeChild(this.doc.$('lbLauncher')); }
	var oLauncher = this.doc.createElement('a');
		oLauncher.setAttribute('id','lbLauncher');
		oLauncher.setAttribute(this.classAttribute, 'lytebox');
		oLauncher.style.display = 'none';
		oBody.appendChild(oLauncher);
	var oOverlay = this.doc.createElement('div');
		oOverlay.setAttribute('id','lbOverlay');
		oOverlay.setAttribute(this.classAttribute, this.theme);
		if (this.ie && (this.ieVersion <= 6 || (this.ieVersion <= 9 && this.doc.compatMode == 'BackCompat'))) {
			oOverlay.style.position = 'absolute';
		}
		oOverlay.style.display = 'none';
		oBody.appendChild(oOverlay);
	var oLytebox = this.doc.createElement('div');
		oLytebox.setAttribute('id','lbMain');
		oLytebox.style.display = 'none';
		oBody.appendChild(oLytebox);
	var oOuterContainer = this.doc.createElement('div');
		oOuterContainer.setAttribute('id','lbOuterContainer');
		oOuterContainer.setAttribute(this.classAttribute, this.theme);
		if (this.roundedBorder) {
			oOuterContainer.style.MozBorderRadius = '8px';
			oOuterContainer.style.borderRadius = '8px';
		}
		oLytebox.appendChild(oOuterContainer);
	var oTopContainer = this.doc.createElement('div');
		oTopContainer.setAttribute('id','lbTopContainer');
		oTopContainer.setAttribute(this.classAttribute, this.theme);
		if (this.roundedBorder) {
			oTopContainer.style.MozBorderRadius = '8px';
			oTopContainer.style.borderRadius = '8px';
		}
		oOuterContainer.appendChild(oTopContainer);
	var oTopData = this.doc.createElement('div');
		oTopData.setAttribute('id','lbTopData');
		oTopData.setAttribute(this.classAttribute, this.theme);
		oTopContainer.appendChild(oTopData);
	var oTitleTop = this.doc.createElement('span');
		oTitleTop.setAttribute('id','lbTitleTop');
		oTopData.appendChild(oTitleTop);
	var oNumTop = this.doc.createElement('span');
		oNumTop.setAttribute('id','lbNumTop');
		oTopData.appendChild(oNumTop);
	var oTopNav = this.doc.createElement('div');
		oTopNav.setAttribute('id','lbTopNav');
		oTopContainer.appendChild(oTopNav);
	var oCloseTop = this.doc.createElement('a');
		oCloseTop.setAttribute('id','lbCloseTop');
		oCloseTop.setAttribute('title', this.label['close']);
		oCloseTop.setAttribute(this.classAttribute, this.theme);
		oCloseTop.setAttribute('href','javascript:void(0)');
		oTopNav.appendChild(oCloseTop);
	var oPrintTop = this.doc.createElement('a');
		oPrintTop.setAttribute('id','lbPrintTop')
		oPrintTop.setAttribute('title', this.label['print']);
		oPrintTop.setAttribute(this.classAttribute, this.theme);
		oPrintTop.setAttribute('href','javascript:void(0)');
		oTopNav.appendChild(oPrintTop);
	var oNextTop = this.doc.createElement('a');
		oNextTop.setAttribute('id','lbNextTop');
		oNextTop.setAttribute('title', this.label['next']);
		oNextTop.setAttribute(this.classAttribute, this.theme);
		oNextTop.setAttribute('href','javascript:void(0)');
		oTopNav.appendChild(oNextTop);
	var oPauseTop = this.doc.createElement('a');
		oPauseTop.setAttribute('id','lbPauseTop');
		oPauseTop.setAttribute('title', this.label['pause']);
		oPauseTop.setAttribute(this.classAttribute, this.theme);
		oPauseTop.setAttribute('href','javascript:void(0)');
		oPauseTop.style.display = 'none';
		oTopNav.appendChild(oPauseTop);
	var oPlayTop = this.doc.createElement('a');
		oPlayTop.setAttribute('id','lbPlayTop');
		oPlayTop.setAttribute('title', this.label['play']);
		oPlayTop.setAttribute(this.classAttribute, this.theme);
		oPlayTop.setAttribute('href','javascript:void(0)');
		oPlayTop.style.display = 'none';
		oTopNav.appendChild(oPlayTop);
	var oPrevTop = this.doc.createElement('a');
		oPrevTop.setAttribute('id','lbPrevTop');
		oPrevTop.setAttribute('title', this.label['prev']);
		oPrevTop.setAttribute(this.classAttribute, this.theme);
		oPrevTop.setAttribute('href','javascript:void(0)');
		oTopNav.appendChild(oPrevTop);
	var oIframeContainer = this.doc.createElement('div');
		oIframeContainer.setAttribute('id','lbIframeContainer');
		oIframeContainer.style.display = 'none';
		oOuterContainer.appendChild(oIframeContainer);
	var oIframe = this.doc.createElement('iframe');
		oIframe.setAttribute('id','lbIframe');
		oIframe.setAttribute('name','lbIframe')
		oIframe.setAttribute('frameBorder','0');
		if (this.innerBorder) {
			oIframe.setAttribute(this.classAttribute, this.theme);
		}
		oIframe.style.display = 'none';
		oIframeContainer.appendChild(oIframe);
	var oImageContainer = this.doc.createElement('div');
		oImageContainer.setAttribute('id','lbImageContainer');
		oOuterContainer.appendChild(oImageContainer);
	var oLyteboxImage = this.doc.createElement('img');
		oLyteboxImage.setAttribute('id','lbImage');
		if (this.innerBorder) {
			oLyteboxImage.setAttribute(this.classAttribute, this.theme);
		}
		oImageContainer.appendChild(oLyteboxImage);
	var oLoading = this.doc.createElement('div');
		oLoading.setAttribute('id','lbLoading');
		oLoading.setAttribute(this.classAttribute, this.theme);
		oOuterContainer.appendChild(oLoading);
	var oBottomContainer = this.doc.createElement('div');
		oBottomContainer.setAttribute('id','lbBottomContainer');
		oBottomContainer.setAttribute(this.classAttribute, this.theme);
		if (this.roundedBorder) {
			oBottomContainer.style.MozBorderRadius = '8px';
			oBottomContainer.style.borderRadius = '8px';
		}
		oOuterContainer.appendChild(oBottomContainer);
	var oDetailsBottom = this.doc.createElement('div');
		oDetailsBottom.setAttribute('id','lbBottomData');
		oDetailsBottom.setAttribute(this.classAttribute, this.theme);
		oBottomContainer.appendChild(oDetailsBottom);
	var oTitleBottom = this.doc.createElement('span');
		oTitleBottom.setAttribute('id','lbTitleBottom');
		oDetailsBottom.appendChild(oTitleBottom);
	var oNumBottom = this.doc.createElement('span');
		oNumBottom.setAttribute('id','lbNumBottom');
		oDetailsBottom.appendChild(oNumBottom);
	var oDescBottom = this.doc.createElement('span');
		oDescBottom.setAttribute('id','lbDescBottom');
		oDetailsBottom.appendChild(oDescBottom);
	var oHoverNav = this.doc.createElement('div');
		oHoverNav.setAttribute('id','lbHoverNav');
		oImageContainer.appendChild(oHoverNav);
	var oBottomNav = this.doc.createElement('div');
		oBottomNav.setAttribute('id','lbBottomNav');
		oBottomContainer.appendChild(oBottomNav);
	var oPrevHov = this.doc.createElement('a');
		oPrevHov.setAttribute('id','lbPrevHov');
		oPrevHov.setAttribute('title', this.label['prev']);
		oPrevHov.setAttribute(this.classAttribute, this.theme);
		oPrevHov.setAttribute('href','javascript:void(0)');
		oHoverNav.appendChild(oPrevHov);
	var oNextHov = this.doc.createElement('a');
		oNextHov.setAttribute('id','lbNextHov');
		oNextHov.setAttribute('title', this.label['next']);
		oNextHov.setAttribute(this.classAttribute, this.theme);
		oNextHov.setAttribute('href','javascript:void(0)');
		oHoverNav.appendChild(oNextHov);
	var oClose = this.doc.createElement('a');
		oClose.setAttribute('id','lbClose');
		oClose.setAttribute('title', this.label['close']);
		oClose.setAttribute(this.classAttribute, this.theme);
		oClose.setAttribute('href','javascript:void(0)');
		oBottomNav.appendChild(oClose);
	var oPrint = this.doc.createElement('a');
		oPrint.setAttribute('id','lbPrint');
		oPrint.setAttribute('title', this.label['print']);
		oPrint.setAttribute(this.classAttribute, this.theme);
		oPrint.setAttribute('href','javascript:void(0)');
		oPrint.style.display = 'none';
		oBottomNav.appendChild(oPrint);
	var oNext = this.doc.createElement('a');
		oNext.setAttribute('id','lbNext');
		oNext.setAttribute('title', this.label['next']);
		oNext.setAttribute(this.classAttribute, this.theme);
		oNext.setAttribute('href','javascript:void(0)');
		oBottomNav.appendChild(oNext);
	var oPause = this.doc.createElement('a');
		oPause.setAttribute('id','lbPause');
		oPause.setAttribute('title', this.label['pause']);
		oPause.setAttribute(this.classAttribute, this.theme);
		oPause.setAttribute('href','javascript:void(0)');
		oPause.style.display = 'none';
		oBottomNav.appendChild(oPause);
	var oPlay = this.doc.createElement('a');
		oPlay.setAttribute('id','lbPlay');
		oPlay.setAttribute('title', this.label['play']);
		oPlay.setAttribute(this.classAttribute, this.theme);
		oPlay.setAttribute('href','javascript:void(0)');
		oPlay.style.display = 'none';
		oBottomNav.appendChild(oPlay);
	var oPrev = this.doc.createElement('a');
		oPrev.setAttribute('id','lbPrev');
		oPrev.setAttribute('title', this.label['prev']);
		oPrev.setAttribute(this.classAttribute, this.theme);
		oPrev.setAttribute('href','javascript:void(0)');
		oBottomNav.appendChild(oPrev);
	var iframes = (this.isFrame && window.parent.frames[window.name].document) ? window.parent.frames[window.name].document.getElementsByTagName('iframe') : document.getElementsByTagName('iframe');
	for (var i = 0; i < iframes.length; i++) {
		if (/youtube/i.test(iframes[i].src)) {
			iframes[i].src += ((/\?/.test(iframes[i].src)) ? '&' : '?') + 'wmode=transparent';
		}
	}
	this.isReady = true;
};
Lytebox.prototype.updateLyteboxItems = function() {
	var anchors = (this.isFrame && window.parent.frames[window.name].document) ? window.parent.frames[window.name].document.getElementsByTagName('a') : document.getElementsByTagName('a');
		anchors = (this.isFrame) ? anchors : document.getElementsByTagName('a');
	var areas = (this.isFrame && window.parent.frames[window.name].document) ? window.parent.frames[window.name].document.getElementsByTagName('area') : document.getElementsByTagName('area');
	var lyteLinks = this.combine(anchors, areas);
	var myLink = relAttribute = revAttribute = classAttribute = dataOptions = dataTip = tipDecoration = tipStyle = tipImage = tipHtml = aSetting = sName = sValue = sExt = aUrl = null;
	var bImage = bRelative = false;
	for (var i = 0; i < lyteLinks.length; i++) {
		myLink = lyteLinks[i];
		relAttribute = String(myLink.getAttribute('rel'));
		classAttribute = String(myLink.getAttribute(this.classAttribute));
		if (myLink.getAttribute('href')) {
			sType = classAttribute.match(/lytebox|lyteshow|lyteframe/i);
			sType = this.isEmpty(sType) ? relAttribute.match(/lytebox|lyteshow|lyteframe/i) : sType;
			dataOptions = String(myLink.getAttribute('data-lyte-options'));
			dataOptions = this.isEmpty(dataOptions) ? String(myLink.getAttribute('rev')) : dataOptions;
			aUrl = myLink.getAttribute('href').split('?');
			sExt = aUrl[0].split('.').pop().toLowerCase();
			bImage = (sExt == 'png' || sExt == 'jpg' || sExt == 'jpeg' || sExt == 'gif' || sExt == 'bmp');
			if (sType && sType.length >= 1) {
				if (this.isMobile() && /youtube/i.test(myLink.getAttribute('href'))) {
					myLink.target = '_blank';
				} else if (bImage && (dataOptions.match(/slide:true/i) || sType[0].toLowerCase() == 'lyteshow')) {
					myLink.onclick = function () { $lb.start(this, true, false); return false; }
				} else if (bImage) {
					myLink.onclick = function () { $lb.start(this, false, false); return false; }
				} else {
					myLink.onclick = function () { $lb.start(this, false, true); return false; }
				}
			}
			dataTip = String(myLink.getAttribute('data-tip'));
			dataTip = this.isEmpty(dataTip) ? myLink.getAttribute('title') : dataTip;
			if (classAttribute.toLowerCase().match('lytetip') && !this.isEmpty(dataTip) && !this.tipsSet) {
				if (this.__changeTipCursor) { myLink.style.cursor = 'help'; }
				tipDecoration = this.__tipDecoration;
				tipStyle = this.__tipStyle;
				bRelative = this.__tipRelative;
				if (!this.isEmpty(dataOptions)) {
					aOptions = dataOptions.split(' ');
					for (var j = 0; j < aOptions.length; j++) {
						aSetting = aOptions[j].split(':');
						sName = (aSetting.length > 1 ? this.trim(aSetting[0]).toLowerCase() : '');
						sValue = (aSetting.length > 1 ? this.trim(aSetting[1]) : '');
						switch(sName) {
							case 'tipstyle':
								tipStyle = (/classic|info|help|warning|error/.test(sValue) ? sValue : tipStyle); break;
							case 'changetipcursor':
								myLink.style.cursor = (/true|false/.test(sValue) ? (sValue == 'true' ? 'help' : '') : myLink.style.cursor); break;
							case 'tiprelative':
								bRelative = (/true|false/.test(sValue) ? (sValue == 'true') : bRelative); break;
							case 'tipdecoration':
								tipDecoration = (/dotted|solid|none/.test(sValue) ? sValue : tipDecoration); break;
						}
					}
				}
				if (tipDecoration != 'dotted') {
					myLink.style.borderBottom = (tipDecoration == 'solid' ? '1px solid' : 'none');
				}
				switch(tipStyle) {
					case 'info': tipStyle = 'lbCustom lbInfo'; tipImage = 'lbTipImg lbInfoImg'; break;
					case 'help': tipStyle = 'lbCustom lbHelp'; tipImage = 'lbTipImg lbHelpImg'; break;
					case 'warning': tipStyle = 'lbCustom lbWarning'; tipImage = 'lbTipImg lbWarningImg'; break;
					case 'error': tipStyle = 'lbCustom lbError'; tipImage = 'lbTipImg lbErrorImg'; break;
					case 'classic': tipStyle = 'lbClassic'; tipImage = ''; break;
					default: tipStyle = 'lbClassic'; tipImage = '';
				}
				if ((this.ie && this.ieVersion <= 7) || (this.ieVersion == 8 && this.doc.compatMode == 'BackCompat')) {
					tipImage = '';
					if (tipStyle != 'lbClassic' && !this.isEmpty(tipStyle)) {
						tipStyle += ' lbIEFix';
					}
				}
				var aLinkPos = this.findPos(myLink);
				if ((this.ie && (this.ieVersion <= 6 || this.doc.compatMode == 'BackCompat')) || bRelative) {
					myLink.style.position = 'relative';
				}
				tipHtml = myLink.innerHTML;
				myLink.innerHTML = '';
				if ((this.ie && this.ieVersion <= 6 && this.doc.compatMode != 'BackCompat') || bRelative) {
					myLink.innerHTML = tipHtml + '<span class="' + tipStyle + '">' + (tipImage ? '<div class="' + tipImage + '"></div>' : '') + dataTip + '</span>';
				} else {
					myLink.innerHTML = tipHtml + '<span class="' + tipStyle + '" style="left:'+aLinkPos[0]+'px;top:'+(aLinkPos[1]+aLinkPos[2])+'px;">' + (tipImage ? '<div class="' + tipImage + '"></div>' : '') + dataTip + '</span>';
				}
				if (classAttribute.match(/lytebox|lyteshow|lyteframe/i) == null) {
					myLink.setAttribute('title','');
				}
			}
		}
	}
	this.tipsSet = true;
};
Lytebox.prototype.launch = function(args) {
	var sUrl = this.isEmpty(args.url) ? '' : String(args.url);
	var sOptions = this.isEmpty(args.options) ? '' : String(args.options);
	var sTitle = this.isEmpty(args.title) ? '' : args.title;
	var sDesc = this.isEmpty(args.description) ? '' : args.description;
	var bSlideshow = /slide:true/i.test(sOptions);
	if (this.isEmpty(sUrl)) {
		return false;
	}
	if (!this.isReady) {
		this.timerIDArray[this.timerIDCount++] = setTimeout("$lb.launch({ url: '" + sUrl + "', options: '" + sOptions + "', title: '" + sTitle + "', description: '" + sDesc + "' })", 100);
		return;
	} else {
		for (var i = 0; i < this.timerIDCount; i++) { window.clearTimeout(this.timerIDArray[i]); }
	}
	var aUrl = sUrl.split('?');
	var sExt = aUrl[0].split('.').pop().toLowerCase();
	var bImage = (sExt == 'png' || sExt == 'jpg' || sExt == 'jpeg' || sExt == 'gif' || sExt == 'bmp');
	var oLauncher = this.doc.$('lbLauncher');
		oLauncher.setAttribute('href', sUrl);
		oLauncher.setAttribute('data-lyte-options', sOptions);
		oLauncher.setAttribute('data-title', sTitle);
		oLauncher.setAttribute('data-description', sDesc);
	this.updateLyteboxItems();
	this.start(oLauncher, bSlideshow, (bImage ? false : true));
};
Lytebox.prototype.start = function(oLink, bSlideshow, bFrame) {
	var dataOptions = String(oLink.getAttribute('data-lyte-options'));
		dataOptions = this.isEmpty(dataOptions) ? String(oLink.getAttribute('rev')) : dataOptions;
	this.setOptions(dataOptions);
	this.isSlideshow = (bSlideshow ? true : false);
	this.isLyteframe = (bFrame ? true : false);
	if (!this.isEmpty(this.beforeStart)) {
		var callback = window[this.beforeStart];
		if (typeof callback === 'function') {
			if (!callback(this.args)) { return; }
		}
	}
	if (this.ie && this.ieVersion <= 6) { this.toggleSelects('hide'); }
	if (this.hideObjects) { this.toggleObjects('hide'); }
	if (this.isFrame && window.parent.frames[window.name].document) {
		window.parent.$lb.printId = (this.isLyteframe ? 'lbIframe' : 'lbImage');
	} else {
		this.printId = (this.isLyteframe ? 'lbIframe' : 'lbImage');
	}
	this.aPageSize	= this.getPageSize();
	var objOverlay	= this.doc.$('lbOverlay');
	var objBody		= this.doc.getElementsByTagName("body").item(0);
	objOverlay.style.height = this.aPageSize[1] + "px";
	objOverlay.style.display = '';
	this.fadeIn({ id: 'lbOverlay', opacity: (this.doAnimations && this.animateOverlay && (!this.ie || this.ieVersion >= 9) ? 0 : this.maxOpacity) });
	var anchors = (this.isFrame && window.parent.frames[window.name].document) ? window.parent.frames[window.name].document.getElementsByTagName('a') : document.getElementsByTagName('a');
		anchors = (this.isFrame) ? anchors : document.getElementsByTagName('a');
	var areas = (this.isFrame && window.parent.frames[window.name].document) ? window.parent.frames[window.name].document.getElementsByTagName('area') : document.getElementsByTagName('area');
	var lyteLinks = this.combine(anchors, areas);
	var sType = sExt = aUrl = null;
	this.frameArray = [];
	this.frameNum = 0;
	this.imageArray = [];
	this.imageNum = 0;
	this.slideArray = [];
	this.slideNum = 0;
	if (this.isEmpty(this.group)) {
		dataOptions = String(oLink.getAttribute('data-lyte-options'));
		dataOptions = this.isEmpty(dataOptions) ? String(oLink.getAttribute('rev')) : dataOptions;
		if (this.isLyteframe) {			
			this.frameArray.push(new Array(oLink.getAttribute('href'), (!this.isEmpty(oLink.getAttribute('data-title')) ? oLink.getAttribute('data-title') : oLink.getAttribute('title')), oLink.getAttribute('data-description'), dataOptions));
		} else {
			this.imageArray.push(new Array(oLink.getAttribute('href'), (!this.isEmpty(oLink.getAttribute('data-title')) ? oLink.getAttribute('data-title') : oLink.getAttribute('title')), oLink.getAttribute('data-description'), dataOptions));
		}
	} else {
		for (var i = 0; i < lyteLinks.length; i++) {
			var myLink = lyteLinks[i];
			dataOptions = String(myLink.getAttribute('data-lyte-options'));
			dataOptions = this.isEmpty(dataOptions) ? String(myLink.getAttribute('rev')) : dataOptions;
			if (myLink.getAttribute('href') && dataOptions.toLowerCase().match('group:' + this.group)) {
				sType = String(myLink.getAttribute(this.classAttribute)).match(/lytebox|lyteshow|lyteframe/i);
				sType = this.isEmpty(sType) ? myLink.getAttribute('rel').match(/lytebox|lyteshow|lyteframe/i) : sType;
				aUrl = myLink.getAttribute('href').split('?');
				sExt = aUrl[0].split('.').pop().toLowerCase();
				bImage = (sExt == 'png' || sExt == 'jpg' || sExt == 'jpeg' || sExt == 'gif' || sExt == 'bmp');
				if (sType && sType.length >= 1) {
					if (bImage && (dataOptions.match(/slide:true/i) || sType[0].toLowerCase() == 'lyteshow')) {
						this.slideArray.push(new Array(myLink.getAttribute('href'), (!this.isEmpty(myLink.getAttribute('data-title')) ? myLink.getAttribute('data-title') : myLink.getAttribute('title')), myLink.getAttribute('data-description'), dataOptions));
					} else if (bImage) {
						this.imageArray.push(new Array(myLink.getAttribute('href'), (!this.isEmpty(myLink.getAttribute('data-title')) ? myLink.getAttribute('data-title') : myLink.getAttribute('title')), myLink.getAttribute('data-description'), dataOptions));
					} else {
						this.frameArray.push(new Array(myLink.getAttribute('href'), (!this.isEmpty(myLink.getAttribute('data-title')) ? myLink.getAttribute('data-title') : myLink.getAttribute('title')), myLink.getAttribute('data-description'), dataOptions));
					}
				}
			}
		}
		if (this.isLyteframe) {
			this.frameArray = this.removeDuplicates(this.frameArray);
			while(this.frameArray[this.frameNum][0] != oLink.getAttribute('href')) { this.frameNum++; }
		} else if (bSlideshow) {
			this.slideArray = this.removeDuplicates(this.slideArray);
			try {
				while(this.slideArray[this.slideNum][0] != oLink.getAttribute('href')) { this.slideNum++; }
			} catch(e) {
			}
		} else {
			this.imageArray = this.removeDuplicates(this.imageArray);
			while(this.imageArray[this.imageNum][0] != oLink.getAttribute('href')) { this.imageNum++; }
		}
	}
	this.changeContent(this.isLyteframe ? this.frameNum : (this.isSlideshow ? this.slideNum : this.imageNum));
};
Lytebox.prototype.changeContent = function(iContentNum) {
	this.contentNum = iContentNum;
	if (!this.overlayLoaded) {
		this.changeContentTimerArray[this.changeContentTimerCount++] = setTimeout("$lb.changeContent(" + this.contentNum + ")", 250);
		return;
	} else {
		for (var i = 0; i < this.changeContentTimerCount; i++) { window.clearTimeout(this.changeContentTimerArray[i]); }
	}
	var sDataLyteOptions = (this.isLyteframe) ? this.frameArray[this.contentNum][3] : (this.isSlideshow ? this.slideArray[this.contentNum][3] : this.imageArray[this.contentNum][3]);
	if (!this.inherit || /inherit:false/i.test(sDataLyteOptions)) {
		this.setOptions(String(sDataLyteOptions));
	} else {
		var sDataLyteOptions1 = String((this.isLyteframe) ? this.frameArray[0][3] : (this.isSlideshow ? this.slideArray[0][3] : this.imageArray[0][3]));
		if (this.isLyteframe) {
			var sWidth = sHeight = null;
			try { sWidth = sDataLyteOptions.match(/width:\d+(%|px|)/i)[0]; } catch(e) { }
			try { sHeight = sDataLyteOptions.match(/height:\d+(%|px|)/i)[0]; } catch(e) { }
			if (!this.isEmpty(sWidth)) {
				sDataLyteOptions1 = sDataLyteOptions1.replace(/width:\d+(%|px|)/i, sWidth);
			}
			if (!this.isEmpty(sHeight)) {
				sDataLyteOptions1 = sDataLyteOptions1.replace(/height:\d+(%|px|)/i, sHeight);
			}
		}
		this.setOptions(sDataLyteOptions1);
	}
	var object = this.doc.$('lbMain');
		object.style.display = '';
	var iDivisor = 40;
	if (this.autoResize && this.fixedPosition) {
		if (this.ie && (this.ieVersion <= 7 || this.doc.compatMode == 'BackCompat')) {
			object.style.top = (this.getPageScroll() + (this.aPageSize[3] / iDivisor)) + "px";
			var ps = (this.aPageSize[3] / iDivisor);
			this.scrollHandler = function(){
				$lb.doc.$('lbMain').style.top = ($lb.getPageScroll() + ps) + 'px';
			}
			this.bodyOnscroll = document.body.onscroll;
			if (window.addEventListener) {
				window.addEventListener('scroll', this.scrollHandler);
			} else if (window.attachEvent) {
				window.attachEvent('onscroll', this.scrollHandler);
			}
			object.style.position = "absolute";
		} else {
			object.style.top = ((this.aPageSize[3] / iDivisor)) + "px";
			object.style.position = "fixed";
		}
	} else {
		object.style.position = "absolute";
		object.style.top = (this.getPageScroll() + (this.aPageSize[3] / iDivisor)) + "px";
	}
	this.doc.$('lbOuterContainer').style.paddingBottom = '0';
	if (!this.outerBorder) {
		this.doc.$('lbOuterContainer').style.border = 'none';
	} else {
		this.doc.$('lbOuterContainer').setAttribute(this.classAttribute, this.theme);
	}
	if (this.forceCloseClick) {
		this.doc.$('lbOverlay').onclick = '';
	} else {
		this.doc.$('lbOverlay').onclick = function() { $lb.end(); return false; }
	}
	this.doc.$('lbMain').onclick = function(e) {
		var e = e;
		if (!e) {
			if (window.parent.frames[window.name] && (parent.document.getElementsByTagName('frameset').length <= 0)) {
				e = window.parent.window.event;
			} else {
				e = window.event;
			}
		}
		var id = (e.target ? e.target.id : e.srcElement.id);
		if ((id == 'lbMain') && (!$lb.forceCloseClick)) { $lb.end(); return false; }
	}
	this.doc.$('lbPrintTop').onclick = this.doc.$('lbPrint').onclick = function() { $lb.printWindow(); return false; }
	this.doc.$('lbCloseTop').onclick = this.doc.$('lbClose').onclick = function() { $lb.end(); return false; }
	this.doc.$('lbPauseTop').onclick = function() { $lb.togglePlayPause("lbPauseTop", "lbPlayTop"); return false; }
	this.doc.$('lbPause').onclick = function() { $lb.togglePlayPause("lbPause", "lbPlay"); return false; }
	this.doc.$('lbPlayTop').onclick = function() { $lb.togglePlayPause("lbPlayTop", "lbPauseTop"); return false; }
	this.doc.$('lbPlay').onclick = function() { $lb.togglePlayPause("lbPlay", "lbPause"); return false; }
	if (this.isSlideshow && this.showPlayPause && this.isPaused) {
		this.doc.$('lbPlay').style.display = '';
		this.doc.$('lbPause').style.display = 'none';
	}
	if (this.isSlideshow) {
		for (var i = 0; i < this.slideshowIDCount; i++) { window.clearTimeout(this.slideshowIDArray[i]); }
	}
	if (!this.outerBorder) {
		this.doc.$('lbOuterContainer').style.border = 'none';
	} else {
		this.doc.$('lbOuterContainer').setAttribute(this.classAttribute, this.theme);
	}
	var iDecreaseMargin = 10;
	if (this.titleTop || this.navTop) {
		this.doc.$('lbTopContainer').style.visibility = 'hidden';
		iDecreaseMargin += this.doc.$('lbTopContainer').offsetHeight;
	} else {
		this.doc.$('lbTopContainer').style.display = 'none';
	}
	this.doc.$('lbBottomContainer').style.display = 'none';
	this.doc.$('lbImage').style.display = 'none';
	this.doc.$('lbIframe').style.display = 'none';
	this.doc.$('lbPrevHov').style.display = 'none';
	this.doc.$('lbNextHov').style.display =  'none';
	this.doc.$('lbIframeContainer').style.display = 'none';
	this.doc.$('lbLoading').style.marginTop = '-' + iDecreaseMargin + 'px';
	this.doc.$('lbLoading').style.display = '';
	if (this.isLyteframe) {
		var iframe = $lb.doc.$('lbIframe');
			iframe.src = 'about:blank';
		var w = this.trim(this.width);
		var h = this.trim(this.height);
		if (/\%/.test(w)) {
			var percent = parseInt(w);
			w = parseInt((this.aPageSize[2]-50)*percent/100);
			w = w+'px';
		}
		if (/\%/.test(h)) {
			var percent = parseInt(h);
			h = parseInt((this.aPageSize[3]-150)*percent/100);
			h = h+'px';
		}
		if (this.autoResize) {
			var x = this.aPageSize[2] - 50;
			var y = this.aPageSize[3] - 150;
			w = (parseInt(w) > x ? x : w) + 'px';
			h = (parseInt(h) > y ? y : h) + 'px';
		}
		iframe.height = this.height = h;
		iframe.width = this.width = w;
		iframe.scrolling = this.scrolling;
		var oDoc = iframe.contentWindow || iframe.contentDocument;
		try {
			if (oDoc.document) {
				oDoc = oDoc.document;
			}
			oDoc.body.style.margin = 0;
			oDoc.body.style.padding = 0;
			if (this.ie && this.ieVersion <= 8) {
				oDoc.body.scroll = this.scrolling;
				oDoc.body.overflow = this.scrolling = 'no' ? 'hidden' : 'auto';
			}
		} catch(e) { }
		this.resizeContainer(parseInt(this.width), parseInt(this.height));
	} else {
		this.imgPreloader = new Image();
		this.imgPreloader.onload = function() {
			var imageWidth = $lb.imgPreloader.width;
			var imageHeight = $lb.imgPreloader.height;
			if ($lb.autoResize) {
				var x = $lb.aPageSize[2] - 50;
				var y = $lb.aPageSize[3] - 150;
				if (imageWidth > x) {
					imageHeight = Math.round(imageHeight * (x / imageWidth));
					imageWidth = x; 
					if (imageHeight > y) { 
						imageWidth = Math.round(imageWidth * (y / imageHeight));
						imageHeight = y; 
					}
				} else if (imageHeight > y) { 
					imageWidth = Math.round(imageWidth * (y / imageHeight));
					imageHeight = y; 
					if (imageWidth > x) {
						imageHeight = Math.round(imageHeight * (x / imageWidth));
						imageWidth = x;
					}
				}
			}
			var lbImage = $lb.doc.$('lbImage');
			lbImage.src = $lb.imgPreloader.src;
			lbImage.width = imageWidth;
			lbImage.height = imageHeight;
			$lb.resizeContainer(imageWidth, imageHeight);
			$lb.imgPreloader.onload = function() {};
		}
		this.imgPreloader.src = (this.isSlideshow ? this.slideArray[this.contentNum][0] : this.imageArray[this.contentNum][0]);
	}
};
Lytebox.prototype.resizeContainer = function(iWidth, iHeight) {
	this.resizeWidth = iWidth;
	this.resizeHeight = iHeight;
	this.wCur = this.doc.$('lbOuterContainer').offsetWidth;
	this.hCur = this.doc.$('lbOuterContainer').offsetHeight;
	this.xScale = ((this.resizeWidth  + (this.borderSize * 2)) / this.wCur) * 100;
	this.yScale = ((this.resizeHeight  + (this.borderSize * 2)) / this.hCur) * 100;
	var wDiff = (this.wCur - this.borderSize * 2) - this.resizeWidth;
	var hDiff = (this.hCur - this.borderSize * 2) - this.resizeHeight;
	this.wDone = (wDiff == 0);
	if (!(hDiff == 0)) {
		this.hDone = false;
		this.resizeH('lbOuterContainer', this.hCur, this.resizeHeight + this.borderSize * 2, this.getPixelRate(this.hCur, this.resizeHeight));
	} else {
		this.hDone = true;
		if (!this.wDone) {
			this.resizeW('lbOuterContainer', this.wCur, this.resizeWidth + this.borderSize * 2, this.getPixelRate(this.wCur, this.resizeWidth));
		}
	}
	if ((hDiff == 0) && (wDiff == 0)) {
		if (this.ie){ this.pause(250); } else { this.pause(100); } 
	}
	this.doc.$('lbPrevHov').style.height = this.resizeHeight + "px";
	this.doc.$('lbNextHov').style.height = this.resizeHeight + "px";
	if (this.hDone && this.wDone) {
		if (this.isLyteframe) {
			this.loadContent();
		} else {
			this.showContent();
		}
	}
};
Lytebox.prototype.loadContent = function() {
	try {
		var iframe = this.doc.$('lbIframe');
		var uri = this.frameArray[this.contentNum][0];
		if (!this.inline && this.appendQS) {
			uri += ((/\?/.test(uri)) ? '&' : '?') + 'request_from=lytebox';
		}
		if (this.autoPlay && /youtube/i.test(uri)) {
			uri += ((/\?/.test(uri)) ? '&' : '?') + 'autoplay=1';
		}
			if (!this.autoEmbed || (this.ff && (uri.match(/.pdf|.mov|.wmv/i)))) {
			this.frameSource = uri;
			this.showContent();
			return;
		}
		if (this.ie) {
			iframe.onreadystatechange = function() {
				if ($lb.doc.$('lbIframe').readyState == "complete") {
					$lb.showContent();
					$lb.doc.$('lbIframe').onreadystatechange = null;
				}
			};
		} else {
			iframe.onload = function() {
				$lb.showContent();
				$lb.doc.$('lbIframe').onload = null;
			};
		}
		if (this.inline || (uri.match(/.mov|.avi|.wmv|.mpg|.mpeg|.swf/i))) {
			iframe.src = 'about:blank';
			this.frameSource = '';
			var sHtml = (this.inline) ? this.doc.$(uri.substr(uri.indexOf('#') + 1, uri.length)).innerHTML : this.buildObject(parseInt(this.width), parseInt(this.height), uri);
			var oDoc = iframe.contentWindow || iframe.contentDocument;
			if (oDoc.document) {
				oDoc = oDoc.document;
			}
			oDoc.open();
			oDoc.write(sHtml);
			oDoc.close();
			oDoc.body.style.margin = 0;
			oDoc.body.style.padding = 0;
			if (!this.inline) {
				oDoc.body.style.backgroundColor = '#fff';
				oDoc.body.style.fontFamily = 'Verdana, Helvetica, sans-serif';
				oDoc.body.style.fontSize = '0.9em';
			}
			this.frameSource = '';
		} else {
			this.frameSource = uri;
			iframe.src = uri;
		}
	} catch(e) { }
};
Lytebox.prototype.showContent = function() {
	if (this.isSlideshow) {
		if(this.contentNum == (this.slideArray.length - 1)) {
			if (this.loopSlideshow) {
				this.slideshowIDArray[this.slideshowIDCount++] = setTimeout("$lb.changeContent(0)", this.slideInterval);
			} else if (this.autoEnd) {
				this.slideshowIDArray[this.slideshowIDCount++] = setTimeout("$lb.end('slideshow')", this.slideInterval);
			}
		} else {
			if (!this.isPaused) {
				this.slideshowIDArray[this.slideshowIDCount++] = setTimeout("$lb.changeContent("+(this.contentNum+1)+")", this.slideInterval);
			}
		}
		this.doc.$('lbHoverNav').style.display = (this.ieVersion != 6 && this.showNavigation && this.navTypeHash['Hover_by_type_' + this.navType] ? '' : 'none');
		this.doc.$('lbCloseTop').style.display = (this.showClose && this.navTop ? '' : 'none');
		this.doc.$('lbClose').style.display = (this.showClose && !this.navTop ? '' : 'none');
		this.doc.$('lbBottomData').style.display = (this.showDetails ? '' : 'none');
		this.doc.$('lbPauseTop').style.display = (this.showPlayPause && this.navTop ? (!this.isPaused ? '' : 'none') : 'none');
		this.doc.$('lbPause').style.display = (this.showPlayPause && !this.navTop ? (!this.isPaused ? '' : 'none') : 'none');
		this.doc.$('lbPlayTop').style.display = (this.showPlayPause && this.navTop ? (!this.isPaused ? 'none' : '') : 'none');
		this.doc.$('lbPlay').style.display = (this.showPlayPause && !this.navTop ? (!this.isPaused ? 'none' : '') : 'none');
		this.doc.$('lbPrevTop').style.display = (this.navTop && this.showNavigation && this.navTypeHash['Display_by_type_' + this.navType] ? '' : 'none');
		this.doc.$('lbPrev').style.display = (!this.navTop && this.showNavigation && this.navTypeHash['Display_by_type_' + this.navType] ? '' : 'none');
		this.doc.$('lbNextTop').style.display = (this.navTop && this.showNavigation && this.navTypeHash['Display_by_type_' + this.navType] ? '' : 'none');
		this.doc.$('lbNext').style.display = (!this.navTop && this.showNavigation && this.navTypeHash['Display_by_type_' + this.navType] ? '' : 'none');
	} else {
		this.doc.$('lbHoverNav').style.display = (this.ieVersion != 6 && this.navTypeHash['Hover_by_type_' + this.navType] && !this.isLyteframe ? '' : 'none');
		if ((this.navTypeHash['Display_by_type_' + this.navType] && !this.isLyteframe && this.imageArray.length > 1) || (this.frameArray.length > 1 && this.isLyteframe)) {
			this.doc.$('lbPrevTop').style.display = (this.navTop ? '' : 'none');
			this.doc.$('lbPrev').style.display = (!this.navTop ? '' : 'none');
			this.doc.$('lbNextTop').style.display = (this.navTop ? '' : 'none');
			this.doc.$('lbNext').style.display = (!this.navTop ? '' : 'none');
		} else {
			this.doc.$('lbPrevTop').style.display = 'none';
			this.doc.$('lbPrev').style.display = 'none';
			this.doc.$('lbNextTop').style.display = 'none';
			this.doc.$('lbNext').style.display = 'none';
		}
		this.doc.$('lbCloseTop').style.display = (this.navTop ? '' : 'none');
		this.doc.$('lbClose').style.display = (!this.navTop ? '' : 'none');				
		this.doc.$('lbBottomData').style.display = '';
		this.doc.$('lbPauseTop').style.display = 'none';
		this.doc.$('lbPause').style.display = 'none';
		this.doc.$('lbPlayTop').style.display = 'none';
		this.doc.$('lbPlay').style.display = 'none';
	}
	this.doc.$('lbPrintTop').style.display = (this.showPrint && this.navTop ? '' : 'none');
	this.doc.$('lbPrint').style.display = (this.showPrint && !this.navTop ? '' : 'none');
	this.updateDetails();
	this.doc.$('lbLoading').style.display = 'none';
	this.doc.$('lbImageContainer').style.display = (this.isLyteframe ? 'none' : '');
	this.doc.$('lbIframeContainer').style.display = (this.isLyteframe ? '' : 'none');
	if (this.isLyteframe) {
		if (!this.isEmpty(this.frameSource)) {
			this.doc.$('lbIframe').src = this.frameSource;
		}
		this.doc.$('lbIframe').style.display = '';
		this.fadeIn({ id: 'lbIframe', opacity: (this.doAnimations && (!this.ie || this.ieVersion >= 9) ? 0 : 100) });
	} else {
		this.doc.$('lbImage').style.display = '';
		this.fadeIn({ id: 'lbImage', opacity: (this.doAnimations && (!this.ie || this.ieVersion >= 9) ? 0 : 100) });
		this.preloadNeighborImages();
	}
	if (!this.isEmpty(this.afterStart)) {
		var callback = window[this.afterStart];
		if (typeof callback === 'function') {
			callback(this.args);
		}
	}
};
Lytebox.prototype.updateDetails = function() {
	var sTitle = (this.isSlideshow ? this.slideArray[this.contentNum][1] : (this.isLyteframe ? this.frameArray[this.contentNum][1] : this.imageArray[this.contentNum][1]));
	var sDesc  = (this.isSlideshow ? this.slideArray[this.contentNum][2] : (this.isLyteframe ? this.frameArray[this.contentNum][2] : this.imageArray[this.contentNum][2]));
	if (this.ie && this.ieVersion <= 7 || (this.ieVersion >= 8 && this.doc.compatMode == 'BackCompat')) {
		this.doc.$(this.titleTop ? 'lbTitleBottom' : 'lbTitleTop').style.display = 'none';
		this.doc.$(this.titleTop ? 'lbTitleTop' : 'lbTitleBottom').style.display = (this.isEmpty(sTitle) ? 'none' : 'block');
	}
	this.doc.$('lbDescBottom').style.display = (this.isEmpty(sDesc) ? 'none' : '');
	this.doc.$(this.titleTop ? 'lbTitleTop' : 'lbTitleBottom').innerHTML = (this.isEmpty(sTitle) ? '' : sTitle);
	this.doc.$(this.titleTop ? 'lbTitleBottom' : 'lbTitleTop').innerHTML = '';
	this.doc.$(this.titleTop ? 'lbNumBottom' : 'lbNumTop').innerHTML = '';
	this.updateNav();
	if (this.titleTop || this.navTop) {
		this.doc.$('lbTopContainer').style.display = 'block';
		this.doc.$('lbTopContainer').style.visibility = 'visible';
	} else {
		this.doc.$('lbTopContainer').style.display = 'none';
	}
	var object = (this.titleTop ? this.doc.$('lbNumTop') : this.doc.$('lbNumBottom'));
	if (this.isSlideshow && this.slideArray.length > 1) {
		object.innerHTML = this.label['image'].replace('%1', this.contentNum + 1).replace('%2', this.slideArray.length);
	} else if (this.imageArray.length > 1 && !this.isLyteframe) {
		object.innerHTML = this.label['image'].replace('%1', this.contentNum + 1).replace('%2', this.imageArray.length);
	} else if (this.frameArray.length > 1 && this.isLyteframe) {
		object.innerHTML = this.label['page'].replace('%1', this.contentNum + 1).replace('%2', this.frameArray.length);
	} else {
		object.innerHTML = '';
	}
	var bAddSpacer = !(this.titleTop || (this.isEmpty(sTitle) && this.isEmpty(object.innerHTML)));
	this.doc.$('lbDescBottom').innerHTML = (this.isEmpty(sDesc) ? '' : (bAddSpacer ? '<br style="line-height:0.6em;" />' : '') + sDesc);
	var iNavWidth = 0;
	if (this.ie && this.ieVersion <= 7 || (this.ieVersion >= 8 && this.doc.compatMode == 'BackCompat')) {
		iNavWidth = 39 + (this.showPrint ? 39 : 0) + (this.isSlideshow && this.showPlayPause ? 39 : 0);
		if ((this.isSlideshow && this.slideArray.length > 1 && this.showNavigation && this.navType != 1) ||
			(this.frameArray.length > 1 && this.isLyteframe) ||
			(this.imageArray.length > 1 && !this.isLyteframe && this.navType != 1)) {
				iNavWidth += 39*2;
		}
	}
	this.doc.$('lbBottomContainer').style.display = (!(this.titleTop && this.navTop) || !this.isEmpty(sDesc) ? 'block' : 'none');
	if (this.titleTop && this.navTop) {
		if (iNavWidth > 0) {
			this.doc.$('lbTopNav').style.width = iNavWidth + 'px';
		}
		this.doc.$('lbTopData').style.width = (this.doc.$('lbTopContainer').offsetWidth - this.doc.$('lbTopNav').offsetWidth - 15) + 'px';
		if (!this.isEmpty(sDesc)) {
			this.doc.$('lbDescBottom').style.width = (this.doc.$('lbBottomContainer').offsetWidth - 15) + 'px';
		}
	} else if ((!this.titleTop || !this.isEmpty(sDesc)) && !this.navTop) {
		if (iNavWidth > 0) {
			this.doc.$('lbBottomNav').style.width = iNavWidth + 'px';
		}
		this.doc.$('lbBottomData').style.width = (this.doc.$('lbBottomContainer').offsetWidth - this.doc.$('lbBottomNav').offsetWidth - 15) + 'px';
		this.doc.$('lbDescBottom').style.width = this.doc.$('lbBottomData').style.width;
	}
	this.fixBottomPadding();
	this.aPageSize = this.getPageSize();
	var iMainTop = parseInt(this.doc.$('lbMain').style.top);
	if ((this.ie && this.ieVersion <= 7) || (this.ieVersion >= 8 && this.doc.compatMode == 'BackCompat')) {
		iMainTop = (this.ie ? parseInt(this.doc.$('lbMain').style.top) - this.getPageScroll() : parseInt(this.doc.$('lbMain').style.top));
	}
	var iOverlap = (this.doc.$('lbOuterContainer').offsetHeight + iMainTop) - this.aPageSize[3];
	var iDivisor = 40;
	if (iOverlap > 0 && this.autoResize && this.fixedPosition) {
		if (this.ie && (this.ieVersion <= 7 || this.doc.compatMode == 'BackCompat')) {
			document.body.onscroll = this.bodyOnscroll;
			if (window.removeEventListener) {
				window.removeEventListener('scroll', this.scrollHandler);
			} else if (window.detachEvent) {
				window.detachEvent('onscroll', this.scrollHandler);
			}
		}
		this.doc.$('lbMain').style.position = "absolute";
		this.doc.$('lbMain').style.top = (this.getPageScroll() + (this.aPageSize[3] / iDivisor)) + "px";
	}
};
Lytebox.prototype.updateNav = function() {
	if (this.isSlideshow) {
		if (this.contentNum != 0) {
			if (this.navTypeHash['Display_by_type_' + this.navType] && this.showNavigation) {
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme);
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').style.display = '';
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() {
					if ($lb.pauseOnPrevClick) { $lb.togglePlayPause($lb.navTop ? 'lbPauseTop' : 'lbPause', $lb.navTop ? 'lbPlayTop' : 'lbPlay'); }
					$lb.changeContent($lb.contentNum - 1); return false;
				}
			}
			if (this.navTypeHash['Hover_by_type_' + this.navType]) {
				var object = this.doc.$('lbPrevHov');
				object.style.display = '';
				object.onclick = function() {
					if ($lb.pauseOnPrevClick) { $lb.togglePlayPause($lb.navTop ? 'lbPauseTop' : 'lbPause', $lb.navTop ? 'lbPlayTop' : 'lbPlay'); }
					$lb.changeContent($lb.contentNum - 1); return false;
				}
			}
		} else {
			if (this.navTypeHash['Display_by_type_' + this.navType]) {
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme + 'Off');
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() { return false; }
			}
		}
		if (this.contentNum != (this.slideArray.length - 1) && this.showNavigation) {
			if (this.navTypeHash['Display_by_type_' + this.navType]) {
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme);
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').style.display = '';
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() {
					if ($lb.pauseOnNextClick) { $lb.togglePlayPause($lb.navTop ? 'lbPauseTop' : 'lbPause', $lb.navTop ? 'lbPlayTop' : 'lbPlay'); }
					$lb.changeContent($lb.contentNum + 1); return false;
				}
			}
			if (this.navTypeHash['Hover_by_type_' + this.navType]) {
				var object = this.doc.$('lbNextHov');
				object.style.display = '';
				object.onclick = function() {
					if ($lb.pauseOnNextClick) { $lb.togglePlayPause($lb.navTop ? 'lbPauseTop' : 'lbPause', $lb.navTop ? 'lbPlayTop' : 'lbPlay'); }
					$lb.changeContent($lb.contentNum + 1); return false;
				}
			}
		} else {
			if (this.navTypeHash['Display_by_type_' + this.navType]) { 
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme + 'Off');
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() { return false; }
			}
		}
	} else if (this.isLyteframe) {
		if(this.contentNum != 0) {
			this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme);
			this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').style.display = '';
			this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() {
				$lb.changeContent($lb.contentNum - 1); return false;
			}
		} else {
			this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme + 'Off');
			this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() { return false; }
		}
		if(this.contentNum != (this.frameArray.length - 1)) {
			this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme);
			this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').style.display = '';
			this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() {
				$lb.changeContent($lb.contentNum + 1); return false;
			}
		} else {
			this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme + 'Off');
			this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() { return false; }
		}
	} else {
		if(this.contentNum != 0) {
			if (this.navTypeHash['Display_by_type_' + this.navType]) {
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme);
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').style.display = '';
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() {
					$lb.changeContent($lb.contentNum - 1); return false;
				}
			}
			if (this.navTypeHash['Hover_by_type_' + this.navType]) {
				var object2 = this.doc.$('lbPrevHov');
				object2.style.display = '';
				object2.onclick = function() {
					$lb.changeContent($lb.contentNum - 1); return false;
				}
			}
		} else {
			if (this.navTypeHash['Display_by_type_' + this.navType]) {
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').setAttribute(this.classAttribute, this.theme + 'Off');
				this.doc.$(this.navTop ? 'lbPrevTop' : 'lbPrev').onclick = function() { return false; }
			}
		}
		if(this.contentNum != (this.imageArray.length - 1)) {
			if (this.navTypeHash['Display_by_type_' + this.navType]) {
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme);
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').style.display = '';
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() {
					$lb.changeContent($lb.contentNum + 1); return false;
				}
			}
			if (this.navTypeHash['Hover_by_type_' + this.navType]) {
				var object2 = this.doc.$('lbNextHov');
				object2.style.display = '';
				object2.onclick = function() {
					$lb.changeContent($lb.contentNum + 1); return false;
				}
			}
		} else {
			if (this.navTypeHash['Display_by_type_' + this.navType]) { 
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').setAttribute(this.classAttribute, this.theme + 'Off');
				this.doc.$(this.navTop ? 'lbNextTop' : 'lbNext').onclick = function() { return false; }
			}
		}
	}
	this.enableKeyboardNav();
};
Lytebox.prototype.fixBottomPadding = function() {
	if (!((this.ieVersion == 7 || this.ieVersion == 8 || this.ieVersion == 9) && this.doc.compatMode == 'BackCompat') && this.ieVersion != 6) {
		var titleHeight = this.doc.$('lbTopContainer').offsetHeight + 5;
		var offsetHeight = (titleHeight == 5 ? 0 : titleHeight) + this.doc.$('lbBottomContainer').offsetHeight;
		this.doc.$('lbOuterContainer').style.paddingBottom = (offsetHeight + 5) + 'px';
	}
};
Lytebox.prototype.enableKeyboardNav = function() { document.onkeydown = this.keyboardAction; };
Lytebox.prototype.disableKeyboardNav = function() { document.onkeydown = ''; };
Lytebox.prototype.keyboardAction = function(e) {
	var keycode = key = escape = null;
	keycode	= (e == null) ? event.keyCode : e.which;
	key		= String.fromCharCode(keycode).toLowerCase();
	escape  = (e == null) ? 27 : e.DOM_VK_ESCAPE;
	if ((key == 'x') || (key == 'c') || (keycode == escape || keycode == 27)) {
		parent.$lb.end();
	} else if (keycode == 32 && $lb.isSlideshow && $lb.showPlayPause) {
		if ($lb.isPaused) {
			$lb.togglePlayPause($lb.navTop ? 'lbPlayTop' : 'lbPlay', $lb.navTop ? 'lbPauseTop' : 'lbPause');
		} else {
			$lb.togglePlayPause($lb.navTop ? 'lbPauseTop' : 'lbPause', $lb.navTop ? 'lbPlayTop' : 'lbPlay');
		}
		return false;
	} else if (key == 'p' || keycode == 37) {
		if ($lb.isSlideshow) {
			if($lb.contentNum != 0) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum - 1);
			}
		} else if ($lb.isLyteframe) {
			if($lb.contentNum != 0) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum - 1);
			}
		} else {
			if($lb.contentNum != 0) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum - 1);
			}
		}
	} else if (key == 'n' || keycode == 39) {
		if ($lb.isSlideshow) {
			if($lb.contentNum != ($lb.slideArray.length - 1)) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum + 1);
			}
		} else if ($lb.isLyteframe) {
			if($lb.contentNum != ($lb.frameArray.length - 1)) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum + 1);
			}
		} else {
			if($lb.contentNum != ($lb.imageArray.length - 1)) {
				$lb.disableKeyboardNav();
				$lb.changeContent($lb.contentNum + 1);
			}
		}
	}
};
Lytebox.prototype.preloadNeighborImages = function() {
	if (this.isSlideshow) {
		if ((this.slideArray.length - 1) > this.contentNum) {
			var preloadNextImage = new Image();
				preloadNextImage.src = this.slideArray[this.contentNum + 1][0];
		}
		if (this.contentNum > 0) {
			var preloadPrevImage = new Image();
				preloadPrevImage.src = this.slideArray[this.contentNum - 1][0];
		}
	} else {
		if ((this.imageArray.length - 1) > this.contentNum) {
			var preloadNextImage = new Image();
				preloadNextImage.src = this.imageArray[this.contentNum + 1][0];
		}
		if (this.contentNum > 0) {
			var preloadPrevImage = new Image();
				preloadPrevImage.src = this.imageArray[this.contentNum - 1][0];
		}
	}
};
Lytebox.prototype.togglePlayPause = function(sHideId, sShowId) {
	if (this.isSlideshow && (sHideId == 'lbPauseTop' || sHideId == 'lbPause')) {
		for (var i = 0; i < this.slideshowIDCount; i++) { window.clearTimeout(this.slideshowIDArray[i]); }
	}
	this.doc.$(sHideId).style.display = 'none';
	this.doc.$(sShowId).style.display = '';
	if (sHideId == 'lbPlayTop' || sHideId == 'lbPlay') {
		this.isPaused = false;
		if (this.contentNum == (this.slideArray.length - 1)) {
			if (this.loopSlideshow) {
				this.changeContent(0);
			} else if (this.autoEnd) {
				this.end();
			}
		} else {
			this.changeContent(this.contentNum + 1);
		}
	} else {
		this.isPaused = true;
	}
};
Lytebox.prototype.end = function(sCaller) {
	var closeClick = (sCaller == 'slideshow' ? false : true);
	if (this.isSlideshow && this.isPaused && !closeClick) { return; }
	if (!this.isEmpty(this.beforeEnd)) {
		var callback = window[this.beforeEnd];
		if (typeof callback === 'function') {
			if (!callback(this.args)) { return; }
		}
	}
	this.disableKeyboardNav();
	document.body.onscroll = this.bodyOnscroll;
	if (this.refreshPage) {
		var uri_href = top.location.href;
		var reg=/\#.*$/g;
		uri_href=uri_href.replace(reg, "");
		top.location.href = uri_href;
		return;
	}
	this.doc.$('lbMain').style.display = 'none';
	this.fadeOut({ id: 'lbOverlay', opacity: (this.doAnimations && this.animateOverlay && (!this.ie || this.ieVersion >= 9) ? this.maxOpacity : 0), speed: 5, display: 'none' });
	this.toggleSelects('visible');
	if (this.hideObjects) { this.toggleObjects('visible'); }
	this.doc.$('lbOuterContainer').style.width = '200px';
	this.doc.$('lbOuterContainer').style.height = '200px';
	if (this.inline && this.safari) {
		var iframe = this.doc.$('lbIframe');
		var oDoc = iframe.contentWindow || iframe.contentDocument;
		if (oDoc.document) {
			oDoc = oDoc.document;
		}
		oDoc.open();
		oDoc.write('<html><head></head><body></body></html>');
		oDoc.close();
	}
	if (this.isSlideshow) {
		for (var i = 0; i < this.slideshowIDCount; i++) { window.clearTimeout(this.slideshowIDArray[i]); }
		this.isPaused = false;
	}
	if (!this.isEmpty(this.afterEnd)) {
		var callback = window[this.afterEnd];
		if (typeof callback === 'function') {
			callback(this.args);
		}
	}
};
Lytebox.prototype.checkFrame = function() {
	if (window.parent.frames[window.name] && (parent.document.getElementsByTagName('frameset').length <= 0) && window.name != 'lbIframe') {
		this.isFrame = true;
		this.doc = parent.document;
	} else {
		this.isFrame = false;
		this.doc = document;
	}
	this.doc.$ = this.doc.getElementById;
};
Lytebox.prototype.getPixelRate = function(iCurrent, iDim) {
	var diff = (iDim > iCurrent) ? iDim - iCurrent : iCurrent - iDim;
	if (diff >= 0 && diff <= 100) { return (100 / this.resizeDuration); }
	if (diff > 100 && diff <= 200) { return (150 / this.resizeDuration); }
	if (diff > 200 && diff <= 300) { return (200 / this.resizeDuration); }
	if (diff > 300 && diff <= 400) { return (250 / this.resizeDuration); }
	if (diff > 400 && diff <= 500) { return (300 / this.resizeDuration); }
	if (diff > 500 && diff <= 600) { return (350 / this.resizeDuration); }
	if (diff > 600 && diff <= 700) { return (400 / this.resizeDuration); }
	if (diff > 700) { return (450 / this.resizeDuration); }
};
Lytebox.prototype.fadeIn = function(args) {
	var sId = this.isEmpty(args.id) ? '' : args.id;
	var iSpeed = (this.isEmpty(args.speed) ? 5 : (parseInt(args.speed) > 5 ? 5 : parseInt(args.speed)));
		iSpeed = isNaN(iSpeed) ? 5 : iSpeed;
	var iOpacity = this.isEmpty(args.opacity) ? 0 : parseInt(args.opacity);
		iOpacity = isNaN(iOpacity) ? 0 : iOpacity;
	var sDisplay = this.isEmpty(args.display) ? '' : args.display;
	var sVisibility = this.isEmpty(args.visibility) ? '' : args.visibility;
	var oElement = this.doc.$(sId);
	var iIncrement = iSpeed;
	if (/lbImage|lbIframe|lbOverlay|lbBottomContainer|lbTopContainer/.test(sId)) {
		iIncrement = this.ff ? (this.ffVersion >= 6 ? 2 : 5) : (this.safari ? 3 : (this.ieVersion <= 8 ? 10 : 5));
		iIncrement = this.isMobile() ? 20 : iIncrement;
		iIncrement = (sId == 'lbOverlay' ? iIncrement * 2 : iIncrement);
		iIncrement = (sId == 'lbIframe' ? 100 : iIncrement);
	} else if (this.ieVersion == 7 || this.ieVersion == 8) {
		iIncrement = 10;
	}
	oElement.style.opacity = (iOpacity / 100);
	oElement.style.filter = "alpha(opacity=" + (iOpacity) + ")";
	if (iOpacity >= 100 && (sId == 'lbImage' || sId == 'lbIframe')) {
		try { oElement.style.removeAttribute("filter"); } catch(e) {}
		this.fixBottomPadding();
	} else if (iOpacity >= this.maxOpacity && sId == 'lbOverlay') {
		for (var i = 0; i < this.overlayTimerCount; i++) { window.clearTimeout(this.overlayTimerArray[i]); }
		this.overlayLoaded = true;
		return;
	} else if (iOpacity >= 100 && (sId == 'lbBottomContainer' || sId == 'lbTopContainer')) {
		try { oElement.style.removeAttribute("filter"); } catch(e) {}
		for (var i = 0; i < this.imageTimerCount; i++) { window.clearTimeout(this.imageTimerArray[i]); }
		this.doc.$('lbOverlay').style.height = this.aPageSize[1] + "px";
	} else if (iOpacity >= 100) {
		for (var i = 0; i < this.imageTimerCount; i++) { window.clearTimeout(this.imageTimerArray[i]); }
	} else {
		if (sId == 'lbOverlay') {
			this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("$lb.fadeIn({ id: '" + sId + "', opacity: " + (iOpacity + iIncrement) + ", speed: " + iSpeed + " })", 1);
		} else {
			this.imageTimerArray[this.imageTimerCount++] = setTimeout("$lb.fadeIn({ id: '" + sId + "', opacity: " + (iOpacity + iIncrement) + ", speed: " + iSpeed + " })", 1);
		}
	}
};
Lytebox.prototype.fadeOut = function(args) {
	var sId = this.isEmpty(args.id) ? '' : args.id;
	var iSpeed = (this.isEmpty(args.speed) ? 5 : (parseInt(args.speed) > 5 ? 5 : parseInt(args.speed)));
		iSpeed = isNaN(iSpeed) ? 5 : iSpeed;
	var iOpacity = this.isEmpty(args.opacity) ? 100 : parseInt(args.opacity);
		iOpacity = isNaN(iOpacity) ? 100 : iOpacity;
	var sDisplay = this.isEmpty(args.display) ? '' : args.display;
	var sVisibility = this.isEmpty(args.visibility) ? '' : args.visibility;
	var oElement = this.doc.$(sId);
	if (this.ieVersion == 7 || this.ieVersion == 8) {
		iSpeed *= 2;
	}
	oElement.style.opacity = (iOpacity / 100);
	oElement.style.filter = "alpha(opacity=" + iOpacity + ")";
	if (iOpacity <= 0) {
		try {
			if (!this.isEmpty(sDisplay)) {
				oElement.style.display = sDisplay;
			}
			if (!this.isEmpty(sVisibility)) {
				oElement.style.visibility = sVisibility;
			}
		} catch(err) { }
		if (sId == 'lbOverlay') {
			this.overlayLoaded = false;
			if (this.isLyteframe) {
				this.doc.$('lbIframe').src = 'about:blank';
				this.initialize();
			}
		} else {
			for (var i = 0; i < this.timerIDCount; i++) { window.clearTimeout(this.timerIDArray[i]); }
		}
	} else if (sId == 'lbOverlay') {
		this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("$lb.fadeOut({ id: '" + sId + "', opacity: " + (iOpacity - (iSpeed * 2)) + ", speed: " + iSpeed + ", display: '" + sDisplay + "', visibility: '" + sVisibility + "' })", 1);
	} else {
		this.timerIDArray[this.timerIDCount++] = setTimeout("$lb.fadeOut({ id: '" + sId + "', opacity: " + (iOpacity - iSpeed) + ", speed: " + iSpeed + ", display: '" + sDisplay + "', visibility: '" + sVisibility + "' })", 1);
	}
};
Lytebox.prototype.resizeW = function(sId, iCurrentW, iMaxW, iPixelRate, iSpeed) {
	var object = this.doc.$(sId);
	var newW = (this.doAnimations ? iCurrentW : iMaxW);
	object.style.width = (newW) + "px";
	if (newW < iMaxW) {
		newW += (newW + iPixelRate >= iMaxW) ? (iMaxW - newW) : iPixelRate;
	} else if (newW > iMaxW) {
		newW -= (newW - iPixelRate <= iMaxW) ? (newW - iMaxW) : iPixelRate;
	}
	this.resizeWTimerArray[this.resizeWTimerCount++] = setTimeout("$lb.resizeW('" + sId + "', " + newW + ", " + iMaxW + ", " + iPixelRate + ", " + (iSpeed) + ")", iSpeed);
	if (parseInt(object.style.width) == iMaxW) {
		this.wDone = true;
		for (var i = 0; i < this.resizeWTimerCount; i++) { window.clearTimeout(this.resizeWTimerArray[i]); }
		if (this.isLyteframe) {
			this.loadContent();
		} else {
			this.showContent();
		}
	}
};
Lytebox.prototype.resizeH = function(sId, iCurrentH, iMaxH, iPixelRate, iSpeed) {
	var object = this.doc.$(sId);
	var newH = (this.doAnimations ? iCurrentH : iMaxH);
	object.style.height = (newH) + "px";
	if (newH < iMaxH) {
		newH += (newH + iPixelRate >= iMaxH) ? (iMaxH - newH) : iPixelRate;
	} else if (newH > iMaxH) {
		newH -= (newH - iPixelRate <= iMaxH) ? (newH - iMaxH) : iPixelRate;
	}
	this.resizeHTimerArray[this.resizeHTimerCount++] = setTimeout("$lb.resizeH('" + sId + "', " + newH + ", " + iMaxH + ", " + iPixelRate + ", " + (iSpeed+.02) + ")", iSpeed+.02);
	if (parseInt(object.style.height) == iMaxH) {
		this.hDone = true;
		for (var i = 0; i < this.resizeHTimerCount; i++) { window.clearTimeout(this.resizeHTimerArray[i]); }
		this.resizeW('lbOuterContainer', this.wCur, this.resizeWidth + this.borderSize * 2, this.getPixelRate(this.wCur, this.resizeWidth));
	}
};
Lytebox.prototype.getPageScroll = function() {
	if (self.pageYOffset) {
		return this.isFrame ? parent.pageYOffset : self.pageYOffset;
	} else if (this.doc.documentElement && this.doc.documentElement.scrollTop){
		return this.doc.documentElement.scrollTop;
	} else if (document.body) {
		return this.doc.body.scrollTop;
	}
};
Lytebox.prototype.getPageSize = function() {
	var xScroll, yScroll, windowWidth, windowHeight;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = this.doc.scrollWidth;
		yScroll = (this.isFrame ? parent.innerHeight : self.innerHeight) + (this.isFrame ? parent.scrollMaxY : self.scrollMaxY);
	} else if (this.doc.body.scrollHeight > this.doc.body.offsetHeight){
		xScroll = this.doc.body.scrollWidth;
		yScroll = this.doc.body.scrollHeight;
	} else {
		xScroll = this.doc.getElementsByTagName("html").item(0).offsetWidth;
		yScroll = this.doc.getElementsByTagName("html").item(0).offsetHeight;
		xScroll = (xScroll < this.doc.body.offsetWidth) ? this.doc.body.offsetWidth : xScroll;
		yScroll = (yScroll < this.doc.body.offsetHeight) ? this.doc.body.offsetHeight : yScroll;
	}
	if (self.innerHeight) {
		windowWidth = (this.isFrame) ? parent.innerWidth : self.innerWidth;
		windowHeight = (this.isFrame) ? parent.innerHeight : self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		windowWidth = this.doc.documentElement.clientWidth;
		windowHeight = this.doc.documentElement.clientHeight;
		windowWidth = (windowWidth == 0) ? this.doc.body.clientWidth : windowWidth;
		windowHeight = (windowHeight == 0) ? this.doc.body.clientHeight : windowHeight;
	} else if (document.body) {
		windowWidth = this.doc.getElementsByTagName("html").item(0).clientWidth;
		windowHeight = this.doc.getElementsByTagName("html").item(0).clientHeight;
		windowWidth = (windowWidth == 0) ? this.doc.body.clientWidth : windowWidth;
		windowHeight = (windowHeight == 0) ? this.doc.body.clientHeight : windowHeight;
	}
	var pageHeight = (yScroll < windowHeight) ? windowHeight : yScroll;
	var pageWidth = (xScroll < windowWidth) ? windowWidth : xScroll;
	return new Array(pageWidth, pageHeight, windowWidth, windowHeight);
};
Lytebox.prototype.toggleObjects = function(sState) {
	var objects = this.doc.getElementsByTagName("object");
	for (var i = 0; i < objects.length; i++) {
		objects[i].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
	}
	var embeds = this.doc.getElementsByTagName("embed");
	for (var i = 0; i < embeds.length; i++) {
		embeds[i].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
	}
	if (this.isFrame) {
		for (var i = 0; i < parent.frames.length; i++) {
			try {
				objects = parent.frames[i].window.document.getElementsByTagName("object");
				for (var j = 0; j < objects.length; j++) {
					objects[j].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
				}
			} catch(e) {}
			
			try {
				embeds = parent.frames[i].window.document.getElementsByTagName("embed");
				for (var j = 0; j < embeds.length; j++) {
					embeds[j].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
				}
			} catch(e) {}
		}
	}
};
Lytebox.prototype.toggleSelects = function(sState) {
	var selects = this.doc.getElementsByTagName("select");
	for (var i = 0; i < selects.length; i++ ) {
		selects[i].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
	}
	if (this.isFrame) {
		for (var i = 0; i < parent.frames.length; i++) {
			try {
				selects = parent.frames[i].window.document.getElementsByTagName("select");
				for (var j = 0; j < selects.length; j++) {
					selects[j].style.visibility = (sState == "hide") ? 'hidden' : 'visible';
				}
			} catch(e) {}
		}
	}
};
Lytebox.prototype.pause = function(iMillis) {
	var now = new Date();
	var exitTime = now.getTime() + iMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime) { return; }
	}
};
Lytebox.prototype.combine = function(aAnchors, aAreas) {
	var lyteLinks = [];
	for (var i = 0; i < aAnchors.length; i++) {
		lyteLinks.push(aAnchors[i]);
	}
	for (var i = 0; i < aAreas.length; i++) {
		lyteLinks.push(aAreas[i]);
	}
	return lyteLinks;
};
Lytebox.prototype.removeDuplicates = function (aArray) {
	var aNew = new Array();
	o:for(var i = 0, n = aArray.length; i < n; i++) {
		for(var x = 0, y = aNew.length; x < y; x++) {
			if (aNew[x][0].toLowerCase() == aArray[i][0].toLowerCase()) { continue o; }
		}
		aNew[aNew.length] = aArray[i];
	}
	return aNew;
};
Lytebox.prototype.printWindow = function () {
	var w = this.isLyteframe ? 800 : this.imgPreloader.width + 20;
	var h = this.isLyteframe ? 600 : this.imgPreloader.height + 20;
	var left = parseInt((screen.availWidth/2) - (w/2));
	var top = parseInt((screen.availHeight/2) - (h/2));
	var wOpts = "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top + "directories=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,titlebar=0,toolbar=0";
	var d = new Date();
	var wName = 'Print' + d.getTime();
	var wUrl = document.getElementById(this.printId).src;
	this.wContent = window.open(wUrl, wName, wOpts);
	this.wContent.focus();
	var t = setTimeout("$lb.printContent()",1000);
};
Lytebox.prototype.printContent = function() {
	try {
		if (this.wContent.document.readyState == 'complete') {
			this.wContent.print();
			this.wContent.close();
			this.wContent = null;
		} else {
			var t = setTimeout("$lb.printContent()",1000);
		}
	} catch(e) { }
};
Lytebox.prototype.setOptions = function(sOptions) {
	this.args = '';
	this.group = '';
	this.inline = false;
	this.hideObjects = this.__hideObjects;
	this.autoResize = this.__autoResize;
	this.doAnimations = this.__doAnimations;
	this.animateOverlay = this.__animateOverlay;
	this.forceCloseClick = this.__forceCloseClick;
	this.refreshPage = this.__refreshPage;
	this.showPrint = this.__showPrint;
	this.navType = this.__navType;
	this.titleTop = this.__titleTop;
	this.navTop = this.__navTop;
	this.beforeStart = this.__beforeStart;
	this.afterStart = this.__afterStart
	this.beforeEnd = this.__beforeEnd;
	this.afterEnd = this.__afterEnd;
	this.scrolling = this.__scrolling;
	this.width = this.__width;
	this.height = this.__height;
	this.loopPlayback = this.__loopPlayback;
	this.autoPlay = this.__autoPlay;
	this.autoEmbed = this.__autoEmbed;
	this.slideInterval = this.__slideInterval;
	this.showNavigation = this.__showNavigation;
	this.showClose = this.__showClose;
	this.showDetails = this.__showDetails;
	this.showPlayPause = this.__showPlayPause;
	this.autoEnd = this.__autoEnd;
	this.pauseOnNextClick = this.__pauseOnNextClick;
	this.pauseOnPrevClick = this.__pauseOnPrevClick;
	this.loopSlideshow = this.__loopSlideshow;
	var sName = sValue = '';
	var aSetting = null;
	var aOptions = sOptions.split(' ');
	for (var i = 0; i < aOptions.length; i++) {
		aSetting = aOptions[i].split(':');
		sName = (aSetting.length > 1 ? this.trim(aSetting[0]).toLowerCase() : '');
		sValue = (aSetting.length > 1 ? this.trim(aSetting[1]): '');
		switch(sName) {
			case 'group':			this.group = (sName == 'group' ? (!this.isEmpty(sValue) ? sValue.toLowerCase() : '') : ''); break;
			case 'hideobjects':		this.hideObjects = (/true|false/.test(sValue) ? (sValue == 'true') : this.__hideObjects); break;
			case 'autoresize':		this.autoResize = (/true|false/.test(sValue) ? (sValue == 'true') : this.__autoResize); break;
			case 'doanimations':	this.doAnimations = (/true|false/.test(sValue) ? (sValue == 'true') : this.__doAnimations); break;
			case 'animateoverlay':	this.animateOverlay = (/true|false/.test(sValue) ? (sValue == 'true') : this.__animateOverlay); break;
			case 'forcecloseclick':	this.forceCloseClick = (/true|false/.test(sValue) ? (sValue == 'true') : this.__forceCloseClick); break;
			case 'refreshpage':		this.refreshPage = (/true|false/.test(sValue) ? (sValue == 'true') : this.__refreshPage); break;
			case 'showprint':		this.showPrint = (/true|false/.test(sValue) ? (sValue == 'true') : this.__showPrint); break;
			case 'navtype':			this.navType = (/[1-3]{1}/.test(sValue) ? parseInt(sValue) : this.__navType); break;
			case 'titletop':		this.titleTop = (/true|false/.test(sValue) ? (sValue == 'true') : this.__titleTop); break;
			case 'navtop':			this.navTop = (/true|false/.test(sValue) ? (sValue == 'true') : this.__navTop); break;
			case 'beforestart':		this.beforeStart = (!this.isEmpty(sValue) ? sValue : this.__beforeStart); break;
			case 'afterstart':		this.afterStart = (!this.isEmpty(sValue) ? sValue : this.__afterStart); break;
			case 'beforeend':		this.beforeEnd = (!this.isEmpty(sValue) ? sValue : this.__beforeEnd); break;
			case 'afterend':		this.afterEnd = (!this.isEmpty(sValue) ? sValue : this.__afterEnd); break;
			case 'args': 			this.args = (!this.isEmpty(sValue) ? sValue : ''); break;
			case 'scrollbars':		this.scrolling = (/auto|yes|no/.test(sValue) ? sValue : this.__scrolling); break;
			case 'scrolling':		this.scrolling = (/auto|yes|no/.test(sValue) ? sValue : this.__scrolling); break;
			case 'width':			this.width = (/\d(%|px|)/.test(sValue) ? sValue : this.__width); break;
			case 'height':			this.height = (/\d(%|px|)/.test(sValue) ? sValue : this.__height); break;
			case 'loopplayback':	this.loopPlayback = (/true|false/.test(sValue) ? (sValue == 'true') : this.__loopPlayback); break;
			case 'autoplay':		this.autoPlay = (/true|false/.test(sValue) ? (sValue == 'true') : this.__autoPlay); break;
			case 'autoembed':		this.autoEmbed = (/true|false/.test(sValue) ? (sValue == 'true') : this.__autoEmbed); break;
			case 'inline':			this.inline = (/true|false/.test(sValue) ? (sValue == 'true') : false);
			case 'slideinterval':	this.slideInterval = (/\d/.test(sValue) ? parseInt(sValue) : this.__slideInterval); break;
			case 'shownavigation':	this.showNavigation = (/true|false/.test(sValue) ? (sValue == 'true') : this.__showNavigation); break;
			case 'showclose':		this.showClose = (/true|false/.test(sValue) ? (sValue == 'true') : this.__showClose); break;
			case 'showdetails':		this.showDetails = (/true|false/.test(sValue) ? (sValue == 'true') : this.__showDetails); break;
			case 'showplaypause':	this.showPlayPause = (/true|false/.test(sValue) ? (sValue == 'true') : this.__showPlayPause); break;
			case 'autoend':			this.autoEnd = (/true|false/.test(sValue) ? (sValue == 'true') : this.__autoEnd); break;
			case 'pauseonnextclick': this.pauseOnNextClick = (/true|false/.test(sValue) ? (sValue == 'true') : this.__pauseOnNextClick); break;
			case 'pauseonprevclick': this.pauseOnPrevClick = (/true|false/.test(sValue) ? (sValue == 'true') : this.__pauseOnPrevClick); break;
			case 'loopslideshow':	this.loopSlideshow = (/true|false/.test(sValue) ? (sValue == 'true') : this.__loopSlideshow); break;
		}
	}
};
	Lytebox.prototype.buildObject = function(w, h, url) {
	var object = '';
	var classId = '';
	var codebase = '';
	var pluginsPage = '';
	var auto = this.autoPlay ? 'true' : 'false';
	var loop = this.loopPlayback ? 'true' : 'false';
	var type = url.match(/.mov|.avi|.wmv|.mpg|.mpeg|.swf/i);
	switch(type[0]) {
	case '.mov':
			codebase = 'http://www.apple.com/qtactivex/qtplugin.cab';
			pluginsPage = 'http://www.apple.com/quicktime/';
			classId = 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B';
			object 	= '<object classid="' + classId + '" width="' + w + '" height="' + h + '" codebase="' + codebase + '">'
					+ '<param name="src" value="' + url + '">'
					+ '<param name="autoplay" value="' + auto + '">'
					+ '<param name="loop" value="' + loop + '">'
					+ '<param name="controller" value="true">'
					+ '<embed src="' + url + '" width="' + w + '" height="' + h + '" autoplay="' + auto + '" loop="' + loop + '" controller="true" pluginspage="' + pluginsPage + '"></embed>'
					+ '</object>';
			if (this.getQuicktimeVersion() <= 0) {
				object	= '<div style="padding:1em;">'
						+ '<h2>QUICKTIME PLAYER</h2>'
						+ '<p>Content on this page requires a newer version of QuickTime. Please click the image link below to download and install the latest version.</p>'
						+ '<p><a href="http://www.apple.com/quicktime/" target="_blank"><img src="http://images.apple.com/about/webbadges/images/qt7badge_getQTfreeDownload.gif" alt="Get QuickTime" border="0" /></a></p>'
						+ '</div>';
			}
			break;
		case '.avi':
		case '.mpg':
		case '.mpeg':
		case '.wmv':
			classId = 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B';			
			object 	= '<object classid="' + classId + '" width="' + w + '" height="' + h + '" codebase="' + codebase + '">'
					+ '<param name="src" value="' + url + '">'
					+ '<param name="autoplay" value="' + auto + '">'
					+ '<param name="loop" value="' + loop + '">'
					+ '<param name="controller" value="true">'
					+ '<object type="video/quicktime" data="' + url + '" width="' + w + '" height="' + h + '">'
					+ '<param name="controller" value="false">'
					+ '<param name="autoplay" value="' + auto + '">'
					+ '<param name="loop" value="' + loop + '">'
					+ '</object>' 
					+ '</object>';
			break;
		case '.swf':
			classId = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			object 	= '<object classid="' + classId + '" width="' + w + '" height="' + h + '" codebase="' + codebase + '">'
					+ '<param name="movie" value="' + url + '">'
					+ '<param name="quality" value="high">'
					+ '<param name="wmode" value="opaque">'
					+ '<!--[if !IE]>-->'
					+ '<object type="application/x-shockwave-flash" data="' + url + '" width="' + w + '" height="' + h + '">'
					+ '<!--<![endif]-->'
					+ '<param name="quality" value="high">'
					+ '<param name="wmode" value="opaque">'
					+ '<div style="padding:1em;">'
					+ '<h2>FLASH PLAYER</h2>'
					+ '<p>Content on this page requires a newer version of Adobe Flash Player. Please click the image link below to download and install the latest version.</p>'
					+ '<p><a href="http://www.adobe.com/go/getflashplayer" target="_blank"><img src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" alt="Get Adobe Flash player" border="0" /></a></p>'
					+ '</div>'
					+ '<!--[if !IE]>-->'
					+ '</object>'
					+ '<!--<![endif]-->'
					+ '</object>';
			break;
	}
	return object;
};
Lytebox.prototype.getQuicktimeVersion = function() {
	var agent = navigator.userAgent.toLowerCase(); 
	var version = -1;
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		for (i=0; i < navigator.plugins.length; i++ ) {
			var plugin = navigator.plugins[i];
			if (plugin.name.indexOf('QuickTime') > -1) {
				version = parseFloat(plugin.name.substring(18));
			}
		}
	} else if (this.autoEmbed && agent.indexOf('msie') != -1 && parseInt(navigator.appVersion) >= 4 && agent.indexOf('win') != -1 && agent.indexOf('16bit') == -1) {
		var control = null;
		try {
			control = new ActiveXObject('QuickTime.QuickTime');
		} catch (e) { }
		if (control) {
			isInstalled = true;
		}			
		try {
			control = new ActiveXObject('QuickTimeCheckObject.QuickTimeCheck');
		} catch (e) { return; }
		if (control) {
			isInstalled = true;
			version = control.QuickTimeVersion.toString(16);
			version = version.substring(0, 1) + '.' + version.substring(1, 3);
			version = parseInt(version);
		}
	}
	return version;
};
Lytebox.prototype.findPos = function(el) {
	if (this.ie && this.doc.compatMode == 'BackCompat') {
		return [0, 16, 12];
	}
	var left = 0;
	var top = 0;
	var height = 0;
	height = el.offsetHeight + 6;
	if (el.offsetParent) {
		do {
			left += el.offsetLeft;
			top += el.offsetTop;
		} while (el = el.offsetParent);
	}
	return [left, top, height];
};
Lytebox.prototype.isMobile = function() {
	var ua = navigator.userAgent;
	return (ua.match(/ipad/i) != null)
		|| (ua.match(/ipod/i) != null)
		|| (ua.match(/iphone/i) != null)
		|| (ua.match(/android/i) != null)
		|| (ua.match(/opera mini/i) != null)
		|| (ua.match(/blackberry/i) != null)
		|| (ua.match(/(pre\/|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine)/i) != null)
		|| (ua.match(/(iris|3g_t|windows ce|opera mobi|windows ce; smartphone;|windows ce; iemobile)/i) != null)
		|| (ua.match(/(mini 9.5|vx1000|lge |m800|e860|u940|ux840|compal|wireless| mobi|ahong|lg380|lgku|lgu900|lg210|lg47|lg920|lg840|lg370|sam-r|mg50|s55|g83|t66|vx400|mk99|d615|d763|el370|sl900|mp500|samu3|samu4|vx10|xda_|samu5|samu6|samu7|samu9|a615|b832|m881|s920|n210|s700|c-810|_h797|mob-x|sk16d|848b|mowser|s580|r800|471x|v120|rim8|c500foma:|160x|x160|480x|x640|t503|w839|i250|sprint|w398samr810|m5252|c7100|mt126|x225|s5330|s820|htil-g1|fly v71|s302|-x113|novarra|k610i|-three|8325rc|8352rc|sanyo|vx54|c888|nx250|n120|mtk |c5588|s710|t880|c5005|i;458x|p404i|s210|c5100|teleca|s940|c500|s590|foma|samsu|vx8|vx9|a1000|_mms|myx|a700|gu1100|bc831|e300|ems100|me701|me702m-three|sd588|s800|8325rc|ac831|mw200|brew |d88|htc\/|htc_touch|355x|m50|km100|d736|p-9521|telco|sl74|ktouch|m4u\/|me702|8325rc|kddi|phone|lg |sonyericsson|samsung|240x|x320|vx10|nokia|sony cmd|motorola|up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|kindle|mobile|psp|treo)/i) != null);
};
Lytebox.prototype.validate = function(args) {
	var reTest = sName = '';
	var bValid = false;
	var oElement = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	var sInput = this.isEmpty(args.value) ? '' : String(args.value);
	var sType = this.isEmpty(args.type) ? '' : String(args.type).toLowerCase();
	var sRegex = this.isEmpty(args.regex) ? '' : args.regex;
	var sCCType = (/visa|mc|amex|diners|discover|jcb/.test(args.ccType) ? args.ccType : '');
	var sImageType = this.isEmpty(args.imageType) ? '' : String(args.imageType.toLowerCase());
	var iMin = (/^\d+$/.test(args.min) ? parseInt(args.min) : 0);
	var iMax = (/^\d+$/.test(args.max) ? parseInt(args.max) : 0);
	var bInclusive = args.inclusive ? true : (/true|false/.test(args.inclusive) ? (args.inclusive == 'true') : true);
	var bAllowComma = args.allowComma ? true : (/true|false/.test(args.allowComma) ? (args.allowComma == 'true') : true);
	var bAllowWhitespace = args.allowWhiteSpace ? true : (/true|false/.test(args.allowWhiteSpace) ? (args.allowWhiteSpace == 'true') : true);
	if ((this.isEmpty(sInput) && this.isEmpty(oElement)) || (this.isEmpty(sType) && this.isEmpty(sRegex))) {
		return false;
	}
	var sInput = this.isEmpty(sInput) ? oElement.value : sInput;
	if (!this.isEmpty(sRegex)) {
		bValid = sRegex.test(sInput);
	} else {
		switch(sType) {
			case 'alnum':
				bValid = (bAllowWhitespace ? /^[a-z0-9\s]+$/i.test(sInput) : /^[a-z0-9]+$/i.test(sInput)); break;
			case 'alpha':
				bValid = (bAllowWhitespace ? /^[a-z\s]+$/i.test(sInput) : /^[a-z]+$/i.test(sInput)); break;
			case 'between':
				var iInput = bAllowComma ? parseInt(sInput.replace(/\,/g,'')) : parseInt(sInput);
				bValid = (bInclusive ? (iInput >= iMin && iInput <= iMax) : (iInput > iMin && iInput < iMax)); break;
			case 'ccnum':
				if (this.isEmpty(sCCType)) {
					bValid = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(sInput); break;
				} else {
					switch(sCCType) {
						case 'visa':
							bValid = /^4[0-9]{12}(?:[0-9]{3})?$/.test(sInput); break;
						case 'mc':
							bValid = /^5[1-5][0-9]{14}$/.test(sInput); break;
						case 'amex':
							bValid = /^3[47][0-9]{13}$/.test(sInput); break;
						case 'diners':
							bValid = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(sInput); break;
						case 'discover':
							bValid = /^6(?:011|5[0-9]{2})[0-9]{12}$/.test(sInput); break;
						case 'jcb':
							bValid = /^(?:2131|1800|35\d{3})\d{11}$/.test(sInput); break;
						default:
							bValid = false;
					}
				}
			case 'date':
				var date = new Date(sInput);
				bValid = !(date.toString() == 'NaN' || date.toString() == 'Invalid Date'); break;
			case 'digits':
				bValid = /^\d+$/.test(sInput); break;
			case 'email':
				bValid = /^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i.test(sInput); break;
			case 'float':
				bValid = /^[-+]?[0-9]*\.?[0-9]+$/.test(bAllowComma ? sInput.replace(/\,/g,'') : sInput); break;
			case 'image':
				if (this.isEmpty(sImageType)) {
					bValid = /^(png|jpg|jpeg|gif)$/i.test(sInput.split('.').pop()); break;
				} else {
					bValid = (sInput.split('.').pop().toLowerCase().match(sImageType) ? true : false); break;
				}
			case 'int':
			case 'integer':
				bValid = /^[-+]?\d+$/.test(sInput.replace(/\,/g,'')); break;
			case 'len':
			case 'length':
				bValid = (iMin == iMax) ? (sInput.length == iMin) : (sInput.length >= iMin && sInput.length <= iMax); break;
			case 'phone':
				bValid = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(sInput); break;
			case 'notempty':
				bValid = !this.isEmpty(sInput); break;
			case 'ssn':
				bValid = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/.test(sInput); break;
			case 'url':
				bValid = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»""'']))/i.test(sInput); break;
			case 'zip':
				bValid = /^\d{5}$|^\d{5}-\d{4}$/.test(sInput); break;
		}
	}
	return bValid;
};
Lytebox.prototype.ajax = function(args) {
	var iIndex = this.http.length;
	var oRequest = this.getRequestObject();
	this.http[iIndex] = oRequest;
	var oHttpArgs = args;
	oHttpArgs.index = iIndex;
	oHttpArgs.method = !(/get|post/i.test(oHttpArgs.method)) ? 'get' : oHttpArgs.method;
	oHttpArgs.cache = !(/true|false/.test(oHttpArgs.cache)) ? true : (oHttpArgs.cache == 'true' || oHttpArgs.cache);
	if (!this.isEmpty(oHttpArgs.timeout) && (/^\d+$/.test(oHttpArgs.timeout))) {
		oHttpArgs.timerId = setTimeout("$lb.http["+iIndex+"].abort()", oHttpArgs.timeout);
	}
	oRequest.onreadystatechange = function() {
		return function() {
			if (oRequest.readyState == 4 && oRequest.status == 200) {
				if (document.getElementById(oHttpArgs.updateId)) {
					try {
						document.getElementById(oHttpArgs.updateId).innerHTML = oRequest.responseText;
					} catch(e) { alert(e.description ); };
				}
				if (typeof oHttpArgs.success === 'function') {
					oHttpArgs.success(oRequest);
				}
				window.clearTimeout(oHttpArgs.timerId);
				$lb.http[oHttpArgs.index] = null;
			} else if (oRequest.readyState == 4 && oRequest.status != 200) {
				if (typeof oHttpArgs.fail === 'function') {
					oHttpArgs.fail(oRequest);
				}
				window.clearTimeout(oHttpArgs.timerId);
				$lb.http[oHttpArgs.index] = null;
			}
		} (oRequest, oHttpArgs);
	}
	if (oHttpArgs.method.toLowerCase() == 'post') {
		var oForm = document.getElementById(oHttpArgs.form);
		var bStripTags = !(/true|false/.test(args.stripTags)) ? false : (args.stripTags == 'true' || args.stripTags);
		var sParams = (oForm == null ? this.serialize({ name: oHttpArgs.form, stripTags: bStripTags }) : this.serialize({ element: oForm, stripTags: bStripTags }));
		var sTimestamp = (!oHttpArgs.cache ? ((/\&/.test(sParams)) ? '&' : '') + new Date().getTime() : '');
		oRequest.open('post', oHttpArgs.url, true);
		oRequest.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		oRequest.send(sParams + sTimestamp);
	} else {
		var sTimestamp = (!oHttpArgs.cache ? ((/\?/.test(oHttpArgs.url)) ? '&' : '?') + new Date().getTime() : '');
		oRequest.open('get', oHttpArgs.url  + sTimestamp, true);
		oRequest.send();
	}
};
Lytebox.prototype.serialize = function(args) {
	var sParams = sValue = '';
	var bStripTags = !(/true|false/.test(args.stripTags)) ? false : (args.stripTags == 'true' || args.stripTags);
	var oElements = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	if (oElements == null) {
		for (var i = 0; i < document.forms.length; i++) {
			if (document.forms[i].name == args.name) {
				oElements = document.forms[i].elements;
			}
		}
	}
	for (var i = 0; i < oElements.length; i++) {
		if ((oElements[i].type == 'checkbox' && !oElements[i].checked) ||
			(oElements[i].type == 'radio' && !oElements[i].checked) ||
			(oElements[i].disabled) || (oElements[i].name == '') || (oElements[i].type == 'reset')) {
			continue;
		}
		if (oElements[i].type == 'select-multiple') {
			for (var j = 0; j < oElements[i].options.length; j++) {
				if (oElements[i].options[j].selected == true) {
					sParams += (sParams == '' ? '' : '&') + oElements[i].name + '=' + encodeURIComponent(oElements[i].options[j].value);
				}
			}
		} else {
			sValue = bStripTags ? this.stripTags({ value: oElements[i].value }) : oElements[i].value;
			sParams += (sParams == '' ? '' : '&') + oElements[i].name + '=' + encodeURIComponent(sValue);
		}
	}
	return sParams;
};
Lytebox.prototype.getRequestObject = function () {
	var oReq = null;
	if (window.XMLHttpRequest) {
		try { oReq = new XMLHttpRequest(); } catch (e) { }
	} else if (typeof ActiveXObject != 'undefined') {
		try {
			oReq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try { oReq = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { }
		}
	}
	return oReq;
};
Lytebox.prototype.isEmpty = function(args) {
	var sValue = '';
	try {
		sValue = this.isEmpty(args.value) ? args : args.value;
	} catch(e) {
		sValue = args;
	}
	return (this.trim(sValue) == '' || sValue == 'null' || sValue == null || typeof(sValue) == 'undefined');
};
Lytebox.prototype.stripTags = function(args) {
	var oElement = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	if (!this.isEmpty(oElement)) {
		oElement.value = String(oElement.value).replace(/(<([^>]+)>)/ig, '');
	} else {
		var sValue = '';
		try {
			sValue = this.isEmpty(args.value) ? args : args.value;
		} catch(e) {
			sValue = args;
		}
		return (this.trim(sValue) == '[object Object]') ? '' : String(sValue).replace(/(<([^>]+)>)/ig, '');
	}
};
Lytebox.prototype.trim = function(args) {
	var sValue = '';
	try {
		sValue = this.isEmpty(args.value) ? args : args.value;
	} catch(e) {
		sValue = args;
	}
	return String(sValue).replace(/^\s+|\s+$/g, '');
};
Lytebox.prototype.capitalize = function (args) {
	return String(args.value ? args.value : args).replace( /(^|\s)([a-z])/g , function(m,p1,p2){return p1+p2.toUpperCase();});
};
Lytebox.prototype.hasClass = function (args) {
	var sClass = this.isEmpty(args.name) ? '' : args.name;
	var oElement = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	return new RegExp('(\\s|^)' + sClass + '(\\s|$)').test(oElement.className);
};
Lytebox.prototype.addClass = function (args) {
	var sClass = this.isEmpty(args.name) ? '' : args.name;
	var oElement = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	var aClasses = sClass.split(' ');
	for (var i = 0; i < aClasses.length; i++) {
		if (!this.hasClass({ element: oElement, name: aClasses[i] })) {
			oElement.className += ' ' + aClasses[i];
		}
	}
};
Lytebox.prototype.removeClass = function (args) {
	var sClass = this.isEmpty(args.name) ? '' : args.name;
	var oElement = this.isEmpty(args.id) ? (this.isEmpty(args.element) ? null : args.element) : document.getElementById(args.id);
	var aClasses = sClass.split(' ');
	for (var i = 0; i < aClasses.length; i++) {
		if (this.hasClass({ element: oElement, name: aClasses[i] })) {
			oElement.className = oElement.className.replace(new RegExp('(\\s|^)' + aClasses[i] + '(\\s|$)'), ' ').replace(/\s+/g, ' ').replace(/^\s|\s$/, '');
		}
	}
};
if (window.addEventListener) {
	window.addEventListener("load", initLytebox, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", initLytebox);
} else {
	window.onload = function() {initLytebox();}
}
function initLytebox() { myLytebox = $lb = new Lytebox(true, $lb.http); }
myLytebox = $lb = new Lytebox(false);