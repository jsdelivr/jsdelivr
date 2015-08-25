/**
 * js.drama.js
 * create element animate
 * @param {Object} story
 * @param {Object} more story
 * @return js.js
 */
js.add.drama = function(keyframes){
    return (js.add.drama = (function(Object, Number, Math, undefined){
    	var $timer = []
    	  , $target = []
    	  , $defaultFrame = {
	    		rate: 60
	    	  , till: 1
	    	  , from: {}
	    	  , type: 'quad'
	    	  , ease: 'in'
    		}
    	  , _unit = /\-?\d+(?:\.\d+)*([a-z%]+)?/
    	  , _colorProp = /color/i
    	  , _colorValue = /(\#[\da-f]+)|(rgb\(.+\))|([a-z]+)/i
    	  , _rgb = /(\d+)/g
    	  
    	  , $zip = {
    	  		font : [
    	  			'fontWeight'
    	  		  , 'fontSize'
    	  		  , 'lineHeight'
    	  		]
    	  	  , background : [
    	  	  		'backgroundColor'
    	  	  	  , 'backgroundPosition'
    	  	  ]
    	  	  , border : [
    	  	  		'borderColor'
    	  	  	  , 'borderWidth'
    	  	  ]
    	  	  , borderTop : [
    	  	  		'borderTopColor'
    	  	  	  , 'borderTopWidth'
    	  	  ]
    	  	  , borderRight : [
    	  	  		'borderBottomColor'
    	  	  	  , 'borderBottomWidth'
    	  	  ]
    	  	  , borderBottom : [
    	  	  		'borderTopColor'
    	  	  	  , 'borderTopWidth'
    	  	  ]
    	  	  , borderLeft : [
    	  	  		'borderleftColor'
    	  	  	  , 'borderleftWidth'
    	  	  ]
    	  	}
    	  ;	
        return function(frame){
        	if(!frame.hasOwnProperty('to'))
        		frame = {to:frame};
			
        	var props = Object.keys(frame.to)
    		  , prop
    		  , unzip
    		  , i = props.length
    		  , j
    		  ;
		  	while(i--){
		  		prop = props[i];
		  		frame.to[prop] = js.computed(frame.to[prop]);
		  		if(unzip = $zip[prop]){
		  			delete frame.to[prop];
		  			j = unzip.length;
	  				while(j--)
	  					frame.to[prop = unzip[j]] = js.computed(prop);
		  		}
		  	}
		  	
		  	if(frame.from){
		  		props = Object.keys(frame.from);
		  		i = props.length;
		  		while(i--){
		  			if(unzip = $zip[prop]){
		  				js.computed()
		  			}
		  		}
		  	}
		  	
        	frame = Object.merge(frame, $defaultFrame);
        	frame.rate = Math.round(1000/frame.rate);
        	frame.till*= 1000;
        	frame.end = Math.floor(frame.till/frame.rate);
			frame.next = Object.toArray(arguments).slice(1);
			frame.type = choose(frame.type);
            return this.set(push, [frame]);
        };
        
        function push(node, frame){
    		for(var props = Object.keys(frame.to)
    			  , prop
	        	  , values = []
	        	  , value
	        	  , from
	        	  , to
	        	  , i=props.length
	        	  , rate = frame.rate
        		; i--;){
    			prop = props[i];
    			from = js.computed(prop, frame.from[prop] || this.css(prop));
    			to = frame.to[prop];
    			if(from!=to){
    				value = {};
    				
    				
    			}
    		}
    		
    		return;

    		if(!$target[rate]){
				$target[rate] = [];
    		}
    		  		
    		$target[rate].push(node);
    		
			node._jsDrama_ = {
    			frame: frame
    		  , values: values
    		  , index: 0
    		  , targetIndex: $target[rate].length-1
    		};    		
    		
    		if(!$timer[rate]){
    			$timer[rate] = setInterval(function(){
    				action(rate);
    			}, rate);
    		}
        }
               			        
        function gradation(from, to, steps){
        	return (gradation = (function(){
        		return function(from, to, steps){
					from = split(from);
	        		to = split(to);

		        	var r = (to[0] - from[0]) / steps
		        	  , g = (to[1] - from[1]) / steps
		        	  , b = (to[2] - from[2]) / steps
		        	  , result = []
		        	  ;
		        	
		        	for(var i=1, round=Math.round; i<steps; i++){
		        		result.push(
		        			'rgb'
		        		  + '('+round(from[0] + (r * i))
		        		  + ','+round(from[1] + (g * i))
		        		  + ','+round(from[2] + (b * i))
		        		  + ')'       			
		        		);
		        	}
		        	result.push('rgb('+to.join(',')+')');
        			return result;
        		};	
        	})()).apply(this, arguments);
        	
			function split(value){
				var color = value.match(_colorValue);
				return color[1] ?
					color[1].length<5 ?
						[
							parseInt('0x'+(t=value.substr(1, 1))+t)
						  , parseInt('0x'+(t=value.substr(2, 1))+t)
						  , parseInt('0x'+(t=value.substr(3, 1))+t)
						] : [
							parseInt('0x'+value.substr(1, 2))
						  , parseInt('0x'+value.substr(3, 2))
						  , parseInt('0x'+value.substr(5, 2))
						] :
					color[2] ?
						[
							Number((value = color[2].match(_rgb))[0])
						  , Number(value[1])
						  , Number(value[2])
						] :
						split(named(color[3]));
			}
			
        	function named(value){
        		return (named = js.user.ie ?
        			(function(){
        				var $area = js('<textarea>')
        					.to(document.body)
        					.css('disaction', 'none')
        					;        				
        				return function(color){
	        				var value  = $area.css('color', color)[0]
								.createTextRange()
								.queryCommandValue('ForeColor')
								;
							value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
							return '#' + ('000000' + value.toString(16)).slice(-6);	
        				};
        			})() :
        			function(value){
        				return js.computed('background-color', value);
        			}
        		).apply(this, arguments);
        	}
        }
        
        function action(rate){
        	var target = $target[rate]
        	  , i = target.length
        	  , node
        	  , store
        	  , frame
        	  , values
        	  , index
        	  , end
        	  , j
        	  ;
        	if(i==0){
        		clearInterval($timer[rate]);
        		$timer[rate] = null;
        		return;
        	}
			while(i--){
				node = target[i];
				store = node._jsDrama_;
				frame = store.frame;
				values = store.values;
				index = store.index++;
				end = frame.end;
				if(index==end){
					for(j=values.length; j--;){
						prop = values[--j];
						setBasic(node, prop, frame.to[prop]);
					}

					$target[rate].splice(store.target, 1);
					
					frame.turn &&
						frame.turn();
						
					node._jsDrama_ = null;
				}else{
					progress = index / end;
					
					delta = frame.ease == 'in' ?
				 		frame.type(progress, frame.x) :
				 		frame.ease == 'out' ?
				 			1 - frame.type(1 - progress, frame.x) :
				 			progress > 0.5 ?
				 				(2 - frame.type(2 * (1 - progress))) / 2 :
				 				frame.type(2 * progres) / 2;
					
		        	for(j=values.length; j--;){
		        		value = values[j--];
		        		prop = values[j];
		        		
		        		if(prop=='disaction'){
		        			if(j==0){
		        				setBasic(node, prop, value);
		        			}
		        		}else{
		        			value2 = value.to ?
		        				value.to * delta :
		        				value.from * (1 - delta);
		        			
		        			value2 = Math.round(value2 * 10) / 10;
		        			
		        			setBasic(node, prop, value2 + value.unit);
		        		}
		        	}					
				}
			}
        }

        function setBasic(node, prop, value){
        	js(node).css(prop, value);
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
        
        // animation timing function
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
    })(Object, Number, Math)).apply(this, arguments);
};