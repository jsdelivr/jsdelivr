/**
 * A simple cookie handler
 * @author Art <a.molcanovas@gmail.com>
 * @param {string} name AloCookie name
 * @constructor
 */
function AloCookie(name) {
    /**
     * The cookie name
     * @type {string}
     */
    this.name = name;

    /**
     * The cookie value
     * @type {string|number}
     */
    this.value = this.exists() ? AloCookie.getAll()[this.name] : "";

    /**
     * When to expire the cookie, in seconds from now
     * @author Art <a.molcanovas@gmail.com>
     * @type {null|number}
     */
    this.expire = null;

    /**
     * AloCookie path
     * @type {string}
     */
    this.path = null;

    /**
     * AloCookie domain
     * @type {string}
     */
    this.domain = null;

    /**
     * Whether to only set the cookie via HTTPS. Defaults to TRUE if the page is opened via HTTPS, false if not.
     * @type {boolean}
     */
    this.secure = window.location.protocol == "https:";
}

/**
 * Returns all accessible cookies in an object where the keys are cookie names and the values are cookie values
 * @author Art <a.molcanovas@gmail.com>
 * @returns {{}}
 */
AloCookie.getAll = function () {
    var ret = {},
        spl, curr, i;

    if (document.cookie) {
        spl = document.cookie.split('; ');

        for (i = 0; i < spl.length; i++) {
            curr = spl[i].split('=');
            ret[curr[0]] = curr[1];
        }
    }

    return ret;
};

AloCookie.prototype = {
    /**
     * Saves the current cookie with its settings
     * @author Art <a.molcanovas@gmail.com>
     * @returns {AloCookie}
     */
    save: function () {
        if (!this.name || this.value === "") {
            throw "AloCookie name or value not present";
        } else {
            var str = this.name + "=" + this.value;

            if (this.path) {
                str += "; path=" + this.path;
            }

            if (this.domain) {
                str += "; domain=" + this.domain;
            }

            if (this.expire) {
                str += "; expires=" + (new Date(new Date().getTime() + (this.expire * 1000)).toUTCString());
            }

            if (this.secure) {
                str += "; secure";
            }

            document.cookie = str;
        }

        return this;
    },

    /**
     * Returns whether the cookie with the given name exists
     * @author Art <a.molcanovas@gmail.com>
     * @returns {boolean}
     */
    exists: function () {
        return this.name ? document.cookie.indexOf(this.name + "=") !== -1 : false;
    },

    /**
     * Removes the cookie
     * @author Art <a.molcanovas@gmail.com>
     * @returns {AloCookie}
     */
    remove: function () {
        document.cookie = this.name + "=;expires=Wed 01 Jan 1970";
        return this;
    }
};

/**
 * Returns an AloCookie object from the string
 * @author Art <a.molcanovas@gmail.com>
 * @returns {AloCookie}
 */
String.prototype.toCookie = function () {
    return new AloCookie(this.valueOf());
};
