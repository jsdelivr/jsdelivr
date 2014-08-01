/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 
var AXWaterfall = Class.create(AXJ, {
	version: "AXWaterfall v1.1",
	author: "tom@axisj.com",
	logs: [
		"2012-10-11 오후 1:40:26",
		"2013-11-07 오전 9:58:41 - tom : 최소사이즈 버그 픽스"
	],
	initialize: function(AXJ_super) {
		AXJ_super();
		this.CT_className = "AXWaterfall";
		this.I_className = "WaterBox";
		this.I_classNameMobile = "WaterBoxMobile";
		this.config.boxWidth = 224;
		this.config.boxMargin = 10;
		this.config.pageSize = 5;
		this.config.mobileSize = 300;
		this.config.autoResize = true;
		this.Observer = null;
		this.player = null;
		this.played = false;
		this.targetWidth = null;
	},
	init: function(){
		var config = this.config;
		if(Object.isUndefined(config.targetID)){
			trace("need targetID - setConfig({targetID:''})");
			return;
		}
		jQuery("#"+config.targetID).addClass(this.CT_className);
		jQuery("#"+config.targetID).find("."+config.fallClassName).addClass(this.I_className);
		
		var bodyWidth = (AXUtil.docTD == "Q") ? document.body.clientWidth : document.documentElement.clientWidth;
		this.targetWidth = bodyWidth;
		jQuery("#"+config.targetID).css({width:"auto", minWidth:"auto", maxWidth:"auto"});
		
		jQuery("#"+config.targetID).find("."+config.fallClassName).hide();
		
		this.waterFall();
		this.bindEvent();
	},
	onresize: function(){
		var config = this.config;
		var bodyWidth = (AXUtil.docTD == "Q") ? document.body.clientWidth : document.documentElement.clientWidth;
		if(this.targetWidth == bodyWidth) return;
		this.targetWidth = bodyWidth;
		
		jQuery("#"+config.targetID).css({width:"auto", minWidth:"auto", maxWidth:"auto"});
		if (this.Observer) clearTimeout(this.Observer); //닫기 명령 제거
		var waterFall = this.waterFall.bind(this);
		this.Observer = setTimeout(function() {
			jQuery("#"+config.targetID).find("."+config.fallClassName).hide();
		   waterFall();
		}, 100);
	},
	waterFall: function(){
		//if(this.played) return;
		
		var config = this.config;
		var CTw = jQuery("#"+config.targetID).innerWidth() - config.boxMargin;
		var CW = config.boxWidth + config.boxMargin + 2;
		this.Clen = parseInt(CTw.div(CW));
		
		var targetWidth = (CW * this.Clen);
		if(targetWidth < CW){			
			jQuery("#"+config.targetID).css({width:"auto"});
		}else{
			jQuery("#"+config.targetID).css({width:targetWidth+"px"});
		}

		if(this.Clen == 1){
			jQuery("#"+config.targetID).find("."+config.fallClassName).addClass(this.I_classNameMobile);	
		}else{
			jQuery("#"+config.targetID).find("."+config.fallClassName).removeClass(this.I_classNameMobile);	
		}
		this.grid = [];
		this.colsGrid = [];
		for(var a=0;a<this.Clen;a++) this.colsGrid.push(0);
		this.itemLen = jQuery("#"+config.targetID).find("."+config.fallClassName).length;
		
		jQuery("#"+config.targetID).find("."+config.fallClassName).each(function(index, O){
			var boxID = config.targetID+"_AX_"+index;
			jQuery(O).attr("id", boxID);
			//jQuery(O).html(index);
		});
		
		if(this.player) clearTimeout(this.player); //실행 중지
		this.playWaterFall(0);
	},
	
	playWaterFall: function(pageNo){
		var config = this.config;
		var stIndex = pageNo * config.pageSize;
		var edIndex = (pageNo+1) * config.pageSize;
		var l = 0, t = 0, et = 0, c = 0;
		
		for(var a = stIndex;a < edIndex;a++){
			var boxID = config.targetID+"_AX_"+a;
			if(a < this.Clen){
				t = 0;
				l = (a * config.boxWidth) + (config.boxMargin * a);
				c = a;
			}else{
				var minH = null;
				var minC = null;
				jQuery.each(this.colsGrid, function(index, O){
					if(minH == null || minH > O){
						minH = O;
						minC = index;	
						c = index;
						l = (index * config.boxWidth) + (config.boxMargin * index);
					}
				});
				t = minH + config.boxMargin;
			}
			if(AXgetId(boxID)){
				var myBox = jQuery("#"+boxID);
				myBox.css({left:l, top:t});
				myBox.show();
				var et = t + myBox.outerHeight();
				this.grid.push({id:boxID, left:l, top:t, et:et, col:c});
				this.colsGrid[c] = et;
				//trace({id:boxID, left:l, top:t, et:et, col:c});
			}else{
				break;	
			}
		}
		
		//trace(pageNo+" == "+(this.itemLen / config.pageSize));
		
		if((pageNo+1) > this.itemLen / config.pageSize){
			//play end
			var maxH = null;
			jQuery.each(this.colsGrid, function(index, O){
				if(maxH == null || maxH < O){
					maxH = O;
				}
			});
			var itemWidth = this.Clen * (config.boxWidth + config.boxMargin) - config.boxMargin;
			var leftPadding = (jQuery("#"+config.targetID).innerWidth() - itemWidth) /2;
			jQuery("#"+config.targetID).css({height:maxH+config.boxMargin});
			this.played = false;
		}else{
			var playWaterFall = this.playWaterFall.bind(this);
			this.player = setTimeout(function(){
				playWaterFall((pageNo+1));
			}, 10);
		}
	},
	
	bindEvent: function(){
		var config = this.config;
		if(this.config.autoResize)
			jQuery(window).resize(this.onresize.bind(this));
	}
});