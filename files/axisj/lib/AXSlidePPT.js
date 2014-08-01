/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXSlidePPT = Class.create(AXJ, {
    version: "AXSlidePPT V0.2",
    author: "tom@axisj.com",
	logs: [
		"2014-02-06 오후 8:31:00 - tom: start",
		"2014-03-04 오후 2:08:59 - tom : bugFix"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
		this.config.theme = "AXSlidePPT";
    },
    init: function() {
		var cfg = this.config;
		var _this = this;
		
		this.ratio = this._ratio = (axf.browser.mobile) ? 0.43 : 0.2;
		
		this.domTarget = axdom("#"+cfg.targetID);
		this.domTarget.addClass(cfg.theme);
		this.domTarget.attr("onselectstart", "return false;");
		
		axdom(window).resize(this.windowResize.bind(this));

		this.slideInit(); // 처리후 setSize 호출 해줘야 함.
		this.setSize();
		this.isInit = true;
		this.viewMode = "close";
		this.bindEvent("slide");
    },
    setSize: function(){
    	var _this = this;
    	var brSize = {};
		brSize.width = axf.clientWidth();
		brSize.height = axf.clientHeight();
		
		this.domTarget.css({width:brSize.width, height:brSize.height, background:"#eee"});
		this.brSize = brSize;
		this.itemSetSize();
    },
    itemSetSize: function(_ratio, dx, animate){
    	var brSize = this.brSize;
		var ratio = this.ratio, screenRatio = brSize.width / brSize.height;
		
		if(_ratio != undefined){
			ratio = _ratio.round(2);
			//if((screenRatio = brSize.width / brSize.height) > 2) ratio = 0.5 + (screenRatio - 2)/5;
		}
		
		this.ratio = ratio;
		
		//trace(ratio);
		
    	this.sildeCT.css({height:(brSize.height * ratio)-5});
    	
    	var sildeScrollWidth = 5;
    	var itemWidth = ((brSize.height * ratio - 10) * screenRatio).floor() - 5;
    	var itemHeight = (brSize.height * ratio) - 10;
		
    	axf.each(this.slideDoms, function(idx, item){
			item.axdom.css({width: itemWidth, height: itemHeight, left:(item.left = item._left = ((itemWidth + 5) * idx) + 5)});
			sildeScrollWidth += itemWidth + 5;
    	});
		
    	if(this.mouseDownAttr){
    		var newLeft = (this.mouseDownAttr.slideScrollLeft) * sildeScrollWidth / this.mouseDownAttr.slideScrollWidth;
    		if(animate){
    			this.slideScroll.css( {left:newLeft + (this.animateAttr.x) + (dx||0)} );
    		}else{
				this.slideScroll.css( {left:newLeft + (this.mouseDownAttr.x) + (dx||0)} );
			}
    	}

    	this.itemWidth = itemWidth + 5;
    	this.itemHeight = itemHeight;
    	this.slideScrollWidth = sildeScrollWidth;
    },
    windowResizeApply: function(){
    	this.setSize();
    },
    
    preLoadingSlide: function(onEnd){
    	var cfg = this.config;

    	var myProgress = this.myProgress;
    	var imgIndex = 1;
    	var loadImg = function(){
    		if(imgIndex == cfg.slides.length){
    			if(onEnd) onEnd();
    			mask.close();
    			myProgress.close();
    			return;
    		}
			var myImg = new Image();
			/*trace(cfg.slides[imgIndex].src);*/
			myImg.src = cfg.slides[imgIndex].src;
			myImg.onload = function(){
				myProgress.update();
				loadImg();
				imgIndex++;
			}
    	};
    	loadImg();
    },
    slideInit: function(){
    	var cfg = this.config;
    	var _this = this;
    	
    	this.selectedIndex = 0;
    	
    	var po = [];
    	po.push('<div class="AXSlideThumbnail">');
    	po.push('<div class="AXSlideThumbnailScroll">');
    	var sidx = 0;
    	for(;sidx<cfg.slides.length;){
    		po.push('<div class="AXSlideItem" id="AXSlideItem_AX_', sidx,'">', sidx,'</div>');
    		sidx++;
    	}
    	po.push('</div>');
    	po.push('</div>');
    	this.domTarget.append(po.join(''));
    	
    	//po = [];
    	//po.push('<div class="AXSlideDoc" id="' + cfg.targetID + '_0" style="background:url(' + cfg.slides[this.selectedIndex].src + ') no-repeat #fff center center;background-size:contain;">');
    	//po.push('</div>');
    	//this.domTarget.append(po.join(''));
    	
    	this.sildeCT = this.domTarget.find(".AXSlideThumbnail");
    	this.slideScroll = this.domTarget.find(".AXSlideThumbnailScroll");

    	var slideDoms = [];
    	this.domTarget.find(".AXSlideItem").each(function(){
    		slideDoms.push({id:this.id.split(/_AX_/g).last().number(), axdom:axdom(this), dom:this});
    	});
    	this.slideDoms = slideDoms;
    },
	bindEvent: function (type) {
		var cfg = this.config, _this = this;
		
		/* event 선언자 */
		var cancelEvent = this.cancelEvent.bind(this);
		this.cancelEventBind = function (event) {
			cancelEvent(event, type);
		}
		var onMouseDown = this.onMouseDown.bind(this);
		this.onMouseDownBind = function (event) {
			onMouseDown(event, type);
		}
		var onMouseMove = this.onMouseMove.bind(this);
		this.onMouseMoveBind = function (event) {
			onMouseMove(event, type);
		}
		var onMouseUp = this.onMouseUp.bind(this);
		this.onMouseUpBind = function (event) {
			onMouseUp(event, type);
		}
		//this.onWheelBind = this.onWheel.bind(this);
		/* event 선언자 */

		this.domTarget.bind("dragstart", this.cancelEventBind);
		this.sildeCT.bind("mousedown", this.onMouseDownBind);
		this.sildeCT.bind("click", this.onMouseclick.bind(this));

		/*
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		if (document.attachEvent) { //if IE (and Opera depending on user setting)
			if (AXgetId(cfg.targetID)) AXgetId(cfg.targetID).attachEvent("on" + mousewheelevt, this.SBonWheelBind);
		} else if (document.addEventListener) { //WC3 browsers
			if (AXgetId(cfg.targetID)) AXgetId(cfg.targetID).addEventListener(mousewheelevt, this.SBonWheelBind, false);
		}
		*/
		if (document.addEventListener) {
			var onTouchstart = this.onTouchstart.bind(this);
			this.touchstartBind = function () {
				onTouchstart(null, type);
			};
			if (axf.getId(cfg.targetID)){
				axf.getId(cfg.targetID).addEventListener("touchstart", this.touchstartBind, false);
			}
		}
	},
	
	openSlide: function(slideNo){
		if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		
		var cfg = this.config, _this = this;
		
		if(slideNo < 0) slideNo = 0;
		if(slideNo > this.slideDoms.length-1) slideNo = this.slideDoms.length-1;
		
		
		this.openSlideNo = slideNo;
		this.viewMode = "open";
		this.animateAttr = {x:this.mouseDownAttr.x};
		_this.slideScroll.stop();
		var applyRatio = function(ratio){
			var myRatio = ratio + 0.1;
			if(myRatio > 1) myRatio = 1;
			_this.itemSetSize( myRatio, null, "animate" );
			if(myRatio != 1){
				setTimeout(function(){
					applyRatio(myRatio);
				}, 10);
			}else{
				myRatio = 1;
				_this.slideScroll.animate({left: - (_this.slideDoms[slideNo].axdom.position().left - 5)}, 300, "expoOut", function () {
					
				});
			}
		};
		applyRatio(this.ratio);
	},
	closeSlide: function(slideNo){
		if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		
		var cfg = this.config, _this = this;

		this.closeSlideIng = true;
		this.viewMode = "close";
		
		_this.slideScroll.stop();
		this.animateAttr = {x:this.mouseDownAttr.x};
		var applyRatio = function(ratio){
			var myRatio = (ratio - 0.1).round(1);
			if(myRatio < _this._ratio) myRatio = _this._ratio;
			_this.itemSetSize( myRatio, null, "animate" );
			//trace(myRatio, _this._ratio);
			if(myRatio != _this._ratio){
				setTimeout(function(){
					applyRatio(myRatio);
				}, 10);
			}else{
				myRatio = _this._ratio;
				_this.closeSlideIng = false;
				/*
				_this.slideScroll.animate({left: - (_this.slideDoms[slideNo].axdom.position().left - 5)}, 100, "", function () {
					
				});
				*/
			}
		};
		applyRatio(this.ratio);
	},
	pagemoveSlide: function(slideNo){
		if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		
		var cfg = this.config, _this = this;
		
		if(slideNo < 0) slideNo = 0;
		if(slideNo > this.slideDoms.length-1) slideNo = this.slideDoms.length-1;
		
		this.openSlideNo = slideNo;
		//trace("pagemoveSlide" + slideNo);
		_this.slideScroll.stop();
		_this.slideScroll.animate({left: - (_this.slideDoms[slideNo].axdom.position().left - 5)}, 500, "expoOut", function () {
			
		});
	},
	
	/* events */
	getMousePosition: function (event, type) {
		var cfg = this.config;
		var pos = {left:0, top:0};
		var mouse = {};
		if(event.touches){
			mouse.x = event.touches[0].pageX;
			mouse.y = event.touches[0].pageY;
		}else{
			mouse.x = event.pageX;
			mouse.y = event.pageY;
		}
		if(this.mouseDownAttr){
			return { ox:this.mouseDownAttr.x, oy:this.mouseDownAttr.y, x: (mouse.x - pos.left), y: (mouse.y - pos.top), dx:(this.mouseDownAttr.x - mouse.x - pos.left), dy:(this.mouseDownAttr.y - mouse.y - pos.top) };
		}else{
			return { x: (mouse.x - pos.left), y: (mouse.y - pos.top) };
		}
	},
	
	onMouseclick: function(event){
		var cfg = this.config, _this = this;
		if(this.mouseMoved) return;
		var slideNo = event.target.id.split(/_AX_/g).last();
		//trace("click" + slideNo);
		this.openSlide(slideNo);
	},
	
	onMouseDown: function(event, type){
		var cfg = this.config, _this = this;
		var slideNo = event.target.id.split(/_AX_/g).last();
		var mouse = this.getMousePosition(event);
		
		this.mouseDownAttr = { 
			sTime: ((new Date()).getTime() / 1000), x:mouse.x, y:mouse.y,
			ex:mouse.x, ey:mouse.y,
			ratio: this.ratio,
			_slideScrollLeft: this.slideScroll.position().left,
			slideScrollLeft: this.slideScroll.position().left - mouse.x,
			slideScrollWidth: this.slideScrollWidth,
			slideNo: slideNo
		};
		
		if(type == "slide"){
			/*
	    	axf.each(this.slideDoms, function(idx, item){
	    		item.left = item._left = item.axdom.position().left;
	    	});
	    	*/
	    	this.slideScrollLeft = this.slideScroll.position().left;
		}
		
		axdom(document.body).bind("mousemove.AXSlidePPT", this.onMouseMoveBind);
		axdom(document.body).bind("mouseup.AXSlidePPT", this.onMouseUpBind);
		axdom(document.body).bind("mouseleave.AXSlidePPT", this.onMouseUpBind);
	},
	onMouseMove: function(event, type){
		if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		
		var cfg = this.config, _this = this;
		var mouse = this.getMousePosition(event);
		
		//trace({dx:mouse.dx, dy:mouse.dy});
		if(this.mouseDownAttr.type == undefined){
			if(mouse.dx.abs() > mouse.dy.abs()){
				this.mouseDownAttr.type = "x";
			}else{
				this.mouseDownAttr.type = "y";
			}
		}

		if(mouse.dx.abs() > 2 || mouse.dy.abs() > 2){
			//trace(mouse.dy);
			this.mouseMoved = true;
		}
		
		this.moveSlide(event, -mouse.dx, mouse.dy);
		this.mouseDownAttr.eex = mouse.x;
		this.mouseDownAttr.eey = mouse.y;
		
		var onMoveAfter = this.onMoveAfter.bind(this);
		this.onMoveAfterObserver = setTimeout(function () {
			onMoveAfter(event);
		}, 50);
	},
	onMouseUp: function(event, type){
		var cfg = this.config, _this = this;
		
		axdom(document.body).unbind("mousemove.AXSlidePPT");
		axdom(document.body).unbind("mouseup.AXSlidePPT");
		axdom(document.body).unbind("mouseleave.AXSlidePPT");
		
		var moveEndSlide = this.moveEndSlide.bind(this);
		this.onMoveEndObserver = setTimeout(function () {
			moveEndSlide();
			_this.mouseMoved = false;
		}, 10);
		
	},
	onTouchstart: function(event, type){
		//if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		//if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		var cfg = this.config, _this = this;
		var event = window.event;
		var slideNo = event.target.id.split(/_AX_/g).last();
		var mouse = this.getMousePosition(event);
		this.mouseDownAttr = { 
			sTime: ((new Date()).getTime() / 1000), x:mouse.x, y:mouse.y,
			ex:mouse.x, ey:mouse.y,
			ratio: this.ratio,
			_slideScrollLeft: this.slideScroll.position().left,
			slideScrollLeft: this.slideScroll.position().left - mouse.x,
			slideScrollWidth: this.slideScrollWidth,
			slideNo: slideNo
		};
		
		if(type == "slide"){
			/*
	    	axf.each(this.slideDoms, function(idx, item){
	    		item.left = item._left = item.axdom.position().left;
	    	});
	    	*/
	    	this.slideScrollLeft = this.slideScroll.position().left;
		}
		
		var touchEnd = this.onTouchEnd.bind(this);
		this.touchEndBind = function () {
			touchEnd(event);
		};	
		var touchMove = this.onTouchMove.bind(this);
		this.touchMoveBind = function () {
			touchMove(event);
		};
		
		if (document.removeEventListener) {
			document.removeEventListener("touchend", this.touchEndBind, false);
			document.removeEventListener("touchmove", this.touchMoveBind, false);
		}
		if (document.addEventListener) {
			document.addEventListener("touchend", this.touchEndBind, false);
			document.addEventListener("touchmove", this.touchMoveBind, false);
		}			
	},
	onTouchMove: function (e) {
		if (this.onMoveEndObserver) clearTimeout(this.onMoveEndObserver);
		if (this.onMoveAfterObserver) clearTimeout(this.onMoveAfterObserver);
		var cfg = this.config, _this = this;
		
		var event = window.event;
		var mouse = this.getMousePosition(event);
		this.mouseDownAttr.eex = mouse.x;
		this.mouseDownAttr.eey = mouse.y;
		
		if(this.mouseDownAttr.type == undefined){
			if(mouse.dx.abs() > mouse.dy.abs()){
				this.mouseDownAttr.type = "x";
			}else{
				this.mouseDownAttr.type = "y";
			}
		}
		if(mouse.dx.abs() > 2 || mouse.dy.abs() > 2){
			this.mouseMoved = true;
		}
		
		this.moveSlide(event, -mouse.dx, mouse.dy);
		
		var onMoveAfter = this.onMoveAfter.bind(this);
		this.onMoveAfterObserver = setTimeout(function () {
			onMoveAfter(mouse);
		}, 50);
		
		if (event.stopPropagation) event.stopPropagation();
		if (event.preventDefault) event.preventDefault();
		return false;
	},
	onTouchEnd: function (e) {
		var cfg = this.config;
		var event = window.event || e;
		//var mouse = this.getMousePosition(event);

		if (document.removeEventListener) {
			document.removeEventListener("touchend", this.touchEndBind, false);
			document.removeEventListener("touchmove", this.touchMoveBind, false);
		}
		
		//trace("moveEndSlide");
		
		var moveEndSlide = this.moveEndSlide.bind(this);
		this.onMoveEndObserver = setTimeout(function () {
			moveEndSlide();
			_this.mouseMoved = false;
		}, 10);
	},
	onMoveAfter: function(e){
		//trace("onMoveAfter");
		var event = window.event || e;
		var mouse = this.getMousePosition(event);
		try{
			this.mouseDownAttr.sTime = ((new Date()).getTime() / 1000);
			this.mouseDownAttr.ex = mouse.x;
			this.mouseDownAttr.ey = mouse.y;
		}catch(e){
			//trace(e);
		}
	},
	cancelEvent: function (event, type) {
		event.stopPropagation(); // disable  event
		event.preventDefault();
		return false;
	},
	/* events */
	
	moveSlide: function(event, dx, dy){
		var cfg = this.config, _this = this;
		var itemWidth = this.itemWidth;
		var sildeScrollWidth = this.slideScrollWidth;

		if(this.viewMode == "open"){
			if(this.mouseDownAttr.type == "x"){
				this.slideScroll.css( {left: this.slideScrollLeft + dx} );
			}else{
				if(this.closeSlideIng) return;
				var ratio = this.mouseDownAttr.ratio + dy/axf.clientHeight();
				this.itemSetSize( ratio, dx );
				/*
				var ratio = this.mouseDownAttr.ratio + dy/axf.clientHeight();
				if( (ratio < 0.97 && axf.browser.mobile) || (ratio < 0.90 && !axf.browser.mobile) ){
					this.closeSlide( this.mouseDownAttr.slideNo );
				}
				*/
			}
		}else{
			if(this.mouseDownAttr.type == "x"){
				this.slideScroll.css( {left: this.slideScrollLeft + dx} );
			}else{
				var ratio = this.mouseDownAttr.ratio + dy/axf.clientHeight();
				this.itemSetSize( ratio, dx );
			}
		}
	},
	moveEndSlide: function(){
		var cfg = this.config, _this = this;
		/* 관성발동여부 체크 */

		if(!this.mouseDownAttr) return;
		if(this.mouseDownAttr.ex === undefined) return;
		
		if(_this.mouseDownAttr.type == "y"){
			var bigRatio = (axf.browser.mobile) ? 0.6 : 0.6;
			if( this.viewMode == "open" && _this.ratio < 0.95 ){
				this.closeSlide( this.mouseDownAttr.slideNo );
			}else if( _this.ratio < _this._ratio ){
				_this.itemSetSize( _this._ratio );
			}else if( _this.ratio < bigRatio ){
				_this.itemSetSize( _this._ratio );
				
			}else{
				//trace(_this.mouseDownAttr.slideNo);
				_this.openSlide(_this.mouseDownAttr.slideNo);
				/*
				var endLeft = _this.slideScroll.position().left;
				if( endLeft > 0 ){
					_this.slideScroll.animate({left: 0}, 100, "", function () {
						
					});
				}else if(endLeft < (axf.clientWidth() - _this.slideScrollWidth - 5)) {
					_this.slideScroll.animate({left: (axf.clientWidth() - _this.slideScrollWidth - 5)}, 100, "", function () {
						
					});
				}
				*/
			}
			
		}else{
			
			if( this.viewMode == "open" ){
				// 보기에서 관성 --------------- s
				
				//trace(this.mouseDownAttr._slideScrollLeft.abs(), this.slideScroll.position().left.abs());
				if(this.mouseDownAttr._slideScrollLeft == this.slideScroll.position().left){
					
				}else if(this.mouseDownAttr._slideScrollLeft > this.slideScroll.position().left){
					//trace("next");
					this.pagemoveSlide(this.openSlideNo.number() + 1);
				}else{
					//trace("prev");
					this.pagemoveSlide(this.openSlideNo.number() - 1);
				}
				
				//trace(this.slideScrollLeft, this.itemWidth, this.slideScrollLeft.abs() % this.itemWidth);

				
				// 보기에서 관성 --------------- e
			}else{
				// 목록보기에서 관성 --------------- s
				var sTime = this.mouseDownAttr.sTime;
				var eTime = ((new Date()).getTime() / 1000);
				var dTime = eTime - sTime;
		
				var d_ex = this.mouseDownAttr.ex - this.mouseDownAttr.eex;
				var velocityLeft = Math.ceil((d_ex/dTime)/1); // 속력= 거리/시간
				var end_x = Math.ceil(d_ex + velocityLeft); //스크롤할때 목적지
				
				var slideScrollEndCheck = function(){
					var endLeft = _this.slideScroll.position().left;
					
						if( endLeft > 0 ){
							//_this.slideScroll.animate( {left: 0} );
							_this.slideScroll.animate({left: 0}, 100, "", function () {
								
							});
						}else if(endLeft < (axf.clientWidth() - _this.slideScrollWidth - 5)) {
							trace("end pp ");
							_this.slideScroll.animate({left: (axf.clientWidth() - _this.slideScrollWidth - 5)}, 100, "", function () {
								
							});
						}else{
	
						}
		
					this.mouseDownAttr = null;
					this.mouseMoved = false;
				};
				
				if(isNaN(end_x) || end_x.abs() < 50){
					slideScrollEndCheck();
					return;
				}
				
				if(end_x.abs() > 0){
					var aniX = this.slideScrollLeft - end_x;
					if(aniX > 0) aniX = 0;
					if(aniX < (axf.clientWidth() - this.slideScrollWidth -5)) aniX = (axf.clientWidth() - this.slideScrollWidth - 5);
					this.slideScroll.animate({left: aniX}, 300, "circOut", function () {
						slideScrollEndCheck();
					});
				}else{
					slideScrollEndCheck();
				}
				// 목록보기에서 관성 --------------- e
			}
			
		}
	}
});