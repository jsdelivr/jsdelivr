/*! Qoopido.js library 3.7.0, 2015-07-23 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(e){window.qoopido.register("worker",e,["./base","./support","./promise/defer"])}(function(e,t,s,n,r,o,p){"use strict";var u=e["promise/defer"],i=new RegExp("Blob$","i"),a=e.support.supportsMethod("Worker"),c=e.support.supportsMethod("URL")?r[e.support.getMethod("URL")]:null,l=e.support.getMethod("Blob")||e.support.getMethod("BlobBuilder"),f="var self = this, regex = new RegExp(',\\s+', 'g'); self.addEventListener('message', function(pEvent) { self.postMessage({ type: 'result', result: self.process(pEvent.data.func).apply(null, pEvent.data.args)}); }, false); self.postProgress = function(pProgress) { self.postMessage({ type: 'progress', progress: pProgress}); }; self.process = function(pFunction) { var functionArguments = pFunction.substring(pFunction.indexOf('(') + 1, pFunction.indexOf(')')).replace(regex, ',').split(','); functionArguments.push(pFunction.substring(pFunction.indexOf('{') + 1, pFunction.lastIndexOf('}'))); return Function.apply(null, functionArguments); };",g=null;return a&&c&&l&&(g=c.createObjectURL(i.test(l)===!0?new r[l]([f],{type:"text/javascript"}):(new r[l]).append(f).getBlob("text/javascript"))),e.base.extend({execute:function(e,t){var s=new u;if(t=t||[],g){var n=new Worker(g);n.addEventListener("message",function(e){switch(e.data.type){case"result":s.resolve(e.data.result)}},!1),n.addEventListener("error",function(e){s.reject(e)},!1),n.postMessage({func:e.toString(),args:t})}else setTimeout(function(){try{s.resolve(e.apply(null,t))}catch(n){s.reject()}},0);return s.promise}})});