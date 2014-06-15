/**
 * 단락에디터 Paragraph Editor
 * @author NHN (developers@xpressengine.com)
 */
(function($){

var configs = {};

var TOOLSET_LENGTH = 9;

var DrEditor = xe.createApp('DrEditor', {
	loaded   : false,
	last_seq : 0,
	toolset_offset : 0,
	init : function() {
	},
	getConfig : function(seq) {
		return configs[seq] || {};
	},
	API_ONREADY : function(sender, params) {
		var self = this;

		$.each(configs, function(seq, val){
			var _container = $('div#DrEditor'+seq);
			var _writeArea = _container.find('>div>div.writeArea:first');
			var _editArea  = _container.find('>div>div.editorArea:first');
			var _dummyArea = $('<div class="dummy" style="display:none">').appendTo(_writeArea);
			var _blankBox  = _writeArea.find('>div.blank:first').prependTo(_writeArea);
			var _toolbar   = _writeArea.find('>.wToolbarContainer>div.wToolbar');
			var _editTool  = _writeArea.find('ul.eTool').remove();
			var _hookerBtn = $('<button type="button" class="_hookerBtn">').attr('seq', seq).css({position:'absolute',width:'1px',height:'1px',left:'-2000px',top:0}).prependTo(_container);
			var $numbers;

			//  toolbar buttons
			_toolbar
				.find('button')
				.hover(
					function(){ $(this).parent().addClass('hover'); },
					function(){ $(this).parent().removeClass('hover'); }
				)
				.click(
					function(event){					
						var type = $(this).parent().attr('class').toUpperCase().split(' ')[0];
						self.cast('CLICK_TOOLBUTTON', [seq, this, type]);
						
						return false;
					}
				);

			// _blankBox
			//_blankBox.dblclick(function(){ self.cast('OPEN_EDITOR', [seq, null, null, 'HX']); });

			// toolbar button sortable
			_toolbar.children('ul:first')
				.sortable({items  : '>li'})
				.bind('sortstop', function(){
					var tools = [];

					if (!$numbers) {
						($numbers = _toolbar.find('button .nx')).sort(function(a, b){				
							return (parseInt(a.firstChild.nodeValue,10) > parseInt(b.firstChild.nodeValue,10))?1:-1;
						});
					}

					_toolbar.find('li').each(function(i){
						var t = $(this), $btn = t.find('>button'), title = '';
						tools.push(t.attr('class'));

						if (i < 9) {
							title = xe.lang.shortcut + '('+(i+1)+')';
							$btn.append($numbers.eq(i+1));
						}
						$btn.attr('title', title);
					});

					tools = tools.join(',');
					if (tools) {
						var expires = (new Date()).getTime() + 7 * 24 * 3600 * 1000; // one week
						document.cookie = 'DrEditorToolbar='+tools+'; expires='+(new Date(expires)).toGMTString()+'; path=/;';
					}
				});

			// container
			_editArea
				.sortable({
					axis   : 'y',
					items  : '>div.eArea',
					handle : '>div.drag_handle',
					placeholder : 'xe_dr_placeholder'
				});

			// focus hook event
			_hookerBtn
				.focus (function(){
					if(!_editArea.children('div.eFocus,div.wArea:visible').length) self.cast('SELECT_PARAGRAPH', [seq, _editArea.find('>div:first')]);
					self.last_seq = seq;
				});

			configs[seq] = $.extend(configs[seq], {
				sequence  : seq,
				container : _container,
				editArea  : _editArea,
				writeArea : _writeArea,
				blankBox  : _blankBox,
				toolbar   : _toolbar,
				editTool  : _editTool,
				hookerBtn : _hookerBtn,
				selFirst  : null,
				selLast   : null,
				last_type : ''
			});

			if (!self.last_seq) self.last_seq = seq;
		});

		function getPara(event) {
			var target = $(event.target);
			if(target.is('a,button,:input')) return null;

			var para = target.parents('div').andSelf().filter('div.eArea:first');

			return para.length?para:null;
		};

		function falseFunc(){ return false; };

		$(document).mousedown(function(event) {
			var target = $(event.target);

			if(!is_left_click(event)) return true;
			if(target.is('a,button,:input')) return true;
			if(target.parents('div.wToolbar:first').length) return true;

			var para = target.parents('div').andSelf().filter('div.eArea:first');
			if(!para.length) {
				self.cast('CLEAR_SELECTION', [seq]);
				return true;
			}
			if(para.parents('div.material:first').length) return true;

			var seq = para.parents('form:first')[0].elements['editor_sequence'].value;
			
			if (configs[seq].editArea.children('div.wArea:visible').length) {
				// save
				if (configs[seq].last_type) self.cast('CLOSE_EDITOR', [seq, true, configs[seq].last_type]);
			}

			// multiple selection
			if (event.shiftKey) {
				if (configs[seq].selFirst) {
					var children  = configs[seq].editArea.children('div');
					var nSelFirst = children.index(configs[seq].selFirst);
					var nPara     = children.index(para);
					var nStart    = Math.min(nSelFirst, nPara);
					var nEnd      = Math.max(nSelFirst, nPara);

					self.cast('CLEAR_SELECTION');
					self.cast('SELECT_PARAGRAPH', [seq, children.slice(nStart,nEnd+1), children.eq(nSelFirst), para]);
				} else {
					self.cast('SELECT_PARAGRAPH', [seq, para, para, para]);
				}
			} else if (event.ctrlKey) {
				if (para.hasClass('eFocus')) {
					self.cast('UNSELECT_PARAGRAPH', [seq, para, para, para]);
				} else {
					self.cast('SELECT_PARAGRAPH', [seq, para, para, para]);
				}
			} else {
				self.cast('CLEAR_SELECTION');
				self.cast('SELECT_PARAGRAPH', [seq, para, para, para]);
			}

			return false;
		});

		// global doubleclick
		$(document).dblclick(function(event){
			var target = $(event.target);
			if(target.is('a,button,:input')) return true;
			if(event.shiftKey || event.ctrlKey) return true;

			var para = target.parents('div').andSelf().filter('div.eArea:first');
			if(!para.length) return true;

			var seq  = para.parents('form:first')[0].elements['editor_sequence'].value;
			var type = para.attr('type');

			if (type) {
				self.cast('CLEAR_SELECTION');
				self.cast('OPEN_EDITOR', [seq, para, null, type]);
			}
		});

		$(document).keydown(function(event){
			var target = $(event.target);
			if(!event.altKey && !event.ctrlKey && !event.metaKey && target.is(':input:not(button._hookerBtn)')) return true;
			if(event.keyCode == 16 && event.shiftKey) return true; // only shift key
			if(event.keyCode == 17 && event.ctrlKey)  return true; // only ctrl key
			if(event.keyCode == 18 && event.altKey)   return true; // only alt key
			if(event.keyCode == 9) return true;

			var ret = self.cast('ONKEYDOWN', [self.last_seq, event]);
			if (ret == true || ($.isArray(ret) && $.inArray(ret, true))) return false;
		});

		// scroll event
		var _scrollTimer = null;
		$(window).scroll(function(event){
			if (_scrollTimer) clearTimeout(_scrollTimer);
			_scrollTimer = setTimeout(function(){
				_scrollTimer = null;
				self.cast('ONSCROLL');
			}, 10);
		});
	},
	API_ONLOAD : function(sender, params) {
		var self = this;

		this.loaded = true;
		$.each(configs, function(seq,val){ self.cast('TOOLBAR_REPOSITION', [seq]) });
	},
	API_CREATE_EDITOR : function(sender, params) {
		configs[params[0]] = {form:params[1]};
	},
	API_GET_CONTENT : function(sender, params) {
		var seq = params[0];
		var box = configs[seq].editArea.contents().clone();
		var dum = $('<div>').append(box);
		var htm = '';

		// remove no-content area
		dum.find('>div.wArea,>div.eArea>div.drag_handle,>div.eArea>button.del').remove();

		// getting content
		this.cast('GETTING_CONTENT', [seq, dum]);

		htm = dum
				.html()
				.replace(
					/<(img|br)([^>]*)\/?>/gi,
					function(m0,m1,m2){
						var ret = ['<'+m1];
						(m2 = $.trim(m2))?ret.push(m2):0;
						ret.push('/>');

						return ret.join(' ');
					}
				);

		return htm;
	},
	API_SET_CONTENT : function(sender, params) {
		var seq = params[0];
		var txt = params[1];

		// clear all document
		this.cast('CLEAR', [seq]);

		// process text
		var dum = $('<div>').html( txt );
		this.cast('SETTING_CONTENT', [seq, dum]);

		// set content
		if(configs[seq] && configs[seq].editArea) {
			configs[seq].editArea.append(dum.children('div.eArea'));
		}
	},
	API_AFTER_SET_CONTENT : function(sender, params) {
		var seq = params[0];

		// show or hide blankbox
		if(configs[seq].editArea.find('>div.eArea').length) {
			configs[seq].blankBox.hide();
		} else {
			configs[seq].blankBox.show();
		}
	},
	API_CLEAR : function(sender, params) {
		var seq = params[0];
		if(configs[seq] && configs[seq].editArea) configs[seq].editArea.empty();
	},
	API_GET_SELECTED_PARAGRAPH : function(sender, params) {
		var seq = params[0];
		return configs[seq].editArea.children('div.eFocus');
	},
	API_SELECT_PARAGRAPH : function(sender, params) {
		var seq = params[0];
		var par = params[1]; // clicked paragraph
		var fir = params[2]; // selection first
		var las = params[3]; // selection last
		var self = this;

		configs[seq].selFirst = fir || null;
		configs[seq].selLast  = las || null;

		var box = (las || fir || par).eq(0), top;

		if (box && box.length) {
			top = box.position().top + Math.floor(box.height()/2);
			configs[seq].hookerBtn.css('top', top+'px');
		}

		par.addClass('eFocus');

		if (par.length) {
			configs[seq].hookerBtn.focus();
			par.each(function(){
				var t = $(this);
				if (!t.find('>div.drag_handle:first').length) {
					t.prepend('<div class="drag_handle left" title="'+xe.lang.drag_this+'" />');
					t.prepend('<div class="drag_handle right" title="'+xe.lang.drag_this+'" />');
				}
			});

			par = par.parent().find('>.eFocus');
			par.find('>button.del').remove();
			$('<button type="button" class="del"><span>'+xe.lang.cmd_del+'</span></button>')
				.click(function(){ self.cast('DELETE_PARAGRAPH', [seq, par]); return false; })
				.appendTo(par.eq(0));
		}

		if ($.browser.msie) {
			try { document.selection.createRange().collapse(true) } catch(e) {};
		}
	},
	API_UNSELECT_PARAGRAPH : function(sender, params) {
		var seq = params[0];
		var par = params[1]; // clicked paragraph

		par.removeClass('eFocus').find('>button.del').remove();
	},
	API_CLEAR_SELECTION : function(sender, params) {
		var skip_seq = params[0];

		$.each(configs, function(seq){
			if(skip_seq && skip_seq == seq) return true;

			$(this.editArea.children('div.eFocus')).removeClass('eFocus');
			this.selFirst  = null;
			this.selLast   = null;
		});
	},
	API_SAVE_PARAGRAPH : function(sender, params) {
		var seq = params[0];
		var _editor = params[1];
		var _box    = params[2];
		var _type   = (params[3]||'').toLowerCase();

		if (_type) _box.addClass('eArea _'+_type).attr('type', _type);
		if (_editor && _box) _editor.before(_box);
	},
	API_DELETE_PARAGRAPH : function(sender, params) {
		var self   = this;
		var seq    = params[0];
		var target = params[1];

		if (target && target.length) {
			var prev = target.eq(0).prev('div.eArea');
			var next = target.eq(target.length-1).next('div.eArea');

			target
				.removeClass('eFocus')
				.hide('fast', function(){
					$(this).remove();
					self.cast('TOOLBAR_REPOSITION', [seq]);
					if (!configs[seq].editArea.children('div.eArea:first').length) configs[seq].blankBox.show();
				});

			if (next.length) this.cast('SELECT_PARAGRAPH', [seq, next, next, next]);
			else if (prev.length) this.cast('SELECT_PARAGRAPH', [seq, prev, prev, prev]);
		}
	},
	API_CLICK_TOOLBUTTON : function(sender, params) {
		var seq    = params[0];
		var button = $(params[1]);
		var type   = params[2];
		var selbox = this.cast('GET_SELECTED_PARAGRAPH', [seq]);

		if(selbox.length) selbox = selbox.eq(0);
		else selbox = null;

		var editor = configs[seq].editArea.children('div.wArea:visible');
		if (editor.length) {
			if (editor.is(type)) this.cast('CLOSE_EDITOR', [seq, false, type]);
		} else {
			this.cast('CLEAR_SELECTION');
			this.cast('OPEN_EDITOR', [seq, null, selbox, type]);
		}
	},
	API_ONSCROLL : function(sender, params) {
		var self = this;
		if (this.loaded) {
			$.each(configs, function(seq,val){ self.cast('TOOLBAR_REPOSITION', [seq]) });
		}
	},
	API_ONKEYDOWN : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var event = params[1];
		var key = event.keyCode, ctrl = event.ctrlKey, meta = event.metaKey, alt = event.altKey, shift = event.shiftKey;
		var ENTER = 13, UP = 38, DOWN = 40, DEL = 46;
		var selection, para, prev, next;

		if ($(event.target).is(':text')) return false;

		// hit enter to edit a selected paragraph
		if(key == ENTER) {
			configs[seq].editArea.children('div.eFocus:first').dblclick();
			return true;
		}

		if (key == UP || key == DOWN) {
			if (ctrl) { // hit ctrl + up, down to move paragraphs
				selection = this.cast('GET_SELECTED_PARAGRAPH', [seq]);

				if (key == UP) {
					prev = selection.eq(0).prev('div.eArea');

					if (prev.length) prev.before(selection);
					else configs[seq].editArea.prepend(selection);
				} else {
					next = selection.eq(selection.length-1).next('div.eArea');

					if (next.length) next.after(selection);
					else configs[seq].editArea.append(selection);
				}

				setTimeout(function(){ self.cast('ONMOVE_PARAGRPH', [seq]) }, 0);
			} else if (shift) { // hit shift + up, down to select multiple paragraphs
				var children  = configs[seq].editArea.children('div.eArea');
				var current   = configs[seq].selLast || configs[seq].selFirst;
				
				if (key == UP) {
					if ((prev=current.prev('div.eArea')).length) current = prev;
				} else {
					if ((next=current.next('div.eArea')).length) current = next;
				}

				var nSelFirst = children.index(configs[seq].selFirst);
				var nCurrent  = children.index(current);
				var nStart    = Math.min(nSelFirst, nCurrent);
				var nEnd      = Math.max(nSelFirst, nCurrent);

				this.cast('CLEAR_SELECTION');
				this.cast('SELECT_PARAGRAPH', [seq, children.slice(nStart,nEnd+1), children.eq(nSelFirst), current]);
			} else { // hit up or down arrow to move selection
				selection = this.cast('GET_SELECTED_PARAGRAPH', [seq]);

				if (key == UP) {
					prev = selection.eq(0).prev('div.eArea');

					if (prev.length) para = prev;
					else para = selection.eq(0);
				} else {
					next = selection.eq(selection.length-1).next('div.eArea');

					if (next.length) para = next;
					else para = selection.eq(selection.length-1);
				}

				this.cast('CLEAR_SELECTION');
				this.cast('SELECT_PARAGRAPH', [seq, para, para, para]);
			}

			selection = this.cast('GET_SELECTED_PARAGRAPH', [seq]);
			this.cast('SCROLL_INTO_VIEW', [seq, selection, (key==UP)?'top':'bottom']);

			return true;
		}

		// delete key
		if (key == DEL) {
			selection = this.cast('GET_SELECTED_PARAGRAPH', [seq]);
			this.cast('DELETE_PARAGRAPH', [seq, selection]);

			return true;
		}

		// number key
		if (48 <= key && key <= 58) {
			var buttons = configs[seq].toolbar.find('button');
			if (key == 48) key = buttons.length+48;
			buttons.eq(key-49).click();

			return true;
		}

		// change toolset
		if (key == 192) {
			var ul   = configs[seq].toolbar.find('ul:first');
			var lis  = ul.find('>li');
			var more = lis.eq(lis.length-1);

			if ((lis.length-1) % TOOLSET_LENGTH) {
				var empty_len = TOOLSET_LENGTH - ((lis.length-1) % TOOLSET_LENGTH);
				for(;empty_len--;) more.before('<li class="blank" style="height:57px;" />');
				lis = ul.find('>li');
			}

			var toolset_count = (lis.length-1) / 9

			this.toolset_offset++;
			if (this.toolset_offset >= toolset_count) this.toolset_offset = 0;

			more.before( lis.slice(0,TOOLSET_LENGTH) );
		}
	},
	API_ADD_DEFAULT_EDITOR_ACTION : function(sender, params) {
		var self   = this;
		var seq    = params[0];
		var editor = params[1];
		var type   = (params[2]||'').toUpperCase();

		// save and cancel button
		var _buttons = editor.find('div.buttonArea button');
		_buttons.eq(0).click(function(){ self.cast('CLOSE_EDITOR', [seq, true, type]); }); // save button
		_buttons.eq(1).click(function(){ self.cast('CLOSE_EDITOR', [seq, false, type]); }); // cancel button

		// textbox default value
		editor.find('input[type=text],textarea')
			.focus(function(){ if($.trim(this.value) == this.title) this.value = ''; })
			.blur(function(){ var val=$.trim(this.value); if (val==this.title || val == '') this.value = this.title; })
			.filter('input').keydown(function(event){ if(event.keyCode == 13) return false; });

		// set default checkbox and radio button
		editor.find('input[type=checkbox],input[type=radio]').filter(':checked').addClass('_default_check');

		editor.find('input,textarea').keydown(function(event){
			var ESC = 27, ENTER = 13;

			if (!configs[seq].last_type) return true;

			if (event.keyCode == 27) {
				self.cast('CLOSE_EDITOR', [seq, false, configs[seq].last_type]);
				return false;
			}

			if (event.ctrlKey && event.keyCode == ENTER) {
				self.cast('CLOSE_EDITOR', [seq, true, configs[seq].last_type]);
				return false;
			}
		});
	},
	API_RESET_EDITOR : function(sender, params) {
		var seq    = params[0];
		var editor = params[1];
		var type   = (params[2]||'').toUpperCase();

		// reset textbox
		editor.find('input[type=text],textarea').each(function(){ this.value = this.title; });

		// reset checkbox and radio buttons
		editor.find('input[type=checkbox],input[type=radio]').filter('._default_check').attr('checked', 'checked');
	},
	API_TOOLBAR_REPOSITION : function(sender, params) {
		var seq         = params[0];
		var toolbar     = configs[seq].toolbar.parent();
		var view_bottom = $(window).scrollTop() + document.documentElement.clientHeight; //scroll_top + doc_height
		var old_top     = toolbar.css('top');
		var offset_top  = toolbar.css('top', 0).offset().top;
		var new_top     = Math.min( ((view_bottom - toolbar.height()) - offset_top - 5), 0);

		if (old_top != new_top) toolbar.css('top', new_top+'px');
	},
	API_OPEN_EDITOR : function(sender, params) {
		var seq  = params[0];
		var box  = params[1]; // selection to edit
		var bef  = params[2]; // selection to be before this editor
		var type = params[3];

		this.cast('OPEN_'+type.toUpperCase()+'_EDITOR', [seq, box, bef]);
		configs[seq].last_type = type;
		configs[seq].blankBox.hide();

		this.cast('TOOLBAR_REPOSITION', [seq]);
	},
	API_CLOSE_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = !!params[1];
		var type = params[2];

		this.cast('CLOSE_'+type.toUpperCase()+'_EDITOR', [seq, save]);

		if (configs[seq].editArea.children('div.eArea').length) {
			configs[seq].blankBox.hide();
		} else {
			configs[seq].blankBox.show();
		}

		this.cast('TOOLBAR_REPOSITION', [seq]);
	},
	API_SCROLL_INTO_VIEW : function(sender, params) {
		var seq  = params[0];
		var sel  = params[1];
		var edge = params[2];

		if (!sel || !sel.length) return;
		if (!edge) {
			this.cast('SCROLL_INTO_VIEW', [seq, sel, 'bottom']);
			this.cast('SCROLL_INTO_VIEW', [seq, sel, 'top']);
			return;
		}
		if (edge != 'top' && edge != 'bottom') edge = 'top';

		var pos, view_height = $(window).height(), scroll_top = $(window).scrollTop();

		if (edge == 'top') {
			pos = sel.eq(0).offset();
			if (pos.top-5 < scroll_top) $(window).scrollTop(pos.top-5);
		} else {
			sel = sel.eq(sel.length - 1);
			pos = sel.offset();
			pos.height  = sel.outerHeight();
			pos.toolbar = 0;

			if (configs[seq].toolbar.parent().is(':visible')) pos.toolbar = configs[seq].toolbar.parent().outerHeight()+10;
			if (pos.top+pos.height > scroll_top+view_height-pos.toolbar-5) {
				$(window).scrollTop( pos.top+pos.height-view_height+pos.toolbar+5);
			}
		}
	}
});
var editor = new DrEditor;
xe.registerApp(editor);

