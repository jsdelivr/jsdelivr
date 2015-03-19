/*
 * jsTree 2.0.0
 * http://jstree.com/
 *
 * Copyright (c) 2013 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*global jQuery, window, document, setTimeout, setInterval, clearTimeout, clearInterval, console */
(function ($) {
	"use strict";

	// prevent another load? maybe there is a better way?
	if($.jstree) {
		return;
	}

	// internal variables
	var instance_counter = 0,
		ccp_node = false,
		ccp_mode = false,
		themes_loaded = [];

	// jquery object / function / selector
	$.jstree = {
		version : '2.0.0-alpha',
		defaults : {
			plugins : []
		},
		plugins : {},
		create : function (el, options) {
			// create the new core
			var tmp = new $.jstree.core(++instance_counter);
			// extend options with the defaults
			options = $.extend(true, {}, $.jstree.defaults, options);
			// each option key except 'core' represents a plugin to be loaded
			$.each(options.plugins, function (i, k) {
				if(i !== 'core') {
					// decorate the object with the plugin
					tmp = tmp.plugin(k, options[k]);
				}
			});
			// initialize the tree
			tmp.init(el, options);
			// return the instance
			return tmp;
		},
		core : function (id) {
			this._id = id;
			this._data = {
				'core' : {
					'themes' : {}
				}
			};
		},
		reference : function (needle) {
			return $(needle).closest('.jstree').data('jstree');
		}
	};
	$.fn.jstree = function (arg) {
		// check for string argument
		var is_method = (typeof arg === 'string'),
			args = Array.prototype.slice.call(arguments, 1),
			result = null;
		this.each(function () {
			// get the instance (if there is one) and method (if it exists)
			var instance = $(this).data('jstree'),
				method = is_method && instance ? instance[arg] : null;
			// if calling a method, and method is available - execute on the instance
			result = is_method && method ? method.apply(instance, args) : null;
			// if there is no instance - create one
			if(!instance) { $(this).data('jstree', new $.jstree.create(this, arg)); }
			// if there was a method call which returned a result - break and return the value
			if(result !== null && typeof result !== 'undefined') { return false; }
		});
		// if there was a method call with a valid return value - return that, otherwise continue the chain
		return result !== null && typeof result !== 'undefined' ? result : this;
	};
	// :jstree pseudo selector to find all elements with instances
	$.expr[':'].jstree = $.expr.createPseudo(function(search) {
		return function(a) {
			return $(a).hasClass('jstree') && typeof ($(a).data('jstree')) !== 'undefined';
		};
	});

	// CORE
	$.jstree.defaults.core = {
		strings			: false,
		check_callback	: true,
		animation		: 100,
		aria_roles		: true,
		multiple		: true,
		themes			: {
			name			: false,
			url				: true,
			dots			: true,
			icons			: true,
			dir				: false
		},
		base_height		: false
	};
	$.jstree.core.prototype = {
		plugin : function (deco, opts) {
			var Child = $.jstree.plugins[deco];
			if(Child) {
				this._data[deco] = {};
				Child.prototype = this;
				return new Child(opts, this);
			}
			return this;
		},

		init : function (el, options) {
			this.element = $(el).addClass('jstree jstree-' + this._id);
			this.settings = options;
			this.element.bind("destroyed", $.proxy(this.teardown, this));

			this._data.core.ready = false;
			this._data.core.rtl = (this.element.css("direction") === "rtl");
			this.element[this._data.core.rtl ? 'addClass' : 'removeClass']("jstree-rtl");
			if(this.settings.core.aria_roles) {
				this.element.attr('role','tree');
			}
			this._data.core.selected = $();

			this.bind();

			this._data.core.original_container_html = this.element.find(" > ul > li").clone(true);
			this._data.core.original_container_html.find("li").addBack().contents().filter(function() { return this.nodeType === 3 && (!this.nodeValue || /^\s+$/.test(this.nodeValue)); }).remove();
			this.element.html("<ul><li class='jstree-loading'><a href='#'>" + this.get_string("Loading ...") + "</a></li></ul>");
			this.clean_node(-1);
			this._data.core.li_height = this.settings.base_height || this.get_container_ul().children("li:eq(0)").height() || 18;
			this.load_node(-1, function () {
				this.trigger("loaded");
			});
		},
		destroy : function () {
			this.element.unbind("destroyed", this.teardown);
			this.teardown();
		},
		teardown : function () {
			this.unbind();
			this.element
				.removeClass('jstree')
				.removeData('jstree')
				.find("[class^='jstree']")
					.addBack()
					.attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
			this.element = null;
		},
		bind : function () {
			if($.support.touch) {
				this.element.addTouch();
			}
			this.element
				.on("dblclick.jstree", function () {
						if(document.selection && document.selection.empty) {
							document.selection.empty();
						}
						else {
							if(window.getSelection) {
								var sel = window.getSelection();
								try {
									sel.removeAllRanges();
									sel.collapse();
								} catch (er) { }
							}
						}
					})
				.on("click.jstree", ".jstree-ocl", $.proxy(function (e) {
						this.toggle_node(e.target);
					}, this))
				.on("click.jstree", "a", $.proxy(function (e) {
						e.preventDefault();
						this.activate_node(e.currentTarget, e);
					}, this))
				.on('keydown.jstree', 'a', $.proxy(function (e) {
						var o = null;
						switch(e.which) {
							case 13:
							case 32:
								e.type = "click";
								$(e.currentTarget).trigger(e);
								break;
							case 37:
								e.preventDefault();
								if(this.is_open(e.currentTarget)) {
									this.close_node(e.currentTarget);
								}
								else {
									o = this.get_prev(e.currentTarget);
									if(o && o.length) { o.children('a').focus(); }
								}
								break;
							case 38:
								e.preventDefault();
								o = this.get_prev(e.currentTarget);
								if(o && o.length) { o.children('a').focus(); }
								break;
							case 39:
								e.preventDefault();
								if(this.is_closed(e.currentTarget)) {
									this.open_node(e.currentTarget);
								}
								else {
									o = this.get_next(e.currentTarget);
									if(o && o.length) { o.children('a').focus(); }
								}
								break;
							case 40:
								e.preventDefault();
								o = this.get_next(e.currentTarget);
								if(o && o.length) { o.children('a').focus(); }
								break;
							default:
								//console.log(e.which);
								break;
						}
					}, this))
				.on("create_node.jstree", $.proxy(function (e, data) {
						this.clean_node(data.node);
					}, this))
				.on("load_node.jstree", $.proxy(function (e, data) {
						if(data.status) {
							if(data.node === -1) {
								// only detach for root (checkbox three-state will not work otherwise)
								// also - if you could use async clean_node won't be such an issue
								var ul = this.get_container_ul().detach();
								if(ul.children('li').length) {
									this.clean_node(ul.children('li'));
								}
								this.element.prepend(ul);
								if(this.settings.core.aria_roles) {
									this.element.find('ul').attr('role','group');
									this.element.find('li').attr('role','treeitem');
								}
							}
							else {
								if(data.node.find('> ul > li').length) {
									this.clean_node(data.node.find('> ul > li'));
								}
							}
							if(!this._data.core.ready && !this.get_container_ul().find('.jstree-loading:eq(0)').length) {
								this._data.core.ready = true;
								this.trigger("ready.jstree");
							}
						}
					}, this))
				.on("loaded.jstree", $.proxy(function (e, data) {
						data.instance.get_container_ul().children('li').each(function () {
							data.instance.correct_node(this);
						});
					}, this))
				.on("open_node.jstree", $.proxy(function (e, data) {
						data.node.find('> ul > li').each(function () {
							data.instance.correct_node(this);
						});
					}, this))
				// THEME RELATED
				.on("ready.jstree", $.proxy(function () {
						var s = this.settings.core.themes;
						this._data.core.themes.dots		= s.dots;
						this._data.core.themes.icons	= s.icons;

						if(s.name === false) {
							s.name = 'default';
						}
						this.set_theme(s.name, s.url);
					}, this))
				.on('construct.jstree ready.jstree loaded.jstree', $.proxy(function () {
						this[ this._data.core.themes.dots ? "show_dots" : "hide_dots" ]();
						this[ this._data.core.themes.icons ? "show_icons" : "hide_icons" ]();
					}, this))
				.on('changed.jstree', $.proxy(function (e, data) {
						this.element.find('.jstree-clicked').removeClass('jstree-clicked');
						data.selected.children('a').addClass('jstree-clicked');
					}, this))
				.on('focus.jstree', 'a', $.proxy(function (e) {
						$(e.currentTarget).mouseenter();
					}, this))
				.on('blur.jstree', 'a', $.proxy(function (e) {
						$(e.currentTarget).mouseleave();
					}, this))
				.on('mouseenter.jstree', 'a', $.proxy(function (e) {
						var o = this.element.find('a:focus').not('.jstree-clicked');
						if(o && o.length && o[0] !== e.currentTarget) {
							o.blur();
						}
						this.hover_node(e.currentTarget);
					}, this))
				.on('mouseleave.jstree', 'a', $.proxy(function (e) {
						this.dehover_node(e.currentTarget);
					}, this));
		},
		unbind : function () {
			this.element.off('.jstree');
			$(document).off('.jstree-' + this._id);
		},
		trigger : function (ev, data) {
			if(!data) {
				data = {};
			}
			data.instance = this;
			this.element.triggerHandler(ev.replace('.jstree','') + '.jstree', data);
		},
		get_container : function () {
			return this.element;
		},
		get_container_ul : function () {
			return this.element.children("ul:eq(0)");
		},
		get_string : function (key) {
			var a = this.settings.core.strings;
			if($.isFunction(a)) { return a.call(this, key); }
			if(a && a[key]) { return a[key]; }
			return key;
		},
		get_node : function (obj) {
			if(obj === -1) {
				return -1;
			}
			obj = $(obj, this.element);
			if(obj.hasClass(".jstree")) {
				return -1;
			}
			obj = obj.closest("li", this.element);
			return obj.length ? obj : false;
		},
		get_next : function (obj, strict) {
			obj = this.get_node(obj);
			if(obj === -1) {
				return this.get_container_ul().children("li:eq(0)");
			}
			if(!obj || !obj.length) {
				return false;
			}
			if(strict) {
				return (obj.nextAll("li").length > 0) ? obj.nextAll("li:eq(0)") : false;
			}
			if(obj.hasClass("jstree-open")) {
				return obj.find("li:eq(0)");
			}
			else if(obj.nextAll("li").length > 0) {
				return obj.nextAll("li:eq(0)");
			}
			else {
				return obj.parentsUntil(".jstree","li").next("li").eq(0);
			}
		},
		get_prev : function (obj, strict) {
			obj = this.get_node(obj);
			if(obj === -1) {
				return this.element.find("> ul > li:last-child");
			}
			if(!obj || !obj.length) {
				return false;
			}
			if(strict) {
				return (obj.prevAll("li").length > 0) ? obj.prevAll("li:eq(0)") : false;
			}
			if(obj.prev("li").length) {
				obj = obj.prev("li").eq(0);
				while(obj.hasClass("jstree-open")) {
					obj = obj.children("ul:eq(0)").children("li:last");
				}
				return obj;
			}
			else {
				var o = obj.parentsUntil(".jstree","li:eq(0)");
				return o.length ? o : false;
			}
		},
		get_parent : function (obj) {
			obj = this.get_node(obj);
			if(obj === -1 || !obj || !obj.length) {
				return false;
			}
			var o = obj.parentsUntil(".jstree", "li:eq(0)");
			return o.length ? o : -1;
		},
		get_children : function (obj) {
			obj = this.get_node(obj);
			if(obj === -1) {
				return this.get_container_ul().children("li");
			}
			if(!obj || !obj.length) {
				return false;
			}
			return obj.find("> ul > li");
		},
		is_parent : function (obj) {
			obj = this.get_node(obj);
			return obj && obj !== -1 && (obj.find("> ul > li:eq(0)").length || obj.hasClass("jstree-closed"));
		},
		is_loaded : function (obj) {
			obj = this.get_node(obj);
			return obj && ( (obj === -1 && !this.element.find("> ul > li.jstree-loading").length) || ( obj !== -1 && !obj.hasClass('jstree-loading') && (obj.find('> ul > li').length || obj.hasClass('jstree-leaf')) ) );
		},
		is_loading : function (obj) {
			obj = this.get_node(obj);
			return obj && ( (obj === -1 && this.element.find("> ul > li.jstree-loading").length) || (obj !== -1 && obj.hasClass("jstree-loading")) );
		},
		is_open : function (obj) {
			obj = this.get_node(obj);
			return obj && obj !== -1 && obj.hasClass("jstree-open");
		},
		is_closed : function (obj) {
			obj = this.get_node(obj);
			return obj && obj !== -1 && obj.hasClass("jstree-closed");
		},
		is_leaf : function (obj) {
			obj = this.get_node(obj);
			return obj && obj !== -1 && obj.hasClass("jstree-leaf");
		},
		load_node : function (obj, callback) {
			obj = this.get_node(obj);
			if(!obj) {
				callback.call(this, obj, false);
				return false;
			}
			// if(this.is_loading(obj)) { return true; }
			if(obj !== -1) {
				obj.addClass("jstree-loading");
			}
			this._load_node(obj, $.proxy(function (status) {
				if(obj !== -1) {
					obj.removeClass("jstree-loading");
				}
				this.trigger('load_node', { "node" : obj, "status" : status });
				if(callback) {
					callback.call(this, obj, status);
				}
			}, this));
			return true;
		},
		_load_node : function (obj, callback) {
			if(obj === -1) {
				this.get_container_ul().empty().append(this._data.core.original_container_html.clone(true));
			}
			callback.call(null, true);
		},
		open_node : function (obj, callback, animation) {
			obj = this.get_node(obj);
			if(obj === -1 || !obj || !obj.length) {
				return false;
			}
			animation = (typeof animation).toLowerCase() === "undefined" ? this.settings.core.animation : animation;
			if(!this.is_closed(obj)) {
				if(callback) {
					callback.call(this, obj, false);
				}
				return false;
			}
			if(!this.is_loaded(obj)) { // TODO: is_loading?
				this.load_node(obj, function (o, ok) {
					return ok ? this.open_node(o, callback, animation) : (callback ? callback.call(this, o, false) : false);
				});
			}
			else {
				var t = this;
				obj
					.children("ul").css("display","none").end()
					.removeClass("jstree-closed").addClass("jstree-open")
					.children("ul").stop(true, true)
						.slideDown(animation, function () {
							this.style.display = "";
							t.trigger("after_open", { "node" : obj });
						});
				if(callback) {
					callback.call(this, obj, true);
				}
				this.trigger('open_node', { "node" : obj });
			}
		},
		close_node : function (obj, animation) {
			obj = this.get_node(obj);
			if(!obj || !obj.length || !this.is_open(obj)) {
				return false;
			}
			animation = (typeof animation).toLowerCase() === "undefined" ? this.settings.core.animation : animation;
			var t = this;
			obj
				.children("ul").attr("style","display:block !important").end()
				.removeClass("jstree-open").addClass("jstree-closed")
				.children("ul").stop(true, true).slideUp(animation, function () {
					this.style.display = "";
					t.trigger("after_close", { "node" : obj });
				});
			this.trigger('close_node',{ "node" : obj });
		},
		toggle_node : function (obj) {
			if(this.is_closed(obj)) {
				return this.open_node(obj);
			}
			if(this.is_open(obj)) {
				return this.close_node(obj);
			}
		},
		open_all : function (obj, animation, original_obj) {
			obj = obj ? this.get_node(obj) : -1;
			obj = !obj || obj === -1 ? this.get_container_ul() : obj;
			original_obj = original_obj || obj;
			var _this = this;
			obj = this.is_closed(obj) ? obj.find('li.jstree-closed').addBack() : obj.find('li.jstree-closed');
			obj.each(function () {
				_this.open_node(
					this,
					_this.is_loaded(this) ?
						false :
						function(obj) { this.open_all(obj, animation, original_obj); },
					animation || 0
				);
			});
			if(original_obj.find('li.jstree-closed').length === 0) {
				this.trigger('open_all', { "node" : original_obj });
			}
		},
		close_all : function (obj, animation) {
			obj = obj ? this.get_node(obj) : -1;
			var $obj = !obj || obj === -1 ? this.get_container_ul() : obj,
				_this = this;
			$obj = this.is_open($obj) ? $obj.find('li.jstree-open').addBack() : $obj.find('li.jstree-open');
			$obj.each(function () { _this.close_node(this, animation || 0); });
			this.trigger('close_all', { "node" : obj });
		},
		activate_node : function (obj, e) {
			if(!this.settings.core.multiple || (!e.metaKey && !e.ctrlKey)) {
				this.deselect_all(true);
				this.select_node(obj);
			}
			else {
				if(!this.is_selected(obj)) {
					this.select_node(obj);
				}
				else {
					this.deselect_node(obj);
				}
			}
			this.trigger('activate_node', { 'node' : obj });
		},
		hover_node : function (obj) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			obj.children('a').addClass('jstree-hovered');
			this.trigger('hover_node', { 'node' : obj });
		},
		dehover_node : function (obj) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			obj.children('a').removeClass('jstree-hovered');
			this.trigger('dehover_node', { 'node' : obj });
		},
		select_node : function (obj, supress_event) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			this._data.core.selected = this._data.core.selected.add(obj);
			var t = this;
			obj.parents(".jstree-closed").each(function () { t.open_node(this, false, 0); });
			this.trigger('select_node', { 'node' : obj, 'selected' : this._data.core.selected });
			if(!supress_event) {
				this.trigger('changed', { 'action' : 'select_node', 'node' : obj, 'selected' : this._data.core.selected });
			}
		},
		deselect_node : function (obj, supress_event) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			this._data.core.selected = this._data.core.selected.not(obj);
			this.trigger('deselect_node', { 'node' : obj, 'selected' : this._data.core.selected });
			if(!supress_event) {
				this.trigger('changed', { 'action' : 'deselect_node', 'node' : obj, 'selected' : this._data.core.selected });
			}
		},
		deselect_all : function (supress_event) {
			this._data.core.selected = $();
			this.trigger('deselect_all', { 'selected' : this._data.core.selected });
			if(!supress_event) {
				this.trigger('changed', { 'action' : 'deselect_all', 'selected' : this._data.core.selected });
			}
		},
		is_selected : function (obj) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			return this._data.core.selected.index(obj) >= 0;
		},
		get_selected : function (obj) {
			return this._data.core.selected;
		},
		clean_node : function (obj) {
			// DETACH maybe inside the "load_node" function? But what about animations, etc?
			obj = this.get_node(obj);
			obj = !obj || obj === -1 ? this.element.find("li") : obj.find("li").addBack();
			var _this = this;
			return obj.each(function () {
				var t = $(this),
					d = t.data("jstree"),
					// is_ajax -> return this.settings.core.is_ajax || this._data.ajax;
					s = (d && d.opened) || t.hasClass("jstree-open") ? "open" : (d && d.closed) || t.children("ul").length || (d && d.children) ? "closed" : "leaf"; // replace with t.find('>ul>li').length || (this.is_ajax() && !t.children('ul').length)
				if(d && d.opened) { delete d.opened; }
				if(d && d.closed) { delete d.closed; }
				t.removeClass("jstree-open jstree-closed jstree-leaf jstree-last");
				if(!t.children("a").length) {
					// allow for text and HTML markup inside the nodes
					t.contents().filter(function() { return this.nodeType === 3 || this.tagName !== 'UL'; }).wrapAll('<a href="#"></a>');
					// TODO: make this faster
					t.children('a').html(t.children('a').html().replace(/[\s\t\n]+$/,''));
				}
				else {
					if(!$.trim(t.children('a').attr('href'))) { t.children('a').attr("href","#"); }
				}
				t.children('a').addClass('jstree-anchor');
				if(!t.children("i.jstree-ocl").length) {
					t.prepend("<i class='jstree-icon jstree-ocl'>&#160;</i>");
				}
				if(t.is(":last-child")) {
					t.addClass("jstree-last");
				}
				switch(s) {
					case 'leaf':
						t.addClass('jstree-leaf');
						break;
					case 'closed':
						t.addClass('jstree-open');
						_this.close_node(t, 0);
						break;
					case 'open':
						t.addClass('jstree-closed');
						_this.open_node(t, false, 0);
						break;
				}
				// theme part
				if(!t.find("> a > i.jstree-themeicon").length) {
					t.children("a").prepend("<i class='jstree-icon jstree-themeicon'>&#160;</i>");
				}
				if(d && typeof d.icon !== 'undefined') {
					_this.set_icon(t, d.icon);
					delete d.icon;
				}
				// selected part
				t.find('.jstree-clicked').removeClass('jstree-clicked');
				if(d && d.selected) {
					setTimeout(function () { _this.select_node(t); }, 0);
					delete d.selected;
				}
			});
		},
		correct_node : function (obj, deep) {
			obj = this.get_node(obj);
			if(!obj || (obj === -1 && !deep)) { return false; }
			if(obj === -1) { obj = this.element.find('li'); }
			else { obj = deep ? obj.find('li').addBack() : obj; }
			obj.each(function () {
				var obj = $(this);
				switch(!0) {
					case obj.hasClass("jstree-open") && !obj.find("> ul > li").length:
						obj.removeClass("jstree-open").addClass("jstree-leaf").children("ul").remove(); // children("ins").html("&#160;").end()
						break;
					case obj.hasClass("jstree-leaf") && !!obj.find("> ul > li").length:
						obj.removeClass("jstree-leaf").addClass("jstree-closed"); //.children("ins").html("+");
						break;
				}
				obj[obj.is(":last-child") ? 'addClass' : 'removeClass']("jstree-last");
			});
			return obj;
		},
		get_state : function () {
			var state	= {
				'core' : {
					'open' : [],
					'scroll' : {
						'left' : this.element.scrollLeft(),
						'top' : this.element.scrollTop()
					},
					'themes' : {
						'name' : this.get_theme(),
						'icons' : this._data.core.themes.icons,
						'dots' : this._data.core.themes.dots
					},
					'selected' : []
				}
			};
			this.get_container_ul().find('.jstree-open').each(function () { if(this.id) { state.core.open.push(this.id); } });
			this._data.core.selected.each(function () { if(this.id) { state.core.selected.push(this.id); } });
			return state;
		},
		set_state : function (state, callback) {
			if(state) {
				if(state.core) {
					if($.isArray(state.core.open)) {
						var res = true,
							t = this;
						//this.close_all();
						$.each(state.core.open.concat([]), function (i, v) {
							v = document.getElementById(v);
							if(v) {
								if(t.is_loaded(v)) {
									if(t.is_closed(v)) {
										t.open_node(v, false, 0);
									}
									$.vakata.array_remove(state.core.open, i);
								}
								else {
									if(!t.is_loading(v)) {
										t.open_node(v, $.proxy(function () { this.set_state(state); }, t), 0);
									}
									// there will be some async activity - so wait for it
									res = false;
								}
							}
						});
						if(res) {
							delete state.core.open;
							this.set_state(state, callback);
						}
						return false;
					}
					if(state.core.scroll) {
						if(state.core.scroll && typeof state.core.scroll.left !== 'undefined') {
							this.element.scrollLeft(state.core.scroll.left);
						}
						if(state.core.scroll && typeof state.core.scroll.top !== 'undefined') {
							this.element.scrollTop(state.core.scroll.top);
						}
						delete state.core.scroll;
						delete state.core.open;
						this.set_state(state, callback);
						return false;
					}
					if(state.core.themes) {
						if(state.core.themes.name) {
							this.set_theme(state.core.themes.name);
						}
						if(typeof state.core.themes.dots !== 'undefined') {
							this[ state.core.themes.dots ? "show_dots" : "hide_dots" ]();
						}
						if(typeof state.core.themes.icons !== 'undefined') {
							this[ state.core.themes.icons ? "show_icons" : "hide_icons" ]();
						}
						delete state.core.themes;
						delete state.core.open;
						this.set_state(state, callback);
						return false;
					}
					if(state.core.selected) {
						var _this = this;
						this.deselect_all();
						$.each(state.core.selected, function (i, v) {
							_this.select_node(document.getElementById(v));
						});
						delete state.core.selected;
						this.set_state(state, callback);
						return false;
					}
					if($.isEmptyObject(state)) {
						if(callback) { callback.call(this); }
						this.trigger('set_state');
						return false;
					}
					return true;
				}
				return true;
			}
			return false;
		},
		refresh : function () {
			this._data.core.state = this.get_state();
			this.load_node(-1, function (o, s) {
				if(s) {
					this.set_state($.extend(true, {}, this._data.core.state), function () {
						this.trigger('refresh');
					});
				}
				this._data.core.state = null;
			});
		},
		get_text : function (obj, remove_html) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj = obj.children("a:eq(0)").clone();
			obj.children(".jstree-icon").remove();
			obj = obj[ remove_html ? 'text' : 'html' ]();
			obj = $('<div />')[ remove_html ? 'text' : 'html' ](obj);
			return obj.html();
		},
		set_text : function (obj, val) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj = obj.children("a:eq(0)");
			var tmp = obj.children("I").clone();
			obj.html(val).prepend(tmp);
			this.trigger('set_text',{ "obj" : obj, "text" : val });
			return true;
		},
		parse_json : function (node) {
			var li, a, ul, t;
			if(node === null || ($.isArray(node) && node.length === 0)) {
				return false;
			}
			if($.isArray(node)) {
				ul	= $("<ul />");
				t	= this;
				$.each(node, function (i, v) {
					ul.append(t.parse_json(v));
				});
				return ul;
			}
			if(typeof node === "undefined") { node = {}; }
			if(typeof node === "string") { node = { "title" : node }; }
			if(!node.li_attr) { node.li_attr = {}; }
			if(!node.a_attr) { node.a_attr = {}; }
			if(!node.a_attr.href) { node.a_attr.href = '#'; }
			if(!node.title) { node.title = this.get_string("New node"); }

			li	= $("<li />").attr(node.li_attr);
			a	= $("<a />").attr(node.a_attr).html(node.title);
			ul	= $("<ul />");
			if(node.data && !$.isEmptyObject(node.data)) { li.data(node.data); }
			if(
				node.children === true ||
				$.isArray(node.children) ||
				(li.data('jstree') && $.isArray(li.data('jstree').children))
			) {
				if(!li.data('jstree')) {
					li.data('jstree', {});
				}
				li.data('jstree').closed = true;
			}
			li.append(a);
			if($.isArray(node.children)) {
				$.each(node.children, $.proxy(function (i, n) {
					ul.append(this.parse_json(n));
				}, this));
				li.append(ul);
			}
			return li;
		},
		get_json : function (obj, is_callback) {
			obj = typeof obj !== 'undefined' ? this.get_node(obj) : false;
			if(!is_callback) {
				if(!obj || obj === -1) { obj = this.get_container_ul().children("li"); }
			}
			var r, t, li_attr = {}, a_attr = {}, tmp = {}, i;
			if(!obj || !obj.length) { return false; }
			if(obj.length > 1 || !is_callback) {
				r = [];
				t = this;
				obj.each(function () {
					r.push(t.get_json($(this), true));
				});
				return r;
			}
			tmp = $.vakata.attributes(obj, true);
			$.each(tmp, function (i, v) {
				if(i === 'id') { li_attr[i] = v; return true; }
				v = $.trim(v.replace(/\bjstree[^ ]*/ig,'').replace(/\s+$/ig," "));
				if(v.length) { li_attr[i] = v; }
			});
			tmp = $.vakata.attributes(obj.children('a'), true);
			$.each(tmp, function (i, v) {
				if(i === 'id') { a_attr[i] = v; return true; }
				v = $.trim(v.replace(/\bjstree[^ ]*/ig,'').replace(/\s+$/ig," "));
				if(v.length) { a_attr[i] = v; }
			});
			r = {
				'title'		: this.get_text(obj),
				'data'		: $.extend(true, {}, obj.data() || {}),
				'children'	: false,
				'li_attr'	: li_attr,
				'a_attr'	: a_attr
			};

			if(!r.data.jstree) { r.data.jstree = {}; }
			if(this.is_open(obj)) { r.data.jstree.opened = true; }
			if(this.is_closed(obj)) { r.data.jstree.closed = true; }
			i = this.get_icon(obj);
			if(typeof i !== 'undefined' && i !== null) { r.data.jstree.icon = i; }
			if(this.is_selected(obj)) { r.data.jstree.selected = true; }

			obj = obj.find('> ul > li');
			if(obj.length) {
				r.children = [];
				t = this;
				obj.each(function () {
					r.children.push(t.get_json($(this), true));
				});
			}
			return r;
		},
		create_node : function (par, node, pos, callback, is_loaded) {
			par = this.get_node(par);
			pos = typeof pos === "undefined" ? "last" : pos;

			if(par !== -1 && !par.length) { return false; }
			if(!pos.match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.create_node(par, node, pos, callback, true); });
			}

			var li = this.parse_json(node),
				tmp = par === -1 ? this.element : par;

			if(par === -1) {
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					pos = par.index();
					par = this.get_parent(par);
					break;
				case "after" :
					pos = par.index() + 1;
					par = this.get_parent(par);
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = tmp.children('ul').children('li').length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}
			if(!this.check("create_node", li, par, pos)) { return false; }

			tmp = par === -1 ? this.element : par;
			if(!tmp.children("ul").length) { tmp.append("<ul />"); }
			if(tmp.children("ul").children("li").eq(pos).length) {
				tmp.children("ul").children("li").eq(pos).before(li);
			}
			else {
				tmp.children("ul").append(li);
			}
			this.correct_node(par, true);
			if(callback) { callback.call(this, li); }
			this.trigger('create_node', { "node" : li, "parent" : par, "position" : li.index() });
			return li;
		},
		rename_node : function (obj, val) {
			obj = this.get_node(obj);
			var old = this.get_text(obj);
			if(!this.check("rename_node", obj, this.get_parent(obj), val)) { return false; }
			if(obj && obj.length) {
				this.set_text(obj, val); // .apply(this, Array.prototype.slice.call(arguments))
				this.trigger('rename_node', { "node" : obj, "title" : val, "old" : old });
			}
		},
		delete_node : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			var par = this.get_parent(obj),
				pre = this.get_prev(obj);
			if(!this.check("delete_node", obj, par, obj.index())) { return false; }
			obj = obj.detach();
			this.correct_node(par);
			this.correct_node(pre);
			this.trigger('delete_node', { "node" : obj, "prev" : pre, "parent" : par });

			var n = obj.find(".jstree-clicked"),
				t = this;
			if(n.length) {
				n.each(function () { t.deselect_node(this, true); });
				this.trigger('changed', { 'action' : 'delete_node', 'node' : obj, 'selected' : this._data.core.selected, 'parent' : par });
			}
			return obj;
		},
		check : function (chk, obj, par, pos) {
			var tmp = chk.match(/^move_node|copy_node|create_node$/i) ? par : obj,
				chc = this.settings.core.check_callback;
			if(chc === false || ($.isFunction(chc) && chc.call(this, chk, obj, par, pos) === false)) {
				return false;
			}
			tmp = tmp === -1 ? this.element.data('jstree') : tmp.data('jstree');
			if(tmp && tmp.functions && tmp.functions[chk]) {
				tmp = tmp.functions[chk];
				if($.isFunction(tmp)) {
					tmp = tmp.call(this, chk, obj, par, pos);
				}
				if(tmp === false) {
					return false;
				}
			}
			switch(chk) {
				case "create_node":
					break;
				case "rename_node":
					break;
				case "move_node":
					tmp = par === -1 ? this.element : par;
					tmp = tmp.children('ul').children('li');
					if(tmp.length && tmp.index(obj) !== -1 && (pos === obj.index() || pos === obj.index() + 1)) {
						return false;
					}
					if(par !== -1 && par.parentsUntil('.jstree', 'li').addBack().index(obj) !== -1) {
						return false;
					}
					break;
				case "copy_node":
					break;
				case "delete_node":
					break;
			}
			return true;
		},
		move_node : function (obj, par, pos, callback, is_loaded) {
			obj = this.get_node(obj);
			par = this.get_node(par);
			pos = typeof pos === "undefined" ? 0 : pos;

			if(!obj || obj === -1 || !obj.length) { return false; }
			if(par !== -1 && !par.length) { return false; }
			if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.move_node(obj, par, pos, callback, true); });
			}

			var old_par = this.get_parent(obj),
				new_par = (!pos.toString().match(/^(before|after)$/) || par === -1) ? par : this.get_parent(par),
				old_ins = $.jstree.reference(obj),
				new_ins = par === -1 ? this : $.jstree.reference(par),
				is_multi = (old_ins._id !== new_ins._id);
			if(new_par === -1) {
				par = new_ins.get_container();
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					pos = par.index();
					break;
				case "after" :
					pos = par.index() + 1;
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = par.children('ul').children('li').length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}
			if(!this.check("move_node", obj, new_par, pos)) { return false; }

			if(!par.children("ul").length) { par.append("<ul />"); }
			if(par.children("ul").children("li").eq(pos).length) {
				par.children("ul").children("li").eq(pos).before(obj);
			}
			else {
				par.children("ul").append(obj);
			}

			if(is_multi) { // if multitree - clean the node recursively - remove all icons, and call deep clean_node
				obj.find('.jstree-icon, .jstree-ocl').remove();
				this.clean_node(obj);
			}
			old_ins.correct_node(old_par, true);
			new_ins.correct_node(new_par, true);
			if(callback) { callback.call(this, obj, new_par, obj.index()); }
			this.trigger('move_node', { "node" : obj, "parent" : new_par, "position" : obj.index(), "old_parent" : old_par, "is_multi" : is_multi, 'old_instance' : old_ins, 'new_instance' : new_ins });
			return true;
		},
		copy_node : function (obj, par, pos, callback, is_loaded) {
			obj = this.get_node(obj);
			par = this.get_node(par);
			pos = typeof pos === "undefined" ? "last" : pos;

			if(!obj || obj === -1 || !obj.length) { return false; }
			if(par !== -1 && !par.length) { return false; }
			if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.copy_node(obj, par, pos, callback, true); });
			}
			var org_obj = obj,
				old_par = this.get_parent(obj),
				new_par = (!pos.toString().match(/^(before|after)$/) || par === -1) ? par : this.get_parent(par),
				old_ins = $.jstree.reference(obj),
				new_ins = par === -1 ? this : $.jstree.reference(par),
				is_multi = (old_ins._id !== new_ins._id);

			obj = obj.clone(true);
			obj.find("*[id]").addBack().each(function () {
				if(this.id) { this.id = "copy_" + this.id; }
			});
			if(new_par === -1) {
				par = new_ins.get_container();
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					pos = par.index();
					break;
				case "after" :
					pos = par.index() + 1;
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = par.children('ul').children('li').length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}

			if(!this.check("copy_node", org_obj, new_par, pos)) { return false; }

			if(!par.children("ul").length) { par.append("<ul />"); }
			if(par.children("ul").children("li").eq(pos).length) {
				par.children("ul").children("li").eq(pos).before(obj);
			}
			else {
				par.children("ul").append(obj);
			}
			if(is_multi) { // if multitree - clean the node recursively - remove all icons, and call deep clean_node
				obj.find('.jstree-icon, .jstree-ocl').remove();
			}
			new_ins.clean_node(obj); // always clean so that selected states, etc. are removed
			new_ins.correct_node(new_par, true); // no need to correct the old parent, as nothing has changed there
			if(callback) { callback.call(this, obj, new_par, obj.index(), org_obj); }
			this.trigger('copy_node', { "node" : obj, "parent" : new_par, "old_parent" : old_par, "position" : obj.index(), "original" : org_obj, "is_multi" : is_multi, 'old_instance' : old_ins, 'new_instance' : new_ins });
			return true;
		},
		cut : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			ccp_node = obj;
			ccp_mode = 'move_node';
			this.trigger('cut', { "node" : obj });
		},
		copy : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			ccp_node = obj;
			ccp_mode = 'copy_node';
			this.trigger('copy', { "node" : obj });
		},
		get_buffer : function () {
			return { 'mode' : ccp_mode, 'node' : ccp_node };
		},
		can_paste : function () {
			return ccp_mode !== false && ccp_node !== false;
		},
		paste : function (obj) {
			obj = this.get_node(obj);
			if(!obj || !ccp_mode || !ccp_mode.match(/^(copy_node|move_node)$/) || !ccp_node) { return false; }
			this[ccp_mode](ccp_node, obj);
			this.trigger('paste', { "obj" : obj, "nodes" : ccp_node, "mode" : ccp_mode });
			ccp_node = false;
			ccp_mode = false;
		},
		edit : function (obj, default_text) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj.parentsUntil(".jstree",".jstree-closed").each($.proxy(function (i, v) {
				this.open_node(v, false, 0);
			}, this));
			var rtl = this._data.core.rtl,
				w  = this.element.width(),
				a  = obj.children('a:eq(0)'),
				oi = obj.children("i"),
				ai = a.children("i"),
				w1 = oi.width() * oi.length,
				w2 = ai.width() * ai.length,
				t  = typeof default_text === 'string' ? default_text : this.get_text(obj),
				h1 = $("<div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo("body"),
				h2 = obj.css("position","relative").append(
					$("<input />", {
						"value" : t,
						"class" : "jstree-rename-input",
						// "size" : t.length,
						"css" : {
							"padding" : "0",
							"border" : "1px solid silver",
							"position" : "absolute",
							"left"  : (rtl ? "auto" : (w1 + w2 + 4) + "px"),
							"right" : (rtl ? (w1 + w2 + 4) + "px" : "auto"),
							"top" : "0px",
							"height" : (this._data.core.li_height - 2) + "px",
							"lineHeight" : (this._data.core.li_height - 2) + "px",
							"width" : "150px" // will be set a bit further down
						},
						"blur" : $.proxy(function () {
							var i = obj.children(".jstree-rename-input"),
								v = i.val();
							if(v === "") { v = t; }
							h1.remove();
							i.remove();
							if(this.rename_node(obj, v) === false) {
								this.rename_node(obj, t);
							}
							obj.css("position", "");
						}, this),
						"keydown" : function (event) {
							var key = event.keyCode || event.which;
							if(key === 27) {
								this.value = t;
							}
							if(key === 27 || key === 13 || key === 37 || key === 38 || key === 39 || key === 40) {
								event.stopImmediatePropagation();
							}
							if(key === 27 || key === 13) {
								event.preventDefault();
								this.blur();
							}
						},
						"keyup" : function (event) {
							var key = event.keyCode || event.which;
							h2.width(Math.min(h1.text("pW" + this.value).width(),w));
						},
						"keypress" : function(event) {
							var key = event.keyCode || event.which;
							if(key === 13) { return false; }
						}
					})
				).children(".jstree-rename-input"),
				fn = {
						fontFamily		: a.css('fontFamily')		|| '',
						fontSize		: a.css('fontSize')			|| '',
						fontWeight		: a.css('fontWeight')		|| '',
						fontStyle		: a.css('fontStyle')		|| '',
						fontStretch		: a.css('fontStretch')		|| '',
						fontVariant		: a.css('fontVariant')		|| '',
						letterSpacing	: a.css('letterSpacing')	|| '',
						wordSpacing		: a.css('wordSpacing')		|| ''
				};
			this.set_text(obj, "");
			h1.css(fn);
			h2.css(fn).width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
		},

		// theme related functions
		set_theme : function (theme_name, theme_url) {
			if(!theme_name) { return false; }
			if(theme_url === true) {
				var dir = this.settings.core.themes.dir;
				if(!dir) { dir = $.jstree.path + '/themes'; }
				theme_url = dir + '/' + theme_name + '/style.css';
			}
			if(theme_url && $.inArray(theme_url, themes_loaded) === -1) {
				$('head').append('<link rel="stylesheet" href="' + theme_url + '" type="text/css" />');
				themes_loaded.push(theme_url);
			}
			if(this._data.core.themes.name) {
				this.element.removeClass('jstree-' + this._data.core.themes.name);
			}
			this._data.core.themes.name = theme_name;
			this.element.addClass('jstree-' + theme_name);
			this.trigger('set_theme', { 'theme' : theme_name });
		},
		get_theme : function () { return this._data.core.themes.name; },
		show_dots : function () { this._data.core.themes.dots = true; this.get_container().children("ul").removeClass("jstree-no-dots"); },
		hide_dots : function () { this._data.core.themes.dots = false; this.get_container().children("ul").addClass("jstree-no-dots"); },
		toggle_dots : function () { if(this._data.core.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },
		show_icons : function () { this._data.core.themes.icons = true; this.get_container().children("ul").removeClass("jstree-no-icons"); },
		hide_icons : function () { this._data.core.themes.icons = false; this.get_container().children("ul").addClass("jstree-no-icons"); },
		toggle_icons : function () { if(this._data.core.themes.icons) { this.hide_icons(); } else { this.show_icons(); } },
		set_icon : function (obj, icon) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj = obj.find("> a > .jstree-themeicon");
			if(icon === false) {
				this.hide_icon(obj);
			}
			else if(icon.indexOf("/") === -1) {
				obj.addClass(icon).attr("rel",icon);
			}
			else {
				obj.css("background", "url('" + icon + "') center center no-repeat").attr("rel",icon);
			}
			return true;
		},
		get_icon : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return null; }
			obj = obj.find("> a > .jstree-themeicon");
			if(obj.hasClass('jstree-themeicon-hidden')) { return false; }
			obj = obj.attr("rel");
			return (obj && obj.length) ? obj : null;
		},
		hide_icon : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj.find('> a > .jstree-themeicon').addClass('jstree-themeicon-hidden');
			return true;
		},
		show_icon : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj === -1 || !obj.length) { return false; }
			obj.find('> a > .jstree-themeicon').removeClass('jstree-themeicon-hidden');
			return true;
		}
	};

	var src = $('script:last').attr('src');
	$.jstree.path = src ? src.replace(/\/[^\/]+$/,'') : '';
	$.jstree.no_css = src && src.indexOf('?no_css') !== -1;

	if($.jstree.no_css) {
		$.jstree.defaults.core.themes.url = false;
	}

	/* base CSS */
	$(function() {
		var css_string = '' +
				//'.jstree * { -webkit-box-sizing:content-box; -moz-box-sizing:content-box; box-sizing:content-box; }' +
				'.jstree ul, .jstree li { display:block; margin:0 0 0 0; padding:0 0 0 0; list-style-type:none; list-style-image:none; } ' +
				'.jstree li { display:block; min-height:18px; line-height:18px; white-space:nowrap; margin-left:18px; min-width:18px; } ' +
				'.jstree-rtl li { margin-left:0; margin-right:18px; } ' +
				'.jstree > ul > li { margin-left:0px; } ' +
				'.jstree-rtl > ul > li { margin-right:0px; } ' +
				'.jstree .jstree-icon { display:inline-block; text-decoration:none; margin:0; padding:0; vertical-align:top; } ' +
				'.jstree .jstree-ocl { width:18px; height:18px; text-align:center; line-height:18px; cursor:pointer; vertical-align:top; } ' +
				'.jstree li.jstree-open > ul { display:block; } ' +
				'.jstree li.jstree-closed > ul { display:none; } ' +
				'.jstree-anchor { display:inline-block; line-height:16px; height:16px; color:black; white-space:nowrap; padding:1px 2px; margin:0; text-decoration:none; outline:0; } ' +
				'.jstree-anchor > .jstree-themeicon { height:16px; width:16px; margin-right:3px; } ' +
				'.jstree-rtl .jstree-anchor > .jstree-themeicon { margin-left:3px; margin-right:0; } ' +
				'.jstree-no-icons .jstree-themeicon, .jstree-anchor > .jstree-themeicon-hidden { display:none; } ';
		if(!$.jstree.no_css) {
			$('head').append('<style type="text/css">' + css_string + '</style>');
		}
	});

	// helpers
	$.vakata = {};
	// collect attributes
	$.vakata.attributes = function(node, with_values) {
		node = $(node)[0];
		var attr = with_values ? {} : [];
		$.each(node.attributes, function (i, v) {
			if($.inArray(v.nodeName.toLowerCase(),['style','contenteditable','hasfocus','tabindex']) !== -1) { return; }
			if(v.nodeValue !== null && $.trim(v.nodeValue) !== '') {
				if(with_values) { attr[v.nodeName] = v.nodeValue; }
				else { attr.push(v.nodeName); }
			}
		});
		return attr;
	};
	// remove item from array
	$.vakata.array_remove = function(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		array.push.apply(array, rest);
		return array;
	};
	// private function for json quoting strings
	var _quote = function (str) {
		var escapeable	= /["\\\x00-\x1f\x7f-\x9f]/g,
			meta		= { '\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"' :'\\"','\\':'\\\\' };
		if(str.match(escapeable)) {
			return '"' + str.replace(escapeable, function (a) {
					var c = meta[a];
					if(typeof c === 'string') { return c; }
					c = a.charCodeAt();
					return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"';
		}
		return '"' + str + '"';
	};
	$.vakata.json = {
		encode : function (o) {
			if (o === null) { return "null"; }

			var tmp = [], i;
			switch(typeof(o)) {
				case "undefined":
					return undefined;
				case "number":
				case "boolean":
					return o + "";
				case "string":
					return _quote(o);
				case "object":
					if($.isFunction(o.toJSON)) {
						return $.vakata.json.encode(o.toJSON());
					}
					if(o.constructor === Date) {
						return '"' +
							o.getUTCFullYear() + '-' +
							String("0" + (o.getUTCMonth() + 1)).slice(-2) + '-' +
							String("0" + o.getUTCDate()).slice(-2) + 'T' +
							String("0" + o.getUTCHours()).slice(-2) + ':' +
							String("0" + o.getUTCMinutes()).slice(-2) + ':' +
							String("0" + o.getUTCSeconds()).slice(-2) + '.' +
							String("00" + o.getUTCMilliseconds()).slice(-3) + 'Z"';
					}
					if(o.constructor === Array) {
						for(i = 0; i < o.length; i++) {
							tmp.push( $.vakata.json.encode(o[i]) || "null" );
						}
						return "[" + tmp.join(",") + "]";
					}

					$.each(o, function (i, v) {
						if($.isFunction(v)) { return true; }
						i = typeof i === "number" ? '"' + i + '"' : _quote(i);
						v = $.vakata.json.encode(v);
						tmp.push(i + ":" + v);
					});
					return "{" + tmp.join(", ") + "}";
			}
		},
		decode : function (json) {
			return $.parseJSON(json);
		}
	};

})(jQuery);


/*
 * jstree sample plugin

// wrap in IIFE and pass jQuery as $
(function ($) {
	// some private plugin stuff if needed
	var private_var = null;

	// extending the defaults
	$.jstree.defaults.sample = {
		sample_option : 'sample_val'
	};

	// the actual plugin code
	$.jstree.plugins.sample = function (options, parent) {
		// own function
		this.sample_function = function (arg) {
			// you can chain this method if needed and available
			if(parent.sample_function) { parent.sample_function.call(this, arg); }
		};

		// *SPECIAL* FUNCTIONS
		this.init = function () {
			// do not forget parent
			parent.init.call(this);
		};
		// bind events if needed
		this.bind = function () {
			// call parent function first
			parent.bind.call(this);
			// do(stuff);
		};
		// unbind events if needed (all in jquery namespace are taken care of by the core)
		this.unbind = function () {
			// do(stuff);
			// call parent function last
			parent.unbind.call(this);
		};
		this.teardown = function () {
			// do not forget parent
			parent.teardown.call(this);
		};
		// very heavy - use only if needed and be careful
		this.clean_node = function(obj) {
			// always get the cleaned node from the parent
			obj = parent.clean_node.call(this, obj);
			return obj.each(function () {
				// process nodes
			});
		};
		// state management - get and restore
		this.get_state = function () {
			// always get state from parent first
			var state = parent.get_state.call(this);
			// add own stuff to state
			state.sample = { 'var' : 'val' };
			return state;
		};
		this.set_state = function (state, callback) {
			// only process your part if parent returns true
			// there will be multiple times with false
			if(parent.set_state.call(state, callback)) {
				// check the key you set above
				if(state.sample) {
					// do(stuff); // like calling this.sample_function(state.sample.var);
					// remove your part of the state and RETURN FALSE, the next cycle will be TRUE
					delete state.sample;
					return false;
				}
				// return true if your state is gone (cleared in the previous step)
				return true;
			}
			// parent was false - return false too
			return false;
		};
		// node transportation
		this.get_json = function (obj, is_callback) {
			// get the node from the parent
			var r = parent.get_json.call(this, obj, is_callback);
			// only modify the node if is_callback is true
			if(is_callback) {
				r.data.sample = 'value';
			}
			// return the original / modified node
			return r;
		};
	};

	// attach to document ready if needed
	$(function () {
		// do(stuff);
	});

	// you can include the sample plugin in all instances by default
	$.jstree.defaults.plugins.push("sample");
})(jQuery);
//*/

/* File: jstree.checkbox.js
Adds checkboxes to the tree.
*/
(function ($) {
	$.jstree.defaults.checkbox = {
		three_state : true,
		whole_node : false,
		keep_selected_style : true
	};

	$.jstree.plugins.checkbox = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			if(!this.settings.checkbox.keep_selected_style) {
				this.element.addClass('jstree-checkbox-no-clicked');
			}

			if(this.settings.checkbox.three_state) {
				this.element
					.on('changed.jstree', $.proxy(function (e, data) {
							var action = data.action || '',
								node = false,
								change = false;
							switch(action) {
								case 'select_node':
									node = data.node.parent();
									data.node.find('.jstree-anchor:not(.jstree-clicked)').each($.proxy(function (i,v) {
										change = true;
										this.select_node(v, true);
									}, this)).end().find('.jstree-undetermined').removeClass('jstree-undetermined');
									break;
								case 'deselect_node':
									node = data.node.parent();
									data.node.find('.jstree-clicked').each($.proxy(function (i,v) {
										change = true;
										this.deselect_node(v, true);
									}, this)).end().find('.jstree-undetermined').removeClass('jstree-undetermined');
									break;
								case 'deselect_all':
									this.element.find('.jstree-undetermined').removeClass('jstree-undetermined');
									break;
								case 'delete_node':
									node = data.parent;
									break;
								default:
									break;
							}
							if(node && this.check_up(node)) {
								change = true;
							}
							if(change) {
								this.trigger('changed', { 'action' : 'checkbox_three_state', 'selected' : this._data.core.selected });
							}
						}, this))
					.on('move_node.jstree copy_node.jstree', $.proxy(function (e, data) {
							if(data.old_instance && data.old_instance.check_up && data.old_instance.check_up(data.old_parent)) {
								data.old_instance.trigger('changed', { 'action' : 'checkbox_three_state', 'selected' : data.old_instance._data.core.selected });
							}
							if(data.new_instance && data.new_instance.check_up && data.new_instance.check_up(data.parent)) {
								data.new_instance.trigger('changed', { 'action' : 'checkbox_three_state', 'selected' : data.new_instance._data.core.selected });
							}
						}, this));
			}
		};
		this.clean_node = function(obj) {
			obj = parent.clean_node.call(this, obj);
			var t = this;
			obj = obj.each(function () {
				var o = $(this).children('a');
				if(!o.children(".jstree-checkbox").length) {
					o.prepend("<i class='jstree-icon jstree-checkbox'></i>");
				}
			});
			return obj;
		};
		this.activate_node = function (obj, e) {
			if(this.settings.checkbox.whole_node || $(e.target).hasClass('jstree-checkbox')) {
				e.ctrlKey = true;
			}
			parent.activate_node.call(this, obj, e);
		};
		this.check_up = function (obj) {
			if(!this.settings.checkbox.three_state) { return false; }
			obj = this.get_node(obj);
			if(obj === -1 || !obj || !obj.length) { return false; }

			var state = 0,
				has_children = obj.find('> ul > li').length > 0,
				all_checked = has_children && obj.find('> ul > li').not(this._data.core.selected).length === 0,
				none_checked = has_children && obj.find('.jstree-clicked').length === 0;

			if(!state && this.is_selected(obj)) { state = 1; }
			if(!state && obj.find('> a > .jstree-undetermined').length) { state = 2; }

			// if no children
			if(!has_children) {
				if(state === 2) {
					obj.find('.jstree-undetermined').removeClass('jstree-undetermined');
				}
				return false;
			}
			// if all checked children
			if(all_checked) {
				if(state !== 1) {
					obj.find('.jstree-undetermined').removeClass('jstree-undetermined');
					this.select_node(obj, true);
					this.check_up(obj.parent());
				}
				return true;
			}
			// if none children checked
			if(none_checked) {
				if(state === 2) {
					obj.find('.jstree-undetermined').removeClass('jstree-undetermined');
					this.check_up(obj.parent());
					return false;
				}
				if(state === 1) {
					this.deselect_node(obj, true);
					this.check_up(obj.parent());
					return true;
				}
				return false;
			}
			// some children are checked and state is checked
			if(state === 1) {
				obj.find('> a > .jstree-checkbox').addClass('jstree-undetermined');
				this.deselect_node(obj, true);
				this.check_up(obj.parent());
				return true;
			}
			// some children are checked and state is unchecked
			if(state === 0) {
				obj.find('> a > .jstree-checkbox').addClass('jstree-undetermined');
			}
			return false;
		};
	};

	$(function () {
		// add checkbox specific CSS
		var css_string = '' +
				'.jstree-anchor > .jstree-checkbox { height:16px; width:16px; margin-right:1px; } ' +
				'.jstree-rtl .jstree-anchor > .jstree-checkbox { margin-right:0; margin-left:1px; } ';
		// the default stylesheet
		if(!$.jstree.no_css) {
			$('head').append('<style type="text/css">' + css_string + '</style>');
		}

	});

	// include the checkbox plugin by default
	$.jstree.defaults.plugins.push("checkbox");
})(jQuery);

