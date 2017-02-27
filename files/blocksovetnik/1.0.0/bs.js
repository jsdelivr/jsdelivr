(function() {

    var blockSovetnik = function() {

        var hash = window.location.hash || false;

        var script = document.currentScript || document.getElementById("ss_script");

        var log = function(t) {
            if (hash && hash === '#ssdebug') console.log(t);
        };

        if (!window['MutationObserver']) {
            log('MutationObserver not supported!');
            return false;
        }

        if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
          log('IE or Edge');
          return false;
        }

      var conf = {};


        var YandexDesktopFound = false;

        var YandexDesktopCheck = {
          'top': '-1px',
          'display': 'table',
          'opacity': '1'
        };



        var blockSovetnikObserver = new MutationObserver(function(allmutations) {
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

                if (m && m.tagName === 'STYLE') {
                    if (/market_context_headcrab_container_relative/.test(m.innerHTML)) {
                    document.body.removeChild(m);
                    log('style removed');
                    }
                }


                if (YandexDesktopFound) {
                    var children = m.childNodes;
                    for(var i=0;i<children.length; i++) {
                        var child = children[i];
                        if (child.style) child.style.position = 'absolute';
                    }
                    if (m && m.style) m.style.transform = 'translate(-10000px, -10000px)';

                    setTimeout(function() {
                        blockSovetnikObserver.disconnect();
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

            if (blockSovetnikObserver) {
                blockSovetnikObserver.observe(document.body, {
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


    blockSovetnik();

})();
