/*
	Storage.js v1.7 beta

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
		
		return this.each(function(){
			var $this = $(this),
				$text = $this.text(),
				origKey = "orig" + settings.storageKey;
				
			$this.attr("data-orig-text",$text);

			if(settings.store){
				localStorage.setItem(origKey,$text);
				cookie.set(origKey,$text);
			}

			$this.attr('contenteditable','');
			
			if (settings.store) {
				if(settings.revert){
					$this.text(localStorage.getItem(origKey));
					$this.text(cookie.get(origKey));

					if ($this.text() == "" || $this.text() == "null") {
						$this.text($this.data("orig-text"));
					}

				}else{
					$this.text(localStorage.getItem(settings.storageKey));
					$this.text(cookie.get(settings.storageKey));

					if ($this.text() == "" || $this.text() == "null") {
						$this.text($this.data("orig-text"));
					}
				}
			}
			
			$this.focus(function(){
				var focusText = $this.text();

				$this.addClass("sf-focus");
				
				settings.onStart.apply(this,[$(this),focusText]);
				
			});
			
			$this.blur(function(){
				var blurText = $this.text();
				
				$this.removeClass("sf-focus");
				$this.addClass("sf-blur");
				
				settings.onExit.apply(this,[$(this),blurText]);
				
				if (settings.store) {
					settings.beforeSave.apply(this,[$(this),blurText]);
					localStorage.setItem(settings.storageKey,$this.text());
					cookie.set(settings.storageKey,$this.text());
					settings.afterSave.apply(this,[$(this),blurText]);
				}

				$this.attr("data-orig-text",$this.text());
				
				$this.removeClass("sf-blur");
			});
		});
	};

})(jQuery);