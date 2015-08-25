js.add.fadein = function(max){
	this.css('opacity', 0);
	return this.ani({
		to: {
			opacity: max || 1
		}
	  , till: 0.5
	});
};

js.blind = function(disaction, option){
	return (js.blind = (function(){
		var $blind
		  , $on = {
				to: {
					opacity: 0.5
				  , disaction:'block'
					  , boxShadow:'10px 10px 5px black'
					  , font:'12px gulim, nanumgothic'				  
				}
			  , till: 0.3
			}
			
	  	  , $off = {
				to:{
					opacity: 0
				  , disaction: 'none'
				}
			  , till:0.2
			}
		  ;
		return function(disaction, option){
			if(!$blind){
				js.body().append('<div id="jsBlind"></div>');
				$blind = js('#jsBlind');
				$blind.css('opacity', 0);
			}

			if(!Boolean.test(disaction)){
				option = disaction;
				disaction = true;
			}
			
			if(Function.test(option)){
				option = {turn: option};
			}
			
			$blind.ani(Object.merge(
				option
			  , disaction ?
				  	$on :
				  	$off
			));
		};
	})()).apply(this, arguments);
};

js.add.dial = function(message, option){
	return (js.add.dial = (function(){
		var $templet = '<div class="jsDial">'
				+ '<div class="jsDialWrap">'
					+ '<div class="jsDialContent"></div>'
					+ '<ul class="jsDialButton">'
					+ '<li class="ok"><a href="#jsDialOk">확인</a></li>'
					+ '<li class="cancel"><a href="#jsDialCancel">취소</a></li>'
					+ '</ul>'
					+ '</div>'
				+ '</div>'
		  , $index = 0
		  , $defaultSet = {
		  		type: 'alert'
		  	}
		  ;
		
		return function(message, option){
			if(option){
				option = Object.merge(
					option.constructor == Object ?
						option :
						{turn:option}
					, $defaultSet
				);

				if(option.turn && !Function.test(option.turn))
					option.turn = focus(option.turn);
			}else{
				option = $defaultSet;
			}
			this.set(set, [message, option]);
			return this;
		};
		
		function set(node, message, option){			
			var store = node._jsDial_;
			
			if(!store){				
				var id = 'jsDial'+($index++);
				this.append(js($templet).attr('id', id));			
				var store = {};
				store.div = js('#'+id, node);				
				store.wrap = js('.jsDialWrap', store.div);
				store.content = js('.jsDialContent', store.wrap);
				store.ok = js('.ok', store.wrap);
				store.ok.a = js('a', store.ok);
				store.ok[0]._jsDial_ = node;
				store.ok.click(ok);
				store.cancel = js('.cancel', store.wrap);
				
				store.turn = option.turn;
				
				store.tab = function(event){
					(!event || event.target == store.div[0]) &&
						store.ok.a.focus();
				};
				
				store.div.click(store.tab);
				
				node._jsDial_ = store;
			}
			if(option.type=='alert'){
				store.ok.show();
				js.body().hotkey('esc', function(){ok.call(store.ok[0])});
			}
			
			if(option.title){
				message = '<div class="jsDialTitle">' + option.title +'</div>' + message;
			}
			
			store.content.html(message);

			store.wrap.css(
				'marginTop', '0%'
			  , 'opacity', 0
			);
			store.div.show();
			
			js.blind(function(){
				store.wrap.ani({
					to:{
						marginTop:'10%'
					  , opacity:1
					}
				  , till:0.3
				  , type:'elastic'
				  , take:'out'
				  , turn: store.tab
				});		
			});
		}
			
		function ok(){
			var store = this._jsDial_._jsDial_;
			
			store.wrap.ani({
				to:{
					marginTop:0
				  , opacity:0
				}
			  , till: 0.3
			  , type: 'back'
			  , x: 5
			  , turn: function(){
			  		store.div.hide();
			  		js.blind(false, store.turn);
			  	}
			});
		}
		
		function focus(node){
			return function(){
				node.focus();
			};
		}
		
		function focusFirstButton(){
			
		}
	})()).apply(this, arguments);
};

js.dial = function(message, option){
	js.body().dial(message, option);
};

