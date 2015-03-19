// SpryHTMLDataSet.js - version 0.18 - Spry Pre-Release 1.6
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.HTMLDataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.HTMLDataSet = function(dataSetURL, sourceElementID, dataSetOptions)
{
	this.sourceElementID = sourceElementID; // ID of the html element to be used as a data source
	this.sourceElement = null;  			      // The actual html element to be used as a data source

  this.sourceWasInitialized = false;
	this.usesExternalFile = (dataSetURL != null) ? true : false;
	
	this.firstRowAsHeaders = true;
	this.useColumnsAsRows = false;
	this.columnNames = null;
	this.hideDataSourceElement = true;
	
	this.rowSelector = null;
	this.dataSelector = null;
	
	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);
};


Spry.Data.HTMLDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.HTMLDataSet.prototype.constructor = Spry.Data.HTMLDataSet;


Spry.Data.HTMLDataSet.prototype.getDataRefStrings = function() 
{
	var dep = [];
	if (this.url) 
		dep.push(this.url);
	if (typeof this.sourceElementID == "string") 
		dep.push(this.sourceElementID);
	
	return dep;
};

Spry.Data.HTMLDataSet.prototype.setDisplay = function(ele, display)
{
	if( ele )
		ele.style.display = display;
};

Spry.Data.HTMLDataSet.prototype.initDataSource = function(callLoadData)
{
	if (!this.loadDependentDataSets())
		return;
	if (!this.usesExternalFile)
	{
		this.setSourceElement();
		if (this.hideDataSourceElement)
			this.setDisplay(this.sourceElement, "none");
	}
	//this.sourceWasInitialized = true;
};


Spry.Data.HTMLDataSet.prototype.setSourceElement = function (externalDataElement)
{
   // externalDataElement is the container that holds the data imported from the external file.
	this.sourceElement = null;
	if (!this.sourceElementID) 
	{
	  if (externalDataElement)
  	  this.sourceElement = externalDataElement;
  	else
  	{
  	  this.hideDataSourceElement = false;
  	  this.sourceElement = document.body;
  	}
	  return; 
	}
	
	var sourceElementID = Spry.Data.Region.processDataRefString(null, this.sourceElementID, this.dataSetsForDataRefStrings);
	if (!this.usesExternalFile)
	   this.sourceElement = Spry.$(sourceElementID);
	else
    if (externalDataElement) 
    {
      var foundElement = false;
      // looking for the specified ID in the current element node
      var sources = Spry.Utils.getNodesByFunc(externalDataElement, function(node)
    	{
    	    if (foundElement) 
    	      return false;
    			if (node.nodeType != 1)
    				return false;
    			if (node.id && node.id.toLowerCase() == sourceElementID.toLowerCase())
    			{
    			  foundElement = true;
    			  return true;
    			}
      });
      this.sourceElement = sources[0];
    }
    
	if (!this.sourceElement) 
		Spry.Debug.reportError("Spry.Data.HTMLDataSet: '" + sourceElementID + "' is not a valid element ID");
};


Spry.Data.HTMLDataSet.prototype.getSourceElement = function() { return this.sourceElement; };
Spry.Data.HTMLDataSet.prototype.getSourceElementID = function() { return this.sourceElementID; };
Spry.Data.HTMLDataSet.prototype.setSourceElementID = function(sourceElementID)
{
	if (this.sourceElementID != sourceElementID)
	{
		this.sourceElementID = sourceElementID;
		this.recalculateDataSetDependencies();
		this.dataWasLoaded = false;
	}
};

Spry.Data.HTMLDataSet.prototype.getDataSelector = function() { return this.dataSelector; };
Spry.Data.HTMLDataSet.prototype.setDataSelector = function(dataSelector)
{ 
  if (this.dataSelector != dataSelector)
  {
     this.dataSelector = dataSelector;
  	 this.dataWasLoaded = false;
  }
};

Spry.Data.HTMLDataSet.prototype.getRowSelector = function() { return this.rowSelector; };
Spry.Data.HTMLDataSet.prototype.setRowSelector = function(rowSelector)
{ 
  if (this.rowSelector != rowSelector)
  {
     this.rowSelector = rowSelector;
  	 this.dataWasLoaded = false;
  }
};


Spry.Data.HTMLDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var responseText = rawDataDoc;
	responseText = Spry.Data.HTMLDataSet.cleanupSource(responseText);

	var div = document.createElement("div");
	div.id = "htmlsource" + this.internalID;
	div.innerHTML = responseText;

	this.setSourceElement(div);
	if (this.sourceElement)
	{
		var parsedStructure = this.getDataFromSourceElement();
		if (parsedStructure) 
		{
			this.dataHash = parsedStructure.dataHash;
			this.data = parsedStructure.data;
		}		
	}
	this.dataWasLoaded = true;
	div = null;
};


