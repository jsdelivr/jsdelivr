var AXJ = Class.create({
    version: "AXJ - v1.0",
    author: "tom@axisj.com",
    logs: [
        "2012-09-28 오후 2:58:32 - 시작"
    ],
    initialize: function () {
        this.config = {
            debugMode: false,
            hashSpliter: "_",
            href: "href=\"javascript:;\""
        };
    },
    init: function () {
        trace(Object.toJSON(this.config));
    },
    info: function (dispType) {
        if (dispType == undefined || dispType == "console")
            trace(this.version + "\n" + this.logs.join("\n"));
        else if (dispType == "alert")
            AXUtil.alert(this.version + "\n" + this.logs.join("\n"));
        else if (dispType == "return")
            return this.version + "\n" + this.logs.join("\n");
    },
    echo: function (msg, mtype) {
        if (mtype == undefined || mtype == "console")
            trace(msg);
        else if (mtype == "alert")
            AXUtil.alert(msg);
        else if (mtype == "toast")
            toast.push(msg);
        else if (mtype == "dialog")
            dialog.push(msg);
    },
    setConfig: function (configs) {
        var _self = this;
        if (configs) AXUtil.each(configs, function (k, v) { _self.config[k] = v; });
        if(_self.config.target) if(_self.config.target.id === undefined || _self.config.target.id == "") axdom(_self.config.target).attr("id", _self.config.target.id = _self.config.targetID = "AXJUnique_"+axf.getUniqueId());
        this.init();
    },
    changeConfig: function (configs) {
        var _self = this;
        if (configs) AXUtil.each(configs, function (k, v) { _self.config[k] = v; });
    },
    getEventTarget: function (arg) {
        var eventTarget = arg.evt;
        var eid = (eventTarget && eventTarget.id && eventTarget.id != "") ? eventTarget.id.split(/_AX_/g) : [];
        if (eventTarget) {
            while (!arg.find(eventTarget, eid)) {
                if (!eventTarget.parentNode) { eventTarget = null; break; }
                if (arg.until) { if (arg.until(eventTarget, eid)) { eventTarget = null; break; } }
                if (eventTarget.parentNode) {
                    eventTarget = eventTarget.parentNode;
                    try {
                        eid = (eventTarget && eventTarget.id && eventTarget.id != "") ? eventTarget.id.split(/_AX_/g) : [];
                    } catch (e) {
                        eid = [];
                    }
                } else {
                    //trace("break");
                    break;
                }
            }
        }
        return eventTarget;
    },
    getMousePositon: function (event) {
        var eventDoc, doc, body;
        eventDoc = document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;
        var css = {};

        //trace({ cy: event.clientY, st: (doc && doc.scrollTop || body && body.scrollTop || 0), ct: (doc && doc.clientTop || body && body.clientTop || 0) });
        css.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        css.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        return css;
    },
    _GID: function (ids) {
        var myid = [];
        for (var a = 0; a < ids.length; a++) {
            myid.push(ids[a]);
        }
        return myid.join("_");
    },
    _GPT: function (myid, idx) {
        var ids = myid.split(/_/g);
        if (idx == undefined) {
            return ids.last();
        } else {
            return ids[idx];
        }
    },
    stopEvent: function (event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        event.cancelBubble = true;
        return false;
    },
    clearRange: function () {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    },
    windowResize: function () {
        var windowResizeApply = this.windowResizeApply.bind(this);
        if (this.windowResizeObserver) clearTimeout(this.windowResizeObserver);
        this.windowResizeObserver = setTimeout(function () {
            windowResizeApply();
        }, 1);
    },
    windowResizeApply: function () {

    }
});

// -- AXReq ----------------------------------------------
/**
 * AXReqQue
 * @class AXReqQue
 * @version v1.1
 * @author tom@axisj.com
 * @logs
 * 2012-09-28 오후 2:58:32 - 시작
 * 2014-04-10 - tom : onbeforesend 옵션 추가 return false 하면 호출 제어됨.
 * @description
 * ```js
 var url = "AXReqData.txt";
 var pars = "";
 new AXReq(url, {
    debug:false,
    pars:pars,
    onbeforesend: function(){
        alert("제어");
        return true;
    },
    onsucc:function(res){
        AXUtil.alert(res);
    },
    onerr:function(res){
        alert("onFail:" + req.responseText);
    }
});
 ```
 *
 */
var AXReqQue = Class.create({
    initialize: function () {
        this.que = [];
        this.busy = false;
    },
    add: function (obj) {
        this.que.push(obj);

        try {
            this.start();
        } catch (e) {
            //AXUtil.alert(e);	
        }
    },
    start: function () {
        if (this.que.length == 0) return;
        if (this.busy) return;

        this.busy = true;
        var myQue = this.que.first();
        var _self = this;
        var config = {
            type: "post",
            onsucc: "",
            async: AXConfig.AXReq.async,
            responseType: AXConfig.AXReq.responseType,
            dataType: AXConfig.AXReq.dataType,
            contentType: AXConfig.AXReq.contentType,
            debug: false
        };
        AXUtil.each(myQue.configs, function (k, v) { // update to {this.config}
            if (k == "pars") {

            }
            else {
                config[k] = v;
            }
        });

        var onerr = this.onerror.bind(this);
        var ontimeout = this.ontimeout.bind(this);
        var onsucc = this.onsucc.bind(this);

        if (AXConfig.AXReq.dataSendMethod != "json") {

        } else {
            if (typeof myQue.configs.pars == "object") {
                myQue.configs.pars.dummy = AXUtil.timekey();
            } else if (typeof myQue.configs.pars == "string") {
                if (myQue.configs.pars == "") myQue.configs.pars += "dummy=" + AXUtil.timekey();
                else myQue.configs.pars += "&dummy=" + AXUtil.timekey();
            }
        }

        if (config.debug) trace({ url: myQue.url, pars: myQue.configs.pars });

        var ajaxOption = {};
        AXUtil.each(config, function (k, v) { // update to {this.config}
            ajaxOption[k] = v;
        });
        ajaxOption.url = myQue.url;

        if (AXConfig.AXReq.dataSendMethod == "json") ajaxOption["data"] = "{queryString:\"" + myQue.configs.pars + "\"}";
        else ajaxOption["data"] = myQue.configs.pars;

        ajaxOption.success = onsucc;
        ajaxOption.error = onerr;
        ajaxOption.timeout = ontimeout;


        if (myQue.configs.onbeforesend) {
            if(!myQue.configs.onbeforesend.call(ajaxOption)){
                return false;
            }
        }

        this.que[0]._jQueryAjax = axdom.ajax(ajaxOption);
    },
    onsucc: function (req) {
        if (req != undefined) {
            var myQue = this.que.first();

            try {
                if (myQue.configs.debug) trace("onsucc" + req);
                if (myQue.configs.responseType == "text/html") {
                    var res = req;
                } else {
                    if ((typeof req) == "string") {
                        var res = req.object();
                    } else {
                        var res = AXConfig.AXReq.resultFormatter.call(req);
                    }
                }

                if (res.result == "syntaxerr") {
                    if (myQue.configs.onerr) myQue.configs.onerr(res);
                } else {
                    if (myQue.configs.onsucc) myQue.configs.onsucc(res);
                }
            } catch (e) {
                if (myQue.configs.responseType == "text/html") {

                } else {
                    res.e = e;
                }
                if (myQue.configs.onerr) myQue.configs.onerr(res);
            }

            this.que.shift();
            this.busy = false;
            this.start();
        }
    },
    onerror: function (req) {
        var myQue = this.que.first();
        if (myQue.configs.onerr) myQue.configs.onerr(req);
        else trace("error : " + Object.toJSON(req));

        this.que.shift();
        this.busy = false;
        try {
            mask.close();
        } catch (e) { }
    },
    ontimeout: function (req) {
        trace("onTimeout:" + req.responseText);
        this.que.shift();
        this.busy = false;
        try {
            mask.close();
        } catch (e) { }
    },
    abort: function(){
        try{
            this.que[0]._jQueryAjax.abort();
        }catch(e){

        }
    }
});
var myAXreqQue = new AXReqQue();
var AXReqAbort = function(){
    myAXreqQue.abort();
};
var AXReq = Class.create({
    version: "AXReq v1.0",
    author: "tom@axisj.com",
    logs: [
        "2012-09-28 오후 2:58:32 - 시작"
    ],
    initialize: function (url, configs) {
        if (window.location.toString().left(4) != "http") {
            //dialog.push("현재 파일시스템으로 샘플 코드를 보고 계십니다. ajax 통신 관련한 기능은 정상 작동하지 않게 됩니다. ");
        }
        myAXreqQue.add({ url: url, configs: configs });
    }
});
/* ---------------------------------------------- AXReq -- */

/* -- AXMask ---------------------------------------------- */
var AXMask = Class.create(AXJ, {
    version: "AXMask v1.0",
    author: "tom@axisj.com",
    logs: [
        "2012-10-06 오후 4:17:59"
    ],
    initialize: function (AXJ_super) {
        AXJ_super();
        this.selects = [];
        this.config.maskClassName = "AXMask";
        this.config.maskContentClassName = "AXMaskContent";
        this.config.content = "disable content";
        this.config.maskZindex = "5000";
        this.blinkTrack = [];
    },
    init: function () {
        this.mask = axdom("<div class=\"" + this.config.maskClassName + "\" style=\"z_index:" + this.config.maskZindex + "\"></div>");
        //this.content = axdom("<div class=\"" + this.config.maskClassName + "\" style=\"z_index:" + this.config.maskZindex + "\"></div>");
    },
    open: function (configs) {
        axdom(document.body).append(this.mask);
        var bodyHeight = 0;
        (AXUtil.docTD == "Q") ? bodyHeight = document.body.clientHeight : bodyHeight = document.documentElement.clientHeight;

        if(configs){
            if(!configs.onclick) configs.onclick = configs.onClick;
            if(configs.onclick){
                this.mask.bind("click.AXMask", configs.onclick);
            }
        }
    },
    close: function (delay) {
        if (!delay) {
            this.mask.unbind("click.AXMask");
            this.mask.remove();
        } else {
            var maskHide = this.hide.bind(this);
            setTimeout(maskHide, delay);
        }
        this.blinkTrack.clear();
    },
    hide: function () {
        this.mask.unbind("click.AXMask");
        this.mask.remove();
        this.blinkTrack.clear();
    },
    setCSS: function (CSS) {
        this.mask.css(CSS);
    },
    addClass: function (className) {
        this.mask.addClass(className);
    },
    removeClass: function (className) {
        this.mask.removeClass(className);
    },
    blink: function (obj) {
        this.blinkTrack = [{ css: { opacity: 0.1 }, time: 1000 }, { css: { opacity: 0.8 }, time: 1000 }];
        if (obj) this.blinkTrack = obj;
        this.blinking(0);
    },
    stopBlink: function (obj) {
        this.blinkTrack.clear();
    },
    blinking: function (blinkIndex) {
        if (this.blinkTrack.length > 0) {
            var blinkTrack = this.blinkTrack;
            var onblink = this.blinking.bind(this);
            this.mask.animate(blinkTrack[blinkIndex].css, blinkTrack[blinkIndex].time, 'circInOut', function () {
                onblink((blinkIndex + 1) % blinkTrack.length);
            });
        }
    },
	setContent: function(content){
		var po = [];
		if(Object.isString(content)){
			po.push(content);
		}else{
			var po = [];
			po.push("<div style='width: "+content.width+"px;height:"+content.height+"px;position: absolute;left:50%;top:50%;text-align: center;margin-left: -"+ (content.width/2) +"px;margin-top:-"+ (content.height/2) +"px;'>");
			po.push(content.html);
			po.push("</div>")
		}
		this.mask.html(po.join(''));
	}
});
var mask = new AXMask();
mask.setConfig();
/* ---------------------------------------------- AXMask -- */

/* -- AXNotification ---------------------------------------------- */
/**
 * AXNotification
 * @class AXNotification
 * @extends AXJ
 * @version v1.2
 * @author tom@axisj.com
 * @logs
 "2012-10-30 오후 12:01:10",
 "2013-01-09 오후 1:46:55 push type bug fix - tom"
 "2014-05-23 tom : dialog 에서 mask 제어 안하도록 변경"
 "2014-05-26 tom : dialog 에서 top 속성 설정 추가"
 */
var AXNotification = Class.create(AXJ, {
    initialize: function (AXJ_super) {
        AXJ_super();
        this.Observer = null;
        this.lasBreadSeq = 0;
        this.bread = [];
        this.config.easing = { open: { duration: 300, easing: "expoOut" }, close: { duration: 500, easing: "expoOut" } };
        this.config.eatUpTime = 2500;
        this.config.confirmStr = "확인";
        this.config.cancelStr = "취소";
    },
    init: function () {
        var config = this.config;
        if (config.type == "toast") {
            this.toastTray = axdom("<div class=\"AXNotificationTray\" id=\"" + config.targetID + "\"></div>");
        } else if (config.type == "dialog") {
            this.dialogTray = axdom("<div class=\"AXNotificationTrayDialog\" id=\"" + config.targetID + "\"></div>");
            //dialog type display center;
        }
    },
    push: function (obj) {
        var config = this.config;
        var breadID = config.targetID + "" + this.lasBreadSeq;
        this.lasBreadSeq++;

        var po = [];
        if ((typeof obj).toLowerCase() != "object") {
            po.push("<div class=\"AXNotification\" id=\"bread_AX_" + breadID + "\" style=\"display:none;\">");
            if (config.type == "dialog") {
                po.push("<div class=\"AXNotificationHead\">" + (obj.title || "Dialog Message") + "</div>");
            }
            po.push("<div class=\"AXNotificationCT\">");
            po.push("	<table cellpadding=\"0\" cellspacing=\"0\" class=\"AXNotificationTable\">");
            po.push("		<tbody>");
            po.push("			<tr>");
            po.push("				<td class=\"AXNotificationIcon\"></td>");
            po.push("				<td class=\"AXNotificationBody\">");
            po.push(obj);
            po.push("				</td>");
            po.push("			</tr>");
            po.push("		</tbody>");
            po.push("	</table>");

            if (config.type == "dialog") {
                po.push("	<div class=\"AXNotificationButtons\">");
                po.push("	<input type=\"button\" value=\"" + config.confirmStr + "\" class=\"AXButton Red W40\"  id=\"bread_AX_" + breadID + "_AX_confirm\" />");
                po.push("	</div>");
            }

            po.push("</div>");
            po.push("</div>");

        } else {
            po.push("<div class=\"AXNotification " + obj.type + "\" id=\"bread_AX_" + breadID + "\" style=\"display:none;\">");
            if (config.type == "dialog") {
                po.push("<div class=\"AXNotificationHead\">" + (obj.title || "Dialog Message") + "</div>");
            }
            po.push("<div class=\"AXNotificationCT\">");
            po.push("	<table cellpadding=\"0\" cellspacing=\"0\" class=\"AXNotificationTable\">");
            po.push("		<tbody>");
            po.push("			<tr>");
            po.push("				<td class=\"AXNotificationIcon\"></td>");
            po.push("				<td class=\"AXNotificationBody\">");
            po.push(obj.body);
            po.push("				</td>");
            if (obj.type == "Caution" && config.type != "dialog") {
                if (!obj.buttons) {
                    po.push("				<td class=\"AXNotificationButton\" align=\"right\">");
                    po.push("				<input type=\"button\" value=\"" + config.confirmStr + "\" class=\"AXButton Red W40\"  id=\"bread_AX_" + breadID + "_AX_confirm\" />");
                    po.push("				</td>");
                }
            }
            po.push("			</tr>");
            po.push("		</tbody>");
            po.push("	</table>");
            if (obj.buttons) {
                po.push("	<div class=\"AXNotificationButtons\">");
                AXUtil.each(obj.buttons, function (index, B) {
                    po.push("	<input type=\"button\" value=\"" + this.buttonValue + "\" class=\"AXButton " + (this.buttonClass || "") + "\"  id=\"bread_AX_" + breadID + "_AX_buttons_AX_" + index + "\" />");
                });
                po.push("	</div>");
            } else if (config.type == "dialog") {
                po.push("	<div class=\"AXNotificationButtons\">");
                po.push("	<input type=\"button\" value=\"" + config.confirmStr + "\" class=\"AXButton Red W40\"  id=\"bread_AX_" + breadID + "_AX_confirm\" />");
                po.push("	</div>");
            }
            po.push("</div>");
            po.push("</div>");

        }

        if (config.type == "toast") {
            if (!AXgetId(config.targetID)) axdom(document.body).append(this.toastTray);
            this.bread.push({ breadID: breadID, type: obj.type, html: po.join('').enc() });
            this.insertBread();
        } else if (config.type == "dialog") {
            if (!AXgetId(config.targetID)) axdom(document.body).append(this.dialogTray);
            this.dialogTray.prepend(po.join(''));



            var bodyWidth = (AXUtil.docTD == "Q") ? document.body.clientWidth : document.documentElement.clientWidth;
            //var l = bodyWidth / 2 - this.dialogTray.width() / 2;
	        if(obj.top != undefined){
		        this.dialogTray.css({ top:obj.top });
	        }else{
		        this.dialogTray.css({ top:50 });
	        }


            axdom("#bread_AX_" + breadID).fadeIn();

            var endCheck = this.endCheck.bind(this);

            //Confirm button
            axdom("#bread_AX_" + breadID + "_AX_confirm").bind("click", function () {
                if (obj.onConfirm) obj.onConfirm(obj.data);
                axdom("#bread_AX_" + breadID).fadeOut({
                    duration: config.easing.close.duration, easing: config.easing.close.easing, complete: function () {
                        axdom("#bread_AX_" + breadID).remove();
                        endCheck();
                    }
                });
            });

            //AXBUTTON
            axdom(".AXNotificationButtons").find(".AXButton").bind("click", function (event) {
                var eid = event.target.id.split(/_AX_/g);
                var myBreadID = eid[1];
                var buttonSeq = eid.last();
                if (obj.buttons) {
                    if (obj.buttons[buttonSeq]) {
                        if (obj.buttons[buttonSeq].onClick) obj.buttons[buttonSeq].onClick(obj.buttons[buttonSeq].data);
                    }
                }
                axdom("#bread_AX_" + myBreadID).fadeOut({
                    duration: config.easing.close.duration, easing: config.easing.close.easing, complete: function () {
                        axdom("#bread_AX_" + myBreadID).remove();
                        endCheck();
                    }
                });
            });

            axdom(".AXNotificationButtons").find(".AXButton").get(0).focus();

            axdom(document.body).unbind("keyup."+breadID).bind("keyup."+breadID, function(event){
                if(event.keyCode == AXUtil.Event.KEY_ESC){
                    axdom("#bread_AX_" + breadID).fadeOut({
                        duration: config.easing.close.duration, easing: config.easing.close.easing, complete: function () {
                            axdom("#bread_AX_" + breadID).remove();
                            endCheck(breadID);
                        }
                    });
                }
            });
        }
    },
    insertBread: function () {
        var config = this.config;
        if (this.bread.length == 0) {
            return;
        }
        if (this.busy) return;
        this.busy = true;

        var nextBread = this.nextBread.bind(this);
        var endCheck = this.endCheck.bind(this);

        var myQue = this.bread.first();
        var breadID = myQue.breadID;
        axdom("#" + config.targetID).prepend(myQue.html.decode());
        axdom("#bread_AX_" + breadID + "_AX_confirm").bind("click", function () {
            axdom("#bread_AX_" + breadID).fadeOut({
                duration: config.easing.close.duration, easing: config.easing.close.easing, complete: function () {
                    axdom("#bread_AX_" + breadID).remove();
                    endCheck();
                }
            });
        });

        axdom("#bread_AX_" + breadID).slideDown({
            duration: config.easing.open.duration, easing: config.easing.open.easing, complete: function () {
                nextBread();
                //axdom("#msg").html(axdom("#msg").html()+"<br/>"+AXgetId("bread_AX_"+breadID)+"/"+breadID);
                if (myQue.type != "Caution") {
                    setTimeout(function () {
                        axdom("#bread_AX_" + breadID).fadeOut({
                            duration: config.easing.close.duration, easing: config.easing.close.easing, complete: function () {
                                axdom("#bread_AX_" + breadID).remove();
                                endCheck();
                            }
                        });
                    }, config.eatUpTime);
                }
            }
        });
    },
    nextBread: function () {
        this.bread.shift();
        this.busy = false;
        this.insertBread();
    },
    endCheck: function (breadID) {
        if (axdom("#" + this.config.targetID).html() == "") {
            this.lasBreadSeq = 0;
            if (this.config.type == "dialog") {
                if(breadID) axdom(document.body).unbind("keyup."+breadID);
            }
        }
    }
});

