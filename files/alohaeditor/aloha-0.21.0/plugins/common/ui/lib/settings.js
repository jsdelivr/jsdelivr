define(['jquery', 'util/arrays', 'util/maps', 'util/trees'], function($, Arrays, Maps, Trees){
	var defaultToolbarSettings = {
		tabs: [
			// Format Tab
			{
				label: 'Format',
				showOn: { scope: 'Aloha.continuoustext' },
				components: [
					[
						// strong, emphasis and underline are not shown with the default format plugin button configuration
						'bold', 'strong', 'italic', 'emphasis', 'underline', '\n',
						'subscript', 'superscript', 'strikethrough', 'quote'
					], [
						'formatLink', 'formatAbbr', 'formatNumeratedHeaders', '\n',
						'toggleMetaView', 'wailang', 'toggleFormatlessPaste'
					], [
						'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '\n',
						'orderedList', 'unorderedList', 'indentList', 'outdentList'
					], [
						'formatBlock'
					]
				]
			},
			// Insert Tab
			{
				label: "Insert",
				showOn: { scope: 'Aloha.continuoustext' },
				components: [
					[ "createTable", "characterPicker", "insertLink",
					  "insertImage", "insertAbbr", "insertToc",
					  "insertHorizontalRule", "insertTag"]
				]
			},
			// Link Tab
			{
				label: 'Link', 
				showOn: { scope: 'link' },
				components: [ 'editLink', 'removeLink', 'linkBrowser' ]
			},
            // Image Tab
            {
                label: "Image",
                showOn: {scope: 'image'},
                components: [
                    [ "imageSource", "imageTitle",
                      "imageAlignLeft", "imageAlignRight", "imageAlignNone",
                      "imageIncPadding", "imageDecPadding",
                      "imageBrowser",
                      "imageCropButton", "imageCnrReset", "imageCnrRatio",
                      "imageResizeWidth", "imageResizeHeight" ]
                ]
            },
            // Abbr Tab
            {   label: "Abbreviation",
                showOn: { scope: 'abbr' },
                components: [
                    [ "abbrText" ]
                ]
            },
            // Wailang Tab
            {   label: "Wailang",
				showOn: { scope: 'wai-lang' },
                components: [ [ "wailangfield", "removewailang" ] ]
            },
			// Table Tabs
			{
				label: "Table",
				showOn: { scope: 'table.cell' },
				components: [
					[ "mergecells", "splitcells", "tableCaption",
					  "tableSummary", "formatTable" ]
				]
			},
			{ 
				label: "Column",
				showOn: { scope: 'table.column' },
				components: [
					[ "addcolumnleft", "addcolumnright", "deletecolumns",
					  "columnheader", "mergecellsColumn", "splitcellsColumn",
					  "formatColumn" ]
				]
			},
			{
				label: "Row",
				showOn: { scope: 'table.row' },
				components: [
					[ "addrowbefore", "addrowafter", "deleterows", "rowheader",
					  "mergecellsRow", "splitcellsRow", "formatRow" ]
				]
			}
		]
	};

	/**
	 * Combines two toolbar configurations.
	 *
	 * @param userTabs
	 *        a list of tab configurations
	 * @param defaultTabs
	 *        a list of tab configurations
	 * @param exclude
	 *        a list of component names and tab labels to ignore
	 *        in the given defaultTabs configuration.
	 * @return
	 *        The resulting configuration will contain all tabs from
	 *        userTabs and defaultTabs. If a tab is contained in both,
	 *        the one in userTabs takes precedence, but the components
	 *        of both tabs will be combined.
	 *        If a given component in defaultTabs already exists in any
	 *        tab of userTabs, the component in defaultTabs will be
	 *        ignored.
	 *        Tabs and components of defaulTabs can be excluded by
	 *        listing the tab labels and component names in the given
	 *        exlcude param.
	 */
	function combineToolbarSettings(userTabs, defaultTabs, exclude) {
		var defaultTabsByLabel = Maps.fillTuples({}, Arrays.map(defaultTabs, function(tab) {
			return [tab.label, tab];
		}));
		var exclusionLookup = makeExclusionMap(userTabs, exclude);
		function pruneDefaultComponents(form) {
			return 'array' === $.type(form) ? !form.length : exclusionLookup[form];
		};
		userTabs = mergeDefaultComponents(userTabs, defaultTabsByLabel, pruneDefaultComponents);
		defaultTabs = remainingDefaultTabs(defaultTabs, exclusionLookup, pruneDefaultComponents);
		return userTabs.concat(defaultTabs);
	}

	function remainingDefaultTabs(defaultTabs, exclusionLookup, pruneDefaultComponents) {
		var i,
		    tab,
		    tabs = [],
		    defaultTab,
		    components;
		for (i = 0; i < defaultTabs.length; i++) {
			defaultTab = defaultTabs[i];
			if (!exclusionLookup[defaultTab.label]) {
				components = Trees.postprune(defaultTab.components, pruneDefaultComponents);
				if (components) {
					tab = $.extend({}, defaultTab);
					tab.components = components;
					tabs.push(tab);
				}
			}
		}
		return tabs;
	}

	function mergeDefaultComponents(userTabs, defaultTabsByLabel, pruneDefaultComponents) {
		var i,
            tab,
		    tabs = [],
		    userTab,
		    components,
		    defaultTab,
		    defaultComponents;
		for (i = 0; i < userTabs.length; i++) {
			userTab = userTabs[i];
			components = userTab.components;
			defaultTab = defaultTabsByLabel[userTab.label];
			if (defaultTab) {
				defaultComponents = Trees.postprune(defaultTab.components, pruneDefaultComponents);
				if (defaultComponents) {
					components = components.concat(defaultComponents);
				}
			}
			debugger;
			tab = $.extend({}, defaultTab || {}, userTab);
			tab.components = components;
			tabs.push(tab);
		}
		return tabs;
	}

	function makeExclusionMap(userTabs, exclude) {
		var i,
		    map = Maps.fillKeys({}, exclude, true);
		for (i = 0; i < userTabs.length; i++) {
			map[userTabs[i].label] = true;
			Maps.fillKeys(map, Trees.flatten(userTabs[i].components), true);
		}
		return map;
	}

	return {
		defaultToolbarSettings: defaultToolbarSettings,
		combineToolbarSettings: combineToolbarSettings
	};
});
