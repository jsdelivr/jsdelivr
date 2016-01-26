/*
 * cssFx.js - Vendor prefix polyfill for CSS3 properties - v0.9.7
 * http://github.com/imsky/cssFx
 * (C) 2011-2012 Ivan Malopinsky - http://imsky.co
 *
 * Provided under BSD License.
 */

var cssFx = cssFx || {};

/*
 * cssFx process:
 * 
 * fx.fetchCSS - external files
 * fx.processCSS
 * 		fx.fetchCSS - @import
 * 			fx.processCSS
 * 			fx.insertCSS
 * 		fx.processDec - keyframes
 * 		fx.processDec - main CSS
 * 	fx.insertCSS
 * 		
 */

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

	function contentLoaded(e){var t=window,n="addEventListener",r="complete",i="readystatechange",s=!1,o=s,u=!0,a=t.document,f=a.documentElement,l=a[n]?n:"attachEvent",c=a[n]?"removeEventListener":"detachEvent",h=a[n]?"":"on",p=function(n){if(n.type==i&&a.readyState!=r)return;(n.type=="load"?t:a)[c](h+n.type,p,s),!o&&(o=!0)&&e.call(t,n.type||n)},d=function(){try{f.doScroll("left")}catch(e){setTimeout(d,50);return}p("poll")};if(a.readyState==r)e.call(t,"lazy");else{if(a.createEventObject&&f.doScroll){try{u=!t.frameElement}catch(v){}u&&d()}a[l](h+"DOMContentLoaded",p,s),a[l](h+i,p,s),t[l](h+"load",p,s)}}

	function str_combo(text, mode) {
		//If mode is defined, the function works as strip_css_comments + str_trim, otherwise as str_trim
		return text.replace(mode != null ? /\/\*([\s\S]*?)\*\//gim : "", "").replace(/\n/gm, "").replace(/^\s*|\s*$/g,"").replace(/\s{2,}|\t/gm, " ");
	}

	function rgb2hex(a, b, c) {
		//140bytes
		return ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
	}

	function inArray(a, b) {
		for (var d = 0, c = b.length; d < c; d++) if (b[d] == a) return !0;
		return !1
	}

	function forEach(b, c) {
		for (var d = b.length, a = 0; a < d; a++) c.call(this, b[a])
	};

	
function props() {
	var animation = "animation",
		border = "border",
		background = "background",
		box = "box",
		column = "column",
		transition = "transition",
		transform = "transform",
		properties = {
			moz_and_webkit: [
				background + "-origin",
				background + "-size",
				border + "-image",
				border + "-image-outset",
				border + "-image-repeat",
				border + "-image-source",
				border + "-image-width",
				border + "-radius",
				box + "-shadow",
				column + "-count",
				column + "-gap",
				column + "-rule",
				column + "-rule-color",
				column + "-rule-style",
				column + "-rule-width",
				column + "-width"],
			
			moz_and_webkit_and_ms: [
				box + "-flex",
				box + "-orient",
				box + "-align",
				box + "-ordinal-group",
				box + "-flex-group",
				box + "-pack",
				box + "-direction",
				box + "-lines",
				box + "-sizing",
				animation + "-duration",
				animation + "-name",
				animation + "-delay",
				animation + "-direction",
				animation + "-iteration-count",
				animation + "-play-state",
				animation + "-timing-function",
				animation + "-fill-mode"],
			
			moz_and_webkit_and_ms_and_opera: [
				transform,
				transform + "-origin",
				transition,
				transition + "-property",
				transition + "-duration",
				transition + "-timing-function",
				transition + "-delay",
				"user-select"],
			
			misc: [
				background + "-clip",
				border + "-bottom-left-radius",
				border + "-bottom-right-radius",
				border + "-top-left-radius",
				border + "-top-right-radius"
			]
		}
	return properties;
}
	
	//cssFx-specific data
	var prefix = ["-moz-", "-webkit-", "-o-", "-ms-"];
	var properties = props();
	var _moz = prefix[0],
		_webkit = prefix[1],
		_opera = prefix[2],
		_ms = prefix[3];

	var prefixes01 = properties.moz_and_webkit;
	var prefixes013 = properties.moz_and_webkit_and_ms;
	var prefixes0123 = properties.moz_and_webkit_and_ms_and_opera;
	var prefixesMisc = properties.misc;

	var prefixed_rules = prefixesMisc.concat(prefixes0123, prefixes01, prefixes013);

	var supported_rules = ["display", "opacity", "text-overflow", "background-image", "background"].concat(prefixed_rules);
	
	var ms_gradient = "filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='{1}', endColorstr='{2}',GradientType=0)";

	fx.processCSS = function (cssFiles,url) {
		var css_fx_output = [];
		var css_regex = /([\s\S]*?)\{([\s\S]*?)\}/gim;
		var import_regex = /\@import\s+(?:url\([\'\"]?(.*)[\'\"]?\))\s*\;?/gim;
		var keyframes_regex = /@keyframes\s*([^\{]*)\{([^@]*)\}/g;

		for (var x = 0; x < cssFiles.length; x++) {
			var css = str_combo(cssFiles[x], 1);
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
				var keyframe = keyframes_regex.exec(keyframes[y])
				if (keyframe) {
					var kfs = keyframe[2].match(css_regex),
						kfs_p = [];
					for (var _k = 0; _k < kfs.length; _k++) {
						//k[1] = selector, k[2] = rule; just like in standard CSS
						var k = css_regex.exec(kfs[_k])
						if (k) {
							kfs_p.push(str_combo(k[1]) + "{" + fx.processDec(k[2], true) + "}");
						}
						css_regex.lastIndex = 0;
					}
					forEach([0, 1, 3], function (i) {
						rules.push("@" + prefix[i] + "keyframes " + str_combo(keyframe[1]) + "{" + kfs_p.join("\n") + "}");
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
						if (rule.indexOf(supported_rules[_y])>=0) {
							var new_dec = fx.processDec(rule);
							if (new_dec) {
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

	fx.processDec = function (originalRule, includeAllProperties) {
		var css_array = originalRule.split(";"),
			rules = [], __background = "background";
			
		for (var r = 0; r < css_array.length; r++) {
			
			if (css_array[r].indexOf(":")<0) continue;
			
				var rule = css_array[r].split(":");
				
				if (rule.length != 2) continue;
				
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
					forEach([0, 1, 2, 3], function (i) {
						
						var current_prefix = prefix[i];
						
						if (property == "transition") {
							var trans_prop = value.split(" ")[0];
							if (inArray(trans_prop, prefixed_rules)) {
								new_rules.push(current_prefix + clean_rule.replace(trans_prop, current_prefix + trans_prop));
							} else {
								new_rules.push(current_prefix + clean_rule);
							}

						} else if (property == "transition-property") {
							if (current_prefix == _moz) {
								//Only Firefox supports this at the moment
								var trans_props = value.split(",");
								var replaced_props = [];
								forEach(trans_props, function (p) {
									var prop = str_combo(p);
									if (inArray(prop, prefixed_rules)) {
										replaced_props.push(current_prefix + prop);
									}
								});
								new_rules.push(current_prefix + property + ":" + replaced_props.join(","))
							}
						} else {
							new_rules.push(current_prefix + clean_rule);
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
							//display:box
							forEach([0, 1, 3], function (i) {
								new_rules.push("display:" + prefix[i] + value)
							});
						} else if (value == "inline-block") {
							//display:inline-block
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
						if (value.indexOf(lg)>=0) {
							var attributes = new RegExp(lg+"\\s?\\((.*)\\)","ig").exec(value);
							if(attributes[1]!=null){
								attributes = attributes[1];
								var prop = lg + "("+attributes+")";
								forEach([0, 1, 2, 3], function (i) {
									new_rules.push(property + ":" + prefix[i] + prop);
								});
								var attributes_colors = attributes.match(/\#([a-z0-9]{3,})/g);
								if(attributes_colors && attributes_colors.length>1 && attributes_colors[attributes_colors.length-1]!=null){
									new_rules.push(ms_gradient.replace("{1}",attributes_colors[0]).replace("{2}",attributes_colors[attributes_colors.length-1]));
								}
							}
						} else if (value.indexOf("rgba")>=0) {
							//Color array
							var cA = value.match(/rgba\((.*?)\)/)[1].split(",");
							var hex = Math.floor(+(str_combo(cA[3])) * 255).toString(16) + rgb2hex(+str_combo(cA[0]), +str_combo(cA[1]), +str_combo(cA[2]));
							new_rules.push(ms_gradient.replace("{1}","#"+hex).replace("{2}","#"+hex)+";zoom:1");
						}
						break;
					default:
						if (!!includeAllProperties) {
							new_rules.push(clean_rule);
						}
					break;
					}
				}
			if (new_rules.length) {
				rules.push(new_rules.join(";"));
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

	contentLoaded(fxinit);

})(cssFx);
