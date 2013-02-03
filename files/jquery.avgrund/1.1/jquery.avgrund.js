/**
 *  jQuery Avgrund Popin Plugin
 *  Inspired by concept in vanilla js - https://github.com/hakimel/Avgrund/
 * 
 *  MIT licensed, (c) 2012 http://pixelhunter.me/
 */

(function($) {
	$.fn.avgrund = function(options) {
		var defaults = {
			width: 380, // max = 640
			height: 280, // max = 350
			showClose: false,
			showCloseText: '',
			closeByEscape: true,
			closeByDocument: true,
			holderClass: '',
			overlayClass: '',
			enableStackAnimation: false,
			onBlurContainer: '',
			template: '<p>This is test popin content!</p>'
		};
		var options = $.extend(defaults, options);

		return this.each(function() {
			var body = $('body'),
				maxWidth = options.width > 640 ? 640 : options.width,
				maxHeight = options.height > 350 ? 350 : options.height;

			body.addClass('avgrund-ready');
			body.append('<div class="avgrund-overlay ' + options.overlayClass + '"></div>');				
			body.append('<div class="avgrund-popin ' + options.holderClass + '">' + options.template + '</div>');

			$('.avgrund-popin').css({
				'width': maxWidth + 'px',
				'height': maxHeight + 'px',
				'margin-left': '-' + (maxWidth / 2 + 10) + 'px',
				'margin-top': '-' + (maxHeight / 2 + 10) + 'px'
			});

			if (options.showClose == true) {
				$('.avgrund-popin').append('<a href="#" class="avgrund-close">' + options.showCloseText + '</a>');
			}

			if (options.enableStackAnimation == true) {
				$('.avgrund-popin').addClass('stack');
			}

			if (options.onBlurContainer != '') {
				$(options.onBlurContainer).addClass('avgrund-blur');
			}

			// close popup by clicking Esc button
			if (options.closeByEscape == true) {
				function onDocumentKeyup(e) {
					if (e.keyCode === 27) {
						deactivate();
					}
				}
			}

			// close popup only by 'close' button or by click on document too
			function onDocumentClick(e) {
				if (options.closeByDocument == true) {
					if ($(e.target).is('.avgrund-overlay, .avgrund-close')) {
						deactivate();
					}
				} else {
					if ($(e.target).is('.avgrund-close')) {
						deactivate();
					}
				}
			}

			// show popup
			function activate() {
				body.bind('keyup', onDocumentKeyup);
				body.bind('click', onDocumentClick);

				body.addClass('avgrund-active');
			}

			// hide popup
			function deactivate() {
				body.unbind('keyup', onDocumentKeyup);
				body.unbind('click', onDocumentClick);

				body.removeClass('avgrund-active');
			}

			// init on click
			$(this).click(function(e) {
				e.stopPropagation();

				activate();
			});
		});

	}
})(jQuery)