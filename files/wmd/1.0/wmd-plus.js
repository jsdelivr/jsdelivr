var Attacklab=Attacklab||{};
Attacklab.wmdPlus=function(){
	
	var self = top;
	var wmd = self["Attacklab"];
	var doc = self["document"];
	var re = self["RegExp"];
	var nav = self["navigator"];
	
	var util = wmd.Util;
	var position = wmd.Position;
	var command = wmd.Command;
	
	// DONE
	command.doAutoindent = function(chunk){
		
		chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, "\n\n");
		chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, "\n\n");
		chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, "\n\n");
		if(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)){
			if(command.doList){
				command.doList(chunk);
			}
		}
		if(/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)){
			if(command.doBlockquote){
				command.doBlockquote(chunk);
			}
		}
		if(/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)){
			if(command.doCode){
				command.doCode(chunk);
			}
		}
	};
	
	// DONE
	command.doBlockquote = function(chunk){
		
		chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/,
			function(totalMatch, newlinesBefore, text, newlinesAfter){
				chunk.before += newlinesBefore;
				chunk.after = newlinesAfter + chunk.after;
				return text;
			});
			
		chunk.before = chunk.before.replace(/(>[ \t]*)$/,
			function(totalMatch, blankLine){
				chunk.selection = blankLine + chunk.selection;
				return "";
			});
			
		chunk.selection = chunk.selection.replace(/^(\s|>)+$/ ,"");
		chunk.selection = chunk.selection || "Blockquote";
		
		if(chunk.before){
			chunk.before = chunk.before.replace(/\n?$/,"\n");
		}
		if(chunk.after){
			chunk.after = chunk.after.replace(/^\n?/,"\n");
		}
		
		chunk.before = chunk.before.replace(/(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*$)/,
			function(totalMatch){
				chunk.startTag = totalMatch;
				return "";
			});
			
		chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/,
			function(totalMatch){
				chunk.endTag = totalMatch;
				return "";
			});
		
		var replaceBlanksInTags = function(useBracket){
			
			var replacement = useBracket ? "> " : "";
			
			if(chunk.startTag){
				chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/,
					function(totalMatch, markdown){
						return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
					});
			}
			if(chunk.endTag){
				chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/,
					function(totalMatch, markdown){
						return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
					});
			}
		};
		
		if(/^(?![ ]{0,3}>)/m.test(chunk.selection)){
			command.wrap(chunk, wmd.wmd_env.lineLength - 2);
			chunk.selection = chunk.selection.replace(/^/gm, "> ");
			replaceBlanksInTags(true);
			chunk.skipLines();
		}
		else{
			chunk.selection = chunk.selection.replace(/^[ ]{0,3}> ?/gm, "");
			command.unwrap(chunk);
			replaceBlanksInTags(false);
			
			if(!/^(\n|^)[ ]{0,3}>/.test(chunk.selection) && chunk.startTag){
				chunk.startTag = chunk.startTag.replace(/\n{0,2}$/, "\n\n");
			}
			
			if(!/(\n|^)[ ]{0,3}>.*$/.test(chunk.selection) && chunk.endTag){
				chunk.endTag=chunk.endTag.replace(/^\n{0,2}/, "\n\n");
			}
		}
		
		if(!/\n/.test(chunk.selection)){
			chunk.selection = chunk.selection.replace(/^(> *)/,
			function(wholeMatch, blanks){
				chunk.startTag += blanks;
				return "";
			});
		}
	};

	// DONE
	command.doCode = function(chunk){
		
		var hasTextBefore = /\S[ ]*$/.test(chunk.before);
		var hasTextAfter = /^[ ]*\S/.test(chunk.after);
		
		// Use 'four space' markdown if the selection is on its own
		// line or is multiline.
		if((!hasTextAfter && !hasTextBefore) || /\n/.test(chunk.selection)){
			
			chunk.before = chunk.before.replace(/[ ]{4}$/,
				function(totalMatch){
					chunk.selection = totalMatch + chunk.selection;
					return "";
				});
				
			var nLinesBack = 1;
			var nLinesForward = 1;
			
			if(/\n(\t|[ ]{4,}).*\n$/.test(chunk.before)){
				nLinesBack = 0;
			}
			if(/^\n(\t|[ ]{4,})/.test(chunk.after)){
				nLinesForward = 0;
			}
			
			chunk.skipLines(nLinesBack, nLinesForward);
			
			if(!chunk.selection){
				chunk.startTag = "    ";
				chunk.selection = "print(\"code sample\");";
				return;
			}
			
			if(/^[ ]{0,3}\S/m.test(chunk.selection)){
				chunk.selection = chunk.selection.replace(/^/gm, "    ");
			}
			else{
				chunk.selection = chunk.selection.replace(/^[ ]{4}/gm, "");
			}
		}
		else{
			
			// Use backticks (`) to delimit the code block.
			
			chunk.trimWhitespace();
			chunk.findTags(/`/,/`/);
			
			if(!chunk.startTag && !chunk.endTag){
				chunk.startTag = chunk.endTag="`";
				if(!chunk.selection){
					chunk.selection = "print(\"code sample\");";
				}
			}
			else if(chunk.endTag && !chunk.startTag){
				chunk.before += chunk.endTag;
				chunk.endTag = "";
			}
			else{
				chunk.startTag = chunk.endTag="";
			}
		}
	};
	
	command.autoindent={};
	command.autoindent.textOp = command.doAutoindent;
	command.blockquote = {};
	command.blockquote.description = "Blockquote <blockquote>";
	command.blockquote.image = "images/blockquote.png";
	command.blockquote.key = ".";
	command.blockquote.keyCode = 190;
	command.blockquote.textOp = function(chunk){
		return command.doBlockquote(chunk);
	};
	
	command.code = {};
	command.code.description = "Code Sample <pre><code>";
	command.code.image = "images/code.png";
	command.code.key = "k";
	command.code.textOp = command.doCode;
	
	command.img = {};
	command.img.description = "Image <img>";
	command.img.image = "images/img.png";
	command.img.key = "g";
	command.img.textOp = function(chunk, callback){
		return command.doLinkOrImage(chunk, true, callback);
	};
	
	// DONE
	command.doList = function(chunk, isNumberedList){
		
		var listItemRegex = /(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
		var bulletSymbol = "";
		var num = 1;	// The number in a numbered list.
		
		// Get the item prefix - e.g. " 1. " for a numbered list, " - " for a bulleted list.
		var getItemPrefix = function(){
			var prefix;
			if(isNumberedList){
				prefix = " " + num + ". ";
				num++;
			}
			else{
				var bullet = bulletSymbol || "-";
				prefix = " " + bullet + " ";
			}
			return prefix;
		};
		
		// Does two things, which is kind of dumb.
		// 1. Decides if we have a numbered list or not if the flag isn't set.
		// 2. Makes the list item prefixes uniform.
		var fixPrefixes = function(text){
			
			// Why on EARTH would this variable not be set?
			// Javascript is, without a doubt, the SLOPPIEST language I've encountered in a LONG time.
			if(isNumberedList === undefined){
				isNumberedList = /^\s*\d/.test(text);
			}
			
			text = text.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm,
				function(totalSelection){
					return getItemPrefix();
				});
				
			return text;
		};
		
		// Finds and fixes up the list items after this item.
		// Used when we are editing inside a list.
		var fixLaterItems = function(){
			
			// regexThing is that weird, non-string thing that regexToString returns.
			regexThing = util.regexToString(listItemRegex);
			regexThing.expression = "^\n*" + regexThing.expression;
			var regex = util.stringToRegex(regexThing);
			
			chunk.after = chunk.after.replace(regex, fixPrefixes);
		};
		
		chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);
		
		if(chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)){
			chunk.before += chunk.startTag;
			chunk.startTag = "";
		}
		
		if(chunk.startTag){
			
			var hasDigits = /\d+[.]/.test(chunk.startTag);
			chunk.startTag = "";
			chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, "\n");
			command.unwrap(chunk);
			chunk.skipLines();
			
			if(hasDigits){
				fixLaterItems();
			}
			if(isNumberedList == hasDigits){
				return;
			}
		}
		
		var nLinesUp = 1;
		
		var regexThing = util.regexToString(listItemRegex);
		regexThing.expression = "(\\n|^)" + regexThing.expression + "$";
		var regex = util.stringToRegex(regexThing);
		
		chunk.before = chunk.before.replace(regex,
			function(wholeMatch){
				if(/^\s*([*+-])/.test(wholeMatch)){
					bulletSymbol = re.$1;
				}
				nLinesUp = /[^\n]\n\n[^\n]/.test(wholeMatch) ? 1 : 0;
				return fixPrefixes(wholeMatch);
			});
			
		if(!chunk.selection){
			chunk.selection = "List item";
		}
		
		var prefix = getItemPrefix();
		
		var nLinesDown = 1;
		regexThing = util.regexToString(listItemRegex);
		regexThing.expression = "^\n*" + regexThing.expression;
		regex = util.stringToRegex(regexThing);
		
		chunk.after = chunk.after.replace(regex,
			function(wholeMatch){
				nLinesDown = /[^\n]\n\n[^\n]/.test(wholeMatch) ? 1 : 0;
				return fixPrefixes(wholeMatch);
			});
			
		chunk.trimWhitespace(true);
		chunk.skipLines(nLinesUp, nLinesDown, true);
		chunk.startTag = prefix;
		var spaces = prefix.replace(/./g, " ");
		command.wrap(chunk, wmd.wmd_env.lineLength - spaces.length);
		chunk.selection = chunk.selection.replace(/\n/g, "\n" + spaces);
	};
	
	// DONE
	command.doHeading = function(chunk){
		
		// Remove leading/trailing whitespace and reduce internal spaces to single spaces.
		chunk.selection = chunk.selection.replace(/\s+/g, " ");
		chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, "");
		
		// If we clicked the button with no selected text, we just
		// make a level 2 hash header around some default text.
		if(!chunk.selection){
			chunk.startTag = "## ";
			chunk.selection = "Heading";
			chunk.endTag = " ##";
			return;
		}
		
		var headerLevel = 0;		// The existing header level of the selected text.
		
		// Remove any existing hash heading markdown and save the header level.
		chunk.findTags(/#+[ ]*/, /[ ]*#+/);
		if(/#+/.test(chunk.startTag)){
			headerLevel = re.lastMatch.length;
		}
		chunk.startTag = chunk.endTag = "";
		
		// Try to get the current header level by looking for - and = in the line
		// below the selection.
		chunk.findTags(null, /\s?(-+|=+)/);
		if(/=+/.test(chunk.endTag)){
			headerLevel = 1;
		}
		if(/-+/.test(chunk.endTag)){
			headerLevel = 2;
		}
		
		// Skip to the next line so we can create the header markdown.
		chunk.startTag = chunk.endTag = "";
		chunk.skipLines(1, 1);

		// We make a level 2 header if there is no current header.
		// If there is a header level, we substract one from the header level.
		// If it's already a level 1 header, it's removed.
		var headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;
		
		if(headerLevelToCreate > 0){
			
			// The button only creates level 1 and 2 underline headers.
			// Why not have it iterate over hash header levels?  Wouldn't that be easier and cleaner?
			var headerChar = headerLevelToCreate >= 2 ? "-" : "=";
			var len = chunk.selection.length;
			if(len > wmd.wmd_env.lineLength){
				len = wmd.wmd_env.lineLength;
			}
			chunk.endTag = "\n";
			while(len--){
				chunk.endTag += headerChar;
			}
		}
	};
	
	command.ol = {};
	command.ol.description = "Numbered List <ol>";
	command.ol.image = "images/ol.png";
	command.ol.key = "o";
	command.ol.textOp = function(chunk){
		command.doList(chunk, true);
	};
	
	command.ul = {};
	command.ul.description = "Bulleted List <ul>";
	command.ul.image = "images/ul.png";
	command.ul.key = "u";
	command.ul.textOp = function(chunk){
		command.doList(chunk, false);
	};
	
	command.h1 = {};
	command.h1.description = "Heading <h1>/<h2>";
	command.h1.image = "images/h1.png";
	command.h1.key = "h";
	command.h1.textOp = command.doHeading;
	
	command.hr = {};
	command.hr.description = "Horizontal Rule <hr>";
	command.hr.image = "images/hr.png";
	command.hr.key = "r";
	command.hr.textOp = function(chunk){	
		chunk.startTag = "----------\n";
		chunk.selection = "";
		chunk.skipLines(2, 1, true);
	};
};

if(Attacklab.fileLoaded){
	Attacklab.fileLoaded("wmd-plus.js");
}

