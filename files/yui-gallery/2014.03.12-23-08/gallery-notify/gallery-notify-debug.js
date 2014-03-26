YUI.add('gallery-notify', function (Y, NAME) {

/**
 Displays a message similar to Growl in OSX that fade and disappear on using
 Timer so it can pause the timeout on mouse enter and resume on mouse leave.
 Contains two objects using the parent/child widget model.

 @module gallery-notify
 */
var EVENTS_INIT    = 'init',
    EVENTS_STARTED = 'started',
    YL = Y.Lang,
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX    = 'contentBox',
    ATTR_CLOSABLE = 'closable',
    ATTR_DEFAULT = 'default',
    ICON = 'icon',
    Notify,
    NotifyMessage;

/**
 @class Notify
 */
Notify = Y.Base.create('notify', Y.Widget, [Y.WidgetParent, Y.EventTarget], {
    /*
     Override default widget templates
     */
    CONTENT_TEMPLATE : '<ul/>',

    /**
     Initializer lifecycle implementation for the Notify class.
     Publishes events and subscribes
     to update after the status is changed. Builds initial child
     widget configuration

     @method initializer
     @param {Object} [config] Configuration object literal for
         the Notify
     */
    initializer : function() {
        this.publish(EVENTS_INIT, { broadcast:1 });
        this.publish(EVENTS_STARTED, { broadcast:1 });
        this.fire(EVENTS_INIT);
        this._buildChildConfig();
    },

    /**
     @method bindUI
     */
    bindUI: function () {
        this.after('addChild', this._updateVisibility, this);
        this.after('removeChild', this._updateVisibility, this);
    },

    /**
     Fires the 'started' event

     @method syncUI
     */
    syncUI : function() {
        this._updateVisibility();
        this.fire(EVENTS_STARTED);
    },

    /**
     Creates a new Message and appends at the specified index

     @method addMessage
     @param {String} msg Message to be displayed
     @param {String} [icon] Classification of message
     @param {Number} [index] Stack order
     @return {ArrayList} Y.ArrayList containing the successfully added
       Widget instance(s).  If no children where added, will return an empty
       Y.ArrayList instance.
     */
    addMessage : function(msg, icon, index) {
        var obj = msg;

        if(!icon) {
            icon = ATTR_DEFAULT;
        }

        if (typeof obj !== 'object') {
            obj = this._buildChildConfig(msg, icon);
        }

        if (index) {
            obj.index = index;
        }

        return this._addMessage(obj);
    },

    /**
     Allows for multiple messages to be added at one time

     @method addMessages
     @param {Array} messages
     @return {ArrayList} Y.ArrayList containing the successfully added
       Widget instance(s).  If no children where added, will return an empty
       Y.ArrayList instance.
     */
    addMessages : function(messages) {
        var msgs = [];

        Y.Array.each(messages, Y.bind(function (message) {
            msgs.push(this._addMessage(message));
        }, this));

        return new Y.ArrayList(msgs);
    },

    /**
     Closes all the notifications on the page

     @method closeAll
     @chainable
     */
    closeAll: function () {
        this.each(function (message) {
            message.close();
        });

        return this;
    },

    /**
     Sets visibility based on the number of items.

     @protected
     @method _updateVisibility
     */
    _updateVisibility: function () {
        this.set('visible', this.size() > 0);
    },

    /**

     @protected
     @method _addMessage
     @param {Object} message
     */
    _addMessage: function (message) {
        var index = message.index;

        this._mixInChildConfig(message);

        if(index) {
            return this.add(message, index);
        } else if(this.get('prepend')) {
            return this.add(message, 0);
        } else {
            return this.add(message);
        }
    },

    /**
     Populates the child config for new Message

     @protected
     @method _buildChildConfig
     @param {String} msg Message to be displayed
     @param {String} icon Classification of message
     */
    _buildChildConfig : function(msg, icon) {
        return {
            closable : this.get(ATTR_CLOSABLE),
            timeout : this.get('timeout'),
            flag: this.get('flag'),
            message : msg,
            icon : icon
        };
    },

    /**
     Mixes in the default configuration into the requested message

     @protected
     @method _minInChildConfig
     @param {Object} message
     */
    _mixInChildConfig: function (message) {
        return Y.mix(message, {
            closable: this.get(ATTR_CLOSABLE),
            timeout: this.get('timeout'),
            flag: this.get('flag')
        });
    },

    /**
     Returns a pointer to an object to be instantiated if the provided type is
     a string

     @protected
     @method _getConstructor
     @param {Object | String} type Type of Object to contruct. If `type` is a
       String, we assume it is a namespace off the Y object
     @return
     */
    _getConstructor: function (type) {
        return typeof type === 'string' ?
            Y.Object.getValue(Y, type.split('.')) :
            type;
    }

},{
    ATTRS : {
        /**
         Specifies if messages attached will have a close button

         @attribute closable
         @type {Boolean}
         @default true
         */
        closable : {
            value : true,
            validator : YL.isBoolean
        },

        /**
         Default child used when using builtin add() method

         @attribute defaultChildType
         @type {String | Y.WidgetChild}
         @default Y.Notify.Message
         */
        defaultChildType : {
            value : 'Notify.Message',
            setter: '_getConstructor'
        },

        /**
         Adds a class to the message for message type skinning

         @attribute flag
         @type {String}
         @default null
         */
        flag: {},

        /**
         Specified if new message should be added to the top of
         the message stack or the bottom.

         @attribute prepend
         @type {Boolean}
         @default false
         */
        prepend : {
            value : false,
            validator : YL.isBoolean
        },

        /**
         Time in milliseconds before new messages go away

         @attribute timeout
         @type {Number}
         @default 8000
         */
        timeout : {
            value : 8000
        }
    },
    /**
     Static property provides public access to registered notify
     event strings

     @property EVENTS
     @type {Object}
     @static
     */
    EVENTS: {
        INIT: EVENTS_INIT,
        STARTED: EVENTS_STARTED
    }
});


/**
 @class Notify.Message
 */
NotifyMessage = Y.Base.create('notify-message', Y.Widget, [Y.WidgetChild], {
    /*
     Override default widget templates
     */
    BOUNDING_TEMPLATE : '<li/>',

    CONTENT_TEMPLATE : '<div/>',

    /*
     Create default template for close button
     */
    CLOSE_TEMPLATE : '<span class="{class}">{label}</span>',

    /**
     @property
     @type {String}
     */
    closeClass: null,

    /**
     Internal timer used to pause timeout on mouseenter

     @property _timer
     @protected
     */
    _timer : null,

    /**
     Initializer lifecycle implementation for the Message class.
     Publishes events and subscribes
     to update after the status is changed. Sets the initial state
     to hidden so the notification can fade in.

     @method initializer
     @param {Object} [config] Configuration object literal for
         the Message
     */
    initializer : function(/* config */) {
        var bb = this.get(BOUNDING_BOX),
            flag = this.get('flag');

        this._initStrings();

        bb.setStyles(this.get('initStyle'));

        if (this.closeClass === null) {
            this.closeClass = this.getClassName('close');
        }

        if (flag) {
            bb.addClass(this.getClassName(flag));
        }
    },

    /**
     Creates the message. Appends the close box if is closable

     @method renderUI
     */
    renderUI : function() {
        var cb = this.get(CONTENT_BOX),
            bb = this.get(BOUNDING_BOX),
            closeBtn;

        cb.set('text', this.get('message'));

        if(this.get(ATTR_CLOSABLE)) {
            bb.addClass(this.getClassName(ATTR_CLOSABLE));
            closeBtn = this._buildCloseButton();

            bb.append(closeBtn);
        }
    },

    /**
     Binds the message hover and closable events

     @method bindUI
     */
    bindUI : function() {
        this._bindHover();

        this.get(BOUNDING_BOX).delegate('click', this.close, '.' + this.closeClass, this);
    },

    /**
     Creates a new timer to make the message disappear and
     fades in the message

     @method syncUI
     */
    syncUI : function() {
        this.timer = new Y.Timer({
            length: this.get('timeout'),
            repeatCount: 1,
            callback: Y.bind(this.close, this)
        });

        this.get(BOUNDING_BOX).transition(this.get('transitionIn'), Y.bind(function() {
            this.timer.start();
        }, this));
    },

    /**
     Kills the timeout timer then animates the notification close and
     removes the widget from the window and parent container

     @method close
     */
    close : function() {
        if(this.timer) {
            this.timer.stop();
            this.timer = null;
        }

        var bb = this.get(BOUNDING_BOX);

        bb.transition(this.get('transitionOut'), Y.bind(function () {
            this.remove(true);
        }, this));
    },

    /**
     Binds mouseenter and mouseleave events to the message.
     Mouseenter will pause the timeout timer and mouseleave
     will restart it.

     @method _bindHover
     @protected
     */
    _bindHover : function() {
        var bb = this.get(BOUNDING_BOX);
        bb.on('mouseenter', Y.bind(this._onMouseEnter, this));

        bb.on('mouseleave', Y.bind(this._onMouseLeave, this));
    },

    /**
     Default mouse enter method. Pauses the timer that animates the message
     out of view

     @method _onMouseEnter
     @protected
     @param {EventFacade} [e]
     */
    _onMouseEnter: function (/* e */) {
        this.timer.pause();
    },

    /**
     Default mouse leave method. Resumes the timer that animates the message
     out of view

     @method _onMouseLeave
     @protected
     @param {EventFacade} [e]
     */
    _onMouseLeave: function (/* e */) {
        if(this.timer) {
            this.timer.resume();
        }
    },

    /**
     Returns a node that, when clicked on, closes the message

     @protected
     @method _buildCloseButton
     @return {Y.Node}
     */
    _buildCloseButton: function () {
        var strings = this.get('strings');

        return Y.Node.create(Y.Lang.sub(this.CLOSE_TEMPLATE, {
            'class': this.closeClass,
            'label': strings.close
        }));
    },

    /**
     Sets the icon to a default value if non is provided
     @protected
     @method _setIconFn
     @param {String} val
     */
    _setIconFn: function(val) {
        this.get(BOUNDING_BOX).replaceClass(
            this.getClassName(ICON, this.get(ICON) || ATTR_DEFAULT),
            this.getClassName(ICON, val || ATTR_DEFAULT)
        );
        return val;
    },

    /**
     Initializes strings used for internationalization
     @protected
     @method _initStrings
     */
    _initStrings: function () {
        // Not a valueFn because other class extensions may want to add to it
        this.set('strings', Y.mix((this.get('strings') || {}),
            Y.Intl.get('gallery-notify')));
    }

},{
    ATTRS : {
        /**
         A flag when set to true will allow
         a close button to be rendered in the message

         @attribute closable
         @type {Boolean}
         @default true
         */
        closable : {
            value : true,
            validator : YL.isBoolean
        },

        /**
         Adds a class to the message for message type skinning

         @attribute flag
         @type {String}
         @default null
         */
        flag: {},

        /**
         String that is to be displayed

         @attribute message
         @type {String}
         */
        message : {
            validator : YL.isString
        },

        /**
         Time in milliseconds before the message goes away

         @attribute timeout
         @type {Number}
         @default 8000
         */
        timeout : {
            value : 8000
        },

        /**
         Sets the icon of notification for styling

         @attribute icon
         @type {String}
         @default notice
         */
        icon : {
            validator : YL.isString,
            setter : '_setIconFn',
            lazyAdd : false
        },

        /**
         The object used to style the notification message initially

         @attritube iniStyle
         @type {Object}
         @default { opacity: 0 }
         */
        initStyle: {
            value: {
                opacity: 0
            }
        },

        /**
         @attribute strings
         @type {Object}
         @default null
         */
        strings: {},

        /**
         The object used to animate the notification in

         @attritube transitionIn
         @type {Object}
         @default { opacity: 1 }
         */
        transitionIn: {
            value: {
                opacity: 1
            }
        },

        /**
         The object used to animate the notification out

         @attritube transitionOut
         @type {Object}
         @default { opacity: 0 }
         */
        transitionOut: {
            value: {
                opacity: 0
            }
        }
    }
});

Y.Notify = Notify;
Y.Notify.Message = NotifyMessage;

}, 'gallery-2013.06.26-23-09', {
    "requires": [
        "base",
        "widget",
        "widget-parent",
        "widget-child",
        "intl",
        "event-mouseenter",
        "transition",
        "gallery-timer"
    ],
    "lang": [
        "en"
    ],
    "skinnable": true
});
