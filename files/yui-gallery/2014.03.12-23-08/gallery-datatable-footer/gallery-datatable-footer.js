YUI.add('gallery-datatable-footer', function(Y) {

/**
 * Extends DataTable base to enable x,y, and xy scrolling.
 * @module datatable
 * @submodule datatable-footer
 */
	var YNode = Y.Node,
	    YLang = Y.Lang,
	    YCreate = Y.Node.create,
	    YUA = Y.UA,
	  	BIG = 1.0e15,
	    DT = "datatable",
		HOST = "host",
	    FOOT_HDG = "heading",
	    FOOT_KEYS = "col_keys",
	    DTRS = "recordset",
	    DTCS = "columnset",
	    FTR = 'dtFooter', 
	    YgetClassName = Y.ClassNameManager.getClassName,
	    CLASS_HEADER = YgetClassName(DT, "hd"),
	    CLASS_LINER = YgetClassName(DT, "liner"),
	    CLASS_FOOTER = YgetClassName(DT, "ft"),
	    CONTAINER_FOOTER = '<div class="'+CLASS_FOOTER+'"></div>';

/**
 * Adds a footer element to DataTable with calculated totals.
 * Works with scrolling plugin.
 * 
 * @class DataTableFooter
 * @extends Plugin.Base
 */
	function DataTableFooter(config) {
	    DataTableFooter.superclass.constructor.apply(this, arguments);
	}
	
	
	Y.mix( DataTableFooter, {
		
		NAME : 	'dataTableFooter',
		NS : 	'footer',			// name attached to DataTable as property, also as dt._plugins.footer
		
		ATTRS : {
		
			/**
	         * Defines the TH portions of the TFOOT.  Currently, this footer only allows 
	         * one TH element to be defined AND it must begin at the first column.  
	         * 
	         * It can be defined with the following options { colspan, label, className }
	         * The "label" option is the Primary TH content, which may include some 
	         * substitutional parameters {ROW_COUNT}, {COL_COUNT}, {DATE} and {TIME} 
	         * 
	         * @attribute heading
	         * @type {Object} as { colspan, label, className }
	         */			
			heading : {
				value : {
					colspan : 1,
					label : '',
					className : ''
				}
			},
		
 			/**
	         * Defines the primary "numeric" columns of the TFOOT element cell for TDs.
	         * The ColumnSet "key" is provided for positioning which TD the item is 
	         * being specified, the "calc" provides the summary calculation that should 
	         * be inserted ( either {SUM}, {MIN}, {MAX}, {AVG}, {MEAN}, {AVERAGE} ).
	         * A "formatter" can be defined along with a "className" for the TD in the footer. 
	         * 
	         * @attribute col_keys
	         * @type {Array} of {Objects} as { key, calc, formatter, className, fnValue }
	         */			
			col_keys : {
				value : [],			// Array of {Objects} as { key, calc, formatter, className, fnValue }
				validator : YLang.isArray
			},
			
 			/**
	         * Defines if the Footer is "fixed" below the Data TBODY (non-scrolling) or 
	         * if it is floating (fixed FALSE) where it is simply appended as TFOOT to
	         * the Data TBODY.
	         * 
	         * @attribute fixed
	         * @type {Boolean}
	         */			
	        fixed : {				 
				value: false,
				validator: YLang.isBoolean 
			},
			
			/**
	         * Defines the default strftime string to be used by default for 
	         * any DATE "calc" parameters. 
	         * 
	         * @attribute dateFormat
	         * @type {String}
	         */			
			dateFormat : {
				value : "%D",
				validator : YLang.isString
			}, 
			
			/**
	         * Defines the default strftime string to be used by default for 
	         * any TIME "calc" parameters. 
	         * 
	         * @attribute timeFormat
	         * @type {String}
	         */			
			timeFormat : {
				value : "%T",
				validator : YLang.isString
			}
		}
	});


	Y.extend( DataTableFooter, Y.Plugin.Base, {

	   /**
	    *  The DIV container element created to hold the footer TABLE
	    * for fixed footer with a scrolling DT.
	    *
	    * @property _tfootContainer
	    * @private
	    * @type {Node}
	    */		
	    _tfootContainer : null,		


	   /**
	    *  The TFOOT node that holds the footer (fixed or floating)
	    *
	    * @property _tfootNode
	    * @private
	    * @type {Node}
	    */		
		_tfootNode : null,		


	   /**
	    *  The TR child node within the TFOOT 
	    *
	    * @property _tfootTrNode
	    * @private
	    * @type {Node}
	    */		
		_tfootTrNode : null,


	   /**
	    *  The TH node within the TFOOT 
	    *
	    * @property _tfootThNode
	    * @private
	    * @type {Node}
	    */		
		_tfootThNode : null,
		
		
		
	   /**
	    * Initialize the Plugin, fire the render/bind/sync calls 
	    * for this plugin after the Host's fire
	    * 
	    * @method initializer
	    * @public 
	    */
		initializer : function() {
	        this.afterHostMethod("renderUI", this.renderPluginUI);
	        this.afterHostMethod("bindUI", this.bindPluginUI);
	        this.afterHostMethod("syncUI", this.syncPluginUI);			
		},
	
		
		/**
		 * Method that refreshes the calculated values within the footer, 
		 * usually not called externally, but "sync'd" to changes in the
		 * underlying RecordSet.
		 * 
		 * @method refreshFooter
		 * @public
		 */
		refreshFooter : function() {
			var dt = this.get(HOST),
				CS = dt.get(DTCS).keys,
				RS = dt.get(DTRS),
				hdg = this.get(FOOT_HDG),
				ckeys = this.get(FOOT_KEYS),
				tdkids = this._tfootNode.all("td");
			
		//
		//  Update the contents of the footer TH element
		//	
			if ( hdg.label ) {
				this._tfootThNode.one("div").setContent( this._doRecordSetMath( null, hdg.label ) ); 
			}
				
		//
		//  Now loop through all of the footer "keys" (in col_keys {Array}),
		//    for each key do the following;
		//		- Find where the key fits into the ColumnSet (not necessarily in column def order!)
		//		- 
		//		
			for(j=0; j<ckeys.length; j++) {
				var ckey = ckeys[j].key,
					tdel = null,
					tdliner = null;
			
			//
			// check if this "key" matches the requested footer "key",
			//   if so ...
			//	     then calculate the field,
			//		 format the field (if defined)
			//		 and insert the content
			//		 and apply CSS classnames if defined
			//
				var csKeyIndex = this._rtnColumnSetKeyIndex( CS, ckey );
				if ( csKeyIndex !== false ) {	// csKeyIndex is the index within ColumnSet
					
					var indx = csKeyIndex - this.get("heading.colspan");		// this is the index of TD from _buildFooterNodes()
					
					if ( indx >= 0 ) {		// this gets us to the TD within the TFOOT section ...
					
					//
					//  Retrieve Nodes for the TD and the DIV liner within the TD
					//	
						tdel = tdkids.item(indx);	// this is the TD	
						tdliner = tdel.one("div");	// this is the DIV liner

						var oValue = parseFloat( this._doRecordSetMath( ckeys[j]) ),	// call to operate on the "calc" field of the col_key
							rtnValue = null;
						
					//
					//  Set the "formatter" for the footer TD contents;
					//		in this order;
					//		- If col_keys defines Formatter OR
					//		- If not, then Formatter on the entire "column" of DT
					//	    - otherwise, no formatting 
					//  ... for no formatting at all, enter formatter:'none' (a string!)
					//	
						var fmtFunction = ckeys[j].formatter || CS[csKeyIndex].get("formatter") || null;
						if ( Y.Lang.isFunction(fmtFunction) )
							rtnValue = fmtFunction.call( this, {value:oValue, record:{}, column:CS[j], tr:null, headers:null, classnames:null} );
						else 
							rtnValue = oValue;
						
						if ( tdliner ) 
							tdliner.setContent( rtnValue );

					}  // end if on indx
				}

			}  // next footer TD
		},
		

		
		/**
		 *  Method Fired after the DT renderUI executes, where the TFOOT is 
		 * constructed and the TH and TD elements and liners are created and
		 * classed.
		 * 
		 * @method renderPluginUI
		 * @public  
		 */
		renderPluginUI: function() {
			this._buildFooterNodes();
	    },
	    
	    
	    /**
	     *  Fired after the DT bindUI executes, sets up bindings to "refresh" 
	     * the TFOOT cell values after a "data-changing" event is invoked by 
	     * the DT Host or the underlying RecordSet.
	     * 
	     * @method bindPluginUI
	     * @public  
	     */
	    bindPluginUI: function () {
	        this.afterHostEvent("recordsetChange", this.syncPluginUI);
	        this.afterHostEvent("recordset:recordsChange", this.syncPluginUI);
	        
			this.afterHostEvent("recordset:update", this.syncPluginUI);
	    },
	 
	 
	    /**
 	     *  Method fired after DT syncUI fires, that updates the values within 
	     * the footer "cells" based upon the current RecordSet.
	     * 
	     * Also, if this is a Scrolling DT with a "fixed" footer (via Config),
	     * then we need to sync the Footer cell widths
	     * 
	     * @method syncPluginUI
	     * @public
	     */
	    syncPluginUI: function() {
	    	this.refreshFooter();
	        if ( this.get( HOST ).hasPlugin('scroll') && this.get("fixed") ) {
	        	this._syncFooterWidths();
	        } 
	    },
    		

		
		/**
		 *  Method to construct the TFOOT DOM elements and the associated 
		 * TR, TH and TD for each footer column.  
		 * Provide capability to define a "fixed" footer for cases of DT 
		 * with Scrolling.  In this circumstance we create a container DIV 
		 * and TABLE and TFOOT element, similar to what is done for the 
		 * Scrolling THEAD.
		 * 
		 * After the TFOOT TR row is built, create the TH (including colspan)
		 * and TD elements and add their respective CSS classes.  
		 * 
		 * @method _buildFooterNodes
		 * @private
		 */
		_buildFooterNodes : function() {
			var dt = this.get(HOST),
				CS = dt.get(DTCS).keys,
				hdg = this.get(FOOT_HDG),
				ckeys = this.get(FOOT_KEYS),
				tfootParent = dt._tableNode;
		//
		//  Check if fixed but non-scrolling, if so ... reset as not fixed
		//		
			if ( !this.get( HOST ).hasPlugin('scroll') && this.get("fixed") )
				this.set("fixed",false);
				
		//
		//  Create the TFOOT, TR and the single TH for the footer
		//	
			if ( this.get("fixed") ) {
			//
			//  For a fixed footer, like for Scrolling DT, we need to add a DIV & TABLE prior to the TFOOT ...
			//
				this._tfootContainer = dt.get("contentBox").appendChild( YCreate( CONTAINER_FOOTER ) );
				tfootParent = this._tfootContainer.appendChild( "<table/>" );
			}

		    this._tfootNode = tfootParent.appendChild( YCreate("<tfoot/>") );
			
		    this._tfootTrNode = this._tfootNode.appendChild( YCreate("<tr/>") );
		    this._tfootThNode = this._tfootTrNode.appendChild( YCreate("<th/>") );
			tfdiv = this._tfootThNode.appendChild( "<div/>" );
			tfdiv.addClass( CLASS_LINER );
		    
		    if ( hdg.colspan )
				this._tfootThNode.setAttribute('colSpan', hdg.colspan );
				
			if ( hdg.className )
				tfdiv.addClass( hdg.className );

		//
		//  Loop through the remaining Columns (after the TH colspan), 
		//   and add TD's and their DIV liners
		//
			var j = ( hdg.colspan ) ? hdg.colspan : 0;	
			
			// sort thru and arrange key columns as either null or footer-based
			for(;j<CS.length; j++) {
				var ckey = CS[j].get('key');
			
			// create the TD and inner DIV for this footer element	
				var tdel = this._tfootTrNode.appendChild( YCreate("<td/>") );
				var tdliner = tdel.appendChild( YCreate("<div/>") );
				tdliner.addClass( CLASS_LINER );

				var index_foot_cols = this._indexOfObj( ckeys, 'key', ckey );
				if ( index_foot_cols !== false ) {
					if ( ckeys[index_foot_cols].className )
						tdliner.addClass( ckeys[index_foot_cols].className );
				}
			}  // next column, j

        	return this._tfootNode;		
		},
		
		/**
		 *  Calculation method for calculating either RecordSet-based summary quantities, 
		 * or for static (non-totaling) quantities.
		 * 
		 * The input can be either "col" which is a column reference or if col is null, 
		 * then a static calculation is done without looping over all records.
		 * 
		 * 
		 * @method _doRecordSetMath
		 * @param {Object} || null [col]	The footer column key object, or null 
		 * @param {String} [cstring]		A string not "bound" to a column, i.e. TH contents
		 * @return {Number}  Calculated data value for insertion into footer cell (unformatted)  
		 * @private
		 */
		_doRecordSetMath : function( col, cstring ) {
			var rtnValue = null;
			var dt = this.get(HOST),
				CS = dt.get(DTCS).keys,
				RS = dt.get(DTRS);
			
		//
		//  If no column is defined, but cstring is then 
		//   this is a non-recordset related item ... 
		//	
			if ( !col && cstring ) {
				
				rtnValue = Y.substitute( cstring, {
					ROW_COUNT: RS.getLength(),
					COL_COUNT: CS.length,
					DATE: Y.DataType.Date.format( new Date(), { format: this.get("dateFormat") }),
					TIME: Y.DataType.Date.format( new Date(), { format: this.get("timeFormat") })
				});
			}
			
		//
		//  If column is {Object}, then this is a col_key object
		//   and we need to calculate RecordSet-based items 
		//	
			if ( Y.Lang.isObject(col) ) {
				
				var ckey = col.key,
					calc = col.calc.toUpperCase(),
					rsum = 0.,
					rmax = -BIG,
					rmin = BIG,
					nitem = 0;
				
				for(var i=0; i<RS.getLength(); i++) {
					var rec = RS.getRecord(i),
						rdata = rec.getValue();
						
					switch( calc ) {
						case "{SUM}":
						case "{MEAN}":
						case "{AVG}":
						case "{AVERAGE}":
							rsum += rdata[ckey];
							if ( rdata[ckey] !== null ) nitem++;
							break;
						case "{MIN}":
							rmin = Math.min(rmin,rdata[ckey]);
							break;		
						case "{MAX}":
							rmax = Math.max(rmax,rdata[ckey]);
							break;							
					}
				}  // next record i
				
			//
			//  Use Y.substitute to stuff the calculated totals 
			//   in the various fields
			//	
				rtnValue = Y.substitute( calc, {
					SUM: rsum,
					MEAN: nitem>0 ? rsum/nitem : '#',
					AVG: nitem>0 ? rsum/nitem : '#',
					AVERAGE: nitem>0 ? rsum/nitem : '#',
					MIN: rmin,
					MAX: rmax,
					ROW_COUNT: RS.getLength(),
					COL_COUNT: CS.length,
					DATE: Y.DataType.Date.format( new Date(), { format: this.get("dateFormat") }),
					TIME: Y.DataType.Date.format( new Date(), { format: this.get("timeFormat") })
				});
				
			}
	
		// TODO:  Allow for user-defined functions via "fnValue" config property				

			return rtnValue;			
		},
		
		
		/**
		 * Helper function to return the ColumnKey index that matches the 
		 * Column key name entered as "key_value".
		 * 
		 * @method _rtnColumnSetKeyIndex
		 * @return {Integer} index of match or false
		 * @private
		 */
		_rtnColumnSetKeyIndex : function( colset, key_value ) {
			for(var i=0; i<colset.length; i++)
				if ( colset[i].get('key') === key_value ) return i;
			return false;
		},

		
		/**
		 * Helper function to search an Array of Objects, returning
		 * the matching index where the object property "key" matches
		 * the entered "value"
		 * 
		 * @method _rtnColumnSetKeyIndex
		 * @return {Integer} index of match or false
		 * @private
		 */
		_indexOfObj : function( arr, key, key_value ) {
			for(var i=0; i<arr.length; i++)
				if ( arr[i][key] === key_value ) return i;
			return false;
		},


		
	   /**
	    *  Adjusts the width of the TFOOT cells matching them to the THEAD cells
	    * 
	    * 
	    * @method _syncFooterWidths
	    * @private
	    */
	    _syncFooterWidths: function() {
	    	var dt = this.get( HOST ),
	    		dt_headerTable = dt.get("contentBox").one('.'+CLASS_HEADER),	
	    		dt_headerCells = dt_headerTable.one("tr").all('.'+CLASS_LINER),	// THEAD liner DIVs
	    		footerCells = this._tfootTrNode.all('.'+CLASS_LINER),			// TFOOT liner DIVs
            
	            // FIXME: Code smell
             	widthProperty = (YUA.ie) ? 'offsetWidth' : 'clientWidth',
             	tcell = null, 
             	tcellWidth = 0.,
             	thColspan = this.get("heading.colspan");
	 
	        if ( dt_headerCells && dt_headerCells.size()) {

			//
			//  Total up the widths for the TH by counting up colSpan THEAD elements ... 
			//				
				tcellWidth = 0.;
				for(var i=0; i<thColspan; i++) 
					tcellWidth += dt_headerCells.item(i).get(widthProperty);
				
				tcell = footerCells.item(0);	// first TFOOT item is the TH liner DIV ...
				
				tcellWidth -= (parseInt( tcell.getComputedStyle('paddingLeft'),10)|0) +
								(parseInt( tcell.getComputedStyle('paddingRight'),10)|0);
								
			// remove the width of one border px between each merged cell ... 
				var fudge = 1;
				tcellWidth += fudge*(thColspan-1);
			
				// assign the width to the TH cell of footer ...	
				tcell.setStyle('width', tcellWidth + 'px');
					
	        //
	        //  Copy the cells widths as-is from THEAD to the TFOOT TD cells ...
	        //
	        	var i =  thColspan; 
	        	for(;i<dt_headerCells.size(); i++) {
					tcellWidth = dt_headerCells.item(i).get(widthProperty);

					var indx = i - thColspan + 1;					
					tcell = footerCells.item(indx);
					tcellWidth -= (parseInt( tcell.getComputedStyle('paddingLeft'),10)|0) +
								(parseInt( tcell.getComputedStyle('paddingRight'),10)|0);
				
					footerCells.item(indx).setStyle('width', tcellWidth + 'px');
	        	}  // end for i	
	        }
	    }
    	
	
	});

	Y.namespace('Plugin');
	Y.Plugin.DataTableFooter = DataTableFooter;


}, 'gallery-2012.01.11-21-03' ,{skinnable:true, requires:['datatable-base', 'datatype', 'plugin']});
