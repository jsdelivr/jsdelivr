/*
 * jQuery Toolbar Plug-in
 * @author NAVER (developer@xpressengine.com)
 */

(function($){

$.fn.toolbar = function(settings) {	
	settings = $.extend({
		items : '.buttons button',
		fade  : false,
		click   : function(){},
		hover   : function(){},
		show    : function(){},
		hide    : function(){}
	}, settings);
	
	this.find(settings.items)
		.mouseover(function(){
			var $ul = $(this).next('ul');
			if($ul.length) showMenu($ul, settings);
		})
		.find('+ul>li')
			.mouseover(function(){
				var clss = 'tb-menu-item-hover';
				$(this).siblings('li').removeClass(clss).end().addClass(clss);

				// callback
				settings.hover(createData(this));
			})
			.find('>button')
				.click(function(){
					var data = createData(this.parentNode);

					// radio button
					selectItem(data);
					
					// callback
					settings.click(data);
				})
			.end()
		.end()
		.parent()
			.mouseleave(function(){
				var $ul = $(this).find('>ul:visible');
				if($ul.length) hideMenu($ul,settings);
			});
	
	return this;
}

function hideMenu(menu, settings) {
	menu[settings.fade?'fadeOut':'hide'](settings.fade)
		.removeClass('tb-menu-active')
		.find('> li').removeClass('tb-menu-item-hover');
	
	menu.prev().removeClass('tb-btn-active');
	
	// hidemenu event
	settings.hide(menu);
}

function showMenu(menu, settings) {	
	menu[settings.fade?'fadeIn':'show'](settings.fade)
		.addClass('tb-menu-active')
		.css({position:'absolute',left:0,top:0});
	
	menu.prev().addClass('tb-btn-active');

	// positioning
	var btn = menu.prev();
	var btn_pos = btn.offset();
	var mnu_pos = menu.offset();
	
	menu.css({
		left : btn_pos.left - mnu_pos.left,
		top  : btn_pos.top  - mnu_pos.top + btn.height()
	})
	
	// showmenu event
	settings.show(menu);
}

function selectItem(data) {
	var item = data.element;
	
	switch(data.type){
		case 'radio':
			item.parent().find('> li').removeClass('tb-menu-item-selected');
			item.addClass('tb-menu-item-selected')
			data.checked = true;
			break;
		case 'checkbox':
			data.checked = !data.checked;
			if (data.checked) {
				item.addClass('tb-menu-item-selected');
			} else {
				item.removeClass('tb-menu-item-selected');
			}
			break;
		default:
			break;
	};
}

function createData(item) {
	var $item = $(item);
	return {
		element : $item,
		type    : $item.attr('tb:type'),
		arg     : $item.attr('tb:arg'),
		checked : $item.hasClass('tb-menu-item-selected')
	};
}

})(jQuery);
