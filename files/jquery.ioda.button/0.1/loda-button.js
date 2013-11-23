(function ($) {

		var methods = {
			start: function () {
				var loda = getData(this);
				if (loda) loda.start();
			},

			stop: function () {
				var loda = getData(this);
				if (loda) loda.stop();
			}
		},

		getData = function(el) {
			return el.data('loda-button-data');
		},

		setData = function(el, data) {
			el.data('loda-button-data', data);
		},

		LodaButton = function(element) {
			this._element  = element;
			this._jelement = $(element);
			
			if (getData(this._jelement)) return;
			setData(this._jelement, this);
		};

	LodaButton.prototype = {
		start: function() {
			this._jelement.addClass('loda-btn-loading');
		},

		stop: function() {
			this._jelement.removeClass('loda-btn-loading');
		}
	};


	$.fn.lodaButton = function(options) {

		if (methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof options === 'object' || !options) {
			return this.each(function() {
				new LodaButton(this);
				return this;
			});
		} else {
			$.error( 'Method ' +  options + ' does not exist on lodaButton' );
		} 
			
	};

}(jQuery));