var toast = new AXNotification();
toast.setConfig({ targetID: "basicToast", type: "toast" });

var dialog = new AXNotification();
dialog.setConfig({ targetID: "basicDialog", type: "dialog" });
/* ---------------------------------------------- AXNotification -- */

/**
 * AXScroll
 * @class AXScroll
 * @extends AXJ
 * @version v1.52
 * @author tom@axisj.com
 * @logs
 "2012-10-10 오전 11:17:34",
 "2013-01-08 오후 2:33:39 스크롤대상을 스크롤바에서 컨테이너 기준으로 변경 - root",
 "2013-01-09 오후 1:29:26 mobile 환경에서 클릭버그수정 - tom",
 "2013-01-11 오후 4:18:21 스크롤바 드래그시 컨테이너 top 계산 수정-root",
 "2013-01-11 오후 5:18:54 컨테이너와 스크롤타겟의 높이에 따른 스크롤바표시 관련 수정-root",
 "2013-01-31 오후 3:10:02 스크롤바가 최소일때 휠 및 드래그 계산수정-root ",
 "2013-02-08 오후 5:48:26 컨테이너가 스크롤타켓보다 길때 휠 함수 중단 처리 - tom",
 "2013-02-16 오후 4:13:16 unbind 후 다시 bind할때 생기는 이벤트 중첩현상 처리 - tom",
 "2013-08-01 오후 4:54:17 mobile touch 버그픽스 - tom ",
 "2013-10-16 오후 6:45:48 mobile 스크롤 속도문제 패치 - tom",
 "2013-11-28 오전 11:23:11 tom - AX scrollTop 메소드 추가",
 "2013-12-12 오전 10:25:28 tom - moveTo 메소드 추가",
 "2014-01-06 오후 12:55:20 tom - 관성 작용중 touchStart stop 버그픽스",
 "2014-03-31 오후 6:26:34 root - yscroll 이 없어지면 scroll top 을 0으로"
 "2014-06-13 tom scrollBar 와 content 싱크방식 변경 / 버그픽스"
 "2014-07-14 tom issue#221, issue#222 fix"
 * @description
 *
 ```js
var myUIScroll = new AXScroll(); // 스크롤 인스턴스 선언
myUIScroll.setConfig({
	targetID:"UIScrollContainer",
	scrollID:"UIScrollTarget"
});
 ```
 *
 */
