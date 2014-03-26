YUI.add('gallery-paginator-view', function (Y, NAME) {

/**
 A Model class extension to be used to track "pagination state" of a paged set of control elements.
 For example, can be used to track the pagination status of a DataTable where the user selects limited
 portions for display, against a larger data set.

 The primary tools for maintaining "page state" is through the following attributes;

 * `totalItems` &nbsp;&nbsp;  Which represents the "Total count of items of interest" (See attribute [totalItems](#attr_totalItems) )
 * `itemsPerPage` &nbsp;&nbsp; Which represents the "Count of items on each page" (See attribute [itemsPerPage](#attr_itemsPerPage) )
 *  `page` &nbsp;&nbsp;  The currently selected page, within all pages required that encompass the above two attributes
     (See attribute [page](#attr_page) )

 <h4>Usage</h4>

     // setup a paginator model for 500 'foo' items, paged at 50 per page ...
     var pagModel = new Y.PaginatorModel({
        totalItems:     500,
        itemsPerPage:   50
     });
     pagModel.get('totalPages');  // returns 10

     pagModel.set('page',3);
     pagModel.getAttrs(['lastPage','page','itemIndexStart','itemIndexEnd']);
     // returns ... { lastPage:1, page:3, itemIndexStart:100, itemIndexEnd:149 }

 @module gallery-paginator-view
 @class Y.PaginatorModel
 @extends Y.Model
 @version 1.0.1
 @since 3.6.0
 **/
Y.PaginatorModel = Y.Base.create('paginatorModel', Y.Model,[],{

    /**
     * Placeholder for calculated # of pages required
     *
     * @property _npages
     * @type {Number}
     * @protected
     */
    _npages: null,

    /**
     * Placeholder for Event subscribers created by this model, kept for detaching on destroy.
     *
     * @property _subscr
     * @type {Array}
     * @protected
     */
    _subscr: null,

    /**
     * Creates self-listeners to recalculate paginator settings on items / itemsPerPage
     *  changes.  Also sets listener to track 'lastPage' changes.
     *
     * @method initializer
     * @private
     * @return this
     */
    initializer: function(){

        this._recalcPagnParams();

        this._subscr = [];
        this._subscr.push( this.after('totalItemsChange',this._recalcPagnParams) );
        this._subscr.push( this.after('itemsPerPageChange',this._recalcPagnParams) );

        this._subscr.push( this.on('pageChange', this._changePage) );

        return this;
    },

    /**
     * Default destructor method, cleans up the listeners that were created.
     *
     * @method destructor
     * @private
     */
    destructor: function () {
        Y.Array.each(this._subscr,function(item){ item.detach(); });
        this._subscr = null;
    },

    /**
     * Method responds to changes to "page" (via `pageChange` attribute change), validates the change compared to the
     *  current paginator settings, and stores the prior page in "lastPage".
     *
     * If a page change is invalid (i.e. less than 1, non-numeric or greater than `totalPages`) the change is prevented.
     *
     * @method _changePage
     * @param {EventFacade} e `page` Attribute change event object
     * @return Nothing
     * @private
     */
    _changePage: function(e) {
        var newPg  = e.newVal,
            validp = true;

        // check if page requested is zero/negative or we have null totalPages
        if ( newPg < 1 || !this.get('totalPages') || !this.get('itemsPerPage') ) {
            validp = false;
        }

        // also, check if requested page exceeds the totalPages ...
        if ( validp && this.get('totalPages') && newPg > this.get('totalPages') ) {
            validp = false;
        }

        // see if we passed above validity filters ...
        if (validp) {
            this.set('lastPage', e.prevVal);
        } else {
            e.preventDefault();
        }

        return true;
    },

    /**
     * Method to calculate the current paginator settings, specifically the
     *  number of pages required, including a modulus calc for extra records requiring a final page.
     *
     * This method resets the `page` to 1 (first page) upon completion.
     *
     * @method _recalcPagnParams
     * @return {Boolean} Indicating the "success" or failure of recalculating the pagination state.
     * @private
     */
    _recalcPagnParams: function(){
        var nipp = this.get('itemsPerPage'),
            ni   = this.get('totalItems');

        // Calculate the # of pages ....
        if ( nipp && nipp > 0 ) {

            // basic pages,  items/itemsperpage
            np = Math.floor( ni / nipp );

            // adjust if not even multiple of pages (check modulus)
            if ( ni % nipp > 0 ) {
                np++;
            }

            // if no items, set one page as default
            if(ni === 0) {
                np = 1;
            }

            this._npages = np;

            // If the current page is greater than the page count,
            //   then set page to first ... this may happen if totalItems changes

            if(np < this.get('page') ) {
                this.set('page',1);
            }

            return true;
        }
        return false;
    },

    /**
     * Getter for returning the start index for the current `page`
     * @method _getItemIndexStart
     * @return {Integer} Index of first item on the current `page`
     * @private
     */
    _getItemIndexStart: function() {
        return (this.get('totalItems')>0) ? (this.get('page')-1)*this.get('itemsPerPage') : null;
/*        if (this.get('totalItems')>0)
            return ( this.get('page') - 1 ) * this.get('itemsPerPage');
        else
            return null;  */
    },

    /**
     * Getter for returning the inclusive ending index for the current `page`
     * @method _getItemIndexEnd
     * @return {Integer} Index of the last item on the current `page`
     * @private
     */
    _getItemIndexEnd: function(){
        var ni   = this.get('totalItems'),
            iend = this.get('itemIndexStart') + this.get('itemsPerPage') - 1;

        if(ni>0){
            return ( iend > ni ) ? ni : iend;
        } else {
            return null;
        }
    }

    /**
     * Fires after the `page` attribute is changed
     * @event pageChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `itemsPerPage` attribute is changed
     * @event itemsPerPageChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `totalItems` attribute is changed
     * @event totalItemsChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `totalPages` attribute is changed
     * @event totalPagesChange
     * @param {EventFacade} e
     */
    /**
     * Fires after the `lastPage` attribute is changed
     * @event lastPageChange
     * @param {EventFacade} e
     */

},{
    ATTRS:{

        /**
         * Total number of items used by this paginator-model.
         *
         * @attribute totalItems
         * @type {Integer}
         * @default null
         */
        totalItems:        {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * Number of items per page for this paginator.
         *
         * @attribute itemsPerPage
         * @type {Integer}
         * @default null
         */
        itemsPerPage :   {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * The current page selected for this paginator-model.
         *
         * This is intended as the **primary** change parameter to be .set() by the user, for interacting
         * with the Paginator Model.
         *
         * @attribute page
         * @type {Integer}
         * @default 1
         */
        page: {
            value:      1,
            validator:  Y.Lang.isNumber
        },

        /**
         * The last active `page` that was selected, this is populated by a `pageChange` listener on the Model.
         *
         * @attribute lastPage
         * @type {Integer}
         * @default null
         */
        lastPage: {
            value:      null,
            validator:  Y.Lang.isNumber
        },

        /**
         * The total number of pages required to complete this pagination state (based upon `totalItems` and
         * `itemsPerPage`, specifically).
         *
         * This attribute is set / maintained by the method [_recalcPagnParams](#method__recalcPagnParams) and
         * shouldn't be set by the user.
         *
         * @attribute totalPages
         * @type Integer
         * @default null
         */
        totalPages: {
            value:      null,
            validator:  Y.Lang.isNumber,
            getter:     function(){ return this._npages; }
        },

        /**
         * The index for the starting item on the current `page` within the pagination state.
         *
         * This attribute is calculated on the fly in a getter method [_getItemIndexStart](#method__getItemIndexStart) and
         * should not be "set" by the user, as it will be disregarded.
         *
         * @attribute itemIndexStart
         * @type Integer
         * @default null
         */
        itemIndexStart: {
            value :     null,
            validator:  Y.Lang.isNumber,
            getter:     '_getItemIndexStart'
        },

        /**
         * The index for the ending item on the current `page` within the pagination state.
         *
         * This attribute is calculated on the fly in a getter method [_getItemIndexEnd](#method__getItemIndexEnd) and
         * should not be "set" by the user, as it will be disregarded.
         *
         * @attribute itemIndexEnd
         * @type Integer
         * @default null
         */
        itemIndexEnd: {
            value :     null,
            validator:  Y.Lang.isNumber,
            getter:     '_getItemIndexEnd'
        }
    }

});



/**
 A View class extension to serve as a User Interface for the tracking of "pagination state" of
 a set of data.  This PaginatorView was specifically designed to work with PaginatorModel
 serving as the "model" (in MVC parlance), although would work with any user-supplied model under conditions
 where similar attributes and attribute changes are mapped.

 The PaginatorView was originally designed to function with DataTable (See Y.DataTable.Paginator) for managing the UI
 and page state of paginated tables, although it isn't necessarily limited to that application.  This View responds to
 the model's attribute `xxxxChange` events and updates the UI accordingly.

 The PaginatorView utilizes an HTML template concept, where certain replaceable tokens uniquely related to this view,
 in addition to all of the model's attributes, can be defined for positioning within the Paginator container.

 <h4>Usage</h4>

     // Setup a paginator view based on a data model for 500 items, paged at 50 per page ...
     var pagView = new Y.PaginatorView(
        container:  '#myPagDIV',
        paginatorTemplate:  '#script-tmpl-mypag',
        model:  new Y.PaginatorModel({
            totalItems:     500,
            itemsPerPage:   50
            })
     }).render();

 <h4>View 'container'</h4>
 The [container](#attr_container) attribute is the only **REQUIRED** attribute for this View, primarily because we
 need to know *where* to construct it positionally on the page.

 This view has been designed such that the `container` setting can be either (a) an actual Y.Node instance OR
 (b) a DOM css selector ID ... assumed if the container setting is a {String} with the first character is '#'.

 <h4>Paginator HTML Template</h4>
 The "HTML template" for this PaginatorView is the guts of displaying the user interface.  We refer to this as
 the "template" because it typically contains standard HTML but also includes "replacement tokens" identified
 by ```{your token here}``` curly braces.

 A definition of HTML Template for the paginator can be achieved through several methods;
 <ul>
 <li>Including the HTML template as content within the original `container` DOM element ... template retrived via .getHTML()</li>
 <li>Setting the <a href="#attr_paginatorTemplate">paginatorTemplate</a> attribute to either the template 'string', or
 giving a SCRIPT template DOM[id] or Y.Node</li>
 <li>Doing neither of the above ... where the default template is used (from <a href="#property_TMPL_PAGINATOR">TMPL_PAGINATOR</a>
 static property)</li>
 </ul>
 (Note: If for some reason it is desired to not have a "template" (because you are rendering one outside of this view), setting
 ```paginatorTemplate:''``` will override the default.)

 A noteworthy component of the "HTML template" includes the token **```{pageLinks}```**, which signifies where links generated by this
 view for each page selector are to be placed.  In some instances (e.g. a Paginator Bar, with an INPUT[text] for page #) you may not
 desire to have every link generated ... (think of a paginator with hundreds of pages, thus hundreds of links).

 A sub-template is used to generate the "{pageLinks}" content, please see attribute [pageLinkTemplate](#attr_pageLinkTemplate) for
 information.

 For a listing of all recognized *"replaceable tokens"* that can be included in the template is shown on
 the [render](#method_render) method API page.

 <h6>Data Attribute</h6>
 A key takeaway for using this View is that page links (i.e. actionable selectable elements, such as A,
 BUTTON, DIV, etc...) for a specific page use an HTML "data" attribute which defines the page associated with the link.

 The data attribute used within the view is `data-pglink`, and can have a value setting of "first", "last", "prev",
 "next" or any numeric page number.

 For example, the following are all valid page link identifiers;

     <a href="#" data-pglink="last" title="Last Page">Last</a>
     <button data-pglink="6" class="myBtn">Page 6</button>
     <select><option data-pglink="19" value="19">Page 19 : Rows 9501 - 10000</option></select>


 <h4>Connecting to "other" UI Elements / Widgets</h4>
 This View can be restricted to situations where the use desires to construct their own unique `pageLinkTemplate` and
 create their own `events` attribute to set listeners.

 For example, the PaginatorView's [render](#event_render) event can be listened for to ensure that the paginator has
 been initialized and setup.

 Additionally the [pageChange](#event_pageChange) event (of the view) can be listened for to do any updating to user-specified
 page links and or a supporting YUI Widget.

 Please see the examples for a guide on how to achieve this.

 @module gallery-paginator-view
 @class Y.PaginatorView
 @extends Y.View
 @since 3.6.0
 **/
Y.PaginatorView = Y.Base.create('paginatorView', Y.View, [], {

//================   S T A T I C     P R O P E R T I E S     ====================

    /**
     Default HTML content to be used as basis for Paginator.  This default is only used if the paginatorTemplate
     attribute is unused OR the container does not contain the HTML template.

     The paginator HTML content includes replacement tokens throughout.

     The DEFAULT setting is;

     <a href="#" data-pglink="first" class="{pageLinkClass}" title="First Page">First</a> |
     <a href="#" data-pglink="prev" class="{pageLinkClass}" title="Prior Page">Prev</a> |
     {pageLinks}
     | <a href="#" data-pglink="next" class="{pageLinkClass}" title="Next Page">Next</a> |
     <a href="#" data-pglink="last" class="{pageLinkClass}" title="Last Page">Last</a>

     @property TMPL_PAGINATOR
     @type String
     **/

    TMPL_PAGINATOR :  '<a href="#" data-pglink="first" class="{pageLinkClass}" title="First Page">First</a> | '
            + '<a href="#" data-pglink="prev" class="{pageLinkClass}" title="Prior Page">Prev</a> | '
            + '{pageLinks}'
            + ' | <a href="#" data-pglink="next" class="{pageLinkClass}" title="Next Page">Next</a> | '
            + '<a href="#" data-pglink="last" class="{pageLinkClass}" title="Last Page">Last</a>',

    /**
     Default HTML content that will be used to prepare individual links within the Paginator and inserted
     at the location denoted **{pageLinks}** replacement token in the template.

     The DEFAULT setting is;

     <a href="#" data-pglink="{page}" class="{pageLinkClass}" title="Page {page}">{page}</a>

     @property TMPL_LINK
     @type {String}
     **/
    TMPL_LINK : '<a href="#" data-pglink="{page}" class="{pageLinkClass}" title="Page {page}">{page}</a>',

    TMPL_basic : '{firstPage} {prevPage} {pageLinks} {nextPage} {lastPage}',


    TMPL_pglinks:   '{pageLinks}',

    /**
     Default HTML template for the Rows Per Page SELECT box signified by the **{selectRowsPerPage}** replacement toke
     within the paginator template.

     The DEFAULT setting is;

     <select class="{selectRPPClass}"></select>

     @property TMPL_selectRPP
     @type String
     **/
    TMPL_selectRPP:  '<select class="{selectRPPClass}"></select>',

    /**
     Default HTML template for the Page SELECT box signified by the **{selectPage}** replacement token with the
     paginator template.

     The DEFAULT setting is;

     <select class="{selectPageClass}"></select>

     @property TMPL_selectPage
     @type String
     **/
    TMPL_selectPage: '<select class="{selectPageClass}"></select>',

    /**
     Default HTML template for the "Rows Per Page" INPUT[text] control signified by the **{inputRowsPerPage}** replacement
     token within the paginator template.

     The DEFAULT setting is;

     <input type="text" class="{inputRPPClass}" value="{itemsPerPage}"/>

     @property TMPL_inputRPP
     @type String
     **/
    TMPL_inputRPP:   '<input type="text" class="{inputRPPClass}" value="{itemsPerPage}"/>',

    /**
     Default HTML template for the "Page" INPUT[text] control signified by the **{inputPage}** replacement token with the
     paginator template.

     The DEFAULT setting is;

     <input type="text" class="{inputPageClass}" value="{page}"/>

     @property TMPL_inputPage
     @type String
     **/
    TMPL_inputPage:  '<input type="text" class="{inputPageClass}" value="{page}"/>',


    /**
     A public property, provided as a convenience property, equivalent to the "model" attribute.

     @property model
     @type Y.PaginatorModel
     @default null
     @public
     **/
    model: null,

//================   P R I V A T E    P R O P E R T I E S     ====================

    /**
     * Placeholder property to store the initial container HTML for used later in the
     *  render method.  This property is populated by the View initializer.
     *
     * @property _pagHTML
     * @protected
     */
    _pagHTML:       null,


     //  Various class placeholders for UI elements
    _cssPre:            'yui3-pagview',
    _classContainer:    null,
    _classLinkPage:     null,
    _classLinkPageList: null,
    _classLinkPageActive: null,
    _classSelectRPP:    null,
    _classSelectPage:   null,
    _classInputRPP:     null,
    _classInputPage:    null,


    /**
     * Holder for Event subscribers created by this View, saved so they can be cleaned up later.
     *
     * @property _subscr
     * @type Array
     * @default null
     * @protected
     */
    _subscr: null,


    /**
     * Helper function, because I was too lazy to figure out how to get widget getClassName working
     *
     * @method _myClassName
     * @param String variable number of strings, to be concatenated
     * @return String
     * @private
     */
    _myClassName: function() {
        var rtn,i;
        if (arguments && arguments.length>0) {
            rtn = this._cssPre;
            for(i=0; i<arguments.length; i++){
                rtn += '-' + arguments[i];
            }
            return rtn;
        }
        return '';
    },

    /**
     * Initializer sets up classes and the initial container and HTML templating for this View.
     *
     * @method initializer
     * @private
     * @return this
     */
    initializer: function(){
        var cont,pagTmpl;
        //
        //  Init class names
        //
        this._classContainer  = this._myClassName('container');
        this._classLinkPage   = this._myClassName('link','page');
        this._classLinkPageList = this._myClassName('link','page','list');
        this._classLinkPageActive  = this._myClassName('link','page','active');
        this._classInputPage  = this._myClassName('input','page');
        this._classSelectPage = this._myClassName('select','page');
        this._classSelectRPP  = this._myClassName('select','rowsperpage');
        this._classInputRPP   = this._myClassName('input','rowsperpage');

        //
        //  Setup the container for the paginator, and retrieve the "HTML template"
        //    from any of the following in order;
        //      (a) the "container" HTML,
        //      (b) user specified template via 'paginatorTemplate' attribute,
        //      (c) finally, the default internal template via valueFn.
        //
        cont = this.get('container');
        if (Y.Lang.isString(cont) && pagTmpl[0] === '#' ){
            this.set('container', Y.one(cont) );
        }

        cont = this.get('container');

        if ( cont instanceof Y.Node && cont.getHTML() ) {

            this._pagHTML = cont.getHTML();

        } else if ( cont instanceof Y.Node && this.get('paginatorTemplate') ) {

            pagTmpl = this.get('paginatorTemplate');

            // is user-supplied setting, but they forgot to convert via Y.one().getHTML,
            //  do it for them ...
            if ( pagTmpl ) {
                this._pagHTML = (pagTmpl[0] === '#') ? Y.one( pagTmpl).getHTML() : pagTmpl;
            }
        }

        //
        // Setup the container and model listeners
        //
        this._bindUI();

        return this;
    },


    /**
     * Setup listeners on this View, specifically on all UI elements and
     *  "most importantly", listen to "pageChange" on the underlying Model.
     *
     * @method _bindUI
     * @return this
     * @private
     */
    _bindUI: function(){
        var pag_cont =  this.get('container');
        this._subscr = [];

        //
        // Set a listener on the Model change events ... page most important!
        //
        if ( this.get('model') ) {
            this.model = this.get('model');
            this._subscr.push( this.model.after('pageChange', Y.bind(this._modelPageChange,this)) );
            this._subscr.push( this.model.after('itemsPerPageChange', Y.bind(this._modelStateChange,this)) );
            this._subscr.push( this.model.after('totalItemsChange', Y.bind(this._modelItemsChange,this)) );
        }

        // update rowOptions
        this._subscr.push( this.after('render', Y.bind(this._updateRPPSelect,this)) );

        // delegate container events, done here instead of "events" property to give more flexibility
        this._subscr.push( pag_cont.delegate( 'click',  this._clickChangePage,'.'+this._classLinkPage, this) );
        this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classSelectRPP, this) );
        this._subscr.push( pag_cont.delegate( 'change', this._inputChangePage, '.'+this._classInputPage, this) );
        this._subscr.push( pag_cont.delegate( 'change', this._selectChangeRowOptions, '.'+this._classInputRPP, this) );

        // after rendering and/or, resize if required ...
        this._subscr.push( this.after(['render','pageChange'], this.resizePaginator) );

        return this;
    },


    /**
     * Default destructor method, cleans up the listeners that were created and
     *  cleans up the view contents.
     *
     * @method destructor
     * @private
     */
    destructor: function () {
        Y.Array.each(this._subscr,function(item){
            if(Y.Lang.isArray(item)) {
                Y.Array.each(item,function(si){ si.detach(); });
            } else {
                item.detach();
            }
        });
        this._subscr = null;
        this.get('container').empty();
    },


    /**
     Renders the current settings of the Paginator using the supplied HTML content from the
     for the paginator template and Y.Lang.sub for replacement of tokens and of Model attributes.

     NOTE: The render method is not called on every page "click", but is called if the Model changes
     `totalItems` or `itemsPerPage`.

     <h6>Recognized tokens:</h6>
     Recognizeable tokens are supported, specifically as *placeholders* within the html template where generated content
     can be inserted and ultimately rendered in the view container.

     Tokens replaced within this method include all of the PaginatorModel attributes;

     **{page}**, **{totalItems}**, **{itemsPerPage}**, **{lastPage}**, **{totalPages}**, **{itemIndexStart}**, **{itemIndexEnd}**

     Additionally, specific tokens intended for view HTML construction and recognized by PaginatorView are;
     <ul>
     <li><b>{pageLinks}</b> : The placeholder within the html template where the View-generated page links will
     <br/>be inserted via a loop over all pages (DEFAULT: see <a href="#property_TMPL_LINK">TMPL_LINK</a>)</li>
     <li><b>{inputPage}</b> : An INPUT[type=text] box which the view listens for change events on
     (Default: see <a href="#property_TMPL_inputPage">TMPL_inputPage</a>)</li>
     <li><b>{selectRowsPerPage}</b> : A SELECT type pulldown that will be populated with the <a href="#attr_pageOptions">pageOptions</a>
     array <br/>of "Rows per Page" selections (Default: see <a href="#property_TMPL_selectRPP">TMPL_selectRPP</a>)</li>
     <li><b>{inputRowsPerPage}</b> : An INPUT[type=text] box what will be listened to for changes to "Rows per Page"
     (Default: see <a href="#property_TMPL_inputRPP">TMPL_inputRPP</a>)</li>
     <li><b>{selectPage}</b> (Not implemented at this time!)</li>
     <li><b>{pageStartIndex}</b> : Represents the starting index for a specific "page" (intended for use
     within <a href="#attr_pageLinkTemplate">pageLinkTemplate</a> )</li>
     <li><b>{pageEndIndex}</b> : Represents the ending index for a specific "page" (intended for use
     within <a href="#attr_pageLinkTemplate">pageLinkTemplate</a> )</li>
     </ul>

     And if that wasn't enough, the CSS class names supported by this view are also provided via tokens as;
     **{pagClass}**, **{pageLinkClass}**, **{inputPageClass}**, **{selectRPPClass}**, **{selectPageClass}**,
     *  **{inputRPPClass}**


     This method utilizes the Y.substitute tool (with recursion) for token replacement.

     The `container` visibility is disabled during construction and insertion of DOM elements into the `container` node.

     This method fires the `render` event, for View listeners.

     @method render
     @public
     @return this
     **/
    render: function() {
        var pag_cont = this.get('container'),
            model    = this.get('model'),
            nsize    = model.get('totalItems'),
            nperpage = model.get('itemsPerPage'),
            npage    = model.get('totalPages'),
            cpage    = model.get('page') || 1,
            pl_html  = '',
            plinkTMPL= this.get('pageLinkTemplate'),
            plIStart = 0,
            plIEnd   = 0,
            pg_html,plink_tmpl,i;

        if ( nsize<0 || !nperpage || !pag_cont ) {
            return this;
        }

        //TODO: this may be unnecessary ...
        if(nsize === 0) {
            npage = 1;
            cpage = 1;
           // Y.log("in pagview:render ... nsize = 0!");
        }

    //
    //  Constructing the Paginator HTML,
    //      first construct the individual Page links ...
    //

        // ... only burn thru this if the token is included in template ...
        if ( this._pagHTML.search(/\{pageLinks\}/) !== -1 ) {
            for(i=0; i<npage; i++) {

                plClass = this._classLinkPage + ' ' + this._classLinkPageList;
                if ( i+1 === cpage ){
                    plClass += ' '+ this._classLinkPageActive;
                }

                plIStart = i*nperpage + 1,
                plIEnd   = plIStart + nperpage - 1;
                plIEnd = ( plIEnd >= nsize ) ? nsize : plIEnd;

                pl_html += Y.Lang.sub( plinkTMPL, {
                    page:           (i+1),
                    pageLinkClass:  plClass || '',
                    pageStartIndex: plIStart,
                    pageEndIndex:   plIEnd
                });
            }
        }

        // ... then build the full HTML
        pg_html = this._pagHTML;
        pag_cont.setStyle('visibility','hidden');
        pag_cont.setHTML('');         //pag_cont.empty();

        // and load it into the container
        pg_html = '<div class="{pagClass}" tabindex="-1">' + pg_html + '</div>';

        // use Y.substitute, because it is recursive ...
        plink_tmpl = Y.substitute( pg_html, Y.mix({
            pageLinks:          pl_html || '',
            pageLinkClass:      this._classLinkPage,
            pagClass:           this._classContainer,
            selectRowsPerPage:  this.TMPL_selectRPP || '',
            selectPage:         this.TMPL_selectPage || '',
            inputPage:          this.TMPL_inputPage || '',
            inputRowsPerPage:   this.TMPL_inputRPP || '',
            selectRPPClass:     this._classSelectRPP,
            selectPageClass:    this._classSelectPage,
            inputRPPClass:      this._classInputRPP,
            inputPageClass:     this._classInputPage
        },model.getAttrs()),null,true);

        pag_cont.append(plink_tmpl);

    //
    //  Turn the View visibility on, and set the initial page
    //
        pag_cont.setStyle('visibility','');

        this._processPageChange(cpage);

        this.fire('render');

        return this;
    },

    disable: function(){
        this.fire('disablePaginator');
    },

    /**
     * Main handler that accomodates Page changes and updates visual cues for highlighting
     *  the selected page link and the active Page selector link list.
     *
     * This method also fires the View's "pageChange" event.
     *
     * NOTE: This method is *private* because page changes should be made by the user at
     * the Model level (Model.set('page',...) and not using the _processPageChange method.
     *
     * @method _processPageChange
     * @param {Integer} cpage
     * @private
     */
    _processPageChange: function(cpage) {
        var model      = this.get('model'),
            npage      = model.get('totalPages'),
            lastPage   = model.get('lastPage'),
            maxpls     = this.get('maxPageLinks'),
            pag_cont   = this.get('container'),
            linkOffset = this.get('linkListOffset'),
            plNodes    = pag_cont.all('.'+ this._classLinkPageList),
            plNodeCurrent, moreNodeL, moreNodeR, offs;

        //
        //  Toggle highlighting of active page selector (if enabled)
        //
        if ( plNodes && this.get('linkHighLight') ) {

            plNodeCurrent = (plNodes && (cpage-1) < plNodes.size()) ? plNodes.item(cpage-1) : null;

            // this check is only for visual elements that have pageLinks
            //   (i.e. paginator bar won't have these )

            if ( plNodeCurrent ) {
                 plNodeCurrent.addClass( this._classLinkPageActive );
            }

            if ( lastPage && lastPage !== cpage ) {
                plNodeCurrent = (plNodes && (lastPage-1) < plNodes.size()) ? plNodes.item(lastPage-1) : null;
                if (plNodeCurrent) {
                    plNodeCurrent.removeClass( this._classLinkPageActive );
                }
            }
        }

        // Update INPUT Page # field, if defined ...
        if ( pag_cont.one('.'+this._classInputPage) ) {
            pag_cont.one('.'+this._classInputPage).set('value',cpage);
        }

        // Update SELECT Items Per Page # field, if defined ...
        if ( pag_cont.one('.'+this._classInputRPP) ) {
            pag_cont.one('.'+this._classInputRPP).set('value',model.get('itemsPerPage'));
        }

        //
        //  Toggle "disabled" on First/Prev or Next/Last selectors
        //
        if(model.get('totalItems') === 0) {
            this._disablePageSelector(['1'],false);
        }

        if( npage === 1 ) {
            this._disablePageSelector(['first','prev','last','next'],false);

            // Special Case :  If no items returned, disable the Page 1 selector

        } else if ( cpage === 1 && !this.get('circular') ) {

            this._disablePageSelector(['first','prev']);
            this._disablePageSelector(['last','next'],true);

        } else if ( cpage === npage && !this.get('circular') ) {

            this._disablePageSelector(['first','prev'],true);
            this._disablePageSelector(['last','next']);

        } else {  // enable all selectors ...
            this._disablePageSelector(['first','prev','last','next'],true);
        }

        this.fire('pageChange',{state: model.getAttrs() });

        //
        //  Following code is only if user requests limited pageLinks,
        //    Only continue if partial links are requested ...
        //
        if ( npage <= maxpls || !plNodes || ( plNodes && plNodes.size() === 0 ) ) {
            return;
        }

        moreNodeL  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>'),
        moreNodeR  = Y.Node.create('<span class="'+this._myClassName('more')+'">'+this.get('pageLinkFiller')+'</span>');

        // Clear out any old remaining 'more' nodes ...
        pag_cont.all('.'+this._myClassName('more')).remove();

        // determine offsets either side of current page
        offs = this._calcOffset(cpage,linkOffset);

        //
        // Hide all page # links outside of offsets ...
        //
        plNodes.each(function(node,index){
            if ( index === 0 && this.get('alwaysShowFirst') || index === npage-1 && this.get('alwaysShowLast') ) {
                return true;
            }

            if ( index+1 < offs.left || index+1 > offs.right ){
                node.addClass( this._myClassName('hide') );
            } else{
                node.removeClass( this._myClassName('hide') );
            }
        },this);

        //
        //  add the node either side of current page element PLUS offset
        //
        if ( offs.left - linkOffset > 0 ){
            plNodes.item(offs.left-1).insert(moreNodeL,'before');
        }

        if ( offs.right + linkOffset <= npage ){
            plNodes.item(offs.right-1).insert( moreNodeR,'after');
        }

        return true;

    },

    /**
     * Helper method to calculate offset either side of Selected Page link
     *  for abbreviated Page List.
     *
     *  Called by _processPageChange
     *
     * @method _calcOffset
     * @param cpage {Integer} Current page number
     * @param offset {Integer} Number of links both sides of page number to return for (usually 1)
     * @return {Object} containing left {Integer} and right {Integer} properties
     * @private
     */
    _calcOffset: function(cpage, offset) {
        var npage     = this.get('model').get('totalPages'),
            left_off  = ( cpage-offset < 1 ) ? 1 : (cpage-offset),
            right_off = ( cpage+offset > npage) ? npage : (cpage+offset);

        return {
            left:left_off,
            right:right_off
        };
    },


    /**
     * Method that toggles the visibility of Page Link selector fields based upon
     * their data-pglink attribute setting.
     *
     *  Called by _processPageChange
     *
     * @method _disablePageSelector
     * @param linkSel
     * @param visible
     * @private
     */
    _disablePageSelector : function(linkSel, visible){
        linkSel = ( !Y.Lang.isArray(linkSel) ) ? [ linkSel ] : linkSel;
        visible = ( visible ) ? visible : false;
        var sel_srch = '[data-{suffix}="{sdata}"]',
            pag_cont = this.get('container');

        Y.Array.each(linkSel,function(pgid){
            var node = pag_cont.one(Y.Lang.sub(sel_srch,{suffix:'pglink',sdata:pgid}) );
            if ( node ) {
                if (visible) {
                    node.removeClass(this._myClassName('disabled'));
                } else {
                    node.addClass(this._myClassName('disabled'));
                }
            }
        },this);
    },



    /**
     * Setter for the "model" attribute, that for convenience also sets a public property to this View.
     *
     * @method _setModel
     * @param val
     * @return {*}
     * @private
     */
    _setModel : function(val){
        if ( !val ) {
            return;
        }
        this.model = val;
        return val;
    },


    /**
     * Handler responds to Model's `pageChange` event, if a valid page is set this listener
     *  fires off a page change request.
     *
     *  Listener set in _bindUI
     *
     * @method _modelPageChange
     * @param {EventFacade} e
     * @private
     */
    _modelPageChange: function(e) {
        var newPage = e.newVal;
        if ( newPage ) {
            this._processPageChange(newPage);
        }
    },

    /**
     * Handler responds to Model's `itemsPerPageChange` event, not really functional at present
     *
     *  Listener set in _bindUI
     *
     * @method _modelStateChange
     * @param {EventFacade} e
     * @private
     */
    _modelStateChange: function(e) {
        if (!e.silent) {
            this.render();
        }
    },

    /**
     * Handler responds to Model's `itemsPerPageChange` event
     *
     *  Listener set in _bindUI
     *
     * @method _modelItemsChange
     * @param {EventFacade} e
     * @private
     */
    _modelItemsChange: function() {
    /*    var newTotalItems = e.newVal;
        if(newTotalItems == 0) {
           // this.model.set('page',1);
           // Y.log("in pagview:_modelItemsChange ... nsize = 0!");
        }
        */
        this.render();
    },



    /**
     * Method fired after the Paginator View is rendered,
     *   so that the SELECT[rowsPerPage] control can be updated
     *
     *  Listener set in _bindUI
     *
     * @method _updateRPPSelect
     * @private
     */
    _updateRPPSelect: function() {
        var pag_cont  = this.get('container'),
            model     = this.get('model'),
            selPage   = pag_cont.one('.'+this._classSelectRPP),
            pgOptions = this.get('pageOptions'),
            isAll,opts;

        // this part is to load the "pageOptions" array
        if ( pgOptions && selPage ) {
            if ( Y.Lang.isArray(pgOptions) ) {
                //
                //  Clear out any initial options, and add new options
                //
                opts = selPage.get('options');
                selPage.empty();

                Y.Array.each(pgOptions, function(optVal) {
                    selPage.append('<option value="' + optVal + '">' + optVal + '</option>');
                });
            }
        }

        // set current rowsPerPage to selected in combobox
        if ( selPage ) {
            isAll = ( model && model.get('itemsPerPage') === model.get('totalItems') ) ? true : false;
            opts = selPage.get('options');
            opts.each(function(opt) {
                if ( opt.get('value') == model.get('itemsPerPage')
                     || (opt.get('value').search(/all/i)!==-1 && isAll) ) {
                    opt.set('selected',true);
                }
            },this);
        }

        if ( pag_cont.one('.'+this._classSelectPage) ){
            this._updatePageSelect();
        }
    },

    /**
     Method that responds to changes in the SELECT box for "page"

     @method _updatePageSelect
     @private
     @beta
     **/
    _updatePageSelect: function() {
        /*
         clearly, this method is incomplete ....

          var pag_cont  = this.get('container'),
                model     = this.get('model'),
                selPage   = pag_cont.one('.'+this._classSelectPage);

        //Y.log('updatePageSelect fired after render ...');

       */
    },


    /**
     * Handler responding to INPUT[text] box page change.
     *
     * Listener set in _bindUI
     *
     * @method _inputChangePage
     * @param {EventFacade} e
     * @private
     */
    _inputChangePage: function(e) {
        var tar = e.target,
            val = +tar.get('value') || 1,
            model = this.get('model');

        if (val<1 || val>model.get('totalPages') ) {
            val = 1;
            tar.set('value',val);
        }
        model.set('page',val);
    },

    /**
     * Handler responding to a Page Selector "click" event.  The clicked Node is
     * reviewed for its data-pglink="" setting, and processed from that.
     *
     * Changed page is then sent back to the Model, which reprocesses the
     *  paginator settings (i.e. indices) and fires a `pageChange` event.
     *
     *  Listener set in _bindUI
     *
     * @method _clickChangePage
     * @param {EventFacade} e
     * @private
     */
    _clickChangePage: function(e) {
        var tar   = e.target,
            model = this.get('model'),
            page,npage,cpage;

        e.preventDefault();

        if (e.target.hasClass(this._myClassName('disabled')) || e.currentTarget.hasClass(this._myClassName('disabled'))) {
            return;
        }

        page  = tar.getData('pglink') || e.currentTarget.getData('pglink'),
        npage = model.get('totalPages'),
        cpage = model.get('page'); //tar.get('text');

        if ( cpage && cpage === page ) {
            return;
        }

        switch(page) {
            case 'first':
                page = 1;
                break;
            case 'last':
                page = npage;
                break;
            case 'prev':
                page = (!cpage) ? 1 : (cpage === 1) ? npage : cpage - 1;
                break;
            case 'next':
                page = (!cpage) ? 1 : (cpage === npage ) ? 1 : cpage + 1;
                break;
            default:
                page = +page;

        }

        model.set('page',page);
    },

    /**
     * Handler that responds to SELECT changes for no. of rows per page
     *
     * Listener set in _bindUI
     *
     * @method _selectChangeRowOptions
     * @param {EventFacade} e
     * @private
     */
    _selectChangeRowOptions: function(e){
        var tar = e.target,
            val = +tar.get('value') || tar.get('value');

        if ( Y.Lang.isString(val) && val.toLowerCase() === 'all' ) {
            val = this.get('model').get('totalItems');
        }
        this.get('model').set('itemsPerPage',val);
        this.render();
    }


    /**
     * Fires after the Paginator has been completely rendered.
     * @event render
     */

    /**
     * Fires after the _processPageChange method has updated the pagination state.
     * @event pageChange
     * @param {Object} state The PaginatorModel `getAttrs()` "state" after updating to the current page as an object.
     * @since 3.5.0
     */


},{
    /**
     * The default set of attributes which will be available for instances of this class
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS:{

        /**
         * The base PaginatorModel that serves as data / change provider for this View.
         *
         * @example
         *     paginator:  new Y.PaginatorModel({
         *         itemsPerPage:  250
         *     }),
         *     OR
         *     paginator:  myPagModel // where myPagModel is an instance previously created ...
         *
         * @attribute model
         * @default null
         * @type {Y.PaginatorModel}
         */
        model: {
            value:     null,
            // validator: function(v){ return v instanceof Y.PaginatorModel; },
            setter:    '_setModel'
        },

        /**
         The container holder for the contents of this View.  Can be entered either as
         a Y.Node instance or as a DOM "id" attribute (if prepended by "#").

         @example
         container: Y.one("#myDiv"),
         OR
         container: "#myDiv"

         NOTE: If the container node contains HTML <b>it will be used as the paginatorTemplate</b>


         @attribute container
         @default null
         @type {Node|String}
         @required
         **/
        container: {
            value: null
        },

        /**
         An array that will be used to populate the rows per page SELECT box ( using string replacement "{selectRowsPerPage}" or
         class selector "yui3-pagview-select-rowsperpage" ).

         @attribute pageOptions
         @type {Array}
         @default [ 10, 20, 'All' ]
         **/
        pageOptions: {
            value:      [ 10, 20, 'All' ],
            validator:  Y.Lang.isArray
        },

        /**
         A string that defines the Paginator HTML contents.  Can either be entered as a {String} including replacement parameters
         or as a {Node} instance whose contents will be read via .getHTML() or a DOM "id" element (indicated by '#' in first character)
         <br/><br/>
         To disable creation of any template (in order to do your own replacements of the template), set this to ''.

         @example
         paginatorTemplate:  '<div data-pglink="first">FIRST</div> {pageLinks} <div data-pglink="last">LAST</div>',
         paginatorTemplate:  Y.one('#script-id-tmpl'),
         paginatorTemplate:  Y.one('#script-id-tmpl').getHTML(),
         paginatorTemplate:  '#script-id-tmpl',   // where

         @attribute paginatorTemplate
         @type {Node|String}
         @default See TMPL_PAGINATOR static property
         **/
        paginatorTemplate:  {
            valueFn: function(){
                return this.TMPL_PAGINATOR;
            }
        },

        /**
         Defines the HTML template to be used for each individual page within the Paginator.  This can be used along
         with replacement tokens to create UI elements for each page link.  The template is used to construct the
         `{pageLinks}` replacement token with the paginator body.

         Recognized replacement tokens most appropriate to this attribute are `{page}`, `{pageStartIndex}` and
         `{pageEndIndex}`.

         A few examples of this template are listed below;
         @example
         pageLinkTemplate: '<a href="#" data-pglink="{page}" class="" title="Page No. {page}">{page}</a>'

         @attribute pageLinkTemplate
         @type String
         @default See TMPL_LINK static property
         **/
        pageLinkTemplate:   {
            valueFn: function(){
                return this.TMPL_LINK;
            }
        },

        // May not be necessary anymore
        linkHighLight: {
            value:      true,
            validator:  Y.Lang.isBoolean
        },

        /**
         Used to set the maximum number of page links that will be displayed for individual pages within `{pageLinks}`.
         This is the primary attribute to use to setup **abbreviated page links**, to avoid a long line of page links
         that travel across the page!

         Setting this to some number less than the total number of pages will begin abbreviating the links.
         <br/>(See also attributes [`linkListOffset`](#attr_linkListOffset) and [`pageLinkFiller`](#attr_pageLinkFiller),
         which work in conjunction with this attribute).

         @attribute maxPageLinks
         @type Integer
         @default 9999
         **/
        maxPageLinks:   {
            value:      9999,
            validator:  Y.Lang.isNumber
        },

        /**
         Setting that represents the number of links adjacent to the current page that should be displayed for instances where
         an *abbreviated* page link list is desired.
         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [pageLinkFiller](#attr_pageLinkFiller) attributes).

         For example, a setting of this attribute to 1, will result in 3 page links (current page plus 1 each side),
         <br/>likewise a setting of 2, will results in 5 page links in the center of the paginator, etc.

         @attribute linkListOffset
         @type Integer
         @default 1
         **/
        linkListOffset: {
            value:      1,
            validator:  Y.Lang.isNumber
        },

        /**
         Setting the the ".. more" indicator to be used specifically for *abbreviated* page link lists.
         <br/>(See [maxPageLinks](#attr_maxPageLinks) and [linkListOffset](#attr_linkListOffset) attributes).

         @attribute pageLinkFiller
         @type String
         @default '...'
         **/
        pageLinkFiller: {
            value:      '...',
            validator:  Y.Lang.isString
        },

        /**
         Flag to indicate whether the first page link **within the `{pageLinks}` template** is to be displayed or not.
         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).

         For Example;
         <br/>If our paginator state currently has 9 pages, and the current page is 5, if `alwaysShowLast:false`
         and `alwaysShowFirst:false` the link list will resemble;
         <br/>First | Prev | ... 4 5 6 ... | Next | Last

         Likewise, with `'alwaysShowLast:true` (and alwaysShowFirst:true) the link list will resemble;
         <br/>First | Prev | 1 ... 4 5 6 ... 9 | Next | Last

         @attribute alwaysShowFirst
         @type Boolean
         @default false
         **/
        alwaysShowFirst:{
            value:      false,
            validator:  Y.Lang.isBoolean
        },

        /**
         Flag to indicate whether the last page link **within the `{pageLinks}` template** is to be displayed or not.
         <br/>Specifically intended for *abbreviated* page link lists (See [maxPageLinks](#attr_maxPageLinks) attribute).

         See `alowsShowFirst` for an example.

         @attribute alwaysShowLast
         @type Boolean
         @default false
         **/
        alwaysShowLast:{
            value:      false,
            validator:  Y.Lang.isBoolean
        },

        /**
         Not implemented at this time.
         @attribute selectPageFormat
         @type String
         @default 'Page {page}'
         @beta
         **/
        selectPageFormat: {
            value:      'Page {page}',
            validator:  Y.Lang.isString
        },

        /**
         Flag indicating whether "circular" behavior of the Paginator View is desired.  If `true` the paginator
         will stop "disabling" First|Previous or Next|Last toggling and will continue at either 1st page or last
         page selections.  (i.e. when on *last* page, a *next* click will return to page 1)

         @attribute circular
         @type Boolean
         @default false
         **/
        circular : {
            value:      false,
            validator:  Y.Lang.isBoolean
        }

    }

});



}, 'gallery-2012.12.12-21-11', {"requires": ["model", "view", "substitute"], "skinnable": "true"});
