YUI.add("gallery-alea",function(e,t){
/*!
based on Alea.js and Mash.js.
Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function(e){"use strict";var t=4294967296,n=2.3283064365386963e-10,r=" ",i=e.Array,s=i.each,o=e.Lang.isArray,u=e.Lang.now,a=function(e){var t=1,f=a._mash(),l=f(r),c=f(r),h=f(r);e=o(e)?e:i(arguments),e.length||e.push(u()),s(e,function(e){l-=f(e),l<0&&(l+=1),c-=f(e),c<0&&(c+=1),h-=f(e),h<0&&(h+=1)}),this.random=function(){var e=2091639*l+t*n;return t=e|0,l=c,c=h,h=e-t,h}};a.prototype={fract53:function(){var e=this.random;return e()+(e()*2097152|0)*1.1102230246251565e-16},uint32:function(){return this.random()*t}},a._mash=function(){var e=4022871197;return function(r){r=r.toString();var i,s=0,o=r.length;for(;s<o;s+=1)e+=r.charCodeAt(s),i=.02519603282416938*e,e=i>>>0,i-=e,i*=e,e=i>>>0,i-=e,e+=i*t;return(e>>>0)*n}},e.Alea=a})(e)},"gallery-2013.05.02-22-59");
