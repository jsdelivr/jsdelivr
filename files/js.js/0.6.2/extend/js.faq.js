js.add.faq = (function(){
	return function(option){
		option = Object.merge(option || {}, {
			'faq-target': 'dl'
		  , 'faq-title': 'dt'
		  , 'faq-content': 'dd'
		});
		
		return this.set(set, [option]);
	}
	
	function set(option){
		var items = js.query(option['faq-target'], this)
		  , i = items.length
		  , item
		  , title
		  , content
			;
		while(i--){
			item = items[i];
			title = js(js.query(option['faq-title'], item)[0]);
			content = js(js.query(option['faq-content'], item)[0]);
			
			title.click(click);
			content.hide();
			
			title[0]._jsFAQ_ = {
				content: content
			}
		}
	}
	
	function click(){
		this._jsFAQ_.content.toggle();
	}
})();
