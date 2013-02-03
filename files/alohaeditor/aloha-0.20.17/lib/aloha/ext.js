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

define('aloha/ext',[], function() {
	
	// Ext seems to have an onClick handler that uses
	// QuickTips, but the handler doesn't initialize
	// QuickTips and therefore causes an error.
	// The bug occurred with the Gentics Content Node
	// integration, but if it's really a bug in Ext, then
	// it's a good idea to always initialize QuickTips here.
	Ext.QuickTips.init();
	
	return Ext; 
});
