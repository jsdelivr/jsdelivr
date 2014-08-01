/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */


/**
 * AXSelectConverter
 * @class AXSelectConverter
 * @extends AXJ
 * @version v1.58
 * @author tom@axisj.com
 * @logs
 "2012-12-19 오후 12:00:43",
 "2013-04-24 오후 5:45:44 - value change bug fix",
 "2013-06-04 오전 11:00:42 - bind 메소드 업그레이드",
 "2013-07-26 오후 1:14:16 - bind, unbind, bindSetConfig 픽스",
 "2013-08-21 오후 4:45:02 - 연속 appendAnchor 버그픽스",
 "2013-08-23 오후 8:14:22 - expandBox 포지션 가변 처리",
 "2013-09-06 오전 10:08:28 - bindSelect % 버그픽스",
 "2013-09-27 오후 1:29:14 - onLoad 추가 : tom",
 "2013-10-02 오후 6:15:38 - bindSelectDisabled 기능 추가 : tom",
 "2013-10-24 오후 5:54:05 - resizeAnchor 기능 추가 : tom",
 "2013-11-06 오후 12:47:53 - tabindex 속성 가져오기 기능 추가 : tom",
 "2013-11-27 오후 8:03:57 - tom : positionFixed 기능 추가",
 "2013-12-09 오후 7:03:57 - tom : bindSelectUpdate 기능추가",
 "2014-01-10 오후 5:08:59 - tom : event modify & bugFix",
 "2014-03-11 오전 11:08:54 - tom : add bindSelectGetValue ",
 "2014-03-18 오후 10:09:21 - tom : select 포커스 후 키입력 하면 optionValue를 비교하여 선택처리 기능 구현 - 2차버전에 한글 포커스 밑 optionText 비교 처리 구문 추가",
 "2014-03-27 오후 3:38:25 - tom : onchange 함수가 setValue 속성을 부여해야만 작동하던 것을 무조건 작동 하도록 변경",
 "2014-03-31 오후 4:41:18 - tom : 셀렉트 포커스 된 상태에서 키 입력하면 입력된 값으로 select 처리 하기 (현재 영문만)",
 "2014-04-10 오후 6:09:44 - tom : appendAnchor, alignAnchor 방식 변경 및 크기 버그 픽스 & select element hide 에서 투명으로 변경",
 "2014-04-18 - tom : mobile 브라우저 버그 픽스"
 "2014-05-21 tom : resize event 상속"
 "2014-06-02 tom : change ajax data protocol check result or error key in data"
 "2014-07-02 tom : bindSelect for Array support setValue attribute"
 "2014-07-09 tom : bindSelect for AJAX then serialObject not working"
 "2014-07-14 tom : direct align when window resize and add method 'bindSelectAddOptions', 'bindSelectRemoveOptions'"
 "2014-07-25 tom : support chaining 'method bind..'"
 *
 */

