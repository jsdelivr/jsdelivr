/*

================================================================
                                                           jQueryCreate
================================================================

Version: 1.0.0

================================================================

Author: EZSlaver (E. Zinman)

EMail: EZSlaver@gmail.com

Site: https://github.com/EZSlaver/jQueryCreate

Date: 05.02.2013

License: MIT License

================================================================

No learning curve - The jQueryCreate plugin is simple, intuitive and extremely useful. Just plug and play.

The jQuery creator plugin Allows you to create your elements using CSS selectors syntax.
Don't use javascript with different syntaxes when it comes to dynamic DOM element creation. 
Use the same syntax for element querying and creation.

================
Usage
================
Add the plugin to your HTML page, and do this only after you add the jQuery reference.
You can now use the $c() command to create your elements:
	
	{jQuery} $c [{string} cssString)
			
	Input: 
		[String] cssString - A string specifying the required element(s) to create with their attributes:
			
			<tagtype>[#<identifier>][.<class-name>,...][ [<attribute>=<attribute-value>].. ] [, another...]
			  
			<tagtype> - The element tag type as type in CSS selectors. e.g. 'span' 'div' img' textarea' etc.
			[#<identifier>] - Optional. The ID (attribute 'id' in html) of the tag. e.g. 'div#main'
			[.<class-name>,...] - Optional. The class(es) of the element. Multiple classes are allowed. e.g. 'div.one' 'div.two.three'
			[ [<attribute>=<attribute-value>].. ] - Optional. Attributes you want to assign to your element. Multiple attributes are allowed. e.g. 'input[type=button][disabled=disabled]' 'ul[title="This is my title"]'.
			[, another...] - Optional. Another elements' string. e.g. 'div#main, span.text, input[type=submit]'.
	
	
	Output:
		[jQuery] The element(s) created by the function wrapped by a jQuery object.
		
	Exceptions: 
		In case of syntax errors the function throws and exception.
		e,g. 
			$c("dib") ---> Exception('Bad Syntax!')

================
Remarks
================
- The plugin doesn't support the 'style' attribute. You can use the jQuery.css function in concatenation to the creation element.
- The plugin adds two pototype methods to the string: string.format()  and string.relativeSlice(). Their documentation is within the code.
- The code supports creation of all elements known by me. In case something's missing, email me or post an 'issue'.
- The code uses regular expressions. I have first prepared many of them, only to discover I need only use a few. I cannot guarantee all of them work, though I do not use all of them.
- The code could be easily altered to not require jQuery, yet I do not see the purpose of such an action.

================
Performance
================
I haven't come across an issue in that area, and I use the '$c() ' function for a while now, and in many colors and shapes.
If you find a problem, mail me so I can fix it.

================
Code Examples:
================
javascript:

	// Different usages of the plugin are specified.
	var $div = $c("div");
	$div = $c("div#foo");
	$div = $c("div.bar");
	$div = $c("div#foo.bar");
	$div = $c("div.bar#foo");
	$div = $c("div.bar#foo.foo");
	$div = $c("div.bar.foo#foo");
	$div = $c("div[disabled=disabled]");
	$div = $c("div[disabled=disabled].bar");
	$div = $c("div[disabled=disabled]#foo");
	$div = $c("div[disabled=disabled]#foo.bar");
	$div = $c("div[disabled=disabled][selected=true]#foo.bar");
	$div = $c("div[disabled=disabled][selected=\"true\"]#foo.bar");
	$div = $c("div[disabled=disabled][selected=\"very true\"]#foo.bar");
	$div = $c("div[disabled=disabled][selected=\"very:true\"]#foo.bar");

	// Creates two elements with one command.
	var $elements = $c("div.one, input.two");

	
In code usage:

	// Returns a wrapped element to be used directly via jQuery.
	var $newDiv = $c('div#New').append($c('input[type=text].shows-default-value'));
	$('body').append($newDiv).append($c('div.seperator'));
	
================
Licensing
================

Copyright (C) 2010-2013 Erez Zinman
 * Licensed under the MIT License
 * http://www.opensource.org/licenses/mit-license.php

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

================================================================ 

*/

