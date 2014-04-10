/*------------------------------------------------------------------------------
Copyright (c) 2011 Antoine Santo Aka NoNameNo

This File is part of the CODEF project.

More info : http://codef.santo.fr
Demo gallery http://www.wab.com

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
------------------------------------------------------------------------------*/

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

/**
        <b>Create a new canvas object.</b><br>
	canvas(w, h, divname)<br>

        @class canvas
        @param {Number in pixel} w The Width of the canvas you want to create.
        @param {Number in pixel} h The Height of the canvas you want to create.
        @param {String} [divname] The div id you want the create the canvas to. If not specified, the canvas will be hidden.
	@property {Number in pixel} width The Width of the canvas.
	@property {Number in pixel} height The Height of the canvas.
	@property {Object} canvas object of this canvas. ;)
	@property {Object} contex the 2d context of this canvas.
	@property {Number in pixel} handlex the x coord of the handle (0 by default).
	@property {Number in pixel} handley the y coord of the handle (0 by default).
	@property {Number in pixel} tilew the Width of a tile (IF this canvas is a tileset).
	@property {Number in pixel} tileh the Height of a tile (IF this canvas is a tileset).
	@property {Number} tilestart the number of the first tile (usefull for tileset like font).
	@example
	var mycanvas = new canvas(640, 480, "main");
	
*/
function canvas(w, h, divname){
	this.width=w;
	this.height=h;
	this.canvas;
	this.contex;
	this.canvas = document.createElement("canvas");
	if(divname) document.getElementById(divname).appendChild(this.canvas);
	this.canvas.setAttribute('width', w);
	this.canvas.setAttribute('height', h);
	this.contex = this.canvas.getContext('2d');
	
	this.handlex=0;
        this.handley=0;
	this.midhandled=false;
	this.tilew=0;
	this.tileh=0;
	this.tilestart=0;
	
	/**
                <b>Fill the canvas.</b><br>
		canvas.fill(color)<br>

                @function canvas.fill
                @param {Color} color The color you want to fill the canvas with.
		@example
		mycanvas.fill('#FF0000');
        */
	this.fill = function(color){
		var tmp = this.contex.fillStyle;
		var tmp2= this.contex.globalAlpha;
		this.contex.globalAlpha=1;
		this.contex.fillStyle = color;
		this.contex.fillRect (0, 0, this.canvas.width, this.canvas.height);
		this.contex.fillStyle = tmp
		this.contex.globalAlpha=tmp2;
	}

	/**
                <b>Clear the canvas.</b><br>

                @function canvas.clear
		@example
		mycanvas.clear();
        */
	this.clear = function(){
		this.contex.clearRect (0, 0, this.canvas.width, this.canvas.height);
	}
	
	/**
                <b>Draw a plot on the canvas.</b><br>
		canvas.plot(x1,y1,width,color)<br>

                @function canvas.plot
                @param {Number in pixel} x The x coord you want to plot in the canvas.
                @param {Number in pixel} y The y coord you want to plot in the canvas.
                @param {Number in pixel} width The size of the plot.
                @param {Color} color The color of the plot.
		@example
		mycanvas.plot(20,20,50,'#FF0000');
        */
	this.plot = function(x,y,width,color){
		// save old fillstyle
		var oldcolor = this.contex.fillStyle ;

		this.contex.fillStyle=color;
		this.contex.fillRect(x,y,width,width) ;

		// restore old fillstyle
		this.contex.fillStyle=oldcolor;
	}
	
	/**
                <b>Draw a line on the canvas.</b><br>
		canvas.line(x1,y1,x2,y2,width,color)<br>

                @function canvas.line
                @param {Number in pixel} x1 The x coord of the line start in the canvas.
                @param {Number in pixel} y1 The y coord of the line start in the canvas.
                @param {Number in pixel} x2 The x coord of the line end in the canvas.
                @param {Number in pixel} y2 The y coord of the line end in the canvas.
                @param {Number in pixel} width The width of the line.
                @param {Color} color The color of the plot.
		@example
		mycanvas.line(0,0,50,50,2,'#FF0000');
        */
	this.line = function(x1,y1,x2,y2,width,color){
		var tmp=this.contex.strokeStyle;
		this.contex.strokeStyle=color;
		this.contex.lineWidth=width;
		this.contex.beginPath();
		this.contex.moveTo(x1,y1);
		this.contex.lineTo(x2,y2);
		this.contex.stroke();
		this.contex.closePath();
		this.contex.strokeStyle=tmp;
	}
	
	/**
                <b>Draw a filled triangle on the canvas.</b><br>
		canvas.triangle(x1,y1,x2,y2,x3,y3,color)<br>

                @function canvas.triangle
                @param {Number in pixel} x1 The x coord of the 1st edge of the triangle in the canvas.
                @param {Number in pixel} y1 The y coord of the 1st edge of the triangle in the canvas.
                @param {Number in pixel} x2 The x coord of the 2nd edge of the triangle in the canvas.
                @param {Number in pixel} y2 The y coord of the 2nd edge of the triangle in the canvas.
                @param {Number in pixel} x3 The x coord of the 3rd edge of the triangle in the canvas.
                @param {Number in pixel} y3 The y coord of the 3rd edge of the triangle in the canvas.
                @param {Color} color The color of the plot.
		@example
		mycanvas.triangle(150,150,250,250,50,250,'#FF0000');
        */
	this.triangle = function(x1,y1,x2,y2,x3,y3,color){
		this.contex.beginPath();
		this.contex.moveTo(x1,y1);
		this.contex.lineTo(x2,y2);
		this.contex.lineTo(x3,y3);
		this.contex.closePath();
		this.contex.fillStyle=color;
		this.contex.fill();
	}

	/**
                <b>Draw a filled quad on the canvas.</b><br>
                <br>
		it can be used with 5 params : <br>
		canvas.quad(x1,y1,w,h,color)<br>
		<br>
		or it can be used with 9 params : <br>
                canvas.quad(x1,y1,x2,y2,x3,y3,x4,y4,color)<br>
                @function canvas.quad
                @param {Number in pixel} x1 The x coord of the 1st edge of the quad in the canvas.
                @param {Number in pixel} y1 The y coord of the 1st edge of the quad in the canvas.
                @param {Number in pixel} x2 The x coord of the 2nd edge of the quad in the canvas.
                @param {Number in pixel} y2 The y coord of the 2nd edge of the quad in the canvas.
                @param {Number in pixel} x3 The x coord of the 3rd edge of the quad in the canvas.
                @param {Number in pixel} y3 The y coord of the 3rd edge of the quad in the canvas.
                @param {Number in pixel} x4 The x coord of the 4th edge of the quad in the canvas.
                @param {Number in pixel} y4 The y coord of the 4th edge of the quad in the canvas.
                @param {Number in pixel} w The Width of the quad in the canvas.
                @param {Number in pixel} h The Height of the quad in the canvas.
                @param {Color} color The color of the plot.
		@example
		mycanvas.quad(150,150,250,250,'#FF0000');
		or
		mycanvas.quad(0,150,300,150,250,250,50,250,'#FF0000');
        */
	this.quad = function(x1,y1,x2,y2,x3,y3,x4,y4,color){
		// save old fillstyle
		var oldcolor = this.contex.fillStyle ;

		// if x1 y1 width height color
		if(arguments.length==5){
			this.contex.fillStyle=x3;
			this.contex.fillRect(x1,y1,x2,y2) ;
		}
		// if all quad coordinates
		else{
			this.contex.beginPath();
			this.contex.moveTo(x1,y1);
			this.contex.lineTo(x2,y2);
			this.contex.lineTo(x3,y3);
			this.contex.lineTo(x4,y4);
			this.contex.closePath();
			this.contex.fillStyle=color;
			this.contex.fill();		
		}
		// restore old fillstyle
		this.contex.fillStyle=oldcolor;
	}	
	/**
                <b>Init a tileset canvas.</b><br>
                canvas.initTile(tilew,tileh, tilestart)<br>

                @function canvas.initTile
                @param {Number in pixel} tilew The Width of one tile.
                @param {Number in pixel} tileh The Height of one tile.
                @param {Number} [tilestart] The number of the first tile. (0 by default)
		@example
		mycanvas.initTile(32,32);
        */
	this.initTile=function(tilew,tileh, tilestart){
		this.tileh=tileh;
		this.tilew=tilew;
		if(typeof(tilestart)!='undefined')
			this.tilestart=tilestart;
	}
	
	/**
                <b>Draw the canvas to another canvas.</b><br>
                canvas.draw(dst,x,y,alpha, rot,w,h)<br>

                @function canvas.draw
		@param {Object} dst The destination canvas.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord).
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
		@param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
		@param {Number} [w] The normalized zoom factor on x (1 by default).
		@param {Number} [h] The normalized zoom factor on y (1 by default).
		@example
		mycanvas.draw(destcanvas,10,10,1,0,1,1);
        */
        this.draw = function(dst,x,y,alpha, rot,w,h){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==3 || arguments.length==4)
                        dst.contex.drawImage(this.canvas, x-this.handlex,y-this.handley);
		else if(arguments.length==5){
			dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.canvas, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                        dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.scale(w,h);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.canvas, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
	/**
                <b>Draw a tile from this canvas to another canvas.</b><br>
                canvas.drawTile(dst, nb, x, y, alpha, rot, w, h)<br>

                @function canvas.drawTile
                @param {Object} dst The destination canvas.
		@param {Number} nb the tile number.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord).
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
                @param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
                @param {Number} [w] The normalized zoom factor on x (1 by default).
                @param {Number} [h] The normalized zoom factor on y (1 by default).
		@example
		mycanvas.drawTile(destcanvas,5,10,10,1,0,1,1);
        */
        this.drawTile = function(dst, nb, x, y, alpha, rot, w, h){
		var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                this.drawPart(dst,x,y,Math.floor((nb%(this.canvas.width/this.tilew)))*this.tilew,Math.floor(nb/(this.canvas.width/this.tilew))*this.tileh,this.tilew,this.tileh,alpha, rot, w, h);
		dst.contex.globalAlpha=tmp;

	}
        
	/**
                <b>Draw a part of this canvas to another canvas.</b><br>
                canvas.drawPart(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy)<br>

                @function canvas.drawPart
                @param {Object} dst The destination canvas.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord).
		@param {Number in pixel} partx The x coord of the part in the source canvas.
		@param {Number in pixel} party The y coord of the part in the source canvas.
		@param {Number in pixel} partw The width of the part in the source canvas.
		@param {Number in pixel} parth The height of the part in the source canvas.
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
                @param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
                @param {Number} [zx] The normalized zoom factor on x (1 by default).
                @param {Number} [zy] The normalized zoom factor on y (1 by default).
		@example
		mycanvas.drawTile(mycanvas,10,10,0,0,50,50,1,0,1,1);
        */
        this.drawPart = function(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==7 || arguments.length==8){
                       	dst.contex.translate(x,y);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
		else if(arguments.length==9){
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			dst.contex.scale(zx,zy);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }

	 /**
                <b>Set the handle coord of this canvas to the center.</b><br>

                @function canvas.setmidhandle
		@example
		mycanvas.setmidhandle();
        */
	this.setmidhandle=function(){
                this.handlex=parseInt(this.canvas.width/2);
                this.handley=parseInt(this.canvas.height/2);
		this.midhandled=true;
        }

	/**
                <b>Set the handle of the canvas.</b><br>
                canvas.sethandle(x,y)<br>

                @function canvas.sethandle
                @param {Number in pixel} x The x coord of the handle of the canvas.
                @param {Number in pixel} y The y coord of the handle of the canvas.
		@example
		mycanvas.sethandle(50,50);
        */
        this.sethandle=function(x,y){
                this.handlex=x;
                this.handley=y;
		this.midhandled=false;
        }
        
        this.print=function(dst, str, x, y, alpha, rot, w, h){
		for(var i=0; i<str.length; i++){
			if(typeof(w)!='undefined')
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew*w,y,alpha,rot,w,h);
			else
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew,y,alpha,rot,w,h);
		}
	}

	
	return this;
	
}


