/*! jQuery slabtext plugin v2 MIT/GPL2 @freqdec */
(function( $ ){  
        
    $.fn.slabText = function(options) {
    
        var settings = {
            // The ratio used when calculating the characters per line 
            // (parent width / (font-size * fontRatio)). 
            "fontRatio"             : 0.78,
            // Always recalculate the characters per line, not just when the 
            // font-size changes? Defaults to true (CPU intensive)
            "forceNewCharCount"     : true,
            // Do we wrap ampersands in <span class="amp"> ?
            "wrapAmpersand"         : true,
            // Under what pixel width do we remove the slabtext styling?
            "headerBreakpoint"      : null,
            "viewportBreakpoint"    : null,
            // Don't attach a resize event
            "noResizeEvent"         : false,
            "maxFontSize"           : 9999
            };
        
        // Add the slabtexted classname to the body to initiate the styling of
        // the injected spans
        $("body").addClass("slabtexted");
            
        return this.each(function(){
               
            // Extend options if necessary
            if(options) { 
                    $.extend(settings, options);
            };
            
            var $this               = $(this),                              
                keepSpans           = $("span.slabtext", $this).length,
                words               = keepSpans ? [] : String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "),                              
                origFontSize        = null,                                 
                idealCharPerLine    = null,                                 
                fontRatio           = settings.fontRatio,                   
                forceNewCharCount   = settings.forceNewCharCount,
                headerBreakpoint    = settings.headerBreakpoint,
                viewportBreakpoint  = settings.viewportBreakpoint,
                resizeThrottle      = null,
                viewportWidth       = $(window).width();                                   
                // Extract the first href from source text
                hedLink             = $this.find("a:first").attr("href");
            
            // Calculates the pixel equivalent of 1em within the current header
            var grabPixelFontSize = function() {
                var dummy = jQuery('<div style="display:none;font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;">&nbsp;</div>').appendTo($this),
                    emH   = dummy.height();
                dummy.remove();
                return emH;
            };             
                                          
            // Most of this function is a (very) stripped down AS3 to JS port of the slabtype
            // algorithm by Eric Loyer with the original comments left intact
            // http://erikloyer.com/index.php/blog/the_slabtype_algorithm_part_1_background/                         
            var resizeSlabs = function resizeSlabs() {
                    
                // Cache the parent containers width       
                var parentWidth = $this.width(),
                    fs;
                
                // Remove the slabtextdone and slabtextinactive classnames to enable the inline-block shrink-wrap effect
                $this.removeClass("slabtextdone slabtextinactive");
                
                if(viewportBreakpoint && viewportBreakpoint > viewportWidth
                   ||
                   headerBreakpoint && headerBreakpoint > parentWidth) {
                    // Add the slabtextinactive classname to set the spans as inline
                    // and to reset the font-size to 1em (inherit won't work in IE7)
                    $this.addClass("slabtextinactive");                                        
                    return;
                };
                
                fs = grabPixelFontSize(); 
                // If the parent containers font-size has changed or the "forceNewCharCount" option is true (the default),
                // then recalculate the "characters per line" count and re-render the inner spans
                // Setting "forceNewCharCount" to false will save CPU cycles...                                                                                           
                if(!keepSpans && (forceNewCharCount || fs != origFontSize)) {
                            
                    origFontSize = fs;
                    
                    var newCharPerLine      = Math.min(60, Math.floor(parentWidth / (origFontSize * fontRatio))),
                        wordIndex           = 0,
                        lineText            = [],
                        counter             = 0,                                                                        
                        preText             = "",
                        postText            = "",
                        finalText           = "",
                        preDiff,
                        postDiff;
                    
                    if(newCharPerLine != idealCharPerLine) {
                        idealCharPerLine = newCharPerLine;
                                                                
                        while (wordIndex < words.length) {
                       
                            postText = "";

                            // build two strings (preText and postText) word by word, with one
                            // string always one word behind the other, until
                            // the length of one string is less than the ideal number of characters
                            // per line, while the length of the other is greater than that ideal
                            while (postText.length < idealCharPerLine) {
                                preText   = postText;
                                postText += words[wordIndex] + " ";
                                if(++wordIndex >= words.length) {
                                    break;
                                };
                            };

                            // calculate the character difference between the two strings and the
                            // ideal number of characters per line
                            preDiff  = idealCharPerLine - preText.length;
                            postDiff = postText.length - idealCharPerLine;
            
                            // if the smaller string is closer to the length of the ideal than
                            // the longer string, and doesn’t contain just a single character, then
                            // use that one for the line
                            if((preDiff < postDiff) && (preText.length > 2)) {
                                finalText = preText;
                                wordIndex--;              
                            // otherwise, use the longer string for the line
                            } else {
                                finalText = postText;
                            };

                            lineText.push('<span class="slabtext">' + $.trim(settings.wrapAmpersand ? finalText.replace("&", '<span class="amp">&amp;</span>') : finalText) + "</span>");
                        };
                                    
                        $this.html(lineText.join(" "));
                        // If we have a hedLink, add it back just inside our target, around all the slabText spans
                        if (hedLink) {
                            $this.wrapInner('<a href="' + hedLink + '" />');
                        }
                    };        
                } else {
                    // We only need the font-size for the resize-to-fit functionality
                    // if not injecting the spans 
                    origFontSize = fs;
                };
                                                        
                // Loop through the spans changing font-size accordingly
                $("span.slabtext", $this).each(function() {
                    var $span       = $(this),
                        innerText   = $span.text(),
                        wordSpacing = innerText.split(" ").length > 1,
                        diff,
                        ratio,
                        fontSize;
                        
                    $span.css('word-spacing', 0).css('letter-spacing', 0);
                    
                    ratio    = parentWidth / $span.width();
                    fontSize = parseFloat(this.style.fontSize) || origFontSize;
                    
                    // Resize font    
                    $span.css('font-size', Math.min((fontSize * ratio).toFixed(3), settings.maxFontSize) + "px");
                    
                    // Do we still have space to try to fill or crop
                    diff = parentWidth - $span.width();
                    
                    // A "dumb" tweak in the blind hope that the browser will
                    // resize the text to better fit the available space.
                    // Better "dumb" and fast...
                    if(diff) {
                        $span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(3) + "px");
                    };                                                                                                                        
                });
                    
                // Add the class slabtextdone to set a display:block on the child spans
                // and avoid styling & layout issues associated with inline-block
                $this.addClass("slabtextdone");
            };

            // Immediate resize
            resizeSlabs();     
                    
            if(!settings.noResizeEvent) {
                // Window resize event          
                $(window).resize(function() {
                    // Only run the resize code if the viewport width has changed.
                    // we ignore the viewport height as it will be constantly changing 
                    // due to the font-size resizing and IE fires a resize event whenever
                    // vertical height has changed leading to an endless loop and
                    // locked browser.
                    if($(window).width() == viewportWidth) {
                        return;
                    };
                                    
                    viewportWidth = $(window).width();
                                    
                    // Throttle the resize event to 300ms
                    clearTimeout(resizeThrottle);
                    resizeThrottle = setTimeout(resizeSlabs, 300);
                });
            };        
        });
    };
})(jQuery);