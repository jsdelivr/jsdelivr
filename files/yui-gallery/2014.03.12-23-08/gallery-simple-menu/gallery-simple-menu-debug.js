YUI.add('gallery-simple-menu', function(Y) {

/*
 * Copyright (c) 2010 Julien Lecomte. All rights reserved.
 * http://www.julienlecomte.net/
 */

/**
 * Simple Menu plugin.
 * @module simple-menu
 */

var ACTIVE_CLASS_NAME = 'menu-active',
    VISIBLE_CLASS_NAME = 'menu-visible',
    ARIA_ROLE = 'role',
    ARIA_HIDDEN = 'aria-hidden',
    MENU_OPEN = 0,
    MENU_CLOSED = 1,
    DISMISS_EVENT = (Y.config.win.hasOwnProperty &&
        Y.config.win.hasOwnProperty('ontouchstart')) ?
            'touchstart' : 'mousedown';

function SimpleMenu(config) {
    this._link = config.host;
    this._menu = this._link.next();

    // Set ARIA attributes

    this._link.set('aria-haspopup', 'true');

    this._menu.setAttrs({
        'role': 'menu',
        'aria-labelledby': this._link.getAttribute('id'),
        'aria-hidden': 'true'
    });

    this._menu.all('ul,li').set(ARIA_ROLE, 'presentation');
    this._menu.all('a').set(ARIA_ROLE, 'menuitem');

    // Setup keyboard navigation.

    this._menu.plug(Y.Plugin.NodeFocusManager, {
        descendants: 'a',
        keys: (Y.UA.gecko ? { previous: 'press:38', next: 'press:40' } :
                { previous: 'down:38', next: 'down:40' })
    });

    // Open/close the menu.

    this._link.on('click', function (e) {
        e.halt();
        this.toggle();
    }, this);

    this._menu.on('keydown', function (e) {
        if (e.keyCode === 27) {
            /* Esc */
            e.halt();
            this.hide();
        }
    }, this);

    Y.one(document).on(DISMISS_EVENT, function (e) {
        var target = e.target;

        if (target !== this._link && !this._menu.contains(target)) {
            this.hide();
        }
    }, this);
}

SimpleMenu.prototype = {

    _state: MENU_CLOSED,

    show: function () {
        if (this._state !== MENU_OPEN) {
            this._link.addClass(ACTIVE_CLASS_NAME);
            this._menu.addClass(VISIBLE_CLASS_NAME);
            this._menu.set(ARIA_HIDDEN, false);
            this._menu.focusManager.focus();
            this._state = MENU_OPEN;
        }
    },

    hide: function () {
        if (this._state !== MENU_CLOSED) {
            this._link.removeClass(ACTIVE_CLASS_NAME);
            this._menu.removeClass(VISIBLE_CLASS_NAME);
            this._menu.set(ARIA_HIDDEN, true);
            this._link.focus();
            this._state = MENU_CLOSED;
        }
    },

    toggle: function () {
        this[this._state === MENU_CLOSED ? 'show' : 'hide']();
    }
};

SimpleMenu.NAME = 'SimpleMenu';
SimpleMenu.NS = 'simplemenu';

Y.namespace('Plugin').SimpleMenu = SimpleMenu;


}, 'gallery-2012.07.11-21-38' ,{requires:['node-focusmanager']});
