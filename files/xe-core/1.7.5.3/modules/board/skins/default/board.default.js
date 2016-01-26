jQuery(function($) {
	// delete the border for the last row
	$('.board_list tr:last-child>td').css('border','0');
	// hide last tag
	$('.read_footer .tags span:last-child').hide();
	// display/hide serach box
	var bs = $('.board_search');
	bs.hide().addClass('off');
	$('.bsToggle').click(function() {
		if(bs.hasClass('off')) {
			bs.show().removeClass('off').find('.iText').focus();
		} else {
			bs.hide().addClass('off');
		}
	});
	// user input text blur/focus/change
	var iText = $('.item .iLabel').next('.iText');
	$('.item .iLabel').css('position','absolute');
	iText
		.focus(function() {
			$(this).prev('.iLabel').css('visibility','hidden');
		})
		.blur(function() {
			if(!$(this).val()) {
				$(this).prev('.iLabel').css('visibility','visible');
			} else {
				$(this).prev('.iLabel').css('visibility','hidden');
			}
		})
		.change(function() {
			if(!$(this).val()) {
				$(this).prev('.iLabel').css('visibility','visible');
			} else {
				$(this).prev('.iLabel').css('visibility','hidden');
			}
		})
		.blur();
	// add class to the parent category 
	$('.cTab>li>ul>li.on_').parents('li:first').addClass('on');
	// delete the margin-top for the first child of the ccomments
	$('.feedback .xe_content>*:first-child').css('margin-top','0');
});

// SNS post
(function($) {
	$.fn.snspost = function(opts) {
		var loc = '';
		opts = $.extend({}, {type:'twitter', event:'click', content:''}, opts);
		opts.content = encodeURIComponent(opts.content);
		switch(opts.type) {
			case 'facebook':
				loc = 'http://www.facebook.com/share.php?t='+opts.content+'&u='+encodeURIComponent(opts.url||location.href);
				break;
			case 'delicious':
				loc = 'http://www.delicious.com/save?v=5&noui&jump=close&url='+encodeURIComponent(opts.url||location.href)+'&title='+opts.content;
				break;
			case 'twitter':
				loc = 'http://twitter.com/home?status='+opts.content;
				break;
		}
		this.bind(opts.event, function() {
			window.open(loc);
			return false;
		});
	};
	$.snspost = function(selectors, action) {
		$.each(selectors, function(key,val) {
			$(val).snspost( $.extend({}, action, {type:key}) );
		});
	};
})(jQuery);
