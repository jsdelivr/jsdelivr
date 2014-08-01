/**
 * AXSplit
 * @class AXSplit
 * @extends AXJ
 * @version v0.1
 * @author tom@axisj.com
 * @logs
 *
 */
var AXSplit = Class.create(AXJ, {
	initialize: function(AXJ_super) {
		AXJ_super();

	},
	init: function() {
		var cfg = this.config;

		if(!cfg.onwindowresize) cfg.onwindowresize = cfg.onWindowResize;
		if(!cfg.onready) cfg.onready = cfg.onReady;
		if(!cfg.onsplitresize) cfg.onsplitresize = cfg.onSplitResize;
		if(!cfg.onsplitresizeend) cfg.onsplitresizeend = cfg.onSplitResizeEnd;

		this.target = axdom("#"+cfg.targetID);
		this.target.attr("ondragstart", "return false");
		this.initChild(this.target);
		this.initEvent();
		axdom(window).resize(this.windowResize.bind(this));

		if(cfg.onready){
			cfg.onready.call({});
		}
	},
	windowResize: function () {
		this.windowResizeApply();

		/*
		var windowResizeApply = this.windowResizeApply.bind(this);
		if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
		this.windowResizeObserver = setTimeout(function () {
			windowResizeApply();
		}, 1);
		*/
	},
	windowResizeApply: function(){
		var cfg = this.config;
		if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
		this.initChild(this.target);
		//axdom(window).resize();
		if(cfg.onwindowresize){
			cfg.onwindowresize.call({});
		}
	},
	initChild: function(parent){
		var cfg = this.config;
		var parentWidth = parent.innerWidth();
		var parentHeight = parent.innerHeight();

		var calcWidth = 0, calcHeight = 0, uncolCount = 0, unrowCount = 0, colindex = 1, rowindex = 1;
		var moreFindTarget = [];
		parent.children().each(function(){
			var dom_this = axdom(this);
			if(dom_this.hasClass("AXSplit-cols")){
				if(dom_this.attr("data-width")) {
					calcWidth += dom_this.attr("data-width").number();
					if (!dom_this.attr("data-axsplit-colindex")){
						dom_this.css({width: dom_this.attr("data-width")});
					}
				}else{
					uncolCount++;
				}
				if(!dom_this.attr("data-axsplit-colindex")) dom_this.attr("data-axsplit-colindex", colindex);
				colindex++;
			}else if(dom_this.hasClass("AXSplit-col-handle")){
				calcWidth += dom_this.width().number();
				if(!dom_this.attr("data-axsplit-colindex")) dom_this.attr("data-axsplit-colindex", colindex);
				colindex++;
			}else if(dom_this.hasClass("AXSplit-rows")){
				if(dom_this.attr("data-height")){
					calcHeight += dom_this.attr("data-height").number();
					if(!dom_this.attr("data-axsplit-rowindex")) {
						dom_this.css({height: dom_this.attr("data-height")});
					}
				}else{
					unrowCount++;
				}
				if(!dom_this.attr("data-axsplit-rowindex")) dom_this.attr("data-axsplit-rowindex", rowindex);
				rowindex++;
			}else if(dom_this.hasClass("AXSplit-row-handle")) {
				calcHeight += dom_this.height().number();
				if(!dom_this.attr("data-axsplit-rowindex")) dom_this.attr("data-axsplit-rowindex", rowindex);
				rowindex++;
			}
		});

		parent.children().each(function(){
			var dom_this = axdom(this);
			if(dom_this.hasClass("AXSplit-cols")){
				if(!dom_this.attr("data-width")){
					dom_this.css({width: (parentWidth - calcWidth) / uncolCount});
				}
			}else if(dom_this.hasClass("AXSplit-rows")){
				if(!dom_this.attr("data-height")){
					dom_this.css({height: (parentHeight - calcHeight) / unrowCount});
				}
			}

			if( dom_this.find(".AXSplit-rows, .AXSplit-cols").length > 0 ){
				moreFindTarget.push(dom_this);
			}
		});

		for(var i=0;i<moreFindTarget.length;i++){
			this.initChild(moreFindTarget[i]);
		}

	},
	initEvent: function(){
		var cfg = this.config, _this = this;
		this.target.find(".AXSplit-col-handle, .AXSplit-row-handle").bind("mousedown", function(event){
			_this.readyResize(axdom(this), event);
		});
	},
	readyResize: function(handleDom, event){
		var cfg = this.config, _this = this;
		this.resizeHandle_data = {
			parentDom: handleDom.parent(),
			dom: handleDom,
			direction: handleDom.hasClass("AXSplit-row-handle")
		};
		this.resizeHandle_data.dom.addClass("on");

		if(this.resizeHandle_data.direction){
			//rows
			this.resizeHandle_data.top = event.pageY;
			this.resizeHandle_data.hindex = this.resizeHandle_data.dom.attr("data-axsplit-rowindex").number();
			this.resizeHandle_data.pitem_dom = this.resizeHandle_data.parentDom.find(".AXSplit-rows[data-axsplit-rowindex="+ (this.resizeHandle_data.hindex-1) +"]");
			this.resizeHandle_data.nitem_dom = this.resizeHandle_data.parentDom.find(".AXSplit-rows[data-axsplit-rowindex="+ (this.resizeHandle_data.hindex+1) +"]");
			this.resizeHandle_data.pitem_dom_height = this.resizeHandle_data.pitem_dom.height().number();
			this.resizeHandle_data.nitem_dom_height = this.resizeHandle_data.nitem_dom.height().number();
		}else{
			//cols
			this.resizeHandle_data.left = event.pageX;
			this.resizeHandle_data.hindex = this.resizeHandle_data.dom.attr("data-axsplit-colindex").number();
			this.resizeHandle_data.pitem_dom = this.resizeHandle_data.parentDom.find(".AXSplit-cols[data-axsplit-colindex="+ (this.resizeHandle_data.hindex-1) +"]");
			this.resizeHandle_data.nitem_dom = this.resizeHandle_data.parentDom.find(".AXSplit-cols[data-axsplit-colindex="+ (this.resizeHandle_data.hindex+1) +"]");
			this.resizeHandle_data.pitem_dom_width = this.resizeHandle_data.pitem_dom.width().number();
			this.resizeHandle_data.nitem_dom_width = this.resizeHandle_data.nitem_dom.width().number();
		}

		axdom(document.body).bind("mousemove.axsplit", this.splitResize.bind(this));
		axdom(document.body).bind("mouseup.axsplit", this.splitResizeEnd.bind(this));
	},
	splitResize: function(event){
		var cfg = this.config, _this = this;
		var rdata = this.resizeHandle_data;

		if(rdata.direction){
			var dy = event.pageY - rdata.top;

			var pitem_dom_height = rdata.pitem_dom_height + dy;
			rdata.pitem_dom.css({height:pitem_dom_height});
			if(rdata.pitem_dom.attr("data-height")){
				rdata.pitem_dom.attr("data-height", pitem_dom_height);
			}

			var nitem_dom_height = rdata.nitem_dom_height - dy;
			rdata.nitem_dom.css({height:nitem_dom_height});
			if(rdata.nitem_dom.attr("data-height")){
				rdata.nitem_dom.attr("data-height", nitem_dom_height);
			}
		}else{
			var dx = event.pageX - rdata.left;

			var pitem_dom_width = rdata.pitem_dom_width + dx;
			rdata.pitem_dom.css({width:pitem_dom_width});
			if(rdata.pitem_dom.attr("data-width")){
				rdata.pitem_dom.attr("data-width", pitem_dom_width);
			}

			var nitem_dom_width = rdata.nitem_dom_width - dx;
			rdata.nitem_dom.css({width:nitem_dom_width});
			if(rdata.nitem_dom.attr("data-width")){
				rdata.nitem_dom.attr("data-width", nitem_dom_width);
			}
		}

		if(cfg.onsplitresize){
			cfg.onsplitresize.call(this.resizeHandle_data);
		}
	},
	splitResizeEnd: function(){
		var cfg = this.config, _this = this;
		this.resizeHandle_data.dom.removeClass("on");
		axdom(document.body).unbind("mousemove.axsplit");
		axdom(document.body).unbind("mouseup.axsplit");

		if(cfg.onsplitresizeend){
			cfg.onsplitresizeend.call({});
		}
	}
});