js.forms = (function(undeifned){
	var $forms
	  , $inputs
	  , $groups
	  
	  , $loadEvent = []
	  , $submitEvent = []
	  , $totalEvent = []
	  
	  , $type = {}
	  ;
	  
	js(build);

	var formReady = function(node){		
		this
			.attr('novalidate', true)
			.submit(formSubmit)
			;
	};
	
	formReady.add = {};
	formReady.type = $type;
	formReady.error = {};
	
	return formReady;

	function build(){	
		var i, set, j, d, on;
		for(i in formReady.add){
			set = formReady.add[i];
			if(Function.test(set))
				set = {work: set};

			if(!set.on)
				set.on = ['submit'];
			
			for(j=0, d=set.on.length; j<d; j++){
				on = set.on[j];
				switch(on){
					case 'submit':
						$submitEvent.push(set);
						break;
					case 'load':
						$loadEvent.push(set);
						break;
					default:
						$totalEvent.push(set);
				}
			}
		}
		delete formReady.add;

		$forms = js('form').set(formReady);
		$inputs = js('input, textarea').set(inputReady);
		$groups = js('.inputGroup').set(groupReady);
		
		for(i=0, c=$loadEvent.length; i<c; i++)
			$loadEvent[i].work($forms, $inputs);
	}
		
	function inputReady(node){
		this.change(inputSubmit);
	}
	
	function groupReady(){
		
	}
	
	function formSubmit(event){

		for(var nodes = this.elements
			  , i = 0
			  , c = nodes.length
			  , node
		  ; i<c; i++){
			if(inputSubmit.call(nodes[i])===false)
				return false;
		}

		console.log('valid');
		return false;
	}
	
	function inputSubmit(event){
		var value = this.value
		  , type = this.type
		  ;
		for(var i=0, c=$submitEvent.length; i<c; i++){
			set = $submitEvent[i];
			target = this.getAttribute(set.target);
			if(target===null ||
					(set.match && set.match != target) ||
						(set.off && set.off == type) ||
							(!set.always && !value)
			)
				continue;
			
			if(error = set.work.call(this, js(this), target, value))
				return unvalid(this, error);
		}
		return true;
	}
	
	function unvalid(node, message){
		if(Array.test(message)){
			var replaces = message;
			message = formReady.error[replaces[0]];
			for(var i=1, c=replaces.length; i<c; i+=2){
				message = message.replace('$'+replaces[i], replaces[i+1]);
			}
		}
		/*
		var label = js(node).parent('label');
		if(label){
			label = label.innerHTML.replace(':', '');
			message =  label + ': ' + message;
		}
		*/
		js.dial(message, {
			title:'폼 작성 오류'
		  , turn:node
		});
		
		return false;
	}
})();

js.forms.error = {
	required : '필수 항목을 입력 하십시오.'
  , strMin : '글자수를 최소 $min자 이상으로 하십시오.'
  , strMax : '글자수를 최소 $max자 이하로 하십시오.'
  , strMinMax : '글자수를 최소 $min자 이상, 최대 $max자 이하로 하십시오.'
  , numMin : '값을 최소 $min 이상으로 하십시오.'
  , numMax : '값을 최대 $max 이하로 하십시오.'
  , numMinMax : '값을 최소 $min 이상 $max 이하로 하십시오.'

  , match : '값이 일치하지 않습니다.'
  , pattern : '형식이 올바르지 않습니다.'
};

js.forms.add.autofocus = {
	label: 'autofocus'
  , on: ['load']
  , work: function($forms, $inputs){
		var user = js.user
		  , under = user.under
		  ;
		under = user.under;
		(user.ie ||
			user.firefox ||
				under('opera', 10) ||
					under('chrome', 3) ||
						under('safari', 4) ||
							user.unknown) &&
			$inputs.filter('[autofocus]').focus();
  }
};

js.forms.add.required = {
	target: 'required'
  , work: function(node, attr, value){
  		return value.trim() ?
  			false :
  			attr=='' || /^required|1|true$/.test(attr) ?
  				['required']:
  				attr;
  }
  , always: true
};

js.forms.add.minlength = {
	target: 'minlength'
  , work: function(node, min, value){
  		if(value.length<attr){
  			var max = this.attr('maxlength');
			return [max ? 'strMinMax' : 'strMin'
				  , 'min', min
				  , 'max', max
				];
  		}
  }
};

js.forms.add.maxlength = {
	target: 'maxlength'
  , work: function(node, max, value){
  		if(value.length>attr){
  			var min = this.attr('minlength');
			return [max ? 'strMinMax' : 'strMin'
				  , 'min', min
				  , 'max', max
				];
  		}
  }
};

js.forms.add.min = {
	target: 'min'
  , off: 'range'
  , work: function(node, min, value){
		switch(node.attr('type')){
			case 'price':
				value = value.replace(/,/g, '');
			case 'number':
				if(Number(value)<min){
					var max = this.attr('max');
					this.value(min);
					return [max ? 'numMinMax' : 'numMin'
						  , 'min', min
						  , 'max', max
						];
				}
				break;
			default :
				if(value.length<min){
					var max = node.attr('max');
					return [max ? 'strMinMax' : 'strMin'
						  , 'min', min
						  , 'max', max
						];
				}
		}
  }
};

