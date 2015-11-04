/*! github.com/michalrusina/lipsify */

function lipsify(options) {
	function init(options) {
		var counters = {},
			node = (options && options.node) ? options.node : document.body,
			random = (options && options.random) ? options.random : true,
			exceptions = ['href', 'src', 'action', 'value'],
			strings = (options && options.strings) ? options.strings : {
				'####': ['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.', 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'],
				'###': ['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'],
				'##': ['Lorem ipsum dolor', 'Consectetur adipisicing elit', 'Sed do eiusmod tempor', 'Incididunt ut labore et dolore magna', 'Ut enim ad minim veniam','Quis nostrud exercitation ullamco', 'Laboris nisi ut', 'Aliquip ex ea commodo', 'Duis aute irure dolor', 'In reprehenderit in voluptate', 'Velit esse cillum'],
				'#': ['Lorem', 'Ipsum', 'Dolor', 'Consectetur', 'Adipisicing', 'Elit', 'Sed', 'Eiusmod', 'Tempor', 'Incididunt', 'Ut', 'Labore', 'Dolore', 'Magna']
			};

		for (var i in strings) {
			if (strings.hasOwnProperty(i)) {
				counters[i] = (random) ? Math.floor(Math.random() * strings[i].length + 1) : 0;
			}
		}

		function pickString(trigger) {
			counters[trigger] = (counters[trigger] < strings[trigger].length - 1) ? counters[trigger] + 1 : 0;

			return strings[trigger][counters[trigger]];
		}

		function replaceString(text) {
			for (var i in strings) {
				if (strings.hasOwnProperty(i)) {
					var splitted = text.split(i);

					for (var j = 0, k = splitted.length; j < k - 1; j += 1) {
						splitted[j] += pickString(i);
					}

					text = splitted.join('');
				}
			}

			return text;
		}

		function traverseChildren(node) {
			if (node.nodeType === 1) {
				var attributes = Array.prototype.slice.call(node.attributes);

				for (var i in attributes) {
					if (attributes.hasOwnProperty(i)) {
						var attr = attributes[i];

						if (exceptions.indexOf(attr.nodeName) === -1) {
							attr.value = replaceString(attr.value);
						}
					}
				}
			}

			if (node.nodeType === 3 && !(/^\s*$/).test(node.nodeValue)) {
				node.nodeValue = replaceString(node.nodeValue, strings);
			} else {
				for (var j = 0, k = node.childNodes.length; j < k; j += 1) {
					traverseChildren(node.childNodes[j]);
				}
			}
		}

		traverseChildren(node);
	}

	function addLoad(func) {
		if (typeof window.onload !== 'function') {
			window.onload = func;
		} else {
			var oldLoad = window.onload;

			window.onload = function() {
				if (oldLoad) {
					oldLoad();
				}

				func();
			};
		}
	}

	if (document.body) {
		init(options);
	} else {
		addLoad(function() {
			lipsify();
		});
	}
}

lipsify();