/**
        <b>Create an image object and load a remote/local png/gif/jpg in it.</b><br>
        image(img)<br>

        @class image
        @param {string} img local or url to an jpg/png/gif image.
        @property {Object} img the dom image object.
        @property {Number in pixel} handlex the x coord of the handle (0 by default).
        @property {Number in pixel} handley the y coord of the handle (0 by default).
        @property {Number in pixel} tilew the Width of a tile (IF this canvas is a tileset).
        @property {Number in pixel} tileh the Height of a tile (IF this canvas is a tileset).
        @property {Number} tilestart the number of the first tile (usefull for tileset like font).
	@example
	// with a local file
	var mylogo = new image('logo.png');

	// with a remote image
	var mylogo = new image('http://www.myremotesite.com/logo.png');

*/
function image(img){
	this.img = new Image();
	this.img.src=img;
        this.handlex=0;
        this.handley=0;
	this.midhandled=false;
	this.tilew=0;
	this.tileh=0;
	this.tilestart=0;
	
	/**
                <b>Init a tileset image.</b><br>
                image.initTile(tilew,tileh, tilestart)<br>

                @function image.initTile
                @param {Number in pixel} tilew The Width of one tile.
                @param {Number in pixel} tileh The Height of one tile.
                @param {Number} [tilestart] The number of the first tile. (0 by default)
		@example
		myimage.initTile(32,32);
        */
	this.initTile=function(tilew,tileh,tilestart){
		this.tileh=tileh;
		this.tilew=tilew;
		if(typeof(tilestart)!='undefined')
			this.tilestart=tilestart;
			
	}

/**
                <b>Draw the image to a canvas.</b><br>
                image.draw(dst,x,y,alpha, rot,w,h)<br>

                @function image.draw
                @param {Object} dst The destination canvas.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord of the image).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord of the image).
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
                @param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
                @param {Number} [w] The normalized zoom factor on x (1 by default).
                @param {Number} [h] The normalized zoom factor on y (1 by default).
		@example
		myimage.draw(destcanvas,10,10,1,0,1,1);
        */
        this.draw = function(dst,x,y,alpha, rot,w,h){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==3 || arguments.length==4)
                        dst.contex.drawImage(this.img, x-this.handlex,y-this.handley);
		else if(arguments.length==5){
			dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.img, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                        dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.scale(w,h);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.img, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
	/**
                <b>Draw a tile from this image to a canvas.</b><br>
                image.drawTile(dst, nb, x, y, alpha, rot, w, h)<br>

                @function image.drawTile
                @param {Object} dst The destination canvas.
                @param {Number} nb the tile number.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord of the image).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord of the image).
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
                @param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
                @param {Number} [w] The normalized zoom factor on x (1 by default).
                @param {Number} [h] The normalized zoom factor on y (1 by default).
		@example
		myimage.drawTile(destcanvas,5,10,10,1,0,1,1);
        */
        this.drawTile = function(dst, nb, x, y, alpha, rot, w, h){
		var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                this.drawPart(dst,x,y,Math.floor((nb%(this.img.width/this.tilew)))*this.tilew,Math.floor(nb/(this.img.width/this.tilew))*this.tileh,this.tilew,this.tileh,alpha, rot, w, h);
		dst.contex.globalAlpha=tmp;

	}
        
	/**
                <b>Draw a part of this image to a canvas.</b><br>
                image.drawPart(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy)<br>

                @function image.drawPart
                @param {Object} dst The destination canvas.
                @param {Number in pixel} x The x coord in the destination canvas (based on the handle coord of the image).
                @param {Number in pixel} y The y coord in the destination canvas (based on the handle coord of the image).
                @param {Number in pixel} partx The x coord of the part in the source canvas.
                @param {Number in pixel} party The y coord of the part in the source canvas.
                @param {Number in pixel} partw The width of the part in the source canvas.
                @param {Number in pixel} parth The height of the part in the source canvas.
                @param {Number} [alpha] The normalized value of the alpha (1 by default).
                @param {Number} [rot] The rotation angle in degrees (0 by default) (will use the handle coord as rotation axis).
                @param {Number} [zx] The normalized zoom factor on x (1 by default).
                @param {Number} [zy] The normalized zoom factor on y (1 by default).
		@example
		myimage.drawTile(mycanvas,10,10,0,0,50,50,1,0,1,1);
        */
        this.drawPart = function(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==7 || arguments.length==8){
                       	dst.contex.translate(x,y);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
		else if(arguments.length==9){
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			dst.contex.scale(zx,zy);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
        
	
	/**
                <b>Set the handle coord of this image to the center.</b><br>

                @function image.setmidhandle
		@example
		myimage.setmidhandle();
        */
	this.setmidhandle=function(){
                this.handlex=parseInt(this.img.width/2);
                this.handley=parseInt(this.img.height/2);
		this.midhandled=true;
        }

	/**
                <b>Set the handle of the image.</b><br>
                image.sethandle(x,y)<br>

                @function image.sethandle
                @param {Number in pixel} x The x coord of the handle of the image.
                @param {Number in pixel} y The y coord of the handle of the image.
		@example
		myimage.sethandle(50,50);
        */
        this.sethandle=function(x,y){
                this.handlex=x;
                this.handley=y;
		this.midhandled=false;
        }
        
        this.print=function(dst, str, x, y, alpha, rot, w, h){
		for(var i=0; i<str.length; i++){
			if(typeof(w)!='undefined')
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew*w,y,alpha,rot,w,h);
			else
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew,y,alpha,rot,w,h);
		}
	}

	return this;
}
