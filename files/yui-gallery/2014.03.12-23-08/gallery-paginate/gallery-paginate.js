YUI.add('gallery-paginate', function(Y) {

"use strict";

var getCN = Y.ClassNameManager.getClassName,
    NAME = 'paginate',
    CLASS_LINK = getCN(NAME, 'link'),
    CLASS_PAGES = getCN(NAME, 'pages'),
    CLASS_PAGE = getCN(NAME, 'page'),
    CLASS_ON = getCN(NAME, 'on'),
    CLASS_PAGEOF = getCN(NAME, 'page-of'),
    CLASS_NEXT = getCN(NAME, 'next'),
    CLASS_PREV = getCN(NAME, 'previous'),
    CLASS_LAST = getCN(NAME, 'last'),
    CLASS_FIRST = getCN(NAME, 'first');
    
/**
* Similar to Y.Lang.isNumber, but allows numeric strings.  This is
* is used for attribute validation in conjunction with getters that return
* numbers.
*
* @method isNumeric
* @param v {Number|String} value to be checked for number or numeric string
* @returns {Boolean} true if the input is coercable into a finite number
* @static
*/
function isNumeric(v) {
    return isFinite(+v);
}

/**
* Return a number or null from input
*
* @method toNumber
* @param n {Number|String} a number or numeric string
* @return Number
* @static
*/
function toNumber(n) {
    return isFinite(+n) ? +n : null;
}
    

/**
 * The Paginate widget provides a set of controls to navigate through paged
 * data.
 *
 * To instantiate a Paginate, pass a configuration object to the contructor.
 * The configuration object should contain the following properties:
 * <ul>
 *   <li>recordsPerPage : <em>n</em> (int)</li>
 *   <li>recordsTotal : <em>n</em> (int or VALUE_UNLIMITED)</li>
 * </ul>
 *
 * @module gallery-paginate
 * @class Paginate
 * @constructor
 * @param config {Object} Object literal to set instance and ui component
 * configuration.
 */
function Paginate(config) {
    Paginate.superclass.constructor.call(this, config);
}

Paginate.NAME = "paginate";

Paginate.ATTRS = {
    /**
     * REQUIRED. Number of records constituting a &quot;page&quot;
     * @attribute recordsPerPage
     * @type integer
     */
    recordsPerPage: {
        value     : 0,
        validator : isNumeric,
        setter    : toNumber
    },

    /**
     * Total number of records to paginate through
     * @attribute recordsTotal
     * @type integer
     * @default 0
     */
    recordsTotal: {
        value     : 0,
        validator : isNumeric,
        setter    : toNumber
    },

    /**
     * Page to display on initial paint
     * @attribute currentPage
     * @type integer
     * @default 1
     */
    currentPage: {
        value     : 1,
        validator : isNumeric,
        setter    : toNumber
    },

    /**
     * Total pages
     * (shouldn't be externally set)
     * @attribute totalPages
     * @type integer
     * @default 0
     */    
    totalPages : {
        value : 0
    },

    /**
     * Loop the results
     * @attribute isCircular
     * @type boolean
     * @default false
     */
    isCircular : {
        value : false
    },

    /**
     * Should listen to vertical swipes
     * @attribute isVertical
     * @type boolean
     * @default false
     */
    isVertical : {
        value : false
    },

    /**
     * Template used to render controls.  The string will be used as
     * innerHTML on all specified container nodes.  Bracketed keys
     * (e.g. {pageLinks}) in the string will be replaced with an instance
     * of the so named ui component.
     * @attribute template
     * @type string
     */
    template: {
        value : "{FirstPageLink} {PreviousPageLink} {PageLinks} {PageOf} {PageItems} {NextPageLink} {LastPageLink}",
        validator : Y.Lang.isString
    }
};

// Instance members and methods
Y.Paginate = Y.extend(Paginate, Y.Widget, {

    initializer : function() {
        this.set("totalPages", Math.ceil(this.get('recordsTotal') / this.get('recordsPerPage')));
    },

    renderUI : function () {
        var t = this.get("template"),
            cp = this.get("currentPage"),
            p = [], l = [], i = 0, il = this.get("totalPages"), on;
        
        for (; i < il; i += 1) {
            on = (i + 1 === cp) ? ' ' + CLASS_ON : '';
            l[i] = '<a class="' + CLASS_LINK + ' ' + CLASS_PAGE + on +'" data-index="' + (i + 1) + '">' + (i + 1) + '</a> ';
            p[i] = '<a class="' + CLASS_PAGE + on + '">' + (i + 1) + '</a> ';
        }
        
        this.get("contentBox").setContent(Y.substitute(t, {
            'FirstPageLink' : '<a class="' + CLASS_LINK + ' ' + CLASS_FIRST + '">First</a>',
            'PreviousPageLink' : '<a class="' + CLASS_LINK + ' ' + CLASS_PREV + '">Previous</a>',
            'PageLinks' : '<span class="' + CLASS_PAGES + '">' + l.join(" ") + '</span>',
            'PageItems' : '<span class="' + CLASS_PAGES + '">' + p.join(" ") + '</span>',
            'PageOf' : '<a class="' + CLASS_PAGEOF + '">' + cp + " of " + il + '</a>',
            'NextPageLink' : '<a class="' + CLASS_LINK + ' ' + CLASS_NEXT + '">Next</a>',
            'LastPageLink' : '<a class="' + CLASS_LINK + ' ' + CLASS_LAST + '">Last</a>'
        }));
    },

    /**
     * Subscribes to instance attribute change events to automate certain
     * behaviors.
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        var self = this, 
            bb = self.get("boundingBox"), 
            cb = self.get("contentBox");
        //action listeners
        bb.on("flick", function (e) {
            if (e.flick.distance > 0) {
                self.getPreviousPage();
            } else {
                self.getNextPage();
            }
        }, {
            axis : (self.get("isVertical")) ? "y" : "x",
            minDistance:10,
            minVelocity:0.8
        });
        //stop it from highlighting the widget
        cb.on("mousedown", function (e) {
            e.preventDefault();
        });
        cb.delegate("click", self.getPreviousPage, "." + CLASS_LINK + "." + CLASS_PREV, self);
        cb.delegate("click", self.getNextPage, "." + CLASS_LINK + "." + CLASS_NEXT, self);
        cb.delegate("click", function() {
            self.getPage(Number(this.getAttribute("data-index")));
        }, "." + CLASS_LINK + "." + CLASS_PAGE);
        cb.delegate("click", Y.bind(self.getPage, self, 1), "." + CLASS_LINK + "." + CLASS_FIRST);
        cb.delegate("click", Y.bind(self.getPage, self, self.get("totalPages")), "." + CLASS_LINK + "." + CLASS_LAST);
        //internal change listeners
        self.after("recordsPerPageChange", self._recordsChange);
        self.after("recordsTotalChange", self._recordsChange);
        self.after("currentPageChange", self.syncUI);
    },

    /**
     * Syncs the UI after the render and bind
     * behaviors.
     * @method syncUI
     * @protected
     */
    syncUI : function () {
        this.renderUI();
    },
    
    getPage : function (p) {
        this.set("currentPage", p);
        return p;
    },

    /**
     * Get the page number of the next page
     * @method getNextPage
     * @return {number}
     */
    getNextPage : function () {
        var p = (this.hasNextPage()) ? this.get("currentPage") + 1 : (this.get("isCircular")) ? 1 : this.get("currentPage");
        this.set("currentPage", p);
        return p;
    },
    
    hasNextPage : function () {
        return (this.get("currentPage") < this.get("totalPages"));
    },

    /**
     * Get the page number of the previous page
     * @method getPreviousPage
     * @return {number}
     */
    getPreviousPage : function () {
        var p = (this.hasPreviousPage()) ? this.get("currentPage") - 1 : (this.get("isCircular")) ? this.get("totalPages") : 1;
        this.set("currentPage", p);
        return p;
    },
    
    hasPreviousPage : function () {
        return (this.get("currentPage") > 1);    
    },
    
    _recordsChange : function () {
        var self = this;
        self.initializer();
        self.renderUI();
    }
});


}, 'gallery-2011.06.29-23-18' ,{requires:['widget','event-flick','event','substitute']});
