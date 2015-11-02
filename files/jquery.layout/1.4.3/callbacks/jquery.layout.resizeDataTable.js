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
;(function ($) {
	$.layout.callbacks.resizeDataTables = function (x, ui) {
		// may be called EITHER from layout-pane.onresize OR tabs.show
		var oPane = ui.jquery ? ui[0] : ui.panel;
		// cannot resize if the pane is currently closed or hidden
		if ( !$(oPane).is(":visible") ) return;
		// find all data tables inside this pane and resize them
		$( $.fn.dataTable.fnTables(true) ).each(function (i, table) {
			if ($.contains( oPane, table )) {
				$(table).dataTable().fnAdjustColumnSizing();
			}
		});
	};
})( jQuery );