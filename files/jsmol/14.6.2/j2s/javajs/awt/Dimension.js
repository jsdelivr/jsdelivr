Clazz.declarePackage ("javajs.awt");
c$ = Clazz.decorateAsClass (function () {
this.width = 0;
this.height = 0;
Clazz.instantialize (this, arguments);
}, javajs.awt, "Dimension");
Clazz.makeConstructor (c$, 
function (w, h) {
this.set (w, h);
}, "~N,~N");
Clazz.defineMethod (c$, "set", 
function (w, h) {
this.width = w;
this.height = h;
return this;
}, "~N,~N");
