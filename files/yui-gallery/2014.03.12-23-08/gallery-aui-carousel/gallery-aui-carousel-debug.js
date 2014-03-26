YUI.add('gallery-aui-carousel', function(A) {

var Lang = A.Lang,

	CAROUSEL = 'carousel',

	getCN = A.ClassNameManager.getClassName,

	CSS_ITEM = getCN(CAROUSEL, 'item'),
	CSS_ITEM_ACTIVE = getCN(CAROUSEL, 'item', 'active'),
	CSS_ITEM_TRANSITION = getCN(CAROUSEL, 'item', 'transition'),
	CSS_MENU_ACTIVE = getCN(CAROUSEL, 'menu', 'active'),
	CSS_MENU_INDEX = getCN(CAROUSEL, 'menu', 'index'),
	CSS_MENU_ITEM = getCN(CAROUSEL, 'menu', 'item'),
	CSS_MENU_NEXT = getCN(CAROUSEL, 'menu', 'next'),
	CSS_MENU_PLAY = getCN(CAROUSEL, 'menu', 'play'),
	CSS_MENU_PAUSE = getCN(CAROUSEL, 'menu', 'pause'),
	CSS_MENU_PREV = getCN(CAROUSEL, 'menu', 'prev'),

	TPL_MENU_INDEX = ['<li><a class="', CSS_MENU_ITEM, CSS_MENU_INDEX, '">'].join(' '),
	TPL_MENU_NEXT = ['<li><a class="', CSS_MENU_ITEM, CSS_MENU_NEXT, '">'].join(' '),
	TPL_MENU_PLAY = ['<li><a class="', CSS_MENU_ITEM, CSS_MENU_PLAY, '">'].join(' '),
	TPL_MENU_PREV = ['<li><a class="', CSS_MENU_ITEM, CSS_MENU_PREV, '">'].join(' ');

var Carousel = A.Component.create(
	{
		NAME: CAROUSEL,

		ATTRS: {
			activeIndex: {
				value: 0,
				setter: function (val) {
					val = (val === 'rand') ? this._createIndexRandom() : Math.max(Math.min(val, this.nodeSelection.size()), -1);
					return val;
				}
			},
			animationTime: {
				value: 0.5
			},
			intervalTime: {
				value: 0.75
			},
			itemSelector: {
				value: '>*'
			},
			playing: {
				value: true
			}
		},

		prototype: {
			animation: null,
			nodeSelection: null,
			nodeMenu: null,

			initializer: function(){
				var instance = this;

				instance.animation = new A.Anim({
					duration: instance.get('animationTime'),
					to: {
						opacity: 1
					}
				});
			},

			renderUI: function () {
				var instance = this;

				instance._updateNodeSelection();
				instance._renderMenu();
			},

			bindUI: function () {
				var instance = this;

				instance.after({
					activeIndexChange: instance._afterActiveIndexChange,
					animationTimeChange: instance._afterAnimationTimeChange,
					itemSelectorChange: instance._afterItemSelectorChange,
					intervalTimeChange: instance._afterIntervalTimeChange,
					playingChange: instance._afterPlayingChange
				});

				instance._bindMenu();

				if (instance.get('playing') === true) {
					instance._afterPlayingChange({ prevVal: false, newVal: true });
				}
			},

			syncUI: function () {
				var instance = this;

				instance._uiSetActiveIndex(instance.get('activeIndex'));
			},

			item: function (val) {
				this.set('activeIndex', val);
			},

			next: function () {
				this._updateIndexNext();
			},

			pause: function () {
				this.set('playing', false);
			},

			play: function () {
				this.set('playing', true);
			},

			prev: function () {
				this._updateIndexPrev();
			},

			_afterActiveIndexChange: function (e) {
				this._uiSetActiveIndex(e.newVal, {
					prevVal: e.prevVal,
					animate: e.animate
				});
			},

			_afterAnimationTimeChange: function (e) {
				this.animation.set('duration', e.newVal);
			},

			_afterItemSelectorChange: function (e) {
				this._updateNodeSelection();
			},

			_afterIntervalTimeChange: function (e) {
				var instance = this;

				instance._clearIntervalRotationTask();
				instance._createIntervalRotationTask();
			},

			_afterPlayingChange: function (e) {
				var instance = this;
				var menuPlayItem = instance.nodeMenu.get('children').item(0).get('children').item(0);

				if (e.newVal) {
					instance._createIntervalRotationTask();
					menuPlayItem.removeClass(CSS_MENU_PLAY).addClass(CSS_MENU_PAUSE);
				}
				else {
					instance._clearIntervalRotationTask();
					menuPlayItem.removeClass(CSS_MENU_PAUSE).addClass(CSS_MENU_PLAY);
				}
			},

			_bindMenu: function () {
				var instance = this,
					menu = instance.nodeMenu,
					lis = menu.get('children');

				lis.each(
					function (item, index, collection) {
						if (index > 1 && index !== collection.size() - 1) {
							item.on('click', instance._onMenuItemClick, instance);
						}
					}
				);

				lis.item(0).on('click', instance._onMenuPlayClick, instance);
				lis.item(1).on('click', instance._updateIndexPrev, instance);
				lis.item(lis.size() - 1).on('click', instance._updateIndexNext, instance);
			},

			_clearIntervalRotationTask: function () {
				clearInterval(this._intervalRotationTask);
			},

			_createIndexRandom: function () {
				return Math.ceil(Math.random() * this.nodeSelection.size()) - 1;
			},

			_createIntervalRotationTask: function () {
				var instance = this;

				instance._clearIntervalRotationTask();

				instance._intervalRotationTask = setInterval(function () {
					instance._updateIndexNext({
						animate: true
					});
				}, instance.get('intervalTime') * 1000);
			},

			_onAnimationEnd: function(e, newImage, oldImage, newMenuItem, oldMenuItem) {
				if (oldImage) {
					oldImage.removeClass(CSS_ITEM_TRANSITION);
				}

				newImage.setStyle('opacity', '1');
			},

			_onAnimationStart: function(e, newImage, oldImage, newMenuItem, oldMenuItem) {
				newImage.addClass(CSS_ITEM_ACTIVE);

				newMenuItem.addClass(CSS_MENU_ACTIVE);

				if (oldImage) {
					oldImage.removeClass(CSS_ITEM_ACTIVE).addClass(CSS_ITEM_TRANSITION);
				}

				if (oldMenuItem) {
					oldMenuItem.removeClass(CSS_MENU_ACTIVE);
				}
			},

			_onMenuItemClick: function (e) {
				e.preventDefault();

				var instance = this;

				instance.set('activeIndex', instance.nodeMenu.all('li').indexOf(e.currentTarget) - 2);
			},

			_onMenuPlayClick: function (e) {
				this.set('playing', !this.get('playing'));
			},

			_renderMenu: function () {
				var instance = this,
					menu = A.Node.create('<menu>'),
					li;

				li = A.Node.create(TPL_MENU_PLAY);
				menu.appendChild(li);

				li = A.Node.create(TPL_MENU_PREV);
				menu.appendChild(li);

				instance.nodeSelection.each(function (item, index, collection) {
					li = A.Node.create([TPL_MENU_INDEX, ''].join(index));

					menu.appendChild(li);
				});

				li = A.Node.create(TPL_MENU_NEXT);
				menu.appendChild(li);

				instance.get('contentBox').appendChild(menu);
				instance.nodeMenu = menu;
			},

			_uiSetActiveIndex: function (newVal, objOptions) {
				var menuOffset = 2;
				var instance = this;
				var newImage = instance.nodeSelection.item(newVal);
				var oldImage = null;
				var oldMenuItem = null;
				var newMenuItem = instance.nodeMenu.get('children').item(newVal + menuOffset).get('children').item(0);
				var onStart = null;
				var onEnd = null;

				instance.animation.set('node', newImage);

				if (objOptions && !Lang.isUndefined(objOptions.prevVal)) {
					oldMenuItem = instance.nodeMenu.get('children').item(objOptions.prevVal + menuOffset).get('children').item(0);
					oldImage = instance.nodeSelection.item(objOptions.prevVal);
					oldImage.removeClass(CSS_ITEM_ACTIVE).addClass(CSS_ITEM_TRANSITION);
					instance.animation.stop();
				}

				newImage.setStyle('opacity', '0');

				onStart = instance.animation.on('start', function(e) {
					instance._onAnimationStart(e, newImage, oldImage, newMenuItem, oldMenuItem);
					onStart.detach();
				});

				onEnd = instance.animation.on('end', function(e) {
					instance._onAnimationEnd(e, newImage, oldImage, newMenuItem, oldMenuItem);
					onEnd.detach();
				});

				if (objOptions && objOptions.animate) {
					instance.animation.run();
				}
				else {
					instance.animation.fire('start');
					instance.animation.fire('end');
				}
			},

			_updateIndexNext: function (options) {
				var instance = this;

				instance.set('activeIndex', (instance.get('activeIndex') + 1) > (instance.nodeSelection.size() - 1) ? 0 : instance.get('activeIndex') + 1, options);
			},

			_updateIndexPrev: function (options) {
				var instance = this;

				instance.set('activeIndex', (instance.get('activeIndex') - 1) < 0 ? (instance.nodeSelection.size() - 1) : instance.get('activeIndex') - 1, options);
			},

			_updateNodeSelection: function () {
				var instance = this;

				instance.nodeSelection = instance.get('contentBox').all(instance.get('itemSelector')).addClass(CSS_ITEM);
			},

			_intervalRotationTask: null
		}
	}
);

A.Carousel = Carousel;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-base','anim']});
