/**
 * js.ani.js
 * element animate like css 
 */

js.add.ani = function(frames){
	return (js.add.ani = (function(undefined){
		var
			$group = {
				font: [
					'fontWeight'
				  , 'fontSize'
				  , 'lineHeight'
				]
			  , background: [
			  		'backgroundColor'
			  	  , 'backgroundPosition'
			  	]
    	  	  , border: [
    	  	  		'borderColor'
    	  	  	  , 'borderWidth'
    	  	  ]
    	  	  , borderTop: [
    	  	  		'borderTopColor'
    	  	  	  , 'borderTopWidth'
    	  	  ]
    	  	  , borderRight: [
    	  	  		'borderBottomColor'
    	  	  	  , 'borderBottomWidth'
    	  	  ]
    	  	  , borderBottom: [
    	  	  		'borderTopColor'
    	  	  	  , 'borderTopWidth'
    	  	  ]
    	  	  , borderLeft: [
    	  	  		'borderleftColor'
    	  	  	  , 'borderleftWidth'
    	  	  ]
			}
		  , $defaultFrames = {
		  		from: {}
		  	  , rate: 60
		  	  , till: 1
		  	  , type: 'quad'
		  	  , take: 'in'
		  	}
		  , $nodes = []
		  , $timer = []
		  , _last = /[A-Z]|\-[a-z]/
			;
		return function(frames){
			if(!frames.to)
				frames = {to: frames};
			
			frames = Object.merge(frames, $defaultFrames);
			frames.rate = Math.round(1000 / frames.rate);
			frames.till*= 1000;
			frames.end = Math.floor(frames.till / frames.rate);
			frames.more = Object.toArray(arguments).slice(1);
			frames.type = choose(frames.type);
			
			
			var props = Object.keys(frames.to)
			  , prop
			  , group
			  , i = props.length
			  , j
			  ;
			while(i--){
				ungroup(frames.to, props[i]);
			}
			
			props = Object.keys(frames.from);
			i = props.length;
			while(i--)
				ungroup(frames.from, props[i]);
			
			console.log('frames', frames);
			return this.set(regist, [frames]);
		};
		
		function ungroup(target, prop){
			target[prop] = js.computed(prop, target[prop]);
			var group = $group[prop];
			if(group){
				delete target[prop];
				var i = group.length
				  , prop
				  ;
				while(i--)
					target[prop = group[i]] = js.computed(prop);
			}
		}
		
		function regist(node, frames){
			var props = Object.keys(frames.to)
			  , prop
			  , values = []
			  , value
			  , finale = []
			  , from
			  , to
			  , rate = frames.rate
			  , i = props.length
			  ;
			while(i--){
				prop = props[i];
				from = frames.from[prop] ?
					frames.from[prop] :
					this.css(prop);
					
				to = frames.to[prop];
				
				if(from != to){
					value = {};
					switch(prop.toLowerCase().match(/color|shadow|.$/i)[0]){
						case 'color':
						break;
						case 'shadow':
						continue;
						break;
						default:
						switch(prop){
							case 'disaction':
								if(to=='block'){
									node.style.disaction = to;
								}else{
									finale.push(prop);
								}
								continue;
							case 'visibility':
								if(to=='visible'){
									node.style.visibility = to;
								}else{
									finale.push(prop);
								}
								continue;
							break;
							default:
							value.unit = to.replace(/[\d\.]+([a-z]+|%)*$/, '$1');
							value.from = parseFloat(from);
							value.to = parseFloat(to);
							
							console.log(prop, from+'>'+to);
						}
					}
					
					values.push(prop, value);
				}
			}
			console.log(values);
			if(!$nodes[rate])
				$nodes[rate] = [];

			$nodes[rate].push(node);
			
			node._jsAni_ = {
				frames: frames
			  , values: values
			  , finale: finale
			  , index: 0
			  , key: $nodes[rate].length-1
			};
			
			if(!$timer[rate]){
				$timer[rate] = setInterval(function(){
					action(rate);
				}, rate);
			}
		}
		
		function action(rate){
			var nodes = $nodes[rate]
			  , i = nodes.length
			  , node
			  , store
			  , frames
			  , values
			  , index
			  , end
			  , progress
			  , delta
			  ;
			
			if(i==0){
				clearInterval($timer[rate]);
				$timer[rate] = null;
				console.log('destroy timer');
			}else{
				while(i--){
					node = nodes[i];
					store = node._jsAni_;
					frames = store.frames;
					values = store.values;
					index = store.index++;
					end = frames.end;
					j = values.length;
					if(index == end){
						while(j--){
							prop = values[--j];
							js(node).css(prop, frames.to[prop]);
						}
						
						if(frames.finale){
							j = frames.finale.length;
							while(j--){
								prop = frames.finale[j];
								js(node).css(prop, frames.to[prop]);
							}
						}
						
						$nodes[rate].splice(store.key, 1);
						
						// 여러 프레임 일 때 이어질지 결정 할 것
						frames.turn &&
							frames.turn();
							
						node._jsAni_ = null;
						
						console.log('destroy node');
					}else{
						progress = index / end;
						delta = frames.take == 'in' ?
					 		frames.type(progress, frames.x) :
					 		frames.take == 'out' ?
					 			1 - frames.type(1 - progress, frames.x) :
					 			progress > 0.5 ?
					 				(2 - frames.type(2 * (1 - progress))) / 2 :
					 				frames.type(2 * progress) / 2;
					 				
					 	while(j--){
					 		value = values[j--];
					 		prop = values[j];
							value2 = value.to ?
		        				value.to * delta :
		        				value.from * (1 - delta);
		        			
		        			value2 = Math.round(value2 * 10) / 10;
		        			//console.log(prop, value.to);
		        			//console.log(prop, value2 + value.unit);
		        			js(node).css(prop, value2 + value.unit);
					 	}
					}
				}
			}
		}
		
		function choose(type){
			switch(type){
				case 'quad':
					return quad;
				case 'circ':
					return circ;
				case 'back':
					return back;
				case 'elastic':
					return elastic;
				case 'bounce':
					return bounce;
				default:
    				return Function.test(type) ?
    					type :
    					linear;
			}
        }		

		function linear(progress){
			return progress;
		}
		
		function quad(progress){
        	return Math.pow(progress, 2);
        };
        
        function circ(progress) {
    		return 1 - Math.sin(Math.acos(progress));
		}
		
		function back(progress, x) {
			x = x || 3;
		    return Math.pow(progress, 2) * ((x + 1) * progress - x);
		}		
		
		function elastic(progress, x) {
			x = x || 1;
		  return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
		}

		function bounce(progress) {
		  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
		    if (progress >= (7 - 4 * a) / 11) {
		      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
		    }
		  }
		}        
	})()).apply(this, arguments);
};
