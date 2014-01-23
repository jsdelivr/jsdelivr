/**
 * Provides requestAnimationFrame/cancelRequestAnimation in a cross browser way.
 * from paul irish + jerome etienne
 * - http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * - http://notes.jetienne.com/2011/05/18/cancelRequestAnimFrame-for-paul-irish-requestAnimFrame.html
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			return window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}

if ( !window.cancelRequestAnimationFrame ) {

	window.cancelRequestAnimationFrame = ( function() {

		return window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout

	} )();

}
