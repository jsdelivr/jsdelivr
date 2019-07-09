var loader = function() {
    var loadSyncSrcIndex = 0;
    var loadItemCount = 0;
    var loadCallback = null;
    var loadSrc = {};
    var loadAsync = false;

    function js(o) {
        function remove(o) {
            var sId = (typeof(o.id) == 'string' ? o.id : o.src.split('/')[o.src.split('/').length - 1]);
            var hd = document.getElementsByTagName('head')[0];
            var oc = document.getElementById(sId);
            if (oc != null) {
                hd.removeChild(oc);
            }
        }
        if ( !o.src ) {
            o = {
                "src":arguments[0],
                "callback":arguments[1],
                "async":arguments[2]?arguments[2]:false
            }
        }
        if (this.js && this.js.caller) {
            loadSyncSrcIndex = 0;
            if (o.src instanceof Array) {
                loadItemCount = o.src.length;
            } else {
                loadItemCount = 1;
            }
            loadCallback = o.callback;
            loadSrc = o.src;
            loadAsync = o.async ? o.async : false;
            if (loadSrc instanceof Array &&
                    loadCallback instanceof Array && loadSrc.length != loadCallback.length
            )
                throw new Error("src and callback have different lengths.");

        }

        if (o.src instanceof Array) {
            if (loadAsync) {
                for (var i = 0; i < o.src.length; i++) {
                    console.log("loader - callback", i);
                    js({
                        "src": loadSrc[i],
                        "type": o.type
                    });
                }
            } else {
                js({
                    "src": loadSrc[0],
                    "type": o.type
                });
            }
        } else {
            var type = o.type ? o.type : o.src.substr(o.src.lastIndexOf(".") + 1);
            console.log("loader - src", o.src, type);
            var hd = document.getElementsByTagName('head')[0];
            var sId = (typeof(o.id) == 'string' ? o.id : o.src.split('/')[o.src.split('/').length - 1]);
            remove({
                id: sId
            });
            var s = null;

            if (type == 'js') {
                s = document.createElement('script');
                s.type = 'text/javascript';
            } else if (type == 'css') {
                s = document.createElement('link');
                s.rel = 'stylesheet';
                s.type = 'text/css';
            }
            s.id = sId;
            function onReady() {
                if (loadSrc instanceof Array) {
                    if (!loadAsync) { // sync
                        if (loadCallback instanceof Array) {
                            loadCallback[loadSyncSrcIndex](o);
                            if ( loadSrc.length !== loadSyncSrcIndex+1 ) {
                                js({
                                    "src": loadSrc[++loadSyncSrcIndex]
                                });
                            }
                        } else {
                            if (loadSyncSrcIndex == loadItemCount - 1) {
                                loadCallback(o);
                            } else {
                                if ( loadSrc.length !== loadSyncSrcIndex+1 ) {
                                    js({
                                        "src": loadSrc[++loadSyncSrcIndex]
                                    });
                                }
                            }
                        }
                    } else { // async
                        if (loadCallback instanceof Array) {
                            loadCallback[loadSyncSrcIndex](o);
                            ++loadSyncSrcIndex;
                        } else {
                            if (loadSyncSrcIndex == loadItemCount - 1) {
                                loadCallback(o);
                            } else {}
                            ++loadSyncSrcIndex;
                        }
                    }
                } else {
                    loadCallback(o);
                }
            };

            if (s.readyState) { /* IE */
                s.onreadystatechange = function() {
                    if (s.readyState == "complete" || s.readyState == "loaded") {
                        s.onreadystatechange = null;
                        onReady();
                    }
                }
            } else {
                s.onload = onReady;
            }

            if (type == 'js') {
                s.src = o.src;
            } else if (type == 'css') {
                s.href = o.src;
            }
            hd.appendChild(s);
        }
    }

    function autolink(doc) {
        var regURL = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)", "gi");
        var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-]+)", "gi");
        return doc.replace(regURL, "<a href='$1://$2' target='_blank'>$1://$2</a>").replace(regEmail, "<a href='mailto:$1'>$1</a>");
    }

    return {
        js: js,
        autolink: autolink
    }
}();