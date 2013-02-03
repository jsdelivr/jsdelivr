/* wordcontenthandler.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
 */
define(
['aloha', 'jquery', 'aloha/contenthandlermanager'],
function( Aloha, jQuery, ContentHandlerManager ) {
	

	var WordContentHandler = ContentHandlerManager.createHandler({
		/**
		 * Handle the pasting. Try to detect content pasted from word and transform to clean html
		 * @param content
		 */
		handleContent: function( content ) {

			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' );
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content);
			}

			if (this.detectWordContent(content)) {
				this.transformWordContent(content);
			}

			return content.html();
		},

		/**
		 * Check whether the content of the given jQuery object is assumed to be pasted from word.
		 * @param content
		 * @return true for content pasted from word, false for other content
		 */
		detectWordContent: function (content) {
			var wordDetected = false;
			// check every element which was pasted.

			content.find('*').each(function() {
				// get the element style
				var style = jQuery(this).attr('style'),
					clazz;

				if (style) {
					// if 'mso' is found somewhere in the style, we found word content
					if (style.toLowerCase().indexOf('mso') >= 0) {
						wordDetected = true;
						return false;
					}
				}
				// get the element class
				clazz = jQuery(this).attr('class');
				if (clazz) {
					// if 'mso' is found somewhere in the class, we found word content
					if (clazz.toLowerCase().indexOf('mso') >= 0) {
						wordDetected = true;
						return false;
					}
				}
			});
			// return the result
			return wordDetected;
		},

		/**
		 * Check whether the given list span (first span in a paragraph which shall be a list item) belongs to an ordered list
		 * @param listSpan
		 * @return true for ordered lists, false for unordered
		 */
		isOrderedList: function(listSpan) {
			// when the span has fontFamily "Wingdings" it is an unordered list
			if (listSpan.css('fontFamily') == 'Wingdings' || listSpan.css('fontFamily') == 'Symbol') {
				return false;
			}
			// otherwise check for a number, letter or '(' as first character
			return listSpan.text().match(/^([0-9]{1,3}\.)|([0-9]{1,3}\)|([a-zA-Z]{1,5}\.)|([a-zA-Z]{1,5}\)))$/) ? true : false;
		},

		/**
		 * Transform lists pasted from word
		 * @param content
		 */
		transformListsFromWord: function (content) {
			var that = this,
				negateDetectionFilter, detectionFilter, spans,
				paragraphs, bulletClass, listElementClass;

			// this will be the class to mark paragraphs that will be transformed to lists
			listElementClass = 'aloha-list-element';
			bulletClass = 'aloha-list-bullet';

			// first step is to find all paragraphs which will be converted into list elements and mark them by adding the class 'aloha-list-element'
			detectionFilter = 'p.MsoListParagraphCxSpFirst,p.MsoListParagraph,p span';
			paragraphs = content.find(detectionFilter);
			paragraphs.each(function() {
				var jqElem = jQuery(this),
					fontFamily = jqElem.css('font-family') || '',
					msoList = jqElem.css('mso-list') || '',
					style = jqElem.attr('style') || '';

				// detect special classes
				if (jqElem.hasClass('MsoListParagraphCxSpFirst') || jqElem.hasClass('MsoListParagraph')) {
					jqElem.addClass(listElementClass);
				} else if (fontFamily.indexOf('Symbol') >= 0) {
					jqElem.closest('p').addClass(listElementClass);
				} else if (fontFamily.indexOf('Wingdings') >= 0) {
					jqElem.closest('p').addClass(listElementClass);
				} else if (msoList !== '') {
					jqElem.closest('p').addClass(listElementClass);
				} else if (style.indexOf('mso-list') >= 0) {
					jqElem.closest('p').addClass(listElementClass);
				}
			});

			// now we search for paragraphs with three levels of nested spans, where the innermost span contains nothing but &nbsp;
			detectionFilter = 'p span span span';
			spans = content.find(detectionFilter);
			spans.each(function() {
				var jqElem = jQuery(this),
				    innerText = jQuery.trim(jqElem.text()).replace(/&nbsp;/g, ''),
					outerText;
				
				if (innerText.length === 0) {
					// check whether the outermost of the three spans contains nothing more than numbering
					outerText = jQuery.trim(jqElem.parent().parent().text()).replace(/&nbsp;/g, '');

					// patterns for list numbering
					// 1.
					// 1)
					// (1)
					// a.
					// a)
					// I.
					// i.
					// o § (or any other single character)
					if (outerText.match(/^([0-9]{1,3}\.)|([0-9]{1,3}\))|([a-zA-Z]{1,5}\.)|([a-zA-Z]{1,5}\))|(.)$/)) {
						jqElem.closest('p').addClass(listElementClass);
						jqElem.parent().parent().addClass(bulletClass);
					}
				}
			});

			// no detect all marked paragraphs and transform into lists
			detectionFilter = 'p.' + listElementClass;
			negateDetectionFilter = ':not('+detectionFilter+')';
			paragraphs = content.find(detectionFilter);

			if (paragraphs.length > 0) {
				paragraphs.each(function() {
					var jqElem = jQuery(this),
						jqNewLi, jqList, ordered, firstSpan, following, lists, margin, nestLevel;

					jqElem.removeClass(listElementClass);
					// first remove all font tags
					jqElem.find('font').each(function() {
						jQuery(this).contents().unwrap();
					});

					// initialize the nestlevel and the margin (we will try to detect nested
					// lists by comparing the left margin)
					nestLevel = [];
					margin = parseFloat(jqElem.css('marginLeft'));
					// this array will hold all ul/ol elements
					lists = [];
					// get all following list elements
					following = jqElem.nextUntil(negateDetectionFilter);

					// get the first span in the element
					firstSpan = jQuery(jqElem.find('span.' + bulletClass));
					if (firstSpan.length === 0) {
						firstSpan = jqElem.find('span').eq(0);
					}
					// use the span to detect whether the list shall be ordered or unordered
					ordered = that.isOrderedList(firstSpan);
					// finally remove the span (numbers, bullets are rendered by the browser)
					firstSpan.remove();

					// create the list element
					jqList = jQuery(ordered ? '<ol></ol>' : '<ul></ul>');
					lists.push(jqList);

					// add a new list item
					jqNewLi = jQuery('<li></li>');
					// add the li into the list
					jqList.append(jqNewLi);
					// append the contents of the old dom element to the li
					jqElem.contents().appendTo(jqNewLi);
					// replace the old dom element with the new list
					jqElem.replaceWith(jqList);

					// now proceed all following list elements
					following.each(function() {
						var jqElem = jQuery(this),
							newMargin, jqNewList;

						// remove all font tags
						jqElem.find('font').each(function() {
							jQuery(this).contents().unwrap();
						});
						// check the new margin
						newMargin = parseFloat(jqElem.css('marginLeft'));

						// get the first span
						firstSpan = jQuery(jqElem.find('span.' + bulletClass));
						if (firstSpan.length === 0) {
							firstSpan = jqElem.find('span').eq(0);
						}
						// ... and use it to detect ordered/unordered list elements (this
						// information will only be used at the start of a new list anyway)
						ordered = that.isOrderedList(firstSpan);
						// remove the span
						firstSpan.remove();

						// check for nested lists by comparing the margins
						if (newMargin > margin) {
							// create a new list
							jqNewList = jQuery(ordered ? '<ol></ol>' : '<ul></ul>');
							// append the new list to the last list item of the prior list
							jqList.children(':last').append(jqNewList);

							// store the list and increase the nest level
							jqList = jqNewList;
							lists.push(jqList);
							nestLevel.push(newMargin);
							margin = newMargin;
						} else if (newMargin < margin && nestLevel.length > 0) {
							while(nestLevel.length > 0 && nestLevel[nestLevel.length - 1] > newMargin) {
								nestLevel.pop();
								lists.pop();
							}
							// end nested list and append element to outer list
							jqList = lists[lists.length - 1];
							margin = newMargin;
						}

						// create a list item
						jqNewLi = jQuery('<li></li>');
						// add the li into the list
						jqList.append(jqNewLi);
						// append the contents of the old dom element to the li
						jqElem.contents().appendTo(jqNewLi);
						// remove the old dom element
						jqElem.remove();
					});
				});
			}
		},

		/**
		 * Transform Title and Subtitle pasted from word
		 * @param content
		 */
		transformTitles: function(content) {
			content.find('p.MsoTitle').each(function() {
				// titles will be transformed to h1
				Aloha.Markup.transformDomObject(jQuery(this), 'h1');
			});
			content.find('p.MsoSubtitle').each(function() {
				// sub titles will be transformed to h2
				Aloha.Markup.transformDomObject(jQuery(this), 'h2');
			});
		},
		
		/**
		 * Cleanup MS Word HTML
		 * @param content
		 */
		cleanHtml: function ( content ) {
			
			// unwrap empty tags
			// do not remove them here because of eg. spaces wrapped in spans which are needed
			content.find('*').filter( function() {
				return jQuery.trim(jQuery(this).text()) == '';
			}).contents().unwrap();
			
			// unwrap all spans
			content.find('span').contents().unwrap();
			
			// when href starts with #, it's the link to an anchor. remove it.
			content.find('a').each(function() {
				if ( jQuery(this).attr('href') && jQuery.trim(jQuery(this).attr('href')).match(/^#(.*)$/) ) {
					jQuery(this).contents().unwrap();
				}
			});
			
			// eg. footnotes are wrapped in divs. unwrap them.
			content.find('div').contents().unwrap();
			
			// remove empty tags
			content.find('*').filter( function() {
			    return jQuery.trim(jQuery(this).text()) == '';
			}).remove();
			
		},
		
		/**
		 * Remove paragraph numbering from TOC feature
		 * @param content
		*/
		removeParagraphNumbering: function( content ) {
			var detectionFilter = 'h1,h2,h3,h4,h5,h6',
				paragraphs = content.find(detectionFilter);
			
			if (paragraphs.length > 0) {
				paragraphs.each(function() {
					var jqElem = jQuery(this),
						spans = jqElem.find('span'),
						links = jqElem.find('a');
				
					// remove TOC numbering
					spans.each(function() {
						if ( jQuery.trim(jQuery(this).text()).match(/^([\.\(]?[\d\D][\.\(]?){1,4}$/) ) {
							jQuery(this).remove();
						}
					})
				
					// remove TOC anchor links
					links.each(function() {
						// no href, so it's an anchor
						if ( typeof jQuery(this).attr('href') === 'undefined' ) {
							jQuery(this).contents().unwrap();
						}
					});
				
				});
			}
		},

		
		/**
		 * Transform TOC
		 * @param content
		*/
		transformToc: function( content ) {
			var detectionFilter = '[class*=MsoToc]',
				paragraphs = content.find(detectionFilter);

			paragraphs.each(function() {
				var jqElem = jQuery(this),
					spans = jqElem.find('span'),
					links = jqElem.find('a');

				// a table of contents entry looks like
				// 1. Title text ... 5
				// we get rid of the "... 5" part which repesents the page number
				spans.each(function() {
					if ( jQuery(this).attr('style') && jQuery(this).attr('style').search('mso-hide') > -1 ) {
						jQuery(this).remove();
					}
					jQuery(this).contents().unwrap();
				});

				// remove the anchor link of the toc item
				links.each(function() {
					jQuery(this).contents().unwrap();
				});
			});
		},

		/**
		 * This is the main transformation method
		 * @param content
		 */
		transformWordContent: function( content ) {
			// transform table of contents
			this.transformToc( content );

			// remove paragraph numbering
			this.removeParagraphNumbering( content );

			// transform lists
			this.transformListsFromWord( content );

			// transform titles
			this.transformTitles( content );

			// clean html
			this.cleanHtml( content );
		}
	});
	
	return WordContentHandler;
});