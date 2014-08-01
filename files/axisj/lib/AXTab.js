/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 
var AXTabClass = Class.create(AXJ, {
    version: "AXTabClass V0.5",
    author: "tom@axisj.com",
    logs: [
		"2013-07-05 오후 1:16:16",
        "2014-04-14 : tom 모바일 반응 너비 지정 방식 변경 & ff 타이밍 버그 픽스 "
    ],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.objects = [];
        this.config.handleWidth = 22;
        this.config.responsiveMobile = AXConfig.mobile.responsiveWidth;
        this.config.bounces = true;
    },
    init: function(){
        axdom(window).bind("resize", this.windowResize.bind(this));
    },
    windowResize: function () {
        var windowResizeApply = this.windowResizeApply.bind(this);
        if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
        this.windowResizeObserver = setTimeout(function () {
            windowResizeApply();
        }, 500);
    },
    windowResizeApply: function(){
        this.resizeCheck();
    },
    bind: function (obj) {
        var cfg = this.config;

        if (!obj.id) {
            trace("bind 대상 ID가 없어 bind 처리할 수 없습니다.");
            return;
        }
        if (!AXgetId(obj.id)) {
            trace("bind 대상이 없어 bind 처리할 수 없습니다.");
            return;
        }

		var objID = obj.id;
		var objSeq = null;
		
		obj.theme = (obj.theme || "AXTabs");
		obj.overflow = (obj.overflow || "visible");
		obj.scrollAmount = (obj.scrollAmount || 5);
		obj.options = (obj.options || [{optionValue:"null", optionText:"빈 탭"}]);
		
        jQuery.each(this.objects, function (idx, O) {
            if (this.id == objID){
            	objSeq = idx;
            	return false;
            }
        });
		if (objSeq == null) {
			objSeq = this.objects.length;
			this.objects.push({ id: objID, config: obj});
		}else{
			this.objects[objSeq].isDel = undefined;
			this.objects[objSeq].config = obj;
		}
		
		if(objSeq != null){
			this.initTab(objID, objSeq);
		}else{
			trace("object find error");	
		}
    },
    initTab: function(objID, objSeq){
    	//trace({objID:objID, objSeq:objSeq});
    	var cfg = this.config, _this = this;
    	var obj = this.objects[objSeq];

		var po = [];
	    var subOptions = [];
		po.push("<div class=\"" + obj.config.theme + "\" id=\"" + objID + "_AX_tabContainer\">");
			po.push("<div class=\"AXTabsTray\" id=\"" + objID + "_AX_tabTray\">");
				if(obj.config.overflow != "visible"){
				po.push("	<div class=\"trayScroll\" id=\"" + objID + "_AX_tabScroll\">");
				}

				var selectedIndex = null;
				jQuery.each(obj.config.options, function(oidx, O){
					po.push("<a href=\"javascript:;\" id=\"" + objID + "_AX_Tabs_AX_"+oidx+"\" class=\"AXTab " + (O.addClass || ""));
					if(O.optionValue == obj.config.value){
						selectedIndex = oidx;
						po.push(" on");
						if(O.options) subOptions = O.options;
					}
					po.push("\">");
					po.push(O.optionText.dec() + "</a>");
					//if(AXUtil.browser.mobile){
						po.push("<span class='AXTabSplit'></span>");
					//}
				});
				obj.config.selectedIndex = selectedIndex;			
				po.push("	<div class=\"clear\"></div>");
			if(obj.config.overflow != "visible"){
			po.push("	</div>");
			po.push("	<div class=\"leftArrowHandleBox\" style=\"display:none;\"><a href=\"javascript:;\" class=\"tabArrow\" id=\"" + objID + "_AX_Arrow_AX_Left\">arrow</a></div>");
			po.push("	<div class=\"rightArrowHandleBox\" style=\"display:none;\"><a href=\"javascript:;\" class=\"tabArrow\" id=\"" + objID + "_AX_Arrow_AX_Right\">arrow</a></div>");
			po.push("	<div class=\"rightArrowMoreBox\" style=\"display:none;\"><a href=\"javascript:;\" class=\"tabArrow\" id=\"" + objID + "_AX_Arrow_AX_More\">arrow</a></div>");
			}
			po.push("</div>");

	        if(subOptions.length > 0){
				// subOptions :

	        }
		po.push("</div>");
		
		obj.jQueryObjID = jQuery("#"+objID);
		obj.jQueryObjID.html(po.join(''));
		obj.jQueryObjID.data("objSeq", objSeq); /* memory objSeq */
		
	    obj.tabTray = jQuery("#" + objID + "_AX_tabTray");
	    obj.tabScroll = jQuery("#" + objID + "_AX_tabScroll");
	    obj.tabContainer = jQuery("#" + objID + "_AX_tabContainer");
    	
    	var setValueTab = this.setValueTab.bind(this);
    	var myMenu = [];
    	jQuery.each(obj.config.options, function(oidx, O){
    		myMenu.push({label:O.optionText, value:O.optionValue, className:"", onclick:function(){
    			//trace(this);
    			setValueTab(objID, this.menu.value);
    		}});
    	});
    	
		AXContextMenu.bind({
			id:objID + "_AX_tabMore", 
			theme:"AXContextMenu", // 선택항목
			width:"200", // 선택항목
			menu:myMenu
		});

    	var bindTabClick = this.bindTabClick.bind(this);
    	obj.tabContainer.find(".AXTab").bind("click", function(event){
    		bindTabClick(objID, objSeq, event);
    	});
    	var bindTabMove = this.bindTabMove.bind(this);
    	var bindTabMoveClick = this.bindTabMoveClick.bind(this);
    	var bindTabMoreClick = this.bindTabMoreClick.bind(this);
    	
    	jQuery("#" + objID + "_AX_Arrow_AX_Left").bind("mouseover", function(event){
    		bindTabMove(objID, objSeq, "left", event);
    	});
    	jQuery("#" + objID + "_AX_Arrow_AX_Right").bind("mouseover", function(event){
    		bindTabMove(objID, objSeq, "right", event);
    	});
    	jQuery("#" + objID + "_AX_Arrow_AX_Left, #" + objID + "_AX_Arrow_AX_Right").bind("mouseout", function(event){
    		if(obj.moveobj) clearTimeout(obj.moveobj);
    	});
    	jQuery("#" + objID + "_AX_Arrow_AX_Left").bind("mousedown", function(event){
    		bindTabMoveClick(objID, objSeq, "left", event);
    	});
    	jQuery("#" + objID + "_AX_Arrow_AX_Right").bind("mousedown", function(event){
    		bindTabMoveClick(objID, objSeq, "right", event);
    	});
    	jQuery("#" + objID + "_AX_Arrow_AX_More").bind("click", function(event){
    		bindTabMoreClick(objID, objSeq, "right", event);
    	});
    	
    	if(obj.overflow != "visible"){
            setTimeout(function(){
                var tabsWidth = (axf.clientWidth() < cfg.responsiveMobile) ? 40 : 30;
                var tabsMargin = (axf.clientWidth() < cfg.responsiveMobile) ? 5 : 5;
                obj.tabContainer.find(".AXTab").each(function(){
                    tabsWidth += (jQuery(this).outerWidth().number() + jQuery(this).css("marginLeft").number() + jQuery(this).css("marginRight").number() + tabsMargin);
                });

                obj.tabScroll.css({width:tabsWidth, left:cfg.handleWidth});
                obj.tabTray.css({height:obj.tabScroll.outerHeight()});

                var trayWidth = obj.tabTray.outerWidth();
                var scrollWidth = obj.tabScroll.outerWidth();

                if(trayWidth > scrollWidth){
                    obj.tabContainer.find(".leftArrowHandleBox").hide();
                    obj.tabContainer.find(".rightArrowHandleBox").hide();
                    obj.tabContainer.find(".rightArrowMoreBox").hide();
                    obj.tabScroll.css({left:0});
                }else if(obj.config.selectedIndex != null){
                    obj.tabContainer.find(".leftArrowHandleBox").show();
                    obj.tabContainer.find(".rightArrowHandleBox").show();
                    obj.tabContainer.find(".rightArrowMoreBox").show();
                    _this.focusingItem(objID, objSeq, obj.config.selectedIndex);
                }

                if(trayWidth < scrollWidth && AXUtil.clientWidth() < cfg.responsiveMobile){
                    obj.tabContainer.find(".leftArrowHandleBox").hide();
                    obj.tabContainer.find(".rightArrowHandleBox").hide();
                    obj.tabScroll.css({left:0});
                }else{

                }

                /* touch event */
                var touchstart = _this.touchstart.bind(_this);
                if(AXUtil.browser.mobile){
                    var touchBodyID = obj.tabTray.get(0).id;
                    _this.touchstartBind = function () { touchstart(objID, objSeq); };
                    if (document.addEventListener) AXgetId(touchBodyID).addEventListener("touchstart", _this.touchstartBind, false);
                }else{
                    _this.touchstartBind = function (event) { touchstart(objID, objSeq, event); };
                    obj.tabTray.unbind("mousedown.AXMobileTouch").bind("mousedown.AXMobileTouch", _this.touchstartBind);
                }
                obj.tabTray.attr("onselectstart", "return false");
                obj.tabTray.addClass("AXUserSelectNone");

                obj.tabTray.unbind("dragstart.AXMobileTouch").bind("dragstart.AXMobileTouch", _this.cancelEvent.bind(_this));
                /* touch event */
            }, 50);
	    }
    },
    bindTabClick: function(objID, objSeq, event){
    	//trace({objID:objID, objSeq:objSeq, e:event.target.id});
    	var cfg = this.config;
    	var obj = this.objects[objSeq];
    	
		// event target search -
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget, evtIDs: eid,
			until: function (evt, evtIDs) { return (jQuery(evt.parentNode).hasClass("AXTabsTray")) ? true : false; },
			find: function (evt, evtIDs) { return (jQuery(evt).hasClass("AXTab")) ? true : false; }
		});
		// event target search ------------------------    	
    	
    	if (myTarget) {
			//colHeadTool ready
			var targetID = myTarget.id;
			var itemIndex = targetID.split(/_AX_/g).last();
			
			//trace(obj.config.options[itemIndex]);
			
			var selectedObject = obj.config.options[itemIndex];
			if(obj.config.value != selectedObject.optionValue){
				
				jQuery("#" + objID + "_AX_Tabs_AX_"+obj.config.selectedIndex).removeClass("on");
				jQuery("#" + objID + "_AX_Tabs_AX_"+itemIndex).addClass("on");
				
				obj.config.value = selectedObject.optionValue;
				obj.config.selectedIndex = itemIndex;
				
				this.focusingItem(objID, objSeq, obj.config.selectedIndex);
				
				if(obj.config.onchange){
					obj.config.onchange.call({
						options:obj.config.options,
						item:obj.config.options[itemIndex],
						index:itemIndex
					}, obj.config.options[itemIndex], obj.config.options[itemIndex].optionValue);
				}
			}
		}	
    },
    setValueTab: function(objID, value){
    	//trace({objID:objID, value:value});
		var cfg = this.config;
		var objSeq = null;
		jQuery.each(this.objects, function(index, O){
			if(O.id == objID){
				objSeq = index;
				return false;
			}
		});
		if(objSeq == null){
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
			return;
		}else{
			
			var obj = this.objects[objSeq];
			
			var itemIndex = null;
			jQuery.each(obj.config.options, function(oidx, O){
				if(O.optionValue == value){
					itemIndex = oidx;
					return false;
				}
			});

			if(itemIndex == null) return;

			var selectedObject = obj.config.options[itemIndex];
			if(obj.config.value != selectedObject.optionValue){
				
				jQuery("#" + objID + "_AX_Tabs_AX_"+obj.config.selectedIndex).removeClass("on");
				jQuery("#" + objID + "_AX_Tabs_AX_"+itemIndex).addClass("on");
				/*  */
				this.focusingItem(objID, objSeq, itemIndex);
				
				obj.config.value = selectedObject.optionValue;
				obj.config.selectedIndex = itemIndex;
				
				if(obj.config.onchange){
					obj.config.onchange.call({
						options:obj.config.options,
						item:obj.config.options[itemIndex],
						index:itemIndex
					}, obj.config.options[itemIndex], obj.config.options[itemIndex].optionValue);
				}	
			}
			
		}
    },
    bindTabMove: function(objID, objSeq, direction, event){
    	//trace({objID:objID, objSeq:objSeq});
    	var cfg = this.config;
    	var obj = this.objects[objSeq];

		var trayWidth = obj.tabTray.outerWidth();
    	if(AXUtil.clientWidth() < cfg.responsiveMobile){
    		var rightMargin = 40;
    	}else{
    		var rightMargin = 29 + cfg.handleWidth;
    	}
    	trayWidth -= rightMargin;
		var scrollWidth = obj.tabScroll.outerWidth();
		var scrollLeft = obj.tabScroll.position().left;
		
		//trace({trayWidth:trayWidth, scrollWidth:scrollWidth, scrollLeft:scrollLeft});
		
		var animateStyles = {};
		if(direction == "left"){
			if(scrollLeft < cfg.handleWidth){
				scrollLeft += obj.config.scrollAmount;
				animateStyles = {left:scrollLeft};
			}else{
				return;
			}
			if(scrollLeft > cfg.handleWidth){
				//trace({trayWidth:(trayWidth - cfg.handleWidth), scrollWidth:scrollWidth, scrollLeft:scrollLeft});
				scrollLeft = cfg.handleWidth;
				animateStyles = {left:scrollLeft};
			}
		}else{
			if(trayWidth < (scrollWidth + scrollLeft)){
				scrollLeft -= obj.config.scrollAmount;
				animateStyles = {left:scrollLeft};
			}else{

			}

			if((trayWidth) > (scrollWidth + scrollLeft)){
				/*trace({trayWidth:(trayWidth - cfg.handleWidth), scrollWidth:scrollWidth, scrollLeft:scrollLeft}); */
				scrollLeft = trayWidth - scrollWidth - cfg.handleWidth;
				animateStyles = {left:scrollLeft};
			}else{
				//return;
			}			

		}
		
		obj.tabScroll.css(animateStyles);
		
		var bindTabMove = this.bindTabMove.bind(this);
		
		if(obj.moveobj) clearTimeout(obj.moveobj);
		
		//trace("move");
		
		obj.moveobj = setTimeout(function(){
			bindTabMove(objID, objSeq, direction, event);
		}, 20);
		
		
		/*
		obj.tabScroll.animate(
			animateStyles,
			500,
			"sineInOut",
			function(){
			}
		);
		*/
		
    },
	bindTabMoveClick: function(objID, objSeq, direction, event){
    	var cfg = this.config;
    	var obj = this.objects[objSeq];
    	
    	if(obj.moveobj) clearTimeout(obj.moveobj);
    	
		var scrollAmount = 500;
		
		var trayWidth = obj.tabTray.outerWidth();
    	if(AXUtil.clientWidth() < cfg.responsiveMobile){
    		var rightMargin = 40;
    	}else{
    		var rightMargin = 29 + cfg.handleWidth;
    	}
    	trayWidth -= rightMargin;
		var scrollWidth = obj.tabScroll.outerWidth();
		var scrollLeft = obj.tabScroll.position().left;
		
		//trace({trayWidth:trayWidth, scrollWidth:scrollWidth, scrollLeft:scrollLeft});
		
		var animateStyles = {};
		if(direction == "left"){
			if(scrollLeft < cfg.handleWidth){
				scrollLeft += scrollAmount;
				animateStyles = {left:scrollLeft};
			}else{
				return;
			}
			if(scrollLeft > cfg.handleWidth){
				scrollLeft = cfg.handleWidth;
				animateStyles = {left:scrollLeft};
			} 
		}else{
			if(trayWidth < (scrollWidth + scrollLeft)){
				scrollLeft -= scrollAmount;
				animateStyles = {left:scrollLeft};
			}else{

			}

			if((trayWidth-cfg.handleWidth) > (scrollWidth + scrollLeft)){
				//trace({trayWidth:(trayWidth - cfg.handleWidth), scrollWidth:scrollWidth, scrollLeft:scrollLeft});
				scrollLeft = trayWidth - scrollWidth - cfg.handleWidth;
				animateStyles = {left:scrollLeft};
			}else{
				//return;
			}	

		}

		obj.tabScroll.stop();
		obj.tabScroll.animate(
			animateStyles,
			500,
			"sineInOut",
			function(){
			}
		);
		
		if (event.preventDefault) event.preventDefault();
		if (event.stopPropagation) event.stopPropagation();
		event.cancelBubble = true;
		return false;
    },
    bindTabMoreClick: function(objID, objSeq, direction, event){
    	var cfg = this.config;
    	var obj = this.objects[objSeq];
        if(axf.clientWidth() < cfg.responsiveMobile) {
            AXContextMenu.setConfig({responsiveMobile: 640});
            /* mobile 너비 지정 */
        }
    	AXContextMenu.open({id:objID + "_AX_tabMore", title:AXConfig.AXContextMenu.title}, event);
    },
    resizeCheck: function(){
    	var cfg = this.config;
    	var focusingItem = this.focusingItem.bind(this);
    	
    	jQuery.each(this.objects, function(objSeq, O){
    		var objID = this.id;
    		var obj = this;
			var trayWidth = obj.tabTray.outerWidth();
			var scrollWidth = obj.tabScroll.outerWidth();
			if(trayWidth > scrollWidth){
				obj.tabContainer.find(".leftArrowHandleBox").hide();
				obj.tabContainer.find(".rightArrowHandleBox").hide();
				obj.tabContainer.find(".rightArrowMoreBox").hide();
				obj.tabScroll.css({left:0});
			}else{
				if(AXUtil.clientWidth() < cfg.responsiveMobile){
					obj.tabContainer.find(".leftArrowHandleBox").hide();
					obj.tabContainer.find(".rightArrowHandleBox").hide();
				}else{
					obj.tabContainer.find(".leftArrowHandleBox").show();
					obj.tabContainer.find(".rightArrowHandleBox").show();					
				}
				obj.tabContainer.find(".rightArrowMoreBox").show();
				if(!AXUtil.isEmpty(obj.config.selectedIndex)) focusingItem(objID, objSeq, obj.config.selectedIndex);
			}
			obj.tabTray.css({height:obj.tabScroll.outerHeight()});
    	});
    },
    focusingItem: function(objID, objSeq, optionIndex){
    	var cfg = this.config;
    	var obj = this.objects[objSeq];
    	
    	if(obj.tabTray.outerWidth() > obj.tabScroll.outerWidth()){
    		return;
    	}
    	
    	if(AXUtil.clientWidth() < cfg.responsiveMobile){
    		var scrollLeft = (jQuery("#" + objID + "_AX_Tabs_AX_" + optionIndex).position().left);
    		var itemWidth = (jQuery("#" + objID + "_AX_Tabs_AX_" + optionIndex).outerWidth());
    		var handleWidth = 0;
    		var rightMargin = 40;
    	}else{
    		var scrollLeft = (jQuery("#" + objID + "_AX_Tabs_AX_" + optionIndex).position().left - cfg.handleWidth);
    		var itemWidth = (jQuery("#" + objID + "_AX_Tabs_AX_" + optionIndex).outerWidth());
    		var handleWidth = cfg.handleWidth;
    		var rightMargin = 29 + cfg.handleWidth;
    	}
		
		/*trace({scrollLeft:scrollLeft, tsLeft:obj.tabScroll.position().left.abs(), trayWidth:obj.tabTray.outerWidth(), itemWidth:itemWidth, tt:(obj.tabScroll.position().left.abs() + obj.tabTray.outerWidth() - rightMargin - handleWidth	)});*/
		if(scrollLeft > (obj.tabScroll.position().left).abs() && (scrollLeft + itemWidth) <= (obj.tabScroll.position().left.abs() + obj.tabTray.outerWidth() - rightMargin - handleWidth)){
			//trace(11);
		}else{
			//trace(obj.tabTray.outerWidth(), handleWidth, obj.tabScroll.outerWidth(), scrollLeft);
			if(obj.tabTray.outerWidth() - handleWidth > (obj.tabScroll.outerWidth() - scrollLeft)){
				//trace(scrollLeft);
				scrollLeft = (obj.tabScroll.outerWidth() - obj.tabTray.outerWidth()) + rightMargin;
			}
			//trace({left:-scrollLeft});
			setTimeout(function(){
				obj.tabScroll.css({left:-scrollLeft});	
			}, 10);
		}
    },
    
    /* 터치 이동관련 함수 - s */
	touchstart: function (objID, objSeq, e) {
		if (this.touhEndObserver) clearTimeout(this.touhEndObserver);
		if (this.touhMoveObserver) clearTimeout(this.touhMoveObserver);
		
		var cfg = this.config;
		var obj = this.objects[objSeq];
		
		var trayWidth = obj.tabTray.outerWidth();
		var scrollWidth = obj.tabScroll.outerWidth();

		if(trayWidth > scrollWidth){
			return;	
		}
		
		var touch;
		var event = window.event;
		if (AXUtil.browser.mobile){
			touch = event.touches[0];
			if (!touch.pageX) return;
		}else{
			var event = e;
			touch = {
				pageX : e.pageX, 
				pageY : e.pageY
			};
		}
		
		this.touchStartXY = {
			sTime: ((new Date()).getTime() / 1000),
			sLeft:  obj.tabScroll.position().left,
			x: touch.pageX,
			y: touch.pageY
		};

		var touchEnd = this.touchEnd.bind(this);
		var touchMove = this.touchMove.bind(this);

		if(AXUtil.browser.mobile){
			var event = window.event;
			this.touchEndBind = function () {
				touchEnd(objID, objSeq);
			};	
			this.touchMoveBind = function () {
				touchMove(objID, objSeq);
			};
			if (document.addEventListener) {
				document.addEventListener("touchend", this.touchEndBind, false);
				document.addEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			
			this.touchEndBind = function (event) {
				touchEnd(objID, objSeq, event);
			};	
			this.touchMoveBind = function (event) {
				touchMove(objID, objSeq, event);
			};
			
			jQuery(document.body).bind("mouseup.AXMobileTouch", this.touchEndBind);
			jQuery(document.body).bind("mousemove.AXMobileTouch", this.touchMoveBind);
		}
		
		var minLeft = 0;
		var maxLeft = - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
		var scrollPosition = obj.tabScroll.position();
		
		if(scrollPosition.left < minLeft && scrollPosition.left > maxLeft){
			obj.tabScroll.stop();
		}
	},
	touchMove: function (objID, objSeq, e) {
		if (this.touhEndObserver) clearTimeout(this.touhEndObserver);
		if (this.touhMoveObserver) clearTimeout(this.touhMoveObserver);
		
		var cfg = this.config;
		var obj = this.objects[objSeq];
		
		var touch;
		var event = window.event;
		if (AXUtil.browser.mobile){
			touch = event.touches[0];
			if (!touch.pageX) return;
		}else{
			var event = e;
			touch = {
				pageX : e.pageX, 
				pageY : e.pageY
			};
		}
		
		if ((this.touchStartXY.x - touch.pageX).abs() < (this.touchStartXY.y - touch.pageY).abs()) {
			//this.touchMode = ((this.touchStartXY.y - touch.pageY) <= 0) ? "up" : "dn"; /* 위아래 이동 */
		} else if ((this.touchStartXY.x - touch.pageX).abs() > (this.touchStartXY.y - touch.pageY).abs()) {
			//this.touchMode = ((this.touchStartXY.x - touch.pageX) <= 0) ? "lt" : "rt"; /* 좌우 이동 */
			this.moveBlock(objID, objSeq, touch.pageX - this.touchStartXY.x);
			if (event.preventDefault) event.preventDefault();
			else return false;
		}
		if (((this.touchStartXY.x - touch.pageX).abs() - (this.touchStartXY.y - touch.pageY).abs()).abs() < 5) {
			//this.touchSelecting = true;
		}
		
		var touchMoveAfter = this.touchMoveAfter.bind(this);
		this.touhMoveObserver = setTimeout(function () {
			touchMoveAfter(touch, objID, objSeq);
		}, 50);
	},
	touchMoveAfter: function(touch, objID, objSeq){
		var cfg = this.config;
		var obj = this.objects[objSeq];
		try{
			this.touchStartXY.sTime = ((new Date()).getTime() / 1000);
			this.touchStartXY.sLeft = obj.tabScroll.position().left;
			this.touchStartXY.x = touch.pageX;
			this.touchStartXY.y = touch.pageY;
		}catch(e){
			//trace(e);
		}
	},
	touchEnd: function (objID, objSeq, e) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var event = window.event || e;
		
		if(AXUtil.browser.mobile){
			if (document.removeEventListener) {
				document.removeEventListener("touchend", this.touchEndBind, false);
				document.removeEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			jQuery(document.body).unbind("mouseup.AXMobileTouch");
			jQuery(document.body).unbind("mousemove.AXMobileTouch");
		}
		
		var moveEndBlock = this.moveEndBlock.bind(this);
		this.touhEndObserver = setTimeout(function () {
			moveEndBlock(objID, objSeq);
		}, 10);
	},
	/* 터치 이동관련 함수 - e */
	
	moveBlock: function(objID, objSeq, moveX){
		var cfg = this.config;
		var obj = this.objects[objSeq];
		
		var newLeft = (this.touchStartXY.sLeft + (moveX));
		/*
			obj.tabTray
			obj.tabScroll
		*/
		//trace(newLeft);
	
		var newLeft = (this.touchStartXY.sLeft + (moveX));
		var minLeft = 0;
		var maxLeft = - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
		if(cfg.bounces){
			minLeft = this.touchStartXY.targetWidth * 0.4;
			maxLeft = -((this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth) * 1.2);
		}
		
		if(newLeft > minLeft){
			newLeft = minLeft;
		}else if(newLeft < maxLeft){
			newLeft = maxLeft;
		}
		obj.tabScroll.css({left: newLeft});
	},
	moveEndBlock: function(objID, objSeq){
		var cfg = this.config;
		var obj = this.objects[objSeq];
		
		/* 관성발동여부 체크 */
		if(!this.touchStartXY) return;
		var sTime = this.touchStartXY.sTime;
		var eTime = ((new Date()).getTime() / 1000);
		var dTime = eTime - sTime;
		var eLeft = obj.tabScroll.position().left;
		var dLeft = eLeft - this.touchStartXY.sLeft;
		
		var velocity = Math.ceil((dLeft/dTime)/5); // 속력= 거리/시간
		var endLeft = Math.ceil(eLeft + velocity); //스크롤할때 목적지
		/*trace({eLeft: eLeft, velocity:velocity, endLeft:endLeft});*/
		if(endLeft > 0) endLeft = 0;
		var newLeft = endLeft.abs();
   		if(AXUtil.clientWidth() < cfg.responsiveMobile){
    		var handleWidth = 0;
    		var rightMargin = 40;
    	}else{
    		var handleWidth = cfg.handleWidth;
    		var rightMargin = 29 + cfg.handleWidth;
    	}
		if(obj.tabTray.outerWidth() - handleWidth > (obj.tabScroll.outerWidth() - newLeft)){
			newLeft = (obj.tabScroll.outerWidth() - obj.tabTray.outerWidth()) + rightMargin;
		}
		
		//trace(absPage);
		this.touchStartXY.sLeft = -newLeft;
		obj.tabScroll.animate({left: -newLeft}, (obj.tabScroll.position().left + newLeft).abs(), "cubicOut", function () {});		
		//trace({left: -newLeft});
		
		this.touchStartXY = null;
	},	
	cancelEvent: function (event) {
		event.stopPropagation(); // disable  event
		return false;
	}
});

var AXTab = new AXTabClass();
AXTab.setConfig({});

jQuery.fn.unbindTab = function (config) {
    jQuery.each(this, function () {
        if (config == undefined) config = {};
        config.id = this.id;
        AXTab.unbind(config);
        return this;
    });
};

jQuery.fn.bindTab = function (config) {
    jQuery.each(this, function () {
        if (config == undefined) config = {};
        config.id = this.id;
        AXTab.bind(config);
        return this;
    });
};

jQuery.fn.setValueTab = function (value) {
    jQuery.each(this, function () {
        AXTab.setValueTab(this.id, value);
        return this;
    });
};