var AXScroll = Class.create(AXJ, {
    initialize: function (AXJ_super) {
        AXJ_super();
        this.config.CT_className = "AXScroll";
        this.config.ST_className = "scrollTarget";
        this.scrollBarMove = false;
        this.scrollBarAttr = {};
        this.Observer = null;
        this.config.yscroll = true;
        this.config.xscroll = false;
	    this.config.scrollBarMargin = 3;

        this.minHeightSB = { TF: false, h: 0 };
        this.minWidthSB = { TF: false, w: 0 };
    },
    init: function () {
        var config = this.config;
        if (Object.isUndefined(config.targetID)) {
            trace("need targetID - setConfig({targetID:''})");
            return;
        }
        if (Object.isUndefined(config.scrollID)) {
            trace("need scrollID - setConfig({scrollID:''})");
            return;
        }
        this.scrollTargetID = axdom("#" + config.targetID);
        this.scrollScrollID = axdom("#" + config.scrollID);
        this.scrollTargetID.addClass(this.config.CT_className);
        this.scrollScrollID.addClass(this.config.ST_className);
        this.initScroll();
        this.bindEvent();
    },
    updateScroll: function () {
        this.initScroll();
    },
    initScroll: function () {
        var cfg = this.config, _this = this;
        if (!this.scroll) {
            var po = [];
            if (cfg.yscroll) {
                po.push("<div class=\"scrollTrack\" id=\"" + cfg.targetID + "_AX_scrollTrack\"></div>");
                po.push("<div class=\"scrollBar\" id=\"" + cfg.targetID + "_AX_scrollBar\"></div>");
            } else {
                this.scrollTargetID.css({ height: this.scrollScrollID.outerHeight() });
                /*
                setTimeout(function(){

                }, 10);
                */
            }
            if (cfg.xscroll) {
                po.push("<div class=\"xscrollTrack\" id=\"" + cfg.targetID + "_AX_xscrollTrack\"></div>");
                po.push("<div class=\"xscrollBar\" id=\"" + cfg.targetID + "_AX_xscrollBar\"></div>");
            }

            this.scrollTargetID.append(po.join(''));
            this.scroll = true;

            if (cfg.yscroll) {
                this.scrollTrack = axdom("#" + cfg.targetID + "_AX_scrollTrack");
                this.scrollBar = axdom("#" + cfg.targetID + "_AX_scrollBar");
            }
            if (cfg.xscroll) {
                this.xscrollTrack = axdom("#" + cfg.targetID + "_AX_xscrollTrack");
                this.xscrollBar = axdom("#" + cfg.targetID + "_AX_xscrollBar");
            }
        } else {
            if (!cfg.yscroll) {
                this.scrollTargetID.css({ height: this.scrollScrollID.outerHeight() });
            }
        }

        var CTheight = this.scrollTargetID.innerHeight();
        var CTwidth = this.scrollTargetID.innerWidth();

        if (cfg.yscroll) {
            this.scrollTrack.css({ height: CTheight - (cfg.scrollBarMargin*2) });
        }
        if (cfg.xscroll) {
            this.xscrollTrack.css({ width: CTwidth - (cfg.scrollBarMargin*2) });
        } else {
            this.scrollScrollID.css({ width: CTwidth });
        }

        var Cheight = this.scrollScrollID.outerHeight();
        var Cwidth = this.scrollScrollID.outerWidth();

        if (cfg.yscroll) {
            var SBheight = CTheight * (CTheight - (cfg.scrollBarMargin*2)) / Cheight;
	        if(SBheight < 30) SBheight = 30;
            this.scrollBar.css({ height: Math.ceil(SBheight) });
	        /*
            if (SBheight < 30) {
                this.minHeightSB.TF = true;
                this.minHeightSB.h = SBheight;
            }
            */
            if (CTheight == Cheight || CTheight > Cheight) {
                this.scrollTrack.hide();
                this.scrollBar.hide();
                this.scrollScrollID.css({ top: 0 });
            } else {
                this.scrollTrack.show();
                this.scrollBar.show();
            }
        }
        if (cfg.xscroll) {
            var SBwidth = CTwidth * (CTwidth - (cfg.scrollBarMargin*2)) / Cwidth;
	        if(SBwidth < 30) SBwidth = 30;
            this.xscrollBar.css({ width: Math.ceil(SBwidth) });
	        /*
            if (SBwidth < 30) {
                this.minWidthSB.TF = true;
                this.minWidthSB.w = SBwidth;
            }
            */
            if (CTwidth == Cwidth || CTwidth > Cwidth) {
                this.xscrollTrack.hide();
                this.xscrollBar.hide();
            } else {
                this.xscrollTrack.show();
                this.xscrollBar.show();
            }
        }
    },
    resizeScroll: function () {
        this.initScroll();
    },
    bindEvent: function () {
        var cfg = this.config;

        var CTheight = this.scrollTargetID.innerHeight();
        var Cheight = this.scrollScrollID.outerHeight();

        if (cfg.xscroll) {
            var CTwidth = this.scrollTargetID.innerWidth();
            var Cwidth = this.scrollScrollID.outerWidth();
        }

        /* event 선언자 */
        var tractActive = this.tractActive.bind(this);
        this.tractActiveBind = function (event) {
            tractActive(event);
        }
        var tractInActive = this.tractInActive.bind(this);
        this.tractInActiveBind = function (event) {
            tractInActive(event);
        }
        var cancelEvent = this.cancelEvent.bind(this);
        this.cancelEventBind = function (event) {
            cancelEvent(event);
        }
        var SBonMouseDown = this.SBonMouseDown.bind(this);
        this.SBonMouseDownBind = function (event) {
            SBonMouseDown(event);
        }
        var SBonMouseMove = this.SBonMouseMove.bind(this);
        this.SBonMouseMoveBind = function (event) {
            SBonMouseMove(event);
        }
        var SBonMouseUp = this.SBonMouseUp.bind(this);
        this.SBonMouseUpBind = function (event) {
            SBonMouseUp(event);
        }
        this.SBonWheelBind = this.SBonWheel.bind(this);
        /* event 선언자 */

        this.scrollTargetID.bind("mouseover", this.tractActiveBind);
        this.scrollTargetID.bind("mouseout", this.tractInActiveBind);

        if (cfg.yscroll) {
            this.scrollBar.bind("dragstart", this.cancelEventBind);
            this.scrollBar.bind("mousedown", this.SBonMouseDownBind);
        }

        if (cfg.xscroll) {
            var SBonMouseDownX = this.SBonMouseDownX.bind(this);
            this.SBonMouseDownXBind = function (event) {
                SBonMouseDownX(event);
            }
            var SBonMouseMoveX = this.SBonMouseMoveX.bind(this);
            this.SBonMouseMoveXBind = function (event) {
                SBonMouseMoveX(event);
            }
            var SBonMouseUpX = this.SBonMouseUpX.bind(this);
            this.SBonMouseUpXBind = function (event) {
                SBonMouseUpX(event);
            }

            this.xscrollBar.bind("dragstart", this.cancelEventBind);
            this.xscrollBar.bind("mousedown", this.SBonMouseDownXBind);
        }

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
        if (document.attachEvent) { //if IE (and Opera depending on user setting)
            if (AXgetId(cfg.targetID)) AXgetId(cfg.targetID).attachEvent("on" + mousewheelevt, this.SBonWheelBind);
        } else if (document.addEventListener) { //WC3 browsers
            if (AXgetId(cfg.targetID)) AXgetId(cfg.targetID).addEventListener(mousewheelevt, this.SBonWheelBind, false);
        }
        if (document.addEventListener) {
            var touchstart = this.touchstart.bind(this);
            this.touchstartBind = function () {
                touchstart();
            };
            if (AXgetId(cfg.targetID)){
                AXgetId(cfg.targetID).addEventListener("touchstart", this.touchstartBind, false);
            }
        }
    },
    tractActive: function (event) {
        var cfg = this.config;

        if (cfg.yscroll) {
            this.scrollBar.addClass("scrollBar_hover");
            this.scrollTrack.addClass("scrollTrack_hover");
        }

        if (cfg.xscroll) {
            this.xscrollBar.addClass("xscrollBar_hover");
            this.xscrollTrack.addClass("xscrollTrack_hover");
        }

        if (this.Observer) clearTimeout(this.Observer); //닫기 명령 제거
        this.initScroll();
    },
    tractInActive: function (event) {
        var SBonWheelEnd = this.SBonWheelEnd.bind(this);
        this.Observer = setTimeout(function () {
            SBonWheelEnd();
        }, 500);
    },
    getMousePosition: function (event) {
        var config = this.config;
        var pos = (this.scrollTrack) ? this.scrollTrack.offset() : { left: 0, top: 0 };
        var posx = (this.xscrollTrack) ? this.xscrollTrack.offset() : { left: 0, top: 0 };

        var x = (event.pageX - posx.left);
        var y = (event.pageY - pos.top);
        return { x: x, y: y };
    },
    getTouchPosition: function (event) {
        /* 사용안함. 옵션 */
        var config = this.config;
        var touch = event.touches[0];
        var pos = this.scrollTrack.offset();
        if (this.config.touchDirection) {
            var x = (touch.pageX - pos.left);
            var y = (touch.pageY - pos.top);
        } else {
            var x = (-touch.pageX - pos.left);
            var y = (-touch.pageY - pos.top);
        }
        return { x: x, y: y };
    },


    /* touch event init --- s */
    touchstart: function (e) {
        if (this.touhEndObserver) clearTimeout(this.touhEndObserver);
        if (this.touhMoveObserver) clearTimeout(this.touhMoveObserver);

        var cfg = this.config;
        var touch;
        var event = window.event;
        touch = event.touches[0];
        if (!touch.pageX) return;

        this.touchStartXY = {
            sTime: ((new Date()).getTime() / 1000),
            sTop: this.scrollScrollID.position().top,
            sLeft: this.scrollScrollID.position().left,
            scrollWidth: this.scrollScrollID.outerWidth(),
            scrollHeight: this.scrollScrollID.outerHeight(),
            targetWidth: this.scrollTargetID.outerWidth(),
            targetHeight: this.scrollTargetID.outerHeight(),
            x: touch.pageX,
            y: touch.pageY
        };

        var touchEnd = this.touchEnd.bind(this);
        this.touchEndBind = function () {
            touchEnd(event);
        };
        var touchMove = this.touchMove.bind(this);
        this.touchMoveBind = function () {
            touchMove(event);
        };

        if (document.removeEventListener) {
            document.removeEventListener("touchend", this.touchEndBind, false);
            document.removeEventListener("touchmove", this.touchMoveBind, false);
        }
        if (document.addEventListener) {
            document.addEventListener("touchend", this.touchEndBind, false);
            document.addEventListener("touchmove", this.touchMoveBind, false);
        }

        var minLeft = 0;
        var maxLeft = - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
        var minTop = 0;
        var maxTop = - (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight);
        var scrollPosition = this.scrollScrollID.position();

        if((scrollPosition.left < minLeft && scrollPosition.left > maxLeft) || (scrollPosition.top < minTop && scrollPosition.top > maxTop)){
            this.scrollScrollID.stop();
            if(cfg.yscroll) this.scrollBar.stop();
            if(cfg.xscroll) this.xscrollBar.stop();
        }

        this.tractActive();
    },
    touchMove: function (e) {
        if (this.touhEndObserver) clearTimeout(this.touhEndObserver);
        if (this.touhMoveObserver) clearTimeout(this.touhMoveObserver);
        var cfg = this.config;

        var touch;
        var event = window.event;
        touch = event.touches[0];
        if (!touch.pageX) return;

        if ((this.touchStartXY.x - touch.pageX).abs() < (this.touchStartXY.y - touch.pageY).abs()) {
            if (cfg.yscroll && this.touchStartXY.scrollHeight > this.touchStartXY.targetHeight) {
                this.touchMode = "ns";
                var touchDirection = ((this.touchStartXY.y - touch.pageY) <= 0) ? "T" : "B"; /* 위아래 이동 */

                if(touchDirection != this.touchDirection){
                    this.touchMoveAfter(touch);
                }

                this.touchDirection = touchDirection;
                if(this.moveBlock({top:touch.pageY - this.touchStartXY.y})){
                    if (event.preventDefault) event.preventDefault();
                    else return false;
                }
            }
        } else if ((this.touchStartXY.x - touch.pageX).abs() > (this.touchStartXY.y - touch.pageY).abs()) {
            if (cfg.xscroll && this.touchStartXY.scrollWidth > this.touchStartXY.targetWidth) {
                this.touchMode = "we";
                var touchDirection = ((this.touchStartXY.x - touch.pageX) <= 0) ? "L" : "R"; /* 좌우 이동 */

                if(touchDirection != this.touchDirection){
                    this.touchMoveAfter(touch);
                }

                this.touchDirection = touchDirection;
                if(this.moveBlock({left:touch.pageX - this.touchStartXY.x})){
                    if (event.preventDefault) event.preventDefault();
                    else return false;
                }
            }
        }
        if (((this.touchStartXY.x - touch.pageX).abs() - (this.touchStartXY.y - touch.pageY).abs()).abs() < 5) {
            //this.touchSelecting = true;
        }
        var touchMoveAfter = this.touchMoveAfter.bind(this);
        this.touhMoveObserver = setTimeout(function () {
            touchMoveAfter(touch);
        }, 50);
    },
    touchMoveAfter: function(touch){
        try{
            this.touchStartXY.sTime = ((new Date()).getTime() / 1000);
            this.touchStartXY.sTop = this.scrollScrollID.position().top;
            this.touchStartXY.sLeft = this.scrollScrollID.position().left;
            this.touchStartXY.x = touch.pageX;
            this.touchStartXY.y = touch.pageY;
        }catch(e){
            //trace(e);
        }
    },
    touchEnd: function (e) {
        var cfg = this.config;
        var event = window.event || e;
        //this.moveSens = 0;
        //this.touchMode = false;

        if (document.removeEventListener) {
            document.removeEventListener("touchend", this.touchEndBind, false);
            document.removeEventListener("touchmove", this.touchMoveBind, false);
        }

        var moveEndBlock = this.moveEndBlock.bind(this);
        if(this.touchStartXY){
            this.touhEndObserver = setTimeout(function () {
                moveEndBlock();
            }, 10);
        }
    },
    moveBlock: function(moveXY){
        var cfg = this.config;
        var returnTF = true;
        if(moveXY.left != undefined){
            var newLeft = (this.touchStartXY.sLeft + (moveXY.left));
            var minLeft = 0;
            var maxLeft = - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
            if(cfg.bounces){
                minLeft = this.touchStartXY.targetWidth * 0.4;
                maxLeft = -((this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth) * 1.2);
            }
            if(newLeft > minLeft){
                newLeft = minLeft;
                returnTF = false;
            }else if(newLeft < maxLeft){
                newLeft = maxLeft;
                returnTF = false;
            }
            this.scrollScrollID.css({left: newLeft});
            this.setScrollbarPositionForWheel("left");
        }else if(moveXY.top != undefined){
            var newTop = (this.touchStartXY.sTop + (moveXY.top));
            var minTop = 0;
            var maxTop = - (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight);
            if(cfg.bounces){
                minTop = this.touchStartXY.targetHeight * 0.4;
                maxTop = -((this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight) * 1.2);
            }
            if(newTop > minTop){
                newTop = minTop;
                returnTF = false;
            }else if(newTop < maxTop){
                newTop = maxTop;
                returnTF = false;
            }
            this.scrollScrollID.css({top: newTop});
            this.setScrollbarPositionForWheel("top");
        }
        /*trace(moveXY);*/
        return returnTF;
        //return true;
    },
    moveEndBlock: function(){
	    var cfg = this.config;
        /* 관성발동여부 체크 */
        if(!this.touchStartXY) return;
        var sTime = this.touchStartXY.sTime;
        var eTime = ((new Date()).getTime() / 1000);
        var dTime = eTime - sTime;
        //var setScrollbarPositionForWheel = this.setScrollbarPositionForWheel.bind(this);
        var tractInActive = this.tractInActive.bind(this);

        if(this.touchMode == "we"){ /* 좌우 */
            if (this.touchStartXY.scrollWidth <= this.touchStartXY.targetWidth) return;
            var eLeft = this.scrollScrollID.position().left;
            var dLeft = eLeft - this.touchStartXY.sLeft;
            var velocityLeft = Math.ceil((dLeft/dTime)/1); // 속력= 거리/시간
            var endLeft = Math.ceil(eLeft + velocityLeft); //스크롤할때 목적지
            if(endLeft > 0) endLeft = 0;
            else if(endLeft < - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth)){
                endLeft = - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
            }
            var newLeft = endLeft.abs();
            this.touchStartXY.sLeft = -newLeft;
            this.scrollScrollID.animate({left: -newLeft}, (eLeft + newLeft).abs(), "circOut", function () {
                tractInActive();
            });
            this.setScrollbarPositionForWheel("left", (eLeft + newLeft).abs(), "circOut", {left: -newLeft});

            if (cfg.yscroll){
                var eTop = this.scrollScrollID.position().top;
                var topChange = false;
                if(eTop > 0){
                    eTop = 0;
                    topChange = true;
                }else if(eTop < - (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight)){
                    eTop = (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight);
                    topChange = true;
                }
                if(topChange) this.scrollScrollID.css({top: -eTop});
            }

        }else{ /* 위아래 */
            if (this.touchStartXY.scrollHeight <= this.touchStartXY.targetHeight) return;
            var eTop = this.scrollScrollID.position().top;
            var dTop = eTop - this.touchStartXY.sTop;
            var velocityTop = Math.ceil((dTop/dTime)/1); // 속력= 거리/시간
            var endTop = Math.ceil(eTop + velocityTop); //스크롤할때 목적지		
            if(endTop > 0) endTop = 0;
            else if(endTop < - (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight)){
                endTop = - (this.touchStartXY.scrollHeight - this.touchStartXY.targetHeight);
            }

            var newTop = endTop.abs();
            this.touchStartXY.sTop = -newTop;
            this.scrollScrollID.animate({top: -newTop}, (eTop + newTop).abs(), "circOut", function () {
                tractInActive();
            });
            this.setScrollbarPositionForWheel("top", (eTop + newTop).abs(), "circOut", {top: -newTop});

            if (cfg.xscroll){
                var eLeft = this.scrollScrollID.position().left;
                var leftChange = false;
                if(eLeft > 0){
                    eLeft = 0;
                    leftChange = true;
                }else if(eLeft < - (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth)){
                    eLeft = (this.touchStartXY.scrollWidth - this.touchStartXY.targetWidth);
                    leftChange = true;
                }
                if(leftChange) this.scrollScrollID.css({left: -eLeft});
            }
        }
        this.touchStartXY = null;

    },
    /* touch event init --- e */


    /* scrollBar event */
    SBonMouseDown: function (event) {
        var config = this.config;
        this.scrollBarMove = true;
        var pos = this.getMousePosition(event);
        var SBpos = this.scrollBar.position();
        var SBh = this.scrollBar.height();
        var STh = this.scrollTrack.height();
        var Ch = this.scrollScrollID.outerHeight();

        this.Ch = Ch;
        this.STh = STh;

        this.scrollBarAttr = { x: (SBpos.left - pos.x).number(), y: (SBpos.top - pos.y).number(), h: SBh.number(), sth: STh };
        //trace("y:"+SBpos.top +" - "+ pos.y +", h:"+ SBh +", sth:"+STh+", calc y : "+(SBpos.top - pos.y).number());

        axdom(document.body).bind("mousemove.AXScroll", this.SBonMouseMoveBind);
        axdom(document.body).bind("mouseup.AXScroll", this.SBonMouseUpBind);
        axdom(document.body).bind("mouseleave.AXScroll", this.SBonMouseUpBind);
    },
    SBonMouseMove: function (event) {
        var config = this.config;
        if (this.scrollBarMove) {
            axdom(document.body).attr("onselectstart", "return false");
            axdom(document.body).addClass("AXUserSelectNone");
            var pos = this.getMousePosition(event);

            var SBy = pos.y + this.scrollBarAttr.y;
            //trace(SBy +" = "+ pos.y +"+"+ this.scrollBarAttr.y);

            if (SBy < config.scrollBarMargin) SBy = config.scrollBarMargin;
            if ((SBy + this.scrollBarAttr.h) > this.scrollBarAttr.sth) {
                SBy = this.scrollBarAttr.sth - this.scrollBarAttr.h + config.scrollBarMargin;
                //trace(SBy)
            }
            this.scrollBar.css({ top: SBy });
            this.setContentPosition();
        }
    },
    SBonMouseUp: function (event) {
        if (this.scrollBarMove) {
            var config = this.config;
            this.scrollBarMove = false;
            axdom(document.body).removeAttr("onselectstart");
            axdom(document.body).removeClass("AXUserSelectNone");
        }
        axdom(document.body).unbind("mousemove.AXScroll");
        axdom(document.body).unbind("mouseup.AXScroll");
        axdom(document.body).unbind("mouseleave.AXScroll");
    },

    SBonMouseDownX: function (event) {
        var config = this.config;
        this.scrollBarMove = true;
        var pos = this.getMousePosition(event);
        var SBpos = this.xscrollBar.position();
        var SBw = this.xscrollBar.width();
        var STw = this.xscrollTrack.width();
        var Cw = this.scrollScrollID.outerWidth();

        this.Cw = Cw;
        this.STw = STw;

        this.scrollBarAttr = { x: (SBpos.left - pos.x).number(), w: SBw.number(), stw: STw };

        axdom(document.body).bind("mousemove.AXScroll", this.SBonMouseMoveXBind);
        axdom(document.body).bind("mouseup.AXScroll", this.SBonMouseUpXBind);
        axdom(document.body).bind("mouseleave.AXScroll", this.SBonMouseUpXBind);
    },
    SBonMouseMoveX: function (event) {
        var config = this.config;
        if (this.scrollBarMove) {

            axdom(document.body).attr("onselectstart", "return false");
            axdom(document.body).addClass("AXUserSelectNone");
            var pos = this.getMousePosition(event);

            var SBx = pos.x + this.scrollBarAttr.x;
            //trace(SBy +" = "+ pos.y +"+"+ this.scrollBarAttr.y);

            if (SBx < config.scrollBarMargin) SBx = config.scrollBarMargin;
            if ((SBx + this.scrollBarAttr.w) > this.scrollBarAttr.stw) {
                SBx = this.scrollBarAttr.stw - this.scrollBarAttr.w + config.scrollBarMargin;
            }

            this.xscrollBar.css({ left: SBx });
            this.setContentPosition("xscroll");
        }
    },
    SBonMouseUpX: function (event) {
        if (this.scrollBarMove) {
            var config = this.config;
            this.scrollBarMove = false;
            axdom(document.body).removeAttr("onselectstart");
            axdom(document.body).removeClass("AXUserSelectNone");
        }
        axdom(document.body).unbind("mousemove.AXScroll");
        axdom(document.body).unbind("mouseup.AXScroll");
        axdom(document.body).unbind("mouseleave.AXScroll");
    },

    SBonWheel: function (e) {
        //content top handle
        var config = this.config;

        var event = (window.event || e);
        var delta = event.detail ? event.detail * (-10) : event.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta

        var Sy = this.scrollScrollID.position().top;
        var Sh = this.scrollScrollID.outerHeight();
        var TGh = this.scrollTargetID.height();

        //trace(Sh+" + "+Sy+" < "+TGh );
        if (Sh < TGh) return; //스크롤 할 대상이 없음 2013-02-08 오후 5:48:07 tom@axmods.com

        var eventCancle = false;
        Sy += delta;
        if (Sy > 0) {
            Sy = 0;
            eventCancle = true;
        }

        //trace(Sh+" + "+Sy+" < "+TGh );

        if ((Sh + Sy) < TGh) {
            Sy = (TGh - Sh);
            eventCancle = true;
        }
        this.scrollScrollID.css({ top: Sy });

        //this.setContentPosition();
        this.setScrollbarPositionForWheel("top");

        if (!eventCancle) {
            if (event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
            event.cancelBubble = true;
            return false;
        }

    },
    SBonWheelEnd: function () {
        if (this.scrollBarMove) return;
        var config = this.config;

        if (config.yscroll) {
            this.scrollBar.removeClass("scrollBar_hover");
            this.scrollTrack.removeClass("scrollTrack_hover");
        }

        if (config.xscroll) {
            this.xscrollBar.removeClass("xscrollBar_hover");
            this.xscrollTrack.removeClass("xscrollTrack_hover");
        }

    },
    cancelEvent: function (event) {
        event.stopPropagation(); // disable  event
        return false;
    },
    setContentPosition: function (xscroll) {
        var config = this.config;

        if (xscroll == "xscroll") {

	        if (!this.contentScrollXAttr) {
		        this.contentScrollXAttr = {
			        bodyWidth: this.scrollTargetID.width(),
			        scrollWidth: this.scrollScrollID.width(),
			        scrollTrackXWidth: this.xscrollTrack.width(),
			        scrollXHandleWidth: this.xscrollBar.width()
		        };
	        }else{
		        // scrollContent height update
		        this.contentScrollXAttr.scrollWidth = this.scrollScrollID.width();
		        this.contentScrollXAttr.scrollTrackXWidth = this.xscrollTrack.width();
		        this.contentScrollXAttr.scrollXHandleWidth = this.xscrollBar.width();
	        }

            var SBx = this.xscrollBar.position().left - config.scrollBarMargin;
	        var L = (this.contentScrollXAttr.scrollWidth * (SBx) / this.contentScrollXAttr.scrollTrackXWidth).round(0);
            this.scrollScrollID.css({ left: -L });

        } else {

	        if (!this.contentScrollYAttr) {
		        this.contentScrollYAttr = {
			        bodyHeight: this.scrollTargetID.height(),
			        scrollHeight: this.scrollScrollID.height(),
			        scrollTrackYHeight: this.scrollTrack.height(),
			        scrollYHandleHeight: this.scrollBar.height()
		        };
	        }else{
		        // scrollContent height update
		        this.contentScrollYAttr.scrollHeight = this.scrollScrollID.height();
		        this.contentScrollYAttr.scrollTrackYHeight = this.scrollTrack.height();
		        this.contentScrollYAttr.scrollYHandleHeight = this.scrollBar.height();
	        }

            var SBy = this.scrollBar.position().top - config.scrollBarMargin;
	        var T = (this.contentScrollYAttr.scrollHeight - this.contentScrollYAttr.bodyHeight) * ( (SBy) / (this.contentScrollYAttr.scrollTrackYHeight - this.contentScrollYAttr.scrollYHandleHeight) ).number();
            this.scrollScrollID.css({ top: -T });
        }

    },

    setScrollbarPositionForWheel: function (direction, duration, easing, position) {
        //scrollbar top position handle for wheel
        var config = this.config;

        if(direction == "left"){

	        if (!this.contentScrollXAttr) {
		        this.contentScrollXAttr = {
			        bodyWidth: this.scrollTargetID.width(),
			        scrollWidth: this.scrollScrollID.width(),
			        scrollTrackXWidth: this.xscrollTrack.width(),
			        scrollXHandleWidth: this.scrollBar.outerWidth()
		        };
	        }else{
		        // scrollContent height update
		        this.contentScrollXAttr.scrollWidth = this.scrollScrollID.width();
		        this.contentScrollXAttr.scrollTrackXWidth = this.xscrollTrack.width();
		        this.contentScrollXAttr.scrollXHandleWidth = this.xscrollBar.outerWidth();
	        }

	        var Sy = (position) ? position.left : this.scrollScrollID.position().left;
	        var L = (this.contentScrollXAttr.scrollTrackXWidth - this.contentScrollXAttr.scrollXHandleWidth) * ((Sy) / (this.contentScrollXAttr.scrollWidth - this.contentScrollXAttr.bodyWidth));
	        L -= config.scrollBarMargin;
	        if(easing){
                this.xscrollBar.animate({
                    left: -L
                    //,width: Math.ceil(this.scrollTargetID.outerWidth() * (this.scrollTargetID.outerWidth() - 4) / (this.scrollScrollID.outerWidth() + addY))
                }, duration, easing, function () {});
            }else{
                this.xscrollBar.css({
                    left: -L
                    //,width: Math.ceil(this.scrollTargetID.outerWidth() * (this.scrollTargetID.outerWidth() - 4) / (this.scrollScrollID.outerWidth() + addY))
                });
            }
        }else{

            if (!config.yscroll) return false;
            //wheel control event is not jquery event !

	        if (!this.contentScrollYAttr) {
		        this.contentScrollYAttr = {
			        bodyHeight: this.scrollTargetID.height(),
			        scrollHeight: this.scrollScrollID.height(),
			        scrollTrackYHeight: this.scrollTrack.height(),
			        scrollYHandleHeight: this.scrollBar.outerHeight()
		        };
	        }else{
		        // scrollContent height update
		        this.contentScrollYAttr.scrollHeight = this.scrollScrollID.height();
		        this.contentScrollYAttr.scrollTrackYHeight = this.scrollTrack.height();
		        this.contentScrollYAttr.scrollYHandleHeight = this.scrollBar.outerHeight();
	        }

	        var Sy = (position) ? position.top : this.scrollScrollID.position().top;
	        var T = (this.contentScrollYAttr.scrollTrackYHeight - this.contentScrollYAttr.scrollYHandleHeight) * ((Sy) / (this.contentScrollYAttr.scrollHeight - this.contentScrollYAttr.bodyHeight));
			T -= config.scrollBarMargin;
            if(easing){
                //trace({ top: SBy }, duration, easing);

                this.scrollBar.animate({
                    top: -T
                    //,height: Math.ceil(this.scrollTargetID.outerHeight() * (this.scrollTargetID.outerHeight() - 4) / (this.scrollScrollID.outerHeight() + addY))
                }, duration, easing, function () {});
            }else{
                this.scrollBar.css({
                    top: -T
                    //,height: Math.ceil(this.scrollTargetID.outerHeight() * (this.scrollTargetID.outerHeight() - 4) / (this.scrollScrollID.outerHeight() + addY))
                });
            }

        }
    },


    setSBPosition: function () {
        var config = this.config;
        var Ctop = this.scrollScrollID.position().top;
        var CTheight = this.scrollTargetID.innerHeight();
        var STh = this.scrollTrack.height();
        var Ch = this.scrollScrollID.outerHeight();

        var SBh = this.scrollBar.height();

        //trace({Ctop:Ctop, CTheight:CTheight, Ch:Ch, STh:STh, SBh:SBh, x:(STh*Ctop)/Ch});
        var SBtop = -(STh * Ctop) / Ch;
	    if (SBtop < config.scrollBarMargin) SBtop = config.scrollBarMargin;
	    if ((SBtop + SBh) > STh) {
		    SBtop = STh - SBh + config.scrollBarMargin;
	    }
        this.scrollBar.css({ top: SBtop });

    },
    focusElement: function (id) {
        var config = this.config;
        if (AXgetId(id)) {
            //trace(axdom("#"+id).position());
            var pos = axdom("#" + id).position();

            var myNewTop = pos.top;
            var CTheight = this.scrollTargetID.innerHeight();
            var Cheight = this.scrollScrollID.outerHeight();
            if ((Cheight - myNewTop) < CTheight) {
                myNewTop = Cheight - CTheight;
            }
            if (myNewTop < 0) myNewTop = 0;
            this.scrollScrollID.css({ top: -myNewTop });
            this.setSBPosition();
        }
    },
    scrollTop: function (top) {
        var myNewTop = top;
        var CTheight = this.scrollTargetID.innerHeight();
        var Cheight = this.scrollScrollID.outerHeight();
        if ((Cheight - myNewTop) < CTheight) {
            myNewTop = Cheight - CTheight;
        }
        if (myNewTop < 0) myNewTop = 0;
        this.scrollScrollID.css({ top: -myNewTop });
        this.setSBPosition();
    },
    moveTo: function (x, y) {

        var cfg = this.config;
        var css = {};
        if (!AXUtil.isEmpty(x)) {
            css.left = -x;
        }
        if (!AXUtil.isEmpty(y)) {
            css.top = -y;
        }

        this.scrollScrollID.css(css);
        if (cfg.yscroll && !AXUtil.isEmpty(css.top)) {
            this.scrollBar.css({ top: css.top });
        }
        if (cfg.xscroll && !AXUtil.isEmpty(css.left)) {
            this.xscrollBar.css({ left: css.left });
        }

    },
    unbind: function () {
        var config = this.config;
        this.scroll = false;

        this.scrollTrack.remove();
        this.scrollBar.remove();

        this.scrollTargetID.unbind("mouseover", this.tractActiveBind);
        this.scrollTargetID.unbind("mouseout", this.tractInActiveBind);

        //axdom("#"+config.targetID+"_AX_scrollBar").unbind("dragstart", this.cancelEventBind);
        //axdom("#"+config.targetID+"_AX_scrollBar").unbind("mousedown", this.SBonMouseDownBind);
        axdom(document.body).unbind("mousemove.AXScroll", this.SBonMouseMoveBind);
        axdom(document.body).unbind("mouseup.AXScroll", this.SBonMouseUpBind);

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
        if (document.attachEvent) { //if IE (and Opera depending on user setting)
            if (AXgetId(config.targetID)) AXgetId(config.targetID).detachEvent("on" + mousewheelevt, this.SBonWheelBind);
        } else if (document.addEventListener) { //WC3 browsers
            if (AXgetId(config.targetID)) AXgetId(config.targetID).removeEventListener(mousewheelevt, this.SBonWheelBind, false);
        }

        if (document.addEventListener) {
            if (AXgetId(config.targetID)) AXgetId(config.targetID).removeEventListener("touchstart", this.SBtouchstartBind, false)
        }

    }
});
/* ---------------------------------------------- AXScroll -- */

