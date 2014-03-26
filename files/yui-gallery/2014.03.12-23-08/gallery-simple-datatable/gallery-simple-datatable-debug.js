YUI.add('gallery-simple-datatable', function(Y) {


/**
 * Simple Datatable is a basic load and sort datatable
 *
 * @class SimpleDatatable
 * @extends Widget
 * @version 1.5.1
 */

var YL = Y.Lang,
    CONTENT_BOX = 'contentBox';


Y.SimpleDatatable = Y.Base.create('sdt', Y.Widget, [],{
  //////  P U B L I C  //////
  /**
   * Override the default template with a table
   * @since 1.0.0
   */
  CONTENT_TEMPLATE : '<table>',

  /**
   * Classname of the widget. Used to prevent multiple look ups
   * @since 1.5.0
   */
  _className : '',

  /**
   * Reference to the caption node if it exists
   * @since 1.5.1
   * @protected
   * @property _caption
   */
  _caption : null,
  
  /**
   * Provides a reference to the table head
   * @since 1.0.0
   */
  tHead : null,

  /**
   * After lookup property to determine if headers have been set already
   * @since 1.3.0
   * @protpery
   * @public
   */
  headersSet : false,

  /**
   * After lookup property to determine if rows have been set already
   * @since 1.3.0
   * @protpery
   * @public
   */
  rowsSet : false,

  /**
   * Set up the sort and rowSelected events and the className
   * @since 1.0.0
   * @param config
   * @method initializer
   */
  initializer : function(config) {
    Y.log('initializer','info','simple-datatable');
    this._className = this.getClassName();
  },

  /**
   * Build the tHead and tBody and append them to the contenBox
   * @since 1.0.0
   * @method renderUI
   */
  renderUI : function() {
    Y.log('renderUI','info','simple-datatable');
	var cb = this.get(CONTENT_BOX),
	    caption = this.get('caption');
		
    this.tHead = Y.Node.create('<thead></thead>');
    this.tBody = Y.Node.create('<tbody></tbody>');
	
	if (caption) {
		if (!this._caption) {
			this._caption = Y.Node.create('<caption />');
			cb.append(this._caption);
		}
		this._caption.setContent(caption);
	}
	
    cb.append(this.tHead).append(this.tBody);
  },
  
  bindUI : function() {
    Y.log('bindUI', 'info','simple-datatable');
	this.after('captionChange', this._afterCaptionChange);
  },

  /**
   * Updates the headers and the rows
   * @since 1.0.0
   * @method syncUI
   */
  syncUI : function() {
    Y.log('syncUI','info','simple-datatable');
    this.setHeaders(this.get('headers'));
    this.setRows(this.get('rows'));
  },

  /**
   * Loops through the header object and builds cells
   * @since 1.3.0
   * @method setHeaders
   * @param headerObj
   * @return this
   * @chainable
   */
  setHeaders : function(headerObj){
    Y.log('setHeaders','info','simple-datatable');
	this._buildHeader(headerObj);
    return this;
  },

  /**
   * Loops through array and builds rows
   * @since 1.0.0
   * @see addRow
   * @method setRows
   * @param arrayOfRows
   * @return this
   * @chainable
   */
  setRows : function(arrayOfRows) {
    Y.log('setRows','info','simple-datatable');
	this._buildRows(arrayOfRows);
    return this;
  },


  /**
   * Removes all header content
   * @since 1.2.0
   * @method clearHeaders
   * @param purge Removes all header data when set to true
   * @return this
   * @chainable
   */
  clearHeaders : function(purge) {
    Y.log('clearHeaders','info','simple-datatable');
    if(purge === true) {
      this.set('headers', {});
    }
    return this.setHeaders();
  },

  /**
   * Removes all rows
   * @since 1.2.0
   * @method clearRows
   * @param purge removes all row data when set to true
   * @return this
   * @chainable
   */
  clearRows : function(purge) {
    Y.log('clearRows','info','simple-datatable');
    if(purge === true) {
      this.set('rows', []);
    }
    return this.setRows();
  },


  //  P RO T E C T E D  //

  
  _buildHeader : function(headerObj) {
    Y.log('_buildHeaders','info','simple-datatable');
    var row = '<tr>',
        cells = '', o, p, count = 0,
        template = this.get('linerTemplate'),
        headerConfig = {
          linerClasses : this._className + '-liner',
          labelClasses : this._className + '-label',
          label : ''
        };

    if(headerObj) {
		if(YL.isObject(headerObj)) {
		  for(o in headerObj) {
			cells += '<th class="' + this._className + '-col-' + (count++) + ' ' + this._className + '-col-' + o + '"';
			cells += ' key="' + o +'"';
				 
			if(YL.isObject(headerObj[o])) {
			  for(p in headerObj[o]) {
				cells += ' ' + p + '="'+ headerObj[o][p] + '"';
			  }
			}
			
			if(YL.isString(headerObj[o])) {
			  headerConfig.label = headerObj[o];
			}else if(headerObj[o].label){
			  headerConfig.label = headerObj[o].label.toString();
			}else{
			  headerConfig.label = o;
			}
			
			cells += Y.substitute(template, headerConfig);
			
			cells += '</th>';

		  }
		}
	}
	
	row += cells + '</tr>';

    this.tHead.setContent(row);

    this.headersSet = true;
  },
  
  _buildRows : function(arrayOfRows) {
    Y.log('_buildRows','info','simple-datatable');
    var i,l, cb = this.get(CONTENT_BOX),
        rows = '';

    if(arrayOfRows) {
		for(i=0, l=arrayOfRows.length; i < l; i++) {
		  rows += this._addRow(arrayOfRows[i], i) ;
		}
    }

	this.tbody = Y.Node.create('<tbody>' + rows + '</tbody>');
    cb.one('tbody').replace(this.tbody);

    this.rowsSet = true;
  },
  
  /**
   * Creates a row from the provided data and adds it to the tBody
   *   Keys prefixed with __ (two underscores) are added as parameters
   *   to the &lt;tr&gt; instead of matching to a header column
   * @since 1.3.0
   * @protected
   * @method _addRow
   * @param rowData
   * @param rowCount
   * @return String row to be added
   */
  _addRow : function(rowData, rowCount) {
    Y.log('_addRow','info','simple-datatable');
    var headers = this.get('headers') || {},
        row = '<tr', cells = '', key, cellCount = 0, yuiId = '__yui_id',
        template = this.get('linerTemplate'),
        cellConfig = {
          linerClasses : this._className + '-liner',
          labelClasses : this._className + '-label',
          label : ''
        },
		isObject = YL.isObject(rowData),
        isArray = YL.isArray(rowData);


    // loop header keys to build cells
    for(key in headers) {
      cells += this._generateRowCell(cellConfig, rowData, template, cellCount++, key, isObject, isArray);
    }


    if (isObject) {
      // add row attributes from custom keys
      for (key in rowData) {
        if (key.substring(0,2) === '__') {
          row += ' ' + key.substring(2) + '="' + rowData[key] + '"';
        }
      }
	  /*
      if (!rowData[yuiId]) {
        rowData[yuiId] = Y.Event.generateId(Y.Node.create('<b />'));
      }
	  */
	  row += ' id="' + rowData[yuiId] + '"';
    }

	row += ' class="' + this._className + '-' + ( (rowCount % 2) ? 'even' : 'odd') + '">';
	
	row += cells + '</tr>';

    return row;
  },
    
  /**
   * Creates a &lt;td&gt; string based on the template given and the 
   *   cellData and rowData given
   *
   * @since 1.5.0
   * @protected
   * @method _generateRowCell
   * @param Object cellConfig
   * @param Object rowData
   * @param String template
   * @param Integer cellCount
   * @param String cellKey
   * @param Boolean isObject
   * @param Boolean isArray
   * @return String
   */
  _generateRowCell : function(cellConfig, rowData, template, cellCount, cellKey, isObject, isArray){
    Y.log('_generateRowCell','info','simple-datatable');
    var cell = '<td class="' + this._className + '-col-' + cellCount + ' ' + this._className + '-col-' + cellKey + '">';

    if (isObject && rowData[cellKey]) {
      cellConfig.label = rowData[cellKey];
    } else if (isArray && rowData[cellCount]) {
      cellConfig.label = rowData[cellCount];
    } else {
      cellConfig.label = '&nbsp;';
    }

    cell += Y.substitute(template, cellConfig);
	
	cell += '</td>';
  
    return cell;
  },
  
  /**
   * Updates the content of the caption after the value is changed
   * @since 1.5.1
   * @protected
   * @method _afterCaptionChange
   */
  _afterCaptionChange : function(e) {
    Y.log('_afterCaptionChange', 'info', 'simple-datatable');
	
	if (e.newVal) {
	  if (!this._caption) {
	    this._caption = Y.Node.create('<caption />');
	    this.get(CONTENT_BOX).prepend(this._caption);
	  }
	  
	  this._caption.setContent(e.newVal);
	  
	} else {
	  this._caption.remove(true);
	  this._caption = null;
	}
  }


},{
  ATTRS : {
  
    /**
	 * When set, adds a caption to the table.
	 * @since 1.5.1
	 * @attribute caption
	 * @type string
	 */
	caption : {},

    /**
     * An associated array of key -&gt; value pairs where key is used
     *   to keep the column data organized and value is the &lt;th&gt;
     *   innerHTML or display text.
     * @since 1.0.0
       * @attribute headers
       * @type object
     */
    headers : {
      value : {},
      validator : YL.isObject
    },

    /**
     */
    linerTemplate : {
      value : '<div class="{linerClasses}"><div class="{labelClasses}">{label}</div></div>'
    },

    /**
     * Array of associated arrays of key -&gt; value pairs, where
     *   key is used to match with the headers assoc array to ensure
     *   column data is in the correct place and value is the
     *   innerHTML or display text.
     * @since 1.0.0
     * @attribute rows
     * @type array
     */
    rows : {
      value : [],
      validator : YL.isArray,
	  setter: function(val) {
		  return val;
	  }
    }
  }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['node','widget','widget-child','event','event-mouseenter','substitute']});
