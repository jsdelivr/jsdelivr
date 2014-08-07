// Ion.RangeSlider
// version 1.9.3 Build: 176
// © 2013-2014 Denis Ineshin | IonDen.com
//
// Project page:    http://ionden.com/a/plugins/ion.rangeSlider/
// GitHub page:     https://github.com/IonDen/ion.rangeSlider
//
// Released under MIT licence:
// http://ionden.com/a/plugins/licence-en.html
// =====================================================================================================================

(function ($, document, window, navigator) {
    "use strict";

    var plugin_count = 0,
        current;

    var is_old_ie = (function () {
        var n = navigator.userAgent,
            r = /msie\s\d+/i,
            v;
        if (n.search(r) > 0) {
            v = r.exec(n).toString();
            v = v.split(" ")[1];
            if (v < 9) {
                return true;
            }
        }
        return false;
    }());
    var is_touch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

    var testNumber = function (num) {
        if (typeof num === "number") {
            if (isNaN(num)) {
                return null;
            } else {
                return num;
            }
        } else {
            num = parseFloat(num);
            if (isNaN(num)) {
                return null;
            } else {
                return num;
            }
        }
    };

    var methods = {
        init: function (options) {

            // irs = ion range slider css prefix
            var baseHTML =
                '<span class="irs">' +
                '<span class="irs-line"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span>' +
                '<span class="irs-min">0</span><span class="irs-max">1</span>' +
                '<span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span>' +
                '</span>' +
                '<span class="irs-grid"></span>';

            var singleHTML =
                '<span class="irs-slider single"></span>';

            var doubleHTML =
                '<span class="irs-diapason"></span>' +
                '<span class="irs-slider from"></span>' +
                '<span class="irs-slider to"></span>';

            var disableHTML =
                '<span class="irs-disable-mask"></span>';



            return this.each(function () {
                var settings = $.extend({
                    min: null,
                    max: null,
                    from: null,
                    to: null,
                    type: "single",
                    step: null,
                    prefix: "",
                    postfix: "",
                    maxPostfix: "",
                    hasGrid: false,
                    gridMargin: 0,
                    hideMinMax: false,
                    hideFromTo: false,
                    prettify: true,
                    disable: false,
                    values: null,
                    onLoad: null,
                    onChange: null,
                    onFinish: null
                }, options);



                var slider = $(this),
                    self = this,
                    allow_values = false,
                    value_array = null;

                if (slider.data("isActive")) {
                    return;
                }
                slider.data("isActive", true);

                plugin_count += 1;
                this.plugin_count = plugin_count;



                // check default values
                if (slider.prop("value")) {
                    value_array = slider.prop("value").split(";");
                }

                if (settings.type === "single") {

                    if (value_array && value_array.length > 1) {

                        if (typeof settings.min !== "number") {
                            settings.min = parseFloat(value_array[0]);
                        } else {
                            if (typeof settings.from !== "number") {
                                settings.from = parseFloat(value_array[0]);
                            }
                        }

                        if (typeof settings.max !== "number") {
                            settings.max = parseFloat(value_array[1]);
                        }

                    } else if (value_array && value_array.length === 1) {

                        if (typeof settings.from !== "number") {
                            settings.from = parseFloat(value_array[0]);
                        }

                    }

                } else if (settings.type === "double") {

                    if (value_array && value_array.length > 1) {

                        if (typeof settings.min !== "number") {
                            settings.min = parseFloat(value_array[0]);
                        } else {
                            if (typeof settings.from !== "number") {
                                settings.from = parseFloat(value_array[0]);
                            }
                        }

                        if (typeof settings.max !== "number") {
                            settings.max = parseFloat(value_array[1]);
                        } else {
                            if (typeof settings.to !== "number") {
                                settings.to = parseFloat(value_array[1]);
                            }
                        }

                    } else if (value_array && value_array.length === 1) {

                        if (typeof settings.min !== "number") {
                            settings.min = parseFloat(value_array[0]);
                        } else {
                            if (typeof settings.from !== "number") {
                                settings.from = parseFloat(value_array[0]);
                            }
                        }

                    }

                }



                // extend from data-*
                if (typeof slider.data("min") === "number") {
                    settings.min = parseFloat(slider.data("min"));
                }
                if (typeof slider.data("max") === "number") {
                    settings.max = parseFloat(slider.data("max"));
                }
                if (typeof slider.data("from") === "number") {
                    settings.from = parseFloat(slider.data("from"));
                }
                if (typeof slider.data("to") === "number") {
                    settings.to = parseFloat(slider.data("to"));
                }
                if (slider.data("step")) {
                    settings.step = parseFloat(slider.data("step"));
                }
                if (slider.data("type")) {
                    settings.type = slider.data("type");
                }
                if (slider.data("prefix")) {
                    settings.prefix = slider.data("prefix");
                }
                if (slider.data("postfix")) {
                    settings.postfix = slider.data("postfix");
                }
                if (slider.data("maxpostfix")) {
                    settings.maxPostfix = slider.data("maxpostfix");
                }
                if (slider.data("hasgrid")) {
                    settings.hasGrid = slider.data("hasgrid");
                }
                if (slider.data("gridmargin")) {
                    settings.gridMargin = +slider.data("gridmargin");
                }
                if (slider.data("hideminmax")) {
                    settings.hideMinMax = slider.data("hideminmax");
                }
                if (slider.data("hidefromto")) {
                    settings.hideFromTo = slider.data("hidefromto");
                }
                if (slider.data("prettify")) {
                    settings.prettify = slider.data("prettify");
                }
                if (slider.data("disable")) {
                    settings.disable = slider.data("disable");
                }
                if (slider.data("values")) {
                    settings.values = slider.data("values").split(",");
                }



                // Set Min and Max if no
                settings.min = testNumber(settings.min);
                if (!settings.min && settings.min !== 0) {
                    settings.min = 10;
                }

                settings.max = testNumber(settings.max);
                if (!settings.max && settings.max !== 0) {
                    settings.max = 100;
                }



                // Set values
                if (Object.prototype.toString.call(settings.values) !== "[object Array]") {
                    settings.values = null;
                }
                if (settings.values && settings.values.length > 0) {
                    settings.min = 0;
                    settings.max = settings.values.length - 1;
                    settings.step = 1;
                    allow_values = true;
                }



                // Set From and To if no
                settings.from = testNumber(settings.from);
                if (!settings.from && settings.from !== 0) {
                    settings.from = settings.min;
                }

                settings.to = testNumber(settings.to);
                if (!settings.to && settings.to !== 0) {
                    settings.to = settings.max;
                }


                // Set step
                settings.step = testNumber(settings.step);
                if (!settings.step) {
                    settings.step = 1;
                }



                // fix diapason
                if (settings.from < settings.min) {
                    settings.from = settings.min;
                }
                if (settings.from > settings.max) {
                    settings.from = settings.min;
                }

                if (settings.to < settings.min) {
                    settings.to = settings.max;
                }
                if (settings.to > settings.max) {
                    settings.to = settings.max;
                }

                if (settings.type === "double") {
                    if (settings.from > settings.to) {
                        settings.from = settings.to;
                    }
                    if (settings.to < settings.from) {
                        settings.to = settings.from;
                    }
                }


                var prettify = function (num) {
                    var n = num.toString();
                    if (settings.prettify) {
                        n = n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1 ");
                    }
                    return n;
                };


                var containerHTML = '<span class="irs" id="irs-' + this.plugin_count + '"></span>';
                slider[0].style.display = "none";
                slider.before(containerHTML);

                var $container = slider.prev(),
                    $body = $(document.body),
                    $window = $(window),
                    $rangeSlider,
                    $fieldMin,
                    $fieldMax,
                    $fieldFrom,
                    $fieldTo,
                    $fieldSingle,
                    $singleSlider,
                    $fromSlider,
                    $toSlider,
                    $activeSlider,
                    $diapason,
                    $grid;

                var allowDrag = false,
                    is_slider_active = false,
                    is_first_start = true,
                    numbers = {};

                var mouseX = 0,
                    fieldMinWidth = 0,
                    fieldMaxWidth = 0,
                    normalWidth = 0,
                    fullWidth = 0,
                    sliderWidth = 0,
                    width = 0,
                    left = 0,
                    right = 0,
                    minusX = 0,
                    stepFloat = 0;


                if (parseInt(settings.step, 10) !== parseFloat(settings.step)) {
                    stepFloat = settings.step.toString().split(".")[1];
                    stepFloat = Math.pow(10, stepFloat.length);
                }



                // public methods
                this.updateData = function (options) {
                    $.extend(settings, options);
                    removeHTML();
                };
                this.removeSlider = function () {
                    $container.find("*").off();
                    $window.off("mouseup.irs" + self.plugin_count);
                    $body.off("mouseup.irs" + self.plugin_count);
                    $body.off("mouseleave.irs" + self.plugin_count);
                    $body.off("mousemove.irs" + self.plugin_count);
                    $container.html("").remove();
                    slider.data("isActive", false);
                    slider.show();
                };





                // private methods
                var removeHTML = function () {
                    $container.find("*").off();
                    $window.off("mouseup.irs" + self.plugin_count);
                    $body.off("mouseup.irs" + self.plugin_count);
                    $body.off("mouseleave.irs" + self.plugin_count);
                    $body.off("mousemove.irs" + self.plugin_count);
                    $container.html("");

                    placeHTML();
                };
                var placeHTML = function () {
                    $container.html(baseHTML);
                    $rangeSlider = $container.find(".irs");

                    $fieldMin = $rangeSlider.find(".irs-min");
                    $fieldMax = $rangeSlider.find(".irs-max");
                    $fieldFrom = $rangeSlider.find(".irs-from");
                    $fieldTo = $rangeSlider.find(".irs-to");
                    $fieldSingle = $rangeSlider.find(".irs-single");
                    $grid = $container.find(".irs-grid");

                    if (settings.hideFromTo) {
                        $fieldFrom[0].style.visibility = "hidden";
                        $fieldTo[0].style.visibility = "hidden";
                        $fieldSingle[0].style.visibility = "hidden";
                    }
                    if (!settings.hideFromTo) {
                        $fieldFrom[0].style.visibility = "visible";
                        $fieldTo[0].style.visibility = "visible";
                        $fieldSingle[0].style.visibility = "visible";
                    }

                    if (settings.hideMinMax) {
                        $fieldMin[0].style.visibility = "hidden";
                        $fieldMax[0].style.visibility = "hidden";

                        fieldMinWidth = 0;
                        fieldMaxWidth = 0;
                    }
                    if (!settings.hideMinMax) {
                        $fieldMin[0].style.visibility = "visible";
                        $fieldMax[0].style.visibility = "visible";

                        if (settings.values) {
                            $fieldMin.html(settings.prefix + settings.values[0] + settings.postfix);
                            $fieldMax.html(settings.prefix + settings.values[settings.values.length - 1] + settings.maxPostfix + settings.postfix);
                        } else {
                            $fieldMin.html(settings.prefix + prettify(settings.min) + settings.postfix);
                            $fieldMax.html(settings.prefix + prettify(settings.max) + settings.maxPostfix + settings.postfix);
                        }

                        fieldMinWidth = $fieldMin.outerWidth(false);
                        fieldMaxWidth = $fieldMax.outerWidth(false);
                    }

                    bindEvents();
                };

                var bindEvents = function () {
                    if (settings.type === "single") {
                        $rangeSlider.append(singleHTML);

                        $singleSlider = $rangeSlider.find(".single");

                        $singleSlider.on("mousedown", function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            calcDimensions(e, $(this), null);

                            allowDrag = true;
                            is_slider_active = true;
                            current = self.plugin_count;

                            if (is_old_ie) {
                                $("*").prop("unselectable", true);
                            }
                        });
                        if (is_touch) {
                            $singleSlider.on("touchstart", function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                calcDimensions(e.originalEvent.touches[0], $(this), null);

                                allowDrag = true;
                                is_slider_active = true;
                                current = self.plugin_count;
                            });
                        }

                    } else if (settings.type === "double") {
                        $rangeSlider.append(doubleHTML);

                        $fromSlider = $rangeSlider.find(".from");
                        $toSlider = $rangeSlider.find(".to");
                        $diapason = $rangeSlider.find(".irs-diapason");

                        setDiapason();

                        $fromSlider.on("mousedown", function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            $(this).addClass("last");
                            $toSlider.removeClass("last");
                            calcDimensions(e, $(this), "from");

                            allowDrag = true;
                            is_slider_active = true;
                            current = self.plugin_count;

                            if (is_old_ie) {
                                $("*").prop("unselectable", true);
                            }
                        });
                        $toSlider.on("mousedown", function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            $(this).addClass("last");
                            $fromSlider.removeClass("last");
                            calcDimensions(e, $(this), "to");

                            allowDrag = true;
                            is_slider_active = true;
                            current = self.plugin_count;

                            if (is_old_ie) {
                                $("*").prop("unselectable", true);
                            }
                        });

                        if (is_touch) {
                            $fromSlider.on("touchstart", function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                $(this).addClass("last");
                                $toSlider.removeClass("last");
                                calcDimensions(e.originalEvent.touches[0], $(this), "from");

                                allowDrag = true;
                                is_slider_active = true;
                                current = self.plugin_count;
                            });
                            $toSlider.on("touchstart", function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                $(this).addClass("last");
                                $fromSlider.removeClass("last");
                                calcDimensions(e.originalEvent.touches[0], $(this), "to");

                                allowDrag = true;
                                is_slider_active = true;
                                current = self.plugin_count;
                            });
                        }

                        if (settings.to === settings.max) {
                            $fromSlider.addClass("last");
                        }
                    }

                    var mouseup = function () {
                        if (current !== self.plugin_count) {
                            return;
                        }

                        if (allowDrag) {
                            is_slider_active = false;
                            allowDrag = false;
                            $activeSlider.removeAttr("id");
                            $activeSlider = null;
                            if (settings.type === "double") {
                                setDiapason();
                            }
                            getNumbers();

                            if (is_old_ie) {
                                $("*").prop("unselectable", false);
                            }
                        }
                    };

                    $window.on("mouseup.irs" + self.plugin_count, function () {
                        mouseup();
                    });

                    if (is_old_ie) {
                        $body.on("mouseleave.irs" + self.plugin_count, function () {
                            mouseup();
                        });
                    }


                    $body.on("mousemove.irs" + self.plugin_count, function (e) {
                        if (allowDrag) {
                            mouseX = e.pageX;
                            dragSlider();
                        }
                    });

                    $container.on("mousedown", function () {
                        current = self.plugin_count;
                    });

                    $container.on("mouseup", function (e) {
                        if (current !== self.plugin_count) {
                            return;
                        }

                        if (allowDrag || settings.disable) {
                            return;
                        }

                        moveByClick(e.pageX);
                    });

                    if (is_touch) {
                        $window.on("touchend", function () {
                            if (allowDrag) {
                                is_slider_active = false;
                                allowDrag = false;
                                $activeSlider.removeAttr("id");
                                $activeSlider = null;
                                if (settings.type === "double") {
                                    setDiapason();
                                }
                                getNumbers();
                            }
                        });
                        $window.on("touchmove", function (e) {
                            if (allowDrag) {
                                mouseX = e.originalEvent.touches[0].pageX;
                                dragSlider();
                            }
                        });
                    }

                    getSize();
                    setNumbers();
                    if (settings.hasGrid) {
                        setGrid();
                    }
                    if (settings.disable) {
                        setMask();
                    } else {
                        removeMask();
                    }
                };

                var getSize = function () {
                    normalWidth = $rangeSlider.width();
                    if ($singleSlider) {
                        sliderWidth = $singleSlider.width();
                    } else {
                        sliderWidth = $fromSlider.width();
                    }
                    fullWidth = normalWidth - sliderWidth;
                };

                var calcDimensions = function (e, currentSlider, whichSlider) {
                    getSize();

                    is_first_start = false;
                    $activeSlider = currentSlider;
                    $activeSlider.prop("id", "irs-active-slider");

                    var _x1 = $activeSlider.offset().left,
                        _x2 = e.pageX - _x1;
                    minusX = _x1 + _x2 - $activeSlider.position().left;

                    if (settings.type === "single") {

                        width = $rangeSlider.width() - sliderWidth;

                    } else if (settings.type === "double") {

                        if (whichSlider === "from") {
                            left = 0;
                            right = parseInt($toSlider.css("left"), 10);
                        } else {
                            left = parseInt($fromSlider.css("left"), 10);
                            right = $rangeSlider.width() - sliderWidth;
                        }

                    }
                };

                var setDiapason = function () {
                    var _w = $fromSlider.width(),
                        _x = $.data($fromSlider[0], "x") || parseInt($fromSlider[0].style.left, 10) || $fromSlider.position().left,
                        _width = $.data($toSlider[0], "x") || parseInt($toSlider[0].style.left, 10) || $toSlider.position().left,
                        x = _x + (_w / 2),
                        w = _width - _x;
                    $diapason[0].style.left = x + "px";
                    $diapason[0].style.width = w + "px";
                };

                var dragSlider = function (manual_x) {
                    var x_pure = mouseX - minusX,
                        x;

                    if (manual_x) {
                        x_pure = manual_x;
                    } else {
                        x_pure = mouseX - minusX;
                    }

                    if (settings.type === "single") {

                        if (x_pure < 0) {
                            x_pure = 0;
                        }
                        if (x_pure > width) {
                            x_pure = width;
                        }

                    } else if (settings.type === "double") {

                        if (x_pure < left) {
                            x_pure = left;
                        }
                        if (x_pure > right) {
                            x_pure = right;
                        }
                        setDiapason();

                    }

                    $.data($activeSlider[0], "x", x_pure);
                    getNumbers();

                    x = Math.round(x_pure);
                    $activeSlider[0].style.left = x + "px";
                };

                var getNumbers = function () {
                    var nums = {
                        input: slider,
                        slider: $container,
                        min: settings.min,
                        max: settings.max,
                        fromNumber: 0,
                        toNumber: 0,
                        fromPers: 0,
                        toPers: 0,
                        fromX: 0,
                        fromX_pure: 0,
                        toX: 0,
                        toX_pure: 0
                    };
                    var diapason = settings.max - settings.min, _from, _to;

                    if (settings.type === "single") {

                        nums.fromX = $.data($singleSlider[0], "x") || parseInt($singleSlider[0].style.left, 10) || $singleSlider.position().left;
                        nums.fromPers = nums.fromX / fullWidth * 100;
                        _from = (diapason / 100 * nums.fromPers) + settings.min;
                        nums.fromNumber = Math.round(_from / settings.step) * settings.step;
                        if (nums.fromNumber < settings.min) {
                            nums.fromNumber = settings.min;
                        }
                        if (nums.fromNumber > settings.max) {
                            nums.fromNumber = settings.max;
                        }

                        if (stepFloat) {
                            nums.fromNumber = parseInt(nums.fromNumber * stepFloat, 10) / stepFloat;
                        }

                        if (allow_values) {
                            nums.fromValue = settings.values[nums.fromNumber];
                        }

                    } else if (settings.type === "double") {

                        nums.fromX = $.data($fromSlider[0], "x") || parseInt($fromSlider[0].style.left, 10) || $fromSlider.position().left;
                        nums.fromPers = nums.fromX / fullWidth * 100;
                        _from = (diapason / 100 * nums.fromPers) + settings.min;
                        nums.fromNumber = Math.round(_from / settings.step) * settings.step;
                        if (nums.fromNumber < settings.min) {
                            nums.fromNumber = settings.min;
                        }

                        nums.toX = $.data($toSlider[0], "x") || parseInt($toSlider[0].style.left, 10) || $toSlider.position().left;
                        nums.toPers = nums.toX / fullWidth * 100;
                        _to = (diapason / 100 * nums.toPers) + settings.min;
                        nums.toNumber = Math.round(_to / settings.step) * settings.step;
                        if (nums.toNumber > settings.max) {
                            nums.toNumber = settings.max;
                        }

                        if (stepFloat) {
                            nums.fromNumber = parseInt(nums.fromNumber * stepFloat, 10) / stepFloat;
                            nums.toNumber = parseInt(nums.toNumber * stepFloat, 10) / stepFloat;
                        }

                        if (allow_values) {
                            nums.fromValue = settings.values[nums.fromNumber];
                            nums.toValue = settings.values[nums.toNumber];
                        }

                    }

                    numbers = nums;
                    setFields();
                };

                var setNumbers = function () {
                    var nums = {
                        input: slider,
                        slider: $container,
                        min: settings.min,
                        max: settings.max,
                        fromNumber: settings.from,
                        toNumber: settings.to,
                        fromPers: 0,
                        toPers: 0,
                        fromX: 0,
                        fromX_pure: 0,
                        toX: 0,
                        toX_pure: 0
                    };
                    var diapason = settings.max - settings.min;

                    if (settings.type === "single") {

                        nums.fromPers = (diapason !== 0) ? (nums.fromNumber - settings.min) / diapason * 100 : 0;
                        nums.fromX_pure = fullWidth / 100 * nums.fromPers;
                        nums.fromX = Math.round(nums.fromX_pure);
                        $singleSlider[0].style.left = nums.fromX + "px";
                        $.data($singleSlider[0], "x", nums.fromX_pure);

                    } else if (settings.type === "double") {

                        nums.fromPers = (diapason !== 0) ? (nums.fromNumber - settings.min) / diapason * 100 : 0;
                        nums.fromX_pure = fullWidth / 100 * nums.fromPers;
                        nums.fromX = Math.round(nums.fromX_pure);
                        $fromSlider[0].style.left = nums.fromX + "px";
                        $.data($fromSlider[0], "x", nums.fromX_pure);

                        nums.toPers = (diapason !== 0) ? (nums.toNumber - settings.min) / diapason * 100 : 1;
                        nums.toX_pure = fullWidth / 100 * nums.toPers;
                        nums.toX = Math.round(nums.toX_pure);
                        $toSlider[0].style.left = nums.toX + "px";
                        $.data($toSlider[0], "x", nums.toX_pure);

                        setDiapason();

                    }

                    numbers = nums;
                    setFields();
                };

                var moveByClick = function (page_x) {
                    is_first_start = false;

                    var x = page_x - $container.offset().left,
                        d = numbers.toX - numbers.fromX,
                        zero_point = numbers.fromX + (d / 2);

                    left = 0;
                    width = $rangeSlider.width() - sliderWidth;
                    right = $rangeSlider.width() - sliderWidth;

                    if (settings.type === "single") {
                        $activeSlider = $singleSlider;
                        $activeSlider.prop("id", "irs-active-slider");
                        dragSlider(x);
                    } else if (settings.type === "double") {
                        if (x <= zero_point) {
                            $activeSlider = $fromSlider;
                        } else {
                            $activeSlider = $toSlider;
                        }
                        $activeSlider.prop("id", "irs-active-slider");
                        dragSlider(x);
                        setDiapason();
                    }

                    $activeSlider.removeAttr("id");
                    $activeSlider = null;
                };

                var setFields = function () {
                    var _from, _fromW, _fromX,
                        _to, _toW, _toX,
                        _single, _singleW, _singleX,
                        _slW = (sliderWidth / 2),
                        maxPostfix = "";

                    if (settings.type === "single") {

                        if (numbers.fromNumber === settings.max) {
                            maxPostfix = settings.maxPostfix;
                        } else {
                            maxPostfix = "";
                        }

                        $fieldFrom[0].style.display = "none";
                        $fieldTo[0].style.display = "none";

                        if (allow_values) {
                            _single =
                                settings.prefix +
                                settings.values[numbers.fromNumber] +
                                maxPostfix +
                                settings.postfix;
                        } else {
                            _single =
                                settings.prefix +
                                prettify(numbers.fromNumber) +
                                maxPostfix +
                                settings.postfix;
                        }

                        $fieldSingle.html(_single);

                        _singleW = $fieldSingle.outerWidth(false);
                        _singleX = numbers.fromX - (_singleW / 2) + _slW;
                        if (_singleX < 0) {
                            _singleX = 0;
                        }
                        if (_singleX > normalWidth - _singleW) {
                            _singleX = normalWidth - _singleW;
                        }
                        $fieldSingle[0].style.left = _singleX + "px";

                        if (!settings.hideMinMax && !settings.hideFromTo) {
                            if (_singleX < fieldMinWidth) {
                                $fieldMin[0].style.display = "none";
                            } else {
                                $fieldMin[0].style.display = "block";
                            }

                            if (_singleX + _singleW > normalWidth - fieldMaxWidth) {
                                $fieldMax[0].style.display = "none";
                            } else {
                                $fieldMax[0].style.display = "block";
                            }
                        }

                        slider.prop("value", parseFloat(numbers.fromNumber));

                    } else if (settings.type === "double") {

                        if (numbers.fromNumber === settings.max) {
                            maxPostfix = settings.maxPostfix;
                        } else {
                            maxPostfix = "";
                        }

                        if (numbers.toNumber === settings.max) {
                            maxPostfix = settings.maxPostfix;
                        } else {
                            maxPostfix = "";
                        }

                        if (allow_values) {
                            _from =
                                settings.prefix +
                                settings.values[numbers.fromNumber] +
                                settings.postfix;

                            _to =
                                settings.prefix +
                                settings.values[numbers.toNumber] +
                                maxPostfix +
                                settings.postfix;

                            if (numbers.fromNumber !== numbers.toNumber) {
                                _single =
                                    settings.prefix +
                                    settings.values[numbers.fromNumber] +
                                    " — " + settings.prefix +
                                    settings.values[numbers.toNumber] +
                                    maxPostfix +
                                    settings.postfix;
                            } else {
                                _single =
                                    settings.prefix +
                                    settings.values[numbers.fromNumber] +
                                    maxPostfix +
                                    settings.postfix;
                            }
                        } else {
                            _from =
                                settings.prefix +
                                prettify(numbers.fromNumber) +
                                settings.postfix;

                            _to =
                                settings.prefix +
                                prettify(numbers.toNumber) +
                                maxPostfix +
                                settings.postfix;

                            if (numbers.fromNumber !== numbers.toNumber) {
                                _single =
                                    settings.prefix +
                                    prettify(numbers.fromNumber) +
                                    " — " + settings.prefix +
                                    prettify(numbers.toNumber) +
                                    maxPostfix +
                                    settings.postfix;
                            } else {
                                _single =
                                    settings.prefix +
                                    prettify(numbers.fromNumber) +
                                    maxPostfix +
                                    settings.postfix;
                            }
                        }

                        $fieldFrom.html(_from);
                        $fieldTo.html(_to);
                        $fieldSingle.html(_single);

                        _fromW = $fieldFrom.outerWidth(false);
                        _fromX = numbers.fromX - (_fromW / 2) + _slW;
                        if (_fromX < 0) {
                            _fromX = 0;
                        }
                        if (_fromX > normalWidth - _fromW) {
                            _fromX = normalWidth - _fromW;
                        }
                        $fieldFrom[0].style.left = _fromX + "px";

                        _toW = $fieldTo.outerWidth(false);
                        _toX = numbers.toX - (_toW / 2) + _slW;
                        if (_toX < 0) {
                            _toX = 0;
                        }
                        if (_toX > normalWidth - _toW) {
                            _toX = normalWidth - _toW;
                        }
                        $fieldTo[0].style.left = _toX + "px";

                        _singleW = $fieldSingle.outerWidth(false);
                        _singleX = numbers.fromX + ((numbers.toX - numbers.fromX) / 2) - (_singleW / 2) + _slW;
                        if (_singleX < 0) {
                            _singleX = 0;
                        }
                        if (_singleX > normalWidth - _singleW) {
                            _singleX = normalWidth - _singleW;
                        }
                        $fieldSingle[0].style.left = _singleX + "px";

                        if (_fromX + _fromW < _toX) {
                            $fieldSingle[0].style.display = "none";
                            $fieldFrom[0].style.display = "block";
                            $fieldTo[0].style.display = "block";
                        } else {
                            $fieldSingle[0].style.display = "block";
                            $fieldFrom[0].style.display = "none";
                            $fieldTo[0].style.display = "none";
                        }

                        if (!settings.hideMinMax && !settings.hideFromTo) {
                            if (_singleX < fieldMinWidth || _fromX < fieldMinWidth) {
                                $fieldMin[0].style.display = "none";
                            } else {
                                $fieldMin[0].style.display = "block";
                            }

                            if (_singleX + _singleW > normalWidth - fieldMaxWidth || _toX + _toW > normalWidth - fieldMaxWidth) {
                                $fieldMax[0].style.display = "none";
                            } else {
                                $fieldMax[0].style.display = "block";
                            }
                        }

                        slider.prop("value", parseFloat(numbers.fromNumber) + ";" + parseFloat(numbers.toNumber));

                    }

                    settings.from = numbers.fromNumber;
                    settings.to = numbers.toNumber;
                    callbacks();
                };


                var callbacks = function () {
                    // trigger onFinish function
                    if (typeof settings.onFinish === "function" && !is_slider_active && !is_first_start) {
                        settings.onFinish.call(this, numbers);
                    }

                    // trigger onChange function
                    if (typeof settings.onChange === "function" && !is_first_start) {
                        settings.onChange.call(this, numbers);
                    }

                    // trigger onLoad function
                    if (typeof settings.onLoad === "function" && !is_slider_active && is_first_start) {
                        settings.onLoad.call(this, numbers);
                        is_first_start = false;
                    }
                };


                var setGrid = function () {
                    $container.addClass("irs-with-grid");

                    var i,
                        text = '',
                        step = 0,
                        tStep = 0,
                        gridHTML = '',
                        smNum = 20,
                        bigNum = 4,
                        cont_width = normalWidth - (settings.gridMargin * 2);



                    for (i = 0; i <= smNum; i += 1) {
                        step = Math.floor(cont_width / smNum * i);

                        if (step >= cont_width) {
                            step = cont_width - 1;
                        }
                        gridHTML += '<span class="irs-grid-pol small" style="left: ' + step + 'px;"></span>';
                    }
                    for (i = 0; i <= bigNum; i += 1) {
                        step = Math.floor(cont_width / bigNum * i);

                        if (step >= cont_width) {
                            step = cont_width - 1;
                        }
                        gridHTML += '<span class="irs-grid-pol" style="left: ' + step + 'px;"></span>';

                        if (stepFloat) {
                            text = (settings.min + ((settings.max - settings.min) / bigNum * i));
                            text = (text / settings.step) * settings.step;
                            text = parseInt(text * stepFloat, 10) / stepFloat;
                        } else {
                            text = Math.round(settings.min + ((settings.max - settings.min) / bigNum * i));
                            text = Math.round(text / settings.step) * settings.step;
                            text = prettify(text);
                        }

                        if (allow_values) {
                            if (settings.hideMinMax) {
                                text = Math.round(settings.min + ((settings.max - settings.min) / bigNum * i));
                                text = Math.round(text / settings.step) * settings.step;
                                if (i === 0 || i === bigNum) {
                                    text = settings.values[text];
                                } else {
                                    text = "";
                                }
                            } else {
                                text = "";
                            }
                        }

                        if (i === 0) {
                            tStep = step;
                            gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px; text-align: left;">' + text + '</span>';
                        } else if (i === bigNum) {
                            tStep = step - 100;
                            gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px; text-align: right;">' + text + '</span>';
                        } else {
                            tStep = step - 50;
                            gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px;">' + text + '</span>';
                        }
                    }

                    $grid.html(gridHTML);
                    $grid[0].style.left = settings.gridMargin + "px";
                };



                // Disable state
                var setMask = function () {
                    $container.addClass("irs-disabled");
                    $container.append(disableHTML);
                };

                var removeMask = function () {
                    $container.removeClass("irs-disabled");
                    $container.find(".irs-disable-mask").remove();
                };



                placeHTML();
            });
        },
        update: function (options) {
            return this.each(function () {
                this.updateData(options);
            });
        },
        remove: function () {
            return this.each(function () {
                this.removeSlider();
            });
        }
    };

    $.fn.ionRangeSlider = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist for jQuery.ionRangeSlider');
        }
    };

}(jQuery, document, window, navigator));
