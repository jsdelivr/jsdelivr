(function($,v){
v=xe.getApp('validator')[0];if(!v)return;

v.cast('ADD_FILTER',['condition', {'greeting1':{required:true},'greeting2':{'if':[{test:'$greeting1 == \'Hello\'', attr:'required', value:'true'}]}}]);
v.cast('ADD_MESSAGE',['isnull','isnull']);
v.cast('ADD_MESSAGE',['outofrange','outofrange']);
v.cast('ADD_MESSAGE',['equalto','equalto']);
})(jQuery);