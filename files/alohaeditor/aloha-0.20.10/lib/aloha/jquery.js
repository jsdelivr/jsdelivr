/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*
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

// define jquery and ext modules. They need to be available in global namespace
define('aloha/jquery',[], function() {
	// Work-around for http://bugs.jquery.com/ticket/9905
	// and https://github.com/alohaeditor/Aloha-Editor/issues/397
	if ( !Aloha.jQuery.support.getSetAttribute ) {
		( function( global ) {
			Aloha.jQuery.removeAttr = function( elem, name ) {
				elem.removeAttribute( name );
			};
		}( Aloha ));
	}

	return Aloha.jQuery;
});
