/* a quick poor man's sprintf */
function atd_sprintf(format, values) {
	var result = format;
	for (var x = 0; x < values.length; x++)
		result = result.replace(new RegExp('%' + (x + 1) + '\\$', 'g'), values[x]);
	return result;
}

/* init the autoproofread options */
function install_atd_l10n() {
	/* install L10n strings into TinyMCE if it's present */
	if ( typeof( tinyMCE ) != 'undefined' && typeof( tinyMCEPreInit ) != 'undefined' && typeof( tinyMCEPreInit.mceInit ) !== 'undefined' )
		tinyMCE.addI18n(tinyMCEPreInit.mceInit.language + '.AtD', AtD_l10n_r0ar);

	/* set the AtD l10n instance */
	AtD.addI18n(AtD_l10n_r0ar);
}

/* document.ready() does not execute in IE6 unless it's at the bottom of the page. oi! */
if (navigator.appName == 'Microsoft Internet Explorer')
        setTimeout( install_atd_l10n, 2500 );
else
        jQuery( document ).ready( install_atd_l10n );

