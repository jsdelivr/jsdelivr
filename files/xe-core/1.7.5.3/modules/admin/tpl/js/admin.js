/* NAVER (developers@xpressengine.com) */
// install module
function doInstallModule(module) {
	var params = [];
	params.module_name = module;
	exec_xml('install','procInstallAdminInstall',params, completeInstallModule);
}

// upgrade module
function doUpdateModule(module) {
	var params = [];
	params.module_name = module;
	exec_xml('install','procInstallAdminUpdate',params, completeInstallModule);
}

function completeInstallModule(ret_obj) {
	alert(ret_obj.message);
	location.reload();
}

jQuery(function($){
// iSO mobile device toolbar remove
	window.scrollTo(0,0);
// TARGET toggle
	$(document.body).on('click', '.x [data-toggle]', function(){
		var $this = $(this);
		if($this.is('a') && $this.attr('href') != $this.attr('data-toggle')){
			var target = $this.attr('href');
			$this.attr('data-toggle', target);
		}
		var $target = $($this.attr('data-toggle'));
		var focusable = 'a,input,button,textarea,select';
		$target.toggle();
		if($target.is(':visible') && !$target.find(focusable).length){
			$target.not(':disabled').attr('tabindex','0').focus();
		} else if($target.is(':visible') && $target.find(focusable).length) {
			$target.not(':disabled').find(focusable).eq(0).focus();
		} else {
			$this.focus();
		}
		return false;
	});
// TARGET show
	$(document.body).on('click', '.x [data-show]', function(){
		var $this = $(this);
		if($this.is('a') && $this.attr('href') != $this.attr('data-show')){
			var target = $this.attr('href');
			$this.attr('data-show', target);
		}
		$($this.attr('data-show')).show().attr('tabindex','0').focus();
		return false;
	});
// TARGET hide
	$(document.body).on('click', '.x [data-hide]', function(){
		var $this = $(this);
		if($this.is('a') && $this.attr('href') != $this.attr('data-hide')){
			var target = $this.attr('href');
			$this.attr('data-hide', target);
		}
		$($this.attr('data-hide')).hide();
		$this.focus();
		return false;
	});
// Tab Navigation
	$.fn.xeTabbable = function(){
		$(this).each(function(){
			var $this = $(this);
			$this.find('>.x_nav-tabs>li>a').each(function(index){
				$(this).attr('data-index', index+1);
			});
			$this.find('>.x_tab-content>.x_tab-pane').each(function(index){
				$(this).attr('data-index', index+1);
			});
		});
		$('.x .x_tab-content>.x_tab-pane:not(".x_active")').hide();
	};

	$('.x .x_tabbable').xeTabbable();
	$(document.body).on('click', '.x .x_nav-tabs>li>a[href^="#"]', function(){
		var $this = $(this);
		if($this.parent('li').hasClass('x_disabled')){
			return false;
		}
		$this.parent('li').addClass('x_active').siblings().removeClass('x_active');
		$this.closest('.x_nav-tabs').next('.x_tab-content').find('>.x_tab-pane').eq($this.attr('data-index')-1).addClass('x_active').show().siblings('.x_tab-pane').removeClass('x_active').hide();
		$this.parents('.x_tabbable').trigger('tab_change', [parseInt($this.attr('data-index'))-1, $this]);
		return false;
	});
// #content reflow
	function reflow(){ // Browser bug fix & resize height
		var $xBody = $('.x>.body');
		var $xGnb = $xBody.find('>.gnb');
		var $xContent = $xBody.children('#content.content');
		$xContent.width('99.99%');
		setTimeout(function(){
			$xContent.removeAttr('style');
			if($xGnb.height() > $xContent.height()){
				$xContent.height($xGnb.height());
			}
		}, 100);
	}
// GNB
	$.fn.gnb = function(){
		var $xBody = $('.x>.body');
		var $xGnb = $xBody.find('>.gnb');
		var $xGnb_li = $xGnb.find('>ul>li');

		var d365 = new Date();
		d365.setTime(d365.getTime() + 60*60*24*356);

		// Add icon
		$xGnb_li.find('>a').prepend('<i />');
		$xGnb_li.find('>ul').prev('a').append('<b />');
		// Active Submenu Copy
		$xGnb_li.each(function(index){
			$(this).attr('data-index', index+1);
		});
		var parentIndex = $xGnb_li.find('>ul>li.active_').closest('li.active').attr('data-index');
		$xGnb_li.find('>ul>li.active_').clone().addClass('active').attr('data-index', parentIndex).prependTo('#gnbNav').find('>a').prepend('<i />');
		// GNB Click toggle
		$xGnb_li.find('>a').click(function(){
			var $this = $(this);
			var $parent = $(this).parent('li');
			var hasOpen = $parent.hasClass('open');
			var hasActive = $parent.hasClass('active');
			var hasList = $parent.find('>ul').length >= 1;
			var hasWide = $xBody.hasClass('wide');
			function openGNB(){
				$xBody.removeClass('wide');
				reflow();
			}
			if(!hasOpen && !hasActive && hasList){ // Down to open
				$parent.addClass('open').find('>ul').slideDown(100);
				openGNB();
				setCookie('__xe_admin_gnb_tx_' + $this.data('href'), 'open', d365);
				return false;
			} else if(hasOpen && !hasActive && hasList && !hasWide){ // Up to close
				$parent.removeClass('open').find('>ul').slideUp(100);
				openGNB();
				setCookie('__xe_admin_gnb_tx_' + $this.data('href'), 'close', d365);
				return false;
			} else if(hasWide && !hasList || hasActive || hasWide && hasOpen){ // Right to open
				openGNB();
				return false;
			}
		});
		// GNB Mobile Toggle
		$xGnb.find('>a[href="#gnbNav"]').click(function(){
			$(this).parent('.gnb').toggleClass('open');
			$xBody.toggleClass('wide');
			if($(window).width() <= 980 && !$xGnb.hasClass('open')){
				$('#gnbNav').removeClass('ex');
			}
			reflow();

			// remember status
			if($(this).parent('.gnb').hasClass('open')){
				setCookie('__xe_admin_gnb_status', 'open', d365);
			}else{
				setCookie('__xe_admin_gnb_status', 'close', d365);
			}
			return false;
		});

		// Expert Menu Toggle
		$xGnb.find('.exMenu>button').click(function(){
			$('#gnbNav').toggleClass('ex');
			reflow();

			// remember status
			if($('#gnbNav').hasClass('ex')){
				setCookie('__xe_admin_gnb_ex_status', 'open', d365);
			}else{
				setCookie('__xe_admin_gnb_ex_status', 'close', d365);
			}
		});

		// re-create cookie
		var gnb_status = getCookie('__xe_admin_gnb_status');
		if(gnb_status){
			setCookie('__xe_admin_gnb_status', gnb_status, d365);
		}
		var gnb_ex_status = getCookie('__xe_admin_gnb_ex_status');
		if(gnb_ex_status){
			setCookie('__xe_admin_gnb_xe_status', gnb_ex_status, d365);
		}
		if(typeof __xe_admin_gnb_txs != 'undefined'){
			for(var i in  __xe_admin_gnb_txs){
				var item = __xe_admin_gnb_txs[i];
				var status = getCookie(item);
				setCookie(item, status, d365);
			}
		}
	};
	$('.gnb').gnb();
// Default Language Selection
	$('.x #lang')
		.mouseleave(function(){
			$(this).hide();
		})
		.focusout(function(){
			var $this = $(this);
			setTimeout(function(){
				if(!$this.find('a:focus').length){
					$this.mouseleave();
				}
			}, 500);
		});
// Check All
	$('.x th :checkbox')
		.change(function() {
			var $this = $(this), name = $this.data('name');
			$this.closest('table')
				.find(':checkbox')
					.filter(function(){
						var $this = $(this);
						return !$this.prop('disabled') && (($this.attr('name') == name) || ($this.data('name') == name));
					})
						.prop('checked', $this.prop('checked'))
					.end()
				.end()
				.trigger('update.checkbox', [name, this.checked]);
		});
// Pagination
	$(document.body).on('click', '.x .x_pagination .x_disabled, .x .x_pagination .x_active', function(){
		return false;
	});
// Section Toggle
	if($('.x .section').length > 1){
		var $section_heading = $('.x .section').find('>h1:first');
		$section_heading.each(function(){
			var $this = $(this);
			if($this.next().length){
				$this.append('<button type="button" class="snToggle x_icon-chevron-up">Toggle this section</button>');
			}
		});
		$('.x .section.collapsed>h1>.snToggle').removeClass('x_icon-chevron-up').addClass('x_icon-chevron-down');
		$section_heading.click(function(){
			var $this = $(this);
			var $btnToggle = $(this).find('>.snToggle');
			var $section = $this.closest('.section');
			if(!$section.hasClass('collapsed')){
				$section.addClass('collapsed');
				$btnToggle.removeClass('x_icon-chevron-up').addClass('x_icon-chevron-down');
			} else {
				$section.removeClass('collapsed');
				$btnToggle.removeClass('x_icon-chevron-down').addClass('x_icon-chevron-up');
			}
			reflow();
		});
	}
// Alert Closer
	var $xAlert = $('.x .x_alert');
	$xAlert.prepend('<button type="button" class="x_close">&times;</button>');
	$xAlert.children('.x_close').click(function(){
		$(this).parent('.x_alert').hide();
	});
// Desabled Buttons
	$('.x .x_btn').click(function(){
		if($(this).hasClass('x_disabled')){
			return false;
		}
	});
// Vertical Divider
	$.fn.vr = function(){
		this.each(function(){
			var $this = $(this);
			if($this.text() == '|'){
				$this.addClass('vr').filter(':first-child, :last-child').remove();
			}
		});
	};
	$('.x i').vr();
// label[for] + input[id]/textarea[id]/select[id] creator
	$.fn.labelMaker = function(){
		this.each(function(index){
			index = index + 1;
			var $this = $(this);
			var input = 'input, textarea, select';
			var check = ':radio, :checkbox';
			var id = '[id]';
			var value = 'i' + index;
			if($this.next(input).filter(id).not(check).length){
			// next input, textarea, select id true
				$this.attr('for', $this.next().attr('id'));
			} else if ($this.next(input).not(id).not(check).length) {
			// next input, textarea, select id false
				$this.attr('for', value).next().attr('id', value);
			} else if ($this.prev(check).filter(id).length) {
			// prev :radio :checkbox id true
				$this.attr('for', $this.prev().attr('id'));
			} else if ($this.prev(check).not(id).length) {
			// prev :radio :checkbox id false
				$this.attr('for', value).prev().attr('id', value);
			} else if ($this.children(input).filter(id).length) {
			// children id true
				$this.attr('for', $this.children(input).filter(id).eq(0).attr('id'));
			} else if ($this.children(input).not(id).length) {
			// children id false
				$this.attr('for', value).children(input).not(id).eq(0).attr('id', value);
			}
		});
	};
	$('label:not([for])').labelMaker();
// :radio, :checkbox checked class
	$.fn.checkToggle = function(){
		function check(){
			setTimeout(function(){
				$(':checked').parent('label').addClass('checked');
				$(':not(":checked")').parent('label').removeClass('checked');
			},0);
		}
		this.change(check);
		check();
	};
	$(':radio, :checkbox').checkToggle();
// File input .overlap style
	$.fn.fileTypeOverlap = function(){
		this.each(function(){
			var $this = $(this);
			$this.wrap('<span class="fileBtn x_btn" />').before($this.attr('title'));
		});
	};
	$('input[type="file"].overlap').fileTypeOverlap();
// Table Col Span
	$.fn.tableSpan = function(){
		this.each(function(){
			var $this = $(this);
			var thNum = $this.find('>thead>tr:eq(0)>th').length;
			var $tdTarget = $this.find('>tbody>tr:eq(0)>td:only-child');
			if(thNum != $tdTarget.attr('colspan')){
				$tdTarget.attr('colspan', thNum).css('text-align','center');
			}
		});
	};
	$('table').tableSpan();
});
// Modal Window
jQuery(function($){
	var ESC = 27;
	var xeModalStack = [];
	var xeModalInitailZIndex = 1040;

	// modal backdrop
	var $xeModalBackdrop = $('<div class="x_modal-backdrop"></div>').appendTo('body').hide();

	$.fn.xeModalWindow = function(){
		this
			.not('.xe-modal-window')
			.addClass('xe-modal-window')
			.each(function(){
				$( $(this).attr('href') ).addClass('x').hide();
			})
			.click(function(){
				var $this = $(this), $modal, $btnClose, disabled;

				// get and initialize modal window
				$modal = $( $this.attr('href') );

				if($modal.data('state') == 'showing') {
					$this.trigger('close.mw');
				} else {
					$this.trigger('open.mw');
				}
				return false;
			})
			.bind('open.mw', function(){
				var $this = $(this), $modal, $btnClose, disabled, before_event, duration;

				// get modal window
				$modal = $( $this.attr('href') );

				// if stack top is this modal, ignore
				if(xeModalStack.length && xeModalStack[xeModalStack.length - 1].get(0) == $modal.get(0)){
					return;
				}

				if(!$modal.parent('body').length) {
					$btnClose = $('<button type="button" class="x_close">&times;</button>');
					$btnClose.click(function(){ $modal.data('anchor').trigger('close.mw'); });
					$modal.find('[data-hide]').click(function(){ $modal.data('anchor').trigger('close.mw'); });
					$('body').append($modal);
					$modal.prepend($btnClose); // prepend close button
				}

				// set the related anchor
				$modal.data('anchor', $this);

				// before event trigger
				before_event = $.Event('before-open.mw');
				$this.trigger(before_event);

				// is event canceled?
				if(before_event.isDefaultPrevented()) return false;

				// get duration
				duration = $this.data('duration') || 'fast';

				// set state : showing
				$modal.data('state', 'showing');

				// after event trigger
				function after(){ $this.trigger('after-open.mw'); }

				$(document).bind('keydown.mw', function(event){
					if(event.which == ESC) {
						$this.trigger('close.mw');
						return false;
					}
				});

				$modal
					.fadeIn(duration, after)
					.find('button.x_close:first').focus();

				$('body').css('overflow','hidden');

				// push to stack
				xeModalStack.push($modal);

				// show backdrop and adjust z-index
				var zIndex = xeModalInitailZIndex + ((xeModalStack.length - 1) * 2);

				$xeModalBackdrop.css('z-index', zIndex).show();
				var xeModalBackdropHeight = $xeModalBackdrop.height();
				var modalBodyHeight = xeModalBackdropHeight;
				modalBodyHeight -= $modal.find('.x_modal-header:visible').height();
				modalBodyHeight -= $modal.find('.x_modal-footer:visible').height();
				modalBodyHeight -= 150;

				$modal.find('.x_modal-body').css('height', modalBodyHeight);

				$modal.css('z-index', zIndex + 1);
			})
			.bind('close.mw', function(){
				var $this = $(this), before_event, $modal, duration;

				// get modal window
				$modal = $( $this.attr('href') );

				// if stack top is not this modal, ignore
				if(xeModalStack.length && xeModalStack[xeModalStack.length - 1].get(0) != $modal.get(0)){
					return;
				}

				// before event trigger
				before_event = $.Event('before-close.mw');
				$this.trigger(before_event);

				// is event canceled?
				if(before_event.isDefaultPrevented()) return false;

				// get duration
				duration = $this.data('duration') || 'fast';

				// set state : hiding
				$modal.data('state', 'hiding');

				// after event trigger
				function after(){ $this.trigger('after-close.mw'); }

				$modal.fadeOut(duration, after);
				$('body').css('overflow','auto');
				$this.focus();

				// pop from stack
				xeModalStack.pop();

				// hide backdrop and adjust z-index
				var zIndex = xeModalInitailZIndex + ((xeModalStack.length - 1) * 2);

				if(xeModalStack.length){
					$xeModalBackdrop.css('z-index', zIndex);
				}else{
					$xeModalBackdrop.hide();
				}

			});
		$('div.x_modal').addClass('x');
	};
	$('a.modalAnchor').xeModalWindow();
});

