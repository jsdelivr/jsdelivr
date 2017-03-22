/*!
 * Socialite v1.0
 * http://socialitejs.com
 * Copyright (c) 2011 David Bushell
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */

window.Socialite = (function(window, document, undefined)
{
	var	Socialite = { },

		// internal functions
		_socialite = { },
		// social networks and callback functions to initialise each instance
		networks = { },
		// remembers which scripts have been appended
		appended = { },
		// a collection of URLs for external scripts
		sources = { },
		// remember loaded scripts
		loaded = { },
		// all Socialite button instances
		cache = { },

		sto = window.setTimeout,
		euc = encodeURIComponent,
		gcn = typeof document.getElementsByClassName === 'function';

	// append a known script element once
	_socialite.appendScript = function(network, id, callback)
	{
		if (appended[network] || sources[network] === undefined) {
			return false;
		}

		var js = appended[network] = document.createElement('script');
		js.async = true;
		js.src = sources[network];
		js.onload = js.onreadystatechange = function ()
		{
			if (_socialite.hasLoaded(network)) {
				return;
			}
			var rs = js.readyState;
			if ( ! rs || rs === 'loaded' || rs === 'complete') {
				loaded[network] = true;
				js.onload = js.onreadystatechange = null;
				// activate all instances from cache if no callback is defined
				if (callback !== undefined) {
					if (typeof callback === 'function') {
						callback();
					}
				} else {
					_socialite.activateCache(network);
				}
			}
		};

		if (id) {
			js.id = id;
		}

		document.body.appendChild(js);
		return true;
	};

	// check if an appended script has loaded
	_socialite.hasLoaded = function(network)
	{
		return (typeof network !== 'string') ? false : loaded[network] === true;
	};

	// remove an appended script
	_socialite.removeScript = function(network) {
		if ( ! _socialite.hasLoaded(network)) {
			return false;
		}
		document.body.removeChild(appended[network]);
		appended[network] = loaded[network] = false;
		return true;
	};

	// return an iframe element and activate the instance on load
	_socialite.createIframe = function(src, instance)
	{
		var iframe = document.createElement('iframe');
		iframe.style.cssText = 'overflow: hidden; border: none;';
		iframe.setAttribute('allowtransparency', 'true');
		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('src', src);
		if (instance !== undefined) {
			iframe.onload = iframe.onreadystatechange = function ()
			{
				var rs = iframe.readyState;
				if ( ! rs || rs === 'loaded' || rs === 'complete') {
					iframe.onload = iframe.onreadystatechange = null;
					_socialite.activateInstance(instance);
				}
			};
		}
		return iframe;
	};

	// called once an instance is ready to display
	_socialite.activateInstance = function(instance)
	{
		if (instance.loaded) {
			return;
		}
		instance.loaded = true;
		instance.container.className += ' socialite-loaded';
	};

	// activate all instances waiting in the cache
	_socialite.activateCache = function(network)
	{
		if (cache[network] !== undefined) {
			for (var i = 0; i < cache[network].length; i++) {
				_socialite.activateInstance(cache[network][i]);
			}
		}
	};

	// copy data-* attributes from one element to another
	_socialite.copyDataAttributes = function(from, to)
	{
		var i, attr = from.attributes;
		for (i = 0; i < attr.length; i++) {
			var key = attr[i].name,
				val = attr[i].value;
			if (key.indexOf('data-') === 0 && val.length) {
				to.setAttribute(key, val);
			}
		}
	};

	// return data-* attributes from an element as a query string or object
	_socialite.getDataAttributes = function(from, noprefix, nostr)
	{
		var i, str = '', obj = {}, attr = from.attributes;
		for (i = 0; i < attr.length; i++) {
			var key = attr[i].name,
				val = attr[i].value;
			if (key.indexOf('data-') === 0 && val.length) {
				if (noprefix === true) {
					key = key.substring(5);
				}
				if (nostr) {
					obj[key] = val;
				} else {
					str += euc(key) + '=' + euc(val) + '&';
				}
			}
		}
		return nostr ? obj : str;
	};

	// get elements within context with a class name (with fallback for IE < 9)
	_socialite.getElements = function(context, name)
	{
		if (gcn) {
			return context.getElementsByClassName(name);
		}
		var i = 0, elems = [], all = context.getElementsByTagName('*'), len = all.length;
		for (i = 0; i < len; i++) {
			var cname = ' ' + all[i].className + ' ';
			if (cname.indexOf(' ' + name + ' ') !== -1) {
				elems.push(all[i]);
			}
		}
		return elems;
	};

	// load a single button
	Socialite.activate = function(elem, network)
	{
		Socialite.load(null, elem, network);
	};

	// load and initialise buttons (recursively)
	Socialite.load = function(context, elem, network)
	{
		// if no context use the document
		context = (typeof context === 'object' && context !== null && context.nodeType === 1) ? context : document;

		// if no element then search the context for instances
		if (elem === undefined || elem === null) {
			var	find = _socialite.getElements(context, 'socialite'),
				elems = find,
				length = find.length;

			if (!length) {
				return;
			}
			// create a new array if we're dealing with a live NodeList
			if (typeof elems.item !== undefined) {
				elems = [];
				for (var i = 0; i < length; i++) {
					elems[i] = find[i];
				}
			}
			Socialite.load(context, elems, network);
			return;
		}

		// if an array of elements load individually
		if (typeof elem === 'object' && elem.length) {
			for (var j = 0; j < elem.length; j++) {
				Socialite.load(context, elem[j], network);
			}
			return;
		}

		// Not an element? Get outa here!
		if (typeof elem !== 'object' || elem.nodeType !== 1) {
			return;
		}

		// if no network is specified or recognised look for one in the class name
		if (typeof network !== 'string' || networks[network] === undefined) {
			network = null;
			var classes = elem.className.split(' ');
			for (var k = 0; k < classes.length; k++) {
				if (networks[classes[k]] !== undefined) {
					network = classes[k];
					break;
				}
			}
			if (typeof network !== 'string') {
				return;
			}
		}
		if (typeof networks[network] === 'string') {
			network = networks[network];
		}
		if (typeof networks[network] !== 'function') {
			return;
		}

		// create the button elements
		var	container = document.createElement('div'),
			button = document.createElement('div');
			container.className = 'socialised ' + network;
			button.className = 'socialite-button';

		// insert container before parent element, or append to the context
		var parent = elem.parentNode;
		if (parent === null) {
			parent = (context === document) ? document.body : context;
			parent.appendChild(container);
		} else {
			parent.insertBefore(container, elem);
		}

		// insert button and element into container
		container.appendChild(button);
		button.appendChild(elem);

		// hide element from future loading
		elem.className = elem.className.replace(/\bsocialite\b/, '');

		// create the button instance and save it in cache
		if (cache[network] === undefined) {
			cache[network] = [];
		}
		var instance = {
			elem: elem,
			button: button,
			container: container,
			parent: parent,
			loaded: false
		};
		cache[network].push(instance);

		// initialise the button
		networks[network](instance, _socialite);
	};

	// extend the array of supported networks
	Socialite.extend = function(network, callback, source)
	{
		if (typeof network !== 'string' || typeof callback !== 'function') {
			return false;
		}
		// split into an array to map multiple classes to one network
		network = (network.indexOf(' ') > 0) ? network.split(' ') : [network];
		if (networks[network[0]] !== undefined) {
			return false;
		}
		for (var i = 1; i < network.length; i++) {
			networks[network[i]] = network[0];
		}
		if (source !== undefined && typeof source === 'string') {
			sources[network[0]] = source;
		}
		networks[network[0]] = callback;
		return true;
	};

	// boom
	return Socialite;

})(window, window.document);


