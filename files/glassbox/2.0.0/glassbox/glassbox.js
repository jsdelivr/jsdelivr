/**
 * @name glassbox
 * @overview  Javascript User Interface (UI) Library
 
 * @homepage <a href="http://www.glassbox-js.com">www.glassbox-js.com</a>
 * @status development 
 * @version 2.0.0
 * @last&nbsp;mod 2009/02/23

 * @supported<br/>browsers 
   Internet Explorer 6 higher <br/>
   Firefox 1.5 higher <br/>
   Opera 9.x higher <br/>
   Safari 2.x higher <br/>

 * @author Uli Preuss</a>
 * @copyright &copy; 2006-2009 <a href="http://www.glassbox-js.com">glassbox-js</a>
 
 * @licence The MIT License:
   <br/><br/>
   Permission is hereby granted, free of charge, to any person obtaining a copy 
   of this software and associated documentation files (the "Software"), to deal 
   in the Software without restriction, including without limitation the rights 
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
   copies of the Software, and to permit persons to whom the Software is 
   furnished to do so, subject to the following conditions:
   <br/><br/> 
   The above copyright notice and this permission notice shall be included in all 
   copies or substantial portions of the Software.
   <br/><br/> 
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
   SOFTWARE.
   <br/><br/>
*/

/* Configuration */
var path_to_glassbox = "javascripts/glassbox/";
var path_to_background_images = "images/backgrounds/";

// You must define path to root directory in any html-pages outside the root directory
// Relative path (for example "../")
var path_to_root_dir = ""; // Default
var mypath_to_background_images = ""; // Default
/* End Configuration */