// Header Writer
var header_tag = 'h1,h2,h3,h4,h5,h6';
var HeaderWriter = xe.createPlugin('HeaderWriter', {
	configs : null,
	init    : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor = configs[seq].writeArea.find('>div.hx');
		var _inputHead  = _editor.find('input[type=text]:first');
		var _inputLevel = _editor.find(':radio').click(function(){ self.cast('CHANGE_HEADER_FORMAT', [seq, this.value]) });

		self.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'HX']);

		this.configs[seq] = {
			editor : _editor,
			inputHead  : _inputHead,
			inputLevel : _inputLevel
		};

		return this.configs[seq];
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div.xe_dr_hx,'+header_tag)
			.each(function(){
				var t = $(this);
				if (!t.is('.xe_dr_hx')) t = t.wrap('<div>').parent();

				t.attr('class', 'eArea _hx').attr('type', 'hx');

				var header = t.children(header_tag);
				if(!header.attr('id')) header.attr('id', 'h'+(new Date).getTime());
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		var header = obj.children('div._hx').children(header_tag).each(function(){ var t=$(this); t.parent().after(t).remove() });
	},
	API_CHANGE_HEADER_FORMAT : function(sender, params) {
		var seq = params[0];
		var val = params[1];

		this.configs[seq].inputHead.attr('class', 'inputTitle '+val);
	},
	API_OPEN_HX_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1]; // selection to edit
		var bef = params[2]; // selection to be before this editor
		var cfg = this.configs[seq];

		// Create this editor if it doesn't exists
		if(!cfg) cfg = this.create(seq);

		this.cast('RESET_EDITOR', [seq, cfg.editor, 'HX']);

		if(box) {
			var tagName = box.children(header_tag)[0].tagName.toLowerCase();

			box.hide().after(cfg.editor);

			cfg.inputHead.val( box.find(header_tag).eq(0).text() );
			cfg.inputLevel.filter('[value='+tagName+']').click();
		} else if (bef) {
			$(bef).after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}
		cfg.editor.show().find('input[type=text]:first').focus();

		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_HX_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._hx:hidden');

		if(save) {
			var newBox  = $('<div>');
			var id      = box.children(header_tag).attr('id');
			var tagName = cfg.inputLevel.filter(':checked').val();

			if (!id) id = 'h'+(new Date).getTime();

			newBox.html('<'+tagName+' id="'+id+'"></'+tagName+'>').children(':first').text(cfg.inputHead.val());

			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'HX']);
		} else {
			box.show();
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new HeaderWriter);

