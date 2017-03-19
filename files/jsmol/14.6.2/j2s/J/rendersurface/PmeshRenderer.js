Clazz.declarePackage ("J.rendersurface");
Clazz.load (["J.rendersurface.IsosurfaceRenderer"], "J.rendersurface.PmeshRenderer", null, function () {
c$ = Clazz.declareType (J.rendersurface, "PmeshRenderer", J.rendersurface.IsosurfaceRenderer);
Clazz.overrideMethod (c$, "render", 
function () {
this.forceShowTriangles = this.vwr.getBoolean (603979964);
return this.renderIso ();
});
});
