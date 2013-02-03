jQuery(function($) {


		var	articles = $(thePostClasses), socialised = { }, win = $(window), updateArticles, onUpdate, updateTimeout;

		updateArticles = function()
		{
			// viewport bounds
			var	wT = win.scrollTop(),
				wL = win.scrollLeft(),
				wR = wL + win.width(),
				wB = wT + win.height();
			// check which articles are visible and socialise!
			for (var i = 0; i < articles.length; i++) {
				if (socialised[i]) {
					continue;
				}
				// article bounds
				var	art = $(articles[i]),
					aT = art.offset().top,
					aL = art.offset().left,
					aR = aL + art.width(),
					aB = aT + art.height();
				// vertial point inside viewport
				if ((aT >= wT && aT <= wB) || (aB >= wT && aB <= wB)) {
					// horizontal point inside viewport
					if ((aL >= wL && aL <= wR) || (aR >= wL && aR <= wR)) {
						socialised[i] = true;
						Socialite.load(articles[i]);
					}
				}
			}
		};

		onUpdate = function()
		{
			if (updateTimeout) {
				clearTimeout(updateTimeout);
			}
			updateTimeout = setTimeout(updateArticles, 100);
		};

		win.on('resize', onUpdate).on('scroll', onUpdate);

		setTimeout(updateArticles, 100);

});//theend