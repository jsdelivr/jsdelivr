jQuery(function($){
	var menuList;
	var parentSrl;
	var editForm = $('#editForm');
	var listForm = $('#listForm');

	$('a._add').click(function(){
		parentSrl = $(this).parent().prevAll('._item_key').val();
		editForm.find('input[name=parent_srl]').val(parentSrl);
		if(!menuList)
		{
			var params = [];
			var response_tags = ['menuList'];
			exec_xml("menu","procMenuAdminAllActList", params, completeGetActList, response_tags);
		}
	});

	function completeGetActList(obj)
	{
		var $optgroup;

		moduleList = obj.menuList;
		if(moduleList)
		{
			var menuNameList = $('#menuNameList');
			for(var x in moduleList)
			{
				var menuList = moduleList[x];
				$optgroup = $('<optgroup label="'+x+'" />').appendTo(menuNameList);
				for(var y in menuList)
				{
					$optgroup.append('<option value="'+x+':'+y+'">'+menuList[y].title+'</option>');
				}
			}
		}
	}

	$('a._parent_delete').click(function() {
		var menu_item_srl = $(this).parent().prevAll('._parent_key').val();
		listForm.find('input[name=menu_item_srl]').val(menu_item_srl);
		listForm.submit();
	});

	$('a._child_delete').click(function() {
		var menu_item_srl = $(this).parents('li').find('._item_key').val();
		listForm.find('input[name=menu_item_srl]').val(menu_item_srl);
		listForm.submit();
	});
});

// menu - drag and drop
jQuery(function($){

$('form.adminMap')
	.delegate('li:not(.placeholder)', 'dropped.st', function() {
		var $this = $(this), $pkey, $mkey, is_child;

		$pkey = $this.find('>input._parent_key');
		is_child = !!$this.parent('ul').parent('li').length;

		if(is_child) {
			$pkey.val($this.parent('ul').parent('li').find('>input._item_key').val());
		} else {
			$pkey.val('0');
		}
	});

var dragging = false, $holder  = $('<li class="placeholder">');
$('form.adminMap>ul')
	.delegate('li:not(.placeholder,.parent)', {
		'mousedown.st' : function(event) {
			var $this, $uls, $ul, width, height, offset, position, offsets, i, dropzone, wrapper='';

			if($(event.target).is('a,input,label,textarea') || event.which != 1) return;

			dragging = true;

			$this  = $(this);
			height = $this.height();
			width  = $this.width();
			$uls   = $this.parentsUntil('.adminMap').filter('ul');
			$ul    = $uls.eq(-1);

			position = {x:event.pageX, y:event.pageY};
			offset   = getOffset(this, $ul.get(0));

			$clone = $this.clone(true).attr('target', true);

			for(i=$uls.length-1; i; i--) {
				$clone = $clone.wrap('<li><ul /></li>').parent().parent();
			}

			// get offsets of all list-item elements
			offsets = [];
			$ul.find('li').each(function(idx) {
				if($this[0] === this || $this.has(this).length) return true;

				var o = getOffset(this, $ul.get(0));
				offsets.push({top:o.top, bottom:o.top+32, $item:$(this)});
			});

			// Remove unnecessary elements from the clone, set class name and styles.
			// Append it to the list
			$clone
				.find('.side,input').remove().end()
				.addClass('draggable')
				.css({
					position: 'absolute',
					opacity : 0.6,
					width   : width,
					height  : height,
					left    : offset.left,
					top     : offset.top,
					zIndex  : 100
				})
				.appendTo($ul.eq(0));

			// Set a place holder
			$holder
				.css({
					position:'absolute',
					opacity : 0.6,
					width   : width,
					height  : '10px',
					left    : offset.left,
					top     : offset.top,
					zIndex  :99
				})
				.appendTo($ul.eq(0));

			$this.css('opacity', 0.6);

			$(document)
				.unbind('mousemove.st mouseup.st')
				.bind('mousemove.st', function(event) {
					var diff, nTop, item, i, c, o;

					dropzone = null;

					diff = {x:position.x-event.pageX, y:position.y-event.pageY};
					nTop = offset.top - diff.y;

					for(i=0,c=offsets.length; i < c; i++) {
						o = offsets[i];
						if(o.top > nTop || o.bottom < nTop) continue;

						dropzone = {element:o.$item};
						if(o.$item.hasClass('parent')) {
							dropzone.state = 'prepend';
							$holder.css('top', o.bottom-5);
						} else if(o.top > nTop - 12) {
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
					var $dropzone, $li;

					dragging = false;

					$(document).unbind('mousemove.st mouseup.st');
					$this.css('opacity', '');
					$clone.remove();
					$holder.remove();

					// dummy list item for animation
					$li = $('<li />').height($this.height());

					if(!dropzone) return;
					$dropzone = $(dropzone.element);

					$this.before($li);

					if(dropzone.state == 'prepend') {
						if(!$dropzone.find('>ul').length) $dropzone.find('>.side').after('<ul>');
						$dropzone.find('>ul').prepend($this.hide());
					} else {
						$dropzone[dropzone.state]($this.hide());
					}

					$this.slideDown(100, function(){ $this.removeClass('active'); });
					$li.slideUp(100, function(){ var $par = $li.parent(); $li.remove(); if(!$par.children('li').length) $par.remove(); });

					// trigger 'dropped.st' event
					$this.trigger('dropped.st');
				});

			return false;
		},
		'mouseover.st' : function() {
			if(!dragging) $(this).addClass('active');
			return false;
		},
		'mouseout.st' : function() {
			if(!dragging) $(this).removeClass('active');
			return false;
		}
	})
	.find('li li')
		.prepend('<button type="button" class="moveTo">Move to</button>').end()
	.end();

$('<div id="dropzone-marker" />')
	.css({display:'none',position:'absolute',backgroundColor:'#000',opacity:0.7})
	.appendTo('body');

function getOffset(elem, offsetParent) {
	var top = 0, left = 0;

	while(elem && elem != offsetParent) {
		top  += elem.offsetTop;
		left += elem.offsetLeft;

		elem = elem.offsetParent;
	}

	return {top:top, left:left};
}

});
