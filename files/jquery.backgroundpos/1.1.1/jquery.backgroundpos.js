/* http://keith-wood.name/backgroundPos.html
   Background position animation for jQuery v1.1.1.
   Written by Keith Wood (kbwood{at}iinet.com.au) November 2010.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

var usesTween = !!$.Tween;

if (usesTween) { // jQuery 1.8+
	$.Tween.propHooks['backgroundPosition'] = {
		get: function(tween) {
			return parseBackgroundPosition($(tween.elem).css(tween.prop));
		},
		set: setBackgroundPosition
	};
}
else { // jQuery 1.7-
	// Enable animation for the background-position attribute
	$.fx.step['backgroundPosition'] = setBackgroundPosition;
};

/* Parse a background-position definition: horizontal [vertical]
   @param  value  (string) the definition
   @return  ([2][string, number, string]) the extracted values - relative marker, amount, units */
function parseBackgroundPosition(value) {
	var bgPos = (value || '').split(/ /);
	var presets = {center: '50%', left: '0%', right: '100%', top: '0%', bottom: '100%'};
	var decodePos = function(index) {
		var pos = (presets[bgPos[index]] || bgPos[index] || '50%').
			match(/^([+-]=)?([+-]?\d+(\.\d*)?)(.*)$/);
		bgPos[index] = [pos[1], parseFloat(pos[2]), pos[4] || 'px'];
	};
	if (bgPos.length == 1 && $.inArray(bgPos[0], ['top', 'bottom']) > -1) {
		bgPos[1] = bgPos[0];
		bgPos[0] = '50%';
	}
	decodePos(0);
	decodePos(1);
	return bgPos;
}

/* Set the value for a step in the animation.
   @param  tween  (object) the animation properties */
function setBackgroundPosition(tween) {
	if (!tween.set) {
		initBackgroundPosition(tween);
	}
	$(tween.elem).css('background-position',
		((tween.pos * (tween.end[0][1] - tween.start[0][1]) + tween.start[0][1]) + tween.end[0][2]) + ' ' +
		((tween.pos * (tween.end[1][1] - tween.start[1][1]) + tween.start[1][1]) + tween.end[1][2]));
}

/* Initialise the animation.
   @param  tween  (object) the animation properties */
function initBackgroundPosition(tween) {
	tween.start = parseBackgroundPosition($(tween.elem).css('backgroundPosition'));
	tween.end = parseBackgroundPosition(tween.end);
	for (var i = 0; i < tween.end.length; i++) {
		if (tween.end[i][0]) { // Relative position
			tween.end[i][1] = tween.start[i][1] + (tween.end[i][0] == '-=' ? -1 : +1) * tween.end[i][1];
		}
	}
	tween.set = true;
}

})(jQuery);