/* File: jstree.contextmenu.js
Enables a rightclick contextmenu.
*/
/* Group: jstree sort plugin */
(function ($) {
	$.jstree.defaults.contextmenu = {
		select_node : true,
		show_at_node : true,
		items : function (o) { // Could be an object directly
			// TODO: in "_disabled" call this._check()
			return {
				"create" : {
					"separator_before"	: false,
					"separator_after"	: true,
					"label"				: "Create",
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						inst.create_node(obj, {}, "last", function (new_node) {
							setTimeout(function () { inst.edit(new_node); },0);
						});
					}
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"label"				: "Rename",
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						inst.edit(obj);
					}
				},
				"remove" : {
					"separator_before"	: false,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Delete",
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						inst.delete_node(obj);
					}
				},
				"ccp" : {
					"separator_before"	: true,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Edit",
					"action"			: false,
					"submenu" : {
						"cut" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "Cut",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.cut(obj);
							}
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Copy",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.copy(obj);
							}
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"_disabled"			: !(this.can_paste()),
							"separator_after"	: false,
							"label"				: "Paste",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.paste(obj);
							}
						}
					}
				}
			};
		}
	};

	$.jstree.plugins.contextmenu = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on("contextmenu.jstree", "a", $.proxy(function (e) {
						e.preventDefault();
						if(!this.is_loading(e.currentTarget)) {
							this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
						}
					}, this))
				.on("click.jstree", "a", $.proxy(function (e) {
						if(this._data.contextmenu.visible) {
							$.vakata.contextmenu.hide();
						}
					}, this));
			$(document).on("context_hide.vakata", $.proxy(function () { this._data.contextmenu.visible = false; }, this));
		};
		this.teardown = function () {
			if(this._data.contextmenu.visible) {
				$.vakata.contextmenu.hide();
			}
			parent.teardown.call(this);
		};

		this.show_contextmenu = function (obj, x, y) {
			obj = this.get_node(obj);
			var s = this.settings.contextmenu,
				a = obj.children("a:visible:eq(0)"),
				o = false,
				i = false;
			if(s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
				o = a.offset();
				x = o.left;
				y = o.top + this._data.core.li_height;
			}
			if(!this.is_selected(obj)) {
				this.deselect_all();
				this.select_node(obj);
			}

			i = obj.data("jstree") && obj.data("jstree").contextmenu ? obj.data("jstree").contextmenu : s.items;
			if($.isFunction(i)) { i = i.call(this, obj); }

			$(document).one("context_show.vakata", $.proxy(function (e, data) {
				var cls = 'jstree-contextmenu jstree-' + this.get_theme() + '-contextmenu';
				$(data.element).addClass(cls);
			}, this));
			this._data.contextmenu.visible = true;
			$.vakata.context.show(a, { 'x' : x, 'y' : y }, i);
			this.trigger('show_contextmenu', { "node" : obj, "x" : x, "y" : y });
		};
	};

	// contextmenu helper
	(function ($) {
		var right_to_left = false,
			vakata_context = {
				element		: false,
				reference	: false,
				position_x	: 0,
				position_y	: 0,
				items		: [],
				html		: "",
				is_visible	: false
			};

		$.vakata.context = {
			settings : {
				hide_onmouseleave	: 0,
				icons				: true
			},
			_trigger : function (event_name) {
				$(document).triggerHandler("context_" + event_name + ".vakata", {
					"reference"	: vakata_context.reference,
					"element"	: vakata_context.element,
					"position"	: {
						"x" : vakata_context.position_x,
						"y" : vakata_context.position_y
					}
				});
			},
			_execute : function (i) {
				i = vakata_context.items[i];
				return i && !i._disabled && i.action ? i.action.call(null, {
							"item"		: i,
							"reference"	: vakata_context.reference,
							"element"	: vakata_context.element,
							"position"	: {
								"x" : vakata_context.position_x,
								"y" : vakata_context.position_y
							}
						}) : false;
			},
			_parse : function (o, is_callback) {
				if(!o) { return false; }
				if(!is_callback) {
					vakata_context.html		= "";
					vakata_context.items	= [];
				}
				var str = "",
					sep = false,
					tmp;

				if(is_callback) { str += "<ul>"; }
				$.each(o, function (i, val) {
					if(!val) { return true; }
					vakata_context.items.push(val);
					if(!sep && val.separator_before) {
						str += "<li class='vakata-context-separator'><a href='#' " + ($.vakata.context.settings.icons ? '' : 'style="margin-left:0px;"') + ">&#160;</a></li>";
					}
					sep = false;
					str += "<li class='" + (val._class || "") + (val._disabled ? " vakata-contextmenu-disabled " : "") + "'>";
					str += "<a href='#' rel='" + (vakata_context.items.length - 1) + "'>";
					if($.vakata.context.settings.icons) {
						str += "<ins ";
						if(val.icon) {
							if(val.icon.indexOf("/") !== -1)	{ str += " style='background:url(\"" + val.icon + "\") center center no-repeat' "; }
							else								{ str += " class='" + val.icon + "' "; }
						}
						str += ">&#160;</ins><span>&#160;</span>";
					}
					str += val.label + "</a>";
					if(val.submenu) {
						tmp = $.vakata.context._parse(val.submenu, true);
						if(tmp) { str += tmp; }
					}
					str += "</li>";
					if(val.separator_after) {
						str += "<li class='vakata-context-separator'><a href='#' " + ($.vakata.context.settings.icons ? '' : 'style="margin-left:0px;"') + ">&#160;</a></li>";
						sep = true;
					}
				});
				str  = str.replace(/<li class\='vakata-context-separator'\><\/li\>$/,"");
				if(is_callback) { str += "</ul>"; }
				if(!is_callback) { vakata_context.html = str; $.vakata.context._trigger("parse"); }
				return str.length > 10 ? str : false;
			},
			_show_submenu : function (o) {
				o = $(o);
				if(!o.length || !o.children("ul").length) { return; }
				var e = o.children("ul"),
					x = o.offset().left + o.outerWidth(),
					y = o.offset().top,
					w = e.width(),
					h = e.height(),
					dw = $(window).width() + $(window).scrollLeft(),
					dh = $(window).height() + $(window).scrollTop();
				// може да се спести е една проверка - дали няма някой от класовете вече нагоре
				if(right_to_left) {
					o[x - (w + 10 + o.outerWidth()) < 0 ? "addClass" : "removeClass"]("vakata-context-left");
				}
				else {
					o[x + w + 10 > dw ? "addClass" : "removeClass"]("vakata-context-right");
				}
				if(y + h + 10 > dh) {
					e.css("bottom","-1px");
				}
				e.show();
			},
			show : function (reference, position, data) {
				if(vakata_context.element && vakata_context.element.length) {
					vakata_context.element.width('');
				}
				switch(!0) {
					case (!position && !reference):
						return false;
					case (!!position && !!reference):
						vakata_context.reference	= reference;
						vakata_context.position_x	= position.x;
						vakata_context.position_y	= position.y;
						break;
					case (!position && !!reference):
						vakata_context.reference	= reference;
						var o = reference.offset();
						vakata_context.position_x	= o.left + reference.outerHeight();
						vakata_context.position_y	= o.top;
						break;
					case (!!position && !reference):
						vakata_context.position_x	= position.x;
						vakata_context.position_y	= position.y;
						break;
				}
				if(!!reference && !data && $(reference).data('vakata_contextmenu')) {
					data = $(reference).data('vakata_contextmenu');
				}
				if($.vakata.context._parse(data)) {
					vakata_context.element.html(vakata_context.html);
				}
				if(vakata_context.items.length) {
					var e = vakata_context.element,
						x = vakata_context.position_x,
						y = vakata_context.position_y,
						w = e.width(),
						h = e.height(),
						dw = $(window).width() + $(window).scrollLeft(),
						dh = $(window).height() + $(window).scrollTop();
					if(right_to_left) {
						x -= e.outerWidth();
						if(x < $(window).scrollLeft() + 20) {
							x = $(window).scrollLeft() + 20;
						}
					}
					if(x + w + 20 > dw) {
						x = dw - (w + 20);
					}
					if(y + h + 20 > dh) {
						y = dh - (h + 20);
					}

					vakata_context.element
						.css({ "left" : x, "top" : y })
						.show()
						.find('a:eq(0)').focus().parent().addClass("vakata-context-hover");
					vakata_context.is_visible = true;
					$.vakata.context._trigger("show");
				}
			},
			hide : function () {
				if(vakata_context.is_visible) {
					vakata_context.element.hide().find("ul").hide().end().find(':focus').blur();
					vakata_context.is_visible = false;
					$.vakata.context._trigger("hide");
				}
			}
		};
		$(function () {
			right_to_left = $("body").css("direction") === "rtl";
			var to			= false,
				css_string	= '' +
				'.vakata-context { display:none; _width:1px; } ' +
				'.vakata-context, ' +
				'.vakata-context ul { margin:0; padding:2px; position:absolute; background:#f5f5f5; border:1px solid #979797; ' +
				'	-moz-box-shadow:5px 5px 4px -4px #666666; -webkit-box-shadow:2px 2px 2px #999999; box-shadow:2px 2px 2px #999999; }'  +
				'.vakata-context ul { list-style:none; left:100%; margin-top:-2.7em; margin-left:-4px; } ' +
				'.vakata-context li.vakata-context-right ul { left:auto; right:100%; margin-left:auto; margin-right:-4px; } ' +
				'.vakata-context li { list-style:none; display:inline; }' +
				'.vakata-context li a { display:block; padding:0 2em 0 2em; text-decoration:none; width:auto; color:black; white-space:nowrap; line-height:2.4em; ' +
				'	-moz-text-shadow:1px 1px 0px white; -webkit-text-shadow:1px 1px 0px white; text-shadow:1px 1px 0px white; ' +
				'	-moz-border-radius:1px; -webkit-border-radius:1px; border-radius:1px; }' +
				'.vakata-context li a:hover { position:relative; background-color:#e8eff7; ' +
				'	-moz-box-shadow:0px 0px 2px #0a6aa1; -webkit-box-shadow:0px 0px 2px #0a6aa1; box-shadow:0px 0px 2px #0a6aa1; }' +
				'.vakata-context li.vakata-context-hover > a { position:relative; background-color:#e8eff7; ' +
				'	-moz-box-shadow:0px 0px 2px #0a6aa1; -webkit-box-shadow:0px 0px 2px #0a6aa1; box-shadow:0px 0px 2px #0a6aa1; }' +
				'.vakata-context li a.vakata-context-parent { background-image:url("data:image/gif;base64,R0lGODlhCwAHAIAAACgoKP///yH5BAEAAAEALAAAAAALAAcAAAIORI4JlrqN1oMSnmmZDQUAOw=="); background-position:right center; background-repeat:no-repeat; } ' +
				'.vakata-context li.vakata-context-separator a, ' +
				'.vakata-context li.vakata-context-separator a:hover { background:white; border:0; border-top:1px solid #e2e3e3; height:1px; min-height:1px; max-height:1px; padding:0; margin:0 0 0 2.4em; border-left:1px solid #e0e0e0; _overflow:hidden; ' +
				'	-moz-text-shadow:0 0 0 transparent; -webkit-text-shadow:0 0 0 transparent; text-shadow:0 0 0 transparent; ' +
				'	-moz-box-shadow:0 0 0 transparent; -webkit-box-shadow:0 0 0 transparent; box-shadow:0 0 0 transparent; ' +
				'	-moz-border-radius:0; -webkit-border-radius:0; border-radius:0; }' +
				'.vakata-context li.vakata-contextmenu-disabled a, .vakata-context li.vakata-contextmenu-disabled a:hover { color:silver; background-color:transparent; border:0; box-shadow:0 0 0; }' +
				'' +
				'.vakata-context li a ins { text-decoration:none; display:inline-block; width:2.4em; height:2.4em; background:transparent; margin:0 0 0 -2em; } ' +
				'.vakata-context li a span { display:inline-block; width:1px; height:2.4em; background:white; margin:0 0.5em 0 0; border-left:1px solid #e2e3e3; _overflow:hidden; } ' +
				'' +
				'.vakata-context-rtl ul { left:auto; right:100%; margin-left:auto; margin-right:-4px; } ' +
				'.vakata-context-rtl li a.vakata-context-parent { background-image:url("data:image/gif;base64,R0lGODlhCwAHAIAAACgoKP///yH5BAEAAAEALAAAAAALAAcAAAINjI+AC7rWHIsPtmoxLAA7"); background-position:left center; background-repeat:no-repeat; } ' +
				'.vakata-context-rtl li.vakata-context-separator a { margin:0 2.4em 0 0; border-left:0; border-right:1px solid #e2e3e3;} ' +
				'.vakata-context-rtl li.vakata-context-left ul { right:auto; left:100%; margin-left:-4px; margin-right:auto; } ' +
				'.vakata-context-rtl li a ins { margin:0 -2em 0 0; } ' +
				'.vakata-context-rtl li a span { margin:0 0 0 0.5em; border-left-color:white; background:#e2e3e3; } ' +
				'';
			if(!$.jstree.no_css) {
				$('head').append('<style type="text/css">' + css_string + '</style>');
			}

			vakata_context.element = $("<ul class='vakata-context'></ul>");
			vakata_context.element
				.on("mouseenter", "li", function (e) {
					e.stopImmediatePropagation();

					if($.contains(this, e.relatedTarget)) {
						// премахнато заради delegate mouseleave по-долу
						// $(this).find(".vakata-context-hover").removeClass("vakata-context-hover");
						return;
					}

					if(to) { clearTimeout(to); }
					vakata_context.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end();

					$(this)
						.siblings().find("ul").hide().end().end()
						.parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover");
					$.vakata.context._show_submenu(this);
				})
				// тестово - дали не натоварва?
				.on("mouseleave", "li", function (e) {
					if($.contains(this, e.relatedTarget)) { return; }
					$(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover");
				})
				.on("mouseleave", function (e) {
					$(this).find(".vakata-context-hover").removeClass("vakata-context-hover");
					if($.vakata.context.settings.hide_onmouseleave) {
						to = setTimeout(
							(function (t) {
								return function () { $.vakata.context.hide(); };
							})(this), $.vakata.context.settings.hide_onmouseleave);
					}
				})
				.on("click", "a", function (e) {
					e.preventDefault();
				})
				.on("mouseup", "a", function (e) {
					if(!$(this).blur().parent().hasClass("vakata-context-disabled") && $.vakata.context._execute($(this).attr("rel")) !== false) {
						$.vakata.context.hide();
					}
				})
				.on('keydown', 'a', function (e) {
						var o = null;
						switch(e.which) {
							case 13:
							case 32:
								e.type = "mouseup";
								e.preventDefault();
								$(e.currentTarget).trigger(e);
								break;
							case 37:
								if(vakata_context.is_visible) {
									vakata_context.element.find(".vakata-context-hover").last().parents("li:eq(0)").find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 38:
								if(vakata_context.is_visible) {
									o = vakata_context.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first();
									if(!o.length) { o = vakata_context.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last(); }
									o.addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 39:
								if(vakata_context.is_visible) {
									vakata_context.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 40:
								if(vakata_context.is_visible) {
									o = vakata_context.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first();
									if(!o.length) { o = vakata_context.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first(); }
									o.addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 27:
								$.vakata.context.hide();
								e.preventDefault();
								break;
							default:
								//console.log(e.which);
								break;
						}
					})
				.appendTo("body");

			$(document)
				.on("mousedown", function (e) {
					if(vakata_context.is_visible && !$.contains(vakata_context.element[0], e.target)) { $.vakata.context.hide(); }
				})
				.on("context_show.vakata", function (e, data) {
					vakata_context.element.find("li:has(ul)").children("a").addClass("vakata-context-parent");
					if(right_to_left) {
						vakata_context.element.addClass("vakata-context-rtl").css("direction", "rtl");
					}
					// also apply a RTL class?
					vakata_context.element.find("ul").hide().end();
				});
		});
	})($);

	$.jstree.defaults.plugins.push("contextmenu");
})(jQuery);
/* File: jstree.dnd.js
Enables drag'n'drop.
*/
/* Group: jstree drag'n'drop plugin */

(function ($) {
	$.jstree.defaults.dnd = {
		copy_modifier : 'ctrl',
		open_timeout : 500
	};
	$.jstree.plugins.dnd = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on('mousedown', 'a', $.proxy(function (e) {
					var obj = this.get_node(e.target); // TODO: how about multiple
					if(obj && obj !== -1 && obj.length && e.which === 1) { // TODO: think about e.which
						this.element.trigger('mousedown.jstree');
						return $.vakata.dnd.start(e, { 'jstree' : true, 'origin' : this, 'obj' : obj }, '<div id="jstree-dnd" class="jstree-' + this.get_theme() + '"><i class="jstree-icon jstree-er"></i>' + this.get_text(e.currentTarget, true) + '<ins class="jstree-copy" style="display:none;">+</ins></div>');
					}
				}, this));
		};
	};

	$(function() {
		// bind only once for all instances
		var lastmv = false,
			opento = false,
			marker = $('<div id="jstree-marker">&#160;</div>').hide().appendTo('body');

		$(document)
			.bind('dnd_start.vakata', function (e, data) {
				lastmv = false;
			})
			.bind('dnd_move.vakata', function (e, data) {
				if(opento) { clearTimeout(opento); }
				if(!data.data.jstree) { return; }

				// if we are hovering the marker image do nothing (can happen on "inside" drags)
				if(data.event.target.id && data.event.target.id === 'jstree-marker') {
					return;
				}

				var ins = $.jstree.reference(data.event.target),
					ref = false,
					off = false,
					rel = false,
					l, t, h, p, i, o;
				// if we are over an instance
				if(ins && ins._data && ins._data.dnd) {
					marker.attr('class', 'jstree-' + ins.get_theme());
					data.helper
						.children().attr('class', 'jstree-' + ins.get_theme())
						.find('.jstree-copy:eq(0)')[ data.event[data.data.origin.settings.dnd.copy_modifier + "Key"] ? 'show' : 'hide' ]();


					// if are hovering the container itself add a new root node
					if(data.event.target === ins.element[0] || data.event.target === ins.get_container_ul()[0]) {
						if(ins.check( (data.event[data.data.origin.settings.dnd.copy_modifier + "Key"] ? "copy_node" : "move_node"), data.data.obj, -1, 'last')) {
							lastmv = { 'ins' : ins, 'par' : -1, 'pos' : 'last' };
							marker.hide();
							data.helper.find('.jstree-icon:eq(0)').removeClass('jstree-er').addClass('jstree-ok');
							return;
						}
					}
					else {
						// if we are hovering a tree node
						ref = $(data.event.target).closest('a');
						if(ref && ref.length && ref.parent().is('.jstree-closed, .jstree-open, .jstree-leaf')) {
							off = ref.offset();
							rel = data.event.pageY - off.top;
							h = ref.height();
							if(rel < h / 3) {
								o = ['b', 'i', 'a'];
							}
							else if(rel > h - h / 3) {
								o = ['a', 'i', 'b'];
							}
							else {
								o = rel > h / 2 ? ['i', 'a', 'b'] : ['i', 'b', 'a'];
							}
							$.each(o, function (j, v) {
								switch(v) {
									case 'b':
										l = off.left - 6;
										t = off.top - 5;
										p = ins.get_parent(ref);
										i = ref.parent().index();
										break;
									case 'i':
										l = off.left - 2;
										t = off.top - 5 + h / 2 + 1;
										p = ref.parent();
										i = 0;
										break;
									case 'a':
										l = off.left - 6;
										t = off.top - 5 + h + 2;
										p = ins.get_parent(ref);
										i = ref.parent().index() + 1;
										break;
								}
								/*
								// TODO: moving inside, but the node is not yet loaded?
								// the check will work anyway, as when moving the node will be loaded first and checked again
								if(v === 'i' && !ins.is_loaded(p)) { }
								*/
								if(ins.check((data.event[data.data.origin.settings.dnd.copy_modifier + "Key"] ? "copy_node" : "move_node"),data.data.obj, p, i)) {
									if(v === 'i' && ref.parent().is('.jstree-closed') && ins.settings.dnd.open_timeout) {
										opento = setTimeout((function (x, z) { return function () { x.open_node(z); }; })(ins, ref), ins.settings.dnd.open_timeout);
									}
									lastmv = { 'ins' : ins, 'par' : p, 'pos' : i };
									marker.css({ 'left' : l + 'px', 'top' : t + 'px' }).show();
									data.helper.find('.jstree-icon:eq(0)').removeClass('jstree-er').addClass('jstree-ok');
									o = true;
									return false;
								}
							});
							if(o === true) { return; }
						}
					}
				}
				lastmv = false;
				data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
				marker.hide();
			})
			.bind('dnd_scroll.vakata', function (e, data) {
				if(!data.data.jstree) { return; }
				marker.hide();
				lastmv = false;
				data.helper.find('.jstree-icon:eq(0)').removeClass('jstree-ok').addClass('jstree-er');
			})
			.bind('dnd_stop.vakata', function (e, data) {
				if(opento) { clearTimeout(opento); }
				if(!data.data.jstree) { return; }
				marker.hide();
				if(lastmv) {
					lastmv.ins[ data.event[data.data.origin.settings.dnd.copy_modifier + "Key"] ? 'copy_node' : 'move_node' ]
						(data.data.obj, lastmv.par, lastmv.pos);
				}
			})
			.bind('keyup keydown', function (e, data) {
				data = $.vakata.dnd._get();
				if(data.data && data.data.jstree) {
					data.helper.find('.jstree-copy:eq(0)')[ e[data.data.origin.settings.dnd.copy_modifier + "Key"] ? 'show' : 'hide' ]();
				}
			});

		// add DND CSS
		var css_string = '' +
				'#jstree-marker { position: absolute; top:0; left:0; margin:0; padding:0; border-right:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:5px solid; width:0; height:0; font-size:0; line-height:0; _border-top-color:pink; _border-botton-color:pink; _filter:chroma(color=pink); } ' +
				'#jstree-dnd { line-height:16px; margin:0; padding:4px; } ' +
				'#jstree-dnd .jstree-icon, #jstree-dnd .jstree-copy { display:inline-block; text-decoration:none; margin:0 2px 0 0; padding:0; width:16px; height:16px; } ' +
				'#jstree-dnd .jstree-ok { background:green; } ' +
				'#jstree-dnd .jstree-er { background:red; } ' +
				'#jstree-dnd .jstree-copy { margin:0 2px 0 2px; }';
		if(!$.jstree.no_css) {
			$('head').append('<style type="text/css">' + css_string + '</style>');
		}
	});

	// include the dnd plugin by default
	$.jstree.defaults.plugins.push("dnd");
})(jQuery);

// helpers
(function ($) {
	$.fn.vakata_reverse = [].reverse;
	// private variable
	var vakata_dnd = {
		element	: false,
		is_down	: false,
		is_drag	: false,
		helper	: false,
		helper_w: 0,
		data	: false,
		init_x	: 0,
		init_y	: 0,
		scroll_l: 0,
		scroll_t: 0,
		scroll_e: false,
		scroll_i: false
	};
	$.vakata.dnd = {
		settings : {
			scroll_speed		: 10,
			scroll_proximity	: 20,
			helper_left			: 5,
			helper_top			: 10,
			threshold			: 5
		},
		_trigger : function (event_name, e) {
			var data = $.vakata.dnd._get();
			data.event = e;
			$(document).triggerHandler("dnd_" + event_name + ".vakata", data);
		},
		_get : function () {
			return {
				"data"		: vakata_dnd.data,
				"element"	: vakata_dnd.element,
				"helper"	: vakata_dnd.helper
			};
		},
		_clean : function () {
			if(vakata_dnd.helper) { vakata_dnd.helper.remove(); }
			if(vakata_dnd.scroll_i) { clearInterval(vakata_dnd.scroll_i); vakata_dnd.scroll_i = false; }
			vakata_dnd = {
				element	: false,
				is_down	: false,
				is_drag	: false,
				helper	: false,
				helper_w: 0,
				data	: false,
				init_x	: 0,
				init_y	: 0,
				scroll_l: 0,
				scroll_t: 0,
				scroll_e: false,
				scroll_i: false
			};
			$(document).unbind("mousemove",	$.vakata.dnd.drag);
			$(document).unbind("mouseup",	$.vakata.dnd.stop);
		},
		_scroll : function (init_only) {
			if(!vakata_dnd.scroll_e || (!vakata_dnd.scroll_l && !vakata_dnd.scroll_t)) {
				if(vakata_dnd.scroll_i) { clearInterval(vakata_dnd.scroll_i); vakata_dnd.scroll_i = false; }
				return false;
			}
			if(!vakata_dnd.scroll_i) {
				vakata_dnd.scroll_i = setInterval($.vakata.dnd._scroll, 100);
				return false;
			}
			if(init_only === true) { return false; }

			var i = vakata_dnd.scroll_e.scrollTop(),
				j = vakata_dnd.scroll_e.scrollLeft();
			vakata_dnd.scroll_e.scrollTop(i + vakata_dnd.scroll_t * $.vakata.dnd.settings.scroll_speed);
			vakata_dnd.scroll_e.scrollLeft(j + vakata_dnd.scroll_l * $.vakata.dnd.settings.scroll_speed);
			if(i !== vakata_dnd.scroll_e.scrollTop() || j !== vakata_dnd.scroll_e.scrollLeft()) {
				$.vakata.dnd._trigger("scroll", vakata_dnd.scroll_e);
			}
		},
		start : function (e, data, html) {
			if(vakata_dnd.is_drag) { $.vakata.dnd.stop({}); }
			try {
				e.currentTarget.unselectable = "on";
				e.currentTarget.onselectstart = function() { return false; };
				if(e.currentTarget.style) { e.currentTarget.style.MozUserSelect = "none"; }
			} catch(err) { }
			vakata_dnd.init_x	= e.pageX;
			vakata_dnd.init_y	= e.pageY;
			vakata_dnd.data		= data;
			vakata_dnd.is_down	= true;
			vakata_dnd.element	= e.currentTarget;
			if(html !== false) {
				vakata_dnd.helper = $("<div id='vakata-dnd'></div>").html(html).css({
					"display"		: "block",
					"margin"		: "0",
					"padding"		: "0",
					"position"		: "absolute",
					"top"			: "-2000px",
					"lineHeight"	: "16px",
					"zIndex"		: "10000"
				});
			}
			$(document).bind("mousemove", $.vakata.dnd.drag);
			$(document).bind("mouseup", $.vakata.dnd.stop);
			return false;
		},
		drag : function (e) {
			if(!vakata_dnd.is_down) { return; }
			if(!vakata_dnd.is_drag) {
				if(
					Math.abs(e.pageX - vakata_dnd.init_x) > $.vakata.dnd.settings.threshold ||
					Math.abs(e.pageY - vakata_dnd.init_y) > $.vakata.dnd.settings.threshold
				) {
					if(vakata_dnd.helper) {
						vakata_dnd.helper.appendTo("body");
						vakata_dnd.helper_w = vakata_dnd.helper.outerWidth();
					}
					vakata_dnd.is_drag = true;
					$.vakata.dnd._trigger("start", e);
				}
				else { return; }
			}

			var d  = false, w  = false,
				dh = false, wh = false,
				dw = false, ww = false,
				dt = false, dl = false,
				ht = false, hl = false;

			vakata_dnd.scroll_t = 0;
			vakata_dnd.scroll_l = 0;
			vakata_dnd.scroll_e = false;
			var p = $(e.target)
				.parentsUntil("body").addBack().vakata_reverse()
				.filter(function () {
					return	(/^auto|scroll$/).test($(this).css("overflow")) &&
							(this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth);
				})
				.each(function () {
					var t = $(this), o = t.offset();
					if(this.scrollHeight > this.offsetHeight) {
						if(o.top + t.height() - e.pageY < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_t = 1; }
						if(e.pageY - o.top < $.vakata.dnd.settings.scroll_proximity)				{ vakata_dnd.scroll_t = -1; }
					}
					if(this.scrollWidth > this.offsetWidth) {
						if(o.left + t.width() - e.pageX < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_l = 1; }
						if(e.pageX - o.left < $.vakata.dnd.settings.scroll_proximity)				{ vakata_dnd.scroll_l = -1; }
					}
					if(vakata_dnd.scroll_t || vakata_dnd.scroll_l) {
						vakata_dnd.scroll_e = $(this);
						return false;
					}
				});

			if(!vakata_dnd.scroll_e) {
				d  = $(document); w = $(window);
				dh = d.height(); wh = w.height();
				dw = d.width(); ww = w.width();
				dt = d.scrollTop(); dl = d.scrollLeft();
				if(dh > wh && e.pageY - dt < $.vakata.dnd.settings.scroll_proximity)		{ vakata_dnd.scroll_t = -1;  }
				if(dh > wh && wh - (e.pageY - dt) < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_t = 1; }
				if(dw > ww && e.pageX - dl < $.vakata.dnd.settings.scroll_proximity)		{ vakata_dnd.scroll_l = -1; }
				if(dw > ww && ww - (e.pageX - dl) < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_l = 1; }
				if(vakata_dnd.scroll_t || vakata_dnd.scroll_l) {
					vakata_dnd.scroll_e = d;
				}
			}
			if(vakata_dnd.scroll_e) { $.vakata.dnd._scroll(true); }

			if(vakata_dnd.helper) {
				ht = parseInt(e.pageY + $.vakata.dnd.settings.helper_top, 10);
				hl = parseInt(e.pageX + $.vakata.dnd.settings.helper_left, 10);
				if(dh && ht + 25 > dh) { ht = dh - 50; }
				if(dw && hl + vakata_dnd.helper_w > dw) { hl = dw - (vakata_dnd.helper_w + 2); }
				vakata_dnd.helper.css({
					left	: hl + "px",
					top		: ht + "px"
				});
			}
			$.vakata.dnd._trigger("move", e);
		},
		stop : function (e) {
			if(vakata_dnd.is_drag) {
				$.vakata.dnd._trigger("stop", e);
			}
			$.vakata.dnd._clean();
		}
	};
})(jQuery);

/* File: jstree.html.js
This plugin makes it possible for jstree to use HTML data sources (other than the container's initial HTML).
*/
/* Group: jstree html plugin */
(function ($) {
	$.jstree.defaults.html = {
		data	: false,
		ajax	: false
	};

	$.jstree.plugins.html = function (options, parent) {
		this.append_html_data = function (dom, data) {
			data = $(data);
			dom = this.get_node(dom);
			if(!data || !data.length || !data.is('ul, li')) {
				if(dom && dom !== -1 && dom.is('li')) {
					dom.removeClass('jstree-closed').addClass('jstree-leaf').children('ul').remove();
				}
				return true;
			}
			if(dom === -1) { dom = this.element; }
			if(!dom.length) { return false; }
			if(!dom.children('ul').length) { dom.append('<ul />'); }
			dom.children('ul').empty().append(data.is('ul') ? data.children('li') : data);
			return true;
		};
		this._load_node = function (obj, callback) {
			var d = false,
				s = $.extend(true, {}, this.settings.html);
			obj = this.get_node(obj);
			if(!obj) { return false; }

			switch(!0) {
				// no settings - use parent
				case (!s.data && !s.ajax):
					return parent._load_node.call(this, obj, callback);
				// data is function
				case ($.isFunction(s.data)):
					return s.data.call(this, obj, $.proxy(function (d) {
						return callback.call(this, this._append_html_data(obj, d));
					}, this));
				// data is set, ajax is not set, or both are set, but we are dealing with root node
				case ((!!s.data && !s.ajax) || (!!s.data && !!s.ajax && obj === -1)):
					return callback.call(this, this._append_html_data(obj, s.data));
				// data is not set, ajax is set, or both are set, but we are dealing with a normal node
				case ((!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj !== -1)):
					s.ajax.success = $.proxy(function (d, t, x) {
						var s = this.settings.html.ajax;
						if($.isFunction(s.success)) {
							d = s.success.call(this, d, t, x) || d;
						}
						callback.call(this, this._append_html_data(obj, d));
					}, this);
					s.ajax.error = $.proxy(function (x, t, e) {
						var s = this.settings.html.ajax;
						if($.isFunction(s.error)) {
							s.error.call(this, x, t, e);
						}
						callback.call(this, false);
					}, this);
					if(!s.ajax.dataType) { s.ajax.dataType = "html"; }
					if($.isFunction(s.ajax.url))	{ s.ajax.url	= s.ajax.url.call(this, obj); }
					if($.isFunction(s.ajax.data))	{ s.ajax.data	= s.ajax.data.call(this, obj); }
					return $.ajax(s.ajax);
			}
		};
	};
	// include the html plugin by default
	$.jstree.defaults.plugins.push("html");
})(jQuery);
/* File: jstree.json.js
This plugin makes it possible for jstree to use JSON data sources.
*/
/* Group: jstree json plugin */
(function ($) {
	$.jstree.defaults.json = {
		data	: false,
		ajax	: false,
		progressive_render : false, // get_json, data on each node
		progressive_unload : false
	};

	$.jstree.plugins.json = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);
			this.element
				.bind("ready.jstree", $.proxy(function () {
					this.element
						.bind("after_close.jstree", $.proxy(function (e, data) {
							var t = $(data.node);
							if(this.settings.json.progressive_unload) {
								t.data('jstree').children = this.get_json(t)[0].children;
								t.children("ul").remove();
							}
						}, this));
			}, this));
		};
		this.parse_json = function (node) {
			var s = this.settings.json;
			if($.isArray(node.children)) {
				if(s.progressive_render) {
					if(!node.data) { node.data = {}; }
					if(!node.data.jstree) { node.data.jstree = {}; }
					node.data.jstree.children = node.children;
					node.children = true;
				}
			}
			return parent.parse_json.call(this, node);
		};
		this._append_json_data = function (dom, data) {
			dom = this.get_node(dom);
			if(dom === -1) { dom = this.element; }
			data = this.parse_json(data);
			if(!dom.length) { return false; }
			if(!data) {
				if(dom && dom.is('li')) {
					dom.removeClass('jstree-closed').addClass('jstree-leaf').children('ul').remove();
				}
				return true;
			}
			if(!dom.children('ul').length) { dom.append('<ul />'); }
			dom.children('ul').empty().append(data.is('li') ? data : data.children('li'));
			return true;
		};
		this._load_node = function (obj, callback) {
			var d = false,
				s = $.extend(true, {}, this.settings.json);
			obj = this.get_node(obj);
			if(!obj) { return false; }

			switch(!0) {
				// root node with data
				case (obj === -1 && this.get_container().data('jstree') && $.isArray(this.get_container().data('jstree').children)):
					d = this.element.data('jstree').children;
					this.get_container().data('jstree').children = null;
					return callback.call(this, this._append_json_data(obj, d));
				// normal node with data
				case (obj !== -1 && obj.length && obj.data('jstree') && $.isArray(obj.data('jstree').children)):
					d = obj.data('jstree').children;
					obj.data('jstree').children = null;
					return callback.call(this, this._append_json_data(obj, d));
				// no settings - use parent
				case (!s.data && !s.ajax):
					return parent._load_node.call(this, obj, callback);
				// data is function
				case ($.isFunction(s.data)):
					return s.data.call(this, obj, $.proxy(function (d) {
						return callback.call(this, this._append_json_data(obj, d));
					}, this));
				// data is set, ajax is not set, or both are set, but we are dealing with root node
				case ((!!s.data && !s.ajax) || (!!s.data && !!s.ajax && obj === -1)):
					return callback.call(this, this._append_json_data(obj, s.data));
				// data is not set, ajax is set, or both are set, but we are dealing with a normal node
				case ((!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj !== -1)):
					s.ajax.success = $.proxy(function (d, t, x) {
						var s = this.settings.json.ajax;
						if($.isFunction(s.success)) {
							d = s.success.call(this, d, t, x) || d;
						}
						callback.call(this, this._append_json_data(obj, d));
					}, this);
					s.ajax.error = $.proxy(function (x, t, e) {
						var s = this.settings.json.ajax;
						if($.isFunction(s.error)) {
							s.error.call(this, x, t, e);
						}
						callback.call(this, false);
					}, this);
					if(!s.ajax.dataType) { s.ajax.dataType = "json"; }
					if($.isFunction(s.ajax.url))	{ s.ajax.url	= s.ajax.url.call(this, obj); }
					if($.isFunction(s.ajax.data))	{ s.ajax.data	= s.ajax.data.call(this, obj); }
					return $.ajax(s.ajax);
			}
		};
	};
	// include the json plugin by default
	$.jstree.defaults.plugins.push("json");
})(jQuery);
/* File: jstree.rules.js
Limits the children count, valid children and depth of nodes by using types or embedded data.
*/
/* Group: jstree rules plugin */
(function ($) {
	var last_depth_node = false,
		last_depth_value = 0;

	$.jstree.defaults.rules = {
		'check_max_depth'		: true,
		'check_max_children'	: true,
		'check_valid_children'	: true,
		'types'					: { }
	};

	$.jstree.plugins.rules = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element.on('load_node.jstree', $.proxy(function (e, data) {
				if(this.settings.rules.check_max_depth) {
					var o = data.node === -1 ? this.element : data.node,
						t = this,
						f = function () {
							if(t.apply_max_depth(this)) {
								o = o.not(this);
							}
						};
					if(!this.apply_max_depth(o)) {
						while(o.length) {
							o = o.find("> ul > li");
							o.each(f);
						}
					}
				}
			}, this));
		};
		this.apply_max_depth = function (obj) {
			obj = this.get_node(obj);
			if(!obj || !obj.length) {
				return false;
			}
			obj = obj === -1 ? this.element : obj;
			var d = obj.data('jstree'),
				t = {},
				f1 = function () {
					t = $(this).data('jstree') || {};
					t.max_depth = 0;
					$(this).data('jstree', t);
				},
				f2 = function () {
					t = $(this).data('jstree') || {};
					t.max_depth = t.max_depth && t.max_depth !== -1 ? Math.min(t.max_depth, d) : d;
					$(this).data('jstree', t);
				};
			if(d && typeof d.max_depth !== 'undefined' && d.max_depth !== -1) {
				d = d.max_depth;
				while(obj.length > 0) {
					obj = obj.find("> ul > li");
					d = Math.max(d - 1, 0);
					if(d === 0) {
						obj.find('li').addBack().each(f1);
						break;
					}
					obj.each(f2);
				}
				return true;
			}
			return false;
		};
		this.get_rules = function (obj) {
			obj = this.get_node(obj);
			if(obj === -1) {
				obj = this.element;
				obj = obj.data('jstree');
				return {
					'type'				: false,
					'max_depth'			: obj && obj.max_depth ? obj.max_depth : -1,
					'max_children'		: obj && obj.max_children ? obj.max_children : -1,
					'valid_children'	: obj && obj.valid_children ? obj.valid_children  : -1
				};
			}
			if(!obj || !obj.length) { return false; }

			var s = this.settings.rules,
				t = this.get_type(obj),
				r = {
					'type'				: t,
					'max_depth'			: -1,
					'max_children'		: -1,
					'valid_children'	: -1
				};
			obj = obj.data('jstree');
			if(t && s[t]) {
				if(s[t].max_depth)			{ r.max_depth = s[t].max_depth; }
				if(s[t].max_children)		{ r.max_children = s[t].max_children; }
				if(s[t].valid_children)		{ r.valid_children = s[t].valid_children; }
			}
			if(obj && typeof obj.max_children !== 'undefined')		{ r.max_children = obj.max_children; }
			if(obj && typeof obj.valid_children !== 'undefined')	{ r.valid_children = obj.valid_children; }
			if(obj && typeof obj.max_depth !== 'undefined' && (r.max_depth === -1 || (obj.max_depth !== -1 && obj.max_depth < r.max_depth) ) ) {
				r.max_depth = obj.max_depth;
			}

			return r;
		};
		this.get_type = function (obj) {
			obj = this.get_node(obj);
			if(obj === -1) { obj = this.element; }
			if(!obj || !obj.length) { return false; }
			obj = obj.data('jstree');
			return obj && obj.type ? obj.type : false;
		};
		this.set_type = function (obj, type) {
			obj = this.get_node(obj);
			if(obj === -1) { obj = this.element; }
			if(!obj || !obj.length) { return false; }
			var d = obj.data('jstree');
			if(!d) { d = {}; }
			d.type = type;
			obj.data('jstree', d);
			return true;
		};
		this.check = function (chk, obj, par, pos) {
			if(parent.check.call(this, chk, obj, par, pos) === false) { return false; }
			var r = false,
				s = this.settings.rules,
				t = this,
				o = false,
				d = 0;

			switch(chk) {
				case "create_node":
				case "move_node":
				case "copy_node":
					if(s.check_max_children || s.check_valid_children || s.check_max_depth) {
						r = this.get_rules(par);
					}
					else {
						return true;
					}
					if(s.check_max_children) {
						if(typeof r.max_children !== 'undefined' && r.max_children !== -1) {
							if(par.find('> ul >  li').not( chk === 'move_node' ? obj : null ).length + obj.length > r.max_children) {
								return false;
							}
						}
					}
					if(s.check_valid_children) {
						if(typeof r.valid_children !== 'undefined' && r.valid_children !== -1) {
							if(!$.isArray(r.valid_children)) { return false; }
							obj.each(function () {
								if($.inArray(t.get_type(this), r.valid_children) === -1) {
									t = false;
									return false;
								}
							});
							if(t === false) {
								return false;
							}
						}
					}
					if(s.check_max_depth && r.max_depth !== -1) {
						d = 0;
						do {
							d ++;
							obj = obj.find('> ul > li');
						} while(obj.length && chk !== 'create_node');
						if(r.max_depth - d < 0) { return false; }
					}
					break;
			}
			return true;
		};
	};

	// include the rules plugin by default
	$.jstree.defaults.plugins.push("rules");
})(jQuery);
(function ($) {
	$.jstree.defaults.search = {
		ajax : false,
		search_method : "vakata_icontains",
		show_only_matches : true
	};

	$.jstree.plugins.search = function (options, parent) {
		this.init = function (el, options) {
			if(options.json) {
				options.json.progressive_unload = false;
				options.json.progressive_render = false;
			}
			parent.init.call(this, el, options);
		};
		this.bind = function () {
			parent.bind.call(this);

			this._data.search.str = "";
			this._data.search.res = $();

			if(this.settings.search.show_only_matches) {
				this.element
					.on("search.jstree", function (e, data) {
						$(this).children("ul").find("li").hide().removeClass("jstree-last");
						data.nodes.parentsUntil(".jstree").addBack().show()
							.filter("ul").each(function () { $(this).children("li:visible").eq(-1).addClass("jstree-last"); });
					})
					.on("clear_search.jstree", function () {
						$(this).children("ul").find("li").css("display","").end().end().jstree("correct_node", -1, true);
					});
			}
		};
		this.search = function (str, skip_async) {
			if(str === false || $.trim(str) === "") {
				return this.clear_search();
			}
			var s = this.settings.search,
				t = this;

			// progressive render?
			if(!skip_async && s.ajax !== false && this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length > 0) {
				s.ajax.success = $.proxy(function (d, t, x) {
					var s = this.settings.search.ajax;
					if($.isFunction(s.success)) {
						d = s.success.call(this, d, t, x) || d;
					}
					this._search_open(d, str);
				}, this);
				s.ajax.error = $.proxy(function (x, t, e) {
					var s = this.settings.search.ajax;
					if($.isFunction(s.error)) {
						s.error.call(this, x, t, e);
					}
					// do stuff
				}, this);
				if(!s.ajax.dataType) {
					s.ajax.dataType = "json";
				}
				if($.isFunction(s.ajax.url)) {
					s.ajax.url	= s.ajax.url.call(this, str);
				}
				if($.isFunction(s.ajax.data)) {
					s.ajax.data	= s.ajax.data.call(this, str);
				}
				else {
					if(!s.ajax.data) { s.ajax.data = {}; }
					s.ajax.data.str = str;
				}
				$.ajax(s.ajax);
				return;
			}
			if(this._data.search.res.length) {
				this.clear_search();
			}
			this._data.search.str = str;
			this._data.search.res = this.element.find("a:" + (s.search_method) + "(" + str + ")");

			this._data.search.res.addClass("jstree-search").parent().parents(".jstree-closed").each(function () {
				t.open_node(this, false, 0);
			});
			this.trigger('search', { nodes : this._data.search.res, str : str });
		};
		this.clear_search = function (str) {
			this._data.search.res.removeClass("jstree-search");
			this.trigger('clear_search', { 'nodes' : this._data.search.res, str : this._data.search.str });
			this._data.search.str = "";
			this._data.search.res = $();
		};
		this._search_open = function (d, str) {
			var res = true,
				t = this;
			$.each(d.concat([]), function (i, v) {
				v = document.getElementById(v);
				if(v) {
					if(t.is_loaded(v)) {
						if(t.is_closed(v)) {
							t.open_node(v, false, 0);
						}
						$.vakata.array_remove(d, i);
					}
					else {
						if(!t.is_loading(v)) {
							t.open_node(v, $.proxy(function () { this._search_open(d, str); }, t), 0);
						}
						res = false;
					}
				}
			});
			if(res) {
				this.search(str, true);
			}
		};
	};

	// helper for case-insensitive search
	$.expr[':'].vakata_icontains = $.expr.createPseudo(function(search) {
		return function(a) {
			return (a.textContent || a.innerText || "").toLowerCase().indexOf(search.toLowerCase())>=0;
		};
	});

	// include the json plugin by default
	$.jstree.defaults.plugins.push("search");
})(jQuery);