var IndexWriter = xe.createPlugin('IndexWriter', {
	init    : function() {
		this.configs = {};
	},
	createIndex : function(seq) {
		var toc  = $('<ul class="toc"></ul>');
		var rand = Math.ceil(Math.random()*1000);

		configs[seq].editArea.children('div._hx').children('h1,h2,h3,h4,h5,h6')
			.each(function(){
				var t = $(this), id = t.attr('id'), n = this.nodeName.replace(/[^0-9]/,'');

				if (!id) t.attr('id', id = 'h'+rand+Math.ceil(Math.random()*1000));
				toc.append('<li class="toc'+n+'"><a href="#'+id+'">'+t.html()+'</a></li>');
			});

		return $('<div class="eArea _index">').append(toc);
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div.xe_dr_index,ul.toc')
			.each(function(){
				var t = $(this);
				if (t.is('ul')) t = t.wrap('<div>').parent();
				t.attr('class', 'eArea _index').attr('type', 'index');
			});
	},
	refreshIndex : function(seq) {
		configs[seq].editArea.children('div._index').replaceWith(this.createIndex(seq));
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];
		var toc = obj.children('div._index').children('ul.toc');

		toc.parent().before(toc).remove();
	},
	API_OPEN_INDEX_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1]; // selection to edit
		var bef = params[2]; // selection to be before this editor

		if (box) {
			box.fadein('fast');
		} else if (bef) {
			bef.after(box = this.createIndex(seq));
		} else {
			configs[seq].editArea.append(box = this.createIndex(seq));
		}
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);
		this.cast('SCROLL_INTO_VIEW', [seq, box]);
	},
	API_AFTER_CLOSE_HX_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];

		if (save) {
			// auto refresh if a header was saved or updated.
			this.refreshIndex(seq);
		}
	},
	ONMOVE_PARAGRPH : function(sender, params) {
		var seq = params[0];
		var selbox = this.cast('GET_SELECTED_PARAGRAPH', [seq]);

		if (selbox.filter('div._index').length) {
			// auto refresh if a header was moved.
			this.refreshIndex(seq);
		}
	}
});
editor.registerPlugin(new IndexWriter);

