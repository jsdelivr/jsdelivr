var ConfirmCheck = xe.createPlugin('confirm_check', {
	API_BEFORE_VALIDATE: function(sender, params){
		if(params[0].className == 'layout_delete_form'){
			return confirm(xe.lang.confirm_delete);
		}
	}
});

var Validator = xe.getApp('Validator')[0];
Validator.registerPlugin(new ConfirmCheck());