(function($) {
	if (!String.prototype.format) {
		/*
			{string} string.format( [{Booelan} negativeNumbers ,] {string/object} ... )
			The function lookes for all strings of the template '{<index-number>}' inside the string and replaces everyone of them with the argument given by the index.
			Input:
				[Boolean] negativeNumbers - Optional. Default: false. Indicates wether the function should not look for indices specified by zero and below, rather than zero and above. 
				                                           This option was added becase in regex string '{<number>}' has a meaning and should not necessarilly be replaced. In case flagged with 'true', the indices should be {0}, {-1} and so on.
				[String\Object] arguments - The arguments to replace the index specifiers. The 'toString' function is used for all arguments.
				
			Output:
				[String] The modified string.
				
			
			Examples:
				'{0}{1}! {0} Solar System!".format('Hello', 'World'); 
					---> "Hello World! Hello Solar System!"
				
				'{0}{-1}! {0} Solar System!".format(true, 'Hello', 'World'); 
					---> "Hello World! Hello Solar System!"
		*/
		String.prototype.format = function(negativeNumbers /*...*/) {
			var modifier = 1;
			var args = $.makeArray(arguments);
			if (typeof negativeNumbers == "boolean") {
				modifier = -1;
				args = args.slice(1);
			}
			var s = this;
			for (var i = 0; i < args.length; i++) {
				while (s.indexOf("{" + (i * modifier) + "}") != -1)
					s = s.replace("{" + (i * modifier) + "}", args[i].toString());
			}
			return s;
		};
	}
	
	/*
		{string} string.relativeSlice( {Number} start, Number} end )
		The function is identical to the 'string.slice' function, only that it allows negative numbers. Negative numbers indicate that the given index is relative to to the end of the string, rather to the start.
		Input:
			[Number] start - The starting index to take slice.
			[String\Object] arguments - The end index to slice.
			
		Output:
			[String] The modified string.
			
		
		Examples:
			'Hello".relativeSlice(1, -1); 
				---> "ell"
			
			'Hello".relativeSlice(-2, 0); 
				---> "lo"
	*/
	if (!String.prototype.relativeSlice) {
		String.prototype.relativeSlice = function(start, end) {
			
			if (start < 0) {
				start = this.length + start;
			}
			if (end !== undefined && end <= 0) {
				end = this.length + end;
				return this.slice(start, end);
			}
			return this.slice(start);
		};
	}

	var matches;
	var findCallAndRemove = function(string, regex, callback) {
		matches = string.match(regex);
		if (matches)
			callback(matches);
		return string.replace(regex, "");
	};

	window.$c = function(string) {
		string = $.trim(string);
		var cIndex = string.indexOf(',');
		if (cIndex != -1) {
			return $c(string.substring(0, cIndex)).add($c(string.substring(cIndex + 1)));
		}
		//		if (!window.$c.rSimplifiedValidArgument.test(string))
		//			throw new Error('Bad Syntax');
		var $element;
		string = findCallAndRemove(string, new RegExp("^" + window.$c.sAllAvailableTags, "ig"), function() {
			$element = $("<{0}>".format(true, matches[0]));
		});
		string = findCallAndRemove(string, new RegExp(window.$c.sSimplifedAnyProperty, "ig"), function() {
			for (var i = 0; i < matches.length; i++) {
				if (!window.$c.rAnyProperty.test(matches[i]))
					throw new Error('Bad Syntax');
				var val = matches[i].match( /=.+$/ )[0].relativeSlice(1, -1).replace(/^"|'/, "").replace(/"|'$/, "");
				$element.attr(matches[i].match(new RegExp(window.$c.sPropertyKey))[0], val);
			}
		});
		string = findCallAndRemove(string, new RegExp(window.$c.sAnyId, "ig"), function() {
			$element.attr("id", matches[0].slice(1));
		});
		string = findCallAndRemove(string, new RegExp(window.$c.sAnyClass, "ig"), function() {
			for (var i = 0; i < matches.length; i++) {
				$element.addClass(matches[i].slice(1));
			}
		});

		if (string.replace( /^\s+/ , "").replace( /\s+$/ , ""))
			throw new Error('Bad Syntax');

		return $element;
	};

	window.$c.sAnyWord = "(?:[a-zA-ZÀ-ÿ][\\w\\-]*)";
	window.$c.sAnyWordIncludingFractures = "(?:(?:[a-zA-ZÀ-ÿ][\\w\\-]*)|(?:\\d+(?:\\.\\d+))";
	window.$c.sAnyWordIncludingFracturesAndMeasurements = "(?:(?:[a-zA-ZÀ-ÿ]\\w*)|(?:\\d+(\\.\\d+)?[(?:em)(?:px)%(?:in)(?:cm)(?:mm)(?:ex)(?:pt)(?:px)(?:pc)]))";
	window.$c.sSimplifiedAnyWordIncludingFracturesAndMeasurements = "(?:(?:\\w*)|(?:\\d+(?:\\.\\d+)?(?:%|(?:[a-zA-ZÀ-ÿ]{2}))))";
	window.$c.sSimplifiedAnySentance = "(?:\\w+(?:\\s|\\w|\\:|\\;|\\/|\\\\|\\.)*)";
	//		window.$c.sAnySentanceIncludingFractures = ;

	window.$c.sAnyColor = "(?:(?:#[0-9a-fA-F]{6})|(?:r|Rg|Gb|B\\(?:{0},{0},{0}\\))".format(true, "[(?:2[(?:[0-4]\\d)(?:5[0-5])])(?:[10]\\d\\d)]");

	window.$c.sAllAvailableTags = "(?:(?:div)|(?:span)|a|(?:img)|(?:input)|(?:iframe)|(?:frame)|(?:link)|(?:meta)|(?:object)|(?:option)|(?:select)|(?:style)|(?:table)|(?:tr)|(?:th)|(?:td)|(?:tbody)|(?:thead)|(?:caption)|(?:textarea)|p|(?:h[1-6])|(?:li)|(?:ul)|(?:ol)|(?:br)|(?:form)|(?:hr))";
	window.$c.sAnyClass = "(?:\\.{0})".format(true, window.$c.sAnyWord);
	window.$c.sAnyId = "(?:#{0})".format(true, window.$c.sAnyWord);

	window.$c.sPropertyKey = window.$c.sAnyWord;
	window.$c.sPropertyValue = "(?:(?:{0})|(?:'{-1}')|(?:\"{-1}\"))".format(true, window.$c.sSimplifiedAnyWordIncludingFracturesAndMeasurements, "[\\w\\s\\.\\:\\;\\#\\\\\\/\\(\\)\\-=&\\?]*");

	window.$c.sSimplifedAnyProperty = "(?:\\[\\s*{0}\\s*=\\s*{-1}\\s*\\])".format(true, window.$c.sPropertyKey, window.$c.sPropertyValue);
	window.$c.rAnyProperty = new RegExp("(?:\\s*{0}\\s*=\\s*{-1}\\s*)".format(true, window.$c.sPropertyKey, window.$c.sPropertyValue));

	window.$c.rSimplifiedValidArgument = new RegExp("^{0}(?:{-1}|{-3})*{-2}?(?:{-1}|{-3})*$".format(true, window.$c.sAllAvailableTags, window.$c.sAnyClass, window.$c.sAnyId, window.$c.sSimplifedAnyProperty));
	//		window.$c.rSimplifiedValidArgument = new RegExp("^{0}[{-1}{-3}]*{-2}?[{-1}{-3}]*$".format(true, window.$c.sAllAvailableTags, window.$c.sAnyClass, window.$c.sAnyId, window.$c.sSimplifedAnyProperty));
}(jQuery));