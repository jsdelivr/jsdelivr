function Zebra(options){

  var self = this;


  /* Initializer */

  this.init = function(){
    
    var site = this.getSite();
    window.youtube_player = '';
    window.vimeo_player = '';
    switch(site){
      case 'youtube':
        this.insertYouTube();
        break;
      case 'vimeo':
        this.insertVimeo();
        break;
    }

  }


  /* Options for Player like Height 
      required: target, url, height, width
      optional: playerVars, duringUpdateTime,
        duringNote, onSetNote, onRemoveNote
  */

  this.options = {};

  for(key in options){
    this.options[key] = options[key];
  }

  this.get = function(key){
    return this.options[key];
  }

  this.set = function(key,value){
    this.options[key] = value;
  }

  this.customCallback = function(callback, data){
    /* Custom Callback */
    if (self.get(callback)) {
      self.get(callback)(data);
    };
  }


  /* Data Related to Player like Current Time */

  this.data = {};

  this.getData = function(key){
    return this.data[key];
  }

  this.setData = function(key,value){
    this.data[key] = value;
  }


  /* Methods to CRUD Notes */

  this.notes = options.notes || [];

  this.getNote = function(seconds){
    var time = parseFloat(seconds);
    var notes = this.notes;
    for (var i = 0; i < notes.length; i++) {
      if(notes[i].start == time){
        return notes[i];
        break;
      }
    };
  }

  this.setNote = function(note){
    /* set default end to 3 seconds after */
    note.start = parseFloat(note.start) || 0;
    note.end = note.end ? parseFloat(note.end) : note.start + 3;
    this.notes.push(note);

    /* Custom Callback */
    this.customCallback('onSetNote',note);

  }



  this.removeNote = function(seconds){
    var notes = this.notes,
        index = -1,
        time = parseFloat(seconds);

    for(var i = 0; i < notes.length; i++) {
      if (notes[i].start == time) {
        index = i;
        break;
      }
    }

    var result = '';
    if (index == -1) {
      result = false;

      this.customCallback('onRemoveNote',result);

      return false;
    } else {
      
      result = notes[index];

      /* Custom Callback */
      this.customCallback('onRemoveNote',result);

      this.notes.splice(index,1);
      return true;
    }
  }

  this.useNote = function(seconds){
    var notes = self.notes
      , index = -1
      , time = parseFloat(seconds)
      , active_note = false;

    for(var i = 0; i < notes.length; i++) {
      var note = notes[i];
      if (note.start <= seconds && note.end >= seconds) {
        active_note = true;
        if (note.used == false || !note.used) {
          self.setUsed(i);
          if (note.callback) {
            note.callback(note);  
          } else {
            self.customCallback('duringNote',note);
          };
          
        };
        break;
      }
    }

    if (!active_note) {
      self.customCallback('duringTimeline');
    };

  }

  this.setUsed = function(index){
    this.notes[index].used = true;
  }

  this.removeUsed = function(index){
    this.notes[index].used = false;
  }

  this.clearAllUsed = function(){
    var notes = this.notes;
    for (var i = 0; i < notes.length; i++) {
      this.removeUsed(i);
    };
  }

  
  /* Return Site from URL */

  this.getSite = function(){
    var site = '';
    var REGEX_MAP = {
      youtube: /(?:https?:\/\/www\.|https?:\/\/|www\.|\.|^)youtu/,
      vimeo:   /(?:https?:\/\/www\.|https?:\/\/|www\.|\.|^)vimeo/
    }
    var url = this.get('url');
    for(site in REGEX_MAP){
      if (url.match(REGEX_MAP[site]) !== null ) {
        return site;
      };
    }
  }


  /* YOUTUBE = YT*/

  /* Insert YT into DOM */
  this.insertYouTube = function(){

    /* Insert jQuery & YT scripts, if needed */
    if (!window.jQuery) {this.insertScript('jQuery')};
    if (!window.YT) {this.insertScript('YT')};
    
    /* Set Options */
    window.intervalId = '';
    var url = this.get('url')
      , target = this.get('target')
      , events = {
        'onReady':this.onPlayerReady,
        'onPlaybackQualityChange': this.onPlayerPlaybackQualityChange,
        'onStateChange': this.onPlayerStateChange,
        'onError': this.onPlayerError,
        'onApiChange' : this.onPlayerApiChange
      }
      , config = {
          width: this.get('width'),
          height: this.get('height'),
          playerVars: this.get('playerVars') || {},
          videoId: this.getYouTubeId(),
          events: events
        };
    
    /* Required Globals
      (1) YT Player object
      (2) 'onYouTubeIframeAPIReady' function
    */
    window.intervalId = '';
    
    window.onYouTubeIframeAPIReady = function() {
      youtube_player = new YT.Player( target, config );
    }
  }


  /* YT Video ID */
  
  this.getYouTubeId = function(){
    var url = this.get('url');
    var videoId = url.split('v=')[1];
    var ampersandPosition = videoId.indexOf('&');
    if(ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
  }


  /* YT Listeners */

  this.onPlayerReady = function(){
    console.log('youtube ready');
  }

  this.onPlayerPlaybackQualityChange = function(e){
    console.log('Playback Quality Change: '+e.target);
  }

  this.onPlayerStateChange = function(e){
    
    if (e) {

      /* playing */
      if (e.data == 1) {
        window.intervalId = setInterval(self.playing,100);
        /*console.log('state 1');*/
      };

      /* paused */
      if (e.data == 2) {
        window.clearInterval(window.intervalId);
        self.paused();
        /*console.log('state 2');*/
      };

      /* buffering */
      if (e.data == 3) {
        /*console.log('state 3');*/
      };

      /* cued */
      if (e.data == 5) {
        /*console.log('state 5');*/
      };

      /* ended */
      if (e.data == 0) {
        console.log('state 0');
      };      

    };
  }

  this.onPlayerError = function(e){
    console.log('Error: '+e.target);
  }

  this.onPlayerApiChange = function(e){
    console.log('Api Change: '+e.target);
  }


  /* COMMON Listeners */

  this.time = '';

  this.playing = function(data,id){
    self.updateTime(data,id);
    self.useNote(self.time);
  }

  this.paused = function(data,id){
    self.clearAllUsed();
    self.updateTime(data,id)
  }

  this.updateTime = function(data,id){
    self.clearAllUsed();
    var site = this.getSite();
    switch(self.getSite()){
      case 'youtube':
        self.time = youtube_player.getCurrentTime();
        break;
      case 'vimeo':
        vimeo_player.api('getCurrentTime',function(value,id){ 
          self.time = value;
        });
        break;
    }

    /* Custom Callback */
    self.customCallback('duringUpdateTime',self.time);

  }

  /* COMMON Controls */

  this.getControls = function(site){
    var controls = {
      youtube: {
        play: (function(){youtube_player.playVideo()}),
        pause: (function(){youtube_player.pauseVideo()}),
        seekTo: (function(seconds){youtube_player.seekTo(seconds)}),
        duration: (function(){youtube_player.getDuration()}),
      },
      vimeo:{
        play: (function(){vimeo_player.api('play')}),
        pause: (function(){vimeo_player.api('pause')}),
        seekTo: (function(seconds){vimeo_player.api('seekTo',seconds)}),
        duration: (function(){vimeo_player.getDuration()}),
      }
    }
    return controls[site];
  }

  this.play = function(){
    var site = this.getSite();
    var player = this.getControls(site);
    player.play();
  }

  this.pause = function(){
    var site = this.getSite();
    var player = this.getControls(site);
    player.pause();
  }

  this.seekTo = function(seconds){
    var site = this.getSite();
    var player = this.getControls(site);
    player.seekTo(seconds);
    player.pause();
  }

  this.requireScripts = function(libraries){
    self.ready.total_scripts = libraries.length;
    for (var i = 0; i < libraries.length; i++) {
      this.insertScript(libraries[i],self.ready.script);
    };
  }

  this.insertVimeoIframe = function(){
    var target = this.get('target')
      , url = this.get('url')
      , api_params = '?api=1&player_id='+target
      , width = this.get('width')
      , height = this.get('height');

    var playerVars = self.get('playerVars') || ''
      , config_params = '';

    for (key in playerVars){
      config_params += '&'+key+'='+playerVars[key];
    }

    console.log(url+api_params+config_params);


    $('#'+target).replaceWith(
      '<iframe id="'+target+
      '" src="'+url+api_params+config_params+
      '" width="'+width+
      '" height="'+height+
      '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').ready(function(){
        self.onVimeoIframeAPIReady();    
      });
    
  }

  this.onVimeoIframeAPIReady = function(){
    console.log('vimeo running');
    
    var iframe = document.getElementById(self.get('target'));
    
    vimeo_player = $f(iframe);

    vimeo_player.addEvent('ready', function() {
      console.log('vimeo ready');

      vimeo_player.addEvent('pause', self.paused);
      vimeo_player.addEvent('finish', self.finished);
      vimeo_player.addEvent('playProgress', self.playing);
    });
  }

  this.insertVimeo = function(){
    var scripts = ['jQuery','Froogaloop'];
    this.requireScripts(scripts);
  }

  this.ready = {
    total_scripts:0,
    loaded_scripts:0,
    script: function(library){
      self.ready.loaded_scripts++;
      if (self.ready.loaded_scripts >= self.ready.total_scripts) {
        self.insertVimeoIframe();
      };
      
    },
    iframe: function(target){
      console.log(target);
    }

  }

  this.insertScript = function(library, onLoadCallback){
    var script = this.libraries()[library];
    var tag = document.createElement('script');
    tag.src = script;
    tag.type = 'text/javascript';
    if (onLoadCallback) {
      tag.onload = function(){
        onLoadCallback(library)
      };
      tag.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            (function(){
              onLoadCallback(library)
            })();
        }
      }  
    };
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
  };

  this.libraries = function(){
    return {
      YT: 'https://www.youtube.com/iframe_api',
      Froogaloop: 'http://a.vimeocdn.com/js/froogaloop2.min.js',
      jQuery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'
    }
  }



  this.init.call(this);

}