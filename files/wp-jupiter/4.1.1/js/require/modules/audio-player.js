define(['jquery', 'window', 'plugin/jplayer'], function($, win) {
	'use strict';

	var Public = {
		init: init
	};

	function init(config) {
		var $this = $('#' + config.id);

        $this.jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                	mp3: config.mp3,
                	ogg: config.ogg
				});
            },
            play: function() { // To avoid both jPlayers playing together.
                $(this).jPlayer("pauseOthers");
            },
            swfPath: config.swfPath,
            supplied: "mp3, ogg",
            cssSelectorAncestor: '#' + config.player,
            wmode: "window"
        });
	}

	return Public;

});