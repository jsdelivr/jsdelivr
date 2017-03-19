Clazz.declarePackage ("J.render");
Clazz.load (["J.render.ShapeRenderer"], "J.render.FrankRenderer", null, function () {
c$ = Clazz.declareType (J.render, "FrankRenderer", J.render.ShapeRenderer);
Clazz.overrideMethod (c$, "render", 
function () {
var frank = this.shape;
var allowKeys = this.vwr.getBooleanProperty ("allowKeyStrokes");
var modelKitMode = this.vwr.getBoolean (603979883);
this.colix = (modelKitMode ? 20 : this.vwr.isSignedApplet ? (allowKeys || this.vwr.isJS && !this.vwr.isWebGL ? 5 : 10) : allowKeys ? 7 : 12);
if (this.isExport || !this.vwr.getShowFrank () || !this.g3d.setC (this.colix)) return false;
if (this.vwr.frankOn && !this.vwr.noFrankEcho) return this.vwr.noFrankEcho;
this.vwr.noFrankEcho = true;
var imageFontScaling = this.vwr.imageFontScaling;
frank.getFont (imageFontScaling);
var dx = Clazz.floatToInt (frank.frankWidth + 4 * imageFontScaling);
var dy = frank.frankDescent;
this.g3d.drawStringNoSlab (frank.frankString, frank.font3d, this.vwr.gdata.width - dx, this.vwr.gdata.height - dy, 0, 0);
if (modelKitMode) {
this.g3d.fillTextRect (0, 0, 0, 0, dy * 2, Clazz.doubleToInt (dx * 3 / 2));
}return false;
});
});
