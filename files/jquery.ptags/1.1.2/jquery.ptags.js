/*
 * jQuery Pines Tags (ptags) Plugin 1.1.2
 *
 * http://pinesframework.org/ptags/
 * Copyright (c) 2009-2012 Hunter Perrin
 *
 * Triple license under the GPL, LGPL, and MPL:
 *	  http://www.gnu.org/licenses/gpl.html
 *	  http://www.gnu.org/licenses/lgpl.html
 *	  http://www.mozilla.org/MPL/MPL-1.1.html
 */

(function($) {
	$.fn.ptags_add = function(textorarray){
		if (!textorarray)
			return this;
		this.each(function(){
			if (!this.pines_tags)
				return;
			this.pines_tags.ptags_add(textorarray);
		});
		return this;
	};
	$.fn.ptags_remove = function(textorarray){
		if (!textorarray)
			return this;
		this.each(function(){
			if (!this.pines_tags)
				return;
			this.pines_tags.ptags_remove(textorarray);
		});
		return this;
	};
	$.fn.ptags_remove_all = function(){
		this.each(function(){
			if (!this.pines_tags)
				return;
			this.pines_tags.ptags_remove_all();
		});
		return this;
	};
	// Wrap the val() function to check for changes to the original input.
	var _val = $.fn.val;
	$.fn.val = function(value){
		var ret_val = _val.apply(this, arguments);
		if (typeof value != "undefined") {
			this.each(function(){
				if (typeof this.pines_tags != "undefined")
					this.pines_tags.ptags_sync_input();
			});
		}
		return ret_val;
	};

	$.fn.ptags = function(options) {
		// Build main options before element iteration.
		var opts = $.extend({}, $.fn.ptags.defaults, options);

		// Iterate and transform each matched element.
		var all_elements = this;
		all_elements.each(function() {
			var ptags = $(this);
			ptags.ptags_version = "1.1.2";
			
			// Check for the ptags class. If it has it, we've already transformed this element.
			if (ptags.hasClass("ui-ptags-tag-box")) return true;
			// Add the ptags class.
			ptags.addClass("ui-ptags-tag-box");
			
			ptags.extend(ptags, opts);

			ptags.ptags_widget = $("<span />");
			ptags.ptags_container = $("<span />");

			// All arrays and objects in our options need to be copied,
			// since they just have a pointer to the defaults if we don't.
			ptags.ptags_tags = ptags.ptags_tags.slice();

			ptags.ptags_add = function(textorarray){
				$.merge(ptags.ptags_tags, (typeof textorarray == "string" ? [textorarray] : textorarray));
				ptags.ptags_unique_check();
				ptags.ptags_update_val();
				ptags.ptags_update_tags();
			};

			ptags.ptags_remove = function(textorarray){
				$.each((typeof textorarray == "string" ? [textorarray] : textorarray), function(){
					var i = $.inArray(""+this, ptags.ptags_tags);
					if (i > -1)
						ptags.ptags_tags.splice(i, 1);
				});
				ptags.ptags_update_val();
				ptags.ptags_update_tags();
			};

			ptags.ptags_remove_all = function(){
				ptags.ptags_tags = [];
				ptags.ptags_update_val();
				ptags.ptags_update_tags();
			};

			ptags.ptags_unique_check = function(){
				for (var i = 0; i < ptags.ptags_tags.length; i++) {
					if (ptags.ptags_trim_tags)
						ptags.ptags_tags[i] = $.trim(ptags.ptags_tags[i]);
					if ($.inArray(ptags.ptags_tags[i], ptags.ptags_tags) < i || ptags.ptags_tags[i].length == 0) {
						ptags.ptags_tags.splice(i, 1);
						i--;
					}
				}
			};

			ptags.ptags_update_val = function(){
				var oldval = ptags.val();
				var newval = ptags.ptags_tags.join(ptags.ptags_delimiter);
				if (oldval != newval)
					ptags.val(newval).change();
			};

			ptags.ptags_sync_input = function(){
				var oldval = ptags.ptags_tags.join(ptags.ptags_delimiter);
				var newval = ptags.val();
				if (newval == oldval)
					return;

				ptags.ptags_tags = newval.split(ptags.ptags_delimiter);
				ptags.ptags_unique_check();
				ptags.ptags_update_val();
				ptags.ptags_update_tags();
			};

			ptags.ptags_update_tags = function(){
				if (!ptags.ptags_show_tags) return;
				ptags.ptags_tag_container.empty();
				$.each(ptags.ptags_tags, function(i, val){
					var tag_box = $("<span />").addClass("ui-state-default ui-corner-all ui-ptags-tag");
					tag_box.append($("<a href=\"#\" />").addClass("ui-ptags-tag-text").html(val).click(function(){
						if (ptags.ptags_editable && ptags.ptags_input_box) {
							if (ptags.ptags_noclick) {
								ptags.ptags_noclick = false;
								tag_box.removeClass("ui-state-hover");
								return false;
							}
							input_box.val(tag_box.text()).focus().select();
							ptags.ptags_remove(tag_box.text());
						}
						return false;
					}));
					if (ptags.ptags_editable && ptags.ptags_input_box) {
						tag_box.hover(function(){
							$(this).addClass("ui-state-hover");
						}, function(){
							$(this).removeClass("ui-state-hover");
						});
					}
					if (ptags.ptags_remover) {
						tag_box.children().addClass("ui-ptags-tag-text-icon").end()
						.append($("<a href=\"#\" />").addClass("ui-ptags-tag-remover ui-icon ui-icon-circle-minus").click(function(){
							ptags.ptags_remove(tag_box.text());
							return false;
						}));
					}
					ptags.ptags_tag_container.append(tag_box);
				});
			};

			ptags.ptags_widget.addClass("ui-ptags");
			ptags.wrapAll(ptags.ptags_widget);
			// Update the widget.
			ptags.ptags_widget = ptags.parent();

			ptags.ptags_container.addClass("ui-ptags-tag-box-container");
			ptags.wrapAll(ptags.ptags_container);
			// Update the container.
			ptags.ptags_container = ptags.parent();
			
			if (ptags.ptags_input_box) {
				var input_box = $(ptags.get(0)).clone().val("").keydown(function(e){
					if (e.keyCode == 13 && !e.shiftKey) {
						ptags.ptags_add(input_box.val().split(ptags.ptags_delimiter));
						input_box.val("");
						return false;
					}
				}).blur(function(){
					if (input_box.val() != "") {
						ptags.ptags_add(input_box.val().split(ptags.ptags_delimiter));
						input_box.val("");
					}
				});
				if (input_box.attr("id"))
					input_box.attr("id", input_box.attr("id") + "__ptags");
				if (input_box.attr("name"))
					input_box.attr("name", input_box.attr("name") + "__ptags");
				ptags.ptags_container.append(input_box);
			}

			if (ptags.ptags_current_text) {
				var tmp_tags_arr = ptags.val().split(ptags.ptags_delimiter);
				$.merge(ptags.ptags_tags, tmp_tags_arr);
				ptags.ptags_unique_check();
				ptags.ptags_update_val();
			}

			if (ptags.ptags_show_tags) {
				ptags.ptags_tag_container = $("<span />").addClass("ui-ptags-tag-container");
				ptags.ptags_widget.append(ptags.ptags_tag_container);
				ptags.ptags_update_tags();
			}

			ptags.change(ptags.ptags_sync_input);

			if (ptags.ptags_sortable != false) {
				ptags.ptags_tag_container
				.sortable(ptags.ptags_sortable)
				.bind("sortupdate", function(){
					ptags.ptags_tags = $.map(ptags.ptags_tag_container.find("a.ui-ptags-tag-text"), function(elem){
						return $(elem).text();
					});
					ptags.ptags_update_val();
				})
				.bind("sortstop", function(){
					ptags.ptags_noclick = true;
				});
			}

			if (!ptags.ptags_show_box)
				ptags.css("display", "none");

			// Save the ptags object in the DOM, so we can access it.
			this.pines_tags = ptags;
		});

		return all_elements;
	};

	$.fn.ptags.defaults = {
		// The default tags.
		ptags_tags: [],
		// Add the current text of the tag box to the tags array.
		ptags_current_text: true,
		// The delimiter between tags.
		ptags_delimiter: ",",
		// Trim whitespace from tags.
		ptags_trim_tags: true,
		// Show tags after the box for easier editing.
		ptags_show_tags: true,
		// Show the tag box. (Not necessary if you show tags.)
		ptags_show_box: false,
		// Provide an input box to let the user add tags. (Clones the original box's styling.)
		ptags_input_box: true,
		// Provide a remover button on each tag.
		ptags_remover: true,
		// Let the user click tags to edit them. (Requires the input box.)
		ptags_editable: true,
		// Let the user sort tags. Requires jQuery UI Sortable. Should be null for default, or an object which is passed to .sortable().
		ptags_sortable: false
	};
})(jQuery);