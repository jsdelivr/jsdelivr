/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz? and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFObject v2.2 <http://code.google.com/p/swfobject/> 
 *	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
 */

/* ******************* */
/* Constructor & Init  */
/* ******************* */
var SWFUpload;
var swfobject;

if (SWFUpload == undefined) {
	SWFUpload = function (settings) {
		this.initSWFUpload(settings);
	};
}

SWFUpload.prototype.initSWFUpload = function (userSettings) {
	try {
		this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
		this.settings = {};
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;


		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings.  Load the Flash movie.
		this.initSettings(userSettings);
		this.loadSupport();
		if (this.swfuploadPreload()) {
			this.loadFlash();
		}

		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.5.0 2010-01-15 Beta 2";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED            : -100,
	FILE_EXCEEDS_SIZE_LIMIT         : -110,
	ZERO_BYTE_FILE                  : -120,
	INVALID_FILETYPE                : -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR                      : -200,
	MISSING_UPLOAD_URL              : -210,
	IO_ERROR                        : -220,
	SECURITY_ERROR                  : -230,
	UPLOAD_LIMIT_EXCEEDED           : -240,
	UPLOAD_FAILED                   : -250,
	SPECIFIED_FILE_ID_NOT_FOUND     : -260,
	FILE_VALIDATION_FAILED          : -270,
	FILE_CANCELLED                  : -280,
	UPLOAD_STOPPED                  : -290,
	RESIZE                          : -300
};
SWFUpload.FILE_STATUS = {
	QUEUED       : -1,
	IN_PROGRESS  : -2,
	ERROR        : -3,
	COMPLETE     : -4,
	CANCELLED    : -5
};
SWFUpload.UPLOAD_TYPE = {
	NORMAL       : -1,
	RESIZED      : -2
};

SWFUpload.BUTTON_ACTION = {
	SELECT_FILE             : -100,
	SELECT_FILES            : -110,
	START_UPLOAD            : -120,
	JAVASCRIPT              : -130,	// DEPRECATED
	NONE                    : -130
};
SWFUpload.CURSOR = {
	ARROW : -1,
	HAND  : -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW       : "transparent",
	TRANSPARENT  : "transparent",
	OPAQUE       : "opaque"
};

SWFUpload.RESIZE_ENCODING = {
	JPEG  : -1,
	PNG   : -2
};

// Private: takes a URL, determines if it is relative and converts to an absolute URL
// using the current site. Only processes the URL if it can, otherwise returns the URL untouched
SWFUpload.completeURL = function (url) {
	try {
		var path = "", indexSlash = -1;
		if (typeof(url) !== "string" || url.match(/^https?:\/\//i) || url.match(/^\//) || url === "") {
			return url;
		}
		
		indexSlash = window.location.pathname.lastIndexOf("/");
		if (indexSlash <= 0) {
			path = "/";
		} else {
			path = window.location.pathname.substr(0, indexSlash) + "/";
		}
		
		return path + url;
	} catch (ex) {
		return url;
	}
};

// Public: assign a new function to onload to use swfobject's domLoad functionality
SWFUpload.onload = function () {};


/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function (userSettings) {

	this.ensureDefault = function (settingName, defaultValue) {
		var setting = userSettings[settingName];
		if (setting != undefined) {
			this.settings[settingName] = setting;
		} else {
			this.settings[settingName] = defaultValue;
		}
	};
	
	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("preserve_relative_urls", false);
	this.ensureDefault("file_post_name", userSettings.uploadFileName);
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	this.ensureDefault("http_success", []);
	this.ensureDefault("assume_success_timeout", 0);
	
	// File Settings
	this.ensureDefault("file_types", userSettings.file_types);
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("flash9_url", "swfupload_fp9.swf");
	this.ensureDefault("prevent_swf_caching", true);
	
	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", "");
	this.ensureDefault("button_placeholder", null);
	this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
	this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
	
	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API

	// Option Setting
	this.ensureDefault("fileSelectAutoUpload", userSettings.fileSelectAutoUpload);

	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_preload_handler", null);
	this.ensureDefault("swfupload_load_failed_handler", null);
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);
	
	this.ensureDefault("upload_resize_start_handler", null);
	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);
	
	this.ensureDefault("mouse_click_handler", null);
	this.ensureDefault("mouse_out_handler", null);
	this.ensureDefault("mouse_over_handler", null);
	
	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	// Update the flash url if needed
	if (!!this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
		this.settings.flash9_url = this.settings.flash9_url + (this.settings.flash9_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
	}
	
	if (!this.settings.preserve_relative_urls) {
		this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
		this.settings.button_image_url = SWFUpload.completeURL(this.settings.button_image_url);
	}

	delete this.ensureDefault;
};

// Initializes the supported functionality based the Flash Player version, state, and event that occur during initialization
SWFUpload.prototype.loadSupport = function () {
	this.support = {
		loading : swfobject.hasFlashPlayerVersion("9.0.28"),
		imageResize : swfobject.hasFlashPlayerVersion("10.0.0")
	};
	
};

// Private: loadFlash replaces the button_placeholder element with the flash movie.
SWFUpload.prototype.loadFlash = function () {
	var targetElement, tempParent, wrapperType, flashHTML, els;

	if (!this.support.loading) {
		this.queueEvent("swfupload_load_failed_handler", ["Flash Player doesn't support SWFUpload"]);
		return;
	}
	
	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		this.support.loading = false;
		this.queueEvent("swfupload_load_failed_handler", ["Element ID already in use"]);
		return;
	}

	// Get the element where we will be placing the flash movie
	targetElement = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;

	if (targetElement == undefined) {
		this.support.loading = false;
		this.queueEvent("swfupload_load_failed_handler", ["button place holder not found"]);
		return;
	}

	wrapperType = (targetElement.currentStyle && targetElement.currentStyle["display"] || window.getComputedStyle && document.defaultView.getComputedStyle(targetElement, null).getPropertyValue("display")) !== "block" ? "span" : "div";
	
	// Append the container and load the flash
	tempParent = document.createElement(wrapperType);

	flashHTML = this.getFlashHTML();

	try {
		tempParent.innerHTML = flashHTML;	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	} catch (ex) {
		this.support.loading = false;
		this.queueEvent("swfupload_load_failed_handler", ["Exception loading Flash HTML into placeholder"]);
		return;
	}

	// Try to get the movie element immediately
	els = tempParent.getElementsByTagName("object");
	if (!els || els.length > 1 || els.length === 0) {
		this.support.loading = false;
		this.queueEvent("swfupload_load_failed_handler", ["Unable to find movie after adding to DOM"]);
		return;
	} else if (els.length === 1) {
		this.movieElement = els[0];
	}
	
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function (flashVersion) {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
				'<param name="wmode" value="', this.settings.button_window_mode, '" />',
				'<param name="movie" value="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" />',
				'<param name="quality" value="high" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function () {
	// Build a string from the post param object
	var httpSuccessString, paramString;
	
	paramString = this.buildParamString();
	httpSuccessString = this.settings.http_success.join(",");
	
	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
			"&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			"&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
			"&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
			"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
			"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
			"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			"&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
			"&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
			"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
			"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
			"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
			"&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)
		].join("");
};

