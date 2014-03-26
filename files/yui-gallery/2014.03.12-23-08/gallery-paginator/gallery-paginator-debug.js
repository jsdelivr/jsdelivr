YUI.add('gallery-paginator', function (Y, NAME) {

"use strict";
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The Paginator widget provides a set of controls to navigate through
 * paged data.
 * 
 * @module gallery-paginator
 */

/**
 * To instantiate a Paginator, pass a configuration object to the contructor.
 * The configuration object should contain the following properties:
 * <ul>
 *   <li>rowsPerPage : <em>n</em> (int)</li>
 *   <li>totalRecords : <em>n</em> (int or Paginator.VALUE_UNLIMITED)</li>
 * </ul>
 *
 * @class Paginator
 * @extends Widget
 * @constructor
 * @param config {Object} Object literal to set instance and ui component
 * configuration.
 */
function Paginator(config) {
    Paginator.superclass.constructor.call(this, config);
}


// Static members
Y.mix(Paginator, {
    NAME: "paginator",

    /**
     * Base of id strings used for ui components.
     * @static
     * @property Paginator.ID_BASE
     * @type string
     * @private
     */
    ID_BASE : 'yui-pg-',

    /**
     * Used to identify unset, optional configurations, or used explicitly in
     * the case of totalRecords to indicate unlimited pagination.
     * @static
     * @property Paginator.VALUE_UNLIMITED
     * @type number
     * @final
     */
    VALUE_UNLIMITED : -1,

    /**
     * Default template used by Paginator instances.  Update this if you want
     * all new Paginators to use a different default template.
     * @static
     * @property Paginator.TEMPLATE_DEFAULT
     * @type string
     */
    TEMPLATE_DEFAULT : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}",

    /**
     * Common alternate pagination format, including page links, links for
     * previous, next, first and last pages as well as a rows-per-page
     * dropdown.  Offered as a convenience.
     * @static
     * @property Paginator.TEMPLATE_ROWS_PER_PAGE
     * @type string
     */
    TEMPLATE_ROWS_PER_PAGE : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}",

    /**
     * Storage object for UI Components
     * @static
     * @property Paginator.ui
     */
    ui : {},

    /**
     * Similar to Y.Lang.isNumber, but allows numeric strings.  This is
     * is used for attribute validation in conjunction with getters that return
     * numbers.
     *
     * @method Paginator.isNumeric
     * @param v {Number|String} value to be checked for number or numeric string
     * @return {Boolean} true if the input is coercable into a finite number
     * @static
     */
    isNumeric : function (v) {
        return isFinite(+v);
    },

    /**
     * Return a number or null from input
     *
     * @method Paginator.toNumber
     * @param n {Number|String} a number or numeric string
     * @return Number
     * @static
     */
    toNumber : function (n) {
        return isFinite(+n) ? +n : null;
    }

},true);