/* -- AXCalendar ---------------------------------------------- */
var AXCalendar = Class.create(AXJ, {
    version: "AXCalendar v1.1",
    author: "tom@axisj.com",
    logs: [
        "2012-12-05 오후 11:54:27",
        "2014-03-31 오후 4:53:02 - tom : timePage PM 이면 12시 선택 못하도록 기능 변경"
    ],
    initialize: function (AXJ_super) {
        AXJ_super();
        this.config.CT_className = "AXCalendar";
        this.Observer = null;
        this.config.weeks = [
            { name: "SUN" },
            { name: "MON" },
            { name: "TUE" },
            { name: "WED" },
            { name: "THU" },
            { name: "FRI" },
            { name: "SAT" }
        ];
        this.config.printFormat = "dd";
        this.config.titleFormat = "yyyy/mm/dd";
        this.config.valueFormat = "yyyy-mm-dd";
    },
    init: function () {

    },
    getBasicDate: function () {
        var cfg = this.config;
        if (cfg.basicDate != undefined) {
            return cfg.basicDate.date();
        } else {
            return new Date();
        }
    },
    getCalendarStartDate: function (date) {
        var cfg = this.config;
        var calendarStartDate, monthStartDate, basicDate;
        basicDate = (date) ? date.date() : this.getBasicDate();
        monthStartDate = new Date(basicDate.getFullYear(), basicDate.getMonth(), 1, 12);
        var calendarStartDateDay = monthStartDate.getDay();
        if (calendarStartDateDay == 0) calendarStartDateDay = 7;
        calendarStartDate = monthStartDate.add(-calendarStartDateDay);
        return { calendarStartDate: calendarStartDate, monthStartDate: monthStartDate };
    },
    printDayPage: function (date) {
        var cfg = this.config;

        if (Object.isUndefined(cfg.targetID)) {
            trace("need targetID - setConfig({targetID:''})");
            return;
        }

        var calendarDate = this.getCalendarStartDate(date);
        var calendarStartDate = calendarDate.calendarStartDate;
        var monthStartDate = calendarDate.monthStartDate;
        var basicDate = this.getBasicDate();
        var setDate = (date) ? date.date() : new Date();
        //
        var po = [];
        po.push("<div id=\"" + cfg.targetID + "_AX_box\" class=\"" + cfg.CT_className + "\">");
        po.push("<table cellspacing=\"0\" cellpadding=\"0\" class=\"calendarPage\">");
        po.push("<thead>");
        po.push("<tr>");
        axf.each(cfg.weeks, function (wi, ww) {
            po.push("<td class=\"head_" + wi + " dayofweek_" + wi + "\">" + ww.name + "</td>");
        });
        po.push("</tr>");
        po.push("</thead>");
        po.push("<tbody>");
        var roopDate = calendarStartDate;
        var i = 0; while (i < 6) {
            po.push("<tr>");
            var k = 0; while (k < 7) {
                var dayValue = roopDate.print(this.config.printFormat);
                var addClass = [];
                var tdClass = [];
                if (roopDate.getMonth() != monthStartDate.getMonth()) addClass.push("notThisMonth");
                if (setDate.diff(roopDate, "D") == 0) tdClass.push("setDate");
                po.push("<td class=\"bodyCol_" + k + " bodyRow_" + i + " " + tdClass.join(" ") + "\"><a " + cfg.href + " class=\"calendarDate " + addClass.join(" ") + "\" id=\"" + cfg.targetID + "_AX_" + roopDate.print(this.config.valueFormat) + "_AX_date\" title=\"" + roopDate.print(this.config.titleFormat) + "\">" + dayValue.number() + "</a></td>");
                k++;
                roopDate = roopDate.add(1);
            }
            po.push("</tr>");
            i++;
        }
        po.push("</tbody>");
        po.push("</table>");
        po.push("</div>");
        axdom("#" + cfg.targetID).html(po.join(''));
    },
    dayPageSetDay: function (date) {
        var cfg = this.config;
        axdom("#" + cfg.targetID).find(".calendarDate").removeClass("selected");
        axdom("#" + cfg.targetID + "_AX_" + date.print(this.config.valueFormat) + "_AX_date").addClass("selected");
    },
    printMonthPage: function (date) {
        var cfg = this.config;
        if (Object.isUndefined(cfg.targetID)) {
            trace("need targetID - setConfig({targetID:''})");
            return;
        }
        var setDate = (date) ? date.date() : new Date();
        //alert(setDate);
        var po = [];
        po.push("<div id=\"" + cfg.targetID + "_AX_box\" class=\"" + cfg.CT_className + "\">");
        po.push("<table cellspacing=\"0\" cellpadding=\"0\" class=\"calendarPageMonth\">");
        po.push("<tbody>");

        var m = 1;
        var i = 0; while (i < 4) {
            po.push("<tr>");
            var k = 0; while (k < 3) {
                var tdClass = [];
                if (m == (setDate.getMonth() + 1)) tdClass.push("setDate");
                po.push("<td class=\"bodyCol_" + k + " bodyRow_" + i + " " + tdClass.join(" ") + "\"><a " + cfg.href + " class=\"calendarMonth\" id=\"" + cfg.targetID + "_AX_" + m + "_AX_month\" title=\"\">" + m + "월</a></td>");
                k++;
                m++;
            }
            po.push("</tr>");
            i++;
        }
        po.push("</tbody>");
        po.push("</table>");
        po.push("</div>");
        axdom("#" + cfg.targetID).html(po.join(''));
    },
    monthPageSetMonth: function (date) {
        var cfg = this.config;
        axdom("#" + cfg.targetID).find(".calendarMonth").removeClass("selected");
        axdom("#" + cfg.targetID + "_AX_" + (date.getMonth() + 1) + "_AX_month").addClass("selected");
    },
    printYearPage: function (year) {
        var cfg = this.config;
        if (Object.isUndefined(cfg.targetID)) {
            trace("need targetID - setConfig({targetID:''})");
            return;
        }
        var po = [];
        po.push("<div id=\"" + cfg.targetID + "_AX_box\" class=\"" + cfg.CT_className + "\">");
        po.push("<table cellspacing=\"0\" cellpadding=\"0\" class=\"calendarPageMonth\">");
        po.push("<tbody>");

        var m = year - 4;
        var i = 0; while (i < 4) {
            po.push("<tr>");
            var k = 0; while (k < 3) {
                var tdClass = [];
                if (m == year) tdClass.push("setDate");
                po.push("<td class=\"bodyCol_" + k + " bodyRow_" + i + " " + tdClass.join(" ") + "\"><a " + cfg.href + " class=\"calendarMonth\" id=\"" + cfg.targetID + "_AX_" + m + "_AX_year\" title=\"\">" + m + "년</a></td>");
                k++;
                m++;
            }
            po.push("</tr>");
            i++;
        }
        po.push("</tbody>");
        po.push("</table>");
        po.push("</div>");
        axdom("#" + cfg.targetID).html(po.join(''));
    },
    yearPageSetYear: function (date) {
        var cfg = this.config;
        axdom("#" + cfg.targetID).find(".calendarMonth").removeClass("selected");
        axdom("#" + cfg.targetID + "_AX_" + date.print("yyyy") + "_AX_year").addClass("selected");
    },
    printTimePage: function (displayTime) {
        var cfg = this.config;
        if (Object.isUndefined(cfg.targetID)) {
            trace("need targetID - setConfig({targetID:''})");
            return;
        }

        if (displayTime) {
            var now = displayTime.split(":");
            var hh = now[0].setDigit(2);
            var mm = now[1].left(2).setDigit(2);
            var apm = now[1].right(2);
            if (hh == "00" && mm == "00") {
                hh = "12";
                apm = "PM";
            }
            if (apm == "00") apm = "AM";
        } else {
            var now = new Date();
            var hh = now.getHours();
            var mm = now.getMinutes();
            var apm = "AM";
            if (hh == 0 && mm == 0) {
                hh = 24;
            }
            if (hh > 12) {
                apm = "PM";
                hh -= 12;
            }
            hh = hh.setDigit(2);
            mm = mm.setDigit(2);
        }

        var po = [];
        po.push("<div id=\"" + cfg.targetID + "_AX_box\" class=\"" + cfg.CT_className + "\" style=\"padding:0px;\">");
        po.push("<div class='timeBox'>");
        po.push("<div class='hourTitle'>Hour</div>");
        po.push("<div class='hourSlider'><input type='text' value='" + hh + "' id='" + cfg.targetID + "_AX_hour' class='AXInput' /></div>");
        po.push("<div class='minuteTitle'>Minute</div>");
        po.push("<div class='minuteSlider'><input type='text' value='" + mm + "' id='" + cfg.targetID + "_AX_minute' class='AXInput' /></div>");
        po.push("<div class='timeDisplay'>" + hh + ":" + mm + " " + apm + "</div>");
        po.push("<div class='AMPM'><input type='text' id='" + cfg.targetID + "_AX_AMPM' value='" + apm + "' style='width:50px;height:21px;border:0px none;' /></div>");
        po.push("</div>");
        po.push("</div>");
        axdom("#" + cfg.targetID).html(po.join(''));

        var timePageChange = this.timePageChange.bind(this);
        axdom("#" + cfg.targetID + "_AX_hour").unbindInput();
        axdom("#" + cfg.targetID + "_AX_minute").unbindInput();
        axdom("#" + cfg.targetID + "_AX_AMPM").unbindInput();
        axdom("#" + cfg.targetID + "_AX_hour").bindSlider({
            min: 1, max: 12, onChange: function (objID, objVal) {
                timePageChange(objID, objVal);
            }
        });
        axdom("#" + cfg.targetID + "_AX_minute").bindSlider({
            min: 0, max: 59, onChange: function (objID, objVal) {
                timePageChange(objID, objVal);
            }
        });
        axdom("#" + cfg.targetID + "_AX_AMPM").bindSwitch({
            off: "AM", on: "PM", onChange: function (objID, objVal) {
                timePageChange(objID, objVal);
            }
        });
    },
    timePageChange: function (objID, objVal) {
        var cfg = this.config;

        if(axdom("#" + cfg.targetID + "_AX_AMPM").val() == "PM"){
            if(axdom("#" + cfg.targetID + "_AX_hour").val().number() > 11){
                axdom("#" + cfg.targetID + "_AX_hour").val(11);
                axdom("#" + cfg.targetID + "_AX_hour").setValueInput(11);
            }
        }

        var mytime = axdom("#" + cfg.targetID + "_AX_hour").val().number().setDigit(2) +
            ":" + axdom("#" + cfg.targetID + "_AX_minute").val().number().setDigit(2) +
            " " + axdom("#" + cfg.targetID + "_AX_AMPM").val();
        axdom("#" + cfg.targetID + "_AX_box").find(".timeDisplay").html(mytime);
        if (cfg.onChange) {
            var hh = axdom("#" + cfg.targetID + "_AX_hour").val().number();
            var mi = axdom("#" + cfg.targetID + "_AX_minute").val().number();
            var apm = axdom("#" + cfg.targetID + "_AX_AMPM").val();
            if (apm == "PM") hh += 12;
            cfg.onChange(hh.setDigit(2) + ":" + mi.setDigit(2));
        }
    },
    getTime: function () {
        var cfg = this.config;
        var hh = axdom("#" + cfg.targetID + "_AX_hour").val().number();
        var mi = axdom("#" + cfg.targetID + "_AX_minute").val().number();
        var apm = axdom("#" + cfg.targetID + "_AX_AMPM").val();
        if (apm == "PM") hh += 12;
        return hh.setDigit(2) + ":" + mi.setDigit(2);
    }
});
/* ---------------------------------------------- AXCalendar -- */

