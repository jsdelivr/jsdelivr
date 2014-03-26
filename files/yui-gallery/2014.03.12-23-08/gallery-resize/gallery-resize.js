YUI.add('gallery-resize', function(Y) {


/**
 *
 * Plugin to make elements resizeable.
 *
 * Respects (almost) all the config and methods of YUI2.x resize,
 * with the exception of wrap.  
 * 
 * See http://developer.yahoo.com/yui/docs/YAHOO.util.Resize.html for API
 *
 *
 * Copyright Matt Parker, Lamplight Database Systems Limited 2010.
 *
 *
 * Code licensed under the BSD License:
 * http://developer.yahoo.net/yui/license.txt
 *
 */







       /**
        * Simple resize
        */
       /**
        * Simple Resize plugin that can be attached to a Node via the plug method.
        * @class Resize
        * @constructor
        * @namespace Plugin
        */


        var Resize = function(config) {

            Resize.superclass.constructor.apply(this, arguments);
        };


        
        /**
        * @property NAME
        * @description resize
        * @type {String}
        */
        Resize.NAME = "resizePlugin";

        /**
        * @property NS
        * @description The Resize instance will be placed on the Node instance 
        *         under the resize namespace. It can be accessed via Node.resize;
        * @type {String}
        */
        Resize.NS = "resize";



        /**
         * Attributes respect the same config options as YUI 2.x
         * See http://developer.yahoo.com/yui/docs/YAHOO.util.Resize.html#config_animate
         */
        Resize.ATTRS = {
        

          animate : { 
            value: false,
            validator: function(val) {
              return Y.Lang.isNumber(val);
            } 
          },
          
          animateDuration : { value: 0.25 },
          
          animateEasing : { value: ( Y.Easing === undefined ? null : Y.Easing.easeNone ) },
          
          autoRatio : { 
            value: false ,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }          
          },
          
          draggable : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          ghost : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
          },
          
        
          handles: {
              value: [ "r", "br", "b" ],
              setter: function( v ) { 
                if( Y.Lang.isString( v ) && v.toLowerCase() == "all" ) {
                  return [  't', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr' ];
                }
              }
          },
          
          
          height : {
            lazyAdd : false,
            setter: function(v) {
              this.get("host").setStyle( "height" , v + "px" );
              return v;
            },
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          hiddenHandles : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          hover : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          knobHandles : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          maxHeight : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          maxWidth : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          maxX : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          maxY : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          minHeight : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          minWidth : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          minX : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          minY : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          proxy : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
          },
          
          ratio : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          setSize : {},
          
          status : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          useShim : { 
            value: false,        
            validator: function(val) {
              return Y.Lang.isBoolean(val);
            }
           },
          
          width : {            
            lazyAdd : false,
            setter: function(v) {
              this.get("host").setStyle( "width" , v + "px" );
              return v;
            },
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          /*
          We don't wrap elements.  There's a good reason:
            This is a plugin.  It plugs in to a Node.  You don't want a plugin
            to one node that actually plugs into another node it creates.
            
            If you want to resize fancy things like images and textareas,
            wrap the element yourself and plugin resize to that.  Use the isWrapper
            config option to resize child elements along with the wrapper.
          
          wrap : {},
          */
          
          /**
           * This is a wrapper for other things to resize: pass a valid selector
           * for the child elements you want resized too.
           * 
           * Only gets children of the host node, so selector passed will have
           * #hostId prepended to the selector passed.
           */
          wrappedEls: {
            value: false,
            lazyAdd: false,
            validator: function(val) {
              return Y.Lang.isString(val);
            },
            setter: function( val ) {
              if( val ){

                this._wrappedEls = Y.Array( Y.all( "#" + this.get("host").get("id") + " " + val ) );

              }
            }
          },
          
          
          /**
           * Whether to 'hug' the wrapped element.
           * If there's only one element we're wrapping, 
           * set the size of the host to the element that's wrapped.
           */
          hugWrappedEl: {
            value: false,
            lazyAdd: false,
            setter: function( val ){
              if( this._wrappedEls !== undefined && this._wrappedEls.length == 1 && val === true ){
                var c = this._wrappedEls[0], h = this.get("host"),
                    hHeight = parseInt( c.getComputedStyle( "height" ) || c.getAttribute( "height" ), 10 ) ,
                    hWidth = parseInt( c.getComputedStyle( "width" ) || c.getAttribute( "width" ) , 10 );

                if( c.getStyle( "position" ) == "absolute" ){
                  h.setXY( c.getXY() );
                }
                
                if( Y.UA.ie ){
                  hHeight += 8;
                  hWidth += 5;
                }

                h.setStyle( "width" ,  hWidth + "px" );
                h.setStyle( "height" , hHeight + "px" );
              }
            }
          },
          
          
          
          xTicks : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          },
          
          yTicks : {        
            validator: function(val) {
              return Y.Lang.isNumber(val);
            }
          }
          
          

        
        
        };



        Y.extend(Resize, Y.Plugin.Base, {
        
        
            /**
             *
             *
             *
             * Some internal properties
             *
             *
             *
             *
             */
             
        
            /**
             * Handle currently being used for resize
             */
            _currentHandle: false,
            
            
            /**
             * Whether resize is locked
             */
            _locked: false,
            
            
            /**
             * Ratio of h/w - used if retaining el ratio
             */
            _ratioValue: null,
            
            
            /**
             * The Node to resize during DD - may be the proxy
             */
            _resizeNode: null,
            
            /**
             * Where we start from
             */
            _originalPosition: {},
            
            /**
             * Reference to the status element
             */
            _statusNode: false,
            
            /**
             * Elements wrapped (eg images) by the resize 
             */
            _wrappedEls: [],
            

 




            /**
             * Called by Y.Plugin.Base
             * Renders UI and adds DD and handlers to them
             */
            initializer: function( config ) {

               switch( this.get("host").get("nodeName").toLowerCase() ){
                 case 'textarea':
                 case 'img':
                 case 'input':
                 case 'iframe':
                 case 'select':
                   return false;
                 
               }
               
               
               this._renderHandles();
               
               this._renderStatus();
               
               this._addDD();
               

            },
            
            
            
            /**
             *
             *
             * Render methods
             *
             *
             *
             */

            
            /**
             * Add some divs to the host node as handles
             */
            _renderHandles: function() {
               var el = this.get("host"),
                   elId = el.getAttribute( "id" ),
                   hover = this.get( "hover" ),
                   addHandleClass,
                   removeHandleClass,
                   _renderHandle;





                    /**
                     * Renders an individual handle at position
                     */
                    _renderHandle = function( position ) {

                      return Y.Node.create( "<div></div>" )
                                   .addClass("yui3-resize-handle")
                                   .addClass("yui3-resize-handle-" + position )
                                   .append( Y.Node
                                             .create( "<div></div>" )
                                             .addClass("yui3-resize-handle-inner-" + position ) );
                                               
                    };
                
                 Y.each( this.get("handles" ), 
                         function( v, k ){
                            el.append( _renderHandle( v, k ) ); 
                         }
                 );



               // Handlers for mouseenter/leave:
                   
                 // add/remove highlight classes for mouseenter
                 addHandleClass = function( ){ 
                   Y.each( this.getAttribute( "class" ).split( " " ) ,
                           function( v , h ){ this.addClass( v + "-active" ); } ,
                           this);
                   if( hover ){
                     el.removeClass( "yui3-resize-hover" );
                   }
                 };
                 
                 // removes 'active' classes and add hover class:
                 removeHandleClass = function(){
                   Y.each( this.getAttribute( "class" ).split( " " ) ,
                           function( v , h ){ if( v.slice( -7 ) == "-active" ){ 
                             this.removeClass( v ); }
                           } ,
                           this);
                   if( hover ){
                     el.addClass( "yui3-resize-hover" );
                   }
                 };

               Y.on( "mouseenter" , addHandleClass , "#" + elId + " .yui3-resize-handle" );
               Y.on( "mouseleave" , removeHandleClass , "#" + elId + " .yui3-resize-handle" );


               // Add ther css classes:
               
               // classes for the main host element
               el.addClass("yui3-resize");
               
               // hide the handles?
               if( this.get( "hiddenHandles" ) ){
                 el.addClass( "yui3-resize-hidden" );
               }
               
               // add hovering class
               if( hover ) {
                 el.addClass( "yui3-resize-hover" );
               }

               
               // change the display of handles to small square knobs
               if( this.get( "knobHandles" ) ) {
                 el.addClass( "yui3-resize-knob" );
               }
            },
            
            
            /**
             * Adds a Node to hold the status info
             */
            _renderStatus: function(){
            
              if( this.get( "status" ) ){
                this._statusNode = Y.Node.create( '<span class="yui3-resize-status"></span>' );
                Y.Node.one( "body" ).prepend( this._statusNode );
              }
            
            },

            
            
            
            
            
            /**
             *
             *
             * DD and handler methods
             *
             *
             */
            
            
            /**
             * Add drag drop plugin to host element and make 
             * .yui3-resize-handle a handle.
             * @private
             */
            _addDD: function() {

               var el = this.get("host");
               
               
               el.plug( Y.Plugin.Drag , { useShim: this.get( "useShim" ) } );
                                           
               if( this.get( "proxy" ) ){
                 el.dd.plug( Y.Plugin.DDProxy , { moveOnEnd: true } );
                 this._resizeNode = Y.DD.DDM._proxy;
               }

               else {
                 this._resizeNode = el;
               }
                
               el.dd.addHandle( '.yui3-resize-handle' );
            
               el.dd.on( 'drag:start' , this._startResize , this  );
               el.dd.on( 'drag:drag' , this._resize , this );
               el.dd.on( 'drag:end' , this._endResize , this );
               
               // add normal dd:
               if( this.get( "draggable" ) ){
                 el.dd.addHandle( el );
               }

            },
            
            
            

            
            
            
            
            /**
             * Handler for start of resize
             * @private
             */
            _startResize: function( ev ) {

               var  el = this.get("host"),
                    ch = el.dd.get("activeHandle") ;

               // if it's not a resize handle we're not interested
               if( ch === undefined || !ch.hasClass( "yui3-resize-handle" ) ){
                 if( this.get( "draggable" ) ){
                   el.dd.set( "move" , true );                  
                 }
                 return;
               }
               

               this._currentHandle = ch;


               // Are we resizing at set ratio - by config or shift key?
               if( this.get( "ratio" ) || ( this.get("autoRatio") && ev.currentTarget._ev_md.shiftKey  ) ) {
                 this._ratioValue = parseInt( el.getComputedStyle( "height" ) , 10 ) / parseInt( el.getComputedStyle( "width" ) , 10 );
               }
               
               if( this.get( "ghost" ) ){
                  el.addClass( "yui3-resize-ghost" );
               }
               
               this._originalPosition = this._getPosition( this._resizeNode );
 
               this._startChildResize();
               
               // show the status panel:
               this._showStatus();
               
            },
            
            
            /**
             * Remember where child elements that are being resized are
             */
            _startChildResize: function(){
            
              
            
            },



            
            /**
             * Handler for actual resize
             * @private
             */
            _resize: function( ev ){

              
               if( this._locked === true || this._currentHandle === false ) {
                 return;
               }
          
               // get the current location
               var coords = this._getPosition( this._resizeNode  ),
                   orig = this._originalPosition,
                   w = coords.w,
                   h = coords.h,
                   t = coords.t,
                   l = coords.l,
                   // the changes from the dd
                   dw = ev.info.delta[ 0 ],
                   dh = ev.info.delta[ 1 ],
                   calcdW = 0,
                   calcdH = 0,
                   calcdT = 0,
                   calcdL = 0,
                   // the current handle being used
                   ch =  this._currentHandle,
                   finalCoords ;


               if( this._resizeNode.getStyle("position") !== "absolute" ){
                 orig.t = 0; t=0;
                 orig.l = 0; l=0;
               }


               if( this.get( "xTicks" ) && this.get( "xTicks" ) > 0 ){
                 calcdW =  this._snapTick( dw , this.get( "xTicks" ) );
                 
               }

               if( this.get( "yTicks" ) && this.get( "yTicks" ) > 0 ){
                 calcdH =  this._snapTick( dh , this.get( "yTicks" ) );
               }               

            
               if ( ch.hasClass( "yui3-resize-handle-r" ) ) {
                   
                 calcdW = dw;
                 t = orig.t;
                 l = orig.l;
               
               }
               
               else if ( ch.hasClass( "yui3-resize-handle-l" ) ) {

                 calcdW = -dw;
                 calcdL = dw;
                 t = orig.t;
               }
                   
               else if( ch.hasClass( "yui3-resize-handle-t" ) ) {
                   
                 calcdH = -dh;
                 calcdT = dh;
                 l = orig.l;
               
               }
               
               else if ( ch.hasClass( "yui3-resize-handle-b" ) ) {
               
                 calcdH = dh;
                 l = orig.l;
                 t = orig.t;
               }
               
               else if( ch.hasClass( "yui3-resize-handle-tl" ) ) {

                 calcdW = -dw;
                 calcdL = dw;
                 calcdH = -dh;
                 calcdT = dh;               
               }

               else if( ch.hasClass( "yui3-resize-handle-tr" ) ) {

                 calcdW = dw;
                 calcdH = -dh;
                 calcdT = dh;
                 l = orig.l;
               
               }

               else if( ch.hasClass( "yui3-resize-handle-bl" ) ) {
               
                 calcdW = -dw;
                 calcdH = dh;
                 calcdL = dw;
                 t = orig.t;           
               }               

               else if( ch.hasClass( "yui3-resize-handle-br" ) ) {
               
                 calcdW = dw;
                 calcdH = dh;
                 t = orig.t; calcdT = 0;
                 l = orig.l; calcdL = 0;
               }




               finalCoords = this._constrainResize( { w: w + calcdW, 
                                                          h: h + calcdH,
                                                          t: t + calcdT,
                                                          l: l + calcdL } );




               this._setPosition( finalCoords , this._resizeNode );
              
               this._updateStatus( ev, { w: w + calcdW, h: h + calcdH, dw: dw, dh: dh } );

               // update any child elements we're wrapping
               this._resizeChildren( Y.mix( { ratioW: calcdW/w, 
                                             ratioH: calcdH/h, 
                                             dl: calcdL, 
                                             dt: calcdT },
                                           finalCoords) );
                                       


               ev.halt( true );

            
            },
            
            
            
            /**
             * Resize children by same amount
             */
            _resizeChildren: function( oChange ){
      
               if( this._wrappedEls === false ){
                 return; 
               }
               
               // single element wrapper: set to same size as wrapper
               if( this._wrappedEls.length == 1 ){
                 this._setPosition( {w: oChange.w,
                                     h: oChange.h,
                                     t: oChange.t,
                                     l: oChange.l }, 
                                    this._wrappedEls[ 0 ] );
                 return;
               }

               // private function does the hard work:
               var doResize = function( el ){
                 var oPos = this._getPosition( el );
                 this._setPosition( { w: oPos.w * ( 1 + oChange.ratioW ),// + oChange.dw ,
                                      h: oPos.h * ( 1 + oChange.ratioH ),// oChange.dh  ,
                                      t: oPos.t + oChange.dt  ,
                                      l: oPos.l + oChange.dl    }, el );
               };
               
               // cycle through and resize kids:
               Y.each( this._wrappedEls, doResize, this );
            
            },




           
            /**
             * At the end of the resize
             */
            _endResize: function( ev ) {

               // if we're resizing, don't want to move too:
               if( this.get( "draggable" ) && this._currentHandle !== false  ){
               
                  this.get( "host" ).dd.set( "move" , false );

               }
         
             
               if( this.get( "proxy" )  && this._currentHandle !== false ) {
                 
                 // animate...
                 if( this.get( "animate" ) ){
                   this._animPosition( this._getPosition( this._resizeNode ));
                 }
                 // or just go straight there.
                 else {   
                   this._setPosition( this._getPosition( this._resizeNode )); 
                 }
               }
                           
               this._currentHandle = false;
               this._ratioValue = null;
               
               if( this.get( "ghost" ) ){
                  this.get("host").removeClass( "yui3-resize-ghost" );
               }
               
               this._hideStatus();
              

            },
            
            /**
             * Gets position of node in one go.
             * @param Node
             */            
            _getPosition: function( node ){
              
                if( node === undefined ){
                  node = this.get( "host" );
                }


              return { w : parseInt( node.getStyle( "width" ), 10 ),
                       h : parseInt( node.getStyle( "height" ) , 10 ),
                       t : parseInt( node.getY() , 10 ),
                       l : parseInt( node.getX() , 10 ) };
            },
            
            
            /**
             * Sets position of a node in one go.
             * @param Object
             * @param Node
             */
            _setPosition: function( oPos , node ){
          
               if( node === undefined ) {
                 node = this.get( "host" );
               }

                 node.setStyle( "width" , parseInt( oPos.w, 10 ) + "px" );
                 node.setStyle( "height" , parseInt( oPos.h, 10 ) + "px" );
                 node.setStyle( "top" , parseInt( oPos.t, 10 ) + "px" );
                 node.setStyle( "left" , parseInt( oPos.l , 10 ) + "px" );
               
                
            },
            
            
            /**
             * Animate final resize
             */
            _animPosition: function( oPos , node ) {
            
              
              // go straight if Anim's not available.
              if( Y.Anim === undefined ){
                return this._setPosition( oPos, node );
              }
              
              // animate from the starting position before resize
              this._setPosition( this._originalPosition, this.get("host"));
              
              if( node === undefined ){
                node = this.get( "host" );
              }
              
              var a = new Y.Anim( { node: node, 
                                    from: this._originalPosition,
                                    to: { width: oPos.w,
                                          height: oPos.h,
                                          left: oPos.l,
                                          top: oPos.t },
                                    easing: this.get( "animEasing" ),
                                    duration: this.get( "animDuration" ) } );
              a.run();
            },
            
            
            
            
            
            
            /*
             *
             *
             *
             *
             * The status panel methods
             *
             *
             *
             *
             */
             
             /**
              * Shows the status panel
              */
            _showStatus: function(){
            
              if( !this.get( "status" ) ){
                return;
              }
            
              this._statusNode.setStyle( "display", "inline" );
            
            },
            
            /**
             * Updates content and position of status panel
             */
            _updateStatus: function( ev, oCoords ){
              
              if( !this.get( "status" ) ){
                return;
              }
       
              var n = this._statusNode;
              // set text:
              n.setContent("<strong>" + oCoords.w + " x " + oCoords.h + "</strong><em>" + ( oCoords.w - this._originalPosition.w ) + " x " + ( oCoords.h - this._originalPosition.h )+ "</em>" );
              // set position:
              n.setXY( [ ev.target.mouseXY[0] + 12 , ev.target.mouseXY[1] + 12 ] );

            },
            
            /**
             * Hides status panel
             */
            _hideStatus: function(){
              
              if( !this.get( "status" ) ){
                return;
              }
              this._statusNode.setContent("");
              this._statusNode.setStyle( "display", "none" ); 
            },
             
            
            
            
            
            /**
             *
             *
             * Some maths and other logic
             *
             *
             *
             */
            
            
            /**
             * Check if resize is out of bounds
             */
            _constrainResize: function( coords ){
            
               var newW = coords.w,
                   newH = coords.h, 
                   newT = coords.t, 
                   newL = coords.l;
            
               // min and max x and y pos
               if( this.get("minX" ) && newL < this.get( "minX" ) ) {
                 newL = this.get("minX");
               }
               if( this.get("minY" ) && newT < this.get( "minY" ) ) {
                 newT = this.get("minY");
               }               
               if( this.get("maxX" ) && newL > this.get( "maxX" ) ) {
                 newL = this.get("maxX");
               }
               if( this.get("maxY" ) && newT > this.get( "maxY" ) ) {
                 newT = this.get("maxY");
               }

               if( this.get("minHeight" ) && newH < this.get( "minHeight" ) ) {
                 newH = this.get("minHeight");
               }
               if( this.get("minWidth" ) && newW < this.get( "minWidth" ) ) {
                 newW = this.get("minWidth");
               }
               if( this.get("maxHeight" ) && newH > this.get( "maxHeight" ) ) {
                 newH = this.get("maxHeight");
               }
               if( this.get("maxWidth" ) && newW > this.get( "maxWidth" ) ) {
                 newW = this.get("maxWidth");
               }
               

                              
               // keep the ratio:
               if( ( this.get("ratio") === true ||  this.get("autoRatio") ) && ( this._ratioValue > 0 ) ) {
                 newH = newW * this._ratioValue;
               }
               
               return { w: newW, h: newH, t: newT, l: newL };
            
            },


            /** 
            * @private
            * @method _snapTick
            * @param {Number} size The size to tick against.
            * @param {Number} pix The tick pixels.
            * @description Adjusts the number based on the ticks used.
            * @return {Number} the new snapped position
            */
            _snapTick: function(size, pix) {
                if (!size || !pix) {
                    return size;
                }
                var _s = size, 
                    _x = Math.abs(size % pix);

                    if ( Math.abs( _x ) > (pix / 2)) {
                        _s = size + (pix - _x);
                    } else {
                        _s = size - _x;
                    }

                return _s;
            },            
            
            /**
             *
             *
             * Some public methods
             *
             *
             *
             */
            destructor: function() {
              
              // destroy the dd
              this.get("host").dd.destroy();
              this.get("host").unplug("dd");
              
              // remove listeners
              this.detachAll();
              
              // destroy handles
              Y.all( "#" + this.get("host").get("id") + " .yui3-resize-handle" )
               .each( function(el){ el.remove(); } );
              
              // remove status node
              if( this._statusNode !== false ){
                this._statusNode.remove();
              }
              
              this.get("host").removeClass("yui3-resize")
                              .removeClass("yui3-resize-hover")
                              .removeClass("yui3-resize-knob")
                              .removeClass("yui3-resize-hidden");
              
              //this.get("host").unplug("resize");

              
            },
            
            getActiveHandleEl: function() {
              return this._currentHandle;
            },
            
            getProxyEl: function() {
              if( this.get( "proxy" ) ){
                return Y.DD.DDM._proxy;
              }
              return false;
            },
            
            /**
             *
             */
            getStatusEl: function() {
              return this._statusNode;
            },
            
            getWrapEl: function() {
              return false;
            },
            
            isActive: function() {
              return this._currentHandle === false ? false : true;
            },
            
            isLocked: function() {
              return this._locked;
            },
            
            lock: function() {
              this._locked = true;
              
              if( this.get("host").dd ) {
                this.get("host").dd.lock();
              }
            },
            
            unlock: function() {
              this._locked = false;
              
              if( this.get("host").dd ) {
                this.get("host").dd.unlock();
              }
            },
            
            reset: function() {
            
            },
            
            toString: function() {
              return 'Resize plugin ' + this.get("host").getAttribute( "id" );
            }
            
            
        
        } );
        
        Y.Plugin.Resize = Resize;







}, 'gallery-2010.05.21-18-16' ,{requires:['attribute','node','plugin','dd-plugin','dd-proxy','anim','event-mouseenter']});
