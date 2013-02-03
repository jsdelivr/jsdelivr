/*
	Storage.js v1.6.2

	Storage.js jQuery Plugin (C) 2011 Ethan Kramer
	
	STORAGE.JS IS DOUBLE LICENSED UNDER THE MIT LICENSE AND GPL LICENSE

	MIT LICENSE

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	GPL LICENSE

	A jquery plugin for simple page editing that uses HTML5 content editable and HTML5 localStorage
	    Copyright (C) 2011  Ethan Kramer

	    This program is free software: you can redistribute it and/or modify
	    it under the terms of the GNU General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.

	    This program is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU General Public License for more details.

	    You should have received a copy of the GNU General Public License
	    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/



(function ($){

	$.fn.storage = function(options){
		
		var defaults = {
					onStart:function(){},
					onExit:function(){},
					beforeSave:function(){},
					afterSave:function(){},
					storageKey:'storageKey',
					revert:false,
					store:true
				},
			settings = $.extend({},defaults,options);
		
	    var objects = $(this),
	        keys = [];
	    
        if (settings.store) {

            
            for (var i=0; i < objects.length; i++) {
            
               key = settings.storageKey + '-' + i;
               $(objects[i]).attr('data-orig-text',$(objects[i]).text());
                
                if (settings.revert) {
                    
                    // set localstorage and cookies.js to the current value of the element
                    
                    localStorage.setItem(key,$(objects[i]).data('orig-text'));
                    cookie.set(key,$(objects[i]).data('orig-text'));
                    $(objects[i]).text($(objects[i]).data('orig-text'));
                    
                    if ($(objects[i]).text() == "" || $(objects[i]).text() == "null") {
                        $(objects[i]).text($(objects[i]).data('orig-text'));
                    }
                    
                    //and cookies.js
                    
                }else{
                    
                    
                    $(objects[i]).text(localStorage.getItem(key));
                    $(objects[i]).text(cookie.get(key));
                    
                    if ($(objects[i]).text() == "" || $(objects[i]).text() == "null") {
                        $(objects[i]).text($(objects[i]).data('orig-text'));
                    }
                    
                    // and cookies.js
                }
                
                keys.push(key);
                $(objects[i]).attr('data-key',key);
                
                
    	    }
    	}

	    
	    return this.each(function(){
	        
	        var $this = $(this),
	            sKey = $this.data('key');
	            
	        $this.attr('contenteditable','');
	        
	        
	        // when the user has clicked on the element
	        $this.focus(function(){
	            
	            var focusText = $(this).text();
	            
	            // add a class of sf-focus to the element
	            $this.addClass("sf-focus");
	            
	            // call the function the user passed in
	            settings.onStart.apply(this,[$(this),focusText]);
	            
	        });
	        
	        // after the user has clicked away from the element
	        $this.blur(function(){
	            
	            var blurText = $(this).text();
	            
	            // remove the sf-focus class
                $this.removeClass("sf-focus");
                
                // add an sf-blur class
            	$this.addClass("sf-blur");
            	
            	// then call the onExit function
            	
            	settings.onExit.apply(this,[$(this),blurText]);
	            
	            // save new text to localStorage
	            
	            if (settings.store) {
	                
	                // call the before save function
	                settings.beforeSave.apply(this,[$(this),blurText]);
	                
	                // save new text of element to localstorage
	                localStorage.setItem(sKey,blurText);
	                
	                // save it to cookies.js
	                cookie.set(sKey,blurText);
	                
	                // call the afterSave function
	                settings.afterSave.apply(this,[$(this),blurText]);
	                
	                
	            	                
	            }
	            
	            // remove the class sf-blur
	            
	            $this.removeClass("sf-blur");
	            
	        });
	        
	        
	    });
	};

})(jQuery);