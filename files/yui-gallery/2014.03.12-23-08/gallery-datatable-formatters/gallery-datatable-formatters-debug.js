YUI.add('gallery-datatable-formatters', function(Y) {

/**
 Define a "named" Column Formatters object and attach it to the Y.DataTable namespace.
 The named formatters are defined as a series of format strings that are typically used by the
 data formatting function Y.DataType.Number.format and Y.DataType.Date.format.

 The function [`namedFormatter`](#method_namedFormatter) is defined that can be used to call as a column formatter which
 formats the column cell using the [`formatStrings`](#property_formatStrings) object.

 This module includes an override of the [Y.DataTable.BodyView._createRowHTML](#method_Y.DataTable.BodyView._createRowHTML) method.  Therefore implementers shouldn't call the `namedFormatter` method directly because the overridden method handles the call if the entered formatter string name is recognized.
  
 ###Usage
 The format string names can be used in a column configuration object as follows;

		var dt1 = new Y.DataTable({
	        data: some_data,
    	    columns: [
        	    { key:"start_date", label:"Start", formatter:"fullDate" },
            	{ key:"end_date", label:"End", formatter:"default",
	                 formatOptions:{ type:'date', formatConfig:{ format:'%F' } }    },
    	        { key:"qty", label:"Inventory Qty", formatter:"comma" },
        	    { key:"cost", label:"Carried Cost", formatter:"currency",
	                 formatConfig:{ prefix:'£', thousandsSeparator:","} }
    	    ]
		}).render();
 
 ####Pre-Defined `formatStrings` settings; (specifically, Y.DataTable.Formatters.formatStrings)
 For "number" formatting, using [Y.DataType.Number](http://yuilibrary.com/yui/docs/api/classes/DataType.Number.html#method_format).

 <table><tr><th>string</th><th>Formatter Object</th><th>Formatted Example</th></tr>
 <tr><td>`general`</td><td>{ decimalPlaces:0 }</td><td>123457</td></tr>
 <tr><td>`general2`</td><td>{ decimalPlaces:2 }</td><td>123456.79</td></tr>
 <tr><td>`currency`</td><td>{ prefix:'$', decimalPlaces:0, thousandsSeparator:',' }</td><td>$ 123,457</td></tr>
 <tr><td>`currency2`</td><td>{ prefix:'$', decimalPlaces:2, thousandsSeparator:',' }</td><td>$ 123,456.78</td></tr>
 <tr><td>`currency3`</td><td>{ prefix:'$', decimalPlaces:3, thousandsSeparator:',' }</td><td>$ 123,457.789</td></tr>
 <tr><td>`comma`</td><td>{ decimalPlaces:0, thousandsSeparator:','}</td><td>123,457</td></tr>
 <tr><td>`comma2`</td><td>{ decimalPlaces:2, thousandsSeparator:','}</td><td>123,456.78</td></tr>
 <tr><td>`comma3`</td><td>{ decimalPlaces:3, thousandsSeparator:','}</td><td>123,457.789</td></tr>
 </table>

 For "date" formatting, using [Y.DataType.Date](http://yuilibrary.com/yui/docs/api/classes/DataType.Date.html#method_format).
 <br/>(Please refer to the Date.format method above for the proper use of "strftime" format strings)
 <table><tr><th>string</th><th>Formatter Object</th><th>Formatted Example</th></tr>
 <tr><td>`shortDate`</td><td>{ format:'%D' }</td><td>03/12/92</td></tr>
 <tr><td>`longDate`</td><td>{ format:'%m/%d/%Y' }</td><td>03/12/1992</td></tr>
 <tr><td>`fullDate`</td><td>{ format:'%B %e, %Y' }</td><td>March 12, 1992</td></tr>
 <tr><td>`isoDate`</td><td>{ format:'%F'}</td><td>1992-03-12</td></tr>
 <tr><td>`isoDateTime`</td><td>{ format:'%FT%T'}</td><td>1992-03-12T22:11:07</td></tr>
 </table>

 ####Replaceable Hash
 This utility can also replace the cell value with values from a data hash (i.e. JS simple object, consisting of key:value pairs).
 Access to this capability is by providing a `formatter` as any string not-recognizable in the `formatStrings` object
 **AND** by providing a `formatConfig` object (equal to the hash) in the column definition.

 ####User-Defined `formatStrings`
 Implementers may add their "named" own formatting strings for their own use-cases simply by adding more named formatters to the `formatStrings` object as;

	Y.DataTable.Formatters.formatStrings['myNumberFmtr'] = {
		type:'number', 
		formatConfig:{ thousandsSeparator:'x', decimalPlaces:11 } 
	};
	Y.DataTable.Formatters.formatStrings['myDateFmtr'] = {
		type:'date', 
		formatConfig:{ format:{ "At the tone the TIME will be %T" } 
	};


 @module datatable
 @submodule formatters
 @class Y.DataTable.Formatters
 @type {Object}
 **/
Y.DataTable.Formatters = {

    /**
     Object containing referenceable format strings
     @property formatStrings
     @public
     **/
    formatStrings: {

        general:   { type:'number', formatConfig:{ decimalPlaces:0 } },
        general2:  { type:'number', formatConfig:{ decimalPlaces:2 } },
        currency:  { type:'number', formatConfig:{ prefix:'$', decimalPlaces:0, thousandsSeparator:',' } },
        currency2: { type:'number', formatConfig:{ prefix:'$', decimalPlaces:2, thousandsSeparator:',' } },
        currency3: { type:'number', formatConfig:{ prefix:'$', decimalPlaces:3, thousandsSeparator:',' } },
        comma:     { type:'number', formatConfig:{ decimalPlaces:0, thousandsSeparator:','} },
        comma2:    { type:'number', formatConfig:{ decimalPlaces:2, thousandsSeparator:',' } },
        comma3:    { type:'number', formatConfig:{ decimalPlaces:3, thousandsSeparator:',' } },

        shortDate: { type:'date',  formatConfig:{ format:'%D' } },
        longDate:  { type:'date',  formatConfig:{ format:'%m/%d/%Y' } },
        fullDate:  { type:'date',  formatConfig:{ format:'%B %e, %Y' } },
        isoDate:   { type:'date',  formatConfig:{ format:'%F'} },
        isoDateTime:  { type:'date',  formatConfig:{ format:'%FT%T'} },

        link : { type:'html', formatConfig:{}},  // incomplete

        'default': {}

    },

    /**
     * Formatter function called that executes a standard "named" formatter defined by `fmtrName`.
     * The parameter `fmtrName` maps to a member of the "formatStrings" object, that includes a type
     * declaration and a formatConfig string to be substituted in the DataType.Number.format or Date.format
     * function.
     *
     * @method namedFormatter
     * @param {String} fmtrName Name of formatter object from "formatStrings", i.e. "currency2", "fullDate"
     * @param {Object} o The passed-in column formatter object
     * @return {Mixed} value
     */
    namedFormatter: function(fmtrName,o) {
        var fmtObj  = o.column.formatOptions || Y.DataTable.Formatters.formatStrings[fmtrName] || null,
            fmtType,fmtConf,value;

        fmtType = ( o.column.type ) ? o.column.type : (fmtObj) ? fmtObj.type : null;
        fmtConf = ( o.column.formatConfig ) ? o.column.formatConfig : (fmtObj) ? fmtObj.formatConfig :  null;

        if ( fmtType && fmtConf && fmtType === "date")
           value = Y.DataType.Date.format(o.value,fmtConf);
        else if ( fmtType && fmtConf && fmtType === "number")
           value = Y.DataType.Number.format(o.value,fmtConf);

        return value;
    }

};

/**
 Override of method _createRowHTML from DataTable.BodyView extended to permit use of named
 formatter functions from Y.DataTable.Formatters.

 Additional functionality was added to facilitate using a template approach for {o.value} within
 the column, by using Y.Lang.sub (as fromTemplate) with the replacement object hash provided
 as column configuration "formatConfig" (o.column.formatConfig).

 @method Y.DataTable.BodyView._createRowHTML
 @param model
 @param index
 @param columns
 @return {*}
 @private
 **/
Y.DataTable.BodyView.prototype._createRowHTML = function (model, index, columns) {
    var Lang         = Y.Lang,
        isArray      = Lang.isArray,
        isNumber     = Lang.isNumber,
        isString     = Lang.isString,
        fromTemplate = Lang.sub,
        htmlEscape   = Y.Escape.html,
        toArray      = Y.Array,
        bind         = Y.bind,
        YObject      = Y.Object;

    var data     = model.toJSON(),
        clientId = model.get('clientId'),
        values   = {
            rowId   : this._getRowId(clientId),
            clientId: clientId,
            rowClass: (index % 2) ? this.CLASS_ODD : this.CLASS_EVEN
        },
        host = this.host || this,
        i, len, col, token, value, formatterData;

    for (i = 0, len = columns.length; i < len; ++i) {
        col   = columns[i];
        value = data[col.key];
        token = col._id || col.key;

        values[token + '-className'] = '';

        if (col.formatter) {
            formatterData = {
                value    : value,
                data     : data,
                column   : col,
                record   : model,
                className: '',
                rowClass : '',
                rowIndex : index
            };

            if (typeof col.formatter === 'string') {
                if (value !== undefined) {
                    // TODO: look for known formatters by string name

                // ADDED: by T. Smith, following for named formatters ... i.e. {key:'foo', formatter:'comma2' ...}
                    if ( Y.DataTable.Formatters.namedFormatter && Y.DataTable.Formatters.formatStrings[col.formatter] )
                        value = Y.DataTable.Formatters.namedFormatter.call(host,col.formatter,formatterData);

                    else if ( col.formatConfig )    // do string replacement of values from col.formatConfig
                        value = fromTemplate("{" + value + "}", col.formatConfig );

                    else
                        value = fromTemplate(col.formatter, formatterData);
                }
            } else {
                // Formatters can either return a value
                value = col.formatter.call(host, formatterData);

                // or update the value property of the data obj passed
                if (value === undefined) {
                    value = formatterData.value;
                }

                values[token + '-className'] = formatterData.className;
                values.rowClass += ' ' + formatterData.rowClass;
            }
        }

        if (value === undefined || value === null || value === '') {
            value = col.emptyCellValue || '';
        }

        values[token] = col.allowHTML ? value : htmlEscape(value);

        values.rowClass = values.rowClass.replace(/\s+/g, ' ');
    }

    return fromTemplate(this._rowTemplate, values);
}


}, 'gallery-2012.09.05-20-01' ,{requires:['datatype-date-format', 'datatype-number-format', 'datatable-base'], skinnable:false});
