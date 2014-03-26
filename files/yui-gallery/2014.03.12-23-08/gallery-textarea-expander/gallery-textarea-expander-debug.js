YUI.add('gallery-textarea-expander', function(Y) {

var TextareaExpander = function(cfg) {
    TextareaExpander.superclass.constructor.apply(this, arguments);
};

TextareaExpander.NAME = "textareaExpander";
TextareaExpander.NS = "textarea-expander";

Y.extend(TextareaExpander, Y.Plugin.Base, {

    initializer : function(cfg) {
		var txt = cfg.host,
		span,
		maxHeight=parseInt(txt.getStyle('maxHeight'),10),
		overflow=false;
		
		txt.wrap('<div class="textarea-expander"></div>');
		txt.ancestor().prepend("<pre><span></span><br/></pre>");
		span = txt.ancestor().one('span');

		txt.setStyle('height','100%');
		
		if(Y.UA.opera && Y.UA.os === 'macintosh'){
			span.append('<br/>');
		}
		
		this.handle = txt.on(['keyup','scroll'],function(e){
			//We need to prevent the situation that a max-height is set and text starts overflowing.
			//If maxHeight is set, it will be a number
			if(!isNaN(maxHeight)){
				if(!overflow && txt.get('scrollHeight') > maxHeight){
					//Overflow is blocked and we are overflowing. We need to stop textexpansion
					overflow = true;
					txt.setStyle('overflowY','auto');
					//span.setStyle('height',txt.get('height'));
				}else if(overflow && txt.get('scrollHeight') < maxHeight){
					//Overflow is not blocked and we have removed enough text to remove the scrollbar again. We need to restart text expansion
					overflow = false;
					txt.setStyle('overflowY','none');
					//span.setStyle('height','auto');
				}
			}
			
			if(!overflow){
				span.set('text',txt.get('value'));
			}
		});
		
		span.set('text',txt.get('value'));
		
		txt.ancestor().addClass('active');
    },
	destructor:function(){
		this.handle.detach();
	}
});
Y.TextareaExpander = TextareaExpander;


}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['plugin','node-style']});
