// This THREEx helper makes it easy to handle chrome.webstore.install API.
// * api description http://code.google.com/chrome/webstore/docs/inline_installation.html 
// * paul kinlan post on g+ https://plus.google.com/116059998563577101552/posts/c9zYiA9RdC5
// 
// # Code

//


/** @namespace */
var THREEx			= THREEx 			|| {};
THREEx.ChromeWebStoreInstall	= THREEx.ChromeWebStoreInstall	|| {};

/**
 * test if the API is available
 * @returns {Boolean} true if the API is available, false otherwise
*/
THREEx.ChromeWebStoreInstall.apiAvailable	= function()
{
	var available	= typeof chrome !== 'undefined' && chrome.webstore && chrome.webstore.install;
	return available ? true : false;
}

/**
 * Test if the application is already installed
 * 
 * @returns {Boolean} true if the application is installed, false otherwise
*/
THREEx.ChromeWebStoreInstall.isInstalled	= function()
{
	if( !this.apiAvailable() )	return false;
	return chrome.app.isInstalled ? true : false;
}

/**
 * Trigger an installation
 * @param {String} url of the application (optional)
 * @param {Function} callback called if installation succeed
 * @param {Function} callback called if installation failed
*/
THREEx.ChromeWebStoreInstall.install	= function(url, successCallback, failureCallback)
{
	console.assert( this.apiAvailable() )
	chrome.webstore.install(url, successCallback, failureCallback);
}