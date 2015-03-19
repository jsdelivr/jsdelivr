/*! JsViews v1.0pre: http://github.com/BorisMoore/jsviews */
/*
* Interactive data-driven views using templates and data-linking.
* Requires jQuery, and jsrender.js (next-generation jQuery Templates, optimized for pure string-based rendering)
*    See JsRender at http://github.com/BorisMoore/jsrender
*
* Copyright 2012, Boris Moore
* Released under the MIT License.
*/
// informal pre beta commit counter: 26

(function(global, $, undefined) {
	// global is the this object, which is window when running in the usual browser environment.
	// $ is the global var jQuery
	"use strict";

	if (!$) {
		// jQuery is not loaded.
		throw "requires jQuery"; // for Beta (at least) we require jQuery
	}

	if (!$.views) {
		// JsRender is not loaded.
		throw "requires JsRender"; // JsRender must be loaded before JsViews
	}

	if (!$.observable) {
		// JsRender is not loaded.
		throw "requires jquery.observable"; // jquery.observable.js must be loaded before JsViews
	}

	if ($.link) { return; } // JsViews is already loaded

	//========================== Top-level vars ==========================

	var versionNumber = "v1.0pre",

		LinkedView, activeBody, $view, rTag, delimOpenChar0, delimOpenChar1, delimCloseChar0, delimCloseChar1, linkChar, validate,
		document = global.document,
		$views = $.views,
		$viewsSub = $views.sub,
		$viewsSettings = $views.settings,
		$extend = $viewsSub.extend,
		FALSE = false, TRUE = true, NULL = null, CHECKBOX = "checkbox",
		topView = $views.View(undefined, "top"), // Top-level view
		$isFunction = $.isFunction,
		$templates = $views.templates,
		$observable = $.observable,
		$observe = $observable.observe,
		jsvAttrStr = "data-jsv",
		$viewsLinkAttr = $viewsSettings.linkAttr || "data-link",        // Allows override on settings prior to loading jquery.views.js
		propertyChangeStr = $viewsSettings.propChng = $viewsSettings.propChng || "propertyChange",// These two settings can be overridden on settings after loading
		arrayChangeStr = $viewsSub.arrChng = $viewsSub.arrChng || "arrayChange",        // jsRender, and prior to loading jquery.observable.js and/or JsViews
		cbBindingsStore = $viewsSub._cbBnds = $viewsSub._cbBnds || {},
		elementChangeStr = "change.jsv",
		onBeforeChangeStr = "onBeforeChange",
		onAfterChangeStr = "onAfterChange",
		onAfterCreateStr = "onAfterCreate",
		closeScript = '"></script>',
		openScript = '<script type="jsv',
		bindElsSel = "script,[" + jsvAttrStr + "]",
		linkViewsSel = bindElsSel + ",[" + $viewsLinkAttr + "]",
		fnSetters = {
			value: "val",
			input: "val",
			html: "html",
			text: "text"
		},
		valueBinding = { from: { fromAttr: "value" }, to: { toAttr: "value"} },
		oldCleanData = $.cleanData,
		oldJsvDelimiters = $viewsSettings.delimiters,
		error = $viewsSub.error,
		syntaxError = $viewsSub.syntaxError,
		rFirstElem = /<(?!script)(\w+)[>\s]/,
		safeFragment = document.createDocumentFragment(),
		qsa = document.querySelector,

		// elContent maps tagNames which have only element content, so may not support script nodes.
		elContent = { ol: 1, ul: 1, table: 1, tbody: 1, thead: 1, tfoot: 1, tr: 1, colgroup: 1, dl: 1, select: 1, optgroup: 1 },

		// wrapMap provide appropriate wrappers for inserting innerHTML, used in insertBefore
		wrapMap = $viewsSettings.wrapMap = {
			option: [ 1, "<select multiple='multiple'>", "</select>" ],
			legend: [ 1, "<fieldset>", "</fieldset>" ],
			thead: [ 1, "<table>", "</table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
			col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
			area: [ 1, "<map>", "</map>" ],
			svg: [1, "<svg>", "</svg>"],
			div: [1, "x<div>", "</div>"] // Needed in IE7 to serialize link tags correctly, insert comments correctly, etc.
		},
		voidElems = {br: 1, img: 1, input: 1, hr: 1, area: 1, base: 1, col: 1, link: 1, meta: 1, command: 1, embed: 1, keygen: 1, param: 1, source: 1, track: 1, wbr: 1},
		displayStyles = {},
		viewStore = { 0: topView },
		bindingStore = {},
		bindingKey = 1,
		rViewPath = /^#(view\.?)?/,
		rConvertMarkers = /(^|(\/>)|(<\/\w+>)|>|)(\s*)([#\/]\d+[_^])`(\s*)(<\w+(?=[\s\/>]))?|\s*(?:(<\w+(?=[\s\/>]))|(<\/\w+>)(\s*)|(\/>)\s*)/g,
		rOpenViewMarkers = /(#)()(\d+)(_)/g,
		rOpenMarkers = /(#)()(\d+)([_^])/g,
		rViewMarkers = /(?:(#)|(\/))(\d+)(_)/g,
		rOpenTagMarkers = /(#)()(\d+)(\^)/g,
		rMarkerTokens = /(?:(#)|(\/))(\d+)([_^])([-+@\d]+)?/g;

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	//========================== Top-level functions ==========================

	//===============
	// Event handlers
	//===============

	function elemChangeHandler(ev) {
		var setter, cancel, fromAttr, linkCtx, sourceValue, cvtBack, cnvtName, target, $source, view, binding, bindings, l,
			source = ev.target, onBeforeChange, onAfterChange,
			to = source._jsvBnd;

		// _jsvBnd is a string with the syntax: "&bindingId1&bindingId2"
		if (to) {
			bindings = to.slice(1).split("&");
			l = bindings.length;
			while (l--) {
				if (binding = bindingStore[bindings[l]]) {
// TODO is it an error when bindingStore[bindings[l]] is undefined. Should we ever get to that state?
					linkCtx = binding.linkCtx;
					view = linkCtx.view;
					if (to = binding.to) {
						// The binding has a 'to' field, which is of the form [[targetObject, toPath], cvtBack]
						$source = $(source);
						onBeforeChange = view.hlp(onBeforeChangeStr);  //TODO improve this for perf optimization. We are calling this every time.
						onAfterChange = view.hlp(onAfterChangeStr);  //TODO improve this for perf optimization. We are calling this every time.
						fromAttr = defaultAttr(source);
						setter = fnSetters[fromAttr];
						sourceValue = $isFunction(fromAttr) ? fromAttr(source) : setter ? $source[setter]() : $source.attr(fromAttr);

						if ((!onBeforeChange || !(cancel = onBeforeChange.call(view, ev) === FALSE)) && sourceValue !== undefined) {
							cnvtName = to[1];
							to = to[0]; // [object, path] or [object, true, path]
							target = to[0];
							to = to[2] || to[1];
							if ($isFunction(cnvtName)) {
								cvtBack = cnvtName;
							} else {
								cvtBack = view.tmpl.converters;
								cvtBack = cvtBack && cvtBack[cnvtName] || $views.converters[cnvtName];
							}
							if (cvtBack) {
								sourceValue = cvtBack.call(linkCtx.tag, sourceValue);
							}
							if (sourceValue !== undefined && target) {
								try {
	// TODO add support for _parameterized_ set() and depends() on computed observables //$observable(target).setProperty(to, sourceValue, args);
	// Consider getting args by a compiled version of linkFn that just returns the current args. args = linkFnArgs.call(linkCtx, target, view, $views);
									if ($isFunction(target)) {
										target = target.set;
										if ($isFunction(target)) {
											target.call(linkCtx, sourceValue);
										}
									} else {
										$observable(target).setProperty(to, sourceValue);
									}
								} catch(e) {
									error(e);
								}
								if (onAfterChange) {  // TODO only call this if the target property changed
									onAfterChange.call(linkCtx, ev);
								}
							}
							//ev.stopPropagation(); // Stop bubbling
						}
						if (cancel) {
							ev.stopImmediatePropagation();
						}
					}
				}
			}
		}
	}

	function propertyChangeHandler(ev, eventArgs, linkFn) {
		var attr, setter, changed, sourceValue, css, tag, ctx, prevNode, nextNode, oldLinkCtx, cancel, skipBinding, tagId, elCnt,
			linkCtx = this,
			source = linkCtx.data,
			target = linkCtx.elem,
			attrOrProp = "attr",
			parentElem = target.parentNode,
			targetElem = parentElem,
			$target = $(target),
			view = linkCtx.view,
			onEvent = view.hlp(onBeforeChangeStr);  //TODO improve this for perf optimization. We are calling this every time.

		if (parentElem && (!onEvent || !(eventArgs && onEvent.call(linkCtx, ev, eventArgs) === FALSE))
				// If data changed, the ev.data is set to be the path. Use that to filter the handler action...
				&& !(eventArgs && ev.data.prop !== "*" && ev.data.prop !== eventArgs.path)) {

			// Set linkCtx on view, dynamically, just during this handler call
			oldLinkCtx = view.linkCtx;
			view.linkCtx = linkCtx;
			if (eventArgs) {
				linkCtx.eventArgs = eventArgs;
			}
			if (eventArgs || linkCtx._initVal) {
				delete linkCtx._initVal;
				sourceValue = linkFn.call(linkCtx, source, view, $views);
				// Compiled link expression for linkTag - call renderTag, etc.

				attr = linkCtx.attr || defaultAttr(target, TRUE); // May have been modified by render
				if (tag = linkCtx.tag) {
					tag.parentElem = tag._elCnt ? target : target.parentNode;
					prevNode = tag._prv;
					nextNode = tag._nxt;
					ctx = tag.ctx;
				}
				if ($isFunction(sourceValue)) {
					error(linkCtx.expr + ": missing parens");
				}

				cancel = attr === "none";
				if (eventArgs && tag && tag.onUpdate) {
					cancel = tag.onUpdate(ev, eventArgs) === FALSE || cancel;
				}
				if (cancel) {
					view.linkCtx = oldLinkCtx;
					return;
				}
				if (attr === "visible") {
					attr = "css-display";
					sourceValue = sourceValue && sourceValue !== "false"
					// Make sure we set the correct display style for showing this particular element ("block", "inline" etc.)
						? getElementDefaultDisplay(target)
						: "none";
				}
				if (css = attr.lastIndexOf("css-", 0) === 0 && attr.substr(4)) {
// Possible optimization for perf on integer values
//					prev = $.style(target, css);
//					if (+sourceValue === sourceValue) {
//						// support using integer data values, e.g. 100 for width:"100px"
//						prev = parseInt(prev);
//					}
//					if (changed = prev !== sourceValue) {
//						$.style(target, css, sourceValue);
//					}
					if (changed = $.style(target, css) !== sourceValue) {
						$.style(target, css, sourceValue);
					}
				} else {
					if (attr === "value") {
						if (target.type === CHECKBOX) {
							sourceValue = sourceValue && sourceValue !== "false";
							attrOrProp = "prop";
							attr = "checked";
							// We will set the "checked" property
							// We will compare this with the current value
						}
					} else if (attr === "radio") {
						// This is a special binding attribute for radio buttons, which corresponds to the default 'to' binding.
						// This allows binding both to value (for each input) and to the default checked radio button (for each input in named group, e.g. binding to parent data).
						// Place value binding first: <input type="radio" data-link="value{:name} {:#get('data').data.currency:} " .../>
						// or (allowing any order for the binding expressions): <input type="radio" value="{{:name}}" data-link="{:#get('data').data.currency:} value^{:name}" .../>

						if (target.value === ("" + sourceValue)) {
							// If the data value corresponds to the value attribute of this radio button input, set the checked property to true
							sourceValue = TRUE;
							attrOrProp = "prop";
							attr = "checked";
						} else {
							// Otherwise, go straight to observeAndBind, without updating.
							// (The browser will remove the 'checked' attribute, when another radio button in the group is checked).
							observeAndBind(linkCtx, linkCtx.data, linkCtx.elem); //TODO ? linkFnArgs);
							view.linkCtx = oldLinkCtx;
							return;
						}
					}

					setter = fnSetters[attr];

					if (setter) {
						if (changed = tag || $target[setter]() !== sourceValue) {
// TODO support for testing whether {^{: or {^{tag have changed or not. Currently always true, since sourceValue has not been converted yet by convertMarkers
							if (attr === "html") {
								if (tag) {
									elCnt = tag._elCnt;
									if (!tag.flow && !tag.render && !tag.template) {
										targetElem = target;
									} else if (tag._.inline) {
										var nodesToRemove = tag.nodes(TRUE);

										if (elCnt && prevNode && prevNode !== nextNode) {
											// This prevNode will be removed from the DOM, so transfer the view tokens on prevNode to nextNode of this 'viewToRefresh'
											tagId = tag._tgId;
											transferViewTokens(prevNode, nextNode, target, tagId, "^", TRUE);
											targetElem = target;
										}
										prevNode = elCnt ? prevNode && prevNode.previousSibling : prevNode;
										// Remove HTML nodes
										$(nodesToRemove).remove();
									} else {
										// data-linked value using converter(s): data-link="{cvt: ... :cvtBack}" or tag: data-link="{tagname ...}"
										// We will insert the tag binding tokens (which will become script node markers, or added tokens on elCnt elements, during view.link() below)
										// We will then skip the observeAndBind call below, since the inserted tag binding replaces that binding
										if (!tag.flow && tag.tagCtx.props.inline) {
											// data-link="{tagname ...}"
											view._.tag = tag;
											sourceValue = addBindingMarkers(sourceValue, view, TRUE);
											skipBinding = tag._.inline = TRUE;
										}

										$target.empty();
										targetElem = target;
									}
								} else {
									// data-linked value: data-link="expr" or data-link="{:expr}" or data-link="{:expr:}" (with no convert or convertBack)
									$target.empty();
									targetElem = target;
								}
								// Data link the new contents of the target node
								if (!skipBinding && tag && tag.onBeforeLink) {
									tag.onBeforeLink();
								}

								view.link(source, targetElem, prevNode, nextNode, sourceValue, tag && {tag: tagId});

								if (skipBinding) {
									// data-linked tag: data-link="{tagname ...}"
									// We will skip the observeAndBind call below, since the inserted tag binding above replaces that binding
									view.linkCtx = oldLinkCtx;
									return;
								}
								tagOnAfterLink(tag);
							} else if (attr === "text" && !target.children[0]) {
								// This code is faster then $target,text()
								if (target.textContent !== undefined) {
									target.textContent = sourceValue;
								} else {
									target.innerText = sourceValue;
								}
							} else {
								$target[setter](sourceValue);
							}
// Removing this for now, to avoid side-effects when you programmatically set the value, and want the focus to stay on the text box
//							if (target.nodeName.toLowerCase() === "input") {
//								$target.blur(); // Issue with IE. This ensures HTML rendering is updated.
//							}
						}
					} else if (changed = $target[attrOrProp](attr) != sourceValue) {
						// Setting an attribute to the empty string or undefined should remove the attribute
						$target[attrOrProp](attr, (sourceValue === undefined || sourceValue === "") && attrOrProp === "attr" ? NULL : sourceValue);
					}
				}

				if (eventArgs && changed && (onEvent = view.hlp(onAfterChangeStr))) {  //TODO improve this for perf optimization. We are calling this view.hlp() every time.
					onEvent.call(linkCtx, ev, eventArgs);
				}
			}
// TODO add support for _parameterized_ set() and depends() on computed observables //$observable(target).setProperty(to, sourceValue, args);
// Consider getting args by a compiled version of linkFn that just returns the current args. args = linkFnArgs.call(linkCtx, target, view, $views);
			observeAndBind(linkCtx, source, target);

			// Remove dynamically added linkCtx from view
			view.linkCtx = oldLinkCtx;
		}
	}

	function arrayChangeHandler(ev, eventArgs) {
		var self = this,
			onBeforeChange = self.hlp(onBeforeChangeStr),  //TODO improve this for perf optimization. We are calling this every time.
			onAfterChange = self.hlp(onAfterChangeStr);  //TODO improve this for perf optimization. We are calling this every time.

		if (!onBeforeChange || onBeforeChange.call(ev, eventArgs) !== FALSE) {
			if (eventArgs) {
				// This is an observable action (not a trigger/handler call from pushValues, or similar, for which eventArgs will be null)
				var action = eventArgs.change,
					index = eventArgs.index,
					items = eventArgs.items;

				switch (action) {
					case "insert":
						self.addViews(index, items);
						break;
					case "remove":
						self.removeViews(index, items.length);
						break;
					case "move":
						self.refresh(); // Could optimize this
						break;
					case "refresh":
						self.refresh();
						break;
						// Othercases: (e.g.undefined, for setProperty on observable object) etc. do nothing
				}
			}
			if (onAfterChange) {
				onAfterChange.call(this, ev, eventArgs);
			}
		}
	}

	//=============================
	// Utilities for event handlers
	//=============================

	function getElementDefaultDisplay(elem) {
		// Get the 'visible' display style for the element
		var testElem, nodeName,
			getComputedStyle = global.getComputedStyle,
			cStyle = (elem.currentStyle || getComputedStyle.call(global, elem, "")).display;

		if (cStyle === "none" && !(cStyle = displayStyles[nodeName = elem.nodeName])) {
			// Currently display: none, and the 'visible' style has not been cached.
			// We create an element to find the correct visible display style for this nodeName
			testElem = document.createElement(nodeName);
			document.body.appendChild(testElem);
			cStyle = (getComputedStyle ? getComputedStyle.call(global, testElem, "") : testElem.currentStyle).display;
			// Cache the result as a hash against nodeName
			displayStyles[nodeName] = cStyle;
			document.body.removeChild(testElem);
		}
		return cStyle;
	}

	function setArrayChangeLink(view) {
		// Add/remove arrayChange handler on view
		var handler,
			data = view.data,
			onArrayChange = view._onArrayChange;

		if (!view._.useKey) {
			// This is an array view. (view._.useKey not defined => data is array)

			if (onArrayChange) {
				// First remove the current handler if there is one
				$([onArrayChange[1]]).off(arrayChangeStr, onArrayChange[0]);
				view._onArrayChange = undefined;
			}

			if (data) {
				// If this view is not being removed, but the data array has been replaced, then bind to the new data array
				handler = function() {
					if (view.data !== undefined) {
						// If view.data is undefined, do nothing. (Corresponds to case where there is another handler on the same data whose
						// effect was to remove this view, and which happened to precede this event in the trigger sequence. So although this
						// event has been removed now, it is still called since already on the trigger sequence)
						arrayChangeHandler.apply(view, arguments);
					}
				};
				$([data]).on(arrayChangeStr, handler);
				view._onArrayChange = [handler, data];
			}
		}
	}

	function defaultAttr(elem, to) {
		// to: true - default attribute for setting data value on HTML element; false: default attribute for getting value from HTML element
		// Merge in the default attribute bindings for this target element
		var nodeName = elem.nodeName.toLowerCase(),
			attr = $viewsSettings.merge[nodeName];
		return attr
			? (to
				? ((nodeName === "input" && elem.type === "radio") // For radio buttons, bind from value, but bind to 'radio' - special value.
					? "radio"
					: attr.to.toAttr)
				: attr.from.fromAttr)
			: to
				? "html" // Default is to bind to innerText. Use text{:...} to bind to innerText
				: ""; // Default is not to bind from
	}

	//==============================
	// Rendering and DOM insertion
	//==============================

	function renderAndLink(view, index, tmpl, views, data, context, refresh) {
		var html, linkToNode, prevView, tag, nodesToRemove,
			parentNode = view.parentElem,
			prevNode = view._prv,
			nextNode = view._nxt,
			elCnt = view._elCnt;

		if (prevNode && prevNode.parentNode !== parentNode) {
			error("Missing parentNode");
			// Abandon, since node has already been removed, or wrapper element has been inserted between prevNode and parentNode
		}

		if (refresh) {
			nodesToRemove = view.nodes();
			if (elCnt && prevNode && prevNode !== nextNode) {
				// This prevNode will be removed from the DOM, so transfer the view tokens on prevNode to nextNode of this 'viewToRefresh'
				transferViewTokens(prevNode, nextNode, parentNode, view._.id, "_", TRUE);
			}

			// Remove child views
			view.removeViews(undefined, undefined, TRUE);

			linkToNode = nextNode;
			prevNode = elCnt ? prevNode && prevNode.previousSibling : prevNode;

			// Remove HTML nodes
			$(nodesToRemove).remove();
		} else { // addViews. Only called if view is of type "array"
			if (index) {
				// index is a number, so indexed view in view array
				prevView = views[index - 1];
				if (!prevView) {
					return FALSE; // If subview for provided index does not exist, do nothing
				}
				prevNode = prevView._nxt;
			}
			if (elCnt) {
				linkToNode = prevNode;
				prevNode = linkToNode
					? linkToNode.previousSibling         // There is a linkToNode, so insert after previousSibling, or at the beginning
					: prevView && parentNode.lastChild;  // If no prevView and no prevNode, index is 0 and there are the container is empty,
					// so prevNode = linkToNode = null. But if prevNode._nxt is null then we set prevNode to parentNode.lastChild
					// (which must be before the prevView) so we insert after that node - and only link the inserted nodes
			} else {
				linkToNode = prevNode.nextSibling;
			}
		}
		html = tmpl.render(data, context, view, refresh || index, view._.useKey && refresh, TRUE);
		// Pass in self._.useKey as test for layout template (which corresponds to when self._.useKey > 0 and self.data is an array)

		tag = view.tag || {};

		// Link the new HTML nodes to the data
		if (tag.onBeforeLink) {
			tag.onBeforeLink();
		}

		view.link(data, parentNode, prevNode, linkToNode, html, prevView);

		tagOnAfterLink(tag);
//}, 0);
	}

	//=====================
	// addBindingMarkers
	//=====================

	function addBindingMarkers(value, view, linked) {
		// Insert binding markers into the rendered template output, which will get converted to appropriate
		// data-jsv attributes (element-only content) or script marker nodes (phrasing or flow content), in convertMarkers,
		// within view.link, prior to inserting into the DOM. Linking will then bind based on these markers in the DOM.
		var id, tag,
			end = (linked ? "^" : "_") + "`";
		if (linked) {
			// This is a binding marker for a data-bound tag {^{...}}
			tag = bindingStore[id = bindingKey++] = view._.tag; // Store the tag temporarily, ready for databinding.
			// During linking, in addDataBinding, the tag will be attached to the linkCtx,
			// and then in observeAndBind, bindingStore[bindId] will be replaced by binding info.
			tag._tgId = "" + id;
		} else {
			// This is a binding marker for a view
			// Add the view to the store of current linked views
			viewStore[id = view._.id] = view;
		}
		// Example: "_#23`TheValue_/23`"
		return "#" + id + end + value + "/" + id + end;
	}

	//==============================
	// Data-linking and data binding
	//==============================

	//---------------
	// observeAndBind
	//---------------

	function observeAndBind(linkCtx, source, target) { //TODO ? linkFnArgs) {;
		var tag, binding, cvtBack, toPath,
			depends = [],
			bindId = linkCtx._bndId || "" + bindingKey++;

		delete linkCtx._bndId;

		if (tag = linkCtx.tag) {
			// Use the 'depends' paths set on linkCtx.tag - which may have been set on declaration or in events: init, render, onBeforeLink, onAfterLink etc.
			depends = tag.depends || depends;
			depends = $isFunction(depends) ? tag.depends() : depends;
			cvtBack = tag.onChange;
		}
		cvtBack = cvtBack || linkCtx._cvtBk;
		if (!linkCtx._depends || ("" + linkCtx._depends !== "" + depends)) {
			// Only bind the first time, or if the new depends (toString) has changed from when last bound
			if (linkCtx._depends) {
				// Unobserve previous binding
				$observe(source, linkCtx._depends, linkCtx._handler, TRUE);
			}
			binding = $observe(source, linkCtx.paths, depends, linkCtx._handler, linkCtx._filter);
			// The binding returned by $observe has a bnd array with the source objects of the individual bindings.
			binding.elem = target; // The target of all the individual bindings
			binding.linkCtx = linkCtx;
			binding._tgId = bindId;
			// Add to the _jsvBnd on the target the view id and binding id - for unbinding when the target element is removed
			target._jsvBnd = target._jsvBnd || "";
			target._jsvBnd += "&" + bindId;
			linkCtx._depends = depends;
			// Store the binding key on the view, for disposal when the view is removed
			linkCtx.view._.bnd[bindId] = bindId;
			// Store the binding.
			bindingStore[bindId] = binding; // Note: If this corresponds to a bound tag, we are replacing the
			// temporarily stored tag by the stored binding. The tag will now be at binding.linkCtx.tag

			if (cvtBack !== undefined) {
				toPath = linkCtx.paths[0].split("^").join("."); // For binding back, bind to the first path in the parsed parameters
				binding.to = [linkCtx._filter(toPath) || [linkCtx.data, toPath], cvtBack];
// TODO binding.to.linkFnArgs = linkFnArgs; - need to compile this to provide args for setters on computed observables?
			}
		}
	}

	//-------
	// $.link
	//-------

	function tmplLink(to, from, context, parentView, prevNode, nextNode) {
		return $link(this, to, from, context, parentView, prevNode, nextNode);
	}

	function $link(tmplOrLinkTag, to, from, context, parentView, prevNode, nextNode) {
		if (tmplOrLinkTag && to) {
			to = to.jquery ? to : $(to); // to is a jquery object or an element or selector

			if (!activeBody) {
				activeBody = document.body;
				$(activeBody).on(elementChangeStr, elemChangeHandler);
			}

			var i, k, html, vwInfos, view, placeholderParent, targetEl,
				onRender = addBindingMarkers,
				replaceMode = context && context.target === "replace",
				l = to.length;

			while (l--) {
				targetEl = to[l];

				if ("" + tmplOrLinkTag === tmplOrLinkTag) {
					// tmplOrLinkTag is a string: treat as data-link expression.
					addDataBinding(tmplOrLinkTag, targetEl, $view(targetEl), from, context);
				} else {
					parentView = parentView || $view(targetEl);

					if (tmplOrLinkTag.markup !== undefined) {
						// This is a call to template.link()
						if (parentView.link === FALSE) {
							context = context || {};
							context.link = onRender = FALSE; // If link=false, don't allow nested context to switch on linking
						}
						// Set link=false, explicitly, to disable linking within a template nested within a linked template
						if (replaceMode) {
							placeholderParent = targetEl.parentNode;
						}

						html = tmplOrLinkTag.render(from, context, parentView, undefined, undefined, onRender);
						// TODO Consider finding a way to bind data (link) within template without html being different for each view, the HTML can
						// be evaluated once  outside the while (l--), and pushed into a document fragment, then cloned and inserted at each target.

						if (placeholderParent) {
							// This is target="replace" mode
							prevNode = targetEl.previousSibling;
							nextNode = targetEl.nextSibling;
							$.cleanData([targetEl], TRUE);
							placeholderParent.removeChild(targetEl);

							targetEl = placeholderParent;
						} else {
							prevNode = nextNode = undefined; // When linking from a template, prevNode and nextNode parameters are ignored
							$(targetEl).empty();
						}
					} else if (tmplOrLinkTag !== TRUE) {
						break;
					}

// TODO Consider deferred linking API feature on per-template basis - {@{ instead of {^{  which allows the user to see the rendered content
// before that content is linked, with better perceived perf. Have view.link return a deferred, and pass that to onAfterLink... or something along those lines.
// setTimeout(function() {

					if (targetEl._dfr && !nextNode) {
						// We are inserting new content and the target element has some deferred binding annotations,and there is no nextNode.
						// Those views may be stale views (that will be recreated in this new linking action) so we will first remove them (if not already removed).
						vwInfos = viewInfos(targetEl._dfr, TRUE, rOpenViewMarkers);

						for (i = 0, k = vwInfos.length; i < k; i++) {
							view = vwInfos[i];
							if ((view = viewStore[view.id]) && view.data !== undefined) {
								// If this is the _prevNode for a view, remove the view
								// - unless view.data is undefined, in which case it is already being removed
								view.parent.removeViews(view._.key, undefined, TRUE);
							}
						}
						targetEl._dfr = "";
					}

					// Link the content of the element, since this is a call to template.link(), or to $(el).link(true, ...),
					parentView.link(from, targetEl, prevNode, nextNode, html);
//}, 0);
				}
			}
		}
		return to; // Allow chaining, to attach event handlers, etc.
	}

	//----------
	// view.link
	//----------

	function viewLink(outerData, parentNode, prevNode, nextNode, html, refresh) {
		// Optionally insert HTML into DOM using documentFragments (and wrapping HTML appropriately).
		// Data-link existing contents of parentNode, or the inserted HTML, if provided

		// Depending on the content model for the HTML elements, the standard data-linking markers inserted in the HTML by addBindingMarkers during
		// template rendering will be converted either to script marker nodes or, for element-only content sections, by data-jsv element annotations.

		// Data-linking will then add _prevNode and _nextNode to views, where:
		//     _prevNode: References the previous node (script element of type "jsv123"), or (for elCnt=true), the first element node in the view
		//     _nextNode: References the last node (script element of type "jsv/123"), or (for elCnt=true), the next element node after the view.

		//==== nested functions ====
		function convertMarkers(all, preceding, selfClose, closeTag, spaceBefore, id, spaceAfter, tag, tag2, closeTag2, spaceAfterClose, selfClose2) {
			//rConvertMarkers = /(^|(\/>)|(<\/\w+>)|>|)(\s*)_([#\/]\d+_)`(\s*)(<\w+(?=[\s\/>]))?|\s*(?:(<\w+(?=[\s\/>]))|(<\/\w+>)(\s*)|(\/>)\s*)/g,
			//                 prec, slfCl, clTag,  spaceBefore, id,    spaceAfter, tag,                   tag2,             clTag2,  sac   slfCl2,
			// Convert the markers that were included by addBindingMarkers in template output, to appropriate DOM annotations:
			// data-jsv attributes (for element-only content) or script marker nodes (within phrasing or flow content).
			var endOfElCnt = "";
			tag = tag || tag2 || "";
			closeTag = closeTag || selfClose || closeTag2 || selfClose2;
			if (closeTag) {
				if (validate && (selfClose || selfClose2) && !voidElems[parentTag]) {
					syntaxError("'<" + parentTag + "... />' in:\n" + html);
				}
				prevElCnt = elCnt;
				parentTag = tagStack.shift();
				elCnt = elContent[parentTag];
				if (prevElCnt && (defer || ids)) {
					// If there are ids (markers since the last tag), move them to the defer string
					defer += ids;
					ids = "";
					if (!elCnt) {
						endOfElCnt = (closeTag2 || "") + openScript + "@" + defer + closeScript + (spaceAfterClose || "");
					}
					defer = elCnt ? (defer + "-") : ""; // Will be used for stepping back through deferred tokens
				}
			}
			if (elCnt) {
				// elContent maps tagNames which have only element content, so may not support script nodes.
				// We are in element-only content, can remove white space, and use data-jsv attributes on elements as markers
				// Example: <tr data-jsv="/2_#6_"> - close marker for view 2 and open marker for view 6

				if (id) {
					// append marker for this id, to ids string
					ids += id;
				} else {
					preceding = (closeTag2 || selfClose2 || "");
				}
				if (tag) {
					preceding += tag;
					if (ids) {
						preceding += ' ' + jsvAttrStr + '="' + ids + '"';
						ids = "";
					}
				}
			} else {
				// We are in phrasing or flow content, so use script marker nodes
				// Example: <script type="jsv3/"></script> - data-bound tag, close marker
				preceding = id
					? (preceding + endOfElCnt + spaceBefore + openScript + id + closeScript + spaceAfter + tag)
					: endOfElCnt || all;
			}
			if (tag) {
				// If there are ids (markers since the last tag), move them to the defer string
				tagStack.unshift(parentTag);
				parentTag = tag.slice(1);
				prevElCnt = elCnt = elContent[parentTag];
// TODO Consider providing validation which throws if you place <span> as child of <tr>, etc. - since if not caught, this can cause errors subsequently which are difficult to bug.
//				if (elContent[tagStack[0]]>2 && !elCnt) {
//					error(parentTag + " in " + tagStack[0]);
//				}
				if (defer && elCnt) {
					defer += "+"; // Will be used for stepping back through deferred tokens
				}
			}
			return preceding;
		}

		function processViewInfos(vwInfos, targetParent) {
			// If targetParent, we are processing viewInfos (which may include navigation through '+-' paths) and hooking up to the right parentElem etc.
			// (and elem may also be defined - the next node)
			// If no targetParent, then we are processing viewInfos on newly inserted content
			var defer, deferChar, bindChar, parentElem, id, onAftCr,
				addedBindEls = [];

			// In elCnt context (element-only content model), prevNode is the first node after the open, nextNode is the first node after the close.
			// If both are null/undefined, then open and close are at end of parent content, so the view is empty, and its placeholder is the
			// 'lastChild' of the parentNode. If there is a prevNode, then it is either the first node in the view, or the view is empty and
			// its placeholder is the 'previousSibling' of the prevNode, which is also the nextNode.
			if (vwInfos) {
				//targetParent = targetParent || targetElem && targetElem.previousSibling;
				//targetParent = targetElem ? targetElem.previousSibling : targetParent;
				len = vwInfos.length;
				if (vwInfos.tokens.charAt(0) === "@") {
					// This is a special script element that was created in convertMarkers() to process deferred bindings, and inserted following the
					// target parent element - because no element tags were encountered to carry those binding tokens.
					targetParent = elem.previousSibling;
					elem.parentNode.removeChild(elem);
					elem = NULL;
				}
				len = vwInfos.length;
				while (len--) {
					vwInfo = vwInfos[len];
					bindChar = vwInfo.ch;
					if (defer = vwInfo.path) {
						// We have a 'deferred path'
						j = defer.length - 1;
						while (deferChar = defer.charAt(j--)) {
							// Use the "+" and"-" characters to navigate the path back to the original parent node where the deferred bindings ocurred
							if (deferChar === "+") {
								if (defer.charAt(j) === "-") {
									j--;
									targetParent = targetParent.previousSibling;
								} else {
									targetParent = targetParent.parentNode;
								}
							} else {
								targetParent = targetParent.lastChild;
							}
							// Note: Can use previousSibling and lastChild, not previousElementSibling and lastElementChild,
							// since we have removed white space within elCnt. Hence support IE < 9
						}
					}
					if (bindChar === "^") {
						if (bindingStore[id = vwInfo.id]) {
							// The binding may have been deleted, for example in a different handler to an array collectionChange event
							// This is a tag binding
							if (vwInfo.elCnt) {
								if (vwInfo.open) {
									if (targetParent) {
										// This is an 'open view' node (preceding script marker node, or if elCnt, the first element in the view, with a data-jsv annotation) for binding
										targetParent._dfr = "#" + id + bindChar + (targetParent._dfr || "");
									}
								} else if (targetParent && (!elem || elem.parentNode !== targetParent)) {
									// There is no ._nxt so add token to _dfr. It is deferred.
									targetParent._dfr = "/" + id + bindChar + (targetParent._dfr || "");
								}
							}

							// This is an open or close marker for a data-bound tag {^{...}}. Add it to bindEls.
							addedBindEls.push([elem, vwInfo]);
						}
					} else if (view = viewStore[id = vwInfo.id]) {
						// The view may have been deleted, for example in a different handler to an array collectionChange event
						if (!view.link) {
							// If view is not already extended for JsViews, extend and initialize the view object created in JsRender, as a JsViews view
							view.parentElem = targetParent || elem && elem.parentNode || parentNode;
							$extend(view, LinkedView);
							view._.onRender = addBindingMarkers;
							setArrayChangeLink(view);
						}
						parentElem = view.parentElem;
						if (vwInfo.open) {
							// This is an 'open view' node (preceding script marker node, or if elCnt, the first element in the view, with a data-jsv annotation) for binding
							view._elCnt = vwInfo.elCnt;
							if (targetParent) {
								targetParent._dfr = "#" + id + bindChar + (targetParent._dfr || "");
							} else {
								// No targetParent, so there is a ._nxt elem (and this is processing tokens on the elem)
								if (!view._prv) {
									parentElem._dfr = removeSubStr(parentElem._dfr, "#" + id + bindChar);
								}
								view._prv = elem;
							}
						} else {
							// This is a 'close view' marker node for binding
							if (targetParent && (!elem || elem.parentNode !== targetParent)) {
								// There is no ._nxt so add token to _dfr. It is deferred.
								targetParent._dfr = "/" + id + bindChar + (targetParent._dfr || "");
								view._nxt = undefined;
							} else if (elem) {
								// This view did not have a ._nxt, but has one now, so token may be in _dfr, and must be removed. (No longer deferred)
								if (!view._nxt) {
									parentElem._dfr = removeSubStr(parentElem._dfr, "/" + id + bindChar);
								}
								view._nxt = elem;
							}
							linkCtx = view.linkCtx;
							if (onAftCr = onAfterCreate || (view.ctx && view.ctx.onAfterCreate)) {
								onAftCr.call(linkCtx, view);
							}
						}
					}
				}
				len = addedBindEls.length;
				while (len--) {
					// These were added in reverse order to addedBindEls. We push them in BindEls in the correct order.
					bindEls.push(addedBindEls[len]);
				}
			}
			return !vwInfos || vwInfos.elCnt;
		}

		function getViewInfos(vwInfos) {
			// Used by view.childTags() and tag.childTags()
			// Similar to processViewInfos in how it steps through bindings to find tags. Only finds data-bound tags.
			var level, parentTag;

			if (len = vwInfos && vwInfos.length) {
				for (j = 0; j < len; j++) {
					vwInfo = vwInfos[j];
					if (get.id) {
						get.id = get.id !== vwInfo.id && get.id;
					} else {
						// This is an open marker for a data-bound tag {^{...}}, within the content of the tag whose id is get.id. Add it to bindEls.
						parentTag = tag = bindingStore[vwInfo.id].linkCtx.tag;
						if (!deep) {
							level = 1;
							while (parentTag = parentTag._.parentTag) {
								level++;
							}
							tagDepth = tagDepth || level; // The level of the first tag encountered.
						}
						if ((deep || level === tagDepth)  && (!tagName || tag.tagName === tagName)) {
							// Filter on top-level or tagName as appropriate
							tags.push(tag);
						}
					}
				}
			}
		}
		//==== /end of nested functions ====

		var linkCtx, tag, i, l, j, len, elems, elem, view, vwInfos, vwInfo, linkInfo, prevNodes, token, prevView, nextView, node, tags, deep, tagName, tagDepth,
			get, depth, fragment, copiedNode, firstTag, parentTag, wrapper, div, tokens, elCnt, prevElCnt, htmlTag, ids, prevIds, found,
			self = this,
			thisId = self._.id + "_",
			defer = "",
			// The marker ids for which no tag was encountered (empty views or final closing markers) which we carry over to container tag
			bindEls = [],
			tagStack = [],
			onAfterCreate = self.hlp(onAfterCreateStr), //TODO improve this for perf optimization. We are calling this every time.
			processInfos = processViewInfos;

		if (refresh) {
			if (refresh.tmpl) {
				// refresh is the prevView, passed in from addViews()
				prevView = "/" + refresh._.id + "_";
			} else {
				get = refresh.get;
				if (refresh.tag) {
					thisId = refresh.tag + "^";
					refresh = TRUE;
				}
			}
			refresh = refresh === TRUE;
		}

		if (get) {
			processInfos = getViewInfos;
			tags = get.tags;
			deep = get.deep;
			tagName = get.name;
		}

		parentNode = parentNode
			? ("" + parentNode === parentNode
				? $(parentNode)[0]  // It is a string, so treat as selector
				: parentNode.jquery
					? parentNode[0]   // A jQuery object - take first element.
					: parentNode)
			: (self.parentElem // view.link()
				|| document.body); // link(null, data) to link the whole document

		parentTag = parentNode.tagName.toLowerCase();
		elCnt = !!elContent[parentTag];

		prevNode = prevNode && markPrevOrNextNode(prevNode, elCnt);
		nextNode = nextNode && markPrevOrNextNode(nextNode, elCnt) || NULL;

		if (html !== undefined) {
			//================ Insert html into DOM using documentFragments (and wrapping HTML appropriately). ================
			// Also convert markers to DOM annotations, based on content model.
			// Corresponds to nextNode ? $(nextNode).before(html) : $(parentNode).html(html);
			// but allows insertion to wrap correctly even with inserted script nodes. jQuery version will fail e.g. under tbody or select.
			// This version should also be slightly faster
			div = document.createElement("div");
			wrapper = div;
			prevIds = ids = "";
			htmlTag = parentNode.namespaceURI === "http://www.w3.org/2000/svg" ? "svg" : (firstTag = rFirstElem.exec(html)) && firstTag[1] || "";

			if (elCnt) {
				// Now look for following view, and find its tokens, or if not found, get the parentNode._dfr tokens
				node = nextNode;
				while (node && !(nextView = viewInfos(node))) {
					node = node.nextSibling;
				}
				if (tokens = nextView ? nextView.tokens : parentNode._dfr) {
					token = prevView || "";
					if (refresh || !prevView) {
						token += "#" + thisId;
					}
					j = tokens.indexOf(token);
					if (j + 1) {
						j += token.length;
						// Transfer the initial tokens to inserted nodes, by setting them as the ids variable, picked up in convertMarkers
						prevIds = ids = tokens.slice(0, j);
						tokens = tokens.slice(j);
						if (nextView) {
							node.setAttribute(jsvAttrStr, tokens);
						} else {
							parentNode._dfr = tokens;
						}
					}
				}
			}

			//================ Convert the markers to DOM annotations, based on content model. ================
//			oldElCnt = elCnt;
			html = html.replace(rConvertMarkers, convertMarkers);
//			if (!!oldElCnt !== !!elCnt) {
//				error("Parse: " + html); // Parse error. Content not well-formed?
//			}
			// Append wrapper element to doc fragment
			safeFragment.appendChild(div);

			// Go to html and back, then peel off extra wrappers
			// Corresponds to jQuery $(nextNode).before(html) or $(parentNode).html(html);
			// but supports svg elements, and other features missing from jQuery version (and this version should also be slightly faster)
			htmlTag = wrapMap[htmlTag] || wrapMap.div;
			depth = htmlTag[0];
			wrapper.innerHTML = htmlTag[1] + html + htmlTag[2];
			while (depth--) {
				wrapper = wrapper.lastChild;
			}
			safeFragment.removeChild(div);
			fragment = document.createDocumentFragment();
			while (copiedNode = wrapper.firstChild) {
				fragment.appendChild(copiedNode);
			}
			// Insert into the DOM
			parentNode.insertBefore(fragment, nextNode);
		}

		//================ Data-link and fixup of data-jsv annotations ================
		elems = qsa ? parentNode.querySelectorAll(linkViewsSel) : $(linkViewsSel, parentNode).get();
		l = elems.length;

		// The prevNode will be in the returned query, since we called markPrevOrNextNode() on it.
		// But it may have contained nodes that satisfy the selector also.
		if (prevNode) {
			// Find the last contained node one to use as the prevNode - so we only link subsequent elems in the query
			prevNodes = qsa ? prevNode.querySelectorAll(linkViewsSel) : $(linkViewsSel, prevNode).get();
			prevNode = prevNodes.length ? prevNodes[prevNodes.length - 1] : prevNode;
		}
		tagDepth = 0;
		for (i = 0; i < l; i++) {
			elem = elems[i];
			if (prevNode && !found) {
				// If prevNode is set, not false, skip linking. If this element is the prevNode, set to false so subsequent elements will link.
				found = (elem === prevNode);
			} else if (nextNode && elem === nextNode) {
				// If nextNode is set then break when we get to nextNode
				break;
			} else if (elem.parentNode
				// elem has not been removed from DOM
					&& processInfos(viewInfos(elem, undefined, tags && rOpenTagMarkers))
					// If a link() call, processViewInfos() adds bindings to bindEls, and returns true for non-script nodes, for adding data-link bindings
					// If a childTags() call getViewInfos adds tag bindings to tags array.
						&& elem.getAttribute($viewsLinkAttr)) {
							// processViewInfos(viewInfos(elem)) returns true if elem is not a script node, and we add data-link bindings to bindEls.
							bindEls.push([elem]);
						}
		}

		// Remove temporary marker script nodes they were added by markPrevOrNextNode
		unmarkPrevOrNextNode(prevNode, elCnt);
		unmarkPrevOrNextNode(nextNode, elCnt);

		if (get) {
			return;
		}

		if (elCnt && defer + ids) {
			// There are some views with elCnt, for which the open or close did not precede any HTML tag - so they have not been processed yet
			elem = nextNode;
			if (defer) {
				if (nextNode) {
					processViewInfos(viewInfos(defer + "+", TRUE), nextNode);
				} else {
					processViewInfos(viewInfos(defer, TRUE), parentNode);
				}
			}
			processViewInfos(viewInfos(ids, TRUE), parentNode);
			// If there were any tokens on nextNode which have now been associated with inserted HTML tags, remove them from nextNode
			if (nextNode) {
				tokens = nextNode.getAttribute(jsvAttrStr);
				if (l = tokens.indexOf(prevIds) + 1) {
					tokens = tokens.slice(l + prevIds.length - 1);
				}
				nextNode.setAttribute(jsvAttrStr, ids + tokens);
			}
		}

		//================ Bind the data-link elements, and the data-bound tags ================
		l = bindEls.length;
		for (i = 0; i < l; i++) {
			elem = bindEls[i];
			linkInfo = elem[1];
			elem = elem[0];
			if (linkInfo) {
				tag = bindingStore[linkInfo.id];
				tag = tag.linkCtx ? tag.linkCtx.tag : tag;
				// The tag may have been stored temporarily on the bindingStore - or may have already been replaced by the actual binding
				if (linkInfo.open) {
					// This is an 'open bound tag' script marker node for a data-bound tag {^{...}}
					tag.parentElem = elem.parentNode;
					tag._prv = elem;
					tag._elCnt = linkInfo.elCnt;
					if (tag && tag.onBeforeLink) {
						tag.onBeforeLink();
					}
				} else {
					// This is a 'close bound tag' script marker node
					// Add data binding
					view = tag.tagCtx.view;
					tag._nxt = elem;
					tagOnAfterLink(tag);
					addDataBinding(undefined, tag._prv, view, view.data||outerData, linkInfo.id);
				}
			} else {
				view = $view(elem);
				// Add data binding for a data-linked element (with data-link attribute)
				addDataBinding(elem.getAttribute($viewsLinkAttr), elem, view, view.data||outerData);
			}
		}
	}

	function addDataBinding(linkMarkup, node, currentView, data, boundTagId) {
		// Add data binding for data-linked elements or {^{...}} data-bound tags
		var tmplLinks, tokens, attr, convertBack, params, trimLen, tagExpr, linkFn, linkCtx, tag, rTagIndex;

		if (boundTagId) {
			// {^{...}} bound tag. So only one linkTag in linkMarkup
			tag = bindingStore[boundTagId];
			tag = tag.linkCtx ? tag.linkCtx.tag : tag;
			// The tag may have been stored temporarily on the bindingStore - or may have already been replaced by the actual binding
			linkMarkup = delimOpenChar1 + tag.tagName + " " + tag.tagCtx.params + delimCloseChar0;
		}
		if (linkMarkup && node) {
			// Compiled linkFn expressions are stored in the tmpl.links array of the template
			// TODO - consider also caching globally so that if {{:foo}} or data-link="foo" occurs in different places,
			// the compiled template for this is cached and only compiled once...
			//links = currentView.links || currentView.tmpl.links;

			tmplLinks = currentView.tmpl.links;

//			if (!(linkTags = links[linkMarkup])) {
				// This is the first time this view template has been linked, so we compile the data-link expressions, and store them on the template.

				linkMarkup = normalizeLinkTag(linkMarkup, node);
				rTag.lastIndex = 0;
				while (tokens = rTag.exec(linkMarkup)) { // TODO require } to be followed by whitespace or $, and remove the \}(!\}) option.
					// Iterate over the data-link expressions, for different target attrs,
					// (only one if there is a boundTagId - the case of data-bound tag {^{...}})
					// e.g. <input data-link="{:firstName:} title{>~description(firstName, lastName)}"
					// tokens: [all, attr, bindOnly, tagExpr, tagName, converter, colon, html, comment, code, params]
					rTagIndex = rTag.lastIndex;
					attr = boundTagId ? "html" : tokens[1]; // Script marker nodes are associated with {^{ and always target HTML.
// Make {^{ default to 'innerText', and let {^html{ target html. This will be consistent with data-link="html{:...}"
					tagExpr = tokens[3];
					params = tokens[10];
					convertBack = undefined;

					linkCtx = {
						data: data,             // source
						elem: tag && tag._elCnt ? tag.parentElem : node,             // target
						view: currentView,
						attr: attr,
						_initVal: !boundTagId && !tokens[2]
					};

					if (tokens[6]) {
						// TODO include this in the original rTag regex
						// Only for {:} link"

						if (!attr && (convertBack = /^.*:([\w$]*)$/.exec(params))) {
							// two-way binding
							convertBack = convertBack[1];
							if (convertBack !== undefined) {
								// There is a convertBack function
								trimLen = - convertBack.length -1;
								tagExpr = tagExpr.slice(0, trimLen - 1) + delimCloseChar0; // Remove the convertBack string from expression.
								params = params.slice(0, trimLen);
							}
						}
						if (convertBack === NULL) {
							convertBack = undefined;
						}
					}
					// Compile the linkFn expression which evaluates and binds a data-link expression
					// TODO - optimize for the case of simple data path with no conversion, helpers, etc.:
					//     i.e. data-link="a.b.c". Avoid creating new instances of Function every time. Can use a default function for all of these...

					if (boundTagId) {
						linkCtx.tag = tag; // Add tag to linkCtx.
						// Pass the boundTagId in the linkCtx, so that it can be picked up in observeAndBind
						linkCtx._bndId = boundTagId;
						// In observeAndBind the bound tag temporarily stored in the viewStore will be replaced with
						// the full binding information, and the bindingId will be added to view._.bnd
					}
					linkCtx.expr = attr + tagExpr;
					linkFn = tmplLinks[tagExpr]
						= tmplLinks[tagExpr] || $viewsSub.tmplFn(delimOpenChar0 + tagExpr + delimCloseChar1, undefined, TRUE, convertBack);
//TODO consider a specialized mode of tmpFn which compiles these data-link target expressions (which are always a single term in the compiled template, since they
// correspond to a single tag expression "attr{...}") so that the return type is not converted to string: using return t(...), rather than ret+=t(...);return ret;
// This will allow targets like visible to support visible{:name} or visible{:people.length}, rather than having to force a pure boolean, as in visible(:!!name}.
// This could help with future attr targets such as click{} which would return an onClick function, not a string, to the target click handler.
					$viewsSub.parse(params, linkFn.paths = linkCtx.paths = []);

					if (!attr && convertBack !== undefined) {
						// Default target, so allow 2 way binding
						linkCtx._cvtBk = convertBack;
					}

					bindDataLinkTarget(linkCtx, linkFn);
					// We store rTagIndex in local scope, since this addDataBinding method can sometimes be called recursively, and each is using the same rTag instance.
					rTag.lastIndex = rTagIndex;
				}
	//		}
		}
	}

	function bindDataLinkTarget(linkCtx, linkFn) {
		// Add data link bindings for a link expression in data-link attribute markup

		function handler(ev, eventArgs) {
			propertyChangeHandler.call(linkCtx, ev, eventArgs, linkFn);
			// If the link expression uses a custom tag, the propertyChangeHandler call will call renderTag, which will set tagCtx on linkCtx
		}

		linkCtx._filter = filterHelperStrings(linkCtx); // _filter is for filtering dependency paths: function(path, object) { return [(object|path)*]}
		linkCtx._handler = handler;
		handler();
	}

	//=====================
	// Data-linking helpers
	//=====================

	function removeSubStr(str, substr) {
		var k;
		return str
			? (k = str.indexOf(substr),
				(k + 1
					? str.slice(0, k) + str.slice(k + substr.length)
					: str))
			: "";
	}

	function markerNodeInfo(node) {
		return node &&
			("" + node === node
				? node
				: node.tagName === "SCRIPT"
					? node.type.slice(3)
					: node.nodeType === 1 && node.getAttribute(jsvAttrStr) || "");
	}

	function viewInfos(node, isVal, rBinding) {
		// Test whether node is a script marker nodes, and if so, return metadata
		// If tagBinding, return true if last info is an open tag binding: "#^nnn"
		function getInfos(all, open, close, id, ch, elPath) {
			infos.push({
				elCnt: elCnt,
				id: id,
				ch: ch,
				open: open,
				close: close,
				path: elPath
			});
		}
		var elCnt, tokens,
			infos = [];
		if (tokens = isVal ? node : markerNodeInfo(node)) {
			infos.elCnt = !node.type;
			elCnt = tokens.charAt(0) === "@" || !node.type;
			infos.tokens = tokens;
			// rMarkerTokens = /(?:(#)|(\/))(\d+)([_^])([-+@\d]+)?/g;
			tokens.replace(rBinding || rMarkerTokens, getInfos);
			return infos;
		}
	}

	function unmarkPrevOrNextNode(node, elCnt) {
		if (node) {
			if (node.type === "jsv") {
				node.parentNode.removeChild(node);
			} else if (elCnt && node.getAttribute($viewsLinkAttr) === "") {
				node.removeAttribute($viewsLinkAttr);
			}
		}
	}

	function markPrevOrNextNode(node, elCnt) {
		var marker = node;
		while (elCnt && marker && marker.nodeType !== 1) {
			marker = marker.previousSibling;
		}
		if (marker) {
			if (marker.nodeType !== 1) {
				// For text nodes, we will add a script node before
				marker = document.createElement("SCRIPT");
				marker.type = "jsv";
				node.parentNode.insertBefore(marker, node);
			} else if (!markerNodeInfo(marker) && !marker.getAttribute($viewsLinkAttr)) {
				// For element nodes, we will add a data-link attribute (unless there is already one) so that this node gets included in the node linking process.
				marker.setAttribute($viewsLinkAttr, "");
			}
		}
		return marker;
	}

	function normalizeLinkTag(linkMarkup, node) {
		linkMarkup = $.trim(linkMarkup);
		return linkMarkup.slice(-1) !== delimCloseChar0
		// If simplified syntax is used: data-link="expression", convert to data-link="{:expression}",
		// or for inputs, data-link="{:expression:}" for (default) two-way binding
			? linkMarkup = delimOpenChar1 + /*linkChar +*/ ":" + linkMarkup + (defaultAttr(node) ? ":" : "") + delimCloseChar0
			: linkMarkup;
	}

	function tagOnAfterLink(tag) {
		// Add nodes() and contents() methods, and call onAfterLink() if defined.
		if (tag) {
			tag.contents = getContents;
			tag.nodes = getNodes;
			tag.childTags = getChildTags;
			if (tag.onAfterLink) {
				tag.onAfterLink();
			}
		}
	}

	//===========================
	// Methods for views and tags
	//===========================

	function getContents(select, deep) {
		// For a view or a tag, return jQuery object with the content nodes,
		var filtered,
			nodes = $(this.nodes());
		if (nodes[0]) {
			filtered = select ? nodes.filter(select) : nodes;
			nodes = deep && select ? filtered.add(nodes.find(select)) : filtered;
		}
		return nodes;
	}

	function getNodes(withMarkers, prevNode, nextNode) {
		// For a view or a tag, return top-level nodes
		// Do not return any script marker nodes, unless withMarkers is true
		// Optionally limit range, by passing in prevNode or nextNode parameters

		var node,
			self = this,
			elCnt = self._elCnt,
			prevIsFirstNode = !prevNode && elCnt,
			nodes = [];

		prevNode = prevNode || self._prv;
		nextNode = nextNode || self._nxt;

		node = prevIsFirstNode
			? (prevNode === self._nxt
				? self.parentElem.lastSibling
				: prevNode)
			: (self._.inline === FALSE
				? prevNode || self.linkCtx.elem.firstChild
				: prevNode && prevNode.nextSibling);

		while (node && (!nextNode || node !== nextNode)) {
			if (withMarkers || elCnt || !markerNodeInfo(node)) {
				// All the top-level nodes in the view
				// (except script marker nodes, unless withMarkers = true)
				// (Note: If a script marker node, viewInfo.elCnt undefined)
				nodes.push(node);
			}
			node = node.nextSibling;
		}
		return nodes;
	}

	function getChildTags(deep, tagName) {
		// For a view or a tag, return child tags - at any depth, or as immediate children only.
		if (deep !== !!deep) {
			// inner not boolean, so this is childTags(tagName) - which looks for top-level tags of given tagName
			tagName = deep;
			deep = undefined;
		}

		var self = this,
			view = self.link ? self : self.tagCtx.view, // this may be a view or a tag. If a tag, get the view from tag.view.tagCtx
			prevNode = self._prv,
			elCnt = self._elCnt,
			tags = [];

		if (prevNode) {
			view.link(
				undefined,
				self.parentElem,
				elCnt ? prevNode.previousSibling : prevNode,
				self._nxt,
				undefined,
				{get:{tags:tags, deep: deep, name: tagName, id: elCnt && self._tgId}}
			);
		}
		return tags;
	}

	//=========
	// Disposal
	//=========

	function clean(elems) {
		// Remove data-link bindings, or contained views
		var i, j, l, l2, elem, vwInfos, vwItem, bindings,
			elemArray = [];
		for (i = 0; elem = elems[i]; i++) {
			// Copy into an array, so that deletion of nodes from DOM will not cause our 'i' counter to get shifted
			// (Note: This seems as fast or faster than elemArray = [].slice.call(elems); ...)
			elemArray.push(elem);
		}
		for (i = 0; elem = elemArray[i]; i++) {
			if (elem.parentNode) {
				// Has not already been removed from the DOM
				if (bindings = elem._jsvBnd) {
					// Get propertyChange bindings for this element
					// This may be an element with data-link, or the opening script marker node for a data-bound tag {^{...}}
					// bindings is a string with the syntax: "(&bindingId)*"
					bindings = bindings.slice(1).split("&");
					elem._jsvBnd = "";
					l = bindings.length;
					while (l--) {
						// Remove associated bindings
						removeViewBinding(bindings[l], TRUE); // unbind bindings with this bindingId on this view
					}
				}
				if (vwInfos = viewInfos(markerNodeInfo(elem) + (elem._dfr || ""), TRUE, rOpenMarkers)) {
					for (j = 0, l2 = vwInfos.length; j < l2; j++) {
						vwItem = vwInfos[j];
						if (vwItem.ch === "_") {
							if ((vwItem = viewStore[vwItem.id]) && vwItem.data !== undefined) {
								// If this is the _prevNode for a view, remove the view
								// - unless view.data is undefined, in which case it is already being removed
								vwItem.parent.removeViews(vwItem._.key, undefined, TRUE);
							}
						} else {
							removeViewBinding(vwItem.id, TRUE); // unbind bindings with this bindingId on this view
						}
					}
				}
			}
		}
	}

	function removeViewBinding(bindId, keepNodes) {
		// Unbind
		var objId, linkCtx, tag, object,
			binding = bindingStore[bindId];
		if (binding) {
			for (objId in binding.bnd) {
				$($.isArray(object = binding.bnd[objId]) ? [object] : object).off(propertyChangeStr + ".obs" + binding.cbId);
				delete binding.bnd[objId];
			}

			linkCtx = binding.linkCtx;
			if (tag = linkCtx.tag) {
				if (tag.onDispose) {
					tag.onDispose();
				}
				if (!keepNodes && !tag._elCnt) {
					tag._prv.parentNode.removeChild(tag._prv);
					tag._nxt.parentNode.removeChild(tag._nxt);
				}
			}
			delete linkCtx.view._.bnd[bindId];
			delete bindingStore[bindId]
			delete $viewsSub._cbBnds[binding.cbId];
		}
	}

	function $unlink(tmplOrLinkTag, to) {
		if (!arguments.length) {
			// Call to $.unlink() is equivalent to $.unlink(TRUE, "body")
			if (activeBody) {
				$(activeBody).off(elementChangeStr, elemChangeHandler);
				activeBody = undefined;
			}
			tmplOrLinkTag = TRUE;
			topView.removeViews();
			clean(document.body.getElementsByTagName("*"));
		} else if (to) {
			to = to.jquery ? to : $(to); // to is a jquery object or an element or selector
			if (tmplOrLinkTag === TRUE) {
				// Call to $(el).unlink(TRUE) - unlink content of element, but don't remove bindings on element itself
				$.each(to, function() {
					var innerView;
					// TODO fix this for better perf. Rather that calling inner view multiple times which does querySelect each time, consider a single querySelectAll
					// or simply call view.removeViews() on the top-level views under the target 'to' node, then clean(...)
					while ((innerView = $view(this, TRUE)) && innerView.parent) {
						innerView.parent.removeViews(innerView._.key, undefined, TRUE);
					}
					clean(this.getElementsByTagName("*"));
				});
			} else if (tmplOrLinkTag === undefined) {
				// Call to $(el).unlink()
				clean(to);
// TODO provide this unlink API
//			} else if ("" + tmplOrLinkTag === tmplOrLinkTag) {
//				// Call to $(el).unlink(tmplOrLinkTag ...)
//				$.each(to, function() {
//					...
//				});
			}
// TODO - unlink the content and the arrayChange, but not any other bindings on the element (if container rather than "replace")
		}
		return to; // Allow chaining, to attach event handlers, etc.
	}

	function tmplUnlink(to, from) {
		return $unlink(this, to, from);
	}

	//========
	// Helpers
	//========

	function filterHelperStrings(linkCtx) {
		// TODO Consider exposing or allowing override, as public API
		return function(path, object) {
			// TODO consider only calling the filter on the initial token in path '~a.b.c' and not calling again on
			// the individual tokens, 'a', 'b', 'c'...  Currently it is called multiple times
			var tokens,
				tag = linkCtx.view.ctx;
			if (path) {
				if (path.charAt(0) === "~") {
					// We return new items to insert into the sequence, replacing the "~a.b.c" string: [helperObject 'a', "a.b.c" currentDataItem] so currentDataItem becomes the object for subsequent paths.
					if (path.slice(0, 4) === "~tag") {
						if (path.charAt(4) === ".") {
							// "~tag.xxx"
							tokens = path.slice(5).split(".");
							tag = tag.tag;
						} else if (path.slice(4, 6) === "s.") {
							// "~tags.xxx"
							tokens = path.slice(6).split(".");
							tag = tag.tags[tokens.shift()];
						}
						if (tokens) {
							return tag ? [tag, tokens.join("."), object] : [];
						}
					}
					path = path.slice(1).split(".");
					return [linkCtx.view.hlp(path.shift()), path.join("."), object];
				}
				if (path.charAt(0) === "#") {
					// We return new items to insert into the sequence, replacing the "#a.b.c" string: [view, "a.b.c" currentDataItem]
					// so currentDataItem becomes the object for subsequent paths. The 'true' flag makes the paths bind only to leaf changes.
					return path === "#data" ? [] :[linkCtx.view, path.replace(rViewPath, ""), object];
				}
			}
		};
	}

	function inputAttrib(elem) {
		return elem.type === CHECKBOX ? elem.checked : elem.value;
	}

	function getTemplate(tmpl) {
		// Get nested templates from path
		if ("" + tmpl === tmpl) {
			var tokens = tmpl.split("[");
			tmpl = $templates[tokens.shift()];
			while (tmpl && tokens.length) {
				tmpl = tmpl.tmpls[tokens.shift().slice(0, -1)];
			}
		}
		return tmpl;
	}

	//========================== Initialize ==========================

	//=====================
	// JsRender integration
	//=====================

	$viewsSub.onStoreItem = function(store, name, item) {
		if (item && store === $templates) {
			item.link = tmplLink;
			item.unlink = tmplUnlink;
			if (name) {
				$.link[name] = function() {
					return tmplLink.apply(item, arguments);
				};
				$.unlink[name] = function() {
					return tmplUnlink.apply(item, arguments);
				};
			}
		}
	};

	// Initialize default delimiters
	($viewsSettings.delimiters = function() {
		var delimChars = oldJsvDelimiters.apply($views, arguments);
		delimOpenChar0 = delimChars[0];
		delimOpenChar1 = delimChars[1];
		delimCloseChar0 = delimChars[2];
		delimCloseChar1 = delimChars[3];
		linkChar = delimChars[4];
		rTag = new RegExp("(?:^|\\s*)([\\w-]*)(\\" + linkChar + ")?(\\" + delimOpenChar1 + $viewsSub.rTag + "\\" + delimCloseChar0 + ")", "g");

		// Default rTag:      attr  bind tagExpr   tag         converter colon html     comment            code      params
		//          (?:^|\s*)([\w-]*)(\^)?({(?:(?:(\w+(?=[\/\s}]))|(?:(\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\*)))\s*((?:[^}]|}(?!}))*?))})
		return this;
	})();

	//===============
	// Public helpers
	//===============

	$viewsSub.viewInfos = viewInfos;
	// Expose viewInfos() as public helper method

	//====================================
	// Additional members for linked views
	//====================================

	function transferViewTokens(prevNode, nextNode, parentElem, id, viewOrTagChar, refresh) {
		// Transfer tokens on prevNode of viewToRemove/viewToRefresh to nextNode or parentElem._dfr
		var i, l, vwInfos, vwInfo, viewOrTag, viewId, tokens,
			precedingLength = 0,
			emptyView = prevNode === nextNode;

		if (prevNode) {
			// prevNode is either the first node in the viewOrTag, or has been replaced by the vwInfos tokens string
			vwInfos = viewInfos(prevNode) || [];
			for (i = 0, l = vwInfos.length; i < l; i++) {
				// Step through views or tags on the prevNode
				vwInfo = vwInfos[i];
				viewId = vwInfo.id;
				if (viewId === id) {
					if (refresh) {
						// This is viewOrTagToRefresh, this is the last viewOrTag to process...
						l = 0;
					} else {
						// This is viewOrTagToRemove, so we are done...
						break;
					}
				}
				if (!emptyView) {
					viewOrTag = vwInfo.ch === "_"
						? viewStore[viewId]
						: bindingStore[viewId].linkCtx.tag;
					if (vwInfo.open) {
						// A "#m" token
						viewOrTag._prv = nextNode;
					} else if (vwInfo.close) {
						// A "/m" token
						viewOrTag._nxt = nextNode;
					}
				}
				precedingLength += viewId.length + 2;
			}

			if (precedingLength) {
				prevNode.setAttribute(jsvAttrStr, prevNode.getAttribute(jsvAttrStr).slice(precedingLength));
			}
			tokens = nextNode ? nextNode.getAttribute(jsvAttrStr) : parentElem._dfr;
			if (l = tokens.indexOf("/" + id + viewOrTagChar) + 1) {
				tokens = vwInfos.tokens.slice(0, precedingLength) + tokens.slice(l + (refresh ? -1 : id.length + 1));
			}
			if (tokens) {
				if (nextNode) {
					// If viewOrTagToRemove was an empty viewOrTag, we will remove both #n and /n (and any intervening tokens) from the nextNode (=== prevNode)
					// If viewOrTagToRemove was not empty, we will take tokens preceding #n from prevNode, and concatenate with tokens following /n on nextNode
					nextNode.setAttribute(jsvAttrStr, tokens);
				} else {
					parentElem._dfr = tokens;
				}
			}
		} else {
			// !prevNode, so there may be a deferred nodes token on the parentElem. Remove it.
			parentElem._dfr = removeSubStr(parentElem._dfr, "#" + id + viewOrTagChar);
			if (!refresh && !nextNode) {
				// If this viewOrTag is being removed, and there was no .nxt, remove closing token from deferred tokens
				parentElem._dfr = removeSubStr(parentElem._dfr, "/" + id + viewOrTagChar);
			}
		}
	}

	LinkedView = {
		// Note: a linked view will also, after linking have nodes[], _prevNode, _nextNode ...
		addViews: function(index, dataItems, tmpl) {
			// if view is not an array view, do nothing
			var i, viewsCount,
				self = this,
				itemsCount = dataItems.length,
				views = self.views;

			if (!self._.useKey && itemsCount && (tmpl = getTemplate(tmpl || self.tmpl))) {
				// view is of type "array"
				// Use passed-in template if provided, since self added view may use a different template than the original one used to render the array.
				viewsCount = views.length + itemsCount;

				if (renderAndLink(self, index, tmpl, views, dataItems, self.ctx) !== FALSE) {
					for (i = index + itemsCount; i < viewsCount; i++) {
						$observable(views[i]).setProperty("index", i);
						//This is fixing up index, but not key, and not index on child views. From child views, use view.get("item").index.
					}
				}
			}
			return self;
		},

		removeViews: function(index, itemsCount, keepNodes) {
			// view.removeViews() removes all the child views
			// view.removeViews( index ) removes the child view with specified index or key
			// view.removeViews( index, count ) removes the specified nummber of child views, starting with the specified index
			function removeView(index) {
				var id, bindId, parentElem, prevNode, nextNode, nodesToRemove,
					viewToRemove = views[index];

				if (viewToRemove) {
					id = viewToRemove._.id;
					if (!keepNodes) {
						// Remove the HTML nodes from the DOM, unless they have already been removed, including nodes of child views
						nodesToRemove = viewToRemove.nodes();
					}

					// Remove child views, without removing nodes
					viewToRemove.removeViews(undefined, undefined, TRUE);

					viewToRemove.data = undefined; // Set data to undefined: used as a flag that this view is being removed
					prevNode = viewToRemove._prv;
					nextNode = viewToRemove._nxt;
					parentElem = viewToRemove.parentElem;
					// If prevNode and nextNode are the same, the view is empty
					if (!keepNodes) {
						// Remove the HTML nodes from the DOM, unless they have already been removed, including nodes of child views
						if (viewToRemove._elCnt) {
							// if keepNodes is false (and transferring of tokens has not already been done at a higher level)
							// then transfer tokens from prevNode which is being removed, to nextNode.
							transferViewTokens(prevNode, nextNode, parentElem, id, "_");
						}
						$(nodesToRemove).remove();
					}
					if (!viewToRemove._elCnt) {
						parentElem.removeChild(prevNode);
						parentElem.removeChild(nextNode);
					}
					setArrayChangeLink(viewToRemove);
					for (bindId in viewToRemove._.bnd) {
						removeViewBinding(bindId, keepNodes);
					}
					delete viewStore[id];
				}
			}

			var current, view, viewsCount,
				self = this,
				isArray = !self._.useKey,
				views = self.views;

			if (isArray) {
				viewsCount = views.length;
			}
			if (index === undefined) {
				// Remove all child views
				if (isArray) {
					// views and data are arrays
					current = viewsCount;
					while (current--) {
						removeView(current);
					}
					self.views = [];
				} else {
					// views and data are objects
					for (view in views) {
						// Remove by key
						removeView(view);
					}
					self.views = {};
				}
			} else {
				if (itemsCount === undefined) {
					if (isArray) {
						// The parentView is data array view.
						// Set itemsCount to 1, to remove this item
						itemsCount = 1;
					} else {
						// Remove child view with key 'index'
						removeView(index);
						delete views[index];
					}
				}
				if (isArray && itemsCount) {
					current = index + itemsCount;
					// Remove indexed items (parentView is data array view);
					while (current-- > index) {
						removeView(current);
					}
					views.splice(index, itemsCount);
					if (viewsCount = views.length) {
						// Fixup index on following view items...
						while (index < viewsCount) {
							$observable(views[index]).setProperty("index", index++);
						}
					}
				}
			}
			return this;
		},

		refresh: function(context) {
			var self = this,
				parent = self.parent;

			self.tmpl = getTemplate(self.tmpl);

			if (parent) {
				renderAndLink(self, self.index, self.tmpl, parent.views, self.data, context, TRUE);
				setArrayChangeLink(self);
			}
			return self;
		},

		nodes: getNodes,
		contents: getContents,
		childTags: getChildTags,
		link: viewLink
	};

	//=========================
	// Extend $.views.settings
	//=========================

	$viewsSettings.merge = {
		input: {
			from: { fromAttr: inputAttrib }, to: { toAttr: "value" }
		},
		textarea: valueBinding,
		select: valueBinding,
		optgroup: {
			from: { fromAttr: "label" }, to: { toAttr: "label" }
		}
	};

	if ($viewsSettings.debugMode) {
		// In debug mode create global for accessing views, etc
		validate = !$viewsSettings.noValidate;
		global._jsv = {
			views: viewStore,
			bindings: bindingStore
		};
	}

	//========================
	// Extend jQuery namespace
	//========================

	$extend($, {

		//=======================
		// jQuery $.view() plugin
		//=======================

		view: $view = function(node, inner, type) {
			// $.view() returns top view
			// $.view(node) returns view that contains node
			// $.view(selector) returns view that contains first selected element
			// $.view(nodeOrSelector, type) returns nearest containing view of given type
			// $.view(nodeOrSelector, "root") returns root containing view (child of top view)
			// $.view(nodeOrSelector, true, type) returns nearest inner (contained) view of given type

			if (inner !== !!inner) {
				// inner not boolean, so this is view(nodeOrSelector, type)
				type = inner;
				inner = undefined;
			}
			var view, vwInfos, i, j, k, l, elem, elems,
				level = 0,
				body = document.body;

			if (node && node !== body && topView._.useKey > 1) {
				// Perf optimization for common cases

				node = "" + node === node
					? $(node)[0]
					: node.jquery
						? node[0]
						: node;

				if (node) {
					if (inner) {
						// Treat supplied node as a container element and return the first view encountered.
						elems = qsa ? node.querySelectorAll(bindElsSel) : $(bindElsSel, node).get();
						l = elems.length;
						for (i = 0; i < l; i++) {
							elem = elems[i];
							vwInfos = viewInfos(elem, undefined, rOpenViewMarkers);

							for (j = 0, k = vwInfos.length; j < k; j++) {
								view = vwInfos[j];
								if (view = viewStore[view.id]) {
									view = view && type ? view.get(TRUE, type) : view;
									if (view) {
										return view;
									}
								}
							}
						}
					} else {
						while (node) {
							// Move back through siblings and up through parents to find preceding node  which is a _prevNode
							// script marker node for a non-element-content view, or a _prevNode (first node) for an elCnt view
							if (vwInfos = viewInfos(node, undefined, rViewMarkers)) {
								l = vwInfos.length;
								while (l--) {
									view = vwInfos[l];
									if (view.open) {
										if (level < 1) {
											view = viewStore[view.id];
											return view && type ? view.get(type) : view || topView;
										}
										level--;
									} else {
										// level starts at zero. If we hit a view.close, then we move level to 1, and we don't return a view until
										// we are back at level zero (or a parent view with level < 0)
										level++;
									}
								}
							}
							node = node.previousSibling || node.parentNode;
						}
					}
				}
			}
			return inner ? undefined : topView;
		},

		link: $link,
		unlink: $unlink,

		//=====================
		// override $.cleanData
		//=====================
		cleanData: function(elems) {
			if (elems.length) {
				// Remove JsViews bindings. Also, remove from the DOM any corresponding script marker nodes
				clean(elems);
				// (elems HTMLCollection no longer includes removed script marker nodes)
				oldCleanData.call($, elems);
			}
		}
	});

	//===============================
	// Extend jQuery instance plugins
	//===============================

	$extend($.fn, {
		link: function(expr, from, context, parentView, prevNode, nextNode) {
			return $link(expr, this, from, context, parentView, prevNode, nextNode);
		},
		unlink: function(expr, from) {
			return $unlink(expr, this, from);
		},
		view: function(type) {
			return $view(this[0], type);
		}
	});

	//===============
	// Extend topView
	//===============

	$extend(topView, { tmpl: { links: {} }});
	$extend(topView, LinkedView);
	topView._.onRender = addBindingMarkers;

})(this, this.jQuery);
