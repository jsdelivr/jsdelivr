Clazz.declarePackage ("J.quantum");
c$ = Clazz.decorateAsClass (function () {
this.isCore = false;
this.iAtom = 0;
this.x = 0;
this.y = 0;
this.z = 0;
this.r = 0;
this.zeta = 0;
this.coef = 0;
this.index = 0;
Clazz.instantialize (this, arguments);
}, J.quantum, "SlaterData");
Clazz.makeConstructor (c$, 
function (iAtom, x, y, z, r, zeta, coef) {
this.iAtom = iAtom;
this.x = x;
this.y = y;
this.z = z;
this.r = r;
this.zeta = zeta;
this.coef = coef;
}, "~N,~N,~N,~N,~N,~N,~N");
