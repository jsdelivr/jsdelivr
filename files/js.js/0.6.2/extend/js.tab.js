Number.add.toClass = function(prefix, max){
	prefix = prefix || 'x';
	for(var i=2, c=max||10, className=[];i<=c;i++){
		if(this%i==0)
			className.push(prefix+i);
	}
	return className.join(' ');
};

js.add.tab = (function(undefined){
	/*
	 * display contents as tab style like slide or auto movable list.
	 * @version 0.7
	 * @todo 해시에 따른 인덱스 변경 적용
	 * @todo 탭안의 탭일 경우 해시 확장
	 */
	js.css(js.dir+'js.tab.css', 'utf-8');
	js.ready(bridge, '*[tab-target]');
	
	var _index = 0
	var _theme = /\s?(tab[^\s]+)/;
	
	bridge.method = {};
	
	return bridge;
	
	function bridge(option){
		option = Object.merge(option || {}, {
			'tab-target': '.tab'
		  , 'tab-button': null
		  , 'tab-timer': null
		  , 'tab-index': null
		  , 'tab-event': 'click'
		  , 'tab-image': null
		  , 'tab-method': 'slide'
		  , 'tab-order': null
		});
		
		return this.set(set, [option]);
	};
	
	function set(node, option){
		option = js.merge(node, option);
		
		var contents = js.query(option['tab-target'], node);
		if(!contents || !contents.length)
			return;
		_index++;
		
		if(option['tab-image']){
			option['tab-image'] = option['tab-image'].split(' to ');
			option['tab-image'][1] = js(option['tab-image'][1]);
		}
		if(option['tab-order']){
			option['tab-method'] = 'order';
			option['tab-order'] = Number(option['tab-order']);
		}else if(option['tab-method']=='order'){
			option['tab-order'] = 1;
		}
		
		option['tab-method'] = bridge.method[option['tab-method']];
		
		//this.css('overflow-y', 'visible');
		
		var id = node.id || 'tab'+_index
		  , length = contents.length
		  , index = option['tab-index'] ?
			  	Number(option['tab-index']) -1 :
			  	Math.rand(length-1)
		  , event = option['tab-event'] == 'over' ?
		  		'tap' :
		  		option['tab-event']
		  , theme = node.className.match(_theme)
		  	;

		theme = theme ?
			theme[1] :
			'tab';
			
		var sizePrefix = theme+'Size'
		  , buttonPrefix = theme+'Buttons';
		
		node.className+= ' '+sizePrefix+length;
		
		contents.className = id;
		id+= '-';
		
		if(index<0)
			index = 0;
		else if(index>=length)
			index = length-1; 
		
		var buttons = this.add('<ul.tabs.'+buttonPrefix+'>');
		buttons[0]._jsTab_ = {
			parent: node
		};

		buttons.add('<li.dynamic.prev><a href="#'+id+'prev">prev</a></li>')
			.js('a')
			.click(showPrev)
			;
		
		var next = js('<li.dynamic.next><a href="#'+id+'next">next</a></li>')
		  , nextA = next.js('a')
		  		.click(showNext)
		  ;
		 
		node._jsTab_ = {
			self: this
		  , contents: contents
		  , prevIndex : index-1 
		  , index: index
		  , last: length-1
		  , nextA: nextA[0]
		  , timer: true
		  , option: option
		};


		option['tab-method'].init(node._jsTab_);
		option['tab-timer'] &&
			setTimer(this, option['tab-timer']);
		
		var content;
		var link = [];
		var title;
		var buttonClass;
		
		for(var i=0, c=contents.length; i<c; i++){
			
			page = i+1;
			content = contents[i];

			option['tab-method'].set(content, i);
			
			if(option['tab-button']){
				
				title = option['tab-button']=='self' ?
					js(content) :
					js(option['tab-button'], content);
				value = title ?
					title[0].tagName == 'IMG' ?
						'<img src="'+title[0].getAttribute('src')+'">' :
						title[0].innerHTML :
					id+page;
			}else{
				value = id+page;
			}
			buttonClass = 'page page'+page+' '+(page.toClass());
			button = buttons.add('<li class="'+buttonClass+'"><a href="#'+id+i+'">'+value+'</a></li>')
				.js('a')
				.on(event, show)
				;
			button[0]._jsTab_ = {
				parent: node
			  , index: i
			};
			content._jsTab_ = {
				button: button
			};
		}
		
		buttons.append(next);
				
		show.call({_jsTab_:{
			index: index
		  , parent: node
		}});
		
		setTimeout(function(){
			node.className+= ' tabApplied';
		});
	}
	
	function show(event){
		var _ = this._jsTab_
		  , parent = _.parent._jsTab_
		  , option = parent.option
			;
		
		var prev = parent.contents[parent.index];
		var next = parent.contents[_.index];
		
		_.parent._jsTab_.back = _.back; 
		_.parent._jsTab_.index = _.index;
		
		option['tab-method'].show(parent, prev, next);
		prev._jsTab_.button.parentJs().stylex('here');
		next._jsTab_.button.parentJs().style('here');
		
		if(option['tab-image']){
			var target = js(option['tab-image'][0], next).hide();
			option['tab-image'][1]
				.css('background-image', 'url('+target.attr('src')+')');
		}
			
		return false;
	}	
	
	function showPrev(){
		var parent = this.parentNode.parentNode._jsTab_.parent
		  , parent__ = parent._jsTab_
		  , index = Number(parent__.index) - 1
			;
		
		show.call({_jsTab_:{
			index: index < 0 ?
				parent__.last :
				index 
		  , parent: parent
		  , back: true
		}});		
	}
	
	function showNext(){
		var parent = this.parentNode.parentNode._jsTab_.parent
		  , parent__ = parent._jsTab_
		  , index = Number(parent__.index) + 1
			;
		
		show.call({_jsTab_:{
			index: parent__.last < index ?
				0 :
				index 
		  , parent: parent
		}});
	}

	function setTimer($target, delay){
		$target
			.over(wrapOver)
			.out(wrapOut)
			;
			
		var parent = $target[0]; 
		var a = parent._jsTab_.nextA;
		setInterval(function(){
			if(parent._jsTab_.timer)
				showNext.call(a);
		}, delay*1000);
	}
	
	function wrapOver(){
		this._jsTab_.timer = false;
	}
	
	function wrapOut(){
		this._jsTab_.timer = true;
	}
		
})();

