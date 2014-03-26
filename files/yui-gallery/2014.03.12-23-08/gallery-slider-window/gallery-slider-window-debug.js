YUI.add('gallery-slider-window', function(Y) {

    var SIZE_HEADERHIGHT = 21,
        SIZE_FOOTERHIGHT = 12,
        SIZE_HANDLEWIDTH = 5,
        SIZE_MAX_WIDTH = 700,
        SIZE_MAX_HEIGHT = 500,
        SIZE_OPENWIDTH = 400,
        SIZE_HEIGHT = 287,
        TIME_DURATION = 0.5,
        CSS_BODYCONT = 'bdc',
        CSS_HEADERCONT = 'hdc',
        CSS_BACKGROUND_POSITION_X = 'background-position-x',
        PX = 'px',
        POUND = '#',
        CLASS_HANDLE_TARGET = 'handle-target',
        CLASS_CONTAINER_CLOSE = 'container-close',
        CREDIT_CONT = '<a href="http://www.eaktion.com/sliderwindow/" target="_BLANK" id="sliderwindow_lnk">SliderWindow</a>',
        Easing = Y.Easing,
        CONTENT_EL_ID = 'ea_swbdc',
        ANIM,
        footerConfig,
        isCtrl,
        resizeConfig,
        TRUE = true,
        FALSE = false,
        STOP = TRUE,
        STR_STOP = 'stop',
        STR_PUBLISH ='publish',
        STR_OPENWIDTH = 'openWidth',
        STR_HEIGHT = 'height',
        STR_SRCNODE = 'srcNode',
        STR_HANDLEWIDTH = 'handleWidth',
        STR_CLASSNAME = 'className',
        STR_REVERSE = 'reverse',
        STR_SUFFIX_SEP = '-',
        OBJ_PUBLISHED_EVENTS = {};

    /* class constructor */
    function SliderWindow(config) {
        SliderWindow.superclass.constructor.apply(this, arguments);
    }

    /* 
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case). 
     */
    SliderWindow.NAME = "sliderWindow";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
    SliderWindow.ATTRS = {

            openWidth : {
                value: SIZE_OPENWIDTH
            },
            
            headerCWidth : {
                value: SIZE_OPENWIDTH - SIZE_HEADERHIGHT
            },

            height : {
                value: SIZE_HEIGHT,
                setter: '_setHeight'
            },
            
            srcWidth : {
                setter: '_setSrcWidth'
            },
            
            headerHeight : {
                value: SIZE_HEADERHIGHT
            },
            
            footerHeight : {
                value: SIZE_FOOTERHIGHT
            },

            resizing : {
                value: FALSE,
                setter: '_setResizing',
                lazyAdd: FALSE
            },
            
            closeTitle : {
                value: "Click to close/open or ctrl-left/right arrow to close/open"
            },
                
            handleWidth : {
                value: SIZE_HANDLEWIDTH
            },
               
            className : {
                value: 'eaSliderWindow'
            },
            
            credit : {
                value: TRUE
            },
            
            bodyContent : {
                value: '',
                setter: '_setBodyContent'
            },
            
            withFocus : {
                setter: '_setWithFocus',
                validator: function(val){
                    return this.get('isClosed') && Y.one(val);
                }
            },
            
            isOpen : {
                value: false,
                readOnly: true
            },
            
            isClosed : {
               value: true,
               readOnly: true
            }
            
        };

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
    SliderWindow.CLOSE_HANDLE = '<div class="' + CLASS_CONTAINER_CLOSE + '" title="{title}"></div><div id ="ea_swht" style="' + STR_HEIGHT + ':{closeHandleHeight}px;top:{headerHeight}px;" class="' + CLASS_HANDLE_TARGET + '" title=""></div>';
    //setting padding-left to headerHeight quick way to avoid showing the text on the bg image when sw is closed
    SliderWindow.CREDIT = '<div style="padding-left:{headerHeight}px;overflow-x:hidden;overflow-y:hidden;width:50%;top:0px;text-align:left;' + STR_HEIGHT + ': {footerHeight}px;font-size: 0.5em;font-family: Arial">{creditCont}</div>';
    SliderWindow.HEADER_CONTENT = '<div id="ea_swhdc" class="{cssHeaderCont}"></div>';
    SliderWindow.BODY_CONTENT = '<div id="' + CONTENT_EL_ID + '" class="{cssBodyCont}">{userContent}</div>';

    /* SliderWindow extends the base Widget class */
    Y.extend(SliderWindow, Y.Overlay, {

        initializer: function() {
            /*
             * initializer is part of the lifecycle introduced by 
             * the Base class. It is invoked during construction,
             * and can be used to setup instance specific state or publish events which
             * require special configuration (if they don't need custom configuration, 
             * events are published lazily only if there are subscribers).
             *
             * It does not need to invoke the superclass initializer. 
             * init() will call initializer() for all classes in the hierarchy.
             */            
        },

        renderUI : function() {
            /*
             * renderUI is part of the lifecycle introduced by the
             * Widget class. Widget's renderer method invokes:
             *
             *     renderUI()
             *     bindUI()
             *     syncUI()
             *
             * renderUI is intended to be used by the Widget subclass
             * to create or insert new elements into the DOM. 
             */
            this.slider = Y.one(POUND + this.get("id"));
            ANIM = new Y.Anim({
                                            node: this.get(STR_SRCNODE),
                                            to: {
                                                width: this.get(STR_HANDLEWIDTH)
                                            },
                                            from: {
                                                width: this.get(STR_OPENWIDTH)
                                            }
                                });
 
            ANIM.set('duration', TIME_DURATION);
            ANIM.set('easing', Easing.easeIn);     
            
            //Append close icon, and handle click target
            var title = Y.UA.opera > 0 ? "Click to close/open or hit ctrl+shift-left/right arrow to close/open" : this.get("closeTitle"),
                //Append header container to header, give it a class name
                headerHeight = this.get("headerHeight"),            
                cssHeaderName = this.getClassName(CSS_HEADERCONT);
                
            this.get(STR_SRCNODE).append(Y.substitute(SliderWindow.CLOSE_HANDLE,
                                                    {title: title,
                                                    closeHandleHeight: 300,
                                                    headerHeight: headerHeight}
                                                    )
                                       );            
             
            this.set('headerContent',Y.substitute(SliderWindow.HEADER_CONTENT,
                                                    {cssHeaderCont: cssHeaderName}
                                                    )
                      );
            
            if(this.get('credit') === FALSE){
                CREDIT_CONT = '';
            }
            footerConfig = {footerHeight: this.get("footerHeight"),headerHeight: headerHeight, creditCont: CREDIT_CONT};
            this.set('footerContent',Y.substitute(SliderWindow.CREDIT,
                                                       footerConfig
                                                    )
                    );

                        
            this.contentElement = Y.one(POUND + CONTENT_EL_ID);
                
        },

        bindUI : function() {
            /*
             * bindUI is intended to be used by the Widget subclass 
             * to bind any event listeners which will drive the Widget UI.
             * 
             * It will generally bind event listeners for attribute change
             * events, to update the state of the rendered UI in response 
             * to attribute value changes, and also attach any DOM events,
             * to activate the UI.
             */
            Y.log("bindUI", 'info', SliderWindow.NAME);
            
            /*
             using Y.bind cause it seems like Y.on supports context in signature,
             node.delegate does too, but node.on does not
             */
            this.slider.on("click", Y.bind(function (e) {
                this._handleClick(e);
            }, this), ["." + CLASS_CONTAINER_CLOSE, "." + CLASS_HANDLE_TARGET]);
            
            this.after("openWidthChange", this._uiSetOpenWidth, this);
            this.after("widthChange", this._afterWidthChange, this);
            
            Y.on("keydown", this._handleArrow, "html", this);
             
            ANIM.on('end', this._handleEndBehaviour, this);
            
            if(resizeConfig){
                /*
                 contrain to maxWidth and maxHeight
                 due to images dimensions
                */
                var constrainConfig = {
                    maxWidth: resizeConfig.maxWidth,
                    maxHeight: resizeConfig.maxHeight
                };
                this.resize = new Y.Resize(resizeConfig)
                                        .plug(Y.Plugin.ResizeProxy)
                                        .plug(Y.Plugin.ResizeConstrained, constrainConfig);
                /*
                 after each proxy resize, refresh sw dimensions
                 Use 'after' event not 'on', to avoid _repositionSlider
                 and _removeWidthStyle conflicting with resizing
                */
                
                this.resize.after('resize:end',function(ev){
                    Y.log("resize:end", 'info', SliderWindow.NAME);
                    var newHeight = ev.details[0].info.offsetHeight;
                    this.set(STR_HEIGHT, newHeight);                   
                    this.set('srcWidth', ev.details[0].info.offsetWidth);
                    Y.log("resize:end invoking _respositionSlider", 'info', SliderWindow.NAME);
                    Y.bind(this._repositionSlider(), this);
                    /*
                     Apparently the resize utility (or maybe Anim) does add a width to
                     the boundingBox after resizing.
                     This prevents the handlers to follow the srcNode back to dock
                     position when the sw closes. Removing the width property fixes the issue
                    */
                    this._removeWidthStyle();
                
                },this);
            }            
        },

        syncUI : function() {
            /*
             * syncUI is intended to be used by the Widget subclass to
             * update the UI to reflect the initial state of the widget,
             * after renderUI. From there, the event listeners we bound above
             * will take over.
             */
            
            /*
             get width and height and render the widget.
             That is:
                set yui3-sliderwindow yui3-sliderwindow-content to width
                set .yui3-sliderwindow .yui3-sliderwindow-content .yui3-widget-bd to
                    height = (userHeight - headerHeight - footerHeight)
                    
                    We need a default headerHeight and footerHeight
             
            */
             //     uiSetAttrA methods are called automatically by widget class for default attributes 
            //      this._uiSetWidth(w);
            //      this._uiSetHeight(h - hh - fh);
            this._uiSetHandleWidth();
            this._uiSetOpenWidth();
            this._repositionSlider();
        },

        // Beyond this point is the MyWidget specific application and rendering logic
        
                
        _setResizing : function (val) {
            Y.log("_setResizing", 'info', SliderWindow.NAME);
            if(val){
            resizeConfig = {
                node: POUND + this.get('id'),
                handles: ['t', 'tr'],
                maxWidth: SIZE_MAX_WIDTH,
                maxHeight: SIZE_MAX_HEIGHT
                };
            }
            return val;
        },
        /* Attribute state supporting methods (see attribute config above) */
        
        _uiSetOpenWidth : function () {
            Y.log("_uiSetOpenWidth", 'info', SliderWindow.NAME);
            var i_width = parseInt(this.get(STR_OPENWIDTH), 10);
            ANIM.set('from', {width: i_width});
        },
        
        _uiSetHandleWidth : function (val) {
            Y.log("_uiSetHandleWidth", 'info', SliderWindow.NAME);
            var i_width = parseInt(this.get(STR_HANDLEWIDTH), 10);
            this.get(STR_SRCNODE).setStyle('width', i_width + PX);
        },
        
        _setWithFocus : function (val) {
            Y.log("_setWithFocus: " +  Y.dump(val), 'info', SliderWindow.NAME);
            this.once("isOpenChange",function (e, val) {
                this._uiSetWithFocus(val);
            }, this, val);
           
        },
        
        _uiSetWithFocus : function (val) {
            Y.log("_uiSetWithFocus", 'info', SliderWindow.NAME);
         //   Y.one(val).getDOMNode().addClass('focused');
            Y.Node.getDOMNode(Y.one(val)).focus();
        },
        /* to do: change into _uiSetHeight */
        _setHeight : function (val) {
            Y.log("_setHeight with val:" + val, 'info', SliderWindow.NAME);
            var i_height = parseInt(val, 10);
            this.get(STR_SRCNODE).setStyle(STR_HEIGHT, i_height + PX);
        },
        
        /* to do: change into _uiSetSrcWidth */
        _setSrcWidth : function (val) {
            Y.log("_setSrcWidth with val:" + val, 'info', SliderWindow.NAME);
            var i_width = parseInt(val, 10);
            this.get(STR_SRCNODE).setStyle('width', i_width + PX);            
            this.set(STR_OPENWIDTH, i_width);
        },
        
        _repositionSlider : function () {
            Y.log("_repositionSlider", 'info', SliderWindow.NAME);
            
            //Reposition the widget at the bottom of the page. It might have been scrolled up
            var offSet = this.slider.get("docScrollY"),
                vp = this.slider.get("winHeight"),
                iHeight = parseInt(this.get(STR_HEIGHT), 10);
             //using overlay own property: xy
             Y.log("_repositionSlider with vals: offSet: " + offSet + " viewPort height: " + vp + " sliderWindow height: " + iHeight, 'info', SliderWindow.NAME);
             //place on viewport bottom, adding the invisible part that has been scrolled up
            this.set("xy",[0, vp + offSet - iHeight]);
        },
        
        _handleClick : function (e) {
            //handle click on click target  (handle-target or container-close)
             Y.log("_handleClick", 'info', SliderWindow.NAME);
             
             if(CLASS_CONTAINER_CLOSE === e.target.get(STR_CLASSNAME)){
                this.closeWindow();
                
             }else if (CLASS_HANDLE_TARGET === e.target.get(STR_CLASSNAME)){
                 if(this.get('isClosed')){
                         this._handlePublishMessageEvent(STR_STOP);
                 }else{
                         this.closeWindow();
                 }  
             }
        },
        
        /**
        * Publish an event delegation for the event 'eventName' to the elements reached by the selector 'selector'
        * Listen to it with Y.on/after ... as sliderWindow:prefix<def_separator><eventName>
        * NB! duplicate event/selector pairs won't be published, however you are responsible for
        * not using different selectors that leads to the same event attached to the same element
        * 
        * @method publishEvent
        * @param {string} eventName the event to be fired, must be a native DOM event
        * @param {string} selector, the selector used to define the elements the event is attached to
        * @param {string} prefix, a prefix to be added to the event type, use it for  listening to the event
         */
        publishEvent : function (eventName, selector, prefix) {
            Y.log("publishEvent", 'info', SliderWindow.NAME);

            if(!this._isPublished(eventName, selector, prefix)){
                this._storePublished(eventName, selector);                
                this.publish(prefix + STR_SUFFIX_SEP + eventName,
                {
                    emitFacade: false,/*substitue with the e (this) passed to this._passThroughEvent*/
                    bubbles: true,
                    broadcast: true/*Y is able to catch it*/
                    
                });
                //delegate a DOM event, pass to the handler the custom event name, but the original event
                var evt = Y.delegate(eventName,this._passThroughEvent,this.get('boundingBox'), selector,this, prefix + STR_SUFFIX_SEP + eventName);
                Y.log("Published event: " + evt.type + " for selector: " + selector, 'info', SliderWindow.NAME);
                this._saveHandle(evt, eventName, selector);
                
            }else{
                Y.log("Ignoring already published event: " + prefix + STR_SUFFIX_SEP + eventName + " for selector: '" + selector + "'", 'info', SliderWindow.NAME);
            }
        },
        
        _isPublished : function (eventName, selector) {
            Y.log("_isPublished", 'info', SliderWindow.NAME);
            var ret = false;
            OBJ_PUBLISHED_EVENTS[eventName] = OBJ_PUBLISHED_EVENTS[eventName] || {};
            if( undefined !== OBJ_PUBLISHED_EVENTS[eventName][selector]){
                ret = true;
            }
            var is_added = ret? 'is not' : 'is';
            Y.log("Event: '" + eventName + "' " + is_added + " added to be published" , 'info', SliderWindow.NAME);
            return ret;
        
        },
                
        _storePublished : function (eventName, selector) {
           OBJ_PUBLISHED_EVENTS[eventName][selector] = {};
        },
        
        _saveHandle : function (evHandle, eventName, selector) {
            OBJ_PUBLISHED_EVENTS[eventName][selector] = evHandle;
        },
        /**
        * Detach an event 'eventName' added with publishEvent from the elements reached by the selector 'selector'
        * and prefixed
        * Listen to it with Y.on/after ... as sliderWindow:prefix<def_separator><eventName>
        * NB! duplicate event/selector pairs won't be published, however you are responsible for
        * not using different selectors that leads to the same event attached to the same element
        * 
        * @method detachEvent
        * @param {string} eventName the event to be fired, must be a native DOM event
        * @param {string} selector, the selector used to define the elements the event is attached to
        * @param {string} prefix, a prefix to be added to the event type, use it for  listening to the event
         */
        detachEvent : function (eventName, selector) {
            Y.log("detachEvent, detaching " + eventName + ' for els selected with: ' + selector, 'info', SliderWindow.NAME);
            var detachRes = OBJ_PUBLISHED_EVENTS[eventName][selector].detach();           
            Y.log("detachEvent, purging " + detachRes + ' element(s)' +  SliderWindow.NAME, 'info', SliderWindow.NAME);
        
        },
        
        _passThroughEvent : function (e, eventName) {
            Y.log("_passThroughEvent vith event: " + eventName , 'info', SliderWindow.NAME);            
            Y.log("Firing: '" + eventName+ "'", 'info', SliderWindow.NAME);
            this.fire(eventName, e);
        },

        _handleMouseDown : function () {
            //handel mouseup, not used originally, may be used for editing in sw
            Y.log("_handleMouseDown", 'info', SliderWindow.NAME);
        },
        
        _handleMouseUp : function () {
            //handel mouseup, not used originally, may be used for editing in sw
             Y.log("_handleMouseUp", 'info', SliderWindow.NAME);
        },
        
        _handleArrow : function (e) {
            //handel keydown on arrow keys
            Y.log("_handleArrow", 'info', SliderWindow.NAME);
            isCtrl = FALSE;
            if(e.ctrlKey){
                isCtrl = TRUE;
            }
            if(isCtrl){
                if(e.shiftKey && !Y.UA.opera){
                    return;
                }
                /* right arrow */
                if (39 == e.charCode){
                    if(this.get('isClosed')){
                       this._handlePublishMessageEvent(STR_STOP); 
                    }
                    
                    //in Opera it doesn't prevent it to browse back/forth
                    //Opera user will have to ctrl shift - arrow
                    e.halt();                   
                }
                /* left arrow */
                if (37 == e.charCode){
                    /*
                     if the window was not completely open do nothing
                    */
                    if(this.get('isOpen')){
                        this.closeWindow();
                    }
                    e.halt();                    
                }
            }      
        },
        
        _handlePublishMessageEvent : function (action) {
            Y.log("_handlePublishMessageEvent", 'info', SliderWindow.NAME);
            this._repositionSlider();
             
            switch(action){
                case STR_STOP:
                STOP = TRUE;
                
                break;
                case STR_PUBLISH:
                STOP = FALSE;
                
                break;
            }
            //behave normal running from closed window
            if(this.get('isClosed')){
               this.openWindow(); 
            }else{
                //close window with delay for publish or else leave it open
                if(!STOP){
                    Y.later(TIME_DURATION * 1000 / 2, this, 'closeWindow');
                }
            }
            
        },
        
        _handleEndBehaviour : function (action) {
            Y.log("_handleEndBehaviour", 'info', SliderWindow.NAME);
            this._setIsOpen();
            /**
            * change styles for the window (to please IE6).
            * The handler bg image is reset to the right
            */
            if(this.get('isOpen')){
                Y.one("." + CLASS_HANDLE_TARGET).setStyle(CSS_BACKGROUND_POSITION_X,'right');
                if(STOP){
                    return;
                }
                ANIM.set(STR_REVERSE, FALSE);
                this.closeWindow();
            }else{
                Y.one("." + CLASS_HANDLE_TARGET).setStyle(CSS_BACKGROUND_POSITION_X,'left');
            }            
        },

        _setIsOpen : function () {
            if(parseInt(this.get(STR_SRCNODE).getStyle('width'), 10) < parseInt(this.get(STR_OPENWIDTH), 10)){
                this._set('isOpen', false);
                this._set('isClosed', true);
            }else{
                this._set('isOpen', true);
                this._set('isClosed', false);
            }
        },
        
        _setBodyContent : function (val) {
            Y.log('_setBodyContent', 'info', SliderWindow.NAME);
            var cssBodyName = this.getClassName(CSS_BODYCONT);
            return Y.substitute(SliderWindow.BODY_CONTENT,
                                                    {cssBodyCont: cssBodyName, userContent: val}
                                                    );
        },
        
        _removeWidthStyle : function () {
           Y.log("_removeWidthStyle", 'info', SliderWindow.NAME);
           this.get('boundingBox').setStyle('width', '');
        },
        /**
        * Close the window without changing the content
        * @method closeWindow
        */       
        closeWindow : function () {
            Y.log("closeWindow", 'info', SliderWindow.NAME);
            ANIM.set(STR_REVERSE, FALSE);
            this._repositionSlider();
            ANIM.run();
        },
         /**
        * Open the window without changing the content
        * @method openWindow
        */       
        openWindow : function () {
            Y.log("openWindow", 'info', SliderWindow.NAME);
            ANIM.set(STR_REVERSE, TRUE);
            ANIM.set("easing", Easing.easeIn);
            ANIM.run();
        },
         
        /**
        * Add a new text to the Bodycont element and trigger the handlePublishMessageEvent
        * @method sendMessage
        * @param {string} txt the text/html to be published
        * @param {string} mode, (publish| open), whether the window shall open and close or only open
        * @param {string} bypass, if 'ponderaid' bypass setting body. Ponderaid has its own method for writing text.
        */
        sendMessage : function (txt, mode, bypass) {
        
            var isPonderaid = FALSE;
            
            if(bypass == 'ponderaid'){
                isPonderaid = TRUE;
            }
            
            if(!isPonderaid){
                this.set('bodyContent', txt);
            }
            
             if(Y.Lang.isString(mode)){
                switch(mode){
                    case STR_PUBLISH:
                    this._handlePublishMessageEvent(STR_PUBLISH);
                    
                    break;
                    case 'open':
                    this._handlePublishMessageEvent(STR_STOP);
                    
                    break;
                }
            }else{
                this._handlePublishMessageEvent(STR_PUBLISH);
            }
        }
    });

    Y.namespace("Overlay").SliderWindow = SliderWindow;


}, 'gallery-2011.11.10-16-24' ,{requires:['overlay', 'node', 'anim-base','anim-node','anim-easing', 'substitute']});
