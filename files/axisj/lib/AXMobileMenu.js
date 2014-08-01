/**
 * AXMobileMenu
 * @class AXMobileMenu
 * @extends AXJ
 * @version v0.6
 * @author tom@axisj.com
 * @logs
 "2013-12-13 오전 10:53:43",
 "2014-02-26 오전 11:42:23 tom : 각종 버그 픽스",
 "2014-02-26 오후 4:35:05 tom : hasSubMenu 분리",
 "2014-07-10 tom : 메뉴 태그로 구성 기능 추가"
 "2014-07-11 tom : add 'method setHighLightOriginID'  "
 * @example
 ```js
 var myMenu = new AXMobileMenu();
 myMenu.setConfig(classConfig:JSObject);
 ```
 *
 */
var AXMobileMenu = Class.create(AXJ, {
    initialize: function(AXJ_super) {
		AXJ_super();
		
		this.moveSens = 0;
		this.config.moveSens = 1;
		this.touchMode;
		this.selectedPoi = null;
		this.config.width = 300;
		this.config.height = 388;
		this.config.reserveKeys = {
			labelKey:"label",
			urlKey:"url",
			targetKey:"target",
			addClassKey:"addClass",
			subMenuKey:"cn"
		};
    },
    init: function() {
		var cfg = this.config;
		
		/* 이벤트 대소문자 확장 */
		if(!cfg.onclick) cfg.onclick = cfg.onClick;


	    if(cfg.menuBoxID){
		    // 메뉴데이터 태그로 부터 가져오기
		    cfg.menu = this.collectMenuItem(cfg.menuBoxID);
	    }

		//var close = this.close.bind(this);
		this.modal = new AXMobileModal();
		this.modal.setConfig({
			addClass:"AXMobileMenu",
			height: cfg.height,
			width: cfg.width,
			head:{
				close:{
					onclick:function(){
						
					}
				}
			},
			onclose: function(){
				//close();
			}
		});
		
    },
    open: function(){
    	var cfg = this.config;
    	/*
    	var obj = this.modal.open();
    	this.initMenu(obj);
    	*/
    	var onLoad = this.initMenu.bind(this);
    	this.modal.open(null, onLoad);
    },
    initMenu: function(obj){
    	var cfg = this.config;
    	this.modalObj = obj;
    	this.modalID = obj.jQueryModal.get(0).id;
    	
    	if(this.selectedPoi){
    		var lpoi = this.selectedPoi.last();
    		var apoi = this.selectedPoi.concat();
    		apoi.pop();
    		var menu = cfg.menu;
			axf.each(apoi, function(idx, P){
				if(idx == 0){
					menu = menu[P];
				}else{
					menu = menu[cfg.reserveKeys.subMenuKey][P];
				}
			});
			
			if(menu[cfg.reserveKeys.subMenuKey] && menu[cfg.reserveKeys.subMenuKey][lpoi][cfg.reserveKeys.subMenuKey] && menu[cfg.reserveKeys.subMenuKey][lpoi][cfg.reserveKeys.subMenuKey].length > 0){
				apoi.push(lpoi);
				var tpl = this.getMenu(this.modalID, menu[cfg.reserveKeys.subMenuKey][lpoi], apoi);
			}else{
				var tpl = this.getMenu(this.modalID, menu, apoi);
			}			
    	}else{
    		var tpl = this.getMenu(this.modalID, cfg.menu);
    	}
    	
		if(AXUtil.browser.mobile){
			//obj.modalBody.unbind("touchstart.AXMobileMenu").bind("touchstart.AXMobileMenu", this.touchstart.bind(this));
			var modalBodyID = obj.modalBody.get(0).id;
			var touchstart = this.touchstart.bind(this);
			this.touchstartBind = function () {
				touchstart();
			};
			if (document.addEventListener) {
				AXgetId(modalBodyID).addEventListener("touchstart", this.touchstartBind, false);
			}
		}else{
			obj.modalBody.unbind("mousedown.AXMobileMenu").bind("mousedown.AXMobileMenu", this.touchstart.bind(this));
		}

		obj.modalBody.attr("onselectstart", "return false");
		obj.modalBody.addClass("AXUserSelectNone");
		obj.modalBody.bind("click.AXMobileMenu", this.onclickModalBody.bind(this));
		
    	/* drag cancle */
    	//obj.modalBody.unbind("dragstart.AXMobileMenu").bind("dragstart.AXMobileMenu", this.cancelEvent.bind(this));
    	this.printMenu(tpl);
    },
    printMenu: function(tpl){
    	var obj = this.modalObj;
    	
    	obj.modalHead.empty();
    	obj.modalHead.append(tpl.headPo);
    	obj.modalBody.empty();
    	obj.modalBody.append(tpl.bodyPo);
    	obj.modalFoot.empty();
    	obj.modalFoot.append(tpl.pagePo);
    	
    	/*
    	obj.modalBody.hide();
    	obj.modalBody.fadeIn("300");
    	*/
    	obj.modalHead.find(".mobileMenuHome").bind("click", this.onclickHome.bind(this));
    	obj.modalHead.find(".mobileMenuPrev").bind("click", this.onclickPrev.bind(this));
    	
		this.menuPageWidth = obj.modalBody.find(".mobileMenuBodyPage").width() + 9;
    	this.mobileMenuBodyScroll = obj.modalBody.find(".mobileMenuBodyScroll");
    	obj.modalBody.find(".mobileMenuBodyScroll").css({width:tpl.pageNum * this.menuPageWidth});
    },
    getMenu: function(modalID, _menu, poi){
    	var cfg = this.config;
    	var countPerBlock = 9;
    	var menu = _menu;
    	var menuTitle = "";
    	if(poi == undefined || poi.length == 0) poi = [];
    	else{
    		menuTitle = menu[cfg.reserveKeys.labelKey];
    		menu = menu[cfg.reserveKeys.subMenuKey];
    	}

    	var headPo = [];
    	/* 현재 선택된 메뉴 선택 하는 기능구현 필요 */
    	headPo.push('<a ' + cfg.href + ' class="mobileMenuHome">home</a>');
    	if(menuTitle != ""){
    		headPo.push('<a ' + cfg.href + ' class="mobileMenuPrev" id="', modalID ,'_AX_menuTitle_AX_', poi.join("_"),'">', menuTitle,'</a>');
    	}
		
    	var bodyPo = [];
    	bodyPo.push('<div class="mobileMenuBody">');
    	bodyPo.push('	<div class="mobileMenuBodyScroll" id="', modalID ,'_AX_bodyScroll">');
    	bodyPo.push('		<div class="mobileMenuBodyPage">');
    	
    	var ppoi = poi.join("_");
    	if(ppoi != "") ppoi += "_";
    	
    	var selectedPoi = "";
    	if(this.selectedPoi){
    		selectedPoi = this.selectedPoi.join("_");
    	}
    	
    	axf.each(menu, function(midx, M){
    		if(midx % countPerBlock == 0 && midx > 0){
    			bodyPo.push('	</div>');
    			bodyPo.push('	<div class="mobileMenuBodyPage">');
    		}
    		var addClass = [];
    		if(this[cfg.reserveKeys.addClassKey]){
    			addClass.push(this[cfg.reserveKeys.addClassKey]);
    		}
    		if(selectedPoi == (ppoi + midx)){
    			addClass.push("selected");
    		}
    		bodyPo.push('<a ' + cfg.href + ' class="mobileMenuItem ' + addClass.join(" ") + '" id="', modalID,'_AX_', ppoi, midx,'">');
    		bodyPo.push(this[cfg.reserveKeys.labelKey]);
    		if(this[cfg.reserveKeys.subMenuKey] && this[cfg.reserveKeys.subMenuKey].length > 0){
    			bodyPo.push('<span class="hasSubMenu"></span>');
    		}
    		bodyPo.push('</a>');
    	});
    	bodyPo.push('		</div>');
    	bodyPo.push('	</div>');
    	bodyPo.push('</div>');

		var pageNum = (menu.length / (countPerBlock)).ceil();
		this.pageNo = 0;
		this.pageNum = pageNum;

    	var pagePo = [];
    	pagePo.push('<div class="mobileMenuFoot">');
    	axf.each(pageNum.rangeFrom(1), function(pidx, p){
    		if(pidx == 0) pagePo.push('<div class="pageNav on" ');
    		else pagePo.push('<div class="pageNav" ');
    		pagePo.push(' id="', modalID ,'_AX_pageNav_AX_', pidx ,'"></div>');
    	});
    	pagePo.push('</div>');

    	return {
    		headPo : headPo.join(''),
    		bodyPo : bodyPo.join(''),
    		pagePo : pagePo.join(''),
    		pageNum : ( pageNum )
    	};
    },    
    close: function(){
    	var cfg = this.config;
    	this.modal.close();
    },
    setHighLight: function(menuID){
    	var cfg = this.config;
		
		var menu = cfg.menu;
		var pois = "";
		
		var treeFn = function(subTree, parentPoi){
			axf.each(subTree, function(idx, M){
				if(M[cfg.reserveKeys.primaryKey] == menuID){
					pois = parentPoi + "_" + idx;
					return false;
				}else{
					if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], parentPoi + "_" + idx);
				}
			});
		};
		
		axf.each(menu, function(idx, M){
			if(M[cfg.reserveKeys.primaryKey] == menuID){
				pois = idx + "";
				return false;
			}else{
				if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], idx);
			}
		});

		var poi;
		if(pois != "") poi = pois.split(/_/g);
		this.selectedPoi = poi;
    },
    setHighLightMenu: function(menuID){
    	this.setHighLight(menuID);
    },
	setHighLightOriginID: function(menuID){
		var cfg = this.config;

		var menu = cfg.menu;
		var pois = "";

		var treeFn = function(subTree, parentPoi){
			axf.each(subTree, function(idx, M){
				if(M._id == menuID){
					pois = parentPoi + "_" + idx;
					return false;
				}else{
					if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], parentPoi + "_" + idx);
				}
			});
		};

		axf.each(menu, function(idx, M){
			if(M._id == menuID){
				pois = idx + "";
				return false;
			}else{
				if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], idx);
			}
		});

		var poi;

		//trace(pois);

		if(pois != "") poi = pois.split(/_/g);
		this.selectedPoi = poi;
	},
    onclickModalBody: function(event){
    	var cfg = this.config;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt : eventTarget, evtIDs : eid,
			until:function(evt, evtIDs){ return (axdom(evt.parentNode).hasClass("mobileMenuBodyScroll")) ? true:false; },
			find:function(evt, evtIDs){ return (axdom(evt).hasClass("mobileMenuItem")) ? true : false; }
		});
		
		if(myTarget){
			//something
			//trace(myTarget.id);
			var poi = myTarget.id.split(/_AX_/g).last();
			var menu = cfg.menu;
			var apoi = poi.split(/_/g);
			axf.each(apoi, function(idx, P){
				if(idx == 0){
					menu = menu[P];
				}else{
					menu = menu[cfg.reserveKeys.subMenuKey][P];
				}
			});
			
			if(menu[cfg.reserveKeys.subMenuKey] && menu[cfg.reserveKeys.subMenuKey].length > 0){
				/* animated menu */
				var menuItem = this.modalObj.modalBody.find("#"+myTarget.id);
				menuItem.css({opacity:0});
				var menuItemPos = menuItem.position();

				var mobileMenuBody = this.modalObj.modalBody.find(".mobileMenuBodyScroll");
				var bodyPos = mobileMenuBody.position();
				var cloneMenuItem = axdom("<div class='mobileMenuItemGhost' id='"+this.modalID+"_AX_cloneMenuItem'>" + menuItem.html() + "</div>");
				mobileMenuBody.append(cloneMenuItem);
				cloneMenuItem.css({
					position:"absolute",
					left:menuItemPos.left,
					top:menuItemPos.top
				});

				var getMenuBind = this.getMenu.bind(this);
				var printMenuBind = this.printMenu.bind(this);
				var modalID = this.modalID;
				cloneMenuItem.animate({left:9 - bodyPos.left, top:0, width:270, height:270}, 300, "backInOut").animate({opacity:0}, 100, "expoOut", function () {
					var tpl = getMenuBind(modalID, menu, apoi);
					printMenuBind(tpl);
				});
				
				return;
			}else{
				if(cfg.onclick){
					cfg.onclick.call(menu, menu);
				}
			}
		}
    },
    onclickHome: function(event){
    	var cfg = this.config;
    	var tpl = this.getMenu(this.modalID, cfg.menu);
    	this.printMenu(tpl);
    },
    onclickPrev: function(event){
    	var cfg = this.config;
    	var poi = event.target.id.split(/_AX_/g).last();
		var menu = cfg.menu;
		var apoi = poi.split(/_/g);
		apoi.pop();
		
		axf.each(apoi, function(idx, P){
			if(idx == 0){
				menu = menu[P];
			}else{
				menu = menu[cfg.reserveKeys.subMenuKey][P];
			}
		});
    	
    	var tpl = this.getMenu(this.modalID, menu, apoi);
    	this.printMenu(tpl);
    },
    setTree: function(tree){
    	this.config.menu = tree;
    },
	collectMenuItem: function(targetID){
		var cfg = this.config;
		var menuBox = axdom("#"+targetID)
		var tree = [];

		//{menuID:"1", label:"menu 1", ac:"Dashboard", url:"http://www.axisj.com"}
		var initChilds = function(EL, cid, _tree){
			var childDiv = jQuery(EL).children("."+cfg.childsMenu.className).get(0);
			if(childDiv) {
				var childDivID = cid.replace("PMA", "PMC");
				if(!childDiv.id) childDiv.id = childDivID;
				else childDivID = childDiv.id;

				jQuery("#"+childDivID+">ul>li").each(function(ci, EL) {
					var citem = {}, c_domEL = axdom(EL);
					if(c_domEL.children("A").attr("data-axmenuid")){
						citem._id = c_domEL.children("A").attr("data-axmenuid");
					}else if(c_domEL.children("A").get(0).id) {
						citem._id = c_domEL.children("A").get(0).id;
					}else {
						c_domEL.children("A").get(0).id = (citem._id = cid + "_" + ci);
					}

					citem[cfg.reserveKeys.primaryKey] = cid + "_" + ci;
					citem[cfg.reserveKeys.labelKey] = c_domEL.children("A").text();
					citem[cfg.reserveKeys.urlKey] = c_domEL.children("A").attr("href");
					citem[cfg.reserveKeys.targetKey] = c_domEL.children("A").attr("target") || "_self";
					citem[cfg.reserveKeys.addClassKey] = c_domEL.children("A").attr("class") || "";
					citem[cfg.reserveKeys.subMenuKey] = [];
					_tree[cfg.reserveKeys.subMenuKey].push(citem);

					//trace(pi,  ci);
					initChilds(EL, citem[cfg.reserveKeys.primaryKey], _tree[cfg.reserveKeys.subMenuKey][ci]);
				});
			}
		};

		menuBox.find("." + cfg.parentMenu.className).each(function(pi, EL){
			if(!EL.id) EL.id = cfg.menuBoxID + "_PM_" + pi;
			var item = {}, domEL = axdom(EL), nid = "";
			if(domEL.children("A").attr("data-axmenuid")){
				item._id = domEL.children("A").attr("data-axmenuid");
			}else if(domEL.children("A").get(0).id) {
				item._id = domEL.children("A").get(0).id;
			}else {
				domEL.children("A").get(0).id = (item._id = cfg.menuBoxID + "_PMA_" + pi);
			}

			if(domEL.children("A").get(0).id) {
				nid = domEL.children("A").get(0).id;
			}else {
				nid = cfg.menuBoxID + "_PMA_" + pi;
			}

			item._child_id = nid.replace("PMA", "PMC");
			item[cfg.reserveKeys.primaryKey] = targetID + "_PM_" + pi;
			item[cfg.reserveKeys.labelKey] = domEL.children("A").text();
			item[cfg.reserveKeys.urlKey] = domEL.children("A").attr("href");
			item[cfg.reserveKeys.targetKey] = domEL.children("A").attr("target") || "_self";
			item[cfg.reserveKeys.addClassKey] = domEL.children("A").attr("class") || "";
			item[cfg.reserveKeys.subMenuKey] = [];
			tree.push(item);

			var child = domEL.children("."+cfg.childMenu.className).get(0);
			if(child){
				if(!child.id) child.id = item._child_id;
				jQuery("#"+item._child_id+">ul>li").each(function(ci, EL) {
					var citem = {}, c_domEL = axdom(EL);

					if(c_domEL.children("A").attr("data-axmenuid")){
						citem._id = c_domEL.children("A").attr("data-axmenuid");
					}else if(c_domEL.children("A").get(0).id) {
						citem._id = c_domEL.children("A").get(0).id;
					}else {
						c_domEL.children("A").get(0).id = (citem._id = item._child_id.replace("PMC", "PMA") + "_" + ci);
					}

					citem[cfg.reserveKeys.primaryKey] = item._child_id.replace("PMC", "PMA") + "_" + ci;
					citem[cfg.reserveKeys.labelKey] = c_domEL.children("A").text();
					citem[cfg.reserveKeys.urlKey] = c_domEL.children("A").attr("href");
					citem[cfg.reserveKeys.targetKey] = c_domEL.children("A").attr("target") || "_self";
					citem[cfg.reserveKeys.addClassKey] = c_domEL.children("A").attr("class") || "";
					citem[cfg.reserveKeys.subMenuKey] = [];
					tree[pi][cfg.reserveKeys.subMenuKey].push(citem);

					//trace(pi,  ci);
					initChilds(EL, citem[cfg.reserveKeys.primaryKey], tree[pi][cfg.reserveKeys.subMenuKey][ci]);
				});
			}else{

			}
		});

		return tree;
	},
    /* 메뉴 터치 이동관련 함수 - s */
	touchstart: function (e) {
		var cfg = this.config;

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
			sLeft:  this.mobileMenuBodyScroll.position().left,
			x: touch.pageX,
			y: touch.pageY
		};

		if(AXUtil.browser.mobile){
			var event = window.event;
			var touchEnd = this.touchEnd.bind(this);
			this.touchEndBind = function () {
				touchEnd(event);
			};	
			var touchMove = this.touchMove.bind(this);
			this.touchMoveBind = function () {
				touchMove(event);
			};
			if (document.addEventListener) {
				document.addEventListener("touchend", this.touchEndBind, false);
				document.addEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			axdom(document.body).bind("mouseup.AXMobileMenu", this.touchEnd.bind(this));
			axdom(document.body).bind("mousemove.AXMobileMenu", this.touchMove.bind(this));
		}
		
		this.mobileMenuBodyScroll.stop();
	},
	touchMove: function (e) {
		if (this.touhEndObserver) clearTimeout(this.touhEndObserver); //닫기 명령 제거
		var cfg = this.config;
		
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
			
			this.moveBlock(touch.pageX - this.touchStartXY.x);
			if (event.preventDefault) event.preventDefault();
			else return false;
			
		}
		if (((this.touchStartXY.x - touch.pageX).abs() - (this.touchStartXY.y - touch.pageY).abs()).abs() < 5) {
			//this.touchSelecting = true;
		}
	},
	touchEnd: function (e) {
		var cfg = this.config;
		var event = window.event || e;
		//this.moveSens = 0;
		//this.touchMode = false;
		
		if(AXUtil.browser.mobile){
			if (document.removeEventListener) {
				document.removeEventListener("touchend", this.touchEndBind, false);
				document.removeEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			axdom(document.body).unbind("mouseup.AXMobileMenu");
			axdom(document.body).unbind("mousemove.AXMobileMenu");
		}
		
		var moveEndBlock = this.moveEndBlock.bind(this);
		this.touhEndObserver = setTimeout(function () {
			moveEndBlock();
		}, 10);
	},
	moveBlock: function(moveX){
		//trace(this.mobileMenuBodyScroll.width());
		var cfg = this.config;
		var newLeft = (this.touchStartXY.sLeft + (moveX * 1));
		if(newLeft > this.menuPageWidth*0.5){
			newLeft = this.menuPageWidth*0.5;
		}else if(newLeft < ( - this.mobileMenuBodyScroll.width()) * 1.5){
			newLeft = ( - this.mobileMenuBodyScroll.width()) * 1.5;
		}
		this.mobileMenuBodyScroll.css({left: newLeft});
	},
	moveEndBlock: function(){
		/* 관성발동여부 체크 */
		if(!this.touchStartXY) return;
		var sTime = this.touchStartXY.sTime;
		var eTime = ((new Date()).getTime() / 1000);
		var dTime = eTime - sTime;
		var eLeft = this.mobileMenuBodyScroll.position().left;
		var dLeft = eLeft - this.touchStartXY.sLeft;
		var velocity = Math.ceil((dLeft/dTime)/10); // 속력= 거리/시간
		var endLeft = Math.ceil(eLeft + velocity); //스크롤할때 목적지
		/*trace({eLeft: eLeft, velocity:velocity, endLeft:endLeft});*/
		if(endLeft > 0){
			endLeft = 0;
		}		
		var calLeft = (endLeft.abs() % this.menuPageWidth);
		var absPage = (endLeft.abs() / this.menuPageWidth).floor();
		var newLeft = 0;
		if(calLeft < this.menuPageWidth/2){
		}else{
			absPage += 1;
		}
		if(absPage > this.pageNum-1) absPage = this.pageNum - 1;
		newLeft = this.menuPageWidth * absPage;
		
		//trace(absPage);
		this.touchStartXY.sLeft = -newLeft;

		this.mobileMenuBodyScroll.animate({left: -newLeft}, (this.mobileMenuBodyScroll.position().left + newLeft).abs(), "cubicOut", function () {});
		this.modalObj.modalFoot.find('#' + this.modalID + '_AX_pageNav_AX_' + this.pageNo).removeClass("on");
		this.modalObj.modalFoot.find('#' + this.modalID + '_AX_pageNav_AX_' + absPage).addClass("on");
		
		this.pageNo = absPage;
		
		this.touchStartXY = null;
	},
	/* 메뉴 터치 이동관련 함수 - e */
	
	cancelEvent: function (event) {
		event.stopPropagation(); // disable  event
		return false;
	}
});