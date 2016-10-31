/*
  Plugin Name: Cookie Bar
  Plugin URL: http://cookie-bar.eu/
  @author: Emanuele "ToX" Toscano
  @description: Cookie Bar is a free & simple solution to the EU cookie law.
*/

/*
 * Available languages array
 */
var CookieLanguages = [
  'ca',
  'cs',
  'da',
  'de',
  'en',
  'es',
  'fr',
  'hu',
  'it',
  'nl',
  'pt',
  'ro',
  'sk'
];

var cookieLawStates = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'EL',
  'ES',
  'FI',
  'FR',
  'GB',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK'
];


/**
 * Main function
 */
function setupCookieBar() {
  var scriptPath = getScriptPath();
  var cookieBar;
  var button;
  var buttonNo;
  var prompt;
  var promptBtn;
  var promptClose;
  var promptContent;
  var promptNoConsent;
  var cookiesListDiv;
  var detailsLinkText;
  var detailsLinkUrl;
  var startup = false;
  var shutup = false;

  /**
   * If cookies are disallowed, delete all the cookies at every refresh
   * @param null
   * @return null
   */
  if (getCookie() == 'CookieDisallowed') {
    removeCookies();
    setCookie('cookiebar', 'CookieDisallowed');
  }

  /**
   * Load plugin only if needed:
   * show if the "always" parameter is set
   * do nothing if cookiebar cookie is set
   * show only for european users
   * @param null
   * @return null
   */

  // If the user is in EU, then STARTUP
  var checkEurope = new XMLHttpRequest();
  checkEurope.open('GET', '//freegeoip.io/json/', true);
  checkEurope.onreadystatechange = function() {
    if (checkEurope.readyState === 4 && checkEurope.status === 200) {
      clearTimeout(xmlHttpTimeout);
      var country = JSON.parse(checkEurope.responseText).country_code;
      if (cookieLawStates.indexOf(country) > -1) {
        startup = true;
      } else {
        shutup = true;
      }
    }
  };

  /*
  * Using an external service for geoip localization could be a long task
  * If it takes more than 1.5 second, start normally
  */
  var xmlHttpTimeout = setTimeout(ajaxTimeout, 1500);
  function ajaxTimeout() {
    console.log('cookieBAR - Timeout for ip geolocation');
    checkEurope.abort();
    startup = true;
  }
  checkEurope.send();

  // If at least a cookie or localstorage is set, then STARTUP
  if (document.cookie.length > 0 || window.localStorage.length > 0) {
    var accepted = getCookie();
    if (accepted === undefined) {
      startup = true;
    } else {
      shutup = true;
    }
  }

  // If cookieBAR should always be show, then STARTUP
  if (getURLParameter('always')) {
    startup = true;
  }

  if (startup === true && shutup === false) {
    startCookieBar();
  }


  /**
   * Load external files (css, language files etc.)
   * @return null
   */
  function startCookieBar() {
    var userLang = detectLang();

    // Load CSS file
    var theme = '';
    if (getURLParameter('theme')) {
      theme = '-' + getURLParameter('theme');
    }
    var path = scriptPath.replace(/[^\/]*$/, '');
    var minified = (scriptPath.indexOf('.min') > -1) ? '.min' : '';
    var stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', path + 'cookiebar' + theme + minified + '.css');
    document.head.appendChild(stylesheet);

    // Load the correct language messages file and set some variables
    var request = new XMLHttpRequest();
    request.open('GET', path + '/lang/' + userLang + '.html', true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var element = document.createElement('div');
        element.innerHTML = request.responseText;
        document.getElementsByTagName('body')[0].appendChild(element);

        cookieBar = document.getElementById('cookie-bar');
        button = document.getElementById('cookie-bar-button');
        buttonNo = document.getElementById('cookie-bar-button-no');
        prompt = document.getElementById('cookie-bar-prompt');

        promptBtn = document.getElementById('cookie-bar-prompt-button');
        promptClose = document.getElementById('cookie-bar-prompt-close');
        promptContent = document.getElementById('cookie-bar-prompt-content');
        promptNoConsent = document.getElementById('cookie-bar-no-consent');

        thirdparty = document.getElementById('cookie-bar-thirdparty');
        tracking = document.getElementById('cookie-bar-tracking');

        scrolling = document.getElementById('cookie-bar-scrolling');
        privacyPage = document.getElementById('cookie-bar-privacy-page');
        privacyLink = document.getElementById('cookie-bar-privacy-link');

        if (!getURLParameter('showNoConsent')) {
          promptNoConsent.style.display = 'none';
          buttonNo.style.display = 'none';
        }

        if (getURLParameter('blocking')) {
          fadeIn(prompt, 500);
          promptClose.style.display = 'none';
        }

        if (getURLParameter('thirdparty')) {
          thirdparty.style.display = 'block';
        }

        if (getURLParameter('tracking')) {
          tracking.style.display = 'block';
        }

        if (getURLParameter('scrolling')) {
          scrolling.style.display = 'inline-block';
        }

        if (getURLParameter('top')) {
          cookieBar.style.top = 0;
          setBodyMargin('top');
        } else {
          cookieBar.style.bottom = 0;
          setBodyMargin('bottom');
        }

        if (getURLParameter('privacyPage')) {
          var url = decodeURIComponent(getURLParameter('privacyPage'));
          privacyLink.href = url;
          privacyPage.style.display = 'inline-block';
        }

        setEventListeners();
        fadeIn(cookieBar, 250);
        setBodyMargin();
      }
    };
    request.send();
  }

  /**
   * Get this javascript's path
   * @return {String} this javascript's path
   */
  function getScriptPath() {
    var scripts = document.getElementsByTagName('script');

    for (i = 0; i < scripts.length; i += 1) {
      if (scripts[i].hasAttribute('src')) {
        path = scripts[i].src;
        if (path.indexOf('cookiebar') > -1) {
          return path;
        }
      }
    }
  }

  /**
   * Get browser's language or, if available, the specified one
   * @return {String} userLang - short language name
   */
  function detectLang() {
    var userLang = getURLParameter('forceLang');
    if (userLang === false) {
      userLang = navigator.language || navigator.userLanguage;
    }
    userLang = userLang.substr(0, 2);
    if (CookieLanguages.indexOf(userLang) < 0) {
      userLang = 'en';
    }
    return userLang;
  }

  /**
   * Get a list of all cookies
   * @param {HTMLElement} cookiesListDiv
   * @return {void}
   */
  function listCookies(cookiesListDiv) {
    var cookies = [];
    var i, x, y, ARRcookies = document.cookie.split(';');
    for (i = 0; i < ARRcookies.length; i += 1) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, '');
      cookies.push(x);
    }
    cookiesListDiv.innerHTML = cookies.join(', ');
  }

  /**
   * Get Cookie Bar's cookie if available
   * @return {string} cookie value
   */
  function getCookie() {
    var cookieValue = document.cookie.match(/(;)?cookiebar=([^;]*);?/);

    if (cookieValue == null) {
      return undefined;
    } else {
      return decodeURI(cookieValue[2]);
    }
  }

  /**
   * Write cookieBar's cookie when user accepts cookies :)
   * @param {string} name - cookie name
   * @param {string} value - cookie value
   * @return null
   */
  function setCookie(name, value) {
    var exdays = 30;
    if (getURLParameter('remember')) {
      exdays = getURLParameter('remember');
    }

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + parseInt(exdays));
    var cValue = encodeURI(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString() + ';path=/');
    document.cookie = name + '=' + cValue;
  }

  /**
   * Remove all the cookies and empty localStorage when user refuses cookies
   * @return null
   */
  function removeCookies() {
    // Clear cookies
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^\ +/, '').replace(/\=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // Clear localStorage
    localStorage.clear();
  }


  /**
   * FadeIn effect
   * @param {HTMLElement} el - Element
   * @param {number} speed - effect duration
   * @return null
   */
  function fadeIn(el, speed) {
    var s = el.style;
    s.opacity = 0;
    s.display = 'block';
    (function fade() {
      (s.opacity -= -0.1) > 0.9 ? null : setTimeout(fade, (speed / 10));
    })();
  }


  /**
   * FadeOut effect
   * @param {HTMLElement} el - Element
   * @param {number} speed - effect duration
   * @return null
   */
  function fadeOut(el, speed) {
    var s = el.style;
    s.opacity = 1;
    (function fade() {
      (s.opacity -= 0.1) < 0.1 ? s.display = 'none' : setTimeout(fade, (speed / 10));
    })();
  }

  /**
   * Add a body tailored bottom (or top) margin so that CookieBar doesn't hide anything
   * @param {String} where
   * @return null
   */
   function setBodyMargin(where) {
      setTimeout(function () {

      var height = document.getElementById('cookie-bar').clientHeight;

      var bodyEl = document.getElementsByTagName('body')[0];
      var bodyStyle = bodyEl.currentStyle || window.getComputedStyle(bodyEl);

      switch (where) {
        case 'top':
          bodyEl.style.marginTop = (parseInt(bodyStyle.marginTop) + height) + 'px';
          break;
        case 'bottom':
          bodyEl.style.marginBottom = (parseInt(bodyStyle.marginBottom) + height) + 'px';
          break;
      }
    }, 300);
  }

  /**
   * Clear the bottom (or top) margin when the user closes the CookieBar
   * @return null
   */
  function clearBodyMargin() {
    var height = document.getElementById('cookie-bar').clientHeight;

    if (getURLParameter('top')) {
      var currentTop = parseInt(document.getElementsByTagName('body')[0].style.marginTop);
      document.getElementsByTagName('body')[0].style.marginTop = currentTop - height + 'px';
    } else {
      var currentBottom = parseInt(document.getElementsByTagName('body')[0].style.marginBottom);
      document.getElementsByTagName('body')[0].style.marginBottom = currentBottom -height + 'px';
    }
  }

  /**
   * Get ul parameter to look for
   * @param {string} name - param name
   * @return {String|Boolean} param value (false if parameter is not found)
   */
  function getURLParameter(name) {
    var set = scriptPath.split(name + '=');
    if (set[1]) {
      return set[1].split(/[&?]+/)[0];
    } else {
      return false;
    }
  }

  /**
   * Set button actions (event listeners)
   * @return null
   */
  function setEventListeners() {
    button.addEventListener('click', function() {
      setCookie('cookiebar', 'CookieAllowed');
      clearBodyMargin();
      fadeOut(prompt, 250);
      fadeOut(cookieBar, 250);
      if (getURLParameter('refreshPage')) {
          window.location.reload();
      }
    });

    buttonNo.addEventListener('click', function() {
      var txt = promptNoConsent.textContent.trim();
      var confirm = window.confirm(txt);
      if (confirm === true) {
        removeCookies();
        setCookie('cookiebar', 'CookieDisallowed');
        clearBodyMargin();
        fadeOut(prompt, 250);
        fadeOut(cookieBar, 250);
      }
    });

    promptBtn.addEventListener('click', function() {
      fadeIn(prompt, 250);
    });

    promptClose.addEventListener('click', function() {
      fadeOut(prompt, 250);
    });

    if (getURLParameter('scrolling')) {
      var scrollPos = document.body.getBoundingClientRect().top;
      var scrolled = false;
      window.addEventListener('scroll', function() {
        if (scrolled === false) {
          if (document.body.getBoundingClientRect().top - scrollPos > 250 || document.body.getBoundingClientRect().top - scrollPos < -250) {
            setCookie('cookiebar', 'CookieAllowed');
            clearBodyMargin();
            fadeOut(prompt, 250);
            fadeOut(cookieBar, 250);
            scrolled = true;
            if (getURLParameter('refreshPage')) {
                window.location.reload();
            }
          }
        }
      });
    }
  }
}

// Load the script only if there is at least a cookie or a localStorage item
document.addEventListener('DOMContentLoaded', function() {
  setupCookieBar();
});
