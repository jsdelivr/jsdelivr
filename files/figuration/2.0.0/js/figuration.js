/*!
 * Figuration (v2.0.0)
 * http://figuration.org
 * Copyright 2013-2016 CAST, Inc.
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * -----
 * Portions Copyright 2011-2016  the Bootstrap Authors and Twitter, Inc.
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
 * Figuration (v2.0.0): transition.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    function CFW_transitionEnd() {
        var div = document.createElement('div');

        // Set name/event name pairs
        var transitionEndEventNames = {
            transition       : 'transitionend',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            WebkitTransition : 'webkitTransitionEnd'
        };

        // Test for browser specific event name to bind
        for (var eventName in transitionEndEventNames) {
            if (div.style[eventName] !== undefined) {
                return transitionEndEventNames[eventName];
            }
        }

        return false;
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.CFW_emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one('cfwTransitionEnd', function() { called = true; });
        var callback = function() { if (!called) $($el).trigger($.support.transitionEnd); };
        setTimeout(callback, duration);
        return this;
    };

    // Add detected events to jQuery.support for easy retrieval
    $(function() {
        $.support.transitionEnd = CFW_transitionEnd();

        if (!$.support.transitionEnd) { return; }

        $.event.special.cfwTransitionEnd = {
            bindType: $.support.transitionEnd,
            delegateType: $.support.transitionEnd,
            handle: function(e) {
                if ($(e.target).is(this)) {
                    return e.handleObj.handler.apply(this, arguments);
                }
            }
        };
    });

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v2.0.0): drag.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Drag = function(element, options) {
        this.element = element;
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
            this._trigger('init.cfw.drag');
        },

        destroy : function() {
            this.dragging = false;
            this.dragdata = null;
            this.$element
                .off('.cfw.drag')
                .removeData('cfw.drag');
            if (this.detachEvent) {
                this.detachEvent('ondragstart', this.__dontstart);
            }
        },

        _dragStartOn : function() {
            this.$element.on('mousedown.cfw.dragstart touchstart.cfw.dragstart MSPointerDown.cfw.dragstart', $.proxy(this._dragStart, this));
        },

        _dragStartOff : function(e) {
            e.preventDefault();
            $(document).off('.cfw.dragin');
            this.$element.off('.cfw.dragstart');
            // prevent image dragging in IE...
            if (this.element.attachEvent) {
                this.element.attachEvent('ondragstart', this.__dontstart);
            }
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
            this._trigger('dragStart.cfw.drag', props);
        },

        _drag : function(e) {
            if (!this.dragging) {
                return;
            }

            e.preventDefault();
            var coord = this._coordinates(e);
            var props = this._properties(coord, this.dragdata);
            this._trigger('drag.cfw.drag', props);
        },

        _dragEnd : function(e) {
            e.preventDefault();
            this.dragging = false;
            this.dragStart = null;
            $(document).off('.cfw.dragin');

            var coord = this._coordinates(e);
            var props = this._properties(coord, this.dragdata);
            this._trigger('dragEnd.cfw.drag', props);

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

        __dontstart : function() {
            return false;
        },

        _trigger : function(eventName, extraData) {
            var e = $.Event(eventName);
            if ($.isPlainObject(extraData)) {
                e = $.extend({}, e, extraData);
            }
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.drag');
            var options = typeof option === 'object' && option;

            if (!data && /destroy/.test(option)) {
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
 * Figuration (v2.0.0): collapse.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Collapse = function(element, options) {
        this.$triggerElm = $(element);
        this.$targetElm = null;
        this.inTransition = null;
        this.$triggerColl = null;

        this.settings = $.extend({}, CFW_Widget_Collapse.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Collapse.DEFAULTS = {
        animate     : true,     // If collapse targets should expand and contract
        speed       : 350,      // Speed of animation (milliseconds)
        follow      : false,    // If browser focus should move when a collapse toggle is activated
        horizontal  : false,    // If collapse should transition horizontal (vertical is default)
        hidden      : true      // Use aria-hidden on target containers by default
    };

    CFW_Widget_Collapse.prototype = {

        _init : function() {
            var $selfRef = this;
            // Get collapse group ID
            var collapseID = this.settings.toggle;

            // Find target by id/css selector
            var $targetElm = $(this.settings.toggle);
            if (!$targetElm.length) {
                // Get target (box) items
                $targetElm = $('[data-cfw-collapse-target="' + collapseID + '"]');
            }
            if (!$targetElm.length) {
                collapseID = this.$triggerElm.attr('href');
                $targetElm = $(collapseID);
            }
            if (!$targetElm.length) { return false; }
            if ((collapseID === undefined) || (collapseID.length <= 0)) { return false; }
            this.$targetElm = $targetElm;

            this.$triggerElm.attr({
                'data-cfw': 'collapse',
                'data-cfw-collapse-toggle': collapseID
            });

            // Build trigger collection
            this.$triggerColl = $('[data-cfw="collapse"][data-cfw-collapse-toggle="' + collapseID + '"]');

            // Check for presence of trigger id - set if not present
            // var triggerID = this._getID(this.$triggerElm, 'cfw-collapse');

            // Add collpase class(es)
            this.$targetElm.addClass('collapse');
            if (this.settings.horizontal) {
                this.$targetElm.addClass('width');
            }

            // A button can control multiple boxes so we need to id each on box individually
            var targetList = '';

            this.$targetElm.each(function() {
                var tempID = $selfRef._getID($(this), 'cfw-collapse');
                targetList += (tempID + ' ');
            });
            // Set ARIA on trigger
            this.$triggerColl.attr('aria-controls', $.trim(targetList));

            // Determine default state
            var dimension = this.dimension();
            if (this.$triggerColl.hasClass('open')) {
                this.$triggerColl.attr('aria-expanded', 'true');
                this.$targetElm.addClass('collapse in')[dimension]('');
            } else {
                this.$triggerColl.attr('aria-expanded', 'false');
                if (this.settings.hidden) {
                    this.$targetElm.attr('aria-hidden', 'true');
                }
            }

            // Bind click handler
            this.$triggerElm.on('click.cfw.collapse.toggle', $.proxy(this.toggle, this));

            this._trigger('init.cfw.collapse');
        },

        toggle : function(e) {
            if (e) { e.preventDefault(); }
            if (this.$triggerElm.hasClass('open') || this.$targetElm.hasClass('in')) {
                this.hide();
            } else {
                this.show();
            }
        },

        dimension : function() {
            var hasWidth = this.$targetElm.hasClass('width');
            if (hasWidth || this.settings.horizontal) {
                return 'width';
            }
            return 'height';
        },

        show : function(follow) {
            if (follow === null) { follow = this.settings.follow; }
            this.settings.showFollow = follow;

            // Bail if transition in progress
            if (this.inTransition || this.$targetElm.hasClass('in')) { return; }

            // Start open transition
            if (!this._trigger('beforeShow.cfw.collapse')) {
                return;
            }

            var dimension = this.dimension();

            this.inTransition = 1;
            this.$triggerColl.addClass('open');
            this.$targetElm.removeClass('collapse').addClass('collapsing')[dimension](0);

            // Fallback for non-transition browsers
            if (!this.settings.animate || !$.support.transitionEnd) { return this._showComplete(); }

            // Determine/set height for each target (triggers the transition), then bind transition callback to first target
            this.$targetElm
                .eq(0).one('cfwTransitionEnd', $.proxy(this._showComplete, this))
                .CFW_emulateTransitionEnd(this.settings.speed);
            var scrollSize = $.camelCase(['scroll', dimension].join('-'));
            this.$targetElm.each(function() {
                $(this)[dimension]($(this)[0][scrollSize]);
            });
        },

        hide : function(follow) {
            if (follow === null) { follow = this.settings.follow; }
            this.settings.hideFollow = follow;

            // Bail if transition in progress
            if (this.inTransition || !this.$targetElm.hasClass('in')) { return; }

            // Start close transition
            if (!this._trigger('beforeHide.cfw.collapse')) {
                return;
            }

            var dimension = this.dimension();

            this.inTransition = 1;
            this.$triggerColl.removeClass('open');

            // Determine/set height for each target (triggers the transition), then bind transition callback to first target
            this.$targetElm.each(function() {
                // Set height seperate from class changes for Chrome/Webkit or no animation occurs
                var $this = $(this);
                $this[dimension]($this[dimension]())[0].offsetHeight;
            });
            this.$targetElm.addClass('collapsing').removeClass('collapse').removeClass('in');

            // Fallback for non-transition browsers
            if (!this.settings.animate || !$.support.transitionEnd) return this._hideComplete();

            // Set '0' height for each target (triggers the transition), then bind transition callback to first target
            this.$targetElm[dimension](0)
                .eq(0).one('cfwTransitionEnd', $.proxy(this._hideComplete, this))
                .CFW_emulateTransitionEnd(this.settings.speed);

        },

        hiddenDisable : function() {
            this.$targetElm.removeAttr('aria-hidden');
            this.settings.hidden = false;
        },

        _showComplete : function() {
            var dimension = this.dimension();
            this.$triggerColl.attr('aria-expanded', 'true');
            this.$targetElm.removeClass('collapsing').addClass('collapse in').removeAttr('aria-hidden')[dimension]('');
            this.inTransition = 0;
            if (this.settings.showFollow) {
                this.$targetElm.attr('tabindex', '-1').get(0).trigger('focus');
            }
            this._trigger('afterShow.cfw.collapse');
        },

        _hideComplete : function() {
            this.$triggerColl.attr('aria-expanded', 'false');
            this.$targetElm.removeClass('collapsing in').addClass('collapse');
            if (this.settings.hidden){
                this.$targetElm.attr('aria-hidden', 'true');
            }
            this.inTransition = 0;
            if (this.settings.hideFollow) {
                this.$triggerColl.get(0).trigger('focus');
            }
            this._trigger('afterHide.cfw.collapse');
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$triggerElm.data();

            if (typeof data.cfwCollapseToggle     !== 'undefined') { parsedData.toggle     = data.cfwCollapseToggle;     }
            if (typeof data.cfwCollapseAnimate    !== 'undefined') { parsedData.animate    = data.cfwCollapseAnimate;    }
            if (typeof data.cfwCollapseSpeed      !== 'undefined') { parsedData.speed      = data.cfwCollapseSpeed;      }
            if (typeof data.cfwCollapseFollow     !== 'undefined') { parsedData.follow     = data.cfwCollapseFollow;     }
            if (typeof data.cfwCollapseHorizontal !== 'undefined') { parsedData.horizontal = data.cfwCollapseHorizontal; }
            if (typeof data.cfwCollapseHidden     !== 'undefined') { parsedData.hidden     = data.cfwCollapseHidden;     }

            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$triggerElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): dropdown.js
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
        this.$triggerElm = $(element);
        this.$menuElm = null;

        this.timerHide = null;

        this.settings = $.extend({}, CFW_Widget_Dropdown.DEFAULTS, this._parseDataAttr(), options);
        this.settings.isTouch = $isTouch;   // Touch enabled-browser flag - override not allowed

        this.c = CFW_Widget_Dropdown.CLASSES;

        this._init();
    };

    CFW_Widget_Dropdown.CLASSES = {
        // Class names
        isMenu          : 'dropdown-menu',
        hasSubMenu      : 'dropdown-submenu',
        showSubMenu     : 'show-menu',
        backdrop        : 'dropdown-backdrop',
        backLink        : 'dropdown-back'
    };

    CFW_Widget_Dropdown.DEFAULTS = {
        // Default Settings
        delay           : 350,          // Delay for hiding menu (milliseconds)
        hover           : false,        // Enable hover style navigation
        backlink        : false,        // Insert back links into submenus
        backtop         : false,        // Should back links start at top level
        backtext        : 'Back'        // Text for back links
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
            var $menuElm = $(this.settings.toggle);
            if (menuID !== undefined && !$menuElm.length) {
                $menuElm = $('[data-cfw-dropdown-target="' + menuID + '"]');
            }
            // Target by href selector
            if (!$menuElm.length) {
                var selector = this.$triggerElm.attr('href');
                selector = selector && /#[]A-Za-z]/.test(selector);
                if (selector) {
                    $menuElm = $(selector);
                }
                // $menuElm = $(this.$triggerElm.attr('href'));
            }
            // Target by sibling class
            if (!$menuElm.length) {
                $menuElm = $(this.$triggerElm.siblings('.dropdown-menu')[0]);
            }
            if (!$menuElm.length) { return false; }
            this.$menuElm = $menuElm;

            this.$triggerElm.attr('data-cfw', 'dropdown');

            // Check for presence of trigger id - set if not present
            var triggerID = this._getID(this.$triggerElm, 'cfw-dropdown');

            // Top Level: add ARIA/roles and define all sub-menu links as menuitem (unless 'disabled')
            // Set tabIndex=-1 so that sub-menu links can't receive keyboard focus from tabbing

            // Check for id on top level menu - set if not present
            menuID = this._getID(this.$menuElm, 'cfw-dropdown');
            this.$menuElm.attr({
                // 'role': 'menu',
                'aria-hidden': 'true',
                'aria-labelledby': triggerID
            })
            .addClass(this.c.isMenu);
            $('a', this.$menuElm).attr('tabIndex', -1).not('.disabled, :disabled');
            //  .attr('role', 'menuitem');
            // Set ARIA on trigger
            this.$triggerElm.attr({
                'aria-haspopup': 'true',
                'aria-expanded': 'false'
            });

            if ($selfRef.settings.backlink && $selfRef.settings.backtop) {
                this.$menuElm.prepend('<li class="' + CFW_Widget_Dropdown.CLASSES.backLink + '"><a href="#">' + $selfRef.settings.backtext + '</a></li>');
            }

            // Check for sub menu items and add indicator and id as needed
            this.$menuElm.find('ul').each(function() {
                var $subMenu = $(this);
                var $subLink = $subMenu.closest('li').find('a').eq(0);
                var subLinkID = $selfRef._getID($subLink, 'cfw-dropdown');
                // var subMenuID = $selfRef._getID($subMenu, 'cfw-dropdown');

                if ($selfRef.settings.backlink) {
                    $subMenu.prepend('<li class="' + CFW_Widget_Dropdown.CLASSES.backLink + '"><a href="#">' + $selfRef.settings.backtext + '</a></li>');
                }

                $subMenu.attr({
                    // 'role': 'menu',
                    'aria-hidden': 'true',
                    'aria-labelledby': subLinkID
                })
                .addClass(CFW_Widget_Dropdown.CLASSES.isMenu)
                .closest('li').addClass(CFW_Widget_Dropdown.CLASSES.hasSubMenu);

                $subLink.attr({
                    'aria-haspopup': 'true',
                    'aria-expanded': 'false'
                });
            });

            // Set role on all li items - including any injected ones
            // $('li', this.$menuElm).attr('role', 'presentation');
            $('li.divider, .dropdown-divider', this.$menuElm).attr('role', 'separator');

            // Touch OFF - Hover mode
            if (!this.settings.isTouch && this.settings.hover) {
                this.navEnableHover();
            }

            // Default Mode - Click mode
            // Touch ON - handle click/tap style navigation
            this.navEnableClick();

            // Always on - Keyboard navigation
            this.navEnableKeyboard();

            // Loss of focus
            /*
             ** Causing issues with nested dropdowns on touchscreen **
             *
            $(this.$triggerElm).add(this.$menuElm).on('focusout.cfw.dropdown', function(e) {
                // Need slight delay or <body> will always be reported
                setTimeout(function() {
                    if (!$.contains($selfRef.$menuElm[0], document.activeElement)
                        && $selfRef.$triggerElm[0] != document.activeElement) {
                        $selfRef.hideRev();
                    }
                }, 150);
            });
            */

            this._trigger(this.$triggerElm, 'init.cfw.dropdown');
        },

        navEnableClick : function() {
            var $selfRef = this;
            // Trigger
            this.$triggerElm.on('click.cfw.dropdown.modeClick', function(e) {
                $selfRef.toggleMenu(e, $selfRef.$triggerElm, $selfRef.$menuElm);
            });
            // Sub menu
            var $subTriggerElm = this.$menuElm.find('ul').closest('li').find('a:eq(0)');
            if ($subTriggerElm.length) {
                $subTriggerElm.on('click.cfw.dropdown.modeClick', function(e) {
                    var $subMenuElm = $(this).parent().find('ul').eq(0);
                    $selfRef.toggleMenu(e, $(this), $subMenuElm);
                });
            }
            // Back link
            var $backLinkElm = this.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.backLink);
            if ($backLinkElm.length) {
                $backLinkElm.on('click.cfw.dropdown.modeClick', function(e) {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }

                    if ($selfRef.settings.backtop && ($(this).closest('ul')[0] == $selfRef.$menuElm[0])) {
                        $selfRef.closeUp($(this).closest('li'));
                    } else {
                        $selfRef.closeUp($(this).closest('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu));
                    }
                });
            }
        },

        navEnableHover : function() {
            var $selfRef = this;
            if (!this.settings.isTouch) {
                $.each([this.$triggerElm, this.$menuElm, this.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu)], function() {
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
            this.$triggerElm.off('.cfw.dropdown.modeHover');
            this.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu).off('.cfw.dropdown.modeHover');
        },

        navEnableKeyboard : function() {
            var $selfRef = this;

            // Auto-closing of inactive sub menus
            this.$menuElm.find('a').on('focus', function() {
                var $node = $(this);
                $selfRef.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu + '.open').each(function() {
                    // Ignore parents of item being focused - needed for nesting
                    if (!$(this).find($node).length) {
                        var $snode = $(this).children('a');
                        var $ssubNode = $node.parent().find('ul').eq(0);
                        $selfRef.hideMenu(null, $snode, $ssubNode);
                    }
                });
            });

            // Key handling
            $.each([this.$triggerElm, this.$menuElm, this.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu)], function() {
                $(this).on('keydown.cfw.dropdown', function(e) {
                    $selfRef._actionsKeydown(e, this);
                });
            });
        },

        toggleMenu : function(e, $nodeTrigger, $nodeMenu) {
            if ($nodeTrigger.is('.disabled, :disabled')) { return; }

            // var $node = $(node);
            // var $subNode = $node.parent().find('ul').eq(0);

            var $parent  = getParent($nodeTrigger);
            var showing = $parent.hasClass('open');

            // Check to see if link should be followed (subMenu open and link is not '#')
            var nodeHref = $nodeTrigger.attr('href');
            if (nodeHref && !(/^#$/.test(nodeHref)) && showing) {
                clearMenus();
                return;
            }

            if (e) {
                e.stopPropagation();
            }
            if ($nodeTrigger.parent().is('.disabled, :disabled')) { return; }

            if (!showing) {
                this.showMenu(e, $nodeTrigger, $nodeMenu);
            } else {
                this.hideMenu(e, $nodeTrigger, $nodeMenu);
            }

            $nodeTrigger.trigger('focus');
        },

        showMenu : function(e, $nodeTrigger, $nodeMenu) {
            var $selfRef = this;

            if (e) {
                e.preventDefault();
            }
            var $parent  = getParent($nodeTrigger);
            var showing = $parent.hasClass('open');
            if (showing) { return; }

            if (!this._trigger($nodeTrigger, 'beforeShow.cfw.dropdown')) {
                return;
            }

            if ($nodeTrigger.is(this.$triggerElm)) {
                if (this.settings.isTouch) {
                    $('.' + this.c.backdrop).remove();
                    $(document.createElement('div'))
                        .addClass(this.c.backdrop)
                        .insertAfter(this.$menuElm)
                        .on('click', clearMenus);
                }
                clearMenus();
                if (!$parent.hasClass('hover')) {
                    $nodeTrigger.trigger('focus');
                }
            }

            // Find other open sub menus and close them
            this.$menuElm.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu + '.open').each(function() {
                // Ignore parents of item to be shown - needed for nesting
                if (!$(this).find($nodeTrigger).length) {
                    var $snode = $(this).children('a');
                    var $ssubNode = $nodeTrigger.parent().find('ul').eq(0);
                    $selfRef.hideMenu(null, $snode, $ssubNode);
                }
            });

            $parent.addClass('open');
            $nodeTrigger.attr('aria-expanded', 'true');
            $nodeMenu.removeAttr('aria-hidden')
                .children('li').not('.disabled, :disabled');
            //  .children('a').attr('tabIndex', 0);
            this.$menuElm.find('li').redraw();

            this._trigger($nodeTrigger, 'afterShow.cfw.dropdown');
        },

        hideMenu : function(e, $nodeTrigger, $nodeMenu) {
            if (e) {
                e.preventDefault();
            }

            var $parent  = getParent($nodeTrigger);
            var showing = $parent.hasClass('open');
            if (!showing) { return; }

            if (!this._trigger($nodeTrigger, 'beforeHide.cfw.dropdown')) {
                return;
            }

            if ($nodeTrigger.is(this.$triggerElm)) {
                $('.' + this.c.backdrop).remove();
            }

            // Find open sub menus
            var openSubMenus = $nodeMenu.find('.' + CFW_Widget_Dropdown.CLASSES.hasSubMenu + '.open');
            if (openSubMenus.length) {
                var openSubMenusRev = openSubMenus.toArray().reverse();
                for (var i = 0; i < openSubMenusRev.length; i++) {
                    var $node = $(openSubMenusRev[i]).children('a');
                    var $subNode = $node.parent().find('ul').eq(0);
                    this.hideMenu(null, $node, $subNode);
                }
            }

            $parent.removeClass('open');
            $nodeTrigger.attr('aria-expanded', 'false');
            $nodeMenu.attr('aria-hidden', 'true')
                .find('a').attr('tabIndex', -1);
            if (!$parent.hasClass('hover')) {
                $nodeTrigger.trigger('focus');
            }
            $parent.removeClass('hover');
            this._trigger($nodeTrigger, 'afterHide.cfw.dropdown');
        },

        toggle : function() {
            this.toggleMenu(null, this.$triggerElm, this.$menuElm);
        },

        show : function() {
            this.showMenu(null, this.$triggerElm, this.$menuElm);
        },

        hide : function() {
            this.hideMenu(null, this.$triggerElm, this.$menuElm);
        },

        hideRev : function() {
            this.hideMenu(null, this.$triggerElm, this.$menuElm);
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
            if (!$parent.hasClass('hover')) {
                $node.trigger('focus');
            }
            $parent.removeClass('hover');
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
                if ($node.is(this.$triggerElm) || $node.is(this.$menuElm)) {
                    this.hideMenu(null, this.$triggerElm, this.$menuElm);
                    return;
                }
                if ($node.hasClass(CFW_Widget_Dropdown.CLASSES.hasSubMenu)) {
                    this.closeUp($node);
                    return;
                }
            }

            // Arrow key navigation
            var $eTarget = $(e.target);
            var $parent = null;

            // Find parent menu
            if ($node.is(this.$triggerElm) || $node.is(this.$menuElm)) {
                $parent = this.$menuElm;
            } else {
                $parent = $eTarget.closest('.dropdown-menu');
            }

            $parent.removeClass('hover');

            // Up/Down
            if (e.which == 38 || e.which == 40) {
                if ($parent.is(':hidden')) {
                    this.showMenu(null, $node, $parent);
                    return;
                }

                $items = $parent.children('li:not(.disabled)').children('a:visible');
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
                if (!$.contains(this.$menuElm[0], $eTarget[0])) { return; }
                // Only if has submenu class
                if (!$eTarget.closest('li.dropdown-submenu')) { return; }

                // Open/close sub-menu as needed
                var $subMenuElm = $eTarget.parent().find('ul').eq(0);
                var $parMenuElm = $eTarget.closest('li.dropdown-submenu').parent('ul.dropdown-menu');
                var subHidden = $subMenuElm.is(':hidden');
                var parHidden = $parMenuElm.is(':hidden');

                if (e.which == 39 && subHidden) {
                    this.showMenu(null, $eTarget, $subMenuElm);
                    $items = $subMenuElm.children('li:not(.disabled)').children('a:visible');
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
            if ($node.is(this.$triggerElm)) {
                getParent($node).addClass('hover');
                this.showMenu(null, this.$triggerElm, this.$menuElm);
                return;
            }
            if ($node.hasClass(CFW_Widget_Dropdown.CLASSES.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.parent().find('ul').eq(0);
                getParent($node).addClass('hover');
                this.showMenu(null, $node, $subNode);
                return;
            }
        },

        _actionsHoverLeave : function(e, node) {
            var $selfRef = this;
            var $node = $(node);

            clearTimeout(this.timerHide);
            if ($node.is(this.$triggerElm) || $node.is(this.$menuElm)) {
                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $selfRef.$triggerElm, $selfRef.$menuElm);
                }, this.settings.delay);
                return;
            }
            if ($node.hasClass(CFW_Widget_Dropdown.CLASSES.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.find('ul').eq(0);

                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $node, $subNode);
                }, $selfRef.settings.delay);
                return;
            }
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$triggerElm.data();

            if (typeof data.cfwDropdownToggle   !== 'undefined') { parsedData.toggle   = data.cfwDropdownToggle;    }
            if (typeof data.cfwDropdownDelay    !== 'undefined') { parsedData.delay    = data.cfwDropdownDelay;     }
            if (typeof data.cfwDropdownHover    !== 'undefined') { parsedData.hover    = data.cfwDropdownHover;     }
            if (typeof data.cfwDropdownBacklink !== 'undefined') { parsedData.backlink = data.cfwDropdownBacklink;  }
            if (typeof data.cfwDropdownBacktop  !== 'undefined') { parsedData.backtop  = data.cfwDropdownBacktop;   }
            if (typeof data.cfwDropdownBacktext !== 'undefined') { parsedData.backtext = data.cfwDropdownBacktext;  }
            return parsedData;
        },

        _trigger : function($callingElm, eventName) {
            var e = $.Event(eventName);
            $callingElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): tab.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Tab = function(element, options) {
        this.$triggerElm = $(element);
        this.$navElm = null;
        this.$targetElm = null;

        this.settings = $.extend({}, CFW_Widget_Tab.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Tab.DEFAULTS = {
        animate     : true,     // If tabs should be allowed fade in and out
        speed       : 150,      // Speed of animation in milliseconds
        hidden      : true      // Use aria-hidden on target containers by default
    };

    CFW_Widget_Tab.prototype = {

        _init : function() {
            var $selfRef = this;

            // Find nav and target elements
            this.$navElm = this.$triggerElm.closest('ul:not(.dropdown-menu)');
            this.$navElm.attr('role', 'tablist');

            var $selector = $(this.settings.target);
            if (!$selector.length) {
                $selector = $(this.$triggerElm.attr('href'));
            }
            this.$targetElm = $($selector);

            if (!this.$targetElm.length) {
                return false;
            }

            this.$triggerElm.attr('data-cfw', 'tab');

            // Check for presence of trigger id - set if not present
            var triggerID = this._getID(this.$triggerElm, 'cfw-tab');

            // Target should have id already - set ARIA attributes
            this.$targetElm.attr({
                'tabindex': -1,
                'role': 'tabpanel',
                'aria-labelledby': triggerID
            });
            if (this.settings.hidden) {
                this.$targetElm.attr('aria-hidden', true);
            }
            if (this.settings.animate) {
                this.fadeEnable();
            } else {
                this.fadeDisable();
            }

            // Set ARIA attributes on trigger
            this.$triggerElm.attr({
                'tabindex': -1,
                'role': 'tab',
                'aria-selected': 'false',
                'aria-expanded': 'false',
                'aria-controls': this.$targetElm.attr('id')
            });

            // Bind click handler
            this.$triggerElm.on('click', function(e) {
                $selfRef.show(e);
            });

            // Bind key handler
            this.$triggerElm.on('keydown', function(e) {
                $selfRef._actionsKeydown(e, this);
            });

            // Display panel if trigger is marked active
            if (this.$triggerElm.closest('li').hasClass('active')) {
                this.$triggerElm.attr({
                    'tabindex': 0,
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                this.$targetElm.attr('tabindex', 0)
                    .addClass('active');

                if (this.settings.hidden) {
                    this.$targetElm.attr('aria-hidden', false);
                }
                if (this.settings.animate) {
                    this.$targetElm.addClass('in');
                }
            }

            // Check to see if there is an active element defined - if not set current one as active
            if (this.$navElm.find('li.active').length <= 0) {
                this.$triggerElm.closest('li').addClass('active');

                if (this.$triggerElm.parent('.dropdown-menu').length) {
                    this.$triggerElm.closest('li.dropdown').addClass('active');
                }

                this.$triggerElm.attr({
                    'tabindex': 0,
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                this.$targetElm.attr('tabindex', 0)
                    .addClass('active');

                if (this.settings.hidden) {
                    this.$targetElm.attr('aria-hidden', 'false');
                }
                if (this.settings.animate) {
                    this.$targetElm.addClass('in');
                }
            }

            this._trigger(this.$triggerElm, 'init.cfw.tab');
        },

        show : function(e) {
            if (e) {
                e.preventDefault();
            }

            if (this.$triggerElm.parent('li').hasClass('active')
                || this.$triggerElm.hasClass('disabled')
                || this.$triggerElm[0].hasAttribute('disabled')) {
                return;
            }

            var $previous = this.$navElm.find('.active:last a[data-cfw="tab"]');
            if ($previous.length) {

                if (!this._trigger($previous, 'beforeHide.cfw.tab', { relatedTarget: this.$triggerElm[0] })) {
                    return;
                }
            }

            if (!this._trigger(this.$triggerElm, 'beforeShow.cfw.tab', { relatedTarget: $previous[0] })) {
                return;
            }

            if ($previous.length) {
                $previous.attr({
                    'tabindex': -1,
                    'aria-selected': 'false',
                    'aria-expanded': 'false'
                });
                this._trigger($previous, 'afterHide.cfw.tab', { relatedTarget: this.$triggerElm[0] });
                // Following line for backwards compatibility (not sure if used anywhere)
                this._trigger($previous, 'hide.cfw.tab');
            }

            this.$triggerElm.attr({
                'tabindex': 0,
                'aria-selected': 'true',
                'aria-expanded': 'true'
            });

            this._activateTab(this.$triggerElm.closest('li'), this.$navElm, false, $previous);
            this._activateTab(this.$targetElm, this.$targetElm.parent(), true, $previous);
        },

        fadeEnable : function() {
            if (!$.support.transitionEnd) { return; }
            this.$targetElm.addClass('fade');
            if (this.$targetElm.hasClass('active')) {
                this.$targetElm.addClass('in');
            }
            this.settings.animate = true;
        },

        fadeDisable : function() {
            this.$targetElm.removeClass('fade in');
            if (this.$targetElm.hasClass('active')) {
                this.$targetElm.addClass('in');
            }
            this.settings.animate = false;
        },

        hiddenDisable : function() {
            this.$targetElm.removeAttr('aria-hidden');
            this.settings.hidden = false;
        },

        _actionsKeydown : function(e, node) {
            // 37-left, 38-up, 39-right, 40-down
            var k = e.which;
            if (!/(37|38|39|40)/.test(k)) { return; }

            e.stopPropagation();
            e.preventDefault();

            var $node = $(node);
            var $ul = $node.closest('ul[role="tablist"]');
            var $items = $ul.find('[role="tab"]:visible');
            var index = $items.index($items.filter('[aria-selected="true"]'));

            if ((k == 38 || k == 37) && index > 0)                 { index--; }     // up & left
            if ((k == 39 || k == 40) && index < $items.length - 1) { index++; }     // down & right
            if (!~index)                                           { index = 0; }   // force first item

            var nextTab = $items.eq(index);
            nextTab.CFW_Tab('show').trigger('focus');
        },

        _activateTab : function(node, container, isPanel, $previous) {
            var $selfRef = this;
            var $prevActive = container.find('> .active');
            var doTransition = isPanel && $.support.transitionEnd && this.settings.animate;

            function displayTab() {
                $prevActive.removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active');

                node.addClass('active');

                if (isPanel) {
                    $prevActive.attr({
                        'tabindex': -1,
                        'aria-hidden': 'true'
                    });
                    node.attr({
                        'tabindex': 0,
                        'aria-hidden': 'false'
                    });
                }

                if (doTransition) {
                    node[0].offsetWidth; // Reflow for transition
                    node.addClass('in');
                } else {
                    if (isPanel) {
                        $selfRef.settings.animate = false;
                    }
                    node.removeClass('fade');
                }

                if (node.parent('.dropdown-menu').length) {
                    node.closest('li.dropdown').addClass('active');
                }

                if (isPanel) {
                    $selfRef._trigger($selfRef.$triggerElm, 'afterShow.cfw.tab', { relatedTarget: $previous[0] });
                }
            }

            if (doTransition) {
                node.one('cfwTransitionEnd', displayTab)
                .CFW_emulateTransitionEnd(this.settings.speed);
            } else {
                displayTab();
            }

            $prevActive.removeClass('in');
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$triggerElm.data();

            if (typeof data.cfwTabTarget  !== 'undefined') { parsedData.target  = data.cfwTabTarget;  }
            if (typeof data.cfwTabAnimate !== 'undefined') { parsedData.animate = data.cfwTabAnimate; }
            if (typeof data.cfwTabSpeed   !== 'undefined') { parsedData.speed   = data.cfwTabSpeed;   }
            if (typeof data.cfwTabHidden  !== 'undefined') { parsedData.hidden  = data.cfwTabHidden;  }
            return parsedData;
        },

        _trigger : function($callingElm, eventName, extraData) {
            var e = $.Event(eventName);
            if ($.isPlainObject(extraData)) {
                e = $.extend({}, e, extraData);
            }
            $callingElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): affix.js
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

        this.settings = $.extend({}, CFW_Widget_Affix.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Affix.RESET = 'affix affix-top affix-bottom';

    CFW_Widget_Affix.DEFAULTS = {
        offset: 0,
        target: window
    };

    CFW_Widget_Affix.prototype = {
        _init : function() {
            this.$element.attr('data-cfw', 'affix');

            // Bind events
            this.$target = $(this.settings.target)
                .on('scroll.cfw.affix)',  $.proxy(this.checkPosition, this))
                .on('click.cfw.affix',  $.proxy(this.checkPositionDelayed, this));

            this._trigger('init.cfw.affix');

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
            var offset       = this.settings.offset;
            var offsetTop    = offset.top;
            var offsetBottom = offset.bottom;
            var scrollHeight =  Math.max($(document).height(), $(document.body).height());

            if (typeof offset != 'object')         { offsetBottom = offsetTop = offset; }
            if (typeof offsetTop == 'function')    { offsetTop    = offset.top(this.$element); }
            if (typeof offsetBottom == 'function') { offsetBottom = offset.bottom(this.$element); }

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

                if (!this._trigger(eventName)) {
                    return;
                }

                this.affixed = affix;
                this.unpin = (affix == 'bottom') ? this.getPinnedOffset() : null;

                this.$element
                    .removeClass(CFW_Widget_Affix.RESET)
                    .addClass(affixType);
                this._trigger(eventName.replace('affix', 'affixed'));
            }

            if (affix == 'bottom') {
                this.$element.offset({
                    top: scrollHeight - height - offsetBottom
                });
            }
        },

        _parseDataAttr : function() {
            var parsedData = {};
            parsedData.offset = {};
            var data = this.$element.data();

            // data.cfwAffixOffset = data.cfwAffixOffset || {};
            if (typeof data.cfwAffixOffsetBottom !== 'undefined') { parsedData.offset.bottom = data.cfwAffixOffsetBottom; }
            if (typeof data.cfwAffixOffsetTop !== 'undefined')    { parsedData.offset.top    = data.cfwAffixOffsetTop;    }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): tooltip.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Tooltip = function(element, options) {
        this.$triggerElm = null;
        this.dataToggle = null;
        this.$targetElm = null;
        this.type = null;
        this.eventTypes = null;
        this.delayTimer = null;
        this.inTransition = null;
        this.closeAdded = false;
        this.unlinking = false;
        this.activate = false;
        this.hoverState = null;
        this.inState = null;
        this.dynamicTip = false;
        this.$focusLast = null;
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
        follow          : false,            // If the browser focus should follow active tooltip
        animate         : true,             // Should the tooltip fade in and out
        speed           : 150,              // Speed of animation (milliseconds)
        delay : {
            show        : 0,                // Delay for showing tooltip (milliseconda)
            hide        : 250               // Delay for hiding tooltip (milliseconds)
        },
        container       : false,            // Where to place tooltip if moving is needed
        viewport: {                         // Viewport to constrain tooltip within
            selector: 'body',
            padding: 0
        },
        html            : false,            // Use HTML or text insertion mode
        closetext       : '<span aria-hidden="true">&times;</span>', // Text for close links
        closesrtext     : 'Close',          // Screen reader text for close links
        title           : '',               // Title text/html to be inserted
        unlink          : false,            // If on hide to remove events and attributes from tooltip and trigger
        destroy         : false,            // If on hide to unlink, then remove tooltip from DOM
        template        : '<div class="tooltip"><div class="tooltip-inner"></div><div class="tooltip-arrow"></div></div>'
    };

    CFW_Widget_Tooltip.prototype = {
        _init : function(type, element, options) {
            this.type = type;
            this.$triggerElm = $(element);
            this.settings = this.getSettings(options);

            this.$viewport = this.settings.viewport && $($.isFunction(this.settings.viewport) ? this.settings.viewport.call(this, this.$triggerElm) : (this.settings.viewport.selector || this.settings.viewport));

            this.inState = { click: false, hover: false, focus: false };

            this.$triggerElm.attr('data-cfw', this.type);

            // Find target by id/css selector - only pick first one found
            var dataToggle;
            var $findTarget = $(this.settings.toggle).eq(0);
            if ($findTarget.length) {
                dataToggle = this.settings.toggle;
            } else {
                // If not found by selector - find by 'toggle' data
                dataToggle = this.$triggerElm.attr('data-cfw-' + this.type + '-toggle');
                $findTarget = $('[data-cfw-' + this.type + '-target="' + dataToggle + '"]');
            }
            if ($findTarget.length) {
                this.dataToggle = dataToggle;
                this.$targetElm = $findTarget;
            } else {
                this.fixTitle();
            }

            if (this.settings.activate) {
                this.settings.trigger = 'click';
            }

            // Bind events
            this.eventTypes = this.settings.trigger.split(' ');
            this.bindTip(true);

            if (this.$targetElm) {
                this.$targetElm.data('cfw.' + this.type, this);
            }

            if (this.settings.activate) {
                this.activate = true;
                this.show();
            }

            this._trigger('init.cfw.' + this.type);
        },

        getDefaults: function() {
            return CFW_Widget_Tooltip.DEFAULTS;
        },

        getSettings : function(options) {
            var settings = $.extend({}, this.getDefaults(), this._parseDataAttr(), this._parseDataAttrExt(), options);
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
            var $e = this.$triggerElm;
            if ($e.attr('title') || typeof($e.attr('data-cfw-' + this.type +  '-original-title')) != 'string') {
                $e.attr('data-cfw-' + this.type +  '-original-title', $e.attr('title') || '').attr('title', '');
            }
        },

        getTitle : function() {
            var title;
            var $e = this.$triggerElm;
            var s = this.settings;

            title = (typeof s.title == 'function' ? s.title.call($e[0]) :  s.title) || $e.attr('data-cfw-' + this.type +  '-original-title');

            return title;
        },

        setContent : function() {
            var $tip = this.$targetElm;
            var $inner = $tip.find('.tooltip-inner');

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
            this.triggerID = this._getID(this.$triggerElm, 'cfw-' + this.type);
            this.targetID = this._getID(this.$targetElm, 'cfw-' + this.type);

            // Set ARIA attributes on target
            this.$targetElm.attr({
                'role': (this.type == 'tooltip' ? 'tooltip' : (this.settings.follow ? 'dialog' : 'tooltip')),
                'aria-hidden': 'true',
                'tabindex': -1
            });
        },

        bindTip : function(modeInit) {
            var $selfRef = this;

            for (var i = this.eventTypes.length; i--;) {
                var eventType = this.eventTypes[i];
                if (eventType == 'click') {
                    // Click events
                    this.$triggerElm
                        .off('click.cfw.' + this.type)
                        .on('click.cfw.' + this.type, $.proxy(this.toggle, this));

                    // Inject close button
                    if (this.$targetElm != null && !this.closeAdded) {
                        // Check for pre-existing close buttons
                        if (!this.$targetElm.find('[data-cfw-dismiss="' + this.type +  '"]').length) {
                            var $close = $('<button type="button" class="close" data-cfw-dismiss="' + this.type +  '" aria-label="' + this.settings.closesrtext + '">' + this.settings.closetext + '</button>');
                            $close.prependTo(this.$targetElm);
                            this.closeAdded = true;
                        }
                    }
                } else if (eventType != 'manual') {
                    // Hover/focus events
                    var eventIn  = (eventType == 'hover') ? 'mouseenter' : 'focusin';
                    var eventOut = (eventType == 'hover') ? 'mouseleave' : 'focusout';

                    if (modeInit) {
                        this.$triggerElm.on(eventIn  + '.cfw.' + this.type, $.proxy(this.enter, this));
                        this.$triggerElm.on(eventOut + '.cfw.' + this.type, $.proxy(this.leave, this));
                    } else {
                        this.$targetElm.off('.cfw.' + this.type);
                        this.$targetElm.on(eventIn  + '.cfw.' + this.type, $.proxy(this.enter, this));
                        this.$targetElm.on(eventOut + '.cfw.' + this.type, $.proxy(this.leave, this));
                    }
                }
            }

            if (this.$targetElm) {
                // Key handling for closing
                this.$targetElm.off('keydown.cfw.' + this.type + '.close')
                    .on('keydown.cfw.' + this.type + '.close', function(e) {
                        var code = e.charCode || e.which;
                        if (code && code == 27) {// if ESC is pressed
                            e.stopPropagation();
                            // Click the close button if it exists otherwise force tooltip closed
                            if ($('.close', $selfRef.$targetElm).length > 0) {
                                $('.close', $selfRef.$targetElm).eq(0).trigger('click');
                            } else {
                                $selfRef.hide(true);
                            }
                        }
                    });

                // Bind 'close' buttons
                this.$targetElm.off('click.dismiss.cfw.' + this.type, '[data-cfw-dismiss="' + this.type + '"]')
                    .on('click.dismiss.cfw.' + this.type, '[data-cfw-dismiss="' + this.type + '"]', function(e) {
                        $selfRef.toggle(e);
                    });
                // Hide tooltips on modal close
                this.$triggerElm.closest('.modal')
                    .off('beforeHide.cfw.modal')
                    .on('beforeHide.cfw.modal', function() {
                        $selfRef.hide(true);
                    });
            }
        },

        toggle : function(e) {
            if (e) { e.preventDefault(); }

            if (e) {
                this.inState.click = !this.inState.click;
                this.settings.follow = true;
            }

            if (this.$targetElm && this.$targetElm.hasClass('in')) {
                var holdDelay = this.settings.delay.hide;
                this.settings.delay.hide = 0;
                this.hide();
                this.settings.delay.hide = holdDelay;
            } else {
                this.show();
            }
        },

        enter : function(e) {
            if (e) {
                this.inState[e.type == 'focusin' ? 'focus' : 'hover'] = true;
            }

            if ((this.$targetElm && this.$targetElm.hasClass('in')) || this.hoverState == 'in') {
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
            if (this.$targetElm && this.$targetElm.hasClass('in')) { return; }

            if (!this.activate) {
                // Start show transition
                if (!this._trigger('beforeShow.cfw.' + this.type)) {
                    return;
                }
            }

            this.inTransition = 1;

            // Create/link the tooltip container
            if (!this.$targetElm) {
                var targetElm = this.createTip();
                if (targetElm.length <= 0) { return false; }
                this.dynamicTip = true;
                this.$targetElm = targetElm;
            }
            if (this.$targetElm.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
            }
            this.linkTip();
            this.bindTip(false);
            this.setContent();

            if (this.settings.animate) { this.$targetElm.addClass('fade'); }

            this.locateTip();

            // Additional tab/focus handlers for non-inline items
            if (this.settings.container) {
                this.$triggerElm
                    .off('focusin.cfw.' + this.type + '.focusStart')
                    .on('focusin.cfw.' + this.type + '.focusStart', function(e) {
                        if ($selfRef.$targetElm.hasClass('in')) {
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
                                var currIndex = selectables.index($selfRef.$triggerElm);
                                prevIndex = selectables.index($prevNode);
                                if (currIndex < prevIndex) {
                                    var tipSels = $selfRef._tabItems($selfRef.$targetElm);

                                    var selsIndex = tipSels.length - 2;
                                    tipSels.eq(selsIndex).trigger('focus');
                                } else {
                                    $selfRef.$targetElm.trigger('focus');
                                }
                            } else {
                                $selfRef.$targetElm.trigger('focus');
                            }
                        }
                    });
                this.$targetElm
                    .off('keydown.cfw.' + this.type + '.tabmove')
                    .on('keydown.cfw.' + this.type + '.tabmove', function(e) {
                        if (e.which == 9) {
                            $selfRef.flags.keyTab = true;
                            if (e.shiftKey) { $selfRef.flags.keyShift = true; }
                        }
                    });
                this.$targetElm
                    .off('keyup.cfw.' + this.type + '.tabmove')
                    .on('keyup.cfw.' + this.type + '.tabmove', function(e) {
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
                    .appendTo(this.$targetElm);
                }
                if (this.$focusLast) {
                    this.$focusLast
                        .off('focusin.cfw.' + this.type + '.focusLast')
                        .on('focusin.cfw.' + this.type + '.focusLast', function(e) {
                            // Bypass this item if coming from outside of tip
                            if ($selfRef.$targetElm[0] !== e.relatedTarget && !$selfRef.$targetElm.has(e.relatedTarget).length) {
                                e.preventDefault();
                                return;
                            }
                            $selfRef._tabNext($selfRef.$triggerElm[0]);
                        });
                }
                this.$targetElm
                    .off('focusout.cfw.' + this.type + '.tabmove')
                    .on('focusout.cfw.' + this.type + '.tabmove', function() {
                        $(document)
                            .off('focusin.cfw.' + this.type + '.tabmove')
                            .one('focusin.cfw.' + this.type + '.tabmove', function(e) {
                                if (document !== e.target && $selfRef.$targetElm[0] !== e.target && !$selfRef.$targetElm.has(e.target).length) {
                                    if ($selfRef.flags.keyTab) {
                                        if ($selfRef.flags.keyShift) {
                                            $selfRef._tabPrev($selfRef.$triggerElm[0]);
                                        } else {
                                            $selfRef._tabNext($selfRef.$triggerElm[0]);
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

            if ($.support.transitionEnd && this.$targetElm.hasClass('fade')) {
                this.$targetElm.one('cfwTransitionEnd', $.proxy(this._showComplete, this))
                    .CFW_emulateTransitionEnd(this.settings.speed);
            } else {
                this._showComplete();
            }
        },

        hide : function(force) {
            clearTimeout(this.delayTimer);

            // Handle delayed show and target not created
            if (!this.$targetElm) { return; }

            // Bail if transition in progress or already hidden
            if (this.inTransition || !this.$targetElm.hasClass('in')) { return; }

            if (force === undefined) { force = false; }
            if (force) {
                this._hideComplete();
                return;
            }

            // Start hide transition
            if (!this._trigger('beforeHide.cfw.' + this.type)) {
                return;
            }

            this.inTransition = 1;

            this.$triggerElm
                .off('.cfw.' + this.type + '.focusStart')
                .off('.cfw.modal')
                .removeAttr('aria-describedby');
            this.$targetElm
                .off('.cfw.' + this.type)
                .removeClass('in');
            if (this.$focusLast) {
                this.$focusLast.off('.cfw.' + this.type + '.focusLast');
            }
            $(document).off('.cfw.' + this.type + '.tabmove');

            if ($.support.transitionEnd && this.$targetElm.hasClass('fade')) {
                this.$targetElm.one('cfwTransitionEnd', $.proxy(this._hideComplete, this))
                    .CFW_emulateTransitionEnd(this.settings.speed);
            } else {
                this._hideComplete();
            }

            this.hoverState = null;
        },

        unlink : function(force) {
            var $selfRef = this;
            if (force === undefined) { force = false; }

            clearTimeout(this.delayTimer);

            this._trigger('beforeUnlink.cfw.' + this.type);
            this.unlinking = true;

            if (this.$targetElm && this.$targetElm.hasClass('in')) {
                this.$triggerElm.one('afterHide.cfw.' + this.type, function() {
                    $selfRef.unlinkComplete();
                });
                this.hide(force);
            } else {
                this.unlinkComplete();
            }
        },

        unlinkComplete : function() {
            if (this.$targetElm) {
                this.$targetElm.off('.cfw.' + this.type)
                    .removeData('cfw.' + this.type);
            }
            this.$triggerElm.off('.cfw.' + this.type)
                .off('.cfw.modal')
                .removeAttr('data-cfw')
                .removeData('cfw.' + this.type);
            this.unlinking = false;
            this._trigger('afterUnlink.cfw.' + this.type);
        },

        destroy : function() {
            var $selfRef = this;
            $(document).one('afterUnlink.cfw.' + this.type, this.$triggerElm, function() {
                if ($selfRef.$targetElm !== null) {
                    $selfRef.$targetElm.remove();
                }
                $selfRef._trigger('destroy.cfw.' + $selfRef.type);
            });
            this.unlink(true);

            this.$arrow = null;
            this.$viewport = null;
            this.$targetElm = null;
            this.$triggerElm = null;
        },

        locateTip : function() {
            var $tip = this.$targetElm;

            $tip.removeClass('top left bottom right');

            $tip.detach()
                .css({ top: 0, left: 0, display: 'block' });

            var placement = typeof this.settings.placement == 'function' ?
                this.settings.placement.call(this, this.$targetElm[0], this.$triggerElm[0]) :
                this.settings.placement;

            if (typeof placement == 'object') {
                // Custom placement
                this.settings.container = 'body';
                $tip.appendTo(this.settings.container);
                this._trigger('inserted.cfw.' + this.type);
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
                    $tip.insertAfter(this.$triggerElm);
                }
                this._trigger('inserted.cfw.' + this.type);

                var pos          = this._getPosition();
                var actualWidth  = $tip[0].offsetWidth;
                var actualHeight = $tip[0].offsetHeight;

                if (autoPlace) {
                    var orgPlacement = placement;

                    var viewportDim = this._getPosition(this.$viewport);

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

            // this.$targetElm.addClass('in')
            this.$targetElm.removeAttr('aria-hidden');
            this.inTransition = 0;
            if (this.settings.follow) {
                this.$targetElm.trigger('focus');
            }

            // Delay to keep NVDA (and other screen readers?) from reading dialog header twice
            setTimeout(function() {
                // Handle case of immediate destroy after show
                if ($selfRef.$triggerElm) {
                    $selfRef.$triggerElm.attr('aria-describedby', $selfRef.targetID);
                }
            }, 25);

            if (!this.activate) {
                this._trigger('afterShow.cfw.' + this.type);
            }
            this.activate = false;

            if (prevHoverState == 'out') this.leave();
        },

        _hideComplete : function() {
            this.$targetElm.removeClass('in')
                .css('display', 'none')
                .attr({
                    'aria-hidden': 'true',
                    'role':  ''
                });

            this.inTransition = 0;
            if (this.settings.follow) {
                this.$targetElm.attr('tabindex', -1);
                this.$triggerElm.trigger('focus');
            }
            this.settings.follow = false;

            // Only remove dynamically created tips
            if (this.hoverState != 'in' && this.dynamicTip) {
                this._removeDynamicTip();
            }

            this._trigger('afterHide.cfw.' + this.type);

            if (!this.unlinking) {
                if (this.settings.unlink) { this.unlink(); }
                if (this.settings.destroy) { this.destroy(); }
            }
        },

        _removeDynamicTip : function() {
            this.$targetElm.detach();
            this.dynamicTip = false;
            this.closeAdded = false;
            this.$arrow = null;
            this.$targetElm = null;
        },

        _getPosition : function($element) {
            $element   = $element || this.$triggerElm;

            var el     = $element[0];
            var isBody = el.tagName == 'BODY';

            var elRect = el.getBoundingClientRect();

            if (elRect.width == null) {
                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
            }

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
            var $tip   = this.$targetElm;
            var width  = $tip[0].offsetWidth;
            var height = $tip[0].offsetHeight;

            // manually read margins because getBoundingClientRect includes difference
            var marginTop = parseInt($tip.css('margin-top'), 10);
            var marginLeft = parseInt($tip.css('margin-left'), 10);

            // we must check for NaN for ie 8/9
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
            var actualWidth  = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

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

        getViewportBounds : function($viewport) {
            var elRect = $viewport[0].getBoundingClientRect();
            if (elRect.width == null) {
                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
            }

            if ($viewport.is('body') && (/fixed|absolute/).test(this.$triggerElm.css('position'))) {
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

            var viewportPadding = this.settings.viewport && this.settings.viewport.padding || 0;
            // var viewportDimensions = this._getPosition(this.$viewport);
            var viewportDimensions = this.getViewportBounds(this.$viewport);

            if (/right|left/.test(placement)) {
                // var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
                // var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
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
                this.$arrow = this.$targetElm.find('.tooltip-arrow');
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
            // var isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));

            // Support: IE 8 only
            // IE 8 doesn't resolve inherit to visible/hidden for computed values
            function visible(element) {
                var visibility = element.css('visibility');
                while (visibility === 'inherit') {
                    element = element.parent();
                    visibility = element.css('visibility');
                }
                return visibility !== 'hidden';
            }

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
                $(element).is(':visible') && visible($(element));
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
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var $e = this.$triggerElm;

            var string = this.type;
            var dataType = string.charAt(0).toUpperCase() + string.slice(1);

            if (typeof $e.data('cfw' + dataType + 'Toggle')      !== 'undefined') { parsedData.toggle      = $e.data('cfw' + dataType + 'Toggle');      }
            if (typeof $e.data('cfw' + dataType + 'Trigger')     !== 'undefined') { parsedData.trigger     = $e.data('cfw' + dataType + 'Trigger');     }
            if (typeof $e.data('cfw' + dataType + 'Placement')   !== 'undefined') { parsedData.placement   = $e.data('cfw' + dataType + 'Placement');   }
            if (typeof $e.data('cfw' + dataType + 'Follow')      !== 'undefined') { parsedData.follow      = $e.data('cfw' + dataType + 'Follow');      }
            if (typeof $e.data('cfw' + dataType + 'Animate')     !== 'undefined') { parsedData.animate     = $e.data('cfw' + dataType + 'Animate');     }
            if (typeof $e.data('cfw' + dataType + 'Speed')       !== 'undefined') { parsedData.speed       = $e.data('cfw' + dataType + 'Speed');       }
            if (typeof $e.data('cfw' + dataType + 'Delay')       !== 'undefined') { parsedData.delay       = $e.data('cfw' + dataType + 'Delay');       }
            if (typeof $e.data('cfw' + dataType + 'DelayShow')   !== 'undefined') { parsedData.delay.show  = $e.data('cfw' + dataType + 'DelayShow');   }
            if (typeof $e.data('cfw' + dataType + 'DelayHide')   !== 'undefined') { parsedData.delay.hide  = $e.data('cfw' + dataType + 'DelayHide');   }
            if (typeof $e.data('cfw' + dataType + 'Container')   !== 'undefined') { parsedData.container   = $e.data('cfw' + dataType + 'Container');   }
            if (typeof $e.data('cfw' + dataType + 'Viewport')    !== 'undefined') { parsedData.viewport    = $e.data('cfw' + dataType + 'Viewport');    }
            if (typeof $e.data('cfw' + dataType + 'Html')        !== 'undefined') { parsedData.html        = $e.data('cfw' + dataType + 'Html');        }
            if (typeof $e.data('cfw' + dataType + 'Closetext')   !== 'undefined') { parsedData.closetext   = $e.data('cfw' + dataType + 'Closetext');   }
            if (typeof $e.data('cfw' + dataType + 'Closesrtext') !== 'undefined') { parsedData.closesrtext = $e.data('cfw' + dataType + 'Closesrtext'); }
            if (typeof $e.data('cfw' + dataType + 'Title')       !== 'undefined') { parsedData.title       = $e.data('cfw' + dataType + 'Title');       }
            if (typeof $e.data('cfw' + dataType + 'Unlink')      !== 'undefined') { parsedData.unlink      = $e.data('cfw' + dataType + 'Unlink');      }
            if (typeof $e.data('cfw' + dataType + 'Destroy')     !== 'undefined') { parsedData.destroy     = $e.data('cfw' + dataType + 'Destroy');     }
            if (typeof $e.data('cfw' + dataType + 'Activate')    !== 'undefined') { parsedData.activate    = $e.data('cfw' + dataType + 'Activate');    }
            return parsedData;
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttrExt : function() {
            return;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$triggerElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.tooltip');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|destroy|hide/.test(option)) {
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
 * Figuration (v2.0.0): popover.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Tooltip === undefined) throw new Error('CFW_Popover requires tooltip.js');

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
        placement   : 'top',        // Where to locate tooltip (top/bottom/left/right/auto)
        trigger     : 'click',      // How tooltip is triggered (click/hover/focus/manual)
        content     : '',           // Content text/html to be inserted
        closetext   : '<span aria-hidden="true">&times;</span>', // Text for close links
        drag        : false,        // If the popover should be draggable
        dragtext    : '<span aria-hidden="true">+</span>', // Text for drag handle
        dragsrtext  : 'Drag',       // Screen reader text for drag handle
        dragstep     : 10,          // 'Drag' increment for keyboard
        template    : '<div class="popover"><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-arrow"></div></div>'
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
        var $tip = this.$targetElm;
        var $title = $tip.find('.popover-title');
        var $content = $tip.find('.popover-content');

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

        // Use '.popover-title' for labelledby
        if ($title.length) {
            var labelledby = this._getID($title.eq(0), 'cfw-popover');
            this.$targetElm.attr('aria-labelledby', labelledby);
        }

        if (this.settings.drag && !this.dragAdded) {
            if (this.$targetElm.find('[data-cfw-drag="' + this.type + '"]').length <= 0) {
                var $drag = $('<span role="button" tabindex="0" class="drag" data-cfw-drag="' + this.type +  '" aria-label="' + this.settings.dragsrtext + '">' + this.settings.dragtext + '</span>');
                $drag.insertAfter(this.$targetElm.find('.close').eq(0));
                this.dragAdded = true;
            }
        }

        if (this.$targetElm.find('[data-cfw-drag="' + this.type + '"]').length) {
            this.$targetElm.addClass('draggable');
            // Force settings
            this.settings.trigger = 'click';
            this.settings.container = 'body';
            // Enable drag handlers
            this.enableDrag();
        }

        $tip.removeClass('fade in top bottom left right');

        if (!$title.html()) { $title.hide(); }

        if ((this.$targetElm.attr('role') == 'dialog') && (!this.docAdded)) {
            // Inject a role="document" container
            var $children = this.$targetElm.children().not(this.$arrow);
            var docDiv = document.createElement('div');
            docDiv.setAttribute('role', 'document');
            $children.wrapAll(docDiv);
            // Make sure arrow is at end of popover for roles to work properly with screen readers
            this._arrow();
            this.$arrow.appendTo(this.$targetElm);
            this.docAdded = true;
        }
    };

    CFW_Widget_Popover.prototype.getContent = function() {
        var content;
        var $e = this.$triggerElm;
        var s = this.settings;

        content = (typeof s.content == 'function' ? s.content.call($e[0]) :  s.content);

        return content;
    };

    CFW_Widget_Popover.prototype.enableDrag = function() {
        var $selfRef = this;
        var limit = {};

        var dragOpt = { handle: '[data-cfw-drag="' + this.type + '"]' };

        // Unset any previous drag events
        this.$targetElm.off('.cfw.drag');

        this.$targetElm.on('dragStart.cfw.drag', function() {
            var $viewport;
            if ($selfRef.$viewport) {
                $viewport = $selfRef.$viewport;
            } else {
                $viewport = $(document.body);
            }

            limit = $viewport.offset();
            limit.bottom = limit.top + $viewport.outerHeight() - $(this).outerHeight();
            limit.right = limit.left + $viewport.outerWidth() - $(this).outerWidth();

            $selfRef._updateZ();
            $selfRef._trigger('dragStart.cfw.' + $selfRef.type);
        })
        .on('drag.cfw.drag', function(e) {
            var viewportPadding = 0;
            if ($selfRef.$viewport) {
                viewportPadding = $selfRef.settings.viewport && $selfRef.settings.viewport.padding || 0;
            }

            $(this).css({
                top: Math.min((limit.bottom - viewportPadding), Math.max((limit.top + viewportPadding), e.offsetY)),
                left: Math.min((limit.right - viewportPadding), Math.max((limit.left + viewportPadding), e.offsetX))
            });
        })
        .on('dragEnd.cfw.drag', function() {
            $selfRef._trigger('dragEnd.cfw.' + $selfRef.type);
        })
        .on('keydown.cfw.' + this.type + '.drag', '[data-cfw-drag="' + this.type + '"]', function(e) {
            if (/(37|38|39|40)/.test(e.which)) {
                if (e) { e.stopPropagation(); }

                if (!$selfRef.keyTimer) {
                    $selfRef._trigger('dragStart.cfw.' + $selfRef.type);
                }

                clearTimeout($selfRef.keyTimer);

                var $viewport;
                var viewportPadding = 0;
                if ($selfRef.$viewport) {
                    $viewport = $selfRef.$viewport;
                    viewportPadding = $selfRef.settings.viewport && $selfRef.settings.viewport.padding || 0;
                } else {
                    $viewport = $(document.body);
                }

                var $node = $selfRef.$targetElm;
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
                    $selfRef._trigger('dragEnd.cfw.' + $selfRef.type);
                    $selfRef.keyTimer = null;
                }, $selfRef.keyDelay);

                // Stop browser from scrolling
                return false;
            }
        });

        this.$targetElm.CFW_Drag(dragOpt);
    };

    CFW_Widget_Popover.prototype.hide = function() {
        // Fire key drag end if needed
        if (this.keyTimer) {
            this._trigger('dragEnd.cfw.' + this.type);
            clearTimeout(this.keyTimer);
        }
        // Call tooltip hide
        $.fn.CFW_Tooltip.Constructor.prototype.hide.apply(this);
    };

    CFW_Widget_Popover.prototype._removeDynamicTip = function() {
        this.$targetElm.detach();
        this.dynamicTip = false;
        this.closeAdded = false;
        this.dragAdded = false;
        this.docAdded = false;
        this.$arrow = false;
        this.$targetElm = null;
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
        if (this.$targetElm[0] !== $zObj[0]) {
            this.$targetElm.css('z-index', ++zMax);
        }
    };

    CFW_Widget_Popover.prototype._arrow = function() {
        if (!this.$arrow) {
            this.$arrow = this.$targetElm.find('.arrow, .popover-arrow');
        }
        return this.$arrow;
    };

    CFW_Widget_Popover.prototype._parseDataAttrExt = function() {
        var parsedData = {};
        var $e = this.$triggerElm;

        var string = this.type;
        var dataType = string.charAt(0).toUpperCase() + string.slice(1);

        if (typeof $e.data('cfw' + dataType + 'Content')    !== 'undefined') { parsedData.content    = $e.data('cfw' + dataType + 'Content');    }
        if (typeof $e.data('cfw' + dataType + 'Drag')       !== 'undefined') { parsedData.drag       = $e.data('cfw' + dataType + 'Drag');       }
        if (typeof $e.data('cfw' + dataType + 'Dragtext')   !== 'undefined') { parsedData.dragtext   = $e.data('cfw' + dataType + 'Dragtext');   }
        if (typeof $e.data('cfw' + dataType + 'Dragsrtext') !== 'undefined') { parsedData.dragsrtext = $e.data('cfw' + dataType + 'Dragsrtext'); }
        if (typeof $e.data('cfw' + dataType + 'Dragstep')   !== 'undefined') { parsedData.dragstep   = $e.data('cfw' + dataType + 'Dragstep');   }

        return parsedData;
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.popover');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|destroy|hide/.test(option)) {
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
 * Figuration (v2.0.0): modal.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Modal = function(element, options) {
        this.$body = $(document.body);
        this.$triggerElm = $(element);
        this.$targetElm = null;
        this.$backdrop = null;
        this.isShown = null;
        this.scrollbarWidth = 0;
        this.unlinking = false;
        this.originalBodyPad = null;
        this.$dialog = null;
        this.ignoreBackdropClick = false;
        this.$focusLast = null;

        this.settings = $.extend({}, CFW_Widget_Modal.DEFAULTS, this._parseDataAttr(), options);
        if (this.settings.speed && typeof this.settings.speed == 'number') {
            this.settings.speed = {
                backdrop: this.settings.speed,
                modal: this.settings.speed
            };
        }

        this._init();
    };

    CFW_Widget_Modal.DEFAULTS = {
        toggle       : false,       // Target selector
        animate      : true,        // If modal windows should animate
        speed : {
            backdrop : 150,         // Speed of backdrop animation (milliseconds)
            modal    : 300          // Speed of modal animation (milliseconds)
        },
        unlink       : false,       // If on hide to remove events and attributes from modal and trigger
        destroy      : false,       // If on hide to unlink, then remove modal from DOM
        backdrop     : true,        // Show backdrop, or 'static' for no close on click
        keyboard     : true,        // Close modal on ESC press
        show         : false,       // Show modal afer initialize
        remote       : false        // Remote URL to load one time
    };

    CFW_Widget_Modal.prototype = {

        _init : function() {
            // Find target by id/css selector - only pick first one found
            var $findTarget = $(this.settings.toggle).eq(0);
            if ($findTarget.length <= 0) {
                // If not found by selector - find by 'toggle' data
                var dataToggle = this.$triggerElm.attr('data-cfw-modal-toggle');
                $findTarget = $('[data-cfw-modal-target="' + dataToggle + '"]');
            }
            if ($findTarget.length <= 0) { return false; }
            this.$targetElm = $findTarget;
            this.$dialog = this.$targetElm.find('.modal-dialog');

            this.$triggerElm.attr('data-cfw', 'modal');

            // Check for presence of ids - set if not present
            // var triggerID = this._getID(this.$triggerElm, 'cfw-modal');
            var targetID = this._getID(this.$targetElm, 'cfw-modal');

            // Set ARIA attributes on trigger
            this.$triggerElm.attr('aria-controls', targetID);

            // Use '.modal-title' for labelledby
            var $title = this.$targetElm.find('.modal-title');
            if ($title.length) {
                var labelledby = this._getID($title.eq(0), 'cfw-modal');
                this.$targetElm.attr('aria-labelledby', labelledby);
            }

            // Set ARIA attributes on target
            this.$targetElm.attr({
                'role': 'dialog',
                'aria-hidden': 'true',
                'tabindex': -1
            });
            this.$dialog.attr('role', 'document');

            // Bind click handler
            this.$triggerElm.on('click.cfw.modal.toggle', $.proxy(this.toggle, this));

            this.$targetElm.data('cfw.modal', this);

            this._trigger('init.cfw.modal');

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
            if (!this._trigger('beforeShow.cfw.modal')) {
                return;
            }

            this.isShown = true;

            this.checkScrollbar();
            this.setScrollbar();
            this.$body.addClass('modal-open');

            this.escape();
            this.resize();

            this.$targetElm.on('click.dismiss.cfw.modal', '[data-cfw-dismiss="modal"]', function(e) {
                    if (e) { e.preventDefault(); }
                    $selfRef.hide();
                })
                .data('cfw.modal', this);

            this.$dialog.on('mousedown.dismiss.cfw.modal', function() {
                $selfRef.$targetElm.one('mouseup.dismiss.cfw.modal', function(e) {
                    if ($(e.target).is($selfRef.$targetElm)) $selfRef.ignoreBackdropClick = true;
                });
            });

            this.backdrop(function() {
                $selfRef._showComplete();
            });
        },

        hide : function() {
            var $selfRef = this;

            // Bail if not showing
            if (!this.isShown) { return; }

            // Start close transition
            if (!this._trigger('beforeHide.cfw.modal')) {
                return;
            }

            this.isShown = false;

            $(document).off('focusin.cfw.modal');
            this.$targetElm
                .removeClass('in')
                .attr('aria-hidden', true)
                .off('.dismiss.cfw.modal');

            this.$dialog.off('mousedown.dismiss.cfw.modal');

            if (this.$focusLast) {
                this.$focusLast.off('.cfw.' + this.type + '.focusLast');
            }

            if (this.settings.animate && $.support.transitionEnd) {
                this.$targetElm.one('cfwTransitionEnd', function() {
                    $selfRef._hideComplete();
                }).CFW_emulateTransitionEnd(this.settings.speed.modal);
            } else {
                this._hideComplete();
            }
        },

        _showComplete : function() {
            var $selfRef = this;

            var transition = this.settings.animate && $.support.transitionEnd;
            if (transition) {
                this.$targetElm.addClass('fade');
            }

            if (!this.$targetElm.parent().length) {
                this.$targetElm.appendTo(this.$body); // don't move modals dom position
            }

            this.$targetElm.show().scrollTop(0);

            this.adjustDialog();

            if (transition) {
                this.$targetElm[0].offsetWidth; // Force Reflow
            }

            this.$targetElm.addClass('in').removeAttr('aria-hidden');

            this.enforceFocus();
            this.enforceFocusLast();

            if (transition) {
                // wait for modal to slide in
                this.$dialog.one('cfwTransitionEnd', function() {
                    $selfRef.$targetElm.trigger('focus');
                    $selfRef._trigger('afterShow.cfw.modal');
                }).CFW_emulateTransitionEnd(this.settings.speed.modal);
            } else {
                this.$targetElm.trigger('focus');
                this._trigger('afterShow.cfw.modal');
            }
        },

        _hideComplete : function() {
            var $selfRef = this;

            this.escape();
            this.resize();

            this.$targetElm.hide();
            this.backdrop(function() {
                $selfRef.$body.removeClass('modal-open');
                $selfRef.resetAdjustments();
                $selfRef.resetScrollbar();
                $selfRef._trigger('afterHide.cfw.modal');
            });
            this.$triggerElm.trigger('focus');

            if (!this.unlinking) {
                if (this.settings.unlink) { this.unlink(); }
                if (this.settings.destroy) { this.destroy(); }
            }
        },

        enforceFocus : function() {
            var $selfRef = this;
            $(document)
                .off('focusin.cfw.modal') // guard against infinite focus loop
                .on('focusin.cfw.modal', function(e) {
                    if (document !== e.target && $selfRef.$targetElm[0] !== e.target && !$selfRef.$targetElm.has(e.target).length) {
                        $selfRef.$targetElm.trigger('focus');
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
                .appendTo(this.$targetElm);
            }
            if (this.$focusLast) {
                this.$focusLast
                    .off('focusin.cfw.modal.focusLast')
                    .on('focusin.cfw.modal.focusLast', function() {
                        $selfRef.$targetElm.trigger('focus');
                    });
            }
        },

        escape : function() {
            var $selfRef = this;
            if (this.isShown && this.settings.keyboard) {
                this.$targetElm.on('keydown.dismiss.cfw.modal', function(e) {
                    e.which == 27 && $selfRef.hide();
                });
            } else if (!this.isShown) {
                this.$targetElm.off('keydown.dismiss.cfw.modal');
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
                .css('height', this.$targetElm[0].scrollHeight);
        },

        adjustDialog : function() {
            var modalIsOverflowing = this.$targetElm[0].scrollHeight > document.documentElement.clientHeight;

            this.$targetElm.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });
        },

        resetAdjustments : function() {
            this.$targetElm.css({
                paddingLeft: '',
                paddingRight: ''
            });
        },

        checkScrollbar : function() {
            var fullWindowWidth = window.innerWidth;
            if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
            }
            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
            this.scrollbarWidth = this.measureScrollbar();
        },

        setScrollbar : function() {
            var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
            this.originalBodyPad = document.body.style.paddingRight || '';
            if (this.bodyIsOverflowing) {
                this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
            }
            this._trigger('scrollbarSet.cfw.modal');
        },

        resetScrollbar : function() {
            this.$body.css('padding-right', this.originalBodyPad);
            this._trigger('scrollbarReset.cfw.modal');
        },

        measureScrollbar : function() {
            var $body = $(document.body);
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            $body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            $body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        },

        backdrop : function(callback) {
            var $selfRef = this;

            var animate = (this.settings.animate) ? 'fade' : '';

            if (this.isShown && this.settings.backdrop) {
                var doAnimate = $.support.transitionEnd && animate;

                this.$backdrop = $(document.createElement('div'))
                    .addClass('modal-backdrop ' + animate)
                    .appendTo(this.$body);

                this.$targetElm.on('click.dismiss.cfw.modal', function(e) {
                    if ($selfRef.ignoreBackdropClick) {
                        $selfRef.ignoreBackdropClick = false;
                        return;
                    }
                    if (e.target !== e.currentTarget) { return; }
                    $selfRef.settings.backdrop == 'static'
                        ? $selfRef.$targetElm.trigger('focus')
                        : $selfRef.hide();
                });

                if (doAnimate) this.$backdrop[0].offsetWidth; // Force Reflow

                this.$backdrop.addClass('in');

                if (!callback) { return; }

                if (doAnimate) {
                    this.$backdrop.one('cfwTransitionEnd', callback).CFW_emulateTransitionEnd(this.settings.speed.backdrop);
                } else {
                    callback();
                }
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in');

                var callbackRemove = function() {
                    $selfRef.removeBackdrop();
                    callback && callback();
                };

                if (this.settings.animate && $.support.transitionEnd) {
                    this.$backdrop.one('cfwTransitionEnd', callbackRemove).CFW_emulateTransitionEnd(this.settings.speed.backdrop);
                } else {
                    callbackRemove();
                }
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

            this._trigger('beforeUnlink.cfw.modal');
            this.unlinking = true;

            if (this.isShown) {
                this.$targetElm.one('afterHide.cfw.modal', function() {
                    $selfRef.unlinkComplete();
                });
                this.hide();
            } else {
                this.unlinkComplete();
            }
        },

        unlinkComplete : function() {
            this.$targetElm.off('.cfw.modal')
                .removeAttr('aria-labelledby')
                .removeData('cfw.modal');
            this.$triggerElm.off('.cfw.modal')
                .removeAttr('data-cfw aria-controls')
                .removeData('cfw.modal');

            this.unlinking = false;
            this._trigger('afterUnlink.cfw.modal');
        },

        destroy : function() {
            var $selfRef = this;

            $(document).one('afterUnlink.cfw.modal', this.$targetElm, function() {
                $selfRef._trigger('destroy.cfw.modal');
                $selfRef.$targetElm.remove();
            });
            this.unlink();
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$triggerElm.data();

            if (typeof data.cfwModalToggle   !== 'undefined') { parsedData.toggle   = data.cfwModalToggle;  }
            if (typeof data.cfwModalAnimate  !== 'undefined') { parsedData.animate  = data.cfwModalAnimate;  }
            if (typeof data.cfwModalSpeed    !== 'undefined') { parsedData.speed    = data.cfwModalSpeed;    }
            if (typeof data.cfwModalUnlink   !== 'undefined') { parsedData.unlink   = data.cfwModalUnlink;   }
            if (typeof data.cfwModalDestroy  !== 'undefined') { parsedData.destroy  = data.cfwModalDestroy;  }
            if (typeof data.cfwModalBackdrop !== 'undefined') { parsedData.backdrop = data.cfwModalBackdrop; }
            if (typeof data.cfwModalKeyboard !== 'undefined') { parsedData.keyboard = data.cfwModalKeyboard; }
            if (typeof data.cfwModalShow     !== 'undefined') { parsedData.show     = data.cfwModalShow;     }
            if (typeof data.cfwModalRemote   !== 'undefined') { parsedData.remote   = data.cfwModalRemote;   }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$targetElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.modal');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|destroy/.test(option)) {
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
 * Figuration (v2.0.0): accordion.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Collapse === undefined) throw new Error('CFW_Accordion requires collapse.js');

    var CFW_Widget_Accordion = function(element, options) {
        this.$element = $(element);

        this.settings = $.extend({}, CFW_Widget_Accordion.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Accordion.DEFAULTS = {
        active      : false     // [TODO} ???
    };

    CFW_Widget_Accordion.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element.attr('data-cfw', 'accordion');

            this.$element.on('beforeShow.cfw.collapse', function(e) {
                if (e.isDefaultPrevented()) { return; }
                $selfRef.updateCollapse(e);
            });

            this._trigger('init.cfw.accordion');
        },

        updateCollapse : function(e) {
            var hasActive = false;
            var $activeCollapse = $(e.target);
            var $collapse = this.$element.find('[data-cfw="collapse"]');

            $collapse.each(function() {
                if ($(this).data('cfw.collapse').inTransition === 1) {
                    hasActive = true;
                }
            });

            if (hasActive) {
                e.preventDefault();
                return;
            }

            $collapse.each(function() {
                var $this = $(this);
                if ($this.is($activeCollapse)) {
                    return;
                }
                $this.CFW_Collapse('hide');
            });
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwAccordionActive !== 'undefined') { parsedData.active = data.cfwAccordionActive; }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.Accordion');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.Accordion', (data = new CFW_Widget_Accordion(this, options)));
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
 * Figuration (v2.0.0): tab-responsive.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Tab === undefined) throw new Error('CFW_TabResponsive requires tab.js');
    if ($.fn.CFW_Collapse === undefined) throw new Error('CFW_TabResponsive requires collapse.js');

    var CFW_Widget_TabResponsive = function(element, options) {
        this.$element = $(element);

        this.settings = $.extend({}, CFW_Widget_TabResponsive.DEFAULTS, this._parseDataAttr(), options);

        this.$tabFirst = this.$element.find('[data-cfw="tab"]').eq(0);
        this.$navElm = this.$tabFirst.closest('ul:not(.dropdown-menu)');
        this.$tabActive = this.$navElm.find('li.active').find('[data-cfw="tab"]');

        this._init();
    };

    CFW_Widget_TabResponsive.DEFAULTS = {
        active      : false     // Open the collase for the default active tab
    };

    CFW_Widget_TabResponsive.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element.attr('data-cfw', 'tabResponsive');

            // Set tab -> collapse
            this.$element.on('beforeShow.cfw.tab', function(e) {
                if (e.isDefaultPrevented()) { return; }
                var callingNode = e.target;
                $selfRef.updateCollapse(callingNode);
            });

            // Set collapse -> tab
            this.$element.on('beforeShow.cfw.collapse', function(e) {
                if (e.isDefaultPrevented()) { return; }
                var callingNode = e.target;
                $selfRef.updateTab(callingNode);
            });

            // Remove 0px height from a collapsed item so the tab appears normally
            // when browser enlarged.
            this.$element.on('afterHide.cfw.collapse', function(e) {
                var callingNode = e.target;
                $(callingNode).data('cfw.collapse').$targetElm.css('height', '');
            });

            // Remove fade animations and aria-hidden for all tabs
            this.$element.find('[data-cfw="tab"]').CFW_Tab('fadeDisable').CFW_Tab('hiddenDisable');

            // Remove aria-hidden for all collapse
            this.$element.find('[data-cfw="collapse"]').CFW_Collapse('hiddenDisable');

            // Open collapse on active item
            if (this.settings.active) {
                this.updateCollapse(this.$tabActive);
            }

            this._trigger('init.cfw.tabResponsive');
        },

        // Open the collapse element in the active panel
        // Closes all related collapse items first
        updateCollapse : function(node) {
            var $activeTab = $(node);
            var data = $($activeTab).data('cfw.tab');
            if (data) {
                var $activePane = data.$targetElm;

                var $paneContainer = $activePane.closest('.tab-content');
                $paneContainer.find('[data-cfw="collapse"]').each(function() {
                    var $this = $(this);
                    $this.one('afterHide.cfw.collapse', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    $this.CFW_Collapse('_hideComplete');
                    $this.removeClass('open');
                });

                var $collapseItem = $activePane.find('[data-cfw="collapse"]');
                $collapseItem.one('afterShow.cfw.collapse', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $collapseItem.CFW_Collapse('_showComplete');
                $collapseItem.addClass('open');
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
                /*
                $this.one('beforeShow.cfw.collapse', function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                });
                */
                $this.CFW_Collapse('hide');
            });

            var $tabList = this.$navElm.find('[data-cfw="tab"]');
            $tabList.each(function() {
                var $triggerElm = $(this);
                var selector = $triggerElm.attr('data-cfw-tab-target');
                if (!selector) {
                    selector = $triggerElm.attr('href');
                }
                selector = selector.replace(/^#/, '');
                if (selector == $paneID) {
                    $triggerElm.one('beforeShow.cfw.tab', function(e) {
                        e.stopPropagation();
                        // e.preventDefault();
                    });
                    $triggerElm.CFW_Tab('show');
                }
            });
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwTabresponsiveActive !== 'undefined') { parsedData.active = data.cfwTabresponsiveActive; }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.tabResponsive');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.tabResponsive', (data = new CFW_Widget_TabResponsive(this, options)));
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
 * Figuration (v2.0.0): slideshow.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if (!$.fn.CFW_Tab) throw new Error('CFW_Slideshow requires tab.js');

    var CFW_Widget_Slideshow = function(element, options) {
        this.$element = $(element);
        this.$tabs = null;
        this.$navPrev = this.$element.find('[data-cfw-slideshow-nav="prev"]');
        this.$navPrevParent = this.$navPrev.parent('li');
        this.$navNext = this.$element.find('[data-cfw-slideshow-nav="next"]');
        this.$navNextParent = this.$navNext.parent('li');
        this.tabLen = null;
        this.currTab = null;
        this.currIndex = 0;

        this.settings = $.extend({}, CFW_Widget_Slideshow.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Slideshow.DEFAULTS = {
    };

    CFW_Widget_Slideshow.prototype = {
        _init : function() {
            var $selfRef = this;

            this.$element.attr('data-cfw', 'slideshow');

            // Find and bind tabs
            this.$tabs = this.$element.find('a[data-cfw="tab"]');
            this.tabLen = this.$tabs.length;
            if (!this.tabLen) { return; }

            // Bind tabs
            this.$tabs.on('beforeShow.cfw.tab', function(e) {
                if (e.isDefaultPrevented()) { return; }
                var callingNode = e.target;
                $selfRef.update(callingNode);
            });

            // Bind nav
            this.$navPrev.on('click.cfw.slideshow', function(e) {
                e.preventDefault();
                var $btn = $(e.target);
                if (!$btn.hasClass('disabled') && !$btn.parent('li').hasClass('disabled')) {
                    $selfRef.prev();
                }
            });
            this.$navNext.on('click.cfw.slideshow', function(e) {
                e.preventDefault();
                var $btn = $(e.target);
                if (!$btn.hasClass('disabled') && !$btn.parent('li').hasClass('disabled')) {
                    $selfRef.next();
                }
            });

            this.update();

            this._trigger('init.cfw.slideshow');
        },

        prev : function() {
            if (this.currIndex > 0) {
                this._trigger('prev.cfw.slideshow');
                var newIndex = this.currIndex - 1;
                this.$tabs.eq(newIndex).CFW_Tab('show');
            }
        },

        next : function() {
            if (this.currIndex < this.tabLen - 1) {
                this._trigger('next.cfw.slideshow');
                var newIndex = this.currIndex + 1;
                this.$tabs.eq(newIndex).CFW_Tab('show');
            }
        },

        update : function(node) {
            if (node === undefined) {
                // Find active tab
                this.$tabs.each(function() {
                    if ($(this).parent('li').hasClass('active')) {
                        node = this;
                        return false;
                    }
                });
            }

            this.currTab = node;
            this.currIndex = this._findIndex(node);
            this.updateNav();
        },

        updateNav : function() {
            // Reset
            this.$navPrev.removeClass('disabled');
            this.$navPrevParent.removeClass('disabled');
            this.$navNext.removeClass('disabled');
            this.$navNextParent.removeClass('disabled');

            if (this.currIndex <= 0) {
                this.$navPrev.addClass('disabled');
                this.$navPrevParent.addClass('disabled');
            }
            if (this.currIndex >= this.tabLen - 1) {
                this.$navNext.addClass('disabled');
                this.$navNextParent.addClass('disabled');
            }
        },

        _findIndex : function(node) {
            return $.inArray(node, this.$tabs);
        },

        _parseDataAttr : function() {
            var parsedData = {};
            // var data = this.$element.data();

            // if (typeof data.cfwSlideshowActive !== 'undefined') { parsedData.active = data.cfwSlideshowActive; }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.Slideshow');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.Slideshow', (data = new CFW_Widget_Slideshow(this, options)));
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
 * Figuration (v2.0.0): scrollspy.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Scrollspy = function(element, options) {
        this.$body  = $('body');
        this.$scrollElement = $(element).is('body') ? $(window) : $(element);
        this.selector = null;
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;

        this.settings = $.extend({}, CFW_Widget_Scrollspy.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Scrollspy.DEFAULTS = {
        offset: 10
    };

    CFW_Widget_Scrollspy.prototype = {
        _init : function() {
            var process  = $.proxy(this.process, this);

            this.$scrollElement.on('scroll.bs.scrollspy', process);
            this.selector = (this.settings.target || '') + ' .nav li > a';
            this._trigger(this.$scrollElement, 'init.cfw.scrollspy');

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
                // .filter(':visible')
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

            var active = $(selector)
                .parents('li')
                .addClass('active');

            if (active.parent('.dropdown-menu').length) {
                active = active
                    .closest('li.dropdown')
                    .addClass('active');
            }

            this._trigger(active, 'activate.cfw.scrollspy');
        },

        clear : function() {
            $(this.selector)
                .parentsUntil(this.settings.target, '.active')
                .removeClass('active');
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$scrollElement.data();

            if (typeof data.cfwScrollspyTarget !== 'undefined') { parsedData.target = data.cfwScrollspyTarget; }
            if (typeof data.cfwScrollspyOffset !== 'undefined') { parsedData.offset = data.cfwScrollspyOffset; }
            return parsedData;
        },

        _trigger : function($callingElm, eventName) {
            var e = $.Event(eventName);
            $callingElm.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.Scrollspy');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.Scrollspy', (data = new CFW_Widget_Scrollspy(this, options)));
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
 * Figuration (v2.0.0): alert.js
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

        this.settings = $.extend({}, CFW_Widget_Alert.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Alert.DEFAULTS = {
        animate     : true,     // If alert targets should fade out
        speed       : 150       // Speed of animation (milliseconds)
    };

    CFW_Widget_Alert.prototype = {

        _init : function() {
            var $selfRef = this;

            this.findParent();

            if (this.settings.animate) {
                this.$parent.addClass('fade in');
            }

            this.$parent.on('click.cfw.alert', dismiss, function() {
                $selfRef.close();
            });

            this.$parent.data('cfw.alert', this);
            this.$parent.find(dismiss).data('cfw.alert', this);

            this._trigger('init.cfw.alert');
        },

        close : function(e) {
            var $selfRef = this;

            if (e) e.preventDefault();

            if (this.inTransition) { return; }

            if (!this._trigger('beforeClose.cfw.alert')) {
                return;
            }

            this.inTransition = 1;

            function removeElement() {
                // Detach from parent, fire event then clean up data
                $selfRef.$parent.detach();
                $selfRef.inTransition = 0;
                $selfRef._trigger('afterClose.cfw.alert');
                $selfRef.$parent.remove();
            }

            this.$parent.removeClass('in');

            if ($.support.transitionEnd && this.$parent.hasClass('fade')) {
                this.$parent
                    .one('cfwTransitionEnd', $.proxy(removeElement, this))
                    .CFW_emulateTransitionEnd(this.settings.speed);
                return;
            }

            removeElement();
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

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwAlertTarget  !== 'undefined') { parsedData.animate = data.cfwAlertTarget;  }
            if (typeof data.cfwAlertAnimate !== 'undefined') { parsedData.animate = data.cfwAlertAnimate; }
            if (typeof data.cfwAlertSpeed   !== 'undefined') { parsedData.speed   = data.cfwAlertSpeed;   }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$parent.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
    $(document).on('click.cfw.alert', dismiss, function() {
        $(this).CFW_Alert('close');
    });

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v2.0.0): button.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Button = function(element) {
        this.$element = $(element);
    };

    CFW_Widget_Button.prototype = {

        toggle : function() {
            var changed = true;
            var $parent = this.$element.closest('[data-cfw="buttons"]');

            if ($parent.length) {
                var $input = this.$element.find('input');
                if ($input.prop('type') == 'radio') {
                    if ($input.prop('checked')) {
                        changed = false;
                    }
                    $parent.find('.active').removeClass('active');
                    this.$element.addClass('active');
                } else if ($input.prop('type') == 'checkbox') {
                    if (($input.prop('checked')) !== this.$element.hasClass('active')) {
                        changed = false;
                    }
                    this.$element.toggleClass('active');
                }
                $input.prop('checked', this.$element.hasClass('active'));
                if (changed) {
                    $input.trigger('change');
                }
            } else {
                this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
                this.$element.toggleClass('active');
            }
        }

    };

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.button');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.button', (data = new CFW_Widget_Button(this, options)));
            }
            data.toggle();
        });
    }

    $.fn.CFW_Button = Plugin;
    $.fn.CFW_Button.Constructor = CFW_Widget_Button;

    // API
    // ===
    $(document)
        .on('click.cfw.button', '[data-cfw^="button"]', function(e) {
            var $btn = $(e.target).closest('.btn');

            Plugin.call($btn, 'toggle');

            if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
                // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
                e.preventDefault();
                // The target component still receive the focus
                if ($btn.is('input,button')) {
                    $btn.trigger('focus');
                } else {
                    $btn.find('input:visible,button:visible').first().trigger('focus');
                }
            }

            if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) {
                e.preventDefault();
            }
        })
        .on('focus.cfw.button blur.cfw.button', '[data-cfw^="button"]', function(e) {
            $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
        });

})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v2.0.0): lazy.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    var CFW_Widget_Lazy = function(element, options) {
        this.$element = $(element);
        this.$window = $(window);
        this.eventTypes = null;
        this.id = null;
        this.isLoading = null;

        this.settings = $.extend({}, CFW_Widget_Lazy.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Lazy.DEFAULTS = {
        throttle  : 250,        // Throttle speed to limit event firing
        trigger   : 'scroll resize',   // Events to trigger loading source
        delay     : 0,          // Delay before loading source
        effect    : 'show',     // jQuery effect to use for showing source (http://api.jquery.com/category/effects/)
        speed     : 0,          // Speed of effect (milliseconds)
        threshold : 0,          // Amount of pixels below viewport to triger show
        container : window,     // Where to watch for events
        invisible : false,       // Load sources that are not :visible
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

            this.id = this._getID(this.$element, 'cfw-lazy');

            // Bind events
            this.eventTypes = this.settings.trigger.split(' ');
            for (var i = this.eventTypes.length; i--;) {
                var eventType = this.eventTypes[i];
                if (eventType == 'scroll' || eventType == 'resize') {
                    $(this.settings.container).on(eventType + '.cfw.lazy.' + this.id, this._throttle($.proxy(this._handleTrigger, this), this.settings.throttle));
                    checkInitViewport = true;
                } else {
                    $(this.$element).on(eventType + '.cfw.lazy.' + this.id, $.proxy(this.show, this));
                }
            }

            this._trigger('init.cfw.lazy');

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
            if (this.settings.container === undefined || this.settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : this.$window.height()) + this.$window.scrollTop();
            } else {
                fold = $(this.settings.container).offset().top + $(this.settings.container).height();
            }
            return fold <= this.$element.offset().top - this.settings.threshold;
        },

        afterRight : function() {
            var fold;
            if (this.settings.container === undefined || this.settings.container === window) {
                fold = this.$window.width() + this.$window.scrollLeft();
            } else {
                fold = $(this.settings.container).offset().left + $(this.settings.container).width();
            }
            return fold <= this.$element.offset().left - this.settings.threshold;
        },

        aboveTop : function() {
            var fold;
            if (this.settings.container === undefined || this.settings.container === window) {
                fold = this.$window.scrollTop();
            } else {
                fold = $(this.settings.container).offset().top;
            }
            return fold >= this.$element.offset().top + this.settings.threshold  + this.$element.height();
        },

        beforeLeft: function() {
            var fold;
            if (this.settings.container === undefined || this.settings.container === window) {
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
                $selfRef._trigger('afterShow.cfw.lazy');
            }, this.settings.speed);

            // Unbind events and unset data
            $(this.settings.container).off('.cfw.lazy.' + this.id);
            this.$element.off('.cfw.lazy.' + this.id)
                .removeData('cfw.lazy')
                .removeAttr('data-cfw');
        },

        show : function() {
            var $selfRef = this;
            if (this.isLoading) { return; }

            if (!this._trigger('beforeShow.cfw.lazy')) {
                return;
            }

            this.isLoading = true;

            setTimeout(function() {
                $selfRef.loadSrc();
            }, this.settings.delay);
        },

        _handleTrigger : function() {
            if (this.inViewport()) { this.show(); }
        },

        _throttle : function(fn, threshhold, scope) {
            /* From: http://remysharp.com/2010/07/21/throttling-function-calls/ */
            threshhold || (threshhold = 250);
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
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwLazySrc       !== 'undefined') { parsedData.src       = data.cfwLazySrc;       }
            if (typeof data.cfwLazyThrottle  !== 'undefined') { parsedData.throttle  = data.cfwLazyThrottle;  }
            if (typeof data.cfwLazyTrigger   !== 'undefined') { parsedData.trigger   = data.cfwLazyTrigger;   }
            if (typeof data.cfwLazyDelay     !== 'undefined') { parsedData.delay     = data.cfwLazyDelay;     }
            if (typeof data.cfwLazyEffect    !== 'undefined') { parsedData.effect    = data.cfwLazyEffect;    }
            if (typeof data.cfwLazySpeed     !== 'undefined') { parsedData.speed     = data.cfwLazySpeed;     }
            if (typeof data.cfwLazyThreshold !== 'undefined') { parsedData.threshold = data.cfwLazyThreshold; }
            if (typeof data.cfwLazyContainer !== 'undefined') { parsedData.container = data.cfwLazyContainer; }
            if (typeof data.cfwLazyInvisible !== 'undefined') { parsedData.invisible = data.cfwLazyInvisible; }

            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): slider.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if (!$.fn.CFW_Drag) throw new Error('CFW_Slider requires CFW_Drag');

    var CFW_Widget_Slider = function(element, options) {
        this.$element = $(element);

        this.$slider = null;
        this.$sliderTrack = null;
        this.$sliderTrackSelection = null;
        this.$sliderThumbMin = null;
        this.$sliderThumbMax = null;

        this.$inputMin = null;
        this.inputMinID = '';
        this.inputMinLabelID = '';
        this.inputMinLabelTxt = '';

        this.$inputMax = null;
        this.inputMaxID = '';
        this.inputMaxLabelID = '';
        this.inputMaxLabelTxt = '';

        this.ordinal = false;
        this.range = false;

        this.val0 = 0;
        this.val1 = 0;

        this.settings = $.extend({}, CFW_Widget_Slider.DEFAULTS, this._parseDataAttr(), options);

        this.inDrag = null;
        this.startPos = null;
        this.offsetPos = (this.settings.vertical) ? 'top' : 'left';
        this.stepsTotal = null;

        this._init();
    };

    CFW_Widget_Slider.DEFAULTS = {
        min : null,             // min value
        max : null,             // max value
        step: 1,                // small step increment
        chunk: null,            // large step increment (will be auto determined if not defined)
        enabled : true,         // true - enabled / false - disabled
        vertical : false,       // alternate orientation
        reversed : false,       // show thumbs in opposite order

        // TODO
        tooltip : 'show'        // 'show,hide,always'
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

            this._trigger('init.cfw.slider');
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
            this.inputMinID = this._getID(this.$inputMin, 'cfw-slider');
            var $labelMin = this._getLabel(this.$inputMin);
            this.inputMinLabelID = this._getID($labelMin, 'cfw-slider');
            this.inputMinLabelTxt = $labelMin.text();

            if (this.$inputMin[0].nodeName == 'SELECT') { this.ordinal = true; }
            if ($inputs.length > 1) {
                this.$inputMax = $inputs.eq($inputs.length - 1);
                this.inputMaxID = this._getID(this.$inputMax, 'cfw-slider');
                var $labelMax = this._getLabel(this.$inputMax);
                this.inputMaxLabelID = this._getID($labelMax, 'cfw-slider');
                this.inputMaxLabelTxt = $labelMax.text();

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
            // var sliderID = this._getID(this.$slider, 'cfw-slider');

            /* Track elements */
            var sliderTrack = document.createElement('div');
            this.$sliderTrack = $(sliderTrack).addClass('slider-track');
            var sliderTrackSelection = document.createElement('div');
            this.$sliderTrackSelection = $(sliderTrackSelection).addClass('slider-selection');

            /* Thumb/handle elements */
            var sliderThumbMin = document.createElement('div');
            this.$sliderThumbMin = $(sliderThumbMin).addClass('slider-thumb slider-thumb-min')
                .attr({
                    'role': 'slider',
                    'tabindex': -1,
                    'aria-labelledby': this.inputMinLabelID
                });

            if (this.range) {
                var sliderThumbMax = document.createElement('div');
                this.$sliderThumbMax = $(sliderThumbMax).addClass('slider-thumb slider-thumb-max')
                    .attr({
                        'role': 'slider',
                        'tabindex': -1,
                        'aria-labelledby': this.inputMaxLabelID
                    });

                this.$sliderThumbMin.attr('aria-controls', this._getID(this.$sliderThumbMax, 'cfw-slider'));
                this.$sliderThumbMax.attr('aria-controls', this._getID(this.$sliderThumbMin, 'cfw-slider'));
            }

            // Attach elements together and insert
            this.$sliderTrack.append(this.$sliderTrackSelection);
            this.$sliderTrack.append(this.$sliderThumbMin);
            if (this.range) { this.$sliderTrack.append(this.$sliderThumbMax); }

            this.$slider.append(this.$sliderTrack);

            this.$element.append(this.$slider);
        },

        updateValues : function() {
            this.val0 = (this.ordinal) ? this.$inputMin[0].selectedIndex : parseFloat(this.$inputMin.val());
            if (!this.range) {
                this.$sliderThumbMin.attr({
                    'aria-valuemin': this.settings.min,
                    'aria-valuemax': this.settings.max,
                    'aria-valuenow': this.val0
                });
            } else {
                this.val1 = (this.ordinal) ? this.$inputMax[0].selectedIndex : parseFloat(this.$inputMax.val());
                this.$sliderThumbMin.attr({
                    'aria-valuemin': this.settings.min,
                    'aria-valuemax': this.val1,
                    'aria-valuenow': this.val0
                });
                this.$sliderThumbMax.attr({
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
            this.$sliderTrackSelection.css({
                'top': '',
                'left': '',
                'width': '',
                'height': ''
            });
            this.$sliderThumbMin.css({
                'top': '',
                'left': ''
            });
            if (this.range) {
                this.$sliderThumbMax.css({
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

            this.$sliderTrackSelection.css(pos, selStart + '%').css(dim, pctSize + '%');
            if (!this.range) {
                this.$sliderThumbMin.css(pos, pctEnd + '%');
            } else {
                this.$sliderThumbMin.css(pos, pctStart + '%');
                this.$sliderThumbMax.css(pos, pctEnd + '%');
            }
        },

        updateLabels : function() {
            this.$sliderThumbMin.attr('aria-valuetext', this.inputMinLabelTxt + ' ' + this.$inputMin.val());
            if (this.range) {
                this.$sliderThumbMax.attr('aria-valuetext', this.inputMaxLabelTxt + ' ' + this.$inputMax.val());
            }
        },

        enable : function(init) {
            if (init === undefined) { init = false; }
            if (!init && this.settings.enabled) { return; }
            this.settings.enabled = true;
            this.$slider.removeClass('disabled');
            this.bindSlider();
            this._trigger('enabled.cfw.slider');
        },

        disable : function() {
            if (!this.settings.enabled) { return; }
            this.settings.enabled = false;
            this.$slider.addClass('disabled');
            this.unbindSlider();
            this._trigger('disabled.cfw.slider');
        },

        bindSlider : function() {
            var $selfRef = this;
            var $thumbs = this.$sliderThumbMin;
            var $inputs = this.$inputMin;
            if (this.range) {
                $thumbs = $thumbs.add(this.$sliderThumbMax);
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

            this.$sliderTrack
                .on('dragStart.cfw.drag', function(e) {
                    $selfRef._dragStart(e);
                })
                .on('drag.cfw.drag', function(e) {
                    $selfRef._drag(e);
                })
                .on('dragEnd.cfw.drag', function() {
                    $selfRef._dragEnd();
                });

            this.$sliderTrack.CFW_Drag();

            $inputs.on('change.cfw.slider', function() {
                var $node = $(this);
                var newVal = ($selfRef.ordinal) ? $node[0].selectedIndex : parseFloat($node.val());
                $selfRef.changeValue(newVal, $node, true);
            });
        },

        unbindSlider : function() {
            var $thumbs = this.$sliderThumbMin;
            var $inputs = this.$inputMin;
            if (this.range) {
                $thumbs = $thumbs.add(this.$sliderThumbMax);
                $inputs = $inputs.add(this.$inputMax);
            }
            $thumbs.attr('tabindex', '').off('.cfw.slider');
            this.$sliderTrack.CFW_Drag('destroy');
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
                this._trigger('slid.cfw.slider');
            }
            if (inputUpdate || (updVal != oldVal)) {
                this._trigger('changed.cfw.slider');
            }
        },

        _getInput : function(node) {
            var $node = $(node);
            if ($node.is(this.$sliderThumbMax)) {
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
            if ($node.is(this.$sliderTrack)) {
                $node = this._closestThumb(e);
            }
            $node.trigger('focus');

            this.inDrag = $node[0];

            var pos = this.settings.vertical ? e.startY : e.startX;
            var trackOff = this.$sliderTrack.offset();
            var newPos = pos - trackOff[this.offsetPos];
            this.startPos = newPos;

            var newVal = this._positionToValue(newPos);
            var $input = this._getInput($node[0]);
            this.changeValue(newVal, $input);

            this._trigger('dragStart.cfw.slider');
        },

        _drag : function(e) {
            if (this.startPos == null) { return; }
            var delta = this.settings.vertical ? e.deltaY : e.deltaX;
            var newPos = this.startPos + delta;
            var $input = this._getInput(this.inDrag);
            var newVal = this._positionToValue(newPos);
            this.changeValue(newVal, $input);
        },

        _dragEnd : function() {
            this.inDrag = null;
            this.startPos = null;
            this._trigger('dragEnd.cfw.slider');
        },

        _positionToValue : function(pos) {
            var trackDim;
            if (this.settings.vertical) {
                trackDim = this.$sliderTrack.outerHeight();
            } else {
                trackDim = this.$sliderTrack.outerWidth();
            }

            var ratio = trackDim / this.stepsTotal;

            pos = (this.settings.reversed) ? trackDim - pos : pos;
            return (Math.round(pos / ratio) * this.settings.step) + this.settings.min;
        },

        _closestThumb : function(e) {
            var $node;
            if (this.range) {
                var pos = this.settings.vertical ? e.pageY : e.pageX;
                var trackOff = this.$sliderTrack.offset();
                var diff1 = Math.abs(pos - trackOff[this.offsetPos] - this.$sliderThumbMin.position()[this.offsetPos]);
                var diff2 = Math.abs(pos - trackOff[this.offsetPos] - this.$sliderThumbMax.position()[this.offsetPos]);
                $node = (diff1 < diff2) ? this.$sliderThumbMin : this.$sliderThumbMax;
            } else {
                $node = this.$sliderThumbMin;
            }
            return $node;
        },

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();
            if (typeof data.cfwSliderMin        !== 'undefined') { parsedData.min       = data.cfwSliderMin;        }
            if (typeof data.cfwSliderMax        !== 'undefined') { parsedData.max       = data.cfwSliderMax;        }
            if (typeof data.cfwSliderStep       !== 'undefined') { parsedData.step      = data.cfwSliderStep;       }
            if (typeof data.cfwSliderChunk      !== 'undefined') { parsedData.chunk     = data.cfwSliderChunk;      }
            if (typeof data.cfwSliderVertical   !== 'undefined') { parsedData.vertical  = data.cfwSliderVertical;   }
            if (typeof data.cfwSliderReversed   !== 'undefined') { parsedData.reversed  = data.cfwSliderReversed;   }
            if (typeof data.cfwSliderEnabled    !== 'undefined') { parsedData.enabled   = data.cfwSliderEnabled;    }

            if (typeof data.cfwSliderTooltip    !== 'undefined') { parsedData.tooltip   = data.cfwSliderTooltip;    }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$slider.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): equalize.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// Significant portions borrowed from Foundation v5.5.2
// http://foundation.zurb.com/

(function($) {
    'use strict';

    var CFW_Widget_Equalize = function(element, options) {
        this.$element = $(element);
        this.$window = $(window);

        this.settings = $.extend({}, CFW_Widget_Equalize.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Equalize.DEFAULTS = {
        throttle : 250,     // Throttle speed to limit event firing
        stack    : false,   // Equalize items when stacked
        row      : false,   // Equalize items by row
        minimum  : false    // Use minimum height
    };

    CFW_Widget_Equalize.prototype = {
        _init : function() {
            this.$window.on('resize.cfw.equalize', this._throttle($.proxy(this.update, this), this.settings.throttle));

            this._trigger('init.cfw.equalize');
            this.update();
        },

        equalize : function(nest) {
            var $selfRef = this;
            var isStacked = false;
            var topOffset;

            // Drop out if nested, wait until descendants are done
            if (nest === undefined) {
                nest = false;
            }
            if (!nest && this.$element.find('[data-cfw="equalize"]').length > 0) {
                return;
            }
            if (!this._trigger('beforeEqual.cfw.equalize')) {
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
                    if (isStacked) {
                        return;
                    }
                }

                this._applyHeight($targetElm);
            }

            this._trigger('afterEqual.cfw.equalize');

            // Handle any nested equalize
            this.$element.parent().closest('[data-cfw="equalize"]').CFW_Equalize('update', true);
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
                $image.one('load', hasLoaded);

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

        _throttle : function(fn, threshhold, scope) {
            /* From: http://remysharp.com/2010/07/21/throttling-function-calls/ */
            threshhold || (threshhold = 250);
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
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwEqualizeTarget   !== 'undefined') { parsedData.target   = data.cfwEqualizeTarget;   }
            if (typeof data.cfwEqualizeThrottle !== 'undefined') { parsedData.throttle = data.cfwEqualizeThrottle; }
            if (typeof data.cfwEqualizeStack    !== 'undefined') { parsedData.stack    = data.cfwEqualizeStack;    }
            if (typeof data.cfwEqualizeRow      !== 'undefined') { parsedData.row      = data.cfwEqualizeRow;      }
            if (typeof data.cfwEqualizeMinimum  !== 'undefined') { parsedData.minimum  = data.cfwEqualizeMinimum;  }
            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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
 * Figuration (v2.0.0): player.js
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

        this.settings = $.extend({}, CFW_Widget_Player.DEFAULTS, this._parseDataAttr(), options);

        this._init();
    };

    CFW_Widget_Player.DEFAULTS = {
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
                this._trigger('noSupport.cfw.player');
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
                $selfRef.unplayedStatus();
            });
            this.$media.on('loadedmetadata loadeddata progress canplay canplaythrough timeupdate durationchange', function() {
                $selfRef.unplayedStatus();
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

            this._trigger('ready.cfw.player');

            // Handle element attributes
            if (this.media.autoplay) {
                this.media.play();
            }
        },

        error : function() {
            this._trigger('error.cfw.player');
        },

        toggle : function() {
            if (this.media.paused) {
                this.unplayedStatus(true);
                this.media.play();
            } else {
                this.media.pause();
            }
        },

        play : function() {
            this.unplayedStatus(true);
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

        unplayedStatus : function(force) {
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
                this._trigger('enterFullscreen.cfw.player');
            } else {
                $fullElm.removeClass('active');
                this.$element.removeClass('player-fulldisplay');
                this._trigger('exitFullscreen.cfw.player');
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
                var menuID = this._getID($menu, 'cfw-player');

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
                var menuID = this._getID($menu, 'cfw-player');

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
                    $menuItem = $('<li role="separator" class="divider"></li>');
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
                if (!this._trigger('beforeTranscriptHide.cfw.player')) {
                    return;
                }
            } else {
                if (!this._trigger('beforeTranscriptShow.cfw.player')) {
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
                this._trigger('afterTranscriptHide.cfw.player');
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

            this._trigger('afterTranscriptShow.cfw.player');
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

        _getID : function($node, prefix) {
            var nodeID = $node.attr('id');
            if (nodeID === undefined) {
                do nodeID = prefix + '-' + ~~(Math.random() * 1000000);
                while (document.getElementById(nodeID));
                $node.attr('id', nodeID);
            }
            return nodeID;
        },

        _parseDataAttr : function() {
            var parsedData = {};
            var data = this.$element.data();

            if (typeof data.cfwPlayerSrc              !== 'undefined') { parsedData.src              = data.cfwPlayerSrc;              }
            if (typeof data.cfwPlayerTranscript       !== 'undefined') { parsedData.transcript       = data.cfwPlayerTranscript;       }
            if (typeof data.cfwPlayerTranscriptScroll !== 'undefined') { parsedData.transcriptScroll = data.cfwPlayerTranscriptScroll; }
            if (typeof data.cfwPlayerTranscriptOption !== 'undefined') { parsedData.transcriptOption = data.cfwPlayerTranscriptOption; }

            return parsedData;
        },

        _trigger : function(eventName) {
            var e = $.Event(eventName);
            this.$media.trigger(e);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return true;
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

    /*
    // API
    // ===
    $(window).ready(function() {
        if (typeof CFW_API === 'undefined' || CFW_API !== false) {
            $('[data-cfw="player"]').each(function() {
                $(this).CFW_Player();
            });
        }
    });
    */
})(jQuery);

/**
 * --------------------------------------------------------------------------
 * Figuration (v2.0.0): common.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    $.fn.CFW_Init = function() {
        var $scope = $(this);
        if (!$scope) { $scope = $(document.body); }

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
