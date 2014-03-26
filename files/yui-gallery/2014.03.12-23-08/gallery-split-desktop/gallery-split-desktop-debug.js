YUI.add('gallery-split-desktop', function(Y) {

var PX = 'px',
        POUND = '#',
        HTML = 'HTML',
        WIDTH = 'width',
        HEIGHT = 'height',
        BACKGROUNDIMAGE = 'backgroundImage',
        BACKGROUNDPOSITION = 'backgroundPosition',
        PATH_TO_IMAGES = 'assets/',
        FALLBACK_PATH = '/gallery-split-desktop/',
        GALLERYSPLITDESKTOP = 'gallery-split-desktop',
        E_ENTER = 'enter',
        E_DRAG = 'drag',
        E_CLOSE = 'close',
        E_OPEN = 'open',
        E_MAIN = 'Main',
        E_INIT = 'init',
        E_START = 'start',
        E_END = 'end',
        E_CROWN = 'Crown',
        E_NE = 'NE',
        E_NW = 'NW',
        PAGE_DEF_WIDTH = 960,
        NW_MIN_WIDTH = 150,
        DEF_MAIN_HEIGHT = 700,
        DEF_CROWN_HEIGHT = 30,
        DRAG_HERE_IMG = 'drag-here.png',
        DRAG_HERE_IMG_URL = PATH_TO_IMAGES + DRAG_HERE_IMG,
        DRAG_HERE_IMG_LEFT = 162,
        DRAG_HERE_IMG_TOP = 7,
        HANDLE_IMG = 'center-handle.png',
        HANDLE_IMG_TPL = null,
        HANDLE_ID = 'handle',
        DEF_PREFIX = 'ea_',
        ID_OPEN_TPL = 'id="',
        ID_CLOSE_TPL = '" ',
        IMG_OPEN_TPL = '<img ',
        SRC_OPEN_TPL = 'src="',
        SRC_CLOSE_TPL = '" ',
        IMG_CLOSE_TPL = '/>',
        BORDERS_COLOR = POUND + '99cccc',
        BORDER_PIX_IMG = 'pix-blue.gif',
        BORDER_PIX_URL = PATH_TO_IMAGES + BORDER_PIX_IMG,
        FULL_DESKTOP = {
            wrapper: 'page_wrapper',
            crown: 'crown',
            nw: 'nw',
            nwbody: 'body_nw',
            ne: 'ne',
            borders: 'borders',
            nebody: 'body_ne',
            main: 'main'
        },
        PAGE_WIDTH_CONF = 'pageWidth',
        BORDERS_COLOR_CONF = 'bordersColor',
        DRAG_HERE_IMG_CONF = 'dragHereImg',
        PATH_TO_IMAGES_CONF = 'pathToImages',
        BORDER_PIX_CONF = 'borderPixImg',
        HANDLE_IMG_CONF = 'handleImg',
        DRAG_HERE_LEFT_CONF = 'dragHereLeft',
        DRAG_HERE_TOP_CONF = 'dragHereTop',
        MAIN_HEIGHT_CONF = 'mainHeight',
        CROWN_HEIGHT_CONF = 'crownHeight',
        ISDRAGGING_CONF = 'isDragging',
        PREFIX_CONF = 'prefix',
        CLOSE_CROWN_CONF = 'closeCrownHeight',
        CLOSE_NW_CONF = 'closeNWWidth',
        CLOSE_NE_CONF = 'closeNEWidth',
        IS_CLOSE_CROWN_CONF = 'isCloseCrown',
        IS_CLOSE_NW_CONF = 'isCloseNW',
        IS_CLOSE_NE_CONF = 'isCloseNE',
        /*
default provided here, updated if PREFIX is customized.
Corresponding nodes are fetched after configuration based on updated selector
*/
        RESIZER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.ne,
        SECONDARY_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.nwbody,
        MAIN_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.main,
        WRAPPER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.wrapper,
        /* static vars used by reposition script */
        resizerNode = null,
        secondaryNode = null,
        mainNode = null,
        handleImgNode = null,
        ddHandle = null,
        started = false,
        totW = 0,
        totH = 0,
        w = 0,
        h = 0,
        MARGIN = 5,
        cutOffNeClosed = null,
        cutOffNwClosed = null,
        cutOffCrownClosed = null;

    /* class constructor */
    function SplitDesktop(config) {
        SplitDesktop.superclass.constructor.apply(this, arguments);
    }

    SplitDesktop.NAME = "splitDesktop";


    SplitDesktop.ATTRS = {

        boundingBox : {
            value: HTML
        },
        contentBox : {
            value: "page_wrapper"
        },
        pageWidth : {
            value: PAGE_DEF_WIDTH + PX
        },
        bodyHeight: {
            value: DEF_MAIN_HEIGHT + PX
        },
        dragHereImg: {
            value: DRAG_HERE_IMG
        },
        pathToImages: {
            value: PATH_TO_IMAGES
        },
        pathToStyles: {
            value: PATH_TO_IMAGES
        },
        pointerLeftPos: {
            value: DRAG_HERE_IMG_LEFT + PX
        },
        pointerTopPos: {
            value: DRAG_HERE_IMG_TOP + PX
        },
        handleImage: {
            value: HANDLE_IMG
        },
        handleId: {
            value: HANDLE_ID
        },
        dragHereImgPath: {
            value: DRAG_HERE_IMG_URL
        },
        defaultPrefix: {
            value: DEF_PREFIX
        },
        mainDivId: {
            value: FULL_DESKTOP.main
        },
        bordersColor: {
            value: BORDERS_COLOR
        },
        borderPixImg: {
            value: BORDER_PIX_URL
        },
        markupIsValidated : {
            value: null
        },
        handleImg: {
            value: HANDLE_IMG
        },
        dragHereLeft: {
            value: DRAG_HERE_IMG_LEFT + PX
        },
        dragHereTop: {
            value: DRAG_HERE_IMG_TOP + PX
        },
        mainHeight: {
            value: DEF_MAIN_HEIGHT + PX
        },
        crownHeight: {
            value: DEF_CROWN_HEIGHT + PX,
            setter: '_setCrownHeight'
        },
        prefix: {
            value: DEF_PREFIX
        },
        baseUrl: {
            getter: '_getBaseUrl',
            lazyAdd: false
        },
        isDragging: {
            value: false
        },
        closeCrownHeight: {
            value: 40,
            validator: '_validateCloseCrownHeight'
        },
        closeNWWidth: {
            value: 30,
            validator: '_validateCloseNwWidth'
        },
        closeNEWidth: {
            value: 30,
            validator: '_validateCloseNeWidth'
        },
        isCloseCrown: {
            value: false
        },
        isCloseNW: {
            value: false
        },
        isCloseNE: {
            value: false
        }
        
    };


    Y.extend(SplitDesktop, Y.Widget, {

        initializer: function (config) {
            var BASE_URL = this.get('baseUrl'),
                i,
                HANDLE_IMG_URL = BASE_URL + PATH_TO_IMAGES + HANDLE_IMG;
                
            HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL;
            
            Y.log('HANDLE_IMG_TPL ' + HANDLE_IMG_TPL, 'info', SplitDesktop.NAME);
            for (i in config) {
                if (config.hasOwnProperty(i)) {
                    Y.log('initializer is checking user config for: ' + i, 'info', SplitDesktop.NAME);
                    switch (i) {
                    case PAGE_WIDTH_CONF:
                       PAGE_DEF_WIDTH = this.get(i);
                        var ne = PAGE_DEF_WIDTH - NW_MIN_WIDTH;/* */
                        var m = PAGE_DEF_WIDTH + 21;
                        /* nw div is always 150 and comes auto from page_wrapper - ne */
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.wrapper).setStyle('width', PAGE_DEF_WIDTH);
                        /*adjust ne accordingly */
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.ne).setStyle('width', ne);
                        /* resize ea_body_main accordingly */
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle('width', m);
                        break;
                    case BORDERS_COLOR_CONF:
                        var c = this.get(BORDERS_COLOR_CONF); /**/
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.borders).setStyle('borderLeftColor', c).setStyle('borderBottomColor', c);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.wrapper).setStyle('borderColor', c);
                        break;
                    case DRAG_HERE_IMG_CONF:
                    case PATH_TO_IMAGES_CONF:
                    case BORDER_PIX_CONF:
                    case HANDLE_IMG_CONF:
                    /**
If base url is on CDN we will either have inside Y.config a property of 'gallery' or alternatively fullpath.
In case we have gallery => assume CDN (Y.Env.cdn is the base url)
In case we have fullpath => assume js file is inside root of package basedir (Y.config.fullpath ) is the baseurl
*/
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        DRAG_HERE_IMG_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(DRAG_HERE_IMG_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDIMAGE, 'url("' + DRAG_HERE_IMG_URL + '")');

                        BORDER_PIX_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(BORDER_PIX_CONF);

                        if (i === BORDER_PIX_CONF || i === PATH_TO_IMAGES_CONF) {
                            Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.nw).setStyle(BACKGROUNDIMAGE, BORDER_PIX_URL);
                        }
                        /* create handle and place it in resizer div */
                        if (i === HANDLE_IMG_CONF || i === PATH_TO_IMAGES_CONF) {
                            DEF_PREFIX = this.get(PREFIX_CONF);
                            HANDLE_IMG_URL = this.get(PATH_TO_IMAGES_CONF) + this.get(HANDLE_IMG_CONF);
                            HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL;
                        }
                        break;
                    case DRAG_HERE_LEFT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDPOSITION, this.get(DRAG_HERE_LEFT_CONF) + PX + ' ' + this.get(DRAG_HERE_TOP_CONF) + PX);
                        break;
                    case DRAG_HERE_TOP_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(BACKGROUNDPOSITION, this.get(DRAG_HERE_LEFT_CONF) + PX + ' ' + this.get(DRAG_HERE_TOP_CONF) + PX);
                        break;
                    case MAIN_HEIGHT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.main).setStyle(HEIGHT, this.get(MAIN_HEIGHT_CONF) + PX);
                        break;
                    case CROWN_HEIGHT_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i] + PX, 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.ne).setStyle(HEIGHT, this.get(CROWN_HEIGHT_CONF) + PX);
                        break;
                    case PREFIX_CONF:
                        Y.log('initializer is updating ' + i + ' with: ' + config[i], 'info', SplitDesktop.NAME);
                        DEF_PREFIX = this.get(PREFIX_CONF);
                        /* update selectors with new prefix */
                        RESIZER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.ne;
                        SECONDARY_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.nwbody;
                        MAIN_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.main;
                        WRAPPER_SELECTOR = POUND + DEF_PREFIX + FULL_DESKTOP.wrapper;
                        /* update img tpl with new prefix */
                        HANDLE_IMG_TPL = IMG_OPEN_TPL + ID_OPEN_TPL + DEF_PREFIX + HANDLE_ID + ID_CLOSE_TPL + SRC_OPEN_TPL + HANDLE_IMG_URL + SRC_CLOSE_TPL + IMG_CLOSE_TPL;
                        break;
                    }
                }
            }

            /* some events to be used by subclasses to focus on diff areas */

            this.publish(E_ENTER + E_MAIN, {
                bubbles: true
            });

            this.publish(E_ENTER + E_NE, {
                bubbles: true
            });

            this.publish(E_ENTER + E_NW, {
                bubbles: true
            });
            
            this.publish(E_DRAG + E_INIT, {
            });
            
            this.publish(E_DRAG + E_START, {
            });
            
            this.publish(E_DRAG + E_END, {
            });
            
            this.publish(E_CLOSE + E_NE, {
            });
            
            this.publish(E_CLOSE + E_NW, {
            });
            
            this.publish(E_CLOSE + E_CROWN, {
            });
            
            this.publish(E_OPEN + E_CROWN, {
            });
            
            this.publish(E_OPEN + E_NE, {
            });
            
            this.publish(E_OPEN + E_NW, {
            });
            
            this._over = function (e) {
                switch (POUND + e.currentTarget.get('id')){
                case SECONDARY_SELECTOR:
                    if(!this.get("isDragging")){
                        this.fire(E_ENTER + E_NW);
                    }
                    break;
                case RESIZER_SELECTOR:
                    if(!this.get("isDragging")){
                        this.fire(E_ENTER + E_NE);
                    }
                    break;
                case MAIN_SELECTOR:
                    if(!this.get("isDragging")){
                        this.fire(E_ENTER + E_MAIN);
                    }
                    break;
                }
            };
            
            this._out = function (e) {
                return;
            };
            
            Y.one(WRAPPER_SELECTOR).delegate("hover", this._over, this._out, ".sdt-active", this);
        },

        renderUI : function () {

            resizerNode = Y.one(RESIZER_SELECTOR);
            handleImgNode = Y.Node.create(HANDLE_IMG_TPL, resizerNode);
            resizerNode.append(handleImgNode);
            /* make the handle draggable */
            ddHandle = new Y.DD.Drag({node: POUND + DEF_PREFIX + HANDLE_ID});
            ddHandle.plug(Y.Plugin.DDConstrained, {
                constrain2node: WRAPPER_SELECTOR
            });
        },

        bindUI : function () {
            ddHandle.on('drag:start', this._onDragStart, this);
            ddHandle.on('drag:drag', this._onDragDrag, this);
            ddHandle.on('drag:end', this._onDragEnd, this);
            
        },

        syncUI : function () {
            /* Now make the page visible */
            Y.one(HTML).setStyle('display', 'block');

        },
        
        /**
* @protected
*
*/

        _onDragStart : function (e) {
            /* remove background from main */
            mainNode = Y.one(MAIN_SELECTOR);
            this.set(ISDRAGGING_CONF, true);
            switch (started) {
            case false:
                this.fire(E_DRAG + E_INIT);
                mainNode.setStyle(BACKGROUNDIMAGE, 'none');
                
            case true:
                this.fire(E_DRAG + E_START);
                h = parseInt(resizerNode.getStyle(HEIGHT).toString().replace(PX, ''), 10);
                w = parseInt(resizerNode.getStyle(WIDTH).toString().replace(PX, ''), 10);
                started = true;
                break;
            }
        },

        _onDragDrag : function (e) {
            secondaryNode = Y.one(SECONDARY_SELECTOR);
            resizerNode = Y.one(RESIZER_SELECTOR);

            /* get values */
            var deltaW = parseInt(e.info.offset[0], 10),
                deltaH = parseInt(e.info.offset[1], 10);

            totW = w - deltaW;
            totH = h + deltaH;
            
            /* ne closed when resizer width is page width - padding - close value */
            if(!cutOffNwClosed){
                cutOffNwClosed = this.get(PAGE_WIDTH_CONF) - 6 - this.get(CLOSE_NW_CONF);
            }
            if(!cutOffNeClosed){
                cutOffNeClosed = this.get(CLOSE_NE_CONF);
            }
            if(!cutOffCrownClosed){
                cutOffCrownClosed = this.get(CLOSE_CROWN_CONF);
            }
            
            this._isPaneClosed(IS_CLOSE_NW_CONF, E_NW, cutOffNwClosed, totW, true);
            this._isPaneClosed(IS_CLOSE_NE_CONF, E_NE, cutOffNeClosed, totW, false);
            this._isPaneClosed(IS_CLOSE_CROWN_CONF, E_CROWN, cutOffCrownClosed, totH, false);
            resizerNode.setStyle(WIDTH, totW);
            resizerNode.setStyle(HEIGHT, totH);

            secondaryNode.setStyle(WIDTH, PAGE_DEF_WIDTH - totW + MARGIN);
            secondaryNode.setStyle(HEIGHT, totH);
        },

        _onDragEnd : function (e) {
            /*
reposition to 00 pos in resizer window
the window width might have changed from the drag:start due to scrollbars,
hence the current x y is not necessarily at the bottom left corner of the window
*/
            this.fire(E_DRAG + E_END);
            this.set(ISDRAGGING_CONF, false);
            this._repositionHandle();
        },
                
        _getBaseUrl : function () {
            Y.log("setting baseurl. Dumping config if Y.dump is present", 'info', SplitDesktop.NAME);
           if(Y.dump){ Y.log(Y.dump(Y.config));}
            if(Y.config.modules){
                if(Y.config.modules[GALLERYSPLITDESKTOP]){
                    /* defined as single module */
                    if(Y.config.modules[GALLERYSPLITDESKTOP].gallery){
                        /* source is on CDN */
                        Y.log("Baseurl is on CDN for this module");
                        return Y.Env.base + Y.config.modules[GALLERYSPLITDESKTOP].gallery + '/build/gallery-split-desktop/';
                        
                    }else if(Y.config.modules[GALLERYSPLITDESKTOP].fullpath){
                        //extract root, assets relative to root
                        Y.log("Baseurl based on fullpath for this module", 'info', SplitDesktop.NAME);
                        var url = Y.config.modules[GALLERYSPLITDESKTOP].fullpath;
                        return url.substring(0,url.lastIndexOf('/')+1);
                        
                    }else if(Y.config.modules.base){
                        Y.log("Baseurl is base for this module", 'info', SplitDesktop.NAME);
                        return Y.config.modules.base;
                    }
                }
            }else if(Y.config.gallery){
                /* source is general gallery url */
                Y.log("Baseurl is on CDN", 'info', SplitDesktop.NAME);
                return Y.Env.base + Y.config.gallery + '/build/gallery-split-desktop/';

            }else if(Y.config.fullpath){
                //extract root, assets relative to root
                var url = Y.config.fullpath;
                Y.log("Baseurl based on general fullpath", 'info', SplitDesktop.NAME);
                return url.substring(0,url.lastIndexOf('/')+1);
                
            }else{
                Y.log("Baseurl based on fallback path", 'info', SplitDesktop.NAME);
                return FALLBACK_PATH;
            }
        },
                
        _getMain : function () {
            return Y.one(MAIN_SELECTOR);
        },
                
        _getSecondary : function () {
            return Y.one(SECONDARY_SELECTOR);
        },
                
        _getResizer : function () {
            return Y.one(RESIZER_SELECTOR);
        },
        
        _validateCloseCrownHeight : function (val) {
            return (val >= this.get(CROWN_HEIGHT_CONF));
        },
        
        _validateCloseNWWidth : function (val) {
            return (val >= 0 && val <= parseInt(this.get(PAGE_WIDTH_CONF).replace(PX, ''), 10) / 4);
        },
                
        _validateCloseNEWidth : function (val) {
            return (val >= 0 && val <= parseInt(this.get(PAGE_WIDTH_CONF).replace(PX, ''), 10) / 4);
        },
           
        _isPaneClosed : function (confName, eventType, cutOffVal, actualVal, direction) {
            /* close/open events for NW */
            /* NW behaves in opposite direction: use false */
            if(!this.get(confName)){
                if(this._evalLimits(cutOffVal <= actualVal, direction)){
                    this.set(confName, true);
                    this.fire(E_CLOSE + eventType);
                    Y.log('Firing ' + E_CLOSE + eventType, 'info', SplitDesktop.NAME);
                }
            }else{
               if(this._evalLimits(cutOffVal > actualVal, direction)){
                   this.set(confName, false);
                   this.fire(E_OPEN + eventType);
                   Y.log('Firing ' + E_OPEN + eventType, 'info', SplitDesktop.NAME);
                }
            }
        },
        _evalLimits : function (operation, bit){
            return bit ? operation : !operation;
        },
        /*some configuration function */
        _setCrownHeight : function (val) {
            DEF_PREFIX = this.get(PREFIX_CONF);
            Y.one(POUND + DEF_PREFIX + FULL_DESKTOP.ne).setStyle(HEIGHT, val + PX);
            this._repositionHandle(val);
        },
        _repositionHandle : function (val) {
            Y.log("Repositioning handle", 'info', SplitDesktop.NAME);
            handleImgNode.setStyle('left', '0px');
            if(val){
                secondaryNode.setStyle(HEIGHT, val);
            }
            handleImgNode.setStyle('bottom', '0px');
            handleImgNode.setStyle('top', '');
            
        }

    });

    Y.namespace('Widget').SplitDesktop = SplitDesktop;


}, 'gallery-2011.06.01-20-18' ,{requires:['widget','dd-constrain','event-hover']});
