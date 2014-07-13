jQuery(function($){
	$('input[name=enable_join]').click(function(){
		var checked = $('input[name=enable_join]:checked').val();
		enableSignUpTab(checked == 'Y');
	});

	$('.__sync').click(function (){
		exec_xml(
			'importer', // module
			'procImporterAdminSync', // act
			null,
			function(ret){if(ret && (!ret.error || ret.error == '0'))alert(ret.message);}, // callback
			resp = ['error','message'] // response tags
		);
	});
});
