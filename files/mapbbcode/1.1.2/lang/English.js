window.MapBBCode.include({strings: {
	close: 'Close', // close feature editing popup
	remove: 'Delete', // delete feature from popup
	apply: 'Apply', // button on an editing map to apply changes
	cancel: 'Cancel', // button on an editing map to discard changes
	title: 'Title', // prompt for marker title text

	// button titles
	zoomInTitle: 'Zoom in',
	zoomOutTitle: 'Zoom out',
	applyTitle: 'Apply changes',
	cancelTitle: 'Cancel changes',
	fullScreenTitle: 'Enlarge or shrink map panel',
	searchTitle: 'Search for a location',
	helpTitle: 'Open help window',
	outerTitle: 'Show this place on an external map',

	mapbbcodeTitle: 'A library for parsing, editing and displaying [map] bbcode',
	submitWarning: 'You will lose changes to the map. Proceed?',

	// share
	exportName: 'Export',
	exportTitle: 'Download this map',
	upload: 'Upload',
	uploadTitle: 'Upload this map to an external server',
	uploading: 'Uploading',
	uploadError: 'Error while uploading the map',
	uploadSuccess: 'Upload was successful. Bookmark this link to be able to edit the map',
	sharedFormHeader: 'There are no objects to upload. Enter a MapBBCode Share map URL',
	sharedFormError: 'This map panel has incorrect endpoint set.<br>Please contact an administrator.',
	sharedFormInvalidCode: 'Map code is invalid',
	sharedCodeLoading: 'Downloading <a href="{url}" target="mapbbcode_outer">a map</a>...',
	sharedCodeError: 'Failed to download an external map<br><br><a href="{url}" target="mapbbcode_outer">Open map in a new window</a>',

	// Leaflet.draw
	polylineTitle: 'Draw a path',
	polygonTitle: 'Draw a polygon',
	markerTitle: 'Add a marker',
	drawCancelTitle: 'Cancel drawing',
	markerTooltip: 'Click map to place marker',
	polylineStartTooltip: 'Click to start drawing a line',
	polylineContinueTooltip: 'Click to continue drawing line',
	polylineEndTooltip: 'Click the last point to finish line',
	polygonStartTooltip: 'Click to start drawing a polygon',
	polygonContinueTooltip: 'Click to continue drawing polygon',
	polygonEndTooltip: 'Click the last point to close this polygon',

	// Param.Length
	singleLength: 'Length of this line',
	totalLength: 'Total length',

	// help: array of html paragraphs, simply joined together. First line is <h1>, start with '#' for <h2>.
	helpContents: [
		'Map BBCode Editor',
		'Since you have already activated the editor, you know the drill. There are buttons for markers and geometry, you click the map and objects appear, they have popups activated by clicking, from which you can change some properties, like color. To save the drawing click "Apply", otherwise there is a "Cancel" button.',
		'What you should know is that you are editing not the map, but the underlying bbcode, with all restrictions it imposes. It is a text string, which you can copy and paste to different services, and edit directly. <a href="http://mapbbcode.org/bbcode.html" target="mapbb">The syntax</a> of it is quite simple: <tt>[map]...[/map]</tt> tags with a list of objects as coordinate sequences and attributes. When a cursor is inside bbcode, the editor is opened with a drawing it represents, otherwise it will be empty. If you have any questions, check <a href="http://mapbbcode.org/faq.html" target="mapbb">the FAQ</a> first.',
		'For a complete manual see <a href="http://mapbbcode.org/guide.html" target="mapbb">User\'s Guide</a> on the official MapBBCode site.',
		'# Navigating the map',
		'Here are some hints for using map panels. Keyboard arrows work when a map is in focus. Shift+drag with a mouse to quickly zoom into an area, shift+zoom buttons to change zoom 3 steps at a time. Use the layer switcher at the top right corner to see the drawing on a different map. Mouse wheel is disabled in the viewer, but can be used in the editor to quickly zoom in or out. Use the button with a magnifier to navigate to a named place or a road.',
		'# External maps',
		'If the feature is not disabled by administrators, you can upload your maps to a server, <a href="http://share.mapbbcode.org" target="mapbb">share.mapbbcode.org</a> by default, with an "Upload" button. If you click it not having drawn anything, it will ask for a map URL or identifier. Those are converted to <tt>[mapid]id[/mapid]</tt> bbcode, which looks like a regular map, but with an export button: users can download a drawing as GPX or CSV or in any other format. If you share an edit link for a map, others can join in, and changes will be reflected in embedded maps.',
		'# Plugin',
		'<a href="http://mapbbcode.org/" target="mapbb">MapBBCode</a> is an open source javascript library with plugins around it available for some forum and blog engines. Its goal is to make sharing maps easier. This is version {version}.'
	]
}});