js.forms.add.max = {
	target: 'max'
  , off: 'range'
  , work: function(node, max, value){
		switch(node.attr('regex')){
			case 'price':
				value = value.replace(/,/g, '');
			case 'number':
				if(Number(value)>max){
					var min = node.attr('min');
					node.value(max);
					return [min ? 'numMinMax' : 'numMax'
						  , 'min', min
						  , 'max', max
						];
				}
				break;
			default :
				if(value.length<max){
					var min = node.attr('min');
					node.value(value.substr(0, max));
					return [min ? 'strMinMax' : 'strMax'
						  , 'min', min
						  , 'max', max
						];
				}
		}
  }
};

js.forms.add.assist = {
	on: ['down', 'up', 'blur']
  , work: function(event){
		event.keys();
		if(event.fn)
			return;
  }
};

js.forms.add.match = function(node, attr, value){
	var target = node.form.elements[attr]
	  , targetValue = target.value
	  ;

	return targetValue && targetValue == value ?
		false :
		'값이 일치하지 않습니다.'; 
};

js.forms.add.verify = {
	target: 'regex'
  , work: function(node, attr, value){
		return;
		var method = node._jsForms_.verify;
		return method ?
			method(input, value):
			false;
  }
};

js.forms.add.ben = function(){
	switch(this.attr('regex')){
		case 'date':
		if(value.length>9){
			attr = attr.split(';');
			for(var weekNo
				  , day
				  , i = attr.length
			  ; i--;){
				day = attr[i];
				switch(day.length){
					case 1:
					if(!weekNo)
						weekNo = Date.format('w');
					if(day==weekNo)
						return '제한된 요일 입니다.';
					
					case 4:
					if(day==value.substr(0, 4))
						return '제한된 연도 입니다.';
						
					default:
					if(day==value)
						return '제한된 날짜 입니다.';
				} 
			}
		}
	}
};

js.forms.add.arrowExtend = {
	target: 'type'
  , match: 'text'
  , on: ['up']
  , work: function(event){
  		event.keys();
  		if(event.up || event.down){
  			var value = this.value ?
  				Number(this.value) :
  				0
  			  , edit = event.shift ?
  			  	10 :
  			  	1;
  			
  			this.value = event.up ?
  				value+edit :
  				value-edit;
		}
  }
};

js.forms.type.number = {
	regex: RegExp.number
};

js.forms.type.id = {
	regex: /^[a-z][\w_]*$/
};

js.forms.type.password = {
	verify: function(node, value){
		for(var loop = 3
			  , i=0
			  , c=value.length-loop+1
			  , chars
			  , char
			; i<c; i++){
			chars = value.substr(i, loop);
			char = chars[0];
			if(new RegExp(char+'{'+loop+'}').test(chars)){
				return loop+'번 이상 연속된 값이 있습니다.';
			}
		}
	}
};

js.forms.type.email = {
	regex: RegExp.email
};

js.forms.type.url = {
	regex: RegExp.url
};

js.forms.type.date = {
	regex: RegExp.date
};

js.forms.type.year = {
	regex: RegExp.year
};

js.forms.type.time = {
	regex: RegExp.time
};

js.forms.type.price = {
	regex: /^-?\d+(,\d{3})*$/
};

js.forms.type.tel = {
	regex: RegExp.tel
};

js.forms.type.mobile = {
	regex: /^01(0|1|3|5|6|7|8|9)\-\d{3,4}\-\d{4}$/
  , assist: {
  		down: /[^\d]/
  	  , keyup : [
  	  		[/[^\d]/g, '']
  	  ]
  }
};

js.forms.type.crn = {
	regex: /^\d{3}-\d{2}-\d{5}$/
  , verify: function(){
  		var _hipens = /\-/g 
  		  , multi = [1, 3, 7, 1, 3, 7, 1, 3]
  		;
  		return (js.forms.type.crn.verify = (function(node, value){
			value = value.replace(_hipens, '');
			var last = Number(value[8]) * 5
			  , remain = last%10
			  , sum = ((last-(remain))/10) + remain
			  ;
			for(var i=7; i--;)
				sum+= (Number(value[i]) * multi[i])%10;
				
			if((10-sum%10)!=Number(value[9])){
				return '사업자등록번호가 유효하지 않습니다.';
			}  			
  			
  		})()).apply(this, arguments);
	}
};