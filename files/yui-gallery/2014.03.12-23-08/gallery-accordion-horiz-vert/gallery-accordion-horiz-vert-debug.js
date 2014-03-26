YUI.add('gallery-accordion-horiz-vert', function (Y, NAME) {

"use strict";

var use_nonzero_empty_div = (0 < Y.UA.ie && Y.UA.ie < 8),
	browser_can_animate = !(0 < Y.UA.ie && Y.UA.ie < 8),
	section_min_size = (use_nonzero_empty_div ? 1 : 0);

/**********************************************************************
 * Widget to manage an accordion, either horizontally or vertically.
 * Allows either multiple open sections or only a single open section.
 * Provides option to always force at least one item to be open.
 * 
 * @module gallery-accordion-horiz-vert
 * @main gallery-accordion-horiz-vert
 */

/**
 * <p>An accordion can be constructed from existing markup or from strings
 * containing HTML.  Existing markup can be provided either by setting
 * `contentBox` or by specifying CSS selectors.  See the `titles` and
 * `sections` attributes.</p>
 * 
 * <p>When constructing from existing markup via `contentBox`, use an
 * unordered list (&lt;ul&gt;).  Each item must contain two &lt;div&gt;'s.
 * The first one is used as the section title, and the second one is used
 * as the section content.</p>
 * 
 * <p>Animation is optional.  If the anim module is not available,
 * animation is automatically turned off.</p>
 *
 * <p>When using a horizontal accordion:</p>
 * <ul>
 * <li>The widget's container must have a height.</li>
 * <li>Each title must have both a width and height.</li>
 * <li>Each section must have a width.</li>
 * </ul>
 * 
 * <p>IE doesn't accept zero height divs, so we use 1px height and zero
 * opacity.  IE6 doesn't always render correctly with opacity set, so if
 * animation is turned off, we don't use opacity at all.</p>
 * 
 * @class Accordion
 * @constructor
 * @param config {Object} Widget configuration
 */
function Accordion(config)
{
	config = config || {};
	if (Y.Lang.isUndefined(config.tabIndex))
	{
		config.tabIndex = null;
	}
	if (Y.Lang.isUndefined(config.horizontal))
	{
		config.horizontal = false;
	}

	Accordion.superclass.constructor.call(this, config);
}

function initAnimationFlag()
{
	return !Y.Lang.isUndefined(Y.Anim);
}

function filterAnimationFlag(value)
{
	return (value && browser_can_animate && !Y.Lang.isUndefined(Y.Anim));
}

Accordion.NAME = "accordion";

Accordion.ATTRS =
{
	/**
	 * Whether or not the accordion is horizontal.
	 * 
	 * @attribute horizontal
	 * @type {boolean}
	 * @default false
	 * @writeonce
	 */
	horizontal:
	{
		value:     false,
		writeOnce: true
	},

	/**
	 * A CSS selector for locating nodes, an array of nodes, or an array
	 * of strings containing markup.  This is used to define the initial
	 * set of section titles.
	 * 
	 * @attribute titles
	 * @type {String|Array}
	 * @writeonce
	 */
	titles:
	{
		writeOnce: true
	},

	/**
	 * Whether or not to replace the default title container node, when the
	 * supplied title is a node.  (If the supplied title is markup, it is
	 * always inserted inside the default title container.)
	 * 
	 * @attribute replaceTitleContainer
	 * @type {boolean}
	 * @default true
	 */
	replaceTitleContainer:
	{
		value:     true,
		validator: Y.Lang.isBoolean
	},

	/**
	 * A CSS selector for locating nodes, an array of nodes, or an array
	 * of strings containing markup.  This is used to define the initial
	 * set of section contents.
	 * 
	 * @attribute sections
	 * @type {String|Array}
	 * @writeonce
	 */
	sections:
	{
		writeOnce: true
	},

	/**
	 * Whether or not to replace the default section container node, when
	 * the supplied title is a node.  (If the supplied content is markup,
	 * it is always inserted inside the default section container.)
	 * 
	 * @attribute replaceSectionContainer
	 * @type {boolean}
	 * @default true
	 */
	replaceSectionContainer:
	{
		value:     true,
		validator: Y.Lang.isBoolean
	},

	/**
	 * Whether or not to allow all sections to be closed at the same time.
	 * If not, at least one section will always be open.
	 * 
	 * @attribute allowAllClosed
	 * @type {boolean}
	 * @default false
	 */
	allowAllClosed:
	{
		value:     false,
		validator: Y.Lang.isBoolean,
		setter: function(value)
		{
			// save internally so it can be modified without recursion
			this.allow_all_closed = value;
			return value;
		}
	},

	/**
	 * Whether or not to allow multiple sections to be open at the same
	 * time.  If not, at most one section at a time will be open.
	 * 
	 * @attribute allowMultipleOpen
	 * @type {boolean}
	 * @default false
	 */
	allowMultipleOpen:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * Whether or not to animate the initial rendering of the widget.
	 * 
	 * @attribute animateRender
	 * @type {boolean}
	 * @default false
	 */
	animateRender:
	{
		value:     false,
		writeOnce: true,
		validator: Y.Lang.isBoolean,
		setter:    filterAnimationFlag
	},

	/**
	 * Whether or not to animate insertion and removal of sections.
	 * 
	 * @attribute animateInsertRemove
	 * @type {boolean}
	 * @default true
	 */
	animateInsertRemove:
	{
		valueFn:   initAnimationFlag,
		validator: Y.Lang.isBoolean,
		setter:    filterAnimationFlag
	},

	/**
	 * Whether or not to animate opening and closing of sections.
	 * 
	 * @attribute animateOpenClose
	 * @type {boolean}
	 * @default true
	 */
	animateOpenClose:
	{
		valueFn:   initAnimationFlag,
		validator: Y.Lang.isBoolean,
		setter:    filterAnimationFlag
	},

	/**
	 * Duration of all animations.
	 * 
	 * @attribute animateDuration
	 * @type {int}
	 * @default whatever Y.Anim default is
	 */
	animateDuration:
	{
		value:     null,		// accept Y.Anim default
		validator: function(value)
		{
			return (value === null || Y.Lang.isNumber(value));
		}
	},

	/**
	 * Easing applied to all animations.
	 * 
	 * @attribute animateEasing
	 * @type {function}
	 * @default whatever Y.Anim default is
	 */
	animateEasing:
	{
		value:     null,		// accept Y.Anim default
		validator: function(value)
		{
			return (value === null || Y.Lang.isFunction(value));
		}
	}
};

Accordion.HTML_PARSER =
{
	titles: function(content_box)
	{
		return content_box.all('> li > div:nth-child(1)');
	},

	sections: function(content_box)
	{
		return content_box.all('> li > div:nth-child(2)');
	}
};

/**
 * @event beforeInsert
 * @description Fires before a section is inserted.
 * @param index {int} the insertion index
 */
/**
 * @event insert
 * @description Fires after a section is inserted.
 * @param index {int} the insertion index
 * @param size {int} the final size of the section title, after animation (if any)
 */

/**
 * @event beforeRemove
 * @description Fires before a section is removed.
 * @param index {int} the section index
 */
/**
 * @event remove
 * @description Fires after a section is removed.
 * @param index {int} the section index
 */

/**
 * @event beforeOpen
 * @description Fires before a section is opened.
 * @param index {int} the section index
 */
/**
 * @event open
 * @description Fires after a section is opened.
 * @param index {int} the section index
 */

/**
 * @event beforeClose
 * @description Fires before a section is closed.
 * @param index {int} the section index
 */
/**
 * @event close
 * @description Fires after a section is closed.
 * @param index {int} the section index
 */

var open_class   = Y.ClassNameManager.getClassName(Accordion.NAME, 'open');
var closed_class = Y.ClassNameManager.getClassName(Accordion.NAME, 'closed');

function cleanContainer(
	/* Node */	el)
{
	Y.Event.purgeElement(el, true);

	while (el.hasChildNodes())
	{
		el.removeChild(el.get('lastChild'));
	}
}

Y.extend(Accordion, Y.Widget,
{
	initializer: function(config)
	{
		this.section_list = [];

		this.get('allowAllClosed');	// force init of this.allow_all_closed

		if (this.get('horizontal'))
		{
			this.slide_style_name = 'width';
			this.slide_size_name  = 'offsetWidth';
			this.fixed_style_name = 'height';
			this.fixed_size_name  = 'offsetHeight';
		}
		else	// vertical
		{
			this.slide_style_name = 'height';
			this.slide_size_name  = 'offsetHeight';
			this.fixed_style_name = 'width';
			this.fixed_size_name  = 'offsetWidth';
		}

		this.after('allowMultipleOpenChange', function(e)
		{
			if (this.section_list && this.section_list.length > 0 &&
				!e.newVal)
			{
				this.closeAllSections();
			}
		});

		this.after('allowAllClosedChange', function(e)
		{
			if (this.section_list && this.section_list.length > 0 &&
				!e.newVal && this.allSectionsClosed())
			{
				this.toggleSection(0);
			}
		});
	},

	renderUI: function()
	{
		this.get('boundingBox').addClass(
			this.getClassName(this.get('horizontal') ? 'horiz' : 'vert'));

		var titles = this.get('titles');
		if (Y.Lang.isString(titles))
		{
			titles = Y.all(titles);
		}

		var sections = this.get('sections');
		if (Y.Lang.isString(sections))
		{
			sections = Y.all(sections);
		}

		if (titles instanceof Y.NodeList && sections instanceof Y.NodeList &&
			titles.size() == sections.size())
		{
			var save_animate_insert = this.get('animateInsertRemove');
			this.set('animateInsertRemove', this.get('animateRender'));

			var count = titles.size();
			for (var i=0; i<count; i++)
			{
				this.appendSection(titles.item(i), sections.item(i));
			}

			this.set('animateInsertRemove', save_animate_insert);
		}
		else if (titles instanceof Array && sections instanceof Array &&
				 titles.length == sections.length)
		{
			var save_animate_insert = this.get('animateInsertRemove');
			this.set('animateInsertRemove', this.get('animateRender'));

			var count = titles.length;
			for (var i=0; i<count; i++)
			{
				this.appendSection(titles[i], sections[i]);
			}

			this.set('animateInsertRemove', save_animate_insert);
		}
		else
		{
			Y.log('ignoring titles & sections', 'info', 'Accordion');
		}

		this.get('contentBox').all('> li').remove(true);
	},

	/**
	 * @method getSectionCount
	 * @return {int} total number of sections
	 */
	getSectionCount: function()
	{
		return this.section_list.length;
	},

	/**
	 * @method getTitle
	 * @param index {int} the section index
	 * @return {Node} the container for the section title
	 */
	getTitle: function(
		/* int */	index)
	{
		return this.section_list[index].title;
	},

	/**
	 * Sets the contents of the specified section title.
	 * 
	 * @method setTitle
	 * @param index {int} the section index
	 * @param title {String|Node} the title content
	 */
	setTitle: function(
		/* int */			index,
		/* string/object */	title)
	{
		var t = this.section_list[index].title;
		cleanContainer(t);

		var el;
		if (Y.Lang.isString(title))
		{
			var el = Y.one(title);
			if (!el)
			{
				t.set('innerHTML', title);
			}
		}
		else
		{
			el = title;
		}

		if (el && this.get('replaceTitleContainer'))
		{
			var p = t.get('parentNode');
			var n = t.get('nextSibling');
			p.removeChild(t);
			if (n)
			{
				p.insertBefore(el, n);
			}
			else
			{
				p.appendChild(el);
			}

			this.section_list[index].title = el;

			el.addClass(this.getClassName('title'));
			el.addClass(this.section_list[index].open ? open_class : closed_class);
		}
		else if (el)
		{
			t.appendChild(el);
		}

		if (use_nonzero_empty_div)
		{
			t.setStyle('display', t.get('innerHTML') ? '' : 'none');
		}

		// aria

		var clip = this.section_list[index].clip;

		t.setAttribute('aria-controls', clip.generateID());
		t.setAttribute('role', 'tab');

		clip.setAttribute('aria-labeledby', t.generateID());
		clip.setAttribute('role', 'tabpanel');
	},

	/**
	 * @method getSection
	 * @param index {int} the section index
	 * @return {Node} the container for the section content
	 */
	getSection: function(
		/* int */	index)
	{
		return this.section_list[index].content;
	},

	/**
	 * Sets the contents of the specified section.
	 * 
	 * @method setSection
	 * @param index {int} the section index
	 * @param content {String|Node} the section content
	 */
	setSection: function(
		/* int */			index,
		/* string/object */	content)
	{
		var d = this.section_list[index].content;
		cleanContainer(d);

		var el;
		if (Y.Lang.isString(content))
		{
			var el = Y.one(content);
			if (!el)
			{
				d.set('innerHTML', content);
			}
		}
		else
		{
			el = content;
		}

		if (el && this.get('replaceSectionContainer'))
		{
			var display = d.getStyle('display');

			var p = d.get('parentNode');
			var n = d.get('nextSibling');
			p.removeChild(d);
			if (n)
			{
				p.insertBefore(el, n);
			}
			else
			{
				p.appendChild(el);
			}

			this.section_list[index].content = el;

			el.addClass(this.getClassName('section'));
			el.addClass(this.section_list[index].open ? open_class : closed_class);
			el.setStyle('display', display);
		}
		else if (el)
		{
			d.appendChild(el);
		}
	},

	/**
	 * @method _getClip
	 * @protected
	 * @param index {int} the section index
	 * @return {Node} the clipping container for the section content
	 */
	_getClip: function(
		/* int */	index)
	{
		return this.section_list[index].clip;
	},

	/**
	 * Prepends the section to the accordion.
	 * 
	 * @method prependSection
	 * @param title {String|Node} the section title content
	 * @param content {String|Node} the section content
	 */
	prependSection: function(
		/* string/object */	title,
		/* string/object */	content)
	{
		return this.insertSection(0, title, content);
	},

	/**
	 * Appends the section to the accordion.
	 * 
	 * @method appendSection
	 * @param title {String|Node} the section title content
	 * @param content {String|Node} the section content
	 */
	appendSection: function(
		/* string/object */	title,
		/* string/object */	content)
	{
		return this.insertSection(this.section_list.length, title, content);
	},

	/**
	 * Inserts the section into the accordion at the specified location.
	 * 
	 * @method insertSection
	 * @param index {int} the insertion index
	 * @param title {String|Node} the section title content
	 * @param content {String|Node} the section content
	 */
	insertSection: function(
		/* int */			index,
		/* string/object */	title,
		/* string/object */ content)
	{
		this.fire('beforeInsert', index);

		// create title

		var t = Y.Node.create('<div/>');
		t.addClass(this.getClassName('title'));
		t.addClass(closed_class);

		// create content clipping

		var c = Y.Node.create('<div/>');
		c.addClass(this.getClassName('section-clip'));
		c.setStyle(this.slide_style_name, section_min_size+'px');
		c.setAttribute('aria-hidden', 'true');
		if (this.get('animateOpenClose'))
		{
			c.setStyle('opacity', 0);
		}

		// create content

		var d = Y.Node.create('<div/>');
		d.addClass(this.getClassName('section'));
		d.addClass(closed_class);
		d.setStyle('display', 'none');
		c.appendChild(d);

		// save in our list

		this.section_list.splice(index, 0,
		{
			title:   t,
			clip:    c,
			content: d,
			open:    false,
			anim:    null
		});

		// insert and show title

		if (index < this.section_list.length-1)
		{
			this.get('contentBox').insertBefore(t, this.section_list[index+1].title);
		}
		else
		{
			this.get('contentBox').appendChild(t);
		}

		this.setTitle(index, title);
		t = this.section_list[index].title;

		var size = t.get(this.slide_size_name);
		if (this.get('animateInsertRemove'))
		{
			t.setStyle(this.slide_style_name, section_min_size+'px');

			var params =
			{
				node: t,
				from:
				{
					opacity: 0
				},
				to:
				{
					opacity: 1
				}
			};

			params.to[ this.slide_style_name ] = size;

			var anim = this._createAnimator(params);

			anim.on('end', function(type, index)
			{	
				this.section_list[index].title.setStyle(this.slide_style_name, 'auto');
			},
			this, index);

			anim.run();
		}

		// insert content container

		if (content)
		{
			this.setSection(index, content);
			d = this.section_list[index].content;
		}

		if (index < this.section_list.length-1)
		{
			this.get('contentBox').insertBefore(c, this.section_list[index+1].title);
		}
		else
		{
			this.get('contentBox').appendChild(c);
		}

		// post processing

		this.fire('insert', index, size);

		if (!this.allow_all_closed && this.allSectionsClosed())
		{
			this.toggleSection(0);
		}

		// return containers for futher manipulation

		return { title: t, content: d };
	},

	/**
	 * Removes the specified section.
	 * 
	 * @method removeSection
	 * @param index {int} the section index
	 */
	removeSection: function(
		/* int */	index)
	{
		this.fire('beforeRemove', index);

		function onCompleteRemoveSection(type, args)
		{
			args[0].removeChild(args[1]);
			args[0].removeChild(args[2]);

			if (args[3])
			{
				this.fire('remove', index);
			}
		}

		var onCompleteArgs =
		[
			this.get('contentBox'),
			this.section_list[index].title,
			this.section_list[index].clip,
			true
		];

		if (this.get('animateInsertRemove'))
		{
			var params =
			{
				node: this.section_list[index].clip,
				from:
				{
					opacity: 1
				},
				to:
				{
					opacity: 0
				}
			};

			params.to[ this.slide_style_name ] = section_min_size;

			if (this.section_list[index].open)
			{
				this._startAnimator(index, params);
			}

			params.node = this.section_list[index].title;
			var anim    = this._createAnimator(params);
			anim.on('end', onCompleteRemoveSection, this, onCompleteArgs);
			anim.run();
		}
		else
		{
			onCompleteArgs[3] = false;
			onCompleteRemoveSection.call(this, null, onCompleteArgs);
		}

		this.section_list.splice(index, 1);

		if (!onCompleteArgs[3])
		{
			this.fire('remove', index);
		}

		if (!this.allow_all_closed && this.allSectionsClosed())
		{
			this.toggleSection(0);
		}
	},

	/**
	 * @method findSection
	 * @param {String|Node} any element inside the section or title
	 * @return {int} the index of the containing section, or -1 if not found
	 */
	findSection: function(
		/* string|element */	el)
	{
		el = Y.Node.getDOMNode(Y.one(el));

		var count = this.section_list.length;
		for (var i=0; i<count; i++)
		{
			var title   = Y.Node.getDOMNode(this.section_list[i].title);
			var content = Y.Node.getDOMNode(this.section_list[i].content);
			if (el == title   || Y.DOM.contains(title, el) ||
				el == content || Y.DOM.contains(content, el))
			{
				return i;
			}
		}

		return -1;
	},

	/**
	 * @method isSectionOpen
	 * @return {boolean} <code>true</code> if the section is open
	 */
	isSectionOpen: function(
		/* int */	index)
	{
		return this.section_list[index].open;
	},

	/**
	 * Open the specified section.
	 * 
	 * @method openSection
	 * @param index {int} the section index
	 */
	openSection: function(
		/* int */	index)
	{
		if (!this.section_list[index].open)
		{
			this.toggleSection(index);
		}
	},

	/**
	 * Close the specified section.
	 * 
	 * @method closeSection
	 * @param index {int} the section index
	 */
	closeSection: function(
		/* int */	index)
	{
		if (this.section_list[index].open)
		{
			this.toggleSection(index);
		}
	},

	/**
	 * @method allSectionsOpen
	 * @return {boolean} <code>true</code> if all sections are open
	 */
	allSectionsOpen: function()
	{
		var count = this.section_list.length;
		for (var i=0; i<count; i++)
		{
			if (!this.section_list[i].open)
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * @method allSectionsClosed
	 * @return {boolean} <code>true</code> if all sections are closed
	 */
	allSectionsClosed: function()
	{
		var count = this.section_list.length;
		for (var i=0; i<count; i++)
		{
			if (this.section_list[i].open)
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Show/hide the section content.
	 * 
	 * @method toggleSection
	 * @param index {int} the section index
	 */
	toggleSection: function(
		/* int */	index)
	{
		if (!this.section_list[index].open && !this.get('allowMultipleOpen'))
		{
			var save              = this.allow_all_closed;
			this.allow_all_closed = true;
			this.closeAllSections();
			this.allow_all_closed = save;
		}
		else if (this.section_list[index].open && !this.allow_all_closed)
		{
			this.section_list[index].open = false;
			if (this.allSectionsClosed())
			{
				this.section_list[index].open = true;
				return;
			}
			this.section_list[index].open = true;
		}

		function onCompleteOpenSection(type, index)
		{
			var clip = this.section_list[index].clip;
			clip.setStyle(this.slide_style_name, 'auto');
			clip.setAttribute('aria-hidden', 'false');
			this.fire('open', index);
		}

		function onCompleteCloseSection(type, index)
		{
			this.section_list[index].content.setStyle('display', 'none');
			this.section_list[index].clip.setAttribute('aria-hidden', 'true');
			this.fire('close', index);
		}

		if (!this.section_list[index].open)
		{
			this.section_list[index].content.setStyle('display', 'block');

			this.fire('beforeOpen', index);

			this.section_list[index].open = true;
			this.section_list[index].title.replaceClass(closed_class, open_class);
			this.section_list[index].content.replaceClass(closed_class, open_class);

			var size = this.section_list[index].content.get(this.slide_size_name);
			if (this.get('animateOpenClose'))
			{
				var params =
				{
					node: this.section_list[index].clip,
					from:
					{
						opacity: 0
					},
					to:
					{
						opacity: 1
					}
				};

				params.to[ this.slide_style_name ] = size;

				var anim = this._startAnimator(index, params);
				anim.on('end', onCompleteOpenSection, this, index);
			}
			else
			{
				var clip = this.section_list[index].clip;
				if (clip.getStyle('opacity') == '0')
				{
					clip.setStyle('opacity', 1);
				}
				onCompleteOpenSection.call(this, null, index);
			}
		}
		else
		{
			this.fire('beforeClose', index);

			this.section_list[index].open = false;
			this.section_list[index].title.replaceClass(open_class, closed_class);
			this.section_list[index].content.replaceClass(open_class, closed_class);

			if (this.get('animateOpenClose'))
			{
				var params =
				{
					node: this.section_list[index].clip,
					from:
					{
						opacity: 1
					},
					to:
					{
						opacity: 0
					}
				};

				params.to[ this.slide_style_name ] = section_min_size;

				var anim = this._startAnimator(index, params);
				anim.on('end', onCompleteCloseSection, this, index);
			}
			else
			{
				this.section_list[index].clip.setStyle(this.slide_style_name, section_min_size+'px');
				onCompleteCloseSection.call(this, null, index);
			}
		}
	},

	/**
	 * Open all sections, if possible.
	 * 
	 * @method openAllSections
	 */
	openAllSections: function()
	{
		if (this.get('allowMultipleOpen'))
		{
			var count = this.section_list.length;
			for (var i=0; i<count; i++)
			{
				if (!this.section_list[i].open)
				{
					this.toggleSection(i);
				}
			}
		}
	},

	/**
	 * Close all sections, if possible.
	 * 
	 * @method closeAllSections
	 */
	closeAllSections: function()
	{
		var count = this.section_list.length;
		var first = true;
		for (var i=0; i<count; i++)
		{
			if (this.section_list[i].open)
			{
				if (!this.allow_all_closed && first)
				{
					first = false;
				}
				else
				{
					this.toggleSection(i);
				}
			}
		}

		if (!this.allow_all_closed && first)
		{
			this.toggleSection(0);
		}
	},

	// create an animator with our configured duration and easing

	_createAnimator: function(
		/* object */	params)
	{
		var duration = this.get('animateDuration');
		if (duration !== null)
		{
			params.duration = duration;
		}

		var easing = this.get('animateEasing');
		if (easing !== null)
		{
			params.easing = easing;
		}

		return new Y.Anim(params);
	},

	// Register the animator for a section and start it.

	_startAnimator: function(
		/* int */		index,
		/* object */	params)
	{
		var anim = this.section_list[index].anim;
		if (anim)
		{
			anim.stop(true);
		}

		this.section_list[index].anim = anim = this._createAnimator(params);

		anim.on('end', function(type, index, anim)
		{
			if (index < this.section_list.length &&
				this.section_list[ index ].anim == anim)
			{
				this.section_list[ index ].anim = null;
			}
		},
		this, index, anim);

		anim.run();

		return anim;
	}
});

Y.Accordion = Accordion;
/**
 * @module gallery-accordion-horiz-vert
 */

/**********************************************************************
 * <p>Plugin for Y.Accordion that detects that the widget has a fixed size
 * in the relevant dimension (width or height) and adjusts the open
 * sections to fit.</p>
 * 
 * <p>If/when the widget is given a fixed size, all animations are turned
 * off.</p>
 * 
 * @class FixedSizeAccordion
 * @namespace Plugin
 * @constructor
 */
function FixedSizeAccordionPlugin()
{
	FixedSizeAccordionPlugin.superclass.constructor.apply(this, arguments);
}

FixedSizeAccordionPlugin.NAME = "FixedSizeAccordionPlugin";
FixedSizeAccordionPlugin.NS   = "fixedsize";

FixedSizeAccordionPlugin.ATTRS =
{
};

var animation_attrs =
[
	'animateRender',
	'animateInsertRemove',
	'animateOpenClose'
];

var total_size =
{
	width:  'totalWidth',
	height: 'totalHeight'
};

var overflow =
{
	width:  'overflowX',
	height: 'overflowY'
};

var surrounding =
{
	width:  'horizMarginBorderPadding',
	height: 'vertMarginBorderPadding'
};

function off(
	/* string */	name)
{
	this.set(name, false);
	this.modifyAttr(name, { readOnly: true });
}

function adjust()
{
	var host = this.get('host');
	if (!this.init_fixed_size)
	{
		Y.Array.each(animation_attrs, off, host);

		if (!host.get('rendered'))
		{
			this.afterHostEvent('render', adjust, this);
		}

		this.onHostEvent('insert', function()
		{
			Y.later(1, this, adjust);	// may be modified after insertion
		},
		this);

		this.onHostEvent('remove', adjust, this);
		this.onHostEvent('open', adjust, this);
		this.onHostEvent('close', adjust, this);

		this.init_fixed_size = true;
	}

	var dim   = host.slide_style_name;
	var total = host.get('boundingBox').parseDimensionStyle(dim);
	var count = host.getSectionCount();
	var open  = [];
	for (var i=0; i<count; i++)
	{
		total -= host.getTitle(i)[ total_size[dim] ]();
		if (host.isSectionOpen(i))
		{
			open.push(i);
		}
	}

	count     = open.length;
	var size  = Math.floor(total / count);
	var extra = total % count;
	for (i=0; i<count; i++)
	{
		var section = host.getSection(open[i]);
		var size1   = size - section[ surrounding[dim] ]();
		if (i === count-1)
		{
			size1 += extra;
		}

		section.setStyle(dim, size1+'px');
		section.setStyle(overflow[dim], 'auto');
	}
}

Y.extend(FixedSizeAccordionPlugin, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var host = this.get('host');
		var dim  = host.slide_style_name;

		this.init_fixed_size = false;
		if (host.get(dim))
		{
			adjust.call(this);
		}

		this.afterHostEvent(dim+'Change', function()
		{
			Y.later(1, this, adjust);
		},
		this);
	}
});

Y.namespace("Plugin");
Y.Plugin.FixedSizeAccordion = FixedSizeAccordionPlugin;


}, 'gallery-2013.01.30-21-00', {
    "skinnable": "true",
    "requires": [
        "widget",
        "selector-css3",
        "plugin",
        "gallery-dimensions"
    ],
    "optional": [
        "anim-base"
    ]
});
