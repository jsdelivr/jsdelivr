YUI.add('gallery-matrix-background', function(Y) {

"use strict";

/**
 * @module gallery-matrix-background
 */

// Based on my ancient JMatrixCtrl MFC widget

/**
 * Node plugin to display falling text similar to what was used in the
 * credits for The Matrix.  If you plug into the body element, then it will
 * fill the viewport.  Otherwise, you must set a width and height for the
 * node.
 * 
 * @main gallery-matrix-background
 * @class MatrixBackground
 * @constructor
 * @param config {Object} Plugin configuration
 */
function MatrixBackground(config)
{
	this.timer   = {};
	this.cell_on = [];

	MatrixBackground.superclass.constructor.call(this, config);
}

MatrixBackground.NAME = 'MatrixBackgroundPlugin';
MatrixBackground.NS   = 'matrix';

MatrixBackground.ATTRS =
{
	/**
	 * The range of Unicode characters to use for the background noise.
	 * 
	 * @attribute charRange
	 * @type {Array}
	 * @default ['\u30A1', '\u30FA']
	 */
	charRange:
	{
		value: ['\u30A1', '\u30FA'],
		validator: function(value)
		{
			return (Y.Lang.isArray(value) && value.length == 2 &&
					value[0].length == 1 && value[1].length == 1 &&
					value[0] < value[1]);
		}
	},

	/**
	 * Set to `true` to force a monospace font.  This only works if the
	 * browser can find a monospace version of the character range which
	 * you are using.
	 *
	 * @attribute monospace
	 * @type {Boolean}
	 * @default false
	 */
	monospace:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * If you do not have a monospace font for the charRange, set this to
	 * `true` to computer the widest character in the range.  Note that
	 * this can take a long time if you have a large charRange!
	 *
	 * @attribute computeWidestChar
	 * @type {Boolean}
	 * @default false
	 */
	computeWidestChar:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * Fraction of total columns that have a spinning character.
	 * 
	 * @attribute spinFraction
	 * @type {Number}
	 * @default 0.2
	 */
	spinFraction:
	{
		value: 0.2,
		validator: function(value)
		{
			return (0.0 <= value && value <= 1.0);
		}
	}
};

var interval =
	{
		spin: 10,
		drop: 80
	},

	drop_bottom_offset = 3,		// minimum number of rows affected by column drop

	min_spin_count = 300,
	max_spin_count = 800;

function rnd(min, max)
{
	return min + Math.floor(Math.random() * (max - min));
}

function getCharacterRange()
{
	var c_range = this.get('charRange');
	return [ c_range[0].charCodeAt(0), c_range[1].charCodeAt(0) ];
}

function getCell(x,y)
{
	return Y.Node.getDOMNode(this.table).firstChild.childNodes[y].childNodes[x];
}

function startTimer(id)
{
	stopTimer.call(this, id);

	this.timer[id] = Y.later(interval[id], this, function()
	{
		this.fire(id);
	},
	null, true);
}

function stopTimer(id)
{
	if (this.timer[id])
	{
		this.timer[id].cancel();
		delete this.timer[id];
	}
}

function renderTable()
{
	if (this.table)
	{
		this.table.destroy();
	}

	var c_range = getCharacterRange.call(this),
		c       = String.fromCharCode(c_range[0]);
	this.container.set('innerHTML',
		'<table><tr><td>' + c + '</td></tr></table>');

	var table = this.container.one('table');
	if (this.get('computeWidestChar'))
	{
		var c_max = c_range[0],
			w_max = table.totalWidth(),
			c_end = c_range[1],
			cell  = Y.Node.getDOMNode(this.container).getElementsByTagName('td')[0];
		for (c=c_max+1; c<=c_end; c++)
		{
			cell.innerHTML = String.fromCharCode(c);
			var w          = table.totalWidth();
			if (w > w_max)
			{
				w_max = w;
				c_max = c;
			}
		}

		cell.innerHTML = c = String.fromCharCode(c_max);
	}

	var w = Math.ceil(this.container.totalWidth() / table.totalWidth()),
		h = Math.ceil(this.container.totalHeight() / table.totalHeight());

	var row = '<tr>';
	for (var x=0; x<w; x++)
	{
		row += '<td>&nbsp;</td>';
	}
	row += '</tr>';

	var s = '';
	for (var y=0; y<h; y++)
	{
		s += row;
	}

	// force column widths with row outside bounds (&nbsp; forces row heights)

	s += '<tr>';
	for (var x=0; x<w; x++)
	{
		s += '<td>' + c + '</td>';
	}
	s += '</tr>';

	table.setContent('<tbody>' + s + '</tbody>');

	this.table     = table;
	this.row_count = h;
	this.col_count = w;

	this.drop_active = 0;
	this.drop_col    = [];
	for (var i=0; i<w; i++)
	{
		this.drop_col.push({ active: false });
	}

	startTimer.call(this, 'drop');

	initSpin.call(this);
	startTimer.call(this, 'spin');
}

function initSpin()
{
	this.spin_count  = Math.floor(this.col_count * this.get('spinFraction'));
	this.spin_active = 0;
	this.spin        = [];
	for (var i=0; i<this.spin_count; i++)
	{
		this.spin.push({ active: false });
	}
}

function initDropColumn(x)
{
	var col    = this.drop_col[x];
	col.active = true;
	col.y      = Math.random() < 0.5 ? rnd(0, this.row_count - drop_bottom_offset) : 0;

	if (Math.random() < 0.5)
	{
		col.y_max = col.y + rnd(drop_bottom_offset, this.row_count - col.y - 1)
	}
	else
	{
		col.y_max = this.row_count - 1;
	}

	if (Math.random() < 0.2)
	{
		col.c = '&nbsp;';
	}
	else
	{
		var c_range = getCharacterRange.call(this);
		col.c       = String.fromCharCode(rnd(c_range[0], c_range[1]+1));
	}
}

function updateDrop()
{
	// increment all active columns

	var count   = this.col_count,
		c_range = getCharacterRange.call(this);
	for (var i=0; i<count; i++)
	{
		var col = this.drop_col[i];
		if (col.active && col.y >= col.y_max)
		{
			col.active = false;
			this.drop_active--;
		}
		else
		{
			if (col.c != '&nbsp;')
			{
				col.c = String.fromCharCode(rnd(c_range[0], c_range[1]+1));
			}
			col.y++;
		}
	}

	// activate another column

	if (this.drop_active < this.col_count)
	{
		var safety = 0;
		do
		{
			var i = rnd(0, this.col_count);
			safety++;
		}
			while (this.drop_col[i].active && safety < this.col_count);

		if (!this.drop_col[i].active)
		{
			initDropColumn.call(this, i);
			this.drop_active++;
		}
	}

	update.call(this);
}

function updateSpin()
{
	// activate another spinner

	if (this.spin_active < this.spin_count && rnd(0,100) === 0)
	{
		var safety = 0;
		do
		{
			var i = rnd(0, this.spin_count);
			safety++;
		}
			while (this.spin[i].active && safety < this.spin_count);

		if (!this.spin[i].active)
		{
			var x = rnd(0, this.col_count),
				y = rnd(0, this.row_count);

			this.spin[i] =
			{
				active:  true,
				counter: rnd(min_spin_count, max_spin_count),
				cell:    getCell.call(this, x, y)
			};

			this.spin_active++;
		}
	}

	// increment all active spinners

	var count   = this.spin_count,
		c_range = getCharacterRange.call(this);
	for (var i=0; i<count; i++)
	{
		var spin = this.spin[i];
		if (spin.active && spin.counter <= 0)
		{
			spin.active = false;
			spin.cell   = null;
			this.spin_active--;
		}
		else if (spin.active)
		{
			spin.c = String.fromCharCode(rnd(c_range[0], c_range[1]+1));
			spin.counter--;
		}
	}

	update.call(this);
}

function update()
{
	var count = this.cell_on.length;
	for (var i=0; i<count; i++)
	{
		Y.DOM.removeClass(this.cell_on[i], 'on');
	}
	this.cell_on = [];

	var count = this.col_count;
	for (var i=0; i<count; i++)
	{
		var col = this.drop_col[i];
		if (col.active)
		{
			var cell = getCell.call(this, i, col.y);
			Y.DOM.addClass(cell, 'on');
			this.cell_on.push(cell);
			cell.innerHTML = col.c;
		}
	}

	var count = this.spin_count;
	for (var i=0; i<count; i++)
	{
		var spin = this.spin[i];
		if (spin.active)
		{
			Y.DOM.addClass(spin.cell, 'on');
			this.cell_on.push(spin.cell);
			spin.cell.innerHTML = spin.c;
		}
	}
}

function updateMonospace()
{
	if (this.get('monospace'))
	{
		this.container.addClass('monospace');
	}
	else
	{
		this.container.removeClass('monospace');
	}
}

function resize()
{
	if (this.is_body)
	{
		this.container.setStyles(
		{
			width:  Y.DOM.winWidth() + 'px',
			height: Y.DOM.winHeight() + 'px'
		});
	}
	else
	{
		var host = this.get('host');
		this.container.setStyles(
		{
			width:  host.getStyle('width'),
			height: host.getStyle('height')
		});
	}

	renderTable.call(this);
}

Y.extend(MatrixBackground, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var host = this.get('host');
		host.removeClass('yui3-matrixbkgd-loading');

		this.container = Y.Node.create('<div class="yui3-matrixbkgd"></div>');
		host.append(this.container);

		updateMonospace.call(this);
		this.after('charRangeChange', renderTable);
		this.after('monospaceChange', updateMonospace);
		this.after('spinFractionChange', initSpin);

		this.on('drop', updateDrop);
		this.on('spin', updateSpin);

		if (host == Y.one('body'))
		{
			this.is_body = true;
			Y.on('windowresize', resize, host, this);
		}

		this.afterHostMethod('setStyle', function(name, value)
		{
			if (name == 'width' || name == 'height')
			{
				resize.call(this);
			}
		});

		this.afterHostMethod('setStyles', function(map)
		{
			if (map.width || map.height)
			{
				resize.call(this);
			}
		});

		this.afterHostMethod('addClass', resize);
		this.afterHostMethod('removeClass', resize);
		this.afterHostMethod('replaceClass', resize);

		resize.call(this);
	},

	destructor: function()
	{
		stopTimer.call(this, 'drop');
		stopTimer.call(this, 'spin');

		if (this.table)
		{
			this.table.destroy();
		}
	}
});

Y.namespace("Plugin");
Y.Plugin.MatrixBackground = MatrixBackground;

// for use by gallery-matrix-credits

Y.mix(Y.Plugin.MatrixBackground,
{
	rnd:        rnd,
	startTimer: startTimer,
	stopTimer:  stopTimer,

	getCharacterRange: getCharacterRange
});


}, 'gallery-2012.06.13-20-30' ,{requires:['node-pluginhost','plugin','gallery-dimensions','node-screen','event-resize'], skinnable:true});