var AXSelectConverter = Class.create(AXJ, {
	initialize: function (AXJ_super) {
		AXJ_super();
		this.objects = [];
		this.config.anchorClassName = "AXanchor";
		this.config.anchorSelectClassName = "AXanchorSelect";
	},
	init: function () {
		var browser = AXUtil.browser;
		this.isMobile = browser.mobile;
		//axdom(window).resize(this.windowResize.bind(this));
		axdom(window).resize(this.alignAllAnchor.bind(this));
	},
	windowResize: function () {
		// 사용안함
		var windowResizeApply = this.windowResizeApply.bind(this);
		if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
		this.windowResizeObserver = setTimeout(function () {
			windowResizeApply();
		}, 10);
	},
	windowResizeApply: function(){
		// 사용안함
		if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
		this.alignAllAnchor();
	},
	alignAllAnchor: function () {
		for(var i=0;i<this.objects.length;i++){
			this.alignAnchor(this.objects[i].id, i);
		}
	},
	bindSetConfig: function (objID, configs) {
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		}
		if (findIndex == null) {
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
		} else {
			var _self = this.objects[findIndex];
			jQuery.each(configs, function (k, v) {
				_self.config[k] = v;
			});
		}
	},
	unbind: function (obj) {
		//var collect = [];
		var removeAnchorId;
		var removeIdx;
		//trace(this.objects);
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id != obj.id) {
				// collect.push(this);

			} else {
				if (O.isDel != true) {
					removeAnchorId = O.anchorID;
					removeIdx = index;
				}
			}
		}
		//this.objects = collect;

		if (removeAnchorId) {
			var objDom = axdom("#" + obj.id), objAnchorDom = axdom("#" + removeAnchorId);
			this.objects[removeIdx].isDel = true;
			objDom.removeAttr("data-axbind");
			if (this.isMobile) {
				objAnchorDom.before(jQuery("#" + obj.id));
				objAnchorDom.remove();
			} else {
				objAnchorDom.remove();
				objDom.show();
			}
		}
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

		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				objSeq = index;
				break;
			}
		}

		if (obj.href == undefined) obj.href = cfg.href;

		if (objSeq == null) {
			objSeq = this.objects.length;
			this.objects.push({ id: objID, anchorID: cfg.targetID + "_AX_" + objID, config: obj });
		} else {
			this.objects[objSeq].isDel = undefined;
			this.objects[objSeq].config = obj;
		}

		this.appendAnchor(objID, objSeq);
		this.bindSelect(objID, objSeq);
		this.windowResize();

	},
	appendAnchor: function (objID, objSeq) {
		var cfg = this.config, _this = this;
		var obj = this.objects[objSeq];

		if (AXgetId(cfg.targetID + "_AX_" + objID)) {
			jQuery("#" + cfg.targetID + "_AX_" + objID).remove();
		}
		var anchorNode = jQuery("<div id=\"" + cfg.targetID + "_AX_" + objID + "\" class=\"" + cfg.anchorClassName + "\" style=\"display:none;\"></div>");
		var iobj = jQuery("#" + objID);
		iobj.attr("data-axbind", "select");
		if(this.isMobile) iobj.before(anchorNode);
		else iobj.after(anchorNode);

		var iobjPosition = iobj.position();
		var l = iobjPosition.left, t = iobjPosition.top, w = 0, h = 0;

		w = iobj.outerWidth();
		h = iobj.outerHeight();

		var css = { left: l, top: t, width: w, height: h }, objDom = axdom("#" + cfg.targetID + "_AX_" + objID);
		objDom.css(css);
		objDom.data("height", h);

		obj.iobj = iobj;
		obj.objDom = objDom;
		// TODO : obj에 iobj, objDom 연결
	},
	alignAnchor: function (objID, objSeq){
		var cfg = this.config, _this = this;
		var obj = this.objects[objSeq];

		var iobj = obj.iobj;
		var iobjPosition = iobj.position();
		var l = iobjPosition.left, t = iobjPosition.top, w = 0, h = 0;

		var borderW = iobj.css("border-left-width").number();
		var borderT = iobj.css("border-top-width").number();
		var borderB = iobj.css("border-bottom-width").number();
		var marginW = iobj.css("margin-left").number();
		var marginH = iobj.css("margin-top").number();
		l = l + marginW;

		//t = t;
		w = iobj.outerWidth();
		h = iobj.outerHeight();

		var css = { left: l, top: t, width: w, height: h };
		obj.objDom.css(css);
		obj.objDom.data("height", h);

		obj.objDom.find("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBox").css({width:w, height:h});
		obj.objDom.find("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox").css({height:(h-(borderT+borderB))+"px"});

		obj.objDom.find("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectText").css({"line-height":(h-(borderT+borderB))+"px"});
		obj.objDom.find("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow").css({height:h});
	},
	bindSelect: function (objID, objSeq) {
		var cfg = this.config, _this = this;
		var obj = this.objects[objSeq];

		var iobj = obj.iobj;
		var objDom = obj.objDom;
		if(!obj.config.onChange) obj.config.onChange = obj.config.onchange;

		var w = objDom.width();
		var h = objDom.data("height");
		var borderT = iobj.css("border-top-width").number();
		var borderB = iobj.css("border-bottom-width").number();
		//trace(obj.config);

		var fontSize = iobj.css("font-size").number();
		var tabIndex = iobj.attr("tabindex");

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SelectBox\" class=\"" + cfg.anchorSelectClassName + "\" style=\"width:" + w + "px;height:" + h + "px;\">");
		po.push("<a " + obj.config.href + " class=\"selectedTextBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox\" style=\"height:" + (h - (borderT+borderB)) + "px;\"");
		if(tabIndex != undefined) po.push(" tabindex=\""+tabIndex+"\"");
		po.push(">");
		po.push("	<span class=\"selectedText\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SelectText\" style=\"line-height:" + (h - (borderT+borderB)) + "px;padding:0px 4px;font-size:" + fontSize + "px;\"></span>");
		po.push("	<span class=\"selectBoxArrow\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow\" style=\"height:" + h + "px;\"></span>");
		po.push("</a>");
		po.push("</div>");

		//append to anchor
		objDom.empty();
		objDom.append(po.join(''));
		objDom.show();

		var objDom_selectTextBox = objDom.find("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox");

		obj.selectedIndex = AXgetId(objID).options.selectedIndex;
		var options = [];
		for (var oi = 0; oi < AXgetId(objID).options.length; oi++) {
			options.push({ optionValue: AXgetId(objID).options[oi].value, optionText: AXgetId(objID).options[oi].text.enc() });
		}
		obj.options = AXUtil.copyObject(options);

		if (this.isMobile) {

			// mobile 브라우저인 경우
			iobj.css({opacity:0});
			var bindSelectChange = this.bindSelectChange.bind(this);
			obj.objOnChange = function () {
				bindSelectChange(objID, objSeq);
			};

			objDom_selectTextBox.bind("click.AXSelect", function (event) {
				jQuery("#" + objID).click();
			});

			iobj.addClass("rootSelectBox");
			iobj.bind("change.AXSelect", obj.objOnChange);

		} else {
			//AXUtil.alert(obj.options);

			// PC 브라우저인 경우
			iobj.css({opacity:0});
			var bindSelectExpand = this.bindSelectExpand.bind(this);
			var bindSelectClose = this.bindSelectClose.bind(this);

			objDom_selectTextBox.bind("click.AXSelect", function (event) {
				jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox").focus();
				bindSelectExpand(objID, objSeq, true, event);
			});

			objDom_selectTextBox.bind("keydown.AXSelect", function (event) {
				if(event.keyCode == AXUtil.Event.KEY_SPACE) bindSelectExpand(objID, objSeq, true, event);
				if(event.keyCode == AXUtil.Event.KEY_TAB || event.keyCode == AXUtil.Event.KEY_RETURN) return;
				//trace(String.fromCharCode(event.keyCode));

				if(_this.selectTextBox_onkeydown_obj){
					clearTimeout(_this.selectTextBox_onkeydown_obj);
					_this.selectTextBox_onkeydown_data += String.fromCharCode(event.keyCode);
				}else{
					_this.selectTextBox_onkeydown_data = String.fromCharCode(event.keyCode);
				}

				_this.selectTextBox_onkeydown_obj = setTimeout(function(){
					_this.selectTextBox_onkeydown(objID, objSeq, event);
				}, 300);
			});
		}

		if (obj.config.ajaxUrl) {

			var bindSelectChangeBind = this.bindSelectChange.bind(this);
			var bindSelectChange = function () {
				bindSelectChangeBind(objID, objSeq);
			};

			var url = obj.config.ajaxUrl;
			var pars = obj.config.ajaxPars;
			obj.selectedIndex = null;

			//jQuery("#" + objID).empty(); serialObject 검색안됨
			iobj.html("<option></option>");

			obj.inProgress = true; //진행중 상태 변경

			var async = (obj.config.ajaxAsync == undefined) ? true : obj.config.ajaxAsync;
			new AXReq(url, {
				debug: false, async: async, pars: pars, onsucc: function (res) {
					if ((res.result && res.result == AXConfig.AXReq.okCode) || (res.result == undefined && !res.error)) {

						//trace(res);
						var po = [];
						if (obj.config.isspace) {
							po.push("<option value=\"\">" + obj.config.isspaceTitle + "</option>");
						}
						for (var opts, oidx = 0; (oidx < res.options.length && (opts = res.options[oidx])); oidx++) {
							po.push("<option value=\"" + opts.optionValue + "\"");
							//if(obj.selectedIndex == oidx) po.push(" selected=\"selected\"");
							if (obj.config.setValue == opts.optionValue || opts.selected) po.push(" selected=\"selected\"");
							po.push(">" + opts.optionText.dec() + "</option>");
						};
						jQuery("#" + objID).html(po.join(''));

						var options = [];
						for (var oi = 0; oi < AXgetId(objID).options.length; oi++) {
							options.push({ optionValue: AXgetId(objID).options[oi].value, optionText: AXgetId(objID).options[oi].text.enc() });
						}
						obj.options = AXUtil.copyObject(options);
						obj.selectedIndex = AXgetId(objID).options.selectedIndex;

						if (obj.config.onChange) {
							obj.config.focusedIndex = obj.selectedIndex;
							obj.config.selectedObject = obj.options[obj.selectedIndex];
							obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
						}

						bindSelectChange();

						if (obj.config.onLoad) {
							obj.config.onLoad.call(res);
						}

					} else {
						//trace(res);
					}
					obj.inProgress = false;
				}
			});

		} else if (obj.config.options) {

			var po = [];
			if (obj.config.isspace) {
				po.push("<option value=\"\">" + obj.config.isspaceTitle + "</option>");
			}

			for (var opts, oidx = 0; (oidx < obj.config.options.length && (opts = obj.config.options[oidx])); oidx++) {
				var optionText = (opts.optionText||"").dec();
				po.push("<option value=\"" + opts.optionValue + "\"");
				if (obj.config.setValue == opts.optionValue || obj.selectedIndex == oidx) po.push(" selected=\"selected\"");
				po.push(">" + optionText + "</option>");
			};
			iobj.html(po.join(''));

			var options = [];
			for (var oi = 0; oi < AXgetId(objID).options.length; oi++) {
				options.push({ optionValue: AXgetId(objID).options[oi].value, optionText: AXgetId(objID).options[oi].text.enc() });
			}
			obj.options = AXUtil.copyObject(options);
			obj.selectedIndex = AXgetId(objID).options.selectedIndex;

			this.bindSelectChange(objID, objSeq);
			/*
			 if (obj.config.onChange) {
			 obj.config.focusedIndex = obj.selectedIndex;
			 obj.config.selectedObject = obj.options[obj.selectedIndex];
			 obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
			 }
			 */

		} else {
			this.bindSelectChange(objID, objSeq);

			/*
			 if (obj.config.onChange) {
			 var selectedOption = this.getSelectedOption(objID, objSeq);
			 if (selectedOption) {
			 var sendObj = {optionValue:selectedOption.value, optionText:selectedOption.text};
			 obj.config.onChange.call(sendObj, sendObj);
			 }
			 }
			 */

		}
	},
	selectTextBox_onkeydown: function(objID, objSeq, event){
		var cfg = this.config, _this = this;
		var obj = this.objects[objSeq];

		var bindSelectClose = this.bindSelectClose.bind(this);
		var chkVal = (_this.selectTextBox_onkeydown_data || ""), chkIndex = null;

		for (var O, index = 0; (index < obj.options.length && (O = obj.options[index])); index++) {
			if(O.optionValue.left(chkVal.length).lcase() == chkVal.lcase() || O.optionText.left(chkVal.length).lcase() == chkVal.lcase()){
				chkIndex = index;
				break;
			}
		};
		if(chkIndex != null){
			obj.selectedIndex = chkIndex;
			obj.config.focusedIndex = chkIndex;
			obj.config.selectedObject = obj.options[chkIndex];
			obj.config.isChangedSelect = true;
			bindSelectClose(objID, objSeq, event); // 값 전달 후 닫기
		}
		_this.selectTextBox_onkeydown_data = "";
	},
	getSelectedOption: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		if(AXgetId(objID).options.selectedIndex > -1){
			try{
				if(obj.selectedIndex != AXgetId(objID).options.selectedIndex) obj.selectedIndex = AXgetId(objID).options.selectedIndex;
			}catch(e){

			}
			return AXgetId(objID).options[AXgetId(objID).options.selectedIndex];
		}else{
			return AXgetId(objID).options[0];
		}
	},
	bindSelectChange: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var selectedOption = this.getSelectedOption(objID, objSeq);
		if (selectedOption) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectText").html(selectedOption.text);
		}
	},
	bindSelectExpand: function (objID, objSeq, isToggle, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var jqueryTargetObjID = jQuery("#"+ cfg.targetID + "_AX_" + objID);
		//Selector Option box Expand

		if(jqueryTargetObjID.data("disabled")) return;

		if (isToggle) { // 활성화 여부가 토글 이면
			if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				if (obj.config.isChangedSelect) {
					this.bindSelectClose(objID, objSeq, event); // 닫기
				} else {
					jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
					jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow").removeClass("on");
					//비활성 처리후 메소드 종료
					jQuery(document).unbind("click.AXSelect");
					jQuery(document).unbind("keydown.AXSelect");
				}
				return;
			}
		}
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 활성화 전에 개체 삭제 처리
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow").removeClass("on");

		//Expand Box 생성 구문 작성
		var anchorWidth = jQuery("#" + cfg.targetID + "_AX_" + objID).width() - 2; // anchor width
		var anchorHeight = jQuery("#" + cfg.targetID + "_AX_" + objID).data("height") - 1;
		var styles = [];
		//styles.push("top:"+anchorHeight+"px");
		styles.push("width:" + anchorWidth + "px");

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandBox\" class=\"AXselectExpandBox\" style=\"" + styles.join(";") + "\">");
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll\" class=\"AXselectExpandScroll\">");
		po.push("	<div class=\"AXLoadingSmall\"></div>");
		po.push("</div>");
		po.push("</div>");
		jQuery(document.body).append(po.join(''));
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow").addClass("on");

		var expandBox = jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox");
		if(obj.config.positionFixed){
			expandBox.css({"position":"fixed"});
		}
		var expBoxHeight = expandBox.outerHeight();
		var offset = (obj.config.positionFixed) ? jqueryTargetObjID.position() : jqueryTargetObjID.offset();

		if(obj.config.position){
			offset = jqueryTargetObjID.offset();
			if(obj.config.position.top != undefined){
				offset.top = obj.config.position.top;
			}
		}
		var css = {};
		css.top = offset.top + anchorHeight;
		//css.top = offset.top;
		css.left = offset.left;

		var bodyHeight;
		(AXUtil.docTD == "Q") ? bodyHeight = document.body.scrollHeight : bodyHeight = document.documentElement.scrollHeight;
		//trace({bodyHeight:bodyHeight, top:css.top});

		if(!obj.config.positionFixed){
			if (bodyHeight < css.top.number() + expBoxHeight) {
				css = {
					top: offset.top - expBoxHeight,
					left: offset.left
				}
			}
		}

		expandBox.css(css);

		this.bindSelectSetOptions(objID, objSeq);
	},
	bindSelectClose: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		//trace("bindSelectorClose");
		var cfg = this.config;
		if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectBoxArrow").removeClass("on");

			//비활성 처리후 메소드 종료
			jQuery(document).unbind("click", obj.documentclickEvent);
			jQuery(document).unbind("keydown", obj.documentKeyup);

			if (obj.config.isChangedSelect) {

				AXgetId(objID).options[obj.selectedIndex].selected = true;
				if (obj.config.onChange) {
					obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
				}
				obj.config.isChangedSelect = false;

				this.bindSelectChange(objID, objSeq);

			}

			if(event) event.stopPropagation(); // disableevent
			return;
		}else{
			if (obj.config.isChangedSelect) {

				AXgetId(objID).options[obj.selectedIndex].selected = true;
				if (obj.config.onChange) {
					obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
				}
				obj.config.isChangedSelect = false;

				this.bindSelectChange(objID, objSeq);

			}
		}
	},
	bindSelectSetOptions: function (objID, objSeq) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var jqueryTargetObjID = jQuery("#" + cfg.targetID + "_AX_" + objID);
		var maxHeight = obj.config.maxHeight || 200;

		if (!obj.options) return;
		if (obj.options.length == 0) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").hide();
		}

		var po = [];
		for (var O, index = 0; (index < obj.options.length && (O = obj.options[index])); index++) {
			po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option\">" + O.optionText.dec() + "</a>");
		}
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll").html(po.join(''));

		var expandScrollHeight = jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll").height();
		if (expandScrollHeight > maxHeight) expandScrollHeight = maxHeight;
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").css({ height: expandScrollHeight + "px" });

		var bindSelectOptionsClick = this.bindSelectOptionsClick.bind(this);
		obj.documentclickEvent = function (event) {
			bindSelectOptionsClick(objID, objSeq, event);
		};
		var bindSelectKeyup = this.bindSelectKeyup.bind(this);
		obj.documentKeyup = function (event) {
			bindSelectKeyup(objID, objSeq, event);
		};
		jQuery(document).bind("click.AXSelect", obj.documentclickEvent);
		jQuery(document).bind("keydown.AXSelect", obj.documentKeyup);

		if (obj.myUIScroll) obj.myUIScroll.unbind();
		obj.myUIScroll = new AXScroll();
		obj.myUIScroll.setConfig({
			CT_className: "AXScrollSmall",
			targetID: cfg.targetID + "_AX_" + objID + "_AX_expandBox",
			scrollID: cfg.targetID + "_AX_" + objID + "_AX_expandScroll",
			touchDirection: false
		});

		if (obj.selectedIndex != undefined) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.selectedIndex + "_AX_option").addClass("on");
			obj.myUIScroll.focusElement(cfg.targetID + "_AX_" + objID + "_AX_" + obj.selectedIndex + "_AX_option"); //focus
			obj.config.focusedIndex = obj.selectedIndex;
		}

		// 위치 재 정의 필요하면 정의 할 것 ----------------------------------
		var bodyHeight;
		(AXUtil.docTD == "Q") ? bodyHeight = document.body.clientHeight : bodyHeight = document.documentElement.clientHeight;
		//trace({bodyHeight:bodyHeight, top:css.top});

		var anchorHeight = jqueryTargetObjID.data("height") - 1;
		var expandBox = jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox");
		var expBoxHeight = expandBox.outerHeight();

		var offset = (obj.config.positionFixed) ? jqueryTargetObjID.position() : jqueryTargetObjID.offset();

		if(obj.config.position){
			offset = jqueryTargetObjID.offset();
			if(obj.config.position.top != undefined){
				offset.top = obj.config.position.top;
			}
		}

		var css = {};
		css.top = offset.top + anchorHeight;
		if(!obj.config.positionFixed){
			if (bodyHeight < css.top.number() + expBoxHeight) {
				css = {
					top: offset.top - expBoxHeight,
					left: offset.left
				}
				expandBox.css(css);
			}
		}
		// 위치 재 정의 필요하면 정의 할 것 ----------------------------------

	},
	bindSelectOptionsClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var isSelectorClick = false;
		var eid = event.target.id.split(/_AX_/g);
		var tgid = event.target.id;
		//trace(tgid.substr(eid[0].length, objID.length)+"///"+objID);
		if (event.target.id == "") isSelectorClick = false;
		else {
			if (event.target.id == objID || (eid[0] == cfg.targetID && tgid.substr(eid[0].length + 4, objID.length) == objID)) {
				isSelectorClick = true;
			}
		}

		if (!isSelectorClick) {
			this.bindSelectClose(objID, objSeq, event); // 셀럭터 외의 영역이 므로 닫기
		} else {
			if (eid.last() == "option") {
				var selectedIndex = eid[eid.length - 2];
				obj.selectedIndex = selectedIndex;
				obj.config.focusedIndex = selectedIndex;
				obj.config.selectedObject = obj.options[selectedIndex];

				obj.config.isChangedSelect = true;
				this.bindSelectClose(objID, objSeq, event); // 값 전달 후 닫기
			}
		}
	},
	bindSelectKeyup: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (event.keyCode == AXUtil.Event.KEY_TAB || event.keyCode == AXUtil.Event.KEY_ESC) {
			this.bindSelectClose(objID, objSeq, event); // 닫기
			return;
		} else if (event.keyCode == AXUtil.Event.KEY_UP) {
			if (!obj.options) return;
			if (obj.options.length == 0) return;
			var focusIndex = obj.options.length - 1;
			if (obj.config.focusedIndex == undefined || obj.config.focusedIndex == 0) {

			} else {
				focusIndex = (obj.config.focusedIndex) - 1;
			}
			this.bindSelectorSelect(objID, objSeq, focusIndex);
		} else if (event.keyCode == AXUtil.Event.KEY_DOWN) {
			if (!obj.options) return;
			if (obj.options.length == 0) return;
			var focusIndex = 0;
			if (obj.config.focusedIndex == undefined || obj.config.focusedIndex == obj.options.length - 1) {

			} else {
				focusIndex = (obj.config.focusedIndex).number() + 1;
			}
			this.bindSelectorSelect(objID, objSeq, focusIndex);
		} else if (event.keyCode == AXUtil.Event.KEY_RETURN) {
			//alert("RETURN");
			/*
			 jQuery(document).unbind("click", obj.documentclickEvent);
			 jQuery(document).unbind("keydown", obj.documentKeyup);
			 */
			/*
			 var selectedIndex = eid[eid.length - 2];
			 obj.selectedIndex = selectedIndex;
			 obj.config.focusedIndex = selectedIndex;
			 obj.config.selectedObject = obj.options[selectedIndex];

			 obj.config.isChangedSelect = true;
			 this.bindSelectClose(objID, objSeq, event); // 값 전달 후 닫기
			 */

		}
	},
	/* ~~~~~~~~~~~~~ */

	bindSelectorSelect: function (objID, objSeq, index, changeValue) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (obj.config.focusedIndex != undefined) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.config.focusedIndex + "_AX_option").removeClass("on");
		}
		jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option").addClass("on");
		obj.config.focusedIndex = index;
		obj.selectedIndex = index;
		obj.config.selectedObject = obj.options[index];
		obj.config.isChangedSelect = true;
		obj.myUIScroll.focusElement(cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option"); //focus
	},
	bindSelectorSelectClear: function (objID, objSeq) {

		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (obj.selectedIndex != undefined) {
			jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.selectedIndex + "_AX_option").removeClass("on");
		}
		obj.selectedIndex = null;
		obj.config.focusedIndex = null;
		obj.config.selectedObject = null;
		obj.config.isChangedSelect = true;
	},

	/* ~~~~~~~~~~~~~ */
	bindSelectChangeValue: function (objID, value, onEnd) {
		var findIndex = null;

		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};

		if (findIndex == null) {
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
			return;
		} else {
			var obj = this.objects[findIndex];
			var cfg = this.config;

			if (this.isMobile) {
				for (var oi = 0; oi < AXgetId(objID).options.length; oi++) {
					if (AXgetId(objID).options[oi].value == value) {
						var selectedIndex = oi;
						AXgetId(objID).options[oi].selected = true;
						obj.config.selectedObject = { optionValue: AXgetId(objID).options[oi].value, optionText: AXgetId(objID).options[oi].text.enc() };
						this.bindSelectChange(objID, findIndex);
						if (obj.config.onChange) {
							obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
						}
						break;
					}
				}
			} else {
				var selectedIndex = null;
				for (var O, oidx = 0; (oidx < obj.options.length && (O = obj.options[oidx])); oidx++) {
					if ((O.optionValue || O.value || "") == value) {
						selectedIndex = oidx;
						break;
					}
				};

				if (selectedIndex != null) {

					obj.selectedIndex = selectedIndex;
					obj.config.focusedIndex = selectedIndex;

					AXgetId(objID).options[obj.selectedIndex].selected = true;
					obj.config.selectedObject = obj.options[selectedIndex];
					this.bindSelectChange(objID, selectedIndex);

					if (obj.config.onChange) {
						obj.config.onChange.call(obj.config.selectedObject, obj.config.selectedObject);
					}

				} else {
					//trace("일치하는 값을 찾을 수 없습니다.");
				}
			}
		}
	},
	bindSelectDisabled: function(objID, disabled){
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};

		if (findIndex == null) {
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
			return;
		} else {
			var obj = this.objects[findIndex];
			var cfg = this.config;

			if (this.isMobile) {
				//AXgetId(objID).disabled = disabled;
			} else {
				//AXgetId(objID).disabled = disabled;

				jQuery("#"+ cfg.targetID + "_AX_" + objID).find(".AXanchorSelect").removeClass("disabled");
				jQuery("#"+ cfg.targetID + "_AX_" + objID).data("disabled", disabled);

				/*
				 if(AXgetId(objID).disabled){
				 jQuery("#"+ cfg.targetID + "_AX_" + objID).find(".AXanchorSelect").addClass("disabled");
				 //jQuery("#"+ cfg.targetID + "_AX_" + objID).data("disabled", AXgetId(objID).disabled);
				 jQuery("#"+ cfg.targetID + "_AX_" + objID).data("disabled", disabled);
				 }else{
				 jQuery("#"+ cfg.targetID + "_AX_" + objID).find(".AXanchorSelect").removeClass("disabled");
				 //jQuery("#"+ cfg.targetID + "_AX_" + objID).data("disabled", AXgetId(objID).disabled);
				 jQuery("#"+ cfg.targetID + "_AX_" + objID).data("disabled", disabled);
				 }
				 */

			}
		}
	},
	bindSelectUpdate: function(objID){
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		}
		if(findIndex != null){
			this.bindSelectChange(objID, findIndex);
		}
	},
	bindSelectFocus: function(objID){
		var cfg = this.config;
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};
		if(findIndex != null){
			AXgetId(cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox").focus();
		}
	},
	bindSelectBlur: function(objID){
		var cfg = this.config;
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};
		if(findIndex != null){
			this.bindSelectClose(objID, findIndex);
		}
	},
	bindSelectGetAnchorObject: function(objID){
		var cfg = this.config;
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};
		if(findIndex != null){
			return jQuery("#" + cfg.targetID + "_AX_" + objID + "_AX_SelectTextBox");
		}
	},
	bindSelectGetValue: function(objID, onEnd){
		var findIndex = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				findIndex = index;
				break;
			}
		};

		if (findIndex == null) {
			return { optionValue: null, optionText: null, error:"바인드 된 오브젝트를 찾을 수 없습니다." };
		} else {
			var obj = this.objects[findIndex];
			var cfg = this.config;

			if (obj.selectedIndex != undefined) {
				return { optionValue: AXgetId(objID).options[ obj.selectedIndex ].value, optionText: AXgetId(objID).options[ obj.selectedIndex ].text };
			}else{
				return { optionValue: null, optionText: null };
			}
		}
	},

	/**
	 * @method AXSelectConverter.bindSelectAddOptions
	 * @param objID {String} element select id
	 * @param options {Array} 추가하려는 옵션 배열
	 * @returns null
	 * @description 설명
	 * @example
	 ```
	 mySelect.bindSelectAddOptions("objID", [{optionValue:"1", optionText:"액시스제이"}]);
	 ```
	 */
	bindSelectAddOptions: function(objID, options){
		var cfg = this.config, _this = this;
		var objSeq = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				objSeq = index;
				break;
			}
		}
		if(objSeq == null) {
			trace("not found element id");
			return;
		}
		var obj = this.objects[objSeq];
		var iobj = obj.iobj;

		if(!Object.isArray(options)){
			trace("options 야규먼트가 없습니다.");
			return;
		}

		var newOptions = obj.options;
		for(var i = 0; i < options.length; i++){
			var hasValue = false;
			for(var oi = 0; oi < obj.options.length; oi++) {
				if( obj.options[oi].optionValue == options[i].optionValue ){
					hasValue = true;
				}
			}
			if(!hasValue){
				newOptions.push({optionText:options[i].optionText.enc(), optionValue:options[i].optionValue});
			}
		}
		obj.options = newOptions;

		iobj.css({opacity:100});
		//trace(obj.options);
		var po = [];
		for (var opts, oidx = 0; (oidx < obj.options.length && (opts = obj.options[oidx])); oidx++) {
			var optionText = (opts.optionText||"").dec();
			po.push("<option value=\"" + opts.optionValue + "\"");
			if (obj.config.setValue == opts.optionValue || obj.selectedIndex == oidx) po.push(" selected=\"selected\"");
			po.push(">" + optionText + "</option>");
		};
		iobj.empty();
		iobj.append(po.join(''));

		this.alignAnchor(objID, objSeq);

		return obj.options;
	},

	/**
	 * @method AXSelectConverter.bindSelectRemoveOptions
	 * @param objID {String} element select id
	 * @param options {Array} 추가하려는 옵션 배열
	 * @returns null
	 * @description 설명
	 * @example
	 ```
	 mySelect.bindSelectRemoveOptions("objID", [{optionValue:"1", optionText:"액시스제이"}]);
	 ```
	 */
	bindSelectRemoveOptions: function(objID, options){
		var cfg = this.config, _this = this;
		var objSeq = null;
		for (var O, index = 0; (index < this.objects.length && (O = this.objects[index])); index++) {
			if (O.id == objID && O.isDel != true) {
				objSeq = index;
				break;
			}
		}
		if(objSeq == null) {
			trace("not found element id");
			return;
		}
		var obj = this.objects[objSeq];
		var iobj = obj.iobj;

		if(!Object.isArray(options)){
			trace("options 야규먼트가 없습니다.");
			return;
		}

		var newOptions = [];

		for(var oi = 0; oi < obj.options.length; oi++) {
			var hasValue = false;
			for(var i = 0; i < options.length; i++) {
				if( obj.options[oi].optionValue == options[i].optionValue ){
					hasValue = true;
				}
			}
			if(!hasValue){
				newOptions.push({optionText:obj.options[oi].optionText, optionValue:obj.options[oi].optionValue});
			}
		}
		obj.options = newOptions;

		//trace(obj.options);
		iobj.css({opacity:100});
		var po = [];
		for (var opts, oidx = 0; (oidx < obj.options.length && (opts = obj.options[oidx])); oidx++) {
			var optionText = (opts.optionText||"").dec();
			po.push("<option value=\"" + opts.optionValue + "\"");
			if (obj.config.setValue == opts.optionValue || obj.selectedIndex == oidx) po.push(" selected=\"selected\"");
			po.push(">" + optionText + "</option>");
		}
		iobj.empty();
		iobj.append(po.join(''));

		this.alignAnchor(objID, objSeq);

		return obj.options;
	}
});

