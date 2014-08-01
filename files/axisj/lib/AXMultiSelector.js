/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXMultiSelector = Class.create(AXJ, {
    version: "AXMultiSelector v1.21",
    author: "tom@axisj.com",
    logs: [
		"2013-08-01 오후 3:08:07",
		"2014-03-21 오후 2:19:52 : tom multiselect 기본값 설정 함수 추가"
	],
    initialize: function (AXJ_super) {
        AXJ_super();

    },
    init: function () {
    	var cfg = this.config;
    	jQuery("#"+cfg.targetID).bind("click", this.expandOptionBox.bind(this));
    },
    expandOptionBox: function(){
    	var cfg = this.config;
    	
    	jQuery.each(cfg.optionGroup, function (gidx, G) {
    		if (G.getOptionValue) {
    			jQuery.each(cfg.optionGroup[gidx].options, function (oidx, O) {
    				cfg.optionGroup[gidx].options[oidx].selected = false;
    			});
    		}
    	});

		var po = [];
		po.push("<div id=\""+cfg.targetID + "_AX_expandBox\" class=\"AXMultiSelector_expandBox\">");
		var boxWidth = 0;
		jQuery.each(cfg.optionGroup, function(gidx, G){
			po.push("<div id=\""+cfg.targetID + "_AX_expandScrollBox_AX_"+gidx+"\" class=\"AXMultiSelector_scrollBox\" style=\"width:"+this.width+"px;\">");
			po.push("	<div id=\""+cfg.targetID + "_AX_expandScroll_AX_"+gidx+"\" class=\"AXMultiSelector_scroll\">");
			jQuery.each(this.options, function(index, O){
				var selectedClass = (O.selected) ? " on" : "";
				po.push("<a href=\"#AXexec\" id=\""+cfg.targetID + "_AX_"+gidx+"_AX_option_AX_"+index+"\" class=\"bindSelectorNodes "+selectedClass+"\">"+ O.optionText +"</a>");
			});
			po.push("	</div>");
			po.push("</div>");
			boxWidth += (this.width + 2);
		});
		po.push("<div style=\"clear:both\"></div>");
		po.push("<div align=\"center\" style=\"padding-top:5px;\">");
		po.push("	<input type=\"button\" value=\"확인\" class=\"AXButton\" id=\""+cfg.targetID + "_AX_expandScrollBox_AX_confirm\" />");
		po.push("	<input type=\"button\" value=\"취소\" class=\"AXButton\" id=\""+cfg.targetID + "_AX_expandScrollBox_AX_cancel\" />");
		po.push("</div>");
		po.push("</div>");
		axdom(document.body).append(po.join(''));
		
		boxWidth = boxWidth + (cfg.optionGroup.length * 5) + 5;
		jQuery("#"+cfg.targetID + "_AX_expandBox").css({width:boxWidth});
		
    	var css = {};
    	var offset = jQuery("#"+cfg.targetID).offset();
    	css.top = offset.top;
    	//css.left = offset.left - boxWidth + jQuery("#"+cfg.targetID).outerWidth();
    	css.left = offset.left;
    	jQuery("#"+cfg.targetID + "_AX_expandBox").css(css);


		jQuery.each(cfg.optionGroup, function(gidx, G){
			G.myUIScroll = new AXScroll();
			G.myUIScroll.setConfig({
				CT_className:"AXScrollSmall",
				targetID:cfg.targetID + "_AX_expandScrollBox_AX_"+gidx,
				scrollID:cfg.targetID + "_AX_expandScroll_AX_"+gidx,
				touchDirection:false
			});
			
			var selectedValue = "";
			if (G.getOptionValue) selectedValue = G.getOptionValue.call(G);

			jQuery.each(cfg.optionGroup[gidx].options, function (oidx, O) {
				if (G.getOptionValue) {
					if (O.optionValue == selectedValue) {
						O.selected = true;
						axdom("#" + cfg.targetID + "_AX_" + gidx + "_AX_option_AX_" + oidx).addClass("on");
						G.myUIScroll.focusElement(cfg.targetID + "_AX_" + gidx + "_AX_option_AX_" + oidx); //focus
					}
				}else if(O.selected){
					O.selected = true;
					axdom("#" + cfg.targetID + "_AX_" + gidx + "_AX_option_AX_" + oidx).addClass("on");
					G.myUIScroll.focusElement(cfg.targetID + "_AX_" + gidx + "_AX_option_AX_" + oidx); //focus
				} else {
					cfg.optionGroup[gidx].options[oidx].selected = false;
				}
			});
			
		});
		
		jQuery("#"+cfg.targetID + "_AX_expandScrollBox_AX_confirm").bind("click", function(){
			if(cfg.onChange){
				var selectObj = {};
				jQuery.each(cfg.optionGroup, function(gidx, G){
					selectObj[G.name] = {};
					jQuery.each(cfg.optionGroup[gidx].options, function(oidx, O){
						if(O.selected){
							selectObj[G.name] = O;
						}
					});
				});
				cfg.onChange.call(selectObj);
			}
			jQuery("#"+cfg.targetID + "_AX_expandBox").remove(); // 개체 삭제 처리
		});
		jQuery("#"+cfg.targetID + "_AX_expandScrollBox_AX_cancel").bind("click", function(){
			jQuery("#"+cfg.targetID + "_AX_expandBox").remove(); // 개체 삭제 처리
		});
		
		jQuery("#"+cfg.targetID + "_AX_expandBox").find(".bindSelectorNodes").bind("click", function(event){
			var idx = event.target.id.split(/_AX_/g);
			var gidx = idx[idx.length-3];
			var index = idx[idx.length-1];
			
			jQuery("#"+cfg.targetID + "_AX_"+gidx+"_AX_option_AX_"+index).addClass("on");
			
			jQuery.each(cfg.optionGroup[gidx].options, function(oidx, O){
				if(O.selected){
					jQuery("#"+cfg.targetID + "_AX_"+gidx+"_AX_option_AX_"+oidx).removeClass("on");	
					delete O.selected;
				}
			});
			cfg.optionGroup[gidx].options[index].selected = true;
			
		});
    },
    setValue: function(obj){
    	var cfg = this.config;
    	jQuery.each(cfg.optionGroup, function(gidx, G){
    		jQuery.each(obj, function(k, v){
    			if(G.name == k){
    				jQuery.each(G.options, function(){
    					if(this.optionValue+"" == v+""){
    						this.selected = true;
    					}else{
    						delete this.selected;
    					}
    				});
    				
    			}
    		});
    	});
    	
    }
});