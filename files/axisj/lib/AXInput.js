/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */

/**
 * AXInputConverter
 * @class AXInputConverter
 * @extends AXJ
 * @version v1.51
 * @author tom@axisj.com
 * @logs
 "2012-11-05 오후 1:23:24",
 "2013-02-21 오후 5:47:22 슬라이드에 터치 이벤트 추가 - root",
 "2013-06-09 오후 10:31:34 bindNumber - onchange ",
 "2013-06-10 오후 1:37:41 unbinddate 메서드 추가",
 "2013-06-13 오후 7:26:49 bindDate - config 에 defaultDate 속성 확장",
 "2013-06-20 오전 12:49:06 twinbindDate - 아이디 체크 버그 픽스",
 "2013-08-28 오후 4:16:01 bindMoney - 성능개선",
 "2013-09-29 오전 12:39:49 bindSlider 연속호출 버그 패치 - tom",
 "2013-11-06 오후 1:13:46 bindMoney min, max, onChange 속성 구현 및 기타 버그 패치 - tom",
 "2013-11-28 오전 10:51:22 : tom - onsearch 옵션 추가 및 CSS 수정",
 "2013-12-09 오후 8:06:17 : tom - bindSelectorOptionsClick 버그픽스",
 "2013-12-16 오후 4:46:14 : tom - bindMoneyCheck",
 "2013-12-25 오후 3:26:54 : tom - bindTwinDate 기본값 초기화 버그픽스",
 "2013-12-27 오후 12:09:20 : tom - obj.inProgressReACT 기능 추가",
 "2014-01-02 오후 12:59:17 : tom - bindSelector AJAX 호출 중지 기능 추가",
 "2014-01-10 오후 5:07:44 : tom - event bind modify, fix",
 "2014-01-14 오후 3:43:06 : tom - bindSelector expandBox close 버그픽스",
 "2014-01-20 오후 4:16:56 : tom - bindDateTime 시간이 선택 해제되는 문제 해결",
 "2014-02-05 오후 4:32:34 : tom - bindSelector blur 이벤트 값 제거 문제 해결 / bindDate 문자열 자동완성 버그 픽스",
 "2014-02-06 오후 7:59:54 tom : jQuery 독립 우회 코드 변경",
 "2014-02-13 오후 5:39:21 tom : bindDate 월 이동 버그 픽스",
 "2014-02-14 오후 1:29:01 tom : bindSelector enter키 입력 후 blur 제거",
 "2014-02-17 오후 7:38:59 tom : bindDate 월선택 도구에서 1월 선택 버그 픽스",
 "2014-02-21 오후 4:52:24 tom : bindMoney 포커스 유지 기능 추가",
 "2014-02-25 오후 9:05:04 tom : earlierThan/ laterThan 설정 버그픽스",
 "2014-03-18 오후 1:58:57 tom : bindSelector 텍스트 변경 안 되었을 때 이벤트 처리 안하기",
 "2014-03-18 오후 9:44:57 tom : 날짜 입력 시 4자리 입력 후 포커스 아웃 시 당해년도 4자리 자동 포함, 날짜 입력 시 6자리 입력 후 포커스 아웃 시 당해년도 앞 2자리 자동 포함",
 "2014-04-03 오후 3:49:21 tom : bindDate ie 10 blur 버그 픽스",
 "2014-04-14 tom : 모바일 너비 지정 방식 변경",
 "2014-04-21 tom : bindDate 다중 오픈 되었을 때 닫기 버그 픽스",
 "2014-04-24 오후 7:33:25 tom : bindDate  개체에 리턴입력시  onBlur 연결",
 "2014-05-21 tom : resize event 상속"
 "2014-06-02 tom : change ajax data protocol check result or error key in data"
 "2014-07-14 tom : direct align when window resize "
 "2014-07-25 tom : support chaining 'method bind..'"
 *
 */

