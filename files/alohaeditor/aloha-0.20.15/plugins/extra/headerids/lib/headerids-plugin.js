/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define([
	'aloha/jquery',
	'aloha/plugin',
	'aloha/floatingmenu',
	'i18n!headerids/nls/i18n',
	'i18n!aloha/nls/i18n',
	'css!headerids/css/headerids.css'
],
function(jQuery, Plugin, FloatingMenu, i18n, i18nCore) {
	

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
        return strBldr.join(' ').trim();
    };
    
    // Creates string with this component's namepsace prefixed the each classname
    function nsClass () {
        var strBldr = [], prx = ns;
        $.each(arguments, function () { strBldr.push(this == '' ? prx : prx + '-' + this); });
        return strBldr.join(' ').trim();
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
