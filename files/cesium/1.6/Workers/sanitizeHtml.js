/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2015 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
!function(){define("Core/defined",[],function(){"use strict";var e=function(e){return void 0!==e};return e}),define("Core/RuntimeError",["./defined"],function(e){"use strict";var r=function(e){this.name="RuntimeError",this.message=e;var r;try{throw new Error}catch(t){r=t.stack}this.stack=r};return r.prototype.toString=function(){var r=this.name+": "+this.message;return e(this.stack)&&(r+="\n"+this.stack.toString()),r},r}),define("Core/freezeObject",["./defined"],function(e){"use strict";var r=Object.freeze;return e(r)||(r=function(e){return e}),r}),define("Core/defaultValue",["./freezeObject"],function(e){"use strict";var r=function(e,r){return void 0!==e?e:r};return r.EMPTY_OBJECT=e({}),r}),define("Core/formatError",["./defined"],function(e){"use strict";var r=function(r){var t,n=r.name,i=r.message;t=e(n)&&e(i)?n+": "+i:r.toString();var s=r.stack;return e(s)&&(t+="\n"+s),t};return r}),define("Workers/createTaskProcessorWorker",["../Core/defaultValue","../Core/defined","../Core/formatError"],function(e,r,t){"use strict";var n=function(n){var i,s=[],o={id:void 0,result:void 0,error:void 0};return function(a){var c=a.data;s.length=0,o.id=c.id,o.error=void 0,o.result=void 0;try{o.result=n(c.parameters,s)}catch(u){o.error=u instanceof Error?{name:u.name,message:u.message,stack:u.stack}:u}r(i)||(i=e(self.webkitPostMessage,self.postMessage)),c.canTransferArrayBuffer||(s.length=0);try{i(o,s)}catch(u){o.result=void 0,o.error="postMessage failed with error: "+t(u)+"\n  with responseMessage: "+JSON.stringify(o),i(o)}}};return n}),define("Workers/sanitizeHtml",["../Core/defined","../Core/RuntimeError","./createTaskProcessorWorker"],function(e,r,t){"use strict";var n,i="https://caja.appspot.com/html-css-sanitizer-minified.js",s=function(t){if(!e(n)&&(self.window={},importScripts(i),n=window.html_sanitize,!e(n)))throw new r("Unable to load Google Caja sanitizer script.");return n(t)};return t(s)})}();