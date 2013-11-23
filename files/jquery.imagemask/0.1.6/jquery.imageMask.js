/**
 * jQuery imageMask
 * @author Almog Baku - almog.baku@gmail.com
 * @see https://github.com/AlmogBaku/imageMask
 *
 * @version 0.1.6
 * @license MIT License
 */

(function( $ ) {
	var $_count_id = 0;

	$.fn.imageMask = function( _mask, _callback ) {
		if ( _mask == undefined ) {
			console.error( "imageMask: undefined mask" );
			return false;
		}
		if ( !this.is( "img" ) ) {
			console.error( "imageMask: jQuery object MUST be an img element" );
			return false;
		}
		if ( (_callback != undefined) && (!$.isFunction( _callback )) ) {
			console.error( "imageMask: callback MUST be function" );
			return false;
		}

		//create mask object
		var maskObj = null;
		if ( _mask.src ) {
			maskObj = _mask;
		} else {
			maskObj = new Image();
			maskObj.src = _mask;
		}

		var obj = this;
		obj.css( "visibility", "hidden" );

		$( maskObj ).load( function() {
			var $maskData = null;
			obj.each( function() {
				//reset
				var $image = $( this ), $canvasObj = null;

				//Create canvas
				$canvasObj = createCanvas( this, maskObj )[0];
				var ctx = $canvasObj.getContext( "2d" );

				if ( $maskData == null ) {
					$maskData = get_maskData( $canvasObj, ctx, maskObj );
				} //get mask data if not exist

				//reRender image
				var img = new Image();
				img.src = $( this ).attr( 'src' );
				$( img ).load( function() {
					drawImg( $canvasObj, ctx, img );
					//Applying mask
					applyMask( $canvasObj, ctx, $maskData );

					//removing original image
					$image.remove();

					//callback
					if ( $.isFunction( _callback ) ) {
						_callback( $canvasObj );
					}
				} );
			} );
		} );

		return this;
	};

	function createCanvas ( img, mask ) {
		img = $( img );

		var id;

		//generate uniqe id
		if ( img.attr( "id" ) ) {
			id = img.attr( "id" );
		} else {
			id = $_count_id++;
		}
		id = "imageMask_" + id + "_canvas";

		//create canvas element
		return $( "<canvas>" ).attr( {
			'id':     id,
			'class':  img.attr( "class" ),
			'style':  img.attr( "style" ),
			'width':  mask.width,
			'height': mask.height
		} ).css( "visibility", "" ).insertAfter( img );
	}

	function get_maskData ( canvasObj, ctx, mask ) {
		ctx.drawImage( mask, 0, 0 );                                                //draw image mask
		var maskData = ctx.getImageData( 0, 0, canvasObj.width, canvasObj.height ); //save mask data
		ctx.clearRect( 0, 0, canvasObj.width, canvasObj.height );                   //clear

		return maskData;
	}

	function drawImg ( canvasObj, ctx, img ) {
		//calculate ratio for scaling
		var ratio = 1;
		if ( img.width > img.height ) {
			ratio = canvasObj.height / img.height;
		} else {
			ratio = canvasObj.width / img.width;
		}

		ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio ); //draw image based on ratio for resizing
	}

	function applyMask ( canvasObj, ctx, maskData ) {
		var imgData = ctx.getImageData( 0, 0, canvasObj.width, canvasObj.height ); //getting the image data
		for ( var i = 0; i < imgData.data.length; i += 4 ) {
			imgData.data[i + 3] = maskData.data[i + 3]; //replacing the point's alpha with the mask alpha
		}
		ctx.putImageData( imgData, 0, 0 ); //apply the changes
	}
})( jQuery );