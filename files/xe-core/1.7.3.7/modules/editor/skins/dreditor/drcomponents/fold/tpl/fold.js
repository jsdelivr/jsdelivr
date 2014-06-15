/**
 * Fold component
 * @author NHN (developers@xpressengine.com)
 */
jQuery(function($){

var editor = xe.getApp('DrEditor')[0];
var Fold = xe.createPlugin('Fold', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var config  = editor.getConfig(seq);
		var _editor = config.writeArea.find('>div.fold');
		var _text   = _editor.find('input[type=text]');
		var next = _text.next();

		_text.remove();
		this.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'FOLD']);
		next.before(_text);

		_text
			.blur(function(){ if(!$.trim(this.value)) this.value = this.title })
			.val(_text.attr('title'));

		this.configs[seq] = {
			editor : _editor,
			text   : _text,
			marker : [],
			before : null
		};

		return this.configs[seq];
	},
	assign_class : function(seq) {
		if (this.configs[seq].marker.length) {
			this.configs[seq].marker.eq(0).removeClass('_fold_last').addClass('_fold_first');
			this.configs[seq].marker.eq(1).removeClass('_fold_first').addClass('_fold_last');
		}
	},
	toggle : function(seq, button) {
		var parent = button.parent().parent();
		var target = parent.nextAll('div.eArea');
		var n_fold = target.index(target.filter('div._fold'));

		if (button.is('.more')) {
			target.slice(0, n_fold).removeClass('_fold_hide');
			parent.removeClass('_fold_more');
		} else {
			target.slice(0, n_fold).addClass('_fold_hide');
			parent.addClass('_fold_more');
		}
	},
	API_BEFORE_SETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var obj  = params[1];
		var button    = obj.children('div.fold_button:first');
		var container = obj.children('div.fold_container');

		if (button.length && container.length) {
			var more = button.find('button.more').text(); // copy only text
			var less = button.find('button.less').text();
			var fold = $('<div class="eArea _fold"><div class="_fold_cap">&raquo; <span class="more"></span><span class="less"></span></div></div>').attr('type', 'fold');
			
			fold.find('span.more').click(function(){ self.toggle(seq,$(this)) }).text(more);
			fold.find('span.less').click(function(){ self.toggle(seq,$(this)) }).text(less);

			container.before(fold).before(container.children()).before(fold.clone(true)).remove();

			if (!this.configs[seq]) this.create(seq);
			this.configs[seq].marker = obj.children('div._fold');
			this.assign_class(seq);
		} else {
			container.before(container.children()).remove();
		}
		button.remove();
	},
	API_AFTER_GETTING_CONTENT : function(sender, params) {
		var seq  = params[0];
		var obj  = params[1];
		var chd  = obj.children();
		var fold = chd.filter('div._fold');

		if (!fold.length) return true;

		var n_start = chd.index(fold.eq(0));
		var n_end   = chd.index(fold.eq(1));

		if (n_start+1 >= n_end) return true;

		var div = $('<div class="fold_container" style="display:none" />');
		chd.slice(n_start+1, n_end).appendTo(div);
		fold.eq(0).before(div);
		fold.remove();

		var more = fold.find('span.more').html();
		var less = fold.find('span.less').html();

		var button = $('<div class="fold_button"><button type="button" class="more">'+more+'</button><button type="button" class="less" style="display:none">'+less+'</button></div>');
		div.before(button);
	},
	API_OPEN_FOLD_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];

		if (!cfg) cfg = this.create(seq);
		if (!box && cfg.marker.length) {
			alert('접기 영역은 하나만 사용할 수 있습니다.');
			return false;
		}

		this.cast('RESET_EDITOR', [seq, cfg.editor, 'FOLD']);
		cfg.before = null;

		if (box) {
			var more = box.find('span.more').text();
			var less = box.find('span.less').text();

			cfg.text.val(more+'|'+less);
			box.hide().after(cfg.editor);
		} else if (bef) {
			cfg.before = bef;
			$(bef).after(cfg.editor);
		} else {
			cfg.editor.appendTo(editor.getConfig(seq).editArea);
		}
		cfg.editor.show().find('input[type=text]:first').focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_FOLD_EDITOR : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var txt  = $.trim(cfg.text.val());
		var box  = editor.getConfig(seq).editArea.children('div._fold:hidden');
		var fold = null, fold2 = null;

		if (txt == '') txt = cfg.text.attr('title');

		if (save) {
			txt = txt.split('|');
			if (box.length) {
				fold = editor.getConfig(seq).editArea.children('div._fold');

				fold.find('span.more').text( txt[0] );
				fold.find('span.less').text( txt[1] || '' );
			} else {
				fold = $('<div class="eArea _fold"><div class="_fold_cap">&raquo; <span class="more"></span><span class="less"></span></div></div>').attr('type', 'fold');
			
				fold.find('span.more').click(function(){ self.toggle(seq,$(this)) }).text( txt[0] );
				fold.find('span.less').click(function(){ self.toggle(seq,$(this)) }).text( txt[1] || '' );

				fold2 = (box=fold).clone(true);

				if (cfg.before) {
					cfg.before.before(fold).after(fold2);
				} else {
					cfg.editor.before(fold).before(fold2);
				}

				fold = editor.getConfig(seq).editArea.children('div._fold');
			}
			cfg.marker = fold;
			this.assign_class(seq);
			this.cast('SAVE_PARAGRAPH', [seq]);
		}

		box.show();

		cfg.editor.hide().appendTo(editor.getConfig(seq).writeArea);
		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

	},
	API_AFTER_ONMOVE_PARAGRPH : function(sender, params) {
		var seq = params[0];
		var chd = editor.getConfig(seq).editArea.children();
		if(typeof(this.configs[seq]) == 'undefined') return;

		chd.filter('div._fold_hide').removeClass('_fold_hide');
		this.configs[seq].marker = chd.filter('div._fold');
		this.assign_class(seq);

		if (this.configs[seq].marker.length) this.configs[seq].marker.removeClass('_fold_more');
		
	},
	API_AFTER_DELETE_PARAGRAPH : function(sender, params) {
		var self   = this;
		var seq    = params[0];
		var target = params[1];

		if (target.filter('div._fold').length) {
			this.configs[seq].marker.remove()
			this.configs[seq].marker = [];
		}
	}
});
editor.registerPlugin(new Fold);

});
