/**   (c) 2011 James Cryer, Huddle (www.huddle.com) 	*/
/**   http://jamescryer.github.com/grumble.js/ 		*/

(function ($, Bubble) {

	// $.fn.grumble.defaults references this object. $.fn.grumble.defaults should be used for extension
	var defaults = {
		text: '', // Accepts html
		angle: 45, // 0-360
		size: 50, // Default size
		sizeRange: [50,100,150,200], // Depending on the amount of text, one of these sizes (px) will be used
		distance: 0,
		type: '', // this string is appended to the bubble CSS classname
		useRelativePositioning : false, // will position relative to the document by default
		showAfter: 0,
		hideAfter: false,
		hideOnClick: false,
		hasHideButton: false,
		buttonTemplate: '<div class="grumble-button" style="display:none" title="{hideText}">x</div>',
		buttonHideText: 'Hide',
		onHide: function(){},
		onShow: function(){},
		onBeginHide: function(){}
	},
	liveBubbles = [],
	msieOld = navigator.appName === 'Microsoft Internet Explorer' && window.document.documentMode < 10;

    $.fn.grumble = function (settings, adjustments) {

		if( typeof settings === 'string' ){
			this.trigger({type:settings+'.bubble', adjustments: adjustments});
			return this;
		}

		return this.each(function () {
            var $me = $(this),
            	options = $.extend({}, $.fn.grumble.defaults, settings, $me.data('grumble') || {}),
				size = calculateTextHeight(options.size, options.sizeRange, options.text),
				grumble,
				button,
				_private,
				offset,
				context;

			if( options.useRelativePositioning ) {
				context = $me.offsetParent();
			}

			offset = getOffsets($me, context);

			options.top = offset.top;
			options.left = offset.left;

			if($.data(this, 'hazGrumble')){
				$me.grumble('adjust', settings);
				$me.grumble('show');
				return true;
			} else {
				$.data(this, 'hazGrumble', true);
			}

			_private = {

				init: function(){
					grumble = new Bubble({
						text: options.text,
						top: options.top,
						left: options.left,
						angle: options.angle,
						size: size,
						distance: options.distance,
						type: options.type,
						context: context // could be undefined
					});

					if(options.hasHideButton) this.addButton();

					liveBubbles.push({
						grumble: grumble,
						button: button,
						onHide: function(){
							_private.isVisible = false;
							$(document.body).unbind('click.bubble');
							_private.doOnBeginHideCallback();
							_private.doOnHideCallback();
						}
					});

					this.showBubble();
					this.prepareEvents();
					
				},

				addButton: function(){
					var tmpl = Bubble.prototype.tmpl;
				
					// I think this code smells.. Responsibility for the view should be in the same place.
					// Could possibly move this into bubble.js
					// or extract all view logic into a third component
					button = $( tmpl(options.buttonTemplate,{hideText:options.buttonHideText}))
						.css({
							left:grumble.realLeft+size-10,
							top:grumble.realTop+size-10
						})
						.insertAfter(grumble.text);
				},

				rePositionButton: function(){
					if( !button ) return;

					button
						.css({
							left:grumble.realLeft+size-10,
							top:grumble.realTop+size-10
						});
				},

				createFxQueue : function(){
					grumble.bubble.queue('fx');
					grumble.text.queue('fx');
					grumble.bubble.delay(options.showAfter);
					grumble.text.delay(options.showAfter);
					if (button) button.delay(options.showAfter);
				},

				showBubble: function(){
					if(_private.isVisible == true) return;
					
					if(options.showAfter) _private.createFxQueue();
					
					if(msieOld){
						grumble.bubble.queue('fx',function(next){
							grumble.bubble.show();
							next();
						});
						grumble.text.queue('fx',function(next){
							grumble.text.show();
							next();
						});
						if(button){
							button.queue('fx',function(next){
								button.show();
								next();
							});
						}
					} else {
						grumble.bubble.fadeTo('fast',1);
						grumble.text.fadeTo('fast',1);
						if(button) button.fadeTo('fast',1);
					}

					grumble.bubble.queue('fx',function(next){
						_private.isVisible = true;
						if(options.hideOnClick || options.hasHideButton) _private.hideOnClick();
						_private.doOnShowCallback();
						next();
					});
					
					if(options.hideAfter) _private.hideBubble();
				},

				hideBubble: function(){
					//if(_private.isVisible == false) return;

					grumble.bubble.delay(options.hideAfter);
					grumble.text.delay(options.hideAfter);

					grumble.bubble.queue('fx',function(next){
						_private.doOnBeginHideCallback();
						next();
					});

					if(msieOld){
						grumble.bubble.queue('fx',function(next){
							grumble.bubble.hide();
							next();
						});
						grumble.bubble.queue('fx',function(next){
							grumble.text.hide();
							next();
						});
						if(button){
							button.queue('fx',function(next){
								button.hide();
								next();
							});
						}
					} else {
						grumble.bubble.fadeOut();
						grumble.text.fadeOut();
						if (button) button.fadeOut();
					}

					grumble.bubble.queue('fx',function(next){
						_private.isVisible = false;
						_private.doOnHideCallback();
						next();
					});
				},

				doOnBeginHideCallback: function(){
					options.onBeginHide(grumble, button);
				},

				doOnHideCallback: function(){
					options.onHide(grumble, button);
				},

				doOnShowCallback: function(){
					options.onShow(grumble, button);
				},

				hideOnClick: function(){
					setTimeout(function(){
						var click = function(){
							_private.hideBubble(grumble, button);
							$(document.body).unbind('click.bubble', click);
						};
						$(document.body).bind('click.bubble',click);
					}, 1000);
				},

				prepareEvents: function(){
					$(window).bind('resize.bubble', function(){
						var offset;

						offset = getOffsets($me, context);

						grumble.adjust({
							top: offset.top,
							left: offset.left
						});

						_private.rePositionButton();
					});

					$me.bind('hide.bubble',  function(event){
						_private.hideBubble(grumble, button);
					});
					
					$me.bind('adjust.bubble',  function(event){
						if(event.adjustments && typeof event.adjustments === 'object'){
							grumble.adjust(event.adjustments);
						}
					});
					
					$me.bind('show.bubble',  function(event){
						_private.showBubble(grumble, button);
					});
					
					$me.bind('delete.bubble',  function(event){
						grumble.bubble.hide().remove();
						grumble.text.hide().remove();
						if (button) button.hide().remove();
						
						// remove from liveBubbles array :
						var len = liveBubbles.length;
						for (var i = 0; i < len; i++){
							if (grumble === liveBubbles[i].grumble){
								liveBubbles.splice(i, 1);
						    	break;
						    	}
						}
						$me.removeData("hazGrumble");
					});
				}
			};
			_private.init();
        });
	};

	$.fn.grumble.defaults = defaults;

	$(document).bind('keyup.bubble',function(event){ // Pressing the escape key will stop all bubbles
		if(event.keyCode === 27){
			$.each(liveBubbles, function(index,object){
				object.grumble.bubble.clearQueue().hide();
				object.grumble.text.clearQueue().hide();
				if(object.button) object.button.clearQueue().hide();
				object.onHide();
			});
		}
	});

	function getOffsets($me, context){
		var offset,
			marginTop;

		if( context ) {
			marginTop = Number($me.css('margin-top').replace("px", "")) || 0;
			offset = $me.position();
			offset.top += marginTop + context.scrollTop() + $me.height();
			offset.left += $me.width()/2;
		} else {
			offset = $me.offset();
			offset.top += $me.height();
			offset.left += $me.width()/2;
		}

		return offset;
	}

	function calculateTextHeight(defaultSize, range, text){
		var el = $('<div style="position:absolute;visibility:hidden;width:'+defaultSize+'px;">'+text+'</div>')
					.appendTo($(document.body)),
			height = el.outerHeight()*2+(defaultSize*0.20),/*the 20% is approx padding: could be more clever*/
			index = $.inArray(defaultSize, range);

		el.remove();

		if(height >= defaultSize && range[++index]){
			return calculateTextHeight(range[index], range, text); //WARNING: RECURSION!
		}

		return defaultSize;
	}

}(jQuery, GrumbleBubble));