/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXModelControlGrid = Class.create(AXJ, {
    version: "AXModelControlGrid V1.0",
    author: "tom@axisj.com",
	logs: [
		"2013-12-03 오후 5:27:18",
		"2013-12-12 오전 10:25:03"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.config.theme = "AXModelControlGrid";
    },
    init: function() {
		var cfg = this.config;
		if(Object.isUndefined(cfg.targetID)){
			trace("need targetID - setConfig({targetID:''})");
			return;
		}
		this.target = jQuery("#"+cfg.targetID);
		
		var theme = cfg.theme;
		/* grid 뼈대 그리기 ----------------------------------------------------------------------------------------------------- */
		var ol = [];
		ol.push("<div class=\"" + theme + "\" id=\"" + cfg.targetID + "_AX_grid\" style=\"\">");
		ol.push("	<div class=\"AXgridScrollBody\" id=\"" + cfg.targetID + "_AX_gridScrollBody\" style=\"z-index:2;\">");
		ol.push("		<div class=\"AXGridColHead AXUserSelectNone\" id=\"" + cfg.targetID + "_AX_gridColHead\" onselectstart=\"return false;\"></div>");
		ol.push("		<div class=\"AXGridBody\" id=\"" + cfg.targetID + "_AX_gridBody\"></div>");
		//ol.push("		<div style=\"height:13px;\"></div>");
		ol.push("	</div>");
		this.target.empty();
		this.target.append(ol.join(''));
		/* grid 뼈대 그리기 ----------------------------------------------------------------------------------------------------- */
		
		this.gridBody = jQuery("#" + cfg.targetID + "_AX_grid");
		this.scrollBody = jQuery("#" + cfg.targetID + "_AX_gridScrollBody");
		this.colHead = jQuery("#" + cfg.targetID + "_AX_gridColHead");
		this.body = jQuery("#" + cfg.targetID + "_AX_gridBody");
				
		/*colHead setting */
		this.setColHead();
		//this.scrollBody.css({height:this.scrollBody.outerHeight()+13});
		
		this.myUIScroll = new AXScroll(); // 스크롤 인스턴스 선언
		this.myUIScroll.setConfig({
			targetID : cfg.targetID + "_AX_grid",
			scrollID : cfg.targetID + "_AX_gridScrollBody",
			touchDirection : false,
			yscroll:false,
			xscroll:true
		});
		
		jQuery(window).bind("resize", this.windowResize.bind(this));
    },
	windowResizeApply: function () {
    	var cfg = this.config;
    	var bodyWidth = this.gridBody.width() - 2;
    	var colWidth = 0;
    	var astricCount = 0;
    	
		jQuery.each(cfg.colGroup, function (cidx, CG) {
			if(CG.widthAstric){
				CG.width = 0;
				CG._owidth = CG.width;
				astricCount++;
			}
			colWidth += (CG._owidth||0).number();
		});
    	this.colWidth = colWidth;
		
		var newColWidth = 0;
		/* width * 예외처리 구문 ------------ s */
		if ((bodyWidth) > (colWidth + 100 * astricCount)) {
			var remainsWidth = (bodyWidth) - colWidth;
			jQuery.each(cfg.colGroup, function (cidx, CG) {
				if (CG.widthAstric) {
					CG._owidth = remainsWidth / astricCount;
					CG.width = CG._owidth;
					colWidth += (CG._owidth||0).number();
				}
				newColWidth += CG.width.number();
			});
		}else{
			jQuery.each(cfg.colGroup, function (cidx, CG) {
				if (CG.widthAstric) {
					CG._owidth = 200;
					CG.width = 200;
					colWidth += (CG._owidth||0).number();
				}
				newColWidth += CG.width.number();
			});
		}
    	this.colWidth = newColWidth;
    	
    	jQuery.each(cfg.colGroup, function (cidx, CG) {
    		axdom("#" + cfg.targetID + "_AX_col_AX_" + cidx + "_AX_head").attr("width", this.width);
    		axdom("#" + cfg.targetID + "_AX_col_AX_" + cidx + "_AX_body").attr("width", this.width);
    	});
    	
		this.scrollBody.css({width:this.colWidth});
		
		this.colHead.find("table").css({width:this.colWidth});
		this.body.find("table").css({width:this.colWidth});
		this.myUIScroll.resizeScroll();
		this.myUIScroll.moveTo(0);
	},
	getColGroup: function (subfix) {
		var cfg = this.config;
		var po = [];
		po.push("<colgroup>");
		jQuery.each(cfg.colGroup, function (cidx, CG) {
			po.push("<col width=\"" + CG.width + "\" style=\"\" id=\"" + cfg.targetID + "_AX_col_AX_" + cidx + "_AX_" + subfix + "\" />");
		});
		po.push("</colgroup>");
		return po.join('');
	},
	getHeadItem: function (arg) {

		var cfg = this.config;
		var po = [];
		po.push("<td class=\"colHeadTd\">");
		po.push("	<div class=\"tdRelBlock\" style=\"text-align:" + (arg.align||"left") + ";\">");
		
		if(arg.html){
			var html = arg.html.call({
				rowIndex: arg.rowIndex, 
				colIndex: arg.colIndex, 
				data: arg.data
			});
			po.push(html);
		}else{
			po.push(arg.label);
		}
		
		po.push("	</div>");
		po.push("</td>");

		return po.join('');
	},
    setColHead: function(rewrite){
    	var cfg = this.config;
    	var bodyWidth = this.gridBody.width()-2;
    	var colWidth = 0;
    	var astricCount = 0;
    	
		jQuery.each(cfg.colGroup, function (cidx, CG) {
			if (!rewrite){
				if(CG.width == "*"){
					CG.width = 0;
					CG.widthAstric = true;
					astricCount++;
				}
				CG._owidth = CG.width; /* 최초의 너비값 기억 하기 */
			}else{
				if(CG.widthAstric){
					CG.width = 0;
					CG._owidth = CG.width;
					astricCount++;
				}
			}
			colWidth += (CG._owidth||0).number();
		});
    	this.colWidth = colWidth;
		
		var newColWidth = 0;
		/* width * 예외처리 구문 ------------ s */
		if ((bodyWidth) > (colWidth + 100 * astricCount)) {
			var remainsWidth = (bodyWidth) - colWidth;
			jQuery.each(cfg.colGroup, function (cidx, CG) {
				if (CG.widthAstric) {
					CG._owidth = remainsWidth / astricCount;
					CG.width = CG._owidth;
					colWidth += (CG._owidth||0).number();
				}
				newColWidth += CG.width.number();
			});
		}else{
			jQuery.each(cfg.colGroup, function (cidx, CG) {
				if (CG.widthAstric) {
					CG._owidth = 200;
					CG.width = 200;
					colWidth += (CG._owidth||0).number();
				}
				newColWidth += CG.width.number();
			});
		}
    	
    	this.colWidth = newColWidth;
		this.scrollBody.css({width:this.colWidth});
		
		var getHeadItem = this.getHeadItem.bind(this);
		
		var po = [];
		po.push("<table class=\"colHeadTable\" style=\"width:" + this.colWidth + "px;\">");
		po.push(this.getColGroup("head")); /*colGroup 삽입 */
		po.push("<tbody>");
		po.push("<tr>");
		var colCount = 0;
		jQuery.each(cfg.colGroup, function (CHidx, CH) {
			po.push(getHeadItem({
				rowIndex:0, colIndex:CHidx, 
				align: CH.align,
				label:CH.label, html:CH.html, data:CH.data
			}));
			colCount += CH.colspan;
		});
		po.push("</tr>");
		po.push("</tbody>");
		po.push("</table>");
		
		this.colHead.empty();
		this.colHead.append(po.join(''));
    },
    setList: function(list){
    	var cfg = this.config;
		this.list = list;
		this.printList();
		//this.scrollBody.css({height:this.scrollBody.outerHeight()+13});
		
		this.myUIScroll.resizeScroll();
    },
    appendList: function(item){
    	var cfg = this.config;
    	this.list.push(item);

    	var lidx = this.list.length-1;
    	this.printItem(lidx, this.list[lidx]);
    	this.printFootItem();
    	
    	this.myUIScroll.resizeScroll();
    },
    getItem: function(arg, update){
    	var cfg = this.config;
		var po = [];
		if(update == undefined) po.push("<td class=\"bodyTd\">");
		po.push("	<div class=\"tdRelBlock\" style=\"text-align:" + (arg.align||"left") + ";\">");
		
		if(arg.html){
			var html = arg.html.call({
				rowIndex: arg.rowIndex, 
				colIndex: arg.colIndex, 
				data: arg.data,
				item:this.list[arg.rowIndex], list:this.list
			});
			po.push(html);
		}else{
			po.push("&nbsp;");
		}
		
		po.push("	</div>");;
		if(update == undefined) po.push("</td>");

		return po.join('');
    },
    printList: function(){
    	var cfg = this.config;
    	var printItem = this.printItem.bind(this);
    	
		var po = [];
		po.push("<table class=\"gridBodyTable\" style=\"width:" + this.colWidth + "px;\">");
		po.push(this.getColGroup("body")); /*colGroup 삽입 */
		po.push("<tbody>");
		po.push("</tbody>");
		po.push("<tfoot>");
		po.push("</tfoot>");
		po.push("</table>");
		
		this.body.empty();
		this.body.append(po.join(''));

		jQuery.each(this.list, function(lidx, L){
			printItem(lidx, L);
		});

		this.printFootItem();
    },
    printItem: function(lidx, L, update, event){
    	var cfg = this.config;
    	var getItem = this.getItem.bind(this);
    	var AXbindOnchange = this.AXbindOnchange.bind(this);
    	var _body = this.body.find("tbody");
    	
		var tr = [];
		if(update == undefined) tr.push("<tr class='modelControlTR' id='" + cfg.targetID + "_tbodyTR_" + lidx + "'>");
		
		jQuery.each(cfg.body.form, function (fidx, form) {
			tr.push(getItem({
				rowIndex:lidx, colIndex:fidx, 
				align:form.align,
				html:form.html, data:form.data
			}));
		});
		if(update == undefined) tr.push("</tr>");
		if(update == undefined){
			_body.append(tr.join());
		}else{
			_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).html(tr.join(''));
		}
		
		var oncursorKeyup = this.oncursorKeyup.bind(this);
		
		jQuery.each(cfg.body.form, function(fidx, form) {
			if(form.AXBind){
				var bindID = form.AXBind.id.replace(/@rowIndex/g, lidx);
				var myConfig = AXUtil.copyObject(form.AXBind.config);
				jQuery.each(myConfig, function(k, v){
					if(Object.isString(v)) myConfig[k] = v.replace(/@rowIndex/g, lidx);
				});

				myConfig.onchange = function(){
					AXbindOnchange(lidx, fidx, this);
				};
				
				if(form.AXBind.type == "TwinDate"){
					jQuery("#"+bindID).bindTwinDate(myConfig);
				}else if(form.AXBind.type == "Date"){
					jQuery("#"+bindID).bindDate(myConfig);
				}else if(form.AXBind.type == "Select"){
					jQuery("#"+bindID).unbindSelect();
					jQuery("#"+bindID).bindSelect(myConfig);
					if(cfg.cursorFocus){
						jQuery("#"+bindID).bindSelectGetAnchorObject().bind("keydown.AXModelControlGrid", function(event){
							setTimeout(function(){
								oncursorKeyup(jQuery("#"+bindID), event, lidx);
							}, 10);
						});
					}
				}else if(form.AXBind.type == "Selector"){
					jQuery("#"+bindID).bindSelector(myConfig);
				}else if(form.AXBind.type == "Money"){
					jQuery("#"+bindID).bindMoney(myConfig);
				}
			}
		});

		if(cfg.cursorFocus){
			_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea").unbind("keydown.AXModelControlGrid").bind("keydown.AXModelControlGrid", function(event){
				setTimeout(function(){
					oncursorKeyup(jQuery(event.target), event, lidx);
				}, 10);
			});
		}
		
		var printFootItem = this.printFootItem.bind(this);
		var _this = this;
		_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea").unbind("change.AXModelControlGrid").bind("change.AXModelControlGrid", function(){
			_this.list[lidx][this.name] = axdom(this).val();
			printFootItem();
		});
		//_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=checkbox],input[type=radio]")
		
    	if(update == "update"){
			//printFootItem();
    	}
    },
    oncursorKeyup: function(jQueryObj, event, lidx){
    	var cfg = this.config;
    	
    	if(!event.target) return;
    	if(event.shiftKey || event.metaKey || event.ctrlKey) return;
		var eventName = jQueryObj.get(0).name;
    	if(cfg.oncursor){
    		var axbind = jQueryObj.attr("data-axbind");
    		var direction = "";
    		if(event.keyCode == AXUtil.Event.KEY_UP) direction = "U";
    		else if(event.keyCode == AXUtil.Event.KEY_DOWN) direction = "D";
    		else if(event.keyCode == AXUtil.Event.KEY_LEFT) direction = "L";
    		else if(event.keyCode == AXUtil.Event.KEY_RIGHT) direction = "R";
    		else if(event.keyCode == AXUtil.Event.KEY_RETURN && axbind != "select") direction = "R";
    		if(cfg.oncursor.call(
    			{
    				event:event,
    				direction:direction,
    				listIndex:lidx,
    				jQueryObj:jQueryObj
    			}
    		) === false) return false;
			if(direction == "") return;
			
			if(axbind && (direction == "U" || direction == "D")) return;
			if((direction == "U" || direction == "D") && jQueryObj.get(0).tagName == "SELECT") return;
			if(direction == "U"){
				
				if(lidx == 0) return;
				this.blurItem(jQueryObj);
				var nextItemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + (lidx-1)).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
				var findItem;
				nextItemList.each(function(){
					if(this.name == eventName) findItem = this;
				});
				this.focusItem(jQuery(findItem));
			}else if(direction == "D"){
				
				if(lidx >= this.list.length-1) return;
				this.blurItem(jQueryObj);
				var nextItemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + (lidx+1)).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
				var findItem;
				nextItemList.each(function(){
					if(this.name == eventName) findItem = this;
				});
				this.focusItem(jQuery(findItem));
				
			}else if(direction == "L"){
				
				var colIndex;
				var itemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
				itemList.each(function(cidx, item){
					if(this.name == eventName) colIndex = cidx;
				});

				if(colIndex == 0){
					if(lidx == 0) return;
					this.blurItem(jQueryObj);
					var nextItemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + (lidx-1)).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
					this.focusItem(jQuery(nextItemList.last()));
				}else{
					this.blurItem(jQueryObj);
					this.focusItem(jQuery(itemList[colIndex-1]));
				}
				
			}else if(direction == "R"){
				
				var colIndex;
				var itemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
				itemList.each(function(cidx, item){
					if(this.name == eventName) colIndex = cidx;
				});
				
				if(colIndex >= itemList.length-1){
					if(lidx >= this.list.length-1) return;
					this.blurItem(jQueryObj);
					var nextItemList = this.body.find("#" + cfg.targetID + "_tbodyTR_" + (lidx+1)).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea");
					this.focusItem(jQuery(nextItemList.first()));
				}else{
					this.blurItem(jQueryObj);
					this.focusItem(jQuery(itemList[colIndex+1]));
				}
			}
    		
    		
    	}
    	//trace(event.target.name, lidx);
    },
    blurItem: function(jQueryObj){
    	var cfg = this.config;
    	var axbind = jQueryObj.attr("data-axbind");
    	if(axbind){
    		if(axbind == "select"){
    			jQueryObj.bindSelectBlur();
    		}else if(axbind == "selector"){
    			jQueryObj.bindSelectorBlur();
    		}else{

    		}
    	}
    },
    focusItem: function(jQueryObj){
    	var cfg = this.config;
    	
    	var axbind = jQueryObj.attr("data-axbind");
    	if(axbind){
    		if(axbind == "select") jQueryObj.bindSelectFocus();
    		else if(axbind == "selector") jQueryObj.focus();
    		else jQueryObj.focus();
    	}else{
    		jQueryObj.focus();
    	}
    },
    focusIndex: function(rowIndex, colIndex){
    	var cfg = this.config;
    	//trace(rowIndex, colIndex);
    	var myTd = this.body.find("tbody tr#" + cfg.targetID + "_tbodyTR_" + rowIndex + " td:nth-child(" + (colIndex+1) + ")");
    	//trace(myTd.html());
    	var item = myTd.find("input[type=text],input[type=checkbox],input[type=radio],select,textarea").get(0);
    	item.focus();
    },
    
    AXbindOnchange: function(lidx, fidx, AXBindThis){
    	var cfg = this.config;
    	if(cfg.body.form[fidx].AXBind.onchange){
    		
    		var sendObj = {
				rowIndex: lidx, 
				colIndex: fidx,
				data: cfg.body.form[fidx].data,
				item:this.list[lidx], list:this.list
    		};
    		
    		axf.each(AXBindThis, function(k, v){
    			sendObj[k] = v;
    		});
    		
    		cfg.body.form[fidx].AXBind.onchange.call(sendObj);
    	}
    },
    
    /* foot */
    printFootItem: function(){
    	var cfg = this.config;
	
		if(!cfg.foot) return;
		if(!cfg.foot.form) return;
    	
    	var _body = this.body.find("tfoot");
    	var _list = this.list;
    	var foot = [];
		foot.push("<tr class='modelControlTR' id='" + cfg.targetID + "_tbodyTR_foot'>");
		
		jQuery.each(cfg.foot.form, function(fidx, arg){
			foot.push("<td class=\"bodyTd\" colspan=\"" + (arg.colspan || 1) + "\">");
			foot.push("	<div class=\"tdRelBlock\" style=\"text-align:" + (arg.align||"left") + ";\">");
			
			if(arg.html){
				var html = arg.html.call({
					rowIndex: 0, 
					colIndex: fidx, 
					data: arg.data,
					list:_list
				});
				foot.push(html);
			}else{
				foot.push("&nbsp;");
			}
			
			foot.push("	</div>");
			foot.push("</td>");
		});
		
		foot.push("</tr>");
		
		_body.empty();
		_body.append(foot.join(''));
		
    },
    updateItem: function(lidx, item, onlyDataChane, event){
    	var cfg = this.config;
    	var getItem = this.getItem.bind(this);
    	
    	this.list[lidx] = AXUtil.overwriteObject(this.list[lidx], item, true);
    	if(!onlyDataChane) this.printItem(lidx, this.list[lidx], "update", event);
    	else{
    		
			
			var _body = this.body;
			jQuery.each(cfg.body.form, function (fidx, form) {
				if(form.updateReload){
					var td = getItem({
						rowIndex:lidx, colIndex:fidx, 
						align:form.align,
						html:form.html, data:form.data
					}, "update");
					var myTD = jQuery(_body.find("tbody tr#" + cfg.targetID + "_tbodyTR_" + lidx + " td").get(fidx));
					myTD.html(td);
				}
			});
			
			var oncursorKeyup = this.oncursorKeyup.bind(this);
			if(cfg.cursorFocus){
				_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],input[type=checkbox],input[type=radio],select,textarea").unbind("keyup.AXModelControlGrid").bind("keyup.AXModelControlGrid", function(event){
					oncursorKeyup(jQuery(event.target), event, lidx);
				});
			}
    		
    	}
    	
    	
    	this.printFootItem();
    },
    removeItem: function(collectIdx){
    	var cfg = this.config;

    	var newList = [];
    	axf.each(this.list, function(lidx, L){
	    	if(Object.isArray(collectIdx)){
	    		var isOk = true;
	    		axf.each(collectIdx, function(){
	    			if(this == lidx) isOk = false;
	    		});
	    		if(isOk) newList.push(L);
	    	}else{
	    		if(collectIdx != lidx) newList.push(L);
	    	}    		
    	});

		this.setList(newList);
    },
    getValue: function(name){
    	var cfg = this.config;
    	var returnValues = [];
    	this.body.find("input[type=checkbox][name="+name+"]").each(function(){
    		returnValues.push(this.value);
    	});
    	return returnValues;
    },	
    getCheckedValue: function(name){
    	var cfg = this.config;
    	var returnValues = [];
    	this.body.find("input[type=checkbox][name="+name+"]:checked").each(function(){
    		returnValues.push(this.value);
    	});
    	return returnValues;
    },
    getList: function(){
    	var cfg = this.config;
    	
    	var _body = this.body.find("tbody");
    	axf.each(this.list, function(lidx, L){
    		
    		var item = {};
    		_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=text],select,textarea").each(function(){
    			item[this.name] = axdom(this).val();
    		});
    		
    		var checkNames = {};
    		_body.find("#" + cfg.targetID + "_tbodyTR_" + lidx).find("input[type=checkbox],input[type=radio]").each(function(){
    			if(this.type == "checkbox"){
    				if(checkNames[this.name]){
    					checkNames[this.name].count += 1;
    				}else{
    					checkNames[this.name] = {name:this.name, count:1};
    					item[this.name] = "";
    				}
    			}
    			if(this.checked){
    				if(this.type == "checkbox"){
		    			if(item[this.name]){
		    				item[this.name].push(this.value);
		    			}else{
		    				item[this.name] = [this.value];
		    			}
		    		}else{
		    			item[this.name] = this.value;
		    		}
	    		}
    		});

    		jQuery.each(checkNames, function(k, v){
    			if(v.count == 1){
    				if(Object.isArray(item[v.name])){
    					item[v.name] = item[v.name].join(",");
    				}
    			}
    		});
    		
    		L = AXUtil.overwriteObject(L, item, true);
    	});
    	
    	return this.list;
    	
    	/*
    	this.body.find("tr.modelControlTR").each(function(trIndex, TR){
    		trace(trIndex);
    	});
    	*/
    }
});

