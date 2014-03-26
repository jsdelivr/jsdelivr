YUI.add('gallery-aui-image-viewer-gallery', function(A) {

/**
 * The ImageGallery Utility
 *
 * @module aui-image-viewer
 * @submodule aui-image-viewer-gallery
 */

var L = A.Lang,
	isBoolean = L.isBoolean,
	isNumber = L.isNumber,
	isObject = L.isObject,
	isString = L.isString,

	AUTO_PLAY = 'autoPlay',
	BODY = 'body',
	CONTENT = 'content',
	CURRENT_INDEX = 'currentIndex',
	DELAY = 'delay',
	DOT = '.',
	ENTRY = 'entry',
	HANDLER = 'handler',
	HIDDEN = 'hidden',
	HREF = 'href',
	IMAGE_GALLERY = 'image-gallery',
	IMG = 'img',
	LEFT = 'left',
	LINKS = 'links',
	OFFSET_WIDTH = 'offsetWidth',
	OVERLAY = 'overlay',
	PAGE = 'page',
	PAGINATOR = 'paginator',
	PAGINATOR_EL = 'paginatorEl',
	PAGINATOR_INSTANCE = 'paginatorInstance',
	PAUSE = 'pause',
	PAUSED = 'paused',
	PAUSED_LABEL = 'pausedLabel',
	PLAY = 'play',
	PLAYER = 'player',
	PLAYING = 'playing',
	PLAYING_LABEL = 'playingLabel',
	PX = 'px',
	REPEAT = 'repeat',
	SHOW_PLAYER = 'showPlayer',
	SPACE = ' ',
	SRC = 'src',
	THUMB = 'thumb',
	TOOLBAR = 'toolbar',
	TOTAL_LINKS = 'totalLinks',
	USE_ORIGINAL_IMAGE = 'useOriginalImage',
	VIEWPORT_REGION = 'viewportRegion',
	VISIBLE = 'visible',

	concat = function() {
		return Array.prototype.slice.call(arguments).join(SPACE);
	},

	getCN = A.ClassNameManager.getClassName,

	CSS_IMAGE_GALLERY_PAGINATOR = getCN(IMAGE_GALLERY, PAGINATOR),
	CSS_IMAGE_GALLERY_PAGINATOR_CONTENT = getCN(IMAGE_GALLERY, PAGINATOR, CONTENT),
	CSS_IMAGE_GALLERY_PAGINATOR_ENTRY = getCN(IMAGE_GALLERY, PAGINATOR, ENTRY),
	CSS_IMAGE_GALLERY_PAGINATOR_LINKS = getCN(IMAGE_GALLERY, PAGINATOR, LINKS),
	CSS_IMAGE_GALLERY_PAGINATOR_THUMB = getCN(IMAGE_GALLERY, PAGINATOR, THUMB),
	CSS_IMAGE_GALLERY_PLAYER = getCN(IMAGE_GALLERY, PLAYER),
	CSS_IMAGE_GALLERY_PLAYER_CONTENT = getCN(IMAGE_GALLERY, PLAYER, CONTENT),
	CSS_OVERLAY_HIDDEN = getCN(OVERLAY, HIDDEN),

	TEMPLATE_PLAYING_LABEL = '(playing)',
	TEMPLATE_PAGINATOR = '<div class="'+CSS_IMAGE_GALLERY_PAGINATOR_CONTENT+'">{PageLinks}</div>',

	TPL_LINK = '<span class="' + CSS_IMAGE_GALLERY_PAGINATOR_ENTRY + '"><span class="' + CSS_IMAGE_GALLERY_PAGINATOR_THUMB+'"></span></span>',
	TPL_LINK_CONTAINER = '<div class="' + CSS_IMAGE_GALLERY_PAGINATOR_LINKS + '"></div>',
	TPL_PAGINATOR_CONTAINER = '<div class="'+concat(CSS_OVERLAY_HIDDEN, CSS_IMAGE_GALLERY_PAGINATOR)+'"></div>',
	TPL_PLAYER_CONTAINER = '<div class="'+CSS_IMAGE_GALLERY_PLAYER+'"></div>',
	TPL_PLAYER_CONTENT = '<span class="'+CSS_IMAGE_GALLERY_PLAYER_CONTENT+'"></span>';

/**
 * <p><img src="assets/images/aui-image-viewer-gallery/main.png"/></p>
 *
 * A base class for ImageGallery, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Displays an image in a Overlay</li>
 *    <li>Displays list of thumbnails of the images as a control</li>
 *    <li>Slide show functionalities (i.e., play, pause etc)</li>
 *    <li>Keyboard navigation support</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.ImageGallery({
 *   links: '#gallery1 a',
 *   caption: 'Liferay Champion Soccer',
 *   captionFromTitle: true,
 *   preloadNeighborImages: true,
 *   preloadAllImages: true,
 *   showInfo: true
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="ImageGallery.html#configattributes">Configuration Attributes</a> available for
 * ImageGallery.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class ImageGallery
 * @constructor
 * @extends ImageViewer
 */
var ImageGallery = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property ImageGallery.NAME
		 * @type String
		 * @static
		 */
		NAME: IMAGE_GALLERY,

		/**
		 * Static property used to define the default attribute
		 * configuration for the ImageGallery.
		 *
		 * @property ImageGallery.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * If <code>true</code> the slide show will be played when the
	         * ImageGallery is displayed.
			 *
			 * @attribute autoPlay
			 * @default false
			 * @type boolean
			 */
			autoPlay: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Delay in milliseconds to change to the next image.
			 *
			 * @attribute delay
			 * @default 7000
			 * @type Number
			 */
			delay: {
				value: 7000,
				validator: isNumber
			},

			/**
			 * <a href="Paginator.html">Paginator</a> configuration Object. The
	         * <code>Paginator</code> handles the thumbnails control.
			 *
			 * @attribute paginator
			 * @default <a href="Paginator.html">Paginator</a> configuration Object.
			 * @type Object
			 */
			paginator: {
				value: {},
				setter: function(value) {
					var instance = this;
					var paginatorEl = instance.get(PAGINATOR_EL);
					var totalLinks = instance.get(TOTAL_LINKS);

					return A.merge(
						{
							containers: paginatorEl,
							pageContainerTemplate: TPL_LINK_CONTAINER,
							pageLinkContent: A.bind(instance._setThumbContent, instance),
							pageLinkTemplate: TPL_LINK,
							template: TEMPLATE_PAGINATOR,
							total: totalLinks,
							on: {
								changeRequest: function(event) {
									// fire changeRequest from ImageGallery passing the "state" object from Paginator
									instance.fire('changeRequest', { state: event.state })
								}
							}
						},
						value
					);
				},
				validator: isObject
			},

			/**
			 * Element which contains the <a href="Paginator.html">Paginator</a>
	         * with the thumbnails.
			 *
			 * @attribute paginatorEl
			 * @default Generated HTML div.
			 * @readOnly
			 * @type Node
			 */
			paginatorEl: {
				readyOnly: true,
				valueFn: function() {
					return A.Node.create(TPL_PAGINATOR_CONTAINER);
				}
			},

			/**
			 * Stores the <a href="Paginator.html">Paginator</a> instance.
			 *
			 * @attribute paginatorInstance
			 * @default null
			 * @type Paginator
			 */
			paginatorInstance: {
				value: null
			},

			/**
			 * If <code>true</code> the slide show is paused.
			 *
			 * @attribute paused
			 * @default false
			 * @type boolean
			 */
			paused: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Label to display when the slide show is paused.
			 *
			 * @attribute pausedLabel
			 * @default ''
			 * @type String
			 */
			pausedLabel: {
				value: '',
				validator: isString
			},

			/**
			 * If <code>true</code> the slide show is playing.
			 *
			 * @attribute playing
			 * @default false
			 * @type boolean
			 */
			playing: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Label to display when the slide show is playing.
			 *
			 * @attribute playingLabel
			 * @default '(Playing)'
			 * @type String
			 */
			playingLabel: {
				value: TEMPLATE_PLAYING_LABEL,
				validator: isString
			},

			/**
			 * Restart the navigation when reach the last element.
			 *
			 * @attribute repeat
			 * @default true
			 * @type boolean
			 */
			repeat: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Show the player controls (i.e., pause and show buttons).
			 *
			 * @attribute showPlayer
			 * @default true
			 * @type boolean
			 */
			showPlayer: {
				value: true,
				validator: isBoolean
			},

			/**
			 * <a href="Toolbar.html">Toolbar</a> with a play, and pause buttons.
			 *
			 * @attribute toolbar
			 * @default Generated Toolbar with a play, and pause buttons.
			 * @type Toolbar constructor.
			 */
			toolbar: {
				value: {},
				setter: function(value) {
					var instance = this;

					return A.merge(
						{
							children: [
								{
									id: PLAY,
									icon: PLAY
								},
								{
									id: PAUSE,
									icon: PAUSE
								}
							]
						},
						value
					);
				},
				validator: isObject
			},

			/**
			 * If <code>true</code> will use the original image as thumbnails.
			 *
			 * @attribute useOriginalImage
			 * @default false
			 * @type boolean
			 */
			useOriginalImage: {
				value: false,
				validator: isBoolean
			}
		},

		EXTENDS: A.ImageViewer,

		prototype: {
			/**
			 * Toolbar instance reference.
			 *
			 * @property toolbar
			 * @type Toolbar
			 * @protected
			 */
			toolbar: null,

			/**
			 * Stores the <code>A.later</code> reference.
			 *
			 * @property _timer
			 * @type Number
			 * @protected
			 */
			_timer: null,

			/**
			 * Create the DOM structure for the ImageGallery. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				ImageGallery.superclass.renderUI.apply(this, arguments);

				instance._renderPaginator();

				if (instance.get(SHOW_PLAYER)) {
					instance._renderPlayer();
				}
			},

			/**
			 * Bind the events on the ImageGallery UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				ImageGallery.superclass.bindUI.apply(this, arguments);

				instance._bindToolbarUI();

				instance.on('playingChange', instance._onPlayingChange);
				instance.on('pausedChange', instance._onPausedChange);

				instance.publish('changeRequest', { defaultFn: this._changeRequest });
			},

			/**
			 * Descructor lifecycle implementation for the ImageGallery class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destroy
			 * @protected
			 */
			destroy: function() {
				var instance = this;

				ImageGallery.superclass.destroy.apply(this, arguments);

				instance.get(PAGINATOR_INSTANCE).destroy();
			},

			/**
			 * Hide the <a href="Paginator.html">Paginator</a> with the thumbnails
		     * list.
			 *
			 * @method hidePaginator
			 */
			hidePaginator: function() {
				var instance = this;

				instance.get(PAGINATOR_EL).addClass(CSS_OVERLAY_HIDDEN);
			},

			/**
			 * Pause the slide show.
			 *
			 * @method pause
			 */
			pause: function() {
				var instance = this;

				instance.set(PAUSED, true);
				instance.set(PLAYING, false);

				instance._syncInfoUI();
			},

			/**
			 * Play the slide show.
			 *
			 * @method play
			 */
			play: function() {
				var instance = this;

				instance.set(PAUSED, false);
				instance.set(PLAYING, true);

				instance._syncInfoUI();
			},

			/**
			 * <p>Show the ImageGallery.</p>
			 *
			 * <p><strong>NOTE:</strong>Overloads the <a
		     * href="ImageViewer.html">ImageViewer</a> show method to not loadImage, the
		     * changeRequest now is responsible to do that if we invoke the superclass
		     * show method its loading the image, and the changeRequest loads again,
		     * avoiding double request.</p>
			 *
			 * @method show
			 */
			show: function() {
				var instance = this;
				var currentLink = instance.getCurrentLink();

				if (currentLink) {
					instance.showMask();

					// invoke the Overlay show method
					// NODE: A.ImageViewer is the parent of ImageGallery, the A.ImageViewer.superclass is the Overlay
					A.ImageViewer.superclass.show.apply(this, arguments);

					// changeRequest on paginatorInstance with the new page set
					var paginatorInstance = instance.get(PAGINATOR_INSTANCE);

					// page start on 1, index on 0, add +1 to the nextIndex to set the correct page on the paginator
					paginatorInstance.set(
						PAGE,
						instance.get(CURRENT_INDEX) + 1
					);

					paginatorInstance.changeRequest();
				}
			},

			/**
			 * Show the <a href="Paginator.html">Paginator</a> with the thumbnails
		     * list.
			 *
			 * @method showPaginator
			 */
			showPaginator: function() {
				var instance = this;

				instance.get(PAGINATOR_EL).removeClass(CSS_OVERLAY_HIDDEN);
			},

			/**
			 * Bind the Toolbar UI for the play and pause buttons.
			 *
			 * @method _bindToolbarUI
			 * @protected
			 */
			_bindToolbarUI: function() {
				var instance = this;

				if (instance.get(SHOW_PLAYER)) {
					var toolbar = instance.toolbar;

					var play = toolbar.item(PLAY);
					var pause = toolbar.item(PAUSE);

					if (play) {
						play.set(HANDLER, A.bind(instance.play, instance));
					}
					if (pause) {
						pause.set(HANDLER, A.bind(instance.pause, instance));
					}
				}
			},

			/**
			 * Cancel the timer between slides.
			 *
			 * @method _cancelTimer
			 * @protected
			 */
			_cancelTimer: function() {
				var instance = this;

				if (instance._timer) {
					instance._timer.cancel();
				}
			},

			/**
			 * Render the <a href="Paginator.html">Paginator</a> with the thumbnails.
			 *
			 * @method _renderPaginator
			 * @protected
			 */
			_renderPaginator: function() {
				var instance = this;
				var paginatorEl = instance.get(PAGINATOR_EL);

				A.one(BODY).append(
					paginatorEl.hide()
				);

				var paginatorInstance = new A.Paginator(
					instance.get(PAGINATOR)
				)
				.render();

				instance.set(PAGINATOR_INSTANCE, paginatorInstance);
			},

			/**
			 * Render the player controls.
			 *
			 * @method _renderPlayer
			 * @protected
			 */
			_renderPlayer: function() {
				var instance = this;
				var paginatorEl = instance.get(PAGINATOR_EL);
				var playerContent = A.Node.create(TPL_PLAYER_CONTENT);

				paginatorEl.append(
					A.Node.create(TPL_PLAYER_CONTAINER).append(playerContent)
				);

				instance.toolbar = new A.Toolbar(
					instance.get(TOOLBAR)
				)
				.render(playerContent);
			},

			/**
			 * Start the timer between slides.
			 *
			 * @method _startTimer
			 * @protected
			 */
			_startTimer: function() {
				var instance = this;
				var delay = instance.get(DELAY);

				instance._cancelTimer();

				instance._timer = A.later(delay, instance, instance._syncSlideShow);
			},

			/**
			 * Sync the controls UI.
			 *
			 * @method _syncControlsUI
			 * @protected
			 */
			_syncControlsUI: function() {
				var instance = this;

				ImageGallery.superclass._syncControlsUI.apply(this, arguments);

				if (instance.get(VISIBLE)) {
					instance._syncSelectedThumbUI();

					instance.showPaginator();
				}
				else {
					instance.hidePaginator();

					instance._cancelTimer();
				}
			},

			/**
			 * Sync the selected thumb UI.
			 *
			 * @method _syncSelectedThumbUI
			 * @protected
			 */
			_syncSelectedThumbUI: function() {
				var instance = this;
				var currentIndex = instance.get(CURRENT_INDEX);
				var paginatorInstance = instance.get(PAGINATOR_INSTANCE);
				var paginatorIndex = paginatorInstance.get(PAGE) - 1;

				// when currentIndex != paginatorIndex we need to load the new image
				if (currentIndex != paginatorIndex) {
					// originally the paginator changeRequest is only invoked when user interaction happens, forcing invoke changeRequest from paginator
					paginatorInstance.set(PAGE, currentIndex + 1);

					paginatorInstance.changeRequest();
				}
			},

			/**
			 * Sync the slide show UI.
			 *
			 * @method _syncSlideShow
			 * @protected
			 */
			_syncSlideShow: function() {
				var instance = this;

				if (!instance.hasNext()) {
					if (instance.get(REPEAT)) {
						instance.set(CURRENT_INDEX, -1);
					}
					else {
						instance._cancelTimer();
					}
				}

				instance.next();
			},

			/**
			 * Change the UI when click on a thumbnail.
			 *
			 * @method _changeRequest
			 * @param {EventFacade} event
			 * @protected
			 */
			_changeRequest: function(event) {
				var instance = this;
				var paginatorInstance = event.state.paginator;
				var newState = event.state;
				var beforeState = newState.before;
				var page = newState.page;

				// only update the paginator UI when the Overlay is visible
				if (!instance.get(VISIBLE)) {
					return false; // NOTE: return
				}

				var currentIndex = instance.get(CURRENT_INDEX);
				var paginatorIndex = page - 1;

				// check if the beforeState page number is different from the newState page number.
				if (!beforeState || (beforeState && beforeState.page != page)) {
					// updating currentIndex
					instance.set(CURRENT_INDEX, paginatorIndex);

					// loading current index image
					instance.loadImage(
						instance.getCurrentLink().attr(HREF)
					);

					// updating the UI of the paginator
					paginatorInstance.setState(newState);

					// restart the timer if the user change the image, respecting the paused state
					var paused = instance.get(PAUSED);
					var playing = instance.get(PLAYING);

					if (playing && !paused) {
						instance._startTimer();
					}
				}
			},

			/**
			 * See <a href="Paginator.html#method_pageLinkContent">pageLinkContent</a>.
			 *
			 * @method _setThumbContent
			 * @param {Node} pageEl
			 * @param {Number} pageNumber
			 * @protected
			 */
			_setThumbContent: function(pageEl, pageNumber) {
				var instance = this;
				var index = pageNumber - 1;
				var link = instance.getLink(index);
				var thumbEl = pageEl.one(DOT+CSS_IMAGE_GALLERY_PAGINATOR_THUMB);
				var thumbSrc = null;

				if (instance.get(USE_ORIGINAL_IMAGE)) {
					thumbSrc = link.attr(HREF);
				}
				else {
					// try to find a inner thumbnail image to show on the paginator
					var innerImage = link.one(IMG);

					if (innerImage) {
						thumbSrc = innerImage.attr(SRC);
					}
				}

				if (thumbSrc && thumbEl.getData('thumbSrc') != thumbSrc) {
					thumbEl.setStyles({
						// use background to show the thumbnails to take advantage of the background-position: 50% 50%
						backgroundImage: 'url(' + thumbSrc + ')'
					});

					thumbEl.setData('thumbSrc', thumbSrc);
				}
			},

			/**
			 * Get the <a href="ImageViewer.html#config_info">info</a> template.
			 *
			 * @method _getInfoTemplate
			 * @param {String} v template
			 * @protected
			 * @return {String} Parsed string.
			 */
			_getInfoTemplate: function(v) {
				var label;
				var instance = this;
				var paused = instance.get(PAUSED);
				var playing = instance.get(PLAYING);

				if (playing) {
					label = instance.get(PLAYING_LABEL);
				}
				else if (paused) {
					label = instance.get(PAUSED_LABEL);
				}

				return concat(
					ImageGallery.superclass._getInfoTemplate.apply(this, arguments),
					label
				);
			},

			/**
			 * Fires after the value of the
			 * <a href="ImageViewer.html#config_visible">visible</a> attribute change.
			 *
			 * @method _afterVisibleChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterVisibleChange: function(event) {
				var instance = this;

				// invoke A.ImageViewer _afterVisibleChange method
				ImageGallery.superclass._afterVisibleChange.apply(this, arguments);

				if (event.newVal) {
					// trigger autoPlay when overlay is visible
					if (instance.get(AUTO_PLAY)) {
						instance.play();
					}
				}
			},

			/**
			 * Fires before the value of the
			 * <a href="ImageGallery.html#config_paused">paused</a> attribute change.
			 *
			 * @method _onPausedChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_onPausedChange: function(event) {
				var instance = this;

				if (event.newVal) {
					instance._cancelTimer();
				}
			},

			/**
			 * Fires before the value of the
			 * <a href="ImageGallery.html#config_playing">playing</a> attribute change.
			 *
			 * @method _onPlayingChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_onPlayingChange: function(event) {
				var instance = this;

				if (event.newVal) {
					instance._startTimer();
				}
			}
		}
	}
);

A.ImageGallery = ImageGallery;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-image-viewer-base','gallery-aui-paginator','gallery-aui-toolbar']});
