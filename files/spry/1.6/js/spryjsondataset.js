// SpryJSONDataSet.js - version 0.4 - Spry Pre-Release 1.6
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

Spry.Data.JSONDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	this.path = "";
	this.pathIsObjectOfArrays = false;
	this.doc = null;
	this.subPaths = [];
	this.useParser = false;
	this.preparseFunc = null;

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	// Callers are allowed to pass either a string, an object or an array of
	// strings and/or objects for the 'subPaths' option, so make sure we normalize
	// the subPaths value to be an array.

	var jwType = typeof this.subPaths;
	if (jwType == "string" || (jwType == "object" && this.subPaths.constructor != Array))
		this.subPaths = [ this.subPaths ];
}; // End of Spry.Data.JSONDataSet() constructor.

Spry.Data.JSONDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.JSONDataSet.prototype.constructor = Spry.Data.JSONDataSet;

// Override the inherited version of getDataRefStrings() with our
// own version that returns the strings memebers we maintain that
// may have data references in them.

Spry.Data.JSONDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.path) strArr.push(this.path);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.JSONDataSet.prototype.getDocument = function() { return this.doc; };
Spry.Data.JSONDataSet.prototype.getPath = function() { return this.path; };
Spry.Data.JSONDataSet.prototype.setPath = function(path)
{
	if (this.path != path)
	{
		this.path = path;
		if (this.dataWasLoaded && this.doc)
		{
			this.notifyObservers("onPreLoad");
			this.setDataFromDoc(this.doc);
		}
	}
};

// A recursive method that returns all objects that match the given object path.

Spry.Data.JSONDataSet.getMatchingObjects = function(path, jsonObj)
{
	var results = [];

	if (path && jsonObj)
	{
		var prop = "";
		var leftOverPath = "";

		var offset = path.search(/\./);
		if (offset != -1)
		{
			prop = path.substring(0, offset);
			leftOverPath = path.substring(offset + 1);
		}
		else
			prop = path;

		var matches = [];

		if (prop && typeof jsonObj == "object")
		{
			var obj = jsonObj[prop];
			var objType = typeof obj;
			if (objType != undefined && objType != null)
			{
				if (obj && objType == "object" && obj.constructor == Array)
					matches = matches.concat(obj);
				else
					matches.push(obj);
			}
		}

		var numMatches = matches.length;
		if (leftOverPath)
		{
			for (var i = 0; i < numMatches; i++)
				results = results.concat(Spry.Data.JSONDataSet.getMatchingObjects(leftOverPath, matches[i]));
		}
		else
			results = matches;
	}

	return results;
};

// Flatten the specified object into a row object that can be added
// to a record set.

Spry.Data.JSONDataSet.flattenObject = function(obj, basicColumnName)
{
	// If obj is a basic type (null, string, boolean, or number), we need
	// to store it under a column name in our row object. If the caller supplied
	// a column name, use that, if not use our default "column0".

	var basicName = basicColumnName ? basicColumnName : "column0";

	// If obj is an object, copy its properties into our row object. If obj
	// is a basic type, then store it in the row under the column name specified
	// by basicName.

	var row = new Object;
	var objType = typeof obj;
	if (objType == "object")
		Spry.Data.JSONDataSet.copyProps(row, obj);
	else
		row[basicName] = obj;

	// Make sure we note the original JSON object we used to create
	// this row. It may be needed if we need to flatten other sub-paths.

	row.ds_JSONObject = obj;
	return row;
};

// Utility routine for copying properties from one object to another.

Spry.Data.JSONDataSet.copyProps = function(dstObj, srcObj, suppressObjProps)
{
	if (srcObj && dstObj)
	{
		for (var prop in srcObj)
		{
			if (suppressObjProps && typeof srcObj[prop] == "object")
				continue;
			dstObj[prop] = srcObj[prop];
		}
	}
	return dstObj;
};

// Given an object created from JSON data, and an object path, find all the
// matching objects and flatten them into rows of data.

