YUI.add('gallery-patch-330-toggleview', function(Y) {

function _wrapCallBack(anim, fn, callback) {
    return function() {
        if (fn) {
            fn.call(anim);
        }
        if (callback) {
            callback.apply(anim._node, arguments);
        }
    };
}

Y.Node.prototype.toggleView = function (name, on) {
    var callback;
    this._toggles = this._toggles || [];                
    if (typeof name == 'boolean') { // no transition, just toggle
        on = name;  
    }           
    if (typeof on === 'undefined' && name in this._toggles) {
        on = ! this._toggles[name];
    }

    on = (on) ? 1 : 0;

    if (on) {
        this._show();
    }  else {
        callback = _wrapCallBack(this, this._hide);
    }
    
    this._toggles[name] = on;
    this.transition(Y.Transition.toggles[name][on], callback);
};


}, 'gallery-2011.01.26-20-33' ,{requires:['transition-native']});
