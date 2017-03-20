/*!
 * Figuration (v3.0.0-alpha.1)
 * http://figuration.org
 * Copyright 2013-2017 CAST, Inc.
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * -----
 * Portions Copyright 2011-2017  the Bootstrap Authors and Twitter, Inc.
 * Used under MIT License (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('CAST Figuration\'s JavaScript requires jQuery');
}

(function($) {
  var version = $.fn.jquery.split(' ')[0].split('.');
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('CAST Figuration\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  }
})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): util.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    // =====
    // Private util helpers
    // =====

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function doCallback(callback) {
        if (callback) { callback(); }
    }

    // =====
    // TransitionEnd support/emulation
    // =====

    var transition = false;
    var TRANSITION_END = 'cfwTransitionEnd';

    function CFW_transitionEndTest() {
        var div = document.createElement('div');

        var transitionEndEvents = {
            transition       : 'transitionend',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            WebkitTransition : 'webkitTransitionEnd'
        };

        // Test for browser specific event name to bind
        for (var eventName in transitionEndEvents) {
            if (div.style[eventName] !== undefined) {
                return { end: transitionEndEvents[eventName] };
            }
        }

        // No browser transitionEnd support - use custom event name
        return { end: TRANSITION_END };
    }

    // Get longest CSS transition duration
    function CFW_transitionCssDuration($node) {
        var durationArray = [0]; // Set a min value -- otherwise get `Infinity`
        $node.each(function() {
            var durations = $node.css('transition-duration') || $node.css('-webkit-transition-duration') || $node.css('-moz-transition-duration') || $node.css('-ms-transition-duration') || $node.css('-o-transition-duration');
            if (durations) {
                var times = durations.split(',');
                for (var i = times.length; i--;) { // Reverse loop should be faster
                    durationArray = durationArray.concat(parseFloat(times[i]));
                }
            }
        });

        var duration = Math.max.apply(Math, durationArray); // http://stackoverflow.com/a/1379560
        duration = duration * 1000; // convert to milliseconds

        return duration;
    }

    function CFW_transitionEndEmulate(start, complete) {
        var duration = CFW_transitionCssDuration(this);

        if (duration) {
            var called = false;
            this.one(TRANSITION_END, function() {
                if (!called) {
                    called = true;
                    doCallback(complete);
                }
            });

            // Set timeout as fallback for instances where transitionEnd is not called.
            // This way the complete callback is always executed.
            setTimeout(function() {
                if (!called) {
                    called = true;
                    doCallback(complete);
                }
            }, duration);

            doCallback(start);
        } else {
            doCallback(start);
            doCallback(complete);
        }
        return this;
    }

    function CFW_transitionEndSpecial() {
        return {
            bindType: transition.end,
            delegateType: transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) {
                    return e.handleObj.handler.apply(this, arguments);
                }
                return undefined;
            }
        };
    }

    transition = CFW_transitionEndTest();
    $.fn.CFW_transition = CFW_transitionEndEmulate;
    $.event.special[TRANSITION_END] = CFW_transitionEndSpecial();

    // =====
    // Public Utils
    // =====

    $.fn.CFW_getID = function(prefix) {
        var $node = $(this);
        var nodeID = $node.attr('id');
        if (nodeID === undefined) {
            do nodeID = prefix + '-' + ~~(Math.random() * 1000000); // "~~" acts like a faster Math.floor() here
            while (document.getElementById(nodeID));
            $node.attr('id', nodeID);
        }
        return nodeID;
    };

    $.fn.CFW_trigger = function(eventName, extraData) {
        var e = $.Event(eventName);
        if ($.isPlainObject(extraData)) {
            e = $.extend({}, e, extraData);
        }
        $(this).trigger(e);
        if (e.isDefaultPrevented()) {
            return false;
        }
        return true;
    };

    $.fn.CFW_parseData = function(name, object) {
        var parsedData = {};
        var $node = $(this);
        var data = $node.data();
        name = name.capitalize();

        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                var propName = prop.capitalize();
                if (typeof data['cfw' + name + propName] !== 'undefined') {
                    parsedData[prop] = data['cfw' + name + propName];
                }
            }
        }
        return parsedData;
    };

    $.fn.CFW_throttle = function(fn, threshhold, scope) {
        /* From: http://remysharp.com/2010/07/21/throttling-function-calls/ */
        if (threshhold === undefined) { threshhold = 250; }
        var last;
        var deferTimer;
        return function() {
            var context = scope || this;

            var now = +new Date();
            var args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };

    $.fn.CFW_measureScrollbar = function() {
        var $body = $(document.body);
        var scrollDiv = document.createElement('div');
        scrollDiv.setAttribute('style', ' position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll;');
        $body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        $body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): drag.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Drag = function(element, options) {
        this.$element = $(element);
        this.dragging = false;
        this.dragdata = {};

        this.settings = $.extend({}, CFW_Widget_Drag.DEFAULTS, options);

        this._init();
    };

    CFW_Widget_Drag.DEFAULTS = {
        handle : null   // selector for handle target elements
    };

    CFW_Widget_Drag.prototype = {

        _init : function() {
            this._reset();
            this._dragStartOn();
            this.$element.CFW_trigger('init.cfw.drag');
        },

        dispose : function() {
            if (this.$element[0].detachEvent) {
                this.$element[0].detachEvent('ondragstart', this._dontStart);
            }
            this._dragStartOff();
            this.$element
                .off('.cfw.drag')
                .removeData('cfw.drag');

            this.$element = null;
            this.dragging = null;
            this.dragdata = null;
            this.settings = null;
        },

        _dragStartOn : function() {
            this.$element.on('mousedown.cfw.dragstart touchstart.cfw.dragstart MSPointerDown.cfw.dragstart', $.proxy(this._dragStart, this));
            // prevent image dragging in IE...
            if (this.$element[0].attachEvent) {
                this.$element[0].attachEvent('ondragstart', this._dontStart);
            }
        },

        _dragStartOff : function(e) {
            if (e) e.preventDefault();
            $(document).off('.cfw.dragin');
            this.$element.off('.cfw.dragstart');
        },

        _dragStart : function(e) {
            var $selfRef = this;

            // check for handle selector
            if (this.settings.handle && !$(e.target).closest(this.settings.handle, e.currentTarget).length) {
                return;
            }

            this._dragStartOff(e);
            this.dragging = true;

            $(document)
                .off('.cfw.dragin')
                .on('mousemove.cfw.dragin touchmove.cfw.dragin MSPointerMove.cfw.dragin', function(e) {
                    $selfRef._drag(e);
                })
                .on('mouseup.cfw.dragin touchend.cfw.dragin MSPointerUp.cfw.dragin MSPointerCancel.cfw.dragin', function() {
                    $selfRef._dragEnd(e);
                });


            var coord = this._coordinates(e);
            this.dragdata = coord;
            this.dragdata.originalX = e.currentTarget.offsetLeft;
            this.dragdata.originalY = e.currentTarget.offsetTop;

            var props = this._properties(coord, this.dragdata);
            this.$element.CFW_trigger('dragStart.cfw.drag', props);
        },

        _drag : function(e) {
            if (!this.dragging) {
                return;
            }

            e.preventDefault();
            var coord = this._coordinates(e);
            var props = this._properties(coord, this.dragdata);
            this.$element.CFW_trigger('drag.cfw.drag', props);
        },

        _dragEnd : function(e) {
            e.preventDefault();
            this.dragging = false;
            this.dragStart = null;
            $(document).off('.cfw.dragin');

            var coord = this._coordinates(e);
            var props = this._properties(coord, this.dragdata);
            this.$element.CFW_trigger('dragEnd.cfw.drag', props);

            this._reset();
            this._dragStartOn();
        },

        _reset : function() {
            this.dragging = false;
            this.dragdata.pageX = null;
            this.dragdata.pageY = null;
        },

        _coordinates : function(e) {
            var coord = {};
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            var touches =  e.touches;
            coord.pageX = touches ? touches[0].pageX : e.pageX;
            coord.pageY = touches ? touches[0].pageY : e.pageY;
            return coord;
        },

        _properties : function(coord, dd) {
            var p = {};

            // starting position
            p.startX = dd.pageX;
            p.startY = dd.pageY;
            // pass-thru page position
            p.pageX = coord.pageX;
            p.pageY = coord.pageY;
            // distance dragged
            p.deltaX = coord.pageX - dd.pageX;
            p.deltaY = coord.pageY - dd.pageY;
            // original element position
            p.originalX = dd.originalX;
            p.originalY = dd.originalY;
            // adjusted element position
            p.offsetX = p.originalX + p.deltaX;
            p.offsetY = p.originalY + p.deltaY;

            return p;
        },

        _dontStart : function() {
            return false;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.drag');
            var options = typeof option === 'object' && option;

            if (!data && /dispose/.test(option)) {
                return false;
            }
            if (!data) {
                $this.data('cfw.drag', (data = new CFW_Widget_Drag(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Drag = Plugin;
    $.fn.CFW_Drag.Constructor = CFW_Widget_Drag;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): collapse.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Collapse = function(element, options) {
        this.$element = $(element);
        this.$target = null;
        this.$triggers = null;
        this.inTransition = false;

        var parsedData = this.$element.CFW_parseData('collapse', CFW_Widget_Collapse.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Collapse.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Collapse.DEFAULTS = {
        toggle     : null,
        animate    : true,  // If collapse targets should expand and contract
        follow     : false, // If browser focus should move when a collapse toggle is activated
        horizontal : false  // If collapse should transition horizontal (vertical is default)
    };

    CFW_Widget_Collapse.prototype = {

        _init : function() {
            // Get collapse group ID
            var collapseID = this.settings.toggle;

            // Find target by id/css selector
            var $target = $(this.settings.toggle);
            if (!$target.length) {
                // Get target (box) items
                $target = $('[data-cfw-collapse-target="' + collapseID + '"]');
            }
            if (!$target.length) {
                collapseID = this.$element.attr('href');
                $target = $(collapseID);
            }
            if (!$target.length) { return false; }
            if ((collapseID === undefined) || (collapseID.length <= 0)) { return false; }
            this.$target = $target;

            this.$element.attr({
                'data-cfw': 'collapse',
                'data-cfw-collapse-toggle': collapseID
            });

            // Build trigger collection
            this.$triggers = $('[data-cfw="collapse"][data-cfw-collapse-toggle="' + collapseID + '"],' +
                '[data-cfw="collapse"][href="' + collapseID + '"]');

            // Check for presence of trigger id - set if not present
            // var triggerID = this.$element.CFW_getID('cfw-collapse');

            // Add collpase class(es)
            this.$target.addClass('collapse');
            if (this.settings.horizontal) {
                this.$target.addClass('width');
            }

            // A button can control multiple boxes so we need to id each on box individually
            var targetList = '';

            this.$target.each(function() {
                var tempID = $(this).CFW_getID('cfw-collapse');
                targetList += (tempID + ' ');
            });
            // Set ARIA on trigger
            this.$triggers.attr('aria-controls', $.trim(targetList));

            // Determine default state
            var dimension = this.dimension();
            if (this.$triggers.hasClass('open')) {
                this.$triggers.attr('aria-expanded', 'true');
                this.$target.addClass('collapse in')[dimension]('');
            } else {
                this.$triggers.attr('aria-expanded', 'false');
            }

            // Bind click handler
            this.$element
                .on('click.cfw.collapse.toggle', $.proxy(this.toggle, this))
                .CFW_trigger('init.cfw.collapse');
        },

        toggle : function(e) {
            if (e) { e.preventDefault(); }
            if (this.$element.hasClass('open') || this.$target.hasClass('in')) {
                this.hide();
            } else {
                this.show();
            }
        },

        dimension : function() {
            var hasWidth = this.$target.hasClass('width');
            if (hasWidth || this.settings.horizontal) {
                return 'width';
            }
            return 'height';
        },

        show : function(follow) {
            var $selfRef = this;
            if (follow === null) { follow = this.settings.follow; }

            // Bail if transition in progress
            if (this.inTransition || this.$target.hasClass('in')) { return; }

            // Start open transition
            if (!this.$element.CFW_trigger('beforeShow.cfw.collapse')) {
                return;
            }

            var dimension = this.dimension();

            this.inTransition = true;
            this.$triggers.addClass('open');

            this.$target.removeClass('collapse')[dimension](0);
            if (this.settings.animate) {
                this.$target.addClass('collapsing');
            }

            var scrollSize = $.camelCase(['scroll', dimension].join('-'));

            // Determine/set dimension size for each target (triggers the transition)
            function start() {
                $selfRef.$target.each(function() {
                    $(this)[dimension]($(this)[0][scrollSize]);
                });
            }

            function complete() {
                $selfRef.$triggers.attr('aria-expanded', 'true');
                $selfRef.$target.removeClass('collapsing').addClass('collapse in')[dimension]('');
                $selfRef.inTransition = false;
                if (follow) {
                    $selfRef.$target.attr('tabindex', '-1').get(0).trigger('focus');
                }
                $selfRef.$element.CFW_trigger('afterShow.cfw.collapse');
            }

            // Bind transition callback to first target
            this.$target.eq(0).CFW_transition(start, complete);
        },

        hide : function(follow) {
            var $selfRef = this;

            if (follow === null) { follow = this.settings.follow; }

            // Bail if transition in progress
            if (this.inTransition || !this.$target.hasClass('in')) { return; }

            // Start close transition
            if (!this.$element.CFW_trigger('beforeHide.cfw.collapse')) {
                return;
            }

            var dimension = this.dimension();

            this.inTransition = true;
            this.$triggers.removeClass('open');

            // Set dimension size and reflow before class changes for Chrome/Webkit or no animation occurs
            this.$target.each(function() {
                var $this = $(this);
                $this[dimension]($this[dimension]())[0].offsetHeight;
            });
            this.$target.removeClass('collapse in');
            if (this.settings.animate) {
                this.$target.addClass('collapsing');
            }

            // Determine/unset dimension size for each target (triggers the transition)
            function start() {
                $selfRef.$target[dimension]('');
            }

            function complete() {
                $selfRef.$triggers.attr('aria-expanded', 'false');
                $selfRef.$target.removeClass('collapsing in').addClass('collapse');
                $selfRef.inTransition = false;
                if (follow) {
                    $selfRef.$element.trigger('focus');
                }
                $selfRef.$element.CFW_trigger('afterHide.cfw.collapse');
            }

            // Bind transition callback to first target
            this.$target.eq(0).CFW_transition(start, complete);
        },

        animDisable : function() {
            this.settings.animate = false;
        },

        animEnable: function() {
            this.settings.animate = true;
        },

        dispose : function() {
            this.$element
                .off('.cfw.collapse')
                .removeData('cfw.collapse');

            this.$element = null;
            this.$target = null;
            this.$triggers = null;
            this.inTransition = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.collapse');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.collapse', (data = new CFW_Widget_Collapse(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Collapse = Plugin;
    $.fn.CFW_Collapse.Constructor = CFW_Widget_Collapse;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): dropdown.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    // Includes touch recognition fix for IE11
    // Partially from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
    /* global DocumentTouch */
    var $msTouch = window.navigator.msMaxTouchPoints === undefined ? false : window.navigator.msMaxTouchPoints;
    var $isTouch = (('ontouchstart' in window) || $msTouch || window.DocumentTouch && document instanceof DocumentTouch) ? true : false;

    var CFW_Widget_Dropdown = function(element, options) {
        this.$element = $(element);
        this.$target = null;
        this.instance = null;

        this.timerHide = null;

        var parsedData = this.$element.CFW_parseData('dropdown', CFW_Widget_Dropdown.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Dropdown.DEFAULTS, parsedData, options);
        this.settings.isTouch = $isTouch;   // Touch enabled-browser flag - override not allowed

        this.c = CFW_Widget_Dropdown.CLASSES;

        this._init();
    };

    CFW_Widget_Dropdown.CLASSES = {
        // Class names
        isMenu      : 'dropdown-menu',
        hasSubMenu  : 'dropdown-submenu',
        showSubMenu : 'show-menu',
        backdrop    : 'dropdown-backdrop',
        backLink    : 'dropdown-back',
        hover       : 'dropdown-hover'
    };

    CFW_Widget_Dropdown.DEFAULTS = {
        toggle   : null,
        delay    : 350,     // Delay for hiding menu (milliseconds)
        hover    : false,   // Enable hover style navigation
        backlink : false,   // Insert back links into submenus
        backtop  : false,   // Should back links start at top level
        backtext : 'Back'   // Text for back links
    };

    function getParent($node) {
        var $parent;
        var selector = $node.attr('data-cfw-dropdown-target');
        if (selector) {
            $parent = $(selector);
        }
        if ($parent && $parent.length) {
            return $parent;
        } else {
            return $node.parent();
        }
    }

    function clearMenus(e) {
        // Ignore right-click
        if (e && e.which === 3) { return; }
        // Find currently open menu root
        $('[data-cfw="dropdown"]').each(function() {
            var $parent = getParent($(this));
            if (!$parent.hasClass('open')) { return; }
            $(this).CFW_Dropdown('hideRev');
        });
    }

    CFW_Widget_Dropdown.prototype = {
        _init : function() {
            var $selfRef = this;

            // Get target menu
            var menuID = this.settings.toggle;
            // if ((menuID === undefined) || (menuID.length <= 0)) { return false; }

            // Find target by id/css selector
            var $target = $(this.settings.toggle);
            if (menuID !== undefined && !$target.length) {
                $target = $('[data-cfw-dropdown-target="' + menuID + '"]');
            }
            // Target by href selector
            if (!$target.length) {
                var selector = this.$element.attr('href');
                selector = selector && /#[]A-Za-z]/.test(selector);
                if (selector) {
                    $target = $(selector);
                }
                // $target = $(this.$element.attr('href'));
            }
            // Target by sibling class
            if (!$target.length) {
                $target = $(this.$element.siblings('.dropdown-menu')[0]);
            }
            if (!$target.length) { return false; }
            this.$target = $target;

            this.$element.attr('data-cfw', 'dropdown');

            // Check for presence of trigger id - set if not present
            this.instance = this.$element.CFW_getID('cfw-dropdown');

            // Top Level: add ARIA/roles and define all sub-menu links as menuitem (unless 'disabled')
            // Set tabindex=-1 so that sub-menu links can't receive keyboard focus from tabbing

            // Check for id on top level menu - set if not present
            menuID = this.$target.CFW_getID('cfw-dropdown');
            this.$target.attr({
                'aria-hidden': 'true',
                'aria-labelledby': this.instance
            })
            .addClass(this.c.isMenu);
            $('a', this.$target).attr('tabIndex', -1).not('.disabled, :disabled');

            // Set ARIA on trigger
            this.$element.attr({
                'aria-haspopup': 'true',
                'aria-expanded': 'false'
            });

            if (this.settings.backlink && this.settings.backtop) {
                var $backTop = $('<li class="' + this.c.backLink + '"><a href="#">' + this.settings.backtext + '</a></li>')
                    .prependTo(this.$target);
                if (this.$target.hasClass('dropdown-menu-left')) {
                    $backTop.addClass('dropdown-back-left');
                }
            }

            // Check for sub menu items and add indicator, id, and direction as needed
            this.$target.find('ul').each(function() {
                var $subMenu = $(this);
                var $subLink = $subMenu.closest('li').find('a').eq(0);
                var subLinkID = $subLink.CFW_getID('cfw-dropdown');
                // var subMenuID = $subMenu.CFW_getID('cfw-dropdown');

                var $dirNode = $subMenu.closest('.dropdown-menu-left, .dropdown-menu-right');
                if ($dirNode.hasClass('dropdown-menu-left')) {
                    $subMenu.closest('li').addClass('dropdown-subalign-left');
                } else {
                    $subMenu.closest('li').addClass('dropdown-subalign-right');
                }

                if ($selfRef.settings.backlink) {
                    var $backElm = $('<li class="' + $selfRef.c.backLink + '"><a href="#">' + $selfRef.settings.backtext + '</a></li>')
                        .prependTo($subMenu);
                    if ($dirNode.hasClass('dropdown-menu-left')) {
                        $backElm.addClass('dropdown-back-left');
                    }
                }

                $subMenu.attr({
                    // 'role': 'menu',
                    'aria-hidden': 'true',
                    'aria-labelledby': subLinkID
                })
                .addClass($selfRef.c.isMenu)
                .closest('li').addClass($selfRef.c.hasSubMenu);

                $subLink.attr({
                    'aria-haspopup': 'true',
                    'aria-expanded': 'false'
                });
            });

            // Set role on dividers
            $('.dropdown-divider', this.$target).attr('role', 'separator');

            // Touch OFF - Hover mode
            if (!this.settings.isTouch && this.settings.hover) {
                this.navEnableHover();
            }

            // Default Mode - Click mode
            // Touch ON - handle click/tap style navigation
            this.navEnableClick();

            // Always on - Keyboard navigation
            this.navEnableKeyboard();

            this.$element.CFW_trigger('init.cfw.dropdown');
        },

        navEnableClick : function() {
            var $selfRef = this;
            // Trigger
            this.$element.on('click.cfw.dropdown.modeClick', function(e) {
                $selfRef.toggleMenu(e, $selfRef.$element, $selfRef.$target);
            });
            // Sub menu
            var $subelement = this.$target.find('ul').closest('li').find('a:eq(0)');
            if ($subelement.length) {
                $subelement.on('click.cfw.dropdown.modeClick', function(e) {
                    var $subMenuElm = $(this).parent().find('ul').eq(0);
                    $selfRef.toggleMenu(e, $(this), $subMenuElm);
                });
            }
            // Back link
            var $backLinkElm = this.$target.find('.' + this.c.backLink);
            if ($backLinkElm.length) {
                $backLinkElm.on('click.cfw.dropdown.modeClick', function(e) {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }

                    if ($selfRef.settings.backtop && ($(this).closest('ul')[0] == $selfRef.$target[0])) {
                        $selfRef.closeUp($(this).closest('li'));
                    } else {
                        $selfRef.closeUp($(this).closest('.' + $selfRef.c.hasSubMenu));
                    }
                });
            }
        },

        navEnableHover : function() {
            var $selfRef = this;
            if (!this.settings.isTouch) {
                $.each([this.$element, this.$target, this.$target.find('.' + this.c.hasSubMenu)], function() {
                    $(this).on('mouseenter.cfw.dropdown.modeHover', function(e) {
                        $selfRef._actionsHoverEnter(e, this);
                    });
                    $(this).on('mouseleave.cfw.dropdown.modeHover', function(e) {
                        $selfRef._actionsHoverLeave(e, this);
                    });
                });
            }
        },

        navDisableHover : function() {
            this.$element.off('.cfw.dropdown.modeHover');
            this.$target.find('.' + this.c.hasSubMenu).off('.cfw.dropdown.modeHover');
        },

        navEnableKeyboard : function() {
            var $selfRef = this;

            // Auto-closing of inactive sub menus
            this.$target.find('a').on('focus.cfw.dropdown', function() {
                var $node = $(this);
                $selfRef.$target.find('.' + $selfRef.c.hasSubMenu + '.open').each(function() {
                    // Ignore parents of item being focused - needed for nesting
                    if (!$(this).find($node).length) {
                        var $snode = $(this).children('a');
                        var $ssubNode = $node.parent().find('ul').eq(0);
                        $selfRef.hideMenu(null, $snode, $ssubNode);
                    }
                });
            });

            // Key handling
            $.each([this.$element, this.$target, this.$target.find('.' + this.c.hasSubMenu)], function() {
                $(this).on('keydown.cfw.dropdown', function(e) {
                    $selfRef._actionsKeydown(e, this);
                });
            });
        },

        toggleMenu : function(e, $trigger, $menu) {
            if ($trigger.add().parent().is('.disabled, :disabled')) { return; }

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');

            // Check to see if link should be followed (sub-menu open and link is not '#')
            var nodeHref = $trigger.attr('href');
            if (nodeHref && !(/^#$/.test(nodeHref)) && showing) {
                clearMenus();
                return;
            }

            if (e) e.stopPropagation();

            if (!showing) {
                this.showMenu(e, $trigger, $menu);
            } else {
                this.hideMenu(e, $trigger, $menu);
            }

            $trigger.trigger('focus');
        },

        showMenu : function(e, $trigger, $menu) {
            var $selfRef = this;

            if (e) e.preventDefault();

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');
            if (showing) { return; }

            if (!$trigger.CFW_trigger('beforeShow.cfw.dropdown')) {
                return;
            }

            if ($trigger.is(this.$element)) {
                if (this.settings.isTouch) {
                    $('.' + this.c.backdrop).remove();
                    $(document.createElement('div'))
                        .addClass(this.c.backdrop)
                        .insertAfter(this.$target)
                        .on('click.cfw.dropdown', clearMenus);
                }
                clearMenus();
                if (!$parent.hasClass(this.c.hover)) {
                    $trigger.trigger('focus');
                }

                // Handle loss of focus
                $(document)
                    .on('focusin.cfw.dropdown.' + this.instance, function(e) {
                        if ($selfRef.$element[0] !== e.target && !$selfRef.$target.has(e.target).length) {
                            $selfRef.hideRev();
                        }
                    });
            }

            // Find other open sub menus and close them
            this.$target.find('.' + this.c.hasSubMenu + '.open').each(function() {
                // Ignore parents of item to be shown - needed for nesting
                if (!$(this).find($trigger).length) {
                    var $snode = $(this).children('a');
                    var $ssubNode = $trigger.parent().find('ul').eq(0);
                    $selfRef.hideMenu(null, $snode, $ssubNode);
                }
            });

            $parent.addClass('open');
            $trigger.attr('aria-expanded', 'true');
            $menu.removeAttr('aria-hidden');
            //  .children('li').not('.disabled, :disabled');
            //  .children('a').attr('tabIndex', 0);
            this.$target.find('li').redraw();

            $trigger.CFW_trigger('afterShow.cfw.dropdown');
        },

        hideMenu : function(e, $trigger, $menu) {
            if (e) e.preventDefault();

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');
            if (!showing) { return; }

            if (!$trigger.CFW_trigger('beforeHide.cfw.dropdown')) {
                return;
            }

            if ($trigger.is(this.$element)) {
                $(document).off('focusin.cfw.dropdown.' + this.instance);
                $('.' + this.c.backdrop).remove();
            }

            // Find open sub menus
            var openSubMenus = $menu.find('.' + this.c.hasSubMenu + '.open');
            if (openSubMenus.length) {
                var openSubMenusRev = openSubMenus.toArray().reverse();
                for (var i = 0; i < openSubMenusRev.length; i++) {
                    var $node = $(openSubMenusRev[i]).children('a');
                    var $subNode = $node.parent().find('ul').eq(0);
                    this.hideMenu(null, $node, $subNode);
                }
            }

            $parent.removeClass('open');
            $trigger.attr('aria-expanded', 'false');
            $menu.attr('aria-hidden', 'true')
                .find('a').attr('tabIndex', -1);
            if (!$parent.hasClass(this.c.hover)) {
                $trigger.trigger('focus');
            }
            $parent.removeClass(this.c.hover);
            $trigger.CFW_trigger('afterHide.cfw.dropdown');
        },

        toggle : function() {
            this.toggleMenu(null, this.$element, this.$target);
        },

        show : function() {
            this.showMenu(null, this.$element, this.$target);
        },

        hide : function() {
            this.hideMenu(null, this.$element, this.$target);
        },

        hideRev : function() {
            this.hideMenu(null, this.$element, this.$target);
        },

        closeUp : function($node) {
            var $subNode;
            if ($node.hasClass('open')) {
                $node = $node.find('a').eq(0);
            } else {
                $node = $node.closest('.open').find('[data-cfw="dropdown"], a').eq(0);
            }

            $subNode = $node.find('ul').eq(0);
            this.hideMenu(null, $node, $subNode);

            var $parent = getParent($node);
            if (!$parent.hasClass(this.c.hover)) {
                $node.trigger('focus');
            }
            $parent.removeClass(this.c.hover);
        },

        _actionsKeydown : function(e, node) {
            // 37-left, 38-up, 39-right, 40-down, 27-esc, 32-space, 9-tab
            if (!/(37|38|39|40|27|32|9)/.test(e.which)) { return; }

            var $node = $(node);
            var $items = null;

            // Close menu when tab pressed, move to next item
            if (e.which == 9) {
                clearMenus();
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            // Close current focused menu with ESC
            if (e.which == 27) {
                if ($node.is(this.$element) || $node.is(this.$target)) {
                    this.hideMenu(null, this.$element, this.$target);
                    return;
                }
                if ($node.hasClass(this.c.hasSubMenu)) {
                    this.closeUp($node);
                    return;
                }
            }

            // Arrow key navigation
            var $eTarget = $(e.target);
            var $parent = null;

            // Find parent menu
            if ($node.is(this.$element) || $node.is(this.$target)) {
                $parent = this.$target;
            } else {
                $parent = $eTarget.closest('.dropdown-menu');
            }

            $parent.removeClass(this.c.hover);

            // Up/Down
            if (e.which == 38 || e.which == 40) {
                if ($parent.is(':hidden')) {
                    this.showMenu(null, $node, $parent);
                    return;
                }

                $items = $parent.children('li').children('a:not(.disabled):visible');
                if (!$items.length) { return; }

                // Find current focused menu item
                var index = $items.index(e.target);

                if (e.which == 38 && index > 0)                 { index--;   } // up
                if (e.which == 40 && index < $items.length - 1) { index++;   } // down
                if (!~index)                                    { index = 0; } // force first item

                $items.eq(index).trigger('focus');
            } // END - Up/Down

            // Left/Right
            if (e.which == 37 || e.which == 39) {
                // Only for children of menu
                if (!$.contains(this.$target[0], $eTarget[0])) { return; }
                // Only if has submenu class
                if (!$eTarget.closest('li.dropdown-submenu')) { return; }

                // Open/close sub-menu as needed
                var $subMenuElm = $eTarget.parent().find('ul').eq(0);
                var $parMenuElm = $eTarget.closest('li.dropdown-submenu').parent('ul.dropdown-menu');
                var subHidden = $subMenuElm.is(':hidden');
                var parHidden = $parMenuElm.is(':hidden');

                if (e.which == 39 && subHidden) {
                    this.showMenu(null, $eTarget, $subMenuElm);
                    $items = $subMenuElm.children('li').children('a:not(.disabled):visible');
                    $items.eq(0).trigger('focus');
                    return;
                }

                if (e.which == 37 && !parHidden) {
                    this.closeUp($node);
                    return;
                }
            } // END - Left/Right
        },

        _actionsHoverEnter : function(e, node) {
            var $node = $(node);

            clearTimeout(this.timerHide);
            if ($node.is(this.$element)) {
                getParent($node).addClass(this.c.hover);
                this.showMenu(null, this.$element, this.$target);
                return;
            }
            if ($node.hasClass(this.c.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.parent().find('ul').eq(0);
                getParent($node).addClass(this.c.hover);
                this.showMenu(null, $node, $subNode);
                return;
            }
        },

        _actionsHoverLeave : function(e, node) {
            var $selfRef = this;
            var $node = $(node);

            clearTimeout(this.timerHide);
            if ($node.is(this.$element) || $node.is(this.$target)) {
                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $selfRef.$element, $selfRef.$target);
                }, this.settings.delay);
                return;
            }
            if ($node.hasClass(this.c.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.find('ul').eq(0);

                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $node, $subNode);
                }, $selfRef.settings.delay);
                return;
            }
        },

        dispose : function() {
            $(document).off('focusin.cfw.dropdown.' + this.instance);
            this.$element.CFW_Dropdown('hideRev');
            this.$target.find('.' + this.c.backLink).remove();
            this.$target.find('.' + this.c.hasSubMenu).off('.cfw.dropdown');
            this.$target.find('a').off('.cfw.dropdown');
            this.$target.off('.cfw.dropdown');
            this.$element
                .off('.cfw.dropdown')
                .removeData('cfw.dropdown');

            this.$element = null;
            this.$target = null;
            this.instance = null;
            this.timerHide = null;
            this.settings = null;
        }
    };

    /*
    $.fn.redraw = function(){
        $(this).each(function(){
            var redraw = this.offsetHeight;
        });
    };
    */
    // Force [lte IE 10] to redraw to correct layout
    // Also force Edge reflow - using bad UA test and method
    // TODO: Need to revisit this to find better options
    // Note: Parent element must be visible in order to redraw
    $.fn.redraw = function() {
        // if ((document.documentMode || 100) <= 10) {
        if (document.documentMode !== undefined){
            return this.hide(0, function() {$(this).show(); $(this).css('display', ''); });
        } else if (/Edge\/\d+/.test(navigator.userAgent)) {
            $(this).css('list-style', 'none').css('list-style', '');
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.dropdown');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.dropdown', (data = new CFW_Widget_Dropdown(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Dropdown = Plugin;
    $.fn.CFW_Dropdown.Constructor = CFW_Widget_Dropdown;

    // Handle closing menu when clicked outside of menu area
    $(window).ready(function() {
        $(document).on('click', clearMenus);
    });

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): tab.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Tab = function(element, options) {
        this.$element = $(element);
        this.$target = null;
        this.$navElm = null;

        var parsedData = this.$element.CFW_parseData('tab', CFW_Widget_Tab.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Tab.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Tab.DEFAULTS = {
        target  : null,
        animate : true // If tabs should be allowed fade in and out
    };

    CFW_Widget_Tab.prototype = {
        _init : function() {
            var $selfRef = this;

            // Find nav and target elements
            this.$navElm = this.$element.closest('ul, ol, nav');
            this.$navElm.attr('role', 'tablist');

            var $selector = $(this.settings.target);
            if (!$selector.length) {
                $selector = $(this.$element.attr('href'));
            }
            this.$target = $($selector);

            if (!this.$target.length) {
                return false;
            }

            this.$element.attr('data-cfw', 'tab');

            // Check for presence of trigger id - set if not present
            var triggerID = this.$element.CFW_getID('cfw-tab');

            // Target should have id already - set ARIA attributes
            this.$target.attr({
                'role': 'tabpanel',
                'aria-labelledby': triggerID
            });
            if (this.settings.animate) {
                this.animEnable();
            } else {
                this.animDisable();
            }

            // Set ARIA attributes on trigger
            this.$element.attr({
                'tabindex': -1,
                'role': 'tab',
                'aria-selected': 'false',
                'aria-expanded': 'false',
                'aria-controls': this.$target.attr('id')
            });

            // Bind click handler
            this.$element.on('click.cfw.tab', function(e) {
                e.preventDefault();
                $selfRef.show(e);
            });

            // Bind key handler
            this.$element.on('keydown.cfw.tab', function(e) {
                $selfRef._actionsKeydown(e, this);
            });

            // Display panel if trigger is marked active
            if (this.$element.hasClass('active')) {
                this.$element.attr({
                    'tabindex': 0,
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                this.$target.addClass('active');

                if (this.settings.animate) {
                    this.$target.addClass('in');
                }
            }

            // Check to see if there is an active element defined - if not set current one as active
            if (this.$navElm.find('.active').length <= 0) {
                this.$element.addClass('active');

                this.$element.attr({
                    'tabindex': 0,
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                this.$target.addClass('active');

                if (this.settings.animate) {
                    this.$target.addClass('in');
                }
            }

            this.$element.CFW_trigger('init.cfw.tab');
        },

        show : function(e) {
            if (e) {
                e.preventDefault();
            }

            if (this.$element.hasClass('active')
                || this.$element.hasClass('disabled')
                || this.$element[0].hasAttribute('disabled')) {
                return;
            }

            var $previous = this.$navElm.find('.active:last');
            if ($previous.length) {
                if (!$previous.CFW_trigger('beforeHide.cfw.tab', { relatedTarget: this.$element[0] })) {
                    return;
                }
            }

            if (!this.$element.CFW_trigger('beforeShow.cfw.tab', { relatedTarget: $previous[0] })) {
                return;
            }

            if ($previous.length) {
                $previous.attr({
                        'tabindex': -1,
                        'aria-selected': 'false',
                        'aria-expanded': 'false'
                    })
                    .CFW_trigger('afterHide.cfw.tab', { relatedTarget: this.$element[0] });
            }

            this.$element.attr({
                'tabindex': 0,
                'aria-selected': 'true',
                'aria-expanded': 'true'
            });

            this._activateTab(this.$element, this.$navElm, false, $previous);
            this._activateTab(this.$target, this.$target.parent(), true, $previous);
        },

        animEnable : function() {
            this.$target.addClass('fade');
            if (this.$target.hasClass('active')) {
                this.$target.addClass('in');
            }
            this.settings.animate = true;
        },

        animDisable : function() {
            this.$target.removeClass('fade in');
            this.settings.animate = false;
        },

        _actionsKeydown : function(e, node) {
            // 37-left, 38-up, 39-right, 40-down
            var k = e.which;
            if (!/(37|38|39|40)/.test(k)) { return; }

            e.stopPropagation();
            e.preventDefault();

            var $node = $(node);
            var $list = $node.closest('[role="tablist"]');
            var $items = $list.find('[role="tab"]:visible').not('.disabled');
            var index = $items.index($items.filter('[aria-selected="true"]'));

            if ((k == 38 || k == 37) && index > 0)                 { index--; }     // up & left
            if ((k == 39 || k == 40) && index < $items.length - 1) { index++; }     // down & right
            if (!~index)                                           { index = 0; }   // force first item

            var nextTab = $items.eq(index);
            nextTab.CFW_Tab('show').trigger('focus');
        },

        _activateTab : function($node, container, isPanel, $previous) {
            var $selfRef = this;
            var $prevActive = container.find('.active');
            var doTransition = isPanel && this.settings.animate;

            function complete() {
                $prevActive.removeClass('active');
                $node.addClass('active');

                if (doTransition) {
                    $node[0].offsetWidth; // Reflow for transition
                    $node.addClass('in');
                } else {
                    if (isPanel) {
                        $selfRef.settings.animate = false;
                    }
                    $node.removeClass('fade');
                }

                if (isPanel) {
                    $selfRef.$element.CFW_trigger('afterShow.cfw.tab', { relatedTarget: $previous[0] });
                }
            }

            $node.CFW_transition(null, complete);

            $prevActive.removeClass('in');
        },

        dispose : function() {
            this.$element
                .off('.cfw.tab')
                .removeData('cfw.tab');

            this.$element = null;
            this.$target = null;
            this.$navElm = null;
            this.settings = null;

        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.tab');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.tab', (data = new CFW_Widget_Tab(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Tab = Plugin;
    $.fn.CFW_Tab.Constructor = CFW_Widget_Tab;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): affix.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Affix = function(element, options) {
        this.$element = $(element);
        this.$window = $(window);
        this.$target = null;
        this.affixed = null;
        this.unpin = null;
        this.pinnedOffset = null;

        var parsedData = this.$element.CFW_parseData('affix', CFW_Widget_Affix.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Affix.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Affix.RESET = 'affix affix-top affix-bottom';

    CFW_Widget_Affix.DEFAULTS = {
        target : window,
        top    : 0,
        bottom : 0
    };

    CFW_Widget_Affix.prototype = {
        _init : function() {
            this.$element.attr('data-cfw', 'affix');

            // Bind events
            this.$target = $(this.settings.target)
                .on('scroll.cfw.affix)',  $.proxy(this.checkPosition, this))
                .on('click.cfw.affix',  $.proxy(this.checkPositionDelayed, this));

            this.$element.CFW_trigger('init.cfw.affix');

            this.checkPosition();
        },

        getState : function(scrollHeight, height, offsetTop, offsetBottom) {
            var scrollTop    = this.$target.scrollTop();
            var position     = this.$element.offset();
            var targetHeight = this.$target.height();

            if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

            if (this.affixed == 'bottom') {
                if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom';
                return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom';
            }

            var initializing   = this.affixed == null;
            var colliderTop    = initializing ? scrollTop : position.top;
            var colliderHeight = initializing ? targetHeight : height;

            if (offsetTop != null && scrollTop <= offsetTop) return 'top';
            if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom';

            return false;
        },

        getPinnedOffset : function() {
            if (this.pinnedOffset) { return this.pinnedOffset; }
            this.$element.removeClass(CFW_Widget_Affix.RESET).addClass('affix');
            var scrollTop = this.$target.scrollTop();
            var position  = this.$element.offset();
            return (this.pinnedOffset = position.top - scrollTop);
        },

        checkPositionDelayed : function() {
            setTimeout($.proxy(this.checkPosition, this), 1);
        },

        checkPosition : function() {
            if (!this.$element.is(':visible')) { return; }

            var height       = this.$element.height();
            var offsetTop    = this.settings.top;
            var offsetBottom = this.settings.bottom;
            var scrollHeight =  Math.max($(document).height(), $(document.body).height());

            if (typeof offsetTop == 'function')    { offsetTop    = offsetTop(this.$element); }
            if (typeof offsetBottom == 'function') { offsetBottom = offsetBottom(this.$element); }

            var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

            if (this.affixed != affix) {
                if (this.unpin != null) {
                    this.$element.css({
                        'top': '',
                        'position': ''
                    });
                }

                var affixType = 'affix' + (affix ? '-' + affix : '');
                var eventName = affixType + '.cfw.affix';

                if (!this.$element.CFW_trigger(eventName)) {
                    return;
                }

                this.affixed = affix;
                this.unpin = (affix == 'bottom') ? this.getPinnedOffset() : null;

                this.$element
                    .removeClass(CFW_Widget_Affix.RESET)
                    .addClass(affixType)
                    .CFW_trigger(eventName.replace('affix', 'affixed'));
            }

            if (affix == 'bottom') {
                this.$element.offset({
                    top: scrollHeight - height - offsetBottom
                });
            }
        },

        dispose : function() {
            this.$element
                .off('.cfw.affix')
                .removeClass(CFW_Widget_Affix.RESET)
                .removeData('cfw.affix');

            this.$element = null;
            this.$window = null;
            this.$target = null;
            this.affixed = null;
            this.unpin = null;
            this.pinnedOffset = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.affix');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.affix', (data = new CFW_Widget_Affix(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Affix = Plugin;
    $.fn.CFW_Affix.Constructor = CFW_Widget_Affix;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): tooltip.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Tooltip = function(element, options) {
        this.$element = null;
        this.$target = null;
        this.$viewport = null;
        this.$arrow = null;
        this.$focusLast = null;
        this.instance = null;
        this.settings = null;
        this.dataToggle = null;
        this.type = null;
        this.isDialog = false;
        this.eventTypes = null;
        this.delayTimer = null;
        this.inTransition = null;
        this.closeAdded = false;
        this.activate = false;
        this.hoverState = null;
        this.inState = null;
        this.dynamicTip = false;
        this.flags = {
            keyShift: false,
            keyTab : false
        };

        this._init('tooltip', element, options);
    };

    CFW_Widget_Tooltip.DEFAULTS = {
        toggle          : false,            // Target selector
        placement       : 'top',            // Where to locate tooltip (top/bottom/left/right/auto)
        trigger         : 'hover focus',    // How tooltip is triggered (click/hover/focus/manual)
        animate         : true,             // Should the tooltip fade in and out
        delay : {
            show        : 0,                // Delay for showing tooltip (milliseconda)
            hide        : 100               // Delay for hiding tooltip (milliseconds)
        },
        container       : false,            // Where to place tooltip if moving is needed
        viewport        : 'body',           // Viewport to constrain tooltip within
        padding         : 0,                // Padding from viewport edge
        html            : false,            // Use HTML or text insertion mode
        closetext       : '<span aria-hidden="true">&times;</span>', // Text for close links
        closesrtext     : 'Close',          // Screen reader text for close links
        title           : '',               // Title text/html to be inserted
        activate        : false,            // Auto show after init
        unlink          : false,            // If on hide to remove events and attributes from tooltip and trigger
        dispose         : false,            // If on hide to unlink, then remove tooltip from DOM
        template        : '<div class="tooltip"><div class="tooltip-body"></div><div class="tooltip-arrow"></div></div>'
    };

    CFW_Widget_Tooltip.prototype = {
        _init : function(type, element, options) {
            this.type = type;
            this.$element = $(element);
            this.settings = this.getSettings(options);

            this.$viewport = this.settings.viewport && $($.isFunction(this.settings.viewport) ? this.settings.viewport.call(this, this.$element) : (this.settings.viewport.selector || this.settings.viewport));

            this.inState = { click: false, hover: false, focus: false };

            this.$element.attr('data-cfw', this.type);

            // Find target by id/css selector - only pick first one found
            var dataToggle;
            var $findTarget = $(this.settings.toggle).eq(0);
            if ($findTarget.length) {
                dataToggle = this.settings.toggle;
            } else {
                // If not found by selector - find by 'toggle' data
                dataToggle = this.$element.attr('data-cfw-' + this.type + '-toggle');
                $findTarget = $('[data-cfw-' + this.type + '-target="' + dataToggle + '"]');
            }
            if ($findTarget.length) {
                this.dataToggle = dataToggle;
                this.$target = $findTarget;
            } else {
                this.fixTitle();
            }

            if (this.settings.activate) {
                this.settings.trigger = 'click';
            }

            // Bind events
            this.eventTypes = this.settings.trigger.split(' ');
            this.bindTip(true);

            if (this.$target) {
                this.$target.data('cfw.' + this.type, this);
            }

            if (this.settings.activate) {
                this.activate = true;
                this.inState.click = true;
                this.show();
            }

            this.$element.CFW_trigger('init.cfw.' + this.type);
        },

        getDefaults: function() {
            return CFW_Widget_Tooltip.DEFAULTS;
        },

        getSettings : function(options) {
            var parsedData = this.$element.CFW_parseData(this.type, this.getDefaults());
            var settings = $.extend({}, this.getDefaults(), parsedData, options);
            if (settings.delay && typeof settings.delay == 'number') {
                settings.delay = {
                    show: settings.delay,
                    hide: settings.delay
                };
            }
            return settings;
        },

        createTip : function() {
            var $tip = $(this.settings.template);
            return $tip;
        },

        fixTitle : function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('data-cfw-' + this.type +  '-original-title')) != 'string') {
                $e.attr('data-cfw-' + this.type +  '-original-title', $e.attr('title') || '').attr('title', '');
            }
        },

        getTitle : function() {
            var title;
            var $e = this.$element;
            var s = this.settings;

            title = (typeof s.title == 'function' ? s.title.call($e[0]) :  s.title) || $e.attr('data-cfw-' + this.type +  '-original-title');

            return title;
        },

        setContent : function() {
            var $tip = this.$target;
            var $inner = $tip.find('.tooltip-body');

            if (!this.dataToggle) {
                var title = this.getTitle();

                if (this.settings.html) {
                    $inner.html(title);
                } else {
                    $inner.text(title);
                }
            }

            $tip.removeClass('fade in top bottom left right');
        },

        linkTip : function() {
            // Check for presence of trigger and target ids - set if not present
            this.instance = this.$element.CFW_getID('cfw-' + this.type);
            this.targetID = this.$target.CFW_getID('cfw-' + this.type);

            // Set ARIA attributes on target
            this.$target.attr({
                'role': (this.type == 'tooltip' ? 'tooltip' : (this.isDialog ? 'dialog' : 'tooltip')),
                'aria-hidden': 'true',
                'tabindex': -1
            });
        },

        bindTip : function(modeInit) {
            var $selfRef = this;

            for (var i = this.eventTypes.length; i--;) {
                var eventType = this.eventTypes[i];
                if (eventType == 'click' || eventType == 'manual') {
                    this.isDialog = true;
                }
                if (eventType == 'click') {
                    // Click events
                    this.$element
                        .off('click.cfw.' + this.type)
                        .on('click.cfw.' + this.type, $.proxy(this.toggle, this));

                    // Inject close button
                    if (this.$target != null && !this.closeAdded) {
                        // Check for pre-existing close buttons
                        if (!this.$target.find('[data-cfw-dismiss="' + this.type +  '"]').length) {
                            var $close = $('<button type="button" class="close" data-cfw-dismiss="' + this.type +  '" aria-label="' + this.settings.closesrtext + '">' + this.settings.closetext + '</button>');
                            $close.prependTo(this.$target);
                            this.closeAdded = true;
                        }
                    }
                } else if (eventType != 'manual') {
                    // Hover/focus events
                    var eventIn  = (eventType == 'hover') ? 'mouseenter' : 'focusin';
                    var eventOut = (eventType == 'hover') ? 'mouseleave' : 'focusout';

                    if (modeInit) {
                        this.$element.on(eventIn  + '.cfw.' + this.type, $.proxy(this.enter, this));
                        this.$element.on(eventOut + '.cfw.' + this.type, $.proxy(this.leave, this));
                    } else {
                        this.$target.off('.cfw.' + this.type);
                        this.$target.on(eventIn  + '.cfw.' + this.type, $.proxy(this.enter, this));
                        this.$target.on(eventOut + '.cfw.' + this.type, $.proxy(this.leave, this));
                    }
                }
            }

            if (this.$target) {
                // Key handling for closing
                this.$target.off('keydown.cfw.' + this.type + '.close')
                    .on('keydown.cfw.' + this.type + '.close', function(e) {
                        var code = e.charCode || e.which;
                        if (code && code == 27) {// if ESC is pressed
                            e.stopPropagation();
                            // Click the close button if it exists otherwise force tooltip closed
                            if ($('.close', $selfRef.$target).length > 0) {
                                $('.close', $selfRef.$target).eq(0).trigger('click');
                            } else {
                                $selfRef.hide(true);
                            }
                        }
                    });

                // Bind 'close' buttons
                this.$target.off('click.dismiss.cfw.' + this.type, '[data-cfw-dismiss="' + this.type + '"]')
                    .on('click.dismiss.cfw.' + this.type, '[data-cfw-dismiss="' + this.type + '"]', function(e) {
                        $selfRef.toggle(e);
                    });
                // Hide tooltips on modal close
                this.$element.closest('.modal')
                    .off('beforeHide.cfw.modal')
                    .on('beforeHide.cfw.modal', function() {
                        $selfRef.hide(true);
                    });
            }
        },

        toggle : function(e) {
            if (e) {
                this.inState.click = !this.inState.click;

                if (!this._isInState()) {
                    this.leave();
                } else {
                    this.enter();
                }
            } else {
                // Disable delay when toggle programatically invoked
                var holdDelay = this.settings.delay;
                if (this.$target && this.$target.hasClass('in')) {
                    this.settings.delay.hide = 0;
                    this.leave();
                } else {
                    this.settings.delay.show = 0;
                    this.enter();
                }
                this.settings.delay = holdDelay;
            }
        },

        enter : function(e) {
            if (e) {
                this.inState[e.type == 'focusin' ? 'focus' : 'hover'] = true;
            }

            if ((this.$target && this.$target.hasClass('in')) || this.hoverState == 'in') {
                this.hoverState = 'in';
                return;
            }

            clearTimeout(this.delayTimer);

            this.hoverState = 'in';

            if (!this.settings.delay.show) { return this.show(); }

            var $selfRef = this;
            this.delayTimer = setTimeout(function() {
                if ($selfRef.hoverState == 'in') { $selfRef.show(); }
            }, this.settings.delay.show);
        },

        leave : function(e) {
            if (e) {
                this.inState[e.type == 'focusout' ? 'focus' : 'hover'] = false;
            }

            if (this._isInState()) { return; }

            clearTimeout(this.delayTimer);

            this.hoverState = 'out';
            if (!this.settings.delay.hide) { return this.hide(); }

            var $selfRef = this;
            this.delayTimer = setTimeout(function() {
                if ($selfRef.hoverState == 'out') { $selfRef.hide(); }
            }, this.settings.delay.hide);
        },

        show : function() {
            clearTimeout(this.delayTimer);
            var $selfRef = this;

            // Bail if transition in progress or already shown
            if (this.inTransition) { return; }
            if (this.$target && this.$target.hasClass('in')) { return; }

            if (!this.activate) {
                // Start show transition
                if (!this.$element.CFW_trigger('beforeShow.cfw.' + this.type)) {
                    return;
                }
            }

            this.inTransition = true;

            // Create/link the tooltip container
            if (!this.$target) {
                var target = this.createTip();
                if (target.length <= 0) { return false; }
                this.dynamicTip = true;
                this.$target = target;
            }
            if (this.$target.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
            }
            this.linkTip();
            this.bindTip(false);
            this.setContent();

            if (this.settings.animate) { this.$target.addClass('fade'); }

            this.locateTip();

            // Additional tab/focus handlers for non-inline items
            if (this.settings.container) {
                this.$element
                    .off('focusin.cfw.' + this.type + '.focusStart')
                    .on('focusin.cfw.' + this.type + '.focusStart', function(e) {
                        if ($selfRef.$target.hasClass('in')) {
                            // Check related target and move to start or end of popover
                            var selectables = $selfRef._tabItems();
                            var prevIndex = selectables.length - 1;
                            var $prevNode = $(e.relatedTarget);
                            // Edge case: if coming from another tooltip/popover - just place at start of target
                            // Otherwise very complex to determine where coming from and focus should be going to
                            if (($prevNode.closest('.tooltip').length > 0) || ($prevNode.closest('.popover').length > 0)) {
                                $prevNode = null;
                            }
                            if ($prevNode && $prevNode.length === 1) {
                                var currIndex = selectables.index($selfRef.$element);
                                prevIndex = selectables.index($prevNode);
                                if (currIndex < prevIndex) {
                                    var tipSels = $selfRef._tabItems($selfRef.$target);

                                    var selsIndex = tipSels.length - 2;
                                    tipSels.eq(selsIndex).trigger('focus');
                                } else {
                                    $selfRef.$target.trigger('focus');
                                }
                            } else {
                                $selfRef.$target.trigger('focus');
                            }
                        }
                    });
                this.$target
                    .off('.cfw.' + this.type + '.keyflag')
                    .on('keydown.cfw.' + this.type + '.keyflag', function(e) {
                        if (e.which == 9) {
                            $selfRef.flags.keyTab = true;
                            if (e.shiftKey) { $selfRef.flags.keyShift = true; }
                        }
                    })
                    .on('keyup.cfw.' + this.type + '.keyflag', function(e) {
                        if (e.which == 9) {
                            $selfRef.flags.keyTab = false;
                            $selfRef.flags.keyShift = false;
                        }
                    });

                // Also inject an item to fake loss of focus in case the tooltip
                // is last tabbable item in document - otherwise focus drops off page
                if (!this.$focusLast && (this.eventTypes.indexOf('click') >= 0)) {
                    this.$focusLast = $(document.createElement('span'))
                    .addClass(this.type + '-focuslast')
                    .attr('tabindex', 0)
                    .appendTo(this.$target);
                }
                if (this.$focusLast) {
                    this.$focusLast
                        .off('focusin.cfw.' + this.type + '.focusLast')
                        .on('focusin.cfw.' + this.type + '.focusLast', function(e) {
                            // Bypass this item if coming from outside of tip
                            if ($selfRef.$target[0] !== e.relatedTarget && !$selfRef.$target.has(e.relatedTarget).length) {
                                e.preventDefault();
                                return;
                            }
                            $selfRef._tabNext($selfRef.$element[0]);
                        });
                }
                this.$target
                    .off('focusout.cfw.' + this.type)
                    .on('focusout.cfw.' + this.type, function() {
                        $(document)
                            .off('focusin.cfw.' + this.type + '.' + this.instance)
                            .one('focusin.cfw.' + this.type + '.' + this.instance, function(e) {
                                if (document !== e.target && $selfRef.$target[0] !== e.target && !$selfRef.$target.has(e.target).length) {
                                    if ($selfRef.flags.keyTab) {
                                        if ($selfRef.flags.keyShift) {
                                            $selfRef._tabPrev($selfRef.$element[0]);
                                        } else {
                                            $selfRef._tabNext($selfRef.$element[0]);
                                        }
                                    }
                                    // Reset flags
                                    $selfRef.flags = {
                                        keyShift: false,
                                        keyTab: false
                                    };
                                }
                            });
                    });
            }

            this.$target.CFW_transition(null, $.proxy(this._showComplete, this));
        },

        hide : function(force) {
            clearTimeout(this.delayTimer);

            // Handle delayed show and target not created
            if (!this.$target) { return; }

            if (force === undefined) { force = false; }
            if (force) {
                this._hideComplete();
                return;
            }

            // Bail if transition in progress or already hidden
            if (this.inTransition || !this.$target.hasClass('in')) { return; }

            // Start hide transition
            if (!this.$element.CFW_trigger('beforeHide.cfw.' + this.type)) {
                return;
            }

            this.inTransition = true;
            this.$target.removeClass('in');

            this.inState = { click: false, hover: false, focus: false };

            this.$target.CFW_transition(null, $.proxy(this._hideComplete, this));

            this.hoverState = null;
        },

        unlink : function(force) {
            var $selfRef = this;
            if (force === undefined) { force = false; }
            clearTimeout(this.delayTimer);

            this.$element.CFW_trigger('beforeUnlink.cfw.' + this.type);

            if (this.$target && this.$target.hasClass('in')) {
                this.$element.one('afterHide.cfw.' + this.type, function() {
                    $selfRef._unlinkComplete();
                });
                this.hide(force);
            } else {
                this._unlinkComplete();
            }
        },

        _unlinkComplete : function() {
            var $element = this.$element;
            var type = this.type;

            if (this.$target) {
                this.$target.off('.cfw.' + this.type)
                    .removeData('cfw.' + this.type);
            }
            this.$element.off('.cfw.' + this.type)
                .removeAttr('data-cfw')
                .removeData('cfw.' + this.type);

            this.$element = null;
            this.$target = null;
            this.$viewport = null;
            this.$arrow = null;
            this.$focusLast = null;
            this.instance = null;
            this.settings = null;
            this.dataToggle = null;
            this.type = null;
            this.isDialog = null;
            this.eventTypes = null;
            this.delayTimer = null;
            this.inTransition = null;
            this.closeAdded = null;
            this.activate = null;
            this.hoverState = null;
            this.inState = null;
            this.dynamicTip = null;
            this.flags = null;

            this._unlinkCompleteExt();

            $element.CFW_trigger('afterUnlink.cfw.' + type);
        },

        _unlinkCompleteExt : function() {
            // unlink complete extend
            return;
        },

        dispose : function() {
            var $target = this.$target;

            $(document).one('afterUnlink.cfw.' + this.type, this.$element, function(e) {
                var $this = $(e.target);
                if ($target) {
                    $target.remove();
                }
                $this.CFW_trigger('dispose.cfw.' + this.type);
            });
            this.unlink();
        },

        locateTip : function() {
            var $tip = this.$target;

            $tip.removeClass('top left bottom right');

            $tip.detach()
                .css({ top: 0, left: 0, display: 'block' });

            var placement = typeof this.settings.placement == 'function' ?
                this.settings.placement.call(this, this.$target[0], this.$element[0]) :
                this.settings.placement;

            if (typeof placement == 'object') {
                // Custom placement
                this.settings.container = 'body';
                $tip.appendTo(this.settings.container);
                this.$element.CFW_trigger('inserted.cfw.' + this.type);
                $tip.offset(placement);
                $tip.addClass('in');
            } else {
                // Standard Placement
                var autoToken = /\s?auto?\s?/i;
                var autoPlace = autoToken.test(placement);
                if (autoPlace) {
                    placement = placement.replace(autoToken, '') || CFW_Widget_Tooltip.DEFAULTS.placement;
                }

                $tip.addClass(placement)
                    .data('cfw.' + this.type, this);

                if (this.settings.container) {
                    $tip.appendTo(this.settings.container);
                } else {
                    $tip.insertAfter(this.$element);
                }
                this.$element.CFW_trigger('inserted.cfw.' + this.type);

                var pos          = this._getPosition();
                var actualWidth  = $tip[0].getBoundingClientRect().width;
                var actualHeight = $tip[0].getBoundingClientRect().height;

                if (autoPlace) {
                    var orgPlacement = placement;

                    var viewportDim = this.getViewportBounds();

                    placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                                placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                                placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                                placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                                placement;

                    $tip.removeClass(orgPlacement)
                        .addClass(placement)
                        .data('cfw.' + this.type, this);
                }

                var calculatedOffset = this._getCalculatedOffset(placement, pos, actualWidth, actualHeight);

                this._applyPlacement(calculatedOffset, placement);
            }
        },

        _showComplete : function() {
            var $selfRef = this;
            var prevHoverState = this.hoverState;
            this.hoverState = null;

            // this.$target.addClass('in')
            this.$target.removeAttr('aria-hidden');

            if (this.isDialog) {
                this.$target.trigger('focus');
            }

            this.inTransition = false;

            // Delay to keep NVDA (and other screen readers?) from reading dialog header twice
            setTimeout(function() {
                // Handle case of immediate dispose after show
                if ($selfRef.$element) {
                    $selfRef.$element.attr('aria-describedby', $selfRef.targetID);
                }
            }, 25);

            if (!this.activate) {
                this.$element.CFW_trigger('afterShow.cfw.' + this.type);
            }
            this.activate = false;

            if (prevHoverState == 'out') { this.leave(); }
        },

        _hideComplete : function() {
            this.$element
                .off('.cfw.' + this.type + '.focusStart')
                .off('.cfw.modal')
                .removeAttr('aria-describedby');
            this.$target
                .off('.cfw.' + this.type)
                .removeClass('in');
            if (this.$focusLast) {
                this.$focusLast.off('.cfw.' + this.type + '.focusLast');
            }
            $(document).off('.cfw.' + this.type + '.' + this.instance);

            this.$target
                .removeClass('in')
                .css('display', 'none')
                .attr({
                    'aria-hidden': 'true',
                    'role':  ''
                });

            this.inTransition = false;
            if (this.isDialog) {
                this.$target.attr('tabindex', -1);
                this.$element.trigger('focus');
            }

            // Only remove dynamically created tips
            if (this.hoverState != 'in' && this.dynamicTip) {
                this._removeDynamicTip();
            }

            this.$element.CFW_trigger('afterHide.cfw.' + this.type);
        },

        _removeDynamicTip : function() {
            this.$target.remove();
            this.dynamicTip = false;
            this.closeAdded = false;
            this.$arrow = null;
            this.$target = null;
        },

        _getPosition : function() {
            var $element = this.$element;
            var el = $element[0];
            var isBody = el.tagName == 'BODY';

            var elRect = el.getBoundingClientRect();
            elRect = $.extend({}, elRect, {
                top: elRect.top + window.pageYOffset,
                left: elRect.left + window.pageXOffset
            });

            var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
            // SVG/Chrome issue: https://github.com/jquery/jquery/issues/2895
            if ($element[0].className instanceof SVGAnimatedString) {
                elOffset = {};
            }

            var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
            var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;
            return $.extend({}, elRect, scroll, outerDims, elOffset);
        },

        _getCalculatedOffset : function(placement, pos, actualWidth, actualHeight) {
            return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
                   placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                   placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
        },

        _applyPlacement : function(offset, placement) {
            var $tip   = this.$target;
            var width  = $tip[0].getBoundingClientRect().width;
            var height = $tip[0].getBoundingClientRect().height;

            // manually read margins because getBoundingClientRect includes difference
            var marginTop = parseInt($tip.css('margin-top'), 10);
            var marginLeft = parseInt($tip.css('margin-left'), 10);

            // we must check for NaN for IE 9
            if (isNaN(marginTop))  marginTop  = 0;
            if (isNaN(marginLeft)) marginLeft = 0;

            offset.top  = offset.top  + marginTop;
            offset.left = offset.left + marginLeft;

            // $.fn.offset doesn't round pixel values
            // so we use setOffset directly with our own function B-0
            $.offset.setOffset($tip[0], $.extend({
                using: function(props) {
                    $tip.css({
                        top: Math.round(props.top),
                        left: Math.round(props.left)
                    });
                }
            }, offset), 0);

            $tip.addClass('in');

            // check to see if placing tip in new offset caused the tip to resize itself
            var actualWidth  = $tip[0].getBoundingClientRect().width;
            var actualHeight = $tip[0].getBoundingClientRect().height;

            if (placement == 'top' && actualHeight != height) {
                offset.top = offset.top + height - actualHeight;
            }

            var delta = this._getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

            if (delta.left) {
                offset.left += delta.left;
            } else {
                offset.top += delta.top;
            }

            var isVertical          = /top|bottom/.test(placement);
            var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

            $tip.offset(offset);
            this._replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
        },

        getViewportBounds : function() {
            var $viewport = this.$viewport;
            var elRect = $viewport[0].getBoundingClientRect();

            if ($viewport.is('body') && (/fixed|absolute/).test(this.$element.css('position'))) {
                // fixed and absolute elements should be tested against the window
                return $.extend({}, elRect, this.getScreenSpaceBounds($viewport));
            }

            return $.extend({}, elRect, $viewport.offset(), { width: $viewport.outerWidth(), height: $viewport.outerHeight() });
        },

        getScreenSpaceBounds : function($viewport) {
            return {
                top: $viewport.scrollTop(),
                left: $viewport.scrollLeft(),
                width: $(window).width(),
                height: $(window).height()
            };
        },

        _getViewportAdjustedDelta : function(placement, pos, actualWidth, actualHeight) {
            var delta = { top: 0, left: 0 };
            if (!this.$viewport) return delta;

            var viewportPadding = this.settings.padding;
            var viewportDimensions = this.getViewportBounds();

            if (/right|left/.test(placement)) {
                var topEdgeOffset    = pos.top - viewportPadding;
                var bottomEdgeOffset = pos.top + viewportPadding + actualHeight;

                if (topEdgeOffset < viewportDimensions.top) { // top overflow
                    delta.top = viewportDimensions.top - topEdgeOffset;
                } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                    delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
                }
            } else {

                var leftEdgeOffset  = pos.left - viewportPadding;
                var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
                if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                    delta.left = viewportDimensions.left - leftEdgeOffset;
                } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                    delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
                }
            }

            return delta;
        },

        _replaceArrow : function(delta, dimension, isVertical) {
            this._arrow()
                .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
                .css(isVertical ? 'top' : 'left', '');
        },

        _arrow : function() {
            if (!this.$arrow) {
                this.$arrow = this.$target.find('.tooltip-arrow');
            }
            return this.$arrow;
        },

        _isInState : function() {
            for (var key in this.inState) {
                if (this.inState[key]) return true;
            }
            return false;
        },

        // Move focus to next tabbabale item before given element
        _tabPrev : function(current) {
            var $selfRef = this;

            var selectables = $selfRef._tabItems();
            var prevIndex = selectables.length - 1;
            if ($(current).length === 1) {
                var currentIndex = selectables.index(current);
                if (currentIndex > 0) {
                    prevIndex = currentIndex - 1;
                }
            }
            selectables.eq(prevIndex).trigger('focus');
        },

        // Move focus to next tabbabale item after given element
        _tabNext : function(current) {
            var $selfRef = this;

            var selectables = $selfRef._tabItems();
            var nextIndex = 0;
            if ($(current).length === 1){
                var currentIndex = selectables.index(current);
                if (currentIndex + 1 < selectables.length) {
                    nextIndex = currentIndex + 1;
                }
            }
            selectables.eq(nextIndex).trigger('focus');
        },

        _focusable : function(element, isTabIndexNotNaN) {
            var map;
            var mapName;
            var $img;
            var nodeName = element.nodeName.toLowerCase();

            if ('area' === nodeName) {
                map = element.parentNode;
                mapName = map.name;
                if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
                    return false;
                }
                $img = $('img[usemap="#' + mapName + '"]');
                return $img.length > 0 && $img.is(':visible');
            }

            return (/^(input|select|textarea|button|object)$/.test(nodeName) ?
                !element.disabled :
                'a' === nodeName ?
                    element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                $(element).is(':visible');
        },

        _tabItems : function($node) {
            var $selfRef = this;
            if ($node === undefined) { $node = $(document); }
            var items = $node.find('*').filter(function() {
                var tabIndex = $(this).attr('tabindex');
                var isTabIndexNaN = isNaN(tabIndex);
                return (isTabIndexNaN || tabIndex >= 0) && $selfRef._focusable(this, !isTabIndexNaN);
            });
            return items;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.tooltip');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|dispose|hide/.test(option)) {
                return false;
            }
            if (!data) {
                $this.data('cfw.tooltip', (data = new CFW_Widget_Tooltip(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Tooltip = Plugin;
    $.fn.CFW_Tooltip.Constructor = CFW_Widget_Tooltip;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): popover.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Tooltip === undefined) throw new Error('CFW_Popover requires CFW_Tooltip');

    var CFW_Widget_Popover = function(element, options) {
        this.dragAdded = false;
        this.docAdded = false;
        this.keyTimer = null;
        this.keyDelay = 750;
        this.flags = {
            keyShift: false,
            keyTab : false
        };

        this._init('popover', element, options);
    };

    CFW_Widget_Popover.DEFAULTS = $.extend({}, $.fn.CFW_Tooltip.Constructor.DEFAULTS, {
        placement   : 'top',        // Where to locate popover (top/bottom/left/right/auto)
        trigger     : 'click',      // How popover is triggered (click/hover/focus/manual)
        content     : '',           // Content text/html to be inserted
        drag        : false,        // If the popover should be draggable
        dragtext    : '<span aria-hidden="true">+</span>', // Text for drag handle
        dragsrtext  : 'Drag',       // Screen reader text for drag handle
        dragstep     : 10,          // 'Drag' increment for keyboard
        template    : '<div class="popover"><h3 class="popover-header"></h3><div class="popover-body"></div><div class="popover-arrow"></div></div>'
    });

    CFW_Widget_Popover.prototype = $.extend({}, $.fn.CFW_Tooltip.Constructor.prototype);

    CFW_Widget_Popover.prototype.constructor = CFW_Widget_Popover;

    CFW_Widget_Popover.prototype.getDefaults = function() {
        return CFW_Widget_Popover.DEFAULTS;
    };

    CFW_Widget_Popover.prototype.createTip = function() {
        var $tip = $(this.settings.template);
        return $tip;
    };

    CFW_Widget_Popover.prototype.setContent = function() {
        var $tip = this.$target;
        var $title = $tip.find('.popover-header');
        var $content = $tip.find('.popover-body');

        if (!this.dataToggle) {
            var title = this.getTitle();
            var content = this.getContent();

            if (this.settings.html) {
                $title.html(title);
                if (typeof content == 'string') {
                    $content.html(content);
                } else {
                    $content.empty().append(content); // Use append for objects to keep js events
                }
            } else {
                $title.text(title);
                $content.text(content);
            }
        }

        // Use '.popover-header' for labelledby
        if ($title.length) {
            var labelledby = $title.eq(0).CFW_getID('cfw-popover');
            this.$target.attr('aria-labelledby', labelledby);
        }

        if (this.settings.drag && !this.dragAdded) {
            if (this.$target.find('[data-cfw-drag="' + this.type + '"]').length <= 0) {
                var $drag = $('<span role="button" tabindex="0" class="drag" data-cfw-drag="' + this.type +  '" aria-label="' + this.settings.dragsrtext + '">' + this.settings.dragtext + '</span>');
                $drag.insertAfter(this.$target.find('.close').eq(0));
                this.dragAdded = true;
            }
        }

        if (this.$target.find('[data-cfw-drag="' + this.type + '"]').length) {
            this.$target.addClass('draggable');
            // Force settings
            this.settings.trigger = 'click';
            this.settings.container = 'body';
            // Enable drag handlers
            this.enableDrag();
        }

        $tip.removeClass('fade in top bottom left right');

        if (!$title.html()) { $title.hide(); }

        if (this.isDialog && !this.docAdded) {
            // Inject a role="document" container
            var $children = this.$target.children().not(this.$arrow);
            var docDiv = document.createElement('div');
            docDiv.setAttribute('role', 'document');
            $children.wrapAll(docDiv);
            // Make sure arrow is at end of popover for roles to work properly with screen readers
            this._arrow();
            this.$arrow.appendTo(this.$target);
            this.docAdded = true;
        }
    };

    CFW_Widget_Popover.prototype.getContent = function() {
        var content;
        var $e = this.$element;
        var s = this.settings;

        content = (typeof s.content == 'function' ? s.content.call($e[0]) :  s.content);

        return content;
    };

    CFW_Widget_Popover.prototype.enableDrag = function() {
        var $selfRef = this;
        var limit = {};

        var dragOpt = { handle: '[data-cfw-drag="' + this.type + '"]' };

        // Unset any previous drag events
        this.$target.off('.cfw.drag');

        this.$target.on('dragStart.cfw.drag', function() {
            var $viewport = $selfRef.$viewport;

            limit = $viewport.offset();
            limit.bottom = limit.top + $viewport.outerHeight() - $(this).outerHeight();
            limit.right = limit.left + $viewport.outerWidth() - $(this).outerWidth();

            $selfRef._updateZ();
            $selfRef.$element.CFW_trigger('dragStart.cfw.' + $selfRef.type);
        })
        .on('drag.cfw.drag', function(e) {
            var viewportPadding = $selfRef.settings.padding;

            $(this).css({
                top: Math.min((limit.bottom - viewportPadding), Math.max((limit.top + viewportPadding), e.offsetY)),
                left: Math.min((limit.right - viewportPadding), Math.max((limit.left + viewportPadding), e.offsetX))
            });
        })
        .on('dragEnd.cfw.drag', function() {
            $selfRef.$element.CFW_trigger('dragEnd.cfw.' + $selfRef.type);
        })
        .on('keydown.cfw.drag', '[data-cfw-drag="' + this.type + '"]', function(e) {
            if (/(37|38|39|40)/.test(e.which)) {
                if (e) { e.stopPropagation(); }

                if (!$selfRef.keyTimer) {
                    $selfRef.$element.CFW_trigger('dragStart.cfw.' + $selfRef.type);
                }

                clearTimeout($selfRef.keyTimer);

                var $viewport = $selfRef.$viewport;
                var viewportPadding = $selfRef.settings.padding;

                var $node = $selfRef.$target;
                var step = $selfRef.settings.dragstep;
                limit = $viewport.offset();
                limit.bottom = limit.top + $viewport.outerHeight() - $node.outerHeight();
                limit.right = limit.left + $viewport.outerWidth() - $node.outerWidth();
                var nodeOffset = $node.offset();
                // Mitigate most of 'slippage' by rounding offsets
                var offsetY = Math.round(nodeOffset.top);
                var offsetX = Math.round(nodeOffset.left);

                // Revise offset
                switch (e.which) {
                    /* Left  */ case 37: { offsetX = offsetX - step; break; }
                    /* Up    */ case 38: { offsetY = offsetY - step; break; }
                    /* Right */ case 39: { offsetX = offsetX + step; break; }
                    /* Down  */ case 40: { offsetY = offsetY + step; break; }
                }

                // Move it
                $node.css({
                    top: Math.min((limit.bottom - viewportPadding), Math.max((limit.top + viewportPadding), offsetY)),
                    left: Math.min((limit.right - viewportPadding), Math.max((limit.left + viewportPadding), offsetX))
                });

                $selfRef.keyTimer = setTimeout(function() {
                    $selfRef.$element.CFW_trigger('dragEnd.cfw.' + $selfRef.type);
                    $selfRef.keyTimer = null;
                }, $selfRef.keyDelay);

                // Stop browser from scrolling
                return false;
            }
        });

        this.$target.CFW_Drag(dragOpt);
    };

    CFW_Widget_Popover.prototype.hide = function(force) {
        // Fire key drag end if needed
        if (this.keyTimer) {
            this.$element.CFW_trigger('dragEnd.cfw.' + this.type);
            clearTimeout(this.keyTimer);
        }
        // Call tooltip hide
        $.fn.CFW_Tooltip.Constructor.prototype.hide.call(this, force);
    };

    CFW_Widget_Popover.prototype._removeDynamicTip = function() {
        this.$target.detach();
        this.dynamicTip = false;
        this.closeAdded = false;
        this.dragAdded = false;
        this.docAdded = false;
        this.$arrow = false;
        this.$target = null;
    };

    CFW_Widget_Popover.prototype._updateZ = function() {
        // Find highest z-indexed visible popover
        var zMax = 0;
        var $zObj = null;
        $('.popover:visible').each(function() {
            var zCurr = parseInt($(this).css('z-index'), 10);
            if (zCurr > zMax) {
                zMax = zCurr;
                $zObj = $(this);
            }
        });
        // Only increase if highest is not current popover
        if (this.$target[0] !== $zObj[0]) {
            this.$target.css('z-index', ++zMax);
        }
    };

    CFW_Widget_Popover.prototype._arrow = function() {
        if (!this.$arrow) {
            this.$arrow = this.$target.find('.arrow, .popover-arrow');
        }
        return this.$arrow;
    };

    CFW_Widget_Popover.prototype._unlinkCompleteExt = function() {
        this.dragAdded = null;
        this.docAdded = null;
        this.keyTimer = null;
        this.keyDelay = null;
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.popover');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|dispose|hide/.test(option)) {
                return false;
            }
            if (!data) {
                $this.data('cfw.popover', (data = new CFW_Widget_Popover(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Popover = Plugin;
    $.fn.CFW_Popover.Constructor = CFW_Widget_Popover;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): modal.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Modal = function(element, options) {
        this.$body = $(document.body);
        this.$element = $(element);
        this.$target = null;
        this.$dialog = null;
        this.$backdrop = null;
        this.$focusLast = null;
        this.isShown = null;
        this.scrollbarWidth = 0;
        this.fixedContent = '.fixed-top, .fixed-botton, .is-fixed';
        this.ignoreBackdropClick = false;

        var parsedData = this.$element.CFW_parseData('modal', CFW_Widget_Modal.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Modal.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Modal.DEFAULTS = {
        toggle       : false,   // Target selector
        animate      : true,    // If modal windows should animate
        unlink       : false,   // If on hide to remove events and attributes from modal and trigger
        dispose      : false,   // If on hide to unlink, then remove modal from DOM
        backdrop     : true,    // Show backdrop, or 'static' for no close on click
        keyboard     : true,    // Close modal on ESC press
        show         : false    // Show modal afer initialize
    };

    CFW_Widget_Modal.prototype = {

        _init : function() {
            // Find target by id/css selector - only pick first one found
            var $findTarget = $(this.settings.toggle).eq(0);
            if ($findTarget.length <= 0) {
                // If not found by selector - find by 'toggle' data
                var dataToggle = this.$element.attr('data-cfw-modal-toggle');
                $findTarget = $('[data-cfw-modal-target="' + dataToggle + '"]');
            }
            if ($findTarget.length <= 0) { return false; }
            this.$target = $findTarget;
            this.$dialog = this.$target.find('.modal-dialog');

            this.$element.attr('data-cfw', 'modal');

            // Check for presence of ids - set if not present
            // var triggerID = this.$element.CFW_getID('cfw-modal');
            var targetID = this.$target.CFW_getID('cfw-modal');

            // Set ARIA attributes on trigger
            this.$element.attr('aria-controls', targetID);

            // Use '.modal-title' for labelledby
            var $title = this.$target.find('.modal-title');
            if ($title.length) {
                var labelledby = $title.eq(0).CFW_getID('cfw-modal');
                this.$target.attr('aria-labelledby', labelledby);
            }

            // Set ARIA attributes on target
            this.$target.attr({
                'role': 'dialog',
                'aria-hidden': 'true',
                'tabindex': -1
            });
            this.$dialog.attr('role', 'document');

            // Bind click handler
            this.$element.on('click.cfw.modal.toggle', $.proxy(this.toggle, this));

            this.$target.data('cfw.modal', this);

            this.$target.CFW_trigger('init.cfw.modal');

            if (this.settings.show) {
                this.show();
            }
        },

        toggle : function(e) {
            if (e) { e.preventDefault(); }
            if (this.isShown) {
                this.hide();
            } else {
                this.show();
            }
        },

        show : function() {
            var $selfRef = this;

            // Bail if already showing
            if (this.isShown) { return; }

            // Start open transition
            if (!this.$target.CFW_trigger('beforeShow.cfw.modal')) {
                return;
            }

            this.isShown = true;

            this.checkScrollbar();
            this.setScrollbar();
            this.$body.addClass('modal-open');

            this.escape();
            this.resize();

            this.$target.on('click.dismiss.cfw.modal', '[data-cfw-dismiss="modal"]', function(e) {
                    if (e) { e.preventDefault(); }
                    $selfRef.hide();
                })
                .data('cfw.modal', this);

            this.$dialog.on('mousedown.dismiss.cfw.modal', function() {
                $selfRef.$target.one('mouseup.dismiss.cfw.modal', function(e) {
                    if ($(e.target).is($selfRef.$target)) $selfRef.ignoreBackdropClick = true;
                });
            });

            this.backdrop(function() {
                $selfRef._showComplete();
            });
        },

        hide : function() {
            // Bail if not showing
            if (!this.isShown) { return; }

            // Start close transition
            if (!this.$target.CFW_trigger('beforeHide.cfw.modal')) {
                return;
            }

            this.isShown = false;

            $(document).off('focusin.cfw.modal');
            this.$target
                .removeClass('in')
                .attr('aria-hidden', true)
                .off('.dismiss.cfw.modal');

            this.$dialog.off('mousedown.dismiss.cfw.modal');

            if (this.$focusLast) {
                this.$focusLast.off('.cfw.' + this.type + '.focusLast');
            }

            this.$target.CFW_transition(null, $.proxy(this._hideComplete, this));
        },

        _showComplete : function() {
            var $selfRef = this;

            if (this.settings.animate) {
                this.$target.addClass('fade');
            }

            if (!this.$target.parent().length) {
                this.$target.appendTo(this.$body); // don't move modals dom position
            }

            this.$target.show().scrollTop(0);

            this.adjustDialog();

            this.$target[0].offsetWidth; // Force Reflow

            this.$target.addClass('in').removeAttr('aria-hidden');

            this.enforceFocus();
            this.enforceFocusLast();

            function complete() {
                $selfRef.$target.trigger('focus');
                $selfRef.$target.CFW_trigger('afterShow.cfw.modal');
            }

            this.$target.CFW_transition(null, complete);
        },

        _hideComplete : function() {
            var $selfRef = this;

            this.escape();
            this.resize();

            this.$target.hide();
            this.backdrop(function() {
                $selfRef.$body.removeClass('modal-open');
                $selfRef.resetAdjustments();
                $selfRef.resetScrollbar();
                $selfRef.$target.CFW_trigger('afterHide.cfw.modal');
            });
            this.$element && this.$element.trigger('focus');
        },

        enforceFocus : function() {
            var $selfRef = this;
            $(document)
                .off('focusin.cfw.modal') // guard against infinite focus loop
                .on('focusin.cfw.modal', function(e) {
                    if (document !== e.target && $selfRef.$target[0] !== e.target && !$selfRef.$target.has(e.target).length) {
                        $selfRef.$target.trigger('focus');
                    }
                });
        },

        enforceFocusLast : function() {
            var $selfRef = this;
            // Inject an item to fake loss of focus in case the modal
            // is last tabbable item in document - otherwise focus drops off page
            if (!this.$focusLast) {
                this.$focusLast = $(document.createElement('span'))
                .addClass('modal-focuslast')
                .attr('tabindex', 0)
                .appendTo(this.$target);
            }
            if (this.$focusLast) {
                this.$focusLast
                    .off('focusin.cfw.modal.focusLast')
                    .on('focusin.cfw.modal.focusLast', function() {
                        $selfRef.$target.trigger('focus');
                    });
            }
        },

        escape : function() {
            var $selfRef = this;
            if (this.isShown && this.settings.keyboard) {
                this.$target.on('keydown.dismiss.cfw.modal', function(e) {
                    e.which == 27 && $selfRef.hide();
                });
            } else if (!this.isShown) {
                this.$target.off('keydown.dismiss.cfw.modal');
            }
        },

        resize : function() {
            if (this.isShown) {
                $(window).on('resize.cfw.modal', $.proxy(this.handleUpdate, this));
            } else {
                $(window).off('resize.cfw.modal');
            }
        },

        // these following methods are used to handle overflowing modals
        handleUpdate : function() {
            if (this.settings.backdrop) this.adjustBackdrop();
            this.adjustDialog();
        },

        adjustBackdrop : function() {
            this.$backdrop
                .css('height', 0)
                .css('height', this.$target[0].scrollHeight);
        },

        adjustDialog : function() {
            var modalIsOverflowing = this.$target[0].scrollHeight > document.documentElement.clientHeight;

            this.$target.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });
        },

        resetAdjustments : function() {
            this.$target.css({
                paddingLeft: '',
                paddingRight: ''
            });
        },

        checkScrollbar : function() {
            this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
            this.scrollbarWidth = $().CFW_measureScrollbar();
        },

        setScrollbar : function() {
            var $selfRef = this;

            if (this.bodyIsOverflowing) {
                // Update fixed element padding
                $(this.fixedContent).each(function() {
                    var $this = $(this);
                    $this.data('cfw.padding-right', this.style.paddingRight || '');
                    var padding = parseFloat($this.css('padding-right') || 0);
                    $this.css('padding-right', padding + $selfRef.scrollbarWidth);
                });

                // Update body padding
                this.$body.data('cfw.padding-right', document.body.style.paddingRight || '');
                var padding = parseFloat(this.$body.css('padding-right') || 0);
                this.$body.css('padding-right', padding + this.scrollbarWidth);
            }
            this.$target.CFW_trigger('scrollbarSet.cfw.modal');
        },

        resetScrollbar : function() {
            // Restore fixed element padding
            $(this.fixedContent).each(function() {
                var $this = $(this);
                var padding = $this.data('cfw.padding-right');
                $this.css('padding-right', padding);
                $this.removeData('cfw.padding-right');
            });

            // Restore body padding
            var padding = this.$body.data('cfw.padding-right');
            if (typeof padding !== undefined) {
                this.$body.css('padding-right', padding);
                this.$body.removeData('cfw.padding-right');
            }
        },

        measureScrollbar : function() {
            var $body = $(document.body);
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            $body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            $body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        },

        backdrop : function(callback) {
            var $selfRef = this;

            var animate = (this.settings.animate) ? 'fade' : '';

            if (this.isShown && this.settings.backdrop) {
                this.$backdrop = $(document.createElement('div'))
                    .addClass('modal-backdrop ' + animate)
                    .appendTo(this.$body);

                this.$target.on('click.dismiss.cfw.modal', function(e) {
                    if ($selfRef.ignoreBackdropClick) {
                        $selfRef.ignoreBackdropClick = false;
                        return;
                    }
                    if (e.target !== e.currentTarget) { return; }
                    $selfRef.settings.backdrop == 'static'
                        ? $selfRef.$target.trigger('focus')
                        : $selfRef.hide();
                });

                this.$backdrop[0].offsetWidth; // Force Reflow

                this.$backdrop.addClass('in');

                this.$backdrop.CFW_transition(null, callback);
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in');

                var callbackRemove = function() {
                    $selfRef.removeBackdrop();
                    callback && callback();
                };

                this.$backdrop.CFW_transition(null, callbackRemove);
            } else if (callback) {
                callback();
            }
        },

        removeBackdrop : function() {
            this.$backdrop && this.$backdrop.remove();
            this.$backdrop = null;
        },

        unlink : function() {
            var $selfRef = this;

            this.$target.CFW_trigger('beforeUnlink.cfw.modal');

            if (this.isShown) {
                this.$target.one('afterHide.cfw.modal', function() {
                    $selfRef._unlinkComplete();
                });
                this.hide();
            } else {
                this._unlinkComplete();
            }
        },

        _unlinkComplete : function() {
            var $target = this.$target;

            this.$target.off('.cfw.modal')
                .removeAttr('aria-labelledby')
                .removeData('cfw.modal');
            this.$element.off('.cfw.modal')
                .removeAttr('data-cfw aria-controls')
                .removeData('cfw.modal');

            this.$body = null;
            this.$element = null;
            this.$target = null;
            this.$dialog = null;
            this.$backdrop = null;
            this.$focusLast = null;
            this.isShown = null;
            this.scrollbarWidth = null;
            this.fixedContent = null;
            this.ignoreBackdropClick = null;
            this.settings = null;

            $target.CFW_trigger('afterUnlink.cfw.modal');
        },

        dispose : function() {
            $(document).one('afterUnlink.cfw.modal', this.$target, function(e) {
                var $this = $(e.target);
                $this.CFW_trigger('dispose.cfw.modal');
                $this.remove();
            });
            this.unlink();
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.modal');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|dispose/.test(option)) {
                return false;
            }
            if (!data) {
                $this.data('cfw.modal', (data = new CFW_Widget_Modal(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Modal = Plugin;
    $.fn.CFW_Modal.Constructor = CFW_Widget_Modal;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): accordion.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Collapse === undefined) throw new Error('CFW_Accordion requires CFW_Collapse');

    var CFW_Widget_Accordion = function(element) {
        this.$element = $(element);
        this._init();
    };

    CFW_Widget_Accordion.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element
                .attr('data-cfw', 'accordion')
                .on('beforeShow.cfw.collapse', function(e) {
                    if (e.isDefaultPrevented()) { return; }
                    $selfRef._update(e);
                })
                .CFW_trigger('init.cfw.accordion');
        },

        _update : function(e) {
            var inTransition = false;
            var $current = $(e.target);
            var $collapse = this.$element.find('[data-cfw="collapse"]');

            $collapse.each(function() {
                if ($(this).data('cfw.collapse').inTransition === 1) {
                    inTransition = true;
                }
            });

            if (inTransition) {
                e.preventDefault();
                return;
            }

            $collapse.not($current).CFW_Collapse('hide');
        },

        dispose : function() {
            this.$element
                .off('.cfw.collapse')
                .removeData('cfw.accordion');

            this.$element = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.accordion');
            if (!data) {
                $this.data('cfw.accordion', (data = new CFW_Widget_Accordion(this)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Accordion = Plugin;
    $.fn.CFW_Accordion.Constructor = CFW_Widget_Accordion;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): tab-responsive.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Tab === undefined) throw new Error('CFW_TabResponsive requires CFW_Tab');
    if ($.fn.CFW_Collapse === undefined) throw new Error('CFW_TabResponsive requires CFW_Collapse');

    var CFW_Widget_TabResponsive = function(element) {
        this.$element = $(element);

        this._init();
    };

    CFW_Widget_TabResponsive.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element.attr('data-cfw', 'tabResponsive');

            // Set tab -> collapse
            this.$element.on('beforeShow.cfw.tab', function(e) {
                if (e.isDefaultPrevented()) { return; }
                $selfRef.updateCollapse(e.target);
            });

            // Set collapse -> tab
            this.$element.on('beforeShow.cfw.collapse', function(e) {
                if (e.isDefaultPrevented()) { return; }
                $selfRef.updateTab(e.target);
            });

            // Remove animations (needs to be revisited)
            this.$element.find('[data-cfw="tab"]').CFW_Tab('animDisable');
            this.$element.find('[data-cfw="collapse"]').CFW_Collapse('animDisable');

            var active = this.$element.find('[data-cfw="tab"].active');
            this.updateCollapse(active);

            this.$element.CFW_trigger('init.cfw.tabResponsive');
        },

        // Open the collapse element in the active panel
        // Closes all related collapse items first
        updateCollapse : function(node) {
            var $activeTab = $(node);
            var data = $($activeTab).data('cfw.tab');
            if (data) {
                var $activePane = data.$target;
                var $paneContainer = $activePane.closest('.tab-content');
                $paneContainer.find('[data-cfw="collapse"]').each(function() {
                    $(this).one('afterHide.cfw.collapse', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                        })
                        .CFW_Collapse('hide');
                });

                var $collapseItem = $activePane.find('[data-cfw="collapse"]');
                $collapseItem.one('afterShow.cfw.collapse', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    })
                    .CFW_Collapse('show');
            }
        },

        // Set parent panel to active when collapse called
        // Close all other collapse items
        updateTab : function(node) {
            var $activeCollapse = $(node);
            var $paneParent = $activeCollapse.closest('.tab-pane');
            var $paneID = $paneParent.attr('id');
            var $paneContainer = $activeCollapse.closest('.tab-content');

            $paneContainer.find('[data-cfw="collapse"]').each(function() {
                var $this = $(this);
                if ($this[0] === $activeCollapse[0]) {
                    return;
                }
                $this.CFW_Collapse('hide');
            });

            var $tabList = this.$element.find('[data-cfw="tab"]');
            $tabList.each(function() {
                var $this = $(this);
                var selector = $this.attr('data-cfw-tab-target');
                if (!selector) {
                    selector = $this.attr('href');
                }
                selector = selector.replace(/^#/, '');
                if (selector == $paneID) {
                    $this.one('beforeShow.cfw.tab', function(e) {
                            e.stopPropagation();
                        })
                        .CFW_Tab('show');
                }
            });
        },

        dispose : function() {
            this.$element
                .off('.cfw.tab .cfw.collapse')
                .removeData('cfw.tabResponsive');

            this.$element = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.tabResponsive');

            if (!data) {
                $this.data('cfw.tabResponsive', (data = new CFW_Widget_TabResponsive(this)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_TabResponsive = Plugin;
    $.fn.CFW_TabResponsive.Constructor = CFW_Widget_TabResponsive;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): slideshow.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if (!$.fn.CFW_Tab) throw new Error('CFW_Slideshow requires CFW_Tab');

    var CFW_Widget_Slideshow = function(element) {
        this.$element = $(element);
        this.$navPrev = this.$element.find('[data-cfw-slideshow-nav="prev"]');
        this.$navNext = this.$element.find('[data-cfw-slideshow-nav="next"]');
        this.currIndex = 0;

        this._init();
    };

    CFW_Widget_Slideshow.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element.attr('data-cfw', 'slideshow');

            if (!this._getTabs().length) { return; }

            // Listen for tabs
            this.$element.on('afterShow.cfw.tab', function() {
                $selfRef.update();
            });

            // Bind nav
            this.$navPrev.on('click.cfw.slideshow', function(e) {
                e.preventDefault();
                if ($(e.target).not('.disabled, :disabled')) {
                    $selfRef.prev();
                }
            });
            this.$navNext.on('click.cfw.slideshow', function(e) {
                e.preventDefault();
                if ($(e.target).not('.disabled, :disabled')) {
                    $selfRef.next();
                }
            });

            this.update();

            this.$element.CFW_trigger('init.cfw.slideshow');
        },

        prev : function() {
            var $tabs = this._getTabs();
            var currIndex = this._currIndex($tabs);
            if (currIndex > 0) {
                this.$element.CFW_trigger('prev.cfw.slideshow');
                $tabs.eq(currIndex - 1).CFW_Tab('show');
            }
        },

        next : function() {
            var $tabs = this._getTabs();
            var currIndex = this._currIndex($tabs);
            if (currIndex < $tabs.length - 1) {
                this.$element.CFW_trigger('next.cfw.slideshow');
                $tabs.eq(currIndex + 1).CFW_Tab('show');
            }
        },

        update : function() {
            this.$navPrev.removeClass('disabled');
            this.$navNext.removeClass('disabled');

            var $tabs = this._getTabs();
            var currIndex = this._currIndex($tabs);
            if (currIndex <= 0) {
                this.$navPrev.addClass('disabled');
            }
            if (currIndex >= $tabs.length - 1) {
                this.$navNext.addClass('disabled');
            }
            this.$element.CFW_trigger('update.cfw.slideshow');
        },

        _getTabs : function() {
            return this.$element.find('[role="tab"]:visible').not('.disabled');
        },

        _currIndex : function($tabs) {
            var $node = $tabs.filter('.active');
            return $tabs.index($node);
        },

        dispose : function() {
            this.$navPrev.off('.cfw.slideshow');
            this.$navNext.off('.cfw.slideshow');
            this.$element
                .off('.cfw.tab')
                .removeData('cfw.slideshow');

            this.$element = null;
            this.$navPrev = null;
            this.$navNext = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.Slideshow');

            if (!data) {
                $this.data('cfw.Slideshow', (data = new CFW_Widget_Slideshow(this)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Slideshow = Plugin;
    $.fn.CFW_Slideshow.Constructor = CFW_Widget_Slideshow;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): scrollspy.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Scrollspy = function(element, options) {
        this.$body = $('body');
        this.$element = $(element);
        this.$scrollElement = this.$element.is('body') ? $(window) : this.$element;
        this.selector = null;
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;

        var parsedData = this.$scrollElement.CFW_parseData('scrollspy', CFW_Widget_Scrollspy.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Scrollspy.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Scrollspy.DEFAULTS = {
        target: null,
        offset: 10,
        throttle: 100
    };

    CFW_Widget_Scrollspy.prototype = {
        _init : function() {
            this.$scrollElement.on('scroll.cfw.scrollspy', $().CFW_throttle($.proxy(this.process, this), this.settings.throttle));
            this.selector = (this.settings.target || '') + ' a';
            this.$scrollElement.CFW_trigger('init.cfw.scrollspy');

            this.refresh();
            this.process();
        },

        getScrollHeight : function() {
            return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
        },

        refresh : function() {
            var $selfRef = this;
            var offsetMethod = 'offset';
            var offsetBase = 0;

            if (!$.isWindow(this.$scrollElement[0])) {
                offsetMethod = 'position';
                offsetBase   = this.$scrollElement.scrollTop();
            }

            this.offsets = [];
            this.targets = [];
            this.scrollHeight = this.getScrollHeight();

            this.$body
                .find(this.selector)
                .map(function() {
                    var $el   = $(this);
                    var href  = $el.data('target') || $el.attr('href');
                    var $href = /^#./.test(href) && $(href);

                    return ($href
                        && $href.length
                        && $href.is(':visible')
                        // && $el.is(':visible')
                        && [[$href[offsetMethod]().top + offsetBase, href]]) || null;
                })
                .sort(function(a, b) { return a[0] - b[0]; })
                .each(function() {
                    $selfRef.offsets.push(this[0]);
                    $selfRef.targets.push(this[1]);
                });
        },

        process : function() {
            var scrollTop    = this.$scrollElement.scrollTop() + this.settings.offset;
            var scrollHeight = this.getScrollHeight();
            var maxScroll    = this.settings.offset + scrollHeight - this.$scrollElement.height();
            var offsets      = this.offsets;
            var targets      = this.targets;
            var activeTarget = this.activeTarget;
            var i;

            if (this.scrollHeight != scrollHeight) {
                this.refresh();
            }

            if (scrollTop >= maxScroll) {
                return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
            }

            if (activeTarget && scrollTop < offsets[0] && offsets[0] > 0) {
                this.activeTarget = null;
                return this.clear();
            }

            for (i = offsets.length; i--;) {
                activeTarget != targets[i]
                    && scrollTop >= offsets[i]
                    && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
                    && this.activate(targets[i]);
            }
        },

        activate : function(target) {
            this.activeTarget = target;

            this.clear();

            var selector = this.selector +
                '[data-target="' + target + '"],' +
                this.selector + '[href="' + target + '"]';

            var $active = $(selector)
                .addClass('active');

            if ($active.closest('.dropdown-menu').length) {
                $active = $active
                    .closest('.dropdown')
                    .find('[data-cfw="dropdown"]')
                    .addClass('active');
            } else {
                // Set parents as active
                $active.parents('ul, ol, nav').prev('li, a').addClass('active');
            }

            $active.CFW_trigger('activate.cfw.scrollspy');
        },

        clear : function() {
            $(this.selector)
                .filter('.active')
                .removeClass('active');
        },

        dispose : function() {
            this.$scrollElement.off('.cfw.scrollspy');
            this.$element.removeData('cfw.scrollspy');

            this.$body = null;
            this.$element = null;
            this.$scrollElement = null;
            this.selector = null;
            this.offsets = null;
            this.targets = null;
            this.activeTarget = null;
            this.scrollHeight = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.scrollspy');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.scrollspy', (data = new CFW_Widget_Scrollspy(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Scrollspy = Plugin;
    $.fn.CFW_Scrollspy.Constructor = CFW_Widget_Scrollspy;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): alert.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var dismiss = '[data-cfw-dismiss="alert"]';

    var CFW_Widget_Alert = function(element, options) {
        this.$element = $(element);
        this.$parent = null;
        this.inTransition = null;

        var parsedData = this.$element.CFW_parseData('alert', CFW_Widget_Alert.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Alert.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Alert.DEFAULTS = {
        target  : null,
        animate : true  // If alert targets should fade out
    };

    CFW_Widget_Alert.prototype = {

        _init : function() {
            var $selfRef = this;

            this.findParent();

            if (this.settings.animate) {
                this.$parent.addClass('fade in');
            }

            this.$parent
                .on('click.cfw.alert', dismiss, function() {
                    $selfRef.close();
                })
                .data('cfw.alert', this)
                .find(dismiss).data('cfw.alert', this)
                .CFW_trigger('init.cfw.alert');
        },

        close : function(e) {
            var $selfRef = this;

            if (e) e.preventDefault();

            if (this.inTransition) { return; }

            if (!this.$parent.CFW_trigger('beforeClose.cfw.alert')) {
                return;
            }

            this.inTransition = 1;

            function removeElement() {
                // Detach from parent, fire event then clean up data
                $selfRef.$parent
                    .detach()
                    .CFW_trigger('afterClose.cfw.alert');
                $selfRef.$parent.remove();
                $selfRef.inTransition = 0;
            }

            this.$parent
                .removeClass('in')
                .CFW_transition(null, removeElement);
        },

        findParent : function() {
            var selector = this.settings.target;
            var $parent = null;

            if (!selector) {
                selector = this.$element.attr('href');
            }

            $parent = $(selector === '#' ? [] : selector);
            if (!$parent.length) {
                $parent = this.$element.closest('.alert');
            }

            this.$parent = $parent;
        },

        dispose : function() {
            this.$parent.off('.cfw.alert');
            this.$element.removeData('cfw.alert');

            this.$element = null;
            this.$parent = null;
            this.inTransition = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.alert');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.alert', (data = new CFW_Widget_Alert(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Alert = Plugin;
    $.fn.CFW_Alert.Constructor = CFW_Widget_Alert;

    // API
    // ===
    if (typeof CFW_API === 'undefined' || CFW_API !== false) {
        $(document).on('click.cfw.alert', dismiss, function() {
            $(this).CFW_Alert('close');
        });
    }
})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): button.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Button = function(element) {
        this.$element = $(element);
        this.$parent = this.$element.closest('[data-cfw="buttons"]');

        this._init();
    };

    CFW_Widget_Button.prototype = {
        _init : function() {
            var $selfRef = this;

            var $input = this.$element.find('input').first();
            if ($input.length) {
                if ($input.prop('checked')) {
                    this.$element.addClass('active');
                } else {
                    this.$element.removeClass('active');
                }
            }
            this.$element.attr('aria-pressed', this.$element.hasClass('active'));

            // Event handlers
            this.$element
                .on('click.cfw.button', function(e) {
                    var $btn = $(this);

                    $selfRef.toggle();

                    if (!$(e.target).is('input')) {
                        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
                        e.preventDefault();
                        // The target component still receive the focus
                        if ($btn.is('input,button')) {
                            $btn.trigger('focus');
                        } else {
                            $btn.find('input:visible,button:visible').first().trigger('focus');
                        }
                    }
                });
            if ($input.length) {
                this.$element.on('focusin.cfw.button focusout.cfw.button', function(e) {
                    $(this).toggleClass('focus', /^focus(in)?$/.test(e.type));
                });
            }
        },

        toggle : function() {
            var changed = true;

            if (this.$parent.length) {
                var $input = this.$element.find('input');
                if ($input.length) {
                    if ($input.prop('type') == 'radio') {
                        if ($input.prop('checked') && this.$element.hasClass('active')) {
                            changed = false;
                        } else {
                            this.$parent.find('.active')
                                .removeClass('active')
                                .attr('aria-pressed', false);
                        }
                    }

                    if (changed) {
                        $input.prop('checked', !this.$element.hasClass('active'))
                            .trigger('change');
                    }
                }
            }

            if (changed) {
                this.$element
                    .attr('aria-pressed', !this.$element.hasClass('active'))
                    .toggleClass('active');
            }
        },

        dispose : function() {
            this.$element
                .off('.cfw.button')
                .removeData('cfw.button');

            this.$element = null;
            this.$parent = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.button');
            var options = typeof option === 'object' && option;

            // Check to see if group
            if ($this.is('[data-cfw="buttons"]')) {
                // Pass through to buttons
                $this.find('.btn').CFW_Button(option);
            } else {
                // Operate on independent buttons
                if (!data) {
                    $this.data('cfw.button', (data = new CFW_Widget_Button(this, options)));
                }
                if (typeof option === 'string') {
                    data[option].apply(data, args);
                }
            }
        });
    }

    $.fn.CFW_Button = Plugin;
    $.fn.CFW_Button.Constructor = CFW_Widget_Button;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): lazy.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Lazy = function(element, options) {
        this.$element = $(element);
        this.$window = $(window);
        this.instance = null;
        this.inTransition = null;

        var parsedData = this.$element.CFW_parseData('lazy', CFW_Widget_Lazy.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Lazy.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Lazy.DEFAULTS = {
        src       : '',
        throttle  : 250,        // Throttle speed to limit event firing
        trigger   : 'scroll resize',   // Events to trigger loading source
        delay     : 0,          // Delay before loading source
        effect    : 'show',     // jQuery effect to use for showing source (http://api.jquery.com/category/effects/)
        speed     : 0,          // Speed of effect (milliseconds)
        threshold : 0,          // Amount of pixels below viewport to triger show
        container : window,     // Where to watch for events
        invisible : false,      // Load sources that are not :visible
        placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    };

    CFW_Widget_Lazy.prototype = {

        _init : function() {
            var checkInitViewport = false;

            this.$element.attr('data-cfw', 'lazy');

            // Add placholder if src is not defined
            if (this.$element.attr('src') === '' || this.$element.attr('src') === undefined || this.$element.attr('src') === false) {
                if (this.$element.is('img')) {
                    this.$element.attr('src', this.settings.placeholder);
                }
            }

            this.instance = this.$element.CFW_getID('cfw-lazy');

            // Bind events
            var eventTypes = this.settings.trigger.split(' ');
            for (var i = eventTypes.length; i--;) {
                var eventType = eventTypes[i];
                if (eventType == 'scroll' || eventType == 'resize') {
                    $(this.settings.container).on(eventType + '.cfw.lazy.' + this.instance, $().CFW_throttle($.proxy(this._handleTrigger, this), this.settings.throttle));
                    checkInitViewport = true;
                } else {
                    $(this.$element).on(eventType + '.cfw.lazy', $.proxy(this.show, this));
                }
            }

            this.$element.CFW_trigger('init.cfw.lazy');

            if (checkInitViewport && this.inViewport()) { this.show(); }
        },

        inViewport : function() {
            if (!this.settings.invisible && !this.$element.is(':visible')) {
                return false;
            }
            return (!this.belowFold() && !this.afterRight() && !this.aboveTop() && !this.beforeLeft());
        },

        belowFold : function() {
            var fold;
            if (this.settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : this.$window.height()) + this.$window.scrollTop();
            } else {
                fold = $(this.settings.container).offset().top + $(this.settings.container).height();
            }
            return fold <= this.$element.offset().top - this.settings.threshold;
        },

        afterRight : function() {
            var fold;
            if (this.settings.container === window) {
                fold = this.$window.width() + this.$window.scrollLeft();
            } else {
                fold = $(this.settings.container).offset().left + $(this.settings.container).width();
            }
            return fold <= this.$element.offset().left - this.settings.threshold;
        },

        aboveTop : function() {
            var fold;
            if (this.settings.container === window) {
                fold = this.$window.scrollTop();
            } else {
                fold = $(this.settings.container).offset().top;
            }
            return fold >= this.$element.offset().top + this.settings.threshold  + this.$element.height();
        },

        beforeLeft: function() {
            var fold;
            if (this.settings.container === window) {
                fold = this.$window.scrollLeft();
            } else {
                fold = $(this.settings.container).offset().left;
            }
            return fold >= this.$element.offset().left + this.settings.threshold + this.$element.width();
        },

        loadSrc : function() {
            var $selfRef = this;

            // Hide, set src, show w/effect
            this.$element.hide();
            this.$element.attr('src', this.settings.src);
            this.$element[this.settings.effect](this.settings.speed);

            setTimeout(function() {
                $selfRef.$element.CFW_trigger('afterShow.cfw.lazy');
                $selfRef.dispose();
            }, this.settings.speed);
        },

        show : function() {
            var $selfRef = this;
            if (this.inTransition) { return; }

            if (!this.$element.CFW_trigger('beforeShow.cfw.lazy')) {
                return;
            }

            this.inTransition = true;

            setTimeout(function() {
                $selfRef.loadSrc();
            }, this.settings.delay);
        },

        _handleTrigger : function() {
            // Handle delayed event calls by checking for null
            if (this.$element !== null) {
                if (this.inViewport()) { this.show(); }
            }
        },

        dispose : function() {
            $(this.settings.container).off('.cfw.lazy.' + this.instance);
            this.$element.off('.cfw.lazy')
                .removeData('cfw.lazy')
                .removeAttr('data-cfw');

            this.$element = null;
            this.$window = null;
            this.instance = null;
            this.inTransition = null;
            this.settings = null;

        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.lazy');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.lazy', (data = new CFW_Widget_Lazy(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Lazy = Plugin;
    $.fn.CFW_Lazy.Constructor = CFW_Widget_Lazy;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): slider.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if (!$.fn.CFW_Drag) throw new Error('CFW_Slider requires CFW_Drag');

    var CFW_Widget_Slider = function(element, options) {
        this.$element = $(element);

        this.$slider = null;
        this.$track = null;
        this.$selection = null;
        this.$thumbMin = null;
        this.$thumbMax = null;

        this.$inputMin = null;
        this.labelMinTxt = '';

        this.$inputMax = null;
        this.labelMaxTxt = '';

        this.ordinal = false;
        this.range = false;

        this.val0 = 0;
        this.val1 = 0;

        var parsedData = this.$element.CFW_parseData('slider', CFW_Widget_Slider.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Slider.DEFAULTS, parsedData, options);

        this.inDrag = null;
        this.startPos = null;
        this.offsetPos = (this.settings.vertical) ? 'top' : 'left';
        this.stepsTotal = null;

        this._init();
    };

    CFW_Widget_Slider.DEFAULTS = {
        min : null,         // min value
        max : null,         // max value
        step : 1,           // small step increment
        chunk : null,       // large step increment (will be auto determined if not defined)
        enabled : true,     // true - enabled / false - disabled
        vertical : false,   // alternate orientation
        reversed : false    // show thumbs in opposite order
    };

    CFW_Widget_Slider.prototype = {
        _init : function() {
            var inputs = this._initInputs();
            if (inputs === false) { return; }

            this._initChunk();

            this.createSlider();
            this.updateValues();
            this.updateThumbs();
            this.updateLabels();
            if (this.settings.enabled) {
                this.enable(true);
            } else {
                this.disable();
            }

            this.$element.attr('data-cfw', 'slider');

            this.$slider.CFW_trigger('init.cfw.slider');
        },

        _initInputs : function() {
            var $inputs = this.$element.find('input');
            if ($inputs.length <= 0) {
                $inputs = this.$element.find('select');
            }
            if ($inputs.length <= 0) {
                return false;
            }

            this.$inputMin = $inputs.eq(0);

            if (this.$inputMin[0].nodeName == 'SELECT') { this.ordinal = true; }
            if ($inputs.length > 1) {
                this.$inputMax = $inputs.eq($inputs.length - 1);
                this.range = true;
            }
        },

        _initChunk : function() {
            this.stepsTotal = Math.floor((this.settings.max - this.settings.min) / this.settings.step);
            if (!this.settings.chunk) {
                this.settings.chunk = this.stepsTotal > 4 ?  Math.round(this.stepsTotal / 4) : this.settings.step * 2;
            }
        },

        createSlider : function() {
            /* Slider element */
            var slider = document.createElement('div');
            this.$slider = $(slider).addClass('slider');
            if (this.settings.vertical) {
                $(slider).addClass('slider-vertical');
            } else {
                $(slider).addClass('slider-horizontal');
            }
            // var sliderID = this.$slider.CFW_getID('cfw-slider');

            /* Track elements */
            var track = document.createElement('div');
            this.$track = $(track).addClass('slider-track');
            var selection = document.createElement('div');
            this.$selection = $(selection).addClass('slider-selection');

            /* Thumb/handle elements */
            var $labelMin = this._getLabel(this.$inputMin);
            var labelMinID = $labelMin.CFW_getID('cfw-slider');
            this.labelMinTxt = $labelMin.text();

            var thumbMin = document.createElement('div');
            this.$thumbMin = $(thumbMin).addClass('slider-thumb slider-thumb-min')
                .attr({
                    'role': 'slider',
                    'tabindex': -1,
                    'aria-labelledby': labelMinID
                });

            if (this.range) {
                var $labelMax = this._getLabel(this.$inputMax);
                var labelMaxID = $labelMax.CFW_getID('cfw-slider');
                this.labelMaxTxt = $labelMax.text();

                var thumbMax = document.createElement('div');
                this.$thumbMax = $(thumbMax).addClass('slider-thumb slider-thumb-max')
                    .attr({
                        'role': 'slider',
                        'tabindex': -1,
                        'aria-labelledby': labelMaxID
                    });

                this.$thumbMin.attr('aria-controls', this.$thumbMax.CFW_getID('cfw-slider'));
                this.$thumbMax.attr('aria-controls', this.$thumbMin.CFW_getID('cfw-slider'));
            }

            // Attach elements together and insert
            this.$track.append(this.$selection);
            this.$track.append(this.$thumbMin);
            if (this.range) { this.$track.append(this.$thumbMax); }

            this.$slider.append(this.$track);

            this.$element.append(this.$slider);
        },

        updateValues : function() {
            this.val0 = (this.ordinal) ? this.$inputMin[0].selectedIndex : parseFloat(this.$inputMin.val());
            if (!this.range) {
                this.$thumbMin.attr({
                    'aria-valuemin': this.settings.min,
                    'aria-valuemax': this.settings.max,
                    'aria-valuenow': this.val0
                });
            } else {
                this.val1 = (this.ordinal) ? this.$inputMax[0].selectedIndex : parseFloat(this.$inputMax.val());
                this.$thumbMin.attr({
                    'aria-valuemin': this.settings.min,
                    'aria-valuemax': this.val1,
                    'aria-valuenow': this.val0
                });
                this.$thumbMax.attr({
                    'aria-valuemin': this.val0,
                    'aria-valuemax': this.settings.max,
                    'aria-valuenow': this.val1
                });
            }
        },

        updateThumbs : function() {
            var valStart;
            var valEnd;
            var pctStart;
            var pctEnd;
            var pctSize;
            var selStart;

            // Reset visuals
            this.$selection.css({
                'top': '',
                'left': '',
                'width': '',
                'height': ''
            });
            this.$thumbMin.css({
                'top': '',
                'left': ''
            });
            if (this.range) {
                this.$thumbMax.css({
                    'top': '',
                    'left': ''
                });
            }

            if (!this.range) {
                valStart = this.settings.min;
                valEnd = this.val0;
            } else {
                valStart = this.val0;
                valEnd = this.val1;
            }

            pctStart = ((valStart - this.settings.min) / (this.settings.max - this.settings.min)) * 100;
            selStart = pctStart;
            pctEnd  = ((valEnd - this.settings.min) / (this.settings.max - this.settings.min)) * 100;

            if (pctStart < 0) { pctStart = 0; }
            if (pctEnd > 100) { pctEnd = 100; }

            pctSize = pctEnd - pctStart;
            if (this.settings.reversed) {
                pctStart = 100 - pctStart;
                pctEnd = 100 - pctEnd;
                selStart = pctEnd;
            }
            var pos = (this.settings.vertical) ? 'top' : 'left';
            var dim = (this.settings.vertical) ? 'height' : 'width';

            this.$selection.css(pos, selStart + '%').css(dim, pctSize + '%');
            if (!this.range) {
                this.$thumbMin.css(pos, pctEnd + '%');
            } else {
                this.$thumbMin.css(pos, pctStart + '%');
                this.$thumbMax.css(pos, pctEnd + '%');
            }
        },

        updateLabels : function() {
            this.$thumbMin.attr('aria-valuetext', this.labelMinTxt + ' ' + this.$inputMin.val());
            if (this.range) {
                this.$thumbMax.attr('aria-valuetext', this.labelMaxTxt + ' ' + this.$inputMax.val());
            }
        },

        enable : function(init) {
            if (init === undefined) { init = false; }
            if (!init && this.settings.enabled) { return; }
            this.settings.enabled = true;
            this.$slider.removeClass('disabled');
            this.bindSlider();
            this.$slider.CFW_trigger('enabled.cfw.slider');
        },

        disable : function() {
            if (!this.settings.enabled) { return; }
            this.settings.enabled = false;
            this.$slider.addClass('disabled');
            this.unbindSlider();
            this.$slider.CFW_trigger('disabled.cfw.slider');
        },

        bindSlider : function() {
            var $selfRef = this;
            var $thumbs = this.$thumbMin;
            var $inputs = this.$inputMin;
            if (this.range) {
                $thumbs = $thumbs.add(this.$thumbMax);
                $inputs = $inputs.add(this.$inputMax);
            }

            $thumbs.attr('tabindex', 0).on('keydown.cfw.slider', function(e) {
                    $selfRef._actionsKeydown(e, this);
                })
                .on('focusin.cfw.slider', function() {
                    $(this).css('z-index', parseInt($(this).css('z-index'), 10) + 1);
                })
                .on('focusout.cfw.slider', function() {
                    $(this).css('z-index', '');
                });

            this.$track
                .on('dragStart.cfw.drag', function(e) {
                    $selfRef._dragStart(e);
                })
                .on('drag.cfw.drag', function(e) {
                    $selfRef._drag(e);
                })
                .on('dragEnd.cfw.drag', function() {
                    $selfRef._dragEnd();
                })
                .CFW_Drag();

            $inputs.on('change.cfw.slider', function() {
                var $node = $(this);
                var newVal = ($selfRef.ordinal) ? $node[0].selectedIndex : parseFloat($node.val());
                $selfRef.changeValue(newVal, $node, true);
            });
        },

        unbindSlider : function() {
            var $thumbs = this.$thumbMin;
            var $inputs = this.$inputMin;
            if (this.range) {
                $thumbs = $thumbs.add(this.$thumbMax);
                $inputs = $inputs.add(this.$inputMax);
            }
            $thumbs.attr('tabindex', '').off('.cfw.slider');
            this.$track.CFW_Drag('dispose');
            $inputs.off('.cfw.slider');
        },

        decrement : function(byChunk, $input) {
            var currVal = (this.ordinal) ? $input[0].selectedIndex : parseFloat($input.val());
            this.changeValue(currVal - (byChunk ? this.settings.chunk * this.settings.step : this.settings.step), $input);
        },

        increment : function(byChunk, $input) {
            var currVal = (this.ordinal) ? $input[0].selectedIndex : parseFloat($input.val());
            this.changeValue(currVal + (byChunk ? this.settings.chunk * this.settings.step : this.settings.step), $input);
        },

        changeValue : function(newVal, $input, inputUpdate) {
            if (inputUpdate === undefined) { inputUpdate = false; }

            var oldVal = (this.ordinal) ? $input[0].selectedIndex : parseFloat($input.val());

            var limitLow;
            var limitHigh;
            if (!this.range) {
                limitLow = this.settings.min;
                limitHigh = this.settings.max;
            } else {
                if ($input.is(this.$inputMax)) {
                    limitLow = this.val0;
                    limitHigh = this.settings.max;
                } else {
                    limitLow = this.settings.min;
                    limitHigh = this.val1;
                }
            }

            var updVal;
            if (newVal !== undefined) {
                updVal = Math.min(Math.max(newVal, limitLow), limitHigh);
                // make the value snap to the chosen increment
                updVal = Math.round(updVal / this.settings.step) * this.settings.step;
            }
            if (updVal === undefined) { return; }

            if (this.ordinal) {
                $input[0].selectedIndex = updVal;
            } else {
                $input.prop('value', updVal);
            }
            this.updateValues();
            this.updateThumbs();
            this.updateLabels();

            if (!inputUpdate) {
                this.$slider.CFW_trigger('slid.cfw.slider');
            }
            if (inputUpdate || (updVal != oldVal)) {
                this.$slider.CFW_trigger('changed.cfw.slider');
            }
        },

        _getInput : function(node) {
            var $node = $(node);
            if ($node.is(this.$thumbMax)) {
                return this.$inputMax;
            } else {
                return this.$inputMin;
            }
        },

        _getLabel : function($input) {
            var $label = $('label[for="' + $input.attr('id') + '"]');
            if ($label.length <= 0) {
                $label = $input.closest('label');
            }
            return $label;
        },

        _actionsKeydown : function(e, node) {
            var $selfRef = this;

            // 37-left, 38-up, 39-right, 40-down, 33-pgup, 34-pgdn, 35-end, 36-home
            if (!/(37|38|39|40|33|34|35|36)/.test(e.which)) { return; }

            e.stopPropagation();
            e.preventDefault();

            var $input = this._getInput(node);

            switch (e.which) {
                case 37: // left
                case 40: // down
                    $selfRef.decrement(false, $input);
                    break;
                case 38: // up
                case 39: // right
                    $selfRef.increment(false, $input);
                    break;
                case 33: // pgup
                    $selfRef.increment(true, $input);
                    break;
                case 34: // pgdn
                    $selfRef.decrement(true, $input);
                    break;
                case 35: // end
                    $selfRef.changeValue(this.settings.max, $input);
                    break;
                case 36: // home
                    $selfRef.changeValue(this.settings.min, $input);
                    break;
            }
        },

        _dragStart : function(e) {
            var $node = $(e.currentTarget);
            if ($node.is(this.$track)) {
                $node = this._closestThumb(e);
            }
            $node.trigger('focus');

            this.inDrag = $node[0];

            var pos = this.settings.vertical ? e.startY : e.startX;
            var trackOff = this.$track.offset();
            var newPos = pos - trackOff[this.offsetPos];
            this.startPos = newPos;

            var newVal = this._positionToValue(newPos);
            var $input = this._getInput($node[0]);
            this.changeValue(newVal, $input);

            this.$slider.CFW_trigger('dragStart.cfw.slider');
        },

        _drag : function(e) {
            if (this.inDrag == null) { return; }
            var delta = this.settings.vertical ? e.deltaY : e.deltaX;
            var newPos = this.startPos + delta;
            var $input = this._getInput(this.inDrag);
            var newVal = this._positionToValue(newPos);
            this.changeValue(newVal, $input);
        },

        _dragEnd : function() {
            this.inDrag = null;
            this.startPos = null;
            this.$slider.CFW_trigger('dragEnd.cfw.slider');
        },

        _positionToValue : function(pos) {
            var trackDim;
            if (this.settings.vertical) {
                trackDim = this.$track.outerHeight();
            } else {
                trackDim = this.$track.outerWidth();
            }

            var ratio = trackDim / this.stepsTotal;

            pos = (this.settings.reversed) ? trackDim - pos : pos;
            return (Math.round(pos / ratio) * this.settings.step) + this.settings.min;
        },

        _closestThumb : function(e) {
            var $node;
            if (this.range) {
                var pos = this.settings.vertical ? e.pageY : e.pageX;
                var trackOff = this.$track.offset();
                var diff1 = Math.abs(pos - trackOff[this.offsetPos] - this.$thumbMin.position()[this.offsetPos]);
                var diff2 = Math.abs(pos - trackOff[this.offsetPos] - this.$thumbMax.position()[this.offsetPos]);
                $node = (diff1 < diff2) ? this.$thumbMin : this.$thumbMax;
            } else {
                $node = this.$thumbMin;
            }
            return $node;
        },

        dispose : function() {
            this.unbindSlider();
            this.$element.removeData('cfw.slider');
            this.$slider.remove();

            this.$element = null;
            this.$slider = null;
            this.$track = null;
            this.$selection = null;
            this.$thumbMin = null;
            this.$thumbMax = null;
            this.$inputMin = null;
            this.labelMinTxt = null;
            this.$inputMax = null;
            this.labelMaxTxt = null;
            this.ordinal = null;
            this.range = null;
            this.val0 = null;
            this.val1 = null;
            this.settings = null;
            this.inDrag = null;
            this.startPos = null;
            this.offsetPos = null;
            this.stepsTotal = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.slider');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.slider', (data = new CFW_Widget_Slider(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Slider = Plugin;
    $.fn.CFW_Slider.Constructor = CFW_Widget_Slider;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): equalize.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Equalize = function(element, options) {
        this.$element = $(element);
        this.$window = $(window);
        this.instance = '';

        var parsedData = this.$element.CFW_parseData('equalize', CFW_Widget_Equalize.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Equalize.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Equalize.DEFAULTS = {
        target   : '',
        throttle : 250,     // Throttle speed to limit event firing
        stack    : false,   // Equalize items when stacked
        row      : false,   // Equalize items by row
        minimum  : false    // Use minimum height
    };

    CFW_Widget_Equalize.prototype = {
        _init : function() {
            this.instance = $('<div/>').CFW_getID('cfw-equalize');
            this.$window.on('resize.cfw.equalize.' + this.instance, $().CFW_throttle($.proxy(this.update, this), this.settings.throttle));

            this.$element.attr('data-cfw', 'equalize');
            this.$element.CFW_trigger('init.cfw.equalize');
            this.update(true);
        },

        equalize : function(nest) {
            var $selfRef = this;
            var isStacked = false;
            var topOffset;

            // Drop out if nested, wait until descendants are done
            if (nest === undefined) {
                nest = false;
            }
            var $nested = this.$element.find('[data-cfw="equalize"]');
            var isNested = false;
            if (!nest) {
                $nested.each(function() {
                    var data = $(this).data('cfw.equalize');
                    if (data) { isNested = true; }
                });
                if (isNested) { return; }
            }
            if (!this.$element.CFW_trigger('beforeEqual.cfw.equalize')) {
                return;
            }

            // Get group ID
            var groupID = this.settings.target;
            if ((groupID === undefined) || (groupID.length <= 0)) { return false; }

            // Find target by id/css selector
            var $targetElm = $(this.settings.target, this.$element);
            if (!$targetElm.length) {
                // Get group items
                $targetElm = $('[data-cfw-equalize-group="' + groupID + '"]', this.$element);
            }
            $targetElm = $targetElm.filter(':visible');

            var total = $targetElm.length;
            if (total <= 0) { return false; }

            $targetElm.height('');

            if (this.settings.row && !this.settings.stack) {
                var rowOffset = 0;
                var $rowElm = $();

                $targetElm.each(function(count) {
                    var $node = $(this);

                    rowOffset = parseInt($node.offset().top, 10);
                    if (rowOffset !== topOffset) {
                        // Update current row
                        if ($rowElm.length > 1) {
                            $selfRef._applyHeight($rowElm);
                        }
                        // Start new row and get revised offset
                        $rowElm = $();
                        topOffset = parseInt($node.offset().top, 10);
                    }

                    // Continue on row
                    $rowElm = $rowElm.add($node);

                    // If last element - update remaining heights
                    if (count === total - 1) {
                        $selfRef._applyHeight($rowElm);
                    }
                });
            } else {
                if (!this.settings.stack) {
                    topOffset = $targetElm.first().offset().top;
                    $targetElm.each(function() {
                        if ($(this).offset().top !== topOffset) {
                            isStacked = true;
                            return false;
                        }
                    });
                }
                if (!isStacked) {
                    this._applyHeight($targetElm);
                }
            }

            this.$element.CFW_trigger('afterEqual.cfw.equalize');

            // Handle any nested equalize
            this.$element.parent().closest('[data-cfw="equalize"]').each(function() {
                var $this = $(this);
                var data = $this.data('cfw.equalize');
                if (typeof data === 'object') {
                    $this.CFW_Equalize('update', true);
                }
            });
        },

        _applyHeight : function($nodes, callback) {
            var heights = $nodes.map(function() {
                    return $(this).outerHeight(false);
                }).get();

            if (this.settings.minimum) {
                var min = Math.min.apply(null, heights);
                $nodes.css('height', min);
            } else {
                var max = Math.max.apply(null, heights);
                $nodes.css('height', max);
            }

            if (!callback) { return; }
            callback();
        },

        update : function(nest) {
            var $selfRef = this;
            if (nest === undefined || typeof nest === 'object') {
                nest = false;
            }
            var $images = this.$element.find('img');
            this.imageLoaded($images, function() {
                $selfRef.equalize(nest);
            });
        },

        imageLoaded : function($images, callback) {
            var $selfRef = this;
            var unloaded = $images.length;

            function imgHasHeight($images) {
                var imgCount = $images.length;

                for (var i = imgCount - 1; i >= 0; i--) {
                    if ($images.attr('height') === undefined) {
                        return false;
                    }
                }

                return true;
            }

            if (unloaded === 0 || imgHasHeight($images)) {
                callback($images);
            }

            $images.each(function() {
                $selfRef.imageWatch($(this), function() {
                    unloaded -= 1;
                    if (unloaded === 0) {
                        callback($images);
                    }
                });
            });
        },

        imageWatch : function($image, callback) {
            function hasLoaded() {
                callback($image[0]);
            }

            function addEvent() {
                $image.off('load').one('load', hasLoaded);

                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var src = $image.attr('src');
                    var param = src.match(/\?/) ? '&' : '?';
                    param += 'cfwequalize=' + (new Date()).getTime();
                    $image.attr('src', src + param);
                }
            }

            if (!$image.attr('src')) {
                hasLoaded();
                return;
            }

            if ($image.is('[data-cfw="lazy"]')) {
                $image.one('afterShow.cfw.lazy', hasLoaded);
            } else if ($image[0].complete || $image[0].readyState === 4) {
                hasLoaded();
            } else {
                addEvent();
            }
        },

        dispose : function() {
            this.$window.off('.cfw.equalize.' +  this.instance);
            this.$element.removeData('cfw.equalize');

            this.$element = null;
            this.$window = null;
            this.instance = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.equalize');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.equalize', (data = new CFW_Widget_Equalize(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Equalize = Plugin;
    $.fn.CFW_Equalize.Constructor = CFW_Widget_Equalize;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): player.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    // Borrowed on 12/05/2014 from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
    function audioTest() {
        /* jshint -W053 */
        /* jshint -W084 */
        var elem = document.createElement('audio');
        var bool = false;

        try {
            if (bool = !!elem.canPlayType) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3  = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');
                bool.opus = elem.canPlayType('audio/ogg; codecs="opus"') .replace(/^no$/, '');

                // Mimetypes accepted:
                // http://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                // http://bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a  = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(/^no$/, '');
            }
        } catch (e) { }

        return bool;
    }

    // Borrowed on 12/05/2014 from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/video.js
    function videoTest() {
        /* jshint -W053 */
        /* jshint -W084 */
        var elem = document.createElement('video');
        var bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
                bool.vp9 = elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');
                bool.hls = elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
            }
        } catch (e){}

        return bool;
    }

    var html5 = {
        audio: null,
        video: null
    };
    html5.audio = audioTest();
    html5.video = videoTest();

    var CFW_Widget_Player = function(element, options) {
        this.$element = $(element);
        this.type = 'audio';
        this.$media = null;
        this.media = null;
        this.$player = null;
        this.$focus = null;
        this.$sliderSeek = null;
        this.$volSeek = null;
        this.activity = null;
        this.over = null;
        this.userActive = true;
        this.activityTimer = null;
        this.mouseActivity = null;
        this.scrubPlay = null;
        this.played = false;

        this.status = {
            duration: 0,
            currentTime: 0,
            remaining: 0
        };
        this.support = {
            mute: true,
            volume: true
        };
        this.trackValid = [];
        this.trackCurrent = -1;

        this.$scriptElm = null;
        this.scriptCurrent = -1;
        this.scriptCues = null;

        var parsedData = this.$element.CFW_parseData('player', CFW_Widget_Player.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Player.DEFAULTS, parsedData, options);

        this._init();
    };

    CFW_Widget_Player.DEFAULTS = {
        src: '',
        transcript: -1,             // Default transcript off
        transcriptScroll : true,    // Scroll transcript
        transcriptOption : true     // Show transcript options
    };

    CFW_Widget_Player.prototype = {
        _init : function() {
            this.$media = this.$element.find('audio, video');
            this.media = this.$media[0];

            if (this.media == null) {
                return false;
            }

            if (this.media.nodeName == 'VIDEO') {
                this.type = 'video';
            }

            if ((this.type == 'audio' && !html5.audio) || (this.type == 'video' && !html5.video)) {
                this.$media.CFW_trigger('noSupport.cfw.player');
                return false;
            }

            this.$element.attr('data-cfw', 'player')
                .addClass('player-unstarted');

            this.$player = this.$element.find('[data-cfw-player="player"]');
            if (this.$player.length > 0) {
                // Hide browsers default player
                this.media.controls = false;
            }

            // Check if loaded
            // this.loadCheck();
            this.loadComplete();
        },

        insertPlayer : function() {
            var $newPlayer = $(document.createElement('div'))
                .addClass('player');

            // Insert player
            this.$media.after($newPlayer);
        },

        loadCheck : function() {
            /* Need better method - do not use for now - assume media loads fine */

            var $selfRef = this;
            var timeout = 0;

            // Work around some players wehre track is not loaded until played
            try {
                this.media.play();
                this.media.pause();
            } catch (e) {
                this.error();
                return;
            }

            var isLoaded = setInterval(function() {
                if ($selfRef.media.readyState > 0) {
                    clearInterval(isLoaded);
                    $selfRef.loadComplete();
                    return;
                }
                if ($selfRef.media.networkState === 3 || timeout === 75) {
                    clearInterval(isLoaded);
                    $selfRef.error();
                    return;
                }
                timeout++;
            }, 50);
        },

        loadComplete : function() {
            var $selfRef = this;

            // Attach event handlers
            this.$media.on('error', function() {
                $selfRef.error();
            });
            this.$media.on('play canplay pause', function() {
                $selfRef.controlStatus();
                $selfRef.playedStatus();
            });
            this.$media.on('loadedmetadata loadeddata progress canplay canplaythrough timeupdate durationchange', function() {
                $selfRef.playedStatus();
                $selfRef.timeStatus();
                $selfRef.seekStatus();
            });
            this.$media.on('ended', function() {
                $selfRef.seekReset();
            });
            this.$media.on('volumechange', function() {
                $selfRef.muteStatus();
                $selfRef.volumeStatus();
            });
            if (this.type == 'video') {
                // http://stackoverflow.com/questions/9621499/fullscreen-api-which-events-are-fired
                $(document).on('webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange', function() {
                    $selfRef.fullscreenStatus();
                });
                this.$player.on('mouseenter mouseleave', function(e) {
                    $selfRef.activity = true;
                    switch (e.type) {
                        case 'mouseenter': {
                            $selfRef.over = true;
                            break;
                        }
                        case 'mouseleave': {
                            $selfRef.over = false;
                            break;
                        }
                    }
                });
                this.$element.on('mousemove mousedown mouseup keydown keyup touchmove touchstart touchend', function(e) {
                    $selfRef.activity = true;
                    switch (e.type) {
                        case 'mousedown':
                        case 'touchstart': {
                            clearInterval($selfRef.mouseActivity);
                            $selfRef.mouseActivity = setInterval(function() {
                                $selfRef.activity = true;
                            }, 250);
                            break;
                        }
                        case 'mouseup':
                        case 'touchend': {
                            clearInterval($selfRef.mouseActivity);
                            break;
                        }
                    }
                });
                this.$media.on('click', function() {
                    $selfRef.toggle();
                    $selfRef._focusHelper();
                });
                this.activityInit();
            }

            // Link controls
            this.$player.on('click', '[data-cfw-player="play"]', function(e) {
                e.preventDefault();
                $selfRef.media.play();
                $selfRef._focusControl($selfRef.$player.find('[data-cfw-player="pause"]')[0]);
            });
            this.$player.on('click', '[data-cfw-player="pause"]', function(e) {
                e.preventDefault();
                $selfRef.media.pause();
                $selfRef._focusControl($selfRef.$player.find('[data-cfw-player="play"]')[0]);
            });
            this.$player.on('click', '[data-cfw-player="stop"]', function(e) {
                e.preventDefault();
                $selfRef.stop();
                $selfRef._focusControl(this);
            });
            this.$player.on('click', '[data-cfw-player="mute"]', function(e) {
                e.preventDefault();
                $selfRef.mute();
                $selfRef._focusControl(this);
            });
            this.$player.on('click', '[data-cfw-player="loop"]', function(e) {
                e.preventDefault();
                $selfRef.loop();
                $selfRef._focusControl(this);
            });
            this.$player.on('click', '[data-cfw-player="fullscreen"]', function(e) {
                e.preventDefault();
                $selfRef.fullscreen();
                $selfRef._focusControl(this);
            });

            // Key handler
            this.$element.on('keydown', function(e) {
                $selfRef._actionsKeydown(e);
            });

            // Update indicators
            this.controlStatus();
            this.volumeSupport();
            this.timeStatus();
            this.seekStatus();
            this.muteStatus();
            this.volumeStatus();
            this.loopStatus();

            this.trackList();
            if (this.type == 'video') {
                this.trackInit();
            }
            this.scriptInit();

            this.$player.addClass('ready');

            // Inject focus helper item
            var focusDiv = document.createElement('div');
            focusDiv.className = 'player-focus sr-only';
            focusDiv.tabIndex = '-1';
            this.$focus = $(focusDiv);
            this.$element.prepend(this.$focus);

            this.$media.CFW_trigger('ready.cfw.player');

            // Handle element attributes
            if (this.media.autoplay) {
                this.media.play();
            }
        },

        error : function() {
            this.$media.CFW_trigger('error.cfw.player');
        },

        toggle : function() {
            if (this.media.paused) {
                this.playedStatus(true);
                this.media.play();
            } else {
                this.media.pause();
            }
        },

        play : function() {
            this.playedStatus(true);
            this.media.play();
        },

        pause : function() {
            this.media.pause();
        },

        stop : function() {
            this.media.pause();
            this.seekTo(0.0);
        },

        controlStatus : function() {
            var $ctlElm = this.$player.find('[data-cfw-player="control"]');
            var $playElm = this.$player.find('[data-cfw-player="play"]');
            var $pauseElm = this.$player.find('[data-cfw-player="pause"]');

            $ctlElm.removeClass('pause play');
            $playElm.add($pauseElm).removeClass('on off').addClass('off');

            if (this.media.paused) {
                // Paused/stopped
                $ctlElm.addClass('pause');
                $playElm.removeClass('off').addClass('on');
                this.$element.addClass('player-paused');
            } else {
                // Playing
                $ctlElm.addClass('play');
                $pauseElm.removeClass('off').addClass('on');
                this.$element.removeClass('player-paused');
            }
        },

        playedStatus : function(force) {
            if (force === undefined) { force = false; }
            if (!this.played) {
                if (force || this.media.played.length > 0) {
                    this.played = true;
                    this.$element.removeClass('player-unstarted');
                }
            }
        },

        timeStatus : function() {
            this.status.duration    = this.media.duration;
            this.status.currentTime = this.media.currentTime;
            this.status.remaining   = this.status.duration - this.status.currentTime;
            if (this.status.remaining < 0) this.status.remaining = 0;

            var $durElm = this.$player.find('[data-cfw-player="time-duration"]');
            var $curElm = this.$player.find('[data-cfw-player="time-current"]');
            var $remElm = this.$player.find('[data-cfw-player="time-remainder"]');

            if (this.status.duration > 0) {
                this.$player.removeClass('player-notime');
            } else {
                this.$player.addClass('player-notime');
            }
            if (this.status.duration === Infinity) {
                this.$player.addClass('player-live');
            } else {
                this.$player.removeClass('player-live');
            }

            $durElm.html(this.timeSplit(this.status.duration));
            $curElm.html(this.timeSplit(this.status.currentTime));
            $remElm.html(this.timeSplit(this.status.remaining));
        },

        timeSplit : function(t) {
            if (isNaN(t) || t === Infinity) { t = 0; }

            var hours = Math.floor(t / 3600);
            var minutes = Math.floor(t / 60) - (hours * 60);
            var seconds = Math.floor(t) - (hours * 3600) - (minutes * 60);
            var timeStr = this.timeDigits(minutes) + ':' + this.timeDigits(seconds);
            if (hours > 0) {
                timeStr = hours + ':' + timeStr;
            }
            if (timeStr.indexOf('0') === 0) {
                timeStr = timeStr.substr(1);
            }
            return timeStr;
        },

        timeDigits : function(t) {
            return ('0' + t).slice(-2);
        },

        seekStatus : function() {
            var $seekElm = this.$player.find('[data-cfw-player="seek"]');

            if ($seekElm.find('input').length) {
                this.seekSlider();
            } else if ($seekElm.hasClass('progress')) {
                this.seekProgress();
            }
        },

        seekSlider : function() {
            var $selfRef = this;

            if (isNaN(this.media.duration) || this.media.duration === Infinity) { return; }

            if (this.$sliderSeek == null) {
                this.$sliderSeek = this.$player.find('[data-cfw-player="seek"]');
                this.$sliderSeek.CFW_Slider({
                    min: 0,
                    max: this.media.duration,
                    step: 0.5
                });
                this.$sliderSeek.on('slid.cfw.slider', function() {
                    var newTime = $(this).data('cfw.slider').val0;
                    $selfRef.seekTo(newTime);
                });
                // Pause while scrubbing
                var $sliderControls = this.$sliderSeek.add(this.$sliderSeek.find('.slider-thumb'));
                $sliderControls.on('keydown.cfw.slider dragStart.cfw.slider', function(e) {
                    if (e.type == 'keydown' && (!/(37|38|39|40|33|34|35|36)/.test(e.which))) { return; }
                    if (e.type == 'keydown') { e.stopPropagation; }
                    $sliderControls.off('keyup.cfw.slider dragEnd.cfw.slider');
                    if ($selfRef.scrubPlay == null) {
                        $selfRef.scrubPlay = !$selfRef.media.paused;
                    }
                    $selfRef.media.pause();
                    $(e.currentTarget).one('keyup.cfw.slider dragEnd.cfw.slider', function(e) {
                        if (e.type == 'keyup') { e.stopPropagation; }
                        if ($selfRef.scrubPlay === true) {
                            $selfRef.media.play();
                        }
                        $selfRef.scrubPlay = null;
                    });
                });
            }

            var $inputElm = this.$sliderSeek.find('input').eq(0);
            this.$sliderSeek.CFW_Slider('changeValue', this.media.currentTime, $inputElm, true);
        },

        seekProgress : function() {
            if (isNaN(this.media.duration) || this.media.duration === Infinity) { return; }

            var $curElm = this.$player.find('[data-cfw-player="seek-current"]');
            $curElm.attr('role', 'progressbar').attr('aria-label', 'Playback progress');

            var cp = (this.media.currentTime / this.media.duration) * 100;
            if (cp > 100) { cp = 100; }

            $curElm.attr({
                    'aria-valuemin' : 0,
                    'aria-valuemax' : 100,
                    'aria-valuenow' : cp
                })
                .css('width', cp + '%');
        },

        seekReset : function() {
            if (!this.media.loop) {
                this.media.pause();
            } else {
                this.media.play();
            }
        },

        seekIncrement : function(delta) {
            var time = this.media.currentTime + delta;
            var newTime = (time < 0) ? 0 : ((time > this.media.duration) ? this.media.duration : time);
            this.seekTo(newTime);
        },

        seekTo : function(timestamp) {
            var seekable = this.media.seekable;
            if (seekable.length > 0 && timestamp >= seekable.start(0) && timestamp <= seekable.end(0)) {
                this.media.currentTime = timestamp;
            }
        },

        mute : function() {
            this.media.muted = !this.media.muted;
            this.muteStatus();
            this.volumeStatus();
        },

        muteStatus : function() {
            var $muteElm = this.$player.find('[data-cfw-player="mute"]');

            if (!this.support.mute) {
                $muteElm.addClass('disabled');
            } else if (this.media.muted) {
                $muteElm.addClass('active');
            } else {
                $muteElm.removeClass('active');
            }
        },

        volumeSupport : function() {
            var muted = this.media.muted;
            var holdVol = this.media.volume;
            var testVol = 0.5;

            if (this.media.volume === 0.5) {
                testVol = 0.25;
            }
            this.media.volume = testVol;
            if (this.media.volume !== testVol) {
                this.support.mute = false;
                this.support.volume = false;
            }
            this.media.volume = holdVol;
            this.media.muted = muted;
        },

        volumeStatus : function() {
            var $selfRef = this;
            var $volElm = this.$player.find('[data-cfw-player="volume"]');

            if ($volElm.find('input').length <= 0) { return; }

            if (!this.support.mute) {
                $volElm.addClass('disabled');
                return;
            }

            if (this.$volSeek == null) {
                this.$volSeek = $volElm;
                this.$volSeek.CFW_Slider({
                    min: 0,
                    max: 1,
                    step: 0.01
                });
                this.$volSeek.on('slid.cfw.slider', function() {
                    var newVol = parseFloat($(this).data('cfw.slider').val0);

                    if (newVol === 0) {
                        $selfRef.media.muted = true;
                    } else {
                        $selfRef.media.muted = false;
                        $selfRef.media.volume = newVol;
                    }
                });
            }

            var $inputElm = this.$volSeek.find('input').eq(0);
            if (!this.media.muted) {
                this.$volSeek.CFW_Slider('changeValue', this.media.volume, $inputElm, true);
            } else {
                this.$volSeek.CFW_Slider('changeValue', 0, $inputElm, true);
            }
        },

        volumeIncrement : function(delta) {
            var vol = (this.media.volume * 100) + delta;
            var newVol = (vol < 0) ? 0 : ((vol > 100) ? 100 : parseInt(vol, 10));
            this.media.volume = newVol / 100;
        },

        loop : function(setting) {
            if (setting !== undefined) {
                // set on/off
                this.media.loop = setting;
            } else {
                // toggle
                this.media.loop = !this.media.loop;
            }
            this.loopStatus();
        },

        speed : function(setting) {
            if (setting !== undefined) {
                this.media.playbackRate = setting;
            }
        },

        loopStatus : function() {
            var $loopElm = this.$player.find('[data-cfw-player="loop"]');
            if (this.media.loop) {
                $loopElm.addClass('active');
                this._pressedState($loopElm, true);
            } else {
                $loopElm.removeClass('active');
                this._pressedState($loopElm, false);
            }
        },

        // Fullscreen concepts from:
        // https://github.com/iandevlin/iandevlin.github.io/blob/master/mdn/video-player-with-captions/js/video-player.js
        isFullScreen : function() {
            // Checks if the player instance is currently in fullscreen mode
            var $fsNode = $(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
            return ($fsNode.is(this.$element));
        },

        fullscreen : function() {
            if (this.type == 'audio') { return; }
            if (this.isFullScreen()) {
                // Exit fullscreen
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            } else {
                // Go fullscreen
                // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
                var videoContainer = this.$element[0];
                if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
                else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
                else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
                else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
            }
        },

        fullscreenStatus : function() {
            var $fullElm = this.$player.find('[data-cfw-player="fullscreen"]');
            if (this.isFullScreen()) {
                $fullElm.addClass('active');
                this.$element.addClass('player-fulldisplay');
                this.$media.CFW_trigger('enterFullscreen.cfw.player');
            } else {
                $fullElm.removeClass('active');
                this.$element.removeClass('player-fulldisplay');
                this.$media.CFW_trigger('exitFullscreen.cfw.player');
            }
        },

        trackList : function() {
            var $selfRef = this;

            var tracks = this.media.textTracks;
            if (tracks.length <= 0) {
                return null;
            }

            var validTracks = [];
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].kind == 'captions' || tracks[i].kind == 'subtitles') {
                    validTracks.push(i);
                }
            }
            this.trackValid = validTracks;

            /* not fully supported by any browser?
                 - only fires once for some reason from browser default controls
            */
            this.media.textTracks.addEventListener('change', function() {
                $selfRef.trackStatus();
            });
        },

        trackInit : function() {
            var $selfRef = this;
            var $captionElm = this.$player.find('[data-cfw-player="caption"]');
            if ($captionElm.length <= 0) {
                return;
            }

            if (this.trackValid.length <= 0) {
                $captionElm.addClass('disabled');
                return;
            }

            if (this.trackValid.length == 1) {
                // Use toggle style
                this.$player.on('click', '[data-cfw-player="caption"]', function(e) {
                    e.preventDefault();
                    if ($captionElm.hasClass('active')) {
                        $selfRef.trackSet(-1);
                    } else {
                        $selfRef.trackSet(0);
                    }
                    $selfRef._focusControl(this);
                });

                if (this.media.textTracks[0].mode == 'showing') {
                    $selfRef.trackSet(0);
                }

            } else {
                // Build menu
                var wrapper = '<span class="player-caption-wrapper"></span>';
                var $menu = $('<ul class="player-caption-menu dropdown-menu"></ul>');
                $captionElm.wrap(wrapper);

                var $wrapper = $captionElm.parent(); /* Because $().wrap() clones element */

                $wrapper.append($menu);
                var menuID = $menu.CFW_getID('cfw-player');

                var $menuItem = $('<li class="player-caption-off"><a href="#" data-cfw-player-track="-1">Off</a></li>');
                $menu.append($menuItem);

                var tracks = this.media.textTracks;
                for (var i = 0; i < this.trackValid.length; i++) {
                    var trackID = this.trackValid[i];
                    $menuItem = $('<li><a href="#" data-cfw-player-track="' + trackID + '">' + tracks[trackID].label + '</a></li>');
                    $menu.append($menuItem);
                }

                this.$player.on('click', '[data-cfw-player-track]', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var num = $this.attr('data-cfw-player-track');
                    $selfRef.trackSet(num);
                });

                $captionElm.CFW_Dropdown({ toggle: '#' + menuID });
            }

            this.trackStatus();
        },

        trackSet : function(trackID) {
            trackID = parseInt(trackID, 10);

            var tracks = this.media.textTracks;
            if (tracks.length <= 0) {
                return;
            }

            this.trackCurrent = trackID;

            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].mode == 'showing') {
                    tracks[i].mode = 'hidden';
                }
                if (i === trackID) {
                    tracks[i].mode = 'showing';
                }
            }

            this.trackStatus();
        },

        trackStatus : function() {
            var tracks = this.media.textTracks;
            if (tracks.length <= 0) {
                return;
            }

            var $captionElm = this.$player.find('[data-cfw-player="caption"]');
            if ($captionElm.length <= 0) {
                return;
            }

            if (this.trackValid.length == 1) {
                // Toggle style
                if (this.trackCurrent == -1) {
                    $captionElm.removeClass('active');
                    this._pressedState($captionElm, false);
                } else {
                    $captionElm.addClass('active');
                    this._pressedState($captionElm, true);
                }
            } else {
                // Menu style
                var $captionPar = $captionElm.parent();
                $captionElm.removeClass('active');
                $captionPar.removeClass('active');
                $captionPar.find('[data-cfw-player-track]').closest('li').removeClass('active');

                for (var i = 0; i < tracks.length; i++) {
                    if (tracks[i].mode == 'showing') {
                        $captionElm.addClass('active');
                        $captionPar.addClass('active');
                        $captionPar.find('[data-cfw-player-track="' + i + '"]').closest('li').addClass('active');
                        this.trackCurrent = i;
                    }
                }
            }
        },

        scriptInit : function() {
            var $selfRef = this;
            var $tsElm = this.$player.find('[data-cfw-player="transcript"]');
            if ($tsElm.length <= 0) {
                return;
            }

            if (this.trackValid.length <= 0) {
                $tsElm.addClass('disabled');
                return;
            }

            if (this.trackValid.length == 1 && !this.settings.transcriptOption) {
                // Use toggle style
                $tsElm.removeClass('active');
                this._pressedState($tsElm, false);
                $tsElm.on('click', function(e) {
                    e.preventDefault();
                    if ($tsElm.hasClass('active')) {
                        $selfRef.scriptSet(-1);
                    } else {
                        $selfRef.scriptSet(0);
                    }
                    $selfRef._focusControl(this);
                });
            } else {
                // Build menu
                var wrapper = '<span class="player-script-wrapper"></span>';
                var $menu = $('<ul class="player-script-menu dropdown-menu"></ul>');
                $tsElm.wrap(wrapper);

                var $wrapper = $tsElm.parent(); /* Because $().wrap() clones element */

                $wrapper.append($menu);
                var menuID = $menu.CFW_getID('cfw-player');

                var $menuItem = $('<li class="player-script-off"><a href="#" data-cfw-player-script="-1">Off</a></li>');
                $menu.append($menuItem);

                var tracks = this.media.textTracks;
                for (var i = 0; i < this.trackValid.length; i++) {
                    var trackID = this.trackValid[i];
                    $menuItem = $('<li><a href="#" data-cfw-player-script="' + trackID + '">' + tracks[trackID].label + '</a></li>');
                    $menu.append($menuItem);
                }
                if (this.settings.transcriptOption) {
                    // Add scroll toggle
                    $menuItem = $('<li class="dropdown-divider"></li>');
                    $menu.append($menuItem);
                    var scrollVal = (this.settings.transcriptScroll) ? 'true' : 'false';
                    var scrollClass = (this.settings.transcriptScroll) ? 'active' : '';
                    $menuItem = $('<li><a href="#" class="player-script-scroll-check ' + scrollClass + '" data-cfw-player-script-scroll="' + scrollVal + '" aria-checked="' + scrollVal + '"><span class="player-script-scroll-check-icon"></span>Auto-scroll</a></li>');
                    $menu.append($menuItem);
                }

                // Event handlers
                this.$player.on('click', '[data-cfw-player-script]', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var num = $this.attr('data-cfw-player-script');
                    $selfRef.scriptSet(num);
                });
                if (this.settings.transcriptOption) {
                    this.$player.on('click', '[data-cfw-player-script-scroll]', function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        $selfRef.settings.transcriptScroll = !$selfRef.settings.transcriptScroll;
                        $this.attr('aria-checked', $selfRef.settings.transcriptScroll);
                        $this.toggleClass('active');
                    });
                }

                $tsElm.CFW_Dropdown({ toggle: '#' + menuID });
            }

            // Show transcript if set
            if (this.settings.transcript !== -1) {
                this.scriptSet(this.settings.transcript);
            }
        },

        scriptSet : function(trackID) {
            trackID = parseInt(trackID, 10);

            if (this.trackValid.length <= 0) {
                return;
            }
            if (this.trackValid.indexOf(trackID) == -1 && trackID != -1) {
                return;
            }

            // No update if same track is selected
            if (trackID == this.scriptCurrent) {
                return;
            }

            if (trackID == -1 && this.$scriptElm !== null) {
                if (!this.$media.CFW_trigger('beforeTranscriptHide.cfw.player')) {
                    return;
                }
            } else {
                if (!this.$media.CFW_trigger('beforeTranscriptShow.cfw.player')) {
                    return;
                }
            }

            var $tsElm = this.$player.find('[data-cfw-player="transcript"]');

            if (this.$scriptElm !== null) {
                this.$scriptElm.remove();
                this.$scriptElm = null;
            }
            this.$element.removeClass('player-scriptshow');

            if ($tsElm.length) {
                if (this.trackValid.length == 1 && !this.settings.transcriptOption) {
                    // Update toggle
                    $tsElm.removeClass('active');
                    this._pressedState($tsElm, false);
                } else {
                    // Update menu
                    var $tsPar = $tsElm.parent();
                    $tsElm.removeClass('active');
                    $tsPar.removeClass('active');
                    $tsPar.find('[data-cfw-player-script]').closest('li').removeClass('active');
                }
            }

            // Disable cuechange handling
            if (this.scriptCurrent !== -1) {
                $(this.media.textTracks[this.scriptCurrent]).off('cuechange.cfw.player.transcript');
                this.$media.off('timeupdate.cfw.player.transcript');
            }

            this.scriptCurrent = trackID;

            if (trackID == -1) {
                this.scriptCues = null;
                this.$media.CFW_trigger('afterTranscriptHide.cfw.player');
            } else {
                this.scriptLoad();
            }

        },

        scriptLoad : function(forced) {
            var $selfRef = this;

            if (forced === undefined) {
                forced = false;
            }

            this.$media.off('loadeddata.cfw.player.script');

            var tracks = this.media.textTracks;
            if (tracks.length <= 0 || this.scriptCurrent == -1) {
                this.scriptCues = null;
                return;
            }

            var cues = tracks[this.scriptCurrent].cues;
            if (cues == null || cues.length <= 0) {
                var hold = (this.trackCurrent == -1) ? null : tracks[this.trackCurrent].mode;
                // preload all tracks to stop future `load` event triggers on transcript change
                for (var i = 0; i < tracks.length; i++) {
                    tracks[i].mode = 'hidden';
                }
                // reset the caption track state
                if (hold !== null) {
                    tracks[this.trackCurrent].mode = hold;
                }
            }

            function scriptLoad2(forced) {
                var tracks = $selfRef.media.textTracks; // Reload object to get update
                var cues = tracks[$selfRef.scriptCurrent].cues;

                if (cues && cues.length <= 0 && !forced) {
                    // Force media to load
                    $selfRef.$media.one('loadeddata.cfw.player.script', function() {
                        $selfRef.scriptLoad(true);
                    });
                    $selfRef.$media.trigger('load');
                    return;
                }

                $selfRef.scriptCues = cues;
                $selfRef.scriptProcess();
            }

            // Short delay to next part
            setTimeout(function() {
                scriptLoad2(forced);
            }, 100);
        },

        scriptProcess : function() {
            var $selfRef = this;

            if (this.scriptCues == null) {
                return;
            }

            /* Borrowed from:
             * http://ableplayer.github.io/ableplayer/
             * https://github.com/ableplayer/ableplayer/blob/master/scripts/transcript.js
             *
             * Modified/simplified to handle *basic text string* cues in DOM object format
             */
            var addCaption = function(div, cap) {
                var $capSpan = $('<span class="player-scripttxt-seekpoint player-scripttxt-caption"></span>');

                var flattenString = function(str) {
                    var result = [];
                    if (str === '') {
                        return result;
                    }
                    var openBracket  = str.indexOf('[');
                    var closeBracket = str.indexOf(']');
                    var openParen    = str.indexOf('(');
                    var closeParen   = str.indexOf(')');

                    var hasBrackets = openBracket !== -1 && closeBracket !== -1;
                    var hasParens = openParen !== -1 && closeParen !== -1;

                    if ((hasParens && hasBrackets && openBracket < openParen) || hasBrackets) {
                        result = result.concat(flattenString(str.substring(0, openBracket)));
                        result.push($('<span class="player-scripttxt-unspoken">' + str.substring(openBracket, closeBracket + 1) + '</span>'));
                        result = result.concat(flattenString(str.substring(closeBracket + 1)));
                    } else if (hasParens) {
                        result = result.concat(flattenString(str.substring(0, openParen)));
                        result.push($('<span class="player-scripttxt-unspoken">' + str.substring(openParen, closeParen + 1) + '</span>'));
                        result = result.concat(flattenString(str.substring(closeParen + 1)));
                    } else {
                        result.push(str);
                    }

                    return result;
                };

                $capSpan.append(flattenString(cap.text));
                $capSpan.attr({
                    'data-start' : cap.startTime.toString(),
                    'data-end'   : cap.endTime.toString()
                });
                div.append($capSpan);
                div.append('\n');
            };

            var $tsElm = this.$player.find('[data-cfw-player="transcript"]');
            this.$element.addClass('player-scriptshow');

            if (this.trackValid.length == 1 && !this.settings.transcriptOption) {
                // Update toggle state
                $tsElm.addClass('active');
                this._pressedState($tsElm, true);
            } else {
                // Update transcript menu
                if ($tsElm.length) {
                    var $tsPar = $tsElm.parent();
                    $tsElm.addClass('active');
                    $tsPar.addClass('active');
                    $tsPar.find('[data-cfw-player-script="' + this.scriptCurrent + '"]').closest('li').addClass('active');
                }
            }

            // Insert transcript container
            var $newElm = $('<div class="player-scripttxt"></div>');
            this.$element.append($newElm);
            this.$scriptElm = this.$element.find('.player-scripttxt');

            // Loop through all captions and add to transcript container
            var cueIdx = 0;
            while (cueIdx < this.scriptCues.length) {
                addCaption(this.$scriptElm, this.scriptCues[cueIdx]);
                cueIdx += 1;
            }

            // Hook in cuechange handler
            if (this.media.textTracks[this.scriptCurrent].oncuechange !== undefined) {
                $(this.media.textTracks[this.scriptCurrent]).on('cuechange.cfw.player.transcript', function() {
                    $selfRef.scriptHighlight(this.activeCues);
                });
            } else {
                // Firefox does not currently support oncuechange event
                this.$media.on('timeupdate.cfw.player.transcript', function() {
                    $selfRef.scriptHighlight($selfRef.media.textTracks[$selfRef.scriptCurrent].activeCues);
                });
            }

            // Seekpoint event handlers
            $('.player-scripttxt-seekpoint', this.$scriptElm).on('click.cfw.player.scriptseek', function() {
                var spanStart = parseFloat($(this).attr('data-start'));
                $selfRef.scriptSeek(spanStart);
            });
            $('.player-scripttxt-seekpoint', this.$scriptElm).on('keydown.cfw.player.scriptseek', function(e) {
                // 13-enter
                if (!/(13)/.test(e.which)) { return; }
                e.stopPropagation();
                e.preventDefault();
                var spanStart = parseFloat($(this).attr('data-start'));
                $selfRef.scriptSeek(spanStart);
            });

            // Artificially trigger first cuechange - in case already in middle of a cue
            var cueEvent;
            if (this.media.textTracks[this.scriptCurrent].oncuechange !== undefined) {
                cueEvent = $.Event('cuechange');
                $(this.media.textTracks[this.scriptCurrent]).trigger(cueEvent);
            } else {
                // Firefox
                cueEvent = $.Event('timeupdate');
                this.$media.trigger(cueEvent);
            }

            this.$media.CFW_trigger('afterTranscriptShow.cfw.player');
        },

        scriptHighlight : function(activeCues) {
            // Remove any active highlights
            $('.player-scripttxt-active', this.$scriptElm).removeClass('player-scripttxt-active');

            if (activeCues.length <= 0) {
                return;
            }

            var cueStart = activeCues[0].startTime;
            var $matchCap = $('.player-scripttxt-caption[data-start="' + cueStart + '"]', this.$scriptElm);
            $matchCap.addClass('player-scripttxt-active');

            if (this.settings.transcriptScroll) {
                var tsScroll = this.$scriptElm.scrollTop();
                var tsMid = this.$scriptElm.innerHeight() / 2;
                var mcTop = $matchCap.position().top;
                var mcMid = $matchCap.height() / 2;

                var newTop = Math.floor(tsScroll + mcTop - tsMid + mcMid);
                if (newTop !== Math.floor(tsScroll)) {
                    this.$scriptElm.scrollTop(newTop);
                }
            }
        },

        scriptSeek : function(timestamp) {
            var $selfRef = this;

            timestamp += 0.01; // pad timestamp to put 'inside' the cue

            if (this.media.readyState < 2) {
                this.$media.one('canplay', function() {
                    $selfRef.seekTo(timestamp);
                });
                this.$media.trigger('load');
            } else {
                this.seekTo(timestamp);
            }
        },

        activityInit : function() {
            var $selfRef = this;

            setInterval(function() {
                if ($selfRef.activity && !$selfRef.over) {
                    $selfRef.activity = false;

                    clearTimeout($selfRef.activityTimer);

                    $selfRef.activityStatus(true);

                    $selfRef.activityTimer = setTimeout(function() {
                        if (!$selfRef.activity) {
                            $selfRef.activityStatus(false);
                        }
                    }, 1000);
                }
            }, 250);
        },

        activityStatus : function(bool) {
            /* jshint -W053 */
            bool = !!bool;
            if (bool !== this.userActive) {
                this.userActive = bool;
                if (bool) {
                    this.activity = true;
                    this.$element.removeClass('player-inactive');
                } else {
                    this.activity = false;
                    // Stop pointer change from triggering false mousemove event when changing pointers
                    this.$element.one('mousemove', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    this.$element.addClass('player-inactive');
                }
            }
        },

        _actionsKeydown : function(e) {
            // 32-space, 33-pgup, 34-pgdn, 35-end, 36-home, 37-left, 38-up, 39-right, 40-down, 70-f/F, 77-m/M
            if (!/(32|33|34|35|36|37|38|39|40|70|77)/.test(e.which)) { return; }

            // Ignore space use on button/role="button" items
            if (e.which == 32 || 'button' === e.target.tagName || 'button' === $(e.target).role('attr')) { return; }

            e.stopPropagation();
            e.preventDefault();

            switch (e.which) {
                case 32: { // space
                    if (this.media.paused) {
                        // Paused/stopped
                        this.media.play();
                    } else {
                        // Playing
                        this.media.pause();
                    }
                    this._focusHelper();
                    break;
                }
                case 38: { // up
                    this.volumeIncrement(5);
                    break;
                }
                case 40: { // down
                    this.volumeIncrement(-5);
                    break;
                }
                case 36: { // home
                    this.seekTo(0.0);
                    break;
                }
                case 35: { // end
                    this.seekTo(this.media.duration);
                    break;
                }
                case 37: { // left
                    this.seekIncrement(-5);
                    break;
                }
                case 39: { // right
                    this.seekIncrement(5);
                    break;
                }
                case 33: { // pgup
                    this.seekIncrement(this.status.duration / 5);
                    break;
                }
                case 34: { // pgdn
                    this.seekIncrement(this.status.duration / -5);
                    break;
                }
                case 70: { // f/F
                    this.fullscreen();
                    break;
                }
                case 77: { // m/M
                    this.mute();
                    break;
                }
            }
        },

        _pressedState : function($node, state) {
            var update = false;

            if ($node.length <= 0) { return; }

            // True button
            var nodeName = $node.get(0).nodeName.toLowerCase();
            if ('button' === nodeName) {
                update = true;
            }

            // role="button"
            var nodeRole = $node.attr('role');
            if ('button' === nodeRole) {
                update = true;
            }

            if (update) {
                $node.attr('aria-pressed', state);
            }
            return;
        },

        _focusControl : function(control) {
            var $control = $(control);
            if ($control.length <= 0) { return; }

            setTimeout(function() {
                if ($control.is('a, button')) {
                    $control.trigger('focus');
                } else {
                    $control.find('a:visible, button:visible').eq(0).trigger('focus');
                }
            }, 150);
        },

        _focusHelper : function() {
            var $selfRef = this;

            var $focusCurr = $(document.activeElement);
            setTimeout(function() {
                if (!$focusCurr.is(':visible')) {
                    $selfRef.$focus.trigger('focus');
                }
            }, 10);
        },

        dispose : function() {
            clearTimeout(this.activityTimer);
            if (this.$scriptElm) {
                $('.player-scripttxt-seekpoint', this.$scriptElm).off();
                this.$scriptElm.remove();
            }
            if (this.$sliderSeek) {
                this.$sliderSeek.CFW_Slider('dispose');
            }
            if (this.$volSeek) {
                this.$volSeek.CFW_Slider('dispose');
            }
            if ($.hasData(this.$player.find('[data-cfw-player="caption"]'))) {
                this.$player.find('[data-cfw-player="caption"]').CFW_Dropdown('dispose');
            }
            if ($.hasData(this.$player.find('[data-cfw-player="transcript"]'))) {
                this.$player.find('[data-cfw-player="transcript"]').CFW_Dropdown('dispose');
            }
            this.$player.off();
            this.$media.off();

            this.$element
                .off()
                .removeData('cfw.player');

            this.$element = null;
            this.type = null;
            this.$media = null;
            this.media = null;
            this.$player = null;
            this.$focus = null;
            this.$sliderSeek = null;
            this.$volSeek = null;
            this.activity = null;
            this.over = null;
            this.userActive = null;
            this.activityTimer = null;
            this.mouseActivity = null;
            this.scrubPlay = null;
            this.played = null;
            this.status = null;
            this.support = null;
            this.trackValid = null;
            this.trackCurrent = null;
            this.$scriptElm = null;
            this.scriptCurrent = null;
            this.scriptCues = null;
            this.settings = null;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.player');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.player', (data = new CFW_Widget_Player(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Player = Plugin;
    $.fn.CFW_Player.Constructor = CFW_Widget_Player;

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.1): common.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    $.fn.CFW_Init = function() {
        var $scope = $(this);
        if (!$scope) { $scope = $(document.body); }

        $('[data-cfw-dismisss="alert"]', $scope).each(function() {
            $(this).CFW_Alert();
        });
        $('[data-cfw^="button"]', $scope).each(function() {
            $(this).CFW_Button();
        });
        $('[data-cfw="collapse"]', $scope).each(function() {
            $(this).CFW_Collapse();
        });
        $('[data-cfw="dropdown"]', $scope).each(function() {
            $(this).CFW_Dropdown();
        });
        $('[data-cfw="tab"]', $scope).each(function() {
            $(this).CFW_Tab();
        });
        $('[data-cfw="tooltip"]', $scope).each(function() {
            $(this).CFW_Tooltip();
        });
        $('[data-cfw="popover"]', $scope).each(function() {
            $(this).CFW_Popover();
        });
        $('[data-cfw="modal"]', $scope).each(function() {
            $(this).CFW_Modal();
        });
        $('[data-cfw="affix"]', $scope).each(function() {
            $(this).CFW_Affix();
        });
        $('[data-cfw="tabResponsive"]', $scope).each(function() {
            $(this).CFW_TabResponsive();
        });
        $('[data-cfw="accordion"]', $scope).each(function() {
            $(this).CFW_Accordion();
        });
        $('[data-cfw="slideshow"]', $scope).each(function() {
            $(this).CFW_Slideshow();
        });
        $('[data-cfw="scrollspy"]', $scope).each(function() {
            $(this).CFW_Scrollspy();
        });
        $('[data-cfw="lazy"]', $scope).each(function() {
            $(this).CFW_Lazy();
        });
        $('[data-cfw="slider"]', $scope).each(function() {
            $(this).CFW_Slider();
        });
        $('[data-cfw="equalize"]', $scope).each(function() {
            $(this).CFW_Equalize();
        });
        $('[data-cfw="player"]', $scope).each(function() {
            $(this).CFW_Player();
        });
    };

    $(window).ready(function() {
        if (typeof CFW_API === 'undefined' || CFW_API !== false) {
            $(document.body).CFW_Init();
        }
    });
})(jQuery);
