/** @namespace */
var THREEx	= THREEx 		|| {};
THREEx.Embedded	= THREEx.Embedded	|| {};

/**
 * @returns {Boolean} return true if we are in a iframe, false otherwise
*/
THREEx.Embedded.inIFrame	= function()
{
	return window != window.top ? true : false;
}

/**
 * Prevent Arrows key event from going out of the iframe
*/
THREEx.Embedded.shieldArrowKeys	= function()
{
	document.addEventListener('keydown', function(event){
		// if it is keydown on a arrow, prevent default
		if( event.keyCode >= 37 && event.keyCode <= 40 ){
			event.preventDefault();
		}
	}, true);
}
