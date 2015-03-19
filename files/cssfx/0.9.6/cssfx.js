/*
 * cssFx.js - Vendor prefix polyfill for CSS3 properties - v0.9.6
 * http://github.com/imsky/cssFx
 * (C) 2011-2012 Ivan Malopinsky - http://imsky.co
 *
 * Provided under BSD License.
 */
var cssFx = cssFx || {};
(function (fx) {

	function ajax(url, callback) {
		//adapted from microAjax.js
		//140medley.js xhr object
		var xhr = function (a) {
				for (a = 0; a < 4; a++) try {
					return a ? new ActiveXObject([, "Msxml2", "Msxml3", "Microsoft"][a] + ".XMLHTTP") : new XMLHttpRequest
				} catch (b) {}
			}
		if (r = xhr()) {
			r.onreadystatechange = function () {
				r.readyState == 4 && callback(r.responseText);
			};
			r.open("GET", url, true);
			r.send(null);
		}
	}

	function cL(b) {
	//contentLoaded
		var a = window;
		var c = "complete",
			d = "readystatechange",
			e = !1,
			f = e,
			g = !0,
			h = a.document,
			i = h.documentElement,
			j = h.addEventListener ? "addEventListener" : "attachEvent",
			k = h.addEventListener ? "removeEventListener" : "detachEvent",
			l = h.addEventListener ? "" : "on",
			m = function (g) {
				if (g.type == d && h.readyState != c) return;
				(g.type == "load" ? a : h)[k](l + g.type, m, e), !f && (f = !0) && b.call(a, g.type || g)
			},
			n = function () {
				try {
					i.doScroll("left")
				} catch (a) {
					setTimeout(n, 50);
					return
				}
				m("poll")
			};
		if (h.readyState == c) b.call(a, "lazy");
		else {
			if (h.createEventObject && i.doScroll) {
				try {
					g = !a.frameElement
				} catch (o) {}
				g && n()
			}
			h[j](l + "DOMContentLoaded", m, e), h[j](l + d, m, e), a[j](l + "load", m, e)
		}
	}

	function str_combo(text, mode) {
		//If mode is defined, the function works as strip_css_comments + str_trim, otherwise as str_trim
		return text.replace(mode != null ? /\/\*([\s\S]*?)\*\//gim : "", "").replace(/\n/gm, "").replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/\s{2,}|\t/gm, " ");
	}

	function rgb2hex(a, b, c) {
		//140bytes
		return ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
	}

	function inArray(a, b) {
		var c = b.length;
		for (var d = 0; d < c; d++) if (b[d] == a) return !0;
		return !1
	}

	function eachArray(b, c) {
		for (var d = b.length, a = 0; a < d; a++) c.call(this, b[a])
	};

	//Variable words to increase compression rate
	var __animation = "animation";
	var __border = "border";
	var __background = "background";
	var __box_ = "box-";
	var __column = "column";
	var __transition = "transition";

	//cssFx-specific data
	var prefix = ["-moz-", "-webkit-", "-o-", "-ms-"];
	var _moz = prefix[0],
		_webkit = prefix[1],
		_opera = prefix[2],
		_ms = prefix[3];

	var prefixes01 = [__background + "-origin", __background + "-size", __border + "-image", __border + "-image-outset", __border + "-image-repeat", __border + "-image-source", __border + "-image-width", __border + "-radius", __box_ + "shadow", __column + "-count", __column + "-gap", __column + "-rule", __column + "-rule-color", __column + "-rule-style", __column + "-rule-width", __column + "-width"];
	var prefixes013 = [__box_ + "flex", __box_ + "orient", __box_ + "align", __box_ + "ordinal-group", __box_ + "flex-group", __box_ + "pack", __box_ + "direction", __box_ + "lines", __box_ + "sizing", __animation + "-duration", __animation + "-name", __animation + "-delay", __animation + "-direction", __animation + "-iteration-count", __animation + "-play-state", __animation + "-timing-function", __animation + "-fill-mode"];
	var prefixes0123 = ["transform", "transform-origin", __transition, __transition + "-property", __transition + "-duration", __transition + "-timing-function", __transition + "-delay", "user-select"];

	var prefixesMisc = [__background + "-clip", __border + "-bottom-left-radius", __border + "-bottom-right-radius", __border + "-top-left-radius", __border + "-top-right-radius"];

	var prefixed_rules = prefixesMisc.concat(prefixes0123).concat(prefixes01).concat(prefixes013);

	var supported_rules = ["display", "opacity", "text-overflow", __background + "-image", __background].concat(prefixed_rules);
	
	var ms_gradient = "filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='{1}', endColorstr='{2}',GradientType=0)";

	fx.processCSS = function (css_files,url) {
		var css_fx_output = [];
		var css_regex = /([\s\S]*?)\{([\s\S]*?)\}/gim;
		var import_regex = /\@import\s+(?:url\([\'\"]?(.*)[\'\"]?\))\s*\;?/gim;
		var keyframes_regex = /@keyframes\s*([^\{]*)\{([^@]*)\}/g;

		for (var x = 0; x < css_files.length; x++) {
			var css = str_combo(css_files[x], 1);
			var rules = [];
			var imports = import_regex.test(css) && css.match(import_regex);
			var keyframes = keyframes_regex.test(css) && css.match(keyframes_regex);
			import_regex.lastIndex = 0;
			keyframes_regex.lastIndex = 0;

			//Processing imports, removing them from the main CSS, then processing and inserting them
			for (var y = 0; y < imports.length; y++) {
				css = css.replace(imports[y],"")
				var file = import_regex.exec(imports[y])[1];
				var import_url = file[0] == "/" ? file : url.replace(/[^\/]*?$/,'')+file;
				fx.fetchCSS(import_url, function(f){
					//Fetch @import, relative to its parent stylesheet
					fx.insertCSS(fx.processCSS([f],url));
				})
				import_regex.lastIndex = 0;
			}

			//Processing keyframes, removing them from the main CSS, then processing each declaration individually
			for (var y = 0, g = keyframes.length; y < g; y++) {
				css = css.replace(keyframes[y], "");
				if (keyframe = keyframes_regex.exec(keyframes[y])) {
					var kfs = keyframe[2].match(css_regex),
						kfs_p = [];
					for (var _k = 0; _k < kfs.length; _k++) {
						//k[1] = selector, k[2] = rule; just like in standard CSS
						if (k = css_regex.exec(kfs[_k])) {
							kfs_p.push(str_combo(k[1]) + "{" + fx.processDec(k[2], true) + "}");
						}
						css_regex.lastIndex = 0;
					}
					eachArray([0, 1, 3], function (_r) {
						rules.push("@" + prefix[_r] + "keyframes " + str_combo(keyframe[1]) + "{" + kfs_p.join("\n") + "}");
					})
				}
				keyframes_regex.lastIndex = 0;
			}

			var matches = css_regex.test(css) && css.match(css_regex);
			css_regex.lastIndex = 0;
			for (var _x = 0, l = matches.length; _x < l; _x++) {
				var nextMatch = css_regex.exec(matches[_x]);
				if (nextMatch !== null) {
					var selector = str_combo(nextMatch[1], 1);
					var rule = str_combo(nextMatch[2], 1);
					for (var _y = 0, _l = supported_rules.length; _y < _l; _y++) {
						if ( !! ~rule.indexOf(supported_rules[_y])) {
							if (new_dec = fx.processDec(rule)) {
								rules.push(selector + "{" + new_dec + "}");
							}
							break;
						}
					}
				}
				css_regex.lastIndex = 0;
			}

			if (rules.length) {
				css_fx_output.push(rules.join("\n"));
			}

		}
		return css_fx_output;
	}
	fx.insertCSS = function (output) {
		for (var x = 0; x < output.length; x++) {
			var css_fx_output = document.createElement('style');
			css_fx_output.setAttribute('type', 'text/css');
			if (css_fx_output.styleSheet) {
				//Internet Explorer
				css_fx_output.styleSheet.cssText = output[x];
			} else {
				//Everyone else
				css_fx_output.textContent = output[x];
			}
			document.getElementsByTagName("head")[0].appendChild(css_fx_output);
		}
	}

	fx.processDec = function (rule, inc) { //the inc parameter is a boolean, deciding whether to include all properties
		var css_array = rule.split(";"),
			rules = [];
		for (var r = 0; r < css_array.length; r++) {
			if ( !! ~css_array[r].indexOf(":")) {
				var rule = css_array[r].split(":");
				if (rule.length != 2) {
					return false;
				}
				var property = str_combo(rule[0]);
				var value = str_combo(rule[1]);
				var clean_rule = [property, value].join(":");
				var new_rules = [];

				if (inArray(property, prefixes01)) {
					//-moz, -webkit
					new_rules.push(_moz + clean_rule, _webkit + clean_rule);
				} else if (inArray(property, prefixes013)) {
					//-moz, -webkit, -ms
					new_rules.push(	_moz + clean_rule,
									_webkit + clean_rule,
									(property == "box-align" ? _ms + property + ":middle" : _ms + clean_rule));
				} else if (inArray(property, prefixes0123)) {
					//-moz, -webkit, -o, -ms
					//This includes all transition rules
					eachArray([0, 1, 2, 3], function (_r) {
						if (property == "transition") {
							var trans_prop = value.split(" ")[0];
							if (inArray(trans_prop, prefixed_rules)) {
								new_rules.push(prefix[_r] + clean_rule.replace(trans_prop, prefix[_r] + trans_prop));
							} else {
								new_rules.push(prefix[_r] + clean_rule);
							}

						} else if (property == "transition-property") {
							if (_r == 0) {
								//Only Firefox supports this at the moment
								var trans_props = value.split(",");
								var replaced_props = [];
								eachArray(trans_props, function (p) {
									var prop = str_combo(p);
									if (inArray(prop, prefixed_rules)) {
										replaced_props.push(prefix[_r] + prop);
									}
								});
								new_rules.push(prefix[_r] + property + ":" + replaced_props.join(","))
							}
						} else {
							new_rules.push(prefix[_r] + clean_rule)
						}
					});
				} else if (inArray(property, prefixesMisc)) {

					if (property == __background + "-clip") {
						if (value === "padding-box") {
							new_rules.push(	_webkit + clean_rule,
											_moz + property + ":padding");
						}
					} else {
						//Border-radius properties here ONLY
						var v = property.split("-");
						new_rules.push(	_moz + "border-radius-" + v[1] + v[2] + ":" + value,
										_webkit + clean_rule);
					}

				} else {
					switch (property) {
					case "display":
						if (value == "box") {
							eachArray([0, 1, 3], function (_r) {
								new_rules.push("display:" + prefix[_r] + value)
							});
						} else if (value == "inline-block") {
							new_rules.push(	"display:" + _moz + "inline-stack",
											"zoom:1;*display:inline");
						}
						break;
					case "text-overflow":
						if (value == "ellipsis") {
							new_rules.push(_opera + clean_rule);
						}
						break;
					case "opacity":
						var opacity = Math.round(value*100);
						new_rules.push(	_ms + "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity + ")",
										"filter: alpha(opacity=" + opacity + ")",
										_moz + clean_rule,
										_webkit + clean_rule);
						break;
					case __background + "-image":
					case __background + "-color":
					case __background:
						var lg = "linear-gradient";
						if ( !! ~value.indexOf(lg)) {
							var attributes = new RegExp(lg+"\\s?\\((.*)\\)","ig").exec(value);
							if(attributes[1]!=null){
								attributes = attributes[1];
								var prop = lg + "("+attributes+")";
								eachArray([0, 1, 2, 3], function (_r) {
									new_rules.push(property + ":" + prefix[_r] + prop);
								});
								var attributes_colors = attributes.match(/\#([a-z0-9]{3,})/g);
								if(attributes_colors.length>1 && attributes_colors[attributes_colors.length-1]!=null){
									new_rules.push(ms_gradient.replace("{1}",attributes_colors[0]).replace("{2}",attributes_colors[attributes_colors.length-1]));
								}
							}
						} else if ( !! ~value.indexOf("rgba")) {
							//Color array
							var cA = value.match(/rgba\((.*?)\)/)[1].split(",");
							var hex = Math.floor(+(str_combo(cA[3])) * 255).toString(16) + rgb2hex(+str_combo(cA[0]), +str_combo(cA[1]), +str_combo(cA[2]));
							new_rules.push(ms_gradient.replace("{1}","#"+hex).replace("{2}","#"+hex)+";zoom:1");
						}
						break;
					default:
						if (inc != null) {
							new_rules.push(clean_rule);
						}
						break;
					}
				}
				if (new_rules.length) {
					rules.push(new_rules.join(";"));
				}
			}
		}
		return rules.length && rules.join(";");
	}
	fx.fetchCSS = function (file, callback) {
		ajax(file, (callback == null ?
		function (f) {
			fx.insertCSS(fx.processCSS([f],file))
		} : callback));
	}

	var fxinit = function () {
			var style_els = document.getElementsByTagName("style");
			var link_els = document.getElementsByTagName("link");

			//Processing external stylesheets
			for (var x in link_els) {
				if (typeof (link_els[x]) === "object" && link_els[x].className === "cssfx") {
					fx.fetchCSS(link_els[x].href);
				}
			}
			
			var css_files = [];
			//Processing in-page stylesheets
			for (var x in style_els) {
				if (typeof (style_els[x]) === "object") {
					css_files.push(style_els[x].innerHTML);
				}
			}
			if(css_files.length){
				fx.insertCSS(fx.processCSS(css_files))
				}
		}

	cL(fxinit);

})(cssFx);