/* File: jstree.sort.js
Sorts items alphabetically (or using any other function)
*/
/* Group: jstree sort plugin */
(function ($) {
	$.jstree.defaults.sort = function (a, b) {
		return this.get_text(a, true) > this.get_text(b, true) ? 1 : -1;
	};
	$.jstree.plugins.sort = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on("load_node.jstree", $.proxy(function (e, data) {
						var obj = this.get_node(data.node);
						obj = obj === -1 ? this.get_container_ul() : obj.children("ul");
						this.sort(obj, true);
					}, this))
				.on("rename_node.jstree create_node.jstree", $.proxy(function (e, data) {
						this.sort(data.node.parent(), false);
					}, this))
				.on("move_node.jstree copy_node.jstree", $.proxy(function (e, data) {
						var m = data.parent === -1 ? this.get_container_ul() : data.parent.children('ul');
						this.sort(m, false);
					}, this));
		};
		this.sort = function (obj, deep) {
			var s = this.settings.sort,
				t = this;
			obj.append($.makeArray(obj.children("li")).sort($.proxy(s, t)));
			obj.children('li').each(function () { t.correct_node(this, false); });
			if(deep) {
				obj.find("> li > ul").each(function() { t.sort($(this)); });
				t.correct_node(obj.children('li'), true);
			}
		};
	};

	// include the sort plugin by default
	$.jstree.defaults.plugins.push("sort");
})(jQuery);
/* File: jstree.state.js
This plugin enables state saving between reloads.
*/
/* Group: jstree state plugin */
(function ($) {
	var to = false;

	$.jstree.defaults.state = {
		key		: 'jstree',
		events	: 'changed.jstree open_node.jstree close_node.jstree'
	};
	$.jstree.plugins.state = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on("ready.jstree", $.proxy(function (e, data) {
						this.element.one("restore_state.jstree set_state.jstree", $.proxy(function () {
							this.element.on(this.settings.state.events, $.proxy(function () {
								if(to) { clearTimeout(to); }
								to = setTimeout($.proxy(function () { this.save_state(); }, this), 100);
							}, this));
						}, this));
						this.restore_state();
					}, this));
		};
		this.save_state = function () {
			$.vakata.storage.set(this.settings.state.key, this.get_state());
		};
		this.restore_state = function () {
			var k = $.vakata.storage.get(this.settings.state.key);

			if(!!k) { this.set_state(k); }
			this.trigger('restore_state', { 'state' : k });
		};
	};

	// include the state plugin by default
	$.jstree.defaults.plugins.push("state");
})(jQuery);

