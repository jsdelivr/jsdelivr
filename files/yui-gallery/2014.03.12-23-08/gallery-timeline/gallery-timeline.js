YUI.add('gallery-timeline', function(Y) {

/*global YUI*/
/**
 * Shows in the browser timeline files produced by the program from <a href="http://thetimelineproj.sourceforge.net/">The Timeline Project</a>.
 * @module timeline
 */
/**
 * Displays within a given container a timeline file from the given URL
 * @class Y.Timeline
 * @extends Y.Base
 * @constructor 
 * @param config {Object} configuration options
 */

"use strict";

var Lang = Y.Lang,
	REGION = 'region',
	START = 'start',
	END = 'end',
	LEFT = 'left',
	URL = 'url',
	CONTAINER = 'container',
	LOADED = 'loaded',
	CHANGE = 'Change',
	EVENT = 'event',
	CATEGORIES = 'categories',
	TOP = 'top',
	CENTER = 'center',
	RIGHT = 'right',
	PX = 'px',	
	STRINGS = 'strings',
	TIMELINE = 'timeline',
	SHOW_DESCR = 'showDescr',
	cName = function() {
		return Y.ClassNameManager.getClassName.apply(this, [TIMELINE].concat(Y.Array(arguments)));
	},
	BLOCK_TEMPLATE = Y.Node.create('<div class="' + cName('bar') + '" />'),
	GRID_TEMPLATE = Y.Node.create('<div class="' + cName('grid') + '"/>'),
	POINTER_TEMPLATE = Y.Node.create('<div class="' + cName('pointer') + '" />'),
	CATEGORIES_TEMPLATE = '<div class="' + cName('cats') + '">{categories}<p class="' + cName('noCat') + '">{noCategory}</p></div>';		

Y.Timeline = Y.Base.create(
	TIMELINE,
	Y.Base,
	[],
	{
		/**
		 * Stores the events to display.It contains the following properties, those starting with underscore are used internally:<ul>
		 * <li><b>start</b>: {timestamp} start time in milliseconds</li>
		 * <li><b>end</b>: {timestamp} end time in milliseconds</li>
		 * <li><b>text</b>: {string} text to be shown on the bar</li>
		 * <li><b>fuzzy</b>: {Boolean} the start and end days are uncertain </li>
		 * <li><b>locked</b>: {Boolean} the event cannot be edited (not relevant for this viewer </li>
		 * <li><b>endsToday</b>: {Boolean} the end day is today</li>
		 * <li><b>description</b>: {string} extended description</li>
		 * <li><b>icon</b>: {string} Base64-encoded image to go along the extended description</li>
		 * <li><b>category</b>: {string} the category this event belongs to</li>
		 * <li><b>_bar</b>: {Y.Node} reference to the Node for the bar representing this event</li>
		 * <li><b>_pointer</b>: {Y.Node} for point events, reference to the Node for the date pointer</li>
		 * <li><b>_isPoint</b>: {Boolean} signals that the event is a point event or a range event that has become too narrow to be displayed as a range</li>
		 * </ul>
		 * @property _events
		 * @type Object []
		 * @default null
		 */
		_events: null,
		/**
		 * Display mode for the bars, to help calculate its location and handle crowding.  
		 * Can be standard (0), , compact (1) or overlappying (2)
		 * @property _mode
		 * @type {integer}
		 * @default 0
		 */
		_mode: 0,
		/**
		 * Sets up listeners to respond to setting the URL,the CONTAINER or to the arrival of the timeline file.
		 * @method initializer
		 * @param cfg {Object} configuration attributes
		 * @protected
		 */
		initializer: function (cfg) {
			this._events = [];
			this.set(STRINGS, Y.Intl.get('gallery-' + TIMELINE));
			this.after(URL + CHANGE, this._load);
			this.after(CONTAINER + CHANGE, this._render);
			this.after(LOADED + CHANGE, this._render);
			if (cfg && cfg[URL]) {
				this._load();
			}
			if (cfg && cfg[CONTAINER]) {
				this._render();
			}
			this.publish(SHOW_DESCR, {
				defaultFn: this._defShowDescr
			});
		},
		/**
		 * Returns the boolean value of a given tag in an XML document
		 * @method _readBoolean
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {Boolean} the value read or null if not found
		 * @private
		 */
		_readBoolean: function (xml, tag) {
			var val = this._readValue(xml, tag);
			return val?val.toLowerCase() === 'true':null;
		},
		/**
		 * Returns and parses a date from a given tag in an XML document
		 * @method _readDate
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {Date} the value read or null if not found
		 * @private
		 */
		_readDate: function (xml, tag) {
			var date, time,
				val = this._readValue(xml, tag);
			if (val) {
				val = val.split(' ');
				date = val[0].split('-');
				time = val[1].split(':');
				return new Date(date[0], date[1] -1 , date[2], time[0], time[1], time[2]).getTime();
			} else {
				return null;
			}
		},
		/**
		 * Returns and parses a color value from a given tag in an XML document
		 * @method _readColor
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {String} the RGB value as #rrggbb read or null if not found
		 * @private
		 */
		_readColor: function(xml, tag) {
			var c = this._readValue(xml, tag),
				pad = function(val) {
					return ('00' + parseInt(val,10).toString(16)).substr(-2);
				};

			if (c) {
				c = c.split(',');
				return '#' + pad(c[0]) + pad(c[1]) + pad(c[2]);
			} else {
				return null;
			}
		},
		/**
		 * Returns the textual contents from a given tag in an XML document
		 * @method _readValue
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {String} the content read or null if not found
		 * @private
		 */
		_readValue: function(xml, tag) {
			var el = this._readEl(xml,tag);
			return el?el.textContent:null;
		},
		/**
		 * Returns the XML element from given tag in an XML document
		 * @method _readEl
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {XMLElement} the element read or null if not found
		 * @private
		 */
		_readEl: function (xml, tag) {
			var el = xml.getElementsByTagName(tag);
			return (el && el.length)?el[0]:null;
		},
		/**
		 * Reads the categories information
		 * @method _xmlReadCategories
		 * @param cats {XMLFragment} collection of categories
		 * @private
		 */
		_xmlReadCategories: function(cats) {
			var c = {};
			Y.each(cats.children, function (cat) {
				c[this._readValue(cat,'name')] = {
					color:this._readColor(cat,'color'),
					fontColor:this._readColor(cat,'font_color')
				};
			},this);
			this.set(CATEGORIES, c);

		},
		/**
		 * Reads the view information
		 * @method _xmlReadView
		 * @param view {XMLFragment} view information
		 * @private
		 */
		_xmlReadView: function (view) {
			var range = this._readEl(view,'displayed_period'),
				cats = this.get(CATEGORIES),
				hiddenCat = this._readEl(view, 'hidden_categories').firstChild;

			if (range) {
				this.set(START, this._readDate(range, START));
				this.set(END, this._readDate(range, END));
			}
			while (hiddenCat) {
				cats[hiddenCat.textContent].hidden = true;
				hiddenCat = hiddenCat.nextChild;
			}
		},
		/**
		 * Reads the events to show
		 * @method _xmlReadEvents
		 * @param cats {XMLFragment} collection of events
		 * @private
		 */
		_xmlReadEvents: function (events) {
			this._events = [];
			Y.each(events.children, function (event) {
				this._events.push({						
					start: this._readDate(event, START),
					end: this._readDate(event,END),
					text: this._readValue(event,'text'),
					fuzzy: this._readBoolean(event,'fuzzy'),
					locked: this._readBoolean(event,'locked'),
					endsToday: this._readBoolean(event,'ends_today'),
					category: this._readValue(event, 'category'),
					description: this._readValue(event, 'description'),
					icon: this._readValue(event, 'icon')
				});

			}, this);

		},
		/**
		 * Sugar method to set the URL of the timeline file
		 * @method load
		 * @param url {String} URL of the timeline file
		 * @chainable
		 */
		load: function (url) {
			this.set(URL, url);
			return this;
		},
		/**
		 * Requests the timeline information from the configured URL and parses it when it arrives.
		 * Signals its arrival by setting the 'loaded' configuration attribute
		 * @method _load
		 * @private
		 */
		_load: function () {
			var self = this;
			self.set(LOADED, false);
			Y.io(self.get(URL), {
				on: {
					success: function (id, o) {
						var xml = o.responseXML;
						self._xmlReadCategories(self._readEl(xml,CATEGORIES));
						self._xmlReadView(self._readEl(xml,'view'));
						self._xmlReadEvents(self._readEl(xml,'events'));
						self.set(LOADED, true);
					}
				}
			});


		},
		/**
		 * Adjusts the region information for the given node to make it relative to the container position
		 * @method _getRegion
		 * @param node {Y.Node} node to find the region
		 * @return {Y.Region} region of the node relative to the container
		 * @private
		 */
		_getRegion: function (node) {
			var reg = node.get(REGION);
			reg.left -= this._left;
			reg.top -= this._top;
			return reg;
		},
		/**
		 * Draws the bars corresponding to the events in the container
		 * @method _resize
		 * @param container {Y.Node} optional, the container for the bars.  It reads the container attribute if none given
		 * @private
		 */
		_resize: function (container) {
			container = container || this.get(CONTAINER);

			var start = this.get(START),
				end = this.get(END),
				rightEdge = this._width,
				height = this._height,
				scale = rightEdge / ( end - start),
				cats = this.get(CATEGORIES),
				bar, width, left, changed = false, region, pointer,hasNoCategory = false,
				TODAY = this.get(STRINGS).today,
				formatDate = function(date) {
					return Y.DataType.Date.format(new Date(date), {format:'%x'});
				};

			Y.each(this._events, function(event) {
				if (event.category && cats[event.category].hidden) {
					return;
				}
				bar = event._bar || BLOCK_TEMPLATE.cloneNode();
				pointer = event._pointer;
				left = Math.round((event.start - start) * scale);
				width = Math.round(((event.endsToday?Date.now():event.end) - event.start) * scale);
				if (left + width < 0 || left > rightEdge) {
					if (event._bar) {
						event._bar.remove(true);
						event._bar = null;
						if (pointer) {
							pointer.remove(true);
							event._pointer = pointer = null;
						}
					}
					changed = true;
					return;
				}
				event._isPoint = width === 0;
				bar.setStyles({
					left: left +PX,
					width: width?width + PX:'auto'
				});
				if (!event._bar) {
					event._bar = bar;
					if (event.category) {
						bar.setStyles({
							backgroundColor: cats[event.category].color,
							color: cats[event.category].fontColor
						});
					} else {
						hasNoCategory = true;
					}
					bar.setContent(event.text);
					bar.set('title', event.text + ': ' + formatDate(event.start) + ' - ' +  (event.endsToday?TODAY:formatDate(event.end)));
					if (event.fuzzy) {
						bar.addClass(cName('fuzzy'));
					}
					if (event.description || event.icon) {
						bar.addClass(cName('hasDescr'));
					}
					bar.setData(EVENT,event);
				}
				if (!bar.inDoc()) {
					container.append(bar);
					changed = true;
				}
				if (event._isPoint) {
					region = this._getRegion(bar);
					bar.setStyle(LEFT, region.left - region.width / 2 + PX);
					if (!pointer) {
						event._pointer = pointer = POINTER_TEMPLATE.cloneNode();
						pointer.setStyle(TOP, height / 2 + PX);
					}
				} else {
					if (pointer) {
						pointer.remove(true);
						event._pointer = pointer = null;
						changed = true;
					}
				}
				if (pointer) {
					pointer.setStyle(LEFT, left + PX);
					if (!pointer.inDoc()) {
						container.append(pointer);
					}
				}

			},this);
			if (changed) {
				this._locate();
			}
			container.one('.' + cName('noCat')).setStyle('display',hasNoCategory?'block':'none');
		},
		/**
		 * Locates the bars so that they don't overlap one another.  Range events are drawn above the middle line,
		 * point events below.  Range events may be moved below if the start and end dates are indistinguishable
		 * @method _locate
		 * @private
		 */
		_locate: function () {
			var width, left, region,
				middle = this._height / 2,
				points = [], ranges = [],levels, isPoint,
				mode = this._mode, highest = 0, lowest = 0,
				move = function(bar, levels, i, isPoint) {
					var top;
					switch (mode) {
						case 0:
							top = isPoint? 30 * i + 15:  -30 * (i+1) - 15;
							break;
						case 1:
							top = isPoint? 15 * i + 10:  -15 * (i+1) - 10;
							break;
						case 2:
							top = isPoint? 5 * i + 10:  -5 * (i+1) - 10;
							break;
					}
					highest = Math.min(highest, top);
					lowest = Math.max(lowest, top);
					bar.setStyle(TOP, middle + top + PX);
					if (!levels[i]) {
						levels[i] = [];
					}
					levels[i].push({left:left, width:width});
					var pointer = bar.getData(EVENT)._pointer;
					if (pointer) {
						pointer.setStyle('height', 30 * i + 15);
					}
				};
			this.get(CONTAINER).all('div.' + cName('bar')).each(function(bar) {
				region = this._getRegion(bar); 
				width = region.width;
				left = region.left;
				isPoint = bar.getData(EVENT)._isPoint;
				levels = (isPoint?points:ranges);
				// This is to determine container to place it so that it does not overlap with any existing bar
				if (!Y.some(levels, function (level, i) {
					if (!Y.some(level, function (existing) {
						return !(existing.left > (left + width) || left > (existing.left + existing.width));
					})) {
						move(bar, levels, i, isPoint);
						return true;
					}
					return false;
				},this)) {
					move(bar, levels, levels.length, isPoint);
				}
				

			},this);
			highest = Math.max(-highest, lowest);
			if (highest > middle) {
				if (mode < 2) {
					this._mode += 1;
					this._locate();
					this.get(CONTAINER).addClass(cName('compact'));
				}
			} else if (highest < middle / 3 ) {
				if (mode) {
					this._mode -=1;
					if (this._mode === 0) {
						this.get(CONTAINER).removeClass(cName('compact'));
					}
					this._locate();
				}
			}
		},
		/**
		 * Draws the grid, adjusting the interval in between lines from an hour to ten thousand years
		 * depending on the zoom factor
		 * @method _grid
		 * @private
		 */
		_grid: function () {
			var start = this.get(START),
				end = this.get(END),
				container = this.get(CONTAINER),
				width = this._width,
				height = this._height,
				range = end - start,
				// this cover periods of 0:hours, 1:days, 2:months, 3:years, 4:decades, 5:centuries, 6:millenia, 7:tens of millenia
				// JavaScript's Date object cannot go any further anyway'
				periods = [1000*60*60, 24, 30, 12, 10, 10, 10, 10], 
				period = 1, i, next, p, edge,label, date,

			round = function (what, precision, add) {
				what = new Date(what);
				switch (precision) {
					case 0:
						return new Date(what.getFullYear(), what.getMonth(), what.getDate(), what.getHours() + add, 0, 0).getTime();

					case 1:
						return new Date(what.getFullYear(), what.getMonth(), what.getDate() + add).getTime();

					case 2:
						return new Date(what.getFullYear(), what.getMonth() + add, 1).getTime();

					default:
						precision = Math.pow(10,precision - 3);
						return new Date(Math.floor(what.getFullYear() / precision) * precision + (add?precision:0), 0, 1).getTime();



				}
			};
			container.all('div.' + cName('grid')).remove(true);

			for (i = 0; i < periods.length; i+=1) {
				period *= periods[i];
				// check if the period is wider than 20 pixels in the current container
				if (width / range * period > 20) {
					break;
				}
			}
			edge = round(start, i, 0);
			while (edge < end) {
				next = round(edge, i, 1);
				date = new Date(edge);
				p = GRID_TEMPLATE.cloneNode();
				label = [date.getHours()];
				if (label[0] === 0) {
					label[1] = date.getDate();
					if (label[1] === 1) {
						label[2] = date.getMonth();
						if (label[2] === 0) {
							label[3] = date.getFullYear();
						}
						label[2] = Y.DataType.Date.format(date, {format: '%b'});
					} 
				}

				p.setContent(label.slice(Math.min(3,i)).join(', '));
				p.setStyles({
					width:Math.round((next - edge) / range * width) - 1  + PX,
					left:Math.round((edge - start)/ range * width) + PX,
					paddingTop: height/2  + PX,
					height: height/2 + PX
				});
				container.append(p);
				edge = next;

			}


		},
		/**
		 * Sugar method to set the container attribute.
		 * @method render
		 * @param container {String | Node} CSS selector or reference to the container node.
		 * @chainable 
		 */
		render: function (container) {
			this.set(CONTAINER, container);
			return this;
		},
		/**
		 * Renders the timeline in response to the container being set and the timeline file loaded
		 * @method _render
		 * @private
		 */
		_render:function() {
			var container = this.get(CONTAINER);
			if (!( container && this.get(LOADED))) {
				return;
			}
			container.addClass(cName());

			container.setContent('');
			Y.each(this._events, function (event) {
				delete event._pointer;
				delete event._bar;
				delete event._isPoint;
			});


			var region = container.get(REGION);
			this._left = region.left;
			this._top = region.top;
			this._height = region.height;
			this._width = region.width;

			container.append(Y.Node.create('<div class="' + cName('divider') + '"/>'));
			var cats = container.appendChild(Y.Node.create(Lang.sub(CATEGORIES_TEMPLATE,this.get(STRINGS))));
			Y.each(this.get(CATEGORIES), function (cat, name) {
				if (!cat.hidden) {
					cats.append(Y.Node.create('<p style="color:' + cat.fontColor + ';background-color:' + cat.color + '">' + name + '</p>'));
				}
			});
			this._descr = container.appendChild(Y.Node.create('<div class="' + cName('descr') + '"/>'));

			this._grid();
			this._resize(container);

			container.delegate('click',this._showDescr,'div.' + cName('bar'),this);
			container.delegate(
				'hover', 
				function(ev) {
					ev.target.setStyle('zIndex', 9);
				},
				function(ev) {
					ev.target.setStyle('zIndex', 0);
				},
				'div.' + cName('bar')
			);
			container.on('gesturemovestart', this._startMove, {}, this);
			container.on('gesturemove', this._dragMove, {}, this);
			container.on('gesturemoveend', this._dragMove, {}, this);
			Y.on('mousewheel', this._mouseWheel, this);
			return;
		},
		/**
		 * Hides de extended description
		 * @method _hideDescr
		 * @private
		 */
		_hideDescr: function() {
			this._descr.setStyle('display', 'none');
		},
		/**
		 * Shows the extended description above the event bar clicked
		 * @method _showDescr
		 * @param ev {Event Façade} to help locate the bar clicked
		 * @private
		 */
		_showDescr: function(ev) {
			var bar = ev.target,
				event = bar.getData(EVENT);
			this.fire(SHOW_DESCR, {
				bar: bar,
				event: event,
				callback: this.showDescr
			});
		},
		_defShowDescr: function (ev) {
			var bar = ev.bar,
				event = ev.event;
			this.showDescr(bar, event);
		},
		showDescr: function (bar, event) {
			var	barRegion = this._getRegion(bar),
				descr = this._descr,
				descrRegion,
				barMidPoint = barRegion.left + barRegion.width /2,
				third = this._width / 3;

			if (event.description || event.icon) {
				descr.setContent((event.icon? '<img src="data:image/png;base64,' + event.icon + '">':'') + event.description);
				descr.setStyles({
					display:'block',
					top:0
				});
				descr.removeClass(cName(LEFT));
				descr.removeClass(cName(CENTER));
				descr.removeClass(cName(RIGHT));
				descrRegion = this._getRegion(descr);

				if (barMidPoint < third) {
					descr.setStyle(LEFT, Math.max(barMidPoint,0) + PX);
					descr.addClass(cName(LEFT));
				} else if (barMidPoint < third * 2) {
					descr.setStyle(LEFT, barMidPoint - descrRegion.width / 2  + PX);
					descr.addClass(cName(CENTER));
				} else {
					descr.setStyle(LEFT, Math.min(barMidPoint,this._width - 30) - descrRegion.width + PX);
					descr.addClass(cName(RIGHT));
				}
				descr.setStyle(TOP, Math.round(barRegion.top - descrRegion.height - 20) + PX);
			}
		},
		/**
		 * Saves the initial position of a drag and the initial values of the start and end dates
		 * @method _startMove
		 * @param ev {Event Façade} information about the cursor at the start
		 * @private
		 */
		_startMove: function (ev) {
			ev.halt();
			this._hideDescr();
			this._pageX = ev.pageX;
			this._start = this.get(START);
			this._end = this.get(END);
		},
		/**
		 * Respondes to the movement of the cursor at whatever rate the system sends the signal
		 * by updating the start and end times of the display, either panning or zooming
		 * @method _dragMove
		 * @param ev {Event Façade} event information, specially cursor coordinates and state of the control key
		 * @private
		 */
		_dragMove: function (ev) {

			var start = this._start,
				end = this._end,
				width = this._width,
				deltaX = Math.round((ev.pageX - this._pageX) / width * (end - start));

			if (deltaX) {
				this.set(START,  start -  deltaX);
				if (ev.ctrlKey) {
					this.set(END,  end +  deltaX);
					this._locate();
				} else {
					this.set(END,  end -  deltaX);
				}
				this._resize();
				this._grid();
			}
		},
		/**
		 * Listener for the mouse wheel change.  It will zoom or pan depending on the state of the control key.
		 * @method _mouseWheel
		 * @param ev {Event Façade} the state of the control key and the direction of the mouse wheel roll is extracted from it
		 * @private
		 */
		_mouseWheel: function (ev) {
			if (ev.target.ancestor('#' + this.get(CONTAINER).get('id'),true)) {
				ev.halt();

				this._hideDescr();
				var start = this.get(START),
					end = this.get(END),
					deltaX = (end - start) * 0.1 * (ev.wheelDelta > 0?-1:1);

				this.set(START, start - deltaX);
				if (ev.ctrlKey) {
					this.set(END, end + deltaX);
					this._locate();
				} else {
					this.set(END, end - deltaX);
				}
				this._resize();
				this._grid();
			}
		}
	},
	{
		ATTRS: {
			/**
			 * Stores the categories, indexed by category name.  Each category contains:<ul>
			 * <li><b>color</b>: {string} Background color for the bar in #rrggbb format</li>
			 * <li><b>fontColor</b>: {string} Color for the text in the bar in #rrggbb format</li>
			 * <li><b>hidden</b>: {Boolean} Events in this category should not be shown</li>
			 * </ul> 
			 * @attribute categories
			 * @type {Object}
			 * @default {}
			 */
				
			categories: {
				validator: Lang.isObject,
				value:{}					
			},
			/**
			 * Start time (left edge) of the current timeline, in miliseconds
			 * @attribute start
			 * @type integer
			 * @default one month before current time
			 */
			start: {
				validator: Lang.isNumber,
				value: new Date(Date.now() - 1000*60*60*24*30).getTime() // previous month
			},
			/**
			 * End time (right edge) of the current timeline, in miliseconds
			 * @attribute end
			 * @type integer
			 * @default one month after current time
			 */
			end: {
				validator: Lang.isNumber,
				value: new Date(Date.now() + 1000*60*60*24*30).getTime() // next month
			},
			/**
			 * A reference to the HTML for rendering the timeline
			 * @attribute container
			 * @type {String | Y.Node}  A reference to a node or a CSS selector.  It will always be returned as a Node reference
			 */
			container: {
				setter: function (val) {
					return Y.one(val);
				}	
			},
			/**
			 * URL of the timeline file to be displayed
			 * @attribute url
			 * @type {String}
			 */
			url: {
				validator: Lang.isString
			},
			/**
			 * Signals whether the timeline file has been loaded or not
			 * @attribute loaded
			 * @type {Boolean}
			 * @default false
			 */
			loaded: {
				validator: Lang.isBoolean,
				value: false
			},
			/**
			 * Localizable strings meant to be seen by the user
			 * @attribute strings
			 * @type {Object}
			 * @default English strings
			 */
			strings: {
				value: {
					categories:'Categories',
					noCategory: '-no category-',
					today: 'today'
				}
			}

		}
	}
);



}, 'gallery-2012.03.23-18-00' ,{lang:['en', 'es'], optional:['intl'], requires:['node', 'io-base', 'base', 'event-mousewheel', 'event-gestures', 'classnamemanager', 'datatype', 'event-hover'], skinnable:true});
