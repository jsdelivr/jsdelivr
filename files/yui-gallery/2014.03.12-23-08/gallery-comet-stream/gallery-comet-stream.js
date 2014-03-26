YUI.add('gallery-comet-stream', function(Y) {

/*
 * Provides Server Streaming client functionality.
 * Currently, it supports XHR streaming and forever iframe streaming.
 *
 * @module gallery-comet-stream
 */

/*
 * readyState possible value.
 * http://www.quirksmode.org/blog/archives/2005/09/xmlhttp_notes_r_2.html
 */
var READY_STATE = {

    UNINITIALIZED: 0,  // open() has not been called yet.

    LOADING: 1,  // send() has not been called yet.

    LOADED: 2,  // send() has been called, headers and status are available.

    INTERACTIVE: 3,  // Downloading, responseText holds the partial data.

    COMPLETED: 4 // Finished with all operations.
},

E_START = 'start',

E_FAIL = 'fail',

E_PUSHED = 'pushed',

E_RECONNECT = 'reconnect',

E_INVALID_FORMAT= 'invalidFormat';

/**
 * @class CometStream
 * @description CometStream class
 * @constructor
 * @extends EventTarget
 * @param cfg {Object} configuration object
 */
function CometStream(cfg) {
    CometStream.superclass.constructor.apply(this, arguments);

    /**
     * @event start
     * @description This event is fired when stream is started.
     * @type Event Custom
     */
    this.publish(E_START, {
        emitFacade: true
    });

    /**
     * @event fail
     * @description This event is fired when stream fails to be connected.
     * @type Event Custom
     */
    this.publish(E_FAIL, {
        fireOnce: true,
        emitFacade: true
    });

    /**
     * @event pushed
     * @description This event is fired when message is pushed in the stream.
     * @type Event Custom
     */
    this.publish(E_PUSHED, {
        emitFacade: true
    });

    /**
     * @event reconnect
     * @description This event is fired when stream connection is reconnected.
     * @type Event Custom
     */
    this.publish(E_RECONNECT, {
        emitFacade: true
    });

    /**
     * @event invalidFormat
     * @description This event is fired when server pushed message violate message format.
     * @type Event Custom
     */
    this.publish(E_INVALID_FORMAT, {
        emitFacade: true
    });
}

CometStream.NAME = 'cometStream';

CometStream.ATTRS = {
    /**
     * Stream URL
     *
     * @attribute url
     * @type String
     */
    url: {
    },

    /**
     * Timeout to create stream connection in milliseconds
     *
     * @attribute connectTimeout
     * @default 20000
     * @type Number
     */
    connectTimeout: {
        value: 20 * 1000
    },

    /**
     * Stream connection is reset every given seconds to avoid memory leak.
     *
     * @attribute resetTimeout
     * @default 20000
     * @type Number
     */
    resetTimeout: {
        value: 300 * 1000
    },

    /**
     * Whether to retry on HTTP dis-connected.
     *
     * @attribute resetTimeout
     * @default true
     * @type Boolean
     */
     retryOnDisconnect: {
         value: true
     },

     /*
      * XHR polling internal(milliseconds) for Opera
      *
      * @attribute operaXhrPollingInterval
      * @default 50
      * @type Number
      */
     operaXhrPollingInterval: {
         value: 50
     }
};

CometStream.prototype = {

    /**
     * @method start
     * @description start this stream.
     */
    start: function() {
        this._initStream();
    },

    /**
     * @method close
     * @description close this stream.
     */
    close: function() {
        this._endStream();
        this._closed = true;
    },

    _initStream: function() {
        var xhr,
            that = this;

        /*
         * Last pushed data index which is to track newly pushed data start point.
         */
        this._lastMsgIdx = 0;

        if (Y.UA.ie) {
            this._createIFrame(this.get('url'), Y.bind(this._onPushedMsgFromIFrame, this));
        } else {
            xhr = this.xhr = this._createXHR();

            xhr.onreadystatechange = function() {
                that._onXhrStreamStateChange();
            };

            xhr.open('GET', this.get('url'), true);

            xhr.send();
        }

        this._failTimer = Y.later(this.get('connectTimeout'), this, this._failTimeout, null);
        this._streamStartTime = new Date();

        Y.later(this.get('resetTimeout'), this, this._reconnect);

        this._fireStartEvent();
    },

    _failTimeout: function() {
        this.fire(E_FAIL);
        this._failTimer = null;
        this._endStream();
    },

    _succeedToConnect: function() {
        if (this._failTimer) {
            this._failTimer.cancel();
        }
    },

    _endStream: function() {
        if (this.transDoc) {
            this.iframeDiv.innerHTML = '';
            this.transDoc = null; // Let it be GC-ed
        }

        if (this._pollHandler) {
            this._pollHandler.cancel();
        }

        if (this.xhr) {
            var xhr = this.xhr;
            this.xhr = null;
            xhr.onreadystatechange = null;
            xhr.abort();
        }
    },

    _pollResponse: function() {
        this._parseResponse(this.xhr.responseText);
    },

    _onXhrStreamStateChange: function() {
        var xhr = this.xhr,
            status;
        if (!xhr) {
            return;
        }

        if (xhr.readyState < READY_STATE.INTERACTIVE) {
            //Opera throw exception if we check xhr.status when readyState < INTERACTIVE
            return;
        }

        status = xhr.status;

        if (status === 200) {
            if (xhr.readyState === READY_STATE.INTERACTIVE) {
                // For Opera, it doesn't trigger INTERACTIVE ready state for each pushed data. So, we have to do polling.
                //
                if (Y.UA.opera) {
                    this._pollHandler = Y.later(this.get('operaXhrPollingInterval'), this, this._pollResponse, null, true);
                } else {
                    this._parseResponse(xhr.responseText);
                }
            } else if (xhr.readyState === READY_STATE.COMPLETED) {
                if (Y.UA.opera) {
                    // poll it for the last time in case something is missing.
                    this._pollResponse();
                }

                if (this.get('retryOnDisconnect')) {
                    this._reconnect();
                }
            }
        } else {
            this.fire(E_FAIL);
        }
    },

    _fireStartEvent: function() {
        this.fire(E_START);
    },

    _reconnect: function() {
        this._endStream();

        if (!this._closed) {
            this.fire(E_RECONNECT);
            this._initStream();
        }
    },

    _parseResponse: function(responseText) {
        this._succeedToConnect();

        // Browser doesn't expose chunked structure to us. So, we have to build chunked data based on HTTP trunked data.
        while (true) {
            var msg, msgStartPos, msgEndPos,
                sizeStartPos, sizeEndPos, sizeLine, size;

            sizeStartPos = this._lastMsgIdx;
            sizeEndPos = responseText.indexOf('\r\n', sizeStartPos);
            if (sizeEndPos == -1) {
                break;
            }
            sizeLine = responseText.substring(sizeStartPos, sizeEndPos);
            size = Number('0x' + Y.Lang.trim(sizeLine));

            if (window.isNaN(size)) {
                this.fire(E_INVALID_FORMAT);
                this._endStream();
                return;
            }

            msgStartPos = sizeEndPos + 2; //pass '\r\n'
            msgEndPos = msgStartPos + size;

            if (msgEndPos > responseText.length) {
                // this chunk doesn't get completed yet.
                break;
            }

            this._lastMsgIdx = msgEndPos + 2; // pass '\r\n'
            msg = responseText.substr(msgStartPos, size);

            this._fireMessageEvent(msg);
        }
    },

    _onPushedMsgFromIFrame: function(msg) {
        // iframe channel should pushed down some message on connection success so that client knows the channel is alive. 
        this._succeedToConnect();

        this._fireMessageEvent(msg);
    },

    _fireMessageEvent: function(msg) {
        this.fire(E_PUSHED, {data: msg});
    },

    _createIFrame: function(url, callback) {
        var m;

        // Don't let transDoc be GC-ed.
        this.transDoc = new window.ActiveXObject('htmlfile');
        this.transDoc.open();

        // Don't assign domain if same. It will break in IE8.
        //
        m = url.match(/^http.?:\/\/([^\/]+)\/?/);
        if (m && (m[1] !== window.document.domain)) {
            this.transDoc.write('<html><script type="text/javascript">document.domain="' + window.document.domain + '";</script></html>');
        }
        this.transDoc.write('<html></html>');
        this.transDoc.close();

        // TODO:
        // This makes only one instance of CometStream instance allwoed in in one page. Otherwise multiple iframe channel will conflicts
        // in callback. Perhaps we can specify callback method or channel id name in iframe URL query string.
        //
        this.transDoc.parentWindow.push = callback;

        this.iframeDiv = this.transDoc.createElement('div');
        this.transDoc.body.appendChild(this.iframeDiv);
        this.iframeDiv.innerHTML = '<iframe src="' + url + '"></iframe>';
    },

    _createXHR: function() {
        var xhrObj = null;

        // most browsers (including IE7) just use below 2 lines
        if (window.XMLHttpRequest) {
            xhrObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE5/6 falls into this block
            //
            // NOTE: Actually, we cannot implement comet with IE XHR since it doesn't trigger readyState===INTERACTIVE state in progress.
            // I keep below code for Long-Poll(perhaps in the future)
            /*
            try {
                xhrObj = new window.ActiveXObject('Msxml2.XMLHTTP');
            } catch (e1) {
                try {
                    xhrObj = new window.ActiveXObject('Microsoft.XMLHTTP');
                } catch (e2) {
                    xhrObj = null;
                }
            }
            */
        }
        if (!xhrObj) {
            throw new Error('XMLHttpRequest is not supported');
        }
        return xhrObj;
    }
};

Y.extend(CometStream, Y.Base, CometStream.prototype);

Y.CometStream = CometStream;


}, 'gallery-2011.02.23-19-01' ,{requires:['base']});
