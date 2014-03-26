YUI.add('gallery-anim-class', function(Y) {

"use strict";

/**********************************************************************
 * <p>Adds CSS class animation to `Y.Anim`, so you can specify `cssClass`
 * in `from` and/or `to`.  At the end of the animation, the `from` class is
 * replaced by the `to` class, and all the individual styles used during
 * the animation are removed.</p>
 * 
 * <p>Explicit entries in `from` or `to` override values set by cssClass.</p>
 * 
 * @module gallery-anim-class
 */

var css_attribute =
[
	"top","bottom","left","right","width","height",
	"maxHeight","maxWidth","minHeight","minWidth",

	"color","fontSize","fontSizeAdjust","fontWeight",
	"textIndent","textShadow","wordSpacing",

	"backgroundColor","backgroundPosition","backgroundSize",
	"outlineColor","outlineWidth",

	"marginTop","marginRight","marginBottom","marginLeft",

	"borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth",
	"borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius",
	"borderTopColor","borderRightColor","borderBottomColor","borderLeftColor",
	"borderSpacing",

	"paddingTop","paddingRight","paddingBottom","paddingLeft",

	"zIndex","opacity",

	"boxShadow",
	"letterSpacing","lineHeight",
	"markerOffset",
	"orphans","widows",
	"size",

	"fillOpacity",
	"outlineOffset",
	"floodColor","floodOpacity","lightingColor","stopColor","stopOpacity",
	"stroke","strokeDashoffset","strokeMiterlimit","strokeOpacity","strokeWidth"
];

function updateBehaviors()
{
	if (!Y.Anim.behaviors.outlineColor)
	{
		Y.Anim.behaviors.outlineColor = Y.Anim.behaviors.color;
	}
}

function getStyles(node)
{
	return Y.map(css_attribute, function(attr)
	{
		return node.getStyle(attr);
	});
}

function isValidAttributeValue(s)
{
	return /[#0-9]/.test(s);	// # covers colors like #AABBCC
}

function initialState(node, from, to)
{
	if (to.cssClass)
	{
		node.removeClass(to.cssClass);
	}
	if (from.cssClass)
	{
		node.addClass(from.cssClass);
	}
}

function finalState(node, from, to)
{
	if (from.cssClass)
	{
		node.removeClass(from.cssClass);
	}
	if (to.cssClass)
	{
		node.addClass(to.cssClass);
	}
}

var orig_start = Y.Anim.prototype._start;
Y.Anim.prototype._start = function()
{
	var node = this.get('node'),
		from = this.get('from') || {},
		to   = this.get('to')   || {};

	updateBehaviors();	// patch after anim extensions are loaded

	delete this._class_diff_attr;
	if (from.cssClass || to.cssClass)
	{
		finalState(node, from, to);
		var new_style = getStyles(node);

		// second, so initial state is correct in forward case

		initialState(node, from, to);
		var orig_style = getStyles(node);

		if (this.get('reverse'))
		{
			finalState(node, from, to);
		}

		this._class_diff_attr =
		{
			fromClass: from.cssClass,
			from:      [],
			toClass:   to.cssClass,
			to:        []
		};
		Y.each(new_style, function(style, i)
		{
			var orig = orig_style[i];
			if (style !== orig)
			{
				var attr = css_attribute[i];
				if (!from[attr] && isValidAttributeValue(orig))
				{
					this._class_diff_attr.from.push(attr);
					from[attr] = orig;
				}
				if (!to[attr] && isValidAttributeValue(style))
				{
					this._class_diff_attr.to.push(attr);
					to[attr] = style;
				}
			}
		},
		this);

		delete from.cssClass;
		this.set('from', from);

		delete to.cssClass;
		this.set('to', to);
	}

	orig_start.apply(this, arguments);
};

var orig_runFrame = Y.Anim.prototype._runFrame;
Y.Anim.prototype._runFrame = function()
{
	// The first frame doesn't happen immediately, so _start() has to leave
	// the original class in place.

	var reverse = this.get('reverse');
	if (!reverse && this._class_diff_attr && this._class_diff_attr.fromClass)
	{
		this.get('node').removeClass(this._class_diff_attr.fromClass);
	}
	else if (reverse && this._class_diff_attr && this._class_diff_attr.toClass)
	{
		this.get('node').removeClass(this._class_diff_attr.toClass);
	}

	orig_runFrame.apply(this, arguments);
};

var orig_end = Y.Anim.prototype._end;
Y.Anim.prototype._end = function()
{
	if (this._class_diff_attr)
	{
		var node = this.get('node'),
			from = this.get('from') || {},
			to   = this.get('to')   || {};

		Y.each(this._class_diff_attr.from, function(attr)
		{
			delete from[attr];
		});

		from.cssClass = this._class_diff_attr.fromClass;
		this.set('from', from);

		Y.each(this._class_diff_attr.to, function(attr)
		{
			delete to[attr];
			node.setStyle(attr, '');
		});

		to.cssClass = this._class_diff_attr.toClass;
		this.set('to', to);

		if (this.get('reverse'))
		{
			initialState(node, from, to);
		}
		else
		{
			finalState(node, from, to);
		}
	}

	orig_end.apply(this, arguments);
};


}, 'gallery-2012.05.16-20-37' ,{requires:['anim-base','node-style','gallery-funcprog']});
