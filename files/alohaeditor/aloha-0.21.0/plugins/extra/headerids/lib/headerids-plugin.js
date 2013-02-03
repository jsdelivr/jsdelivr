/* headerids-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
	'jquery',
	'aloha/plugin',
	'i18n!headerids/nls/i18n',
	'i18n!aloha/nls/i18n'
],
function(jQuery, Plugin, i18n, i18nCore) {
	

	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Aloha = window.Aloha;



	// namespace prefix for this plugin
    var ns = 'aloha-headerids';
    
    
    // ------------------------------------------------------------------------
    // Local (helper) functions
    // ------------------------------------------------------------------------
    
    // Creates a selector string with this component's namepsace prefixed the each classname
    function nsSel () {
        var strBldr = [], prx = ns;
        $.each(arguments, function () { strBldr.push('.' + (this == '' ? prx : prx + '-' + this)); });
        return jQuery.trim(strBldr.join(' '));
    };
    
    // Creates string with this component's namepsace prefixed the each classname
    function nsClass () {
        var strBldr = [], prx = ns;
        $.each(arguments, function () { strBldr.push(this == '' ? prx : prx + '-' + this); });
        return jQuery.trim(strBldr.join(' '));
    };
    
	return Plugin.create('headerids', {
		_constructor: function(){
			this._super('headerids');
		},
		
		config: ['true'],
				
		/**
		 * Initialize the plugin
		 */
		init: function () {
			var that = this;

			// mark active Editable with a css class
			Aloha.bind("aloha-editable-activated", function(jEvent, params) {
				that.check(params.editable.obj);
			});
			Aloha.bind("aloha-editable-deactivated", function(jEvent, params) {
				that.check(params.editable.obj);
			});
			Aloha.bind('aloha-ready', function (ev) {
				that.initSidebar(Aloha.Sidebar.right);
			});
		},
		
		check: function(editable) {
			var that = this;
			var config = that.getEditableConfig(editable);

			if(jQuery.inArray('true',config) === -1) {
				// Return if the plugin should do nothing in this editable
				return false;
			}

			jQuery(editable).find('h1, h2, h3, h4, h5, h6').not('.aloha-customized').each(function(){ 
				that.processH(this); 
			});

		},
		
		processH: function(h) {
			var that = this;
			jQuery(h).attr('id',that.sanitize(jQuery(h).text()));
		},
				
		sanitize: function(str) {
			return (str.replace(/[^a-z0-9]+/gi,'_'));
		},
		
		//ns = headerids
		initSidebar: function(sidebar) {
			var pl = this;
			pl.sidebar = sidebar;
			sidebar.addPanel({
                    
                    id         : nsClass('sidebar-panel'),
                    title     : i18n.t('internal_hyperlink'),
                    content     : '',
                    expanded : true,
                    activeOn : 'h1, h2, h3, h4, h5, h6',
                    
                    onInit     : function () {
                        var that = this,
                            content = this.setContent('<label class="'+nsClass('label')+'" for="'+nsClass('input')+'">'+i18n.t('headerids.label.target')+'</label><input id="'+nsClass('input')+'" class="'+nsClass('input')+'" type="text" name="value"/> <button class="'+nsClass('reset-button')+'">'+i18n.t('headerids.button.reset')+'</button><button class="'+nsClass('set-button')+'">'+i18n.t('headerids.button.set')+'</button>').content;
                        
                        content.find(nsSel('set-button')).click(function () {
                            var content = that.content;
							jQuery(that.effective).attr('id',jQuery(nsSel('input')).val());
							jQuery(that.effective).addClass('aloha-customized');
                        });
						
						content.find(nsSel('reset-button')).click(function () {
                            var content = that.content;
                            pl.processH(that.effective);
							jQuery(that.effective).removeClass('aloha-customized');
							that.content.find(nsSel('input')).val(that.effective.attr('id'));
                        });
                    },
                    
                    onActivate: function (effective) {
						var that = this;
						that.effective = effective;
						that.content.find(nsSel('input')).val(effective.attr('id'));
                    }
                    
                });
			sidebar.show();
		}
	});
});