/*
 * Socialite Extensions - Pick 'n' Mix!
 *
 */

(function(window, document, s, undefined)
{
	// Twitter
	// https://twitter.com/about/resources/
	s.extend('twitter tweet', function(instance, _s)
	{
		var instanceElem = instance.elem,
			cn = ' ' + instanceElem.className + ' ';
		if (cn.indexOf(' tweet ') !== -1) {
			instanceElem.className = 'twitter-tweet';
		} else {
			var	el = document.createElement('a'),
				dt = instanceElem.getAttribute('data-type'),
				tc = ['share', 'follow', 'hashtag', 'mention'],
				ti = 0;
			for (var i = 1; i < 4; i++) {
				if (dt === tc[i] || cn.indexOf(' ' + tc[i] + ' ') !== -1) {
					ti = i;
				}
			}
			el.className = 'twitter-' + tc[ti] + '-button';
			if (instanceElem.getAttribute('href') !== undefined) {
				el.setAttribute('href', instanceElem.href);
			}
			_s.copyDataAttributes(instanceElem, el);
			instance.button.replaceChild(el, instanceElem);
		}
		var twttr = window.twttr;
		if (typeof twttr === 'object' && typeof twttr.widgets === 'object' && typeof twttr.widgets.load === 'function') {
			twttr.widgets.load();
			_s.activateInstance(instance);
		} else {
			if (_s.hasLoaded('twitter')) {
				_s.removeScript('twitter');
			}
			if (_s.appendScript('twitter', 'twitter-wjs', false)) {
				window.twttr = {
					_e: [function() {
						_s.activateCache('twitter');
					}]
				};
			}
		}
	}, '//platform.twitter.com/widgets.js');

	// Google+
	// https://developers.google.com/+/plugins/+1button/
	s.extend('googleplus', function(instance, _s)
	{
		var instanceElem = instance.elem,
			el = document.createElement('div');
		el.className = 'g-plusone';
		_s.copyDataAttributes(instanceElem, el);
		instance.button.replaceChild(el, instanceElem);
		if (typeof window.gapi === 'object' && typeof window.gapi.plusone === 'object' && typeof gapi.plusone.render === 'function') {
			window.gapi.plusone.render(instance.button, _s.getDataAttributes(el, true, true));
			_s.activateInstance(instance);
		} else {
			if ( ! _s.hasLoaded('googleplus')) {
				_s.appendScript('googleplus');
			}
		}
	}, '//apis.google.com/js/plusone.js');

	// Facebook
	// http://developers.facebook.com/docs/reference/plugins/like/
	s.extend('facebook', function(instance, _s)
	{
		var instanceElem = instance.elem,
			el = document.createElement('div'),
			fbElem = document.getElementById('fb-root');
		if (!fbElem && !_s.hasLoaded('facebook')) {
			fbElem = document.createElement('div');
			fbElem.id = 'fb-root';
			document.body.appendChild(fbElem);
			el.className = 'fb-like';
			_s.copyDataAttributes(instanceElem, el);
			instance.button.replaceChild(el, instanceElem);
			_s.appendScript('facebook', 'facebook-jssdk');
		} else {
			var src = '//www.facebook.com/plugins/like.php?';
			src += _s.getDataAttributes(instanceElem, true);
			var iframe = _s.createIframe(src, instance);
			instance.button.replaceChild(iframe, instanceElem);
		}
	}, '//connect.facebook.net/en_US/all.js#xfbml=1');

	// LinkedIn
	// http://developer.linkedin.com/plugins/share-button/
	s.extend('linkedin', function(instance, _s)
	{
		var instanceElem = instance.elem,
			attr = instanceElem.attributes,
			el = document.createElement('script');
		el.type = 'IN/Share';
		_s.copyDataAttributes(instanceElem, el);
		instance.button.replaceChild(el, instanceElem);
		if (typeof window.IN === 'object' && typeof window.IN.init === 'function') {
			window.IN.init();
			_s.activateInstance(instance);
		} else {
			if (!_s.hasLoaded('linkedin')) {
				_s.appendScript('linkedin');
			}
		}
	}, '//platform.linkedin.com/in.js');

	// Pinterest "pin It" Button
	// http://pinterest.com/about/goodies/
	s.extend('pinit', function(instance, _s)
	{
		var instanceElem = instance.elem,
			el = document.createElement('a');
		el.className = 'pin-it-button';
		if (instanceElem.getAttribute('href') !== undefined) {
			el.setAttribute('href', instanceElem.href);
		}
		var layout = instanceElem.getAttribute('data-count-layout') || 'horizontal';
		el.setAttribute('count-layout', layout);
		instance.button.replaceChild(el, instanceElem);
		if (_s.hasLoaded('pinit')) {
			_s.removeScript('pinit');
		}
		_s.appendScript('pinit');
	}, '//assets.pinterest.com/js/pinit.js');

	// Spotify Play Button
	// https://developer.spotify.com/technologies/spotify-play-button/
	s.extend('spotify-play', function(instance, _s)
	{
		var instanceElem = instance.elem,
			src = 'https://embed.spotify.com/?',
			width = parseInt(instanceElem.getAttribute('data-width'), 10),
			height = parseInt(instanceElem.getAttribute('data-height'), 10);
		instanceElem.removeAttribute('data-width');
		instanceElem.removeAttribute('data-height');
		src += 'uri=' + instanceElem.getAttribute('href') + '&';
		src += _s.getDataAttributes(instanceElem, true);
		var iframe = _s.createIframe(src, instance);
		iframe.style.width = (isNaN(width) ? 300 : width) + 'px';
		iframe.style.height = (isNaN(height) ? 380 : height) + 'px';
		instance.button.replaceChild(iframe, instanceElem);
		_s.activateInstance(instance);
	}, '');

})(window, window.document, window.Socialite);
