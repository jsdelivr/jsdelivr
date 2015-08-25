js.forms = (function(user){
	var $forms
	  , $inputs
	  
	  , $active = []
	  ;
	 
	js(function(){
		$forms = js('form').set(formEvent);
		$inputs = js('input, textarea').set(inputEvent);

		// autofocus
		under = user.under;
		(user.ie ||
			user.firefox ||
				under('opera', 10) ||
					under('chrome', 3) ||
						under('safari', 4) ||
							user.unknown) &&
			$inputs.js('[autofocus]').focus();
	});

	function formEvent(form){
		var store = {};
		
		store.groups = this.js('p.inputs')
			.set(inputsEvent);

		form._jsForms_ = store;
		
		this.event('submit', formValid);
	};
	formEvent.preset = {};
	formEvent.unvalid = {};

	formEvent.add = function(name, set){
		set.name = name;
		if(set.attr == undefined)
			set.attr = name;
		
		$active.push(set);
	};
	
	return formEvent;
	
	function formValid(event, form){
		// 개별 검사
		for(var nodes = form.elements
			  , i = 0
			  , c = nodes.length
			  , node
		  ; i<c; i++){
			//node = js(nodes[i]);
			//value = node.value();
			if(inputValid(nodes[i])===false)
				return false;
		}
		
		// 그룹 검사
		var store = form._jsForms_;
		
		var groups = store.sets;
		return false;
	}
	
	function inputsEvent(){
		return (inputsEvent = (function(){
			return function(){
				inputEvent.call(js(this), this);
				
				this._jsForms_ = {
					group: true
				  , inputs: js('[name]', this)
				  		.change(updateGroupValue)
				  		.prop('_jsFomrs_', this)
				  , glue: js('span.glue', this).html()
				};

				this.value = groupValue(this);
			};
			
			function updateGroupValue(){
				this_jsFomrs_.value = groupValue(this_jsFomrs_);
			}
			
			function groupValue(group){
				var store = group._jsForms_
				  , inputs = store.inputs
				  , glue = store.glue
				  , values = inputs[0].value
				  , value
				  , i
				  , c = glue.length
				  ;
				for(; i<c; i++){
					value = inputs[i+1].value;
					if(value==null)
						return '';
					values+= glue[i]+value;
				}
				return values;
			}
		})()).call(this);
	}
	
	function inputEvent(node){
		var store = {}
		  , name
		  , active
		  , attr
		  , i
		  , c
		  , event
		  ;
		
		for(i=0, c=$active.length; i<c; i++){
			active = $active[i];
			name = active.name;
			attr = node.getAttribute(active.attr);
			
			if(!attr){
				if(active.attr!==false)
					continue;
			}else{
			}

			this.attrx(active.attr);
			store.attr = attr;
			
			events = active.event.length;
			if(events){
				for(j=0, d=active.event.length; j<d; j++){
					event = active.event[j];
					//if(event=='submit'){
						//node.form._jsForm_.input.push(node);
					//}else{
						this.event(event, active.method);
					//}
				}
			}else{
				store.valid[name] = active.method;
			}
		}
		node._jsFomrs_ = store;
		
		this.change(inputValid);
	}
	
	function inputValid(event){
		var store = this._jsForms_
		  , methods = store.methods
		  , node = $(this)
		  , value = input.value()
		  , error
		  , i = 0
		  , c = methods.length
		  ;
		  
		for(; i<c; i++){
			error = methods[i].call(node, this, this.attr(name));
			if(error)
				return unvalid(input, error);
		}
		
		return true;
	}
	
	function inputTrader(active){
		return function(event){
			var node = event.node;
			active.method(node, node.value, node.getAttribute(active.attr), unvalid);
		};
	};
	
	function unvalid(node, guide){
		if(Array.test(guide)){
			var preset = js.forms.unvalid[guide.shift()];
			for(var i=guide.length; i-=2;)
				preset = preset.replace('$'+guide[i-1], guide[i]);
			guide = preset;
		}

		alert(guide);
		node.focus();
		
		return false;
	}
})(js.user);

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

js.forms.add('required', {
	event : 'submit'
  , replace : true
  , method : function(input, attr, value){
		return value.trim() ?
			true :
			unvalid(input, /required|true|1/.test(attr) ?
				'필 수 항목을 입력해야 합니다.' :
				attr
			);
	}
});

js.forms.add('assist', {
	event : ['keyup', 'blur', 'change']
  , method : function(node, attr, value){
  		
  	}
});

