(function() {
  'use strict';
  var agent = navigator.userAgent.toLowerCase();
  var html = document.getElementsByTagName('html')[0];
  var browser;

  if(agent.indexOf('msie') > -1) { // IE6~10
    browser = 'ie' + agent.match(/msie (\d+)/)[1];
  } else if(agent.indexOf('trident') > -1) { // IE11
    browser = 'ie11'
  } else if(agent.indexOf('edge') > -1) { // MS Edge
    browser = 'edge';
  } else if(agent.indexOf('firefox') > -1) { // Mozilla Firefox
    browser = 'firefox';
  } else if(agent.indexOf('opr') > -1) { // Opera
    browser = 'opera';
  } else if(agent.indexOf('chrome') > -1) { // Google Chrome
    browser = 'chrome';
  } else if(agent.indexOf('safari') > -1) { //  Apple Safari
    browser = 'safari';
  }

  // IE: ie6~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
  html.className += (html.className ? ' ' : '') + browser;
}());