Paginator.ATTRS =
{
    /**
     * REQUIRED. Number of records constituting a &quot;page&quot;
     * @attribute rowsPerPage
     * @type integer
     */
    rowsPerPage: {
        value     : 0,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Total number of records to paginate through
     * @attribute totalRecords
     * @type integer
     * @default 0
     */
    totalRecords: {
        value     : 0,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Zero based index of the record considered first on the current page.
     * For page based interactions, don't modify this attribute directly;
     * use setPage(n).
     * @attribute recordOffset
     * @type integer
     * @default 0
     */
    recordOffset: {
        value     : 0,
        validator : function (val) {
            var total = this.get('totalRecords');
            if (Paginator.isNumeric(val)) {
                val = +val;
                return total === Paginator.VALUE_UNLIMITED || total > val ||
                       (total === 0 && val === 0);
            }

            return false;
        },
        setter    : Paginator.toNumber
    },

    /**
     * Page to display on initial paint
     * @attribute initialPage
     * @type integer
     * @default 1
     */
    initialPage: {
        value     : 1,
        validator : Paginator.isNumeric,
        setter    : Paginator.toNumber
    },

    /**
     * Template used to render controls.  The string will be used as
     * innerHTML on all specified container nodes.  Bracketed keys
     * (e.g. {pageLinks}) in the string will be replaced with an instance
     * of the so named ui component.
     * @see Paginator.TEMPLATE_DEFAULT
     * @see Paginator.TEMPLATE_ROWS_PER_PAGE
     * @attribute template
     * @type string
     */
    template: {
        value : Paginator.TEMPLATE_DEFAULT,
        validator : Y.Lang.isString
    },

    /**
     * Display pagination controls even when there is only one page.  Set
     * to false to forgo rendering and/or hide the containers when there
     * is only one page of data.  Note if you are using the rowsPerPage
     * dropdown ui component, visibility will be maintained as long as the
     * number of records exceeds the smallest page size.
     * @attribute alwaysVisible
     * @type boolean
     * @default true
     */
    alwaysVisible: {
        value : true,
        validator : Y.Lang.isBoolean
    },

    // Read only attributes

    /**
     * Unique id assigned to this instance
     * @attribute id
     * @type integer
     * @final
     */
    id: {
        value    : Y.guid(),
        readOnly : true
    }
};


/**
 * Event fired when a change in pagination values is requested,
 * either by interacting with the various ui components or via the
 * setStartIndex(n) etc APIs.
 * Subscribers will receive the proposed state as the first parameter.
 * The proposed state object will contain the following keys:
 * <ul>
 *   <li>paginator - the Paginator instance</li>
 *   <li>page</li>
 *   <li>totalRecords</li>
 *   <li>recordOffset - index of the first record on the new page</li>
 *   <li>rowsPerPage</li>
 *   <li>records - array containing [start index, end index] for the records on the new page</li>
 *   <li>before - object literal with all these keys for the current state</li>
 * </ul>
 * @event changeRequest
 */

/**
 * Event fired when attribute changes have resulted in the calculated
 * current page changing.
 * @event pageChange
 */


// Instance members and methods
Y.extend(Paginator, Y.Widget,
{
    // Instance members

    /**
     * Flag used to indicate multiple attributes are being updated via setState
     * @property _batch
     * @type boolean
     * @protected
     */
    _batch : false,

    /**
     * Used by setState to indicate when a page change has occurred
     * @property _pageChanged
     * @type boolean
     * @protected
     */
    _pageChanged : false,

    /**
     * Temporary state cache used by setState to keep track of the previous
     * state for eventual pageChange event firing
     * @property _state
     * @type Object
     * @protected
     */
    _state : null,


    // Instance methods

    initializer : function(config) {
        var UNLIMITED = Paginator.VALUE_UNLIMITED,
            initialPage, records, perPage, startIndex;

        this._selfSubscribe();

        // Calculate the initial record offset
        initialPage = this.get('initialPage');
        records     = this.get('totalRecords');
        perPage     = this.get('rowsPerPage');
        if (initialPage > 1 && perPage !== UNLIMITED) {
            startIndex = (initialPage - 1) * perPage;
            if (records === UNLIMITED || startIndex < records) {
                this.set('recordOffset',startIndex);
            }
        }
    },

    /**
     * Subscribes to instance attribute change events to automate certain
     * behaviors.
     * @method _selfSubscribe
     * @protected
     */
    _selfSubscribe : function () {
        // Listen for changes to totalRecords and alwaysVisible 
        this.after('totalRecordsChange',this.updateVisibility,this);
        this.after('alwaysVisibleChange',this.updateVisibility,this);

        // Fire the pageChange event when appropriate
        this.after('totalRecordsChange',this._handleStateChange,this);
        this.after('recordOffsetChange',this._handleStateChange,this);
        this.after('rowsPerPageChange',this._handleStateChange,this);

        // Update recordOffset when totalRecords is reduced below
        this.after('totalRecordsChange',this._syncRecordOffset,this);
    },

    renderUI : function () {
        this._renderTemplate(
            this.get('contentBox'),
            this.get('template'),
            Paginator.ID_BASE + this.get('id'),
            true);

        // Show the widget if appropriate
        this.updateVisibility();
    },

    /**
     * Creates the individual ui components and renders them into a container.
     *
     * @method _renderTemplate
     * @param container {HTMLElement} where to add the ui components
     * @param template {String} the template to use as a guide for rendering
     * @param id_base {String} id base for the container's ui components
     * @param hide {Boolean} leave the container hidden after assembly
     * @protected
     */
    _renderTemplate : function (container, template, id_base, hide) {
        if (!container) {
            return;
        }

        // Hide the container while its contents are rendered
        container.setStyle('display','none');

        container.addClass(this.getClassName());

        var className = this.getClassName('ui');

        // Place the template innerHTML, adding marker spans to the template
        // html to indicate drop zones for ui components
        container.set('innerHTML', template.replace(/\{([a-z0-9_ \-]+)\}/gi,
            '<span class="'+className+' '+className+'-$1"></span>'));

        // Replace each marker with the ui component's render() output
        container.all('span.'+className).each(function(node)
        {
            this.renderUIComponent(node, id_base);
        },
        this);

        if (!hide) {
            // Show the container allowing page reflow
            container.setStyle('display','');
        }
    },

    /**
     * Replaces a marker node with a rendered UI component, determined by the
     * yui-paginator-ui-(UI component class name) in the marker's className. e.g.
     * yui-paginator-ui-PageLinks => new Y.Paginator.ui.PageLinks(this)
     *
     * @method renderUIComponent
     * @param marker {HTMLElement} the marker node to replace
     * @param id_base {String} string base the component's generated id
     */
    renderUIComponent : function (marker, id_base) {
        var par    = marker.get('parentNode'),
            clazz  = this.getClassName('ui'),
            name   = new RegExp(clazz+'-(\\w+)').exec(marker.get('className')),
            UIComp = name && Paginator.ui[name[1]],
            comp;

        if (Y.Lang.isFunction(UIComp)) {
            comp = new UIComp(this);
            if (Y.Lang.isFunction(comp.render)) {
                par.replaceChild(comp.render(id_base),marker);
            }
        }
    },

    /**
     * Hides the widget if there is only one page of data and attribute
     * alwaysVisible is false.  Conversely, it displays the widget if either
     * there is more than one page worth of data or alwaysVisible is turned on.
     * @method updateVisibility
     */
    updateVisibility : function (e) {
        var alwaysVisible = this.get('alwaysVisible'),
            totalRecords,visible,rpp,rppOptions,i,len,rppOption,rppValue;

        if (!e || e.type === 'alwaysVisibleChange' || !alwaysVisible) {
            totalRecords = this.get('totalRecords');
            visible      = true;
            rpp          = this.get('rowsPerPage');
            rppOptions   = this.get('rowsPerPageOptions');

            if (Y.Lang.isArray(rppOptions)) {
                for (i = 0, len = rppOptions.length; i < len; ++i) {
                    rppOption = rppOptions[i];
                    rppValue  = Y.Lang.isValue(rppOption.value) ? rppOption.value : rppOption;
                    rpp       = Math.min(rpp,rppValue);
                }
            }

            if (totalRecords !== Paginator.VALUE_UNLIMITED &&
                totalRecords <= rpp) {
                visible = false;
            }

            visible = visible || alwaysVisible;
            this.get('contentBox').setStyle('display', visible ? '' : 'none');
        }
    },

    /**
     * Get the total number of pages in the data set according to the current
     * rowsPerPage and totalRecords values.  If totalRecords is not set, or
     * set to Y.Paginator.VALUE_UNLIMITED, returns Y.Paginator.VALUE_UNLIMITED.
     * @method getTotalPages
     * @return {number}
     */
    getTotalPages : function () {
        var records = this.get('totalRecords'),
            perPage = this.get('rowsPerPage');

        // rowsPerPage not set.  Can't calculate
        if (!perPage) {
            return null;
        }

        if (records === Paginator.VALUE_UNLIMITED) {
            return Paginator.VALUE_UNLIMITED;
        }

        return Math.ceil(records/perPage);
    },

    /**
     * Does the requested page have any records?
     * @method hasPage
     * @param page {number} the page in question
     * @return {boolean}
     */
    hasPage : function (page) {
        if (!Y.Lang.isNumber(page) || page < 1) {
            return false;
        }

        var totalPages = this.getTotalPages();

        return (totalPages === Paginator.VALUE_UNLIMITED || totalPages >= page);
    },

    /**
     * Get the page number corresponding to the current record offset.
     * @method getCurrentPage
     * @return {number}
     */
    getCurrentPage : function () {
        var perPage = this.get('rowsPerPage');
        if (!perPage || !this.get('totalRecords')) {
            return 0;
        }
        return Math.floor(this.get('recordOffset') / perPage) + 1;
    },

    /**
     * Are there records on the next page?
     * @method hasNextPage
     * @return {boolean}
     */
    hasNextPage : function () {
        var currentPage = this.getCurrentPage(),
            totalPages  = this.getTotalPages();

        return currentPage && (totalPages === Paginator.VALUE_UNLIMITED || currentPage < totalPages);
    },

    /**
     * Get the page number of the next page, or null if the current page is the
     * last page.
     * @method getNextPage
     * @return {number}
     */
    getNextPage : function () {
        return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
    },

    /**
     * Is there a page before the current page?
     * @method hasPreviousPage
     * @return {boolean}
     */
    hasPreviousPage : function () {
        return (this.getCurrentPage() > 1);
    },

    /**
     * Get the page number of the previous page, or null if the current page
     * is the first page.
     * @method getPreviousPage
     * @return {number}
     */
    getPreviousPage : function () {
        return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
    },

    /**
     * Get the start and end record indexes of the specified page.
     * @method getPageRecords
     * @param [page] {number} The page (current page if not specified)
     * @return {Array} [start_index, end_index]
     */
    getPageRecords : function (page) {
        if (!Y.Lang.isNumber(page)) {
            page = this.getCurrentPage();
        }

        var perPage = this.get('rowsPerPage'),
            records = this.get('totalRecords'),
            start, end;

        if (!page || !perPage) {
            return null;
        }

        start = (page - 1) * perPage;
        if (records !== Paginator.VALUE_UNLIMITED) {
            if (start >= records) {
                return null;
            }
            end = Math.min(start + perPage, records) - 1;
        } else {
            end = start + perPage - 1;
        }

        return [start,end];
    },

    /**
     * Set the current page to the provided page number if possible.
     * @method setPage
     * @param newPage {number} the new page number
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setPage : function (page,silent) {
        if (this.hasPage(page) && page !== this.getCurrentPage()) {
            if (silent) {
                this.set('recordOffset', (page - 1) * this.get('rowsPerPage'));
            } else {
                this.fire('changeRequest',this.getState({'page':page}));
            }
        }
    },

    /**
     * Get the number of rows per page.
     * @method getRowsPerPage
     * @return {number} the current setting of the rowsPerPage attribute
     */
    getRowsPerPage : function () {
        return this.get('rowsPerPage');
    },

    /**
     * Set the number of rows per page.
     * @method setRowsPerPage
     * @param rpp {number} the new number of rows per page
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setRowsPerPage : function (rpp,silent) {
        if (Paginator.isNumeric(rpp) && +rpp > 0 &&
            +rpp !== this.get('rowsPerPage')) {
            if (silent) {
                this.set('rowsPerPage',rpp);
            } else {
                this.fire('changeRequest',
                    this.getState({'rowsPerPage':+rpp}));
            }
        }
    },

    /**
     * Get the total number of records.
     * @method getTotalRecords
     * @return {number} the current setting of totalRecords attribute
     */
    getTotalRecords : function () {
        return this.get('totalRecords');
    },

    /**
     * Set the total number of records.
     * @method setTotalRecords
     * @param total {number} the new total number of records
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setTotalRecords : function (total,silent) {
        if (Paginator.isNumeric(total) && +total >= 0 &&
            +total !== this.get('totalRecords')) {
            if (silent) {
                this.set('totalRecords',total);
            } else {
                this.fire('changeRequest',
                    this.getState({'totalRecords':+total}));
            }
        }
    },

    /**
     * Get the index of the first record on the current page
     * @method getStartIndex
     * @return {number} the index of the first record on the current page
     */
    getStartIndex : function () {
        return this.get('recordOffset');
    },

    /**
     * Move the record offset to a new starting index.  This will likely cause
     * the calculated current page to change.  You should probably use setPage.
     * @method setStartIndex
     * @param offset {number} the new record offset
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setStartIndex : function (offset,silent) {
        if (Paginator.isNumeric(offset) && +offset >= 0 &&
            +offset !== this.get('recordOffset')) {
            if (silent) {
                this.set('recordOffset',offset);
            } else {
                this.fire('changeRequest',
                    this.getState({'recordOffset':+offset}));
            }
        }
    },

    /**
     * Get an object literal describing the current state of the paginator.  If
     * an object literal of proposed values is passed, the proposed state will
     * be returned as an object literal with the following keys:
     * <ul>
     * <li>paginator - instance of the Paginator</li>
     * <li>page - number</li>
     * <li>totalRecords - number</li>
     * <li>recordOffset - number</li>
     * <li>rowsPerPage - number</li>
     * <li>records - [ start_index, end_index ]</li>
     * <li>before - (OPTIONAL) { state object literal for current state }</li>
     * </ul>
     * @method getState
     * @return {object}
     * @param changes {object} OPTIONAL object literal with proposed values
     * Supported change keys include:
     * <ul>
     * <li>rowsPerPage</li>
     * <li>totalRecords</li>
     * <li>recordOffset OR</li>
     * <li>page</li>
     * </ul>
     */
    getState : function (changes) {
        var UNLIMITED = Paginator.VALUE_UNLIMITED,
            M = Math, max = M.max, ceil = M.ceil,
            currentState, state, offset;

        function normalizeOffset(offset,total,rpp) {
            if (offset <= 0 || total === 0) {
                return 0;
            }
            if (total === UNLIMITED || total > offset) {
                return offset - (offset % rpp);
            }
            return total - (total % rpp || rpp);
        }

        currentState = {
            paginator    : this,
            totalRecords : this.get('totalRecords'),
            rowsPerPage  : this.get('rowsPerPage'),
            records      : this.getPageRecords()
        };
        currentState.recordOffset = normalizeOffset(
                                        this.get('recordOffset'),
                                        currentState.totalRecords,
                                        currentState.rowsPerPage);
        currentState.page = ceil(currentState.recordOffset /
                                 currentState.rowsPerPage) + 1;

        if (!changes) {
            return currentState;
        }

        state = {
            paginator    : this,
            before       : currentState,

            rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,
            totalRecords : (Paginator.isNumeric(changes.totalRecords) ?
                                max(changes.totalRecords,UNLIMITED) :
                                +currentState.totalRecords)
        };

        if (state.totalRecords === 0) {
            state.recordOffset =
            state.page         = 0;
        } else {
            offset = Paginator.isNumeric(changes.page) ?
                        (changes.page - 1) * state.rowsPerPage :
                        Paginator.isNumeric(changes.recordOffset) ?
                            +changes.recordOffset :
                            currentState.recordOffset;

            state.recordOffset = normalizeOffset(offset,
                                    state.totalRecords,
                                    state.rowsPerPage);

            state.page = ceil(state.recordOffset / state.rowsPerPage) + 1;
        }

        state.records = [ state.recordOffset,
                          state.recordOffset + state.rowsPerPage - 1 ];

        // limit upper index to totalRecords - 1
        if (state.totalRecords !== UNLIMITED &&
            state.recordOffset < state.totalRecords && state.records &&
            state.records[1] > state.totalRecords - 1) {
            state.records[1] = state.totalRecords - 1;
        }

        return state;
    },

    /**
     * Convenience method to facilitate setting state attributes rowsPerPage,
     * totalRecords, recordOffset in batch.  Also supports calculating
     * recordOffset from state.page if state.recordOffset is not provided.
     * Fires only a single pageChange event, if appropriate.
     * This will not fire a changeRequest event.
     * @method setState
     * @param state {Object} Object literal of attribute:value pairs to set
     */
    setState : function (state) {
        if (Y.Lang.isObject(state)) {
            // get flux state based on current state with before state as well
            this._state = this.getState({});

            // use just the state props from the input obj
            state = {
                page         : state.page,
                rowsPerPage  : state.rowsPerPage,
                totalRecords : state.totalRecords,
                recordOffset : state.recordOffset
            };

            // calculate recordOffset from page if recordOffset not specified.
            // not using Y.Lang.isNumber for support of numeric strings
            if (state.page && state.recordOffset === undefined) {
                state.recordOffset = (state.page - 1) *
                    (state.rowsPerPage || this.get('rowsPerPage'));
            }

            this._batch = true;
            this._pageChanged = false;

            for (var k in state) {
                if (state.hasOwnProperty(k)) {
                    this.set(k,state[k]);
                }
            }

            this._batch = false;
            
            if (this._pageChanged) {
                this._pageChanged = false;

                this._firePageChange(this.getState(this._state));
            }
        }
    },

    /**
     * Sets recordOffset to the starting index of the previous page when
     * totalRecords is reduced below the current recordOffset.
     * @method _syncRecordOffset
     * @param e {Event} totalRecordsChange event
     * @protected
     */
    _syncRecordOffset : function (e) {
        var v = e.newVal,rpp,state;
        if (e.prevVal !== v) {
            if (v !== Paginator.VALUE_UNLIMITED) {
                rpp = this.get('rowsPerPage');

                if (rpp && this.get('recordOffset') >= v) {
                    state = this.getState({
                        totalRecords : e.prevVal,
                        recordOffset : this.get('recordOffset')
                    });

                    this.set('recordOffset', state.before.recordOffset);
                    this._firePageChange(state);
                }
            }
        }
    },

    /**
     * Fires the pageChange event when the state attributes have changed in
     * such a way as to locate the current recordOffset on a new page.
     * @method _handleStateChange
     * @param e {Event} the attribute change event
     * @protected
     */
    _handleStateChange : function (e) {
        if (e.prevVal !== e.newVal) {
            var change = this._state || {},
                state;

            change[e.type.replace(/^.+?:/,'').replace(/Change$/,'')] = e.prevVal;
            state = this.getState(change);

            if (state.page !== state.before.page) {
                if (this._batch) {
                    this._pageChanged = true;
                } else {
                    this._firePageChange(state);
                }
            }
        }
    },

    /**
     * Fires a pageChange event in the form of a standard attribute change
     * event with additional properties prevState and newState.
     * @method _firePageChange
     * @param state {Object} the result of getState(oldState)
     * @protected
     */
    _firePageChange : function (state) {
        if (Y.Lang.isObject(state)) {
            var current = state.before;
            delete state.before;
            this.fire('pageChange',{
                type      : 'pageChange',
                prevVal   : state.page,
                newVal    : current.page,
                prevState : state,
                newState  : current
            });
        }
    }
});

Y.Paginator = Paginator;
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * Generates an input field for setting the current page.
 *
 * @class Paginator.ui.CurrentPageInput
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.CurrentPageInput = function(
	/* Paginator */	p)
{
	this.paginator = p;

	p.on('destroy',               this.destroy, this);
	p.after('recordOffsetChange', this.update,  this);
	p.after('rowsPerPageChange',  this.update,  this);
	p.after('totalRecordsChange', this.update,  this);
	p.after('disabledChange',     this.update,  this);

	p.after('pageInputClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute pageInputClass
 * @default 'yui-paginator-page-input'
 */
Paginator.ATTRS.pageInputClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page-input'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute pageInputTemplate
 * @default '{currentPage} of {totalPages}'
 */
Paginator.ATTRS.pageInputTemplate =
{
	value : '{currentPage} of {totalPages}',
	validator : Y.Lang.isString
};

Paginator.ui.CurrentPageInput.prototype =
{
	/**
	 * Removes the span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		this.span.remove().destroy(true);
		this.span       = null;
		this.input      = null;
		this.page_count = null;
	},

	/**
	 * Generate the nodes and return the appropriate node given the current
	 * pagination state.
	 * @method render
	 * @param id_base {string} used to create unique ids for generated nodes
	 * @return {HTMLElement}
	 */
	render: function(
		id_base)
	{
		if (this.span) {
			this.span.remove().destroy(true);
		}

		this.span = Y.Node.create(
			'<span id="'+id_base+'-page-input">' +
			Y.substitute(this.paginator.get('pageInputTemplate'),
			{
				currentPage: '<input class="yui-page-input"></input>',
				totalPages:  '<span class="yui-page-count"></span>'
			}) +
			'</span>');
		this.span.set('className', this.paginator.get('pageInputClass'));

		this.input = this.span.one('input');
		this.input.on('change', this._onChange, this);
		this.input.on('key', this._onReturnKey, 'down:13', this);

		this.page_count = this.span.one('span.yui-page-count');

		this.update();

		return this.span;
	},

	/**
	 * Swap the link and span nodes if appropriate.
	 * @method update
	 * @param e {CustomEvent} The calling change event
	 */
	update: function(
		/* CustomEvent */ e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		this.span.set('className', this.paginator.get('pageInputClass'));
		this.input.set('value', this.paginator.getCurrentPage());
		this.input.set('disabled', this.paginator.get('disabled'));
		this.page_count.set('innerHTML', this.paginator.getTotalPages());
	},

	_onChange: function(e)
	{
		this.paginator.setPage(parseInt(this.input.get('value'), 10));
	},

	_onReturnKey: function(e)
	{
		e.halt(true);
		this.paginator.setPage(parseInt(this.input.get('value'), 10));
	}
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the textual report of current pagination status.
 * E.g. "Now viewing page 1 of 13".
 *
 * @class Paginator.ui.CurrentPageReport
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.CurrentPageReport = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange', this.update,this);
    p.after('rowsPerPageChange', this.update,this);
    p.after('totalRecordsChange',this.update,this);

    p.after('pageReportClassChange', this.update,this);
    p.after('pageReportTemplateChange', this.update,this);
};

/**
 * CSS class assigned to the span containing the info.
 * @attribute pageReportClass
 * @default 'yui-paginator-current'
 */
Paginator.ATTRS.pageReportClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.  Place holders in the form of {name}
 * will be replaced with the so named value from the key:value map
 * generated by the function held in the pageReportValueGenerator attribute.
 * @attribute pageReportTemplate
 * @default '({currentPage} of {totalPages})'
 * @see pageReportValueGenerator attribute
 */
Paginator.ATTRS.pageReportTemplate =
{
    value : '({currentPage} of {totalPages})',
    validator : Y.Lang.isString
};

/**
 * Function to generate the value map used to populate the
 * pageReportTemplate.  The function is passed the Paginator instance as a
 * parameter.  The default function returns a map with the following keys:
 * <ul>
 * <li>currentPage</li>
 * <li>totalPages</li>
 * <li>startIndex</li>
 * <li>endIndex</li>
 * <li>startRecord</li>
 * <li>endRecord</li>
 * <li>totalRecords</li>
 * </ul>
 * @attribute pageReportValueGenarator
 */
Paginator.ATTRS.pageReportValueGenerator =
{
    value : function (paginator) {
        var curPage = paginator.getCurrentPage(),
            records = paginator.getPageRecords();

        return {
            'currentPage' : records ? curPage : 0,
            'totalPages'  : paginator.getTotalPages(),
            'startIndex'  : records ? records[0] : 0,
            'endIndex'    : records ? records[1] : 0,
            'startRecord' : records ? records[0] + 1 : 0,
            'endRecord'   : records ? records[1] + 1 : 0,
            'totalRecords': paginator.get('totalRecords')
        };
    },
    validator : Y.Lang.isFunction
};

/**
 * Replace place holders in a string with the named values found in an
 * object literal.
 * @static
 * @method sprintf
 * @param template {string} The content string containing place holders
 * @param values {object} The key:value pairs used to replace the place holders
 * @return {string}
 */
Paginator.ui.CurrentPageReport.sprintf = function (template, values) {
    return template.replace(/\{([\w\s\-]+)\}/g, function (x,key) {
            return (key in values) ? values[key] : '';
        });
};

Paginator.ui.CurrentPageReport.prototype = {

    /**
     * Span node containing the formatted info
     * @property span
     * @type HTMLElement
     * @private
     */
    span : null,


    /**
     * Removes the link/span node and clears event listeners
     * removal.
     * @method destroy
     * @private
     */
    destroy : function () {
        this.span.remove(true);
        this.span = null;
    },

    /**
     * Generate the span containing info formatted per the pageReportTemplate
     * attribute.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        if (this.span) {
            this.span.remove(true);
        }

        this.span = Y.Node.create(
            '<span id="'+id_base+'-page-report"></span>');
        this.span.set('className', this.paginator.get('pageReportClass'));
        this.update();

        return this.span;
    },
    
    /**
     * Regenerate the content of the span if appropriate. Calls
     * CurrentPageReport.sprintf with the value of the pageReportTemplate
     * attribute and the value map returned from pageReportValueGenerator
     * function.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        this.span.set('className', this.paginator.get('pageReportClass'));
        this.span.set('innerHTML', Paginator.ui.CurrentPageReport.sprintf(
            this.paginator.get('pageReportTemplate'),
            this.paginator.get('pageReportValueGenerator')(this.paginator)));
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the first page.
 *
 * @class Paginator.ui.FirstPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.FirstPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('firstPageLinkLabelChange',this.rebuild,this);
    p.after('firstPageLinkClassChange',this.rebuild,this);
};

/**
 * Used as innerHTML for the first page link/span.
 * @attribute firstPageLinkLabel
 * @default '&lt;&lt; first'
 */
Paginator.ATTRS.firstPageLinkLabel =
{
    value : '&lt;&lt; first',
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the link/span
 * @attribute firstPageLinkClass
 * @default 'yui-paginator-first'
 */
Paginator.ATTRS.firstPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'first'),
    validator : Y.Lang.isString
};

// Instance members and methods
Paginator.ui.FirstPageLink.prototype = {

    /**
     * The currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners.
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
        }

        this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-first-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-first-span">'+label+'</span>');
        this.span.set('className', c);

        this.current = p.getCurrentPage() > 1 ? this.link : this.span;
        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var par = this.current ? this.current.get('parentNode') : null;
        if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {
            if (par && this.current === this.span) {
                par.replaceChild(this.link,this.current);
                this.current = this.link;
            }
        } else {
            if (par && this.current === this.link) {
                par.replaceChild(this.span,this.current);
                this.current = this.span;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        this.link.set('className', c);
        this.link.set('innerHTML', label);

        this.span.set('className', c);
        this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Pass new value to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(1);
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to display a menu for selecting the range of items to display.
 *
 * @class Paginator.ui.ItemRangeDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.ItemRangeDropdown = function(
	/* Paginator */	p)
{
	this.paginator = p;

	p.on('destroy',               this.destroy, this);
	p.after('recordOffsetChange', this.update,  this);
	p.after('rowsPerPageChange',  this.update,  this);
	p.after('totalRecordsChange', this.update,  this);
	p.after('disabledChange',     this.update,  this);

	p.after('itemRangeDropdownClassChange', this.update, this);
};

/**
 * CSS class assigned to the span
 * @attribute itemRangeDropdownClass
 * @default 'yui-paginator-ir-dropdown'
 */
Paginator.ATTRS.itemRangeDropdownClass =
{
	value : Y.ClassNameManager.getClassName(Paginator.NAME, 'ir-dropdown'),
	validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the span.
 * @attribute itemRangeDropdownTemplate
 * @default '{currentRange} of {totalItems}'
 */
Paginator.ATTRS.itemRangeDropdownTemplate =
{
	value : '{currentRange} of {totalItems}',
	validator : Y.Lang.isString
};

Paginator.ui.ItemRangeDropdown.prototype =
{
	/**
	 * Removes the link/span node and clears event listeners.
	 * @method destroy
	 * @private
	 */
	destroy: function()
	{
		this.span.remove().destroy(true);
		this.span       = null;
		this.menu       = null;
		this.page_count = null;
	},

	/**
	 * Generate the nodes and return the appropriate node given the current
	 * pagination state.
	 * @method render
	 * @param id_base {string} used to create unique ids for generated nodes
	 * @return {HTMLElement}
	 */
	render: function(
		id_base)
	{
		if (this.span) {
			this.span.remove().destroy(true);
		}

		this.span = Y.Node.create(
			'<span id="'+id_base+'-item-range">' +
			Y.substitute(this.paginator.get('itemRangeDropdownTemplate'),
			{
				currentRange: '<select class="yui-current-item-range"></select>',
				totalItems:   '<span class="yui-item-count"></span>'
			}) +
			'</span>');
		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));

		this.menu = this.span.one('select');
		this.menu.on('change', this._onChange, this);

		this.page_count = this.span.one('span.yui-item-count');

		this.prev_page_count = -1;
		this.prev_page_size  = -1;
		this.prev_rec_count  = -1;
		this.update();

		return this.span;
	},

	/**
	 * Swap the link and span nodes if appropriate.
	 * @method update
	 * @param e {CustomEvent} The calling change event
	 */
	update: function(
		/* CustomEvent */ e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		var page    = this.paginator.getCurrentPage();
		var count   = this.paginator.getTotalPages();
		var size    = this.paginator.getRowsPerPage();
		var recs    = this.paginator.getTotalRecords();

		if (count != this.prev_page_count ||
			size  != this.prev_page_size  ||
			recs  != this.prev_rec_count)
		{
			var options    = Y.Node.getDOMNode(this.menu).options;
			options.length = 0;

			for (var i=1; i<=count; i++)
			{
				var range = this.paginator.getPageRecords(i);

				options[i-1] = new Option((range[0]+1) + ' - ' + (range[1]+1), i);
			}

			this.page_count.set('innerHTML', recs);

			this.prev_page_count = count;
			this.prev_page_size  = size;
			this.prev_rec_count  = recs;
		}

		this.span.set('className', this.paginator.get('itemRangeDropdownClass'));
		this.menu.set('selectedIndex', page-1);
		this.menu.set('disabled', this.paginator.get('disabled'));
	},

	_onChange: function(e)
	{
		this.paginator.setPage(parseInt(this.menu.get('value'), 10));
	}
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the last page.
 *
 * @class Paginator.ui.LastPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.LastPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('lastPageLinkClassChange', this.rebuild, this);
    p.after('lastPageLinkLabelChange', this.rebuild, this);
};

/**
  * CSS class assigned to the link/span
  * @attribute lastPageLinkClass
  * @default 'yui-paginator-last'
  */
Paginator.ATTRS.lastPageLinkClass =
{
     value : Y.ClassNameManager.getClassName(Paginator.NAME, 'last'),
     validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the last page link/span.
 * @attribute lastPageLinkLabel
 * @default 'last &gt;&gt;'
 */
Paginator.ATTRS.lastPageLinkLabel =
{
    value : 'last &gt;&gt;',
    validator : Y.Lang.isString
};

Paginator.ui.LastPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link HTMLElement node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,

    /**
     * Empty place holder node for when the last page link is inappropriate to
     * display in any form (unlimited paging).
     * @property na
     * @type HTMLElement
     * @private
     */
    na        : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.na.remove(true);
        this.current = this.link = this.span = this.na = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel'),
            last  = p.getTotalPages();

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
            this.na.remove(true);
        }

        this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-last-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-last-span">'+label+'</span>');
        this.span.set('className', c);

        this.na = Y.Node.create(
            '<span id="'+id_base+'-last-na"></span>');

        switch (last) {
            case Paginator.VALUE_UNLIMITED :
                this.current = this.na;
                break;

            case p.getCurrentPage() :
                this.current = this.span;
                break;

            default :
                this.current = this.link;
        }

        return this.current;
    },

    /**
     * Swap the link, span, and na nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event (ignored)
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var par   = this.current ? this.current.get('parentNode') : null,
            after = this.link,
            total = this.paginator.getTotalPages();

        if (par) {
            if (total === Paginator.VALUE_UNLIMITED) {
                after = this.na;
            } else if (total === this.paginator.getCurrentPage() ||
                        this.paginator.get('disabled')) {
                after = this.span;
            }

            if (this.current !== after) {
                par.replaceChild(after,this.current);
                this.current = after;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event (ignored)
     */
    rebuild : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel');

        this.link.set('className', c);
        this.link.set('innerHTML', label);

        this.span.set('className', c);
        this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(this.paginator.getTotalPages());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the next page.
 *
 * @class Paginator.ui.NextPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.NextPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange', this.update,this);
    p.after('rowsPerPageChange', this.update,this);
    p.after('totalRecordsChange', this.update,this);
    p.after('disabledChange', this.update,this);

    p.after('nextPageLinkClassChange', this.rebuild, this);
    p.after('nextPageLinkLabelChange', this.rebuild, this);
};

/**
 * CSS class assigned to the link/span
 * @attribute nextPageLinkClass
 * @default 'yui-paginator-next'
 */
Paginator.ATTRS.nextPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'next'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the next page link/span.
 * @attribute nextPageLinkLabel
 * @default 'next &gt;'
 */
Paginator.ATTRS.nextPageLinkLabel =
{
    value : 'next &gt;',
    validator : Y.Lang.isString
};

Paginator.ui.NextPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p     = this.paginator,
            c     = p.get('nextPageLinkClass'),
            label = p.get('nextPageLinkLabel'),
            last  = p.getTotalPages();

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
        }

        this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-next-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-next-span">'+label+'</span>');
        this.span.set('className', c);

        this.current = p.getCurrentPage() === last ? this.span : this.link;

        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var last = this.paginator.getTotalPages(),
            par  = this.current ? this.current.get('parentNode') : null;

        if (this.paginator.getCurrentPage() !== last && !this.paginator.get('disabled')) {
            if (par && this.current === this.span) {
                par.replaceChild(this.link,this.current);
                this.current = this.link;
            }
        } else if (this.current === this.link) {
            if (par) {
                par.replaceChild(this.span,this.current);
                this.current = this.span;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p     = this.paginator,
            c     = p.get('nextPageLinkClass'),
            label = p.get('nextPageLinkLabel');

        this.link.set('className', c);
        this.link.set('innerHTML', label);

        this.span.set('className', c);
        this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(this.paginator.getNextPage());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the page links
 *
 * @class Paginator.ui.PageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.PageLinks = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('pageLinksContainerClassChange', this.rebuild,this);
    p.after('pageLinkClassChange', this.rebuild,this);
    p.after('currentPageClassChange', this.rebuild,this);
    p.after('pageLinksChange', this.rebuild,this);
};

/**
 * CSS class assigned to the span containing the page links.
 * @attribute pageLinksContainerClass
 * @default 'yui-paginator-pages'
 */
Paginator.ATTRS.pageLinksContainerClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'pages'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to each page link/span.
 * @attribute pageLinkClass
 * @default 'yui-paginator-page'
 */
Paginator.ATTRS.pageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'page'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the current page span.
 * @attribute currentPageClass
 * @default 'yui-paginator-current-page'
 */
Paginator.ATTRS.currentPageClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'current-page'),
    validator : Y.Lang.isString
};

