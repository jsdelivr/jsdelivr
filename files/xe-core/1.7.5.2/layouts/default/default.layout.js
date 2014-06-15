jQuery(function($){
// GNB
	var $gnb = $('.gnb');
	var $gnb_li = $gnb.find('>ul>li');
	var $gnb_a = $gnb.find('>ul>li>a');
	var $gnb_sub = $gnb.find('ul ul');
	// IE 7 debug
	if($.browser.msie && $.browser.version == "7.0"){
		$gnb_a.each(function(){
			$(this).width($(this).width());
		});
	}
	if($gnb_sub.length){
		$gnb.mouseover(function(){
			$gnb.addClass('open');
		});
		$gnb.mouseleave(function(){
			$gnb.removeClass('open');
			$gnb_li.removeClass('hover');
		});
	}
	$gnb_a.mouseover(function(){
		$(this).parent('li').addClass('hover').siblings('li').removeClass('hover');
	});
	$gnb_a.focus(function(){
		$(this).trigger('mouseover');
	});
	$gnb.find('a').focusout(function(){
		setTimeout(function(){
			if($gnb.find('a:focus').length == 0){
				$gnb.trigger('mouseout');
			}
		}, 100);
	});

// Visual Slide
	var $visual = $('.visual');
	var $visual_list = $visual.find('>.list');
	var itemNum = $visual_list.find('>.item').length;
	$visual_list.addClass('total'+itemNum);
	var $last_item = $visual_list.find('>.item:last-child');
	// Paragraph position
	$visual.find('p').each(function(){
		var $this = $(this);
		$this.css('marginTop', Math.round(- $this.height()/2));
	});
	// Invalid href
	$visual.find('a[href=""]').click(function(){return false});
	// Item num
	if(itemNum===1){
		$visual.find('>button').remove();
	} else if(itemNum===2){
		$last_item.clone().prependTo($visual_list);
	} else if(itemNum===3) {
		$last_item.prependTo($visual_list);
	}
	// Prev
	var $vpn = $('.visual, .visual>button');
	$(window).load(function(){
		$vpn.height($visual_list.find('>.item:eq(1)').height());
	});
	$visual.find('>.prev').click(function(){
		$visual_list.animate({
			left: '+=100%'
		},400,function(){
			var $last_item = $visual_list.find('>.item:last-child');
			if(itemNum===3){
				$last_item.prependTo($visual_list);
			} else if(itemNum===2) {
				$last_item.remove();
				$visual_list.find('>.item:last-child').clone().prependTo($visual_list);
			}
			$visual_list.css('left','-100%');
			$vpn.height($visual_list.find('>.item:eq(1)').height());
		});
	});
	// Next
	$visual.find('>.next').click(function(){
		$visual_list.animate({
			left: '-=100%'
		}, 400, function(){
			var $first_item = $visual_list.find('>.item:first-child');
			if(itemNum===3){
				$first_item.appendTo($visual_list);
			} else if(itemNum===2) {
				$first_item.remove();
				$visual_list.find('>.item:first-child').clone().appendTo($visual_list);
			}
			$visual_list.css('left','-100%');
			$vpn.height($visual_list.find('>.item:eq(1)').height());
		});
	});
});