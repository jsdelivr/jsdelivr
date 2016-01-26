  /**
    *          |>
    *        \_|___/
    * CuttySSark
    *
    *
    * Cutty allows you to navigate the wild waters of event-driven style changes! It's a lightweight polyfill
    * adding support for JS event triggering and matching in stylesheets using standard CSS2 selectors.
    *
    *
    * @author     Devin Ivy
    * @email      devin@bigroomstudios.com
    * @website    http://devinivy.com
    *
    * @dependency jQuery 1.7+
    * @version    1.0
    * 
    * @license    MIT
    * @enjoy
    * 
    */
  
    (function() {
        
        // different browsers hold their css rules in objects of different names
        var cssRules = null;
        
        var init = function () {
            
            // process the style sheets
            var i;
            for (i = 0; i < document.styleSheets.length; i++) {
                processStyleSheet(document.styleSheets[i]);
            }
            
	    $('body').trigger('cutty');
	    
        }
        
        var setCssRules = function () {
	    
            var i;
            for (i = 0; i < document.styleSheets.length; i++) {
		ss = document.styleSheets[i];
		
		var ownerNode = ss.ownerNode || ss.owningElement;
		
		if (ownerNode.getAttribute("data-cutty-bypass") === null) {
		    cssRules = (ss.cssRules !== undefined) ? "cssRules" : "rules";
		    break;
		}
		
	    }
	    
        }
        
        // register the ultimate callback to a bunch of kids!
        var registerEvent = function(kids, event, option, extras) {
            
            // off is just a state for the 'toggle' option
            if (option != 'off') {
                
                $(kids).each( function(index, kid) {
                    
                    // if this was already registered, don't do it again.
                    // unless this is a trigger.
                    if ($(kid).data(event+'|'+option) != true || option == 'trigger') {
                        
                        eventInfo = {
                            kid: kid,
                            option: option,
                            extras: extras
                        };
                        
                        // this is an important line
                        $(kid).on(event, eventInfo, theUltimateCallback);
                        
                        // mark as registered on those elements
                        $(kid).data(event+'|'+option, true);
                        
                    }
                    
                });
                
            }
            
        }
        
        // this is applied in registerEvent to any element with an on~= selector
        var theUltimateCallback = function(e) {
            
            kid = e.data.kid;
            option = e.data.option;
            extras = e.data.extras;
            newEvent = e.type;
            
            switch (option) {
                
                case 'once':
                    
                    newEvent += '|once';
                    
                    if ($(e.target).data(newEvent+'|executed') != true && !onKid(kid, newEvent)) {
                        addToKid(kid, newEvent);
                    }
                    
                    $(e.target).data(newEvent+'|executed', true);
                    break;
                
                case 'clear':
                    
                    newEvent += '|clear';
                    
                    clearKid(kid);
                    addToKid(kid, newEvent);
                    break;
                
                case 'state':
                    
                    newEvent += '|state';
                    
                    clearStatesOnKid(kid);
                    addToKid(kid, newEvent);
                    break;
                
                case 'toggle':
                    
                    offEvent = newEvent + '|off';
                    newEvent = newEvent + '|toggle';
                    
                    if (onKid(kid, newEvent)) {
                        addToKid(kid, offEvent);
                        rmFromKid(kid, newEvent);
                    } else {
                        addToKid(kid, newEvent);
                        rmFromKid(kid, offEvent);
                    }
                    break;
                
                case 'trigger':
                    
                    // match1(match2)
                    parseTrigger = /^([^\(]+)\(([^\)]+)\)$/;
                    
                    triggerInfo = parseTrigger.exec(extras);
                    
                    if (triggerInfo && triggerInfo.length > 2) {
                        
                        event = triggerInfo[1];
                        triggerKids = triggerInfo[2];
                        
			switch (triggerKids) {
			    case 'next':
				triggerKids = $(kid).next();
				if (!triggerKids.length) {
				    triggerKids = $(kid).siblings().first();
				}
				break;
			    case 'prev':
				triggerKids = $(kid).prev();
				if (!triggerKids.length) {
				    triggerKids = $(kid).siblings().last();
				}
				break;
			    case 'parent':
				triggerKids = $(kid).parent();
				break;
			    case 'self':
				triggerKids = $(kid);
				break;
			    default:
				triggerKids = $(triggerKids);
				break;
			}
			
                        triggerKids.trigger(event);
                        
                    }
                    break;
                
                default:
                    
                    if (!onKid(kid, newEvent)) {
                        addToKid(kid, newEvent);
                    }                            
                    break;
            }
            
        }
        
        var getCurrentEvents = function(kid) {
            currentEvents = $(kid).attr('on');
            currentEvents = (typeof currentEvents == 'undefined') ? ''
                                                                  : currentEvents;
                                                                  
            return currentEvents;
        }
        
        var onKid = function(kid, event) {
            
            currentEvents = getCurrentEvents(kid).split(' ');
            
            var i;
            for (i = 0; i < currentEvents.length; i++) {
                
                if (event == currentEvents[i] ) {
                    return true;
                }
                
            }
            
            return false;
            
        }
        
        var addToKid = function(kid, event) {
            
            currentEvents = getCurrentEvents(kid);
            
            newEvents = currentEvents + ' ' + event;
            newEvents = newEvents.trim();
            
            $(kid).attr('on', newEvents);
            
        }
        
        var rmFromKid = function(kid, event) {
            
            currentEvents = getCurrentEvents(kid).split(' ');
            
            newEvents = '';
            
            var i;
            for (i = 0; i < currentEvents.length; i++) {
                
                if (event != currentEvents[i] ) {
                    newEvents += currentEvents[i] + ' ';
                }
                
            }
            
            newEvents = newEvents.trim();
            
            $(kid).attr('on', newEvents);
            
        }
        
        var clearStatesOnKid = function(kid) {
            
            stateRegex = /\|state$/;
            
            newEvents = '';
            currentEvents = getCurrentEvents(kid).split(' ');
            
            var i;
            for (i = 0; i < currentEvents.length; i++) {
                
                if (!stateRegex.exec(currentEvents[i])) {
                    newEvents += currentEvents[i] + ' ';
                }
                
            }
            
            newEvents = newEvents.trim();
            
            $(kid).attr('on', newEvents);
            
        }
        
        var clearKid = function(kid) {
            $(kid).attr('on', '');
        }
        
        var processStyleSheet = function (styleSheet) {
            
            if (cssRules == null) {
                setCssRules();
            }
            
	    var ownerNode = styleSheet.ownerNode || styleSheet.owningElement;
	    
            if (ownerNode.getAttribute("data-cutty-bypass") === null &&
		styleSheet[cssRules] && styleSheet[cssRules].length > 0) {
            
                if (ownerNode.getAttribute("data-cutty-processed") === null) {
                
                    var i, j, rule;
                    
                    for (i = 0; i < styleSheet[cssRules].length; i++) {
                        rule = styleSheet[cssRules][i];
                        
                        // check nested rules in media queries etc
                        if (rule[cssRules] && rule[cssRules].length > 0) {
                            for (j = 0; j < rule[cssRules].length; j++) {
                                processSelector(rule[cssRules][j].selectorText, rule[cssRules][j].style);
                            }
                        }
                        else {
                            processSelector(rule.selectorText, rule.style);
                        }
                    }
                    
                    // flag the style sheet as processed
                    ownerNode.setAttribute("data-cutty-processed", "");
                }
            }
        };
        
        var processSelector = function(longSelector, style) {
            
            if (!longSelector) {
                return;
            }
            
            var multiRegex  = /(\[on\~\=[\'\"][^\'\"]+[\'\"]\])+/;
            var singleRegex = /on\~\=[\'\"]([^\'\"]+)[\'\"]/;
            
            // split selectors separated by commas
            selectors = longSelector.split(',');
            
            // foreach single selector
            var i;
            for (i = 0; i < selectors.length; i++) {
                
                selector = selectors[i].trim();
                
                multiResult = multiRegex.exec(selector);
                
                // if this has some attribute selectors we care about
                if (multiResult != null) {
                    
                    // everything before the first attribute selector
                    baseSelector = selector.substring(0, multiResult.index);
                    
                    // list of the "on" attribute selectors
                    onSelectors = multiResult[0].split('][');
                    
                    // register those as events on the base selector
                    var j;
                    for (j = 0; j < onSelectors.length; j++) {
                        
                        onSelector = onSelectors[j];
                        
                        singleResult = singleRegex.exec(onSelector);
                        
                        if (singleResult) {
                            
                            withOptions = singleResult[1].split('|');
                            
                            event = withOptions[0];
                            
                            register = true;
                            option = '';
                            extras = '';
                            if (withOptions.length > 1) {
                                option = withOptions[1];
                            }
                            if (withOptions.length > 2) {
                                extras = withOptions[2];
                            }
                            
                            if (register)
                                registerEvent(baseSelector, event, option, extras);
                        }
                        
                    }
                }
            }
            
        }
        
        // let's get this party started
        $(init);
        
    })();