// Content Toggler
jQuery(function($){
	var dont_close_this_time = false;
	var ESC = 27;

	$.fn.xeContentToggler = function(){
		this
			.not('.xe-content-toggler')
			.addClass('xe-content-toggler')
			.each(function(){
				var $anchor = $(this); $layer = $($anchor.attr('href'));

				$layer.hide()
					.not('.xe-toggling-content')
					.addClass('xe-toggling-content')
					.mousedown(function(event){ dont_close_this_time = true; })
					.focusout(function(event){
						setTimeout(function(){
							if(!dont_close_this_time && !$layer.find(':focus').length && $layer.data('state') == 'showing') $anchor.trigger('close.tc');
							dont_close_this_time = false;
						}, 1);
					});
			})
			.click(function(){
				var $this = $(this), $layer;

				// get content container
				$layer = $( $this.attr('href') );

				// set anchor object
				$layer.data('anchor', $this);

				if($layer.data('state') == 'showing') {
					$this.trigger('close.tc');
				} else {
					$this.trigger('open.tc');
				}

				return false;
			})
			.bind('open.tc', function(){
				var $this = $(this), $layer, effect, duration;

				// get content container
				$layer = $( $this.attr('href') );

				// get effeect
				effect = $this.data('effect');

				// get duration
				duration = $this.data('duration') || 'fast';

				// set state : showing
				$layer.data('state', 'showing');

				// before event trigger
				$this.trigger('before-open.tc');

				dont_close_this_time = false;

				// When mouse button is down or when ESC key is pressed close this layer
				$(document)
					.unbind('mousedown.tc keydown.tc')
					.bind('mousedown.tc keydown.tc',
						function(event){
							if(event) {
								if(event.type == 'keydown' && event.which != ESC) return true;
								if(event.type == 'mousedown') {
									var $t = $(event.target);
									if($t.is('html,.tgAnchor,.tgContent') || $layer.has($t).length) return true;
								}
							}

							$this.trigger('close.tc');

							return false;
						}
					);

				// triggering after
				function trigger_after(){ $this.trigger('after-open.tc'); }

				switch(effect) {
					case 'slide':
						$layer.slideDown(duration, trigger_after);
						break;
					case 'slide-h':
						var w = $layer.css({'overflow-x':'',width:''}).width();
						$layer
							.show()
							.css({'overflow-x':'hidden',width:'0px'})
							.animate({width:w}, duration, function(){ $layer.css({'overflow-x':'',width:''}); trigger_after(); });
						break;
					case 'fade':
						$layer.fadeIn(duration, trigger_after);
						break;
					default:
						$layer.show();
						$this.trigger('after-open.tc');
				}
			})
			.bind('close.tc', function(){
				var $this = $(this), $layer, effect, duration;

				// unbind document's event handlers
				$(document).unbind('mousedown.tc keydown.tc');

				// get content container
				$layer = $( $this.attr('href') );

				// get effeect
				effect = $this.data('effect');

				// get duration
				duration = $this.data('duration') || 'fast';

				// set state : hiding
				$layer.data('state', 'hiding');

				// before event trigger
				$this.trigger('before-close.tc');

				// triggering after
				function trigger_after(){ $this.trigger('after-close.tc'); }

				// close this layer
				switch(effect) {
					case 'slide':
						$layer.slideUp(duration, trigger_after);
						break;
					case 'slide-h':
						$layer.animate({width:0}, duration, function(){ $layer.hide(); trigger_after(); });
						break;
					case 'fade':
						$layer.fadeOut(duration, trigger_after);
						break;
					default:
						$layer.hide();
						$this.trigger('after-close.tc');
				}
			});

		return this;
	};

	$('a.tgAnchor').xeContentToggler();
});

