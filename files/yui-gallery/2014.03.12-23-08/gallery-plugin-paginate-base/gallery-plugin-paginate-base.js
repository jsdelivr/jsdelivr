YUI.add('gallery-plugin-paginate-base', function(Y) {

/**
 * Paginate Base is a base configuration plugin used to extract common logic
 *   from paginate plugins.
 * @class Paginate.Base
 * @extends Y.Plugin
 * @version 1.0.0
 */
Y.namespace('Plugin.Paginate').Base = Y.Base.create('paginate', Y.Plugin.Base, [], {

  /**
   * Attaches default after events to changes in logic sesitive attributes
   * @public
   * @method initializer
   * @return void
   * @since 1.0.0
   */
  initializer : function () {
    this.after('currentPageNumberChange', this._afterCurrentPageNumberChange);
    this.after('totalItemsChange', this._afterTotalItemsChange);
    this.after('itemsPerPageChange', this._afterItemsPerPageChange);
  },

  /**
   * <interface> Requeries the data and reflows the content
   * @public
   * @method refresh
   * @return this
   * @chainable
   * @since 1.0.0
   */
  refresh : function() {
    return this;
  },

  /**
   * Checks to see if the requested page number is in range and updates the
   *   currentPageNumber to the new value
   * @public
   * @method gotoPage
   * @return this
   * @chainable
   * @since 1.0.0
   */
  gotoPage : function(pageNumber, forceRefresh) {
    // determine if page requested is out of range and set to closest if it is
    pageNumber = Math.max(1, Math.min(pageNumber, this.get('numberOfPages')));

    // set currentPageNumber to new page number
    if(this.get('currentPageNumber') !== pageNumber) {
      this.set('currentPageNumber', pageNumber);
    }else{
      if(forceRefresh){
        this.refresh();
      }
    }

    // return this for chaining
    return this;
  },

  /**
   * Requests to go to the page number one
   * @public
   * @method gotoFirstPage
   * @see gotoPage
   * @return this
   * @chainable
   * @since 1.0.0
   */
  gotoFirstPage : function() {
    return this.gotoPage(1);
  },

  /**
   * Requests to go to the page number of the total number of pages
   * @public
   * @method gotoLastPage
   * @see gotoPage
   * @return this
   * @chainable
   * @since 1.0.0
   */
  gotoLastPage : function() {
    return this.gotoPage(this.get('numberOfPages'));
  },

  /**
   * Requests to go to the page number of the current page - 1
   * @public
   * @method gotoPrevPage
   * @see gotoPage
   * @return this
   * @chainable
   * @since 1.0.0
   */
  gotoPrevPage: function() {
    return this.gotoPage(this.get('currentPageNumber') - 1);
  },

  /**
   * Requests to go to the page number of the current page + 1
   * @public
   * @method gotoNextPage
   * @see gotoPage
   * @return this
   * @chainable
   * @since 1.0.0
   */
  gotoNextPage : function() {
    return this.gotoPage(this.get('currentPageNumber') + 1);
  },

  /**
   * Returns true if the current page is greater than zero indicating there are
   *   previous pages to view
   * @public
   * @method hasPrevPage
   * @returns boolean
   * @since 1.0.0
   */
  hasPrevPage : function () {
    return (this.get('currentPageNumber') > 0 );
  },

  /**
   * Returns true if the current page is less than the total number of pages
   *   indicating there are more pages to view
   * @public
   * @method hasNextPage
   * @returns boolean
   * @since 1.0.0
   */
  hasNextPage : function () {
    return (this.get('currentPageNumber') < this.get('numberOfPages') );
  },

  /**
   * <interface>Updates widget with new paged content
   * @protected
   * @method _afterCurrentPageNumberChange
   * @return void
   * @since 1.0.0
   */
  _afterCurrentPageNumberChange : function(e) {
  },

  /**
   * Calculate new page number and number of pages from new total items value
   *   and items per page
   * @protected
   * @method _afterTotalItemsChange
   * @return void
   * @since 1.0.0
   */
  _afterTotalItemsChange : function(e) {
    // calculate new page number and number of pages
    var currentPageNumber = this.get('currentPageNumber'),
        itemNumber = this._updateCurrentIndex();

    this.set('numberOfPages', Math.ceil(e.newVal / this.get('itemsPerPage')));

    // if out of range
    if(itemNumber > e.newVal) { //go to last page
      this.gotoLastPage();
    }else{ // refresh this page incase
      this.gotoPage(currentPageNumber, true);
    }
  },

  /**
   * Calculate new page number and number of pages from total items and new
   *   items per page value
   * @protected
   * @method _afterItemsPerPageChange
   * @return void
   * @since 1.0.0
   */
  _afterItemsPerPageChange : function(e) {
    // calculate new page number and number of pages
    var numberOfPages = Math.ceil(this.get('totalItems') / e.newVal),
        itemNumber = (this.get('currentPageNumber') - 1) * e.prevVal + 1;

    this.set('numberOfPages', numberOfPages);
    
    this.gotoPage((itemNumber - 1) / e.newVal + 1, true);

  },

  /**
   * Recalculates the current index based on the current page number and total
   *   number of items per page
   * @protected
   * @method _updateCurrentIndex
   * @return Integer
   * @since 1.0.0
   */
  _updateCurrentIndex : function() {
    var currentIndex = (this.get('currentPageNumber') - 1) * this.get('itemsPerPage') + 1;
    this.set('currentIndex', currentIndex);
    return currentIndex;
  }

}, {
  NS : 'paginate',
  ATTRS : {

    numberOfPages : {
      value : 1,
      setter : function(val) {
        return parseInt(val,10);
      }
    },

    currentPageNumber : {
      value : 1,
      setter : function(val) {
        return parseInt(val,10);
      }
    },

    currentIndex : {
      value : 1,
      setter : function(val) {
        return parseInt(val,10);
      }
    },

    totalItems : {
      value : 1,
      setter : function(val) {
        return parseInt(val,10);
      }
    },

    itemsPerPage : {
      value : 10,
      setter : function(val) {
        return parseInt(val,10);
      }
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin','base']});
