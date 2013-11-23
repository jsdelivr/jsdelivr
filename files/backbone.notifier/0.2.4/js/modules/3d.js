/*!
 * Backbone.Notifier 3D Module v0.0.2
 * Copyright 2012, Eyal Weiss
 * Backbone.Notifier 3D Module be freely distributed under the MIT license.
 */
(function(Notifier, $){

	Notifier.regModule({
		name: '3d',
		enabled: false,
		extend: {
			defaults: {
				'3d': true
			}
		},
		events: {
			'beforeAnimateInMsgEl': function(settings, msgEl, msgInner, msgView){
				if (settings['3d']){
					var module = this.module,
						fn = msgView.handle3d = function(){ module.mouseMoveHandler.apply(module, arguments) };
					$('body').bind('mousemove', {msgInner: msgInner}, fn);
				}
			},
			'beforeHideMsgEl': function(settings, msgEl, msgInner, msgView){
				if (settings['3d']){
					$('body').unbind('mousemove', msgView.handle3d);
				}
			}
		},
		mouseMoveHandler: function(e){
			var winH = $(window).innerHeight(),
				winW = $(window).innerWidth(),
				pX = (.5-(e.clientX / winW))*2,
				degX = -(pX * 10).toFixed(2),
				pY = (.5-(e.clientY / winH))*2,
				degY = (pY * 20).toFixed(2),
				sX = (pX*10),
				sY = (pY*10),
				sD = Math.abs(sX) + Math.abs(sY),
				sA = .8-((Math.abs(pX) + Math.abs(pY)) / 2)*.4,
				shadow = sX.toFixed(2) + 'px ' + sY.toFixed(2) + 'px' + ' ' + sD.toFixed(2) +'px rgba(0,0,0,' + sA.toFixed(2) + ')',
				css = {};
		 	css[this.transformAttr] = 'perspective(800px) rotateX(' + degY + 'deg) rotateY(' + degX + 'deg)';
			css[this.shadowAttr] = shadow;
			e.data.msgInner.css(css);
		},
		register: function(){
			this.transformAttr = ($.browser.webkit ? '-webkit-' : ($.browser.mozilla ? '-moz-' : ($.browser.msie ? '-ms-' : ''))) + 'transform';
			this.shadowAttr = ($.browser.webkit ? '-webkit-' : '') + 'box-shadow';
			//console.log(this.name + ' module was registered');
		},
		enable: function(){
			//console.log(this.name + ' module was activated');
		},
		disable: function(){
			//console.log(this.name + ' module was stopped');
		}
	});

})(Backbone.Notifier, jQuery);