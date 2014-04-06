/**
 * This file contains all the JS required by the Suffusion options panel to run.
 */

/**
 * AJAX Upload
 * Project page - http://valums.com/ajax-upload/
 * Copyright (c) 2008 Andris Valums, http://valums.com
 * Licensed under the MIT license (http://valums.com/mit-license/)
 */

(function(){
	var d = document, w = window;

/**
 * Get element by id
 */
function get(element){
	if (typeof element == "string")
		element = d.getElementById(element);
	return element;
}

/**
 * Attaches event to a dom element
 */
function addEvent(el, type, fn){
	if (w.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (w.attachEvent){
		var f = function(){
		  fn.call(el, w.event);
		};
		el.attachEvent('on' + type, f)
	}
}


/**
 * Creates and returns element from html chunk
 */
var toElement = function(){
	var div = d.createElement('div');
	return function(html){
		div.innerHTML = html;
		var el = div.childNodes[0];
		div.removeChild(el);
		return el;
	}
}();

function hasClass(ele,cls){
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
	if (!hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	ele.className=ele.className.replace(reg,' ');
}

// getOffset function copied from jQuery lib (http://jquery.com/)
if (document.documentElement["getBoundingClientRect"]){
	// Get Offset using getBoundingClientRect
	// http://ejohn.org/blog/getboundingclientrect-is-awesome/
	var getOffset = function(el){
		var box = el.getBoundingClientRect(),
		doc = el.ownerDocument,
		body = doc.body,
		docElem = doc.documentElement,

		// for ie
		clientTop = docElem.clientTop || body.clientTop || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,

		// In Internet Explorer 7 getBoundingClientRect property is treated as physical,
		// while others are logical. Make all logical, like in IE8.

		zoom = 1;

		if (body.getBoundingClientRect) {
			var bound = body.getBoundingClientRect();
			zoom = (bound.right - bound.left)/body.clientWidth;
		}

		if (zoom > 1){
			clientTop = 0;
			clientLeft = 0;
		}

		var top = box.top/zoom + (window.pageYOffset || docElem && docElem.scrollTop/zoom || body.scrollTop/zoom) - clientTop,
		left = box.left/zoom + (window.pageXOffset|| docElem && docElem.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft;

		return {
			top: top,
			left: left
		};
	}

} else {
	// Get offset adding all offsets
	var getOffset = function(el){
		if (w.jQuery){
			return jQuery(el).offset();
		}

		var top = 0, left = 0;
		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;
		}
		while (el = el.offsetParent);

		return {
			left: left,
			top: top
		};
	}
}

function getBox(el){
	var left, right, top, bottom;
	var offset = getOffset(el);
	left = offset.left;
	top = offset.top;

	right = left + el.offsetWidth;
	bottom = top + el.offsetHeight;

	return {
		left: left,
		right: right,
		top: top,
		bottom: bottom
	};
}

/**
 * Crossbrowser mouse coordinates
 */
function getMouseCoords(e){
	// pageX/Y is not supported in IE
	// http://www.quirksmode.org/dom/w3c_cssom.html
	if (!e.pageX && e.clientX){
		// In Internet Explorer 7 some properties (mouse coordinates) are treated as physical,
		// while others are logical (offset).
		var zoom = 1;
		var body = document.body;

		if (body.getBoundingClientRect) {
			var bound = body.getBoundingClientRect();
			zoom = (bound.right - bound.left)/body.clientWidth;
		}

		return {
			x: e.clientX / zoom + d.body.scrollLeft + d.documentElement.scrollLeft,
			y: e.clientY / zoom + d.body.scrollTop + d.documentElement.scrollTop
		};
	}

	return {
		x: e.pageX,
		y: e.pageY
	};

}
/**
 * Function generates unique id
 */
var getUID = function(){
	var id = 0;
	return function(){
		return 'ValumsAjaxUpload' + id++;
	}
}();

function fileFromPath(file){
	return file.replace(/.*(\/|\\)/, "");
}

function getExt(file){
	return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
}

/**
 * Cross-browser way to get xhr object
 */
var getXhr = function(){
	var xhr;

	return function(){
		if (xhr) return xhr;

		if (typeof XMLHttpRequest !== 'undefined') {
			xhr = new XMLHttpRequest();
		} else {
			var v = [
				"Microsoft.XmlHttp",
				"MSXML2.XmlHttp.5.0",
				"MSXML2.XmlHttp.4.0",
				"MSXML2.XmlHttp.3.0",
				"MSXML2.XmlHttp.2.0"
			];

			for (var i=0; i < v.length; i++){
				try {
					xhr = new ActiveXObject(v[i]);
					break;
				} catch (e){}
			}
		}

		return xhr;
	}
}();

// Please use AjaxUpload , Ajax_upload will be removed in the next version
Ajax_upload = AjaxUpload = function(button, options){
	if (button.jquery){
		// jquery object was passed
		button = button[0];
	} else if (typeof button == "string" && /^#.*/.test(button)){
		button = button.slice(1);
	}
	button = get(button);

	this._input = null;
	this._button = button;
	this._disabled = false;
	this._submitting = false;
	// Variable changes to true if the button was clicked
	// 3 seconds ago (requred to fix Safari on Mac error)
	this._justClicked = false;
	this._parentDialog = d.body;

	if (window.jQuery && jQuery.ui && jQuery.ui.dialog){
		var parentDialog = jQuery(this._button).parents('.ui-dialog');
		if (parentDialog.length){
			this._parentDialog = parentDialog[0];
		}
	}

	this._settings = {
		// Location of the server-side upload script
		action: 'upload.php',
		// File upload name
		name: 'userfile',
		// Additional data to send
		data: {},
		// Submit file as soon as it's selected
		autoSubmit: true,
		// The type of data that you're expecting back from the server.
		// Html and xml are detected automatically.
		// Only useful when you are using json data as a response.
		// Set to "json" in that case.
		responseType: false,
		// Location of the server-side script that fixes Safari
		// hanging problem returning "Connection: close" header
		closeConnection: '',
		// Class applied to button when mouse is hovered
		hoverClass: 'hover',
		// When user selects a file, useful with autoSubmit disabled
		onChange: function(file, extension){},
		// Callback to fire before file is uploaded
		// You can return false to cancel upload
		onSubmit: function(file, extension){},
		// Fired when file upload is completed
		// WARNING! DO NOT USE "FALSE" STRING AS A RESPONSE!
		onComplete: function(file, response) {}
	};

	// Merge the users options with our defaults
	for (var i in options) {
		this._settings[i] = options[i];
	}

	this._createInput();
	this._rerouteClicks();
}

// assigning methods to our class
AjaxUpload.prototype = {
	setData : function(data){
		this._settings.data = data;
	},
	disable : function(){
		this._disabled = true;
	},
	enable : function(){
		this._disabled = false;
	},
	// removes instance
	destroy : function(){
		if(this._input){
			if(this._input.parentNode){
				this._input.parentNode.removeChild(this._input);
			}
			this._input = null;
		}
	},
	/**
	 * Creates invisible file input above the button
	 */
	_createInput : function(){
		var self = this;
		var input = d.createElement("input");
		input.setAttribute('type', 'file');
		input.setAttribute('name', this._settings.name);
		var styles = {
			'position' : 'absolute'
			,'margin': '-5px 0 0 -175px'
			,'padding': 0
			,'width': '220px'
			,'height': '30px'
			,'fontSize': '14px'
			,'opacity': 0
			,'cursor': 'pointer'
			,'display' : 'none'
			,'zIndex' :  2147483583 //Max zIndex supported by Opera 9.0-9.2x
			// Strange, I expected 2147483647
			// Doesn't work in IE :(
			//,'direction' : 'ltr'
		};
		for (var i in styles){
			input.style[i] = styles[i];
		}

		// Make sure that element opacity exists
		// (IE uses filter instead)
		if ( ! (input.style.opacity === "0")){
			input.style.filter = "alpha(opacity=0)";
		}

		this._parentDialog.appendChild(input);

		addEvent(input, 'change', function(){
			// get filename from input
			var file = fileFromPath(this.value);
			if(self._settings.onChange.call(self, file, getExt(file)) == false ){
				return;
			}
			// Submit form when value is changed
			if (self._settings.autoSubmit){
				self.submit();
			}
		});

		// Fixing problem with Safari
		// The problem is that if you leave input before the file select dialog opens
		// it does not upload the file.
		// As dialog opens slowly (it is a sheet dialog which takes some time to open)
		// there is some time while you can leave the button.
		// So we should not change display to none immediately
		addEvent(input, 'click', function(){
			self.justClicked = true;
			setTimeout(function(){
				// we will wait 3 seconds for dialog to open
				self.justClicked = false;
			}, 2500);
		});

		this._input = input;
	},
	_rerouteClicks : function (){
		var self = this;

		// IE displays 'access denied' error when using this method
		// other browsers just ignore click()
		// addEvent(this._button, 'click', function(e){
		//   self._input.click();
		// });

		var box, dialogOffset = {top:0, left:0}, over = false;

		addEvent(self._button, 'mouseover', function(e){
			if (!self._input || over) return;

			over = true;
			box = getBox(self._button);

			if (self._parentDialog != d.body){
				dialogOffset = getOffset(self._parentDialog);
			}
		});


		// We can't use mouseout on the button,
		// because invisible input is over it
		addEvent(document, 'mousemove', function(e){
			var input = self._input;
			if (!input || !over) return;

			if (self._disabled){
				removeClass(self._button, self._settings.hoverClass);
				input.style.display = 'none';
				return;
			}

			var c = getMouseCoords(e);

			if ((c.x >= box.left) && (c.x <= box.right) &&
			(c.y >= box.top) && (c.y <= box.bottom)){

				input.style.top = c.y - dialogOffset.top + 'px';
				input.style.left = c.x - dialogOffset.left + 'px';
				input.style.display = 'block';
				addClass(self._button, self._settings.hoverClass);

			} else {
				// mouse left the button
				over = false;

				var check = setInterval(function(){
					// if input was just clicked do not hide it
					// to prevent safari bug

					if (self.justClicked){
						return;
					}

					if ( !over ){
						input.style.display = 'none';
					}

					clearInterval(check);

				}, 25);


				removeClass(self._button, self._settings.hoverClass);
			}
		});

	},
	/**
	 * Creates iframe with unique name
	 */
	_createIframe : function(){
		// unique name
		// We cannot use getTime, because it sometimes return
		// same value in safari :(
		var id = getUID();

		// Remove ie6 "This page contains both secure and nonsecure items" prompt
		// http://tinyurl.com/77w9wh
		var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
		iframe.id = id;
		iframe.style.display = 'none';
		d.body.appendChild(iframe);
		return iframe;
	},
	/**
	 * Upload file without refreshing the page
	 */
	submit : function(){
		var self = this, settings = this._settings;

		if (this._input.value === ''){
			// there is no file
			return;
		}

		// get filename from input
		var file = fileFromPath(this._input.value);

		// execute user event
		if (! (settings.onSubmit.call(this, file, getExt(file)) == false)) {
			// Create new iframe for this submission
			var iframe = this._createIframe();

			// Do not submit if user function returns false
			var form = this._createForm(iframe);
			form.appendChild(this._input);

			// A pretty little hack to make uploads not hang in Safari. Just call this
			// immediately before the upload is submitted. This does an Ajax call to
			// the server, which returns an empty document with the "Connection: close"
			// header, telling Safari to close the active connection.
			// http://blog.airbladesoftware.com/2007/8/17/note-to-self-prevent-uploads-hanging-in-safari
			if (settings.closeConnection && /AppleWebKit|MSIE/.test(navigator.userAgent)){
				var xhr = getXhr();
				// Open synhronous connection
				xhr.open('GET', settings.closeConnection, false);
				xhr.send('');
			}

			form.submit();

			d.body.removeChild(form);
			form = null;
			this._input = null;

			// create new input
			this._createInput();

			var toDeleteFlag = false;

			addEvent(iframe, 'load', function(e){

				if (// For Safari
					iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
					// For FF, IE
					iframe.src == "javascript:'<html></html>';"){

					// First time around, do not delete.
					if( toDeleteFlag ){
						// Fix busy state in FF3
						setTimeout( function() {
							d.body.removeChild(iframe);
						}, 0);
					}
					return;
				}

				var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;

				// fixing Opera 9.26
				if (doc.readyState && doc.readyState != 'complete'){
					// Opera fires load event multiple times
					// Even when the DOM is not ready yet
					// this fix should not affect other browsers
					return;
				}

				// fixing Opera 9.64
				if (doc.body && doc.body.innerHTML == "false"){
					// In Opera 9.64 event was fired second time
					// when body.innerHTML changed from false
					// to server response approx. after 1 sec
					return;
				}

				var response;

				if (doc.XMLDocument){
					// response is a xml document IE property
					response = doc.XMLDocument;
				} else if (doc.body){
					// response is html document or plain text
					response = doc.body.innerHTML;
					if (settings.responseType && settings.responseType.toLowerCase() == 'json'){
						// If the document was sent as 'application/javascript' or
						// 'text/javascript', then the browser wraps the text in a <pre>
						// tag and performs html encoding on the contents.  In this case,
						// we need to pull the original text content from the text node's
						// nodeValue property to retrieve the unmangled content.
						// Note that IE6 only understands text/html
						if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE'){
							response = doc.body.firstChild.firstChild.nodeValue;
						}
						if (response) {
							response = window["eval"]("(" + response + ")");
						} else {
							response = {};
						}
					}
				} else {
					// response is a xml document
					response = doc;
				}

				settings.onComplete.call(self, file, response);

				// Reload blank page, so that reloading main page
				// does not re-submit the post. Also, remember to
				// delete the frame
				toDeleteFlag = true;

				// Fix IE mixed content issue
				iframe.src = "javascript:'<html></html>';";
			});

		} else {
			// clear input to allow user to select same file
			// Doesn't work in IE6
			// this._input.value = '';
			d.body.removeChild(this._input);
			this._input = null;

			// create new input
			this._createInput();
		}
	},
	/**
	 * Creates form, that will be submitted to iframe
	 */
	_createForm : function(iframe){
		var settings = this._settings;

		// method, enctype must be specified here
		// because changing this attr on the fly is not allowed in IE 6/7
		var form = toElement('<form method="post" enctype="multipart/form-data"></form>');
		form.style.display = 'none';
		form.action = settings.action;
		form.target = iframe.name;
		d.body.appendChild(form);

		// Create hidden input element for each data key
		for (var prop in settings.data){
			var el = d.createElement("input");
			el.type = 'hidden';
			el.name = prop;
			el.value = settings.data[prop];
			form.appendChild(el);
		}
		return form;
	}
};
})();

// Suffusion Additions Begin -->

$j = jQuery.noConflict();

$j(document).ready(function() {
	var selected_category = Suffusion_Admin_JS.category;
	var $tabs = $j("#suf-options").tabs({
		fx: {
			opacity: "toggle",
			duration: "fast"
		}
	});
	$tabs.tabs('option', 'active', '#' + selected_category);

	$j(".suf-tabbed-options .fade").fadeOut(20000);

	$j('div.suf-checklist input[type="checkbox"]').change(function() {
		var thisClass = (this.className);
		thisClass = thisClass.substring(thisClass.indexOf(" ") + 1);
		thisClass = thisClass.substring(21);

		var all_checked = [];
		$j('#' + thisClass + '-chk :checked').each(function() {
			var thisChild = this.name;
			thisChild = thisChild.substring(thisClass.length + 1);
			all_checked.push(thisChild);
		});
		var joined = all_checked.join(',');
		$j('#' + thisClass).val(joined);
	});

	$j('input.suf-multi-select-button').on('click', function() {
		var thisAction = this.className.substring(0, this.className.indexOf(" "));
		var thisName = this.name.substring(0, this.name.indexOf("-"));
		if (thisAction == 'button-all') {
			$j('input[type="checkbox"].suf-options-checkbox-' + thisName).attr('checked', true);
		}
		else if (thisAction == 'button-none') {
			$j('input[type="checkbox"].suf-options-checkbox-' + thisName).attr('checked', false);
		}

		var all_checked = [];
		$j('#' + thisName + '-chk :checked').each(function() {
			var thisChild = this.name;
			thisChild = thisChild.substring(thisName.length + 1);
			all_checked.push(thisChild);
		});
		var joined = all_checked.join(',');
		$j('#' + thisName).val(joined);
	});

	$j('.suf-button-bar').draggable();

	$j('.suf-button-toggler a').on('click', function() {
		var thisClass = this.className;
		thisClass = thisClass.substr(19);
		var dialogClass = '.suf-button-bar-' + thisClass;
		$j(dialogClass).slideToggle();
		return false;
	});

	$j('.suf-button-bar a').click(function() {
		var thisParent = $j(this).parent().parent();
		thisParent.slideToggle();
		return false;
	});

	//AJAX Upload
	$j('.image_upload_button').on('click', function() {
		var clickedObject = $j(this);
		var thisID = $j(this).attr('id');

		new AjaxUpload(thisID, {
			action: ajaxurl,
			name: thisID,
			debug: true,
			data: {
				action: "suffusion_admin_upload_file",
				type: "upload",
				data: thisID
			},
			autoSubmit: true,
			responseType: false,
			onSubmit: function(file, extension) {
				clickedObject.text('Uploading ...');
				this.disable();
			},
			onComplete: function(file, response) {
				clickedObject.text('Upload Image');
				this.enable(); // enable upload button

				// If there was an error
				if (response.search('Upload Error') > -1) {
					var buildReturn = '<span class="upload-error">' + response + '</span>';
					$j(".upload-error").remove();
					clickedObject.parent().after(buildReturn);
				}
				else {
					thisID = thisID.substring(7);
					var buildReturn = '<div id="suffusion-preview-' + thisID + '"><img class="hidden suffusion-option-image" id="image_' + thisID + '" src="' + response + '" alt="" /></div>';
					$j(".upload-error").remove();
					$j("#image_" + thisID).remove();
					clickedObject.parent().after(buildReturn);
					$j('img#image_' + thisID).fadeIn();
					clickedObject.next('span').fadeIn();
					var text_field = $j("#" + thisID);
					text_field.val(response);
					clickedObject.fadeOut();
					text_field.change();
				}
			}
		});
	});

	//AJAX Remove (clear option value)
	$j('.image_reset_button').on('click', function() {
		var clickedObject = $j(this);
		var thisID = $j(this).attr('id');
		var image_Id = thisID.substring(6);

		var data = {
			action: 'suffusion_admin_upload_file',
			type: 'image_reset',
			data: thisID
		};

		$j.post(ajaxurl, data, function(response) {
			//var image_to_remove = $j('#image_' + image_Id);
			var image_to_remove = $j('.suf-tabbed-options').find("#suffusion-preview-" + image_Id);
			var button_to_hide = $j('.suf-tabbed-options').find('#reset_' + image_Id);
			var button_to_show = $j('.suf-tabbed-options').find('#upload_' + image_Id);
			image_to_remove.fadeOut(500, function() {
				clickedObject.remove();
			});
			button_to_hide.fadeOut();
			button_to_show.fadeIn();
			var text_field = $j('.suf-tabbed-options').find("#" + image_Id);
			text_field.val('');
			text_field.change();
		});

		return false;
	});

	$j('.suf-background-options input[type="text"], .suf-background-options select').change(function(event) {
		var thisName = event.currentTarget.id;
		thisName = thisName.substring(0, thisName.indexOf('-'));
		$j("#" + thisName).val('color=' + $j("#" + thisName + "-bgcolor").val() + ';' +
				'colortype=' + $j("input[name=" + thisName + "-colortype]:checked").val() + ';' +
				'image=' + $j("#" + thisName + "-bgimg").val() + ';' +
				'position=' + $j("#" + thisName + "-position").val() + ';' +
				'repeat=' + $j("#" + thisName + "-repeat").val() + ';' +
				'trans=' + $j("#" + thisName + "-trans").val() + ';'
		);
	});

	$j('.suf-background-options input[type="radio"]').change(function(event) {
		var thisName = event.currentTarget.name;
		thisName = thisName.substring(0, thisName.indexOf('-'));
		$j("#" + thisName).val('color=' + $j("#" + thisName + "-bgcolor").val() + ';' +
				'colortype=' + $j("input[name=" + thisName + "-colortype]:checked").val() + ';' +
				'image=' + $j("#" + thisName + "-bgimg").val() + ';' +
				'position=' + $j("#" + thisName + "-position").val() + ';' +
				'repeat=' + $j("#" + thisName + "-repeat").val() + ';' +
				'trans=' + $j("#" + thisName + "-trans").val() + ';'
		);
	});

	$j('.suf-font-options input[type="text"], .suf-font-options select').change(function(event) {
		var thisName = event.currentTarget.id;
		thisName = thisName.substring(0, thisName.indexOf('-'));
		var val = '';
		if ($j("#" + thisName + "-color").is('*')) { val += 'color=' + $j("#" + thisName + "-color").val() + ';'; }
		if ($j("#" + thisName + "-font-face").is('*')) { val += 'font-face=' + $j("#" + thisName + "-font-face").val() + ';'; }
		if ($j("#" + thisName + "-font-weight").is('*')) { val += 'font-weight=' + $j("#" + thisName + "-font-weight").val() + ';'; }
		if ($j("#" + thisName + "-font-style").is('*')) { val += 'font-style=' + $j("#" + thisName + "-font-style").val() + ';'; }
		if ($j("#" + thisName + "-font-variant").is('*')) { val += 'font-variant=' + $j("#" + thisName + "-font-variant").val() + ';'; }
		if ($j("#" + thisName + "-font-size").is('*')) { val += 'font-size=' + $j("#" + thisName + "-font-size").val() + ';'; }
		if ($j("#" + thisName + "-font-size-type").is('*')) { val += 'font-size-type=' + $j("#" + thisName + "-font-size-type").val() + ';'; }

		$j("#" + thisName).val(val);
	});

	$j('.suf-border-options input[type="text"], .suf-border-options select').change(function(event) {
		var thisId = event.currentTarget.id;
		thisId = thisId.substring(0, thisId.indexOf('-'));
		var edges = new Array('top', 'right', 'bottom', 'left');
		var border = '';
		for (var x in edges) {
			var edge = edges[x];
			var thisName = thisId + '-' + edge;
			border += edge + '::';
			border += 'color=' + $j("#" + thisName + "-color").val() + ';' +
					'colortype=' + $j("input[name=" + thisName + "-colortype]:checked").val() + ';' +
					'style=' + $j("#" + thisName + "-style").val() + ';' +
					'border-width=' + $j("#" + thisName + "-border-width").val() + ';' +
					'border-width-type=' + $j("#" + thisName + "-border-width-type").val() + ';';
			border += '||';
		}
		$j('#' + thisId).val(border);
	});

	$j('.suf-border-options input[type="radio"]').change(function(event) {
		var thisId = event.currentTarget.name;
		thisId = thisId.substring(0, thisId.indexOf('-'));
		var edges = new Array('top', 'right', 'bottom', 'left');
		var border = '';
		for (var x in edges) {
			var edge = edges[x];
			var thisName = thisId + '-' + edge;
			border += edge + '::';
			border += 'color=' + $j("#" + thisName + "-color").val() + ';' +
					'colortype=' + $j("input[name=" + thisName + "-colortype]:checked").val() + ';' +
					'style=' + $j("#" + thisName + "-style").val() + ';' +
					'border-width=' + $j("#" + thisName + "-border-width").val() + ';' +
					'border-width-type=' + $j("#" + thisName + "-border-width-type").val() + ';';
			border += '||';
		}
		$j('#' + thisId).val(border);
	});

	$j('.suf-associative-array-options input[type="text"], .suf-associative-array-options select, .suf-associative-array-options input[type="checkbox"]').change(function(event) {
		var thisId = event.currentTarget.name;
		thisId = thisId.substring(0, thisId.indexOf('-'));
		var rows = $j('#' + thisId + '-rows').val();
		var columns = $j('#' + thisId + '-columns').val();
		rows = rows.split(',');
		columns = columns.split(',');
		var assoc_array = '';
		for (var i=0; i<rows.length; i++) {
			var row_major = '';
			for (var j=0; j<columns.length; j++) {
				if ($j('#' + thisId + '-' + rows[i] + '-' + columns[j]).length) {
					row_major += columns[j] + '=' + $j('#' + thisId + '-' + rows[i] + '-' + columns[j]).val() + ';';
				}
				else {
					row_major += columns[j] + '=';
					$j('input[name^=' + thisId + '-' + rows[i] + '-' + columns[j] +']').each(function() {
						if ($j(this).is(':checked')) {
							var checked_item = $j(this).attr('name').substring((thisId + '-' + rows[i] + '-' + columns[j]).length);
							row_major += checked_item.substring(1, checked_item.length - 1) + ',';
						}
					});
					if (row_major.lastIndexOf(',') == row_major.length - 1) {
						row_major = row_major.substr(0, row_major.length - 1);
					}
					row_major += ';';
				}
			}
			var last_semi = row_major.lastIndexOf(';');
			if (last_semi == row_major.length - 1) {
				row_major = row_major.substr(0, last_semi);
			}
			assoc_array += rows[i] + '::' + row_major + '||';
		}
		var last_pipe = assoc_array.lastIndexOf('||');
		if (last_pipe == assoc_array.length - 2) {
			assoc_array = assoc_array.substr(0, last_pipe);
		}
		$j('#' + thisId).val(assoc_array);
	});

	$j(".suffusion-options-form :input[type='submit']").click(function() {
		//This is needed, otherwise the event handler cannot figure out which button was clicked.
		suffusion_submit_button = $j(this);
	});

//			$j("#suffusion-options-form h3").each(function() {
	$j("#suf-options h3").each(function() {
		var text = $j(this).text();
		if (text == '') {
			$j(this).remove();
		}
	});

	$j('.suffusion-options-form').submit(function(event) {
		var field = suffusion_submit_button;
		var value = field.val();

		if (value == 'Migrate from 3.0.2 or lower') {
			if (!confirm("If you are NOT migrating from 3.0.2 or lower, this can wipe out all your settings! Are you sure you want to do this? This process is not reversible.")) {
				return false;
			}
		}
		else if (value == 'Migrate from 3.4.3 or lower') {
			if (!confirm("If you are NOT migrating from 3.4.3 or lower, this can wipe out all your settings! Are you sure you want to do this? This process is not reversible.")) {
				return false;
			}
		}
		else if (value.substring(0, 5) == 'Reset') {
			if (!confirm("This will reset your configurations to the original values!!! Are you sure you want to continue? This is not reversible!")) {
				return false;
			}
		}
		else if (value.substring(0, 6) == 'Delete') {
			if (!confirm("This will delete all your Suffusion configuration options!!! Are you sure you want to continue? This is not reversible!")) {
				return false;
			}
		}
	});

	//$j('#suffusion-options-form').ajaxForm();

	$j('.color').removeClass('text');
	$j('.slidertext').removeClass('text');

	$j("#quick-search").each(function() {
		$j(this).autocomplete({
			source: function(request, response) {
				$j.ajax({
					url: ajaxurl,
					dataType: "json",
					data: {
						action: "suffusion_quick_search",
						term: request.term,
						maxRows: 12
					},
					success: function(data) {
						response(data);
					}
				});
			},
			minLength: 4,
			select: function(event, ui) {
				$j('#search-match').html("<a href='" + ui.item.url + "'>" + ui.item.label + "</a><br />" + ui.item.description);
			}
		});
	});

	$j('#suf-options').fadeIn();
});

