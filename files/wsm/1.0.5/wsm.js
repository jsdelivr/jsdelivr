/**
 * @constructor
 * @description     this constructor handle all the websocket connection. 
 *                  it can be used for both front end and backend.
 *                  it constructor will listen to the websocket on close event, and reconnect itself until the server is backed.
 *                  this is more efficient than setInterval & check its readyState.
 *                  websocket manager is also listening to the on message event and process the message according to its handler.
 *                  handlers are registered in advance, they are objects. The type will be key, and function will be the value.
 * @module          WebsocketManager
 * @access          public
 * @param {function}  reconnect the websocket and add the handlers again.
 * @param {Object}  server: the configuration needed to setup the websocket connectin in nodejs. (should attach to the http/https server)
 * @example         
 *                 //on nodejs
 *                 var WSM = require('wsm')
 *                 var wsm = new WSM(function(){},  {server:server} ); //attach the http/https server
 *
 *                 //on browser
 *                      //on index.html
 *                          <script src="js/wsm.js"></script>
 *                      //on main.js or in between <script></script> on index.html
 *                          var wsm = new WSM(function(wsm){wsm.send('any','just say hai!')});
 * @author          Jeff Tham <Jeff.Tham@email.com>
 */

WSM = function(argment1, argment2){

    var self = this;

    //allow dynamic position for arguments
    var reactive = function(wsm){/*console.log('reactive function is not set.');*/};
    var options;
    var args = Array.prototype.slice.call(arguments); 
    if(args.length === 0){
        //do nothing to save time & processing power
    }else if(args.length >2){
        console.error('WSM only takes TWO arguments');
    }else{
        //assign arguments
        args.forEach(function(elem){
            if(typeof elem === 'function'){
                reactive = elem;
            }else if(!options && elem != null && typeof elem === 'object'   ){
                options = elem;
            }

        })

    }

    //a key-value object, type as key, function/callback as value.
    var handlers = {};

    //the websocket server
    this.wss;

    //the open websocket
    this.ws;

    //broadcast to all connected clients (only server can called)
    this.broadcast = function(type,content){if(isNode){console.log('server never got any client yet.')}else{console.log('client is not able to broadcast.')} } //this function will build correct at following line.

    //check the running environment
    if(isNode){
        //on nodejs
            if(typeof options !== 'object'){console.error('WSM does not receive enough info to build. Either "{server:server}" or "{port:8080}" should pass as an argument.');}

            //load the websocket node module
            var ws = require('ws');

            self.wss =  new ws.Server(options);

            if(self.wss){console.log('create a WebSocket server.');}

            self.wss.on('connection', function connection(ws) {

                console.log(ws._socket.remoteAddress +' connected through websocket at '+ new Date().toLocaleString('en-us',{timeZone:'America/New_York'})  );

                //attach the websocket
                self.ws = ws;

                //run the callback
                reactive(self);

              //var url = require('url');
              //var location = url.parse(ws.upgradeReq.url, true);
              // you might use location.query.access_token to authenticate or share sessions 
              // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
             
              self.ws.on('message', function incoming(message) {
                //console.log(message);

                self.processMessage(JSON.parse(message));
              });

              //send an intial message to browser and prove that the connection is built.
              self.send('connected','WSM: Server confirms websocket connection.');

                /**
                 * @function        broadcast
                 * @description     send a broadcast message to all connected websockets. (one way direction, from server to browser)
                 *                  this fuction wrap the type and the content/message together in JSON.stringify format
                 *                  and send the data to all active/connected clients.
                 * @access          public
                 * @param {string}  type - it will show as message.type on the other end.
                 * @param {*}       content - it will show as message.content on ther other end
                 * @example         wsm.broadcast('any','a broadcast message')
                 * @author          Jeff Tham <Jeff.Tham@email.com>
                 */
                self.broadcast = function(type,content){
                    var data = {};
                    data.type = type;
                    data.content = content;

                    if(self.wss.clients.length > 0){
                        //at least one client is visting the webpage
                        self.wss.clients.forEach(function(websocket){
                            websocket.send(JSON.stringify(data));
                        });
                    }
                }

                //assign wsm.broadcast tot wsm.wss.broadcast
                self.wss.broadcast = self.broadcast;

            });

    }else{
        //on browser
        
        /**
         * wrap browser's websocket connection into one function, if the connection drop or close, try to reconnect itself.
         */
        function wsConnect(){

            var typeOfConnection;

            if (location.protocol === 'https:'){
                typeOfConnection = 'wss';
             }else{
                typeOfConnection = 'ws'
             }

            self.ws = new WebSocket(typeOfConnection+'://'+location.hostname+':'+location.port);
 
            self.ws.onopen = function(event) {

                //send an intial message to server and prove that the connection is built.
                self.send('connected','WSM: Browser confirms websocket connection.')
              
              reactive(self);

            };
             
            self.ws.onmessage = function(event) {
              // flags.binary will be set if a binary data is received. 
              // flags.masked will be set if the data was masked. 
              //console.log(event.data);

              self.processMessage(JSON.parse(event.data));
            };

            self.ws.onclose = function(event){

                wsConnect();
            }   
        }

        //call wsConnect to build websocket for browser
        wsConnect();
    }


    /**
     * @function            addHandler
     * @description         this function add the handler for the websocket manager
     * @access              public
     * @param {string}      type - the type that websocket manager care about.
     * @param {function}    cb - a callback function that run for the type, the parse message is the only parameter.
     * @example             wsm.addHandler('welcome',function(message){console.log(message.content)})
     * @author              Jeff Tham <Jeff.Tham@email.com>
     */
    
    this.addHandler = function(type,cb){
        handlers[type] = cb;
    }

    /**
     * @function            deleteHandler
     * @description         this function delete the handler for the websocket manager
     * @access              public
     * @param {string}      type - the type that websocket manager care about.
     * @return {boolean}    true means deleted the specific handler, false means fail.
     * @example             wsm.deleteHandler('connected');
     * @author              Jeff Tham <Jeff.Tham@email.com>
     */
    
    this.deleteHandler = function(type){

        if(typeof handlers[type] !== 'undefined'){
            delete handlers[type];
            return true;
        }else{
            return false;
        }

    }

    /**
     * @function            handlerList
     * @description         this function show all added handlers for the websocket manager
     * @access              public
     * @param {string}      type - the type that websocket manager care about.
     * @return {array}      handlers - an array of added handlers       
     * @example             var handlerList = wsm.handlerList();
     * @author              Jeff Tham <Jeff.Tham@email.com>
     */
    
    this.handlerList = function(){

        return Object.keys(handlers);
    
    }

    /**
     * @function        processMessage
     * @description     this function helps the on message event listener to process message.
     *                  it will look at the handlers and call the callback function that added previously.
     * @access          public
     * @param {object} message - the parse message receive from server or browser
     * @author          Jeff Tham <Jeff.Tham@email.com>
     */
    
    this.processMessage = function(message){

        handlers[message.type](message);

    }

    /**
     * @function        send
     * @description     this fuction wrap the type and the content/message together in JSON.stringify format
     *                  and call the websocket send function to send the data to the other end.
     * @access          public
     * @param {string}  type - it will show as message.type on the other end.
     * @param {*}       content - it will show as message.content on ther other end
     * @example         wsm.send('any','just say hello.')
     * @author          Jeff Tham <Jeff.Tham@email.com>
     */
    
    this.send = function(type,content){
        var data = {};
        data.type = type;
        data.content = content;
        self.ws.send(JSON.stringify(data));
    }

    //added a handler for both server or browser side.
    this.addHandler('connected',function(message){console.log(message.content)});

    //added a handler to process arbitrary data, just for testing
    this.addHandler('any',function(message){console.log(message.content)});

}


/**
 * check the running environment.
 * isNode = true   ====> running on nodejs / server
 * isNode = false  ====> running on browser / client
 * @see  {@link https://github.com/MatthewNPM/is-node }  under MIT License
 * @type {Boolean}
 */
var isNode=!!(typeof process !== 'undefined' && process.versions && process.versions.node);

if(isNode) {

    module.exports = WSM;

}
