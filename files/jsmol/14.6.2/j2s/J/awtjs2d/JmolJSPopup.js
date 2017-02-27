Clazz.declarePackage ("J.awtjs2d");
Clazz.load (["J.popup.JmolGenericPopup"], "J.awtjs2d.JmolJSPopup", ["J.i18n.GT", "J.popup.JSSwingPopupHelper", "$.MainPopupResourceBundle"], function () {
c$ = Clazz.declareType (J.awtjs2d, "JmolJSPopup", J.popup.JmolGenericPopup);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.awtjs2d.JmolJSPopup, []);
this.helper =  new J.popup.JSSwingPopupHelper (this);
});
Clazz.overrideMethod (c$, "jpiInitialize", 
function (vwr, menu) {
var doTranslate = J.i18n.GT.setDoTranslate (true);
var bundle =  new J.popup.MainPopupResourceBundle (this.strMenuStructure = menu, this.menuText);
this.initialize (vwr, bundle, bundle.getMenuName ());
J.i18n.GT.setDoTranslate (doTranslate);
}, "javajs.api.PlatformViewer,~S");
Clazz.overrideMethod (c$, "menuShowPopup", 
function (popup, x, y) {
try {
(popup).show (this.isTainted ? this.vwr.html5Applet : null, x, y);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
this.isTainted = false;
}, "javajs.api.SC,~N,~N");
Clazz.overrideMethod (c$, "menuSetCheckBoxOption", 
function (item, name, what) {
return null;
}, "javajs.api.SC,~S,~S");
Clazz.overrideMethod (c$, "getImageIcon", 
function (fileName) {
return null;
}, "~S");
Clazz.overrideMethod (c$, "menuFocusCallback", 
function (name, actionCommand, b) {
}, "~S,~S,~B");
});
