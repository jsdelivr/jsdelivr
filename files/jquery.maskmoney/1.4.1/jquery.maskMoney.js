/*
* @Copyright (c) 2011 Aurélio Saraiva, Diego Plentz
* @Page http://github.com/plentz/jquery-maskmoney
* try at http://plentz.org/maskmoney

* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/*
* @Version: 1.4.1
* @Release: 2011-11-01
*/
(function($) {
	$.fn.maskMoney = function(settings) {
		settings = $.extend({
			symbol: 'US$',
			showSymbol: false,
			symbolStay: false,
			thousands: ',',
			decimal: '.',
			precision: 2,
			defaultZero: true,
			allowZero: false,
			allowNegative: false
		}, settings);

		return this.each(function() {
			var input = $(this);
			var dirty = false;

			function markAsDirty() {
				dirty = true;
			}

			function clearDirt(){
				dirty = false;
			}

			function keypressEvent(e) {
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return false; //needed to handle an IE "special" event
				if (input.attr('readonly') && (k!=13&&k!=9)) return false; // don't allow editing of readonly fields but allow tab/enter

				if (k<48||k>57) { // any key except the numbers 0-9
					if (k==45) { // -(minus) key
						markAsDirty();
						input.val(changeSign(input));
						return false;
					} else if (k==43) { // +(plus) key
						markAsDirty();
						input.val(input.val().replace('-',''));
						return false;
					} else if (k==13||k==9) { // enter key or tab key
						if(dirty){
							clearDirt();
							$(this).change();
						}
						return true;
					} else if (k==37||k==39) { // left arrow key or right arrow key
						return true;
					} else { // any other key with keycode less than 48 and greater than 57
						preventDefault(e);
						return true;
					}
				} else if (input.val().length>=input.attr('maxlength')) {
					return false;
				} else {
					preventDefault(e);

					var key = String.fromCharCode(k);
					var x = input.get(0);
					var selection = input.getInputSelection(x);
					var startPos = selection.start;
					var endPos = selection.end;
					x.value = x.value.substring(0, startPos) + key + x.value.substring(endPos, x.value.length);
					maskAndPosition(x, startPos + 1);
					markAsDirty();
					return false;
				}
			}

			function keydownEvent(e) {
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return false; //needed to handle an IE "special" event
				if (input.attr('readonly') && (k!=13&&k!=9)) return false; // don't allow editing of readonly fields but allow tab/enter

				var x = input.get(0);
				var selection = input.getInputSelection(x);
				var startPos = selection.start;
				var endPos = selection.end;

				if (k==8) { // backspace key
					preventDefault(e);

					if(startPos == endPos){
						// Remove single character
						x.value = x.value.substring(0, startPos - 1) + x.value.substring(endPos, x.value.length);
						startPos = startPos - 1;
					} else {
						// Remove multiple characters
						x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
					}
					maskAndPosition(x, startPos);
          markAsDirty();
					return false;
				} else if (k==9) { // tab key
					if(dirty) {
						$(this).change();
						clearDirt();
					}
					return true;
				} else if (k==46||k==63272) { // delete key (with special case for safari)
					preventDefault(e);
					if(x.selectionStart == x.selectionEnd){
						// Remove single character
						x.value = x.value.substring(0, startPos) + x.value.substring(endPos + 1, x.value.length);
					} else {
						//Remove multiple characters
						x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
					}
					maskAndPosition(x, startPos);
					markAsDirty();
					return false;
				} else { // any other key
					return true;
				}
			}

			function focusEvent(e) {
				var mask = getDefaultMask();
				if (input.val()==mask) {
					input.val('');
				} else if (input.val()==''&&settings.defaultZero) {
					input.val(setSymbol(mask));
				} else {
					input.val(setSymbol(input.val()));
				}
				if (this.createTextRange) {
					var textRange = this.createTextRange();
					textRange.collapse(false); // set the cursor at the end of the input
					textRange.select();
				}
			}

			function blurEvent(e) {
				if ($.browser.msie) {
					keypressEvent(e);
				}

				if (input.val()==''||input.val()==setSymbol(getDefaultMask())||input.val()==settings.symbol) {
					if(!settings.allowZero) input.val('');
					else if (!settings.symbolStay) input.val(getDefaultMask());
					else input.val(setSymbol(getDefaultMask()));
				} else {
					if (!settings.symbolStay) input.val(input.val().replace(settings.symbol,''));
					else if (settings.symbolStay&&input.val()==settings.symbol) input.val(setSymbol(getDefaultMask()));
				}
			}

			function preventDefault(e) {
				if (e.preventDefault) { //standard browsers
					e.preventDefault();
				} else { // internet explorer
					e.returnValue = false
				}
			}

			function maskAndPosition(x, startPos) {
				var originalLen = input.val().length;
				input.val(maskValue(x.value));
				var newLen = input.val().length;
				startPos = startPos - (originalLen - newLen);
				input.setCursorPosition(startPos);
			}

			function maskValue(v) {
				v = v.replace(settings.symbol,'');

				var strCheck = '0123456789';
				var len = v.length;
				var a = '', t = '', neg='';

				if(len!=0 && v.charAt(0)=='-'){
					v = v.replace('-','');
					if(settings.allowNegative){
						neg = '-';
					}
				}

				if (len==0) {
					if (!settings.defaultZero) return t;
					t = '0.00';
				}

				for (var i = 0; i<len; i++) {
					if ((v.charAt(i)!='0') && (v.charAt(i)!=settings.decimal)) break;
				}

				for (; i<len; i++) {
					if (strCheck.indexOf(v.charAt(i))!=-1) a+= v.charAt(i);
				}

				var n = parseFloat(a);
				n = isNaN(n) ? 0 : n/Math.pow(10,settings.precision);
				t = n.toFixed(settings.precision);

				i = settings.precision == 0 ? 0 : 1;
				var p, d = (t=t.split('.'))[i].substr(0,settings.precision);
				for (p = (t=t[0]).length; (p-=3)>=1;) {
					t = t.substr(0,p)+settings.thousands+t.substr(p);
				}

				return (settings.precision>0)
					? setSymbol(neg+t+settings.decimal+d+Array((settings.precision+1)-d.length).join(0))
					: setSymbol(neg+t);
			}

			function mask() {
				var value = input.val();
				input.val(maskValue(value));
			}

			function getDefaultMask() {
				var n = parseFloat('0')/Math.pow(10,settings.precision);
				return (n.toFixed(settings.precision)).replace(new RegExp('\\.','g'),settings.decimal);
			}

			function setSymbol(v) {
				if (settings.showSymbol) {
					if (v.substr(0, settings.symbol.length) != settings.symbol) return settings.symbol+v;
				}
				return v;
			}

			function changeSign(i){
				if (settings.allowNegative) {
					var vic = i.val();
					if (i.val()!='' && i.val().charAt(0)=='-'){
						return i.val().replace('-','');
					} else{
						return '-'+i.val();
					}
				} else {
					return i.val();
				}
			}

			input.bind('keypress.maskMoney',keypressEvent);
			input.bind('keydown.maskMoney',keydownEvent);
			input.bind('blur.maskMoney',blurEvent);
			input.bind('focus.maskMoney',focusEvent);
			input.bind('mask', mask);

			input.one('unmaskMoney',function() {
				input.unbind('.maskMoney');

				if ($.browser.msie) {
					this.onpaste= null;
				} else if ($.browser.mozilla) {
					this.removeEventListener('input',blurEvent,false);
				}
			});
		});
	}

	$.fn.unmaskMoney=function() {
		return this.trigger('unmaskMoney');
	};

	$.fn.mask=function() {
		return this.trigger('mask');
	};

	$.fn.setCursorPosition = function(pos) {
		this.each(function(index, elem) {
			if (elem.setSelectionRange) {
				elem.focus();
				elem.setSelectionRange(pos, pos);
			} else if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		});
		return this;
	};

	$.fn.getInputSelection = function(el) {
		var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

		if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
			start = el.selectionStart;
			end = el.selectionEnd;
		} else {
			range = document.selection.createRange();

			if (range && range.parentElement() == el) {
				len = el.value.length;
				normalizedValue = el.value.replace(/\r\n/g, "\n");

				// Create a working TextRange that lives only in the input
				textInputRange = el.createTextRange();
				textInputRange.moveToBookmark(range.getBookmark());

				// Check if the start and end of the selection are at the very end
				// of the input, since moveStart/moveEnd doesn't return what we want
				// in those cases
				endRange = el.createTextRange();
				endRange.collapse(false);

				if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
					start = end = len;
				} else {
					start = -textInputRange.moveStart("character", -len);
					start += normalizedValue.slice(0, start).split("\n").length - 1;

					if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
						end = len;
					} else {
						end = -textInputRange.moveEnd("character", -len);
						end += normalizedValue.slice(0, end).split("\n").length - 1;
					}
				}
			}
		}

		return {
			start: start,
			end: end
		};
	}
})(jQuery);
