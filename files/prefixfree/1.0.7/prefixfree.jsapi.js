/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

 /* Author Dmitry Baranovskiy */

(function (self) {
	var prefix = self.Prefix.toLowerCase(),
		prefixrg = new RegExp("^" + prefix, "i");
	function extend(ob) {
		for (var name in ob) {
			if (~name.search(prefixrg)) {
				ob[name.charAt(prefix.length).toLowerCase() + name.substring(prefix.length + 1)] = ob[name];
			}
		}
		if (ob.addEventListener) {
			(function (add, remove) {
				ob.addEventListener = function (name, handler, bubble) {
					add.call(this, name, handler, bubble);
					add.call(this, prefix + name, handler, bubble);
				};
				ob.removeEventListener = function (name, handler) {
					remove.call(this, name, handler);
					remove.call(this, prefix + name, handler);
				};
			})(ob.addEventListener, ob.removeEventListener);
		}
	}

	// This function digs through the objects in order to find out which have prefixed methods and therefore, which need to be extended.
	function dig(o, namerg) {
		var os = [],
			out;
		function digger(o, namerg, res) {
			o = o || this;
			res = res || [];
			for(var i = 0; i < res.length; i++) {
				if(o === res[i]) {
					return res;
				}
			}
			os.push(o);
			try{
				for(var name in o);
			} catch(e) {
				return [];
			}
			var inside,
				clean = true;
			for(name in o) {
				if(clean && o.hasOwnProperty(name) && name.match(namerg)) {
					res.push(o);
					clean = false;
				}
				var isObject = false;
				try{
					isObject = o[name] === Object(o[name]) && typeof o[name] != "function";
				} catch(e) {}
				if(isObject) {
					inside = false;
					for (i = 0, ii = os.length; i < ii; i++) {
						if (os[i] == o[name]) {
							inside = true;
							break;
						}
					}
					if (!inside) {
						digger(o[name], namerg, res);
					}
				}
			}
			return res;
		}
		out = digger(o, namerg);
		os = null;
		return out;
	}

	var objects2extend = dig(this, new RegExp("^" + prefix));

	for(var i = 0, ii = objects2extend.length; i < ii; i++) {
		extend(objects2extend[i]);
	}
})(window.PrefixFree);