/* -- AXMultiSelect ---------------------------------------------- */
var AXMultiSelect = Class.create(AXJ, {
    version: "AXMultiSelect v1.8",
    author: "tom@axisj.com",
    logs: [
        "2013-01-31 오후 5:01:12",
        "2013-11-12 오전 9:19:09 - tom : 버그픽스",
        "2013-11-12 오전 11:59:38 - tom : body relative 버그 픽스, 스크롤바 마우스 선택 문제 해결",
        "2013-11-13 오후 3:01:15 - tom : 모바일 터치 기능 지원"
    ],

    initialize: function (AXJ_super) {
        AXJ_super();
        this.selects = [];
        this.config.selectClassName = "readySelect";
        this.config.beselectClassName = "beSelected";
        this.config.selectingClassName = "AX_selecting";
        this.config.unselectingClassName = "AX_unselecting";
        this.moveSens = 0;
        this.config.moveSens = 5;
        this.touchMode;
        this.config.useHelper = true;
    },
    init: function () {

        var mouseClick = this.onmouseClick.bind(this);
        this._selectStage = axdom("#" + this.config.selectStage);
        this._selectStage.css({ "position": "relative" });

        /*
         if(AXUtil.browser.mobile){
         this._selectStage.css({"overflow":"visible", "min-height":this._selectStage.innerHeight(), "height":"auto"});	
         }
         */

        this._selectStage.bind("mousedown", this.mousedown.bind(this));

        this._selectStage.bind("click", function (event) {
            mouseClick(this, event);
        });

        this.helper = axdom("<div class='AXMultiselectorHelper'></div>");
        this.collect();

        axdom(window).bind("resize.AXMultiSelect", this.collect.bind(this));
        axdom(window).bind("keydown.AXMultiSelect", this.onKeydown.bind(this));
        this._selectStage.bind("scroll", this.onScrollStage.bind(this));

        this._selectStage.bind("touchstart", this.touchstart.bind(this));
    },
    onKeydown: function (event) {
        if (event.keyCode == AXUtil.Event.KEY_ESC) {
            this.clearSelects();
        }
    },
    onScrollStage: function (event) {
        var cfg = this.config;
        if (!AXUtil.browser.mobile) {
            if (this.helperAppened || this.helperAppenedReady) {
                this.moveSens = 0;
                axdom(document.body).unbind("mousemove.AXMultiSelect");
                axdom(document.body).unbind("mouseup.AXMultiSelect");
                axdom(document.body).unbind("mouseleave.AXMultiSelect");
                axdom(document.body).removeAttr("onselectstart");
                axdom(document.body).removeClass("AXUserSelectNone");
                this.helperAppenedReady = false;
                this.helperAppened = false;
                this.helper.remove();
            }
        }

    },
    /* ------------------------------------------------------------------------------------------------------------------ */
    /* observe method ~~~~~~ */
    onmouseClick: function (element, event) {
        var cfg = this.config;
        var eid = event.target.id.split(/_AX_/g);
        var eventTarget = event.target;
        var myTarget = this.getEventTarget({
            evt: eventTarget, evtIDs: eid,
            until: function (evt, evtIDs) { return (AXgetId(evt.parentNode) == AXgetId(cfg.selectStage)) ? true : false; },
            find: function (evt, evtIDs) { return (axdom(evt).hasClass(cfg.selectClassName)) ? true : false; }
        });
        //trace("click");
        if (myTarget) {
            var selectElement = myTarget;
            if (selectElement) {
                if (event.shiftKey) {
                    this.shiftSelects(selectElement);
                } else if (event.metaKey || event.ctrlKey) {
                    this.toggleSelects(selectElement);
                } else {
                    this.clickSelects(selectElement);
                }
            }
        } else {

            if (event.target.id == cfg.selectStage && AXUtil.browser.name != "ie") this.clearSelects();
            return;
        }
    },
    /* ------------------------------------------------------------------------------------------------------------------ */
    /* class method ~~~~~~ */
    collect: function () {
        var cfg = this.config;
        this._selectTargets = axdom("#" + cfg.selectStage + " ." + cfg.selectClassName);
        this.selectTargets = this._selectTargets.get();
        var scrollLeft = this._selectStage.scrollLeft().number();
        var scrollTop = this._selectStage.scrollTop().number();
        this._selectTargets.each(function () {
            var jQuerythis = axdom(this), pos = jQuerythis.position();
            axdom.data(this, "selectableItem", {
                element: this,
                jQueryelement: jQuerythis,
                left: pos.left + scrollLeft,
                top: pos.top + scrollTop,
                right: pos.left + scrollLeft + jQuerythis.outerWidth(),
                bottom: pos.top + scrollTop + jQuerythis.outerHeight(),
                selected: jQuerythis.hasClass(cfg.beselectClassName),
                selecting: jQuerythis.hasClass(cfg.selectingClassName)
            });
        });
    },
    clearSelects: function () {
        var cfg = this.config;
        this._selectTargets.each(function () {
            var selectTarget = axdom.data(this, "selectableItem");
            if (selectTarget) {
                if (selectTarget.selecting) {
                    selectTarget.jQueryelement.removeClass(cfg.selectingClassName);
                    selectTarget.selecting = false;
                }
                if (selectTarget.selected) {
                    selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
                    selectTarget.selected = false;
                }
            }
        });
    },
    pushSelects: function (Obj) {
        var hasSelect = this.selects.has(function () {
            return this.item == Obj;
        });
        if (!hasSelect) this.selects.push(Obj);
    },
    clickSelects: function (Obj) {
        var cfg = this.config;

        this.clearSelects();

        var selectTarget = axdom.data(Obj, "selectableItem");
        selectTarget.jQueryelement.addClass(cfg.beselectClassName);
        selectTarget.selected = true;
    },
    toggleSelects: function (Obj) {
        var cfg = this.config;

        var selectTarget = axdom.data(Obj, "selectableItem");
        if (selectTarget.selected) {
            selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
            selectTarget.selected = false;
        } else {
            selectTarget.jQueryelement.addClass(cfg.beselectClassName);
            selectTarget.selected = true;
        }
    },
    shiftSelects: function (Obj) {
        var cfg = this.config;

        var selectedLength = 0;
        var li, si;
        this._selectTargets.each(function (stIndex, ST) {
            var selectTarget = axdom.data(this, "selectableItem");
            if (selectTarget) {
                if (selectTarget.selected) {
                    selectedLength++;
                    li = stIndex;
                }
            }
            if (this === Obj) si = stIndex;
        });

        if (selectedLength == 0) {
            this.clickSelects(Obj);
        } else {
            //마지막 selects 개체를 찾는다.
            if (si == li) return;
            this.clearSelects();
            var temp;
            if (si > li) {
                temp = si;
                si = li;
                li = temp;
            }
            this._selectTargets.each(function (stIndex, ST) {
                var selectTarget = axdom.data(this, "selectableItem");
                if (selectTarget) {
                    if (si <= stIndex && li >= stIndex) {
                        selectTarget.jQueryelement.addClass(cfg.beselectClassName);
                        selectTarget.selected = true;
                    }
                }
            });
        }
    },

    /* mouser helper */
    mousedown: function (event) {
        var cfg = this.config;

        axdom(document.body).bind("mousemove.AXMultiSelect", this.mousemove.bind(this));
        axdom(document.body).bind("mouseup.AXMultiSelect", this.mouseup.bind(this));
        axdom(document.body).bind("mouseleave.AXMultiSelect", this.mouseup.bind(this));

        axdom(document.body).attr("onselectstart", "return false");
        axdom(document.body).addClass("AXUserSelectNone");

        this.helperAppenedReady = true;
    },
    mousemove: function (event) {
        var cfg = this.config;
        if (!event.pageX) return;

        /*드래그 감도 적용 */
        if (this.config.moveSens > this.moveSens) this.moveSens++;
        if (this.moveSens == this.config.moveSens) this.selectorHelperMove(event);
    },
    mouseup: function (event) {
        var cfg = this.config;

        this.helperAppenedReady = false;
        this.moveSens = 0;

        axdom(document.body).unbind("mousemove.AXMultiSelect");
        axdom(document.body).unbind("mouseup.AXMultiSelect");
        axdom(document.body).unbind("mouseleave.AXMultiSelect");

        axdom(document.body).removeAttr("onselectstart");
        axdom(document.body).removeClass("AXUserSelectNone");

        if (this.helperAppened) {
            this.helperAppened = false;
            this.helper.remove();

            /* selected change */
            this._selectTargets.each(function () {
                var selectTarget = axdom.data(this, "selectableItem");
                if (selectTarget) {
                    if (selectTarget.selecting) {
                        selectTarget.jQueryelement.removeClass(cfg.selectingClassName);
                        selectTarget.selecting = false;
                        selectTarget.jQueryelement.addClass(cfg.beselectClassName);
                        selectTarget.selected = true;
                    } else if (selectTarget.selected) {

                    }
                }
            });
        }

    },
    selectorHelperMove: function (event) {
        var cfg = this.config;

        if (!cfg.useHelper) {
            return;
        }

        if (this.helperAppened) {

            var _helperPos = this.helperPos;
            var tmp,
                x1 = this.helperPos.x,
                y1 = this.helperPos.y,
                x2 = event.pageX - _helperPos.bodyLeft,
                y2 = event.pageY - _helperPos.bodyTop;
            if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
            if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }
            this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

            this._selectTargets.each(function () {

                var selectTarget = axdom.data(this, "selectableItem"), hit = false;
                /*trace({sl:selectTarget.left, sr:selectTarget.right, st:selectTarget.top, sb:selectTarget.bottom, x1:x1, x2:x2, y1:y1, y2:y2}); */
                if (!selectTarget) return;

                var stL = selectTarget.left.number(), stR = selectTarget.right.number(), stT = selectTarget.top.number(), stB = selectTarget.bottom.number();
                stL = stL + _helperPos.stageX - _helperPos.scrollLeft - _helperPos.bodyLeft;
                stR = stR + _helperPos.stageX - _helperPos.scrollLeft - _helperPos.bodyLeft;
                stT = stT + _helperPos.stageY - _helperPos.scrollTop - _helperPos.bodyTop;
                stB = stB + _helperPos.stageY - _helperPos.scrollTop - _helperPos.bodyTop;

                hit = (!(stL > x2 || stR < x1 || stT > y2 || stB < y1)); /* touch */
                /* hit = (selectTarget.left > x1 && selectTarget.right < x2 && selectTarget.top > y1 && selectTarget.bottom < y2); fit */
                if (hit) {
                    /* SELECT */
                    if (selectTarget.selected) {
                        selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
                        selectTarget.selected = false;
                    }
                    if (!selectTarget.selecting) {
                        selectTarget.jQueryelement.addClass(cfg.selectingClassName);
                        selectTarget.selecting = true;
                    }
                } else {
                    /* UNSELECT */
                    if (selectTarget.selecting) {
                        selectTarget.jQueryelement.removeClass(cfg.selectingClassName);
                        selectTarget.selecting = false;
                    }
                    if (selectTarget.selected) {
                        if (!event.metaKey && !event.shiftKey && !event.ctrlKey) {
                            selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
                            selectTarget.selected = false;
                        }
                    }
                }
            });

        } else {
            this.helperAppened = true;
            axdom(document.body).append(this.helper);

            var css = { left: (event.pageX - axdom(document.body).offset().left), top: (event.pageY - axdom(document.body).offset().top), width: 0, height: 0 };
            this.helper.css(css);
            var stagePos = this._selectStage.offset();
            this.helperPos = {
                stageX: stagePos.left.number(),
                stageY: stagePos.top.number(),
                x: css.left.number(),
                y: css.top.number(),
                scrollLeft: this._selectStage.scrollLeft().number(),
                scrollTop: this._selectStage.scrollTop().number(),
                bodyLeft: axdom(document.body).offset().left,
                bodyTop: axdom(document.body).offset().top
            };
        }
    },

    /* touch helper */
    touchstart: function (event) {
        var cfg = this.config;

        var touchEnd = this.touchEnd.bind(this);
        this.touchEndBind = function () {
            touchEnd(event);
        };

        var touchMove = this.touchMove.bind(this);
        this.touchMoveBind = function () {
            touchMove(event);
        };

        if (document.addEventListener) {
            document.addEventListener("touchend", this.touchEndBind, false);
            document.addEventListener("touchmove", this.touchMoveBind, false);
        }

        this.helperAppenedReady = true;
    },
    touchMove: function (event) {
        var cfg = this.config;
        var event = window.event || e;
        var touch = event.touches[0];
        if (!touch.pageX) return;
        var offset = this._selectStage.offset();
        var right = offset.left + this._selectStage.width();
        var bottom = offset.top + this._selectStage.height();

        if (this.moveSens == 0) {
            this.touchStartXY = { x: touch.pageX, y: touch.pageY, scrollTop: this._selectStage.scrollTop() };
        }

        /*드래그 감도 적용 */
        if (this.config.moveSens > this.moveSens) this.moveSens++;
        if (this.moveSens == this.config.moveSens) {
            if (this.touchMode == "drag") {
                if (bottom < touch.pageY) this._selectStage.scrollTop(this.touchStartXY.scrollTop - (bottom - touch.pageY));
                else if (offset.top > touch.pageY) this._selectStage.scrollTop(this.touchStartXY.scrollTop - (offset.top - touch.pageY));
                if (right < touch.pageX) this._selectStage.scrollLeft(this.touchStartXY.scrollLeft - (right - touch.pageX));
                else if (offset.left > touch.pageX) this._selectStage.scrollLeft(this.touchStartXY.scrollLeft - (offset.left - touch.pageX));
                this.selectorHelperMoveByTouch(event);
            } else if (this.touchMode == "scrollTop") {
                this._selectStage.scrollTop(this.touchStartXY.scrollTop + (this.touchStartXY.y - touch.pageY));
            } else if (this.touchMode == "scrollLeft") {
                this._selectStage.scrollLeft(this.touchStartXY.scrollLeft + (this.touchStartXY.x - touch.pageX));
            } else {
                if (((this.touchStartXY.x - touch.pageX).abs() - (this.touchStartXY.y - touch.pageY).abs()).abs() < 5) {
                    this.touchMode = "drag"
                    this.selectorHelperMoveByTouch(event);
                } else if ((this.touchStartXY.x - touch.pageX).abs() < (this.touchStartXY.y - touch.pageY).abs()) {
                    this.touchMode = "scrollTop";
                    this._selectStage.scrollTop(this.touchStartXY.scrollTop + (this.touchStartXY.y - touch.pageY));
                } else if ((this.touchStartXY.x - touch.pageX).abs() > (this.touchStartXY.y - touch.pageY).abs()) {
                    this.touchMode = "scrollLeft";
                    this._selectStage.scrollLeft(this.touchStartXY.scrollLeft + (this.touchStartXY.x - touch.pageX));
                }
            }
        }

        if (event.preventDefault) event.preventDefault();
        else return false;
    },
    selectorHelperMoveByTouch: function (e) {
        var cfg = this.config;
        var event = window.event || e;
        var touch = event.touches[0];

        if (this.helperAppened) {

            var _helperPos = this.helperPos;
            var tmp,
                x1 = this.helperPos.x,
                y1 = this.helperPos.y,
                x2 = touch.pageX - _helperPos.bodyLeft,
                y2 = touch.pageY - _helperPos.bodyTop;
            if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
            if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }
            this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

            this._selectTargets.each(function () {

                var selectTarget = axdom.data(this, "selectableItem"), hit = false;
                /*trace({sl:selectTarget.left, sr:selectTarget.right, st:selectTarget.top, sb:selectTarget.bottom, x1:x1, x2:x2, y1:y1, y2:y2}); */
                if (!selectTarget) return;

                var stL = selectTarget.left.number(), stR = selectTarget.right.number(), stT = selectTarget.top.number(), stB = selectTarget.bottom.number();
                stL = stL + _helperPos.stageX - _helperPos.scrollLeft - _helperPos.bodyLeft;
                stR = stR + _helperPos.stageX - _helperPos.scrollLeft - _helperPos.bodyLeft;
                stT = stT + _helperPos.stageY - _helperPos.scrollTop - _helperPos.bodyTop;
                stB = stB + _helperPos.stageY - _helperPos.scrollTop - _helperPos.bodyTop;

                hit = (!(stL > x2 || stR < x1 || stT > y2 || stB < y1)); /* touch */
                /* hit = (selectTarget.left > x1 && selectTarget.right < x2 && selectTarget.top > y1 && selectTarget.bottom < y2); fit */
                if (hit) {
                    /* SELECT */
                    if (selectTarget.selected) {
                        selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
                        selectTarget.selected = false;
                    }
                    if (!selectTarget.selecting) {
                        selectTarget.jQueryelement.addClass(cfg.selectingClassName);
                        selectTarget.selecting = true;
                    }
                } else {
                    /* UNSELECT */
                    if (selectTarget.selecting) {
                        selectTarget.jQueryelement.removeClass(cfg.selectingClassName);
                        selectTarget.selecting = false;
                    }
                    if (selectTarget.selected) {
                        if (!event.metaKey && !event.shiftKey && !event.ctrlKey) {
                            selectTarget.jQueryelement.removeClass(cfg.beselectClassName);
                            selectTarget.selected = false;
                        }
                    }
                }
            });

        } else {
            this.helperAppened = true;
            axdom(document.body).append(this.helper);

            var css = { left: (touch.pageX - axdom(document.body).offset().left), top: (touch.pageY - axdom(document.body).offset().top), width: 0, height: 0 };
            this.helper.css(css);
            var stagePos = this._selectStage.offset();
            this.helperPos = {
                stageX: stagePos.left.number(),
                stageY: stagePos.top.number(),
                x: css.left.number(),
                y: css.top.number(),
                scrollLeft: this._selectStage.scrollLeft().number(),
                scrollTop: this._selectStage.scrollTop().number(),
                bodyLeft: axdom(document.body).offset().left,
                bodyTop: axdom(document.body).offset().top
            };
        }
    },
    touchEnd: function (e) {
        var cfg = this.config;
        var event = window.event || e;
        this.helperAppenedReady = false;
        this.moveSens = 0;

        this.touchMode = false;

        if (document.removeEventListener) {
            document.removeEventListener("touchend", this.touchEndBind, false);
            document.removeEventListener("touchmove", this.touchMoveBind, false);
        }

        if (this.helperAppened) {
            this.helperAppened = false;
            this.helper.remove();

            /* selected change */
            this._selectTargets.each(function () {
                var selectTarget = axdom.data(this, "selectableItem");
                if (selectTarget) {
                    if (selectTarget.selecting) {
                        selectTarget.jQueryelement.removeClass(cfg.selectingClassName);
                        selectTarget.selecting = false;
                        selectTarget.jQueryelement.addClass(cfg.beselectClassName);
                        selectTarget.selected = true;
                    } else if (selectTarget.selected) {

                    }
                }
            });
        }
    },
    getSelects: function () {
        var cfg = this.config;
        var selects = [];
        this._selectTargets.each(function () {
            var selectTarget = axdom.data(this, "selectableItem");
            if (selectTarget) {
                if (selectTarget.selected) {
                    selects.push(selectTarget.element);
                }
            }
        });
        return selects;
    },
    size: function () {
        var cfg = this.config;
        var selects = [];
        this._selectTargets.each(function () {
            var selectTarget = axdom.data(this, "selectableItem");
            if (selectTarget) {
                if (selectTarget.selected) {
                    selects.push(selectTarget.element);
                }
            }
        });
        return selects.length;
    }
});
/* ---------------------------------------------- AXMultiSelect -- */

/* -- AXResizable ---------------------------------------------- */
var AXResizable = Class.create(AXJ, {
    version: "AXResizable v1.0",
    author: "tom@axisj.com",
    logs: [
        "2013-11-12 오전 10:22:06"
    ],
    initialize: function (AXJ_super) {
        AXJ_super();
        this.moveSens = 0;
        this.config.moveSens = 2;
        this.objects = [];
        this.config.bindResiableContainer = "AXResizable";
        this.config.bindResiableHandle = "AXResizableHandle";
    },
    init: function () {
        this.helper = axdom("<div class='AXResizableHelper'></div>");
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

        AXUtil.each(this.objects, function (idx, O) {
            /*if (this.id == objID && this.isDel == true) objSeq = idx;*/
            if (this.id == objID) {
                objSeq = idx;
            }
        });
        if (objSeq == null) {
            objSeq = this.objects.length;
            this.objects.push({
                id: objID,
                element: AXgetId(objID),
                jQueryElement: axdom("#" + objID),
                config: obj
            });
        } else {
            this.objects[objSeq].isDel = undefined;
            this.objects[objSeq].config = obj;
        }
        this.bindResizer(objID, objSeq);
    },
    unbind: function (obj) {
        var cfg = this.config;
        var removeIdx;
        AXUtil.each(this.objects, function (idx, O) {
            if (O.id != obj.id) {
            } else {
                if (O.isDel != true) {
                    removeIdx = idx;
                }
            }
        });
        if (removeIdx != undefined) {
            this.objects[removeIdx].isDel = true;
            /* unbind 구문 */
        }
    },
    bindResizer: function (objID, objSeq) {
        var _this = this;
        var cfg = this.config;

        var obj = this.objects[objSeq];

        var po = [];
        po.push("<div class=\"" + cfg.bindResiableHandle + "\"></div>");
        obj.jQueryElement.addClass(cfg.bindResiableContainer);
        obj.jQueryElement.append(po.join(''));

        //obj.jQueryElement.bind("mousedown.AXResizable", function(){_this.mousedown(objID, objSeq, event)});
        obj.jQueryElement.bind("mousedown.AXResizable", this.mousedown.bind(this, objID, objSeq));
    },
    mousedown: function (objID, objSeq, event) {
        var _this = this;
        var cfg = this.config;

        axdom(window).bind("mousemove.AXResizable", this.mousemove.bind(this, objID, objSeq));
        axdom(window).bind("mouseup.AXResizable", this.mouseup.bind(this, objID, objSeq));
        /*axdom(document.body).bind("mouseleave.AXResizable", this.mouseup.bind(this, objID, objSeq));*/

        axdom(document.body).attr("onselectstart", "return false");
        axdom(document.body).addClass("AXUserSelectNone");

        this.helperAppenedReady = true;
    },
    mousemove: function (objID, objSeq, event) {
        var cfg = this.config;
        if (!event.pageX) return;

        /*드래그 감도 적용 */
        if (this.config.moveSens > this.moveSens) this.moveSens++;
        if (this.moveSens == this.config.moveSens) this.selectorHelperMove(objID, objSeq, event);
    },
    mouseup: function (objID, objSeq, event) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        this.helperAppenedReady = false;
        this.moveSens = 0;

        axdom(window).unbind("mousemove.AXResizable");
        axdom(window).unbind("mouseup.AXResizable");
        /*axdom(document.body).unbind("mouseleave.AXResizable");*/

        axdom(document.body).removeAttr("onselectstart");
        axdom(document.body).removeClass("AXUserSelectNone");

        if (this.helperAppened) {
            this.helperAppened = false;

            var newWidth = this.helper.width();
            var newHeight = this.helper.height();

            var paddingLeft = obj.jQueryElement.css("padding-left");
            var paddingRight = obj.jQueryElement.css("padding-right");
            var paddingTop = obj.jQueryElement.css("padding-top");
            var paddingBottom = obj.jQueryElement.css("padding-bottom");
            var paddingW = paddingLeft.number() + paddingRight.number();
            var paddingH = paddingTop.number() + paddingBottom.number();

            if (obj.config.animate) {
                obj.jQueryElement.animate(
                    { width: newWidth - paddingW, height: newHeight - paddingH },
                    (obj.config.animate.duration || 300), (obj.config.animate.easing || "liner"),
                    function () {
                        if (obj.config.onChange) {
                            obj.config.onChange.call(obj, obj);
                        }
                    }
                );
            } else {
                obj.jQueryElement.css({ width: newWidth - paddingW, height: newHeight - paddingH });
                if (obj.config.onChange) {
                    obj.config.onChange.call(obj, obj);
                }
            }

            this.helper.remove();
        }
    },
    selectorHelperMove: function (objID, objSeq, event) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        if (this.helperAppened) {

            var _helperPos = this.helperPos;
            var tmp,
                x1 = this.helperPos.x,
                y1 = this.helperPos.y,
                x2 = event.pageX - _helperPos.bodyLeft,
                y2 = event.pageY - _helperPos.bodyTop;

            var minWidth = (obj.config.minWidth || 0),
                minHeight = (obj.config.minHeight || 0),
                maxWidth = (obj.config.maxWidth || 0),
                maxHeight = (obj.config.maxHeight || 0);

            var myWidth = x2 - x1, myHeight = y2 - y1;

            if (minWidth != 0 && myWidth < minWidth) myWidth = minWidth;
            if (minHeight != 0 && myHeight < minHeight) myHeight = minHeight;
            if (maxWidth != 0 && myWidth > maxWidth) myWidth = maxWidth;
            if (maxHeight != 0 && myHeight > maxHeight) myHeight = maxHeight;

            if (obj.config.aspectRatio) {
                myWidth = myHeight * obj.config.aspectRatio;
            }

            if (obj.config.snap) {
                myWidth = obj.config.snap * (myWidth / obj.config.snap).ceil();
                myHeight = obj.config.snap * (myHeight / obj.config.snap).ceil();
            }
            //trace({width: myWidth, height: myHeight});
            this.helper.css({ width: myWidth, height: myHeight });

        } else {
            this.helperAppened = true;
            axdom(document.body).append(this.helper);

            var bodyLeft = axdom(document.body).offset().left;
            var bodyTop = axdom(document.body).offset().top;

            var pos = obj.jQueryElement.offset();
            var css = {
                left: pos.left + bodyLeft,
                top: pos.top + bodyLeft,
                width: obj.jQueryElement.outerWidth(),
                height: obj.jQueryElement.outerHeight()
            };
            this.helper.css(css);

            this.helperPos = {
                x: css.left,
                y: css.top,
                bodyLeft: axdom(document.body).offset().left,
                bodyTop: axdom(document.body).offset().top
            };
        }
    }
});
var AXResizableBinder = new AXResizable();
AXResizableBinder.setConfig({ targetID: "defaultResiable" });

axdom.fn.bindAXResizable = function (config) {
    AXUtil.each(this, function () {
        config = config || {}; config.id = this.id;
        AXResizableBinder.bind(config);
        return this;
    });
};

axdom.fn.unbindAXResizable = function (config) {
    AXUtil.each(this, function () {
        if (config == undefined) config = {};
        config.id = this.id;
        AXResizableBinder.unbind(config);
        return this;
    });
};
/* ---------------------------------------------- AXResizable -- */

/* -- AXContextMenu ---------------------------------------------- */
/**
 * AXContextMenuClass
 * @class AXContextMenuClass
 * @extends AXJ
 * @version v1.23
 * @author tom@axisj.com
 * @logs
 "2013-03-22 오후 6:08:57",
 "2013-09-03 오후 7:10:14 메뉴확장 위치 제어 버그 픽스",
 "2013-12-16 href=javascript 설정했을 때 onbeforeunload 이벤트 충돌문제 해결",
 "2013-12-26 오후 4:27:00 tom, left, top position ",
 "2014-02-11 오전 11:06:13 root, subMenu underLine, upperLine add",
 "2014-04-07 오전 9:55:57 tom, extent checkbox, sortbox"
 "2014-06-24 tom : reserveKeys.subMenu 설정할 수 있도록 기능 보강, 콜백함수 개선"
 * @description
 *
 ```js
 AXContextMenu.bind({
		id:"myContextMenu", 
		theme:"AXContextMenu", // 선택항목
		width:"150", // 선택항목
		checkbox:"checkbox", // [checkbox|radio]
		sortbox:true,
		menu:[
			{label:'선택 1', checked:true, onclick:function(){
				return false;	
			}},
			{label:'선택 2', checked:true, 
				subMenu:[
					{label:"하위메뉴1"},
					{label:"하위메뉴2",
						subMenu:[
							{label:"하위메뉴21"},
							{label:"하위메뉴22"}
						]
					},
					{label:"하위메뉴3"},
					{label:"하위메뉴3"},
					{label:"하위메뉴3"}
				]
			},
			{label:'선택 3', checked:true},
			{label:'선택 4', checked:false, sort:"asc"} // config 에 checkbox 가 있는데. menu에 onclick 가 없으면 체크박스 액션이 작동합니다.		
		],
		onchange: function(){ // 체크박스 선택값이 변경 된 경우 호출 됩니다.
			trace(this.menu);
			
			// return true; 메뉴 창이 닫히지 않게 합니다.
		},
		onsort: function(){ // 정렬이 변경 된 경우 호출 됩니다.
			trace(this.sortMenu);
			
			// return true; 메뉴 창이 닫히지 않게 합니다.
		}
	});
 AXContextMenu.open({id:'myContextMenu'}, window.event);
 ```
 *
 */

