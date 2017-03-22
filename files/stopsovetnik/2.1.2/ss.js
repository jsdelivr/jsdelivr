(function() {

    var stopSovetnik = function() {

        var hash = window.location.hash || false;

        var script = document.currentScript || document.getElementById("ss_script");

        var log = function(t) {
            if (hash && hash === '#ssdebug') console.log(t);
        };

        if (!window.MutationObserver) {
            log('MutationObserver not supported!');
            return false;
        }

      var conf = {};


        var YandexDesktopFound = false;

        var YandexDesktopCheck = {
            'z-index': '2147483647',
            'display': 'table',
            'position': 'fixed'
        };



        var stopSovetnikObserver = new MutationObserver(function(allmutations) {
            allmutations.map(function(mr) {
                var m = mr.addedNodes[0];

                if (m && m.tagName === 'DIV') {

                    for (var c in YandexDesktopCheck) {
                        if (window.getComputedStyle(m).getPropertyValue(c) === YandexDesktopCheck[c]) {
                            log('YandexDesktopFound-' + c + ' true');
                            YandexDesktopFound = true;
                        } else {
                            log('YandexDesktopFound-' + c + ' false');
                            YandexDesktopFound = false;
                            break;
                        }
                    }

                }


                if (YandexDesktopFound) {

                    if (m && m.style) m.style.transform = 'translate(-10000px, -10000px)';

                    setTimeout(function() {
                        stopSovetnikObserver.disconnect();
                    }, 10000);

                    log('Elements removed!');
                }
            });
        });


        var marginAnimationHTMLObserver = new MutationObserver(function() {
            var mt = document.documentElement.style.marginTop;
            if (mt && parseInt(mt) > 0 && !conf.panel) {
                document.documentElement.style.marginTop = '';
            }
        });

        var marginAnimationBODYObserver = new MutationObserver(function() {
            var mt = document.body.style.marginTop;
            if (mt && parseInt(mt) > 0 && !conf.panel) {
                document.body.style.marginTop = '';
            }
        });

        var runObserver = function() {
            if (!document.body) {
                setTimeout(runObserver, 100);
                return;
            }

            if (stopSovetnikObserver) {
                stopSovetnikObserver.observe(document.body, {
                    'childList': true,
                    'attributes': true,
                    'subtree': true,
                    'attributeFilter': ['style']
                });
            }

            if (marginAnimationHTMLObserver) {
                marginAnimationHTMLObserver.observe(document.documentElement, {
                    'attributes': true,
                    'attributeFilter': ['style']
                });
            }

            if (marginAnimationBODYObserver) {
                marginAnimationBODYObserver.observe(document.body, {
                    'attributes': true,
                    'attributeFilter': ['style']
                });
            }
        }


        if (!(hash && hash === '#ssoff')) {
            runObserver();
        }

    };


    stopSovetnik();

})();