js.forms.add('min', {
	event : ['change']
  , method : function(node, attr, value){
		var min = attr;
		switch(node.attr('regex')){
			case 'price':
				value = value.replace(/,/g, '');
			case 'number':
				if(Number(value)<min){
					var max = node.attr('max');
					node.value(min);
					return unvalid(
						node
					  , [max ? 'numMinMax' : 'numMin'
						  , 'min', min
						  , 'max', max
						]
					);
				}
				break;
			default :
				if(value.length<attr){
					var max = node.attr('max');
					return unvalid(
						node
					  , [max ? 'strMinMax' : 'strMin'
						  , 'min', min
						  , 'max', max
						]
					);
				}
			}
		return true;
  	}
});

js.forms.add('max', {
	event : ['change']
  , method : function(node, attr, value){
		var max = attr;
		switch(node.attr('regex')){
			case 'price':
				value = value.replace(/,/g, '');
			case 'number':
				if(Number(value)>max){
					var min = node.attr('min');
					node.value(max);
					return unvalid(
						node
					  , [min ? 'numMinMax' : 'numMax'
						  , 'min', min
						  , 'max', max
						]
					);
					
				}
				break;
			default :
				if(value.length<attr){
					var min = node.attr('min');
					node.value(value.substr(0, max));
					return unvalid(
						node
					  , [min ? 'strMinMax' : 'strMax'
						  , 'min', min
						  , 'max', max
						]
					);
				}
			}
		return true;
  	}
});

js.forms.preset.password = {
	verify : function(value){
		var loop = 3;
		for(var i=0, c=value.length-loop+1, chars, char; i<c; i++){
			chars = value.substr(i, loop);
			char = chars.substr(0, 1);
			if((new RegExp(char+'{'+loop+'}')).test(chars)){
				return '연속 '+loop+'번 이상 반복된 값이 있습니다.'
			}
		}
	}
};

js.forms.preset.email = {
	regex : /^\w([-_.]?\w)*@\w([-_.]?\w)*\.[a-zA-Z]{2,3}$/
  , assist : {
  		keyup : [
			[/^([^@]+@hanmail)$/, '$1.net']
		  , [/^([^@]+@(?:gmail|dreamwiz|nate|naver|hotmail|live))$/, '$1.com']
		  , [/^([^@]+@(?:yahoo.co.))$/, '$1.kr']
		  , [/^([^@]+@(?:yahoo))$/, '$1.com']
		  , [/(\.(?:com|net|org|kr)){2}$/, '$1']
  		]
  }
};

js.forms.preset.url = {
	regex : /^(https?|ftp):\/\/([\w-]+\.)+[-\w]+(\/[-./?&%=\w]*)?$/
};

js.forms.preset.number = {
	regex : /^-?\d+$/
  , assist : {
  		keyup : [
			[/[^\d\-]/g, '']
  		]
  }
};

// 날짜
js.forms.preset.date = {
	regex : /^(\d{1,4}[-\/\.])?(?:(?:(0[13578]|10|12|[13578])[-\/\.](0[1-9]|[12]\d|3[01]|[1-9]))|(?:(0[469]|11|[469])[-\/\.](0[1-9]|[12]\d|30|[1-9]))|(0?2)-(0[1-9]|[12][1-9]))$/
  , assist : {
		keyup : [
			// 기호 통일
			[/[\.\/]/g, '-', 1]
			// 올해 대입
		  ,	[/y|ㅛ/, Date.y]
			// 달 대입
		  , [/m|ㅡ/, Date.m]
			// 날 대입
		  , [/d|ㅇ/, Date.d+' ']
			// 숫자, - 외 제거
		  , [/[^\d\-]/, '']
			// 0000 > 00-00
		  , [/^(\d\d)(\d\d)$/, '$1-$2']
			// 00-000 > 00-00-0
		  , [/^(\d\d\-\d\d)(\d+)$/, '$1-$2']
			// 00-00-000 > 0000-00-0
		  , [/^(\d\d)-(\d\d)-(\d\d)(\d+)$/, '$1$2-$3-$4']
			// 00-00-0-0 > 0000-0-0
		  , [/^(\d\d)-(\d\d)-(\d\d?)(-\d+)$/, '$1$2-$3$4']
			// 0000-0000 > 0000-00-00
		  , [/^(\d{4}-\d\d)(\d\d)$/, '$1-$2']
			// 00000000 > 0000-00-00
		  , [/^(\d{4})(\d\d)(\d\d)$/, '$1-$2-$3']
			// 이탈 제거
		  , [/(\d{4}-\d\d?-\d\d).+/, '$1']
		  ]
		, blur : [
			// 날짜만 있을 때 월 붙이기
			[/^(0?[1-9]|[1-2][0-9]|3[0-1])$/, Date.m+'-$1', 1]	
			// 월-날짜 만 있을 때 연도 붙이기
  		  , [/^(0?[1-9]|1[0-2])\-?(0[1-9]|[1-2][0-9]|3[01])$/, Date.y+'-$1-$2']
		  , [/^((?:0m?[1-9]|1[0-2])\-[1-9])$/, Date.y+'-$1']
			// 연도 4 자리로
		  , [/^(\d\-\d\d?\-\d\d?)$/, Date.y.substr(0, 3)+'$1', 1]
		  , [/^(\d\d\-\d\d?\-\d\d?)$/, Date.y.substr(0, 2)+'$1', 1]
			// 0 자리 붙이기
		  , [/(\d{4}-)(\d-\d\d?)$/, '$10$2', 1]
		  , [/(\d{4}-\d\d-)(\d)$/, '$10$2']			 
		]
	}
	, verify : function(element, value){
		value = value.split('-');
		var year = Number(value[0]);
		if(
			Number(value[1])==2 &&
			value[2]==29 &&
			(!(!y%4 && y%100) || !y%400)
		){
			element.value = year+'-02-28';
			return year+'년 2월은 28일 까지 입니다.';
		}
	}
};

