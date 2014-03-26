YUI.add('gallery-itsadtcolumnresize', function (Y, NAME) {

'use strict';

/**
 * DataTable ColumnResize Plugin
 *
 *
 * If you want to make the columns resizable, than you just define the datatable-attribute 'colsresizable' like:
 *
 * myDatatable.set('colsresizable', true);
 *
 * This can be done at initialisation of the datatable, before Y.Plugin.ITSADTColumnResize is plugged in, or later on.
 * The attribute 'colsresizable' can have three states:
 *
 * <ul>
 * <li>true --> all columns are resizable</li>
 * <li>false --> colresizing is disabled</li>
 * <li>null/undefined --> colresizing is active where only columns(objects) that have the property 'resizable' will be resizable</li>
 * </ul>
 *
 * If myDatatable.get('colsresizable') is undefined or null, then only columns with colConfig.resizable=true are resizable.
 *
 *
 * @module gallery-itsadtcolumnresize
 * @class ITSADTColumnResize
 * @extends Plugin.Base
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// -- Public Static Properties -------------------------------------------------

/**
 * Internal list that holds event-references
 * @property _eventhandlers
 * @private
 * @type Array
 */

/**
 * Internal list that holds resize-event-references
 * @property _resizeEventhandlers
 * @private
 * @type Array
 */

/**
 * Internal flag that states if datatable.get('colsresizable')===true
 * @property _allColsResizable
 * @private
 * @type Boolean
 */

/**
 * plugin's host DataTable
 * @property datatable
 * @type Y.DataTable
 */

/**
 * Internal flag that tells whether the browsers does a bad colwidth calculation (Opera, IE6, IE7).<br>
 * Determined by featuretest.
 * @property _badColWidth
 * @type boolean
 * @private
 */

/**
 * Node-reference to datatable's <col> elemets within <colgroup>
 * @property _dtColNodes
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-columns
 * @property _dtRealDataTableHeader
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's parentNode
 * @property _datatableParentNode
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's boundingbox
 * @property _dtBoundingBox
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's contentbox
 * @property _dtContentBox
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-x-scroller
 * @property _dtXScroller
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-y-scroller
 * @property _dtYScroller
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-scrollbar
 * @property _dtYScrollBar
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-y-scroller-container
 * @property _dtYScrollerContainer
 * @type Y.Node
 * @private
 */

/**
 * Node-reference to datatable's .yui3-datatable-scroll-columns
 * @property _dtScrollHeader
 * @type Y.Node
 * @private
 */

/**
 * NodeList-reference to all datatable's .yui3-datatable-scroll-liner
 * @property _dtScrollLiner
 * @type Y.Node
 * @private
 */

/**
 * Flag that tells whether DataTable is y-scrollable
 * @property _dtScrollY
 * @type Boolean
 * @private
 */

/**
 * Flag that tells whether resize may start when the mouse gets pressed
 * @property _resizeApproved
 * @private
 * @type Boolean
 */

/**
 * Flag that tells whether resizing is going on
 * @property _busyResize
 * @private
 * @type Boolean
 */

/**
 * th-Node on the left side while resizing
 * @property _leftThNode
 * @private
 * @type Y.Node
 */

/**
 * screens x-pos of the left th-Node while resizing (Y.Node.getX())
 * @property _leftThX
 * @private
 * @type int
 */

/**
 * Mouse-offset compared to columnborder when starting to resize
 * @property _mouseOffset
 * @private
 * @type int
 */

/**
 * index of the left th-Node while resizing
 * @property _leftColIndex
 * @private
 * @type int
 */

/**
 * index of the most right th-Node
 * @property _lastColIndex
 * @private
 * @type int
 */

/**
 * backup of the th-width before resize starts. This value is passed as prevVal when the event 'colWidthChange' is fired
 * @property _initialColWidth
 * @private
 * @type int
 */

/**
 * Internal flag that tells whether distributeRemainingSpace is going on. In such situations,
 * we don't need (and want) to call this._checkRemainingColSpace() because we could get into a loop
 * @property _busyDistributeRemainingSpace
 * @private
 * @type boolean
 */

/**
 * Internal flag that tells whether transformAllColumnWidthToPixels is going on. In such situations,
 * we don't need (and want) to call this._checkRemainingColSpace()
 * @property _busyTransformAllColumnWidthToPixels
 * @private
 * @type boolean
 */

/**
 * horizontal offset of the y-scrollbar (in case of y-scrollable datatable)
 * @property _scrollbarOffset
 * @private
 * @type int
 */

/**
 * Reference to Y.one('body')
 * @property _bodyNode
 * @private
 * @type Y.Node
 */

/**
 * internal flag that will prevent sorting columns while resizing
 * @property _comingFromResize
 * @private
 * @type boolean
 */

/**
 * The value that -in case of x-scroller- is automaticly added to fill the table when other columns decreased the width in a way that
 * the total tablewidth needed to increase by enlargin the last col.
 * @property _distributedSpace
 * @private
 * @type int
 */

/**
 * Holds the backupvalues of 'unselectable' of the th-elements in case of IE. Will be restored after resizing
 * @property _unselectableBkpList
 * @private
 * @type Array
 */

/**
 * Holds the configindexes of the colls that have no width specified. Used internally to distribute the remaining space after a colwidthchange
 * @property _notSpecCols
 * @private
 * @type int[]
 */

/**
 * Internal flag that tells whether the datatable has its width-attribute defined
 * @property _dtWidthDefined
 * @private
 * @type boolean
 */

/**
 * Internal flag that tells whether the datatable has its width-attribute in percent
 * @property _dtWidthIsPercented
 * @private
 * @type boolean
 */

/**
 * Internal flag that tells whether datatable.widthChange is called from intern.
 * To prevent event to call this._justifyTableWidth() in those cases.
 * @property _widthChangeInternally
 * @private
 * @type boolean
 */




var Lang = Y.Lang,
    YArray = Y.Array,
    RESIZABLE_COLUMN_CLASS = 'itsa-resizable-col',
    DATATABLE_BUSY_RESIZING_CLASS = 'yui3-datatable-itsacolresizing',
    PERCENTEDWIDTHDATA = 'itsa_width_percented',
    EXPANSIONDATA = 'itsa_expansion',
    DEFINEDCOLWIDTHDATA = 'itsa_defined_col_width_data',
    DATAYES = 'yes',
    DATANO = 'no',
    DATATABLE_BORDERWIDTH = 2;

Y.namespace('Plugin').ITSADTColumnResize = Y.Base.create('itsadtcolumnresize', Y.Plugin.Base, [], {

        _eventhandlers : [],
        _resizeEventhandlers : [],
        _allColsResizable : null,
        datatable : null,
        _badColWidth : null,
        _dtWidthDefined : null,
        _dtWidthIsPercented : null,
        _dtColNodes : null,
        _datatableParentNode : null,
        _dtBoundingBox : null,
        _dtContentBox : null,
        _dtXScroller : null,
        _dtYScroller : null,
        _dtYScrollBar : null,
        _dtYScrollerContainer : null,
        _dtRealDataTableHeader : null,
        _dtScrollHeader : null,
        _dtScrollLiners : null,
        _dtScrollY : null,
        _resizeApproved: false,
        _busyResize : false,
        _leftThNode : null,
        _leftThX : null,
        _mouseOffset : null,
        _leftColIndex : null,
        _lastColIndex : null,
        _initialColWidth : null,
        _busyDistributeRemainingSpace : null,
        _busyTransformAllColumnWidthToPixels : null,
        _scrollbarOffset : 0,
        _bodyNode : null,
        _comingFromResize : null,
        _widthChangeInternally : null,
        _unselectableBkpList : [],
        _distributedSpace : 0,
        _notSpecCols : [],

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
         * @since 0.1
         */
        initializer : function() {
            Y.log('initializer', 'info', 'DTColumnResize');
            var instance = this;

            instance.datatable = instance.get('host');
            instance._badColWidth = Y.Features.test('table', 'badColWidth');
            if (instance.datatable.get('rendered')) {
                instance._render();
            }
            else {
                instance.afterHostEvent('render', instance._render, instance);
            }
        },

        /**
         * Transforms the columnwidth to percent.
         * Does not return result, because you would have to define whether you want the result with or without added expansion
         * (extra space that might be added to the column in order to make it fit the DataTable-width)
         * @method transformToPercent
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @since 0.1
        */
        transformToPercent: function(name) {
            var instance = this,
                newValue, expansion;

            Y.log('transformToPercent of column '+name,'info', 'DTColumnResize');
            if (!instance.columnWidthIsPercent(name)) {
                newValue = instance.getColumnWidthPercent(name, true);
                expansion = instance.getColumnExpansion(name);
                instance.setColumnWidth(name, newValue, expansion);
            }
        },

        /**
         * Transforms the columnwidth to pixels.
         * Does not return result, because you would have to define whether you want the result with or without added expansion
         * (extra space that might be added to the column in order to make it fit the DataTable-width)
         * @method transformToPixels
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @since 0.1
        */
        transformToPixels: function(name) {
            var instance = this,
                newValue, expansion;

            Y.log('transformToPixels of column '+name,'info', 'DTColumnResize');
            if (!instance.columnWidthIsPixels(name)) {
                newValue = instance.getColumnWidthPx(name, true);
                expansion = instance.getColumnExpansion(name);
                instance.setColumnWidth(name, newValue, expansion);
            }
        },

        /**
         * Transforms the columnwidth to undefined. Doesn't change the occupied colspace, but an undefined width will lead to
         * adding expansion when other cols get width-changes. Can only be done if the DataTable has a defined width (either in pixels or percent),
         * otherwise, the columnwidth-type will remain.
         * Does not return result, because you would have to define whether you want the result with or without added expansion
         * (extra space that might be added to the column in order to make it fit the DataTable-width)
         * @method transformToUndefinedWidth
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @since 0.1
        */
        transformToUndefinedWidth: function(name) {
            var instance = this,
                thcell, newValue;

            Y.log('transformToPixels of column '+name,'info', 'DTColumnResize');
            if (instance._dtWidthDefined && !instance.columnWidthIsUndefined(name)) {
                newValue = instance.getColumnWidthPx(name);
                instance.setColumnWidth(name, newValue);
                thcell = this._getThCel(name);
                if (thcell) {
                    thcell.setData(DEFINEDCOLWIDTHDATA, DATANO);
                }
            }
        },

        /**
         * @method columnWidthIsPercent
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @return {boolean} whether the width is set in percent. Returns false if in pixels or undefined
         * @since 0.1
        */
        columnWidthIsPercent: function(name) {
            var thcell = this._getThCel(name),
                storedPercentedWidth = (thcell && thcell.getData(PERCENTEDWIDTHDATA)) || '';

            Y.log('columnWidthIsPercented of column '+name+' --> '+(storedPercentedWidth.length>0),'info', 'DTColumnResize');
            return (storedPercentedWidth.length>0);
        },

        /**
         * @method columnWidthIsPixels
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @return {boolean} whether the width is set in pixels. Returns false if in percent or undefined
         * @since 0.1
        */
        columnWidthIsPixels: function(name) {
            var thcell = this._getThCel(name),
                storedPercentedWidth = (thcell && thcell.getData(PERCENTEDWIDTHDATA)) || '',
                definedColWidth = (thcell && thcell.getData(DEFINEDCOLWIDTHDATA)) || DATAYES;

            Y.log('columnWidthIsPixels of column '+name+' --> '+(definedColWidth && (storedPercentedWidth.length===0)),'info', 'DTColumnResize');
            return definedColWidth && (storedPercentedWidth.length===0);
        },

        /**
         * @method columnWidthIsUndefined
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @return {boolean} whether the width is undefined
         * @since 0.1
        */
        columnWidthIsUndefined: function(name) {
            var thcell = this._getThCel(name),
                definedColWidth = (thcell && thcell.getData(DEFINEDCOLWIDTHDATA)) || DATAYES;

            Y.log('columnWidthIsUndefined of column '+name+' --> ' + !definedColWidth, 'info', 'DTColumnResize');
            return !definedColWidth;
        },

        /**
         * @method getColumnConfigWidth
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @return {int} columnwidth as it exists in the column configuration object, might be in picels or percent or null
         * @since 0.1
        */
        getColumnConfigWidth: function(name) {
            var instance = this,
                dt = instance.datatable,
                colConfigObject = dt.getColumn(name),
                columns = dt.get('columns'),
                colIndex = YArray.indexOf(columns, colConfigObject),
                allThRealHeader = instance._dtRealDataTableTHNodes,
                thcell = allThRealHeader && allThRealHeader.item(colIndex),
                storedPercentedWidth = (thcell && thcell.getData(PERCENTEDWIDTHDATA)) || '';

            Y.log('getColumnConfigWidth '+name+' --> '
                +((colConfigObject && ((storedPercentedWidth.length>0) ? storedPercentedWidth : colConfigObject.width)) || null),
                'info', 'DTColumnResize');
            // colConfigObject.widthPercented is defined by this module: only exists if the width is defined in precent.
            return (colConfigObject && ((storedPercentedWidth.length>0) ? storedPercentedWidth : colConfigObject.width)) || null;
        },

        /**
         * Retreives the true col-width in pixels, exact as is occupied on the screen.<br>
         * Some cols might have been expanded to fit a fixed DataTable-width. To retreive the colwith without this
         * expansion, you can set withoutExpansion=true.
         * @method getColumnWidthPx
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @param {Boolean} [withoutExpansion] (defaults false) some cols may be expanded to fit the total datatablewidth.<br>
         * These are cols that have undefined width-settings themselves, or -if no undefined col- the last column.<br>
         * This expansion will be part of the width, because it is the true width on the screen. When set to true, you retreive<br>
         * the original width without the expansion, which is in fact the width that will be reached if the column can get narrower
         * for exampele when other column is set wider and no expansion is required.
         * @return {int} columnwidth in pixels
         * @since 0.1
        */
        getColumnWidthPx: function(name, withoutExpansion) {
            var instance = this,
                dt = instance.datatable,
                colConfigObject = dt.getColumn(name),
                allThHeader = instance._dtRealDataTableTHNodes,
                expansion = 0,
                colwidth = 0,
                cell;

            if (colConfigObject && colConfigObject.width) {
                // because _transformAllColumnWidthToPixels is already being executed, colConfigObject.width should exists and is defined in px
                colwidth = parseInt(colConfigObject.width, 10) || 0;
            }
            if (typeof name === 'string') {
                cell = instance._dtContentBox.one('#'+dt.getClassName('col') + '-' + name);
            }
            else if (Lang.isNumber(name)) {
                cell = allThHeader && allThHeader.item(name);
            }
            expansion = withoutExpansion ? ((cell && cell.getData(EXPANSIONDATA)) || 0) : 0;
            // only if not this._busyDistributeRemainingSpace, we also have to look at the real cellwidth
            if (!instance._busyDistributeRemainingSpace) {
                colwidth = Math.max(colwidth, ((cell && cell.get('offsetWidth')) || 0));
            }
            Y.log('getColumnWidth '+name+' --> '+(colwidth - expansion), 'info', 'DTColumnResize');
            return colwidth - expansion;
        },

        /**
         * Retreives the true col-width in percent (in comparison to the DataTable-width) exact as is occupied on the screen.<br>
         * Some cols might have been expanded to fit a fixed DataTable-width. To retreive the colwith without this
         * expansion, you can set withoutExpansion=true.
         * @method getColumnWidthPercent
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @param {Boolean} [withoutExpansion] (defaults false) some cols may be expanded to fit the total datatablewidth.<br>
         * These are cols that have undefined width-settings themselves, or -if no undefined col- the last column.<br>
         * This expansion will be part of the width, because it is the true width on the screen. When set to true, you retreive<br>
         * the original width without the expansion, which is in fact the width that will be reached if the column can get narrower
         * for exampele when other column is set wider and no expansion is required.
         * @return {String} columnwidth in percent
         * @since 0.1
        */
        getColumnWidthPercent: function(name, withoutExpansion) {
            var instance = this,
                dtWidthWithBorder = instance._dtWidthDefined ? (parseInt(instance._dtXScroller.getStyle('width'), 10) + DATATABLE_BORDERWIDTH)
                                    : instance._datatableParentNode.get('offsetWidth'),
                width = instance.getColumnWidthPx(name, withoutExpansion);

            Y.log('getColumnWidthPercent '+name+' --> '+(100*width/dtWidthWithBorder).toFixed(2) + '%', 'info', 'DTColumnResize');
            return (100*width/dtWidthWithBorder).toFixed(2) + '%';
        },

        /**
         * Retreives the expansion of the column in pixels. Some cols might have been expanded to fit a fixed DataTable-width.
         * @method getColumnExpansion
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @return {int} expansion in pixels
         * @since 0.1
        */
        getColumnExpansion: function(name) {
            var instance = this,
                allThHeader = instance._dtRealDataTableTHNodes,
                cell;

            if (typeof name === 'string') {
                cell = instance._dtContentBox.one('#'+instance.datatable.getClassName('col') + '-' + name);
            }
            else if (Lang.isNumber(name)) {
                cell = allThHeader && allThHeader.item(name);
            }
            Y.log('getColumnExpansion '+name+' --> '+((cell && cell.getData(EXPANSIONDATA)) || 0), 'info', 'DTColumnResize');
            return (cell && cell.getData(EXPANSIONDATA)) || 0;
        },

        /**
         * Changes the columnwidth. When called programaticly, it fires the event colWidthChange.
         *
         * @method setColumnWidth
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @param {int|String} width new width in pixels or percent. Numbers are treated as pixels
         * @param {int} [expansion] Only to be set internally: to expand the col in order to make it fit with the datatable's width.
         * @param {boolean} [fireInPercent] Only to be set internally: force the widthChange-event to fire e.newVal in percent
         * @return {int|String} final reached columnwidth in pixels (number) or percents (number+'%'), which might differ from which was tried to set
         * @since 0.1
        */
        setColumnWidth: function (name, width, expansion, fireInPercent) {
            Y.log('setColumnWidth col: '+name+' --> width: '+width+', expansion: '+expansion, 'info', 'DTColumnResize');
            // Opera (including Opera Next circa 1/13/2012) and IE7- pass on the
            // width style to the cells directly, allowing padding and borders to
            // expand the rendered width.  Chrome 16, Safari 5.1.1, and FF 3.6+ all
            // make the rendered width equal the col's style width, reducing the
            // cells' calculated width.
            var instance = this,
                colIndex = Lang.isNumber(name) ? name : instance._getColIndexFromName(name),
                prevWidthPx = instance.getColumnWidthPx(colIndex),
                dt = instance.datatable,
                dtContentBox = instance._dtContentBox,
                allColl = instance._dtColNodes,
                col       = allColl && allColl.item(colIndex),
                realDataTable = instance._dtRealDataTable,
                yScrollerContainer = instance._dtYScrollerContainer,
                scrollY = instance._dtScrollY,
                allThRealHeader = instance._dtRealDataTableTHNodes,
                thcell = allThRealHeader && allThRealHeader.item(colIndex),
                prevExpansion = (thcell && thcell.getData(EXPANSIONDATA)) || 0,
                busyResize = instance._busyResize,
                dtWidth = parseInt(instance._dtXScroller.getStyle('width'), 10),
                dtWidthDefined = instance._dtWidthDefined,
                dtWidthWithBorder = dtWidthDefined ? (dtWidth + DATATABLE_BORDERWIDTH) : instance._datatableParentNode.get('offsetWidth'),
                busyTransformAllColumnWidthToPixels = instance._busyTransformAllColumnWidthToPixels,
                colConfig = dt.getColumn(colIndex),
                prevWidthPercent = (thcell && thcell.getData(PERCENTEDWIDTHDATA)) || '',
                prevWidthPercented = (prevWidthPercent.length>0),
                newWidthPercented = width && width.substr && (width.substr(width.length-1)==='%'),
                busyDistributeRemainingSpace = instance._busyDistributeRemainingSpace,
                resetContainer, tableToBackup, noWidthCol, bkpColWidth, lastIndex, bkpDatatableWidth, badColWidth,
                newWidth, getCellStyle, setColWidth, setCellWidth, corrected, scrollThDiv, scrollTh,
                widthPxAttempt, widthChange, widthTypeChange, expansionChange, eventPrevValue;

            expansion = expansion || 0;
            width = newWidthPercented ? parseFloat(width) : parseInt(width, 10);
            widthChange = newWidthPercented ? (prevWidthPercent!==(width+'%')) : (width!==prevWidthPx);
            widthTypeChange = (newWidthPercented!==prevWidthPercented);
            expansionChange = (expansion!==prevExpansion);
            badColWidth = instance._badColWidth;

            if (col && thcell && Y.Lang.isNumber(width) && (widthChange || widthTypeChange || expansionChange || busyTransformAllColumnWidthToPixels)
                && (width>=instance.get('minColWidth'))) {

                getCellStyle = function (element, prop, nonComputed) {
                    return (parseInt((nonComputed ? element.getStyle(prop) : element.getComputedStyle(prop)), 10) || 0);
                };

                setColWidth = function (element, newColWidth) {
                    var corrected = 0,
                        cell;
                    if (badColWidth) {
                        cell = dt.getCell([0, colIndex]);
                        if (cell) {
                            corrected =  getCellStyle(cell, 'paddingLeft') +
                                         getCellStyle(cell, 'paddingRight') +
                                         getCellStyle(cell, 'borderLeftWidth') +
                                         getCellStyle(cell, 'borderRightWidth');
                        }
                    }
                    newColWidth -= corrected;
                    element.setStyle('width', newColWidth + 'px');
                };

                setCellWidth = function(cellwidth, withExpansion) {
                    var prevExpansion;
                    // only when we are sure we manually set the width, then mark the thNode's widthPercented
                    if (!busyTransformAllColumnWidthToPixels && (expansion===0)) {
                        if (newWidthPercented) {
                            // store the percented width and continue calculating with the width in pixels
                            thcell.setData(PERCENTEDWIDTHDATA, cellwidth + '%');
                            cellwidth = Math.round(dtWidthWithBorder*cellwidth/100);
                        }
                        else {
                            thcell.setData(PERCENTEDWIDTHDATA, null);
                        }
                    }
                    if (withExpansion) {
                        cellwidth += expansion;
                        prevExpansion = thcell.getData(EXPANSIONDATA) || 0;
                        thcell.setData(EXPANSIONDATA, expansion);
                        instance._distributedSpace += expansion - prevExpansion;
                        // only when we are sure we manually set the width, then mark the thNode as DATAYES
                        if (!busyTransformAllColumnWidthToPixels && (expansion===0)) {
                            thcell.setData(DEFINEDCOLWIDTHDATA, DATAYES);
                        }
                    }
                    if (colConfig) {
                        colConfig.width = cellwidth+'px';

                    }
                    setColWidth(col, cellwidth);
                };

                if (!busyResize) {
                    // store previous value, because it will be event-fired
                    // do not use variable prevWidthPercent, for this one doesn't have expansion included
                    eventPrevValue = prevWidthPercented ? instance.getColumnWidthPercent(colIndex) : prevWidthPx;
                }

                // now, also for scrollheaders - if they are available
                if (scrollY) {
                    tableToBackup = yScrollerContainer;
                }
                else {
                    // if you should have sortable headers, than in case the realDataTable-width < contentBox-width,
                    // the realDataTable-width will change to 100% when a user is resorting.
                    // therefore we must check if the width==='100%' and if so, we take the width of the contentbox.
                    tableToBackup = (realDataTable.getStyle('width')==='100%') ? dtContentBox : realDataTable;
                }

                bkpDatatableWidth = getCellStyle(tableToBackup, 'width', true);

                lastIndex = allColl ? (allColl.size()-1) : 0;
                if (lastIndex>0) {
                    // do not perform this workarround when you have only 1 column
                    noWidthCol = allColl.item((colIndex===lastIndex) ? 0 : lastIndex);
                    bkpColWidth = getCellStyle(noWidthCol, 'width', true);
                    noWidthCol.setStyle('width', '');
                }
                else {
                    // in case of only 1 column: another workarround. DO NOT set width to '' or 0px,
                    // but to 1px (safari ans chrome would otherwise fail)
                    resetContainer = yScrollerContainer || realDataTable;
                    resetContainer.setStyle('width', '1px');
                    // ALSO in case of only 1 column and scrollable-y: safari ans chrome will fail cellwidth-calculation
                    // if realDataTable has a width other than 1px
                    if (scrollY) {
                        realDataTable.setStyle('width', '1px');
                    }
                }

                // next setCellWidth can handle both with in pixels as well as in percent
                setCellWidth(width, true);
                // From now on: we MUST take the final reached width, because due to cellrestrictions, it might differ from what is set.

                widthPxAttempt = (newWidthPercented ? Math.round((dtWidthWithBorder*width/100)) : width) + expansion;

                width = instance.getColumnWidthPx(colIndex);
                // now comes the tricky part: final width might be different then was requested, due to celrestrictions (unbeakable content)
                // So, we need to redefine it again to both the col, as the colconfig.width
                if (widthPxAttempt!==width) {
                    // next setCellWidth we must take care: width is transformed to pixels.
                    // in case of percent, we need to transform it again
                    setCellWidth((newWidthPercented ? (100*width/dtWidthWithBorder).toFixed(2) : width), false);
                }

                if (lastIndex>0) {
                    if (bkpColWidth>0) {
                        noWidthCol.setStyle('width', bkpColWidth+'px');
                    }
                }
                else {
                    resetContainer.setStyle('width', dtWidth+'px');
                    if (scrollY) {
                        realDataTable.setStyle('width', parseInt(yScrollerContainer.getStyle('width'), 10)+'px');
                    }
                }
                newWidth = bkpDatatableWidth + width - prevWidthPx;

                // was there any change anyway? Then reset the tableUI
                // reset the datatable-width or the container width. What need to be set -or justified- depends on the scroll-type of DataTable
                if ((width !== prevWidthPx) || busyTransformAllColumnWidthToPixels) {
                    Y.log('setColumnWidth: colwidth changed from '+prevWidthPx+'px --> '+width+'px', 'info', 'DTColumnResize');
                    if (scrollY) {
                        // now set the innerwidth of the div inside scrollable TH
                        scrollThDiv = instance._dtScrollLiners.item(colIndex);
                        scrollTh = scrollThDiv.get('parentNode');
                        corrected =  badColWidth ? width : (width -
                                                            getCellStyle(scrollThDiv, 'paddingLeft') -
                                                            getCellStyle(scrollThDiv, 'paddingRight') -
                                                            getCellStyle(scrollTh, 'borderLeftWidth') -
                                                            getCellStyle(scrollTh, 'borderRightWidth'));
                        setColWidth(scrollThDiv, corrected);
                        if (!busyDistributeRemainingSpace && !busyTransformAllColumnWidthToPixels) {
                            if (dtWidthDefined) {
                                yScrollerContainer.setStyle('width', newWidth+'px');
                                instance._checkRemainingColSpace();
                            }
                            else {
                                Y.log('setColumnWidth: changing tablewidth '+bkpDatatableWidth +'px --> '+newWidth+'px', 'info', 'DTColumnResize');
                                instance._syncYScrollerUI(newWidth);
                            }

                        }
                    }
                    else {
                        if (!busyDistributeRemainingSpace && !busyTransformAllColumnWidthToPixels) {
                            Y.log('setColumnWidth: setting tablewidth from '+bkpDatatableWidth +'px --> '+newWidth+'px', 'info', 'DTColumnResize');
                            realDataTable.setStyle('width', newWidth+'px');
                            if (!dtWidthDefined) {
                                // don't reset the datatable width during resize: this would take too much performance.
                                // Instead, during resize, we will reset the dt-width after resize:end
                                instance._setDTWidthFromInternal(newWidth+DATATABLE_BORDERWIDTH);
                                instance._dtXScroller.setStyle('width', (newWidth)+'px');
                                instance._dtBoundingBox.setStyle('width', (newWidth+DATATABLE_BORDERWIDTH)+'px');
                            }
                            else {
                                realDataTable.setStyle('width', newWidth+'px');
                                instance._checkRemainingColSpace();
                            }
                        }
                    }
                }
                else if (lastIndex===0) {
                    // no widthchange, but we need to reset the width on the resetcontainer
                    resetContainer.setStyle('width', prevWidthPx+'px');
                }
                // to return the with in percent (when needed), transform width
                if (newWidthPercented) {
                    // next setCellWidth we must take care: width is transformed to pixels.
                    // in case of percent, we need to transfprm it again
                    width = (100*width/dtWidthWithBorder).toFixed(2) + '%';
                }
                Y.log('setColumnWidth has set column '+colIndex+' to '+width + (newWidthPercented ? '' : 'px'),'info', 'DTColumnResize');
                if (!busyResize || busyDistributeRemainingSpace) {
                    /**
                     * In case of a resized column, colWidthChange will be fired by the host-datatable during resizing
                     * When pixels are set: a number is returned, in case of percented value: a String (ending with %)
                     * @event colWidthChange
                     * @param {EventFacade} e Event object
                     * @param {Int} e.colIndex
                     * @param {Int|String} e.prevVal
                     * @param {Int|String} e.newVal
                    */
                    // CAUTIOUS: if (fireInPercent && !newWidthPercented), then width is still in pixels, but we need percents to be fired!
                    dt.fire('colWidthChange', {colIndex: colIndex, prevVal: eventPrevValue,
                             newVal: (fireInPercent && !newWidthPercented) ? (100*width/dtWidthWithBorder).toFixed(2)+'%' : width});
                }

            }
            else {
                Y.log('setColumnWidth called but no widthchanges necessary newWidthPercented','info', 'DTColumnResize');
                width = prevWidthPercent || prevWidthPx;
            }
            return width;
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            Y.log('destructor', 'info', 'DTColumnResize');
            var instance = this,
                dt = instance.datatable,
                dtHandles = dt._eventHandles,
                sortable = dt.get('sortable');

            if (instance._resizeEvent) {
                instance._resizeEvent.detach();
            }
            instance._clearEventhandlers();
            instance._clearResizeEventhandlers();
            instance._dtBoundingBox.removeClass(DATATABLE_BUSY_RESIZING_CLASS);
            // we need to attach the original resize-event again.
            if (!dt._scrollResizeHandle) {
                dt._scrollResizeHandle = Y.on('resize',
                    Y.rbind(dt._syncScrollUI, dt)
                );
            }
            // In case of sortable datatable: we need to attach the original event again.
            if (Lang.isBoolean(sortable) && sortable) {
                dtHandles.sortUITrigger = dt.delegate(['click','keydown'],
                    Y.rbind('_onUITriggerSort', dt),
                    '.' + dt.getClassName('sortable', 'column')
                );
            }
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Calls _initUI but only after checking -and modifying- the x-scroller.
         * This means: We ALWAYS want a x-scroller in cases the DataTable has a defined width.
         *
         * @method _render
         * @private
         * @since 0.1
         *
        */
        _render: function() {
            Y.log('_render', 'info', 'DTColumnResize');
            var instance = this,
                dt = instance.datatable,
                scrollAttrs = dt.get('scrollable'),
                xScrollableTable = scrollAttrs && (scrollAttrs.indexOf('x')>-1);

            if (!xScrollableTable) {
                // always activate the xScroller --> this way we can controll the colwidths in a decent matter
                // even if no dt-width is set (and dt is always as width as all colls), it stil is useful, because if the users changes
                // the d-width to a defined value, the x-scroller is ready to be used imediately
                Y.use(
                    'datatable-scroll',
                    Y.bind(
                        function(Y) {
                            Y.log('Adding a x-scroller', 'info', 'DTColumnResize');
                            dt.set('scrollable', (scrollAttrs && (scrollAttrs.indexOf('y')>-1)) ? 'xy' : 'x');
                            this._initUI();
                        },
                        instance
                    )
                );
            }
            else {
                instance._initUI();
            }
        },

        /**
         * Does the initialisation of the UI in a way that we can use predictable colwidths.
         * Will call _bindUI() afterwards.
         *
         * @method _initUI
         * @private
         * @since 0.1
         *
        */
        _initUI : function() {
            var instance = this,
                dt = instance.datatable,
                dtWidth = dt.get('width');

            if (dtWidth==='') {
                // If no dt-width is defined, then we set it ourselves in order to get the x-scroller rendered
                // Also, we must store the fact that the original dt had no width specified: when resizing colls this will lead to expansion of the dt
                // The final tablewidth will be set after resizing
                // don't want event 'datatable.widthChange' to trigger this._justifyTableWidth():
                instance._dtWidthDefined = false;
                instance._setDTWidthFromInternal(1);
            }
            else {
                instance._dtWidthDefined = true;
                instance._dtWidthIsPercented = (dtWidth.substr(dtWidth.length-1)==='%');
            }
            instance._initPrivateVars();
            instance._justifyTableWidth();
            instance._bindUI();
        },

        /**
         * Binding events
         *
         * @method _bindUI
         * @private
         * @since 0.1
        */
        _bindUI : function() {
            Y.log('_bindUI', 'info', 'DTColumnResize');
            var instance = this,
                dt = instance.datatable,
                eventhandlers = instance._eventhandlers,
                sortable = dt.get('sortable'),
                currentSortEventHandler;

            instance._activateColResizer({newVal: dt.get('colsresizable')});

            // Justify the tablewidth again after one of these changes:
            eventhandlers.push(
                dt.after(
                    'colsresizableChange',
                    instance._activateColResizer,
                    instance
                )
            );

            eventhandlers.push(
                dt.after(
                    'renderView',
                    function() {
                        instance._initPrivateVars();
                        instance._syncTableUI();
                    },
                    instance
                )
            );

            // Justify the tablewidth again after one of these changes:
            // CAUTION: as soon as row-update or cell-update comes available in datatable, dataChange might not be fired!
            // We need to bind that new event also (at that time)
            eventhandlers.push(
                dt.after(
                    ['columnsChange', 'dataChange', 'scrollableChange'],
                    instance._syncTableUI,
                    instance
                )
            );

            // Justify the tablewidth again after render view or when there is a columnChange
            eventhandlers.push(
                dt.after(
                    'widthChange',
                    instance._justifyTableAfterTableWidthChange,
                    instance
                )
            );

            // In case there are images in the data that get loaded, the cell will expand after rendering
            // So we need to catch those events and resync if they occur
            eventhandlers.push(
                dt.delegate(
                    'load',
                    Y.rbind(instance._syncTableUI, instance),
                    'img'
                )
            );

            // Detach the _scrollResizeHandle that was made by datatable-scroll, and redefine it with _syncScrollUIPercentedDT
            if (dt._scrollResizeHandle) {
                dt._scrollResizeHandle.detach();
                dt._scrollResizeHandle = null;
            }

            dt._scrollResizeHandle = Y.on(
                'resize',
                Y.rbind(instance._syncScrollUIPercentedDT, instance)
            );

            if ((sortable==='auto') || (Lang.isBoolean(sortable) && sortable)) {
                // first detach current handler
                currentSortEventHandler = dt._eventHandles.sortUITrigger;
                if (currentSortEventHandler) {
                    currentSortEventHandler.detach();
                    currentSortEventHandler = null;
                }
                // now attach it again. keydown without restriction, but click should check first if mouse is in resizable area
                if (dt._theadNode) {
                    eventhandlers.push(
                        dt.delegate(
                            'keydown',
                            Y.rbind(instance._triggerSort, instance),
                            '.' + dt.getClassName('sortable', 'column')
                        )
                    );
                    eventhandlers.push(
                        dt.delegate(
                            'click',
                            Y.rbind(instance._triggerSort, instance),
                            function() {
                                return (!instance._comingFromResize && this.hasClass(dt.getClassName('sortable', 'column')));
                            }
                        )
                    );
                }
            }
        },

        /**
         * Syncs the DataTable's user interface, used internally
         * If the user should ever update cellcontent without without using set('data') or set('columns'),
         * then this method should be excecuted to make the UI fit again!
         *
         * @method _syncTableUI
         * @private
         * @since 0.1
         *
        */
        _syncTableUI : function() {
            Y.log('_syncTableUI', 'info', 'DTColumnResize');
            var instance = this;

            if (!instance._widthChangeInternally) {
                instance._widthChangeInternally = true;
                instance._justifyTableWidth();
            }
            instance._widthChangeInternally = false;
        },

        /**
         * Binds events which make resizing of the columns posible, or deactivate
         *
         * @method _activateColResizer
         * @private
         * @param {e} eventFacade
         * @since 0.1
        */
        _activateColResizer : function(e) {
            Y.log('_activateColResizer', 'info', 'DTColumnResize');
            var instance = this,
                colsresizable = e.newVal,
                resizeEventhandlers = instance._resizeEventhandlers,
                colsresizableDefined = Lang.isBoolean(colsresizable),
                workingHeader = instance._dtScrollHeader || instance._dtRealDataTableHeader;

            if (colsresizableDefined && !colsresizable) {
                instance._clearResizeEventhandlers();
            }
            else {
                instance._allColsResizable = colsresizableDefined && colsresizable;
                // when the mouse moves, while not resizing, you might be entering the area where resizing may start
                resizeEventhandlers.push(
                    workingHeader.delegate(
                        ['mousemove', 'touchstart'],
                        instance._checkResizeAprovement,
                        'th',
                        instance
                    )
                );

                // mouse might leave the thead when the state was this._resizeApproved, but not this._busyResize.
                // In those cases this._resizeApproved needs to be set false
                resizeEventhandlers.push(
                    workingHeader.on(
                        'mouseleave',
                        instance._checkEndResizeApprovement,
                        instance
                    )
                );

                // on mousedown, you might be starting resizing (depending on the value of this._resizeApproved)
                resizeEventhandlers.push(
                    workingHeader.delegate(
                        ['mousedown', 'touchstart'],
                        instance._startResize,
                        'th',
                        instance
                    )
                );

                // stop resizing when the mouse comes up
                // also stop resizing when the mouse leaves the body (while still might be in down state)
                resizeEventhandlers.push(
                    instance._bodyNode.on(
                        ['mouseup', 'mouseleave', 'touchend'],
                        instance._stopResize,
                        instance
                    )
                );
            }
        },

        /**
         * Syncs the UI of datatables whose width is in percents. It overrules datatable._syncScrollUI.
         *
         * @method _syncScrollUIPercentedDT
         * @private
         * @since 0.1
         *
        */
        _syncScrollUIPercentedDT: function() {
            var instance = this,
                dt = instance.datatable;

            // will always be during rendering dt, so we need to suppress first call
            if (instance._resizeEventMayOccur && instance._dtWidthIsPercented) {
                // Actually we SHOULD call this method ALSO when datatable has no width specified,
                // and when there are percented cols available --> they need new width.
                // However, calling dt._syncScrollUI, or dt.set('width') will lead to hanging the
                // resize-event --> for 1 time everything is excecuted, but the resizeevent never fires again !!!!
                Y.log('_syncScrollUIPercentedDT', 'info', 'DTColumnResize');
                Y.rbind(dt._syncScrollUI, dt)();
                instance._syncTableUI();
            }
            else {
                instance._resizeEventMayOccur = true;
            }
        },

        /**
         * Does the actual sort of columns - if sortable<br>
         * Reason to pverride the standard sortable is, that this module can have tablewidth with large width-values.
         * In order to prevent resetting the width of the table during sorting
         * (something the standard DataTable-sort will do), we need to set a fixed with on the contentbox (posible large value).
         * We don't want to keep that large width, because that would
         * lead to a screen x-sroller on the page.
         *
         * @method _triggerSort
         * @private
         * @protected
         * @param {e} eventFacade
         * @since 0.1
         *
        */
        _triggerSort: function(e) {
            var instance = this,
                dt = instance.datatable,
                contentBox = instance._dtContentBox,
                yScrollerContainer = instance._dtYScrollerContainer,
                realDataTable = instance._dtRealDataTable,
                scrollHeaders, resizableThNodes, prevYScrollerContainerWidth, prevRealDataTableWidth;

            Y.log('_triggerSort', 'info', 'DTColumnResize');
            if (instance._dtScrollY) {
                // Due to a bug: Only in browsers where Y-Scroller is always visible (FF), when the extra amount
                // that is overlapping reaches just in the width-area (xscroller between 1-15 px), then after a col-resort
                // YScrollerContainer and realDataTable get wrong values. We need to restore that.
                // Also: YScroller WILL REMOVE RESIZABLE_COLUMN_CLASS of ALL th-nodes, so we need to add that again!
                prevYScrollerContainerWidth = parseInt(yScrollerContainer.getStyle('width'), 10);
                prevRealDataTableWidth = parseInt(realDataTable.getStyle('width'), 10);
                resizableThNodes = [];
                scrollHeaders = instance._dtScrollHeader.all('th');
                scrollHeaders.each(
                    function(thNode, index) {
                        if (thNode.hasClass(RESIZABLE_COLUMN_CLASS)) {
                            resizableThNodes.push(index);
                        }
                    }
                );
                Y.bind('_onUITriggerSort', dt, e)();
                YArray.each(
                    resizableThNodes,
                    function(item) {
                        scrollHeaders.item(item).addClass(RESIZABLE_COLUMN_CLASS);
                    }
                );
                yScrollerContainer.setStyle('width', prevYScrollerContainerWidth+'px');
                realDataTable.setStyle('width', prevRealDataTableWidth+'px');
                instance._dtYScrollBar.setStyle('left', (parseInt(instance._dtXScroller.getStyle('width'),10)-15)+'px');
            }
            else  {
                // we must set the width of contentbox, otherwise resorting will reset the tablewidth to fit in the x-scrollable area
                contentBox.setStyle('width', parseInt(instance._dtRealDataTable.getStyle('width'), 10)+DATATABLE_BORDERWIDTH+'px');
                Y.bind('_onUITriggerSort', dt, e)();
                // clear width contentbox to prevent big page x-scroller
                contentBox.setStyle('width', '');
            }
        },

        /**
         * Will be executed at the start of a resizeaction<br>
         * This function will first check whether a resize can be made (cursor===cursor:column) and if so, it initializes some values.
         *
         * @method _startResize
         * @private
         * @param {e} eventFacade
         * @since 0.1
         *
        */
        _startResize: function(e) {
            Y.log('_startResize', 'info', 'DTColumnResize');
            var instance = this, dt,
                yScrollerContainer = instance._dtYScrollerContainer,
                resizeMargin, resizeMarginHalf, th, lastTh, allTh,
                mouseX, thWidth, thX, mouseInLeftNode, leftColIndex;

            if (instance._resizeApproved) {
                instance._busyResize = true;
                instance._comingFromResize = true;
                // attach move-event as soon as posible, to prevent users from dragging column (most right handler)
                instance._resizeEvent = instance._bodyNode.on(
                    ['mousemove', 'touchmove'],
                    instance._resizeColumn,
                    instance
                );
                Y.log('_startResize datatable column-resize will be started', 'info', 'DTColumnResize');
                // first find out whether the mouse is in the left area of the right-th node, or in the right area of the left-th node.
                // we need to know this, because the column-resize handlers overlap 2 th-nodes.
                dt = instance.datatable;
                resizeMargin = Y.UA.mobile ? instance.get('resizeMarginTouchDevice') : instance.get('resizeMargin');
                resizeMarginHalf = Math.round(resizeMargin/2);
                th = e.currentTarget;
                lastTh = (th.next('th')===null);
                mouseX = e.pageX;
                // Need to correct for padding-right: scrollable DataTables will add a padding-right to the last th-element
                thWidth = th.get('offsetWidth')- (yScrollerContainer ? parseInt(th.getStyle('paddingRight'), 10) : 0);
                thX = th.getX();
                mouseInLeftNode = mouseX>(thX+thWidth-(lastTh ? resizeMargin : resizeMarginHalf));
                if (mouseInLeftNode) {
                    instance._leftThNode = th;
                    instance._leftThX = thX;
                    instance._mouseOffset = thX+thWidth-mouseX;
                }
                else {
                    instance._leftThNode = th.previous('th');
                    instance._leftThX = instance._leftThNode.getX();
                    instance._mouseOffset = thX-mouseX;
                }
                allTh = th.get('parentNode').all('th');
                instance._leftColIndex = leftColIndex = allTh.indexOf(instance._leftThNode);
                instance._initialColWidth = instance.columnWidthIsPercent(leftColIndex) ? instance.getColumnWidthPercent(leftColIndex)
                                            : instance.getColumnWidthPx(leftColIndex);
                instance._changeUnselectableIE(true);
            }
        },

        /**
         * Will be executed at the end of a resizeaction<br>
         * This function will first check whether resizing is actually happens. In case columnwidths have been changed, an event will be fired.
         * Fires the event colWidthChange
         * @method _startResize
         * @private
         * @param {e} eventFacade
         * @param {Array} e.prevVal
         * contains objects with fields: colindex and width
         * @param {Array} e.newVal
         * contains objects with fields: colindex, width and changed
         * @since 0.1
         *
        */
        _stopResize: function(e) {
            Y.log('_stopResize', 'info', 'DTColumnResize');
            var instance = this,
                dt = instance.datatable,
                leftColIndex = instance._leftColIndex,
                dtWidthWithBorder, finalColWidth;

            if (instance._busyResize) {
                Y.log('_stopResize datatable column-resize is ended', 'info', 'DTColumnResize');
                // resizing will be ending. Fire event.
                if (instance._resizeEvent) {
                    instance._resizeEvent.detach();
                }
                finalColWidth = instance.getColumnWidthPx(instance._leftColIndex);
                instance._busyResize = false;
                instance._changeUnselectableIE(false);
                instance._checkResizeAprovement(e);
                // Don't know why, but we need to e.halt in order to fire a new event.
                e.halt();
                if (instance._initialColWidth !== finalColWidth) {
                    // to return the with in percent (when needed), transform width
                    if (instance.columnWidthIsPercent(leftColIndex)) {
                        dtWidthWithBorder = instance._dtWidthDefined ? (parseInt(instance._dtXScroller.getStyle('width'),10) + DATATABLE_BORDERWIDTH)
                                            : instance._datatableParentNode.get('offsetWidth');
                        finalColWidth = (100*finalColWidth/dtWidthWithBorder).toFixed(2) + '%';
                    }
                    dt.fire('colWidthChange', {colIndex: leftColIndex, prevVal: instance._initialColWidth, newVal: finalColWidth});
                    /**
                     * In case of a resized column, endresize:colWidthChange will be fired by the host-datatable after resizing
                     * This event will occur parallel to the colWidthChange-event which also occurs. You can listen for either of these.
                     * The difference between these events is that a datatable.setColumnWidth fires only the colWidthChange-event.
                     * When pixels are set: a number is returned, in case of percented value: a String (ending with %)
                     * @event resize:colWidthChange
                     * @param {EventFacade} e Event object
                     * @param {Int} e.colIndex
                     * @param {Int|String} e.prevVal
                     * @param {Int|String} e.newVal
                    */
                    dt.fire('endresize:colWidthChange', {colIndex: leftColIndex, prevVal: instance._initialColWidth, newVal: finalColWidth});
                }
                // set _comingFromResize to false AFTER a delay --> sorting headers will notice a click that needs to be prevented by this value
                Y.later(
                    200,
                    instance,
                    function() {
                        instance._comingFromResize = false;
                    }
                );

            }
        },

        /**
         * Checks whether the nouse is in a position that start-resizing is possible. If so, then the cursor will change to col-resize<br>
         *
         * @method _checkResizeAprovement
         * @private
         * @param {e} eventFacade
         * @since 0.1
         *
        */
        _checkResizeAprovement: function(e) {
            Y.log('_checkResizeAprovement', 'info', 'DTColumnResize');
            if (!this._busyResize) {
                var instance = this,
                    dt = instance.datatable,
                    boundingBox = dt.get('boundingBox'),
                    th = e.currentTarget,
                    lastTh = (th.next('th')===null),
                    thX = th.getX(),
                    mouseX = e.pageX,
                    // Need to correct for padding-right: scrollable DataTables will add a padding-right to the last th-element
                    thWidth = th.get('offsetWidth')- (instance._dtYScrollerContainer ? parseInt(th.getStyle('paddingRight'), 10) : 0),
                    resizeMargin = Y.UA.mobile ? instance.get('resizeMarginTouchDevice') : instance.get('resizeMargin'),
                    resizeMarginHalf = Math.round(resizeMargin/2),
                    fromLeft, fromRight, insideLeftArea, insideRightArea, leftSideFirstTh;

                fromLeft = mouseX-thX;
                fromRight = thX+thWidth-mouseX;
                insideLeftArea = (fromLeft<resizeMarginHalf);
                insideRightArea = (fromRight<(lastTh ? resizeMargin : resizeMarginHalf));
                leftSideFirstTh = insideLeftArea && (th.previous('th')===null);
                instance._resizeApproved = ((insideLeftArea || insideRightArea)
                    && !leftSideFirstTh
                    && (instance._allColsResizable || (insideLeftArea ? th.previous('th') : th).hasClass(RESIZABLE_COLUMN_CLASS))
                );
                boundingBox.toggleClass(DATATABLE_BUSY_RESIZING_CLASS, instance._resizeApproved);
                Y.log('_checkResizeAprovement toggleClass '+DATATABLE_BUSY_RESIZING_CLASS+' '+instance._resizeApproved, 'info', 'DTColumnResize');
            }
        },

        /**
         * Does the columnresize by calling this.setColumnWidth() of both left-th as well as right-th<br>
         * The right-th is the correction, where all pixels-difference from left-th are added/substracted to the right-th.
         * Fires the event resize:colWidthChange
         *
         * @method _resizeColumn
         * @private
         * @param {e} eventFacade
         * @since 0.1
         *
        */
        _resizeColumn: function(e) {
            if (this._busyResize) {
                // preventDefault, because in case of touch-event, the screen would have been moved.
                e.preventDefault();
                var instance = this,
                    leftColIndex = instance._leftColIndex,
                    lastColIndex = instance._lastColIndex,
                    prevWidth = instance.getColumnWidthPx(leftColIndex),
                    setNewLeftWidth = Math.round(e.pageX-instance._leftThX+instance._mouseOffset),
                    distributedSpace = instance._distributedSpace,
                    noaction, newWidth, compairContainer, widthXScroller, dtWidthWithBorder, widthCompairContainer;
                // we cannot decrease the last col if we have a x-scroller that is invisible because the cols fit exactly:
                if (leftColIndex===lastColIndex) {
                    compairContainer = instance._dtYScrollerContainer || instance._dtRealDataTable;
                    widthXScroller = parseInt(instance._dtXScroller.getStyle('width'),10);
                    widthCompairContainer = parseInt(compairContainer.getStyle('width'),10);
                    noaction = instance._dtWidthDefined && (widthXScroller>=widthCompairContainer)
                               && (setNewLeftWidth<prevWidth) && (distributedSpace===0);
                }
                if (!noaction) {
                    Y.log('_resizeColumn, leftcol-id:'+leftColIndex+' try set to '+setNewLeftWidth+'px', 'info', 'DTColumnResize');
                    // trick one: with fixed dt-width: the last col might get smaller value EVEN is noaction did not interupt.
                    // This would be the case if compairContainer.width>xScroller.width
                    // BUT the number of pixels that will be decreased CAN NEVER exceed the difference of compairContainer.width and xScroller.width
                    // corrected by instance._distributedSpace
                    // This could happen when the mouse moves very quick to the left
                    if (instance._dtWidthDefined && (leftColIndex===lastColIndex) && (setNewLeftWidth<prevWidth)) {
                        setNewLeftWidth = prevWidth - Math.min((prevWidth-setNewLeftWidth), (widthCompairContainer-widthXScroller+distributedSpace));
                    }
                    if (instance.columnWidthIsPercent(leftColIndex)) {
                        // set the new size in percent and NOT in pixels
                        // Only if the datatable-width is defined: if not, then percented-col has no meaning and we transform the colwidth to pixels
                        dtWidthWithBorder = instance._dtWidthDefined ? (parseInt(instance._dtXScroller.getStyle('width'),10) + DATATABLE_BORDERWIDTH)
                                            : instance._datatableParentNode.get('offsetWidth');
                        setNewLeftWidth = (100*setNewLeftWidth/dtWidthWithBorder).toFixed(2)+'%';
                        prevWidth = (100*prevWidth/dtWidthWithBorder).toFixed(2)+'%';
                    }
                    newWidth = instance.setColumnWidth(leftColIndex, setNewLeftWidth);
                    if (prevWidth!==newWidth) {
                        instance.datatable.fire('resize:colWidthChange', {colIndex: leftColIndex, prevVal: prevWidth, newVal: newWidth});
                    }
                }
                else {
                    Y.log('_resizeColumn, no action is taken: last col cannot become smaller', 'info', 'DTColumnResize');
                }
            }
        },

        /**
         * Determines whether a resize-state should be ended.
         * This is the case when this._resizeApproved===true && this._busyResize===false and the mouse gets out of thead
         *
         * @method _checkEndResizeApprovement
         * @private
         * @since 0.1
         *
        */
        _checkEndResizeApprovement: function() {
            Y.log('_checkEndResizeApprovement', 'info', 'DTColumnResize');
            var instance = this;

            if (instance._resizeApproved && !instance._busyResize) {
                instance._endResizeApprovement();
            }
        },

        /**
         * Will togle-off the cursor col-resize
         *
         * @method _endResizeApprovement
         * @private
         * @param {e} eventFacade
         * @since 0.1
         *
        */
        _endResizeApprovement: function() {
            Y.log('_endResizeApprovement', 'info', 'DTColumnResize');
            var instance = this;

            instance._resizeApproved = false;
            instance.datatable.get('boundingBox').toggleClass(DATATABLE_BUSY_RESIZING_CLASS, false);
        },


        /**
         * Defines some private datatable-variables
         * Use the method to prevent this from happening
         *
         * @method _initPrivateVars
         * @private
         * @since 0.1
         *
        */
        _initPrivateVars: function() {
            Y.log('_initPrivateVars', 'info', 'DTColumnResize');
            var instance = this,
                dt = instance.datatable,
                scrollAttrs = dt.get('scrollable'),
                contentBox, realDataTable, scrollHeader, yScrollerContainer, allThRealHeader, colgroupNode;

            instance._bodyNode = Y.one('body');
            instance._dtBoundingBox = dt.get('boundingBox');
            instance._datatableParentNode = instance._dtBoundingBox.get('parentNode');
            instance._dtContentBox = contentBox = dt.get('contentBox');
            instance._dtRealDataTable = realDataTable = contentBox.one('.'+dt.getClassName('table'));
            instance._dtXScroller = contentBox.one('.'+dt.getClassName('x', 'scroller'));
            instance._dtYScroller = contentBox.one('.'+dt.getClassName('y', 'scroller'));
            instance._dtYScrollerContainer = yScrollerContainer = contentBox.one('.'+dt.getClassName('y', 'scroller', 'container'));
            instance._dtYScrollBar = contentBox.one('.'+dt.getClassName('scrollbar'));
            instance._dtRealDataTableHeader = allThRealHeader = realDataTable.one('.'+dt.getClassName('columns'));
            instance._dtRealDataTableTHNodes = allThRealHeader.all('th');
            colgroupNode = contentBox.one('colgroup');
            instance._dtColNodes = colgroupNode && colgroupNode.all('col');
            instance._dtScrollHeader = scrollHeader = yScrollerContainer && yScrollerContainer.one('.'+dt.getClassName('scroll', 'columns'));
            instance._dtScrollLiners = scrollHeader && scrollHeader.all('.'+dt.getClassName('scroll', 'liner'));
            instance._dtScrollY = (scrollAttrs==='y') || (scrollAttrs==='xy') || (scrollAttrs===true);
        },


        /**
         * Justifies the tablewidth: will be called after datatable.changeWidth-event.
         *
         * @method _justifyTableAfterTableWidthChange
         * @private
         * @since 0.1
         *
        */
        _justifyTableAfterTableWidthChange : function() {
            var instance = this,
                dt = instance.datatable,
                dtWidth;

            // do not do this when busyResizing, because it will interfer, and it was meant for react for external width-changes
            if (!instance._busyResize) {
                Y.log('_justifyTableAfterTableWidthChange', 'info', 'DTColumnResize');
                dtWidth = dt.get('width');
                if (dtWidth==='') {
                    // If no dt-width is defined, then we set it ourselves in order to get the x-scroller rendered
                    // Also, we must store the fact that the original dt had no width specified: when resizing colls this will lead to
                    // expansion of the dt
                    // The final tablewidth will be set after resizing
                    // don't want event 'datatable.widthChange' to trigger this._justifyTableWidth():
                    instance._dtWidthDefined = false;
                    instance._setDTWidthFromInternal(1);
                }
                else {
                    instance._dtWidthDefined = true;
                    instance._dtWidthIsPercented = (dtWidth.substr(dtWidth.length-1)==='%');
                }
                instance._syncTableUI();
            }
        },

        /**
         * When the DataTable's columns have widths that expend the viewport, than the colwidths would normally be shrinked.
         * Use the method to prevent this from happening
         *
         * @method _justifyTableWidth
         * @private
         * @since 0.1
         *
        */
        _justifyTableWidth: function() {
            var instance = this,
                dt = instance.datatable,
                realDataTable = instance._dtRealDataTable,
                yScrollerContainer = instance._dtYScrollerContainer,
                yScrollBar = instance._dtYScrollBar,
                xScroller = instance._dtXScroller,
                scrollY = instance._dtScrollY,
                dtScrollHeader = instance._dtScrollHeader,
                allThRealHeader = instance._dtRealDataTableTHNodes,
                dtWidthDefined = instance._dtWidthDefined,
                scrollbarOffset = 0,
                scrollTheaders, colObject, lastColIndex, totalWidth;

            Y.log('_justifyTableWidth start', 'info', 'DTColumnResize');
            if (!dtWidthDefined) {
                xScroller.setStyle('overflowX', 'hidden');
            }

            instance._lastColIndex = lastColIndex = allThRealHeader.size()-1;

            // We MUST set the tablesize to 1px, otherwise some browsers will stretch it and return a false value of the columnwidths
            // DO NOT set width to '' or 0px, but to 1px (safari and chrome would otherwise fail)
            realDataTable.setStyle('width', '1px');
            if (scrollY) {
                yScrollerContainer.setStyle('width', '1px');
            }

            // ALWAYS transform columnwidth to pixels. This is KEY to a predictable colwidth. But first reset lastcolwidthexpansion
            totalWidth = instance._transformAllColumnWidthToPixels();
            // instance._distributedSpace should have been set to 0 by instance._transformAllColumnWidthToPixels
            // but just in case there are roundingerrors we set it exactly to 0
            if (instance._distributedSpace>0) {
                instance._distributedSpace = 0;
            }

            if (scrollY) {
                // Some browsers have the y-scrollbar above the last cell, dissapearing at will. Others have them laying next to the last cell.
                // We need to capture this behaviour when we want to repositions the y-scrollbar
                scrollTheaders = yScrollerContainer && dtScrollHeader.all('th');
                instance._scrollbarOffset = scrollbarOffset = (
                    scrollTheaders
                    && parseInt(scrollTheaders.item(scrollTheaders.size()-1).getStyle('paddingRight'), 10)
                ) || 0;
                totalWidth += scrollbarOffset;
                // in this stage, we need to set the width of yScrollerContainer
                yScrollerContainer.setStyle('width', totalWidth + 'px');
            }

            // in this stage, we need to set the width of realDataTable
            realDataTable.setStyle('width', totalWidth + 'px');
            totalWidth = Math.max(totalWidth, parseInt(xScroller.getStyle('width'), 10));

            if (scrollY) {
                dtScrollHeader.all('th').each(
                    function(th) {
                        // add the resizeclass to the th-elements of the scrollable header
                        colObject = dt.getColumn(th.getAttribute('data-yui3-col-id'));
                        th.toggleClass(RESIZABLE_COLUMN_CLASS, colObject && Lang.isBoolean(colObject.resizable) && colObject.resizable);
                    }
                );
                // Next is a fix to have the y-scroller also visible in browsers that autohide it (chrome, safari)
                yScrollBar.setStyle('width', '16px');
                instance._syncYScrollerUI(totalWidth);
            }
            else {
                // If not y-scroller, then add the resizeclass to the th-elements of the real datatable
                allThRealHeader.each(
                    function(th) {
                        colObject = dt.getColumn(th.getAttribute('data-yui3-col-id'));
                        th.toggleClass(RESIZABLE_COLUMN_CLASS, colObject && Lang.isBoolean(colObject.resizable) && colObject.resizable);
                    }
                );
                if (!dtWidthDefined) {
                    instance._setDTWidthFromInternal(totalWidth+DATATABLE_BORDERWIDTH);
                }
                else {
                    instance._checkRemainingColSpace();
                }
            }
            Y.log('_justifyTableWidth ready --> setting container to '+totalWidth, 'info', 'DTColumnResize');
        },

        /**
         * Because we cannot use unpredictable columnwidth, all columns must have a defined width.
         *
         * @method _transformAllColumnWidthToPixels
         * @private
         * @return total width of all cols
         * @since 0.1
         *
        */
        _transformAllColumnWidthToPixels: function() {
            var instance = this,
                dt = instance.datatable,
                dtWidthWithBorder = instance._dtWidthDefined ? (parseInt(instance._dtXScroller.getStyle('width'),10) + DATATABLE_BORDERWIDTH)
                                    : instance._datatableParentNode.get('offsetWidth'),
                notSpecCols = instance._notSpecCols,
                usedSpace = 0,
                remainingSpace = 0,
                allThRealHeader = instance._dtRealDataTableTHNodes, fireInPercent,
                width, configWidth, colConfigObject, percentWidth, total, thcell,
                storedPercentedWidth, expansion, definedColWidth, percentedIsStored;

            Y.log('_transformAllColumnWidthToPixels start', 'info', 'DTColumnResize');
            // prevent expanding last cell at this stage:
            instance._busyTransformAllColumnWidthToPixels = true;
            // empty current definition of notspeccols:
            notSpecCols.length = 0;

            allThRealHeader.each(
                function(th, index) {
                    colConfigObject = dt.getColumn(index);
                    configWidth = colConfigObject && colConfigObject.width;
                    percentWidth = configWidth &&  (configWidth.substr(configWidth.length-1)==='%');
                    thcell = allThRealHeader && allThRealHeader.item(index);
                    expansion = (thcell && thcell.getData(EXPANSIONDATA)) || 0;
                    storedPercentedWidth = (thcell && thcell.getData(PERCENTEDWIDTHDATA)) || '';
                    percentedIsStored = (storedPercentedWidth.length>0);
                    definedColWidth = (thcell && thcell.getData(DEFINEDCOLWIDTHDATA)) || DATAYES;
                    if (definedColWidth===DATAYES) {
                        if (percentWidth || percentedIsStored) {
                            // transform to pixels. BUT also need to store that the column was in percent!
                            if (percentedIsStored) {
                                // retake the percents instead of the set pixels
                                configWidth = storedPercentedWidth;
                            }
                            if (thcell) {
                                thcell.setData(PERCENTEDWIDTHDATA, configWidth);
                            }
                            configWidth = colConfigObject.width = Math.round(dtWidthWithBorder*parseFloat(configWidth)/100)+'px';
                            fireInPercent = true;
                        }
                        else {
                            fireInPercent = false;
                            if (thcell) {
                                // reset
                                thcell.setData(PERCENTEDWIDTHDATA, null);
                            }
                        }
                    }
                    if (configWidth && (definedColWidth===DATAYES)) {
                        // width is defined in objectconfig
                        width = parseInt(configWidth, 10) - expansion;
                        usedSpace += instance.setColumnWidth(index, width, 0, fireInPercent);
                    }
                    else {
                        // no width is defined in objectconfig --> store the column because we need to redefine all remaining space afterwards
                        notSpecCols.push(index);
                        if (thcell) {
                            thcell.setData(DEFINEDCOLWIDTHDATA, DATANO);
                        }
                    }
                }
            );
            if (notSpecCols.length>0) {
                // Define the exact colwidth to the colls in this second loop: need to be done after the predefined colls have their width
                remainingSpace = 0;
                YArray.each(
                    notSpecCols,
                    function(colIndex) {
                        remainingSpace += instance.setColumnWidth(colIndex, instance.getColumnWidthPx(colIndex, true));
                    }
                );
            }
            total = usedSpace + remainingSpace;
            instance._busyTransformAllColumnWidthToPixels = false;
            Y.log('_transformAllColumnWidthToPixels ready dtWidthWithBorder='+dtWidthWithBorder+'px, realtablewidth='
                   + parseInt(instance._dtRealDataTable.getStyle("width"),10)+'px, total colwidth='+total+'px', 'info', 'DTColumnResize');
            return total;
        },

        /**
         * In case of IE: Change text-unselectable of the cols
         *
         * @method _changeUnselectableIE
         * @private
         * @return total width of all cols
         * @since 0.1
         *
        */
        _changeUnselectableIE : function(noSelect) {
            var instance = this,
                headers = instance._dtScrollHeader || instance._dtRealDataTableHeader,
                headerList = headers && headers.all('th'),
                unselectableBkpList = instance._unselectableBkpList,
                bkpMade;

            if (Y.UA.ie>0) {
                Y.log('_changeUnselectableIE make unselectable: '+noSelect, 'info', 'DTColumnResize');
                bkpMade = (unselectableBkpList.length>0);
                headerList.each(
                    function(th, index) {
                        if (noSelect && !bkpMade) {
                            instance._unselectableBkpList.push(th.get('unselectable') || '');
                        }
                        th.setAttribute('unselectable', noSelect ? 'on' : ((unselectableBkpList.length>index) ? unselectableBkpList[index] : ''));
                    },
                    instance
                );
            }
        },

        /**
         * Checks the remaining colspace (space that needs to be filled up in database with fixed width)
         *
         * @method _checkRemainingColSpace
         * @param {Int} [yScrollerWidth] width of the previous YScrollerContainer
         * @private
         * @since 0.1
         *
        */
        _checkRemainingColSpace: function(yScrollerWidth) {
            var instance = this,
                xScroller = instance._dtXScroller,
                prevDistributedSpace = instance._distributedSpace,
                widthViewport = parseInt(xScroller.getStyle('width'), 10),
                distributeSpace, compairContainer, widthCompairContainer;

            if (instance._dtWidthDefined) {
                instance._busyDistributeRemainingSpace = true;  // prevent being looped within setColumnWidth
                compairContainer = instance._dtYScrollerContainer || instance._dtRealDataTable;
                widthCompairContainer = yScrollerWidth || parseInt(compairContainer.getStyle('width'),10);
                distributeSpace = prevDistributedSpace + widthViewport - widthCompairContainer;
                Y.log('_checkRemainingColSpace distributeSpace: '+distributeSpace+'--> set visibility to: '
                       +((distributeSpace<0) ? 'scroll' : 'hidden'), 'info', 'DTColumnResize');
                xScroller.setStyle('overflowX', (distributeSpace<0) ? 'scroll' : 'hidden');
                distributeSpace = Math.max(0, distributeSpace);
                compairContainer.setStyle('width', widthViewport+'px');
                instance._distributeRemainingSpace(distributeSpace);
                instance._busyDistributeRemainingSpace = false;
                widthCompairContainer = widthCompairContainer+distributeSpace-prevDistributedSpace;
                if (instance._dtScrollY) {
                    instance._syncYScrollerUI(widthCompairContainer, true);
                }
                else {
                    instance._dtRealDataTable.setStyle('width', widthCompairContainer + 'px');
                }
                // even if it is set within setColumnWidth, always reset it now (prevent diferentation over time due to rounding errors):
                instance._distributedSpace = distributeSpace;
            }
        },

        /**
         * Checks the remaining colspace (space that needs to be filled up in database with fixed width)
         *
         * @method _distributeRemainingSpace
         * @param {Int} amount number of pixels that have to be distributed
         * @private
         * @since 0.1
         *
        */
        _distributeRemainingSpace : function(amount) {
            Y.log('_distributeRemainingSpace --> set to '+amount+ ' extra pixels', 'info', 'DTColumnResize');
            var instance = this,
                notSpecCols = instance._notSpecCols,
                notSpecColSize = notSpecCols.length,
                correction, lastColCorrection;

            // instance._distributedSpace will be filled during resizing cols
            if (notSpecColSize>0) {
                // remaining space needs to be added to the undefined colls
                correction = Math.round(amount/notSpecColSize);
                // due to roundingdifferences, not all space might be added. Therefore we need an extra check
                lastColCorrection = correction + amount - (correction*notSpecColSize);
                YArray.each(
                    notSpecCols,
                    function(colIndex, item) {
                        var extra = (item===(notSpecColSize-1)) ? lastColCorrection : correction;
                        instance.setColumnWidth(colIndex, instance.getColumnWidthPx(colIndex, true), extra);
                    }
                );
            }
            else {
                instance._expandLastCell(amount);
            }
        },

        /**
         * In case of x-scroller: If -after changing columnwidth- the real DataTable is smaller than the x-scroll area:
         * the last cell will be expanded so that the complete datatable fits within the scrollable area
         *
         * @method _expandLastCell
         * @private
         * @since 0.1
         *
        */
        _expandLastCell: function(expand) {
            var instance = this,
                lastColIndex = instance._lastColIndex;

            instance.setColumnWidth(lastColIndex, instance.getColumnWidthPx(lastColIndex, true), expand);
            Y.log('_expandLastCell expanding last cell to '+expand+'  pixels', 'info', 'DTColumnResize');
        },

        /**
         * Syncs the YScroller-UI after a column changes its width.
         * @method _syncYScrollerUI
         * @private
         * @param {int} tableWidth width of the datatable visible area, without outside datatable-borders
         * @param {boolean} [comesFromCheckRemainingColSpace] internally used to mark when function is called from this._checkRemainingColSpace
         * @since 0.1
        */
        _syncYScrollerUI : function(tableWidth, comesFromCheckRemainingColSpace) {
            // always scrollabeY when called
            var instance = this,
                dt = instance.datatable,
                realDataTable = instance._dtRealDataTable,
                yScrollerContainer = instance._dtYScrollerContainer,
                prevWidthYScrollerContainer, xScrollerWidth;

            // to prevent getting into a loop: we must not call this method when this._busyDistributeRemainingSpace===true
            if (!instance._busyDistributeRemainingSpace) {
                if (instance._dtWidthDefined) {
                    // dt has width either in percent or pixels
                    // never sync to values below xScroller-width
                    xScrollerWidth = parseInt(instance._dtXScroller.getStyle('width'), 10);
                    tableWidth = Math.max(tableWidth, xScrollerWidth);
                    realDataTable.setStyle('width', (tableWidth-instance._scrollbarOffset)+'px');
                }
                else {
                    instance._setDTWidthFromInternal(tableWidth+DATATABLE_BORDERWIDTH);
                    instance._dtXScroller.setStyle('width', tableWidth+'px');
                    instance._dtBoundingBox.setStyle('width', (tableWidth+DATATABLE_BORDERWIDTH)+'px');
                }
                Y.log('_syncYScrollerUI to width '+tableWidth,'info', 'DTColumnResize');
                // Next we must do some settings to prevent chrome and safari to reset the totalwidth after resorting a column:
                // now resizing
                prevWidthYScrollerContainer = parseInt(yScrollerContainer.getStyle('width'), 10);
                yScrollerContainer.setStyle('width', tableWidth+'px');
                // Also reset scroller-y for this has a width of 1px
                instance._dtYScroller.setStyle('width', tableWidth+'px');
                // prevent looping by checking comesFromSetVisibilityXScroller
                if (!comesFromCheckRemainingColSpace) {
                    instance._checkRemainingColSpace(prevWidthYScrollerContainer);
                }
                if (!instance._dtWidthDefined) {
                    Y.rbind(dt._syncScrollUI, dt)();
                }
                // The scrollbar NEEDS to be set AFTER _checkRemainingColSpace and after _syncScrollUI
                instance._dtYScrollBar.setStyle('left', (parseInt(instance._dtXScroller.getStyle('width'),10)-15)+'px');
            }
        },

        /**
         * @method _getThCel
         * @param {Number|String} name key, name, or index of a column in the host's `_displayColumns` array.
         * @private
         * @return {Node} TH-node of the real datatable
         * @since 0.1
        */
        _getThCel: function(name) {
            Y.log('_getThCel', 'info', 'DTColumnResize');
            var instance = this,
                allThRealHeader = instance._dtRealDataTableTHNodes,
                colIndex;

            if (!Lang.isNumber(name)) {
                colIndex = instance._getColIndexFromName(name);
            }
            return allThRealHeader && allThRealHeader.item(colIndex || name);
        },

        /**
         * @method _getColIndexFromName
         * @param {String} name key or name of a column in the host's `_displayColumns` array.
         * @private
         * @return {int} col-index of a column in the host's `_displayColumns` array.
         * @since 0.1
        */
        _getColIndexFromName: function(name) {
            var instance = this,
                dt, colConfigObject, columns, colIndex;

            if (typeof name === 'string') {
                dt = instance.datatable;
                colConfigObject = dt.getColumn(name);
                columns = dt.get('columns');
                colIndex = YArray.indexOf(columns, colConfigObject);
            }
            Y.log('_getColIndexFromName '+name +' --> '+(colIndex || -1), 'info', 'DTColumnResize');
            return colIndex || -1;
        },

        /**
         * Sets the DT width, but only from calls within this module
         * It will prevent coming into a loop when datatable-Changewidth event occurs and it leaves this._dtWidthDefined to false
         * Should only be called when datatable has _dtWidthDefined set to false
         *
         * @method _setDTWidthFromInternal
         * @param {Number} newWidth new datatable width in pixels
         * @private
         * @protected
         * @since 0.1
        */
        _setDTWidthFromInternal : function(newWidth) {
            var instance = this,
                dt = instance.datatable,
                realDataTable = instance._dtRealDataTable,
                prevWidthRealDataTable;

            // be careful: realDataTable does not exist when called during very first initialisation by InitUI()
            // we don't need to restore this width anyway at that point.
            if (!instance._dtWidthDefined) {
                Y.log('_setDTWidthFromInternal new width: '+newWidth+'px', 'info', 'DTColumnResize');
                prevWidthRealDataTable = realDataTable && parseInt(realDataTable.getStyle('width'), 10);
                instance._widthChangeInternally = true;
                dt.set('width', newWidth+'px');
                instance._widthChangeInternally = false;
                // now set instance._dtWidthDefined to false again, because it was false and is set to true!
                instance._dtWidthDefined = false;
                // always reset the realdatatable, because it wis resetted by dt.set(width)
                if (realDataTable) {
                    realDataTable.setStyle('width', Math.max(prevWidthRealDataTable, parseInt(instance._dtXScroller.getStyle('width'), 10))+'px');
                }
            }
            else {
                Y.log('_setDTWidthFromInternal should NOT be called when datatable-width is defined', 'warn', 'DTColumnResize');
            }
        },

        /**
         * Cleaning up all resizeeventlisteners
         *
         * @method _clearResizeEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearResizeEventhandlers : function() {
            Y.log('_clearResizeEventhandlers', 'info', 'DTColumnResize');
            YArray.each(
                this._resizeEventhandlers,
                function(item){
                    item.detach();
                }
            );
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            Y.log('_clearEventhandlers', 'info', 'DTColumnResize');
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        }

    }, {
        NS : 'itsadtcr',
        ATTRS : {

            /**
             * @description Width of the area where the mouse turns into col-resize<br>
             * The value corresponds with an area that overlaps 2 columns (50% each)<br>
             * Has the same purpose as resizeMarginTouchDevice, only resizeMargin will be used on non-mobile devices<br>
             * While resizeMarginTouchDevice will be used on mobile devices<br>
             * minimum value = 2<br>
             * maximum value = 60
             * @default 14
             * @attribute resizeMargin
             * @type int
             * @since 0.1
            */
            resizeMargin: {
                value: 14,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=2) && (val<=60));
                }
            },

            /**
             * @description Width of the area where you can resize in touchdevices.<br>
             * The value corresponds with an area that overlaps 2 columns (50% each)<br>
             * Has the same purpose as resizeMargin, only resizeMargin will be used on non-mobile devices<br>
             * While resizeMarginTouchDevice will be used on mobile devices<br>
             * minimum value = 2<br>
             * maximum value = 60
             * @default 32
             * @attribute resizeMarginTouchDevice
             * @type int
             * @since 0.1
            */
            resizeMarginTouchDevice: {
                value: 32,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=2) && (val<=60));
                }
            },

            /**
             * @description Minamal colwidth that a column can reach by resizing<br>
             * Will be overruled by content of the columnheader, because the headingtext will always be visible<br>
             * minimum value = 0
             * @default 0
             * @attribute minColWidth
             * @type int
             * @since 0.1
            */
            minColWidth: {
                value: 0,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=0));
                }
            }

        }
    }
);

}, 'gallery-2013.02.27-21-03', {
    "requires": [
        "base-build",
        "plugin",
        "node-base",
        "node-screen",
        "node-event-delegate",
        "event-mouseenter",
        "event-custom",
        "event-resize",
        "event-touch",
        "datatable-column-widths"
    ],
    "skinnable": true
});
