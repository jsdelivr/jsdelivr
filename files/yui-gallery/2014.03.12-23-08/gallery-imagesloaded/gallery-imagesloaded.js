YUI.add('gallery-imagesloaded', function(Y) {

	'use strict';

	// Y.one('#my-container').imagesLoaded(myFunction)
	// or
	// Y.all('img').imagesLoaded(myFunction)

	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images

	// callback function gets image collection as argument
	//  'this' is the container

	var imagesLoaded = function (nodes, callback) {
		var images = new Y.NodeList(),
			len,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
			loaded = [];

		if (!nodes._nodes) {
			nodes = Y.all(nodes);
		}

		nodes.each(function () {
			images = images.concat(this, this.all('img'));
		});

		images = images.filter('img');
		len = images.size();

		function triggerCallback() {
			callback.call(nodes, images);
		}

		function imgLoaded(event) {
			var img = event.target;
			if (img.src !== blank && Y.Array.indexOf(loaded, img) === -1) {
				loaded.push(img);
				if (--len <= 0) {
					setTimeout(triggerCallback, 0);
				}
			}
		}

		// if no images, trigger immediately
		if (!len) {
			triggerCallback();
		}

		images.once(['load', 'error'],  imgLoaded);

		images.each(function () {
			// cached images don't fire load sometimes, so we reset src.
			var src = this.get('src');
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			// data uri bypasses webkit log warning (thx doug jones)
			this.set('src', blank);
			this.set('src', src);
		});

		return this;
	};

	Y.imagesLoaded = imagesLoaded;


}, 'gallery-2012.08.01-13-16' ,{requires:['node']});
