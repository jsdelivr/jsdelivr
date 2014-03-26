YUI.add('gallery-media', function(Y) {

/*
 * Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
 * http://www.nczonline.net/
 */

/**
 * Media module
 * @module gallery-media
 */

/**
 * The Media namespace.
 * @class Media
 * @static
 */
Y.namespace("Media");

//-------------------------------------------------------------------------
// Private variables
//-------------------------------------------------------------------------

var mediaList   = {},                   //list of media queries to track
    wasMedia    = {},                   //state of media queries when last checked
    win         = Y.config.win,         //window reference
    controller  = new Y.Event.Target(), //custom events for media queries
    UA          = YUI.Env.UA,           //user agent info
    div,                                //HTML element used to track media queries
    style,                              //HTML element used to inject style rules
    nativeListenerSupport = !!win.matchMedia; //determines native listener support

//-------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------

if (!nativeListenerSupport) {

    //resize is really the only thing to monitor for desktops
    Y.on("windowresize", function() {
        var query,
            medium,
            isMatch,
            wasMatch;
                
        for (query in mediaList) {
            if (mediaList.hasOwnProperty(query)) {
                medium = mediaList[query];
                wasMatch = wasMedia[query];
                isMatch = Y.Media.matches(query);
                
                if (isMatch !== wasMatch) {                            
                    controller.fire(query, { 
                        media: query, 
                        matches: isMatch 
                    });
                }
            }
        }        
    });
}

//-------------------------------------------------------------------------
// Public interface
//-------------------------------------------------------------------------

/**
 * Determines if a given media query is currently valid.
 * @param {String} query The media query to test.
 * @return {Boolean} True if the query is valid, false if not.
 */
Y.Media.matches = function(query){

    var result = false;
    
    if (win.matchMedia) {
        result = win.matchMedia(query).matches;
    } else {

        //if the <div> doesn't exist, create it and make sure it's hidden
        if (!div){
            div = document.createElement("div");
            div.id = "yui-m-1";
            div.style.cssText = "position:absolute;top:-1000px";
            document.body.insertBefore(div, document.body.firstChild);
        }

        div.innerHTML = "_<style media=\"" + query + "\"> #yui-m-1 { width: 1px; }</style>";
        div.removeChild(div.firstChild);
        result = div.offsetWidth == 1;
    }
    
    wasMedia[query] = result;
    return result;
};

/**
 * Allows you to specify a listener to call when a media query becomes
 * valid for the given page.
 * @param {String} query The media query to listen for.
 * @param {Function} listener The function to call when the query becomes valid.
 * @param {Object} context (Optional) The this-value for the listener.
 * @return {EventHandle} An event handle to allow detaching.
 * @method on

 */
Y.Media.on = function(query, listener, context) {

    if (nativeListenerSupport && !mediaList[query]) {
        
        /**
         * Chrome/Safari are strange. They only track media query changes if
         * there are media queries in CSS with at least one rule. So, this
         * injects a style into the page so changes are tracked.
         */
        if (YUI.Env.UA.webkit) {
            if (!style) {
                style = document.createElement("style");
                document.getElementsByTagName("head")[0].appendChild(style);
            }
            
            style.appendChild(document.createTextNode("@media " + query + " { .-yui-m {} }"));                
        }

        //need to cache MediaQueryList or else Firefox loses the event handler
        mediaList[query] = win.matchMedia(query);
        mediaList[query].addListener(function(mql) {
            controller.fire(query, { media: query, matches: mql.matches });
        });
    }

    //track that the query has a listener
    if (!mediaList[query]) {
        mediaList[query] = 1;
    }
        
    //in all cases, use a custom event for managing
    return controller.on(query, listener, context);
};



}, 'gallery-2012.01.18-21-09' ,{requires:['event-base','event-custom-base','event-resize']});
