/* ===================================================
 * tagtacular.js v1.0.1
 * A jQuery plugin for tags management.
 *
 * http://gototech.com/tagtacular
 * Docs: https://github.com/burnsbert/tagtacular/wiki
 * ===================================================
 * This software is released under the MIT License.
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Eric Burns
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * See https://gototech.com/tagtacular for complete instructions. Requires jquery.js and jqueryui.js.
 * =================================================== */

;(function($){

	"use strict";

	$.fn.tagtacular = function(options) {

		var toplevel = this;
		var entityTags = [];
		var allTags = [];
		var mode = 'edit';
		var rememberTag = '';
		var flashCount = 0;
		var currentFailureMessage = '';
		var currentSuccessMessage = '';

		///////////////////////
		/// Core Functions ///
		/////////////////////

		var addTag = function(tag) {
			tag = settings.formatTagName($.trim(tag));
			var result = settings.validate(tag, settings);
			if (result === true) {
				if (!entityHasTag(tag)) {
					entityTags.push(tag);
					if (!tagInList(tag, allTags)) {
						allTags.push(tag);
						allTags = settings.sort(allTags);
					}
					if (settings.configSortTags) {
						entityTags = settings.sort(entityTags);
					}
					settings.commitAddTag(tag, settings.entityId, settings);
					drawTagList();
					drawEditTray(true);
					settings.messageAddTagSuccess && settings.flashSuccess(settings.messageAddTagSuccess);
				} else {
					settings.messageAddTagAlreadyExists && settings.flashFailure(settings.messageAddTagAlreadyExists);
				}
			} else {
				result && settings.flashFailure(result);
			}
			focusOnInput();
		}

	 	var drawEditTray = function(focus, initialText) {
	 		if (mode == 'edit') {
	 			drawEditTrayForEditMode(focus, initialText);
	 		} else if (mode == 'view') {
	 			drawEditTrayForViewMode();
	 		}

	 		// if we're redrawing the edit tray, re-fire the current flash message if there is one
	 		if (currentSuccessMessage.length > 0) {
	 			settings.flashSuccess(currentSuccessMessage);
	 		}
	 		if (currentFailureMessage.length > 0) {
	 			settings.flashFailure(currentFailureMessage);
	 		}

	 		settings.postDrawEditTray(mode);
	 	}

		var drawEditTrayForEditMode = function(focus, initialText) {
			initialText =  initialText || rememberTag || '';

			// Draw the DOM Elements

			if (!settings.configSelectBox) {
				var placeholderText = settings.configPlaceholderText ? ' placeholder="' + settings.configPlaceholderText + '"' : '';
				var html = '<input type="text" class="tagtacular_add_input"'+placeholderText+' value="'+initialText+'" />';
			} else {
				var html = '<select class="tagtacular_add_input">';
				var selectTags = getAutocompleteTags();
				html += '<option value=""></option>';
				$.each(selectTags, function(index, value) {
					html += '<option value="'+value+'">'+value+'</option>';
				});
				html += '</select>';
			}

			if (settings.configShowAddButton) {
				html += settings.getAddButtonHtml(settings);
			}
			if (settings.configShowSwitchButton) {
				html += settings.getSwitchButtonHtml(mode, settings);
			}
			if (settings.configRenderFlashMessageSpan) {
				html += '<span style="display: none;" class="tagtacular_flash"></span>';
			}
			toplevel.find('.tagtacular_edit_tray').html(html);

			// Add Button Bindings
			if (settings.configShowAddButton) {
				toplevel.find('.tagtacular_edit_tray .tagtacular_add_button').bind('click', function(e) {
					e.preventDefault();
					var tagText = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val();
					if (settings.configSelectBox && tagText.length < 1) {
						settings.messageEmptySelectBoxFailure && settings.flashFailure(settings.messageEmptySelectBoxFailure);
					} else {
						addTag(tagText);
					}
				});
			}

			// Switch Button Bindings
			if (settings.configShowSwitchButton) {
				toplevel.find('.tagtacular_edit_tray .tagtacular_switch_button').bind('click', function(e) {
					e.preventDefault();
					var tagText = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val();
					if (settings.configAddOnSwitch && tagText.length >= 1) {
						addTag(tagText);
					}
					rememberTag = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val();
					mode = 'view';
					drawTagList();
					drawEditTray(true);
					settings.postSwitchLayout(mode);
				});
			}

			// Add Tag Input Bindings
			toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').bind('keydown', function(e) {
				var tagText = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val();
				if ($.inArray(e.which, settings.configDeleteLastOnEmptyKeys) != -1 && tagText.length < 1) {
					e.preventDefault();
					e.stopPropagation();
					removeTag(entityTags[entityTags.length - 1]);
				}
			});
			toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').bind('keypress', function(e) {
				if ($.inArray(e.which, settings.configDelimiters) != -1) {
					e.preventDefault();
					e.stopPropagation();
					var tagText = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val();
					if (tagText.length > 0 && !inUnreadyState()) {
						addTag(tagText);
					}
				}
			});

			toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').bind('keyup', function(e) {
				if (inUnreadyState()) {
					toplevel.find('.tagtacular_add_button').attr('disabled', 'disabled');
					if (settings.configAddOnSwitch) {
						toplevel.find('.tagtacular_switch_button').attr('disabled', 'disabled');
					}
				} else {
					toplevel.find('.tagtacular_add_button').removeAttr('disabled');
					if (settings.configAddOnSwitch) {
						toplevel.find('.tagtacular_switch_button').removeAttr('disabled');
					}
				}
			});

			// Autocomplete Bindings
			if (!settings.configSelectBox && settings.configAutocomplete) {
				toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').autocomplete({
					source: getAutocompleteTags(),
					select: function(e, ui) {
						toplevel.find('.tagtacular_edit_tray .tagtacular_add_input').val('');
						addTag(ui.item.value);
					}
				});
			}

			if (focus) {
				focusOnInput();
			}
		}

		var drawEditTrayForViewMode = function() {
			var html = '';
			if (settings.configShowSwitchButton && settings.configAllowedToEdit) {
				html += settings.getSwitchButtonHtml(mode, settings);
			}
			if (settings.configRenderFlashMessageSpan) {
				html += '<span style="display: none;" class="tagtacular_flash"></span>';
			}

			toplevel.find('.tagtacular_edit_tray').html(html);

			if (settings.configShowSwitchButton && settings.configAllowedToEdit) {
				toplevel.find('.tagtacular_edit_tray .tagtacular_switch_button').bind('click', function(e) {
					e.preventDefault();
					mode = 'edit';
					drawTagList();
					drawEditTray(true);
					rememberTag = '';
					settings.postSwitchLayout(mode);
				});
			}
		}

		var drawLayout = function() {
			if (!settings.configAllowedToEdit) {
				mode = 'view';
			}
			toplevel.html(settings.getLayoutHtml(settings));
			drawTagList();
			drawEditTray(false);
		}

	 	var drawTagList = function() {
			entityTags = sortList(entityTags);

	 		if (mode == 'edit') {
	 			drawTagListForEditMode();
	 		} else if (mode == 'view') {
	 			drawTagListForViewMode();
	 		}
	 		settings.postDrawTagList(mode);
	 	}

		var drawTagListForEditMode = function() {
			var tags = [];
			$.each(entityTags, function(key, value) {
				tags.push(settings.getTagHtml(value, mode, settings));
			});
			var html = tags.join('');
			toplevel.find('.tagtacular_tag_tray').html(html);
			toplevel.find('.tagtacular_tag_tray .tagtacular_tag').last().find('.tagtacular_delim').remove();

			toplevel.find('.tagtacular_tag_tray .tagtacular_delete').bind('click', function(e) {
				e.preventDefault();
				var tag = $(this).closest('.tagtacular_tag');
				var tagText = tag.find('.tagtacular_value').text();
				tag.remove()
				removeTag(tagText);
			});
		}

		var drawTagListForViewMode = function() {
			var tags = [];
			$.each(entityTags, function(key, value) {
				tags.push(settings.getTagHtml(value, mode, settings));
			});
			var html = tags.join('');
			toplevel.find('.tagtacular_tag_tray').html(html);
			toplevel.find('.tagtacular_tag_tray .tagtacular_tag').last().find('.tagtacular_delim').remove();
		}

		var entityHasTag = function(tag) {
			return tagInList(tag, entityTags);
		}

		var focusOnInput = function() {
			var input = toplevel.find('.tagtacular_edit_tray .tagtacular_add_input');
			var value = input.val();
			input.focus().val('').val(value);
		}

		var getAutocompleteTags = function() {
			if (settings.configAutocompletePrune) {
				return getRemainingTags();
			} else {
				return allTags;
			}
		}

		var getRemainingTags = function() {
			var diff = $.grep(allTags,function(val) {return $.inArray(val, entityTags) < 0});
			return diff;
		}

		var getState = function() {
			var state = $.extend({}, settings);
			state.entityTags = entityTags;
			state.systemTags = allTags;
			state.mode = mode;
			state.toplevel = toplevel;
			return state;
		}

		var inUnreadyState = function() {
			if (!settings.configLimitToExisting) {
				return false;
			}

			var editInput = toplevel.find('.tagtacular_add_input');
			if (editInput.length < 1) {
				return false;
			}

			var current = editInput.val();
			if (current.length == 0) {
				return false;
			}

			return !systemHasTag(current);
		}

		var removeDuplicates = function(list) {
			var result = [];
			$.each(list, function(index, val) {
				if ($.inArray(val, result) == -1) {
					result.push(val);
				}
			});
			return result;
		}

		var removeTag = function(tag) {
			entityTags = $.grep(entityTags, function(value) {
				if (settings.configCaseInsensitive) {
					return value.toUpperCase() != tag.toUpperCase();
				} else {
					return value != tag;
				}
			});
			settings.entityTags = entityTags;
			settings.commitRemoveTag(tag, settings.entityId, settings);
	 		drawTagList();
	 		drawEditTray(true, toplevel.find('.tagtacular_add_input').val());
			settings.messageRemoveTagSuccess && settings.flashSuccess(settings.messageRemoveTagSuccess, 'removeTag', tag);	 		
			focusOnInput();
	 	}

	 	var sortList = function(list) {
	 		if (settings.configSortTags) {
	 			list = settings.sort(list);
	 		}
	 		return list;
	 	}

		var systemHasTag = function(tag) {
			return tagInList(tag, allTags);
		}

		var tagInList = function(tag, list) {
			var match = $.grep(list, function(value) {
				if (settings.configCaseInsensitive) {
					return value.toUpperCase() == tag.toUpperCase();
				} else {
					return value == tag;
				}
			});
			return match.length > 0;
		}

		//////////////////////////
		/// Default Functions ///
		////////////////////////

		var caseInsensitiveSort = function(list) {
			list.sort(function(a,b) {
				var a = a.toLowerCase();
				var b = b.toLowerCase();
				if (a == b) {
					return 0;
				}
				if (a > b) {
					return 1;
				}
				return -1;
			});

			return list;	
		}

		var defaultFlashFailure = function(message) {
			currentFailureMessage = message;
			currentSuccessMessage = '';

			var flash = toplevel.find('.tagtacular_flash');
			flash.html(message);
			flash.addClass('tagtacular_failure');
			flash.removeClass('tagtacular_success');
			flash.show();

			// if the are several messages in a row, the last one should get its full allotment of time
			var expected = ++flashCount;

			if (settings.configFlashFailureHideAfter) {
				setTimeout(function() {
					if (flashCount == expected) {
						var flash = toplevel.find('.tagtacular_flash');
						currentFailureMessage = '';
						flash.fadeOut();
					}
				}, 1000 * settings.configFlashFailureHideAfter);
			}
		}

		var defaultFlashSuccess = function(message) {
			currentSuccessMessage = message;
			currentFailureMessage = '';

			var flash = toplevel.find('.tagtacular_flash')
			flash.html(message);
			flash.addClass('tagtacular_success');
			flash.removeClass('tagtacular_failure');
			flash.show();

			// if the are several messages in a row, the last one should get its full allotment of time
			var expected = ++flashCount;

			if (settings.configFlashSuccessHideAfter) {
				setTimeout(function() {
					if (flashCount == expected) {
						var flash = toplevel.find('.tagtacular_flash');
						currentSuccessMessage = '';
						flash.fadeOut();
					}
				}, 1000 * settings.configFlashSuccessHideAfter);

			}
		}

		var defaultGetAddButtonHtml = function(settings) {
			return '<button class="tagtacular_add_button">'+settings.configAddButtonText+'</button>';;
		}

		var defaultGetLayoutHtml = function(settings) {
			if (settings.configEditTrayFirst) {
				return '<div class="tagtacular_edit_tray"></div><div class="tagtacular_tag_tray"></div>';
			} else {
				return '<div class="tagtacular_tag_tray"></div><div class="tagtacular_edit_tray"></div>';
			}
		}

		var defaultGetSwitchButtonHtml = function(mode, settings) {
			var label = (mode == 'view') ? settings.configSwitchButtonTextInView : settings.configSwitchButtonTextInEdit;
			return '<button class="tagtacular_switch_button">'+label+'</button>';
		}

		var defaultGetTagHtml = function(tag, mode, settings) {
			if (mode=='edit') {
				return '<span class="tagtacular_tag tagtacular_tag_edit"><span class="tagtacular_value">'+tag+'</span>&nbsp;<a class="tagtacular_delete" href="#">'+settings.configDeleteSymbol+'</a><span class="tagtacular_delim">'+settings.configTagSeparator+'</span></span>';
			} else if (mode=='view') {
				return '<span class="tagtacular_tag tagtacular_tag_view"><span class="tagtacular_value">'+tag+'</span><span class="tagtacular_delim">'+settings.configTagSeparator+'</span></span>';
			}
		}

		var defaultValidate = function(tag, settings) {
			if (tag.length < settings.configMinimumTagLength) {
				return settings.messageTagTooShort;
			}
			if (tag.length > settings.configMaximumTagLength) {
				return settings.messageTagTooLong;
			}
			var pattern = settings.validationPattern;
			if (!pattern.test(tag)) {
				return settings.messageTagNameInvalid;
			}

			return true;
		}

		var doNothing = function(param) {
			// do nothing
			return param;
		}

		///////////////////////////////////
		/// Setting and Initialization ///
		/////////////////////////////////

		var settings = {
			commitAddTag:                  doNothing,
			commitRemoveTag:               doNothing,
			configAddOnSwitch:             true,
			configAddButtonText:           'Add',
			configAllowedToEdit:           true,
			configAutocomplete:            true,
			configAutocompletePrune:       true,
			configCaseInsensitive:         true,
			configDeleteSymbol:            'X',
			configDeleteLastOnEmptyKeys:   [],
			configDelimiters:              [13,44],
			configEditTrayFirst:           false,
			configFlashFailureHideAfter:   5,
			configFlashSuccessHideAfter:   5,
			configFormatTagNamesOnInit:    false,
			configLimitToExisting:         false,
			configMinimumTagLength:        1,
			configMaximumTagLength:        32,
			configPlaceholderText:         false,
			configRenderFlashMessageSpan:  true,
			configSelectBox:               false,
			configShowAddButton:           true,
			configShowSwitchButton:        true,
			configSortTags:                true,
			configSwitchButtonTextInEdit:  'Done',
			configSwitchButtonTextInView:  'Edit',
			configTagSeparator:            '',
			entityId:                      null,
			entityType:                    null,
			entityTags:                    [],
			getAddButtonHtml:              defaultGetAddButtonHtml, 
			getLayoutHtml:                 defaultGetLayoutHtml,
			getSwitchButtonHtml:           defaultGetSwitchButtonHtml, 
			getTagHtml:                    defaultGetTagHtml,
			flashFailure:                  defaultFlashFailure,
			flashSuccess:                  defaultFlashSuccess,
			formatTagName:                 doNothing,
			messageAddTagSuccess:          'tag added',
			messageAddTagAlreadyExists:    'tag is already assigned',
			messageEmptySelectBoxFailure:  'you must select a tag before adding it',
			messageRemoveTagSuccess:       'tag removed',
			messageTagNameInvalid:         'invalid tag name: tag names can only include letters, numbers, underscores, hyphens, and spaces',
			messageTagTooLong:             'tag name too long, maximum length of [configMaximumTagLength]',
			messageTagTooShort:            'tag name too short, minimum length of [configMinimumTagLength]',
			mode:                          'edit',
			postDrawEditTray:              doNothing,
			postDrawTagList:               doNothing,
			postSwitchLayout:              doNothing,
			sort:                          caseInsensitiveSort,
			systemTags:                    [],
			validate:                      defaultValidate,
			validationPattern:             /^[0-9A-Za-z_\- ]+$/
		};

		// initialization function
		var tagtacular = function(options) {
			options = options || {};
			$.each(options, function(key, value) {
				settings[key] = value;
			});

			settings.messageTagTooLong = settings.messageTagTooLong.replace('[configMaximumTagLength]', settings.configMaximumTagLength);
			settings.messageTagTooShort = settings.messageTagTooShort.replace('[configMinimumTagLength]', settings.configMinimumTagLength);

			entityTags = sortList(settings.entityTags);

			allTags = settings.systemTags.concat(entityTags);
			allTags = settings.sort(removeDuplicates(allTags));

			if (settings.configFormatTagNamesOnInit) {
				entityTags = $.map(entityTags, function(value, index) {
					return settings.formatTagName(value);
				});
				allTags = $.map(allTags, function(value, index) {
					return settings.formatTagName(value);
				});
			}

			mode = settings.mode;
			settings.toplevel = toplevel;
			
			drawLayout();
			return toplevel;
		}

		$.extend(toplevel, {'addTag': addTag});
		$.extend(toplevel, {'flashFailure': settings.flashFailure});
		$.extend(toplevel, {'flashSuccess': settings.flashSuccess});
		$.extend(toplevel, {'getEntityId': function() {
			return settings.entityId;
		}});
		$.extend(toplevel, {'getEntityType': function() {
			return settings.entityType;
		}});
		$.extend(toplevel, {'getEntityTags': function() { 
			return entityTags; 
		}});
		$.extend(toplevel, {'getRemainingTags': getRemainingTags});
		$.extend(toplevel, {'getState': getState});
		$.extend(toplevel, {'getSystemTags': function() { 
			return allTags; 
		}});
		$.extend(toplevel, {'removeTag': removeTag});
		$.extend(toplevel, {'tagtacular': tagtacular});

		return tagtacular(options);
	}

})(jQuery);
