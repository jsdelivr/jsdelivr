jQuery(function($){

$('#theme,#skin')
	// 'show all' button
	.find('button.showAll')
		.text('Show All')
		.click(function(){
			var $this = $(this), $thumbarea = $('#skin').find('>.thumbPreview');

			if($this.toggleClass('hideAll').hasClass('hideAll')) {
				$this.text('Hide All');
				$thumbarea.children('li')
					.addClass('active')
					.removeClass('highlight')
					.eq(0).addClass('highlight').end()
					.find('>ul.a:not(.selected)').show();
			} else {
				$this.text('Show All');
				$thumbarea.children('li')
					.removeClass('active highlight')
					.find('>ul.a:not(.selected)').hide();
			}
		})
	.end()
	// all thumbnail area
	.find('>.thumbPreview')
		.removeClass('jx')
		// thumbnail list
		.find('ul.a')
			.hide()
			.before('<ul class="a selected"></ul>')
			.prev('ul.a')
				.each(function(){
					var $this = $(this);

					$this
						.delegate('span.thumb', 'click', function(){
							$(this).closest('.a').nextAll('a.prevToggle:first').trigger('toggle.tp');
							return false;
						})
						.append($this.next('.a').find('>li.noDirection:first'));
				})
			.end()
			.after('<a href="#toggle-tp" class="prevToggle">Show</a>')
			.next('a.prevToggle')
				.bind('toggle.tp', function(){
					var $list = $(this).prev('.a'), $items, duration = 100;

					$items = $list.closest('.thumbPreview').children('li').removeClass('highlight').end();

					if($list.parent().toggleClass('active').hasClass('active')) {
						$list.slideDown(duration).closest('li').addClass('highlight');
					} else {
						$list.slideUp(duration);
					}
				})
				.click(function(){ $(this).trigger('toggle.tp'); return false; })
			.end()
			// thumbnail act as a label for a radio button
			.find('span.thumb')
				.attr('role', 'radio') // WAI-ARIA role
				.click(function(){
					$(this).next('input:radio').prop('checked', true).change();
				})
			.end()
			.find('> .i > label').attr('title', function(){ return $(this).text() }).end()
			.find('input:radio')
				.bind('redraw', function(){
					var $this = $(this), $big = $this.closest('.a').prev('.a'), val = $this.val();

					// skip following actions if this checkbox was selected just before
					if(val == $big.find('>li:eq(1)').data('value')) return;

					$big.find('>li:not(.noDirection)').remove();

					if(!val) { // select none
						$big.children('li.noDirection').show();
					} else {
						$this.closest('li').clone()
							.find('input:radio').remove().end()
							.find('label')
								.wrapInner('<strong>')
 								.find('>strong')
									.text(function(){ return $(this).attr('title') })
									.unwrap()
								.end()
							.end()
							.appendTo($big);

						$big.find('>li.noDirection').hide();
					}
				})
				.change(function(){
					var $this = $(this);

					$this.trigger('redraw');

					// reselect theme
					if($this.attr('name') != 'themeItem') {
						$('#theme').trigger('select-theme');
					}
				})
				.filter(':checked').change().end()
				.filter('[name="themeItem"]')
					.change(function(){
						var $this = $(this), themes, thm, $radios, name;

						themes = $('#theme').data('themes') || {};
						thm = themes[$this.val()];

						if(!thm) return;

						$radios = $('#skin').find('.i > input:radio').filter('[value=""]').prop('checked', true).end();

						for(var x in thm) {
							if(!thm.hasOwnProperty(x)) continue;

							name = (x == 'layout')?x:x+'-skin';

							if(thm[x]) $radios.filter('[name="'+name+'"][value="'+thm[x]+'"]').prop('checked', true);
						}

						$radios.filter(':checked').trigger('redraw');
					})
				.end()

$('#theme')
	.bind('select-theme', function(){
		var $this = $(this), themes, $radios, form, selection, sel_obj={}, sel_str, name;

		themes  = $this.data('themes') || {};
		$radios = $('#skin').find('.i > input:radio');
		selection = $radios.filter(':checked[value!=""]').get();
		form = $radios.get(0).form;

		for(var i=0,c=selection.length; i < c; i++) {
			name = selection[i].name.match(/^layout|(\w+)-skin$/);
			sel_obj[name[1]||name[0]] = selection[i].value;
		}

		function obj2str(obj){
			var s = '';
			for(var x in obj) {
				if(!obj.hasOwnProperty(x)) continue;
				if(x != 'layout' && !form.elements[x+'-skin']) continue;
				s += x+'\t'+obj[x]+'\n';
			}
			return s;
		}

		sel_str = obj2str(sel_obj);

		// no matched theme => this theme is user-defined
		for(var thm in themes) {
			if(!themes.hasOwnProperty(thm)) continue;
			if(sel_str == obj2str(themes[thm])) {
				$this.find('input:radio[name="themeItem"][value="'+thm+'"]').prop('checked', true).change();
				return;
			}
		}

		$this.find('input:radio[name="themeItem"][value="user_define"]').prop('checked', true).change();
	});

});
