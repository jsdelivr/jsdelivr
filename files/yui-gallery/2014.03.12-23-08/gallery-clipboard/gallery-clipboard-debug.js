YUI.add('gallery-clipboard', function(Y) {

/*
 Copyright (c) 2011, Yahoo! Inc.
All rights reserved.

Redistribution and use of this software in source and binary forms, 
with or without modification, are permitted provided that the following 
conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Yahoo! Inc. nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission of Yahoo! Inc.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS 
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED 
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

    /**
     * The ClipBoard class is desinged to be a node plugin and a wrapper over the flash movie
     * to copy text contents to the OS clipboard. The class will place the flash movie below the given
     * node so that a user action can trigger the copy of contents to the OS clip board using
     * Flash's System.setClipboard method. Starting from flash 10, the clipboard can be set only
     * off a user initiated event. So the JS class shall only set the string to be copied and will
     * allow the flash movie's event to capture the user action and set the clipboard contents
     * @class ClipBoard
     * @constructor
     * @extends Y.Plugin.Base
     */
    function ClipBoard(config) {
        ClipBoard.superclass.constructor.apply(this, arguments);
    }
    
    /**
     * Template for embedding the flash movie in the object tag. Mainly for IE browsers
     * @property OBJECT_TEMPLATE
     * @static
     * @type String
     * @private
     */
    var OBJECT_TEMPLATE     = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'+
                        ' codebase="{__PROTOCOL__}download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" '+
                        'width="{__WIDTH__}" height="{__HEIGHT__}" id="{__MOVIEID__}" '+
                        'align="middle"><param name="allowScriptAccess" value="always" embed-type="menu"/>'+
                        '<param name="allowFullScreen" value="false" />'+
                        '<param name="movie" value="{__MOVIEPATH__}" />'+
                        '<param name="loop" value="false" /><param name="menu" value="false" />'+
                        '<param name="quality" value="best" /><param name="bgcolor" value="#ffffff" />'+
                        '<param name="flashvars" value="{__FLASHVARS__}"/><param name="wmode" '+
                        'value="transparent"/></object>',
    /**
     * Template for embedding the flash movie in the embed tag. For most other browsers
     * @property EMBED_TEMPLATE
     * @static
     * @type String
     * @private
     */
        EMBED_TEMPLATE      = '<embed id="{__MOVIEID__}" src="{__MOVIEPATH__}" loop="false" '+
                        'menu="false" quality="best" bgcolor="#ffffff" width="{__WIDTH__}" '+
                        'height="{__HEIGHT__}" name="{__MOVIEID__}" align="middle" '+
                        'allowScriptAccess="always" allowFullScreen="false" '+
                        'type="application/x-shockwave-flash" '+
                        'pluginspage="http://www.macromedia.com/go/getflashplayer" '+
                        'flashvars="{__FLASHVARS__}" wmode="transparent" embed-type="menu" />',
    /**
     * Name of the flash movie
     * @property SWF_MOVIE_NAME
     * @private
     * @static
     * @type String
     */
        SWF_MOVIE_NAME     = "ClipBoardCopy.swf?r=1",
        COMPONENT_NAME     = "clipboard",
        COMPONENT_NS       = "cp",
        CALLBACK_GLOBAL    = { obj : window, name : ""},
        GLOBAL_HANDLER     = "ClipboardInterfaceFn",
        PROTOCOL           = window.location.href.match(/^https/i) ? 'https://' : 'http://',
        FLASHVARS_TEMPLATE = "id={__MOVIEID__}&ns={__NS__}&width={__WIDTH__}&height={__HEIGHT__}"+
                             "&fn={__FN__}&domain={__DOMAIN__}",
        OFFSCREEN_LEFT     = "-2000px",
        FLASHMOVIE_LOADED  = false,
        /* Helpers */
        flashEventCache    = {},
        loadObj            = {},
        isEmpty            = function(s) {
            if(Y.Lang.isString(s) || Y.Lang.isArray(s))
                return (s.length == 0)?true:false;
            return false;
        },
        isUndefined        = Y.Lang.isUndefined,
        isNull             = Y.Lang.isNull,
        isNumber           = Y.Lang.isNumber,
        isString           = Y.Lang.isString,
        canBeRemoved       = function(e) {
            var cache = flashEventCache;
            for(var id in cache)
                for(var ev in cache[id]) {
                    
                    if(ev === e)
                        return false;
                }
            return true;
        },
        unsetCache        = function(id, ev) {
            delete flashEventCache[id][ev];
        };
    
    ClipBoard.NAME = COMPONENT_NAME;
    ClipBoard.NS   = COMPONENT_NAME;
    ClipBoard.setCallBackGlobal = function( v ) {
        var tmp = [],
            n   = 0, i = 0,
            obj = window, name = '';
            
        if ( isString(v) && v !== "window" ) {
            tmp = ( v.indexOf(".") >= 0 )?v.split(".") : [v];
            n   = tmp.length;
            for (;i<n;i++) {
                if ( obj[tmp[i]] ) {
                    obj = obj[tmp[i]];
                    name = name + (( i == 0 )?tmp[i]:"."+tmp[i]);
                }
            }
        }
        CALLBACK_GLOBAL = { "obj" : obj, "name" : name };
        return CALLBACK_GLOBAL;
    };
    ClipBoard.ATTRS = {
        /**
         * The page attribute represents the topmost node where the flash movie will be embeded only
         * once. This is needed so that even if there are multiple copy nodes, we will use only a
         * one flash movie
         * my default, the page attribute is set to the page body
         * @attribute page
         * @type Node
         */
        page : {
            value : Y.one("body")
        },
        /**
         * The identifier for the flash movie
         * @attribute id
         * @type String
         */
        id : {
            value : ''
        },
        /**
         * The path to the swf movie. The movie might be set up on various domain. The movie path
         * can be a URL or a file path
         * @attribute moviepath
         * @type String
         */
        moviepath : {
            value : ''
        },
        /**
         * If there are custom global name space that the flash callback function has to be called on,
         * that can be passed here
         * @attribute global
         * @type Object
         */
        global : {
            readOnly : true,
            getter : function() {
                return { obj : CALLBACK_GLOBAL.obj, name : CALLBACK_GLOBAL.name };
            }
        },
        /**
         * The domain value that should be allowed in the flash movie
         * @attribute domain
         * @type String
         */
        domain : {
            value : "*.yahoo.com"
        },
        /**
         * The movieloaded attribute will be set for the given node when the flash movie is ready
         * @attribute movieloaded
         * @type Boolean
         */
        movieloaded : {
            value : false
        }
    };
 
    Y.extend(ClipBoard, Y.Plugin.Base, {
        /**
         * Initializer function to set up the flash movie if not already present on the "page",
         * setup the flash - js interface, and align the movie to the host node
         * @method initializer
         * @param config {Object} the configuration attributes
         * @return {Void}
         */
        initializer: function(config) {
            var _this  = this,
                global = _this.get("global"),
                fn     = !isEmpty(global["name"])?global["name"]+"."+GLOBAL_HANDLER:GLOBAL_HANDLER,
                dimen;
            if(isEmpty(_this.get("id")))
                this.set("id",Y.guid(COMPONENT_NAME+"_"));
            
            _this._host       = _this.get("host");
            _this._movie      = null;
            
            if(isEmpty(_this._host.get("id")))
                _this._host.set("id", _this.get("id"));
            else
                _this.set("id", _this._host.get("id"));
                
            dimen  = _this.getHostDimensions();
            
            if ( isUndefined(global["obj"][GLOBAL_HANDLER]) ) {
                global["obj"][GLOBAL_HANDLER]  = _this._flashInterface;
            }
            
            _this._host.publish(COMPONENT_NAME+":"+"load", {
                emitFacade : true,
                preventable : true,
                context     : _this._host,
                bubbles     : true,
                fireOnce    : true
            });
            
            Y.on(COMPONENT_NAME+":"+"load", function(a) {
                FLASHMOVIE_LOADED = true;
                loadObj.params = a;
                _this._host.fire(COMPONENT_NAME+":"+"load", a);
                _this.set("movieloaded", true);
            });
            
            _this._movie = _this._getFlashMovieObj(dimen, fn);
            
            _this._alignMovie(dimen, _this._host);
        
            _this.hide();
            /**
             * The setAttribute method is trapped by the plugin and if the value set is copy, then we
             * show the flash movie and then set the value to be copied. Now, when the user will
             * initiate the event on the flash movie, we will set the contents of the keyboard
             * @method setAttribute
             * @private
             * @param type {String} The type of attribute to be set
             * @param value {String} The attribute value to be set
             */
            _this.beforeHostMethod("setAttribute", function(type, value) {
                if(type === "copy") {
                    _this.copy(value);
                    _this.show();
                    _this.focus()
                }
            });
            /* we hook on to the host "on" method so that we can fire the clipboard:load event
              only when the user requests for it . This is a hack needed because the flash movie
              will fire the load event only once for the entire lifecycle of the page*/
            _this.afterHostMethod("on", function(ev) {
                if (ev === COMPONENT_NAME+":load" && FLASHMOVIE_LOADED) {
                    _this._host.fire(COMPONENT_NAME+":"+"load", loadObj.params);
                    _this.set("movieloaded", true);
                }
            });
            
            /* @TODO look at over-writing the 'on' and 'detach' methods for "clipboar:" namespaced
              events */
        },
        /**
         * Destructor method to clean up the flash movie clipboard
         * @TODO Not calling this destructor because its a node plugin and every time the node is destroyed
         * it will destroy the clipboard, need to check this further 
         * @method _destructor
         * @private
         */
        _destructor : function() {
            var _this = this;
            Y.log("Destructor called for "+ _this._host.get("id"));
            _this.get("boundingBox").destroy(true);
            FLASHMOVIE_LOADED = false;
            loadObj = {};
            flashEventCache = {};
        },
        /**
         * Method to get the dimensions of the host node so that the flash movie can be
         * painted across the node.
         * @method getHostDimensions
         * @return {Object} { w : width, h : height, xy : NodeXY}
         */
        getHostDimensions : function() {
            var _this  = this,
                host   = _this._host,
                wh     = _this._getNodeSize(host);
            return {
                w  : parseInt(wh[0], 10),
                h  : parseInt(wh[1], 10),
                xy : host.getXY()
            };
        },
        /**
         * Method to align the flash movie on top of the node so that it can trap the user events
         * @method show
         * @return {Void}
         */
        show : function() {
            var _this = this;
            _this._alignMovie(_this.getHostDimensions());
        },
        /**
         * Alias method to the flash movie focus method
         * @method focus
         * @return {Void}
         */
        focus : function() {
            var m = this._movie;
            if(m.focus) m.focus();
        },
        /**
         * Method to hide the flash movie once the copy has been done
         * @method hide
         * @return {Void}
         */
        hide : function() {
            var _this = this,
                mb    = _this.get("boundingBox");
            mb.setStyles({ "left" : OFFSCREEN_LEFT });
            
        },
        /**
         * Method to set the copy string into to movie. This method has to be called before the
         * flash movie accepts the event to set the copy string to clip board. This method can
         * also be called by using node.setAttribute("copy", "this is a string" );
         * @method copy
         * @param str {String} the string to be copied
         */
        copy : function(str) {
            var _this = this;
            try {
                _this._movie._node.copy(str, _this.get("id"));
            } catch(e) {
                Y.fire(COMPONENT_NAME+":error", {"error": e.message});
                Y.log("Copy Event Error occured" + e.message);
            }
        },
        /**
         * Method to set an event on the flash movie. The set event call maintains an event cache
         * of all the events assigned on the flash movie for a given node. Since there is only one
         * flash movie on the page, the setEvent can maintain only a single event per node on the
         * flash movie.
         * @method setEvent
         * @param n {String} The flash movie Event name. Refer the 
         * <a href='http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/Event.html'
         * target=_blank>the adobe Action-script 3 flash events manual</a> for all the events that
         * can be assigned to the flash movie.
         * @param cb {Function} The callback function to be called when the flash movie event occurs
         * @param docopy {Boolean} The boolean flag to decide whether the event you assign when triggered
         * must assign the copy text to the OS clipboard. Default is FALSE
         * @return {Boolean} TRUE if success, FALSE if failure
         */
        setEvent : function(n, cb, docopy) {
            try {
                var _this = this;
                    movie = _this._movie._node,
                    cache = flashEventCache,
                    obj   = {},
                    id    = this.get("id");
                if(isUndefined(cache[id]))
                    cache[id] = {};
                cache[id][n] = cb;
                obj[n] = {"docopy" : docopy?true:false};
                if ( movie.setupEvents ) {
                    movie.setupEvents(obj);
                }
            } catch(e) {
                Y.fire(COMPONENT_NAME+":error", {"error": e.message});
                Y.log("Setup Event Error occured" + e.message);
            }
            
        },
        /**
         * Method to remove the event on the flash movie. This method will makes sure that the
         * event is removed only if all the node instances using the flash movie are free of any
         * events binding. If there are any nodes that are listening to the flash movie event, then
         * till a remove event for that node is called, the events will not be removed from the
         * flash movie
         * @method removeEvent
         * @param n {String} The name of the event
         * @return {Boolean} TRUE if success, FALSE if failure
         */
        removeEvent : function(n) {
            try {
                var cache = flashEventCache,
                    _this = this, i = 0, l = 0, id = _this.get("id"),rm = [],
                    movie =  _this._movie._node;
                if(isString(n)) {
                    n = [n];
                }
                for(l=n.length;i<l;i++) {
                    unsetCache(id, n[i]);
                    if(canBeRemoved(n[i]))
                        rm.push(n[i]);
                }
                if ( rm.length > 0 && movie.removeEvents ) {
                    movie.removeEvents(rm);
                }
            } catch(e) {
                Y.fire(COMPONENT_NAME+":error", {"error": e.message});
                Y.log("Remove Event Error occured" + e.message);
            }
            return true;
        },
        /**
         * Method to align the movie to the given host with the specified dimensions
         * @method _alignMovie
         * @param d {Object} The dimensions object got from getHostDimensions
         * @param h {Node} The host node
         * @return {Node} The bounding box node
         * @private
         */
        _alignMovie : function(d, h) {
            var _this = this,
                host  = isUndefined(h)?_this._host:h,
                mb    = _this.get("boundingBox"),
                zin   = 1,
                hzin  = parseInt(host.getStyle("zIndex"), 10); /* host z-index  */
            if(isNumber(hzin))
                zin = hzin + 1;
            mb.setXY(d.xy);
            mb.setStyles({zIndex : zin});
            
            return mb;
        },
        /**
         * Method to create the flash object markup, create the Object or Embed element and append it
         * to the "page"
         * @method _getFlashMovieObj
         * @param d {Object} The dimensions object got from getHostDimensions
         * @param f {String} The global call back function name
         * @private
         */
        _getFlashMovieObj : function(d, f) {
            var _this = this,
                id    = COMPONENT_NAME,
                rep   = {
                "__PROTOCOL__" : PROTOCOL,
                "__MOVIEID__"  : id,
                "__WIDTH__"    : d.w,
                "__HEIGHT__"   : d.h,
                "__MOVIEPATH__": _this.get("moviepath")+SWF_MOVIE_NAME,
                "__NS__"       : ClipBoard.NS,
                "__FN__"       : f,
                "__DOMAIN__"   : _this.get("domain")
            },
            template = Y.UA.ie?OBJECT_TEMPLATE:EMBED_TEMPLATE,
            page     = _this.get("page"),
            movie    = _this.get("page").one("#"+id),
            wrapper;
            
            rep["__FLASHVARS__"] = Y.substitute(FLASHVARS_TEMPLATE, rep);
            
            if (isNull(movie)) {
                wrapper = Y.Node.create("<div></div>");
                wrapper.set("innerHTML", Y.substitute(template, rep));
                wrapper.setStyles({"width" : d.w, height:d.h, position:"absolute"});
                wrapper.set("className", COMPONENT_NAME+"-wrapper");
                page.appendChild(wrapper);
                movie = _this.get("page").one("#"+id);
                loadObj.host = _this._host;
                Y.log("Creating a new flash movie node and attaching to DOM");
            }
            this.set("boundingBox", movie.get("parentNode"));
            movie.setStyle("outline", "none");
            return movie;
        },
        /**
         * The main method that is set on the "global" that will be the callback interface between
         * the flash movie and javascript. All the flash movie events that are trapped and are of
         * interest will be passed into the falsh interface. Based on the type of event, the
         * method will dispatch the event to the most suitable node or handler
         * @method _flashInterface
         * @param ev {String} The event String
         * @param a {Object} The flash call back object
         * @return {Void}
         * @private
         */
        _flashInterface : function(ev, a) {
            try {
                var tr, node,
                    cache = flashEventCache;
                if(ev == COMPONENT_NAME+":event") {
                    tr   = a.transaction,
                    node = Y.one("#"+tr);
                    if(cache[tr][a.event])
                        cache[tr][a.event].call(node, a);
                } else {
                    Y.fire(ev, a);
                }
                Y.log("Flash Interface callback recieved :"+ev  );
            } catch(e) {
                Y.fire(COMPONENT_NAME+":error", Y.mix({"error": e.message}, a));
                Y.log("Flash Interface Error occured :" +e.message);
            }
            
            
        },
        /**
         * Return the size of the given node including border, padding and margin.
         * 
         * @method _getNodeSize
         * @param {Node} node The node for which the size needs to be computed
         * @private
         */
        _getNodeSize: function (node) {
            var sz = [],
                gc = function(ppt, n) {
                    return parseInt(n.getComputedStyle(ppt), 10);
                };
            sz[0] = gc("marginLeft", node) + gc("paddingLeft", node) +
                     gc("borderLeftWidth", node) + gc("width", node) +
                     gc("borderRightWidth", node) + gc("paddingRight", node) +
                     gc("marginRight", node);
            sz[1] = gc("marginTop", node) + gc("paddingTop", node) +
                     gc("borderTopWidth", node) + gc("height", node) +
                     gc("borderBottomWidth", node) + gc("paddingBottom", node) +
                     gc("marginBottom", node);
            return sz;
        }
    });
    
    Y.ClipBoard = ClipBoard;
    


}, 'gallery-2011.09.14-20-40' ,{requires:['node', 'plugin', 'substitute'], skinnable:false});
