/*!
* Aloha Editor VIE integration
* Author & Copyright (c) 2011 Henri Bergius, IKS Consortium
* henri.bergius@iki.fi
* Licensed unter the terms of https://github.com/bergie/VIE/raw/master/LICENSE
*/

document.write('<script type="text/javascript" src="' + GENTICS_Aloha_base + 'plugins/eu.iksproject.VIE/deps/underscore-min.js"></script>');
document.write('<script type="text/javascript" src="' + GENTICS_Aloha_base + 'plugins/eu.iksproject.VIE/deps/backbone-min.js"></script>');
document.write('<script type="text/javascript" src="' + GENTICS_Aloha_base + 'plugins/eu.iksproject.VIE/deps/vie-containermanager.js"></script>');
document.write('<script type="text/javascript" src="' + GENTICS_Aloha_base + 'plugins/eu.iksproject.VIE/deps/vie-aloha.js"></script>');

if (typeof VIE === 'undefined') {
    VIE = {};
}

VIE.AlohaPlugin = new GENTICS.Aloha.Plugin('eu.iksproject.VIE');

VIE.AlohaPlugin.init = function () {
};
