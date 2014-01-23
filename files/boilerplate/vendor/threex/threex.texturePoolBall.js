// NOTE: this match THREE namespace on purpose
if(typeof THREEx === "undefined")		var THREEx	= {};
if(typeof THREEx.Texture === "undefined")	THREEx.Texture	= {};

/**
*/
THREEx.Texture.PoolBall	= {
	clear	: function(canvas){
		var w	= canvas.width;
		var ctx	= canvas.getContext( '2d' );
		clearRect(0, 0, w, w);	
	},
	/**
	 * display the shaddow of the smiley in a texture
	 *
	 * @param {canvasElement} the canvas where we draw
	*/
	draw	: function(canvas, textData, stripped, color){
		var ctx		= canvas.getContext( '2d' );
		var w		= canvas.width;
		var h		= canvas.height;
		
		// base color is white
		ctx.save();
		ctx.fillStyle	= "#FFFFFF";
		ctx.fillRect(0,0, w, h);
		ctx.restore();

		ctx.save();
		ctx.translate(w/2, h/2)
		var rectH	= stripped ? h/2 : h;
		ctx.fillStyle	= color.getContextStyle();
		ctx.fillRect(-w/2,-rectH/2, w, rectH);
		ctx.restore();

		ctx.save();
		ctx.translate(w/2, h/2)
		ctx.fillStyle	= "#FFFFFF";
		var radiusW	= 0.7 * w/4;
		var radiusH	= 1.2 * h/4;
		ctx.fillEllipse( -radiusW/2, -radiusH/2, radiusW, radiusH);
		ctx.restore();

		ctx.save();
		ctx.translate(w/2, h/2)
		var textH	= w/4;
		ctx.font	= "bolder "+textH+"px Arial";
		ctx.fillStyle	= "#000000";
		var textW	= ctx.measureText(textData).width;
		ctx.fillText(textData, -textW/2, 0.8*textH/2);
		ctx.restore();
	},

//////////////////////////////////////////////////////////////////////////////////
//		texture helper							//
//////////////////////////////////////////////////////////////////////////////////
	
	ballTexture: function( textData, stripped, color, canvasW, mapping, callback ) {
		var canvasDrawer	= function(canvas){
			THREEx.Texture.PoolBall.draw(canvas, textData, stripped, color);
		}
		return THREEx.Texture.PoolBall._buildTexture( canvasW, mapping, callback, canvasDrawer );
	},
	
	_buildTexture: function( canvasW, mapping, callback, canvasDrawer ) {
		canvasW		= typeof canvasW !== 'undefined' ? canvasW : 64;
		var canvas	= document.createElement('canvas');
		canvas.width	= canvas.height	= canvasW;
		var texture	= new THREE.Texture(canvas, mapping);

		canvasDrawer(canvas);

		texture.needsUpdate	= true;
		if( callback )	callback( this );
		return texture;
	},

}