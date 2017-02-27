(($) => {
	class Prowl {
		constructor($elem, opts) {

			/* DEFAULT OPTIONS */
			this.PLUGINNAME = 'ProwlJS'
			this.CONTAINER = opts.container || '.prowl'
			this.TOGGLE = opts.toggleClass || 'prowl-toggle'
			this.OVERLAY = opts.overlay || '.prowl-overlay'
			this.BACKGROUND = opts.background || '#FFF'
			this.STATE = 'closed'

			$elem.addClass(this.TOGGLE)
			this.triggers()
			this.triggerOpen()
		}

		triggers() {
			console.log(this.CONTAINER);

			$(this.CONTAINER).on('open', (e) => {
				this.STATE = 'open'
				$(this.CONTAINER).removeClass('opening closing closed')
					.addClass('open')
					.attr('data-prowl-state', 'open')
			})

			$(this.CONTAINER).on('closed', (e) => {
				this.STATE = 'closed'
				$(this.CONTAINER).removeClass('closing opening open')
					.addClass('closed')
					.attr('data-prowl-state', 'closed')
			})

			$(this.CONTAINER).on('opening', (e) => {
				this.STATE = 'opening'
				$(this.CONTAINER).removeClass('opening closing closed')
					.addClass('opening')
					.attr('data-prowl-state', 'opening')
			})

			$(this.CONTAINER).on('closing', (e) => {
				this.STATE = 'closing'
				$(this.CONTAINER).removeClass('opening closing open')
					.addClass('closing')
					.attr('data-prowl-state', 'closing')
			})
		}

		triggerOpen() {
			$('body').on('click', `${this.TOGGLE}, [data-prowl='toggle']`, (e) => {
				$(`.${this.CONTAINER}`).trigger('opening')
				this.open()
			})
		}

		triggerClose() {
			$('body').on('click', `${this.TOGGLE}, [data-prowl='toggle']`, (e) => {
				$(`.${this.CONTAINER}`).trigger('closing')
				this.close()
			})
		}

		open() {
			$(this.OVERLAY).fadeIn('fast', () => {
				$(this.CONTAINER).trigger('open')
			})

		}

		close() {
			$(this.OVERLAY).fadeOut('fast', () => {
				$(this.CONTAINER).trigger('close')
			})
		}

		getState() {
			return this.STATE
		}
	}

	$.fn.prowl = function(opts) {
		opts = opts || {}
		$this = $(this)
		this.each(() => {
			instance = new Prowl($this, opts)
			console.log($this.text());
		})

		return instance
	}

})(jQuery)
