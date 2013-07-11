/*
Simple min-height-masonry layout plugin.
Like masonry column shift, but works.
*/
;(function ($){
	var Waterfall = function (el, opts){
		this.element = $(el);
		this._create(opts)
	}

	Waterfall.defaultClass = "waterfall";

	$.extend(Waterfall.prototype, {
		options: {
			itemSelector: null,
			colMinWidth: 300,
			defaultContainerWidth: $(window).width(),
			colClass: null,
			autoresize: true,
			order: "waterfall" //columns
		},

		_create: function (opts) {
			var self = this,
			o = self.options = $.extend({}, self.options, opts);

			self.container = self.element;

			var colClass = o.colClass ? o.colClass : 'wf-column';
			if (self.container.children().hasClass(colClass)) {
				//Columns init — keep initial order of items
				var cols = $('.' + colClass, self.container),
					children = $('.' + colClass, self.container).children();				
				self.items = [];
				for (var i = 0; i < children.length; i++){
					self.items.push(cols.eq(i%3).children()[Math.floor(i/3)])
				}
			} else {
				//Items init
				self.items = [];
				self.container.children().each(function(i,e){
					self.items.push(e);
				});
			}
			
			self._resetColumns();
			o.colMinWidth = opts.colMinWidth || o.colMinWidth;

			self.reflow();

			if (o.autoresize) {
				$(window).resize(self.reflow.bind(self))
			}
		},



		//==========================API
		//getset options
		getOption: function (name) {
			return this.options && this.options[name];
		},
		getOptions: function () {
			return this.options;
		},
		setOption: function (name, value) {
			if (this.options) {this.options[name] = value;}
			this._resetColumns().reflow();
			return this;
		},
		setOptions: function (opts) {
			this.options = $.extend(this.options, opts);
			this._resetColumns().reflow()
			return this;
		},

		//Ensures column number correct, reallocates items
		reflow: function () {
			var self = this, o = self.options,
				neededCols = self._countNeededColumns();

			if (neededCols == self.container.children().length) return; //prevent recounting if columns enough

			$(self.items).detach();
			self._ensureColumns(neededCols)._refill();

			return self;
		},

		//Inserts new item(s)
		add: function (itemSet) {
			var self = this, o = self.options, cols = self.container.children();

			itemSet = $(itemSet);

			itemSet.each(function (i, el) {
				var $item = $(el);
				self._getMinCol(cols).append($item);
			})

			self.items.push(itemSet);
			return self;
		},


		//========================= Techs

		//calc needed number of columns
		_countNeededColumns: function () {
			var self = this, o = self.options;
			return ~~((self.container.width() || o.defaultContainerWidth) / o.colMinWidth) || 1;
		},

		//Just ensures that columns has correct classes etc
		_resetColumns: function(){
			var self = this;
			$(self.items).detach();
			self.container.children().remove();
			return self;
		},

		//ensures only number of columns exist
		_ensureColumns: function (num) {
			var self = this, o = self.options
				num = num || 1,
				columns = self.container.children();

			if (columns.length < num) {
				var str = '';
				for (var i = 0; i < num - columns.length; i++ ){
					str += self._columnTpl();
				}
				self.container.append(str);
			} else if ( columns.length > num) {
				columns.slice(- columns.length + num).remove();
			}

			columns = self.container.children();
			columns.css({
				"width": 100 / columns.length +"%",
				"display": "inline-block",
				"vertical-align": "top"
			})
			return self;
		},

		_columnTpl: function () {
			return '<div class="wf-column ' + (this.options.colClass || '')  + '"></div>';
		},

		//Redistributes items by columns
		_refill: function () {
			var self = this, o = self.options;

			//for each item place it correctly
			$.each(self.items, function (i, el) {
				var $e = $(el),
					col = $e.data("float") || $e.data("column");
				if (col){
					switch(col){
						case "left":
						case "first":
							self.container.children().first().append($e)
							break;
						case "right":
						case "last":
							self.container.children().last().append($e)
							break;
						default:
							self.container.children().eq(Math.max(Math.min(col, self.container.children().length) - 1, 0)).append($e)
					}
				} else {
					self._getMinCol(self.container.children()).append($e);
				}
			})

			return self;
		},

		//returns column with minimal height
		_getMinCol: function (cols) {
			var minH = Infinity, minCol = cols.first(), minColNum = 0;

			//fill min heights
			cols.each(function (colNum, col){
				var $col = $(col);

				var h = $col.height();
				if (h < minH) {
					minH = h;
					minColNum = colNum;
				}
			});

			return cols.eq(minColNum);
		},
		
	})


	$.fn.waterfall = function (arg, arg2) {
		if (typeof arg == "string") {//Call API method
			return $(this).each(function (i, el) {
				$(el).data("waterfall")[arg](arg2);
			})
		} else {
			return $(this).each(function (i, el) {
				var wf = new Waterfall(el, arg);
				if (!$(el).data("waterfall")) $(el).data("waterfall", wf);
			})			
		}
	}


	//Simple options parser. The same as $.fn.data(), or element.dataset but for zepto
	if (!$.parseDataAttributes) {
		$.parseDataAttributes = function(el){
			var data = {};
			if (el.dataset) {
				$.extend(data, el.dataset);
			} else {
				[].forEach.call(el.attributes, function(attr) {
					if (/^data-/.test(attr.name)) {
						var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
						    return $1.toUpperCase();
						});
						data[camelCaseName] = attr.value;
					}
				});
			}
			return data;
		}
	}


	$(function () {
		var defClass = window.waterfall && window.waterfall.defaultClass || Waterfall.defaultClass;

		$("." + defClass).each(function (i, e){
				var $e = $(e),
					opts = $.extend(window.waterfall || {}, $.parseDataAttributes(e));
					if (opts.width && !opts.colMinWidth) {
						opts.colMinWidth = opts.width
					}
				$e.waterfall(opts);
			});
		})

})(window.jQuery || window.Zepto);