if ( typeof(GlassBox) == 'undefined' ) {
  /** 
  * @constructor 
  * @desc GlassBox object
  * @example
  * var myBox = new GlassBox();
  */ 
  var GlassBox = function() {
 
    THIS = this,
    /** 
    * @memberOf GlassBox
    * @desc GlassBox Version
    * @type string
    * @example
    * alert( myBox.version );
    */
    this.version = "2.0.0",
    this.version_comment = "Modified: open/close glassbox, Fixed: IE7 PNG Bug and a lot more ..",
    /** 
    * @memberOf GlassBox
    * @desc Date of last modification
    * @type string
    * @example
    * alert( myBox.last_mod );
    */
    this.last_mod = "2009/02/23",
  
    this.bb_hor = "",
    this.bb_ver = "",
    this.skin_path =  path_to_root_dir + path_to_glassbox + "skins/",
    this.skin_default = "default",
    
    this.gb_path = path_to_root_dir + path_to_glassbox,
	this.img_bg_path = mypath_to_background_images != "" 
		? mypath_to_background_images : path_to_root_dir + path_to_background_images,
    
    this.multicontent_arr = new Array(),
    this.exists = false,
    this.is_false = true,
    this.dblclick = true,
	this.isvscreen = false;  
	   
    this.is_IE = /MSIE (5\.5|6|7)/.test( navigator.userAgent ),
    this.is_Opera = /Opera/.test( navigator.userAgent ),
                
    /** 
    * @memberOf GlassBox
    * @desc Object Initialization 
    * @param {string} id Id of the XHTML element 
    * @param {string} width Width of the new GlassBox (use CSS property values)
    * @param {string} height Height of the new GlassBox (use CSS property values)
    * @param {string} overflow Overflow/Scrollbars (use CSS property values)
    * @param {string} skinname Name of the Border Style (default, white, ..)
    * @param {string} multicontent_num (optional) Number of XHTML element 
    * @example
    * myBox.init( 'myBox', '150px', '270px', 'hidden', 'white' );
    */
    this.init = function( id, width, height, overflow, skinname, resize, dblclick, multicontent_num ) {

      this.id = id;
      if($( this.id + "_contentBoxBg" ) != null) {
      	this.remove();
      }
      if( this.exists == false ) {
        this.width = width;
        this.height = height;
        this.overflow = overflow;
      
        if( resize != null && resize != "" ) {
          if( resize == false ) this.resize = false;
          else if( resize == true ) this.resize = true;
        }
        if( dblclick == false ) this.dblclick = false;
        else if( dblclick == true ) this.dblclick = true;
        
        if( skinname != null && skinname != "" ) this.skinfolder = this.skin_path + skinname;
        else this.skinfolder = this.skin_path + this.skin_default;
      
        // No user skin 
        if(this.bb_hor == "" || this.bb_ver == "") {
          if( skinname == "facebookstyle" ) {
            this.bb_hor = "25px";
            this.bb_ver = "25px";          
          }
          else if( skinname == "greyline" ) {
            this.bb_hor = "25px";
            this.bb_ver = "27px";
          }
          else { // Default skin
            this.bb_hor = "25px";
            this.bb_ver = "21px";
          }
        }
        
        this.glassbox = $( this.id );
    
        if( multicontent_num != null ) {
          if( this.is_false == true ) {
            var pageArray = new Array();
            var className = "glassbox_mc";
            var divs = document.getElementsByTagName("div");
            var pattern = new RegExp( "\\b" + className + "\\b" );
            for ( i = 0, j = 0; i < divs.length; i++ ) {
              if ( pattern.test( divs[i].className ) ) {
                pageArray[j] = divs[i];
                j++;
              }
            }
            this.header = "<h1>" + pageArray[0].getElementsByTagName( "h1" )[0].innerHTML + "</h1>";
            for( i=0;i< pageArray.length;i++ ) {
              this.multicontent_arr[i] = pageArray[i].innerHTML;
            }
            this.glassboxContent = this.multicontent_arr[0];
            this.is_false = false;
          }
          else {
            if( multicontent_num == 1 ) {
              this.glassboxContent = this.multicontent_arr[ multicontent_num-1 ];
            }
            else {
              this.glassboxContent = this.header + this.multicontent_arr[ multicontent_num-1 ];
            }
          }
        }
        else {
          if(typeof this.glassboxContent == "undefined") {
            this.glassboxContent = this.glassbox.innerHTML;
          }
        }
        if(this.glassbox != null) {
          this.glassbox.innerHTML = "";
        }

        this.glassboxWidth = parseInt( this.width );
        this.boxborder_lr1 = parseInt( this.bb_hor );
	    if(isNaN(this.glassboxWidth)) {
			this.content_width = "auto";
			this.glassboxWidth = "auto";
		}
        else this.content_width = this.glassboxWidth - ( 2 * this.boxborder_lr1 ) + "px" ;

        this.glassboxHeight = parseInt( this.height );
        this.boxborder_tb1 = parseInt( this.bb_ver );
	    if(isNaN(this.glassboxHeight)) {
			this.content_height = "auto";
			this.glassboxHeight = "auto";
		}
        else this.content_height = this.glassboxHeight - ( 2 * this.boxborder_tb1 ) + "px" ;

        var sd = getScreenDimensions ();  
        this.screenWidth = sd.screenWidth;
        this.screenHeight = sd.screenHeight;
      }
    },
    
    /** 
    * @memberOf GlassBox
    * @desc Full vertical size (height)
    * @param {string} left Position left (use CSS property values) 
    * @param {string} margin Margin (use CSS property values)
    * @example
    * myBox.vscreen( '50px', '5px' );
    */
    this.vscreen = function( left, margin ){
      this.isvscreen = true;      
      this.glassboxHeight = this.screenHeight - ( parseInt( margin ) * 2 );
      this.boxborder_tb1 = parseInt( this.bb_ver );
      this.content_height = this.glassboxHeight - ( 2 * this.boxborder_tb1 ) + "px" ;
      this.glassbox.style.position = "absolute";
      this.glassbox.style.left = left;
      this.glassbox.style.top = parseInt( margin ) + "px";    
      this.createGlassbox();
    },
    
    /** 
    * @memberOf GlassBox
    * @desc inline position
    * @example
    * myBox.ipos();
    */
    this.ipos = function(){
      this.createGlassbox();
    },
    
    /** 
    * @memberOf GlassBox
    * @desc Absolute position
    * @param {string} left Position left (use CSS property values) 
    * @param {string} top Position top (use CSS property values)
    * @example
    * myBox.apos( '690px', '35px' );
    */
    this.apos = function( left, top ){
      this.glassbox.style.position = "absolute";
      this.glassbox.style.left = left;
      this.glassbox.style.top = top;
      this.createGlassbox();
    },
    
    /** 
    * @memberOf GlassBox
    * @desc Display object as a lightbox (with overlay)
    * @param {bool} exitbut Display exit button
    * @param {string} opac (optional) Opacity (use CSS property values)
    * @example
    * myBox.lbo( true, 0.50 ); 
    */
    this.lbo = function( exitbut, opac ){
     if( this.exists != true ) {
        if( opac ) {
          this.overlay = document.createElement( "div" );
          this.overlay.setAttribute( "id", this.id + "_overlay" );
          this.overlay.style.position = "absolute";
          this.overlay.style.backgroundColor = "#000000";
          this.overlay.style.left = "0px";
          this.overlay.style.top = "0px";
          this.overlay.style.width = this.screenWidth + "px";
          this.overlay.style.height = this.screenHeight + "px";
          this.overlay.style.opacity = opac;
          this.overlay.style.filter = "alpha( opacity=" + opac * 100 + " )";
          this.overlay.style.zIndex = 999;
          this.overlay.style.display = "block";
          var htmlbody = document.getElementsByTagName( "body" )[0];
          htmlbody.appendChild( this.overlay );
        }
        if( exitbut != false ) {
          var exitButton = document.createElement( "div" );
          exitButton.setAttribute( "id","exitButton" );
          exitButton.style.position = "absolute";
          exitButton.style.left = this.glassboxWidth - 39 + "px";
          exitButton.style.top = 23 + "px";
          exitButton.style.zIndex = 1001;
          exitButton.title = "close";
          this.glassbox.appendChild( exitButton );
    
          var exitLink = document.createElement( "a" );
          exitLink.href = "javascript:THIS.fade();";
          exitButton.appendChild( exitLink );
    
          var exitImage = document.createElement( "img" );
          exitImage.setAttribute( "id", "exitImage" );
          exitImage.style.border = 0;
          exitImage.src = this.skin_path + "exitButton.png";
          exitLink.appendChild( exitImage );
    
          if(typeof Effect != 'undefined') {
            new Effect.Appear( "exitButton" );
          }
          else {
            $( "exitButton" ).style.display = "block";
          }
        }
        //this.glassbox.style.cursor = "pointer";
        //this.glassbox.style.cursor = "hand";
        this.glassbox.style.position = "absolute";
        this.glassbox.style.left = Math.round( ( this.screenWidth - this.glassboxWidth ) / 2 ) + "px";
        this.glassbox.style.top = Math.round( ( this.screenHeight - this.glassboxHeight ) / 2 ) + "px";
        this.glassbox.style.zIndex = 1000;
        this.glassbox.style.minWidth = this.glassboxWidth + "px";
    
        this.createGlassbox();
        this.exists = true;
      }
      else {
        $( this.id + "_overlay" ).style.display = "block";
      }
      this.appear();
    },
    
    /** 
    * @memberOf GlassBox
    * @desc Effect.Appear
    * @example
    * myBox.fade();
    */
    this.appear = function( ms ){
      if(typeof Effect != 'undefined') {
        this.glassbox.style.display = "none";
        new Effect.Appear( this.id );
      }
      else{
        this.glassbox.style.display = "block";
      }
      /** 
      * @private 
      */
      this.glassbox.ondblclick = function () {
        if(THIS.dblclick == true) THIS.fade();
      };
      if( ms ) {
        setTimeout( "THIS.fade()", ms );
      }
    },
  
    /** 
    * @memberOf GlassBox
    * @desc Effect.Fade
    * @param {number} ms (optional) Only for a period of time (in milliseconds)
    * @example
    * myBox.appear(3000);
    */
    this.fade = function(){
      if(typeof Effect != 'undefined') {
        new Effect.Fade( THIS.id , {
          afterFinish: function() { 
            THIS.remove() 
          }
        });
        if($( THIS.id + "_overlay" )) {
          new Effect.Fade( THIS.id + "_overlay", { 
            afterFinish: function() { 
          	  this.overlay = $( THIS.id + "_overlay" );
          	  this.overlay.parentNode.removeChild( this.overlay );
            }
          });  
        }
      }
     else {
        $( THIS.id ).style.display = "none";
        if($( THIS.id + "_overlay" )) {
          $( THIS.id + "_overlay" ).style.display = "none";
        }
        this.remove();
      }
    },

    /** 
    * @private 
    */
    this.remove = function(){
      //this.glassbox.parentNode.removeChild(this.glassbox);
      $( this.id ).innerHTML = $( this.id + "_content" ).innerHTML;
    },

    /** 
    * @memberOf GlassBox
    * @desc Draggable Object
    * @example
    * myBox.draggable();
    */
    this.draggable = function(title){
      try { // .. if Scriptaculous library is included
        new Draggable( this.id );
        this.glassbox.title = title;
      }
      catch(e) {}
    },

    /** 
    * @memberOf GlassBox
    * @desc Sets the z-index of the object
    * @param {string} zindex Only for a period of time (in milliseconds)
    * @example
    * myBox.zindex('100');
    */
    this.zindex = function( zindex ){
      this.glassbox.style.zIndex = zindex;
    },
    
    /** 
    * @private 
    */
    this.noro = function( rightmargin ){ //no right overflow
      if( rightmargin == null ) rightmargin = 0;
      var leftMarginScreen = this.screenWidth - ( parseInt( this.glassbox.style.left) + parseInt( this.glassboxWidth ) );
      if( leftMarginScreen < 0 ) {
        this.glassbox.style.left = ( parseInt( this.glassbox.style.left ) + leftMarginScreen + rightmargin + 14 ) + "px";
      }
    },
    
    /** 
    * @private 
    */
    this.createGlassbox = function(){

      var toprow = document.createElement( "div" );
      toprow.setAttribute( "id", this.id + "_toprow" );
      toprow.style.width = this.glassboxWidth;
      toprow.style.minWidth = this.glassboxWidth + "px";
      this.glassbox.appendChild( toprow );

      var topleft = document.createElement( "div" );
      topleft.setAttribute( "id", this.id + "_topleft" );
      topleft.style.width = this.bb_hor;
      topleft.style.height = this.bb_ver;
      topleft.style.cssFloat = "left";
      topleft.style.styleFloat = "left";
      topleft.style.backgroundImage = "url( " + this.skinfolder + "/topleft.png )";
      if ( this.is_IE  ){ 
        topleft.style.filter = this.iepngfix(this.skinfolder + "/topleft.png");
        topleft.style.backgroundImage = "none";
      }
      toprow.appendChild( topleft );
    
      var top = document.createElement( "div" );
      top.setAttribute( "id", this.id + "_top" );
      top.style.width = this.content_width;
      top.style.height = this.bb_ver;
      top.style.cssFloat = "left";
      top.style.styleFloat = "left";
      top.style.backgroundImage = "url( " + this.skinfolder + "/top.png )";
      if ( this.is_IE  ){ 
        top.style.filter = this.iepngfix(this.skinfolder + "/top.png");
        top.style.backgroundImage = "none";
      }
      toprow.appendChild( top );
    
      var topright = document.createElement( "div" );
      topright.setAttribute( "id", this.id + "_topright" );
      topright.style.width = this.bb_hor;
      topright.style.height = this.bb_ver;
      topright.style.cssFloat = "left";
      topright.style.styleFloat = "left";
      topright.style.backgroundImage = "url( " + this.skinfolder + "/topright.png )";
      if ( this.is_IE  ){ 
        topright.style.filter = this.iepngfix(this.skinfolder + "/topright.png");
        topright.style.backgroundImage = "none";
      }
      toprow.appendChild( topright );
      
      var clear = document.createElement( "div" );
      clear.style.clear = "both";
      this.glassbox.appendChild( clear );
    
      var middlerow = document.createElement( "div" );
      middlerow.setAttribute( "id", this.id + "_middlerow" );
      middlerow.style.width = this.glassboxWidth;
      this.glassbox.appendChild( middlerow );

      var left = document.createElement( "div" );
      left.setAttribute( "id", this.id + "_left" );
      left.style.width = this.bb_hor;
      left.style.height = this.content_height;
      left.style.cssFloat = "left";
      left.style.styleFloat = "left";
      left.style.backgroundImage = "url( " + this.skinfolder + "/left.png )";
      if ( this.is_IE  ){ 
        left.style.filter = this.iepngfix(this.skinfolder + "/left.png");
        left.style.backgroundImage = "none";
      }
      middlerow.appendChild( left );
    
      // Content
    
      var contentBox = document.createElement( "div" );
      contentBox.setAttribute( "id", this.id + "_contentBox" );
      contentBox.style.width = this.content_width;
      contentBox.style.height = this.content_height;
      contentBox.style.cssFloat = "left";
      contentBox.style.styleFloat = "left";
      middlerow.appendChild( contentBox );
    
      var contentBoxBg = document.createElement( "div" );
      contentBoxBg.setAttribute( "id", this.id + "_contentBoxBg" );
      contentBoxBg.style.width = "100%";
      contentBoxBg.style.height = "100%";
      contentBoxBg.style.overflow = this.overflow;
      contentBoxBg.style.backgroundColor = "#ffffff";
      contentBox.appendChild( contentBoxBg );
      this.contentBoxBg = contentBoxBg;    
    
      var content = document.createElement( "div" );
      content.setAttribute( "id", this.id + "_content" );
      content.innerHTML = this.glassboxContent;
      contentBoxBg.appendChild( content );
      this.content = content; 
      
      // End Content
    
      var right = document.createElement( "div" );
      right.style.width = this.bb_hor;
      right.style.height = this.content_height;
      right.style.cssFloat = "left";
      right.style.styleFloat = "left";
      right.setAttribute( "class", "boxmiddle" );
      right.setAttribute( "id", this.id + "_right" );
      right.style.backgroundImage = "url( " + this.skinfolder + "/right.png )";
      if ( this.is_IE  ){ 
        right.style.filter = this.iepngfix(this.skinfolder + "/right.png");
        right.style.backgroundImage = "none";
      }
      middlerow.appendChild( right );
    
      var clear = document.createElement( "div" );
      clear.style.clear = "both";
      this.glassbox.appendChild( clear );
    
      var bottomrow = document.createElement( "div" );
      bottomrow.setAttribute( "id", this.id + "_bottomrow" );
      bottomrow.style.width = this.glassboxWidth;
      this.glassbox.appendChild( bottomrow );

      var bottomleft = document.createElement( "div" );
      bottomleft.setAttribute( "id",  this.id + "_bottomleft" );
      bottomleft.style.width = this.bb_hor;
      bottomleft.style.height = this.bb_ver;
      bottomleft.style.cssFloat = "left";
      bottomleft.style.styleFloat = "left";
      bottomleft.style.backgroundImage = "url( " + this.skinfolder + "/bottomleft.png )";
      if ( this.is_IE  ){ 
        bottomleft.style.filter = this.iepngfix(this.skinfolder + "/bottomleft.png");
        bottomleft.style.backgroundImage = "none";
      }
      bottomrow.appendChild( bottomleft );
      
      var bottom = document.createElement( "div" );
      bottom.setAttribute( "id", this.id + "_bottom" );
      bottom.style.width = this.content_width;
      bottom.style.height = this.bb_ver;
      bottom.style.cssFloat = "left";
      bottom.style.styleFloat = "left";
      bottom.style.backgroundImage = "url( " + this.skinfolder + "/bottom.png )";
      if ( this.is_IE  ){ 
        bottom.style.filter = this.iepngfix(this.skinfolder + "/bottom.png");
        bottom.style.backgroundImage = "none";
      }
      bottomrow.appendChild( bottom );
    
      var bottomright = document.createElement( "div" );
      bottomright.setAttribute( "id", this.id + "_bottomright" );
      bottomright.style.width = this.bb_hor;
      bottomright.style.height = this.bb_ver;
      bottomright.style.cssFloat = "left";
      bottomright.style.styleFloat = "left";
      bottomright.style.backgroundImage = "url( " + this.skinfolder + "/bottomright.png )";
      if ( this.is_IE ){ 
        bottomright.style.filter = this.iepngfix(this.skinfolder + "/bottomright.png");
        bottomright.style.backgroundImage = "none";
      }
      bottomrow.appendChild( bottomright );
    
      var clear = document.createElement( "div" );
      clear.style.clear = "both";
      this.glassbox.appendChild( clear );      

      if(this.isvscreen == false ) this.adjustBoxBorder();
      
    },
    
    /** 
    * @public 
    */  
    this.adjustBoxBorder = function() { 
    	   
      var top = $(this.id + "_top");
      var bottom = $(this.id + "_bottom");
      var left = $(this.id + "_left");
      var right = $(this.id + "_right");
      var content = $(this.id + "_content");
      var contentWidth = parseFloat(getElementProperty(content, 'width'));
      var contentHeight = parseFloat(getElementProperty(content, 'height'));
      var skinWidth = parseInt(this.bb_ver);
      var skinHeight = parseInt(this.bb_hor);
      var paddingTop = parseFloat(getElementProperty(content, 'padding-top'));
      var paddingRight = parseFloat(getElementProperty(content, 'padding-right'));
      var paddingBottom = parseFloat(getElementProperty(content, 'padding-bottom'));
      var paddingLeft = parseFloat(getElementProperty(content, 'padding-left'));
      
      if ( this.is_IE ) { 
        if(this.width == "auto" || this.width == "") {
          top.style.width = bottom.style.width = contentWidth - skinWidth + "px";
          contentBox.style.width = contentWidth - skinWidth + "px";
        }
        if(this.height == "auto" || this.height == "") {
          left.style.height = right.style.height = contentHeight - parseInt(this.bb_hor) + "px";
          contentBox.style.height = contentHeight - parseInt(this.bb_hor) + "px";
        }
      }
      else if ( this.is_Opera ){   
        if( parseFloat(navigator.appVersion) < 9.5) {
          if(this.width == "auto" || this.width == "") {
            top.style.width = bottom.style.width = contentWidth + "px";
          }
          if(this.height == "auto" || this.height == "") {
            left.style.height = right.style.height = contentHeight + "px";
          }
        }
        else if( parseFloat(navigator.appVersion) >= 9.5) {
          if(this.width == "auto" || this.width == "") {
            top.style.width = bottom.style.width = 
                contentWidth + paddingLeft + paddingRight  + "px";
          // Opera 9.5 ??
          // contentBox.style.width = contentWidth - skinWidth + "px";
          }
          if(this.height == "auto" || this.height == "") {
            left.style.height = right.style.height = 
                contentHeight + paddingTop + paddingLeft + "px";
            // Opera 9.5 ??
            // contentBox.style.height = contentHeight - skinHeight + "px";
          }
        }
      }
      else { // FF, Safari
        if(this.width == "auto" || this.width == "") {
          top.style.width = bottom.style.width = 
              contentWidth + paddingLeft + paddingRight  + "px";
        }
        if(this.height == "auto" || this.height == "") {
          left.style.height = right.style.height = 
              contentHeight + paddingTop + paddingLeft + "px";
        }
      }
    },

    /** 
    * @private 
    */
    this.iepngfix = function( bgimg ) {
      return 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + bgimg + '", sizingMethod="scale")';
    },
    
    /** 
    * @private 
    */
    this.backgroundImage = function( num ){
      try { // ..find and load background image
        var htmlbody = document.getElementsByTagName( "body" )[0];
        htmlbody.style.background ="url( " + this.img_bg_path + "bg" + num +".jpg )";
      }
      catch(e) {}
    },
  
    /** 
    * @private 
    */
    window.onresize = function () {
      if(THIS.resize == true) {
        var sd = getScreenDimensions ();  
        THIS.glassbox.style.left = Math.round( ( sd.screenWidth - THIS.glassboxWidth ) / 2 ) + "px";
        THIS.glassbox.style.top = Math.round( ( sd.screenHeight - THIS.glassboxHeight ) / 2 ) + "px";  
        if(THIS.overlay != undefined){
          THIS.overlay.style.width = sd.screenWidth + "px";
          THIS.overlay.style.height = sd.screenHeight + "px";
        }
      }
    }
  }
}

