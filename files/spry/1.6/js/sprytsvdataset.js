// SpryTSVDataSet.js - version 0.1 - Spry Pre-Release 1.6
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

Spry.Data.TSVDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	this.delimiter = "\t";
	this.firstRowAsHeaders = true;
	this.columnNames = [];
	this.columnNames = [];

	Spry.Utils.setOptions(this, dataSetOptions);
}; // End of Spry.Data.TSVDataSet() constructor.

Spry.Data.TSVDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.TSVDataSet.prototype.constructor = Spry.Data.TSVDataSet;

// Override the inherited version of getDataRefStrings() with our
// own version that returns the strings memebers we maintain that
// may have data references in them.

Spry.Data.TSVDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	return strArr;
};

Spry.Data.TSVDataSet.prototype.getDocument = function() { return this.doc; };

Spry.Data.TSVDataSet.prototype.columnNumberToColumnName = function(colNum)
{
	var colName = this.columnNames[colNum];
	if (!colName)
		colName = "column" + colNum;
	return colName;
};

// Translate the raw TSV string (rawDataDoc) into an array of row objects.

Spry.Data.TSVDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var data = new Array();
	var dataHash = new Object();

	var s = rawDataDoc ? rawDataDoc : "";
	var strLen = s.length;
	var i = 0;
	var done = false;

	var firstRowAsHeaders = this.firstRowAsHeaders;

	var searchStartIndex = 0;
	var regexp = /[^\r\n]+|(\r\n|\r|\n)/mg;

	var results = regexp.exec(s);
	var rowObj = null;
	var columnNum = -1;
	var rowID = 0;

	while (results && results[0])
	{
		var r = results[0];
		if (r == "\r\n" || r == "\r" || r == "\n")
		{
			if (!firstRowAsHeaders)
			{
				rowObj.ds_RowID = rowID++;
				data.push(rowObj);
				rowObj = null;
			}
			firstRowAsHeaders = false;
			columnNum = -1;
		}
		else
		{
			var fields = r.split(this.delimiter);
			for (var i = 0; i < fields.length; i++)
			{
				if (firstRowAsHeaders)
						this.columnNames[++columnNum] = fields[i];
				else
				{
					if (++columnNum == 0)
						rowObj = new Object;
					rowObj[this.columnNumberToColumnName(columnNum)] = fields[i];
				}
			}
		}

		searchStartIndex = regexp.lastIndex;
		results = regexp.exec(s);
	}
	
	this.doc = rawDataDoc;
	this.data = data;
	this.dataHash = dataHash;
	this.dataWasLoaded = (this.doc != null);
};