var AXInputConverter = Class.create(AXJ, {
	initialize: function (AXJ_super) {
		AXJ_super();
		this.objects = [];
		this.inputTypes = [
			{ type: "search" }, { type: "number" }, { type: "money" }, { type: "slider" }, { type: "twinSlider" },
			{ type: "selector" }, { type: "switch" }, { type: "segment" },
			{ type: "date" }, { type: "dateTime" }, { type: "twinDate" }, { type: "twinDateTime" },
			{ type: "checked" }
		];
		this.config.anchorClassName = "AXanchor";
		this.config.anchorPlaceHolderClassName = "AXanchorPlaceHolder";
		this.config.anchorSearchClassName = "AXanchorSearch";
		this.config.anchorNumberContainerClassName = "AXanchorNumberContainer";
		this.config.anchorIncreaseClassName = "AXanchorIncrease";
		this.config.anchorDecreaseClassName = "AXanchorDecrease";
		this.config.anchorSelectorHandleContainerClassName = "AXanchorSelectorHandleContainer";
		this.config.anchorSelectorFinderContainerClassName = "AXanchorSelectorFinderContainer";
		this.config.anchorSelectorHandleClassName = "AXanchorSelectorHandle";
		this.config.anchorSelectorFinderClassName = "AXanchorSelectorFinder";
		this.config.anchorSelectorExpandBoxClassName = "AXanchorSelectorExpandBox";
		this.config.anchorSelectorExpandScrollClassName = "AXanchorSelectorExpandScroll"
		this.config.anchorSliderBoxClassName = "AXanchorSliderBox";
		this.config.anchorSwitchBoxClassName = "AXanchorSwitchBox";
		this.config.anchorSegmentBoxClassName = "AXanchorSegmentBox";
		this.config.anchorDateHandleClassName = "AXanchorDateHandle";
		this.config.bindDateExpandBoxClassName = "AXbindDateExpandBox";
		this.config.bindTwinDateExpandBoxClassName = "AXbindTwinDateExpandBox";
		/* 모바일 반응 너비 */
		this.config.responsiveMobile = AXConfig.mobile.responsiveWidth;
	},
	init: function () {
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
	msgAlert: function (msg) {
		var errorPrintType = "toast";
		if (AXConfig.AXInput) {
			errorPrintType = (AXConfig.AXInput.errorPrintType || "toast");
		}
		if (errorPrintType == "toast") toast.push(msg);
		else if (errorPrintType == "dialog") dialog.push(msg);
		else if (errorPrintType == "alert") AXUtil.alert(msg);
	},
	bindSetConfig: function (objID, configs) {
		var findIndex = null;
		axf.each(this.objects, function (index, O) {
			if (O.id == objID) {
				findIndex = index;
				return false;
			}
		});
		if (findIndex == null) {
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
			return;
		} else {
			var _self = this.objects[findIndex];
			axf.each(configs, function (k, v) {
				_self.config[k] = v;
			});
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

		axf.each(this.objects, function (idx, O) {
			//if (this.id == objID && this.isDel == true) objSeq = idx;
			if (this.id == objID) {
				objSeq = idx;
				return false;
			}
		});

		if (obj.href == undefined) obj.href = cfg.href;

		if (objSeq == null) {
			objSeq = this.objects.length;
			this.objects.push({ id: objID, anchorID: cfg.targetID + "_AX_" + objID, config: obj, bindType: obj.bindType });
		} else {
			this.objects[objSeq].isDel = undefined;
			this.objects[objSeq].config = obj;
		}

		if (obj.bindType != "checked") {
			this.appendAnchor(objID, objSeq, obj.bindType);
		}
		// bind checked 는 anchor연결 안함.

		if (obj.bindType == "placeHolder") {
			this.bindPlaceHolder(objID, objSeq);
		} else if (obj.bindType == "search") {
			this.bindSearch(objID, objSeq);
		} else if (obj.bindType == "number") {
			this.bindNumber(objID, objSeq);
		} else if (obj.bindType == "money") {
			this.bindMoney(objID, objSeq);
		} else if (obj.bindType == "selector") {
			this.bindSelector(objID, objSeq);
		} else if (obj.bindType == "slider") {
			this.bindSlider(objID, objSeq);
		} else if (obj.bindType == "twinSlider") {
			this.bindTwinSlider(objID, objSeq);
		} else if (obj.bindType == "switch") {
			this.bindSwitch(objID, objSeq);
		} else if (obj.bindType == "segment") {
			this.bindSegment(objID, objSeq);
		} else if (obj.bindType == "date") {
			this.bindDate(objID, objSeq);
		} else if (obj.bindType == "twinDate") {
			this.bindTwinDate(objID, objSeq);
		} else if (obj.bindType == "twinDateTime") {
			this.bindTwinDate(objID, objSeq, "time");
		} else if (obj.bindType == "checked") {
			this.bindChecked(objID, objSeq);
		}
	},
	unbind: function (obj) {
		var cfg = this.config;
		var removeAnchorId;
		var removeIdx;
		axf.each(this.objects, function (idx, O) {
			if (O.id != obj.id) {
				// collect.push(this);
			} else {
				if (O.isDel != true) {
					removeAnchorId = this.anchorID;
					removeIdx = idx;
				}
			}
		});

		if (removeAnchorId) {
			this.objects[removeIdx].isDel = true;
			axdom("#" + obj.id).removeAttr("data-axbind");
			axdom("#" + removeAnchorId).remove();
			var objID = obj.id;
			var obj = this.objects[removeIdx];
			if (obj.documentclickEvent) axdom(document).unbind("click.AXInput", obj.documentclickEvent);
			axdom("#" + objID).unbind("keydown.AXInput");
			axdom("#" + objID).unbind("keydown.AXInputCheck");

			axdom("#" + objID).unbind("change.AXInput");

			if (obj.bindSliderMouseMove) axdom(document.body).unbind("mousemove.AXInput", obj.bindSliderMouseMove);
			if (obj.bindSliderMouseUp) axdom(document.body).unbind("mouseup.AXInput", obj.bindSliderMouseUp);
			if (obj.bindSliderTouchMove) document.removeEventListener("touchmove.AXInput", obj.bindSliderTouchMove, false);
			if (obj.bindSliderTouchEnd) document.removeEventListener("touchend.AXInput", obj.bindSliderTouchEnd, false);
			if (obj.bindTwinSliderMouseMove) axdom(document.body).unbind("mousemove.AXInput", obj.bindTwinSliderMouseMove);
			if (obj.bindTwinSliderMouseUp) axdom(document.body).unbind("mouseup.AXInput", obj.bindTwinSliderMouseUp);

			if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
			}
		}
	},
	appendAnchor: function (objID, objSeq, bindType) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		//trace("appendAnchor");
		axdom("#" + cfg.targetID + "_AX_" + objID).remove();
		var anchorNode = axdom("<div id=\"" + cfg.targetID + "_AX_" + objID + "\" class=\"" + cfg.anchorClassName + "\" style=\"display:none;\"></div>");
		var iobj = axdom("#" + objID);
		iobj.attr("data-axbind", bindType);
		iobj.after(anchorNode);

		obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		obj.bindTarget = iobj;

		//var offSetParent = iobj.offsetParent();
		var iobjPosition = iobj.position();
		var l = iobjPosition.left, t = iobjPosition.top, w = 0, h = 0;

		var borderW = iobj.css("border-left-width").number();
		var borderH = iobj.css("border-top-width").number();
		var marginW = iobj.css("margin-left").number();
		var marginH = iobj.css("margin-top").number();
		l = l + marginW;
		/*t = t;*/
		w = iobj.outerWidth();
		h = iobj.outerHeight();

		var css = { left: l, top: t, width: w, height: 0 };
		//trace(css);
		obj.bindAnchorTarget.css(css);
		obj.bindAnchorTarget.data("height", h);

		var _this = this;
		setTimeout(function () {
			_this.alignAnchor(objID, objSeq);
		}, 500);
	},
	alignAnchor: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if (!AXgetId(objID)) return; /* 엘리먼트 존재 여부 확인 */

		var iobjPosition = obj.bindTarget.position();
		var l = iobjPosition.left, t = iobjPosition.top;
		var w = obj.bindTarget.outerWidth();
		var h = obj.bindTarget.outerHeight();
		if (obj.bindTarget.css("display") == "none") {
			h = obj.bindAnchorTarget.data("height");
			var css = { width: w };
		} else {
			var css = { left: l, top: t, width: w, height: 0 };
		}
		//trace(css);
		obj.bindAnchorTarget.css(css);
		obj.bindAnchorTarget.data("height", h);

		if (obj.bindType == "placeHolder") {

		} else if (obj.bindType == "search") {

		} else if (obj.bindType == "number") {
			var UPh = parseInt((h - 2) / 2) - 1;
			var DNh = parseInt((h - 2) / 2) - 2;
			var handleWidth = h - 2;
			if (handleWidth > 20) handleWidth = 20;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_HandleContainer").css({ width: handleWidth, height: h - 2 });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_increase").css({ width: handleWidth, height: UPh });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_decrease").css({ top: (UPh + 1), width: handleWidth, height: DNh });
			//trace({top:(UPh+1), width:h, height:DNh});
		} else if (obj.bindType == "money") {

		} else if (obj.bindType == "selector") {
			h -= 2;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_HandleContainer").css({ width: h, height: h });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").css({ width: h, height: h });

			if (obj.config.finder) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_FinderContainer").css({ right: h, width: h, height: h });
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Finder").css({ width: h, height: h });
			}
		} else if (obj.bindType == "slider") {

		} else if (obj.bindType == "twinSlider") {

		} else if (obj.bindType == "switch") {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox").css({ width: w, height: h });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay").css({ height: h, "line-height": h + "px" });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchHandle").css({ height: h });
			obj.bindAnchorTarget.css({ height: h });
		} else if (obj.bindType == "segment") {
			obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });
			var borderTop = obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css("border-top-width").number();
			var borderBot = obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css("border-bottom-width").number();
			obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css({ height: (obj.bindAnchorTarget.innerHeight() - borderTop - borderBot) + "px", "line-height": (obj.bindAnchorTarget.innerHeight() - borderTop - borderBot) + "px" });
		} else if (obj.bindType == "date") {
			var handleWidth = h - 2;
			if (handleWidth > 20) handleWidth = 20;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").css({ width: h, height: h });
		} else if (obj.bindType == "twinDate") {

		} else if (obj.bindType == "twinDateTime") {

		} else if (obj.bindType == "checked") {

		}
	},
	bindSetValue: function (objID, value) {
		var cfg = this.config;
		var objSeq = null;
		axf.each(this.objects, function (index, O) {
			if (O.id == objID) {
				objSeq = index;
				return false;
			}
		});
		if (objSeq == null) {
			//trace("바인드 된 오브젝트를 찾을 수 없습니다.");
			return;
		} else {
			var obj = this.objects[objSeq];

			if (obj.bindType == "search") {
				//	this.bindSearch(objID, objSeq);
			} else if (obj.bindType == "number") {
				//	this.bindNumber(objID, objSeq);
			} else if (obj.bindType == "money") {
				//	this.bindMoney(objID, objSeq);
			} else if (obj.bindType == "selector") {
				this.bindSelectorSetValue(objID, objSeq, value);
			} else if (obj.bindType == "slider") {
				this.bindSliderSetValue(objID, objSeq, value);
			} else if (obj.bindType == "twinSlider") {
				this.bindTwinSliderSetValue(objID, objSeq, value);
			} else if (obj.bindType == "switch") {
				this.bindSwitchSetValue(objID, objSeq, value);
			} else if (obj.bindType == "segment") {
				this.bindSegmentSetValue(objID, objSeq, value);
			} else if (obj.bindType == "date") {
				//	this.bindDate(objID, objSeq);
			} else if (obj.bindType == "twinDate") {
				//	this.bindTwinDate(objID, objSeq);
			}
		}
	},
	// onlyHolder ~~~~~~~~~~~~~~~
	bindPlaceHolder: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		// 브라우저 체크
		if (AXUtil.browser.name != "ie") return;
		if (AXUtil.browser.name == "ie" && AXUtil.browser.version > 9) return;

		var w = axdom("#" + cfg.targetID + "_AX_" + objID).width();
		var h = axdom("#" + cfg.targetID + "_AX_" + objID).data("height");

		var placeholder = axdom("#" + objID).attr("placeholder");
		if (placeholder == "undefined") placeholder = "";

		var po = ["<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_PlaceHolder\" class=\"" + cfg.anchorPlaceHolderClassName + "\" style=\"left:0px;top:0px;width:" + w + "px;height:" + h + "px;line-height:" + h + "px;\">" + placeholder + "</a>"];
		//append to anchor
		axdom("#" + cfg.targetID + "_AX_" + objID).append(po.join(''));
		//bind handle
		var bindPlaceHolderKeyup = this.bindPlaceHolderSyncAnchor.bind(this);
		axdom("#" + objID).unbind("keyup.AXInput").bind("keyup.AXInput", function () {
			bindPlaceHolderKeyup(objID, objSeq);
		});
		bindPlaceHolderKeyup(objID, objSeq);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_PlaceHolder").unbind("click.AXInput").bind("click.AXInput", function () {
			//axdom("#"+objID).val("");
			axdom("#" + objID).focus();
			bindPlaceHolderKeyup(objID, objSeq);
		});
		//------------------------------------
	},
	bindPlaceHolderSyncAnchor: function (objID, objSeq) {
		var cfg = this.config;
		if (axdom("#" + objID).val().trim() == "") {
			//if(AXgetId(cfg.targetID+"_AX_"+objID).style.display == "none") 
			axdom("#" + cfg.targetID + "_AX_" + objID).show();
		} else {
			//if(AXgetId(cfg.targetID+"_AX_"+objID).style.display != "none") 
			axdom("#" + cfg.targetID + "_AX_" + objID).hide();
		}
	},
	// onlyHolder ~~~~~~~~~~~~~~

	// search
	bindSearch: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var w = axdom("#" + cfg.targetID + "_AX_" + objID).width();
		var h = axdom("#" + cfg.targetID + "_AX_" + objID).data("height");
		var placeholder = axdom("#" + objID).attr("placeholder");
		if (placeholder == undefined) placeholder = "";
		var po = [];

		if (AXUtil.browser.name == "ie" && AXUtil.browser.version < 10 && placeholder != "") {
			po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_PlaceHolder\" class=\"" + cfg.anchorPlaceHolderClassName + "\" ");
			po.push(" style=\"left:0px;top:0px;width:" + w + "px;height:" + h + "px;line-height:" + h + "px;\">" + placeholder + "</a>");
		}
		po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_Search\" class=\"" + cfg.anchorSearchClassName + "\" ");
		po.push(" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">Search</a>");
		//append to anchor
		axdom("#" + cfg.targetID + "_AX_" + objID).append(po.join(''));
		//bind handle
		var bindSearchKeyup = this.bindSearchSyncAnchor.bind(this);
		axdom("#" + objID).unbind("keydown.AXInput").bind("keydown.AXInput", function () {
			bindSearchKeyup(objID, objSeq);
		});
		bindSearchKeyup(objID, objSeq);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Search").unbind("click.AXInput").bind("click.AXInput", function () {
			axdom("#" + objID).val("");
			axdom("#" + objID).focus();
			bindSearchKeyup(objID, objSeq);
		});
		//------------------------------------
	},
	bindSearchSyncAnchor: function (objID, objSeq) {
		var cfg = this.config;
		axdom("#" + cfg.targetID + "_AX_" + objID).show();

		if (axdom("#" + objID).val() == "") {
			//if(AXgetId(cfg.targetID+"_AX_"+objID).style.display != "none") axdom("#"+cfg.targetID+"_AX_"+objID).hide();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Search").hide();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_PlaceHolder").show();
		} else {
			//if(AXgetId(cfg.targetID+"_AX_"+objID).style.display == "none") axdom("#"+cfg.targetID+"_AX_"+objID).fadeIn();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Search").show();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_PlaceHolder").hide();
		}
	},

	// number
	bindNumber: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		var h = obj.bindAnchorTarget.data("height");
		//trace(objID+"//"+h);
		var po = [];
		var UPh = parseInt((h - 2) / 2) - 1;
		var DNh = parseInt((h - 2) / 2) - 2;
		//trace(UPh+"//"+DNh);
		var handleWidth = h - 2;
		if (handleWidth > 20) handleWidth = 20;

		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_HandleContainer\" class=\"" + cfg.anchorNumberContainerClassName + "\" style=\"right:0px;top:0px;width:" + handleWidth + "px;height:" + (h - 2) + "px;\">");
		po.push("	<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_increase\" class=\"" + cfg.anchorIncreaseClassName + "\" style=\"right:0px;top:0px;width:" + handleWidth + "px;height:" + UPh + "px;\">increase</a>");
		po.push("	<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_decrease\" class=\"" + cfg.anchorDecreaseClassName + "\" style=\"right:0px;top:" + (UPh + 1) + "px;width:" + handleWidth + "px;height:" + DNh + "px;\">decrease</a>");
		po.push("</div>");
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.show();
		//alert("show");

		var bindNumberAdd = this.bindNumberAdd.bind(this);
		var bindNumberCheck = this.bindNumberCheck.bind(this);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_increase").unbind("mousedown.AXInput").bind("mousedown.AXInput", function () {
			bindNumberAdd(objID, 1, objSeq);
			bindNumberCheck(objID, objSeq);
		});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_decrease").unbind("mousedown.AXInput").bind("mousedown.AXInput", function () {
			bindNumberAdd(objID, -1, objSeq);
			bindNumberCheck(objID, objSeq);
		});
		obj.bindTarget.unbind("change.AXInput").bind("change.AXInput", function () {
			bindNumberCheck(objID, objSeq);
		});
		obj.bindTarget.unbind("keydown.AXInput").bind("keydown.AXInput", function (event) {
			if (event.keyCode == AXUtil.Event.KEY_UP) bindNumberAdd(objID, 1, objSeq);
			else if (event.keyCode == AXUtil.Event.KEY_DOWN) bindNumberAdd(objID, -1, objSeq);
		});
		obj.bindTarget.unbind("keyup.AXInput").bind("keyup.AXInput", function (event) {
			bindNumberCheck(objID, objSeq);
		});
	},
	bindNumberAdd: function (objID, adder, objSeq) {
		var obj = this.objects[objSeq];
		var maxval = obj.config.max;
		var minval = obj.config.min;
		var nval = axdom("#" + objID).val().number();
		if (adder > 0) {
			//max 를 초과 하는지 확인
			if ((nval + adder) < minval) nval = minval;
			if (maxval != undefined && maxval != null) {
				if ((nval + adder) > maxval) return;
			}
		} else {
			//min 를 초과 하는지 확인
			if (minval != undefined && minval != null) {
				if ((nval + adder) < minval) return;
			}
		}
		axdom("#" + objID).val(nval + adder);
	},
	bindNumberCheck: function (objID, objSeq) {
		var obj = this.objects[objSeq];
		var maxval = obj.config.max;
		var minval = obj.config.min;
		var nval;
		if (axdom("#" + objID).val() == "") {
			if (minval != undefined && minval != null) {
				nval = minval;
			} else {
				nval = axdom("#" + objID).val().number();
			}
		} else {
			nval = axdom("#" + objID).val().number();
		}

		if (maxval != undefined && maxval != null) {
			if ((nval) > maxval) {
				axdom("#" + objID).val("");
				try {
					this.msgAlert("설정된 최대값을 넘어서는 입력입니다.");
				} catch (e) { }
			} else {
				if (minval != undefined && minval != null) {
					if ((nval) < minval) {
						axdom("#" + objID).val("");
						try {
							this.msgAlert("설정된 최소값보다 작은 입력입니다.");
						} catch (e) { }
					} else {
						axdom("#" + objID).val(nval);
					}
				}
			}
		} else {
			if (minval != undefined && minval != null) {
				if ((nval) < minval) {
					axdom("#" + objID).val("");
					try {
						this.msgAlert("설정된 최소값보다 작은 입력입니다.");
					} catch (e) { }
				}
			} else {
				axdom("#" + objID).val(nval);
			}
		}

		if (obj.config.onChange) {
			obj.config.onChange.call({ objID: objID, objSeq: objSeq, value: axdom("#" + objID).val() });
		}
		if (obj.config.onchange) {
			obj.config.onchange.call({ objID: objID, objSeq: objSeq, value: axdom("#" + objID).val() });
		}
	},

	// money
	bindMoney: function (objID, objSeq) {
		var obj = this.objects[objSeq];
		obj.bindTarget.css({ "text-align": "right" });
		var bindMoneyCheck = this.bindMoneyCheck.bind(this);
		var val = obj.bindTarget.val().trim();
		if (val != "") val = obj.bindTarget.val().number().money()
		obj.bindTarget.val(val);
		obj.bindTarget.unbind("keyup.AXInput").bind("keyup.AXInput", function (event) {

			var elem = obj.bindTarget.get(0);
			var elemFocusPosition;
			if ('selectionStart' in elem) {
				// Standard-compliant browsers
				elemFocusPosition = elem.selectionStart;
			} else if (document.selection) {
				// IE
				//elem.focus();
				var sel = document.selection.createRange();
				var selLen = document.selection.createRange().text.length;
				sel.moveStart('character', -elem.value.length);
				elemFocusPosition = sel.text.length - selLen;
			}
			//trace(elemFocusPosition);

			// 계산된 포커스 위치 앞에 쉼표 갯수를 구합니다.

			obj.bindTarget.data("focusPosition", elemFocusPosition);
			obj.bindTarget.data("prevLen", elem.value.length);

			var event = window.event || e;
			// ignore tab & shift key 스킵 & ctrl
			if (!event.keyCode || event.keyCode == 9 || event.keyCode == 16 || event.keyCode == 17) return;
			if (event.ctrlKey && event.keyCode == 65) return;
			if (event.keyCode != AXUtil.Event.KEY_DELETE && event.keyCode != AXUtil.Event.KEY_BACKSPACE && event.keyCode != AXUtil.Event.KEY_LEFT && event.keyCode != AXUtil.Event.KEY_RIGHT) {
				bindMoneyCheck(objID, objSeq, "keyup");
			} else if (event.keyCode == AXUtil.Event.KEY_DELETE || event.keyCode == AXUtil.Event.KEY_BACKSPACE) {
				bindMoneyCheck(objID, objSeq, "keyup");
			}
		});

		obj.bindTarget.unbind("change.AXInput").bind("change.AXInput", function (event) {
			bindMoneyCheck(objID, objSeq, "change");
		});
	},
	bindMoneyCheck: function (objID, objSeq, eventType) {
		var obj = this.objects[objSeq];
		var maxval = obj.config.max;
		var minval = obj.config.min;
		var nval;

		if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;

		if (obj.bindTarget.val() == "") {
			if (minval != undefined && minval != null) {
				nval = minval;
			} else {
				nval = obj.bindTarget.val().number();
			}
		} else {
			nval = obj.bindTarget.val().number();
		}
		if (maxval != undefined && maxval != null) {
			if ((nval) > maxval) {
				obj.bindTarget.val(maxval.money());
				try {
					this.msgAlert("설정된 최대값{" + maxval.number().money() + "} 을 넘어서는 입력입니다.");
				} catch (e) { }
			} else {
				if (minval != undefined && minval != null && eventType == "change") {
					if ((nval) < minval) {
						obj.bindTarget.val(minval.money());
						try {
							this.msgAlert("설정된 최소값{" + minval.number().money() + "}보다 작은 입력입니다.");
						} catch (e) { }
					} else {
						obj.bindTarget.val(nval.money());
					}
				}
			}
		} else {
			if (minval != undefined && minval != null && eventType == "change") {
				if ((nval) < minval) {
					obj.bindTarget.val(minval.money());
					try {
						this.msgAlert("설정된 최소값{" + minval.number().money() + "}보다 작은 입력입니다.");
					} catch (e) { }
				}
			} else {
				obj.bindTarget.val(nval.money());
			}
		}

		if( !axf.isEmpty( obj.bindTarget.data("focusPosition") ) ){
			obj.bindTarget.setCaret( obj.bindTarget.data("focusPosition").number() + ( obj.bindTarget.val().length - obj.bindTarget.data("prevLen") ) );
		}

		if (obj.config.onChange) {
			obj.config.onChange.call({ objID: objID, objSeq: objSeq, value: obj.bindTarget.val().number() });
		}
	},

	// selector
	bindSelector: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		obj.bindTarget.data("val", obj.bindTarget.val());

		var h = obj.bindAnchorTarget.data("height") - 2;
		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_HandleContainer\" class=\"bindSelectorNodes " + cfg.anchorSelectorHandleContainerClassName + "\" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">");
		po.push("	<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_Handle\" class=\"bindSelectorNodes " + cfg.anchorSelectorHandleClassName + "\" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">expand</a>");
		po.push("</div>");
		if (obj.config.finder) {
			po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_FinderContainer\" class=\"bindSelectorNodes " + cfg.anchorSelectorFinderContainerClassName + "\" style=\"right:" + h + "px;top:0px;width:" + h + "px;height:" + h + "px;\">");
			po.push("	<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_Finder\" class=\"bindSelectorNodes " + cfg.anchorSelectorFinderClassName + "\" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">finder</a>");
			po.push("</div>");
		}

		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.show();

		var bindSelectorExpand = this.bindSelectorExpand.bind(this);
		var bindSelectorClose = this.bindSelectorClose.bind(this);

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").unbind("click.AXInput").bind("click.AXInput", function (event) {
			if (!AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				axdom("#" + objID).focus();
			} else {
				//bindSelectorExpand(objID, objSeq, true, event);
				bindSelectorClose(objID, objSeq, event);
			}
		});
		obj.bindTarget.unbind("focus.AXInput").bind("focus.AXInput", function (event) {
			try {
				this.select();
			} catch (e) {
			}
			if (!AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				bindSelectorExpand(objID, objSeq, false, event);
			}
		});
		obj.bindTarget.unbind("keydown.AXInputCheck").bind("keydown.AXInputCheck", function(event){
			if (!AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				bindSelectorExpand(objID, objSeq, false, event);
			}
		});

		if (obj.config.finder) {
			if (obj.config.finder.onclick) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Finder").unbind("click.AXInput").bind("click.AXInput", function (event) {
					obj.config.finder.onclick.call({
						targetID: objID,
						value: axdom("#" + objID).val()
					}, objID);
					bindSelectorClose(objID, objSeq, event);
				});
			}
		}

		/*
		 var bindSelectorInputChange = this.bindSelectorInputChange.bind(this);
		 obj.inputChange = function(event){
		 bindSelectorInputChange(objID, objSeq, event);
		 }
		 axdom("#"+objID).bind("change.AXInput", obj.inputChange);
		 */
	},
	bindSelectorExpand: function (objID, objSeq, isToggle, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		obj.bindTarget.data("val", obj.bindTarget.val().enc());

		//alert(obj.bindTarget.data("val").end());

		if (this.opendExpandBox) {
			this.bindSelectorClose(this.opendExpandBox.objID, this.opendExpandBox.objSeq, event); // 셀럭터 외의 영역이 므로 닫기
			AXReqAbort(); /* AJAX 호출 중지 하기 */
		}

		var jqueryTargetObjID = axdom("#" + cfg.targetID + "_AX_" + objID);
		//trace({objID:objID, objSeq:objSeq});

		if (axdom("#" + cfg.targetID + "_AX_" + objID).data("blurEvent")) {
			//blur event 발생 상태 메소드 작동 중지
			return;
		}

		//Selector Option box Expand
		if (isToggle) { // 활성화 여부가 토글 이면
			if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
				//비활성 처리후 메소드 종료
				return;
			}
		}
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 활성화 전에 개체 삭제 처리
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
		//Expand Box 생성 구문 작성
		var anchorWidth = jqueryTargetObjID.width() - 2; // anchor width
		var anchorHeight = jqueryTargetObjID.data("height") - 1;
		var styles = [];
		styles.push("top:" + anchorHeight + "px");
		styles.push("width:" + (obj.config.anchorWidth || anchorWidth) + "px");
		styles.push("z-index:5100");

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandBox\" class=\"bindSelectorNodes " + cfg.anchorSelectorExpandBoxClassName + "\" style=\"" + styles.join(";") + "\">");
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll\" class=\"bindSelectorNodes " + cfg.anchorSelectorExpandScrollClassName + "\">");
		po.push("	<div class=\"AXLoadingSmall bindSelectorNodes\"></div>");
		po.push("</div>");
		po.push("</div>");
		axdom(document.body).append(po.join(''));
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").addClass("on");

		var expandBox = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox");
		if (obj.config.positionFixed) {
			expandBox.css({ "position": "fixed" });
		}
		var expBoxHeight = expandBox.outerHeight();
		var offset = (obj.config.positionFixed) ? jqueryTargetObjID.position() : jqueryTargetObjID.offset();
		if (obj.config.position) {
			offset = jqueryTargetObjID.offset();
			if (obj.config.position.top != undefined) {
				offset.top = obj.config.position.top;
			}
		}
		var css = {};
		css.top = offset.top + anchorHeight;
		css.left = offset.left;
		expandBox.css(css);

		this.opendExpandBox = { objID: objID, objSeq: objSeq };

		//_AX_expandBox set options
		//trace(obj.config.ajaxUrl);
		if (obj.config.onsearch) {
			this.bindSelectorKeyupChargingUp(objID, objSeq, event);
		} else if (obj.config.ajaxUrl) {
			// AJAX호출
			this.bindSelectorKeyupChargingUp(objID, objSeq, event);
		} else {
			if (!obj.config.options) {
				trace("options 항목이 없어 bind selector 를 완성 할 수 없습니다.");
				return;
			}
			this.bindSelectorSetOptions(objID, objSeq);
			this.bindSelectorKeyupChargingUp(objID, objSeq, event);
		}

		var bindSelectorOptionsClick = this.bindSelectorOptionsClick.bind(this);
		obj.documentclickEvent = function (event) {
			bindSelectorOptionsClick(objID, objSeq, event);
		}
		axdom(document).unbind("click.AXInput").bind("click.AXInput", obj.documentclickEvent);

	},
	bindSelectorBlur: function (objID) {
		var cfg = this.config;
		var objSeq = null;
		axf.each(this.objects, function (idx, O) {
			//if (this.id == objID && this.isDel == true) objSeq = idx;
			if (this.id == objID) {
				objSeq = idx;
			}
		});
		if (objSeq != null) this.bindSelectorClose(objID, objSeq);
	},
	bindSelectorClose: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];

		var cfg = this.config;
		if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");

			//비활성 처리후 메소드 종료

			axdom(document).unbind("click.AXInput");
			obj.bindTarget.unbind("keydown.AXInput");
			obj.bindTarget.unbind("change.AXInput");

			if(obj.bindTarget.data("val") == obj.bindTarget.val().enc() && !obj.config.isSelectorClick) {
				return obj.bindTarget.val();
			}

			if (obj.config.isChangedSelect) {

				var myVal = "";
				if (obj.config.selectedObject) {
					myVal = obj.config.selectedObject.optionText.dec();
				}

				if (obj.config.appendable) {
					//trace(myVal);
					if (myVal != "") axdom("#" + objID).val(myVal);
				} else {
					axdom("#" + objID).val(myVal);
				}

				if (obj.config.onChange || obj.config.onchange) {
					var sendObj = {
						targetID: objID,
						options: obj.config.options,
						selectedIndex: obj.config.selectedIndex,
						selectedOption: obj.config.selectedObject
					}
					if (obj.config.onChange) obj.config.onChange.call(sendObj);
					else if (obj.config.onchange) obj.config.onchange.call(sendObj);
				}
				obj.config.isChangedSelect = false;
			}
			//trace(obj.config.selectedObject);
			if (obj.config.selectedObject) this.bindSelectorInputChange(objID, objSeq);
			else {
				if (!obj.config.appendable) {
					if (!obj.config.selectedObject && !obj.inProgress) axdom("#" + objID).val("");
				}
			}
			//if(event) event.stopPropagation(); // disableevent
			//return;
		}
	},
	bindSelectorSetOptions: function (objID, objSeq) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var maxHeight = obj.config.maxHeight || 130;
		var optionPrintLength = obj.config.optionPrintLength || 100;
		if (!obj.config.options) return;

		var po = [];
		axf.each(obj.config.options, function (index, O) {
			if (!isNaN(optionPrintLength)) {
				if (index > optionPrintLength - 1) return false;
			}
			var descStr = (O.desc || O.optionDesc || "").dec();
			if (descStr != "") descStr = "<span>" + descStr + "</span>";
			po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option\" class=\"bindSelectorNodes\">" + O.optionText.dec() + descStr + "</a>");
		});
		if (po.length == 0) {
			var selectorOptionEmpty = "";
			if (AXConfig.AXInput) selectorOptionEmpty = (AXConfig.AXInput.selectorOptionEmpty || "empty options");
			po.push("<div class=\"empty\">" + selectorOptionEmpty + "</div>");
		}
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll").html(po.join(''));
		obj.config.isSelectorClick = false;

		var expandScrollHeight = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandScroll").outerHeight();
		if (expandScrollHeight > maxHeight) expandScrollHeight = maxHeight;
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").css({ height: expandScrollHeight + "px" });

		var bindSelectorOptionsClick = this.bindSelectorOptionsClick.bind(this);
		obj.documentclickEvent = function (event) {
			bindSelectorOptionsClick(objID, objSeq, event);
		}
		var bindSelectorKeyup = this.bindSelectorKeyup.bind(this);
		obj.inputKeyup = function (event) {
			bindSelectorKeyup(objID, objSeq, event);
		}

		axdom(document).unbind("click.AXInput").bind("click.AXInput", obj.documentclickEvent);
		axdom("#" + objID).unbind("keydown.AXInput").bind("keydown.AXInput", obj.inputKeyup);

		if (obj.myUIScroll) obj.myUIScroll.unbind();
		obj.myUIScroll = new AXScroll();
		obj.myUIScroll.setConfig({
			CT_className: "AXScrollSmall",
			targetID: cfg.targetID + "_AX_" + objID + "_AX_expandBox",
			scrollID: cfg.targetID + "_AX_" + objID + "_AX_expandScroll",
			touchDirection: false
		});
		obj.myUIScroll.scrollTop(0);

		if (obj.config.selectedIndex != undefined) {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.config.selectedIndex + "_AX_option").addClass("on");
			obj.myUIScroll.focusElement(cfg.targetID + "_AX_" + objID + "_AX_" + obj.config.selectedIndex + "_AX_option"); //focus
			obj.config.focusedIndex = obj.config.selectedIndex;
		}

	},
	bindSelectorOptionsClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;

		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;

		var myTarget = this.getEventTarget({
			evt: eventTarget,
			until: function (evt, evtIDs) {
				return (evt.parentNode.tagName == "body") ? true : false;
			},
			find: function (evt, evtIDs) {
				if (evt.id == "") return false;
				if (evt.id == objID || axdom(evt).hasClass("bindSelectorNodes")) {
					return true;
				} else {
					return false;
				}
			}
		});
		var isSelectorClick = (myTarget) ? true : false;
		if (!isSelectorClick) {
			this.bindSelectorClose(objID, objSeq, event); // 셀럭터 외의 영역이 므로 닫기
			AXReqAbort(); /* AJAX 호출 중지 하기 */
		} else {
			eid = myTarget.id.split(/_AX_/g);

			if (eid.last() == "option") {
				var selectedIndex = eid[eid.length - 2];
				obj.config.selectedIndex = selectedIndex;
				obj.config.focusedIndex = selectedIndex;
				obj.config.selectedObject = obj.config.options[selectedIndex];
				obj.config.isChangedSelect = true;
				obj.config.isSelectorClick = true;
				this.bindSelectorClose(objID, objSeq, event); // 값 전달 후 닫기
			}
		}
	},
	bindSelectorKeyup: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;

		if (obj.inProgress) {
			obj.inProgressReACT = true;
			return;
		}

		if (event.keyCode == AXUtil.Event.KEY_TAB) {
			this.bindSelectorClose(objID, objSeq, event); // 닫기
			return;
		}

		if (event.keyCode == AXUtil.Event.KEY_UP) {
			if (!obj.config.options) return;
			if (obj.config.options.length == 0) return;
			var focusIndex = obj.config.options.length - 1;
			if (obj.config.focusedIndex == undefined || obj.config.focusedIndex == 0) {
				//trace(obj.config.selectedIndex+"//"+focusIndex);
			} else {
				focusIndex = (obj.config.focusedIndex) - 1;
				//trace(obj.config.selectedIndex+"//"+focusIndex);
			}
			this.bindSelectorSelect(objID, objSeq, focusIndex);
		} else if (event.keyCode == AXUtil.Event.KEY_DOWN) {
			if (!obj.config.options) return;
			if (obj.config.options.length == 0) return;
			var focusIndex = 0;
			if (obj.config.focusedIndex == undefined || obj.config.focusedIndex == obj.config.options.length - 1) {
				//trace(obj.config.selectedIndex+"//"+focusIndex);
			} else {
				focusIndex = (obj.config.focusedIndex).number() + 1;
				//trace(obj.config.selectedIndex+"//"+focusIndex);
			}
			this.bindSelectorSelect(objID, objSeq, focusIndex);
		} else if (event.keyCode == AXUtil.Event.KEY_RETURN) {
			if (obj.config.focusedIndex == null) {
				/*axdom("#" + objID).blur();*/
				this.bindSelectorClose(objID, objSeq, event); // 닫기
				return;
			} else {
				//trace(obj.config.focusedIndex);
				obj.config.selectedObject = obj.config.options[obj.config.focusedIndex];
				obj.config.selectedIndex = obj.config.focusedIndex;
				obj.config.isChangedSelect = true;
				axdom("#" + objID).val(obj.config.selectedObject.optionText.dec());
				/*axdom("#" + objID).blur();*/
				this.bindSelectorClose(objID, objSeq, event); // 닫기
				return;
			}
		} else {
			//1. 반복입력 제어 하기
			var bindSelectorKeyupChargingUp = this.bindSelectorKeyupChargingUp.bind(this);
			if (obj.Observer) clearTimeout(obj.Observer); //명령 제거
			obj.Observer = setTimeout(function () {
				bindSelectorKeyupChargingUp(objID, objSeq, event);
			}, 500);
		}
	},
	bindSelectorKeyupChargingUp: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;

		var objVal = axdom("#" + objID).val();
		var bindSelectorSearch = this.bindSelectorSearch.bind(this);

		if (obj.config.onsearch) {

			var res = obj.config.onsearch.call({
				id: objID,
				value: objVal
			}, objID, objVal);

			if (!res) {
				res = { options: [] };
			}
			obj.config.options = res.options;
			//obj.config.selectedIndex = null;
			obj.config.focusedIndex = null;
			//obj.config.selectedObject = null;
			//obj.config.isChangedSelect = true;
			this.bindSelectorSetOptions(objID, objSeq);

		} else if (obj.config.ajaxUrl) {
			// AJAX호출
			// 2. AJAX request
			// 3. AJAX 결과로 bindSelectorSetOptions 처리하기
			//this.bindSelectorSetOptions(objID, objSeq);
			// 4. 입력어로 bindSelectorSearch 실행하기
			obj.inProgress = true; //진행중 상태 변경
			var bindSelectorSetOptions = this.bindSelectorSetOptions.bind(this);
			var bindSelectorKeyupChargingUp = this.bindSelectorKeyupChargingUp.bind(this);
			var url = obj.config.ajaxUrl;
			var pars = obj.config.ajaxPars;
			var selectorName = obj.config.selectorName || axdom("#" + objID).attr("name");
			if (pars == "") {
				pars = selectorName + "=" + (objVal||"").enc();
			} else if ((typeof pars).toLowerCase() == "string") {
				pars += "&" + selectorName + "=" + objVal.enc();
			} else if ((typeof pars).toLowerCase() == "object") {
				pars[selectorName] = objVal.enc();
			}
			var msgAlert = this.msgAlert.bind(this);
			new AXReq(url, {
				debug: false, pars: pars, onsucc: function (res) {
					if ((res.result && res.result == AXConfig.AXReq.okCode) || (res.result == undefined && !res.error)) {

						obj.config.options = (res.options || []);
						//obj.config.selectedIndex = null;
						obj.config.focusedIndex = null;
						//obj.config.selectedObject = null;
						//obj.config.isChangedSelect = true;
						bindSelectorSetOptions(objID, objSeq);
						bindSelectorSearch(objID, objSeq, objVal);

						if (obj.inProgressReACT) {
							bindSelectorKeyupChargingUp(objID, objSeq, event);
						}
					} else {
						msgAlert(res);
					}
					obj.inProgress = false;
					obj.inProgressReACT = false;
				}
			});
		} else {
			// 입력어로 bindSelectorSearch 실행하기
			//alert(objVal);
			bindSelectorSearch(objID, objSeq, objVal);
		}
	},
	bindSelectorInputChange: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (axdom("#" + objID).val() != obj.config.selectedObject.optionText.dec()) {
			if (!obj.config.appendable) axdom("#" + objID).val("");
			obj.config.selectedObject = null;
			obj.config.selectedIndex = null;
			obj.config.focusedIndex = null;
			if (obj.config.onChange) {
				obj.config.onChange(null);
			} else if (obj.config.onchange) {
				obj.config.onchange(null);
			}
		}
	},
	bindSelectorSetValue: function (objID, objSeq, value) {
		var obj = this.objects[objSeq];
		var cfg = this.config;

		if (!obj.config.options) return;
		//trace(obj.config.options);

		var selectedIndex = null;
		axf.each(obj.config.options, function (oidx, opt) {
			if (opt.optionValue == value) selectedIndex = oidx;
		});

		if (selectedIndex != null) {
			obj.config.focusedIndex = selectedIndex;
			obj.config.selectedObject = obj.config.options[selectedIndex];
			obj.config.isChangedSelect = true;
			axdom("#" + objID).val(obj.config.selectedObject.optionText.dec());

			if (obj.config.onChange || obj.config.onchange) {
				var sendObj = {
					targetID: objID,
					options: obj.config.options,
					selectedIndex: obj.config.selectedIndex,
					selectedOption: obj.config.selectedObject
				}
				if (obj.config.onChange) obj.config.onChange.call(sendObj);
				else if (obj.config.onchange) obj.config.onchange.call(sendObj);
			}
		}
	},
	bindSelectorSearch: function (objID, objSeq, kword) { // 입력된 값으로 검색 하기
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (kword == "") {
			this.bindSelectorSelectClear(objID, objSeq);
			return;
		}
		kword = kword.replace(/\//g, "\\\/");
		var sw = AXUtil.consonantKR((kword || "").dec());
		//trace(sw);
		eval("var reAt= /^" + sw + ".*/i");
		var ix = null;
		for (var a = 0; a < obj.config.options.length; a++) {
			if (reAt.test((obj.config.options[a].optionText || "").dec())) {
				ix = a;
				break;
			}
		}
		if (ix != null) {
			this.bindSelectorSelect(objID, objSeq, ix, "dont change value");
		} else {
			this.bindSelectorSelectClear(objID, objSeq);
		}
	},
	bindSelectorSelect: function (objID, objSeq, index, changeValue) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (obj.config.focusedIndex != undefined) {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.config.focusedIndex + "_AX_option").removeClass("on");
		}
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option").addClass("on");
		obj.config.focusedIndex = index;
		//obj.config.selectedObject = obj.config.options[index];
		//obj.config.isChangedSelect = true;
		//if(!changeValue) axdom("#"+objID).val(obj.config.selectedObject.optionText.dec());
		obj.myUIScroll.focusElement(cfg.targetID + "_AX_" + objID + "_AX_" + index + "_AX_option"); //focus
	},
	bindSelectorSelectClear: function (objID, objSeq) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (obj.config.selectedIndex != undefined) {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_" + obj.config.selectedIndex + "_AX_option").removeClass("on");
		}
		obj.config.selectedIndex = null;
		obj.config.focusedIndex = null;
		obj.config.selectedObject = null;
		obj.config.isChangedSelect = true;
	},

	// slider
	bindSlider: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderBox").remove();

		var w = obj.bindAnchorTarget.width();
		var h = obj.bindAnchorTarget.data("height");
		//trace(h);
		var objVal = obj.bindTarget.val().number().money();
		if (objVal.number() < obj.config.min.number()) objVal = obj.config.min;
		else if (objVal.number() > obj.config.max.number()) objVal = obj.config.max;

		if (!obj.config.unit) obj.config.unit = "";

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderBox\" class=\"" + cfg.anchorSliderBoxClassName + "\" style=\"left:0px;width:" + w + "px;height:" + h + "px;\">");
		po.push("	<div class=\"AXanchorSliderMinTitle\">" + obj.config.min.number().money() + obj.config.unit + "</div>");
		po.push("	<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar\" class=\"AXanchorSliderBar\">");
		po.push("		<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside\" class=\"AXanchorSliderBarInside\"><div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle\" class=\"AXanchorSliderHandleTitle\">" + objVal.number().money() + obj.config.unit + "</div></div>");
		po.push("		<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle\" class=\"AXanchorSliderHandle\">handle</a>");
		po.push("	</div>");
		po.push("	<div class=\"AXanchorSliderMaxTitle\">" + obj.config.max.number().money() + obj.config.unit + "</div>");
		po.push("</div>");

		//append to anchor
		obj.bindAnchorTarget.append(po.join(''));
		//obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });
		obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });
		//, background:"#eee"


		var maxTitleWidth = axdom("#" + cfg.targetID + "_AX_" + objID).find(".AXanchorSliderMaxTitle").outerWidth().number() + 10;
		var minTitleWidth = axdom("#" + cfg.targetID + "_AX_" + objID).find(".AXanchorSliderMinTitle").outerWidth().number() + 10;
		if (maxTitleWidth < 30) maxTitleWidth = 30;
		if (minTitleWidth < 30) minTitleWidth = 30;
		axdom("#" + cfg.targetID + "_AX_" + objID).find(".AXanchorSliderMinTitle").css({ width: minTitleWidth + "px" });
		axdom("#" + cfg.targetID + "_AX_" + objID).find(".AXanchorSliderMaxTitle").css({ width: maxTitleWidth + "px" });
		var sliderBarWidth = w - minTitleWidth - maxTitleWidth;
		obj.bindAnchorTarget.find(".AXanchorSliderBar").css({ width: sliderBarWidth + "px", left: minTitleWidth + "px", top: h / 2 + 2 });
		//------------------------------------
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").css({ width: maxTitleWidth });
		obj.config._maxTitleWidth = maxTitleWidth;
		obj.config._handleWidth = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").width();
		obj.config._trackWidth = sliderBarWidth;
		this.bindSliderSetValue(objID, objSeq);

		var onmousedown = this.bindSliderMouseDown.bind(this);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").unbind("mousedown.AXInput").bind("mousedown.AXInput", function () {
			onmousedown(objID, objSeq);
		});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").unbind("dragstart.AXInput").bind("dragstart.AXInput", function (event) {
			event.stopPropagation(); // disable  event
			return false;
		});

		//add touch event
		if (document.addEventListener) {
			var ontouchstart = this.sliderTouchStart.bind(this);
			obj.bindSliderTouchStart = function (event) { ontouchstart(objID, objSeq); }

			AXgetId(cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").addEventListener("touchstart", obj.bindSliderTouchStart, false);
		}

		obj.bindAnchorTarget.show();
		obj.bindTarget.hide();

	},
	bindSliderMouseDown: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if (!obj.config.isMoving) {
			var bindSliderMouseMove = this.bindSliderMouseMove.bind(this);
			obj.bindSliderMouseMove = function (event) {
				bindSliderMouseMove(objID, objSeq, event);
			};
			var bindSliderMouseUp = this.bindSliderMouseUp.bind(this);
			obj.bindSliderMouseUp = function (event) {
				bindSliderMouseUp(objID, objSeq, event);
			};
			axdom(document.body).unbind("mousemove.AXInput").bind("mousemove.AXInput", obj.bindSliderMouseMove);
			axdom(document.body).unbind("mouseup.AXInput").bind("mouseup.AXInput", obj.bindSliderMouseUp);
			obj.config.isMoving = true;
		}

	},
	bindSliderMouseMove: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var eX = event.pageX;
		var cX = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar").offset().left;

		var rX = eX - cX;

		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var objVal = (rX * valueWidth) / pixelWidth;
		var snap = obj.config.snap;
		if (typeof snap == "undefined") snap = 1;

		if (snap >= 1) {
			objVal = (objVal.number() + obj.config.min.number()).round();
			objVal = (parseInt(objVal / (snap), 10) * (snap));
		} else {
			objVal = (objVal.number() + obj.config.min.number()).round((snap.toString().length - 2));
			objVal = (parseFloat(objVal / (snap)) * (snap)).round((snap.toString().length - 2));
		}

		var rX = ((objVal - obj.config.min) * pixelWidth) / valueWidth;

		if (objVal < obj.config.min) {
			objVal = obj.config.min;
			rX = 0;
		} else if (objVal > obj.config.max) {
			objVal = obj.config.max;
			rX = pixelWidth;
		}
		if (rX > pixelWidth) rX = pixelWidth;

		var sX = rX - (obj.config._handleWidth / 2);
		var stX = rX - (obj.config._maxTitleWidth / 2);

		//trace({rX:rX, pixelWidth:pixelWidth, objVal:objVal, valueWidth:valueWidth});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").css({ left: sX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ width: rX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").css({ left: stX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").text(objVal.number().money() + obj.config.unit);
		axdom("#" + objID).val(objVal);
	},
	bindSliderMouseUp: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var objVal = axdom("#" + objID).val();
		if (obj.config.onChange || obj.config.onchange) {
			var onchange = obj.config.onChange || obj.config.onchange;
			onchange.call({ id: objID, value: objVal }, objID, objVal);
		}

		axdom(document.body).unbind("mousemove.AXInput");
		axdom(document.body).unbind("mouseup.AXInput");
		obj.config.isMoving = false;
	},
	bindSliderSetValue: function (objID, objSeq, value) {

		var cfg = this.config;
		var obj = this.objects[objSeq];


		if (value != undefined) {
			var objVal = value;
		} else {
			var objVal = axdom("#" + objID).val();
		}

		if (objVal.number() < obj.config.min.number()) objVal = obj.config.min;
		else if (objVal.number() > obj.config.max.number()) objVal = obj.config.max;
		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var pixelLeft = ((objVal - obj.config.min) * pixelWidth) / valueWidth;

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").css({ left: pixelLeft - (obj.config._handleWidth / 2) });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ width: pixelLeft });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").css({ left: pixelLeft - (obj.config._maxTitleWidth / 2) });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").text(objVal.number().money() + obj.config.unit);

		axdom("#" + objID).val(objVal);
	},
	sliderTouchStart: function (objID, objSeq) {
		//alert(objID+"_"+ objSeq);
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if (!obj.config.isMoving) {
			var bindSliderTouchMove = this.sliderTouchMove.bind(this);
			obj.bindSliderTouchMove = function (event) {
				bindSliderTouchMove(objID, objSeq, event);
			};
			var bindSliderTouchEnd = this.sliderTouchEnd.bind(this);
			obj.bindSliderTouchEnd = function (event) {
				bindSliderTouchEnd(objID, objSeq, event);
			};

			if (document.addEventListener) {
				document.addEventListener("touchmove", obj.bindSliderTouchMove, false);
				document.addEventListener("touchend", obj.bindSliderTouchEnd, false);

			}
			obj.config.isMoving = true;

		}

	},
	sliderTouchMove: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		event.preventDefault();
		var touch = event.touches[0];

		var eX = touch.pageX;
		var cX = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar").offset().left;
		var rX = eX - cX;

		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var objVal = (rX * valueWidth) / pixelWidth;
		var snap = obj.config.snap;
		if (!snap) snap = 1;
		objVal = (objVal.number() + obj.config.min.number()).round();
		objVal = parseInt(objVal / (snap)) * (snap);
		var rX = ((objVal - obj.config.min) * pixelWidth) / valueWidth;

		if (objVal < obj.config.min) {
			objVal = obj.config.min;
			rX = 0;
		} else if (objVal > obj.config.max) {
			objVal = obj.config.max;
			rX = pixelWidth;
		}
		if (rX > pixelWidth) rX = pixelWidth;

		var sX = rX - (obj.config._handleWidth / 2);
		var stX = rX - (obj.config._maxTitleWidth / 2);

		//trace({rX:rX, pixelWidth:pixelWidth, objVal:objVal, valueWidth:valueWidth});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandle").css({ left: sX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ width: rX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").css({ left: stX });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleTitle").text(objVal.number().money() + obj.config.unit);
		axdom("#" + objID).val(objVal);
		if (obj.config.onChange) obj.config.onChange(objID, objVal);
		else if (obj.config.onchange) obj.config.onchange(objID, objVal);
	},
	sliderTouchEnd: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var objVal = axdom("#" + objID).val();

		if (obj.config.onChange || obj.config.onchange) {
			var onchange = obj.config.onChange || obj.config.onchange;
			onchange.call({ id: objID, value: objVal }, objID, objVal);
		}

		if (document.addEventListener) {
			document.removeEventListener("touchmove", obj.bindSliderTouchMove, false);
			document.removeEventListener("touchend", obj.bindSliderTouchEnd, false);
		}
		obj.config.isMoving = false;
	},

	// twinSlider
	bindTwinSliderGetVals: function (objValString, separator) {
		var objVals = objValString.split(separator);
		var objVal = { min: 0, max: 0 };
		if (objVals.length < 2) {
			objVal = { min: objVals[0], max: objVals[0] };
		} else {
			objVal = { min: objVals[0], max: objVals[1] };
		}
		return objVal;
	},
	bindTwinSlider: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		var w = obj.bindAnchorTarget.width();
		var h = obj.bindAnchorTarget.data("height");
		var objValString = obj.bindTarget.val();
		var separator = obj.config.separator || "~";
		var objVal = this.bindTwinSliderGetVals(objValString, separator);
		obj.vals = objVal;

		if (objVal.min.number() < obj.config.min.number()) objVal.min = obj.config.min;
		else if (objVal.min.number() > obj.config.max.number()) objVal.min = obj.config.max;
		if (objVal.max.number() < obj.config.min.number()) objVal.max = obj.config.min;
		else if (objVal.max.number() > obj.config.max.number()) objVal.max = obj.config.max;

		if (!obj.config.unit) obj.config.unit = "";

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderBox\" class=\"" + cfg.anchorSliderBoxClassName + "\" style=\"left:0px;width:" + w + "px;height:" + h + "px;\">");
		po.push("	<a " + obj.config.href + " class=\"AXanchorSliderMinTitle\">" + obj.config.min.number().money() + obj.config.unit + "</a>");
		po.push("	<a " + obj.config.href + " class=\"AXanchorSliderMaxTitle\">" + obj.config.max.number().money() + obj.config.unit + "</a>");
		po.push("	<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar\" class=\"AXanchorSliderBar\">");
		po.push("		<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside\" class=\"AXanchorSliderBarInside\"></div>");
		po.push("		<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle\" class=\"AXanchorSliderHandleMinTitle\">" + objVal.min.number().money() + obj.config.unit + "</div>");
		po.push("		<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle\" class=\"AXanchorSliderHandleMaxTitle\">" + objVal.max.number().money() + obj.config.unit + "</div>");
		po.push("		<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin\" class=\"AXanchorSliderHandleMin\">handleMin</a>");
		po.push("		<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax\" class=\"AXanchorSliderHandleMax\">handleMax</a>");
		po.push("	</div>");
		po.push("</div>");

		//append to anchor
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });
		//, background:"#eee"
		obj.bindAnchorTarget.show();
		obj.bindTarget.hide();

		var maxTitleWidth = obj.bindAnchorTarget.find(".AXanchorSliderMaxTitle").outerWidth().number() + 10;
		var minTitleWidth = obj.bindAnchorTarget.find(".AXanchorSliderMinTitle").outerWidth().number() + 10;
		obj.bindAnchorTarget.find(".AXanchorSliderMinTitle").css({ width: minTitleWidth + "px" });
		obj.bindAnchorTarget.find(".AXanchorSliderMaxTitle").css({ width: maxTitleWidth + "px" });
		var sliderBarWidth = w - minTitleWidth - maxTitleWidth;
		obj.bindAnchorTarget.find(".AXanchorSliderBar").css({ width: sliderBarWidth + "px", left: minTitleWidth + "px", top: h / 2 + 2 });
		//------------------------------------
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").css({ width: maxTitleWidth });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").css({ width: maxTitleWidth });
		obj.config._maxTitleWidth = maxTitleWidth;
		obj.config._handleWidth = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").width();
		obj.config._trackWidth = sliderBarWidth;
		this.bindTwinSliderSetValue(objID, objSeq);

		var onmousedown = this.bindTwinSliderMouseDown.bind(this);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").unbind("mousedown.AXInput").bind("mousedown.AXInput", function () {
			onmousedown(objID, objSeq, "min");
		});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").unbind("mousedown.AXInput").bind("mousedown.AXInput", function () {
			onmousedown(objID, objSeq, "max");
		});

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").unbind("dragstart.AXInput").bind("dragstart.AXInput", function (event) {
			event.stopPropagation(); // disable  event
			return false;
		});
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").unbind("dragstart.AXInput").bind("dragstart.AXInput", function (event) {
			event.stopPropagation(); // disable  event
			return false;
		});

		//add touch event
		if (document.addEventListener) {
			var ontouchstart = this.twinSliderTouchStart.bind(this);
			obj.bindTwinSliderTouchStartMin = function (event) { ontouchstart(objID, objSeq, "min"); }
			obj.bindTwinSliderTouchStartMax = function (event) { ontouchstart(objID, objSeq, "max"); }

			AXgetId(cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").addEventListener("touchstart", obj.bindTwinSliderTouchStartMin, false);
			AXgetId(cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").addEventListener("touchstart", obj.bindTwinSliderTouchStartMax, false);
		}

	},
	bindTwinSliderMouseDown: function (objID, objSeq, handleName) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if (!obj.config.isMoving) {
			var bindTwinSliderMouseMove = this.bindTwinSliderMouseMove.bind(this);
			obj.bindTwinSliderMouseMove = function (event) {
				bindTwinSliderMouseMove(objID, objSeq, event, handleName);
			};
			var bindTwinSliderMouseUp = this.bindTwinSliderMouseUp.bind(this);
			obj.bindTwinSliderMouseUp = function (event) {
				bindTwinSliderMouseUp(objID, objSeq, event, handleName);
			};
			axdom(document.body).unbind("mousemove.AXInput").bind("mousemove.AXInput", obj.bindTwinSliderMouseMove);
			axdom(document.body).unbind("mouseup.AXInput").bind("mouseup.AXInput", obj.bindTwinSliderMouseUp);
			obj.config.isMoving = true;
		}

	},
	bindTwinSliderMouseMove: function (objID, objSeq, event, handleName) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var eX = event.pageX;
		var cX = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar").offset().left;

		var rX = eX - cX;

		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var objVal = (rX * valueWidth) / pixelWidth;
		var snap = obj.config.snap;
		if (!snap) snap = 1;
		objVal = (objVal.number() + obj.config.min.number()).round();
		objVal = parseInt(objVal / (snap)) * (snap);
		var rX = ((objVal - obj.config.min) * pixelWidth) / valueWidth;

		if (objVal < obj.config.min) {
			objVal = obj.config.min;
			rX = 0;
		} else if (objVal > obj.config.max) {
			objVal = obj.config.max;
			rX = pixelWidth;
		}
		if (rX > pixelWidth) rX = pixelWidth;

		//trace({rX:rX, pixelWidth:pixelWidth, objVal:objVal, valueWidth:valueWidth});
		if (handleName == "min") {
			if (objVal > obj.vals.max) {
				objVal = obj.vals.max;
				rX = obj.handleMaxLeft;
			}
			var sX = rX - (obj.config._handleWidth);
			var stX = rX - (obj.config._maxTitleWidth);
			obj.handleMinLeft = rX;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").css({ left: sX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").css({ left: stX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").text(objVal.number().money() + obj.config.unit);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ width: rX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ left: obj.handleMinLeft, width: obj.handleMaxLeft - obj.handleMinLeft });
			//axdom("#"+objID).val(objVal);
			obj.vals.min = objVal;
		} else {
			if (objVal < obj.vals.min) {
				objVal = obj.vals.min;
				rX = obj.handleMinLeft;
			}
			var sX = rX;
			var stX = rX;
			obj.handleMaxLeft = rX;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").css({ left: sX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").css({ left: stX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").text(objVal.number().money() + obj.config.unit);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ left: obj.handleMinLeft, width: obj.handleMaxLeft - obj.handleMinLeft });
			//axdom("#"+objID).val(objVal);
			obj.vals.max = objVal;
		}
		var separator = obj.config.separator || "~";
		axdom("#" + objID).val(obj.vals.min + separator + obj.vals.max);

	},
	bindTwinSliderMouseUp: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var objVal = axdom("#" + objID).val();
		if (obj.config.onChange || obj.config.onchange) {
			var onchange = obj.config.onChange || obj.config.onchange;
			onchange.call({ id: objID, value: objVal }, objID, objVal);
		}

		axdom(document.body).unbind("mousemove.AXInput");
		axdom(document.body).unbind("mouseup.AXInput");
		obj.config.isMoving = false;
	},
	bindTwinSliderSetValue: function (objID, objSeq, value) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		if (value != undefined) {
			var objValString = value;
		} else {
			var objValString = axdom("#" + objID).val();
		}

		var separator = obj.config.separator || "~";
		var objVal = this.bindTwinSliderGetVals(objValString, separator);
		obj.vals = objVal;

		if (objVal.min.number() < obj.config.min.number()) objVal.min = obj.config.min;
		else if (objVal.min.number() > obj.config.max.number()) objVal.min = obj.config.max;
		if (objVal.max.number() < obj.config.min.number()) objVal.max = obj.config.min;
		else if (objVal.max.number() > obj.config.max.number()) objVal.max = obj.config.max;

		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var pixelMinLeft = ((objVal.min - obj.config.min) * pixelWidth) / valueWidth;
		var pixelMaxLeft = ((objVal.max - obj.config.min) * pixelWidth) / valueWidth;

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").css({ left: pixelMinLeft - (obj.config._handleWidth) });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").css({ left: pixelMinLeft - (obj.config._maxTitleWidth) });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").text(objVal.min.number().money() + obj.config.unit);

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").css({ left: pixelMaxLeft });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").css({ left: pixelMaxLeft });
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").text(objVal.max.number().money() + obj.config.unit);

		obj.handleMinLeft = pixelMinLeft;
		obj.handleMaxLeft = pixelMaxLeft;
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ left: pixelMinLeft, width: pixelMaxLeft - pixelMinLeft });

		axdom("#" + objID).val(obj.vals.min + separator + obj.vals.max);
	},
	// -- add touch event
	twinSliderTouchStart: function (objID, objSeq, handleName) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if (!obj.config.isMoving) {
			var bindTwinSliderTouchMove = this.twinSliderTouchMove.bind(this);
			obj.bindTwinSliderTouchMove = function (event) {
				bindTwinSliderTouchMove(objID, objSeq, event, handleName);
			};
			var bindTwinSliderTouchEnd = this.twinSliderTouchEnd.bind(this);
			obj.bindTwinSliderTouchEnd = function (event) {
				bindTwinSliderTouchEnd(objID, objSeq, event, handleName);
			};

			if (document.addEventListener) {
				document.addEventListener("touchmove", obj.bindTwinSliderTouchMove, false);
				document.addEventListener("touchend", obj.bindTwinSliderTouchEnd, false);

			}
			obj.config.isMoving = true;

		}

	},
	twinSliderTouchMove: function (objID, objSeq, event, handleName) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		event.preventDefault();
		var touch = event.touches[0];

		//var eX = event.pageX;
		var eX = touch.pageX;
		var cX = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderBar").offset().left;
		var rX = eX - cX;

		var valueWidth = obj.config.max.number() - obj.config.min.number();
		var pixelWidth = obj.config._trackWidth;
		var objVal = (rX * valueWidth) / pixelWidth;
		var snap = obj.config.snap;
		if (!snap) snap = 1;
		objVal = (objVal.number() + obj.config.min.number()).round();
		objVal = parseInt(objVal / (snap)) * (snap);
		var rX = ((objVal - obj.config.min) * pixelWidth) / valueWidth;

		if (objVal < obj.config.min) {
			objVal = obj.config.min;
			rX = 0;
		} else if (objVal > obj.config.max) {
			objVal = obj.config.max;
			rX = pixelWidth;
		}
		if (rX > pixelWidth) rX = pixelWidth;

		//trace({rX:rX, pixelWidth:pixelWidth, objVal:objVal, valueWidth:valueWidth});

		if (handleName == "min") {
			if (objVal > obj.vals.max) {
				objVal = obj.vals.max;
				rX = obj.handleMaxLeft;
			}
			var sX = rX - (obj.config._handleWidth);
			var stX = rX - (obj.config._maxTitleWidth);
			obj.handleMinLeft = rX;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMin").css({ left: sX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").css({ left: stX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMinTitle").text(objVal.number().money() + obj.config.unit);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ width: rX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ left: obj.handleMinLeft, width: obj.handleMaxLeft - obj.handleMinLeft });
			//axdom("#"+objID).val(objVal);
			obj.vals.min = objVal;
		} else {
			if (objVal < obj.vals.min) {
				objVal = obj.vals.min;
				rX = obj.handleMinLeft;
			}
			var sX = rX;
			var stX = rX;
			obj.handleMaxLeft = rX;
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMax").css({ left: sX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").css({ left: stX });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderHandleMaxTitle").text(objVal.number().money() + obj.config.unit);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SliderInside").css({ left: obj.handleMinLeft, width: obj.handleMaxLeft - obj.handleMinLeft });
			//axdom("#"+objID).val(objVal);
			obj.vals.max = objVal;
		}
		var separator = obj.config.separator || "~";
		axdom("#" + objID).val(obj.vals.min + separator + obj.vals.max);
		if (obj.config.onChange) obj.config.onChange(objID, obj.vals.min + separator + obj.vals.max);
		else if (obj.config.onchange) obj.config.onchange(objID, obj.vals.min + separator + obj.vals.max);
	},
	twinSliderTouchEnd: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var objVal = axdom("#" + objID).val();
		if (obj.config.onChange || obj.config.onchange) {
			var onchange = obj.config.onChange || obj.config.onchange;
			onchange.call({ id: objID, value: objVal }, objID, objVal);
		}

		document.removeEventListener("touchmove", obj.bindTwinSliderTouchMove, false);
		document.removeEventListener("touchend", obj.bindTwinSliderTouchEnd, false);

		obj.config.isMoving = false;
	},

	// switch
	bindSwitch: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		var w = obj.bindAnchorTarget.width();
		var h = obj.bindAnchorTarget.data("height");
		var objVal = obj.bindTarget.val();
		var switchValue = obj.config.on;
		if (objVal == switchValue) {
			obj.switchValue = "on";
		} else {
			switchValue = obj.config.off;
			obj.switchValue = "off";
		}
		obj.bindTarget.val(switchValue);

		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox\" class=\"" + cfg.anchorSwitchBoxClassName + "\" style=\"left:0px;top:0px;width:" + w + "px;height:" + h + "px;\">");
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay\" class=\"AXanchorSwitchDisplay\" style=\"height:" + h + "px;line-height:" + h + "px;\">" + switchValue + "</div>");
		po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SwitchHandle\" class=\"AXanchorSwitchHandle\" style=\"height:" + h + "px;\">handle</a>");
		po.push("</div>");

		//append to anchor
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });

		obj.bindTarget_switchBox = obj.bindAnchorTarget.find("." + cfg.anchorSwitchBoxClassName);
		obj.bindTarget_switchDisplay = obj.bindAnchorTarget.find(".AXanchorSwitchDisplay");
		obj.bindTarget_switchHandle = obj.bindAnchorTarget.find(".AXanchorSwitchHandle");

		if (obj.switchValue == "on") {
			obj.bindAnchorTarget.find("." + cfg.anchorSwitchBoxClassName).addClass("on");
		}

		//, background:"#eee"
		obj.bindAnchorTarget.show();
		obj.bindTarget.hide();

		var bindSwitchClick = this.bindSwitchClick.bind(this);
		obj.bindSwitchClick = function (event) {
			bindSwitchClick(objID, objSeq, event);
		};
		obj.bindAnchorTarget.find("." + cfg.anchorSwitchBoxClassName).unbind("click.AXInput").bind("click.AXInput", obj.bindSwitchClick);

	},
	bindSwitchClick: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		if (obj.switchValue == "on") {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox").removeClass("on");
			obj.switchValue = "off";
			axdom("#" + objID).val(obj.config.off);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay").html(obj.config.off);
		} else {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox").addClass("on");
			obj.switchValue = "on";
			axdom("#" + objID).val(obj.config.on);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay").html(obj.config.on);
		}
		if (obj.config.onChange || obj.config.onchange) {
			var sendObj = {
				targetID: objID,
				on: obj.config.on,
				off: obj.config.off,
				value: axdom("#" + objID).val()
			}
			if (obj.config.onChange) obj.config.onChange.call(sendObj);
			if (obj.config.onchange) obj.config.onchange.call(sendObj);
		}
	},
	bindSwitchSetValue: function (objID, objSeq, value) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var objVal = value;
		var switchValue = obj.config.on;
		if (objVal == switchValue) {
			obj.switchValue = "on";
		} else {
			switchValue = obj.config.off;
			obj.switchValue = "off";
		}
		axdom("#" + objID).val(switchValue);

		if (obj.switchValue == "off") {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox").removeClass("on");
			obj.switchValue = "off";
			axdom("#" + objID).val(obj.config.off);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay").html(obj.config.off);
		} else {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchBox").addClass("on");
			obj.switchValue = "on";
			axdom("#" + objID).val(obj.config.on);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SwitchDisplay").html(obj.config.on);
		}
		if (obj.config.onChange || obj.config.onchange) {
			var sendObj = {
				targetID: objID,
				on: obj.config.on,
				off: obj.config.off,
				value: axdom("#" + objID).val()
			}
			if (obj.config.onChange) obj.config.onChange.call(sendObj);
			else if (obj.config.onchange) obj.config.onchange.call(sendObj);
		}
	},
	bindSwitch_touchstart: function () {

	},
	bindSwitch_touchMove: function () {

	},
	bindSwitch_touchEnd: function () {

	},

	// segment
	bindSegment: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		var w = obj.bindAnchorTarget.width();
		var h = obj.bindAnchorTarget.data("height");
		var objVal = obj.bindTarget.val();
		var segmentOptions = obj.config.options;
		obj.selectedSegmentIndex = null;
		axf.each(segmentOptions, function (idx, seg) {
			//trace({optionValue:this.optionValue, objVal:objVal});
			if (this.optionValue == objVal) {
				obj.selectedSegmentIndex = idx;
				obj.selectedSegment = seg;
			}
		});
		if (obj.selectedSegmentIndex == null) {
			obj.selectedSegmentIndex = 0;
			obj.selectedSegment = segmentOptions[0];
		}
		obj.bindTarget.val(obj.selectedSegment.optionValue);

		var handleWidth = (w / segmentOptions.length).round() - 2;
		var po = [];
		var theme = obj.config.theme || cfg.anchorSegmentBoxClassName;
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SegmentBox\" class=\"" + theme + "\" style=\"left:0px;top:0px;width:" + w + "px;\">");
		axf.each(segmentOptions, function (idx, seg) {
			var addClass = "";
			if (idx == 0) addClass = " segmentLeft";
			else if (idx == segmentOptions.length - 1) addClass = " segmentRight";
			if (obj.selectedSegmentIndex == idx) addClass += " on";
			if (seg.addClass) addClass += " " + seg.addClass;
			po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_SegmentHandle_AX_" + idx + "\" class=\"AXanchorSegmentHandle" + addClass + "\" style=\"width:" + handleWidth + "px;\">" + seg.optionText + "</a>");
		});
		po.push("</div>");

		//append to anchor
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.css({ height: h + "px", "position": "relative", display: "inline-block", left: "auto", top: "auto" });
		var borderTop = obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css("border-top-width").number();
		var borderBot = obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css("border-bottom-width").number();
		obj.bindAnchorTarget.find(".AXanchorSegmentHandle").css({ height: (obj.bindAnchorTarget.innerHeight() - borderTop - borderBot) + "px", "line-height": (obj.bindAnchorTarget.innerHeight() - borderTop - borderBot) + "px" });

		//, background:"#eee"
		obj.bindAnchorTarget.show();
		obj.bindTarget.hide();

		var bindSegmentClick = this.bindSegmentClick.bind(this);
		obj.bindSegmentClick = function (event) {
			bindSegmentClick(objID, objSeq, event);
		};

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SegmentBox").find(".AXanchorSegmentHandle").unbind("click.AXInput").bind("click.AXInput", obj.bindSegmentClick);
	},
	bindSegmentClick: function (objID, objSeq, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var segmentOptions = obj.config.options;

		if (event.target.id == "") return;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget, evtIDs: eid,
			find: function (evt, evtIDs) { return (axdom(evt).hasClass("AXanchorSegmentHandle")) ? true : false; }
		});

		if (myTarget) {

			var seq = myTarget.id.split(/_AX_/g).last();
			if (obj.selectedSegmentIndex != seq) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SegmentHandle_AX_" + obj.selectedSegmentIndex).removeClass("on");
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SegmentHandle_AX_" + seq).addClass("on");
				obj.selectedSegmentIndex = seq;
				obj.selectedSegment = segmentOptions[seq];
			}
			//strace(obj.selectedSegment.optionValue);
			axdom("#" + objID).val(obj.selectedSegment.optionValue);
			//trace(axdom("#"+objID).val());
			if (obj.config.onChange || obj.config.onchange) {
				var sendObj = {
					targetID: objID,
					options: segmentOptions,
					selectedIndex: obj.selectedSegmentIndex,
					selectedOption: obj.selectedSegment
				};
				if (obj.config.onChange) obj.config.onChange.call(sendObj);
				else if (obj.config.onchange) obj.config.onchange.call(sendObj);
			}

		}
	},
	bindSegmentSetValue: function (objID, objSeq, value) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		var selectedSegmentIndex = obj.selectedSegmentIndex;

		var objVal = value;
		var segmentOptions = obj.config.options;
		obj.selectedSegmentIndex = null;
		axf.each(segmentOptions, function (idx, seg) {
			if (this.optionValue == objVal) {
				obj.selectedSegmentIndex = idx;
				obj.selectedSegment = seg;
			}
		});
		if (obj.selectedSegmentIndex == null) {
			obj.selectedSegmentIndex = 0;
			obj.selectedSegment = segmentOptions[0];
		}
		axdom("#" + objID).val(obj.selectedSegment.optionValue);

		if (selectedSegmentIndex != obj.selectedSegmentIndex) {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SegmentHandle_AX_" + selectedSegmentIndex).removeClass("on");
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_SegmentHandle_AX_" + obj.selectedSegmentIndex).addClass("on");
		}

		if (obj.config.onChange || obj.config.onchange) {
			var sendObj = {
				targetID: objID,
				options: segmentOptions,
				selectedIndex: obj.selectedSegmentIndex,
				selectedOption: obj.selectedSegment
			};
			if (obj.config.onChange) obj.config.onChange.call(sendObj);
			else if (obj.config.onchange) obj.config.onchange.call(sendObj);
		}

	},

	// date
	bindDate: function (objID, objSeq) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);

		var h = obj.bindAnchorTarget.data("height");
		var po = [];
		po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle\" class=\"" + cfg.anchorDateHandleClassName + "\" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">handle</a>");
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.show();

		var bindDateExpand = this.bindDateExpand.bind(this);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").unbind("click.AXInput").bind("click.AXInput", function (event) {
			bindDateExpand(objID, objSeq, true, event);
		});
		obj.bindTarget.unbind("focus.AXInput").bind("focus.AXInput", function (event) {
			obj.bindTarget.select();
			/* 포거스 되었을 때 달력 도구 오픈 처리 방식 변경 2013-07-10 오전 11:09:40
			 if(!AXgetId(cfg.targetID + "_AX_"+objID+"_AX_expandBox")){
			 bindDateExpand(objID, objSeq, false, event);
			 }
			 */
		});

		var separator = (obj.config.separator) ? obj.config.separator : "-";
		obj.bindTarget.unbind("keyup.AXInput").bind("keyup.AXInput", function (event) {
			if(event.keyCode == axf.Event.KEY_RETURN){
				//bindDateInputBlur(objID, objSeq, event);
				this.blur();
			}else if (event.keyCode != AXUtil.Event.KEY_BACKSPACE && event.keyCode != AXUtil.Event.KEY_DELETE && event.keyCode != AXUtil.Event.KEY_LEFT && event.keyCode != AXUtil.Event.KEY_RIGHT) {
				var va = this.value.replace(/\D/gi, ""); //숫자 이외의 문자를 제거 합니다.
				var _this = this;

				if (obj.config.selectType == "y") {
					if (va.length > 4) _this.value = va.left(4);
				} else if (obj.config.selectType == "m") {
					if (va.length == 4) {
						va = va + separator;
						_this.value = va;
					} else if (va.length > 4) {
						va = va.substr(0, 4) + separator + va.substr(4, 2);
						_this.value = va;
					}
				} else {
					if (va.length == 4) {
						va = va + separator;
						_this.value = va;
					} else if (va.length == 6) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator;
						_this.value = va;
					} else if (va.length == 8) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2);
						if (obj.config.expandTime) va += " ";
						_this.value = va;
					} else if (va.length == 10) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2) + " " + va.substr(8, 2) + ":";
						_this.value = va;
					} else if (va.length > 12) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2) + " " + va.substr(8, 2) + ":" + va.substr(10, 2);
						_this.value = va;
					}
				}
			}
		});

		var bindDateInputBlur = this.bindDateInputBlur.bind(this);
		obj.bindTarget.unbind("blur.AXInput").bind("blur.AXInput", function (event) {
			bindDateInputBlur(objID, objSeq, event);
		});
	},
	bindDateExpand: function (objID, objSeq, isToggle, event) {
		var cfg = this.config;
		//alert(cfg.responsiveMobile);

		for (var OO, oidx = 0, __arr = this.objects; (oidx < __arr.length && (OO = __arr[oidx])); oidx++) {
			if(OO.expandBox_axdom){
				OO.expandBox_axdom.remove();
				OO.expandBox_axdom = null;
			}
		}

		if (AXUtil.clientWidth() < cfg.responsiveMobile) {
			this.bindDateExpandMobile(objID, objSeq, isToggle, event);
			return;
			/* 클라이언트 너비가 모바일 너비이면 프로세스 중지 */
		}
		var obj = this.objects[objSeq];
		var separator = (obj.config.separator) ? obj.config.separator : "-";

		//Selector Option box Expand
		if (isToggle) { // 활성화 여부가 토글 이면
			if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
				//비활성 처리후 메소드 종료
				return;
			}
		}
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 활성화 전에 개체 삭제 처리

		//Expand Box 생성 구문 작성
		var objVal = axdom("#" + objID).val();
		if (obj.config.expandTime) obj.config.selectType == "d"; //시간 확장 시 selectType : d 로 고정

		var today = new Date();
		if (obj.config.selectType == "y") {
			if (objVal != "") {
				objVal = objVal.left(4) + separator + "01" + separator + "01";
			}
		} else if (obj.config.selectType == "m") {
			if (objVal != "") {
				objVal = objVal + separator + "01";
			}
		}

		var dfDate = (obj.config.defaultDate || "").date();
		var myDate = objVal.date(separator, dfDate);

		var myYear = myDate.getFullYear();
		var myMonth = (myDate.getMonth() + 1).setDigit(2);
		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandBox\" class=\"" + cfg.bindDateExpandBoxClassName + "\" style=\"z-index:5100;\">");
		po.push("	<div>");
		po.push("		<div class=\"dateControlBox\">");
		po.push("			<a " + obj.config.href + " class=\"yearbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlYear\">" + myYear + "년</a>");
		po.push("			<a " + obj.config.href + " class=\"monthbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth\">" + myMonth + "월</a>");
		po.push("			<a " + obj.config.href + " class=\"prevbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandPrev\">P</a>");
		po.push("			<a " + obj.config.href + " class=\"nextbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandNext\">N</a>");
		po.push("		</div>");
		po.push("		<div class=\"dateDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayBox\"></div>");
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			po.push("		<div class=\"timeDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox\"></div>");
		}
		po.push("	</div>");
		po.push("</div>");

		axdom(document.body).append(po.join('')); // bindDateExpandBox append
		//axdom("#"+cfg.targetID + "_AX_" + objID+"_AX_Handle").addClass("on");

		// AXCalendar display
		obj.nDate = myDate;
		obj.mycalendar = new AXCalendar();
		obj.mycalendar.setConfig({
			targetID: cfg.targetID + "_AX_" + objID + "_AX_displayBox",
			basicDate: myDate,
			href: obj.config.href
		});
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			obj.nDate = myDate;
			var mycalendartimeChange = this.bindDateTimeChange.bind(this);
			obj.mycalendartimeChange = function (myTime) {
				mycalendartimeChange(objID, objSeq, myTime);
			};
			obj.mycalendartime = new AXCalendar();
			obj.mycalendartime.setConfig({
				targetID: cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox",
				onChange: obj.mycalendartimeChange
			});
			var apm = "AM";
			var myTimes = myDate.print("hh:mi").split(":");
			var myHH = myTimes[0].number();
			var myMI = myTimes[1];
			if (myHH > 12) {
				apm = "PM";
				myHH -= 12;
			}
			obj.mycalendartime.printTimePage(myHH.setDigit(2) + ":" + myMI.setDigit(2) + " " + apm);
		}

		var printDate = "";
		if (obj.config.selectType == "y") {
			obj.mycalendarPageType = "y";
			obj.mycalendar.printYearPage(myDate.print("yyyy"));
			printDate = myDate.print("yyyy");
			axdom("#" + objID).val(printDate);
		} else if (obj.config.selectType == "m") {
			obj.mycalendarPageType = "m";
			obj.mycalendar.printMonthPage(myDate);
			printDate = myDate.print("yyyy" + separator + "mm");
			axdom("#" + objID).val(printDate);
		} else {
			if (obj.config.defaultSelectType) {
				if (obj.config.defaultSelectType == "y") {
					obj.mycalendarPageType = "y";
					obj.mycalendar.printYearPage(myDate.print("yyyy"));
				} else if (obj.config.defaultSelectType == "m") {
					obj.mycalendarPageType = "m";
					obj.mycalendar.printMonthPage(myDate);
				} else {
					obj.mycalendarPageType = "d";
					obj.mycalendar.printDayPage(myDate);
				}
				printDate = myDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + myDate.print("hh:mi");
				}
				axdom("#" + objID).val(printDate);

			} else {
				obj.mycalendarPageType = "d";
				obj.mycalendar.printDayPage(myDate);
				printDate = myDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + myDate.print("hh:mi");
				}

				axdom("#" + objID).val(printDate);
			}
		}
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AXCalendar display

		// expandBox set Position ~~~~~~~~~~~~~~~~~~~~~~~~~
		var expandBox = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox");
		var expBoxWidth = expandBox.outerWidth();
		var expBoxHeight = expandBox.outerHeight();
		var offset = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").offset();
		var handleWidth = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").width();
		var handleHeight = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").height();

		var css = {};
		if (obj.config.align == "left") {
			css.left = offset.left.number() - expBoxWidth;
		} else if (obj.config.align == "center") {
			css.left = offset.left.number() - expBoxWidth / 2 + handleWidth;
		} else if (obj.config.align == "right") {
			css.left = offset.left.number() + handleWidth;
		} else {
			css.left = offset.left.number() + handleWidth;
		}
		if (obj.config.valign == "top") {
			css.top = offset.top;
		} else if (obj.config.valign == "middle") {
			css.top = offset.top.number() - expBoxHeight / 2 + handleWidth / 2;
		} else if (obj.config.valign == "bottom") {
			css.top = offset.top.number() - expBoxHeight + handleWidth;
		} else {
			css.top = offset.top;
		}

		var pElement = expandBox.offsetParent();
		var pBox = { width: pElement.width(), height: pElement.height() };

		var clientHeight = (AXUtil.docTD == "Q") ? document.body.scrollHeight : document.documentElement.scrollHeight;
		var clienWidth = (AXUtil.docTD == "Q") ? document.body.scrollWidth : document.documentElement.scrollWidth;
		if (clienWidth > pBox.width) pBox.width = clienWidth;
		if (clientHeight > pBox.height) pBox.height = clientHeight;
		var _box = { width: expandBox.outerWidth() + 10, height: expandBox.outerHeight() + 10 };

		if ((_box.height.number() + css.top.number()) > pBox.height) {
			css.top = css.top - ((_box.height.number() + css.top.number()) - pBox.height);
		}
		if (css.top < 0) {
			css.top = 0;
		}

		if ((_box.width.number() + css.left.number()) > pBox.width) {
			css.left = css.left - ((_box.width.number() + css.left.number()) - pBox.width);
		}
		if (css.left < 0) {
			css.left = 0;
		}

		expandBox.css(css);
		obj.expandBox_axdom = expandBox;

		// ~~~~~~~~~~~~~~~~~~~~~~~~~ expandBox set Position ~~~~~~~~~~~~~~~~~~~~~~~~~

		var bindDateExpandBoxClick = this.bindDateExpandBoxClick.bind(this);
		obj.documentclickEvent = function (event) {
			//trace(objID);
			bindDateExpandBoxClick(objID, objSeq, event);
		}
		var bindDateKeyup = this.bindDateKeyup.bind(this);
		obj.inputKeyup = function (event) {
			bindDateKeyup(objID, objSeq, event);
		}
		if (obj.config.selectType == "y") {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear").css({ left: "70px" });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth").hide();
		}

		//trace("event bind");
		axdom(document).unbind("click.AXInput").bind("click.AXInput", obj.documentclickEvent);
		axdom("#" + objID).bind("keydown.AXInput", obj.inputKeyup);

	},
	// -- bindDate for mobile
	bindDateExpandMobile: function (objID, objSeq, isToggle, event) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		axdom("#" + objID).unbind("keydown.AXInput").bind("keydown.AXInput", obj.inputKeyup);

		//Selector Option box Expand
		if (isToggle) { // 활성화 여부가 토글 이면
			if (obj.modal && obj.modal.opened) {
				obj.modal.close();
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
				//비활성 처리후 메소드 종료
				return;
			}
		}

		/* mobile modal ready */
		obj.modal = new AXMobileModal();
		obj.modal.setConfig({
			addClass: "",
			height: (obj.config.expandTime) ? 532 : 388,
			width: 300,
			head: {},
			onclose: function () { }
		});

		var initBindDateMobileModal = this.initBindDateMobileModal.bind(this);
		var onLoad = function (modalObj) {
			initBindDateMobileModal(objID, objSeq, modalObj);
		};
		obj.modal.open(null, onLoad);
	},
	initBindDateMobileModal: function (objID, objSeq, modalObj) {
		var cfg = this.config;
		var obj = this.objects[objSeq];
		var separator = (obj.config.separator) ? obj.config.separator : "-";

		//Expand Box 생성 구문 작성
		var objVal = axdom("#" + objID).val();
		if (obj.config.expandTime) obj.config.selectType == "d"; //시간 확장 시 selectType : d 로 고정			

		var today = new Date();
		if (obj.config.selectType == "y") {
			if (objVal != "") {
				objVal = objVal.left(4) + separator + "01" + separator + "01";
			}
		} else if (obj.config.selectType == "m") {
			if (objVal != "") {
				objVal = objVal + separator + "01";
			}
		}

		var dfDate = (obj.config.defaultDate || "").date();
		var myDate = objVal.date(separator, dfDate);

		var myYear = myDate.getFullYear();
		var myMonth = (myDate.getMonth() + 1).setDigit(2);

		/* head 만들기 */
		var headPo = [];
		/* 현재 선택된 메뉴 선택 하는 기능구현 필요 */
		headPo.push("<div class=\"AXDateControlBox\">");
		headPo.push("	<a " + obj.config.href + " class=\"AXDateControl yearbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlYear\">" + (AXConfig.AXInput.yearText || "{year}년").replace("{year}", myYear) + "</a>");
		headPo.push("	<a " + obj.config.href + " class=\"AXDateControl monthbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth\">" + (AXConfig.AXInput.monthText || "{month}월").replace("{month}", myMonth) + "</a>");
		headPo.push("	<a " + obj.config.href + " class=\"AXDateControl prevbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandPrev\">P</a>");
		headPo.push("	<a " + obj.config.href + " class=\"AXDateControl nextbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandNext\">N</a>");
		headPo.push("</div>");

		var bodyPo = [];
		bodyPo.push('<div class="AXDateContainer">');
		bodyPo.push('<div class="AXDateDisplayBox" id="' + cfg.targetID + '_AX_' + objID + '_AX_displayBox"></div>');
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			bodyPo.push('		<div class="AXTimeDisplayBox" id="' + cfg.targetID + '_AX_' + objID + '_AX_displayTimeBox"></div>');
		}
		bodyPo.push('</div>');

		var footPo = [];
		footPo.push('<div class="AXDateButtonBox" id="' + cfg.targetID + '_AX_' + objID + '_AX_buttonBox">');
		footPo.push('	<button class="AXButtonSmall W80 AXBindDateConfirm" type="button" id="' + cfg.targetID + '_AX_' + objID + '_AX_button_AX_confirm">' + (AXConfig.AXInput.confirmText || "확인") + '</button>');
		footPo.push('</div>');

		/* modal에 캘린더 장착 */
		modalObj.modalHead.empty();
		modalObj.modalHead.append(headPo.join(''));
		modalObj.modalBody.empty();
		modalObj.modalBody.append(bodyPo.join(''));
		modalObj.modalFoot.empty();
		modalObj.modalFoot.append(footPo.join(''));

		/* 캘린더 클래스 로드 */
		// AXCalendar display
		obj.nDate = myDate;
		obj.mycalendar = new AXCalendar();
		obj.mycalendar.setConfig({
			targetID: cfg.targetID + "_AX_" + objID + "_AX_displayBox",
			basicDate: myDate,
			href: obj.config.href
		});
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			obj.nDate = myDate;
			var mycalendartimeChange = this.bindDateTimeChange.bind(this);
			obj.mycalendartimeChange = function (myTime) {
				mycalendartimeChange(objID, objSeq, myTime);
			};
			obj.mycalendartime = new AXCalendar();
			obj.mycalendartime.setConfig({
				targetID: cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox",
				onChange: obj.mycalendartimeChange
			});
			var apm = "AM";
			var myTimes = myDate.print("hh:mi").split(":");
			var myHH = myTimes[0].number();
			var myMI = myTimes[1];
			if (myHH > 12) {
				apm = "PM";
				myHH -= 12;
			}
			obj.mycalendartime.printTimePage(myHH.setDigit(2) + ":" + myMI.setDigit(2) + " " + apm);
		}

		var printDate = "";
		if (obj.config.selectType == "y") {
			obj.mycalendarPageType = "y";
			obj.mycalendar.printYearPage(myDate.print("yyyy"));
			printDate = myDate.print("yyyy");
			axdom("#" + objID).val(printDate);
		} else if (obj.config.selectType == "m") {
			obj.mycalendarPageType = "m";
			obj.mycalendar.printMonthPage(myDate);
			printDate = myDate.print("yyyy" + separator + "mm");
			axdom("#" + objID).val(printDate);
		} else {
			if (obj.config.defaultSelectType) {
				if (obj.config.defaultSelectType == "y") {
					obj.mycalendarPageType = "y";
					obj.mycalendar.printYearPage(myDate.print("yyyy"));
				} else if (obj.config.defaultSelectType == "m") {
					obj.mycalendarPageType = "m";
					obj.mycalendar.printMonthPage(myDate);
				} else {
					obj.mycalendarPageType = "d";
					obj.mycalendar.printDayPage(myDate);
				}
				printDate = myDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + myDate.print("hh:mi");
				}
				axdom("#" + objID).val(printDate);

			} else {
				obj.mycalendarPageType = "d";
				obj.mycalendar.printDayPage(myDate);
				printDate = myDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + myDate.print("hh:mi");
				}
				axdom("#" + objID).val(printDate);
			}
		}
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AXCalendar display

		// control event bind
		var _this = this;
		/*var bindDateMobileModalHeadClick = this.bindDateMobileModalHeadClick.bind(this);*/
		modalObj.modalHead.unbind("click.AXInput").bind("click.AXInput", function (event) {
			_this.bindDateMobileModalHeadClick(objID, objSeq, event);
		});
		/*var bindDateMobileModalBodyClick = this.bindDateMobileModalBodyClick.bind(this);*/
		modalObj.modalBody.unbind("click.AXInput").bind("click.AXInput", function (event) {
			_this.bindDateMobileModalBodyClick(objID, objSeq, event);
		});
		/*var bindDateMobileModalFootClick = this.bindDateMobileModalFootClick.bind(this);*/
		modalObj.modalFoot.unbind("click.AXInput").bind("click.AXInput", function (event) {
			_this.bindDateMobileModalFootClick(objID, objSeq, event);
		});
		// control event bind
	},
	bindDateMobileModalHeadClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget, evtIDs: eid,
			until: function (evt, evtIDs) { return (axdom(evt.parentNode).hasClass("AXDateControlBox")) ? true : false; },
			find: function (evt, evtIDs) { return (axdom(evt).hasClass("AXDateControl")) ? true : false; }
		});
		if (myTarget) {
			var act = myTarget.id.split(/_AX_/g).last();
			var nDate = obj.nDate;

			if (act == "controlYear") {
				this.bindDateChangePage(objID, objSeq, nDate, "y");
			} else if (act == "controlMonth") {
				if (obj.config.selectType != "y") {
					this.bindDateChangePage(objID, objSeq, nDate, "m");
				}
			} else if (act == "expandPrev") {
				if (obj.mycalendarPageType == "d") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-12, "y"), "y");
				}
			} else if (act == "expandNext") {
				if (obj.mycalendarPageType == "d") {
					this.bindDateChangePage(objID, objSeq, nDate.add(1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindDateChangePage(objID, objSeq, nDate.add(1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindDateChangePage(objID, objSeq, nDate.add(12, "y"), "y");
				}
			}
		}
	},
	bindDateMobileModalBodyClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget, evtIDs: eid,
			until: function (evt, evtIDs) { return (axdom(evt.parentNode).hasClass("AXDateContainer")) ? true : false; },
			find: function (evt, evtIDs) { return (axdom(evt).hasClass("calendarDate") || axdom(evt).hasClass("calendarMonth")) ? true : false; }
		});
		if (myTarget) {
			var ids = myTarget.id.split(/_AX_/g);
			var act = ids.last();
			var nDate = obj.nDate;
			var separator = (obj.config.separator) ? obj.config.separator : "-";
			if (act == "date") {
				//trace(ids[ids.length-2]);
				obj.nDate = ids[ids.length - 2].date();
				var printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + obj.mycalendartime.getTime();
				}
				axdom("#" + objID).val(printDate);
				//obj.modal.close();
				this.bindDateExpandClose(objID, objSeq, event);
			} else if (act == "month") {
				var myMonth = ids[ids.length - 2].number() - 1;
				if (obj.config.selectType == "m") {
					var yy = nDate.getFullYear();
					var dd = 1;
					obj.nDate = new Date(yy, myMonth, dd);
					//obj.modal.close();
					this.bindDateExpandClose(objID, objSeq, event);
				} else {
					var yy = nDate.getFullYear();
					var dd = 1;
					obj.nDate = new Date(yy, myMonth, dd);
					this.bindDateChangePage(objID, objSeq, obj.nDate, "d");
				}
			} else if (act == "year") {
				var myYear = ids[ids.length - 2];
				if (obj.config.selectType == "y") {
					var mm = 0;
					var dd = 1;
					obj.nDate = new Date(myYear, mm, dd);
					//obj.modal.close();
					this.bindDateExpandClose(objID, objSeq, event);
				} else {
					var mm = 0;
					var dd = 1;
					obj.nDate = new Date(myYear, mm, dd);
					this.bindDateChangePage(objID, objSeq, obj.nDate, "m");
				}
			}

		}
	},
	bindDateMobileModalFootClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget, evtIDs: eid,
			until: function (evt, evtIDs) { return (axdom(evt.parentNode).hasClass("AXDateButtonBox")) ? true : false; },
			find: function (evt, evtIDs) { return (axdom(evt).hasClass("AXBindDateConfirm")) ? true : false; }
		});
		if (myTarget) {
			var act = myTarget.id.split(/_AX_/g).last();
			if (act == "confirm") {
				obj.modal.close();
			}
		}
	},
	// -- bindDate for mobile
	bindDateExpandClose: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;

		if (!obj){
			//비활성 처리후 메소드 종료
			axdom(document).unbind("click.AXInput");
			axdom("#" + objID).unbind("keydown.AXInput");
			return;
		}

		if (obj.modal && obj.modal.opened) { /* mobile modal close */
			var objVal = axdom("#" + objID).val();
			if (objVal == "") {

			} else {
				var separator = (obj.config.separator) ? obj.config.separator : "-";
				if (obj.config.selectType == "y") {
					axdom("#" + objID).val(obj.nDate.print("yyyy"));
				} else if (obj.config.selectType == "m") {
					axdom("#" + objID).val(obj.nDate.print("yyyy" + separator + "mm"));
				} else {
					//axdom("#"+objID).val(obj.nDate.print("yyyy"+separator+"mm"+separator+"dd"));
					printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						printDate += " " + obj.mycalendartime.getTime();
					}
					axdom("#" + objID).val(printDate);
				}
			}

			if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;

			if (obj.config.onChange) {
				if (axdom.isFunction(obj.config.onChange)) {
					obj.config.onChange.call({
						objID: objID,
						value: axdom("#" + objID).val()
					});
				} else {
					var st_date, ed_date;
					if (obj.config.onChange.earlierThan) {
						st_date = axdom("#" + objID).val();
						ed_date = axdom("#" + obj.config.onChange.earlierThan).val();
					} else if (obj.config.onChange.laterThan) {
						ed_date = axdom("#" + objID).val();
						st_date = axdom("#" + obj.config.onChange.laterThan).val();
					}
					if (st_date != "" && ed_date != "") {
						if (st_date.date().diff(ed_date) < 0) {
							this.msgAlert(obj.config.onChange.err);
							axdom("#" + objID).val("");
							return;
						}
					}
					if (obj.config.onChange.onChange) {
						obj.config.onChange.onChange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					} else if (obj.config.onChange.onchange) {
						obj.config.onChange.onchange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					}
				}
			}

			obj.modal.close();
			axdom("#" + objID).unbind("keydown.AXInput");

			//비활성 처리후 메소드 종료
			axdom(document).unbind("click.AXInput");
			axdom("#" + objID).unbind("keydown.AXInput");
			return;
		}
		if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
			var objVal = axdom("#" + objID).val();

			if (objVal == "") {

			} else {
				var separator = (obj.config.separator) ? obj.config.separator : "-";
				if (obj.config.selectType == "y") {
					axdom("#" + objID).val(obj.nDate.print("yyyy"));
				} else if (obj.config.selectType == "m") {
					axdom("#" + objID).val(obj.nDate.print("yyyy" + separator + "mm"));
				} else {
					//axdom("#"+objID).val(obj.nDate.print("yyyy"+separator+"mm"+separator+"dd"));
					printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						printDate += " " + obj.mycalendartime.getTime();
					}
					axdom("#" + objID).val(printDate);
				}
			}

			if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;

			if (obj.config.onChange) {
				if (axdom.isFunction(obj.config.onChange)) {
					obj.config.onChange.call({
						objID: objID,
						value: axdom("#" + objID).val()
					});
				} else {
					var st_date, ed_date;
					if (obj.config.onChange.earlierThan) {
						st_date = axdom("#" + objID).val();
						ed_date = axdom("#" + obj.config.onChange.earlierThan).val();
					} else if (obj.config.onChange.laterThan) {
						ed_date = axdom("#" + objID).val();
						st_date = axdom("#" + obj.config.onChange.laterThan).val();
					}
					if (st_date != "" && ed_date != "") {
						if (st_date.date().diff(ed_date) < 0) {
							this.msgAlert(obj.config.onChange.err);
							axdom("#" + objID).val("");
							return;
						}
					}
					if (obj.config.onChange.onChange) {
						obj.config.onChange.onChange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					} else if (obj.config.onChange.onchange) {
						obj.config.onChange.onchange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					}
				}
			}

			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
			obj.expandBox_axdom = null;

			//비활성 처리후 메소드 종료
			axdom(document).unbind("click.AXInput");
			axdom("#" + objID).unbind("keydown.AXInput");

			event.stopPropagation(); // disableevent
			return;
		}
	},
	bindDateInputBlur: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var objVal = axdom("#" + objID).val();

		if (objVal == "") {

		} else {
			var clearDate = false;
			var nDate = (obj.nDate || new Date());
			var va = axdom("#" + objID).val().replace(/\D/gi, ""); //숫자 이외의 문자를 제거 합니다.
			if (va.search(/\d+/g) == -1) {
				clearDate = true;
			}

			if (clearDate) {
				axdom("#" + objID).val("");
			} else {
				var separator = (obj.config.separator) ? obj.config.separator : "-";
				if (obj.config.selectType == "y") {

					var yy = va.left(4).number();
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					var mm = nDate.getMonth();
					var dd = nDate.getDate();
					obj.nDate = new Date(yy, mm, dd, 12);

					axdom("#" + objID).val(obj.nDate.print("yyyy"));

				} else if (obj.config.selectType == "m") {

					if (va.length > 5) {
						var yy = va.left(4).number();
						var mm = va.substr(4, 2).number() - 1;
						var dd = 1;
					} else {
						var yy = va.left(4).number();
						var mm = 0;
						var dd = 1;
					}
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					obj.nDate = new Date(yy, mm, dd, 12);

					axdom("#" + objID).val(obj.nDate.print("yyyy" + separator + "mm"));

				} else {
					var needAlert = false;
					if (va.length > 7) {
						var yy = va.left(4).number();
						var mm = va.substr(4, 2).number() - 1;
						var dd = va.substr(6, 2).number();
					} else if (va.length > 4) {
						var yy = "20" + va.substr(0, 2);
						var mm = va.substr(2, 2).number() - 1;
						var dd = va.substr(4, 2).number();
					} else {
						var yy = nDate.getFullYear(); //va.left(4).number();
						var mm = va.substr(0, 2).number() - 1;
						var dd = va.substr(2, 2).number();
					}
					if (yy == 0) needAlert = true;
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					obj.nDate = new Date(yy, mm, dd, 12);
					/*
					 trace(obj.nDate.getFullYear() != yy.number());
					 trace(obj.nDate.getMonth() != mm.number());
					 trace(obj.nDate.getDate() != dd.number());
					 */
					if (obj.nDate.getFullYear() != yy.number()
						|| obj.nDate.getMonth() != mm.number()
						|| obj.nDate.getDate() != dd.number()) {
						needAlert = true;
						obj.nDate = new Date();
					}

					printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						try {
							printDate += " " + obj.mycalendartime.getTime();
						} catch (e) {
							if (va.length > 11) { // hh,mm
								var hh = va.substr(8, 2).number();
								var mm = va.substr(10, 2).number();
							} else if (va.length > 9) {
								var hh = va.substr(8, 2).number();
								var mm = "00";
							} else {
								var hh = "12";
								var mm = "00";
							}
							printDate += " " + hh + ":" + mm;
						}
					}

					if (needAlert) {
						this.msgAlert("날짜 형식이 올바르지 않습니다.");
					}
					axdom("#" + objID).val(printDate);
				}
			}
		}

		if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;
		if (obj.config.onChange) {
			if (axdom("#" + objID).data("val") != axdom("#" + objID).val()) {

				if (axdom.isFunction(obj.config.onChange)) {
					obj.config.onChange.call({
						objID: objID,
						value: axdom("#" + objID).val()
					});
				} else {
					var st_date, ed_date;
					if (obj.config.onChange.earlierThan) {
						st_date = axdom("#" + objID).val();
						ed_date = axdom("#" + obj.config.onChange.earlierThan).val();
					} else if (obj.config.onChange.laterThan) {
						ed_date = axdom("#" + objID).val();
						st_date = axdom("#" + obj.config.onChange.laterThan).val();
					}
					if (st_date != "" && ed_date != "") {
						if (st_date.date().diff(ed_date) < 0) {
							this.msgAlert(obj.config.onChange.err);
							axdom("#" + objID).val("");
						}
					}
					if (obj.config.onChange.onChange) {
						obj.config.onChange.onChange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					} else if (obj.config.onChange.onchange) {
						obj.config.onChange.onchange.call({
							objID: objID,
							value: axdom("#" + objID).val()
						});
					}
				}
				axdom("#" + objID).data("val", axdom("#" + objID).val());

			}
		}

		/* ie10 버그
		 axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리

		 //비활성 처리후 메소드 종료
		 axdom(document).unbind("click.AXInput");
		 axdom("#" + objID).unbind("keydown.AXInput");
		 */

		event.stopPropagation(); // disableevent
		return;
	},
	unbindDate: function (obj) {
		var cfg = this.config;
		var objID = obj.id;
		var objSeq = null;

		axf.each(this.objects, function (oidx, O) {
			if (this.id == objID) {
				objSeq = oidx;
				return false;
			}
		});

		if (objSeq != null) {
			var obj = this.objects[objSeq];

			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리

			//비활성 처리후 메소드 종료
			axdom(document).unbind("click.AXInput");
			axdom("#" + objID).unbind("keydown.AXInput");
		}

		var collect = [];
		var removeAnchorId;
		axf.each(this.objects, function () {
			if (this.id != obj.id) collect.push(this);
			else {
				removeAnchorId = this.anchorID;
			}
		});
		this.objects = collect;

		axdom("#" + removeAnchorId).remove();

	},
	bindDateTimeChange: function (objID, objSeq, myTime) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var separator = (obj.config.separator) ? obj.config.separator : "-";
		var printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
		if (obj.config.expandTime) {
			printDate += " " + obj.mycalendartime.getTime();
		}
		axdom("#" + objID).val(printDate);
	},
	bindDateExpandBoxClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var isDateClick = false;

		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget,
			until: function (evt, evtIDs) {
				return (evt.parentNode.tagName == "BODY") ? true : false;
			},
			find: function (evt, evtIDs) {
				if (!evt.id) return false;
				var checkID = cfg.targetID + "_AX_" + objID;
				if (evt.id == objID || evt.id.substr(0, checkID.length) == checkID) {
					return true;
				} else {
					return false;
				}
			}
		});

		isDateClick = (myTarget) ? true : false;
		if (!isDateClick) {
			this.bindDateExpandClose(objID, objSeq, event);
		} else {

			var ids = myTarget.id.split(/_AX_/g);
			var ename = ids.last();

			var nDate = obj.nDate;
			var separator = (obj.config.separator) ? obj.config.separator : "-";
			if (ename == "expandPrev") {
				if (obj.mycalendarPageType == "d") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindDateChangePage(objID, objSeq, nDate.add(-12, "y"), "y");
				}
			} else if (ename == "expandNext") {
				if (obj.mycalendarPageType == "d") {
					this.bindDateChangePage(objID, objSeq, nDate.add(1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindDateChangePage(objID, objSeq, nDate.add(1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindDateChangePage(objID, objSeq, nDate.add(12, "y"), "y");
				}
			} else if (ename == "controlYear") {
				this.bindDateChangePage(objID, objSeq, nDate, "y");
			} else if (ename == "controlMonth") {
				if (obj.config.selectType != "y") {
					this.bindDateChangePage(objID, objSeq, nDate, "m");
				}
			} else if (ename == "date") {
				//trace(ids[ids.length-2]);
				obj.nDate = ids[ids.length - 2].date();
				var printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + obj.mycalendartime.getTime();
				}
				axdom("#" + objID).val(printDate);
				this.bindDateExpandClose(objID, objSeq, event);
			} else if (ename == "month") {
				var myMonth = ids[ids.length - 2].number() - 1;
				if (obj.config.selectType == "m") {
					var yy = nDate.getFullYear();
					var dd = 1;
					obj.nDate = new Date(yy, myMonth, dd, 12);
					this.bindDateExpandClose(objID, objSeq, event);
				} else {
					var yy = nDate.getFullYear();
					var dd = 1;
					obj.nDate = new Date(yy, myMonth, dd, 12);
					this.bindDateChangePage(objID, objSeq, obj.nDate, "d");
				}
			} else if (ename == "year") {
				var myYear = ids[ids.length - 2];
				if (obj.config.selectType == "y") {
					var mm = 0;
					var dd = 1;
					obj.nDate = new Date(myYear, mm, dd, 12);
					this.bindDateExpandClose(objID, objSeq, event);
				} else {
					var mm = 0;
					var dd = 1;
					obj.nDate = new Date(myYear, mm, dd, 12);
					this.bindDateChangePage(objID, objSeq, obj.nDate, "m");
				}
			}
		}
	},
	bindDateKeyup: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (obj.config.selectType == "y") {

		} else if (obj.config.selectType == "m") {

		} else {

		}
	},
	bindDateChangePage: function (objID, objSeq, setDate, pageType) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var separator = (obj.config.separator) ? obj.config.separator : "-";

		if (pageType == "m") {
			//alert(setDate);
			obj.mycalendarPageType = "m";
			obj.nDate = setDate;
			obj.mycalendar.printMonthPage(setDate);
			var myYear = setDate.getFullYear();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear").html(myYear + "년");
		} else if (pageType == "y") {
			obj.mycalendarPageType = "y";
			obj.nDate = setDate;
			obj.mycalendar.printYearPage(setDate.getFullYear());
			var myYear = setDate.getFullYear();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear").html(myYear + "년");
		} else {
			obj.mycalendarPageType = "d";
			obj.nDate = setDate;
			obj.mycalendar.printDayPage(setDate);
			var myYear = setDate.getFullYear();
			var myMonth = (setDate.getMonth() + 1).setDigit(2);
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear").html(myYear + "년");
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth").html(myMonth + "월");
		}

		if (obj.config.selectType == "y") {
			axdom("#" + objID).val(obj.nDate.print("yyyy"));
		} else if (obj.config.selectType == "m") {
			axdom("#" + objID).val(obj.nDate.print("yyyy" + separator + "mm"));
		} else {
			//axdom("#"+objID).val(obj.nDate.print("yyyy"+separator+"mm"+separator+"dd"));
			var printDate = obj.nDate.print("yyyy" + separator + "mm" + separator + "dd");
			if (obj.config.expandTime) {
				printDate += " " + obj.mycalendartime.getTime();
			}
			axdom("#" + objID).val(printDate);
		}
	},

	// twinDate
	bindTwinDate: function (objID, objSeq, option) {
		var cfg = this.config;
		var obj = this.objects[objSeq];

		if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);
		obj.bindTargetStart = axdom("#" + obj.config.startTargetID);

		var h = obj.bindAnchorTarget.data("height");
		var po = [];
		po.push("<a " + obj.config.href + " id=\"" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle\" class=\"" + cfg.anchorDateHandleClassName + "\" style=\"right:0px;top:0px;width:" + h + "px;height:" + h + "px;\">handle</a>");
		obj.bindAnchorTarget.append(po.join(''));
		obj.bindAnchorTarget.show();

		var bindDateExpand = this.bindTwinDateExpand.bind(this);

		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").unbind("click.AXInput").bind("click.AXInput", function (event) {
			bindDateExpand(objID, objSeq, true, event);
		});
		obj.bindTarget.unbind("click.AXInput").bind("focus.AXInput", function (event) {
			axdom("#" + objID).select();
			/*
			 if(!AXgetId(cfg.targetID + "_AX_"+objID+"_AX_expandBox")){
			 bindDateExpand(objID, objSeq, false, event);
			 }
			 */
		});
		obj.bindTargetStart.unbind("focus.AXInput").bind("focus.AXInput", function (event) {
			obj.bindTargetStart.select();
			/*
			 if(!AXgetId(cfg.targetID + "_AX_"+objID+"_AX_expandBox")){
			 bindDateExpand(objID, objSeq, false, event);
			 }
			 */
		});


		var separator = (obj.config.separator) ? obj.config.separator : "-";
		axdom("#" + objID + ", #" + obj.config.startTargetID).unbind("keyup.AXInput").bind("keyup.AXInput", function (event) {
			//alert(this.value);
			if(event.keyCode == axf.Event.KEY_RETURN){
				//bindDateInputBlur(objID, objSeq, event);
				this.blur();
			}else if (event.keyCode != AXUtil.Event.KEY_BACKSPACE && event.keyCode != AXUtil.Event.KEY_DELETE && event.keyCode != AXUtil.Event.KEY_LEFT && event.keyCode != AXUtil.Event.KEY_RIGHT) {

				var va = this.value.replace(/\D/gi, ""); //숫자 이외의 문자를 제거 합니다.
				var _this = this;

				if (obj.config.selectType == "y") {
					if (va.length > 4) _this.value = va.left(4);
				} else if (obj.config.selectType == "m") {
					if (va.length == 4) {
						va = va + separator;
						_this.value = va;
					} else if (va.length > 4) {
						va = va.substr(0, 4) + separator + va.substr(4, 2);
						_this.value = va;
					}
				} else {
					if (va.length == 4) {
						va = va + separator;
						_this.value = va;
					} else if (va.length == 6) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator;
						_this.value = va;
					} else if (va.length == 8) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2) + " ";
						_this.value = va;
					} else if (va.length == 10) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2) + " " + va.substr(8, 2) + ":";
						_this.value = va;
					} else if (va.length > 12) {
						va = va.substr(0, 4) + separator + va.substr(4, 2) + separator + va.substr(6, 2) + " " + va.substr(8, 2) + ":" + va.substr(10, 2);
						_this.value = va;
					}
				}
			}
		});

		var bindTwinDateInputBlur = this.bindTwinDateInputBlur.bind(this);
		obj.bindTarget.unbind("blur.AXInput").bind("blur.AXInput", function (event) {
			bindTwinDateInputBlur(objID, objSeq, event, 2);
		});
		axdom("#" + obj.config.startTargetID).unbind("blur.AXInput").bind("blur.AXInput", function (event) {
			bindTwinDateInputBlur(objID, objSeq, event, 1);
		});

		var objVal1 = obj.bindTargetStart.val();
		var objVal2 = obj.bindTarget.val();
		var myDate1 = objVal1.date(separator);
		var myDate2 = objVal2.date(separator);
		obj.nDate1 = myDate1;
		obj.nDate2 = myDate2;
	},
	bindTwinDateExpand: function (objID, objSeq, isToggle, event) {
		var cfg = this.config;

		for (var OO, oidx = 0, __arr = this.objects; (oidx < __arr.length && (OO = __arr[oidx])); oidx++) {
			if(OO.expandBox_axdom){
				OO.expandBox_axdom.remove();
				OO.expandBox_axdom = null;
			}
		}

		var obj = this.objects[objSeq];

		var separator = (obj.config.separator) ? obj.config.separator : "-";

		//Selector Option box Expand
		if (isToggle) { // 활성화 여부가 토글 이면
			if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_Handle").removeClass("on");
				//비활성 처리후 메소드 종료
				return;
			}
		}
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 활성화 전에 개체 삭제 처리
		//axdom("#"+cfg.targetID + "_AX_" + objID+"_AX_Handle").removeClass("on");

		//Expand Box 생성 구문 작성
		var objVal1 = axdom("#" + obj.config.startTargetID).val();
		var objVal2 = axdom("#" + objID).val();

		if (obj.config.expandTime) obj.config.selectType == "d"; //시간 확장 시 selectType : d 로 고정

		var today = new Date();
		var objVal1Empty = false;
		if (obj.config.selectType == "y") {
			if (objVal1 != "") {
				objVal1 = objVal1.left(4) + separator + "01" + separator + "02";
			} else {
				objVal1Empty = true;
			}
			if (objVal2 != "") {
				objVal2 = objVal2.left(4) + separator + "01" + separator + "02";
			}
		} else if (obj.config.selectType == "m") {
			if (objVal1 != "") {
				objVal1 = objVal1 + separator + "01";
			} else {
				objVal1Empty = true;
			}
			if (objVal2 != "") {
				objVal2 = objVal2 + separator + "01";
			}
		}
		if (AXUtil.isEmpty(objVal1)) {
			objVal1 = "";
			objVal1Empty = true;
		}

		/*var myDate1 = (objVal1Empty) ? objVal1.date(separator).add(-1, "m") : objVal1.date(separator);*/
		var myDate1 = objVal1.date(separator);
		var myDate2 = objVal2.date(separator);
		var myYear1 = myDate1.getFullYear();
		var myYear2 = myDate2.getFullYear();
		var myMonth1 = (myDate1.getMonth() + 1).setDigit(2);
		var myMonth2 = (myDate2.getMonth() + 1).setDigit(2);
		var po = [];
		po.push("<div id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandBox\" class=\"" + cfg.bindTwinDateExpandBoxClassName + "\" style=\"z-index:5100;\">");
		po.push("	<div>");
		po.push("		<table cellpadding=\"0\" cellspacing=\"0\">");
		po.push("			<tbody>");
		po.push("				<tr>");
		po.push("					<td style=\"padding-right:3px;\">");
		po.push("					<div class=\"dateTypeName\">START</div>");
		po.push("					<div class=\"dateControlBox\">");
		po.push("						<a " + obj.config.href + " class=\"yearbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlYear1\">" + myYear1 + "년</a>");
		po.push("						<a " + obj.config.href + " class=\"monthbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth1\">" + myMonth1 + "월</a>");
		po.push("						<a " + obj.config.href + " class=\"prevbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandPrev1\">P</a>");
		po.push("						<a " + obj.config.href + " class=\"nextbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandNext1\">N</a>");
		po.push("					</div>");
		po.push("					<div class=\"dateDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayBox1\"></div>");
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			po.push("					<div class=\"timeDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox1\"></div>");
		}
		po.push("					</td>");
		po.push("					<td style=\"padding-left:3px;\">");
		po.push("					<div class=\"dateTypeName\">END</div>");
		po.push("					<div class=\"dateControlBox\">");
		po.push("						<a " + obj.config.href + " class=\"yearbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlYear2\">" + myYear2 + "년</a>");
		po.push("						<a " + obj.config.href + " class=\"monthbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth2\">" + myMonth2 + "월</a>");
		po.push("						<a " + obj.config.href + " class=\"prevbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandPrev2\">P</a>");
		po.push("						<a " + obj.config.href + " class=\"nextbutton\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_expandNext2\">N</a>");
		po.push("					</div>");
		po.push("					<div class=\"dateDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayBox2\"></div>");
		if (obj.config.expandTime) { //시간 선택 기능 확장시
			po.push("					<div class=\"timeDisplayBox\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox2\"></div>");
		}
		po.push("					</td>");
		po.push("				</tr>");
		po.push("			</tbody>");
		po.push("		</table>");
		po.push("	</div>");
		po.push("	<div style=\"padding-top:5px;\" align=\"center\">");
		po.push("		<input type=\"button\" value=\"OK\" class=\"AXButton Classic W70\" id=\"" + cfg.targetID + "_AX_" + objID + "_AX_closeButton\">");
		po.push("	</div>");
		po.push("</div>");
		axdom(document.body).append(po.join('')); // bindDateExpandBox append
		//axdom("#"+cfg.targetID + "_AX_" + objID+"_AX_Handle").addClass("on");

		// AXCalendar display
		obj.nDate1 = myDate1;
		obj.mycalendar1 = new AXCalendar();
		obj.mycalendar1.setConfig({
			targetID: cfg.targetID + "_AX_" + objID + "_AX_displayBox1",
			basicDate: myDate1
		});

		obj.nDate2 = myDate2;
		obj.mycalendar2 = new AXCalendar();
		obj.mycalendar2.setConfig({
			targetID: cfg.targetID + "_AX_" + objID + "_AX_displayBox2",
			basicDate: myDate2
		});

		if (obj.config.expandTime) { //시간 선택 기능 확장시
			obj.nDate1 = myDate1;
			var mycalendartimeChange1 = this.bindTwinDateTimeChange.bind(this);
			obj.mycalendartimeChange1 = function (myTime) {
				mycalendartimeChange1(objID, objSeq, myTime, 1);
			};
			obj.mycalendartime1 = new AXCalendar();
			obj.mycalendartime1.setConfig({
				targetID: cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox1",
				onChange: obj.mycalendartimeChange1
			});
			var apm = "AM";
			var myTimes = myDate1.print("hh:mi").split(":");
			var myHH = myTimes[0].number();
			var myMI = myTimes[1];
			if (myHH > 12) {
				apm = "PM";
				myHH -= 12;
			}
			obj.mycalendartime1.printTimePage(myHH.setDigit(2) + ":" + myMI.setDigit(2) + " " + apm);

			obj.nDate2 = myDate2;
			var mycalendartimeChange2 = this.bindTwinDateTimeChange.bind(this);
			obj.mycalendartimeChange2 = function (myTime) {
				mycalendartimeChange2(objID, objSeq, myTime, 2);
			};
			obj.mycalendartime2 = new AXCalendar();
			obj.mycalendartime2.setConfig({
				targetID: cfg.targetID + "_AX_" + objID + "_AX_displayTimeBox2",
				onChange: obj.mycalendartimeChange2
			});
			var apm = "AM";
			var myTimes = myDate2.print("hh:mi").split(":");
			var myHH = myTimes[0].number();
			var myMI = myTimes[1];
			if (myHH > 12) {
				apm = "PM";
				myHH -= 12;
			}
			obj.mycalendartime2.printTimePage(myHH.setDigit(2) + ":" + myMI.setDigit(2) + " " + apm);
		}

		var printDate1 = "";
		var printDate2 = "";
		if (obj.config.selectType == "y") {
			obj.mycalendarPageType = "y";
			obj.mycalendar1.printYearPage(myDate1.print("yyyy"));
			obj.mycalendar2.printYearPage(myDate2.print("yyyy"));
			printDate1 = myDate1.print("yyyy");
			printDate2 = myDate2.print("yyyy");
			axdom("#" + obj.config.startTargetID).val(printDate1);
			axdom("#" + objID).val(printDate2);
		} else if (obj.config.selectType == "m") {
			obj.mycalendarPageType = "m";
			obj.mycalendar1.printMonthPage(myDate1);
			obj.mycalendar2.printMonthPage(myDate2);
			printDate1 = myDate1.print("yyyy" + separator + "mm");
			printDate2 = myDate2.print("yyyy" + separator + "mm");
			axdom("#" + obj.config.startTargetID).val(printDate1);
			axdom("#" + objID).val(printDate2);
		} else {
			obj.mycalendarPageType = "d";
			obj.mycalendar1.printDayPage(myDate1);
			obj.mycalendar2.printDayPage(myDate2);
			printDate1 = myDate1.print("yyyy" + separator + "mm" + separator + "dd");
			printDate2 = myDate2.print("yyyy" + separator + "mm" + separator + "dd");
			if (obj.config.expandTime) {
				printDate1 += " " + myDate1.print("hh:mi");
				printDate2 += " " + myDate2.print("hh:mi");
			}
			axdom("#" + obj.config.startTargetID).val(printDate1);
			axdom("#" + objID).val(printDate2);
		}
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AXCalendar display

		// expandBox set Position ~~~~~~~~~~~~~~~~~~~~~~~~~
		var expandBox = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox");
		var expBoxWidth = expandBox.outerWidth();
		var expBoxHeight = expandBox.outerHeight();
		var offset = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").offset();
		var handleWidth = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").width();
		var handleHeight = axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_dateHandle").height();



		var css = {};
		if (obj.config.align == "left") {
			css.left = offset.left.number() - expBoxWidth;
		} else if (obj.config.align == "center") {
			css.left = offset.left.number() - expBoxWidth / 2 + handleWidth;
		} else if (obj.config.align == "right") {
			css.left = offset.left.number() + handleWidth;
		} else {
			css.left = offset.left.number() + handleWidth;
		}
		if (obj.config.valign == "top") {
			css.top = offset.top;
		} else if (obj.config.valign == "middle") {
			css.top = offset.top.number() - expBoxHeight / 2 + handleWidth / 2;
		} else if (obj.config.valign == "bottom") {
			css.top = offset.top.number() - expBoxHeight + handleWidth;
		} else {
			css.top = offset.top;
		}

		var pElement = expandBox.offsetParent();
		var pBox = { width: pElement.width(), height: pElement.height() };

		var clientHeight = (AXUtil.docTD == "Q") ? document.body.scrollHeight : document.documentElement.scrollHeight;
		var clienWidth = (AXUtil.docTD == "Q") ? document.body.scrollWidth : document.documentElement.scrollWidth;
		if (clienWidth > pBox.width) pBox.width = clienWidth;
		if (clientHeight > pBox.height) pBox.height = clientHeight;
		var _box = { width: expandBox.outerWidth() + 10, height: expandBox.outerHeight() + 10 };

		if ((_box.height.number() + css.top.number()) > pBox.height) {
			css.top = css.top - ((_box.height.number() + css.top.number()) - pBox.height);
		}
		if (css.top < 0) {
			css.top = 0;
		}

		if ((_box.width.number() + css.left.number()) > pBox.width) {
			css.left = css.left - ((_box.width.number() + css.left.number()) - pBox.width);
		}
		if (css.left < 0) {
			css.left = 0;
		}

		expandBox.css(css);
		obj.expandBox_axdom = expandBox;

		// ~~~~~~~~~~~~~~~~~~~~~~~~~ expandBox set Position ~~~~~~~~~~~~~~~~~~~~~~~~~

		var bindTwinDateExpandBoxClick = this.bindTwinDateExpandBoxClick.bind(this);
		obj.documentclickEvent = function (event) {
			bindTwinDateExpandBoxClick(objID, objSeq, event);
		}
		var bindTwinDateKeyup = this.bindTwinDateKeyup.bind(this);
		obj.inputKeyup = function (event) {
			bindTwinDateKeyup(objID, objSeq, event);
		}

		if (obj.config.selectType == "y") {
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear1").css({ left: "70px" });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth1").hide();
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear2").css({ left: "70px" });
			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth2").hide();
		}

		axdom(document).unbind("click.AXInput").bind("click.AXInput", obj.documentclickEvent);
		axdom("#" + objID).unbind("keydown.AXInput").bind("keydown.AXInput", obj.inputKeyup);
		var bindTwinDateExpandClose = this.bindTwinDateExpandClose.bind(this);
		axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_closeButton").unbind("click.AXInput").bind("click.AXInput", function (event) {
			bindTwinDateExpandClose(objID, objSeq, event);
		});
	},
	bindTwinDateTimeChange: function (objID, objSeq, myTime, seq) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		if (seq == 1) {
			var separator = (obj.config.separator) ? obj.config.separator : "-";
			var printDate = obj.nDate1.print("yyyy" + separator + "mm" + separator + "dd");
			if (obj.config.expandTime) {
				printDate += " " + obj.mycalendartime1.getTime();
			}
			axdom("#" + obj.config.startTargetID).val(printDate);
		} else {
			var separator = (obj.config.separator) ? obj.config.separator : "-";
			var printDate = obj.nDate2.print("yyyy" + separator + "mm" + separator + "dd");
			if (obj.config.expandTime) {
				printDate += " " + obj.mycalendartime2.getTime();
			}
			axdom("#" + objID).val(printDate);
		}
	},
	bindTwinDateExpandClose: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		//trace("bindTwinDateExpandClose");
		if (AXgetId(cfg.targetID + "_AX_" + objID + "_AX_expandBox")) {

			//axdom("#"+cfg.targetID+"_AX_"+objID+"_AX_Handle").removeClass("on");
			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
			var objVal1 = axdom("#" + obj.config.startTargetID).val();
			var objVal2 = axdom("#" + objID).val();
			var separator = (obj.config.separator) ? obj.config.separator : "-";

			if (obj.config.selectType == "y") {
				if (objVal1.length < 4) axdom("#" + obj.config.startTargetID).val(obj.nDate1.print("yyyy"));
				else {
					objVal1 = objVal1.left(4);
					axdom("#" + obj.config.startTargetID).val(objVal1);
				}
				if (objVal2.length < 4) axdom("#" + objID).val(obj.nDate2.print("yyyy"));
				else {
					objVal2 = objVal2.left(4);
					axdom("#" + objID).val(objVal2);
				}
			} else if (obj.config.selectType == "m") {
				axdom("#" + obj.config.startTargetID).val(obj.nDate1.print("yyyy" + separator + "mm"));
				axdom("#" + objID).val(obj.nDate2.print("yyyy" + separator + "mm"));
			} else {
				printDate1 = obj.nDate1.print("yyyy" + separator + "mm" + separator + "dd");
				printDate2 = obj.nDate2.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate1 += " " + obj.mycalendartime1.getTime();
					printDate2 += " " + obj.mycalendartime2.getTime();
				}
				axdom("#" + obj.config.startTargetID).val(printDate1);
				axdom("#" + objID).val(printDate2);
			}

			axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리

			if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;
			if (obj.config.onChange) {
				obj.config.onChange.call({
					ST_objID: obj.config.startTargetID,
					ED_objID: objID,
					ST_value: axdom("#" + obj.config.startTargetID).val(),
					ED_value: axdom("#" + objID).val()
				});
			}
			obj.expandBox_axdom = null;
			//비활성 처리후 메소드 종료
			axdom(document).unbind("click.AXInput");
			axdom("#" + objID).unbind("keydown.AXInput");

			event.stopPropagation(); // disableevent
			return;
		}
	},
	bindTwinDateExpandBoxClick: function (objID, objSeq, event) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var isDateClick = false;

		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt: eventTarget,
			until: function (evt, evtIDs) {
				return (evt.parentNode.tagName == "body") ? true : false;
			},
			find: function (evt, evtIDs) {
				if (evt.id == "" || evt.id == null || evt.id == undefined) return false;
				if (evt.id == objID || evt.id == obj.config.startTargetID || (evt.id.substr(0, cfg.targetID.length) == cfg.targetID && (evt.id.search(objID) != -1 || evt.id.search(obj.config.startTargetID) != -1))) {
					return true;
				} else {
					return false;
				}
			}
		});

		isDateClick = (myTarget) ? true : false;
		if (!isDateClick) {
			this.bindTwinDateExpandClose(objID, objSeq, event);
		} else {
			var ids = myTarget.id.split(/_AX_/g);
			var ename = ids.last();
			var boxType = ids[ids.length - 3];
			var nDate1 = obj.nDate1;
			var nDate2 = obj.nDate2;
			var separator = (obj.config.separator) ? obj.config.separator : "-";
			if (ename == "expandPrev1") {
				if (obj.mycalendarPageType == "d") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(-1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(-1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(-12, "y"), "y");
				}
			} else if (ename == "expandPrev2") {
				if (obj.mycalendarPageType == "d") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(-1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(-1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(-12, "y"), "y");
				}
			} else if (ename == "expandNext1") {
				if (obj.mycalendarPageType == "d") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1.add(12, "y"), "y");
				}
			} else if (ename == "expandNext2") {
				if (obj.mycalendarPageType == "d") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(1, "m"), "d");
				} else if (obj.mycalendarPageType == "m") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(1, "y"), "m");
				} else if (obj.mycalendarPageType == "y") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2.add(12, "y"), "y");
				}
			} else if (ename == "controlYear1") {
				this.bindTwinDateChangePage(objID, objSeq, 1, nDate1, "y");
			} else if (ename == "controlYear2") {
				this.bindTwinDateChangePage(objID, objSeq, 2, nDate2, "y");
			} else if (ename == "controlMonth1") {
				if (obj.config.selectType != "y") {
					this.bindTwinDateChangePage(objID, objSeq, 1, nDate1, "m");
				}
			} else if (ename == "controlMonth2") {
				if (obj.config.selectType != "y") {
					this.bindTwinDateChangePage(objID, objSeq, 2, nDate2, "m");
				}
			} else if (ename == "date") {
				if (boxType == "displayBox1") {
					obj.nDate1 = ids[ids.length - 2].date();
					var printDate = obj.nDate1.print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						printDate += " " + obj.mycalendartime1.getTime();
					}
					axdom("#" + obj.config.startTargetID).val(printDate);
					obj.mycalendar1.dayPageSetDay(obj.nDate1);
				} else {
					obj.nDate2 = ids[ids.length - 2].date();
					var printDate = obj.nDate2.print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						printDate += " " + obj.mycalendartime2.getTime();
					}
					axdom("#" + objID).val(printDate);
					obj.mycalendar2.dayPageSetDay(obj.nDate2);
				}

				if (obj.nDate1.diff(obj.nDate2) < 0) {
					if (boxType == "displayBox1") {
						obj.nDate2 = obj.nDate1;
						var printDate = obj.nDate2.print("yyyy" + separator + "mm" + separator + "dd");
						if (obj.config.expandTime) {
							printDate += " " + obj.mycalendartime2.getTime();
						}
						axdom("#" + objID).val(printDate);
						obj.mycalendar2.dayPageSetDay(obj.nDate2);
					} else {
						obj.nDate1 = obj.nDate2;
						var printDate = obj.nDate1.print("yyyy" + separator + "mm" + separator + "dd");
						if (obj.config.expandTime) {
							printDate += " " + obj.mycalendartime1.getTime();
						}
						axdom("#" + obj.config.startTargetID).val(printDate);
						obj.mycalendar1.dayPageSetDay(obj.nDate1);
					}
				}

			} else if (ename == "month") {
				var myMonth = ids[ids.length - 2].number() - 1;
				if (boxType == "displayBox1") {
					if (obj.config.selectType == "m") {
						var yy = nDate1.getFullYear();
						var dd = nDate1.getDate();
						obj.nDate1 = new Date(yy, myMonth, dd);
						var printDate = obj.nDate1.print("yyyy" + separator + "mm");
						axdom("#" + obj.config.startTargetID).val(printDate);
						//this.bindTwinDateExpandClose(objID, objSeq, event);
						obj.mycalendar1.monthPageSetMonth(obj.nDate1);
					} else {
						var yy = nDate1.getFullYear();
						var dd = nDate1.getDate();
						obj.nDate1 = new Date(yy, myMonth, dd);
						//trace("start ----");
						this.bindTwinDateChangePage(objID, objSeq, 1, obj.nDate1, "d");
					}
				} else {
					if (obj.config.selectType == "m") {
						var yy = nDate2.getFullYear();
						var dd = nDate2.getDate();
						obj.nDate2 = new Date(yy, myMonth, dd);
						var printDate = obj.nDate2.print("yyyy" + separator + "mm");
						axdom("#" + objID).val(printDate);
						obj.mycalendar2.monthPageSetMonth(obj.nDate2);
					} else {
						var yy = nDate2.getFullYear();
						var dd = nDate2.getDate();
						obj.nDate2 = new Date(yy, myMonth, dd);
						this.bindTwinDateChangePage(objID, objSeq, 2, obj.nDate2, "d");
					}
				}

				if (obj.config.selectType == "m") {
					if (obj.nDate1.diff(obj.nDate2) < 0) {
						obj.nDate2 = obj.nDate1;
						var printDate = obj.nDate2.print("yyyy" + separator + "mm");
						axdom("#" + objID).val(printDate);
						axdom("#" + obj.config.startTargetID).val(printDate);
						obj.mycalendar2.monthPageSetMonth(obj.nDate2);
					}
				}


			} else if (ename == "year") {
				var myYear = ids[ids.length - 2];
				if (boxType == "displayBox1") {
					if (obj.config.selectType == "y") {
						var mm = nDate1.getMonth();
						var dd = nDate1.getDate();
						obj.nDate1 = new Date(myYear, mm, dd);
						var printDate = obj.nDate1.print("yyyy");
						axdom("#" + obj.config.startTargetID).val(printDate);
						//this.bindTwinDateExpandClose(objID, objSeq, event);
						obj.mycalendar1.yearPageSetYear(obj.nDate1);
					} else {
						var mm = nDate1.getMonth();
						var dd = nDate1.getDate();
						obj.nDate1 = new Date(myYear, mm, dd);
						this.bindTwinDateChangePage(objID, objSeq, 1, obj.nDate1, "m");
					}
				} else {
					if (obj.config.selectType == "y") {
						var mm = nDate2.getMonth();
						var dd = nDate2.getDate();
						obj.nDate2 = new Date(myYear, mm, dd);
						var printDate = obj.nDate2.print("yyyy");
						axdom("#" + objID).val(printDate);
						//this.bindTwinDateExpandClose(objID, objSeq, event);
						obj.mycalendar2.yearPageSetYear(obj.nDate2);
					} else {
						var mm = nDate2.getMonth();
						var dd = nDate2.getDate();
						obj.nDate2 = new Date(myYear, mm, dd);
						this.bindTwinDateChangePage(objID, objSeq, 2, obj.nDate2, "m");
					}
				}

				if (obj.config.selectType == "y") {
					if (obj.nDate1.print("yyyy").number() > obj.nDate2.print("yyyy").number()) {
						obj.nDate2 = obj.nDate1;
						var printDate = obj.nDate2.print("yyyy");
						axdom("#" + obj.config.startTargetID).val(printDate);
						axdom("#" + objID).val(printDate);
						obj.mycalendar2.yearPageSetYear(obj.nDate2);
					}
				}
			}
		}
	},
	bindTwinDateKeyup: function (objID, objSeq, event) {
		//trace(event.keyCode);
		if (obj.config.selectType == "y") {

		} else if (obj.config.selectType == "m") {

		} else {

		}
	},
	bindTwinDateChangePage: function (objID, objSeq, objType, setDate, pageType) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var separator = (obj.config.separator) ? obj.config.separator : "-";

		if (pageType == "m") {
			if (objType == 1) {
				//obj.mycalendarPageType = "m";
				obj.nDate1 = setDate;
				obj.mycalendar1.printMonthPage(setDate);
				var myYear = setDate.getFullYear();
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear1").html(myYear + "년");
			} else {
				//obj.mycalendarPageType = "m";
				obj.nDate2 = setDate;
				obj.mycalendar2.printMonthPage(setDate);
				var myYear = setDate.getFullYear();
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear2").html(myYear + "년");
			}
		} else if (pageType == "y") {
			if (objType == 1) {
				//obj.mycalendarPageType = "y";
				obj.nDate1 = setDate;
				obj.mycalendar1.printYearPage(setDate.getFullYear());
				var myYear = setDate.getFullYear();
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear1").html(myYear + "년");
			} else {
				//obj.mycalendarPageType = "y";
				obj.nDate2 = setDate;
				obj.mycalendar2.printYearPage(setDate.getFullYear());
				var myYear = setDate.getFullYear();
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear2").html(myYear + "년");
			}
		} else {
			//obj.mycalendarPageType = "d";

			//trace({objID:objID, objSeq:objSeq, objType:objType, setDate:setDate, pageType:pageType});

			if (objType == 1) {
				obj.nDate1 = setDate;
				obj.mycalendar1.printDayPage(setDate);
				var myYear = setDate.getFullYear();
				var myMonth = (setDate.getMonth() + 1).setDigit(2);
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear1").html(myYear + "년");
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth1").html(myMonth + "월");
			} else {
				obj.nDate2 = setDate;
				obj.mycalendar2.printDayPage(setDate);
				var myYear = setDate.getFullYear();
				var myMonth = (setDate.getMonth() + 1).setDigit(2);
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlYear2").html(myYear + "년");
				axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_controlMonth2").html(myMonth + "월");
			}
		}

		if (objType == 1) {
			if (obj.config.selectType == "y") {
				axdom("#" + obj.config.startTargetID).val(obj.nDate1.print("yyyy"));
			} else if (obj.config.selectType == "m") {
				axdom("#" + obj.config.startTargetID).val(obj.nDate1.print("yyyy" + separator + "mm"));
			} else {
				var printDate = obj.nDate1.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + obj.mycalendartime1.getTime();
				}
				axdom("#" + obj.config.startTargetID).val(printDate);
			}
		} else {
			if (obj.config.selectType == "y") {
				axdom("#" + objID).val(obj.nDate2.print("yyyy"));
			} else if (obj.config.selectType == "m") {
				axdom("#" + objID).val(obj.nDate2.print("yyyy" + separator + "mm"));
			} else {
				var printDate = obj.nDate2.print("yyyy" + separator + "mm" + separator + "dd");
				if (obj.config.expandTime) {
					printDate += " " + obj.mycalendartime2.getTime();
				}
				axdom("#" + objID).val(printDate);
			}
		}
	},
	bindTwinDateInputBlur: function (objID, objSeq, event, seq) {
		var obj = this.objects[objSeq];
		var cfg = this.config;
		var objVal, targetObjID;
		if (seq == 1) {
			targetObjID = obj.config.startTargetID;
			objVal = axdom("#" + obj.config.startTargetID).val();
		} else {
			targetObjID = objID;
			objVal = axdom("#" + objID).val();
		}

		if (objVal == "") {

		} else {
			var clearDate = false;
			var nDate = (obj["nDate" + seq] || new Date());
			var va = axdom("#" + targetObjID).val().replace(/\D/gi, ""); //숫자 이외의 문자를 제거 합니다.
			if (va.search(/\d+/g) == -1) {
				clearDate = true;
			}

			if (clearDate) {
				axdom("#" + targetObjID).val("");
			} else {
				var separator = (obj.config.separator) ? obj.config.separator : "-";
				if (obj.config.selectType == "y") {

					var yy = va.left(4).number();
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					var mm = nDate.getMonth();
					var dd = nDate.getDate();
					obj["nDate" + seq] = new Date(yy, mm, dd, 12);

					axdom("#" + targetObjID).val(obj["nDate" + seq].print("yyyy"));

				} else if (obj.config.selectType == "m") {

					if (va.length > 5) {
						var yy = va.left(4).number();
						var mm = va.substr(4, 2).number() - 1;
						var dd = 1;
					} else {
						var yy = va.left(4).number();
						var mm = 0;
						var dd = 1;
					}
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					obj["nDate" + seq] = new Date(yy, mm, dd, 12);

					axdom("#" + targetObjID).val(obj["nDate" + seq].print("yyyy" + separator + "mm"));

				} else {
					var needAlert = false;
					if (va.length > 7) {
						var yy = va.left(4).number();
						var mm = va.substr(4, 2).number() - 1;
						var dd = va.substr(6, 2).number();
					} else if (va.length > 5) {
						var yy = va.left(4).number();
						var mm = va.substr(4, 2).number() - 1;
						var dd = 1;
					} else {
						var yy = va.left(4).number();
						var mm = nDate.getMonth();
						var dd = nDate.getDate();
					}
					if (yy == 0) needAlert = true;
					if (yy == 0) yy = nDate.getFullYear();
					if (yy < 1000) yy += 2000;
					obj["nDate" + seq] = new Date(yy, mm, dd, 12);

					if (obj["nDate" + seq].getFullYear() != yy.number()
						|| obj["nDate" + seq].getMonth() != mm.number()
						|| obj["nDate" + seq].getDate() != dd.number()) {
						needAlert = true;
						obj["nDate" + seq] = new Date();
					}

					printDate = obj["nDate" + seq].print("yyyy" + separator + "mm" + separator + "dd");
					if (obj.config.expandTime) {
						printDate += " " + obj["mycalendartime" + seq].getTime();
					}

					if (needAlert) {
						this.msgAlert("날짜 형식이 올바르지 않습니다.");
					}
					axdom("#" + targetObjID).val(printDate);

					if (obj.nDate1 == undefined) {
						var va = axdom("#" + obj.config.startTargetID).val().replace(/\D/gi, ""); //숫자 이외의 문자를 제거 합니다.
						if (va.search(/\d+/g) != -1) {
							if (va.length > 7) {
								var yy = va.left(4).number();
								var mm = va.substr(4, 2).number() - 1;
								var dd = va.substr(6, 2).number();
							} else if (va.length > 5) {
								var yy = va.left(4).number();
								var mm = va.substr(4, 2).number() - 1;
								var dd = 1;
							} else {
								var yy = va.left(4).number();
								var mm = nDate.getMonth();
								var dd = nDate.getDate();
							}
							if (yy == 0) needAlert = true;
							if (yy == 0) yy = nDate.getFullYear();
							if (yy < 1000) yy += 2000;
							obj.nDate1 = new Date(yy, mm, dd, 12);
						}
					}
					if (obj.nDate2 == undefined) {
						obj.nDate2 = obj.nDate1;
						printDate = obj["nDate" + 2].print("yyyy" + separator + "mm" + separator + "dd");
						if (obj.config.expandTime) {
							printDate += " " + obj["mycalendartime" + 2].getTime();
						}
						axdom("#" + objID).val(printDate);
					}

					if (obj.nDate1.diff(obj.nDate2) < 0) {
						if (seq == 1) {
							obj.nDate2 = obj.nDate1;
							printDate = obj["nDate" + 2].print("yyyy" + separator + "mm" + separator + "dd");
							if (obj.config.expandTime) {
								printDate += " " + obj["mycalendartime" + 2].getTime();
							}
							axdom("#" + objID).val(printDate);
						} else {
							obj.nDate1 = obj.nDate2;
							printDate = obj["nDate" + 1].print("yyyy" + separator + "mm" + separator + "dd");
							if (obj.config.expandTime) {
								printDate += " " + obj["mycalendartime" + 1].getTime();
							}
							axdom("#" + obj.config.startTargetID).val(printDate);
						}
					}
				}
			}
		}

		if (!obj.config.onChange) obj.config.onChange = obj.config.onchange;
		if (obj.config.onChange) {
			obj.config.onChange.call({
				event: event,
				ST_objID: obj.config.startTargetID,
				ED_objID: objID,
				ST_value: axdom("#" + obj.config.startTargetID).val(),
				ED_value: axdom("#" + objID).val()
			});
		}

		/* ie10 버그 픽스
		 axdom("#" + cfg.targetID + "_AX_" + objID + "_AX_expandBox").remove(); // 개체 삭제 처리

		 //비활성 처리후 메소드 종료
		 axdom(document).unbind("click.AXInput");
		 axdom("#" + objID).unbind("keydown.AXInput");
		 */
		event.stopPropagation(); // disableevent
		return;
	},

	// checked
	bindChecked: function (objID, objSeq){
		var cfg = this.config;
		var obj = this.objects[objSeq];

		//if(!obj.bindAnchorTarget) obj.bindAnchorTarget = axdom("#" + cfg.targetID + "_AX_" + objID);
		if(!obj.bindTarget) obj.bindTarget = axdom("#" + objID);
		var tagName = obj.bindTarget.get(0).tagName.ucase();

		if(tagName == "LABEL"){

		}else if(tagName == "INPUT"){

		}else{

		}

		/*
		 $(".AXCheckbox").find("input").bind("click", function(){
		 if(this.checked)this.checked = true;else this.checked = false;
		 if($(this).parent().hasClass("checked")) $(this).parent().removeClass("checked");else $(this).parent().addClass("checked");
		 });
		 */

	}
});

