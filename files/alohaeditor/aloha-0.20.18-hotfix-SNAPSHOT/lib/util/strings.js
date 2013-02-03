define(['aloha/jquery'],function($){
	

	/**
	 * Splits a string into individual words.
	 *
	 * Words are any sequences of non-space characaters.
	 */
	function words(str) {
		// "  x  ".split(/\s/) -> ["", "x", ""] (Chrome)
		var list = $.trim(str).split(/[\r\n\t\s]+/);
		// "".split(/\s/) -> [""] (Chrome)
		return (list.length && list[0] === "") ? [] : list;
	}

	return {
		'words': words
	};
});
