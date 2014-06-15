(function($){

xe.MidManager = xe.createApp("MidManager", {
	$keyObj: null,

	init: function(key){
		var self = this;
		var $keyObj = this.$keyObj = $('input[name='+key+']');

		$keyObj.parent().find('button.delete,a.delete').bind('click', function(){
			$keyObj.val('').next().val('');
			return false;
		});

		jQuery(function($){
			$keyObj.siblings('.moduleTrigger').bind('moduleSelect', function(e, aSelected){
				self.cast('MID_SYNC_NEW', aSelected);
			});
		});

		self.cast('MID_SYNC');

	},

	API_MID_SYNC: function(){
		var self = this;
		var $finder = self.$keyObj.closest('.modulefinder');

		var module_srl = this.$keyObj.val();
		if (!module_srl) return;

		function on_complete(data){
			if (data.error){
				alert(data.message);
				return;
			}

			self.$keyObj.val(data.module_list[0].module_srl);
			self.$keyObj.next().val(data.module_list[0].browser_title+' ('+data.module_list[0].mid+', '+data.module_list[0].module_name+')');
		}

		$.exec_json('module.getModuleAdminModuleList', {'module_srls': module_srl}, on_complete);
	},

	API_MID_SYNC_NEW: function(htBase, aParam){
		var self = this;

		htSelected = aParam[0];

		var module_srl = htSelected.module_srl;
		if (!module_srl) return;

		self.$keyObj.val(htSelected.module_srl);
		self.$keyObj.next().val(htSelected.browser_title+' ('+htSelected.mid+', '+htSelected.type+')');
	}
});

})(jQuery);