Spry.Data.HTMLDataSet.prototype.loadDependentDataSets = function() 
{
	if (this.hasDataRefStrings)
	{
		var allDataSetsReady = true;

		for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
		{
			var ds = this.dataSetsForDataRefStrings[i];
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the load of this data set!
				ds.loadData();
				allDataSetsReady = false;
			}
		}

		// If our data sets aren't ready, just return. We'll
		// get called back to load our data when they are all
		// done.

		if (!allDataSetsReady)
			return false;
	}
	return true;
};


Spry.Data.HTMLDataSet.prototype.loadData = function()
{
	this.cancelLoadData();
	this.initDataSource();
	
	var self = this;
	if (!this.usesExternalFile) 
	{
		this.notifyObservers("onPreLoad");
		
		this.dataHash = new Object;
		this.data = new Array;
		this.dataWasLoaded = false;
		this.unfilteredData = null;
		this.curRowID = 0;
		
		this.pendingRequest = new Object;
		this.pendingRequest.timer = setTimeout(function()
		{
			self.pendingRequest = null;
			var parsedStructure = self.getDataFromSourceElement();
			if (parsedStructure) 
			{
				self.dataHash = parsedStructure.dataHash;
				self.data = parsedStructure.data;
			}
			self.dataWasLoaded = true;
			
			self.disableNotifications();
			self.filterAndSortData();
			self.enableNotifications();
			
			self.notifyObservers("onPostLoad");
			self.notifyObservers("onDataChanged");	
		}, 0); 
	}
	else 
	{
		var url = Spry.Data.Region.processDataRefString(null, this.url, this.dataSetsForDataRefStrings);

		var postData = this.requestInfo.postData;
		if (postData && (typeof postData) == "string") 
			postData = Spry.Data.Region.processDataRefString(null, postData, this.dataSetsForDataRefStrings);
		this.notifyObservers("onPreLoad");
		
	
		this.dataHash = new Object;
		this.data = new Array;
		this.dataWasLoaded = false;
		this.unfilteredData = null;
		this.curRowID = 0;

		var req = this.requestInfo.clone();
		req.url = url;
		req.postData = postData;
	
		this.pendingRequest = new Object;
		this.pendingRequest.data = Spry.Data.HTTPSourceDataSet.LoadManager.loadData(req, this, this.useCache);
	}
};


Spry.Data.HTMLDataSet.cleanupSource = function (source)
{
	// Cleans the content by replacing the src/href with spry_src 
	// This prevents browser to load the external resources.
  source = source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi, function(a,b,c) {
			//b=tag name,c=tag attributes
			return '<' + b + c.replace(/\b(src|href)\s*=/gi, function(a, b) {
				//b=attribute name
				return 'spry_'+ b + '=';
			}) + '>';
		});
	return source;
};


Spry.Data.HTMLDataSet.undoCleanupSource = function (source)
{
	// Undo cleanup. See the cleanupSource function
	source = source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi, function(a,b,c) {
			//b=tag name,c=tag attributes
			return '<' + b + c.replace(/\bspry_(src|href)\s*=/gi, function(a, b) {
				//b=attribute name
				return b + '=';
			}) + '>';
		});
	return source;
};


Spry.Data.HTMLDataSet.normalizeColumnName = function(colName) 
{
  // Removes the tags from column names values
  // Replaces spaces with underscore
	colName = colName.replace(/(?:^[\s\t]+|[\s\t]+$)/gi, "");
	colName = colName.replace(/<\/?([a-z]+)([^>]+)>/gi, "");
	colName = colName.replace(/[\s\t]+/gi, "_");
	return colName;
};