/** 
* @public 
*/
function GETrequest( url, target_id, callback_id ) {
  try {
    req = window.XMLHttpRequest ? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
  } 
  catch (e) { /* No AJAX Support */ }
  req.onreadystatechange = function () {
    if ((req.readyState == 4) && (req.status == 200)) {
      if(target_id && $( target_id )) $( target_id ).innerHTML = req.responseText;
      if(callback_id) GETrequest_callbackHandler(callback_id);
    }  
  }
  req.open( 'GET', url );
  req.send( null ); 
}

/** 
* @private 
*/
function getScreenDimensions (){
  if (window.innerHeight) {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
  } 
  else if ( document.documentElement.clientHeight ) {
    screenWidth = document.documentElement.clientWidth;
    screenHeight = document.documentElement.clientHeight;
  }
  else if ( document.body.clientHeight ) {
    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;
  }
  return {
    "screenWidth": screenWidth, 
    "screenHeight": screenHeight 
  }
}


/** 
* @private 
*/
// Garrett Smith
// Reading Style Values
// http://dhtmlkitchen.com/learn/js/setstyle/index4.jsp
function getElementProperty(el, style) {
   if ( /MSIE (5\.5|6\.)/.test( navigator.userAgent )){ 
	   el = $(el);
   }
   var value = el.style[toCamelCase(style)];
   if(!value) {
      if(document.defaultView)
         value = document.defaultView.getComputedStyle(el, "").getPropertyValue(style);
      else if(el.currentStyle)
		 	value = IE_computedStyle.get(el, toCamelCase(style));
      return value;
   }
}
function toCamelCase(s) {
	for(var exp = toCamelCase.exp; 
		exp.test(s); s = s.replace(exp, RegExp.$1.toUpperCase()) );
	return s;
}
toCamelCase.exp = /-([a-z])/;

