/**
 *	UI Layout Callback: resizeTabLayout
 *
 *	Requires Layout 1.3.0.rc29.15 or later
 *
 *	This callback is used when a tab-panel is the container for a layout
 *	The tab-layout can be initialized either before or after the tabs are created
 *	Assign this callback to the tabs.show event:
 *	- if the layout HAS been fully initialized already, it will be resized
 *	- if the layout has NOT fully initialized, it will attempt to do so
 *		- if it cannot initialize, it will try again next time the tab is accessed
 *		- it also looks for ANY visible layout *inside* teh tab and resize/init it
 *
 *	SAMPLE:
 *	< jQuery UI 1.9: $("#elem").tabs({ show: $.layout.callbacks.resizeTabLayout });
 *	> jQuery UI 1.9: $("#elem").tabs({ activate: $.layout.callbacks.resizeTabLayout });
 *	$("body").layout({ center__onresize: $.layout.callbacks.resizeTabLayout });
 *
 *	Version:	1.3 - 2013-01-12
 *	Author:		Kevin Dalman (kevin@jquery-dev.com)
 */
;(function ($) {
var _ = $.layout;

// make sure the callbacks branch exists
if (!_.callbacks) _.callbacks = {};

// this callback is bound to the tabs.show event OR to layout-pane.onresize event
_.callbacks.resizeTabLayout = function (x, ui) {
	// may be called EITHER from layout-pane.onresize OR tabs.show/activate
	var $P = ui.jquery ? ui : $(ui.newPanel || ui.panel);
	// find all VISIBLE layouts inside this pane/panel and resize them
	$P.filter(":visible").find(".ui-layout-container:visible").andSelf().each(function(){
		var layout = $(this).data("layout");
		if (layout) {
			layout.options.resizeWithWindow = false; // set option just in case not already set
			layout.resizeAll();
		}
	});
};
})( jQuery );