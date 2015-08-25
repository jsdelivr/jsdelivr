/**
 * console for js.js 
 */
window.onerror = function(msg, url, line){
	console.error(msg+'\n'+url+' on line : '+line);
};


var console = (function(undefined){
	var $builded
	  , $wrap
	  , $ol
	  , $li = []
	  
	  , $time = {}
	  ;
	  
	build();
	
	return {
		log : log
	  , error: error
	  , time : time
	  , timeEnd : timeEnd
	  , group : group
	  , groupEnd : groupEnd
	};
	
	function ready(method){
		return function(){
			$ready.push([method, arguments]);
		};
	}
	
	function build(){
		if(!/interative|complete/.test(document.readyState))
			return setTimeout(build);

		$wrap = document.createElement('div');
		with($wrap.style){
			font = '12pt consolas';
			position = 'absolute';
			bottom = 0;
			left = 0;		
			width = '100%';
			height = '300px';
			overflow = 'scroll';
			textAlign = 'left';
			zIndex = 99999;
			backgroundColor = 'white';
		}
		$ol = document.createElement('ol');
		$ol.innerHTML = $li.join('');
		$li = null;

		$wrap.appendChild($ol); 
		document.body.appendChild($wrap);
		
		$builded = true;
	}
	
	function analyze(value, depth){
		depth = depth || 0;
		if(depth>2)
			return value;
		
		var type = typeof value;
		
		if(value){
			if(value == window){
				return 'window';
			}else if(value == document){
				return 'document';				
			}else if(Object.prototype.toString.call(value) === '[object Array]'){
				for(var i=0, c=value.length, result=[]; i<c; i++){
					result.push(analyze(value[i], depth++));
				}
				return '['+result.join(', ')+']';

			}else if(type == 'function'){
				return 'function(){}';
			}else if(type == 'boolean'){
				return value ?
					'true' :
					'false';
			}else if(value === null){
				return 'null';
			}else if(value === undefined){
				return 'undefined';
			}else if(value.tagName){
				return '<'+value.tagName.toLowerCase()+'>';
			}else if(type == 'object'){
				var i
				  , result = []
				  ;
				var max = 10;
				for(i in value){
					if(max--){
					result.push(i+':'+analyze(value[i], depth++));
					}else{
						result.push('...');
						break;
					}
				}
				return '{'+result.join('<br>')+'}';
			}
		}
		return value;
	}
	
	function log(){
		for(var i=0, c=arguments.length, result=[]; i<c; i++)
			result.push(analyze(arguments[i]));
		result = result.join(', ');
		
		if($builded){
			var li = document.createElement('li');
			li.innerHTML = result;
			$ol.appendChild(li);
		}else{
			$li.push('<li>'+result+'</li>');
		}
	}
	
	function error(){
		for(var i=arguments.length; i--;)
			arguments[i] = '<span style="color:red;">'+arguments[i]+'</span>';
		log.apply(this, arguments);
	}
	
	function time(key){
		$time[key] = (new Date).getTime();
	}
	
	function timeEnd(key){
		if($time[key]){
			log(key+': '+((new Date).getTime()-$time[key]));
			delete $time[key];
		}
	}
	
	function group(){
		
	}
	
	function groupEnd(){
	}
})();
