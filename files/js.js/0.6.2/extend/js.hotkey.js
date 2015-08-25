/*
 * hotkey
 */
js.add.hotkey = (function(){
	var _glue =  /\s*\+\s*/
	  , _multi = /\s*,\s*/
	  , _input = /INPUT|TEXTAREA/
	  ;
	  
	return function(keys, callback){
		/*
		var rule = keys
				.trim()
				.toLowerCase()
				.split(_multi)
				;
		for(var rule = keys
			.trim()
			.toLowerCase()
			.split(_multi)
		  , i = rule.length;
		)
		
		*/
		return this.set(set, [
				keys
			  , keys
				.trim()
				.toLowerCase()
				.split(_glue)
			  , callback
			]);
	};
	
	function set(index, keys, callback){
		if(!this._jsHotkey_){
			this._jsHotkey_ = {
				set: []
			  , queue: null
			  , callback : {}
			};
			
			js(this)
				.down(down)
				.up(up)
				;
		}
		this._jsHotkey_.set.push([index, keys]);
		this._jsHotkey_.callback[index] = callback;
	}
	
	function down(event){
		event.keys();
		var store = this._jsHotkey_
		  , queue = store.queue || (store.set.slice(0))
		  , pass = []
		  , i = queue.length
		  , hotkey
		  , keys
		  , key
		  , j
		  ;
		match:
		while(i--){
			hotkey = queue[i];
			index = hotkey[0];
			keys = hotkey[1].slice(0);
			j = keys.length;
			while(j--){
				if(event[keys[j]]){
					keys.splice(j, 1);
					if(keys.length){
						pass.push([index, keys]);
						continue match;	
					}else{
						store.callback[index].call(this, event);
						up.call(this);
						return event.stop();
					}
				}
			}
		}
		this._jsHotkey_.queue = pass.length ?
			pass :
			null;
	}
	
	function up(){
		this._jsHotkey_.queue = null;
	}
})();