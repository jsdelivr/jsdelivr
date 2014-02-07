kgGridReorderable = function (options) {
    var defaults = {
        enableHeader: true,
        enableRow: true
    };
    var self = this;
    self.config = $.extend(defaults, options);
    self.myGrid = null;

    // The init method gets called during the koGrid binding handler execution.
    self.onGridInit = function (grid) {
        /* logic */

    };
    self.onGridUpdate = function (grid) {
        /* logic */
        // The directive passes in the grid scope and the grid object which we will want to save for manipulation later.
        self.myGrid = grid;
        // In this example we want to assign grid events.
        self.assignEvents();
    };
    self.onRowsChanged = function (grid, rowCollection) {
        /* logic */
    };
    
    //internal funcs
    self.colToMove = undefined;
    self.rowToMove = undefined;
    self.assignEvents = function () {
        // Here we set the onmousedown event handler to the header container.
        if (self.config.enableHeader) {
            self.myGrid.$headerScroller.on('mousedown', self.onHeaderMouseDown).on('dragover', self.dragOver).on('drop', self.onHeaderDrop);
        }
        if (self.config.enableRow) {
            self.myGrid.$viewport.on('mousedown', self.onRowMouseDown).on('dragover', self.dragOver).on('drop', self.onRowDrop);
        }
    };
    self.dragOver = function(evt) {
        evt.preventDefault();
    };
    //Header functions
    self.onHeaderMouseDown = function (event) {
        // Get the closest header container from where we clicked.
        var headerContainer = $(event.srcElement).closest('.kgHeaderCell');
        var bindingContext = headerContainer[0] ? headerContainer[0]["bindingContext"] : undefined;
        // Get the scope from the header container
        if (bindingContext) {
            // set draggable events
            headerContainer.attr('draggable', 'true');
            headerContainer.on('dragstart', self.onHeaderDragStart).on('dragend', self.onHeaderDragStop);
            // Save the column for later.
            self.colToMove = { header: headerContainer, column: bindingContext.column };
        }
    };
    
    self.onHeaderDragStart = function () {
        // color the header so we know what we are moving
        if (self.colToMove) {
            self.colToMove.header.css('background-color', 'rgb(255, 255, 204)');
        }
    };
    
    self.onHeaderDragStop = function () {
        // Set the column to move header color back to normal
        if (self.colToMove) {
            self.colToMove.header.css('background-color', 'rgb(234, 234, 234)');
        }
    };

    self.onHeaderDrop = function (event) {
        self.onHeaderDragStop();
        // Get the closest header to where we dropped
        var headerContainer = $(event.srcElement).closest('.kgHeaderCell');
        var bindingContext = headerContainer[0] ? headerContainer[0]["bindingContext"] : undefined;
        if (bindingContext && self.colToMove) {
            // If we have the same column, do nothing.
            if (self.colToMove.column == bindingContext.column) return;
            // Splice the columns
            var cols = self.myGrid.columns();
            var coldefs = self.myGrid.config.columnDefs();
            kg.utils.forEach(cols, function(col, i) {
                coldefs[i].width = col.width();
            });
            coldefs.splice(self.colToMove.column.index, 1);
            coldefs.splice(bindingContext.column.index, 0, self.colToMove.column.def);
            // Fix all the indexes on the columns so if we reorder again the columns will line up correctly.
            self.myGrid.config.columnDefs(coldefs);
            // clear out the colToMove object
            self.colToMove = undefined;
        }
    };
    
    //// Row functions
    self.onRowMouseDown = function (event) {
        // Get the closest row element from where we clicked.
        var targetRow = $(event.srcElement).closest('.kgRow');
        // Get the data context from the row element
        var bindingContext = targetRow[0] ? targetRow[0]['bindingContext'] : undefined;;
        if (bindingContext) {
            // set draggable events
            targetRow.attr('draggable', 'true');
            // Save the row for later.
            self.rowToMove = { targetRow: targetRow, row: bindingContext };
        }
    };

    self.onRowDrop = function (event) {
        // Get the closest row to where we dropped
        var targetRow = $(event.srcElement).closest('.kgRow');
        // Get the scope from the row element.        
        var bindingContext = targetRow[0] ? targetRow[0]['bindingContext'] : undefined;
        if (bindingContext && self.rowToMove) {
            // If we have the same Row, do nothing.
            if (self.rowToMove.row == bindingContext) return;
            // Splice the Rows via the actual datasource
            var data = self.myGrid.data();
            var i = data.indexOf(self.rowToMove.row.entity());
            var j = data.indexOf(bindingContext.entity());
            data.splice(i, 1);
            data.splice(j, 0, self.rowToMove.row.entity());
            // clear out the rowToMove object
            self.rowToMove = undefined;
            self.myGrid.data(data);
            // if there isn't an apply already in progress lets start one
        }
    };
};
