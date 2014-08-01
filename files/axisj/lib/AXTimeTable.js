/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 
var AXTimeTable = Class.create(AXJ, {
    version: "AXTimeTable V1.0",
    author: "tom@axisj.com",
	logs: [
		"2013-04-08 오전 12:22:02 - tom@axisj.com",
		"2013-12-27 오후 1:36:13 - tom : timeset 을 확장 했을 때 선택이 안되는 버그픽스"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.config.userDisable = false;
		this.config.timeset = [
			{hour:"00:00", display:"새벽 00:00"},
			{hour:"01:00", display:"01:00"},
			{hour:"02:00", display:"02:00"},
			{hour:"03:00", display:"03:00"},
			{hour:"04:00", display:"04:00"},
			{hour:"05:00", display:"05:00"},
			{hour:"06:00", display:"오전 06:00"},
			{hour:"07:00", display:"07:00"},
			{hour:"08:00", display:"08:00"},
			{hour:"09:00", display:"09:00"},
			{hour:"10:00", display:"10:00"},
			{hour:"11:00", display:"11:00"},
			{hour:"12:00", display:"12:00"},
			{hour:"13:00", display:"오후 01:00"},
			{hour:"14:00", display:"02:00"},
			{hour:"15:00", display:"03:00"},
			{hour:"16:00", display:"04:00"},
			{hour:"17:00", display:"05:00"},
			{hour:"18:00", display:"06:00"},
			{hour:"19:00", display:"저녁 07:00"},
			{hour:"20:00", display:"08:00"},
			{hour:"21:00", display:"09:00"},
			{hour:"22:00", display:"10:00"},
			{hour:"23:00", display:"11:00"}
		];
		this.config.zoneSet = [
			{label:"시간선택", start:"00:00", end:"18:00", disabled:false}
		];
    },
    init: function() {
		var cfg = this.config;
		if(Object.isUndefined(cfg.targetID)){
			trace("need targetID - setConfig({targetID:''})");
			return;
		}
		this.setLayout();
		this.setData();
    },
    setLayout: function(){
    	var cfg = this.config;

    	jQuery.each(cfg.zoneSet, function (zindex, ZS) {
    		if (ZS.start == "") this.start = "09:00";
    		if (ZS.end == "") this.end = "18:00";
    	});
    	
    	var po = [];
    	var pbo = [];
    	po.push("<div class=\"AXTimeTable\">");
    	po.push("	<table cellpadding=\"0\" cellspacing=\"0\" class=\"AXTimeTableLayout\">");
    	po.push("		<thead>");
    	po.push("			<tr>");
    	po.push("				<td width=\"80\" class=\"\">&nbsp;</td>");
    	jQuery.each(cfg.zoneSet, function(zindex, ZS){
	    	po.push("<td>");
	    	po.push("<div class=\"tdRel\" style=\"z-index:900;\">");

	    	if(cfg.userDisable){
	    		po.push("<input type=\"checkbox\" name=\"userDisable\" class=\"userDisable\" id=\""+cfg.targetID+"_AX_userDisable_AX_"+zindex+"\" value=\""+zindex+"\" style=\"vertical-align:middle;\"");
	    		if(ZS.disabled){
	    			po.push(" ");
	    		}else{
	    			po.push(" checked=\"checked\"");
	    		}
	    		po.push(" />");
	    	}
	    	po.push("<label for=\""+cfg.targetID+"_AX_userDisable_AX_"+zindex+"\">"+ZS.label+"</label>");

	    	po.push("<div class=\"timeZone\" id=\""+cfg.targetID+"_AX_zoneSelecter_AX_"+zindex+"\"");
	    	if(ZS.disabled){
	    		po.push(" style=\"display:none;\"");
	    	}
	    	po.push(">");
	    	po.push("	<div class=\"upControl\" id=\""+cfg.targetID+"_AX_zoneSelecter_AX_up_AX_"+zindex+"\">"+ZS.start+"</div>");
	    	po.push("	<div class=\"downControl\" id=\""+cfg.targetID+"_AX_zoneSelecter_AX_down_AX_"+zindex+"\">"+ZS.end+"</div></div>");
	    	po.push("</div>");
	    	po.push("</td>");
	    	//body
	    	pbo.push("			<td style=\"background-color:"+(ZS.bgColor||"")+";\"><div class=\"tdRel\" style=\"z-index:1;\">&nbsp;</div></td>");
    	});
    	po.push("			</tr>");
    	po.push("		</thead>");
    	po.push("		<tbody>");
    	jQuery.each(cfg.timeset, function(){
	    	po.push("			<tr>");
	    	po.push("				<td class=\"timeset\"><div class=\"tdRel\" style=\"z-index:1;\">"+ this.display +"</div></td>");
	    	po.push(pbo.join(''));
	    	po.push("			</tr>");
    	});
    	po.push("		</tbody>");
    	po.push("	</table>");
    	po.push("</div>");
    	jQuery("#"+cfg.targetID).html(po.join(''));

    	jQuery("#"+cfg.targetID).find("thead .timeZone").bind("mousedown", this.timeZoneDown.bind(this));
    	jQuery("#"+cfg.targetID).find("thead .userDisable").bind("click", this.timeZoneSwitch.bind(this));

    },
    setData: function(timeData){
    	var cfg = this.config;
    	var theadHeight = jQuery("#"+cfg.targetID).find("thead").height();
    	cfg.theadHeight = theadHeight;
    	var topPadding = 0;
    	
    	if(timeData){
    		jQuery.each(timeData, function(zindex, ZS){
	    		var zoneID = cfg.targetID+"_AX_zoneSelecter_AX_"+zindex;
	    		jQuery("#"+zoneID).find(".upControl").text(ZS.start);
	    		jQuery("#"+zoneID).find(".downControl").text(ZS.end);
    		});
    	}
    	jQuery("#"+cfg.targetID).find("thead .timeZone").each(function(){
    		var start = jQuery(this).find(".upControl").text();
    		var end = jQuery(this).find(".downControl").text();
    		var startSeq = start.left(2).number();
    		var endSeq = end.left(2).number();
    		var w = jQuery(this).parent().outerWidth();
    		var t = theadHeight + (startSeq * theadHeight) + topPadding;
    		var h = (endSeq - startSeq) * theadHeight;
    		jQuery(this).css({width:w-2, top:t, height:h-2});
    	});
    },
    timeZoneSwitch: function(event){
    	var cfg = this.config;
    	var seq = event.target.id.split(/_AX_/g).last();
    	var TF = event.target.checked;
    	if(TF){
    		jQuery("#"+cfg.targetID+"_AX_zoneSelecter_AX_"+seq).show();
    	}else{
    		jQuery("#"+cfg.targetID+"_AX_zoneSelecter_AX_"+seq).hide();
    	}
    	cfg.zoneSet[seq].disabled = !TF;
    },
    timeZoneDown: function(event){
    	var cfg = this.config;
		// event target search -
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt : eventTarget, evtIDs : eid,
			find:function(evt, evtIDs){ return (jQuery(evt).hasClass("timeZone") || jQuery(evt).hasClass("upControl") || jQuery(evt).hasClass("downControl")) ? true : false; }
		});
		// event target search ------------------------
		if(myTarget){
			if(jQuery(myTarget).hasClass("upControl")){
				this.readyTarget = myTarget.parentNode;
				this.moveReady = false;
				this.resizeReady = "up";
			}else if(jQuery(myTarget).hasClass("downControl")){
				this.readyTarget = myTarget.parentNode;
				this.moveReady = false;
				this.resizeReady = "down";
			}else{
				this.readyTarget = myTarget;
				this.resizeReady = false;
				this.moveReady = true;
			}

			this.readyDotPos = this.getMousePosition(event, cfg.targetID);
			this.readyTargetPos = jQuery(this.readyTarget).position();
			this.readyTargetHeight = jQuery(this.readyTarget).outerHeight();

			var SBonMouseMove = this.SBonMouseMove.bind(this);
			this.SBonMouseMoveBind = function(event){
				SBonMouseMove(event);
			}
			var SBonMouseUp = this.SBonMouseUp.bind(this);
			this.SBonMouseUpBind = function(event){
				SBonMouseUp(event);
			}
			jQuery(document.body).bind("mousemove", this.SBonMouseMoveBind);
			jQuery(document.body).bind("mouseup", this.SBonMouseUpBind);
		}
    },
	getMousePosition: function(event, contentScrollID){
		var pos = jQuery("#"+contentScrollID).offset();
		var x = (event.pageX - pos.left);
		var y = (event.pageY - pos.top);
		return {x:x, y:y};
	},
    SBonMouseMove: function(event){
    	var cfg = this.config;
    	if(this.moveReady){
			jQuery(document.body).attr("onselectstart", "return false");
			jQuery(document.body).addClass("AXUserSelectNone");

    		var mouse = this.getMousePosition(event, cfg.targetID);
    		var dotPos = this.readyDotPos;
    		var moveY = mouse.y - dotPos.y;
    		moveY = parseInt(moveY / cfg.theadHeight) * cfg.theadHeight;
    		
    		var newTop = this.readyTargetPos.top.round() + moveY;
    		if(newTop < cfg.theadHeight-1) return;
    		var readyTargetHeight = this.readyTargetHeight;
			
    		var stidx = parseInt(newTop/cfg.theadHeight) - 1;
    		var edidx = stidx + parseInt(readyTargetHeight/cfg.theadHeight);
    		
    		if(edidx < (cfg.timeset.length + 1)) jQuery(this.readyTarget).css({top:newTop});
    		if(edidx > (cfg.timeset.length - 1)) edidx = 0;
    		if(edidx != 0){
	    		jQuery(this.readyTarget).find(".upControl").html(cfg.timeset[stidx].hour);
	    		jQuery(this.readyTarget).find(".downControl").html(cfg.timeset[edidx].hour);
	    	}else{
	    		jQuery(this.readyTarget).find(".downControl").html(cfg.timeset[edidx].hour);
	    	}
    		jQuery(this.readyTarget).addClass("on");

    	}else if(this.resizeReady){
    		
			jQuery(document.body).attr("onselectstart", "return false");
			jQuery(document.body).addClass("AXUserSelectNone");
    		if(this.resizeReady == "up"){
	    		var mouse = this.getMousePosition(event, cfg.targetID);
	    		var dotPos = this.readyDotPos;
	    		var moveY = mouse.y - dotPos.y;
	    		moveY = parseInt(moveY / cfg.theadHeight) * cfg.theadHeight;
	    		
	    		var newTop = this.readyTargetPos.top.round() + moveY;
	    		if(newTop < cfg.theadHeight-1) return;
	    		var readyTargetHeight = this.readyTargetHeight;
	    		
	    		var stidx = parseInt(newTop/cfg.theadHeight) - 1;
    			var end = jQuery(this.readyTarget).find(".downControl").text();
    			var endSeq = end.left(2).number();
    			if(endSeq == 0) endSeq = cfg.timeset.length;
	    		var h = (endSeq - stidx) * cfg.theadHeight;
	    		if(h < cfg.theadHeight) return;
	    		jQuery(this.readyTarget).find(".upControl").html(cfg.timeset[stidx].hour);
	    		jQuery(this.readyTarget).css({top:newTop, height:h-2});
	    		jQuery(this.readyTarget).addClass("on");
	    		jQuery(this.readyTarget).find(".upControl").addClass("on");
    		}else{ //down
	    		var readyTargetHeight = this.readyTargetHeight;
	    		var mouse = this.getMousePosition(event, cfg.targetID);
	    		var dotPos = this.readyDotPos;
	    		var moveY = mouse.y - dotPos.y;
	    		moveY = (moveY / cfg.theadHeight).round() * cfg.theadHeight;

	    		var newHeight = readyTargetHeight + moveY;
	    		var start = jQuery(this.readyTarget).find(".upControl").text();
	    		var startSeq = start.left(2).number();

	    		var edidx = startSeq + (newHeight/cfg.theadHeight).round();
				//trace({edidx:edidx, startSeq:startSeq});
	    		var h = (edidx - startSeq) * cfg.theadHeight;
	    		if(h < cfg.theadHeight) return;
	    		if(edidx < (cfg.timeset.length + 1)){
	    			 jQuery(this.readyTarget).css({height:h-2});
	    		}
	    		if(edidx > (cfg.timeset.length - 1)) edidx = 0;
	    		jQuery(this.readyTarget).find(".downControl").html(cfg.timeset[edidx].hour);
	    		jQuery(this.readyTarget).addClass("on");
	    		jQuery(this.readyTarget).find(".downControl").addClass("on");
    		}
    	}
    },
    SBonMouseUp: function(event){
    	var cfg = this.config;

    	jQuery(this.readyTarget).removeClass("on");
    	jQuery(this.readyTarget).find(".upControl").removeClass("on");
    	jQuery(this.readyTarget).find(".downControl").removeClass("on");
    	this.readyDotPos = null;
    	this.moveReady = false;
		this.resizeReady = false;
    	jQuery(document.body).unbind("mousemove", this.SBonMouseMoveBind);
		jQuery(document.body).unbind("mouseup", this.SBonMouseUpBind);
		jQuery(document.body).removeAttr("onselectstart");
		jQuery(document.body).removeClass("AXUserSelectNone");
    },
    getData: function(){
    	var cfg = this.config;
    	var returnObject = [];
    	jQuery.each(cfg.zoneSet, function(zindex, ZS){
    		if(!ZS.disabled){
	    		var zoneID = cfg.targetID+"_AX_zoneSelecter_AX_"+zindex;
	    		var start = jQuery("#"+zoneID).find(".upControl").text();
	    		var end = jQuery("#"+zoneID).find(".downControl").text();
	    		var startSeq = start.left(2).number();
	    		var endSeq = end.left(2).number();
	    		var obj = {label:ZS.label};
	    		obj.start = cfg.timeset[startSeq].hour;
	    		obj.end = cfg.timeset[endSeq].hour;
	    		returnObject.push(obj);
	    	}
    	});
    	return returnObject;
    }
});