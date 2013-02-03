// SpryDataExtensions.js - version 0.3 - Spry Pre-Release 1.6
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

//////////////////////////////////////////////////////////////////////
//
// Support for multiple non-destructive filters on a Data Set.
//
//////////////////////////////////////////////////////////////////////

Spry.Data.DataSet.multiFilterFuncs = {};
Spry.Data.DataSet.multiFilterFuncs.and = function(ds, row, rowNumber)
{
	var filters = ds.activeFilters;
	if (filters)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			row = filters[i](ds, row, rowNumber);
			if (!row)
				break;
		}
	}
	return row;
};

Spry.Data.DataSet.multiFilterFuncs.or = function(ds, row, rowNumber)
{
	var filters = ds.activeFilters;
	if (filters && filters.length > 0)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			var savedRow = row;
			row = filters[i](ds, row, rowNumber);
			if (row)
				return row;
			row = savedRow;
		}
		return null;
	}
	return row;
};

Spry.Data.DataSet.prototype.getMultiFilterFunc = function()
{
	var func = Spry.Data.DataSet.multiFilterFuncs[this.getFilterMode()];
	return func ? func : Spry.Data.DataSet.multiFilterFuncs["and"];
};

Spry.Data.DataSet.prototype.addFilter = function(filterFunc, doApplyFilters)
{
	if (!this.hasFilter(filterFunc))
	{
		if (!this.activeFilters)
			this.activeFilters = [];
		this.activeFilters.push(filterFunc);
	}
	if (doApplyFilters)
		this.applyFilters();
};

Spry.Data.DataSet.prototype.removeFilter = function(filterFunc, doApplyFilters)
{
	var filters = this.activeFilters;
	if (filters)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			if (filters[i] == filterFunc)
			{
				this.activeFilters.splice(i, 1);
				if (doApplyFilters)
					this.applyFilters();
				return;
			}
		}
	}
};

Spry.Data.DataSet.prototype.removeAllFilters = function(doApplyFilters)
{
	var filters = this.activeFilters;
	if (filters && filters.length > 0)
	{
		this.activeFilters = [];
		if (doApplyFilters)
			this.applyFilters();
	}
};

Spry.Data.DataSet.prototype.getFilters = function(filterFunc)
{
	if (!this.activeFilters)
		this.activeFilters = [];
	return this.activeFilters;
};

Spry.Data.DataSet.prototype.applyFilters = function()
{
	if (this.activeFilters && this.activeFilters.length > 0)
		this.filter(this.getMultiFilterFunc());
	else
		this.filter(null);
};

Spry.Data.DataSet.prototype.hasFilter = function(filterFunc)
{
	if (!this.activeFilters && this.activeFilters > 0)
	{
		var filters = this.activeFilters;
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			if (filters[i] == filterFunc)
				return true;
		}
	}
	return false;
};

Spry.Data.DataSet.prototype.getFilterMode = function()
{
	return this.filterMode ? this.filterMode : "and";
};

Spry.Data.DataSet.prototype.setFilterMode = function(mode, doApplyFilters)
{
	var oldMode = this.getFilterMode();
	this.filterMode = mode;
	if (doApplyFilters)
		this.applyFilters();
	return oldMode;
};
