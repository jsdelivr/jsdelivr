/*
 * @version 0.5
 * @todo apply calendar size, min, max
 */
js.calendar = (function(){
	var _index = 1;
	
	js.css(js.dir+'js.calendar.css', 'utf-8');
	
	return function(option){
		option = Object.merge(option || {}, {
			year: Date.y
		  , month: Date.m+1
		  , day: Date.d
		  , size: 1
		  , useHead: false
		  , week: ['일', '월', '화', '수', '목', '금', '토']
		});
		
		var wrap = 'div.jsCal'.tag();
		
		wrap.id = 'jsCal'+(_index++);
		wrap._jsCal_ = {
			time: new Date(option.year, option.month-1, option.day)
			
		  , year: [option.year]
		  , month:[option.month]
		  , day: [option.day]
		  
		  , option: option
		  , selected: [null]
		};
		
		var rendered = draw(wrap);
		
		if(option.input){
			option.input = js(option.input);
			option.input[0]._jsCal_ = wrap;
			option.input.change(input);
			var value = option.input[0].value;

			if(value){
				input.call(option.input[0]);
			}else{
				option.input[0].value = option.year+'-'+option.month.fill()+'-'+option.day.fill();
			}
		}
		
		return rendered;
	};
	
	function draw(wrap){
		var __ = wrap._jsCal_
		  , option = __.option
		  , current = getMonth(wrap)
		  , prev = getMonth(wrap, -1)
		  , next = getMonth(wrap, +1)
		  , row = 0
		  , id = wrap.id
			;
		 	
		wrap.innerHTML = '';
		
		var html = [];
		
		html.push('<h1>'+__.month[0]+'</h1>');
		html.push('<h2>'+__.year[0]+'</h2>');
		
		html.push('<table>');
		html.push('<thead>');
		html.push('<tr>');
		
		for(day=0; day<7; day++){
			html.push('<th class="day'+day+'">'+option.week[day]+'</th>');
		}
		
		html.push('</tr>');
		html.push('</thead>');
		
		html.push('<tbody>');
		html.push('<tr>');
		
		
		var weekNo = 0
		  , day = !current.weekNo ?
			prev.lastDay - 6 :
			prev.lastDay-current.weekNo+1;
		
		while(day<=prev.lastDay){
			html.push(td(id, 'prev', weekNo++, day++, prev.prefix));
		}
		day = 0;
		while(++day<=current.lastDay){
			if(weekNo>6){
				weekNo = 0;
				row++;
				html.push('</tr>');
				html.push('<tr>');
			}
			html.push(td(id, 'current', weekNo, day, current.prefix));
			weekNo++;
		}		
		
		if(row<7){
			day = 0;
			next.lastDay = (6-row)*7-weekNo;
			while(++day<=next.lastDay){
				if(weekNo>6){
					weekNo = 0;
					row++;
					html.push('</tr>');
					html.push('<tr>');
				}
				
				html.push(td(id, 'next', weekNo, day, next.prefix));
				
				weekNo++;
			}
		}
			
		html.push('</tr>');
		html.push('</tbody>');
		html.push('</table>');
		

		html.push('<div class="drawer">');
		html.push('<a href="#'+id+'_'+prev.prefix+'" class="prev"><span class="year">'+prev.year+'</span><span class="glue">-</span><span>'+prev.month+'</span></a>');
		html.push('<a href="#'+id+'_'+next.prefix+'" class="next"><span class="year">'+next.year+'</span><span class="glue">-</span><span>'+next.month+'</span></a>');
		html.push('</div>');

		wrap.innerHTML = html.join('\n');
		
		var days = js('a', wrap);
		for(i=days.length, day; i--;){
			day = days[i];
			day._jsCal_ = wrap;
			day.onclick = select;
		}
		
		return wrap;
	}
	
	function td(id, month, weekNo, day, prefix){
		var date = prefix+day.fill(2);
		var cellId = id+'_'+date.replace(/-/g, '');
		
		id+= '_'+date; 
		return '<td id="'+cellId+'" class="'+month+' day day'+weekNo+'">'
		  + '<a href="#'+id+'" title="'+date+'">'+day+'</a>'
		  + '</td>'; 
	}
	
	function getMonth(wrap, add){
		var __ = wrap._jsCal_
		  , month = __.month[0]
		  , year = __.year[0]
		  ;
		  
		if(add){
			month+= add;
			switch(month){
				case 13:
					month = 1;
					year++;
					break;
				case 0:
					month = 12;
					year--;
			}
		}
		
		var time = new Date(year, month-1);
		return {
			year: year
		  , month: month
		  , prefix: year+'-'+month.fill(2)+'-'
		  , lastDay: time.format('t').toInt()
		  , weekNo: time.format('w').toInt()
		};
	}

	function select(){
		var href = this.href.split('#')[1]
		  , date = href.split('_')[1]
		  , splitedDate = date.split('-')
		  , cell = this.parentNode
		  , wrap = this._jsCal_
		  , __ = wrap._jsCal_
		  ;
		switch(cell.tagName){
			case 'TD':
				if(cell.className.indexOf('prev')>-1 || cell.className.indexOf('next')>-1){
					setTime(wrap, splitedDate);
				}else{
					__.time.setDate(splitedDate[2]);
					__.day[0] = splitedDate[2];
				}
				setInput(wrap);
				cell = js('#'+href.replace(/-/g, ''));
				break;
			case 'DIV':
				setTime(wrap, splitedDate);
		}
		selected(wrap);
	}
	
	function selected(wrap){
		var __ = wrap._jsCal_
		  , id = wrap.id + '_' + __.year[0] + __.month[0].fill() + __.day[0].fill();
			;
			
		__.selected[0] &&
			__.selected[0].stylex('select');
		
		var day = js('#'+id, wrap);
		__.selected[0] = day ? 
			day.style('select') :
			null;
	}
	
	function setTime(wrap, date){
		date[0] = Number(date[0]);
		date[1] = Number(date[1]);
		
		var __ = wrap._jsCal_;
		__.time.setFullYear(date[0]);
		__.time.setMonth(date[1]-1);
		
		__.year[0] = date[0];
		__.month[0] = date[1];
		if(date[2]){
			__.time.setDate(date[2]);
			__.day[0] = date[2];
		}
		
		setInput(wrap);			
		draw(wrap);
	}
	
	function setInput(wrap){
		var __ = wrap._jsCal_;
		if(__.option.input){
			__.option.input
				.value(__.year[0]+'-'+__.month[0].fill()+'-'+__.day[0].fill())
				.focus();			
		}
	}

	function input(){
		if(!this.value)
			return;
		var wrap = this._jsCal_
		  , __ = wrap._jsCal_
		  , date = this.value.split('-')
		  ;
		
		if(__.year[0]!=date[0] || __.month[0]!=date[1]){
			setTime(wrap, date);
		}else{
			__.time.setDate(date[2]);
			__.day[0] = date[2];
		}
		selected(wrap);
	}
})();

js.add.calendar = function(option){
	return this.append(js.calendar(option));
}