// Module finder
jQuery(function($){
	$.fn.xeModuleFinder = function(){
		this
			.not('.xe-module-finder')
			.addClass('xe-module-finder')
			.find('a.tgAnchor.findsite')
				.bind('before-open.tc', function(){
					var $this, $ul, val;

					$this = $(this);
					$ul   = $($this.attr('href')).find('>ul');
					val   = $this.prev('input:text').val();

					function on_complete(data) {
						var $li, list = data.site_list, i, c;

						$ul.empty();
						$this.closest('.modulefinder').find('.moduleList,.moduleIdList').attr('disabled','disabled');

						if(data.error || !$.isArray(list)) {
							$this.trigger('close.tc');
							return;
						}

						for(i=0,c=list.length; i < c; i++) {
							$li = $('<li />').appendTo($ul);
							$('<button type="button" />').text(list[i].domain).data('site_srl', list[i].site_srl).appendTo($li);
						}
					}

					$.exec_json('admin.getSiteAllList', {domain:val}, on_complete);
				})
			.end()
			.find('.tgContent.suggestion')
				.delegate('button','click',function(){
					var $this, $finder;

					$this    = $(this);
					$finder  = $this.closest('.modulefinder');

					function on_complete(data) {
						var $mod_select, list = data.module_list, x;

						if(data.error || !list) return;

						$mod_select = $finder.find('.moduleList').data('module_list', list).removeAttr('disabled').empty();
						for(x in list) {
							if(!list.hasOwnProperty(x)) continue;
							$('<option />').attr('value', x).text(list[x].title).appendTo($mod_select);
						}
						$mod_select.prop('selectedIndex', 0).change().focus();

						if(!$mod_select.is(':visible')) {
							$mod_select
								.slideDown(100, function(){
									$finder.find('.moduleIdList:not(:visible)').slideDown(100).trigger('show');
								})
								.trigger('show');
						}
					}

					$finder.find('a.tgAnchor.findsite').trigger('close.tc');

					$.exec_json('module.procModuleAdminGetList', {site_srl:$this.data('site_srl')}, on_complete);
				})
			.end()
			.find('.moduleList,.moduleIdList').hide().end()
			.find('.moduleList')
				.change(function(){
					var $this, $mid_select, val, list;

					$this   = $(this);
					val     = $this.val();
					list    = $this.data('module_list');

					if(!list[val]) return;

					list = list[val].list;
					$mid_select = $this.closest('.modulefinder').find('.moduleIdList').removeAttr('disabled').empty();

					for(var x in list) {
						if(!list.hasOwnProperty(x)) continue;
						$('<option />').attr('value', list[x].module_srl).text(list[x].browser_title).appendTo($mid_select);
					}
					$mid_select.prop('selectedIndex', 0).change();
				});

		return this;
	};
	$('.modulefinder').xeModuleFinder();
});

// Module Search : A New Version Of Module Finder
jQuery(function($){
	var tmpCount = 0;
	_xeModuleSearch = function(){
		var t = this;
		var $t = $(this);
		var is_multiple = $t.data('multiple');
		if(!is_multiple) is_multiple = '';
		var id = '__module_searcher_' + tmpCount;
		tmpCount++;

		// add html
		$.exec_json('module.getModuleAdminModuleSearcherHtml', {'id': id, 'is_multiple': is_multiple}, function(data){
			if(!data || !data.html) return;

			$t.after(data.html).addClass('tgAnchor').attr('href', '#' + id).xeContentToggler();

			var $moduleWindow = $t.next(".moduleWindow");
			var $siteListDiv = $moduleWindow.find('.siteList');
			var $moduleListDiv = $moduleWindow.find('.moduleList');
			var $instanceListDiv = $moduleWindow.find('.instanceList');
			var $siteList = $siteListDiv.find('>ul');
			var $moduleList = $moduleListDiv.find('>ul');
			var $instanceList = $instanceListDiv.find('>select');
			var $siteFinder = $moduleWindow.find('input.siteFinder');
			var aSiteListData;
			var MAX_LIST_HEIGHT = 280;

			function setListSize($UL, nHeight){
				var nWidth, $div;
				$UL.find('li div').width('');
				$UL.css('height', 'auto');
				$UL.css('overflow-y', '');
				if($UL.height() > nHeight){
					$div = $UL.find('li div');
					$div.width($div.width()-20+'px');
					$UL.css('height', nHeight+'px');
					$UL.css('overflow-y', 'auto');
				}
			}

			function setSiteList(sFilter){
				var sDomain;
				var rxFilter = new RegExp(sFilter, "ig");
				var list = aSiteListData;
				var replaceHighlight = function(sKeyword){ return '<span class="highlight">'+sKeyword+'</span>'; };

				$siteList.empty();

				for(i=0,c=list.length; i < c; i++) {
					sDomain = list[i].domain;
					if(sFilter){
						if(!sDomain.match(rxFilter)) continue;

						sDomain = sDomain.replace(rxFilter, replaceHighlight);
					}

					$li = $('<li />').appendTo($siteList);
					$('<a>').attr('href', '#').html(
						sDomain
					).data('site_srl', list[i].site_srl).appendTo($li);
				}

				setListSize($siteList, MAX_LIST_HEIGHT - $siteFinder.parent("div").height());

				if(list.length == 1){
					$siteList.find('a').trigger('click');
				}
			}

			$siteFinder.keyup(function(){
				setSiteList($siteFinder.val());
			});

			if(typeof console == 'undefined'){
				console={log:function(){}};
			}

			$t
				.not('.xe-module-search')
				.addClass('xe-module-search')
				.parent()
				.find('.moduleTrigger')
					.bind('before-open.tc', function(){
						var $this;

						$this = $(this);

						function on_complete(data) {
							var $li, list = data.site_list, i, c;

							if(data.error || !$.isArray(list)) {
								$this.trigger('close.tc');
								return;
							}

							aSiteListData = list;

							setSiteList($siteFinder.val());

							$siteFinder.focus();
						}

						$siteList.empty();
						$instanceList.empty();
						$moduleListDiv.hide();
						$instanceListDiv.hide();
						$.exec_json('admin.getSiteAllList', {domain:""}, on_complete);
					});
			$moduleWindow
				.find('.siteList>ul')
					.delegate('a','click',function(oEvent){
						var $this, $finder;

						$this    = $(this);
						$finder  = $this.closest('.moduleSearch');

						function on_complete(data) {

							var list = data.module_list, x;

							if(data.error || !list) return;

							for(x in list) {
								if(!list.hasOwnProperty(x)) continue;
								$li = $('<li />').appendTo($moduleList);
								$('<a>').attr('href', '#').html(
									list[x].title
								).data('moduleInstanceList', list[x].list).appendTo($li);
							}

							$moduleWindow.find('.moduleList').show();
							setListSize($moduleList, MAX_LIST_HEIGHT);

							$siteList.find('li').removeClass('x_active');
							$this.parent('li').addClass('x_active');
						}

						$moduleList.empty();
						$instanceListDiv.hide();

						$.exec_json('module.procModuleAdminGetList', {site_srl:$this.data('site_srl')}, on_complete);

						oEvent.preventDefault();
					})
				.end()
				.find('.moduleList>ul')
					.delegate('a', 'click', function(oEvent){

						var $this, $mid_select, val, list;

						$this = $(this);
						list = $this.data('moduleInstanceList');
						if(!list) return;

						t.sSelectedModuleType = $this.text();
						$instanceList.empty();

						for(var x in list) {
							if(!list.hasOwnProperty(x)) continue;

							$li = $('<option />').html(list[x].browser_title + ' (' + list[x].mid + ')').appendTo($instanceList).val(list[x].module_srl).data('mid', list[x].mid)
									.data('module_srl', list[x].module_srl).data('layout_srl', list[x].layout_srl).data('browser_title', list[x].browser_title);
						}

						$instanceListDiv.show();
						setListSize($instanceList, MAX_LIST_HEIGHT);

						$moduleList.find('li').removeClass('x_active');
						$this.parent('li').addClass('x_active');

						oEvent.preventDefault();
					})
				.end()
				.find('.moduleSearch_ok').click(function(oEvent){
						var aSelected = [];
						$instanceList.find('option:selected').each(function(){
							aSelected.push({
								'type' : t.sSelectedModuleType,
								'module_srl' : $(this).data('module_srl'),
								'layout_srl' : $(this).data('layout_srl'),
								'browser_title' : $(this).data('browser_title'),
								'mid' : $(this).data('mid')
							});
						});

						$t.trigger('moduleSelect', [aSelected]);
						$('.moduleTrigger').trigger('close.tc');

						oEvent.preventDefault();
					});
		});

		return this;
	};

	$.fn.xeModuleSearch = function(){
		$(this).each(_xeModuleSearch);
	};

	//$('.moduleTrigger').xeModuleSearch();

	// Add html for .module_search
	$.fn.xeModuleSearchHtml = function(){
		var tmpCount = 0;

		$(this).each(function(){
			var $this = $(this);
			var id = $this.attr('id');
			if(!id) id = '__module_search_' + tmpCount;
			tmpCount++;

			// add html
			var $btn = $('<a class="x_btn moduleTrigger">' + xe.cmd_find + '</a>');
			var $displayInput = $('<input type="text" readonly>');
			$this.after($btn).after('&nbsp;').after($displayInput).hide();
			$btn.xeModuleSearch();

			// on selected module
			$btn.bind('moduleSelect', function(e, selected){
				$displayInput.val(selected[0].browser_title + ' (' + selected[0].mid + ')');
				$this.val(selected[0].module_srl);
			});

			// get module info
			if($this.val()){
				$.exec_json('module.getModuleAdminModuleInfo', {'search_module_srl': $this.val()}, function(data){
					if(!data || !data.module_info) return;

					$displayInput.val(data.module_info.browser_title + ' (' + data.module_info.mid + ')');
				});
			}
		});

		return this;
	};
});

