/*
* BaselineJS.js 1.0
*
* Copyright 2012, Ben Howdle http://twostepmedia.co.uk
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu June 21 20:58 2012 GMT
*/

/*
	//call like so
	baseline.init('img', '24');
	baseline.init('.post img', '48');
	baseline.init('#content img', {480: 30, 640: 35}); // an object of breakpoints, ie. 480px or above, baseline is 30px.
*/

var baseline = function(){

	var tall, newHeight, target, imgl, cur, images = [];

	return {

		init: function(selector, target){
			if(selector === undefined || target === undefined) return false;
			this.images = document.querySelectorAll(selector);
			this.setbase(this.images);
			this.tellmetarget(target);
			var me = this;
			window.onresize = function() {
				me.tellmetarget(target);
				me.setbase(me.images);
			};
		},

		tellmetarget: function(target){
			if(typeof target === 'number'){
				this.target = target;
			} else if(typeof target === 'object'){
				for(x in target){
					if(document.width > x){
						this.target = target[x];
					}
				}
			}
		},

		setbase: function(imgs){
			this.imgl = imgs.length;
			if(this.imgl){
				while(this.imgl--){
					this.cur = imgs[this.imgl];
					this.cur.style.maxHeight = 'none';
					this.tall = this.cur.offsetHeight;
					this.newHeight = Math.floor(this.tall / this.target) * this.target;
					this.cur.style.maxHeight = this.newHeight + 'px';
				}
			}
		}

	};

}();