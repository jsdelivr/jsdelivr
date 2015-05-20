define(['require', 'util/client'], function(require, client) {
	'use strict';

	if(client.browser === 'chrome' || client.browser === 'ie') return require(['plugin/smoothscroll-chrome']);
	// if(client.browser === 'ie') return require(['plugin/smoothscroll-jquery']);

	// require(['plugin/jquery.smoothwheel'], function() {
	//     $(document).ready(function(){
	//     	console.log('smooth')
	//         $("#wrapper").smoothWheel()
	//     });
	// });

});