jQuery(function($){

	var _hide = $.fn.hide;
	$.fn.hide = function(speed, easing, callback, htOpt) {
		$(this).trigger('hide', [htOpt]);
		$(this).find('.active').removeClass('active');

		var sId = $(this).attr("id");

		if($(this).hasClass("col")){
			$(this).next().hide(speed, easing, callback, htOpt);

			if(sId){
				$(this).parent().find('a[href="#'+sId+'"]').parent('li.active').removeClass('active');
			}
		}

		return _hide.apply(this, arguments);
	};

	var _show = $.fn.show;
	$.fn.show = function(speed, easing, callback, htOpt) {
		$(this).trigger('show', [htOpt]);

		if($(this).hasClass("col")){
			$(this).next().hide(speed, easing, callback, htOpt);

			var $container = $(this).parent();
			setTimeout(function(){
				$container.scrollTo($container.width(), 0, {duration: 0 } );
			}, 0);
			//scrollToRight();
		}

		var rst = _show.apply(this, arguments);
		var $this = $(this);

		// elem. display not yet... using setTimeout...
		setTimeout(function(){$this.trigger('after-show', [htOpt]); }, 0);

		return rst;
	};
});

jQuery(function($){
	$.xeMsgBox = {
		htOptions : {}
	};
	//xe.cmd_cancel = "{$lang->cmd_cancel}";
	//xe.cmd_confirm = "{$lang->cmd_confirm}";
	var $msgBox = $.xeMsgBox.$msgBox = $("<section />").addClass("x_modal _common x").hide().css('z-index', 9999);
	$msgBox.html('<button type="button" class="x_close _cancel">&times;</button> <div class="x_modal-header"> <h1 class="_title"></h1> </div> <div class="x_modal-body"> <div class="_text"></div> </div> <div class="x_modal-footer"> <button type="button" class="x_btn x_pull-left _cancel">'+xe.cmd_cancel+'</button> <button type="submit" class="x_btn x_btn-inverse x_pull-right x_btn-primary _ok">'+xe.cmd_confirm+'</button> </div> ');
	$("body").append($msgBox);
	$msgBox.find("._ok").click(function(){
		$.xeMsgBox.fnOnOK();
	});
	$msgBox.find("._cancel").click(function(){
		$.xeMsgBox.fnOnCancel();
	});
	$msgBox.bind("show", function(){
		$.xeMsgBox.bVisible = true;
		$.xeMsgBox._showFoggy();
		$.xeMsgBox.fnOnShow();

		if($msgBox.find('input,button').length > 0){
			setTimeout(function(){
				$msgBox.find('input,button').each(function(n, el){
					var $el = $(el);
					if($el.is(":visible")){
						$el.focus();
						return false;
					}
				});
			},	0);
		}
	});
	$msgBox.bind("hide", function(){
		$.xeMsgBox.bVisible = false;
		$.xeMsgBox._hideFoggy();
		$.xeMsgBox.fnOnHide();
	});
	$(document.body).on('keydown', function(ev){
		if(!$.xeMsgBox.bVisible) return;

		if(ev.keyCode === 27){
			$msgBox.find("._cancel").click();
			ev.preventDefault();
		}
	});

	$.xeMsgBox.fnOnOK = function(){
		if(typeof $.xeMsgBox.htOptions.fnOnOK === "function"){
			if($.xeMsgBox.htOptions.fnOnOK()) return;
		}

		$msgBox.hide();
	};

	$.xeMsgBox.fnOnCancel = function(){
		if(typeof $.xeMsgBox.htOptions.fnOnCancel === "function") $.xeMsgBox.htOptions.fnOnCancel();

		$msgBox.hide();
	};

	$.xeMsgBox.fnOnShow = function(){
		if(typeof $.xeMsgBox.htOptions.fnOnShow === "function") $.xeMsgBox.htOptions.fnOnShow();
	};

	$.xeMsgBox.fnOnHide = function(){
		if(typeof $.xeMsgBox.htOptions.fnOnHide === "function") $.xeMsgBox.htOptions.fnOnHide();
	};


	$.xeMsgBox.showMsgBox = function(htOptions){
		// sTitle, sText, fnOnOK, fnOnCancel, bSmall, bAlert, fnOnShow, fnOnHide, bDanger
		$('head>link[rel="stylesheet"]:last').after('<link rel="stylesheet" href="./modules/menu/tpl/css/themes/default/style.css" />');
		htOptions = $.xeMsgBox.htOptions = htOptions || {};

		var sTitle = htOptions.sTitle || "";
		var sText = htOptions.sText || "";

		var bDanger = htOptions.bDanger || false;

		$msgBox.find("._title") .html(sTitle);
		$msgBox.find("._text").html(sText);

		if(sText === ""){
			$msgBox.addClass('_nobody');
		}else{
			$msgBox.removeClass('_nobody');
		}

		var $confirmBtn = $msgBox.find('._ok');
		if(bDanger){
			$confirmBtn.removeClass('x_btn-inverse');
			$confirmBtn.addClass('x_btn-danger');
		}else{
			$confirmBtn.removeClass('x_btn-danger');
			$confirmBtn.addClass('x_btn-inverse');
		}

		// #msgBox._small {width:400px;margin-left:-200px}
		// #msgBox._type_alert _cancel{display:none}
		if(htOptions.bSmall){
			$msgBox.addClass("_small");
		}else{
			$msgBox.removeClass("_small");
		}

		if(htOptions.bAlert){
			$msgBox.addClass("_type_alert");
		}else{
			$msgBox.removeClass("_type_alert");
		}

		$msgBox.show();
	};
	$.xeMsgBox.alertDialog = function(htOptions){
		htOptions = htOptions || {};
		htOptions.bAlert = true;

		this.showMsgBox(htOptions);
	};
	$.xeMsgBox.alert = function(sText){
		htOptions = {
			bAlert : true,
			bNobody : true,
			bSmall: true,
			sText : sText
		};

		this.showMsgBox(htOptions);
	};
	$.xeMsgBox.confirmDialog = function(htOptions){
		htOptions = htOptions || {};
		htOptions.bAlert = false;

		this.showMsgBox(htOptions);
	};

	var $foggyLayer = $.xeMsgBox.$foggyLayer = $("<div />");
	$foggyLayer.css({
		position: 'fixed',
		top:0,
		left:0,
		backgroundColor:'#000',
		opacity: 0.5,
		display:'none',
		zIndex:9998
	});
	//$($.find("body")).append($msgBox);
	$($.find("body")).append($foggyLayer);

	$.xeMsgBox._resizeFoggy = function(){
		$foggyLayer.css({
			width: 0,
			height: 0
		});

		setTimeout(function(){
			$foggyLayer.css({
				width: $(document).width(),
				height: $(document).height()
			});
		}, 0);
	};
	$(window).resize($.xeMsgBox._resizeFoggy);
	$.xeMsgBox._resizeFoggy();

	$.xeMsgBox._showFoggy = function(){
		$foggyLayer.show();
	};
	$.xeMsgBox._hideFoggy = function(){
		$foggyLayer.hide();
	};
});

jQuery(function($){
	$.xeFoggy = {};

	var $foggyLayer = $.xeFoggy.$foggyLayer = $("<div />");
	$foggyLayer.css({
		position: 'fixed',
		top:0,
		left:0,
		backgroundColor:'#000',
		opacity: 0.5,
		display:'none',
		zIndex:9998
	});
	$("body").append($foggyLayer);

	$.xeFoggy._resizeFoggy = function(){
		$foggyLayer.css({
			width: 0,
			height: 0
		});

		setTimeout(function(){
			$foggyLayer.css({
				width: $(document).width(),
				height: $(document).height()
			});
		}, 0);
	};
	$(window).resize($.xeFoggy._resizeFoggy);
	$.xeFoggy._resizeFoggy();

	$.xeFoggy.show = function(bClear){
		if(bClear){
			$foggyLayer.css({
				opacity: 0
			});
		}else{
			$foggyLayer.css({
				opacity: 0.5
			});
		}
		$foggyLayer.show();
	};
	$.xeFoggy.hide = function(){
		$foggyLayer.hide();
	};
});

