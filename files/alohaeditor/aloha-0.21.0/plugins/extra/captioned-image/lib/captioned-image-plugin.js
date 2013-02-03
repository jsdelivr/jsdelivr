/**
 * Captioned Images provides an Aloha block implementation that allows the
 * editor to work with images that have captions, such that an image with is
 * corresponding caption can be position, and aligned together in an editable.
 *
 * TODO
 * ----
 * - Implement makeClean
 * - Prevent floating menu from showing on caption
 * - Prevent disallowed content in caption
 */
define([
	'jquery',
	'aloha/core',
	'aloha/plugin',
	'block/block',
	'block/blockmanager',
	'ui/ui',
	'ui/button',
	'ui/toolbar',
	'aloha/console'
], function (
	$,
	Aloha,
	Plugin,
	Block,
	BlockManager,
	Ui,
	Button,
	Toolbar,
	Console
) {
	

	var css = '\
		.aloha-captioned-image {display: inline-block;}\
		.aloha-captioned-image>div {\
			text-align: center;\
			padding: 0 1em 1em;\
		}\
		.aloha-captioned-image .float-right {padding-right: 0;}\
		.aloha-captioned-image .float-left {padding-left: 0;}\
		.aloha-captioned-image .caption {\
			padding: 0.5em;\
			font-size: 0.9em;\
			background: rgba(0,0,0,0.8);\
			font-family: Arial;\
			color: #fff;\
			text-align: left;\
			min-width: 100px;\
		}\
		.aloha-captioned-image-hidden .caption {display: none;}\
		.aloha-captioned-image-hidden.aloha-block-active .caption {display: block;}\
	';

	$('<style type="text/css">').text(css).appendTo('head:first');

	var components = [];

	components.push(Ui.adopt('imgFloatLeft', Button, {
		tooltip: 'Float image to left',
		text: 'Float left',
		click: function () {
			if (BlockManager._activeBlock) {
				BlockManager._activeBlock.attr('position', 'left');
			}
		}
	}));

	components.push(Ui.adopt('imgFloatRight', Button, {
		tooltip: 'Float image to right',
		text: 'Float right',
		click: function () {
			if (BlockManager._activeBlock) {
				BlockManager._activeBlock.attr('position', 'right');
			}
		}
	}));

	components.push(Ui.adopt('imgFloatClear', Button, {
		tooltip: 'Float image to clear',
		text: 'No floating',
		click: function () {
			if (BlockManager._activeBlock) {
				BlockManager._activeBlock.attr('position', 'none');
			}
		}
	}));

	function showComponents() {
		// A very fragile yield hack to help make it more likely that our
		// components' tag will be forgrouned() after other components so that
		// ours are visible.  A fix is needed at the architectural level of
		// Aloha for this.
		setTimeout(function () {
			var j = components.length;
			while (j) {
				components[--j].foreground();
			}
		}, 100);
	}

	function cleanEditable($editable) {
		var $blocks = $editable.find('.aloha-captioned-image');
		var j = $blocks.length;
		var block;
		var $img;

		while (j) {
			block = BlockManager.getBlock($blocks[--j]);

			if (!block) {
				continue;
			}

			if (block.attr('aloha-captioned-image-tag') === 'img') {
				$img = block.$_image;

				$img.attr('src', block.attr('source'));

				var alt = block.attr('alt');
				var width = block.attr('width');
				var height = block.attr('height');
				var caption = block.attr('caption');
				var floating = block.attr('position');

				if (alt) {
					$img.attr('alt', alt);
				} else {
					$img.removeAttr('alt');
				}

				if (typeof width !== 'undefined') {
					$img.attr('width', width);
				} else {
					$img.removeAttr('width');
				}

				if (typeof height !== 'undefined') {
					$img.attr('height', height);
				} else {
					$img.removeAttr('height');
				}

				if (caption) {
					$img.attr('caption', caption);
				} else {
					$img.removeAttr('caption');
				}

				$img.attr('float',
					(!floating || 'none' === floating) ? '' : floating);

				$img.addClass('aloha-captioned-image');
				block.$element.replaceWith($img);
			} else {
				block.$element.html('')
				     .removeClass('aloha-captioned-image-hidden')
				     .removeClass('aloha-block');
			}
		}
	}

	var render = Aloha.settings &&
	             Aloha.settings.plugins &&
	             Aloha.settings.plugins.captionedImage &&
	             Aloha.settings.plugins.captionedImage.render;

	if (!render) {
		render = function (properties, callback, error) {
			var src = properties.source || 'img/noimg.gif';
			var alt = properties.alt || '';
			var caption = properties.caption || '';
			var $content = $('<div>' +
				'<img src="' + src + '" alt="' + alt + '"/>' +
				'<div class="caption">' +  caption + '</div>' +
				'</div>');

			if ('left' === properties.position || 'right' === properties.position) {
				$content.css('float', properties.position)
				        .addClass('float-' + properties.position);
			}

			$content.find('>img:first').css({
				width: properties.width || '',
				height: properties.height || ''
			});

			callback({
				content: $content[0].outerHTML,
				image: '>div>img:first',
				caption: '>div>div.caption:first'
			});
		};
	}

	function wrapNakedCaptionedImages($editable) {
		var $imgs = $editable.find('img.aloha-captioned-image');
		var j = $imgs.length;

		while (j) {
			var $img = $imgs.eq(--j);

			var $block = $img.removeClass('aloha-captioned-image')
							 .wrap('<div class="aloha-captioned-image">')
							 .parent();

			$block.attr('data-alt', $img.attr('alt'))
			      .attr('data-source', $img.attr('src'))
			      .attr('data-width', $img.attr('width'))
			      .attr('data-height', $img.attr('height'))
			      .attr('data-caption', $img.attr('data-caption'))
			      .attr('data-aloha-captioned-image-tag', 'img');

			$img.attr('width', '')
			    .attr('height', '')
			    .attr('data-caption', '');
		}
	}

	function findCaptionedImages($editable) {
		return $editable.find('.aloha-captioned-image');
	}

	function initializeImageBlocks($editable) {
		wrapNakedCaptionedImages($editable);
		var $all = findCaptionedImages($editable);
		var $blocks = $();
		var j = $all.length;
		while (j) {
			if (!$all.eq(--j).hasClass('aloha-block')) {
				$blocks = $blocks.add($all[j]);
			}
		}
		$blocks.alohaBlock({
			'aloha-block-type': 'CaptionedImageBlock'
		});
	}

	var CaptionedImageBlock = Block.AbstractBlock.extend({
		title: 'Captioned Image',
		onblur: null,
		onload: null,
		$_image: null,
		$_caption: null,
		init: function ($element, postProcessCallback) {
			if (this._initialized) {
				return;
			}

			var that = this;

			this.onload = function () {
				that.$_caption.css('width', that.$_image.width());
			};
			this.onblur = function () {
				var html = that.$_caption.html();
				if (that.attr('caption') !== html) {
					that.attr('caption', html);
				}
				Toolbar.$surfaceContainer.show();
			};

			this.$element.css('float', this.attr('position'));

			render({
				alt: this.attr('alt'),
				width: this.attr('width'),
				height: this.attr('height'),
				source: this.attr('source'),
				caption: this.attr('caption'),
				position: this.attr('position')
			}, function (data) {
				that._processRenderedData(data);
				that.$_image.bind('load', that.onload);
				postProcessCallback();
				Aloha.bind('aloha-editable-activated', function ($event, data) {
					if (data.editable.obj.is(that.$_caption)) {
						Toolbar.$surfaceContainer.hide();
					}
				});
			}, function (error) {
				if (Console) {
					Console.error(error);
				}
				postProcessCallback();
			});
		},
		update: function ($element, postProcessCallback) {
			this.$_image.unbind('load', this.onload);
			this.$_caption.unbind('blur', this.onblur);
			this.$element.css('float', this.attr('position'));

			var that = this;

			render({
				alt: this.attr('alt'),
				width: this.attr('width'),
				height: this.attr('height'),
				source: this.attr('source'),
				caption: this.attr('caption'),
				position: this.attr('position')
			}, function (data) {
				that._processRenderedData(data);
				postProcessCallback();
			}, function (error) {
				if (Console) {
					Console.error(error);
				}
				postProcessCallback();
			});
		},
		_processRenderedData: function (data) {
			this.$element.html(data.content);
			this.$_image = this.$element.find(data.image);
			this.$_caption = this.$element.find(data.caption);
			this.$_caption.addClass('aloha-editable')
			    .css('width', this.$_image.width())
			    .bind('blur', this.onblur);

			if (this.attr('caption')) {
				this.$element.removeClass('aloha-captioned-image-hidden');
			} else {
				this.$element.addClass('aloha-captioned-image-hidden');
			}
		}
	});

	var CaptionedImage = Plugin.create('captioned-image', {
		init: function () {
			BlockManager.registerBlockType('CaptionedImageBlock', CaptionedImageBlock);
			var j = Aloha.editables.length;
			while (j) {
				initializeImageBlocks(Aloha.editables[--j].obj);
			}
			Aloha.bind('aloha-editable-created', function ($event, editable) {
				initializeImageBlocks(editable.obj);
				editable.obj.delegate('div.aloha-captioned-image', 'click',
					showComponents);
			});
			Aloha.bind('aloha-editable-destroyed', function ($event, editable) {
				cleanEditable(editable.obj);
				editable.obj.undelegate('div.aloha-captioned-image', 'click',
					showComponents);
			});
		},
		makeClean: function ($content) {
			return $content;
		}
	});

	return CaptionedImage;
});
