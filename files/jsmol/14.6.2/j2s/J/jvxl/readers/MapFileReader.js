Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.VolumeFileReader", "JU.P3"], "J.jvxl.readers.MapFileReader", ["JU.Logger", "$.SimpleUnitCell"], function () {
c$ = Clazz.decorateAsClass (function () {
this.dmin = 3.4028235E38;
this.dmax = 0;
this.dmean = 0;
this.drange = 0;
this.mapc = 0;
this.mapr = 0;
this.maps = 0;
this.nx = 0;
this.ny = 0;
this.nz = 0;
this.mode = 0;
this.nxyzStart = null;
this.na = 0;
this.nb = 0;
this.nc = 0;
this.a = 0;
this.b = 0;
this.c = 0;
this.alpha = 0;
this.beta = 0;
this.gamma = 0;
this.origin = null;
this.vectors = null;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "MapFileReader", J.jvxl.readers.VolumeFileReader);
Clazz.prepareFields (c$, function () {
this.nxyzStart =  Clazz.newIntArray (3, 0);
this.origin =  new JU.P3 ();
this.vectors =  new Array (3);
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.MapFileReader, []);
});
Clazz.overrideMethod (c$, "init2", 
function (sg, br) {
this.init2MFR (sg, br);
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.defineMethod (c$, "init2MFR", 
function (sg, br) {
this.init2VFR (sg, br);
this.isAngstroms = true;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.defineMethod (c$, "getVectorsAndOrigin", 
function () {
JU.Logger.info ("grid parameters: nx,ny,nz: " + this.nx + "," + this.ny + "," + this.nz);
JU.Logger.info ("grid parameters: nxStart,nyStart,nzStart: " + this.nxyzStart[0] + "," + this.nxyzStart[1] + "," + this.nxyzStart[2]);
JU.Logger.info ("grid parameters: mx,my,mz: " + this.na + "," + this.nb + "," + this.nc);
JU.Logger.info ("grid parameters: a,b,c,alpha,beta,gamma: " + this.a + "," + this.b + "," + this.c + "," + this.alpha + "," + this.beta + "," + this.gamma);
JU.Logger.info ("grid parameters: mapc,mapr,maps: " + this.mapc + "," + this.mapr + "," + this.maps);
JU.Logger.info ("grid parameters: originX,Y,Z: " + this.origin);
var unitCell = JU.SimpleUnitCell.newA ( Clazz.newFloatArray (-1, [this.a / this.na, this.b / this.nb, this.c / this.nc, this.alpha, this.beta, this.gamma]));
this.vectors[0] = JU.P3.new3 (1, 0, 0);
this.vectors[1] = JU.P3.new3 (0, 1, 0);
this.vectors[2] = JU.P3.new3 (0, 0, 1);
unitCell.toCartesian (this.vectors[0], false);
unitCell.toCartesian (this.vectors[1], false);
unitCell.toCartesian (this.vectors[2], false);
JU.Logger.info ("Jmol unit cell vectors:");
JU.Logger.info ("    a: " + this.vectors[0]);
JU.Logger.info ("    b: " + this.vectors[1]);
JU.Logger.info ("    c: " + this.vectors[2]);
this.voxelCounts[0] = this.nz;
this.voxelCounts[1] = this.ny;
this.voxelCounts[2] = this.nx;
this.volumetricVectors[0].setT (this.vectors[this.maps - 1]);
this.volumetricVectors[1].setT (this.vectors[this.mapr - 1]);
this.volumetricVectors[2].setT (this.vectors[this.mapc - 1]);
if (this.origin.x == 0 && this.origin.y == 0 && this.origin.z == 0) {
var xyz2crs =  Clazz.newIntArray (3, 0);
xyz2crs[this.mapc - 1] = 0;
xyz2crs[this.mapr - 1] = 1;
xyz2crs[this.maps - 1] = 2;
var xIndex = xyz2crs[0];
var yIndex = xyz2crs[1];
var zIndex = xyz2crs[2];
this.origin.scaleAdd2 (this.nxyzStart[xIndex], this.vectors[0], this.origin);
this.origin.scaleAdd2 (this.nxyzStart[yIndex], this.vectors[1], this.origin);
this.origin.scaleAdd2 (this.nxyzStart[zIndex], this.vectors[2], this.origin);
}this.volumetricOrigin.setT (this.origin);
JU.Logger.info ("Jmol grid origin in Cartesian coordinates: " + this.origin);
JU.Logger.info ("Use  isosurface OFFSET {x y z}  if you want to shift it.\n");
});
Clazz.defineMethod (c$, "setCutoffAutomatic", 
function () {
if (this.params.thePlane == null && this.params.cutoffAutomatic) {
this.params.cutoff = -1.0;
JU.Logger.info ("MapReader: setting cutoff to default value of " + this.params.cutoff + (this.boundingBox == null ? " (no BOUNDBOX parameter)\n" : "\n"));
}});
});
