YUI.add('gallery-layout', function (Y, NAME) {

"use strict";

/**
 * Provides fluid layout for the content on a page.
 *
 * @module gallery-layout
 */

/**
 * Manages header (layout-hd), body (layout-bd), footer (layout-ft) stacked
 * vertically to either fit inside the viewport (fit-to-viewport) or adjust
 * to the size of the body content (fit-to-content).
 * 
 * The body content is sub-divided into modules, arranged either in rows or
 * columns.  The layout is automatically detected based on the marker
 * classes attached to the two layers of divs inside layout-bd:  either
 * layout-module-row > layout-module or layout-module-col > layout-module
 * 
 * Each module has an optional header (layout-m-hd), a body (layout-m-bd),
 * and an optional footer (layout-m-ft).  You can have multiple
 * layout-m-bd's, but only one can be visible at a time.  If you change the
 * DOM in any way that affects the height of any module header, body, or
 * footer, or if you switch bodies, you must call `elementResized()` to
 * reflow the layout.  (Technically, you do not have to call
 * `elementResized()` if you modify a module body in fit-to-viewport mode,
 * but if you later decide to switch to fit-to-content, your optimization
 * will cause trouble.)
 * 
 * If you want a row, column, or module to have a fixed size, add the class
 * layout-not-managed to the layout-module-row, layout-module-column, or
 * layout-module.  Then use CSS to set the width of layout-module (for a
 * row) or layout-module-col (for a col), or the height of layout-m-bd.
 * 
 * If the body content is a single module, it expands as the content
 * expands (fit-to-content) until it would push the footer below the fold.
 * Then it switches to fit-to-viewport so the scrollbar appears on the
 * module instead of the entire viewport.  (If you do not want this
 * behavior in a particular case, add the class FORCE_FIT to layout-bd.)
 * 
 * Note that a non-zero margin-top on the top element or a non-zero
 * margin-bottom on the bottom element inside any container will break the
 * layout because browsers lie about the total height of the container in
 * this case.  Use padding instead of margin on elements inside headers and
 * footers.
 * 
 * If you wish to display a loading message that automatically disappears
 * after the first time the layout is calculated, add the class
 * `layout-loading` to the div containing the message.  (To be visible,
 * this div must not be inside the div with class `layout-bd`, since that
 * has `visibility:hidden`.)
 *
 * @class PageLayout
 * @extends Base
 * @constructor
 * @param config {Object}
 */

function PageLayout()
{
	PageLayout.superclass.constructor.apply(this, arguments);
}

PageLayout.NAME = "pagelayout";

/**
 * @property FIT_TO_VIEWPORT
 * @static
 */
PageLayout.FIT_TO_VIEWPORT = 0;

/**
 * @property FIT_TO_CONTENT
 * @static
 */
PageLayout.FIT_TO_CONTENT = 1;

PageLayout.ATTRS =
{
	/**
	 * FIT_TO_VIEWPORT sizes the rows to fit everything inside the
	 * browser's viewport.  FIT_TO_CONTENT sizes the rows to eliminate all
	 * scrollbars on module bodies.  Note that you can configure this
	 * property by putting the CSS class "FIT_TO_VIEWPORT" or
	 * "FIT_TO_CONTENT" on layout-bd.
	 *
	 * @attribute mode
	 * @type PageLayout.FIT_TO_VIEWPORT or PageLayout.FIT_TO_CONTENT
	 * @default PageLayout.FIT_TO_VIEWPORT
	 */
	mode:
	{
		value:     PageLayout.FIT_TO_VIEWPORT,
		validator: function(value)
		{
			return (value === PageLayout.FIT_TO_VIEWPORT || value === PageLayout.FIT_TO_CONTENT);
		}
	},

	/**
	 * Minimum page width, measured in em's.  The page content will not
	 * collapse narrower than this width.  If the viewport is smaller, the
	 * brower's horizontal scrollbar will appear.
	 * 
	 * @attribute minWidth
	 * @type {Number} em's
	 * @default 73 (em) 950px @ 13px font
	 */
	minWidth:
	{
		value:     73,
		validator: function(value)
		{
			return (Y.Lang.isNumber(value) && value > 0);
		}
	},

	/**
	 * Minimum page height in FIT_TO_VIEWPORT mode, measured in em's.  The
	 * page content will not collapse lower than this height.  If the
	 * viewport is smaller, the brower's vertical scrollbar will appear.
	 * 
	 * @attribute minHeight
	 * @type {Number} em's
	 * @default 44 (em) 570px @ 13px font
	 */
	minHeight:
	{
		value:     44,
		validator: function(value)
		{
			return (Y.Lang.isNumber(value) && value > 0);
		}
	},

	/**
	 * In FIT_TO_CONTENT mode, set this to true to make the footer stick to
	 * the bottom of the viewport.  The default is for the footer to scroll
	 * along with the rest of the page content.
	 *
	 * @attribute stickyFooter
	 * @type {Boolean}
	 * @default false
	 */
	stickyFooter:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * When organizing modules into columns in FIT_TO_CONTENT mode, set
	 * this to false to allow each column to be a different height.
	 *
	 * @attribute matchColumnHeights
	 * @type {Boolean}
	 * @default true
	 */
	matchColumnHeights:
	{
		value:     true,
		validator: Y.Lang.isBoolean
	},

	/**
	 * Selector identifying the element which contains layout-(hd|bd|ft).
	 * This cannot be used to attach PageLayout to only part of the page.
	 * It should only be used when the page content is unavoidably embedded
	 * inside an element which fills the page.
	 * 
	 * @attribute body
	 * @type {String|Node}
	 * @default "body"
	 */
	body:
	{
		value:     'body',
		validator: function(value)
		{
			return (Y.Lang.isString(value) || value._node);
		}
	}
};

/**
 * @event beforeReflow
 * @description Fires before the layout is reflowed.
 */
/**
 * @event afterReflow
 * @description Fires after the layout is completely reflowed, including viewport scrollbar changes.
 */

/**
 * @event beforeExpandModule
 * @description Fires before a module is expanded.
 * @param bd {Node} the module body (layout-m-bd)
 */
/**
 * @event afterExpandModule
 * @description Fires after a module is expanded.
 * @param bd {Node} the module body (layout-m-bd)
 */

/**
 * @event beforeCollapseModule
 * @description Fires before a module is collapsed.
 * @param bd {Node} the module body (layout-m-bd)
 */
/**
 * @event afterCollapseModule
 * @description Fires after a module is collapsed.
 * @param bd {Node} the module body (layout-m-bd)
 */

/**
 * @event beforeResizeModule
 * @description Fires before a module is resized.
 * @param bd {Node} the module body (layout-m-bd)
 * @param height {Number} new height in pixels or "auto"
 * @param width {Number} new width in pixels or "auto"
 */
/**
 * @event afterResizeModule
 * @description Fires after a module is resized.
 * @param bd {Node} the module body (layout-m-bd)
 * @param height {Number} new height in pixels
 * @param width {Number} new width in pixels
 */

/**
 * @property fit_to_viewport_class
 * @type {String}
 * @default "FIT_TO_VIEWPORT"
 * @static
 */
PageLayout.fit_to_viewport_class = 'FIT_TO_VIEWPORT';

/**
 * @property fit_to_content_class
 * @type {String}
 * @default "FIT_TO_CONTENT"
 * @static
 */
PageLayout.fit_to_content_class = 'FIT_TO_CONTENT';

/**
 * @property force_fit_class
 * @type {String}
 * @default "FORCE_FIT"
 * @static
 */
PageLayout.force_fit_class = 'FORCE_FIT';

/**
 * @property page_header_class
 * @type {String}
 * @default "layout-hd"
 * @static
 */
PageLayout.page_header_class = 'layout-hd';

/**
 * @property page_body_class
 * @type {String}
 * @default "layout-bd"
 * @static
 */
PageLayout.page_body_class = 'layout-bd';

/**
 * @property page_footer_class
 * @type {String}
 * @default "layout-ft"
 * @static
 */
PageLayout.page_footer_class = 'layout-ft';

/**
 * @property module_rows_class
 * @type {String}
 * @value "layout-module-row"
 * @static
 */
PageLayout.module_rows_class = 'layout-module-row';

/**
 * @property module_cols_class
 * @type {String}
 * @value "layout-module-col"
 * @static
 */
PageLayout.module_cols_class = 'layout-module-col';

/**
 * @property module_class
 * @type {String}
 * @default "layout-module"
 * @static
 */
PageLayout.module_class = 'layout-module';

/**
 * @property module_header_class
 * @type {String}
 * @default "layout-m-hd"
 * @static
 */
PageLayout.module_header_class = 'layout-m-hd';

/**
 * @property module_body_class
 * @type {String}
 * @default "layout-m-bd"
 * @static
 */
PageLayout.module_body_class = 'layout-m-bd';

/**
 * @property module_footer_class
 * @type {String}
 * @default "layout-m-ft"
 * @static
 */
PageLayout.module_footer_class = 'layout-m-ft';

/**
 * @property not_managed_class
 * @type {String}
 * @default "layout-not-managed"
 * @static
 */
PageLayout.not_managed_class = 'layout-not-managed';

/**
 * @property collapse_vert_nub_class
 * @type {String}
 * @default "layout-vert-collapse-nub"
 * @static
 */
PageLayout.collapse_vert_nub_class = 'layout-vert-collapse-nub';

/**
 * @property collapse_left_nub_class
 * @type {String}
 * @default "layout-left-collapse-nub"
 * @static
 */
PageLayout.collapse_left_nub_class = 'layout-left-collapse-nub';

/**
 * @property collapse_right_nub_class
 * @type {String}
 * @default "layout-right-collapse-nub"
 * @static
 */
PageLayout.collapse_right_nub_class = 'layout-right-collapse-nub';

/**
 * @property expand_vert_nub_class
 * @type {String}
 * @default "layout-vert-expand-nub"
 * @static
 */
PageLayout.expand_vert_nub_class = 'layout-vert-expand-nub';

/**
 * @property expand_left_nub_class
 * @type {String}
 * @default "layout-left-expand-nub"
 * @static
 */
PageLayout.expand_left_nub_class = 'layout-left-expand-nub';

/**
 * @property expand_right_nub_class
 * @type {String}
 * @default "layout-right-expand-nub"
 * @static
 */
PageLayout.expand_right_nub_class = 'layout-right-expand-nub';

/**
 * @property collapsed_vert_class
 * @type {String}
 * @default "layout-collapsed-vert"
 * @static
 */
PageLayout.collapsed_vert_class = 'layout-collapsed-vert';

/**
 * @property collapsed_horiz_class
 * @type {String}
 * @default "layout-collapsed-horiz"
 * @static
 */
PageLayout.collapsed_horiz_class = 'layout-collapsed-horiz';

/**
 * @property min_module_height
 * @type {Number}
 * @default 10 (px)
 * @static
 */
PageLayout.min_module_height = 10; // px

PageLayout.unmanaged_size = -1; // smaller than any module size (collapsed size = - normal size)

var mode_regex          = /\bFIT_TO_[A-Z_]+/,
	row_height_class_re = /(?:^|\s)height:([0-9]+)%/,
	col_width_class_re  = /(?:^|\s)width:([0-9]+)%/,

	reflow_delay = 100, // ms

	plugin_info =
	{
		row:
		{
			module:     'gallery-layout-rows',
			plugin:     'PageLayoutRows',
			outer_size: row_height_class_re,
			inner_size: col_width_class_re
		},
		col:
		{
			module:     'gallery-layout-cols',
			plugin:     'PageLayoutCols',
			outer_size: col_width_class_re,
			inner_size: row_height_class_re
		}
	};
/*
	dd_group_name:            'satg-layout-dd-group',
	drag_target_class:        'satg-layout-dd-target',
	drag_nub_class:           'satg-layout-dragnub',
	module_header_drag_class: 'satg-layout-draggable',
	module_no_drag_class:     'satg-layout-drag-disabled',
	bomb_sight_class:         'satg-layout-bomb-sight satg-layout-bomb-sight-rows',

	the_dd_targets = {};
	the_dd_nubs    = {};
*/

function init()
{
	this.viewport =
	{
		w:   0,
		h:   0,
		bcw: 0
	};

	// find header, body, footer

	var page_blocks = Y.one(this.get('body')).get('children');

	var list = page_blocks.filter('.'+PageLayout.page_header_class);
	if (list.size() > 1)
	{
		throw Error('There must be at most one div with class ' + PageLayout.page_header_class);
	}
	this.header_container = (list.isEmpty() ? null : list.item(0));

	list = page_blocks.filter('.'+PageLayout.page_body_class);
	if (list.size() != 1)
	{
		throw Error('There must be exactly one div with class ' + PageLayout.page_body_class);
	}
	this.body_container = list.item(0);

	this.body_horiz_mbp = this.body_container.horizMarginBorderPadding();
	this.body_vert_mbp  = this.body_container.vertMarginBorderPadding();

	var m = this.body_container.get('className').match(mode_regex);
	if (m && m.length)
	{
		this.set('mode', PageLayout[ m[0] ]);
	}

	list = page_blocks.filter('.'+PageLayout.page_footer_class);
	if (list.size() > 1)
	{
		throw Error('There must be at most one div with class ' + PageLayout.page_footer_class);
	}
	this.footer_container = (list.isEmpty() ? null : list.item(0));

	Y.one(Y.config.win).on('resize', resize, this);

	updateFitClass.call(this);
	reparentFooter.call(this);
	this.rescanBody();

	// stay in sync

	this.after('modeChange', function()
	{
		updateFitClass.call(this);

		if (this.body_container)
		{
			this.body_container.scrollTop = 0;
		}

		reparentFooter.call(this);
		resize.call(this);
	});

	this.after('minWidthChange', resize);
	this.after('minHeightChange', resize);

	this.after('stickyFooterChange', function()
	{
		reparentFooter.call(this);
		resize.call(this);
	});

	this.after('matchColumnHeightsChange', resize);
}

/*
 * Normalize the list of sizes so they add up to 100%.
 */
function normalizeSizes(
	/* array */	list,
	/* regex */	pattern)
{
	// collect sizes

	var sizes = Y.map(list, function(module)
	{
		if (module.hasClass(PageLayout.not_managed_class))
		{
			return PageLayout.unmanaged_size;
		}

		var m = module.get('className').match(pattern);
		return (m && m.length ? parseInt(m[1], 10) : 0);
	});

	// analyze

	var info = Y.reduce(sizes, [0,0], function(value, size)
	{
		if (size > 0)
		{
			value[0] += size;
		}
		else if (size === 0)
		{
			value[1]++;
		}
		return value;
	});

	var sum = info[0], blank_count = info[1];

	// fill in blanks

	if (blank_count > 0)
	{
		var blank_size = Math.max((100 - sum) / blank_count, 10);

		sizes = Y.map(sizes, function(size)
		{
			return (size === 0 ? blank_size : size);
		});

		sum = Y.reduce(sizes, 0, function(sum, size, i)
		{
			return (size < 0 ? sum : sum + size);
		});
	}

	// normalize

	return Y.map(sizes, function(size)
	{
		return (size > 0 ? size * (100.0 / sum) : size);
	});
}

function updateFitClass()
{
	this.body_container.replaceClass('FIT_TO_(VIEWPORT|CONTENT)',
		this.get('mode') === PageLayout.FIT_TO_VIEWPORT ? 'FIT_TO_VIEWPORT' : 'FIT_TO_CONTENT');
}

function reparentFooter()
{
	if (!this.footer_container)
	{
		return;
	}

	if (this.get('mode') === PageLayout.FIT_TO_VIEWPORT || this.get('stickyFooter'))
	{
		this.body_container.get('parentNode').insertBefore(this.footer_container, this.body_container.next(function(node)
		{
			return node.get('tagName') != 'SCRIPT';
		}));
	}
	else
	{
		this.body_container.appendChild(this.footer_container);
	}
}

function resize()
{
	if (!this.layout_plugin || !this.body_container)
	{
		return;
	}

	// check if viewport changed

	var mode          = this.single_module ? Y.PageLayout.FIT_TO_VIEWPORT : this.get('mode');
	var sticky_footer = this.get('stickyFooter');

	this.body_container.setStyle('overflowX',
		mode === Y.PageLayout.FIT_TO_CONTENT ? 'auto' : 'hidden');
	this.body_container.setStyle('overflowY',
		mode === Y.PageLayout.FIT_TO_CONTENT ? 'scroll' : 'hidden');

	var viewport =
	{
		w: Y.DOM.winWidth(),
		h: Y.DOM.winHeight()
	};

	var resize_event = arguments[0] && arguments[0].type == 'resize';	// IE7 generates no-op's
	if (resize_event &&
		(viewport.w === this.viewport.w &&
		 viewport.h === this.viewport.h))
	{
		return;
	}

	this.viewport = viewport;

	this.fire('beforeReflow');	// after confirming that viewport really has changed

	saveScrollPositions.call(this);

	// set width of hd,bd,ft and height of bd

	var min_width  = Y.Node.emToPx(this.get('minWidth'));
	var body_width = Math.max(this.viewport.w, min_width);
	if (this.header_container)
	{
		this.header_container.setStyle('width', body_width+'px');
	}
	this.body_container.setStyle('width', (body_width - this.body_horiz_mbp)+'px');
	if (this.footer_container)
	{
		this.footer_container.setStyle('width', sticky_footer ? body_width+'px' : 'auto');
	}
	body_width = this.body_container.get('clientWidth') - this.body_horiz_mbp;

	this.viewport.bcw = this.body_container.get('clientWidth');

	var h     = this.viewport.h;
	var h_min = Y.Node.emToPx(this.get('minHeight'));
	if (mode === Y.PageLayout.FIT_TO_VIEWPORT && h < h_min)
	{
		h = h_min;
		Y.one(document.documentElement).setStyle('overflowY', 'auto');
	}
	else if (!window.console || !window.console.layout_force_viewport_scrollbars)	// remove inactive vertical scrollbar in IE
	{
		Y.one(document.documentElement).setStyle('overflowY', 'hidden');
	}

	if (this.header_container)
	{
		h -= this.header_container.get('offsetHeight');
	}
	if (this.footer_container &&
		(mode === Y.PageLayout.FIT_TO_VIEWPORT || sticky_footer))
	{
		h -= this.footer_container.get('offsetHeight');
	}

	if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
	{
		var body_height = h - this.body_vert_mbp;
	}
	else if (h < 0)						// FIT_TO_CONTENT doesn't enforce min height
	{
		h = 10 + this.body_vert_mbp;	// arbitrary, positive number
	}

	this.body_container.setStyle('height', (h - this.body_vert_mbp)+'px');

	// resize modules

	this.layout_plugin.resize.call(this, mode, body_width, body_height);

	restoreScrollPositions.call(this);

	// show body and footer

	this.body_container.setStyle('visibility', 'visible');
	if (this.footer_container)
	{
		this.footer_container.setStyle('visibility', 'visible');
	}

	Y.later(100, this, checkViewportSize);
}

/*
 * Check if the viewport size has changed, usually due to the browser
 * removing no-longer-needed scrollbars.  If the viewport size is
 * stable, fires the afterReflow event.
 */
function checkViewportSize()
{
	if (Y.DOM.winWidth()                       != this.viewport.w ||
		Y.DOM.winHeight()                      != this.viewport.h ||
		this.body_container.get('clientWidth') != this.viewport.bcw)
	{
		resize.call(this);
	}
	else
	{
		this.fire('afterReflow');
	}
}

function saveScrollPositions()
{
	var outer_count = this.body_info.outers.size();
	for (var i=0; i<outer_count; i++)
	{
		var modules     = this.body_info.modules[i];
		var inner_count = modules.size();
		for (var j=0; j<inner_count; j++)
		{
			var module   = modules.item(j),
				children = this._analyzeModule(module);

			module._page_layout = !children.bd ? null :
			{
				children:     children,
				bdScrollTop:  children.bd.get('scrollTop'),
				bdScrollLeft: children.bd.get('scrollLeft')
			};
		}
	}
}

function restoreScrollPositions()
{
	var outer_count = this.body_info.outers.size();
	for (var i=0; i<outer_count; i++)
	{
		var modules     = this.body_info.modules[i];
		var inner_count = modules.size();
		for (var j=0; j<inner_count; j++)
		{
			var module = modules.item(j);
			if (module._page_layout)
			{
				var bd = module._page_layout.children.bd;
				bd.set('scrollTop', module._page_layout.bdScrollTop);
				bd.get('scrollLeft', module._page_layout.bdScrollLeft);
			};
		}
	}
}

/*
 * Expand the module containing the event target.
 */
function expandModule(
	/* event */	e)
{
	var node = e.currentTarget;

	function expand(
		/* string */	parent_class_name,
		/* string */	collapsed_class)
	{
		var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);
		if (p && p.hasClass(collapsed_class))
		{
			var children = this._analyzeModule(p);
			this.fire('beforeExpandModule', { bd: children.bd });

			p.removeClass(collapsed_class);
			resize.call(this);

			this.fire('afterExpandModule', { bd: children.bd });
		}
	}

	if (node.hasClass(PageLayout.expand_vert_nub_class))
	{
		expand.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);
	}
	else
	{
		expand.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);
	}
}

