define(
['jquery', 'table/table-plugin-utils'],
function (jQuery, Utils) {
	/**
	 * Constructs a TableCell.
	 *
	 * @param {DomNode} cell
	 *        A td/th which will be represente by this TableCell.
	 * @param {Table} tableObj
	 *        The Table which contains the cell. The cell will be
	 *        activated/dactivated with the table.
	 */
	var TableCell = function(originalTd, tableObj) {
        if (null == originalTd) {
            originalTd = '<td>&nbsp;</td>';
        }

        //original Td must be a DOM node so that the this.obj.context property is available
        //this transformation will properly handle jQuery objects as well as DOM nodes
        originalTd = jQuery( originalTd ).get( 0 );

        this.obj = jQuery(originalTd);
        this.tableObj = tableObj;

        tableObj.cells.push(this);
	};

	/**
	 * Reference to the jQuery-representation of the wrapping table
	 *
	 * @see TableCell.table
	 */
	TableCell.prototype.tableObj = undefined;

	/**
	 * Reference to the jQuery td-Object of the cell
	 */
	TableCell.prototype.obj = undefined;

	/**
	 * The jQuery wrapper of the cell
	 */
	TableCell.prototype.wrapper = undefined;

	/**
	 * Flag if the cell has focus
	 */
	TableCell.prototype.hasFocus = false;

	TableCell.prototype.activate = function () {
		// wrap the created div into the contents of the cell
		this.obj.wrapInner( '<div/>' );

		// create the editable wrapper for the cells
		var wrapper = this.obj.children( 'div' ).eq( 0 );

		wrapper.contentEditable( true );
		wrapper.addClass( 'aloha-table-cell-editable' );

		var that = this;
		
		// attach events to the editable div-object
		wrapper.bind( 'focus', function ( jqEvent ) {
			// ugly workaround for ext-js-adapter problem in ext-jquery-adapter-debug.js:1020
			if ( jqEvent.currentTarget ) {
				jqEvent.currentTarget.indexOf = function () {
					return -1;
				};
			}
			that._editableFocus( jqEvent );
		} );
		
		wrapper.bind( 'mousedown', function ( jqEvent ) {
			// ugly workaround for ext-js-adapter problem in ext-jquery-adapter-debug.js:1020
			if ( jqEvent.currentTarget ) {
				jqEvent.currentTarget.indexOf = function () {
					return -1;
				};
			}
			
			that._editableMouseDown( jqEvent );

			that._startCellSelection();
		} );
		wrapper.bind( 'blur',      function ( jqEvent ) { that._editableBlur( jqEvent );    });
		wrapper.bind( 'keyup',     function ( jqEvent ) { that._editableKeyUp( jqEvent );   });
		wrapper.bind( 'keydown',   function ( jqEvent ) { that._editableKeyDown( jqEvent ); });
		wrapper.bind( 'mouseover', function ( jqEvent ) { that._selectCellRange();          });

		// we will treat the wrapper just like an editable
		wrapper.contentEditableSelectionChange( function ( event ) {
			Aloha.Selection.onChange( wrapper, event );
			return wrapper;
		} );

		this.obj.bind( 'mousedown', function ( jqEvent ) {
			window.setTimeout( function () {
				that.wrapper.trigger( 'focus' );
			}, 1 );
			that.tableObj.selection.unselectCells();
	        that._startCellSelection();       
			jqEvent.stopPropagation();
		} );

		if ( this.obj.get( 0 ) ) {
			this.obj.get( 0 ).onselectstart = function ( jqEvent ) { return false; };
		}

		// set contenteditable wrapper div
		this.wrapper = this.obj.children();
		if ( this.wrapper.get( 0 ) ) {
			this.wrapper.get( 0 ).onselectstart = function () {
				window.event.cancelBubble = true;
			};
			// Disabled the dragging of content, since it makes cell selection difficult
			this.wrapper.get( 0 ).ondragstart = function () { return false };
		}
		return this;
	};

	/**
	 * The deactivate method removes the contenteditable helper div within the
	 * table-data field and wraps the innerHtml to the outerHTML
	 *
	 * @return void
	 */
	TableCell.prototype.deactivate = function() {
		var wrapper = jQuery(this.obj.children('.aloha-table-cell-editable'));

		if (wrapper.length) {
			// unwrap cell contents without re-creating dom nodes
			wrapper.parent().append(
				wrapper.contents()
			);
			
			// remove the contenteditable div and its attached events
			wrapper.remove();
			

			// remove the click event of the
			this.obj.unbind('click');
			this.obj.unbind('mousedown');

			if (jQuery.trim(this.obj.attr('class')) == '') {
				this.obj.removeAttr('class');
			}
		}
	}

	/**
	 * Native toString-method
	 *
	 * @return string name of the namespace
	 */
	TableCell.prototype.toString = function() {
		return 'TableCell';
	};

	/**
	 * Focus method for the contentediable div within a table data-field. The method
	 * requires the event-property Cell as a Cell object. If the
	 * Cell wasn't activated yet it does all relevant actions to activate the cell.
	 *
	 * @param e
	 *            the jquery event object
	 * @return void
	 */
	TableCell.prototype._editableFocus = function(e) {
		// only do activation stuff if the cell don't has the focus
		if (!this.hasFocus) {
			// set an internal flag to focus the table
			this.tableObj.focus();

			// add an active-class
			this.obj.addClass('aloha-table-cell_active');

			// set the focus flag
			this.hasFocus = true;

			// unset the selection type
			this.tableObj.selection.selectionType = 'cell';

		}
	};

	/**
	 * Blur event for the contenteditable div within a table-data field. The method
	 * requires the event-property TableCell as a TableCell object. It
	 * sets the hasFocus flag of the cell to false and removes the "active"
	 * css-class.
	 *
	 * @param jqEvent
	 *            the jquery event object
	 * @return void
	 */
	TableCell.prototype._editableBlur = function(jqEvent){

		// reset the focus of the cell
		this.hasFocus = false;

		// remove "active class"
		this.obj.removeClass('aloha-table-cell_active');
	};

	/**
	 * Gives the X (column no) for a cell, after adding colspans 
	 */
	TableCell.prototype._virtualX = function(){
		var $rows = this.tableObj.obj.children().children('tr');
		var rowIdx = this.obj.parent().index();
		var colIdx = this.obj.index();
		return Utils.cellIndexToGridColumn($rows, rowIdx, colIdx);
	};

	/**
	 * Gives the Y (row no) for a cell, after adding colspans 
	 */
	TableCell.prototype._virtualY = function(){
		return this.obj.parent('tr').index();
	};

	/**
	 * Starts the cell selection mode
	 */
	TableCell.prototype._startCellSelection = function(){
		if(!this.tableObj.selection.cellSelectionMode){
			
			//unselect currently selected cells
			this.tableObj.selection.unselectCells();

			// activate cell selection mode
			this.tableObj.selection.cellSelectionMode = true; 
			
			//bind a global mouseup event handler to stop cell selection
			var that = this;
			jQuery('body').bind('mouseup.cellselection', function(){
				that._endCellSelection();
				
			});

			this.tableObj.selection.baseCellPosition = [this._virtualY(), this._virtualX()];
			
			
		}
	};

	/**
	 * Ends the cell selection mode
	 */
	TableCell.prototype._endCellSelection = function(){
		if(this.tableObj.selection.cellSelectionMode){
			this.tableObj.selection.cellSelectionMode = false; 
			this.tableObj.selection.baseCellPosition = null;
			this.tableObj.selection.lastSelectionRange = null; 

			this.tableObj.selection.selectionType = 'cell';

			//unbind the global cell selection event
			jQuery('body').unbind('mouseup.cellselection');
		}
	};

	TableCell.prototype._getSelectedRect = function () {
		var right = this._virtualX();
		var bottom = this._virtualY();
		var topLeft = this.tableObj.selection.baseCellPosition;
		var left = topLeft[1];
		if (left > right) {
			left = right;
			right = topLeft[1];
		}
		var top = topLeft[0];
		if (top > bottom) {
			top = bottom;
			bottom = topLeft[0];
		}
		return {"top": top, "right": right, "bottom": bottom, "left": left};
	};

	/**
	 * Toggles selection of cell.
	 * This works only when cell selection mode is active. 
	 */
	TableCell.prototype._selectCellRange = function(){
		if(!this.tableObj.selection.cellSelectionMode) {
			return;
		}

		var rect = this._getSelectedRect();

		var table = this.tableObj;
		var $rows = table.obj.children().children('tr');
		var grid = Utils.makeGrid($rows);
		
		table.selection.selectedCells = [];
		var selectClass = table.get('classCellSelected');
		Utils.walkGrid(grid, function (cellInfo, j, i) {
			if ( Utils.containsDomCell(cellInfo) ) {
				if (i >= rect.top && i <= rect.bottom && j >= rect.left && j <= rect.right) {
					jQuery( cellInfo.cell ).addClass(selectClass);
					table.selection.selectedCells.push(cellInfo.cell);
				} else {
					jQuery( cellInfo.cell ).removeClass(selectClass);
				}
			}
		});

		table.selection.notifyCellsSelected();
	};

	/**
	 * Selects all inner-contens of an contentEditable-object
	 *
	 * @param editableNode dom-representation of the editable node (div-element)
	 * @return void
	 */
	TableCell.prototype._selectAll = function(editableNode) {
		var e = (editableNode.jquery) ? editableNode.get(0) : editableNode;

		// Not IE
		if (!jQuery.browser.msie) {
			var s = window.getSelection();
			// WebKit
			if ( s.setBaseAndExtent /*&& e> 0 */ ) {
				s.setBaseAndExtent( e, 0, e, Math.max( 0, e.innerText.length - 1 ) );
			}
			// Firefox and Opera
			else {
				// workaround for bug # 42885
				if (window.opera
					&& e.innerHTML.substring(e.innerHTML.length - 4) == '<BR>') {
					e.innerHTML = e.innerHTML + '&#160;';
				}

				var r = document.createRange();
				r.selectNodeContents(e);
				s.removeAllRanges();
				s.addRange(r);
			}
		}
		// Some older browsers
		else if (document.getSelection) {
			var s = document.getSelection();
			var r = document.createRange();
			r.selectNodeContents(e);
			s.removeAllRanges();
			s.addRange(r);
		}
		// IE
		else if (document.selection) {
			var r = document.body.createTextRange();
			r.moveToElementText(e);
			r.select();
		}
	};

	/**
	 * The mouse-down event for the editable-div in the thd-field. Unselect all
	 * cells when clicking on the editable-div.
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	TableCell.prototype._editableMouseDown = function(jqEvent) {
		// deselect all highlighted cells registered in the this.tableObj.selection object
		this.tableObj.selection.unselectCells();

		if (this.tableObj.hasFocus) {
			jqEvent.stopPropagation();
		}
	};

	/**
	 * The key-up event for the editable-div in the td-field. Just check if the div
	 * is empty and insert an &nbsp;
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	TableCell.prototype._editableKeyUp = function( jqEvent ) {
		//TODO do we need to check for empty cells and insert a space?
		//this._checkForEmptyEvent(jqEvent);
	};

	/**
	 * The key-down event for the ediable-div in the td-field. Check if the the div
	 * is empty and insert an &nbsp. Furthermore if cells are selected, unselect
	 * them.
	 *
	 * @param jqEvent
	 *            the jquery-event object
	 * @return void
	 */
	TableCell.prototype._editableKeyDown = function(jqEvent) {
		var KEYCODE_TAB = 9;

		this._checkForEmptyEvent(jqEvent);
		
		if ( this.obj[0] === this.tableObj.obj.find('tr:last td:last')[0] ) {
			// only add a row on a single key-press of tab (so check
			// that alt-, shift- or ctrl-key are NOT pressed)
			if (KEYCODE_TAB == jqEvent.keyCode && !jqEvent.altKey && !jqEvent.shiftKey && !jqEvent.ctrlKey) {
				// add a row after the current row
				this.tableObj.addRow(this.obj.parent().index() + 1);

				// firefox needs this for the first cell of the new row
				// to be selected (.focus() doesn't work reliably in
				// IE7)
				this.tableObj.cells[this.tableObj.cells.length - 1]._selectAll(this.wrapper.get(0));

				jqEvent.stopPropagation();
				return;
			}
		}
	};

	/**
	 * The custom keyup event for a table-cell Checks if the cell is empty and
	 * inserts a space (\u00a0)
	 *
	 * @param e
	 *            the event object which is given by jquery
	 * @return void
	 */
	TableCell.prototype._checkForEmptyEvent = function(jqEvent) {
		var $wrapper = jQuery(this.wrapper),
		    text = $wrapper.text();

		if ( $wrapper.children().length > 0) {
			return;
		}

		// if empty insert a blank space and blur and focus the wrapper
		if ( text === '' ){
			this.wrapper.text('\u00a0');
			this.wrapper.get(0).blur();
			this.wrapper.get(0).focus();
		}
	};

	/**
	 * Given a cell, will return the container element of the contents
	 * of the cell. The container element may be the given cell itself,
	 * or a wrapper element, in the case of activated cells.
	 *
	 * @param {DomNode} cell 
	 *        the TH/TD of a TableCell that may or may not be actived.
	 * @return {DomNode}
	 *        the element that contains the contents of the given cell.
	 */
	TableCell.getContainer = function ( cell ) {
		if ( jQuery( cell.firstChild ).hasClass( "aloha-table-cell-editable" ) ) {
			return cell.firstChild;
		} else {
			return cell;
		}
	};

	return TableCell;
});
