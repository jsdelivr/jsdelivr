(function() { // BeginSpryComponent

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.TabbedPanels2)
{
	alert("SpryFadingPanelsPlugin.js requires SpryTabbedPanels2.js!");
	return;
}

var gFPP = Spry.Widget.TabbedPanels2.FadingPanelsPlugin = {
	initialize: function(tp2)
	{
		tp2.addObserver(this);
	},
	getOptions: function(tp2) {
		var optMap = {
			"defaultTab":"defaltPanel",
			"autoPlay":"autoPlay",
			"stopOnUserAction":"selectionStopsSlideShow",
			"displayInterval":"displayInterval",
			"minDuration":"minDuration",
			"maxDuration":"maxDuration",
			"stoppedMinDuration":"stoppedMinDuration",
			"stoppedMaxDuration":"stoppedMaxDuration",
			"panelVisibleClass":"visibleClass"
		};
		var options = {};
		for (var opt in optMap) {
			if (typeof(tp2[opt]) != "undefined") {
				options[optMap[opt]] = tp2[opt]; 
			}
		}
		options.parallelTransition = false;
		return options;
	},
	onPreAttachViewBehaviors: function(tp2, evt) {
		var options = this.getOptions(tp2);
		tp2.panelSet = new Spry.Widget.FadingPanels(tp2.getContentPanels(), options);
	
		tp2.panelSet.addObserver({
			onPreShowPanelEffect: function(n,d){
				tp2.markOpenPanel(d.target);
			}
		});
	
		var p = tp2.panelSet.getCurrentPanel();
		if (p) {
			tp2.markOpenPanel(p);
		}
		evt.preventDefault();
	},

	onPostShowSlide: function(tp2, evt)
	{
	}
};

})(); // EndSpryComponent
	