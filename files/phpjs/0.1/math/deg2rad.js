function deg2rad (angle) {
  // http://kevin.vanzonneveld.net
  // +   original by: Enrique Gonzalez
  // +     improved by: Thomas Grainger (http://graingert.co.uk)
  // *     example 1: deg2rad(45);
  // *     returns 1: 0.7853981633974483
  return angle * .017453292519943295; // (angle / 180) * Math.PI;
}
