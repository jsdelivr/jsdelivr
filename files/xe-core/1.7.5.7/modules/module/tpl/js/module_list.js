(function($){

xe.ModuleListManager = xe.createApp("ModuleListManager", {
	$keyObj: null,
	$moduleNameObj: null,
	$moduleSrlObj: null,
	$selectedObj: null,

	init: function(key){
		var self = this;
		var $keyObj = this.$keyObj = $('input[name='+key+']');
		this.$moduleNameObj = $keyObj.parent().find('.moduleList');
		this.$moduleSrlObj  = $keyObj.parent().find('.moduleIdList');
		this.$selectedObj   = $keyObj.parent().find('.modulelist_selected');

		this.$selectedObj
			.nextAll('button')
				.filter('.modulelist_del').bind('click', function(){ self.cast('MODULELIST_DEL'); return false; }).end()
				.filter('.modulelist_up').bind('click', function(){ self.cast('MODULELIST_UP'); return false; }).end()
				.filter('.modulelist_down').bind('click', function(){ self.cast('MODULELIST_DOWN'); return false; }).end()
			.end()
			.bind('show', function(){
				$(this).nextAll().show();
			});

		this.$selectedObj.nextAll('a').filter('.moduleTrigger').bind('moduleSelect', function(e, aSelected){
			var sType, sName, sSrl;
			
			for(var i=0, nLen=aSelected.length; i<nLen; i++){
				sType = aSelected[i].mid + ', ' + aSelected[i].type;
				sName = aSelected[i].browser_title;
				sSrl = aSelected[i].module_srl;
				self.cast("ADD_MODULE_TO_MODULELIST_MANAGER", [sType, sName, sSrl]);
			}
		}).end()

		this.cast('MODULELIST_SYNC');
	},

	addModule: function(sModuleType, sModuleInstanceName, sModuleSrl){
		$('<OPTION>').val(sModuleSrl).text(sModuleInstanceName + ' ('+sModuleType+')').appendTo(this.$selectedObj);

		this.removeDuplicated();
		this.refreshValue();
	},

	API_ADD_MODULE_TO_MODULELIST_MANAGER : function(sender, aParams){
		this.addModule(aParams[0], aParams[1], aParams[2]);
	},

	API_MODULELIST_ADD: function(){
		var sModuleType = this.$moduleNameObj.find('>option:selected').text();
		var sModuleInstanceName = this.$moduleSrlObj.find('>option:selected').text();
		var sModuleSrl = this.$moduleSrlObj.find('>option:selected').val();

		this.addModule(sModuleType, sModuleInstanceName, sModuleSrl);
	},

	API_MODULELIST_DEL: function(){
		this.$selectedObj.find('>option:selected').remove();
		this.refreshValue();
	},

	API_MODULELIST_UP: function(){
		var $selected = this.$selectedObj.find('>option:selected');
		$selected.eq(0).prev('option').before($selected);
		this.refreshValue();
	},

	API_MODULELIST_DOWN: function(){
		var $selected = this.$selectedObj.find('>option:selected');
		$selected.eq(-1).next('option').after($selected);
		this.refreshValue();
	},

	API_MODULELIST_SYNC: function(){
		var values = this.$keyObj.val();
		if (!values) return;

		var self = this;
		function on_complete(data){
			if (data.error) return;

			for(var i in data.module_list){
				var module = data.module_list[i];
				var obj = $(document.createElement('option'));
				obj.val(module.module_srl).html(module.browser_title + ' (' + module.mid + ', ' + module.module_name + ')').appendTo(self.$selectedObj);
			}
		}

		$.exec_json('module.getModuleAdminModuleList', {'module_srls': values}, on_complete);
	},

	removeDuplicated : function() {
		var selected = {};
		this.$selectedObj.find('>option').each(function(){
			if(selected[this.value]) $(this).remove();
			selected[this.value] = true;
		});
	},

	refreshValue : function() {
		var srls = [];

		this.$selectedObj.find('>option').each(function(){
			srls.push(this.value);
		});

		this.$keyObj.val(srls.join(','));
	}
});

})(jQuery);
