/**
 * jquery.jsForm
 * -------------
 * JsForm control for handling html UI with json objects
 * @version 1.0
 * @class
 * @author Niko Berger
 * @license MIT License GPL
 */
;(function( $, window, undefined ){
	"use strict";
	
	var JSFORM_INIT_FUNCTIONS = {},	// remember initialization functions
	JSFORM_MAP = {};	// remember all forms
	
	
	/**
	 * @param element {Node} the cotnainer node that should be converted to a jsForm
	 * @param options {object} the configuraton object
	 * @constructor
	 */
	function JsForm (element, options) {
		var $this = $(element);
		
		// create the options
		this.options = $.extend({}, {
			/**
			 * enable form control rendering (if jsForm.controls is available) and validation
			 */
			controls: true,
			/**
			 * the object used to fill/collect data
			 */
			data: null,
			/**
			 * the prefix used to annotate theinput fields
			 */
			prefix: "data",
			/**
			 * set to false to only validate visible fields. 
			 * This is discouraged especially when you have tabs or similar elements in your form.
			 */
			validateHidden: true
		}, options);

		// read prefix from dom
		if($this.attr("data-prefix") && (this.options.prefix === "data" || this.options.prefix === "")) {
			if($this.attr("data-prefix") !== "") {
				this.options.prefix = $this.attr("data-prefix");
			}
		}
		
		this.element = element;

		this._init();
	}

	/**
	 * init the portlet - load the config
	 * @private 
	 */
	JsForm.prototype._init = function() { 
		// init the basic dom functionality
		this._domInit();
		
		// enable form controls
		if(this.options.controls) {
			if($.jsFormControls) {
				$(this.element).jsFormControls();
			} else {
				try {
					if(typeof console !== "undefined") {
						console.log("jquery.JsForm.controls not available!");
					}
				} catch(ex) {
					// ignore
				}
			}
		}

		// fill/init with the first data
		this._fill(this.element, this.options.data, this.options.prefix);
	};
	
	
	/**
	 * init the dom. This can be called multiple times.
	 * this will also enable "add", "insert" and "delete" for collections
	 * @private 
	 */
	JsForm.prototype._domInit = function() {
		var form = $(this.element);
		var that = this;
		var prefix = this.options.prefix;
		
		// collection lists with buttons
		that._initCollection(form, prefix);
	};
	
	/**
	 * initialize collections
	 */
	JsForm.prototype._initCollection = function(form, prefix) {
		// all collections
		var collectionMap = {},
			that = this;
		$(form).data().collections = collectionMap; 
			
		$(".collection", form).each(function() {
			var colName = $(this).attr("data-field");
			// skip collections without a data-field mapping
			if (!colName || colName.indexOf(prefix + ".") !== 0) {
				return;	
			}

			var container = $(this);
			
			// remember the collection 
			var cols = collectionMap[colName];
			if(cols) {
				cols.push(container);
			} else {
				collectionMap[colName] = [container];
			}
			
			//init the collection
			that._initList(container);
			
			// after adding: check if we want reorder control
			if(!container.hasClass("ui-sortable") && container.hasClass("sortable") && container.sortable) {
				// get the config object
				var config = container.attr("data-sortable");
				if(!config) {
					config = {};
				} else {
					config = JSON.parse(config);
				}
				
				container.sortable(config);
				container.on("sortstop", function( event, ui ) {
					that._reorder(container);
				});
			} 

		});

		$(".add", form).each(function(){
			var fieldName = $(this).attr("data-field"); 
			if(!fieldName) {
				return;
			}
			
			// only init once
			if($(this).data("collections")) {
				return;
			}
			
			// add the collection
			$(this).data().collections = collectionMap[fieldName];
			
			$(this).click(function(ev){
				ev.preventDefault();
				
				// search for a collection with that name
				$.each($(this).data("collections"), function() {
					var tmpl = $(this).data("template");
					// and has a template
					if(tmpl) {
						var line = tmpl.clone(true);
						$(this).append(line);
						$(line).addClass("POJO");
						$(line).data("pojo", {});
						
						that._addCollectionControls(line);
						
						// trigger a callback
						$(this).trigger("addCollection", [line, $(line).data().pojo]);

						// fill the line with data
						that._fillData(line, $(line).data().pojo, fieldName.substring(fieldName.indexOf('.')+1));
						
						// its possible to have "sub" collections
						that._initCollection(line, fieldName.substring(fieldName.indexOf('.')+1));
						
						// trigger a callback after the data has been rendered)
						$(this).trigger("postAddCollection", [line, $(line).data().pojo]);

						
					}
				});
			});
		});
		
		// insert: similar to add - but works with events
		$(".insert", form).each(function(){
			var fieldName = $(this).attr("data-field"); 
			if(!fieldName) {
				return;
			}
			
			// only init once
			if($(this).data("collections")) {
				return;
			}
			
			// remember the collections
			$(this).data("collections", collectionMap[$(this).attr("data-field")]);
			
			$(this).on("insert", function(ev, pojo){
				if(!pojo)
					pojo = $(this).data().pojo;
				
				// insert only works if there is a pojo
				if(!pojo) {
					return;
				}
				var beforeInsertCallback = $(this).data("beforeInsert");
				if(beforeInsertCallback && $.isFunction(beforeInsertCallback)) {
					pojo = beforeInsertCallback(pojo);
					
					// insert only works if there is a pojo
					if(!pojo) {
						return;
					}
				}
				
				// search for a collection with that name
				$.each($(this).data("collections"), function() {
					var tmpl = $(this).data("template");
					// and has a template
					if(tmpl) {
						var line = tmpl.clone(true);
						// mark that this is a pojo
						line.addClass("POJO");
						// add the pojo
						line.data().pojo = pojo;

						that._addCollectionControls(line);
						
						// its possible to have "sub" collections
						that._initCollection(line);

						// trigger a callback
						$(this).trigger("addCollection", [line, $(line).data().pojo]);

						// fill the "information"
						that._fillData(line, pojo, fieldName.substring(fieldName.indexOf('.')+1));
						
						$(this).append(line);
					}
				});
				
				// empty field
				$(this).val("");
				$(this).data().pojo = null;
				$(this).focus();
			});
		});
		
		// insert: helper button (triggers insert)
		$(".insertAction", form).each(function(){
			var fieldName = $(this).attr("data-field"); 
			if(!fieldName) {
				return;
			}
			
			// only init once
			if($(this).data("inserter")) {
				return;
			}
			
			// find the insert element for this data-field
			var inserter = $(this).parent().find(".insert");
			if(!inserter) {
				return;
			}
			
			// remember the inserter
			$(this).data("inserter", inserter);
			
			$(this).click(function(ev){
				ev.preventDefault();
				$(this).data("inserter").trigger("insert");
				return false;
			});

		});

		$("input.object", form).each(function(){
			$(this).on("update", function(evt){
				var pojo = $(this).data().pojo;
				if (pojo && $(this).attr("data-display")) {
					$(this).val(that._renderObject(pojo, $(this).attr("data-display")));
				}
			});
		});
		
		// fileupload
		$("input.blob", form).each(function(){
			// only available on input type file
			if($(this).attr("type") !== "file") {
				return;
			}
			
			var blobInput = $(this);
			
			// bind on change
			$(this).on("change", function(evt){
				
				//get file name
				var fileName = $(this).val().split(/\\/).pop();
				blobInput.data("name", fileName);
				
				var files = evt.target.files; // FileList object
				// Loop through the FileList (and render image files as thumbnails.(skip for ie < 9)
				if(files && files.length) {
					$.each(files, function() {
						var reader = new FileReader();
	
						// closure to capture the file information
						reader.onload = function(e) {
							// get the result
							blobInput.data("blob", e.target.result);
						};
	
						// Read in the image file as a data URL.
						reader.readAsDataURL(this);
	
						$(this).trigger("fileChange");
					});
				} 
			});
			
			
		});
		
		// manage - obsolete
		$(".manage", form).each(function(){
			var fieldName = $(this).attr("data-field"); 
			if(!fieldName) {
				return;
			}

			// remember the collections
			$(this).data("collections", collectionMap[fieldName]);

			// start the multi-select
			$(this).click(function(){
				var dataService = $(this).attr("data-service");
				var collectionList = $(this).data("collections");
				
				var btn = $(this);
				var display = $(this).attr("data-display");
				if(display) {
					display = display.split(",");
				}
				
				DataUtils.run(dataService, function(data){
					var select = $('<select multiple="multiple"></select>');
					select.data("collections", collectionList);
					btn.data("select", select);
					$.each(data, function(){
						var cur = this;
						var optionDisplay = "";
						if(!display) {
							optionDisplay = cur;
						} else {
							for(var j = 0; j < display.length; j++) {
								optionDisplay += cur[display[j]] + " ";
							}
						}
						var option = $('<option value="' + optionDisplay + '">' + optionDisplay + '</option>');
						// check if we need to "select" that option
						$(collectionList).each(function() {
							$(this).children().each(function(count, ele){
								if(cur.id === $(ele).data("pojo").id) {
									option.attr("selected", "selected");
								}
							});
						});
						select.append(option);
						option.data("pojo", cur);
					});
					
					btn.after(select);
					btn.hide();
					
					select.multiselect({
						autoOpen: true,
						open: function(){
							//reposition
							$(this).multiselect("widget").css("top", $(select).next().offset().top);
							$(this).multiselect("widget").css("left", $(select).next().offset().left);
							// hide button
							$(select).next().hide();
						},
						close: function(){
							btn.show();
							select.remove();
							$(this).multiselect("destroy");
						}
					}).multiselectfilter().bind("multiselectclick multiselectcheckall multiselectuncheckall", 
						function( event, ui ){
							var checkedValues = $.map($(this).multiselect("getChecked"), function( input ){
								// we only get the same "value" - so check the option list for the correct pojo
								return $("option[value='"+input.value+"']", select).data("pojo");
							});
							
							// update collection
							$.each($(select).data("collections"), function(){
								that._fillList($(this), checkedValues, fieldName);
							});
							// reposition
							btn.hide();
							$(select).next().show();
							$(this).multiselect("widget").css("top", $(select).next().offset().top);
							$(this).multiselect("widget").css("left", $(select).next().offset().left);
							$(select).next().hide();							
						});
				});
			});
		});
	};
	
	/**
	 * init a container that has a tempalate child (first child). 
	 * @param container the contianer element
	 * @private
	 */
	JsForm.prototype._initList = function(container) {
		// avoid double initialisation
		if(container.data("template")) {
			return;
		}
		
		// get all children
		var tmpl = container.children().detach();
		
		// remove an id if there is one
		tmpl.removeAttr("id");
		container.data("template", tmpl);
	};

	/**
	 * clear/reset a form. The prefix is normally predefined by init
	 * @param form the form 
	 * @param prefix the optional prefix used to identify fields for this form
	 */
	JsForm.prototype._clear = function(form, prefix) {
		// get the prefix from the form if not given
		if(!prefix) {
			prefix = this.options.prefix;
		}
		
		$(form).removeData("pojo");
		$("input,select,textarea", form).each(function(){
			var name = $(this).attr("name");
			// empty name - ignore
			if (!name || name.indexOf(prefix + ".") !== 0) {
				return;
			}
			// cut away the prefix
			name = name.substring((prefix+".").length);
			// skip empty
			if(name.length < 1) {
				return;
			}
			
			// remove all pojos
			$(this).removeData("pojo");
			
			if($(this).attr("type") === "checkbox") {
				$(this).prop("checked", false);
			} else {
				$(this).val("");
			}
			if($(this).hasClass("blob")) {
				$(this).removeData("blob");
			}
			// special type select box: select the FIRST child
			if($(this).is("select")) {
				$('option[selected="selected"]', this).removeAttr('selected');
				$('option:first', this).attr('selected', true);

				$(this).val($("option:first", this).val()).change();
			}
			// trigger change
			$(this).change();
		});
		
		$(".collection", form).each(function() {
			var fieldname = $(this).attr("data-field");
			// only collections with the correct prefix
			if(!fieldname || fieldname.indexOf(prefix+".") !== 0) {
				return;
			}
			// get rid of all
			$(this).empty();
		});
		
	};
	/**
	* ceate a pojo from a form. Takes special data definition classes into account:
	* <ul>
	*  <li>number|currency: the content will be transformed into a number (default string</li>
	*  <li>transient: will be ignored</li>
	*  <li>prefix.fieldname.value: will create the whole object subtree</li> 
	* </ul> 
	* @param start the element to start from (ie. the form or tr)
	* @param pojo the pojo to write everything to
	* @param prefix a prefix: only fields with the given prefix will be included in the pojo
	* @private
	*/
	JsForm.prototype._createPojoFromInput = function (start, prefix, pojo) {
		// check if we have an "original" pojo
		var startObj = null;
		var that = this;
		
		// get it from the starting dom element
		if($(start).data("pojo")) {
			startObj = $(start).data("pojo");
		}
		
		// if we have an object, use this as base and fill the pojo
		if(startObj) {
			$.extend(true, pojo, startObj);
		}
		
		$(start).find("input,select,textarea").each(function(){
			var name = $(this).attr("name");
			
			// empty name - ignore
			if (!name) {
				return;
			}

			// skip grayed (=calculated) or transient fields
			if($(this).hasClass("transient")) {
				return;
			}
			
			// must start with prefix
			if(name.indexOf(prefix + ".") !== 0) {
				return;
			}
			
			$(this).trigger("validate", true);
			
			// cut away the prefix
			name = name.substring((prefix+".").length);
			
			// skip empty
			if(name.length < 1) {
				pojo = $(this).val();
				return false;
			}
			
			var val = $(this).val();
			
			if($(this).hasClass("emptynull")) { // nullable fields do not send empty string
				if(val === "" || val.trim() === "") {
					val = null;
				}
			} else if($(this).hasClass("object") || $(this).hasClass("POJO")) {
				val = $(this).data("pojo");
			} else if($(this).hasClass("blob")) { // file upload blob
				val = $(this).data("blob");
			} else
			// set empty numbers or dates to null
			if(val === "" && ($(this).hasClass("number") || $(this).hasClass("dateFilter")|| $(this).hasClass("dateTimeFilter"))) {
				val = null;
			}
			
			// check for percentage: this is input / 100
			if ($(this).hasClass("percent")) {
				val = that._getNumber(val);
				if(isNaN(val)) {
					val = 0;
				} else {
					val /= 100;
				}
			}

			if ($(this).hasClass("number") || $(this).hasClass("currency")) {
				val = that._getNumber(val);
				if(isNaN(val)) {
					val = 0;
				}
			}
			if($(this).attr("type") === "checkbox" || $(this).attr("type") === "CHECKBOX") {
				val = $(this).is(':checked');
			}

			// check if we have a . - if so split
			if (name.indexOf(".") === -1)
			{
				pojo[name] = val;
			}
			else
			{
				var parts = name.split(".");
				
				var d0 = pojo[parts[0]];
				var d1, d2;
				
				// multiple parts: make sure its an object
				if (!d0 || !$.isPlainObject(d0)) {
					pojo[parts[0]] = {};
					d0 = pojo[parts[0]]; 
				}
				
				if (parts.length === 2) {
					d0[parts[1]] = val;
				} else if (parts.length === 3) {
					d1 = d0[parts[1]];
					if(d1 === undefined) {
						d1 = {};
						d0[parts[1]] = d1;
					}
					d1[parts[2]] = val;
				} else if (parts.length === 4)
				{
					d1 = d0[parts[1]];
					d2 = d1[parts[2]];
					if(d2 === undefined) {
						d2 = {};
						d1[parts[2]] = d2;
					}
					d1[parts[2]] = val;
					d2[parts[3]] = val;
				}
				// more should not be necessary	
			}
		});
		
		return pojo;
	};

	
	/**
	* fill a dom subtree with data.
	* <ul>
	*  <li>&lt;span class="field"&gt;prefix.fieldname&lt;/span&gt;
	*  <li>&lt;input name="prefix.fieldname"/&gt;
	*  <li>&lt;a class="field" href="prefix.fieldname"&gt;linktest&lt;/a&gt;
	*  <li>&lt;img class="field" src="prefix.fieldname"/&gt;
	* </ul>
	* @param parent the root of the subtree
	* @param data the data
	* @param prefix the prefix used to find fields
	* @private
	*/
	JsForm.prototype._fillData = function (parent, data, prefix) {
		var that = this;
		var $parent = $(parent);
		
		// locate all "fields"
		$parent.find(".field").each(function() {
			var name = $(this).data("name");
			if(!name) {
				if(this.nodeName.toUpperCase() === 'A') {
					name = $(this).attr("href");
					$(this).attr("href", "#");
				}else if(this.nodeName.toUpperCase() === 'IMG') {
					name = $(this).attr("src");
					if(name.indexOf("#") === 0) {
						name = name.substring(1);
					}
					$(this).attr("src", "#");
				}else {
					name = $(this).text();
				}
				$(this).data("name", name);
				$(this).show();
			}

			if(!prefix || name.indexOf(prefix + ".") >= 0) {
				var cname = name;
				if (prefix) {
					cname = cname.substring(prefix.length + 1);
				}
				var cdata = that._get(data, cname);

				if(!cdata) {
					cdata = "";
				}
				
				// check for percentage: this is value * 100
				if ($(this).hasClass("percent") && !isNaN(cdata)) {
					cdata = 100 * Number(cdata);
				}
				
				// format the string
				if($.jsFormControls)
					cdata = $.jsFormControls.Format.format(this, cdata);
				
				if(this.nodeName.toUpperCase() === 'A') {
					$(this).attr("href", cdata);
				} else if(this.nodeName.toUpperCase() === 'IMG') {
					$(this).attr("src", cdata);
				}
				else if(this.nodeName.toUpperCase() === "DIV"){
					$(this).html(cdata);
				} else {
					$(this).text(cdata);
				}
			}
		});
		
		$("input", $parent).each(function() {
			var name = $(this).attr("name");
			if(!name) {
				return;
			}
			
			// ignore file inputs - they cannot be "prefilled"
			if($(this).attr("type") == "file") {
				return;
			}
			 
			if(!prefix || name.indexOf(prefix + ".") >= 0) {
				var cname = name;
				if (prefix) {
					cname = cname.substring(prefix.length + 1);
				}
				
				var cdata = that._get(data, cname);
				
				// check for percentage: this is value * 100
				if ($(this).hasClass("percent") && !isNaN(cdata)) {
					cdata = 100 * Number(cdata);
				} else if($.isPlainObject(cdata)) {
					$(this).data().pojo = cdata;
					$(this).addClass("POJO");
					cdata = that._renderObject(cdata, $(this).attr("data-display"));
				}
				

				if($(this).attr("type") === "checkbox") {
					$(this).prop("checked", (cdata === true || cdata === "true"));
					$(this).change();
				} else {
					if(!cdata) {
						cdata = "";
					}
					
					// format the string
					if($.jsFormControls)
						cdata = $.jsFormControls.Format.format(this, cdata);

					$(this).val(cdata);
					$(this).change();
				}
			}
		});
		
		$("select", $parent).each(function() {
			var name = $(this).attr("name");
			if(!name) {
				return;
			}
			
			if(!prefix || name.indexOf(prefix + ".") >= 0) {
				var cname = name;
				if (prefix) {
					cname = cname.substring(prefix.length + 1);
				}
				// remove "old" selected options
				$(this).children("option").removeAttr("selected");
				
				var value = that._get(data, cname);
				// try selecting based on the id 
				if (value.id) {
					$(this).children("option[value='"+value.id+"']").attr("selected", true);
					// actually set the value and trigger the change
					$(this).val(value.id).change();
					return;
				}
				
				$(this).children("option[value='"+value+"']").attr("selected", true);
				$(this).val(value).change();
			}		
		});
		
		$("textarea", $parent).each(function() {
			var name = $(this).attr("name");
			if(!name) {
				return;
			}
			
			if(!prefix || name.indexOf(prefix + ".") >= 0) {
				var cname = name;
				if (prefix) {
					cname = cname.substring(prefix.length + 1);
				}
				$(this).val(that._get(data,cname));
				$(this).change();
			}		
		});
	};
	
	/**
	 * ceate a pojo from a form. Takes special data definition classes into account:
	 * <ul>
	 *  <li>number: the content will be transformed into a number (default string</li>
	 *  <li>trueFalse: boolean
	 *  <li>collection: existing collections are replaced if "class=collection" elements exist
	 * </ul> 
	 * @param ignoreInvalid return a pojo, even if fields do not pass client side validation
	 * @return a new pojo
	 */
	JsForm.prototype.get = function(ignoreInvalid) {
		var form = $(this.element);
		var that = this;
		var originalPojo = this.options.data;
		var prefix = this.options.prefix;

		// get the pojo
		var pojo = {};
		if(originalPojo && $.isPlainObject(originalPojo)) {
			pojo = originalPojo; 
		}
		
		// fill the base
		that._createPojoFromInput(form, prefix, pojo);
		
		// check for invalid fields
		var invalid = false;
		if(!this.options.validateHidden) {
			form.find(".invalid").filter(":visible").each(function(){
				invalid = true;
				$(this).focus();
				return false;
			});
		} else {
			form.find(".invalid").each(function(){
				invalid = true;
				$(this).focus();
				return false;
			});
		}

		// get the collection
		if(this._getCollection(form, prefix, pojo, ignoreInvalid)) {
			invalid = true;
		}
		
		if(!ignoreInvalid && invalid) {
			return null;
		}

		return pojo;
	};
	
	/**
	 * fill a pojo based on collections
	 * @param form {DOMElement} the base element to start looking for collections
	 * @param prefix {string} the prefix used
	 * @param pojo {object} the object to fill
	 * @param ignoreInvalid {boolean} if true the function will return as soon as an invalid field is found
	 * @return true if the colelction encountered an invalid field
	 */
	JsForm.prototype._getCollection = function(form, prefix, pojo, ignoreInvalid) {
		var that = this;
		// check for invalid fields
		var invalid = false;
		
		form.find(".collection").each(function() {
			if(!ignoreInvalid && invalid) {
				return;
			}

			var fieldname = $(this).attr("data-field");
			// only collections with the correct prefix
			if(!fieldname || fieldname.indexOf(prefix+".") !== 0) {
				return;
			}
			
			fieldname = fieldname.substring((prefix+".").length);
			if(fieldname.length < 1) {
				return;
			}
			
			var colParent = that._getParent(pojo, fieldname, true);
			
			// get only the last part
			if(fieldname.indexOf('.') !== -1) {
				fieldname = fieldname.substring(fieldname.lastIndexOf('.') + 1);
			}
			
			// clear the collection
			colParent[fieldname] = [];
			
			// go through all direct childs - each one is an element
			$(this).children().each(function(){
				if(!ignoreInvalid && invalid) {
					return;
				}
				
				var ele = {};
				ele = that._createPojoFromInput($(this), fieldname, ele);
				
				// also collect sub-collections
				that._getCollection($(this), fieldname, ele, ignoreInvalid);
				
				// check if the pojo is empty
				if(!that._isEmpty(ele)) {
					if($(".invalid", this).length > 0) {
						invalid = true;
					}
					colParent[fieldname].push(ele);
				} else {
					$(".invalid", this).removeClass("invalid");
				}
			});
		});
		
		return invalid;
	};
	
	/**
	 * Get the data object used as a base for get().
	 * Note that modifying this directly migh result into unwanted results
	 * when working with some functions that rely on this object.
	 * 
	 * @returns the original data object
	 */
	JsForm.prototype.getData = function() {
		// make srue we do have an object to work with
		if(!this.options.data) {
			this.options.data = {};
		}
		return this.options.data;
	};

	/**
	 * uses form element and replaces them with "spans" that contain the actual content.
	 * the original "inputs" are hidden 
	 * @param form the form 
	 * @param enable true: switch inputs with spans, false: switch spans back, undefined: toggle
	 */
	JsForm.prototype.preventEditing = function(prevent) {
		var $this = $(this.element);
		
		if(typeof prevent === "undefined") {
			// get the disable from the form itself 
			prevent = $this.data("disabled")?false:true;
		} else {
			// already in that state
			if(prevent === $this.data("disabled")) {
				return;
			}
		}
		
		if (prevent)
		{
			$this.find("input, textarea").each(function() {
				if ($(this).closest("span.form")[0])
					return;
				if($(this).attr("type") == "hidden")
					return;
				var val = $(this).val();
				if (val === "null" || val === null || $(this).attr("type") === "submit")
					val = "";
				if($(this).hasClass("trueFalse")) {
					if($(this).is(':checked'))
						val = 'X';
					else
						val = '&#160;';
				}
				
				// convert \n to brs - escape all other html
				val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
				var thespan = $('<span class="form">'+val+'</span>');
				if($(this).parent().hasClass("ui-wrapper"))
					$(this).parent().hide().wrap(thespan);
				else
					$(this).hide().wrap(thespan);
			});
			// selects are handled slightly different
			$this.find("select").each(function() {
				if ($(this).closest("span.form")[0])
					return;
				
				var val = $(this).children(":selected").html();
				if (val === "null" || val === null)
					val = "";

				var thespan = $('<span class="form">'+val+'</span>');
				
				// toggle switches work a little different 
				if($(this).hasClass("ui-toggle-switch")) {
					$(this).prev().hide().wrap(thespan);
				}
				else {
					$(this).hide().wrap(thespan);
				}
			});
		}
		else
		{
			$this.find("span.form").each(function() {
				// remove text and then unwrap
				var ele = $(this).children("input,select,textarea,.ui-wrapper,.ui-toggle-switch").show().detach();
				$(this).before(ele);
				$(this).remove();
			});
		}
		
		$this.data("disabled", prevent);
	};
	
	/**
	 * validate a given form
	 * @return true if the form has no invalid fields, false otherwise
	 */
	JsForm.prototype.validate = function() {
		// get the prefix from the form if not given
		//var prefix = this.options.prefix;
		
		// validation
		$(".required,.regexp,.date,.mandatory,.number,.validate", this.element).change();
		
		// check for invalid fields
		if($(".invalid", this.element).length > 0) {
			return false;
		}
		
		return true;
	};
	
	/**
	 * fill a form based on a pojo. 
	 * @param form the form
	 * @param data the data object used to fill the form 
	 * @param prefix the optional prefix used to identify fields for this form
	 * @private
	 */
	JsForm.prototype._fill = function(form, data, prefix) {
		// get the prefix from the form if not given
		if(!prefix) {
			prefix = this.config.prefix;
		}
		
		this._clear(form, prefix);

		$(form).addClass("POJO");
		$(form).data("pojo", data);

		// fill base 
		this._fillData(form, data, prefix);
		this._fillCollection(form, data, prefix);
		
		// mark fields
	};

	/**
	 * @param container the container element
	 * @param data an array containing the the data
	 * @param prefix a prefix for each line of data
	 * @private
	 */
	JsForm.prototype._fillCollection = function(container, data, prefix) {
		var that = this;
		// fill collections
		$(".collection", container).each(function() {
			var container = $(this),
				fieldname = $(this).attr("data-field");
			// only collections with the correct prefix
			if(!data || !fieldname || fieldname.indexOf(prefix+".") !== 0) {
				return;
			}

			// data for the collection filling
			var colData = null;
			
			var cname = fieldname;
			// remove the prefix
			if (prefix) {
				cname = cname.substring(prefix.length + 1);
			}
			colData = that._get(data, cname);

			if(colData) {
				// fill the collection
				that._fillList(container, colData, cname);
			}
		});
	};
	
	/**
	 * @param container the container element
	 * @param data an array containing the the data
	 * @param prefix a prefix for each line of data
	 * @param lineFunc function(line,cur) - can return false to skip the line
	 * @private
	 */
	JsForm.prototype._fillList = function(container, data, prefix, lineFunc) {
		var tmpl = container.data("template"),
			that = this;
		if(!tmpl) {
			return;
		}
		// clean out previous list
		container.empty();
		
		// not an array
		if(!$.isArray(data)) {
			return;
		}
		
		// cut away any prefixes - only the fieldname is used
		if(prefix.indexOf('.') !== -1) {
			prefix = prefix.substring(prefix.lastIndexOf('.')+1);
		}
		
		
		// check if we need to sort the array
		if($(container).hasClass("sort")) {
			var sortField = $(container).attr("data-sort");
			if(sortField) {
				switch($(container).attr("data-sorttype")) {
				case 'alpha':
					data.sort();
					break;
				case 'alphainsensitiv':
					data.sort(function(a,b){
						a = a[sortField];
						b = b[sortField];
						if(a) a = a.toLowerCase();
						if(b) b = b.toLowerCase();
						if(a<b) 
							return -1;
						if(a>b) 
							return 1;
						return 0;
					});
					break;
				default:
					data.sort(function(a,b){
						return a[sortField] - b[sortField];
					});
				}
				// descending: reverse
				if($(container).attr("data-sortdesc")) {
					data.reverse();
				}
			}
		}
		
		if(!lineFunc) {
			if($.isFunction(prefix)) {
				lineFunc = prefix;
				prefix = null;
			}
		}
		
		for(var i = 0; i < data.length; i++) {
			var cur = data[i];
			var line = tmpl.clone(true);
			// save current line
			line.data("pojo", cur);
			line.addClass("POJO");

			if(lineFunc) {
				if(lineFunc(line, cur) === false) {
					continue;
				}
			}
			
			that._addCollectionControls(line);
			
			if(prefix) {
				that._fillData(line, cur, prefix);
				// enable collection controls
				that._initCollection(line, prefix);
				// fill with data
				that._fillCollection(line, cur, prefix);
			}
			container.append(line);

		}
	};
	
	/**
	 * add controls into a collection entry(i.e. delete)
	 * @param line the new collection 
	 * @private
	 */
	JsForm.prototype._addCollectionControls = function(line) {
		var that = this;

		// enable controls on the line
		if($.jsFormControls) {
			$(line).jsFormControls();
		} 

		$(".delete", line).click(function(){
			var ele = $(this).closest(".POJO");
			// trigger a callback
			$(this).closest(".collection").trigger("deleteCollection", [ele, $(ele).data().pojo]);
			ele.remove();
		});
		$(".sortUp", line).click(function(){
			// check if there is an up
			var ele = $(this).closest(".POJO");
			var prev = ele.prev(".POJO");
			if(prev.size() === 0) {
				// no previous element - return
				return;
			}
			ele.detach();
			prev.before(ele);
			// reorder (if possible)
			that._reorder(ele);
		});
		$(".sortDown", line).click(function(){
			// check if there is a down
			var ele = $(this).closest(".POJO");
			var next = ele.next(".POJO");
			if(next.size() === 0) {
				// no next element - return
				return;
			}
			ele.detach();
			next.after(ele);
			// reorder (if possible)
			that._reorder(ele);
		});
		
		// if collection is sortable: refresh it
		var container = $(line).closest(".collection");
		if(container.hasClass("sortable")&& $(container).sortable) {
			container.sortable("refresh");
		}
	};
	
	/**
	 * Reorder a collection (actually its fields)
	 * @param ele one element of the collection or the collection itself
	 * @private
	 */
	JsForm.prototype._reorder = function(ele) {
		if(!ele.attr("data-sort")) {
			ele = ele.closest(".collection");
		}

		// get the field to use for sorting
		var sortField = $(ele).attr("data-sort");
		if(!sortField || ($(ele).attr("data-sorttype") && $(ele).attr("data-sorttype") !== "number") || 
			($(ele).attr("data-sortdesc") && $(ele).attr("data-sortdesc") !== "false")) {
			return;
		}
		
		// go through each child and get the pojo
		var prio = 0;
		$.each($(ele).children(), function(){
			var data = $(this).data("pojo");
			// no data yet - add one
			if(!data) {
				data = {};
				$(this).data("pojo", data);
			}
			
			data[sortField] = prio++;
		});
	};
	
	/**
	 * render an object based on a string.
	 * Note: comma is a special char and cannot be used!
	 * @param obj the object
	 * @param skin the string to render with (i.e. id, ":", test)
	 * @private
	 */
	JsForm.prototype._renderObject = function(obj, skin) {
		if(!skin || !obj)
			return "";
		var that = this;
		var ret = "";
		$.each(skin.split(","), function(){
			var val = this.trim();
			if(val.indexOf("'") === 0 || val.indexOf('"') === 0) {
				ret += val.substring(1, val.length - 1);
			} else {
				ret += that._get(obj, val);
			}
		});
		return ret;
	};

	/**
	 * Retrieve a value from a given object by using dot-notation
	 * @param obj the object to start with
	 * @param the child to get (dot notation) 
	 * @param create set to true and non-existant levels will be created (always returns non-null)
	 * @private
	 */
	JsForm.prototype._get = function(obj, expr, create) {
		var ret, p, prm = "", i;
		if(typeof expr === "function") {
			return expr(obj); 
		}
		if (!obj) {
			return "";
		}
		// reference the object itself
		if(expr === "")
			return obj;
			
		ret = obj[expr];
		if(!ret) {
			try {
				if(typeof expr === "string") {
					prm = expr.split('.');
				}

				i = prm.length; 
				if(i) {
					ret = obj;
					while(ret && i--) {
						p = prm.shift();
						// create the levels
						if(create && !ret[p]) {
							ret[p] = {};
						}
						ret = ret[p];
					}
				}
			} catch(e) { /* ignore */ }
		}
		if(ret === null || ret === undefined) {
			ret = "";
		}
		// trim the return
		if(ret.trim) {
			return ret.trim();
		}
		return ret;
	};
	
		
	/**
	 * get the "parent" object of a given dot-notation. this will not return the actual 
	 * element given in the dot notation but itws parent (i.e.: when using a.b.c -> it will return b)
	 * @param obj the object to start with
	 * @param the child to get (dot notation)
	 * @param create set to true and non-existant levels will be created (always returns non-null)
	 * @private
	 */
	JsForm.prototype._getParent = function(obj, expr, create) {
		if(expr.indexOf('.') === -1)
			return obj;
		
		expr = expr.substring(0, expr.lastIndexOf('.'));
		return this._get(obj, expr, create);
	};

	/**
	 * helper function to get the number of a value
	 * @param num the string
	 * @returns a number or null
	 * @private
	 */
	JsForm.prototype._getNumber = function(num) {
		if (!num) {
			return null;
		}
		
		if($.format) 
			return $.format.number(num); 

		// either we have , (for komma) or a . and at least 3 following numbers (not a round komma)
		if(num.indexOf(",") != -1 || (num.length - num.indexOf('.') > 3))
		{
			num = num.replace(/\./g, "").replace(",", ".");
		}
		return Number(num);
	};

	/**
	 * checks if a variable is empty. This will check array, and whole objects. If a json object
	 * only contains empty "elements" then it is considered as empty.
	 * Empty for a number is 0/-1
	 * Empty for a boolena is false
	 * 
	 * @param pojo the pojo to check
	 * @returns {Boolean} true if it is empty
	 * @private
	 */
	JsForm.prototype._isEmpty = function(pojo) {
		// boolean false, null, undefined
		if(!pojo) {
			return true;
		}

		// array
		if($.isArray(pojo)) {
			// zero length
			if(pojo.length === 0) {
				return true;
			}
			
			// check each element
			for(var i = 0; i < pojo.length; i++) {
				if(!this._isEmpty()) {
					return false;
				}
			}
			return true;
		}
		// an object
		if($.isPlainObject(pojo)) {
			if($.isEmptyObject(pojo)) {
				return true;
			}
			
			for(var f in pojo){
				if(!this._isEmpty(pojo[f])) {
					return false;
				}
			}
			return true;
		}
		
		// a number
		if(!isNaN(pojo)) {
			if (Number(pojo) === 0 || Number(pojo) === -1) {
				return true;
			}
			return false;
		}
		
		// a string
		return (pojo === "" || pojo === " "); 
	};

	/**
	 * compare a pojo with a form. Takes special data definition classes into account:
	 * <ul>
	 *  <li>number|currency: the content will be transformed into a number (default string</li>
	 *  <li>transient: will be ignored</li>
	 *  <li>prefix.fieldname.value: will create the whole object subtree</li> 
	 * </ul> 
	 * @param start the element to start from (ie. the form or tr)
	 * @param pojo the pojo to write everything to
	 * @param prefix a prefix: only fields with the given prefix will be included in the pojo
	 * @private
	 */
	JsForm.prototype._pojoDifferFromInput = function (start, prefix, pojo) {
		var differs = false;
		$("input,select,textarea", start).each(function(){
			// skip if we found a dif
			if(differs) {
				return;
			}
			
			var name = $(this).attr("name");
			// empty name - ignore
			if (!name) {
				return;
			}

			// skip grayed (=calculated) or transient fields
			if($(this).hasClass("transient")) {
				return;
			}
			
			// must start with prefix
			if(name.indexOf(prefix + ".") !== 0) {
				return;
			}
			
			// cut away the prefix
			name = name.substring((prefix+".").length);
			
			// skip empty
			if(name.length < 1) {
				return;
			}
			
			var val = $(this).val();
			// set empty numbers to null
			if(val === "" && ($(this).hasClass("number") || $(this).hasClass("dateFilter")|| $(this).hasClass("dateTimeFilter"))) {
				val = null;
			}
			if ($(this).hasClass("number") || $(this).hasClass("currency")) {
				val = that._getNumber(val);
				if(isNaN(val)) {
					val = 0;
				}
			}
			if($(this).attr("type") === "checkbox" || $(this).attr("type") === "CHECKBOX") {
				val = $(this).is(':checked');
			}
					
			// check if we have a . - if so split
			if (name.indexOf(".") === -1)
			{
				// the vals differ
				if(pojo[name] !== val) {
					differs = true;
				}
			}
			else
			{
				var parts = name.split(".");
				
				var d0 = pojo[parts[0]];
				var d1, d2;
				
				if (!d0) {
					differs = true;
					return;
				}
				
				if (parts.length === 2) {
					// the vals differ
					if(d0[parts[1]] !== val) {
						differs = true;
					}
				} else if (parts.length === 3) {
					d1 = d0[parts[1]];
					// the vals differ
					if(d1[parts[2]] !== val) {
						differs = true;
					}
				} else if (parts.length === 4)
				{
					d1 = d0[parts[1]];
					d2 = d1[parts[2]];
					// the vals differ
					if(d2[parts[3]] !== val) {
						differs = true;
					}
				}
				// more should not be necessary	
			}
		});
		return differs;
	};
	
	/**
	 * Compares a pojo with form fields
	 * @param pojo the pojo to compare with
	 * @return true if any change between formfields and the pojo is found
	 */
	JsForm.prototype.equals = function(pojo) {
		var that = this;
		var form = this.element;
		var prefix = this.options.prefix;

		// check the base
		if(this._pojoDifferFromInput(form, prefix, pojo)) {
			return false;
		}
		
		var differs = false;
		
		// check for invalid fields
		if($(".invalid", form).length > 0) {
			return false;
		}
		
		$(".collection", form).each(function() {
			if(differs) {
				return;
			}

			var fieldname = $(this).attr("data-field");
			// only collections with the correct prefix
			if(!fieldname || fieldname.indexOf(prefix+".") !== 0) {
				return;
			}
			
			fieldname = fieldname.substring((prefix+".").length);
			if(fieldname.length < 1) {
				return;
			}
			
			var childCounter = 0;
			// go through all direct childs - each one is an element
			$(this).children().each(function(){
				if(differs) {
					return;
				}

				// check if we have more elements
				if(childCounter >= pojo[fieldname].length) {
					differs = true;
					return;
				}

				var ele = pojo[fieldname][childCounter++];
				if(that._pojoDifferFromInput($(this), fieldname, ele)) {
					differs = true;
				}
			});
			
			if(childCounter < pojo[fieldname].length) {
				differs = true;
			}
		});

		// we want to know if its equals -> return not
		return !differs;
	};
	
	/**
	 * fill the form with data.
	 * <ul>
	 *  <li>&lt;span class="field"&gt;prefix.fieldname&lt;/span&gt;
	 *  <li>&lt;input name="prefix.fieldname"/&gt;
	 *  <li>&lt;a class="field" href="prefix.fieldname"&gt;linktest&lt;/a&gt;
	 *  <li>&lt;img class="field" src="prefix.fieldname"/&gt;
	 * </ul>
	 * @param data {object} the data
	 * @private
	 */
	JsForm.prototype.fill = function(pojo) {
		// clear first
		this.clear();
		// set the new data
		this.options.data = pojo;
		// fill everything
		this._fill(this.element, this.options.data, this.options.prefix);
	};


	/**
	 * Clear all fields in a form
	 */
	JsForm.prototype.clear = function() {
		// clear first
		this._clear(this.element, this.options.prefix);
	};

	/**
	 * destroy the jsform  and its resources.
	 * @private
	 */
	JsForm.prototype.destroy = function( ) {
		return $(this.element).each(function(){
			$(window).unbind('.jsForm');
			$(this).removeData('jsForm');
		});
	};

	// init and call methods
	$.fn.jsForm = function ( method ) {
		// Method calling logic
		if ( typeof method === 'object' || ! method ) {
			return this.each(function () {
				if (!$(this).data('jsForm')) {
					$(this).data('jsForm', new JsForm( this, method ));
				}
			});
		} else {
			var args = Array.prototype.slice.call( arguments, 1 ),
				jsForm;
			// none found
			if(this.length === 0) {
				return null;
			}
			// only one - return directly
			if(this.length === 1) {
				jsForm = $(this).data('jsForm');
				if (jsForm) {
					if(method.indexOf("_") !== 0 && jsForm[method]) {
						var ret =  jsForm[method].apply(jsForm, args);
						return ret;
					}
					
					$.error( 'Method ' +  method + ' does not exist on jQuery.jsForm' );
					return false;
				}
			}
			
			return this.each(function () {
				jsForm = $.data(this, 'jsForm'); 
				if (jsForm) {
					if(method.indexOf("_") !== 0 && jsForm[method]) {
						return jsForm[method].apply(jsForm, args);
					} else {
						$.error( 'Method ' +  method + ' does not exist on jQuery.jsForm' );
						return false;
					}
				}
			});
		}   
	};
		
	/**
	 * global jsForm function for intialisation
	 */
	$.jsForm = function ( name, initFunc ) {
		var jsForms = JSFORM_MAP[name];
		// initFunc is a function -> initialize
		if($.isFunction(initFunc)) {
			// call init if already initialized
			if(jsForms) {
				$.each(jsForms, function(){
					initFunc(this, $(this.element));
				});
			}
			
			// remember for future initializations
			JSFORM_INIT_FUNCTIONS[name] = initFunc;
		} else {
			// call init if already initialized
			if(jsForms) {
				var method = initFunc;
				var args = Array.prototype.slice.call( arguments, 2 );
				$.each(portlets, function(){
					this[method].apply(this, args);
				});
			}
		}
	};

})( jQuery, window );