js.add.tab.method.slide = {
	init: function(){
		
	}
  , set: function(content, i){
  		content.style.display = 'none';
	}
	
  , show: function(wrap, prev, next){
		prev.style.display = 'none';
		next.style.display = 'block';
  	}
};

js.add.tab.method.order = {
	init: function(wrap){
		var order = wrap.option['tab-order']+3
		  , contents = wrap.contents
		  , length = contents.length
		  , i
		  , clone
		  , self = wrap.self
		 	;
		while(order > contents.length){
			for(i=0; i<length; i++){
				clone = contents[i].cloneNode(true);
				contents.push(clone);
				self.append(clone);
			}
		}
		wrap.ordered = wrap.contents.slice(0);
		wrap.ordered = wrap.ordered.concat(wrap.ordered.splice(0, wrap.index));
	}
  , set: function(content){
  		//content.style.float = 'none';
	}
	
  , show: function(wrap, prev, next){
  		if(wrap.back){
  			wrap.ordered.unshift(wrap.ordered.pop());
  		}else{
  			wrap.ordered.push(wrap.ordered.shift());
  		}
  		
  		var contents = wrap.ordered
  		  , order = wrap.option['tab-order']-1
  		  , content
  		  , className
  		  , i = contents.length
  		  , before = i-1
  		  , after = order+1
  		  ;

  		while(i-->0){
  			content = contents[i];
  			content.className = (' '+content.className).replace(/ order(\d+|[A-Z][a-z]+)/, '').trim();
  			content.className+= ' order'+(
  				i == after ?
  					'After' :
  					i == before ?
  						'Before' :
  						i > order ?
  							'Off' :
  							i+1
  			);
  		}
  }
};
js.add.tab.method.classic = !(js.user.ie && js.user.ie<9) ?
	js.add.tab.method.slide : {
	init: function(wrap){
	}
	
  , set: function(content, i){
  		if(i) content.style.display = 'none';
	}
	
  , show: function(wrap, prev, next){
		var target = wrap.contents[0];
		target.alt = next.alt ?
			next.alt : '';
		target.style.filter = 'blendTrans(duration=1)';
		target.filters.blendTrans.Apply();
		target.src = next.src;
		target.filters.blendTrans.Play();
  	}
};