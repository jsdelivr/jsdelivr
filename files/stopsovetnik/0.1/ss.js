/*******************************************************/
/*
/*  StopSovetnik - Lock Yandex.Sovetnik on your site!
/*
/*******************************************************/

var kribleAntiSovetnik = function() {

  var $ = function(el) {
    var nodes = document.querySelectorAll(el);
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes[nodes.length - 1];
    } else {
      return null;
    }
  };

  var checkSovetnik = setInterval(function() {
    var margin = parseInt($('HTML').style.marginTop);
    if (margin > 0) {
      $('BODY > DIV').remove();
      $('BODY > STYLE').remove();
      clearInterval(checkSovetnik);
      setTimeout(function() {
        $('HTML').style.marginTop = '0px';
      }, 500);
    }

    setTimeout(function() {
      clearInterval(checkSovetnik);
    }, 10000);

  }, 10);
};


kribleAntiSovetnik();
