// Check for wp jQuery and define it for requirejs
// This is nice hack to check if WP jQuery has been already loaded (most likely)
if (typeof jQuery === 'function') {
	define('jquery', function () { return jQuery; });
}
