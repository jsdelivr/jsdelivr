/*
* jHtmlAreaColorPickerMenu 0.7.0 - A Color Picker Extension to jHtmlArea
* Part of the jHtmlArea Project
* Copyright (c) 2009 Chris Pietschmann
* http://jhtmlarea.codeplex.com
* Licensed under the Microsoft Reciprocal License (Ms-RL)
* http://jhtmlarea.codeplex.com/license
*/
(function($) {
    if (jHtmlArea) {
        var oldForecolor = jHtmlArea.fn.forecolor;
        jHtmlArea.fn.forecolor = function(c) {
            if (c) {
                // If color is specified, then use the "default" method functionality
                oldForecolor.call(this, c);
            } else {
                // If no color is specified, then display color picker ui
                var that = this;
                var rng = this.getRange();
                jHtmlAreaColorPickerMenu($(".forecolor", this.toolbar), {
                    colorChosen: function(color) {
                        if ($.browser.msie) {
                            rng.execCommand("ForeColor", false, color);
                        } else {
                            that.forecolor(color);
                        }
                    }
                });
            }
        };
    }
    var menu = window.jHtmlAreaColorPickerMenu = function(ownerElement, options) {
        return new jHtmlAreaColorPickerMenu.fn.init(ownerElement, options);
    };
    menu.fn = menu.prototype = {
        jhtmlareacolorpickermenu: "0.7.0",

        init: function(ownerElement, options) {
            var opts = $.extend({}, menu.defaultOptions, options);
            var that = this;
            var owner = this.owner = $(ownerElement);
            var position = owner.position();

            if (menu.instance) {
                menu.instance.hide();
            }
            jHtmlAreaColorPickerMenu.instance = this;

            var picker = this.picker = $("<div/>").css({
                position: "absolute",
                left: position.left + opts.offsetLeft,
                top: position.top + owner.height() + opts.offsetTop,
                "z-index": opts["z-index"]
            }).addClass("jHtmlAreaColorPickerMenu");

            for (var i = 0; i < opts.colors.length; i++) {
                var c = opts.colors[i];
                $("<div/>").css("background-color", c).appendTo(picker).click(
                    (function(color) {
                        return function() {
                            if (opts.colorChosen) {
                                opts.colorChosen.call(this, color);
                            }
                            that.hide();
                        };
                    })(c)
                );
            }

            $("<div/>").html("<div></div>Automatic").addClass("automatic").appendTo(picker).click(
                function() {
                    if (opts.colorChosen) {
                        opts.colorChosen.call(this, null);
                    }
                    that.hide();
                }
            );


            var autoHide = false;
            picker.appendTo(owner.parent()).
                show().
                mouseout(function() {
                    autoHide = true;
                    that.currentTimeout = window.setTimeout(function() { if (autoHide === true) { that.hide(); } }, 1000);
                }).
                mouseover(function() {
                    if (that.currentTimeout) {
                        window.clearTimeout(that.currentTimeout);
                        that.currentTimeout = null;
                    }
                    autoHide = false;
                });
        },
        hide: function() {
            this.picker.hide();
            this.picker.remove();
        }
    };
    menu.fn.init.prototype = menu.fn;

    menu.defaultOptions = {
        "z-index": 0,
        offsetTop: 0,
        offsetLeft: 0,
        colors: [
            "#ffffff",
            "#cccccc",
            "#c0c0c0",
            "#999999",
            "#666666",
            "#333333",
            "#000000",

            "#ffcccc",
            "#ff6666",
            "#ff0000",
            "#cc0000",
            "#990000",
            "#660000",
            "#330000",

            "#ffcc99",
            "#ff9966",
            "#ff9900",
            "#ff6600",
            "#cc6600",
            "#993300",
            "#663300",

            "#ffff99",
            "#ffff66",
            "#ffcc66",
            "#ffcc33",
            "#cc9933",
            "#996633",
            "#663333",

            "#ffffcc",
            "#ffff33",
            "#ffff00",
            "#ffcc00",
            "#999900",
            "#666600",
            "#333300",

            "#99ff99",
            "#66ff99",
            "#33ff33",
            "#33cc00",
            "#009900",
            "#006600",
            "#003300",

            "#99FFFF",
            "#33FFFF",
            "#66CCCC",
            "#00CCCC",
            "#339999",
            "#336666",
            "#003333",

            "#CCFFFF",
            "#66FFFF",
            "#33CCFF",
            "#3366FF",
            "#3333FF",
            "#000099",
            "#000066",

            "#CCCCFF",
            "#9999FF",
            "#6666CC",
            "#6633FF",
            "#6600CC",
            "#333399",
            "#330099",

            "#FFCCFF",
            "#FF99FF",
            "#CC66CC",
            "#CC33CC",
            "#993399",
            "#663366",
            "#330033"
        ],
        colorChosen: null
    };
})(jQuery);