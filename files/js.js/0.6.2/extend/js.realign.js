js.add.realign = (function(){
	var _images = [];
	
	js(window).resize(reset);
	
	return function(){
		return this.set(set);
	}
	
	function set(node){
		this
			.css('max-width', 'inherit')
			.css('max-height', 'inherit')
			;

		var image = new Image;
		image.target = node;
		image.onload = align;
		image.src = node.src;
		_images.push(image);
	}
	
	function reset(){
		for(var i = _images.length; i--;)
			align.call(_images[i]);
	}
	
	function align(){
		var node = this.target
		  , parent = js(node.parentNode)
		  , p = {
		  		width : parent.css('width').toInt()
		  	  , height : parent.css('height').toInt()
			}
			;
		// resize
		resize(node, 'width', p);
		
		var width = node.scrollWidth
		  , height = node.scrollHeight
			;
		
		if(p.height > height){
			resize(node, 'height', p);
			width = node.scrollWidth;
			height = node.scrollHeight;
		}
		
		node.style.marginTop = ((p.height-height)/2)+'px';
		node.style.marginLeft = ((p.width-width)/2)+'px'
	}
	
	function resize(node, type, p){
		var invert = {
			'width': 'height'
		  , 'height' : 'width'
		}[type];
		
		node.style[type] = p[type]+'px';
		node.style[invert] = 'auto'; 
	}
})();