var AXSelect = new AXSelectConverter();
AXSelect.setConfig({ targetID: "AXselect" });

jQuery.fn.unbindSelect = function (config) {
	jQuery.each(this, function () {
		if (config == undefined) config = {};
		config.id = this.id;
		AXSelect.unbind(config);
	});
	return this;
};

jQuery.fn.bindSelect = function (config) {
	jQuery.each(this, function () {
		if (config == undefined) config = {};
		config.id = this.id;
		AXSelect.bind(config);
	});
	return this;
};

jQuery.fn.setConfigSelect = function (config) {
	jQuery.each(this, function () {
		AXSelect.bindSetConfig(this.id, config);
	});
	return this;
};

jQuery.fn.bindSelectSetValue = function (value, onEnd) {
	jQuery.each(this, function () {
		AXSelect.bindSelectChangeValue(this.id, value, onEnd);
	});
	return this;
};

jQuery.fn.bindSelectGetValue = function (onEnd) {
	return AXSelect.bindSelectGetValue(this[0].id, onEnd);
};

//SetText
//getText

jQuery.fn.setValueSelect = function (value, onEnd) {
	jQuery.each(this, function () {
		AXSelect.bindSelectChangeValue(this.id, value, onEnd);
	});
	return this;
};

jQuery.fn.bindSelectDisabled = function (Disabled) {
	jQuery.each(this, function () {
		AXSelect.bindSelectDisabled(this.id, Disabled);
	});
	return this;
};

