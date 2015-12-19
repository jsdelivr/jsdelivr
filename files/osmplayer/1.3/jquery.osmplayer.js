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
 */
(function($) {
  jQuery.media = jQuery.media ? jQuery.media : {};
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the auto server object.
    auto : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        this.json = jQuery.media.json( settings );
        this.rpc = jQuery.media.rpc( settings );
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( protocol == "json" ) {
            this.json.call( method, onSuccess, onFailed, params, protocol );
          }
          else {
            this.rpc.call( method, onSuccess, onFailed, params, protocol );
          }
        };
      })( settings );
    }
  }, jQuery.media );

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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    volumeVertical:false
  });
   
  // Set up our defaults for this component.
  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    currentTime:"#mediacurrenttime",
    totalTime:"#mediatotaltime",
    playPause:"#mediaplaypause",
    seekUpdate:"#mediaseekupdate",
    seekProgress:"#mediaseekprogress",
    seekBar:"#mediaseekbar",
    seekHandle:"#mediaseekhandle",
    volumeUpdate:"#mediavolumeupdate",
    volumeBar:"#mediavolumebar",
    volumeHandle:"#mediavolumehandle",
    mute:"#mediamute"
  });
   
  jQuery.fn.mediacontrol = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( controlBar, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
      this.display = controlBar;
      var _this = this;
         
      // Allow the template to provide their own function for this...
      this.formatTime = (settings.template && settings.template.formatTime) ? settings.template.formatTime :
      function( time ) {
        time = time ? time : 0;
        var seconds = 0;
        var minutes = 0;
        var hour = 0;
            
        hour = Math.floor(time / 3600);
        time -= (hour * 3600);
        minutes = Math.floor( time / 60 );
        time -= (minutes * 60);
        seconds = Math.floor(time % 60);
         
        var timeString = "";
            
        if( hour ) {
          timeString += String(hour);
          timeString += ":";
        }
            
        timeString += (minutes >= 10) ? String(minutes) : ("0" + String(minutes));
        timeString += ":";
        timeString += (seconds >= 10) ? String(seconds) : ("0" + String(seconds));
        return {
          time:timeString,
          units:""
        };
      };
         
      this.setToggle = function( button, state ) {
        var on = state ? ".on" : ".off";
        var off = state ? ".off" : ".on";
        if( button ) {
          button.find(on).show();
          button.find(off).hide();
        }
      };
         
      var zeroTime = this.formatTime( 0 );
      this.duration = 0;
      this.volume = -1;
      this.prevVolume = 0;
      this.percentLoaded = 0;
      this.playState = false;
      this.muteState = false;
      this.currentTime = controlBar.find( settings.ids.currentTime ).text( zeroTime.time );
      this.totalTime = controlBar.find( settings.ids.totalTime ).text( zeroTime.time );

      // Allow them to attach custom links to the control bar that perform player functions.
      this.display.find("a.mediaplayerlink").each( function() {
        var linkId = $(this).attr("href");
        $(this).medialink( settings, function( event ) {
          event.preventDefault();
          _this.display.trigger( event.data.id );
        }, {
          id:linkId.substr(1),
          obj:$(this)
        } );
      });

      // Set up the play pause button.
      this.playPauseButton = controlBar.find( settings.ids.playPause ).medialink( settings, function( event, target ) {
        _this.playState = !_this.playState;
        _this.setToggle( target, _this.playState );
        _this.display.trigger( "controlupdate", {
          type: (_this.playState ? "pause" : "play")
        });
      });
         
      // Set up the seek bar...
      this.seekUpdate = controlBar.find( settings.ids.seekUpdate ).css("width", 0);
      this.seekProgress = controlBar.find( settings.ids.seekProgress ).css("width", 0);
      this.seekBar = controlBar.find( settings.ids.seekBar ).mediaslider( settings.ids.seekHandle, false );
      if( this.seekBar ) {
        this.seekBar.display.unbind("setvalue").bind( "setvalue", function( event, data ) {
          _this.seekUpdate.css( "width", (data * _this.seekBar.trackSize) + "px" );
          _this.display.trigger( "controlupdate", {
            type:"seek",
            value:(data * _this.duration)
          });
        });
        this.seekBar.display.unbind("updatevalue").bind( "updatevalue", function( event, data ) {
          _this.seekUpdate.css( "width", (data * _this.seekBar.trackSize) + "px" );
        });
      }
         
      this.setVolume = function( vol ) {
        if( this.volumeBar ) {
          if( settings.volumeVertical ) {
            this.volumeUpdate.css({
              "marginTop":(this.volumeBar.handlePos + this.volumeBar.handleMid),
              "height":(this.volumeBar.trackSize - this.volumeBar.handlePos)
            });
          }
          else {
            this.volumeUpdate.css( "width", (vol * this.volumeBar.trackSize) );
          }
        }
      };
         
      // Set up the volume bar.
      this.volumeUpdate = controlBar.find( settings.ids.volumeUpdate );
      this.volumeBar = controlBar.find( settings.ids.volumeBar ).mediaslider( settings.ids.volumeHandle, settings.volumeVertical, settings.volumeVertical );
      if( this.volumeBar ) {
        this.volumeBar.display.unbind("setvalue").bind("setvalue", function( event, data ) {
          _this.setVolume( data );
          _this.display.trigger( "controlupdate", {
            type:"volume",
            value:data
          });
        });
        this.volumeBar.display.unbind("updatevalue").bind("updatevalue", function( event, data ) {
          _this.setVolume( data );
          _this.volume = data;
        });
      }
         
      // Setup the mute button.
      this.mute = controlBar.find(settings.ids.mute).medialink( settings, function( event, target ) {
        _this.muteState = !_this.muteState;
        _this.setToggle( target, _this.muteState );
        _this.setMute( _this.muteState );
      });
                
      this.setMute = function( state ) {
        this.prevVolume = (this.volumeBar.value > 0) ? this.volumeBar.value : this.prevVolume;
        this.volumeBar.updateValue( state ? 0 : this.prevVolume );
        this.display.trigger( "controlupdate", {
          type:"mute",
          value:state
        });
      };

      this.setProgress = function( percent ) {
        if( this.seekProgress && this.seekBar ) {
          this.seekProgress.css( "width", (percent * (this.seekBar.trackSize + this.seekBar.handleSize)) );
        }
      };

      this.onResize = function() {
        if( this.seekBar ) {
          this.seekBar.onResize();
        }
        this.setProgress( this.percentLoaded );
      };

      // Handle the media events...
      this.onMediaUpdate = function( data ) {
        switch( data.type ) {
          case "reset":
            this.reset();
            break;
          case "paused":
            this.playState = true;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "playing":
            this.playState = false;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "stopped":
            this.playState = true;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "progress":
            this.percentLoaded = data.percentLoaded;
            this.setProgress( this.percentLoaded );
            break;
          case "meta":
          case "update":
            this.timeUpdate( data.currentTime, data.totalTime );
            if( this.volumeBar ) {
              this.volumeBar.updateValue( data.volume );
            }
            break;
          default:
            break;
        }
      };
         
      // Call to reset all controls...
      this.reset = function() {
        this.totalTime.text( this.formatTime(0).time );
        this.currentTime.text( this.formatTime(0).time );
        if( this.seekBar ) {
          this.seekBar.updateValue(0);
        }
        this.seekUpdate.css( "width", "0px" );
        this.seekProgress.css( "width", "0px" );
      };
         
      this.timeUpdate = function( cTime, tTime ) {
        this.duration = tTime;
        this.totalTime.text( this.formatTime( tTime ).time );
        this.currentTime.text( this.formatTime( cTime ).time );
        if( tTime && this.seekBar && !this.seekBar.dragging ) {
          this.seekBar.updateValue( cTime / tTime );
        }
      };
         
      // Reset the time values.
      this.timeUpdate( 0, 0 );
    })( this, settings );
  };
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
 */

  

  // Called when the YouTube player is ready.
  window.onDailymotionPlayerReady = function( playerId ) {
    playerId = playerId.replace("_media", "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "dailymotion":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?dailymotion\.com/i) === 0);
    }
  });

  jQuery.fn.mediadailymotion = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.meta = false;
      this.loaded = false;
      this.ready = false;

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://www.dailymotion.com/swf/' + videoFile.path + '?rand=' + rand + '&amp;enablejsapi=1&amp;playerapiid=' + playerId;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          {},
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.loadMedia = function( videoFile ) {
        if( this.player ) {
          this.loaded = false;
          this.meta = false;
          this.videoFile = videoFile;

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          this.player.loadVideoById( this.videoFile.path, 0 );
        }
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          // Create our callback functions.
          window[options.id + 'StateChange'] = function( newState ) {
            _this.onStateChange( newState );
          };

          window[options.id + 'PlayerError'] = function( errorCode ) {
            _this.onError( errorCode );
          };

          // Add our event listeners.
          this.player.addEventListener('onStateChange', options.id + 'StateChange');
          this.player.addEventListener('onError', options.id + 'PlayerError');

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          this.player.loadVideoById( this.videoFile.path, 0 );
        }
      };

      // Called when the player state changes.
      this.onStateChange = function( newState ) {
        var playerState = this.getPlayerState( newState );

        // Alright... Dailymotion's status updates are just crazy...
        // write some hacks to just make it work.

        if( !(!this.meta && playerState.state =="stopped") ) {
          onUpdate( {
            type:playerState.state,
            busy:playerState.busy
          } );
        }

        if( !this.loaded && playerState.state == "buffering" ) {
          this.loaded = true;
          onUpdate( {
            type:"paused",
            busy:"hide"
          } );
          if( options.autostart ) {
            this.playMedia();
          }
        }

        if( !this.meta && playerState.state == "playing" ) {
          // Set this player to meta.
          this.meta = true;

          // Update our meta data.
          onUpdate( {
            type:"meta"
          } );
        }
      };

      // Called when the player has an error.
      this.onError = function( errorCode ) {
        var errorText = "An unknown error has occured: " + errorCode;
        if( errorCode == 100 ) {
          errorText = "The requested video was not found.  ";
          errorText += "This occurs when a video has been removed (for any reason), ";
          errorText += "or it has been marked as private.";
        } else if( (errorCode == 101) || (errorCode == 150) ) {
          errorText = "The video requested does not allow playback in an embedded player.";
        }
        onUpdate( {
          type:"error",
          data:errorText
        } );
      };

      // Translates the player state for the  API player.
      this.getPlayerState = function( playerState ) {
        switch (playerState) {
          case 5:
            return {state:'ready', busy:false};
          case 3:
            return {state:'buffering', busy:"show"};
          case 2:
            return {state:'paused', busy:"hide"};
          case 1:
            return {state:'playing', busy:"hide"};
          case 0:
            return {state:'complete', busy:false};
          case -1:
            return {state:'stopped', busy:false};
          default:
            return {state:'unknown', busy:false};
        }
        return 'unknown';
      };

      /*
         this.setSize = function( newWidth, newHeight ) {
            this.player.setSize(newWidth, newHeight);
         };
         */
      this.playMedia = function() {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        this.player.playVideo();
      };

      this.pauseMedia = function() {
        this.player.pauseVideo();
      };

      this.stopMedia = function() {
        this.player.stopVideo();
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        this.player.seekTo( pos, true );
      };

      this.setVolume = function( vol ) {
        this.player.setVolume( vol * 100 );
      };

      this.getVolume = function() {
        return (this.player.getVolume() / 100);
      };

      this.getDuration = function() {
        return this.player.getDuration();
      };

      this.getCurrentTime = function() {
        return this.player.getCurrentTime();
      };

      this.getBytesLoaded = function() {
        return this.player.getVideoBytesLoaded();
      };

      this.getBytesTotal = function() {
        return this.player.getVideoBytesTotal();
      };

      this.getEmbedCode = function() {
        return this.player.getVideoEmbedCode();
      };

      this.getMediaLink = function() {
        return this.player.getVideoUrl();
      };

      this.hasControls = function() {
        return true;
      };
      this.showControls = function(show) {};
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
    })( this, options, onUpdate );
  };
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
 */

  

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    volume:80,
    autostart:false,
    streamer:"",
    embedWidth:450,
    embedHeight:337,
    wmode:"transparent",
    forceOverflow:false,
    quality:"default",
    repeat:false
  });

  jQuery.fn.mediadisplay = function( options ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( mediaWrapper, options ) {
      this.settings = jQuery.media.utils.getSettings( options );
      this.display = mediaWrapper;
      var _this = this;
      this.volume = -1;
      this.player = null;
      this.preview = '';
      this.updateInterval = null;
      this.progressInterval = null;
      this.playQueue = [];
      this.playIndex = 0;
      this.playerReady = false;
      this.loaded = false;
      this.mediaFile = null;
      this.hasPlaylist = false;

      // If they provide the forceOverflow variable, then that means they
      // wish to force the media player to override all parents overflow settings.
      if( this.settings.forceOverflow ) {
        // Make sure that all parents have overflow visible so that
        // browser full screen will always work.
        this.display.parents().css("overflow", "visible");
      }

      this.reset = function() {
        this.loaded = false;
        this.stopMedia();
        clearInterval( this.progressInterval );
        clearInterval( this.updateInterval );
        this.playQueue.length = 0;
        this.playQueue = [];
        this.playIndex = 0;
        this.playerReady = false;
        this.mediaFile = null;
        this.display.empty().trigger( "mediaupdate", {type:"reset"} );
      };

      // Returns the media that has the lowest weight value, which means
      // this player prefers that media over the others.
      this.getPlayableMedia = function( files ) {
        var mFile = null;
        var i = files.length;
        while(i--) {
          var tempFile = new jQuery.media.file( files[i], this.settings );
          if( !mFile || (tempFile.weight < mFile.weight) ) {
            mFile = tempFile;
          }
        }
        return mFile;
      };

      // Returns a valid media file for this browser.
      this.getMediaFile = function( file ) {
        if( file ) {
          var type = typeof file;
          if( ((type === 'object') || (type === 'array')) && file[0] ) {
            file = this.getPlayableMedia( file );
          }
        }
        return file;
      };

      // Adds a media file to the play queue.
      this.addToQueue = function( file ) {
        if( file ) {
          this.playQueue.push( this.getMediaFile( file ) );
        }
      };

      this.loadFiles = function( files ) {
        if( files ) {
          this.playQueue.length = 0;
          this.playQueue = [];
          this.playIndex = 0;
          this.addToQueue( files.intro );
          this.addToQueue( files.commercial );
          this.addToQueue( files.prereel );
          this.addToQueue( files.media );
          this.addToQueue( files.postreel );
        }
        var hasMedia = (this.playQueue.length > 0);
        if( !hasMedia ) {
          if (this.player) {
            // Destroy the current player.
            this.player.destroy();
            this.player = null;
          }

          this.display.trigger( "mediaupdate", {type:"nomedia"} );
        }
        return hasMedia;
      };

      this.playNext = function() {
        if( this.playQueue.length > this.playIndex ) {
          this.loadMedia( this.playQueue[this.playIndex] );
          this.playIndex++;
        }
        else if( this.settings.repeat ) {
          this.playIndex = 0;
          this.playNext();
        }
        else if( this.hasPlaylist ) {
          this.reset();
        }
        else {
          // If there is no playlist, and no repeat, we will
          // just seek to the beginning and pause.
          this.loaded = false;
          this.settings.autostart = false;
          this.playIndex = 0;
          this.playNext();
        }
      };

      this.loadMedia = function( file, mediaplayer ) {
        if( file ) {
          // Get the media file object.
          file = new jQuery.media.file( this.getMediaFile( file ), this.settings );

          // Set the media player if they force it.
          file.player = mediaplayer ? mediaplayer : file.player;

          // Stop the current player.
          this.stopMedia();

          if( !this.mediaFile || (this.mediaFile.player != file.player) ) {
            // Reset our player variables.
            this.player = null;
            this.playerReady = false;

            // Create a new media player.
            if( file.player ) {
              // Set the new media player.
              this.player = this.display["media" + file.player]( this.settings, function( data ) {
                _this.onMediaUpdate( data );
              });
            }

            if( this.player ) {
              // Create our media player.
              this.player.createMedia( file, this.preview );
            }
          }
          else if( this.player ) {
            // Load our file into the current player.
            this.player.loadMedia( file );
          }

          // Save this file.
          this.mediaFile = file;

          // Send out an update about the initialize.
          this.onMediaUpdate({
            type:"initialize"
          });
        }
      };

      this.onMediaUpdate = function( data ) {
        // Now trigger the media update message.
        switch( data.type ) {
          case "playerready":
            this.playerReady = true;
            this.player.setVolume(0);
            this.player.setQuality(this.settings.quality);
            this.startProgress();
            break;
          case "buffering":
            this.startProgress();
            break;
          case "stopped":
            clearInterval( this.progressInterval );
            clearInterval( this.updateInterval );
            break;
          case "error":
            if( data.code == 4 ) {
              // It is saying not supported... Try and fall back to flash...
              this.loadMedia(this.mediaFile, "flash");
            }
            else {
              clearInterval( this.progressInterval );
              clearInterval( this.updateInterval );
            }
            break;
          case "paused":
            clearInterval( this.updateInterval );
            break;
          case "playing":
            this.startUpdate();
            break;
          case "progress":
            var percentLoaded = this.getPercentLoaded();
            jQuery.extend( data, {
              percentLoaded:percentLoaded
            });
            if( percentLoaded >= 1 ) {
              clearInterval( this.progressInterval );
            }
            break;
          case "meta":
            jQuery.extend( data, {
              currentTime:this.player.getCurrentTime(),
              totalTime:this.getDuration(),
              volume: this.player.getVolume(),
              quality: this.getQuality()
            });
            break;
          case "durationupdate":
            this.mediaFile.duration = data.duration;
            break;
          case "complete":
            this.playNext();
            break;
          default:
            break;
        }

        // If this is the playing state, we want to pause the video.
        if( data.type=="playing" && !this.loaded ) {
          if( this.settings.autoLoad && !this.settings.autostart ) {
            setTimeout( function() {
              _this.setVolume();
              _this.player.pauseMedia();
              _this.settings.autostart = true;
              _this.loaded = true;
            }, 100 );
          }
          else {
            this.loaded = true;
            this.setVolume();
            this.display.trigger( "mediaupdate", data );
          }
        }
        else {
          this.display.trigger( "mediaupdate", data );
        }
      };

      this.startProgress = function() {
        if( this.playerReady ) {
          clearInterval( this.progressInterval );
          this.progressInterval = setInterval( function() {
            _this.onMediaUpdate( {
              type:"progress"
            } );
          }, 500 );
        }
      };

      this.startUpdate = function() {
        if( this.playerReady ) {
          clearInterval( this.updateInterval );
          this.updateInterval = setInterval( function() {
            if( _this.playerReady ) {
              _this.onMediaUpdate({
                type:"update",
                currentTime:_this.player.getCurrentTime(),
                totalTime:_this.getDuration(),
                volume:_this.player.getVolume(),
                quality:_this.getQuality()
              });
            }
          }, 1000 );
        }
      };

      this.stopMedia = function() {
        this.loaded = false;
        clearInterval( this.progressInterval );
        clearInterval( this.updateInterval );
        if( this.playerReady ) {
          this.player.stopMedia();
        }
      };

      this.mute = function( on ) {
        this.player.setVolume( on ? 0 : this.volume );
      };

      this.onResize = function() {
        if( this.player && this.player.onResize ) {
          this.player.onResize();
        }
      };

      this.getPercentLoaded = function() {
        if( this.player.getPercentLoaded ) {
          return this.player.getPercentLoaded();
        }
        else {
          var bytesLoaded = this.player.getBytesLoaded();
          var bytesTotal = this.mediaFile.bytesTotal ? this.mediaFile.bytesTotal : this.player.getBytesTotal();
          return bytesTotal ? (bytesLoaded / bytesTotal) : 0;
        }
      };

      this.showControls = function(show) {
        if( this.playerReady ) {
          this.player.showControls(show);
        }
      };

      this.hasControls = function() {
        if( this.player ) {
          return this.player.hasControls();
        }
        return false;
      };

      this.getDuration = function() {
        if( this.mediaFile ) {
          if(!this.mediaFile.duration ) {
            this.mediaFile.duration = this.player.getDuration();
          }
          return this.mediaFile.duration;
        }
        else {
          return 0;
        }
      };

      this.setVolume = function( vol ) {
        this.volume = vol ? vol : ((this.volume == -1) ? (this.settings.volume / 100) : this.volume);
        if( this.player ) {
          this.player.setVolume(this.volume);
        }
      };

      this.getVolume = function() {
        if( !this.volume ) {
          this.volume = this.player.getVolume();
        }
        return this.volume;
      };

      this.getQuality = function() {
        if( !this.mediaFile.quality ) {
          this.mediaFile.quality = this.player.getQuality();
        }
        return this.mediaFile.quality;
      };
    })( this, options );
  };
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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    apiKey:"",
    api:2,
    sessid:"",
    drupalVersion:6
  });

  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the drupal server object.
    drupal : function( protocol, settings ) {
      // Return a new server object.
      return new (function( protocol, settings ) {
        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;
   
        var hasKey = (settings.apiKey.length > 0);
        var usesKey = (settings.api == 1);
        var nodeGet = (settings.drupalVersion >= 6) ? "node.get" : "node.load";
        var autoProtocol = (settings.protocol == "auto");
   
        // Set up the commands.
        jQuery.media = jQuery.extend( {}, {
          commands : {
            connect:{command:{rpc:"system.connect", json:""}, useKey:usesKey, protocol:"rpc"},
            mail:{command:{rpc:"system.mail", json:""}, useKey:hasKey, protocol:"rpc"},
            loadNode:{command:{rpc:nodeGet, json:"mediafront_getnode"}, useKey:usesKey, protocol:"json"},
            getPlaylist:{command:{rpc:"mediafront.getPlaylist", json:"mediafront_getplaylist"}, useKey:usesKey, protocol:"json"},
            getVote:{command:{rpc:"vote.getVote", json:""}, useKey:usesKey, protocol:"rpc"},
            setVote:{command:{rpc:"vote.setVote", json:""}, useKey:hasKey, protocol:"rpc"},
            getUserVote:{command:{rpc:"vote.getUserVote", json:""}, useKey:usesKey, protocol:"rpc"},
            deleteVote:{command:{rpc:"vote.deleteVote", json:""}, useKey:hasKey, protocol:"rpc"},
            addTag:{command:{rpc:"tag.addTag", json:""}, useKey:hasKey, protocol:"rpc"},
            incrementCounter:{command:{rpc:"mediafront.incrementNodeCounter", json:""}, useKey:hasKey, protocol:"rpc"},
            setFavorite:{command:{rpc:"favorites.setFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
            deleteFavorite:{command:{rpc:"favorites.deleteFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
            isFavorite:{command:{rpc:"favorites.isFavorite", json:""}, useKey:usesKey, protocol:"rpc"},
            login:{command:{rpc:"user.login", json:""}, useKey:hasKey, protocol:"rpc"},
            logout:{command:{rpc:"user.logout", json:""}, useKey:hasKey, protocol:"rpc"},
            adClick:{command:{rpc:"mediafront.adClick", json:""}, useKey:hasKey, protocol:"rpc"},
            getAd:{command:{rpc:"mediafront.getAd", json:""}, useKey:usesKey, protocol:"rpc"},
            setUserStatus:{command:{rpc:"mediafront.setUserStatus", json:""}, useKey:hasKey, protocol:"rpc"}
          }
        }, jQuery.media);
   
        // Public variables.
        this.user = {};
        this.sessionId = "";
        this.onConnected = null;
        this.encoder = new jQuery.media.sha256();
            
        // Cache this... it is a little processor intensive.
        // The baseURL has an ending "/".   We need to truncate this, and then remove the "http://"
        this.baseURL = settings.baseURL.substring(0,(settings.baseURL.length - 1)).replace(/^(http[s]?\:[\\\/][\\\/])/,'');
            
        this.connect = function( onSuccess ) {
          this.onConnected = onSuccess;
          // If they provide the session Id, then we can skip this call.
          if( settings.sessid ) {
            this.onConnect({
              sessid:settings.sessid
              });
          }
          else {
            this.call( jQuery.media.commands.connect, function( result ) {
              _this.onConnect( result );
            }, null );
          }
        };
   
        this.call = function( command, onSuccess, onFailed ) {
          var args = [];
          for (var i=3; i<arguments.length; i++) {
            args.push(arguments[i]);
          }
          args = this.setupArgs( command, args );
          var type = autoProtocol ? command.protocol : settings.protocol;
          var method = command.command[type];
          if( method ) {
            protocol.call( method, onSuccess, onFailed, args, type );
          }
          else if( onSuccess ) {
            onSuccess( null );
          }
        };
   
        this.setupArgs = function( command, args ) {
          args.unshift( this.sessionId );
          if ( command.useKey ) {
            if( settings.api > 1 ) {
              var timestamp = this.getTimeStamp();
              var nonce = this.getNonce();
              var hash = this.computeHMAC( timestamp, this.baseURL, nonce, command.command.rpc, settings.apiKey);
              args.unshift( nonce );
              args.unshift( timestamp );
              args.unshift( this.baseURL );
              args.unshift( hash );
            }
            else {
              args.unshift( settings.apiKey );
            }
          }
          return args;
        };
   
        this.getTimeStamp = function() {
          return (parseInt(new Date().getTime() / 1000, 10)).toString();
        };
   
        this.getNonce = function() {
          var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
          var randomString = '';
          for (var i=0; i<10; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum,rnum+1);
          }
          return randomString;
        };
   
        this.computeHMAC = function( timestamp, baseURL, nonce, command, apiKey ) {
          var input = timestamp + ";" + baseURL + ";" + nonce + ";" + command;
          return this.encoder.encrypt( apiKey, input );
        };
   
        this.onConnect = function( result ) {
          if( result ) {
            this.sessionId = result.sessid;
            this.user = result.user;
          }
          if( this.onConnected ) {
            this.onConnected( result );
          }
        };
      })( protocol, settings );
    }
  }, jQuery.media );
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
 */

  
   
  // Checks the file type for browser compatibilty.
  jQuery.media.checkPlayType = function( elem, playType ) {
    if( (typeof elem.canPlayType) == 'function' ) {
      return ("no" !== elem.canPlayType(playType)) && ("" !== elem.canPlayType(playType));
    }
    else {
      return false;
    }
  };
   
  // Get's all of the types that this browser can play.
  jQuery.media.getPlayTypes = function() {
    var types = {};
      
    // Check for video types...
    var elem = document.createElement("video");
    types.ogg  = jQuery.media.checkPlayType( elem, 'video/ogg; codecs="theora, vorbis"');
    types.h264  = jQuery.media.checkPlayType( elem, 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    types.webm = jQuery.media.checkPlayType( elem, 'video/webm; codecs="vp8, vorbis"');
         
    // Now check for audio types...
    elem = document.createElement("audio");
    types.audioOgg = jQuery.media.checkPlayType( elem, "audio/ogg");
    types.mp3 = jQuery.media.checkPlayType( elem, "audio/mpeg");
                      
    return types;
  };
   
  // The play types for the media player.
  jQuery.media.playTypes = null;
   
  // The constructor for our media file object.
  jQuery.media.file = function( file, settings ) {
    // Only set the play types if it has not already been set.
    if( !jQuery.media.playTypes ) {
      jQuery.media.playTypes = jQuery.media.getPlayTypes();
    }
      
    // Normalize the file object passed to this constructor.
    file = (typeof file === "string") ? {
      path:file
    } : file;
      
    // The duration of the media file.
    this.duration = file.duration ? file.duration : 0;
    this.bytesTotal = file.bytesTotal ? file.bytesTotal : 0;
    this.quality = file.quality ? file.quality : 0;
    this.stream = settings.streamer ? settings.streamer : file.stream;
    this.path = file.path ? jQuery.trim(file.path) : ( settings.baseURL + jQuery.trim(file.filepath) );
    this.extension = file.extension ? file.extension : this.getFileExtension();
    this.weight = file.weight ? file.weight : this.getWeight();
    this.player = file.player ? file.player : this.getPlayer();
    this.mimetype = file.mimetype ? file.mimetype : this.getMimeType();
    this.type = file.type ? file.type : this.getType();
  };

  // Get the file extension.
  jQuery.media.file.prototype.getFileExtension = function() {
    return this.path.substring(this.path.lastIndexOf(".") + 1).toLowerCase();
  };
   
  // Get the player for this media.
  jQuery.media.file.prototype.getPlayer = function() {
    switch( this.extension )
    {
      case "ogg":case "ogv":
        return jQuery.media.playTypes.ogg ? "html5" : "flash";
         
      case "mp4":case "m4v":
        return jQuery.media.playTypes.h264 ? "html5" : "flash";
         
      case "webm":
        return jQuery.media.playTypes.webm ? "html5" : "flash";
         
      case "oga":
        return jQuery.media.playTypes.audioOgg ? "html5" : "flash";
            
      case "mp3":
        return jQuery.media.playTypes.mp3 ? "html5" : "flash";
            
      case "swf":case "flv":case "f4v":case "f4a":
      case "mov":case "3g2":case "3gp":case "3gpp":
      case "m4a":case "aac":case "wav":case "aif":
      case "wma":
        return "flash";
             
      default:
        // Now iterate through all of our registered players.
        for( var player in jQuery.media.playerTypes ) {
          if( jQuery.media.playerTypes.hasOwnProperty( player ) ) {
            if( jQuery.media.playerTypes[player]( this.path ) ) {
              return player;
            }
          }
        }
        break;
    }
    return "flash";
  };
   
  // Get the type of media this is...
  jQuery.media.file.prototype.getType = function() {
    switch( this.extension ) {
      case"swf":case "webm":case "ogg":case "ogv":
      case "mp4":case "m4v":case "flv":case "f4v":
      case "mov":case "3g2":case "3gp":case "3gpp":
        return "video";
      case "oga":case "mp3":case "f4a":case "m4a":
      case "aac":case "wav":case "aif":case "wma":
        return "audio";
      default:
        break;
    }
    return '';
  };

  // Get the preference "weight" of this media type.
  // The lower the number, the higher the preference.
  jQuery.media.file.prototype.getWeight = function() {
    switch( this.extension ) {
      case 'mp4':case 'm4v':case 'm4a':
        return jQuery.media.playTypes.h264 ? 3 : 7;
      case'webm':
        return jQuery.media.playTypes.webm ? 4 : 8;
      case 'ogg':case 'ogv':
        return jQuery.media.playTypes.ogg ? 5 : 20;
      case 'oga':
        return jQuery.media.playTypes.audioOgg ? 5 : 20;
      case 'mp3':
        return 6;
      case 'mov':case'swf':case 'flv':case 'f4v':
      case 'f4a':case '3g2':case '3gp':case '3gpp':
        return 9;
      case 'wav':case 'aif':case 'aac':
        return 10;
      case 'wma':
        return 11;
      default:
        break;     
    }
    return 0;
  };

  // Return the best guess mime type for the given file.
  jQuery.media.file.prototype.getMimeType = function() {
    switch( this.extension ) {
      case 'mp4':case 'm4v':case 'flv':case 'f4v':
        return 'video/mp4';
      case'webm':
        return 'video/x-webm';
      case 'ogg':case 'ogv':
        return 'video/ogg';
      case '3g2':
        return 'video/3gpp2';
      case '3gpp':
      case '3gp':
        return 'video/3gpp';
      case 'mov':
        return 'video/quicktime';
      case'swf':
        return 'application/x-shockwave-flash';
      case 'oga':
        return 'audio/ogg';
      case 'mp3':
        return 'audio/mpeg';
      case 'm4a':case 'f4a':
        return 'audio/mp4';
      case 'aac':
        return 'audio/aac';
      case 'wav':
        return 'audio/vnd.wave';
      case 'wma':
        return 'audio/x-ms-wma';
      default:
        break;
    }
    return '';
  };
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
 */

  window.onFlashPlayerReady = function( id ) {
    jQuery.media.players[id].node.player.media.player.onReady();
  };

  window.onFlashPlayerUpdate = function( id, eventType ) {
    jQuery.media.players[id].node.player.media.player.onMediaUpdate( eventType );
  };

  window.onFlashPlayerDebug = function( debug ) {
    if( window.console && console.log ) {
      console.log( debug );
    }
  };

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    flashPlayer:"./flash/mediafront.swf",
    skin:"default",
    config:"nocontrols"
  });

  jQuery.fn.mediaflash = function( settings, onUpdate ) {
    return new (function( video, settings, onUpdate ) {
      settings = jQuery.media.utils.getSettings( settings );
      this.display = video;
      var _this = this;
      this.player = null;
      this.mediaFile = null;
      this.preview = '';
      this.ready = false;

      // Translate the messages.
      this.translate = {
        "mediaConnected":"connected",
        "mediaBuffering":"buffering",
        "mediaPaused":"paused",
        "mediaPlaying":"playing",
        "mediaStopped":"stopped",
        "mediaComplete":"complete",
        "mediaMeta":"meta"
      };

      // When to show the busy cursor.
      this.busy = {
        "mediaConnected":false,
        "mediaBuffering":"show",
        "mediaPaused":"hide",
        "mediaPlaying":"hide",
        "mediaStopped":false,
        "mediaComplete":false,
        "mediaMeta":false
      };

      this.createMedia = function( mediaFile, preview ) {
        this.mediaFile = mediaFile;
        this.preview = preview;
        this.ready = false;
        var playerId = (settings.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = settings.flashPlayer + "?rand=" + rand;
        var flashvars = {
          config:settings.config,
          id:settings.id,
          file:mediaFile.path,
          image:this.preview,
          skin:settings.skin,
          autostart:(settings.autostart || !settings.autoLoad)
        };
        if( mediaFile.stream ) {
          flashvars.stream = mediaFile.stream;
        }
        if( settings.debug ) {
          flashvars.debug = "1";
        }
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          flashvars,
          settings.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.loadMedia = function( mediaFile ) {
        if( this.player && this.ready ) {
          this.mediaFile = mediaFile;

          // Load the new media file into the Flash player.
          this.player.loadMedia( mediaFile.path, mediaFile.stream );

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );
        }
      };

      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          onUpdate( {
            type:"playerready"
          } );
        }
      };

      this.onMediaUpdate = function( eventType ) {
        onUpdate( {
          type:this.translate[eventType],
          busy:this.busy[eventType]
        });
      };

      this.playMedia = function() {
        if( this.player && this.ready ) {
          this.player.playMedia();
        }
      };

      this.pauseMedia = function() {
        if( this.player && this.ready ) {
          this.player.pauseMedia();
        }
      };

      this.stopMedia = function() {
        if( this.player && this.ready ) {
          this.player.stopMedia();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (settings.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if( this.player && this.ready ) {
          this.player.seekMedia( pos );
        }
      };

      this.setVolume = function( vol ) {
        if( this.player && this.ready ) {
          this.player.setVolume( vol );
        }
      };

      this.getVolume = function() {
        return (this.player && this.ready) ? this.player.getVolume() : 0;
      };

      this.getDuration = function() {
        return (this.player && this.ready) ? this.player.getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return (this.player && this.ready) ? this.player.getCurrentTime() : 0;
      };

      this.getBytesLoaded = function() {
        return (this.player && this.ready) ? this.player.getMediaBytesLoaded() : 0;
      };

      this.getBytesTotal = function() {
        return (this.player && this.ready) ? this.player.getMediaBytesTotal() : 0;
      };

      this.hasControls = function() {
        return true;
      };

      this.showControls = function(show) {
        if( this.player && this.ready ) {
          this.player.showPlugin("controlBar", show);
          this.player.showPlugin("playLoader", show);
        }
      };

      this.getEmbedCode = function() {
        var flashVars = {
          config:"config",
          id:"mediafront_player",
          file:this.mediaFile.path,
          image:this.preview,
          skin:settings.skin
        };
        if( this.mediaFile.stream ) {
          flashVars.stream = this.mediaFile.stream;
        }
        return jQuery.media.utils.getFlash(
          settings.flashPlayer,
          "mediafront_player",
          settings.embedWidth,
          settings.embedHeight,
          flashVars,
          settings.wmode );
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      //this.setSize = function( newWidth, newHeight ) {};
      this.getMediaLink = function() {
        return "This video currently does not have a link.";
      };
    })( this, settings, onUpdate );
  };
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
 */

  jQuery.fn.mediahtml5 = function( options, onUpdate ) {
    return new (function( media, options, onUpdate ) {
      this.display = media;
      var _this = this;
      this.player = null;
      this.bytesLoaded = 0;
      this.bytesTotal = 0;
      this.mediaType = "";
      this.loaded = false;
      this.mediaFile = null;
      this.playerElement = null;

      this.getPlayer = function( mediaFile, preview ) {
        this.mediaFile = mediaFile;
        var playerId = options.id + '_' + this.mediaType;
        var html = '<' + this.mediaType + ' style="position:absolute" id="' + playerId + '"';
        html += preview ? ' poster="' + preview + '"' : '';

        if( typeof mediaFile === 'array' ) {
          html += '>';
          var i = mediaFile.length;
          while(i) {
            i--;
            html += '<source src="' + mediaFile[i].path + '" type="' + mediaFile[i].mimetype + '">';
          }
        }
        else {
          html += ' src="' + mediaFile.path + '">Unable to display media.';
        }

        html += '</' + this.mediaType + '>';
        this.display.append( html );
        this.bytesTotal = mediaFile.bytesTotal;
        this.playerElement = this.display.find('#' + playerId);
        this.onResize();

        // return the player object.
        return this.playerElement.eq(0)[0];
      };

      // Create a new HTML5 player.
      this.createMedia = function( mediaFile, preview ) {
        // Remove any previous Flash players.
        jQuery.media.utils.removeFlash( this.display, options.id + "_media" );
        this.display.children().remove();
        this.mediaType = this.getMediaType( mediaFile );
        this.player = this.getPlayer( mediaFile, preview );
        this.loaded = false;
        var timeupdated = false;
        if( this.player ) {
          this.player.addEventListener( "abort", function() {
            onUpdate( {
              type:"stopped"
            } );
          }, true);
          this.player.addEventListener( "loadstart", function() {
            onUpdate( {
              type:"ready",
              busy:"show"
            });

            _this.onReady();
          }, true);
          this.player.addEventListener( "loadeddata", function() {
            onUpdate( {
              type:"loaded",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "loadedmetadata", function() {
            onUpdate( {
              type:"meta"
            } );
          }, true);
          this.player.addEventListener( "canplaythrough", function() {
            onUpdate( {
              type:"canplay",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "ended", function() {
            onUpdate( {
              type:"complete"
            } );
          }, true);
          this.player.addEventListener( "pause", function() {
            onUpdate( {
              type:"paused"
            } );
          }, true);
          this.player.addEventListener( "play", function() {
            onUpdate( {
              type:"playing"
            } );
          }, true);
          this.player.addEventListener( "playing", function() {
            onUpdate( {
              type:"playing",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "error", function(e) {
            _this.onError(e.target.error);
            onUpdate( {
              type:"error",
              code:e.target.error.code
            } );
          }, true);
          this.player.addEventListener( "waiting", function() {
            onUpdate( {
              type:"waiting",
              busy:"show"
            });
          }, true);
          this.player.addEventListener( "timeupdate", function() {
            if( timeupdated ) {
              onUpdate( {
                type:"timeupdate",
                busy:"hide"
              });
            }
            else {
              timeupdated = true;
            }
          }, true);
          this.player.addEventListener( "durationchange", function() {
            if( this.duration && (this.duration !== Infinity) ) {
              onUpdate( {
                type:"durationupdate",
                duration:this.duration
              });
            }
          }, true);

          // Now add the event for getting the progress indication.
          this.player.addEventListener( "progress", function( event ) {
            _this.bytesLoaded = event.loaded;
            _this.bytesTotal = event.total;
          }, true);

          this.player.autoplay = true;

          if (typeof this.player.hasAttribute == "function" && this.player.hasAttribute("preload") && this.player.preload != "none") {
            this.player.autobuffer = true;
          } else {
            this.player.autobuffer = false;
            this.player.preload = "none";
          }

          onUpdate({
            type:"playerready"
          });
        }
      };

      // A function to be called when an error occurs.
      this.onError = function( error ) {
        switch(error.code) {
          case 1:
            console.log("Error: MEDIA_ERR_ABORTED");
            break;
          case 2:
            console.log("Error: MEDIA_ERR_DECODE");
            break;
          case 3:
            console.log("Error: MEDIA_ERR_NETWORK");
            break;
          case 4:
            console.log("Error: MEDIA_ERR_SRC_NOT_SUPPORTED");
            break;
          default:
            break;
        }
      };

      // Called when the media has started loading.
      this.onReady = function() {
        if( !this.loaded ) {
          this.loaded = true;
          this.playMedia();
        }
      };

      // Load new media into the HTML5 player.
      this.loadMedia = function( mediaFile ) {
        this.mediaFile = mediaFile;
        this.createMedia( mediaFile );
      };

      this.getMediaType = function( mediaFile ) {
        var extension = (typeof mediaFile === 'array') ? mediaFile[0].extension : mediaFile.extension;
        switch( extension ) {
          case "ogg": case "ogv": case "mp4": case "m4v":
            return "video";

          case "oga": case "mp3":
            return "audio";

          default:
            break;
        }
        return "video";
      };

      this.playMedia = function() {
        if( this.player && this.player.play ) {
          this.player.play();
        }
      };

      this.pauseMedia = function() {
        if( this.player && this.player.pause ) {
          this.player.pause();
        }
      };

      this.stopMedia = function() {
        this.pauseMedia();
        if( this.player ) {
          this.player.src = "";
        }
      };

      this.destroy = function() {
        this.stopMedia();
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if( this.player ) {
          this.player.currentTime = pos;
        }
      };

      this.setVolume = function( vol ) {
        if( this.player ) {
          this.player.volume = vol;
        }
      };

      this.getVolume = function() {
        return this.player ? this.player.volume : 0;
      };

      this.getDuration = function() {
        var dur = this.player ? this.player.duration : 0;
        return (dur === Infinity) ? 0 : dur;
      };

      this.getCurrentTime = function() {
        return this.player ? this.player.currentTime : 0;
      };

      this.getPercentLoaded = function() {
        if( this.player && this.player.buffered && this.player.duration ) {
          return (this.player.buffered.end(0) / this.player.duration);
        }
        else if( this.bytesTotal ) {
          return (this.bytesLoaded / this.bytesTotal);
        }
        else {
          return 0;
        }
      };

      // Called when the player resizes.
      this.onResize = function() {
        // If this is a video, set the width and height of the video element.
        if( this.mediaType == "video" ) {
          this.playerElement.css({width:this.display.width(), height:this.display.height()});
        }
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      this.hasControls = function() {
        return false;
      };
      this.showControls = function(show) {};
      //this.setSize = function( newWidth, newHeight ) {};
      this.getEmbedCode = function() {

        // Only return the Flash embed if this is a Flash playable media field.
        if( (this.mediaFile.extension == 'mp4') ||
            (this.mediaFile.extension == 'm4v') ||
            (this.mediaFile.extension == 'webm') ) {
          var flashVars = {
            config:"config",
            id:"mediafront_player",
            file:this.mediaFile.path,
            image:this.preview,
            skin:options.skin
          };
          if( this.mediaFile.stream ) {
            flashVars.stream = this.mediaFile.stream;
          }
          return jQuery.media.utils.getFlash(
            options.flashPlayer,
            "mediafront_player",
            options.embedWidth,
            options.embedHeight,
            flashVars,
            options.wmode );
        }
        else {
          return "This media does not support embedding.";
        }
      };
      this.getMediaLink = function() {
        return "This media currently does not have a link.";
      };
    })( this, options, onUpdate );
  };
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
 */

  /**
    * Load and scale an image while maintining original aspect ratio.
    */
  jQuery.fn.mediaimage = function( link, fitToImage ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( container, link, fitToImage ) {
      this.display = container;
      var _this = this;

      var ratio = 0;
      var imageLoaded = false;

      // Now create the image loader, and add the loaded handler.
      this.imgLoader = new Image();
      this.imgLoader.onload = function() {
        imageLoaded = true;
        ratio = (_this.imgLoader.width / _this.imgLoader.height);
        _this.resize();
        _this.display.trigger( "imageLoaded" );
      };

      // Set the container to not show any overflow...
      container.css("overflow", "hidden");

      // Check to see if this image is completely loaded.
      this.loaded = function() {
        return this.imgLoader.complete;
      };

      // Resize the image.
      this.resize = function( newWidth, newHeight ) {
        var rectWidth = fitToImage ? this.imgLoader.width : (newWidth ? newWidth : this.display.width());
        var rectHeight = fitToImage ? this.imgLoader.height : (newHeight ? newHeight : this.display.height());
        if( rectWidth && rectHeight && imageLoaded ) {
          // Now resize the image in the container...
          var rect = jQuery.media.utils.getScaledRect( ratio, {
            width:rectWidth,
            height:rectHeight
          });

          // Now set this image to the new size.
          if( this.image ) {
            this.image.attr( "src", this.imgLoader.src ).css({
              marginLeft:rect.x,
              marginTop:rect.y,
              width:rect.width,
              height:rect.height
            });
          }

          // Show the container.
          this.image.fadeIn();
        }
      };

      // Clears the image.
      this.clear = function() {
        imageLoaded = false;
        if( this.image ) {
          this.image.attr("src", "");
          this.imgLoader.src = '';
          this.image.fadeOut( function() {
            if( link ) {
              $(this).parent().remove();
            }
            else {
              $(this).remove();
            }
          });
        }
      };

      // Refreshes the image.
      this.refresh = function() {
        this.resize();
      };

      // Load the image.
      this.loadImage = function( src ) {
        // Now add the image object.
        this.clear();
        this.image = $(document.createElement('img')).attr({
          src:""
        }).hide();
        if( link ) {
          this.display.append($(document.createElement('a')).attr({
            target:"_blank",
            href:link
          }).append(this.image));
        }
        else {
          this.display.append(this.image);
        }
        this.imgLoader.src = src;
      };
    })( this, link, fitToImage );
  };

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
 */

  
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the json server object.
    json : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        var _this = this;
            
        // ************************************************
        // This code is from http://kelpi.com/script/a85cbb
        // ************************************************
            
        // A character conversion map
        var m = {
          '\b':'\\b',
          '\t':'\\t',
          '\n':'\\n',
          '\f':'\\f',
          '\r':'\\r',
          '"':'\\"',
          '\\':'\\\\'
        };
            
        // Map type names to functions for serializing those types
        var s = {
          'boolean': function (x) {
            return String(x);
          },
          'null': function (x) {
            return "null";
          },
          number: function (x) {
            return isFinite(x) ? String(x) : 'null';
          },
          string: function (x) {
            if (/["\\\x00-\x1f]/.test(x)) {
              x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if (c) {
                  return c;
                }
                c = b.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
              });
            }
            return '"' + x + '"';
          },
          array: function (x) {
            var a = ['['], b, f, i, l = x.length, v;
            for (i = 0; i < l; i += 1) {
              v = x[i];
              f = s[typeof v];
              if (f) {
                v = f(v);
                if (typeof v == 'string') {
                  if (b) {
                    a[a.length] = ',';
                  }
                  a[a.length] = v;
                  b = true;
                }
              }
            }
            a[a.length] = ']';
            return a.join('');
          },
          object: function (x) {
            if (x) {
              if (x instanceof Array) {
                return s.array(x);
              }
              var a = ['{'], b, f, i, v;
              for( i in x ) {
                if( x.hasOwnProperty(i) ) {
                  v = x[i];
                  f = s[typeof v];
                  if(f) {
                    v = f(v);
                    if (typeof v == 'string') {
                      if (b) {
                        a[a.length] = ',';
                      }
                      a.push(s.string(i), ':', v);
                      b = true;
                    }
                  }
                }
              }
              a[a.length] = '}';
              return a.join('');
            }
            return 'null';
          }
        };
            
        // Public function to serialize any object to JSON format.
        this.serializeToJSON = function( o ) {
          return s.object(o);
        };
            
        //************************************************
        // End of code from http://kelpi.com/script/a85cbb
        //************************************************
                            
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( settings.baseURL ) {
            // Add json functionality here.
            jQuery.ajax({
              "url": settings.baseURL + method,
              "dataType": "json",
              "type": "POST",
              "data": {
                methodName:method,
                params:this.serializeToJSON(params)
              },
              "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                if( onFailed ) {
                  onFailed( textStatus );
                }
                else if( window.console && console.log ) {
                  console.log( "Error: " + textStatus );
                }
              },
              "success": function( data ) {
                if( onSuccess ) {
                  onSuccess( data );
                }
              }
            });
          }
          else if( onSuccess ) {
            onSuccess( null );
          }
        };
      })( settings );
    }
  }, jQuery.media );

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
 */
 
  jQuery.fn.medialink = function( settings, onClick, data ) {
    data = data ? data : {
      noargs:true
    };
    return new (function( link, settings, onClick, data ) {
      var _this = this;
      this.display = link;
          
      this.display.css("cursor", "pointer").unbind("click").bind( "click", data, function( event ) {
        onClick( event, $(this) );
      }).unbind("mouseenter").bind("mouseenter", function() {
        if( settings.template.onLinkOver ) {
          settings.template.onLinkOver( $(this) );
        }
      }).unbind("mouseleave").bind("mouseleave", function() {
        if( settings.template.onLinkOut ) {
          settings.template.onLinkOut( $(this) );
        }
      });
    })( this, settings, onClick, data );
  };

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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    links:[],
    linksvertical:false
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    linkScroll:"#medialinkscroll"
  });
   
  jQuery.fn.medialinks = function( settings ) {
    return new (function( links, settings ) {

      // Get our settings.
      settings = jQuery.media.utils.getSettings(settings);
         
      // Save the jQuery display.
      this.display = links;
      var _this = this;
         
      // Keep track of the previous link.
      this.previousLink = null;

      // Setup the scroll region
      this.scrollRegion = links.find( settings.ids.linkScroll ).mediascroll({
        vertical:settings.linksvertical
      });
      this.scrollRegion.clear();

      // Load the links.
      this.loadLinks = function() {
        if( links.length > 0 ) {
          this.scrollRegion.clear();
          var onLinkClick = function( event, data ) {
            _this.setLink( data );
          };
               
          var i = settings.links.length;
          while(i) {
            i--;
            // Add this link to the scroll region.
            var link = this.scrollRegion.newItem().playlistlink( settings, settings.links[i] );
            link.unbind("linkclick").bind("linkclick", onLinkClick);
          }
          // Activate the scroll region.
          this.scrollRegion.activate();
        }
      };

      // Set the active link.
      this.setLink = function( link ) {

        // If there is a previous link, then unactivate it.
        if( this.previousLink ) {
          this.previousLink.setActive(false);
        }

        // Add the active class to the clicked target.
        link.setActive(true);

        // Store this target for later.
        this.previousLink = link;
      };
    })( this, settings );
  };
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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    close:"#mediamenuclose",
    embed:"#mediaembed",
    elink:"#mediaelink",
    email:"#mediaemail"
  });
   
  jQuery.fn.mediamenu = function( server, settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( server, menu, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
      var _this = this;
      this.display = menu;
         
      this.on = false;
         
      this.contents = [];
      this.prevItem = {
        id:0,
        link:null,
        contents:null
      };
         
      this.close = this.display.find( settings.ids.close );
      this.close.unbind("click").bind( "click", function() {
        _this.display.trigger( "menuclose" );
      });
         
      this.setMenuItem = function( link, itemId ) {
        if( this.prevItem.id != itemId ) {
          if( this.prevItem.id && settings.template.onMenuSelect ) {
            settings.template.onMenuSelect( this.prevItem.link, this.prevItem.contents, false );
          }
          
          var contents = this.contents[itemId];

          if( settings.template.onMenuSelect ) {
            settings.template.onMenuSelect( link, contents, true );
          }
          
          this.prevItem = {
            id:itemId,
            link:link,
            contents:contents
          };
        }
      };
         
      this.setEmbedCode = function( embed ) {
        this.setInputItem( settings.ids.embed, embed );
      };
         
         
      this.setMediaLink = function( mediaLink ) {
        this.setInputItem( settings.ids.elink , mediaLink );
      };
         
      this.setInputItem = function( id, value ) {
        var input = this.contents[id].find("input");
        input.unbind("click").bind("click", function() {
          $(this).select().focus();
        });
        input.attr("value", value );
      };
         
      var linkIndex = 0;
      this.links = this.display.find("a");
      this.links.each( function() {
        var link = $(this);
        if( link.length > 0 ) {
          var linkId = link.attr("href");
          var contents = _this.display.find(linkId);
          contents.hide();
          _this.contents[linkId] = contents;
          link.unbind("click").bind("click", {
            id:linkId,
            obj:link.parent()
          }, function( event ) {
            event.preventDefault();
            _this.setMenuItem( event.data.obj, event.data.id );
          });

          if( linkIndex === 0 ) {
            _this.setMenuItem( link.parent(), linkId );
          }
          linkIndex++;
        }
      });
        
         
    })( server, this, settings );
  };

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
 */

  

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    logo:"logo.png",
    logoWidth:49,
    logoHeight:15,
    logopos:"sw",
    logox:5,
    logoy:5,
    link:"http://www.mediafront.org",
    file:"",
    image:"",
    timeout:8,
    autoLoad:true
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    busy:"#mediabusy",
    preview:"#mediapreview",
    play:"#mediaplay",
    media:"#mediadisplay"
  });

  jQuery.fn.minplayer = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( player, settings ) {
      // Get the settings.
      settings = jQuery.media.utils.getSettings(settings);

      // Save the jQuery display.
      this.display = player;
      var _this = this;

      // If the player should auto load or not.
      this.autoLoad = settings.autoLoad;

      // Store the busy cursor and data.
      this.busy = player.find( settings.ids.busy );
      this.busyImg = this.busy.find("img");
      this.busyWidth = this.busyImg.width();
      this.busyHeight = this.busyImg.height();

      // Store the play overlay.
      this.play = player.find( settings.ids.play );
      // Toggle the play/pause state if they click on the play button.
      this.play.unbind("click").bind("click", function() {
        _this.togglePlayPause();
      });
      this.playImg = this.play.find("img");
      this.playWidth = this.playImg.width();
      this.playHeight = this.playImg.height();

      // Store the preview image.
      this.preview = player.find( settings.ids.preview ).mediaimage();
      if( this.preview ) {
        this.preview.display.unbind("click").bind("click", function() {
          _this.onMediaClick();
        });

        this.preview.display.unbind("imageLoaded").bind("imageLoaded", function() {
          _this.onPreviewLoaded();
        });
      }

      // The internal player controls.
      this.usePlayerControls = false;
      this.busyFlags = 0;
      this.busyVisible = false;
      this.playVisible = false;
      this.previewVisible = false;
      this.playing = false;
      this.hasMedia = false;
      this.timeoutId = 0;

      // Cache the width and height.
      this.width = this.display.width();
      this.height = this.display.height();

      // Hide or show an element.
      this.showElement = function( element, show, tween ) {
        if( element && !this.usePlayerControls ) {
          if( show ) {
            element.show(tween);
          }
          else {
            element.hide(tween);
          }
        }
      };

      this.showPlay = function( show, tween ) {
        show &= this.hasMedia;
        this.playVisible = show;
        this.showElement( this.play, show, tween );
      };

      this.showBusy = function( id, show, tween ) {
        if( show ) {
          this.busyFlags |= (1 << id);
        }
        else {
          this.busyFlags &= ~(1 << id);
        }

        // Set the busy cursor visiblility.
        this.busyVisible = (this.busyFlags > 0);
        this.showElement( this.busy, this.busyVisible, tween );

        // If the media has finished loading, then we don't need the
        // loader for the image.
        if (id==1 && !show) {
          this.showBusy(3, false);
        }
      };

      this.showPreview = function( show, tween ) {
        this.previewVisible = show;
        if( this.preview ) {
          this.showElement( this.preview.display, show, tween );
        }
      };

      // Handle the control events.
      this.onControlUpdate = function( data ) {
        if( this.media ) {
          // If the player is ready.
          if( this.media.playerReady ) {
            switch( data.type ) {
              case "play":
                this.media.player.playMedia();
                break;
              case "pause":
                this.media.player.pauseMedia();
                break;
              case "seek":
                this.media.player.seekMedia( data.value );
                break;
              case "volume":
                this.media.setVolume( data.value );
                break;
              case "mute":
                this.media.mute( data.value );
                break;
              default:
                break;
            }
          }
          // If there are files in the queue but no current media file.
          else if( (this.media.playQueue.length > 0) && !this.media.mediaFile ) {
            // They interacted with the player.  Always autoload at this point on.
            this.autoLoad = true;

            // Then play the next file in the queue.
            this.playNext();
          }

          // Let the template do something...
          if( settings.template && settings.template.onControlUpdate ) {
            settings.template.onControlUpdate( data );
          }
        }
      };

      // Handle the full screen event requests.
      this.fullScreen = function( full ) {
        if( settings.template.onFullScreen ) {
          settings.template.onFullScreen( full );
        }

        // Refresh the preview image.
        this.preview.refresh();
      };

      // Handle when the preview image loads.
      this.onPreviewLoaded = function() {
        this.previewVisible = true;
      };

      // Handle the media events.
      this.onMediaUpdate = function( data ) {
        switch( data.type ) {
          case "paused":
            this.playing = false;
            this.showPlay(true);
            //this.showBusy(1, false);
            if( !this.media.loaded ) {
              this.showPreview(true);
            }
            break;
          case "update":
          case "playing":
            this.playing = true;
            this.showPlay(false);
            this.showPreview((this.media.mediaFile.type == "audio"));
            break;
          case "initialize":
            this.playing = false;
            this.showPlay(true);
            this.showBusy(1, this.autoLoad);
            this.showPreview(true);
            break;
          case "buffering":
            this.showPlay(true);
            this.showPreview((this.media.mediaFile.type == "audio"));
            break;
          default:
            break;
        }

        // If they provide a busy cursor.
        if( data.busy ) {
          this.showBusy(1, (data.busy == "show"));
        }
      };

      // Called when the media is clicked.
      this.onMediaClick = function() {
        if( this.media.player && !this.media.hasControls() ) {
          if( this.playing ) {
            this.media.player.pauseMedia();
          }
          else {
            this.media.player.playMedia();
          }
        }
      };

      // Set the media player.
      this.media = this.display.find( settings.ids.media ).mediadisplay( settings );
      if( this.media ) {
        // If they click on the media region, then pause the media.
        this.media.display.unbind("click").bind("click", function() {
          _this.onMediaClick();
        });
      }

      // Sets the logo position.
      this.setLogoPos = function() {
        if( this.logo ) {
          var logocss = {};
          if( settings.logopos=='se' || settings.logopos=='sw' ) {
            logocss['bottom'] = settings.logoy;
          }
          if( settings.logopos=='ne' || settings.logopos=='nw' ) {
            logocss['top'] = settings.logoy;
          }
          if( settings.logopos=='nw' || settings.logopos=='sw' ) {
            logocss['left'] = settings.logox;
          }
          if( settings.logopos=='ne' || settings.logopos=='se' ) {
            logocss['right'] = settings.logox;
          }
          this.logo.display.css(logocss);
        }
      };

      // Add the logo.
      if( !settings.controllerOnly ) {
        this.display.prepend('<div class="' + settings.prefix + 'medialogo"></div>');
        this.logo = this.display.find("." + settings.prefix + "medialogo").mediaimage( settings.link );
        if( this.logo ) {
          this.logo.display.css({
            width:settings.logoWidth,
            height:settings.logoHeight
            });
          this.logo.display.bind("imageLoaded", function() {
            _this.setLogoPos();
          });
          this.logo.loadImage( settings.logo );
        }
      }

      // Reset to previous state...
      this.reset = function() {
        this.hasMedia = false;
        this.playing = false;
        jQuery.media.players[settings.id].showNativeControls(false);
        this.showPlay(true);
        this.showPreview(true);
        clearTimeout( this.timeoutId );
        if( this.media ) {
          this.media.reset();
        }
      };

      // Toggle the play/pause state.
      this.togglePlayPause = function() {
        if( this.media ) {
          if( this.media.playerReady ) {
            if( this.playing ) {
              this.showPlay(true);
              this.media.player.pauseMedia();
            }
            else {
              this.showPlay(false);
              this.media.player.playMedia();
            }
          }
          else if( (this.media.playQueue.length > 0) && !this.media.mediaFile ) {
            // They interacted with the player.  Always autoload at this point on.
            this.autoLoad = true;

            // Then play the next file in the queue.
            this.playNext();
          }
        }
      };

      // Loads an image...
      this.loadImage = function( image ) {
        if( this.preview ) {
          // Show a busy cursor for the image loading...
          this.showBusy(3, true);

          // Load the image.
          this.preview.loadImage( image );

          // Set and interval to check if the image is loaded.
          var imageInterval = setInterval(function() {

            // If the image is loaded, then clear the interval.
            if (_this.preview.loaded()) {

              // Clear the interval and stop the busy cursor.
              clearInterval(imageInterval);
              _this.showBusy(3, false);
            }
          }, 500);

          // Now set the preview image in the media player.
          if( this.media ) {
            this.media.preview = image;
          }
        }
      };

      this.onResize = function() {
        if( this.preview ) {
          this.preview.refresh();
        }

        if( this.media ) {
          this.media.onResize();
        }
      };

      // Clears the loaded image.
      this.clearImage = function() {
        if( this.preview ) {
          this.preview.clear();
        }
      };

      // Expose the public load functions from the media display.
      this.loadFiles = function( files ) {
        this.reset();
        this.hasMedia = this.media && this.media.loadFiles(files);
        if( this.hasMedia && this.autoLoad ) {
          this.media.playNext();
        }
        else if( !this.hasMedia ) {
          // Hide the overlays for non-media types.
          this.showPlay(false);
          this.showPreview(true);
          this.timeoutId = setTimeout( function() {
            _this.media.display.trigger( "mediaupdate", {type:"complete"} );
          }, (settings.timeout * 1000) );
        }
        return this.hasMedia;
      };

      // Play the next file.
      this.playNext = function() {
        if( this.media ) {
          this.media.playNext();
        }
      };

      // Check the player for controls.
      this.hasControls = function() {
        if( this.media ) {
          return this.media.hasControls();
        }
        return true;
      };

      // Show the native controls.
      this.showControls = function( show ) {
        if( this.media ) {
          this.media.showControls( show );
        }
      };

      // Loads a single media file.
      this.loadMedia = function( file ) {
        this.reset();
        if( this.media ) {
          this.media.loadMedia( file );
        }
      };

      // If they provide a file, then load it.
      if( settings.file ) {
        this.loadMedia( settings.file );
      }

      // If they provide the image, then load it.
      if( settings.image ) {
        this.loadImage( settings.image );
      }
    })( this, settings );
  };
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 *
 * Requires: 1.2.2+
 */



  var types = ['DOMMouseScroll', 'mousewheel'];

  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener ) {
        for ( var i=types.length; i; ) {
          i--;
          this.addEventListener( types[i], handler, false );
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if ( this.removeEventListener ) {
        for ( var i=types.length; i; ) {
          i--;
          this.removeEventListener( types[i], handler, false );
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
      return this.unbind("mousewheel", fn);
    }
  });


  function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( event.wheelDelta ) {
      delta = event.wheelDelta/120;
    }
    if ( event.detail     ) {
      delta = -event.detail/3;
    }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
      deltaY = 0;
      deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) {
      deltaY = orgEvent.wheelDeltaY/120;
    }
    if ( orgEvent.wheelDeltaX !== undefined ) {
      deltaX = -1*orgEvent.wheelDeltaX/120;
    }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return $.event.handle.apply(this, args);
  }

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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    node:"",
    incrementTime:5
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    voter:"#mediavoter",
    uservoter:"#mediauservoter",
    mediaRegion:"#mediaregion",
    field:".mediafield"
  });
   
  jQuery.fn.medianode = function( server, settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( server, node, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
         
      // Save the jQuery display.
      this.display = node;
      this.nodeInfo = {};
      this.incremented = false;
      var _this = this;
         
      // Add the min player as the player for this node.
      this.player = this.display.find(settings.ids.mediaRegion).minplayer( settings );
      if( this.player && (settings.incrementTime !== 0)) {
        this.player.display.unbind("mediaupdate").bind( "mediaupdate", function( event, data ) {
          _this.onMediaUpdate( data );
        });
      }
         
      // Store all loaded images.
      this.images = [];

      this.addVoters = function( element ) {
        this.voter = element.find(settings.ids.voter).mediavoter( settings, server, false );
        this.uservoter = element.find(settings.ids.uservoter).mediavoter( settings, server, true );
        if( this.uservoter && this.voter ) {
          this.uservoter.display.unbind("processing").bind( "processing", function() {
            _this.player.showBusy(2, true);
          });
          this.uservoter.display.unbind("voteGet").bind( "voteGet", function() {
            _this.player.showBusy(2, false);
          });
          this.uservoter.display.unbind("voteSet").bind( "voteSet", function( event, vote ) {
            _this.player.showBusy(2, false);
            _this.voter.updateVote( vote );
          });
        }
      };

      // Add the voters to this node.
      this.addVoters( this.display );
         
      // Handle the media events.
      this.onMediaUpdate = function( data ) {
        if( !this.incremented ) {
          switch( data.type ) {
            case "update":
              // Increment node counter if the increment time is positive and is less than the current time.
              if( (settings.incrementTime > 0) && (data.currentTime > settings.incrementTime) ) {
                this.incremented = true;
                server.call( jQuery.media.commands.incrementCounter, null, null, _this.nodeInfo.nid );
              }
              break;
            case "complete":
              // If the increment time is negative, then that means to increment on media completion.
              if( settings.incrementTime < 0 ) {
                this.incremented = true;
                server.call( jQuery.media.commands.incrementCounter, null, null, _this.nodeInfo.nid );
              }
              break;
            default:
              break;
          }
        }
      };
         
      this.loadNode = function( _nodeInfo ) {
        return this.getNode( this.translateNode( _nodeInfo ) );
      };

      this.translateNode = function( _nodeInfo ) {
        var isValue = ((typeof _nodeInfo) == "number") || ((typeof _nodeInfo) == "string");
        if( !_nodeInfo ) {
          var defaultNode = settings.node;
          if( (typeof defaultNode) == 'object' ) {
            defaultNode.load = false;
            return defaultNode;
          }
          else {
            return defaultNode ? {
              nid:defaultNode,
              load:true
            } : null;
          }
        }
        else if( isValue ) {
          return {
            nid:_nodeInfo,
            load:true
          };
        }
        else {
          _nodeInfo.load = false;
          return _nodeInfo;
        }
      };

      this.getNode = function( _nodeInfo ) {
        if( _nodeInfo ) {
          if( server && _nodeInfo.load ) {
            server.call( jQuery.media.commands.loadNode, function( result ) {
              _this.setNode( result );
            }, null, _nodeInfo.nid, {} );
          }
          else {
            this.setNode( _nodeInfo );
          }

          // Return that the node was loaded.
          return true;
        }

        // Return that there was no node loaded.
        return false;
      };

      this.setNode = function( _nodeInfo ) {
        if( _nodeInfo ) {
          // Set the node information object.
          this.nodeInfo = _nodeInfo;
          this.incremented = false;
   
          // Load the media...
          if( this.player && this.nodeInfo.mediafiles ) {
            // Load the preview image.
            var image = this.getImage("preview");
            if( image ) {
              this.player.loadImage( image.path );
            }
            else {
              this.player.clearImage();
            }

            // Load the media...
            this.player.loadFiles( this.nodeInfo.mediafiles.media );
          }
               
          // Get the vote for these voters.
          if( this.voter ) {
            this.voter.getVote( _nodeInfo );
          }
          if( this.uservoter ) {
            this.uservoter.getVote( _nodeInfo );
          }
               
          // Load all of our fields.
          this.display.find(settings.ids.field).each( function() {
            _this.setField( this, _nodeInfo, $(this).attr("type"), $(this).attr("field") );
          });
                  
          // Trigger our node loaded event.
          this.display.trigger( "nodeload", this.nodeInfo );
        }
      };

      this.setField = function( fieldObj, _nodeInfo, type, fieldName ) {
        // We only want to load the fields that have a type.
        if( type ) {
          switch( type ) {
            case "text":
              this.setTextField( fieldObj, _nodeInfo, fieldName );
              break;
   
            case "image":
              this.setImageField( fieldObj, fieldName );
              break;

            case 'cck_text':
              this.setCCKTextField( fieldObj, _nodeInfo, fieldName );
              break;
            default:
              break;
          }
        }
      };
         
      this.setTextField = function( fieldObj, _nodeInfo, fieldName ) {
        var field = _nodeInfo[fieldName];
        if( field ) {
          $(fieldObj).empty().html( field );
        }
        return true;
      };

      this.setCCKTextField = function( fieldObj, _nodeInfo, fieldName ) {
        if( args.fieldType == 'cck_text' ) {
          var field = _nodeInfo[fieldName];
          if( field ) {
            $(fieldObj).empty().html( field["0"].value );
          }
        }
        return true;
      };

      this.onResize = function() {
        if( this.player ) {
          this.player.onResize();
        }
      };

      this.getImage = function( imageName ) {
        var images = this.nodeInfo.mediafiles ? this.nodeInfo.mediafiles.images : null;
        var image = null;
        if( images ) {
               
          // Get the image.
          if( images[imageName] ) {
            image = images[imageName];
          }
          else {
            // Or just use the first image...
            for( var key in images ) {
              if( images.hasOwnProperty( key ) ) {
                image = images[key];
                break;
              }
            }
          }
               
          // If they just provided a string, then still show the image.
          image = (typeof image === "string") ? {
            path:image
          } : image;
          image.path = image.path ? jQuery.trim(image.path) : ( settings.baseURL + jQuery.trim(image.filepath) );
          if( image && image.path ) {
            image.path = image.path ? jQuery.trim(image.path) : ( settings.baseURL + jQuery.trim(image.filepath) );
          }
          else {
            image = null;
          }
        }
        return image;
      };
         
      this.setImageField = function( fieldObj, fieldName ) {
        var file = this.getImage( fieldName );
        if( file ) {
          var image = $(fieldObj).empty().mediaimage();
          this.images.push( image );
          image.loadImage( file.path );
        }
      };
    })( server, this, settings );
  };
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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    shuffle:false,
    loop:false,
    pageLimit:10
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    prev:"#mediaprev",
    next:"#medianext",
    loadPrev:"#medialoadprev",
    loadNext:"#medialoadnext",
    prevPage:"#mediaprevpage",
    nextPage:"#medianextpage"
  });
   
  jQuery.fn.mediapager = function( settings ){
    return new (function( pager, settings ) {
      settings = jQuery.media.utils.getSettings(settings);

      // Save the jQuery display.
      this.display = pager;
      var _this = this;

      // The active index within a page.
      this.activeIndex = -1;

      // The non-active index within a page.
      this.currentIndex = -1;

      // The active page index.
      this.activePage = 0;

      // The non-active page index.
      this.currentPage = 0;

      // The number of pages.
      this.numPages = 0;

      // The number of items on the current page.
      this.numItems = 10;

      // The number of items on the active page.
      this.activeNumItems = 10;

      // The load state for loading an index after a new page.
      this.loadState = "";

      // Used to turn on and off the pager.
      this.enabled = false;
         
      // Add our buttons...
      this.prevButton = pager.find( settings.ids.prev ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadPrev( false );
        }
      });
         
      this.nextButton = pager.find( settings.ids.next ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadNext( false );
        }
      });
         
      this.loadPrevButton = pager.find( settings.ids.loadPrev ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadPrev( true );
        }
      });
         
      this.loadNextButton = pager.find( settings.ids.loadNext ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadNext( true );
        }
      });

      this.prevPageButton = pager.find( settings.ids.prevPage ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadState = "click";
          _this.prevPage();
        }
      });
         
      this.nextPageButton = pager.find( settings.ids.nextPage ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadState = "click";
          _this.nextPage();
        }
      });

      this.setTotalItems = function( totalItems ) {
        if ( totalItems && settings.pageLimit ) {
          this.numPages = Math.ceil(totalItems / settings.pageLimit);
          if( this.numPages == 1 ) {
            this.numItems = totalItems;
          }
        }
      };

      this.setNumItems = function( _numItems ) {
        this.numItems = _numItems;
      };

      this.reset = function() {
        this.activePage = 0;
        this.currentPage = 0;
        this.activeIndex = -1;
        this.currentIndex = -1;
        this.loadState = "";
      };

      this.loadIndex = function( setActive ) {
        var indexVar = setActive ? "activeIndex" : "currentIndex";
        var newIndex = this[indexVar];
        switch ( this.loadState ) {
          case "prev":
            this.loadState = "";
            this.loadPrev(setActive);
            return;

          case "first":
            newIndex = 0;
            break;
          case "last" :
            newIndex = (this.numItems - 1);
            break;

          case "rand" :
            newIndex = Math.floor(Math.random() * this.numItems);
            break;
            
          default:
            break;
        }

        this.loadState = "";

        if( newIndex != this[indexVar] ) {
          this.loadState = "";
          this[indexVar] = newIndex;
          this.display.trigger("loadindex", {
            index:this[indexVar],
            active:setActive
          });
        }
      };

      this.loadNext = function( setActive ) {
        if ( this.loadState ) {
          this.loadIndex( setActive );
        }
        else if ( settings.shuffle ) {
          this.loadRand();
        }
        else {
          // Increment the playlist index.
          var indexVar = setActive ? "activeIndex" : "currentIndex";
          if( setActive && ( this.activePage != this.currentPage ) ) {

            // Check to make sure we cover the crazy corner-case where the activeIndex
            // is on the last item of the previous page.  Here we don't need to load
            // a new page, but simply load the first item on the current page.
            if( (this.activeIndex == (this.activeNumItems - 1)) && (this.activePage == (this.currentPage - 1)) ) {
              this.currentIndex = this.activeIndex = 0;
              this.activePage = this.currentPage;
              this.display.trigger("loadindex", {
                index:0,
                active:true
              });
            }
            else {
              this.currentPage = this.activePage;
              this.loadState = "";
              this.display.trigger("loadpage", {
                index:this.activePage,
                active:setActive
              });
            }
          }
          else {
            this[indexVar]++;
            if ( this[indexVar] >= this.numItems ) {
              if( this.numPages > 1 ) {
                this[indexVar] = (this.numItems - 1);
                this.loadState = this.loadState ? this.loadState : "first";
                this.nextPage( setActive );
              }
              else if( !setActive || settings.loop ) {
                this[indexVar] = 0;
                this.display.trigger("loadindex", {
                  index:this[indexVar],
                  active:setActive
                });
              }
            }
            else {
              this.display.trigger("loadindex", {
                index:this[indexVar],
                active:setActive
              });
            }
          }
        }
      };

      this.loadPrev = function( setActive ) {
        var indexVar = setActive ? "activeIndex" : "currentIndex";

        if( setActive && ( this.activePage != this.currentPage ) ) {
          this.currentPage = this.activePage;
          this.loadState = "prev";
          this.display.trigger("loadpage", {
            index:this.activePage,
            active:setActive
          });
        }
        else {
          this[indexVar]--;
          if ( this[indexVar] < 0 ) {
            if( this.numPages > 1 ) {
              this[indexVar] = 0;
              this.loadState = this.loadState ? this.loadState : "last";
              this.prevPage( setActive );
            }
            else if( !setActive || settings.loop ) {
              this[indexVar] = (this.numItems - 1);
              this.display.trigger("loadindex", {
                index:this[indexVar],
                active:setActive
              });
            }
          }
          else {
            this.display.trigger( "loadindex", {
              index:this[indexVar],
              active:setActive
            } );
          }
        }
      };

      this.loadRand = function() {
        var newPage = Math.floor(Math.random() * this.numPages);

        if (newPage != this.activePage) {
          this.activePage = newPage;
          this.loadState = this.loadState ? this.loadState : "rand";
          this.display.trigger("loadpage", {
            index:this.activePage,
            active:true
          });
        }
        else {
          this.activeIndex = Math.floor(Math.random() * this.numItems);
          this.display.trigger("loadindex", {
            index:this.activeIndex,
            active:true
          });
        }
      };

      this.nextPage = function( setActive ) {
        var pageVar = setActive ? "activePage" : "currentPage";
        var pageLoaded = false;

        if ( this[pageVar] < (this.numPages - 1) ) {
          this[pageVar]++;
          pageLoaded = true;
        }
        else if ( settings.loop ) {
          this.loadState = this.loadState ? this.loadState : "first";
          this[pageVar] = 0;
          pageLoaded = true;
        }
        else {
          this.loadState = "";
        }

        // Set the page state.
        this.setPageState( setActive );

        if( pageLoaded ) {
          this.display.trigger("loadpage", {
            index:this[pageVar],
            active:setActive
          });
        }
      };

      this.prevPage = function( setActive ) {
        var pageVar = setActive ? "activePage" : "currentPage";
        var pageLoaded = false;

        if (this[pageVar] > 0) {
          this[pageVar]--;
          pageLoaded = true;
        }
        else if ( settings.loop ) {
          this.loadState = this.loadState ? this.loadState : "last";
          this[pageVar] = (this.numPages - 1);
          pageLoaded = true;
        }
        else {
          this.loadState = "";
        }

        // Set the page state.
        this.setPageState( setActive );

        if( pageLoaded ) {
          this.display.trigger("loadpage", {
            index:this[pageVar],
            active:setActive
          });
        }
      };

      this.setPageState = function( setActive ) {
        if( setActive ) {
          // If this page is active, then we want to make sure
          // we set the current page to the active page.
          this.currentPage = this.activePage;
        }
        else {
          // Store the active num items.
          this.activeNumItems = this.numItems;
        }
      };
    })( this, settings );
  };
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
 */

  jQuery.media = jQuery.extend( {}, {
    parser : function( settings ) {
      // Return a new parser object.
      return new (function( settings ) {
        var _this = this;
        this.onLoaded = null;
                     
        // Parse the contents from a file.
        this.parseFile = function( file, onLoaded ) {
          this.onLoaded = onLoaded;
          jQuery.ajax({
            type: "GET",
            url:file,
            dataType:"xml",
            success: function(xml) {
              _this.parseXML( xml );
            },
            error: function( XMLHttpRequest, textStatus, errorThrown ) {
              if( window.console && console.log ) {
                console.log( "Error: " + textStatus );
              }
            }
          });
        };
            
        // Parse an xml string.
        this.parseXML = function( xml ) {
          // Try to parse a playlist in any format...
          var playlist = this.parseXSPF( xml );
          if( playlist.total_rows === 0 ) {
            playlist = this.parseASX( xml );
          }
          if( playlist.total_rows === 0 ) {
            playlist = this.parseRSS( xml );
          }
          if( this.onLoaded && playlist.total_rows ) {
            this.onLoaded( playlist );
          }
          return playlist;
        };
            
        // Parse XSPF contents.
        this.parseXSPF = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var trackList = jQuery("playlist trackList track", xml);
          if( trackList.length > 0 ) {
            trackList.each( function(index) {
              playlist.total_rows++;
              playlist.nodes.push({
                nid:playlist.total_rows,
                title: $(this).find("title").text(),
                description: $(this).find("annotation").text(),
                mediafiles: {
                  images:{
                    "image":{
                      path:$(this).find("image").text()
                    }
                  },
                  media:{
                    "media":{
                      path:$(this).find("location").text()
                    }
                  }
                }
              });
            });
          }
          return playlist;
        };

        // Parse ASX contents.
        this.parseASX = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var trackList = jQuery("asx entry", xml);
          if( trackList.length > 0 ) {
            trackList.each( function(index) {
              playlist.total_rows++;
              playlist.nodes.push({
                nid:playlist.total_rows,
                title: $(this).find("title").text(),
                mediafiles: {
                  images:{
                    "image":{
                      path:$(this).find("image").text()
                    }
                  },
                  media:{
                    "media":{
                      path:$(this).find("location").text()
                    }
                  }
                }
              });
            });
          }
          return playlist;
        };

        // Parse RSS contents.
        this.parseRSS = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var channel = jQuery("rss channel", xml);
          if( channel.length > 0 ) {
            var youTube = (channel.find("generator").text() == "YouTube data API");
                  
            // Iterate through all the items.
            channel.find("item").each( function(index) {
              playlist.total_rows++;
              var item = {};
              item = youTube ? _this.parseYouTubeItem( $(this) ) : _this.parseRSSItem( $(this) );
              item.nid = playlist.total_rows;
              playlist.nodes.push(item);
            });
          }
          return playlist;
        };
            
        // Parse a default RSS Item.
        this.parseRSSItem = function( item ) {
          return {
            title: item.find("title").text(),
            mediafiles: {
              images:{
                "image":{
                  path:item.find("image").text()
                }
              },
              media:{
                "media":{
                  path:item.find("location").text()
                }
              }
            }
          };
        };
            
        // Parse a YouTube item.
        this.parseYouTubeItem = function( item ) {
          var description = item.find("description").text();
          var media = item.find("link").text().replace("&feature=youtube_gdata", "");
          return {
            title: item.find("title").text(),
            mediafiles: {
              images:{
                "image":{
                  path:jQuery("img", description).eq(0).attr("src")
                }
              },
              media:{
                "media":{
                  path:media,
                  player:"youtube"
                }
              }
            }
          };
        };
      })( settings );
    }
  }, jQuery.media );
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
 */

  

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    protocol:"auto",
    server:"drupal",
    template:"default",
    baseURL:"",
    debug:false,
    draggable:false,
    resizable:false,
    showPlaylist:true,
    autoNext:true,
    prefix:"",
    zIndex:400,
    fluidWidth:false,
    fluidHeight:false,
    fullscreen:false
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    loading:"#mediaplayerloading",
    player:"#mediaplayer",
    menu:"#mediamenu",
    titleBar:"#mediatitlebar",
    node:"#medianode",
    playlist:"#mediaplaylist",
    control:"#mediacontrol"
  });

  // Initialize our players, playlists, and controllers.
  jQuery.media.players = {};
  jQuery.media.loadCallbacks = {};
  jQuery.media.playlists = {};
  jQuery.media.controllers = {};

  // Use this function to trigger when the player has finished registering and loaded.
  jQuery.media.onLoaded = function( playerId, callback ) {
    var player = jQuery.media.players[playerId];
    if( player && player.display && player.loaded ) {
      callback( player );
    }
    else {
      if( !jQuery.media.loadCallbacks[playerId] ) {
        jQuery.media.loadCallbacks[playerId] = [];
      }
      jQuery.media.loadCallbacks[playerId].push( callback );
    }
  };

  // Adds a new element to the media player.
  jQuery.media.addElement = function( playerId, fromPlayer, name ) {
    if( fromPlayer && fromPlayer[name] ) {
      var toPlayer = jQuery.media.players[playerId];
      if( toPlayer ) {
        switch( name ) {
          case "playlist":
            toPlayer.addPlaylist( fromPlayer.playlist );
            break;
          case "controller":
            toPlayer.addController( fromPlayer.controller );
            break;
          default:
            break;
        }
      }
      else {
        // Otherwise, cache it for inclusion when the player is created.
        var pName = name + "s";
        if( !jQuery.media[pName][playerId] ) {
          jQuery.media[pName][playerId] = [];
        }
        jQuery.media[pName][playerId].push( fromPlayer[name] );
      }
    }
  };

  // To add a new controller to any existing or future-included players.
  jQuery.media.addController = function( playerId, fromPlayer ) {
    jQuery.media.addElement( playerId, fromPlayer, "controller" );
  };

  // To add a new playlist to any existing or future-included players.
  jQuery.media.addPlaylist = function( playerId, fromPlayer ) {
    jQuery.media.addElement( playerId, fromPlayer, "playlist" );
  };

  // The main entry point into the player.
  jQuery.fn.mediaplayer = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    // Return the media Media Player
    return new (function( player, settings ) {
      // Get the settings.
      settings = jQuery.media.utils.getSettings( settings );

      // Get the id if it has not been set.
      if( !settings.id ) {
        settings.id = jQuery.media.utils.getId( player );
      }

      // Save the dialog.
      this.dialog = player;

      // Save the jQuery display.
      this.display = this.dialog.find( settings.ids.player );
      var _this = this;

      // Fix a really strange issue where if any of the parent elements are invisible
      // when this player's template is initializing, it would crash due to the issue
      // with calling the position() function on an invisible object.  This seems to fix
      // that issue.
      var invisibleParents = [];

      // Now check the visibility of the parents, and add the offenders to the array.
      jQuery.media.utils.checkVisibility( this.display, invisibleParents );

      // Add this player to the players object.
      jQuery.media.players[settings.id] = this;

      // Variable to keep track if this player has finished loading.
      this.loaded = false;

      // Store the index variable.
      var i = 0;

      // Set the template object.
      settings.template = jQuery.media.templates[settings.template]( this, settings );

      // Get all of the setting overrides used in this template.
      if( settings.template.getSettings ) {
        settings = jQuery.extend( settings, settings.template.getSettings() );
      }

      // Add some keyboard event handlers.
      $(window).keyup( function( event ) {
        switch( event.keyCode ) {
          case 0:   /* SpaceBar */
            _this.onSpaceBar();
            break;
          case 113: /* Q key */
          case 27:  /* ESC Key */
            _this.onEscKey();
            break;
          default:
            break;
        }
      });

      // Add a resize handler to the window if either our width or height is fluid.
      if( settings.fluidWidth || settings.fluidHeight ) {
        $(window).resize( function() {
          _this.onResize();
        });
      }

      // First get the communication protocol.
      if( jQuery.media[settings.protocol] ) {
        this.protocol = jQuery.media[settings.protocol]( settings );
      }

      // Load the server.
      if( jQuery.media[settings.server] ) {
        this.server = jQuery.media[settings.server]( this.protocol, settings );
      }

      // Get the menu.
      this.menu = this.dialog.find( settings.ids.menu ).mediamenu( this.server, settings );
      if( this.menu ) {
        this.menu.display.unbind("menuclose").bind( "menuclose", function() {
          _this.showMenu( false );
        });
      }

      // Setup our booleans.
      this.menuOn = false;
      this.maxOn = !settings.showPlaylist;
      this.fullScreen = false;

      // The attached playlist.
      this.playlist = null;

      // The active playlist.
      this.activePlaylist = null;

      // Our attached controller.
      this.controller = null;

      // The active controller.
      this.activeController = null;

      // Hide or Show the menu.
      this.showMenu = function( show ) {
        if( settings.template.onMenu ) {
          this.menuOn = show;
          settings.template.onMenu( this.menuOn );
        }
      };

      // Called when the user presses the ESC key.
      this.onEscKey = function() {
        // If they are in full screen mode, then escape when they press the ESC key.
        if( this.fullScreen ) {
          this.onFullScreen( false );
        }
      };

      // When they press the space bar, we will toggle the player play/pause state.
      this.onSpaceBar = function() {
        if( this.fullScreen && this.node && this.node.player ) {
          this.node.player.togglePlayPause();
        }
      };

      // Adds the media player events to a given element.
      this.addPlayerEvents = function( element ) {
        // Trigger on the menu.
        element.display.unbind("menu").bind("menu", function(event) {
          _this.showMenu( !_this.menuOn );
        });

        element.display.unbind("maximize").bind("maximize", function( event ) {
          _this.maximize( !_this.maxOn );
        });

        element.display.unbind("fullscreen").bind("fullscreen", function( event ) {
          _this.onFullScreen( !_this.fullScreen );
        });
      };

      // Function to put the player in fullscreen mode.
      this.onFullScreen = function( full ) {
        this.fullScreen = full;
        if( this.node && this.node.player ) {
          this.node.player.fullScreen( this.fullScreen );
          this.onResize();
        }
      };

      // Setup the title bar.
      this.titleBar = this.dialog.find( settings.ids.titleBar ).mediatitlebar( settings );
      if( this.titleBar ) {
        // Add the player events to the titlebar.
        this.addPlayerEvents( this.titleBar );

        // If they have jQuery UI, make this draggable.
        if( settings.draggable && this.dialog.draggable ) {
          this.dialog.draggable({
            handle: settings.ids.titleBar,
            containment: 'document'
          });
        }

        // If they have jQuery UI, make this resizable.
        if( settings.resizable && this.dialog.resizable ) {
          this.dialog.resizable({
            alsoResize: this.display,
            containment: 'document',
            resize: function(event) {
              _this.onResize();
            }
          });
        }
      }

      // Get the node and register for events.
      this.node = this.dialog.find( settings.ids.node ).medianode( this.server, settings );
      if( this.node ) {
        this.node.display.unbind("nodeload").bind( "nodeload", function( event, data ) {
          _this.onNodeLoad( data );
        });

        if( this.node.player && this.node.player.media ) {
          this.node.player.media.display.unbind("mediaupdate").bind( "mediaupdate", function( event, data ) {
            _this.onMediaUpdate( data );
          });
        }

        if( this.node.uservoter ) {
          this.node.uservoter.display.unbind("voteSet").bind( "voteSet", function( event, vote ) {
            if( _this.activePlaylist ) {
              _this.activePlaylist.onVoteSet( vote );
            }
          });
        }
      }

      // Called when the media updates.
      this.onMediaUpdate = function( data ) {
        // Call the player onMediaUpdate.
        this.node.player.onMediaUpdate( data );

        // When the media completes, have the active playlist load the next item.
        if( settings.autoNext && this.activePlaylist && (data.type == "complete") ) {
          this.activePlaylist.loadNext();
        }

        // Update our controller.
        if( this.controller ) {
          this.controller.onMediaUpdate( data );
        }

        // Update our active controller.
        if( this.activeController ) {
          this.activeController.onMediaUpdate( data );
        }

        // Set the media information in the menu.
        if( this.menu && this.node && (data.type == "meta") ) {
          this.menu.setEmbedCode( this.node.player.media.player.getEmbedCode() );
          this.menu.setMediaLink( this.node.player.media.player.getMediaLink() );
        }

        // Let the template do something...
        if( settings.template && settings.template.onMediaUpdate ) {
          settings.template.onMediaUpdate( data );
        }
      };

      // Called when the playlist is finished loading.
      this.onPlaylistLoad = function( data ) {
        if( this.node ) {
          // Let our media know that there is a playlist.
          if( this.node.player && this.node.player.media ) {
            this.node.player.media.hasPlaylist = true;
          }

          this.node.loadNode( data );
        }

        // Allow the template to do something when the playlist is loaded.
        if( settings.template.onPlaylistLoad ) {
          settings.template.onPlaylistLoad( data );
        }
      };

      // Called when the main node is loaded.
      this.onNodeLoad = function( data ) {
        // Allow the template to do something when the node is loaded.
        if( settings.template.onNodeLoad ) {
          settings.template.onNodeLoad( data );
        }
      };

      // Maximize the player.
      this.maximize = function( on ) {
        // Don't want to maximize in fullscreen mode.
        if( !this.fullScreen ) {
          if( settings.template.onMaximize && (on != this.maxOn) ) {
            this.maxOn = on;
            settings.template.onMaximize( this.maxOn );
          }
        }
      };

      // Allow multiple playlists to be associated with this single player using this API.
      this.addPlaylist = function( newPlaylist ) {
        if( newPlaylist ) {
          newPlaylist.display.unbind("playlistload").bind( "playlistload", newPlaylist, function( event, data ) {
            // Set this as the active playlist.
            _this.activePlaylist = event.data;
            _this.onPlaylistLoad( data );
          });

          // Check to see if this playlist has already loaded... If so, then we need to
          // go ahead and load the active teaser into this player.
          if( !this.activePlaylist && newPlaylist.activeTeaser ) {
            this.activePlaylist = newPlaylist;
            this.onPlaylistLoad( newPlaylist.activeTeaser.node.nodeInfo );
          }
        }
        return newPlaylist;
      };

      // Search these elements for the id.
      this.searchForElement = function(elementList) {
        
        // Iterate through the elements.
        for(var id in elementList) {
          
          // We need to tolerate instances.
          var reg = new RegExp( '^' + id + '(\\_[0-9]+)?$', 'i');
          if (settings.id.search(reg) === 0) {
            return elementList[id];
          }
        }
        return null;
      };

      // Add the default playlist.
      this.playlist = this.addPlaylist( this.dialog.find( settings.ids.playlist ).mediaplaylist( this.server, settings ) );

      // Allow mulitple controllers to control this media.
      this.addController = function( newController, active ) {
        if( newController ) {
          newController.display.unbind("controlupdate").bind( "controlupdate", newController, function( event, data ) {
            _this.activeController = event.data;
            if( _this.node && _this.node.player ) {
              _this.node.player.onControlUpdate( data );
            }
          });

          if( active && !this.activeController ) {
            this.activeController = newController;
          }

          this.addPlayerEvents( newController );
        }
        return newController;
      };

      // Add the control bar to the media.
      this.controller = this.addController( this.dialog.find( settings.ids.control ).mediacontrol( settings ), false );
      if( this.controller && this.node ) {
        // Add any voters to the node.
        this.node.addVoters( this.controller.display );
      }

      // Called when the player resizes.
      this.onResize = function() {
        // Call the template resize function.
        if( settings.template.onResize ) {
          settings.template.onResize();
        }

        // Resize the node.
        if( this.node ) {
          this.node.onResize();
        }

        // Resize the attached control region.
        if( this.controller ) {
          this.controller.onResize();
        }
      };

      // Function to show the built in controls or not.
      this.showNativeControls = function( show ) {
        var player = this.node ? this.node.player : null;
        if( player && player.hasControls() ) {
          player.usePlayerControls = show;
          if( show ) {
            player.busy.hide();
            player.play.hide();
            if( player.preview ) {
              player.preview.display.hide();
            }
            if( this.controller ) {
              this.controller.display.hide();
            }
          }
          else {
            player.showBusy( 1, ((this.busyFlags & 0x2) == 0x2) );
            player.showPlay( this.playVisible );
            player.showPreview( this.previewVisible );
            if( this.controller ) {
              this.controller.display.show();
            }
          }
          player.showControls( show );
        }
      };

      // Load the content into the player.
      this.loadContent = function() {
        
        // Now add any queued controllers...
        var controllers = this.searchForElement(jQuery.media.controllers);
        if (controllers) {
          i = controllers.length;
          while(i) {
            i--;
            this.addController( controllers[i], true );
          }
        }        
        
        // Now add any queued playlists...
        var playlists = this.searchForElement(jQuery.media.playlists);
        if (playlists) {
          i = playlists.length;
          while(i) {
            i--;
            this.addPlaylist( playlists[i] );
          }
        }         
        
        var playlistLoaded = false;

        if( this.playlist ) {
          playlistLoaded = this.playlist.loadPlaylist();
        }

        // Don't load the node if there is a plalist loaded.
        if( !playlistLoaded && this.node ) {
          // Make sure to transfer any playlist settings over to the node.
          if( this.node.player && this.node.player.media ) {
            this.node.player.media.settings.repeat = (settings.loop || settings.repeat);
          }

          this.node.loadNode();
        }       
      };

      this.initializeTemplate = function() {
        // Initialize our template.
        if( settings.template.initialize ) {
          settings.template.initialize( settings );
        }

        // Now reset the visibility of the parents.
        jQuery.media.utils.resetVisibility( invisibleParents );
      };

      this.load = function() {
        // Initialize our template.
        this.initializeTemplate();

        // The player looks good now.  Move the dialog back.
        this.dialog.css("position","relative");
        this.dialog.css("marginLeft",0);
        this.dialog.css("overflow","visible");

        // If they wish to default the player in fullscreen mode, do that now.
        if( settings.fullscreen ) {
          this.onFullScreen(true);
        }

        // Set our loaded flag to true.
        this.loaded = true;
        this.display.trigger( "playerLoaded", this );

        // Call all of our queued onLoaded callback functions.
        if( jQuery.media.loadCallbacks[settings.id] ) {
          var callbacks = jQuery.media.loadCallbacks[settings.id];
          var i = callbacks.length;
          while(i) {
            i--;
            callbacks[i]( this );
          }
        }

        // Connect to the server.
        this.server.connect( function( result ) {
          _this.loadContent();
        });
      };

      this.load();
    })( this, settings );
  };

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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    playlist:"",
    args:[],
    wildcard:"*"
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    pager:"#mediapager",
    scroll:"#mediascroll",
    busy:"#mediabusy",
    links:"#medialinks"
  });
   
  jQuery.fn.mediaplaylist = function( server, settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( server, playlist, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
                   
      // Save the jQuery display.
      this.display = playlist;
      var _this = this;
         
      // Store all of the current teasers.
      this.teasers = [];

      // The non-active selected teaser.
      this.selectedTeaser = null;

      // The active teaser.
      this.activeTeaser = null;

      // Set up our playlist args.
      this.args = settings.args;

      // Used to keep track if we should set the node active after a playlist load.
      this.setActive = true;

      // The active pager.
      this.activePager = null;

      // The attached pager bar..
      this.pager = null;
                  
      // Set up the playlist parser.
      this.parser = jQuery.media.parser( settings );

      // Get the Scroll Region.
      this.scrollRegion = playlist.find( settings.ids.scroll ).mediascroll( settings );
      this.scrollRegion.clear();
         
      // Store the busy cursor.
      this.busy = playlist.find( settings.ids.busy );
      this.busyVisible = false;
      this.busyImg = this.busy.find("img");
      this.busyWidth = this.busyImg.width();
      this.busyHeight = this.busyImg.height();

      // Get the links.
      this.links = playlist.find( settings.ids.links ).medialinks( settings );
      this.links.loadLinks();
         
      this.loading = function( _loading ) {
        if( this.pager ) {
          this.pager.enabled = !_loading;
        }
        if( this.activePager ) {
          this.activePager.enabled = !_loading;
        }
        if( _loading ) {
          this.busyVisible = true;
          this.busy.show();
        }
        else {
          this.busyVisible = false;
          this.busy.hide();
        }
      };
         
      // Allow mulitple pagers to control this playlist.
      this.addPager = function( newPager, active ) {
        if( newPager ) {
          // Handler for the loadindex event.
          newPager.display.unbind("loadindex").bind( "loadindex", function( event, data ) {
            if( data.active ) {
              _this.activateTeaser( _this.teasers[data.index] );
            }
            else {
              _this.selectTeaser( _this.teasers[data.index] );
            }
          });
      
          // Handler for the loadpage event.
          newPager.display.unbind("loadpage").bind( "loadpage", function( event, data ) {
            _this.setActive = data.active;
            _this.loadPlaylist( {
              pageIndex:data.index
            } );
          });
               
          if( active && !this.activePager ) {
            this.activePager = newPager;
          }
        }
        return newPager;
      };

      // Add the pager.
      this.pager = this.addPager( playlist.find( settings.ids.pager ).mediapager( settings ), false );

      // Handler for when a link is clicked.
      this.links.display.unbind("linkclick").bind( "linkclick", function( event, link ) {
        _this.onLinkClick( link );
      });

      this.onLinkClick = function( link ) {
        var index = link.index;
        var newPlaylist = link.playlist;
        var newArgs = [];
        newArgs[index] = link.arg;
            
        if( this.pager ) {
          this.pager.reset();
        }
            
        if( this.activePager ) {
          this.activePager.reset();
        }
            
        this.loadPlaylist( {
          playlist:newPlaylist,
          args:newArgs
        } );
      };

      // Loads the next track.
      this.loadNext = function() {
        if( this.pager ) {
          this.pager.loadNext( true );
        }
        else if( this.activePager ) {
          this.activePager.loadNext( true );
        }
      };

      // Function to load the playlist.
      this.loadPlaylist = function( _args ) {
        var defaults = {
          playlist:settings.playlist,
          pageLimit:settings.pageLimit,
          pageIndex:(this.pager ? this.pager.activePage : 0),
          args:{}
        };

        var playlistArgs = jQuery.extend( {}, defaults, _args );

        // Set the arguments.
        this.setArgs( playlistArgs.args );

        // Set the busy cursor.
        this.loading( true );

        // If there is a playlist.
        if( playlistArgs.playlist ) {
          // If the playlist is an object, then just set it directly.
          if( ((typeof playlistArgs.playlist) == "object") ) {
            settings.playlist = playlistArgs.playlist.name;
            this.setPlaylist( playlistArgs.playlist );
          }
          else {
            // See if the playlist is a URL file.
            if( playlistArgs.playlist.match(/^http[s]?\:\/\/|\.xml$/i) ) {
              // Parse the XML file.
              this.parser.parseFile( playlistArgs.playlist, function( result ) {
                _this.setPlaylist( result );
              });
            }
            else if( server ) {
              // Load the playlist from the server.
              server.call( jQuery.media.commands.getPlaylist, function( result ) {
                _this.setPlaylist( result );
              }, null, playlistArgs.playlist, playlistArgs.pageLimit, playlistArgs.pageIndex, this.args );
            }
          }

          // Return that the playlist was loaded.
          return true;
        }

        // Return that the playlist was not loaded.
        return false;
      };

      // Set this playlist.
      this.setPlaylist = function( _playlist ) {
        if( _playlist && _playlist.nodes ) {
          // Now check the visibility of the parents, and add the offenders to the array.
          var invisibleParents = [];
          jQuery.media.utils.checkVisibility( this.display, invisibleParents );

          // Set the total number of items for the pager.
          if( this.pager ) {
            this.pager.setTotalItems( _playlist.total_rows );
          }
               
          // Set the total number of items for the active pager.
          if( this.activePager ) {
            this.activePager.setTotalItems( _playlist.total_rows );
          }
   
          // Empty the scroll region.
          this.scrollRegion.clear();
               
          // Reset the teasers.
          this.resetTeasers();
               
          // Iterate through all of our nodes.
          var numNodes = _playlist.nodes.length;
          for( var index=0; index < numNodes; index++ ) {
            // Add the teaser.
            this.addTeaser( _playlist.nodes[index], index );
          }
   
          // Activate the scroll region.
          this.scrollRegion.activate();
   
          // Load the next node.
          if( this.pager ) {
            this.pager.loadNext( this.setActive );
          }
               
          if( this.activePager ) {
            this.activePager.loadNext( this.setActive );
          }

          // Now reset the invisibilty.
          jQuery.media.utils.resetVisibility( invisibleParents );
        }
            
        // We are finished loading.
        this.loading( false );
      };

      // When a vote has been cast, we also need to update the playlist.
      this.onVoteSet = function( vote ) {
        if( vote ) {
          var i = this.teasers.length;
          while(i--) {
            var teaser = this.teasers[i];
            if( teaser.node.nodeInfo.nid == vote.content_id ) {
              teaser.node.voter.updateVote( vote );
            }
          }
        }
      };
         
      // Add a single teaser to the list.
      this.addTeaser = function( nodeInfo, index ) {
        // Setup the teaser.
        var teaser = this.scrollRegion.newItem().mediateaser( server, nodeInfo, index, settings );
        if( teaser ) {
          // If they click on the teaser, then activate it.
          teaser.display.unbind("click").bind( "click", teaser, function( event ) {
            _this.activateTeaser( event.data );
          });
   
          if( this.activeTeaser ) {
            this.activeTeaser.setActive( nodeInfo.nid == this.activeTeaser.node.nodeInfo.nid );
          }
               
          if( this.selectedTeaser ) {
            this.selectedTeaser.setSelected( nodeInfo.nid == this.selectedTeaser.node.nodeInfo.nid );
          }
   
          // Add this teaser to the teasers array.
          this.teasers.push( teaser );
        }
      };

      // Reset the teaser bindings.
      this.resetTeasers = function() {
        // Remove all handlers.
        var i = this.teasers.length;
        while(i--) {
          this.teasers[i].reset();
        }
        this.teasers = [];
      };

      // Set the arguments for this playlist.
      this.setArgs = function( _args ) {
        if( _args ) {
          // Reset the arguments.
          this.args = settings.args;

          // Loop through and add the new arguments.
          var i = _args.length;
          while(i) {
            i--;
            var arg = _args[i];
            if( arg && (arg != settings.wildcard) ) {
              this.args[i] = arg;
            }
          }
        }
      };

      // Selects a teaser.
      this.selectTeaser = function( teaser ) {

        // Set the current active teaser to false.
        if( this.selectedTeaser ) {
          this.selectedTeaser.setSelected( false );
        }
            
        // Store the active teaser for next time.
        this.selectedTeaser = teaser;

        if( this.selectedTeaser ) {
          // Now activate the new teaser.
          this.selectedTeaser.setSelected( true );
                        
          // Set this item as visible in the scroll region.
          this.scrollRegion.setVisible( teaser.index );
        }
      };

      // Activate the teaser.
      this.activateTeaser = function( teaser ) {
        // First select the teaser.
        this.selectTeaser( teaser );
            
        // Set the current active teaser to false.
        if( this.activeTeaser ) {
          this.activeTeaser.setActive( false );
        }
            
        // Store the active teaser for next time.
        this.activeTeaser = teaser;

        if( this.activeTeaser ) {
          // Now activate the new teaser.
          this.activeTeaser.setActive( true );
   
          // Set the active and current index to this one.
          if( this.pager ) {
            this.pager.activeIndex = this.pager.currentIndex = teaser.index;
          }
               
          if( this.activePager ) {
            this.activePager.activeIndex = this.activePager.currentIndex = teaser.index;
          }
               
          // Trigger an even that the teaser has been activated.
          this.display.trigger( "playlistload", teaser.node.nodeInfo );
        }
      };
    })( server, this, settings );
  };

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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    linkText:"#medialinktext"
  });
   
  jQuery.fn.playlistlink = function( settings, linkInfo ) {
    return new (function( link, settings, linkInfo ) {
      settings = jQuery.media.utils.getSettings(settings);
      this.display = link;
      this.arg = linkInfo.arg;
      this.text = linkInfo.text;
      this.index = linkInfo.index;
         
      // Call the setLink when clicked.
      this.display.medialink( settings, function( event ) {
        _this.display.trigger( "linkclick", event.data );
      }, this );
         
      this.setActive = function( active ) {
        if( settings.template.onLinkSelect ) {
          settings.template.onLinkSelect( _this, active );
        }
      };
         
      this.display.find( settings.ids.linkText ).html( this.text );
    })( this, settings, linkInfo );
  };

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
 */

  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    rotatorTimeout:5000,
    rotatorTransition:"fade",
    rotatorEasing:"swing",
    rotatorSpeed:"slow",
    rotatorHover:false
  });

  jQuery.fn.mediarotator = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( rotator, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
      var _this = this;
      this.images = [];
      this.imageIndex = 0;
      this.imageInterval = null;
      this.width = 0;
      this.height = 0;
         
      this.onImageLoaded = function() {
        this.width = this.images[0].imgLoader.width;
        this.height = this.images[0].imgLoader.height;
        rotator.css({
          width:this.width,
          height:this.height
        });
        var sliderWidth = (settings.rotatorTransition == "hscroll") ? (2*this.width) : this.width;
        var sliderHeight = (settings.rotatorTransition == "vscroll") ? (2*this.height) : this.height;
        this.display.css({
          width:sliderWidth,
          height:sliderHeight
        });
      };
         
      this.addImage = function() {
        var image = $("<div></div>").mediaimage(null, true);
        this.display.append( image.display );
            
        if( (settings.rotatorTransition == "hscroll") || (settings.rotatorTransition == "vscroll") ) {
          image.display.css({
            "float":"left"
          });
        }
        else {
          image.display.css({
            position:"absolute",
            zIndex:(200 - this.images.length),
            top:0,
            left:0
          });
        }
        return image;
      };
         
      this.loadImages = function( _images ) {
        this.images = [];
        this.imageIndex = 0;
            
        jQuery.each( _images, function( index ) {
          var image = _this.addImage();
          if( index === 0 ) {
            image.display.unbind("imageLoaded").bind("imageLoaded", function() {
              _this.onImageLoaded();
            }).show();
          }
          image.loadImage( this );
          _this.images.push( image );
        });
            
        if( settings.rotatorHover ) {
          this.display.unbind("mouseenter").bind( "mouseenter", function() {
            _this.startRotator();
          }).unbind("mouseleave").bind( "mouseleave", function() {
            clearInterval( _this.imageInterval );
          });
        }
        else {
          this.startRotator();
        }
      };
      
      this.startRotator = function() {
        clearInterval( this.imageInterval );
        this.imageInterval = setInterval( function() {
          _this.showNextImage();
        }, settings.rotatorTimeout );
      };
         
      this.showNextImage = function() {
        this.hideImage( this.images[this.imageIndex].display );
        this.imageIndex = (this.imageIndex + 1) % this.images.length;
        this.showImage( this.images[this.imageIndex].display );
      };
      
      this.showImage = function( image ) {
        if( settings.rotatorTransition === 'fade' ) {
          image.fadeIn(settings.rotatorSpeed);
        }
        else {
          image.css({
            marginLeft:0,
            marginTop:0
          }).show();
        }
      };
         
      this.hideImage = function( image ) {
        switch( settings.rotatorTransition ) {
          case "fade":
            image.fadeOut(settings.rotatorSpeed);
            break;
          case "hscroll":
            image.animate({
              marginLeft:-this.width
            }, settings.rotatorSpeed, settings.rotatorEasing, function() {
              image.css({
                marginLeft:0
              }).remove();
              _this.display.append( image );
            });
            break;
          case "vscroll":
            image.animate({
              marginTop:-this.height
            }, settings.rotatorSpeed, settings.rotatorEasing, function() {
              image.css({
                marginTop:0
              }).remove();
              _this.display.append( image );
            });
            break;
          default:
            image.hide();
            break;
        }
      };
   
      // Find all the images in the rotator container.
      var _images = [];
      rotator.find("img").each( function() {
        _images.push( $(this).attr("src") );
      });
         
      // Empty the container and setup the inner rotator.
      rotator.empty().css("overflow", "hidden").append( $('<div class="imagerotatorinner"></div>') );
      this.display = rotator.find(".imagerotatorinner");

      // If they provided images, then we will want to load them.
      if( _images.length ) {
        this.loadImages( _images );
      }
    })( this, settings );
  };
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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    gateway:""
  });
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the rpc object.
    rpc : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;
               
        this.parseObject = function( data ) {
          var ret = "";
          if( data instanceof Date ) {
            ret = "<dateTime.iso8601>";
            ret += data.getFullYear();
            ret += data.getMonth();
            ret += data.getDate();
            ret += "T";
            ret += data.getHours() + ":";
            ret += data.getMinutes() + ":";
            ret += data.getSeconds();
            ret += "</dateTime.iso8601>";
          } else if( data instanceof Array ) {
            ret = '<array><data>'+"\n";
            for (var i=0; i < data.length; i++) {
              ret += '  <value>'+ this.serializeToXML(data[i]) +"</value>\n";
            }
            ret += '</data></array>';
          } else {
            ret = '<struct>'+"\n";
            for(var key in data ) {
              if( data.hasOwnProperty(key) ) {
                ret += "  <member><name>"+ key +"</name><value>";
                ret += this.serializeToXML(data[key]) +"</value></member>\n";
              }
            }
            ret += '</struct>';
          }
          return ret;
        };
            
        this.serializeToXML = function( data ) {
          switch( typeof data ) {
            case 'boolean':
              return '<boolean>'+ ((data) ? '1' : '0') +'</boolean>';
                     
            case 'number':
              var parsed = parseInt(data, 10);
              if(parsed == data) {
                return '<int>'+ data +'</int>';
              }
              return '<double>'+ data +'</double>';
                     
            case 'string':
              return '<string>'+ data +'</string>';
                     
            case 'object':
              return this.parseObject( data );
            default:
              break;
          }
          return '';
        };
            
        this.parseXMLValue = function( node ) {
          var childs = jQuery(node).children();
          var numChildren = childs.length;
          var newArray = function(items) {
            return function() {
              items.push( _this.parseXMLValue(this) );
            };
          };
          var newObject = function( items ) {
            return function() {
              items[jQuery( "> name", this).text()] = _this.parseXMLValue(jQuery("value", this));
            };
          };
          for(var i=0; i < numChildren; i++) {
            var element = childs[i];
            switch(element.tagName) {
              case 'boolean':
                return (jQuery(element).text() == 1);
              case 'int':
                return parseInt(jQuery(element).text(), 10);
              case 'double':
                return parseFloat(jQuery(element).text());
              case "string":
                return jQuery(element).text();
              case "array":
                var retArray = [];
                jQuery("> data > value", element).each( newArray( retArray ) );
                return retArray;
              case "struct":
                var retObj = {};
                jQuery("> member", element).each( newObject( retObj ) );
                return retObj;
              case "dateTime.iso8601":
                return NULL;
              default:
                break;
            }
          }
          return null;
        };
            
        this.parseXML = function( data ) {
          var ret = {};
          ret.version = "1.0";
          jQuery("methodResponse params param > value", data).each( function(index) {
            ret.result = _this.parseXMLValue(this);
          });
          jQuery("methodResponse fault > value", data).each( function(index) {
            ret.error = _this.parseXMLValue(this);
          });
          return ret;
        };
            
        this.xmlRPC = function( method, params ) {
          var ret = '<?xml version="1.0"?>';
          ret += '<methodCall>';
          ret += '<methodName>' + method + '</methodName>';
          if( params.length > 0 ) {
            ret += '<params>';
            var numParams = params.length;
            for(var i=0; i < numParams; i++) {
              if( params[i] ) {
                ret += "<param><value>" + this.serializeToXML(params[i]) + "</value></param>";
              }
            }
            ret += '</params>';
          }
          ret += '</methodCall>';
          return ret;
        };
            
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( settings.gateway ) {
            jQuery.ajax({
              "url": settings.gateway,
              "dataType": "xml",
              "type": "POST",
              "data": this.xmlRPC( method, params ),
              "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                if( onFailed ) {
                  onFailed( textStatus );
                }
                else if( window.console && console.log ) {
                  console.log( "Error: " + textStatus );
                }
              },
              "success": function( msg ) {
                var xml = _this.parseXML( msg );
                if( xml.error ) {
                  if( onFailed ) {
                    onFailed( xml.error );
                  }
                  else if( window.console && console.dir ) {
                    console.dir( xml.error );
                  }
                }
                else if( onSuccess ) {
                  onSuccess( xml.result );
                }
              },
              "processData": false,
              "contentType": "text/xml"
            });
          }
          else if( onSuccess ) {
            onSuccess( null );
          }
        };
      })( settings );
    }
  }, jQuery.media );

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
 */

  
   
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    vertical:true,
    scrollSpeed:20,
    updateTimeout:40,
    hysteresis:40,
    showScrollbar:true,
    scrollMode:"auto"  /* "auto", "span", "mouse", "none" */
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    listMask:"#medialistmask",
    list:"#medialist",
    scrollWrapper:"#mediascrollbarwrapper",
    scrollBar:"#mediascrollbar",
    scrollTrack:"#mediascrolltrack",
    scrollHandle:"#mediascrollhandle",
    scrollUp:"#mediascrollup",
    scrollDown:"#mediascrolldown"
  });
   
  jQuery.fn.mediascroll = function( settings ) {
    return new (function( scrollRegion, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
         
      // Save the jQuery display.
      this.display = scrollRegion;
      var _this = this;
         
      this.spanMode = (settings.scrollMode == "span");
         
      // Get the list region.
      this.listMask = scrollRegion.find( settings.ids.listMask );

      // Setup the mouse events for the auto scroll mode.
      if( this.spanMode || (settings.scrollMode == "auto") ) {
        // Add our event callbacks.
        this.listMask.unbind("mouseenter").bind( 'mouseenter', function( event ) {
          _this.onMouseOver( event );
        });
        this.listMask.unbind("mouseleave").bind( 'mouseleave', function( event ) {
          _this.onMouseOut( event );
        });
        this.listMask.unbind("mousemove").bind( 'mousemove', function( event ) {
          _this.onMouseMove( event );
        });
      }
      // Setup the mouse events for the mouse scroll mode.
      else if(settings.scrollMode == "mouse") {
        // Add our event callbacks.
        this.display.bind('mousewheel', function(event, delta, deltaX, deltaY) {
          event.preventDefault();
          _this.onMouseScroll(deltaX, deltaY);
        });
      }
      
      this.listMask.css("overflow", "hidden");
               
      this.list = scrollRegion.find( settings.ids.list );
         
      var element = this.list.children().eq(0);
      this.elementWidth = element.width();
      this.elementHeight = element.height();
      this.elementSize = settings.vertical ? element.outerHeight(true) : element.outerWidth(true);
         
      // Early versions of jQuery have a broken clone method for IE.  This fixes that.
      if( jQuery.browser.msie && parseInt( jQuery.fn.jquery.replace(".", ""), 10 ) < 132 ) {
        this.template = $("<div></div>").append( jQuery.media.utils.cloneFix( element ) ).html();
      }
      else {
        this.template = $("<div></div>").append( element.clone() ).html();
      }
         
      // Empty our list.
      this.list.empty();
         
      // Initialize our variables.
      this.pagePos = settings.vertical ? "pageY" : "pageX";
      this.margin = settings.vertical ? "marginTop" : "marginLeft";
      this.scrollSize = settings.vertical ? 0 : this.listMask.width();
      this.scrollMid = 0;
      this.mousePos = 0;
      this.listPos = 0;
      this.scrollInterval = 0;
      this.shouldScroll = false;
      this.bottomPos = 0;
      this.ratio = 0;
      this.elements = [];
      this.listSize = 0;

      // Add the slider control to this scroll bar.
      this.scrollBar = scrollRegion.find( settings.ids.scrollTrack ).mediaslider( settings.ids.scrollHandle, settings.vertical );
         
      // Setup the scroll up button.
      this.scrollUp = scrollRegion.find( settings.ids.scrollUp ).medialink( settings, function() {
        _this.scroll( true );
      });
         
      // Setup the scroll down button.
      this.scrollDown = scrollRegion.find( settings.ids.scrollDown ).medialink( settings, function() {
        _this.scroll( false );
      });
         
      if( this.scrollBar ) {
        // Handle the update value event.
        this.scrollBar.display.unbind("updatevalue").bind("updatevalue", function( event, data ) {
          _this.setScrollPos( data * _this.bottomPos, false );
        });
            
        // Handle the set value event.
        this.scrollBar.display.unbind("setvalue").bind("setvalue", function( event, data ) {
          _this.setScrollPos( data * _this.bottomPos, true );
        });

        // Add our event callbacks.
        this.scrollBar.display.bind('mousewheel', function(event, delta, deltaX, deltaY) {
          event.preventDefault();
          _this.onMouseScroll(deltaX, deltaY);
        });
      }

      this.setScrollSize = function( newSize ) {
        if( newSize ) {
          this.scrollSize = newSize;
          this.scrollMid = this.scrollSize / 2;
          var activeSize = this.scrollSize - (settings.hysteresis*2);
          this.bottomPos = (this.listSize - this.scrollSize);
          this.ratio = ( (this.listSize - activeSize) / activeSize );
          this.shouldScroll = (this.bottomPos > 0);
        }
      };

      // Clears this scroll region.
      this.clear = function() {
        // Reset all variables for a page refresh.
        this.mousePos = 0;
        this.shouldScroll = false;
        this.bottomPos = 0;
        this.ratio = 0;
        this.scrolling = false;
        this.elements = [];
        this.listSize = 0;
        this.list.css( this.margin, 0 );
        this.list.children().unbind();
        clearInterval( this.scrollInterval );
        this.list.empty();
      };
         
      this.getOffset = function() {
        return settings.vertical ? this.listMask.offset().top : this.listMask.offset().left;
      };
         
      // Activates the scroll region.
      this.activate = function() {
        // Set the scroll size.
        this.setScrollSize( settings.vertical ? this.listMask.height() : this.listMask.width() );

        // Now reset the list position.
        this.setScrollPos( 0, true );
      };

      // Add an item to this scroll region.
      this.newItem = function() {
        var newTemplate = $(this.template);
        this.list.append( newTemplate );
        var element = this.getElement( newTemplate, this.elements.length );
        this.listSize += element.size;
        if( settings.vertical ) {
          this.list.css({
            height:this.listSize
          });
        }
        else {
          this.list.css({
            width:this.listSize
          });
        }
        this.elements.push( element );
        return element.obj;
      };

      // Returns the cached element object with all properties.
      this.getElement = function( element, index ) {
        var size = this.elementSize;
        var pos = this.listSize;
        return {
          obj:element,
          size:size,
          position:pos,
          bottom:(pos+size),
          mid:(size/2),
          index:index
        };
      };

      // Scroll the list up or down one element.
      this.scroll = function( up ) {
        var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
        if( element ) {
          var newElement = (element.straddle || up) ? element : this.elements[ element.index + 1 ];
          if( newElement ) {
            var _listPos = up ? newElement.position : (newElement.bottom - this.scrollSize);
            this.setScrollPos( _listPos, true );
          }
        }
      };

      // Called when the mouse scrolls.
      this.onMouseScroll = function( deltaX, deltaY ) {
        var d = settings.vertical ? -deltaY : deltaX;
        this.setScrollPos(this.listPos + (settings.scrollSpeed*d));
      };

      // Called when the mouse moves within the scroll region.
      this.onMouseMove = function( event ) {
        this.mousePos = event[ this.pagePos ] - this.getOffset();

        // If the scroll type is span, then just move the list
        // up and down according to the listSize/regionSize ratio.
        if( this.shouldScroll && this.spanMode ) {
          this.setScrollPos( (this.mousePos - settings.hysteresis) * this.ratio );
        }
      };

      // Called when the mouse enters the scroll region.
      this.onMouseOver = function( event ) {
        if( this.shouldScroll ) {
          clearInterval( this.scrollInterval );
          this.scrollInterval = setInterval( function() {
            _this.update();
          }, settings.updateTimeout );
        }
      };

      // Called when the mouse exits the scroll region.
      this.onMouseOut = function( event ) {
        clearInterval( this.scrollInterval );
      };

      // This function will align the scroll region.
      this.align = function( up ) {
        var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
        if( element ) {
          var _listPos = up ? element.position : (element.bottom - this.scrollSize);
          this.setScrollPos( _listPos, true );
        }
      };

      // Will set the element at the given index visible.
      this.setVisible = function( index ) {
        var element = this.elements[index];
        if( element ) {
          var newPos = this.listPos;
          if( element.position < this.listPos ) {
            newPos = element.position;
          } else if( (element.bottom - this.listPos) > this.scrollSize ) {
            newPos = element.bottom - this.scrollSize;
          }
          if( newPos != this.listPos ) {
            this.setScrollPos( newPos, true );
          }
        }
      };

      // Gets an element at a specific location in the list.
      this.getElementAtPosition = function( position ) {
        var element = null;
        var i = this.elements.length;
        while(i--) {
          element = this.elements[i];
          if( ((element.position - this.listPos) < position) &&
            ((element.bottom - this.listPos) >= position) ) {
            element.straddle = ((element.bottom - this.listPos) != position);
            break;
          }
        }
        return element;
      };

      // Called every interval to update the scroll position.
      this.update = function() {
        var delta = this.mousePos - this.scrollMid;
        if( Math.abs(delta) > settings.hysteresis ) {
          var hyst = (delta > 0) ? -settings.hysteresis : settings.hysteresis;
          delta = settings.scrollSpeed * (( this.mousePos + hyst - this.scrollMid) / this.scrollMid);
          this.setScrollPos(this.listPos + delta);
        }
      };

      // Sets the scroll position.
      this.setScrollPos = function( _listPos, tween ) {
        // Make sure we are greater than zero here.
        _listPos = (_listPos < 0) ? 0 : _listPos;

        // See if we should scroll and if the list position is
        // greater than the bottom position.
        if( this.shouldScroll && (_listPos > this.bottomPos) ) {
          _listPos = this.bottomPos;
        }
            
        // Now set the list position.
        this.listPos = _listPos;
        
        // Set the position of the scroll bar.
        if( this.scrollBar ) {
          var newPos = this.bottomPos ? (this.listPos / this.bottomPos) : 0;
          this.scrollBar.setPosition( newPos );
        }
            
        if( tween ) {
          if( settings.vertical ) {
            this.list.animate({
              marginTop: -this.listPos
            }, (settings.scrollSpeed*10));
          }
          else {
            this.list.animate({
              marginLeft: -this.listPos
            }, (settings.scrollSpeed*10));
          }
        }
        else {
          this.list.css( this.margin, -this.listPos );
        }
      };
    })( this, settings );
  };
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
 */

  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the sha256 object.
    sha256 : function() {
      /* A JavaScript implementation of the SHA family of hashes, as defined in FIPS PUB 180-2
      * as well as the corresponding HMAC implementation as defined in FIPS PUB 198a
      * Version 1.2 Copyright Brian Turek 2009
      * Distributed under the BSD License
      * See http://jssha.sourceforge.net/ for more information
      *
      * Several functions taken from Paul Johnson
      */
      function jsSHA(o,p){jsSHA.charSize=8;jsSHA.b64pad="";jsSHA.hexCase=0;var q=null;var r=null;var s=function(a){var b=[];var c=(1<<jsSHA.charSize)-1;var d=a.length*jsSHA.charSize;for(var i=0;i<d;i+=jsSHA.charSize){b[i>>5]|=(a.charCodeAt(i/jsSHA.charSize)&c)<<(32-jsSHA.charSize-i%32)}return b};var u=function(a){var b=[];var c=a.length;for(var i=0;i<c;i+=2){var d=parseInt(a.substr(i,2),16);if(!isNaN(d)){b[i>>3]|=d<<(24-(4*(i%8)))}else{return"INVALID HEX STRING"}}return b};var v=null;var w=null;if("HEX"===p){if(0!==(o.length%2)){return"TEXT MUST BE IN BYTE INCREMENTS"}v=o.length*4;w=u(o)}else if(("ASCII"===p)||('undefined'===typeof(p))){v=o.length*jsSHA.charSize;w=s(o)}else{return"UNKNOWN TEXT INPUT TYPE"}var A=function(a){var b=jsSHA.hexCase?"0123456789ABCDEF":"0123456789abcdef";var c="";var d=a.length*4;for(var i=0;i<d;i++){c+=b.charAt((a[i>>2]>>((3-i%4)*8+4))&0xF)+b.charAt((a[i>>2]>>((3-i%4)*8))&0xF)}return c};var B=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var c="";var d=a.length*4;for(var i=0;i<d;i+=3){var e=(((a[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>a.length*32){c+=jsSHA.b64pad}else{c+=b.charAt((e>>6*(3-j))&0x3F)}}}return c};var C=function(x,n){if(n<32){return(x>>>n)|(x<<(32-n))}else{return x}};var D=function(x,n){if(n<32){return x>>>n}else{return 0}};var E=function(x,y,z){return(x&y)^(~x&z)};var F=function(x,y,z){return(x&y)^(x&z)^(y&z)};var G=function(x){return C(x,2)^C(x,13)^C(x,22)};var I=function(x){return C(x,6)^C(x,11)^C(x,25)};var J=function(x){return C(x,7)^C(x,18)^D(x,3)};var L=function(x){return C(x,17)^C(x,19)^D(x,10)};var M=function(x,y){var a=(x&0xFFFF)+(y&0xFFFF);var b=(x>>>16)+(y>>>16)+(a>>>16);return((b&0xFFFF)<<16)|(a&0xFFFF)};var N=function(a,b,c,d){var e=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF);var f=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16);return((f&0xFFFF)<<16)|(e&0xFFFF)};var O=function(a,b,c,d,e){var f=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF);var g=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)};var P=function(j,k,l){var W=[];var a,b,c,d,e,f,g,h;var m,T2;var H;var K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];if(l==="SHA-224"){H=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4]}else{H=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19]}j[k>>5]|=0x80<<(24-k%32);j[((k+1+64>>9)<<4)+15]=k;var n=j.length;for(var i=0;i<n;i+=16){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(var t=0;t<64;t++){if(t<16){W[t]=j[t+i]}else{W[t]=N(L(W[t-2]),W[t-7],J(W[t-15]),W[t-16])}m=O(h,I(e),E(e,f,g),K[t],W[t]);T2=M(G(a),F(a,b,c));h=g;g=f;f=e;e=M(d,m);d=c;c=b;b=a;a=M(m,T2)}H[0]=M(a,H[0]);H[1]=M(b,H[1]);H[2]=M(c,H[2]);H[3]=M(d,H[3]);H[4]=M(e,H[4]);H[5]=M(f,H[5]);H[6]=M(g,H[6]);H[7]=M(h,H[7])}switch(l){case"SHA-224":return[H[0],H[1],H[2],H[3],H[4],H[5],H[6]];case"SHA-256":return H;default:return[]}};this.getHash=function(a,b){var c=null;var d=w.slice();switch(b){case"HEX":c=A;break;case"B64":c=B;break;default:return"FORMAT NOT RECOGNIZED"}switch(a){case"SHA-224":if(q===null){q=P(d,v,a)}return c(q);case"SHA-256":if(r===null){r=P(d,v,a)}return c(r);default:return"HASH NOT RECOGNIZED"}};this.getHMAC=function(a,b,c,d){var e=null;var f=null;var g=[];var h=[];var j=null;var k=null;var l=null;switch(d){case"HEX":e=A;break;case"B64":e=B;break;default:return"FORMAT NOT RECOGNIZED"}switch(c){case"SHA-224":l=224;break;case"SHA-256":l=256;break;default:return"HASH NOT RECOGNIZED"}if("HEX"===b){if(0!==(a.length%2)){return"KEY MUST BE IN BYTE INCREMENTS"}f=u(a);k=a.length*4}else if("ASCII"===b){f=s(a);k=a.length*jsSHA.charSize}else{return"UNKNOWN KEY INPUT TYPE"}if(512<k){f=P(f,k,c);f[15]&=0xFFFFFF00}else if(512>k){f[15]&=0xFFFFFF00}for(var i=0;i<=15;i++){g[i]=f[i]^0x36363636;h[i]=f[i]^0x5C5C5C5C}j=P(g.concat(w),512+v,c);j=P(h.concat(j),512+l,c);return(e(j))}}

      // But I wrote this...   ;)
      this.encrypt = function( key, input ) {
        var shaObj = new jsSHA(input, "ASCII");
        return shaObj.getHMAC(key, "ASCII", "SHA-256", "HEX");
      };
    }
  }, jQuery.media );

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
 */

  jQuery.fn.mediaslider = function( handleId, vertical, inverted ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( control, handleId, vertical, inverted ) {
      var _this = this;
      this.display = control.css({
        cursor:"pointer"
      });
      this.dragging = false;
      this.value = 0;
      this.handle = this.display.find(handleId);
      this.pagePos = vertical ? "pageY" : "pageX";
      this.handlePos = 0;

      // Only if there is a handle.
      if( this.handle.length > 0 ) {
        this.handleSize = vertical ? this.handle.height() : this.handle.width();
        this.handleMid = (this.handleSize/2);
      }
         
      this.onResize = function() {
        this.setTrackSize();
        this.updateValue( this.value );
      };

      this.setTrackSize = function() {
        this.trackSize = vertical ? this.display.height() : this.display.width();
        this.trackSize -= this.handleSize;
        this.trackSize = (this.trackSize > 0) ? this.trackSize : 1;
      };
         
      this.setValue = function( _value ) {
        this.setPosition( _value );
        this.display.trigger( "setvalue", this.value );
      };
         
      this.updateValue = function( _value ) {
        this.setPosition( _value );
        this.display.trigger( "updatevalue", this.value );
      };
         
      this.setPosition = function( _value ) {
        _value = (_value < 0) ? 0 : _value;
        _value = (_value > 1) ? 1 : _value;
        this.value = _value;
        this.handlePos = inverted ? (1-this.value) : this.value;
        this.handlePos *= this.trackSize;
        this.handle.css( (vertical ? "marginTop" : "marginLeft"), this.handlePos );
      };
         
      this.display.unbind("mousedown").bind("mousedown", function( event ) {
        event.preventDefault();
        _this.dragging = true;
      });
         
      this.getOffset = function() {
        var offset = vertical ? this.display.offset().top : this.display.offset().left;
        return (offset + (this.handleSize / 2));
      };
         
      this.getPosition = function( pagePos ) {
        var pos = (pagePos - this.getOffset()) / this.trackSize;
        pos = (pos < 0) ? 0 : pos;
        pos = (pos > 1) ? 1 : pos;
        pos = inverted ? (1-pos) : pos;
        return pos;
      };
         
      this.display.unbind("mousemove").bind("mousemove", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.updateValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });

      this.display.unbind("mouseleave").bind("mouseleave", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.dragging = false;
          _this.setValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });
         
      this.display.unbind("mouseup").bind("mouseup", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.dragging = false;
          _this.setValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });
         
      this.onResize();

    })( this, handleId, vertical, inverted );
  };
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
 */

  
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    pageLink:false
  });
  
  jQuery.fn.mediateaser = function( server, nodeInfo, _index, settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( server, nodeInfo, _index, teaser, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
         
      var _this = this;
      this.display = teaser;
         
      // If they hover over the teaser...
      this.display.unbind("mouseenter").bind( "mouseenter", function(event) {
        if( settings.template.onTeaserOver ) {
          settings.template.onTeaserOver( _this );
        }
      });
         
      // If they hover away from the teaser...
      this.display.unbind("mouseleave").bind( "mouseleave", function(event) {
        if( settings.template.onTeaserOut ) {
          settings.template.onTeaserOut( _this );
        }
      });
         
      // The index of this teaser
      this.index = _index;

      // Setup the node.
      this.node = this.display.medianode( server, settings );
         
      // Load the node information.
      if( this.node ) {
        this.node.loadNode( nodeInfo );
      }
         
      // If they wish to link these teasers to actual nodes.
      if( this.node && settings.pageLink ) {
        var path = settings.baseURL;
        path += nodeInfo.path ? nodeInfo.path : ("node/" + nodeInfo.nid);
        this.node.display.wrap('<a href="' + path + '"></a>');
      }

      this.reset = function() {
        if( this.node ) {
          this.node.display.unbind();
        }
      };

      this.setActive = function( _active ) {
        if( settings.template.onTeaserActivate ) {
          settings.template.onTeaserActivate(this, _active);
        }
      };
         
      this.setSelected = function( _selected ) {
        if( settings.template.onTeaserSelect ) {
          settings.template.onTeaserSelect(this, _selected);
        }
      };
         
      // Let the template setup the teaser.
      if( settings.template.onTeaserLoad ) {
        settings.template.onTeaserLoad( this );
      }
    })( server, nodeInfo, _index, this, settings );
  };
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
 */
 
  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    titleLinks:"#mediatitlelinks"
  });
   
  jQuery.fn.mediatitlebar = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( titleBar, settings ) {
      // Save the jQuery display.
      var _this = this;
      this.display = titleBar;
         
      this.titleLinks = this.display.find( settings.ids.titleLinks );
         
      this.display.find("a").each( function() {
        var linkId = $(this).attr("href");     
        $(this).medialink( settings, function( event ) {
          event.preventDefault();
          _this.display.trigger( event.data.id );
        }, {
          id:linkId.substr(1),
          obj:$(this)
        } );
      });
    })( this, settings );
  };

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
 */

  jQuery.media = jQuery.extend( {}, {
    utils : {
      getBaseURL : function() {
        var url = new RegExp(/^(http[s]?\:[\\\/][\\\/])([^\\\/\?]+)/);
        var results = url.exec(location.href);
        return results ? results[0] : "";
      },

      timer:{},
      stopElementHide:{},
      showThenHide : function( element, id, showSpeed, hideSpeed, finished ) {
        if( element ) {
          element.show(showSpeed);
          if( jQuery.media.utils.timer.hasOwnProperty(id) ) {
            clearTimeout( jQuery.media.utils.timer[id] );
          }
          jQuery.media.utils.timer[id] = setTimeout( function() {
            if( !jQuery.media.utils.stopElementHide[id] ) {
              element.hide(hideSpeed, function() {
                if( jQuery.media.utils.stopElementHide[id] ) {
                  element.show();
                }

                if( finished ) {
                  finished();
                }
              });
            }
          }, 5000);
        }
      },

      stopHide : function( element, id ) {
        jQuery.media.utils.stopElementHide[id] = true;
        clearTimeout(jQuery.media.utils.timer[id]);
      },

      stopHideOnOver : function( element, id ) {
        if( element ) {
          jQuery.media.utils.stopElementHide[id] = false;
          element.unbind("mouseover").bind("mouseover", {id:id}, function( event ) {
            jQuery.media.utils.stopElementHide[event.data.id] = true;
          }).unbind("mouseout").bind("mouseout", {id:id}, function( event ) {
            jQuery.media.utils.stopElementHide[event.data.id] = false;
          });
        }
      },

      getSettings : function( settings ) {
        // Make sure it exists...
        if( !settings ) {
          settings = {};
        }
                    
        // Only get the settings if they have not yet been initialized.
        if( !settings.initialized ) {
          settings = jQuery.extend( {}, jQuery.media.defaults, settings );
          settings.ids = jQuery.extend( {}, jQuery.media.ids, settings.ids );
          settings.baseURL = settings.baseURL ? settings.baseURL : jQuery.media.utils.getBaseURL();
          settings.baseURL += settings.baseURL ? "/" : "";
          settings.initialized = true;
        }
            
        // Return the settings.
        return settings;
      },
         
      getId : function( display ) {
        return display.attr("id") ? display.attr("id") : display.attr("class") ? display.attr("class") : "mediaplayer";
      },
         
      getScaledRect : function( ratio, rect ) {
        var scaledRect = {};
        scaledRect.x = rect.x ? rect.x : 0;
        scaledRect.y = rect.y ? rect.y : 0;
        scaledRect.width = rect.width ? rect.width : 0;
        scaledRect.height = rect.height ? rect.height : 0;

        if( ratio ) {
          var newRatio = (rect.width / rect.height);
          scaledRect.height = (newRatio > ratio) ? rect.height : Math.floor(rect.width / ratio);
          scaledRect.width = (newRatio > ratio) ? Math.floor(rect.height * ratio) : rect.width;
          scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
          scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
        }

        return scaledRect;
      },

      // Checks all parents visibility, and resets them and adds those items to a passed in
      // array which can be used to reset their visibiltiy at a later point by calling
      // resetVisibility
      checkVisibility : function( display, invisibleParents ) {
        var isVisible = true;
        display.parents().each( function() {
          var jObject = jQuery(this);
          if( !jObject.is(':visible') ) {
            isVisible = false;
            var attrClass = jObject.attr("class");
            invisibleParents.push( {
              obj:jObject,
              attr:attrClass
            } );
            jObject.removeClass(attrClass);
          }
        });
      },

      // Reset's the visibility of the passed in parent elements.
      resetVisibility : function( invisibleParents ) {
        // Now iterate through all of the invisible objects and rehide them.
        var i = invisibleParents.length;
        while(i){
          i--;
          invisibleParents[i].obj.addClass(invisibleParents[i].attr);
        }
      },
         
      getFlash : function( player, id, width, height, flashvars, wmode ) {
        // Get the protocol.
        var protocol = window.location.protocol;
        if (protocol.charAt(protocol.length - 1) == ':') {
          protocol = protocol.substring(0, protocol.length - 1);
        }

        // Convert the flashvars object to a string...
        var flashVarsString = jQuery.param(flashvars);

        // Get the HTML flash object string.
        var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
        flash += 'codebase="' + protocol + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ';
        flash += 'width="' + width + '" ';
        flash += 'height="' + height + '" ';
        flash += 'id="' + id + '" ';
        flash += 'name="' + id + '"> ';
        flash += '<param name="allowScriptAccess" value="always"></param>';
        flash += '<param name="allowfullscreen" value="true" />';
        flash += '<param name="movie" value="' + player + '"></param>';
        flash += '<param name="wmode" value="' + wmode + '"></param>';
        flash += '<param name="quality" value="high"></param>';
        flash += '<param name="FlashVars" value="' + flashVarsString + '"></param>';
        flash += '<embed src="' + player + '" quality="high" width="' + width + '" height="' + height + '" ';
        flash += 'id="' + id + '" name="' + id + '" swLiveConnect="true" allowScriptAccess="always" wmode="' + wmode + '"';
        flash += 'allowfullscreen="true" type="application/x-shockwave-flash" FlashVars="' + flashVarsString + '" ';
        flash += 'pluginspage="' + protocol + '://www.macromedia.com/go/getflashplayer" />';
        flash += '</object>';
        return flash;
      },
         
      removeFlash : function( obj, id ) {
        if( typeof(swfobject) != "undefined" ) {
          swfobject.removeSWF( id );
        }
        else {
          var flash = obj.find('object').eq(0)[0];
          if( flash ) {
            flash.parentNode.removeChild(flash);
          }
        }
      },
         
      // Insert flash routine.  If they have swfobject, then this function will dynamically use that instead.
      insertFlash : function( obj, player, id, width, height, flashvars, wmode, onAdded ) {
        jQuery.media.utils.removeFlash( obj, id );
        obj.children().remove();
        obj.append('<div id="' + id + '"><p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p></div>');
        if( typeof(swfobject) != "undefined" ) {
          var params = {
            allowScriptAccess:"always",
            allowfullscreen:"true",
            wmode:wmode,
            quality:"high"
          };
          swfobject.embedSWF(
            player,
            id,
            width,
            height,
            "9.0.0",
            "expressInstall.swf",
            flashvars,
            params,
            {},
            function( swf ) {
              onAdded( swf.ref );
            }
            );
        }
        else {
          var flash = jQuery.media.utils.getFlash( player, id, width, height, flashvars, wmode );
          var container = obj.find('#' + id).eq(0);
          if( jQuery.browser.msie ) {
            container[0].outerHTML = flash;
            onAdded( obj.find('object').eq(0)[0] );
          } else {
            container.replaceWith( flash );
            onAdded( obj.find('embed').eq(0)[0] );
          }
        }
      },
                  
      // Fix the clone method for jQuery 1.2.6 - 1.3.1
      cloneFix: function( obj, events ) {
        // Do the clone
        var ret = obj.map(function(){
          // IE copies events bound via attachEvent when
          // using cloneNode. Calling detachEvent on the
          // clone will also remove the events from the orignal
          // In order to get around this, we use innerHTML.
          // Unfortunately, this means some modifications to
          // attributes in IE that are actually only stored
          // as properties will not be copied (such as the
          // the name attribute on an input).
          var html = this.outerHTML;
          if ( !html ) {
            var div = this.ownerDocument.createElement("div");
            div.appendChild( this.cloneNode(true) );
            html = div.innerHTML;
          }
   
          return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0];
        });
      
        // Copy the events from the original to the clone
        if ( events === true ) {
          var orig = obj.find("*").andSelf(), i = 0;
      
          ret.find("*").andSelf().each(function(){
            if ( this.nodeName !== orig[i].nodeName ) {
              return;
            }
      
            var events = jQuery.data( orig[i], "events" );
      
            for ( var type in events ) {
              if( events.hasOwnProperty( type ) ) {
                for ( var handler in events[ type ] ) {
                  if( events[ type ].hasOwnProperty( handler ) ) {
                    jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
                  }
                }
              }
            }
      
            i++;
          });
        }
      
        // Return the cloned set
        return ret;
      }
    }
  }, jQuery.media );
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
 */

  

  window.onVimeoReady = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  window.onVimeoFinish = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onFinished();
  };

  window.onVimeoLoading = function( data, playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onLoading( data );
  };

  window.onVimeoPlay = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onPlaying();
  };

  window.onVimeoPause = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onPaused();
  };

  window.onVimeoProgress = function( time, playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onProgress(time);
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "vimeo":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
    }
  });

  jQuery.fn.mediavimeo = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.ready = false;
      this.bytesLoaded = 0;
      this.bytesTotal = 0;
      this.currentVolume = 1;

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var flashvars = {
          clip_id:this.getId(videoFile.path),
          width:"100%",
          height:"100%",
          js_api:'1',
          js_onLoad:'onVimeoReady',
          js_swf_id:playerId
        };
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://vimeo.com/moogaloop.swf?rand=' + rand;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          flashvars,
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.getId = function( path ) {
        var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
        return (path.search(regex) === 0) ? path.replace(regex, "$3") : path;
      };

      this.loadMedia = function( videoFile ) {
        this.bytesLoaded = 0;
        this.bytesTotal = 0;
        this.createMedia( videoFile );
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      // Load the player.
      this.loadPlayer = function() {
        if( this.ready && this.player && this.player.api_addEventListener ) {
          // Add our event listeners.
          this.player.api_addEventListener('onProgress', 'onVimeoProgress');
          this.player.api_addEventListener('onFinish', 'onVimeoFinish');
          this.player.api_addEventListener('onLoading', 'onVimeoLoading');
          this.player.api_addEventListener('onPlay', 'onVimeoPlay');
          this.player.api_addEventListener('onPause', 'onVimeoPause');

          // Let them know the player is ready.
          onUpdate({
            type:"playerready"
          });

          this.playMedia();
        }
      };

      this.onFinished = function() {
        onUpdate({
          type:"complete"
        });
      };

      this.onLoading = function( data ) {
        this.bytesLoaded = data.bytesLoaded;
        this.bytesTotal = data.bytesTotal;
      };

      this.onPlaying = function() {
        onUpdate({
          type:"playing",
          busy:"hide"
        });
      };

      this.onPaused = function() {
        onUpdate({
          type:"paused",
          busy:"hide"
        });
      };

      this.playMedia = function() {
        onUpdate({
          type:"playing",
          busy:"hide"
        });
        if (this.player.api_play) {
          this.player.api_play();
        }
      };

      this.onProgress = function( time ) {
        onUpdate({
          type:"progress"
        });
      };

      this.pauseMedia = function() {
        onUpdate({
          type:"paused",
          busy:"hide"
        });
        if (this.player.api_pause) {
          this.player.api_pause();
        }
      };

      this.stopMedia = function() {
        this.pauseMedia();
        if (this.player.api_unload) {
          this.player.api_unload();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if (this.player.api_seekTo) {
          this.player.api_seekTo( pos );
        }
      };

      this.setVolume = function( vol ) {
        this.currentVolume = vol;
        if (this.player.api_setVolume) {
          this.player.api_setVolume( (vol*100) );
        }
      };

      // For some crazy reason... Vimeo has not implemented this... so just cache the value.
      this.getVolume = function() {
        return this.currentVolume;
      };

      this.getDuration = function() {
        return this.player.api_getDuration ? this.player.api_getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return this.player.api_getCurrentTime ? this.player.api_getCurrentTime() : 0;
      };

      this.getBytesLoaded = function() {
        return this.bytesLoaded;
      };

      this.getBytesTotal = function() {
        return this.bytesTotal;
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      this.hasControls = function() {
        return true;
      };
      this.showControls = function(show) {};
      //this.setSize = function( newWidth, newHeight ) {};
      this.getEmbedCode = function() {
        return "This video cannot be embedded.";
      };
      this.getMediaLink = function() {
        return "This video currently does not have a link.";
      };
    })( this, options, onUpdate );
  };
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
 */

  jQuery.fn.mediavoter = function( settings, server, userVote ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( voteObj, settings, server, userVote ) {
      // Save the jQuery display.
      this.display = voteObj;
      var _this = this;
         
      // The node id.
      this.nodeId = 0;
         
      // Store all of our votes.
      this.votes = [];
         
      // Get the tag for the voting.
      this.tag = this.display.attr("tag");
         
      // Setup each vote element.
      this.display.find("div").each( function() {
        if( userVote ) {
          $(this).css("cursor", "pointer");
          $(this).unbind("click").bind( "click", function( event ) {
            _this.setVote( parseInt($(this).attr("vote"), 10) );
          });
          $(this).unbind("mouseenter").bind( "mouseenter", function( event ) {
            _this.updateVote( {
              value: parseInt($(this).attr("vote"), 10)
            }, true );
          });
        }
        _this.votes.push( {
          vote:parseInt($(this).attr("vote"), 10),
          display:$(this)
        } );
      });

      // Sort the votes based on numerical order.
      this.votes.sort( function( voteA, voteB ) {
        return (voteA.vote - voteB.vote);
      });
         
      // If this is a uservoter, then add the mouse leave event.
      if( userVote ) {
        this.display.unbind("mouseleave").bind( "mouseleave", function( event ) {
          _this.updateVote( {
            value:0
          }, true );
        });
      }
         
      // Update a vote value.
      this.updateVote = function( vote, hover ) {
        if( vote && settings.template.updateVote ) {
          settings.template.updateVote( this, vote.value, hover );
        }
      };
         
      // Get the vote from the server.
      this.getVote = function( nodeInfo ) {
        if( nodeInfo && nodeInfo.nid ) {
          this.nodeId = parseInt(nodeInfo.nid, 10);
          if( nodeInfo.vote ) {
            var vote = userVote ? nodeInfo.vote.uservote : nodeInfo.vote.vote;
            this.updateVote( nodeInfo.vote.vote, false );
            this.display.trigger( "voteGet", vote );
          }
          else {
            if( server && nodeInfo.nid && (this.display.length > 0) ) {
              this.display.trigger( "processing" );
              var cmd = userVote ? jQuery.media.commands.getUserVote : jQuery.media.commands.getVote;
              server.call( cmd, function( vote ) {
                _this.updateVote( vote, false );
                _this.display.trigger( "voteGet", vote );
              }, null, "node", this.nodeId, this.tag );
            }
          }
        }
      };
         
      // Set the current vote.
      this.setVote = function( voteValue ) {
        if( server && this.nodeId ) {
          this.display.trigger( "processing" );
          this.updateVote( {
            value:voteValue
          }, false );
          server.call( jQuery.media.commands.setVote, function( vote ) {
            _this.display.trigger( "voteSet", vote );
          }, null, "node", this.nodeId, voteValue, this.tag );
        }
      };
         
      // Delete the current vote.
      this.deleteVote = function() {
        if( server && this.nodeId ) {
          this.display.trigger( "processing" );
          server.call( jQuery.media.commands.deleteVote, function( vote ) {
            _this.updateVote( vote, false );
            _this.display.trigger( "voteDelete", vote );
          }, null, "node", this.nodeId, this.tag );
        }
      };
    })( this, settings, server, userVote );
  };
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
 */

  

  // Called when the YouTube player is ready.
  window.onYouTubePlayerReady = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "youtube":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
    }
  });

  jQuery.fn.mediayoutube = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.loaded = false;
      this.ready = false;
      this.qualities = [];

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://www.youtube.com/apiplayer?rand=' + rand + '&amp;version=3&amp;enablejsapi=1&amp;playerapiid=' + playerId;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          {},
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.getId = function( path ) {
        var regex = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
        return (path.search(regex) === 0) ? path.replace(regex, "$2") : path;
      };

      this.loadMedia = function( videoFile ) {
        if( this.player ) {
          this.loaded = false;
          this.videoFile = videoFile;

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          if (this.player.loadVideoById) {
            this.player.loadVideoById( this.getId( this.videoFile.path ), 0, options.quality );
          }
        }
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      // Try to load the player.
      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          // Create our callback functions.
          window[options.id + 'StateChange'] = function( newState ) {
            _this.onStateChange( newState );
          };

          window[options.id + 'PlayerError'] = function( errorCode ) {
            _this.onError( errorCode );
          };

          window[options.id + 'QualityChange'] = function( newQuality ) {
            _this.quality = newQuality;
          };

          // Add our event listeners.
          if (this.player.addEventListener) {
            this.player.addEventListener('onStateChange', options.id + 'StateChange');
            this.player.addEventListener('onError', options.id + 'PlayerError');
            this.player.addEventListener('onPlaybackQualityChange', options.id + 'QualityChange');
          }

          // Get all of the quality levels.
          if (this.player.getAvailableQualityLevels) {
            this.qualities = this.player.getAvailableQualityLevels();
          }

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          });

          // Load our video.
          if (this.player.loadVideoById) {
            this.player.loadVideoById( this.getId( this.videoFile.path ), 0 );
          }
        }
      };

      // Called when the YouTube player state changes.
      this.onStateChange = function( newState ) {
        var playerState = this.getPlayerState( newState );
        onUpdate( {
          type:playerState.state,
          busy:playerState.busy
        } );

        if( !this.loaded && playerState == "playing" ) {
          // Set this player to loaded.
          this.loaded = true;

          // Update our meta data.
          onUpdate( {
            type:"meta"
          } );
        }
      };

      // Called when the YouTube player has an error.
      this.onError = function( errorCode ) {
        var errorText = "An unknown error has occured: " + errorCode;
        if( errorCode == 100 ) {
          errorText = "The requested video was not found.  ";
          errorText += "This occurs when a video has been removed (for any reason), ";
          errorText += "or it has been marked as private.";
        } else if( (errorCode == 101) || (errorCode == 150) ) {
          errorText = "The video requested does not allow playback in an embedded player.";
        }
        if( window.console && console.log ) {
          console.log(errorText);
        }
        onUpdate( {
          type:"error",
          data:errorText
        } );
      };

      // Translates the player state for the YouTube API player.
      this.getPlayerState = function( playerState ) {
        switch (playerState) {
          case 5:
            return {state:'ready', busy:false};
          case 3:
            return {state:'buffering', busy:"show"};
          case 2:
            return {state:'paused', busy:"hide"};
          case 1:
            return {state:'playing', busy:"hide"};
          case 0:
            return {state:'complete', busy:false};
          case -1:
            return {state:'stopped', busy:false};
          default:
            return {state:'unknown', busy:false};
        }
        return 'unknown';
      };
      /*
      this.setSize = function( newWidth, newHeight ) {
      //this.player.setSize(newWidth, newHeight);
      };
      */
      this.playMedia = function() {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        if (this.player.playVideo) {
          this.player.playVideo();
        }
      };

      this.pauseMedia = function() {
        if (this.player.pauseVideo) {
          this.player.pauseVideo();
        }
      };

      this.stopMedia = function() {
        if (this.player.stopVideo) {
          this.player.stopVideo();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        if (this.player.seekTo) {
          this.player.seekTo( pos, true );
        }
      };

      this.setVolume = function( vol ) {
        if (this.player.setVolume) {
          this.player.setVolume( vol * 100 );
        }
      };

      this.setQuality = function( quality ) {
        if (this.player.setPlaybackQuality) {
          this.player.setPlaybackQuality( quality );
        }
      };

      this.getVolume = function() {
        return this.player.getVolume ? (this.player.getVolume() / 100) : 0;
      };

      this.getDuration = function() {
        return this.player.getDuration ? this.player.getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return this.player.getCurrentTime ? this.player.getCurrentTime() : 0;
      };

      this.getQuality = function() {
        return this.player.getPlaybackQuality ? this.player.getPlaybackQuality() : 0;
      };

      this.getEmbedCode = function() {
        return this.player.getVideoEmbedCode ? this.player.getVideoEmbedCode() : 0;
      };

      this.getMediaLink = function() {
        return this.player.getVideoUrl ? this.player.getVideoUrl() : 0;
      };

      this.getBytesLoaded = function() {
        return this.player.getVideoBytesLoaded ? this.player.getVideoBytesLoaded() : 0;
      };

      this.getBytesTotal = function() {
        return this.player.getVideoBytesTotal ? this.player.getVideoBytesTotal() : 0;
      };

      this.hasControls = function() {
        return false;
      };
      this.showControls = function(show) {};
    })( this, options, onUpdate );
  };
})(jQuery);