/**
 * jquery.jsForm.controls
 * ----------------------
 * UI Controls and Field validation
 * @version 1.0
 * @class
 * @author Niko Berger
 * @license MIT License GPL
 */
;(function( $, window, undefined ){
	"use strict";
	
	var JSFORM_INIT_FUNCTIONS = {},	// remember initialization functions
		JSFORM_MAP = {};	// remember all forms

	/**
	 * handlebars extension (+simple date format)
	 */
	if(typeof Handlebars !== "undefined") {
		Handlebars.registerHelper("currency", function(data){
			if(!data)
				return "0";
			return $.jsFormControls.Format.currency(data);
		});
		Handlebars.registerHelper("dec", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.decimal(data);
		});
		Handlebars.registerHelper("percent", function(data){
			if(!data)
				return "0";
			return $.jsFormControls.Format.decimal(data*100);
		});
		Handlebars.registerHelper("date", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.date(data);
		});
		Handlebars.registerHelper("time", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.time(data);
		});
		Handlebars.registerHelper("datetime", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.dateTime(data);
		});
		Handlebars.registerHelper("dateTime", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.dateTime(data);
		});
		Handlebars.registerHelper("timespan", function(data){
			if(!data)
				return "";
			return $.jsFormControls.Format.humanTime(data);
		});
	}
	
	function JsFormControls(element) {
		this.element = element;
		
		// init the dom functionality
		this._domInit();
	}
	
	/**
	 * init the dom. This can be called multiple times.
	 * this will also enable "add", "insert" and "delete" for collections
	 * @private 
	 */
	JsFormControls.prototype._domInit = function() {
		var location = $(this.element);
		
		// validation
		// check required (this is the first check)
		location.find("input.mandatory,textarea.mandatory").on("keyup", function(){
			// check for "null" as value as well 
			if($(this).val().length > 0 && $(this).val() !== "null") {
				$(this).addClass("valid").removeClass("invalid");
			} else {
				$(this).removeClass("valid").addClass("invalid");
			}
		});
		
		location.find("input.mandatory,textarea.mandatory").on("change", function(){
			if($(this).hasClass("object")) {
				if($(this).data().pojo) {
					$(this).addClass("valid").removeClass("invalid");
				} else {
					$(this).removeClass("valid").addClass("invalid");
				}
				return;
			} 
			// check for "null" as value as well 
			if($(this).val().length > 0 && $(this).val() !== "null") {
				$(this).addClass("valid").removeClass("invalid");
			} else {
				$(this).removeClass("valid").addClass("invalid");
			}
		}).change();

		location.find("select.mandatory").change(function(){
			// check for "null" as value as well 
			if($(this).val() !== null && $(this).val() !== "null" && $(this).val().length > 0) {
				$(this).addClass("valid").removeClass("invalid");
			} else {
				$(this).removeClass("valid").addClass("invalid");
			}
		}).change();
		
		// show datepicker for all inputs
		location.find("input.date").each(function(){
			var format = $(this).attr("data-format");
			// only if jquery ui is available
			if($(this).datepicker) {
				if(format)
					$(this).datepicker({dateFormat: format});
				else
					$(this).datepicker();
			}
		});
			
		
		// input validation (number)
		var numberRegexp =  new RegExp("^[0-9]+$");
		location.find("input.number").keyup(function(){
			var val = $(this).val();
			if(val.length > 0) {
				if($(this).hasClass("autoclean")) {
					$(this).val(val.replace(/[^0-9]/g, ""));
				}
				else {
					if(numberRegexp.test($(this).val())) {
						$(this).addClass("valid").removeClass("invalid");
					} else {
						$(this).removeClass("valid").addClass("invalid");
					}
				}
			}
		}).keyup();
		
		// regular expression
		location.find("input.regexp").each(function(){
			if($(this).hasClass("autoclean")) {
				$(this).data("regexp", new RegExp($(this).attr("data-regexp"), "g"));
			}
			else {
				$(this).data("regexp", new RegExp($(this).attr("data-regexp")));
			}
			
			$(this).keyup(function(){
				var val = $(this).val();
				if(val.length > 0) {
					var regexp = $(this).data("regexp");
					if($(this).hasClass("autoclean")) {
						$(this).val(val.replace(regexp, ""));
					}
					else {
						if(regexp.test($(this).val())) {
							$(this).addClass("valid").removeClass("invalid");
						} else {
							$(this).removeClass("valid").addClass("invalid");
						}
					}
				} else {
					// if not mandatory: nothing is valid
					if(!$(this).hasClass("mandatory")) {
						$(this).removeClass("invalid").addClass("valid");
					}
				}
			}).keyup();
			$(this).change(function(){
				$(this).keyup();
			});
		});
		
		/* rotatestate stontrol */
		location.find("input.rotatestate").each(function(){
			var states = $(this).attr("data-state-values");
			var defaultClass = $(this).attr("data-state-class");
			// no need to continue if there are no states
			if(!states) {
				return;
			}
			
			try {
				states = JSON.parse(states);
			} catch (ex) {
				// do not need to continue if we cannot parse the states
				return;
			}
			
			var stateControl = $("<span></span>");
			if($(this).attr("title")) {
				stateControl.attr("title", $(this).attr("title"));
			}
			if($(this).attr("data-state-style")) {
				stateControl.attr("style", $(this).attr("data-state-style"));
			}
			stateControl.data("states", states);
			stateControl.data("control", this);
			stateControl.data("activeState", null);
			$(this).data("control", stateControl);
			if(defaultClass) {
				stateControl.addClass(defaultClass);
			}
			
			// click on the control starts rotating
			stateControl.click(function(){
				var cState = $(this).data().activeState;
				var cStates = $(this).data().states;
				var control = $(this).data().control;
				var newState = null;

				if(cState !== null) {
					// go to the 'next' state
					for(var i = 0; i < cStates.length; i++) {
						if(cStates[i].value === cState.value) {
							// last element
							if(i === cStates.length - 1) {
								newState = cStates[0];
							} else {
								newState = cStates[i+1];
							}
							break;
						}
					}
				} else {
					// no state yet - set the first entry as state
					newState = cStates[0];
				}
				
				$(control).attr("value", newState.value);
				// trigger change
				$(control).change();
			});
			
			// make sure to update state if the value is changed
			$(this).change(function(){
				var control = $($(this).data().control);
				var cState = control.data().activeState;
				var cStates = control.data().states;
				
				if(cState !== null) {
					// remove "old state"
					control.removeClass(cState['class']);
				}
				
				// add new State
				var val = $(this).val();
				$.each(cStates, function(){
					if(this.value === val) {
						control.data().activeState = this;
						if(this.title) {
							control.attr("title", this.title);
						}
						control.addClass(this['class']);
						return false;
					}
				});
			});
			
			// trigger initial state
			$(this).change();
			$(this).after(stateControl);
			$(this).hide();
		});		
	};
		

	/**
	 * validate a given form
	 * @return true if the form has no invalid fields, false otherwise
	 */
	JsFormControls.prototype.validate = function() {
		// validation
		$(".required,.regexp,.date,.mandatory,.number,.validate", this.element).change();
		
		// check for invalid fields
		if($(".invalid", this.element).length > 0) {
			return false;
		}
		
		return true;
	};

	// init and call methods
	$.fn.jsFormControls = function ( method ) {
		// Method calling logic
		if ( typeof method === 'object' || ! method ) {
			return this.each(function () {
				if (!$(this).data('jsFormControls')) {
					$(this).data('jsFormControls', new JsFormControls( this, method ));
				}
			});
		} else {
			var args = Array.prototype.slice.call( arguments, 1 );
			
			// only one - return directly
			if(this.length == 1) {
				var jsFormControls = $(this).data('jsFormControls'); 
				if (jsFormControls) {
					if(method.indexOf("_") !== 0 && jsFormControls[method]) {
						var ret =  jsFormControls[method].apply(jsFormControls, args);
						return ret;
					}

					$.error( 'Method ' +  method + ' does not exist on jQuery.jsFormControls' );
					return false;
				}
			}
			
			return this.each(function () {
				var jsFormControls = $.data(this, 'jsFormControls'); 
				if (jsFormControls) {
					if(method.indexOf("_") !== 0 && jsFormControls[method]) {
						return jsFormControls[method].apply(jsFormControls, args);
					} else {
						$.error( 'Method ' +  method + ' does not exist on jQuery.jsFormControls' );
						return false;
					}
				}
			});
		}   
	};
	
	/**
	 * global jsForm function for intialisation
	 */
	$.jsFormControls = function ( name, initFunc ) {
		var jsForms;
		// initFunc is a function -> initialize
		if($.isFunction(initFunc)) {
			// call init if already initialized
			jsForms = JSFORM_MAP[name];
			if(jsForms) {
				$.each(jsForms, function(){
					initFunc(this, $(this.element));
				});
			}
			
			// remember for future initializations
			JSFORM_INIT_FUNCTIONS[name] = initFunc;
		} else {
			// call init if already initialized
			jsForms = JSFORM_MAP[name];
			if(jsForms) {
				var method = initFunc;
				var args = Array.prototype.slice.call( arguments, 2 );
				$.each(portlets, function(){
					this[method].apply(this, args);
				});
			}
		}
	};
	
	$.jsFormControls.Format = {
			/**
			 * format a string based on teh classes in a dom element
			 */
			format: function(ele, cdata) {
				if($(ele).hasClass("dateTime")) {
					return $.jsFormControls.Format.dateTime(cdata);
				} if($(ele).hasClass("datetime")) {
					return $.jsFormControls.Format.dateTime(cdata);
				} else if($(ele).hasClass("date")) {
					return $.jsFormControls.Format.date(cdata);
				} else if($(ele).hasClass("currency")) {
					return $.jsFormControls.Format.currency(cdata);
				} else if($(ele).hasClass("number")) {
					return $.jsFormControls.Format.decimal(cdata);
				}
				
				return cdata;
			},
			
			/**
			 * format boolean into an ui-icon 
			 * @param value true or false
			 * @returns the ui-icon span
			 */
			checkBox: function(row, cell, value, columnDef, dataContext) {
				// cleanup parameters (direct call vs. slickgrid)
				if(typeof value === "undefined") {
					value = row;
					row = null;
				}
				
				if(value) {
					return '<span class="ui-icon ui-icon-check">&nbsp;</span>';
				} else {
					return '<span class="ui-icon ui-icon-close">&nbsp;</span>';
				}
				
				return value;
			}, 
			

			/**
			 * @private
			 */
			_getNumber: function(num) {
				if (!num) {
					return null;
				}
				
				if($.format) 
					return $.format.number(num); 

				// either we have , (for komma) or a . and at least 3 following numbers (not a rounden komma)
				if(num.indexOf(",") !== -1 || (num.length - num.indexOf('.') > 3))
				{
					num = num.replace(/\./g, "").replace(",", ".");
				}
				return Number(num);
			},


			/**
			 * @private
			 */
			_pad: function(val) {
				var o = (val < 10) ? "0" : "";
				o += val;
				return o;
			},


			/**
			 * @private
			 */
			decimal: function(num) {
				if (num === "" || !num || isNaN(num)) {
					return num;
				}
				
				if($.format) 
					return $.format.number(num, $(document).data().i18n.number.format); 
					
				var comma = 0;
				if (Math.abs(num - Math.floor(num)) > 0.001) {
					comma = 2;
				}
				// convert to a nice number for display
				var n = num, 
					c = isNaN(c = Math.abs(comma)) ? 2 : comma, 
					d = ',', // decimal d == undefined ? "," : d, 
					t = '.', // thousand: t == undefined ? "." : t, 
					i = parseInt(n = Math.abs( +n || 0).toFixed(c), 10) + "", 
					j = (j = i.length) > 3 ? j % 3 : 0;
				return (num<0 ? "-" : "") + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
			},


			/**
			 * @private
			 */
			currency: function(row, cell, cellvalue, columnDef, dataContext) {
				// cleanup parameters (direct call vs. slickgrid)
				if(!cellvalue || isNaN(cellvalue)) {
					cellvalue = row;
					row = null;
				}

				if(!cellvalue) {
					if(cell) {
						return "&#160;";
					}
					return "";
				}
				
				return $.jsFormControls.Format.decimal(cellvalue);
			},

			/**
			 * @private
			 */
			dateTime: function(row, cell, cellvalue, columnDef, dataContext) {
				// cleanup parameters (direct call vs. slickgrid)
				if(!cellvalue || isNaN(cellvalue)) {
					cellvalue = row;
					row = null;
				}

				if(!cellvalue) {
					if(cell) {
						return "&#160;";
					}
					return "";
				}
				
				return (this.date(cellvalue) + " " + this.time(cellvalue));
			},

			/**
			 * @private
			 */
			date: function(row, cell, cellvalue, columnDef, dataContext) {
				
				// cleanup parameters (direct call vs. slickgrid)
				if(!cellvalue || isNaN(cellvalue)) {
					cellvalue = row;
					row = null;
				}

				if(!cellvalue) {
					if(cell) {
						return "&#160;";
					}
					return "";
				}
				
				var d = new Date();
				d.setTime(cellvalue);
				var year = d.getYear();
				if(year < 1900) {
					year += 1900;
				}
				
				if($.format)
					return $.format.date(d, $(document).data().i18n.date.shortDateFormat);
				else
					return this._pad(d.getDate()) + "." + this._pad((d.getMonth()+1)) + "." + this._pad(year);
			},

			/**
			 * @private
			 */
			time: function(row, cell, value, columnDef, dataContext) {
				// cleanup parameters (direct call vs. slickgrid)
				if(!value) {
					value = row;
					row = null;
				}

				if(!value) {
					if(cell) {
						return "&#160;";
					}
					return "";
				}
				
				var d = new Date();
				d.setTime(value);
				if($.format)
					return $.format.date(d, $(document).data().i18n.date.timeFormat);
				else
					return this._pad(d.getHours()) + ":" + this._pad(d.getMinutes()); //  + ":" + pad(d.getSeconds()); don't need seconds
			},

			/**
			 * 
			 * @param value a string value to format
			 * @param allowms true to allow komma (i.e. 00.00)
			 * @return something in the form of 00:00.00
			 * @private
			 */
			timespan: function(row, cell, value, columnDef, dataContext, allowcomma) {
				// cleanup parameters (direct call vs. slickgrid)
				if(!value) {
					value = row;
					allowcomma = cell;
					row = null;
					cell = null;
				}

				var tokens = value.split(":");
				// check each token
				for(var i=0; i<tokens.length; i++) {
					var nt = Number(tokens[i]);
					if(!nt || nt === 'NaN') {
						nt = 0;
					}
					tokens[i] = this._pad(nt);
				}
				
				if(tokens.length <= 0) {
					return "0:00";
				}

				if(tokens.length == 1) {
					return "0:" + this._pad(allowkomma ? tokens[0] : Math.floor(tokens[0]));
				}
				
				if(tokens.length == 2) {
					return allowkomma ? tokens[0] : Math.floor(tokens[0]) + ":" + this._pad(allowkomma ? tokens[1] : Math.floor(tokens[1]));
				}
				
				return allowkomma ? tokens[0] : Math.floor(tokens[0]) + ":" + this._pad(allowkomma ? tokens[1] : Math.floor(tokens[1])) + ":" + pad(allowkomma ? tokens[2] : Math.floor(tokens[2]));
			},
			
			/**
			 * Formats a time to "human"
			 * @param value the time in milliseconds
			 * @returns the time for display in human readable
			 */
			humanTime: function(row, cell, value, columnDef, dataContext) {
				// cleanup parameters (direct call vs. slickgrid)
				if(!value) {
					value = row;
					row = null;
				}
				
				
				if (isNaN(value)) {
					if(!value || value.length === 0) {
						return "-";
					}
					return value;
				}
				
				var h = Math.floor(value/3600000);
				value -= h * 3600000;
				var m = Math.floor(value/60000);
				value -= m * 60000;
				var s = Math.floor(value/1000);
				value -= s * 1000;
				
				var out = "";
				if (h > 0) {
					out += h + "h ";
					// ignore seconds and milliseconds if we have hours
					s = 0;
					value = 0;
				}
				if (m > 0) {
					out += m + "m ";
					// ignore milliseconds
					value = 0;
				}
				if (s > 0) {
					out += s + "s ";
					value = 0;
				}
				
				if (value > 0) {
					out += value + "ms";
				}
				// trim output
				return out.trim();
			}
	};

})( jQuery, window );


/**
 * @returns the trimmed string
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
};

/* check start of a string */
String.prototype.startsWith = function(str) {
	if((this === null) || (this.length <= 0))
		return false;
	if((str === null) || (str == "null") || (str.length <= 0))
		return false;
	if(this.substr(0, str.length) == str)
		return true;
	return false;
};

/* check start of a string */
String.prototype.startsWithIgnoreCase = function(str) {
	if((this === null) || (this.length <= 0))
		return false;
	if((str === null) || (str == "null") || (str.length <= 0))
		return false;
	if(this.substr(0, str.length).toLowerCase() == str.toLowerCase())
		return true;
	return false;
};

/* check end of a string */
String.prototype.endsWith = function(str) {
	if((this === null) || (this.length <= 0))
		return false;
	if((str === null) || (str == "null") || (str.length <= 0) || (str.length > this.length))
		return false;
	if(this.substr(this.length - str.length) == str)
		return true;
	return false;
};