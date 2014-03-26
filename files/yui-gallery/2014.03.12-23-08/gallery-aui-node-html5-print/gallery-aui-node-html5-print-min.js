YUI.add("gallery-aui-node-html5-print",function(A){
/*@cc_on@if(@_jscript_version<9)
(function (window, document) {

var DOCUMENT_ELEMENT = document.documentElement,
	DOCUMENT_FRAGMENT = document.createDocumentFragment(),
	HTML5_STYLESHEET = {},
	HTML5_ELEMENTS = YUI.AUI.HTML5_ELEMENTS,
	HTML5_ELEMENTS_STRING = HTML5_ELEMENTS.join('|'),
	ELEMENTS_CACHE = [],
	FIRST_CHILD = 'firstChild',
	CREATE_ELEMENT = 'createElement',
	a = -1;

function appendStylesheet (media, cssText) {
	if (HTML5_STYLESHEET[media]) {
		HTML5_STYLESHEET[media].styleSheet.cssText += cssText;
	}
	else {
		var head = DOCUMENT_ELEMENT[FIRST_CHILD],
			style = document[CREATE_ELEMENT]('style');

		style.media = media;
		head.insertBefore(style, head[FIRST_CHILD]);
		HTML5_STYLESHEET[media] = style;
		appendStylesheet(media, cssText);
	}
}

function parseStyleSheetList (styleSheetList, media) {
	var cssRuleList,
		selectorText,
		selectorTextMatch = new RegExp('\\b(' + HTML5_ELEMENTS_STRING + ')\\b(?!.*[;}])', 'gi'),
		selectorTextReplace = function (m) {
			return '.iepp_' + m;
		},
		a = -1;

	while (++a < styleSheetList.length) {
		media = styleSheetList[a].media || media;

		parseStyleSheetList(styleSheetList[a].imports, media);

		appendStylesheet(media, styleSheetList[a].cssText.replace(selectorTextMatch, selectorTextReplace));
	}
}

function onBeforePrint () {
	var head = DOCUMENT_ELEMENT[FIRST_CHILD],
		element,
		elements = document.getElementsByTagName('*'),
		elementCache,
		elementName,
		elementMatch = new RegExp('^' + HTML5_ELEMENTS_STRING + '$', 'i'),
		elementReplace,
		elementReplaced,
		a = -1;

	while (++a < elements.length) {
		if ((element = elements[a]) && (elementName = element.nodeName.match(elementMatch))) {
			elementReplace = new RegExp('^\\s*<' + elementName + '(.*)\\/' + elementName + '>\\s*$', 'i');

			DOCUMENT_FRAGMENT.innerHTML = element.outerHTML.replace(/\r|\n/g, ' ').replace(elementReplace, (element.currentStyle.display == 'block') ? '<div$1/div>' : '<span$1/span>');

			elementReplaced = DOCUMENT_FRAGMENT.childNodes[0];
			elementReplaced.className += ' iepp_' + elementName;

			elementCache = ELEMENTS_CACHE[ELEMENTS_CACHE.length] = [element, elementReplaced];

			element.parentNode.replaceChild(elementCache[1], elementCache[0]);
		}
	}

	parseStyleSheetList(document.styleSheets, 'all');
}

function onAfterPrint () {
	var a = -1,
		b;

	while (++a < ELEMENTS_CACHE.length) {
		ELEMENTS_CACHE[a][1].parentNode.replaceChild(ELEMENTS_CACHE[a][0], ELEMENTS_CACHE[a][1]);
	}

	for (b in HTML5_STYLESHEET) {
		DOCUMENT_ELEMENT[FIRST_CHILD].removeChild(HTML5_STYLESHEET[b]);
	}

	HTML5_STYLESHEET = {};
	ELEMENTS_CACHE = [];
}

while (++a < HTML5_ELEMENTS.length) {
	document[CREATE_ELEMENT](HTML5_ELEMENTS[a]);
	DOCUMENT_FRAGMENT[CREATE_ELEMENT](HTML5_ELEMENTS[a]);
}

DOCUMENT_FRAGMENT = DOCUMENT_FRAGMENT.appendChild(document[CREATE_ELEMENT]('div'));

window.attachEvent('onbeforeprint', onBeforePrint);
window.attachEvent('onafterprint', onAfterPrint);

}(A.config.win, A.config.doc));
@end@*/
},"gallery-2010.08.18-17-12",{requires:["gallery-aui-node-html5"]});