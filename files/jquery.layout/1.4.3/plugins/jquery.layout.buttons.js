/**
 * @preserve jquery.layout.buttons 1.0
 * $Date: 2011-07-16 08:00:00 (Sat, 16 July 2011) $
 *
 * Copyright (c) 2011 
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @dependancies: UI Layout 1.3.0.rc30.1 or higher
 *
 * @support: http://groups.google.com/group/jquery-ui-layout
 *
 * Docs: [ to come ]
 * Tips: [ to come ]
 */

// NOTE: For best readability, view with a fixed-width font and tabs equal to 4-chars

;(function ($) {

if (!$.layout) return;


// tell Layout that the state plugin is available
$.layout.plugins.buttons = true;

//	Add State-Management options to layout.defaults
$.layout.defaults.autoBindCustomButtons = false;
// Set stateManagement as a layout-option, NOT a pane-option
$.layout.optionsMap.layout.push("autoBindCustomButtons");

var lang = $.layout.language;

/*
 *	Button methods
 */
$.layout.buttons = {
	// set data used by multiple methods below
	config: {
		borderPanes:	"north,south,west,east"
	}

	/**
	* Searches for .ui-layout-button-xxx elements and auto-binds them as layout-buttons
	*
	* @see  _create()
	*/
,	init: function (inst) {
		var pre		= "ui-layout-button-"
		,	layout	= inst.options.name || ""
		,	name;
		$.each("toggle,open,close,pin,toggle-slide,open-slide".split(","), function (i, action) {
			$.each($.layout.buttons.config.borderPanes.split(","), function (ii, pane) {
				$("."+pre+action+"-"+pane).each(function(){
					// if button was previously 'bound', data.layoutName was set, but is blank if layout has no 'name'
					name = $(this).data("layoutName") || $(this).attr("layoutName");
					if (name == undefined || name === layout)
						inst.bindButton(this, action, pane);
				});
			});
		});
	}

	/**
	* Helper function to validate params received by addButton utilities
	*
	* Two classes are added to the element, based on the buttonClass...
	* The type of button is appended to create the 2nd className:
	*  - ui-layout-button-pin
	*  - ui-layout-pane-button-toggle
	*  - ui-layout-pane-button-open
	*  - ui-layout-pane-button-close
	*
	* @param  {(string|!Object)}	selector	jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param  {string}   			pane 		Name of the pane the button is for: 'north', 'south', etc.
	* @return {Array.<Object>}		If both params valid, the element matching 'selector' in a jQuery wrapper - otherwise returns null
	*/
,	get: function (inst, selector, pane, action) {
		var $E	= $(selector)
		,	o	= inst.options
		,	err	= o.showErrorMessages
		;
		if (!$E.length) { // element not found
			if (err) alert(lang.errButton + lang.selector +": "+ selector);
		}
		else if ($.layout.buttons.config.borderPanes.indexOf(pane) === -1) { // invalid 'pane' sepecified
			if (err) alert(lang.errButton + lang.pane +": "+ pane);
			$E = $("");  // NO BUTTON
		}
		else { // VALID
			var btn = o[pane].buttonClass +"-"+ action;
			$E	.addClass( btn +" "+ btn +"-"+ pane )
				.data("layoutName", o.name); // add layout identifier - even if blank!
		}
		return $E;
	}


	/**
	* NEW syntax for binding layout-buttons - will eventually replace addToggle, addOpen, etc.
	*
	* @param {(string|!Object)}	sel		jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param {string}			action
	* @param {string}			pane
	*/
,	bind: function (inst, sel, action, pane) {
		var _ = $.layout.buttons;
		switch (action.toLowerCase()) {
			case "toggle":			_.addToggle	(inst, sel, pane); break;	
			case "open":			_.addOpen	(inst, sel, pane); break;
			case "close":			_.addClose	(inst, sel, pane); break;
			case "pin":				_.addPin	(inst, sel, pane); break;
			case "toggle-slide":	_.addToggle	(inst, sel, pane, true); break;	
			case "open-slide":		_.addOpen	(inst, sel, pane, true); break;
		}
		return inst;
	}

	/**
	* Add a custom Toggler button for a pane
	*
	* @param {(string|!Object)}	selector	jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param {string}  			pane 		Name of the pane the button is for: 'north', 'south', etc.
	* @param {boolean=}			slide 		true = slide-open, false = pin-open
	*/
,	addToggle: function (inst, selector, pane, slide) {
		$.layout.buttons.get(inst, selector, pane, "toggle")
			.click(function(evt){
				inst.toggle(pane, !!slide);
				evt.stopPropagation();
			});
		return inst;
	}

	/**
	* Add a custom Open button for a pane
	*
	* @param {(string|!Object)}	selector	jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param {string}			pane 		Name of the pane the button is for: 'north', 'south', etc.
	* @param {boolean=}			slide 		true = slide-open, false = pin-open
	*/
,	addOpen: function (inst, selector, pane, slide) {
		$.layout.buttons.get(inst, selector, pane, "open")
			.attr("title", lang.Open)
			.click(function (evt) {
				inst.open(pane, !!slide);
				evt.stopPropagation();
			});
		return inst;
	}

	/**
	* Add a custom Close button for a pane
	*
	* @param {(string|!Object)}	selector	jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param {string}   		pane 		Name of the pane the button is for: 'north', 'south', etc.
	*/
,	addClose: function (inst, selector, pane) {
		$.layout.buttons.get(inst, selector, pane, "close")
			.attr("title", lang.Close)
			.click(function (evt) {
				inst.close(pane);
				evt.stopPropagation();
			});
		return inst;
	}

	/**
	* Add a custom Pin button for a pane
	*
	* Four classes are added to the element, based on the paneClass for the associated pane...
	* Assuming the default paneClass and the pin is 'up', these classes are added for a west-pane pin:
	*  - ui-layout-pane-pin
	*  - ui-layout-pane-west-pin
	*  - ui-layout-pane-pin-up
	*  - ui-layout-pane-west-pin-up
	*
	* @param {(string|!Object)}	selector	jQuery selector (or element) for button, eg: ".ui-layout-north .toggle-button"
	* @param {string}   		pane 		Name of the pane the pin is for: 'north', 'south', etc.
	*/
,	addPin: function (inst, selector, pane) {
		var $E = $.layout.buttons.get(inst, selector, pane, "pin");
		if ($E.length) {
			var s = inst.state[pane];
			$E.click(function (evt) {
				$.layout.buttons.setPinState(inst, $(this), pane, (s.isSliding || s.isClosed));
				if (s.isSliding || s.isClosed) inst.open( pane ); // change from sliding to open
				else inst.close( pane ); // slide-closed
				evt.stopPropagation();
			});
			// add up/down pin attributes and classes
			$.layout.buttons.setPinState(inst, $E, pane, (!s.isClosed && !s.isSliding));
			// add this pin to the pane data so we can 'sync it' automatically
			// PANE.pins key is an array so we can store multiple pins for each pane
			s.pins.push( selector ); // just save the selector string
		}
		return inst;
	}

	/**
	* Change the class of the pin button to make it look 'up' or 'down'
	*
	* @see  addPin(), syncPins()
	* @param {Array.<Object>}	$Pin	The pin-span element in a jQuery wrapper
	* @param {string}	pane	These are the params returned to callbacks by layout()
	* @param {boolean}	doPin	true = set the pin 'down', false = set it 'up'
	*/
,	setPinState: function (inst, $Pin, pane, doPin) {
		var updown = $Pin.attr("pin");
		if (updown && doPin === (updown=="down")) return; // already in correct state
		var
			pin		= inst.options[pane].buttonClass +"-pin"
		,	side	= pin +"-"+ pane
		,	UP		= pin +"-up "+	side +"-up"
		,	DN		= pin +"-down "+side +"-down"
		;
		$Pin
			.attr("pin", doPin ? "down" : "up") // logic
			.attr("title", doPin ? lang.Unpin : lang.Pin)
			.removeClass( doPin ? UP : DN ) 
			.addClass( doPin ? DN : UP ) 
		;
	}

	/**
	* INTERNAL function to sync 'pin buttons' when pane is opened or closed
	* Unpinned means the pane is 'sliding' - ie, over-top of the adjacent panes
	*
	* @see  open(), close()
	* @param {string}	pane   These are the params returned to callbacks by layout()
	* @param {boolean}	doPin  True means set the pin 'down', False means 'up'
	*/
,	syncPinBtns: function (inst, pane, doPin) {
		// REAL METHOD IS _INSIDE_ LAYOUT - THIS IS HERE JUST FOR REFERENCE
		$.each(state[pane].pins, function (i, selector) {
			$.layout.buttons.setPinState(inst, $(selector), pane, doPin);
		});
	}


,	_load: function (inst) {
		//	ADD Button methods to Layout Instance
		$.extend( inst, {
			bindButton:		function (selector, action, pane) { return $.layout.buttons.bind(inst, selector, action, pane); }
		//	DEPRECATED METHODS...
		,	addToggleBtn:	function (selector, pane, slide) { return $.layout.buttons.addToggle(inst, selector, pane, slide); }
		,	addOpenBtn:		function (selector, pane, slide) { return $.layout.buttons.addOpen(inst, selector, pane, slide); }
		,	addCloseBtn:	function (selector, pane) { return $.layout.buttons.addClose(inst, selector, pane); }
		,	addPinBtn:		function (selector, pane) { return $.layout.buttons.addPin(inst, selector, pane); }
		});

		// init state array to hold pin-buttons
		for (var i=0; i<4; i++) {
			var pane = $.layout.buttons.config.borderPanes[i];
			inst.state[pane].pins = [];
		}

		// auto-init buttons onLoad if option is enabled
		if ( inst.options.autoBindCustomButtons )
			$.layout.buttons.init(inst);
	}

,	_unload: function (inst) {
		// TODO: unbind all buttons???
	}

};

// add initialization method to Layout's onLoad array of functions
$.layout.onLoad.push(  $.layout.buttons._load );
//$.layout.onUnload.push( $.layout.buttons._unload );


})( jQuery );