// Public: get retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function () {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}
	
	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function () {
	var name, postParams, paramStringPairs = [];
	
	postParams = this.settings.post_params; 

	if (typeof(postParams) === "object") {
		for (name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
// Credits: Major improvements provided by steffen
SWFUpload.prototype.destroy = function () {
	var movieElement;
	
	try {
		// Make sure Flash is done before we try to remove it
		this.cancelUpload(null, false);
		
		movieElement = this.cleanUp();

		// Remove the SWFUpload DOM nodes
		if (movieElement) {
			// Remove the Movie Element from the page
			try {
				movieElement.parentNode.removeChild(movieElement);
			} catch (ex) {}
		}

		// Remove IE form fix reference
		window[this.movieName] = null;

		// Destroy other references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		this.movieElement = null;
		this.settings = null;
		this.customSettings = null;
		this.eventQueue = null;
		this.movieName = null;
		
		
		return true;
	} catch (ex2) {
		return false;
	}
};


// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function () {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:               ", this.settings.upload_url, "\n",
			"\t", "flash_url:                ", this.settings.flash_url, "\n",
			"\t", "flash9_url:                ", this.settings.flash9_url, "\n",
			"\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
			"\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n",
			"\t", "http_success:             ", this.settings.http_success.join(", "), "\n",
			"\t", "assume_success_timeout:   ", this.settings.assume_success_timeout, "\n",
			"\t", "file_post_name:           ", this.settings.file_post_name, "\n",
			"\t", "post_params:              ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:               ", this.settings.file_types, "\n",
			"\t", "file_types_description:   ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
			"\t", "debug:                    ", this.settings.debug.toString(), "\n",

			"\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

			"\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
			"\t", "button_placeholder:       ", (this.settings.button_placeholder ? "Set" : "Not Set"), "\n",
			"\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
			"\t", "button_width:             ", this.settings.button_width.toString(), "\n",
			"\t", "button_height:            ", this.settings.button_height.toString(), "\n",
			"\t", "button_text:              ", this.settings.button_text.toString(), "\n",
			"\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
			"\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
			"\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
			"\t", "button_action:            ", this.settings.button_action.toString(), "\n",
			"\t", "button_cursor:            ", this.settings.button_cursor.toString(), "\n",
			"\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

			"\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_preload_handler assigned:  ", (typeof this.settings.swfupload_preload_handler === "function").toString(), "\n",
			"\t", "swfupload_load_failed_handler assigned:  ", (typeof this.settings.swfupload_load_failed_handler === "function").toString(), "\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
			"\t", "mouse_click_handler assigned:       ", (typeof this.settings.mouse_click_handler === "function").toString(), "\n",
			"\t", "mouse_over_handler assigned:        ", (typeof this.settings.mouse_over_handler === "function").toString(), "\n",
			"\t", "mouse_out_handler assigned:         ", (typeof this.settings.mouse_out_handler === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
			"\t", "upload_resize_start_handler assigned:      ", (typeof this.settings.upload_resize_start_handler === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n",

			"Support:\n",
			"\t", "Load:                     ", (this.support.loading ? "Yes" : "No"), "\n",
			"\t", "Image Resize:             ", (this.support.imageResize ? "Yes" : "No"), "\n"

		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function (name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
	}

    return "";
};



// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function (functionName, argumentArray) {
	var movieElement, returnValue, returnString;
	
	argumentArray = argumentArray || [];
	movieElement = this.getMovieElement();

	// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
	try {
		if (movieElement != undefined) {
			returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
			returnValue = eval(returnString);
		} else {
			this.debug("Can't call flash because the movie wasn't found.");
		}
	} catch (ex) {
		this.debug("Exception calling flash function '" + functionName + "': " + ex.message);
	}
	
	// Unescape file post param values
	if (returnValue != undefined && typeof returnValue.post === "object") {
		returnValue = this.unescapeFilePostParams(returnValue);
	}

	return returnValue;
};

/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// WARNING: this function does not work in Flash Player 10
// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// WARNING: this function does not work in Flash Player 10
// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function () {
	this.callFlash("SelectFiles");
};


// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startUpload = function (fileID) {
	//trace(this.settings.fileSelectAutoUpload);
	//trace(this.allowUpload);
    if(this.settings.fileSelectAutoUpload || this.settings.allowUpload == true) {
        this.callFlash("StartUpload", [fileID]);
    }
};

// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startResizedUpload = function (fileID, width, height, encoding, quality, allowEnlarging) {
	this.callFlash("StartUpload", [fileID, { "width": width, "height" : height, "encoding" : encoding, "quality" : quality, "allowEnlarging" : allowEnlarging }]);
};

// Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
// If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
// If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
SWFUpload.prototype.cancelUpload = function (fileID, triggerErrorEvent) {
	if (triggerErrorEvent !== false) {
		triggerErrorEvent = true;
	}
	this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
	this.callFlash("StopUpload");
};


// Public: requeueUpload requeues any file. If the file is requeued or already queued true is returned.
// If the file is not found or is currently uploading false is returned.  Requeuing a file bypasses the
// file size, queue size, upload limit and other queue checks.  Certain files can't be requeued (e.g, invalid or zero bytes files).
SWFUpload.prototype.requeueUpload = function (indexOrFileID) {
	return this.callFlash("RequeueUpload", [indexOrFileID]);
};