(function ($, document, undefined) {
	var raw		= function (s) { return s; },
		decoded	= function (s) { return decodeURIComponent(s.replace(/\+/g, ' ')); };
	var config = $.vakata.cookie = function (key, value, options) {
		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? $.vakata.json.encode(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? $.vakata.json.decode(cookie) : cookie;
			}
		}
		return null;
	};
	config.defaults = {};
	$.vakata.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};
})(jQuery, document);

(function ($) {
	var _storage = {},
		_storage_service = {jStorage:"{}"},
		_storage_elm = null,
		_storage_size = 0,
		json_encode = $.vakata.json.encode,
		json_decode = $.vakata.json.decode,
		_backend = false,
		_ttl_timeout = false;

	function _init() {
		var localStorageReallyWorks = false;
		if("localStorage" in window){
			try {
				window.localStorage.setItem('_tmptest', 'tmpval');
				localStorageReallyWorks = true;
				window.localStorage.removeItem('_tmptest');
			} catch(BogusQuotaExceededErrorOnIos5) {
				// Thanks be to iOS5 Private Browsing mode which throws
				// QUOTA_EXCEEDED_ERRROR DOM Exception 22.
			}
		}

		if(localStorageReallyWorks){
			try {
				if(window.localStorage) {
					_storage_service = window.localStorage;
					_backend = "localStorage";
				}
			} catch(E3) {/* Firefox fails when touching localStorage and cookies are disabled */}
		}
		else if("globalStorage" in window) {
			try {
				if(window.globalStorage) {
					_storage_service = window.globalStorage[window.location.hostname];
					_backend = "globalStorage";
				}
			} catch(E4) {/* Firefox fails when touching localStorage and cookies are disabled */}
		}
		else {
			_storage_elm = document.createElement('link');
			if(_storage_elm.addBehavior) {
				_storage_elm.style.behavior = 'url(#default#userData)';
				document.getElementsByTagName('head')[0].appendChild(_storage_elm);
				try {
					_storage_elm.load("jStorage");
					var data = "{}";
					data = _storage_elm.getAttribute("jStorage");
					_storage_service.jStorage = data;
					_backend = "userDataBehavior";
				} catch(E5) {}
			}
			if(
				!_backend && (
					!!$.vakata.cookie('__vjstorage') ||
					($.vakata.cookie('__vjstorage', '{}', { 'expires' : 365 }) && $.vakata.cookie('__vjstorage') === '{}')
				)
			) {
				_storage_elm = null;
				_storage_service.jStorage = $.vakata.cookie('__vjstorage');
				_backend = "cookie";
			}

			if(!_backend) {
				_storage_elm = null;
				return;
			}
		}
		_load_storage();
		_handleTTL();
	}

	function _load_storage() {
		if(_storage_service.jStorage) {
			try {
				_storage = json_decode(String(_storage_service.jStorage));
			} catch(E6) { _storage_service.jStorage = "{}"; }
		} else {
			_storage_service.jStorage = "{}";
		}
		_storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;
	}

	function _save() {
		try {
			_storage_service.jStorage = json_encode(_storage);
			if(_backend === 'userDataBehavior') {
				_storage_elm.setAttribute("jStorage", _storage_service.jStorage);
				_storage_elm.save("jStorage");
			}
			if(_backend === 'cookie') {
				$.vakata.cookie('__vjstorage', _storage_service.jStorage, { 'expires' : 365 });
			}
			_storage_size = _storage_service.jStorage?String(_storage_service.jStorage).length:0;
		} catch(E7) { /* probably cache is full, nothing is saved this way*/ }
	}

	function _checkKey(key) {
		if(!key || (typeof key !== "string" && typeof key !== "number")){
			throw new TypeError('Key name must be string or numeric');
		}
		if(key === "__jstorage_meta") {
			throw new TypeError('Reserved key name');
		}
		return true;
	}

	function _handleTTL() {
		var curtime = +new Date(),
			i,
			TTL,
			nextExpire = Infinity,
			changed = false;

		if(_ttl_timeout !== false) {
			clearTimeout(_ttl_timeout);
		}
		if(!_storage.__jstorage_meta || typeof _storage.__jstorage_meta.TTL !== "object"){
			return;
		}
		TTL = _storage.__jstorage_meta.TTL;
		for(i in TTL) {
			if(TTL.hasOwnProperty(i)) {
				if(TTL[i] <= curtime) {
					delete TTL[i];
					delete _storage[i];
					changed = true;
				}
				else if(TTL[i] < nextExpire) {
					nextExpire = TTL[i];
				}
			}
		}

		// set next check
		if(nextExpire !== Infinity) {
			_ttl_timeout = setTimeout(_handleTTL, nextExpire - curtime);
		}
		// save changes
		if(changed) {
			_save();
		}
	}

	/*
		Variable: $.vakata.storage
		*object* holds all storage related functions and properties.
	*/
	$.vakata.storage = {
		/*
			Variable: $.vakata.storage.version
			*string* the version of jstorage used HEAVILY MODIFIED
		*/
		version: "0.3.0",
		/*
			Function: $.vakata.storage.set
			Set a key to a value

			Parameters:
				key - the key
				value - the value

			Returns:
				_value_
		*/
		set : function (key, value, ttl) {
			_checkKey(key);
			if(typeof value === "object") {
				value = json_decode(json_encode(value));
			}
			_storage[key] = value;
			_save();
			if(ttl && parseInt(ttl, 10)) {
				$.vakata.storage.setTTL(key, parseInt(ttl, 10));
			}
			return value;
		},
		/*
			Function: $.vakata.storage.get
			Get a value by key.

			Parameters:
				key - the key
				def - the value to return if _key_ is not found

			Returns:
				The found value, _def_ if key not found or _null_ if _def_ is not supplied.
		*/
		get : function (key, def) {
			_checkKey(key);
			if(key in _storage){
				return _storage[key];
			}
			return typeof(def) === 'undefined' ? null : def;
		},
		/*
			Function: $.vakata.storage.del
			Remove a key.

			Parameters:
				key - the key

			Returns:
				*boolean*
		*/
		del : function (key) {
			_checkKey(key);
			if(key in _storage) {
				delete _storage[key];

				if(_storage.__jstorage_meta && typeof _storage.__jstorage_meta.TTL === "object" && key in _storage.__jstorage_meta.TTL) {
					delete _storage.__jstorage_meta.TTL[key];
				}
				_save();
				return true;
			}
			return false;
		},

		setTTL: function(key, ttl){
			var curtime = +new Date();

			_checkKey(key);
			ttl = Number(ttl) || 0;
			if(key in _storage){
				if(!_storage.__jstorage_meta){
					_storage.__jstorage_meta = {};
				}
				if(!_storage.__jstorage_meta.TTL) {
					_storage.__jstorage_meta.TTL = {};
				}
				if(ttl > 0) {
					_storage.__jstorage_meta.TTL[key] = curtime + ttl;
				}
				else {
					delete _storage.__jstorage_meta.TTL[key];
				}
				_save();
				_handleTTL();
				return true;
			}
			return false;
		},
		getTTL: function(key){
			var curtime = +new Date(), ttl;
			_checkKey(key);
			if(key in _storage && _storage.__jstorage_meta.TTL && _storage.__jstorage_meta.TTL[key]) {
				ttl = _storage.__jstorage_meta.TTL[key] - curtime;
				return ttl || 0;
			}
			return 0;
		},

		/*
			Function: $.vakata.storage.flush
			Empty the storage.

			Returns:
				_true_
		*/
		flush : function(){
			_storage = {};
			_save();
			// try{ window.localStorage.clear(); } catch(E8) { }
			return true;
		},
		/*
			Function: $.vakata.storage.storageObj
			Get a read only copy of the whole storage.

			Returns:
				*object*
		*/
		storageObj : function(){
			return $.extend(true, {}, _storage);
		},
		/*
			Function: $.vakata.storage.index
			Get an array of all the set keys in the storage.

			Returns:
				*array*
		*/
		index : function(){
			var index = [], i;
			$.each(_storage, function (i, v) { if(i !== "__jstorage_meta") { index.push(i); } });
			return index;
		},
		/*
			Function: $.vakata.storage.storageSize
			Get the size of all items in the storage in bytes.

			Returns:
				*number*
		*/
		storageSize : function(){
			return _storage_size;
		},
		/*
			Function: $.vakata.storage.currentBackend
			Get the current backend used.

			Returns:
				*string*
		*/
		currentBackend : function(){
			return _backend;
		},
		/*
			Function: $.vakata.storage.storageAvailable
			See if storage functionality is available.

			Returns:
				*boolean*
		*/
		storageAvailable : function(){
			return !!_backend;
		}
	};
	_init();
})(jQuery);

