/*
 * jQuery PicTip Plugin
 * Copyright (c) 2013
 * Version: 0.2.2
 * Author: Daniel Fernandez Arias @dfernandeza
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */

(function ($) {
    /** 
     * Creates a Spot instance
     * @param index spot identifier
     * @param conf literal object containing the Spot configuration
     */
    var Spot = function (index, conf) {
        this.index = index;
        this.top = conf.top;
        this.left = conf.left;
        this.tooltip = null;
	};

    /**
     * Creates the spot DOM element
     * @param index     spot identifier
     * @param $template HTML template (wrapped in a jQuery object) to create the spot, this value is part of the plugin options 
     * @return the spot DOM element (wrapped in a jQuery object)
     */
    Spot.prototype.create = function (index, $template) {
        var $spot = $template.clone();
        $spot.css({
            position: 'absolute',
            top: this.top,
            left: this.left,
            display: 'none'
        }).addClass('spot-' + index).data({
            'index': index
        });
        return $spot;
    };

    /**
     * Open the spot related tooltip
     * @param onShow callback function. Executed after the tooltip is opened
     */
    Spot.prototype.openToolTip = function (onShow) {
        var index = this.index,
            $spot = $('.spot-' + index),
            $tooltip = $('.spot-tooltip-' + index);
        if (this.tooltip.isbubble) {
            // set tooltip coords
            $tooltip.css(this.tooltip.getCoords($spot, $tooltip));
        }
        // TODO: refactor to support different types of animations
        $tooltip.fadeIn(200, function () {
            onShow($spot[0], this);
        });
    };

    /**
     * Close the spot related tooltip
     * @param onClose callback function. Executed after the tooltip is closed
     */
    Spot.prototype.closeToolTip = function (onClose) {
        var index = this.index, $spot = $('.spot-' + index);
        $spot.removeClass('spot-open');
        $('.tooltip-' + index).fadeOut(200, function () {
            onClose($spot[0], this);
        });
    };

    /**
     * Creates a ToolTip instance
     * @param index tooltip identifier
     * @param conf literal object containing the tooltip configuration
     * @param isbubble tooltipe type (caption/bubble)
     */
    var ToolTip = function (index, conf, isbubble) {
        this.index = index;
        this.position = conf.tooltipPosition; // tooltip position (tl, tr, tc, bl, br, bc, cl, cr)
        this.id = conf.tooltipId;
        this.css = conf.tooltipCss;
        this.close = conf.tooltipClose; // add the close link?
        this.content = conf.content;
        this.isbubble = isbubble;
    };

    /**
     * Creates the tooltip DOM element
     * @return the tooltip DOM element (wrapped in a jQuery object)
     */
    ToolTip.prototype.create = function () {
        var $tt = $('<div/>', {
                'id': this.id,
                'class': 'spot-tooltip spot-tooltip-' + this.index
            }),
            $ttClose = this.close ? $('<a/>', {
                'class': 'spot-tooltip-close',
                'href': '#',
                'text': 'X'
            }) : $(),
            $ttContent = $('<div/>', {'class': 'spot-tooltip-content'}),
            pluginCss = {},
            customCss = {};
        // create the tooltip
        $ttContent.html(this.content);
        $tt.append($ttClose, $ttContent).data('index', this.index);
        // style the tooltip
        if (!this.isbubble) {
            pluginCss = {top: 0, left: 0, width: '100%'}; // use captions instead of bubble tooltips
        }
        customCss = $.extend(pluginCss, this.css); // user adds custom css
        $tt.css(customCss);
        return $tt;
    };

    /**
     * Calculates the tooltip position. Relative to the spot position.
     * @para    spot element (wrapped in a jQuery object) 
     * @param $tooltip tooltip element (wrapped in a jQuery object) 
     * @return object containing the top and left position
     */
    ToolTip.prototype.getCoords = function ($spot, $tooltip) {
        var top = 0, left = 0,
            position = this.position,
            // Spot positioning
            spotPosition = $spot.position(),
            spotTop = spotPosition.top,
            spotLeft = spotPosition.left,
            // Spot dimentions
            spotHeight = $spot.outerHeight(),
            spotWidth = $spot.outerWidth(),
            // Tooltip dimentions
            tooltipHeight = $tooltip.outerHeight(),
            tooltipWidth = $tooltip.outerWidth(),
            // relocate the tooltip to overlap the spot
            relocation = spotWidth / 2;

        // top positions
        if (position === "tl") {
            top = spotTop - tooltipHeight + relocation;
            left = spotLeft - tooltipWidth + relocation;
        }
        if (position === "tr") {
            top = spotTop - tooltipHeight + relocation;
            left = spotLeft + spotWidth - relocation;
        }
        if (position === "tc") {
            top = spotTop - tooltipHeight + relocation;
            left = spotLeft - (tooltipWidth / 2 - spotWidth / 2);
        }
        // bottom positions
        if (position === "bl") {
            top = spotTop +  spotHeight - relocation;
            left = spotLeft - tooltipWidth + relocation;
        }
        if (position === "br") {
            top = spotTop +  spotHeight - relocation;
            left = spotLeft + spotWidth - relocation;
        }
        if (position === "bc") {
            top = spotTop +  spotHeight - relocation;
            left = spotLeft - (tooltipWidth / 2 - spotWidth / 2);
        }
        // center positions
        if (position === "cl") {
            top = spotTop -  (tooltipHeight / 2 - spotHeight / 2);
            left = spotLeft - tooltipWidth + relocation;
        }
        if (position === "cr") {
            top = spotTop -  (tooltipHeight / 2 - spotHeight / 2);
            left = spotLeft + spotWidth - relocation;
        }

        return {
            top: top,
            left: left
        };
    };

    /**
     * Main plugin object
     * @param el DOM element where the plugin will be instantiated
     */
    var PicTip = function (el) {
        var $el = $(el), opts = {}, spots = [],
            /**
             * Attaches the event handlers
             */
            attachEventHandlers = function () {
                var self = this;
                // close tooltips when click the parent element
                $el.on('click', function (e) {
                    e.preventDefault();
                    self.closeToolTips();
                });
                // prevent to close the tooltip when clicked because of the event propagation
                $el.on('click', '.spot-tooltip', function (e) {
                    e.stopPropagation();
                });
                // tooltip close event 
                $el.on('click', '.spot-tooltip-close', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $el.find(opts.spotClass).removeClass('spot-open');
                    // TODO: refactor to support different types of animations
                    $(this).parent('.spot-tooltip').fadeOut(200, function () {
                        spots[$(this).data('index')].closeToolTip(opts.onCloseToolTip);
                    });
                });
                // attach spots event handler
                $el.on(opts.eventType, opts.spotClass, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $this = $(this),
                        $tooltip = $el.find('.spot-tooltip-' + $this.data('index'));
                    // TODO: should be refactored to support more than one open tooltip (if !allowMultipleToolTips)
                    $el.find('.spot-tooltip').not($tooltip).fadeOut(200);
                    opts.onCloseToolTip($('.spot-open')[0], $('.spot-tooltip')[0]);

                    $el.find(opts.spotClass).not($this).removeClass('spot-open');
                    if (!$this.hasClass('spot-open')) {
                        // open the tooltip
                        spots[$this.data('index')].openToolTip(opts.onShowToolTip);
                    } else {
                        // close the tooltip
                        $tooltip.fadeOut(200);
                        opts.onCloseToolTip(this, $tooltip[0]);
                    }
                    $this.toggleClass('spot-open');
                });
            };

        /**
         * Close all open tooltips
         */
        this.closeToolTips = function () {
            $(opts.spotClass).removeClass('spot-open');
            $el.find('.spot-tooltip').fadeOut(200, function () { // refactor to support different animations
                var index = $(this).data('index');
                opts.onCloseToolTip($('.spot-' + index)[0], this);
            });
        };
        /**
         * Destroy the plugin instance
         */
        this.destroy = function () {
            this.closeToolTips();
            $el.off('click').off(opts.eventType);
            $el.find(opts.spotClass).remove();
            $el.find('.spot-tooltip').remove();
        };
        /**
         * Initialize the plugin instance
         * @param object containing the provided plugin options
         */
        this.init = function (options) {
            opts = $.extend({}, $.fn.pictip.options, options);
            this.destroy(); // init a clean instance
            var i = 0, $spots = [], $tooltips = [],
                spotTemplate = $(opts.spotTemplate).addClass(opts.spotClass.replace('.', '')),
                spot = null,
                $spot = null,
                tooltip = null,
                $tooltip;
            for (i = 0; i < opts.spots.length; i++) {
                spot = new Spot(i, opts.spots[i]);
                tooltip = new ToolTip(i, opts.spots[i], opts.tooltip);
                spot.tooltip = tooltip;
                $spot = spot.create(i, spotTemplate);
                spots.push(spot);
                $spots.push($spot);
                $tooltip = tooltip.create();
                $tooltips.push($tooltip);
            }
            $el.append($spots, $tooltips);

            $el.find(opts.spotClass).fadeIn(200); // show spots
            attachEventHandlers.call(this);
        };
        // Expose the instance
        $el.data('pictip', this);
    };

    // Extending the jQuery library
	$.fn.pictip = function (options) {
        return this.each(function () {
            new PicTip(this).init(options);
        });
    };

    // Default options
    $.fn.pictip.options = {
        spots: [], // spots array
        spotClass: ".spot", // spots class
        spotTemplate: "<a href='#'></a>", // HTML markup to create the spots
        eventType: 'click', // type of event that trigger the tooltip/caption display action (click, hover)
        tooltip: true, // display tooltip/caption? (use caption for a better mobile experience) 
        onShowToolTip: function (spot, tooltip) {}, // function executed after the tooltip is displayed
        onCloseToolTip: function (spot, tooltip) {} // function executed after the tooltip is closed
    };
    
})(jQuery);