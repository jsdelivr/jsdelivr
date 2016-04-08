/*******************************************************/
/*
/*  StopSovetnik - Lock Yandex.Sovetnik on your site!
/*  Ver 1.0.5
/*
/*******************************************************/

(function () {

var stopSovetnik = function() {

  if (!'MutationObserver' in window) return false;

    var stopSovetnikObserver = new MutationObserver(function(allmutations) {

      allmutations.map(function(mr) {
        var m = mr.addedNodes[0];
        var found = false;
        var check = {
          'z-index': '2147483647',
          'background-color': 'rgb(250, 223, 117)',
          'display': 'table',
          'position': 'fixed'
        }

        if (m && m.tagName === 'DIV') {
          for (var c in check) {
            if (window.getComputedStyle(m).getPropertyValue(c) === check[c]) {
              found = true;
            } else {
              found = false;
              break;
            }
          }
          if (found) {
            document.body.removeChild(m);
            document.documentElement.style.marginTop = '';
            stopSovetnikObserver.disconnect();
            setTimeout(function() {
              marginAnimationObserver.disconnect();
            }, 3000);
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

      try {
      stopSovetnikObserver.observe(document.body, {
        'childList': true,
        'attributes': true,
        'attributeFilter': ['style']
      });

      marginAnimationObserver.observe(document.documentElement, {
        'attributes': true,
        'attributeFilter': ['style']
      });
    } catch (e) {
      setTimeout(stopSovetnik, 500);
    }

};


stopSovetnik();

})();