// Text Editor
var TextWriter = xe.createPlugin('TextWriter', {
	configs : null,
	init    : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor   = configs[seq].writeArea.find('>div.txt:first');
		var _textarea = $('<textarea>').hide();
		var _iframe   = _editor.find('iframe').css('height','100%').after(_textarea);

		self.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'TXT']);

		this.configs[seq] = {
			editor   : _editor,
			iframe   : _iframe,
			textarea : _textarea,
			xpress   : null
		};

		return this.configs[seq];
	},
	createXpressEditor : function(seq) {
		var self = this;
		var ed = new xe.XpressCore();
		var elAppContainer = this.configs[seq].editor[0];
		var oWYSIWYGIFrame = this.configs[seq].iframe[0];
		var oIRTextarea    = this.configs[seq].textarea[0];
		var pHotkey;

		ed.registerPlugin(new xe.CorePlugin(function(){ this.oApp.exec('FOCUS',[]) }));
		ed.registerPlugin(new xe.StringConverterManager());
		ed.registerPlugin(new xe.XE_EditingAreaVerticalResizer(elAppContainer));
		ed.registerPlugin(new xe.ActiveLayerManager());
		ed.registerPlugin(pHotkey=new xe.Hotkey());
		ed.registerPlugin(new xe.XE_WYSIWYGStyler());
		ed.registerPlugin(new xe.XE_WYSIWYGStyleGetter());
		ed.registerPlugin(new xe.MessageManager(oMessageMap));
		ed.registerPlugin(new xe.XE_Toolbar(elAppContainer));
		ed.registerPlugin(new xe.XE_UndoRedo());
		ed.registerPlugin(new xe.XE_Hyperlink(elAppContainer));
		ed.registerPlugin(new xe.XE_EditingAreaManager("WYSIWYG", oIRTextarea, {nHeight:200, nMinHeight:100}, null, elAppContainer));
		ed.registerPlugin(new xe.XE_EditingArea_HTMLSrc(oIRTextarea));
		ed.registerPlugin(new xe.XE_EditingArea_WYSIWYG(oWYSIWYGIFrame));
		ed.registerPlugin(new xe.XpressRangeManager(oWYSIWYGIFrame));
		ed.registerPlugin(new xe.XE_ExecCommand(oWYSIWYGIFrame));
		ed.registerPlugin(new xe.XE_FontNameWithSelectUI(elAppContainer));
		ed.registerPlugin(new xe.XE_FontSizeWithSelectUI(elAppContainer));
		ed.registerPlugin(new xe.XE_LineHeightWithSelectUI(elAppContainer));
		ed.registerPlugin(new xe.XE_ColorPalette(elAppContainer));
		ed.registerPlugin(new xe.XE_FontColor(elAppContainer));
		ed.registerPlugin(new xe.XE_BGColor(elAppContainer));
		ed.registerPlugin(new xe.XE_SCharacter(elAppContainer));
		ed.registerPlugin(new xe.XE_WYSIWYGEnterKey("BR"));
		//ed.registerPlugin(new xe.XE_FontSetter(this.getFontFamily(), this.getFontSize()));

		// Ctrl+Enter를 입력하면 현재 문단 저장 후 새 텍스트 문단을 보여준다.
        pHotkey.add(pHotkey.normalize('ctrl+enter'), function(){ 
			setTimeout(function() { self.cast('CLOSE_EDITOR', [seq, true, 'TXT']) }, 1);
		});
		pHotkey.add(pHotkey.normalize('esc'), function(){ 
			setTimeout(function() { self.cast('CLOSE_EDITOR', [seq, false, 'TXT']) }, 1);
		});

		// 에디터 시작
		ed.run();

		return ed;
	},
	API_AFTER_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.contents()
			.each(function(){
				var t = $(this);

				if (t.is('div.eArea')) return true;

				// clean contentless paragraph {{{
				if (
					( this.nodeType == 3 && !$.trim(this.nodeValue) ) ||
					( t.is('p') && /^\s*(<br ?\/?>)?\s*$/i.test(t.html()) ) ||
					( t.is('br') )
				) {
					t.remove();
					return true;
				}
				// }}} clean contentless paragraph

				if(this.nodeType == 3) t = t.wrap('<p />').parent();
				if(!t.is('div.xe_dr_txt')) t = t.wrap('<div />').parent();

				t.attr('class', 'eArea _txt').attr('type', 'txt');
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq = params[0];
		var obj = params[1];

		obj.children('div._txt').each(function(){
			var div = $(this), node = null;

			div.contents().each(function(){
				var t = $(this);

				if(this.nodeType == 3 || t.is('br,a,b,i,s,u,sub,sup,em,strong,span,img,font')) {
					if( t.is('br,img') || $.trim(t.text()) ) {
						if(!node) div.before(node = $('<p>'));
						node.append(this);
					} else {
						t.remove();
					}
					return true;
				}

				div.before(t);
				node = null;
			});

			div.remove();
		});
	},
	API_OPEN_TXT_EDITOR : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var box  = params[1];
		var bef  = params[2]; // selection to be before this editor
		var cfg  = this.configs[seq];
		var meanless;

		// Create this editor if it doesn't exists
		if (!cfg) cfg = this.create(seq);

		// 이벤트 제거를 위해 DOM에서 제거한다.
		var tx = cfg.editor.find('div.txEditor:first');
		tx.prev().after(tx.remove());

		if(box) {
			box.hide().after(cfg.editor).find('button.del,div.drag_handle').remove();
			cfg.textarea.val( box.html() );
		} else if (bef) {
			bef.after(cfg.editor);
			cfg.textarea.val( '<p><br /></p>' );
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
			cfg.textarea.val( '<p><br /></p>' );
		}

		cfg.editor.show();
		(function(){
			try {
				meanless = cfg.iframe[0].contentWindow.document.body.firstChild;
				cfg.xpress = self.createXpressEditor(seq);

				self.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
			} catch(e) {
				setTimeout(arguments.callee, 10);
			}
		})();
	},
	API_CLOSE_TXT_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._txt:hidden');

		if(save) {
			var newBox  = $('<div>').html( cfg.xpress.getIR() );
			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'TXT']);
		} else {
			box.show();
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new TextWriter);

var QuoteWriter = xe.createPlugin('QuoteWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self      = this;
		var _editor   = configs[seq].writeArea.find('>div.quote:first');
		var _textarea = _editor.find('textarea:first');
		var _source   = _editor.find('input[type=text]:first');

		self.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'QUOTE']);

		this.configs[seq] = {
			editor   : _editor,
			textarea : _textarea,
			source   : _source
		};

		return this.configs[seq];
	},
	API_SETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var obj  = params[1];

		obj.children('div.xe_dr_blockquote,blockquote.citation')
			.each(function(){
				var t = $(this);
				if (t.is('div.xe_dr_blockquote')) {
					t.find('>blockquote').attr('class', 'citation');
				} else if (t.is('blockquote')) {
					t = t.wrap('<div>').parent();
				}
				t.attr('class', 'eArea _quote').attr('type', 'quote');
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var obj  = params[1];

		obj.children('div._quote').each(function(){
			var quote = $(this).children('blockquote.citation');
			quote.parent().before(quote).remove();
		});
	},
	API_OPEN_QUOTE_EDITOR : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var box  = params[1];
		var bef  = params[2]; // selection to be before this editor
		var cfg  = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		if (box) {
			box.hide().after(cfg.editor);
			cfg.textarea.val( untranslate(box.find('p').html().replace(/<br ?\/?>/ig, '\n')) );
			cfg.source.val(box.find('cite').html());
		} else {
			self.cast('RESET_EDITOR', [seq, cfg.editor, 'QUOTE']);
			cfg.editor.appendTo(configs[seq].editArea);
		}
		cfg.editor.show().find('textarea').focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_QUOTE_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._quote:hidden');
		var txt  = $.trim(cfg.textarea.val());

		if (save && txt) {
			var newBox = $('<div>');
			var quote  = $('<blockquote class="citation" />').append( $('<p>').html( translate(txt).replace(/\r?\n/g, '<br />') ) ).appendTo(newBox);
			var src = $.trim(cfg.source.val());

			if(src == cfg.source.attr('title')) src = '';
			if(src) $('<cite>').html(translate_cite(src)).appendTo(quote);

			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'QUOTE']);
		} else {
			box.show();
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new QuoteWriter);

var MovieWriter = xe.createPlugin('MovieWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor   = configs[seq].writeArea.find('>div.movie');
		var _textarea = _editor.find('textarea');

		self.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'MOVIE']);

		this.configs[seq] = {
			editor : _editor,
			embed  : _textarea.eq(0),
			desc   : _textarea.eq(1),
			source : _editor.find('input[type=text]')
		};

		return this.configs[seq];
	},
	API_SETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var obj  = params[1];

		obj.children('object,embed,div.xe_dr_mov,div:has(div.embed)')
			.each(function(){
				var t = $(this);
				if (!t.is('div')) t = t.wrap('<div>').parent();
				t.attr('class', 'eArea _movie').attr('type', 'movie');
				t.find('>embed,>object').wrap('<div class="embed">');
				t.find('>p.cite>cite').unwrap();
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var obj  = params[1];
		var mov  = obj.children('div._movie').children('embed,object');

		// TODO : 플래시 태그면 embed, object를 모두 사용하도록 변환

		obj.parent().before(mov).remove();
	},
	API_OPEN_MOVIE_EDITOR : function(sender, params) {
		var self = this;
		var seq  = params[0];
		var box  = params[1];
		var bef  = params[2]; // selection to be before this editor
		var cfg  = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		self.cast('RESET_EDITOR', [seq, cfg.editor, 'MOVIE']);

		if (box) {
			var embed  = $.trim( box.find('>div.embed').html() );
			var desc   = $.trim( box.find('>p.desc').html() );
			var source = $.trim( box.find('>cite').html() );

			cfg.embed.val( embed );
			cfg.desc.val( desc );
			cfg.source.val( source );

			box.hide().after(cfg.editor);
		} else if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		cfg.editor.show().find('textarea:first').focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_MOVIE_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._movie:hidden');
		var val  = $.trim(cfg.embed.val());

		if (save && val) {
			var newBox = $('<div>').append( $('<div class="embed">').html(val) );
			var desc   = $.trim(cfg.desc.val());
			var source = $.trim(cfg.source.val());

			if (desc == cfg.desc.attr('title')) desc = '';
			if (source == cfg.source.attr('title')) source = '';

			if (desc) newBox.append( $('<p class="desc">').text(desc) );
			if (source) newBox.append( $('<cite>').html(translate_cite(source)) );

			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'MOVIE']);
		} else {
			box.show();
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new MovieWriter);

