YUI.add('gallery-multivalue-input', function (Y, NAME) {

"use strict";
/**********************************************************************
 * Plugin which allows user select multiple value, it replaces the traditional ugly
 * multi select input control
 * @module gallery-multivalue-input
 * @author MaYanK(mzgupta)
 */

/**
 *
 * @class MultivalueInput
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} Widget configuration
 */
function MultiValueInput(config) {
	MultiValueInput.superclass.constructor.apply(this, arguments);
}


//Any frequently used shortcuts
var Lang   = Y.Lang,
MVI        = "multivalueinput",
getCN      = Y.ClassNameManager.getClassName,
DIVCONTENT = getCN(MVI, "content"),
LIST       = getCN(MVI, "list"),
LIST_ITEM  = getCN(MVI, "listitem"),
UL         = getCN(MVI, "ul"),
INPUT      = getCN(MVI, "input"),
REMOVE     = getCN(MVI, "remove"),
Node       = Y.Node;


/*
 * Required NAME static field, to identify the Widget class and
 * used as an event prefix, to generate class names etc. (set to the
 * class name in camel case).
 */
MultiValueInput.NAME = "multiValueInput";

//Name space of plugin in case host want to access the plugin
MultiValueInput.NS = "mvi";
/*
 * The attribute configuration for the widget. This defines the core user facing state of the widget
 */
MultiValueInput.ATTRS = {
	/*
	 * Array of values selected
	 * @attribute values
	 * @type {array}
	 *
	 * */
	values : {
		value : [],
		validator: function(val) {
		   return Lang.isArray(val);
		}
	},
	/*
	 * Placeholder for inputbox
	 * @attribute placeholder
	 * @type {String}
	 *
	 * */
	placeholder : {
		value : "type here"
	}
};

/* Templates for any markup for multivalue input includes {} tokens, which are replaced through Y.substitute */

MultiValueInput.DIV_TEMPLATE = '<div class="{div_class}"></div>';

//UL tag contain list of values
MultiValueInput.VALUE_HOLDER_TEMPLATE = '<ul class="{ul_class}"></ul>';

//LI tag contain item values
MultiValueInput.LI_TEMPLATE = '<li class="{list_class}">{item}</li>';

//Markup for remove icon
MultiValueInput.ITEM_REMOVE = '<a href="javascript:void(0)" class="{remove_class}">,</a>';

/* MultiValueInput extends the base Widget class */
Y.extend(MultiValueInput, Y.Plugin.Base,
{
	initializer : function() {
		var values = this.get("values"),placeholder=this.get("placeholder");
		this._host = this.get("host");
		this._host.set("placeholder",placeholder);

		//Create Container div that contains list of values
		this._divContent = this._createDivNode();
		this._host.insert(this._divContent, "before");

		//Create un order List
		this._ul = this._createULNode();

		if (values) {
			for(var i=0;i<values.length;i++){
				this._ul.appendChild(this._createListNode(values[i], true));
			}
		}
		this._host.addClass(INPUT);
		this._inputWrapper = this._createListNode("");
		this._inputWrapper.appendChild(this._host);
		this._ul.appendChild(this._inputWrapper);


		this._divContent.appendChild(this._ul);

		// Event Biniding

		if (this._host.ac) {
			//If host has autocomplete plugged
			this._host.ac.after("select", this._appendItem, this);
		} else {
			this._host.after("change", this._appendItem, this);
		}

		this._host.after("blur", function() {
			this._host.set("value", "");
			this._divContent.removeClass("yui3-multivalueinput-border");
		},this);

		this._host.after("focus", function() {
			this._host.set("value", "");
			this._divContent.addClass("yui3-multivalueinput-border");
		},this);

		this._host.on("keydown", this._keyDownHandler, this);

		this._divContent.delegate("click", function(e)
		{
			this._removeItem(e.currentTarget.ancestor("." + LIST_ITEM));
		},
		"." + REMOVE, this);
	},

	/**
	 * Generate Markup for UL tag
	 * @method _keyDownHandler
	 * @protected
	 * @param {Event}
	 */

	_keyDownHandler:function(/* Event */ e){
		var allList,lastItem, lastItemIndex;
		if(e.keyCode !== 8){
			return;
		}
		allList=this._ul.get("children");
		lastItemIndex=allList.size()-2;
		lastItem=allList.item(lastItemIndex);
		if(!this._host.get("value")){
			if(this._pendingDelete){
				this._removeItem(lastItem, lastItemIndex);
				this._pendingDelete = false;
			}
			else{
				lastItem.addClass("yui3-multivalueinput-pendingdelete");
				this._pendingDelete = true;
			}
		}
	},

	/**
	 * Generate Markup for UL tag
	 * @method _createULNode
	 * @protected
	 * @return {Node}
	 */

	_createULNode : function() {
		return Node.create(Y.substitute(
				MultiValueInput.VALUE_HOLDER_TEMPLATE, {
					ul_class : UL
				}));
	},

	/**
	 * Generate Markup for list tag
	 * @method _createListNode
	 * @protected
	 * @param index {int} the section index
	 * @return {Node}
	 */

	_createListNode : function(
			/* String */ item,
			/* boolean */ isListItem)
	{
		var listNode, anchorNode;
		if (isListItem) {
			anchorNode = Node.create(Y
					.substitute(MultiValueInput.ITEM_REMOVE, {
						remove_class : REMOVE
					}));
			listNode = Node.create(Y.substitute(
					MultiValueInput.LI_TEMPLATE, {
						item : item,
						list_class : LIST
					}));
			listNode.appendChild(anchorNode);
			listNode.addClass(LIST_ITEM);
		} else {
			listNode = Node.create(Y.substitute(
					MultiValueInput.LI_TEMPLATE, {
						item : item,
						list_class : LIST
						}));
		}
		return listNode;
	},

	/**
	 * Generate Markup for div tag
	 * @method _createDivNode
	 * @protected
	 * @return {Node}
	 */

	_createDivNode : function() {
		return Node.create(Y.substitute(MultiValueInput.DIV_TEMPLATE, {
			div_class : DIVCONTENT
		}));
	},

	/**
	 * Get the index of remove item
	 * @method _getListIndex
	 * @protected
	 * @param {Node}
	 * @return {index}
	 */

	_getListIndex : function(listNode) {
		var allList=this._ul.get("children"),size=allList.size();
		for(var i=0;i<size;i++){
			if(listNode.compareTo(allList.item(i))){
				return i;
			}
		}
		return -1;
	},

	/**
	 * add the item in to the list
	 * @method _appendItem
	 * @protected
	 */

	_appendItem : function() {
		var val = this._host.get("value");
		this._inputWrapper.insert(this._createListNode(val, true), "before");
		this._addValue(val);
		this._host.set("value", "");
	},

	/**
	 * remove the item from the list
	 * @method _removeItem
	 * @protected
	 * @param {Node}
	 */

	_removeItem : function(/* Node */selectedListNode, /* int */ idx) {
		var index = idx || this._getListIndex(selectedListNode);
		this._host.focus();
		selectedListNode.get("parentNode")
				.removeChild(selectedListNode);
		this._removeValue(index);
	},

	/**
	 * Add value to value list
	 * @method _addValue
	 * @protected
	 */

	_addValue : function(val) {
		var values = this.get("values");
		values.push(val);
		this.set("values", values.slice(0));	// force change event
	},

	/**
	 * remove value from value list
	 * @method _removeValue
	 * @protected
	 * @param {index}
	 */

	_removeValue : function(/* int */ index) {
		var values = this.get("values"), val = values[index];
		values.splice(index,1);
		this.set("values", values.slice(0));	// force change event
	}
});

Y.MultiValueInput = MultiValueInput;
Y.namespace('Plugin').MultivalueInput = MultiValueInput;


}, 'gallery-2013.05.29-23-38', {"skinnable": "true", "requires": ["plugin", "substitute", "node"]});