// Sortable table
jQuery(function($){
	var
		dragging = false,
		$holder  = $('<tr class="placeholder"><td>&nbsp;</td></tr>');

	$.fn.xeSortableTable = function(){
		this
			.not('.xe-sortable-table')
			.addClass('xe-sortable-table')
			.delegate('button.dragBtn', 'mousedown.st', function(event){
				var $this, $tr, $table, $th, height, width, offset, position, offsets, i, dropzone, cols, ofspar;

				if(event.which != 1) return;

				$this  = $(this);
				$tr    = $this.closest('tr');
				$table = $this.closest('table');
				ofspar = $table.get(0).offsetParent;
				height = $tr.height();
				width  = $tr.width();

				// before event trigger
				before_event = $.Event('before-drag.st');
				$table.trigger(before_event);

				// is event canceled?
				if(before_event.isDefaultPrevented()) return false;

				position = {x:event.pageX, y:event.pageY};
				offset   = getOffset($tr.get(0), ofspar);

				$clone = $tr.attr('target', true).clone(true).appendTo($table);

				// get colspan
				cols = ($th=$table.find('thead th')).length;
				$th.filter('[colspan]').attr('colspan', function(idx,attr){ cols += attr - 1; });
				$holder.find('td').attr('colspan', cols);

				// get offsets of all list-item elements
				offsets = [];
				$table.find('tbody>tr:not([target],.sticky,:hidden)').each(function() {
					var $this = $(this), o;

					o = getOffset(this, ofspar);
					offsets.push({top:o.top, bottom:o.top+$this.height(), $item:$this});
				});

				$clone
					.addClass('draggable')
					.css({
						position: 'absolute',
						opacity : 0.6,
						width   : width,
						height  : height,
						left    : offset.left,
						top     : offset.top,
						zIndex  : 100
					});

				// Set a place holder
				$holder
					.css({
						position:'absolute',
						opacity : 0.6,
						width   : width,
						height  : '10px',
						left    : offset.left,
						top     : offset.top,
						backgroundColor : '#bbb',
						overflow: 'hidden',
						zIndex  : 99
					})
					.appendTo($table);

				$tr.css('opacity', 0.6);

				$(document)
					.unbind('mousedown.st mouseup.st')
					.bind('mousemove.st', function(event) {
						var diff, nTop, item, i, c, o;

						dropzone = null;

						diff = {x:position.x-event.pageX, y:position.y-event.pageY};
						nTop = offset.top - diff.y;

						for(i=0,c=offsets.length; i < c; i++) {
							o = offsets[i];
							if( (i && o.top > nTop) || ((i < c-1) && o.bottom < nTop)) continue;

							dropzone = {element:o.$item};
							if(o.top > nTop - 12) {
								dropzone.state = 'before';
								$holder.css('top', o.top-5);
							} else {
								dropzone.state = 'after';
								$holder.css('top', o.bottom-5);
							}
						}

						$clone.css({top:nTop});
					})
					.bind('mouseup.st', function(event) {
						var $dropzone;

						dragging = false;

						$(document).unbind('mousemove.st mouseup.st');
						$tr.removeAttr('target').css('opacity', '');
						$clone.remove();
						$holder.remove();

						if(!dropzone) return;
						$dropzone = $(dropzone.element);

						// use the clone for animation
						$dropzone[dropzone.state]($tr);

						$table.trigger('after-drag.st');
					});
			});

		return this;
	};
	$('table.sortable').xeSortableTable();
});

// filebox
jQuery(function($){
	$('.filebox')
		.bind('before-open.mw', function(){
			var $this, $list, $parentObj;
			var anchor;

			$this = $(this);
			anchor = $this.attr('href');

			$list = $(anchor).find('.filebox_list');

			function on_complete(data){
				$list.html(data.html);

				$list.find('.select')
					.bind('click', function(event){
						var selectedImages = $('input.select_checkbox:checked');
						if(selectedImages.length === 0) {
							var selectedImgSrc = $(this).closest('tr').find('img.filebox_item').attr('src');
							if(!selectedImgSrc){
								alert("None selected!");
							}else{
								$this.trigger('filebox.selected', [selectedImgSrc]);
								$this.trigger('close.mw');
							}
						}else {
							$this.trigger('filebox.selected', [selectedImages]);
							$this.trigger('close.mw');
						}
						return false;
					});

				$list.find('.x_pagination')
					.find('a')
					.filter(function(){
						if ($(this).data('toggle')) return false;
						if ($(this).parent().hasClass('x_disabled')) return false;
						if ($(this).parent().hasClass('x_active')) return false;
						return true;
					})
					.bind('click', function(){
						var page = $(this).attr('page');

						$.exec_json('module.getFileBoxListHtml', {'page': page}, on_complete);
						return false;
					});

				$('#goToFileBox')
					.find('button')
					.bind('click', function(){
						var page = $(this).prev('input').val();

						$.exec_json('module.getFileBoxListHtml', {'page': page}, on_complete);
						return false;
					});

				$list.closest('.x_modal-body').scrollTop(0);
			}

			$.exec_json('module.getFileBoxListHtml', {'page': '1'}, on_complete);
		});
// Details toggle in admin table
	var simpleBtn = $('.x .dsTg .__simple');
	var detailBtn = $('.x .dsTg .__detail');
	var tdTitle = $('.x .dsTg td.title');
	tdTitle.each(function(){
		var $t = $(this);
		if($t.find('p.x_alert').length === 0){
			$t.addClass('tg').find('>*:not(:first-child)').hide();
		}
	});
	var details = $('.x .dsTg td.tg>*:not(:first-child)');
	simpleBtn.click(function(){
		details.hide();
		detailBtn.removeClass('x_active');
		simpleBtn.addClass('x_active');
	});
	detailBtn.click(function(){
		details.show();
		detailBtn.addClass('x_active');
		simpleBtn.removeClass('x_active');
	});
});