/* File: jstree.unique.js
Does not allow the same name amongst siblings (still a bit experimental).
*/
/* Group: jstree drag'n'drop plugin */
(function ($) {
	$.jstree.plugins.unique = function (options, parent) {
		// TODO: think about an option to work with HTML or not?
		// TODO: add callback - to handle errors and for example types
		this.check = function (chk, obj, par, pos) {
			if(parent.check.call(this, chk, obj, par, pos) === false) { return false; }

			par = par === -1 ? this.element : par;
			var n = chk === "rename_node" ? $('<div />').html(pos).text() : this.get_text(obj, true),
				c = [],
				t = this;
			par.children('ul').children('li').each(function () { c.push(t.get_text(this, true)); });
			switch(chk) {
				case "delete_node":
					return true;
				case "rename_node":
				case "copy_node":
					return ($.inArray(n, c) === -1);
				case "move_node":
					return (par.children('ul').children('li').index(obj) !== -1 || $.inArray(n, c) === -1);
			}
			return true;
		};
	};

	// include the unique plugin by default
	$.jstree.defaults.plugins.push("unique");
})(jQuery);

/*
 * jsTree wholerow plugin
 * Makes select and hover work on the entire width of the node
 */
(function ($) {
	$.jstree.plugins.wholerow = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on('ready.jstree set_state.jstree', $.proxy(function () {
						this.hide_dots();
					}, this))
				.on("ready.jstree", $.proxy(function () {
						this.get_container_ul().addClass('jstree-wholerow-ul');
					}, this))
				.on("deselect_all.jstree", $.proxy(function (e, data) {
						this.element.find('.jstree-wholerow-clicked').removeClass('jstree-wholerow-clicked');
					}, this))
				.on("changed.jstree ", $.proxy(function (e, data) {
						this.element.find('.jstree-wholerow-clicked').removeClass('jstree-wholerow-clicked');
						data.selected.children('.jstree-wholerow').addClass('jstree-wholerow-clicked');
					}, this))
				.on("hover_node.jstree dehover_node.jstree", $.proxy(function (e, data) {
						this.element.find('.jstree-wholerow-hovered').removeClass('jstree-wholerow-hovered');
						if(e.type === "hover_node") {
							data.node.each(function () {
								$(this).children('.jstree-wholerow').addClass('jstree-wholerow-hovered');
							});
						}
					}, this))
				.on("contextmenu.jstree", ".jstree-wholerow", $.proxy(function (e) {
						if(typeof this._data.contextmenu !== 'undefined') {
							e.preventDefault();
							$(e.currentTarget).closest("li").children("a:eq(0)").trigger('contextmenu',e);
						}
					}, this))
				.on("click.jstree", ".jstree-wholerow", function (e) {
						e.stopImmediatePropagation();
						$(e.currentTarget).closest("li").children("a:eq(0)").trigger('click',e);
					})
				.on("click.jstree", ".jstree-leaf > .jstree-ocl", $.proxy(function (e) {
						e.stopImmediatePropagation();
						$(e.currentTarget).closest("li").children("a:eq(0)").trigger('click',e);
					}, this))
				.on("mouseover.jstree", "li", $.proxy(function (e) {
						e.stopImmediatePropagation();
						if($(e.currentTarget).closest('li').children(".jstree-hovered, .jstree-clicked").length) {
							return false;
						}
						this.hover_node(e.currentTarget);
						return false;
					}, this))
				.on("mouseleave.jstree", "li", $.proxy(function (e) {
						this.dehover_node(e.currentTarget);
					}, this));
		};
		this.teardown = function () {
			this.element.find(".jstree-wholerow").remove();
			parent.teardown.call(this);
		},
		this.clean_node = function(obj) {
			obj = parent.clean_node.call(this, obj);
			var t = this;
			return obj.each(function () {
				var o = $(this);
				if(!o.find("> .jstree-wholerow").length) {
					o.prepend("<div class='jstree-wholerow' style='position:absolute; height:"+t._data.core.li_height+"px;' unselectable='on'>&#160;</div>");
				}
			});
		};
	};

	$(function () {
		var css_string = '' +
				'.jstree .jstree-wholerow-ul { position:relative; display:inline-block; min-width:100%; }' +
				'.jstree-wholerow-ul li > a, .jstree-wholerow-ul li > i { position:relative; }' +
				'.jstree-wholerow-ul .jstree-wholerow { width:100%; cursor:pointer; position:absolute; left:0; user-select:none;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; }';
		if(!$.jstree.no_css) {
			$('head').append('<style type="text/css">' + css_string + '</style>');
		}
	});

	// include the wholerow plugin by default
	// $.jstree.defaults.plugins.push("wholerow");
})(jQuery);

