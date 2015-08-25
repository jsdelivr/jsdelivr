/*
 * relocate by absolute position from floated elements for except spaces
 * @version 0.5
 */
js.add.relocate = (function(){
	var _parents = [];
	
	js.win().resize(reset);
	
	return function(option){
		option = Object.merge(option || {}, {
			'relocate-trim': true
		});
		return this.set(set, [option]);	
	};
	
	function set(node, option){
		(_parents.indexOf(this)>-1 &&
			this.js('.relocated').clear()) ||
				_parents.push(this);
				
		var offset = this.offset()
		  , child = this.child()
			;
			
		node._jsRelocate_ = {
			option: option
		  , width: this.width()
		  , top: offset.top
		  , left: offset.left
		  , child: child
		  , widths:[0]
		  , heights: []
		  , col : [0]
		  , cols: []
		};
		
		node.style.position = 'relative';
		child.set(ready);
		child.set(position);
		trim(this, node);
	}
	
	function reset(){
		for(var i = _parents.length, parent, width, __; i--;){
			parent = _parents[i];
			__ = parent[0]._jsRelocate_;
			width = parent.width();
			if(__.width != width){
				__.widths[0] = 0;
				__.col[0] = 0;
				parent[0]._jsRelocate_.width = width;
				parent[0]._jsRelocate_.heights = [];
				__.child.set(position);
				trim(parent, parent[0]);
			}
		}
	}
	
	function ready(node){
		var __ = node.parentNode._jsRelocate_
		  , offset = this.offset(true)
			;
		node.style.top = offset.top-__.top+'px';
		node.style.left = offset.left-__.left+'px';
		node._jsRelocate_ = {
			width: []
		  , height:[this.fullHeight()]
		  , left:[]
		  , right:[]
		};
	}
	
	function position(node){
		node.style.float = 'none';
		node.style.position = 'absolute';
		var	_ = node._jsRelocate_
		  , parent = node.parentNode
		  , __ = parent._jsRelocate_
		  , width = __.width
		  , widths = __.widths
		  , heights = __.heights
		  , col = __.col
			;
		
		if(!heights[col[0]])
			heights[col[0]] = 0;
		
		_.width[0] = this.fullWidth();
		
		if(widths[0]+_.width[0]>width){
			widths[0] = 0;
			col[0] = 0;
		}
			
		if(!__.cols[col[0]])
			__.cols[col[0]] = [];
			
		__.cols[col[0]].push(this);				

		each(this, heights[col[0]], widths[0]);
		widths[0]+= _.width[0];
		heights[col[0]]+= _.height[0];

		if(widths[0]>=width){
			widths[0] = 0;
			col[0] = 0;
		}else{
			col[0]++;
		}
	}
	
	function trim(dot, node){
		var _ = node._jsRelocate_
		  , v = _.heights.slice(0)
		  , cols = _.cols.length-1
		  , min
		  , max
		  , t
		  , mCol
		  , mLeft
		  , height
		  ;
		if(_.option['relocate-trim']){
			do {
				min = v.min(true);
				max = v.max(true);
				t = _.cols[max].pop();
				mCol = _.cols[min];
				mLeft = min ?
					_.cols[min-1].last()[0]._jsRelocate_.right[0] :
					0;
				
				height = t[0]._jsRelocate_.height[0];
				if(v[max] <= v[min]+height)
					break;
				_.cols[min].push(t);
				each(t, v[min], mLeft);
				v[max]-= height;
				v[min]+= height;
			}while(true);
			_.heights = v;
		}
		max = _.heights.max();
		dot
			.css('height', max)
			.add('<div.relocated style="width:100%;height:'+max+'px"/>')
			;
	}
	
	function each(target, top, left){
		var _ = target[0]._jsRelocate_;
				
		_.left[0] = left;
		_.right[0] = left + _.width[0];
		
		target.css('top', top, 'left', left);
	}
})();