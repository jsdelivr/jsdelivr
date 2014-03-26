YUI.add('gallery-layout-rows', function (Y, NAME) {

"use strict";

var has_no_recalc_auto_bug    = (0 < Y.UA.ie && Y.UA.ie < 8),
	has_explosive_modules_bug = (0 < Y.UA.ie && Y.UA.ie < 8),
	is_borked_dom_access      = (0 < Y.UA.ie && Y.UA.ie < 8);

/**
 * PageLayout plugin for managing vertically stacked rows on a page,
 * sandwiched vertically between header and footer.  Each row contains one
 * or more modules.
 * 
 * @module gallery-layout
 * @submodule gallery-layout-rows
 */

Y.namespace('PageLayoutRows');

// must be done after defining Y.PageLayoutRows

Y.PageLayoutRows.collapse_classes =
{
	vert_parent_class:       Y.PageLayout.module_rows_class,
	horiz_parent_class:      Y.PageLayout.module_class,
	collapse_parent_pattern: Y.PageLayout.expand_vert_nub_class
};

function adjustHeight(
	/* int */		total_height,
	/* object */	children)
{
	var h = total_height;

	if (is_borked_dom_access)
	{
		var access_dom_so_it_will_be_right_next_time = children.bd.get('offsetHeight');
	}

	var b = children.root.get('offsetHeight') - children.bd.get('offsetHeight');

	if (children.hd)
	{
		h -= children.hd.get('offsetHeight');
		b -= children.hd.get('offsetHeight');
	}
	if (children.ft)
	{
		h -= children.ft.get('offsetHeight');
		b -= children.ft.get('offsetHeight');
	}

	h -= b;

	h -= children.bd.vertMarginBorderPadding();

	return Math.max(h, Y.PageLayout.min_module_height);
}

function getWidth(
	/* int */		body_width,
	/* array */		col_widths,
	/* int */		row_index,
	/* int */		col_index,
	/* object */	module,
	/* object */	module_info)
{
	module_info.mbp = module.horizMarginBorderPadding();
	return Math.max(1, Math.floor(body_width * col_widths[ row_index ][ col_index ] / 100.0) - module_info.mbp);
}

Y.PageLayoutRows.resize = function(
	/* enum */			mode,
	/* int */			body_width,
	/* int */			body_height)
{
	var row_count = this.body_info.outers.size();

	// reset module heights
	// adjust for horizontally collapsed or fixed width modules

	var col_widths = [],
		row_widths = [];
	for (var i=0; i<row_count; i++)
	{
		var widths = this.body_info.inner_sizes[i].slice(0);
		col_widths.push(widths);
		row_widths.push(body_width);

		var uncollapsed_count = 0,
			sum               = 0;

		var modules = this.body_info.modules[i];
		var count   = modules.size();
		for (var j=0; j<count; j++)
		{
			var module = modules.item(j);
			module.setStyle('height', 'auto');
			if (module.hasClass(Y.PageLayout.collapsed_horiz_class))
			{
				if (has_no_recalc_auto_bug)
				{
					module.setStyle('display', 'none');
				}
				module.setStyle('width', 'auto');
				if (has_no_recalc_auto_bug)
				{
					module.setStyle('display', 'block');
				}
				widths[j]      = - module.get('offsetWidth');
				row_widths[i] -= module.totalWidth();
			}
			else if (widths[j] > 0)
			{
				uncollapsed_count++;
				sum += widths[j];
			}
		}

		if (uncollapsed_count < count)
		{
			for (var j=0; j<count; j++)
			{
				if (widths[j] > 0)
				{
					widths[j] *= (100.0 / sum);
				}
			}
		}
	}

	// smart fit:  if only one module, fit-to-content until it won't fit inside viewport

	var module_info = {};
	if (this.single_module)
	{
		var module   = this.body_info.modules[0].item(0);
		var children = module._page_layout.children;
		if (children.bd)
		{
			var w  = getWidth(row_widths[0], col_widths, 0, 0, module, module_info);
			var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
			this.fire('beforeResizeModule', { bd: children.bd, height: 'auto', width: w1 });
			this._setWidth(children, w);
			children.root.setStyle('height', 'auto');
			children.bd.setStyle('height', 'auto');
		}

		var h = module.totalHeight();
		mode  = (h > body_height ? Y.PageLayout.FIT_TO_VIEWPORT : Y.PageLayout.FIT_TO_CONTENT);

		this.body_container.removeClass('FIT_TO_[A-Z_]+');
	}

	// fit-to-content:  compute height of each row; requires setting module widths
	// fit-to-viewport: adjust for vertically collapsed modules

	if (mode === Y.PageLayout.FIT_TO_CONTENT)
	{
		var row_heights = [];
		for (var i=0; i<row_count; i++)
		{
			this.body_info.outers.item(i).setStyle('height', 'auto');

			var modules    = this.body_info.modules[i];
			var h          = 0;
			var total_w    = 0;
			var open_count = modules.size();
			var count      = open_count;
			for (var j=0; j<count; j++)
			{
				var w      = col_widths[i][j];
				var module = modules.item(j);
				if (w < 0)
				{
					var total_w_hacked = false;
					if (w == Y.PageLayout.unmanaged_size && has_explosive_modules_bug)
					{
						var children = module._page_layout.children;
						if (children.bd)
						{
							var bd_w = children.bd.totalWidth();
							total_w += bd_w + module.horizMarginBorderPadding();
							total_w_hacked = true;

							children.root.setStyle('width', bd_w+'px');
						}
					}

					if (!total_w_hacked)
					{
						total_w += module.totalWidth();
					}
					open_count--;
				}
			}

			var k = 0;
			for (var j=0; j<count; j++)
			{
				var w      = col_widths[i][j];
				var module = modules.item(j);
				if (w < 0)
				{
					if (w == Y.PageLayout.unmanaged_size)
					{
						var children = module._page_layout.children;
						if (children.bd)
						{
							children.root.setStyle('height', 'auto');
							children.bd.setStyle('height', 'auto');
						}

						h = Math.max(h, module.get('offsetHeight'));
					}
					continue;
				}
				k++;

				var children = module._page_layout.children;
				if (children.bd)
				{
					var w    = getWidth(row_widths[i], col_widths, i, j, module, module_info);
					total_w += w + module_info.mbp;

					if (k == open_count)
					{
						w += body_width - total_w;
					}

					var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
					this.fire('beforeResizeModule', { bd: children.bd, height: 'auto', width: w1 });
					this._setWidth(children, w);
					children.root.setStyle('height', 'auto');
					children.bd.setStyle('height', 'auto');
				}

				h = Math.max(h, module.get('offsetHeight'));
			}

			row_heights.push(h);
		}
	}
	else
	{
		var row_heights = this.body_info.outer_sizes.slice(0);

		var uncollapsed_count = 0,
			sum               = 0;
		for (var i=0; i<row_count; i++)
		{
			var row       = this.body_info.outers.item(i);
			var collapsed = row.hasClass(Y.PageLayout.collapsed_vert_class);
			if (collapsed || row_heights[i] < 0)
			{
				row_heights[i] = 0;
				if (collapsed)
				{
					row.setStyle('height', 'auto');
				}

				// We cannot compute the height of row directly
				// because the row above might be wrapping.

				body_height -= row.one('*').totalHeight();
				body_height -= row.vertMarginBorderPadding();
			}
			else
			{
				uncollapsed_count++;
				sum += row_heights[i];
			}
		}

		if (uncollapsed_count < row_count)
		{
			for (var i=0; i<row_count; i++)
			{
				row_heights[i] *= (100.0 / sum);
			}
		}
	}

	// set height of each row and size of each module

	for (var i=0; i<row_count; i++)
	{
		if (mode === Y.PageLayout.FIT_TO_CONTENT)
		{
			var h = row_heights[i];
		}
		else
		{
			if (row_heights[i] === 0)
			{
				var module   = this.body_info.modules[i].item(0);
				var children = module._page_layout.children;
				if (children.bd)
				{
					var h1 = children.bd.insideHeight();
					var w  = getWidth(row_widths[i], col_widths, i, 0, module, module_info);
					var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
					this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
					this._setWidth(children, w);
					this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
				}
				continue;
			}

			var h = Math.max(1, Math.floor(body_height * row_heights[i] / 100.0) - this.body_info.outers.item(i).vertMarginBorderPadding());
		}
		this.body_info.outers.item(i).setStyle('height', h+'px');

		// adjust for horizontally collapsed or fixed width modules

		var modules    = this.body_info.modules[i];
		var total_w    = 0;
		var open_count = modules.size();
		var count      = open_count;
		for (var j=0; j<count; j++)
		{
			var w      = col_widths[i][j];
			var module = modules.item(j);
			if (w < 0)
			{
				var total_w_hacked = false;
				if (w == Y.PageLayout.unmanaged_size)
				{
					var children = module._page_layout.children;
					if (children.bd)
					{
						var h1 = adjustHeight(h, children);
						var w1 = children.bd.insideWidth();
						this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
						children.bd.setStyle('height', h1+'px');

						if (has_explosive_modules_bug)
						{
							var bd_w = children.bd.totalWidth();
							total_w += bd_w + module.horizMarginBorderPadding();
							total_w_hacked = true;

							children.root.setStyle('width', bd_w+'px');
						}

						this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
					}
				}
				else
				{
					module.setStyle('height', Math.max(1, h - module.vertMarginBorderPadding())+'px');
				}

				if (!total_w_hacked)
				{
					total_w += module.totalWidth();
				}
				open_count--;
			}
		}

		// set the size of each module

		var k = 0;
		for (var j=0; j<count; j++)
		{
			if (col_widths[i][j] < 0)
			{
				continue;
			}
			k++;

			var module   = modules.item(j);
			var children = module._page_layout.children;
			if (children.bd)
			{
				var h1   = adjustHeight(h, children);
				var w    = getWidth(row_widths[i], col_widths, i, j, module, module_info);
				total_w += w + module_info.mbp;

				if (k == open_count)
				{
					w += body_width - total_w;
				}

				var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
				if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
				{
					this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
					this._setWidth(children, w);
				}

				children.bd.setStyle('height', h1+'px');

				this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
			}
		}
	}
};


}, 'gallery-2013.06.13-01-19', {"requires": ["gallery-layout"]});
