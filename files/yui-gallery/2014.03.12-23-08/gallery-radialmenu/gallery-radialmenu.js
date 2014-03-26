YUI.add('gallery-radialmenu', function(Y) {

	// constants
var	Lang = Y.Lang,

	_bind = function(fn, context) {
		return Y.bind(fn, context);
	},

	_cancel = function(timer) {
		if (timer) {
			timer.cancel();
			timer = null;
		}
	},

	_detach = function(ctx, evt) {
		var o = ctx[evt];

		if (o) {
			o.detach();
			ctx[evt] = null;
		}
	},

    /**
     * The RadialMenuPanel constructor.
     * @method RadialMenuPanel
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	RadialMenuPanel = function(conf) {
		RadialMenuPanel.superclass.constructor.apply(this, arguments);
	};

	RadialMenuPanel.NAME = "radialMenuPanel";

	RadialMenuPanel.ATTRS = {

		/**
		 * @attribute centerpt
		 * @type Array
		 * @default null
		 * @description The center point for panel.
		 */
		centerpt: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute content
		 * @type String
		 * @default ''
		 * @description The panel HTML content.
		 */
		content: {
			value: '',
			validator: Lang.isString
		},

		/**
		 * @attribute hoverClass
		 * @type String
		 * @default ''
		 * @description The hover class.
		 */
		hoverClass: {
			value: 'yui-radialmenupanel-hover',
			validator: Lang.isString
		},

		/**
		 * @attribute index
		 * @type Number
		 * @default 0
		 * @description The panel radial position.
		 */
		index: {
			value: 0,
			validator: Lang.isNumber
		},

		/**
		 * @attribute radialpt
		 * @type Array
		 * @default null
		 * @description The radial point for panel.
		 */
		radialpt: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute styles
		 * @type Object
		 * @default null
		 * @description The style overrides for this panel.
		 */
		styles: {
			value: null,
			validator: Lang.isObject
		},

		/**
		 * @attribute tagName
		 * @type String
		 * @default "div"
		 * @description The tag to use for panels.
		 */
		tagName: {
			value: 'div',
			validator: Lang.isString
		},

		/**
		 * @see Widget.ATTRS.value
		 */
		visible: {
			value: false
		}
	};


	Y.extend(RadialMenuPanel, Y.Overlay, {
		_mouseEnterHandler: null,
		_mouseLeaveHandler: null,

		/**
		 * Handles the mouse enter event, adding the hover class.
		 * @method _handleMouseEnter
		 * @protected
		 */
		_handleMouseEnter: function() {
			this.get('boundingBox').addClass(this.get('hoverClass'));
		},

		/**
		 * Handles the mouse leave event, removing the hover class.
		 * @method _handleMouseLeave
		 * @protected
		 */
		_handleMouseLeave: function() {
			this.get('boundingBox').removeClass(this.get('hoverClass'));
		},

		/**
		 * @see Y.Widget.bindUI
		 */
		bindUI: function() {
			var _this = this,
				node = _this.get('boundingBox');

			_this._mouseEnterHandler = node.on('mouseenter', _bind(_this._handleMouseEnter, _this));
			_this._mouseLeaveHandler = node.on('mouseleave', _bind(_this._handleMouseLeave, _this));
		},

		/**
		 * @see Y.Base.destructor
		 */
		destructor: function() {
			var _this = this,
				node = _this.get('boundingBox')._node;

			_this.hide();
			RadialMenuPanel.superclass.destructor.apply(_this, arguments);
			if (node.parentNode) {node.parentNode.removeChild(node);}
		},

		/**
		 * @see Y.Widget.hide
		 */
		hide: function() {
			_detach(this, '_mouseEnterHandler');
			_detach(this, '_mouseLeaveHandler');
			RadialMenuPanel.superclass.hide.apply(this, arguments);
		},

		/**
		 * @see Y.Base.initializer
		 */
		initializer: function(config) {
			RadialMenuPanel.superclass.initializer.apply(this, arguments);
		},

		/**
		 * @see Y.Widget.renderUI
		 */
		renderUI: function() {
			this.hide();
		},

		/**
		 * @see Y.Widget.show
		 */
		show: function() {
			this.bindUI();
			RadialMenuPanel.superclass.show.apply(this, arguments);
		},

		/**
		 * @see Y.Widget.syncUI
		 */
		syncUI: function() {
			var content = this.get('content');

			if (content) {
				this.get('contentBox').set('innerHTML', content);
			}
		}
	});

Y.RadialMenuPanel = RadialMenuPanel;
	
	// constants
var	CLS_PANEL = 'yui-' + Y.RadialMenuPanel.NAME.toLowerCase(),

	_getPanel = function(panels, node) {
		return Y.Array.find(panels, function(panel, i) {
			return panel.get('boundingBox').get('id') == node.get('id');
		});
	},

	_isBetween = function(i, lowerBounds, upperBounds) {
		return i > lowerBounds && i < upperBounds;
	},

    /**
     * The RadialMenu constructor.
     * @method RadialMenu
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	RadialMenu = function(conf) {
		RadialMenu.superclass.constructor.apply(this, arguments);
	};

	RadialMenu.ATTRS = {

		/**
		 * @attribute closeOnClick
		 * @type Boolean
		 * @default false
		 * @description Whether the menu should close on any click event or not.
		 */
		closeOnClick: {
			value: true
		},

		/**
		 * @attribute diameter
		 * @type Number
		 * @default 100
		 * @description The inner diameter of menu.
		 */
		diameter: {
			value: 100,
			validator: function(val) {
				return Lang.isNumber(val) && 100 < val;
			}
		},

		/**
		 * @attribute keyHoldTimeout
		 * @type Number
		 * @default 500
 		 * @description The timeout when holding down a key.
		 */
		keyHoldTimeout: {
			value: 500,
			validator: Lang.isNumber
		},

		/**
		 * @attribute panels
		 * @type Array
		 * @default []
		 * @description An array of RadialMenuPanels.
		 */
		panels: {
			value: [],
			validator: Lang.isArray
		},

		/**
		 * @attribute centerPoint
		 * @type Array
		 * @default null
		 * @description A position.
		 */
		centerPoint: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute useMask
		 * @type Boolean
		 * @default false
		 * @description When true, mask the viewport.
		 */
		useMask: {
			value: false,
			validator: Lang.isBoolean
		},

		/**
		 * @see Widget.ATTRS.value
		 */
		visible: {
			value: false
		}
	};

	RadialMenu.NAME = "radialMenu";


	Y.extend(RadialMenu, Y.Overlay, {
		_isKeyPressed: false,

		_selectedPanel: null,
		
		_nodeClickHandle: null,

		_keyDownHandle: null,
		_keyUpHandle: null,

		_timerKeyDown: null,

		/**
		 * Callback function for clicking inside the widget node.
		 * @method _handleClick
		 * @param e {Event} Required. The triggered `click` JavaScript event.
		 * @private
		 */
		_handleClick: function(e) {
			var panels = this.get('panels'),
				targ = e.target,
				node = targ.hasClass(CLS_PANEL) ? targ : targ.ancestor('.' + CLS_PANEL),
				panel, i;

			if (node) {
				panel = _getPanel(panels, node);
				
				if (panel) {
					e.halt();
					i = panel.get('index');
					this.fire('panelClicked', panel.get('boundingBox'), panel);
					this.fire('panelClicked' + i, panel.get('boundingBox'), panel);
				}
			}

			if (this.get('closeOnClick')) {this.hide();}
		},

		/**
		 * Callback function for pressing a key while the menu is open.
		 * @method _handleKeyDown
		 * @param e {Event} Required. The triggered `keydown` JavaScript event.
		 * @private
		 */
		_handleKeyDown: function(e) {
			var panels = this.get('panels'),
				selectedPanel = this._selectedPanel,
				i = selectedPanel ? selectedPanel.get('index') : 0,
				n = panels.length,
				isValid = false,
				m, l=n%2;

			// todo: this logic could be improved by checking if the next position is further in the direction the user is trying to go; this would fix the corner-case issues

			switch (e.keyCode) {
				case 38: // up
					if (0 != i) {
					isValid = true;
						if (n / 2 > i) {
							i -= 1;
						}
						else {
							i += 1;
						}
					}
				break;

				case 39: // right
					m = n / 4;

					if (m != i && ! (l && _isBetween(i, m-1, m+1))) {
					isValid = true;
						if (m >= i + 1 || n - m <= i) {
							i += 1;
						}
						else if (m <= i - 1) {
							i -= 1;
						}
					}
				break;

				case 40: // down
					m = n / 2;

					if (m != i && ! (l && _isBetween(i, m-1, m+1))) {
					isValid = true;
						if (m >= i + 1) {
							i += 1;
						}
						else if (m <= i - 1) {
							i -= 1;
						}
					}
				break;

				case 37: // left
					m = n / 4;

					if (n - m != i && ! (l && _isBetween(i, n-m-1, n-m+1))) {
					isValid = true;
						if (m < i && n - m >= i + 1) {
							i += 1;
						}
						else if (n - m <= i - 1 || i <= m) {
							i -= 1;
						}
					}
				break;

				case 13: // enter
					if (selectedPanel) {
						e.target = selectedPanel.get('boundingBox');
						this._handleClick(e);
					}
				break;

				case 27: // escape
					this.hide();
				break;
			}

			if (isValid) {
				_cancel(this._timerKeyDown);

				if (0 > i){
					i = n - 1;
				}
				else if (n - 1 < i) {
					i = 0;
				}


				n = this.get('keyHoldTimeout');
				if (0 < n) {
					this._timerKeyDown = Y.later(n, this, this._handleKeyDown, e);
				}
				if (selectedPanel) {selectedPanel._handleMouseLeave();}
				selectedPanel = panels[i];
				this._selectedPanel = selectedPanel;
				selectedPanel._handleMouseEnter();
				this._isKeyPressed = true;
			}
		},

		/**
		 * Callback function for releasing a key while the menu is open.
		 * @method _handleKeyUp
		 * @param e {Event} Required. The triggered `keyup` JavaScript event.
		 * @private
		 */
		_handleKeyUp: function(e) {
			_cancel(this._timerKeyDown);
			this._isKeyPressed = false;
		},

		/**
		 * @see Y.Widget.bindUI
		 */
		bindUI: function() {
			// only bind the UI if it is visible
			if (this.get('visible')) {
				var _this = this,
					doc = document;

				if (! _this._keyDownHandle) {
					_this._keyDownHandle = Y.on('keydown', _bind(_this._handleKeyDown, _this), doc);
					_this._keyUpHandle = Y.on('keyup', _bind(_this._handleKeyUp, _this), doc);
					_this._nodeClickHandle = Y.on("click", _bind(_this._handleClick, _this), doc);
				}
			}
		},

		/**
		 * @see Y.Base.destructor
		 */
		destructor: function() {
			this.hide();
		},

		/**
		 * @see Y.Widget.hide
		 */
		hide: function() {
			var _this = this;

			_detach(_this, '_nodeClickHandle');
			_detach(_this, '_keyDownHandle');
			_detach(_this, '_keyUpHandle');
			_cancel(_this._timerKeyDown);

			if (_this._selectedPanel) {
				_this._selectedPanel.syncUI();
				_this._selectedPanel = null;
			}

			Y.each(_this.get('panels'), function(panel) {
				panel.hide();
			});

			RadialMenu.superclass.hide.apply(this, arguments);
		},

		/**
		 * @see Y.Base.initializer
		 */
		initializer: function(config) {
			this.get('boundingBox').setStyle('position', 'absolute');
		},

		/**
		 * @see Y.Widget.show
		 */
		show: function() {
			var _this = this,
				box, width, height;

			_this.syncUI();

			if (_this.get('useMask')) {
				box = _this.get('boundingBox');
				height = box.get('docHeight');
				width = box.get('docWidth');

				box.setStyle('height', height + 'px');
				box.setStyle('width', width + 'px');

				RadialMenu.superclass.show.apply(_this, arguments);
			}
			
			Y.later(200, _this, _this.bindUI);
		},

		/**
		 * @see Y.Widget.syncUI
		 */
		syncUI: function() {
			var _this = this,
				panels = _this.get('panels'),
				n = _this.get('panels').length,
				radius = _this.get('diameter') / 2,
				pt = _this.get('centerPoint'),
				angle = 360 / n,
				a, o, x, y, reg, viewport;

			if (! pt) {
				viewport = _this.get('boundingBox').get('viewportRegion');
				pt = [
					viewport.left + (viewport.width - 5) / 2,
					viewport.top + (viewport.height - 5) / 2
				];
			}
			
			Y.each(panels, function(panel, i) {
				reg = panel.get('boundingBox').get('region');
				a = (angle * i - 90) * Math.PI / 180;
				x = pt[0] + radius * Math.cos(a);
				y = pt[1] + radius * Math.sin(a);
				panel.set('xy', [x, y]);
				panel.set('index', i);
				panel.set('centerpt', [pt[0] - (reg.width / 2), pt[1] - (reg.height / 2)]);
				panel.set('radialpt', [x,y]);
				panel.set('zIndex', 100 + i);
				panel[panel.get('rendered') ? 'syncUI' : 'render']();
				panel.after(panel._handleMouseEnter, function() {_this._selectedPanel = panel});
				panel.after(panel._handleMouseLeave, function() {_this._selectedPanel = null});
			}, _this);
		}
	});

