/*! CSS3 Finalize - v3.4.0 - 2013-03-29 - Automatically add vendor prefixes. 
* https://github.com/codler/jQuery-Css3-Finalize
* Copyright (c) 2013 Han Lin Yap http://yap.nu; http://creativecommons.org/licenses/by-sa/3.0/ */
(function ($) {
	// Prevent to read twice
	if ($.cssFinalize) {
		return;
	}

	$.cssFinalizeSetup = {
		// Which node CSS3 Finalize should read and add vendor prefixes
		node : 'style,link',
		// If it should add the vendor prefixes
		append : true,
		// This will be called for each nodes after vendor prefixes have been appended
		callback : function(css) {}
	};

	$.fn.cssFinalize = function(options) {
		if (!options || typeof options != 'object') {
			options = {};
		}
		options.node = this;
		$.cssFinalize(options);
		return this;
	};
	
	$.cssFinalize = function(options) {
		var div = document.createElement('div');
		div.style.cssText = 'background-image:linear-gradient(#9f9, white);';

		options = $.extend({}, $.cssFinalizeSetup, options);
		
		var deCamelCase = function(str) {
			return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
		}
		
		// PropertyRules
		var supportRules = [];

		// Get current vendor prefix
		var currentPrefix;
		if (window.getComputedStyle) {
			var styles = getComputedStyle(document.documentElement, null);

			if (styles.length) {
				for(var i = 0; i < styles.length ; i++) {
					if (styles[i].charAt(0) === '-') {
						var pos = styles[i].indexOf('-',1);
						supportRules.push(styles[i].substr(pos+1));

						currentPrefix = styles[i].substr(1, pos-1);
					}
				}
			} else {
				// In Opera CSSStyleDeclaration objects returned by getComputedStyle have length 0
				for(var i in styles) {
					var style = deCamelCase(i);
					if (style.indexOf('-o-') === 0) {
						supportRules.push(style.substr(3));
					}
				}
				currentPrefix = 'o';
			}
		} else {
			// No vendor prefix in <ie 8
			return true;
		}

		// IE9 do have transform but the code above didnt detect it so I added manually
		if (currentPrefix == 'ms' && supportRules.indexOf('transform') === -1) {
			supportRules.push('transform');
			supportRules.push('transform-origin');
		} else if (currentPrefix == 'webkit') {
		// IE9 dont have transition and only webkit need prefixes
		/*
			supportRules.push('animation');
			supportRules.push('marquee');
			supportRules.push('text-stroke');
			supportRules.push('transition');
			supportRules.push('transition-property');
			*/
			for (var i in div.style) {
				if (i.indexOf('webkit') === 0) {
					var style = deCamelCase(i);
					if ($.inArray(style.substr(7), supportRules) === -1) {
						supportRules.push(style.substr(7));
					}
				}
			}
		}
		
		function cssCamelCase(css) {
			var s = $.camelCase(css);
			return (currentPrefix == 'ms') ? s.charAt(0).toLowerCase() + s.substr(1) : s;
		}
		
		function cleanCss(css) {
			// strip multiline comment
			css = css.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g, '');
			
			// remove newline
			css = css.replace(/\n/g, '');
			css = css.replace(/\r/g, '');
			
			// remove @import - Future TODO read if css was imported and parse it.
			css = css.replace(/\@import[^;]*;/g, '');
			
			return css;
		}
		
		function appendStyle(element, cssObj) {
			element.after('<style class="css-finalized" ' + ((element.attr('media') && element.attr('media').length > 0) ? 'media="'+element.attr('media')+'"' : '') + '>' + $.cssFinalize.cssObjToText(cssObj) + '</style>');
		}
		
		function parseFinalize(element, cssText) {
			cssText = cleanCss(cssText);
			if ($.trim(cssText) === '') {
				return;
			}
			
			var objCss = cssTextToObj(cssText);
			
			var cssFinalize = [];
			cssFinalize = addNeededAttributes(objCss);
			function addNeededAttributes(objCss) {
				var cssFinalize = [];
				// Look for needed attributes and add to cssFinalize
				$.each(objCss, function (i, block) {
					if (block.attributes) {
						var neededAttributes = findNeededAttributes(block.attributes);
						if (!$.isEmptyObject(neededAttributes)) {
							cssFinalize.push({
											// Selector Rules
								'selector': selectorRules(block.selector),
								'attributes' : neededAttributes
							});
						} else if (selectorRules(block.selector) != block.selector) {
							cssFinalize.push({
											// Selector Rules
								'selector': selectorRules(block.selector),
								'attributes' : findNeededAttributes(block.attributes, true)
							});
						
						// Recursive
						} else if ((neededAttributes = addNeededAttributes(block.attributes)) && neededAttributes.length > 0) {
							cssFinalize.push({
								'selector': block.selector,
								'attributes' : neededAttributes
							});
						}
					}
				});
				return cssFinalize;
			}

			// Mark as read
			element.addClass('css-finalize-read');
			
			// Append the prefixes
			if (cssFinalize.length > 0 && options.append) {
				appendStyle(element, cssFinalize);
			}
			
			// Callback to user
			if ($.isFunction(options.callback)) {
				options.callback.call(element, cssFinalize);
			}
		}
		
		function cssTextToObj(text) {
			var block = text.split(/({[^{}]*})/);
			
			// fixes recursive block at end
			if (block[block.length-1].indexOf('}') == -1) {
				block.pop();
			}
			var objCss = [];
			var recusiveBlock = false;
			var t;
			var tt = 0;
			var ttt;
			var i = 0;
			while(i < block.length) {
				if (i % 2 === 0) {
					var selector = $.trim(block[i]);
					if (recusiveBlock) {
						if (selector.indexOf('}') != -1) {
							selector = selector.substr(1);
							block[i] = selector;
							
							ttt = block.splice(tt, i - tt);
							ttt.shift();
							ttt.unshift(t[1]);
							objCss[objCss.length-1].attributes = cssTextToObj(ttt.join(''));
							recusiveBlock = false;
							i = tt;
							continue;
						}
					} else {
						
						if (selector.indexOf('{') != -1) {
							t = selector.split('{');
							selector = $.trim(t[0]);
							recusiveBlock = true;
							tt = i;
						}
						if (selector !== "") {
							objCss.push({'selector': selector});
						}
					}
				} else {
					if (!recusiveBlock) {
						objCss[objCss.length-1].attributes = cssTextAttributeToObj(block[i].substr(1, block[i].length-2));
					}
				}
				i++;
			}
			return objCss;
		}
		
		function cssTextAttributeToObj(text) {
			// Data URI fix
			var attribute;
			text = text.replace( /url\(([^)]+)\)/g, function(url){
				return url.replace( /;/g, '[cssFinalize]' );
			});
			attribute = text.split(/(:[^;]*;?)/);
				
			attribute.pop();
			var objAttribute = {};
			$.map(attribute, function(n, i) {
				if (i % 2 == 1) {
					objAttribute[$.trim(attribute[i-1])] = $.trim(n.substr(1).replace(';', '').replace( /url\(([^)]+)\)/g, function(url){
						return url.replace( /\[cssFinalize\]/g, ';' );
					}));
				}
			});
			return objAttribute;
		}
		
		function findNeededAttributes(attributes, returnAll) {
			// attributes is an array only if it is recursive blocks. skip those attributes.
			if ($.isArray(attributes)) {
				if (returnAll) {
					return $.map(attributes, function (n, i) {
						return {
							'selector' : n.selector, 
							'attributes' : findNeededAttributes(n.attributes, returnAll)
						}
					});
				} else {
					return {};
				}
			}
			var newAttributes = {};
			$.each(attributes, function(property, value) {
				var isset = false;
				// Property Rules
				var newProperty = propertyRules(property);
				if (newProperty) {
					isset = true;
					newAttributes[newProperty] = value;
				}
				
				// Value Rules
				var newValue = valuesRules(property, value, newProperty);
				if (newValue) {
					isset = true;
					newAttributes[(newProperty) ? newProperty : property] = newValue;
				}
				
				// PropertyValue Rules
				var newPropertyValue = propertyValuesRules(property, value);
				if (newPropertyValue) {
					isset = true;
					$.each(newPropertyValue, function(key, value) {
						if (key == 'filter' && newAttributes[key]) {
							newAttributes[key] += ' ' + value;
						} else {
							newAttributes[key] = value;
						}
					});
				}
				
				if (returnAll && !isset) {
					newAttributes[property] = value;
				}
			});
			
			return newAttributes;
		}
		
		function propertyRules(property) {
			if ($.inArray(property, supportRules) > -1) {
				// Checks if the property exists in style
				if (!(cssCamelCase(property) in div.style)) {
					// Checks if vendor prefix property exists in style
					if (cssCamelCase('-' + currentPrefix + '-' + property) in div.style) {
						return '-' + currentPrefix + '-' + property;
					}
				}
			}
			return false;
		}
		
		function valuesRules(property, value, newProperty) {
			newProperty = newProperty || property;
			
			if (property == 'transition' ||
				property == 'transition-property') {
				var keys = value.split(/\s?,\s?/);
				var newValue = [];
				$.each(keys, function(keyProperty) {
					var v, t;
					if (property == 'transition') {
						v = keys[keyProperty].split(' ')[0];
					} else {
						v = keys[keyProperty];
					}
					if ((t = propertyRules(v)) !== false) {
						newValue.push(t + keys[keyProperty].substr(v.length));
					} else {
						newValue.push(keys[keyProperty]);
					}
				});
				
				return newValue.join(',');
			}
			
			// Only apply for webkit
			if (currentPrefix == 'webkit') {
				// calc
				if (value.indexOf('calc') === 0) {
					return '-webkit-' + value;
				}
			}
			
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// element - CSS4
				if (value.indexOf('element') === 0) {
					return '-moz-' + value;
				}
			}
			
			if (property == 'display') {
				// flex - Convert newer standard to IE compability
				if (currentPrefix == 'ms' && 'msFlexWrap' in div.style) {
					if (value.indexOf('flex') === 0) {
						return '-ms-flexbox';
					}
					if (value.indexOf('inline-flex') === 0) {
						return '-ms-inline-flexbox';
					}
				}

				if (value.indexOf('grid') === 0 ||
					value.indexOf('inline-grid') === 0 ||
					// Old - IE10 - http://www.w3.org/TR/2012/WD-css3-flexbox-20120322/
					value.indexOf('flexbox') === 0 ||
					value.indexOf('inline-flexbox') === 0 ||
					// W3C Candidate Recommendation, 18 September 2012 - http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/
					value.indexOf('flex') === 0 ||
					value.indexOf('inline-flex') === 0
					) {
					return '-' + currentPrefix + '-' + value;
				}
			}
			
			if (property == 'background' ||
				property == 'background-image') {
				if (value.indexOf('linear-gradient') === 0) {
					// Only for IE9 - border-radius + gradient bug
					// http://stackoverflow.com/questions/4692686/ie9-border-radius-and-background-gradient-bleeding
					if (currentPrefix == 'ms' && div.style.backgroundImage.indexOf('gradient') === -1) {
						// Example
						// value = linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, .5))
						var da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1'),
							dc = [1, 1];
						// da = "rgba(0, 0, 0, 1), rgba(0, 0, 0, .5)"
						if (da.indexOf('rgba') === 0) {
							da = da.split(/rgba\s?\(\s?(.*?)\s?\)/);
							// da = ["", "0, 0, 0, 1", ", ", "0, 0, 0, .5", ""]
							da[1] = da[1].split(/,\s?/);
							da[3] = da[3].split(/,\s?/);
							dc[0] = da[1].pop();
							dc[1] = da[3].pop();
							da = ['rgb(' + da[1].join(',') + ')', 'rgb(' + da[3].join(',') + ')'];
						} else {
							da = da.split(/,\s?/);
						}
						if (da.length == 2) {
							var g = '<svg xmlns="http://www.w3.org/2000/svg" version="1.0"><defs><linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" style="stop-color: ' + da[0] + ';stop-opacity:' + dc[0] + '"/><stop offset="100%" style="stop-color: ' + da[1] + ';stop-opacity:' + dc[1] + '"/></linearGradient></defs><rect x="0" y="0" fill="url(#gradient)" width="100%" height="100%" /></svg>';
							return 'url(data:image/svg+xml,' + escape(g) + ')';
						}
					} else if (currentPrefix == 'webkit') {
						return '-' + currentPrefix + '-' + value;
					}
				} else if (value.indexOf('linear-gradient') > -1) {
					if (currentPrefix == 'webkit') {
						return value.replace(RegExp('(\\s|:|,)(linear-gradient)\\s*\\(', 'gi'), '$1' + '-webkit-' + '$2(');
					}
				}
			}
			
			return false;
		}
		
		// return { property : value }
		function propertyValuesRules(property, value) {
			
			return false;
		}
		
		function selectorRules(selector) {
			switch (currentPrefix) {
				case 'moz' :
					// ::selection
					selector = selector.replace('::selection', '::-moz-selection');
					
					// :input-placeholder
					selector = selector.replace(':input-placeholder', ':-moz-placeholder');
				break;
				case 'webkit' :
					// @keyframes
					selector = selector.replace('@keyframes', '@-webkit-keyframes');
					
					// :input-placeholder
					selector = selector.replace(':input-placeholder', '::-webkit-input-placeholder');
				break;
				case 'ms' :
					// :input-placeholder
					selector = selector.replace(':input-placeholder', ':-ms-input-placeholder');
					
					// @viewport
					selector = selector.replace('@viewport', '@-ms-viewport');
				break;
				case 'o' :
					// @viewport
					selector = selector.replace('@viewport', '@-o-viewport');
				break;
			}
			return selector;
		}
		
		if (!(options.node instanceof jQuery)) {
			options.node = $(options.node);
		}
		
		options.node.each(function(index, element) {
			var $this = $(this);
			if ($this.hasClass('css-finalize-read') || $this.hasClass('css-finalized')) {
				return true;
			}
			// link-tags
			if (this.tagName == 'LINK' && $this.attr('rel') == 'stylesheet') {
				load(this.href, $this);
			} else if(this.tagName == 'TEXTAREA') {
				parseFinalize($this, $this.val());
			} else {
				parseFinalize($this, $this.html());
			}
		});
		
		function load(url, element) {
			var loc = document.location,
				protocol = loc.protocol || "http:";
			var parts = /^(\w+:)\/\/([^\/?#:]+)(?::(\d+))?/.exec( url.toLowerCase() );
			var crossDomain = !!( parts &&
				( parts[ 1 ] != protocol || parts[ 2 ] != loc.hostname ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( loc.port || ( protocol === "http:" ? 80 : 443 ) ) )
			);

			if (crossDomain) {
				return;
			}
			try {
				$('<div />').load(url, function(data) {
					if (data) {
						parseFinalize(element, data);
					}
				});
			} catch(e){}
		}

		var valueRules = 'background background-image transition transition-property'.split(' ');
		$.each(valueRules, function(property) {
			if ($.inArray(valueRules[property], supportRules) === -1) {
				setCssHook(valueRules[property], valueRules[property]);
			}
		});
		
		function setCssHook(property, newProperty) {
			newProperty = cssCamelCase(newProperty);
			$.cssHooks[cssCamelCase(property)] = {
				get: function( elem, computed, extra ) {
					if (!computed) {
						return elem.style[newProperty];
					}
				},
				set: function( elem, value ) {
					var newValue = valuesRules(property, value, newProperty);
					try {
						elem.style[newProperty] = (newValue) ? newValue : value;
					} catch (e) {}

					var newPropertyValue = propertyValuesRules(property, value)
					if (newPropertyValue) {
						$.each(newPropertyValue, function(key, value) {
							try {
								if (key == 'filter' && elem.style[key]) {
									elem.style[key] += ' ' + value;
								} else {
									elem.style[key] = value;
								}
							} catch (e) {}
						});
					}
				}
			};
		}
		
	};
	
	$.cssFinalize.cssObjToText = function(obj, prettyfy, indentLevel) {
		var text = '';
		prettyfy = prettyfy || false;
		indentLevel = indentLevel || 1; 
		$.each(obj, function(i, block) {
			if (prettyfy) text += Array(indentLevel).join('  ');
			text += block.selector + '{';
			if ($.isArray(block.attributes)) {
				if (prettyfy) text += '\r\n' + Array(indentLevel).join('  ');
				text += $.cssFinalize.cssObjToText(block.attributes, prettyfy, indentLevel+1);
			} else {
				$.each(block.attributes, function(property, value) {
					if (prettyfy) text += '\r\n' + Array(indentLevel + 1).join('  ');
					text += property + ':' + value + ';';
				});
				if (prettyfy) text += '\r\n' + Array(indentLevel).join('  ');
			}
			text += '}';
			if (prettyfy) text += '\r\n';
		});
		return text;
	}
	
	$(function() {
		// Let user decide to parse on load or not.
		if (window.cssFinalize!==false) {
			$.cssFinalize();
		}
	});
})(jQuery);