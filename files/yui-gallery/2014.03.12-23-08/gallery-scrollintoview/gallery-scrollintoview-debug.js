YUI.add('gallery-scrollintoview', function (Y, NAME) {

"use strict";

/**
 * @module gallery-scrollintoview
 */

var scrollBodyParent = (YUI.Env.UA.gecko > 0 || YUI.Env.UA.opera > 0);

/**
 * Only scrolls if the object is not currently visible.
 * 
 * This requires that all scrollable elements have position:relative.
 * Otherwise, this algorithm will skip over them with unpredictable
 * results.
 * 
 * @main gallery-scrollintoview
 * @class Node~scrollIntoView
 */

function scrollContainer(node)
{
	var info = node.scrollIntoViewData;
	while (1)
	{
		var hit_top = (info.a.offsetParent === null);

		var a = Y.one(info.a),
			b = (Y.Node.getDOMNode(a) === Y.config.doc.body),
			w = b ? Y.DOM.winWidth() : info.a.clientWidth,
			h = b ? Y.DOM.winHeight() : info.a.clientHeight;
		if (info.a.scrollWidth - a.horizMarginBorderPadding() > w ||
			info.a.scrollHeight - a.vertMarginBorderPadding() > h)
		{
			break;
		}
		else if (hit_top)
		{
			node.fire('scrollIntoViewFinished');
			node.scrollIntoViewData = null;
			return false;
		}

		info.r.move(info.a.offsetLeft - info.a.scrollLeft, info.a.offsetTop - info.a.scrollTop);
		info.a = info.a.offsetParent || info.a.parentNode;
	}

	var scrollX = (hit_top ? Y.config.doc.documentElement.scrollLeft || Y.config.doc.body.scrollLeft : info.a.scrollLeft);
	var scrollY = (hit_top ? Y.config.doc.documentElement.scrollTop || Y.config.doc.body.scrollTop : info.a.scrollTop);

	var d =
	{
		top:    scrollY,
		bottom: scrollY + (hit_top ? Y.DOM.winHeight() : info.a.clientHeight),
		left:   scrollX,
		right:  scrollX + (hit_top ? Y.DOM.winWidth() : info.a.clientWidth)
	};

	if (hit_top && info.margin)
	{
		d.top    += info.margin.top    || 0;
		d.bottom -= info.margin.bottom || 0;
		d.left   += info.margin.left   || 0;
		d.right  -= info.margin.right  || 0;
	}

	var dy = 0;
	if (a.getStyle('overflowY') == 'hidden')
	{
		// don't scroll
	}
	else if (info.r.top < d.top)
	{
		dy = info.r.top - d.top;
	}
	else if (info.r.bottom > d.bottom)
	{
		dy = Math.min(info.r.bottom - d.bottom, info.r.top - d.top);
	}

	var dx = 0;
	if (a.getStyle('overflowX') == 'hidden')
	{
		// don't scroll
	}
	else if (info.r.left < d.left)
	{
		dx = info.r.left - d.left;
	}
	else if (info.r.right > d.right)
	{
		dx = Math.min(info.r.right - d.right, info.r.left - d.left);
	}

	if (hit_top)
	{
		if (dx || dy)
		{
			if (info.anim)
			{
				var body = Y.one('body');
				if (scrollBodyParent)
				{
					body = body.get('parentNode');
				}

				info.anim.setAttrs(
				{
					node: body,
					to:
					{
						scrollLeft: body.get('scrollLeft') + dx,
						scrollTop:  body.get('scrollTop') + dy
					}
				});

				info.anim.once('end', function()
				{
					node.fire('scrollIntoViewFinished');
				});
				info.anim.run();
			}
			else
			{
				window.scrollBy(dx, dy);
				node.fire('scrollIntoViewFinished');
			}
		}
		else if (info.anim)
		{
			Y.later(0, null, function()
			{
				node.fire('scrollIntoViewFinished');
			});
		}

		node.scrollIntoViewData = null;
		return false;
	}

	if (dx || dy)
	{
		if (info.anim)
		{
			info.anim.setAttrs(
			{
				node: Y.one(info.a),
				to:
				{
					scrollLeft: info.a.scrollLeft + dx,
					scrollTop:  info.a.scrollTop + dy
				}
			});

			info.anim.once('end', function()
			{
				info.r.move(info.a.offsetLeft - info.a.scrollLeft, info.a.offsetTop - info.a.scrollTop);
				info.a = info.a.offsetParent;
				scrollContainer(node);
			});
			info.anim.run();
		}
		else
		{
			info.a.scrollLeft += dx;
			info.a.scrollTop  += dy;

			info.r.move(info.a.offsetLeft - info.a.scrollLeft, info.a.offsetTop - info.a.scrollTop);
			info.a = info.a.offsetParent;
		}
	}
	else if (info.anim)
	{
		Y.later(0, null, function()
		{
			info.r.move(info.a.offsetLeft - info.a.scrollLeft, info.a.offsetTop - info.a.scrollTop);
			info.a = info.a.offsetParent;
			scrollContainer(node);
		});
	}
	else
	{
		info.r.move(info.a.offsetLeft - info.a.scrollLeft, info.a.offsetTop - info.a.scrollTop);
		info.a = info.a.offsetParent;
	}

	return true;
}

/**
 * To receive notification of when the animation finishes, subscribe to the
 * event `scrollIntoViewFinished` on the Y.Node instance.  For consistency,
 * this event always fires, even without animation.
 * 
 * If you modify the ancestor chain while the animation is running, the
 * results will be unpredictable.
 *
 * @method scrollIntoView
 * @param [config] configuration
 * @param [config.anim] true to use default duration and easing, or object
 * @param [config.anim.duration] duration of animation
 * @param [config.anim.easing] easing used during animation
 * @param [config.margin] viewport margins, to avoid ending up under an element with `position:fixed`
 * @param [config.margin.top] top margin (px)
 * @param [config.margin.bottom] bottom margin (px)
 * @param [config.margin.left] left margin (px)
 * @param [config.margin.right] right margin (px)
 * @chainable
 */
Y.Node.prototype.scrollIntoView = function(config)
{
	if (this.scrollIntoViewData)
	{
		return this;
	}

	var ancestor = Y.Node.getDOMNode(this.get('offsetParent'));
	if (!ancestor)
	{
		return this;
	}

	var r =
	{
		top:    this.get('offsetTop'),
		bottom: this.get('offsetTop') + this.get('offsetHeight'),
		left:   this.get('offsetLeft'),
		right:  this.get('offsetLeft') + this.get('offsetWidth')
	};

	r.move = function(
		/* int */	dx,
		/* int */	dy)
	{
		this.top    += dy;
		this.bottom += dy;
		this.left   += dx;
		this.right  += dx;
	};

	this.scrollIntoViewData =
	{
		a: ancestor,
		r: r
	}

	config                         = config || {};
	this.scrollIntoViewData.margin = config.margin;

	if (config.anim)
	{
		var anim_config = {};
		if (Y.Lang.isObject(config.anim))
		{
			Y.mix(anim_config, config.anim);
		}
		this.scrollIntoViewData.anim = new Y.Anim(anim_config);

		scrollContainer(this);
	}
	else
	{
		while (scrollContainer(this))
		{
			// do it again
		}
	}

	return this;
};


}, 'gallery-2013.06.13-01-19', {"requires": ["gallery-dimensions", "dom-screen"]});
