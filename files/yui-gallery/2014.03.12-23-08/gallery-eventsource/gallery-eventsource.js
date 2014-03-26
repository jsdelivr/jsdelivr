YUI.add('gallery-eventsource', function(Y) {


/*global EventSource*/

    var useNative = typeof EventSource != "undefined",
        prototype,
        basePrototype,
        RETRY_MS = 500;

    function YUIEventSource(url){
    
        Y.Event.Target.call(this);
    
        /**
         * The URL or the server-sent events.
         * @type String
         * @property url
         */
        this.url = url;    
    
        /**
         * The current state of the object. Possible values are 0 for connecting,
         * 1 for connected, and 2 for disconnected.
         * @type int
         * @property readyState
         */
        this.readyState = 0;
        
        /**
         * Object used to communicate with the server. May be an XHR or an
         * EventSource.
         * @type XMLHttpRequest|EventSource
         * @property _transport
         * @private
         */
        this._transport = null;
        
        //initialize the object
        this._init();
    
    }
    
    //methods that are necessary regardless of native vs. non-native
    basePrototype = {
    
        /**
         * Fires the error event. When this happens, the readyState
         * must first be set to 2 so that error handlers querying
         * this value receive the correct value.
         * @return {void}
         * @method _fireErrorEvent
         * @private
         */
        _fireErrorEvent: function(){  
            Y.later(0, this, function(){
                this.readyState = 2;
                this.fire({type:"error"});
            });
        },
        
        /**
         * Fires the open event. When this happens, the readyState
         * must first be set to 1 so that event listeners querying
         * this value receive the correct value.
         * @return {void}
         * @method _fireOpenEvent
         * @private
         */
        _fireOpenEvent: function(){
            //only fire is there wasn't already an error
            if (this.readyState < 2){
                Y.later(0, this, function(){
                    this.readyState = 1;
                    this.fire({type:"open"});
                });        
            }
        },
        
        /**
         * Fires a message event. This might be either an event of
         * type message or a custom event as received from the event
         * stream. 
         * @param {Object} data An object containing the keys
         *      type, data, lastEventId, and origin.
         * @return {void}
         * @method _fireMessageEvent
         * @private
         */
        _fireMessageEvent: function(data){
            Y.later(0, this, function(){
                this.fire(data);
            });        
        }
        
    
    };
    
    
    //use native if available
    if (useNative){
        prototype = {
            
            _init: function(){
            
                //any number of things could go wrong in here
                try {
                    var src = new EventSource(this.url),
                        that = this;
                        
                    /**
                     * Map the common EventSource events to custom
                     * YUI events. These are delayed with a timer
                     * to avoid race conditions and provide consistency
                     * between the native EventSource usage and the
                     * XHR-based event source events.
                     */
                    src.onopen = 
                        src.onmessage =   
                        src.onerror = Y.bind(function(event){                    
                            switch(event.type){
                                case "open":
                                    this._fireOpenEvent();
                                    break;
                                case "message":
                                    this._fireMessageEvent({
                                        type:   "message",
                                        data:   event.data,
                                        lastEventId:    event.lastEventId,
                                        origin: event.origin
                                    });
                                    break;
                                case "error":
                                    this._fireErrorEvent();
                                    break;              
                                //no default
                            }                    
                        }, this);
                    
                    this._transport = src;
                } catch (ex){    
                    this._fireErrorEvent();
                }          
            },
            
            close: function(){
                //can be null if error occurs during _init
                if (this._transport != null){
                    this._transport.close();
                }
                this.readyState = 2;
            },
            
            /*
             * Must override attach for custom server-sent events. Since
             * there's no catchall for all server-sent events, must assign
             * event handlers directly to the EventSource object.
             */
            on: function( type , fn , el , context , args){
                var that = this;
                if (type != "message" && type != "error" && type != "open"){
                    this._transport.addEventListener(type, function(event){
                        that._fireMessageEvent({
                            type:   event.type,
                            data:   event.data,
                            origin: event.origin,
                            lastEventId:    event.lastEventId
                        });
                    }, false);
                }
                
                //call superclass method
                Y.Event.Target.prototype.on.apply(this, arguments);
            }
            
            //TODO: Need detach override too?

        };
    
    } else {
    
        prototype = {
            
            /**
             * Initializes the EventSource object. Either creates an EventSource
             * instance or an XHR to mimic the functionality.
             * @method _init
             * @return {void}
             * @private
             */
            _init: function(){
                    
                /**
                 * Keeps track of where in the response buffer to start
                 * evaluating new data. Only used when native EventSource
                 * is not available.
                 * @type int
                 * @property _lastIndex
                 * @private
                 */
                this._lastIndex = 0;
                
                /**
                 * Keeps track of the last event ID received from the server.
                 * Only used when native EventSource is not available.
                 * @type variant
                 * @property _lastEventId
                 * @private
                 */
                this._lastEventId = null;
                
                /**
                 * Tracks the last piece of data from the messages stream.
                 * @type String
                 * @property _data
                 * @private
                 */
                this._data = "";
                
                /**
                 * Tracks the last event name in the message stream.
                 * @type String
                 * @property _eventName
                 * @private
                 */
                this._eventName = "";                                             

                
                var src,
                    that = this;
             
                //close() might have been called before this executes
                if (this.readyState != 2){
                        
                    //use appropriate XHR object as transport
                    if (typeof XMLHttpRequest != "undefined"){ //most browsers
                        src = new XMLHttpRequest();
                    } else if (typeof ActiveXObject != "undefined"){    //IE6
                        src = new ActiveXObject("MSXML2.XMLHttp");
                    } else {
                        throw new Error("Server-sent events unavailable.");
                    }
                    
                    src.open("get", this.url, true);
                    
                    /*
                     * If there was a last event ID, add the special
                     * Last-Event-ID header to the request.
                     */
                    if (this._lastEventId){
                        src.setRequestHeader("Last-Event-ID", this._lastEventId);
                        //TODO: Need to reset _lastEventId? Pending WHAT-WG clarification
                    }
                    
                    /*
                     * Internet Explorer can't deal with streaming data. Send
                     * an extra HTTP header letting the serve know that polling
                     * is really the only option for this browser. Servers can
                     * use this to make sure streaming data isn't sent to IE.
                     */
                    if (Y.UA.ie){
                        src.setRequestHeader("X-YUIEventSource-PollOnly", "1");
                    }
                    
                    
                    src.onreadystatechange = function(){
                    
                        /*
                         * IE will not have multiple readyState 3 calls, so
                         * those will go to readyState 4 and effectively become
                         * long-polling requests. All others will have a hanging
                         * GET request that receives continual information over
                         * the same connection.
                         */
                        if (src.readyState == 3 && Y.UA.ie === 0){
                        
                            //verify that the HTTP content type is correct, if not, error out
                            if (src.getResponseHeader("Content-type") != "text/event-stream"){
                                that.close();
                                that._fireErrorEvent();
                            } else {
                                that._signalOpen();                                                        
                                that._processIncomingData(src.responseText);
                            }                        
                            
                        } else if (src.readyState == 4 && that.readyState < 2){
                        
                            //IE6-8 won't have fired the open event yet, so check
                            that._signalOpen();
                            
                            //there might be one more event queued up to be fired
                            that._fireMessageEvent();
                            
                            //check for any additional data
                            that._validateResponse();
                        }
                    };
                                       
                    /*
                     * Save the instance to a property. This must happen before
                     * the call to send() because fast responses may cause
                     * onreadystatechange to fire before the next line after
                     * send().
                     */
                    this._transport = src;                                            
                    src.send(null);                        
                }

            },            
                
            /**
             * Called when XHR readyState 4 occurs. Processes the response,
             * then reopens the connection to the server unless close()
             * has been called.
             * @method _validateResponse
             * @return {void}
             * @private
             */
            _validateResponse: function(){
                var src = this._transport;
                try {
                    if (src.status >= 200 && src.status < 300){
                        this._processIncomingData(src.responseText);
                        
                        //readyState will be 2 if close() was called
                        if (this.readyState != 2){
                        
                            //cleanup event handler to prevent memory leaks in IE
                            this._transport.onreadystatechange = function(){};
                            
                            //now start it
                            Y.later(RETRY_MS, this, this._init);
                        }
                    } else {
                        throw new Error(); //fastest way to fire error event
                    }
                } catch (ex){
                    this._fireErrorEvent();
                }
                
                //prevent memory leaks due to closure
                src = null;
            },
            
            /**
             * Updates the readyState property to 1 if it's still
             * set at 0 and fires the open event.
             * @method _signalOpen
             * @return {void}
             * @private
             */
            _signalOpen: function(){
                if (this.readyState == 0){
                    this._fireOpenEvent();
                }
            },
            
            /**
             * Responsible for parsing and interpreting a line of data
             * in the event stream source.
             * @param {String} name The field name of the line.
             * @param {Variant} value The field value of the line.
             * @param {Boolean} secondPass (Optional) Indicates that this
             *      is the second time the function was called for this
             *      line. Needed to prevent infinite recursion.
             * @method _processDataLine
             * @return {void}
             * @private
             */
            _processDataLine: function(name, value, secondPass){
            
                var tempData;
            
                //shift off the first item to check the value
                //keep in mind that "data: a:b" is a valid value
                switch(name){
                
                    //format is "data: value"
                    case "data":
                        tempData = value + "\n";
                        if (tempData.charAt(0) == " "){
                            tempData = tempData.substring(1);
                        }
                        this._data += tempData;
                        break;
                        
                    //format is "event: eventName"
                    case "event":
                        this._eventName = value.replace(/^\s+|\s+$/g, "");  //trim
                        break;
                        
                    //format is ":some comment"
                    case "":
                        //do nothing, this is a comment
                        break;
                        
                    //format is "id: foo"
                    case "id":
                        this._lastEventId = value;
                        break;
                        
                    //format is "retry: 10"
                    case "retry":
                    
                        //TODO: Need clarification from WHAT-WG
                        
                        break;
                        
                    //format is "foo bar"
                    default:
                    
                        if (!secondPass){
                            /*
                             * When there is no colon, but the line isn't blank,
                             * the entire line is considered the field name
                             * and the field value is considered to be the empty
                             * string. This means the line must be processed again
                             * if it reaches this point.
                             */
                            this._processDataLine(name, "", true);                                                
                        }
                }            
            
            },
            
            /**
             * Processes the data stream as server-sent events. Goes line by
             * line looking for event information and fires the message
             * event where appropriate.
             * @param {String} text The text to parse.
             * @return {void}
             * @private
             * @method _processIncomingData
             */
            _processIncomingData: function(text){
            
                //get only the newest data, ignore the rest
                text = text.substring(this._lastIndex);                
                this._lastIndex += text.length;
                
                var lines = text.split("\n"),
                    parts,
                    i = 0,
                    len = lines.length,
                    tempData;
                    
                while (i < len){
                    
                    if (lines[i].indexOf(":") > -1){
                    
                        parts = lines[i].split(":");
                        
                        this._processDataLine(parts.shift(), parts.join(":"));                                               
                    
                    } else if (lines[i].replace(/\s/g, "") == ""){
                        /*
                         * An empty lines means to flush the event buffers
                         * and fire message event.
                         */                    
                        this._fireMessageEvent();
                    
                    }
                
                    i++;
                }
                
                /*
                 * Internet Explorer 8 sometimes cuts off the last empty line
                 * in a sequence. In that case, the call to _fireMessageEvent()
                 * isn't made even though there's a new message to broadcast.
                 * Since _fireMessageEvent() always checks to see if there's
                 * more message data before firing, it's safe to call again.
                 */
                this._fireMessageEvent();
                
            },
            
            /**
             * Fires the message event with appropriate data, but only if
             * there is actual data to share. This uses the stored
             * event name and data value to fire the appropriate event.
             * @return {void}
             * @method _fireMessageEvent
             * @private
             */
            _fireMessageEvent: function(){
                var eventName = "message",
                    eventData,
                    lastEventId;
            
                if (this._data != ""){
                
                    //per spec, strip off last newline
                    if (this._data.charAt(this._data.length-1) == "\n"){
                        this._data = this._data.substring(0,this._data.length-1);
                    }
                
                    if (this._eventName.replace(/^\s+|\s+$/g, "") != ""){
                        eventName = this._eventName;
                    }
                
                    //create copies of data
                    eventData = this._data;
                    lastEventId = this._lastEventId;
                
                    //an empty line means a message is complete
                    //TODO: Add origin property
                    Y.later(0, this, function(){
                        this.fire({type: eventName, data: eventData, lastEventId: lastEventId});
                    });
                                            
                    //clear the existing data
                    this._data = "";
                    this._eventName = "";                    
                }            
            },
            
            /**
             * Permanently close the connection with the server.
             * @method close
             * @return {void}
             */
            close: function(){
                if (this.readyState != 2){
                    this.readyState = 2;
                    
                    /*
                     * It's possible that close() was called before the timeout
                     * set in _init() has executed. In that case, this._transport
                     * is still null.
                     */
                    if (this._transport){
                        this._transport.abort();
                    }
                }
            }

        };    
    
    }
    
    //inherit from Event.Target to get events, and assign instance methods
    Y.extend(YUIEventSource, Y.Event.Target, Y.merge(basePrototype, prototype));

    //publish to Y object
    Y.EventSource = YUIEventSource;


}, 'gallery-2010.11.17-21-32' ,{requires:['event-base','event-custom']});
