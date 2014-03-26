YUI.add('gallery-patch-350-widget-modality', function(Y) {

/*!
IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax)
http://yura.thinkweb2.com/cft/
*/
var supportsPosFixed = (function(){
    var doc         = Y.config.doc,
        isSupported = null,
        el, root;

    if (doc.createElement) {
        el = doc.createElement('div');
        if (el && el.style) {
            el.style.position = 'fixed';
            el.style.top = '10px';
            root = doc.body;
            if (root && root.appendChild && root.removeChild) {
                root.appendChild(el);
                isSupported = (el.offsetTop === 10);
                root.removeChild(el);
            }
        }
    }

    return isSupported;
}());

Y.WidgetModality.prototype._bindUIModal = function () {
    this.after('visibleChange', this._afterHostVisibleChangeModal);
    this.after('zIndexChange', this._afterHostZIndexChangeModal);
    this.after('focusOnChange', this._afterFocusOnChange);

    // Re-align the mask in the viewport if `position: fixed;` is not
    // supported. iOS < 5 and Android < 3 don't actually support it even
    // though they both pass the feature test; the UA sniff is here to
    // account for that. Ideally this should be replaced with a better
    // feature test.
    if (!supportsPosFixed ||
            (Y.UA.ios && Y.UA.ios < 5) ||
            (Y.UA.android && Y.UA.android < 3)) {

        Y.one('win').on('scroll', this._resyncMask, this);
    }
};


}, 'gallery-2012.04.12-13-50' ,{requires:['widget-modality'], skinnable:false});
