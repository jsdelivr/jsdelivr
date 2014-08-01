/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXProgress = Class.create(AXJ, {
	version: "AXProgress v1.1",
	author: "tom@axisj.com",
	logs: [
		"2012-12-19 오후 5:47:58",
		"2014-02-03 오후 9:29:34 : tom count 표시문제 해결"
	],
	initialize: function(AXJ_super) {
		AXJ_super();
		this.Observer = null;
		//this.config.easing = {duration:10, easing:""};
		this.config.duration = 50;
		this.config.theme = "AXlineProgress";
	},
	init: function(){
		
	},
	start: function(callBack, options){
		var config = this.config;
		config.callBack = callBack;
		
		config.options = options;
		
		var totalCount = config.totalCount || 100;
		this.loadedCount = 0;
		var loadedCount = this.loadedCount;
		var loadedRate = (loadedCount / totalCount * 100).round(1);
		var progressWidth = config.width || 200;
		var progressTitle = config.title || "";
		var progressTop = config.top || 0;
		this.progressID = "progress_AX_"+AXUtil.timekey();
		var progressID = this.progressID;
		this.progressStop = false;
		var theme = config.theme;
		
		var hasCancel = false;
		
		if(config.options){
			if(config.options.totalCount) totalCount = config.options.totalCount;
			if(config.options.width) progressWidth = config.options.width;
			if(config.options.top) progressTop = config.options.top;
			if(config.options.title) progressTitle = config.options.title;
			if(config.options.cancel) hasCancel = config.options.cancel;
			if(config.options.theme) theme = config.options.theme;
		}

		var po = [];
		po.push("<div class=\"AXprogressTray "+theme+"\" id=\""+progressID+"_AX_tray\" align=\"center\" style=\"top:"+progressTop+"px;\">");
		if(progressTitle != ""){
			po.push("	<div class=\"AXprogressTitle\" id=\""+progressID+"_AX_title\" style=\"width:"+progressWidth+"px;\" align=\"left\">"+progressTitle+"</div>");
		}
		po.push("<div class=\"AXprogress\" id=\""+progressID+"\" style=\"width:"+progressWidth+"px;\">");
		po.push("	<div class=\"AXprogressContainer\" id=\""+progressID+"_AX_container\" align=\"left\" style=\"overflow:hidden;\">");
		if(theme == "AXlineProgress") po.push("		<div class=\"AXprogressBar\" id=\""+progressID+"_AX_bar\" style=\"width:"+loadedRate+"%;\"></div>");
		else  po.push("		<div class=\"AXprogressBar\" id=\""+progressID+"_AX_bar\"></div>");

		po.push("	</div>");

        po.push("    <div class=\"AXprogressLoadedText\" id=\""+progressID+"_AX_loadedText\">"+loadedRate+"%</div>");

		if(hasCancel){
			po.push(" <a href=\"#axexec\" id=\""+progressID+"_AX_cancel\" class=\"AXprogressCancel\">Cancel</a>");
		}

		po.push("</div>");
				
		po.push("</div>");
		this.progress = jQuery(po.join(''));
		jQuery(document.body).append(this.progress);
		
		jQuery("#"+progressID+"_AX_cancel").bind("click", this.cancel.bind(this));
        this.loadedCount = 1;
		this.update();
	},
	update: function(){
		var config = this.config;
		var theme = config.theme;
		
		if(this.progressStop) return;

		var totalCount = config.totalCount || 100;

		if(config.options){
			if(config.options.totalCount) totalCount = config.options.totalCount;
			if(config.options.theme) theme = config.options.theme;
		}
		
		var loadedCount = this.loadedCount;
		
		var progressID = this.progressID;
		var loadedRate = ((loadedCount-1) / (totalCount.number()) * 100).round(1);
		if(loadedRate > 100) loadedRate = 100;
		jQuery("#"+progressID+"_AX_loadedText").html(loadedRate+"%<span>"+(loadedCount-1).money()+"/"+totalCount.money()+"</span>");
		
		if(theme == "AXlineProgress"){
			jQuery("#"+progressID+"_AX_bar").animate(
				{width:loadedRate+"%"},
				config.duration, "", 
				function(){
					if(config.callBack){
						config.callBack.call({
							totalCount:totalCount,
							loadedCount:loadedCount,
							loadedRate:(loadedCount / (totalCount.number()+1) * 100).round(1),
							isEnd:((loadedCount-1) == totalCount)
						});
					}
				}
			);
		}else{
			//circle
			setTimeout(function(){
				jQuery("#"+progressID+"_AX_bar").addClass("percent"+((loadedCount / (totalCount.number()) * 100).round(0) / 5).round() * 5);
				if(config.callBack){
					config.callBack.call({
						totalCount:totalCount,
						loadedCount:loadedCount-1,
						loadedRate:(loadedCount / (totalCount.number()+1) * 100).round(1),
						isEnd:((loadedCount-1) == totalCount)
					});
				}				
			}, config.duration);
		}
		this.loadedCount++;
	},
	cancel: function(){
		var config = this.config;
		var progressID = this.progressID;
		var cancelMSg = AXConfig.AXProgress.cancelMsg;
		if(config.options){
			var cancel = config.options.cancel;
			if(cancel.confirmMsg) cancelMSg = cancel.confirmMsg;
			if(confirm(cancelMSg)){
				this.progressStop = true;
				var totalCount = config.totalCount || 100;
				var loadedCount = this.loadedCount;
				cancel.oncancel.call({
					totalCount:totalCount,
					loadedCount:loadedCount,
					loadedRate:(loadedCount / totalCount * 100).round(1),
					isEnd:(loadedCount == totalCount)
				});
			}else{
				
			}
		}
	},
	restart: function(){
		this.progressStop = false;
		this.update();
	},
	close: function(){
		var config = this.config;
		var progressID = this.progressID;
		jQuery("#"+progressID+"_AX_tray").remove();
	}
});