Spry.Data.JSONDataSet.flattenDataIntoRecordSet = function(jsonObj, path, pathIsObjectOfArrays)
{
	var rs = new Object;
	rs.data = [];
	rs.dataHash = {};

	if (!path)
		path = "";

	var obj = jsonObj;
	var objType = typeof obj;
	var basicColName = "";

	// Handle the basic non-object data types.

	if (objType != "object" || !obj)
	{
		// JSON has a null data type which we translate
		// into a data set with no rows. All other data types
		// translate into a data set with a single row with a
		// column named "column0" which contains the actual
		// data.

		if (obj != null)
		{
			var row = new Object;
			row.column0 = obj;
			row.ds_RowID = 0;
			rs.data.push(row);
			rs.dataHash[row.ds_RowID] = row;
		}
		return rs;
	}

	var matches = [];

	if (obj.constructor == Array)
	{
		var arrLen = obj.length;

		// We have a top-level array. If the array is empty,
		// then there's nothing for us to do.

		if (arrLen < 1)
			return rs;

		// XXX: We are making a big assumption here that all of the
		// elements within the array are of the same type!
		//
		// If the elements are of a basic data type, we create
		// a row for each element and add it as a row to the data set.

		var eleType = typeof obj[0];

		if (eleType != "object")
		{
			for (var i = 0; i < arrLen; i++)
			{
				var row = new Object;
				row.column0 = obj[i];
				row.ds_RowID = i;
				rs.data.push(row);
				rs.dataHash[row.ds_RowID] = row;
			}
			return rs;
		}
		
		// The elements within the array are objects.
		//
		// XXX: If they are arrays, bail, because we don't handle
		// arrays within arrays right now!

		if (obj[0].constructor == Array)
			return rs;

		// We have an array of objects. If we have a path, use it
		// to fetch the data the user is interested in from each element
		// in the array and append the results to our matches array.
		// If no path was specified, just add the element to the matches
		// array.

		if (path)
		{
			for (var i = 0; i < arrLen; i++)
				matches = matches.concat(Spry.Data.JSONDataSet.getMatchingObjects(path, obj[i]));
		}
		else
		{
			for (var i = 0; i < arrLen; i++)
				matches.push(obj[i]);
		}
	}
	else
	{
		// We have a top-level object. If the user has specified a path,
		// use it to extract out the data they are interested in. If no
		// path was specified, then just copy 
		
		if (path)
			matches = Spry.Data.JSONDataSet.getMatchingObjects(path, obj);
		else
			matches.push(obj);
	}

	var numMatches = matches.length;
	if (path && numMatches >= 1 && typeof matches[0] != "object")
		basicColName = path.replace(/.*\./, "");

	if (!pathIsObjectOfArrays)
	{
		for (var i = 0; i < numMatches; i++)
		{
			var row = Spry.Data.JSONDataSet.flattenObject(matches[i], basicColName, pathIsObjectOfArrays);
			row.ds_RowID = i;
			rs.dataHash[i] = row;
			rs.data.push(row);
		}
	}
	else
	{
		// Each object that was matched contains properties that are the column names
		// of our rows. The value of each property is an array of values for that column. This
		// means the data for each row is inverted and spread across multiple arrays. We expect arrays of
		// objects, so run through all of the arrays and build up row objects and add them
		// to our record set.

		var rowID = 0;

		for (var i = 0; i < numMatches; i++)
		{
			var obj = matches[i];
			var colNames = [];
			var maxNumRows = 0;
			for (var propName in obj)
			{
				var prop = obj[propName];
				var propyType = typeof prop;
				if (propyType == 'object' && prop.constructor == Array)
				{
					colNames.push(propName);
					maxNumRows = Math.max(maxNumRows, obj[propName].length);
				}
			}

			var numColNames = colNames.length;
			for (var j = 0; j < maxNumRows; j++)
			{
				var row = new Object;
				for (var k = 0; k < numColNames; k++)
				{
					var colName = colNames[k];
					row[colName] = obj[colName][j];
				}
				row.ds_RowID = rowID++;
				rs.dataHash[i] = row;
				rs.data.push(row);
			}
		}
	}

	return rs;
};

// For each JSON object used to create the rows in the specified recordset,
// find the data the matches the specified subPaths, flatten them, and append
// them to the rows of the record set.