// Multilingual Window
jQuery(function($){
	$.fn.xeMultilingualWindow = function(options){
		var $g11n_get = $(this);
		var $g11n_create = $g11n_get.find('#lang_create');
		var $g11n_search = $g11n_get.find('#lang_search');
		var is_create_changed = false;

		// options
		options = $.extend({
			create_type: 'save_and_use',
			modify_type: 'save_and_use',
			view_use: true,
			view_modify: true,
			view_delete: false,
			list_count: 5
		}, options || {});

		// change text
		if(options.create_type != 'save_and_use'){
			$g11n_create.find('.save-useit').text(xe.cmd_save);
		}

		// #lang_create confirm
		function g11n_create_save_confirm(){
			if($g11n_create.is(':visible') && is_create_changed){
				if(confirm(xe.msg_confirm_save_and_use_multilingual)){
					$g11n_create.find('.save-useit').trigger('click');
				}
			}

			return true;
		}

		// #lang_search confirm
		function g11n_search_save_confirm(){
			if($g11n_search.is(':visible') && $g11n_search.find('.editMode').length){
				var $search_item = $g11n_search.find('.editMode');
				if(confirm(xe.msg_confirm_save_and_use_multilingual)){
					$search_item.find('.save').trigger('click');
				}else{
					$search_item.find('.cancel').trigger('click');
				}
			}

			return true;
		}

		// #g11n Reset to default
		function g11n_reset_default(){
			$g11n_search.find('.item > fieldset').hide().prev('a').children('i').removeClass('x_icon-chevrom-up').addClass('x_icon-chevron-down');
			$g11n_get.find('[href="#lang_create"]').trigger('click');
			$g11n_create.find('.editMode').children('textarea').val('');
			is_create_changed = false;

			return true;
		}

		// before open
		function g11n_before_open(code){
			if(!code){
				g11n_get_list(1, xe.current_lang, '', '', false);
			}else{
				g11n_get_list(1, xe.current_lang, '', code, false);
				$g11n_get.find('[href="#lang_search"]').trigger('click', true);
			}
		}

		// before close
		function g11n_before_close(){
			if(!g11n_create_save_confirm()) return false;
			if(!g11n_search_save_confirm()) return false;
			if(!g11n_reset_default()) return false;
		}

		// use lang code
		function g11n_use_lang_code(code, value){
			var $target = $g11n_get.data('lang-target');
			is_create_changed = false;

			if($target)
				$target.trigger('selected.g11n', [code, value]);
		}

		// get list
		function g11n_get_list(page, lang_code, search_keyword, name, scroll){
			if(typeof page == 'undefined') page = 1;
			if(typeof lang_code == 'undefined') lang_code = xe.current_lang;
			if(typeof search_keyword == 'undefined') search_keyword = '';
			if(typeof name == 'undefined') name = '';
			if(typeof scroll == 'undefined') scroll = true;

			$.exec_json('module.getModuleAdminLangListHtml', {
				'page': page,
				'lang_code': lang_code,
				'search_keyword': search_keyword,
				'name': name,
				'list_count': options.list_count,
				'mid': current_url.getQuery('mid')
			}, function(data){
				if(!data || !data.html) return;

				$g11n_search.html(data.html);

				g11n_search_page();
				g11n_search_search();
				g11n_search_text();
				g11n_search_button();

				if(scroll) document.location.href = '#lang_search';

				if(name){
					$('#lang_search').find('[href^="#lang-"]').trigger('click');
				}
			});
		}

		// page
		function g11n_search_page(){
			$g11n_search.find('.x_pagination a').click(function(){
				var page = $(this).data('page');
				var search_keyword = $(this).data('search_keyword');
				var lang_code = $(this).data('current_lang');

				if(!page) return;

				g11n_get_list(page, lang_code, search_keyword);
				return false;
			});

			$g11n_search.find('.x_pagination').submit(function(){
				var page = $(this).find('[name="page"]').val();
				var search_keyword = $(this).data('search_keyword');
				var lang_code = $(this).data('current_lang');

				if(!page) return false;

				g11n_get_list(page, lang_code, search_keyword);
				return false;
			});
		}

		// search
		function g11n_search_search(){
			$g11n_search.find('.search').submit(function(){
				var search_keyword = $(this).find('[name="search_keyword"]').val();
				var lang_code = $(this).find('[name="lang_code"]').val();

				g11n_get_list(1, lang_code, search_keyword);
				return false;
			});

			$g11n_search.find('#search_cancel').click(function(){
				g11n_get_list(1, xe.current_lang, '');
			});
		}

		// text click
		function g11n_search_text(){
			$g11n_search.find('.set').append('<i class="x_icon-chevron-down"></i>').click(function(){
				var $this = $(this);
				var lang_code = $this.data('lang_code');

				g11n_search_save_confirm();

				// Fieldset close/open display
				var up = 'x_icon-chevron-up';
				var down = 'x_icon-chevron-down';
				if($this.next('fieldset').is(':visible')){
					$this.children('i').removeClass(up).addClass(down);
				}else{
					$this.parent('.item').siblings('.item').find('a > i').removeClass(up).addClass(down).end().children('fieldset').hide();
					$this.children('i').removeClass(down).addClass(up);
				}

				if(typeof $this.data('is_loaded') != 'undefined') return;

				$.exec_json('module.getModuleAdminLangCode', {
					'name': lang_code,
					'mid': current_url.getQuery('mid')
				}, on_complete);

				function on_complete(data){
					var $textareas = $this.next('fieldset').find('textarea');

					$textareas.each(function(){
						var $this = $(this);
						var value = data.langs[$this.data('lang')];
						var pattern = /^\$user_lang->/;

						if(pattern.test(value)){
							$this.val('').data('value', '');
						}else{
							$this.val(value).data('value', value);
						}
					});

					$this.data('is_loaded', true);
				}
			});
		}

		// search buttons
		function g11n_search_button(){
			if(!options.view_use) $g11n_search.find('.useit').hide();
			if(!options.view_modify) $g11n_search.find('.modify').hide();
			if(!options.view_delete) $g11n_search.find('.delete').hide();
			if(options.modify_type == 'save'){
				$g11n_search.find('.save').text(xe.cmd_save);
			}

			// Modify click
			$g11n_search.find('.modify').click(function(){
				$(this).closest('fieldset').addClass('editMode').find('textarea').removeAttr('disabled');
				$(this).siblings('.cancel').prependTo($(this).parent());
				$(this).siblings('.delete').attr('disabled', 'disabled');
			});

			// Cancel Click
			$g11n_search.find('.cancel').click(function(){
				$(this).closest('fieldset').removeClass('editMode').find('textarea').attr('disabled', 'disabled').each(function(){
					var $this = $(this);

					$this.val($this.data('value'));
				});

				$(this).siblings('.modify').prependTo($(this).parent());
				$(this).siblings('.delete').removeAttr('disabled');

				return false;
			});

			// Delete click
			$g11n_search.find('.delete').click(function(){
				if(!confirm(xe.confirm_delete)) return;

				var $this = $(this);

				lang_name = $this.closest('.item').find('[href^="#lang-"]').data('lang_code');

				$.exec_json('module.procModuleAdminDeleteLang', {
					'name': lang_name,
					'mid': current_url.getQuery('mid')
				}, function (data){
					if(!data) return;
					if(data.error){
						alert(data.message);
						return;
					}

					var $pagination = $g11n_search.find('.x_pagination');
					var page = $pagination.data('page');
					var search_keyword = $pagination.data('search_keyword');
					var lang_code = $pagination.data('lang_code');

					if(!page) $page = 1;

					g11n_get_list(page, lang_code, search_keyword);
				});
			});

			// Save Click
			$g11n_search.find('.item').submit(function(){
				var $this = $(this);
				var $textareas = $this.find('.editMode').children('textarea');
				var $anchor = $this.find('[href^="#lang-"]');
				var params = {};
				var current_lang_value = null;

				// create lang list
				$textareas.each(function(){
					var $this = $(this);
					params[$this.attr('class')] = $this.val();
					$this.data('tmp_value', $this.val());
					if(xe.current_lang == $this.attr('class')){
						current_lang_value = $this.val();
					}
				});

				params.lang_name = $anchor.data('lang_code');
				params.mid = current_url.getQuery('mid');

				// submit
				$.exec_json('module.procModuleAdminInsertLang', params, function (data){
					if(!data || data.error || !data.name) return;

					$textareas.each(function(){
						var $this = $(this);
						$this.data('value', $this.data('tmp_value'));
					});
					$anchor.children('span').html(current_lang_value);

					$g11n_search.find('.cancel').trigger('click');
					$this.find('.useit').trigger('click');
				});

				return false;
			});

			// Useit click
			$g11n_search.find('.useit').click(function(){
				var $this = $(this);
				var $anchor = $this.closest('.item').find('[href^="#lang-"]');
				var name = $anchor.data('lang_code');
				var value = $anchor.children('span').text();

				g11n_use_lang_code(name, value);
			});
		}

		// tabbale
		$g11n_get.find('.x_tabbable').xeTabbable();

		// check create change
		$g11n_create.find('.editMode textarea').change(function(){
			is_create_changed = true;
		});

		// Save-Useit click
		$g11n_create.submit(function(){
			var $this = $(this);
			var params = {};
			var current_lang_value = null;

			// create lang list
			$this.find('.editMode').children('textarea').each(function(){
				var $this = $(this);
				params[$this.attr('class')] = $this.val();
				if(xe.current_lang == $this.attr('class')){
					current_lang_value = $this.val();
				}
			});

			if(!current_lang_value){
				alert(xe.msg_empty_multilingual);
				return false;
			}

			params.mid = current_url.getQuery('mid');

			// submit
			$.exec_json('module.procModuleAdminInsertLang', params, on_complete);

			function on_complete(data){
				if(!data || data.error || !data.name) return;

				if(options.create_type == 'save_and_use'){
					g11n_use_lang_code(data.name, current_lang_value);
				}else{
					alert(data.message);
					g11n_reset_default();
				}
			}

			return false;
		});

		$g11n_get.find('[href="#lang_search"]').click(function(e, just_tab){
			if(typeof(just_tab) == 'undefined'){
				g11n_get_list();
			}
		});

		// default
		$g11n_get.bind('reset.g11n', function(){
			g11n_reset_default();
		});

		// before open
		$g11n_get.bind('before-open.g11n', function(e, code){
			g11n_before_open(code);
		});

		// before close
		$g11n_get.bind('before-close.g11n', function(){
			return g11n_before_close();
		});

		return this;
	};
});

// Load Multilingual Window Markup
var is_loaded_multilingual_window_html = false;
jQuery(function($){
	$.fn.xeLoadMultilingualWindowHtml = function(){
		function on_complete(data){
			// append html
			var $content = $('#content');
			$(data.html).appendTo($content).xeMultilingualWindow();
			$('.lang_code').trigger('loaded-multilingualWindow');
		}
		$.exec_json('module.getModuleAdminMultilingualHtml', {
			'mid': current_url.getQuery('mid')
		}, on_complete);

		return this;
	};
});

// Apply Multilingual UI
var multilingual_id_count = 0;
jQuery(function($){
	$.fn.xeApplyMultilingualUI = function(){
		$(this).each(function(){
			// load multilingual window html
			if(!is_loaded_multilingual_window_html){
				$().xeLoadMultilingualWindowHtml();
				is_loaded_multilingual_window_html = true;
			}

			// make UI
			var $this = $(this);
			var t = this;

			if($this.parent().hasClass('g11n')){
				$this.siblings().remove();
			}else{
				$this.wrap('<span></span>');
			}

			var id = $this.attr('id');
			if(!id){
				id = '__lang_code_' + multilingual_id_count;
				multilingual_id_count++;
				$this.attr('id', id);
			}

			function makeUI(){
				var $multilingualWindow = $('#g11n');
				var width = $this.width();
				var $displayInput;

				if(t.tagName == 'TEXTAREA' || $this.data('type') == 'textarea'){
					$displayInput = $('<textarea id="lang_' + id + '" class="lang_code" style="width:' + width + 'px" data-width="' + width + '">').data('lang-id', id);
				}else{
					$displayInput = $('<input type="text" id="lang_' + id + '" class="lang_code" style="width:' + (width-28) + 'px" data-width="' + (width-28) + '">').data('lang-id', id);
				}
				$displayInput.attr('placeholder', $this.attr('placeholder'));

				var $remover = $('<button type="button" class="x_add-on remover" title="' + xe.cmd_remove_multilingual_text + '"><i class="x_icon-remove"></i>' + xe.cmd_remove_multilingual_text + '</button>').data('lang-target', id);
				var $setter = $('<a href="#g11n" class="x_add-on modalAnchor" title="' + xe.cmd_set_multilingual_text + '"><i class="x_icon-globe"></i>' + xe.cmd_set_multilingual_text + '</a>').data('lang-target', id);

				$this.parent().addClass('g11n').addClass('x_input-append');
				$this.after($displayInput, $remover, $setter);
				$this.hide();
				$setter.attr('href', '#g11n').xeModalWindow();

				// bind selected
				$displayInput.bind('selected.g11n', function(e, code, value){
					var width = $displayInput.width();

					if(!$displayInput.data('active')){
						width -= 44;
					}

					$displayInput
						.width(width)
						.attr('disabled', 'disabled')
						.val(value)
						.data('active', true)
						.parent('.g11n').addClass('active');
					$displayInput.siblings('#' + $displayInput.data('lang-id')).val('$user_lang->' + code);
					$setter.trigger('close.mw');
				});

				// bind open window
				$setter.bind('open.mw',function(){
					var $this = $(this);
					//var $displayInput = $this.siblings('.lang_code');

					if($displayInput.data('active')){
						$multilingualWindow.trigger('before-open.g11n', $displayInput.prev('.lang_code').val().replace('$user_lang->', ''));
					}else{
						$multilingualWindow.trigger('before-open.g11n');
					}

					$multilingualWindow.data('lang-target', $displayInput);
				});

				// bind close window
				$setter.bind('before-close.mw', function(){
					return $multilingualWindow.trigger('before-close.g11n');
				});

				// Remover click
				$remover.click(function(){
					var $this = $(this);
					var $g11n_set_input = $('#lang_' + $this.data('lang-target'));

					if(!$g11n_set_input.data('active')) return;

					var width = $g11n_set_input.width();
					$g11n_set_input
						.val('')
						.removeAttr('disabled')
						.width(width + 44)
						.data('active', false)
						.parent('.g11n').removeClass('active');
					$this.siblings('.lang_code').val('');
				});

				// if change text, copy
				var $hiddenInput = $this;
				$displayInput.bind('change keyup', function(){
					$this = $(this);

					if($this.data('active')) return;

					$hiddenInput.val($this.val());
				});

				// reset
				function reset(){
					$displayInput
						.val($hiddenInput.val())
						.width($displayInput.data('width'))
						.removeAttr('disabled')
						.data('active', false);
					$displayInput.parent('.g11n').removeClass('active');
				}

				// load value
				function loadValue(){
					reset();
					var pattern = /^\$user_lang->/;

					function on_complete2(data){
						if(!data || !data.langs) return;

						var width = $displayInput.width();

						$displayInput.closest('.g11n').addClass('active');
						$displayInput.val(data.langs[xe.current_lang]).attr('disabled', 'disabled').width(width - 44).data('active', true);
					}

					if(pattern.test($displayInput.val())){
						$.exec_json('module.getModuleAdminLangCode', {
							'name': $displayInput.val().replace('$user_lang->', ''),
							'mid': current_url.getQuery('mid')
						}, on_complete2);
					}
				}

				$this.bind('reload-multilingual', loadValue);
				loadValue();
			}

			if($('#g11n').length){
				makeUI();
			}else{
				$this.bind('loaded-multilingualWindow', makeUI);
			}

		});
		return this;
	};

	// Remove XE 1.5 UI
	$('.vLang[type="hidden"]').each(function(){
		var $this = $(this);

		if($this.next('textarea.vLang').length){
			$this.data('type', 'textarea');
		}

		$this.removeClass('vLang').addClass('lang_code');
		$this.parent()
			.find('.editUserLang').remove()
			.end()
			.find('.vLang').remove();
	});

	$('.lang_code').xeApplyMultilingualUI();
});

