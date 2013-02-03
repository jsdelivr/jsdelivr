/**
 * Place selection outside of table.
 * Select a column and delete it.
 * Now try and click another column.
 * You get and index out of bounds error caused
 * the fact that the selection is gone
 */

/**
 * Aloha Table Plugin
 * ------------------
 * This plugin provides advanced support for manipulating tables in Aloha
 * Editables.
 * Nested tables are not support. If nested tables are pasted into the
 * editable, they will simply be left alone.
 * Each (non-nested) table in the editable will have a corresponding Aloha
 * Table instance created for it, which will maintain internal state, and
 * information related to its DOM element.
 *
 * @todo: - selectRow/selectColumn should take into account the helper row/column.
 *			ie: selectRow(0) and selectColumn(0), should be zero indexed
 */

define( [
	'aloha',
	'aloha/jquery',
	'aloha/floatingmenu',
	'i18n!table/nls/i18n',
	'table/table-cell',
	'table/table-selection',
	'table/table-plugin-utils'
], function ( Aloha, jQuery, FloatingMenu, i18n, TableCell, TableSelection,
	          Utils ) {
	var undefined = void 0;
	var GENTICS = window.GENTICS;
	
	/**
	 * Constructor of the table object
	 *
	 * @param table
	 *            the dom-representation of the held table
	 * @return void
	 */
	var Table = function ( table, tablePlugin ) {
		// set the table attribut "obj" as a jquery represenation of the dom-table
		this.obj = jQuery( table );
		
		correctTableStructure( this );
		
		if ( !this.obj.attr( 'id' ) ) {
			this.obj.attr( 'id', GENTICS.Utils.guid() );
		}
		
		this.tablePlugin = tablePlugin;
		this.selection = new TableSelection( this );
		this.refresh();
	};

	jQuery.extend( Table.prototype, {
		/**
		 * Attribute holding the jQuery-table-represenation
		 */
		obj: undefined,

		/**
		 * The DOM-element of the outest div-container wrapped around the cell
		 */
		tableWrapper: undefined,

		/**
		 * An array of all Cells contained in the Table
		 *
		 * @see TableCell
		 */
		cells: undefined,

		/**
		 * Number of rows of the table
		 */
		numRows: undefined,

		/**
		 * Number of rows of the table
		 */
		numCols: undefined,

		/**
		 * Flag wether the table is active or not
		 */
		isActive: false,

		/**
		 * Flag wether the table is focused or not
		 */
		hasFocus: false,

		/**
		 * The editable which contains the table
		 */
		parentEditable: undefined,

		/**
		 * Flag to check if the mouse was pressed. For row- and column-selection.
		 */
		mousedown: false,

		/**
		 * ID of the column which was pressed when selecting columns
		 */
		clickedColumnId: -1,

		/**
		 * ID of the row which was pressed when selecting rows
		 */
		clickedRowId: -1,

		/**
		 * collection of columnindexes of the columns which should be selected
		 */
		columnsToSelect: [],

		/**
		 * collection of rowindexes of the rows which should be selected
		 */
		rowsToSelect: [],

		/**
		 * contains the plugin id used for interaction with the floating menu
		 */
		fmPluginId: undefined
	} );

	/**
	 * @hide
	 */
	Table.prototype.refresh = function () {
		// find the dimensions of the table
		this.numCols = this.countVirtualCols();

		var rows = this.getRows();
		this.numRows = rows.length;

		// init the cell-attribute with an empty array
		this.cells = [];

		// iterate over table cells and create Cell-objects
		for ( var i = 0; i < rows.length; i++ ) {
			var row = jQuery(rows[i]);
			var cols = row.children();
			for ( var j = 0; j < cols.length; j++ ) {
				var col = cols[j];
				var Cell = this.newCell( col );
			}
		}
	};

	Table.prototype.countVirtualCols = function () {
		var $firstRow = this.obj.children().children( 'tr:first-child' ).children();
		return $firstRow.length - $firstRow.filter( '.' + this.get( 'classLeftUpperCorner' ) ).length;
	};

	/**
	 * Wrapper-Mehotd to return a property of TablePlugin.get
	 *
	 * @see TablePlugin.get
	 * @param property
	 *            the property whichs value should be return
	 * @return the value associated with the property
	 */
	Table.prototype.get = function(property) {
		return this.tablePlugin.get(property);
	};

	/**
	 * Wrapper-Method for TablePlugin.set
	 *
	 * @see TablePlugin.set
	 * @param key
	 *            the key whichs value should be set
	 * @param value
	 *            the value for the key
	 * @return void
	 */
	Table.prototype.set = function(key, value) {
		this.tablePlugin.set(key, value);
	};
	
	/**
	 * Given an unbalanced table structure, pad it with the necessary cells to
	 * make it perfectly rectangular
	 *
	 * @param {Aloha.Table} tableObj
	 */
	function correctTableStructure ( tableObj ) {
		var table = tableObj.obj,
			
			i,
		    row,
		    rows = tableObj.getRows(),
		    rowsNum = rows.length,
			
			cols,
			colsNum,
			
		    colsCount,
		    maxColsCount = 0,
		    cachedColsCounts = [],
		    colsCountDiff,
		    colSpan;

		for ( i = 0; i < rowsNum; i++ ) {
			row = jQuery( rows[ i ] );
			cols = row.children( 'td, th' );
			colsNum = cols.length;
			colsCount = Utils.cellIndexToGridColumn( rows, i, colsNum - 1 ) + 1;
			
			// Check if the last cell in this row has a col span, to account
			// for it in the total number of colums in this row
			
			colSpan = parseInt( cols.last().attr( 'colspan' ), 10 );
			
			if ( colSpan == 0 ) {
				// TODO: support colspan=0
				// http://dev.w3.org/html5/markup/td.html#td.attrs.colspan
				// http://www.w3.org/TR/html401/struct/tables.html#adef-colspan
				// The value zero ("0") means that the cell spans all columns
				// from the current column to the last column of the column
				// group (COLGROUP) in which the cel
			} else if ( !isNaN( colSpan ) ) {
				// The default value of this attribute is one ("1"), so where this
				// is the case, we will remove such superfluous colspan attributes
				if ( colSpan == 1 ) {
					cols.last().removeAttr( 'colspan' );
				}

				colsCount += ( colSpan - 1 );
			}
			
			cachedColsCounts.push( colsCount );
			
			if ( colsCount > maxColsCount ) {
				maxColsCount = colsCount;
			}
		}
		
		for ( i = 0; i < rowsNum; i++ ) {
			colsCountDiff = maxColsCount - cachedColsCounts[ i ];
			if ( colsCountDiff > 0 ) {
				// Create as many td's as we need to complete the row
				jQuery( rows[ i ] ).append(
					( new Array( colsCountDiff + 1 ) ).join( '<td></td>' )
				);
			}
		}
	};
	
	/**
	 * Transforms the existing dom-table into an editable aloha-table. In fact it
	 * replaces the td-elements with equivalent TableCell-elements
	 * with attached events.
	 * Furthermore it creates wrapping divs to realize a click-area for row- and
	 * column selection and also attaches events.
	 *
	 * @return void
	 */
	Table.prototype.activate = function () {
		if ( this.isActive ) {
			return;
		}

		var that = this,
		    htmlTableWrapper,
		    tableWrapper, eventContainer;
		
		// alter the table attributes
		this.obj.addClass( this.get( 'className' ) );
		this.obj.contentEditable( false );
		
		// set an id to the table if not already set
		if ( this.obj.attr( 'id' ) == '' ) {
			this.obj.attr( 'id', GENTICS.Utils.guid() );
		}
		
		// unset the selection type
		this.selection.selectionType = undefined;

		// the eventContainer will be the tbody (if there is one), or the table (if no tbody exists)
		eventContainer = this.obj.children('tbody');
		if (eventContainer.length === 0) {
			eventContainer = this.obj;
		}

		eventContainer.bind( 'keydown', function ( jqEvent ) {
			if ( !jqEvent.ctrlKey && !jqEvent.shiftKey ) {
				if ( that.selection.selectedCells.length > 0 &&
						that.selection.selectedCells[ 0 ].length > 0 ) {
					that.selection.selectedCells[ 0 ][ 0 ].firstChild.focus();
				}
			}
		} );

		/*
		We need to make sure that when the user has selected text inside a
		table cell we do not delete the entire row, before we activate this
		
		this.obj.bind( 'keyup', function ( $event ) {
			if ( $event.keyCode == 46 ) {
				if ( that.selection.selectedColumnIdxs.length ) {
					that.deleteColumns();
					$event.stopPropagation();
				} else if ( that.selection.selectedRowIdxs.length ) {
					that.deleteRows();
					$event.stopPropagation();
				} else {
					// Nothing to delete
				}
			}
		} );
		*/
		
		// handle click event of the table
	//	this.obj.bind('click', function(e){
	//		// stop bubbling the event to the outer divs, a click in the table
	//		// should only be handled in the table
	//		e.stopPropagation();
	//		return false;
	//	});

		eventContainer.bind( 'mousedown', function ( jqEvent ) {
			// focus the table if not already done
			if ( !that.hasFocus ) {
				that.focus();
			}


	// DEACTIVATED by Haymo prevents selecting rows
	//		// if a mousedown is done on the table, just focus the first cell of the table
	//		setTimeout(function() {
	//			var firstCell = that.obj.find('tr:nth-child(2) td:nth-child(2)').children('div[contenteditable=true]').get(0);
	//			TableSelection.unselectCells();
	//			jQuery(firstCell).get(0).focus();
	//			// move focus in first cell
	//			that.obj.cells[0].wrapper.get(0).focus();
	//		}, 0);

			// stop bubbling and default-behaviour
			jqEvent.stopPropagation();
			jqEvent.preventDefault();
			return false;
		} );

		// ### create a wrapper for the table (@see HINT below)
		// wrapping div for the table to suppress the display of the resize-controls of
		// the editable divs within the cells
		tableWrapper = jQuery(
			'<div class="' + this.get( 'classTableWrapper' ) + '"></div>'
		);
		tableWrapper.contentEditable( false );

		// wrap the tableWrapper around the table
		this.obj.wrap( tableWrapper );

		// :HINT The outest div (Editable) of the table is still in an editable
		// div. So IE will surround the the wrapper div with a resize-border
		// Workaround => just disable the handles so hopefully won't happen any ugly stuff.
		// Disable resize and selection of the controls (only IE)
		// Events only can be set to elements which are loaded from the DOM (if they
		// were created dynamically before) ;)
		 
		htmlTableWrapper = this.obj.parents( '.' + this.get( 'classTableWrapper' ) );
		htmlTableWrapper.get( 0 ).onresizestart = function ( e ) { return false; };
		htmlTableWrapper.get( 0 ).oncontrolselect = function ( e ) { return false; };
		htmlTableWrapper.get( 0 ).ondragstart = function ( e ) { return false; };
		htmlTableWrapper.get( 0 ).onmovestart = function ( e ) { return false; };
		// the following handler prevents proper selection in the editable div in the caption!
		// htmlTableWrapper.get( 0 ).onselectstart = function ( e ) { return false; };

		this.tableWrapper = this.obj.parents( '.' + this.get( 'classTableWrapper' ) ).get( 0 );

		jQuery( this.cells ).each( function () {
			this.activate();
		} );

		// after the cells where replaced with contentEditables ... add selection cells
		// first add the additional columns on the left side
		this.attachSelectionColumn();
		// then add the additional row at the top
		this.attachSelectionRow();
		this.makeCaptionEditable();
		this.checkWai();
		this.isActive = true;

		Aloha.trigger( 'aloha-table-activated' );
	};

	/**
	 * Make the table caption editable (if present)
	 */
	Table.prototype.makeCaptionEditable = function() {
		var caption = this.obj.find('caption').eq(0);
		if (caption) {
			this.tablePlugin.makeCaptionEditable(caption);
		}
	};

  /**
   * check the WAI conformity of the table and sets the attribute.
   */
  Table.prototype.checkWai = function () {
    var w = this.wai;
    
    w.removeClass(this.get('waiGreen'));
    w.removeClass(this.get('waiRed'));
    
    // Y U NO explain why we must check that summary is longer than 5 characters?
    // http://cdn3.knowyourmeme.com/i/000/089/665/original/tumblr_l96b01l36p1qdhmifo1_500.jpg

    if (this.obj[0].summary.trim() != '') {
      w.addClass(this.get('waiGreen'));
    } else {
      w.addClass(this.get('waiRed'));
    }
  };

	/**
	 * Add the selection-column to the left side of the table and attach the events
	 * for selection rows
	 *
	 * @return void
	 */
	Table.prototype.attachSelectionColumn = function() {
		// create an empty cell
		var emptyCell = jQuery('<td>'),
			rowIndex, columnToInsert, rowObj, that = this, rows, i;

		// set the unicode '&nbsp;' code
		emptyCell.html('\u00a0');

		that = this;
		rows = this.obj.context.rows;

		// add a column before each first cell of each row
		for ( i = 0; i < rows.length; i++) {
			rowObj = jQuery(rows[i]);
			columnToInsert = emptyCell.clone();
			columnToInsert.addClass(this.get('classSelectionColumn'));
			columnToInsert.css('width', this.get('selectionArea') + 'px');
			//rowObj.find('td:first').before(columnToInsert);
			rowObj.prepend(columnToInsert);			
			// rowIndex + 1 because an addtional row is still added
			rowIndex = i + 1;

			// this method sets the selection-events to the cell
			this.attachRowSelectionEventsToCell(columnToInsert);
		}
	};

	/**
	 * Binds the needed selection-mouse events to the given cell
	 *
	 * @param cell
	 *            The jquery object of the table-data field
	 * @return void
	 */
	Table.prototype.attachRowSelectionEventsToCell = function(cell){
		var that = this;

		// unbind eventually existing events of this cell
		cell.unbind('mousedown');
		cell.unbind('mouseover');

		// prevent ie from selecting the contents of the table
		cell.get(0).onselectstart = function() { return false; };

		cell.bind('mousedown', function(e) {
			// set flag that the mouse is pressed
//TODO to implement the mousedown-select effect not only must the
//mousedown be set here but also be unset when the mouse button is
//released.
//			that.mousedown = true;
			return that.rowSelectionMouseDown(e);
		});

		cell.bind('mouseover', function(e){
			// only select more crows if the mouse is pressed
			if ( that.mousedown ) {
				return that.rowSelectionMouseOver(e);
			}
		});
	};

	/**
	 * Mouse-Down event for the selection-cells on the left side of the table
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	Table.prototype.rowSelectionMouseDown = function ( jqEvent ) {
		// focus the table (if not already done)
		this.focus();

		// if no cells are selected, reset the selection-array
		if ( this.selection.selectedCells.length == 0 ) {
			this.rowsToSelect = [];
		}

		// set the origin-rowId of the mouse-click
		this.clickedRowId = jqEvent.currentTarget.parentNode.rowIndex;

		// set single column selection
		if ( jqEvent.metaKey ) {
			var arrayIndex = jQuery.inArray( this.clickedRowId, this.rowsToSelect );
			if ( arrayIndex >= 0 ) {
				this.rowsToSelect.splice( arrayIndex, 1 );
			} else {
				this.rowsToSelect.push( this.clickedRowId );
			}
		// block of columns selection
		} else if ( jqEvent.shiftKey ) {
			this.rowsToSelect.sort( function( a, b ) { return a - b; } );
			var start = this.rowsToSelect[ 0 ];
			var end = this.clickedRowId;
			if ( start > end ) {
				start = end;
				end = this.rowsToSelect[ 0 ];
			}
			this.rowsToSelect = [];
			for ( var i = start; i <= end; i++ ) {
				this.rowsToSelect.push( i );
			}
		// single column
		} else {
			this.rowsToSelect = [ this.clickedRowId ];
		}

		// mark the selection visual
		this.selectRows();

		// prevent browser from selecting the table
		jqEvent.preventDefault();

		// stop bubble, otherwise the mousedown of the table is called ...
		jqEvent.stopPropagation();
		
		this.tablePlugin.summary.focus();

		// prevent ff/chrome/safare from selecting the contents of the table
		return false;
	};

	/**
	 * The mouse-over event for the selection-cells on the left side of the table.
	 * On mouse-over check which column was clicked, calculate the span between
	 * clicked and mouse-overed cell and mark them as selected
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	Table.prototype.rowSelectionMouseOver = function (jqEvent) {
		var rowIndex = jqEvent.currentTarget.parentNode.rowIndex,
			indexInArray, start, end, i;

		// only select the row if the mouse was clicked and the clickedRowId isn't
		// from the selection-row (row-id = 0)
		if (this.mousedown && this.clickedRowId >= 0) {

			// select first cell
			//var firstCell = this.obj.find('tr:nth-child(2) td:nth-child(2)').children('div[contenteditable=true]').get(0);
			//jQuery(firstCell).get(0).focus();

			indexInArray = jQuery.inArray(rowIndex, this.rowsToSelect);

			start = (rowIndex < this.clickedRowId) ? rowIndex : this.clickedRowId;
			end = (rowIndex < this.clickedRowId) ? this.clickedRowId : rowIndex;

			this.rowsToSelect = new Array();
			for ( i = start; i <= end; i++) {
				this.rowsToSelect.push(i);
			}

			// this actually selects the rows
			this.selectRows();

			// prevent browser from selecting the table
			jqEvent.preventDefault();

			// stop bubble, otherwise the mousedown of the table is called ...
			jqEvent.stopPropagation();

			// prevent ff/chrome/safare from selecting the contents of the table
			return false;
		}
	};

  /**
   * Binds the needed selection-mouse events to the given cell
   *
   * @param cell
   *            The jquery object of the table-data field
   * @return void
   */
	Table.prototype.attachSelectionRow = function () {
		var that = this;

		// create an empty td
		var emptyCell = jQuery('<td>');
		emptyCell.html('\u00a0');
		
		// get the number of columns in the table (first row)
		// iterate through all rows and find the maximum number of columns to add
		var numColumns = 0;
		for( var i = 0; i < this.obj.context.rows.length; i++ ){
			var curNumColumns = 0;
			
			for( var j = 0; j < this.obj.context.rows[i].cells.length; j++ ){
				var colspan = Utils.colspan( this.obj.context.rows[i].cells[j] );
				curNumColumns += colspan;
			}
			
			if( numColumns < curNumColumns ) {
				numColumns = curNumColumns;
			}
		}
		
		var selectionRow = jQuery('<tr>');
		selectionRow.addClass(this.get('classSelectionRow'));
		selectionRow.css('height', this.get('selectionArea') + 'px');

		for (var i = 0; i < numColumns; i++) {

			var columnToInsert = emptyCell.clone();
			// the first cell should have no function, so only attach the events for
			// the rest
			if (i > 0) {
				// bind all mouse-events to the cell
				this.attachColumnSelectEventsToCell(columnToInsert);
				//set the colspan of selection column to match the colspan of first row columns
			} else {
				var columnToInsert = jQuery('<td>').clone();
				columnToInsert.addClass(this.get('classLeftUpperCorner'));
				var clickHandler = function (e) {
					// select the Table 
					that.focus();
					that.selection.selectAll();

					// set the selection type before updateing the scope
					that.tablePlugin.activeTable.selection.selectionType = 'cell';
					that.tablePlugin.updateFloatingMenuScope();

					FloatingMenu.activateTabOfButton('rowheader');
					
					// As side-effect of the following call the focus
					// will be set on the first selected cell. 
					// This will be overwritten with the summary
					// attribute-field, if the setting summaryinsidebar
					// is false.
					that._removeCursorSelection();

					// jump in Summary field
					// attempting to focus on summary input field will occasionally result in the
					// following exception:
					//uncaught exception: [Exception... "Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIDOMHTMLInputElement.setSelectionRange]" nsresult: "0x80004005 (NS_ERROR_FAILURE)" location: "JS frame :: src/dep/ext-3.2.1/ext-all.js :: <TOP_LEVEL> :: line 11" data: no]
					// this occurs when the tab in which the summary field is contained is not visible
					// TODO: I'm adding a try catch clause here for the time being, but a proper solution, which addresses the problem of how to handle invisible fields ought to be persued.

					try {
						that.tablePlugin.summary.focus();
						e.stopPropagation();
						e.preventDefault();
					} catch (e) {
					}

					return false;
				};
				this.wai = jQuery('<div/>').width(25).height(12).click(clickHandler);
				columnToInsert.append(this.wai);
			}
			
			// add the cell to the row
			selectionRow.append(columnToInsert);
		}
		
		// global mouseup event to reset the selection properties
		jQuery(document).bind('mouseup', function(e) { that.columnSelectionMouseUp(e) } );
		
		this.obj.find('tr:first').before( selectionRow );
	};

	/**
	 * Binds the events for the column selection to the given cell.
	 *
	 * @param cell
	 *            the jquery object of the td-field
	 * @return void
	 */
	Table.prototype.attachColumnSelectEventsToCell = function ( cell ) {
		var that = this;

		// unbind eventually existing events of this cell
		cell.unbind( 'mousedown' );
		cell.unbind( 'mouseover' );

		// prevent ie from selecting the contents of the table
		cell.get( 0 ).onselectstart = function () { return false; };

		cell.bind( 'mousedown',  function ( e ) { that.columnSelectionMouseDown( e ) } );
		cell.bind( 'mouseover',  function ( e ) { that.columnSelectionMouseOver( e ) } );
	};
	
	/**
	 * Handles the mouse-down event for the selection-cells on the top of the
	 * menu
	 *
	 * @param {jQuery:Event} jqEvent - the jquery-event object
	 * @return void
	 */
	Table.prototype.columnSelectionMouseDown = function ( jqEvent ) {
		// focus the table (if not already done)
		this.focus();

		// if no cells are selected, reset the selection-array
		if ( this.selection.selectedCells.length == 0 ) {
			this.columnsToSelect = [];
		}
		
		// set the origin-columnId of the mouse-click
		this.clickedColumnId = jQuery( jqEvent.currentTarget.parentNode )
									.children().index( jqEvent.currentTarget );
		
		// set single column selection
		if ( jqEvent.metaKey ) {
			var arrayIndex = jQuery.inArray( this.clickedColumnId, this.columnsToSelect );
			if ( arrayIndex >= 0 ) {
				this.columnsToSelect.splice( arrayIndex, 1 );
			} else {
				this.columnsToSelect.push( this.clickedColumnId );
			}
		// block of columns selection
		} else if ( jqEvent.shiftKey ) {
			this.columnsToSelect.sort( function( a, b ) { return a - b; } );
			var start = this.columnsToSelect[ 0 ];
			var end = this.clickedColumnId;
			if ( start > end ) {
				start = end;
				end = this.columnsToSelect[ 0 ];
			}
			this.columnsToSelect = [];
			for ( var i = start; i <= end; i++ ) {
				this.columnsToSelect.push( i );
			}
		// single column
		} else {
			this.columnsToSelect = [ this.clickedColumnId ];
		}

		// mark the selection visual
		this.selectColumns();

		// prevent browser from selecting the table
		jqEvent.preventDefault();

		// stop bubble, otherwise the mousedown of the table is called ...
		jqEvent.stopPropagation();

		// prevent ff/chrome/safare from selecting the contents of the table
		return false;
	};
	
	/**
	 * Mouseover-event for the column-selection cell. This method calcluates the
	 * span between the clicked column and the mouse-overed cell and selects the
	 * columns inbetween. and mark them as selected
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	Table.prototype.columnSelectionMouseOver = function (jqEvent) {

		var 
			colIdx = jqEvent.currentTarget.cellIndex,
			columnsToSelect = [],
			start,
			end;
		
		// select all columns from the last clicked to the hoverd 
		if ( this.mouseDownColIdx ) {
			start = (colIdx < this.mouseDownColIdx) ? colIdx : this.mouseDownColIdx;
			end = (colIdx < this.mouseDownColIdx) ? this.mouseDownColIdx : colIdx;
			for (var i = start; i <= end; i++) {
				columnsToSelect.push(i);
			}
			this.selectColumns( columnsToSelect );
		}
	};
	
	/**
	 * MouseUp-event for the column-selection. This method resets the 
	 * selection mode
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	Table.prototype.columnSelectionMouseUp = function (jqEvent) {
		this.mouseDownColIdx = false;
	};

	/**
	 * Deletes the selected rows. If no row are selected, delete the row, where the
	 * cursor is positioned. If all rows of the table should be deleted, the whole
	 * table is deletet and removed from the tableRegistry.
	 *
	 * @return void
	 */
	Table.prototype.deleteRows = function() {
		var 
			rowIDs = [],
			rowsToDelete = {},
			table = this;

		// if a selection was made, delete the selected cells
		if (0 === this.selection.selectedCells.length) {
			return;
		}

		for (var i = 0; i < this.selection.selectedCells.length; i++) {
			rowsToDelete[this.selection.selectedCells[i].parentNode.rowIndex] = true;
		}

	    for (rowId in rowsToDelete) {
	       rowIDs.push(rowId);
	    }
	    
		// if all rows should be deleted, set a flag to remove the WHOLE table
		var deleteTable = false;
		if (rowIDs.length == this.numRows) {
			deleteTable = true;
		}

		// delete the whole table
		if (deleteTable) {
			var that = this;
			Aloha.showMessage(new Aloha.Message({
				title : i18n.t('Table'),
				text : i18n.t('deletetable.confirm'),
				type : Aloha.Message.Type.CONFIRM,
				callback : function (sel) {
					if (sel == 'yes') {
						that.deleteTable();
					}
				}
			}));
		} else {

			rowIDs.sort(function(a,b){return a - b;});

			// check which cell should be focused after the deletion
			var focusRowId = rowIDs[0];
			if (focusRowId > (this.numRows - rowIDs.length)) {
				focusRowId --;
			}

			// get all rows
			var rows = this.getRows();

			//splits all cells on the rows to be deleted
			jQuery.each( rowIDs, function ( unused, rowId ) {
				var row = rows[ rowId ];
				for (var i = 0; i < row.cells.length; i++) {
					Utils.splitCell( row.cells[i], function () {
						return table.newActiveCell().obj;
					});
				}
			});

			//decreases rowspans of cells that span the row to be deleted
			//and removes the row
			var grid = Utils.makeGrid( rows );
			jQuery.each( rowIDs, function ( unused, rowId ) {
				var row = grid[ rowId ];
				for ( var j = 0; j < row.length; ) {
					var cellInfo = row[ j ];
					var rowspan = Utils.rowspan( cellInfo.cell );
					if ( 1 < rowspan ) {
						jQuery( cellInfo.cell ).attr( 'rowspan', rowspan - 1);
					}
					j += cellInfo.colspan;
				}
				jQuery( rows[ rowId ] ).remove();
			});

			// reduce the attribute storing the number of rows in the table
			this.numRows -= rowIDs.length;

			// IE needs a timeout to work properly
			window.setTimeout( function() {
				var lastCell = jQuery( rows[1].cells[ focusRowId +1 ] );
				lastCell.focus();
			}, 5);

			// finally unselect the marked cells
			this.selection.unselectCells();
		}
	};

	/**
	 * Deletes the selected columns. If no columns are selected, delete the column, where the
	 * cursor is positioned. If all columns of the table should be deleted, the whole
	 * table is deleted from the dom and removed from the tableRegistry.
	 *
	 * @return void
	 */
	Table.prototype.deleteColumns = function() {
		var 
			colIDs = [],
			cellToDelete = [],
			// get all rows to iterate
		    rows = this.getRows(),
			that = this,
			changeColspan = [],
			focusColID,
			cells,
			cellInfo;
		
		var grid = Utils.makeGrid(rows);
		var selectColWidth = 1; //width of the select-row column

		// if all columns should be deleted, remove the WHOLE table
		// delete the whole table
		if ( this.selection.selectedColumnIdxs.length == grid[0].length - selectColWidth ) {
			
			Aloha.showMessage(new Aloha.Message({
				title : i18n.t('Table'),
				text : i18n.t('deletetable.confirm'),
				type : Aloha.Message.Type.CONFIRM,
				callback : function (sel) {
					if (sel == 'yes') {
						that.deleteTable();
					}
				}
			}));
			
		} else {
			
			colIDs.sort(function(a,b) {return a - b;} );
			
// TODO check which cell should be focused after the deletion
//			focusColID = colIDs[0];
//			if ( focusColID > (this.numCols - colIDs.length) ) {
//				focusColID --;
//			}

			//TODO there is a bug that that occurs if a column is
			//selected and deleted, and then a column with a greater
			//x-index is selected and deleted.

			//sorted so we delete from right to left to minimize interfernce of deleted rows
			var gridColumns = this.selection.selectedColumnIdxs.sort(function(a,b){ return b - a; });
			for (var i = 0; i < gridColumns.length; i++) {
				var gridColumn = gridColumns[i];
				for (var j = 0; j < rows.length; j++) {
					var cellInfo = grid[j][gridColumn];
					if ( ! cellInfo ) {
						//TODO this case occurred because of a bug somewhere which should be fixed
						continue;
					}
					if ( 0 === cellInfo.spannedX ) {
						if (1 < cellInfo.colspan) {
							var nCell = this.newActiveCell().obj;
							jQuery( cellInfo.cell ).after(nCell);
							nCell.attr('rowspan', cellInfo.rowspan);
							nCell.attr('colspan', cellInfo.colspan - 1);
						}
						jQuery( cellInfo.cell ).remove();
					} else {
						jQuery( cellInfo.cell ).attr('colspan', cellInfo.colspan - 1);
					}
					//ensures that always 0 === cellInfo.spannedY
					j += cellInfo.rowspan - 1;
				}
				//rebuild the grid to reflect the table structure change
				grid = Utils.makeGrid(rows);
			}

			// reduce the attribute storing the number of rows in the table
			this.numCols -= colIDs.length;

			// IE needs a timeout to work properly
			window.setTimeout( function() {
				var lastCell = jQuery( rows[1].cells[ focusColID +1 ] );
				lastCell.focus();
			}, 5);

			this.selection.unselectCells();
		}
	};

	/**
	 * Deletes the table from the dom and remove it from the tableRegistry.
	 *
	 * @return void
	 */
	Table.prototype.deleteTable = function() {
		var deleteIndex = -1;
		for (var i = 0; i < this.tablePlugin.TableRegistry.length; i++){
			if (this.tablePlugin.TableRegistry[i].obj.attr('id') == this.obj.attr('id')) {
				deleteIndex = i;
				break;
			}
		}
		if (deleteIndex >= 0) {
			// before deleting the table, deactivate it
			this.deactivate();

			this.selection.selectionType = undefined;
			this.tablePlugin.TableRegistry.splice(i, 1);

			// we will set the cursor right before the removed table
			var newRange = Aloha.Selection.rangeObject;
			// TODO set the correct range here (cursor shall be right before the removed table)
			newRange.startContainer = newRange.endContainer = this.obj.get(0).parentNode;
			newRange.startOffset = newRange.endOffset = GENTICS.Utils.Dom.getIndexInParent(this.obj.get(0).parentNode);
			newRange.clearCaches();

			this.obj.remove();
			this.parentEditable.obj.focus();
			// select the new range
			newRange.correctRange();
			newRange.select();
		}
	};

	/**
	 * @param {string} position
	 *            could be 'after' or 'before'. defines the position where the new
	 *            rows should be inserted
	 */
	function rowIndexFromSelection( position, selection ) {

		var newRowIndex = -1;
		
		// get the index where the new rows should be inserted
		var cellOfInterest = null;
		if ( 'before' === position ) {
			cellOfInterest = selection.selectedCells[ 0 ];
		} else if ( 'after' === position ) {
			var offset = selection.selectedCells.length - 1;
			cellOfInterest = selection.selectedCells[ offset ];
		}
		
		if (cellOfInterest && cellOfInterest.nodeType == 1) {
			newRowIndex = cellOfInterest.parentNode.rowIndex;
		}

		return newRowIndex;
	}

	/**
	 * Wrapper function for this.addRow to add a row before the active row
	 *
	 * @see Table.prototype.addRow
	 */
	Table.prototype.addRowBeforeSelection = function(highlightNewRows) {
		var newRowIndex = rowIndexFromSelection( 'before', this.selection );
		if ( -1 !== newRowIndex ) {
			this.addRow( newRowIndex );
		}
	};

	/**
	 * Wrapper function for this.addRow to add a row after the active row
	 *
	 * @see Table.prototype.addRow
	 */
	Table.prototype.addRowAfterSelection = function() {
		var newRowIndex = rowIndexFromSelection( 'after', this.selection );
		if ( -1 !== newRowIndex ) {
			this.addRow( newRowIndex + 1 );
		}
	};

	/**
	 * Adds a new row to the table.
	 *
	 * @param {int} rowIndex
	 *        the index at which the new row shall be inserted
	 */
	Table.prototype.addRow = function(newRowIndex) {

		var that = this;
		var rowsToInsert = 1;

		var numCols = this.countVirtualCols();
		var $rows = this.obj.children().children('tr');
		for (var j = 0; j < rowsToInsert; j++) {
			var insertionRow = jQuery('<tr>');

			// create the first column, the "select row" column
			var selectionColumn = jQuery('<td>');
			selectionColumn.addClass(this.get('classSelectionColumn'));
			this.attachRowSelectionEventsToCell(selectionColumn);
			insertionRow.append(selectionColumn);

			var grid = Utils.makeGrid($rows);
			var selectColOffset = 1;
			if ( newRowIndex >= grid.length ) {
				for (var i = selectColOffset; i < grid[0].length; i++) {
					insertionRow.append(this.newActiveCell().obj);
				}
			} else {
				for (var i = selectColOffset; i < grid[newRowIndex].length; ) {
					var cellInfo = grid[newRowIndex][i];
					if (Utils.containsDomCell(cellInfo)) {
						var colspan = cellInfo.colspan;
						while (colspan--) {
							insertionRow.append(this.newActiveCell().obj);
						}
					} else {
						jQuery( cellInfo.cell ).attr('rowspan', cellInfo.rowspan + 1);
					}
					i += cellInfo.colspan;
				}
			}

			if ( newRowIndex >= $rows.length ) {
				$rows.eq( $rows.length - 1 ).after( insertionRow );
			} else {
				$rows.eq( newRowIndex ).before( insertionRow );
			}
		}
		
		this.numRows += rowsToInsert;
	};

	/**
	 * Wrapper method to add columns on the right side
	 *
	 * @see Table.addColumns
	 * @return void
	 */
	Table.prototype.addColumnsRight = function () {
		this.addColumns('right');
	};

	/**
	 * Wrapper method to add columns on the left side
	 *
	 * @see Table.addColumns
	 * @return void
	 */
	Table.prototype.addColumnsLeft = function() {
		this.addColumns('left');
	};

	/**
	 * Inserts new columns into the table. Either on the right or left side. If
	 * columns are selected, the amount of selected columns will be inserted on the
	 * 'right' or 'left' side. If no cells are selected, 1 new column will be
	 * inserted before/after the column of the last active cell.
	 * As well all column-selection events must be bound to the firsts row-cell.
	 *
	 * @param position
	 *            could be 'left' or 'right'. defines the position where the new
	 *            columns should be inserted
	 * @return void
	 */
	Table.prototype.addColumns = function( position ) {
		var 
			that = this,
			emptyCell = jQuery( '<td>' ),
		    rows = this.getRows(),
			cell,
			currentColIdx,
			columnsToSelect = [],
			selectedColumnIdxs = this.selection.selectedColumnIdxs;
		
		if ( 0 === selectedColumnIdxs.length ) {
			return;
		}
		
		selectedColumnIdxs.sort( function ( a, b ) { return a - b; } );
		
		// refuse to insert a column unless a consecutive range has been selected
		if ( ! Utils.isConsecutive( selectedColumnIdxs ) ) {
			Aloha.showMessage( new Aloha.Message( {
				title : i18n.t( 'Table' ),
				text  : i18n.t( 'table.addColumns.nonConsecutive' ),
				type  : Aloha.Message.Type.ALERT
			} ) );
			return;
		}
		
		if ( 'left' === position ) {
			currentColIdx = selectedColumnIdxs[ 0 ];
			// inserting a row before the selected column indicies moves
			// all selected columns one to the right
			for ( var i = 0; i < this.selection.selectedColumnIdxs.length; i++ ) {
				this.selection.selectedColumnIdxs[ i ] += 1;
			}
		} else {//"right" == position
			currentColIdx = selectedColumnIdxs[ selectedColumnIdxs.length - 1 ];
		}
		
		var grid = Utils.makeGrid( rows );
		
		for ( var i = 0; i < rows.length; i++ ) {
			// prepare the cell to be inserted
			cell = emptyCell.clone();
			cell.html( '\u00a0' );

			// on first row correct the position of the selected columns
			if ( i == 0 ) {
				// this is the first row, so make a column-selection cell
				this.attachColumnSelectEventsToCell( cell );
			} else {
				// activate the cell for this table
				cellObj = this.newActiveCell( cell.get(0) );
				cell = cellObj.obj;
			}

			var leftCell = Utils.leftDomCell( grid, i, currentColIdx );
			if ( null == leftCell ) {
				jQuery( rows[i] ).prepend( cell );
			} else {
				if ( 'left' === position && Utils.containsDomCell( grid[ i ][ currentColIdx ] ) ) {
					jQuery( leftCell ).before( cell );
				} else {//right
					jQuery( leftCell ).after( cell );
				}
			}

			this.numCols++;
		}
	};

	/**
	 * Helper method to set the focus-attribute of the table to true
	 *
	 * @return void
	 */
	Table.prototype.focus = function() {
		if (!this.hasFocus) {
			if (!this.parentEditable.isActive) {
				this.parentEditable.obj.focus();
			}

			// @iefix
			this.tablePlugin.setFocusedTable(this);

			// select first cell
			// TODO put cursor in first cell without selecting
			//var firstCell = this.obj.find('tr:nth-child(2) td:nth-child(2)').children('div[contenteditable=true]').get(0);
			//jQuery(firstCell).get(0).focus();

		}

		// TODO workaround - fix this. the selection is updated later on by the browser
		// using setTimeout here is hideous, but a simple execution-time call will fail
	// DEACTIVATED by Haymo prevents selecting rows
	//	setTimeout('Aloha.Selection.updateSelection(false, true)', 50);

	};

	/**
	 * Helper method to set the focus-attribute of the table to false
	 *
	 * @return void
	 */
	Table.prototype.focusOut = function() {
		if (this.hasFocus) {
			this.tablePlugin.setFocusedTable(undefined);
			this.selection.selectionType = undefined;
		}
	};

	/**
	 * Undoes the cursor-selection after cells have been selected.  This
	 * is done to be more consistent in the UI - there should either be
	 * a cursor-selection or a cell-selection, but not both.
	 */
	Table.prototype._removeCursorSelection = function() {
		// We can't remove the selection on IE because whenever a
		// row/column is selected, and then another row/column is
		// selected, the browser windows scrolls to the top of the page
		// (som kind of browser bug).

		// This is no problem for IE because IE removes the
		// cursor-selection by itself and shows a frame around the
		// table, with resize handles (the frame seems useless).

		// On other browsers, we can't remove the selection because the
		// floating menu will disappear when one selects a rows/column
		// and types a key (that's the same effect as when one clicks
		// outside the editable).

		//TODO: currently, removing the cursor selection can't be
		//     reliably implemented.
		//if ( ! jQuery.browser.msie ) {
		//    Aloha.getSelection().removeAllRanges();
		//}

		// The following is a workaround for the above because we can't
		// leave the cursor-selection outside of the table, since
		// otherwise the floating menu scope will be incorrect when one
		// CTRL-clicks on the rows or columns.

		var selection = Aloha.getSelection();

		if ( !selection ||
				!selection._nativeSelection ||
					selection._nativeSelection._ranges.length == 0 ) {
			return;
		}

		var range = selection.getRangeAt( 0 );
		if ( null == range.startContainer ) {
			return;
		}

		// if the selection is  already in the table, do nothing
		if ( 0 !== jQuery( range.startContainer ).closest('table').length ) {
			return;
		}
		
		// if no cells are selected, do nothing
		if ( 0 === this.selection.selectedCells.length ) {
			return;
		}

		// set the foces to the first selected cell
		var container = TableCell.getContainer( this.selection.selectedCells[ 0 ] );
		jQuery( container ).focus();
	}

	/**
	 * Marks all cells of the specified column as marked (adds a special class)
	 *
	 * @return void
	 */
	Table.prototype.selectColumns = function ( columns ) {
		var columnsToSelect;
		
		if ( columns ) {
			columnsToSelect = columns;
		} else {
			columnsToSelect = this.columnsToSelect;
		}

		// ====== BEGIN UI specific code - should be handled on event aloha-table-selection-changed by UI =======
		// activate all column formatting button
		for ( var i = 0; i < this.tablePlugin.columnMSItems.length; i++ ) {
			this.tablePlugin.columnMSButton.showItem(this.tablePlugin.columnMSItems[i].name);
		}
		
		FloatingMenu.setScope(this.tablePlugin.name + '.column');
		
		this.tablePlugin.columnHeader.setPressed( this.selection.isHeader() );
		
		var rows = this.getRows();
		
		// set the first class found as active item in the multisplit button
		this.tablePlugin.columnMSButton.setActiveItem();
		for (var k = 0; k < this.tablePlugin.columnConfig.length; k++) {
			if ( jQuery(rows[0].cells[0]).hasClass(this.tablePlugin.columnConfig[k].cssClass) ) {
				this.tablePlugin.columnMSButton.setActiveItem(this.tablePlugin.columnConfig[k].name);
				k = this.tablePlugin.columnConfig.length;
			}
		}

		// ====== END UI specific code - should be handled by UI =======

		// blur all editables within the table
		this.obj.find('div.aloha-ui-table-cell-editable').blur();

		this.selection.selectColumns( columnsToSelect );

		this.selection.notifyCellsSelected();
		this._removeCursorSelection();
	};

	/**
	 * Marks all cells of the specified row as marked (adds a special class)
	 *
	 * @return void
	 */
	Table.prototype.selectRows = function () {
		
		//	// get the class which selected cells should have
		//    var selectClass = this.get('classCellSelected');
		//
		//    // unselect selected cells
		//    TableSelection.unselectCells();
		
		// activate all row formatting button
		for (var i = 0; i < this.tablePlugin.rowMSItems.length; i++ ) {
			this.tablePlugin.rowMSButton.showItem(this.tablePlugin.rowMSItems[i].name);
		}
		
		//    this.rowsToSelect.sort(function (a,b) {return a - b;});


		// set the status of the table header button to the status of the 
		// frist 2 selected cells (index 1+2). First cell is for selection.
		//	if ( this.rowsToSelect &&  this.rowsToSelect.length > 0 &&
		//		rowCells && rowCells[0] ) {
		//	    if ( rowCells[1]  ) {
		//	    	TablePlugin.rowHeader.setPressed(
		//	    			// take 1 column to detect if the header button is pressd
		//	    			rowsCells[1].nodeName.toLowerCase() == 'th' &&
		//	    			rowsCells[2].nodeName.toLowerCase() == 'th'
		//	    	);
		//	    } else {
		//	    	TablePlugin.rowHeader.setPressed( rowCells[1].nodeName.toLowerCase() == 'th');
		//	    }
		//	}
		// 
		for (var i = 0; i < this.rowsToSelect.length; i++) {
			var rowId = this.rowsToSelect[i];
			var rowCells = jQuery(this.getRows()[rowId].cells).toArray();
			if (i == 0) {
				// set the status of the table header button to the status of the first 2 selected
				// cells (index 1 + 2). The first cell is the selection-helper
				//        TablePlugin.rowHeader.setPressed(
				//          rowCells[1].nodeName.toLowerCase() == 'th'  &&
				//          rowCells[2].nodeName.toLowerCase() == 'th'
				////          jQuery(rowCells[1]).attr('scope') == 'col'
				//        );

				// set the first class found as active item in the multisplit button
				for (var j = 0; j < rowCells.length; j++) {
					this.tablePlugin.rowMSButton.setActiveItem();
					for ( var k = 0; k < this.tablePlugin.rowConfig.length; k++) {
						if (jQuery(rowCells[j]).hasClass(this.tablePlugin.rowConfig[k].cssClass) ) {
							this.tablePlugin.rowMSButton.setActiveItem(this.tablePlugin.rowConfig[k].name);
							k = this.tablePlugin.rowConfig.length;
						}
					}
				}
			}

			//      // shift the first element (which is a selection-helper cell)
			//      rowCells.shift();
			//
			//      TableSelection.selectedCells = TableSelection.selectedCells.concat(rowCells);
			//      
			//      jQuery(rowCells).addClass(this.get('classCellSelected'));
		}
		
		//    TableSelection.selectionType = 'row';
		FloatingMenu.setScope(this.tablePlugin.name + '.row');
		
		this.selection.selectRows( this.rowsToSelect );
		this.tablePlugin.columnHeader.setPressed( this.selection.isHeader() );

		// blur all editables within the table
		this.obj.find('div.aloha-ui-table-cell-editable').blur();

		this.selection.notifyCellsSelected();
		this._removeCursorSelection();
	};

	/**
	 * Deactivation of a Aloha-table. Clean up ... remove the wrapping div and the
	 * selection-helper divs
	 *
	 * @return void
	 */
	Table.prototype.deactivate = function() {
		this.obj.removeClass(this.get('className'));
		if (jQuery.trim(this.obj.attr('class')) == '') {
			this.obj.removeAttr('class');
		}
		this.obj.removeAttr('contenteditable');
	//	this.obj.removeAttr('id');

		// unwrap the selectionLeft-div if available
		if (this.obj.parents('.' + this.get('classTableWrapper')).length){
			this.obj.unwrap();
		}

		// remove the selection row
		this.obj.find('tr.' + this.get('classSelectionRow') + ':first').remove();
		// remove the selection column (first column left)
		var that = this;
		jQuery.each(this.obj.context.rows, function(){
			jQuery(this).children('td.' + that.get('classSelectionColumn')).remove();
		});

		// remove the "selection class" from all td and th in the table
		this.obj.find('td, th').removeClass(this.get('classCellSelected'));

		this.obj.unbind();
		this.obj.children('tbody').unbind();

		// wrap the inner html of the contentEditable div to its outer html
		for (var i = 0; i < this.cells.length; i++) {
			var Cell = this.cells[i];
			Cell.deactivate();
		}

		// remove editable span in caption (if any)
		this.obj.find('caption div').each(function() {
			jQuery(this).contents().unwrap();
		});

		// better unset ;-) otherwise activate() may think you're activated.
		this.isActive = false;
	};

	/**
	 * toString-method for Table object
	 *
	 * @return void
	 */
	Table.prototype.toString = function() {
		return 'Table';
	};

	Table.prototype.newCell = function(domElement) {
		return new TableCell(domElement, this);
	};

	Table.prototype.newActiveCell = function(domElement) {
		var cell = new TableCell(domElement, this);
		cell.activate();
		return cell;
	};

	/**
	 * @return the rows of the table as an array of DOM nodes
	 */
	Table.prototype.getRows = function () {
		//W3C DOM property .rows supported by all modern browsers
		var rows = this.obj.get( 0 ).rows;
		//converts the HTMLCollection to a real array
		return jQuery.makeArray( rows );
	};

	return Table;
});
