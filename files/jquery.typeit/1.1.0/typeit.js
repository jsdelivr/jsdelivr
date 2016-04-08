/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @version 1.2.0
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string or strings.
 */

 (function($){

   // the actual jQuery function
   $.fn.typeIt = function(options, callback){
    // now call a callback function
     return this.each(function(){
       $(this).data("typeit", new $.fn.typeIt.typeItClass($(this), options, callback));
     });
   };

   // create the class
   $.fn.typeIt.typeItClass = function(theElement, options, callback){
    // plugin default settings
    this.defaults = {
       whatToType:'This is the default string. Please replace this string with your own.',
       typeSpeed: 200,
       lifeLike: false,
       showCursor: true,
       breakLines: true,
       breakWait: 500,
       delayStart: 250
     };

    this.dataDefaults = {
     whatToType : theElement.data('typeitWhattotype'),
     typeSpeed: theElement.data('typeitSpeed'),
     lifeLike: theElement.data('typeitLifelike'),
     showCursor: theElement.data('typeitShowcursor'),
     breakLines: theElement.data('typeitBreaklines'),
     breakWait: theElement.data('typeitBreakWait'),
     delayStart : theElement.data('typeitDelayStart')
    };

    // the element that holds the text
    this.theElement = theElement;
    // callback function that executes after strings have been printed
    this.callback = callback;
    // the settings for the plugin instance
    this.settings = $.extend({}, this.defaults, options, this.dataDefaults);
    // the number of types a character has been typed for each pass over a string
    this.typeCount = 0;
    // the character number of a string that's currently being deleted
    this.deleteCount = 0;
    // the string number that's currently being typed or deleted
    this.stringCount = 0;
    this.stringPlaceCount = 0;
    // the length of the current string being handled
    this.phraseLength = 0;
    this.cursor = '';
    this.deleteTimeout = null;
    this.typeTimeout = null;
    this.shortenedText = null;

    if(typeof this.callback != 'function'){
      console.log('Your callback is not a valid function. Please format your callback as "function(){...}" when it is defined.');
    }

    this.init(theElement);
   };

   // create a new prototype
   var _proto = $.fn.typeIt.typeItClass.prototype;

   // initialize the plugin
   _proto.init = function(theElement){

     this.stringArray = this.settings.whatToType;
     // check if the value is an array or just a string
     if(Object.prototype.toString.call(this.stringArray) !== '[object Array]'){
       // since it's not already an array, turn it into one, since later functionality depends on it being one
       this.stringArray = '["' + this.stringArray + '"]';
       this.stringArray = JSON.parse(this.stringArray);
     }
     this.mergedStrings = this.stringArray.join('');
     this.stringLengths = {};
     this.phraseLength = this.stringLengths[this.stringCount];

     // get the string lengths and save to array, set up ti-containers for each string
     for(j=0; j < this.stringArray.length; j++){
        this.stringLengths[j] = this.stringArray[j].length;
        // set up the number of ti-containers we'll need to hold the strings
        theElement.append('<span class="ti-container"><span class="ti-text-container ti-cursor"></span></span>');
     }

      // add .active-container to the first .ti-text-container so the cursor starts blinking before a string is printed
      theElement.find('.ti-container:first-child').find('.ti-text-container').addClass('active-container');

     // if breakLines is false, then we for sure only need ONE ti-container even if there multiple strings, so make sure of that
     if(this.settings.breakLines === false) {
        theElement.find('.ti-container').remove();
        theElement.append('<span class="ti-container"><span class="ti-text-container ti-cursor"></span></span>');
     }

     // if showCursor is false, then remove the ti-cursor class
     if(this.settings.showCursor === false) {
      $(this.theElement).find('.ti-text-container').removeClass('ti-cursor');
     }

      // start to type the string(s)
      setTimeout(function() {
        this.typeLoop();
      }.bind(this), this.settings.delayStart);

   };

   _proto.typeLoop = function(){

    // set the length of the current phrase being typed
    this.phraseLength = this.stringLengths[this.stringCount];

     // make it human-like if specified in the settings
    if(this.settings.lifeLike === true){
      this.delayTime = this.settings.typeSpeed*Math.random();
    } else {
      this.delayTime = this.settings.typeSpeed;
    }

    this.typeTimeout = setTimeout(function () {

      // append the string of letters to the respective .ti-text-container
      var characterToAppend = this.mergedStrings[this.typeCount+this.stringPlaceCount];

      // if breakLines is set to true, add the 'active-container' class to the next .ti-text-container in the list.
      if(this.settings.breakLines === true) {
        $(this.theElement).find('.ti-text-container:eq('+ this.stringCount +')').addClass('active-container').append(characterToAppend);
      } else {
        $(this.theElement).find('.ti-text-container').addClass('active-container').append(characterToAppend);
      }

      this.typeCount++;
      // if there are still characters to be typed, call the same function again
      if (this.typeCount < this.phraseLength) {
        this.typeLoop(this.stringLengths[this.stringCount]);
        // if there are no more characters to print and there is more than one string to be typed, delete the string just printed
      } else if(this.stringArray.length > 1) {
        // update the this.stringPlaceCount so that we're appending starting at the correct spot in the merged string
        this.stringPlaceCount = this.stringPlaceCount + this.phraseLength;
        // reset this.typeCount in case this function needs to be reused
        this.typeCount = 0;

          // if the stringCount is the same as the number of strings we started with, we're done, so call the callback function
        if(this.stringCount+1 === this.stringArray.length) {
          this.callback();
          // if we're not on the last string, then move on to to delete, unless the user wants to break lines
        } else if((this.stringCount+1 < this.stringArray.length) && this.settings.breakLines === false){

          setTimeout(function(){
            this.deleteLoop();
          }.bind(this), this.settings.breakWait);

        // if breakLines is true and we still have strings left to type, break it and continue
        } else if (this.stringCount+1 < this.stringArray.length && this.settings.breakLines === true){
          this.stringCount++;

          setTimeout(function(){

            // remove any 'active-container' classes fromt the elements
            $(this.theElement).find('.ti-text-container').removeClass('active-container');

            // give 'active-container' class to next container, so the cursor can start blinking
            $(this.theElement).find('.ti-text-container:eq('+ this.stringCount +')').addClass('active-container');

            // after another slight delay, continue typing the next string
            setTimeout(function(){
              this.typeLoop();
            }.bind(this), this.settings.breakWait);

          }.bind(this), this.settings.breakWait);

        }

        // since there are no more strings to be typed, we're done and can call the callback function
      } else {
        this.callback();
      }
    }.bind(this), this.delayTime);

   };

   _proto.deleteLoop = function() {

    this.deleteTimeout = setTimeout(function () {

      // get the string from the element and cut it by one character at the end
      shortenedText = $(this.theElement).find('.ti-text-container').text().substring(0, $(this.theElement).find('.ti-text-container').text().length - 1);

      // then, put that shortened text into the element so it looks like it's being deleted
      $(this.theElement).find('.ti-text-container').text(shortenedText);

       this.deleteCount++;
        // if there are still characters in the string, run the function again
       if (this.deleteCount < this.phraseLength) {
         this.deleteLoop();
        // if there are still strings in the array, go back to typing.
       } else if(this.stringArray[this.stringCount+1] !== undefined){
         this.deleteCount = 0;
         this.stringCount++;
         this.typeLoop();
       }
       // make backspacing much quicker by dividing delayTime (arbitrarily) by three
     }.bind(this), this.delayTime/3);
   };

  // stop the plugin from typing or deleting stuff whenever it's called
   _proto.stopTyping = function() {
      clearTimeout(this.typeTimeout);
      clearTimeout(this.deleteTimeout);
   };

 }(jQuery));
