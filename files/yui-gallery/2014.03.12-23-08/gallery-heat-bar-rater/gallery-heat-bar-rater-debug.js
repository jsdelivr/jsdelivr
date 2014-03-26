YUI.add('gallery-heat-bar-rater', function(Y) {

	var Node = Y.Node,
	    Lang = Y.Lang,
	    Widget = Y.Widget;
	
	//Constructor for HeatBarRater widget
	function HeatBarRater(config) {
		HeatBarRater.superclass.constructor.apply(this, arguments);
	}
	
	/* 
        * Required NAME static field, to identify the Widget class and 
        * used as an event prefix, to generate class names etc. (set to the 
        * class name in camel case). 
        */
	HeatBarRater.NAME = "heatbarrater";
	
	/*
        * The attribute configuration for the HeatBarRater widget. Attributes can be
        * defined with default values, get/set functions and validator functions
        * as with any other class extending Base.
        */
	HeatBarRater.ATTRS = {
		//entity rating value		
                rating : {
                    value: 0,
                    validator: '_validateRating',
                    broadcast: 1               
                },
        
                //rating value when the entity is still 'unrated'
                ratingUnrated : {
                    value: 0,
                    writeOnce: true              
                },

                //rating values should be greater than 'unrated' value
                valueMap: {
	            value: {
	                 1: {color: 'ffdd33', legend: 'Awful'},
	                 2: {color: 'ffcc33', legend: 'Awful'},
	                 3: {color: 'ffbb33', legend: 'Not that good'},
	                 4: {color: 'ffaa22', legend: 'Not that good'},
	                 5: {color: 'ff9922', legend: 'Okay'},
	                 6: {color: 'ff8822', legend: 'Okay'},
	                 7: {color: 'ff7711', legend: 'Pretty good'},
	                 8: {color: 'ff6611', legend: 'Pretty good'},
	                 9: {color: 'ff5500', legend: 'Fantastic'},
	                 10: {color: 'ff4400', legend: 'Fantastic'}								
	            },
	            writeOnce: true       
               }
        };

        /* Static constant used to identify the classname applied to the HeatBarRater's rating bar */
        HeatBarRater.RATING_BAR_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-bar');

	/* Static constant used to identify the classname applied to the HeatBarRater's rating bar when the entity is 'unrated'*/
        HeatBarRater.RATING_BAR_UNRATED_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-bar-unrated');

	/* Static constant used to identify the classname applied to the HeatBarRater's rating bar when the entity is 'rated'*/
        HeatBarRater.RATING_BAR_RATED_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-bar-rated');

   	/* Static constant used to identify the classname applied to the HeatBarRater's rating unit */
        HeatBarRater.RATING_UNIT_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-unit');

   	/* 'PARTIAL' Static constant used to identify the classname applied to the HeatBarRater's 'active' rating unit */
        HeatBarRater.RATING_UNIT_ACTIVE_PART_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-unit-active');

   	/* Static constant used to identify the classname applied to the HeatBarRater's first rating unit */
        HeatBarRater.RATING_UNIT_FIRST_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-unit-first');

   	/* Static constant used to identify the classname applied to the HeatBarRater's last rating unit */
        HeatBarRater.RATING_UNIT_LAST_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-unit-last');

   	/* Static constant used to identify the classname applied to the HeatBarRater's rating legend */
        HeatBarRater.RATING_LEGEND_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-legend');

   	/* Static constant used to identify the classname applied to the HeatBarRater's rating legend when the entity is 'unrated' */
        HeatBarRater.RATING_LEGEND_UNRATED_CLASS = Y.ClassNameManager.getClassName(HeatBarRater.NAME, 'rating-legend-unrated');

        /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through Y.substitute */
        HeatBarRater.RATING_BAR_TEMPLATE = '<ol class="' + HeatBarRater.RATING_BAR_CLASS + '"></ol>';
        HeatBarRater.RATING_UNIT_TEMPLATE = '<li title="{legend}" value="{value}" class="' + HeatBarRater.RATING_UNIT_CLASS + '"></li>';
        HeatBarRater.RATING_CARRIER_TEMPLATE = '<input type="hidden" value="" name="{name}" />';
        HeatBarRater.RATING_LEGEND_TEMPLATE = '<span class="' + HeatBarRater.RATING_LEGEND_CLASS+ '"></span>';


        /* 
        * The HTML_PARSER static constant is used by the Widget base class to populate 
        * the configuration for the HeatBarRater instance from markup already on the page.
        *
        * The HeatBarRater class attempts to set the value of the heatbarrater widget if it
        * finds the appropriate input element on the page.
        */
        HeatBarRater.HTML_PARSER = {
            rating: function (srcNode) {
                // If progressive enhancement is to be supported, return the value of "rating" based on the contents of the srcNode
                var val = parseInt(srcNode.get('value'), 10); 
                return Lang.isNumber(val)? val : null;
            }
        };

        /* HeatBarRater extends the base Widget class */
        Y.extend(HeatBarRater, Widget, {
	    initializer: function() {
	        var srcNode = this.get('srcNode');
	        this._ratingCarrierName = srcNode.get('name');
            },

            destructor : function() {
	        this._ratingBarNode = null;
	        this._ratingLegendNode = null;
	        this._ratingCarrierNode = null;
		this.get('boundingBox').replace(this.get('srcNode')); 
            },

            renderUI : function() {
                var contentBox = this.get('contentBox'),
                    valueMap = this.get('valueMap'),
                    ratingUnit = null,
                    ratingUnitValue = null,
                    ratingUnitNode = null,
                    ratingBarNode = null,
                    i = null,
                    myStyleSheet = Y.StyleSheet(HeatBarRater.NAME),
                    activeUnitClassName = '',
	            contentBoxId = contentBox.get('id');

                //create rating bar
                ratingBarNode = Node.create(HeatBarRater.RATING_BAR_TEMPLATE); 
                this._ratingBarNode = ratingBarNode;
                //create rating units and add them to rating bar
                for(i in valueMap) { 
                     if(valueMap.hasOwnProperty(i)) {
	                ratingUnit = valueMap[i];
	                ratingUnitValue = i;
	                ratingUnitNode = Node.create(Y.substitute(HeatBarRater.RATING_UNIT_TEMPLATE, {legend: ratingUnit.legend, value: ratingUnitValue}));
	                activeUnitClassName = this._getActiveUnitClassName(ratingUnitValue);
	                myStyleSheet.set('#' + contentBoxId + ' .' + HeatBarRater.RATING_BAR_RATED_CLASS + ' .' + activeUnitClassName , {
		             backgroundColor: '#' + ratingUnit.color,
				     borderColor: '#' + ratingUnit.color
	                });
	                ratingBarNode.appendChild(ratingUnitNode);	
                     }
                }

                //first and last rating units get additional styles
                ratingBarNode.one(':first-child').addClass(HeatBarRater.RATING_UNIT_FIRST_CLASS);
                ratingBarNode.one(':last-child').addClass(HeatBarRater.RATING_UNIT_LAST_CLASS);          

                //add rating bar to content box
                contentBox.appendChild(ratingBarNode);

                //add current rating legend
                this._ratingLegendNode = Node.create(HeatBarRater.RATING_LEGEND_TEMPLATE);
                contentBox.appendChild(this._ratingLegendNode);

                //add rating carrier
                this._ratingCarrierNode = Node.create(Y.substitute(HeatBarRater.RATING_CARRIER_TEMPLATE, {name: this._ratingCarrierName}));
                contentBox.appendChild(this._ratingCarrierNode);
           },

           bindUI : function() {
		var ratingBarNode = this._ratingBarNode;
	
	        this.after("ratingChange", this._afterRatingChange);
	        ratingBarNode.delegate('click', Y.bind(this._onSelectRating, this), '.' + HeatBarRater.RATING_UNIT_CLASS);
		ratingBarNode.delegate('mouseenter', Y.bind(this._onMouseEnterRatingUnit, this), '.' + HeatBarRater.RATING_UNIT_CLASS);
		ratingBarNode.on('mouseleave', Y.bind(this._onMouseLeaveRatingBar, this));
	   },

           syncUI: function() {
	        var currentRating = this.get('rating');
                this._uiSetRatingBar(currentRating);
                this._updateRatingCarrier(currentRating);
	   },

	   _onMouseEnterRatingUnit: function(e) {
                this._uiSetRatingBar(parseInt(e.currentTarget.getAttribute('value'), 10));
	   },

	   _onMouseLeaveRatingBar: function(e) {
                this.syncUI();
	   },

	   _onSelectRating: function(e) { //this is bound to execute in the context of the widget
		var ratingUnitNode = e.currentTarget,
		    ratingUnitValue = ratingUnitNode.getAttribute('value');
		
		this.set('rating', parseInt(ratingUnitValue, 10));
	   },
	
	   /*
            * rating attribute change listener. Updates the 
            * the rendered rating bar, whenever the 
            * rating value changes.
            */
           _afterRatingChange : function(e) {
	        this.syncUI();
           },

           /*
            * Updates the rating bar to reflect 
            * the value passed in
            */
           _uiSetRatingBar : function(val) {
                var ratingBarNode = this._ratingBarNode,
                    ratingUnitNodeList = ratingBarNode.all('.' + HeatBarRater.RATING_UNIT_CLASS),
                    currentRating = val,
                    currentRatingLegend = '',
	            ratingBarRatedClass = HeatBarRater.RATING_BAR_RATED_CLASS,
	            ratingBarUnratedClass = HeatBarRater.RATING_BAR_UNRATED_CLASS,
	            ratingLegendNode = this._ratingLegendNode;
   
                //update rating bar to 'rated' or 'unrated'
                if(currentRating === this.get('ratingUnrated')) {
		     if(ratingBarNode.hasClass(ratingBarRatedClass) === true) {
			     ratingBarNode.removeClass(ratingBarRatedClass);
		     }
		     if(ratingBarNode.hasClass(ratingBarUnratedClass) === false) {
			     ratingBarNode.addClass(ratingBarUnratedClass);
		     }
	             currentRatingLegend = 'Not rated';
                }
                else {
		     if(ratingBarNode.hasClass(ratingBarUnratedClass) === true) {
			     ratingBarNode.removeClass(ratingBarUnratedClass);
		     }
		     if(ratingBarNode.hasClass(ratingBarRatedClass) === false) {
			     ratingBarNode.addClass(ratingBarRatedClass);
		     }
                }

                //update rating bar units with colors
                ratingUnitNodeList.each(function(ratingUnitNode) {
	             var ratingUnitValue = ratingUnitNode.getAttribute('value'),
		         ratingUnitClassName = this._getActiveUnitClassName(ratingUnitValue);

	             if(ratingUnitValue <= currentRating) {
		              if(ratingUnitNode.hasClass(ratingUnitClassName) === false) {
				      ratingUnitNode.addClass(ratingUnitClassName);
			      }
		              currentRatingLegend = ratingUnitNode.getAttribute('title');
	             }
	             else {
		              if(ratingUnitNode.hasClass(ratingUnitClassName) === true) {
				      ratingUnitNode.removeClass(ratingUnitClassName);
			      }
	             }
                }, this);

                //update rating legend
                if(currentRating === this.get('ratingUnrated')) {
		   if(ratingLegendNode.hasClass(HeatBarRater.RATING_LEGEND_UNRATED_CLASS) === false) { 
		         ratingLegendNode.addClass(HeatBarRater.RATING_LEGEND_UNRATED_CLASS);
		   }
	        }
	        else {
		   if(ratingLegendNode.hasClass(HeatBarRater.RATING_LEGEND_UNRATED_CLASS) === true) { 
		         ratingLegendNode.removeClass(HeatBarRater.RATING_LEGEND_UNRATED_CLASS);
		   }
	        }
                ratingLegendNode.set('innerHTML', currentRatingLegend);
          },


          /*
           * Updates entity rating carrier often used for form submit 
           */
          _updateRatingCarrier: function(val) {
	        this._ratingCarrierNode.set('value', val);
          },

          _getActiveUnitClassName: Y.cached(function(val){
	        return HeatBarRater.RATING_UNIT_ACTIVE_PART_CLASS + '-' + val;
          }),
	
	  /*
           * Override the default content box value, since we don't want the srcNode
           * to be the content box for spinner.
           */
          _defaultCB : function() {
                return null;
          },

          /*
           * rating attribute default validator. Verifies that
           * the rating value is either one from value map or not rated
           */
          _validateRating: function(val) {
                return (Lang.isNumber(val) && ((this.get('valueMap')[val] !== undefined) || (val === this.get('ratingUnrated'))));
          }
	});
	
	Y.HeatBarRater = HeatBarRater; //injecting the new class into the sandbox


}, 'gallery-2010.07.28-20-07' ,{requires:['widget','substitute','stylesheet','event-mouseenter','selector-css3']});
