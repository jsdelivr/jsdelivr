/**
 * @brief XE Calendar
 * @author NAVER (developers@xpressengine.com)
 *
 * 사용법
 * 
 **/
(function($){

if (!$.ui) $.ui = {};
$.extend($.ui, { calendar: { version:'0.3' } });

var PROP_NAME = 'calendar';
var index = 0;
var calendars = {};
var template  = {calendar:'',month:''};

function Calendar() {
}

$.extend(Calendar.prototype, {
	_activeCalendar : null,
	_getuid : function(obj) {
		var uid = obj.attr('class').match(/ui-calendar-(\d+-\d+)/);

		if (!uid) return -1;
		return uid[1];
	},
	_show : function(obj) {
		if (this._activeCalendar) this._hide(this._activeCalendar);

		// disabled?
		if (obj.hasClass('ui-calendar-disabled')) return;

		// Active Calendar
		this._activeCalendar = obj.show(300);
	},
	_hide : function(obj) {
		if (this._activeCalendar && this._activeCalendar.get(0) == obj.get(0)) this._activeCalendar = null;
		obj.hide(300);
	},
	_toggle : function(obj) {
		(obj.css('display' ) == 'none')?this._show(obj):this._hide(obj);
	},
	_attachCalendar : function(obj, options) {
		if ((obj=$(obj)).hasClass('ui-calendar')) return;

		var uid = $.calendar.uuid+'-'+(index++);
		var c = calendars[uid] = {};
		
		// uid 추가
		obj.addClass('ui-calendar-'+uid).mousedown(function(){return false});

		// default options
		c.options = $.extend({
			type : 'day',
			activeDate : ''
		}, options||{});
		c.lang = $.extend({
			weekdays : 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
			today : 'Today',
			prevmonth : 'Prev Month',
			nextmonth : 'Next Month',
			prevyear  : 'Prev Year',
			nextyear  : 'Next Year',
			close : 'Close'
		}, options.lang||{});
		
		c.lang.weekdays = c.lang.weekdays.split(',');

		// 날짜 설정
		var d;
		if (typeof c.options.activeDate == 'string' && c.options.activeDate) {
			var s = c.options.activeDate.split('/');
			d = new Date(s[0], s[1]-1, s[2]-0);
		} else {
			d = new Date();
		}
		this._setDate(obj, d);

		// 토글 버튼
		if (c.options.button) {
			(c.button=$(c.options.button)).click(function(){ obj.calendar('toggle') });
		}

		// 클래스 추가
		obj.addClass('ui-calendar');

		// position 설정한 후, 좌표를 (0,0)으로 변경
		var pos = obj.css({position:'absolute',top:0,left:0}).show().offset();

		// 버튼의 위치 구해서 좌표 조정
		var bpos = c.button.offset();
		var dx  = bpos.left - pos.left;
		var dy  = bpos.top - pos.top;

		// 좌표 조정 후 레이어 숨김
		obj.css({top:(dy+c.button.height())+'px',left:dx+'px'}).hide();
	},
	_checkExternalClick : function(e) {
		if ($.calendar._activeCalendar) $.calendar._hide($.calendar._activeCalendar);
	},
	_processTemplate : function(tpl, vars) {
		tpl = (' '+tpl+' ').split(/[\{\}]/g);

		for(var i=0; i < tpl.length; i++) {
			if (i%2) {
				if (/^[\w\.\[\]]+$/.test(tpl[i])) tpl[i] = 'try{v=vv.'+tpl[i]+'}catch(e){v=""};ret.push(v);';
				else if (/^@(\w+)\s+in\s+(\w+)$/.test(tpl[i])) tpl[i] = 'for(i=0,l=vv.'+RegExp.$2+'.length;i<l;i++) { vv.'+RegExp.$1+'=vv.'+RegExp.$2+'[i];';
				else if (tpl[i] == '/') tpl[i] = '};';
				else tpl[i] = 'ret.push("{'+tpl[i]+'}");';
			} else {
				tpl[i] = 'ret.push("'+tpl[i].replace(/"/g, '\\"')+'");'; //"
			}
		}

		tpl.push('return ret.join("");');
		tpl = (['var i,l,v,t,ret=[];'].concat(tpl)).join('');

		return (new Function('vv',tpl))(vars);
	},
	_draw : function(obj) {
		var uid = this._getuid(obj);
		if (uid < 0) return;

		var cal = calendars[uid];
		var tpl = (cal.options.type == 'month')?template.month:template.calendar;
		var v   = {lang:cal.lang};

		// 날짜 관련 변수
		v['yyyy'] = cal.date.getFullYear();
		v['yy'] = (v['yyyy']+'').substring(2);
		v['m']  = cal.date.getMonth() + 1;
		v['mm'] = v['m'] > 9?v['m']:'0'+v['m'];

		// 연간 달력이 아니라면 이 달의 날짜를 구한다.
		if (cal.options.type != 'month') {
			// 날짜에 사용할 달력
			v['weeks'] = [];

			var d = new Date(cal.date.getTime()), w = [];
			var last = (v.m!=2)? ((v.m+(v.m>7?1:0))%2?31:30) : ((new Date(v.yyyy,v.m-1,29)).getMonth()==v.m?29:28); // 마지막 날

			d.setDate(1); // 1일로 설정 후 1일의 요일을 가져온다.
			var start = d.getDay(), end = last+start;

			for(var i=0,len=end+(7-(end%7||7));i<len;i++) {
				if (i%7 == 0) v['weeks'].push(w=[]);
				if (i < start || i >= end) w.push('&nbsp;');
				else w.push('<button type="button" class="day'+v.yyyy+'-'+v.m+'-'+(i+1-start)+'">'+(i+1-start)+'</button>');
			}
		}
		
		// 템플릿 처리
		tpl = this._processTemplate(tpl, v);
		obj.html(tpl);

		// 선택한 날짜
		if (cal.options.type == 'month') {
			
		} else {
			var t = new Date();
			obj.find('td>button.day'+t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate()).addClass('today');
			
			t = cal.activeDate;
			obj.find('td>button.day'+t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate()).addClass('active');
		}

		// 이벤트 핸들러
		obj.find('button.close').click(function(){ $.calendar._hide(obj); });
		obj.find('button.today').click(function(){ $.calendar._moveToday(obj); });
		if (cal.options.type == 'month') {
			obj.find('button.prev').click(function(){ $.calendar._prevYear(obj) });
			obj.find('button.next').click(function(){ $.calendar._nextYear(obj) });
		} else {
			obj.find('button.prev').click(function(){ $.calendar._prevMonth(obj) });
			obj.find('button.next').click(function(){ $.calendar._nextMonth(obj) });
			obj.find('button.prev_year').click(function(){ $.calendar._prevYear(obj) });
			obj.find('button.next_year').click(function(){ $.calendar._nextYear(obj) });
		}
		obj.find('td>button').click(function(){ $.calendar._selectDate(obj, $(this)) });
	},
	_selectDate : function(obj, btn) {
		var cal  = calendars[ this._getuid(obj) ];
		var date = btn.attr('class').match(/day([\d\-]+)/);
		if (!date) return;
		
		date = date[1].split('-');
		
		var ad = cal.activeDate;
		ad.setFullYear(date[0]-0);
		ad.setMonth(date[1]-1);
		ad.setDate(date[2]-0);

		this._setDate(obj, ad);
	},
	_setDate : function(obj, newDate) {
		var uid = this._getuid(obj);
		if (uid < 0) return null;
		if (!newDate || !(newDate instanceof Date)) newDate = new Date();

		var cal = calendars[uid];
		cal.activeDate = new Date(newDate.getTime());
		cal.date = new Date(newDate.getTime());
		this._draw(obj);
		
		if ($.isFunction(cal.options.select) && obj.hasClass('ui-calendar')) {
			cal.options.select(newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate());
		}
	},
	_getDate : function(obj, format) {
		var uid = this._getuid(obj);
		if (uid < 0) return null;
		if (typeof format != 'string') return calendars[uid].activeDate;

		// format string
	},
	_moveToday : function(obj) {
		calendars[this._getuid(obj)].date = new Date();
		this._draw(obj);
	},
	_prevMonth : function(obj) {
		var cal = calendars[this._getuid(obj)];
		var m = cal.date.getMonth();

		cal.date.setDate(1);
		if (m == 0) {
			cal.date.setFullYear(cal.date.getFullYear()-1);
			cal.date.setMonth(11);
		} else {
			cal.date.setMonth(m-1);
		}

		this._draw(obj);
	},
	_nextMonth : function(obj) {
		var cal = calendars[this._getuid(obj)];
		var m = cal.date.getMonth();
		
		cal.date.setDate(1);
		if (m == 11) {
			cal.date.setFullYear(cal.date.getFullYear()+1);
			cal.date.setMonth(0);
		} else {
			cal.date.setMonth(m+1);
		}

		this._draw(obj);
	},
	_prevYear : function(obj) {
		var cal = calendars[this._getuid(obj)];

		cal.date.setFullYear(cal.date.getFullYear()-1);
		this._draw(obj);
	},
	_nextYear : function(obj) {
		var cal = calendars[this._getuid(obj)];

		cal.date.setFullYear(cal.date.getFullYear()+1);
		this._draw(obj);
	}
});

/**
 * Invoke the calednar functionallity
 * @return jQuery object
 */
$.fn.calendar = function(options) {
	var args = $.makeArray(arguments);

	if (!$.calendar.initialized) {
		$(document).mousedown($.calendar._checkExternalClick);
		$.calendar.initialized = true;
	}

	if (typeof options == 'string' && $.inArray(options, ['getDate'])) {
		args.shift();
		return $.calendar['_'+options].apply($.calendar, [$(this[0])].concat(args) );
	}

	return this.each(function(){
		if (typeof options == 'string') {
			args.shift();
			$.calendar['_'+ options].apply($.calendar, [$(this)].concat(args));
		} else {
			$.calendar._attachCalendar($(this), options);
		}
	});
}

$.calendar = new Calendar(); // singleton instance
$.calendar.initialized = false;
$.calendar.uuid = new Date().getTime();
$.calendar.version = $.ui.calendar.version;

// template
template.calendar = '<button type="button" class="close"><span>{lang.close_layer}</span></button>\
<table border="1" cellspacing="0" summary="달력에서 날짜를 선택하기">\
<caption>\
	<span>\
		{yyyy}.{mm}.\
		<button type="button" class="today">{lang.today}</button>\
		<button type="button" class="navi prev"><span>{lang.prevmonth}</span></button>\
		<button type="button" class="navi next"><span>{lang.nextmonth}</span></button>\
		<button type="button" class="navi prev_year"><span>{lang.prevyear}</span></button>\
		<button type="button" class="navi next_year"><span>{lang.nextyear}</span></button>\
	</span>\
</caption>\
<thead>\
	<tr>\
		<th scope="col" class="sun">{lang.weekdays[0]}</th>\
		<th scope="col">{lang.weekdays[1]}</th>\
		<th scope="col">{lang.weekdays[2]}</th>\
		<th scope="col">{lang.weekdays[3]}</th>\
		<th scope="col">{lang.weekdays[4]}</th>\
		<th scope="col">{lang.weekdays[5]}</th>\
		<th scope="col">{lang.weekdays[6]}</th>\
	</tr>\
</thead>\
<tbody>\
	{@week in weeks}\
	<tr class="ui-calenar-repeat">\
		<td class="sun">{week[0]}</td>\
		<td>{week[1]}</td>\
		<td>{week[2]}</td>\
		<td>{week[3]}</td>\
		<td>{week[4]}</td>\
		<td>{week[5]}</td>\
		<td>{week[6]}</td>\
	</tr>\
	{/}\
</tbody>\
</table>\
<button type="button" class="close"><span>{lang.close_layer}</span></button>';

template.month = '<button type="button" class="close"><span>{lang.close_layer}</span></button>\
<table border="1" cellspacing="0" summary="달력에서 날짜를 선택하기" class="month">\
<caption>\
	<span>\
		{yyyy}.{mm} <button type="button" class="today">{lang.today}</button>\
		<button type="button" class="navi prev"><span>{lang.prevyear}</span></button>\
		<button type="button" class="navi next"><span>{lang.nextyear}</span></button>\
	</span>\
</caption>\
<tbody>\
	<tr>\
		<td><button type="button" class="past"><strong>1</strong><br />January</button></td>\
		<td><button type="button" class="past"><strong>2</strong><br />Februry</button></td>\
		<td><button type="button" class="past"><strong>3</strong><br />March</button></td>\
		<td><button type="button" class="past"><strong>4</strong><br />April</button></td>\
	</tr>\
	<tr>\
		<td><button type="button" class="past"><strong>5</strong><br />May</button></td>\
		<td><button type="button" class="active"><strong>6</strong><br />June</button></td>\
		<td><button type="button"><strong>7</strong><br />July</button></td>\
		<td><button type="button"><strong>8</strong><br />August</button></td>\
	</tr>\
	<tr>\
		<td><button type="button"><strong>9</strong><br />September</button></td>\
		<td><button type="button"><strong>10</strong><br />October</button></td>\
		<td><button type="button"><strong>11</strong><br />Nobember</button></td>\
		<td><button type="button"><strong>12</strong><br />December</button></td>\
	</tr>\
</tbody>\
</table>\
<button type="button" class="close"><span>{lang.close_layer}</span></button>';

})(jQuery);
