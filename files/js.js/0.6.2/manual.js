js(function(printTarget){
	/*
	 * create js.js document to manual
	 */
	var $targets = []
	  , _args = /function \(([^\)]+)\)/
      , _arg = /(\w+)/g	
		;
		
	var _dl = [];
	
	return print();
	
	function print(printTarget){
		var wrap = 'div.jsDoc'.tag()
		  , ul = 'ul'.tag()
		  , div = 'div'.tag()
		  ;
		
		wrap.appendChild(ul);
		wrap.appendChild(div);
		
		var targets = [
			{object: Array   , label: 'Array'}
		  , {object: Boolean , label: 'Boolean'}
		  , {object: Date    , label: 'Date'}
		  , {object: Function, label: 'Function'}
		  , {object: Number  , label: 'Number'}
		  , {object: Object  , label: 'Object'}
		  , {object: RegExp  , label: 'RegExp', start: 'upper'}
		  , {object: String  , label: 'String'}
		  , {object: js      , label: 'js', extendLabel: 'js(selector)'}
		];
		
		var i = 0
		  , c= targets.length
		  , target
		  ;
		for(;i<c;i++){
			target = targets[i];
			$targets.push(target);
			addTarget(target);
		}
		
		var li = [];
		var dl = [];
		for(i=0; i<$targets.length;i++){
			target = $targets[i];
			object = target.object;
			label = target.label;
			href = label.replace(' ', '_');
			
			li.push('<li><a href="#'+label+'">'+label+'</a></li>');
			_dl.push(
				'<div class="group" id="'+href+'">'
			  , '<h2>'+label+'</h2>'
			);
			isMeaningless(object) ||
				pushDlContent(target, object);
			props = Object.keys(object);
			started = false;
			for(j=0, d=props.length; j<d; j++){
				prop = props[j];
				
				if(!target.start || target.start == prop)
					started = true;
				
				if(!started || prop == 'add')
					continue;
					
				subObject = object[prop];
				
				pushDlContent(target, object, prop);			
			}
			_dl.push('</div>');
		}
		
		ul.innerHTML = li.join('\n');
		div.innerHTML = _dl.join('\n');
		
		(printTarget || document.body).appendChild(wrap);
	};
	
	function addTarget(target){
		var object = target.object;

		if(!Function.test(object))
			return;
	
		if(object.add){
			if(object.js){
				$targets.push({
					object: object.add
				  , label: target.extendLabel || target.label+'.js'
				  , extendLabel: null
				});
			}else{
				$targets.push({
					object: object.add
				  , label: target.label + '.prototype'
				  , extendLabel: null
				});
			}
		}
	}
	
	function isMeaningless(object){
		var code = object.toString();
		return !code.length ||
			code.indexOf('native code')>-1 ||
				code.indexOf('object Object')>-1;
	}
	
	function pushDlContent(target, object, prop){
		if(prop){
			var subObject = object[prop];
			dt = span('prefix', target.label) + '.' + span('name', prop);
		}else{
			var subObject = object;
			dt = span('name', target.label);
		}
		dd = subObject.toString();
		
		if(Function.test(subObject)){
			if(isMeaningless(subObject))
				return;
				
			dt+='('+getArgs(subObject)+')';
			dd = dd.indexOf('this.set')>-1 ?
				dd.indexOf('this.get')>-1 ?
					'chained js object || any results' :
					'chained js object' :
				'any results'; 
		}else if(subObject.charAt || Number.test(subObject)){
			dd = span('string', dd);
		}else if(RegExp.test(subObject)){
			dd = span('regexp', dd);
		}
		
		var code = subObject.toString()
			.replace(/</g, '&lt;')
			.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
			.replace(/\n/g, '<br>')
			;
		
		_dl.push(
			'<dl>'
		  , '<dt>' + dt +  '</dt>'
		  , '<dd class="result">' + dd + '</dd>'
		  //, '<dd class="source">' + code + '</dd>'
		  ,'</dl>'
		);
		
		if(prop){
			addTarget({
				object: subObject
			  , label: target.label + '.' + prop
			});		
		}		
	}
	
	function getArgs(method){
		return method.length ?
			span('arg', method.toString().match(_args)[1]) :
			'';
	}
	
	function span(className, value){
		return '<span class="'+className+'">'+value+'</span>';
	}
})();