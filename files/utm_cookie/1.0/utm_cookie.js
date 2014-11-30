//
// Author: Puru Choudhary (www.terminusapp.com)
// URL: https://github.com/medius/utm_cookie
//
// Description:
// This script saves UTM parameters in cookies whenever there are any UTM parameters
// in the URL. It also saves the initial referrer information in a cookie which is
// never (365 days) overwritten.
//
// Adding this script is useful for custom tracking. e.g. The values in the cookies
// can be read and added to forms or stored in the backend database, etc.
//

var utmCookie = {
  cookieNamePrefix: "_uc_",

  utmParams: ["utm_source",
              "utm_medium",
              "utm_campaign",
              "utm_term",
              "utm_content"],

  cookieExpiryDays: 365,

  // From http://www.quirksmode.org/js/cookies.html
  createCookie: function(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = this.cookieNamePrefix + name+"="+value+expires+"; path=/";
  },

  readCookie: function(name) {
    var nameEQ = this.cookieNamePrefix + name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },

  eraseCookie: function(name) {
    this.createCookie(name,"",-1);
  },

  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  },

  utmPresentInUrl: function() {
    var present = false;
    for (var i = 0; i < this.utmParams.length; i++) {
      var param = this.utmParams[i];
      var value = this.getParameterByName(param);
      if (value != "" && value != undefined) {
        present = true;
      }
    }
    return present;
  },

  writeUtmCookieFromParams: function() {
    for (var i = 0; i < this.utmParams.length; i++) {
      var param = this.utmParams[i];
      var value = this.getParameterByName(param);
      this.createCookie(param, value, this.cookieExpiryDays)
    }
  },

  writeCookieOnce: function(name, value) {
    var existingValue = this.readCookie(name);
    if (!existingValue) {
      this.createCookie(name, value, this.cookieExpiryDays);
    }
  },

  writeReferrerOnce: function() {
    value = document.referrer;
    if (value === "" || value === undefined) {
      this.writeCookieOnce("referrer", "direct");
    } else {
      this.writeCookieOnce("referrer", value);
    }
  },

  referrer: function() {
    return this.readCookie("referrer");
  }
};

utmCookie.writeReferrerOnce();

if (utmCookie.utmPresentInUrl()) {
  utmCookie.writeUtmCookieFromParams();
}
