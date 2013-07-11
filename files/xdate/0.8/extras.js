

var formatDatesRE = new RegExp(
	"(\\{" + "(('.*?'|.)*?)" + "\\})|" + // 1, 2, 3
	"(\\[" + "(('.*?'|.)*?)" + "\\])" // 4, 5, 6
);


function formatDates(xdate1, xdate2, formatString, settings) {
	var m;
	var out = '';
	while (m = formatString.match(formatDatesRE)) {
		out += xdate1.toString(formatString.substr(0, m.index));
		if (m[1]) {
			if (xdate2) {
				out += formatDates(xdate2, xdate1, m[2], settings);
			}
		}
		else { // else if (m[4])
			var uniqueness1 = [];
			var uniqueness2 = [];
			var res1 = xdate1.toString(m[5], settings, uniqueness1);
			var res2 = xdate2.toString(m[5], settings, uniqueness2);
			if (res1 != res2 || uniqueness1.join() != uniqueness2.join()) {
				out += res1;
			}
		}
		formatString = formatString.substr(m.index + m[0].length);
	}
	return out + xdate1.toString(formatString);
}