/** 
* @private 
*/
// Matt Murphy
// An IE getComputedStyle Method for Block Elements
// http://www.matts411.com/webdev/an_ie_getcomputedstyle_method_for_block_elements
var IE_computedStyle = function () {
    var styleEl;

	var getPadding = function (which) {
        return grabLength(styleEl.currentStyle["padding" + which]) + "px";
    };

	var getWidth = function () {
        var width = styleEl.offsetWidth; /* Currently the width including padding + border */
        width -= parseInt(getPadding("Right"));
        width -= parseInt(getPadding("Left"));
       return width + "px";
    };
    
    var getHeight = function () {
        var height = styleEl.offsetHeight; /* Currently the height including padding + border */
        height -= parseInt(getPadding("Top"));
        height -= parseInt(getPadding("Bottom"));
         return height + "px";
    };
    
    var grabLength = function (length) {
        var temp = document.createElement("DIV");
        temp.style.width = length;
        styleEl.parentNode.appendChild(temp);
        length = Math.round(temp.offsetWidth);
        styleEl.parentNode.removeChild(temp);
        return length;
    };
    
    return {
        get : function (el, styleProp) {   
            var rValue;
            styleEl = (typeof(el) === "string") ? $(el) : el;	
            var styleProp = (typeof(styleProp) === "string") ? styleProp.toLowerCase() : "";
            styleProp = styleProp.replace(/\-/g, "");
            
            switch (styleProp) { /* Run through the valid css properties, return undefined if none match */
                case "width": rValue = getWidth(); break;
                case "height": rValue = getHeight(); break;
            }
            return rValue;
        }
    };
}();

/** 
* @public 
*/
if ( typeof($) == 'undefined' ) {
  $ = function (id) {
    return document.getElementById(id);
  }
}


 