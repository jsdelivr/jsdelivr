/* imagebrowser-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	// js
	'aloha',
	'jquery',
	'aloha/plugin',
	'aloha/pluginmanager',
	'ui/ui',
	'ui/button',
	'image/image-plugin',
	'RepositoryBrowser',
	// i18n
	'i18n!imagebrowser/nls/i18n',
	'i18n!aloha/nls/i18n'
], function(
	Aloha,
    jQuery,
    Plugin,
    PluginManager,
    Ui,
    Button,
    Images,
    RepositoryBrowser,
    i18n,
    i18nCore
) {
	

	var ImageBrowser = RepositoryBrowser.extend( {

		init: function ( config ) {
			this._super( config );

			var browser = this;

			this._imageBrowserButton = Ui.adopt('imageBrowser', Button, {
				tooltip: i18n.t('button.addimage.tooltip'),
				icon: 'aloha-icon-tree',
				scope: 'Aloha.continuoustext',
				click: function () { browser.open(); }
			});

			this._imageBrowserButton.show(false);

			this.url = Aloha.getAlohaUrl() + '/../plugins/extra/imagebrowser/';

			Aloha.bind( 'aloha-image-selected', function ( event, rangeObject ) {
				browser._imageBrowserButton.show(true);
			});
			Aloha.bind( 'aloha-image-unselected', function ( event, rangeObject ) {
				browser._imageBrowserButton.show(false);
			});
		},
		onSelect: function ( item ) {
			if ( item.type.match( 'image' ) !== null ) {
				Images.ui.imgSrcField.setItem( item );
				Images.resetSize(); // reset to original image size
				this.close();
			}
		},

		/**
		 * Overrides browser list items to show only images in the grid panel
		 */
		listItems: function ( items ) {
			var browser = this;
			var list = this.list.clearGridData();

			jQuery.each( items, function () {
				var obj = this.resource;
				if ( obj.type.match( 'image' ) !== null ) {
					list.addRowData(
						obj.uid,
						jQuery.extend( { id: obj.id }, browser.renderRowCols( obj ) )
					);
				}
			});
		},

		 /**
		  * Overrides column rendering
		  */
		renderRowCols: function ( item ) {
			var row = {},
			    pluginUrl = this.url,
			    icon = '__page__',
			    idMatch = item.id.match( /(\d+)\./ );

			jQuery.each( this.columns, function ( colName, v ) {
				switch ( colName ) {
				case 'icon':
					if ( !item.renditions ) {
						break;
					}
					if ( item.renditions.length === 1 ) {
						if ( item.renditions[ 0 ].kind === 'thumbnail' ) {
							row.icon = '<img width="' + item.renditions[ 0 ].width
							+ '" height="' + item.renditions[ 0 ].height
							+ ' " src="' + item.renditions[ 0 ].url + '"/>';
						}
					}
					break;
				default:
					row[ colName ] = item[ colName ] || '--';
				}
			});

			return row;
		}

	});

	var ImageBrowserPlugin = Plugin.create( 'imagebrowser', {
		dependencies: [ 'image' ],
		browser: null,
		init: function () {
			var config = {
				repositoryManager : Aloha.RepositoryManager,
				repositoryFilter  : [],
				objectTypeFilter  : [ 'image' /*, '*' */ ],
				renditionFilter	  : [ '*' ],
				filter			  : [ 'language' ],
				columns : {
					icon : { title: '',     width: 75,  sortable: false, resizable: false },
					name : { title: 'Name', width: 320, sorttype: 'text' }
				},
				rootPath : Aloha.settings.baseUrl + '/vendor/repository-browser/'
			};
			this.browser = new ImageBrowser( config );
		}
	});

	return ImageBrowserPlugin;
});