/**
 * Maximum number of page links to display at one time.
 * @attribute pageLinks
 * @default 10
 */
Paginator.ATTRS.pageLinks =
{
    value : 10,
    validator : Paginator.isNumeric
};

/**
 * Function used generate the innerHTML for each page link/span.  The
 * function receives as parameters the page number and a reference to the
 * paginator object.
 * @attribute pageLabelBuilder
 * @default function (page, paginator) { return page; }
 */
Paginator.ATTRS.pageLabelBuilder =
{
    value : function (page, paginator) { return page; },
    validator : Y.Lang.isFunction
};

/**
 * Templates for generating page links.
 * @property templates
 * @static
 */
Paginator.ui.PageLinks.templates =
{
    currentPageLink:  '<span class="{currentPageClass} {pageLinkClass}">{label}</span>',
    pageLink:         '<a href="#" class="{pageLinkClass}" page="{page}">{label}</a>',
    disabledPageLink: '<span class="{pageLinkClass} disabled" page="{page}">{label}</span>'
}

/**
 * Calculates start and end page numbers given a current page, attempting
 * to keep the current page in the middle
 * @static
 * @method calculateRange
 * @param {int} currentPage  The current page
 * @param {int} [totalPages] Maximum number of pages
 * @param {int} [numPages]   Preferred number of pages in range
 * @return {Array} [start_page_number, end_page_number]
 */