function getOffset(elem, offsetParent) {
	var top = 0, left = 0;

	while(elem && elem != offsetParent) {
		top  += elem.offsetTop;
		left += elem.offsetLeft;

		elem = elem.offsetParent;
	}

	return {top:top, left:left};
}

//----------------menu selector start
jQuery._xeAdminVar = jQuery._xeAdminVar || {};

jQuery(function($){
	var $container;
	var aSelectedModules;
	var htNodeInfo;
	var fnOnSelect;
	var bMultiSelect;

	//data-multiple
	$.xeMenuSelectorVar = {bMultiSelect: false};

	$.template('menuSelector_menuTree', '<ul>{{html Nodes}}</ul>');
	$.template('menuSelector_menuTreeNode', '<li> <a href="#" class="_nodeType_${NodeType} _menu_node _menu_url_${MenuUrl}" data-param=\'{ "sMenuId":"${MenuId}", "sMenuUrl":"${MenuUrl}", "sMenuTitle":"${MenuTitle}", "sType":"${MenuType}", "sModuleSrl":"${ModuleSrl}" }\'>${MenuTitle}</a> {{html SubTree}} </li>'); //data-param=\'{ "sMenuId":"${MenuId}", "sMenuUrl":"${MenuUrl}", "sMenuTitle":"${MenuTitle}" }\'
	function onSiteMapReceived(htData){
		var $ = jQuery;

		var aMenuList = htData.menuList;

		var sTreeHtml = createTreeMarkup(aMenuList, 0, "menuSelector_menuTree", "menuSelector_menuTreeNode");
		$container.html(sTreeHtml);

		bMultiSelect = $.xeMenuSelectorVar.bMultiSelect;

		var htConf = {
				"plugins" : ["themes","html_data","ui","crrm"],

				"crrm" : {
					"move" : {
						"check_move" : function (m) {
							var p = this._get_parent(m.o);

							// root is not draggable
							if(p === -1) return false;

							// a menu cann't be dragged to a root position
							p = this._get_parent(m.np);
							if(!p) return false;

							return true;
						}
					}
				},

				"core" : {  }
			};

		if(!bMultiSelect){
			htConf.ui = {
					select_multiple_modifier : false
				};
		}
		$container
			.jstree(htConf)
			.bind("loaded.jstree", function (event, data) {
				data.inst.open_all();

				var sRenameId = $._xeAdminVar.sRenameOnload;
				$._xeAdminVar.sRenameOnload = null;

				var sSelectOnload = $._xeAdminVar.sSelectOnload;
				$._xeAdminVar.sSelectOnload = null;

				if(sRenameId){
					//console.log('renaming', sRenameId);
					$("#siteMapTree").jstree("rename", $("#menu"+sRenameId));
					$("#menu"+sRenameId)[0].scrollIntoView(true);
				}

				if(sSelectOnload){
					//console.log('selecting', sSelectOnload);
					var el = $("#menu"+sSelectOnload)[0];

					if(el){
						$("#siteMapTree").jstree("select_node", $(el));
						el.scrollIntoView(true);
					}
				}

				//console.log($(this).find('A._menu_node').css('visibility', 'hidden'));
				$(this).find('A._menu_node').filter(function(nIdx, node){
					var $node = $(node);

					if(!isSelectable($node)){
						$node.css('opacity', '0.2');
					}
				});
				//jstree-leaf
			})
			.bind("select_node.jstree", function(event, data){
				//console.log(data);
				//jstree-clicked
			})
			.bind('before.jstree', function (event, data){
				if (data.func == 'select_node') {
					$node = $(data.args[0]);

					if(!isSelectable($node)){
						event.stopImmediatePropagation();
						return false;
					}
				}
			});

		// disable sitemap labels and shortcuts.
		$container.find('._nodeType_1, ._nodeType_3').parent('li').addClass('x_disabled');
	}

	function isSelectable($node){
		//data-param:{sMenuId":"578", "sMenuUrl":"page_ANom60", "sMenuTitle":"wwww", "sType":"WIDGET" }
		var htParam = $.parseJSON($node.attr('data-param'));
		//console.log(htParam);
		if($.xeMenuSelectorVar.aAllowedType.length > 0 && $.inArray(htParam.sType, $.xeMenuSelectorVar.aAllowedType) < 0){
			return false;
		}
		if($.inArray(htParam.sType, $.xeMenuSelectorVar.aDisallowedType) > -1){
			return false;
		}

		return true;
	}

	$.xeShowMenuSelector = function($container_param, site_srl_param, fnOnSelect_param, aSelectedModules_param){
		var $ = jQuery;

		var params = {
			menu_srl : 0,
			site_srl : site_srl_param
		};

		$container = $container_param;
		aSelectedModules = aSelectedModules_param;
		fnOnSelect = fnOnSelect_param;
		htNodeInfo = {};

		$.exec_json("menu.getMenuAdminSiteMap", params, onSiteMapReceived);
	};

	// return html
	function createTreeMarkup(aNode, sParentSrl, sMenuTree, sMenuTreeNode){
		var $ = jQuery;

		sMenuTree = sMenuTree || "menuSelector_menuTree";
		sMenuTreeNode = sMenuTreeNode || "menuSelector_menuTreeNode";

		if(aNode.length === 0){
			return "";
		}

		var sActiveBtn, sNormalBtn, sHoverBtn, sExpand, sLink, aSubNodes, sNodeSrl, sOpenWindow, nSelected, sText, sURL, sIsStartModule, aSubNode, sModuleType;

		// 1: Sitemap node, 2: Menu node
		var nNodeType;
		var sModuleSrl;
		var sResult = "";
		var sTargetPanel;
		for(var i=0, nLen=aNode.length; i<nLen; i++){
			aNode[i].sParentSrl = sParentSrl;
			sModuleSrl = "";

			// Only sitemap node has menuSrl
			if(aNode[i].menuSrl){
				nNodeType = 1;
			}else{
				nNodeType = 2;
			}

			sURL = "";
			switch(nNodeType){
				case 1:
				sText  = aNode[i].title;
				sNodeSrl  = aNode[i].menuSrl;

				aSubNode  = aNode[i].menuItems.list;

				sTargetPanel = "#propertiesRoot";
				sModuleType = "_ROOT";

				break;

				case 2:
				sText  = aNode[i].text;
				sLink  = aNode[i].link;
				sURL  = aNode[i].url;
				sNodeSrl  = aNode[i].node_srl;
				//sParentSrl  = aNode[i].parent_srl;

				sExpand  = aNode[i].expand;
				sOpenWindow  = aNode[i].open_window;

				nSelected  = aNode[i].selected;

				sActiveBtn  = aNode[i].active_btn;
				sNormalBtn  = aNode[i].normal_btn;
				sHoverBtn = aNode[i].hover_btn;

				sIsStartModule = aNode[i].is_start_module;

				aSubNode  = aNode[i].list;

				sModuleType = aNode[i].module_type;
				sModule = aNode[i].module;

				sTargetPanel = "#properties";

				if(aNode[i].is_shortcut === "Y"){
					sModuleType = "_SHORTCUT";
					sURL = "";
					aNode[i].bShortCut = true;
				}else{
					aNode[i].bShortCut = false;
				}

				break;

				default:
			}

			htNodeInfo[sNodeSrl] = aNode[i];
			htNodeInfo[sNodeSrl].aNode = aSubNode || [];

			htNodeInfo[sNodeSrl].nNodeType = nNodeType;
			htNodeInfo[sNodeSrl].sNodeSrl = sNodeSrl;
			htNodeInfo[sNodeSrl].sText = sText;
			htNodeInfo[sNodeSrl].sMenuNameKey = htNodeInfo[sNodeSrl].menu_name_key;
			htNodeInfo[sNodeSrl].sModuleSrl = sModuleSrl = htNodeInfo[sNodeSrl].module_srl;

			htNodeInfo[sNodeSrl].sModuleType = sModuleType;

			sSubTree = "";
			if(aSubNode && aSubNode.length>0){
				sSubTree = createTreeMarkup(aSubNode, sNodeSrl, sMenuTree, sMenuTreeNode);
			}
			var sTextWithIcons = sText;
			if(sIsStartModule){
				sTextWithIcons += " ${h}";
			}
			if(htNodeInfo[sNodeSrl].sModuleType === "_SHORTCUT"){
				sTextWithIcons += " ${s}";
				nNodeType = 3;
			}

			var $node = $.tmpl( sMenuTreeNode, {MenuTitleWithHome:sTextWithIcons,MenuTitle:sText,MenuId:sNodeSrl,MenuUrl:sURL,NodeType:nNodeType,MenuType:sModuleType,SubTree:sSubTree,Target:sTargetPanel,ModuleSrl:sModuleSrl} )
						.data('sMenuId', sNodeSrl).data('sMenuUrl', sURL).data('sMenuTitle', sText).data('sMenuType', sModuleType);
			//data-param=\'{ "sMenuId":"${MenuId}", "sMenuUrl":"${MenuUrl}", "sMenuTitle":"${MenuTitle}" }\'
			//console.log($node);
			sResult += $node[0].outerHTML.replace("${h}", "<i class='x_icon-home' title='Home Page'>[HOME]</i>").replace("${s}", "<i class='x_icon-share' title='Shortcut'></i>");
		}

		return $.tmpl( sMenuTree, {Nodes:sResult} ).get()[0].outerHTML;
	}

	$.xeShowMenuSelectorIn = function($container){
		$.xeMenuSelectorVar.$container = $container;
		var $btn = $container;

		$.xeMenuSelectorVar.bMultiSelect = ""+$btn.data('multiple') == "true";
		//{sMenuId":"578", "sMenuUrl":"page_ANom60", "sMenuTitle":"wwww", "sType":"WIDGET" }
		$.xeMenuSelectorVar.aAllowedType = $.grep((""+($btn.data('allowedType') || '')).split(','), function(el){return el !== '';});
		$.xeMenuSelectorVar.aDisallowedType = $.grep((""+($btn.data('disallowedType') || '')).split(','), function(el){return el !== '';});
		$.xeMenuSelectorVar.aDisallowedType.push("_ROOT");
		$.xeMenuSelectorVar.aDisallowedType.push("_SHORTCUT");

		$container.not('._eventBound').addClass('_eventBound').on('change', '.site_selector', function(ev){
			var sSiteSrl = $(this).val();
			$.xeShowMenuSelector($container.find('.tree'), sSiteSrl);

			$container.trigger('site_changed');
		});

		$.exec_json('admin.getSiteAllList', {domain:""}, onSiteAllListCompleted);
	};
	function xeMenuSearch(ev){
		var $btn = $(ev.target);
		$.xeMenuSelectorVar.bMultiSelect = ""+$btn.data('multiple') == "true";
		//{sMenuId":"578", "sMenuUrl":"page_ANom60", "sMenuTitle":"wwww", "sType":"WIDGET" }
		$.xeMenuSelectorVar.aAllowedType = $.grep((""+($btn.data('allowedType') || '')).split(','), function(el){return el !== '';});
		$.xeMenuSelectorVar.aDisallowedType = $.grep((""+($btn.data('disallowedType') || '')).split(','), function(el){return el !== '';});
		$.xeMenuSelectorVar.aDisallowedType.push("_ROOT");
		$.xeMenuSelectorVar.aDisallowedType.push("_SHORTCUT");

		if($.inArray('page', $.xeMenuSelectorVar.aAllowedType) > -1){
			$.xeMenuSelectorVar.aAllowedType.push('ARTICLE', 'WIDGET', 'OUTSIDE');
		}

		if($.inArray('page', $.xeMenuSelectorVar.aDisallowedType) > -1){
			$.xeMenuSelectorVar.aDisallowedType.push('ARTICLE', 'WIDGET', 'OUTSIDE');
		}

		//bMultiSelect = //data-multiple

		$.xeMenuSelectorVar.$container = $.xeMsgBox.$msgBox;

		$.xeMsgBox.confirmDialog({
			sTitle : xe.msg_select_menu,

			sText : '<select class="site_selector" style="width:100%;display:none"></select><div class="tree"></div>',

			bSmall: true,

			bDanger: true,

			fnOnOK : function(){
//				console.log($container.find('.jstree-clicked'));

				var aSelected = [];
				$container.find('.jstree-clicked').each(function(idx, el){
					var htParam = $.parseJSON($(this).attr('data-param'));
					/*
					sMenuId : "552"
					sMenuTitle : "222"
					sMenuUrl : "page_QLQK2400"
					*/
					aSelected.push({browser_title: htParam.sMenuTitle, mid: htParam.sMenuUrl, module_srl: htParam.sModuleSrl, menu_id: htParam.sMenuId, type: htParam.sType});
//					console.log(htParam);
				});

				$btn.trigger('moduleSelect', [aSelected]);
			}
		});


		$.exec_json('admin.getSiteAllList', {domain:""}, onSiteAllListCompleted);
	}

	function onSiteAllListCompleted(htRes){
		var aSiteList = htRes.site_list;

		//$container = $('.x_modal._common .tree');
		$container = $.xeMenuSelectorVar.$container.find('.tree');

		// show and fill in
		//var $SiteSelector = $('.x_modal._common .site_selector');
		var $SiteSelector = $.xeMenuSelectorVar.$container.find('.site_selector');

		var nLen = aSiteList.length;
		if(nLen <= 1){
			// leave the site selector hidden
			$SiteSelector.hide();
		}else{
			$SiteSelector.html("");
			for(var i=0; i<nLen; i++){
				$SiteSelector.append($("<option>").val(aSiteList[i].site_srl).html(aSiteList[i].domain));
			}
			$SiteSelector.show();
		}
		$.xeShowMenuSelector($container, "0");
	}

	// Add html for .module_search
	$.fn.xeMenuSearchHtml = function(){
		var tmpCount = 0;

		$(this).each(function(){
			var $this = $(this);
			var id = $this.attr('id');
			if(!id) id = '__module_search_' + tmpCount;
			tmpCount++;

			var sMultiple = $this.attr('data-multiple');
			var sAllowedType = $this.attr('data-allowedType');
			var sDisallowedType = $this.attr('data-disallowedType');

			// add html
			var $btn = $('<a class="x_btn moduleTrigger">' + xe.cmd_find + '</a>');
			$btn.data('multiple', sMultiple);
			$btn.data('allowedType', sAllowedType);
			$btn.data('disallowedType', sDisallowedType);
			var $displayInput = $('<input type="text" readonly>');
			$this.after($btn).after('&nbsp;').after($displayInput).hide();
			$btn.data('multiple', $(this).data('multiple'));
			$btn.on('click', xeMenuSearch);

			// on selected module
			$btn.bind('moduleSelect', function(e, selected){
				$displayInput.val(selected[0].browser_title + ' (' + selected[0].mid + ')');
				$this.val(selected[0].module_srl);
			});

			// get module info
			if($this.val()){
				$.exec_json('module.getModuleAdminModuleInfo', {'search_module_srl': $this.val()}, function(data){
					if(!data || !data.module_info) return;

					$displayInput.val(data.module_info.browser_title + ' (' + data.module_info.mid + ')');
				});
			}
		});

		return this;
	};

	$msgBox = $('.x_modal._common');
	$msgBox.on('change', '.site_selector', function(ev){
		var sSiteSrl = $(this).val();
		$.xeShowMenuSelector($container, sSiteSrl);
	});

	$.fn.xeMenuSearch = function(){
		$(this).each(function(nIdx, el){
			$(el).on('click', xeMenuSearch);
		});
	};

	$('.module_search').xeMenuSearchHtml();

	$('.moduleTrigger').xeMenuSearch();

});

//----------------menu selector end

jQuery(function($){
	//_alert = alert;
	try {
		window.alert = function(){
			return $.xeMsgBox.alert.apply($.xeMsgBox, arguments);
		};
		setTimeout(function(){$('div.message.info').fadeOut(1000);}, 2500);
	}catch(e){}
});

jQuery(function($){
	$('#site,.x_modal._common').on('keydown', 'input', function(ev){
		var $container, $btn;
		if(ev.keyCode === 13){
			$container = $(ev.target).parent();
			while($container && !$container.hasClass('col')){
				$btn = $container.find('button.x_btn-primary,button.x_btn-inverse');
				if($btn.length>0){
					// multi-lang field won't set the value until the input element is blured
					if($(ev.target).hasClass('lang_code')) $(ev.target).blur();

					ev.preventDefault();
					$btn.click();
					break;
				}
				$container = $container.parent();
			}
		}
	});
});