/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function () {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function (statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: getFileFromQueue retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getQueueFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByQueueIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};


// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function (fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function (fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function (url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function (paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function (name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function (name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function (types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function (fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function (fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function (fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function (filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function (useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function (requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setHTTPSuccess = function (http_status_codes) {
	if (typeof http_status_codes === "string") {
		http_status_codes = http_status_codes.replace(" ", "").split(",");
	}
	
	this.settings.http_success = http_status_codes;
	this.callFlash("SetHTTPSuccess", [http_status_codes]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setAssumeSuccessTimeout = function (timeout_seconds) {
	this.settings.assume_success_timeout = timeout_seconds;
	this.callFlash("SetAssumeSuccessTimeout", [timeout_seconds]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function (debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function (buttonImageURL) {
	if (buttonImageURL == undefined) {
		buttonImageURL = "";
	}
	
	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function (width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;
	
	var movie = this.getMovieElement();
	if (movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}
	
	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function (html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text overlay
SWFUpload.prototype.setButtonTextPadding = function (left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function (css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function (isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function (buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

// Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
SWFUpload.prototype.setButtonCursor = function (cursor) {
	this.settings.button_cursor = cursor;
	this.callFlash("SetButtonCursor", [cursor]);
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function (handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop
	var self = this;
	
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	
	if (typeof this.settings[handlerName] === "function") {
		// Queue the event
		this.eventQueue.push(function () {
			this.settings[handlerName].apply(this, argumentArray);
		});
		
		// Execute the next queued event
		setTimeout(function () {
			self.executeNextEvent();
		}, 0);
		
	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function () {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var  f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}

};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function (file) {
	var reg = /[$]([0-9a-f]{4})/i, unescapedPost = {}, uk, k, match;

	if (file != undefined) {
		for (k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

// Private: This event is called by SWFUpload Init after we've determined what the user's Flash Player supports.
// Use the swfupload_preload_handler event setting to execute custom code when SWFUpload has loaded.
// Return false to prevent SWFUpload from loading and allow your script to do something else if your required feature is
// not supported
SWFUpload.prototype.swfuploadPreload = function () {
	var returnValue;
	if (typeof this.settings.swfupload_preload_handler === "function") {
		returnValue = this.settings.swfupload_preload_handler.call(this);
	} else if (this.settings.swfupload_preload_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	return !!returnValue;
}

// Private: This event is called by Flash when it has finished loading. Don't modify this.
// Use the swfupload_loaded_handler event setting to execute custom code when SWFUpload has loaded.
SWFUpload.prototype.flashReady = function () {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = 	this.cleanUp();

	if (!movieElement) {
		this.debug("Flash called back ready but the flash movie can't be found.");
		return;
	}

	this.queueEvent("swfupload_loaded_handler");
};

// Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
// This function is called by Flash each time the ExternalInterface functions are created.
SWFUpload.prototype.cleanUp = function () {
	var key, movieElement = this.getMovieElement();
	
	// Pro-actively unhook all the Flash functions
	try {
		if (movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
			this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
			for (key in movieElement) {
				try {
					if (typeof(movieElement[key]) === "function") {
						movieElement[key] = null;
					}
				} catch (ex) {
				}
			}
		}
	} catch (ex1) {
	
	}

	// Fix Flashes own cleanup code so if the SWF Movie was removed from the page
	// it doesn't display errors.
	window["__flash__removeCallback"] = function (instance, name) {
		try {
			if (instance) {
				instance[name] = null;
			}
		} catch (flashEx) {
		
		}
	};
	
	return movieElement;
};

/* When the button_action is set to None this event gets fired and executes the mouse_click_handler */
SWFUpload.prototype.mouseClick = function () {
	this.queueEvent("mouse_click_handler");
};
SWFUpload.prototype.mouseOver = function () {
	this.queueEvent("mouse_over_handler");
};
SWFUpload.prototype.mouseOut = function () {
	this.queueEvent("mouse_out_handler");
};

/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function () {
	this.queueEvent("file_dialog_start_handler");
};


/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};


/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function (numFilesSelected, numFilesQueued, numFilesInQueue) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, numFilesInQueue]);
};

SWFUpload.prototype.uploadResizeStart = function (file, resizeSettings) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_resize_start_handler", [file, resizeSettings.width, resizeSettings.height, resizeSettings.encoding, resizeSettings.quality]);
};

SWFUpload.prototype.uploadStart = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function (file) {
	var returnValue;
	if (typeof this.settings.upload_start_handler === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	returnValue = !!returnValue;
	
	this.callFlash("ReturnUploadStart", [returnValue]);
};



SWFUpload.prototype.uploadProgress = function (file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function (file, serverData, responseReceived) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData, responseReceived]);
};

SWFUpload.prototype.uploadComplete = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function (message) {
	this.queueEvent("debug_handler", message);
};


/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.

	The console is automatically scrolled as messages appear.
	
	If you are using your own debug handler or when you deploy to production and
	have debug disabled you can remove these functions to reduce the file size
	and complexity.
********************************** */
   
// Private: debugMessage is the default debug_handler.  If you want to print debug messages
// call the debug() function.  When overriding the function your own function should
// check to see if the debug setting is true before outputting debug information.
SWFUpload.prototype.debugMessage = function (message) {
	var exceptionMessage, exceptionValues, key;

	if (this.settings.debug) {
		exceptionValues = [];

		// Check for an exception object and print it nicely
		if (typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
			for (key in message) {
				if (message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if (!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "monospace";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};


/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
swfobject = function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
swfobject.addDomLoadEvent(function () {
	if (typeof(SWFUpload.onload) === "function") {
		SWFUpload.onload.call(window);
	}
});


// ---------------------------------------------------------------------------------------- swfobject end

/**
 * AXUpload5
 * @class AXUpload5
 * @extends AXJ
 * @version v1.32
 * @author tom@axisj.com
 * @logs
 "2013-10-02 오후 2:19:36 - 시작 tom",
 "2013-10-12 오전 11:13:06 - 업로드 서버오류 예외 처리 tom",
 "2013-10-29 오후 3:26:33 - 최지연 : 기타 버그 패치",
 "2013-10-30 오후 3:38:05 - config.uploadPars, config.deletePars 초기 설정값 패치 by tom",
 "2013-12-11 오후 5:15:51 - tom&root setUploadedList, setUpoadeFile 버그패치",
 "2013-12-17 오전 11:24:38 - tom : AXUploadPreview css 적용",
 "2014-02-11 오후 3:29:51 - tom : deleteFile 개선, 서버 JSON에 error 가 없으면 정상 처리 되도록 변경",
 "2014-02-23 오후 7:39:11 - tom : this.uploadedList 초기화 버그 픽스",
 "2014-02-23 오후 8:44:07 - <base> attr 인식 처리 구문 추가",
 "2014-04-10 - tom : 설정에 선언된 파일타입 체크하여 파일 셀렉트와 드랍 방지 처리 구문 추가",
 "2014-04-10 - tom : fileSelectAutoUpload 옵션 flash 모드에서 작동 하도록 픽스",
 "2014-05-15 - tom : 파일선택 갯수 선택오류 버그 픽스 / fileSelectAutoUpload 버그 픽스",
 "2014-05-23 - tom : file mimeType 이 없는 경우 업로드 지원 구문 추가"
 "2014-06-04 tom : in single upload, reupload bugfix"
 "2014-06-14 tom : extend config option flash_file_types, flash_file_types_description"
 "2014-06-17 tom : [bugfix] file_types undefined"
 "2014-06-26 tom : [bugfix] http error exception when delete runs "

 * @description
 *
 ```js
 var myUpload = new AXUpload5();
 myUpload.setConfig(classConfig:JSObject);
 ```
 *
 */

var AXUpload5 = Class.create(AXJ, {
	initialize: function(AXJ_super){
		AXJ_super();
		this.uploadedList = [];
		this.uploadingObj = null;
		this.queue = [];
		this.queueLive = false;
		this.isSingleUpload = false;
		this.config.uploadFileName = "fileData";
		this.config.file_types = "*.*";
		this.config.fileSelectAutoUpload = true;
		this.supportHtml5 = false;
		if (window.File && window.FileReader && window.FileList && window.Blob) this.supportHtml5 = true;
		if(!AXConfig.AXUpload5){
			AXConfig.AXUpload5 = {buttonTxt:"Upload files"};
		}
		this.config.buttonTxt = AXConfig.AXUpload5.buttonTxt;
		this.config.fileKeys = { // 서버에서 리턴하는 json key 정의 (id 는 예약어 입니다.)
			name:"name",
			type:"type",
			saveName:"saveName",
			fileSize:"fileSize",
			uploadedPath:"uploadedPath",
			thumbPath:"thumbPath"
		}
		this.config.flash_url = "/_AXJ/lib/swfupload.swf";
		this.config.flash9_url = "/_AXJ/lib/swfupload_fp9.swf";
		this.config.uploadPars = {};
		this.config.deletePars = {};
		this.config.queueBoxAppendType = "prepend";
	},
	init: function(reset){
		var cfg = this.config;
		if(reset == undefined){
			if(!this.supportHtml5){
				if(cfg.onError) cfg.onError("html5Support");
				this.swfinit(reset);
				return;
			}
		}else{
			if(!this.supportHtml5){
				return;
			}
		}
		
		var baseUrl = axdom("base").attr("href");
		if(axf.isEmpty(baseUrl)) baseUrl = "";
		if(cfg.uploadUrl.left(1) == "/"){
			cfg.uploadUrl = baseUrl + cfg.uploadUrl;
		}
		if(cfg.deleteUrl.left(1) == "/"){
			cfg.deleteUrl = baseUrl + cfg.deleteUrl;
		}
		/* dropBoxID, queueBoxID 자동 생성 */
		if( cfg.dropBoxTarget ){
			if(cfg.dropBoxTarget.id === undefined || cfg.dropBoxTarget.id == ""){
				axdom(cfg.dropBoxTarget).attr("id", cfg.dropBoxTarget.id = cfg.dropBoxID = "AXJUnique_dropBox_"+axf.getUniqueId());
			}else if(axf.isEmpty(cfg.dropBoxID)){
				cfg.dropBoxID = cfg.dropBoxTarget.id;
			}
		}
		if( cfg.queueBoxTarget ){
			if( cfg.queueBoxTarget.id === undefined || cfg.queueBoxTarget.id == "" ){
				axdom(cfg.queueBoxTarget).attr("id", cfg.queueBoxTarget.id = cfg.queueBoxID = "AXJUnique_queueBox_"+axf.getUniqueId());
				alert(cfg.queueBoxID);
			}else if(axf.isEmpty(cfg.queueBoxID)){
				cfg.queueBoxID = cfg.queueBoxTarget.id;
			}
		}
		
		this.target = jQuery("#"+cfg.targetID);
		if(reset == undefined){
			this.target.empty();
			this.uploadedList = [];
		}
		
		var inputFileMultiple = 'multiple="multiple"';
		var inputFileAccept = cfg.file_types;
		if(cfg.isSingleUpload){
			inputFileMultiple = '';
		}
		if(!this.supportHtml5){
			inputFileMultiple = '';
		}
		
		var po = [];
		po.push('<div style="position:relative;">');
		po.push('	<table style="table-layout:fixed;width:100%;"><tbody><tr><td id="'+cfg.targetID+'_AX_selectorTD">');
		po.push('	<input type="file" id="'+cfg.targetID+'_AX_files" '+inputFileMultiple+' accept="'+inputFileAccept+'" style="position:absolute;left:0px;top:0px;margin:0px;padding:0px;-moz-opacity: 0.0;opacity:.00;filter: alpha(opacity=0);" />');
		po.push('	<button type="button" class="AXButton '+cfg.targetButtonClass+'" id="'+cfg.targetID+'_AX_selector"><span class="AXFileSelector">'+(cfg.buttonTxt)+'</span></button>');
		po.push('	</td>');
		
		if(cfg.isSingleUpload){
			po.push('<td>');
			po.push('<div class="AXFileDisplay" id="'+cfg.targetID+'_AX_display">'+AXConfig.AXUpload5.uploadSelectTxt+'</div>');
			po.push('</td>');
		}
		
		po.push('	<tr></tbody></table>');
		po.push('</div>');
		this.target.empty();
		this.target.append(po.join(''));
		
		jQuery('#'+cfg.targetID+'_AX_selectorTD').css({width:jQuery('#'+cfg.targetID+'_AX_selector').outerWidth()+5});
		jQuery('#'+cfg.targetID+'_AX_files').css({width:jQuery('#'+cfg.targetID+'_AX_selector').outerWidth(),height:jQuery('#'+cfg.targetID+'_AX_selector').outerHeight()});
		
		var pauseQueue = this.pauseQueue.bind(this);
		var _this = this;
		jQuery('#'+cfg.targetID+'_AX_selector').click(function(event){

			if(cfg.onbeforeFileSelect){
				if(!cfg.onbeforeFileSelect.call({
					uploadedList:_this.uploadedList,
					uploadMaxFileSize:cfg.uploadMaxFileSize,
					uploadMaxFileCount:cfg.uploadMaxFileCount
				})){
					return false;
				}
			}
			
			if(!cfg.isSingleUpload && cfg.uploadMaxFileCount != 0){
				if(_this.uploadedList.length >= cfg.uploadMaxFileCount){
					cfg.onError("fileCount");
 					return false;
 				}
			}
			
			pauseQueue();
			jQuery('#'+cfg.targetID+'_AX_files').click();
		});
		
		var onFileSelect = this.onFileSelect.bind(this);
		var fileSelector = document.getElementById(cfg.targetID+'_AX_files');
		if(axf.browser.name == "ie" && axf.browser.version < 9){
			
		}else{
			fileSelector.addEventListener('change', onFileSelect, false);
		}

		if(reset == undefined){
			if(cfg.dropBoxID && this.supportHtml5){
				
				// 드랍존 표현구문 ----------------- s
				/*
				var dropZoneMsg = [];
				dropZoneMsg.push("<span class=\"msgText\" id=\""+cfg.dropBoxID+"_msgText\">");
				dropZoneMsg.push(AXConfig.AXUpload5.dropZoneTxt);
				dropZoneMsg.push("</span>");
				jQuery("#"+cfg.dropBoxID).append(dropZoneMsg.join(''));
				*/
				jQuery("#"+cfg.dropBoxID).addClass("allowDrop");
				//jQuery("#"+cfg.dropBoxID).find(".msgText").css({"top":jQuery("#"+cfg.dropBoxID).height()/2-50});
				// 드랍존 표현구문 ----------------- e
				
				var dropZoneBox = [];
				dropZoneBox.push("<div class=\"dropZoneBox\" id=\""+cfg.dropBoxID+"_dropZoneBox\" style=\"border:3px dashed #d7d7d7;display:none;\">");
				dropZoneBox.push("</div>");
				jQuery("#"+cfg.dropBoxID).append(dropZoneBox.join(''));
				
				// ---------------- 옵션사항 s
				/*
				jQuery("#"+cfg.dropBoxID+"_dropZoneBox").show();
				jQuery("#"+cfg.dropBoxID+"_dropZoneBox").css({height:jQuery("#"+cfg.dropBoxID).innerHeight()-6, width:jQuery("#"+cfg.dropBoxID).innerWidth()-6});
				setTimeout(function(){
					jQuery("#"+cfg.dropBoxID+"_dropZoneBox").fadeOut();
				}, 2000);
				*/
				// ---------------- 옵션사항 e
				
				var onFileDragOver = this.onFileDragOver.bind(this);
				var onFileDrop = this.onFileDrop.bind(this);
				var dragZone = document.getElementById(cfg.dropBoxID);
				dragZone.addEventListener('dragover', function(evt){onFileDragOver(evt)}, false);
				
				var dropZone = document.getElementById(cfg.dropBoxID+"_dropZoneBox");
				dropZone.addEventListener('drop', function(evt){
					
					if(cfg.onbeforeFileSelect){
						if(!cfg.onbeforeFileSelect.call({
							uploadedList:_this.uploadedList,
							uploadMaxFileSize:cfg.uploadMaxFileSize,
							uploadMaxFileCount:cfg.uploadMaxFileCount
						})){
							evt.stopPropagation();
							evt.preventDefault();
							jQuery("#"+cfg.dropBoxID).removeClass("onDrop");
							jQuery("#"+cfg.dropBoxID+"_dropZoneBox").hide();
							return false;
						}
					}
					
					if(!cfg.isSingleUpload && cfg.uploadMaxFileCount != 0){
						if(_this.uploadedList.length >= cfg.uploadMaxFileCount){
							evt.stopPropagation();
							evt.preventDefault();
							jQuery("#"+cfg.dropBoxID).removeClass("onDrop");
							jQuery("#"+cfg.dropBoxID+"_dropZoneBox").hide();
							cfg.onError("fileCount");
							return false;
						}
					}

					onFileDrop(evt)
				}, false);
			}
			
			if(cfg.queueBoxID){
				this.multiSelector = new AXMultiSelect();
				this.multiSelector.setConfig({
					selectStage       : cfg.queueBoxID,
					selectClassName   : "readyselect",
					beselectClassName : "beSelected"
				});
			}
		}
	},
	swfinit: function(reset){
		var cfg = this.config;
		this.target = jQuery("#"+cfg.targetID);

		var po = [];
		po.push('<div style="position:relative;">');
		po.push('	<table style="table-layout:fixed;width:100%;"><tbody><tr><td id="'+cfg.targetID+'_AX_selectorTD">');
		po.push('	<button type="button" class="AXButton '+cfg.targetButtonClass+'" id="'+cfg.targetID+'_AX_selector"><span class="AXFileSelector">'+(cfg.buttonTxt)+'</span></button>');
		po.push('	<span id="spanButtonPlaceholder" class="AXUpload5flashUploadButton"></span>');
		po.push('	</td>');
		
		if(cfg.isSingleUpload){
			po.push('<td>');
			po.push('<div class="AXFileDisplay" id="'+cfg.targetID+'_AX_display">'+AXConfig.AXUpload5.uploadSelectTxt+'</div>');
			po.push('</td>');
		}
		
		po.push('	<tr></tbody></table>');
		po.push('</div>');
		this.target.empty();
		this.target.append(po.join(''));
		
		jQuery('#'+cfg.targetID+'_AX_selectorTD').css({width:jQuery('#'+cfg.targetID+'_AX_selector').outerWidth()+5});
		
		var btnW = jQuery('#'+cfg.targetID+'_AX_selector').outerWidth();
		var btnH = jQuery('#'+cfg.targetID+'_AX_selector').outerHeight();
		
		// functions --------------------------------------------------------------- s
		var uploadSuccess = this.uploadSuccess.bind(this);
		var onClickDeleteButton = this.onClickDeleteButton.bind(this);
		var onClickFileTitle = this.onClickFileTitle.bind(this);
		
		var file_dialog_complete_handler = function(numFilesSelected, numFilesQueued){
			if (numFilesSelected > 0) {
				if (this.swfu.getStats().files_queued > 0) {
					//if(this.settings.onStartUpload) this.settings.onStartUpload();
					if(cfg.onStart) cfg.onStart.call(this.queue);
				}
			}
			this.swfu.startUpload();
		};
		var file_dialog_complete_handler_bind = file_dialog_complete_handler.bind(this);
		//--
		var file_queued_handler = function(file){
			if(cfg.isSingleUpload){
				var myFile = this.uploadedList.first();
				if(myFile){
					if(!confirm(AXConfig.AXUpload5.deleteConfirm)){
						this.cancelUpload();
					};
					var uploadFn = function(){
						var itemID = 'AX_'+ file.id;
						this.queue.push({id:itemID, file:file});
						jQuery("#" + cfg.targetID+'_AX_display').empty();
						jQuery("#" + cfg.targetID+'_AX_display').append(this.getItemTag(itemID, file));
					};
					this.deleteFile(myFile, uploadFn.bind(this));
					return;
				}else{
					var itemID = 'AX_'+ file.id;
					this.queue.push({id:itemID, file:file});
					jQuery("#" + cfg.targetID+'_AX_display').empty();
					jQuery("#" + cfg.targetID+'_AX_display').append(this.getItemTag(itemID, file));
				}
			}else{
				//cfg.uploadMaxFileCount
				if(cfg.uploadMaxFileCount != 0){
					if(this.uploadedList.length >= cfg.uploadMaxFileCount){
						cfg.onError("fileCount");
						this.cancelUpload();
						return;
					}
				}
				
				//trace(file);
				//{"filestatus":-1, "name":"20130708175735_1.jpg", "type":".jpg", "id":"SWFUpload_0_0", "index":0, "modificationdate":"2013-10-04T08:51:27Z", "uploadtype":0, "post":{}, "size":891324, "creationdate":"2013-10-04T08:52:02Z"} 
				var itemID = 'AX_'+ file.id;
				this.queue.push({id:itemID, file:file});
				//큐박스에 아이템 추가
				if(cfg.queueBoxAppendType == "prepend") jQuery("#" + cfg.queueBoxID).prepend(this.getItemTag(itemID, file));
				else jQuery("#" + cfg.queueBoxID).append(this.getItemTag(itemID, file));
				jQuery("#" + cfg.queueBoxID).find("#"+itemID).fadeIn();
			}
		};
		var file_queued_handler_bind = file_queued_handler.bind(this);
		//--
		var file_queue_error_handler = function(file, errorCode, message){
			try {
				if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
					alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
					return;
				}
				this.cancelUpload();
				if(cfg.onComplete) cfg.onComplete.call(this.uploadedList, this.uploadedList);

				switch (errorCode) {
				case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
					this.showMSG("File is too big.");
					this.swfu.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
					this.showMSG("Cannot upload Zero Byte files.");
					this.swfu.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
					this.showMSG("Invalid File Type.");
					this.swfu.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				default:
					if (file !== null) {
						this.showMSG("Unhandled Error");
					}
					this.swfu.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				}
			} catch (ex) {
			    this.debug(ex);
			}
		};
		var file_queue_error_handler_bind = file_queue_error_handler.bind(this);
		//--
		var upload_start_handler = function(){
			if(this.isSingleUpload){

			}else{
				if(cfg.uploadMaxFileCount != 0){
					if(cfg.uploadMaxFileCount <= this.uploadedList.length){
						this.cancelUpload();
					}
				}
			}
		};
		var upload_start_handler_bind = upload_start_handler.bind(this);
		//--
		var upload_progress_handler = function(file, bytesLoaded, bytesTotal){
			var itemID = 'AX_'+ file.id;
			if(cfg.isSingleUpload){
				jQuery("#"+itemID).find(".AXUploadProcessBar").width( ((bytesLoaded / bytesTotal) * 100).round(2)+"%" );
			}else{
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadProcessBar").width( ((bytesLoaded / bytesTotal) * 100).round(2)+"%" );
			}
		};
		var upload_progress_handler_bind = upload_progress_handler.bind(this);
		//--
		var upload_success_handler = function(file, res){
			var itemID = 'AX_'+ file.id;
			
			try{if(typeof res == "string") res = res.object();}catch(e){trace(e);}
			if(cfg.isSingleUpload){
				
				jQuery("#"+itemID+" .AXUploadBtns").show();
				jQuery("#"+itemID+" .AXUploadLabel").show();
				jQuery("#"+itemID+" .AXUploadTit").show();
				
				jQuery("#"+itemID+" .AXUploadProcess").hide();
								
				uploadSuccess(file, itemID, res);
				// --------------------- s
				jQuery("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
					onClickDeleteButton(itemID);
				});
				if(cfg.onClickUploadedItem){
					jQuery("#"+itemID+" .AXUploadDownload").bind("click", function(){
						onClickFileTitle(itemID);
					});
				}
				
			}else{
				
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtns").show();
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadLabel").show();
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadProcess").hide();
				
				if(res[cfg.fileKeys.thumbPath]){
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({
						"background-image":"url('"+(res[cfg.fileKeys.thumbPath]||"").dec()+"')"
					}).addClass("AXUploadPreview");
				}else{
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({"background-image":"url()"});
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").html((res[cfg.fileKeys.type]||"").dec().replace(".", ""));
				}
				
				uploadSuccess(file, itemID, res);
				// --------------------- s
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
					onClickDeleteButton(itemID);
				});
				if(cfg.onClickUploadedItem){
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadDownload").bind("click", function(){
						onClickFileTitle(itemID);
					});
				}
			}
			
			//큐에서 제거
			var updateQueue = [];
			jQuery.each(this.queue, function(){
				if(this.id != itemID) updateQueue.push(this);
			});
			this.queue = updateQueue;			
		};
		var upload_success_handler_bind = upload_success_handler.bind(this);
		//--
		var upload_complete_handler = function(){
			if(this.isSingleUpload){
				this.uploadComplete();
			}else{
				if (this.swfu.getStats().files_queued === 0) {
					this.uploadComplete();
					this.swfu.settings.allowUpload = false;
				}else{
					this.swfu.startUpload();
				}
			}
		};
		var upload_complete_handler_bind = upload_complete_handler.bind(this);
		//--
		var queue_complete_handler = function(){
			//alert("end");
		};
		var queue_complete_handler_bind = queue_complete_handler.bind(this);
		// functions --------------------------------------------------------------- e

		var settings = {
			flash_url : cfg.flash_url,
			flash9_url : cfg.flash9_url,
			upload_url: cfg.uploadUrl,
			file_post_name: cfg.uploadFileName,
			post_params: cfg.uploadPars,
			file_size_limit : cfg.uploadMaxFileSize,
            fileSelectAutoUpload: cfg.fileSelectAutoUpload,
			file_types : cfg.flash_file_types||"*.*",
			file_types_description : cfg.flash_file_types_description||"all",
			file_upload_limit : 0, //cfg.uploadMaxFileCount,
			file_queue_limit : 0,
			debug: false,
	
			// Button Settings
			button_image_url : "null",
			button_placeholder_id : "spanButtonPlaceholder",
			button_width: btnW,
			button_height: btnH,
	
			// The event handler functions are defined in handlers.js
			swfupload_preload_handler : function(){},
			swfupload_load_failed_handler : function(){},
			swfupload_loaded_handler : function(){},
			file_queued_handler : file_queued_handler_bind,
			file_queue_error_handler : file_queue_error_handler_bind,
			file_dialog_complete_handler : file_dialog_complete_handler_bind,
			upload_start_handler : upload_start_handler_bind,
			upload_progress_handler : upload_progress_handler_bind,
			upload_error_handler : function(){},
			upload_success_handler : upload_success_handler_bind,
			upload_complete_handler : upload_complete_handler_bind,
			queue_complete_handler : queue_complete_handler_bind	// Queue plugin event
		};
		this.swfu = new SWFUpload(settings);
		
		if(cfg.queueBoxID){
			this.multiSelector = new AXMultiSelect();
			this.multiSelector.setConfig({
				selectStage       : cfg.queueBoxID,
				selectClassName   : "readyselect",
				beselectClassName : "beSelected"
			});
		}
	},
	getItemTag: function(itemID, f){
		var cfg = this.config;
		var po = [];
		if(cfg.isSingleUpload){
			po.push('<div class="AXUploadItem" id="'+itemID+'">');
			po.push('	<div class="AXUploadBtns" style="display:none;">');
			po.push('		<a href="#AXExecption" class="AXUploadBtnsA" id="'+itemID+'_AXUploadBtns_deleteFile">del</a>');
			po.push('	</div>');
			po.push('	<div class="AXUploadLabel" style="display:none;">');
			po.push('		<a href="#AXExecption" id="'+itemID+'_AXUploadLabel_download" class="AXUploadDownload">download</a>');
			po.push('	</div>');
			po.push('	<div class="AXUploadProcess">');
			po.push('		<div class="AXUploadProcessBar"></div>');
			po.push('	</div>');
			po.push('	<div class="AXUploadTit" title="'+f.name.dec()+'" style="display:none;">'+f.name.dec()+'</div>');
			po.push('</div>');
		}else{
			po.push('<div class="AXUploadItem" id="'+itemID+'" style=\"display:none;\">');
			po.push('	<div class="AXUploadIcon"></div>');
			po.push('	<div class="AXUploadType"><span class="AXUploadSize">'+f.size.number().byte()+'</span></div>');
			po.push('	<div class="AXUploadTit" title="'+f.name.dec()+'">'+f.name.dec()+'</div>');
			po.push('	<div class="AXUploadProcess">');
			po.push('		<div class="AXUploadProcessBar"></div>');
			po.push('	</div>');
			po.push('	<div class="AXUploadBtns" style="display:none;">');
			po.push('		<a href="#AXExecption" class="AXUploadBtnsA" id="'+itemID+'_AXUploadBtns_deleteFile">del</a>');
			po.push('	</div>');
			po.push('	<div class="AXUploadLabel" style="display:none;">');
			
			if(cfg.formatter){
				var uf = {};
				//uf.id =  (f.id) ? f.id : itemID;
				uf.id =  itemID;
				uf.name = f.name;
				uf.type = f.type; 
				uf.size = f.size; 
				
				var returnStr = cfg.formatter.call(uf, uf);
				if (returnStr) po.push(returnStr);
			}
			po.push('		<a href="#AXExecption" id="'+itemID+'_AXUploadLabel_download" class="AXUploadDownload">download</a>');
			po.push('	</div>');
		}
		return po.join('');
	},
	onFileSelect: function(evt){
		var cfg = this.config, _this = this;
		if(this.supportHtml5){
			var files = evt.target.files; // FileList object
			if(cfg.isSingleUpload){
				
				var myFile = this.uploadedList.first();
				if(myFile){
					this.__tempFiles = files[0];
					if(!confirm(AXConfig.AXUpload5.deleteConfirm)) return;
					var uploadFn = function(){
						var itemID = 'AX'+AXUtil.timekey()+'_AX_0';
						this.queue.push({id:itemID, file:_this.__tempFiles});
						jQuery("#" + cfg.targetID+'_AX_display').empty();
						jQuery("#" + cfg.targetID+'_AX_display').append(_this.getItemTag(itemID, _this.__tempFiles));

						_this.queueLive = true;
						if(cfg.onStart) cfg.onStart.call(_this.queue, _this.queue);
						_this.uploadQueue();
						itemID = null;
						_this.__tempFiles = null;
					};
					this.deleteFile(myFile, uploadFn.bind(this));
					return;
				}else{
					var i = 0;
					var f = files[i];
					var itemID = 'AX'+AXUtil.timekey()+'_AX_'+i;
					this.queue.push({id:itemID, file:f});
					jQuery("#" + cfg.targetID+'_AX_display').empty();
					jQuery("#" + cfg.targetID+'_AX_display').append(this.getItemTag(itemID, f));					
				}

			}else{
				var hasSizeOverFile = false;
				var sizeOverFile;
				if(!cfg.file_types) cfg.file_types = ".";
				if(cfg.file_types == "*.*") cfg.file_types = "*/*";

				for (var i = 0; i < files.length; i++) {
					var f = files[i];
					if(f.size > cfg.uploadMaxFileSize){
						hasSizeOverFile = true;
						sizeOverFile = f;
						break;
					}
				}
				if(hasSizeOverFile) cfg.onError("fileSize", {name:sizeOverFile.name, size:sizeOverFile.size});

				var uploadedCount = this.uploadedList.length;
				for (var i = 0; i < files.length; i++) {
					var f = files[i];
					if( f.size <= cfg.uploadMaxFileSize && ( (new RegExp(cfg.file_types.replace(/\*/g, "[a-z]"), "ig")).test(f.type.toString()) || (cfg.file_types == "*/*" && f.type == "") ) ){
						if(uploadedCount-1 < cfg.uploadMaxFileCount || cfg.uploadMaxFileCount == 0){
							var itemID = 'AX'+AXUtil.timekey()+'_AX_'+i;
							this.queue.push({id:itemID, file:f});
							//큐박스에 아이템 추가

							if(cfg.queueBoxAppendType == "prepend") jQuery("#" + cfg.queueBoxID).prepend(this.getItemTag(itemID, f));
							else jQuery("#" + cfg.queueBoxID).append(this.getItemTag(itemID, f));
							jQuery("#" + cfg.queueBoxID).find("#"+itemID).fadeIn();
							uploadedCount++;
						}else{
							cfg.onError("fileCount");
							break;
						}
					}
				};
			}
		}else{
			alert("not support HTML5");
		}
		this.queueLive = true;
		if(cfg.onStart) cfg.onStart.call(this.queue, this.queue);
		this.uploadQueue();
	},
	onFileDragOver: function(evt){
		var cfg = this.config;
		jQuery("#"+cfg.dropBoxID).addClass("onDrop");
		jQuery("#"+cfg.dropBoxID+"_dropZoneBox").show();
		/*jQuery("#"+cfg.dropBoxID+"_dropZoneBox").css({height:jQuery("#"+cfg.dropBoxID).innerHeight()-6, width:jQuery("#"+cfg.dropBoxID).innerWidth()-6}); 라르게덴 2013-10-29 오후 3:21:45 */
		jQuery("#"+cfg.dropBoxID+"_dropZoneBox").css({height:jQuery("#"+cfg.dropBoxID).prop("scrollHeight")-6, width:jQuery("#"+cfg.dropBoxID).innerWidth()-6});
		
		var dropZone = document.getElementById(cfg.dropBoxID+"_dropZoneBox");
		dropZone.addEventListener('dragleave', function(evt){
			jQuery("#"+cfg.dropBoxID).removeClass("onDrop");
			jQuery("#"+cfg.dropBoxID+"_dropZoneBox").hide();
		}, false);

		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	},
	onFileDrop: function(evt){
		var cfg = this.config;
		evt.stopPropagation();
		evt.preventDefault();
		jQuery("#"+cfg.dropBoxID).removeClass("onDrop");
		jQuery("#"+cfg.dropBoxID+"_dropZoneBox").hide()
		
		var files = evt.dataTransfer.files; // FileList object.
		
		var hasSizeOverFile = false;
		var sizeOverFile;
		for (var i = 0, f; f = files[i]; i++) {
			if(f.size > cfg.uploadMaxFileSize){
				hasSizeOverFile = true;
				sizeOverFile = f;
				break;
			}
		}
		if(hasSizeOverFile) cfg.onError("fileSize", {name:sizeOverFile.name, size:sizeOverFile.size});
        if(!cfg.file_types) cfg.file_types = ".";
		if(cfg.file_types == "*.*") cfg.file_types = "*/*";
        var fileTypeRe = new RegExp(cfg.file_types.replace(/\*/g, "[a-z]"), "ig");
		var uploadedCount = this.uploadedList.length;
		for (var i = 0, f; f = files[i]; i++) {
			if(f.size <= cfg.uploadMaxFileSize && ( (new RegExp(cfg.file_types.replace(/\*/g, "[a-z]"), "ig")).test(f.type.toString()) || (cfg.file_types == "*/*" && f.type == "") ) ){
				uploadedCount++;
				if(uploadedCount-1 < cfg.uploadMaxFileCount || cfg.uploadMaxFileCount == 0){
					var itemID = 'AX'+AXUtil.timekey()+'_AX_'+i;
					this.queue.push({id:itemID, file:f});
					//큐박스에 아이템 추가
					if(cfg.queueBoxAppendType == "prepend") jQuery("#" + cfg.queueBoxID).prepend(this.getItemTag(itemID, f));
					else jQuery("#" + cfg.queueBoxID).append(this.getItemTag(itemID, f));
					jQuery("#" + cfg.queueBoxID).find("#"+itemID).fadeIn();
				}else{
					cfg.onError("fileCount");
					break;
				}
			}
		};

		this.queueLive = true;
		if(cfg.onStart) cfg.onStart.call(this.queue);
		this.uploadQueue();
	},
	pauseQueue: function(){
		this.queueLive = false;
	},
	uploadQueue: function(fileUpload){
		var cfg = this.config;
		
		if(cfg.fileSelectAutoUpload == false && fileUpload == undefined){
			return;	
		}

        if(cfg.fileSelectAutoUpload == false && fileUpload != undefined && this.swfu) {
            this.swfu.settings.allowUpload = true;
            this.swfu.startUpload();
        }
		
		if(!this.queueLive) return;
		if(this.queue.length == 0){
			//trace("uploadEnd");
			this.uploadComplete();
			return;
		}
		
		var uploadQueue = this.uploadQueue.bind(this);
		var cancelUpload = this.cancelUpload.bind(this);
		var uploadSuccess = this.uploadSuccess.bind(this);
		var onClickDeleteButton = this.onClickDeleteButton.bind(this);
		var onClickFileTitle = this.onClickFileTitle.bind(this);
		
		var obj = this.queue.shift();
		this.uploadingObj = obj;
		var formData = new FormData();
		//서버로 전송해야 할 추가 파라미터 정보 설정
		jQuery.each(cfg.uploadPars, function(k, v){
			formData.append(k, v); 
		});
		//formData.append(obj.file.name, obj.file);
		formData.append(cfg.uploadFileName, obj.file);
		
		//obj.id
		var itemID = obj.id;
		
		this.xhr = new XMLHttpRequest();
		this.xhr.open('POST', cfg.uploadUrl, true);
		this.xhr.onload = function(e) {
			var res = e.target.response;
			try { if (typeof res == "string") res = res.object(); } catch (e) {
				trace(e);
				cancelUpload();
				return;
			}

			if (res.result == "err" || res.error) {
				alert("파일전송에 실패 하였습니다. 서버에서 에러가 리턴되었습니다. 콘솔창을 확인 하세요.");
				trace(res);
				jQuery("#" + itemID).fadeOut("slow");
				cancelUpload();
				return;
			}
			
			if(cfg.isSingleUpload){
				
				jQuery("#"+itemID+" .AXUploadBtns").show();
				jQuery("#"+itemID+" .AXUploadLabel").show();
				jQuery("#"+itemID+" .AXUploadTit").show();
				
				jQuery("#"+itemID+" .AXUploadProcess").hide();
								
				uploadSuccess(obj.file, itemID, res);
				// --------------------- s
				jQuery("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
					onClickDeleteButton(itemID);
				});
				if(cfg.onClickUploadedItem){
					jQuery("#"+itemID+" .AXUploadDownload").bind("click", function(){
						onClickFileTitle(itemID);
					});
				}
				
			}else{
				
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtns").show();
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadLabel").show();
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadProcess").hide();
				
				var _res = (Object.isArray(res)) ? res[0] : res; /* Array 타입 예외처리 */

				if(_res[cfg.fileKeys.thumbPath]){
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({
						"background-image":"url('"+(_res[cfg.fileKeys.thumbPath]||"").dec()+"')"
					}).addClass("AXUploadPreview");
				}else{
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({"background-image":"url()"});
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").html((_res[cfg.fileKeys.type]||"").dec().replace(".", ""));
				}
				
				uploadSuccess(obj.file, itemID, _res);
				
				// --------------------- s
				jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
					onClickDeleteButton(itemID);
				});
				if(cfg.onClickUploadedItem){
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadDownload").bind("click", function(){
						onClickFileTitle(itemID);
					});
				}
			}

			// --------------------- e
			uploadQueue(fileUpload);
		};
		var setUploadingObj = function(){
			this.uploadingObj = null;
		};
		var setUploadingObjBind = setUploadingObj.bind(this);
		this.xhr.upload.onprogress = function(e) {
			if(cfg.isSingleUpload){
				if (e.lengthComputable) { jQuery("#"+itemID).find(".AXUploadProcessBar").width( ((e.loaded / e.total) * 100).round(2)+"%" ); }	
			}else{
				if (e.lengthComputable) { jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadProcessBar").width( ((e.loaded / e.total) * 100).round(2)+"%" ); }	
			}
			if (e.lengthComputable) {
				if(	e.loaded > e.total*0.9 ){
					setUploadingObjBind();
				}
			}
		};
		this.xhr.send(formData);  // multipart/form-data
	},
	uploadSuccess: function(file, itemID, res){ // 업로드 아이템별 이벤트
		var cfg = this.config;
		var uploadedItem = {id:itemID};
		var _res = (Object.isArray(res)) ? res[0] : res; /* Array 타입 예외처리 */
		jQuery.each(_res, function(k, v){
			uploadedItem[k] = v;
		});
		if(cfg.queueBoxAppendType == "prepend") this.uploadedList.push(uploadedItem);
		else{
			var uploadedList = [];
			uploadedList.push(uploadedItem);
			jQuery.each(this.uploadedList, function(){
				uploadedList.push(this);
			});
			this.uploadedList = uploadedList;
		}
		jQuery("#"+itemID).addClass("readyselect");
		if(cfg.onUpload) cfg.onUpload.call(uploadedItem, uploadedItem);
	},
	clearQueue: function(){
		//큐제거
		jQuery.each(this.queue, function(){
			jQuery("#"+this.id).hide(function(){
				jQuery(this).remove();
			});
		});
		this.queue = [];
	},
	uploadComplete: function(){
		var cfg = this.config;
		//trace("uploadComplete");
		if(AXgetId(cfg.targetID+'_AX_files')){
			
			jQuery('#'+cfg.targetID+'_AX_files').remove();
			
			var inputFileMultiple = 'multiple="multiple"';
			var inputFileAccept = cfg.file_types;
			if(cfg.isSingleUpload){
				inputFileMultiple = '';
			}
			if(!this.supportHtml5){
				inputFileMultiple = '';
			}

			var  po = ['	<input type="file" id="'+cfg.targetID+'_AX_files" '+inputFileMultiple+' accept="'+inputFileAccept+'" style="position:absolute;left:0px;top:0px;margin:0px;padding:0px;-moz-opacity: 0.0;opacity:.00;filter: alpha(opacity=0);" />'];
			jQuery("#"+cfg.targetID+"_AX_selectorTD").prepend(po.join(''));
			jQuery('#'+cfg.targetID+'_AX_files').css({width:jQuery('#'+cfg.targetID+'_AX_selector').outerWidth(),height:jQuery('#'+cfg.targetID+'_AX_selector').outerHeight()});

			var onFileSelect = this.onFileSelect.bind(this);
			var fileSelector = document.getElementById(cfg.targetID+'_AX_files');
			if(AXUtil.browser.name == "ie" && AXUtil.browser.version < 9){
				
			}else{
				fileSelector.addEventListener('change', onFileSelect, false);
			}

		}
		if(cfg.queueBoxID){
			this.multiSelector.collect();
		}
		if(cfg.onComplete) cfg.onComplete.call(this.uploadedList, this.uploadedList);
	},
	cancelUpload: function(){
		var cfg = this.config;
		if(this.swfu){
			this.swfu.stopUpload();
			var stats = this.swfu.getStats();
			while (stats.files_queued > 0) {
				this.swfu.cancelUpload();
				stats = this.swfu.getStats();
			}
			stats = null;
			this.pauseQueue();
			this.clearQueue();			
		}else{
			if(this.uploadingObj){
				this.xhr.abort();
				jQuery("#"+this.uploadingObj.id).remove();
				this.uploadingObj = null;
			}
			this.pauseQueue();
			this.clearQueue();
		}
		if(cfg.onComplete) cfg.onComplete.call(this.uploadedList, this.uploadedList);
	},
	onClickDeleteButton: function(itemID){
		var cfg = this.config;
		if(cfg.isSingleUpload){
			var myFile;
			jQuery.each(this.uploadedList, function(){
				if(this.id == itemID){
					myFile = this;
					return false;
				}
			});
			if(myFile){
				this.deleteFile(myFile);
			}
			myFile = null;
			//trace("a");
			this.init("reset");
		}else{
			var myFile;
			jQuery.each(this.uploadedList, function(){
				if(this.id == itemID){
					myFile = this;
					return false;
				}
			});
			if(myFile){
				this.deleteFile(myFile);
				if(cfg.queueBoxID){
					this.multiSelector.clearSelects();
				}
			}
			myFile = null;
		}
		
	},
	onClickFileTitle: function(itemID){
		var cfg = this.config;
		//trace(itemID);
		if(cfg.onClickUploadedItem){
			
			var myFile;
			jQuery.each(this.uploadedList, function(){
				if(this.id == itemID){
					myFile = this;
					return false;
				}
			});
			cfg.onClickUploadedItem.call(myFile, myFile);
		}
	},
	deleteFile: function(file, onEnd, withOutServer){
		var cfg = this.config;
		if(!onEnd) if(!confirm(AXConfig.AXUpload5.deleteConfirm)) return;		
		var removeUploadedList = this.removeUploadedList.bind(this);
		
		//trace(file);
		//{"id":"AXA220125984_AX_0", "name":"38540011%2EJPG", "type":"%2EJPG", "saveName":"0DA0316011A0001%2EJPG", "fileSize":"3172720", "uploadedPath":"%2F%5Ffile%2F1%2F", "thumbPath":"%2F%5Ffile%2F1%2FT%5F0DA0316011A0001%2EJPG"}
		if (file != undefined){
				
			if(withOutServer == "withOutServer"){
				if(cfg.isSingleUpload){
					jQuery('#'+cfg.targetID+'_AX_display').html(AXConfig.AXUpload5.uploadSelectTxt);
				}else{
					jQuery("#"+file.id).hide(function(){
						jQuery(this).remove();
					});
				}
				removeUploadedList(file.id);	
				if(cfg.onDelete) cfg.onDelete.call({file:file, response:withOutServer}, file);
				if(onEnd) onEnd();
				return;	
			}
			
			var pars = [];
			var sendPars = "";
			jQuery.each(file, function(k, v){
				pars.push(k + '=' + v);
			});
			
			if (typeof(cfg.deletePars) === "object") {
				jQuery.each(cfg.deletePars, function(k, v){
					pars.push(k + '=' + v);
				});
				sendPars = pars.join("&");
			}else{
				sendPars = pars.join("&") + "&" + cfg.deletePars;
			}

			if(cfg.isSingleUpload){
				jQuery("#"+file.id+" .AXUploadBtns").hide();
			}else{
				jQuery("#" + cfg.queueBoxID).find("#"+file.id+" .AXUploadBtns").hide();
			}
			
			new AXReq(cfg.deleteUrl, {
				debug:false,
				pars:sendPars,
				onsucc:function(res){
					if ((res.result && res.result == AXConfig.AXReq.okCode) || (res.result == undefined && !res.error)) {

						if(onEnd) setTimeout(onEnd, 1);
						if(cfg.isSingleUpload){
							jQuery('#'+cfg.targetID+'_AX_display').html(AXConfig.AXUpload5.uploadSelectTxt);
						}else{
							jQuery("#"+file.id).hide(function(){
								jQuery(this).remove();
							});
						}
						removeUploadedList(file.id);
						if(cfg.onDelete) cfg.onDelete.call({file:file, response:res}, file);

					}else{
						if(cfg.isSingleUpload){
							jQuery("#"+file.id+" .AXUploadBtns").show();
						}else{
							jQuery("#" + cfg.queueBoxID).find("#"+file.id+" .AXUploadBtns").show();
						}
					}
				},
				onerr: function(){
					if(cfg.isSingleUpload){
						jQuery("#"+file.id+" .AXUploadBtns").show();
					}else{
						jQuery("#" + cfg.queueBoxID).find("#"+file.id+" .AXUploadBtns").show();
					}
				}
			});

		}else{
			trace("file undefined");
		}
	},
	deleteSelect: function(arg, withOutServer){
		if(arg == "all"){
			var deleteQueue = [];
			jQuery.each(this.uploadedList, function(){
				deleteQueue.push(this.id);
			});
			this.ccDelete(deleteQueue, 0, withOutServer);
			deleteQueue = null;
		}else{
			if(!this.multiSelector) return;
			var selectObj = this.multiSelector.getSelects();	
			if (selectObj.length > 0){
				var deleteQueue = [];
				jQuery.each(selectObj, function(){
					deleteQueue.push(this.id);
				});
				this.ccDelete(deleteQueue, 0, withOutServer);
				deleteQueue = null;
			}else{
				alert("삭제하실 파일을 선택해 주세요");
			}
		}
	},
	ccDelete: function(deleteQueue, index, withOutServer){
		if(deleteQueue.length > index){
			var myFile;
			jQuery.each(this.uploadedList, function(){
				if(this.id == deleteQueue[index]){
					myFile = this;
					return false;
				}
			});
			var ccDelete = this.ccDelete.bind(this);
			this.deleteFile(myFile, function(){
				ccDelete(deleteQueue, (index+1), withOutServer);
			}, withOutServer);
		}
	},
	removeUploadedList: function(fid){
		var newUploadedList = [];
		jQuery.each(this.uploadedList, function(){
			if(this.id != fid) newUploadedList.push(this);
		});
		this.uploadedList = newUploadedList;
		newUploadedList = null;
		
		this.multiSelector.collect();
	},
	showMSG: function(msg){
		dialog.push(msg);
	},
	setUploadedList: function(files){
		var cfg = this.config;
		
		var getItemTag = this.getItemTag.bind(this);
		var onClickDeleteButton = this.onClickDeleteButton.bind(this);
		var onClickFileTitle = this.onClickFileTitle.bind(this);
		
		
		//if (!files.length) return;
		
		if(cfg.isSingleUpload){
			this.uploadedList = [];
			var f;
			if(jQuery.isArray(files)){
				if( jQuery.isArray(files.first()) ){
					f = files.first();	
				}
			}else{
				if (Object.isObject(files) ){
					f = files;
				}
			}
			if(!f) return;
			if(!f.id) return;
			
			this.uploadedList.push(f);
			
			var itemID = f.id;
			
			var uf = {
				id:itemID,
				name:f[cfg.fileKeys.name],
				size:f[cfg.fileKeys.fileSize]
			};
			
			jQuery("#" + cfg.targetID+'_AX_display').empty();
			jQuery("#" + cfg.targetID+'_AX_display').append(this.getItemTag(itemID, uf));
			
			jQuery("#"+itemID+" .AXUploadBtns").show();
			jQuery("#"+itemID+" .AXUploadLabel").show();
			jQuery("#"+itemID+" .AXUploadTit").show();
			jQuery("#"+itemID+" .AXUploadProcess").hide();
			
			jQuery("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
				onClickDeleteButton(itemID);
			});
			if(cfg.onClickUploadedItem){
				jQuery("#"+itemID+" .AXUploadDownload").bind("click", function(){
					onClickFileTitle(itemID);
				});
			}
			
		}else{

			//this.uploadedList = files;
			this.uploadedList = [];
			var uploadedList = [];
			files.reverse();
			axf.each(files, function(){
				if(this) uploadedList.push(this);
			});
			this.uploadedList = uploadedList;
			//trace(this.uploadedList);
			
			if(cfg.queueBoxID){
				jQuery.each(this.uploadedList, function(fidx, f){
					if(f.id == undefined){
						trace("id key는 필수 항목 입니다.");
						return false;	
					}
					var itemID = f.id;
					var uf = {
						id:itemID,
						name:f[cfg.fileKeys.name],
						size:f[cfg.fileKeys.fileSize]
					};
					jQuery("#" + cfg.queueBoxID).prepend(getItemTag(itemID, uf));
					jQuery("#" + cfg.queueBoxID).find("#"+itemID).fadeIn();
					
					// --------------------- s
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtns").show();
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadLabel").show();
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadProcess").hide();
		
					if(f[cfg.fileKeys.thumbPath]){
						jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({
							"background-image":"url('"+(f[cfg.fileKeys.thumbPath]||"").dec()+"')"
						}).addClass("AXUploadPreview");
					}else{				
						jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").css({"background-image":"url()"});
						jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadIcon").html((f[cfg.fileKeys.type]||"").dec().replace(".", ""));
					}
		
					jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadBtnsA").bind("click", function(){
						onClickDeleteButton(itemID);
					});
					if(cfg.onClickUploadedItem){
						jQuery("#" + cfg.queueBoxID).find("#"+itemID+" .AXUploadDownload").bind("click", function(){
							onClickFileTitle(itemID);
						});
					}
					// --------------------- e
					
					jQuery("#"+itemID).addClass("readyselect");
					
				});
				this.multiSelector.collect();
			}
		}
	},
	getUploadedList: function(arg){
		if(arg == "param"){
			try{
				var pars = [];
				if(this.uploadedList){
					jQuery.each(this.uploadedList, function(){
						if(this != "") pars.push(jQuery.param(this));
					});
				}
				return pars.join("&");
				pars = null;
			}catch(e){
				trace(e);	
			}
		}else{
			return this.uploadedList;
		}
	},
	getSelectUploadedList: function(arg){
		if(!this.multiSelector) return;
		var selectObj = this.multiSelector.getSelects();
		if(arg == "param"){
			var pars = [];
			jQuery.each(this.uploadedList, function(){
				for(var a=0;a<selectObj.length;a++){
					if(this.id == selectObj[a].id) pars.push(jQuery.param(this));
				}
			});
			return pars.join("&");
			pars = null;
		}else{
			var pars = [];
			jQuery.each(this.uploadedList, function(){
				for(var a=0;a<selectObj.length;a++){
					if(this.id == selectObj[a].id) pars.push(this);
				}
			});
			return pars;
			pars = null;
		}
	},
	setUploadedFile: function(file){
		
		if(!file) return;
		if(!file.id) return;
		
		this.uploadedList = [];
		this.uploadedList.push(file);
		fileNameMaxLen = this.settings.fileNameMaxLen;
		var po = [];
		
		var dfileicon = this.settings.dfileicon;

		var UploadDisplay_id = this.settings.UploadDisplay_id;
		var onClickButton = this.onClickButton.bind(this);		
		var AXfile = this.uploadedList.first();
		
		var po = [];
		po.push("<div class='AXFileTitleBlock'>");
		po.push("<a href='#AXexec' class='AXFileTitle'>"+AXfile.ti.dec()+"</a>");
		po.push("<a href='#AXexec' class='AXFileDelete'>X</a>");
		po.push("</div>"); 
		jQuery("#"+UploadDisplay_id).html(po.join(''));			
		jQuery("#"+UploadDisplay_id).find(".AXFileDelete").bind("click", onClickButton);

		if(this.settings.onclick){
			var onclick = this.settings.onclick.bind(this);
			jQuery("#"+UploadDisplay_id).find(".AXFileTitle").bind("click", function(){
				onclick(AXfile);
			});
		}

		po = null;
		fileNameMaxLen = null;
	},
	getUploadedFile: function(){
		return this.uploadedList.first();
	},
	
	addKeyInUploadedListItem: function(objID, obj){
		var uploadedList = this.uploadedList;
		
		jQuery.each(uploadedList, function(idx, o){
			if (o.id == objID){
				jQuery.each(obj, function(k, v){
					o[k] = v;
				});
			}else{
				jQuery.each(obj, function(k, v){
					o[k] = '';
				});
			}
		});
	},
	
	nothing: function(){

	}
});

// jquery extend