Paginator.ui.PageLinks.calculateRange = function (currentPage,totalPages,numPages) {
    var UNLIMITED = Paginator.VALUE_UNLIMITED,
        start, end, delta;

    // Either has no pages, or unlimited pages.  Show none.
    if (!currentPage || numPages === 0 || totalPages === 0 ||
        (totalPages === UNLIMITED && numPages === UNLIMITED)) {
        return [0,-1];
    }

    // Limit requested pageLinks if there are fewer totalPages
    if (totalPages !== UNLIMITED) {
        numPages = numPages === UNLIMITED ?
                    totalPages :
                    Math.min(numPages,totalPages);
    }

    // Determine start and end, trying to keep current in the middle
    start = Math.max(1,Math.ceil(currentPage - (numPages/2)));
    if (totalPages === UNLIMITED) {
        end = start + numPages - 1;
    } else {
        end = Math.min(totalPages, start + numPages - 1);
    }

    // Adjust the start index when approaching the last page
    delta = numPages - (end - start + 1);
    start = Math.max(1, start - delta);

    return [start,end];
};


Paginator.ui.PageLinks.prototype = {

    /**
     * Current page
     * @property current
     * @type number
     * @private
     */
    current     : 0,

    /**
     * Span node containing the page links
     * @property container
     * @type HTMLElement
     * @private
     */
    container   : null,


    /**
     * Removes the page links container node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.container.remove(true);
        this.container = null;
    },

    /**
     * Generate the nodes and return the container node containing page links
     * appropriate to the current pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {

        if (this.container) {
            this.container.remove(true);
        }

        // Set up container
        this.container = Y.Node.create(
            '<span id="'+id_base+'-pages"></span>');
        this.container.on('click',this.onClick,this);

        // Call update, flagging a need to rebuild
        this.update({newVal : null, rebuild : true});

        return this.container;
    },

    /**
     * Update the links if appropriate
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p           = this.paginator,
            currentPage = p.getCurrentPage();

        // Replace content if there's been a change
        if (this.current !== currentPage || !currentPage || e.rebuild) {
            var labelBuilder = p.get('pageLabelBuilder'),
                totalPages   = p.getTotalPages(),
                range        = Paginator.ui.PageLinks.calculateRange(
                                currentPage,
                                totalPages,
                                p.get('pageLinks')),
                start        = range[0],
                end          = range[1],
                content      = '',
                showLast     = false,
                i,
                params = {
                    currentPageClass: p.get('currentPageClass'),
                    pageLinkClass:    p.get('pageLinkClass')
                },
                pageLink = p.get('disabled') ?
                    Paginator.ui.PageLinks.templates.disabledPageLink :
                    Paginator.ui.PageLinks.templates.pageLink;

            if (0 < start && start <= end) {
                if (start > 1) {
                    start++;
                    params.page  = 1;
                    params.label = labelBuilder(1,p);
                    content     += Y.Lang.sub(pageLink, params);
                    content     += '&hellip;';
                }

                if (end < totalPages) {
                    end--;
                    showLast = true;
                }

                for (i = start; i <= end; ++i) {
                    params.page  = i;
                    params.label = labelBuilder(i,p);
                    content += Y.Lang.sub(i === currentPage ?
                        Paginator.ui.PageLinks.templates.currentPageLink : pageLink,
                        params);
                }

                if (showLast) {
                    params.page  = totalPages;
                    params.label = labelBuilder(totalPages,p);
                    content     += '&hellip;';
                    content     += Y.Lang.sub(pageLink, params);
                }
            }

            this.container.set('className', p.get('pageLinksContainerClass'));
            this.container.set('innerHTML', content);
        }
    },

    /**
     * Force a rebuild of the page links.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild     : function (e) {
        e.rebuild = true;
        this.update(e);
    },

    /**
     * Listener for the container's onclick event.  Looks for qualifying link
     * clicks, and pulls the page number from the link's page attribute.
     * Sends link's page attribute to the Paginator's setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        var t = e.target;
        if (t && t.hasClass(this.paginator.get('pageLinkClass'))) {

            e.halt();

            this.paginator.setPage(parseInt(t.getAttribute('page'),10));
        }
    }

};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the previous page.
 *
 * @class Paginator.ui.PreviousPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.PreviousPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('previousPageLinkLabelChange',this.update,this);
    p.after('previousPageLinkClassChange',this.update,this);
};

/**
 * CSS class assigned to the link/span
 * @attribute previousPageLinkClass
 * @default 'yui-paginator-previous'
 */
Paginator.ATTRS.previousPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'previous'),
    validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the previous page link/span.
 * @attribute previousPageLinkLabel
 * @default '&lt; prev'
 */
