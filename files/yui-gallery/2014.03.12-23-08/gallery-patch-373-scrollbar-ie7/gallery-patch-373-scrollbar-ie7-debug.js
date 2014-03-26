YUI.add('gallery-patch-373-scrollbar-ie7', function (Y, NAME) {

    var CHILD_CACHE = "childCache",
        HORIZ_CACHE = "_sbh",
        VERT_CACHE = "_sbv",
        TRANSLATE_X = "translateX(",
        TRANSLATE_Y = "translateY(",
        SCALE_X = "scaleX(",
        SCALE_Y = "scaleY(",
        WIDTH = "width",
        HEIGHT = "height",
        TOP = "top",
        LEFT = "left",
        Transition = Y.Transition,
        NATIVE_TRANSITIONS = Transition.useNative,
        TRANSFORM = "transform",
        SCROLL_X = "scrollX",
        SCROLL_Y = "scrollY",
        PX = "px",
        CLOSE = ")",
        PX_CLOSE = PX + CLOSE;

    Y.Plugin.ScrollViewScrollbars.prototype._updateBar = function(scrollbar, current, duration, horiz) {

        var host = this._host,
            basic = this._basic,

            scrollbarSize = 0,
            scrollbarPos = 1,

            childCache = scrollbar.getData(CHILD_CACHE),
            lastChild = childCache.lc,
            middleChild = childCache.mc,
            firstChildSize = childCache.fcSize,
            lastChildSize = childCache.lcSize,
            middleChildSize,
            lastChildPosition,

            transition,
            translate,
            scale,

            dim,
            dimOffset,
            dimCache,
            widgetSize,
            contentSize;

        if (horiz) {
            dim = WIDTH;
            dimOffset = LEFT;
            dimCache = HORIZ_CACHE;
            widgetSize = this._dims.offsetWidth;
            contentSize = this._dims.scrollWidth;
            translate = TRANSLATE_X;
            scale = SCALE_X;
            current = (current !== undefined) ? current : host.get(SCROLL_X);
        } else {
            dim = HEIGHT;
            dimOffset = TOP;
            dimCache = VERT_CACHE;
            widgetSize = this._dims.offsetHeight;
            contentSize = this._dims.scrollHeight;
            translate = TRANSLATE_Y;
            scale = SCALE_Y;
            current = (current !== undefined) ? current : host.get(SCROLL_Y);
        }

        scrollbarSize = Math.floor(widgetSize * (widgetSize/contentSize));
        scrollbarPos = Math.floor((current/(contentSize - widgetSize)) * (widgetSize - scrollbarSize));
        if (scrollbarSize > widgetSize) {
            scrollbarSize = 1;
        }

        if (scrollbarPos > (widgetSize - scrollbarSize)) {
            scrollbarSize = scrollbarSize - (scrollbarPos - (widgetSize - scrollbarSize));
        } else if (scrollbarPos < 0) {
            scrollbarSize = scrollbarPos + scrollbarSize;
            scrollbarPos = 0;
        } else if (isNaN(scrollbarPos)) {
            scrollbarPos = 0;
        }

        middleChildSize = (scrollbarSize - (firstChildSize + lastChildSize));

        if (middleChildSize < 0) {
            middleChildSize = 0;
        }

        if (middleChildSize === 0 && scrollbarPos !== 0) {
            scrollbarPos = widgetSize - (firstChildSize + lastChildSize) - 1;
        }

        if (duration !== 0) {
            // Position Scrollbar
            transition = {
                duration : duration
            };

            if (NATIVE_TRANSITIONS) {
                transition.transform = translate + scrollbarPos + PX_CLOSE;
            } else {
                transition[dimOffset] = scrollbarPos + PX;
            }

            scrollbar.transition(transition);

        } else {
            if (NATIVE_TRANSITIONS) {
                scrollbar.setStyle(TRANSFORM, translate + scrollbarPos + PX_CLOSE);
            } else {
                scrollbar.setStyle(dimOffset, scrollbarPos + PX);
            }
        }

        // Resize Scrollbar Middle Child
        if (this[dimCache] !== middleChildSize) {
            this[dimCache] = middleChildSize;

            if (middleChildSize > 0) {

                if (duration !== 0) {
                    transition = {
                        duration : duration
                    };

                    if(NATIVE_TRANSITIONS) {
                        transition.transform = scale + middleChildSize + CLOSE;
                    } else {
                        transition[dim] = middleChildSize + PX;
                    }

                    middleChild.transition(transition);
                } else {
                    if (NATIVE_TRANSITIONS) {
                        middleChild.setStyle(TRANSFORM, scale + middleChildSize + CLOSE);
                    } else {
                        middleChild.setStyle(dim, middleChildSize + PX);
                    }
                }
    
                // Position Last Child
                if (!horiz || !basic) {

                    lastChildPosition = scrollbarSize - lastChildSize;
    
                    if(duration !== 0) {
                        transition = {
                            duration : duration
                        };
                
                        if (NATIVE_TRANSITIONS) {
                            transition.transform = translate + lastChildPosition + PX_CLOSE;
                        } else {
                            transition[dimOffset] = lastChildPosition;
                        }

                        lastChild.transition(transition);
                    } else {
                        if (NATIVE_TRANSITIONS) {
                            lastChild.setStyle(TRANSFORM, translate + lastChildPosition + PX_CLOSE);
                        } else {
                            lastChild.setStyle(dimOffset, lastChildPosition + PX);
                        }
                    }
                }
            }
        }
    };


}, 'gallery-2013.02.13-21-08', {"requires": ["scrollview"]});
