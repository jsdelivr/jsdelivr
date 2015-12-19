(function($){
window.xeNotifyMessage = function(text, count){
	var $bar;
	$bar = $('div.message.info');
	if(!$bar.length) {
		$bar = $('<div class="message info" />')
			.hide()
			.css({
				'position'   : 'absolute',
				'z-index' : '100',
			})
			.prependTo(document.body);
	}
	text = text.replace('%d', count);
	var cur_module = current_url.getQuery('module');
	if( cur_module == "admin" )
		h = $bar.html('<p><a href="'+current_url.setQuery('module','').setQuery('act','dispCommunicationMessages')+'" target="_blank">'+text+'</a></p>').height();
	else
		h = $bar.html('<p><a href="'+current_url.setQuery('module','').setQuery('act','dispCommunicationMessages')+'">'+text+'</a></p>').height();
	$bar.show().animate({top:0});
	// hide after 10 seconds
	setTimeout(function(){
		$bar.slideUp();
	}, 5000);
};
})(jQuery);
