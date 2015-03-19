// SpryThumbnailFilmStripPlugin.js - version 0.2 - Spry Pre-Release 1.7
//
// Copyright (c) 2010. Adobe Systems Incorporated.
// All rights reserved.
//
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

(function() { // BeginSpryComponent

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.ImageSlideShow)
{
	alert("SpryThumbnailFilmStripPlugin.js requires SpryImageSlideShow.js!");
	return;
}

if (!Spry.Widget.FilmStrip)
{
	alert("SpryThumbnailFilmStripPlugin.js requires SpryFilmStrip.js!");
	return;
}

var gTFSP = Spry.Widget.ImageSlideShow.ThumbnailFilmStripPlugin = {
	config: {
		useBkgImages: true,
		pageIncrement: 1,
		wraparound: true,
		sliceMap: {},
		componentOrder: [ "previous", "next", "track" ],
		pluginOptionsProp: "TFSP"
	},

	initialize: function(ss)
	{
		var opts = ss.setOptions({}, gTFSP.config);

		if (ss[opts.pluginOptionsProp])
			ss.setOptions(opts, ss[opts.pluginOptionsProp]);

		ss[opts.pluginOptionsProp] = opts;

		// This plugin stores the thumbnail urls used by the slide show
		// directly on the slide show.

		ss.thumbnailLinksInfo = { thumbUrls: [] };

		// Add the plugin as an observer of the slide show so it can
		// hook in at the appropriate times.

		ss.addObserver(this);
	},

	onPostExtractImageInfo: function(ss, evt)
	{
		// This function gets called before any markup transformation is performed
		// by the slideshow widget. We need to extract out the thumbnail URLs from
		// the default markup embedded within the page. The film strip we create
		// later will use these URLs.

		var urls = ss.thumbnailLinksInfo.thumbUrls;
		var re = evt.repeatingElements;
		for (var i = 0; i < re.length; i++)
		{
			var img = re[i].getElementsByTagName("img").item(0);
			urls[i] = img ? img.src : "";
		}
	},


	onPostTransformMarkup: function(ss, evt)
	{
		var opts = ss[gTFSP.config.pluginOptionsProp];

		// The slideshow widget just finished injecting its transformed markup
		// into the page. Look for all of the slide links in the widget, and
		// inject a thumbnail image into it, or make it a background image on
		// the link.

		var urls = ss.thumbnailLinksInfo.thumbUrls;
		var links = Spry.$$("." + ss.slideLinkClass, ss.element);
		for (var i = 0; i < links.length; i++)
		{
			var container = links[i].contentContainer;
			if (opts.useBkgImages)
				container.style.backgroundImage = "url(" + urls[i] + ")";
			else
			{
				container.innerHTML = "";
				var img = document.createElement("img");
				img.src = urls[i];
				container.appendChild(img);
			}
		}

		// Now find the element that contains all of the slide links
		// and transform it into a filmstrip widget. All of the slide links
		// will be treated as panels during the film strip transformation so
		// it will still allow the user to navigate directly to a given slide.

		var container = Spry.$$("." + ss.slideLinksClass, ss.element)[0];
		if (container)
			ss.thumbnailLinksInfo.filmStrip = new Spry.Widget.FilmStrip(container, {
				pageIncrement:  opts.pageIncrement,
				wraparound:     opts.wraparound,
				sliceMap:       opts.sliceMap,
				componentOrder: opts.componentOrder
			});
	},

	onPostShowSlide: function(ss, evt)
	{
		// Anytime a new slide is shown, make sure the correct thumbnail is
		// selected and scrolled into view if necessary.

		ss.thumbnailLinksInfo.filmStrip.showPanel(evt.slideIndex);
	}
};

})(); // EndSpryComponent