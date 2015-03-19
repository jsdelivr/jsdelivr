/*
  The MIT License

  Copyright (c) 2012 Olaf Horstmann, indiegamr.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/


/**
* A Pixel Perfect Collision Detection for EaselJS Bitmap-Objects
* @author olsn, indiegamr.com
**/

this.ndgmr = this.ndgmr || {};

(function() {

  var collisionCanvas = document.createElement('canvas');
  var collisionCtx = collisionCanvas.getContext('2d');
      //collisionCtx.globalCompositeOperation = 'source-in';
      collisionCtx.save();

  var collisionCanvas2 = document.createElement('canvas');
  var collisionCtx2 = collisionCanvas2.getContext('2d');
      collisionCtx2.save();

  var cachedBAFrames = [];

  var checkRectCollision = function(bitmap1,bitmap2) {
    var b1, b2;
    b1 = getBounds(bitmap1);
    b2 = getBounds(bitmap2);
    return calculateIntersection(b1,b2);
  }
  ndgmr.checkRectCollision = checkRectCollision;

  var checkPixelCollision = function(bitmap1, bitmap2, alphaThreshold, getRect) {
    //display the intersecting canvases for debugging
    if ( ndgmr.DEBUG || ndgmr.DEBUG_COLLISION ) {
      document.body.appendChild(collisionCanvas);
      document.body.appendChild(collisionCanvas2);
    }

    getRect = getRect || false;

    var areObjectsCloseEnough,
        intersetion,
        imageData1, imageData2,
        pixelIntersection;

    areObjectsCloseEnough = _collisionDistancePrecheck(bitmap1,bitmap2);
    if ( !areObjectsCloseEnough ) {
      return false;
    }

    intersection = checkRectCollision(bitmap1,bitmap2);
    if ( !intersection ) {
      return false;
    }

    alphaThreshold = alphaThreshold || 0;
    alphaThreshold = Math.min(0.99999,alphaThreshold);

    //setting the canvas size
    collisionCanvas.width  = intersection.width;
    collisionCanvas.height = intersection.height;
    collisionCanvas2.width  = intersection.width;
    collisionCanvas2.height = intersection.height;

    imageData1 = _intersectingImagePart(intersection,bitmap1,collisionCtx,1);
    imageData2 = _intersectingImagePart(intersection,bitmap2,collisionCtx2,2);

    //compare the alpha values to the threshold and return the result
    // = true if pixels are both > alphaThreshold at one coordinate
    pixelIntersection = _compareAlphaValues(imageData1,imageData2,intersection.width,intersection.height,alphaThreshold, getRect);

    if ( pixelIntersection ) {
      pixelIntersection.x  += intersection.x;
      pixelIntersection.x2 += intersection.x;
      pixelIntersection.y  += intersection.y;
      pixelIntersection.y2 += intersection.y;
    } else {
      return false;
    }

    return pixelIntersection;
  }
  ndgmr.checkPixelCollision = checkPixelCollision;

  var _collisionDistancePrecheck = function(bitmap1,bitmap2) {
    var ir1,ir2,b1,b2;

    b1 = bitmap1.localToGlobal(0,0);
    b2 = bitmap2.localToGlobal(0,0);

    ir1 = bitmap1 instanceof createjs.Bitmap
         ? {width:bitmap1.image.width, height:bitmap1.image.height}
         : bitmap1.spriteSheet.getFrame(bitmap1.currentFrame).rect;
    ir2 = bitmap2 instanceof createjs.Bitmap
         ? {width:bitmap2.image.width, height:bitmap2.image.height}
         : bitmap2.spriteSheet.getFrame(bitmap2.currentFrame).rect;

    //precheck if objects are even close enough
    return ( Math.abs(b2.x-b1.x) < ir2.width *bitmap2.scaleX+ir1.width *bitmap1.scaleX
          && Math.abs(b2.y-b1.y) < ir2.height*bitmap2.scaleY+ir1.height*bitmap2.scaleY )
  }

  var _intersectingImagePart = function(intersetion,bitmap,ctx,i) {
    var bl, image, frameName, sr;

    if ( bitmap instanceof createjs.Bitmap ) {
      image = bitmap.image;
    } else if ( bitmap instanceof createjs.Sprite ) {
    frame = bitmap.spriteSheet.getFrame( bitmap.currentFrame )
      frameName = frame.image.src + ':' +
                  frame.rect.x + ':' + frame.rect.y + ':' +
                  frame.rect.width  + ':' + frame.rect.height;// + ':' + frame.rect.regX  + ':' + frame.rect.regY
      if ( cachedBAFrames[frameName] ) {
        image = cachedBAFrames[frameName];
      } else {
        cachedBAFrames[frameName] = image = createjs.SpriteSheetUtils.extractFrame(bitmap.spriteSheet,bitmap.currentFrame);
      }
    }

    bl = bitmap.globalToLocal(intersetion.x,intersetion.y);
    ctx.restore();
    ctx.save();
    //ctx.clearRect(0,0,intersetion.width,intersetion.height);
    ctx.rotate(_getParentalCumulatedProperty(bitmap,'rotation')*(Math.PI/180));
    ctx.scale(_getParentalCumulatedProperty(bitmap,'scaleX','*'),_getParentalCumulatedProperty(bitmap,'scaleY','*'));
    ctx.translate(-bl.x-intersetion['rect'+i].regX,-bl.y-intersetion['rect'+i].regY);
    if ( (sr = bitmap.sourceRect) != undefined ) {
      ctx.drawImage(image,sr.x,sr.y,sr.width,sr.height,0,0,sr.width,sr.height);
    } else {
      ctx.drawImage(image,0,0,image.width,image.height);
    }
    return ctx.getImageData(0, 0, intersetion.width, intersetion.height).data;
  }

  var _compareAlphaValues = function(imageData1,imageData2,width,height,alphaThreshold,getRect) {
    var alpha1, alpha2, x, y, offset = 3,
        pixelRect = {x:Infinity,y:Infinity,x2:-Infinity,y2:-Infinity};

    // parsing through the pixels checking for an alpha match
    // TODO: intelligent parsing, not just from 0 to end!
    for ( y = 0; y < height; ++y) {
        for ( x = 0; x < width; ++x) {
            alpha1 = imageData1.length > offset+1 ? imageData1[offset] / 255 : 0;
            alpha2 = imageData2.length > offset+1 ? imageData2[offset] / 255 : 0;

            if ( alpha1 > alphaThreshold && alpha2 > alphaThreshold ) {
              if ( getRect ) {
                if ( x < pixelRect.x  ) pixelRect.x  = x;
                if ( x > pixelRect.x2 ) pixelRect.x2 = x;
                if ( y < pixelRect.y  ) pixelRect.y  = y;
                if ( y > pixelRect.y2 ) pixelRect.y2 = y;
              } else {
                return {x:x,y:y,width:1,height:1};
              }
            }
            offset += 4;
        }
    }

    if ( pixelRect.x != Infinity ) {
      pixelRect.width  = pixelRect.x2 - pixelRect.x + 1;
      pixelRect.height = pixelRect.y2 - pixelRect.y + 1;
      return pixelRect;
    }

    return null;
  }

  // this is needed to paint the intersection part correctly,
  // if the tested bitmap is a child to a rotated/scaled parent
  // this was not painted correctly before
  var _getParentalCumulatedProperty = function(child,propName,operation) {
    operation = operation || '+';
    if ( child.parent && child.parent[propName] ) {
      var cp = child[propName];
      var pp = _getParentalCumulatedProperty(child.parent,propName,operation);
      if ( operation == '*' ) {
        return cp * pp;
      } else {
        return cp + pp;
      }
    }

    return child[propName];
  }

  var calculateIntersection = function(rect1, rect2)
  {
    // first we have to calculate the
    // center of each rectangle and half of
    // width and height
    var dx, dy, r1={}, r2={};
    r1.cx = rect1.x + (r1.hw = (rect1.width /2));
    r1.cy = rect1.y + (r1.hh = (rect1.height/2));
    r2.cx = rect2.x + (r2.hw = (rect2.width /2));
    r2.cy = rect2.y + (r2.hh = (rect2.height/2));

    dx = Math.abs(r1.cx-r2.cx) - (r1.hw + r2.hw);
    dy = Math.abs(r1.cy-r2.cy) - (r1.hh + r2.hh);

    if (dx < 0 && dy < 0) {
      dx = Math.min(Math.min(rect1.width,rect2.width),-dx);
      dy = Math.min(Math.min(rect1.height,rect2.height),-dy);
      return {x:Math.max(rect1.x,rect2.x),
              y:Math.max(rect1.y,rect2.y),
              width:dx,
              height:dy,
              rect1: rect1,
              rect2: rect2};
    } else {
      return null;
    }
  }
  ndgmr.calculateIntersection = calculateIntersection;

  var getBounds = function(obj) {
    var bounds={x:Infinity,y:Infinity,width:0,height:0};
    if ( obj instanceof createjs.Container ) {
      bounds.x2 = -Infinity;
      bounds.y2 = -Infinity;
      var children = obj.children, l=children.length, cbounds, c;
      for ( c = 0; c < l; c++ ) {
        cbounds = getBounds(children[c]);
        if ( cbounds.x < bounds.x ) bounds.x = cbounds.x;
        if ( cbounds.y < bounds.y ) bounds.y = cbounds.y;
        if ( cbounds.x + cbounds.width > bounds.x2 ) bounds.x2 = cbounds.x + cbounds.width;
        if ( cbounds.y + cbounds.height > bounds.y2 ) bounds.y2 = cbounds.y + cbounds.height;
        //if ( cbounds.x - bounds.x + cbounds.width  > bounds.width  ) bounds.width  = cbounds.x - bounds.x + cbounds.width;
        //if ( cbounds.y - bounds.y + cbounds.height > bounds.height ) bounds.height = cbounds.y - bounds.y + cbounds.height;
      }
      if ( bounds.x == Infinity ) bounds.x = 0;
      if ( bounds.y == Infinity ) bounds.y = 0;
      if ( bounds.x2 == Infinity ) bounds.x2 = 0;
      if ( bounds.y2 == Infinity ) bounds.y2 = 0;

      bounds.width = bounds.x2 - bounds.x;
      bounds.height = bounds.y2 - bounds.y;
      delete bounds.x2;
      delete bounds.y2;
    } else {
      var gp,gp2,gp3,gp4,imgr={},sr;
      if ( obj instanceof createjs.Bitmap ) {
        sr = obj.sourceRect || obj.image;

        imgr.width = sr.width;
        imgr.height = sr.height;
      } else if ( obj instanceof createjs.Sprite ) {
        if ( obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image ) {
          var cframe = obj.spriteSheet.getFrame(obj.currentFrame);
          imgr.width =  cframe.rect.width;
          imgr.height =  cframe.rect.height;
          imgr.regX = cframe.regX;
          imgr.regY = cframe.regY;
        } else {
          bounds.x = obj.x || 0;
          bounds.y = obj.y || 0;
        }
      } else {
        bounds.x = obj.x || 0;
        bounds.y = obj.y || 0;
      }

      imgr.regX = imgr.regX || 0; imgr.width  = imgr.width  || 0;
      imgr.regY = imgr.regY || 0; imgr.height = imgr.height || 0;
      bounds.regX = imgr.regX;
      bounds.regY = imgr.regY;

      gp  = obj.localToGlobal(0         -imgr.regX,0          -imgr.regY);
      gp2 = obj.localToGlobal(imgr.width-imgr.regX,imgr.height-imgr.regY);
      gp3 = obj.localToGlobal(imgr.width-imgr.regX,0          -imgr.regY);
      gp4 = obj.localToGlobal(0         -imgr.regX,imgr.height-imgr.regY);

      bounds.x = Math.min(Math.min(Math.min(gp.x,gp2.x),gp3.x),gp4.x);
      bounds.y = Math.min(Math.min(Math.min(gp.y,gp2.y),gp3.y),gp4.y);
      bounds.width = Math.max(Math.max(Math.max(gp.x,gp2.x),gp3.x),gp4.x) - bounds.x;
      bounds.height = Math.max(Math.max(Math.max(gp.y,gp2.y),gp3.y),gp4.y) - bounds.y;
    }
    return bounds;
  }
  ndgmr.getBounds = getBounds;
}());