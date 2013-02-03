/*!
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */


// TODO REMOVE clt, newData, itemKeyOffset? Merge recent fixes on jQuery.tmpl.js, such as __, etc.


(function( $, undefined ){
	var oldManip = $.fn.domManip, tmplItmAtt = "data-jq-item", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
		newTmplItems = {}, ctl, newData, wrappedItems = {}, appendToTmplItems, topTmplItem = { key: 0, data: {} },
		itemKey = 0, itemKeyOffset = 0, cloneIndex = 0, stack = [],
		getLinkAttr = $.dataLinkSettings.decl.applyBindInfo;

	function newTmplItem( options, parentItem, fn, data ) {
		// Returns a template item data structure for a new rendered instance of a template (a 'template item').
		// The content field is a hierarchical array of strings and nested items (to be
		// removed and replaced by nodes field of dom elements, once inserted in DOM).
		// Prototype is $.tmpl.item, which provides both methods and fields.
		var newItem = this;
		newItem.parent = parentItem || null;
		newItem.data = data || (parentItem ? parentItem.data : {});
		newItem._wrap = parentItem ? parentItem._wrap : null;
		//if ( options ) {
			$.extend( newItem, options, { nodes: [], parent: parentItem } );
		//}
		if ( fn ) {
			// Build the hierarchical content to be used during insertion into DOM
			newItem.tmpl = fn;
			newItem._ctnt = newItem._ctnt || newItem.tmpl( $, newItem );
			newItem.key = ++itemKey;
			// Keep track of new template item, until it is stored as jQuery Data on DOM element
			(stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
		}
	}

	function newTmplItem2( options, parentItem, fn, data, index ) {
		// Returns a template item data structure for a new rendered instance of a template (a 'template item').
		// The content field is a hierarchical array of strings and nested items (to be
		// removed and replaced by nodes field of dom elements, once inserted in DOM).
		// Prototype is $.tmpl.item, which provides both methods and fields.
		var newItem = this;
		newItem.parent = parentItem || null;
		newItem.data = data || (parentItem ? parentItem.data : {});
		newItem._wrap = parentItem ? parentItem._wrap : null;
		//if ( options ) {
			$.extend( newItem, options, { nodes: [], parent: parentItem } );
		//}
		if ( fn ) {
			// Build the hierarchical content to be used during insertion into DOM
			newItem.tmpl = fn;
			newItem.index = index || 0;
			newItem._ctnt = newItem._ctnt || newItem.tmpl( $, newItem );
			newItem.key = ++itemKey;
			// Keep track of new template item, until it is stored as jQuery Data on DOM element
			(stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
		}
	}

	// Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
	$.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		$.fn[ name ] = function( selector ) {
			var ret = [], insert = $( selector ), elems, i, l, tmplItems,
				parent = this.length === 1 && this[0].parentNode;

			appendToTmplItems = newTmplItems || {};
			if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
				insert[ original ]( this[0] );
				ret = this;
				storeTmplItems( [this[0]] ); // SHOULD NOT DO THIS FOR REGULAR DOM MANIP
			} else {
				var insertedElems = [];
				for ( i = 0, l = insert.length; i < l; i++ ) {
					insertedElems.push( elems = (i > 0 ? this.clone(true) : this).get() );
					$( insert[i] )[ original ]( elems );
					ret = ret.concat( elems );
				}
				while ( insertedElems.length ) {
					storeTmplItems( insertedElems.shift() );
					cloneIndex++;
				}
				cloneIndex = 0;
				ret = this.pushStack( ret, name, insert.selector );
			}
			tmplItems = appendToTmplItems;
			appendToTmplItems = null;
			$.tmpl.complete( tmplItems, ctl, newData );
			ctl = null;
			newData = null;
			return ret;
		};
	});

	$.fn.extend({
		// Use first wrapped element as template markup.
		// Return wrapped set of template items, obtained by rendering template against data.
		tmplRender: function( data, options, parentItem ) {
			return $.tmplRender( this[0], data, options, parentItem );
		},

		tmpl: function( data, options, parentItem ) {
			return $.tmpl( this[0], data, options, parentItem );
		},
		// Find which rendered template item the first wrapped DOM element belongs to
		tmplItem: function() {
			return $.tmplItem( this[0] );
		},

		tmplActivate: function( tmpl, data, options, parentItem ) {
			var test = renderTmplItems( $.template( tmpl ), data, options, parentItem  );
			// TODO Optimize between rendering string and activating, so as not to build the template items twice
			storeTmplItems( this );
			if ( $.dataLink ) {
				var self = this;
				$.dataLink( data, this, function( ev, eventArgs, to, thisMap ) {
					switch ( eventArgs.change ) {
						case "add":
//							self.append( $( tmpl ).tmplRender( eventArgs.newItems, { annotate: true } ));
							$( tmpl ).tmpl( eventArgs.newItems ).appendTo( self );
						break;
					}

				});

				$.dataLink( this, data );
			}
		},

		// Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
		template: function( name, options ) {
			return $.template( name, this[0], options );
		},

		domManip: function( args, table, callback, options ) {
			if ( args[0] && $.isArray( args[0] )) {
				var dmArgs = $.makeArray( arguments ), elems = args[0], elemsLength = elems.length, i = 0, tmplItem;
				while ( i < elemsLength && !(tmplItem = $.data( elems[i++], "tmplItem" ))) {}
				if ( tmplItem && cloneIndex ) {
					dmArgs[2] = function( fragClone ) {
						// Handler called by oldManip when rendered template has been inserted into DOM.
						$.tmpl.afterManip( this, fragClone, callback );
					};
				}
				oldManip.apply( this, dmArgs );
			} else {
				oldManip.apply( this, arguments );
			}
			cloneIndex = 0;
			if ( ctl && !appendToTmplItems ) { // Bug in current code
				$.tmpl.complete( newTmplItems, ctl, newData );
			}
			return this;
		}
	});

	$.extend({
		// Return string obtained by rendering template against data.
		tmplRender: function( tmpl, data, options ) {
			var ret = renderTemplate( tmpl, data, options );
			itemKey = 0;
			newTmplItems = {};  // THIS MAY BE THE CAUSE OF THE ISSUE ON MEMORY LEAK - THAT THIS IS NOT SET TO {} IN THE CASE OF tmpl(), SINCE THAT HAPPENS ON APPEND (BY DESIGN). BUT WHAT ABOUT APPEND USING TMPLPLUS?
			ctl = newData = null;
			return ret;
		},

		// Return jQuery object wrapping the result of rendering the template against data.
		// For nested template, return tree of rendered template items.
		tmpl: function ( tmpl, data, options, parentItem ) {
			options = options || {};
			options.annotate = options.activate || parentItem && parentItem.annotate;
			var content = renderTemplate( tmpl, data, options, parentItem );
			return (parentItem && tmpl) ? content : jqObjectWithTextNodes( content );
		},

//		tmpl: function ( tmpl, data, options, parentItem ) {
//			options = options || {};
//			options.annotate = options.renderOnly ? false : (parentItem ? parentItem.annotate : true);
//			var content = tmplRenders( tmpl, data, options, parentItem );
//	//	return parentItem ? content : $( options.annotate ? activate( content ) : content );
//				return parentItem ? content : jQuery( activate( content.join("") ));
//		},

		// Return rendered template item for an element.
		tmplItem: function( elem ) {
			var tmplItem;
			if ( elem instanceof $ ) {
				elem = elem[0];
			}
			while ( elem && elem.nodeType === 1 && !(tmplItem = $.data( elem, "tmplItem" )) && (elem = elem.parentNode) ) {}
			return tmplItem || topTmplItem;
		},

		// Set:
		// Use $.template( name, tmpl ) to cache a named template,
		// where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
		// Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

		// Get:
		// Use $.template( name ) to access a cached template.
		// Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
		// will return the compiled template, without adding a name reference.
		// If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
		// to $.template( null, templateString )
		template: function( name, tmpl ) {
			if (tmpl) {
				// Compile template and associate with name
				if ( typeof tmpl === "string" ) {
					// This is an HTML string being passed directly in.
					tmpl = buildTmplFn( tmpl )
				} else if ( tmpl instanceof $ ) {
					tmpl = tmpl[0] || null; // WAS || {};
				}
				if ( tmpl && tmpl.nodeType ) {
					// If this is a template block, use cached copy, or generate tmpl function and cache.
					tmpl = $.data( tmpl, "tmpl" ) || $.data( tmpl, "tmpl", buildTmplFn( tmpl.innerHTML ));
				}
				return typeof name === "string" ? ($.template[name] = tmpl) : tmpl;
			}
			// Return named compiled template
			return name ? (typeof name !== "string" ? $.template( null, name ):
				($.template[name] ||
					// If not in map, treat as a selector. (If integrated with core, use quickExpr.exec)
					$.template( null, htmlExpr.test( name ) ? name : $( name )))) : null;
		},

		encode: function( text ) {
			// Do HTML encoding replacing < > & and ' and " by corresponding entities.
			return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
		}
	});

	var defaultOpen = "$item.calls($item,_,$1,$2);_=[];",
		defaultClose = ["call=$item.calls();_=call[1].concat($item.", "(call,_));"];

	$.extend( $.tmpl, {
		tag: {
			"tmpl": {
				_default: { $2: "null" },
				open: "if($notnull_1){_=_.concat($item.nest($1,$2));}"
				// tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
				// This means that {{tmpl foo}} treats foo as a template (which IS a function).
				// Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
			},
			"wrap": {
				_default: { $2: "null" },
				open: defaultOpen,
				close: defaultClose.join( "wrap" )
			},
			"plugin": {
				_default: { $2: "null" },
				open: defaultOpen,
				close: defaultClose.join( "plugin" )
			},
			"link": {  // Include an encode option?
				_default: {  $2: "$data" },
				open: defaultOpen,
				close: defaultClose.join( "link" )
			},
			"bind": {
				_default: { $2: "$data" },
				open: "_.push($item.bind($item,_,$1,$2));"
			},
			"each": {
				_default: { $2: "$index, $value" },
				open: "if($notnull_1){$.each($1a,function($2){with(this){",
				close: "}});}"
			},
			"if": {
				open: "if(($notnull_1) && $1a){",
				close: "}"
			},
			"else": {
				_default: { $1: "true" },
				open: "}else if(($notnull_1) && $1a){"
			},
			"html": {
				// Unencoded expression evaluation.
				open: "if($notnull_1){_.push($1a);}"
			},
			":": {
				// Code execution
				open: "$1"
			},
			"=": {
				// Encoded expression evaluation. Abbreviated form is ${}.
				_default: { $1: "$data" },
				open: "if($notnull_1){_.push($.encode($1a));}"
			},
			"!": {
				// Comment tag. Skipped by parser
				open: ""
			}
		},

		item: {
			tmpl: null,
			nodes: [],
			calls: function( content ) {
				if ( !content ) {
					return stack.pop();
				}
				stack.push( arguments );
			},
			nest2: function( tmpl, data, options ) {
				// nested template, using {{tmpl}} tag
				return $.tmpl( $.template( tmpl ), data, options, this );
			},
			nest: function( tmpl, data, options ) {
				// nested template, using {{tmpl}} tag
				return $.tmpl( $.template( tmpl ), data, options, this );
			},
			wrap: function( call, wrapped ) {
				// nested template, using {{wrap}} tag
				var options = call[4] || {};
				options.wrapped = wrapped;
				// Apply the template, which may incorporate wrapped content,
				return $.tmpl( $.template( call[2] ), call[3], options, call[0] ); // tmpl, data, options, item
			},
			html: function( filter, textOnly ) {
				var wrapped = this._wrap;
				return $.map(
					$( $.isArray( wrapped ) ? wrapped.join("") : wrapped ).filter( filter || "*" ),
					function(e) {
						return textOnly ?
							e.innerText || e.textContent :
							e.outerHTML || outerHtml(e);
					});
			},
			update: function( options ) { // ISSUE - does not work correctly with top-level text nodes, or <br> or similar
				var coll = this.nodes; // These are only the elements, not all nodes!!
				this.annotate = true;
				$.tmpl( null, null, options, this ).insertBefore( coll[0] ); // What if there is a text node in the rendered template, before the first node.
				$( coll ).remove(); // what if there are text nodes between the elements.
			},
			pluginOLD: function( call, wrapped ) {
				var pluginName = call[2];
				return $.tmpl( pluginsWrapperTmpl, null, {wrapped: wrapped, addIds: true, elementCreated: function( element ) {
					var tmplItem = this;
					if ( $.fn[ pluginName ] ) {
						loadPlugin();
					} else {
						$.req[ pluginName ]( loadPlugin );
					}
					function loadPlugin() {
						var self = $( element );
						self[ pluginName ].apply( self, $.makeArray( call ).slice(3) );
					}
				}}, call[0] );
			},
			plugin: function( call, wrapped ) {
				var pluginName = call[2];
				return $.tmpl( pluginsWrapperTmpl, null, {wrapped: wrapped, addIds: true, elementCreated: function( element ) {
					var tmplItem = this;
					if ( $.fn[ pluginName ] ) {
						loadPlugin();
					} else {
						$.req[ pluginName ]( loadPlugin );
					}
					function loadPlugin() {
						var self = $( element );
						self[ pluginName ].apply( self, $.makeArray( call ).slice(3) );
						if ( call[2] ) {
							window[call[2]] = self.data( pluginName ); // TODO Replace by $.tmpl.ctls or similar. TODO deal with async templates in plugin
						}
					}
				}}, call[0] );
			},
			link: function( call, wrapped ) {
				var pluginCall = $.makeArray( call );
				pluginCall.splice( 2, 2, "link", pluginCall[3], pluginCall[2] );
				return this.plugin( pluginCall, wrapped );
			},
			bind: function( item, content, map, from ) {
				return from[map];
			}
		},

		// This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
		complete: function( tmplItems, ctl, data ) {
			var tmplItem;
			for ( tmplItem in tmplItems ) {
				tmplItem =  tmplItems[ tmplItem ];
				// Raise rendered event
				if ( tmplItem.ctl && tmplItem.ctl.onItemRendered ) {
					tmplItem.ctl.onItemRendered( tmplItem );
				}
			}
			if ( ctl && ctl.onItemsRendered ) { //BUG ctl &&
				ctl.onItemsRendered( tmplItems, data );
			}
			itemKey = 0;
			newTmplItems = {};
			ctl = newData = null;
		},

		// Call this from code which overrides domManip, or equivalent
		// Manage cloning/storing template items etc.
		afterManip: function afterManip( elem, fragClone, callback ) {
			// Provides cloned fragment ready for fixup prior to and after insertion into DOM
			var content = fragClone.nodeType === 11 ?
				$.makeArray(fragClone.childNodes) :
				fragClone.nodeType === 1 ? [fragClone] : [];

			// Return fragment to original caller (e.g. append) for DOM insertion
			callback.call( elem, fragClone );

			// Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
			storeTmplItems( content );
			cloneIndex++;
		}
	});

	var pluginsWrapperTmpl = $.template( null, "{{html this.html()}}" );

	newTmplItem.prototype = $.tmpl.item;
	newTmplItem2.prototype = $.tmpl.item;

	//========================== Private helper functions, used by code above ==========================

	function renderTemplate( tmpl, data, options, parentItem ) {
		var ret = renderTmplItems2( tmpl, data, options, parentItem );
		return (parentItem && tmpl) ? ret : buildStringArray( parentItem || topTmplItem, ret ).join("");
	}

	function renderTmplItems2( tmpl, data, options, parentItem ) {
		// Render template against data as a tree of template items (nested template), or as a string (top-level template).
		options = options || {};
		var ret, topLevel = !parentItem;
		if ( topLevel ) {
			// This is a top-level tmpl call (not from a nested template using {{tmpl}})
			parentItem = topTmplItem;
			if ( !$.isFunction( tmpl ) ) {
				tmpl = $.template[tmpl] || $.template( null, tmpl );
			}
			wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
		} else if ( !tmpl ) {
			// The template item is already associated with DOM - this is a refresh.
			// Re-evaluate rendered template for the parentItem
			tmpl = parentItem.tmpl;
			newTmplItems[parentItem.key] = parentItem;
			parentItem.nodes = [];
			if ( parentItem.wrapped ) {
				updateWrapped( parentItem, parentItem.wrapped );
			}
			// Rebuild, without creating a new template item
			return parentItem.tmpl( $, parentItem );
		}
		if ( !tmpl ) {
			return null; // Could throw...
		}
	//	options =  $.extend( {}, options, tmpl )
		if ( typeof data === "function" ) {
			data = data.call( parentItem || {} );
		}
		if ( options.wrapped ) {
			updateWrapped( options, options.wrapped );
			if ( options.addIds ) {
				// TEMPORARY?
				tmpl = $.template( null, options._wrap );
				options._wrap = null;
				options.wrapped = null;
				delete options.addIds;
			}
		}
		ctl = options.ctl;
		newData = data;

		return $.isArray( data ) ?
			$.map( data, function( dataItem, index ) {
				return dataItem ? new newTmplItem2( options, parentItem, tmpl, dataItem, index ) : null;
			}) :
			[ new newTmplItem2( options, parentItem, tmpl, data ) ];
	}

	function renderTmplItems( tmpl, data, options, parentItem ) {
		// Render template against data as a tree of template items (nested template), or as a string (top-level template).
		options = options || {};
		var ret, topLevel = !parentItem;
		if ( topLevel ) {
			// This is a top-level tmpl call (not from a nested template using {{tmpl}})
			parentItem = topTmplItem;
			if ( !$.isFunction( tmpl ) ) {
				tmpl = $.template[tmpl] || $.template( null, tmpl );
			}
			wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
		} else if ( !tmpl ) {
			// The template item is already associated with DOM - this is a refresh.
			// Re-evaluate rendered template for the parentItem
			tmpl = parentItem.tmpl;
			newTmplItems[parentItem.key] = parentItem;
			parentItem.nodes = [];
			if ( parentItem.wrapped ) {
				updateWrapped( parentItem, parentItem.wrapped );
			}
			// Rebuild, without creating a new template item
			return parentItem.tmpl( $, parentItem );
		}
		if ( !tmpl ) {
			return null; // Could throw...
		}
	//	options =  $.extend( {}, options, tmpl )
		if ( typeof data === "function" ) {
			data = data.call( parentItem || {} );
		}
		if ( options.wrapped ) {
			updateWrapped( options, options.wrapped );
			if ( options.addIds ) {
				// TEMPORARY?
				tmpl = $.template( null, options._wrap );
				options._wrap = null;
				options.wrapped = null;
				delete options.addIds;
			}
		}
		ctl = options.ctl;
		newData = data;

		return $.isArray( data ) ?
			$.map( data, function( dataItem ) {
				return dataItem ? new newTmplItem( options, parentItem, tmpl, dataItem ) : null;
			}) :
			[ new newTmplItem( options, parentItem, tmpl, data ) ];
	}

	function getTmplItemPath( tmplItem ) {
//		var path = tmplItem.index;
//		while ( tmplItem.parent.key ) {
//			tmplItem = tmplItem.parent;
//			path = tmplItem.key + "." + path;
//		}
//		return path;
return "";
	}

	function buildStringArray( tmplItem, content ) {
		// Convert hierarchical content (tree of nested tmplItems) into flat string array of rendered content (optionally with attribute annotations for tmplItems)
		return content ?
			$.map( content, function( item ) {
				return (typeof item === "string") ?
					// Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
//					( tmplItem.annotate && tmplItem.key ? item.replace( /(<\w+)(?!\sdata-jq-item)([^>]*)/, "$1 " + tmplItmAtt + "=\"" + (tmplItem.key - itemKeyOffset) + "\" " + "data-jq-path" + "=\"" + getTmplItemPath( tmplItem ) + "\" $2" ) : item) :
					( tmplItem.annotate && tmplItem.key ? item.replace( /(<\w+)(?!\sdata-jq-item)([^>]*)/, "$1 " + "data-jq-path" + "=\"" + getTmplItemPath( tmplItem ) + "\" $2" ) : item) :
					// This is a child template item. Build nested template.
					buildStringArray( item, item._ctnt );
			}) :
			// If content is not defined, return tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}.
			tmplItem;
	}

	function jqObjectWithTextNodes( content ) {
		// take string content and create jQuery wrapper, including initial or final text nodes
		// Also support HTML entities within the HTML markup.
		var ret;
		content.replace( /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function( all, before, middle, after) {
			ret = $( middle );
			if ( before || after ) {
				ret = ret.get();
				if ( before ) {
					ret = unencode( before ).concat( ret );
				}
				if ( after ) {
					ret = ret.concat(unencode( after ));
				}
				ret = $( ret );
			}
		});
		return ret || $();
	}

	function unencode( text ) {
		// Use createElement, since createTextNode will not render HTML entities correctly
		var el = document.createElement( "div" );
		el.innerHTML = text || "";
		return $.makeArray(el.childNodes);
	}

	// Generate a reusable function that will serve to render a template against data
	function buildTmplFn( markup ) {
		var o="{", c="}"
		markup.replace(/{jquery-tmpl-chars(.)(.)}/, function( all, open, close ){
			o=open;
			c=close;
			return "";
		})
		var regExShortCut = /\$\{([^\}]*)\}/g, // new RegExp("\$\{([^\}]*)\}", "g");
//			regExBind = /<[^<]*\{\{bind\s*([^<]*)\s*\}\}[^<]*>/g;
			regExBind = /<[^<]*\{\{bind[^<]*>/g;

		markup = markup.replace( regExBind, function(all) {
					return "{{link}}" + all.replace(/\{\{bind\s*([^\}(?=\})]*)\s*\}\}/g, "{bind$1/bind}") + "{{/link}}";
				});


		return new Function("jQuery","$item",
			"var $=jQuery,call,_=[],$data=$item.data,$ctl=$item.ctl;" +

			// Introduce the data as local variables using with(){}
			"with($data){_.push('" +

			// Convert the template into pure JavaScript
			$.trim(markup)
				.replace( /([\\'])/g, "\\$1" )
				.replace( /[\r\t\n]/g, " " )
				.replace( regExShortCut, "{{= $1}}" )
				.replace( regExBind, function(all) {
					return "before" + all.replace(/\{\{bind\s*([^<]*)\s*\}\}/g, "xxx$1yyy") + "after";
				})
				.replace( /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*)\))?\s*\}\}/g,
				function( all, slash, type, fnargs, target, parens, args ) {
					var tag = $.tmpl.tag[ type ], def, expr, exprAutoFnDetect;
					if ( !tag ) { // Unregistered template tags are treated as generic plugins
						tag = $.tmpl.tag[ type ] = {
							_default: { $2: "null" },
							open: $.tmpl.tag.plugin.open,
						//	open: defaultOpen, // This was for pluginOLD
							close: defaultClose.join( type ) // Will call the <type> method on the item
						};
						$.tmpl.item[ type ] = $.tmpl.item[ type ] || function( call, wrapped ) { // Define the <type> method on the item, called on parsing close tag.
							var pluginCall = $.makeArray( call );
							pluginCall.splice( 2, 0, type );
							return this.plugin( pluginCall, wrapped );
						};
					}
					def = tag._default || [];
					if ( parens && !/\w$/.test(target)) {
						target += parens;
						parens = "";
					}
					if ( target ) {
						target = unescape( target );
						args = args ? ("," + unescape( args ) + ")") : ( parens ? ")" : "");
						// Support for target being things like a.toLowerCase();
						// In that case don't call with template item as 'this' pointer. Just evaluate...
						expr = parens ? (target.indexOf(".") > -1 ? target + unescape( parens ) : ("(" + target + ").call($item" + args)) : target;
						exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
					} else {
						exprAutoFnDetect = expr = def.$1 || "null";
					}
					fnargs = unescape( fnargs );
					var test = "');" +
						tag[ slash ? "close" : "open" ]
							.split( "$notnull_1" ).join( target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true" )
							.split( "$1a" ).join( exprAutoFnDetect )
//							.split( "$3" ).join( "'" + all.slice( type.length+2, -2 ) + "'" )  // TODO Optimize for perf later...
							.split( "$1" ).join( expr )
							.split( "$2" ).join( fnargs ?
								fnargs
//								fnargs.replace( /\s*([^\(]+)\s*(\((.*?)\))?/g, function( all, name, parens, params ) {
//									params = params ? ("," + params + ")") : (parens ? ")" : "");
//									return params ? ("(" + name + ").call($item" + params) : all;
//								})
								: (def.$2||"")
							) +
						"_.push('";
					return test;
				}) +
			"');}return _;"
		);
	}

	function updateWrapped( options, wrapped ) {
		// Build the wrapped content.
		options._wrap = buildStringArray( options,
			// Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
			$.isArray( wrapped ) ? wrapped : [htmlExpr.test( wrapped ) ? wrapped : $( wrapped ).html()]
		).join("");
	}

	function unescape( args ) {
		return args ? args.replace( /\\'/g, "'").replace(/\\\\/g, "\\" ) : null;
	}

	function outerHtml( elem ) {
		var div = document.createElement("div");
		div.appendChild( elem.cloneNode(true) );
		return div.innerHTML;
	}

	// Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
	function storeTmplItems( content ) {
		var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m, elemCreated = [];
		for ( i = 0, l = content.length; i < l; i++ ) {
			if ( (elem = content[i]).nodeType !== 1 ) {
				continue;
			}
			elems = elem.getElementsByTagName("*");
			for ( m = elems.length - 1; m >= 0; m-- ) {
				processItemKey( elems[m] );
			}
			processItemKey( elem );
		}
		while ( elemCreated.length ) {
			elem = elemCreated.pop();
			$.data( elem, "tmplItem" ).elementCreated( elem );
		}
		function processItemKey( el ) {
			var pntKey, pntNode = el, pntItem, tmplItem, key;
			// Ensure that each rendered template inserted into the DOM has its own template item,
			if ( (key = el.getAttribute( tmplItmAtt ))) {
				while ( pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute( tmplItmAtt ))) { }
				if ( pntKey !== key ) {
					// The next ancestor with a _tmplitem expando is on a different key than this one.
					// So this is a top-level element within this template item
					// Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
					pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute( tmplItmAtt ) || 0)) : 0;
					if ( !(tmplItem = newTmplItems[key]) ) {
						// The item is for wrapped content, and was copied from the temporary parent wrappedItem.
						tmplItem = wrappedItems[key];
						tmplItem = new newTmplItem( tmplItem, newTmplItems[pntNode]||wrappedItems[pntNode], null, true );
						tmplItem.key = ++itemKey;
						newTmplItems[itemKey] = tmplItem;
					}
					if ( cloneIndex ) {
						tmplItem = cloneTmplItem( tmplItem );  // BUG - NEED TO CLONE PARENT BEFORE CLONING CHILD, SO POINTS TO CLONED PARENT, NOT ORIGINAL PARENT...
					}
				}
				el.removeAttribute( tmplItmAtt );
			}