// Image Writer
var ImageWriter = xe.createPlugin('ImageWriter', {
	configs : null,
	_iframe : null,
	_form   : null,
	init : function() {
		var target = 'xe_dr_imgframe_'+(new Date).getTime();

		this.configs = {};
		this._iframe = $('<iframe name="'+target+'" src="about:blank" style="position:absolute;width:1px;height:1px;left:-2000px;top:0">');
		this._form   = $('<form target="'+target+'" method="POST" enctype="multipart/form-data" style="position:absolute;width:1px;height:1px;left:-2000px;"></form>')
			.append('<input type="hidden" name="editor_sequence" value="" />')
			.append('<input type="hidden" name="callback" />')
			.append('<input type="hidden" name="file_srl" />')
			.append('<input type="hidden" name="mid" value="" />')
			.append('<input type="hidden" name="module" value="file" />')
			.append('<input type="hidden" name="act" value="procFileIframeUpload" />')
			.append('<input type="hidden" name="uploadTargetSrl" value="" />');

		if (typeof(xeVid) != 'undefined') this._form.append('<input type="hidden" name="vid" value="'+xeVid+'" />');

	},
	create : function(seq) {
		var self = this;
		var _editor  = configs[seq].writeArea.find('>div.img');
		var _file    = _editor.find('input[type=file]');
		var _desc    = _editor.find('input[type=text].desc');
		var _image   = _editor.find('div.image > img');
		var _resize  = _editor.find('div.resize');
		var _align   = _editor.find('div.align');
		var _message = _editor.find('p.uploading');

		self.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'IMG']);

		_file.change(function(){
			var t = $(this);
			var prev = t.prev();
			
			if ( !/\.(jpe?g|png|gif)$/i.test(t.val()) ) {
				t.val('');
				return false;
			}

			var callback_id = ''+(new Date).getTime()+Math.ceil(Math.random()*1000);
			window[callback_id] = function(fileObj){ self.onfileuploaded(seq, callback_id, fileObj); }
			
			var filesrl = (_image.attr('class')||'').match(/(?:^|\s)xe_filesrl_(\d+)(?:\s|$)/);
			filesrl = (filesrl && filesrl[1])? filesrl[1] : '';

			// upload file
			self._form.find('input[name=editor_sequence]').val(seq);
			self._form.find('input[name=callback]').val(callback_id);
			self._form.find('input[name=file_srl]').val(filesrl);
			self._form.find('input[name=uploadTargetSrl]').val(editorRelKeys[seq]["primary"].value);
			self._form.append(t).submit();
			setTimeout(function(){ self.reset_fileform(t); prev.after(t) }, 0);

			// hide image and show uploading
			_image.parent().hide();
			_file.hide();
			_resize.hide();
			_align.hide();
			_message.show();
		});

		_message.find('button').click(function(){
			self._iframe.attr('src', 'about:blank');
			_file.show();
			_message.hide();

			if (_image.attr('src')) _image.parent().show();
		});

		_align.find('input[type=radio]').click(function(){ _image.parent().css('text-align', this.value); });

		_resize.find('button.btn_resize').click(function(){
			var w = parseInt(_resize.find('input[type=text].width').val());
			var n = parseInt(_resize.find('dd>em').text());

			if (isNaN(w) || isNaN(n) || w > n) {
				_resize.find('p.resizeError').show();
				return false;
			}

			_resize.find('p.resizeError').hide();
			var _file_srl = _image.attr('filesrl');

			$.exec_json('file.procFileImageResize',{width:w, file_srl:_file_srl},function(data){
				if(data.error != 0) return;

				_image.attr({
					src    : encodeURI(data.resized_info.src),
					width  : data.resized_info.info[0],
					height : data.resized_info.info[1]
				});

				if(!_image.attr('rawsrc')) _image.attr('rawsrc', _src);
			});
		})

		this.configs[seq] = {
			editor  : _editor,
			file    : _file,
			desc    : _desc,
			image   : _image,
			resize  : _resize,
			align   : _align,
			message : _message
		};

		return this.configs[seq];
	},
	show_resize : function(seq, src) {
		var cfg = this.configs[seq];

		cfg.resize.find('p.resizeError').hide();

		cfg.image
			.load(function(){ var w=this.width, h=this.height, t=$(this); if(w>600){ cfg.resize.show().find('dd>em').text(w);cfg.resize.find('dd>input:text').val(600); } })
			.attr('src', src)
			.parent().show();
	},
	reset_fileform : function(obj) {
		var next = obj.next();
		var form = $('<form>').append(obj)[0].reset();
		next.before(obj);
	},
	onfileuploaded : function(seq, callback_id, fileObj) {
		// remove callback function
		try {
			delete window[callback_id];
		} catch(e) {
			window[callback_id] = null;
		}

		if(fileObj.error==-1){
			alert(fileObj.message);
			return;
		}
		
		var self = this;
		var cfg  = this.configs[seq];

		if(fileObj.upload_target_srl && fileObj.upload_target_srl != 0) {
			editorRelKeys[seq]['primary'].value = fileObj.upload_target_srl;
		}

		// show resize
		cfg.image
			.removeAttr('width')
			.removeAttr('height')
			.removeAttr('rawsrc')
			.attr('filesrl', fileObj.file_srl);

		cfg.file.show();
		cfg.align.show();
		cfg.message.hide();
		this.show_resize(seq, encodeURI(fileObj.uploaded_filename));

		// 이미지 파일도 서버측에서는 파일로 카운트 되므로,
		// reloadFileList를 호출해서 orderedFiles와 uploadedFiles 배열을 갱신해주도록 한다.
		// 관련 이슈 : http://textyle.xpressengine.net/18256095
		var settings = {
			fileListAreaID : '',
			editorSequence : seq,
			uploadTargetSrl : ''
		};
		reloadCallback[seq] = function(){};
		reloadFileList(settings);
	},
	API_ONREADY : function() {
		this._form.attr('action', request_uri)
		this._form.find('input[name=mid]').val(current_mid);

		this._iframe.appendTo(document.body).after(this._form);
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('img,p.img,div._img,div.xe_dr_img')
			.each(function(){
				var t = $(this);
				if(t.is('img')) t = t.wrap('<p class="img"></p>');
				if(t.is('p.img')) t = t.wrap('<div></div>').parent();
				if(t.is('div.xe_dr_img')) {
					var img    = t.children('p:has(img)').attr('class', 'img');
					var desc   = t.children('p.desc').remove();
					var cite   = t.children('p.cite').remove();
					var s_desc = $.trim(desc.html() || '');
					var s_cite = $.trim(cite.html() || '');
					var s_text = [];

					if (s_desc) s_text.push(s_desc);
					if (s_cite) s_text.push(s_cite);
					if (s_text.length) img.append('<br>').append($('<div>').html(s_text.join(' - ')).contents());
				}

				t.attr('class', 'eArea _img').attr('type', 'img');
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div._img')
			.each(function(){
				var t = $(this);
				var p = t.children('p').attr('class', 'img');
				t.before(p).remove();
			});
	},
	API_OPEN_IMG_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		// reset
		this.cast('RESET_EDITOR', [seq, cfg.editor, 'IMG']);

		if(box) {
			var p   = box.children('p.img:first');
			var img = p.find('img');

			box.hide().after(cfg.editor);
			cfg.align.show();

			if (img.attr('rawsrc')) cfg.image.attr('rawsrc', img.attr('rawsrc'));
			this.show_resize(seq, img.attr('src'));

			var align = p.css('text-align');
			if (align) {
				cfg.align.find('input[value='+align.toLowerCase()+']').attr('checked', 'checked');
				cfg.image.parent().css('text-align', align);
			}

			var _class = img.attr('class').match(/(?:^|\s)xe_filesrl_(\d+)(?:\s|$)/);
			if (_class && _class[1]) cfg.image.attr('filesrl', _class[1]);

			var desc  = $.trim(p.text());
			if (desc) cfg.desc.val(desc);
		} else if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		cfg.editor.show();
		(($.browser.msie||$.browser.opera)?cfg.desc:cfg.file).focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_IMG_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._img:hidden');

		if (save && cfg.image.attr('src')) {
			var align = cfg.align.find('input[type=radio]:checked').val();
			var newBox = $('<div>');
			var img    = $('<img>').attr('src', cfg.image.attr('src'));
			var rawsrc = cfg.image.attr('rawsrc');

			$('<p class="img">').css('text-align', align).append(img).appendTo(newBox);
			img.attr({ 'width':cfg.image.attr('width'), 'height':cfg.image.attr('height') });
			if (rawsrc) img.attr('rawsrc', rawsrc);

			var desc = $.trim(cfg.desc.val());
			if (desc && desc != cfg.desc.attr('title')) img.after(translate_cite(desc)).after('<br />');

			var filesrl = cfg.image.attr('filesrl');
			if (filesrl) img.addClass('xe_filesrl_'+filesrl);
			
			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'IMG']);
		} else {
			box.show();
		}
		
		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	},
	API_BEFORE_RESET_EDITOR : function(sender, params) {
		var seq  = params[0];
		var type = params[2];
		var cfg  = this.configs[seq];

		if (type == 'IMG') {
			cfg.image
				.removeAttr('filesrl')
				.removeAttr('width')
				.removeAttr('height')
				.removeAttr('src')
				.removeAttr('rawsrc')
				.parent().css('text-align', '').hide();
			cfg.resize.hide().find('input[type=text]').val('');
			cfg.align.hide().find('input[type=radio]:first').attr('checked', 'checked');
			cfg.file.show();
			cfg.desc.val('');

			this.reset_fileform(cfg.file);
		}
	},
	API_AFTER_DELETE_PARAGRAPH : function(sender, params) {
		var self   = this;
		var seq    = params[0];
		var target = params[1];

		if (target && target.length) {
			var srl = [];
			target.filter('div._img').each(function(){
				var s = $(this).find('img[class^=xe_filesrl]').attr('class').replace('xe_filesrl_','');
				if(s) srl.push(s);
			});

			if(srl.length) exec_xml('file','procFileDelete',{file_srls:srl.join(','),editor_sequence:seq});
		}
	}
});
editor.registerPlugin(new ImageWriter);

