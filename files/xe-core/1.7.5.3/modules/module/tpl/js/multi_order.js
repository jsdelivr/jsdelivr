(function($){

xe.MultiOrderManager = xe.createApp("MultiOrderManager", {
	$keyObj: null,
	$showObj: null,
	$selectedObj: null,

	init: function(key){
		var self = this;
		var $keyObj = this.$keyObj = jQuery('input[name='+key+']');
		this.$showObj 		= $keyObj.parent().find('.multiorder_show');
		this.$selectedObj 	= $keyObj.parent().find('.multiorder_selected');

		this.$keyObj.parent()
			.find('button')
				.filter('.multiorder_add').bind('click', function(){ self.cast('MULTIORDER_ADD'); return false; }).end()
				.filter('.multiorder_del').bind('click', function(){ self.cast('MULTIORDER_DEL'); return false; }).end()
				.filter('.multiorder_up').bind('click', function(){ self.cast('MULTIORDER_UP'); return false; }).end()
				.filter('.multiorder_down').bind('click', function(){ self.cast('MULTIORDER_DOWN'); return false; }).end()

		this.cast('MULTIORDER_SYNC');
	},

	API_MULTIORDER_ADD: function(){
		this.$showObj
			.find('>option:selected')
			.appendTo(this.$selectedObj);

		this.refreshValue();
	},

	API_MULTIORDER_DEL: function(){
		this.$selectedObj
			.find('>option:selected[default!="true"]')
			.appendTo(this.$showObj);

		this.refreshValue();
	},

	API_MULTIORDER_UP: function(){
		var $selected = this.$selectedObj.find('>option:selected');
		$selected.eq(0).prev('option').before($selected);
		this.refreshValue();
	},

	API_MULTIORDER_DOWN: function(){
		var $selected = this.$selectedObj.find('>option:selected');
		$selected.eq(-1).next('option').after($selected);
		this.refreshValue();
	},

	API_MULTIORDER_SYNC: function(){
		var values = this.$keyObj.val().split(',');
		this.$selectedObj.find('>option').appendTo(this.$showObj);

		var targets = [];
		for(var i in values){
			var target = this.$showObj.find('>option[value='+values[i]+']').get(0);
			if (target != undefined) targets.push(target);
		}
		$(targets).appendTo(this.$selectedObj);
	},

	refreshValue : function() {
		var values = [];

		this.$selectedObj.find('>option').each(function(){
			values.push(this.value);
		});

		this.$keyObj.val(values.join(','));
	}
});

})(jQuery);