Spry.Data.HTMLDataSet.prototype.getDataFromSourceElement = function() 
{
	if (!this.sourceElement) 
    return null;

	var extractedData;
	var usesTable = false;
	switch (this.sourceElement.nodeName.toLowerCase())
	{
		case "table":
   		usesTable = true;
			extractedData = this.getDataFromHTMLTable();
			break;
		default:
			extractedData = this.getDataFromNestedStructure();
	}
	if (!extractedData)
     return null;
	
	
	// Flip Columns / Rows
	if (this.useColumnsAsRows) 
	{
	   var flipedData = new Array;
	   // Get columns and put them as rows 
	   for (var rowIdx = 0; rowIdx < extractedData.length; rowIdx++)
	   {
	     var row = extractedData[rowIdx];
	     for (var cellIdx = 0; cellIdx < row.length; cellIdx++) 
	     {
	       if (!flipedData[cellIdx]) flipedData[cellIdx] = new Array;
	       flipedData[cellIdx][rowIdx]= row[cellIdx];
	     }
	   }
	   extractedData = flipedData;
	}

	// Build the data structure for the DataSet
	var parsedStructure = new Object();
	parsedStructure.dataHash = new Object;
	parsedStructure.data = new Array;
	
	if (extractedData.length == 0) 
	   return parsedStructure;
	   
	 
	// Get the column names
	// this.firstRowAsHeaders is used only if the source of data is a TABLE
	var columnNames = new Array;
	var firstRowOfData = extractedData[0];
	for (var cellIdx=0; cellIdx < firstRowOfData.length; cellIdx++)
	{
	  if (usesTable && this.firstRowAsHeaders) columnNames[cellIdx] = Spry.Data.HTMLDataSet.normalizeColumnName(firstRowOfData[cellIdx]);
	  else columnNames[cellIdx] = "column" + cellIdx;
	}
  
  // Check if column names are being overwritten using the optional columnNames parameter
  if (this.columnNames && this.columnNames.length) 
  {
    if (this.columnNames.length < columnNames.length) 
        Spry.Debug.reportError("Too few elements in the columnNames array. The columNames length must match the actual number of columns." );
    else
       for (var i=0; i < columnNames.length; i++) {
         if (this.columnNames[i]) columnNames[i] = this.columnNames[i];
    }
  }
  
  // Place the extracted data into a dataset kind of structure
	var nextID = 0;
	var firstDataRowIndex = (usesTable && this.firstRowAsHeaders) ? 1: 0;

	for (var rowIdx = firstDataRowIndex; rowIdx < extractedData.length; rowIdx++)
	{
		var row = extractedData[rowIdx];
		if (columnNames.length != row.length)
		{
			Spry.Debug.reportError("Unbalanced column names for row #" + (rowIdx+1) + ". Skipping row." );
			continue;
		}

		var rowObj = {};
		for (var cellIdx = 0; cellIdx < row.length; cellIdx++)
       rowObj[columnNames[cellIdx]] = row[cellIdx];

    rowObj['ds_RowID'] = nextID++;
    parsedStructure.dataHash[rowObj['ds_RowID']] = rowObj;
    parsedStructure.data.push(rowObj);
	}
	return parsedStructure;
};


Spry.Data.HTMLDataSet.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};


// This method extracts data from a TABLE structure
// It knows how to handle both colspan and rowspan

Spry.Data.HTMLDataSet.prototype.getDataFromHTMLTable = function()
{
  var tHead = this.sourceElement.tHead;
  var tBody = this.sourceElement.tBodies[0];
  
  var rowsHead = [];
  var rowsBody = [];
  if (tHead) rowsHead = Spry.Data.HTMLDataSet.getElementChildren(tHead);
  if (tBody) rowsBody = Spry.Data.HTMLDataSet.getElementChildren(tBody);
  
  var extractedData = new Array;
  var rows = rowsHead.concat(rowsBody);
  if (this.rowSelector) rows = Spry.Data.HTMLDataSet.applySelector(rows, this.rowSelector);
  for (var rowIdx = 0; rowIdx < rows.length; rowIdx++)
  {
     var row = rows[rowIdx];
     
     var dataRow;
     if (extractedData[rowIdx]) dataRow = extractedData[rowIdx];
     else dataRow = new Array;
     
     var offset = 0;
     var cells = row.cells;
     if (this.dataSelector) cells = Spry.Data.HTMLDataSet.applySelector(cells, this.dataSelector);
     for (var cellIdx=0; cellIdx < cells.length; cellIdx++)
     {
       var cell = cells[cellIdx];
       var nextCellIndex = cellIdx + offset;
       
       // Find the next available position
       while (dataRow[nextCellIndex])
       {
          offset ++;
          nextCellIndex ++;
       }
       var cellValue = Spry.Data.HTMLDataSet.undoCleanupSource(cell.innerHTML);
       dataRow[nextCellIndex] = cellValue;
       
       // Handle collspan
       var colspan = cell.colSpan;
       if (colspan == 0) colspan = 1;
       var startOffset = offset;
       for (var offIdx = 1; offIdx < colspan; offIdx++)
       {
         offset ++;
         nextCellIndex = cellIdx + offset;
         dataRow[nextCellIndex] = cellValue;
       }
       
       // Handle rowspan
       var rowspan = cell.rowSpan;
       if (rowspan == 0) rowspan = 1;
       for (var rowOffIdx = 1; rowOffIdx < rowspan; rowOffIdx++)
       {
         nextRowIndex = rowIdx + rowOffIdx;
         var nextDataRow;
         if (extractedData[nextRowIndex]) nextDataRow = extractedData[nextRowIndex];
         else nextDataRow = new Array;
         
         for (var offIdx = 0; offIdx < colspan; offIdx++)
         {
           nextCellIndex = cellIdx + startOffset;
           nextDataRow[nextCellIndex] = cellValue;
           startOffset ++;
         }
         extractedData[nextRowIndex] = nextDataRow;
       }
      }
     extractedData[rowIdx] = dataRow;
  }
  return extractedData;
};



