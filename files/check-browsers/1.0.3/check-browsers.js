(function() {
  'use strict';
  var agent = navigator.userAgent.toLowerCase();
  var name = navigator.appName;
  var html = document.getElementsByTagName('html')[0];
  var browser;

  if(name.indexOf('Explorer') > -1 || agent.indexOf('trident') > -1)  { // IE
    browser = 'ie';
    if(name.indexOf('Explorer') > -1) { // IE old version (IE 10 or lower)
      var version = parseInt(/msie (\d+.\d*)/.exec(agent)[1]);
      browser += version;
    } else { // IE 11
      browser += '11';
    }
  } else if(agent.indexOf('edge') > -1) { // MS Edge
    browser = 'edge';
  } else if(agent.indexOf('safari') > -1) { // Chrome or Safari or Opera
    if(agent.indexOf('opr') > -1) { // Opera
      browser = 'opera';
    } else if(agent.indexOf('chrome') > -1) { // Chrome
      browser = 'chrome';
    } else { // Safari
      browser = 'safari';
    }
  } else if(agent.indexOf('firefox') > -1) { // Firefox
    browser = 'firefox';
  }

  // IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
  html.className += html.className ? ' ' + browser : browser;
}());
