/*
Created by http://benmoren.com
Some functions and code modified version from http://www.jeffreythompson.org/collision-detection
GNU LGPL 2.1 License
Version 0.1 | January 10th, 2016
*/
console.log("### p5.collide ###")

p5.prototype._collideDebug = false;

p5.prototype.collideDebug = function(debugMode){
    _collideDebug = debugMode;
}

/*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/

p5.prototype.collideRectRect = function (x, y, w, h, x2, y2, w2, h2) {
  //2d
  //add in a thing to detect rectMode CENTER
  if (x + w >= x2 &&    // r1 right edge past r2 left
      x <= x2 + w2 &&    // r1 left edge past r2 right
      y + h >= y2 &&    // r1 top edge past r2 bottom
      y <= y2 + h2) {    // r1 bottom edge past r2 top
        return true;
  }
  return false;
};

p5.prototype.collideRectCircle = function (rx, ry, rw, rh, cx, cy, diameter) {
  //2d
  // temporary variables to set edges for testing
  var testX = cx;
  var testY = cy;

  // which edge is closest?
  if (cx < rx){         testX = rx       // left edge
  }else if (cx > rx+rw){ testX = rx+rw  }   // right edge

  if (cy < ry){         testY = ry       // top edge
  }else if (cy > ry+rh){ testY = ry+rh }   // bottom edge

  // // get distance from closest edges
  var distance = this.dist(cx,cy,testX,testY)

  // if the distance is less than the radius, collision!
  if (distance <= diameter/2) {
    return true;
  }
  return false;
};

p5.prototype.collideCircleCircle = function (x, y,d, x2, y2, d2) {
//2d
  if( this.dist(x,y,x2,y2) <= (d/2)+(d2/2) ){
    return true;
  }
  return false;
};

p5.prototype.collidePointCircle = function (x, y, cx, cy, d) {
//2d
if( this.dist(x,y,cx,cy) <= d/2 ){
  return true;
}
return false;
};

p5.prototype.collidePointRect = function (pointX, pointY, x, y, xW, yW) {
//2d
if (pointX >= x &&         // right of the left edge AND
    pointX <= x + xW &&    // left of the right edge AND
    pointY >= y &&         // below the top AND
    pointY <= y + yW) {    // above the bottom
        return true;
}
return false;
};

p5.prototype.collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
  // get distance from the point to the two ends of the line
var d1 = this.dist(px,py, x1,y1);
var d2 = this.dist(px,py, x2,y2);

// get the length of the line
var lineLen = this.dist(x1,y1, x2,y2);

// since floats are so minutely accurate, add a little buffer zone that will give collision
if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

// if the two distances are equal to the line's length, the point is on the line!
// note we use the buffer here to give a range, rather than one #
if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
  return true;
}
return false;
}

p5.prototype.collideLineCircle = function( x1,  y1,  x2,  y2,  cx,  cy,  diameter) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  var inside1 = this.collidePointCircle(x1,y1, cx,cy,diameter);
  var inside2 = this.collidePointCircle(x2,y2, cx,cy,diameter);
  if (inside1 || inside2) return true;

  // get length of the line
  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = this.sqrt( (distX*distX) + (distY*distY) );

  // get dot product of the line and circle
  var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / this.pow(len,2);

  // find the closest point on the line
  var closestX = x1 + (dot * (x2-x1));
  var closestY = y1 + (dot * (y2-y1));

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  var onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
  if (!onSegment) return false;

  // draw a debug circle at the closest point on the line
  if(this._collideDebug){
    this.ellipse(closestX, closestY,10,10);
  }

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  var distance = this.sqrt( (distX*distX) + (distY*distY) );

  if (distance <= diameter/2) {
    return true;
  }
  return false;
}

p5.prototype.collideLineLine = function(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

  var intersection;

  // calculate the distance to intersection point
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    if(this._collideDebug || calcIntersection){
      // calc the point where the lines meet
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));
    }

    if(this._collideDebug){
      this.ellipse(intersectionX,intersectionY,10,10);
    }

    if(calcIntersection){
      intersection = {
        "x":intersectionX,
        "y":intersectionY
      }
      return intersection;
    }else{
      return true;
    }
  }
  if(calcIntersection){
    intersection = {
      "x":false,
      "y":false
    }
    return intersection;
  }
  return false;
}

p5.prototype.collideLineRect = function(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {

  // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
  var left, right, top, bottom, intersection;

  if(calcIntersection){
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,true);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,true);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,true);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,true);
     intersection = {
        "left" : left,
        "right" : right,
        "top" : top,
        "bottom" : bottom
    }
  }else{
    //return booleans
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
  }

  // if ANY of the above are true, the line has hit the rectangle
  if (left || right || top || bottom) {
    if(calcIntersection){
      return intersection;
    }
    return true;
  }
  return false;
}


p5.prototype.collidePointPoly = function(px, py, vertices) {
  var collision = false;

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = vertices[current];    // c for "current"
    var vn = vertices[next];       // n for "next"

    // compare position, flip 'collision' variable back and forth
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
         (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    }
  }
  return collision;
}

// POLYGON/CIRCLE
p5.prototype.collideCirclePoly = function(cx, cy, diameter, vertices, interior) {

  if (interior == undefined){
    interior = false;
  }

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = vertices[current];    // c for "current"
    var vn = vertices[next];       // n for "next"

    // check for collision between the circle and a line formed between the two vertices
    var collision = this.collideLineCircle(vc.x,vc.y, vn.x,vn.y, cx,cy,diameter);
    if (collision) return true;
  }

  // test if the center of the circle is inside the polygon
  if(interior == true){
    var centerInside = this.collidePointPoly(cx,cy, vertices);
    if (centerInside) return true;
  }

  // otherwise, after all that, return false
  return false;
}

p5.prototype.collideRectPoly = function( rx, ry, rw, rh, vertices, interior) {
  if (interior == undefined){
    interior = false;
  }

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = vertices[current];    // c for "current"
    var vn = vertices[next];       // n for "next"

    // check against all four sides of the rectangle
    var collision = this.collideLineRect(vc.x,vc.y,vn.x,vn.y, rx,ry,rw,rh);
    if (collision) return true;

    // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
    if(interior == true){
      var inside = this.collidePointPoly(rx,ry, vertices);
      if (inside) return true;
    }
  }

  return false;
}

p5.prototype.collideLinePoly = function(x1, y1, x2, y2, vertices) {

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // get next vertex in list if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position extract X/Y coordinates from each
    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y;

    // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
    var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }
  // never got a hit
  return false;
}

p5.prototype.collidePolyPoly = function(p1, p2, interior) {
  if (interior == undefined){
    interior = false;
  }

  // go through each of the vertices, plus the next vertex in the list
  var next = 0;
  for (var current=0; current<p1.length; current++) {

    // get next vertex in list, if we've hit the end, wrap around to 0
    next = current+1;
    if (next == p1.length) next = 0;

    // get the PVectors at our current position this makes our if statement a little cleaner
    var vc = p1[current];    // c for "current"
    var vn = p1[next];       // n for "next"

    //use these two points (a line) to compare to the other polygon's vertices using polyLine()
    var collision = this.collideLinePoly(vc.x,vc.y,vn.x,vn.y,p2);
    if (collision) return true;

    //check if the 2nd polygon is INSIDE the first
    if(interior == true){
      collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
      if (collision) return true;
    }
  }

  return false;
}

p5.prototype.collidePointTriangle = function(px, py, x1, y1, x2, y2, x3, y3) {

  // get the area of the triangle
  var areaOrig = this.abs( (x2-x1)*(y3-y1) - (x3-x1)*(y2-y1) );

  // get the area of 3 triangles made between the point and the corners of the triangle
  var area1 =    this.abs( (x1-px)*(y2-py) - (x2-px)*(y1-py) );
  var area2 =    this.abs( (x2-px)*(y3-py) - (x3-px)*(y2-py) );
  var area3 =    this.abs( (x3-px)*(y1-py) - (x1-px)*(y3-py) );

  // if the sum of the three areas equals the original, we're inside the triangle!
  if (area1 + area2 + area3 == areaOrig) {
    return true;
  }
  return false;
}

p5.prototype.collidePointPoint = function (x,y,x2,y2, buffer) {
    if(buffer == undefined){
      buffer = 0;
    }

    if(this.dist(x,y,x2,y2) <= buffer){
      return true;
    }

  return false;
};