// 연도
js.forms.preset.year = {
	regex : /^\d{2,4}$/
};

// 시간
js.forms.preset.time = {
	regex : /^[0-2]\d(:[0-6]?\d){1,2}$/
  , assist : {
		keyup : [
			[/[^\d:]/g, '']
		  , [/^(\d\d(?::\d\d)?)(\d)$/, '$1:$2']
		  , [/^(\d\d)(\d\d)$/, '$1:$2']
		]
	}
};

// 돈
js.forms.preset.price = {
	regex : /^-?\d+(,\d{3})*$/
  , assist : {
			keyup : [
				[/[^\d\-,]/g, '']
			]		
	}
};

// 전화번호
js.forms.preset.phone = {
	regex : /^(0\d{1,3}\-)?\d{3,4}\-\d{4}$/
  , assist : {
		keyup : [
			[/[^\d\-]/g, '']
		  , [/^(\d{3}|02)(\d)/, '$1-$2']
		  , [/^((?:\d{3}|02)-\d{4})(\d)/, '$1-$2']
		  , [/^((?:\d{3}|02)-\d{3})(\d)-(\d{3})$/, '$1-$2$3']
		  , [/^((?:\d{3}|02)-\d{3})-(\d)(\d{4})$/, '$1$2-$3']
		  , [/^(\d{2,3}-\d{4}-\d{4}).+/, '$1', true]
		  , [/^(\d{2,3})[-\s]?(\d{3,4})[-\s]?(\d{4})$/, '$1-$2-$3']
		]
	}
};

// 휴대전화
js.forms.preset.mobile = {
	regex : /^01(0|1|3|5|6|7|8|9)\-\d{3,4}\-\d{4}$/
  , assist : {
		keyup : [
			[/[^\d\-]/g, '']
		  , [/^(\d{3})(\d)/, '$1-$2']
		  , [/^(\d{3}-\d{4})(\d)/, '$1-$2']
		  , [/^(\d{3}-\d{3})(\d)-(\d{3})$/, '$1-$2$3']
		  , [/^(\d{3}-\d{3})-(\d)(\d{4})$/, '$1$2-$3']
		  , [/^(\d{3}-\d{4}-\d{4}).+/, '$1', true]
		  , [/^(\d{3})[-\s]?(\d{3,4})[-\s]?(\d{4})$/, '$1-$2-$3']
		]		
	}
};

// 사업자 등록 번호
js.forms.preset.crn = {
	regex : /^\d{3}-\d{2}-\d{5}$/
  , assist : {
		keyup : [
			[/[^\d\s-]/g, '']
		  , [/^(\d{3})(\d)$/, '$1-$2']
		  , [/^(\d{3}-\d{2})(\d)$/, '$1-$2']
		  , [/^(\d{3}-?\d{2}-?\d{5}).+/, '$1', true]
		  , [/^(\d{3})[-\s]?(\d{2})[-\s]?(\d{5})$/, '$1-$2-$3']
		]
	}
  , verify : function(element, value){
		value = value.replace(/\-/g, '');
		var multi = [1,3,7,1,3,7,1,3,5]			
		  , last = Number(value[8]) * multi[8]
		  , sum = ((last-(last%10))/10) + last%10
		  ;
		
		for(var i=0; i<8; i++)
			sum+= (Number(value[i]) * multi[i])%10;
			
		if((10-sum%10)!=Number(value[9])){
			return '사업자등록번호가 유효하지 않습니다.';
		}
  }
};