// Material Writer
var MaterialWriter = xe.createPlugin('MaterialWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor  = configs[seq].writeArea.find('>div.material:first');
		var _buttons = _editor.find('div.controls button');
		_buttons.eq(0).click(function(){ self.load_material(seq, 1); });
		_buttons.eq(1).click(function(){ self.cast('CLOSE_EDITOR', [seq, false, 'MATERIAL']); });
	
		this.configs[seq] = {
			editor     : _editor,
			template   : _editor.find('div._container > dl').remove(),
			to_save    : null,
			loaded     : false,
			prev_page  : 0,
			next_page  : 0,
			total_page : 0
		};

		this.load_material(seq, 1);

		return this.configs[seq];
	},
	load_material_next : function(seq){
		var cfg = this.configs[seq];

		if(++cfg.next_page>=cfg.total_page) cfg.next_page=cfg.total_page;
		cfg.next_page = cfg.next_page>0?cfg.next_page:1;
		this.load_material(seq, cfg.next_page);
	},
	load_material_prev : function(seq){
		var cfg = this.configs[seq];

		cfg.prev_page = --cfg.prev_page>0?cfg.prev_page:1;
		this.load_material(seq, cfg.prev_page);
	},
	load_material : function(seq, page) {
		var self = this;
		var cfg  = this.configs[seq];
		var area = cfg.editor.find('div._container');
		var paginate = cfg.editor.find('div.paginate');

		if (!page) page = 1;

		function callback(data){
			if(data.page_navigation.total_count) cfg.editor.find('p.noData').css('display','none');

			// 글감 목록 전부 삭제
			area.children().remove();

			// 페이징
			paginate.find('> span').text(data.page_navigation.cur_page+'/'+data.page_navigation.total_page);

			cfg.prev_page  = data.page_navigation.cur_page;
			cfg.next_page  = data.page_navigation.cur_page;
			cfg.total_page = data.page_navigation.total_page;
			
			if(!cfg.loaded){
				paginate.find('> button.prev').click(function(){ self.load_material_prev(seq) });
				paginate.find('> button.next').click(function(){ self.load_material_next(seq) });
			}

			// 컨텐트 추가
			$.each(data.material_list, function(){
				var tpl = cfg.template.clone();

				tpl.addClass('xe_dr_'+this.type);
				tpl.find('dt').text(this.regdate.substring(0,4)+'.'+this.regdate.substring(4,6)+'.'+this.regdate.substring(6,8)+' '+this.regdate.substring(8,10)+':'+this.regdate.substring(10,12));
				tpl.find('dd > div.eArea').html(this.content);
				tpl.find('dd > span.buttonDrEditor > button').click(function(event){
					var t = $(event.target);
					var o = t.parent().prev('div.eArea').eq(0).clone();

					self.cast('SETTING_CONTENT', [seq, o]);

					cfg.to_save = o;
					self.cast('CLOSE_MATERIAL_EDITOR', [seq, true]);
				});

				area.append(tpl);
			});

			cfg.loaded =true;
		}

		if(area.length) $.exec_json('material.dispMaterialList',{page:page, list_count:4}, callback);
	},
	API_OPEN_MATERIAL_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		cfg.editor.show();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_MATERIAL_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box;

		if (save && cfg.to_save) {
			var newBox = cfg.to_save.children('div.eArea');

			cfg.to_save = null;
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, '']);
		} else {
			box = cfg.editor.prev('div.eArea');
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new MaterialWriter);

// File Writer
var regex_srl  = /filesrl_([0-9-]+)/;
var FileWriter = xe.createPlugin('FileWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor   = configs[seq].writeArea.find('>div.file');
		var _files    = _editor.find('dl.attachedFile');
		var _summary  = _editor.find('p.summary').next('div.hr').andSelf();
		var _template = _files.find('> dd:first').show().remove();
		var _count    = _summary.find('strong.filecount');
		var _size     = _summary.find('em.filesize');
		var _inputs   = _editor.find('input[type=text]');

		this.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'FILE']);

		this.configs[seq] = {
			editor    : _editor,
			template  : _template,
			summary   : _summary,
			files     : _files,
			count     : _count,
			size      : _size,
			desc      : _inputs.eq(0),
			cite      : _inputs.eq(1),
			n_count   : 0,
			n_size    : 0,
			queue_idx : 0
		};

		return this.configs[seq];
	},
	onstartupload : function(seq) {
		this.configs[seq].queue_idx = 0;
	},
	onfileuploaded : function(seq, fileObj, serverData, obj) {
		var self = this;
		var cfg  = this.configs[seq];
		var tpl  = cfg.template.clone();

		tpl.find('>strong').text(fileObj.name);
		tpl.find('>em').text(this.formatsize(fileObj.size));
		tpl.addClass('filesrl_-'+(orderedFiles.length+cfg.queue_idx));
		tpl.find('button.buttonDelete').click(function(){ self.ondelete(seq, $(this)) }).hide();
		tpl.appendTo(cfg.files);

		cfg.files.show().append(tpl);
		cfg.queue_idx++;

		// summary
		cfg.summary.show();
		cfg.count.text(++cfg.n_count);
		cfg.size.text(this.formatsize(cfg.n_size += fileObj.size));

		// process next queue
		if (obj.getStats().files_queued > 0) obj.startUpload();
	},
	onreloadlist : function(seq, upload_target_srl) {
		var cfg  = this.configs[seq];

		if(upload_target_srl) editorRelKeys[seq].primary.value = upload_target_srl;
		cfg.files.children('dd').each(function(){
			var dd  = $(this);
			var srl = dd.attr('class').match(regex_srl);
			var cls;

			if (!srl || !srl[1]) return;

			cls = srl[0]; srl = parseInt(srl[1]);

			if (srl <= 0) {
				var fileObj = orderedFiles[Math.abs(srl)];

				if (!fileObj) return;

				// 기존 파일 시퀀스를 지우고 새 시퀀스 추가
				dd.removeClass(cls).addClass('filesrl_'+fileObj.file_srl);

				// 삭제버튼 보여주기
				dd.find('button.buttonDelete').show();
			}
		});
	},
	ondelete : function(seq, btn) {
		var cfg = this.configs[seq];
		var srl = btn.parent().attr('class').match(regex_srl);

		if (!srl || !srl[1] || (srl=parseInt(srl[1])) < 0) return;

		// remove this file
		btn.parent().remove();
		if (!cfg.files.children('dd').length) {
			cfg.files.hide();
			cfg.summary.hide();
		}

		// TODO : delete this file from the server

		var fileObj = uploadedFiles[srl];
		if (fileObj) {
			cfg.count.text(--cfg.n_count);
			cfg.size.text(this.formatsize(cfg.n_size -= fileObj.file_size));
		}
	},
	formatsize : function(size) {
		size = parseFloat(size);
		if (isNaN(size)) return 'NaN';

		var units = ['B','KB','MB','GB','TB'];
		var i = 0;

		while((i < units.length-1) && size > 1024) {
			size /= 1024;
			i++;
		}

		size = (size+'').replace(/(\.\d{2})\d+$/, '$1') + ' ' + units[i];

		return size;
	},
	API_ONREADY : function() {
		reloadFileList({fileListAreaID:'',editorSequence:1,uploadTargetSrl:''});
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div.xe_dr_file,dl.attachedFile')
			.each(function(){
				var t = $(this);

				if (t.is('dl')) {
					var div = t.wrap('<div>').parent();

					if ((t=t.next('p.desc,p.cite')).length) div.appned(t);
					if ((t=t.next('p.desc,p.cite')).length) div.appned(t);

					t = div;
				}

				t.attr('class', 'eArea _file').attr('type', 'file');
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div._file')
			.each(function(){
				var t = $(this);
				t.before(t.children('dl,p')).remove();
			});
	},
	API_OPEN_FILE_EDITOR : function(sender, params) {
		var self = this;
		var init = false;
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];
		

		if (!cfg) {
			cfg  = this.create(seq);
			init = true;
		}

		this.cast('RESET_EDITOR', [seq, cfg.editor, 'FILE']);

		if(box) {
			box.find('dl.attachedFile > dd').each(function(){
				var dd  = $(this);
				var tpl = cfg.template.clone();
				var srl = dd.attr('class').match(regex_srl);

				if (!srl || !(srl=srl[1])) return;
				srl = parseInt(srl);

				tpl.addClass('filesrl_'+srl);
				tpl.find('>strong').text(dd.find('>a').text());
				tpl.find('>em').text(dd.find('>span').text());
				tpl.find('button.buttonDelete').click(function(){ self.ondelete(seq, $(this)) });

				cfg.n_count++;
				cfg.n_size += parseInt(uploadedFiles[srl].file_size) || 0

				cfg.files.append(tpl);
			});

			cfg.count.text(cfg.n_count);
			cfg.size.text(this.formatsize(cfg.n_size));
			
			cfg.files.show();
			cfg.summary.show();

			box.hide().after(cfg.editor);
		} else if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		cfg.editor.show();
		cfg.desc.focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);

		if (init) {
			// if you use firebug, this code will crash your firefox browser.
			reloadCallback[seq] = function(upload_target_srl){ self.onreloadlist(seq, upload_target_srl) };

			uploaderSettings['editorSequence'] = seq;
			uploaderSettings['upload_start_handler']   = function(){ self.onstartupload(seq) };
			uploaderSettings['upload_success_handler'] = function(file,serverData){self.onfileuploaded(seq,file,serverData,this)};
			editorUploadInit(uploaderSettings);

			init = true;
		}
	},
	API_CLOSE_FILE_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._file:hidden');
		var file = cfg.files.children('dd');
		var desc = $.trim(cfg.desc.val());
		var cite = $.trim(cfg.cite.val());

		if (save && file.length) {
			var newBox = $('<div>');
			var dl     = $('<dl class="attachedFile"><dt>'+xe.lang.attached_files+'</dt></dl>').appendTo(newBox);

			$.each(file, function(){
				var dd  = $(this);
				var srl = dd.attr('class').match(regex_srl);

				if (!srl || !(srl=srl[1])) return;
				srl = parseInt(srl);

				var fileObj = uploadedFiles[srl];
				var a  = $('<a>').attr('href', request_uri + fileObj.download_url.replace(/\&amp;/g, '&')).text(fileObj.source_filename);
				var sz = $('<span>').text(fileObj.disp_file_size);
				
				
				$('<dd>').attr('class', 'filesrl_'+srl).append(a).append(sz).appendTo(dl);
			});

			if (desc && desc != cfg.desc.attr('title')) newBox.append($('<p class="desc">').html(translate(desc)));
			if (cite && cite != cfg.cite.attr('title')) newBox.append($('<p class="cite">').html(translate(cite)));

			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'FILE']);
		} else {
			box.show();
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	},
	API_BEFORE_RESET_EDITOR : function(sender, params) {
		var seq  = params[0];
		var type = params[2];

		if (type == 'FILE') {
			var cfg = this.configs[seq];
			cfg.n_count = 0;
			cfg.n_size  = 0;
			cfg.count.text(0);
			cfg.size.text(0);
			cfg.summary.hide();
			cfg.files.empty().hide();
		}
	},
	API_AFTER_DELETE_PARAGRAPH : function(sender, params) {
		var self   = this;
		var seq    = params[0];
		var target = params[1];

		if (target && target.length) {
			var srl = [];
			target.filter('div._file').each(function(){
				$(this).find('dd[class^=filesrl_]').each(function(){
					var s = $(this).attr('class').replace('filesrl_','');
					if(s) srl.push(s);
				});
			});

			if(srl.length) exec_xml('file','procFileDelete',{file_srls:srl.join(','),editor_sequence:seq});
		}
	}

});
if(window.reloadFileList) editor.registerPlugin(new FileWriter);

