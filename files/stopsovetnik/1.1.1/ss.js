/*******************************************************/
/*
/*  StopSovetnik - Lock Yandex.Sovetnik on your site!
/*  Ver 1.1.1
/*
/*******************************************************/

(function () {

var stopSovetnik = function() {

  var hash = window.location.hash || false;

  var log = function (t) {
    if (hash && hash === '#ssdebug') console.log(t);
  };

  if (!'MutationObserver' in window) {
    log('MutationObserver not supported!');
    return false;
  }
  var stopSovetnikObserver = new MutationObserver(function(allmutations) {
    allmutations.map(function(mr) {
      var m = mr.addedNodes[0];
      var YandexFound = false;
      var PlusoFound = false;
      var YandexCheck = {
        'z-index': '2147483647',
        //'background-color': 'rgb(250, 223, 117)',
        'display': 'table',
        'position': 'fixed'
      };

      var PlusoCheck = {
        'z-index': '2147483648',
        'background': '#FAFAFA',
        'display': 'block',
        'position': 'fixed',
        'box-sizing': 'border-box',
        'width': '416px'
      }

      if (m && m.tagName === 'DIV') {
        for (var c in YandexCheck) {
          if (window.getComputedStyle(m).getPropertyValue(c) === YandexCheck[c]) {
            log('Yandex-'+c, true);
            YandexFound = true;
          } else {
            log('Yandex-'+c, false);
            YandexFound = false;
            break;
          }
        }

        if (YandexFound || PlusoFound) {
          m.style.transform = 'translate(-10000px, -10000px)';
          document.documentElement.style.marginTop = '';
          log('Elements removed!');
        }
      }
    });
  });

  var marginAnimationObserver = new MutationObserver(function() {
    var mt = document.documentElement.style.marginTop;
    if (mt && parseInt(mt) > 0) {
      document.documentElement.style.marginTop = '';
    }
  });

  var runObserver = function () {
    if (!document.body) {
      setTimeout(runObserver, 100);
      return;
    }

    if (stopSovetnikObserver) {
        stopSovetnikObserver.observe(document.body, {
          'childList': true,
          'attributes': true,
          'attributeFilter': ['style']
        });

        marginAnimationObserver.observe(document.documentElement, {
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
