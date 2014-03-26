YUI.add('gallery-masonry', function(Y) {

	'use strict';
	/**
	* A class for constructing Masonry instances.
	*
	* @class Masonry
	* @constructor
	* @extends Base
	*/
	function Masonry() {
		Masonry.superclass.constructor.apply(this, arguments);
	}

	Masonry.NAME = 'masonry';

	Masonry.ATTRS = {
		/**
		* The container node
		*
		* @attribute node
		* @type Node
		*/
		node: {
			setter: function (node) {
				var n = Y.one(node);
				if (!n) {
					Y.fail('Masonry: Invalid Node Given: ' + node);
				}
				return n;
			}
		},

		/**
		* Triggers layout logic when browser window is resized.
		*
		* @attribute isResizable
		* @type Boolean
		* @default true
		*/
		isResizable: {
			value: true
		},

		/**
		* Enables YUI transition on layout changes.
		*
		* @attribute isAnimated
		* @type Boolean
		* @default false
		*/
		isAnimated: {
			value: false
		},

		/**
		* Options used for YUI transition.
		*
		* @attribute animationOptions
		* @type Object
		* @default { duration: 0.5 }
		*/
		animationOptions: {
			value: {
				duration: 0.5
			}
		},

		/**
		* Adds additional spacing between columns.
		*
		* @attribute gutterWidth
		* @type NUM
		* @default 0
		*/
		gutterWidth: {
			value: 0
		},

		/**
		* Enables right-to-left layout for languages like Hebrew and Arabic.
		*
		* @attribute isRTL
		* @type Boolean
		* @default false
		*/
		isRTL: {
			value: false
		},

		/**
		* If enabled, Masonry will size the width of the container to the nearest column. 
		* When enabled, Masonry will measure the width of the container＊s parent element, 
		* not the width of the container. This option is ideal for centering Masonry layouts.
		*
		* @attribute isFitWidth
		* @type Boolean
		* @default false
		*/
		isFitWidth: {
			value: false
		},

		/**
		* CSS properties applied to the container. Masonry uses relative/absolute positioning to position item elements.
		*
		* @attribute containerStyle
		* @type Object
		* @default { position: 'relative' }
		*/
		containerStyle: {
			value: {
				position: 'relative'
			}
		},

		/**
		* Width in pixels of 1 column of your grid. If no columnWidth is specified, 
		* Masonry uses the width of the first item element.
		*
		* Recommended if your layout has item elements that have multiple-column widths.
		*
		* To set a dynamic column width, you can pass in a function that returns the value column width. 
		* The function provides an argument for the width of the container. 
		* Use this technique for fluid or responsive layouts.
		*
		* @attribute columnWidth
		* @type Num
		*/
		columnWidth: {},

		/**
		* Filters item elements to selector. 
		* If not set, Masonry defaults to using the child elements of the container.
		* Recommended to avoid Masonry using any other hidden elements in its layout logic.
		*
		* @attribute itemSelector
		* @type String
		*/
		itemSelector: {}
	};

	Y.extend(Masonry, Y.Base, {

		initializer: function () {
			this._create();
			this._init();
		},

		destructor: function () {

			this.bricks
				.removeClass('masonry-brick')
				.setStyles({
					position: '',
					top: '',
					left: ''
				});

			// re-apply saved container styles
			this.get('node')
				.detach('masonry|*')
				.removeClass('masonry')
				.setStyles(this.originalStyle);

			Y.detach('masonry|*');

		},

		_outerWidth: function (node) {
			return node ? node.get('offsetWidth') + parseInt(node.getStyle('marginLeft'), 10) + parseInt(node.getStyle('marginRight'), 10) : 0;
		},

		_outerHeight: function (node) {
			return node ? node.get('offsetHeight') + parseInt(node.getStyle('marginTop'), 10) + parseInt(node.getStyle('marginBottom'), 10) : 0;
		},

		_filterFindBricks: function (elems) {
			var selector = this.get('itemSelector'),
				result = elems;
			// if there is a selector
			// filter/find appropriate item elements
			if (selector) {
				result = new Y.NodeList();
				elems.each(function (node) {
					result = result.concat(node, node.all(selector));
				});
				result = result.filter(selector);
			}
			return result;
		},

		_getBricks: function (elems) {
			var bricks = this._filterFindBricks(elems)
					.setStyle('position', 'absolute')
					.addClass('masonry-brick');
			return bricks;
		},

		// sets up widget
		_create: function () {
			this.styleQueue = [];

			// get original styles in case we re-apply them in .destroy()
			var node = this.get('node'),
				elemStyle = node.getDOMNode().style,
				containerStyle = this.get('containerStyle'), // get other styles that will be overwritten
				prop,
				columnWidth = this.get('columnWidth'),
				instance = this;

			this.originalStyle = {
				// get height
				height: elemStyle.height || ''
			};

			for (prop in containerStyle) {
				if (containerStyle.hasOwnProperty(prop)) {
					this.originalStyle[prop] = elemStyle[prop] || '';
				}
			}

			node.setStyles(containerStyle);

			this.horizontalDirection = this.get('isRTL') ? 'Right' : 'Left';

			this.offset = {
				x: parseInt(node.getStyle('padding' + this.horizontalDirection), 10),
				y: parseInt(node.getStyle('paddingTop'), 10)
			};

			this.horizontalDirection = this.horizontalDirection.toLowerCase();

			this.isFluid = columnWidth && typeof columnWidth === 'function';

			// add masonry class first time around
			setTimeout(function () {
				instance.get('node').addClass('masonry');
			}, 0);

			// bind resize method
			if (this.get('isResizable')) {
				Y.on('masonry|windowresize', function () {
					instance.resize();
				});
			}


			// need to get bricks
			this.reloadItems();
		},

		// _init fires when instance is first created
		// and when instance is triggered again -> $el.masonry();
		_init: function (callback) {
			this._getColumns();
			this._reLayout(callback);
		},

		// ====================== General Layout ======================

		/**
		* Positions specified item elements in layout.
		*
		* @method layout
		* @param {NodeList} bricks The appened items
		* @param {Function} callback A callback function
		* @chainable
		*/
		layout: function (bricks, callback) {
			var i,
				len,
				containerSize = {}, // set the size of the container
				unusedCols,
				styleFn,
				animOpts = this.get('animationOptions'),
				obj,
				style;

			// place each brick
			bricks.each(function (node) {
				this._placeBrick(node);
			}, this);

			containerSize.height = Math.max.apply(Math, this.colYs) + 'px';
			if (this.get('isFitWidth')) {
				unusedCols = 0;
				i = this.cols;
				// count unused columns
				while (--i) {
					if (this.colYs[i] !== 0) {
						break;
					}
					unusedCols++;
				}
				// fit container to columns that have been used;
				containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.get('gutterWidth') + 'px';
			}
			this.styleQueue.push({el: this.get('node'), style: containerSize});

			// are we animating the layout arrangement?
			// use plugin-ish syntax for css or animate
			styleFn = !this.isLaidOut ? 'setStyles' : (
				this.get('isAnimated') ? 'transition' : 'setStyles'
			);

			// process styleQueue
			for (i = 0, len = this.styleQueue.length; i < len; i++) {
				obj = this.styleQueue[i];
				style = obj.style;
				if ('transition' === styleFn) {
					if (style.top) {
						style.top += 'px';
					}
					if (style[this.horizontalDirection]) {
						style[this.horizontalDirection] += 'px';
					}
					style = Y.merge(style, animOpts);
				}
				obj.el[styleFn](style);
			}

			// clear out queue for next time
			this.styleQueue = [];

			// provide elems as context for the callback
			if (callback) {
				callback.call(bricks);
			}

			this.isLaidOut = true;
		},

		// calculates number of columns
		// i.e. this.columnWidth = 200
		_getColumns: function () {
			var node = this.get('node'),
				container = this.get('isFitWidth') ? node.get('parentNode') : node,
				containerWidth = parseInt(container.getStyle('width'), 10) || 0,
				columnWidth = this.get('columnWidth'),
				gutterWidth = this.get('gutterWidth');

			// use fluid columnWidth function if there
			this.columnWidth = this.isFluid ? columnWidth(containerWidth) :
					// if not, how about the explicitly set option?
					columnWidth ||
					// or use the size of the first item
					this._outerWidth(this.bricks.item(0)) ||
					// if there's no items, use size of container
					containerWidth;

			this.columnWidth += gutterWidth;

			this.cols = Math.floor((containerWidth + gutterWidth) / this.columnWidth);
			this.cols = Math.max(this.cols, 1);

		},

		// layout logic
		_placeBrick: function (brick) {
			var colSpan, groupCount, groupY, groupColY, j, minimumY, shortCol, i, len, position, setHeight, setSpan;

			//how many columns does this brick span
			colSpan = Math.ceil(this._outerWidth(brick) / this.columnWidth);
			colSpan = Math.min(colSpan, this.cols);

			if (colSpan === 1) {
				// if brick spans only one column, just like singleMode
				groupY = this.colYs;
			} else {
				// brick spans more than one column
				// how many different places could this brick fit horizontally
				groupCount = this.cols + 1 - colSpan;
				groupY = [];

				// for each group potential horizontal position
				for (j = 0; j < groupCount; j++) {
					// make an array of colY values for that one group
					groupColY = this.colYs.slice(j, j + colSpan);
					// and get the max value of the array
					groupY[j] = Math.max.apply(Math, groupColY);
				}

			}

			// get the minimum Y value from the columns
			minimumY = Math.min.apply(Math, groupY);
			shortCol = 0;

			// Find index of short column, the first from the left
			for (i = 0, len = groupY.length; i < len; i++) {
				if (groupY[i] === minimumY) {
					shortCol = i;
					break;
				}
			}

			// position the brick
			position = {
				top: minimumY + this.offset.y
			};
			// position.left or position.right
			position[this.horizontalDirection] = this.columnWidth * shortCol + this.offset.x;
			this.styleQueue.push({el: brick, style: position});

			// apply setHeight to necessary columns
			setHeight = minimumY + this._outerHeight(brick);
			setSpan = this.cols + 1 - len;
			for (i = 0; i < setSpan; i++) {
				this.colYs[shortCol + i] = setHeight;
			}

		},

		resize: function () {
			var prevColCount = this.cols;
			// get updated colCount
			this._getColumns();
			if (this.isFluid || this.cols !== prevColCount) {
				// if column count has changed, trigger new layout
				this._reLayout();
			}
		},

		_reLayout: function (callback) {
			// reset columns
			var i = this.cols;
			this.colYs = [];
			while (i--) {
				this.colYs.push(0);
			}
			// apply layout logic to all bricks
			this.layout(this.bricks, callback);
		},

		// ====================== Convenience methods ======================
		/**
		* Re-collects all item elements in their current order in the DOM.
		*
		* @method reloadItems
		* @chainable
		*/
		reloadItems: function () {
			// goes through all children again and gets bricks in proper order
			this.bricks = this._getBricks(this.get('node').get('children'));
			return this;
		},

		/**
		* Convenience method for triggering reloadItems then reLayout. Useful for prepending or inserting items.
		*
		* @method reload
		* @param {Function} callback A callback function
		* @chainable
		*/
		reload: function (callback) {
			this.reloadItems();
			this._init(callback);
			return this;
		},

		/**
		* Triggers layout on item elements that have been appended to the container.
		*
		* @method appended
		* @param {NodeList} content The appened items
		* @param {Function} callback A callback function
		* @param {Boolean} [isAnimatedFromBottom=false]
		* @chainable
		*/
		appended: function (content, isAnimatedFromBottom, callback) {
			if (isAnimatedFromBottom) {
				// set new stuff to the bottom
				this._filterFindBricks(content).setStyles({top: this.get('node').get('region').height});
				var instance = this;
				setTimeout(function () {
					instance._appended(content, callback);
				}, 1);
			} else {
				this._appended(content, callback);
			}
			return this;
		},

		_appended: function (content, callback) {
			var newBricks = this._getBricks(content);
			// add new bricks to brick pool
			this.bricks = this.bricks.concat(newBricks);
			this.layout(newBricks, callback);
		},

		/**
		* Removes specified item elements from Masonry instance and the DOM.
		*
		* @method remove
		* @param {NodeList} content Nodes to be removed
		* @chainable
		*/
		// removes elements from Masonry widget
		remove: function (content) {
			var self = this;
			content.each(function () {
				self.bricks.splice(self.bricks.indexOf(this), 1);
				this.remove(true);
			});
			return this;
		}
	});

	Y.Masonry = Masonry;


}, 'gallery-2012.08.01-13-16' ,{requires:['base','node','event','transition']});
