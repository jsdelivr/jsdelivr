jQuery(function($){
// TARGET toggle
	$(document.body).on('click', '.x [data-toggle]', function(){
		var $this = $(this);
		if($this.is('a') && $this.attr('href') != $this.attr('data-toggle')){
			var target = $this.attr('href');
			$this.attr('data-toggle', target);
		}
		var $target = $($this.attr('data-toggle'));
		var focusable = 'a,input,button,textarea,select';
		$target.toggle();
		if($target.is(':visible') && !$target.find(focusable).length){
			$target.not(':disabled').attr('tabindex','0').focus();
		} else if($target.is(':visible') && $target.find(focusable).length) {
			$target.not(':disabled').find(focusable).eq(0).focus();
		} else {
			$this.focus();
		}
		return false;
	});
// SUBMIT disabled 
	$('input[required]').change(function(){
		var invalid = $('input[required]').is('[value=""], [value=" "], [value="  "], [value="   "]');
		var $submit = $('[type="submit"]');
		if(!invalid){
			$submit.removeClass('x_disabled');
		} else {
			$submit.addClass('x_disabled');
		}
	});
});
