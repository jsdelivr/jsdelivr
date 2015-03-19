/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *  This file serves as a starting point for new template designs.  Below you will
 *  see a listing of all media player "hooks" that can be implemented by the
 *  template to customize the functionality of this template.
 */
(function($) {
  jQuery.media = jQuery.media ? jQuery.media : {};

  // Add the menu callback.
  window.onFlashPlayerMenu = function( id ) {
    var player = jQuery.media.players[id];
    player.showMenu( !player.menuOn );
  };

  jQuery.media.templates = jQuery.extend( {}, {
    "shockplayer" : function( mediaplayer, settings ) {
      return new (function( mediaplayer, settings ) {

        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;

        this.mediaDisplay = null;
        this.player = null;
        this.logo = null;
        this.fullScreenButton = null;
        this.prev = null;
        this.next = null;
        this.info = null;
        this.nodeInfo = null;

        /**
         * Called just before the mediaplayer is ready to show this template to the user.
         * This function is used to initialize the template given the current state of
         * settings passed to the player.  You can use this function to initialize variables,
         * change width's and height's of elements based on certain parameters passed to the
         * media player.
         *
         * @param - The settings object.
         */
        this.initialize = function( settings ) {

          // Get the player elements.
          this.mediaDisplay = mediaplayer.node.player.media;
          this.player = mediaplayer.node.player;
          this.volumeBar = $('#mediaplayer_audioBar');
          this.logo = this.player.logo;
          this.prev = $('#mediaplayer_prev');
          this.next = $('#mediaplayer_next');
          this.info = $('#mediaplayer_bigPlay');
          this.fullScreenButton = mediaplayer.display.find("#mediafront_resizeScreen").click( function( event ) {
            event.preventDefault();
            mediaplayer.onFullScreen(!mediaplayer.fullScreen);
          });

          // Hide the volume bar by default.
          this.volumeBar.hide();
          this.fullScreenButton.find(".off").hide();

          // Show the control bar, and then hide it after 5 seconds of inactivity.
          jQuery.media.utils.showThenHide( mediaplayer.controller.display, "display", null, "slow", function() {
            mediaplayer.node.player.play.css("bottom", "5px");
          });

          jQuery.media.utils.showThenHide( this.fullScreenButton, "fullscreen" );

          // Make sure that we show the volume bar when they hover over the mute button.
          // Add a timer to the mouse move of the display to show the control bar and logo on mouse move.
          mediaplayer.display.bind("mousemove", function() {
            mediaplayer.node.player.play.css("bottom", "45px");
            
            if(!mediaplayer.node.player.usePlayerControls) {
              jQuery.media.utils.showThenHide( _this.prev, "prev", "fast", "fast" );
              jQuery.media.utils.showThenHide( _this.next, "next", "fast", "fast" );
              jQuery.media.utils.showThenHide( _this.info, "info", "fast", "fast" );              
              jQuery.media.utils.showThenHide( _this.fullScreenButton, "fullscreen" );
              if( jQuery.media.hasMedia ) {
                jQuery.media.utils.showThenHide( mediaplayer.controller.display, "display", "fast", "slow", function() {
                  mediaplayer.node.player.play.css("bottom", "5px");
                });
              }
            }
          });

          // Show the volume bar when they hover over the mute button.
          mediaplayer.controller.mute.display.bind("mousemove", function() {
            if( jQuery.media.hasMedia ) {
              jQuery.media.utils.showThenHide( _this.volumeBar, "volumeBar", "fast", "fast" );
            }
          });

          // Stop the hide on both the control bar and the volumeBar.
          jQuery.media.utils.stopHideOnOver( mediaplayer.controller.display, "display" );
          jQuery.media.utils.stopHideOnOver( this.fullScreenButton, "fullscreen" );
          jQuery.media.utils.stopHideOnOver( this.volumeBar, "volumeBar" );
          jQuery.media.utils.stopHideOnOver( this.info, 'info');
          jQuery.media.utils.stopHideOnOver( this.prev, "prev" );
          jQuery.media.utils.stopHideOnOver( this.next, "next" );

          // Show the media controls.
          this.player.showControls(true);
        };

        /**
         * Returns our template settings overrides.  This is used to force a particular
         * setting to be a certain value if the user does not provide that parameter.
         *
         * @return - An associative array of our settings.  We can use this to override any
         *           default settings for the player as well as default ids.
         */
        this.getSettings = function() {
          return {
            volumeVertical:true
          };
        };

        /**
         * Called when the user presses the menu button.
         *
         * @param - If the menu should be on (true) or off (false).
         */
        this.onMenu = function( on ) {
          if( mediaplayer.menu ) {
            if( on ) {
              mediaplayer.menu.display.show( "normal" );
            }
            else {
              mediaplayer.menu.display.hide( "normal" );
            }
          }
        };

        /**
         * Called when the user presses the fullscreen button.
         *
         * @param - If the player is in fullscreen (true) or normal mode (false).
         */
        this.onFullScreen = function( on ) {
          if( on ) {
            this.fullScreenButton.find(".on").hide();
            this.fullScreenButton.find(".off").show();
            this.player.display.addClass("fullscreen");
            mediaplayer.menu.display.addClass("fullscreen");

            // Hide the players controls, and show the HTML controls.
            if (this.player && !mediaplayer.node.player.usePlayerControls) {
              this.player.showControls(true);
            }
          }
          else {
            this.fullScreenButton.find(".on").show();
            this.fullScreenButton.find(".off").hide();
            this.player.display.removeClass("fullscreen");
            mediaplayer.menu.display.removeClass("fullscreen");

            // Hide the players controls, and show the HTML controls.
            if (this.player && !mediaplayer.node.player.usePlayerControls) {
              this.player.showControls(false);
            }
          }
        };

        /**
         * Selects or Deselects a menu item.
         *
         * @param - The link jQuery object
         */
        this.onMenuSelect = function( link, contents, selected ) {
          if( selected ) {
            contents.show("normal");
            link.addClass('active');
          }
          else {
            contents.hide("normal");
            link.removeClass('active');
          }
        };

        this.onNodeLoad = function( data ) {
          this.nodeInfo = data;
          mediaplayer.node.player.play.show();       
        };


        // See if we are using FireFox with an mp4 video.
        this.isFireFoxWithH264 = function() {
          if (this.player && this.player.media && this.player.media.mediaFile) {
            var ext = this.player.media.mediaFile.getFileExtension();
            return jQuery.browser.mozilla && (ext == 'mp4' || ext == 'm4v');
          }
          else {
            return false;
          }
        };

        this.onMediaUpdate = function( data ) {
          if (data.type == "playerready" && this.isFireFoxWithH264()) {
            mediaplayer.node.player.media.player.player.setTitle(this.nodeInfo.title);
            mediaplayer.showNativeControls(true);
            this.fullScreenButton.hide();
            this.prev.hide();
            this.next.hide();
            this.info.hide();
          }
          
          if( mediaplayer.controller && mediaplayer.node ) {
            if( data.type == "reset" ) {
              jQuery.media.hasMedia = true;
              if (!mediaplayer.node.player.usePlayerControls) {
                mediaplayer.controller.display.show();
              }
              this.player.display.removeClass("nomedia");
            }
            else if( data.type == "nomedia" ) {
              jQuery.media.hasMedia = false;
              mediaplayer.controller.display.hide();
              this.player.display.addClass("nomedia");
            }
          }
        };

        /**
         * This function is currently stubbed out.
         * You can implement it and hook into the time display by
         * reassigning this as follows...
         *
         *  this.formatTime = function( time ) {
         *  }
         *
         *  You can see the default implementation of this function
         *  by opening js/source/jquery.media.control.js on the line
         *  after it says this.formatTime = ...
         */
        this.formatTime = false;
      })( mediaplayer, settings );
    }
  }, jQuery.media.templates );
})(jQuery);