Spry.Data.JSONDataSet.prototype.flattenSubPaths = function(rs, subPaths)
{
	if (!rs || !subPaths)
		return;

	var numSubPaths = subPaths.length;
	if (numSubPaths < 1)
		return;

	var data = rs.data;
	var dataHash = {};

	// Convert all of the templated subPaths to object paths with real values.
	// We also need a "cleaned" version of the object path which contains no
	// expressions in it, so that we can pre-pend it to the column names
	// of any nested data we find.

	var pathArray = [];
	var cleanedPathArray = [];
	var isObjectOfArraysArr = [];

	for (var i = 0; i < numSubPaths; i++)
	{
		// The elements of the subPaths array can be path strings,
		// or objects that describe a path with nested sub-paths below
		// it, so make sure we properly extract out the object path to use.

		var subPath = subPaths[i];
		if (typeof subPath == "object")
		{
			isObjectOfArraysArr[i] = subPath.pathIsObjectOfArrays;
			subPath = subPath.path;
		}
		if (!subPath)
			subPath = "";

		// Convert any data references in the object path to real values!

		pathArray[i] = Spry.Data.Region.processDataRefString(null, subPath, this.dataSetsForDataRefStrings);

		// Create a clean version of the object path by stripping out any
		// expressions it may contain.

		cleanedPathArray[i] = pathArray[i].replace(/\[.*\]/g, "");
	}

	// For each row of the base record set passed in, generate a flattened
	// recordset from each subPath, and then join the results with the base
	// row. The row from the base data set will be duplicated to match the
	// number of rows matched by the subPath. The results are then merged.

	var row;
	var numRows = data.length;
	var newData = [];

	// Iterate over each row of the base record set.

	for (var i = 0; i < numRows; i++)
	{
		row = data[i];
		var newRows = [ row ];

		// Iterate over every subPath passed into this function.

		for (var j = 0; j < numSubPaths; j++)
		{
			// Search for all nodes that match the given path underneath
			// the JSON Object for the base row and flatten the data into
			// a tabular recordset structure.

			var newRS = Spry.Data.JSONDataSet.flattenDataIntoRecordSet(row.ds_JSONObject, pathArray[j], isObjectOfArraysArr[j]);

			// If this subPath has additional subPaths beneath it,
			// flatten and join them with the recordset we just created.

			if (newRS && newRS.data && newRS.data.length)
			{
				if (typeof subPaths[j] == "object" && subPaths[j].subPaths)
				{
					// The subPaths property can be either an object path string,
					// an Object describing a subPath and paths beneath it,
					// or an Array of object path strings or objects. We need to
					// normalize these variations into an array to simplify
					// our processing.
	
					var sp = subPaths[j].subPaths;
					spType = typeof sp;
					if (spType == "string")
						sp = [ sp ];
					else if (spType == "object" && spType.constructor == Object)
						sp = [ sp ];
	
					// Now that we have a normalized array of sub paths, flatten
					// them and join them to the recordSet we just calculated.
	
					this.flattenSubPaths(newRS, sp);
				}
	
				var newRSData = newRS.data;
				var numRSRows = newRSData.length;
	
				var cleanedPath = cleanedPathArray[j] + ".";
				
				var numNewRows = newRows.length;
				var joinedRows = [];
	
				// Iterate over all rows in our newRows array. Note that the
				// contents of newRows changes after the execution of this
				// loop, allowing us to perform more joins when more than
				// one subPath is specified.
	
				for (var k = 0; k < numNewRows; k++)
				{
					var newRow = newRows[k];
	
					// Iterate over all rows in the record set generated
					// from the current subPath. We are going to create
					// m*n rows for the joined table, where m is the number
					// of rows in the newRows array, and n is the number of
					// rows in the current subPath recordset.
	
					for (var l = 0; l < numRSRows; l++)
					{
						// Create a new row that will house the join result.
	
						var newRowObj = new Object;
						var newRSRow = newRSData[l];
	
						// Copy the data from the current row of the record set
						// into our new row object, but make sure to store the
						// data in columns that have the subPath prepended to
						// it so that it doesn't collide with any columns from
						// the newRows row data.
	
						// Copy the props to the new object using the new property name.
						for (var prop in newRSRow)	
						{
							// The new propery name will have the subPath used prepended to it.
							var newPropName = cleanedPath + prop;
	
							// We need to handle the case where the property name of the object matched
							// by the object path has a value. In that specific case, the name of the
							// property should be the cleanedPath itself. For example:
							//
							//	{
							//		"employees":
							//			{
							//				"employee":
							//					[
							//						"Bob",
							//						"Joe"
							//					]
							//			}
							//	}
							//
							// Object Path: employees.employee
							//
							// The property name that contains "Bob" and "Joe" will be "employee".
							// So in our new row, we need to call this column "employees.employee"
							// instead of "employees.employee.employee" which would be incorrect.
	
							if (cleanedPath == prop || cleanedPath.search(new RegExp("\\." + prop + "\\.$")) != -1)
								newPropName = cleanedPathArray[j];
	
							// Copy the props to the new object using the new property name.

							newRowObj[newPropName] = newRSRow[prop];
						}
	
						// Now copy the columns from the newRow into our row
						// object.

						Spry.Data.JSONDataSet.copyProps(newRowObj, newRow);
	
						// Now add this row to the array that tracks all of the new
						// rows we've just created.
	
						joinedRows.push(newRowObj);
					}
				}

				// Set the newRows array equal to our joinedRows we just created,
				// so that when we flatten the data for the next subPath, it gets
				// joined with our new set of rows.

				newRows = joinedRows;
			}
		}

		newData = newData.concat(newRows);
	}

	// Now that we have a new set of joined rows, we need to run through
	// all of the rows and make sure they all have a unique row ID and
	// rebuild our dataHash.

	data = newData;
	numRows = data.length;

	for (i = 0; i < numRows; i++)
	{
		row = data[i];
		row.ds_RowID = i;
		dataHash[row.ds_RowID] = row;
	}

	// We're all done, so stuff the new data and dataHash
	// back into the base recordSet.

	rs.data = data;
	rs.dataHash = dataHash;
};

