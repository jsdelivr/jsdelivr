/*!
 * SharepointPlus v3.0.7
 * Copyright 2013, Aymeric (@aymkdn)
 * Contact: http://kodono.info
 * Documentation: http://aymkdn.github.com/SharepointPlus/
 * License: GPL v2 (http://aymkdn.github.com/SharepointPlus/license.txt)
 */
if (!Array.prototype.indexOf) {
  /**
    @ignore
    @description in IE7- the Array.indexOf doesn't exist!
  */
  Array.prototype.indexOf = function (searchElement) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

if(!String.prototype.trim) {
  /**
    @ignore
    @escription The trim() feature for String is not always available for all browsers
  */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

// Global
_SP_APPROVED=0;
_SP_REJECTED=1;
_SP_PENDING=2;
_SP_DRAFT=3;
_SP_SCHEDULED=4;
_SP_CACHE_FORMFIELDS=null;

(function(window) {
  // define a faster way to apply a function to an array
  var fastMap = function(source,fn) {
    var iterations = source.length;
    var dest = new Array(iterations);
    var _n = iterations / 8;
    var _caseTest = iterations % 8;
    for (var i = iterations-1; i > -1; i--) {
      var n = _n;
      var caseTest = _caseTest;
      do {
        switch (caseTest) {
          case 0: dest[i]=fn(source[i]); i--;
          case 7: dest[i]=fn(source[i]); i--;
          case 6: dest[i]=fn(source[i]); i--;
          case 5: dest[i]=fn(source[i]); i--;
          case 4: dest[i]=fn(source[i]); i--;
          case 3: dest[i]=fn(source[i]); i--;
          case 2: dest[i]=fn(source[i]); i--;
          case 1: dest[i]=fn(source[i]); i--;
        }
        caseTest = 0;
      } while (--n > 0);
    }
    return dest;
  };

  var decode_b64 = function(d,b,c,u,r,q,x){b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(r=q=x='';c=d.charAt(x++);~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0)c=b.indexOf(c);return r};
  var encode_b64 = function(a,b,c,d,e,f){b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";c="=";for(d=f='';e&=3,a.charAt(d++)||(b='=',e);f+=b.charAt(63&c>>++e*2))c=c<<8|a.charCodeAt(d-=!e);return f};

  /**
    @name $SP()
    @class This is the object uses for all SharepointPlus related actions
   */
  function SharepointPlus() {
    if (!(this instanceof arguments.callee)) return new arguments.callee();
  }
  
  SharepointPlus.prototype = {
    data:[],
    length:0,
    listQueue:[],
    needQueue:false,
    /**
      @name $SP().getVersion
      @description Returns the SP version
      
      @return The current version
    */
   getVersion:function() { return "3.0.4" },
    /**
      @name $SP().list
      @namespace
      @description Permits to define the list ID
      
      @param {String} listID Ths list ID or the list name
      @param {String} [url] If the list name is provided, then you need to make sure URL is provided too (then no need to define the URL again for the chained functions like 'get' or 'update')
      @example
      $SP().list("My List");
      $SP().list("My List","http://my.sharpoi.nt/other.directory/");
    */
    list:function(list,url) {
      this.reset();
      if (url) {
        // make sure we don't have a '/' at the end
        if (url.substring(url.length-1,url.length)==='/') url=url.substring(0,url.length-1)
        this.url=url;
      }
      else this._getURL();
      // if list is not an ID but a name
      /*if (list.charAt(0) != '{') {
        this.listName=list;
        if (url == undefined) throw "Error 'list': not able to find the URL!"; // we cannot determine the url
        var found=false,_this=this;
        this.lists({url:url}).each(function(idx,l) {
          if (l["Name"]==list) {
            _this.listID=l["ID"];
            found=true;
            return false;
          }
        });
        if (!found) throw "Error 'list': not able to find the list called '"+list+"' at "+url;
        return this;
      }*/
      this.listID = list.replace(/&/g,"&amp;");
      return this;
    },
    /**
      @ignore
      @name $SP()._getURL
      @function
      @description (internal use only) Store the current URL website into this.url
     */
    _getURL:function() {
      if (this.url===undefined && typeof L_Menu_BaseUrl==="undefined" && jQuery('body').data('sp-currenturl')===undefined) {
        // we'll use the Webs.asmx service to find the base URL
        this.needQueue=true;
        var _this=this;
        var body="<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><WebUrlFromPageUrl xmlns='http://schemas.microsoft.com/sharepoint/soap/' >"
                +"<pageUrl>"+window.location.href.replace(/&/g,"&amp;")+"</pageUrl></WebUrlFromPageUrl></soap:Body></soap:Envelope>";
        var url = window.location.protocol + "//" + window.location.host + "/_vti_bin/Webs.asmx";
        jQuery.ajax({
          type: "POST",
          cache: false,
          async: true,
          url: url,
          data: body,
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            // we want to use myElem to change the getAttribute function
            var result=data.getElementsByTagName('WebUrlFromPageUrlResult');
            if (result.length) {
              _this.url = result[0].firstChild.nodeValue.toLowerCase();
              // save the result for future use in the page
              jQuery('body').data('sp-currenturl',_this.url);
            }
            _this.needQueue=false;
          }
        });
      } else this.url = this.url || jQuery('body').data('sp-currenturl') || (window.location.protocol +"//"+ window.location.host + L_Menu_BaseUrl);
      return this;
    },
    /**
      @ignore
      @name $SP()._addInQueue
      @function
      @description (internal use only) Add a function in the queue
    */
    _addInQueue:function(args) {
      this.listQueue.push(args);
      if (this.listQueue.length===1) this._testQueue();
      return this
    },
    /**
      @ignore
      @name $SP()._testQueue
      @function
      @description (internal use only) Permits to treat the queue
    */
    _testQueue:function() {
      if (this.needQueue) {
        var _this=this;
        setTimeout(function() { _this._testQueue.call(_this) }, 25);
      } else {
        if (this.listQueue.length > 0) {
          var todo = this.listQueue.shift();
          todo.callee.apply(this, Array.prototype.slice.call(todo));
        }
        this.needQueue=(this.listQueue.length>0);
        if (this.needQueue) {
          var _this=this;
          setTimeout(function() { _this._testQueue.call(_this) }, 25);
        }
      }
    },
    /**
      @name $SP().parse
      @function
      @description Use a WHERE sentence to transform it into a CAML Syntax sentence
      
      @param {String} where The WHERE sentence to change
      @example
      $SP().parse('ContentType="My Content Type" OR Description&lt;>null AND Fiscal_x0020_Week >= 43 AND Result_x0020_Date < "2012-02-03"');
      // -> return &lt;And>&lt;And>&lt;Or>&lt;Eq>&lt;FieldRef Name="ContentType" />&lt;Value Type="Text">My Content Type&lt;/Value>&lt;/Eq>&lt;Gt>&lt;FieldRef Name="Description&lt;" />&lt;/Gt>&lt;/Or>&lt;Geq>&lt;FieldRef Name="Fiscal_x0020_Week" />&lt;Value Type="Number">43&lt;/Value>&lt;/Geq>&lt;/And>&lt;Lt>&lt;FieldRef Name="Result_x0020_Date" />&lt;Value Type="DateTime">2012-02-03&lt;/Value>&lt;/Lt>&lt;/And>
    */
    parse:function(q) {
      var queryString = q.replace(/(\s+)?(=|<=|>=|<>|<|>| LIKE | like )(\s+)?/g,"$2").replace(/""|''/g,"Null").replace(/==/g,"="); // remove unnecessary white space & replace ' 
      var factory = [];
      var limitMax = q.length;
      var closeOperator="", closeTag = "", ignoreNextChar=false;
      var lastField = "";
      var parenthesis = {open:0};
      for (var i=0; i < queryString.length; i++) {
        var letter = queryString.charAt(i);
        switch (letter) {
          case "(": // find the deepest (
                    var start = i;
                    var openedApos=false;
                    while (queryString.charAt(i) == "(" && i < limitMax) { i++; parenthesis.open++; }
                    // find the corresponding )
                    while (parenthesis.open>0 && i < limitMax) {
                      i++;
                      // if there is a ' opened then ignore the ) until the next '
                      var charAtI = queryString.charAt(i);
                      if (charAtI=="\\") ignoreNextChar=true; // when we have a backslash \then ignore the next char
                      else if (!ignoreNextChar && charAtI=="'") openedApos=!openedApos;
                      else if (!ignoreNextChar && charAtI==")" && !openedApos) parenthesis.open--;
                      else ignoreNextChar=false;
                    }
                    
                    var lastIndex = factory.length-1;
  
                    // concat with the first index
                    if (lastIndex>=0) {
                      if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                      factory[0] += this.parse(queryString.substring(start+1, i));
                      if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                      //delete(factory[lastIndex]);
                      closeOperator = "";
                    } else factory[0] = this.parse(queryString.substring(start+1, i));
                    break;
          case ">":  // look at the operand
          case "<": i++;
                    if (queryString.charAt(i) == "=") { // >= or <=
                      factory.push("<"+(letter==">"?"G":"L")+"eq>");
                      closeTag = "</"+(letter==">"?"G":"L")+"eq>";
                    } else if (letter == "<" && queryString.charAt(i) == ">") { // <>
                      factory.push("<Neq>");
                      closeTag = "</Neq>";
                    } else {
                      i--;
                      factory.push("<"+(letter==">"?"G":"L")+"t>");
                      closeTag = "</"+(letter==">"?"G":"L")+"t>";
                    }
                    break;
          case "=": factory.push("<Eq>");
                    closeTag = "</Eq>";
                    break;
          case " ": // check if it's AND or OR
                    if (queryString.substring(i,i+5).toUpperCase() == " AND ") {
                      // add the open tag in the array
                      closeOperator = "And";
                      i+=4;
                    }
                    else if (queryString.substring(i,i+4).toUpperCase() == " OR ") {
                      // add the open tag in the array
                      closeOperator = "Or";
                      i+=3;
                    }
                    else if (queryString.slice(i,i+6).toUpperCase() == " LIKE ") {
                      i+=5;
                      factory.push("<Contains>");
                      closeTag = "</Contains>";
                    }
                    else lastField += letter;
                    break;
          case '"': // look now for the next "
          case "'": var apos = letter;
                    var word = "";
                    while ((letter = queryString.charAt(++i)) != apos && i < limitMax) {
                      if (letter == "\\") letter = queryString.charAt(++i);
                      word+=letter;
                    }
                    lastIndex = factory.length-1;
                    factory[lastIndex] += '<FieldRef Name="'+lastField+'" '+(word=="[Me]"?'LookupId="True" ':'')+'/>';
                    lastField = "";
                    var type = "Text"; //(isNaN(word) ? "Text" : "Number"); // check the type
                    if (/\d{4}-\d\d?-\d\d?((T| )\d{2}:\d{2}:\d{2})?/.test(word) || word == "[Today]") type="DateTime";
                    word = this._cleanString(word);
                    // two special words that are [Today] and [Me]
                    switch(word) {
                      case "[Today]": word = '<Today OffsetDays="0" />'; break;
                      case "[Me]":    word = '<UserID Type="Integer" />'; type = "Integer"; break;
                    }
                    factory[lastIndex] += '<Value Type="'+type+'">'+word+'</Value>';
                    factory[lastIndex] += closeTag;
                    closeTag = "";
                    // concat with the first index
                    if (lastIndex>0) {
                      if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                      factory[0] += factory[lastIndex];
                      if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                      delete(factory[lastIndex]);
                      closeOperator = "";
                    }
                    break;
          case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
                    if (closeTag != "") { // it's the value
                      var value = letter;
                      while (!isNaN(letter = queryString.charAt(++i)) && i < limitMax) value+=""+letter;
                      lastIndex = factory.length-1;
                      factory[lastIndex] += '<FieldRef Name="'+lastField+'" />';
                      lastField = "";
                      factory[lastIndex] += '<Value Type="Number">'+value.replace(/ $/,"")+'</Value>';
                      factory[lastIndex] += closeTag;
                      closeTag = "";
                      // concat with the first index
                      if (lastIndex>0) {
                        if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                        factory[0] += factory[lastIndex];
                        if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                        delete(factory[lastIndex]);
                        closeOperator = "";
                      }
                      i-=2;
                      break;
                    }
          default:  if (closeTag == "") lastField += letter;
                    else if (letter.toLowerCase() == "n" && queryString.substring(i,i+4).toLowerCase() == "null") { // if we have NULL as the value
                      lastIndex = factory.length-1;
                      if (closeTag == "</Neq>") { // <>
                        factory[lastIndex] = "<IsNotNull>";
                        closeTag = "</IsNotNull>";
                      } else if (closeTag == "</Eq>") { // =
                        factory[lastIndex] = "<IsNull>";
                        closeTag = "</IsNull>";
                      }
                      i+=3;
                      factory[lastIndex] += '<FieldRef Name="'+lastField+'" />';
                      lastField = "";
                      factory[lastIndex] += closeTag;
                      closeTag = "";
                      // concat with the first index
                      if (lastIndex>0) {
                        if (closeOperator != "") factory[0] = "<"+closeOperator+">"+factory[0];
                        factory[0] += factory[lastIndex];
                        if (closeOperator != "") factory[0] += "</"+closeOperator+">";
                        delete(factory[lastIndex]);
                        closeOperator = "";
                      }
                    }
        }
      }
      return factory.join("");
    },
    /**
      @ignore
      @name $SP()._parseOn
      @function
      @description (internal use only) Look at the ON clause to convert it
      
      @param {String} on The ON clause
      @return {Array}array of clauses
      @example
      $SP()._parseOn("'List1'.field1 = 'List2'.field2 AND 'List1'.Other_x0020_Field = 'List2'.Some_x0020_Field")
    */
    _parseOn:function(q) {
      var factory = [];
      var queryString = q.replace(/(\s+)?(=)(\s+)?/g,"$2").replace(/==/g,"=").split(" AND ");
      for (var i=0; i<queryString.length; i++) {
        var mtch = queryString[i].match(/'([^']+)'\.([a-zA-Z0-9_]+)='([^']+)'\.([a-zA-Z0-9_]+)/);
        if (mtch && mtch.length==5) {
          var tmp={};
          tmp[mtch[1]] = mtch[2];
          tmp[mtch[3]] = mtch[4];
          factory.push(tmp);
        }
      }
      return factory;
    },
    /**
      @name $SP()._cleanString
      @function
      @description clean a string to remove the bad characters when using AJAX over Sharepoint web services (like <, > and &)
      
      @param {String} string The string to clean
      @note That should be used as an internal function
    */
    _cleanString:function(str) {
      return str.replace(/&(?!amp;|lt;|gt;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    /**
      @name $SP().cleanResult
      @function
      @description clean a string returned by a GET (remove ";#" and "string;#" and null becomes "")
      
      @param {String} str The string to clean
      @param {String} [separator=";"] When it's a list we may want to have a different output (see examples)
      @return {String} the cleaned string

      @example
      $SP().cleanResult("15;#Paul"); // -> "Paul"
      $SP().cleanResult("string;#Paul"); // -> "Paul"
      $SP().cleanResult(";#Paul;#Jacques;#Aymeric;#"); // -> "Paul;Jacques;Aymeric"
      $SP().cleanResult(";#Paul;#Jacques;#Aymeric;#", ", "); // -> "Paul, Jacques, Aymeric"
    */
    cleanResult:function(str,separator) {
      if (str===null || typeof str==="undefined") return "";
      separator = separator || ";";
      return (typeof str==="string"?str.replace(/;#[0-9]+;#/g,separator).replace(/^[0-9]+;#/,"").replace(/^;#|;#$/g,"").replace(/;#/g,separator).replace(/string;#/,""):str);
    },
    /**
      @name $SP().list.get
      @function
      @description Get the content of the list based on different criteria (by default the default view is used)
      
      @param {Object} [setup] Options (see below)
        @param {String}  [setup.fields=""] The fields you want to grab (be sure to add "Attachments" as a field if you want to know the direct link to an attachment)
        @param {String|Array}  [setup.where=""] The query string (like SQL syntax) (you'll need to use double \\ before the inside ' -- see example below); you can use an array that will make the sequential requests but it will return all the data into one array (useful for the Sharepoint 2010 throttling limit)
        @param {Function} [setup.progress] When using an array for the WHERE then you can call the progress function (see the example)
        @param {Boolean} [setup.whereCAML=false] If you want to pass a WHERE clause that is with CAML Syntax only instead of SQL-like syntax
        @param {String}  [setup.orderby=""] The field used to sort the list result (you can also add "ASC" -default- or "DESC")
        @param {String}  [setup.groupby=""] The field used to group by the list result
        @param {String}  [setup.view=""] If you specify a viewID or a viewName that exists for that list, then the fields/where/order settings for this view will be used in addition to the FIELDS/WHERE/ORDERBY you have defined (the user settings will be used first)
        @param {Integer} [setup.rowlimit=0] You can define the number of rows you want to receive back (0 is infinite)
        @param {Boolean} [setup.paging=false] If you have defined the 'rowlimit' then you can use 'paging' to cut by packets your full request -- this is useful when there is a list view threshold
        @param {Boolean} [setup.expandUserField=false] When you get a user field, you can have more information (like name,email,sip,...) by switching this to TRUE
        @param {Boolean} [setup.dateInUTC=true] TRUE to return dates in Coordinated Universal Time (UTC) format. FALSE to return dates in ISO format.
        @param {Object} [setup.folderOptions] Permits to read the content of a Document Library (see below)
          @param {String} [setup.folderOptions.path=""] Relative path of the folders we want to explore (by default it's the root of the document library)
          @param {String} [setup.folderOptions.show="FilesAndFolders_InFolder"] Four values: "FilesOnly_Recursive" that lists all the files recursively from the provided path (and its children); "FilesAndFolders_Recursive" that lists all the files and folders recursively from the provided path (and its children); "FilesOnly_InFolder" that lists all the files from the provided path; "FilesAndFolders_InFolder" that lists all the files and folders from the provided path
        @param {Boolean} [setup.queryOptions=undefined] If you want to provide your own QueryOptions and overwrite the ones built for you -- it should be some XML code (see http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx)
        @param {Object} [setup.join] Permits to create a JOIN closure between the current list and another one: it will be the same syntax than a regular GET (see the example below) (it doesn't use yet the JOIN options provided with Sharepoint 2010)
          @param {String} [setup.join.list] Permits to establish the link between two lists (see the example below)
          @param {String} [setup.join.url='current website'] The website url (if different than the current website)
          @param {String} [setup.join.on] Permits to establish the link between two lists (only between the direct parent list and its child, not with the grand parent) (see the example below)
          @param {Boolean} [setup.join.outer=false] If you want to do an outer join (you can also directly use "outerjoin" instead of "join")
      @param {Function} [result=function(data,error)] A function with the data from the request as first argument, and the second argument is the error message in case something went wrong
      
      @example
      $SP().list("List Name").get(function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });
      
      // with some fields and an orderby command
      $SP().list("ListName","http://www.mysharepoint.com/mydir/").get({
        fields:"Title,Organization",
        orderby:"Title DESC,Test_x0020_Date ASC"
      }, function getData(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });

      // handle the errors
      $SP().list("List Name").get(function(data,error) {
        if (error) { alert(error) }
        for (var i=0; i&lt;data.length; i++) console.log(data[i].getAttribute("Title"));
      });
      
      // the WHERE clause must be SQL-like, and think to use double slash \\ if you have a simple quote '
      // the field names must be the internal names used by Sharepoint
      $SP().list("My List").get({
        fields:"Title",
        where:"Fiscal_x0020_Week > 30 AND Fiscal_x0020_Week &lt; 50 AND Name = 'O\\'Sullivan, James'"
      }),function getData(row) {
        for (var i=row.length;i--;) console.log(row[i].getAttribute("Title"));
      });
      
      // also in the WHERE clause you can use '[Me]' to filter by the current user,
      // or '[Today]' to filter by the current date
      $SP().list("My List").get({
        fields:"Title",
        where:"Author = '[Me]'"
      },function getData(row) {
        console.log(row[0].getAttribute("Title"));
      });
      
      // We have a list called "My List" with a view already set that is called "Marketing View" with some FIELDS and a WHERE clause
      // so the function will grab the view information and will get the data from the list with "Author = '[Me]'" and adding the view's WHERE clause too
      $SP().list("My List","http://my.sharepoint.com/my/site/").get({
        view:"Marketing View",
        where:"Author = '[Me]'"
      }, function(data) {
        for (var i=data.length; i--;) console.log(data[i].getAttribute("Title") + " by " + data[i].getAttribute("Author"));
      });

      // use the paging option for the large list to avoid the message "the attempted operation is prohibited because it exceeds the list view threshold enforced by the administrator"
      $SP().list("My List").get({fields:"ID,Title",rowlimit:5000,paging:true}, function(data) {
        console.log(data.length); // -> 23587
      })
      
      // We can also find the files from a Document Shared Library
      $SP().list("Shared Documents","http://my.share.point.com/my_site/").get({
        fields:"FileLeafRef,File_x0020_Size",
      }, function getData(data) {
        for (var i=0; i<&lt;data.length; i++) console.log("FileName:"+data[i].getAttribute("FileLeafRef"),"FileSize:"+data[i].getAttribute("File_x0020_Size"));
      });
      
      // We can join two or more lists together based on a condition
      // ATTENTION: in that case the DATA passed to the callback will return a value for "LIST NAME.FIELD_x0020_NAME" and not directly "FIELD_x0020_NAME"
      // ATTENTION: you need to make sure to call the 'fields' that will be used in the 'on' clause
      $SP().list("Finance and Expense","http://my.sharepoint.com/my_sub/dir/").get({
        fields:"Expense_x0020_Type",
        where:"Finance_x0020_Category = 'Supplies'",
        join:{
          list:"Purchasing List",
          fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Cost",
          where:"Region = 'EMEA' AND Year = 2012",
          orderby:"Expense_x0020_Type,Finance_x0020_Category",
          on:"'Purchasing List'.Expense_x0020_Type = 'Finance and Expense'.Expense_x0020_Type",
          join:{
            list:"Financial Static Data",
            fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Forecast",
            where:"Region = 'EMEA' AND Year = 2012",
            on:"'Purchasing List'.Region = 'Financial Static Data'.Region AND 'Purchasing List'.Expense_x0020_Type = 'Financial Static Data'.Expense_x0020_Type"
          }
        }
      },function getData(data) {
        for (var i=0; i&lt;data.length; i++)
          console.log(data[i].getAttribute("Purchasing List.Region")+" | "+data[i].getAttribute("Purchasing List.Year")+" | "+data[i].getAttribute("Purchasing List.Expense_x0020_Type")+" | "+data[i].getAttribute("Purchasing List.Cost"));
      });
      
      // By default "join" is an "inner join", but you can also do an "outerjoin"
      // ATTENTION: in that case the DATA passed to the callback will return a value for "LIST NAME.FIELD_x0020_NAME" and not directly "FIELD_x0020_NAME"
      // ATTENTION: you need to make sure to call the 'fields' that will be used in the 'on' clause
      $SP().list("Finance and Expense","http://my.sharepoint.com/my_sub/dir/").get({
        fields:"Expense_x0020_Type",
        where:"Finance_x0020_Category = 'Supplies'",
        join:{
          list:"Purchasing List",
          fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Cost",
          where:"Region = 'EMEA' AND Year = 2012",
          orderby:"Expense_x0020_Type,Finance_x0020_Category",
          on:"'Purchasing List'.Expense_x0020_Type = 'Finance and Expense'.Expense_x0020_Type",
          outerjoin:{
            list:"Financial Static Data",
            fields:"Region,Year,Expense_x0020_Type,Finance_x0020_Category,Forecast",
            where:"Region = 'EMEA' AND Year = 2012",
            on:"'Purchasing List'.Region = 'Financial Static Data'.Region AND 'Purchasing List'.Expense_x0020_Type = 'Financial Static Data'.Expense_x0020_Type"
          }
        }
      },function getData(data) {
        for (var i=0; i&lt;data.length; i++)
          console.log(data[i].getAttribute("Purchasing List.Region")+" | "+data[i].getAttribute("Purchasing List.Year")+" | "+data[i].getAttribute("Purchasing List.Expense_x0020_Type")+" | "+data[i].getAttribute("Purchasing List.Cost"));
      })

      // With Sharepoint 2010 we are limited due to the throttling limit (see here for some very interesting information http://www.glynblogs.com/2011/03/sharepoint-2010-list-view-throttling-and-custom-caml-queries.html)
      // So for example if I do WHERE:'Fiscal_x0020_Year = 2012' it will return an error because I have 6,500 items
      // So I'll do several requests for each Fiscal_x0020_Week into this Fiscal Year
      var query=[],q=[];
      for (var i=1; i&lt;54; i++) {
        q.push("Fiscal_x0020_Week = "+i);
        if (i%8==0 || i == 53) {
          query.push("("+q.join(" OR ")+") AND Fiscal_x0020_Year = 2012");
          q=[]
        }
      }
      // it returns :
      // [
      //   "(Fiscal_x0020_Week = 1 OR Fiscal_x0020_Week = 2 OR Fiscal_x0020_Week = 3 OR Fiscal_x0020_Week = 4 OR Fiscal_x0020_Week = 5 OR Fiscal_x0020_Week = 6 OR Fiscal_x0020_Week = 7 OR Fiscal_x0020_Week = 8) AND Fiscal_x0020_Year = 2012",
      //   ...
      //   "(Fiscal_x0020_Week = 49 OR Fiscal_x0020_Week = 50 OR Fiscal_x0020_Week = 51 OR Fiscal_x0020_Week = 52 OR Fiscal_x0020_Week = 53) AND Fiscal_x0020_Year = 2012"
      // ]
      $SP().list("Sessions").get({
        fields:"Title,Score",
        where:query,
        progress:function progress(current,max) {
          console.log("Progress: "+current+" / "+max);
        }
      },function getData(data) {
        console.log(data.length); // -> 6,523
      });

      // if you want to list only the files visible into a folder for a Document Library
      $SP().list("My Shared Documents").get({
        fields:"BaseName,FileRef,FSObjType", // "BaseName" is the name of the file/folder; "FileRef" is the full path of the file/folder; "FSObjType" is 0 for a file and 1 for a folder (you need to apply $SP().cleanResult())
        folderOptions:{
          path:"My Folder/Sub Folder/",
          show:"FilesOnly_InFolder"
        }
      });

      // if you want to list all the files and folders for a Document Library
      $SP().list("My Shared Documents").get({
        fields:"BaseName,FileRef,FSObjType", // "BaseName" is the name of the file/folder; "FileRef" is the full path of the file/folder; "FSObjType" is 0 for a file and 1 for a folder (you need to apply $SP().cleanResult())
        folderOptions:{
          show:"FilesAndFolders_Recursive"
        }
      });
    */
    get:function(setup, fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'get': you have to define the list ID/Name";
      if (arguments.length === 1 && typeof setup === "function") return this.get({}, setup);
  
      // default values
      setup           = setup || {};
      if (this.url == undefined) throw "Error 'get': not able to find the URL!"; // we cannot determine the url
      setup.fields    = setup.fields || "";
      setup.where     = setup.where || "";
      setup.orderby   = setup.orderby || "";
      setup.groupby   = setup.groupby || "";
      setup.rowlimit  = setup.rowlimit || 0;
      setup.paging    = (setup.paging===true ? true : false);
      if (setup.paging && setup.rowlimit === 0) setup.rowlimit = 5000; // if rowlimit is not defined, we set it to 5000 by default
      setup.expandUserField = (setup.expandUserField===true?"True":"False");
      setup.dateInUTC = (setup.dateInUTC===true?"True":"False");
      setup.folderOptions = setup.folderOptions || null;
      setup.view      = setup.view || "";
      // if (setup.whereCAML!==true) setup.whereCAML = (setup.view!="");
      setup.results = setup.results || []; // internal use when there is a paging
      setup.ListItemCollectionPositionNext = setup.ListItemCollectionPositionNext || ""; // internal use when there is paging
      
      // if setup.where is an array, then it means we want to do several requests
      // so we keep the first WHERE
      if (typeof setup.where === "object") {
        if (setup.originalWhere==undefined) setup.originalWhere = setup.where.slice(0);
        setup.nextWhere = setup.where.slice(1);
        setup.where = setup.where.shift();
      } else {
        setup.originalWhere = setup.where;
        setup.nextWhere = [];
      }
      // we use the progress only when WHERE is an array
      setup.progress = setup.progress || (function() {});

      // if view is defined and is not a GUID, then we need to find the view ID
      if (setup.view !== "") {
        if (setup.view.charAt(0)!=="{") {
          var _this=this;
          // retrieve the View ID based on its name
          // and find the view details
          _this.view(setup.view,function(data,viewID) {
            setup.view=viewID;
            var where = (setup.whereCAML ? setup.where : _this.parse(setup.where));
            where += data.whereCAML;
            if (setup.where !== "" && data.whereCAML !== "") where = "<And>" + where + "</And>";
            setup.where=where;
            setup.fields += (setup.fields===""?"":",") + data.fields.join(",");
            setup.orderby += (setup.orderby===""?"":",") + data.orderby;
            setup.whereCAML=true;
            setup.useOWS=true;
            delete setup.view;
            return _this.get.call(_this,setup,fct);
          });
          return this;
        }

        if (setup.whereCAML!==true) {
          setup.where = this.parse(setup.where);
          setup.whereCAML=true;
        }
      }
      
      // if we have [Me]/[Today] in the WHERE, or we want to use the GROUPBY,
      // then we want to use the Lists.asmx service
      // also for Sharepoint 2010
      // depreciate since v3.0
      var useOWS = true;//( setup.groupby!="" || /\[Me\]|\[Today\]/.test(setup.where) || setup.forceOWS===true || typeof SP=="object");
      
      // what about the fields ?
      var fields="";
      if (setup.fields == "" || setup.fields == [])
        fields = "";
      else {
        if (typeof setup.fields == "string") setup.fields = setup.fields.replace(/^\s+/,"").replace(/\s+$/,"").replace(/( )?,( )?/g,",").split(",");
        // depreciate since v3.0 // if (setup.fields.indexOf("Attachments") != -1) useOWS=true;
        for (var i=0; i<setup.fields.length; i++) fields += '<FieldRef Name="'+setup.fields[i]+'" />';
          // depreciate since v3.0 fields += '<Field'+(useOWS?'Ref':'')+' Name="'+setup.fields[i]+'" />';
      }
            
      // what about sorting ?
      var orderby="";
      if (setup.orderby != "") {
        var fieldsDir = setup.orderby.split(",");
        for (i=0; i<fieldsDir.length; i++) {
          var direction = "ASC";
          var splt      = jQuery.trim(fieldsDir[i]).split(" ");
          if (splt.length > 0) {
            if (splt.length==2) direction = splt[1].toUpperCase();
            orderby += ( useOWS ? '<FieldRef Name="'+splt[0]+'" Ascending="'+(direction=="ASC")+'" />' : '<OrderField Name="'+splt[0]+'" Direction="'+direction+'" />' );
          }
        }
      }
      // LookupValue="True"
      
      // what about groupby ?
      var groupby="";
      if (setup.groupby != "") {
        var gFields = setup.groupby.split(",");
        for (i=0; i<gFields.length; i++)
          groupby += '<FieldRef Name="'+gFields[i]+'" />';
      }
      
      // forge the parameters
      var body = "";
      var aReturn = [];

      // if no queryOptions provided then we set the default ones
      if (setup.queryOptions === undefined) {
        setup._queryOptions = "<DateInUtc>"+setup.dateInUTC+"</DateInUtc>"
                           + "<Paging ListItemCollectionPositionNext=\""+setup.ListItemCollectionPositionNext+"\"></Paging>"
                           + "<IncludeAttachmentUrls>True</IncludeAttachmentUrls>"
                           + (fields==="" ? "" : "<IncludeMandatoryColumns>False</IncludeMandatoryColumns>")
                           + "<ExpandUserField>"+setup.expandUserField+"</ExpandUserField>";
        // check if we want something related to the folders
        if (setup.folderOptions) {
          var viewAttr;
          switch (setup.folderOptions.show) {
            case "FilesAndFolders_Recursive": viewAttr="RecursiveAll"; break
            case "FilesOnly_InFolder": viewAttr="FilesOnly"; break
            case "FilesAndFolders_InFolder": viewAttr=""; break
            case "FilesOnly_Recursive":
            default: viewAttr="Recursive"
          }
          setup._queryOptions += "<ViewAttributes Scope=\""+viewAttr+"\"></ViewAttributes>"
          if (setup.folderOptions.path) setup.queryOptions += "<Folder>"+this.url + this.listID + '/' + setup.folderOptions.path+"</Folder>"
        } else
          setup._queryOptions += "<ViewAttributes Scope=\"Recursive\"></ViewAttributes>"
      } else setup._queryOptions = setup.queryOptions

      var _this=this;
      if (useOWS) {
        body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
              + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
              + "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" "
              + "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
              + "<soap:Body>" 
              + "<GetListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
              + "<listName>"+this.listID+"</listName>"
              + "<viewName>"+setup.view+"</viewName>"
              + "<query>"
              + "<Query>"
              + ( setup.where!="" ? "<Where>"+ (setup.whereCAML?setup.where:this.parse(setup.where)) +"</Where>" : "" )
              + ( groupby!="" ? "<GroupBy>"+groupby+"</GroupBy>" : "" )
              + ( orderby!="" ? "<OrderBy>"+orderby+"</OrderBy>" : "" )
              + "</Query>"
              + "</query>"
              + "<viewFields>"
              + "<ViewFields Properties='True'>"
              + fields
              + "</ViewFields>"
              + "</viewFields>"
              + "<rowLimit>"+setup.rowlimit+"</rowLimit>"
              + "<queryOptions>"
              + "<QueryOptions>"
              + setup._queryOptions
              + "</QueryOptions>"
              + "</queryOptions>"
              + "</GetListItems>"
              + "</soap:Body>"
              + "</soap:Envelope>";
        // do the request
        var url = this.url + "/_vti_bin/Lists.asmx";
        jQuery.ajax({type: "POST",
                     cache: false,
                     async: true,
                     url: url,
                     data: body,
                     contentType: "text/xml; charset=utf-8",
                     dataType: "xml",
                     success:function(data) {
                            // we want to use myElem to change the getAttribute function
                            var rows=data.getElementsByTagName('z:row');
                            if (rows.length==0) rows=data.getElementsByTagName('row'); // for Chrome 'bug'
                            aReturn = fastMap(rows, function(row) { return myElem(row); });
                            // we have data from a previous list, so let's merge all together the both of them
                            if (setup.joinData) {
                              var on = setup.joinData["noindex"];
                              var aResult = [];
                              var prevIndex="";
                              var listIndexFound={length:0};
                              if (!on.length) alert("$SP.get() -- Error 'get': you must define the ON clause with JOIN is used.");
                              // we have a linked list so do some stuff here to tie the two lists together
                              for (var i=0,stop=aReturn.length; i<stop; i++) {
                                var index="";
                                for (var j=0; j<on.length; j++) index += aReturn[i].getAttribute(on[j][_this.listID]);
                                // check if the index exists in the previous set of data
                                if (setup.joinData[index]) {
                                  if (prevIndex!==index) {
                                    listIndexFound[setup.joinIndex[index]]=true;
                                    listIndexFound.length++;
                                    prevIndex=index;
                                  }
                                  // we merge the joinData and the aReturn
                                  for (var j=0,joinDataLen=setup.joinData[index].length; j<joinDataLen; j++) {
                                    var tmp=[];
                                    // find the attributes for the current list
                                    var attributesReturn=aReturn[i].getAttributes();
                                    for (var attr=attributesReturn.length; attr--;) {
                                      tmp[_this.listID+"."+attributesReturn[attr].nodeName.slice(4)] = attributesReturn[attr].nodeValue;
                                    }
                                    // now find the attributes for the joinData
                                    var attributesJoinData=setup.joinData[index][j].getAttributes();
                                    for (var attr in attributesJoinData) {
                                      tmp[attr] = setup.joinData[index][j].getAttribute(attr);
                                    }
                                    
                                    aResult.push(new extendMyObject(tmp));
                                  }
                                }
                                // for the default options
                                if (setup.innerjoin) setup.join=setup.innerjoin;
                                if (setup.outerjoin) {
                                  setup.join=setup.outerjoin;
                                  setup.join.outer=true;
                                }
                                
                              }
                              aReturn=aResult;
                              
                              // if we want to do an outerjoin we link the missing data
                              if (setup.outer) {
                                var joinIndexLen=setup.joinIndex.length;
                                if (listIndexFound.length < joinIndexLen) {
                                  for (i=0; i<joinIndexLen; i++) {
                                    if (listIndexFound[i] !== true) {
                                      var idx = setup.joinIndex[i];
                                      if (idx===undefined || setup.joinData[idx]===undefined) continue
                                      for (var j=0,joinDataLen=setup.joinData[idx].length; j<joinDataLen; j++) {
                                        var tmp=[];
                                        var attributesJoinData=setup.joinData[idx][j].getAttributes();
                                        for (var attr in attributesJoinData) {
                                          tmp[attr] = setup.joinData[idx][j].getAttribute(attr);
                                        }
                                        aResult.push(new extendMyObject(tmp));
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            
                            if (setup.outerjoin) { setup.join=setup.outerjoin; setup.join.outer=true }
                            else if (setup.innerjoin) setup.join=setup.innerjoin;
                            // if we join it with another list
                            if (setup.join) {
                             var joinData=[],joinIndex=[];
                             // retrieve the ON clauses
                             var on=_this._parseOn(setup.join.on);
                             joinData["noindex"]=on; // keep a copy of it for the next treatment in the tied list
                             for (var i=0,stop=aReturn.length; i<stop; i++) {
                               // create an index that will be used in the next list to filter it
                               var index="",tmp=[];
                               for (var j=0; j<on.length; j++) index += aReturn[i].getAttribute(on[j][_this.listID]) || aReturn[i].getAttribute(_this.listID+"."+on[j][_this.listID]);
                               if (!joinData[index]) {
                                 joinIndex[index]=joinIndex.length;
                                 joinIndex.push(index);
                                 joinData[index] = [];
                               }
                               // if we are coming from some other join
                               if (setup.joinData) {
                                 joinData[index].push(aReturn[i]);
                               } else {
                                 var attributes=aReturn[i].getAttributes();
                                 for (var j=attributes.length; j--;) {
                                   tmp[_this.listID+"."+attributes[j].nodeName.slice(4)] = attributes[j].nodeValue;
                                 }
                                 joinData[index].push(new extendMyObject(tmp));
                               }
                             }
                             delete setup.joinData;
                             //call the joined list to grab data and process them
                             var sp=$SP().list(setup.join.list,setup.join.url||_this.url);
                             setup.join.joinData=joinData;
                             setup.join.joinIndex=joinIndex;
                             sp.get(setup.join,fct);
                            } else {
                              // if setup.results length is bigger than 0 then it means we need to add the current data
                              if (setup.results.length>0)
                                for (var i=0,stop=aReturn.length; i<stop; i++) setup.results.push(aReturn[i])
                                
                              // depending of the setup.nextWhere length we update the progress
                              if (typeof setup.originalWhere !== "string")
                                setup.progress(setup.originalWhere.length-setup.nextWhere.length,setup.originalWhere.length);
                              
                              // if we have a paging then we need to do the request again
                              if (setup.paging) {
                                // check if we need to go to another request
                                var collection = data.getElementsByTagName("rs:data")[0];
                                if (collection.length==0) collection=data.getElementsByTagName("data"); // for Chrome
                                if (setup.results.length===0) setup.results=aReturn
                                var nextPage = collection.getAttribute("ListItemCollectionPositionNext");
                                if (nextPage) {
                                  // we need more calls
                                  setup.ListItemCollectionPositionNext=_this._cleanString(collection.getAttribute("ListItemCollectionPositionNext"));
                                  _this.get(setup,fct)
                                } else {
                                  // it means we're done, no more call
                                  if (typeof fct == "function") fct.call(_this,setup.results)
                                }
                              } else if (setup.nextWhere.length>0) { // if we need to so some more request
                                if (setup.results.length===0) setup.results=aReturn
                                setup.where = setup.nextWhere.slice(0);
                                _this.get(setup,fct)
                              } else if (typeof fct == "function") {
                                // rechange setup.where with the original one just in case it was an array to make sure we didn't override the original array
                                setup.where = setup.originalWhere;
                                fct.call(_this,(setup.results.length>0?setup.results:aReturn));
                              }
                            }
                      },
                      error:function(jqXHR, textStatus, errorThrown) {
                        var res = jqXHR.responseXML;
                        var err = res.getElementsByTagName("errorstring");
                        if (err && err[0]) fct.call(_this,[],"Error: "+err[0].firstChild.nodeValue)
                        else fct.call(_this,[],textStatus+": "+errorThrown);
                      }
                   });
      } /*else {
        body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" "
                + "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope\/\">"
                +" <soap:Header xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope\/\">"
                +" <dsp:versions xmlns:dsp=\"http://schemas.microsoft.com/sharepoint/dsp\">"
                +" <dsp:version>1.0</dsp:version>"
                +" </dsp:versions>"
                +" <dsp:request xmlns:dsp=\"http://schemas.microsoft.com/sharepoint/dsp\" service=\"DspSts\" document=\"content\" method=\"query\">"
                +" </dsp:request>"
                +" </soap:Header>"
                + "<soap:Body>" 
                + "<queryRequest "
                +" xmlns=\"http://schemas.microsoft.com/sharepoint/dsp\">"
                +" <dsQuery select=\"/list[@id='"+this.listID+"']\""
                +" resultContent=\"dataOnly\""
                +" columnMapping=\"attribute\" resultRoot=\"Rows\" resultRow=\"Row\">"
                +" <Query RowLimit=\""+(setup.rowlimit>0?setup.rowlimit:-1)+"\">"
                +" <Fields>"+fields+"</Fields>"
                +" <Where>"+ (setup.whereCAML?setup.where:this.parse(setup.where)) +"</Where>"
                +" "+ ( groupby!="" ? "<GroupBy>"+groupby+"</GroupBy>" : "" )
                +" "+ ( orderby!="" ? "<OrderBy>"+orderby+"</OrderBy>" : "" )
                +" </Query>"
                +" </dsQuery>"
                +" </queryRequest>"
                + "</soap:Body>"
                + "</soap:Envelope>";
        // do the request
        var url = setup.url + "/_vti_bin/dspsts.asmx";
        jQuery.ajax({type: "POST",
                     cache: false,
                     async: true,
                     url: url,
                     data: body,
                     contentType: "text/xml; charset=utf-8",
                     beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/dsp/queryRequest'); },
                     dataType: "xml",
                     success:function(data) {
                       var aReturn=data.getElementsByTagName('Row');
                       if (setup.join) {
                         var on=[];
                         for (var i=0,stop=aReturn.length; i<stop; i++) on[aReturn[i].getAttribute(setup.join.on)]=aReturn[i];
                         var sp=$SP().list(setup.join.list,setup.join.url||setup.url);
                         setup.join.joinData=on;
                         sp.get(setup.join,fct);
                       }
                       else if (typeof fct == "function") fct.call(_this,aReturn,setup.joinData)
                     }
                   });
      }*/
      return this;
    },
    /**
      @name $SP().createFile
      @function
      @description Create a file and save it to a Document library
      
      @param {Object} setup Options (see below)
        @param {String} setup.content The file content
        @param {String} setup.destination The full path to the file to create
        @param {Boolean} [setup.encoded=false] Set to true if the content passed is already base64-encoded
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.after=function(){}] A callback function that will be triggered after the task
   
      @example
      // create a text document
      $SP().createFile({
        content:"Hello World!",
        destination:"http://mysite/Shared Documents/myfile.txt",
        url:"http://mysite/",
        after:function() { alert("File created!"); }
      });
      
      // we can also create an Excel file
      // a good way to export some data to Excel
      $SP().createFile({
        content:"&lt;table>&lt;tr>&lt;th>Column A&lt;/th>&lt;th>Column B&lt;/th>&lt;/tr>&lt;tr>&lt;td>Hello&lt;/td>&lt;td>World!&lt;/td>&lt;/tr>&lt;/table>",
        destination:"http://mysite/Shared Documents/myfile.xls",
        url:"http://mysite/",
        after:function() {
          window.location.href="http://mysite/Shared Documents/myfile.xls";
        }
      });

      // You can use https://github.com/Aymkdn/FileToDataURI if you want to be able to read a local file
      // and then upload it to a document library, via Javascript/Flash
      // We'll use "encoded:true" to say our content is alreadu a base64 string
      $SP().createFile({
        content:"*your stuff with FileToDataURI that returns a base64 string*",
        encoded:true,
        destination:"http://mysite/Shared Documents/myfile.xls",
        url:"http://mysite/"
      });

      // NOTE: in some cases the file are automatically checked out, so you have to use $SP().checkin()
    */
    createFile:function(setup) {
      // default values
      setup     = setup || {};
      if (setup.content == undefined) throw "Error 'createFile': not able to find the file content.";
      if (setup.destination == undefined) throw "Error 'createFile': not able to find the file destination path.";
      setup.url = setup.url || this.url;
      // if we didn't define the url in the parameters, then we need to find it
      if (!setup.url) {
        this._getURL();
        return this._addInQueue(arguments);
      }
      if (setup.url == undefined) throw "Error 'createFile': not able to find the URL!"; // we cannot determine the url
      setup.after = setup.after || (function(){});
      setup.encoded = (setup.encoded==undefined?false:setup.encoded);

      var _this=this;
      var soapEnv  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                    +"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                    +"<soap:Body>"
                    +"<CopyIntoItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
                    +"<SourceUrl>http://null</SourceUrl>"
                    +"<DestinationUrls><string>"+setup.destination+"</string></DestinationUrls>"
                    +"<Fields><FieldInformation Type='File' /></Fields>"
                    +"<Stream>"+(setup.encoded?setup.content:encode_b64(setup.content))+"</Stream>"
                    +"</CopyIntoItems>"
                    +"</soap:Body>"
                    +"</soap:Envelope>";
      jQuery.ajax({
        url: setup.url + "/_vti_bin/copy.asmx",
        type: "POST",
        dataType: "xml",
        data: soapEnv,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/CopyIntoItems'); },
        contentType: "text/xml; charset=\"utf-8\"",
        success:function(data) {
          var a = data.getElementsByTagName('CopyResult');
          if (a && a[0] && a[0].getAttribute("ErrorCode") != "Success") throw "Error 'createFile': "+a[0].getAttribute("ErrorCode")+" - "+a[0].getAttribute("ErrorMessage");
          if (typeof setup.after == "function") setup.after.call(_this);
        }
      });

      return this;
    },
    /**
      @name $SP().createFolder
      @function
      @description Create a folter in a Document library
      
      @param {Object} setup Options (see below)
        @param {String} setup.path The relative path to the new folder
        @param {String} setup.library The name of the Document Library
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.after=function(){}] A callback function that will be triggered after the task
   
      @example
      // create a folder called "first" at the root of the Shared Documents library
      // the result should be "http://mysite/Shared Documents/first/"
      $SP().createFolder({
        path:"first",
        library:"Shared Documents",
        url:"http://mysite/",
        after:function() { alert("Folder created!"); }
      });
      
      // create a folder called "second" under "first" 
      // the result should be "http://mysite/Shared Documents/first/second/"
      // if "first" doesn't exist then it will be created
      $SP().createFolder({
        path:"first/second",
        library:"Shared Documents",
        after:function() { alert("Folder created!"); }
      });

      // Note: To delete a folder you can use $SP().list().remove()
    */
    createFolder:function(setup) {
      // default values
      setup     = setup || {};
      if (setup.path == undefined) throw "Error 'createFolder': please provide the 'path'.";
      if (setup.library == undefined) throw "Error 'createFolder': please provide the library name.";
      setup.url = setup.url || this.url;
      // if we didn't define the url in the parameters, then we need to find it
      if (!setup.url) {
        this._getURL();
        return this._addInQueue(arguments);
      }
      if (setup.url == undefined) throw "Error 'createFolder': not able to find the URL!"; // we cannot determine the url
      setup.after = setup.after || (function(){});

      // split the path based on '/'
      var path = setup.path.split('/'), toAdd=[], tmpPath="";
      for (var i=0; i<path.length; i++) {
        tmpPath += (i>0?'/':'') + path[i];
        toAdd.push({FSObjType:1, BaseName:tmpPath})
      }
      this.list(setup.library, setup.url).add(toAdd, {after:setup.after})
      return this;
    },
    /**
      @name $SP().checkin
      @function
      @description Checkin a file
      
      @param {Object} [setup] Options (see below)
        @param {String} setup.destination The full path to the file to check in
        @param {String} [setup.comments=""] The comments related to the check in
        @param {String} [setup.url='current website'] The website url
        @param {Function} [setup.success=function(){}] A callback function that will be triggered when there is success
        @param {Function} [setup.error=function(){}] A callback function that will be triggered if there is an error
        @param {Function} [setup.after=function(){}] A callback function that will be triggered after the task
   
      @example
      $SP().checkin({
        destination:"http://mysite/Shared Documents/myfile.txt",
        comments:"Automatic check in with SharepointPlus",
        after:function() { alert("Done"); }
      });
    */
    checkin:function(setup) {
      // default values
      setup     = setup || {};
      if (setup.destination == undefined) throw "Error 'checkin': not able to find the file destination path.";
      setup.url = setup.url || this.url;
      // if we didn't define the url in the parameters, then we need to find it
      if (!setup.url) {
        this._getURL();
        return this._addInQueue(arguments);
      }
      if (this.url == undefined) throw "Error 'checkin': not able to find the URL!"; // we cannot determine the url
      setup.url = this.url;
      setup.comments = setup.comments || "";
      setup.success = setup.success || (function(){});
      setup.error = setup.error || (function(){});
      setup.after = setup.after || (function(){});

      var _this=this;
      var soapEnv = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
      + '<soap:Body><CheckInFile xmlns="http://schemas.microsoft.com/sharepoint/soap/">'
      + '<pageUrl>'+setup.destination+'</pageUrl>'
      + '<comment>'+setup.comments+'</comment>'
      + '<CheckinType>1</CheckinType></CheckInFile></soap:Body></soap:Envelope>';

      jQuery.ajax({
        url: setup.url + "/_vti_bin/Lists.asmx",
        type: "POST",
        dataType: "xml",
        data: soapEnv,
        beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/CheckInFile'); },
        contentType: "text/xml; charset=utf-8",
        success:function(data) {
          var res = data.getElementsByTagName('CheckInFileResult');
          if (res && res[0] && res[0].firstChild.nodeValue != "true") setup.error.call(_this);
          else setup.success.call(_this);

          setup.after.call(_this);
        }
      });
    },
    /**
      @name $SP().list.getAttachment
      @function
      @description Get the attachment(s) for some items
      
      @param {String|Array} itemID The item IDs separated by a coma (ATTENTION: one request is done for each ID)
      @param {Function} [result] A function with the data from the request as first argument
      
      @example
      $SP().list("My List","http://my.site.com/mydir/").getAttachment([1,15,24],function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i]);
      });
      
      $SP().list("My List").getAttachment("98", function(data) {
        for (var i=0; i&lt;data.length; i++) console.log(data[i]);
      });
    */
    getAttachment:function(itemID, fct, passed) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'getAttachment': you have to define the list ID/Name";
      if (arguments.length === 1 && typeof itemID === "function") throw "Error 'getAttachment': you have to define the item ID";
      if (this.url == undefined) throw "Error 'getAttachment': not able to find the URL!"; // we cannot determine the url
      if (typeof itemID !== "object") itemID = itemID.split(",");
      passed = passed || [];

      // forge the parameters
      var body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                 + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                 + "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" "
                 + "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                 + " <soap:Body>"
                 + " <GetAttachmentCollection xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
                 + " <listName>"+this.listID+"</listName>"
                 + " <listItemID>"+itemID.shift()+"</listItemID>"
                 + " </GetAttachmentCollection>"
                 + " </soap:Body>"
                 + "</soap:Envelope>";
      // do the request
      var _this=this;
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      jQuery.ajax({type: "POST",
                   cache: false,
                   async: true,
                   url: url,
                   data: body,
                   contentType: "text/xml; charset=utf-8",
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetAttachmentCollection'); },
                   dataType: "xml",
                   success:function(data) {
                      var a = data.getElementsByTagName('Attachment');
                      for (var i=0; i < a.length; i++) aReturn.push(a[i].firstChild.nodeValue);
                      if (aReturn.length===0) aReturn="";
                      else if (aReturn.length===1) aReturn=aReturn[0]
                      passed.push(aReturn);
                      // if we don't have any more attachment to search for
                      if (itemID.length===0) {
                        if (typeof fct === "function") fct.call(_this,passed);
                      } else {
                        // we have more attachments to find
                        _this.getAttachment(itemID,fct,passed)
                      }
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.info
      @function
      @description Get the information (StaticName, DisplayName, Description, Required ("TRUE", "FALSE", null), DefaultValue, Choices, etc...) - metadata - regarding the list for each column
      
      @param {Function} [function()] A function with the data from the request as first argument
      
      @example
      $SP().list("List Name").info(function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });
      
      $SP().list("My list","http://intranet.site.com/dept/").info(function(fields) {
        for (var i=0; i&lt;fields.length; i++) console.log(fields[i]["DisplayName"]+ ": "+fields[i]["Description"]);
      });
    */
    info:function(fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'info': you have to define the list ID";
        
      // default values
      if (this.url == undefined) throw "Error 'info': not able to find the URL!"; // we cannot determine the url
      
      // forge the parameters
      var body = '<?xml version="1.0" encoding="utf-8"?>';
      body += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      body += '  <soap:Body>';
      body += '    <GetList xmlns="http://schemas.microsoft.com/sharepoint/soap/">';
      body += '      <listName>'+this.listID+'</listName>';
      body += '    </GetList>';
      body += '  </soap:Body>';
      body += '</soap:Envelope>';
      
      // do the request
      var _this=this;
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      jQuery.ajax({type: "POST",
                   cache: false,
                   async: true,
                   url: url,
                   data: body,
                   contentType: "text/xml; charset=utf-8",
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetList'); },
                   dataType: "xml",
                   success:function(data) {
                     var arr = data.getElementsByTagName('Field');
                     var index = 0, aIndex, attributes, attrName, lenDefault;
                     for (var i=0; i < arr.length; i++) {
                       if (arr[i].getAttribute("ID")) {
                         aReturn[index] = [];
                         aIndex=aReturn[index];
                         attributes=arr[i].attributes;
                         for (var j=attributes.length; j--;) {
                           attrName=attributes[j].nodeName;
                           attrValue=attributes[j].nodeValue;
                           if (attrName==="Type") {
                             switch (attrValue) {
                               case "Choice":
                               case "MultiChoice": {
                                 aIndex["FillInChoice"] = arr[i].getAttribute("FillInChoice");
                                 var a=arr[i].getElementsByTagName("CHOICE");
                                 var r=[];
                                 for(var k=0; k<a.length; k++) r.push(a[k].firstChild.nodeValue);
                                 aIndex["Choices"]=r;
                                 break;
                               }
                               case "Lookup":
                               case "LookupMulti":
                                 aIndex["Choices"]={list:arr[i].getAttribute("List"),field:arr[i].getAttribute("ShowField")};
                                 break;
                               default:
                                 aIndex["Choices"] = [];
                             }
                           }
                           aIndex[attrName]= attrValue;
                         }
                         
                         // find the default values
                         lenDefault=arr[i].getElementsByTagName("Default").length;
                         if (lenDefault>0) {
                           nodeDefault=arr[i].getElementsByTagName("Default");
                           aReturn[index]["DefaultValue"]=[];
                           for (var q=0; q<lenDefault; q++) nodeDefault[q].firstChild && aReturn[index]["DefaultValue"].push(nodeDefault[q].firstChild.nodeValue);
                           if (lenDefault===1) aReturn[index]["DefaultValue"]=aReturn[index]["DefaultValue"][0];
                         } else aReturn[index]["DefaultValue"]=null;

                         index++;
                       }
                     }
                      
                     if (typeof fct == "function") fct.call(_this,aReturn);
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.view
      @function
      @description Get the info (fields, orderby, whereCAML) for a View
      
      @param {String} [viewID="The default view"] The view ID or view Name
      @param {Function} [function()] A function with the data from the request as first argument and the viewID as second parameter
      
      @example
      $SP().list("List Name").view("All Items",function(data,viewID) {
        for (var i=0; i&lt;data.fields.length; i++) console.log("Column "+i+": "+data.fields[i]);
        console.log("And the GUI for this view is :"+viewID);
      });
      
      $SP().list("My List","http://my.sharepoint.com/my/site").view("My Beautiful View",function(data,viewID) {
        for (var i=0; i&lt;data.fields.length; i++) console.log("Column "+i+": "+data.fields[i]);
      });
    */
    view:function(viewID, fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'view': you have to define the list ID/Name";
      if (arguments.length === 1 && typeof viewID === "function") return this.view("", viewID);
  
      // default values
      list = this.listID;
      if (this.url == undefined) throw "Error 'view': not able to find the URL!"; // we cannot determine the url
      viewID = viewID || "";
      var viewName = arguments[2] || viewID;
      
      viewName=viewName.toLowerCase();
      // check if we didn't save this information before
      var savedView = jQuery('body').data('sp-view');
      if (savedView!=undefined) {
        for (var i=savedView.length; i--;) {
          if (savedView[i].url===this.url && (savedView[i].viewID===viewID || savedView[i].viewName===viewName)) { fct.call(this,savedView[i].data,viewID); return this }
        }
      } else savedView=[];
      
      // if viewID is not an ID but a name then we need to find the related ID
      if (viewID.charAt(0) !== '{') {
        this.views(function(views) {
          var found=false;
          for (var i=views.length; i--;) {
            if (views[i]["Name"]===viewID) {
              this.view(views[i]["ID"],fct,viewID);
              found=true;
              break;
            }
          }
          if (!found) throw "Error 'view': not able to find the view called '"+viewID+"' at "+this.url;
        });
        return this;
      }

      // forge the parameters
      var body = '<?xml version="1.0" encoding="utf-8"?>';
      body += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      body += '  <soap:Body>';
      body += '    <GetView xmlns="http://schemas.microsoft.com/sharepoint/soap/">';
      body += '      <listName>'+this.listID+'</listName>';
      body += '      <viewName>'+viewID+'</viewName>';
      body += '    </GetView>';
      body += '  </soap:Body>';
      body += '</soap:Envelope>';
      
      // do the request
      var url = this.url + "/_vti_bin/Views.asmx";
      var aReturn = ["fields","orderby","whereCAML"];
      var _this=this;
      jQuery.ajax({type: "POST",
                   cache: false,
                   async: true,
                   url: url,
                   data: body,
                   contentType: "text/xml; charset=utf-8",
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetView'); },
                   dataType: "xml",
                   success:function(data) {
                     aReturn.fields=[]
                     var arr = data.getElementsByTagName('ViewFields')[0].getElementsByTagName('FieldRef');
                     for (var i=0; i < arr.length; i++) aReturn.fields.push(arr[i].getAttribute("Name"));
                    
                     aReturn.orderby="";
                     arr = data.getElementsByTagName('OrderBy');
                     if (arr.length) {
                       var orderby=[];
                       arr = arr[0].getElementsByTagName('FieldRef');
                       for (var i=0; i<arr.length; i++) orderby.push(arr[i].getAttribute("Name")+" "+(arr[i].getAttribute("Ascending")==undefined?"ASC":"DESC"));
                       aReturn.orderby=orderby.join(",");
                     }
                     
                     aReturn.whereCAML="";
                     var where=data.getElementsByTagName('Where');
                     if (where.length) {
                       where=where[0].xml || (new XMLSerializer()).serializeToString(where[0]);
                       where=where.match(/<Where [^>]+>(.*)<\/Where>/);
                       if(where.length==2) aReturn.whereCAML=where[1];
                     }
                     
                     // cache the data
                     savedView.push({url:_this.url,data:aReturn,viewID:viewID,viewName:viewName});
                     jQuery('body').data('sp-view',savedView);
                     
                     if (typeof fct == "function") fct.call(_this,aReturn,viewID);
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.views
      @function
      @description Get the views info (ID, Name, Url) for a List
      
      @param {Function} [function()] A function with the data from the request as first argument
      
      @example
      $SP().list("My List").views(function(view) {
        for (var i=0; i&lt;view.length; i++) console.log("View #"+i+": "+view[i]['Name']");
      });
    */
    views:function(fct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'views': you have to define the list ID";
        
      // default values
      if (this.url == undefined) throw "Error 'views': not able to find the URL!"; // we cannot determine the url
      fct = fct || function(){};
            
      // check if we didn't save this information before
      var savedViews = jQuery('body').data('sp-views');
      if (savedViews!=undefined) {
        for (var i=savedViews.length; i--;) {
          if (savedViews[i].url==this.url) { fct.call(this,savedViews[i].data); return this }
        }
      } else savedViews=[];
      
      // forge the parameters
      var body = '<?xml version="1.0" encoding="utf-8"?>';
      body += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      body += '  <soap:Body>';
      body += '    <GetViewCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/">';
      body += '      <listName>'+this.listID+'</listName>';
      body += '    </GetViewCollection>';
      body += '  </soap:Body>';
      body += '</soap:Envelope>';
      
      // do the request
      var url = this.url + "/_vti_bin/Views.asmx";
      var aReturn = [];
      var _this=this;
      jQuery.ajax({type: "POST",
                   cache: false,
                   async: true,
                   url: url,
                   data: body,
                   contentType: "text/xml; charset=utf-8",
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetViewCollection'); },
                   dataType: "xml",
                   success:function(data) {
                    var arr = data.getElementsByTagName('View');
                    for (var i=0; i < arr.length; i++) {
                      aReturn[i] = [];
                      aReturn[i]["ID"] = arr[i].getAttribute("Name");
                      aReturn[i]["Name"] = arr[i].getAttribute("DisplayName");
                      aReturn[i]["Url"] = arr[i].getAttribute("Url");
                    }
                    
                    // save the data into the DOM for later usage
                    savedViews.push({url:_this.url,data:aReturn});
                    jQuery('body').data('sp-views',savedViews);
                    fct.call(_this,aReturn);
                   }
                 });
      return this;
    },
    /**
      @name $SP().lists
      @function
      @description Get the lists from the site (for each list we'll have "ID", "Name", "Description", "Url")
      
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [function()] A function with the data from the request as first argument
      
      @example
      $SP().lists(function(list) {
        for (var i=0; i&lt;list.length; i++) console.log("List #"+i+": "+list[i]['Name']");
      });
    */
    lists:function(setup, fct) {
      if (arguments.length===1 && typeof setup === "function") return this.lists({}, setup);
        
      // default values
      setup = setup || {};
      setup.url = setup.url || this.url;
      // if we didn't define the url in the parameters, then we need to find it
      if (!setup.url) {
        this._getURL();
        return this._addInQueue(arguments);
      } else this.url=setup.url
      if (this.url == undefined) throw "Error 'lists': not able to find the URL!"; // we cannot determine the url
      
      // forge the parameters
      var body = '<?xml version="1.0" encoding="utf-8"?>';
      body += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      body += '  <soap:Body>';
      body += '    <GetListCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/">';
      body += '    </GetListCollection>';
      body += '  </soap:Body>';
      body += '</soap:Envelope>';
      
      // check if we didn't save this information before
      var savedLists = jQuery('body').data('sp-lists');
      if (savedLists!=undefined) {
        for (var i=savedLists.length; i--;) {
          if (savedLists[i].url==this.url) {
            if (typeof fct == "function") fct(savedLists[i].data);
            else {
              this.data = savedLists[i].data;
              this.length = this.data.length;
            }
            return this;
          }
        }
      } else savedLists=[];
      
      // do the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var aReturn = [];
      var _this=this;
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   contentType:"text/xml; charset=utf-8",
                   beforeSend:function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetListCollection'); },
                   dataType:"xml",
                   success:function(data) {
                    var arr = data.getElementsByTagName('List');
                    for (var i=0; i < arr.length; i++) {
                      aReturn[i] = [];
                      aReturn[i]["ID"] = arr[i].getAttribute("ID");
                      aReturn[i]["Name"] = arr[i].getAttribute("Title");
                      aReturn[i]["Url"] = arr[i].getAttribute("DefaultViewUrl");
                      aReturn[i]["Description"] = arr[i].getAttribute("Description");
                    }
                    
                    // save the data into the DOM for later usage
                    savedLists.push({url:_this.url,data:aReturn});
                    jQuery('body').data('sp-lists',savedLists);
                    if (typeof fct == "function") fct.call(_this,aReturn);
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.add
      @function
      @description Add items into a Sharepoint List
                   note: A Date must be provided as "YYYY-MM-DD hh:mm:ss", or you can use $SP().toSPDate(new Date())
                   note: A person must be provided as "-1;#email" (e.g. "-1;#foo@bar.com") OR NT login with double \ (eg "-1;#europe\\foo_bar") OR the user ID
                   note: A lookup value must be provided as "X;#value", with X the ID of the value from the lookup list.
                   note: A URL field must be provided as "http://www.website.com, Name"
                   note: A multiple selection must be provided as ";#choice 1;#choice 2;#", or just pass an array as the value and it will do the trick
                   note: A Yes/No checkbox must be provided as "1" (for TRUE) or "0" (for "False")
                   note: You cannot change the Approval Status when adding, you need to use the $SP().moderate function
      
      @param {Object|Array} items List of items (e.g. [{Field_x0020_Name: "Value", OtherField: "new value"}, {Field_x0020_Name: "Value2", OtherField: "new value2"}])
      @param {Object} [setup] Options (see below)
        @param {Function} [setup.progress] (current,max) If you provide more than 15 items then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [setup.success] A function with the items added sucessfully
        @param {Function} [setup.error] A function with the items not added
        @param {Function} [setup.after] A function that will be executed at the end of the request
        @param {Boolean} [setup.escapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;amp;')
      
      @example
      $SP().list("My List").add({Title:"Ok"});
      
      $SP().list("List Name").add([{Title:"Ok"}, {Title:"Good"}], {after:function() { alert("Done!"); });
                 
      $SP().list("My List","http://my.sharepoi.nt/dir/").add({Title:"Ok"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error '"+items[i].errorMessage+"' with:"+items[i].Title); // the 'errorMessage' attribute is added to the object
      }, success:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Success for:"+items[i].Title+" (ID:"+items[i].ID+")");
      }});
      
      // different ways to add John and Tom into the table
      $SP().list("List Name").add({Title:"John is the Tom's Manager",Manager:"-1;#john@compagny.com",Report:"-1;#tom@compagny.com"}); // if you don't know the ID
      $SP().list("My List").add({Title:"John is the Tom's Manager",Manager:"157",Report:"874"}); // if you know the Lookup ID 
    */
    add:function(items, setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (arguments.length===0 || (arguments.length===1 && typeof items !== "object"))
        throw "Error 'add': you need to define the list of items";
      if (this.listID===undefined) throw "Error 'add': you need to use list() to define the list name.";
      
      // default values
      setup         = setup || {};
      if (this.url == undefined) throw "Error 'add': not able to find the URL!"; // we cannot determine the url
      setup.success = setup.success || (function() {});
      setup.error   = setup.error || (function() {});
      setup.after   = setup.after || (function() {});
      setup.escapeChar = (setup.escapeChar == undefined) ? true : setup.escapeChar;
      setup.progress= setup.progress || (function() {});
      
      if (typeof items === "object" && items.length==undefined) items = [ items ];
      var itemsLength=items.length;
      
      // define current and max for the progress
      setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spAdd"+(""+Math.random()).slice(2)};
      // we cannot add more than 15 items in the same time, so split by 15 elements
      // and also to avoid surcharging the server
      if (itemsLength > 15) {
        var nextPacket=items.slice(0);
        var cutted=nextPacket.splice(0,15);
        var _this=this;
        jQuery(document).on(setup.progressVar.eventID,function(event) {
          jQuery(document).off(setup.progressVar.eventID);
          _this.add(nextPacket,event.setup);
        });
        this.add(cutted,setup);
        return this;
      } else if (itemsLength == 0) {
        setup.progress(1,1);
        setup.error([]);
        setup.success([]);
        setup.after();
        return this;
      }
      
      // increment the progress
      setup.progressVar.current += itemsLength;
      
      // build a part of the request
      var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
      var _this = this;
      for (var i=0; i < items.length; i++) {
        updates += '<Method ID="'+(i+1)+'" Cmd="New">';
        updates += '<Field Name=\'ID\'>New</Field>';
        jQuery.each(items[i], function(key, value) {
          if (typeof value === "object" && value.items!=undefined) value = ";#" + value.join(";#") + ";#"; // an array should be seperate by ";#"
          if (setup.escapeChar && typeof value === "string") value = _this._cleanString(value); // replace & (and not &amp;) by "&amp;" to avoid some issues
          updates += "<Field Name='"+key+"'>"+value+"</Field>";
        });
        updates += '</Method>';
      }
      updates += '</Batch>';
      
      // build the request
      var body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
               + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
               + "<soap:Body>"
               + "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
               + "<listName>"+this.listID+"</listName>"
               + "<updates>"
               + updates
               + "</updates>"
               + "</UpdateListItems>"
               + "</soap:Body>"
               + "</soap:Envelope>";
               
      // send the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var _this=this;     
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
                   contentType:"text/xml; charset=utf-8",
                   dataType:"xml",
                   success:function(data) {
                     var result = data.getElementsByTagName('Result');
                     var len=result.length;
                     var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
                     for (var i=0; i < len; i++) {
                       if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") { // success
                         var rows=result[i].getElementsByTagName('z:row');
                         if (rows.length==0) rows=result[i].getElementsByTagName('row'); // for Chrome 'bug'
                         items[i].ID = rows[0].getAttribute("ows_ID");
                         passed.push(items[i]);
                       } else {
                         items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                         failed.push(items[i]);
                       }
                     }
                     
                     setup.progress(setup.progressVar.current,setup.progressVar.max);
                     // check if we have some other packets that are waiting to be treated
                     if (setup.progressVar.current < setup.progressVar.max)
                       jQuery(document).trigger({type:setup.progressVar.eventID,setup:setup});
                     else {
                      if (failed.length>0) setup.error.call(_this,failed);
                      if (passed.length>0) setup.success.call(_this,passed);
                      setup.after.call(_this);
                     }
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.update
      @function
      @description Update items from a Sharepoint List
      
      @param {Array} items List of items (e.g. [{ID: 1, Field_x0020_Name: "Value", OtherField: "new value"}, {ID:22, Field_x0020_Name: "Value2", OtherField: "new value2"}])
      @param {Object} [setup] Options (see below)
        @param {String} [setup.where=""] You can define a WHERE clause
        @param {Function} [setup.progress] Two parameters: 'current' and 'max' -- if you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [setup.success] One parameter: 'passedItems' -- a function with the items updated sucessfully
        @param {Function} [setup.error] One parameter: 'failedItems' -- a function with the items not updated
        @param {Function} [setup.after] A function that will be executed at the end of the request
        @param {Boolean} [setup.escapeChar=true] Determines if we want to escape the special chars that will cause an error (for example '&' will be automatically converted to '&amp;')
        
      @example
      $SP().list("My List").update({ID:1, Title:"Ok"}); // you must always provide the ID
      $SP().list("List Name").update({Title:"Ok"},{where:"Status = 'Complete'"}); // if you use the WHERE then you must not provide the item ID
      
      $SP().list("My List","http://sharepoint.org/mydir/").update([{ID:5, Title:"Ok"}, {ID: 15, Title:"Good"}]);
                 
      $SP().list("List Name").update({ID:43, Title:"Ok"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error '"+items[i].errorMessage+"' with:"+items[i].Title));
      }});
    */
    update:function(items, setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID===undefined) throw "Error 'update': you need to use list() to define the list name.";
      
      // default values
      setup         = setup || {};
      if (this.url == undefined) throw "Error 'update': not able to find the URL!"; // we cannot determine the url
      setup.where   = setup.where || "";
      setup.success = setup.success || (function() {});
      setup.error   = setup.error || (function() {});
      setup.after   = setup.after || (function() {});
      setup.escapeChar = (setup.escapeChar == undefined) ? true : setup.escapeChar;
      setup.progress= setup.progress || (function() {});
           
      if (typeof items === "object" && items.length==undefined) items = [ items ];
      var itemsLength=items.length;
      
      // if there is a WHERE clause
      if (itemsLength == 1 && setup.where) {
        // call GET first
        delete items[0].ID;
        var _this=this;
        this.get({fields:"ID",where:setup.where},function(data) {
          // we need a function to clone the items
          var clone = function(obj){
            var newObj = {};
            for (var k in obj) newObj[k]=obj[k];
            return newObj;
          };
          var aItems=[];
          for (var i=data.length;i--;) {
            var it=clone(items[0]);
            it.ID=data[i].getAttribute("ID");
            aItems.push(it);
          }
          delete setup.where;
          // now call again the UPDATE
          _this.update(aItems,setup);
        });
        return this;
      }
      
      // define current and max for the progress
      setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spUpdate"+(""+Math.random()).slice(2)};
      // we cannot add more than 15 items in the same time, so split by 15 elements
      // and also to avoid surcharging the server
      if (itemsLength > 15) {
        var nextPacket=items.slice(0);
        var cutted=nextPacket.splice(0,15);
        var _this=this;
        jQuery(document).on(setup.progressVar.eventID,function(event) {
          jQuery(document).off(setup.progressVar.eventID);
          _this.update(nextPacket,event.setup);
        });
        this.update(cutted,setup);
        return this;
      } else if (itemsLength == 0) {
        setup.progress(1,1);
        setup.error([]);
        setup.success([]);
        setup.after();
        return this;
      }
      
      // increment the progress
      setup.progressVar.current += itemsLength;

      // build a part of the request
      var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
      var _this = this;
      for (var i=0; i < itemsLength; i++) {
        updates += '<Method ID="'+(i+1)+'" Cmd="Update">';
        if (items[i].ID == undefined) throw "Error 'update': you have to provide the item ID called 'ID'";
        jQuery.each(items[i], function(key, value) {
          if (typeof value === "object" && value.length!=undefined) value = ";#" + value.join(";#") + ";#"; // an array should be seperate by ";#"
          if (setup.escapeChar && typeof value === "string") value = _this._cleanString(value); // replace & (and not &amp;) by "&amp;" to avoid some issues
          updates += "<Field Name='"+key+"'>"+value+"</Field>";
        });
        updates += '</Method>';
      }
      updates += '</Batch>';
      
      // build the request
      var body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
               + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
               + "<soap:Body>"
               + "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
               + "<listName>"+this.listID+"</listName>"
               + "<updates>"
               + updates
               + "</updates>"
               + "</UpdateListItems>"
               + "</soap:Body>"
               + "</soap:Envelope>";

      // send the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var _this=this;
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var result = data.getElementsByTagName('Result');
                     var len=result.length;
                     var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
                     for (var i=0; i < len; i++) {
                       if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") // success
                         passed.push(items[i]);
                       else {
                         items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                         failed.push(items[i]);
                       }
                     }
                     
                     setup.progress(setup.progressVar.current,setup.progressVar.max);
                     // check if we have some other packets that are waiting to be treated
                     if (setup.progressVar.current < setup.progressVar.max)
                       jQuery(document).trigger({type:setup.progressVar.eventID,setup:setup});
                     else {
                       if (failed.length>0) setup.error.call(_this,failed);
                       if (passed.length>0) setup.success.call(_this,passed);
                       setup.after.call(_this);
                     }
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.history
      @function
      @description When a textarea/multiple lines of text has the versioning option, then you can use this function to find the previous values
      
      @param {Object} params See below
        @param {String|Number} params.ID The item ID
        @param {String} params.Name The field name
      @param {Function} returnFct This function will have one parameter that is the data returned

      @example
      $SP().list("My List").history({ID:1981, Name:"Critical_x0020_Comments"}, function(data) {
        for (var i=0,len=data.length; i<len; i++) {
          console.log("Date: "+data[i].getAttribute("Modified")); // you can use $SP().toDate() to convert it to a JavaScript Date object
          console.log("Editor: "+data[i].getAttribute("Editor")); // it's the long format type, so the result looks like that "328;#Doe,, John,#DOMAIN\john_doe,#John_Doe@example.com,#,#Doe,, John"
          console.log("Content: "+data[i].getAttribute("Critical_x0020_Comments")); // use the field name here
        }
      });
    */
    history:function(params, returnFct) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID===undefined) throw "Error 'history': you need to use list() to define the list name.";
      if (arguments.length !== 2) throw "Error 'history': you need to provide two parameters.";
      if (typeof params !== "object") throw "Error 'history': the first parameter must be an object.";
      else {
        if (params.ID === undefined || params.Name === undefined) throw "Error 'history': the first parameter must be an object with ID and Name.";
      }
      if (typeof returnFct !== "function") throw "Error 'history': the second parameter must be a function.";

      // build the request
      var body = "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
               + "<soap:Body><GetVersionCollection xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
               + "<strlistID>"+this.listID+"</strlistID>"
               + "<strlistItemID>"+params.ID+"</strlistItemID>"
               + "<strFieldName>"+params.Name+"</strFieldName>"
               + "</GetVersionCollection></soap:Body></soap:Envelope>";

      // send the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var _this=this;
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetVersionCollection'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     returnFct.call(_this, data.getElementsByTagName('Version'))
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.moderate
      @function
      @description Moderate items from a Sharepoint List
      
      @param {Array} approval List of items and ApprovalStatus (e.g. [{ID:1, ApprovalStatus:"Approved"}, {ID:22, ApprovalStatus:"Pending"}])
      @param {Object} [setup] Options (see below)
        @param {Function} [setup.success] A function with the items updated sucessfully
        @param {Function} [setup.error] A function with the items not updated
        @param {Function} [setup.after] A function that will be executed at the end of the request
        @param {Function} [setup.progress] Two parameters: 'current' and 'max' -- if you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps
        
      @example
      $SP().list("My List").moderate({ID:1, ApprovalStatus:"Rejected"}); // you must always provide the ID
      
      $SP().list("List Name").moderate([{ID:5, ApprovalStatus:"Pending"}, {ID: 15, ApprovalStatus:"Approved"}]);
                 
      $SP().list("Other List").moderate({ID:43, ApprovalStatus:"Approved"}, {
        error:function(items) {
          for (var i=0; i &lt; items.length; i++) console.log("Error with:"+items[i].ID);
        },
        success:function(items) {
          for (var i=0; i &lt; items.length; i++) console.log("Success with:"+items[i].getAttribute("Title"));
        }
      });
    */
    moderate:function(items, setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (arguments.length===0 || (arguments.length===1 && typeof items === "object" && items.length === undefined))
        throw "Error 'moderate': you need to define the list of items";
      if (this.listID===undefined) throw "Error 'moderate': you need to use list() to define the list name.";
      
      // default values
      setup         = setup || {};
      if (this.url == undefined) throw "Error 'moderate': not able to find the URL!"; // we cannot determine the url
      setup.async   = (setup.async == undefined) ? true : setup.async;
      setup.success = setup.success || (function() {});
      setup.error   = setup.error || (function() {});
      setup.after   = setup.after || (function() {});
      setup.progress= setup.progress || (function() {});
      
      if (typeof items === "object" && items.length==undefined) items = [ items ];
      var itemsLength=items.length;

      // define current and max for the progress
      setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spModerate"+(""+Math.random()).slice(2)};

      // we cannot add more than 15 items in the same time, so split by 15 elements
      // and also to avoid surcharging the server
      if (itemsLength > 15) {
        var nextPacket=items.slice(0);
        var cutted=nextPacket.splice(0,15);
        var _this=this;
        jQuery(document).on(setup.progressVar.eventID,function(event) {
          jQuery(document).off(setup.progressVar.eventID);
          _this.moderate(nextPacket,event.setup);
        });
        this.moderate(cutted,setup);
        return this;
      } else if (itemsLength == 0) {
        setup.progress(1,1);
        setup.success([]);
        setup.error([]);
        setup.after();
        return this;
      }
      
      // increment the progress
      setup.progressVar.current += itemsLength;

      // build a part of the request
      var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
      var thisObject = this;
      for (var i=0; i < itemsLength; i++) {
        updates += '<Method ID="'+(i+1)+'" Cmd="Moderate">';
        if (items[i].ID == undefined) throw "Error 'moderate': you have to provide the item ID called 'ID'";
        else if (items[i].ApprovalStatus == undefined) throw "Error 'moderate': you have to provide the approval status 'ApprovalStatus' (Approved, Rejected, Pending, Draft or Scheduled)";
        jQuery.each(items[i], function(key, value) {
          if (key == "ApprovalStatus") {
            key = "_ModerationStatus";
            switch (value.toLowerCase()) {
              case "approve":
              case "approved":  value=0; break;
              case "reject":
              case "deny":
              case "denied":
              case "rejected":  value=1; break;
              case "pending":   value=2; break;
              case "draft":     value=3; break;
              case "scheduled": value=4; break;
              default:          value=2; break;
            }
          }
          updates += "<Field Name='"+key+"'>"+value+"</Field>";
        });
        updates += '</Method>';
      }
      updates += '</Batch>';
      
      // build the request
      var body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
               + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
               + "<soap:Body>"
               + "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
               + "<listName>"+this.listID+"</listName>"
               + "<updates>"
               + updates
               + "</updates>"
               + "</UpdateListItems>"
               + "</soap:Body>"
               + "</soap:Envelope>";
               
      // send the request
      var url = this.url + "/_vti_bin/lists.asmx";
      var _this=this;
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var result = data.getElementsByTagName('Result');
                     var len=result.length;
                     var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
                     var rows;
                     for (var i=0; i < len; i++) {
                       rows=result[i].getElementsByTagName('z:row');
                       if (rows.length==0) rows=data.getElementsByTagName('row'); // for Chrome
                       var item = myElem(rows[0]);
                       if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") // success
                         passed.push(item);
                       else {
                         items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                         failed.push(items[i]);
                       }
                     }
                     
                     setup.progress(setup.progressVar.current,setup.progressVar.max);
                     // check if we have some other packets that are waiting to be treated
                     if (setup.progressVar.current < setup.progressVar.max)
                       jQuery(document).trigger({type:setup.progressVar.eventID,setup:setup});
                     else {
                       if (passed.length>0) setup.success.call(_this,passed);
                       if (failed.length>0) setup.error.call(_this,failed);
                       setup.after.call(_this);
                     }
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.remove
      @function
      @description Delete items from a Sharepoint List
      @note You can also use the key word 'del' instead of 'remove'
      
      @param {Objet|Array} itemsID List of items ID (e.g. [{ID:1}, {ID:22}]) | ATTENTION if you want to delete a file you have to add the "FileRef" e.g. {ID:2,FileRef:"path/to/the/file.ext"}
      @param {Object} [setup] Options (see below)
        @param {Function} [setup.progress] Two parameters: 'current' and 'max' -- If you provide more than 15 ID then they will be treated by packets and you can use "progress" to know more about the steps
        @param {Function} [setup.success] One parameter: 'passedItems' -- a function with the items updated sucessfully
        @param {Function} [setup.error] (One parameter: 'failedItems' -- a function with the items not updated
        @param {Function} [setup.after] A function that will be executed at the end of the request
      
      @example
      $SP().list("My List").remove({ID:1}); // you must always provide the ID
      
      // we can use the WHERE clause instead providing the ID
      $SP().list("My List").remove({where:"Title = 'OK'",progress:function(current,max) {
        console.log(current+"/"+max);
      }});
      
      // delete several items
      $SP().list("List Name", "http://my.sharepoint.com/sub/dir/").remove([{ID:5}, {ID:7}]);
           
      // example about how to use the "error" callback
      $SP().list("List").remove({ID:43, Title:"My title"}, {error:function(items) {
        for (var i=0; i &lt; items.length; i++) console.log("Error with:"+items[i].ID+" ("+items[i].errorMessage+")"); // only .ID and .errorMessage are available
      }});

      // example for deleting a file
      $SP().list("My Shared Documents").remove({ID:4,FileRef:"my/directory/My Shared Documents/something.xls"});
    */
    remove:function(items, setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      
      // default values
      if (!setup && items.where) { setup=items; items=[]; } // the case when we use the "where"
      setup         = setup || {};
      if (this.url == undefined) throw "Error 'remove': not able to find the URL!"; // we cannot determine the url
      setup.error   = setup.error || (function() {});
      setup.success = setup.success || (function() {});
      setup.after   = setup.after || (function() {});
      setup.progress= setup.progress || (function() {});
           
      if (typeof items === "object" && items.length==undefined) items = [ items ];
      var itemsLength=items.length;
      
      // if there is a WHERE clause
      if (setup.where) {
        // call GET first
        if (itemsLength==1) delete items[0].ID;
        var _this=this;
        this.get({fields:"ID,FileRef",where:setup.where},function(data) {
          // we need a function to clone the items
          var clone = function(obj){
            var newObj = {};
            for (var k in obj) newObj[k]=obj[k];
            return newObj;
          };
          var aItems=[],fileRef;
          for (var i=data.length;i--;) {
            var it=clone(items[0]);
            it.ID=data[i].getAttribute("ID");
            fileRef=data[i].getAttribute("FileRef");
            if (fileRef) it.FileRef=$SP().cleanResult(fileRef);
            aItems.push(it);
          }
          // now call again the REMOVE
          delete setup.where;
          _this.remove(aItems,setup);
        });
        return this;
      } else if (itemsLength == 0) {
        // nothing to delete
        setup.progress(1,1);
        setup.error.call(_this,[]);
        setup.success.call(_this,[]);
        setup.after.call(_this)
        return _this;
      }
      
      // define current and max for the progress
      setup.progressVar = setup.progressVar || {current:0,max:itemsLength,passed:[],failed:[],eventID:"spRemove"+(""+Math.random()).slice(2)};
      // we cannot add more than 15 items in the same time, so split by 15 elements
      // and also to avoid surcharging the server
      if (itemsLength > 15) {
        var nextPacket=items.slice(0);
        var cutted=nextPacket.splice(0,15);
        var _this=this;
        jQuery(document).on(setup.progressVar.eventID,function(event) {
          jQuery(document).off(setup.progressVar.eventID);
          _this.remove(nextPacket,event.setup);
        });
        this.remove(cutted,setup);
        return this;
      }
      // increment the progress
      setup.progressVar.current += itemsLength;

      // build a part of the request
      var updates = '<Batch OnError="Continue" ListVersion="1"  ViewName="">';
      for (var i=0; i < items.length; i++) {
        updates += '<Method ID="'+(i+1)+'" Cmd="Delete">';
        if (items[i].ID == undefined) throw "Error 'delete': you have to provide the item ID called 'ID'";
        updates += "<Field Name='ID'>"+items[i].ID+"</Field>";
        if (items[i].FileRef != undefined) updates += "<Field Name='FileRef'>"+items[i].FileRef+"</Field>";
        updates += '</Method>';
      }
      updates += '</Batch>';
      
      // build the request
      var body = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
               + "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
               + "<soap:Body>"
               + "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">"
               + "<listName>"+this.listID+"</listName>"
               + "<updates>"
               + updates
               + "</updates>"
               + "</UpdateListItems>"
               + "</soap:Body>"
               + "</soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = this.url + "/_vti_bin/lists.asmx";
      jQuery.ajax({type:"POST",
                   cache:false,
                   async:true,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var result = data.getElementsByTagName('Result');
                     var len=result.length;
                     var passed = setup.progressVar.passed, failed = setup.progressVar.failed;
                     for (var i=0; i < len; i++) {
                       if (result[i].getElementsByTagName('ErrorCode')[0].firstChild.nodeValue == "0x00000000") // success
                         passed.push(items[i]);
                       else {
                         items[i].errorMessage = result[i].getElementsByTagName('ErrorText')[0].firstChild.nodeValue;
                         failed.push(items[i]);
                       }
                     }
                     
                     setup.progress(setup.progressVar.current,setup.progressVar.max);
                     // check if we have some other packets that are waiting to be treated
                     if (setup.progressVar.current < setup.progressVar.max)
                       jQuery(document).trigger({type:setup.progressVar.eventID,setup:setup});
                     else {
                      if (failed.length>0) setup.error.call(_this,failed);
                      if (passed.length>0) setup.success.call(_this,passed);
                      setup.after.call(_this);
                     }
                   }
                 });
      return this;
    },
    del:function(items, setup) { return this.remove(items,setup) },
    /**
      @name $SP().usergroups
      @function
      @description Find the Sharepoint groups where the specified user is member of
      
      @param {String} username The username with the domain (don't forget to use a double \ like "mydomain\\john_doe")
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.error=true] The function will stop and throw an error when something went wrong (use FALSE to don't throw an error)
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result
      
      @example
      $SP().usergroups("mydomain\\john_doe",{url:"http://my.si.te/subdir/"}, function(groups) {
        for (var i=0; i &lt; groups.length; i++) console.log(groups[i]); // -> "Roadmap Admin", "Global Viewers", ...
      });
    */
    usergroups:function(username, setup, fct) {
      switch (arguments.length) {
          case 1: if (typeof username === "object") return this.usergroups("",username,function(){});
                  else if (typeof username === "function") return this.usergroups("",{},username);
                  break;
          case 2: if (typeof username === "string" && typeof setup === "function") return this.usergroups(username,{},setup);
                  if (typeof username === "object" && typeof setup === "function") return this.usergroups("",username,setup);
      }
      
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      if (!username) throw "Error 'usergroups': you have to set an username.";
      
      username=username.toLowerCase();
      setup.url=setup.url.toLowerCase();
      // check the cache
      // [ {user:"username", url:"url", data:"the groups"}, ... ]
      var cache=jQuery('body').data("sp-usergroups") || [];
      for (var i=cache.length; i--;) {
        if (cache[i].user.toLowerCase() == username && cache[i].url.toLowerCase() == setup.url) {
          fct.call(this,cache[i].data);
          return this
        }
      }

      // build the request
      var body = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"
               + "<soap:Body><GetGroupCollectionFromUser xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/'>"
               + "<userLoginName>"+username+"</userLoginName>"
               + "</GetGroupCollectionFromUser></soap:Body></soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = setup.url + "/_vti_bin/usergroup.asmx";
      jQuery.ajax({type:"POST",
                   cache:false,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/directory/GetGroupCollectionFromUser'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var aResult=[];
                     // get the details
                     data=data.getElementsByTagName('Group');
                     for (var i=0,len=data.length; i<len; i++)
                       aResult.push(data[i].getAttribute("Name"));
                     // cache the result
                     cache.push({user:username,url:setup.url,data:aResult});
                     jQuery('body').data('sp-usergroups',cache);
                     fct.call(_this,aResult);
                   },
                   error:function(req, textStatus, errorThrown) {
                     if (setup.error===false) fct.call(_this,[]);
                     else {
                       // any error ?
                       var error=req.responseXML.getElementsByTagName("errorstring");
                       if (console) console.error("Error 'usergroups': "+error[0].firstChild.nodeValue);
                      }
                   }
                 });
      return this;
    },
    /**
      @name $SP().list.getWorkflowID
      @function
      @description Find the WorkflowID for a workflow
      
      @param {Object} setup
        @param {Number} setup.ID The item ID that is tied to the workflow
        @param {String} setup.workflowName The name of the workflow
        @param {Function} setup.after The callback function that is called after the request is done (the parameter is {workflowID:"the workflowID", fileRef:"the fileRef"})
      
      @example
      $SP().list("List Name").getWorkflowID({ID:15, workflowName:"Workflow for List Name (manual)", after:function(params) {
        alert("Workflow ID:"+params.workflowID+" and the FileRef is: "+params.fileRef);
      }});
     */
    getWorkflowID:function(setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'getWorkflowID': you have to define the list ID/Name";
      if (this.url == undefined) throw "Error 'getWorkflowID': not able to find the URL!"; // we cannot determine the url
      setup = setup || {};
      if (setup.ID==undefined || setup.workflowName==undefined || setup.after==undefined) throw "Error 'getWorkflowID': all parameters are mandatory";

      // find the fileRef
      this.get({fields:"FieldRef",where:"ID = "+setup.ID}, function(d) {
              if (d.length===0) throw "Error 'getWorkflowID': I'm not able to find the item ID "+setup.ID;

              var fileRef = this.cleanResult(d[0].getAttribute("FileRef"));
              var c=fileRef.substring(0,fileRef.indexOf("/Lists"))
              var d=this.url.substring(0,this.url.indexOf(c));
              fileRef = d+fileRef;
              var body = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
               + '<soap:Body><GetWorkflowDataForItem xmlns="http://schemas.microsoft.com/sharepoint/soap/workflow/">'
               + '<item>'+fileRef+'</item>'
               + '</GetWorkflowDataForItem></soap:Body></soap:Envelope>';
              var _this=this;
              jQuery.ajax({
                type: "POST",
                cache: false,
                async: true,
                url: this.url+"/_vti_bin/Workflow.asmx",
                data: body,
                beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/workflow/GetWorkflowDataForItem'); },
                contentType: "text/xml; charset=utf-8",
                dataType: "xml",
                success:function(data) {
                  // we want to use myElem to change the getAttribute function
                  var rows=data.getElementsByTagName('WorkflowTemplate');
                  if (rows.length===0) throw "Error 'getWorkflowID': No workflow found for this item";
                  for (var i=rows.length; i--;) {
                    if (rows[i].getAttribute("Name") == setup.workflowName) {
                      setup.after.call(_this, {"fileRef":fileRef, "workflowID":"{"+rows[i].getElementsByTagName('WorkflowTemplateIdSet')[0].getAttribute("TemplateId")+"}"});
                      return _this
                    }
                  }
                  setup.after.call(_this, "Error 'getWorkflowID': impossible to find this workflow name!");
                },
                error:function(jqXHR, textStatus, errorThrown) {
                  throw "Error 'getWorkflowID': Something went wrong with the request over the Workflow Web Service..."
                }
              });
      })
      return this;
    },
    /**
      @name $SP().list.startWorkflow
      @function
      @description Manually start a work (that has been set to be manually started) (-untested with Sharepoint 2007-)
      
      @param {Object} setup
        @param {Number} setup.ID The item ID that tied to the workflow
        @param {String} setup.workflowName The name of the workflow
        @param {Array|Object} [setup.parameters] An array of object with {name:"Name of the parameter", value:"Value of the parameter"}
        @param {Function} [setup.after] This callback function that is called after the request is done
        @param {String} [setup.fileRef] Optional: you can provide the fileRef to avoid calling the $SP().list().getWorkflowID()
        @param {String} [setup.workflowID] Optional: you can provide the workflowID to avoid calling the $SP().list().getWorkflowID()
      
      @example
      $SP().list("List Name").startWorkflow({ID:15, workflowName:"Workflow for List Name (manual)", parameters:{name:"Message",value:"Welcome here!"}, after:function() {
        alert("Workflow done!");
      }});
    **/
    startWorkflow:function(setup) {
      // check if we need to queue it
      if (this.needQueue) { return this._addInQueue(arguments) }
      if (this.listID == undefined) throw "Error 'startWorkflow': you have to define the list ID/Name";
      if (this.url == undefined) throw "Error 'startWorkflow': not able to find the URL!";
      
      setup = setup || {};
      setup.after = setup.after || (function() {});
      if (!setup.workflowName && !setup.workflowID) throw "Error 'startWorkflow': Please provide the workflow name!"
      if (!setup.ID) throw "Error 'startWorkflow': Please provide the item ID!"

      // find the FileRef and templateID
      if (!setup.fileRef && !setup.workflowID) {
        this.getWorkflowID({ID:setup.ID,workflowName:setup.workflowName,
          after:function(params) {
            setup.fileRef=params.fileRef;
            setup.workflowID=params.workflowID;
            this.startWorkflow(setup)
          }
        })
      } else {
        // define the parameters if any
        var workflowParameters = "<root />";
        if (setup.parameters) {
          var p;
          if (setup.parameters.length == undefined) setup.parameters = [ setup.parameters ];
          p = setup.parameters.slice(0);
          workflowParameters = "<Data>";
          for (var i=0; i<p.length; i++)
          workflowParameters += "<"+p[i].name+">"+p[i].value+"</"+p[i].name+">";
          workflowParameters += "</Data>";
        }

        var body = "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                   + "<soap:Body><StartWorkflow xmlns=\"http://schemas.microsoft.com/sharepoint/soap/workflow/\">"
                   + "<item>"+setup.fileRef+"</item>"
                   + "<templateId>"+setup.workflowID+"</templateId>"
                   + "<workflowParameters>"+workflowParameters+"</workflowParameters></StartWorkflow>"
                   + "</soap:Body></soap:Envelope>";
        // do the request
        var _this=this;
        var url = this.url + "/_vti_bin/Workflow.asmx";
        jQuery.ajax({
          type: "POST",
          cache: false,
          async: true,
          url: url,
          data: body,
          beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/workflow/StartWorkflow'); },
          contentType: "text/xml; charset=utf-8",
          dataType: "xml",
          success:function(data) {
            setup.after.call(_this)
          },
          error:function(jqXHR, textStatus, errorThrown) {
            setup.after.call(_this)
          }
        });
      }
      return this;
    },
    /**
      @name $SP().distributionLists
      @function
      @description Find the distribution lists where the specified user is member of
      
      @param {String} username The username with or without the domain (don't forget to use a double \ like "mydomain\\john_doe")
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result
      
      @example
      $SP().distributionLists("mydomain\\john_doe",{url:"http://my.si.te/subdir/"}, function(mailing) {
        for (var i=0; i &lt; mailing.length; i++) console.log(mailing[i]); // -> {SourceReference: "cn=listname,ou=distribution lists,ou=rainbow,dc=com", DisplayName:"listname", MailNickname:"List Name", Url:"mailto:listname@rainbow.com"}
      });
    */
    distributionLists:function(username, setup, fct) {
      switch (arguments.length) {
          case 1: if (typeof username === "object") return this.distributionLists("",username,function(){});
                  else if (typeof username === "function") return this.distributionLists("",{},username);
                  break;
          case 2: if (typeof username === "string" && typeof setup === "function") return this.distributionLists(username,{},setup);
                  if (typeof username === "object" && typeof setup === "function") return this.distributionLists("",username,setup);
      }
      
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      if (!username) throw "Error 'distributionLists': you have to set an username.";
      
      username = username.toLowerCase();
      setup.url=setup.url.toLowerCase();
      // check the cache
      // [ {user:"username", url:"url", data:"the distribution lists"}, ... ]
      var cache=jQuery('body').data("sp-distributionLists") || [];
      for (var i=cache.length; i--;) {
        if (cache[i].user === username && cache[i].url === setup.url) {
          fct.call(this,cache[i].data);
          return this
        }
      }

      // build the request
      var body = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"
      + "<soap:Body><GetCommonMemberships xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService'>"
      + "<accountName>"+username+"</accountName></GetCommonMemberships></soap:Body></soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = setup.url + "/_vti_bin/UserProfileService.asmx";
      jQuery.ajax({type:"POST",
                   cache:false,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/GetUserMemberships') },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var aResult=[];
                     // get the details
                     data=data.getElementsByTagName('MembershipData');
                     for (var i=0,len=data.length; i<len; i++) {
                       if (data[i].getElementsByTagName("Source")[0].firstChild.nodeValue === "DistributionList")
                         aResult.push({"SourceReference": data[i].getElementsByTagName("SourceReference")[0].firstChild.nodeValue, "DisplayName":data[i].getElementsByTagName("DisplayName")[0].firstChild.nodeValue, "MailNickname":data[i].getElementsByTagName("MailNickname")[0].firstChild.nodeValue, "Url":data[i].getElementsByTagName("Url")[0].firstChild.nodeValue});
                     }
                     // cache the result
                     cache.push({user:username,url:setup.url,data:aResult});
                     jQuery('body').data("sp-distributionLists",cache);
                     fct.call(_this,aResult);
                   },
                   error:function(req, textStatus, errorThrown) {
                     //fct.call(_this,[]);
                     // any error ?
                     var error=req.responseXML.getElementsByTagName("errorstring");
                     if (console) console.error("Error 'distributionLists': "+error[0].firstChild.nodeValue);
                   }
                 });
      return this;
    },
    /**
      @name $SP().groupMembers
      @function
      @description Find the members of a Sharepoint group
      
      @param {String} groupname Name of the group
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
        @param {Boolean} [setup.error=true] The function will stop and throw an error when something went wrong (use FALSE to don't throw an error)
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result
      
      @example
      $SP().groupMembers("my group", function(members) {
        for (var i=0; i &lt; members.length; i++) console.log(members[i]); // -> {ID:"1234", Name:"Doe, John", LoginName:"mydomain\john_doe", Email:"john_doe@rainbow.com"}
      });
    */
    groupMembers:function(groupname, setup, fct) {
      switch (arguments.length) {
          case 1: if (typeof groupname === "object") return this.groupMembers("",groupname,function(){});
                  else if (typeof groupname === "function") return this.groupMembers("",{},groupname);
                  break;
          case 2: if (typeof groupname === "string" && typeof setup === "function") return this.groupMembers(groupname,{},setup);
                  if (typeof groupname === "object" && typeof setup === "function") return this.groupMembers("",groupname,setup);
      }
      
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      if (!groupname) throw "Error 'groupMembers': you have to set an groupname.";
      
      groupname=groupname.toLowerCase();
      setup.url=setup.url.toLowerCase();
      // check the cache
      // [ {user:"username", url:"url", data:"the distribution lists"}, ... ]
      var cache=jQuery('body').data("sp-groupMembers") || [];
      for (var i=cache.length; i--;) {
        if (cache[i].group === groupname && cache[i].url === setup.url) {
          fct.call(this,cache[i].data);
          return this
        }
      }

      // build the request
      var body = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"
      + "<soap:Body><GetUserCollectionFromGroup xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/'>"
      + "<groupName>"+this._cleanString(groupname)+"</groupName></GetUserCollectionFromGroup></soap:Body></soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = setup.url + "/_vti_bin/usergroup.asmx";
      jQuery.ajax({type:"POST",
                   cache:false,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/directory/GetUserCollectionFromGroup') },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var aResult=[];
                     // get the details
                     data=data.getElementsByTagName('User');
                     for (var i=0,len=data.length; i<len; i++)
                       aResult.push({"ID": data[i].getAttribute("ID"), "Name":data[i].getAttribute("Name"), "LoginName":data[i].getAttribute("LoginName"), "Email":data[i].getAttribute("Email")});
                     // cache the result
                     cache.push({group:groupname,url:setup.url,data:aResult});
                     jQuery('body').data("sp-groupMembers",cache);
                     fct.call(_this,aResult);
                   },
                   error:function(req, textStatus, errorThrown) {
                     if (setup.error===false) fct.call(_this,[]);
                     else {
                       // any error ?
                       var error=req.responseXML.getElementsByTagName("errorstring");
                       if (console) console.error("Error 'groupMembers': "+error[0].firstChild.nodeValue);
                      }
                   }
               });
      return this;
    },
    /**
      @name $SP().isMember
      @function
      @description Find if the user is member of the Sharepoint group
      
      @param {Object} [setup] Options (see below)
        @param {String} setup.user Name of the user with (don't forget to use a double \ in the username)
        @param {String} setup.group Name of the group
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] Return TRUE if the user is a member of the group, FALSE if not.
      
      @example
      $SP().isMember({user:"mydomain\\john_doe",group:"my group",url:"http://my.site.com/"}, function(isMember) {
        if (isMember) alert("OK !")
      });
    */
    isMember:function(setup, fct) {
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      if (!setup.user) throw "Error 'isMember': you have to set an user.";
      if (!setup.group) throw "Error 'isMember': you have to set a group.";
      
      setup.group = setup.group.toLowerCase();
      // first check with usergroups()
      this.usergroups(setup.user,{error:false},function(groups) {
        for (var i=groups.length; i--;) {
          if (groups[i].toLowerCase() === setup.group) { fct.call(this,true); return this }
        }
        // if we're jhere then it means we need to keep investigating
        // look at the members of the group
        this.groupMembers(setup.group,{error:false},function(m) {
          var members=[];
          for (var i=m.length; i--;) members.push(m[i].Name.toLowerCase())
          // and search if our user is part of the members (like a distribution list)
          this.distributionLists(setup.user, function(distrib) {
            for (var i=distrib.length; i--;) {
              if (members.indexOf(distrib[i].DisplayName.toLowerCase()) > -1) { fct.call(this,true); return this }
            }

            // if we are herit means we found nothing
            fct.call(this,false);
            return this
          });
        });
      })

      return this;
    },
    /**
      @name $SP().people
      @function
      @description Find the user details like manager, email, colleagues, ...
      
      @param {String} [username] With or without the domain, and you can also use an email address, and if you leave it empty it's the current user by default (if you use the domain, don't forget to use a double \ like "mydomain\\john_doe")
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result, or a String with the error message
      
      @example
      $SP().people("john_doe",{url:"http://my.si.te/subdir/"}, function(people) {
        if (typeof people === "string") {
          alert(people); // there was a problem so we prompt it
        } else
          for (var i=0; i &lt; people.length; i++) console.log(people[i]+" = "+people[people[i]]);
      });
    */
    people:function(username, setup, fct) {
      switch (arguments.length) {
          case 1: if (typeof username === "object") return this.people("",username,function(){});
                  else if (typeof username === "function") return this.people("",{},username);
                  username=undefined;
                  break;
          case 2: if (typeof username === "string" && typeof setup === "function") return this.people(username,{},setup);
                  if (typeof username === "object" && typeof setup === "function") return this.people("",username,setup);
      }
      
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      fct           = fct || (function() {});
      username      = username || "";
      
      // build the request
      var body = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"
               + "<soap:Body><GetUserProfileByName xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService'>"
               + "<AccountName>"+username+"</AccountName>"
               + "</GetUserProfileByName></soap:Body></soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = setup.url + "/_vti_bin/UserProfileService.asmx";
      jQuery.ajax({type:"POST",
                   cache:false,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/GetUserProfileByName'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var aResult=[];
                     // get the details
                     data=data.getElementsByTagName('PropertyData');
                     for (var i=0,len=data.length; i<len; i++) {     
                       var name=data[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
                       var value=data[i].getElementsByTagName("Value");
                       if (value&&value.length>=1) value=value[0].firstChild.nodeValue;
                       else value="No Value";
                       aResult.push(name);
                       aResult[name]=value;
                     }
                     fct.call(_this,aResult);
                   },
                   error:function(req, textStatus, errorThrown) {
                     // any error ?
                     var error=req.responseXML.getElementsByTagName("faultstring");
                     fct.call(_this,"Error 'people': "+error[0].firstChild.nodeValue);
                   }
                 });
      return this;
    },
    /**
      @name $SP().whoami
      @function
      @description Find the current user details like manager, email, colleagues, ...
      
      @param {Object} [setup] Options (see below)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result
      
      @example
      $SP().whoami({url:"http://my.si.te/subdir/"}, function(people) {
        for (var i=0; i &lt; people.length; i++) console.log(people[i]+" = "+people[people[i]]);
      });
    */
    whoami:function(setup, fct) {
      if (typeof setup === "function") { fct=setup; setup = {} }
      return this.people("",setup,fct);
    },
    /**
      @name $SP().addressbook
      @function
      @description Find an user based on a part of his name
      
      @param {String} word A part of the name from the guy you're looking for
      @param {Object} [setup] Options (see below)
        @param {String} [setup.limit=10] Number of results returned
        @param {String} [setup.type='User'] Possible values are: 'All', 'DistributionList', 'SecurityGroup', 'SharePointGroup', 'User', and 'None' (see http://msdn.microsoft.com/en-us/library/people.spprincipaltype.aspx)
        @param {String} [setup.url='current website'] The website url
      @param {Function} [result] A function that will be executed at the end of the request with a param that is an array with the result (typically: AccountName,UserInfoID,DisplayName,Email,Departement,Title,PrincipalType)
      
      @example
      $SP().addressbook("john", {limit:25}, function(people) {
        for (var i=0; i &lt; people.length; i++) {
          for (var j=0; j &lt; people[i].length; j++) console.log(people[i][j]+" = "+people[i][people[i][j]]);
        }
      });
    */
    addressbook:function(username, setup, fct) {
      switch (arguments.length) {
          case 1: if (typeof username === "object") return this.addressbook("",username,function(){});
                  else if (typeof username === "function") return this.addressbook("",{},username);
                  username=undefined;
                  break;
          case 2: if (typeof username === "string" && typeof setup === "function") return this.addressbook(username,{},setup);
                  if (typeof username === "object" && typeof setup === "function") return this.addressbook("",username,setup);
      }
      
      // default values
      setup         = setup || {};
      if (setup.url == undefined) {
        if (!this.url) { this._getURL(); return this._addInQueue(arguments) }
        else setup.url=this.url;
      } else this.url=setup.url;
      setup.limit   = setup.limit || 10;
      setup.type    = setup.type || "User";
      fct           = fct || (function() {});
      username      = username || "";
      
      // build the request
      var body = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"
               + "<soap:Body><SearchPrincipals xmlns='http://schemas.microsoft.com/sharepoint/soap/'>"
               + "<searchText>"+username+"</searchText><maxResults>"+setup.limit+"</maxResults><principalType>"+setup.type+"</principalType></SearchPrincipals></soap:Body></soap:Envelope>";
               
      // send the request
      var _this=this;
      var url = setup.url + "/_vti_bin/People.asmx";
      jQuery.ajax({type: "POST",
                   cache:false,
                   url:url,
                   data:body,
                   beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/SearchPrincipals'); },
                   contentType: "text/xml; charset=utf-8",
                   dataType: "xml",
                   success:function(data) {
                     var aResult=[];
                     // get the details
                     data=data.getElementsByTagName('PrincipalInfo');
                     for (var i=0,lenR=data.length; i<lenR; i++) {
                       var children=data[i].childNodes;
                       aResult[i]=[];
                       for (var j=0,lenC=children.length; j<lenC; j++) {
                         var name=children[j].nodeName;
                         var value=children[j].firstChild;
                         if (value) value=value.nodeValue;
                         aResult[i].push(name);
                         aResult[i][name]=value;
                       }
                     }
                     fct.call(_this,aResult);
                   }
                 });
      return this;
    },
    reset:function() {
      this.data   = [];
      this.length = 0;
      this.listID = "";
      this.needQueue=false;
      this.listQueue=[];
      delete this.url;
    },
    /**
      @name $SP().toDate
      @function
      @description Change a Sharepoint date (as a string) to a Date Object
      @param {String} textDate the Sharepoint date string
      @return {Date} the equivalent Date object for the Sharepoint date string passed
      @example $SP().toDate("2012-10-31T00:00:00").getFullYear(); // 2012
    */
    toDate:function(strDate) {
      // 2008-10-31(T)00:00:00(z)
      if (strDate instanceof Date) return strDate
      if (strDate.length!=19 && strDate.length!=20) throw "toDate: '"+strDate+"' is invalid."
      var year  = strDate.substring(0,4);
      var month = strDate.substring(5,7);
      var day   = strDate.substring(8,10);
      var hour  = strDate.substring(11,13);
      var min   = strDate.substring(14,16);
      var sec   = strDate.substring(17,19);
      // check if we have "Z" for UTC date
      return (strDate.indexOf("Z") > -1 ? new Date(Date.UTC(year,month-1,day,hour,min,sec)) : new Date(year,month-1,day,hour,min,sec));
    },
    /**
      @name $SP().toSPDate
      @function
      @description Change a Date object into a Sharepoint date string
      @param {Date} [dateObject] the Sharepoint date string
      @return {String} the equivalent string for the Date object passed
      @example $SP().toSPDate(new Date("31/Oct/2012")); // --> "2012-10-31 00:00:00"
    */
    toSPDate:function(oDate) {
      var pad = function(p_str){
        if(p_str.toString().length==1){p_str = '0' + p_str;}
        return p_str;
      };
      var month   = pad(oDate.getMonth()+1);
      var day     = pad(oDate.getDate());
      var year    = oDate.getFullYear();
      var hours   = pad(oDate.getHours());
      var minutes = pad(oDate.getMinutes());
      var seconds = pad(oDate.getSeconds());
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    /**
      @name $SP().toCurrency
      @function
      @description It will return a number with commas, currency sign and a specific number of decimals
      @param {Number|String} number The number to format
      @param {Number} [decimal=-1] The number of decimals (use -1 if you want to have 2 decimals when there are decimals, or no decimals if it's .00
      @param {String} [sign='$'] The currency sign to add
      
      @return {String} The converted number
      @example 
      
      $SP().toCurrency(1500000); // --> $1,500,000
      $SP().toCurrency(1500000,2,''); // --> 1,500,000.00 
     */
    toCurrency:function(n,dec,sign) {
      n=Number(n);
      if (dec === undefined) dec=-1;
      if (sign === undefined) sign='$';
      var m="";
      if (n<0) { m="-"; n*=-1; }
      var s = n;
      if (dec===-1) s = s.toFixed(2).replace('.00', '');
      else s = s.toFixed(dec);
      var digits = (Math.floor(n) + '').length;
      for (var i=0, j=0, mod=digits%3; i<digits; i++) {
        if (i==0 || i%3!=mod) continue;
        s = s.substr(0, i+j) + ',' + s.substr(i+j);
        j++;
      }
      return (sign!=''?sign:'')+m+s+(sign!=''?'':' '+sign);
    },
    /**
      @name $SP().getLookup
      @function
      @description Split the ID and Value
      @param {String} text The string to retrieve data
      @return {Object} .id returns the ID, and .value returns the value
      @example $SP().getLookup("328;#Foo"); // --> {id:328, value:"Foo"}
    */
    getLookup:function(str) { if (!str) { return {id:"", value:""} } var a=str.split(";#"); return {id:a[0], value:a[1]}; },
    /**
      @name $SP().toXSLString
      @function
      @description Change a string into a XSL format string
      @param {String} text The string to change
      @return {String} the XSL version of the string passed
      @example $SP().toXSLString("Big Title"); // --> "Big_x0020_Title"
    */
    toXSLString:function(str) {
      if (typeof str !== "string") throw "Error 'toXLSString': '"+str+"' is not a string....";
      // if the first car is a number, then FullEscape it
      var FullEscape = function(strg, exceptNumeric) {
          exceptNumeric = exceptNumeric || false;
          var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
          var rstr = "";
          for (var i=0; i < strg.length; i++) {
            var c = strg.charAt(i);
            var num = c.charCodeAt(0);
            var temp = 0;
            var hexString = "";
            while (num >= 16) {
              temp = num % 16;
              num = Math.floor(num / 16);
              hexString += hexVals[temp];
            }
            hexString += hexVals[num];
            var tmpStr = "";
            for (var k=hexString.length-1; k >= 0; k--) tmpStr += hexString.charAt(k);
            rstr += "%" + tmpStr;
          }
          return rstr;
      };
      var aSpaces = str.split(" ");
      var ret = "";
      // check if there is a number and work length is smaller than 5 letters
      if (/^[0-9]/.test(aSpaces[0]) && aSpaces[0].length < 5) {
        // change the first letter
        ret = FullEscape(str.charAt(0));
        str = str.substring(1);
      }
      for (var i=0; i < str.length; i++) {
        var c = str.charAt(i);
        if (/[0-9A-Za-z_]/.test(c) === false) ret += FullEscape(c).toLowerCase();
        else ret += c;
      }
      return ret.replace(/%([a-zA-Z0-9][a-zA-Z0-9])/g,"_x00$1_").substring(0,32);
    },
    /**
      @name $SP().formfields
      @namespace
      @description Retrieve the fields info in the NewForm and in the EditForm
      @return {Array} An array of hash with several keys: name, values, elements, type, and tr
      
      @param {String|Array} [fields=""] A list of fields to get (e.g. "field1,other field,field2" or ["field1","other field","field2"]) and by default we take all fields ... ATTENTION if you have a field with "," then use only the Array as a parameter
      @param {Object} [setup] Options (see below)
        @param {Boolean} [setup.mandatory=undefined] Set it to 'true' to look for the mandatory fields (the "false" value has no effect) 
      
      @note You can use a data attribute called "sp-ignore" on any element in your form and the script will ignore it (useful when you add a custom field inside another one).

      @example
      $SP().formfields(); // return all the fields
      
      $SP().formfields({mandatory:true}).each(function() { // return all the mandatory fields
        var field = this;
        if (field.val().length==0) console.log(field.name()+" is empty!");
      });
      $SP().formfields("Title,Contact Name,Email").each(function() { // return these three fields
        var field = this;
        console.log(field.name()+" has these values: "+field.val());
      });
      // if you have a field with a comma use an Array
      $SP().formfields(["Title","Long field, isn't it?","Contact Name","Email"]).each(function() {
        var field = this;
        console.log(field.name()+" has the description: "+field.description());
      });
      // returns the fields "Title" and "New & York", and also the mandatory fields
      $SP().formfields(["Title", "New & York"],{mandatory:true});
    */
    formfields:function(fields, settings) {
      'use strict';
      this.reset();  
      if (arguments.length == 1 && typeof fields === "object" && typeof fields.length === "undefined") { settings=fields; fields=undefined; }

      // default values
      settings = settings || {};
      fields   = fields   || [];
      settings.cache = (settings.cache === false ? false : true);
      
      var aReturn = [], bigLimit=10000;
      if (typeof fields === "string") fields=( fields==="" ? [] : fields.split(",") );
      var limit = (fields.length>0 ? fields.length : bigLimit);
      if (limit === bigLimit && !settings.mandatory) settings.includeAll=true; // if we want all of them

      // find all the fields, then cache them if not done already
      if (_SP_CACHE_FORMFIELDS !== null) {
        var allFields = _SP_CACHE_FORMFIELDS.slice(0);
        if (settings.includeAll) {
          this.length=allFields.length;
          this.data=allFields;
          return this;
        }
        var done=0,i,len=allFields.length,idx;
        // retrieve the field names
        var fieldNames=[];
        for (i=0;i<len;i++) fieldNames.push(allFields[i]._name)
        // search for the fields defined
        for (i=0; i<limit; i++) {
          idx=fieldNames.indexOf(fields[i]);
          if (idx > -1) aReturn.push(allFields[idx])
        }
        for (i=0,len=(settings.mandatory?allFields.length:0); i<len; i++) {
          if (allFields[i]._isMandatory && fields.indexOf(allFields[i]._name) === -1) aReturn.push(allFields[i])
        }
        this.length=aReturn.length;
        this.data=aReturn;
        return this;
      }

      // if cache allowed then we want to look at all the fields
      if (settings.cache) settings.includeAll=true;

      // check if document.querySelector is supported
      var selectorSupported = (typeof document.querySelector !== "undefined");

      // find our TABLE where all the fields are
      var table=null;
      if (!selectorSupported) {
        for (var a=document.getElementsByTagName('table'), i=0, len=a.length; i<len; i++) 
          if (a[i].className.indexOf("ms-formtable") > -1) { table = a[i]; break; } // we found our table!
      } else
        table=document.querySelector('table.ms-formtable')
      if (!table) throw "Error: unable to find the table.ms-formtable!";

      // this function will help to find the closest TR element instead of using jQuery.closest('tr')
      var closestTR = function(nobr) {
        var tr = nobr;
        do { tr=tr.parentNode } while(tr.tagName.toLowerCase() !== "tr");
        return tr;
      };

      // from jQuery
      // Retrieve the text of an HTML element
      var getText = function(elem) {
        var i, node, nodeType = elem.nodeType, ret = "";
        if (nodeType) {
          if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            // Use textContent || innerText for elements
            if (typeof elem.textContent === 'string') return elem.textContent;
            else if (typeof elem.innerText === 'string') {
              // Replace IE's carriage returns
              return elem.innerText.replace(/\r/g, '');
            } else {
              // Traverse its children
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
            }
          } else if (nodeType === 3 || nodeType === 4) return elem.nodeValue;
        } else {
          // If no nodeType, this is expected to be an array
          for (i = 0; (node = elem[i]); i++) {
            // Do not traverse comment nodes
            if (node.nodeType !== 8) ret += getText(node);
          }
        }
        return ret;
      }

      if (settings.includeAll) limit=bigLimit;
      // we now find the names of all fields
      for (var a=table.getElementsByTagName('nobr'), i=-1, len=a.length, done=0; i<len && done<limit; i++) { // we start at -1 because of Content Type
        var nobr, tr, isMandatory=false, html /* HTML content of the NOBR tag */, txt /* Text content of the NOBR tag */, includeThisField=false;
        var search; // if we have to search for a value
        
        if (settings.includeAll) includeThisField=true;

        if (i === -1) { // handle the content type
          if (includeThisField || fields.indexOf('Content Type') > -1) {
            txt=html="Content Type";
            includeThisField=true;
          }
        } else {
          tr = undefined;
          nobr = a[i];
          html = nobr.innerHTML;
          txt  = getText(nobr); // use this one for the &amp; and others
          
          // clean the txt
          if (html.indexOf("ms-formvalidation") > -1) { // this is a mandatory field
            // remove the <span> with the *
            html = html.slice(0,-39);
            if (html.charAt(html.length-2)=='<' && (html.charAt(html.length-1)=='s'||html.charAt(html.length-1)=='S')) html=html.slice(0,-2); // with IE we don't have "" around the class name
            // do we want the mandatory fields ?
            if (settings.mandatory) includeThisField=true
            txt = txt.slice(0,-2); // it's a mandatory field so we want to remove the extra * at the end
            isMandatory=true;
          }

          if (limit !== bigLimit) {
            for (var k=0, lenk=limit; k<lenk; k++) {
              if (fields[k].trim() === txt) { includeThisField=true; done++; break; }
            }
          }
        }

        // the field must be included
        if (includeThisField) {
          var fieldName = txt;
          var obj       = {
            _name: fieldName,
            _isMandatory: isMandatory,
            _description: "", /* the field's description */
            _elements: null, /* the HTML elements related to that field */
            _tr: null, /* the TR parent node */
            _type: null /* the type of this field: checkbox, boolean */
          };
          
          if (fieldName === "Content Type") { // the Content Type field is different !
            if (selectorSupported) obj._elements = document.querySelector('.ms-formbody select[title="Content Type"]');
            else {
              for (var a=document.getElementsByTagName('td'),aa=0; aa<a.length; aa++) {
                if (a[aa].className.indexOf("ms-formbody") > -1) {
                  for (var b=document.getElementsByTagName("select"),bb=0; bb<b.length; bb++) {
                    if (b[bb].title === "Content Type") {
                      aa=a.length;
                      obj._elements = b[bb];
                      break;
                    }
                  }
                }
              }
            }
            obj._type = "content type";
            if (obj._elements) obj._tr = closestTR(obj._elements);
            else continue;
          } else {
            obj._tr = (tr===undefined ? closestTR(nobr) : tr);
          }

          obj.val    = function() {};
          obj.elem   = function() { return this._elements };
          obj.description = function() { return this._description }
          obj.type = function() { return this._type }; // this function returns the type of the field 
          obj.row  = function() { return this._tr }; // this function returns the TR parent node 
          obj.name = function() { return this._name };
          obj.isMandatory = function() { return this._isMandatory };
          obj.options = function() {};
          
          // find the HTML elements and other information for that field
          tr = (obj._tr.length ? obj._tr[0] : obj._tr);
          var td = tr.getElementsByTagName("td")[1].getElementsByTagName("span")[0];
          var elem = [];

          if (obj._name === "Attachments") {
            obj._type = "attachments";
            elem = td.getElementsByTagName('tr');
          } else if (obj._name === "Content Type") {
            elem = [ obj._elements ];
          } else {
            var input = td.getElementsByTagName("input");
            var continueToSearch=false; // use this to keep search for other kind of HTML elements
            for (var inp=0; inp<input.length; inp++) {
              if (input[inp].getAttribute("data-sp-ignore") !== "true") {
                var type=input[inp].getAttribute("type");
                switch (type) {
                  case "text":
                    // for the Single Text
                    if (input[inp].className.indexOf("ms-input") > -1 || input[inp].className.indexOf("ms-long") > -1) {
                      elem.push(input[inp]);
                      if (!obj._type) obj._type="text";
                      if (input[inp].id.search(/DateTimeFieldDate$/) > -1) {
                        continueToSearch=true; // if we find an INPUT that is a DateTime field
                        obj._type="date"
                      } else if (input[inp].id.search(/_UrlFieldUrl$|_UrlFieldDescription$/) > -1) {
                        obj._type="url";
                        // it's an url so find the previous label
                        elem.pop();
                        elem.push(input[inp].previousSibling.previousSibling);
                        elem.push(input[inp])
                      } else inp=input.length
                    } else if (input[inp].title.indexOf("Specify your own value:") > -1) {
                      elem.push(input[inp])
                      if (obj._type.slice(0,7) === "choices") obj._type += " plus"
                    }
                    break;
                  case "radio":
                    if (input[inp].id.search(/_DropDownButton$/) > -1) {
                      obj._type="choices plus";
                      do {
                        elem.push(input[inp]);
                        if (!inp) elem.push("") // we're going to store the SELECT here
                      } while (++inp<input.length)
                      // in that case we have a "Choice with own value"
                      // so keep the other input
                      continueToSearch=true;
                    } else {
                      elem.push(input[inp]);
                      elem.push(input[inp].nextSibling); // store also the label
                      obj._type="choices radio"
                    }
                    break
                  case "checkbox":
                    elem.push(input[inp]);
                    if (input[inp].id.search(/_BooleanField$/) > -1) obj._type="boolean"
                    else obj._type="choices checkbox"
                    // store the label if it exists
                    if (obj._type !== "boolean") elem.push(input[inp].nextSibling);
                    break;
                }
              }
            }
            if (elem.length === 0 || continueToSearch) {
              var select = td.getElementsByTagName("select");
              for (inp=0; inp<select.length; inp++) {
                if (select[inp].className.indexOf("ms-RadioText") > -1 || select[inp].id.search(/_cbRate$|_Lookup$|_SelectResult$|_SelectCandidate$|_DateTimeFieldDateHours$|_DateTimeFieldDateMinutes$/) > -1) {
                  if (select[inp].id.search(/_SelectCandidate$|_SelectResult$|_DateTimeFieldDateHours$|_DateTimeFieldDateMinutes$/) > -1) {
                    if (select[inp].id.indexOf("DateTimeField") > -1) obj._type="date time"
                    elem.push(select[inp]); // multiple lookup selection, or Hour and Minutes
                    if (select[inp].id.indexOf("_SelectCandidate") > -1) { // it's for the two lists with multiple choices with Add/Remove buttons
                      // find the both buttons
                      var buttons = td.getElementsByTagName('button');
                      if (buttons.length === 2) {
                        elem.push(buttons[0]);
                        elem.push(buttons[1]);
                        obj._type="lookup multiple"
                      }
                    }
                  }
                  else {
                    if (continueToSearch) {
                      if (obj._type==="choices plus") elem[1]=select[inp]
                      else elem.push(select[inp])
                    }
                    else {
                      elem.push(select[inp]);
                      if (select[inp].id.search(/_Lookup$/) > -1) obj._type="lookup"
                      else if (!obj._type) obj._type="choices"
                    }
                    break
                  }
                }
              }
            }
            if (elem.length === 0) {
              var other = td.getElementsByTagName("div");
              for (inp=0; inp<other.length; inp++) {
                if (other[inp].className.indexOf("ms-inputuserfield") > -1) {
                  elem.push(other[inp]);
                  obj._type="people"
                  break;
                }
              }
              other = td.getElementsByTagName("textarea");
              for (inp=0; inp<other.length; inp++) {
                if (other[inp].className.indexOf("ms-long") > -1 || other[inp].className.indexOf("ms-input") > -1) {
                  elem.push(other[inp]);
                  if (!obj._type) obj._type="text multiple";
                  else if (obj._type==="people") {
                    // find the a/img also
                    other = td.getElementsByTagName("a");
                    for (inp=0;inp<other.length;inp++) elem.push(other[inp])
                    break;
                  }
                  // is it a rich textarea ?
                  other = other[inp].nextSibling;
                  if (other && other.className && other.className.indexOf("ms-rtetoolbarmenu") > -1) {
                    // with IE it's not a normal TEXTAREA but a iframe...
                    elem=td.getElementsByTagName('iframe');
                  }
                  else { // for others
                    other = td.getElementsByTagName('span');
                    for (inp=other.length; inp--;) {
                      if (other[inp].className.indexOf("ms-formdescription") > -1) {
                        elem.push(other[inp]);
                        break;
                      }
                    }
                    break;
                  }
                }
              }
            }

            // find the description, if any
            if (td.nextSibling) {
              var descro=td.nextSibling;
              if (descro.nodeType==3) obj._description = getText(descro).trim()
            }
          }
          obj._elements=elem;

          // define the val()
          switch(obj.type()) {
            case "attachments": {
              obj.val = function(v) {
                if (v) alert("$SP.formfields Error: You cannot define a value for the Attachments")
                else {
                  var elem=this.elem();
                  var ret=[];
                  for (v=0; v<elem.length; v++) ret.push(getText(elem[v]).slice(0,-6).trim());
                  return ret
                }
              };
              break;
            }
            case "date":
            case "text":
            case "text multiple": {
              obj.val = function(v) {
                var e=this.elem();
                var type=this.type();
                if (e[0].tagName.toLowerCase()==="iframe") { // "text multiple" on IE
                  var ifrm = (e.length===1 ? e[0]: e[1]);
                  var doc=(ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document);
                  if (v) doc.getElementsByTagName('div')[0].innerHTML=v;
                  else return doc.getElementsByTagName('div')[0].innerHTML;
                } else {
                  if (v !== undefined) {
                    if (type==="text" || type==="date") e[0].value=v
                    else e[0].innerHTML=v
                  }
                  else return e[0].value
                }
                return this
              };
              break;
            }
            case "date time": {
              obj.val = function(v) {
                var ret=[];
                var e=this.elem();
                if (v !== undefined) {
                  // it should be an array with 3 items
                  if (typeof v === "string") v=[v];
                  e[0].value=v[0];
                  for (var h=1; h<3; h++) {
                    if (v[h]) {
                      var options = e[h].getElementsByTagName('option');
                      for (var i=options.length; i--;) {
                        if (options[i].value===v[h]) options[i].selected=true
                      }
                    }
                  }
                } else {
                  for (var i=0; i<e.length; i++) {
                    if (e[i].tagName.toLowerCase() === "input") ret.push(e[i].value)
                    else {
                      var options = e[i].getElementsByTagName('option');
                      for (var o=options.length; o--;) {
                        if (options[o].selected) {
                          ret.push(options[o].value);
                          break;
                        }
                      }
                    }
                  }
                  return ret
                }

                return this
              };
              break;
            }
            case "url": {
              obj.val = function(v) {
                if (v !== undefined) {
                  // if there is only one value, then we'll set the both field with this value
                  if (typeof v === "string") v=[v,v];
                  else if (v.length === 1) v=[v[0],v[0]];
                }
                var ret=[];
                var e=this.elem();
                for (var i=0,idx=0; i<e.length; i++) {
                  if (e[i].tagName.toLowerCase() === "input") {
                    if (v !== undefined) e[i].value=v[idx++]
                    else ret.push(e[i].value)
                  }
                }
                return (v!==undefined ? this : ret)
              };
              break;
            }
            case "boolean": {
              obj.val = function(v) {
                if (typeof v === "boolean") {
                  this.elem()[0].checked=v;
                  return this
                }
                else return this.elem()[0].checked
              };
              break;
            }
            case "people": {
              obj.val = function(v) {
                var e=this.elem();
                if (v !== undefined) {
                  e[0].innerHTML=v;
                  e[1].value=v;
                  return this
                } else {
                  /*v=e[0].innerHTML.replace(/&nbsp;|<br>/,"")
                  if (v.search(/<span/i) > -1) {
                    var ev=e[0].querySelectorAll('span > span');
                    if (ev.length>1) {
                      v=[];
                      var x;
                      for (var t=0; t<ev.length; t++) {
                        x=ev[t].innerHTML.replace(/&nbsp;|<br>/,"")
                        if (x !== "") v.push(x)
                      }
                      if (v.length===1) v=v[0]
                      else if (v.length===0) v=""
                    } else v=ev[0].innerHTML
                  }
                  // v=e[1].value.replace(/(<([^>]+)>)/ig,"").replace(/^\s+|\s+$|&#160;/g,"").replace(/;$/,"")
                  return (typeof v==="string" ? v.replace(/&nbsp;|<br>/,"") : v);*/
                  v=e[0].innerHTML.replace(/(<([^>]+)>)/ig,"").replace(/^\s+|\s+$|&#160;/g,"").replace(/<br>|&nbsp;/g,"").replace(/;$/,"").split(";")
                  var ret=[];
                  for (var x=0; x<v.length; x++) {
                    v[x]=v[x].trim()
                    if (v[x] !== "") ret.push(v[x])
                  }
                  if (ret.length===1) return ret[0]
                  if (ret.length===0) return ""
                  return ret
                }
              };
              break;
            }
            case "content type": {
              obj.val = function(v) {
                var e=this.elem();
                var options=e[0].getElementsByTagName('option');
                for (var i=0; i<options.length; i++) {
                  if (v == options[i].value || v == options[i].innerHTML) {
                    options[i].selected=true;
                    eval("!function() {"+e[0].getAttribute("onchange").replace(/javascript:/,"")+"}()")
                    return this
                  }
                  if (!v && options[i].selected) return options[i].innerHTML
                }
                return this
              };
              obj.options = function() {
                var ret=[];
                var e=this.elem();
                var options=e[0].getElementsByTagName('option');
                for (var i=0; i<options.length; i++) ret.push(options[i].value+";#"+options[i].innerHTML);
                return ret;
              };
              break;
            }            
            case "lookup":
            case "choices":
            case "choices plus": {
              obj.val = function(v) {
                var e=this.elem();
                var type=this.type();
                var options=(type.slice(-4) === "plus" ? e[1].getElementsByTagName('option') : e[0].getElementsByTagName('option'));
                for (var i=0; i<options.length; i++) {
                  if (v == options[i].value || v == options[i].innerHTML) {
                    options[i].selected=true;
                    if (type === "choices plus") e[0].checked=true
                    return this
                  }
                  if (v === undefined && options[i].selected) {
                    if ((type === "lookup" || type === "choices") || (type === "choices plus" && e[0].checked))
                      return options[i].innerHTML
                  }
                }
                if (type === "choices plus" && e.length===4) {
                  if (v !== undefined) {
                    // if we are here then it means we didn't find the value in the dropdown, so try the INPUT
                    e[2].checked=true;
                    e[3].value = v;
                  } else if (e[2].checked) return e[3].value;
                }
              };
              obj.options = function() {
                var ret=[];
                var e=this.elem();
                var type=this.type();
                var options=(type.slice(-4) === "plus" ? e[1].getElementsByTagName('option') : e[0].getElementsByTagName('option'));
                for (var i=0; i<options.length; i++) ret.push(options[i].value+(type==="lookup"?";#"+options[i].innerHTML:""));
                if (type === "choices plus" && e.length===4 && e[3].value != "") ret.push(e[3].value)
                return ret;
              };
              break;
            }
            case "lookup multiple": {
              obj.val = function(v) {
                var e=this.elem();
                var type=this.type();
                var options,i;
                if (typeof v === "string") v=[v];
                if (v !== undefined) {
                  var optValues=[], optText=[], idx;
                  // reset all
                  options=e[3].getElementsByTagName('option');
                  for (i=0; i<options.length; i++) options[i].selected = true
                  eval("!function() {"+e[2].getAttribute("onclick")+"}()");
                  // unselect everything
                  options=e[0].getElementsByTagName('option');
                  for (idx=0; idx<options.length; idx++) options[idx].selected=false
                  // select the options in the first list
                  // and make sure to select in the same order as provided
                  for (i=0; i<v.length; i++) {
                    for (idx=0; idx<options.length; idx++) {
                      if (options[idx].innerHTML == v[i] || options[idx].value == v[i]) {
                        options[idx].selected=true
                        eval("!function() {"+e[1].getAttribute("onclick")+"}()");
                        options=e[0].getElementsByTagName('option')
                        break;
                      }
                    }
                  }

                  return this;
                } else {
                  var ret=[];
                  options=e[3].getElementsByTagName('option');
                  for (i=0; i<options.length; i++) ret.push(options[i].innerHTML)
                  return ret;
                }
              };
              obj.options = function() {
                var ret=[];
                var e=this.elem();
                var options=e[0].getElementsByTagName('option');
                for (i=0; i<options.length; i++) ret.push(options[i].value+";#"+options[i].innerHTML)
                options=e[3].getElementsByTagName('option');
                for (i=0; i<options.length; i++) ret.push(options[i].value+";#"+options[i].innerHTML)
                return ret;
              };
              break;
            }
            case "choices radio":
            case "choices radio plus":
            case "choices checkbox":
            case "choices checkbox plus": {
              obj.val = function(v) {
                var e=this.elem();
                var type=this.type();
                var ret=[],done=[]; // 'done' is the values that have been checked
                if (typeof v === "string") v=[v];
                for (var i=0; i<e.length; i++) {
                  if (v !== undefined && e[i].tagName.toLowerCase() === "label" && v.indexOf(e[i].innerHTML) > -1) {
                    e[i-1].checked=true;
                    done.push(e[i].innerHTML);
                    if (type.slice(0,13) === "choices radio") return this
                  } else if (v !== undefined && e[i].tagName.toLowerCase() === "label") e[i-1].checked=false
                  else if (v === undefined && e[i].checked) {
                    if (type === "choices radio plus") {
                      if (e[i+1].innerHTML === "Specify your own value:") return e[i+2].value;
                      return e[i+1].innerHTML
                    } else
                      ret.push(e[i+1].innerHTML === "Specify your own value:" ? e[i+2].value : e[i+1].innerHTML)
                  }
                }
                if (v === undefined) return ret
                if (v !== undefined) {
                  if (type === "choices radio plus") {
                    // if we are here then it means we didn't find the value in the radio boxes, so try the INPUT
                    e[e.length-3].checked=true;
                    e[e.length-1].value = v;
                  } else if (type === "choices checkbox plus") {
                    // go thru 'done' to see if a value must go into the INPUT
                    var rest=[];
                    for (var i=v.length; i--;) {
                      if (done.indexOf(v[i]) === -1) rest.push(v[i])
                    }
                    if (rest.length>0) {
                      e[e.length-3].checked=true;
                      e[e.length-1].value = rest.join(" ");
                    }
                  }
                  return this;
                }
              };
              obj.options = function() {
                var e=this.elem();
                var ret=[];
                var type=this.type().slice(-4);
                for (var i=0; i<e.length; i++) {
                  if (e[i].tagName.toLowerCase() === "label") {
                    if (e[i].innerHTML === "Specify your own value:" && type === "plus") continue;
                    ret.push(e[i].innerHTML)
                  }
                  else if (type === "plus" && e[i].type === "text" && e[i].value != "") ret.push(e[i].value)
                }
                return ret
              };
              break;
            }

          }

          aReturn.push(obj);
        }
      }

      // cache the result
      if (settings.cache) {
        _SP_CACHE_FORMFIELDS = aReturn.slice(0);
        settings.includeAll=false;
        return this.formfields(fields, settings)
      } else {
        this.length=aReturn.length;
        this.data=aReturn;
        return this
      }
    },
    /**
      @name $SP().formfields.each
      @function
      @description Permits to go thru the different fields
      @example
      // To print in the console the names of all the fields
      $SP().formfields().each(function() {
        console.log(this.name()); // -> return the name of the field
        console.log(this.isMandatory()); // -> returns TRUE if it's a mandatory field
      })
    */
    each:function(fct) {
      for (var i=0,len=this.data.length; i<len; i++) fct.call(this.data[i])
      return this;
    },
    /**
      @name $SP().formfields.val
      @function
      @description Set or Get the value(s) for the field(s) selected by "formfields"
      @param {String|Array} [value=empty] If "str" is specified, then it means we want to set a value, if "str" is not specified then it means we want to get the value
      @param {Object} [identity=false] If set to TRUE then the return values will be a hashmap with "field name" => "field value"
      @return {String|Array|Object} Return the value of the field(s)
              
      @example
      $SP().formfields("Title").val(); // return "My project"
      $SP().formfields("Title").val("My other project");
      $SP().formfields("Title").val(); // return "My other project"

      // it will set "Choice 1" and "Choice 2" for the "Make your choice" field, and "2012/12/31" for the "Booking Date" field
      $SP().formfields("Make your choice,Booking Date").val([ ["Choice 1","Choice 2"], "2012/12/31" ]);

      // it will set "My Value" for all the fields
      $SP().formfields("Make your choice,Title,Other Field").val("My Value");

      // it will return an array; each item represents a field
      $SP().formfields("Make your choice,Title,Other Field").val(); // -> [ ["My Value"], "My Value", "Other Field" ]

      // for a Link field
      $SP().formfields("Link").val(["http://www.dell.com","Dell"]) // -> "Dell" is used as the description of the link, and "http://www.dell.com" as the Web address

      // it will return a hashmap
      $SP().formfields("Make your choice,Title,Other Field").val({identity:true}); // -> {"Make your choice":["My Value"], "Title":"My Value", "Other Field":"My Value"}
    */
    val:function(str) {
      if (typeof str==="object" && str.identity !== undefined) {
        identity=str.identity;
        str=undefined;
      } else identity=false
      // it means we want to get the value
      if (str === undefined) {
        var aReturn = [];
        this.each(function() {
          if (identity) aReturn[this.name()] = this.val()
          else aReturn.push(this.val())
        })
        return (aReturn.length===1 ? aReturn[0] : aReturn)
      } else if (typeof str !== "object") { // we want to set a simple value
        this.each(function() { this.val(str) });
      } else {
        var i=0;
        if (this.length>1) {
          if (str.length !== this.length) throw new Error("$SP.formfields.val: the array passed for val() must have the same size as the number of fields in formfields()")
          this.each(function() { this.val(str[i++]) })
        } else this.each(function() { this.val(str) })
      }
      
      return this;
    },
    /**
      @name $SP().formfields.elem
      @function
      @description Get the HTML element(s) tied with the field(s) selected by "formfields"

      @return {Array|HTMLElement|jQuery} Null is returned if nothing is found, or the found elements... if jQuery is defined then the HTML elements will be jQueryrize
                   
      @example
      $SP().formfields("Title").elem(); // -> returns a HTML INPUT TEXT
      $SP().formfields("List of options").elem(); / -> returns a HTML SELECT 
      
    */
    elem:function() {
      var aReturn = [];
      var hasJQuery=(typeof jQuery === "function");
      this.each(function() {
        var e = this.elem();
        aReturn.push(e.length === 1 ? e[0] : e)
      })
      
      switch(aReturn.length) {
        case 0: return hasJQuery ? jQuery() : null;
        case 1: return hasJQuery ? jQuery(aReturn[0]) : aReturn[0];
        default: return hasJQuery ? jQuery(aReturn) : aReturn;
      }
    },
    /**
      @name $SP().formfields.row
      @function
      @description Get the TR element(s) tied with the field(s) selected by "formfields"
      @return {Array|HTMLElement|jQuery} Null is returned if nothing is found, or the TR HTMLElement... or a jQuery object is returned if jQuery exists
                   
      @example
      $SP().formfields("Title").row(); // return the TR element that is the parent (= the row)
      $SP().formfields("Title").row().hide(); // because we have jQuery we can apply the hide()
    */
    row:function() {
      var aReturn = [];
      var hasJQuery=(typeof jQuery === "function");
      this.each(function() {
        aReturn.push(this.row())
      })

      switch(aReturn.length) {
        case 0: return null;
        case 1: return (hasJQuery ? jQuery(aReturn[0]) : aReturn[0]);
        default: return (hasJQuery ? jQuery(aReturn) : aReturn);
      }
    },
    /**
      @name $SP().formfields.type
      @function
      @description Get the type of the field(s) selected by "formfields"
                   Here is the list of different types returned:
                   - "text" for the free text field;
                   - "text multiple" for the textarea zone;
                   - "attachments" for the attachments field;
                   - "lookup" for a lookup field (dropdown);
                   - "lookup multiple" for a lookup field with multiple selection (two dropdowns with two buttons);
                   - "content type" for the content type field;
                   - "boolean" for the yes/no checkbox;
                   - "date" for a date only field;
                   - "date time" for a date and time field;
                   - "choices" for a dropdown selection;
                   - "choices plus" for a dropdown selection with an input field to enter our own value;
                   - "choices radio" for the radio buttons selection;
                   - "choices radio plus" for the radio buttons selection with an input field to enter our own value;
                   - "choices checkbox" for the checkboxes field for a selection;
                   - "choices checkbox plus" for the checkboxes field for a selection with an input field to enter our own value;
                   - "people" for the poeple picker field;
                   - "url" for the link/url/picture field.
                   
      @return {String|Array} Returns the type of the field(s)
                   
      @example
      $SP().formfields("Title").type(); // return "text"
      $SP().formfields("List of options").type(); // return "choices"
    */
    type:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.type()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      } 
    },
    /**
      @name $SP().formfields.description
      @function
      @description Get the description of the field(s) selected by "formfields"
                  
      @return {String|Array} Returns the description of the field(s)
                   
      @example
      $SP().formfields("Title").description(); // return "This is the description of this field"
      $SP().formfields("List of options").description(); // return "", it means no description
    */
    description:function() {
      var aReturn = [];
      this.each(function() { aReturn.push(this.description()) })

      switch(aReturn.length) {
        case 0: return "";
        case 1: return aReturn[0];
        default: return aReturn;
      } 
    },
    /**
      @name $SP().registerPlugin
      @function
      @description Permits to register a plugin
                  
      @param {String} pluginName You have to define the plugin name
      @param {Function} pluginFct You have to define the function of the plugin with one parameter that are the options passed
                   
      @example
      $SP().registerPlugin('test', function(options) {
        console.log(options.message);
      })
    */
    registerPlugin:function(name,fct) {
      var $html=$('html');
      var plugins=$html.data('sp-plugins') || [];
      if (typeof plugins[name] !== "undefined") 
        throw "Error 'registerPlugin': '"+name+"' is already registered.";
      plugins[name] = fct;
      $html.data('sp-plugins',plugins);
      return true;
    },
    /**
      @name $SP().plugin
      @function
      @description Permits to use a plugin
                  
      @param {String} pluginName The plugin name to call
      @param {Object} [options] The options for the plugin
                   
      @example
      $SP().plugin('test',{message:"This is a test !"})
    */
    plugin:function(name,options) {
      var plugins=$('html').data('sp-plugins') || [];
      options = options || {};
      if (typeof plugins[name] === "function") plugins[name].call(this,options);
      else throw "Error $SP().plugin: the plugin '"+name+"' is not registered."
      return this;
    }
  };

  
  /**
   * @description we need to extend an element for some cases with $SP().get
   **/
  var myElem = (function(){
    var myElem = function(elem) { return new MyElemConstruct(elem); },
    MyElemConstruct = function(elem) { this.mynode = elem; this.singleList=true; return this; };
    myElem.fn = MyElemConstruct.prototype = {
      getAttribute: function(id) { return this.mynode.getAttribute("ows_"+id.replace(/ /g,"")) }, /*.replace(/ /g,"")*/
      getAttributes:function() { return this.mynode.attributes }
    };
    return myElem;
  })();
  
  var extendMyObject=function(arr) { this.attributes=arr };
  extendMyObject.prototype.getAttribute=function(attr) { return this.attributes[attr] };
  extendMyObject.prototype.getAttributes=function() { return this.attributes };
  
  SharepointPlus.prototype.noConflict = function() {
    window._$SP = window._SharepointPlus = window.$SP;
  };

  return window.$SP = window.SharepointPlus = SharepointPlus;

})(window);