/*
 * Collapse the module containing the event target.
 */
function collapseModule(
	/* event */	e)
{
	var node = e.currentTarget;

	function collapse(
		/* string */	parent_class_name,
		/* string */	collapsed_class)
	{
		var p = node.getAncestorByClassName(this.layout_plugin.collapse_classes[parent_class_name]);
		if (p && !p.hasClass(collapsed_class))
		{
			var children = this._analyzeModule(p);
			this.fire('beforeCollapseModule', { bd: children.bd });

			p.addClass(collapsed_class);
			resize.call(this);

			this.fire('afterCollapseModule', { bd: children.bd });
		}
	}

	if (node.hasClass(PageLayout.collapse_vert_nub_class))
	{
		collapse.call(this, 'vert_parent_class', PageLayout.collapsed_vert_class);
	}
	else
	{
		collapse.call(this, 'horiz_parent_class', PageLayout.collapsed_horiz_class);
	}
}

Y.extend(PageLayout, Y.Base,
{
	initializer: function()
	{
		Y.on('domready', init, this);
	},

	/**
	 * Call this after manually adding or removing modules on the page.
	 * 
	 * @method rescanBody
	 */
	rescanBody: function()
	{
		Y.detach('PageLayoutCollapse|click');

		this.body_info =
		{
			outers:      [],
			modules:     [],	// list of modules inside each row
			outer_sizes: [],	// list of percentages
			inner_sizes: []		// list of lists of percentages
		};

		var outer_list  = this.body_container.all('div.' + PageLayout.module_rows_class);
		var plugin_data = plugin_info.row;
		if (outer_list.isEmpty())
		{
			outer_list  = this.body_container.all('div.' + PageLayout.module_cols_class);
			plugin_data = plugin_info.col;
		}
		if (outer_list.isEmpty())
		{
			throw Error('There must be at least one ' + PageLayout.module_rows_class + ' or ' + PageLayout.module_cols_class + ' inside ' + PageLayout.page_body_class + '.');
		}
		this.body_info.outers = outer_list;

		var collapse_nub_pattern =
			'(' +
			PageLayout.collapse_vert_nub_class + '|' +
			PageLayout.collapse_left_nub_class + '|' +
			PageLayout.collapse_right_nub_class +
			')';

		var expand_nub_pattern =
			'(' +
			PageLayout.expand_vert_nub_class + '|' +
			PageLayout.expand_left_nub_class + '|' +
			PageLayout.expand_right_nub_class +
			')';

		var row_count = this.body_info.outers.size();
		Y.each(this.body_info.outers, function(row)
		{
			var row_id = row.generateID();
			this.body_info.outer_sizes.push(100.0/row_count);

			var list = row.all('div.' + PageLayout.module_class);
			if (list.isEmpty())
			{
				this.body_info.outers  = [];
				this.body_info.modules = [];
				throw Error('There must be at least one ' + PageLayout.module_class + ' inside ' + PageLayout.module_rows_class + '.');
			}

			this.body_info.modules.push(list);

			Y.each(list, function(module)
			{
				var nub = module.getFirstElementByClassName(collapse_nub_pattern);
				if (nub)
				{
					nub.on('PageLayoutCollapse|click', collapseModule, this);
				}

				nub = module.getFirstElementByClassName(expand_nub_pattern);
				if (nub)
				{
					nub.on('PageLayoutCollapse|click', expandModule, this);
				}
			},
			this);
/*
			if (PageLayoutDDProxy)
			{
				var has_nubs = false;
				Y.each(list, function(module)
				{
					var id = module.generateID();
					module.removeClass(PageLayout.module_no_drag_class);

					if (the_dd_nubs[id])
					{
						has_nubs = (the_dd_nubs[id] != 'none');
					}
					else
					{
						var nub = module.getFirstElementByClassName(PageLayout.drag_nub_class);
						if (nub)
						{
							var children = this._analyzeModule(module);
							if (children.hd)
							{
								children.hd.addClass(PageLayout.module_header_drag_class);
								the_dd_nubs[id] =
									new PageLayoutDDProxy(this, id, children.hd, PageLayout.dd_group_name);
								has_nubs = true;
							}
						}

						if (!the_dd_nubs[id])
						{
							the_dd_nubs[id] = 'none';
						}
					}
				},
				this);

				if (!the_dd_targets[ row_id ] &&
					(has_nubs || row.hasClass(PageLayout.drag_target_class)))
				{
					the_dd_targets[ row_id ] = new DDTarget(row_id, PageLayout.dd_group_name);
				}

				if (list.size() == 1)
				{
					list.item(0).addClass(PageLayout.module_no_drag_class);
				}
			}
*/
			this.body_info.inner_sizes.push(
				normalizeSizes(list, plugin_data.inner_size));
		},
		this);

		this.body_info.outer_sizes =
			normalizeSizes(this.body_info.outers, plugin_data.outer_size);

		this.single_module = false;
		if (this.body_info.outers.size() == 1 && this.body_info.modules[0].size() == 1 &&
			!this.body_container.hasClass(PageLayout.force_fit_class))
		{
			plugin_data        = plugin_info.row;
			this.single_module = true;
		}

		var self = this;
		Y.use(plugin_data.module, function(Y)
		{
			Y.all('div.layout-loading').each(function(n)
			{
				n.setStyle('display', 'none');
			});

			self.layout_plugin = Y[ plugin_data.plugin ];
			updateFitClass.call(self);	// plugin may modify it
			resize.call(self);
		});
	},

	/**
	 * @method getHeaderHeight
	 * @return {Number} the height of the sticky header in pixels
	 */
	getHeaderHeight: function()
	{
		return (this.header_container ? this.header_container.get('offsetHeight') : 0);
	},

	/**
	 * @method getHeaderContainer
	 * @return {Node} the header container (layout-hd) or null if there is no header
	 */
	getHeaderContainer: function()
	{
		return this.header_container;
	},

	/**
	 * @method getBodyHeight
	 * @return {Number} the height of the scrolling body in pixels
	 */
	getBodyHeight: function()
	{
		return this.body_container.get('offsetHeight');
	},

	/**
	 * @method getBodyContainer
	 * @return {Node} the body container (layout-bd)
	 */
	getBodyContainer: function()
	{
		return this.body_container;
	},

	/**
	 * @method getFooterHeight
	 * @return {Number} the height of the sticky footer in pixels or zero if the footer is not sticky
	 */
	getFooterHeight: function()
	{
		return (this.get('stickyFooter') && this.footer_container ?
				this.footer_container.get('offsetHeight') : 0);
	},

	/**
	 * @method getFooterContainer
	 * @return {Node} the footer container (layout-ft), or null if there is no footer
	 */
	getFooterContainer: function()
	{
		return this.footer_container;
	},

	/**
	 * @method moduleIsCollapsed
	 * @param node {String|Node} .layout-module
	 * @return {Boolean} true if module is collapsed
	 */
	moduleIsCollapsed: function(
		/* string/Node */	node)
	{
		var collapsed_pattern =
			'(' +
			PageLayout.collapsed_horiz_class + '|' +
			PageLayout.collapses_vert_class +
			')';

		node = Y.one(node);
		if (node.getFirstElementByClassName(this.layout_plugin.collapse_classes.collapse_parent_pattern))
		{
			node = node.get('parentNode');
		}

		return node.hasClass(collapsed_pattern);
	},

	/**
	 * Expand the specified module.
	 * 
	 * @method expandModule
	 * @param node {String|Node} .layout-module
	 */
	expandModule: function(
		/* string/Node */	node)
	{
		node    = Y.one(node);
		var nub = node.getFirstElementByClassName(PageLayout.expand_vert_nub_class);
		if (!nub)
		{
			var expand_horiz_nub_pattern =
				'(' +
				PageLayout.expand_left_nub_class + '|' +
				PageLayout.expand_right_nub_class +
				')';

			nub = node.getFirstElementByClassName(expand_horiz_nub_pattern);
		}

		if (nub)
		{
			expandModule.call(this, { currentTarget: nub });
		}
	},

	/**
	 * Collapse the specified module.
	 * 
	 * @method collapseModule
	 * @param node {String|Node} .layout-module
	 */
	collapseModule: function(
		/* string/Node */	node)
	{
		node    = Y.one(node);
		var nub = node.getFirstElementByClassName(PageLayout.collapse_vert_nub_class);
		if (!nub)
		{
			var collapse_horiz_nub_pattern =
				'(' +
				PageLayout.collapse_left_nub_class + '|' +
				PageLayout.collapse_right_nub_class +
				')';

			nub = node.getFirstElementByClassName(collapse_horiz_nub_pattern);
		}

		if (nub)
		{
			collapseModule.call(this, { currentTarget: nub });
		}
	},

	/**
	 * Toggle the collapsed state of the specified layout-module.
	 * 
	 * @method toggleModule
	 * @param module {String|Node} .layout-module
	 */
	toggleModule: function(
		/* string/Node */	module)
	{
		module = Y.one(module);	// optimization
		if (this.moduleIsCollapsed(module))
		{
			this.expandModule(module);
		}
		else
		{
			this.collapseModule(module);
		}
	},

	/**
	 * Call this when something changes size, to request a reflow of the
	 * layout.
	 * 
	 * @method elementResized
	 * @param el {String|Node} element that changed size
	 * @return {Boolean} true if the element is inside the managed containers
	 */
	elementResized: function(
		/* string/Node */	el)
	{
		el = Y.one(el);

		if ((this.header_container && this.header_container.contains(el)) ||
			(this.body_container && this.body_container.contains(el)) ||
			(this.footer_container && this.footer_container.contains(el)))
		{
			if (this.refresh_timer)
			{
				this.refresh_timer.cancel();
			}

			var t1 = (new Date()).getTime();
			this.refresh_timer = Y.later(reflow_delay, this, function()
			{
				this.refresh_timer = null;

				// if JS is really busy, wait a bit longer

				var t2 = (new Date()).getTime();
				if (t2 > t1 + 2*reflow_delay)
				{
					this.elementResized(el);
				}
				else
				{
					resize.call(this);
				}
			});

			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Returns the components of the module.
	 * 
	 * @method _analyzeModule
	 * @private
	 * @param root {Node} .layout-module
	 * @return {Object} root,hd,bd,ft
	 */
	_analyzeModule: function(
		/* node */	root)
	{
		var result =
		{
			root: root,
			hd:   null,
			bd:   null,
			ft:   null
		};

		// two step process avoid scanning into the module body

		var bd = root.one('.'+PageLayout.module_body_class);
		if (!bd)
		{
			return result;
		}

		var list = bd.siblings().filter('.'+PageLayout.module_body_class);
		list.unshift(bd);
		result.bd = list.find(function(n)
		{
			return (n.get('offsetWidth') > 0);
		});
		if (!result.bd)
		{	
			result.bd = bd;
		}

		if (result.bd)
		{
			result.hd = result.bd.siblings().filter('.'+PageLayout.module_header_class).item(0);
			result.ft = result.bd.siblings().filter('.'+PageLayout.module_footer_class).item(0);
		}

		return result;
	},

	/**
	 * Set the width of a module.
	 * 
	 * @method _setWidth
	 * @private
	 * @param children {Object} root,hd,bd,ft
	 * @param w {Number} width in pixels
	 */
	_setWidth: function(
		/* object */	children,
		/* int */		w)
	{
		children.root.setStyle('width', w+'px');
	}
});

Y.PageLayout = PageLayout;


}, 'gallery-2013.08.15-00-45', {
    "skinnable": "true",
    "requires": [
        "base",
        "gallery-funcprog",
        "gallery-node-optimizations",
        "gallery-dimensions",
        "gallery-nodelist-extras2"
    ],
    "optional": [
        "gallery-layout-rows",
        "gallery-layout-cols"
    ]
});