Paginator.ATTRS.previousPageLinkLabel =
{
    value : '&lt; prev',
    validator : Y.Lang.isString
};

Paginator.ui.PreviousPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.current = this.link = this.span = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p     = this.paginator,
            c     = p.get('previousPageLinkClass'),
            label = p.get('previousPageLinkLabel');

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
        }

        this.link= Y.Node.create(
            '<a href="#" id="'+id_base+'-prev-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-prev-span">'+label+'</span>');
        this.span.set('className', c);

        this.current = p.getCurrentPage() > 1 ? this.link : this.span;
        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var par = this.current ? this.current.get('parentNode') : null;
        if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {
            if (par && this.current === this.span) {
                par.replaceChild(this.link,this.current);
                this.current = this.link;
            }
        } else {
            if (par && this.current === this.link) {
                par.replaceChild(this.span,this.current);
                this.current = this.span;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(this.paginator.getPreviousPage());
    }
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the rows-per-page dropdown
 *
 * @class Paginator.ui.RowsPerPageDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.RowsPerPageDropdown = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this._handleTotalRecordsChange,this);
    p.after('disabledChange',this.update,this);

    p.after('rowsPerPageDropdownClassChange',this.rebuild,this);
    p.after('rowsPerPageDropdownTitleChange',this.rebuild,this);
    p.after('rowsPerPageOptionsChange',this.rebuild,this);
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownClass
 * @default 'yui-paginator-rpp-options'
 */
