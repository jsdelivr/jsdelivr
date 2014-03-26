YUI.add('gallery-user-patch-2532141', function(Y) {


// The constrain attribute should check if the value isn't "view"'
// before passing it to Y.one
Y.Plugin.ResizeConstrained.ATTRS.constrain = {
	setter: function (value) {
		if (value && (value instanceof Y.Node || value.nodeType || (Y.Lang.isString(value) && value !== 'view'))) {
			value = Y.one(value);
		}
		return value;
	}
};


}, 'gallery-2012.04.18-20-14' ,{requires:['resize']});