var AXContextMenuClass = Class.create(AXJ, {
    initialize: function (AXJ_super) {
        AXJ_super();
        this.showedItem = {};
        this.objects = [];
        this.config.theme = "AXContextMenu";
        this.config.width = "140";
        this.config.responsiveMobile = 0; /* 모바일 반응 너비 */
	    this.config.reserveKeys = {
		    subMenu: "subMenu"
	    };
    },
    init: function () {

    },
    bindSetConfig: function (objID, configs) {
        var findIndex = null;
        AXUtil.each(this.objects, function (index, O) {
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
            AXUtil.each(configs, function (k, v) {
                _self.config[k] = v;
            });
        }
    },
    bind: function (obj) {
        var cfg = this.config;
        if (!obj.id) {
            trace("ID가 없어 bind 처리할 수 없습니다. AXContentMenu.bind({id:'idValue'});");
            return;
        }
        var objSeq = null;
        AXUtil.each(this.objects, function (idx, O) {
            if (this.id == obj.id) {
                objSeq = idx;
                return false;
            }
        });
        if (objSeq != null) {
            this.objects[objSeq] = obj;
            return;
        }else{
            this.objects[objSeq] = obj;
        }
        var objID = obj.id;
        objSeq = this.objects.length;

	    if(!obj.reserveKeys){
		    obj.reserveKeys = cfg.reserveKeys;
	    }
        this.objects.push(obj);
    },
    filter: function (objSeq, objID, myobj, menu) {
        var cfg = this.config;
        var obj = this.objects[objSeq];
        if (myobj.filter) {
            var sendObj = {
                menu: menu,
                sendObj: obj.sendObj
            }
            return myobj.filter.call(sendObj, objID);
        } else {
            return true;
        }
    },
    getSubMenu: function (parentID, objSeq, objID, myobj, subMenu, depth) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        var theme = obj.theme || cfg.theme;
        var width = obj.width || cfg.width;

        var filter = this.filter.bind(this);
        var getSubMenu = this.getSubMenu.bind(this);
        var subMenuID = parentID + "_AX_subMenu";

        var href = (obj.href == undefined) ? cfg.href : obj.href;
        var po = [];
        po.push("<div id=\"" + subMenuID + "\" class=\"" + theme + "\" style=\"width:" + width + "px;left:" + (width.number() - 15) + "px;display:none;\">");
        AXUtil.each(subMenu, function (idx, menu) {
            if (filter(objSeq, objID, myobj, menu)) {
                if (menu.upperLine) po.push("<div class=\"hline\"></div>");
                var className = (menu.className) ? menu.className : "";
                var hasSubMenu = (menu[obj.reserveKeys.subMenu]) ? " hasSubMenu" : "";
                po.push("<a " + href + " class=\"contextMenuItem " + className + hasSubMenu + "\" id=\"" + subMenuID + "_AX_" + depth + "_AX_" + idx + "\">");
                var checked = "";
                if(obj.checkbox){
                    if(menu.checked) checked = " on";
                    po.push("<div class='tool-checkbox"+ checked +"' id=\"" + subMenuID + "_tool_AX_" + depth + "_AX_" + idx + "\"></div>");
                }

                po.push("<span class='label'>" + menu.label + "</label>");

                po.push("<div class='tool-rightGroup'>");
                if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0) po.push("<div class=\"contextSubMenuIcon\"></div>");
                po.push("</div>");
                po.push("</a>");
                menu.__axdomId = subMenuID + "_AX_" + depth + "_AX_" + idx;

                if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0) po.push(getSubMenu(subMenuID + "_AX_" + depth + "_AX_" + idx, objSeq, objID, myobj, menu[obj.reserveKeys.subMenu], (depth + 1)));
                if (menu.underLine) po.push("<div class=\"hline\"></div>");
            }
        });
        po.push("</div>");
        return po.join('');
    },
    open: function (myobj, position) {
        var cfg = this.config;
        if(axf.clientWidth() < cfg.responsiveMobile){
            this.mobileOpen(myobj, position);
        }else{
            this.deskTopOpen(myobj, position);
        }
    },
    mobileOpen: function(myobj, position){
        var cfg = this.config;
        var objSeq = null;
        AXUtil.each(this.objects, function (index, O) {
            if (O.id == myobj.id) {
                objSeq = index;
                return false;
            }
        });
        if (objSeq == null) {
            //trace("바인드 된 오브젝트를 찾을 수 없습니다.");
            return;
        }
        var obj = this.objects[objSeq];
        var objID = obj.id;

        this.modal = new AXMobileModal();
        this.modal.setConfig({
            addClass:"",
            height: 388,
            width: 300,
            head:{
                //title:(myobj.title||AXConfig.AXContextMenu.title),
                close:{
                    onclick:function(){}
                }
            },
            onclose: function(){}
        });

        var initMobileModalBind = this.initMobileModal.bind(this);
        var onLoad = function(modalObj){
            initMobileModalBind(objID, objSeq, myobj, modalObj);
        };
        this.modal.open(null, onLoad);
        this.mobileMode = true;
    },
    initMobileModal: function(objID, objSeq, myobj, modalObj){ // 현재 선택된 모바일 메뉴를 오픈합니다.
        var cfg = this.config, _this = this;
        var obj = this.objects[objSeq];
        this.mobileModalObj = {
            myobj:myobj,
            modalObj:modalObj
        }; // memo mobileModal
        if (myobj.sendObj) {
            obj.sendObj = myobj.sendObj;
        }
        var href = (obj.href == undefined) ? cfg.href : obj.href;
        var filter = this.filter.bind(this);

        var headPo = [];
        /* 현재 선택된 메뉴 선택 하는 기능구현 필요 */
        headPo.push('<a ' + href + ' class="AXContextMenuHome">home</a>');
        headPo.push('<span id="' + objID + '_AX_mobileMenuPrevBox"></span>');
        modalObj.modalHead.empty();
        modalObj.modalHead.append(headPo.join(''));

        modalObj.modalHead.find(".AXContextMenuHome").bind("click", function(){
            _this.initMobileModal(objID, objSeq, myobj, modalObj);
        });

        var styles = [];
        styles.push("height:339px;");
        var menuList = obj.menu;
        var po = [];
        po.push("<div id=\"" + objID + "_AX_containerBox\" class=\"AXContextMenuContainer\" style=\"" + styles.join(";") + "\">");
        po.push("<div id=\"" + objID + "_AX_scroll\" class=\"AXContextMenuScroll\">");
        axf.each(menuList, function (idx, menu) {
            if (filter(objSeq, objID, myobj, menu)) {
                //if (menu.upperLine) po.push("<div class=\"hline\"></div>");
                var className = (menu.className) ? " " + menu.className : "";
                var hasSubMenu = (menu[obj.reserveKeys.subMenu]) ? " hasSubMenu" : "";
                po.push("<a " + href + " class=\"contextMenuItem" + className + hasSubMenu + "\" id=\"" + objID + "_AX_contextMenu_AX_"+ 0 +"_AX_" + idx + "\">");

                var checked = "";
                if(obj.checkbox){
                    if(menu.checked) checked = " on";
                    po.push("<div class='tool-checkbox"+ checked +"' id=\"" + objID + "_AX_contextMenuToolCheck_AX_"+ 0 +"_AX_" + idx + "\"></div>");
                }

                po.push("<span class='label'>" + menu.label + "</label>");

                po.push("<div class='tool-rightGroup'>");
                if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0) po.push("<div class=\"contextSubMenuIcon\"></div>");
                if (obj.sortbox){
                    var sortdirect = "";
                    if(menu.sort){
                        sortdirect = " " + menu.sort.toString().lcase();
                    }
                    po.push("<div class=\"tool-sort"+ sortdirect +"\" id=\"" + objID + "_AX_contextMenuToolSort_AX_"+ 0 +"_AX_" + idx + "\"></div>");
                }
                po.push("</div>");
                po.push("</a>");

                menu.__axdomId = objID + "_AX_contextMenu_AX_0_AX_" + idx;
                //if (menu.underLine) po.push("<div class=\"hline\"></div>");
            }
        });
        po.push("</div>");
        po.push("</div>");

        modalObj.modalBody.empty();
        modalObj.modalBody.append(po.join(''));

        this.myUIScroll = new AXScroll();
        this.myUIScroll.setConfig({
            targetID: objID + "_AX_containerBox",
            scrollID: objID + "_AX_scroll"
        });

        var contextMenuItemClick = this.contextMenuItemClick.bind(this);
        var closeMobileModal = this.closeMobileModal.bind(this);
        this.contextMenuItemClickBind = function (event) {
            contextMenuItemClick(event, objSeq, objID);
            //closeMobileModal();
        };
        modalObj.modalBody.find(".contextMenuItem").bind("click", this.contextMenuItemClickBind);
    },

    mobileModalSubMenu: function (parentID, objSeq, objID, myobj, modalObj, pMenu, depth) {
        var cfg = this.config, _this = this;
        var obj = this.objects[objSeq];
        var theme = obj.theme || cfg.theme;
        var width = obj.width || cfg.width;

        var filter = this.filter.bind(this);
        var mobileModalSubMenu = this.mobileModalSubMenu.bind(this);
        var subMenuID = parentID + "_AX_subMenu";

        var href = (obj.href == undefined) ? cfg.href : obj.href;

        var poi = parentID.split(/_AX_/g);
        var pdepth = poi[poi.length - 2].number();
        /*
         if(pdepth == 0) {
         this.mobileModalObj.previousMenu = "root";
         this.mobileModalObj.nowMenu = pMenu.__axdomId;
         }else{
         this.mobileModalObj.previousMenu = this.mobileModalObj.nowMenu;
         this.mobileModalObj.nowMenu = pMenu.__axdomId;
         }
         */
        //trace(axdom("#" + objID + "_AX_mobileMenuPrevBox").get(0));
        axdom("#" + objID + "_AX_mobileMenuPrevBox").html('<a class="AXContextMenuPrev" id="'+objID+'_AX_prev_AX_'+poi.join("_")+'">'+pMenu.label+'</a>');

        axdom("#"+objID+'_AX_prev_AX_'+poi.join("_")).bind("click", function(){
            if(pdepth == 0) {
                _this.initMobileModal(objID, objSeq, myobj, modalObj);
            }else{
                var poi = pMenu.__axdomId.split(/_AX_/g);
                var _depth = poi[poi.length - 2].number();
                var hashs = [];

                var mystrPosition = poi.length - 1;
                for (var r = 0; r < depth + 1; r++) {
                    if(!isNaN(poi[mystrPosition])) hashs.push(poi[mystrPosition]);
                    mystrPosition -= 3;
                }
                hashs = hashs.reverse();
                hashs.pop();
                var menu = obj.menu;
                for (var hash, idx= 0, __arr = hashs; (idx < __arr.length && (hash = __arr[idx])); idx++) {
                    if (idx == 0) menu = menu[hash];
                    else menu = menu[obj.reserveKeys.subMenu][hash];
                }
                _this.mobileModalSubMenu(menu.__axdomId,  objSeq, objID,  _this.mobileModalObj.myobj, _this.mobileModalObj.modalObj, menu, (depth-1));
            }
        });

        var styles = [];
        styles.push("height:339px;");
        var menuList = pMenu[obj.reserveKeys.subMenu];
        var po = [];
        po.push("<div id=\"" + objID + "_AX_containerBox\" class=\"AXContextMenuContainer\" style=\"" + styles.join(";") + "\">");
        po.push("<div id=\"" + objID + "_AX_scroll\" class=\"AXContextMenuScroll\">");
        axf.each(menuList, function (idx, menu) {
            if (filter(objSeq, objID, myobj, menu)) {
                var className = (menu.className) ? " " + menu.className : "";
                var hasSubMenu = (menu[obj.reserveKeys.subMenu]) ? " hasSubMenu" : "";
                po.push("<a " + href + " class=\"contextMenuItem" + className + hasSubMenu + "\" id=\"" + subMenuID + "_AX_" + depth + "_AX_" + idx + "\">");

                var checked = "";
                if(obj.checkbox){
                    if(menu.checked) checked = " on";
                    po.push("<div class='tool-checkbox"+ checked +"' id=\"" + subMenuID + "_AX_contextMenuToolCheck_AX_" + depth + "_AX_" + idx + "\"></div>");
                }

                po.push("<span class='label'>" + menu.label + "</label>");

                po.push("<div class='tool-rightGroup'>");
                if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0) po.push("<div class=\"contextSubMenuIcon\"></div>");
                if (obj.sortbox){
                    var sortdirect = "";
                    if(menu.sort){
                        sortdirect = " " + menu.sort.toString().lcase();
                    }
                    po.push("<div class=\"tool-sort"+ sortdirect +"\" id=\"" + subMenuID + "_AX_contextMenuToolSort_AX_"+ depth +"_AX_" + idx + "\"></div>");
                }
                po.push("</div>");

                po.push("</a>");

                menu.__axdomId = subMenuID + "_AX_" + depth + "_AX_" + idx;
            }
        });
        po.push("</div>");
        po.push("</div>");

        modalObj.modalBody.empty();
        modalObj.modalBody.append(po.join(''));

        this.myUIScroll = new AXScroll();
        this.myUIScroll.setConfig({
            targetID: objID + "_AX_containerBox",
            scrollID: objID + "_AX_scroll"
        });

        var contextMenuItemClick = this.contextMenuItemClick.bind(this);
        var closeMobileModal = this.closeMobileModal.bind(this);
        this.contextMenuItemClickBind = function (event) {
            contextMenuItemClick(event, objSeq, objID);
            //closeMobileModal();
        };
        modalObj.modalBody.find(".contextMenuItem").bind("click", this.contextMenuItemClickBind);
    },

    closeMobileModal: function(){
        var cfg = this.config;
        this.modal.close();
    },
    deskTopOpen: function (myobj, position) {
        var cfg = this.config;
        var objSeq = null;
        this.mobileMode = false;
        AXUtil.each(this.objects, function (index, O) {
            if (O.id == myobj.id) {
                objSeq = index;
                return false;
            }
        });
        if (objSeq == null) {
            //trace("바인드 된 오브젝트를 찾을 수 없습니다.");
            return;
        }
        var obj = this.objects[objSeq];
        var objID = obj.id;

        if (myobj.sendObj) {
            obj.sendObj = myobj.sendObj;
        }

        if (AXgetId(objID)) return;

        var theme = obj.theme || cfg.theme;
        var width = obj.width || cfg.width;

        axdom("#" + objID).remove();

        var href = (obj.href == undefined) ? cfg.href : obj.href;

        var filter = this.filter.bind(this);
        var getSubMenu = this.getSubMenu.bind(this);
        var po = [];
        po.push("<div id=\"" + objID + "\" class=\"" + theme + "\" style=\"width:" + width + "px;\">");
        AXUtil.each(obj.menu, function (idx, menu) {
            if (filter(objSeq, objID, myobj, menu)) {
                if (menu.upperLine) {
                    po.push("<div class=\"hline\"></div>");
                }
                var className = (menu.className) ? " " + menu.className : "";
                var hasSubMenu = (menu[obj.reserveKeys.subMenu]) ? " hasSubMenu" : "";
                po.push("<a " + href + " class=\"contextMenuItem" + className + hasSubMenu + "\" id=\"" + objID + "_AX_contextMenu_AX_0_AX_" + idx + "\">");
                var checked = "";
                if(obj.checkbox){
                    if(menu.checked) checked = " on";
                    po.push("<div class='tool-checkbox"+ checked +"' id=\"" + objID + "_AX_contextMenuTool_AX_0_AX_" + idx + "\"></div>");
                }

                po.push("<span class='label'>" + menu.label + "</span>");

                po.push("<div class='tool-rightGroup'>");
                if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0) po.push("<div class=\"contextSubMenuIcon\"></div>");
                if (obj.sortbox)  po.push("<div class=\"tool_sort desc\"></div>");
                po.push("</div>");
                po.push("</a>");

                menu.__axdomId = objID + "_AX_contextMenu_AX_0_AX_" + idx;

                if (menu[obj.reserveKeys.subMenu]) {
                    if (menu[obj.reserveKeys.subMenu].length > 0) {
                        po.push(getSubMenu(objID + "_AX_contextMenu_AX_0_AX_" + idx, objSeq, objID, myobj, menu[obj.reserveKeys.subMenu], 1));
                    }
                }
                if (menu.underLine) {
                    po.push("<div class=\"hline\"></div>");
                }
            }
        });
        po.push("</div>");
        axdom(document.body).append(po.join(''));

        axdom("#" + objID + " .contextMenuItem:first-child").addClass("first");
        axdom("#" + objID + " .contextMenuItem:last-child").addClass("last");

        var contextMenuItemMouseOver = this.contextMenuItemMouseOver.bind(this);
        this.contextMenuItemMouseOverBind = function (event) {
            contextMenuItemMouseOver(event, objSeq, objID);
        };
        axdom("#" + objID + " .contextMenuItem").bind("mouseover", this.contextMenuItemMouseOverBind);

        //컨텍스트 메뉴의 위치 지정
        var css = {};
        if (!position.clientX) {
            if (position.left != undefined) css.left = position.left;
            else css.right = position.right;
            css.top = position.top;
        } else {
            var mouse = this.getMousePositon(position);
            css.left = mouse.pageX;
            css.top = mouse.pageY;
        }

        // -- 부모박스 정보와 박스 정보
        var pElement = axdom("#" + objID).offsetParent();
        var pBox = { width: pElement.width(), height: pElement.height() };
        var clientHeight = (AXUtil.docTD == "Q") ? document.body.scrollHeight : document.documentElement.scrollHeight;
        var clienWidth = (AXUtil.docTD == "Q") ? document.body.scrollWidth : document.documentElement.scrollWidth;
        if (clienWidth > pBox.width) pBox.width = clienWidth;
        if (clientHeight > pBox.height) pBox.height = clientHeight;
        var _box = { width: axdom("#" + objID).outerWidth(), height: axdom("#" + objID).outerHeight() };
        // -- 부모박스 정보와 박스 정보		

        if ((_box.height.number() + css.top.number()) > pBox.height) {
            css.top -= ((_box.height.number() + css.top.number()) - pBox.height) + 25;
            this.openTB = "up";
            if(css.top < 0) css.top = 0;
        }

        if (css.left != undefined) {

            if ((_box.width.number() + css.left.number()) > pBox.width) {
                var moveLeft = ((_box.width.number() + css.left.number()) - pBox.width) + 25;
                css.left -= moveLeft;
                this.openLR = "left";
            } else {
                if ((_box.width.number() * 2 + css.left.number()) > pBox.width) {
                    this.openLR = "left";
                }
            }

            /*
             if((_box.width.number() + css.left.number()) > pBox.width){
             css.left -= ((_box.width.number() + css.left.number()) - pBox.width) + 5;
             this.openLR = "left";
             }
             */
        } else {
            css.left = "auto";
            this.openLR = "right";
        }
        axdom("#" + objID).css(css);

        this.eventBind(objSeq, objID);
    },
    eventBind: function (objSeq, objID) {
        var cfg = this.config;
        /* closeEvent bind */
        var contextMenuItemDown = this.contextMenuItemDown.bind(this);
        var contextMenuItemDownBind = function (event) {
            contextMenuItemDown(event, objSeq, objID);
        };

        axdom(document).bind("mousedown.AXContenxtMenu", contextMenuItemDownBind);
        axdom(document).bind("keydown.AXContenxtMenu", contextMenuItemDownBind);

        axdom(document).find("iframe").each(function () {
            try{
                axdom(window[this.name].document).bind("mousedown.AXContenxtMenu", contextMenuItemDownBind);
                axdom(window[this.name].document).bind("keydown.AXContenxtMenu", contextMenuItemDownBind);
            }catch(e){

            }
        });

        /* closeEvent bind ~~~~~~~~~~~~~~~~~~~ */
        //click
        var contextMenuItemClick = this.contextMenuItemClick.bind(this);
        this.contextMenuItemClickBind = function (event) {
            contextMenuItemClick(event, objSeq, objID);
        };
        axdom("#" + objID).find(".contextMenuItem").bind("click", this.contextMenuItemClickBind);
    },
    _close: function (objSeq, objID) {
        var cfg = this.config;

        if(this.mobileMode){
            this.closeMobileModal();
        }else{
            axdom("#" + objID).fadeOut("fast", function () {
                axdom("#" + objID).remove();
            });
        }

        axdom(document).unbind("keydown.AXContenxtMenu");
        axdom(document).unbind("mousedown.AXContenxtMenu");

        axdom(document).find("iframe").each(function () {
            axdom(window[this.name].document).unbind("mousedown.AXContenxtMenu");
            axdom(window[this.name].document).unbind("keydown.AXContenxtMenu");
        });

        this.showedItem = {}; // 초기화
        this.openTB = "";
        this.openLR = "";
    },
    close: function (myobj) {
        var cfg = this.config;
        var objSeq = null;
        AXUtil.each(this.objects, function (index, O) {
            if (O.id == myobj.id) {
                objSeq = index;
                return false;
            }
        });
        if (objSeq == null) {
            //trace("바인드 된 오브젝트를 찾을 수 없습니다.");
            return;
        }
        var obj = this.objects[objSeq];
        var objID = obj.id;

        axdom("#" + objID).fadeOut("fast", function () {
            axdom("#" + objID).remove();
        });

        axdom(document).unbind("keydown", this.contextMenuItemDownBind);
        axdom(document).unbind("mousedown", this.contextMenuItemDownBind);

        this.showedItem = {}; // 초기화
        this.openTB = "";
        this.openLR = "";
    },
    contextMenuItemMouseOver: function (event, objSeq, objID) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        var menuWidth = obj.width || cfg.width;
        // event target search -
        var eid = event.target.id.split(/_AX_/g);
        var eventTarget = event.target;
        var myTarget = this.getEventTarget({
            evt: eventTarget, evtIDs: eid,
            find: function (evt, evtIDs) { return (axdom(evt).hasClass("contextMenuItem")) ? true : false; }
        });
        // event target search ------------------------    	
        if (myTarget) {
            var poi = myTarget.id.split(/_AX_/g);
            var depth = poi[poi.length - 2];
            if (this.showedItem[depth]) {
                axdom("#" + this.showedItem[depth]).hide();
            }
            if (axdom(myTarget).hasClass("hasSubMenu")) {

                // -- 부모박스 정보와 박스 정보
                var pElement = axdom("#" + myTarget.id + "_AX_subMenu").offsetParent();
                var pBox = { width: pElement.width(), height: pElement.height() };
                var clientHeight = (AXUtil.docTD == "Q") ? document.body.scrollHeight : document.documentElement.scrollHeight;
                var clienWidth = (AXUtil.docTD == "Q") ? document.body.scrollWidth : document.documentElement.scrollWidth;
                if (clienWidth > pBox.width) pBox.width = clienWidth;
                if (clientHeight > pBox.height) pBox.height = clientHeight;
                var _box = { width: axdom("#" + myTarget.id + "_AX_subMenu").outerWidth(), height: axdom("#" + myTarget.id + "_AX_subMenu").outerHeight() };
                // -- 부모박스 정보와 박스 정보		

                var subMenuTop = axdom("#" + myTarget.id).position().top;

                var css;
                if (this.openTB == "up") {
                    var ph = axdom("#" + myTarget.id).offsetParent().height();
                    var h = axdom("#" + myTarget.id).height();
                    var bottom = ph - subMenuTop - h;
                    css = { top: "auto", bottom: bottom };
                } else {
                    css = { top: subMenuTop };
                }
                if (this.openLR == "left") {
                    //css.left = -(menuWidth - 15);
                    css.left = -(20);
                }

                axdom("#" + myTarget.id + "_AX_subMenu").css(css);
                axdom("#" + myTarget.id + "_AX_subMenu").show();

                this.showedItem[depth] = myTarget.id + "_AX_subMenu";
            }
        }
    },
    contextMenuItemDown: function (event, objSeq, objID) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        if (event.keyCode == AXUtil.Event.KEY_ESC) {
            this._close(objSeq, objID);
            return;
        }

        // event target search -
        var eid = event.target.id.split(/_AX_/g);
        var eventTarget = event.target;
        var myTarget = this.getEventTarget({
            evt: eventTarget, evtIDs: eid,
            find: function (evt, evtIDs) { return (axdom(evt).hasClass("contextMenuItem")) ? true : false; }
        });
        // event target search ------------------------

        if (myTarget) {

        } else {
            this._close(objSeq, objID);
        }
    },
    contextMenuItemClick: function (event, objSeq, objID) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        // event target search -
        var eid = event.target.id.split(/_AX_/g);
        var eventTarget = event.target;
        var myTarget = this.getEventTarget({
            evt: eventTarget, evtIDs: eid,
            find: function (evt, evtIDs) { return (axdom(evt).hasClass("contextMenuItem") || axdom(evt).hasClass("tool-checkbox") || axdom(evt).hasClass("tool-sort")) ? true : false; }
        });
        // event target search ------------------------

        if (myTarget) {

            var poi = myTarget.id.split(/_AX_/g);
            var depth = poi[poi.length - 2].number();
            var hashs = [];

            var mystrPosition = poi.length - 1;
            for (var r = 0; r < depth + 1; r++) {
                hashs.push(poi[mystrPosition]);
                mystrPosition -= 3;
            }
            hashs = hashs.reverse();

            var menu = obj.menu;
            for (var hash, idx= 0, __arr = hashs; (idx < __arr.length && (hash = __arr[idx])); idx++) {
                if (idx == 0) menu = menu[hash];
                else menu = menu[obj.reserveKeys.subMenu][hash];
            }

            if (menu[obj.reserveKeys.subMenu] && menu[obj.reserveKeys.subMenu].length > 0 && this.mobileMode){
                //this.initMobileModal(objID, objSeq, this.mobileModalObj.myobj, this.mobileModalObj.modalObj, (depth+1), menu.subMenu);
                this.mobileModalSubMenu(myTarget.id,  objSeq, objID,  this.mobileModalObj.myobj, this.mobileModalObj.modalObj, menu, (depth+1));
                return false;
            }

            if (axdom(myTarget).hasClass("tool-checkbox")){
                menu.checked = !menu.checked;
                axdom("#" + menu.__axdomId).find(".tool-checkbox").toggleClass("on");

                if (obj.onchange) {
                    obj.onchange.call({ menu: obj.menu, clickMenu: menu, sendObj: obj.sendObj }, objID);
                }
                return true;
            }

            if (axdom(myTarget).hasClass("tool-sort")){

                // 다른 메뉴들은 모두 정렬 헤제
                for (var M, midx= 0, __arr = obj.menu; (midx < __arr.length && (M = __arr[midx])); midx++) {
                    if(menu != M){
                        M.sort = undefined;
                        axdom("#" + M.__axdomId).find(".tool-sort").removeClass("asc").removeClass("desc");
                    }
                }


                if(menu.sort == undefined) menu.sort = "";
                if(menu.sort.toString().lcase() == "asc"){
                    axdom("#" + menu.__axdomId).find(".tool-sort").removeClass("asc").addClass("desc");
                    menu.sort = "desc";
                }else if(menu.sort.toString().lcase() == "desc"){
                    axdom("#" + menu.__axdomId).find(".tool-sort").removeClass("desc").addClass("asc");
                    menu.sort = "asc";
                }else{
                    axdom("#" + menu.__axdomId).find(".tool-sort").addClass("desc");
                    menu.sort = "desc";
                }

                if (obj.onsort) {
                    if(obj.onsort.call({ menu: obj.menu, sortMenu: menu, sendObj: obj.sendObj }, objID) != true){
                        this._close(objSeq, objID);
                    }
                }
                return true;
            }

            if (menu.onclick) {
                if(menu.onclick.call({ menu: menu, sendObj: obj.sendObj }, objID) != true){
                    this._close(objSeq, objID);
                }
                return true;
            }else if (obj.onchange) { // 라벨 선택 할 때. 정렬항목도 없는 경우만 체크 모드로 연결
                menu.checked = !menu.checked;
                axdom("#" + menu.__axdomId).find(".tool-checkbox").toggleClass("on");

                if (obj.onchange) {
                    if (obj.onchange.call({ menu: obj.menu, clickMenu: menu, sendObj: obj.sendObj }, objID) != true){
                        this._close(objSeq, objID);
                    }
                }
                return true;
            }
        }
    }
});
var AXContextMenu = new AXContextMenuClass();
AXContextMenu.setConfig({});

