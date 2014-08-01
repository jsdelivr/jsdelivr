/**
 * AXTopDownMenu
 * @class AXTopDownMenu
 * @extends AXJ
 * @version v1.23
 * @author tom@axisj.com
 * @logs
 "2013-03-12 오후 8:21:23",
 "2013-11-22 오후 6:03:35 - tom : parent item Addclass 추가",
 "2013-12-31 오후 2:06:06 - root : setTree 시 child node count check 추가",
 "2014-04-14 - tom : setTree 메소드 엘리먼트 준비전에 박스모델 가져오는 문제 딜레이로 해결",
 "2014-05-19 - tom : childMenu 오픈 위치 버그 픽스",
 "2014-05-20 - tom : parentMenu 너비 계산부 컨테이너에 적용"
 "2014-07-10 - tom : childMenu 오픈 위치 버그 픽스"
 * @example
 ```js
 var myMenu = new AXTopDownMenu();
 AXTopDownMenu.setConfig(classConfig:JSObject);
 ```
 *
 */
 
var AXTopDownMenu = Class.create(AXJ, {
	initialize: function(AXJ_super){
		AXJ_super();

		this.tree = [];
		this.poi = "";
		this.config.easing = {
			open:{duraing:200, easing:"expoOut"},
			close:{duration:200, easing:"expoOut"}
		};
		//this.config.menuBoxID = "menuBox";
		this.config.parentMenu = {
								className:"parentMenu"
							};
		this.config.childMenu = {
								className:"childMenu",
								arrowClassName:"varrow",
								align:"center",
								valign:"top",
								margin:{top:10, left:0, bottom:0},
								arrowMargin:{top:10, left:0, bottom:0}
							};
		this.config.childsMenu = {
								className:"childsMenu",
								arrowClassName:"harrow",
								align:"left",
								valign:"top",
								margin:{top:10, left:0, bottom:0},
								arrowMargin:{top:10, left:0, bottom:0}
							};
		this.config.parentOutResetChild = true;
		this.config.childOutClose = true;
		this.config.childOutCloseTime = 700;
	},
	init: function(){
		var cfg = this.config;
		
		if(cfg.menuBoxID){
			this.menuBox = axdom("#"+cfg.menuBoxID);

			//서브 메뉴를 숨김 처리 합니다.
			this.menuBox.find("."+cfg.childMenu.className).hide();
			this.menuBox.find("."+cfg.childsMenu.className).hide();

			this.initParents();
			this.initChild();
			if(cfg.onComplete) cfg.onComplete.call(this);
		}else if(cfg.targetID){

		}
		axdom(window).bind("resize", this.windowResize.bind(this));
	},
	windowResizeApply: function(){
		var cfg = this.config, menuBoxWidth = 0;
		axf.each(this.tree, function(){
			this.width = axdom("#" + this.id).outerWidth();
			this.height = axdom("#" + this.id).outerHeight();
			menuBoxWidth += axdom("#" + this.id).parent().outerWidth().number() + 2;
		});
		//trace(menuBoxWidth);
		//this.menuBox.css({width:menuBoxWidth});
	},
	setTree: function(tree){
		var cfg = this.config;
		cfg.menuBoxID = cfg.targetID, _this = this;

		if(!this.menuBox) this.menuBox = axdom("#"+cfg.menuBoxID);

		var po = [];
		
		var treeFn = function(subTree){
			jQuery.each(subTree, function(pi, T){
				po.push("<li>");
				var addClass = (T.cn && T.cn.length > 0 ) ? " class = \"" + cfg.childsMenu.hasChildClassName + "\"" : "";
				po.push("<a href=\"" + (T.url||cfg.href) + "\""+addClass+" id=\""+ (T._id||"") +"\">"+ (T.label||"").dec() + "</a>");
				if(T.cn && T.cn.length > 0 ){
					po.push("<div class=\""+cfg.childsMenu.className+"\">");
					po.push("	<ul>");
					po.push(treeFn(T.cn));
					po.push("	</ul>");
					po.push("</div>");
				}
				po.push("</li>");
			});
		};
		
		po.push("<ul>");
		jQuery.each(tree, function(pi, T){
			var addClass = [];
			if(T.addClass){
				addClass.push(T.addClass);
			}
			po.push("<li>");
			po.push("	<div class=\"" + cfg.parentMenu.className + " " + addClass.join(" ") + "\">");
				var addClass = (T.cn) ? " class = \"" + cfg.childMenu.hasChildClassName + "\"" : "";
				po.push("<a href=\"" + (T.url||cfg.href) + "\""+addClass+" id=\""+ (T._id||"") +"\">"+ (T.label||"").dec() + "</a>");
				if(T.cn){
					po.push("<div class=\""+cfg.childMenu.className+"\">");
					po.push("	<ul>");
					po.push(treeFn(T.cn));
					po.push("	</ul>");
					po.push("</div>");
				}
			po.push("	</div>");
			po.push("</li>");
		});
		po.push("</ul>");
		po.push("<div class=\"clear\"></div>");

		this.menuBox.empty();
		this.menuBox.append(po.join(''));
		
		//서브 메뉴를 숨김 처리 합니다.
		this.menuBox.find("."+cfg.childMenu.className).hide();
		this.menuBox.find("."+cfg.childsMenu.className).hide();

        setTimeout(function(){
            _this.initParents();
            _this.initChild();
	        if(cfg.onComplete) cfg.onComplete.call(this);
        }, 300);
	},
	initParents: function(){
		var cfg = this.config;
		var parents = [], menuBoxWidth = 0;
		this.menuBox.find("." + cfg.parentMenu.className).each(function(pi, EL){
			EL.id = cfg.menuBoxID + "_PM_" + pi;
			var _id = "";

			var ELA = jQuery(EL).children("A");

			if(ELA.get(0).id) _id = jQuery(EL).children("A").get(0).id;
			ELA.get(0).id = cfg.menuBoxID + "_PMA_" + pi;
			ELA.attr("data-axmenuid", _id);

			parents.push({
				_id:_id,
				id:EL.id,
				width:axdom(EL).outerWidth(),
				height:axdom(EL).outerHeight(),
				cn:[],
				coi:""
			});
			menuBoxWidth += axdom(EL).parent().outerWidth().number() + 2;
		});
		this.tree = parents;
		//this.menuBox.css({width:menuBoxWidth});

		//trace(this.menuBox.find("." + cfg.parentMenu.className + ">a"));
		this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("mouseover", this.onoverParent.bind(this));
		this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("focus", this.onoverParent.bind(this));
		this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("click", this.onclickParent.bind(this));
		
		if(cfg.childOutClose){
			var onoutChild = this.onoutChild.bind(this);
			this.menuBox.find("." + cfg.parentMenu.className + ">a").bind("mouseout", onoutChild);
		}
	},
	onoverParent: function(event){
		if (this.childObserver) clearTimeout(this.childObserver); //닫기 명령 제거
		var cfg = this.config;
		var poi = event.target.id.split(/\_/g).last();
		if(this.poi != "" && this.poi != poi){
			jQuery("#" + cfg.menuBoxID + "_PMA_" + this.poi).removeClass("on");
			jQuery("#" + cfg.menuBoxID + "_PMC_" + this.poi).slideUp(
				{
					duration:cfg.easing.close.duration,
					easing:cfg.easing.close.easing,
					complete:function(){
						
					}
		    	}
		    );
		    if(cfg.parentOutResetChild) this.closeSubMenu(this.tree[this.poi]);
		}

		//slideDown check
		if(this.dfPoi != undefined) jQuery("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).removeClass("on");
		jQuery("#" + cfg.menuBoxID + "_PMA_" + poi).addClass("on");
		//trace("#" + cfg.menuBoxID + "_PMC_" + poi);
		
		var tgDiv = jQuery("#" + cfg.menuBoxID + "_PMC_" + poi);
		if(!this.tree[poi].divDim){
			tgDiv.show();
			this.tree[poi].divDim = {width:tgDiv.outerWidth(), height:tgDiv.outerHeight()};
			if(this.tree[poi].height == null){
				for(var index = 0;index < this.tree.length;index++){
					this.tree[index].height = axdom("#" + this.tree[index].id).outerHeight();
				}
				//trace(poi, this.tree[poi]);
			}
			var topDim = {width:this.tree[poi].width, height:this.tree[poi].height};

			/* subMenu positioning */
			if(cfg.childMenu.align == "center"){
				var posLeft = topDim.width / 2 - this.tree[poi].divDim.width / 2 + cfg.childMenu.margin.left;
			}else if(cfg.childMenu.align == "left"){
				var posLeft = 0 + cfg.childMenu.margin.left;
			}else if(cfg.childMenu.align == "right"){
				var posLeft = topDim.width - this.tree[poi].divDim.width + cfg.childMenu.margin.left;
			}
			if(cfg.childMenu.valign == "top"){
				var posTop = topDim.height + cfg.childMenu.margin.top;
				if(cfg.childMenu.float){
					tgDiv.css({top:posTop, left:posLeft});
				}else{
					tgDiv.css({top:posTop, left:posLeft, width:this.tree[poi].divDim.width});
				}
			}else if(cfg.childMenu.valign == "bottom"){
				var posTop = topDim.height + cfg.childMenu.margin.bottom;
				if(cfg.childMenu.float){
					tgDiv.css({top:posTop, left:posLeft});
				}else{
					tgDiv.css({top:"auto", bottom:posTop, left:posLeft, width:this.tree[poi].divDim.width});
				}
			}
			/* -------------------- */

			/* subMenu Arrow positioning */
			if(cfg.childMenu.arrowClassName){
				var arrow = tgDiv.find("."+cfg.childMenu.arrowClassName);
				if(cfg.childMenu.align == "center"){
					var aLeft = tgDiv.outerWidth() / 2 - arrow.outerWidth() / 2 + cfg.childMenu.arrowMargin.left;
				}else if(cfg.childMenu.align == "left"){
					var aLeft = 0 + cfg.childMenu.arrowMargin.left;
				}else if(cfg.childMenu.align == "right"){
					var aLeft = tgDiv.outerWidth() - arrow.outerWidth() + cfg.childMenu.arrowMargin.left;
				}
				if(cfg.childMenu.valign == "top"){
					var aTop = -arrow.outerHeight() + cfg.childMenu.arrowMargin.top;
					arrow.css({top:aTop, left:aLeft});
				}else if(cfg.childMenu.valign == "bottom"){
					var aTop = -arrow.outerHeight() + cfg.childMenu.arrowMargin.bottom;
					arrow.css({bottom:aTop, left:aLeft});
				}
			}
			/* -------------------- */

			tgDiv.hide();
			topDim = null;
			posTop = null;
			posLeft = null;
		}

		tgDiv.fadeIn(
			{
				duration:cfg.easing.open.duration,
				easing:cfg.easing.open.easing,
				complete:function(){
				}
	    	}
	    );

		this.poi = poi;
	},
	onclickParent: function(event){
		var cfg = this.config;
		var poi = event.target.id.split(/\_/g).last();

		trace(this.tree[poi]);

	},
	initChild: function(){
		var cfg = this.config;
		var initChilds = this.initChilds.bind(this);
		var tree = this.tree;
		this.menuBox.find("." + cfg.parentMenu.className).each(function(pi, EL){
			var child = jQuery(EL).children("."+cfg.childMenu.className).get(0);
			if(child){
				child.id = cfg.menuBoxID + "_PMC_" + pi;
				if(cfg.childMenu.arrowClassName){
					var arrow = jQuery("<div class=\""+cfg.childMenu.arrowClassName+"\"></div>");
					jQuery(child).prepend(arrow);
				}
				initChilds(child.id, tree[pi]);
			}else{
				
			}
		});
	},
	initChilds: function(cid, rTree){
		var initChilds = this.initChilds.bind(this);
		var cfg = this.config;
		var tree = rTree.cn;

		var onoverChild = this.onoverChild.bind(this);
		var onoutChild = this.onoutChild.bind(this);
		//trace(cid);
		jQuery("#"+cid+">ul>li").each(function(pi, EL){
			var linkA = jQuery(EL).children("A");
			var _id = "";
			if(linkA.get(0).id) _id = linkA.get(0).id;
			linkA.get(0).id = cid.replace("PMC", "PMA") + "_" + pi;
			linkA.attr("data-axmenuid", _id);
			linkA.bind("mouseover", onoverChild);
			if(cfg.childOutClose){
				linkA.bind("mouseout", onoutChild);
			}

			//jQuery(EL).children("A").html(cid.replace("PMC", "PMA") + "_" + pi);
			var childDiv = jQuery(EL).children("."+cfg.childsMenu.className).get(0);
			if(childDiv){
				childDiv.id = cid+"_"+pi;

				if(cfg.childsMenu.arrowClassName){
					var arrow = jQuery("<div class=\""+cfg.childsMenu.arrowClassName+"\"></div>");
					jQuery(childDiv).prepend(arrow);
				}

				tree.push({
					_id:_id,
					id:	cid+"_"+pi,
					cn:[],
					coi:""
				});
				initChilds(cid+"_"+pi, tree[pi]);
			}else{
				tree.push({
					_id:_id,
					id:	cid+"_"+pi,
					cn:[],
					coi:""
				});
			}
		});
	},
	closeSubMenu: function(pitem){
		if(!pitem) return;
		if(pitem.coi == "") return;
		var cfg = this.config;
		jQuery("#" + pitem.coi).slideUp(
			{
				duration:cfg.easing.close.duration,
				easing:cfg.easing.close.easing,
				complete:function(){
				}
	    	}
	    );
	    pitem.coi = "";
	    //하위 자식들의 poi 모두 닫기

		var closeAllSubMenu = function(stree){
			jQuery.each(stree, function(){
				if(this.coi != ""){
					jQuery("#" + this.coi).hide();
				}
				closeAllSubMenu(this.cn);
			});
		};
	    closeAllSubMenu(pitem.cn);
	},
	onoverChild: function(event){
		if (this.childObserver) clearTimeout(this.childObserver); //닫기 명령 제거
		var cfg = this.config;
		var eid = event.target.id;
		var ids = event.target.id.split(/\_/g);
		var tree = this.tree;
		var item = {};
		var pitem = {};
		for(var a=2;a<ids.length;a++){
			if(a == ids.length-2){
				pitem = tree[ids[a]];
			}
			if(tree[ids[a]]){
				if(tree[ids[a]].cn){
					item = tree[ids[a]];
					tree = tree[ids[a]].cn;
				}
			}
		}
		
		if(pitem){
			if(pitem.coi != "" && pitem.coi != item.id){
				this.closeSubMenu(pitem);
			}
		}

		if(item){
			if(item.id){

				var tgDiv = jQuery("#" + item.id);

				//slideDown check
				if(!item.divDim){
					jQuery("#" + item.id).show();
					item.divDim = {width:tgDiv.outerWidth(), height:tgDiv.outerHeight()};
					var pDim = {width:jQuery("#"+eid).outerWidth(), height:jQuery("#"+eid).outerHeight(), pos:jQuery("#"+eid).position()};

					if(cfg.childsMenu.align == "left"){
						var posLeft = pDim.width + cfg.childsMenu.margin.left;
					}else{
						var posLeft = -item.divDim.width + cfg.childsMenu.margin.left;
					}

					if(cfg.childsMenu.valign == "top"){
						var posTop = pDim.pos.top + cfg.childsMenu.margin.top;
						tgDiv.css({top:posTop, left:posLeft, width:item.divDim.width});
					}else{
						var posTop = (pitem.divDim.height - pDim.pos.top) - pDim.height + cfg.childsMenu.margin.bottom;
						tgDiv.css({bottom:posTop, left:posLeft, width:item.divDim.width});
					}

					/* subMenu Arrow positioning */
					if(cfg.childsMenu.arrowClassName){

						var arrow = tgDiv.find("."+cfg.childsMenu.arrowClassName);
						if(cfg.childsMenu.align == "left"){
							var aLeft =  - arrow.outerWidth() + cfg.childsMenu.arrowMargin.left;
						}else{
							var aLeft = tgDiv.outerWidth() - arrow.outerWidth() + cfg.childsMenu.arrowMargin.left;
						}
						if(cfg.childsMenu.valign == "top"){
							var aTop = 0 + cfg.childsMenu.arrowMargin.top;
							arrow.css({top:aTop, left:aLeft});
						}else if(cfg.childsMenu.valign == "bottom"){
							var aTop = 0 + cfg.childsMenu.arrowMargin.bottom;
							arrow.css({bottom:aTop, left:aLeft});
						}
					}
					/* -------------------- */

					tgDiv.hide();
					pDim = null;
					posTop = null;
					posLeft = null;
				}


				tgDiv.fadeIn(
					{
						duration:cfg.easing.open.duration,
						easing:cfg.easing.open.easing,
						complete:function(){
						}
			    	}
			    );
			    if(pitem) pitem.coi = item.id.replace("PMA", "PMC");
			}

		}

	},
	onoutChild: function(event){
		var cfg = this.config;
		var outChild = this.outChild.bind(this);
		this.childObserver = setTimeout(function() {
	       outChild();
	    }, cfg.childOutCloseTime);
	},
	outChild: function(){
		var cfg = this.config;
		this.closeSubMenu(this.tree[this.poi]);

		jQuery("#" + cfg.menuBoxID + "_PMA_" + this.poi).removeClass("on");
		if(this.dfPoi != undefined) jQuery("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).addClass("on");
		jQuery("#" + cfg.menuBoxID + "_PMC_" + this.poi).slideUp(
			{
				duration:cfg.easing.close.duration,
				easing:cfg.easing.close.easing,
				complete:function(){
				}
	    	}
	    );
	},
	setHighLightMenu: function(poi){
		var cfg = this.config;
		
		if(jQuery.isArray(poi)){
			
			this.dfPoi = poi;
			
			var tree = this.tree;
			jQuery.each(poi, function(idx, T){
				if(idx == 0) tree = tree[T.number()];
				else  tree = tree.cn[T.number()];
				if(tree){
					if(idx == 0){
						jQuery("#" + tree.id).addClass("on");
						jQuery("#" + tree.id).children("A").addClass("on");
					}else{
						jQuery("#" + tree.id.replace("_PMC_", "_PMA_")).addClass("on");
					}
				}
			});
			
		}else{
			
			this.dfPoi = poi;
			jQuery("#" + cfg.menuBoxID + "_PMA_" + this.dfPoi).addClass("on");
			
		}
	},
	setHighLightOriginID: function(_id){
		var cfg = this.config;
		var tree = this.tree;
		var findedID = "";

		var treeFn = function(subTree){
			jQuery.each(subTree, function(idx, T){
				if(T._id == _id){
					findedID = T.id;
					return false;
				}else{
					if(T.cn) treeFn(T.cn);
				}
			});
		};

		jQuery.each(this.tree, function(idx, T){
			if(T._id == _id){
				findedID = T.id;
				return false;
			}else{
				if(T.cn) treeFn(T.cn);
			}
		});

		if(findedID){
			this.findedID = findedID;
			var pos = findedID.split(/_PM[C]?_/g).last();
			var selectedMenus = pos.split(/_/g);
			this.setHighLightMenu(selectedMenus);
			return selectedMenus;
		}
	},
	setHighLightID: function(_id){
		var cfg = this.config;
		var tree = this.tree;
		var findedID = "";

		var treeFn = function(subTree){
			jQuery.each(subTree, function(idx, T){
				if(T.id == _id){
					findedID = T.id;
					return false;
				}else{
					if(T.cn) treeFn(T.cn);
				}
			});
		};
		jQuery.each(tree, function(idx, T){
			if(T.id == _id){
				findedID = T.id;
				return false;
			}else{
				if(T.cn) treeFn(T.cn);
			}
		});

		if(findedID){
			this.findedID = findedID;
			var pos = findedID.split(/_PM[C]?_/g).last();
			var selectedMenus = pos.split(/_/g);
			this.setHighLightMenu(selectedMenus);
			return selectedMenus;
		}
	}
});