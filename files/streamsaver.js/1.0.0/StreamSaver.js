;((name, definition) => {
	'undefined' != typeof module ? module.exports = definition() :
	'function' == typeof define && 'object' == typeof define.amd ? define(definition) :
	this[name] = definition()
})('streamSaver', () => {
	'use strict'

	let
	iframe, loaded,
	secure = location.protocol == 'https:' || location.hostname == 'localhost',
	streamSaver = {
		createWriteStream,
		supported: false,
		version: {
			full: '1.0.0',
			major: 1, minor: 0, dot: 0
		}
	}

	streamSaver.mitm = 'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=' +
		streamSaver.version.full

	try {
		// Some browser has it but ain't allowed to construct a stream yet
		streamSaver.supported = !!new ReadableStream()
	} catch(err) {
		// if you are running chrome < 52 then you can enable it
		// `chrome://flags/#enable-experimental-web-platform-features`
	}

	function createWriteStream(filename, queuingStrategy, size) {

		// normalize arguments
		if (Number.isFinite(queuingStrategy))
			[size, queuingStrategy] = [queuingStrategy, size]

		let channel = new MessageChannel,
		popup,
		setupChannel = () => new Promise((resolve, reject) => {
			channel.port1.onmessage = evt => {
				if(evt.data.download) {
					resolve()
					if(!secure) popup.close() // don't need the popup any longer
					let link = document.createElement('a')
					let click = new MouseEvent('click')

					link.href = evt.data.download
					link.dispatchEvent(click)
				}
			}

			if(secure && !iframe) {
				iframe = document.createElement('iframe')
				iframe.src = streamSaver.mitm
				iframe.hidden = true
				document.body.appendChild(iframe)
			}

			if(secure && !loaded) {
				let fn;
				iframe.addEventListener('load', fn = evt => {
					loaded = true
					iframe.removeEventListener('load', fn)
					iframe.contentWindow.postMessage(
						{filename, size}, '*', [channel.port2])
				})
			}

			if(secure && loaded) {
				iframe.contentWindow.postMessage({filename, size}, '*', [channel.port2])
			}

			if(!secure) {
				popup = window.open(streamSaver.mitm, Math.random())
				let onready = evt => {
					if(evt.source === popup){
						popup.postMessage({filename, size}, '*', [channel.port2])
						removeEventListener('message', onready)
					}
				}

				// Another problem that cross origin don't allow is scripting
				// so popup.onload() don't work but postMessage still dose
				// work cross origin
				addEventListener('message', onready)
			}
		})

		return new WritableStream({
			start(error) {
				// is called immediately, and should perform any actions
				// necessary to acquire access to the underlying sink.
				// If this process is asynchronous, it can return a promise
				// to signal success or failure.
				return setupChannel()
			},
			write(chunk) {
				// is called when a new chunk of data is ready to be written
				// to the underlying sink. It can return a promise to signal
				// success or failure of the write operation. The stream
				// implementation guarantees that this method will be called
				// only after previous writes have succeeded, and never after
				// close or abort is called.

				// TODO: Kind of important that service worker respond back when
				// it has been written. Otherwice we can't handle backpressure
				channel.port1.postMessage(chunk)
			},
			close() {
				channel.port1.postMessage('end')
				console.log('All data successfully read!')
			},
			abort(e) {
				channel.port1.postMessage('abort')
			}
		}, queuingStrategy)
	}

	return streamSaver
})
