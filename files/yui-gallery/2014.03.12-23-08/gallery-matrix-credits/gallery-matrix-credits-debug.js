YUI.add('gallery-matrix-credits', function(Y) {

"use strict";

/**
 * @module gallery-matrix-credits
 */

// Based on my ancient JMatrixCtrl MFC widget

/**
 * Widget to display text similar to what was used in the credits for The
 * Matrix.  If you render the widget into the body, then it will fill the
 * viewport.  Otherwise, you must specify a width and height for the
 * widget.
 * 
 * @main gallery-matrix-credits
 * @class MatrixCredits
 * @constructor
 * @param config {Object} Widget configuration
 */
function MatrixCredits(config)
{
	this.timer = {};

	MatrixCredits.superclass.constructor.call(this, config);
}

MatrixCredits.NAME = 'matrixcredits';

MatrixCredits.ATTRS =
{
	/**
	 * The sequence of messages to display.  Each item defines `intro`, a
	 * list of strings to display immediately, `lines`, a list of strings
	 * to phase in one at a time, and (optional) `pause`, the number of
	 * milliseconds to wait before continuing to the next item in the
	 * sequence.
	 *
	 * @attribute textSequence
	 * @type {Array}
	 * @required
	 */
	textSequence:
	{
		value:     [],
		validator: Y.Lang.isArray
	},

	/**
	 * Milliseconds to wait before starting the text sequence.
	 *
	 * @attribute introDelay
	 * @type {Number}
	 * @default 5000
	 */
	introDelay:
	{
		value:     5000,
		validator: Y.Lang.isNumber
	},

	/**
	 * Overridden by `pause` values in `textSequence`.
	 *
	 * @attribute pagePause
	 * @type {Number}
	 * @default 2000
	 */
	pagePause:
	{
		value:     2000,
		validator: Y.Lang.isNumber
	},

	/**
	 * Milliseconds to wait before restarting the text sequence.
	 * Overridden by `pause` value of last item in `textSequence`.
	 *
	 * @attribute restartDelay
	 * @type {Number}
	 * @default 5000
	 */
	restartDelay:
	{
		value:     5000,
		validator: Y.Lang.isNumber
	},

	/**
	 * <dl>
	 * <dt>none</dt><dd>Each line is drawn all at once and then begins to phase in.</dd>
	 * <dt>block</dt><dd>The text appears as a block cursor (\u2588) scans across the container.</dd>
	 * <dt>char</dt><dd>The text appears as a randomly changing character scans across the container.</dd>
	 * </dl>
	 *
	 * @attribute cursor
	 * @type {String}
	 * @default "block"
	 */
	cursor:
	{
		value: 'block',
		validator: function(value)
		{
			return value == 'none' || value == 'block' || value == 'char';
		}
	},

	/**
	 * The maximum number of iterations before a character is forced to the
	 * final value.  Each character stops changing when it hits the correct value
	 * or exceeds the maximum.  Specify zero to simply display the text.
	 *
	 * @attribute maxPhaseCount
	 * @type {Number}
	 * @default 20
	 */
	maxPhaseCount:
	{
		value:     20,
		validator: Y.Lang.isNumber
	},

	/**
	 * The range of Unicode characters to use for spinning characters.  For
	 * most interesting results, all the characters in textSequence should
	 * be in this range.
	 * 
	 * @attribute charRange
	 * @type {Array}
	 * @default ['!', '~']
	 */
	charRange:
	{
		value: ['!', '~'],
		validator: function(value)
		{
			return (Y.Lang.isArray(value) && value.length == 2 &&
					value[0].length == 1 && value[1].length == 1 &&
					value[0] < value[1]);
		}
	},

	/**
	 * @attribute background
	 * @type {Plugin.Base}
	 * @default {MatrixBackground}
	 * @writeonce
	 */
	background:
	{
		value:     Y.Plugin.MatrixBackground,
		writeOnce: true,
		validator: function(value)
		{
			return (value === null || (value instanceof Y.Plugin.Base));
		}
	},

	/**
	 * Configuration for Y.MatrixBackground
	 *
	 * @attribute backgroundConfig
	 * @type {Object}
	 * @writeonce
	 */
	backgroundConfig:
	{
		writeOnce: true
	}
};

var interval =
	{
		cursor: 30,
		spin:   10	// if possible, background's spin interval is used instead
	};

var rnd        = Y.Plugin.MatrixBackground.rnd;
var startTimer = Y.Plugin.MatrixBackground.startTimer;
var stopTimer  = Y.Plugin.MatrixBackground.stopTimer;

var getCharacterRange = Y.Plugin.MatrixBackground.getCharacterRange;

function scheduleNextPage()
{
	var pages = this.get('textSequence');
	var page  = pages[ this.page_index ];
	var key   = (this.page_index == pages.length - 1) ? 'restartDelay' : 'pagePause';
	Y.later(page.pause || this.get(key), this, nextPage);
}

function nextPage()
{
	var pages = this.get('textSequence');

	this.page_index++;
	if (this.page_index >= pages.length)
	{
		this.page_index = 0;
	}

	var page = pages[ this.page_index ];

	var intro = Y.reduce(page.intro || [], '', function(s, line)
	{
		return s + '<p>' + (line || '&nbsp;') + '</p>';
	});

	var lines = Y.reduce(page.lines || [], '', function(s, line)
	{
		s += '<p><span>';
		for (var i=0; i<line.length; i++)
		{
			s += '&nbsp;';
		}
		return s + '</span></p>';
	});

	this.frame.setContent(intro + lines);
	this.frame_top = Math.floor((this.get('height') - this.frame.totalHeight())/2);
	this.frame.setStyle('top', this.frame_top + 'px')

	if (page.lines)
	{
		this.frame_lines = this.frame.all('span');
		this.cursor_pt   = { row: -1, col: -1 };

		this.cursor_top = this.frame_top - this.frame.totalHeight();
		startCursor.call(this);
		startSpin.call(this);
	}
	else
	{
		scheduleNextPage.call(this);
	}
}

function startCursor()
{
	this.cursor.removeClass('hidden');
	startTimer.call(this, 'cursor');

	var lines = this.get('textSequence')[ this.page_index ].lines;
	do
		{
		this.cursor_pt.row++;
		}
		while (lines[ this.cursor_pt.row ] == '&nbsp;');

	this.cursor_pt.col = -1;
	this.spin_index    = 0;
	this.spin_count    = 0;
}

function stopCursor()
{
	this.cursor.addClass('hidden');
	this.cursor.setStyles({ top: 0, left: 0 });
	stopTimer.call(this, 'cursor');
}

function updateCursor()
{
	this.cursor_pt.col++;
	if (parseInt(this.cursor.getStyle('left'), 10) > this.get('width'))
	{
		stopCursor.call(this);
		checkLineFinished.call(this);
		return;
	}

	var left       = this.cursor_width * this.cursor_pt.col,
		frame_line = this.frame_lines.item(this.cursor_pt.row);
	this.cursor.setStyles(
	{
		top:  (this.cursor_top + frame_line.get('offsetTop'))+'px',
		left: left + 'px'
	});

	if (this.spin_index === 0 && left > frame_line.get('offsetLeft'))
	{
		this.spin_index++;
		this.spin_text = frame_line.get('innerHTML').replace(/&nbsp;/g, ' ').split('');
		this.end_text  = this.get('textSequence')[ this.page_index ].lines[ this.cursor_pt.row ].split('');
	}
	else if (0 < this.spin_index && this.spin_index < this.spin_text.length)
	{
		this.spin_index++;
	}
}

function startSpin()
{
	if (this.bkgd)
	{
		this.spin_handle = this.bkgd.on('spin', updateSpin, this);
	}
	else
	{
		startTimer.call(this, 'spin');
	}
}

function stopSpin()
{
	if (this.spin_handle)
	{
		this.spin_handle.detach();
		this.spin_handle = null;
	}
	else
	{
		stopTimer.call(this, 'spin');
	}
}

function updateSpin()
{
	if (this.timer.cursor && this.get('cursor') == 'char')
	{
		var c_range = getCharacterRange.call(this.bkgd || this);
		this.cursor.set('innerHTML', String.fromCharCode(rnd(c_range[0], c_range[1]+1)));
	}

	if (this.spin_index > 0)
	{
		var frame_line = this.frame_lines.item(this.cursor_pt.row),
			c_range    = getCharacterRange.call(this),
			done       = 0;

		for (var i=0; i<this.spin_index; i++)
		{
			if (this.spin_text[i] === this.end_text[i])
			{
				done++;
				continue;
			}

			this.spin_text[i] = String.fromCharCode(rnd(c_range[0], c_range[1]+1));
		}

		this.spin_count++;
		if (this.spin_count > this.get('maxPhaseCount'))
		{
			this.spin_text = this.end_text.slice(0);
			done           = this.spin_text.length;
		}

		frame_line.set('innerHTML', this.spin_text.join('').replace(/\s/g, '&nbsp;'));

		if (done >= this.spin_text.length)
		{
			stopSpin.call(this);
			checkLineFinished.call(this);
		}
	}
}

function checkLineFinished()
{
	if (this.timer.cursor || this.spin_handle || this.timer.spin)
	{
		return;
	}

	if (this.cursor_pt.row >= this.frame_lines.size() - 1)
	{
		scheduleNextPage.call(this);
	}
	else
	{
		startCursor.call(this);
		startSpin.call(this);
	}
}

function updateCursorAppearance()
{
	var type = this.get('cursor');
	if (type == 'block')
	{
		this.cursor.set('innerHTML', '\u2588');
	}
	else
	{
		this.cursor.set('innerHTML', '&nbsp;');
	}

	this.cursor_width = this.cursor.get('offsetWidth');
}

function resize()
{
	this.set('width', Y.DOM.winWidth());
	this.set('height', Y.DOM.winHeight());
}

Y.extend(MatrixCredits, Y.Widget,
{
	initializer: function(config)
	{
		this.on('cursor', updateCursor);
		this.on('spin', updateSpin);
	},

	destructor: function()
	{
		stopTimer.call(this, 'cursor');
	},

	bindUI: function()
	{
		// now widget has been inserted into the DOM

		if (this.get('boundingBox').ancestor() == Y.one('body'))
		{
			resize.call(this);
			Y.on('windowresize', resize, this);
		}
	},

	syncUI: function()
	{
		// now the size has been applied to bounding box

		var bkgd = this.get('background');
		if (bkgd)
		{
			var container = this.get('boundingBox');
			container.plug(bkgd, this.get('backgroundConfig'));
			this.bkgd = container.matrix;
		}

		this.frame = Y.Node.create('<div class="frame"></div>');
		this.get('contentBox').append(this.frame);

		this.cursor = Y.Node.create('<span class="cursor hidden"></span>');
		this.get('contentBox').append(this.cursor);
		updateCursorAppearance.call(this);
		this.after('cursorChange', updateCursorAppearance);

		this.page_index = -1;	// incremented by nextPage
		Y.later(this.get('introDelay'), this, nextPage);
	}
});

Y.MatrixCredits = MatrixCredits;


}, 'gallery-2012.06.13-20-30' ,{requires:['widget','gallery-matrix-background','gallery-funcprog'], skinnable:true});
