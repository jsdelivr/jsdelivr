// baabaa.js by Andrej Pancik
// This is free and unencumbered software released into the public domain.

var baabaa = (function (document) {
    "use strict";

    function randomIndex(max) {
        return Math.floor(Math.random() * max);
    }

    var cookieNamespace = "baabaa-";

    function setCookie(name, value) {
        document.cookie = encodeURIComponent(cookieNamespace + name) + "=" + encodeURIComponent(value) + "; path=/";
    }

    function getCookie(name) {
        var cookieName = encodeURIComponent(cookieNamespace + name);

        var cookies = document.cookie.split("; ");

        for (var i in cookies) {
            var parts = cookies[i].split('=');

            if (parts[0] === cookieName) {
                return decodeURIComponent(parts[1]);
            }
        }

        return undefined;
    }

    return {
        run: function (ga, dimension, experiments) {
            var decisions = [];

            for (var experiment in experiments) {
                var variantId = getCookie(experiment) || randomIndex(experiments[experiment].length);
                setCookie(experiment, variantId);

                experiments[experiment][variantId].action();

                decisions.push(experiment + ":" + experiments[experiment][variantId].name);
            }

            ga("set", dimension, decisions.join(";"));
        }
    };
})(document);