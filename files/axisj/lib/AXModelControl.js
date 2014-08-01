/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXModelControl = Class.create(AXJ, {
    version: "AXModelControl V0.1",
    author: "tom@axisj.com",
	logs: [
		"2013-12-03 오후 5:27:18"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.config.theme = "";
        this.config.collectSelector = "";
        this.config.subModelDetectClassName = "AXModelDetect";
        this.config.excludeClassName = "";
        this.config.cursorFocus = false;
        this.returnJSData = {};
    },
    init: function() {
		var cfg = this.config;
		if(Object.isUndefined(cfg.targetID)){
			trace("need targetID - setConfig({targetID:''})");
			return;
		}
		this.target = jQuery("#"+cfg.targetID);
		//trace(this.collectItem);
		
    },
    collectModelItem: function(){
    	var cfg = this.config;
    	var finderCSS = "";
		if(cfg.collectSelector != ""){
			finderCSS = cfg.collectSelector;
		}else{
			finderCSS = "input[type=text], input[type=hidden], input[type=radio], input[type=checkbox], select, textarea";
		}
		var _this = this;
		var getParentSubModel = function(ele){
			var result = false;
			var checkEle = ele;
			var rooping = true;
			while (rooping) {
				if(!checkEle.get(0)){
					rooping = false;
					break;
				}
				if(checkEle.get(0).id == cfg.targetID){
					rooping = false;
					break;
				}else if(checkEle.parent().hasClass(cfg.subModelDetectClassName)){
					result = true;
					rooping = false;
					break;
				}else{
					checkEle = checkEle.parent();
				}
			}
			return {
				result:result,
				parents:ele.parentsUntil("#"+cfg.targetID)
			};
		};

		var collectItem = [];
		var oncursorKeyup = this.oncursorKeyup.bind(this);
		
		/*trace(finderCSS);*/		
		this.target.find(finderCSS).each(function(){
			var jQueryObj = axdom(this);
			var getSubModel = getParentSubModel(axdom(this));
			if(!getSubModel.result){
				var collectOk = false;
				if(cfg.excludeClassName != ""){
					collectOk = !jQueryObj.hasClass(cfg.excludeClassName);
				}else{
					collectOk = true;
				}
				
				if(collectOk){
					jQueryObj.attr("data-axisjModelId", collectItem.length);
					collectItem.push({
						keys:[this.name],
						jQueryObj:jQueryObj,
						axisjModelId:collectItem.length,
						name:this.name,
						type:this.type
					});
				}
			}else{
				
				jQueryObj.attr("data-axisjModelId", collectItem.length);
				
				var relationKey = [];
				jQuery.each(getSubModel.parents, function(){
					if(this.id != ""){
						if(this.id.left(cfg.subModelDetectClassName.length) == cfg.subModelDetectClassName){
							var myKey = this.id.substr(this.id.lastIndexOf("_").number()+1);
							relationKey.push(myKey);
						}
					}
				});
				relationKey.push(this.name);

				collectItem.push({
					keys:relationKey,
					jQueryObj:jQueryObj,
					axisjModelId:collectItem.length,
					name:this.name,
					type:this.type
				});
			}
			jQueryObj = null;
		});		
		
		this.collectItem = collectItem;
		
		
		
		var returnJSData = {};
		jQuery.each(this.collectItem, function(itemIndex, item){
			var keys = item.keys;
			var targetJS = returnJSData;
			
			var key;
			for(var kidx=0;kidx<keys.length-1;kidx++){
				key = keys[kidx];
				if(targetJS[key] == undefined){
					targetJS[key] = {};
				}
				targetJS = targetJS[key];
			}
			key = keys.last();
			
			var nVal = "";
			if(targetJS[key] == undefined){
				if(this.type == "checkbox"){
					var keyLength = 0;
					jQuery.each(collectItem, function(){
						if(this.keys.join(".") == keys.join(".")) keyLength++;
					});
					if(keyLength == 1){
						targetJS[key] = "";
					}else{
						targetJS[key] = [];
					}
				}else{
					targetJS[key] = "";
				}
				this.keySeq = 0;
			}else{
				if(Object.isArray(targetJS[key])){
					if(this.type != "checkbox"){
						targetJS[key].push(nVal);
						this.keySeq = targetJS[key].length-1;
						//this.keys[this.keys.length-1] += "["+ this.keySeq +"]";
					}
				}else{
					var oVal = targetJS[key];
					if(this.type == "radio"){
						
					}else if(this.type == "checkbox"){
						var keyLength = 0;
						jQuery.each(collectItem, function(){
							if(this.keys.join(".") == keys.join(".")) keyLength++;
						});
						if(keyLength == 1){
							targetJS[key] = oVal;
						}else{
							targetJS[key] = [oVal];
							targetJS[key].push(nVal);
							this.keySeq = targetJS[key].length-1;
						}
					}else{
						targetJS[key] = [oVal];
						targetJS[key].push(nVal);
						this.keySeq = targetJS[key].length-1;
						//this.keys[this.keys.length-1] += "["+ this.keySeq +"]";
					}
				}
			}
			
			
			
			if(cfg.cursorFocus){
	
				var jQueryObj = item.jQueryObj;

				//trace(jQueryObj.attr("data-axbind"));

				if(jQueryObj.attr("data-axbind") == "select"){
					jQueryObj.bindSelectGetAnchorObject().unbind("keydown.AXModelControl").bind("keydown.AXModelControl", function(event){
						setTimeout(function(){
							oncursorKeyup(jQueryObj, event, itemIndex);
						}, 10);
					});
				}else{
					jQueryObj.unbind("keydown.AXModelControl").bind("keydown.AXModelControl", function(event){
						setTimeout(function(){
							oncursorKeyup(jQueryObj, event, itemIndex);
						}, 10);
						//if (event.preventDefault) event.preventDefault();
						//if (event.stopPropagation) event.stopPropagation();
						//event.cancelBubble = true;
						//return false;						
					});
				}

			}
		});
		this.returnJSData = returnJSData;
    },
    sync: function(){
		var cfg = this.config;
		if(!this.collectItem) this.collectModelItem();
    },
    clearCollect: function(){
    	this.collectItem = undefined;
    },
    getData: function(){
		var cfg = this.config;
		this.sync();
		var getElementValue = function(jQueryObj, type){
			if(type == "radio" || type == "checkbox"){
				if(jQueryObj.get(0).checked){
					return jQueryObj.val();
				}
			}else{
				return jQueryObj.val();
			}
		};
		
		var returnJSData = this.returnJSData;
		
		var collectItem = this.collectItem;
		jQuery.each(this.collectItem, function(){
			var keys = this.keys;
			var targetJS = returnJSData;
			var key;
			for(var kidx=0;kidx<keys.length-1;kidx++){
				key = keys[kidx];
				if(targetJS[key] == undefined){
					targetJS[key] = {};
				}
				targetJS = targetJS[key];
			}
			key = keys.last();
			if(this.type == "checkbox"){
				var keyLength = 0;
				jQuery.each(collectItem, function(){
					if(this.keys.join(".") == keys.join(".")) keyLength++;
				});
				if(keyLength > 1) targetJS[key] = [];
				else targetJS[key] = "";
			}
		});
		
		jQuery.each(this.collectItem, function(){
			var keys = this.keys;
			var targetJS = returnJSData;
			
			var key;
			for(var kidx=0;kidx<keys.length-1;kidx++){
				key = keys[kidx];
				if(targetJS[key] == undefined){
					targetJS[key] = {};
				}
				targetJS = targetJS[key];
			}
			key = keys.last();
			
			var nVal = getElementValue(this.jQueryObj, this.type);
			if(this.type == "checkbox"){
				if(!AXUtil.isEmpty(nVal)){
					var keyLength = 0;
					jQuery.each(collectItem, function(){
						if(this.keys.join(".") == keys.join(".")) keyLength++;
					});
					if(keyLength > 1) targetJS[key].push(nVal);
					else targetJS[key] = nVal;
				}
			}else if(this.type == "radio"){
				if(!AXUtil.isEmpty(nVal)){
					targetJS[key] = nVal;
				}
			}else{
				if(Object.isArray(targetJS[key])){
					targetJS[key][this.keySeq] = nVal;
				}else{
					targetJS[key] = nVal;
				}
			}
		});
		this.returnJSData = returnJSData;
		return Object.clone(this.returnJSData);
    },
    setData: function(jsPathObj, val){
		if(Object.isString(val) || Object.isArray(val) || Object.isNumber(val) ){
			this.applyValue(jsPathObj, val);
		}else{
			var applyValue = this.applyValue.bind(this);
			var fnApplyValue = function(prefixKey, _val, depth){
				if(depth > 5) return; /* 만약의 경우를 대비하여 10 뎁스 이상 연산 처리 하지 않습니다. 무한 루프를 방지 */
				if(prefixKey != "") prefixKey += ".";
				axf.each(_val, function(k, v){
					if(Object.isString(v) || Object.isArray(v) || AXUtil.isEmpty(v) || Object.isNumber(v) ){
						applyValue({key:prefixKey + k}, v);
					}else{
						fnApplyValue(prefixKey+k, v, (depth+1));
					}
				});
			};
			fnApplyValue("", val, 0);
		}
		return true;
    },
    applyValue: function(jsPathObj, val){
		var cfg = this.config;
		this.getData();
		var returnJSData = this.returnJSData;
		if(jsPathObj.key){
			try{
				eval("returnJSData = returnJSData." + jsPathObj.key);
			}catch(e){
				trace(e);
			}
		}
		
		if(returnJSData != undefined){
			if(Object.isString(val) || Object.isNumber(val)){
				
				var findedItem = false;
				jQuery.each(this.collectItem, function(){
					if(this.keys.join(".") == jsPathObj.key){
						if(jsPathObj.keySeq != undefined){
							if(jsPathObj.keySeq == this.keySeq){
								this.jQueryObj.val(val);
								findedItem = true;
								return false;
							}
						}else{
							if(this.type == "radio" || this.type == "checkbox"){
								if(this.jQueryObj.get(0).value == val){
									this.jQueryObj.get(0).checked = true;
									findedItem = true;
								}else{
									this.jQueryObj.get(0).checked = false;
									findedItem = true;
								}
							}else{
								this.jQueryObj.val(val);
								findedItem = true;
								return false;	
							}
						}
					}
				});

				if(!findedItem){
					return {error:"not found keySeq"};
				}

			}else if(Object.isArray(val)){
				
				var findedItem = false;
				jQuery.each(this.collectItem, function(){
					if(this.keys.join(".") == jsPathObj.key){
						if(jsPathObj.keySeq != undefined){
							if(jsPathObj.keySeq == this.keySeq){
								this.jQueryObj.val(val.join(","));
								findedItem = true;
								return false;
							}else{
								
							}
						}else{
							if(this.type == "checkbox" || this.type == "radio"){
								var jQueryObj = this.jQueryObj;
								if(val.length == 0){
									jQueryObj.get(0).checked = false;
								}else{
									jQueryObj.get(0).checked = false;
									axf.each(val, function(){
										if(jQueryObj.get(0).value == this){
											jQueryObj.get(0).checked = true;
										}
									});
								}
								findedItem = true;
							}else{

								if(val[this.keySeq] != undefined){
									this.jQueryObj.val(val[this.keySeq]);
									findedItem = true;
								}
								//return false;
							}
						}
					}
				});

				if(!findedItem){
					return {error:"not found keySeq"};
				}
				
			}
		}
		
		return true;
    },
    
    /* cursorFocus */
    oncursorKeyup: function(jQueryObj, event, itemIndex){
    	var cfg = this.config;
    	if(event.ctrlKey) return;
    	if(cfg.oncursor){
    		// AXBind 된 경우에는 위아래 사용을 제한 해야함. 2014-01-04 오후 5:57:24
    		var axbind = jQueryObj.attr("data-axbind");
    		var htmlTag = jQueryObj.get(0).type;
    		var direction = "";
    		if(event.keyCode == AXUtil.Event.KEY_UP) direction = "U";
    		else if(event.keyCode == AXUtil.Event.KEY_DOWN) direction = "D";
    		else if(event.keyCode == AXUtil.Event.KEY_LEFT) direction = "L";
    		else if(event.keyCode == AXUtil.Event.KEY_RIGHT) direction = "R";
    		else if(event.keyCode == AXUtil.Event.KEY_RETURN && axbind != "select" && htmlTag != "textarea") direction = "E";	
    		if(cfg.oncursor.call(
    			{
    				event:event,
    				direction:direction,
    				itemIndex:itemIndex,
    				jQueryObj:jQueryObj
    			}
    		) === false) return false;
			if(direction == "") return;
			
			//trace(jQueryObj.get(0).tagName);
			//if(axbind) return;
			if(direction == "U" || direction == "D" || direction == "L" || direction == "R") return;
			else if(direction == "E" && (event.shiftKey || event.metaKey)){
				if(itemIndex == 0){
					if(cfg.oncursorEmpty){
						cfg.oncursorEmpty({type:"indexOver", index:-1});
					}
					return;
				}
				this.blurItem(jQueryObj);
				//this.focusItem(this.collectItem[(itemIndex-1)].jQueryObj);
				
				var nextItemIndex = itemIndex-1;
				for(var ii=nextItemIndex;ii>-1;ii--){
					if(!this.collectItem[ii].jQueryObj.get(0).disabled){
						nextItemIndex = ii;
						break;
					}
				}
				this.focusItem(this.collectItem[nextItemIndex].jQueryObj);
			}else if(direction == "E"){
				if(itemIndex >= this.collectItem.length-1){
					if(cfg.oncursorEmpty){
						cfg.oncursorEmpty({type:"indexOver", index:1});
					}
					return;
				}
				this.blurItem(jQueryObj);
				
				var nextItemIndex = itemIndex+1;
				for(var ii=nextItemIndex;ii<this.collectItem.length;ii++){
					if(!this.collectItem[ii].jQueryObj.get(0).disabled){
						nextItemIndex = ii;
						break;
					}
				}
				this.focusItem(this.collectItem[nextItemIndex].jQueryObj);
			}
			
    	}
    },
    blurItem: function(jQueryObj){
    	var cfg = this.config;
    	
    	var axbind = jQueryObj.attr("data-axbind");
    	if(axbind){
    		if(axbind == "select"){
    			jQueryObj.bindSelectBlur();
    		}else if(axbind == "selector"){
    			jQueryObj.bindSelectorBlur();
    		}
    	}else{
    		//trace(jQueryObj.get(0).type);
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
    		//trace(jQueryObj.get(0).id);
    		jQueryObj.focus();
    	}
    },
    focus: function(focusIndex){
    	var cfg = this.config;
    	
    	if(focusIndex == undefined) focusIndex = 0;
    	//trace(Object.isString(focusIndex));
    	if(Object.isString(focusIndex)){
    		if(focusIndex == "first") focusIndex = 0;
    		else if(focusIndex == "last") focusIndex = this.collectItem.length-1;
    	}else{
    		if(focusIndex < 0) focusIndex = 0;
    		if(focusIndex >= this.collectItem.length) focusIndex = this.collectItem.length-1;
    	}
    	this.focusItem(this.collectItem[focusIndex].jQueryObj);
    }
});