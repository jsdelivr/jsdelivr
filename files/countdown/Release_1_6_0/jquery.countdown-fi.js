/* http://keith-wood.name/countdown.html
   Finnish initialisation for the jQuery countdown extension
   Written by Kalle Vänskä and Juha Suni (juhis.suni@gmail.com). */
(function($) {
	$.countdown.regional['fi'] = {
		labels: ['Vuotta', 'Kuukautta', 'Viikkoa', 'Päivää', 'Tuntia', 'Minuuttia', 'Sekuntia'],
		labels1: ['Vuosi', 'Kuukausi', 'Viikko', 'Päivä', 'Tunti', 'Minuutti', 'Sekunti'],
		compactLabels: ['v', 'kk', 'vk', 'pv'],
		whichLabels: null,
		digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		timeSeparator: ':', isRTL: false};
	$.countdown.setDefaults($.countdown.regional['fi']);
})(jQuery);
