jQuery(function($){
	var $foggyLayer = $("<div>");
	$foggyLayer.css({
		position: 'absolute',
		top:0,
		left:0,
		backgroundColor:'#000',
		opacity: 0,
		display:'none',
		zIndex:100,
		width: $(document).width(),
		height: $(document).height()
	});
	$($.find("body")).append($foggyLayer);
	
	$(window).resize(function(){
		$foggyLayer.css({
			width: 0,
			height: 0
		});
	
		setTimeout(function(){
			$foggyLayer.css({
				width: $(document).width(),
				height: $(document).height()
			});
		}, 0);
	});
	
	$foggyLayer.show();
});
