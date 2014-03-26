YUI.add('gallery-shoveler', function(Y) {

(function(){
 
/**
* Shoveler creates an widget.
* 
* @param config {Object} Object literal specifying Shoveler configuration properties.
*
* @class Shoveler
* @constructor
* @extends Widget
*/
function Shoveler( config ){
    Shoveler.superclass.constructor.apply( this, arguments );
}

// Local constants
var ShovName = "shoveler",
	Lang = Y.Lang,
	REPLACECELL = 1,
	ADDCELL = 0,
	FORWARD = 0,
	BACKWARD = 1,
	BEFOREADDCELL = "BeforeAddCell",
	AFTERADDCELL = "AfterAddCell",
	BEFOREREMOVECELL = "BeforeRemoveCell",
	AFTERREMOVECELL = "AfterRemoveCell",
	BEFOREREPLACECELL = "BeforeReplaceCell",
	AFTERREPLACECELL = "AfterReplaceCell",
	AFTERCREATECELL = "AFTERCREATECELL",
	STARTSCROLL = "StartScroll",
	ENDSCROLL = "EndScroll",
	RENDERFINISHED = "RenderFinished",
	AFTERDATARETRIEVAL = "AfterDataRetrieval";

/**
 *  Static property provides a string to identify the class.
 *
 * @property Shoveler.NAME
 * @type String
 * @static
 */
Shoveler.NAME = ShovName;

/**
 * Static property used to define the default attribute 
 * configuration for the Shoveler.
 * 
 * @property Shoveler.ATTRS
 * @type Object
 * @static
 */
Shoveler.ATTRS = {
    /**
     * @description Number of cells in the shoveler.
	 * If the shoveler is dynamic this value won't always correspond with the length of the cells array
     *
     * @attribute numberOfCells
     * @default 0
     * @type Number
     */
    numberOfCells: {
        value: 0,
        validator: Lang.isNumber
    },
	/**
     * @description Should cells load dynamically.  This allows for cells to be loaded dymically.
	 * constructDataSrc and handleData will have to be defined to know how to propery extract and transform the data
     *
     * @attribute dynamic
     * @default false
     * @type Boolean
     */
	dynamic: {
		value: false,
		validator: Lang.isBoolean
	},
	
	/**
     * @description Should the shoveler go on infinitely.  If infinite is true then cyclical will be false.
     *
     * @attribute infinite
     * @default false
     * @type Boolean
     */
	infinite: {
		value: false,
		validator: Lang.isBoolean
	},
	
	/**
     * @description Number of cells to be display in the main contents of the shoveler
     *
     * @attribute numberOfVisibleCells
     * @default 1
     * @type Number
     */
	numberOfVisibleCells: {
		value: 1,
		validator: Lang.isNumber
	},
	
	/**
     * @description Is the shoveler cyclical.
	 * If cyclical is true going foward from the last page will bring you back to the first page
     *
     * @attribute numberOfItems
     * @default false
     * @type Boolean
     */
	cyclical: {
		value: false,
		validator: function(val, name) {
			if((this.get("infinite") || (this.get("infinite") === undefined)) && val) {
				return false;
			}
			return true;
		}
	},

	/**
     * @description The cell to be display is the cell is in the loading state
     *
     * @attribute loadingCell
     * @default <div class='yui-shoveler-loading'></div>
     * @type String
     */
	loadingCell: {
		value: "<div class='yui-shoveler-loading'></div>"
	},
	
	/**
     * @description Class name for the buttons
     *
     * @attribute button
     * @default button (turns into yui-shoveler-button)
     * @type String
     */
	button: {
		value: 'button',
		validator: Lang.isString
	},
	
	/**
     * @description Class name for the button mouse down state
     *
     * @attribute buttonOn
     * @default on (turns into yui-shoveler-button-on)
     * @type String
     */
	buttonOn: {
		value: 'on',
		validator: Lang.isString
	},
	
	/**
     * @description Class name for the buttons when disabled
     *
     * @attribute buttonDisabled
     * @default disabled (turns into yui-shoveler-button-disabled)
     * @type String
     */
	buttonDisabled: {
		value: 'disabled',
		validator: Lang.isString
	},
	
	/**
     * @description Tells if the shoveler should prefetch dynamic content that is not currently being rendered.
     *
     * @attribute prefetch
     * @default false
     * @type Boolean
     */
	prefetch: {
		value: false,
		validator: Lang.isBoolean
	},
	
	/**
     * @description delay in milliseconds for the some animation transitions
     *
     * @attribute delay
     * @default 35
     * @type Number
     */
	delay: {
		value: 35,
		validator: Lang.isNumber
	},
	
	/**
     * @description The page the shoveler is on.  Setting this will change the starting page.
     *
     * @attribute page
     * @default 0
     * @type Number
     */
	page: {
		value: 0,
		validator: Lang.isNumber,
		setter: function(val, name) {
			if(this.get("cyclical")) {
				return (val % this.get("numberOfPages") + this.get("numberOfPages"))%this.get("numberOfPages");
			} else {
				if(this.get("infinite")) {
					return Math.max(val, 0);
				} else {
					return Math.max(Math.min(this.get("numberOfPages")-1, val), 0);
				}
			}
		}
	},
	
	/**
     * @description Number Of Pages in the shoveler.
	 * This value should not be alter for it gets set by the number of cells and number of visible cells
     *
     * @attribute numberOfPages
     * @default 0
     * @type Number
     */
	numberOfPages: {
		value: 0,
		validator: Lang.isNumber
	},
	
	/**
     * @description Index of the first visible cell
     *
     * @attribute firstVisibleCell
     * @default 0
     * @type Number
     */
	firstVisibleCell: {
		value: 0,
		validator: Lang.isNumber
	},
	
	/**
     * @description Index of the last visible cell
     *
     * @attribute lastVisibleCell
     * @default 0
     * @type Number
     */
	lastVisibleCell: {
		value: 0,
		validator: Lang.isNumber,
		setter: function(val, name) {
			return Math.min(val, this.get("numberOfCells")-1);
		}
	},
	
	/**
     * @description An array of cells the shoveler is storing
     *
     * @attribute cells
     * @default []
     * @type Array
     */
	cells: {
		value: [],
		validator: Lang.isArray
	},
	
	/**
     * @description Class name for the shoveler cell
     *
     * @attribute cellClass
     * @default cell
     * @type String
     */
	cellClass: {
		value: 'cell',
		validator: Lang.isString
	},
	
	/**
     * @description Class name for the html element to place the text to show the current page
     *
     * @attribute pageTextClass
     * @default page-text
     * @type String
     */
	pageTextClass: {
		value: 'page-text',
		validator: Lang.isString
	},
	
	/**
     * @description Class name for the UL to render the cells
     *
     * @attribute ulClass
     * @default cells
     * @type String
     */
	ulClass: {
		value: 'cells',
		validator: Lang.isString
	},
	
	/**
     * @description Strings for the shoveler.
     *
     * @type String
     */
	strings: {
		value: {
			NumberOfPagesPrefix: "Page",
			NumberOfPagesConnection: "of",
			NumberOfPagesStart: "start over"
		}
	},
	
	/**
     * @description This is the name of the function to render the transitions between pages
     *
     * @attribute renderFunctionName
     * @default renderCells
     * @type String
     */
	renderFunctionName: {
		value: "renderCells"
	},
	
	/**
     * @description Key/Value for the index(key) of the cell that is loading with the node(value) being rendered
     *
     * @attribute listOfLoadingCells
     * @default {}
     * @type object
     */
	listOfLoadingCells: {
		value: {}
	},
	
	/**
     * @description a stylesheet we can use to alter certain styles on the page
     *
     * @attribute stylesheet
     * @default undefined
     * @type Node
     */
	stylesheet: {
		value: undefined
	},
	
	/**
     * @description Function to create data src for an ajax request to get dynammic content.
     *
     * @attribute contructDataSrc
     * @default function(start, numberOfVisibleCells) {}
     * @type Function
     */
	contructDataSrc: {
		value: function(start, numberOfVisibleCells) {},
		validator: Lang.isFunction
	},
	
	/**
     * @description Function to handle the data retrieved by the dynamic call
     *
     * @attribute handleData
     * @default function(data) {}
     * @type Function
     */
	handleData: {
		value: function(data) {},
		validator: Lang.isFunction
	},
	
	/**
     * @description Reference to the left button
     *
     * @attribute leftButton
     * @default undefined
     * @type Node
     */
	leftButton: {
		value: undefined
	},
	
	/**
     * @description Reference to the right button
     *
     * @attribute leftButton
     * @default undefined
     * @type Node
     */
	rightButton: {
		value: undefined
	}
};

Y.extend( Shoveler, Y.Widget, {
	/**
     * Initialize the shoveler.  Publish events to listen to and set some defaults
     *
     * @method initializer
     * @param config
     */
	initializer: function( config ) {
		this.renderFunction = this[this.get("renderFunctionName")];
		
		/**
         * Signals begaining to add a cell
         *
         * @event BeforeAddCell
         */
		this.publish( BEFOREADDCELL );
		/**
         * Signals after a cell was added
         *
         * @event AfterAddCell
         */
		this.publish( AFTERADDCELL );
		/**
         * Signals removing a cell
         *
         * @event BeforeRemoveCell
         */
		this.publish( BEFOREREMOVECELL );
		/**
         * Signals after a cell is removed
         *
         * @event AfterRemoveCell
         */
		this.publish( AFTERREMOVECELL );
		/**
         * Signals replacing a cell
         *
         * @event BeforeReplaceCell
         */
		this.publish( BEFOREREPLACECELL );
		/**
         * Signals a cell has been replaced
         *
         * @event AfterReplaceCell
         */
		this.publish( AFTERREPLACECELL );
		/**
         * Signals a cell has been created
         *
         * @event AfterCreateCell
         */
		this.publish( AFTERCREATECELL );
		/**
         * Signals a scroll has started
         *
         * @event StartScroll
         */
		this.publish( STARTSCROLL );
		/**
         * Signals a scroll has ended
         *
         * @event EndScroll
         */
		this.publish( ENDSCROLL );
		/**
         * Signals that rendering has finished
         *
         * @event RenderFinished
         */
		this.publish( RENDERFINISHED );
		/**
         * Signals that data has been retrieved
         *
         * @event AfterDataRetrieval
         */
		this.publish( AFTERDATARETRIEVAL );
    },
	
	/**
     * Destructor for the shoveler.
     *
     * @method destructor
     */
	destructor: function() {
	},
	
	/**
     * Render UI componants.  Add the stylesheet to the page
     *
     * @method renderUI
     */
	renderUI: function(){
		this.set("stylesheet", Y.StyleSheet());
	},
	
	/**
     * Bind event listeners to the different UI componants
	 * Bind for attributes and button changes
     *
     * @method bindUI
     */
	bindUI: function(){
	
		this.after("pageChange", Y.bind( this.onPageChange, this ));
		this.after("cellsChange", Y.bind( this.onCellsChange, this ));
		this.after("numberOfVisibleCellsChange", Y.bind( this.onNumberOfCellsChange, this ));
		this.after("numberOfVisibleCellsChange", Y.bind( this.adjustCellWidth, this ));
		this.after("numberOfVisibleCellsChange", Y.bind( this.onNumberOfVisibleCellsChange, this ));
		this.after("numberOfCellsChange", Y.bind( this.calculateNumberOfPages, this ));
		this.after("numberOfPagesChange", Y.bind( this.onNumberOfPagesChange, this ));
		
		this.get("contentBox").delegate('click', Y.bind( this.startOver, this ), "."+this.getClassName("start"));
		var left = this.get("contentBox").one("."+this.getClassName(this.get("button"), "left")), 
		right = this.get("contentBox").one("."+this.getClassName(this.get("button"), "right"));
		
		this.set("leftButton", left);
		this.set("rightButton", right);
		
		left.on("click", Y.bind(this.scrollBackwards, this));
		right.on("click", Y.bind(this.scrollForward, this));
		left.on("mousedown", Y.bind(this.mouseDownOnButton, this));
		right.on("mousedown", Y.bind(this.mouseDownOnButton, this));
		left.on("mouseup", Y.bind(this.mouseUpOnButton, this));
		right.on("mouseup", Y.bind(this.mouseUpOnButton, this));
		
	},
	
	/**
     * Gather data already in the HTML.  Store it and clear the shoveler.
     *
     * @method syncUI
     */
	syncUI: function() {
		var ul, cells, cellList = [];
		this.adjustCellWidth();
		this.calculateNumberOfPages();
		
		ul = this.get("contentBox").one("ul."+this.getClassName(this.get("ulClass")));
		this.set("ul", ul);
		
		cells = ul.all("li."+this.getClassName(this.get("cellClass")));
		cells.each(function(node, index, list){
			cellList.push(node.cloneNode(true));
		});
		
		this.clearCells();
		
		this.set("cells", cellList);
		
		this.initRender();
	},
	
	/**
     * Render the shoveler for the first time.
	 * Set page text, first and last indexes, render the inital cells, and check the button styling
     *
     * @method initRender
     */
	initRender: function() {
		this.setPageText();
		this.setFirstAndLast();
		this.renderCells(this.getVisibleCells());
		this.disableButtons();
	},
	
	/**
     * Set the firstVisibleCell and the LastVisibleCell for the current page view
     *
     * @method setFirstAndLast
     */
	setFirstAndLast: function() {
		this.set("firstVisibleCell", this.get("page")*this.get("numberOfVisibleCells"));
		this.set("lastVisibleCell", this.get("firstVisibleCell")+this.get("numberOfVisibleCells")-1);
	},
	
	/**
     * If the page changes update the text and buttons
     *
     * @method onPageChange
     */
	onPageChange: function() {
		this.setPageText();
		this.disableButtons();
	},
	
	/**
     * Make sure buttons are enabled/disabled visually.
     *
     * @method disableButtons
     */
	disableButtons: function() {
		if(!this.get("cylical")) {
			if( this.get("page") === 0 ) {
				this.get("leftButton").addClass(this.getClassName("disabled"));
				this.get("rightButton").removeClass(this.getClassName("disabled"));
			} else if( this.get("page") == this.get("numberOfPages")-1) {
				this.get("leftButton").removeClass(this.getClassName("disabled"));
				this.get("rightButton").addClass(this.getClassName("disabled"));
			} else {
				this.get("leftButton").removeClass(this.getClassName("disabled"));
				this.get("rightButton").removeClass(this.getClassName("disabled"));
			}
		}
	},
	
	/**
     * Construct the string for the page information header, and set it as content in the dom
	 * If the shoveler has infinite page just write the current page
	 * If not on the first page add link to return to the page
     *
     * @method setPageText
     */
	setPageText: function() {
		var header = this.get("contentBox").one("."+this.getClassName(this.get("pageTextClass"))),
		text;
		if(this.get("numberOfPages") > 0) {
			text = this.get("strings").NumberOfPagesPrefix + " " + (this.get("page")+1);
			if(!this.get("infinite")) {
				text += " " + this.get("strings").NumberOfPagesConnection + " " + this.get("numberOfPages");
			}
			if(this.get("page") > 0) {
				text += " (<a class='"+this.getClassName("start")+"'>"+this.get("strings").NumberOfPagesStart+"</a>)";
			}
		}
		if(header && text) {
			header.setContent(text);
		}
	},
	
	/**
     * When the mouse is down on a button, add a class so it can be rendered properly.
     *
     * @method mouseDownOnButton
	 * @param event {event} that triggered mouse down
     */
	mouseDownOnButton: function(event) {
		event.target.addClass(this.getClassName(this.get("button"), this.get("buttonOn")));
	},
	
	/**
     * When the mouse is up on a button, remove a class so it can be rendered properly.
     *
     * @method mouseUpOnButton
	 * @param event {event} that triggered mouse up
     */
	mouseUpOnButton: function(event) {
		event.target.removeClass(this.getClassName(this.get("button"), this.get("buttonOn")));
	},
	
	/**
     * Add a cell to the shoveler
     *
     * @method addCell
	 * @param content {string} the content of the cell. Defaults to empty string
	 * @param index {number} (optional) the index to add the cell to.  Default will add to the end of cells
     */
	addCell: function( content, index ) {
		this.fire( BEFOREADDCELL, { content: content });
		var newCell = this.insertIntoCells(content, index, ADDCELL);
		this.fire( AFTERADDCELL, { cell: newCell} );
	},
	
	/**
     * Add multiple cells to the shoveler
     *
     * @method addCells
	 * @param cells {array} array of strings to be used as content of differnt cells.
     */
	addCells: function(cells) {
		for(var i = 0, len = cells.length; i < len; i++) {
			this.addCell(cells[i]);
		}
	},
	
	/**
     * adjust the width of the cells, by altering the stylesheet
     *
     * @method adjustCellWidth
     */
	adjustCellWidth: function() {
		var width = 90/this.get("numberOfVisibleCells");
		this.get("stylesheet").set("#"+this.get("contentBox").getAttribute("id")+" li."+this.getClassName(this.get("cellClass")), {
			"width" : width+"%"
		});

	},
	
	/**
     * Converts the content of a cell to an actual cell
     *
     * @method createCell
	 * @param content {string} string for the content of the cell
	 * @return the new created cell
     */
	createCell: function(content) {
		if(content === undefined){
			content = "";
		}
		var newCell = Y.Node.create("<li>"+content+"</li>");
		newCell.addClass(this.getClassName(this.get("cellClass")));
		
		this.fire( AFTERCREATECELL , { cell: newCell } );
		
		return newCell;
	},
	
	/**
     * builds a loading cell
     *
     * @method createLoadingCell
	 * @return the new created cell for the loading cell
     */
	createLoadingCell: function() {
		return this.createCell(this.get("loadingCell"));
	},
	
	/**
     * Helper function to insert into cells.
	 * Builds a cell and adds it the the cell list.
	 * If adding past the end fill empty cells with undefined.
     *
     * @method insertIntoCells
	 * @param content {string} the content of the cell. Defaults to empty string
	 * @param index {number} (optional) the index to add the cell to.  Default will add to the end of cells
	 * @param replace {ADD|REPLACE} (optional) should I replace a cell or add one.  Defaults to add.
	 * @return {Node} the newly created cell 
     */
	insertIntoCells: function(content, index, replace) {
		var newCell = this.createCell(content),
		cells = this.get("cells");
		if(replace === undefined) {
			replace = 0;
		}

		if(index === undefined) {
			index = cells.length;
		}
		if(this.get("dynamic")) {
			while( index > cells.length ) {
				cells.push(undefined);
			}
		}
		
		cells.splice(index, replace, newCell);
		this.set("cells", cells);
		
		if(this.get("dynamic")) {
			this.checkIfLoading(newCell, index);
		}
		return newCell;
	},
	
	/**
     * Check if the cell is waited to be loaded.
	 * If so render it on the page, and delete reference in our list of loading cells
     *
     * @method checkIfLoading
	 * @param cell {Node} the cell trying to be rendered
	 * @param index {number} the index of the cell we are trying to add
     */
	checkIfLoading: function(cell, index) {
		var loadingCells = this.get("listOfLoadingCells");
		if(loadingCells[index]) {
			this.get("ul").replaceChild(cell, loadingCells[index]);
			delete loadingCells[index];
		}
	},
	
	/**
     * Remove a cell from the list
     *
     * @method removeCell
	 * @param index {number} the index of the cell we are trying to remove
     */
	removeCell: function( index ) {
		var cells, oldCell;
		this.fire( BEFOREREMOVECELL, { index: index });
		cells = this.get("cells");
		oldCell = cells.splice(index, 1);
		this.set("cells", cells);
		this.fire( AFTERREMOVECELL, { cell: oldCell} );
	},
	
	/**
     * replace a cell in the shoveler
     *
     * @method replaceCell
	 * @param content {string} the content of the cell. Defaults to empty string
	 * @param index {number} (optional) the index of the cell to be replaced
     */
	replaceCell: function(content, index) {
		this.fire( BEFOREREPLACECELL, { content: content } );
		var newCell = this.insertIntoCells(content, index, REPLACECELL);
		this.fire( AFTERREPLACECELL, { cell: newCell} );
	},
	
	/**
     * replace cells in the shoveler
     *
     * @method replaceCells
	 * @param newCells {array} an array of objects that contance a content and index for a cell to be replaced
     */
	replaceCells: function(newCells) {
		for(var i = 0, len = newCells.length; i < len; i++) {
			this.replaceCell(newCells[i].content, newCells[i].index);
		}
	},
	
	/**
     * when the list of cells changes updated the number of cells and re render if at the end
     *
     * @method onCellsChange
	 * @param newCells {array} an array of objects that contance a content and index for a cell to be replaced
     */
	onCellsChange: function() {
		if(!this.get("dynamic")) {
			this.set("numberOfCells", this.get("cells").length);
		} else {
			this.set("numberOfCells", Math.max(this.get("cells").length, this.get("numberOfCells")));
		}

		if(this.get("page") == this.get("numberOfPages")-1 && !this.get("dynamic")) {
			this.setFirstAndLast();
			this.renderCells(this.getVisibleCells());
		}
	},
	
	/**
     * Calculate the number of pages for the shoveler
     *
     * @method calculateNumberOfPages
     */
	calculateNumberOfPages: function() {
		this.set("numberOfPages", Math.ceil(this.get("numberOfCells")/this.get("numberOfVisibleCells")));
	},
	
	/**
     * Given an index, what page is it on
     *
     * @method getPageForIndex
	 * @param index {number} index in cells of a item
     */
	getPageForIndex: function(index) {
		return Math.floor(index/this.get("numberOfVisibleCells"));
	},
	
	/**
     * When the number of visible cells change change the last visible cell index and render more/less cells
     *
     * @method onNumberOfVisibleCellsChange
	 * @param event {event} stores the new value of the number of visible cells
     */
	onNumberOfVisibleCellsChange: function(event) {
		this.set("lastVisibleCell", this.get("firstVisibleCell")+event.newVal);
		this.renderCells(this.getVisibleCells());
	},
	
	/**
     * If the page changes set the text.
     *
     * @method onNumberOfPagesChange
     */
	onNumberOfPagesChange: function() {
		this.setPageText();
	},
	
	/**
     * Empty the shoveler and remove the cells
     *
     * @method removeAllCells
     */
	removeAllCells: function() {
		this.clearCells();
		this.set("cells", []);
	},
	
	/**
     * Remove the cells from the dom
     *
     * @method clearCells
     */
	clearCells: function() {
		this.get("ul").all("li."+this.getClassName(this.get("cellClass"))).remove();
	},
	
	/**
     * Retrieve a cell from the list
     *
     * @method getCell
	 * @param index {number} index of the cell
	 * @return {Node} the cell coresponding with the index
     */
	getCell: function(index) {
		return this.get("cells")[index];
	},
	
	/**
     * Retrieve all cells from the list
     *
     * @method getAllCells
	 * @return {array} an array of cells
     */
	getAllCells: function() {
		return this.get("cells");
	},
	
	/**
     * Retrieve the first visible cell
     *
     * @method getFirstVisibleCell
	 * @return cell {Node} the cell of the first visible cell
     */
	getFirstVisibleCell: function() {
		return this.get("cells")[this.get("firstVisibleCell")];
	},
	
	/**
     * First retrieves the cells stored to be rendered
	 * If there is dynamic content create and prepare loading cells
	 * Add empty cells at the end
	 * If loading cells were added call fetchNextCell to gather data for these cells
     *
     * @method getVisibleCells
	 * @return {array} array of cells to be rendered
     */
	getVisibleCells: function() {
		var cells = this.get("cells").slice(this.get("firstVisibleCell"), this.get("lastVisibleCell")+1),
		i, hasLoading = false, loadingCell, emptyCell,
		loadList = this.get("listOfLoadingCells");
		
		for(i = 0; i < this.get("numberOfVisibleCells") && (this.get("infinite") || this.get("firstVisibleCell")+i < this.get("numberOfCells")); i++) {
			
			if(cells[i] === undefined) {
				loadingCell = this.createLoadingCell();
				cells[i] = loadingCell;
			
				loadList[this.get("firstVisibleCell")+i] = loadingCell;
				hasLoading = true;
			}
		}
		
		for(i = cells.length; i < this.get("numberOfVisibleCells"); i++) {
			emptyCell = this.createCell();
			cells.push(emptyCell);
			loadList[this.get("firstVisibleCell")+i] = emptyCell;
		}
		
		this.set("listOfLoadingCells", loadList);
		if(hasLoading) {
			this.fetchNextCells(this.get("firstVisibleCell"));
		} else {
			this.fire( AFTERDATARETRIEVAL );
		}
		
		return cells;
	},
	
	/**
     * Scroll one page forward
	 * Set scroll direction
     *
     * @method scrollForward
     */
	scrollForward: function() {
		this.set("direction", FORWARD);
		this.scrollTo(this.get("page")+1);
	},
	
	/**
     * Scroll one page backwards
	 * Set scroll direction
     *
     * @method scrollBackwards
     */
	scrollBackwards: function() {
		this.set("direction", BACKWARD);
		this.scrollTo(this.get("page")-1);
	},
	
	/**
     * Scroll to the first page
	 * Set scroll direction
     *
     * @method startOver
     */
	startOver: function(event) {
		this.set("direction", undefined);
		this.scrollTo(0);
		event.preventDefault();
	},
	
	/**
     * Scroll to page and render the content
	 * if prefetching add event listener to know when to fetch data
	 * set the new page
	 * set the new first and last cells
	 * render the content
     *
     * @method scrollTo
	 * @param page {number} the page to scroll to.
     */
	scrollTo: function(page) {
		this.fire( STARTSCROLL );
		if(this.get("prefetch")) {
			var retrievalHandle = this.on( AFTERDATARETRIEVAL, Y.bind(this.prefetchCells, this));
			this.set("retrievalHandle", retrievalHandle);
		}
		
		this.set("page", page);
		this.setFirstAndLast();
		this.renderFunction(this.getVisibleCells());
		
		this.fire( ENDSCROLL );
	},
	
	/**
     * simple render method.  Clear the cells and put in new ones
     *
     * @method renderCells
	 * @param cells {array} array of cells for the page
     */
	renderCells: function(cells) {
		var ul = this.get("ul"), i;
		this.clearCells();
		for(i = 0; i < this.get("numberOfVisibleCells"); i++) {
			ul.append(cells[i]);
		}
		
		this.fire( RENDERFINISHED );
	},
	
	/**
     * render cells with an animated pop.
	 * Each cell will replace the cell it will be replacing visually but with a timeout
	 * if a cell is both going to be added and replaced make a clone
	 * (could happen if number of visible cells change)
     *
     * @method renderCellsWithPop
	 * @param cells {array} array of cells for the page
     */
	renderCellsWithPop: function(cells) {
		var ul = this.get("ul"),
		indexTransform = this.popIndexTransformation(),
		i, len,
		currentCells,
		oldCell,
		newCell;
		
		for(i = 0, len = cells.length; i < len; i++) {
			if(ul.contains(cells[i])) {
				ul.replaceChild(cells[i].cloneNode(true), cells[i]);
			}
		}
		
		currentCells = ul.all("li."+this.getClassName(this.get("cellClass")));
		for(i = 0; i < this.get("numberOfVisibleCells"); i++) {
			newCell = cells[i];
			oldCell = undefined;
			if( i < currentCells.size() ) {
				oldCell = currentCells.item(i);
			}
			
			window.setTimeout(this.popTimeoutFunction(ul, newCell, oldCell), this.get("delay")*indexTransform(i));
		}
		window.setTimeout(Y.bind(function(){this.fire( RENDERFINISHED );}, this), this.get("delay")*i);
	},
	
	/**
     * Append or replace a cell in the ul
     *
     * @method popTimeoutFunction
	 * @param ul {Node} ul of shoveler
	 * @param newCell {Node} cell to be added to the dom
	 * @param oldCell {Node} cell the new cell will replace
     */
	popTimeoutFunction: function(ul, newCell, oldCell) {
		return function() {
			if(oldCell !== undefined) {
				ul.replaceChild(newCell, oldCell);
			} else {
				ul.append(newCell);
			}
		};
	},
	
	/**
     * Popping happends in the direction of scrolling.
	 * If scrolling Backwards grab index
	 * If scrolling Forwads alter index so pop in reverse direction
     *
     * @method popIndexTransformation
	 * @return {function} function to calculate the index of when popping should accur
     */
	popIndexTransformation: function() {
		if(this.get("direction") === undefined) {
			return function(index) {
				return 0;
			};
		} else if(this.get("direction") == BACKWARD) {
			return function(index) {
				return index;
			};
		} else {
			var numberOfVisibleCells = this.get("numberOfVisibleCells");
			return function(index) {
				return numberOfVisibleCells-index;
			};
		}
	},
	
	/**
     * Build url and fetch data with a new script tag.  Make sure to call handleDataRetrieval
     *
     * @method fetchNextCells
	 * @return start {number} the index of the first cell we are retrieving
     */
	fetchNextCells: function(start){
		var url, script;
		this.set("fetchStart", start);
		url = this.get("contructDataSrc")(start,
			this.get("numberOfVisibleCells"),
			this.get("fetchCallback"));
		script = Y.Node.create("<script type='text/javascript' src='"+url+"'></script>");
		Y.get("body").append(script);
	},
	
	/**
     * Prefetch new cells in direction of scrolling. Only prefetch once each scroll
     *
     * @method prefetchCells
     */
	prefetchCells: function() {
		this.get("retrievalHandle").detach( AFTERDATARETRIEVAL );
		var start;
		if(this.get("direction") == BACKWARD) {
			start = this.get("firstVisibleCell")-this.get("numberOfVisibleCells");
		} else { 
			start = this.get("lastVisibleCell")+1;
		}
		
		if(this.get('cells')[start] === undefined && start < this.get("numberOfCells")) {
			this.fetchNextCells(start);
		}
	},
	
	/**
     * Call handle data as defined by user
     *
     * @method handleDataRetrieval
	 * @param data however the user defines it
     */
	handleDataRetrieval: function(data) {
		this.get("handleData").call(this, data);
		this.fire( AFTERDATARETRIEVAL );
	}
	
});

Y.Shoveler = Shoveler;

}());


}, 'gallery-2010.03.23-17-54' ,{requires:['widget', 'event', 'event-delegate', 'stylesheet']});
