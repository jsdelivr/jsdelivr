/*
Kool Swap v0.2.2
by Joscha Schmidt - http://www.itsjoe.de

For more information, visit:
http://itsjoe.de/kool-swap/

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact
	
*/
(function( $ ){
	var ksGlobal = {
		defaults: {
				swapBox : '',
				loadBox : '',
				swapTriggerBox : '.kool-swap',
				swapTrigger : 'a',
				loadErrorMessage : 'The requested page could not be loaded.',
				loadErrorBacklinkText : 'Go back to the last page',
				bouncingBoxes : '',
				topToBottom : false, 
				leftToRight : false,
				inEasing : 'easeInSine',
				outEasing : 'easeInBack',
				inDuration : 700,
				outDuration : 500,
				preloadImages : false,
				direction: '',
				positionType: 'fixed',
		},
		listenToPopState: function(settings, $swapTrigger, swapBoxId, swapBoxTagName) {
			$(window)
			.off('popstate')
			.on('popstate', function(e) { // Listen to popstate
				var $swapBoxIn;
				switch (settings.direction) {
				    case 'left-to-right':
						$swapBoxIn = 'ks-swap-box-in-l-pushstate';
						break;
				    case 'right-to-left':
						$swapBoxIn = 'ks-swap-box-in-r-pushstate';
						break;
				    case 'top-to-bottom':
						$swapBoxIn = 'ks-swap-box-in-t-pushstate';
						break;
				    case 'bottom-to-top':
						$swapBoxIn = 'ks-swap-box-in-b-pushstate';
						break;
				    case '':
						$swapBoxIn = 'ks-swap-box-in-pushstate';
						break;
			        default:
						alert('Kool Swap Error: \n The defined direction ' + settings.direction + ' does not exist.');
			        	return false;
			        	break;
				}
				ksPageSwap.swapHistoryPage(settings, $swapTrigger, swapBoxId, $swapBoxIn, swapBoxTagName);
				e.stopPropagation();
			});
		}
	};
	
	var ksPageSwap = {
		defaults: function($this, options) {
			psSettings = $this.data('kool-swap-window');
			
			if(typeof(psSettings) == 'undefined') {
				psSettings = $.extend({}, ksGlobal.defaults, options);
				$this.data('kool-swap-window', psSettings);
			} else {
				psSettings = $.extend(psSettings, options);
			}

			return psSettings;
		},
		init: function(options) {
			var hasPushstate = (window.history && history.pushState);
			
			return this.each(function() {
				ksPageSwap.defaults($(this), options);
				
				var $swapBox = $(psSettings.swapBox), // Use the swapBox option if it is called without selector
					swapBoxId = $swapBox.attr('id'),
					swapBoxTagName = $swapBox.prop("tagName"),
					swapTriggerBox = psSettings.swapTriggerBox,
					swapTrigger = psSettings.swapTrigger,
					pageSwap = true;

				if (hasPushstate && $('html').not('[data-ks-initialised]') ) {
					$('html').attr('data-ks-initialised', 'true');
					ksGlobal.listenToPopState(psSettings, $(swapTriggerBox + ' ' + swapTrigger), swapBoxId, swapBoxTagName);
				}
				
				ksMethods.trigger(psSettings, hasPushstate, swapBoxId, swapBoxTagName, swapTriggerBox, swapTrigger, pageSwap);
			});
		}, 
		swapHistoryPage: function(psSettings, $swapTrigger, swapBoxId, swapBoxIn, swapBoxTagName) {
			if($('html').is('[data-ks-history-pushed]')) { 
				var href = location.pathname;
				//var currentpage = locationPath.replace(/^.*[\\\/]/, '');
				ksMethods.ksLoadPage(psSettings, $swapTrigger, href, swapBoxId, swapBoxIn, swapBoxTagName);
			}
		},
		destroy : function($this) {
			$(document).off('click', psSettings.swapTriggerBox + ' ' + psSettings.swapTrigger);
			return $(this).each(function() {
				var $this = $(this);
				$this.removeData('kool-swap-window');
			});
		},
	};
	
	var ksSelectorSwap = {
		defaults: function($this, options) {
			settings = $this.data('kool-swap');
			
			if(typeof(settings) == 'undefined') {
				settings = $.extend({}, ksGlobal.defaults, options);
				$this.data('kool-swap', settings);
			} else {
				settings = $.extend(settings, options);
			}
			return settings;
		},
		init: function(options) {
			return this.each(function() {
				ksSelectorSwap.defaults($(this), options);
				
				var $swapBox = $(this), // Otherwise use the given selector
					swapBoxId = $swapBox.attr('id'),
					swapBoxTagName = $swapBox.prop("tagName"),
					swapTriggerBox = settings.swapTriggerBox,
					swapTrigger = settings.swapTrigger,
					pageSwap = false;
				
				ksMethods.trigger(settings, true, swapBoxId, swapBoxTagName, swapTriggerBox, swapTrigger, pageSwap);
			});
		},		
		destroy : function($this) {
			$(document).off('click', settings.swapTriggerBox + ' ' + settings.swapTrigger);
			return $(this).each(function() {
				var $this = $(this);
				$this.removeData('kool-swap');
			});
		},

	};
	
	var ksMethods = {
		trigger: function(settings, hasPushstate, swapBoxId, swapBoxTagName, swapTriggerBox, swapTrigger, pageSwap) {
			if (hasPushstate) {
				function is_touch_device() { // check if the plugin's running on a touch device
					var el = document.createElement('div');
					el.setAttribute('ongesturestart', 'return;');
					return typeof el.ongesturestart === "function";
				};
				
				
				if (is_touch_device()) {
					$(document)
					// for the 404 back link
					.on('touchstart', '.ajaxPageSwitchBacklink', function() {
						window.history.back();
					})
					.off('touchstart', swapTriggerBox + ' ' + swapTrigger)
					.on('touchstart', swapTriggerBox + ' ' + swapTrigger, function(e) {
						e.preventDefault();
						var $swapTrigger = $(this);
						
						ksMethods.ksDefineSwapBoxIn(settings, $swapTrigger, hasPushstate, swapBoxId, swapBoxTagName, pageSwap);
					});
				} else {
					$(document)
					// for the 404 back link
					.on('click', '.ajaxPageSwitchBacklink', function() {
						window.history.back();
					})
					.off('click', swapTriggerBox + ' ' + swapTrigger)
					.on('click', swapTriggerBox + ' ' + swapTrigger, function(e) {
						e.preventDefault();
						var $swapTrigger = $(this);

						ksMethods.ksDefineSwapBoxIn(settings, $swapTrigger, hasPushstate, swapBoxId, swapBoxTagName, pageSwap);
					});
				}
			}
		},
		ksDefineSwapBoxIn: function(settings, $swapTrigger, hasPushstate, swapBoxId, swapBoxTagName, pageSwap) {
			switch (settings.direction) {
			    case 'left-to-right':
			    case 'right-to-left':
			    case 'top-to-bottom':
			    case 'bottom-to-top':
			    case '':
					$swapBoxIn = 'ks-swap-box-in';
					if (!$('.ks-swap-box-in').length) {
						var item = $(this);
						ksMethods.ksCollectLoadPageInfo(settings, $swapTrigger, hasPushstate, swapBoxId, $swapBoxIn, swapBoxTagName, pageSwap);
					} else {
						return false;
					}
					break;
		        default:
					alert('Kool Swap Error: \n The defined direction ' + settings.direction + ' does not exist.');
		        	return false;
		        	break;
			}
		},
		ksCollectLoadPageInfo: function(settings, $swapTrigger, hasPushstate, swapBoxId, $swapBoxIn, swapBoxTagName, pageSwap) {
			var url = $swapTrigger.attr('href');

			var $swapBoxIn;
			switch (settings.direction) {
			    case 'left-to-right':
					$swapBoxIn = 'ks-swap-box-in-l';
					break;
			    case 'right-to-left':
					$swapBoxIn = 'ks-swap-box-in-r';
					break;
			    case 'top-to-bottom':
					$swapBoxIn = 'ks-swap-box-in-t';
					break;
			    case 'bottom-to-top':
					$swapBoxIn = 'ks-swap-box-in-b';
					break;
			    case '':
					$swapBoxIn = 'ks-swap-box-in';
					break;
		        default:
					alert('Kool Swap Error: \n The defined direction ' + settings.direction + ' does not exist.');
		        	return false;
		        	break;
			}
			
			// This generates a canvas from the current page to freeze the contents as they are. It may be used later.
			// Include http://html2canvas.hertzen.com/build/html2canvas.js to test it.
			//	html2canvas($('#' + swapBoxId), {
			//		onrendered: function(canvas) {
			//			$('#' + swapBoxId).find('*').remove().end().append(canvas);
			//		}
			//	});
			
			ksMethods.ksLoadPage(settings, $swapTrigger, url, swapBoxId, $swapBoxIn, swapBoxTagName, pageSwap);
			
			if (pageSwap) {
				history.pushState({'url':url}, null, url); // Update the url
				$('html').attr('data-ks-history-pushed', 'true');
			}
		},
		ksLoadPage: function(settings, $swapTrigger, href, swapBoxId, swapBoxIn, swapBoxTagName, pageSwap) {
			var $swapBox = $('#' + swapBoxId); // redefine $swapBox variable
			if (href != '') {
				ksMethods.ksAddSwapBoxIn(settings, swapBoxTagName, swapBoxId, swapBoxIn);
				$.ajax({
					type: 'GET',
					url: href,
					data: {},
					beforeSend: function() {
						ksMethods.ksCreateLoadBox();
					},
					error : function(data, xhrStatusText, xhrStatus) {
						$swapBox.html(settings.loadErrorMessage + '<p>' + xhrStatusText + ': <strong>' + xhrStatus + '</strong></p><p><a class="ajaxPageSwitchBacklink">' + settings.loadErrorBacklinkText + '</a></p>');
					},
					success: function(data) {
						$(settings.swapTriggerBox).find(settings.swapTrigger).filter('.active').removeClass('active');
						$swapTrigger.addClass('active');

						if (settings.bouncingBoxes) {
							ksMethods.ksFadeSiblings(settings, $swapTrigger, data, swapBoxId, swapBoxIn, pageSwap);

						} else {
							ksMethods.ksPositionAndPrepare(settings, $swapTrigger, data, swapBoxId, swapBoxIn, pageSwap);
						}
					},
					dataType: 'html',
				});
			} else {
				alert('There is no target defined! Please check the references (i.e. normally href) of the swapTriggers.');
			}
		},
		ksAddSwapBoxIn: function(settings, swapBoxTagName, swapBoxId, swapBoxIn) {
			var $swapBox = $('#' + swapBoxId), // redefine $swapBox variable
				swapBoxClass = $swapBox.attr('class');

			$(document).find('.ks-swap-box-in').remove();

			if (settings.moveSwapBoxClasses) {
				$swapBox.after('<' + swapBoxTagName.toLowerCase() + ' class="ks-swap-box-in ' + (typeof swapBoxClass != 'undefined' ? swapBoxClass : '') + '" id="' + swapBoxIn + '"></' + swapBoxTagName.toLowerCase() + '>'); // create the temp container
			} else {
				$swapBox.after('<' + swapBoxTagName.toLowerCase() + ' class="ks-swap-box-in" id="' + swapBoxIn + '"></' + swapBoxTagName.toLowerCase() + '>'); // create the temp container
			}
			
			$swapBox.siblings('.ks-swap-box-in')
			.hide();

		},
		ksFadeSiblings: function(settings, $swapTrigger, data, swapBoxId, swapBoxIn, pageSwap) {
			var $swapBox = $('#' + swapBoxId); // redefine $swapBox variable
			
			$(document)
			.find(settings.bouncingBoxes)
			.animate({opacity: 0}, 50, function() {
				ksMethods.ksPositionAndPrepare(settings, $swapTrigger, data, swapBoxId, swapBoxIn);
			});
		},
		ksPositionAndPrepare: function(settings, $swapTrigger, data, swapBoxId, swapBoxIn, pageSwap) {
			var $swapBox = $('#' + swapBoxId), // redefine $swapBox variable
				mainOffset = $swapBox.position(),
				mainWidth = $swapBox.width(),
				mainMarginLeft = $swapBox.css('margin-left'),
				mainMarginRight = $swapBox.css('margin-left'),
				swapBoxLeftAbsolute = mainOffset.left + parseFloat(mainMarginLeft);
				swapBoxRightAbsolute = mainOffset.left + parseFloat(mainMarginLeft) + mainWidth - parseFloat(mainMarginRight),
				$swapBoxIn = $('#' + swapBoxIn),
				loadSelector = $swapTrigger.attr('data-ks-load-selector');
		
			if (pageSwap) {
				var	htmlId = data.match(/<\/*html\s+.*id="([^"].*)".*>/), // exclude html classes
					bodyId = data.match(/<\/*body\s+.*id="([^"].*)".*>/), // exclude body classes
					htmlClass = data.match(/<\/*html\s+.*class="([^"].*)".*>/), // exclude html classes
					bodyClass = data.match(/<\/*body\s+.*class="([^"].*)".*>/), // exclude body classes
					pageTitle = data.match(/<\/*title>(.*)<\/title>/); // exclude page title
			}
			
			$swapBox
			.css({
				position: 'absolute',
				top: mainOffset.top,
				left: swapBoxLeftAbsolute,
				marginLeft: 0,
				width: mainWidth,
			});
			
			if (swapBoxInContents = $(data).filter('#' + swapBoxId).html() != undefined) { // Check if we have to use .filter or .find to get the data
				if (settings.loadBox) {
					var swapBoxInContainer = $(data).filter(settings.loadBox);
				} else if (loadSelector) {
					var swapBoxInContainer = $(data).filter(loadSelector);
				} else {
					var swapBoxInContainer = $(data).filter('#' + swapBoxId);
				}
				swapBoxInContents = swapBoxInContainer.html();
				var swapBoxInClasses = swapBoxInContainer.attr('class');
			} else {
				if (settings.loadBox) {
					var swapBoxInContainer = $(data).find(settings.loadBox);
				} else if (loadSelector) {
					var swapBoxInContainer = $(data).find(loadSelector);
				} else {
					var swapBoxInContainer = $(data).find('#' + swapBoxId);
				}
				swapBoxInContents = swapBoxInContainer.html();						
				var swapBoxInClasses = swapBoxInContainer.attr('class');
			}
			
			$swapBoxIn
			.addClass(swapBoxInClasses) // add the swapBoxIn classes
			.css({
				position: settings.positionType,
				marginLeft: 0,  // Set the margin to 0 because the swapBox was positioned in place
				top: mainOffset.top,
				left: swapBoxLeftAbsolute,
			})
			.html(swapBoxInContents); // Attach the contents to the target temp container
			
			var swapBoxInImages = $swapBoxIn.find('img'); // Check if there are images in the swapIn box 
			var count = 0;
			if (swapBoxInImages.length && settings.preloadImages == true) {
				swapBoxInImages.on('load', function() {
					count++;
			        if (count == swapBoxInImages.length){
						$(document).trigger('ksLoadCallback'); // Trigger the ksLoad callback event
			        	ksMethods.ksSwapContent(settings, swapBoxIn, swapBoxId, $swapTrigger, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle, pageSwap);
			        }
				});
			} else {
				$(document).trigger('ksLoadCallback'); // Trigger the ksLoad callback event
				ksMethods.ksSwapContent(settings, swapBoxIn, swapBoxId, $swapTrigger, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle, pageSwap);
			}
		},
		// Swap the content
		ksSwapContent: function(settings, swapBoxIn, swapBoxId, $swapTrigger, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle, pageSwap) {
			var $swapBox = $('#' + swapBoxId), // redefine $swapBox variable
				$swapBoxIn = $('#' + swapBoxIn),
				swapBoxInHeight = $swapBoxIn.outerHeight(),
				swapBoxInWidth = $swapBoxIn.outerWidth(),
				swapBoxHeight = $swapBox.outerHeight(),
				viewportHeight = $(window).outerHeight(),
				viewportWidth = $(window).outerWidth(),
				hash = $swapTrigger.prop('hash');

			clearTimeout(loadTimer);
			ksMethods.ksRemoveLoadBox();
			
			if (settings.direction) {
				$swapBoxIn.css({width: mainWidth});
				
				var swapBoxOutAnimProperties = {}, swapBoxInAnimProperties = {};
				// Define animation value
				var swapBoxOutAnimValue;
				switch (swapBoxIn) {
					case 'ks-swap-box-in-b-pushstate':
				    case 'ks-swap-box-in-t':
						$swapBoxIn.css('top', -swapBoxInHeight * 2);
				    	swapBoxOutAnimValue = viewportHeight * 3;
				    	break;
				    case 'ks-swap-box-in-t-pushstate':
				    case 'ks-swap-box-in-b':
						$swapBoxIn.css('top', swapBoxHeight * 1.5);
				    	swapBoxOutAnimValue = -swapBoxHeight * 1.5;
				    	break;
				    case 'ks-swap-box-in-r-pushstate':
				    case 'ks-swap-box-in-l':
						$swapBoxIn.css('left', -viewportWidth);
				    	swapBoxOutAnimValue = viewportWidth;
				    	break;
				    case 'ks-swap-box-in-l-pushstate':
				    case 'ks-swap-box-in-r':
						$swapBoxIn.css('left', viewportWidth);
				    	swapBoxOutAnimValue = -viewportWidth;
				    	break;
			        default:
						alert('Kool Swap Error: \n The swapBoxIn class is in an undefined format: ' + swapBoxIn + '.');
			        	return false;
			        	break;
				}
				
				switch (settings.direction) {
				    case 'left-to-right':
				    case 'right-to-left':
						var finalInDuration = settings.inDuration, 
							finalOutDuration = settings.outDuration;
						
						swapBoxOutAnimProperties = {left: swapBoxOutAnimValue};
						swapBoxInAnimProperties = {left: swapBoxLeftAbsolute};
						
						$swapBoxIn.css('top', mainOffset.top);
						$('body') // Prevent horizontal scrollbars on animation
						.css({
							overflowX: 'hidden',
							overflowY: 'scroll',
						});
			        	break;
				    case 'top-to-bottom':
				    case 'bottom-to-top':
						/* Every page wants to reach the end position in the defined space of time (duration).
						 * This causes that high pages (based on the height in pixels after all content were loaded)
						 * seem to animate faster than low pages. 
						 * I thought about a work around and came to the formula DURATION + (HEIGHT OF THE SWAP (IN) BOX / DURATION * 100)
						 * This calculates a final in-duration value that seems to work fine.
						 */ 
				    	
				    	var additionValue = (swapBoxHeight * settings.inDuration / 1000);
				    	var finalVal = additionValue / 100;
						var finalInDuration = settings.inDuration + finalVal;
						var	finalOutDuration = settings.outDuration;
						
						swapBoxInAnimProperties = {top: mainOffset.top};
						swapBoxOutAnimProperties = {top: swapBoxOutAnimValue};
						
						$('body').css('overflow-y', 'scroll'); // Prevent vertical scrollbars on animation
			        	break;
				}
				
				$swapBox
				.stop()
				.show()
				.animate(
					swapBoxOutAnimProperties, finalOutDuration, settings.outEasing, function() {
						$(this).remove();
						$(document).trigger('ksSwapCallback'); // Trigger the swap callback event
						
						if (pageSwap) {
							$(document).scrollTop(0); // Scroll the page to top to avoid flickering
							ksMethods.ksSwitchClasses(htmlId, bodyId, htmlClass, bodyClass, pageTitle);
						}
					});
				
				$swapBoxIn
				.stop()
				.show()
				.animate(
					swapBoxInAnimProperties, finalInDuration, settings.inEasing, function() {
						$(this)
						.css({display: '', left: '', marginLeft: '', position: '', top: '', width: '',}) // Reset all setted styles
						.attr('id', swapBoxId) // Give the swapBox id back to the final animated swapBoxIn
						.removeClass('ks-swap-box-in');
						
						ksMethods.animationCallback(hash);
						ksMethods.ksCheckForSiblings(settings);
					});
			} else {
				$swapBox
				.animate({opacity: 0}, settings.outDuration, function() {
					$(this).remove(); // remove the $swapBox container
					if (pageSwap) {
						ksMethods.ksSwitchClasses(htmlId, bodyId, htmlClass, bodyClass, pageTitle);
					}
					$swapBoxIn
					.css({display: '', left: '', marginLeft: '', opacity: 0, position: '', top: '', width: '',}) // Reset all setted styles
					.animate({opacity: 1}, settings.inDuration, function() {
						ksMethods.animationCallback(hash);
						ksMethods.ksCheckForSiblings(settings);
					})
					.attr('id', swapBoxId).removeClass('ks-swap-box-in');
				});
			}
		},
		animationCallback: function(hash) {
			if (hash) {
				$('html:not(:animated),body:not(:animated)').animate({scrollTop: $(hash).position().top },'normal');
			}
		},
		ksCheckForSiblings: function(settings) {
			if (settings.bouncingBoxes) {
				$(document)
				.find(settings.bouncingBoxes)
					.animate({opacity: 1}, 400, function() {
						ksMethods.ksSwapCallback();
					});
			} else {
				ksMethods.ksSwapCallback();
			}
		},
		ksSwitchClasses : function(htmlId, bodyId, htmlClass, bodyClass, pageTitle) {
			$('html, body').attr({ // remove ids and classes from html and body
				'class': '',
				'id' : '',
			}); 
			(htmlId ? $('html').attr('id', htmlId[1]) : ''); // Add IDs from the target page 
			(bodyId ? $('body').attr('id', bodyId[1]) : ''); // Add IDs from the target page 
			(htmlClass ? $('html').addClass(htmlClass[1]) : ''); // Add classes from the target page 
			(bodyClass ? $('body').addClass(bodyClass[1]) : ''); // Add classes from the target page 
			(pageTitle ? $('title').text(pageTitle[1]) : '');
		},
		ksCreateLoadBox: function() {
			if (!$('#ks-loading-box').length) {
				loadTimer = setTimeout(function() { // Show the loading box if the loadings of contents takes longer than 200ms
					$('html').append('<div id="ks-loading-box"><div class="ks-loading"></div></div>');
					$('#ks-loading-box').fadeIn('fast');
				}, 200);
			} else {
				ksMethods.ksRemoveLoadBox();
				ksMethods.ksCreateLoadBox();
			}
		},
		ksRemoveLoadBox: function() {
			$('#ks-loading-box').fadeOut('fast').remove();
		},
		ksSwapCallback: function() {
			$('body').css({
//				overflowY: 'auto',
				overflowX: 'auto',				
			}); // Prevent scrollbars on animation
			$(document).trigger('ksSwapCallback'); // Trigger the swap callback event
		},
	};
	
	$.koolSwap = function(method) {
		if (ksPageSwap[method]) {
			return ksPageSwap[method].apply($(window), Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return ksPageSwap.init.apply($(window), arguments, false);
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.KoolSwap' );
		}    
	};
	
	$.fn.koolSwap = function(method) {
		if (ksSelectorSwap[method]) {
			return ksSelectorSwap[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return ksSelectorSwap.init.apply(this, arguments);
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.KoolSwap' );
		}    
	};
})( jQuery );