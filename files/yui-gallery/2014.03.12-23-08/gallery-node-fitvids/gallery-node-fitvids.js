YUI.add('gallery-node-fitvids', function(Y) {

	/**
	 * <p>The FitVids Node Plugin transforms video embeds into fluid width video embeds.
	 *
	 * <p>
	 * <code>
	 * &#60;script type="text/javascript"&#62; <br>
	 * <br>
	 *       //  Call the "use" method, passing in "gallery-node-fitvids".  This will <br>
	 *       //  load the script and CSS for the FitVids Node Plugin and all of <br>
	 *       //  the required dependencies. <br>
	 * <br>
	 *       YUI().use('gallery-node-fitvids', 'event-base', function(Y) { <br>
	 * <br>
	 *           //  Use the 'contentready' event to initialize fitvids when <br>
	 *           //  the element that contains the video embed<br>
	 *           //  is ready to be scripted. <br>
	 * <br>
	 *           Y.on('contentready', function () { <br>
	 * <br>
	 *               //  The scope of the callback will be a Node instance <br>
	 *               //  representing the container element (&#60;div id="container"&#62;). <br>
	 *               //  Therefore, since "this" represents a Node instance, it <br>
	 *               //  is possible to just call "this.plug" passing in a <br>
	 *               //  reference to the FitVids Node Plugin. <br>
	 * <br>
	 *               this.plug(Y.Plugin.NodeFitVids); <br>
	 * <br>
	 *           }, '#container'); <br>
	 * <br>      
	 *       }); <br>
	 * <br>  
	 *   &#60;/script&#62; <br>
	 * </code>
	 * </p>
	 *
	 * Based on FitVids - https://github.com/davatron5000/FitVids.js
	 *
	 * @module gallery-node-fitvids
	 */

	var CLASS_NAME = Y.ClassNameManager.getClassName('fluid-width-video-wrapper'),
		
		ANCESTOR_SELECTOR = '.' + CLASS_NAME,

		DATA_KEY = 'fitvids:originalAttributes',
		
		SELECTORS = [
			'iframe[src^="http://player.vimeo.com"]',
			'iframe[src^="http://www.youtube.com"]',
			'iframe[src^="https://www.youtube.com"]',
			'iframe[src^="http://www.kickstarter.com"]',
			'object',
			'embed'
		];

	function getSelectors(customSelector) {
		var selectors = [].concat(SELECTORS);
		
		if (customSelector) {
			selectors.push(customSelector);
		}

		return selectors.join(',');
	}

	/**
	 * FitVids Node Plugin.
	 *
	 * @namespace Y.Plugin
	 * @class NodeFitVids
	 * @extends Plugin.Base
	 */
	Y.namespace('Plugin').NodeFitVids = Y.Base.create('NodeFitVids', Y.Plugin.Base, [], {
		initializer: function (config) {
			var host = this.get('host'),
				query = getSelectors(this.get('customSelector'));

			if (!Y.instanceOf(host, Y.Node)) {
				return;
			}

			host.all(query).each(function () {
				var tagName = this.get('tagName'),
					parentNode = this.get('parentNode'),
					heightAttr = this.get('height'),
					widthAttr = this.get('width'),
					data = {},
					height,
					width,
					aspectRatio;

				if ((tagName === 'EMBED' && parentNode.get('tagName') === 'OBJECT') || parentNode.hasClass(CLASS_NAME)) {
					return;
				}

				height = tagName === 'OBJECT' ? heightAttr : this.getComputedStyle('height');
				width = this.getComputedStyle('width');
				aspectRatio = parseInt(height, 10) / parseInt(width, 10);

				this.wrap('<div class="' + CLASS_NAME + '"></div>');
				this.ancestor(ANCESTOR_SELECTOR).setStyle('paddingTop', (aspectRatio * 100) + '%');

				if (heightAttr) {
					data.height = heightAttr;
					this.removeAttribute('height');
				}
				
				if (widthAttr) {
					data.width = widthAttr;
					this.removeAttribute('width');
				}

				// Save the original values of the height and width so we can restore them on unplug()
				this.setData(DATA_KEY, data);
			});
		},
		
		
		destructor: function () {
			var host = this.get('host'),
				query = getSelectors(this.get('customSelector'));
			
			if (!Y.instanceOf(host, Y.Node)) {
				return;
			}
			
			host.all(query).each(function () {
				var originalDimensions;
				
				if (this.ancestor(ANCESTOR_SELECTOR)) {
					this.unwrap();

					originalDimensions = this.getData(DATA_KEY) || {};
					
					if (originalDimensions.height) {
						this.set('height', originalDimensions.height);
					}

					if (originalDimensions.width) {
						this.set('width', originalDimensions.width);
					}
					
					this.clearData(DATA_KEY);
				}
			});
		}
	}, {
		NS: 'fitvids',
		
		ATTRS: {
			/**
			 * @attribute customSelector
			 * @description Video vendor selector if none of the default selectors match the the player you wish to target.
			 * @type String
			 * @writeOnce
			 */
			customSelector: null
		}
	});


}, 'gallery-2012.10.10-19-59' ,{skinnable:true, requires:['plugin', 'base-build', 'node-base', 'node-style', 'node-pluginhost', 'classnamemanager']});
