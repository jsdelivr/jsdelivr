var axdomConverter = function(_selector){
	var dom = this.dom = bs.Dom(_selector);
	this.css = function(css){
		//_this.S( 'cssObject', css );  아직 구현 안되었음.
		for ( k in css ) {
			dom.S(k, css[k]);
		}
	};
	this.bind = function(eventName, callBack){
		dom.S(eventName, callBack);
	};
	return this;
};

axdomConverter.fn = axdomConverter.prototype = {
	
};