
// created by Minh Nguyen;
// version 1.0.1;

(function($) {

	self.freewall = function(selector) {

		var container = $(selector).css({position: 'relative'});
		var klass = this;

		// default setting;
		var setting = {
			selector: '.item',
			animate: true,
			block: {
				flex: false
			},
			cell: {
				width: 150, // unit width;
				height: 150
			},
			engine: 'giot', //just a person name;
			fillGap: false, 
			gutter: 10, // spacing between blocks;
			onResize: function() {},
			onSetBlock: function() {}
		};

		
		var layout = {
			block: {}, // store all items;
			cell: {}, // un  it adjust;
			busy: 0,
			col: 1,
			row: 1,
			filter: '',
			width: 0,
			height: 0,
			minCol: Number.MAX_VALUE,
			minRow: Number.MAX_VALUE,
			transition: false
		};

		// check browser support transition;
		var style = document.body.style;
	    if (style.transition != null ||
	    	style.oTransition != null ||
	    	style.msTransition != null ||
	    	style.MozTransition != null ||
	    	style.webkitTransition != null)
	    {
	    	layout.transition = true;
	    }

		container.attr('data-min-width', Math.floor($(self).width() / 80) * 80);

		// setup resize event;
		$(self).resize(function() {
			if (layout.busy) return;
			layout.busy = 1;
			setTimeout(function() {
				layout.busy = 0;
				setting.onResize.call(klass, container);
			}, 255);
			container.attr('data-min-width', Math.floor($(self).width() / 80) * 80);
		});


		function loadBlock(item, id) {

			var $item = $(item), block = null, gutter = setting.gutter;
			
			// store original size;
			$item.attr('data-height') == null && $item.attr('data-height', $item.outerHeight());
			$item.attr('data-width') == null && $item.attr('data-width', $item.outerWidth());

			var cellHeight = $item.hasClass('block-fixed') ? setting.cell.height : layout.cell.height;
			var cellWidth = $item.hasClass('block-fixed') ? setting.cell.width : layout.cell.width;
			
			var height = 1 * $item.attr('data-height');
			var width = 1 * $item.attr('data-width');
			
			var row = Math.round(height / (cellHeight + gutter));
			var col = Math.round(width / (cellWidth + gutter));
			
			var type = $item.hasClass('block-fixed') ? 'fixed' : col + '-' + row;
			
			if ((type == 'fixed' || !setting.fillGap) && (col > layout.col || row > layout.row)) {
				block = null;
			} else {
				// get min width and min height;
				row < layout.minRow && (layout.minRow = row);
				col < layout.minCol && (layout.minCol = col);
				width == 0 && (col = 0);
				height == 0 && (row = 0);

				block = {
					type: type,
					id: id,
					width: col,
					height: row
				};
			}

			if ($item.attr("data-state") == null) {
				$item.attr("data-state", "start");
			} else {
				$item.attr("data-state", "move");
			}

			return block;
		}

		function setBlock(block) {
			
			var x = block.x;
			var y = block.y;
			var w = block.width;
			var h = block.height;
			var gutter = setting.gutter;
			var cellWidth = layout.cell.width;
			var cellHeight = layout.cell.height;
			
			layout.block[block.id] = {
				left: x * (cellWidth + gutter),
				top: y * (cellHeight + gutter),
				width: setting.block.flex && w ? cellWidth * w + gutter * (w - 1) : cellWidth * w,
				height: setting.block.flex && h ? cellHeight * h + gutter * (h - 1) : cellHeight * h
			};
			
		}

		function showBlock(item, id) {
			
			var method = setting.animate && !layout.transition ? 'animate' : 'css';
			var $item = $(item);
			var trans = "top 0.5s, left 0.5s, width 0.5s, height 0.5s";
			
			if (layout.transition) {
				var browser = $.browser;
				if (browser.webkit) {
					item.style.WebkitTransition = trans;
				} else if (browser.mozilla) {
					item.style.MozTransition = trans;
				} else if (browser.msie) {
					item.style.msTransition = trans;
				} else if (browser.opera) {
					item.style.OTransition = trans;
				} else {
					item.style.transition = trans;
				}
			}

			// for hidden block;
			if (!layout.block[id]) {
				$item.stop()[method]({
					opacity: 0,
					width: 0,
					height: 0
				});
			} else {
				$item.stop()["css"]({
					position: 'absolute',
					opacity: 1,
					width: layout.block[id]['width'],
					height: layout.block[id]['height']
				});
				$item[method]({
					top: layout.block[id]['top'],
					left: layout.block[id]['left']
				});
			}
		}

		function setZoneSize (col, row) {
			var cellHeight = layout.cell.height;
			var cellWidth = layout.cell.width;
			var gutter = setting.gutter;

			layout.width = col ? cellWidth * col + gutter * (col - 1) : cellWidth * col;
			layout.height = row ? cellHeight * row + gutter * (row - 1) : cellHeight * row;
		}


		var engine = {

			slice: function(items, col, row) {

				var block = items.shift();
				var wall = {};
				
				wall[block.id] = {
					id: block.id,
					x: 0,
					y: 0,
					width: col,
					height: row,
					type: col + '-' + row,
					originWidth: block.width,
					originHeight: block.height
				};

				function getBigBlock() {
					var brick, idx, max = 0, less = false;
					for (var i in wall) {
						if (!wall.hasOwnProperty(i)) continue; 
						brick = wall[i];
						less = brick.height <= brick.originHeight;
						less = less && brick.width <= brick.originWidth;
						if (less) continue;

						if (brick.width * brick.height > max) {
							max = brick.width * brick.height;
							idx = i;
						}
					}
					return wall[idx];
				}

				var bigBlock = null, newBlock = null;
				
				while (items.length) {
					
					bigBlock = getBigBlock();
					if (!bigBlock) break;
					
					// slice the big block;
					if (bigBlock.height > bigBlock.originHeight) {
						//slice by height;
						newBlock = {
							x: bigBlock.x,
							y: bigBlock.y + bigBlock.originHeight,
							width: bigBlock.width,
							height: bigBlock.height - bigBlock.originHeight
						};

					} else {
						// slice by width;
						newBlock = {
							x: bigBlock.x + bigBlock.originWidth,
							y: bigBlock.y,
							width: bigBlock.width - bigBlock.originWidth,
							height: bigBlock.height 
						};

					}
					newBlock.type = newBlock.width + '-' + newBlock.height;

					block = null;
					for (var i = 0; i < items.length; ++i) {
						if (items[i].height > newBlock.height) continue;
						if (items[i].width > newBlock.width) continue;
						block = items.splice(i, 1)[0];
						break;
					}
					// change size for fit with new block;
					!block && (block = items.shift());
					
					if (bigBlock.height > bigBlock.originHeight) {
						bigBlock.height = bigBlock.originHeight;

					} else {
						bigBlock.width = bigBlock.originWidth;

					}

					newBlock.originHeight = block.height;
					newBlock.originWidth = block.width;
					newBlock.id = block.id;
					
					wall[block.id] = newBlock;

				}

				for (var i in wall) {
					wall.hasOwnProperty(i) && setBlock(wall[i]);
				}

				return wall;
			},
			// just a person name;
			// full name is Phan Dinh Giot;
			giot: function(items, col, row) {

				var smallLoop = Math.min(col, row);
				var bigLoop = Math.max(col, row);
				var wall = {}, grid = {};
				var maxX = 0, maxY = 0;
				var check = col < row ? 1 : 0;
				var block, next, x, y, rest, lastBook;

				function fillGrid(x, y, w, h) {
					for (var i = x; i < x + w;) {
						for (var j = y; j < y + h;) {
							grid[i + '-' + j] = true;
							++j > maxY && (maxY = j);
						}
						++i > maxX && (maxX = i);
					}
				}

				for (var b = 0; b < bigLoop; ++b) {
					if (!items.length) break;
					check ? (y = b) : (x = b);
					lastBook = null;

					for (var s = 0; s < smallLoop; ++s) {
						if (!items.length) break;
						check ? (x = s) : (y = s);
						if (grid[x + '-' + y]) continue;
						
						for (var n = s; n < smallLoop; ++n) {
							next = check ? (n + '-' + b) : (b + '-' + n);
							if (grid[next] == true) break;
						}
						
						rest = n - s;
						block = null;
						// find item fit into gap;
						for (var i = 0; i < items.length; ++i) {
							if (items[i].height > rest && !check) continue;
							if (items[i].width > rest && check) continue;
							block = items.splice(i, 1)[0];
							break;
						}
						
						// trying resize the next block to fit gap;
						if (block == null && setting.fillGap) {
							// resize near block to fill gap;
							if (layout.minRow > rest && !check) {
								lastBook && (lastBook.height += rest);
							} else if (layout.minCol > rest && check) {
								lastBook && (lastBook.width += rest);
							} else {
								// get othr block fill to gap;
								for (var i = 0; i < items.length; ++i) {
									if (items[i]['type'] == 'fixed') continue;
									block = items.splice(i, 1)[0];
									check ? (block.width = rest) : (block.height = rest);
									break;
								}
							}
						}

						if (block != null) {
							wall[block.id] = {
								id: block.id,
								x: x,
								y: y,
								width: block.width,
								height: block.height
							};
							
							// don't fill block-point on grid;
							if (block.width * block.height == 0) {
								s -= 1;
							} else {
								// keep success block for next round;
								lastBook = wall[block.id];
								fillGrid(lastBook.x, lastBook.y, lastBook.width, lastBook.height);
							}
						}
					}
				}

				for (var i in wall) {
					wall.hasOwnProperty(i) && setBlock(wall[i]);
				}
				
				setZoneSize(maxX, maxY);
				
				return wall;
			}
		};


		$.extend(klass, {
			
			container: container,
			
			fitHeight: function(height) {

				height = height ? height : container.height() || $(window).height();
				
				layout.block = {};
				layout.cell = {};
				
				var cellHeight = setting.cell.height;
				var cellWidth = setting.cell.width;
				var gutter = setting.gutter;
				var row = Math.max(1, height / cellHeight << 0);

				// adjust size unit for fit height;
				if (!$.isNumeric(gutter)) {
					gutter = (height - row * cellHeight) / Math.max(1, (row - 1));
					gutter = Math.max(0, gutter << 0);
					setting.gutter = gutter;
				} else {
					row = Math.max(1, height / (cellHeight + gutter) << 0);
				}
				
				var deltaXY = 0;
				if (setting.block.flex) {
					deltaXY = (height + gutter) / row - (cellHeight + gutter);
					deltaXY = Math.max(0, deltaXY << 0);
					layout.cell.height = cellHeight + deltaXY;
					layout.cell.width = cellWidth + deltaXY;
				} else {
					layout.cell.height = cellHeight;
					layout.cell.width = cellWidth;
				}

				var allBlock = container.find(setting.selector).attr('id', '');
				var items, block = null, activeBlock = [];
				if (layout.filter) {
					items = allBlock.filter(layout.filter).addClass('fw-filter');
				} else {
					items = allBlock.removeClass('fw-filter');
				}

				var col = 123456;
				layout.col = col;
				layout.row = row;

				items.each(function(index, item) {
					item.id = 'block-' + ++index;
					block = loadBlock(item, item.id);
					block && activeBlock.push(block);
				});
				
				engine[setting.engine](activeBlock, col, row);
				
				allBlock.each(function(index, item) {
					showBlock(item, item.id);
					setting.onSetBlock.call(item);
				});
			},

			fitWidth: function(width) {
				
				width = width ? width : container.width() || $(window).width();
				
				layout.block = {};
				layout.cell = {};

				var cellHeight = setting.cell.height;
				var cellWidth = setting.cell.width;
				var gutter = setting.gutter;
				var col = Math.max(1, width / cellWidth << 0);

				// adjust size unit for fit width;
				if (!$.isNumeric(gutter)) {
					gutter = (width - col * cellWidth) / Math.max(1, (col - 1));
					gutter = Math.max(0, gutter << 0);
					setting.gutter = gutter;
				} else {
					// correct total column with gutter;
					col = Math.max(1, width / (cellWidth + gutter) << 0);
				}
				
				var deltaXY = 0;
				if (setting.block.flex) {
					deltaXY = (width + gutter) / col - (cellWidth + gutter);
					deltaXY = Math.max(0, deltaXY << 0);
					layout.cell.height = cellHeight + deltaXY;
					layout.cell.width = cellWidth + deltaXY;
				} else {
					layout.cell.height = cellHeight;
					layout.cell.width = cellWidth;
				}

				var allBlock = container.find(setting.selector).removeAttr('id');
				var items, block = null, activeBlock = [];
				if (layout.filter) {
					items = allBlock.filter(layout.filter).addClass('fw-filter');
				} else {
					items = allBlock.removeClass('fw-filter');
				}
				
				var row = 123456;
				layout.col = col;
				layout.row = row;

				items.each(function(index, item) {
					item.id = 'block-' + ++index;
					block = loadBlock(item, item.id);
					block && activeBlock.push(block);
				});
				engine[setting.engine](activeBlock, col, row);
				
				container.height(layout.height << 0);
				allBlock.each(function(index, item) {
					showBlock(item, item.id);
					setting.onSetBlock.call(item);
				});
				
			},

			fitZone: function(width, height) {
				height = height ? height : container.height() || $(window).height();
				width = width ? width : container.width() || $(window).width();
				
				layout.block = {};
				layout.cell = {};

				var cellHeight = setting.cell.height;
				var cellWidth = setting.cell.width;
				var gutter = setting.gutter;
				var col = Math.max(1, width / cellWidth << 0);
				var row = Math.max(1, height / cellHeight << 0);

				// adjust size unit for fit height;
				if (!$.isNumeric(gutter)) {
					var gutterX = (width - col * cellWidth) / Math.max(1, (col - 1));
					var gutterY = (height - row * cellHeight) / Math.max(1, (row - 1));
					gutter = Math.max(0, (gutterX + gutterY) / 2 << 0);
					setting.gutter = gutter;
				} else {
					col = Math.max(1, width / (cellWidth + gutter) << 0);
					row = Math.max(1, height / (cellHeight + gutter) << 0);
				}

				var deltaX = 0, deltaY = 0;
				if (setting.block.flex) {
					deltaY = (height + gutter) / row - (cellHeight + gutter);
					deltaY = Math.max(0, deltaY);
					deltaX = (width + gutter) / col - (cellWidth + gutter);
					deltaX = Math.max(0, deltaX);
					layout.cell.width = cellWidth + deltaX;
					layout.cell.height = cellHeight + deltaY;
				} else {
					layout.cell.width = cellWidth;
					layout.cell.height = cellHeight;
				}

				var allBlock = container.find(setting.selector).attr('id', '');
				var items, block = null, activeBlock = [];
				if (layout.filter) {
					items = allBlock.filter(layout.filter).addClass('fw-filter');
				} else {
					items = allBlock.removeClass('fw-filter');
				}

				layout.col = col;
				layout.row = row;

				items.each(function(index, item) {
					item.id = 'block-' + ++index;
					block = loadBlock(item, item.id);
					block && activeBlock.push(block);
				});

				engine[setting.engine](activeBlock, col, row);
				
				allBlock.each(function(index, item) {
					showBlock(item, item.id);
					setting.onSetBlock.call(item);
				});
				
			},
			
			fixSize: function(option) {
				var config = {
					block: null,
					width: null,
					height: null
				};
				$.extend(config, option);
				
				config.width != null && $(config.block).attr({'data-width': config.width});
				config.height != null && $(config.block).attr({'data-height': config.height});

				return this;
			},

			reset: function(option) {
				$.extend(setting, option);
				return this;
			},

			setFilter: function(selector) {
				layout.filter = selector;
				return this;
			},

			unsetFilter: function() {
				delete layout.filter;
				return this;
			}
		});

	};
 
})(jQuery);