Paginator.ATTRS.rowsPerPageDropdownClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'rpp-options'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownTitle
 * @default 'Rows per page'
 */
Paginator.ATTRS.rowsPerPageDropdownTitle =
{
    value : 'Rows per page',
    validator : Y.Lang.isString
};

/**
 * Array of available rows-per-page sizes.  Converted into select options.
 * Array values may be positive integers or object literals in the form<br>
 * { value : NUMBER, text : STRING }
 * @attribute rowsPerPageOptions
 * @default []
 */
Paginator.ATTRS.rowsPerPageOptions =
{
    value : [],
    validator : Y.Lang.isArray
};

Paginator.ui.RowsPerPageDropdown.prototype = {

    /**
     * select node
     * @property select
     * @type HTMLElement
     * @private
     */
    select  : null,


    /**
     * option node for the optional All value
     *
     * @property all
     * @type HTMLElement
     * @protected
     */
    all : null,


    /**
     * Removes the select node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.select.remove().destroy(true);
        this.all = this.select = null;
    },

    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        if (this.select) {
            this.select.remove().destroy(true);
        }

        this.select = Y.Node.create(
            '<select id="'+id_base+'-rpp"></select>');
        this.select.on('change',this.onChange,this);

        this.rebuild();

        return this.select;
    },

    /**
     * (Re)generate the select options.
     * @method rebuild
     */
    rebuild : function (e) {
        var p       = this.paginator,
            sel     = this.select,
            options = p.get('rowsPerPageOptions'),
            opts    = Y.Node.getDOMNode(sel).options,
            opt,cfg,val,i,len;

        this.all = null;

        sel.set('className', this.paginator.get('rowsPerPageDropdownClass'));
        sel.set('title', this.paginator.get('rowsPerPageDropdownTitle'));

        for (i = 0, len = options.length; i < len; ++i) {
            cfg = options[i];
            opt = opts[i] || sel.appendChild(Y.Node.create('<option/>'));
            val = Y.Lang.isValue(cfg.value) ? cfg.value : cfg;
            opt.set('innerHTML', Y.Lang.isValue(cfg.text) ? cfg.text : cfg);

            if (Y.Lang.isString(val) && val.toLowerCase() === 'all') {
                this.all  = opt;
                opt.set('value', p.get('totalRecords'));
            } else{
                opt.set('value', val);
            }

        }

        while (opts.length > options.length) {
            sel.get('lastChild').remove(true);
        }

        this.update();
    },

    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var rpp     = this.paginator.get('rowsPerPage')+'',
            options = Y.Node.getDOMNode(this.select).options,
            i,len;

        for (i = 0, len = options.length; i < len; ++i) {
            if (options[i].value === rpp) {
                options[i].selected = true;
                break;
            }
        }

        this.select.set('disabled', this.paginator.get('disabled'));
    },

    /**
     * Listener for the select's onchange event.  Sent to setRowsPerPage method.
     * @method onChange
     * @param e {DOMEvent} The change event
     */
    onChange : function (e) {
        this.paginator.setRowsPerPage(
            parseInt(Y.Node.getDOMNode(this.select).options[this.select.get('selectedIndex')].value,10));
    },

    /**
     * Updates the all option value (and Paginator's rowsPerPage attribute if
     * necessary) in response to a change in the Paginator's totalRecords.
     *
     * @method _handleTotalRecordsChange
     * @param e {Event} attribute change event
     * @protected
     */
    _handleTotalRecordsChange : function (e) {
        if (!this.all || (e && e.prevVal === e.newVal)) {
            return;
        }

        this.all.set('value', e.newVal);
        if (this.all.get('selected')) {
            this.paginator.set('rowsPerPage',e.newVal);
        }
    }
};
/**
 * @module gallery-paginator
 */

