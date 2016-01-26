ngGridLayoutPlugin = function () {
	var self = this;
	this.grid = null;
    // The init method gets called during the koGrid binding handler execution.
    self.onGridInit = function (grid) {
        /* logic */
		self.grid = grid;
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
	this.updateGridLayout = function(){
		kg.domUtilityService.UpdateGridLayout(self.grid);
		self.grid.configureColumnWidths();
		kg.domUtilityService.BuildStyles(self.grid);
	};
}