/***************************************************************************************************
PopupWindow - The ultimate popup/dialog/modal jQuery plugin
    Author          : Gaspare Sganga
    Version         : 1.0.3
    License         : MIT
    Documentation   : http://gasparesganga.com/labs/jquery-popup-window/
***************************************************************************************************/
(function($, undefined){
    // Default Settings
    var _defaults = {
        title               : "Popup Window",
        modal               : true,
        autoOpen            : true,
        animationTime       : 300,
        customClass         : "",
        
        buttons             : {
            close               : true,
            maximize            : true,
            collapse            : true,
            minimize            : true
        },
        buttonsPosition     : "right",
        buttonsTexts        : {
            close               : "Close",
            maximize            : "Maximize",
            unmaximize          : "Restore",
            minimize            : "Minimize",
            unminimize          : "Show",
            collapse            : "Collapse",
            uncollapse          : "Expand"
        }, 
        
        draggable           : true,
        dragOpacity         : 0.6,
        
        resizable           : true,
        resizeOpacity       : 0.6,
        
        statusBar           : true,
        
        top                 : "auto",
        left                : "auto",
        
        height              : 200,
        width               : 400,
        maxHeight           : undefined,
        maxWidth            : undefined,
        minHeight           : 100,
        minWidth            : 200,
        collapsedWidth      : undefined,
        
        keepInViewport      : true,
        mouseMoveEvents     : true
    };
    
    // Required CSS
    var _css = {
        container : {
            "box-sizing"        : "border-box",
            "position"          : "fixed",
            "top"               : "0",
            "bottom"            : "0",
            "right"             : "0",
            "left"              : "0",
            "display"           : "flex",
            "justify-content"   : "flex-start",
            "align-content"     : "flex-start",
            "pointer-events"    : "none"
        },
        overlay : {
            "box-sizing"        : "border-box",
            "position"          : "fixed",
            "top"               : "0",
            "left"              : "0",
            "width"             : "100%",
            "height"            : "100%"
        },
        minplaceholder : {
            "box-sizing"        : "border-box",
            "background"        : "transparent",
            "border"            : "none"
        },
        popupwindow : {
            "box-sizing"        : "border-box",
            "display"           : "flex",
            "flex-flow"         : "column nowrap",
            "position"          : "absolute",
            "padding"           : "0",
            "pointer-events"    : "auto"
        },
        titlebar : {
            "box-sizing"        : "border-box",
            "flex"              : "0 0 auto",
            "display"           : "flex",
            "align-items"       : "center"
        },
        titlebar_text : {
            "box-sizing"        : "border-box",
            "flex"              : "1 1 auto",
            "overflow"          : "hidden",
            "text-overflow"     : "ellipsis",
            "white-space"       : "nowrap"
        },
        titlebar_button : {
            "box-sizing"        : "border-box",
            "flex"              : "0 0 auto",
            "display"           : "flex"
        },
        content : {
            "flex"              : "1 1 auto",
            "overflow"          : "auto"
        },
        statusbar : {
            "box-sizing"        : "border-box",
            "flex"              : "0 0 auto",
            "display"           : "flex",
            "align-items"       : "flex-end"
        },
        statusbar_content : {
            "box-sizing"        : "border-box",
            "flex"              : "1 1 auto",
            "overflow"          : "hidden",
            "text-align"        : "left",
            "text-overflow"     : "ellipsis",
            "white-space"       : "nowrap"
        },
        statusbar_handle : {
            "box-sizing"        : "border-box",
            "display"           : "flex"
        },
        statusbar_handle_resizable : {
            "cursor"            : "se-resize"
        },
        resizer_top : {
            "position"          : "absolute",
            "left"              : "0",
            "right"             : "0",
            "cursor"            : "n-resize"
        },
        resizer_bottom : {
            "position"          : "absolute",
            "left"              : "0",
            "right"             : "0",
            "cursor"            : "s-resize"
        },
        resizer_left : {
            "position"          : "absolute",
            "top"               : "0",
            "bottom"            : "0",
            "cursor"            : "e-resize"
        },
        resizer_right : {
            "position"          : "absolute",
            "top"               : "0",
            "bottom"            : "0",
            "cursor"            : "w-resize"
        },
        resizer_topleft : {
            "position"          : "absolute",
            "cursor"            : "nw-resize"
        },
        resizer_topright : {
            "position"          : "absolute",
            "cursor"            : "ne-resize"
        },
        resizer_bottomleft : {
            "position"          : "absolute",
            "cursor"            : "ne-resize"
        },
        resizer_bottomright : {
            "position"          : "absolute",
            "cursor"            : "nw-resize"
        }
    };
    
    // Icons
    var _icons = {
        close           : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g><line y2="0" x2="10" y1="10" x1="0"/><line y2="10" x2="10" y1="0" x1="0"/></g></svg>',
        collapse        : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g fill="none"><polyline points="1,7 9,7 5,2 1,7 9,7"/></g></svg>',
        uncollapse      : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g fill="none"><polyline points="1,3 9,3 5,8 1,3 9,3"/></g></svg>',
        maximize        : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g fill="none"><rect x="1" y="1" height="8" width="8"/></g></svg>',
        unmaximize      : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g fill="none"><rect x="1" y="3" height="6" width="6"/><line y1="3" x1="3" y2="1" x2="3"/><line y1="1" x1="2.5" y2="1" x2="9.5"/><line y1="1" x1="9" y2="7" x2="9"/><line y1="7" x1="9.5" y2="7" x2="7"/></g></svg>',
        minimize        : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g><line y1="6" x1="8" y2="6" x2="2"/></g></svg>',
        resizeHandle    : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10" height="100%" width="100%"><g><line y2="0" x2="10" y1="10" x1="0"/><line y2="2" x2="12" y1="12" x1="2"/><line y2="4" x2="14" y1="14" x1="4"/></g></svg>'
    };
    
    // Constants
    var _constants = {
        resizersWidth                   : 4,
        secondaryAnimationTimeFactor    : 3
    };
    
    // Main Container
    var _mainContainer;
    
    // Minimized Area
    var _minimizedArea = {
        position    : "bottom left",
        direction   : "horizontal"
    };
    
    
    // **************************************************
    //  METHODS
    // **************************************************
    $.PopupWindowSetup = function(options){
        $.extend(true, _defaults, options);
    };
    
    $.PopupWindowMinimizedArea = function(options){
        if (options === undefined) return $.extend({}, _minimizedArea);
        if (options.position) _minimizedArea.position = ((options.position.toLowerCase().indexOf("b") >= 0) ? "bottom" : "top") + " " + ((options.position.toLowerCase().indexOf("l") >= 0) ? "left" : "right");
        if (options.direction) _minimizedArea.direction = (options.direction.toLowerCase().indexOf("h") >= 0) ? "horizontal" : "vertical";
        _SetMinimizedArea();
    };

    $.fn.PopupWindow = function(opt1, opt2){
        if (typeof opt1 == "string") {
            switch (opt1.toLowerCase()) {
                case "init":
                    return this.each(function(){
                        _Init($(this), opt2);
                    });
                case "open":
                    return this.each(function(){
                        _Open($(this).closest(".popupwindow"));
                    });
                case "close":
                    return this.each(function(){
                        _Close($(this).closest(".popupwindow"));
                    });
                case "maximize":
                    return this.each(function(){
                        _Maximize($(this).closest(".popupwindow"));
                    });
                case "unmaximize":
                    return this.each(function(){
                        _Unmaximize($(this).closest(".popupwindow"));
                    });
                case "collapse":
                    return this.each(function(){
                        _Collapse($(this).closest(".popupwindow"));
                    });
                case "uncollapse":
                    return this.each(function(){
                        _Uncollapse($(this).closest(".popupwindow"));
                    });
                case "minimize":
                    return this.each(function(){
                        _Minimize($(this).closest(".popupwindow"));
                    });
                case "unminimize":
                    return this.each(function(){
                        _Unminimize($(this).closest(".popupwindow"));
                    });
                case "getposition":
                    if (!this[0]) return undefined;
                    return _GetCurrentPosition($(this[0]).closest(".popupwindow"));
                case "setposition":
                   return this.each(function(){
                        _ChangePosition($(this).closest(".popupwindow"), $.extend({}, opt2, {
                            check   : true,
                            event   : true
                        }), true);
                    });
                case "getsize":
                    if (!this[0]) return undefined;
                    return _GetCurrentSize($(this[0]).closest(".popupwindow"));
                case "setsize":
                    return this.each(function(){
                        _ChangeSize($(this).closest(".popupwindow"), $.extend({}, opt2, {
                            checkSize       : true,
                            checkPosition   : true,
                            event           : true
                        }), true);
                    });
                case "getstate":
                    if (!this[0]) return undefined;
                    return _GetState($(this[0]).closest(".popupwindow"));
                case "setstate":
                    return this.each(function(){
                        _SetState($(this).closest(".popupwindow"), opt2);
                    });
                case "settitle":
                    return this.each(function(){
                        _SetTitle($(this).closest(".popupwindow"), opt2);
                    });
                case "statusbar":
                    return this.each(function(){
                        _StatusBar($(this).closest(".popupwindow"), opt2);
                    });
                case "destroy":
                    return this.each(function(){
                        _Destroy($(this).closest(".popupwindow"));
                    }); 
            }
        } else {
            return this.each(function(){
                _Init($(this), opt1);
            });
        }
    };
    
    
    // **************************************************
    //  FUNCTIONS
    // **************************************************
    function _Init(originalTarget, options){
        if (originalTarget.closest(".popupwindow").length) {
            _Warning("jQuery PopupWindow is already initialized on this element");
            return;
        }
        var settings = $.extend(true, {}, _defaults, options);
        settings.animationTime  = parseInt(settings.animationTime, 10);
        settings.height         = parseInt(settings.height, 10);
        settings.width          = parseInt(settings.width, 10);
        settings.maxHeight      = parseInt(settings.maxHeight, 10) || 0;
        settings.maxWidth       = parseInt(settings.maxWidth, 10) || 0;
        settings.minHeight      = parseInt(settings.minHeight, 10) || 0;
        settings.minWidth       = parseInt(settings.minWidth, 10) || 0;
        
        // Overlay
        var overlay = $("<div>", {
            class   : "popupwindow_overlay"
        })
        .css(_css.overlay)
        .appendTo(_mainContainer);
        if (settings.modal) overlay.css("pointer-events", "auto");
        
        // Minimized Placeholder
        var minPlaceholder = $("<div>", {
            class   : "popupwindow_minplaceholder"
        })
        .css(_css.minplaceholder)
        .hide()
        .appendTo(_mainContainer);
        
        // Popup Window
        var position    = {
            left    : (settings.left == "auto") ? ((overlay.width() - settings.width) / 2) : parseInt(settings.left, 10),
            top     : (settings.top == "auto") ? ((overlay.height() - settings.height) / 2) : parseInt(settings.top, 10)
        };
        var popupWindow = $("<div>", {
            class   : "popupwindow",
            css     : {
                height  : settings.height,
                left    : position.left,
                top     : position.top,
                width   : settings.width
            }
        })
        .css(_css.popupwindow)
        .addClass(settings.customClass)
        .data({
            originalTarget      : originalTarget,
            originalParent      : originalTarget.parent(),
            overlay             : overlay,
            minPlaceholder      : minPlaceholder,
            settings            : settings,
            opened              : false,
            collapsed           : false,
            minimized           : false,
            maximized           : false,
            currentPosition     : position,
            currentSize         : {
                height  : settings.height,
                width   : settings.width
            },
            savedPosition       : undefined,
            savedSize           : undefined
        })
        .on("mousedown", ".popupwindow_titlebar_draggable", _Titlebar_MouseDown)
        .appendTo(overlay);
        
        // Titlebar
        var leftToRight = (settings.buttonsPosition.toLowerCase().indexOf("l") < 0);
        var titlebar = $("<div>", {
            class   : "popupwindow_titlebar"
        })
        .css(_css.titlebar)
        .appendTo(popupWindow);
        if (settings.draggable) titlebar.addClass("popupwindow_titlebar_draggable");
        
        // Text
        $("<div>", {
            class   : "popupwindow_titlebar_text",
            text    : settings.title
        })
        .css(_css.titlebar_text)
        .css("order", leftToRight ? 1 : 5)
        .appendTo(titlebar);
        
        // Buttons
        if (settings.buttons.close) {
            $("<div>", {
                class   : "popupwindow_titlebar_button popupwindow_titlebar_button_close"
            })
            .css(_css.titlebar_button)
            .css("order", leftToRight ? 5 : 1)
            .attr("title", settings.buttonsTexts.close)
            .on("click", _ButtonClose_Click)
            .append(_icons.close)
            .appendTo(titlebar);
        }
        if (settings.buttons.maximize) {
            $("<div>", {
                class   : "popupwindow_titlebar_button popupwindow_titlebar_button_maximize"
            })
            .css(_css.titlebar_button)
            .css("order", leftToRight ? 4 : 2)
            .attr("title", settings.buttonsTexts.maximize)
            .on("click", _ButtonMax_Click)
            .append(_icons.maximize)
            .appendTo(titlebar);
        }
        if (settings.buttons.collapse) {
            $("<div>", {
                class   : "popupwindow_titlebar_button popupwindow_titlebar_button_collapse"
            })
            .css(_css.titlebar_button)
            .css("order", leftToRight ? 3 : 3)
            .attr("title", settings.buttonsTexts.collapse)
            .on("click", _ButtonCollapse_Click)
            .append(_icons.collapse)
            .appendTo(titlebar);
        }
        if (settings.buttons.minimize) {
            $("<div>", {
                class   : "popupwindow_titlebar_button popupwindow_titlebar_button_minimize"
            })
            .css(_css.titlebar_button)
            .css("order", leftToRight ? 2 : 4)
            .attr("title", settings.buttonsTexts.minimize)
            .on("click", _ButtonMin_Click)
            .append(_icons.minimize)
            .appendTo(titlebar);
        }
        
        // Content
        var content = $("<div>", {
            class   : "popupwindow_content"
        })
        .css(_css.content)
        .appendTo(popupWindow);
        originalTarget.show().appendTo(content);
        
        // StatusBar
        if (settings.statusBar) {
            var statusBar = $("<div>", {
                class   : "popupwindow_statusbar"
            })
            .css(_css.statusbar)
            .appendTo(popupWindow);
            
            $("<div>", {
                class   : "popupwindow_statusbar_content"
            })
            .css(_css.statusbar_content)
            .appendTo(statusBar);
            
            var resizeHandle = $("<div>", {
                class   : "popupwindow_statusbar_handle"
            })
            .css(_css.statusbar_handle)
            .appendTo(statusBar);
            if (settings.resizable) {
                resizeHandle
                    .css(_css.statusbar_handle_resizable)
                    .append(_icons.resizeHandle)
                    .on("mousedown", null, {
                        dimension   : "both",
                        directionX  : "right",
                        directionY  : "bottom"
                    }, _Resizer_MouseDown);
            }
        }
        
        // Resizing
        if (settings.resizable) {
            var bordersWidth = _GetBordersWidth(popupWindow);
            // Top
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_top",
                css     : {
                    top     : 0 - bordersWidth.top - (_constants.resizersWidth / 2),
                    height  : bordersWidth.top + _constants.resizersWidth
                }
            })
            .css(_css.resizer_top)
            .on("mousedown", null, {
                dimension   : "height",
                directionY  : "top"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Bottom
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_bottom",
                css     : {
                    bottom  : 0 - bordersWidth.bottom - (_constants.resizersWidth / 2),
                    height  : bordersWidth.bottom + _constants.resizersWidth
                }
            })
            .css(_css.resizer_bottom)
            .on("mousedown", null, {
                dimension   : "height",
                directionY  : "bottom",
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Left
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_left",
                css     : {
                    left    : 0 - bordersWidth.left - (_constants.resizersWidth / 2),
                    width   : bordersWidth.left + _constants.resizersWidth
                }
            })
            .css(_css.resizer_left)
            .on("mousedown", null, {
                dimension   : "width",
                directionX  : "left"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Right
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_right",
                css     : {
                    right   : 0 - bordersWidth.right - (_constants.resizersWidth / 2),
                    width   : bordersWidth.right + _constants.resizersWidth
                }
            })
            .css(_css.resizer_right)
            .on("mousedown", null, {
                dimension   : "width",
                directionX  : "right",
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Top Left
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_topleft",
                css     : {
                    top     : 0 - bordersWidth.top - (_constants.resizersWidth / 2),
                    left    : 0 - bordersWidth.left - (_constants.resizersWidth / 2),
                    width   : bordersWidth.left + _constants.resizersWidth,
                    height  : bordersWidth.top + _constants.resizersWidth
                }
            })
            .css(_css.resizer_topleft)
            .on("mousedown", null, {
                dimension   : "both",
                directionX  : "left",
                directionY  : "top"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Top Right
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_topright",
                css     : {
                    top     : 0 - bordersWidth.top - (_constants.resizersWidth / 2),
                    right   : 0 - bordersWidth.right - (_constants.resizersWidth / 2),
                    width   : bordersWidth.right + _constants.resizersWidth,
                    height  : bordersWidth.top + _constants.resizersWidth
                }
            })
            .css(_css.resizer_topright)
            .on("mousedown", null, {
                dimension   : "both",
                directionX  : "right",
                directionY  : "top"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Bottom Left
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_bottomleft",
                css     : {
                    bottom  : 0 - bordersWidth.bottom - (_constants.resizersWidth / 2),
                    left    : 0 - bordersWidth.left - (_constants.resizersWidth / 2),
                    width   : bordersWidth.left + _constants.resizersWidth,
                    height  : bordersWidth.bottom + _constants.resizersWidth
                }
            })
            .css(_css.resizer_bottomleft)
            .on("mousedown", null, {
                dimension   : "both",
                directionX  : "left",
                directionY  : "bottom"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
            // Bottom Right
            $("<div>", {
                class   : "popupwindow_resizer popupwindow_resizer_bottomright",
                css     : {
                    bottom  : 0 - bordersWidth.bottom - (_constants.resizersWidth / 2),
                    right   : 0 - bordersWidth.right - (_constants.resizersWidth / 2),
                    width   : bordersWidth.right + _constants.resizersWidth,
                    height  : bordersWidth.bottom + _constants.resizersWidth
                }
            })
            .css(_css.resizer_bottomright)
            .on("mousedown", null, {
                dimension   : "both",
                directionX  : "right",
                directionY  : "bottom"
            }, _Resizer_MouseDown)
            .appendTo(popupWindow);
        }
        
        // Final Settings
        if (!settings.modal) overlay.width(0).height(0);
        overlay.hide();
        if (settings.autoOpen) _Open(popupWindow);
    }
    
    function _Open(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || popupWindow.data("opened")) return;
        popupWindow.data("overlay").show();
        popupWindow.data("opened", true);
        _TriggerEvent(popupWindow, "open");
        _Uncollapse(popupWindow);
        _Unminimize(popupWindow)
    }
    function _Close(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened")) return;
        if (popupWindow.data("minimized")) _Unminimize(popupWindow);
        popupWindow.data("overlay").hide();
        popupWindow.data("opened", false);
        _TriggerEvent(popupWindow, "close");
    }
    
    function _Maximize(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || popupWindow.data("maximized") || popupWindow.data("collapsed") || popupWindow.data("minimized")) return;
        var settings = popupWindow.data("settings");
        
        popupWindow.find(".popupwindow_titlebar_button_maximize")
            .empty()
            .append(_icons.unmaximize)
            .attr("title", settings.buttonsTexts.unmaximize);
        popupWindow.find(".popupwindow_statusbar_handle *, .popupwindow_resizer, .popupwindow_titlebar_button_collapse").hide();
        if (settings.draggable) popupWindow.find(".popupwindow_titlebar").removeClass("popupwindow_titlebar_draggable");
        if (!settings.modal) popupWindow.data("overlay").css("background-color", "transparent").width("100%").height("100%");
        
        _SaveCurrentPosition(popupWindow);
        _SaveCurrentSize(popupWindow);
        var defPosition = _ChangePosition(popupWindow, {
            top     : 0,
            left    : 0
        });
        var defSize = _ChangeSize(popupWindow, {
            width   : "100%",
            height  : "100%"
        });
        
        return $.when(defPosition, defSize).then(function(){
            popupWindow.data("maximized", true);
            _TriggerEvent(popupWindow, "maximize");
        });
    }
    function _Unmaximize(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || !popupWindow.data("maximized")) return;
        var settings    = popupWindow.data("settings");
        var defPosition = _RestoreSavedPosition(popupWindow);
        var defSize     = _RestoreSavedSize(popupWindow);
        
        popupWindow.find(".popupwindow_titlebar_button_maximize")
            .empty()
            .append(_icons.maximize)
            .attr("title", settings.buttonsTexts.maximize);
        popupWindow.find(".popupwindow_statusbar_handle *, .popupwindow_resizer, .popupwindow_titlebar_button_collapse").show();
        if (settings.draggable) popupWindow.find(".popupwindow_titlebar").addClass("popupwindow_titlebar_draggable");
        if (!settings.modal) popupWindow.data("overlay").width(0).height(0).css("background-color", "");
        
        return $.when(defPosition, defSize).then(function(){
            popupWindow.data("maximized", false);
            _TriggerEvent(popupWindow, "unmaximize");
        });
    }
    
    function _Collapse(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || popupWindow.data("maximized") || popupWindow.data("collapsed") || popupWindow.data("minimized")) return;
        var settings = popupWindow.data("settings");
        
        popupWindow.find(".popupwindow_titlebar_button_collapse")
            .empty()
            .append(_icons.uncollapse)
            .attr("title", settings.buttonsTexts.uncollapse);
        popupWindow.find(".popupwindow_content, .popupwindow_statusbar, .popupwindow_resizer, .popupwindow_titlebar_button_maximize, .popupwindow_titlebar_button_minimize").hide();
        
        _SaveCurrentSize(popupWindow);
        var defSize = _ChangeSize(popupWindow, {
            width   : settings.collapsedWidth,
            height  : _GetBordersWidth(popupWindow, "top") + _GetBordersWidth(popupWindow, "bottom") + popupWindow.find(".popupwindow_titlebar").outerHeight()
        });
        
        return $.when(defSize).then(function(){
            popupWindow.data("collapsed", true);
            _TriggerEvent(popupWindow, "collapse");
        });
    }
    function _Uncollapse(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || !popupWindow.data("collapsed")) return;
        var settings    = popupWindow.data("settings");
        var defSize     = _RestoreSavedSize(popupWindow);
        
        popupWindow.find(".popupwindow_titlebar_button_collapse")
            .empty()
            .append(_icons.collapse)
            .attr("title", settings.buttonsTexts.collapse);
        popupWindow.find(".popupwindow_content, .popupwindow_statusbar, .popupwindow_resizer, .popupwindow_titlebar_button_maximize, .popupwindow_titlebar_button_minimize").show();
        
        return $.when(defSize).then(function(){
            popupWindow.data("collapsed", false);
            _TriggerEvent(popupWindow, "uncollapse");
        });
    }
    
    function _Minimize(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || popupWindow.data("collapsed") || popupWindow.data("minimized")) return;
        var defRet      = $.Deferred();
        var settings    = popupWindow.data("settings");
        var defUnmaximize;
        if (popupWindow.data("maximized")) {
            var savedAnimationTime = settings.animationTime;
            settings.animationTime = settings.animationTime / _constants.secondaryAnimationTimeFactor;
            defUnmaximize = _Unmaximize(popupWindow);
            settings.animationTime = savedAnimationTime;
        } else {
            _SaveCurrentPosition(popupWindow);
            _SaveCurrentSize(popupWindow);
            defUnmaximize = $.Deferred().resolve();
        }
        $.when(defUnmaximize).then(function(){
            popupWindow.addClass("popupwindow_minimized").width("");
            popupWindow.find(".popupwindow_titlebar_button_minimize").attr("title", settings.buttonsTexts.unminimize);
            popupWindow.find(".popupwindow_content, .popupwindow_statusbar, .popupwindow_resizer, .popupwindow_titlebar_button_maximize, .popupwindow_titlebar_button_collapse").hide();
            if (settings.draggable) popupWindow.find(".popupwindow_titlebar").removeClass("popupwindow_titlebar_draggable");
            var minPlaceholder  = popupWindow.data("minPlaceholder");
            var minimizedSize   = {
                width   : popupWindow.outerWidth(),
                height  : _GetBordersWidth(popupWindow, "top") + _GetBordersWidth(popupWindow, "bottom") + popupWindow.find(".popupwindow_titlebar").outerHeight()
            };
            minPlaceholder
                .outerWidth(minimizedSize.width)
                .outerHeight(minimizedSize.height)
                .show();
            
            var minPlaceholderAnimation = {};
            var newPosition             = minPlaceholder.position();
            if (_minimizedArea.direction == "horizontal") {
                minPlaceholderAnimation.width = minimizedSize.width;
                minPlaceholder.width(0);
            } else {
                minPlaceholderAnimation.height = minimizedSize.height;
                minPlaceholder.height(0);
            }
            var defPosition = _ChangePosition(popupWindow, newPosition);
            var defSize     = _ChangeSize(popupWindow, {
                height  : minimizedSize.height
            });
            minPlaceholder.animate(minPlaceholderAnimation, {
                duration    : settings.animationTime,
                queue       : false,
                complete    : function(){
                    $(this).hide();
                    popupWindow.css({
                        position    : "relative",
                        top         : "",
                        left        : ""
                    }).insertAfter(popupWindow.data("overlay"));
                }
            });
            $.when(defPosition, defSize).then(function(){
                popupWindow.data("minimized", true);
                _TriggerEvent(popupWindow, "minimize");
                defRet.resolve();
            });
        });
        return defRet.promise();
    }
    function _Unminimize(popupWindow){
        if (!_CheckPopupWindow(popupWindow) || !popupWindow.data("opened") || !popupWindow.data("minimized")) return;
        var settings        = popupWindow.data("settings");
        var minPlaceholder  = popupWindow.data("minPlaceholder");
        
        popupWindow.removeClass("popupwindow_minimized");
        popupWindow.find(".popupwindow_titlebar_button_minimize").attr("title", settings.buttonsTexts.minimize);
        popupWindow.find(".popupwindow_content, .popupwindow_statusbar, .popupwindow_resizer, .popupwindow_titlebar_button_maximize, .popupwindow_titlebar_button_collapse").show();
        if (settings.draggable) popupWindow.find(".popupwindow_titlebar").addClass("popupwindow_titlebar_draggable");
        
        minPlaceholder.show().insertAfter(popupWindow.data("overlay"));
        var minimizedSize           = {
            width   : minPlaceholder.outerWidth(),
            height  : minPlaceholder.outerHeight()
        };
        var minPlaceholderAnimation = {};
        var newPosition             = minPlaceholder.position();
        if (_minimizedArea.direction == "horizontal") {
            minPlaceholderAnimation.width = 0;
            minPlaceholder.width(minimizedSize.width);
        } else {
            minPlaceholderAnimation.height = 0;
            minPlaceholder.height(minimizedSize.height);
        }
        popupWindow.css({
            position    : "absolute",
            top         : newPosition.top,
            left        : newPosition.left,
            width       : minimizedSize.width
        }).appendTo(popupWindow.data("overlay"));
        
        var defPosition = _RestoreSavedPosition(popupWindow);
        var defSize     = _RestoreSavedSize(popupWindow);
        minPlaceholder.animate(minPlaceholderAnimation, {
            duration    : settings.animationTime,
            queue       : false,
            complete    : function(){
                $(this).hide();
            }
        });
        
        return $.when(defPosition, defSize).then(function(){
            popupWindow.data("minimized", false);
            _TriggerEvent(popupWindow, "unminimize");
        });
    }
    
    function _Destroy(popupWindow){
        if (!_CheckPopupWindow(popupWindow)) return;
        var originalTarget = popupWindow.data("originalTarget");
        originalTarget.appendTo(popupWindow.data("originalParent"));
        if (popupWindow.data("minimized")) {
            popupWindow.remove();
        } else {
            popupWindow.data("overlay").remove();
        }
        originalTarget.trigger("destroy.popupwindow");
    }
    
    function _GetCurrentPosition(popupWindow){
        if (!_CheckPopupWindow(popupWindow)) return undefined;
        return $.extend({}, popupWindow.data("currentPosition"));
    }
    function _SetCurrentPosition(popupWindow, position){
        $.extend(popupWindow.data("currentPosition"), position);
    }
    function _SaveCurrentPosition(popupWindow){
        popupWindow.data("savedPosition", _GetCurrentPosition(popupWindow));
    }
    function _RestoreSavedPosition(popupWindow){
        return _ChangePosition(popupWindow, popupWindow.data("savedPosition"));
    }
    function _ChangePosition(popupWindow, params){
        if (!_CheckPopupWindow(popupWindow)) return;
        var defRet          = $.Deferred();
        var settings        = popupWindow.data("settings");
        var animationTime   = (params.animationTime !== undefined) ? parseInt(params.animationTime) : settings.animationTime;
        var newPosition     = {
            top     : params.top,
            left    : params.left
        };
        if (params.check) {
            if (!popupWindow.data("opened") || popupWindow.data("maximized") || popupWindow.data("minimized")) return;
            if (settings.keepInViewport) {
                var size    = _GetCurrentSize(popupWindow);
                var $window = $(window);
                if (newPosition.top > $window.height() - size.height) newPosition.top = $window.height() - size.height;
                if (newPosition.left > $window.width() - size.width) newPosition.left = $window.width() - size.width;
                if (newPosition.top < 0) newPosition.top = 0;
                if (newPosition.left < 0) newPosition.left = 0;
            }
        }
        var currentPosition = _GetCurrentPosition(popupWindow);
        if (currentPosition.top != newPosition.top || currentPosition.left != newPosition.left) {
            popupWindow.animate(newPosition, {
                duration    : animationTime,
                queue       : false,
                complete    : function(){
                    _SetCurrentPosition(popupWindow, newPosition);
                    if (params.event) _TriggerEvent(popupWindow, "move");
                    defRet.resolve();
                }
            });
        } else {
            defRet.resolve();
        }
        return defRet.promise();
    }
    function _CheckPosition(popupWindow){
        _ChangePosition(popupWindow, $.extend({
            animationTime   : popupWindow.data("settings").animationTime / _constants.secondaryAnimationTimeFactor,
            check           : true,
            event           : true
        }, _GetCurrentPosition(popupWindow)));
    }
    
    function _GetCurrentSize(popupWindow){
        if (!_CheckPopupWindow(popupWindow)) return undefined;
        return $.extend({}, popupWindow.data("currentSize"));
    }
    function _SetCurrentSize(popupWindow, size){
        $.extend(popupWindow.data("currentSize"), size);
    }
    function _SaveCurrentSize(popupWindow){
        popupWindow.data("savedSize", _GetCurrentSize(popupWindow));
    }
    function _RestoreSavedSize(popupWindow){
        return _ChangeSize(popupWindow, $.extend({
            checkPosition   : true,
            checkSize       : false,
            event           : false
        }, popupWindow.data("savedSize")));
    }
    function _ChangeSize(popupWindow, params){
        if (!_CheckPopupWindow(popupWindow)) return;
        var defRet          = $.Deferred();
        var settings        = popupWindow.data("settings");
        var animationTime   = (params.animationTime !== undefined) ? parseInt(params.animationTime) : settings.animationTime;
        var newSize         = {
            width   : params.width,
            height  : params.height
        };
        if (params.checkSize) {
            if (!popupWindow.data("opened") || popupWindow.data("maximized") || popupWindow.data("minimized")) return;
            if (settings.maxWidth && newSize.width > settings.maxWidth) newSize.width = settings.maxWidth;
            if (settings.minWidth && newSize.width < settings.minWidth) newSize.width = settings.minWidth;
            if (settings.maxHeight && newSize.height > settings.maxHeight) newSize.height = settings.maxHeight;
            if (settings.minHeight && newSize.height < settings.minHeight) newSize.height = settings.minHeight;
            if (popupWindow.data("collapsed")) {
                popupWindow.data("savedSize", $.extend({}, newSize));
                delete newSize.height;
            }
        }
        var currentSize = _GetCurrentSize(popupWindow);
        if (currentSize.width != newSize.width || currentSize.height != newSize.height) {
            popupWindow.animate(newSize, {
                duration    : animationTime,
                queue       : false,
                complete    : function(){
                    _SetCurrentSize(popupWindow, newSize);
                    if (params.event)           _TriggerEvent(popupWindow, "resize");
                    if (params.checkPosition)   _CheckPosition(popupWindow);
                    defRet.resolve();
                }
            });
        } else {
            defRet.resolve();
        }
        return defRet.promise();
    }
    function _CheckSize(popupWindow){
        _ChangeSize(popupWindow, $.extend({
            animationTime   : popupWindow.data("settings").animationTime / _constants.secondaryAnimationTimeFactor,
            checkPosition   : false,
            checkSize       : true,
            event           : true
        }, _GetCurrentSize(popupWindow)));
    }
    
    function _GetState(popupWindow){
        if (!popupWindow.length)            return undefined;
        if (!popupWindow.data("opened"))    return "closed";
        if (popupWindow.data("minimized"))  return "minimized";
        if (popupWindow.data("collapsed"))  return "collapsed";
        if (popupWindow.data("maximized"))  return "maximized";
        return "normal";
    }
    function _SetState(popupWindow, state){
        if (!_CheckPopupWindow(popupWindow)) return;
        switch (state.toLowerCase()) {
            case "normal":
                if (!popupWindow.data("opened"))    _Open(popupWindow);
                if (popupWindow.data("minimized"))  _Unminimize(popupWindow);
                if (popupWindow.data("collapsed"))  _Uncollapse(popupWindow);
                if (popupWindow.data("maximized"))  _Unmaximize(popupWindow);
            break;
            case "closed":
                _Close(popupWindow);
            break;
            case "maximized":
                _Maximize(popupWindow);
            break;
            case "unmaximized":
                _Unmaximize(popupWindow);
            break;
            case "collapsed":
                _Collapse(popupWindow);
            break;
            case "uncollapsed":
                _Uncollapse(popupWindow);
            break;
            case "minimized":
                _Minimize(popupWindow);
            break;
            case "unminimized":
                _Unminimize(popupWindow);
            break;
        }
    }
    
    function _SetTitle(popupWindow, title){
        if (!_CheckPopupWindow(popupWindow)) return;
        popupWindow.data("settings").title = title;
        popupWindow.find(".popupwindow_titlebar_text").text(title);
    }
    function _StatusBar(popupWindow, content){
        if (!_CheckPopupWindow(popupWindow)) return;
        popupWindow.find(".popupwindow_statusbar_content").html(content);
    }
    
    function _GetBordersWidth(popupWindow, border){
        if (border !== undefined) return parseInt(popupWindow.css("border-"+border+"-width"), 10);
        return {
            top     : parseInt(popupWindow.css("border-top-width"), 10),
            bottom  : parseInt(popupWindow.css("border-bottom-width"), 10),
            left    : parseInt(popupWindow.css("border-left-width"), 10),
            right   : parseInt(popupWindow.css("border-right-width"), 10)
        };
    }
    
    function _AddDocumentMouseEventHandlers(eventData){
        eventData.popupWindow.fadeTo(0, eventData.opacity);
        if (!eventData.popupWindow.data("settings").mouseMoveEvents) eventData.popupWindow.data("tempSavedData", {
            position    : _GetCurrentPosition(eventData.popupWindow),
            size        : _GetCurrentSize(eventData.popupWindow)
        });
        $(document)
            .on("mousemove", eventData, _Document_MouseMove)
            .on("mouseup",   eventData, _Document_MouseUp);
    }
    
    function _TriggerEvent(popupWindow, eventName){
        var eventData;
        if (eventName == "move")    eventData = _GetCurrentPosition(popupWindow);
        if (eventName == "resize")  eventData = _GetCurrentSize(popupWindow);
        popupWindow.data("originalTarget").trigger(eventName + ".popupwindow", eventData);
    }
    
    function _SetMinimizedArea(){
        var flex = {};
        if (_minimizedArea.direction == "horizontal") {
            flex["flex-direction"]  = (_minimizedArea.position.indexOf("left") >= 0) ? "row" : "row-reverse";
            flex["flex-wrap"]       = (_minimizedArea.position.indexOf("top") >= 0) ? "wrap" : "wrap-reverse";
        } else {
            flex["flex-direction"]  = (_minimizedArea.position.indexOf("top") >= 0) ? "column" : "column-reverse";
            flex["flex-wrap"]       = (_minimizedArea.position.indexOf("left") >= 0) ? "wrap" : "wrap-reverse";
        }
        _mainContainer.css(flex);
    }
    
    
    function _CheckPopupWindow(popupWindow){
        if (popupWindow.length) return true;
        _Warning("jQuery PopupWindow is not initialized on this element");
        return false;
    }
    
    function _Warning(message){
        message = "jQuery PopupWindow Warning: " + message;
        if (window.console.warn) {
            console.warn(message);
        } else if (window.console.log) {
            console.log(message);
        }
    }
    
    
    // **************************************************
    //  EVENT HANDLERS
    // **************************************************
    function _ButtonClose_Click(event){
        _Close($(event.currentTarget).closest(".popupwindow"));
    }
    function _ButtonMax_Click(event){
        var popupWindow = $(event.currentTarget).closest(".popupwindow");
        if (!popupWindow.data("maximized")) {
            _Maximize(popupWindow);
        } else {
            _Unmaximize(popupWindow);
        }
    }
    function _ButtonCollapse_Click(event){
        var popupWindow = $(event.currentTarget).closest(".popupwindow");
        if (!popupWindow.data("collapsed")) {
            _Collapse(popupWindow);
        } else {
            _Uncollapse(popupWindow);
        }
    }
    function _ButtonMin_Click(event){
        var popupWindow = $(event.currentTarget).closest(".popupwindow");
        if (!popupWindow.data("minimized")) {
            _Minimize(popupWindow);
        } else {
            _Unminimize(popupWindow);
        }
    }
    
    function _Titlebar_MouseDown(event){
        if (event.target !== event.currentTarget && !$(event.target).hasClass("popupwindow_titlebar_text")) return false;
        var popupWindow     = $(event.currentTarget).closest(".popupwindow");
        var currentPosition = _GetCurrentPosition(popupWindow);
        var settings        = popupWindow.data("settings");
        if (!settings.modal) popupWindow.data("overlay").css("background-color", "transparent").width("100%").height("100%");
        _AddDocumentMouseEventHandlers({
            popupWindow     : popupWindow,
            action          : "drag",
            opacity         : settings.dragOpacity,
            compensationX   : event.pageX - currentPosition.left,
            compensationY   : event.pageY - currentPosition.top
        });
        event.preventDefault();
    }
    function _Resizer_MouseDown(event){
        var popupWindow     = $(event.currentTarget).closest(".popupwindow");
        var currentPosition = _GetCurrentPosition(popupWindow);
        var currentSize     = _GetCurrentSize(popupWindow);
        _AddDocumentMouseEventHandlers({
            popupWindow     : popupWindow,
            action          : "resize",
            dimension       : event.data.dimension,
            directionX      : event.data.directionX,
            directionY      : event.data.directionY,
            opacity         : popupWindow.data("settings").resizeOpacity,
            startX          : event.pageX + ((event.data.directionX == "left") ? currentSize.width : -currentSize.width),
            startY          : event.pageY + ((event.data.directionY == "top" ) ? currentSize.height : -currentSize.height),
            compensationX   : event.pageX - currentPosition.left,
            compensationY   : event.pageY - currentPosition.top
        });
        event.preventDefault();
    }
    
    function _Document_MouseMove(event){
        var popupWindow     = event.data.popupWindow;
        var settings        = popupWindow.data("settings");
        var currentPosition = _GetCurrentPosition(popupWindow);
        var currentSize     = _GetCurrentSize(popupWindow);
        var newPosition     = {};
        var newSize         = {};
        switch (event.data.action) {
            case "drag":
                newPosition.top  = event.pageY - event.data.compensationY;
                newPosition.left = event.pageX - event.data.compensationX;
                if (settings.keepInViewport) {
                    var size    = _GetCurrentSize(popupWindow);
                    var $window = $(window);
                    if (newPosition.top < 0)                                newPosition.top  = 0;
                    if (newPosition.left < 0)                               newPosition.left = 0;
                    if (newPosition.top > $window.height() - size.height)   newPosition.top  = $window.height() - size.height;
                    if (newPosition.left > $window.width() - size.width)    newPosition.left = $window.width() - size.width;
                }
            break;
            case "resize":
                if (event.data.dimension != "height" && event.pageX > 0) {
                    var newWidth = (event.data.directionX == "left") ? event.data.startX - event.pageX : event.pageX - event.data.startX;
                    if (newWidth >= settings.minWidth && (!settings.maxWidth || newWidth <= settings.maxWidth)) {
                        newSize.width = newWidth;
                        if (event.data.directionX == "left") newPosition.left = event.pageX - event.data.compensationX;
                    }
                }
                if (event.data.dimension != "width" && event.pageY > 0) {
                    var newHeight = (event.data.directionY == "top") ? event.data.startY - event.pageY : event.pageY - event.data.startY;
                    if (newHeight >= settings.minHeight && (!settings.maxHeight || newHeight <= settings.maxHeight)) {
                        newSize.height = newHeight;
                        if (event.data.directionY == "top") newPosition.top = event.pageY - event.data.compensationY;
                    }
                }
            break;
        }
        if ((newPosition.top !== undefined && newPosition.top != currentPosition.top) || (newPosition.left !== undefined && newPosition.left != currentPosition.left)) {
            popupWindow.css(newPosition);
            _SetCurrentPosition(popupWindow, newPosition);
            if (settings.mouseMoveEvents) _TriggerEvent(popupWindow, "move");
        }
        if ((newSize.width !== undefined && newSize.width != currentSize.width) || (newSize.height !== undefined && newSize.height != currentSize.height)) {
            popupWindow.outerWidth(newSize.width).outerHeight(newSize.height);
            _SetCurrentSize(popupWindow, newSize);
            if (settings.mouseMoveEvents) _TriggerEvent(popupWindow, "resize");
        }
    }
    function _Document_MouseUp(event){
        var popupWindow = event.data.popupWindow;
        var settings    = popupWindow.data("settings");
        popupWindow.fadeTo(0, 1);
        $(document)
            .off("mousemove", _Document_MouseMove)
            .off("mouseup",   _Document_MouseUp);
        if (!settings.modal) popupWindow.data("overlay").width(0).height(0).css("background-color", "");
        if (!settings.mouseMoveEvents) {
            var currentPosition = _GetCurrentPosition(popupWindow);
            var currentSize     = _GetCurrentSize(popupWindow);
            var savedData       = popupWindow.data("tempSavedData");
            if (savedData.position.top != currentPosition.top || savedData.position.left != currentPosition.left) _TriggerEvent(popupWindow, "move");
            if (savedData.size.width != currentSize.width || savedData.size.height != currentSize.height)         _TriggerEvent(popupWindow, "resize");
            popupWindow.removeData("tempSavedData");
        }
    }
    
    
    $(function(){
        _mainContainer = $("<div>", {
            class   : "popupwindow_container"
        })
        .css(_css.container)
        .appendTo("body");
        _SetMinimizedArea();
        
        $(window).on("resize", function(){
            $(document).find(".popupwindow").each(function(){
                var popupWindow = $(this);
                if (popupWindow.data("settings").keepInViewport) _CheckPosition(popupWindow);
            });
        });
    });
    
}(jQuery));