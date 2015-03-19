/*********************************************************
* ****************************************************** *
* *                                                    * *
* *  jQuery RoughDraft.js Plugin                       * *
* *  Version 0.1.3                                     * *
* *                                                    * *
* *  Copyright Nick Dreckshage, licensed GPL & MIT     * *
* *  https://github.com/ndreckshage/roughdraft.js      * *
* *                                                    * *
* ****************************************************** *
*********************************************************/

// semi-colon as safety net against concatenated scripts that are improperly closed
;(function($,window,document,undefined){

  // undefined to protect against undefined, mutatable global in ECMAScript 3
  // window and document as local variables to quicken resolution

  /************************************************
  * ********************************************* *
  * *                                           * *
  * *  CONSTRUCTOR                              * *
  * *                                           * *
  * ********************************************* *
  ************************************************/
  
  $.RedPen = function(options) {

    // called first to create markup
    this._create(options)

    // then build default functionality
    this._init();
  }

  /************************************************
  * ********************************************* *
  * *                                           * *
  * *  DEFAULT SETTINGS                         * *
  * *                                           * *
  * ********************************************* *
  ************************************************/

  /**
   *
   *  -- these can/should be overwritten when calling plugin
   *
   *  EXAMPLE OF HOW WIDGET CAN BE CALLED WITH OPTIONS
   *
   *  $(window).roughDraft({
   *    'author' : 'baconipsum',
   *    'illustrator' : 'placehold',
   *  });
   *
   */

  $.RedPen.settings = {
    // the site to generate lorem ipsum from, for both jsonp + custom options
    author      : 'bacon',
    // the site to generate placeholder images from
    illustrator : 'placehold',
    // array ['000', 'fff', 'eaeaea'] of colors the images should be in (will only work for image generators that allow colors)
    paintColor  : [],
    // true if customIpsum library is preferred over jsonp api libraries
    customIpsum : false,
    // set timeout for JSONP requests
    timeout: 5000,
    // if customIpsum is true, relative url of library is necessary
    customIpsumPath: '/roughdraft.thesaurus.json',
    // calendar data formatting (default using PHP formatting)
    calendar: {
      dayNumber        : 'j',
      dayNumberZeros   : 'd',
      dayText          : 'l',
      dayTextThree     : 'D',
      monthNumber      : 'n',
      monthNumberZeros : 'm',
      monthText        : 'F',
      monthTextThree   : 'M',
      yearNumber       : 'Y',
      yearNumberTwo    : 'y'
    },
    ajaxType: 'GET'
  }

  /************************************************
  * ********************************************* *
  * *                                           * *
  * *  FULL SCOPE VARIABLES                     * *
  * *                                           * *
  * ********************************************* *
  ************************************************/

  $.RedPen.scopeVar = {
    dataTag       : 'data-',
    paragraphType : 'p',
    sentenceType  : 's',
    wordType      : 'w',
    currencyType  : '$',
    inputSplit    : '/',
    rangeSplit    : '-'
  }

  /***********************************************
  * ******************************************** *
  * *                                          * *
  * *  PROTOTYPE                               * *
  * *                                          * *
  * ******************************************** *
  ***********************************************/

  $.RedPen.prototype = {


    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  CORE METHODS                            * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _create method
      *
      *  -- builds markup and sets up the plugin
      *
      *  @param options -- object -- configurations options passed in by constructor
      *
    **********************************************/
    _create: function(options) {
      var $draftRepeat = $('[data-draft-repeat]');

      // to see an outline of everything, run 'new $.RedPen' in your chrome devtools console

      // extends the options to allow them to be overwritten in other files
      this.options = $.extend(true, {}, $.RedPen.settings, options);

      // sets up the full scope variables
      this.scopeVar = $.RedPen.scopeVar;

      /**
       * set up custom expression so we can filter data-draft-repeat
       * and return parent matches only
       */
      $.extend($.expr[':'], {
        parentsFirst: function(a,i,m){
          return $(a).parents(m[3]).length < 1;
        }
      });

      // data-draft-repeat will act as a loop for the div and inner html/js events
      // buils the markup, necessary to call this first, and repeat all necessary divs, prior to using other methods
      if ($draftRepeat.length) {
        this.scanner($draftRepeat);
      }
    },

    /**********************************************
      *
      *  _init method
      *
      *  -- builds default functionality following create
      *
    **********************************************/
    _init : function() {
      var $draftText = $('[data-draft-text]'),
          $draftImage = $('[data-draft-image]'),
          $draftDate = $('[data-draft-date]'),
          $draftNumber = $('[data-draft-number]'),
          $draftUser = $('[data-draft-user]');

      // data-draft-text taps into lorem ipsum library in roughdraft.thesaurus.json
      if ($draftText.length) {
        this.bookClub();
      }
      // data-draft-image taps into placeholder image library
      if ($draftImage.length) {
        this.doodler($draftImage);
      }
      // data-draft-date generates current/random date in various formats
      if ($draftDate.length) {
        this.scheduler($draftDate);
      }
      // data-draft-number generates random numbers
      if ($draftNumber.length) {
        this.lottery($draftNumber);
      }
      // data-draft-name generates a random name
      if ($draftUser.length) {
        this.socialNetwork($draftUser);
      }

    },

    /**********************************************
      *
      *  scanner method
      *
      *  -- handles instances of data-draft-repeat. duplicates and appends them in dom.
      *  -- mimics server side loops/html duplication
      *  -- called by data-draft-repeat="3" etc
      *
      *  @param draftRepeat -- object -- data selector passed in through _create
      *
    **********************************************/
    scanner: function($draftRepeat) {
      var $self,
          $draftRepeatTree,
          draftRepeatBare = 'draft-repeat',
          repeatCount,
          failSafe = 0;

      /**
       * to repeat the elements in fully recursive way, use a custom selector to grab all top level
       * repeats first, and then traverse down the tree, repeating their children nodes
       *
       * for example --
       * <div data-draft-repeat="3">
       *   <span data-draft-repeat="2">
       * </div>
       */

      // set the tree to the top level elements that we want to repeat
      $draftRepeatTree = $draftRepeat.filter(':parentsFirst([data-draft-repeat])');

      /**
       * repeat the outer elements first, then remove their properties
       * then the children nodes will be set as the new top tree
       */
      while ($draftRepeatTree.length > 0) {
        $self = $($draftRepeatTree[0]);
        repeatCount = $self.data(draftRepeatBare);

        /**
         * remove the data-draft-repeat-tags from the dom
         * NOTE -- this is now important to avoid infinte loops
         */
        $self.removeAttr(this.scopeVar.dataTag + draftRepeatBare);

        /**
         * loop through the count of requested repeats
         * -1 on the repeat count because the initial instance of the node still exists
         */
        for (var x = 0; x < repeatCount - 1; x++) {
          // clone true true (with all deep data + events) to maintain node's JS, and insert into dom
          $self.clone(true, true).insertAfter($self);
        }

        // reset the variables with the data-repeat tags removed, and repeat loop until 0 instances
        $draftRepeat = $('[data-draft-repeat]');
        $draftRepeatTree = $draftRepeat.filter(':parentsFirst([data-draft-repeat])');

        /**
         * this is less than ideal, and shouldn't be hit.
         * only hit if $self.removeAttr(this.scopeVar.dataTag + draftRepeatBare) not hit
         * + $draftRepeat/$draftRepeatTree do no update on each pass
         */
        if (failSafe >= 1000) {
          console.log('There was an infinite loop error. Please check the loop if you are editing it, or report the' +
            ' error here -- https://github.com/ndreckshage/roughdraft.js/issues/new');
          break;
        }
        failSafe++;
      }
    },

    /**********************************************
      *
      *  bookClub method
      *
      *  -- handles instances of data-draft-text and inserts as text into calling node
      *  -- words/sentences/paragraphs can be called by data-draft-text="3p" etc
      *  -- this uses lorem ipsum apis or json through local library
      *  -- because of remote api, this is the only method which sends data down to be handled
      *  -- rather than calling functions to return within the top level method
      *
    **********************************************/
    bookClub: function() {
      var opt = this.options,
          gps = new Array(),
          type = 'json',
          url;

      /**
       * switch on the author to attribute the correct api url
       * set url to false if author name entered incorrectly/doesnt exist
       * NOTE - bacon ipsum set as default
       */
      switch (opt.author) {
        case 'lorem':
          url = 'http://www.randomtext.me/api/lorem/p-20/40-50';
          gps = ['_fixJSON','_fixParagraphs'];
          break;
        case 'bacon':
          url = 'https://baconipsum.com/api/?type=all-meat&paras=20&start-with-lorem=1';
          type = 'jsonp';
          gps = ['_fixParagraphs'];
          break;
        case 'hipster':
          url = 'http://hipsterjesus.com/api?paras=20&type=hipster-centric&html=false';
          gps = ['_fixJSON','_fixParagraphs'];
          break;
        default:
          url = 'https://baconipsum.com/api/?type=all-meat&paras=20&start-with-lorem=1';
          type = 'jsonp';
          gps = ['_fixParagraphs'];
          break;
      }

      /**
       *  determine whether the local lorem ipsum library, or jsonp
       *  send local library to bookstore method ('owning ipsum')
       *  and jsonp to library method ('borrowing ipsum')
       *
       *  BUILT IN CUSTOM LIBRARY (with author permission)
       *  + 'lorem'
       *  + 'tunaipsum.com'
       *  + 'robotipsum.com'
       *  + 'lorizzle.nl'
       */
      if (opt.customIpsum === true) {
        // call the custom library/bookstore method
        this._bookStore();
      } else if (url && type && gps) {
        // send the data to the library method to get json data
        this._library(url, type, gps);
      } else {
        console.log('Please ensure that you have specified a correct remote (JSONP) / local' +
          ' (thesaurus.roughdraft.json) library, and have correctly set the "customIpsum" option.')
      }
    },

    /**********************************************
      *
      *  doodler method
      *
      *  -- handles instances of data-draft-image and inserts image into calling node
      *  -- taps into 'lorem ipsum' image galleries
      *  -- images with width/height can be called by data-draft-image="500/1000" for a 500px wide by 1000px high image
      *
      *  @param draftImage -- object -- data selector passed in through _init
      *
    **********************************************/
    doodler: function($draftImage) {
      var $self,
          draftImageBare = 'draft-image',
          imageData,
          imageWidth,
          imageHeight,
          imageLink;

      // this will loop through all dom elements that use the data-draft-image tag
      for (var i = 0; i < $draftImage.length; i++) {

        // set self to the current dom node being repeated
        $self = $($draftImage[i]);
        // access the value (ex. data-draft-image="300/500")
        imageData = $self.data(draftImageBare);

        // check that the value is in the correct format
        if (typeof imageData === 'string') {

          // split the image dimensions on the backslash making array ['300','500']
          imageData = imageData.split('/');
          // set the width to the first index and convert to number
          imageWidth = parseInt(imageData[0]);
          // set the height to the 2nd index and convert
          imageHeight = parseInt(imageData[1]);

          // if either index is not a number, something went wrong, and set both vars to false
          if (isNaN(imageWidth) || isNaN(imageHeight)) {
            imageWidth = false;
            imageHeight = false;
          }
        
          // if all went well, sent the image to the _photoAlbum method to return an image
          if (imageWidth && imageHeight) {

            // pass in the width and height and it will return a link
            imageLink = this._photoAlbum(imageWidth, imageHeight);
            // set the link to the img src attribute, hard code the width + height, and remove the data-draft-image tag
            $self.attr('src', imageLink)
                 .attr('width', imageWidth)
                 .attr('height', imageHeight)
                 .removeAttr(this.scopeVar.dataTag + draftImageBare);
          } else{
            // if imageWidth/imageHeight are false, log an error to the console
            console.log("Please ensure that you specify Width/Height in the format 250/300 for 250px wide by 300px tall");
          }
        }
      }
    },

    /**********************************************
      *
      *  scheduler method
      *
      *  -- handles instances of data-draft-date and inserts text into calling node
      *  -- uses js date engine + some randomization if requested
      *  -- currently using PHP date structure which can be changed on user preference in plugin options
      *  -- dates can be called with data-draft-date="M/j/Y" for Jan 23 2013 or "l-r/n-r/y-r" etc for random date (in 23 1 13 format)
      *  -- returned dates are currently separated with spaces
      *
      *  @param draftDate -- object -- data selector passed in through _init
      *
    **********************************************/
    scheduler: function($draftDate) {
      var $self,
          draftDateBare = 'draft-date',
          dateData,
          dateRequest,
          formatDate = new String();

      // this will loop through all dom elements that use the data-draft-date tag
      for (var i = 0; i < $draftDate.length; i++){

        // set self to the current dom node being repeated
        $self = $($draftDate[i]);
        // access the value (ex. data-draft-date="M")
        dateData = $self.data(draftDateBare);

        // check that the data is interpreted as string
        if (typeof dateData === 'string') {

          // split the dates on the backslash making array ['D','M-r','Y']
          dateData = dateData.split('/');
          // count the indexes
          dateDataLength = dateData.length;

          // loop on the indexes, sending each one to the datePicker method
          // before loop, reset date to empty string
          formatDate = '';
          for (var x = 0; x < dateData.length; x++) {

            // the method will return a string of the specific date index, build this into full string
            formatDate += this._datePicker(dateData[x]);
            // unless it is the last index, follow the date with a space
            x != dateData.length - 1 ? formatDate += ' ' : '';
          }

          // remove the plugin instructions and set the text of the calling node equal to the fully formatted date
          $self.removeAttr(this.scopeVar.dataTag + draftDateBare);
          $self.text(formatDate);
        }
      }
    },

    /**********************************************
      *
      *  lottery method
      *
      *  -- handles instances of data-draft-number and inserts as number into calling node
      *  -- numbers can be formatted by data-draft-number="$/2-3/0" (ex: Format as money, range of two to three digits, no decimal: $26 or $113)
      *  -- format (separated by '/'): 
      *  ---- optional. if first char is '$', dollar sign will be appended
      *  ---- required. include either a range of total digits or a single digit length: "2-3" will return a number of either 2 or 3 digits in length. "4" will return a 4-digit number.
      *  ---- optional. include the number of decimal places to include. single number: "2-3/4" will return a 2 or 3 digit number with 4 decimal places
      *
      *  @param $draftNumber -- object -- data selector passed in through _init
      *
    **********************************************/
    lottery: function($draftNumber) {
      var $self,
          draftNumberBare = 'draft-number',
          numberData,
          formatNumber = new String(),
          naturalNumDigits,
          naturalNumRange,
          decimalNumRange;

      // this will loop through all dom elements that use the data-draft-number tag
      for (var i = 0; i < $draftNumber.length; i++) {

        // set self to the current dom node setting number for
        $self = $($draftNumber[i]);
        // access the value (ex. data-draft-number="$/2-3/4")
        numberData = $self.data(draftNumberBare);

        // send the raw data to the parse number format method to return usable object
        numberData = this._parseNumberFormat(numberData);

        // reset format number string for every loop pass
        formatNumber = '';

        /**
         * begin formatting the formatNumber string based on the numberData object
         * if isCurrency is true, prepend number with dollar sign
         */
        numberData.isCurrency && (formatNumber += '$');

        /**
         * if user specifies random range (2-4), send the min/max digits to be randomized
         * this will ensure that (for example) a 2 digit, 3 digit and 4 digit will be equally weighted
         * rather than a 4 digit number being returned with much higher weight. more likely to be use case intent
         */
        naturalNumDigits = this._randomizer(numberData.digitMin, numberData.digitMax);
        // send resulting number digit to rangefinder to return min/max object
        naturalNumRange = this._rangeFinder(naturalNumDigits);
        // the decimal numbers are specified, so skip the digit step, and sent to rangefinder
        decimalNumRange = this._rangeFinder(numberData.decimalNumber);

        /**
         * add to the string with the resulting data from randomizer/rangefinder
         * only include decimal if applicable
         */
        formatNumber += this._randomizer(naturalNumRange.min, naturalNumRange.max);
        numberData.decimalNumber && (formatNumber += '.' + this._randomizer(decimalNumRange.min, decimalNumRange.max));

        // add the formatted numbers to the dom and clean up the plugin tags
        $self.removeAttr(this.scopeVar.dataTag + draftNumberBare);
        $self.text(formatNumber);
      } 
    },

    /**********************************************
      *
      *  socialNetwork method
      *
      *  -- handles instances of data-draft-user
      *  -- makes single request to roughdraftjs.com API
      *  -- different user data can be requested in format of data-draft-user="full"
      *  -- full, first, last, email, username, twitter, phone, address, city, state, zip, country
      *
      *  @param $draftUser -- object -- data selector passed in through _init
      *
    **********************************************/
    socialNetwork: function($draftUser) {
      var self = this,
          opt = this.options;

      /**
       * make jsonp ajax call to roughdraftjs.com api
       * grab 25 records per request
       * uses a php port of 'Faker', to generate random content
       */
      $.ajax({
        url: 'http://www.roughdraftjs.com/api/?number=25',
        dataType: 'jsonp',
        type: opt.ajaxType,
        timeout: opt.timeout,
        // if the call was successful, send the data to method to format
        success: function(data) {
          self._johnDoe(data, $draftUser);
        },
        error: function() {
          console.log('There was an error reaching the JSONP API. Please reload as API is hosted in cloud (PAAS). If issue is persistent, please report on Github');
        }
      });
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  BOOKCLUB PRIVATE METHODS                * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _library method
      *
      *  -- request to the url to return the api's json/jsonp
      *  -- initiates the chain of methods by passing the json data through the success function
      *
      *  @param url  -- string -- of the selected api
      *  @param type -- string -- type of data request
      *  @param gps  -- array  -- of the path the data needs to follow for formatting
      *
    **********************************************/
    _library: function(url, type, gps) {
      var self = this,
          opt = this.options;

      $.ajax({
        url: url,
        dataType: type,
        type: opt.ajaxType,
        timeout: opt.timeout,
        // if the call was successful, send the data to method to format
        success: function(data) {
          if (gps.length > 0) {
            self._deweyDecimal(data, gps);
          } else {
            self._speedReader(data);
          }
        },
        error: function() {
          console.log('There was an error reaching the lorem ipsum JSON API. Please confirm the link, or try' +
            ' a different service if they are down.');
        }
      });
    },

    /**********************************************
      *
      *  _bookStore method
      *
      *  -- makes the ajax json call to local custom lorem ipsum library
      *
    **********************************************/
    _bookStore: function() {
      var opt = this.options,
          self = this;

      /**
       * make the ajax call based on the default/user option url
       * async off since that conflicts with page load
       */
      $.ajax({
        url: opt.customIpsumPath,
        dataType: 'json',
        async: false,
        type: opt.ajaxType,
        success: function(data) {
          // send to the speed reader method if ajax returned correctly + author library exists
          if (data[opt.author]) {
            self._speedReader(data[opt.author]);
          } else {
            console.log('Please ensure the requested author is in your custom library and is spelled + formatted correctly.');
          }
        },
        error: function() {
          console.log('The ajax requested could not be completed. Ensure the relative path to your custom library is accurate.');
        }
      });
    },

    /**********************************************
      *
      *  _deweyDecimal method
      *
      *  -- handles where to send the data to be organized correctly
      *
      *  @param data -- object -- of the returned api
      *  @param gps  -- array  -- of the path the data needs to follow for formatting
      *
    **********************************************/
    _deweyDecimal: function(data, gps) {
      var turnAt = (gps.splice(0,1))[0];
      // send to the first index, and send the remaining chain with it
      if (turnAt == '_fixJSON') {
        this._fixJSON(data, gps);
      } else if (turnAt == '_fixParagraphs') {
        this._fixParagraphs(data, gps);
      }
    },

    _fixJSON: function(data, gps) {
      var opt = this.options,
          wrappedPTags = false,
          method;

      // clean up various json styles to match our format
      switch(opt.author) {
        case 'lorem':
          data = data.text_out;
          wrappedPTags = true;
          break;
        case 'hipster':
          data = data.text;
        default:
          break;
      }

      /**
       * stringify so we can get rid of line feed + carriage return characters
       * this took me a while to figure out...charCodeAt returned 13 for enter key
       * and couldnt detect it with "\n" or "\r"...
       */
      data = JSON.stringify(data);
      data = this._replaceWith(data, "\\r", "<BREAK>");
      data = this._replaceWith(data, "\\n", "<BREAK>");

      // split on the P tags
      if (wrappedPTags) {
        // opted for this dual approach rather than regex
        data = this._replaceWith(data,"<p>","");
        data = this._replaceWith(data,"</p>","");
      }

      // convert back to string
      data = JSON.parse(data);

      // split on the line breaks and remove any empty index to create actual list of paragraphs
      data = data.split("<BREAK>");
      data = this._removeEmptyIndexes(data);

      // send back to format more or send to get the data processed
      if (gps.length > 0) {
        this._deweyDecimal(data, gps);
      } else {
        this._speedReader(data);
      }
    },

    /**********************************************
      *
      *  _fixParagraphs method
      *
      *  -- formats jsonp api data into paragraphs that we can work with
      *  -- sends to the next method down the chain
      *
      *  @param data -- object -- of jsonp data from callback
      *
    **********************************************/
    _fixParagraphs: function(data, gps) {
      var self = this,
          paragraphsArray = new Array(),
          paragraphArray,
          paragraph;

      for (var i = 0; i < data.length; i++) {
        // set paragraph to the data index
        paragraph = data[i];
        // call function to take out ellipses so they don't conflict
        paragraph = this._replaceWith(paragraph,"...","<ELLIPSES>");
        // split returned string on periods to create array
        paragraph = paragraph.split('.')
        // take out empty indexes
        paragraph = this._removeEmptyIndexes(paragraph);

        // reformat the sentences for each in paragraph
        paragraphArray = new Array();
        $.each(paragraph, function(key, value) {
          // put ellipses back in
          value = self._replaceWith(value,"<ELLIPSES>","...");
          // add ending period
          value = value + ".";
          // kill leading/trailing spaces
          value = value.replace(/(^\s+|\s+$)/g, '');
          // and add into array
          paragraphArray.push(value);
        });
        
        // add the paragraph to array of paragraphs
        paragraphsArray.push(paragraphArray);
      }

      // set data back to paragraphsArray for readability
      data = paragraphsArray;

      // send back to format more or send to get the data processed
      if (gps.length > 0) {
        this._deweyDecimal(data, gps);
      } else {
        this._speedReader(data);
      }
    },

    /**********************************************
      *
      *  _speedReader method
      *
      *  -- reconnects the jsonp + custom/local json libraries
      *  -- determines what to do with each instance of data-draft-text in dom
      *  -- sends to next method down the chain
      *
      *  @param data -- object -- of the json/jsonp data (full array of all paragraphs)
      *
    **********************************************/
    _speedReader: function(data) {
      var $self,
          $draftText = $('[data-draft-text]'),
          draftTextBare = 'draft-text',
          scope = this.scopeVar,
          textData,
          textCount,
          textType;

      // this will loop through all dom elements that use the data-draft-text tag
      for (var i = 0; i < $draftText.length; i++) {
        
        // set self to the current dom node being repeated
        $self = $($draftText[i]);
        // access the value (ex. data-draft-text="4s")
        textData = $self.data(draftTextBare);

        // ensure that the value is correctly returned as string
        if (typeof textData === 'string') {

          // split the string at the backslash creating an array ['5','p']
          textData = textData.split('/');
          // take index 0 and convert it into a number. this is the number requested
          textCount = parseInt(textData[0]);
          // take index 1 and set it to var that will be the type of text requested (word/sentence/paragraphs)
          textType = textData[1].toLowerCase();

          // if either index is bad, set both vars to false
          if (isNaN(textCount) || typeof textType !== 'string') {
            textCount = false;
            textType = false;
          }

          // if both indexes are good, then grab the text
          if (textCount && textType) {

            // remove the data tags from the dom
            $self.removeAttr(scope.dataTag + draftTextBare);
            // call the method to get lorem ipsum info, passing in the textcount and type
            this._inceptionLevelOne($self, data, textCount, textType);
          } else {
            // if something went wrong, log the error
            console.log("Please ensure that you specify Paragraph/Sentence/Word in the format 3/S, for 3 sentences");
          }
        }
      }
    },

    /**********************************************
      *
      *  _inceptionLevelOne method
      *
      *  -- handles the data on the paragraph level
      *  -- outputs paragraph calls to the dom
      *  -- send sentence/words calls to the next method down the chain
      *
      *  @param $self     -- object -- current jquery object of requesting node
      *  @param data      -- object -- of the properly formatted paragraphs
      *  @param textCount -- number -- of paragraphs/sentences/words to return
      *  @param textType  -- string -- whether to return paragraphs/sentences/words
      *
    **********************************************/
    _inceptionLevelOne: function($self, data, textCount, textType) {
      var totalParagraphs = data.length,
          combinedParagraphs = new Array(),
          returnParagraph = new Array(),
          lineBreak = new String(),
          scope = this.scopeVar,
          randomParagraphIndex,
          currentParagraph,
          lastSentence;

      /**
       * this method is called by all text types
       * if paragraphs are requested, several may need to be returned
       * if not called by a paragraph type, only 1 paragraphy needs to be returned
       */
      if (textType == scope.paragraphType) {

        // return a new random paragraph while the text count is > 0
        while (textCount > 0) {
          
          // randomize the paragraph index based on total paragraphs left
          randomParagraphIndex = this._randomizer(totalParagraphs);
          // pick a paragraph from the array
          currentParagraph = data[randomParagraphIndex];

          // add line breaks except for final paragraph
          if (textCount > 1) {
            // add line break to split the paragraphs
            lineBreak = '<br/><br/>';
          } else {
            lineBreak = '';
          }

          // join the paragraph sentences
          currentParagraph = currentParagraph.join(' ') + lineBreak;
          // concatenate the current paragraph to the total list within the while loop
          returnParagraph = returnParagraph.concat(currentParagraph);
          // and decrease the text count for the requested number of paragraphs
          textCount--;
        }

        // join the random together from array
        returnParagraph = returnParagraph.join('');
        // and insert into dom (use html instead of text for paragraphs to preserve line breaks)
        $self.html(returnParagraph);

      } else {
        
        // loop through the paragraphs, and combine them into a 1st level array
        for (i = 0; i < totalParagraphs; i++) {
          currentParagraph = data[i];
          combinedParagraphs = combinedParagraphs.concat(currentParagraph);
        }

        // go a level deeper into sentences + words
        this._inceptionLevelTwo($self, combinedParagraphs, textCount, textType);
      }
    },

    /**********************************************
      *
      *  _inceptionLevelTwo method
      *
      *  -- handles the data on the sentence/word level
      *  -- outputs the resulting data to the dom
      *
      *  @param $self     -- object -- current jquery object of requesting node
      *  @param data      -- object -- of the properly formatted sentences (complete array, regardless of paragraph)
      *  @param textCount -- number -- of sentences/words to return
      *  @param textType  -- string -- whether to return sentences/words
      *
    **********************************************/
    _inceptionLevelTwo: function($self, data, textCount, textType) {
      var scope = this.scopeVar,
          dataLength = data.length,
          randomIndex = this._randomizer(dataLength);

      /**
       * set up the data context (all sentences for paragraphs, and all words of random paragraph for words)
       * and send to the same function to loop through the data
       * to be returned to the dom
       */
      if (textType == scope.sentenceType) {
        var returnSentences;

        // call function to turn the data (array of all sentences) into the requested number of sentences
        returnSentences = this._inceptionLevelTwoKick(textCount, data, randomIndex);
        // insert the sentences into the dom
        $self.text(returnSentences);
      } else if (textType = scope.wordType) {
        var currentSentence = data[randomIndex].split(' '),
            index = 0,
            returnWords;

        // turn the data (array of words from random paragraph) into requested number of words
        returnWords = this._inceptionLevelTwoKick(textCount, currentSentence, index);
        // insert words into the dom
        $self.text(returnWords);
      }
    },

    /**********************************************
      *
      *  _inceptionLevelTwoKick method
      *
      *  -- handles the while loop for sentences/words to format string
      *
      *  @param textCount -- number -- of sentences/words to return
      *  @param data      -- object -- of the properly formatted sentences (complete array, regardless of paragraph)
      *  @param index     -- number -- of where in the array to begin formatting string from
      *
      *  @return context  -- string -- combined sentences/words to end up in dom
      *
    **********************************************/
    _inceptionLevelTwoKick: function(textCount, data, index) {
      var initialTextCount = textCount,
          dataLength = data.length,
          currentContext = new String,
          context = new String();

      /**
       * loop through the total requested sentences/words, and
       * form them into complete string
       */
      while (textCount > 0) {

        // except for the first word/sentence, increase index to set to following
        if (textCount != initialTextCount) {
          index++;
          // reset to 0 if we eclipse length of array
          if (index >= dataLength) {
            index = 0;
          }
        }
        
        // set the current word/sentence based on the index
        currentContext = data[index];
        // except for last in set, add a space to the string
        if(textCount < dataLength) {
          currentContext += ' ';
        }

        // add the current word/sentence to the total group from loop and decrease count
        context += currentContext;
        textCount--;
      }

      // kick the string of words/sentences back
      return context;
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  DOODLER PRIVATE METHODS                 * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _photoAlbum method
      *
      *  -- handles the logic of where to get the placehold images from
      *
      *  @param width -- number -- of the requested width
      *  @param height -- number -- of the requested height
      *
      *  @return imageLink -- string -- of the formatted placeholder image link
      *
    **********************************************/
    _photoAlbum: function(width, height) {
      var photoAlbum = false,
          illustrator = this.options.illustrator,
          placeHold = 'placehold',
          placeKitten = 'placekitten',
          placeDog = 'placedog',
          baconMockup = 'baconmockup',
          waterColor,
          imageLink;

      // if the request (from options), does not match a gallery, return placehold.it default
      switch (illustrator) {
        case placeHold:                     break;
        case placeKitten:                   break;
        case placeDog:                      break;
        case baconMockup:                   break;
        default:  illustrator = placeHold;  break;
      }

      // call the watercolor method to add color and pass the library to it
      waterColor = this._waterColor(illustrator);

      // format the links based on the image gallery with the color/random option, height and width
      if (illustrator == placeKitten) {
        imageLink = 'http://placekitten.com/' + waterColor + width + '/' + height;
      } else if (illustrator == placeDog) {
        imageLink = 'http://placedog.com/' + waterColor + width + '/' + height;        
      } else if (illustrator == baconMockup) {
        imageLink = 'http://baconmockup.com/' + width + '/' + height;
      } else {
        imageLink = 'http://placehold.it/' + width + 'x' + height + waterColor;
      }

      // return string of the resulting image url
      return imageLink;
    },

    /**********************************************
      *
      *  _waterColor method
      *
      *  -- handles the colors/other options the image providers offer
      *
      *  @param illustrator -- string -- of the user option for image gallery
      *
      *  @return waterColor -- string -- of the image variance
      *
    **********************************************/
    _waterColor: function(illustrator) {
      var opt = this.options,
          paint = new Array(),
          placeKitten = 'placekitten',
          placeDog = 'placedog',
          waterColor;

      /**
       * placekitten only offers regular and greyscale. set regular colors to false
       * color palette only for placehold.it
       * if user supplies color options, use that, else set default
       */
      if (illustrator == placeKitten || illustrator == placeDog) {
        paint = [false, 'g'];
      } else {
        paint = opt.paintColor.length ? opt.paintColor : ['453f35','e7cead','b5ab94','eba434','64886c','b15c3a','b1956c'];
      }

      // determine the length of the color options array
      waterColor = paint.length;
      // get a random number from the randomizer
      waterColor = this._randomizer(waterColor);
      // set that to the color index
      waterColor = paint[waterColor];

      // check if water color option is chosen (could be false for placekitten)
      // and format the color links
      if (waterColor) {
        if (illustrator == placeKitten || illustrator == placeDog) {
          waterColor = waterColor + '/';
        } else {
          waterColor = '/' + waterColor + '/fff';
        }
      } else {
        // else return a blank string for color
        waterColor = '';
      }

      // return the color option to be included in the url
      return waterColor;
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  SCHEDULER PRIVATE METHODS               * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _datePicker method
      *
      *  -- handles the date logic of how to format
      *
      *  @param dateRequest -- string -- of the date type requested
      *
      *  @return engineDate -- string -- of the formatted date
      *
    **********************************************/
    _datePicker: function(dateRequest) {
      var cal = this.options.calendar,
          engineDate = new Date(),
          randomDate = false;

      // sets up the randomization if requested
      // does not handle regular date requests (ex. "M")
      if (dateRequest.split('-').length > 1) {
        
        // split on the dash
        dateRequest = dateRequest.split('-');
        
        // if the 2nd index is r, signifies randomization
        if (dateRequest[1].toLowerCase() == 'r') {
          // change the bool of whether to randomize to true
          randomDate = true;
        }

        // return the basic date request from the first index
        dateRequest = dateRequest[0];
      }

      // handles the day requests and returns based on format
      if (dateRequest == cal.dayNumberZeros || dateRequest == cal.dayTextThree || dateRequest == cal.dayNumber || dateRequest == cal.dayText) {
        // handles requests for day of week information
        if (dateRequest == cal.dayTextThree || dateRequest == cal.dayText || dateRequest == cal.dayTextThree) {
          
          // get the day from the browser
          engineDate = engineDate.getDay();

          // if randomization requested, send the week count to randomizer
          if (randomDate === true) {
            engineDate = this._randomizer(7);
          }

          // switch on the browser/randomized date to return a day of week
          switch (engineDate) {
            case 0: engineDate = 'Sunday';    break;
            case 1: engineDate = 'Monday';    break;
            case 2: engineDate = 'Tuesday';   break;
            case 3: engineDate = 'Wednesday'; break;
            case 4: engineDate = 'Thursday';  break;
            case 5: engineDate = 'Friday';    break;
            case 6: engineDate = 'Saturday';  break;
            default:                          break;
          }

          // if the 3 char text format requested ('Sun'), split the string
          if (dateRequest == cal.dayTextThree) {
            engineDate = engineDate.substr(0,3);
          }
        } else {

          // handles requests for day of month information

          // ex. jan "31"
          engineDate = engineDate.getDate();
          
          // randomize the month date if requested
          if (randomDate === true) {
            // for february...obviously this isnt a perfect system.
            engineDate = this._randomizer(28) + 1;
          }

          // if format requested is for leading 0, add it when less than 10 (and convert to string so its not cut out)
          if (dateRequest == cal.dayNumberZeros && engineDate < 10) {
            engineDate = '0' + engineDate.toString();
          }
        }
      } else if (dateRequest == cal.monthNumberZeros || dateRequest == cal.monthTextThree || dateRequest == cal.monthText || dateRequest == cal.monthNumber) {
        // handles requests for month information

        // set the date to the browser numeric month for all cases
        engineDate = engineDate.getMonth();

        // if randomization requested, override month and send months to randomizer
        if (randomDate === true) {
          engineDate = this._randomizer(12);
        }

        // handles requests for text formatted months
        if (dateRequest == cal.monthText || dateRequest == cal.monthTextThree) {

          // switch the month on the index
          switch (engineDate) {
            case 0:   engineDate = 'January';   break;
            case 1:   engineDate = 'February';  break;
            case 2:   engineDate = 'March';     break;
            case 3:   engineDate = 'April';     break;
            case 4:   engineDate = 'May';       break;
            case 5:   engineDate = 'June';      break;
            case 6:   engineDate = 'July';      break;
            case 7:   engineDate = 'August';    break;
            case 8:   engineDate = 'September'; break;
            case 9:   engineDate = 'October';   break;
            case 10:  engineDate = 'November';  break;
            case 11:  engineDate = 'December';  break;
            default:                            break;
          }

          // if the request is for shorthand month ('Jan'), split the string
          if (dateRequest == cal.monthTextThree) {
            engineDate = engineDate.substr(0,3);
          }
        } else if (dateRequest == cal.monthNumberZeros) {

          // if number formatting (leading zero) requested, convert to a string and add a zero
          engineDate = '0' + (engineDate + 1).toString();
        } else {

          // if number formatting (no leading zero), just account for the index
          engineDate += 1;
        }
      } else {
        // handles requests for year information

        // grab the year information from the browser
        engineDate = engineDate.getFullYear();

        // if randomization requested, override the browser
        if (randomDate === true) {

          // send 25 (for years) to the randomizer
          // this is definitely cheating, but keeps the dates year 2000-2025
          engineDate = this._randomizer(25);
          // if the resulting number is less than 10, convert to a string and prepend a string zero
          engineDate < 10 ? engineDate = '0' + engineDate.toString() : engineDate = engineDate.toString();
          // prepend 20 for to the date to return a reasonable date
          engineDate = '20' + engineDate;
        }

        // if the shorthand year is requested ("13"), split the string
        if (dateRequest == cal.yearNumberTwo) {
          engineDate = engineDate.toString().substr(2,3);
        }
      }

      // return all of the resulting dates to the scheduler
      return engineDate;
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  LOTTERY PRIVATE METHODS                 * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      * _parseNumberFormat method
      *
      * -- pulls out parts of formatting string 
      * -- returns object with user preferences
      * -- if user passes no preferences, returns default values
      *
      *  @param numberData -- string -- of the raw data parse
      *  
      *  @return numberData -- object -- of the formatted number data
      *
    **********************************************/
    _parseNumberFormat: function(numberData) {
      var scope = this.scopeVar,
          parts,
          digits,
          data = new Object();

      // convert single numbers to string
      numberData = numberData.toString();

      // check that the param can be parsed
      if (typeof numberData === 'string') {

        // split the data ($, natural numbers, decimals)
        parts = numberData.split(scope.inputSplit)
        
        // set up the object to return parsed data
        data = {
          // will return as true/false bool
          isCurrency: parts[0] === scope.currencyType,
          // define defaults
          digitMin: 1,
          digitMax: 1,
          decimalNumber: 0            
        };

        // get rid of dollar sign          
        if (data.isCurrency) {
          parts = parts.slice(1, 3);
        }
        
        //at this point, parts[0] will consist of something like 2-4 or 3
        digits = parts[0].split(scope.rangeSplit);

        /**
         * determine the min/max ranges
         * convert the string to a number format (with +)
         * if no max is supplied, just default to digit min
         * if it exists, parts[1] will be the number of decimals 
         */
        data.digitMin = +digits[0] > 0 ? +digits[0] : 1;
        data.digitMax = +digits[1] || data.digitMin;
        data.decimalNumber = parts[1] ? +parts[1] : 0;
      }

      // set back to numberData for readability and return the object to calling method
      numberData = data;
      return numberData; 
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  SOCIALNETWORK PRIVATE METHODS           * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _johnDoe method
      *  
      *  -- handles returning the jsonp randomized user data to the dom
      *
      *  @param data -- object -- user data from jsonp request
      *  @param $draftUser  -- object -- jquery object of calling dom nodes
      *
    **********************************************/
    _johnDoe: function(data, $draftUser) {
      var $self,
          draftUserBare = 'draft-user',
          dataCount,
          scope = this.scopeVar,
          userData,
          dataPick,
          userInfo;

      // caclulate number of records returned in jsonp call
      dataCount = data.length;

      /**
       * loop through the number of user info requests
       * insert the data type requested (full, first, last, email, username, twitter, phone, address, city, state, zip, country) into the dom
       */
      for (var i = 0; i < $draftUser.length; i++) {

        // set self to current loop position
        $self = $($draftUser[i]);
        // determine the type of info requested
        userRequest = $self.data(draftUserBare);
        // grab a record from the jsonp data
        record = data[this._randomizer(dataCount)];

        // ensure that the value is correctly returned as string
        if (typeof userRequest === 'string') {

          // switch on the request and set userInfo accordingly
          switch(userRequest) {
            case 'full':      userInfo = record.user.first + ' ' + record.user.last;  break;
            case 'first':     userInfo = record.user.first;                           break;
            case 'last':      userInfo = record.user.last;                            break;
            case 'email':     userInfo = record.user.email;                           break;
            case 'username':  userInfo = record.user.username;                        break;
            case 'twitter':   userInfo = '@' + record.user.username.split('.')[0];    break;
            case 'phone':     userInfo = record.user.phone;                           break;
            case 'address':   userInfo = record.place.address;                        break;
            case 'city':      userInfo = record.place.city;                           break;
            case 'state':     userInfo = record.place.state;                          break;
            case 'zip':       userInfo = record.place.zip;                            break;
            case 'country':   userInfo = record.place.country;                        break;
            default:          userInfo = '';                                          break;
          }

          // remove the data tags from the dom
          $self.removeAttr(scope.dataTag + draftUserBare);
          // call the method to get lorem ipsum info, passing in the textcount and type
          $self.html(userInfo);
        }
      }
    },

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  UTILITY METHODS                         * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

    /**********************************************
      *
      *  _randomizer method
      *  
      *  -- handles randomizing a single number or a range between 2 numbers
      *
      *  @param base -- number -- minimum amount if max given, otherwise it is the core number as only param
      *  @param max  -- number -- maximum amount if supplied
      *
      *  @return -- number -- to the calling method
      *
    **********************************************/
    _randomizer: function(base, max) {
      var randomize;

      /**
       * if a max number is supplied as 2nd parameter, randomize within the range
       * otherwise, randomize from 0 to the single number
       */
      if (!max) {
        randomize = Math.random() * base;
      } else {
        randomize = Math.random()*(max + 1 - base) + base;
      }

      // floor the decimal and return it to calling method
      return Math.floor(randomize);
    },

    /**********************************************
      * _rangeFinder method
      *
      * -- handles determining the min or max range in order to randomize
      *
      * @param digits -- number -- of how many digits to find a range for
      *
      * @return range -- object -- of the min and max range for specified digits
      *
    **********************************************/
    _rangeFinder: function(digits) {
      var min = 1,
          max = 1,
          minPow,
          maxPow,
          range = new Object();

      /**
       * use exponents to find the min and max points of a number
       * for example -- 3 digits will return a min of 100 and a max of 999
       */

      // determine what we will be multiplying against
      minPow = Math.pow(10, digits - 1);
      maxPow = Math.pow(10, digits) - 1;

      // multiply 1 against exponents to return range
      min *= minPow;
      max *= maxPow;

      // format the min/max in an object
      range = {
        min: min,
        max: max
      };

      // return it to calling method to be randomized
      return range;
    },

    /**********************************************
      *
      *  _removeEmptyIndexes method
      *
      *  @param text -- array -- of the array we want to check for empty index
      *
      *  @return -- array -- cleaned array
      *
    **********************************************/
    _removeEmptyIndexes: function(text) { 
      // this gets rid of any blank indexes
      return $.grep(text,function(n){
        return(n);
      });
    },

    /**********************************************
      *
      *  _replaceWith method
      *
      *  -- can temporarily remove ellipses and then replace them so they arent confused with periods
      *
      *  @param text    -- string -- that we want to replace the ellipses for
      *  @param search  -- string -- what we want to search for (ellipses or the replacement)
      *  @param replace -- string -- what we want to replace with (the replacement or ellipses)
      *
      *  @return -- string -- with the ellipses taken out/put back in
      *
    **********************************************/
    _replaceWith: function(text,search,replace) {
      var position = text.indexOf(search);
      while (typeof position === 'number' && position > 0) {
        text = text.replace(search, replace);
        position = text.indexOf(search);
      }
      return text;
    }
  }

    /***********************************************
    * ******************************************** *
    * *                                          * *
    * *  jQuery FUNCTION PROPERTY                * *
    * *                                          * *
    * ******************************************** *
    ***********************************************/

  $.fn.roughDraft = function(options) {
    
    // wrapper around the constructor, that prevents against multiple instantiations
    return this.each(function() {
      // store through jquery data
      $.data(this, 'roughdraft', new $.RedPen(options, this));
    });
  };
})(jQuery,window,document);