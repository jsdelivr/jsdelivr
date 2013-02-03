/* table-plugin.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
 */
define([
	'aloha',
	'jquery',
	'aloha/plugin',
	'aloha/pluginmanager',
	'ui/ui',
	'ui/scopes',
	'ui/button',
	'ui/toggleButton',
	'ui/dialog',
	'ui/port-helper-attribute-field',
	'ui/port-helper-multi-split',
	'i18n!table/nls/i18n',
	'i18n!aloha/nls/i18n',
	'table/table-create-layer',
	'table/table',
	'table/table-plugin-utils'
], function(
	Aloha,
	jQuery,
	Plugin,
	PluginManager,
	Ui,
	Scopes,
	Button,
	ToggleButton,
	Dialog,
	AttributeField,
	MultiSplitButton,
	i18n,
	i18nCore,
	CreateLayer,
	Table,
	Utils
) {
	var GENTICS = window.GENTICS;
	
	/**
	 * Register the TablePlugin as Aloha.Plugin
	 */
	var TablePlugin = new Plugin('table');

	/**
	 * The Create-Layer Object of the TablePlugin
	 *
	 * @see Table.CreateLayer
	 */
	TablePlugin.createLayer = undefined;

	/**
	 * Configure the available languages
	 */
	TablePlugin.languages = ['en', 'de', 'fr', 'eo', 'fi', 'ru', 'it', 'pl'];

	/**
	 * default button configuration
	 */
	TablePlugin.config = [ 'table' ];

	/**
	 * An Array which holds all newly created tables contains DOM-Nodes of
	 * table-objects
	 */
	TablePlugin.TableRegistry = new Array();

	/**
	 * Holds the active table-object
	 */
	TablePlugin.activeTable = undefined;

	/**
	 * parameters-objects for tables
	 *
	 * @param className
	 *            The class of activated tables
	 */
	TablePlugin.parameters = {
		className            : 'aloha-table',                 // class of editable tables
		classSelectionRow    : 'aloha-table-selectcolumn',    // class for the upper table-row to select columns
		classSelectionColumn : 'aloha-table-selectrow',       // class for the left bound table-cells to select rows
		classLeftUpperCorner : 'aloha-table-leftuppercorner', // class for the left upper corner cell
		classTableWrapper    : 'aloha-table-wrapper',         // class of the outest table-wrapping div
		classCellSelected    : 'aloha-cell-selected',         // class of cell which are selected (row/column selection)
		waiRed               : 'aloha-wai-red',               // class that shows wai of div
		waiGreen             : 'aloha-wai-green',             // class that shows wai of div
		selectionArea        : 10                             // width/height of the selection rows (in pixel)
	};

  /**
   * @hide
   * {name:'green', text:'Green',tooltip:'Green',iconClass:'GENTICS_table GENTICS_button_green',cssClass:'green'}
  */
  TablePlugin.checkConfig = function (c){
        
    if (typeof c == 'object' && c.length) {
      var newC = [];
      
      for (var i = 0; i < c.length; i++) {
        if (c[i]) {
          newC.push({
            text	  : c[i].text	   ? c[i].text		: c[i].name,
            tooltip	  : c[i].tooltip   ? c[i].tooltip	: c[i].text,
            iconClass : c[i].iconClass ? c[i].iconClass	: 'aloha-icon-' + c[i].name,
            cssClass  : c[i].cssClass  ? c[i].cssClass	: c[i].name
          });
        }
      }
      
      c = newC;
    } else {
      c = [];
    }
    
    return c;
  };
  
	/**
	 * Init method of the Table-plugin transforms all tables in the document
	 *
	 * @return void
	 */
	TablePlugin.init = function() {
		var that = this,
		    isEnabled = {};

		// apply settings
		this.tableConfig = this.checkConfig(this.tableConfig||this.settings.tableConfig);
		this.columnConfig = this.checkConfig(this.columnConfig||this.settings.columnConfig);
		this.rowConfig = this.checkConfig(this.rowConfig||this.settings.rowConfig);
		
		// add reference to the create layer object
		this.createLayer = new CreateLayer( this );

		// subscribe for the 'editableActivated' event to activate all tables in the editable
		Aloha.bind( 'aloha-editable-created', function (event, editable) {
			var config = that.getEditableConfig(editable.obj);
			isEnabled[editable.getId()] = (-1 !== jQuery.inArray('table', config));

			// add a mousedown event to all created editables to check if focus leaves a table
			editable.obj.bind( 'mousedown', function ( jqEvent ) {
				TablePlugin.setFocusedTable( undefined );
			} );

			editable.obj.find( 'table' ).each( function () {
				// only convert tables which are editable
				if ( that.isEditableTable( this ) &&
						!TablePlugin.isWithinTable( this ) ) {
					var table = new Table( this, TablePlugin );
					table.parentEditable = editable;
					// table.activate();
					TablePlugin.TableRegistry.push( table );
				}
				
				TablePlugin.checkForNestedTables( editable.obj );
			} );
		} );

		// initialize the table buttons
		this.initTableButtons();

		Aloha.bind( 'aloha-table-selection-changed', function () {
			if ( null != TablePlugin.activeTable &&
					0 !== TablePlugin.activeTable.selection.selectedCells.length ) {
				TablePlugin.updateFloatingMenuScope();
			}

			// check if selected cells are split/merge able and set button status
			if ( typeof TablePlugin.activeTable !== 'undefined' &&
				TablePlugin.activeTable.selection ) {

				if ( TablePlugin.activeTable.selection.cellsAreSplitable() ) {
					that._splitcellsButton.enable(true);
					that._splitcellsRowButton.enable(true);
					that._splitcellsColumnButton.enable(true);
				} else {
					that._splitcellsButton.enable(false);
					that._splitcellsRowButton.enable(false);
					that._splitcellsColumnButton.enable(false);
				}

				if ( TablePlugin.activeTable.selection.cellsAreMergeable() ) {
					that._mergecellsButton.enable(true);
					that._mergecellsRowButton.enable(true);
					that._mergecellsColumnButton.enable(true);
				} else {
					that._mergecellsButton.enable(false);
					that._mergecellsRowButton.enable(false);
					that._mergecellsColumnButton.enable(false);
				}
			}

		});

		Aloha.bind( 'aloha-selection-changed', function (event, rangeObject) {
			// this case probably occurs when the selection is empty?
			if (!rangeObject.startContainer || !Aloha.activeEditable) {
				return;
			}

			// show hide buttons regarding configuration and DOM position
			if (isEnabled[Aloha.activeEditable.getId()] && Aloha.Selection.mayInsertTag('table') ) {
				that._createTableButton.show();
			} else {
				that._createTableButton.hide();
			}

			if (!that.activeTable) {
				return;
			}

			// check wheater we are inside a table
			var table = rangeObject.findMarkup(function() {
				return this.nodeName === 'TABLE';
			}, Aloha.activeEditable.obj);
			if (table) {
				TablePlugin.updateFloatingMenuScope();
			} else {
				that.activeTable.selection.cellSelectionMode = false; 
				that.activeTable.selection.baseCellPosition = null;
				that.activeTable.selection.lastSelectionRange = null; 
				that.activeTable.focusOut();
			}
		});

		// subscribe for the 'editableActivated' event to activate all tables in the editable
		Aloha.bind( 'aloha-editable-activated', function (event, props) {
			// disable all split / merge buttons

			that._splitcellsButton.enable(false);
			that._mergecellsButton.enable(false);
			that._splitcellsRowButton.enable(false);
			that._mergecellsRowButton.enable(false);
			that._splitcellsColumnButton.enable(false);
			that._mergecellsColumnButton.enable(false);

			props.editable.obj.find('table').each(function () {
				// shortcut for TableRegistry
				var tr = TablePlugin.TableRegistry;
				for (var i = 0; i < tr.length; i++) {
					if (tr[i].obj.attr('id') == jQuery(this).attr('id')) {
						// activate the table
						tr[i].activate();
						// and continue with the next table tag
						return true;
					}
				}

				// if we come here, we did not find the table in our registry, so we need to create a new one
				// only convert tables which are editable
				if ( that.isEditableTable( this ) &&
						!TablePlugin.isWithinTable( this ) ) {
					var table = new Table( this, TablePlugin );
					table.parentEditable = props.editable;
					table.activate();
					TablePlugin.TableRegistry.push( table );
				}
				
				TablePlugin.checkForNestedTables( props.editable.obj );
			});
		});

		// subscribe for the 'editableDeactivated' event to deactivate all tables in the editable
		Aloha.bind( 'aloha-editable-deactivated', function (event, properties) {
			if (TablePlugin.activeTable) {
				TablePlugin.activeTable.selection.unselectCells();
			}
			TablePlugin.setFocusedTable(undefined);

			// shortcut for TableRegistry
			var tr = TablePlugin.TableRegistry;
			for (var i = 0; i < tr.length; i++) {
				// activate the table
				tr[i].deactivate();
			}
		});
		
		Aloha.bind( 'aloha-smart-content-changed', function ( event ) {
			if ( Aloha.activeEditable ) {
				Aloha.activeEditable.obj.find( 'table' ).each( function () {
					if ( TablePlugin.indexOfTableInRegistry( this ) == -1 &&
							!TablePlugin.isWithinTable( this ) ) {
						this.id = GENTICS.Utils.guid();
						
						var table = new Table( this, TablePlugin );
						table.parentEditable = Aloha.activeEditable;
						TablePlugin.TableRegistry.push( table );
						table.activate();
					}
					
					TablePlugin.checkForNestedTables( Aloha.activeEditable.obj );
				} );
			}
		} );

		if ( this.settings.summaryinsidebar ) {
			Aloha.ready( function () { 
				that.initSidebar( Aloha.Sidebar.right.show() );  
			} );
		}
	};

	//namespace prefix for this plugin
	var tableNamespace = 'aloha-table';

	function nsSel () {
		var stringBuilder = [], prefix = tableNamespace;
		jQuery.each(arguments, function () { stringBuilder.push('.' + (this == '' ? prefix : prefix + '-' + this)); });
		return jQuery.trim(stringBuilder.join(' '));
	};

	//Creates string with this component's namepsace prefixed the each classname
	function nsClass () {
		var stringBuilder = [], prefix = tableNamespace;
		jQuery.each(arguments, function () { stringBuilder.push(this == '' ? prefix : prefix + '-' + this); });
		return jQuery.trim(stringBuilder.join(' '));
	};

	TablePlugin.initSidebar = function(sidebar) {
		var pl = this;
		pl.sidebar = sidebar;
		sidebar.addPanel({
            
            id       : nsClass('sidebar-panel'),
            title    : i18n.t('table.sidebar.title'),
            content  : '',
            expanded : true,
            activeOn : 'table',
            
            onInit   : function () {
            	var that = this,
	            content = this.setContent(
	                '<label class="' + nsClass('label') + '" for="' + nsClass('textarea') + '" >' + i18n.t('table.label.target') + '</label>' +
	                	'<textarea id="' + nsClass('textarea') + '" class="' + nsClass('textarea') + '" />').content;
	            
            	jQuery(nsSel('textarea')).live('keyup', function() { 
					//The original developer thought that escaping the
					//quote characters of the textarea value are
					//necessary to work around a bug in IE. I could not
					//reproduce the bug, so I commented the following
					//out.
					//.replace("\"", '&quot;').replace("'", "&#39;")
 					jQuery(that.effective).attr('summary', jQuery(nsSel('textarea')).val());
 					var waiDiv = jQuery('div[class*="wai"]', 'table#' + jQuery(that.effective).attr('id'));
 					waiDiv.removeClass(pl.get('waiGreen'));
 					waiDiv.removeClass(pl.get('waiRed'));
 				    
 					if (jQuery(nsSel('textarea')).val().trim() != '') {
 						waiDiv.addClass(pl.get('waiGreen'));
				    } else {
				    	waiDiv.addClass(pl.get('waiRed'));
				    }
 				});
            },
            
            onActivate: function (effective) {
            	var that = this;
				that.effective = effective;
				jQuery(nsSel('textarea')).val(jQuery(that.effective).attr('summary'));
            }
            
        });
		sidebar.show();
	};

	/**
	 * test if the table is editable
	 * @return boolean true if the table's parent element is contentEditable, false otherwise
	 */
	TablePlugin.isEditableTable = function (table) {
		return GENTICS.Utils.Dom.isEditable( table );
	};
	
	/**
	 * @param {DOMElement} table
	 * @return {Number}
	 */
	TablePlugin.indexOfTableInRegistry = function ( table ) {
		var registry = this.TableRegistry;
		
		for ( var i = 0; i < registry.length; i++ ) {
			// We need to find exactly the same object from the 
			// registry since we could also deal with cloned objects
			if ( registry[ i ].obj[ 0 ].id == table.id ) {
				return i;
			}
		}
		
		return -1;
	};
	
	/**
	 * @param {DOMElement} table
	 * @return {Table}
	 */
	TablePlugin.getTableFromRegistry = function ( table ) {
		var i = this.indexOfTableInRegistry( table );
		if ( i > -1 ) {
			return this.TableRegistry[ i ];
		}
		return null;
	};
	
	/**
	 * Checks whether the current selection is inside a table within an
	 * editable
	 *
	 * @return {Boolean} true if we are inside a table
	 */
	TablePlugin.isSelectionInTable = function () {
		var range = Aloha.Selection.getRangeObject();
		var container = jQuery( range.commonAncestorContainer );
		
		if ( container.length == 0 ) {
			return  false;
		}
		
		if ( container.parents( '.aloha-editable table' ).length ) {
			return true;
		}
		
		return false;
	};
	
	TablePlugin.preventNestedTables = function () {
		if ( this.isSelectionInTable() ) {
			Dialog.alert({
				title : i18n.t( 'Table' ),
				text  : i18n.t( 'table.createTable.nestedTablesNoSupported' )
			});
			
			return true;
		}
		
		return false;
	};
	
	/**
	 * Checks if the given element is within a table.
	 *
	 * @param {DOMElment} elem
	 * @return {Boolean} true if elem is nested within a table
	 */
	TablePlugin.isWithinTable = function ( elem ) {
		return ( jQuery( elem )
					.parents( '.aloha-editable table' )
						.length > 0 );
	};
	
	/**
	 * Checks for the presence of nested tables in the given editable.
	 * @todo complete
	 *		if ( editable.find( 'table table' ).length ) {
	 *			// show warning
	 *		} else {
	 *			// hide warning
	 *		}
	 * @param {jQuery} editable
	 */
	TablePlugin.checkForNestedTables = function ( editable ) {
		if ( editable.find( 'table table' ).length ) {
			// show warning
		} else {
			// hide warning
		}
	};

	TablePlugin.initMergeSplitCellsBtns = function(){
		// TODO current it is not possible to add the same buttons to
		//      multiple tabs. To work around this limitation we are
		//      defining the mergecells and splitcells components
		//      multiple times, once for each tab.

		this._mergecellsButton = Ui.adopt("mergecells", Button, {
			tooltip: i18n.t("button.mergecells.tooltip"),
			icon: "aloha-icon aloha-icon-mergecells",
			scope: this.name + '.cell',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.mergeCells();
				}
			}
		});

		this._splitcellsButton = Ui.adopt("splitcells", Button, {
			tooltip: i18n.t("button.splitcells.tooltip"),
			icon: "aloha-icon aloha-icon-splitcells",
			scope: this.name + '.cell',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.splitCells();
				}
			}
		});

		this._mergecellsRowButton = Ui.adopt("mergecellsRow", Button, {
			tooltip: i18n.t("button.mergecells.tooltip"),
			icon: "aloha-icon aloha-icon-mergecells",
			scope: this.name + '.row',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.mergeCells();
				}
			}
		});

		this._splitcellsRowButton = Ui.adopt("splitcellsRow", Button, {
			tooltip: i18n.t("button.splitcells.tooltip"),
			icon: "aloha-icon aloha-icon-splitcells",
			scope: this.name + '.row',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.splitCells();
				}
			}
		});

		this._mergecellsColumnButton = Ui.adopt("mergecellsColumn", Button, {
			tooltip: i18n.t("button.mergecells.tooltip"),
			icon: "aloha-icon aloha-icon-mergecells",
			scope: this.name + '.column',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.mergeCells();
				}
			}
		});

		this._splitcellsColumnButton = Ui.adopt("splitcellsColumn", Button, {
			tooltip: i18n.t("button.splitcells.tooltip"),
			icon: "aloha-icon aloha-icon-splitcells",
			scope: this.name + '.column',
			click: function() {
				if (TablePlugin.activeTable) {
					TablePlugin.activeTable.selection.splitCells();
				}
			}
		});
	};
	
	/**
	 * Adds default row buttons, and custom formatting buttons to floating menu
	 */
	TablePlugin.initRowsBtns = function () {
		var that = this;

		this._addrowbeforeButton = Ui.adopt("addrowbefore", Button, {
			tooltip: i18n.t( "button.addrowbefore.tooltip"),
			icon: "aloha-icon aloha-icon-addrowbefore",
			scope: this.name + '.row',
			click: function() {
				if (that.activeTable) {
					that.activeTable.addRowBeforeSelection();
				}
			}
		});

		this._addrowafterButton = Ui.adopt("addrowafter", Button, {
			tooltip: i18n.t("button.addrowafter.tooltip"),
			icon: "aloha-icon aloha-icon-addrowafter",
			scope: this.name + '.row',
			click: function() {
				if (that.activeTable) {
					that.activeTable.addRowAfterSelection();
				}
			}
		});

		this._deleterowsButton = Ui.adopt("deleterows", Button, {
			tooltip: i18n.t("button.delrows.tooltip"),
			icon: "aloha-icon aloha-icon-deleterows",
			scope: this.name + '.row',
			click: function() {
				if (that.activeTable) {
					var aTable = that.activeTable;
					Dialog.confirm({
						title: i18n.t('Table'),
						text: i18n.t('deleterows.confirm'),
						yes: function(){
							aTable.deleteRows();
						}
					});
				}
			}
		});

		this._rowheaderButton = Ui.adopt("rowheader", ToggleButton, {
			tooltip: i18n.t("button.rowheader.tooltip"),
			icon: "aloha-icon aloha-icon-rowheader",
			scope: this.name + '.row',
			click: function() {
				// table header
				if (that.activeTable) {
					var sc = that.activeTable.selection.selectedCells;
					that.rowsToSelect = [];
					var makeHeader = ( 
        				sc[0] && sc[0].nodeName.toLowerCase() == 'td' && sc.length == 1 ||
        					sc[0] && sc[0].nodeName.toLowerCase() == 'td' && 
        					sc[1].nodeName.toLowerCase() == 'td' );

					// if a selection was made, transform the selected cells
					for (var i = 0; i < sc.length; i++) {
						if (i == 0) {
							that.rowsToSelect.push(sc[i].rowIndex);
						}
						
						if ( makeHeader ) {
            				sc[i] = Aloha.Markup.transformDomObject(sc[i], 'th').attr('scope', 'col')[0];
						} else { 
            				sc[i] = Aloha.Markup.transformDomObject(sc[i], 'td').removeAttr('scope')[0];
						}
						
						jQuery(sc[i]).bind('mousedown', function (jqEvent) {
							var wrapper = jQuery(this).children('div').eq(0);
							window.setTimeout(function () {
								wrapper.trigger('focus');
							}, 1);
							// unselect cells
							if (that.activeTable) {
								that.activeTable.selection.unselectCells();
							}
						});
					}
					
					// selection could have changed.
					if (that.activeTable) {
						that.activeTable.refresh();
						that.activeTable.selectRows();
					}
				}
			}
		});
		
		// generate formatting buttons
		this.rowMSItems = [];
		jQuery.each(this.rowConfig, function (j, itemConf) {
			that.rowMSItems.push({
				name: itemConf.name,
				text: i18n.t(itemConf.text),
				tooltip: i18n.t(itemConf.tooltip),
				iconClass: 'aloha-icon aloha-row-layout ' + itemConf.iconClass,
				click: function () {
					if (that.activeTable) {
						var sc = that.activeTable.selection.selectedCells;
						// if a selection was made, transform the selected cells
						for (var i = 0; i < sc.length; i++) {
							if ( jQuery(sc[i]).attr('class').indexOf(itemConf.cssClass) > -1 ) {
								jQuery(sc[i]).removeClass(itemConf.cssClass);
							} else {
								jQuery(sc[i]).addClass(itemConf.cssClass);
								// remove all row formattings
								for (var f = 0; f < that.rowConfig.length; f++) {
									if (that.rowConfig[f].cssClass != itemConf.cssClass) {
										jQuery(sc[i]).removeClass(that.rowConfig[f].cssClass);
									}
								}
								
							}
						}
						// selection could have changed.
						that.activeTable.selectRows();
					}
				}
			});
		});
		
		if (this.rowMSItems.length > 0) {
			this.rowMSItems.push({
				name    : 'removeFormat',
				text    : i18n.t('button.removeFormat.text'),
				tooltip : i18n.t('button.removeFormat.tooltip'),
				'cls'   : 'aloha-ui-multisplit-fullwidth',
				wide    : true,
				click   : function () {
					if (that.activeTable) {
						var sc = that.activeTable.selection.selectedCells;
						// if a selection was made, transform the selected cells
						for (var i = 0; i < sc.length; i++) {
							for (var f = 0; f < that.rowConfig.length; f++) {
								jQuery(sc[i]).removeClass(that.rowConfig[f].cssClass);
							}
						}
						// selection could have changed.
						that.activeTable.selectRows();
					}
 				}
			});
		}
		
		this.rowMSButton = MultiSplitButton({
			items: this.rowMSItems,
			name: 'formatRow',
			hideIfEmpty: true,
			scope: this.name + '.row'
		});
	};

	/**
	 * Adds default column buttons, and custom formatting buttons to floating menu
	 */
	TablePlugin.initColumnBtns = function () {
		var that = this;

		this._addcolumnleftButton = Ui.adopt("addcolumnleft", Button, {
			tooltip: i18n.t("button.addcolleft.tooltip"),
			icon: "aloha-icon aloha-icon-addcolumnleft",
			scope: this.name + '.column',
			click: function() {
				if (that.activeTable) {
					that.activeTable.addColumnsLeft();
				}
			}
		});

		this._addcolumnrightButton = Ui.adopt("addcolumnright", Button, {
			tooltip: i18n.t("button.addcolright.tooltip"),
			icon: "aloha-icon aloha-icon-addcolumnright",
			scope: this.name + '.column',
			click: function() {
				if (that.activeTable) {
					that.activeTable.addColumnsRight();
				}
			}
		});

		this._deletecolumnsButton = Ui.adopt("deletecolumns", Button, {
			tooltip: i18n.t("button.delcols.tooltip"),
			icon: "aloha-icon aloha-icon-deletecolumns",
			scope: this.name + '.column',
			click: function() {
				if (that.activeTable) {
					var aTable = that.activeTable;
					Dialog.confirm({
						title: i18n.t('Table'),
						text: i18n.t('deletecolumns.confirm'),
						yes: function(){
							aTable.deleteColumns();
						}
					});
				}
			}
		});

	    this._columnheaderButton = Ui.adopt("columnheader", ToggleButton, {
			tooltip: i18n.t("button.columnheader.tooltip"),
			icon: "aloha-icon aloha-icon-columnheader",
			scope: this.name + '.column',
			click: function() {
				if (that.activeTable) {
    				var 
    	  			selectedColumnIdxs = that.activeTable.selection.selectedColumnIdxs,
    	  			cell,
    	  			isHeader = that.activeTable.selection.isHeader();

					for (var j = 0; j < that.activeTable.selection.selectedCells.length; j++) {
			    		cell = that.activeTable.selection.selectedCells[j];
						if ( isHeader ) {
			        		cell = Aloha.Markup.transformDomObject( cell, 'td' ).removeAttr( 'scope' ).get(0);
						} else { 
			        		cell = Aloha.Markup.transformDomObject( cell, 'th' ).attr( 'scope', 'row' ).get(0);
						}
						
						jQuery( that.activeTable.selection.selectedCells[j] ).bind( 'mousedown', function ( jqEvent ) {
							var wrapper = jQuery(this).children('div').eq(0);
							// lovely IE ;-)
							window.setTimeout(function () {
			            		wrapper.trigger( 'focus' );
							}, 1);
							// unselect cells
						});
						
					}
					// selection the column.
					that.activeTable.refresh();
					that.activeTable.selection.unselectCells();
					that.activeTable.selection.selectColumns( selectedColumnIdxs );
				}
			}
		});
		
		// generate formatting buttons
		this.columnMSItems = [];
		jQuery.each(this.columnConfig, function (j, itemConf) {
			var item = {
				name	  : itemConf.name,
				text	  : i18n.t(itemConf.text),
				tooltip	  : i18n.t(itemConf.tooltip),
				iconClass : 'aloha-icon aloha-column-layout ' + itemConf.iconClass,
				click	  : function (x,y,z) {
					if (that.activeTable) {
						var sc = that.activeTable.selection.selectedCells;
						// if a selection was made, transform the selected cells
						for (var i = 0; i < sc.length; i++) {
							if ( jQuery(sc[i]).attr('class').indexOf(itemConf.cssClass) > -1 ) {
								jQuery(sc[i]).removeClass(itemConf.cssClass);
							} else {
								jQuery(sc[i]).addClass(itemConf.cssClass);
								// remove all column formattings
								for (var f = 0; f < that.columnConfig.length; f++) {
									if (that.columnConfig[f].cssClass != itemConf.cssClass) {
										jQuery(sc[i]).removeClass(that.columnConfig[f].cssClass);
									}
								}
							}
						}
						// selection could have changed.
						that.activeTable.selectColumns();
					}
				}
			};
			
			that.columnMSItems.push(item);
		});
		
		if (this.columnMSItems.length > 0) {
			this.columnMSItems.push({
				name	: 'removeFormat',
				text	: i18n.t('button.removeFormat.text'),
				tooltip	: i18n.t('button.removeFormat.tooltip'),
				'cls'   : 'aloha-ui-multisplit-fullwidth',
				wide	: true,
				click	: function () {
					if (that.activeTable) {
						var sc = that.activeTable.selection.selectedCells;
						// if a selection was made, transform the selected cells
						for (var i = 0; i < sc.length; i++) {
							for (var f = 0; f < that.columnConfig.length; f++) {
								jQuery(sc[i]).removeClass(that.columnConfig[f].cssClass);
							}
						}
						// selection could have changed.
						that.activeTable.selectColumns();
					}
				}
			});
		}
		
		this.columnMSButton = MultiSplitButton({
			items: this.columnMSItems,
			name: 'formatColumn',
			hideIfEmpty: true,
			scope: this.name + '.column'
		});
	};

	/**
	 * initialize the buttons and register them on floating menu
	 */
	TablePlugin.initTableButtons = function () {
		var that = this;

		// generate the new scopes
		Scopes.createScope(this.name + '.row', 'Aloha.continuoustext');
		Scopes.createScope(this.name + '.column', 'Aloha.continuoustext');
		Scopes.createScope(this.name + '.cell', 'Aloha.continuoustext');

		this._createTableButton = Ui.adopt("createTable", Button, {
			tooltip: i18n.t("button.createtable.tooltip"),
			icon: "aloha-icon aloha-icon-createTable",
			scope: 'Aloha.continuoustext',
			click: function() {
				TablePlugin.createDialog(this.element);
			}
		});

		// now the specific table buttons

		// generate formatting buttons for columns
		this.initColumnBtns();

		// generate formatting buttons for rows
		this.initRowsBtns();

		this.initMergeSplitCellsBtns();

		// generate formatting buttons for tables
		this.tableMSItems = [];
		
		var tableConfig = this.tableConfig;
		
		jQuery.each(tableConfig, function(j, itemConf){
			that.tableMSItems.push({
				name: itemConf.name,
				text: i18n.t(itemConf.text),
				tooltip: i18n.t(itemConf.tooltip),
				iconClass: 'aloha-icon aloha-table-layout ' + itemConf.iconClass,
				click: function(){
					// set table css class
					if (that.activeTable) {
						for (var f = 0; f < tableConfig.length; f++) {
							that.activeTable.obj.removeClass(tableConfig[f].cssClass);
						}
						that.activeTable.obj.addClass(itemConf.cssClass);
					}
				}
			});
		});
		
		if(this.tableMSItems.length > 0) {
			this.tableMSItems.push({
				name    : 'removeFormat',
				text    : i18n.t('button.removeFormat.text'),
				tooltip : i18n.t('button.removeFormat.tooltip'),
				'cls'   : 'aloha-ui-multisplit-fullwidth',
				wide    : true,
				click   : function () {
					// remove all table classes
					if (that.activeTable) {
						for (var f = 0; f < tableConfig.length; f++) {
							that.activeTable.obj.removeClass(that.tableConfig[f].cssClass);
						}
					}
				}
			});
		}
		
		this.tableMSButton = MultiSplitButton({
			items : this.tableMSItems,
			name : 'formatTable',
			hideIfEmpty: true,
			scope: this.name + '.cell'
		});

		this._tableCaptionButton = Ui.adopt("tableCaption", ToggleButton, {
			tooltip: i18n.t("button.caption.tooltip"),
			icon: "aloha-icon aloha-icon-table-caption",
			scope: this.name + '.cell',
			click: function() {
				if (that.activeTable) {
					// look if table object has a child caption
					if ( that.activeTable.obj.children("caption").is('caption') ) {
						that.activeTable.obj.children("caption").remove();
					} else {
						var captionText = i18n.t('empty.caption');
						var c = jQuery('<caption></caption>');
						that.activeTable.obj.prepend(c);
						that.makeCaptionEditable(c, captionText);

						// get the editable span within the caption and select it
						var cDiv = c.find('div').eq(0);
						var captionContent = cDiv.contents().eq(0);
						if (captionContent.length > 0) {
							var newRange = new GENTICS.Utils.RangeObject();
							newRange.startContainer = newRange.endContainer = captionContent.get(0);
							newRange.startOffset = 0;
							newRange.endOffset = captionContent.text().length;

							// blur all editables within the table
							that.activeTable.obj.find('div.aloha-table-cell-editable').blur();

							cDiv.focus();
							newRange.select();
							Aloha.Selection.updateSelection();
						}
					}
				}
			}
		});

		this.summary = AttributeField( {
			width : 275,
			name  : 'tableSummary',
			noTargetHighlight: true,
			scope: this.name + '.cell'
		} );
		
		this.summary.addListener( 'keyup', function( event ) {
			that.activeTable.checkWai();
		} );
	};

	/**
	 * Helper method to make the caption editable
	 * @param caption caption as jQuery object
	 * @param captionText default text for the caption
	 */
	TablePlugin.makeCaptionEditable = function(caption, captionText) {
		var that = this;
		var cSpan = caption.children('div');
		if (cSpan.length === 0) {
			// generate a new div
			cSpan = jQuery('<div></div>');
			jQuery(cSpan).addClass('aloha-ui');
			jQuery(cSpan).addClass('aloha-editable-caption');
			if (caption.contents().length > 0) {
				// when the caption has content, we wrap it with the new div
				cSpan.append(caption.contents());
				caption.append(cSpan);
			} else {
				// caption has no content, so insert the default caption text
				if (captionText) {
					cSpan.text(captionText);
				}
				// and append the div into the caption
				caption.append(cSpan);
			}
		} else if (cSpan.length > 1) {
			// merge multiple divs (they are probably created by IE)
			caption.children('div:not(:first-child)').each(function () {
				$this = jQuery(this);
				cSpan.eq(0).append($this.contents());
				$this.remove();
			});
			cSpan = cSpan.eq(0);
		}
		// make the div editable
		cSpan.contentEditable(true);
	};

	/**
	 * This function adds the createDialog to the calling element
	 *
	 * @param callingElement
	 *            The element, which was clicked. It's needed to set the right
	 *            position to the create-table-dialog.
	 */
	TablePlugin.createDialog = function(callingElement) {
		// set the calling element to the layer the calling element mostly will be
		// the element which was clicked on it is used to position the createLayer
		this.createLayer.set('target', callingElement);

		// show the createLayer
		this.createLayer.show();
	};

	/**
	 * Creates a normal html-table, "activates" this table and inserts it into the
	 * active Editable
	 *
	 * @param cols
	 *            number of colums for the created table
	 * @param cols
	 *            number of rows for the created table
	 * @return void
	 */
	TablePlugin.createTable = function(cols, rows) {
		if ( this.preventNestedTables() ) {
			return;
		}
		
		// Check if there is an active Editable and that it contains an element (= .obj)
		if ( Aloha.activeEditable && typeof Aloha.activeEditable.obj !== 'undefined' ) {
			// create a dom-table object
			var table = document.createElement( 'table' );
			var tableId = table.id = GENTICS.Utils.guid();
			var tbody = document.createElement( 'tbody' );

			// create "rows"-number of rows
			for ( var i = 0; i < rows; i++ ) {
				var tr = document.createElement( 'tr' );
				// create "cols"-number of columns
				for ( var j = 0; j < cols; j++ ) {
					var text = document.createTextNode( '\u00a0' );
					var td = document.createElement( 'td' );
					td.appendChild( text );
					tr.appendChild( td );
				}
				tbody.appendChild( tr );
			}
			table.appendChild( tbody );
			
			prepareRangeContainersForInsertion(
				Aloha.Selection.getRangeObject(), table );
			
			// insert the table at the current selection
			GENTICS.Utils.Dom.insertIntoDOM(
				jQuery( table ),
				Aloha.Selection.getRangeObject(),
				Aloha.activeEditable.obj
			);
			
			cleanupAfterInsertion();
			
			var tableReloadedFromDOM = document.getElementById( tableId );

			if ( !TablePlugin.isWithinTable( tableReloadedFromDOM ) ) {
				var tableObj = new Table( tableReloadedFromDOM, TablePlugin );
				tableObj.parentEditable = Aloha.activeEditable;
				// transform the table to be editable
				tableObj.activate();

				// after creating the table, trigger a click into the first cell to
				// focus the content
				// for IE set a timeout of 10ms to focus the first cell, other wise it
				// won't work
				if ( jQuery.browser.msie ) {
					window.setTimeout( function () {
						tableObj.cells[ 0 ].wrapper.get( 0 ).focus();
					}, 20 );
				} else {
					tableObj.cells[ 0 ].wrapper.get( 0 ).focus();
				}

				TablePlugin.TableRegistry.push( tableObj );
			}
			
			TablePlugin.checkForNestedTables( Aloha.activeEditable.obj );

			// The selection starts out in the first cell of the new
			// table. The table tab/scope has to be activated
			// accordingly.
			tableObj.focus();
			TablePlugin.activeTable.selection.selectionType = 'cell';
			TablePlugin.updateFloatingMenuScope();

		} else {
			this.error( 'There is no active Editable where the table can be\
				inserted!' );
		}
	};
	
	TablePlugin.setFocusedTable = function(focusTable) {
		var that = this;

		// clicking outside the table unselects the cells of the table
		if ( null == focusTable && null != this.activeTable ) {
			this.activeTable.selection.unselectCells();
		}

		for (var i = 0; i < TablePlugin.TableRegistry.length; i++) {
			TablePlugin.TableRegistry[i].hasFocus = false;
		}
		if (typeof focusTable != 'undefined') {
			this.summary.setTargetObject(focusTable.obj, 'summary');
			if ( focusTable.obj.children("caption").is('caption') ) {
				// set caption button
				this._tableCaptionButton.setState(true);
				var c = focusTable.obj.children("caption");
				that.makeCaptionEditable(c);
			}
			focusTable.hasFocus = true;
		}
		TablePlugin.activeTable = focusTable;

		// show configured formatting classes
		for (var i = 0; i < this.tableMSItems.length; i++) {
			this.tableMSButton.showItem(this.tableMSItems[i].name);
		}
		this.tableMSButton.setActiveItem();
		
		if (this.activeTable) {
			for (var i = 0; i < this.tableConfig.length; i++) {
				if (this.activeTable.obj.hasClass(this.tableConfig[i].cssClass)) {
					this.tableMSButton.setActiveItem(this.tableConfig[i].name);
				}
			}
		}
	};

	/**
	 * Calls the Aloha.log function with 'error' level
	 *
	 * @see Aloha.log
	 * @param msg
	 *            The message to display
	 * @return void
	 */
	TablePlugin.error = function(msg) {
		Aloha.Log.error(this, msg);
	};

	/**
	 * Calls the Aloha.log function with 'debug' level
	 *
	 * @see Aloha.log
	 * @param msg
	 *            The message to display
	 * @return void
	 */
	TablePlugin.debug = function(msg) {
		Aloha.Log.debug(this, msg);
	};

	/**
	 * Calls the Aloha.log function with 'info' level
	 *
	 * @see Aloha.log
	 * @param msg
	 *            The message to display
	 * @return void
	 */
	TablePlugin.info = function(msg) {
		Aloha.Log.info(this, msg);
	};

	/**
	 * Calls the Aloha.log function with 'info' level
	 *
	 * @see Aloha.log
	 * @param msg
	 *            The message to display
	 * @return void
	 */
	TablePlugin.log = function(msg) {
		Aloha.log('log', this, msg);
	};

	/**
	 * The "get"-method returns the value of the given key.
	 * First it searches in the config for the property.
	 * If there is no property with the given name in the
	 * "config"-object it returns the entry associated with
	 * in the parameters-object
	 *
	 * @param property
	 * @return void
	 *
	 */
	TablePlugin.get = function (property) {
		if (this.config[property]) {
			return this.config[property];
		}
		if (this.parameters[property]) {
			return this.parameters[property];
		}
		return undefined;
	};

	/**
	 * The "set"-method takes a key and a value. It checks if there is a
	 * key-value pair in the config-object. If so it saves the data in the
	 * config-object. If not it saves the data in the parameters-object.
	 *
	 * @param key the key which should be set
	 * @param value the value which should be set for the associated key
	 */
	TablePlugin.set = function (key, value) {
		if (this.config[key]) {
			this.config[key] = value;
		}else{
			this.parameters[key] = value;
		}
	};

	/**
	 * Make the given jQuery object (representing an editable) clean for saving
	 * Find all tables and deactivate them
	 * @param obj jQuery object to make clean
	 * @return void
	 */
	TablePlugin.makeClean = function ( obj ) {
		var that = this;
		obj.find( 'table' ).each( function () {
			// Make sure that we only deactivate tables in obj which have the
			// same id as tables which have been activated and registered
			if ( that.getTableFromRegistry( this ) ) {
				( new Table( this, that ) ).deactivate();
				// remove the id attribute
				jQuery(this).attr('id', null);
			}
		} );
	};
	
	/**
	 * String representation of the Table-object
	 *
	 * @return The plugins namespace (string)
	 */
	TablePlugin.toString = function() {
		return this.prefix;
	};

	TablePlugin.updateFloatingMenuScope = function () {
		if ( null != TablePlugin.activeTable && null != TablePlugin.activeTable.selection.selectionType ) {
			Scopes.setScope(TablePlugin.name + '.' + TablePlugin.activeTable.selection.selectionType);
		}
	};
	
	PluginManager.register(TablePlugin);
	
	/**
	 * Detects a situation where we are about to insert content into a
	 * selection that looks like this: <p> [</p>...
	 * We will assume that the nbsp inside the <p> node was placed there to
	 * "prop-up" the empty paragraph--that is--to make the empty paragraph
	 * visible in HTML5 conformant rendering engines, like WebKit. Without the
	 * white space, such browsers would correctly render an empty <p> as
	 * invisible.
	 *
	 * If we detect this situation, we remove the white space so that when we
	 * paste new content into the paragraph, it is not be split and leaving an
	 * empty paragraph on top of the pasted content.
	 *
	 * Note that we do not use <br />'s to prop up the paragraphs, as WebKit
	 * does, because IE, will break from the HTML5 specification and will
	 * display empty paragraphs if they are content-editable. So a <br />
	 * inside an empty content-editable paragraph will result in 2 lines to be
	 * shown instead of 1 in IE.
	 * 
	 * @param {Object} range
	 * @param {DOMElement} table
	 */
	function prepareRangeContainersForInsertion ( range, table ) {
		var	eNode = range.endContainer,
			sNode = range.startContainer,
			eNodeLength = ( eNode.nodeType == 3 )
				? eNode.length
				: eNode.childNodes.length;		
		
		
		if ( sNode.nodeType == 3 &&
				sNode.parentNode.tagName == 'P' &&
					sNode.parentNode.childNodes.length == 1 &&
						/^(\s|%A0)$/.test( escape( sNode.data ) ) ) {
			sNode.data = '';
			range.startOffset = 0;
			
			// In case ... <p> []</p>
			if ( eNode == sNode ) {
				range.endOffset = 0;
			}
		}
		
		// If the table is not allowed to be nested inside the startContainer,
		// then it will have to be split in order to insert the table.
		// We will therefore check if the selection touches the start and/or
		// end of their container nodes.
		// If they do, we will mark their container so that after they are
		// split we can check whether or not they should be removed
		if ( !GENTICS.Utils.Dom.allowsNesting(
				sNode.nodeType == 3 ? sNode.parentNode : sNode, table ) ) {
			
			if ( range.startOffset == 0 ) {
				jQuery( sNode.nodeType == 3 ? sNode.parentNode : sNode )
					.addClass( 'aloha-table-cleanme' );
			}
			
			if ( range.endOffset == eNodeLength ) {
				jQuery( eNode.nodeType == 3 ? eNode.parentNode : eNode )
					.addClass( 'aloha-table-cleanme' );
			}
		}
	};
	
	/**
	 * Looks for elements marked with "aloha-table-cleanme", and removes them
	 * if they are absolutely empty.
	 * Note that this will leave paragraphs which contain empty nested elements
	 * even though they are also invisible.
	 * We can consider removing these as well at a later stage, if needed.
	 */
	function cleanupAfterInsertion () {
		var dirty = jQuery( '.aloha-table-cleanme' ).removeClass(
						'aloha-table-cleanme' );
		
		for ( var i = 0; i < dirty.length; i++ ) {
			if ( jQuery.trim( jQuery( dirty[ i ] ).html() ) == '' &&
					!GENTICS.Utils.Dom.isEditingHost( dirty[ i ] ) ) {
				jQuery( dirty[ i ] ).remove();
				
				/*
				// For debugging: to see what we are deleting
				jQuery( dirty[ i ] ).css({
					border: '3px solid red',
					display: 'block'
				});
				*/
			}
		}
	};
	
	return TablePlugin;
});
