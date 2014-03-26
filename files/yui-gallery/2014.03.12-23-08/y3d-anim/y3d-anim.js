YUI.add('y3d-anim', function (Y, NAME) {

var lastTime = 0,
	vendors = ['webkit', 'moz'],
	x;

for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];

	window.cancelAnimationFrame =
		window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function(callback) {
		var currTime = new Date().getTime(),
			timeToCall = Math.max(0, 16 - (currTime - lastTime)),
			id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);

		lastTime = currTime + timeToCall;

		return id;
	};
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}

function WebGLAnim(scene, animationFn, debugFn) {
	this.scene = scene;
	this.animationFn = animationFn;
	this.debugFn = debugFn;
	this.requestId = 0;
}

WebGLAnim.prototype = {
	start: function() {
		this.animationFn();
		this.scene.render();
		
		if (this.debugFn) {
			this.last = this.now;
			this.now = (new Date()).getTime();

			var elapsed = this.now - this.last;

			this.debugFn(parseInt(1000 / elapsed, 10));
		}

		this.requestId = requestAnimationFrame(Y.bind(this.start, this));
	},

	stop: function() {
		cancelAnimationFrame(this.requestId);
	}
};

Y.WebGLAnim = WebGLAnim;

}, 'gallery-2013.08.22-21-03');