/* File: jstree.xml.js
This plugin makes it possible for jstree to use XML data sources.
*/
/* Group: jstree xml plugin */
/*global ActiveXObject, XSLTProcessor */
(function ($) {
	var xsl = {
		'nest' : '' +
			'<' + '?xml version="1.0" encoding="utf-8" ?>' +
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' +
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/html" />' +
			'<xsl:template match="/">' +
			'	<xsl:call-template name="nodes">' +
			'		<xsl:with-param name="node" select="/root" />' +
			'	</xsl:call-template>' +
			'</xsl:template>' +
			'<xsl:template name="nodes">' +
			'	<xsl:param name="node" />' +
			'	<ul>' +
			'	<xsl:for-each select="$node/item">' +
			'		<xsl:variable name="children" select="count(./item) &gt; 0" />' +
			'		<li>' +
			'			<xsl:for-each select="@*"><xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute></xsl:for-each>' +
			'			<a>' +
			'				<xsl:for-each select="./content/@*"><xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute></xsl:for-each>' +
			'				<xsl:copy-of select="./content/child::node()" />' +
			'			</a>' +
			'			<xsl:if test="$children"><xsl:call-template name="nodes"><xsl:with-param name="node" select="current()" /></xsl:call-template></xsl:if>' +
			'		</li>' +
			'	</xsl:for-each>' +
			'	</ul>' +
			'</xsl:template>' +
			'</xsl:stylesheet>',
		'flat' : '' +
			'<' + '?xml version="1.0" encoding="utf-8" ?>' +
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' +
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/xml" />' +
			'<xsl:template match="/">' +
			'	<ul>' +
			'	<xsl:for-each select="//item[not(@parent_id) or @parent_id=0 or not(@parent_id = //item/@id)]">' + /* the last `or` may be removed */
			'		<xsl:call-template name="nodes">' +
			'			<xsl:with-param name="node" select="." />' +
			'		</xsl:call-template>' +
			'	</xsl:for-each>' +
			'	</ul>' +
			'</xsl:template>' +
			'<xsl:template name="nodes">' +
			'	<xsl:param name="node" />' +
			'	<xsl:variable name="children" select="count(//item[@parent_id=$node/attribute::id]) &gt; 0" />' +
			'	<li>' +
			'		<xsl:for-each select="@*">' +
			'			<xsl:if test="name() != \'parent_id\'">' +
			'				<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' +
			'			</xsl:if>' +
			'		</xsl:for-each>' +
			'		<a>' +
			'			<xsl:for-each select="./content/@*"><xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute></xsl:for-each>' +
			'			<xsl:copy-of select="./content/child::node()" />' +
			'		</a>' +
			'		<xsl:if test="$children">' +
			'		<ul>' +
			'			<xsl:for-each select="//item[@parent_id=$node/attribute::id]">' +
			'				<xsl:call-template name="nodes">' +
			'					<xsl:with-param name="node" select="." />' +
			'				</xsl:call-template>' +
			'			</xsl:for-each>' +
			'		</ul>' +
			'		</xsl:if>' +
			'	</li>' +
			'</xsl:template>' +
			'</xsl:stylesheet>'
	},
	escape_xml = function(string) {
		return string
			.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	};

	$.jstree.defaults.xml = {
		xsl		: "flat",
		data	: false,
		ajax	: false
	};

	$.jstree.plugins.xml = function (options, parent) {
		this._append_xml_data = function (dom, data) {
			data = $.vakata.xslt(data, xsl[this.settings.xml.xsl]);
			if(data === false) { return false; }
			data = $(data);
			dom = this.get_node(dom);
			if(!data || !data.length || !data.is('ul, li')) {
				if(dom && dom !== -1 && dom.is('li')) {
					dom.removeClass('jstree-closed').addClass('jstree-leaf').children('ul').remove();
				}
				return true;
			}
			if(dom === -1) { dom = this.element; }
			if(!dom.length) { return false; }
			if(!dom.children('ul').length) { dom.append('<ul />'); }
			dom.children('ul').empty().append(data.is('ul') ? data.children('li') : data);
			return true;
		};
		this._load_node = function (obj, callback) {
			var d = false,
				s = $.extend(true, {}, this.settings.xml);
			obj = this.get_node(obj);
			if(!obj) { return false; }
			switch(!0) {
				// no settings - use parent
				case (!s.data && !s.ajax):
					return parent._load_node.call(this, obj, callback);
				// data is function
				case ($.isFunction(s.data)):
					return s.data.call(this, obj, $.proxy(function (d) {
						return callback.call(this, this._append_xml_data(obj, d));
					}, this));
				// data is set, ajax is not set, or both are set, but we are dealing with root node
				case ((!!s.data && !s.ajax) || (!!s.data && !!s.ajax && obj === -1)):
					return callback.call(this, this._append_xml_data(obj, s.data));
				// data is not set, ajax is set, or both are set, but we are dealing with a normal node
				case ((!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj !== -1)):
					s.ajax.success = $.proxy(function (d, t, x) {
						var s = this.settings.xml.ajax;
						if($.isFunction(s.success)) {
							d = s.success.call(this, d, t, x) || d;
						}
						callback.call(this, this._append_xml_data(obj, d));
					}, this);
					s.ajax.error = $.proxy(function (x, t, e) {
						var s = this.settings.xml.ajax;
						if($.isFunction(s.error)) {
							s.error.call(this, x, t, e);
						}
						callback.call(this, false);
					}, this);
					if(!s.ajax.dataType) { s.ajax.dataType = "xml"; }
					if($.isFunction(s.ajax.url))	{ s.ajax.url	= s.ajax.url.call(this, obj); }
					if($.isFunction(s.ajax.data))	{ s.ajax.data	= s.ajax.data.call(this, obj); }
					return $.ajax(s.ajax);
			}
		};
		this.get_xml = function (mode, obj, is_callback) {
			var r = '';
			if(!mode) { mode = 'flat'; }
			if(typeof is_callback === 'undefined') {
				obj = this.get_json(obj);
				$.each(obj, $.proxy(function (i, v) {
					r += this.get_xml(mode, v, true);
				}, this));
				return '' +
					'<' + '?xml version="1.0" encoding="utf-8" ?>' +
					'<root>' + r + '</root>';
			}
			r += '<item';
			if(mode === 'flat' && is_callback !== true) {
				r += ' parent_id="' + escape_xml(is_callback) + '"';
			}
			if(obj.data && !$.isEmptyObject(obj.data)) {
				$.each(obj.data, function (i, v) {
					if(!$.isEmptyObject(v)) {
						r += ' data-' + i + '="' + escape_xml($.vakata.json.encode(v)) + '"';
					}
				});
			}
			$.each(obj.li_attr, function (i, v) {
				r += ' ' + i + '="' + escape_xml(v) + '"';
			});
			r += '>';
			r += '<content';
			$.each(obj.a_attr, function (i, v) {
				r += ' ' + i + '="' + escape_xml(v) + '"';
			});
			r += '><![CDATA[' + obj.title + ']]></content>';

			if(mode === 'flat') { r += '</item>'; }
			if(obj.children) {
				$.each(obj.children, $.proxy(function (i, v) {
					r += this.get_xml(mode, v, obj.li_attr && obj.li_attr.id ? obj.li_attr.id : true);
				}, this));
			}
			if(mode === 'nest') { r += '</item>'; }
			return r;
		};
	};

	// include the html plugin by default
	$.jstree.defaults.plugins.push("xml");

	// helpers
	$.vakata.xslt = function (xml, xsl) {
		var r = false, p, q, s, xm = $.parseXML(xml), xs = $.parseXML(xsl);

		// FF, Chrome, IE10
		if(typeof (XSLTProcessor) !== "undefined") {
			p = new XSLTProcessor();
			p.importStylesheet(xs);
			r = p.transformToFragment(xm, document);
			return $('<div />').append(r).html();
		}
		// OLD IE
		if(typeof (xm.transformNode) !== "undefined") {
			return xm.transformNode(xs);
		}
		// IE9, IE10
		if(window.ActiveXObject) {
			try {
				r = new ActiveXObject("Msxml2.XSLTemplate");
				q = new ActiveXObject("Msxml2.DOMDocument");
				q.loadXML(xml);
				s = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
				s.loadXML(xsl);
				r.stylesheet = s;
				p = r.createProcessor();
				p.input = q;
				p.transform();
				r = p.output;
			}
			catch (e) { }
		}
		return r;
	};
})(jQuery);