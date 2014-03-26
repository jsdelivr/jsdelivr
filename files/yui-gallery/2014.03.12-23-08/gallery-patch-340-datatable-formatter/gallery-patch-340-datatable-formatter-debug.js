YUI.add('gallery-patch-340-datatable-formatter', function(Y) {

var Ycreate = Y.Node.create,
    YLang = Y.Lang,
    fromTemplate = YLang.sub,
    CLASS_LINER = Y.ClassNameManager.getClassName('datatable', 'liner');

Y.mix(Y.DataTable.Base.prototype, {

    _uiSetRecordset: function(rs) {
        var oldTbody = this._tbodyNode,
            parent = oldTbody.get("parentNode"),
            nextSibling = oldTbody.next(),
            columns = this.get('columnset').keys.slice(),
            cellValueTemplate = this.get('tdValueTemplate'),
            rowTemplate = this.get('trTemplate'),
            cellTemplate = this.tdTemplate,
            newTbody, i, len, column, record, formatter;

        // Replace TBODY with a new one
        //TODO: split _addTbodyNode into create/attach
        oldTbody.remove();
        oldTbody = null;
        newTbody = this._addTbodyNode(this._tableNode);
        newTbody.remove();
        this._tbodyNode = newTbody;

        function createCell() {
            if (!this.td) {
                this.td = Ycreate(fromTemplate(cellTemplate, this));
            }

            return this.td.one('.' + CLASS_LINER) || this.td;
        }

        // Build up column data to avoid passing through Attribute APIs inside
        // render loops for rows and cells
        for (i = columns.length - 1; i >= 0; --i) {
            column = columns[i];
            columns[i] = {
                column : column,
                field  : column.get('field'),
                classnames: column.get('classnames'),
                headers: column.headers
            };

            formatter = column.get('formatter');
            if (!YLang.isFunction(formatter)) {
                // Convert non-function formatters into functions
                // String formatters are treated as alternate value templates
                // Any other value for formatter is ignored, falling back to
                // to the configured tdValueTemplate attribute value.
                if (!YLang.isString(formatter)) {
                    formatter = cellValueTemplate;
                }
                formatter = Y.bind(fromTemplate, this, formatter);
            }

            columns[i].formatter = formatter;
        }


        // Iterate Recordset to use existing TR when possible or add new TR
        // TODO i = this.get("state.offsetIndex")
        // TODO len =this.get("state.pageLength")
        for (i = 0, len = rs.size(); i < len; ++i) {
            record = rs.item(i);

            this._addTbodyTrNode({
                tbody      : newTbody,
                columns    : columns,
                rowTemplate: rowTemplate,
                record     : record,
                data       : record.get('data'),
                rowindex   : i,
                createCell : createCell
            });
        }
        
        // TBODY to DOM
        parent.insert(this._tbodyNode, nextSibling);
    },

    _addTbodyTrNode: function(o) {
        var row = o.tbody.one("#" + o.record.get("id"));

        o.tr = row || this._createTbodyTrNode(o);

        this._attachTbodyTrNode(o);
    },

    _createTbodyTrNode: function(o) {
        var columns = o.columns,
            row = Ycreate(fromTemplate(o.rowTemplate, { id: o.data.id })),
            i, len, data, columnData;

        // FIXME: I only want to create the tr once, but I want to share as
        // little data from one loop iteration to the next because the object
        // passed around the supporting methods add properties to the object
        // which blurs the line between properties that are input to the
        // supporting functions and those that are leftover output from
        // subsequent steps in a prior iteration.
        for (i = 0, len = columns.length; i < len; ++i) {
            columnData = columns[i];
            data = Y.Object(o); // avoids the enum/copy of Y.merge

            data.tr        = row;
            data.column    = columnData.column;
            data.field     = columnData.field;
            data.formatter = columnData.formatter;
            data.classnames= columnData.classnames;
            data.headers   = columnData.headers;

            this._addTbodyTdNode(data);
            row = data.tr; // in case they changed it FIXME: eww
        }
        
        return row;
    },

    _addTbodyTdNode: function(o) {
        this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
    },
    
    _createTbodyTdNode: function(o) {
        o.value   = this.formatDataCell(o);

        if (!o.td) {
            o.td = Ycreate(fromTemplate(this.tdTemplate, o));
        }
    },
    
    formatDataCell: function(o) {
        o.value = o.data[o.field];

        return o.formatter.call(this, o);
    }

}, true);


}, 'gallery-2011.08.24-23-44' ,{requires:['datatable-base']});