Spry.Data.JSONDataSet.prototype.parseJSON = function(str, filter)
{
	// The implementation of this JSON Parser is from the json.js (2007-03-20)
	// reference implementation from json.org. It was modified to accept the
	// JSON string as an arg, and throw a generic Error.
	//
	// Parsing happens in three stages. In the first stage, we run the text against
	// a regular expression which looks for non-JSON characters. We are especially
	// concerned with '()' and 'new' because they can cause invocation, and '='
	// because it can cause mutation. But just to be safe, we will reject all
	// unexpected characters.

	try
	{
		if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(str))
		{
			// In the second stage we use the eval function to compile the text into a
			// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
			// in JavaScript: it can begin a block or an object literal. We wrap the text
			// in parens to eliminate the ambiguity.

			var j = eval('(' + str + ')');

			// In the optional third stage, we recursively walk the new structure, passing
			// each name/value pair to a filter function for possible transformation.

			if (typeof filter === 'function')
			{
				function walk(k, v)
				{
					if (v && typeof v === 'object')
					{
						for (var i in v)
						{
							if (v.hasOwnProperty(i))
							{
								v[i] = walk(i, v[i]);
							}
						}
					}
					return filter(k, v);
				}

				j = walk('', j);
			}
			return j;
		}
	} catch (e) {
		// Fall through if the regexp test fails.
	}
	throw new Error("Failed to parse JSON string.");
};

// Translate the raw JSON string (rawDataDoc) into an object, find the
// data within the object we are interested in, and flatten it into
// a set of rows for our data set.

Spry.Data.JSONDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	if (this.preparseFunc)
		rawDataDoc = this.preparseFunc(this, rawDataDoc);

	var jsonObj;
	try	{ jsonObj = this.useParser ? this.parseJSON(rawDataDoc) : eval("(" + rawDataDoc + ")"); }
	catch(e)
	{
		Spry.Debug.reportError("Caught exception in JSONDataSet.loadDataIntoDataSet: " + e);
		jsonObj = {};
	}

	if (jsonObj == null)
		jsonObj = "null";

	var rs = Spry.Data.JSONDataSet.flattenDataIntoRecordSet(jsonObj, Spry.Data.Region.processDataRefString(null, this.path, this.dataSetsForDataRefStrings), this.pathIsObjectOfArrays);

	this.flattenSubPaths(rs, this.subPaths);

	this.doc = rawDataDoc;
	this.docObj = jsonObj;
	this.data = rs.data;
	this.dataHash = rs.dataHash;
	this.dataWasLoaded = (this.doc != null);
};
