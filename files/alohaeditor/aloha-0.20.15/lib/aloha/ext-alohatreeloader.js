/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
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
['aloha/ext', 'aloha/repositorymanager'],
function(Ext, RepositoryManager) {
	

Ext.tree.AlohaTreeLoader = function(config) {
	Ext.apply(this, config);
	Ext.tree.AlohaTreeLoader.superclass.constructor.call(this);
};

Ext.extend( Ext.tree.AlohaTreeLoader, Ext.tree.TreeLoader, {
	paramOrder: ['node', 'id'],
	nodeParameter: 'id',
	directFn : function(node, id, callback) {
		var
			params = {
				inFolderId: node.id,
				objectTypeFilter: this.objectTypeFilter,
				repositoryId: node.repositoryId
			};

		RepositoryManager.getChildren ( params, function( items ) {
			var response = {};

			response = {
				status: true,
				scope: this,
				argument: {callback: callback, node: node}
			};

			if(typeof callback === 'function'){
				callback(items, response);
			}
		});
	},
	createNode: function(node) {
		if ( node.name ) {
			node.text = node.name;
		}
		if ( node.hasMoreItems ) {
			node.leaf = !node.hasMoreItems;
		}
		if ( node.objectType ) {
			node.cls = node.objectType;
		}
        return Ext.tree.TreeLoader.prototype.createNode.call(this, node);
    },
	objectTypeFilter : null,
	setObjectTypeFilter : function (otFilter) {
		this.objectTypeFilter = otFilter;
	},
	getObjectTypeFilter : function () {
		return this.objectTypeFilter;
	}
});

});
