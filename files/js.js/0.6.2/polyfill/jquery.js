var ie = js.user.ie
  , ff = js.user.ff
  ;
if((ie && ie < 9) || (ff && ff < 1.5)){
	// jquery's filter of polyfill make error of js.query for old browser.
	Array.prototype.filter = function(method, that){
		that = that || this;
		for (var i = 0, c = this.length, value, result = []; i < c; i++){
			value = this[i];		
			if(method.call(that, value, i, this))
				result.push(value);
		}
		return result;
	};
}