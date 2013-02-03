/**
 * The context module provides functions to get at the context element
 * for widgets.
 *
 * Many widgets are created dynamically and append themselves to the
 * body so that they can be shown to the user. The context element is
 * just a div appended to the body, that provides a common parent for
 * these widget elements.
 * 
 * Appending widget elements to the context element provides two benefits:
 * 1 - it would be cleaner for all aloha-specific elements to be
 *     appended to one common parent.
 * 2 - all css rules should have a .aloha context class, and the common
 *     parent provides this class.
 */
define([
	'aloha',
	'jquery',
	'util/class'
], function(
	Aloha,
	$,
	Class
) {
	

	var id = 'aloha-ui-context',
	    selector = '#' + id,
	    element;

	// There is just a single context element in the page
	element = $(selector);
	if (!element.length) {
		element = $('<div>', {'class': 'aloha', 'id': id});
		// In the built aloha.js, init will happend before the body has
		// finished loading, so we have to defer appending the element.
		$(function(){ element.appendTo('body'); });
	}

	var Context =  Class.extend({
		surfaces: [],
		containers: []
	});

	// static fields

	$.extend(Context, {
		selector: selector,
		element: element
	});

	return Context;
});
