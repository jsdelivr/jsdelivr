/**
 * @brief  Watch Input box
 * @author NAVER (developers@xpresseingine.com)
 **/
(function($){

var class_name = '_watch_input';

$.fn.watch_input = function(settings)
{
	if (this.length == 0) return false;
	if (this.length > 1) {
		this.each(function(){ $(this).watch_input(settings) });
		return true;
	}
	if (!$.isFunction(settings.oninput)) return false;
	if (this.hasClass(class_name)) return false;

	this[0].__wi_oninput = settings.oninput;
	this.addClass(class_name).keydown(_onkeydown).focus(_onfocus).blur(_onblur);

	return this;
};

var timer = null, val = '', ie=$.browser.msie;

function _onkeydown(event)
{
	if ($(this).val() != val) {
		val = $(this).val();
		this.__wi_oninput();
	}
}

function _onfocus(event)
{
	var self = $(this);

	val = self.val();
	if (ie) return true;

	(function fn() {
		if ( (self.val() != val) && $.isFunction(self[0].__wi_oninput) ) {
			val = self.val();
			self[0].__wi_oninput();
		}

		timer = setTimeout(arguments.callee, 100);
	})();
}

function _onblur(event)
{
	val = '';
	if (!ie && timer) {
		clearTimeout(timer);
		timer = null;
	}
}

})(jQuery);