jQuery.fn.bindSelectUpdate = function () {
	jQuery.each(this, function () {
		AXSelect.bindSelectUpdate(this.id);
	});
	return this;
};

jQuery.fn.bindSelectFocus = function () {
	jQuery.each(this, function () {
		AXSelect.bindSelectFocus(this.id);
	});
	return this;
};

jQuery.fn.bindSelectBlur = function () {
	jQuery.each(this, function () {
		AXSelect.bindSelectBlur(this.id);
	});
	return this;
};

jQuery.fn.bindSelectGetAnchorObject = function(){
	var returnObj;
	jQuery.each(this, function () {
		returnObj = AXSelect.bindSelectGetAnchorObject(this.id);
	});
	return returnObj;
};

/**
 * @method jQuery.fn.bindSelectAddOptions
 * @param options {Array} 추가하려는 옵션 배열
 * @returns null
 * @description 설명
 * @example
 ```
 $("#mySelect").bindSelectAddOptions([
 {optionValue:"1", optionText:"액시스제이"}
 ]);
 ```
 */
jQuery.fn.bindSelectAddOptions = function (options) {
	var returnObj;
	jQuery.each(this, function () {
		returnObj = AXSelect.bindSelectAddOptions(this.id, options);
	});
	return returnObj;
};

/**
 * @method jQuery.fn.bindSelectRemoveOptions
 * @param options {Array} 추가하려는 옵션 배열
 * @returns null
 * @description 설명
 * @example
 ```

 ```
 */
jQuery.fn.bindSelectRemoveOptions = function (options) {
	var returnObj;
	jQuery.each(this, function () {
		returnObj = AXSelect.bindSelectRemoveOptions(this.id, options);
	});
	return returnObj;
};