var AXPopOverClass = Class.create(AXContextMenuClass, {
    version: "AXPopOverClass v1.0",
    author: "tom@axisj.com",
    logs: [
        "2013-08-28 오후 6:16:46 - 시작 - tom"
    ],
    open: function (myobj, position) {
        var cfg = this.config;
        var objSeq = null;
        AXUtil.each(this.objects, function (index, O) {
            if (O.id == myobj.id) {
                objSeq = index;
                //return false;
            } else {
                axdom("#" + O.id).remove();
            }
        });
        if (objSeq == null) {
            //trace("바인드 된 오브젝트를 찾을 수 없습니다.");
            return;
        }

        var obj = this.objects[objSeq];
        var objID = obj.id;

        if (myobj.sendObj) {
            obj.sendObj = myobj.sendObj;
        }

        if (this.observer) clearTimeout(this.observer); //닫기 명령 제거
        var direction = obj.direction || "top";

        if (AXgetId(objID)) {
            if (position.clientX) {
                this.contentMenuSetCss(event, position, objSeq, objID);
            }
            return;
        }

        var theme = obj.theme || cfg.theme;
        var width = obj.width || cfg.width;

        //컨텍스트 메뉴의 위치 지정

        var arrowStyle = "";
        if (position.clientX) {
            arrowStyle = "background-position:10px 0px;"
        } else {
            if (position.arrowLeft) arrowStyle = "background-position:" + position.arrowLeft + "px 0px;"
        }

        axdom("#" + objID).remove();

        var href = (obj.href == undefined) ? cfg.href : obj.href;

        var filter = this.filter.bind(this);
        var getSubMenu = this.getSubMenu.bind(this);
        var po = [];
        po.push("<div id=\"" + objID + "\" class=\"" + theme + "\" style=\"width:" + width + "px;\">");
        po.push("<div class=\"arrowTop\" style=\"" + arrowStyle + "\"></div>");
        po.push("<div class=\"arrowBottom\" style=\"" + arrowStyle + "\"></div>");
        po.push("<div class=\"blockContainer\">");
        if (obj.menu) {
            AXUtil.each(obj.menu, function (idx, menu) {
                if (!menu) return false;
                if (filter(objSeq, objID, myobj, menu)) {
                    if (menu.upperLine) {
                        po.push("<div class=\"hline\"></div>");
                    }
                    var className = (menu.className) ? " " + menu.className : "";
                    var hasSubMenu = (menu.subMenu) ? " hasSubMenu" : "";
                    po.push("<a " + href + " class=\"contextMenuItem" + className + hasSubMenu + "\" id=\"" + objID + "_AX_contextMenu_AX_0_AX_" + idx + "\">");
                    po.push(menu.label);
                    if (menu.subMenu) {
                        if (menu.subMenu.length > 0) {
                            po.push("<div class=\"contextSubMenuIcon\"></div>");
                        }
                    }
                    po.push("</a>");
                    if (menu.subMenu) {
                        if (menu.subMenu.length > 0) {
                            po.push(getSubMenu(objID + "_AX_contextMenu_AX_0_AX_" + idx, objSeq, objID, myobj, menu.subMenu, 1));
                        }
                    }
                    if (menu.underLine) {
                        po.push("<div class=\"hline\"></div>");
                    }
                }
            });
        } else if (obj.body) {
            po.push("<div class=\"contextMenuBody\">");
            po.push(obj.body);
            po.push("</div>");
        }
        po.push("</div>");
        po.push("</div>");
        axdom(document.body).append(po.join(''));

        if (direction == "top") {
            axdom("#" + objID).find(".arrowTop").show();
            axdom("#" + objID).find(".arrowBottom").hide();
        } else if (direction == "bottom") {
            axdom("#" + objID).find(".arrowTop").hide();
            axdom("#" + objID).find(".arrowBottom").show();
        } else {
            axdom("#" + objID).find(".arrowTop").show();
            axdom("#" + objID).find(".arrowBottom").hide();
        }

        axdom("#" + objID + " .contextMenuItem:first-child").addClass("first");
        axdom("#" + objID + " .contextMenuItem:last-child").addClass("last");

        var contextMenuItemMouseOver = this.contextMenuItemMouseOver.bind(this);
        this.contextMenuItemMouseOverBind = function (event) {
            contextMenuItemMouseOver(event, objSeq, objID);
        };
        var contextMenuMouseOut = this.contextMenuMouseOut.bind(this);
        this.contextMenuMouseOutBind = function (event) {
            contextMenuMouseOut(event, objSeq, objID);
        };

        var eventClear = function () {
            if (this.observer) clearTimeout(this.observer); //닫기 명령 제거
        }
        axdom("#" + objID + " .contextMenuItem").bind("mouseover", this.contextMenuItemMouseOverBind);
        axdom("#" + objID).bind("mouseover", eventClear.bind(this));
        axdom("#" + objID).bind("mouseout", this.contextMenuMouseOutBind);

        this.contentMenuSetCss(null, position, objSeq, objID);

        //var eventBind = this.eventBind.bind(this);
        this.eventBind(objSeq, objID);
        //setTimeout(function(){}, 1);
    },
    contentMenuSetCss: function (event, position, objSeq, objID) {
        var cfg = this.config;
        var obj = this.objects[objSeq];
        var direction = obj.direction || "top";
        var css = {};

        if (!position.clientX) {
            if (position.left != undefined) {
                css.left = position.left;
            } else {
                css.left = "auto";
                css.right = position.right;
            }
            css.top = position.top;
        } else {
            var mouse = this.getMousePositon(position);
            obj.eventPosition = true;
            css.left = mouse.pageX;
            css.left -= 20;
            css.top = mouse.pageY;
        }
        // -- 부모박스 정보와 박스 정보
        var pElement = axdom("#" + objID).offsetParent();
        var pBox = { width: pElement.width(), height: pElement.height() };
        var clientHeight = (AXUtil.docTD == "Q") ? document.body.scrollHeight : document.documentElement.scrollHeight;
        var clienWidth = (AXUtil.docTD == "Q") ? document.body.scrollWidth : document.documentElement.scrollWidth;
        if (clienWidth > pBox.width) pBox.width = clienWidth;
        if (clientHeight > pBox.height) pBox.height = clientHeight;
        var _box = { width: axdom("#" + objID).outerWidth(), height: axdom("#" + objID).outerHeight() };
        // -- 부모박스 정보와 박스 정보		
        var openTB = "";
        if (direction == "top") {
            openTB = "top";
        } else if (direction == "bottom") {
            css.top -= axdom("#" + objID).outerHeight();
            openTB = "bottom";
        } else {
            if ((_box.height.number() + css.top.number()) > pBox.height) {
                css.top = css.top - _box.height.number() - position.handleHeight - 3;
                axdom("#" + objID).find(".arrowTop").hide();
                axdom("#" + objID).find(".arrowBottom").show();
                //css.top -= ((_box.height.number() + css.top.number()) - pBox.height) + 5;
                openTB = "bottom";
            } else {
                axdom("#" + objID).find(".arrowTop").show();
                axdom("#" + objID).find(".arrowBottom").hide();
                openTB = "top";
            }
        }

        if (css.left != undefined) {
            if ((_box.width.number() + css.left.number()) > pBox.width) {
                var moveLeft = ((_box.width.number() + css.left.number()) - pBox.width) + 5;
                css.left -= moveLeft;
                if (openTB == "top") {
                    axdom("#" + objID).find(".arrowTop").css({ "background-position": (moveLeft + 5) + "px 0px;" });
                } else {
                    axdom("#" + objID).find(".arrowBottom").css({ "background-position": (moveLeft + 5) + "px 0px;" });
                }
            } else {

            }
        } else {

        }
        axdom("#" + objID).css(css);
    },
    contextMenuItemMouseOver: function (event, objSeq, objID) {
        var cfg = this.config;
        var obj = this.objects[objSeq];

        if (this.observer) clearTimeout(this.observer); //닫기 명령 제거

        var menuWidth = obj.width || cfg.width;
        // event target search -
        var eid = event.target.id.split(/_AX_/g);
        var eventTarget = event.target;
        var myTarget = this.getEventTarget({
            evt: eventTarget, evtIDs: eid,
            find: function (evt, evtIDs) { return (axdom(evt).hasClass("contextMenuItem")) ? true : false; }
        });
        // event target search ------------------------    	
        if (myTarget) {
            var poi = myTarget.id.split(/_AX_/g);
            var depth = poi[poi.length - 2];
            if (this.showedItem[depth]) {
                axdom("#" + this.showedItem[depth]).hide();
            }
            if (axdom(myTarget).hasClass("hasSubMenu")) {
                var subMenuTop = axdom("#" + myTarget.id).position().top;
                var css;
                if (this.openTB == "up") {
                    var ph = axdom("#" + myTarget.id).offsetParent().height();
                    var h = axdom("#" + myTarget.id).height();
                    var bottom = ph - subMenuTop - h;
                    css = { top: "auto", bottom: bottom };
                } else {
                    css = { top: subMenuTop };
                }
                if (this.openLR == "left") {
                    //css.left = -(menuWidth - 15);
                    css.left = -(20);
                }
                axdom("#" + myTarget.id + "_AX_subMenu").css(css);
                axdom("#" + myTarget.id + "_AX_subMenu").show();

                this.showedItem[depth] = myTarget.id + "_AX_subMenu";
            }
        }
    },
    contextMenuMouseOut: function (event, objSeq, objID) {
        var close = this._close.bind(this);
        this.observer = setTimeout(function () {
            close(objSeq, objID);
        }, 200);
    }
});
var AXPopOver = new AXPopOverClass();
AXPopOver.setConfig({ theme: "AXPopOver" });