/**********************************************************************
 * Adds per-page error notification to Paginator.ui.PageLinks.
 *
 * @class Paginator.ui.ValidationPageLinks
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */

Paginator.ui.ValidationPageLinks = function(
	/* Paginator */	p)
{
	Paginator.ui.ValidationPageLinks.superclass.constructor.call(this, p);

	p.after('pageStatusChange', this.rebuild, this);
};

var vpl_status_prefix = 'yui3-has';

/**
 * Array of status strings for each page.  If the status value for a page
 * is not empty, it is used to build a CSS class for the page:
 * yui3-has&lt;status&gt;
 *
 * @attribute pageStatus
 */
Paginator.ATTRS.pageStatus =
{
	value:     [],
	validator: Y.Lang.isArray
};

/**
 * Templates for generating page links.
 * @property templates
 * @static
 */
Paginator.ui.ValidationPageLinks.templates =
{
	currentPageLink:  '<span class="{link} {curr} {status}">{label}</span>',
	pageLink:         '<a href="#" class="{link} {status}" page="{page}">{label}</a>',
	disabledPageLink: '<span class="{link} disabled {status}" page="{page}">{label}</span>'
};

Y.extend(Paginator.ui.ValidationPageLinks, Paginator.ui.PageLinks,
{
	update: function(e)
	{
		if (e && e.prevVal === e.newVal)
		{
			return;
		}

		var currentPage	= this.paginator.getCurrentPage();

		if (this.current !== currentPage || !currentPage || e.rebuild)
		{
			var linkClass    = this.paginator.get('pageLinkClass'),
				status       = this.paginator.get('pageStatus'),
				labelBuilder = this.paginator.get('pageLabelBuilder'),
				totalPages   = this.paginator.getTotalPages(),
				linkMarkup   = this.paginator.get('disabled') ?
					Paginator.ui.ValidationPageLinks.templates.disabledPageLink :
					Paginator.ui.ValidationPageLinks.templates.pageLink;

			var range =
				Paginator.ui.PageLinks.calculateRange(
					currentPage, totalPages, this.paginator.get('pageLinks'));

			var content = '';

			if (0 < range[0] && range[0] <= range[1])
			{
				if (range[0] > 1)
				{
					range[0]++;
					content += Y.Lang.sub(linkMarkup,
					{
						link:   linkClass,
						curr:   '',
						status: status[0] ? vpl_status_prefix + status[0] : '',
						page:   1,
						label:  labelBuilder(1, this.paginator)
					});
					content += '&hellip;'
				}

				if (range[1] < totalPages)
				{
					range[1]--;
					var showLast = true;
				}

				for (var i=range[0]; i<=range[1]; i++)
				{
					content += Y.Lang.sub(i === currentPage ? Paginator.ui.ValidationPageLinks.templates.currentPageLink : linkMarkup,
					{
						link:   linkClass,
						curr:   (i === currentPage ? this.paginator.get('currentPageClass') : ''),
						status: status[i-1] ? vpl_status_prefix + status[i-1] : '',
						page:   i,
						label:  labelBuilder(i, this.paginator)
					});
				}

				if (showLast)
				{
					content += '&hellip;';
					content += Y.Lang.sub(linkMarkup,
					{
						link:   linkClass,
						curr:   '',
						status: status[totalPages-1] ? vpl_status_prefix + status[totalPages-1] : '',
						page:   totalPages,
						label:  labelBuilder(totalPages, this.paginator)
					});
				}
			}

			this.container.set('innerHTML', content);
		}
	}

});


}, '@VERSION@', {"skinnable": "true", "requires": ["widget", "event-key", "substitute"]});
