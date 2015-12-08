/*
    Plugin Name: Cookie Bar
    Plugin URL: http://cookie-bar.eu/
    @author: Emanuele "ToX" Toscano
    @description: Cookie Bar is a free & simple solution to the EU cookie law.
    @version: 1.4.1
*/

/*
 * Available languages array
 */
var CookieLanguages = [
    'en',
    'it',
    'fr'
];

/**
 * Main function
 */
function setupCookieBar() {
    scriptPath = getScriptPath();


    /**
     * If cookies are disallowed, delete all the cookies at every refresh
     * @param null
     * @return null
     */
    if (getCookie("cookiebar") == "CookieDisallowed") {
        removeCookie();
        setCookie("cookiebar", "CookieDisallowed");
    }

    /**
     * Load plugin only if needed or the "always" parameter is set (do nothing if cookiebar cookie is set)
     * @param null
     * @return null
     */
    if (getURLParameter("always")) {
        var accepted = getCookie("cookiebar");
        if (accepted === undefined) {
            startup();
        }
    } else {
        if (document.cookie.length > 0 || window.localStorage.length > 0) {
            var accepted = getCookie("cookiebar");
            if (accepted === undefined) {
                startup();
            }
        }
    }

    /**
     * Load external files (css, language files etc.)
     * @param null
     * @return null
     */
    function startup() {
        var userLang = detectLang();

        // Load CSS file
        var theme = "";
        if (getURLParameter("theme")) {
            theme = "-" + getURLParameter("theme");
        }
        path = scriptPath.replace(/[^\/]*$/, "");
        var stylesheet = document.createElement("link");
        stylesheet.setAttribute("rel", "stylesheet");
        stylesheet.setAttribute("href", path + "cookiebar" + theme + ".css");
        document.head.appendChild(stylesheet);

        // Load the correct language messages file and set some variables
        var request = new XMLHttpRequest();
        request.open('GET', path + "/lang/" + userLang + ".html", true);
        request.onreadystatechange = function () {
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
                cookiesListDiv = document.getElementById('cookies-list');

                detailsLinkText = document.getElementById('cookie-bar-privacy-page');
                detailsLinkUrl = document.getElementById('cookie-bar-privacy-link');

                if (!getURLParameter("showNoConsent")) {
                    promptNoConsent.style.display = "none";
                    buttonNo.style.display = "none";
                }

                if (getURLParameter("blocking")) {
                    fadeIn(prompt, 500);
                    promptClose.style.display = "none";
                }

                if (getURLParameter("top")) {
                    cookieBar.style.top = 0;
                    setBodyMargin("top");
                } else {
                    cookieBar.style.bottom = 0;
                    setBodyMargin("bottom");
                }

                if (getURLParameter("privacyPage")) {
                    var detailsBtn = promptBtn.cloneNode(true);
                    var url = decodeURIComponent(getURLParameter("privacyPage"));
                    var text = promptBtn.getAttribute("data-alt");

                    detailsBtn.href = url;
                    detailsBtn.innerText = text;

                    promptBtn.insertAdjacentHTML("afterEnd", detailsBtn.outerHTML);
                    promptBtn.style.display = "none";
                    detailsBtn.style.display = "inline-block";
                }

                setEventListeners();
                fadeIn(cookieBar, 250);
                setBodyMargin();
                listCookies(cookiesListDiv);
            }
        };
        request.send();
    }

    /**
     * Get this javascript's path
     * @param null
     * @return {String} this javascript's path
     */
    function getScriptPath() {
        var scripts = document.getElementsByTagName("script");

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].hasAttribute("src")) {
                var path = scripts[i].src;
                if (path.indexOf("cookiebar") >-1) {
                    return path;
                }
            }
        }
    }

    /**
     * Get browser's language or, if available, the specified one
     * @param null
     * @return {String} userLang - short language name
     */
    function detectLang() {
        var userLang = getURLParameter("forceLang");
        if (userLang === false) {
            userLang = navigator.language || navigator.userLanguage;
        }
        userLang = userLang.substr(0,2);
        if (CookieLanguages.indexOf(userLang) < 0) {
            userLang = "en";
        }
        return userLang;
    }

    /**
     * Get a list of all cookies
     * @param NULL
     * @return {array} cookies list
     */
    function listCookies(cookiesListDiv) {
        var cookies = [];
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            cookies.push(x);
        }
        cookiesListDiv.innerHTML = cookies.join(", ");
    }

    /**
     * Get Cookie Bar's cookie if available
     * @param {string} c_name - cookie name
     * @return {string} cookie value
     */
    function getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    /**
     * Write cookieBar's cookie when user accepts cookies :)
     * @param {string} c_name - cookie name
     * @param {string} value - cookie value
     * @return null
     */
    function setCookie(c_name, value) {
        var exdays = 30;
        if (getURLParameter("remember")) {
            exdays = getURLParameter("remember");
        }

        var exdate = new Date();
        exdate.setDate(exdate.getDate() + parseInt(exdays));
        var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    /**
     * Remove all the cookies and empty localStorage when user refuses cookies :(
     * @param null
     * @return null
     */
    function removeCookie() {
        // Clear cookies
        document.cookie.split(";")
            .forEach(function (c) {
                document.cookie = c.replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date()
                        .toUTCString() + ";path=/");
            });
        // Clear localStorage
        localStorage.clear();
    }


    /**
     * FadeIn effect
     * @param {string} el - element name
     * @param {string} speed - effect duration
     * @return null
     */
    function fadeIn(el, speed) {
        var s = el.style;
        s.opacity = 0;
        s.display = "block";
        (function fade() {
            (s.opacity -= -0.1) > 0.9 ? null : setTimeout(fade, (speed/10));
        })();
    }


    /**
     * FadeOut effect
     * @param {string} el - element name
     * @param {string} speed - effect duration
     * @return null
     */
    function fadeOut(el, speed) {
        var s = el.style;
        s.opacity = 1;
        (function fade() {
            (s.opacity -= 0.1) < 0.1 ? s.display = "none" : setTimeout(fade, (speed/10));
        })();
    }

    /**
     * Add a body tailored bottom (or top) margin so that CookieBar doesn't hide anything
     * @param null
     * @return null
     */
    function setBodyMargin(where) {    
        setTimeout(function () {
            var height = document.getElementById("cookie-bar").clientHeight;

            switch (where) {
                case "top": 
                    document.getElementsByTagName('body')[0].style.marginTop = height + "px";
                    break;
                case "bottom":
                    document.getElementsByTagName('body')[0].style.marginBottom = height + "px";
                    break;
            }
        }, 300);
    }

    /**
     * Clear the bottom (or top) margin when the user closes the CookieBar
     * @param null
     * @return null
     */
    function clearBodyMargin() {
        var height = document.getElementById("cookie-bar").clientHeight;


        if (getURLParameter("top")) {
            document.getElementsByTagName('body')[0].style.marginTop = -height + "px";
        } else {
            document.getElementsByTagName('body')[0].style.marginBottom = -height + "px";
        }
    }

    /**
     * Get ul parameter to look for
     * @param {string} name - param name
     * @return {string} param value (false if parameter is not found)
     */
    function getURLParameter(name) {
        var set = scriptPath.split(name + "=");
        if (set[1]) {
            return set[1].split(/[&?]+/)[0];
        } else {
            return false;
        }
    }

    /**
     * Set button actions (event listeners)
     * @param null
     * @return null
     */
    function setEventListeners() {
        button.addEventListener('click', function () {
            setCookie("cookiebar", "CookieAllowed");
            clearBodyMargin();
            fadeOut(prompt, 250);
            fadeOut(cookieBar, 250);
        });

        buttonNo.addEventListener('click', function () {
            var txt = promptNoConsent.innerText;
            var confirm = window.confirm(txt);
            if (confirm === true) {
                removeCookie();
                setCookie("cookiebar", "CookieDisallowed");
                clearBodyMargin();
                fadeOut(prompt, 250);
                fadeOut(cookieBar, 250);
            }
        });

        promptBtn.addEventListener('click', function () {
            fadeIn(prompt, 250);
        });

        promptClose.addEventListener('click', function () {
            fadeOut(prompt, 250);
        });
    }
}


// Load the script only if there is at least a cookie or a localStorage item
document.addEventListener("DOMContentLoaded", function () {
    setupCookieBar(); 
});