axdom.fn.bindTooltip = function (config) {
    if (config == undefined) config = {};
    AXUtil.each(this, function () {
        var tooltipContent = axdom("#" + this.id + "_AX_tooltip").html();
        AXPopOver.bind({
            id: this.id + "_AX_tooltipobj",
            theme: (config.theme || "AXPopOverTooltip"), // 선택항목
            width: (config.width || ""), // 선택항목
            direction: (config.direction || "top"), // 선택항목
            body: tooltipContent
        });

        axdom(this).bind((config.event || "mouseover"), function () {
            var pos = axdom(this).offset();
            var direction = (config.direction || "top");
            var posTop = pos.top;
            if (direction == "bottom") {
                posTop -= 3;
            } else {
                posTop += axdom(this).outerHeight() + 3;
            }
            AXPopOver.open({ id: this.id + "_AX_tooltipobj", sendObj: {} }, { left: pos.left, top: posTop, handleHeight: (axdom(this).outerHeight().number() + 3) }); // event 직접 연결 방식
        });
        return this;
    });
};
/* ---------------------------------------------- AXContextMenu -- */

/* -- AXMobileModal ---------------------------------------------- */
var AXMobileModal = Class.create(AXJ, {
    version: "AXMobileModal v1.0",
    author: "tom@axisj.com",
    logs: [
        "2013-12-11 오후 5:48:28",
        "2014-04-14 : tom - modalOpen위치 scrollTop 적용"
    ],
    initialize: function (AXJ_super) {
        AXJ_super();
        this.config.theme = "AXMobileModal";
        this.config.width = "auto";
        this.config.height = "auto";
        this.config.margin = "10px";
        this.config.align = "center";
        this.config.valign = "center";
    },
    init: function () {
        var cfg = this.config;

        if (!cfg.head) {
            cfg.head = {};
        }
    },
    open: function (configs, onLoad) {
        var cfg = this.config;
        if (!configs) configs = {};
        var theme = (configs.theme || cfg.theme);
        if (cfg.addClass) {
            theme += " " + cfg.addClass;
        }
        this.modalId = "AXMobileModal" + AXUtil.timekey();
        var modalId = this.modalId;
        var clientWidth = (configs.clientWidth || AXUtil.clientWidth());

        var po = [];
        po.push('<div id="', modalId, '" class="', theme, '" style="left:0px;top:0px;width:100%;height:100%;">');
        po.push('	<div  id="', modalId, '_AX_modal" class="AXMobileModalPanel" style="height:50px;width:50px;left:', (AXUtil.clientWidth() - 50) / 2, 'px;top:', (AXUtil.clientHeight() - 50) / 2,'px;">');
        po.push('		<div  id="', modalId, '_AX_head" class="mobileModalHead">');
        po.push('			<div class="modalTitle">' + (cfg.head.title || "") + '</div>');
        po.push('		</div>');
        if (cfg.head.close) {
            po.push('		<a ' + cfg.href + ' class="mobileModelClose">Close</a>');
        }
        po.push('		<div  id="', modalId, '_AX_body" class="mobileModalBody"></div>');
        po.push('		<div  id="', modalId, '_AX_foot" class="mobileModalFoot"></div>');
        po.push('	</div>');
        po.push('</div>');
        this.jQueryModal = axdom(po.join(''));
        axdom(document.body).append(this.jQueryModal);

        this.modalPanel = this.jQueryModal.find(".AXMobileModalPanel");
        this.modalHead = this.modalPanel.find(".mobileModalHead");
        this.modalBody = this.modalPanel.find(".mobileModalBody");
        this.modalFoot = this.modalPanel.find(".mobileModalFoot");

        this.openConfigs = configs;
        this.setSizeModal(this.openConfigs, onLoad);
        this.modalPanel.find(".mobileModelClose").bind("click", this.close.bind(this));
        this.jQueryModal.bind("click", this.modalClick.bind(this));

        axdom(window).unbind("resize.AXMobileModal").bind("resize.AXMobileModal", this.reposition.bind(this));

        this.opened = true;

        return {
            jQueryModal: this.jQueryModal,
            modalPanel: this.modalPanel,
            modalHead: this.modalHead,
            modalBody: this.modalBody,
            modalFoot: this.modalFoot
        };
    },
    setSizeModal: function (configs, onLoad) {
        var cfg = this.config;
        var cssStyles = {};
        var clientWidth, width, height, left, top, margin, align, valign;
        var modalWidth, modalHeight;
        var clientWidth = this.jQueryModal.innerWidth();
        var clientHeight = AXUtil.clientHeight();
        var width = (configs.width || cfg.width);
        var height = (configs.height || cfg.height);
        var margin = (configs.margin || cfg.margin);
        var align = (configs.align || cfg.align);
        var valign = (configs.valign || cfg.valign);

        this.openModalAttr = {
            width:width, height:height, margin:margin, align:align, valign:valign
        };

        if (width == "auto") {
            if (margin.right(1) == "%") {
                modalWidth = clientWidth * (100 - margin.number() * 2) / 100;
            } else {
                modalWidth = clientWidth - margin.number() * 2;
            }
        } else {
            modalWidth = width;
        }
        left = (clientWidth - modalWidth) / 2;

        if (height == "auto") {
            if (margin.right(1) == "%") {
                modalHeight = clientHeight * (100 - margin.number() * 2) / 100;
            } else {
                modalHeight = clientHeight - margin.number() * 2;
            }
        } else {
            modalHeight = height;
        }
        top = (clientHeight - modalHeight) / 2;

        if (left < 0) left = margin;
	    if (top < -5) top = -5;

        var cssStylesStart = {
            left: (axf.clientWidth() - (modalWidth*0.8)) / 2,
            top: (axf.clientHeight() - (modalHeight*0.8)) / 2,
            width: (modalWidth*0.8),
            height: (modalHeight*0.8)
        };
        this.modalPanel.css(cssStylesStart);

        cssStyles.left = left;
        cssStyles.top = top;
        cssStyles.width = modalWidth;
        cssStyles.height = modalHeight;
        mask.open();

        var returnObj = {
            jQueryModal: this.jQueryModal,
            modalPanel: this.modalPanel,
            modalHead: this.modalHead,
            modalBody: this.modalBody,
            modalFoot: this.modalFoot
        };

        if(AXUtil.browser.name == "android"){
            //alert(AXUtil.browser.version);
            this.modalPanel.css(cssStyles);
            if(onLoad){
                onLoad.call(returnObj, returnObj);
            }
        }else{
            this.modalPanel.animate(cssStyles, 300, "expoOut", function () {
                if(onLoad){
                    onLoad.call(returnObj, returnObj);
                }
            });
        }
    },
    modalClick: function(event){
        var cfg = this.config;
        if(event.target.id == this.modalId){
            this.close();
        }
    },
    close: function () {
        var cfg = this.config;
        mask.close();

        var modalWidth, modalHeight;
        modalWidth = this.modalPanel.width();
        modalHeight = this.modalPanel.height();

        var cssStylesStart = {
            left: (AXUtil.clientWidth() - (modalWidth*0.8)) / 2,
            top: (AXUtil.clientHeight() - (modalHeight*0.8)) / 2,
            width: (modalWidth*0.8),
            height: (modalHeight*0.8),
            opacity:0
        };
        var remove = this.remove.bind(this);
        this.modalPanel.animate(cssStylesStart, 300, "expoOut", function () {
            remove();
            if (cfg.onclose) {
                cfg.onclose();
            }
        });
        this.modalPanel.empty();
        //this.jQueryModal.fadeOut();
        //this.remove();
        /*

         remove.delay(0.01);
         */
        this.opened = false;
        axdom(window).unbind("resize.AXMobileModal");
    },
    remove: function () {
        var cfg = this.config;
        this.jQueryModal.remove();
    },
    reposition: function(){
        var cfg = this.config;

        var clientWidth = AXUtil.clientWidth();
        var clientHeight = AXUtil.clientHeight();
        this.jQueryModal.css({width:clientWidth, height:clientHeight});

        var modalWidth, modalHeight, left, top;
        var width = this.openModalAttr.width;
        var height = this.openModalAttr.height;
        var margin = this.openModalAttr.margin;
        var align = this.openModalAttr.align;
        var valign = this.openModalAttr.valign;
        var cssStyles = {};

        if (width == "auto") {
            if (margin.right(1) == "%") {
                modalWidth = clientWidth * (100 - margin.number() * 2) / 100;
            } else {
                modalWidth = clientWidth - margin.number() * 2;
            }
        } else {
            modalWidth = width;
        }
        left = (clientWidth - modalWidth) / 2;

        if (height == "auto") {
            if (margin.right(1) == "%") {
                modalHeight = clientHeight * (100 - margin.number() * 2) / 100;
            } else {
                modalHeight = clientHeight - margin.number() * 2;
            }
        } else {
            modalHeight = height;
        }
        top = (clientHeight - modalHeight) / 2;

        if (left < 0) left = margin;
        if (top < -5) top = -5;

        cssStyles.left = left;
        cssStyles.top = top;
        cssStyles.width = modalWidth;
        cssStyles.height = modalHeight;

        this.modalPanel.css(cssStyles);
    }
});
/* ---------------------------------------------- AXMobileModal -- */

/* -- jQuery easing plugin ---------------------------------------------- */
axdom.extend(true, {
    easing: {
        backIn: function (p, n, f, d) { var c = f + d; var s = 1.70158; return c * (p /= 1) * p * ((s + 1) * p - s) + f; },
        backOut: function (p, n, f, d) { var c = f + d; var s = 1.70158; return c * ((p = p / 1 - 1) * p * ((s + 1) * p + s) + 1) + f; },
        backInOut: function (p, n, f, d) { var c = f + d; var s = 1.70158; if ((p /= 0.5) < 1) return c / 2 * (p * p * (((s *= (1.525)) + 1) * p - s)) + f; else return c / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2) + f; },
        bounceIn: function (p, n, f, d) { var c = f + d; var inv = this.bounceOut(1 - p, 1, 0, d); return c - inv + f; },
        bounceOut: function (p, n, f, d) { var c = f + d; if (p < (1 / 2.75)) return c * (7.5625 * p * p) + f; else if (p < (2 / 2.75)) return c * (7.5625 * (p -= (1.5 / 2.75)) * p + .75) + f; else if (p < (2.5 / 2.75)) return c * (7.5625 * (p -= (2.25 / 2.75)) * p + .9375) + f; else return c * (7.5625 * (p -= (2.625 / 2.75)) * p + .984375) + f; },
        circIn: function (p, n, f, d) { var c = f + d; return -c * (Math.sqrt(1 - (p /= 1) * p) - 1) + f; },
        circOut: function (p, n, f, d) { var c = f + d; return c * Math.sqrt(1 - (p = p / 1 - 1) * p) + f; },
        circInOut: function (p, n, f, d) { var c = f + d; if ((p /= 0.5) < 1) return -c / 2 * (Math.sqrt(1 - p * p) - 1) + f; else return c / 2 * (Math.sqrt(1 - (p -= 2) * p) + 1) + f; },
        cubicIn: function (p, n, f, d) { var c = f + d; return c * (p /= 1) * p * p + f; },
        cubicOut: function (p, n, f, d) { var c = f + d; return c * ((p = p / 1 - 1) * p * p + 1) + f; },
        cubicInOut: function (p, n, f, d) { var c = f + d; if ((p /= 0.5) < 1) return c / 2 * p * p * p + f; else return c / 2 * ((p -= 2) * p * p + 2) + f; },
        elasticIn: function (p, n, f, d) { var c = f + d; if (p == 0) return f; if (p == 1) return c; var peroid = 0.25; var s; var amplitude = c; if (amplitude < Math.abs(c)) { amplitude = c; s = peroid / 4; } else { s = peroid / (2 * Math.PI) * Math.asin(c / amplitude); } return -(amplitude * Math.pow(2, 10 * (p -= 1)) * Math.sin((p * 1 - s) * (2 * Math.PI) / peroid)) + f; },
        elasticOut: function (p, n, f, d) { var c = f + d; if (p == 0) return f; if (p == 1) return c; var peroid = 0.25; var s; var amplitude = c; if (amplitude < Math.abs(c)) { amplitude = c; s = peroid / 4; } else { s = peroid / (2 * Math.PI) * Math.asin(c / amplitude); } return -(amplitude * Math.pow(2, -10 * p) * Math.sin((p * 1 - s) * (2 * Math.PI) / peroid)) + c; },
        expoIn: function (p, n, f, d) { var c = f + d; return (p == 0) ? f : c * Math.pow(2, 10 * (p - 1)) + f - c * 0.001; },
        expoOut: function (p, n, f, d) { var c = f + d; return (p == 1) ? c : d * 1.001 * (-Math.pow(2, -10 * p) + 1) + f; },
        expoInOut: function (p, n, f, d) { var c = f + d; if (p == 0) return f; if (p == 1) return c; if ((p /= 0.5) < 1) return c / 2 * Math.pow(2, 10 * (p - 1)) + f - c * 0.0005; else return c / 2 * 1.0005 * (-Math.pow(2, -10 * --p) + 2) + f; },
        quadIn: function (p, n, f, d) { var c = f + d; return c * (p /= 1) * p + f; },
        quadOut: function (p, n, f, d) { var c = f + d; return -c * (p /= 1) * (p - 2) + f; },
        quadInOut: function (p, n, f, d) { var c = f + d; if ((p /= 0.5) < 1) return c / 2 * p * p + f; else return -c / 2 * ((--p) * (p - 2) - 1) + f; },
        quartIn: function (p, n, f, d) { var c = f + d; return c * (p /= 1) * p * p * p + f; },
        quartOut: function (p, n, f, d) { var c = f + d; return -c * ((p = p / 1 - 1) * p * p * p - 1) + f; },
        quartInOut: function (p, n, f, d) { var c = f + d; if ((p /= 0.5) < 1) return c / 2 * p * p * p * p + f; else return -c / 2 * ((p -= 2) * p * p * p - 2) + f; },
        quintIn: function (p, n, f, d) { var c = f + d; return c * (p /= 1) * p * p * p * p + f; },
        quintOut: function (p, n, f, d) { var c = f + d; return c * ((p = p / 1 - 1) * p * p * p * p + 1) + f; },
        quintInOut: function (p, n, f, d) { var c = f + d; if ((p /= 0.5) < 1) return c / 2 * p * p * p * p * p + f; else return c / 2 * ((p -= 2) * p * p * p * p + 2) + f; },
        sineIn: function (p, n, f, d) { var c = f + d; return -c * Math.cos(p * (Math.PI / 2)) + c + f; },
        sineOut: function (p, n, f, d) { var c = f + d; return c * Math.sin(p * (Math.PI / 2)) + f; },
        sineInOut: function (p, n, f, d) { var c = f + d; return -c / 2 * (Math.cos(Math.PI * p) - 1) + f; }
    }
});
/* ---------------------------------------------- jQuery easing plugin -- */

/* -- jQuery misc plugin ----------------------------------------------*/
axdom.fn.scrollToDiv = function (margin, boxDim, leftScroll) {
    var pElement = this.offsetParent();
    var pBox = { width: pElement.width(), height: pElement.height() };
    if (boxDim) {
        if (boxDim.width > 0) pBox.width = boxDim.width;
        if (boxDim.height > 0) pBox.height = boxDim.height;
    }
    var pos = this.position();
    if (!pos) return;
    if (margin) var m = { left: margin.left || 0, top: margin.top || 0, right: margin.right || 0, bottom: margin.bottom || 0 };
    else var m = { left: 0, top: 0, right: 0, bottom: 0 };
    var ePos = { left: pos.left + this.outerWidth(), top: pos.top + this.outerHeight() };
    var pEbox = { width: pBox.width - m.right, height: pBox.height - m.bottom }
    var pES = { left: pElement.scrollLeft(), top: pElement.scrollTop() }

    if (ePos.top > pEbox.height) {
        pElement.scrollTop(ePos.top - pEbox.height + pES.top + 1);
    } else if ((ePos.top - this.outerHeight() - m.top) < 0) {
        pElement.scrollTop(pES.top + (ePos.top - this.outerHeight() - m.top));
    } else {
        if (pElement[0].tagName == "BODY")
            window.scroll(0, pES.top + (ePos.top - m.top));
    }
    if (leftScroll) {
        if (ePos.left > pEbox.width) {
            pElement.scrollLeft(ePos.left - pEbox.width + pES.left + 1);
        } else if ((ePos.left - this.outerWidth() - m.left) < 0) {
            pElement.scrollLeft(pES.left + (ePos.left - this.outerWidth() - m.left));
        }
    }
    return this;
};

// jQuery misc plugin
var __r20 = /%20/g,
    __rbracket = /\[\]$/,
    __rCRLF = /\r?\n/g,
    __rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    __rselectTextarea = /^(?:select|textarea)/i;

axdom.fn.extend({
    serializeObject: function () {

        var myArray = this.map(function () {
            return this.elements ? axdom.makeArray(this.elements) : this;
        })
            .filter(function () {
                return this.name && !this.disabled &&
                    (this.checked || __rselectTextarea.test(this.nodeName) ||
                        __rinput.test(this.type));
            })
            .map(function (i, elem) {
                var val = axdom(this).val();
                //(elem.title || elem.placeholder || "")  //ie에서는 placeholder를 인식하지못함
                var label = (axdom(elem).attr("title") || axdom(elem).attr("placeholder") || "");
                return val == null ?
                    null :
                    axdom.isArray(val) ?
                        axdom.map(val, function (val, i) {
                            return { id: elem.id, name: elem.name, type: elem.type, value: val.replace(__rCRLF, "\r\n"), label: label };
                        }) :
                    { id: elem.id, name: elem.name, type: elem.type, value: val.replace(__rCRLF, "\r\n"), label: label };

            }).get();
        return myArray;
    }
});

axdom(document.body).ready(function () {
    axdom("input[type=text]").bind("mousedown", function () { this.focus(); });
    axdom("textarea").bind("mousedown", function () { this.focus(); });
});

axdom.fn.endFocus = function () {
    var elem = this;
    var elemLen = elem.val().length;
    if (elemLen == 0) {
        elem.focus();
        return;
    }
    // For IE Only
    if (document.selection) {
        // Set focus
        elem.focus();
        elem.val(elem.val());
    }
    else if (document.selection == undefined || elem.selectionStart || elem.selectionStart == '0') {
        // Firefox/Chrome
        elem.focus().val(elem.val());
    } // if
};

// jquery event extend for mobile
var rkeyEvent = /^key/;
var rmouseEvent = /^(?:mouse|contextmenu)|click/;
axf.each(("touchstart touchmove touchend").split(" "), function (i, name) {
    axdom.fn[name] = function (data, fn) {
        if (fn == null) { fn = data; data = null; }
        return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
    if (rkeyEvent.test(name)) { axdom.event.fixHooks[name] = axdom.event.keyHooks; }
    if (rmouseEvent.test(name)) { axdom.event.fixHooks[name] = axdom.event.mouseHooks; }
});

/*
 axdom.fn.longpress = function (fn) {
 AXUtil.each(this, function () {
 return this;
 });
 };
*/
axdom.fn.setCaret = function (pos) {
    var input = this[0];
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(pos, pos);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    } else if(input.selectionStart){
        input.focus();
        input.selectionStart = pos;
        input.selectionEnd = pos;
    }
};