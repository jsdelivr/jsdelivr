js.add.nav = (function(mobile){
	/*
	 * create navigation with depth of sub
	 * @version beta
	 */
	var _parents = []
	  , _outTimer
	  , _outDelay = 300
	;
	
	js.ready(bridge, 'ul.nav');
	js.root().over(out);
	
	return bridge;
	
	function bridge(){
		return this.set(set);
	};
	
	function set(parent, depth){
		depth = depth || 0;
		var className = 
		parent._jsNav_ = {};
		parent.className+= ' nav'+depth;
		_parents.push(parent);
		var items = this.child()
		  , item
		  , child
		  , link
		  , sub
		  , i = items.length
			;
		while(i--){
			item = js(items[i]);
			item[0].className+= ' navList'+depth;
			item.over(stop);
			child = item.child();
			link = child.filter('a');
			sub = child.filter('ul');
			if(link){
				link[0]._jsNav_ = {
					parent: parent
				  , item: item
				};
				link[0].className+= ' navLink'+depth;
				if(mobile && sub){
					link.click(click);
				}else{
					link.over(over);
				}
				if(sub){
					link[0].className+= ' navLinkWithSub';
					link[0]._jsNav_.sub = sub;
					sub[0].className+= ' navSub';
					set.call(sub, sub[0], depth+1);
				}									
			}
		}
	}
	
	function over(event){
		hideCancel();

		var store = this._jsNav_
		  , parent = store.parent
		  , item = store.item
		  , sub = store.sub
		  , prev = parent._jsNav_.prev
		  ;

		if(prev){
			hide(prev);
		}
		
		if(sub){
			show(this);
		}	
		return event.stop();
	}
	
	function click(event){
		if(this.clicked){
			hide(this);
			return true;				
		}else{
			over.call(this, event);
		}
		return false;
	}
	
	function show(a){
		a.clicked = true;
		var store = a._jsNav_;
		store.parent._jsNav_.prev = a;
		store.item.style('navListOpen');
		a.className+= ' navLinkOpen';
		if(store.sub){
			a.className += ' navLinkWithSubOpen';
			store.sub.style('navSubOpen');
		}
	}
	
	function hide(a){
		a.clicked = false;
		var store = a._jsNav_;
		a = js('a');
		store.item.stylex('navListOpen');
		a.stylex('navLinkOpen');
		if(store.sub){
			js(a).stylex('navLinkWithSubOpen');
			store.sub.stylex('navSubOpen');
		}
		
	}
	
	function stop(event){
		hideCancel();
		return event.stop();
	}
	
	function out(event){
		hideCancel();
		_outTimer = setTimeout(hideAll, _outDelay);
	}
	
	function hideCancel(){
		if(_outTimer){
			clearTimeout(_outTimer);
		}
	}
		
	function hideAll(){
		var i = _parents.length
		  , parent
		  , prev
		  ;
		while(i--){
			parent = _parents[i];
			prev = parent._jsNav_.prev;
			prev &&
				hide(prev);
		}			
	}
	
})(js.user.mobile);