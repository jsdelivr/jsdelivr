/**
*	UI Layout Callback: resizeDataTables
*
*	DataTables plugin homepage: http://datatables.net
*
*	This callback is used when a layout-pane contains 1 or more DataTable objects:
*	- when the DataTable is a 'child' of the pane; or
*	- when the DataTable is a 'descendant' of the pane - ie, inside other elements
*
*	Assign this callback to the pane.onresize event.
*	If the layout is inside a tab-panel, _also_ bind to tabs.show()
*
*	SAMPLE:
*	$("#elem").tabs({ show: $.layout.callbacks.resizeDataTables });
*	$("body").layout({ center__onresize: $.layout.callbacks.resizeDataTables });
*
*	Version:	1.0 - 2012-07-06
*	Author:		Robert Brower (atomofthought@yahoo.com)
*	@preserve	jquery.layout.resizeDataTables-1.0.js
*/
(function(a){a.layout.callbacks.resizeDataTables=function(e,b){var c=b.jquery?b[0]:b.panel;a(c).is(":visible")&&a(a.fn.dataTable.fnTables(!0)).each(function(b,d){a.contains(c,d)&&a(d).dataTable().fnAdjustColumnSizing()})}})(jQuery);