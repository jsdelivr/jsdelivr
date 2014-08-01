/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXDrag = Class.create(AXJ, {
    version: "AXJDrag V1.2",
	author: "tom@axisj.com",
	logs: [
		"2013-08-21 오후 11:47:11 - modsAX 변환",
		"2013-12-17 오후 4:56:13 - multiselect 와 호환성 작업"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.config.dragBoxClassName = "AXJDragBox";
        this.config.bedragClassName = "bedraged";
        this.config.bedropClassName = "bedroped";
        this.config.dragClassName = "readyDrag";
        this.config.dropClassName = "readyDrop";
        this.config.sort = false;
        this.sortOn = false;
        this.config.moveSens = 5;
        this.moveSens = 0;
        this.config.scrollPos = true;
    },
    /* ------------------------------------------------------------------------------------------------------------------ */
    /* init ~~~~~~ */
    init: function() {
        this.draged = false;
        //this.dragBox = new Element('div', { 'class':this.config.dragBoxClassName});
        this.dragBox = jQuery("<div class='" + this.config.dragBoxClassName + "'></div>");
        this.dragBox.html("<div class=\"boxshadow\"></div><div class=\"boxicon\"></div><div class=\"boxcounter\">0</div>");

        if (this.config.sort) {
            this.sorter = jQuery(this.config.sort.sorter);
        }

        var mouseMove = this.onmouseMove.bind(this);
        this.dragBox.bind("mousemove", function(event) {
            mouseMove(this, event);
        });
        this.dragCount = this.dragBox.find("div.boxcounter");
        this.dragBoxDim = {};
        this.dragItem = [];
        //ready dragBox

        if (this.config.multiSelector) { //AXJMselect init
        	this.mselector = new AXMultiSelect();
        	this.config.multiSelector.useHelper = false;
            this.mselector.setConfig(this.config.multiSelector);
        }
    },
    active: function() {
        this.mouseDown = this.onmouseDown.bind(this);
        this.dragStart = this.ondragStart.bind(this);

        jQuery("#" + this.config.dragStage).bind("mousedown", this.mouseDown);
        jQuery("#" + this.config.dragStage).bind("dragstart", this.dragStart);
    },
    draging: function(power) {
        if (power) {
            this.draging(false);
            this.mouseMove = this.onmouseMove.bind(this);
            this.mouseOver = this.onmouseOver.bind(this);
            this.mouseOut = this.onmouseOut.bind(this);
            this.mouseUp = this.onmouseUp.bind(this);
            this.selectstart = this.onselectStart.bind(this);
            this.keyUp = this.onkeyUp.bind(this);
            jQuery("#" + this.config.dragStage).bind("mousemove", this.mouseMove);
            jQuery("#" + this.config.dragStage).bind("mouseover", this.mouseOver);
            jQuery("#" + this.config.dragStage).bind("mouseout", this.mouseOut);
            jQuery(document).bind("mouseup", this.mouseUp);
            jQuery(document).bind("selectstart", this.selectstart);
            jQuery(document).bind("keyup", this.keyUp);
            jQuery("#" + this.config.dragStage).addClass("AXJSelectNone");
            //alert("x");
        } else {
            if (this.mouseMove) jQuery("#" + this.config.dragStage).unbind('mousemove', this.mouseMove);
            if (this.mouseOver) jQuery("#" + this.config.dragStage).unbind('mouseover', this.mouseOver);
            if (this.mouseUp) jQuery(document).unbind("mouseup", this.mouseup);
            if (this.selectstart) jQuery(document).unbind("selectstart", this.selectstart);
            if (this.keyUp) jQuery(document).unbind("keyup", this.keyup);
            jQuery("#" + this.config.dragStage).removeClass("AXJSelectNone");
            //alert("y");
        }
    },
    inactive: function() {
        if (this.mouseDown) jQuery("#" + this.config.dragStage).unbind('mousedown', this.mouseDown);
        if (this.dragStart) jQuery("#" + this.config.dragStage).unbind('dragstart', this.dragStart);
    },
    /* ------------------------------------------------------------------------------------------------------------------ */
    /* on observe method ~~~~~~ */
    onmouseDown: function(event) {

        if (event.button == 2) return;
        var eventTarget = event.target;

        if (eventTarget) {
            while (!axdom(eventTarget).hasClass(this.config.dragClassName)) {
                if (eventTarget.parentNode) eventTarget = eventTarget.parentNode;
                else break;
            }
        }
        if (!jQuery(eventTarget).hasClass(this.config.dragClassName)) return;

        var dragElement = eventTarget;
        if (dragElement) {
            if (AXUtil.browser.name == "moz") {
                this.dragParent = jQuery(dragElement).parent();
                if (this.dragParent.css("overflow") == "visible") {
                    this.dragParent = null;
                }
            }

            if (this.config.multiSelector) {
            	if (event.shiftKey || event.metaKey || event.ctrlKey) {
            		
            	}else{
            		this.mselector.clickSelects(dragElement);
            	}
            	this.dragReady();
            } else {
            	this.dragReady([dragElement]);
            }
        }
    },
    ondragStart: function(event) {
        event.stopPropagation(); // disable  event
        return false;
    },
    onselectStart: function(event) {
        event.stopPropagation();
        return false;
    },
    onmouseUp: function(event) {
        var dropElement;
        var eventTarget;

        if (this.config.sort) {
            eventTarget = event.target;
            if (eventTarget) {
                while (!axdom(eventTarget).hasClass(this.config.dragClassName)) {

                    if (eventTarget.parentNode) eventTarget = eventTarget.parentNode;
                    else break;
                }
            }
            var isSort = jQuery(eventTarget).hasClass(this.config.dragClassName);
        }

        if (!isSort) { //소트타입이 아니라면
            eventTarget = event.target;
            var isDrop = jQuery(eventTarget).hasClass(this.config.dropClassName);
        }

        if (isSort) {
            if (eventTarget && this.draged) {
                if (this.config.onSort) this.config.onSort({ dragItem: this.dragItem, sortItem: eventTarget });
                this.endSort();
            }
        } else if (isDrop) {
            if (eventTarget && this.draged) {
                jQuery(eventTarget).removeClass(this.config.bedropClassName);
                if (this.config.onDrop) this.config.onDrop({ dragItem: this.dragItem, dropItem: eventTarget });
            }
        }

        this.draging(false);
        this.endDrag();
    },
    onkeyUp: function(event) {

    },
    onmouseMove: function(event) {
        if (!event.pageX) return;

        if (this.config.scrollPos) {
            if (document.body.scrollTop == 0) {
                var st = document.documentElement.scrollTop;
                var sl = document.documentElement.scrollLeft;
            } else {
                var st = document.body.scrollTop;
                var sl = document.body.scrollLeft;
            }
            this.mouse = { x: (event.pageX - sl) || 0, y: (event.pageY - st) || 0 }; //Event.pointer(event);
        } else {
            this.mouse = { x: event.pageX || 0, y: event.pageY || 0 }; //Event.pointer(event);
        }
        //드래그 감도 적용
        if (this.config.moveSens > this.moveSens) this.moveSens++;
        if (this.moveSens == this.config.moveSens) this.dragboxMove();
    },
    onmouseOver: function(event) {
        var eventTarget;

        if (this.config.sort) {
            eventTarget = event.target;
            if (eventTarget) {
                while (!axdom(eventTarget).hasClass(this.config.dragClassName)) {

                    if (eventTarget.parentNode) eventTarget = eventTarget.parentNode;
                    else break;
                }
            }
            var isSort = jQuery(eventTarget).hasClass(this.config.dragClassName);
        }

        if (!isSort) { //소트타입이 아니라면
            eventTarget = event.target;
            var isDrop = jQuery(eventTarget).hasClass(this.config.dropClassName);
        }

        if (isDrop) {
            if (eventTarget) jQuery(eventTarget).addClass(this.config.bedropClassName);
            this.endSort();
        } else if (isSort) {
            if (eventTarget) this.startSort(eventTarget);
        } else {
            if (this.sortOn) this.endSort();
        }
    },
    onmouseOut: function(event) {
        if (!jQuery(event.target).hasClass(this.config.dropClassName)) return;
        var dropElement = event.target;
        if (dropElement) {
            jQuery(dropElement).removeClass(this.config.bedropClassName);
        }
    },
    startSort: function(target) {
        jQuery(target).before(this.sorter);
        this.sortOn = true;
    },
    endSort: function() {
        if (this.sortOn) {
            jQuery(this.sorter).detach();
        }
        if (this.config.onStopDrag) this.config.onStopDrag({ dragItem: this.dragItem });
    },
    dragboxMove: function() {
        if (!this.draged) {
            this.draged = true;
            if (this.dragParent) this.dragParent.css({ "overflow": "hidden" });
            var bedragClassName = this.config.bedragClassName;
            if (this.config.appendTarget)
                jQuery("#" + this.config.appendTarget).append(this.dragBox);
            else
                jQuery("#" + this.config.dragStage).after(this.dragBox);

            this.dragBoxDim = { width: this.dragBox.width(), height: this.dragBox.height() }; //.getDimensions();
            this.dragCount.html(this.dragItem.length);
            this.dragTrigger();
            //draged dragItem
            jQuery(this.dragItem).addClass(bedragClassName);
        }

        this.dragBox.css({ left: this.mouse.x + (20) + "px", top: this.mouse.y + (20) + "px" });
    },
    endDrag: function() {
        if (this.draged) {
            if (this.dragParent) this.dragParent.css({ "overflow": "auto" });

            var bedragClassName = this.config.bedragClassName;
            this.draged = false;
            this.dragBox.detach();
            this.endSort();
            //undraged dragItem
            jQuery(this.dragItem).removeClass(bedragClassName);
            if (this.config.multiSelector) this.mselector.clearSelects();
            else this.dragItem.clear();
            this.moveSens = 0;
        }
    },
    /* ------------------------------------------------------------------------------------------------------------------ */
    /* class method ~~~~~~ */
    dragReady: function(dragItems) {
        if (this.config.multiSelector) this.dragItem = this.mselector.getSelects();
        else this.dragItem = dragItems;
        this.draging(true);
    },
    dragTrigger: function() {
        if (this.config.onDrag) this.config.onDrag({ dragItem: this.dragItem });
    },
    collectItem: function() {
        if (this.config.multiSelector) {
            if (this.observer) clearTimeout(this.observer);
            this.observer = setTimeout(this.collectItemAct.bind(this), 100);
        }
    },
    collectItemAct: function() {
        this.mselector.collect();
    },
    nothing: function() {

    }
});