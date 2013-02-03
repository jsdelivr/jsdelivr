// SpryURLUtils.js - version 0.1 - Spry Pre-Release 1.6
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

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

// Spry.Utils.urlComponentToObject
//
// Given a URL component of name value pairs, it returns an object that has the
// the URL component names as properties, and the URL component values as the value
// of those properties.
//
// The paramSeparator and nameValueSeparator args are optional. If not specified,
// the default paramSeparator is '&' and the default nameValueSeparator is '='.

Spry.Utils.urlComponentToObject = function(ucStr, paramSeparator, nameValueSeparator)
{
	var o = new Object;
	if (ucStr)
	{
		if (!paramSeparator) paramSeparator = "&";
		if (!nameValueSeparator) nameValueSeparator = "=";
		var params = ucStr.split(paramSeparator);
		for (var i = 0; i < params.length; i++)
		{
			var a = params[i].split(nameValueSeparator);
			var n = decodeURIComponent(a[0]?a[0]:"");
			var v = decodeURIComponent(a[1]?a[1]:"");
			if (v.match(/^0$|^[1-9]\d*$/))
				v = parseInt(v);
			if (typeof o[n] == "undefined")
				o[n] = v;
			else			
			{
				if (typeof o[n] != "object")
				{
					var t = o[n];
					o[n] = new Array;
					o[n].push(t);
				}
				o[n].push(v);
			}
		}
	}
	return o;
};

// Spry.Utils.getLocationHashParamsAsObject
//
// Returns window.location.hash as an object that has the the URL component
// names as properties, and the URL component values as the value of those properties.

Spry.Utils.getLocationHashParamsAsObject = function(paramSeparator, nameValueSeparator)
{
	return Spry.Utils.urlComponentToObject(window.location.hash.replace(/^#/, ""), paramSeparator, nameValueSeparator);
};

// Spry.Utils.getLocationParamsAsObject
//
// Returns window.location.search as an object that has the the URL component
// names as properties, and the URL component values as the value of those properties.

Spry.Utils.getLocationParamsAsObject = function()
{
	return Spry.Utils.urlComponentToObject(window.location.search.replace(/^\?/, ""));
};

// Spry.Utils.getURLHashParamsAsObject
//
// Given a url string, extracts out the URL component that follows the '#' character
// and returns an object that has the the URL component names as properties, and the
// URL component values as the value of those properties.
//
// The paramSeparator and nameValueSeparator args are optional. If not specified,
// the default paramSeparator is '&' and the default nameValueSeparator is '='.

Spry.Utils.getURLHashParamsAsObject = function(url, paramSeparator, nameValueSeparator)
{
	var i;
	if (url && (i = url.search("#")) >= 0)
		return Spry.Utils.urlComponentToObject(url.substr(i+1), paramSeparator, nameValueSeparator);
	return new Object;
};

// Spry.Utils.getURLParamsAsObject
//
// Given a url string, extracts out the URL component that follows the '?' character
// and returns an object that has the the URL component names as properties, and the
// URL component values as the value of those properties.

Spry.Utils.getURLParamsAsObject = function(url)
{
	var s;
	if (url && (s = url.match(/\?[^#]*/)) && s)
		return Spry.Utils.urlComponentToObject(s[0].replace(/^\?/, ""));
	return new Object;
};
