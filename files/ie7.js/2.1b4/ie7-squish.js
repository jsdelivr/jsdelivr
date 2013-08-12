
/* ---------------------------------------------------------------------

  Squish some IE bugs!

  Some of these bug fixes may have adverse effects so they are
  not included in the standard library. Add your own if you want.

--------------------------------------------------------------------- */

// NOTE: IE7.Layout.boxSizing is the same as the "Holly Hack"

if (IE7.loaded && IE7.appVersion < 7) {

  // "doubled margin" bug
  // http://www.positioniseverything.net/explorer/doubled-margin.html
  IE7.CSS.addFix(/(float\s*:\s*(left|right))/, "display:inline;$1");

  // "peekaboo" bug
  // http://www.positioniseverything.net/explorer/peekaboo.html
  if (IE7.appVersion >= 6) IE7.CSS.addRecalc("float", "(left|right)", function(element) {
  	IE7.Layout.boxSizing(element.parentElement);
  	// "doubled margin" bug
  	element.style.display = "inline";
  });

  // "unscrollable content" bug
  // http://www.positioniseverything.net/explorer/unscrollable.html
  IE7.CSS.addRecalc("position", "absolute|fixed", function(element) {
  	if (element.offsetParent && element.offsetParent.currentStyle.position === "relative")
  		IE7.Layout.boxSizing(element.offsetParent);
  });
}

//# // get rid of Microsoft's pesky image toolbar
//# document.write('<meta http-equiv="imagetoolbar" content="no">');