//			else if ( cloneIndex && (tmplItem = $.data( el, "tmplItem" )) ) {
//				// This was a rendered element, cloned during append or appendTo etc.
//				// TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
//				cloneTmplItem( tmplItem.key );
//				newTmplItems[tmplItem.key] = tmplItem;
//				pntNode = $.data( el.parentNode, "tmplItem" );
//				pntNode = pntNode ? pntNode.key : 0;
//			}
			if ( tmplItem ) {
				pntItem = tmplItem;
				// Find the template item of the parent element.
				// (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
				while ( pntItem && pntItem.key != pntNode ) {
					// Add this element as a top-level node for this rendered template item, as well as for any
					// ancestor items between this item and the item of its parent element
					pntItem.nodes.push( el );
					pntItem = pntItem.parent;
				}
				// Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
				delete tmplItem._ctnt;
				delete tmplItem._wrap;
				if ( tmplItem.elementCreated ) {
					elemCreated.push( el );
				}
				// Store template item as jQuery data on the element
				$.data( el, "tmplItem", tmplItem );
			}
			function cloneTmplItem( item ) {
				var key = item.key;
				if ( !key ) {
					return item;
				}
				key += keySuffix;
				return newClonedItems[key] =
					(newClonedItems[key] || new newTmplItem( item, cloneTmplItem( item.parent ), null, true ));
			}
		}
	}
})( jQuery );
