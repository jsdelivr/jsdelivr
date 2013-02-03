jQuery(function($) {

	$(thePostClasses).one('mouseenter', function(){
		Socialite.load($(this)[0]);
	});
		
}); //the end