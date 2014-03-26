YUI.add('y3d-picker-plugin', function (Y, NAME) {

function Picker() {
	Picker.superclass.constructor.apply(this, arguments);
}

Picker.NAME = "picker";
Picker.NS = "picker";

Picker.ATTRS = {
};

Y.extend(Picker, Y.Plugin.Base, {
	frameBuffer: null,

	initializer: function() {
		this.afterHostMethod("add", this._afterAdd);
		this.beforeHostMethod("render", this._beforeRender);
	},

	pick: function(x, y) {
		var instance = this,
			host = instance.get('host'),
			context = host.context,
			geometries = host.get('geometries'),
			readout = new Uint8Array(4),
			color;

		instance._bindFrameBuffer();
		context.readPixels(x, y, 1, 1, context.RGBA, context.UNSIGNED_BYTE, readout);
		instance._unbindFrameBuffer();

		color = readout[0].toString(16) + readout[1].toString(16) + readout[2].toString(16);

		return geometries[color];
	},

	_afterAdd: function(geometry) {
		var instance = this,
			host = instance.get('host'),
			context = host.context,
			id = geometry.get('id'),
			pickerColor = geometry._setColor(id);

		host._loadBufferData(geometry, context.ARRAY_BUFFER, new Float32Array(pickerColor), 'pickerColorBuffer');
	},

	_beforeRender: function() {
		var instance = this;

		instance._bindFrameBuffer();
		instance._render();
		instance._unbindFrameBuffer();
	},

	_bindFrameBuffer: function() {
		var instance = this,
			host = instance.get('host'),
			context = host.context,
			frameBuffer = instance.frameBuffer,
			height, renderBuffer, texture, width;

		if (!frameBuffer) {
			height = host.get('height');
			renderBuffer = context.createRenderbuffer();
			texture = context.createTexture();
			width = host.get('width');

			context.bindTexture(context.TEXTURE_2D, texture);
			context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, width, height, 0, context.RGBA, context.UNSIGNED_BYTE, null);

			context.bindRenderbuffer(context.RENDERBUFFER, renderBuffer);
			context.renderbufferStorage(context.RENDERBUFFER, context.DEPTH_COMPONENT16, width, height);
			context.bindRenderbuffer(context.RENDERBUFFER, null);

			frameBuffer = context.createFramebuffer();

			context.bindFramebuffer(context.FRAMEBUFFER, frameBuffer);
			context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0);
			context.framebufferRenderbuffer(context.FRAMEBUFFER, context.DEPTH_ATTACHMENT, context.RENDERBUFFER, renderBuffer);
			context.bindTexture(context.TEXTURE_2D, null);

			instance.frameBuffer = frameBuffer;
		}

		context.bindFramebuffer(context.FRAMEBUFFER, frameBuffer);
	},

	_render: function() {
		var instance = this,
			host = instance.get('host'),
			context = host.context,
			projectionMatrix = host._createProjectionMatrix(),
			geometries = host.get('geometries');

		host._clearColor();
		host._enableDepthTest();

		Y.each(geometries, function(geometry) {
			var program = host._getProgram(geometry);

			context.useProgram(program);

			host._setVertexAttribute(geometry.pickerColorBuffer, program.vertexColorAttribute, 4);
			host._setVertexAttribute(geometry.verticesBuffer, program.vertexPositionAttribute, 3);

			host._setUniforms(program, geometry, projectionMatrix);

			host._drawGeometry(geometry);

			host._unbindBuffers();
		});
	},

	_unbindFrameBuffer: function() {
		var instance = this,
			host = instance.get('host'),
			context = host.context;

		context.bindFramebuffer(context.FRAMEBUFFER, null);
	}
});

Y.namespace("Plugin").Picker = Picker;

}, 'gallery-2013.08.22-21-03', {"requires": ["plugin"]});