Y.RadialMenu = RadialMenu;


if (Y.Anim && Y.Plugin) {	
		/**
		 * The RadialMenu constructor.
		 * @method RadialMenuAnim
		 * @param conf {Object} Optional. Configuration parameters.
		 * @constructor
		 * @public
		 */
	var	RadialMenuAnim = function(conf) {
			RadialMenuAnim.superclass.constructor.apply(this, arguments);
			this._enabled = true;
		};

		RadialMenuAnim.ATTRS = {
			animType: {
				value: 'radiate',
				validate: function(val) {
					return 'rotate' == val || 'radiate' == val;
				}
			},

			duration: {
				value: 1,
				validate: Lang.isNumber
			},

			easingIn: {
				value: Y.Easing.elasticIn
			},

			easingOut: {
				value: Y.Easing.elasticOut
			},

			rotation: {
				value: 90,
				validate: Lang.isNumber
			}
		};

		RadialMenuAnim.NS = "radialMenuAnim";


		Y.extend(RadialMenuAnim, Y.Plugin.Base, {
			_enabled: null,

			animClosed: function() {
				if (!this._enabled) {return;}
				var host = this.get('host'),
					panels = host.get('panels'),
					fnName = this.get('animType') + 'In',
					n = panels.length,
					duration = this.get('duration'),
					easing = this.get('easingIn');

				Y.each(panels,function(panel, i) {
					panel.show();
					var anim = new Y.Anim({duration: duration, easing: easing, node: panel.get('boundingBox')});
					this[fnName](anim, panel.get('centerpt'), panel.get('radialpt'));
					anim.on('end', Y.bind(panel.hide, panel));
					anim.run();
				}, this);
			},

			animOpen: function() {
				if (!this._enabled) {return;}
				var host = this.get('host'),
					panels = host.get('panels'),
					fnName = this.get('animType') + 'Out',
					duration = this.get('duration'),
					easing = this.get('easingOut');

				Y.each(panels,function(panel) {
					panel.show();
					var anim = new Y.Anim({duration: duration, easing: easing, node: panel.get('boundingBox')});
					this[fnName](anim, panel.get('centerpt'), panel.get('radialpt'));
					anim.run();
				}, this);
			},

			destructor: function() {

			},

			disable: function() {
				this._enabled = false;
			},

			enable: function() {
				this._enabled = true;
			},

			initializer: function() {
				var _this = this,
					_prefix = _this.get('animType');

				_this.doAfter('syncUI', _this.syncUI);
				_this.doAfter('hide', _this.animClosed);
				_this.doAfter('show', _this.animOpen);
			},

			radiateIn: function(anim, centerpt, radialpt) {
				anim.set('to', {
					left: centerpt[0],
					top: centerpt[1]
				});
			},

			radiateOut: function(anim, centerpt, radialpt) {
				anim.set('to', {
					left: radialpt[0],
					top: radialpt[1]
				});
			},

			rotateIn: function(anim, centerpt, radialpt) {
				anim.set('to', {
					curve: this.rotateInCurve(centerpt, radialpt)
				})
			},

			rotateInCurve: function(centerpt, radialpt) {
				var radius = this.get('host').get('diameter') / 2,
					rotation = this.get('rotation'),
					angle = ((centerpt[0] - radialpt[0]) / radius),
					points = [],
					i=0, n=10, astep = rotation / n, rstep = radius / n;

				for (0; i < n; i += 1) {
					points[i] = [
						Math.floor(centerpt[0] + radius * Math.cos(angle)),
						Math.floor(centerpt[1] + radius * Math.sin(angle))
					];

					angle -= astep;
					radius -= rstep;
				}

				points[i] = centerpt;
				return points;
			},

			rotateOut: function(anim, centerpt, radialpt) {
				anim.set('to', {
					curve: this.rotateOutCurve(centerpt, radialpt)
				})
			},

			rotateOutCurve: function(centerpt, radialpt) {
				var radius = this.get('host').get('diameter') / 2,
					rotation = this.get('rotation'),
					angle = ((radialpt[0] - centerpt[0]) / radius) - rotation,
					points = [],
					i=0, n=10, astep = rotation / n, rstep = radius / n;

				radius = rstep;
				angle = astep;

				for (1; i < n; i += 1) {
					points[i] = [
						Math.floor(centerpt[0] + radius * Math.cos(angle)),
						Math.floor(centerpt[1] + radius * Math.sin(angle))
					];

					angle += astep;
					radius += rstep;
				}

				points[i] = radialpt;
				return points;
			},

			syncUI: function(a) {
				if (!this._enabled) {return;}

				Y.each(this.get('host').get('panels'),function(panel) {
					var node = panel.get('boundingBox'),
						centerpt = panel.get('centerpt');
					panel.set('xy', centerpt);
				});
			}
		});

	Y.RadialMenuAnim = RadialMenuAnim;
}


}, 'gallery-2010.03.29-18-07' ,{optional:['anim', 'plugin'], requires:['overlay', 'collection', 'event-mouseenter', 'node']});
