/**
 * AXSlideViewer
 * @class AXSlideViewer
 * @extends AXJ
 * @version v1.2
 * @author tom@axisj.com
 * @logs
 "2014-03-23 오후 3:33:35 - tom: start",
 "2014-03-28 오전 8:35:50 - tom: Beta 완성",
 "2014-04-24 - tom: onClose 추가"
 "2014-07-04 tom:bugFix, IE8 img.onload"
 *
 */

var AXSlideViewer = Class.create(AXJ, {
    initialize: function(AXJ_super) {
        AXJ_super();
		this.config.theme = "AXSlideViewer";
		/*this.uniqueId = axf.getUniqueId();*/
		this.config.id = axf.getUniqueId();
		this.config.fitToHeight = false;
		var _parent = this, cfg = this.config;
		this.touchUpdater = {
			firstTouch:{}, firstBoxModel:{}, moveType:"", item:{}, lastTouch:{},
			watch: function(){
				var _this = this;
				
				if(axf.browser.mobile){
					axdom(document.body).bind("touchmove.axsliderviewer", function(){
						_this.update(window.event);
					});
					axdom(document.body).bind("touchend.axsliderviewer", function(){
						_this.watchEnd(window.event);
					});
				}else{
					axdom(document.body).bind("mousemove.axsliderviewer", function(event){
						_this.update(event);
					});
					axdom(document.body).bind("mouseup.axsliderviewer", function(event){
						_this.watchEnd(event);
					});
					axdom(document.body).bind("mouseleave.axsliderviewer", function(event){
						_this.watchEnd(event);
					});
				}
			},
			update: function(event){
				var touch = {};
				
				if(axf.browser.mobile){
					touch.pageX1 = event.touches[0].pageX - this.item._boxModel.dL;
					touch.pageY1 = event.touches[0].pageY - this.item._boxModel.dT;
	
					if(event.touches.length == 2){
						touch.pageX2 = event.touches[1].pageX - this.item._boxModel.dL;
						touch.pageY2 = event.touches[1].pageY - this.item._boxModel.dT;
						touch.centerX = (touch.pageX2 + touch.pageX1) / 2;
						touch.centerY = (touch.pageY2 + touch.pageY1) / 2;
					}else{
						touch.centerX = touch.pageX1;
						touch.centerY = touch.pageY1;
					}
						
	
					this.lastTouch = touch;
					_parent.imgTouchUpdate( {firstTouch:this.firstTouch, firstBoxModel:this.firstBoxModel, touch:touch, moveType:this.moveType, item:this.item}, event );
	
					if (event.stopPropagation) event.stopPropagation();
					if (event.preventDefault) event.preventDefault();
					return false;
					
				}else{
					touch.pageX1 = event.pageX - this.item._boxModel.dL;
					touch.pageY1 = event.pageY - this.item._boxModel.dT;
					touch.centerX = touch.pageX1;
					touch.centerY = touch.pageY1;

					this.lastTouch = touch;
					_parent.imgTouchUpdate( {firstTouch:this.firstTouch, firstBoxModel:this.firstBoxModel, touch:touch, moveType:this.moveType, item:this.item}, event );

				}
				
			},
			watchEnd: function(event){				
				if(axf.browser.mobile){
					axdom(document.body).unbind("touchmove.axsliderviewer");
					axdom(document.body).unbind("touchend.axsliderviewer");
				}else{
					axdom(document.body).unbind("mousemove.axsliderviewer");
					axdom(document.body).unbind("mouseup.axsliderviewer");
					axdom(document.body).unbind("mouseleave.axsliderviewer");
				}
				//관성 적용 법칙...
				_parent.imgTouchEnd( {firstTouch:this.firstTouch, firstBoxModel:this.firstBoxModel, moveType:this.moveType, item:this.item}, event );	
			}
		};
		this.touchClicked = false;
		this.touchDblClicked = false;
		this.touchAndMoved = false;
    },
    init: function() {
		var cfg = this.config;
		var reserveKeys = {
			title: "title",
			description: "description",
			url: "url"
		};
		if (cfg.reserveKeys) {
			axf.overwriteObject(reserveKeys, cfg.reserveKeys, true);
			cfg.reserveKeys = reserveKeys;
		} else {
			cfg.reserveKeys = reserveKeys;
		}
    },
    open: function(jsObject){ // jsArray, jsObject
     	var cfg = this.config, _this = this;
     	
     	this.isOpend = true;
     	
     	axdom(document.body).data("scrollTop", axdom(document.body).scrollTop());
     	axdom(document.body).children().hide();
     	//this.bodyElement = axdom(document.body).children().not("script");
     	//axdom(document.body).children().not("script").remove();
     	
		this.screenSize = {
			width:axf.clientWidth(),
			height:axf.clientHeight()
		};
     	var po = [];
     	po.push('<div id="'+ cfg.id +'_AX_viewer" class="' + cfg.theme + ' AXUserSelectNone" onselectstart="return false">');
     	
     		po.push('<div class="background" id="'+ cfg.id +'_AX_background"></div>');
     		
     		po.push('<div class="slideItemGroup" id="'+ cfg.id +'_AX_slideItemGrop">');
	     	po.push('</div>');	
     		
     		po.push('<div class="controller" id="'+ cfg.id +'_AX_controller">');
	     			
	     			po.push('<div class="hgroup">');
	     				po.push('<h1></h1>');
	     				po.push('<span></span>');
	     			po.push('</div>');

	     			po.push('<div class="navigation"></div>');

     				po.push('<div class="buttonGroup">');
	     				po.push('<a class="ToggleHandle" type="button">Toggle</a>');
	     				po.push('<a class="Prev" type="button">Prev</a>');
		     			po.push('<a class="Next" type="button">Next</a>');
		     			po.push('<a class="ZoomIn" type="button">Next</a>');
		     			po.push('<a class="ZoomOut" type="button">Next</a>');
		     		po.push('</div>');

	     			po.push('<a class="Close" type="button">Close</a>');
     		po.push('</div>');
     		
     	po.push('</div>');
     	
     	axdom(document.body).append( po.join('') );
     	
     	this.target = axdom( '#' + cfg.id +'_AX_viewer' );
     	this.background = axdom( '#' + cfg.id +'_AX_background' );
     	this.slideItemGrop = axdom( '#' + cfg.id +'_AX_slideItemGrop' );
     	this.controller = axdom( '#' + cfg.id +'_AX_controller' );
     	
     	this.controller.find(".Close").bind("click.AXSlideViewer", function(event){
     		_this.close();
     	});

     	this.controller.find(".ToggleHandle").bind("click.AXSlideViewer", function(event){
     		_this.controller.find(".buttonGroup").toggleClass("open");
     	});
     	this.controller.find(".Prev").bind("click.AXSlideViewer", function(event){
     		_this.prev();
     	});
     	this.controller.find(".Next").bind("click.AXSlideViewer", function(event){
     		_this.next();
     	});
     	
     	this.controller.find(".ZoomIn").bind("click.AXSlideViewer", function(event){
     		_this.zoomIn();
     	});
     	this.controller.find(".ZoomOut").bind("click.AXSlideViewer", function(event){
     		_this.zoomOut();
     	});
     	
     	this.list = jsObject.list;
     	this.selectedIndex = (jsObject.selectedIndex || 0);

     	this.openImage(this.selectedIndex);
     	axdom(window).bind("resize.AXSliderViewer", this.windowResize.bind(this));
     	
		if(axf.browser.mobile){
			
			var eventBodyID = cfg.id +'_AX_slideItemGrop';
			if (document.addEventListener) { // 터치 이벤트 시작
				AXgetId(eventBodyID).addEventListener("touchstart", function(event){
					var touch = {};
					var item = _this.list[_this.selectedIndex];
					
					if (_this.touhEndObserver) clearTimeout(_this.touhEndObserver);
					_this.velocityDX = 0;
					_this.velocityDY = 0;
					touch.pageX1 = event.touches[0].pageX - item._boxModel.dL;
					touch.pageY1 = event.touches[0].pageY - item._boxModel.dT;
					if(event.touches.length == 2){
						touch.pageX2 = event.touches[1].pageX - item._boxModel.dL;
						touch.pageY2 = event.touches[1].pageY - item._boxModel.dT;
						touch.centerX = (touch.pageX2 + touch.pageX1) / 2;
						touch.centerY = (touch.pageY2 + touch.pageY1) / 2;
						_this.touchUpdater.moveType = "zoom";
					}else{
						touch.centerX = touch.pageX1;
						touch.centerY = touch.pageY1;
						_this.touchUpdater.moveType = "move";
					}
					_this.touchUpdater.firstTouch = touch;
					_this.touchUpdater.firstBoxModel = axf.copyObject(item._boxModel);
					_this.touchUpdater.item = item;
					_this.touchUpdater.watch();
				}, false);
			}
			
		}else{ // deskTop
			
			var eventBodyID = cfg.id +'_AX_slideItemGrop';

				axdom("#" +eventBodyID).bind("mousedown.axsliderviewer", function(event){
					var touch = {};
					var item = _this.list[_this.selectedIndex];
					
					if (_this.touhEndObserver) clearTimeout(_this.touhEndObserver);
					_this.velocityDX = 0;
					_this.velocityDY = 0;
					touch.pageX1 = event.pageX - item._boxModel.dL;
					touch.pageY1 = event.pageY - item._boxModel.dT;

					touch.centerX = touch.pageX1;
					touch.centerY = touch.pageY1;
					
					_this.touchUpdater.moveType = "move";

					_this.touchUpdater.firstTouch = touch;
					_this.touchUpdater.firstBoxModel = axf.copyObject(item._boxModel);
					_this.touchUpdater.item = item;
					_this.touchUpdater.watch();
				});
				
				var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
				var contentScrollScrollWheel = function(){
					if (_this.wheelEndObserver) clearTimeout(_this.wheelEndObserver);
					var event = window.event;
					var delta = event.detail ? event.detail * (-1) : event.wheelDelta;
			    	var item = _this.list[_this.selectedIndex];
			    	
			    	var cx = event.pageX  - item._boxModel.dL;
			    	var cy = event.pageY  - item._boxModel.dT;
			    	var dLen = (delta > 0) ? 50 : -50;
			    	_this.imgResize(item, item._boxModel, dLen, cx, cy);
			    	_this.wheelEndObserver = setTimeout(function(){
						var pos = item._axdom.position();						
				    	var sL = 0, eL = 0, sT = 0, eT = 0, scW = _this.screenSize.width, scH = _this.screenSize.height, iW = item._axdom.width(), iH = item._axdom.height();
				    	
				    	var imgAnmate = false;
				    	var css = {left:pos.left, top:pos.top, opacity:1};
				    	var __left = css.left, __top = css.top;
				    	
				    	if(iW < scW && iH < scH){
				    		iW = css.width = item._boxModel.width;
				    		iH = css.height  = item._boxModel.height;
				    	}
				
				    	if(iW < scW){
				    		sL = (scW - iW) / 2;
				    		eL = sL;
				    	}else{
				    		sL = 0;
				    		eL = scW - iW;
				    	}
				    	if(iH < scH){
				    		sT = (scH - iH) / 2;
				    		eT = sT;
				    	}else{
				    		sT = 0;
				    		eT = scH - iH;
				    	}
				
				    	if(css.left > sL ){
				    		css.left = sL;
				    		imgAnmate = true;
				    	}else if(css.left < eL ){
				    		css.left = eL;
				    		imgAnmate = true;
				    	}
				    	if(css.top > sT ){
				    		css.top = sT;imgAnmate = true;
				    	}else if(css.top < eT ){
				    		css.top = eT;imgAnmate = true;
				    	}
				    	if(imgAnmate){
				    		item._axdom.stop();
				    		item._axdom.animate(css);
					    	if(!isNaN(css.left)) item._boxModel.dL = css.left;
					    	if(!isNaN(css.top)) item._boxModel.dT = css.top;

					    	if(!isNaN(css.width)) item._boxModel.dW = css.width;
					    	if(!isNaN(css.height)) item._boxModel.dH = css.height;
				    	}

			    		
			    	}, 300);
				};
				if (document.attachEvent) { /*if IE (and Opera depending on user setting) */
					AXgetId(eventBodyID).attachEvent("on" + mousewheelevt, contentScrollScrollWheel);
				} else if (document.addEventListener) { /*WC3 browsers */
					AXgetId(eventBodyID).addEventListener(mousewheelevt, contentScrollScrollWheel, false);
				}
				
			
		}
    },
	windowResizeApply: function () {
		var cfg = this.config, _this = this;
		this.screenSize = {
			width:axf.clientWidth(),
			height:axf.clientHeight()
		};
		
		var selectedIndex = this.selectedIndex;
		if(selectedIndex > 0){
			axdom('#' + cfg.id +'_AX_slide_AX_' + (selectedIndex-1)).css({left:-this.screenSize.width});
		}
		if(selectedIndex < this.list.length-1){
			axdom('#' + cfg.id +'_AX_slide_AX_' + (selectedIndex.number()+1)).css({left:this.screenSize.width});
		}
		
		var item = this.list[selectedIndex];
		_this.renderImage( axdom('#' + cfg.id +'_AX_slide_AX_' + selectedIndex), item);
	},
    openImage: function(selectedIndex){
    	var cfg = this.config, _this = this;
    	selectedIndex = selectedIndex.number();
    	var item = this.list[selectedIndex];

		//this.slideItemGrop
		var slides = [];
		if(selectedIndex > 0) slides.push( {id:cfg.id +'_AX_slide_AX_' + (selectedIndex-1), index:(selectedIndex-1), left:-this.screenSize.width} );
		slides.push( {id:cfg.id +'_AX_slide_AX_' + (selectedIndex), index:(selectedIndex), left:0} );
		if(selectedIndex < this.list.length-1) slides.push( {id:cfg.id +'_AX_slide_AX_' + (selectedIndex.number()+1), index:(selectedIndex.number()+1), left:this.screenSize.width} );	
		
		this.slideItemGrop.find(".slideItem").each(function(){
			for (var ii, i = 0; (i < slides.length && (ii = slides[i])); i++) {
				if(ii.id != this.id) axdom(this).remove();
			}
		});
		
		for (var ii, i = 0; (i < slides.length && (ii = slides[i])); i++) {
			if( !AXgetId(ii.id) ) this.slideItemGrop.append( '<div class="slideItem AXLoadingBlack" id="'+ ii.id +'" style="left:'+ ii.left +'px;"></div>' );
		}
		
		var hgroup = this.controller.find(".hgroup");
		hgroup.find("h1").html( item[cfg.reserveKeys.title] );
		hgroup.find("span").html( item[cfg.reserveKeys.description] );
		
		if(selectedIndex == 0){
			this.controller.find(".Prev").addClass("disabled");
			this.controller.find(".Next").removeClass("disabled");
		}else if(selectedIndex == this.list.length-1){
			this.controller.find(".Prev").removeClass("disabled");
			this.controller.find(".Next").addClass("disabled");
		}else{
			this.controller.find(".Prev").removeClass("disabled");
			this.controller.find(".Next").removeClass("disabled");
		}
		
		this.controller.find(".navigation").html( (selectedIndex+1) + " / " + this.list.length  );
		
		var mySlide = axdom('#' + cfg.id +'_AX_slide_AX_' + (selectedIndex));
		var myImg = new Image();

		if(!item._boxModel){
			myImg.onload = function(){
				item._boxModel = {originalWidth:this.width, originalHeight:this.height};
				_this.renderImage( mySlide , item);
			}
			myImg.src = item[cfg.reserveKeys.url];
		}else{
			myImg.src = item[cfg.reserveKeys.url];
			_this.renderImage( mySlide, item);
		}
    },
    renderImage: function( target, item ){
    	
		var cfg = this.config, _this = this;
		var imgRatio = (item._boxModel.originalHeight / item._boxModel.originalWidth).round(2);
		var imgWidth = item._boxModel.originalWidth; imgHeight = item._boxModel.originalHeight;
		
		if(cfg.fitToHeight == true){
			imgHeight = this.screenSize.height; imgWidth = imgHeight / imgRatio;
			if(this.screenSize.width > imgWidth){
				imgWidth = this.screenSize.width; imgHeight = imgWidth * imgRatio;
			}
		}else{
			if(imgRatio < 1){
				if(this.screenSize.width < imgWidth){
					imgWidth = this.screenSize.width; imgHeight = imgWidth * imgRatio;
				}
				if(this.screenSize.height < imgHeight){
					imgHeight = this.screenSize.height; imgWidth = imgHeight / imgRatio;
				}
			}else{
				if(this.screenSize.height < imgHeight){
					imgHeight = this.screenSize.height; imgWidth = imgHeight / imgRatio;
				}
				if(this.screenSize.width < imgWidth){
					imgWidth = this.screenSize.width; imgHeight = imgWidth * imgRatio;
				}
			}
		}
		
		item._boxModel.width = item._boxModel.dW = imgWidth;
		item._boxModel.height = item._boxModel.dH = imgHeight;
		
		var styles = [];
		styles.push("width:"+imgWidth+"px");
		styles.push("height:"+imgHeight+"px");

		item._boxModel.left = item._boxModel.dL = (this.screenSize.width / 2 - imgWidth / 2);
		item._boxModel.top = item._boxModel.dT = (this.screenSize.height / 2 - imgHeight / 2);
		
		styles.push("left:"+ item._boxModel.left +"px");
		styles.push("top:"+ item._boxModel.top +"px");
		
		var po = [];
		po.push('<div class="img" style="' + styles.join(";") + '">');
		po.push('<img src="' + item[cfg.reserveKeys.url] + '" style="width:100%;" ondragstart="return false;" />');
		po.push('</div>');
		
		target.empty();
		target.append( po.join('') );
		
		target.find(".img").fadeIn();
		target.removeClass("AXLoadingBlack");
		
		item._axdom = target.find(".img");
    },
    close: function(){
        var cfg = this.config, _this = this;
    	axdom(document.body).children().show(); //테스트 필요
    	axdom(document.body).scrollTop( axdom(document.body).data("scrollTop") );
        if(cfg.onClose) cfg.onClose.call(cfg);
    	this.target.fadeOut(function(){
    		_this.target.remove();
    	});
    	this.isOpend = false;
    	axdom(window).unbind("resize.AXSliderViewer");
    },
    prev: function(){
   		var cfg = this.config, _this = this;
    	var screenWidth = this.screenSize.width;
    	var selectedIndex = this.selectedIndex;
    	if(selectedIndex <= 0) return false;
    	var prevIndex = selectedIndex.number() - 1;
    	
    	var nowDomTarget = axdom('#' + cfg.id +'_AX_slide_AX_' + selectedIndex);
    	var prevDomTarget = axdom('#' + cfg.id +'_AX_slide_AX_' + prevIndex);

    	nowDomTarget.animate({left:screenWidth}, 500, "expoOut", function(){
    		
    	});
    	prevDomTarget.animate({left:0}, 300, "expoOut", function(){
			_this.selectedIndex = prevIndex;
			_this.openImage(prevIndex);
    	});
    	return true;
    },
    next: function(){
    	var cfg = this.config, _this = this;
    	var screenWidth = this.screenSize.width;
    	var selectedIndex = this.selectedIndex;
    	if(selectedIndex >= this.list.length-1) return false;
    	var nextIndex = selectedIndex.number() + 1;
    	
    	var nowDomTarget = axdom('#' + cfg.id +'_AX_slide_AX_' + selectedIndex);
    	var nextDomTarget = axdom('#' + cfg.id +'_AX_slide_AX_' + nextIndex);

    	nowDomTarget.animate({left:-screenWidth}, 500, "expoOut", function(){
    		
    	});
    	nextDomTarget.animate({left:0}, 300, "expoOut", function(){
			_this.selectedIndex = nextIndex;
			_this.openImage(nextIndex);
    	});
    	 return true;
    },
    zoomIn: function(){
    	var cfg = this.config, _this = this;
    	var item = this.list[this.selectedIndex];
    	
    	var cx = this.screenSize.width/2  - item._boxModel.dL;
    	var cy = this.screenSize.height/2  - item._boxModel.dT;
    	var dLen = (this.screenSize.width>this.screenSize.height) ? this.screenSize.height : this.screenSize.width;
    	this.imgResize(item, item._boxModel, dLen, cx, cy, "animate");
    },
    zoomOut: function(){
    	var cfg = this.config, _this = this;
    	var item = this.list[this.selectedIndex];
    	var cx = this.screenSize.width/2  - item._boxModel.dL;
    	var cy = this.screenSize.height/2  - item._boxModel.dT;
    	var dLen = (this.screenSize.width>this.screenSize.height) ? this.screenSize.height : this.screenSize.width;
    	this.imgResize(item, item._boxModel, -dLen, cx, cy, "animate");    	
    },
    
    imgResize: function(item, firstBoxModel, dLen, cx, cy, animate){
		//trace(firstBoxModel.dW);
    	//trace(item._boxModel.dW, item._boxModel.dH, item._boxModel.dL, item._boxModel.dT); 조작해야할 변수들
    	var cfg = this.config, _this = this;
    	var css = {}, newW, newH, newL, newT, imgRatio = (item._boxModel.originalHeight / item._boxModel.originalWidth).round(3);
    	
    	if(dLen == null){
    		
    		newL = item._boxModel.left
    		newT = item._boxModel.top
    		newW = item._boxModel.width
    		newH = item._boxModel.height
    		
    	}else{
	    	newW = firstBoxModel.dW + dLen;
	    	newH = newW * imgRatio;
	    	
	    	//firstBoxModel.dW : newW = cx : newL
	    	if(cx == null){
	    		newL = (this.screenSize.width/2);
	    		mewT = (this.screenSize.width/2);
		    	//newL = -(newW * cx / firstBoxModel.dW - cx) + firstBoxModel.dL;
		    	//newT = -(newH * cy / firstBoxModel.dH - cy) + firstBoxModel.dT;
	    	}else{
		    	newL = -(newW * cx / firstBoxModel.dW - cx) + firstBoxModel.dL;
		    	newT = -(newH * cy / firstBoxModel.dH - cy) + firstBoxModel.dT;
		    }
	    }
    	
    	// 영역을 벗어나는 변경에 대해서 감지
    	
    	css = {left:newL, top:newT, width:newW, height:newH, opacity:1};
    	if( this.changeImgCss(item._axdom, css, animate) ){	
	    	//현재아이템에 이동정보 기록
	    	item._boxModel.dL = newL;
	    	item._boxModel.dT = newT;
	    	item._boxModel.dW = newW;
	    	item._boxModel.dH = newH;
	    }
    },
    imgTouchUpdate: function(args){
    	var cfg = this.config;
    	this.touchAndMoved = true;
    	if (this.touhEndObserver) clearTimeout(this.touhEndObserver);
		if(args.moveType == "zoom"){
			var l1dx, l1dy, l2dx, l2dy, l1, l2, dLen;
			l1dx = (args.firstTouch.pageX2 > args.firstTouch.pageX1) ? args.firstTouch.pageX2 - args.firstTouch.pageX1 : args.firstTouch.pageX1 - args.firstTouch.pageX2;
			l1dy = (args.firstTouch.pageY2 > args.firstTouch.pageY1) ? args.firstTouch.pageY2 - args.firstTouch.pageY1 : args.firstTouch.pageY1 - args.firstTouch.pageY2;
			
			l2dx = (args.touch.pageY2 > args.touch.pageY1) ? args.touch.pageY2 - args.touch.pageY1 : args.touch.pageY1 - args.touch.pageY2;
			l2dy = (args.touch.pageY2 > args.touch.pageY1) ? args.touch.pageY2 - args.touch.pageY1 : args.touch.pageY1 - args.touch.pageY2;
			
	    	l1 = Math.sqrt(Math.pow(l1dx, 2) + Math.pow(l1dy, 2)); // 첫번째 터치의 선분의 길이
	    	l2 = Math.sqrt(Math.pow(l2dx, 2) + Math.pow(l2dy, 2)); // 이동중인 터치의 선분의 길이
			
			dLen = ((l2-l1)*1.2).round(3); // 크기 변화량
			if(!isNaN(dLen)){
				//이동량 만큼 이미지를 크게 하거나 줄이기.
				//trace(args.firstTouch.centerX, args.firstTouch.centerY);
				this.imgResize(args.item, args.firstBoxModel, dLen, args.firstTouch.centerX, args.firstTouch.centerY);
			}
	    }else{
	    	var mx, my, newL, newT;
    		mx = (args.firstTouch.centerX - args.touch.centerX).round();
    		my = (args.firstTouch.centerY - args.touch.centerY).round();
    		
    		if(this._mx == null){
    			this.velocityDX = 0;
				this.velocityDY = 0;
    		}else{
				this.velocityDX = this._mx - mx;
				this.velocityDY = this._my - my;
			}
    		
    		this._mx = mx;
    		this._my = my;
    		
    		if(args.item._boxModel.width == args.item._boxModel.dW){ // zoom 이 되지 않았을 때
    			if(mx.abs() > my.abs()){
					newL = args.firstBoxModel.dL - mx;
					newT = args.firstBoxModel.dT;
    			}else{
					newL = args.firstBoxModel.dL;
					newT = args.firstBoxModel.dT - my;
    			}
    		}else{
				newL = args.firstBoxModel.dL - mx;
				newT = args.firstBoxModel.dT - my;
    		}
			
			if( this.changeImgCss(args.item._axdom, {left:newL, top:newT}) ){
				
			}
	    }
    },
    imgTouchEnd: function(args, event){
    	var cfg = this.config, _this = this;
    	var pos = args.item._axdom.position();
    	
    	args.item._boxModel.dL = pos.left;
    	args.item._boxModel.dT = pos.top;
    	
    	var sL = 0, eL = 0, sT = 0, eT = 0, scW = this.screenSize.width, scH = this.screenSize.height, iW = args.item._axdom.width(), iH = args.item._axdom.height();
    	
    	//trace(pos.left, this.velocityDX);
    	
    	var imgAnmate = false;
    	if(args.moveType == "move"){
    		var css = {left:pos.left + (this.velocityDX||0)*10, top:pos.top + (this.velocityDY||0)*10, opacity:1};
    	}else{
    		var css = {left:pos.left, top:pos.top, opacity:1};
    	}
    	var __left = css.left, __top = css.top;
    	
    	if(iW < scW && iH < scH){
    		iW = css.width = args.item._boxModel.width;
    		iH = css.height  = args.item._boxModel.height;
    	}

    	if(iW < scW){
    		sL = (scW - iW) / 2;
    		eL = sL;
    	}else{
    		sL = 0;
    		eL = scW - iW;
    	}
    	if(iH < scH){
    		sT = (scH - iH) / 2;
    		eT = sT;
    	}else{
    		sT = 0;
    		eT = scH - iH;
    	}

    	if(css.left > sL ){
    		if(args.moveType == "move"){
    			if( (css.left + iW) - scW > scW * 0.35 ){
    				if(this.prev()) return "prev";
    			}
    		}
    		css.left = sL;
    		imgAnmate = true;
    	}else if(css.left < eL ){
    		if(args.moveType == "move"){
    			if( (css.left + iW) < scW * 0.35 ){
    				if(this.next()) return "next";
    			}
    		}
    		css.left = eL;
    		imgAnmate = true;
    	}
    	if(css.top > sT ){
    		if(args.moveType == "move" && args.item._boxModel.width == args.item._boxModel.dW){
    			if( (css.top + iH) - scH > scH * 0.35 ){
    				this.close();
    				return "close";
    			}
    		}
    		css.top = sT;imgAnmate = true;
    	}else if(css.top < eT ){
    		if(args.moveType == "move" && args.item._boxModel.width == args.item._boxModel.dW){
    			if( (css.top + iH) < scH * 0.35 ){
    				this.close();
    				return "close";
    			}
    		}
    		css.top = eT;imgAnmate = true;
    	}
    	if(imgAnmate){
    		args.item._axdom.stop();
    		args.item._axdom.animate(css);
	    	if(!isNaN(css.left)) args.item._boxModel.dL = css.left;
	    	if(!isNaN(css.top)) args.item._boxModel.dT = css.top;
	    	if(args.moveType == "zoom"){
		    	if(!isNaN(css.width)) args.item._boxModel.dW = css.width;
		    	if(!isNaN(css.height)) args.item._boxModel.dH = css.height;
	    	}
    	}
    	
    	this._mx = null;
    	this._my = null;

		if( !this.touchAndMoved ){
			if(this.touchClicked){
				//trace("dbl click");
				this.imgDblClick(args.item, event);
				this.touchDblClicked = true;
			}else{
				this.touchClicked = true;
			}
		}

		this.touhEndObserver = setTimeout(function () {
	    	if( !_this.touchAndMoved && !_this.touchDblClicked && _this.touchClicked){
	    		_this.imgClick(args.item, event);
	    	}
			_this.touchClicked = false; // 0.3후에 이전 터치 상태 해제
			_this.touchDblClicked = false;
			_this.touchAndMoved = false;
		}, 200);
    },
    changeImgCss: function(img, css, animate){
    	if(css.width != undefined && css.width < 100) return;
    	//img.stop();
    	if(animate){
    		img.animate(css);
    	}else{
    		img.css(css);
    	}
    	return css;
    },
    imgClick: function(item, event){
    	//trace("imgClick");
    	var cfg = this.config;
    	this.controller.toggle();
		this.touchClicked = false; // 0.3후에 이전 터치 상태 해제
		this.touchDblClicked = false;
    },
    imgDblClick: function(item, event){
    	//trace("imgDblClick");
    	var cfg = this.config;
    	
    	if(item._boxModel.dW > this.screenSize.width){
    		this.imgResize(item, this.touchUpdater.firstBoxModel, null, this.touchUpdater.firstTouch.centerX, this.touchUpdater.firstTouch.centerY, "animate");
    		//this.renderImage( axdom('#' + cfg.id +'_AX_slide_AX_' + this.selectedIndex), item);
    	}else{
	    	var dLen = this.screenSize.width * 2;
	    	this.imgResize(item, this.touchUpdater.firstBoxModel, dLen, this.touchUpdater.firstTouch.centerX, this.touchUpdater.firstTouch.centerY, "animate");
	    }
		this.touchClicked = false; // 0.3후에 이전 터치 상태 해제
		this.touchDblClicked = false;
    }
});