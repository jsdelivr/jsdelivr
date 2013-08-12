/*
 * Simple jQuery Equal Heights
 *
 * Copyright (c) 2012 Matt Banks
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 1.3
 */
(function($) {

	$.fn.equalHeights = function() {
		var maxHeight = 0,
            $this = $(this);

		$this.each( function() {
			var height = $(this).innerHeight();

			if ( height > maxHeight ) { maxHeight = height; }
		});

		return $this.height(maxHeight);
	};

})(jQuery);
