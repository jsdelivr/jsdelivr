// SpryDataSetShell.js - version 0.1 - Spry Pre-Release 1.6
//
// Copyright (c) 2007. Adobe Systems Incorporated.
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

Spry.Data.DataSetShell = function(ds, options)
{
	this.currentDS = ds;
	this.options = options;

	Spry.Data.DataSet.call(this, options);

	if (this.currentDS)
		this.currentDS.addObserver(this.getObserverFunc(this.currentDS));
};

Spry.Data.DataSetShell.prototype = new Spry.Data.DataSet();
Spry.Data.DataSetShell.prototype.constructor = Spry.Data.DataSetShell.prototype;

Spry.Data.DataSetShell.prototype.getObserverFunc = function(ds)
{
	var self = this;
	return function(notificationType, notifier, data) { self.notifyObservers(notificationType, data); };
};

Spry.Data.DataSetShell.prototype.setInternalDataSet = function(ds, loadDS)
{
	var cds = this.currentDS;
	if (cds != ds)
	{
		var wasLoaded = ds.getDataWasLoaded();

		if (wasLoaded)
			this.notifyObservers("onPreLoad");

		if (cds)
			cds.removeObserver(this.getObserverFunc(cds));

		this.currentDS = ds;
		ds.addObserver(this.getObserverFunc(ds));

		if (wasLoaded)
		{
			this.notifyObservers("onPostLoad");
			this.notifyObservers("onDataChanged");
		}
		else if (loadDS)
			ds.loadData();
	}
};

Spry.Data.DataSetShell.prototype.getInternalDataSet = function()
{
	return this.currentDS;
};

Spry.Data.DataSetShell.prototype.getNestedDataSetForParentRow = function(parentRow)
{
	return this.currentDS ? this.currentDS.getNestedDataSetForParentRow() : null;
};

Spry.Data.DataSetShell.prototype.getParentDataSet = function()
{
	if (this.currentDS && this.currentDS.getParentDataSet)
		return this.currentDS.getParentDataSet();
	return null;
};

Spry.Data.DataSetShell.prototype.loadData = function()
{
	if (this.currentDS && !this.currentDS.getLoadDataRequestIsPending())
		this.currentDS.loadData();
};

Spry.Data.DataSetShell.prototype.getData = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getData(unfiltered);
	return [];
};

Spry.Data.DataSetShell.prototype.getLoadDataRequestIsPending = function()
{
	return this.currentDS ? this.currentDS.getLoadDataRequestIsPending() : false;
};

Spry.Data.DataSetShell.prototype.getDataWasLoaded = function()
{
	return this.currentDS ? this.currentDS.getDataWasLoaded() : false;
};

Spry.Data.DataSetShell.prototype.setDataFromArray = function(arr, fireSyncLoad)
{
	if (this.currentDS)
		this.currentDS.setDataFromArray(arr, fireSyncLoad);
};

Spry.Data.DataSetShell.prototype.cancelLoadData = function()
{
	if (this.currentDS)
		this.currentDS.cancelLoadData();
};

Spry.Data.DataSetShell.prototype.getRowCount = function(unfiltered)
{
	return this.currentDS ? this.currentDS.getRowCount(unfiltered) : 0;
};

Spry.Data.DataSetShell.prototype.getRowByID = function(rowID)
{
	return this.currentDS ? this.currentDS.getRowByID(rowID) : undefined;
};

Spry.Data.DataSetShell.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	return this.currentDS ? this.currentDS.getRowByRowNumber(rowNumber, unfiltered) : null;
};

Spry.Data.DataSetShell.prototype.getCurrentRow = function()
{
	return this.currentDS ? this.currentDS.getCurrentRow(): null;
};

Spry.Data.DataSetShell.prototype.setCurrentRow = function(rowID)
{
	if (this.currentDS)
		this.currentDS.setCurrentRow(rowID);
};

Spry.Data.DataSetShell.prototype.getRowNumber = function(row)
{
	return this.currentDS ? this.currentDS.getRowNumber(row) : 0;
};

Spry.Data.DataSetShell.prototype.getCurrentRowNumber = function()
{
	return this.currentDS ? this.currentDS.getCurrentRowNumber(): 0;
};

Spry.Data.DataSetShell.prototype.getCurrentRowID = function()
{
	return this.currentDS ? this.currentDS.getCurrentRowID() : 0;
};

Spry.Data.DataSetShell.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (this.currentDS)
		this.currentDS.setCurrentRowNumber(rowNumber);
};

Spry.Data.DataSetShell.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.findRowsWithColumnValues(valueObj, firstMatchOnly, unfiltered);
	return firstMatchOnly ? null : [];
};

Spry.Data.DataSetShell.prototype.setColumnType = function(columnNames, columnType)
{
	if (this.currentDS)
		this.currentDS.setColumnType(columnNames, columnType);
};

Spry.Data.DataSetShell.prototype.getColumnType = function(columnName)
{
	return this.currentDS ? this.currentDS.getColumnType(columnName) : "string";
};

Spry.Data.DataSetShell.prototype.distinct = function(columnNames)
{
	if (this.currentDS)
		this.currentDS.distinct(columnNames);
};

Spry.Data.DataSetShell.prototype.getSortColumn = function()
{
	return this.currentDS ? this.currentDS.getSortColumn() : "";
};

Spry.Data.DataSetShell.prototype.getSortOrder = function()
{
	return this.currentDS ? this.currentDS.getSortOrder() : "";
};

Spry.Data.DataSetShell.prototype.sort = function(columnNames, sortOrder)
{
	if (this.currentDS)
		this.currentDS.sort(columnNames, sortOrder);
};

Spry.Data.DataSetShell.prototype.filterData = function(filterFunc, filterOnly)
{
	if (this.currentDS)
		this.currentDS.filterData(filterFunc, filterOnly);
};

Spry.Data.DataSetShell.prototype.filter = function(filterFunc, filterOnly)
{
	if (this.currentDS)
		this.currentDS.filter(filterFunc, filterOnly);
};