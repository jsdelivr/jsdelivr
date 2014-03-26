YUI.add("gallery-patch-350-widget-modality",function(b){
/*!
IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax)
http://yura.thinkweb2.com/cft/
*/
var a=(function(){var f=b.config.doc,d=null,e,c;if(f.createElement){e=f.createElement("div");if(e&&e.style){e.style.position="fixed";e.style.top="10px";c=f.body;if(c&&c.appendChild&&c.removeChild){c.appendChild(e);d=(e.offsetTop===10);c.removeChild(e);}}}return d;}());b.WidgetModality.prototype._bindUIModal=function(){this.after("visibleChange",this._afterHostVisibleChangeModal);this.after("zIndexChange",this._afterHostZIndexChangeModal);this.after("focusOnChange",this._afterFocusOnChange);if(!a||(b.UA.ios&&b.UA.ios<5)||(b.UA.android&&b.UA.android<3)){b.one("win").on("scroll",this._resyncMask,this);}};},"gallery-2012.04.12-13-50",{requires:["widget-modality"],skinnable:false});