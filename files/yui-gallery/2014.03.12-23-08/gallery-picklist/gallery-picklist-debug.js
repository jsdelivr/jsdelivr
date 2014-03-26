YUI.add('gallery-picklist', function(Y) {

/**
 * PickList Widget :
 *   
 * Requires:  3.5.0pr2 at least, "event", "button", "cssbutton"
 * 
 * @module gallery-picklist 
 **/
    var Lang 		= Y.Lang,
        fnReplacer 	= Lang.sub;

/** 
 * @class PickList
 * @extends Widget
 **/
     function PickList(config) {
        PickList.superclass.constructor.apply(this, arguments);
    }

    PickList.NAME = "picklist";

    PickList.ATTRS = {

	  	/**
	     The Array to populate the SELECT / OPTIONS on the left-side, herein referred to
	     as "options" in this widget.
	     
	     Elements of this array aren't required to have members { text:'', value:''}, 
	     if the members are different they can be mapped to the expected settings using 
	     the "optionsMap" attribute. 
	     
	     If the members of this array are non-object single-items, they are assumed to be 
	     the "text" item, and the "value" will also be set to this item.
	     
	     @attribute options
	     @type {Array}
	     @default []
	     **/
		options : {
        	value : 	[], 
        	validator : Lang.isArray
        },


	  	/**
	     The Array to populate the SELECT / OPTIONS on the right-side, herein referred 
	     to as "selected" in this widget.  For example, if a FORM is opened with default 
	     multi-selected items, they would be provided in this attribute as an array.
	     
	     Elements of this array aren't required to have members { text:'', value:''}, 
	     if the members are different they can be mapped to the expected settings using 
	     the "optionsMap" attribute. 

	     If the members of this array are non-object single-items, they are assumed to be 
	     the "text" item, and the "value" will also be set to this item.
	     
	     @attribute selected
	     @type {Array}
	     @default []
	     **/
        selections : {
        	value : 	[],
        	validator : Lang.isArray
        },

        
	  	/**
	     An object having members "value, text, title" that defines the mapping 
	     between the provided "options" array data and the expected parameters of 
	     the JavaScript &lt;option&gt; (value, text title).
	      
	     @attribute optionsMap
	     @type {Object}
	     @default { value:'value', text:'text', title:'title' }
	     **/
        optionsMap : {
        	value : 	{ value:'value', text:'text', title:'title' },
        	writeOnce : true,
        	validator:	function(o) {
        					if ( !Lang.isObject(o) ) return false;
        					if ( o.text && !o.value ) 
        						o.value = 'value';
        					else if ( o.value && !o.text )
        						o.text = 'text';
        					if ( !o.title ) o.title = 'title';
        					return true; 
        				}
        },
   		
   		
	  	/**
	     Classname to be applied to the "options" <SELECT> element, usually used to 
	     specify the "width" of the element. 
	      
	     @attribute optClassName
	     @type {String}
	     @default ''
	     **/
   		optClassName : {
        	value : 	'',
        	validator : Lang.isString
   		},


	  	/**
	     Classname to be applied to the "selected" <SELECT> element, usually used to 
	     specify the "width" of the element. 
	      
	     @attribute selClassName
	     @type {String}
	     @default ''
	     **/
   		selClassName : {
        	value : 	'',
        	validator : Lang.isString
   		},
        
        
	  	/**
	     The DOM ID element of the "template" to be used for defining the OPTIONS, SELECTIONS, 
	     and the BUTTONS.
	      
	     Expected replacable placeholder tokens positioned within the "template" are identified as;
	     
	     	{OPTIONS_CONTAINER}		:  Left-hand side "Options" <select> placeholder
	     	{SELECTIONS_CONTAINER}	:  Right-hand side "Selected" <select> placeholder
	     	{ACTION_ALL}			:  Placeholder for the "Add All" button
 	     	{ACTION_ONE}			:  Placeholder for the "Add One" button
	     	{ACTION_BACK}			:  Placeholder for the "Remove One" button
	     	{ACTION_ALLBACK}		:  Placeholder for the "Remove All" button
	       
	     @attribute template
	     @type {String}
	     @default ''
	     **/
        template : {
        	value : 	'',
        	validator : Lang.isString
        },
        

	  	/**
	     Attribute allows specifying the "button" type to be used during construction of the
	     Widget template.  Currently supported are HTML <button>, a Y.Button object, a Y.Button 
	     CSSButton, and a simple HTML <a> link.
	     
	     Recognized settings are 'htmlbutton', 'ybutton', 'cssbutton', 'link'
	      
	     @attribute buttonType
	     @type {String}
	     @default 'htmlbutton'
	     **/
		buttonType : {
			value : 	'htmlbutton',		
			writeOnce:	true,
			validator : function(o) {
							if ( Lang.isString(o) ) {
								if ( o.search(/htmlbutton|ybutton|cssbutton|link/i) !== -1) 
									return true;
							}
							return false;
						}
		},

        
	  	/**
	     The source "ID" of the container for this widget, REQUIRED. 
	     @attribute srcNode
	     @type {String}
	     @default null
	     **/
		srcNode : {
			value : 	null,
			validator : Lang.isString,
			writeOnce:	true	
		},

		
	  	/**
	     The number of options to display in the left and right side SELECT / OPTIONS control.
	      
	     @attribute selectSize
	     @type {Int}
	     @default 10
	     **/
        selectSize : {
        	value : 	10,
        	validator : Lang.isNumber
        },


	  	/**
	     The default "width" style of the left and right side SELECT / OPTIONS control.
	      
	     @attribute selectSize
	     @type {String}
	     @default '9em'
	     **/
        selectWidth : {
        	value : 	'9em',
        	validator : Lang.isString
        },


	  	/**
	     A flag setting for enabling "stack" mode of this widget.  In "stack" mode 
	     the JS Options are moved from left-to-right individually, so that they can't 
	     be re-used inadvertantly.  
	     
	     For example, "Add One" from the left option MOVES the option to the right-side 
	     "selections".  If "Remove One" is chosen, the right-side selected item is returned
	     to the bottom of the left-hand side options.  (Can't currently return it to the 
	     index of where it came from ... see "preserveOrder"). 
	      
	     @attribute stackMode
	     @type {Boolean}
	     @default false
	     **/
		stackMode : {
			value : 	false,
			writeOnce:	true,
			validator : Lang.isBoolean
		},


	  	/**   
	  	 NOT IMPLEMENTED AT THIS TIME
	  	  
	     A flag setting for preserving the original order of the options, when add or 
	     remove actions are taken.   With "preserveOrder" false, all items are added to the 
	     bottom of the left / right side HTML SELECT / OPTIONS.  If set to TRUE, the 
	     options are returned to proper order from the original "options" setting.
	     
	     This only has relevance when "stackMode" is TRUE.

	     @attribute preserveOrder
	     @type {Boolean}
	     @default false
	     **/
		preserveOrder : {
			value : 	false,
			writeOnce : true,
			validator : Lang.isBoolean	
		},
	
		
	  	/**
	     The label to be used for the BUTTON face for "Add All" action. 
	     @attribute actionLabelAll
	     @type {String}
	     @default 'Add All'
	     **/
		actionLabelAll : {
        	value : 	'Add All', 
        	validator : Lang.isString
		},


	  	/**
	     The label to be used for the BUTTON face for "Add One" action. 
	     @attribute actionLabelOne
	     @type {String}
	     @default 'Add'
	     **/
		actionLabelOne : {
        	value : 	'Add',
        	validator : Lang.isString
		},


	  	/**
	     The label to be used for the BUTTON face for "Remove" action. 
	     @attribute actionLabelRmv
	     @type {String}
	     @default 'Remove'
	     **/
		actionLabelRmv : {
        	value : 	'Remove',
        	validator : Lang.isString
		},


	  	/**
	     The label to be used for the BUTTON face for "Remove All" action. 
	     @attribute actionLabelRmvAll
	     @type {String}
	     @default 'Remove All'
	     **/
		actionLabelRmvAll : {
        	value : 	'Remove All',
        	validator : Lang.isString
		}
		
    };

    PickList.INPUT_CLASS = Y.ClassNameManager.getClassName( PickList.NAME, "value");


    Y.extend( PickList, Y.Widget, {

	/*  Define some static properties  */
	
		/**
		 * The default "template" to use for rendering of this widget.
		 * @property TMPL_control
		 * @type String
		 * @protected
		 */
		TMPL_control:   '<table><tr><td valign="top">Available:<br/>{OPTIONS_CONTAINER}</td><td valign="middle">'
						+'{ACTION_ALL}<br/>{ACTION_ONE}<br/>{ACTION_BACK}<br/>{ACTION_ALLBACK}</td><td valign="top">'
						+'Selected:<br/>{SELECTIONS_CONTAINER}</td></tr></table>',
		
		/**
		 * The template to use for constructing the HTML <SELECT> elements for left/right side 
		 * @property TMPL_inputs
		 * @type String
		 * @protected
		 */
		TMPL_inputs :	'<select size="{size}" class="{className}" multiple="1"></select>',

		/**
		 * The template to use for constructing the HTML <SELECT> elements for left/right side 
		 * @property TMPL_inputs
		 * @type String
		 * @protected
		 */
		TMPL_option :	'<option value="{optValue}" title="{optTitle}">{optText}</option>',

		/**
		 * The template to use for constructing the HTML <BUTTON> elements within 
		 * the widget (for buttonType='htmlbutton' or 'ybutton')
		 * @property TMPL_button
		 * @type String
		 * @protected
		 */
		TMPL_button :	'<button class="{className}">{content}</button>',

		/**
		 * The template to use for constructing the HTML <button> elements within 
		 * the widget (for buttonType='cssbutton') 
		 * @property TMPL_cssbtn
		 * @type String
		 * @protected
		 */
        TMPL_cssbtn : 	'<button class="yui3-button {className}">{lcontent}<span class="yui3-button-icon yui3-button-icon-{subName}"></span>{rcontent}</button>',

		/**
		 * The template to use for constructing the HTML <A> elements within 
		 * the widget (for buttonType='link') 
		 * @property TMPL_alink
		 * @type String
		 * @protected
		 */
		TMPL_alink  :	'<a class="{className}" href="javascript:void(0);">{content}</a>',

        
		/**
		 * @property CLASS_ACTION
		 * @type Object
		 * @private
		 */
        CLASS_ACTION : 	'action',
		
		/**
		 * Holder for the Y.Node of the SELECT left-hand side "available" options.
		 * @property _optionNode
		 * @type Object
		 * @private
		 */
		_optionNode : null,		

		/**
		 * Holder for the Y.Node of the SELECT right-hand side "selected" or chosen options
		 * @property  _selectNode
		 * @type Object
		 * @private
		 */
		_selectNode : null,		
		
		/**
		 * Holder for the "action" click event handlers
		 * @property _eventHandles
		 * @type Array
		 * @private
		 */
		_eventHandles : [],		

		/**
		 * Holder for the Y.Button Widget instances (if "buttonType" === "ybutton" )
		 * @property {Array} _ybuttons
		 * @private
		 */
		_ybuttons : [],			
		
		/**
		 * Holder for the original OPTIONS order, to be used with "preserveOrder"  (NOT IMPLEMENTED)
		 * @property {Array} _optOrder
		 * @private
		 */
		_optOrder :[],
		
	
	/* ===================   Widget Public methods  =====================   */
	
		/*
		 * @method initializer
		 * @param config {Object} Configuration object literal for the Accordion
		 * @protected
		 */
        initializer: function( config ) {
        	this._eventHandles = [];
        	this._ybuttons = [];
        	this._optOrder = [];
        	this._optionNode = null;
        	this._selectNode = null;
			return true;
        },


		/*
		 * @method destructor
		 * @protected
		 */
        destructor : function() {
		//
		//  If Y.Buttons were created, destroy them 
		//
       		Y.Array.each( this._ybuttons, function(item) {
       			item.destroy();
       		});
       		this._ybuttons.length = 0;
		//
		//  Clear out the button handlers
		//	       
       		Y.Array.each( this._eventHandles, function(item) {
       			item.detach();
       		});
       		this._eventHandles.length = 0;
       	//
       	//  Clean-up and exit
       	//	
       		this._optOrder.length = 0;
       		this._optionNode.destroy();
       		this._selectNode.destroy();
       		
       		return true;
        },


		/*
		 * @method renderUI
		 * @public
		 */
        renderUI : function() {
        
        // create the Select boxes and Buttons
            this._renderInput();	
		
		// load options, if defined.
			if ( this.get('options') ) this._loadOptions();
			
		// set focus to Left-hand side control 	
           	this._optionNode.focus();
            
            this.fire( 'render' );
        },


		/**
		 Method that binds the button pushes to their handlers.  Keep a reference to the handler 
		 in this._eventHandles so we can detach them later.
		 
		 @method bindUI
		 @public
		 **/
        bindUI : function() {

        	if ( this.get('buttonType') === 'ybutton' ) {
        		var ybtn = this._ybuttons;
	        	if ( ybtn[0] ) this._eventHandles.push( ybtn[0].on("click", Y.bind( this._onButtonAll, this) )  );
	        	if ( ybtn[1] ) this._eventHandles.push( ybtn[1].on("click", Y.bind( this._onButtonOne, this) )  );
	        	if ( ybtn[2] ) this._eventHandles.push( ybtn[2].on("click", Y.bind( this._onButtonBack, this) )  );
	        	if ( ybtn[3] ) this._eventHandles.push( ybtn[3].on("click", Y.bind( this._onButtonAllBack, this) )  );
        		
        	} else {
	        	var cbox = this.get('contentBox'),
	        		btna = cbox.one('.'+this.getClassName( this.CLASS_ACTION,'all')),
	        		btno = cbox.one('.'+this.getClassName( this.CLASS_ACTION,'one')),
	        		btnb = cbox.one('.'+this.getClassName( this.CLASS_ACTION,'rmv')),
	        		btnab = cbox.one('.'+this.getClassName( this.CLASS_ACTION,'rmvall'));
        		
	        	if ( btna ) this._eventHandles.push( btna.on("click", Y.bind( this._onButtonAll, this) )  );
	        	if ( btno ) this._eventHandles.push( btno.on("click", Y.bind( this._onButtonOne, this) )  );
	        	if ( btnb ) this._eventHandles.push( btnb.on("click", Y.bind( this._onButtonBack, this) )  );
	        	if ( btnab ) this._eventHandles.push( btnab.on("click", Y.bind( this._onButtonAllBack, this) )  );
        		
        	}
        	
        	this.after( 'optionsChange', Y.bind(this._loadOptions, this, false ) );
        	this.after( 'selectionsChange', Y.bind(this._loadOptions, this, true ) );
			
			return true;        	
        },

        syncUI : function() {
        },


		/**
		 Method to clear the left-hand side "options" SELECT OPTIONS completely. 
		 @method clearOptions
		 @public 
		 @return true
		 **/
		clearOptions : function() {
			this._optOrder.length = 0;
			return this._clearOptions( this._optionNode );
		},


		/**
		 Method to clear the right-hand side "selections" SELECT OPTIONS completely. 
		 @method clearSelections
		 @public 
		 @return true
		 **/
		clearSelections : function() {
			return this._clearOptions( this._selectNode );
		},


		/**
		 * Returns the current items in the "right side" SELECT OPTIONS box.
		 * 
		 * @method getSelections
		 * @public
		 * @return {Array} An array of options Objects, members are { value, text, title };
		 */
		getSelections : function() {
			var snode = this._selectNode,
				rtn   = [];
			snode.get("options").each( function(item,index) {
				rtn.push( { 
					value:	item.get('value'), 
					text:	item.get('text'), 
					title:	item.get('title') 
				}); 
			});
			return rtn;
		},


	/* ===================   Widget Private methods  =====================   */


        /**
		 Method to create the DOM elements for this Widget, including two HTML <SELECT> elements,
		 and four BUTTONS to operate on the Widget.
		 
		 The method uses the "template" attribute if set for positioning of the above UI elements,
		 if none is provided a default template is used.
		 
		 @method _renderInput
		 @protected
		 @return true
         **/
		_renderInput : function() {
            var cbox = this.get("contentBox"),
            	tmpl = ( this.get("template") ) ? Y.one( this.get("template") ).getContent() : null;

			var widget_tmpl = tmpl || this.TMPL_control;	// use default if none provided ...

			cbox.addClass( this.getClassName() );
			
			var btna_html, btno_html, btnb_html, btnab_html, opt_html, sel_html;
        //
        //  Create the HTML SELECT boxes ...
        //    	
        	opt_html = fnReplacer( this.TMPL_inputs, {
        		size : this.get('selectSize'),
        		className : this.getClassName('options') + ' ' + this.get('optClassName')
        	});

        	sel_html = fnReplacer( this.TMPL_inputs, {
        		size : this.get('selectSize'),
        		className : this.getClassName('selected') + ' ' + this.get('selClassName')
        	});

        //
        //  Create the BUTTONS ...
        //    	
    		if ( this.get('buttonType') === 'htmlbutton' || this.get('buttonType') === 'ybutton' ) {
            	btna_html = this._createHtmlButton( 'all', 'actionLabelAll' );
            	btno_html = this._createHtmlButton( 'one', 'actionLabelOne' );
            	btnb_html = this._createHtmlButton( 'rmv', 'actionLabelRmv' );
            	btnab_html= this._createHtmlButton( 'rmvall', 'actionLabelRmvAll' );
    		}

    		if ( this.get('buttonType') === 'link' ) {
            	btna_html = this._createALinkButton( 'all', 'actionLabelAll' );
            	btno_html = this._createALinkButton( 'one', 'actionLabelOne' );
            	btnb_html = this._createALinkButton( 'rmv', 'actionLabelRmv' );
            	btnab_html= this._createALinkButton( 'rmvall', 'actionLabelRmvAll' );
	   		}

       		if ( this.get('buttonType') === 'cssbutton' ) {
    			btna_html = this._createCssButton( 'all', null, 'actionLabelAll' );
    			btno_html = this._createCssButton( 'one', null, 'actionLabelOne' );
    			btnb_html = this._createCssButton( 'rmv', null, 'actionLabelRmv' );
    			btnab_html = this._createCssButton( 'rmvall', null, 'actionLabelRmvAll' );
        	}

        //
        //  Populate the template
        //    	
           	cbox.setContent( fnReplacer( widget_tmpl, {
        		OPTIONS_CONTAINER : 	opt_html || '',            		
        		SELECTIONS_CONTAINER: 	sel_html || '',
        		ACTION_ALLBACK : 		btnab_html || '',            		
        		ACTION_ALL : 			btna_html || '',
        		ACTION_ONE : 			btno_html || '',
        		ACTION_BACK : 			btnb_html || ''
        	}) );

		//
		//  Get references to the nodes of the widget after they were created
		//            	
        	this._optionNode = cbox.one('.'+this.getClassName('options'));
        	this._selectNode = cbox.one('.'+this.getClassName('selected'));
        	
        	if ( this._optionNode && !this.get('optClassName') )
        		this._optionNode.setStyle('width', this.get('selectWidth') );

        	if ( this._selectNode && !this.get('selClassName') )
        		this._selectNode.setStyle('width', this.get('selectWidth') );
        
        	this._optionNode.set('selectedIndex',-1);
        	this._selectNode.set('selectedIndex',-1);
        	
		// If Button widgets are reqd, go through and build them 
		//   now since the placeholders are in markup
		
    		if ( this.get('buttonType') === 'ybutton' ) {
    			
            	this._ybuttons.push( this._createYButtonNode( cbox.one('.'+this.getClassName( this.CLASS_ACTION,'all')) ) );
            	this._ybuttons.push( this._createYButtonNode( cbox.one('.'+this.getClassName( this.CLASS_ACTION,'one')) ) );
            	this._ybuttons.push( this._createYButtonNode( cbox.one('.'+this.getClassName( this.CLASS_ACTION,'rmv')) ) );
            	this._ybuttons.push( this._createYButtonNode( cbox.one('.'+this.getClassName( this.CLASS_ACTION,'rmvall')) ) );
        
    		}
        
			return true;
        },


		/**
		 Method creates an <option> Node instance based upon an input object that includes 
		 value, text and title properties.
		 (This is in lieu of using JS new Option() language ...) 
		 
		 @method _createOption
		 @param {Object} opt_obj	Object with members "value", "text" and "title"
		 @protected 
		 @return {Node} instance of Option object
		 **/
		_createOption : function( opt_obj ) {
			var opt_html = fnReplacer( this.TMPL_option, {
				optValue : opt_obj.value || '',
				optText  : opt_obj.text || '',
				optTitle : opt_obj.title || ''
			});
			return opt_node = Y.Node.create(opt_html); 
		},


		/**
		 Method to load the left-hand side "options" HTML <SELECT> element with the 
		 user-defined options array.
		 
		 @method _loadOptions
		 @protected 
		 @return {Number} options.length
		 **/
		_loadOptions : function( isSel ) {
			isSel = ( isSel === undefined ) ? false : isSel;
			var onode = ( isSel ) ? this._selectNode : this._optionNode,
				onode_dom = onode.getDOMNode(),
				opts  =  ( isSel ) ? this.get('selections') : this.get('options');
		//
		//  If already set, clear out the OPTIONS ...
		//			
			if ( opts ) {
				if ( !isSel ) this.clearOptions();
				this.clearSelections();
			}
			
		//
		//  Loop over each one, adding it to the optionsNode 
		//	
			Y.Array.each( opts, function(item) {
				var sopt = this._optStdFormat( item ),		// returns "sopt" as standard {value, text, title} format
					opt_node = this._createOption(sopt);							
 				
 		//		if (  Y.UA.ie && Y.UA.ie<9 ) {
 		//			onode_dom.options[onode_dom.options.length] = opt_node;
 		//		} else
 					onode.append( opt_node );
				
			//
			//  If "stack" mode is set, then place the Option identifier in our sort array for later use.
			//	
				if ( this.get("stackMode") && this.get("preserveOrder") ) {
					this._optOrder.push( sopt.value || sopt.text ); 	
				}
			}, this);
			
			this.fire('load',{
				obj: this,
				opts: opts
			});
			
			return opts.length;
		},


		/**
		 Method to clear the right-hand side "selections" OPTIONS completely. 
		 @method _clearOptions
		 @protected
		 @return true
		 **/
		_clearOptions : function( ynode ) {
			ynode = ynode || this._optionNode;
			ynode.getDOMNode().options.length = 0;
			return true;
		},


		/**
		 Internal method to normalize the 'text', 'value', and 'title' data based upon the input 
		 "optionsMap" of the "options" attribute.  Returns an object that can be used directly by 
		 the JS new Option( text, value ) command.
		  
		 @method _optStdFormat
		 @protected
		 @return {Object} An object that contains { value, text, title } for defining the JS Option
		**/
		_optStdFormat : function( item ) {
			var	omap    = this.get("optionsMap"),
				ovalue  = null,
				otext   = null,
				otitle  = null;
	
			if ( Lang.isObject(item) ) {
				ovalue = item[ omap.value ] || null;
				otext  = item[ omap.text ] || null;
				otitle = item[ omap.title ] || null;
				
			} else {
				ovalue = item;
				otext  = item;
			}

		// If the option "value" is not set, set it as the "text"				
			ovalue = ovalue || otext;

			return { value:ovalue, text:otext, title:otitle };			
		},


		/**   METHOD IS INCOMPLETE !!!
		 Internal method intended to return the provided opt_node object back to the "options" 
		 SELECT OPTION in the original defined order. 
		 This would only be used for "stackMode" and "preserveOrder" true. 
		  
		 @method _returnOptionPerOrder
		 @protected
		 @return 
		**/
		_returnOptionPerOrder : function( opt_node ) {
			var onode = this._optionNode,
				snode = this._selectNode,
				order = this.get("preserveOrder");
			
			var optValue = opt_node.get('value'),
				optText  = opt_node.get('text');
			
			var okey = optValue || optText || null;
			if ( okey && this.get("preserveOrder") && this.get("stackMode") ) {
				var oindex = this._optOrder.indexOf(opt_node);
				//onode.options.item(oindex).
			}				
		},


        /**
		 Creates a Y.Button object by using the input "bnode" as the srcNode of the Button.
		 @method _createYButtonNode
		 @param {String || Node} bnode,  The Node of the HTML <button> to use to create Y.Button 
		 @protected
		 @return {Y.Button} object
         **/
        _createYButtonNode : function( bnode ) {
            var btn = new Y.Button({
            	srcNode : bnode
            });
            
            return btn;
        },


        /**
		 Creates an HTML <button> object that can be used with the "cssbutton" module of 3.5.0.
		 Uses the internal "TMPL_cssbtn" property as a template for the HTML. 
		 
		 The cssButton design uses a <span> to specify the location of the IMG, on either the 
		 right or left side of the button contents (i.e. "Click Me").
		 
		 So this method defines either lcontent or rcontent to specify which side of the "content" 
		 the IMG is defined on.
		    
		 @method _createCssButton
		 @param {String} subname, The sub-class name to be added to the button class		 
		 @param {String} lcontent, The sub-class name to add to the left-hand side IMG span class		 
		 @param {String} rcontent, The sub-class name to add to the right-hand side IMG span class		 
		 @return {HTML} code for <button> element
		 @protected
         **/
        _createCssButton : function( subname, lcontent, rcontent  ) {
        	var left = ( lcontent ) ? this.get(lcontent) : '';
        	var right = ( rcontent ) ? this.get(rcontent) : '';
        	
           	return fnReplacer( this.TMPL_cssbtn, {
           		className : this.getClassName( this.CLASS_ACTION, subname ),
           		subName : 	subname,
           		lcontent : 	left || '',
           		rcontent : 	right || ''
           	});
        },


        /**
		 Creates an HTML <button> object that will be inserted into the template.  The "subname" 
		 is a sub-class name to be appended to the <button> class to identify it.
		 Uses the internal "TMPL_button" property as a template for the HTML. 
		 
		 @method _createHtmlButton
		 @param {String} subname,  The sub-class name to be appended to the "class" for this button 
		 @param {String} content,  The contents of the button face (i.e. "Click Me")
		 @return {HTML} code for <button> element
		 @protected
         **/
        _createHtmlButton : function( subname, content ) {
           	return fnReplacer( this.TMPL_button, {
            		'content' : this.get(content),
            		className : this.getClassName( this.CLASS_ACTION, subname ) 
            	});
        },
		

        /**
		 Creates an HTML <a> link object that will be inserted into the template.  The "subname" 
		 is a sub-class name to be appended to the <a> class to identify it.  Uses the internal 
		 "TMPL_alink" property as a template for the HTML. 
		 
		 @method _createALinkButton
		 @param {String} subname,  The sub-class name to be appended to the "class" for this item 
		 @param {String} content,  The contents of the <a> text node (i.e. "Click Me")
		 @return {HTML} code for <button> element
		 @protected
         **/
        _createALinkButton : function( subname, content ) {
           	return fnReplacer( this.TMPL_alink, {
            		'content' : this.get(content),
            		className : this.getClassName( this.CLASS_ACTION, subname )
            	});
        },


        /**
		 Returns all of the HTML <select> OPTIONS, as an array of objects containing an index, optionObject 
		 format.  This is really intended to return the right-hand side "selections" Options element, 
		 irregardless of whether an Option is "selected" / highlighted or not.
		 
		 @method _getSelectedOptions
		 @param {String} sel_node,  The SELECT object to get all options of (whether "selected" flag is set or not) 
		 @return {Array} of Object containing the right-option elements as {index, optionObj} format
		 @protected
         **/
		_getSelectedOptions : function( sel_node ) {
			var rtn = [];
			sel_node.get('options').each( function( item,index){
				if ( item.get('selected') === true ) 
					rtn.push({ 'index':index, optionObj:item} ); 
			});
			return rtn;
		},

		
        /**
		 Utility function to avoid duplicate adding an option to the right-hand side "selections" Options element. 
		 This method checks if the "opt_node" already exists in the "selections" Options, if so it returns TRUE, 
		 if not it returns FALSE.
		 
		 @method _selOptionExists
		 @param {Node} opt_node,  The Option node to check for existence. 
		 @return true or false,  If the opt_node already exists in the Options array
		 @protected
         **/
		_selOptionExists : function( opt_node ) {
			var snode = this._selectNode,
				oval  = opt_node.get('value'),
				rtn	  = false;
			
			snode.get('options').some(function(item) {
				if ( item.get('value') === oval ) {
					rtn = true;
					return true;
				}
			},this);
			
			return rtn;
		},


        /**
		 The "Add All" button click handler. 
		 Adds all of the "Available" options to the "selected" Options, checking to avoid duplicates.
		 This method checks if the Widget is a "stack", if so, it moves the Option from left to right.
		 
		 @method _onButtonAll
		 @param {EventHandle} e,  The button's Eventhandle from the button .on "click" event 
		 @return nothing
		 @protected
         **/
		_onButtonAll : function(e) {
			var onode = this._optionNode,
				snode = this._selectNode,
				onode_opts = onode.get('options');
		
			onode_opts.each( function(item) {
				if ( this._selOptionExists(item) ) return;	// if option exists in "selected", bail
				if ( this.get('stackMode') ) 
					snode.append( item );
				else 
					snode.append( item.cloneNode(true) );
			}, this);
			
			this.fire( 'clickAll', {
				evt: 	e, 
				opts: 	onode_opts
			});
		},


		_findInsertIndex : function( opt_item, opt_dest ) {
			var insertIndex = -1;
		//	opt_dest.some( function(item, index){
		//		if ( )
		//	});
		
			var opso = this._optOrder,
				opsd = [];
				
			opt_dest.get('options').each(function(item){
				opsd.push( item.get('value') );
			});
			
			var i=0;
			
			
		},



        /**
		 The "Add One" button click handler. 
		 Adds the DOM selected option(s) from the "Available" options to the right-hand side HTML <select>, 
		 checking to avoid duplicates. This method checks if the Widget is a "stack", if so, it moves the 
		 Option from left to right.
		 
		 @method _onButtonOne
		 @param {EventHandle} e,  The button's Eventhandle from the button .on "click" event 
		 @return nothing
		 @protected
         **/
		_onButtonOne : function(e) {
			var onode = this._optionNode,
				snode = this._selectNode;
			
			var osel = this._getSelectedOptions( onode );
			Y.Array.each( osel, function(item) {
				this._findInsertIndex(item, snode );
				item.optionObj.set('selected', false);
				if ( this._selOptionExists(item.optionObj) ) return;	// if option exists in "selected", bail

				if ( this.get('stackMode') ) 
					snode.append( item.optionObj );				
				else
					snode.append( item.optionObj.cloneNode(true) );
			}, this);
			
			this.fire('clickOne', {
				evt:	e,
				opts:	osel				
			});
		},


        /**
		 The "Remove One" button click handler. 
		 Removes the DOM selected option(s) from the "Selections" right-side options.  This method checks if the 
		 Widget is a "stack", if so, it moves the Option from right to left, otherwise it destroys it.
		 
		 @method _onButtonBack
		 @param {EventHandle} e,  The button's Eventhandle from the button .on "click" event 
		 @return nothing
		 @protected
         **/
		_onButtonBack : function(e) {
			var onode = this._optionNode,
				snode = this._selectNode;
			
			var ssel = this._getSelectedOptions( snode );
			Y.Array.each( ssel, function(item) {
				this._findInsertIndex(item, onode );
				
				item.optionObj.set('selected', false);
				if ( this.get('stackMode') ) 
					onode.append( item.optionObj );				
				else 
					item.optionObj.remove();
			}, this);
			
			this.fire('clickRemove', {
				evt:	e,
				opts:	ssel
			});
		},


        /**
		 The "Remove All" button click handler. 
		 Removes all of the option(s) from the "Selections" right-side options.  This method checks if the 
		 Widget is a "stack", if so, it moves the Option from right to left, otherwise it destroys it.

		 @method _onButtonAllBack
		 @param {EventHandle} e,  The button's Eventhandle from the button .on "click" event 
		 @return nothing
		 @protected
         **/
		_onButtonAllBack : function(e) {
			var onode = this._optionNode,
				snode = this._selectNode,
				snode_opts = snode.get('options');
		
			snode_opts.each( function(item) {
				if ( this.get('stackMode') ) 
					onode.append( item );
				else 
					item.remove();
			}, this);
			
			this.fire('clickRemoveAll',{
				evt:	e,
				opts:	snode_opts
			});
		}

    });

	Y.PickList = PickList;


}, 'gallery-2012.03.23-18-00' ,{requires:['base-build', 'widget', 'event', 'button', 'cssbutton'], skinnable:false});
