/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*//*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define(
['aloha/ext', 'aloha/ui'],
function(Ext, ui) {
	

	var
//		$ = jQuery,
//		GENTICS = window.GENTICS,
//		Aloha = window.Aloha,
		Class = window.Class;

/**
 * !!!! ATTENTION !!!!
 * This is work in progress. This implemenation may change heavily.
 * Not yet implemented:
 * - configuring and templating the list
 * - DnD
 * - passing all possible query attributes to the repository
 * - query of subtree
 * - icon representation
 */
ui.Browser = Class.extend({
	_constructor: function () {

		/**
		 * @cfg Function called when an element is selected
		 */
		this.onSelect = null;

		var that = this;

		// define the grid that represents the filelist
		this.grid = new Ext.grid.GridPanel( {
			region : 'center',
			autoScroll : true,
			// the datastore can be used by the gridpanel to fetch data from
			// repository manager
			store : new Ext.data.Store( {
				proxy : new Ext.data.AlohaProxy(),
				reader : new Ext.data.AlohaObjectReader()
			}),
			columns : [ {
				id : 'name',
				header : 'Name',
				width : 100,
				sortable : true,
				dataIndex : 'name'
			}, {
				header : 'URL',
				renderer : function(val) {
					return val;
				},
				width : 300,
				sortable : true,
				dataIndex : 'url'
			} ],
			stripeRows : true,
			autoExpandColumn : 'name',
			height : 350,
			width : 600,
			title : 'Objectlist',
			stateful : true,
			stateId : 'grid',
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners : {
				'dblclick' : function(e) {
					that.onItemSelect();
				}
			}
		});
			this.grid.getSelectionModel().on({
				'selectionchange' : function(sm, n, node){
					var resourceItem = that.grid.getSelectionModel().getSelected();
					if (resourceItem) {
									this.win.buttons[1].enable();
					} else {
									this.win.buttons[1].disable();
					}
					},
					scope:this
			});


		// define the treepanel
		this.tree = new Ext.tree.TreePanel( {
			region : 'center',
			useArrows : true,
			autoScroll : true,
			animate : true,
			enableDD : true,
			containerScroll : true,
			border : false,
			loader : new Ext.tree.AlohaTreeLoader(),
			root : {
				nodeType : 'async',
				text : 'Aloha Repositories',
				draggable : false,
				id : 'aloha'
			},
			rootVisible : false,
			listeners : {
				'beforeload' : function(node) {
					this.loader.baseParams = {
						node : node.attributes
					};
				}
			}
		});
			this.tree.getSelectionModel().on({
					'selectionchange' : function(sm, node){
							if (node) {
								var resourceItem = node.attributes;
							that.grid.store.load({ params: {
								inFolderId: resourceItem.id,
								objectTypeFilter: that.objectTypeFilter,
								repositoryId: resourceItem.repositoryId
							}});
							}
					},
					scope:this
			});

		// nest the tree within a panel
		this.nav = new Ext.Panel( {
			title : 'Navigation',
			region : 'west',
			width : 300,
			layout : 'fit',
			collapsible : true,
			items : [ this.tree ]
		});

		// add the nested tree and grid (filelist) to the window
		this.win = new Ext.Window( {
			title : 'Resource Selector',
			layout : 'border',
			width : 800,
			height : 300,
			closeAction : 'hide',
			onEsc: function () {
				this.hide();
			},
			defaultButton: this.nav,
			plain : true,
			initHidden: true,
			items : [ this.nav, this.grid ],
			buttons : [{
				text : 'Close',
				handler : function() {
					that.win.hide();
				}
			}, {
				text : 'Select',
				disabled : true,
				handler : function() {
					that.onItemSelect();
				}
			}],
				toFront : function(e) {
						this.manager = this.manager || Ext.WindowMgr;
						this.manager.bringToFront(this);
						this.setZIndex(9999999999); // bring really to front (floating menu is not registered as window...)
						return this;
				}
		});

		this.onItemSelect = function () {
			var
				sm =  this.grid.getSelectionModel(),
				sel = (sm) ? sm.getSelected() : null,
				resourceItem = (sel) ? sel.data : null;
			this.win.hide();
			if ( typeof this.onSelect === 'function' ) {
				this.onSelect.call(this, resourceItem);
			}
		};
	},

	setObjectTypeFilter: function(otf) {
		this.objectTypeFilter = otf;
	},

	getObjectTypeFilter: function() {
		return this.objectTypeFilter;
	},

	show: function() {
		this.win.show(); // first show,
		this.win.toFront(true);
		this.win.focus();
	}
});

});
