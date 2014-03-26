YUI.add('gallery-layout-cols', function (Y, NAME) {

"use strict";

var has_explosive_modules_bug = (0 < Y.UA.ie && Y.UA.ie < 8);

/**
 * PageLayout plugin for managing horizontally stacked columns on a page,
 * sandwiched vertically between header and footer.  Each column contains
 * one or more modules.
 * 
 * @module gallery-layout
 * @submodule gallery-layout-cols
 */

Y.namespace('PageLayoutCols');

// must be done after defining Y.PageLayoutCols

Y.PageLayoutCols.collapse_classes =
{
	vert_parent_class:       Y.PageLayout.module_class,
	horiz_parent_class:      Y.PageLayout.module_cols_class,
	collapse_parent_pattern: '(' + Y.PageLayout.expand_left_nub_class + '|' + Y.PageLayout.expand_right_nub_class + ')'
};

function adjustHeight(
	/* int */		total_height,
	/* object */	children)
{
	var h = total_height;

	if (children.hd)
	{
		h -= children.hd.get('offsetHeight');
	}
	if (children.ft)
	{
		h -= children.ft.get('offsetHeight');
	}

	h -= children.bd.vertMarginBorderPadding();

	return Math.max(h, Y.PageLayout.min_module_height);
}

function getHeight(
	/* int */		body_height,
	/* array */		row_heights,
	/* int */		col_index,
	/* int */		row_index,
	/* object */	module,
	/* object */	module_info)
{
	module_info.mbp = module.vertMarginBorderPadding();
	return Math.max(1, Math.floor(body_height * row_heights[ col_index ][ row_index ] / 100.0) - module_info.mbp);
}

Y.PageLayoutCols.resize = function(
	/* enum */			mode,
	/* int */			body_width,
	/* int */			body_height)
{
	var match_heights = this.get('matchColumnHeights');
	var col_count     = this.body_info.outers.size();

	// fit-to-viewport: adjust for vertically collapsed modules

	if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
	{
		var row_heights = [],
			col_heights = [];
		for (var i=0; i<col_count; i++)
		{
			var heights = this.body_info.inner_sizes[i].slice(0);
			row_heights.push(heights);
			col_heights.push(body_height);

			var uncollapsed_count = 0,
				sum               = 0;

			var modules = this.body_info.modules[i];
			var count   = modules.size();
			for (var j=0; j<count; j++)
			{
				var module = modules.item(j);
				if (module.hasClass(Y.PageLayout.collapsed_vert_class))
				{
					module.setStyle('height', 'auto');
					heights[j]      = - module.get('offsetHeight');
					col_heights[i] -= module.totalHeight();
				}
				else if (heights[j] > 0)
				{
					uncollapsed_count++;
					sum += heights[j];
				}
			}

			if (uncollapsed_count < count)
			{
				for (var j=0; j<count; j++)
				{
					if (heights[j] > 0)
					{
						heights[j] *= (100.0 / sum);
					}
				}
			}
		}
	}

	// adjust for horizontally collapsed or fixed width modules

	var module_info = {};
	var col_widths  = this.body_info.outer_sizes.slice(0);

	var uncollapsed_count = 0,
		sum               = 0;
	for (var i=0; i<col_count; i++)
	{
		var col       = this.body_info.outers.item(i);
		var collapsed = col.hasClass(Y.PageLayout.collapsed_horiz_class);
		var modules   = this.body_info.modules[i];
		if (collapsed || col_widths[i] < 0)
		{
			col_widths[i] = 0;
			if (collapsed)
			{
				col.setStyle('width', 'auto');
				modules.item(0).setStyle('width', 'auto');
			}
			else if (has_explosive_modules_bug)
			{
				var children = modules.item(0)._page_layout.children;
				if (children.bd)
				{
					var root_w = children.bd.totalWidth() + modules.item(j).horizMarginBorderPadding();
					children.root.setStyle('width', root_w+'px');
					col.setStyle('width', root_w+'px');
				}
			}

			body_width -= col.totalWidth();
		}
		else
		{
			uncollapsed_count++;
			sum += col_widths[i];

			if (modules.size() == 1)
			{
				modules.item(0).setStyle('height', 'auto');
			}
		}
	}

	if (uncollapsed_count < col_count)
	{
		for (var i=0; i<col_count; i++)
		{
			col_widths[i] *= (100.0 / sum);
		}
	}

	// set width of each column and size of each module

	var total_w  = 0,
		m        = 0,
		ftc_size = [];
	for (var i=0; i<col_count; i++)
	{
		if (col_widths[i] == 0)
		{
			var module   = this.body_info.modules[i].item(0);
			var children = module._page_layout.children;
			if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
			{
				var h = getHeight(col_heights[i], row_heights, i, 0, module, module_info);
				module.setStyle('height', h+'px');

				if (children.bd)
				{
					var h1 = adjustHeight(h, children);
					var w1 = children.bd.insideWidth();
					this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
					children.bd.setStyle('height', h1+'px');
					this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
				}
			}
			else if (children.bd)
			{
				this.fire('beforeResizeModule', { bd: children.bd, height: 'auto', width: 'auto' });

				children.root.setStyle('height', 'auto');
				children.bd.setStyle('height', 'auto');

				if (match_heights)
				{
					ftc_size.push([ [children.bd, children.bd.insideWidth()] ]);
				}
				else
				{
					this.fire('afterResizeModule',
					{
						bd:     children.bd,
						height: children.bd.insideHeight(),
						width:  children.bd.insideWidth()
					});
				}
			}
			continue;
		}
		m++;

		var w    = Math.max(1, Math.floor(body_width * col_widths[i] / 100.0));
		total_w += w;
		if (m == uncollapsed_count)
		{
			w += body_width - total_w;
		}

		w = Math.max(1, w - this.body_info.outers.item(i).horizMarginBorderPadding());
		this.body_info.outers.item(i).setStyle('width', w+'px');
		w = Math.max(1, w - this.body_info.modules[0].item(0).horizMarginBorderPadding());

		var modules = this.body_info.modules[i];
		if (mode === Y.PageLayout.FIT_TO_VIEWPORT)
		{
			// adjust for vertically collapsed or fixed height modules

			var total_h    = 0;
			var open_count = modules.size();
			var count      = open_count;
			for (var j=0; j<count; j++)
			{
				var h = row_heights[i][j];
				if (h < 0)
				{
					total_h += modules.item(j).totalHeight();
					open_count--;
				}
			}

			// set the height of each module

			var k = 0;
			for (var j=0; j<count; j++)
			{
				var module   = modules.item(j);
				var children = module._page_layout.children;
				if (row_heights[i][j] < 0)
				{
					var h1 = children.bd.insideHeight();
					var w1 = w - children.root.horizMarginBorderPadding() -
							 children.bd.horizMarginBorderPadding();
					this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
					module.setStyle('width', w+'px');
					this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
					continue;
				}
				k++;

				if (children.bd)
				{
					var h    = getHeight(col_heights[i], row_heights, i, j, module, module_info);
					var h1   = adjustHeight(h, children);
					total_h += h + module_info.mbp;

					if (k == open_count)
					{
						h1 += body_height - total_h;
					}

					var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
					this.fire('beforeResizeModule', { bd: children.bd, height: h1, width: w1 });
					this._setWidth(children, w);
					children.bd.setStyle('height', h1+'px');
					this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
				}
			}
		}
		else
		{
			// set the width of each module
			// clear the height of each module

			ftc_size.push([]);
			var count = modules.size();
			for (var j=0; j<count; j++)
			{
				var children = modules.item(j)._page_layout.children;
				if (children.bd)
				{
					var w1 = Math.max(1, w - children.bd.horizMarginBorderPadding());
					this.fire('beforeResizeModule', { bd: children.bd, height: 'auto', width: w1 });
					this._setWidth(children, w);
					children.root.setStyle('height', 'auto');
					children.bd.setStyle('height', 'auto');

					if (match_heights)
					{
						ftc_size[i].push([children.bd, w1]);
					}
					else
					{
						this.fire('afterResizeModule',
						{
							bd:     children.bd,
							height: children.bd.insideHeight(),
							width:  w1
						});
					}
				}
			}
		}
	}

	// set the height of the last module in each column

	if (mode === Y.PageLayout.FIT_TO_CONTENT && match_heights)
	{
		var h = 0;
		for (var i=0; i<col_count; i++)
		{
			h = Math.max(h, this.body_info.outers.item(i).get('offsetHeight'));
		}

		for (var i=0; i<col_count; i++)
		{
			var modules = this.body_info.modules[i],
				count   = modules.size(),
				module  = null,
				w1      = 0;
			for (var j=count-1; j>=0; j--)
			{
				var module1 = modules.item(j);
				if (count == 1 ||
					(!module &&
					 !module1.hasClass(Y.PageLayout.collapsed_vert_class) &&
					 this.body_info.inner_sizes[i][j] > 0))
				{
					module = module1;
					w1     = ftc_size[i][j][1];
				}
				else
				{
					var bd = ftc_size[i][j][0];
					this.fire('afterResizeModule',
					{
						bd:     bd,
						height: bd.insideHeight(),
						width:  ftc_size[i][j][1]
					});
				}
			}

			if (module)
			{
				var delta = h - this.body_info.outers.item(i).get('offsetHeight');
				if (delta > 0 && module.get('parentNode').hasClass(Y.PageLayout.collapsed_horiz_class))
				{
					module.setStyle('height', (module.insideHeight() + delta)+'px');
				}
				else	// always fire afterResizeModule
				{
					var children = module._page_layout.children;
					if (children.bd)
					{
						var h1 = children.bd.insideHeight() + delta;
						module.setStyle('height', 'auto');
						children.bd.setStyle('height', h1+'px');
						this.fire('afterResizeModule', { bd: children.bd, height: h1, width: w1 });
					}
				}
			}
		}
	}
};


}, 'gallery-2013.06.13-01-19', {"requires": ["gallery-layout"]});
