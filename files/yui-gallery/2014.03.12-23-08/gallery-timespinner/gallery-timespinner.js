YUI.add('gallery-timespinner', function(Y) {

/*
TimeSpinner by Dave Winders @daithi44

Was working on a project that queried/reported on switch calls (Telecoms industry).
Stephen Woods had developed a nice tool but the system needed the user to be able to input times which could require time down to seconds and could require a start and end time depending on what was being queried.

I started the widget and in my research on 'how to' develop YUI Widgets I found the YUI spinner widget which contributes to the TimeSpinner.
The TimeSpinner caters for 12 or 24 hour formats, use of seconds is configurable, and there is a time span option if a start and end time is required.

*/


YUI().add('gallery-timespinner', function(Y) {
        var Lang = Y.Lang,
        Widget = Y.Widget,
        Node = Y.Node,
        getClassName = Y.ClassNameManager.getClassName,
        CONTEXT_CLASS   = 'timespinner',
        LOCK_CLASS = 'lock',
        HOUR12_CLASS   = 'hour_12',
        HOUR24_CLASS   = 'hour_24',
        MINUTE_CLASS = 'minutes',
        SECOND_CLASS = 'seconds',
        SEP_CLASS   = 'sep',
        AMPM_CLASS = 'am_pm',
        UPDOWN_CLASS = 'updown',
        UP_CLASS = 'plus',
        DOWN_CLASS = 'minus';

    /* Spinner class constructor */
    function TimeSpinner(config) {
        TimeSpinner.superclass.constructor.apply(this, arguments);
    }

    /* 
     * timespinner
     */
    TimeSpinner.NAME = "timespinner";
    /*
     * The attribute configuration for the TimeSpinner widget.
     */
    TimeSpinner.ATTRS = {
        // The minimum value for the spinner.
         hourtype : {
            value:'24'
        },
        sep: {value:':'},
        seconds:{value:true},
        timepsan:{value:{required:false,sep:' - '}},
        holder:{value:''}
    };

    TimeSpinner.HTML_PARSER = {
    };
    /**
	*@method _pad
	*@param {Number} number value to be padded
	*@return {String} the padded parameter
	*/
	function _pad(number) { 
        return (number < 10) ? '0' + number : number;
    }

    /* TimeSpinner extends the base Widget class */
    Y.extend(TimeSpinner, Y.Widget, {
        initializer: function() {
            // Not doing anything special during initialization
        },
        destructor : function() {
            this._documentMouseUpHandle.detach();

        },
        renderUI : function() {
            this._renderTimeSelector();
        },
		/**
		* Method to Return the Value of the timespinner object
		*
		* @method getValue
		* @return {String} the timespinner object value
		*/
		getValue : function() {
          var cb = this.get('contentBox');
		  var firstchild =  cb.get("firstChild");
		  var firstchildChildnodes = firstchild.get("childNodes");
		  var firstchildChildnodesCount = firstchildChildnodes.get("childNodes").length;
		  var result = '';
		  for (var i = 0; i < firstchildChildnodesCount; i++) {
			var node = firstchildChildnodes.get("childNode")[i];
				if (node.get("tagName") === "DIV" && node.get("className") !== getClassName(CONTEXT_CLASS, UPDOWN_CLASS)){
				    result = result + firstchildChildnodes.get("childNode")[i].get("innerHTML");
				}else{
				    result = result + firstchildChildnodes.get("childNode")[i].get("value");
				}
		   }
		   return result;
        },
		//Bind UI
        bindUI : function() {
			this.after("valueChange", this._afterValueChange);
            var cb = this.get('contentBox');
            cb.on("focus", Y.bind(this._onTimeSegClick, this),'.'+getClassName(CONTEXT_CLASS, CONTEXT_CLASS));
            cb.on("mousedown", Y.bind(this._onMouseDown, this), '.'+getClassName(CONTEXT_CLASS, UPDOWN_CLASS));
            this._documentMouseUpHandle = cb.on("mouseup", Y.bind(this._onMouseUp, this), document);
            var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
            keyEventSpec += "38, 40, 33, 34";
			 Y.on("key", Y.bind(this._onDirectionKey, this), cb, keyEventSpec);
			Y.on("change", Y.bind(this._onInputChangeValid, this), 'input');
        },
		/**
		*Updates the UI with the value change
		*
		* @method syncUI
		* @param {String} val
		*/
        syncUI : function(val) {
			this._uiSetValue(val);
        },
		/**
		*
		*Creates the input control for the Timespinner and adds it to the widget's content box.
		*
		* @method _renderTimeSelector
		*
		*/
        _renderTimeSelector : function() {
            var contentBox = this.get("contentBox"),
				timespan = this.get("timepsan"),
                nodeContainer = Node.create(this._makeDiv(CONTEXT_CLASS)),
                arrowcontainer,
                tooltab;
			  //make first clock
               this._makeClock(nodeContainer);
			  //Check if there is a time span
                 if(timespan.required){
					 //get the separate value
                  nodeContainer.appendChild(Node.create(this._makeDiv(SEP_CLASS,timespan.sep)));
				  //make second clock.
				  this._makeClock(nodeContainer);
                 }
			 
				//Up and Down Arrows
                arrowcontainer = Node.create(this._makeDiv(UPDOWN_CLASS));
                arrowcontainer.appendChild(Node.create(this._makeButton(UP_CLASS)));
                arrowcontainer.appendChild(Node.create(this._makeButton(DOWN_CLASS)));
                nodeContainer.appendChild(arrowcontainer);
				contentBox.appendChild(nodeContainer);
				Y.one(this.get("holder")).appendChild(contentBox);
		
				//Focus Manager
                tooltab = Y.all('.yui3-timespinner-timespinner');
                tooltab.plug(Y.Plugin.NodeFocusManager,{
                    descendants : 'input[type=text]',
                    keys: {next: 'down:39', previous:'down:37'}
                });
        },
		/**
		*Makes the CLock based on the config settings
		*
		* @method _makeClock
		* @param {Element} nodeContainer
		* 
		*/
	   _makeClock : function (nodeContainer){
		//this could be called twice if the time config is a time span
				var hourtype = this.get("hourtype");
				var hourContainer = Node.create(this._makeInPut(hourtype === '12' ? HOUR12_CLASS : HOUR24_CLASS,'00'));
                nodeContainer.appendChild(hourContainer);
                nodeContainer.appendChild(Node.create(this._makeDiv(SEP_CLASS,this.get("sep"))));
                nodeContainer.appendChild(Node.create(this._makeInPut(MINUTE_CLASS,'00')));
                if( this.get("seconds")){
                 nodeContainer.appendChild(Node.create(this._makeDiv(SEP_CLASS,this.get("sep"))));
                 nodeContainer.appendChild(Node.create(this._makeInPut(SECOND_CLASS,'00')));
                }
                if (hourtype === '12'){
                     nodeContainer.appendChild(Node.create(this._makeInPut(AMPM_CLASS,'AM')));
                }
	     },
        /**
		* Make a DIV
		*
		* @method _makeDiv
		* @param {String} className
		* @param {String} str
		* @return {String}
		*/
        _makeDiv : function (className, str){
            var thisClass = getClassName(CONTEXT_CLASS, className), makeDivStr;
            if(arguments.length > 1){
                makeDivStr = '<div class="'+thisClass+'">'+str+'</div>';
            }
            else{
                 makeDivStr = '<div class="'+thisClass+'"></div>';
            }
            return makeDivStr;
        },
		/**
		*
		* Make a Button
		*
		* @method _makeButton
		* @param {String} className
		* @param {String} str
		* @return {String}
		*/
         _makeButton : function (className, str){
            var thisClass = getClassName(CONTEXT_CLASS, className),
            makeButtonStr = '<input type="button" class="'+thisClass+'" aria-label="'+className+'"/>';
            return makeButtonStr;
        },
        /**
		*
		* Make a Text Box
		*
		* @method _makeInPut
		* @param {String} className
		* @param {String} str
		* @return {String}
		*/
         _makeInPut : function (className, str){
            var thisClass = getClassName(CONTEXT_CLASS, className),
            makeInPut = '<input type="text" class="'+thisClass+'" value="'+str+'" aria-label="'+className+'"/>';
            return makeInPut;
        },
		/**
		* Handles Mouse Down and sets ups handler for timeout etc
		*
		* @method _onMouseDown
		* @param {Event} e
		*/
        _onMouseDown : function(e) {
            //mark sure the arrow clicked is a sibling of the loockclass.
            var ele = Y.one('.'+getClassName(CONTEXT_CLASS, LOCK_CLASS)),
			handled = false,
            classSplit,
            arraySplit;
            if (ele){
            var funcType;
                if(e.target.get("parentNode").get("parentNode").contains(ele)){
                classSplit = ele.get("className").split(' ');
                arraySplit = e.target.get("className"); 
					switch(arraySplit){
					 case getClassName(CONTEXT_CLASS, UP_CLASS):
					   funcType = this._up;
					   this._preInputChange(ele,this._up,classSplit[0]);
					   handled = true;
					   break;
					 case getClassName(CONTEXT_CLASS, DOWN_CLASS):
					   funcType = this._down;
					   this._preInputChange(ele,this._down,classSplit[0]);
					   handled = true;
					   break;
					}
                }
			    if (handled) {
                    this._setMouseDownTimers(ele, classSplit[0],funcType);
                }
             }
        },
		/**
		* Select the segment (hour, minute, second, am/pm) to change.
		*
		* @method _onTimeSegClick
		* @param {Event} e
		*/
        _onTimeSegClick: function(e) {
             var arraySplit = e.target.get("className"),
             node;
             if (arraySplit !== ''){
                 switch (arraySplit){
                 case getClassName(CONTEXT_CLASS,HOUR12_CLASS):case getClassName(CONTEXT_CLASS,HOUR24_CLASS):case getClassName(CONTEXT_CLASS, MINUTE_CLASS):case getClassName(CONTEXT_CLASS, SECOND_CLASS):case getClassName(CONTEXT_CLASS, AMPM_CLASS):
                        node = e.target;
                       this._lockandload(node);
                    break;
				
                 }
             }
        },
		/**
		* Sets the class to enable the input box to be changed
		*
		* @method _lockandload
		* @param {Element} node
		*/
        _lockandload : function(node){
        //couldn't use Focus Manger so set class here.
			if(!node.hasClass(getClassName(CONTEXT_CLASS, LOCK_CLASS))){
			 var nodeList = Y.all('.'+getClassName(CONTEXT_CLASS, LOCK_CLASS));
			 nodeList.removeClass(getClassName(CONTEXT_CLASS, LOCK_CLASS));
			  node.addClass(getClassName(CONTEXT_CLASS, LOCK_CLASS));
			}else{
			 node.removeClass(getClassName(CONTEXT_CLASS, LOCK_CLASS));
			}
        },
         /**
         * Override the default content box value, since we don't want the srcNode
         * to be the content box for TimeSpinner.
         */
        _defaultCB : function() {
            return null;
        },
         /**
		 * Document mouse up handler. Clears the timers supporting the "mouse held down" behavior.
		 *
		 * @method _onMouseUp
		 * @param {Event} e
         *
         */
        _onMouseUp : function(e) {		     
			if (this._mouseDownTimer) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
            if (this._mousePressTimer) {
                this._mousePressTimer.cancel();
                this._mousePressTimer = null;
            }
        },
         /**
         * Increments/Decrement the spinner value, based on the key pressed.
         *
		 * @method _onDirectionKey
		 * @param {Event} e
		 */
        _onDirectionKey : function(e) {
            e.preventDefault();
           if (e.target.hasClass(getClassName(CONTEXT_CLASS, LOCK_CLASS))){
            var classSplit = e.target.get("className").split(' ');
				switch (e.charCode) {
					case 38:
					   this._onInputChange(e.target, this._up(e.target.get("value"),classSplit[0]));
						break;
					case 40:
					     this._onInputChange(e.target, this._down(e.target.get("value"),classSplit[0]));
						break;
				 }
             }
        },
         /**
		  * Initiates mouse down timers, to increment slider, while mouse button is held down
         * Taken from the YUI Spinner Widget example
		 *
		 * @method _setMouseDownTimers
		 * @param {Element} target
         * @param {String} classN
		 * @param {Function} func
         */
        _setMouseDownTimers : function(target, classN,func) {
		 this._mouseDownTimer = Y.later(500, this, function() {this._mousePressTimer = Y.later( 100, this,function(){this._preInputChange(target,func, classN);},null,true);});
        },
         /**
         * Clears timers used to support the "mouse held down" behavior
		 *
		 * @method _clearMouseDownTimers
         */
        _clearMouseDownTimers : function() {
		if (this._mouseDownTimer) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
        },
		 /**
		 *
         * Updates the value of the input box to reflect the value passed in
		 *
		 * @method
		 * @param {String} val
         */
        _uiSetValue : function(val) {
		var inputNode = Y.one('.'+getClassName(CONTEXT_CLASS, LOCK_CLASS));
		if(inputNode){
			inputNode.set("value", val);
		}
        },
		 /**
		 * On a change to the InputValidate and Sync to UI
		 *
		 * @method _onInputChange
		 * @param {Element} inputNode
		 * @param {String} val
		 */
		_onInputChange : function(inputNode,val) {
		    var elClassName = inputNode.get("className").split(' ');
			if (this._validateValue(inputNode.get("value"),elClassName[0])) {
				// If the entered value is not valid, re-display the stored value
				this.syncUI(val);
			}
			else{
				elClassName[0] === getClassName(CONTEXT_CLASS, AMPM_CLASS) ?this.syncUI('AM'):this.syncUI('01');
			}
		},
		 /**
		 * Validate the Input
		 *
		 * @method _preInputChange
		 * @param {Element} inputNode
		 * @param {Function} func
		 * @param {String} classN
		 */
		_preInputChange:function(inputNode, func, classN){
            this._onInputChange(inputNode, func(inputNode.get("value"),classN));
		},
		 /**
		 * @method _onInputChangeValid
		 *
		 * @param {Event} e
		 */
		_onInputChangeValid : function(e) {
		this._onInputChange(e.target, e.target.get("value"));
		},
         /**
		 * Verifies that the value is a Valid one 
		 *
		 * @method _validateValue
		 * @param {String} Value
		 * @param {String} className
		 * @return {String} A valid value
		 *
		 */
       _validateValue: function(val, className) {
			switch(className){
				case getClassName(CONTEXT_CLASS, HOUR12_CLASS) :
					val = (+val);
					return (Lang.isNumber(val) && val >= 0 && val <= 12);
					 //break; 
				case getClassName(CONTEXT_CLASS, HOUR24_CLASS) :
					val = (+val);
					return (Lang.isNumber(val) && val >=1 && val <= 24);
					 //break; 
				case getClassName(CONTEXT_CLASS, AMPM_CLASS) :
					if (val === 'AM' || val === 'PM'){ return true;} else{ return false;}
					break;
				default:
				val = (+val);
				return (Lang.isNumber(val) && val >=0 && val <= 59);
			}
		},
		 /**
		 * Increment function for each type of field
		 *
		 * @method _up
		 * @param  {String} number value before decrementing
		 * @param  {String} hmshandler class name of Input
		 * @return {String} value after decrementing		 
		 */
       _up : function(number, hmshandler){
         switch(hmshandler){
            case getClassName(CONTEXT_CLASS, HOUR12_CLASS) :
                switch (number){
                   case '12':
                    return _pad(1);
                   default:
                    return _pad((+number)+1);
                   }
             break;
             case getClassName(CONTEXT_CLASS, HOUR24_CLASS):
                switch (number){
                   case '23':
                    return _pad(0);
                   default:
                    return _pad((+number)+1);
                   }
            break;
            case getClassName(CONTEXT_CLASS, MINUTE_CLASS): case getClassName(CONTEXT_CLASS, SECOND_CLASS):
                switch (number){
                   case '59':
                    return _pad(0);
                   default:
                    return _pad((+number)+1);
                   }
            break;
			case getClassName(CONTEXT_CLASS, AMPM_CLASS):
				return number === 'AM'? 'PM': 'AM';
         }
		},
		 /**
		 * Decrement function for each type of field
		 *
		 * @method _down
		 * @param  {String} number value before decrementing
		 * @param  {String} hmshandler class name of Input
		 * @return {String} value after decrementing
		 */
		_down :function (number, hmshandler){
         switch(hmshandler){
            case getClassName(CONTEXT_CLASS, HOUR12_CLASS):
                switch (number){
                   case '01':case '00':
                    return _pad(12);
                   default:
                    return _pad((+number)-1);
                   }
            break;
             case getClassName(CONTEXT_CLASS, HOUR24_CLASS):
                switch (number){
                   case '00':
                    return _pad(23);
                   default:
                    return _pad((+number)-1);
                   }
            break;
             case getClassName(CONTEXT_CLASS, MINUTE_CLASS): case getClassName(CONTEXT_CLASS, SECOND_CLASS):
                switch (number){
                   case '00':
                    return _pad(59);
                   default:
                    return _pad((+number)-1);
                   }
            break;
			  case getClassName(CONTEXT_CLASS, AMPM_CLASS):
				return number === 'AM'? 'PM': 'AM';
        }
      }
    });	
	 Y.TimeSpinner = TimeSpinner;
	}, '0.01', { requires: [ 'widget', 'node-focusmanager'] });



}, 'gallery-2010.12.01-21-32' ,{requires:['widget','node-focusmanager']});
