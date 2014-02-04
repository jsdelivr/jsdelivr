////////////////////////////////////////////////////////
////////                                        ////////
////////            jQuery Equalize             ////////
////////                 v.1.7                  ////////
////////                                        ////////
////////////////////////////////////////////////////////
//                                                    //
//  http://labs.eustasy.org/jquery.equalize/          //
//  https://github.com/eustasy/jquery.equalize        //
//                                                    //
//  This small jQuery Script equalizes the height of  //
//  all the divs with the class of equalize within    //
//  each of the group classes.                        //
//                                                    //
//  It works well with our columns system.            //
//                                                    //
//  You should use the minified version.              //
//                                                    //
////////////////////////////////////////////////////////

function equalize(group, equalize) { // Define a new function
	'use strict'; // Be strict
	group = group || '.group'; // Set Group to Itself, OR .group
	equalize = equalize || '.equalize'; // Set Equalize to Itself, OR .equalize
	$(group).each(function(){ // For each group class
		var highestBox = 0; // Clear the highest height
		$(equalize, this).css('height', 'auto'); // Set all the equalize classes to auto
		$(equalize, this).each(function(){ // For each equalize class
			if($(this).innerHeight() > highestBox) { // If it's height is bigger than the highest height
				highestBox = $(this).innerHeight(); // it's the new highest
			}
		}); // Finshed with this group?
		$(equalize,this).innerHeight(highestBox); // Set them to all be the highest
	}); // Start again, or finished with all the groups?
} // Finish defining the function

$(function(){ // When the page has loaded
	'use strict'; // You should always be strict
	equalize(); // Run the function 
}); 

window.onresize = function() { // And every time the window is resized
	'use strict'; // Always
	equalize(); // Here we go again
}; 