var AXInput = new AXInputConverter();
AXInput.setConfig({ targetID: "inputBasic" });

axdom.fn.unbindInput = function (config) {
	axf.each(this, function () {
		if (config == undefined) config = {};
		config.id = this.id;
		AXInput.unbind(config);
	});
	return this;
};

axdom.fn.bindSearch = function (config) {
	axf.each(this, function () {
		if (config == undefined) config = {};
		config.id = this.id;
		config.bindType = "search";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindNumber = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "number";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindMoney = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "money";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindSelector = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "selector";
		AXInput.bind(config);
	});
	return this;
};
axdom.fn.bindSelectorBlur = function (config) {
	axf.each(this, function () {
		AXInput.bindSelectorBlur(this.id);
	});
	return this;
};

axdom.fn.bindSlider = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "slider";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindTwinSlider = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "twinSlider";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindSwitch = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "switch";
		AXInput.bind(config);
		return this;
	});
};

axdom.fn.bindSegment = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "segment";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindDate = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "date";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.unbindDate = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		AXInput.unbindDate(config);
	});
	return this;
};

axdom.fn.bindDateTime = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "date";
		config.expandTime = true;
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindTwinDate = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "twinDate";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindTwinDateTime = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "twinDateTime";
		config.expandTime = true;
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindPlaceHolder = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "placeHolder";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.bindChecked = function (config) {
	axf.each(this, function () {
		config = config || {}; config.id = this.id;
		config.bindType = "checked";
		AXInput.bind(config);
	});
	return this;
};

axdom.fn.setConfigInput = function (config) {
	axf.each(this, function () {
		AXInput.bindSetConfig(this.id, config);
	});
	return this;
};

axdom.fn.setValueInput = function (value) {
	axf.each(this, function () {
		AXInput.bindSetValue(this.id, value);
	});
	return this;
};
