// SpryImageViewer.js - version 0.1 - Spry Pre-Release 1.6
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.ImageViewer = function(ele, options)
{
	Spry.Utils.Notifier.call(this);

	this.element = Spry.$(ele);
	this.imageSelector = "img";
	this.elementToResizeSelector = "*";
	
	this.currentEffect = null;
	this.currentLoader = null;
};

Spry.Widget.ImageViewer.prototype = new Spry.Utils.Notifier();
Spry.Widget.ImageViewer.prototype.constructor = Spry.Widget.ImageViewer;

Spry.Widget.ImageViewer.prototype.killLoader = function()
{
	if (this.currentLoader)
	{
		this.currentLoader.onload = null;
		this.currentLoader = null;
	}
};

Spry.Widget.ImageViewer.prototype.setImage = function(url)
{
	var img = Spry.$$(this.imageSelector, this.element)[0];
	if (!img) return;

	if (this.currentEffect)
	{
		this.currentEffect.stop();
		this.currentEffect = null;
	}

	this.killLoader();
	var loader = this.currentLoader = new Image;
	var self = this;

	this.notifyObservers("onPreUpdate", url);

	this.currentEffect = new Spry.Effect.Opacity(img, Spry.Effect.getOpacity(img), 0, { duration: 400,
		finish: function()
		{
			// Use an image loader to make sure we only fade in the new image after
			// it is completely loaded.
			loader.onload = function()
			{
				var w = loader.width;
				var h = loader.height;

				var eleToResize = img;
				if (self.elementToResizeSelector)
					eleToResize = Spry.Utils.getAncestor(img, self.elementToResizeSelector);

				self.currentEffect = new Spry.Effect.Size(eleToResize, Spry.Effect.getDimensions(eleToResize), { width: w, height: h, units:"px"}, {duration: 400, finish: function()
				{
					img.src = loader.src;
					loader = null;
					self.currentEffect = new Spry.Effect.Opacity(img, 0, 1, { duration: 400,
						finish: function()
						{
							self.currentEffect = null;
							
							// Our new image is fully visible now. Remove any opacity related
							// style properties on the img to workaround the IE bug that creates
							// white dots/holes in the images. Removing the properties forces
							// IE to re-render the image correctly.

							img.style.opacity = "";
							img.style.filter = "";

							// If the slide show is on, fire off the timer for the next image.

							self.notifyObservers("onPostUpdate", url);
						}});
					self.currentEffect.start();					
				}});
				self.currentEffect.start();
			};
			loader.src = url;
		}
	});
	this.currentEffect.start();
};
