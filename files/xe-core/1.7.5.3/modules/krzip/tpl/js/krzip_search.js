(function($) {
	
	var STEP_INIT = 0;
	var STEP_SELECT_ADDR1 = 1;
	var STEP_SELECT_ADDR2 = 2;
	var STEP_INPUT_ADDR3 = 3;
	var STEP_SELECT_ADDR3 = 4;
	var STEP_INPUT_ADDR4 = 5;
	var STEP_COMPLETE = 6;
	
	$.fn.krZip = function(options) {
		
		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).krZip(options)
			});
			return this;
		}
		if($(this).data('krzip')) return this;
		$(this).data('krzip',true);
		
		var settings = $.extend({}, options);
		var input_addr = []; // 사용자로부터 입력, 선택되는 정보, 0:광역시도/1:시군구/2:사용자가 입력한 상세검색주소
		var new_addr_first =''; // 사용자가 선택한 도로주소
		var new_addr_second = ''; // 사용자가 입력한 나머지 주소
		var step = 0;
		
		var ui = {
			'indicator' : $(this.find('.addr_indicator.box')), // view box
			'currentAddress' : $(this.find('.current_address')), // show current
			'addrFirst' : $(this.find('input.addr_first')), // current_address
			'addrSecond' : $(this.find('input.addr_second')), // current_address
			'delButton' : $(this.find('.addr_indicator.box button.delete')).data('status',[1,0,0,0,0,0,1]),
			'cancelButton' : $(this.find('.addr_indicator.box button.cancel')).data('status',[0,1,1,1,1,1,0]),
			'addr1selector' : $(this.find('.addr1_selector.box')).data('status',[0,1,0,0,0,0,0]),
			'addr2selector' : $(this.find('.addr2_selector.box')).data('status',[0,0,1,0,0,0,0]),
			'addr3input' : $(this.find('.addr3_input.box')).data('status',[0,0,0,1,1,0,0]),
			'addr3selector' : $(this.find('.addr3_selector.box')).data('status',[0,0,0,0,1,0,0]),
			'addr4input' : $(this.find('.addr4_input.box')).data('status',[0,0,0,0,0,1,0])
		};
		
		var search_next = 0; // 상세주소리스트 offset

		// 주소창 클릭
		ui.currentAddress.focus(function() {
			if(step == STEP_INIT || step == STEP_COMPLETE){
				ui.currentAddress.val('');
				goStep1();
			}
		});
		
		// 삭제버튼 클릭
		ui.delButton.click(function(){
			ui.addrFirst.val('');
			ui.addrSecond.val('');
			ui.currentAddress.val('');
		});
		
		// 취소버튼 클릭
		ui.cancelButton.click(function(){
			ui.addrFirst.val(ui.addrFirst.data('originValue'));
			ui.addrSecond.val(ui.addrSecond.data('originValue'));
			ui.currentAddress.val(ui.addrFirst.val() + ' ' + ui.addrSecond.val());
			goStep0();
		});

		// 광역시도 주소(addr1)를 선택
		ui.addr1selector.on('click','button',function() {
			goStep2($(this).text());
			return false;
		});

		// 시/군/구 주소(addr2)를 선택
		ui.addr2selector.on('click','button',function() {
			goStep3($(this).text());
			return false;
		});

		// 상세주소(addr3)를 입력후 [검색]버튼을 클릭
		ui.addr3input.find('button.submit_addr3').click(function() {
			var input = ui.addr3input.find('.addr3_input').val();
			search_next = 0;
			if(input) goStep4(input);
		});
		// 상세주소(addr3)를 입력후 '엔터'
		ui.addr3input.find('input.addr3_input').keypress(function(event){
			if(event.keyCode!=13) return;
			ui.addr3input.find('button.submit_addr3').click();
			return false;
		});
		
		// 상세주소(addr3)를 선택
		ui.addr3selector.on('click', 'table button.sel_detail', 'click', function(){
			ui.addrSecond.val('');
			ui.addrSecond.focus();
			goStep5($(this).closest('tr').find('td:first span').text(),$(this).closest('tr').find('td:eq(1)').text());
			return false;
		});
		
		// 상세주소(addr3) 리스트 더보기 클릭
		ui.addr3selector.on('click', '.more_search', 'click', function(){
			goStep4();
			return false;
		});

		// 나머지주소(addr4) 입력후 '엔터' 방지
		ui.addrSecond.keypress(function(event){
			if(event.keyCode==13) return false;
		});

		var setIndicator = function() {
			// currentAddress 셋팅
			if(new_addr_first) ui.currentAddress.val(new_addr_first + new_addr_second);
			else ui.currentAddress.val(input_addr.join(' '));
		};
		
		var setUI = function() {
			
			for(var id in ui) {
				if(ui[id].data('status') == undefined) continue;
				if(ui[id].data('status')[step]) ui[id].show();
				else ui[id].hide();
			}
			
		};

		var goStep0 = function() {
			// step 초기화
			step = STEP_INIT;
			input_addr = ['','',''];
			new_addr_first = new_addr_second = '';
			setUI();
		};
		
		var goStep1 = function() {

			// step1: 광역시도 선택 단계
			step = STEP_SELECT_ADDR1;
			input_addr = ['','',''];
			new_addr_first = new_addr_second = '';

			// 광역시도 리스트 얻어와서 리스트에 넣기
			ui.addr1selector.find('ul').empty();
			$.ajax({
				url : settings.api_url, dataType : 'jsonp',
				data: { request: "addr1" },
				success : function(res)
				{
					if(res.result) {
						$.each(res.values, function(i){
							ui.addr1selector.find('ul').append($('<li><button class="btn" type="button">'+this+'</button> </li>'));
						})
					}
				}
			});

			setUI();
		};

		var goStep2 = function() {

			// step2: 시/군/구 선택 단계
			step = STEP_SELECT_ADDR2;
			input_addr = [input_addr[0],'',''];

			// validate addr1
			if (arguments.length) input_addr[0] = arguments[0];
			
			// 시/군/구 리스트 얻어와서 리스트에 넣기
			ui.addr2selector.find('ul').empty();
			$.ajax({
				url : settings.api_url, dataType : 'jsonp',
				data: { request: "addr2", search_addr1: input_addr[0] },
				success : function(res)
				{
					if(res.result) {
						// 세종시는 시/군/구 구분이 없음
						if(res.values.length == 1 && res.values[0] == "") {
							goStep3('');
						} else {
							$.each(res.values, function(i){
								ui.addr2selector.find('ul').append($('<li><button class="btn" type="button">'+this+'</button> </li>'));
							});
						}
					}
				}
			});
			
			setIndicator();
			setUI();
		};

		var goStep3 = function() {

			// step3: 상세주소 입력 단계
			step = STEP_INPUT_ADDR3;
			input_addr[2] = '';

			// validate addr2
			if (arguments.length) input_addr[1] = arguments[0];
			setIndicator();
			setUI();
		};

		var goStep4 = function() {

			// step4: 입력받은 상세주소를 검색해 상세주소 리스트를 출력하는 단계
			step = STEP_SELECT_ADDR3;

			// validate addr3
			if (arguments.length) input_addr[2] = arguments[0];
			ui.addr3selector.find('p strong').text(input_addr[2]);

			// 상세주소 리스트 얻어와서 리스트에 넣기
			if(search_next == 0) ui.addr3selector.find('tbody').empty(); // 더보기가 아닐 경우 목록 비우기
			$.ajax({
				url : settings.api_url,	dataType : 'jsonp',
				data: { search_word: input_addr[2], search_addr1: input_addr[0], search_addr2: input_addr[1], next: search_next },
				success : function(res)
				{
					if(res.result) {
						var html = '';
						
						// 받은 주소리스트가 있을 경우
						if(res.values.address.length) {
							
							$.each(res.values.address, function(i){
								var bdname = this.bdname?' ('+this.bdname+')':'';
								html += '<tr><td>[도로명] <span class="addr_list">'+this.addr1+' '+this.addr2_new + bdname +'</span><br/>[지번] ' + this.addr1+' '+this.addr2_old+'</td><td>'+this.zipcode+'</td><td><button type="button" class="btn sel_detail">선택</button></td></tr>';
							});
							
							// 검색어 하이라이트
							html = html.replace(new RegExp(input_addr[2], 'g'),'<strong>'+input_addr[2]+'</strong>');
							ui.addr3selector.find('tbody').append($(html));
							
							// 마지막 주소리스트였을 경우
							if(res.values.next == -1) ui.addr3selector.find('.nomore:visible, .islast:hidden, .more_search:visible').toggle();
							// 보여줄 주소가 남았을 경우
							else ui.addr3selector.find('.nomore:visible, .islast:visible, .more_search:hidden').toggle();
						
						} 
						// 검색결과가 전혀 없을 경우
						else if(search_next == 0) {
							ui.addr3selector.find('.nomore:hidden, .islast:visible, .more_search:visible').toggle();
						}
						search_next = res.values.next;
					}
				}
			});
			
			setUI();
		};

		var goStep5 = function() {
			
			// step5: 상세주소를 선택후, 나머지 주소를 입력하는 단계
			step = STEP_INPUT_ADDR4;

			// validate addr3
			if (arguments.length) {
				new_addr_first = arguments[0] + ' ('+ arguments[1] + ') ';
				ui.addrFirst.val(new_addr_first);
			}
			
			setIndicator();
			setUI();
		};
		
		var goStep6 = function() {
			
			// step6: 나머지 주소를 입력받은 후, 완전한 주소를 출력하는 단계
			step = STEP_COMPLETE;

			// validate addr4
			if (arguments.length) new_addr_second = arguments[0];
			
			setIndicator();
			
			// 새주소로 설정 변경
			ui.addrFirst.val(new_addr_first);
			ui.addrSecond.val(new_addr_second);
			
			setUI();
		};
		
		goStep0();
		return this;
	}
})(jQuery);