// This method extracts data from any HTML structure
// It uses rowSelector and dataSelector in order to build a three level nested structure - 
// Either one: rowSelector or dataSelector can miss

Spry.Data.HTMLDataSet.prototype.getDataFromNestedStructure = function()
{
  var extractedData = new Array;
  
  if (this.sourceElementID && !this.rowSelector && !this.dataSelector) 
  {
     // The whole sourceElementID is a single row, single cell structure;
     extractedData[0] = [Spry.Data.HTMLDataSet.undoCleanupSource(this.sourceElement.innerHTML)];
     return extractedData;
  }
  
  var self = this;
  // Get the rows
  var rows = [];
  if (!this.rowSelector)
     // If no rowSelector, there will be only one row
     rows = [this.sourceElement];
  else
     rows = Spry.Utils.getNodesByFunc(this.sourceElement, function(node) { 
            return Spry.Data.HTMLDataSet.evalSelector(node, self.sourceElement, self.rowSelector); 
           }); 
           
  // Get the data columns
  for (var rowIdx = 0; rowIdx < rows.length; rowIdx++)
  {
    var row = rows[rowIdx];
    // Get the cells that actually hold the data for each row
    var cells = [];
    if (!this.dataSelector)
      // If no dataSelector, the whole row is extracted as one cell row.
      cells = [row];
    else
      cells = Spry.Utils.getNodesByFunc(row, function(node) { 
               return Spry.Data.HTMLDataSet.evalSelector(node, row, self.dataSelector); 
              });
              
    extractedData[rowIdx] = new Array;
    for (var cellIdx = 0; cellIdx < cells.length; cellIdx ++)
       extractedData[rowIdx][cellIdx] = Spry.Data.HTMLDataSet.undoCleanupSource(cells[cellIdx].innerHTML);
  }
  return extractedData;
};

// Applies a css selector on a collection and returns the resulting elements
Spry.Data.HTMLDataSet.applySelector = function(collection, selector, root)
{
   var newCollection = [];
   for (var idx = 0; idx < collection.length; idx++)
   {
     var node = collection[idx];
     if (Spry.Data.HTMLDataSet.evalSelector(node, root?root:node.parentNode, selector))
        newCollection.push(node);
   }
   return newCollection;
};

// Checks if a specified node matches the specified css selector
Spry.Data.HTMLDataSet.evalSelector = function (node, root, selector)
{
  if (node.nodeType != 1)
 		return false;
 	if (node == root)
 	  return false;
 	  
 	// Comma delimited selectors can be passed in
 	// The node is selected if it matches one of the selectors
 	// #myID1, div#myID2, #myID3
  var selectors = selector.split(",");
  for (var idx = 0; idx < selectors.length; idx ++)
  {
    var currentSelector = selectors[idx].replace(/^\s+/, "").replace(/\s+$/, "");
   	var tagName = null;
   	var className = null;
   	var id = null;
   	
   	// Accepted values for the selector:
   	// DIV.myClass | DIV | .myClass | *.myClass
   	// DIV#myID | #myID
   	// > DIV.myClass : > points to the direct descendents
   	
   	var selected = true;
   	if (currentSelector.substring(0,1) == ">") 
   	{
   	    // Looking for direct descendants only
   	    if (node.parentNode != root) 
   	      selected = false;
   	    else
   	      currentSelector = currentSelector.substring(1).replace(/^\s+/, "");
   	}
   	if (selected) 
   	{
     	tagName = currentSelector.toLowerCase();
     	if (currentSelector.indexOf(".") != -1)
     	{
     	  var parts = currentSelector.split(".");
     	  tagName = parts[0];
     	  className = parts[1];
     	}
     	else if (currentSelector.indexOf("#") != -1)
     	{
     	  var parts = currentSelector.split("#");
     	  tagName = parts[0];
     	  id = parts[1];
     	}
   	}
   	if (selected && tagName != '' && tagName != '*')
   	    if (node.nodeName.toLowerCase() != tagName) 
   	       selected = false;
   	if (selected && id && node.id != id)
   	    selected = false;
    	if (selected && className && node.className.search(new RegExp('\\b' + className + '\\b', 'i')) ==-1) 
   	    selected = false;
   	if (selected)
   	 return true;
  }
  return false;
};