// List Writer
var ListWriter = xe.createPlugin('ListWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor  = configs[seq].writeArea.find('>div.list');
		var _toolbar = _editor.find('ul.toolbar');
		var _list    = _editor.find('div.listArea');
		
		this.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'LIST']);

		_toolbar.find('button').click(function(){
			var type = $(this).attr('class').match(/type_([a-z\-]+)/);
			if (!type || !type[1]) return false;

			self.ontoolbutton(seq, type[1]);

			return false;
		});

		this.configs[seq] = {
			editor  : _editor,
			toolbar : _toolbar,
			list    : _list,
			focused : null
		};

		return this.configs[seq];
	},
	ontoolbutton : function(seq, type) {
		var cfg = this.configs[seq];

		if (!cfg.focused) return alert(no_selected_object_msg);

		var par = cfg.focused.parent('li').parent('ul,ol');
		if (par.length && type) par.eq(0).css('list-style-type', type);

		cfg.focused.focus();
	},
	add_event : function(seq) {
		var self = this;

		this.configs[seq].list.find('li > input:not(.hasHandler)')
			.addClass('hasHandler xe_content')
			.keydown(function(event){ return self.onkeydown(seq, event) })
			.focus(function(event){ return self.onfocus(seq, event) });
	},
	new_item : function(returnObj) {
		var html = '<li><input type="text" /></li>';

		return returnObj?$(html):html;
	},
	onkeydown : function(seq, event) {
		var self = this;
		var meta = event.metaKey;
		var ctrl = event.ctrlKey;
		var cfg  = this.configs[seq];
		var obj  = $(event.target);
		var li   = obj.parent('li');
		var item, ul, prev, next, val='', start, end, stop = false;

		switch(event.keyCode) {
			case 13: // enter
				stop = true;

				if (ctrl) {
					setTimeout(function(){ self.cast('CLOSE_EDITOR', [seq, true, 'LIST']) }, 1);
				} else {
					if (!$.trim(obj.val())) return obj.focus() && false;

					var start = this.get_pos(obj, 'start');
					var end   = this.get_pos(obj, 'end');
					var val   = obj.val().substr(end);

					obj.val( obj.val().substr(0, start) );

					li.after(item = this.new_item(true));
					this.add_event(seq);
					this.set_pos( item.find('>input').focus().val(val), 0 );
				}
				break;
			case 27: // ESC
				stop = true;
				setTimeout(function(){ self.cast('CLOSE_EDITOR', [seq, false, 'LIST']) }, 1);
				break;
			case 37: // left
				if (!ctrl) break;
				stop = true;
				this.move_left(obj, li);
				setTimeout(function(){obj.focus();}, 1);
				break;
			case 39: // right
				if (!ctrl) break;
				stop = true;
				this.move_right(obj, li);
				setTimeout(function(){obj.focus();},1);
				break;
			case 38: // up
				if (!ctrl) {
					if (!event.altKey && !event.shiftKey) {
						var objs = cfg.list.find('input[type=text]');
						var idx  = objs.index(obj);
						if (idx > 0) objs.eq(idx-1).focus();
					}
					break;
				}
				stop = true;
				this.move_up(obj, li);
				setTimeout(function(){obj.focus();}, 1);
				break;
			case 40: // down
				if (!ctrl) {
					if (!event.altKey && !event.shiftKey) {
						var objs = cfg.list.find('input[type=text]');
						var idx  = objs.index(obj);
						if (idx < objs.length-1) objs.eq(idx+1).focus();
					}
					break;
				}
				stop = true;
				this.move_down(obj, li);
				setTimeout(function(){obj.focus()}, 1);
				break;
			case 8: // backspace
				start = this.get_pos(obj, 'start');
				if (start == 0) {
					var lis  = cfg.editor.find('li > input[type=text]');
					var n_li = lis.index(obj);

					if (n_li > 0) {
						stop = true;
						prev = lis.eq(n_li - 1);
						val  = prev.val();

						prev.focus().val( val + ($.browser.opera?' ':'') + obj.val() );
						this.set_pos(prev, val.length + ($.browser.opera?1:0));

						// remove current item
						obj.parent().remove();
					}
				}
				break;
			case 46: // delete
				start = this.get_pos(obj, 'start');
				end   = this.get_pos(obj, 'end');
				if ((start == end) && (end == obj.val().length)) {
					var lis  = cfg.editor.find('li > input[type=text]');
					var n_li = lis.index(obj);

					if (n_li < lis.length-1) {
						stop = true;
						next = lis.eq(n_li + 1);
						val  = obj.val();

						obj.val( val + ($.browser.opera?' ':'') + next.val() );
						this.set_pos(obj, val.length);
						
						// remove next item
						next.parent().remove();
					}
				}
				break;
		}

		return !stop;
	},
	get_pos : function(obj, type) {
		var n_before, n_after;

		if (typeof obj[0].selectionStart == 'number') {
			n_before = obj[0].selectionStart;
			n_after  = obj[0].selectionEnd;
		} else if(document.selection) {
			var before = document.selection.createRange().duplicate();
			var after  = document.selection.createRange().duplicate();
			var n_before, n_after;

			before.moveEnd('character', obj.val().length);
			after.moveStart('character', -obj.val().length);

			n_before = (before.text=='')?obj.val().length:obj.val().lastIndexOf(before.text);
			n_after  = after.text.length;
		}

		if (n_before == n_after || type == 'start') return n_before;
		else if (type == 'end') return n_after;
	},
	set_pos : function(obj, pos) {
		if (typeof obj[0].setSelectionRange == 'function') {
			obj[0].setSelectionRange(pos, pos);
		} else if(obj[0].createTextRange) {
			var range = obj[0].createTextRange();
	
			range.moveStart('character', pos);
			range.collapse(true);
			range.select();
		}
	},
	move_up : function(obj, li) {
		if (li.prev('li').length) return li.prev('li').before(li);

		var lev = this.get_level(li);
		if (lev == 1) return;

		var par = li.parent().parent('li');
		var prv = par.prev('li');
		if (prv.length) {
			var oul = prv.children('ul,ol');
			if (!oul.length) oul = $('<ul>').appendTo(prv);
			oul.append(li);
		} else if (li.is(':first') && par.is(':first')) {
			par = par.parents('li');
			par.eq(par.length-1).before(li);
		} else {
			par.parent('ol,ul').prepend(li);
		}
	},
	move_down : function(obj, li) {
		if (li.next('li').length) return li.next('li').after(li);

		var lev = this.get_level(li);
		if (lev == 1) return;

		var par = li.parent().parent('li');
		var nxt = par.next('li');

		if (nxt.length) {
			var oul = nxt.children('ul,ol');
			if (!oul.length) oul = $('<ul>').appendTo(nxt);
			oul.prepend(li);
		} else if (li.is(':last') && par.is(':last')) {
			par = par.parents('li');
			par.eq(par.length-1).after(li);
		} else {
			par.parent('ol,ul').append(li);
		}
	},
	move_left : function(obj, li) {
		if (this.get_level(li) == 1) return;

		var next = li.nextAll('li');
		var list = li.children('ul,ol');

		if (next.length) {
			if (!list.length) li.append(list = $('<ul>'));
			list.append(next);
		}

		li.parent().parent('li').after(li);
	},
	move_right : function(obj, li) {
		var prev = li.prev('li');
		var list = prev.children('ul,ol');

		if (list.length) {
			list.append(li);
		} else if (prev.length) {
			$('<ul>').append(li).appendTo(prev);
		}
	},
	get_level : function(elem) {
		var el  = $(elem).get(0);
		var lev = 0;
		var tag = '';
		
		while(el) {
			tag = el.tagName.toLowerCase();
			if (tag == 'div' && el.className == 'listArea') break;
			if (tag == 'ul' || tag == 'ol') lev++;
			el = el.parentNode;
		}

		return lev;
	},
	onfocus : function(seq, event) {
		this.configs[seq].focused = $(event.target);
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('ul,ol,div.xe_dr_list').each(function(){
			var t = $(this);
			if (!t.is('div')) t = t.wrap('<div />').parent();
			t.attr('class', 'eArea _list').attr('type', 'list').find('ol>br,ul>br').remove();
		});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div._list')
			.each(function() {
				var list = $(this).children('ul,ol');
				list.parent().before(list).remove();
			});
	},
	API_OPEN_LIST_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		this.cast('RESET_EDITOR', [seq, cfg.editor, 'LIST']);

		if(box) {
			box.hide().after(cfg.editor)
				.children('ul,ol').clone()
				.appendTo(cfg.list.empty())
				.find('li')
				.each(function(){
					var t = $(this);
					var c = t.children('ul,ol').remove();
					var v = $.trim(t.text());
					t.empty().append( $('<input type="text">').val(v) ).append(c);
				});
		} else if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		this.add_event(seq);
		cfg.editor.show().find('input[type=text]:first').focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_LIST_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._list:hidden');

		if (save) {
			var newBox = $('<div>');
			var list   = cfg.list.children('ul,ol').appendTo(newBox);
			var div    = $('<div>');

			list.find('input[type=text]').each(function(){
				var t = $(this);
				var v = $.trim(t.val());

				if (v || t.parent().children('ul,ol').length) {
					div.text(v);
					t.before(div[0].firstChild).remove();
				} else {
					t.parent().remove();
				}
			});
			list.find('ul:not(:has(li)),ol:not(:has(li))').remove();

			if (list.children('li').length) {
				box.remove();
				this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'LIST']);
			}
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		box.show();

		cfg.editor.hide().appendTo(configs[seq].writeArea);

		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);
	},
	API_AFTER_RESET_EDITOR : function(sender, params) {
		var seq  = params[0];
		var edit = params[1];
		var type = params[2];
		var cfg  = this.configs[seq];

		if (type == 'LIST') {
			cfg.list.html('<ul><li><input type="text" /></li></ul>');
		}
	}
});
editor.registerPlugin(new ListWriter);

// Link Writer
var LinkWriter = xe.createPlugin('LinkWriter', {
	configs : {},
	init : function() {
		this.configs = {};
	},
	create : function(seq) {
		var self = this;
		var _editor = configs[seq].writeArea.find('>div.link');
		var _inputs = _editor.find('input[type=text]');
		var _text   = _inputs.eq(0);
		var _url    = _inputs.eq(1);
		var _desc   = _inputs.eq(2);

		this.cast('ADD_DEFAULT_EDITOR_ACTION', [seq, _editor, 'LINK']);

		this.configs[seq] = {
			editor : _editor,
			text   : _text,
			url    : _url,
			desc   : _desc
		};

		return this.configs[seq];
	},
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div.xe_dr_link,p.link')
			.each(function(){
				var t = $(this);
				if (t.is('div.xe_dr_link')) {
					var p = t.children('p');
					if (p.length > 1) p.eq(0).append('<br />').append( $('<span class="desc"></span>').text(p.eq(1).text()) );
					p.eq(0).children('a').before('<br />');
					p.eq(1).remove();
				} else {
					t = t.wrap('<div>').parent();
				}
				t.attr('class', 'eArea _link').attr('type', 'link');
			});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div._link')
			.each(function(){
				var p = $(this).children('p');
				p.parent().before(p).remove();
			});
	},
	API_OPEN_LINK_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];
		var cfg = this.configs[seq];

		if (!cfg) cfg = this.create(seq);

		this.cast('RESET_EDITOR', [seq, cfg.editor, 'LINK']);

		if(box) {
			box.hide().after(cfg.editor);
			cfg.text.val( box.find('strong').text() );
			cfg.url.val( box.find('a').attr('href') );

			var desc = $.trim(box.find('span.desc').text());
			if (desc) cfg.desc.val( desc );
		} else if (bef) {
			bef.after(cfg.editor);
		} else {
			cfg.editor.appendTo(configs[seq].editArea);
		}

		cfg.editor.show();
		cfg.text.focus();
		this.cast('SCROLL_INTO_VIEW', [seq, cfg.editor]);
	},
	API_CLOSE_LINK_EDITOR : function(sender, params) {
		var seq  = params[0];
		var save = params[1];
		var cfg  = this.configs[seq];
		var box  = cfg.editor.prev('div._link:hidden');

		var text = $.trim(cfg.text.val());
		var url  = $.trim(cfg.url.val());
		var desc = $.trim(cfg.desc.val());

		if (url  == cfg.url.attr('title')) url = '';
		if (desc == cfg.desc.attr('title')) desc = '';

		if (save && text && url) {
			var newBox = $('<div>');
			var para   = $('<p class="link">').appendTo(newBox)
					.append( $('<strong>').text( text ) )
					.append( $('<br />') )
					.append( $('<a>').attr('href', url).text(url) );

			if (desc) para.append('<br />').append( $('<span class="desc" />').text(desc) );

			box.remove();
			this.cast('SAVE_PARAGRAPH', [seq, cfg.editor, box=newBox, 'LINK']);
		}

		if(!box.length) box = cfg.editor.prev('div.eArea');
		box.show();
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);

		cfg.editor.hide().appendTo(configs[seq].writeArea);
	}
});
editor.registerPlugin(new LinkWriter);

// HR Writer
var HRWriter = xe.createPlugin('HRWriter', {
	API_SETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('hr,div.xe_dr_hr').each(function(){
			var t = $(this);
			if (!t.is('div')) t = t.wrap('<div>').parent();
			t.attr('class', 'eArea _hr').attr('type', 'hr');
		});
	},
	API_GETTING_CONTENT : function(sender, params) {
		var seq = params[0];
		var obj = params[1];

		obj.children('div._hr').each(function(){
			var hr = $(this).find('hr');
			hr.parent().before(hr).remove();
		});
	},
	API_OPEN_HR_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];

		if (box && box.length) {
			box.show(300);
		} else if (bef && bef.length) {
			bef.after(box = $('<div class="eArea _hr"><hr /></div>').attr('type', 'hr'));
		} else {
			var newBox = box = $('<div class="eArea _hr" />').attr('type', 'hr');
			configs[seq].editArea.append(newBox.append('<hr />'));
		}
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);
	}
});
editor.registerPlugin(new HRWriter);

// Help
var HelpViewer = xe.createPlugin('Help', {
	views : {},
	init : function() {
		this.views = {};
	},
	create : function(seq) {
		var self = this;

		this.views[seq] = configs[seq].writeArea.find('div.help');
		this.views[seq].find('button').click(function(){ self.cast('CLOSE_EDITOR', [seq, false, 'HELP']); });
	},
	API_OPEN_HELP_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = params[1];
		var bef = params[2];

		if(!this.views[seq]) this.create(seq);

		if(box) {
			box.after(this.views[seq]);
		} else if (bef) {
			bef.after(this.views[seq]);
		} else {
			configs[seq].writeArea.prepend(this.views[seq]);
		}
		this.views[seq].show().find('button').focus();
		this.cast('SCROLL_INTO_VIEW', [seq, this.views[seq]]);
	},
	API_CLOSE_HELP_EDITOR : function(sender, params) {
		var seq = params[0];
		var box = this.views[seq].prev('div.eArea');

		this.views[seq].hide();
		this.cast('SELECT_PARAGRAPH', [seq, box, box, box]);
		
	}
});
editor.registerPlugin(new HelpViewer);

// More
var More = xe.createPlugin('More', {
	API_BEFORE_CLICK_TOOLBUTTON : function(sender, params) {
		var seq    = params[0];
		var button = $(params[1]);

		if(!button.parent().is('li.more')) return true;

		button.parents('div.wToolbarContainer:first').toggleClass('more');

		this.cast('TOOLBAR_REPOSITION', [seq]);

		return false;
	}
});
editor.registerPlugin(new More);

// Validator plugin
var ValidatorHook = xe.createPlugin('ValidatorHook', {
	API_BEFORE_VALIDATE : function(sender, params) {
		var form = $(params[0]);
		var seq  = form[0].elements['editor_sequence'].value;
		var wArea_e = configs[seq].editArea.children('div.wArea:visible').filter(':not(.blank)');
		var wArea_w = configs[seq].writeArea.children('div.wArea:visible').filter(':not(.blank)');

		if (wArea_e.length || wArea_w.length) {
			return !!confirm(submit_without_saving_msg);
		}

		return true;
	}
});
xe.getApp('Validator')[0].registerPlugin(new ValidatorHook);

// Utility function
var table = {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}, untable;
function translate(str) {
	return str.replace(/<|>|&|"/ig, function(m0) { return table[m0]||m0; });
}

function untranslate(str) {
	if (!untable) {
		untable = {};
		$.each(table, function(key,val){ untable[val] = key; });
	}

	return str.replace(/&([lg]t|quot|amp);/g, function(m0) { return untable[m0]||m0; });
}

function translate_cite(str) {
	var s = str.replace(/<(\/)?([abi]|em|strong|cite)(.*?)>|<|>|&|"/ig, function(m0,m1,m2,m3) {
		m1 = m1 || '';
		m2 = (m2 || '' ).toLowerCase();
		m3 = m3 || '';

		if (table[m0]) return table[m0];
		if (m3 && m3.substr(0,1) != ' ') return '&lt;'+m1+m2+m3+'&gt;';
		if (m2 == 'em' || m2 == 'strong' || m2 == 'a' || m2 =='cite') return '<'+m1+m2+m3+'>';
		if (m2 == 'b') return '<'+m1+'strong>';
		if (m2 == 'i') return '<'+m1+'em>';
	});

	return s;
}

function is_left_click(event) {
	var ie = $.browser.msie; 
	return (typeof(event.button)=='undefined' || (ie && event.button == 1) || (!ie && event.button == 0));
}

editor.translate = translate;
editor.translate_cite = translate_cite;
editor.is_left_click = is_left_click;

})(jQuery);
