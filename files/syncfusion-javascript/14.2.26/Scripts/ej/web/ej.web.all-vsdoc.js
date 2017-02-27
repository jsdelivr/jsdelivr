var ej={
mobile: {},
  datavisualization: {}
};
ej.Accordion=function(){};
ej.Accordion.prototype={

addItem:function(header_name, content, index, isAjaxReq){
/// <summary>
/// AddItem method is used to add the panel in dynamically. It receives the following parameters
/// </summary>
/// <param name="header_name"	type="string">specify the name of the header</param>
/// <param name="content"	type="string">content of the new panel</param>
/// <param name="index"	type="number">insertion place of the new panel</param>
/// <param name="isAjaxReq"	type="boolean">Enable or disable the AJAX request to the added panel</param>
},
collapseAll:function(){
/// <summary>
/// This method used to collapse the all the expanded items in accordion at a time.
/// </summary>
},
destroy:function(){
/// <summary>
/// destroy the Accordion widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the accordion widget includes all the headers and content panels.
/// </summary>
},
disableItems:function(index){
/// <summary>
/// Disable the accordion widget item based on specified header index.
/// </summary>
/// <param name="index"	type="Array&lt;any&gt;">index values to disable the panels</param>
},
enable:function(){
/// <summary>
/// Enable the accordion widget includes all the headers and content panels.
/// </summary>
},
enableItems:function(index){
/// <summary>
/// Enable the accordion widget item based on specified header index.
/// </summary>
/// <param name="index"	type="Array&lt;any&gt;">index values to enable the panels</param>
},
expandAll:function(){
/// <summary>
/// To expand all the accordion widget items.
/// </summary>
},
getItemsCount:function(){
/// <summary>
/// Returns the total number of panels in the control.
/// </summary>
},
hide:function(){
/// <summary>
/// Hides the visible Accordion control.
/// </summary>
},
refresh:function(){
/// <summary>
/// The refresh method is used to adjust the control size based on the parent element dimension.
/// </summary>
},
removeItem:function(index){
/// <summary>
/// RemoveItem method is used to remove the specified index panel.It receives the parameter as number.
/// </summary>
/// <param name="index"	type="number">specify the index value for remove the accordion panel.</param>
},
show:function(){
/// <summary>
/// Shows the hidden Accordion control.
/// </summary>
},
};
jQuery.fn.ejAccordion=function(){
this.data("ejAccordion",new	ej.Accordion());
return this;
};
jQuery.fn.ejAccordion = function (options) {
/// <summary><br/>
///The Accordion control is an interface where lists of items can be collapsed or expanded. It has several collapsible panels where only one can be expanded at a time that is useful for dashboards where space is limited. Each Accordion control has a template for its header and its content.<br/><br/>
///Specifies the ajaxSettings option to load the content to the accordion control.
///<br/>ajaxSettings-AjaxSettings	default-null
///<br/><br/>
///It specifies, whether to enable or disable asynchronous request.
///<br/>async-boolean	default-
///<br/><br/>
///It specifies the page will be cached in the web browser.
///<br/>cache-boolean	default-
///<br/><br/>
///It specifies the type of data is send in the query string.
///<br/>contentType-string	default-
///<br/><br/>
///It specifies the data as an object, will be passed in the query string.
///<br/>data-any	default-
///<br/><br/>
///It specifies the type of data that you're expecting back from the response.
///<br/>dataType-string	default-
///<br/><br/>
///It specifies the HTTP request type.
///<br/>type-string	default-
///<br/><br/>
///Accordion headers can be expanded and collapsed on keyboard action.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///To set the Accordion headers Collapse Speed.
///<br/>collapseSpeed-number	default-300
///<br/><br/>
///Specifies the collapsible state of accordion control.
///<br/>collapsible-boolean	default-false
///<br/><br/>
///Sets the root CSS class for Accordion theme, which is used customize.
///<br/>cssClass-string	default-
///<br/><br/>
///Allows you to set the custom header Icon. It accepts two key values â€œheaderâ€, â€selectedHeaderâ€.
///<br/>customIcon-CustomIcon	default-{ header: e-collapse, selectedHeader: e-expand }
///<br/><br/>
///This class name set to collapsing header.
///<br/>header-string	default-
///<br/><br/>
///This class name set to expanded (active) header.
///<br/>selectedHeader-string	default-
///<br/><br/>
///Disables the specified indexed items in accordion.
///<br/>disabledItems-number[]	default-[]
///<br/><br/>
///Specifies the animation behavior in accordion.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///With this enabled property, you can enable or disable the Accordion.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Used to enable the disabled items in accordion.
///<br/>enabledItems-number[]	default-[]
///<br/><br/>
///Multiple content panels to activate at a time.
///<br/>enableMultipleOpen-boolean	default-false
///<br/><br/>
///Save current model value to browser cookies for maintaining states. When refreshing the accordion control page, the model value is applied from browser cookies or HTML 5local storage.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Display headers and panel text from right-to-left.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///The events API binds the action for activating the accordion header. Users can activate the header by using mouse actions such as mouse-over, mouse-up, mouse-down, and soon.
///<br/>events-string	default-click
///<br/><br/>
///To set the Accordion headers Expand Speed.
///<br/>expandSpeed-number	default-300
///<br/><br/>
///Sets the height for Accordion items header.
///<br/>headerSize-number|string	default-
///<br/><br/>
///Specifies height of the accordion.
///<br/>height-number|string	default-null
///<br/><br/>
///Adjusts the content panel height based on the given option (content, auto, or fill). By default, the panel heights are adjusted based on the content.
///<br/>heightAdjustMode-ej.Accordion.HeightAdjustMode|string	default-content
///<br/><br/>
///It allows to define the characteristics of the Accordion control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///The given index header will activate (open). If collapsible is set to true, and a negative value is given, then all headers are collapsed. Otherwise, the first panel isactivated.
///<br/>selectedItemIndex-number	default-0
///<br/><br/>
///Activate the specified indexed items of the accordion
///<br/>selectedItems-number[]	default-[0]
///<br/><br/>
///Used to determines the close button visibility an each accordion items. This close button helps to remove the accordion item from the control.
///<br/>showCloseButton-boolean	default-false
///<br/><br/>
///Displays rounded corner borders on the Accordion control's panels and headers.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies width of the accordion.
///<br/>width-number|string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Autocomplete=function(){};
ej.Autocomplete.prototype={

clearText:function(){
/// <summary>
/// Clears the text in the Autocomplete textbox.
/// </summary>
},
destroy:function(){
/// <summary>
/// Destroys the Autocomplete widget.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the autocomplete widget.
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the autocomplete widget.
/// </summary>
},
getSelectedItems:function(){
/// <summary>
/// Returns objects (data object) of all the selected items in the autocomplete textbox.
/// </summary>
},
getValue:function(){
/// <summary>
/// Returns the current selected value from the Autocomplete textbox.
/// </summary>
},
getActiveText:function(){
/// <summary>
/// Returns the current active text value in the Autocomplete suggestion list.
/// </summary>
},
search:function(){
/// <summary>
/// Search the entered text and show it in the suggestion list if available.
/// </summary>
},
open:function(){
/// <summary>
/// Open up the autocomplete suggestion popup with all list items.
/// </summary>
},
selectValueByKey:function(Key){
/// <summary>
/// Sets the value of the Autocomplete textbox based on the given key value.
/// </summary>
/// <param name="Key"	type="string">The key value of the specific suggestion item.</param>
},
selectValueByText:function(Text){
/// <summary>
/// Sets the value of the Autocomplete textbox based on the given input text value.
/// </summary>
/// <param name="Text"	type="string">The text (label) value of the specific suggestion item.</param>
},
};
jQuery.fn.ejAutocomplete=function(){
this.data("ejAutocomplete",new	ej.Autocomplete());
return this;
};
jQuery.fn.ejAutocomplete = function (options) {
/// <summary><br/>
///The AutoComplete control is a textbox control that provides a list of suggestions based on the user query.When the users enters the text in the text box, the control performs a search operation and provides a list of results in the suggestion pop up. There are several filter types available to perform the search.<br/><br/>
///Customize "Add New" text (label) to be added in the autocomplete popup list for the entered text when there are no suggestions for it.
///<br/>addNewText-boolean	default-Add New
///<br/><br/>
///Allows new values to be added to the autocomplete input other than the values in the suggestion list. Normally, when there are no suggestions it will display â€œNo suggestionsâ€ label in the popup.
///<br/>allowAddNew-boolean	default-false
///<br/><br/>
///Enables or disables the sorting of suggestion list item. The default sort order is ascending order. You customize sort order.
///<br/>allowSorting-boolean	default-true
///<br/><br/>
///Enables or disables selecting the animation style for the popup list. Animation types can be selected through either of the following options,
///<br/>animateType-ej.Autocomplete.Animation|string	default-slide
///<br/><br/>
///To focus the items in the suggestion list when the popup is shown. By default first item will be focused.
///<br/>autoFocus-boolean	default-false
///<br/><br/>
///Enables or disables the case sensitive search.
///<br/>caseSensitiveSearch-boolean	default-false
///<br/><br/>
///The root class for the Autocomplete textbox widget which helps in customizing its theme.
///<br/>cssClass-string	default-&#226;€&#226;€
///<br/><br/>
///The data source contains the list of data for the suggestions list. It can be a string array or JSON array.
///<br/>dataSource-any|Array&lt;any&gt;	default-null
///<br/><br/>
///The time delay (in milliseconds) after which the suggestion popup will be shown.
///<br/>delaySuggestionTimeout-number	default-200
///<br/><br/>
///The special character which acts as a separator for the given words for multi-mode search i.e. the text after the delimiter are considered as a separate word or query for search operation.
///<br/>delimiterChar-string	default-&#226;€™,&#226;€™
///<br/><br/>
///The text to be displayed in the popup when there are no suggestions available for the entered text.
///<br/>emptyResultText-string	default-&#226;€œNo suggestions&#226;€
///<br/><br/>
///Fills the autocomplete textbox with the first matched item from the suggestion list automatically based on the entered text when enabled.
///<br/>enableAutoFill-boolean	default-false
///<br/><br/>
///Enables or disables the Autocomplete textbox widget.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Enables or disables displaying the duplicate names present in the search result.
///<br/>enableDistinct-boolean	default-false
///<br/><br/>
///Allows the current model values to be saved in local storage or browser cookies for state maintenance when it is set to true. While refreshing the page, it retains the model value from browser cookies or local storage.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Displays the Autocomplete widgetâ€™s content from right to left when enabled.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Mapping fields for the suggestion items of the Autocomplete textbox widget.
///<br/>fields-any	default-null
///<br/><br/>
///Specifies the search filter type. There are several types of search filter available such as â€˜startswithâ€™, â€˜containsâ€™, â€˜endswithâ€™, â€˜lessthanâ€™, â€˜lessthanorequalâ€™, â€˜greaterthanâ€™, â€˜greaterthanorequalâ€™, â€˜equalâ€™, â€˜notequalâ€™.
///<br/>filterType-string	default-ej.filterType.StartsWith
///<br/><br/>
///The height of the Autocomplete textbox.
///<br/>height-string	default-null
///<br/><br/>
///The search text can be highlighted in the AutoComplete suggestion list when enabled.
///<br/>highlightSearch-boolean	default-false
///<br/><br/>
///Number of items to be displayed in the suggestion list.
///<br/>itemsCount-number	default-0
///<br/><br/>
///Minimum number of character to be entered in the Autocomplete textbox to show the suggestion list.
///<br/>minCharacter-number	default-1
///<br/><br/>
///Enables or disables selecting multiple values from the suggestion list. Multiple values can be selected through either of the following options,
///<br/>multiSelectMode-ej.Autocomplete.MultiSelectMode|string	default-ej.MultiSelectMode.None
///<br/><br/>
///An Autocomplete column collection can be defined and customized through the multiColumnSettings property.Column's header, field, and stringFormat can be define via multiColumnSettings properties.
///<br/>multiColumnSettings-MultiColumnSettings	default-
///<br/><br/>
///Allow list of data to be displayed in several columns.
///<br/>enable-boolean	default-false
///<br/><br/>
///Allow header text to be displayed in corresponding columns.
///<br/>showHeader-boolean	default-true
///<br/><br/>
///Displayed selected value and autocomplete search based on mentioned column value specified in that format.
///<br/>stringFormat-string	default-
///<br/><br/>
///Field and Header Text collections can be defined and customized through columns field.
///<br/>columns-Array&lt;any&gt;	default-
///<br/><br/>
///Get or set a value that indicates to display the columns in the autocomplete mapping with column name of the dataSource.
///<br/>field-string	default-
///<br/><br/>
///Get or set a value that indicates to display the title of that particular column.
///<br/>headerText-string	default-
///<br/><br/>
///The height of the suggestion list.
///<br/>popupHeight-string	default-&#226;€œ152px&#226;€
///<br/><br/>
///The width of the suggestion list.
///<br/>popupWidth-string	default-&#226;€œauto&#226;€
///<br/><br/>
///The query to retrieve the data from the data source.
///<br/>query-ej.Query|string	default-null
///<br/><br/>
///Indicates that the autocomplete textbox values can only be readable.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Sets the value for the Autocomplete textbox based on the given input key value.
///<br/>selectValueByKey-number	default-
///<br/><br/>
///Enables or disables showing the message when there are no suggestions for the entered text.
///<br/>showEmptyResultText-boolean	default-true
///<br/><br/>
///Enables or disables the loading icon to intimate the searching operation. The loading icon is visible when there is a time delay to perform the search.
///<br/>showLoadingIcon-boolean	default-true
///<br/><br/>
///Enables the showPopup button in autocomplete textbox. When the showPopup button is clicked, it displays all the available data from the data source.
///<br/>showPopupButton-boolean	default-false
///<br/><br/>
///Enables or disables rounded corner.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Enables or disables reset icon to clear the textbox values.
///<br/>showResetIcon-boolean	default-false
///<br/><br/>
///Sort order specifies whether the suggestion list values has to be displayed in ascending or descending order.
///<br/>sortOrder-ej.Autocomplete.SortOrder|string	default-ej.SortOrder.Ascending
///<br/><br/>
///The template to display the suggestion list items with customized appearance.
///<br/>template-string	default-null
///<br/><br/>
///The jQuery validation error message to be displayed on form validation.
///<br/>validationMessage-any	default-null
///<br/><br/>
///The jQuery validation rules for form validation.
///<br/>validationRules-any	default-null
///<br/><br/>
///The value to be displayed in the autocomplete textbox.
///<br/>value-string	default-null
///<br/><br/>
///Enables or disables the visibility of the autocomplete textbox.
///<br/>visible-boolean	default-true
///<br/><br/>
///The text to be displayed when the value of the autocomplete textbox is empty.
///<br/>watermarkText-string	default-null
///<br/><br/>
///The width of the Autocomplete textbox.
///<br/>width-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Barcode=function(){};
ej.Barcode.prototype={

disable:function(){
/// <summary>
/// To disable the barcode
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the barcode
/// </summary>
},
};
jQuery.fn.ejBarcode=function(){
this.data("ejBarcode",new	ej.Barcode());
return this;
};
jQuery.fn.ejBarcode = function (options) {
/// <summary><br/>
///$(element).ejBarcode()<br/><br/>
///Specifies the distance between the barcode and text below it.
///<br/>barcodeToTextGapHeight-number	default-
///<br/><br/>
///Specifies the height of bars in the Barcode. By modifying the barHeight, the entire barcode height can be customized. Please refer to xDimension for two dimensional barcode height customization.
///<br/>barHeight-number	default-
///<br/><br/>
///Specifies the dark bar color of the Barcode. One dimensional barcode contains a series of dark and light bars which are usually colored as black and white respectively.
///<br/>darkBarColor-any	default-
///<br/><br/>
///Specifies whether the text below the barcode is visible or hidden.
///<br/>displayText-boolean	default-
///<br/><br/>
///Specifies whether the control is enabled.
///<br/>enabled-boolean	default-
///<br/><br/>
///Specifies the start and stop encode symbol in the Barcode. In one dimensional barcodes, an additional character is added as start and stop delimiters. These symbols are optional and the unique of the symbol allows the reader to determine the direction of the barcode being scanned.
///<br/>encodeStartStopSymbol-number	default-
///<br/><br/>
///Specifies the light bar color of the Barcode. One dimensional barcode contains a series of dark and light bars which are usually colored as black and white respectively.
///<br/>lightBarColor-any	default-
///<br/><br/>
///Specifies the width of the narrow bars in the barcode. The dark bars in the one dimensional barcode contains random narrow and wide bars based on the provided input which can be specified during initialization.
///<br/>narrowBarWidth-number	default-
///<br/><br/>
///Specifies the width of the quiet zone. In barcode, a quiet zone is the blank margin on either side of a barcode which informs the reader where a barcode's symbology starts and stops. The purpose of a quiet zone is to prevent the reader from picking up unrelated information.
///<br/>quietZone-QuietZone	default-
///<br/><br/>
///Specifies the quiet zone around the Barcode.
///<br/>all-number	default-
///<br/><br/>
///Specifies the bottom quiet zone of the Barcode.
///<br/>bottom-number	default-
///<br/><br/>
///Specifies the left quiet zone of the Barcode.
///<br/>left-number	default-
///<br/><br/>
///Specifies the right quiet zone of the Barcode.
///<br/>right-number	default-
///<br/><br/>
///Specifies the top quiet zone of the Barcode.
///<br/>top-number	default-
///<br/><br/>
///Specifies the type of the Barcode. See SymbologyType
///<br/>symbologyType-ej.datavisualization.Barcode.SymbologyType|string	default-
///<br/><br/>
///Specifies the text to be encoded in the barcode.
///<br/>text-string	default-
///<br/><br/>
///Specifies the color of the text/data at the bottom of the barcode.
///<br/>textColor-any	default-
///<br/><br/>
///Specifies the width of the wide bars in the barcode. One dimensional barcode usually contains random narrow and wide bars based on the provided which can be customized during initialization.
///<br/>wideBarWidth-number	default-
///<br/><br/>
///Specifies the width of the narrowest element(bar or space) in a barcode. The greater the x dimension, the more easily a barcode reader will scan.
///<br/>xDimension-number	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.BulletGraph=function(){};
ej.BulletGraph.prototype={

destroy:function(){
/// <summary>
/// To destroy the bullet graph
/// </summary>
},
redraw:function(){
/// <summary>
/// To redraw the bullet graph
/// </summary>
},
setComparativeMeasureSymbol:function(){
/// <summary>
/// To set the value for comparative measure in bullet graph.
/// </summary>
},
setFeatureMeasureBarValue:function(){
/// <summary>
/// To set the value for feature measure bar.
/// </summary>
},
};
jQuery.fn.ejBulletGraph=function(){
this.data("ejBulletGraph",new	ej.BulletGraph());
return this;
};
jQuery.fn.ejBulletGraph = function (options) {
/// <summary><br/>
///$(element).ejBulletGraph()<br/><br/>
///Toggles the visibility of the range stroke color of the labels.
///<br/>applyRangeStrokeToLabels-boolean	default-false
///<br/><br/>
///Toggles the visibility of the range stroke color of the ticks.
///<br/>applyRangeStrokeToTicks-boolean	default-false
///<br/><br/>
///Contains property to customize the caption in bullet graph.
///<br/>captionSettings-CaptionSettings	default-
///<br/><br/>
///Specifies whether trim the labels will be true or false.
///<br/>enableTrim-boolean	default-true
///<br/><br/>
///Contains property to customize the font of caption.
///<br/>font-any	default-
///<br/><br/>
///Specifies the color of the text in caption.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the fontFamily of caption. Caption text render with this fontFamily
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the fontStyle of caption
///<br/>fontStyle-ej.datavisualization.BulletGraph.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the fontWeight of caption
///<br/>fontWeight-ej.datavisualization.BulletGraph.FontWeight|string	default-regular
///<br/><br/>
///Specifies the opacity of caption. Caption text render with this opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the size of caption. Caption text render with this size
///<br/>size-string	default-12px
///<br/><br/>
///Contains property to customize the indicator.
///<br/>indicator-any	default-
///<br/><br/>
///Contains property to customize the font of indicator.
///<br/>font-any	default-
///<br/><br/>
///Specifies the color of the indicator's text.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the fontFamily of indicator. Indicator text render with this fontFamily.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the fontStyle of indicator. Indicator text render with this fontStyle. See FontStyle
///<br/>fontStyle-ej.datavisualization.BulletGraph.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the fontWeight of indicator. Indicator text render with this fontWeight. See FontWeight
///<br/>fontWeight-ej.datavisualization.BulletGraph.FontWeight|string	default-regular
///<br/><br/>
///Specifies the opacity of indicator text. Indicator text render with this Opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the size of indicator. Indicator text render with this size.
///<br/>size-string	default-12px
///<br/><br/>
///Contains property to customize the location of indicator.
///<br/>location-any	default-
///<br/><br/>
///Specifies the horizontal position of the indicator.
///<br/>x-number	default-10
///<br/><br/>
///Specifies the vertical position of the indicator.
///<br/>y-number	default-60
///<br/><br/>
///Specifies the padding to be applied when text position is used.
///<br/>padding-number	default-2
///<br/><br/>
///Contains property to customize the symbol of indicator.
///<br/>symbol-any	default-
///<br/><br/>
///Contains property to customize the border of indicator symbol.
///<br/>border-any	default-
///<br/><br/>
///Specifies the border color of indicator symbol.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border width of indicator symbol.
///<br/>width-number	default-1
///<br/><br/>
///Specifies the color of indicator symbol.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the URL of image that represents indicator symbol.
///<br/>imageURL-string	default-
///<br/><br/>
///Specifies the opacity of indicator symbol.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the shape of indicator symbol.
///<br/>shape-string	default-
///<br/><br/>
///Contains property to customize the size of indicator symbol.
///<br/>size-any	default-
///<br/><br/>
///Specifies the height of indicator symbol.
///<br/>height-number	default-10
///<br/><br/>
///Specifies the width of indicator symbol.
///<br/>width-number	default-10
///<br/><br/>
///Specifies the text to be displayed as indicator text. By default difference between current value and target will be displayed
///<br/>text-string	default-
///<br/><br/>
///Specifies the alignment of indicator with respect to scale based on text position
///<br/>textAlignment-ej.datavisualization.BulletGraph.TextAlignment|string	default-&#39;Near&#39;
///<br/><br/>
///Specifies where indicator text should be anchored when indicator overlaps with other caption group text. Text will be anchored when overlapping caption group text are at same position. Anchoring is not applicable for float position.
///<br/>textAnchor-ej.datavisualization.BulletGraph.TextAnchor|string	default-&#39;start&#39;
///<br/><br/>
///indicator text render in the specified angle.
///<br/>textAngle-number	default-0
///<br/><br/>
///Specifies where indicator should be placed
///<br/>textPosition-ej.datavisualization.BulletGraph.TextPosition|string	default-&#39;float&#39;
///<br/><br/>
///Specifies the space between indicator symbol and text.
///<br/>textSpacing-number	default-3
///<br/><br/>
///Specifies whether indicator will be visible or not.
///<br/>visible-boolean	default-false
///<br/><br/>
///Contains property to customize the location.
///<br/>location-any	default-
///<br/><br/>
///Specifies the position in horizontal direction
///<br/>x-number	default-17
///<br/><br/>
///Specifies the position in horizontal direction
///<br/>y-number	default-30
///<br/><br/>
///Specifies the padding to be applied when text position is used.
///<br/>padding-number	default-5
///<br/><br/>
///Contains property to customize the subtitle.
///<br/>subTitle-any	default-
///<br/><br/>
///Contains property to customize the font of subtitle.
///<br/>font-any	default-
///<br/><br/>
///Specifies the color of the subtitle's text.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the fontFamily of subtitle. Subtitle text render with this fontFamily.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the fontStyle of subtitle. Subtitle text render with this fontStyle. See FontStyle
///<br/>fontStyle-ej.datavisualization.BulletGraph.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the fontWeight of subtitle. Subtitle text render with this fontWeight. See FontWeight
///<br/>fontWeight-ej.datavisualization.BulletGraph.FontWeight|string	default-regular
///<br/><br/>
///Specifies the opacity of subtitle. Subtitle text render with this opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the size of subtitle. Subtitle text render with this size.
///<br/>size-string	default-12px
///<br/><br/>
///Contains property to customize the location of subtitle.
///<br/>location-any	default-
///<br/><br/>
///Specifies the horizontal position of the subtitle.
///<br/>x-number	default-10
///<br/><br/>
///Specifies the vertical position of the subtitle.
///<br/>y-number	default-45
///<br/><br/>
///Specifies the padding to be applied when text position is used.
///<br/>padding-number	default-5
///<br/><br/>
///Specifies the text to be displayed as subtitle.
///<br/>text-string	default-
///<br/><br/>
///Specifies the alignment of sub title text with respect to scale. Alignment will not be applied in float position.
///<br/>textAlignment-ej.datavisualization.BulletGraph.TextAlignment|string	default-&#39;Near&#39;
///<br/><br/>
///Specifies where subtitle text should be anchored when sub title text overlaps with other caption group text. Text will be anchored when overlapping caption group text are at same position. Anchoring is not applicable for float position.
///<br/>textAnchor-ej.datavisualization.BulletGraph.TextAnchor|string	default-&#39;start&#39;
///<br/><br/>
///Subtitle render in the specified angle.
///<br/>textAngle-number	default-0
///<br/><br/>
///Specifies where sub title text should be placed.
///<br/>textPosition-ej.datavisualization.BulletGraph.TextPosition|string	default-&#39;float&#39;
///<br/><br/>
///Specifies the text to be displayed on bullet graph.
///<br/>text-string	default-
///<br/><br/>
///Specifies the alignment of caption text with respect to scale. This property will not be applied when text position is float.
///<br/>textAlignment-ej.datavisualization.BulletGraph.TextAlignment|string	default-&#39;Near&#39;
///<br/><br/>
///Specifies caption text anchoring when caption text overlaps with other caption group text. Text will be anchored when overlapping caption group text are at same position. Anchoring is not applicable for float position.
///<br/>textAnchor-ej.datavisualization.BulletGraph.TextAnchor|string	default-&#39;start&#39;
///<br/><br/>
///Specifies the angel in which the caption is rendered.
///<br/>textAngle-number	default-0
///<br/><br/>
///Specifies how caption text should be placed.
///<br/>textPosition-ej.datavisualization.BulletGraph.TextPosition|string	default-&#39;float&#39;
///<br/><br/>
///Comparative measure bar in bullet graph render till the specified value.
///<br/>comparativeMeasureValue-number	default-0
///<br/><br/>
///Toggles the animation of bullet graph.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specifies the direction of flow in bullet graph. Neither it may be backward nor forward.
///<br/>flowDirection-ej.datavisualization.BulletGraph.FlowDirection|string	default-forward
///<br/><br/>
///Specifies the height of the bullet graph.
///<br/>height-number	default-90
///<br/><br/>
///Sets a value whether to make the bullet graph responsive on resize.
///<br/>isResponsive-boolean	default-true
///<br/><br/>
///Bullet graph will render in the specified orientation.
///<br/>orientation-ej.datavisualization.BulletGraph.Orientation|string	default-horizontal
///<br/><br/>
///Contains property to customize the qualitative ranges.
///<br/>qualitativeRanges-Array&lt;QualitativeRanges&gt;	default-
///<br/><br/>
///Specifies the ending range to which the qualitative ranges will render.
///<br/>rangeEnd-number	default-3
///<br/><br/>
///Specifies the opacity for the qualitative ranges.
///<br/>rangeOpacity-number	default-1
///<br/><br/>
///Specifies the stroke for the qualitative ranges.
///<br/>rangeStroke-string	default-null
///<br/><br/>
///Size of the qualitative range depends up on the specified value.
///<br/>qualitativeRangeSize-number	default-32
///<br/><br/>
///Length of the quantitative range depends up on the specified value.
///<br/>quantitativeScaleLength-number	default-475
///<br/><br/>
///Contains all the properties to customize quantitative scale.
///<br/>quantitativeScaleSettings-QuantitativeScaleSettings	default-
///<br/><br/>
///Contains property to customize the comparative measure.
///<br/>comparativeMeasureSettings-any	default-
///<br/><br/>
///Specifies the stroke of the comparative measure.
///<br/>stroke-number	default-null
///<br/><br/>
///Specifies the width of the comparative measure.
///<br/>width-number	default-5
///<br/><br/>
///Contains property to customize the featured measure.
///<br/>featuredMeasureSettings-any	default-
///<br/><br/>
///Specifies the Stroke of the featured measure in bullet graph.
///<br/>stroke-number	default-null
///<br/><br/>
///Specifies the width of the featured measure in bullet graph.
///<br/>width-number	default-2
///<br/><br/>
///Contains property to customize the featured measure.
///<br/>featureMeasures-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the category of feature measure.
///<br/>category-string	default-null
///<br/><br/>
///Comparative measure render till the specified value.
///<br/>comparativeMeasureValue-number	default-null
///<br/><br/>
///Feature measure render till the specified value.
///<br/>value-number	default-null
///<br/><br/>
///Contains property to customize the fields.
///<br/>fields-any	default-
///<br/><br/>
///Specifies the category of the bullet graph.
///<br/>category-string	default-null
///<br/><br/>
///Comparative measure render based on the values in the specified field.
///<br/>comparativeMeasure-string	default-null
///<br/><br/>
///Specifies the dataSource for the bullet graph.
///<br/>dataSource-any	default-null
///<br/><br/>
///Feature measure render based on the values in the specified field.
///<br/>featureMeasures-string	default-null
///<br/><br/>
///Specifies the query for fetching the values form data source to render the bullet graph.
///<br/>query-string	default-null
///<br/><br/>
///Specifies the name of the table.
///<br/>tableName-string	default-null
///<br/><br/>
///Specifies the interval for the Graph.
///<br/>interval-number	default-1
///<br/><br/>
///Contains property to customize the labels.
///<br/>labelSettings-any	default-
///<br/><br/>
///Contains property to customize the font of the labels in bullet graph.
///<br/>font-any	default-
///<br/><br/>
///Specifies the fontFamily of labels in bullet graph. Labels render with this fontFamily.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the fontStyle of labels in bullet graph. Labels render with this fontStyle. See FontStyle
///<br/>fontStyle-ej.datavisualization.BulletGraph.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the fontWeight of labels in bullet graph. Labels render with this fontWeight. See FontWeight
///<br/>fontWeight-ej.datavisualization.BulletGraph.FontWeight|string	default-regular
///<br/><br/>
///Specifies the opacity of labels in bullet graph. Labels render with this opacity
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the placement of labels in bullet graph scale.
///<br/>labelPlacement-ej.datavisualization.BulletGraph.LabelPlacement|string	default-outside
///<br/><br/>
///Specifies the prefix to be added with labels in bullet graph.
///<br/>labelPrefix-string	default-Empty string
///<br/><br/>
///Specifies the suffix to be added after labels in bullet graph.
///<br/>labelSuffix-string	default-Empty string
///<br/><br/>
///Specifies the horizontal/vertical padding of labels.
///<br/>offset-number	default-15
///<br/><br/>
///Specifies the position of the labels to render either above or below the graph. See Position
///<br/>position-ej.datavisualization.BulletGraph.LabelPosition|string	default-below
///<br/><br/>
///Specifies the Size of the labels.
///<br/>size-number	default-12
///<br/><br/>
///Specifies the stroke color of the labels in bullet graph.
///<br/>stroke-string	default-null
///<br/><br/>
///Contains property to customize the position of the quantitative scale
///<br/>location-any	default-
///<br/><br/>
///This property specifies the x position for rendering quantitative scale.
///<br/>x-number	default-10
///<br/><br/>
///This property specifies the y position for rendering quantitative scale.
///<br/>y-number	default-10
///<br/><br/>
///Contains property to customize the major tick lines.
///<br/>majorTickSettings-any	default-
///<br/><br/>
///Specifies the size of the major ticks.
///<br/>size-number	default-13
///<br/><br/>
///Specifies the stroke color of the major tick lines.
///<br/>stroke-string	default-null
///<br/><br/>
///Specifies the width of the major tick lines.
///<br/>width-number	default-2
///<br/><br/>
///Specifies the maximum value of the Graph.
///<br/>maximum-number	default-10
///<br/><br/>
///Specifies the minimum value of the Graph.
///<br/>minimum-number	default-0
///<br/><br/>
///Contains property to customize the minor ticks.
///<br/>minorTickSettings-any	default-
///<br/><br/>
///Specifies the size of minor ticks.
///<br/>size-number	default-7
///<br/><br/>
///Specifies the stroke color of minor ticks in bullet graph.
///<br/>stroke-string	default-null
///<br/><br/>
///Specifies the width of the minor ticks in bullet graph.
///<br/>width-number	default-2
///<br/><br/>
///The specified number of minor ticks will be rendered per interval.
///<br/>minorTicksPerInterval-number	default-4
///<br/><br/>
///Specifies the placement of ticks to render either inside or outside the scale.
///<br/>tickPlacement-ej.datavisualization.BulletGraph.TickPlacement|string	default-ej.datavisualization.BulletGraph.TickPlacement.Outside
///<br/><br/>
///Specifies the position of the ticks to render either above,below or inside
///<br/>tickPosition-ej.datavisualization.BulletGraph.TickPosition|string	default-ej.datavisualization.BulletGraph.TickPosition.Far
///<br/><br/>
///By specifying this property the user can change the theme of the bullet graph.
///<br/>theme-string	default-flatlight
///<br/><br/>
///Contains all the properties to customize tooltip.
///<br/>tooltipSettings-TooltipSettings	default-
///<br/><br/>
///Specifies template for caption tooltip
///<br/>captionTemplate-string	default-null
///<br/><br/>
///Toggles the visibility of caption tooltip
///<br/>enableCaptionTooltip-boolean	default-false
///<br/><br/>
///Specifies the ID of a div, which is to be displayed as tooltip.
///<br/>template-string	default-null
///<br/><br/>
///Toggles the visibility of tooltip
///<br/>visible-boolean	default-true
///<br/><br/>
///Feature measure bar in bullet graph render till the specified value.
///<br/>value-number	default-0
///<br/><br/>
///Specifies the width of the bullet graph.
///<br/>width-number	default-595
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Button=function(){};
ej.Button.prototype={

destroy:function(){
/// <summary>
/// destroy the button widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable the button
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the button
/// </summary>
},
};
jQuery.fn.ejButton=function(){
this.data("ejButton",new	ej.Button());
return this;
};
jQuery.fn.ejButton = function (options) {
/// <summary><br/>
///Custom Design for Html Button control.<br/><br/>
///Specifies the contentType of the Button. See below to know available ContentType
///<br/>contentType-ej.ContentType|string	default-ej.ContentType.TextOnly
///<br/><br/>
///Sets the root CSS class for Button theme, which is used customize.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the button control state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specify the Right to Left direction to button
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the height of the Button.
///<br/>height-number	default-28
///<br/><br/>
///It allows to define the characteristics of the Button control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the image position of the Button. This image position is applicable only with the textandimage contentType property. The images can be positioned in both imageLeft and imageRight options. See below to know about available ImagePosition
///<br/>imagePosition-ej.ImagePosition|string	default-ej.ImagePosition.ImageLeft
///<br/><br/>
///Specifies the primary icon for Button. This icon will be displayed from the left margin of the button.
///<br/>prefixIcon-string	default-null
///<br/><br/>
///Convert the button as repeat button. It raises the 'Click' event repeatedly from the it is pressed until it is released.
///<br/>repeatButton-boolean	default-false
///<br/><br/>
///Displays the Button with rounded corners.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the size of the Button. See below to know available ButtonSize
///<br/>size-ej.ButtonSize|string	default-ej.ButtonSize.Normal
///<br/><br/>
///Specifies the secondary icon for Button. This icon will be displayed from the right margin of the button.
///<br/>suffixIcon-string	default-null
///<br/><br/>
///Specifies the text content for Button.
///<br/>text-string	default-null
///<br/><br/>
///Specified the time interval between two consecutive 'click' event on the button.
///<br/>timeInterval-string	default-150
///<br/><br/>
///Specifies the Type of the Button. See below to know available ButtonType
///<br/>type-ej.ButtonType|string	default-ej.ButtonType.Submit
///<br/><br/>
///Specifies the width of the Button.
///<br/>width-number	default-100
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Calculate=function(){};
ej.Calculate.prototype={

addCustomFunction:function(FormulaName, FunctionName){
/// <summary>
/// Add the custom formulas with function in CalcEngine library
/// </summary>
/// <param name="FormulaName"	type="string">pass the formula name</param>
/// <param name="FunctionName"	type="string">pass the custom function name to call</param>
},
addNamedRange:function(Name, cellRange){
/// <summary>
/// Adds a named range to the NamedRanges collection
/// </summary>
/// <param name="Name"	type="string">pass the namedRange's name</param>
/// <param name="cellRange"	type="string">pass the cell range of NamedRange</param>
},
adjustRangeArg:function(Name){
/// <summary>
/// Accepts a possible parsed formula and returns the calculated value without quotes.
/// </summary>
/// <param name="Name"	type="string">pass the cell range to adjust its range</param>
},
clearFormulaDependentCells:function(Cell){
/// <summary>
/// When a formula cell changes, call this method to clear it from its dependent cells.
/// </summary>
/// <param name="Cell"	type="string">pass the changed cell address</param>
},
clearLibraryComputationException:function(){
/// <summary>
/// Call this method to clear whether an exception was raised during the computation of a library function.
/// </summary>
},
colIndex:function(Cell){
/// <summary>
/// Get the column index from a cell reference passed in.
/// </summary>
/// <param name="Cell"	type="string">pass the cell address</param>
},
computedValue:function(Formula){
/// <summary>
/// Evaluates a parsed formula.
/// </summary>
/// <param name="Formula"	type="string">pass the parsed formula</param>
},
computeFormula:function(Formula){
/// <summary>
/// Evaluates a parsed formula.
/// </summary>
/// <param name="Formula"	type="string">pass the parsed formula</param>
},
};
jQuery.fn.ejCalculate=function(){
this.data("ejCalculate",new	ej.Calculate());
return this;
};
jQuery.fn.ejCalculate = function (options) {
/// <summary><br/>
///Custom engine to perform calculation like excel sheet$(element).ejCalculate()Example{:.example}</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Captcha=function(){};
ej.Captcha.prototype={

};
jQuery.fn.ejCaptcha=function(){
this.data("ejCaptcha",new	ej.Captcha());
return this;
};
jQuery.fn.ejCaptcha = function (options) {
/// <summary><br/>
///Captcha is a popular technique that is used to prevent computer programs from sending automated requests and is used for meta-searching search engines, performing dictionary attacks in login pages, or sending spam by using mail servers. Captcha is validated at the time of form submission.<br/><br/>
///Specifies the character set of the Captcha that will be used to generate captcha text randomly.
///<br/>characterSet-string	default-
///<br/><br/>
///Specifies the error message to be displayed when the Captcha mismatch.
///<br/>customErrorMessage-string	default-
///<br/><br/>
///Set the Captcha validation automatically.
///<br/>enableAutoValidation-boolean	default-
///<br/><br/>
///Specifies the case sensitivity for the characters typed in the Captcha.
///<br/>enableCaseSensitivity-boolean	default-
///<br/><br/>
///Specifies the background patterns for the Captcha.
///<br/>enablePattern-boolean	default-
///<br/><br/>
///Sets the Captcha direction as right to left alignment.
///<br/>enableRTL-boolean	default-
///<br/><br/>
///Specifies the background appearance for the captcha.
///<br/>hatchStyle-ej.HatchStyle|string	default-
///<br/><br/>
///Specifies the height of the Captcha.
///<br/>height-number	default-
///<br/><br/>
///Specifies the method with values to be mapped in the Captcha.
///<br/>mapper-string	default-
///<br/><br/>
///Specifies the maximum number of characters used in the Captcha.
///<br/>maximumLength-number	default-
///<br/><br/>
///Specifies the minimum number of characters used in the Captcha.
///<br/>minimumLength-number	default-
///<br/><br/>
///Specifies the method to map values to Captcha.
///<br/>requestMapper-string	default-
///<br/><br/>
///Sets the Captcha with audio support, that enables to dictate the captcha text.
///<br/>showAudioButton-boolean	default-
///<br/><br/>
///Sets the Captcha with a refresh button.
///<br/>showRefreshButton-boolean	default-
///<br/><br/>
///Specifies the target button of the Captcha to validate the entered text and captcha text.
///<br/>targetButton-string	default-
///<br/><br/>
///Specifies the target input element that will verify the Captcha.
///<br/>targetInput-string	default-
///<br/><br/>
///Specifies the width of the Captcha.
///<br/>width-number	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Chart=function(){};
ej.Chart.prototype={

animate:function(options){
/// <summary>
/// Animates the series and/or indicators in Chart. When parameter is not passed to this method, then all the series and indicators present in Chart are animated.
/// </summary>
/// <param name="options"	type="any">If an array collection is passed as parameter, series and indicator objects passed in array collection are animated.ExampleIf a series or indicator object is passed to this method, then the specific series or indicator is animated.Example,</param>
},
export:function(type, URL, exportMultipleChart){
/// <summary>
/// Exports chart as an image or to an excel file. Chart can be exported as an image only when exportCanvasRendering option is set to true.
/// </summary>
/// <param name="type"	type="string">Type of the export operation to be performed. Following are the two export types that are supported now,1. 'image'2. 'excel'Example</param>
/// <param name="URL"	type="string">URL of the service, where the chart will be exported to excel.Example,</param>
/// <param name="exportMultipleChart"	type="boolean">When this parameter is true, all the chart objects initialized to the same document are exported to a single excel file. This is an optional parameter. By default, it is false.Example,</param>
},
redraw:function(){
/// <summary>
/// Redraws the entire chart. You can call this method whenever you update, add or remove points from the data source or whenever you want to refresh the UI.
/// </summary>
},
};
jQuery.fn.ejChart=function(){
this.data("ejChart",new	ej.Chart());
return this;
};
jQuery.fn.ejChart = function (options) {
/// <summary><br/>
///Essential chart can be easily configured to the DOM element, such as div. You can create a Chart with highly customizable look and feel.<br/><br/>
///Options for adding and customizing annotations in Chart.
///<br/>annotations-Array&lt;Annotations&gt;	default-
///<br/><br/>
///Angle to rotate the annotation in degrees.
///<br/>angle-number	default-&#39;0&#39;
///<br/><br/>
///Text content or id of a HTML element to be displayed as annotation.
///<br/>content-string	default-
///<br/><br/>
///Specifies how annotations have to be placed in Chart.
///<br/>coordinateUnit-ej.datavisualization.Chart.CoordinateUnit|string	default-none. See CoordinateUnit
///<br/><br/>
///Specifies the horizontal alignment of the annotation.
///<br/>horizontalAlignment-ej.datavisualization.Chart.HorizontalAlignment|string	default-middle. See HorizontalAlignment
///<br/><br/>
///Options to customize the margin of annotation.
///<br/>margin-any	default-
///<br/><br/>
///Annotation is placed at the specified value above its original position.
///<br/>bottom-number	default-0
///<br/><br/>
///Annotation is placed at the specified value from left side of its original position.
///<br/>left-number	default-0
///<br/><br/>
///Annotation is placed at the specified value from the right side of its original position.
///<br/>right-number	default-0
///<br/><br/>
///Annotation is placed at the specified value under its original position.
///<br/>top-number	default-0
///<br/><br/>
///Controls the opacity of the annotation.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies whether annotation has to be placed with respect to chart or series.
///<br/>region-ej.datavisualization.Chart.Region|string	default-chart. See Region
///<br/><br/>
///Specifies the vertical alignment of the annotation.
///<br/>verticalAlignment-ej.datavisualization.Chart.VerticalAlignment|string	default-middle. See VerticalAlignment
///<br/><br/>
///Controls the visibility of the annotation.
///<br/>visible-boolean	default-false
///<br/><br/>
///Represents the horizontal offset when coordinateUnit is pixels.when coordinateUnit is points, it represents the x-coordinate of axis bounded with xAxisName property or primary X axis when xAxisName is not provided.This property is not applicable when coordinateUnit is none.
///<br/>x-number	default-0
///<br/><br/>
///Name of the horizontal axis to be used for positioning the annotation. This property is applicable only when coordinateUnit is points.
///<br/>xAxisName-string	default-
///<br/><br/>
///Represents the vertical offset when coordinateUnit is pixels.When coordinateUnit is points, it represents the y-coordinate of axis bounded with yAxisName property or primary Y axis when yAxisName is not provided.This property is not applicable when coordinateUnit is none.
///<br/>y-number	default-0
///<br/><br/>
///Name of the vertical axis to be used for positioning the annotation.This property is applicable only when coordinateUnit is points.
///<br/>yAxisName-string	default-
///<br/><br/>
///URL of the image to be used as chart background.
///<br/>backGroundImageUrl-string	default-null
///<br/><br/>
///Options for customizing the color, opacity and width of the chart border.
///<br/>border-Border	default-
///<br/><br/>
///Border color of the chart.
///<br/>color-string	default-null
///<br/><br/>
///Opacity of the chart border.
///<br/>opacity-number	default-0.3
///<br/><br/>
///Width of the Chart border.
///<br/>width-number	default-0
///<br/><br/>
///This provides options for customizing export settings
///<br/>exportSettings-ExportSettings	default-
///<br/><br/>
///Specifies the downloading filename
///<br/>filename-string	default-chart
///<br/><br/>
///Specifies the name of the action URL
///<br/>action-string	default-
///<br/><br/>
///Specifies the angle for rotation
///<br/>angle-number	default-0
///<br/><br/>
///Specifies the format of the file to export
///<br/>type-ej.datavisualization.Chart.ExportingType|string	default-png
///<br/><br/>
///Specifies the orientation of the document
///<br/>orientation-ej.datavisualization.Chart.ExportingOrientation|string	default-portrait
///<br/><br/>
///Specifies the mode of exporting
///<br/>mode-ej.datavisualization.Chart.ExportingMode|string	default-client
///<br/><br/>
///Enable/ disable the multiple excel exporting
///<br/>multipleExport-boolean	default-false
///<br/><br/>
///Options for configuring the border and background of the plot area.
///<br/>chartArea-ChartArea	default-
///<br/><br/>
///Background color of the plot area.
///<br/>background-string	default-transparent
///<br/><br/>
///Options for customizing the border of the plot area.
///<br/>border-any	default-
///<br/><br/>
///Border color of the plot area.
///<br/>color-string	default-Gray
///<br/><br/>
///Opacity of the plot area border.
///<br/>opacity-number	default-0.3
///<br/><br/>
///Border width of the plot area.
///<br/>width-number	default-0.5
///<br/><br/>
///Options to split Chart into multiple plotting areas vertically. Each object in the collection represents a plotting area in Chart.
///<br/>columnDefinitions-Array&lt;ColumnDefinitions&gt;	default-
///<br/><br/>
///Specifies the unit to measure the width of the column in plotting area.
///<br/>unit-ej.datavisualization.Chart.Unit|string	default-&#39;pixel&#39;. See Unit
///<br/><br/>
///Width of the column in plotting area. Width is measured in either pixel or percentage based on the value of unit property.
///<br/>columnWidth-number	default-50
///<br/><br/>
///Color of the line that indicates the starting point of the column in plotting area.
///<br/>lineColor-string	default-transparent
///<br/><br/>
///Width of the line that indicates the starting point of the column in plot area.
///<br/>lineWidth-number	default-1
///<br/><br/>
///Options for configuring the properties of all the series. You can also override the options for specific series by using series collection.
///<br/>commonSeriesOptions-CommonSeriesOptions	default-
///<br/><br/>
///Options to customize the border of all the series.
///<br/>border-any	default-
///<br/><br/>
///Border color of all series.
///<br/>color-string	default-transparent
///<br/><br/>
///DashArray for border of the series.
///<br/>dashArray-string	default-null
///<br/><br/>
///Border width of all series.
///<br/>width-number	default-1
///<br/><br/>
///Enables or disables the visibility of legend item.
///<br/>visibleOnLegend-string	default-visible
///<br/><br/>
///Pattern of dashes and gaps used to stroke all the line type series.
///<br/>dashArray-string	default-
///<br/><br/>
///Set the dataSource for all series. It can be an array of JSON objects or an instance of ej.DataManager.
///<br/>dataSource-any	default-null
///<br/><br/>
///Controls the size of the hole in doughnut series. Value ranges from 0 to 1
///<br/>doughnutCoefficient-number	default-0.4
///<br/><br/>
///Controls the size of the doughnut series. Value ranges from 0 to 1.
///<br/>doughnutSize-number	default-0.8
///<br/><br/>
///Specifies the type of series to be drawn in radar or polar series.
///<br/>drawType-ej.datavisualization.Chart.DrawType|string	default-line. See DrawType
///<br/><br/>
///Enable/disable the animation for all the series.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///To avoid overlapping of data labels smartly.
///<br/>enableSmartLabels-boolean	default-true
///<br/><br/>
///Start angle of pie/doughnut series.
///<br/>endAngle-number	default-null
///<br/><br/>
///Explodes the pie/doughnut slices on mouse move.
///<br/>explode-boolean	default-false
///<br/><br/>
///Explodes all the slice of pie/doughnut on render.
///<br/>explodeAll-boolean	default-false
///<br/><br/>
///Index of the point to be exploded from pie/doughnut/pyramid/funnel.
///<br/>explodeIndex-number	default-null
///<br/><br/>
///Specifies the distance of the slice from the center, when it is exploded.
///<br/>explodeOffset-number	default-0.4
///<br/><br/>
///Fill color for all the series.
///<br/>fill-string	default-null
///<br/><br/>
///Options for customizing the font of all the series.
///<br/>font-any	default-
///<br/><br/>
///Font color of the text in all series.
///<br/>color-string	default-#707070
///<br/><br/>
///Font Family for all the series.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the font Style for all the series.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-normal
///<br/><br/>
///Specifies the font weight for all the series.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-regular
///<br/><br/>
///Opacity for text in all the series.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size for text in all the series.
///<br/>size-string	default-12px
///<br/><br/>
///Sets the height of the funnel in funnel series. Values can be either pixel or percentage.
///<br/>funnelHeight-string	default-32.7%
///<br/><br/>
///Sets the width of the funnel in funnel series. Values can be either pixel or percentage.
///<br/>funnelWidth-string	default-11.6%
///<br/><br/>
///Gap between the slices in pyramid and funnel series.
///<br/>gapRatio-number	default-0
///<br/><br/>
///Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
///<br/>isClosed-boolean	default-true
///<br/><br/>
///Specifies whether to stack the column series in polar/radar charts.
///<br/>isStacking-boolean	default-false
///<br/><br/>
///Renders the chart vertically. This is applicable only for Cartesian type series.
///<br/>isTransposed-boolean	default-false
///<br/><br/>
///Position of the data label in pie/doughnut/pyramid/funnel series. OutsideExtended position is not applicable for pyramid/funnel.
///<br/>labelPosition-ej.datavisualization.Chart.LabelPosition|string	default-inside. See LabelPosition
///<br/><br/>
///Specifies the line cap of the series.
///<br/>lineCap-ej.datavisualization.Chart.LineCap|string	default-butt. See LineCap
///<br/><br/>
///Specifies the type of shape to be used where two lines meet.
///<br/>lineJoin-ej.datavisualization.Chart.LineJoin|string	default-round. See LineJoin
///<br/><br/>
///Options for displaying and customizing marker for individual point in a series. Marker contains shapes and/or data labels.
///<br/>marker-any	default-
///<br/><br/>
///Options for customizing the border of the marker shape.
///<br/>border-any	default-
///<br/><br/>
///Border color of the marker shape.
///<br/>color-string	default-white
///<br/><br/>
///Border width of the marker shape.
///<br/>width-number	default-3
///<br/><br/>
///Options for displaying and customizing data labels.
///<br/>dataLabel-any	default-
///<br/><br/>
///Angle of the data label in degrees. Only the text gets rotated, whereas the background and border does not rotate.
///<br/>angle-number	default-null
///<br/><br/>
///Options for customizing the border of the data label.
///<br/>border-any	default-
///<br/><br/>
///Border color of the data label.
///<br/>color-string	default-null
///<br/><br/>
///Border width of the data label.
///<br/>width-number	default-0.1
///<br/><br/>
///Options for displaying and customizing the line that connects point and data label.
///<br/>connectorLine-any	default-
///<br/><br/>
///Specifies when the connector has to be drawn as Bezier curve or straight line. This is applicable only for Pie and Doughnut chart types.
///<br/>type-ej.datavisualization.Chart.ConnectorLineType|string	default-line. See ConnectorLineType
///<br/><br/>
///Width of the connector.
///<br/>width-number	default-0.5
///<br/><br/>
///Background color of the data label.
///<br/>fill-string	default-null
///<br/><br/>
///Options for customizing the data label font.
///<br/>font-any	default-
///<br/><br/>
///Font family of the data label.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the data label.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-normal. See FontStyle
///<br/><br/>
///Font weight of the data label.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-regular. See FontWeight
///<br/><br/>
///Opacity of the text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the data label.
///<br/>size-string	default-12px
///<br/><br/>
///Horizontal alignment of the data label.
///<br/>horizontalTextAlignment-ej.datavisualization.Chart.HorizontalTextAlignment|string	default-center
///<br/><br/>
///Margin of the text to its background shape. The size of the background shape increases based on the margin applied to its text.
///<br/>margin-any	default-
///<br/><br/>
///Bottom margin of the text.
///<br/>bottom-number	default-5
///<br/><br/>
///Left margin of the text.
///<br/>left-number	default-5
///<br/><br/>
///Right margin of the text.
///<br/>right-number	default-5
///<br/><br/>
///Top margin of the text.
///<br/>top-number	default-5
///<br/><br/>
///Opacity of the data label.
///<br/>opacity-number	default-1
///<br/><br/>
///Background shape of the data label.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-none. See Shape
///<br/><br/>
///Name of a field in data source, where datalabel text is displayed.
///<br/>textMappingName-string	default-
///<br/><br/>
///Specifies the position of the data label. This property can be used only for the series such as column, bar, stacked column, stacked bar, 100% stacked column, 100% stacked bar, candle and OHLC.
///<br/>textPosition-ej.datavisualization.Chart.TextPosition|string	default-top. See TextPosition
///<br/><br/>
///Vertical alignment of the data label.
///<br/>verticalTextAlignment-ej.datavisualization.Chart.VerticalTextAlignment|string	default-center
///<br/><br/>
///Controls the visibility of the data labels.
///<br/>visible-boolean	default-false
///<br/><br/>
///Color of the marker shape.
///<br/>fill-string	default-null
///<br/><br/>
///The URL for the Image to be displayed as marker. In order to display image as marker, set series.marker.shape as â€˜imageâ€™.
///<br/>imageUrl-string	default-
///<br/><br/>
///Opacity of the marker.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the shape of the marker.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-circle. See Shape
///<br/><br/>
///Options for customizing the size of the marker shape.
///<br/>size-any	default-
///<br/><br/>
///Height of the marker.
///<br/>height-number	default-6
///<br/><br/>
///Width of the marker.
///<br/>width-number	default-6
///<br/><br/>
///Controls the visibility of the marker shape.
///<br/>visible-boolean	default-false
///<br/><br/>
///Opacity of the series.
///<br/>opacity-number	default-1
///<br/><br/>
///Name of a field in data source, where the fill color for all the data points is generated.
///<br/>palette-string	default-
///<br/><br/>
///Controls the size of pie series. Value ranges from 0 to 1.
///<br/>pieCoefficient-number	default-0.8
///<br/><br/>
///Specifies the mode of the pyramid series.
///<br/>pyramidMode-ej.datavisualization.Chart.PyramidMode|string	default-linear. See PyramidMode
///<br/><br/>
///Start angle from where the pie/doughnut series renders. By default it starts from 0.
///<br/>startAngle-number	default-null
///<br/><br/>
///Options for customizing the tooltip of chart.
///<br/>tooltip-any	default-
///<br/><br/>
///Options for customizing the border of the tooltip.
///<br/>border-any	default-
///<br/><br/>
///Border color of the tooltip.
///<br/>color-string	default-null
///<br/><br/>
///Border width of the tooltip.
///<br/>width-number	default-1
///<br/><br/>
///Customize the corner radius of the tooltip rectangle.
///<br/>rx-number	default-0
///<br/><br/>
///Customize the corner radius of the tooltip rectangle.
///<br/>ry-number	default-0
///<br/><br/>
///Specifies the duration, the tooltip has to be displayed.
///<br/>duration-string	default-500ms
///<br/><br/>
///Enables/disables the animation of the tooltip when moving from one point to other.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Background color of the tooltip.
///<br/>fill-string	default-null
///<br/><br/>
///Format of the tooltip content.
///<br/>format-string	default-#point.x# : #point.y#
///<br/><br/>
///Opacity of the tooltip.
///<br/>opacity-number	default-0.5
///<br/><br/>
///Custom template to format the tooltip content. Use â€œpoint.xâ€ and â€œpoint.yâ€ as a placeholder text to display the corresponding data pointâ€™s x and y value.
///<br/>template-string	default-null
///<br/><br/>
///Controls the visibility of the tooltip.
///<br/>visible-boolean	default-false
///<br/><br/>
///Specifies the type of the series to render in chart.
///<br/>type-ej.datavisualization.Chart.Type|string	default-column. See Type
///<br/><br/>
///Specifies the name of the x-axis that has to be associated with this series. Add an axis instance with this name to axes collection.
///<br/>xAxisName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains x value for the series.
///<br/>xName-string	default-null
///<br/><br/>
///Specifies the name of the y-axis that has to be associated with this series. Add an axis instance with this name to axes collection.
///<br/>yAxisName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains y value for the series.
///<br/>yName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains high value for the series.
///<br/>high-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains low value for the series.
///<br/>low-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains open value for the series.
///<br/>open-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains close value for the series.
///<br/>close-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains the size value for the bubble series.
///<br/>size-string	default-null
///<br/><br/>
///Options for customizing the empty point in the series.
///<br/>emptyPointSettings-any	default-
///<br/><br/>
///Controls the visibility of the empty point.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the mode of empty point.
///<br/>displayMode-ej.datavisualization.Chart.EmptyPointMode|string	default-gap
///<br/><br/>
///Options for customizing the color and border of the empty point in the series.
///<br/>style-any	default-
///<br/><br/>
///Color of the empty point.
///<br/>color-string	default-
///<br/><br/>
///Options for customizing border of the empty point in the series.
///<br/>border-any	default-
///<br/><br/>
///Border color of the empty point.
///<br/>color-string	default-
///<br/><br/>
///Border width of the empty point.
///<br/>width-number	default-1
///<br/><br/>
///Fill color for the positive column of the waterfall.
///<br/>positiveFill-string	default-null
///<br/><br/>
///Options for customizing the waterfall connector line.
///<br/>connectorLine-any	default-
///<br/><br/>
///Width of the connector line.
///<br/>width-number	default-1
///<br/><br/>
///Color of the connector line.
///<br/>color-string	default-#565656
///<br/><br/>
///DashArray of the connector line.
///<br/>dashArray-string	default-null
///<br/><br/>
///DashArray of the connector line.
///<br/>opacity-number	default-1
///<br/><br/>
///Options to customize the error bar in series.
///<br/>errorBar-any	default-
///<br/><br/>
///Show/hides the error bar
///<br/>visibility-boolean	default-visible
///<br/><br/>
///Specifies the type of error bar.
///<br/>type-ej.datavisualization.Chart.ErrorBarType|string	default-FixedValue
///<br/><br/>
///Specifies the mode of error bar.
///<br/>mode-ej.datavisualization.Chart.ErrorBarMode|string	default-vertical
///<br/><br/>
///Specifies the direction of error bar.
///<br/>direction-ej.datavisualization.Chart.ErrorBarDirection|string	default-both
///<br/><br/>
///Value of vertical error bar.
///<br/>verticalErrorValue-number	default-3
///<br/><br/>
///Value of horizontal  error bar.
///<br/>horizontalErrorValue-number	default-1
///<br/><br/>
///Value of positive horizontal error bar.
///<br/>horizontalPositiveErrorValue-number	default-1
///<br/><br/>
///Value of negative horizontal error bar.
///<br/>horizontalNegativeErrorValue-number	default-1
///<br/><br/>
///Value of positive vertical error bar.
///<br/>verticalPositiveErrorValue-number	default-5
///<br/><br/>
///Value of negative vertical error bar.
///<br/>verticalNegativeErrorValue-number	default-5
///<br/><br/>
///Fill color of the error bar.
///<br/>fill-string	default-#000000
///<br/><br/>
///Width of the error bar.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the error bar cap.
///<br/>cap-any	default-
///<br/><br/>
///Show/Hides the error bar cap.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the error bar cap.
///<br/>width-number	default-1
///<br/><br/>
///Length of the error bar cap.
///<br/>length-number	default-1
///<br/><br/>
///Color of the error bar cap.
///<br/>fill-string	default-&#226;€œ#000000&#226;€
///<br/><br/>
///Option to add the trendlines to chart.
///<br/>trendlines-Array&lt;any&gt;	default-
///<br/><br/>
///Show/hides the trendline.
///<br/>visibility-boolean	default-
///<br/><br/>
///Specifies the type of the trendline for the series.
///<br/>type-string	default-linear. See TrendlinesType
///<br/><br/>
///Name for the trendlines that is to be displayed in the legend text.
///<br/>name-string	default-trendline
///<br/><br/>
///Fill color of the trendlines.
///<br/>fill-string	default-#0000FF
///<br/><br/>
///Width of the trendlines.
///<br/>width-number	default-1
///<br/><br/>
///Opacity of the trendline.
///<br/>opacity-number	default-1
///<br/><br/>
///Pattern of dashes and gaps used to stroke the trendline.
///<br/>dashArray-string	default-
///<br/><br/>
///Future trends of the current series.
///<br/>forwardForecast-number	default-0
///<br/><br/>
///Past trends of the current series.
///<br/>backwardForecast-number	default-0
///<br/><br/>
///Specifies the order of the polynomial trendlines.
///<br/>polynomialOrder-number	default-0
///<br/><br/>
///Specifies the moving average starting period value.
///<br/>period-number	default-2
///<br/><br/>
///Options for customizing the appearance of the series or data point while highlighting.
///<br/>highlightSettings-any	default-
///<br/><br/>
///Enables/disables the ability to highlight the series or data point interactively.
///<br/>enable-boolean	default-false
///<br/><br/>
///Specifies whether the series or data point has to be highlighted.
///<br/>mode-ej.datavisualization.Chart.Mode|string	default-series. See Mode
///<br/><br/>
///Color of the series/point on highlight.
///<br/>color-string	default-
///<br/><br/>
///Opacity of the series/point on highlight.
///<br/>opacity-number	default-0.6
///<br/><br/>
///Options for customizing the border of series on highlight.
///<br/>border-any	default-
///<br/><br/>
///Border color of the series/point on highlight.
///<br/>color-string	default-
///<br/><br/>
///Border width of the series/point on highlight.
///<br/>width-string	default-2
///<br/><br/>
///Specifies the pattern for the series/point on highlight.
///<br/>pattern-string	default-none. See Pattern
///<br/><br/>
///Custom pattern for the series on highlight.
///<br/>customPattern-string	default-
///<br/><br/>
///Options for customizing the appearance of the series/data point on selection.
///<br/>selectionSettings-any	default-
///<br/><br/>
///Enables/disables the ability to select a series/data point interactively.
///<br/>enable-boolean	default-false
///<br/><br/>
///Specifies the type of selection.
///<br/>type-ej.datavisualization.Chart.SelectionType|string	default-single
///<br/><br/>
///Specifies whether the series or data point has to be selected.
///<br/>mode-ej.datavisualization.Chart.Mode|string	default-series. See Mode
///<br/><br/>
///Specifies the drawn rectangle type.
///<br/>rangeType-ej.datavisualization.Chart.RangeType|string	default-xy
///<br/><br/>
///Color of the series/point on selection.
///<br/>color-string	default-
///<br/><br/>
///Opacity of the series/point on selection.
///<br/>opacity-number	default-0.6
///<br/><br/>
///Options for customizing the border of the series on selection.
///<br/>border-any	default-
///<br/><br/>
///Border color of the series/point on selection.
///<br/>color-string	default-
///<br/><br/>
///Border width of the series/point on selection.
///<br/>width-string	default-2
///<br/><br/>
///Specifies the pattern for the series/point on selection.
///<br/>pattern-string	default-none. See Pattern
///<br/><br/>
///Custom pattern for the series on selection.
///<br/>customPattern-string	default-
///<br/><br/>
///Options for displaying and customizing the crosshair.
///<br/>crosshair-Crosshair	default-
///<br/><br/>
///Options for customizing the marker in crosshair.
///<br/>marker-any	default-
///<br/><br/>
///Options for customizing the border.
///<br/>border-any	default-
///<br/><br/>
///Border width of the marker.
///<br/>width-number	default-3
///<br/><br/>
///Opacity of the marker.
///<br/>opacity-boolean	default-true
///<br/><br/>
///Options for customizing the size of the marker.
///<br/>size-any	default-
///<br/><br/>
///Height of the marker.
///<br/>height-number	default-10
///<br/><br/>
///Width of the marker.
///<br/>width-number	default-10
///<br/><br/>
///Show/hides the marker.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the type of the crosshair. It can be trackball or crosshair
///<br/>type-ej.datavisualization.Chart.CrosshairType|string	default-crosshair. See CrosshairType
///<br/><br/>
///Show/hides the crosshair/trackball visibility.
///<br/>visible-boolean	default-false
///<br/><br/>
///Depth of the 3D Chart from front view of series to background wall. This property is applicable only for 3D view.
///<br/>depth-number	default-100
///<br/><br/>
///Controls whether 3D view has to be enabled or not. 3D view is supported only for column, bar. Stacking column, stacking bar, pie and doughnut series types.
///<br/>enable3D-boolean	default-false
///<br/><br/>
///Controls whether Chart has to be rendered as Canvas or SVG. Canvas rendering supports all functionalities in SVG rendering except 3D Charts.
///<br/>enableCanvasRendering-boolean	default-false
///<br/><br/>
///Controls whether 3D view has to be rotated on dragging. This property is applicable only for 3D view.
///<br/>enableRotation-boolean	default-false
///<br/><br/>
///Options to customize the technical indicators.
///<br/>indicators-Array&lt;Indicators&gt;	default-
///<br/><br/>
///The dPeriod value for stochastic indicator.
///<br/>dPeriod-number	default-3
///<br/><br/>
///Enables/disables the animation.
///<br/>enableAnimation-boolean	default-false
///<br/><br/>
///Color of the technical indicator.
///<br/>fill-string	default-#00008B
///<br/><br/>
///Options to customize the histogram in MACD indicator.
///<br/>histogram-any	default-
///<br/><br/>
///Options to customize the histogram border in MACD indicator.
///<br/>border-any	default-
///<br/><br/>
///Color of the histogram border in MACD indicator.
///<br/>color-string	default-#9999ff
///<br/><br/>
///Controls the width of histogram border line in MACD indicator.
///<br/>width-number	default-1
///<br/><br/>
///Color of histogram columns in MACD indicator.
///<br/>fill-string	default-#ccccff
///<br/><br/>
///Opacity of histogram columns in MACD indicator.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the k period in stochastic indicator.
///<br/>kPeriod-number	default-3
///<br/><br/>
///Specifies the long period in MACD indicator.
///<br/>longPeriod-number	default-26
///<br/><br/>
///Options to customize the lower line in indicators.
///<br/>lowerLine-any	default-
///<br/><br/>
///Color of lower line.
///<br/>fill-string	default-#008000
///<br/><br/>
///Width of the lower line.
///<br/>width-number	default-2
///<br/><br/>
///Options to customize the MACD line.
///<br/>macdLine-any	default-
///<br/><br/>
///Color of MACD line.
///<br/>fill-string	default-#ff9933
///<br/><br/>
///Width of the MACD line.
///<br/>width-number	default-2
///<br/><br/>
///Specifies the type of the MACD indicator.
///<br/>macdType-string	default-line. See MACDType
///<br/><br/>
///Specifies period value in indicator.
///<br/>period-number	default-14
///<br/><br/>
///Options to customize the period line in indicators.
///<br/>periodLine-any	default-
///<br/><br/>
///Color of period line in indicator.
///<br/>fill-string	default-blue
///<br/><br/>
///Width of the period line in indicators.
///<br/>width-number	default-2
///<br/><br/>
///Name of the series for which indicator has to be drawn.
///<br/>seriesName-string	default-
///<br/><br/>
///Specifies the short period in MACD indicator.
///<br/>shortPeriod-number	default-13
///<br/><br/>
///Specifies the standard deviation value for Bollinger band indicator.
///<br/>standardDeviations-number	default-2
///<br/><br/>
///Options to customize the tooltip.
///<br/>tooltip-any	default-
///<br/><br/>
///Option to customize the border of indicator tooltip.
///<br/>border-any	default-
///<br/><br/>
///Border color of indicator tooltip.
///<br/>color-string	default-null
///<br/><br/>
///Border width of indicator tooltip.
///<br/>width-number	default-1
///<br/><br/>
///Specifies the animation duration of indicator tooltip.
///<br/>duration-string	default-500ms
///<br/><br/>
///Enables/disables the tooltip animation.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Format of indicator tooltip. Use â€œpoint.xâ€ and â€œpoint.yâ€ as a placeholder text to display the corresponding data pointâ€™s x and y value.
///<br/>format-string	default-#point.x# : #point.y#
///<br/><br/>
///Background color of indicator tooltip.
///<br/>fill-string	default-null
///<br/><br/>
///Opacity of indicator tooltip.
///<br/>opacity-number	default-0.95
///<br/><br/>
///Controls the visibility of indicator tooltip.
///<br/>visible-boolean	default-false
///<br/><br/>
///Trigger value of MACD indicator.
///<br/>trigger-number	default-9
///<br/><br/>
///Specifies the visibility of indicator.
///<br/>visibility-string	default-visible
///<br/><br/>
///Specifies the type of indicator that has to be rendered.
///<br/>type-string	default-sma. See IndicatorsType
///<br/><br/>
///Options to customize the upper line in indicators
///<br/>upperLine-any	default-
///<br/><br/>
///Fill color of the upper line in indicators
///<br/>fill-string	default-#ff9933
///<br/><br/>
///Width of the upper line in indicators.
///<br/>width-number	default-2
///<br/><br/>
///Width of the indicator line.
///<br/>width-number	default-2
///<br/><br/>
///Name of the horizontal axis used for indicator. Primary X axis is used when x axis name is not specified.
///<br/>xAxisName-string	default-
///<br/><br/>
///Name of the vertical axis used for indicator. Primary Y axis is used when y axis name is not specified
///<br/>yAxisName-string	default-
///<br/><br/>
///Controls whether Chart has to be responsive or not.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Options to customize the legend items and legend title.
///<br/>legend-Legend	default-
///<br/><br/>
///Horizontal alignment of the legend.
///<br/>alignment-ej.datavisualization.Chart.Alignment|string	default-Center. See Alignment
///<br/><br/>
///Background for the legend. Use this property to add a background image or background color for the legend.
///<br/>background-string	default-
///<br/><br/>
///Options for customizing the legend border.
///<br/>border-any	default-
///<br/><br/>
///Border color of the legend.
///<br/>color-string	default-transparent
///<br/><br/>
///Border width of the legend.
///<br/>width-number	default-1
///<br/><br/>
///Number of columns to arrange the legend items.
///<br/>columnCount-number	default-null
///<br/><br/>
///Controls whether legend has to use scrollbar or not. When enabled, scroll bar appears depending upon size and position properties of legend.
///<br/>enableScrollbar-boolean	default-true
///<br/><br/>
///Fill color for the legend items. By using this property, it displays all legend item shapes in same color.Legend items representing invisible series is displayed in gray color.
///<br/>fill-string	default-null
///<br/><br/>
///Options to customize the font used for legend item text.
///<br/>font-any	default-
///<br/><br/>
///Font family for legend item text.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style for legend item text.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal. See FontStyle
///<br/><br/>
///Font weight for legend item text.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-Regular. See FontWeight
///<br/><br/>
///Font size for legend item text.
///<br/>size-string	default-12px
///<br/><br/>
///Gap or padding between the legend items.
///<br/>itemPadding-number	default-10
///<br/><br/>
///Options to customize the style of legend items.
///<br/>itemStyle-any	default-
///<br/><br/>
///Options for customizing the border of legend items.
///<br/>border-any	default-
///<br/><br/>
///Border color of the legend items.
///<br/>color-string	default-transparent
///<br/><br/>
///Border width of the legend items.
///<br/>width-number	default-1
///<br/><br/>
///Height of the shape in legend items.
///<br/>height-number	default-10
///<br/><br/>
///Width of the shape in legend items.
///<br/>width-number	default-10
///<br/><br/>
///Options to customize the location of chart legend. Legend is placed in provided location only when value of position property is custom
///<br/>location-any	default-
///<br/><br/>
///X value or horizontal offset to position the legend in chart.
///<br/>x-number	default-0
///<br/><br/>
///Y value or vertical offset to position the legend.
///<br/>y-number	default-0
///<br/><br/>
///Opacity of the legend.
///<br/>opacity-number	default-1
///<br/><br/>
///Places the legend at specified position. Legend can be placed at left, right, top or bottom of the chart area.To manually specify the location of legend, set custom as value to this property.
///<br/>position-ej.datavisualization.Chart.Position|string	default-Bottom. See Position
///<br/><br/>
///Number of rows to arrange the legend items.
///<br/>rowCount-number	default-null
///<br/><br/>
///Shape of the legend items. Default shape for pie and doughnut series is circle and all other series uses rectangle.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-None. See Shape
///<br/><br/>
///Options to customize the size of the legend.
///<br/>size-any	default-
///<br/><br/>
///Height of the legend. Height can be specified in either pixel or percentage.
///<br/>height-string	default-null
///<br/><br/>
///Width of the legend. Width can be specified in either pixel or percentage.
///<br/>width-string	default-null
///<br/><br/>
///Options to customize the legend title.
///<br/>title-any	default-
///<br/><br/>
///Options to customize the font used for legend title
///<br/>font-any	default-
///<br/><br/>
///Font family for the text in legend title.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style for legend title.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-normal. See FontStyle
///<br/><br/>
///Font weight for legend title.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-normal. See FontWeight
///<br/><br/>
///Font size for legend title.
///<br/>size-string	default-12px
///<br/><br/>
///Background color for the chart title.
///<br/>background-string	default-transparent
///<br/><br/>
///Options to customize the border of the title.
///<br/>border-any	default-
///<br/><br/>
///Width of the title border.
///<br/>width-number	default-1
///<br/><br/>
///color of the title border.
///<br/>color-string	default-transparent
///<br/><br/>
///opacity of the title border.
///<br/>opacity-number	default-0.8
///<br/><br/>
///opacity of the title border.
///<br/>cornerRadius-number	default-0.8
///<br/><br/>
///Text to be displayed in legend title.
///<br/>text-string	default-
///<br/><br/>
///Alignment of the legend title.
///<br/>textAlignment-ej.datavisualization.Chart.Alignment|string	default-center. See Alignment
///<br/><br/>
///Specifies the action taken when the legend width is more than the textWidth.
///<br/>textOverflow-ej.datavisualization.Chart.TextOverflow|string	default-none. See textOverflow
///<br/><br/>
///Text width for legend item.
///<br/>textWidth-number	default-34
///<br/><br/>
///Controls the visibility of the legend.
///<br/>visible-boolean	default-true
///<br/><br/>
///Name of the culture based on which chart should be localized. Number and date time values are localized with respect to the culture name.String type properties like title text are not localized automatically. Provide localized text as value to string type properties.
///<br/>locale-string	default-en-US
///<br/><br/>
///Palette is used to store the series fill color in array and apply the color to series collection in the order of series index.
///<br/>palette-Array&lt;any&gt;	default-null
///<br/><br/>
///Options to customize the left, right, top and bottom margins of chart area.
///<br/>Margin-any	default-
///<br/><br/>
///Spacing for the left margin of chart area. Setting positive value decreases the width of the chart area from left side.
///<br/>margin.left-number	default-10
///<br/><br/>
///Spacing for the right margin of chart area. Setting positive value decreases the width of the chart area from right side.
///<br/>margin.right-number	default-10
///<br/><br/>
///Spacing for the top margin of chart area. Setting positive value decreases the height of the chart area from the top.
///<br/>margin.top-number	default-10
///<br/><br/>
///Spacing for the bottom margin of the chart area. Setting positive value decreases the height of the chart area from the bottom.
///<br/>margin.bottom-number	default-10
///<br/><br/>
///Perspective angle of the 3D view. Chart appears closer when perspective angle is decreased, and distant when perspective angle is increased.This property is applicable only when 3D view is enabled
///<br/>perspectiveAngle-number	default-90
///<br/><br/>
///This is a horizontal axis that contains options to configure axis and it is the primary x axis for all the series in series array. To override x axis for particular series, create an axis object by providing unique name by using name property and add it to axes array. Then, assign the name to the seriesâ€™s xAxisName property to link both axis and series.
///<br/>primaryXAxis-PrimaryXAxis	default-
///<br/><br/>
///Options for customizing horizontal axis alternate grid band.
///<br/>alternateGridBand-any	default-
///<br/><br/>
///Options for customizing even grid band.
///<br/>even-any	default-
///<br/><br/>
///Fill color for the even grid bands.
///<br/>fill-string	default-transparent
///<br/><br/>
///Opacity of the even grid band.
///<br/>opacity-number	default-1
///<br/><br/>
///Options for customizing odd grid band.
///<br/>odd-any	default-
///<br/><br/>
///Fill color of the odd grid bands
///<br/>fill-string	default-transparent
///<br/><br/>
///Opacity of odd grid band
///<br/>opacity-number	default-1
///<br/><br/>
///Category axis can also plot points based on index value of data points. Index based plotting can be enabled by setting â€˜isIndexedâ€™ property to true.
///<br/>isIndexed-boolean	default-false
///<br/><br/>
///Options for customizing the axis line.
///<br/>axisLine-any	default-
///<br/><br/>
///Pattern of dashes and gaps to be applied to the axis line.
///<br/>dashArray-string	default-null
///<br/><br/>
///Padding for axis line. Normally, it is used along with plotOffset to pad the plot area.
///<br/>offset-number	default-null
///<br/><br/>
///Show/hides the axis line.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of axis line.
///<br/>width-number	default-1
///<br/><br/>
///Specifies the index of the column where the axis is associated, when the chart area is divided into multiple plot areas by using columnDefinitions.
///<br/>columnIndex-number	default-null
///<br/><br/>
///Specifies the number of columns or plot areas an axis has to span horizontally.
///<br/>columnSpan-number	default-null
///<br/><br/>
///Options to customize the crosshair label.
///<br/>crosshairLabel-any	default-
///<br/><br/>
///Show/hides the crosshair label associated with this axis.
///<br/>visible-boolean	default-false
///<br/><br/>
///With this setting, you can request axis to calculate intervals approximately equal to your desired interval.
///<br/>desiredIntervals-number	default-null
///<br/><br/>
///Specifies the position of labels at the edge of the axis.
///<br/>edgeLabelPlacement-ej.datavisualization.Chart.EdgeLabelPlacement|string	default-ej.datavisualization.Chart.EdgeLabelPlacement.None. See EdgeLabelPlacement
///<br/><br/>
///Specifies whether to trim the axis label when the width of the label exceeds the maximumLabelWidth.
///<br/>enableTrim-boolean	default-false
///<br/><br/>
///Options for customizing the font of the axis Labels.
///<br/>font-any	default-
///<br/><br/>
///Font family of labels.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of labels.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-ej.datavisualization.Chart.FontStyle.Normal. See FontStyle
///<br/><br/>
///Font weight of the label.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-ej.datavisualization.Chart.FontWeight.Regular. See FontWeight
///<br/><br/>
///Opacity of the axis labels.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the axis labels.
///<br/>size-string	default-13px
///<br/><br/>
///Specifies the type of interval in date time axis.
///<br/>intervalType-ej.datavisualization.Chart.IntervalType|string	default-null. See IntervalType
///<br/><br/>
///Specifies whether to inverse the axis.
///<br/>isInversed-boolean	default-false
///<br/><br/>
///Custom formatting for axis label and supports all standard formatting type of numerical and date time values.
///<br/>labelFormat-string	default-null
///<br/><br/>
///Specifies the action to take when the axis labels are overlapping with each other.
///<br/>labelIntersectAction-ej.datavisualization.Chart.LabelIntersectAction|string	default-ej.datavisualization.Chart.LabelIntersectAction.None. See LabelIntersectAction
///<br/><br/>
///Specifies the position of the axis labels.
///<br/>labelPosition-ej.datavisualization.Chart.LabelPosition|string	default-outside. See LabelPosition
///<br/><br/>
///Angle in degrees to rotate the axis labels.
///<br/>labelRotation-number	default-null
///<br/><br/>
///Logarithmic base value. This is applicable only for logarithmic axis.
///<br/>logBase-number	default-10
///<br/><br/>
///Options for customizing major gird lines.
///<br/>majorGridLines-any	default-
///<br/><br/>
///Pattern of dashes and gaps used to stroke the major grid lines.
///<br/>dashArray-string	default-null
///<br/><br/>
///Opacity of major grid lines.
///<br/>opacity-number	default-1
///<br/><br/>
///Show/hides the major grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the major grid lines.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the major tick lines.
///<br/>majorTickLines-any	default-
///<br/><br/>
///Length of the major tick lines.
///<br/>size-number	default-5
///<br/><br/>
///Show/hides the major tick lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the major tick lines.
///<br/>width-number	default-1
///<br/><br/>
///Maximum number of labels to be displayed in every 100 pixels.
///<br/>maximumLabels-number	default-3
///<br/><br/>
///Maximum width of the axis label. When the label exceeds the width, the label gets trimmed when the enableTrim is set to true.
///<br/>maximumLabelWidth-number	default-34
///<br/><br/>
///Options for customizing the minor grid lines.
///<br/>minorGridLines-any	default-
///<br/><br/>
///Patterns of dashes and gaps used to stroke the minor grid lines.
///<br/>dashArray-string	default-null
///<br/><br/>
///Show/hides the minor grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the minorGridLines.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the minor tick lines.
///<br/>minorTickLines-any	default-
///<br/><br/>
///Length of the minor tick lines.
///<br/>size-number	default-5
///<br/><br/>
///Show/hides the minor tick lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the minor tick line.
///<br/>width-number	default-1
///<br/><br/>
///Specifies the number of minor ticks per interval.
///<br/>minorTicksPerInterval-number	default-null
///<br/><br/>
///Unique name of the axis. To associate an axis with the series, you have to set this name to the xAxisName/yAxisName property of the series.
///<br/>name-string	default-null
///<br/><br/>
///Specifies whether to render the axis at the opposite side of its default position.
///<br/>opposedPosition-boolean	default-false
///<br/><br/>
///Specifies the padding for the plot area.
///<br/>plotOffset-number	default-10
///<br/><br/>
///Options to customize the range of the axis.
///<br/>range-any	default-
///<br/><br/>
///Minimum value of the axis range.
///<br/>minimum-number	default-null
///<br/><br/>
///Maximum value of the axis range.
///<br/>maximum-number	default-null
///<br/><br/>
///Interval of the axis range.
///<br/>interval-number	default-null
///<br/><br/>
///Specifies the padding for the axis range.
///<br/>rangePadding-ej.datavisualization.Chart.RangePadding|string	default-None. See RangePadding
///<br/><br/>
///Rounds the number to the given number of decimals.
///<br/>roundingPlaces-number	default-null
///<br/><br/>
///Options for customizing the strip lines.
///<br/>stripLine-Array&lt;any&gt;	default-[ ]
///<br/><br/>
///Border color of the strip line.
///<br/>borderColor-string	default-gray
///<br/><br/>
///Background color of the strip line.
///<br/>color-string	default-gray
///<br/><br/>
///End value of the strip line.
///<br/>end-number	default-null
///<br/><br/>
///Options for customizing the font of the text.
///<br/>font-any	default-
///<br/><br/>
///Font color of the strip line text.
///<br/>color-string	default-black
///<br/><br/>
///Font family of the strip line text.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the strip line text.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal
///<br/><br/>
///Font weight of the strip line text.
///<br/>fontWeight-string	default-regular
///<br/><br/>
///Opacity of the strip line text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the strip line text.
///<br/>size-string	default-12px
///<br/><br/>
///Start value of the strip line.
///<br/>start-number	default-null
///<br/><br/>
///Indicates whether to render the strip line from the minimum/start value of the axis. This property does not work when start property is set.
///<br/>startFromAxis-boolean	default-false
///<br/><br/>
///Specifies text to be displayed inside the strip line.
///<br/>text-string	default-stripLine
///<br/><br/>
///Specifies the alignment of the text inside the strip line.
///<br/>textAlignment-ej.datavisualization.Chart.TextAlignment|string	default-middlecenter. See TextAlignment
///<br/><br/>
///Show/hides the strip line.
///<br/>visible-boolean	default-false
///<br/><br/>
///Width of the strip line.
///<br/>width-number	default-0
///<br/><br/>
///Specifies the order where the strip line and the series have to be rendered. When Z-order is â€œbehindâ€, strip line is rendered under the series and when it is â€œoverâ€, it is rendered above the series.
///<br/>zIndex-ej.datavisualization.Chart.ZIndex|string	default-over. See ZIndex
///<br/><br/>
///Specifies the position of the axis tick lines.
///<br/>tickLinesPosition-ej.datavisualization.Chart.TickLinesPosition|string	default-outside. See TickLinesPosition
///<br/><br/>
///Options for customizing the axis title.
///<br/>title-any	default-
///<br/><br/>
///Specifies whether to trim the axis title when it exceeds the chart area or the maximum width of the title.
///<br/>enableTrim-boolean	default-false
///<br/><br/>
///Options for customizing the title font.
///<br/>font-any	default-
///<br/><br/>
///Font family of the title text.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the title text.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-ej.datavisualization.Chart.FontStyle.Normal
///<br/><br/>
///Font weight of the title text.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-ej.datavisualization.Chart.FontWeight.Regular. See FontWeight
///<br/><br/>
///Opacity of the axis title text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the axis title.
///<br/>size-string	default-16px
///<br/><br/>
///Maximum width of the title, when the title exceeds this width, the title gets trimmed, when enableTrim is true.
///<br/>maximumTitleWidth-number	default-34
///<br/><br/>
///Title for the axis.
///<br/>text-string	default-
///<br/><br/>
///Controls the visibility of axis title.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the type of data the axis is handling.
///<br/>valueType-ej.datavisualization.Chart.ValueType|string	default-null. See ValueType
///<br/><br/>
///Show/hides the axis.
///<br/>visible-boolean	default-true
///<br/><br/>
///The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
///<br/>zoomFactor-number	default-1
///<br/><br/>
///Position of the zoomed axis. Value ranges from 0 to 1.
///<br/>zoomPosition-number	default-0
///<br/><br/>
///This is a vertical axis that contains options to configure axis. This is the primary y axis for all the series in series array. To override y axis for particular series, create an axis object by providing unique name by using name property and add it to axes array. Then, assign the name to the seriesâ€™s yAxisName property to link both axis and series.
///<br/>primaryYAxis-PrimaryYAxis	default-
///<br/><br/>
///Options for customizing vertical axis alternate grid band.
///<br/>alternateGridBand-any	default-
///<br/><br/>
///Options for customizing even grid band.
///<br/>even-any	default-
///<br/><br/>
///Fill color for the even grid bands.
///<br/>fill-string	default-transparent
///<br/><br/>
///Opacity of the even grid band.
///<br/>opacity-number	default-1
///<br/><br/>
///Options for customizing odd grid band.
///<br/>odd-any	default-
///<br/><br/>
///Fill color of the odd grid bands.
///<br/>fill-string	default-transparent
///<br/><br/>
///Opacity of odd grid band.
///<br/>opacity-number	default-1
///<br/><br/>
///Options for customizing the axis line.
///<br/>axisLine-any	default-
///<br/><br/>
///Pattern of dashes and gaps to be applied to the axis line.
///<br/>dashArray-string	default-null
///<br/><br/>
///Padding for axis line. Normally, it is used along with plotOffset to pad the plot area.
///<br/>offset-number	default-null
///<br/><br/>
///Show/hides the axis line.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of axis line.
///<br/>width-number	default-1
///<br/><br/>
///Options to customize the crosshair label.
///<br/>crosshairLabel-any	default-
///<br/><br/>
///Show/hides the crosshair label associated with this axis.
///<br/>visible-boolean	default-false
///<br/><br/>
///With this setting, you can request axis to calculate intervals approximately equal to your desired interval.
///<br/>desiredIntervals-number	default-null
///<br/><br/>
///Specifies the position of labels at the edge of the axis.
///<br/>edgeLabelPlacement-ej.datavisualization.Chart.EdgeLabelPlacement|string	default-ej.datavisualization.Chart.EdgeLabelPlacement.None. See EdgeLabelPlacement
///<br/><br/>
///Specifies whether to trim the axis label when the width of the label exceeds the maximumLabelWidth.
///<br/>enableTrim-boolean	default-false
///<br/><br/>
///Options for customizing the font of the axis Labels.
///<br/>font-any	default-
///<br/><br/>
///Font family of labels.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of labels.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-ej.datavisualization.Chart.FontStyle.Normal. See FontStyle
///<br/><br/>
///Font weight of the label.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-ej.datavisualization.Chart.FontWeight.Regular. See FontWeight
///<br/><br/>
///Opacity of the axis labels.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the axis labels.
///<br/>size-string	default-13px
///<br/><br/>
///Specifies the type of interval in date time axis.
///<br/>intervalType-ej.datavisualization.Chart.IntervalType|string	default-null. See IntervalType
///<br/><br/>
///Specifies whether to inverse the axis.
///<br/>isInversed-boolean	default-false
///<br/><br/>
///Custom formatting for axis label and supports all standard formatting type of numerical and date time values.
///<br/>labelFormat-string	default-null
///<br/><br/>
///Specifies the action to take when the axis labels are overlapping with each other.
///<br/>labelIntersectAction-ej.datavisualization.Chart.LabelIntersectAction|string	default-ej.datavisualization.Chart.LabelIntersectAction.None
///<br/><br/>
///Specifies the position of the axis labels.
///<br/>labelPosition-ej.datavisualization.Chart.LabelPosition|string	default-outside. See LabelPosition
///<br/><br/>
///Logarithmic base value. This is applicable only for logarithmic axis.
///<br/>logBase-number	default-10
///<br/><br/>
///Options for customizing major gird lines.
///<br/>majorGridLines-any	default-
///<br/><br/>
///Pattern of dashes and gaps used to stroke the major grid lines.
///<br/>dashArray-string	default-null
///<br/><br/>
///Opacity of major grid lines.
///<br/>opacity-number	default-1
///<br/><br/>
///Show/hides the major grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the major grid lines.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the major tick lines.
///<br/>majorTickLines-any	default-
///<br/><br/>
///Length of the major tick lines.
///<br/>size-number	default-5
///<br/><br/>
///Show/hides the major tick lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the major tick lines.
///<br/>width-number	default-1
///<br/><br/>
///Maximum number of labels to be displayed in every 100 pixels.
///<br/>maximumLabels-number	default-3
///<br/><br/>
///Maximum width of the axis label. When the label exceeds the width, the label gets trimmed when the enableTrim is set to true.
///<br/>maximumLabelWidth-number	default-ej.datavisualization.Chart.maximumLabelWidth type {int}
///<br/><br/>
///Options for customizing the minor grid lines.
///<br/>minorGridLines-any	default-
///<br/><br/>
///Patterns of dashes and gaps used to stroke the minor grid lines.
///<br/>dashArray-string	default-null
///<br/><br/>
///Show/hides the minor grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the minorGridLines.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the minor tick lines.
///<br/>minorTickLines-any	default-
///<br/><br/>
///Length of the minor tick lines.
///<br/>size-number	default-5
///<br/><br/>
///Show/hides the minor tick lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the minor tick line
///<br/>width-number	default-1
///<br/><br/>
///Specifies the number of minor ticks per interval.
///<br/>minorTicksPerInterval-number	default-null
///<br/><br/>
///Unique name of the axis. To associate an axis with the series, you have to set this name to the xAxisName/yAxisName property of the series.
///<br/>name-string	default-null
///<br/><br/>
///Specifies whether to render the axis at the opposite side of its default position.
///<br/>opposedPosition-boolean	default-false
///<br/><br/>
///Specifies the padding for the plot area.
///<br/>plotOffset-number	default-10
///<br/><br/>
///Specifies the padding for the axis range.
///<br/>rangePadding-ej.datavisualization.Chart.RangePadding|string	default-ej.datavisualization.Chart.RangePadding.None. See RangePadding
///<br/><br/>
///Rounds the number to the given number of decimals.
///<br/>roundingPlaces-number	default-null
///<br/><br/>
///Specifies the index of the row to which the axis is associated, when the chart area is divided into multiple plot areas by using rowDefinitions.
///<br/>rowIndex-number	default-null
///<br/><br/>
///Specifies the number of row or plot areas an axis has to span vertically.
///<br/>rowSpan-number	default-null
///<br/><br/>
///Options for customizing the strip lines.
///<br/>stripLine-Array&lt;any&gt;	default-[ ]
///<br/><br/>
///Border color of the strip line.
///<br/>borderColor-string	default-gray
///<br/><br/>
///Background color of the strip line.
///<br/>color-string	default-gray
///<br/><br/>
///End value of the strip line.
///<br/>end-number	default-null
///<br/><br/>
///Options for customizing the font of the text.
///<br/>font-any	default-
///<br/><br/>
///Font color of the strip line text.
///<br/>color-string	default-black
///<br/><br/>
///Font family of the strip line text.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the strip line text.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal
///<br/><br/>
///Font weight of the strip line text.
///<br/>fontWeight-string	default-regular
///<br/><br/>
///Opacity of the strip line text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the strip line text.
///<br/>size-string	default-12px
///<br/><br/>
///Start value of the strip line.
///<br/>start-number	default-null
///<br/><br/>
///Indicates whether to render the strip line from the minimum/start value of the axis. This property wonâ€™t work when start property is set.
///<br/>startFromAxis-boolean	default-false
///<br/><br/>
///Specifies text to be displayed inside the strip line.
///<br/>text-string	default-stripLine
///<br/><br/>
///Specifies the alignment of the text inside the strip line.
///<br/>textAlignment-ej.datavisualization.Chart.TextAlignment|string	default-middlecenter. See TextAlignment
///<br/><br/>
///Show/hides the strip line.
///<br/>visible-boolean	default-false
///<br/><br/>
///Width of the strip line.
///<br/>width-number	default-0
///<br/><br/>
///Specifies the order in which strip line and the series have to be rendered. When Z-order is â€œbehindâ€, strip line is rendered below the series and when it is â€œoverâ€, it is rendered above the series.
///<br/>zIndex-ej.datavisualization.Chart.ZIndex|string	default-over. See ZIndex
///<br/><br/>
///Specifies the position of the axis tick lines.
///<br/>tickLinesPosition-ej.datavisualization.Chart.TickLinesPosition|string	default-outside. See TickLinesPosition
///<br/><br/>
///Options for customizing the axis title.
///<br/>title-any	default-
///<br/><br/>
///Specifies whether to trim the axis title when it exceeds the chart area or the maximum width of the title.
///<br/>enableTrim-boolean	default-ej.datavisualization.Chart.enableTrim
///<br/><br/>
///Options for customizing the title font.
///<br/>font-any	default-
///<br/><br/>
///Font family of the title text.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the title text.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-ej.datavisualization.Chart.FontStyle.Normal
///<br/><br/>
///Font weight of the title text.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-ej.datavisualization.Chart.FontWeight.Regular. See FontWeight
///<br/><br/>
///Opacity of the axis title text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the axis title.
///<br/>size-string	default-16px
///<br/><br/>
///Maximum width of the title, when the title exceeds this width, the title gets trimmed, when enableTrim is true.
///<br/>maximumTitleWidth-number	default-ej.datavisualization.Chart.maximumTitleWidth.null
///<br/><br/>
///Title for the axis.
///<br/>text-string	default-
///<br/><br/>
///Controls the visibility of axis title.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the type of data the axis is handling.
///<br/>valueType-ej.datavisualization.Chart.ValueType|string	default-null. See ValueType
///<br/><br/>
///Show/hides the axis.
///<br/>visible-boolean	default-true
///<br/><br/>
///The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Values ranges from 0 to 1.
///<br/>zoomFactor-number	default-1
///<br/><br/>
///Position of the zoomed axis. Value ranges from 0 to 1
///<br/>zoomPosition-number	default-0
///<br/><br/>
///Rotation angle of the 3D view. This property is applicable only when 3D view is enabled.
///<br/>rotation-number	default-0
///<br/><br/>
///Options to split Chart into multiple plotting areas horizontally. Each object in the collection represents a plotting area in Chart.
///<br/>rowDefinitions-Array&lt;RowDefinitions&gt;	default-
///<br/><br/>
///Specifies the unit to measure the height of the row in plotting area.
///<br/>unit-ej.datavisualization.Chart.Unit|string	default-&#39;pixel&#39;. See Unit
///<br/><br/>
///Height of the row in plotting area. Height is measured in either pixel or percentage based on the value of unit property.
///<br/>rowHeight-number	default-50
///<br/><br/>
///Color of the line that indicates the starting point of the row in plotting area.
///<br/>lineColor-string	default-transparent
///<br/><br/>
///Width of the line that indicates the starting point of the row in plot area.
///<br/>lineWidth-number	default-1
///<br/><br/>
///Specifies the properties used for customizing the series.
///<br/>series-Array&lt;Series&gt;	default-
///<br/><br/>
///Color of the point, where the close is up in financial chart.
///<br/>bearFillColor-string	default-null
///<br/><br/>
///Options for customizing the border of the series.
///<br/>border-any	default-
///<br/><br/>
///Border color of the series.
///<br/>color-string	default-transparent
///<br/><br/>
///Border width of the series.
///<br/>width-number	default-1
///<br/><br/>
///DashArray for border of the series.
///<br/>dashArray-string	default-null
///<br/><br/>
///Color of the point, where the close is down in financial chart.
///<br/>bullFillColor-string	default-null
///<br/><br/>
///Pattern of dashes and gaps used to stroke the line type series.
///<br/>dashArray-string	default-
///<br/><br/>
///Specifies the dataSource for the series. It can be an array of JSON objects or an instance of ej.DataManager.
///<br/>dataSource-any	default-null
///<br/><br/>
///Controls the size of the hole in doughnut series. Value ranges from 0 to 1.
///<br/>doughnutCoefficient-number	default-0.4
///<br/><br/>
///Controls the size of the doughnut series. Value ranges from 0 to 1.
///<br/>doughnutSize-number	default-0.8
///<br/><br/>
///Type of series to be drawn in radar or polar series.
///<br/>drawType-boolean	default-line. See DrawType
///<br/><br/>
///Enable/disable the animation of series.
///<br/>enableAnimation-boolean	default-false
///<br/><br/>
///To avoid overlapping of data labels smartly.
///<br/>enableSmartLabels-number	default-null
///<br/><br/>
///End angle of pie/doughnut series. For a complete circle, it has to be 360, by default.
///<br/>endAngle-number	default-null
///<br/><br/>
///Explodes the pie/doughnut slices on mouse move.
///<br/>explode-boolean	default-false
///<br/><br/>
///Explodes all the slice of pie/doughnut on render.
///<br/>explodeAll-boolean	default-null
///<br/><br/>
///Index of the point to be exploded from pie/doughnut/pyramid/funnel.
///<br/>explodeIndex-number	default-null
///<br/><br/>
///Specifies the distance of the slice from the center, when it is exploded.
///<br/>explodeOffset-number	default-25
///<br/><br/>
///Fill color of the series.
///<br/>fill-string	default-null
///<br/><br/>
///Options for customizing the series font.
///<br/>font-any	default-
///<br/><br/>
///Font color of the series text.
///<br/>color-string	default-#707070
///<br/><br/>
///Font Family of the series.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font Style of the series.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal
///<br/><br/>
///Font weight of the series.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-Regular
///<br/><br/>
///Opacity of series text.
///<br/>opacity-number	default-1
///<br/><br/>
///Size of the series text.
///<br/>size-string	default-12px
///<br/><br/>
///Specifies the height of the funnel in funnel series. Values can be in both pixel and percentage.
///<br/>funnelHeight-string	default-32.7%
///<br/><br/>
///Specifies the width of the funnel in funnel series. Values can be in both pixel and percentage.
///<br/>funnelWidth-string	default-11.6%
///<br/><br/>
///Gap between the slices of pyramid/funnel series.
///<br/>gapRatio-number	default-0
///<br/><br/>
///Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
///<br/>isClosed-boolean	default-true
///<br/><br/>
///Specifies whether to stack the column series in polar/radar charts.
///<br/>isStacking-boolean	default-true
///<br/><br/>
///Renders the chart vertically. This is applicable only for Cartesian type series.
///<br/>isTransposed-boolean	default-false
///<br/><br/>
///Position of the data label in pie/doughnut/pyramid/funnel series. OutsideExtended position is not applicable for pyramid/funnel.
///<br/>labelPosition-ej.datavisualization.Chart.LabelPosition|string	default-inside. See LabelPosition
///<br/><br/>
///Specifies the line cap of the series.
///<br/>lineCap-ej.datavisualization.Chart.LineCap|string	default-Butt. See LineCap
///<br/><br/>
///Specifies the type of shape to be used where two lines meet.
///<br/>lineJoin-ej.datavisualization.Chart.LineJoin|string	default-Round. See LineJoin
///<br/><br/>
///Options for displaying and customizing marker for individual point in a series. Marker contains shapes and/or data labels.
///<br/>marker-any	default-
///<br/><br/>
///Options for customizing the border of the marker shape.
///<br/>border-any	default-
///<br/><br/>
///Border color of the marker shape.
///<br/>color-string	default-white
///<br/><br/>
///Border width of the marker shape.
///<br/>width-number	default-3
///<br/><br/>
///Options for displaying and customizing data labels.
///<br/>dataLabel-any	default-
///<br/><br/>
///Angle of the data label in degrees. Only the text gets rotated, whereas the background and border does not rotate.
///<br/>angle-number	default-null
///<br/><br/>
///Options for customizing the border of the data label.
///<br/>border-any	default-
///<br/><br/>
///Border color of the data label.
///<br/>color-string	default-null
///<br/><br/>
///Border width of the data label.
///<br/>width-number	default-0.1
///<br/><br/>
///Options for displaying and customizing the line that connects point and data label.
///<br/>connectorLine-any	default-
///<br/><br/>
///Specifies when the connector has to be drawn as Bezier curve or straight line. This is applicable only for Pie and Doughnut chart types.
///<br/>type-ej.datavisualization.Chart.Type|string	default-line. See ConnectorLineType
///<br/><br/>
///Width of the connector.
///<br/>width-number	default-0.5
///<br/><br/>
///Background color of the data label.
///<br/>fill-string	default-null
///<br/><br/>
///Options for customizing the data label font.
///<br/>font-any	default-
///<br/><br/>
///Font family of the data label.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the data label.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-normal. See FontStyle
///<br/><br/>
///Font weight of the data label.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-regular. See FontWeight
///<br/><br/>
///Opacity of the text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the data label.
///<br/>size-string	default-12px
///<br/><br/>
///Horizontal alignment of the data label.
///<br/>horizontalTextAlignment-ej.datavisualization.Chart.HorizontalTextAlignment|string	default-center
///<br/><br/>
///Margin of the text to its background shape. The size of the background shape increases based on the margin applied to its text.
///<br/>margin-any	default-
///<br/><br/>
///Bottom margin of the text.
///<br/>bottom-number	default-5
///<br/><br/>
///Left margin of the text.
///<br/>left-number	default-5
///<br/><br/>
///Right margin of the text.
///<br/>right-number	default-5
///<br/><br/>
///Top margin of the text.
///<br/>top-number	default-5
///<br/><br/>
///Opacity of the data label.
///<br/>opacity-number	default-1
///<br/><br/>
///Background shape of the data label.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-No shape is rendered by default, so its value is &#226;€˜none&#226;€™. See Shape
///<br/><br/>
///Name of a field in data source where datalabel text is displayed.
///<br/>textMappingName-string	default-
///<br/><br/>
///Specifies the position of the data label. This property can be used only for the series such as column, bar, stacked column, stacked bar, 100% stacked column, 100% stacked bar, candle and OHLC.
///<br/>textPosition-ej.datavisualization.Chart.TextPosition|string	default-top. See TextPosition
///<br/><br/>
///Vertical alignment of the data label.
///<br/>verticalTextAlignment-ej.datavisualization.Chart.VerticalTextAlignment|string	default-&#39;center&#39;
///<br/><br/>
///Controls the visibility of the data labels.
///<br/>visible-boolean	default-false
///<br/><br/>
///Custom template to format the data label content. Use â€œpoint.xâ€ and â€œpoint.yâ€ as a placeholder text to display the corresponding data pointâ€™s x and y value.
///<br/>template-string	default-
///<br/><br/>
///Moves the label vertically by some offset.
///<br/>offset-number	default-0
///<br/><br/>
///Color of the marker shape.
///<br/>fill-string	default-null
///<br/><br/>
///The URL for the Image that is to be displayed as marker. In order to display image as marker, set series.marker.shape as â€˜imageâ€™.
///<br/>imageUrl-string	default-
///<br/><br/>
///Opacity of the marker.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the shape of the marker.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-circle. See Shape
///<br/><br/>
///Options for customizing the size of the marker shape.
///<br/>size-any	default-
///<br/><br/>
///Height of the marker.
///<br/>height-number	default-6
///<br/><br/>
///Width of the marker.
///<br/>width-number	default-6
///<br/><br/>
///Controls the visibility of the marker shape.
///<br/>visible-boolean	default-false
///<br/><br/>
///Name of the series, that is to be displayed in the legend.
///<br/>name-string	default-
///<br/><br/>
///Opacity of the series.
///<br/>opacity-number	default-1
///<br/><br/>
///Name of a field in data source where fill color for all the data points is generated.
///<br/>palette-string	default-
///<br/><br/>
///Controls the size of pie series. Value ranges from 0 to 1.
///<br/>pieCoefficient-number	default-0.8
///<br/><br/>
///Options for customizing the empty point in the series.
///<br/>emptyPointSettings-any	default-
///<br/><br/>
///Controls the visibility of the empty point.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the mode of empty point.
///<br/>displayMode-ej.datavisualization.Chart.EmptyPointMode|string	default-gap
///<br/><br/>
///Options for customizing the color and border of the empty point in the series.
///<br/>style-any	default-
///<br/><br/>
///Color of the empty point.
///<br/>color-string	default-
///<br/><br/>
///Options for customizing border of the empty point in the series.
///<br/>border-any	default-
///<br/><br/>
///Border color of the empty point.
///<br/>color-string	default-
///<br/><br/>
///Border width of the empty point.
///<br/>width-number	default-1
///<br/><br/>
///Fill color for the positive column of the waterfall.
///<br/>positiveFill-string	default-null
///<br/><br/>
///Options for customizing the waterfall connector line.
///<br/>connectorLine-any	default-
///<br/><br/>
///Width of the connector line.
///<br/>width-number	default-1
///<br/><br/>
///Color of the connector line.
///<br/>color-string	default-#565656
///<br/><br/>
///DashArray of the connector line.
///<br/>dashArray-string	default-null
///<br/><br/>
///DashArray of the connector line.
///<br/>opacity-number	default-1
///<br/><br/>
///Options to customize the error bar in series.
///<br/>errorBar-any	default-
///<br/><br/>
///Show/hides the error bar
///<br/>visibility-boolean	default-visible
///<br/><br/>
///Specifies the type of error bar.
///<br/>type-ej.datavisualization.Chart.ErrorBarType|string	default-FixedValue
///<br/><br/>
///Specifies the mode of error bar.
///<br/>mode-ej.datavisualization.Chart.ErrorBarMode|string	default-vertical
///<br/><br/>
///Specifies the direction of error bar.
///<br/>direction-ej.datavisualization.Chart.ErrorBarDirection|string	default-both
///<br/><br/>
///Value of vertical error bar.
///<br/>verticalErrorValue-number	default-3
///<br/><br/>
///Value of horizontal  error bar.
///<br/>horizontalErrorValue-number	default-1
///<br/><br/>
///Value of positive horizontal error bar.
///<br/>horizontalPositiveErrorValue-number	default-1
///<br/><br/>
///Value of negative horizontal error bar.
///<br/>horizontalNegativeErrorValue-number	default-1
///<br/><br/>
///Value of positive vertical error bar.
///<br/>verticalPositiveErrorValue-number	default-5
///<br/><br/>
///Value of negative vertical error bar.
///<br/>verticalNegativeErrorValue-number	default-5
///<br/><br/>
///Fill color of the error bar.
///<br/>fill-string	default-#000000
///<br/><br/>
///Width of the error bar.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the error bar cap.
///<br/>cap-any	default-
///<br/><br/>
///Show/Hides the error bar cap.
///<br/>visible-boolean	default-true
///<br/><br/>
///Width of the error bar cap.
///<br/>width-number	default-1
///<br/><br/>
///Length of the error bar cap.
///<br/>length-number	default-1
///<br/><br/>
///Color of the error bar cap.
///<br/>fill-string	default-#000000
///<br/><br/>
///Option to add data points; each point should have x and y property. Also, optionally, you can customize the points color, border, marker by using fill, border and marker options.
///<br/>points-Array&lt;any&gt;	default-
///<br/><br/>
///Options for customizing the border of a point. This is applicable only for column type series and accumulation type series.
///<br/>border-any	default-
///<br/><br/>
///Border color of the point.
///<br/>color-string	default-null
///<br/><br/>
///Border width of the point.
///<br/>width-number	default-null
///<br/><br/>
///Enables or disables the visibility of legend item.
///<br/>visibleOnLegend-string	default-visible
///<br/><br/>
///To show/hide the intermediate summary from the last intermediate point.
///<br/>showIntermediateSum-boolean	default-false
///<br/><br/>
///To show/hide the total summary of the waterfall series.
///<br/>showTotalSum-boolean	default-false
///<br/><br/>
///Close value of the point. Close value is applicable only for financial type series.
///<br/>close-number	default-null
///<br/><br/>
///Size of a bubble in the bubble series. This is applicable only for the bubble series.
///<br/>size-number	default-null
///<br/><br/>
///Background color of the point. This is applicable only for column type series and accumulation type series.
///<br/>fill-string	default-null
///<br/><br/>
///High value of the point. High value is applicable only for financial type series, range area series and range column series.
///<br/>high-number	default-null
///<br/><br/>
///Low value of the point. Low value is applicable only for financial type series, range area series and range column series.
///<br/>low-number	default-null
///<br/><br/>
///Options for displaying and customizing marker for a data point. Marker contains shapes and/or data labels.
///<br/>marker-any	default-
///<br/><br/>
///Options for customizing the border of the marker shape.
///<br/>border-any	default-
///<br/><br/>
///Border color of the marker shape.
///<br/>color-string	default-white
///<br/><br/>
///Border width of the marker shape.
///<br/>width-number	default-3
///<br/><br/>
///Options for displaying and customizing data label.
///<br/>dataLabel-any	default-
///<br/><br/>
///Angle of the data label in degrees. Only the text gets rotated, whereas the background and border does not rotate.
///<br/>angle-number	default-null
///<br/><br/>
///Options for customizing the border of the data label.
///<br/>border-any	default-
///<br/><br/>
///Border color of the data label.
///<br/>color-string	default-null
///<br/><br/>
///Border width of the data label.
///<br/>width-number	default-0.1
///<br/><br/>
///Options for displaying and customizing the line that connects point and data label.
///<br/>connectorLine-any	default-
///<br/><br/>
///Specifies when the connector has to be drawn as Bezier curve or straight line. This is applicable only for Pie and Doughnut chart types.
///<br/>type-ej.datavisualization.Chart.ConnectorLineType|string	default-line. See ConnectorLineType
///<br/><br/>
///Width of the connector.
///<br/>width-number	default-0.5
///<br/><br/>
///Background color of the data label.
///<br/>fill-string	default-null
///<br/><br/>
///Options for customizing the data label font.
///<br/>font-any	default-
///<br/><br/>
///Font family of the data label.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style of the data label.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-normal. See FontStyle
///<br/><br/>
///Font weight of the data label.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-regular. See FontWeight
///<br/><br/>
///Opacity of the text.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size of the data label.
///<br/>size-string	default-12px
///<br/><br/>
///Horizontal alignment of the data label.
///<br/>horizontalTextAlignment-ej.datavisualization.Chart.HorizontalTextAlignment|string	default-center
///<br/><br/>
///Margin of the text to its background shape. The size of the background shape increases based on the margin applied to its text.
///<br/>margin-any	default-
///<br/><br/>
///Bottom margin of the text.
///<br/>bottom-number	default-5
///<br/><br/>
///Left margin of the text.
///<br/>left-number	default-5
///<br/><br/>
///Right margin of the text.
///<br/>right-number	default-5
///<br/><br/>
///Top margin of the text.
///<br/>top-number	default-5
///<br/><br/>
///Opacity of the data label.
///<br/>opacity-number	default-1
///<br/><br/>
///Background shape of the data label.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-No shape is rendered by default, so its value is &#226;€˜none&#226;€™. See Shape
///<br/><br/>
///Specifies the position of the data label. This property can be used only for the series such as column, bar, stacked column, stacked bar, 100% stacked column, 100% stacked bar, candle and OHLC.
///<br/>textPosition-ej.datavisualization.Chart.TextPosition|string	default-top. See TextPosition
///<br/><br/>
///Vertical alignment of the data label.
///<br/>verticalTextAlignment-ej.datavisualization.Chart.VerticalTextAlignment|string	default-&#39;center&#39;
///<br/><br/>
///Controls the visibility of the data labels.
///<br/>visible-boolean	default-false
///<br/><br/>
///Custom template to format the data label content. Use â€œpoint.xâ€ and â€œpoint.yâ€ as a placeholder text to display the corresponding data pointâ€™s x and y value.
///<br/>template-string	default-
///<br/><br/>
///Moves the label vertically by specified offset.
///<br/>offset-number	default-0
///<br/><br/>
///Color of the marker shape.
///<br/>fill-string	default-null
///<br/><br/>
///The URL for the Image that is to be displayed as marker. In order to display image as marker, set series.marker.shape as â€˜imageâ€™.
///<br/>imageUrl-string	default-
///<br/><br/>
///Opacity of the marker.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the shape of the marker.
///<br/>shape-ej.datavisualization.Chart.Shape|string	default-circle. See Shape
///<br/><br/>
///Options for customizing the size of the marker shape.
///<br/>size-any	default-
///<br/><br/>
///Height of the marker.
///<br/>height-number	default-6
///<br/><br/>
///Width of the marker.
///<br/>width-number	default-6
///<br/><br/>
///Controls the visibility of the marker shape.
///<br/>visible-boolean	default-false
///<br/><br/>
///Open value of the point. This is applicable only for financial type series.
///<br/>open-number	default-null
///<br/><br/>
///Datalabel text for the point.
///<br/>text-string	default-null
///<br/><br/>
///X value of the point.
///<br/>x-number	default-null
///<br/><br/>
///Y value of the point.
///<br/>y-number	default-null
///<br/><br/>
///Specifies the mode of the pyramid series.
///<br/>pyramidMode-ej.datavisualization.Chart.PyramidMode|string	default-linear
///<br/><br/>
///Specifies ej.Query to select data from dataSource. This property is applicable only when the dataSource is ej.DataManager.
///<br/>query-any	default-null
///<br/><br/>
///Start angle from where the pie/doughnut series renders. It starts from 0, by default.
///<br/>startAngle-number	default-null
///<br/><br/>
///Options for customizing the tooltip of chart.
///<br/>tooltip-any	default-
///<br/><br/>
///Options for customizing the border of the tooltip.
///<br/>border-any	default-
///<br/><br/>
///Border Color of the tooltip.
///<br/>color-string	default-null
///<br/><br/>
///Border Width of the tooltip.
///<br/>width-number	default-1
///<br/><br/>
///Customize the corner radius of the tooltip rectangle.
///<br/>rx-number	default-0
///<br/><br/>
///Customize the corner radius of the tooltip rectangle.
///<br/>ry-number	default-0
///<br/><br/>
///Specifies the duration, the tooltip has to be displayed.
///<br/>duration-string	default-500ms
///<br/><br/>
///Enables/disables the animation of the tooltip when moving from one point to another.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Background color of the tooltip.
///<br/>fill-string	default-null
///<br/><br/>
///Format of the tooltip content.
///<br/>format-string	default-#point.x# : #point.y#
///<br/><br/>
///Opacity of the tooltip.
///<br/>opacity-number	default-0.95
///<br/><br/>
///Custom template to format the tooltip content. Use â€œpoint.xâ€ and â€œpoint.yâ€ as a placeholder text to display the corresponding data pointâ€™s x and y value.
///<br/>template-string	default-null
///<br/><br/>
///Controls the visibility of the tooltip.
///<br/>visible-boolean	default-false
///<br/><br/>
///Specifies the type of the series to render in chart.
///<br/>type-ej.datavisualization.Chart.Type|string	default-column. see Type
///<br/><br/>
///Controls the visibility of the series.
///<br/>visibility-string	default-visible
///<br/><br/>
///Enables or disables the visibility of legend item.
///<br/>visibleOnLegend-string	default-visible
///<br/><br/>
///Specifies the name of the x-axis that has to be associated with this series. Add an axis instance with this name to axes collection.
///<br/>xAxisName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains x value for the series.
///<br/>xName-string	default-null
///<br/><br/>
///Specifies the name of the y-axis that has to be associated with this series. Add an axis instance with this name to axes collection.
///<br/>yAxisName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains y value for the series.
///<br/>yName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains high value for the series.
///<br/>high-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains low value for the series.
///<br/>low-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains open value for the series.
///<br/>open-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains close value for the series.
///<br/>close-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains the size value for the bubble series.
///<br/>size-string	default-null
///<br/><br/>
///Option to add trendlines to chart.
///<br/>trendlines-Array&lt;any&gt;	default-
///<br/><br/>
///Show/hides the trendline.
///<br/>visibility-boolean	default-
///<br/><br/>
///Specifies the type of trendline for the series.
///<br/>type-string	default-linear. See TrendlinesType
///<br/><br/>
///Name for the trendlines that is to be displayed in legend text.
///<br/>name-string	default-Trendline
///<br/><br/>
///Fill color of the trendlines.
///<br/>fill-string	default-#0000FF
///<br/><br/>
///Width of the trendlines.
///<br/>width-number	default-1
///<br/><br/>
///Opacity of the trendline.
///<br/>opacity-number	default-1
///<br/><br/>
///Pattern of dashes and gaps used to stroke the trendline.
///<br/>dashArray-string	default-
///<br/><br/>
///Future trends of the current series.
///<br/>forwardForecast-number	default-0
///<br/><br/>
///Past trends of the current series.
///<br/>backwardForecast-number	default-0
///<br/><br/>
///Specifies the order of polynomial trendlines.
///<br/>polynomialOrder-number	default-0
///<br/><br/>
///Specifies the moving average starting period  value.
///<br/>period-number	default-2
///<br/><br/>
///Options for customizing the appearance of the series or data point while highlighting.
///<br/>highlightSettings-any	default-
///<br/><br/>
///Enables/disables the ability to highlight series or data point interactively.
///<br/>enable-boolean	default-false
///<br/><br/>
///Specifies whether series or data point has to be highlighted.
///<br/>mode-ej.datavisualization.Chart.Mode|string	default-series. See Mode
///<br/><br/>
///Color of the series/point on highlight.
///<br/>color-string	default-
///<br/><br/>
///Opacity of the series/point on highlight.
///<br/>opacity-number	default-0.6
///<br/><br/>
///Options for customizing the border of series on highlight.
///<br/>border-any	default-
///<br/><br/>
///Border color of the series/point on highlight.
///<br/>color-string	default-
///<br/><br/>
///Border width of the series/point on highlight.
///<br/>width-string	default-2
///<br/><br/>
///Specifies the pattern for the series/point on highlight.
///<br/>pattern-string	default-none. See Pattern
///<br/><br/>
///Custom pattern for the series on highlight.
///<br/>customPattern-string	default-
///<br/><br/>
///Options for customizing the appearance of the series/data point on selection.
///<br/>selectionSettings-any	default-
///<br/><br/>
///Enables/disables the ability to select a series/data point interactively.
///<br/>enable-boolean	default-false
///<br/><br/>
///Specifies whether series or data point has to be selected.
///<br/>mode-ej.datavisualization.Chart.Mode|string	default-series. See Mode
///<br/><br/>
///Specifies the type of selection.
///<br/>type-ej.datavisualization.Chart.SelectionType|string	default-single
///<br/><br/>
///Specifies the drawn rectangle type.
///<br/>rangeType-ej.datavisualization.Chart.RangeType|string	default-xy
///<br/><br/>
///Color of the series/point on selection.
///<br/>color-string	default-
///<br/><br/>
///Opacity of the series/point on selection.
///<br/>opacity-number	default-0.6
///<br/><br/>
///Options for customizing the border of series on selection.
///<br/>border-any	default-
///<br/><br/>
///Border color of the series/point on selection.
///<br/>color-string	default-
///<br/><br/>
///Border width of the series/point on selection.
///<br/>width-string	default-2
///<br/><br/>
///Specifies the pattern for the series/point on selection.
///<br/>pattern-string	default-none. See Pattern
///<br/><br/>
///Custom pattern for the series on selection.
///<br/>customPattern-string	default-
///<br/><br/>
///Controls whether data points has to be displayed side by side or along the depth of the axis.
///<br/>sideBySideSeriesPlacement-boolean	default-false
///<br/><br/>
///Options to customize the Chart size.
///<br/>size-Size	default-
///<br/><br/>
///Height of the Chart. Height can be specified in either pixel or percentage.
///<br/>height-string	default-&#39;450&#39;
///<br/><br/>
///Width of the Chart. Width can be specified in either pixel or percentage.
///<br/>width-string	default-&#39;450&#39;
///<br/><br/>
///Specifies the theme for Chart.
///<br/>theme-ej.datavisualization.Chart.Theme|string	default-Flatlight. See Theme
///<br/><br/>
///Slope angle of 3D Chart. This property is applicable only when 3D view is enabled.
///<br/>tilt-number	default-0
///<br/><br/>
///Options for customizing the title and subtitle of Chart.
///<br/>title-Title	default-
///<br/><br/>
///Options for customizing the font of Chart title.
///<br/>font-any	default-
///<br/><br/>
///Font family for Chart title.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style for Chart title.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal. See FontStyle
///<br/><br/>
///Font weight for Chart title.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-Regular. See FontWeight
///<br/><br/>
///Opacity of the Chart title.
///<br/>opacity-number	default-0.5
///<br/><br/>
///Font size for Chart title.
///<br/>size-string	default-20px
///<br/><br/>
///Options to customize the sub title of Chart.
///<br/>subTitle-any	default-
///<br/><br/>
///Options for customizing the font of sub title.
///<br/>font-any	default-
///<br/><br/>
///Font family of sub title.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Font style for sub title.
///<br/>fontStyle-ej.datavisualization.Chart.FontStyle|string	default-Normal. See FontStyle
///<br/><br/>
///Font weight for sub title.
///<br/>fontWeight-ej.datavisualization.Chart.FontWeight|string	default-Regular. See FontWeight
///<br/><br/>
///Opacity of the sub title.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size for sub title.
///<br/>size-string	default-12px
///<br/><br/>
///Background color for the chart subtitle.
///<br/>background-string	default-transparent
///<br/><br/>
///Options to customize the border of the title.
///<br/>border-any	default-
///<br/><br/>
///Width of the subtitle border.
///<br/>width-number	default-1
///<br/><br/>
///color of the subtitle border.
///<br/>color-string	default-transparent
///<br/><br/>
///opacity of the subtitle border.
///<br/>opacity-number	default-0.8
///<br/><br/>
///opacity of the subtitle border.
///<br/>cornerRadius-number	default-0.8
///<br/><br/>
///Text to be displayed in sub title.
///<br/>text-string	default-
///<br/><br/>
///Alignment of sub title text.
///<br/>textAlignment-ej.datavisualization.Chart.Alignment|string	default-far. See TextAlignment
///<br/><br/>
///Text to be displayed in Chart title.
///<br/>text-string	default-
///<br/><br/>
///Alignment of the title text.
///<br/>textAlignment-ej.datavisualization.Chart.Alignment|string	default-Center. See TextAlignment
///<br/><br/>
///Width of the wall used in 3D Chart. Wall is present only in Cartesian type 3D series and not in 3D pie or Doughnut series. This property is applicable only when 3D view is enabled.
///<br/>wallSize-number	default-2
///<br/><br/>
///Options for enabling zooming feature of chart.
///<br/>zooming-Zooming	default-
///<br/><br/>
///Enables or disables zooming.
///<br/>enable-boolean	default-false
///<br/><br/>
///Enable or disables the differed zooming. When it is enabled, chart is updated only on mouse up action while zooming and panning.
///<br/>enableDeferredZoom-boolean	default-false
///<br/><br/>
///Enables/disables the ability to zoom the chart on moving the mouse wheel.
///<br/>enableMouseWheel-boolean	default-false
///<br/><br/>
///Specifies whether to allow zooming the chart vertically or horizontally or in both ways.
///<br/>type-string	default-&#39;x,y&#39;
///<br/><br/>
///To display user specified buttons in zooming toolbar.
///<br/>toolbarItems-Array&lt;any&gt;	default-[zoomIn, zoomOut, zoom, pan, reset]
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.CheckBox=function(){};
ej.CheckBox.prototype={

destroy:function(){
/// <summary>
/// Destroy the CheckBox widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// Disable the CheckBox to prevent all user interactions.
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the CheckBox
/// </summary>
},
isChecked:function(){
/// <summary>
/// To Check the status of CheckBox
/// </summary>
},
};
jQuery.fn.ejCheckBox=function(){
this.data("ejCheckBox",new	ej.CheckBox());
return this;
};
jQuery.fn.ejCheckBox = function (options) {
/// <summary><br/>
///The CheckBox control allows you to check an option to perform an action. This control allows you to select true, false or an intermediate option. These CheckBoxes are supported with themes. The html CheckBox control is rendered as Essential JavaScript CheckBox control.<br/><br/>
///Specifies whether CheckBox has to be in checked or not. We can also specify array of string as value for this property. If any of the value in the specified array matches the value of the textbox, then it will be considered as checked. It will be useful in MVVM binding, specify array type to identify the values of the checked CheckBoxes.
///<br/>checked-boolean|string[]	default-false
///<br/><br/>
///Specifies the State of CheckBox.See below to get available CheckState
///<br/>checkState-ej.CheckState|string	default-null
///<br/><br/>
///Sets the root CSS class for CheckBox theme, which is used customize.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the checkbox control state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies the persist property for CheckBox while initialization. The persist API save current model value to browser cookies for state maintains. While refreshing the CheckBox control page the model value apply from browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specify the Right to Left direction to Checkbox
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the enable or disable Tri-State for checkbox control.
///<br/>enableTriState-boolean	default-false
///<br/><br/>
///It allows to define the characteristics of the CheckBox control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specified value to be added an id attribute of the CheckBox.
///<br/>id-string	default-null
///<br/><br/>
///Specify the prefix value of id to be added before the current id of the CheckBox.
///<br/>idPrefix-string	default-ej
///<br/><br/>
///Specifies the name attribute of the CheckBox.
///<br/>name-string	default-null
///<br/><br/>
///Displays rounded corner borders to CheckBox
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the size of the CheckBox.See below to know available CheckboxSize
///<br/>size-ej.CheckboxSize|string	default-small
///<br/><br/>
///Specifies the text content to be displayed for CheckBox.
///<br/>text-string	default-
///<br/><br/>
///Set the jQuery validation error message in CheckBox.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Set the jQuery validation rules in CheckBox.
///<br/>validationRules-any	default-null
///<br/><br/>
///Specifies the value attribute of the CheckBox.
///<br/>value-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.CircularGauge=function(){};
ej.CircularGauge.prototype={

destroy:function(){
/// <summary>
/// destroy the circular gauge widget. all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
exportImage:function(){
/// <summary>
/// To export Image
/// </summary>
},
getBackNeedleLength:function(){
/// <summary>
/// To get BackNeedleLength
/// </summary>
},
getCustomLabelAngle:function(){
/// <summary>
/// To get CustomLabelAngle
/// </summary>
},
getCustomLabelValue:function(){
/// <summary>
/// To get CustomLabelValue
/// </summary>
},
getLabelAngle:function(){
/// <summary>
/// To get LabelAngle
/// </summary>
},
getLabelDistanceFromScale:function(){
/// <summary>
/// To get LabelDistanceFromScale
/// </summary>
},
getLabelPlacement:function(){
/// <summary>
/// To get LabelPlacement
/// </summary>
},
getLabelStyle:function(){
/// <summary>
/// To get LabelStyle
/// </summary>
},
getMajorIntervalValue:function(){
/// <summary>
/// To get MajorIntervalValue
/// </summary>
},
getMarkerDistanceFromScale:function(){
/// <summary>
/// To get MarkerDistanceFromScale
/// </summary>
},
getMarkerStyle:function(){
/// <summary>
/// To get MarkerStyle
/// </summary>
},
getMaximumValue:function(){
/// <summary>
/// To get MaximumValue
/// </summary>
},
getMinimumValue:function(){
/// <summary>
/// To get MinimumValue
/// </summary>
},
getMinorIntervalValue:function(){
/// <summary>
/// To get MinorIntervalValue
/// </summary>
},
getNeedleStyle:function(){
/// <summary>
/// To get NeedleStyle
/// </summary>
},
getPointerCapBorderWidth:function(){
/// <summary>
/// To get PointerCapBorderWidth
/// </summary>
},
getPointerCapRadius:function(){
/// <summary>
/// To get PointerCapRadius
/// </summary>
},
getPointerLength:function(){
/// <summary>
/// To get PointerLength
/// </summary>
},
getPointerNeedleType:function(){
/// <summary>
/// To get PointerNeedleType
/// </summary>
},
getPointerPlacement:function(){
/// <summary>
/// To get PointerPlacement
/// </summary>
},
getPointerValue:function(){
/// <summary>
/// To get PointerValue
/// </summary>
},
getPointerWidth:function(){
/// <summary>
/// To get PointerWidth
/// </summary>
},
getRangeBorderWidth:function(){
/// <summary>
/// To get RangeBorderWidth
/// </summary>
},
getRangeDistanceFromScale:function(){
/// <summary>
/// To get RangeDistanceFromScale
/// </summary>
},
getRangeEndValue:function(){
/// <summary>
/// To get RangeEndValue
/// </summary>
},
getRangePosition:function(){
/// <summary>
/// To get RangePosition
/// </summary>
},
getRangeSize:function(){
/// <summary>
/// To get RangeSize
/// </summary>
},
getRangeStartValue:function(){
/// <summary>
/// To get RangeStartValue
/// </summary>
},
getScaleBarSize:function(){
/// <summary>
/// To get ScaleBarSize
/// </summary>
},
getScaleBorderWidth:function(){
/// <summary>
/// To get ScaleBorderWidth
/// </summary>
},
getScaleDirection:function(){
/// <summary>
/// To get ScaleDirection
/// </summary>
},
getScaleRadius:function(){
/// <summary>
/// To get ScaleRadius
/// </summary>
},
getStartAngle:function(){
/// <summary>
/// To get StartAngle
/// </summary>
},
getSubGaugeLocation:function(){
/// <summary>
/// To get SubGaugeLocation
/// </summary>
},
getSweepAngle:function(){
/// <summary>
/// To get SweepAngle
/// </summary>
},
getTickAngle:function(){
/// <summary>
/// To get TickAngle
/// </summary>
},
getTickDistanceFromScale:function(){
/// <summary>
/// To get TickDistanceFromScale
/// </summary>
},
getTickHeight:function(){
/// <summary>
/// To get TickHeight
/// </summary>
},
getTickPlacement:function(){
/// <summary>
/// To get TickPlacement
/// </summary>
},
getTickStyle:function(){
/// <summary>
/// To get TickStyle
/// </summary>
},
getTickWidth:function(){
/// <summary>
/// To get TickWidth
/// </summary>
},
includeFirstValue:function(){
/// <summary>
/// To set includeFirstValue
/// </summary>
},
redraw:function(){
/// <summary>
/// Switching the redraw option for the gauge
/// </summary>
},
setBackNeedleLength:function(){
/// <summary>
/// To set BackNeedleLength
/// </summary>
},
setCustomLabelAngle:function(){
/// <summary>
/// To set CustomLabelAngle
/// </summary>
},
setCustomLabelValue:function(){
/// <summary>
/// To set CustomLabelValue
/// </summary>
},
setLabelAngle:function(){
/// <summary>
/// To set LabelAngle
/// </summary>
},
setLabelDistanceFromScale:function(){
/// <summary>
/// To set LabelDistanceFromScale
/// </summary>
},
setLabelPlacement:function(){
/// <summary>
/// To set LabelPlacement
/// </summary>
},
setLabelStyle:function(){
/// <summary>
/// To set LabelStyle
/// </summary>
},
setMajorIntervalValue:function(){
/// <summary>
/// To set MajorIntervalValue
/// </summary>
},
setMarkerDistanceFromScale:function(){
/// <summary>
/// To set MarkerDistanceFromScale
/// </summary>
},
setMarkerStyle:function(){
/// <summary>
/// To set MarkerStyle
/// </summary>
},
setMaximumValue:function(){
/// <summary>
/// To set MaximumValue
/// </summary>
},
setMinimumValue:function(){
/// <summary>
/// To set MinimumValue
/// </summary>
},
setMinorIntervalValue:function(){
/// <summary>
/// To set MinorIntervalValue
/// </summary>
},
setNeedleStyle:function(){
/// <summary>
/// To set NeedleStyle
/// </summary>
},
setPointerCapBorderWidth:function(){
/// <summary>
/// To set PointerCapBorderWidth
/// </summary>
},
setPointerCapRadius:function(){
/// <summary>
/// To set PointerCapRadius
/// </summary>
},
setPointerLength:function(){
/// <summary>
/// To set PointerLength
/// </summary>
},
setPointerNeedleType:function(){
/// <summary>
/// To set PointerNeedleType
/// </summary>
},
setPointerPlacement:function(){
/// <summary>
/// To set PointerPlacement
/// </summary>
},
setPointerValue:function(){
/// <summary>
/// To set PointerValue
/// </summary>
},
setPointerWidth:function(){
/// <summary>
/// To set PointerWidth
/// </summary>
},
setRangeBorderWidth:function(){
/// <summary>
/// To set RangeBorderWidth
/// </summary>
},
setRangeDistanceFromScale:function(){
/// <summary>
/// To set RangeDistanceFromScale
/// </summary>
},
setRangeEndValue:function(){
/// <summary>
/// To set RangeEndValue
/// </summary>
},
setRangePosition:function(){
/// <summary>
/// To set RangePosition
/// </summary>
},
setRangeSize:function(){
/// <summary>
/// To set RangeSize
/// </summary>
},
setRangeStartValue:function(){
/// <summary>
/// To set RangeStartValue
/// </summary>
},
setScaleBarSize:function(){
/// <summary>
/// To set ScaleBarSize
/// </summary>
},
setScaleBorderWidth:function(){
/// <summary>
/// To set ScaleBorderWidth
/// </summary>
},
setScaleDirection:function(){
/// <summary>
/// To set ScaleDirection
/// </summary>
},
setScaleRadius:function(){
/// <summary>
/// To set ScaleRadius
/// </summary>
},
setStartAngle:function(){
/// <summary>
/// To set StartAngle
/// </summary>
},
setSubGaugeLocation:function(){
/// <summary>
/// To set SubGaugeLocation
/// </summary>
},
setSweepAngle:function(){
/// <summary>
/// To set SweepAngle
/// </summary>
},
setTickAngle:function(){
/// <summary>
/// To set TickAngle
/// </summary>
},
setTickDistanceFromScale:function(){
/// <summary>
/// To set TickDistanceFromScale
/// </summary>
},
setTickHeight:function(){
/// <summary>
/// To set TickHeight
/// </summary>
},
setTickPlacement:function(){
/// <summary>
/// To set TickPlacement
/// </summary>
},
setTickStyle:function(){
/// <summary>
/// To set TickStyle
/// </summary>
},
setTickWidth:function(){
/// <summary>
/// To set TickWidth
/// </summary>
},
};
jQuery.fn.ejCircularGauge=function(){
this.data("ejCircularGauge",new	ej.CircularGauge());
return this;
};
jQuery.fn.ejCircularGauge = function (options) {
/// <summary><br/>
///The Circular gauge can be easily configured to the DOM element, such as div. you can create a circular gauge with a highly customizable look and feel.<br/><br/>
///Specifies animationSpeed of circular gauge
///<br/>animationSpeed-number	default-500
///<br/><br/>
///Specifies the background color of circular gauge.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specify distanceFromCorner value of circular gauge
///<br/>distanceFromCorner-number	default-center
///<br/><br/>
///Specify animate value of circular gauge
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specify the frame of circular gauge
///<br/>frame-Frame	default-Object
///<br/><br/>
///Specify the URL of the frame background image for circular gauge
///<br/>backgroundImageUrl-string	default-null
///<br/><br/>
///Specifies the frameType of circular gauge. See Frame
///<br/>frameType-ej.datavisualization.CircularGauge.FrameType|string	default-FullCircle
///<br/><br/>
///Specifies the end angle for the half circular frame.
///<br/>halfCircleFrameEndAngle-number	default-360
///<br/><br/>
///Specifies the start angle for the half circular frame.
///<br/>halfCircleFrameStartAngle-number	default-180
///<br/><br/>
///Specify gaugePosition value of circular gauge See GaugePosition
///<br/>gaugePosition-ej.datavisualization.CircularGauge.gaugePosition|string	default-center
///<br/><br/>
///Specifies the height of circular gauge.
///<br/>height-number	default-360
///<br/><br/>
///Specifies the interiorGradient of circular gauge.
///<br/>interiorGradient-any	default-null
///<br/><br/>
///Specify isRadialGradient value of circular gauge
///<br/>isRadialGradient-boolean	default-false
///<br/><br/>
///Specify isResponsive value of circular gauge
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specifies the maximum value of circular gauge.
///<br/>maximum-number	default-100
///<br/><br/>
///Specifies the minimum value of circular gauge.
///<br/>minimum-number	default-0
///<br/><br/>
///Specify outerCustomLabelPosition value of circular gauge See OuterCustomLabelPosition
///<br/>outerCustomLabelPosition-ej.datavisualization.CircularGauge.CustomLabelPositionType|string	default-bottom
///<br/><br/>
///Specifies the radius of circular gauge.
///<br/>radius-number	default-180
///<br/><br/>
///Specify readonly value of circular gauge
///<br/>readOnly-boolean	default-true
///<br/><br/>
///Specify the pointers, ticks, labels, indicators, ranges of circular gauge
///<br/>scales-Array&lt;Scales&gt;	default-null
///<br/><br/>
///Specify backgroundColor for the scale of circular gauge
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specify border for scales of circular gauge
///<br/>border-any	default-Object
///<br/><br/>
///Specify border color for scales of circular gauge
///<br/>color-string	default-null
///<br/><br/>
///Specify border width of circular gauge
///<br/>width-number	default-1.5
///<br/><br/>
///Specify scale direction of circular gauge. See Directions
///<br/>direction-ej.datavisualization.CircularGauge.Direction|string	default-Clockwise
///<br/><br/>
///Specify representing state of circular gauge
///<br/>indicators-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify indicator height of circular gauge
///<br/>height-number	default-15
///<br/><br/>
///Specify imageUrl of circular gauge
///<br/>imageUrl-string	default-null
///<br/><br/>
///Specify position of circular gauge
///<br/>position-any	default-Object
///<br/><br/>
///Specify x-axis of position of circular gauge
///<br/>x-number	default-0
///<br/><br/>
///Specify y-axis of position of circular gauge
///<br/>y-number	default-0
///<br/><br/>
///Specify the various states of circular gauge
///<br/>stateRanges-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify backgroundColor for indicator of circular gauge
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specify borderColor for indicator of circular gauge
///<br/>borderColor-string	default-null
///<br/><br/>
///Specify end value for each specified state of circular gauge
///<br/>endValue-number	default-0
///<br/><br/>
///Specify value of the font as the indicator when the indicator style is set with the value "text" of circular gauge
///<br/>font-any	default-null
///<br/><br/>
///Specify start value for each specified state of circular gauge
///<br/>startValue-number	default-0
///<br/><br/>
///Specify value of the text as the indicator when the indicator style is set with the value "text" of circular gauge
///<br/>text-string	default-
///<br/><br/>
///Specify value of the textColor as the indicator when the indicator style is set with the value "text" of circular gauge
///<br/>textColor-string	default-null
///<br/><br/>
///Specify indicator style of circular gauge. See IndicatorType
///<br/>type-ej.datavisualization.CircularGauge.IndicatorTypes|string	default-Circle
///<br/><br/>
///Specify indicator width of circular gauge
///<br/>width-number	default-15
///<br/><br/>
///Specify the text values displayed in a meaningful manner alongside the ticks of circular gauge
///<br/>labels-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify the angle for the labels of circular gauge
///<br/>angle-number	default-0
///<br/><br/>
///Specify labels autoAngle value of circular gauge
///<br/>autoAngle-boolean	default-false
///<br/><br/>
///Specify label color of circular gauge
///<br/>color-string	default-null
///<br/><br/>
///Specify distanceFromScale value for labels of circular gauge
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specify font for labels of circular gauge
///<br/>font-any	default-Object
///<br/><br/>
///Specify font fontFamily for labels of circular gauge
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Specify font Style for labels of circular gauge
///<br/>fontStyle-string	default-Bold
///<br/><br/>
///Specify font size for labels of circular gauge
///<br/>size-string	default-11px
///<br/><br/>
///Specify includeFirstValue of circular gauge
///<br/>includeFirstValue-boolean	default-true
///<br/><br/>
///Specify opacity value for labels of circular gauge
///<br/>opacity-number	default-null
///<br/><br/>
///Specify label placement of circular gauge. See LabelPlacement
///<br/>placement-ej.datavisualization.CircularGauge.Placement|string	default-Near
///<br/><br/>
///Specify label Style of circular gauge. See LabelType
///<br/>type-ej.datavisualization.CircularGauge.LabelType|string	default-Major
///<br/><br/>
///Specify unitText of circular gauge
///<br/>unitText-string	default-
///<br/><br/>
///Specify unitTextPosition of circular gauge. See UnitTextPosition
///<br/>unitTextPosition-ej.datavisualization.CircularGauge.UnitTextPlacement|string	default-Back
///<br/><br/>
///Specify majorIntervalValue of circular gauge
///<br/>majorIntervalValue-number	default-10
///<br/><br/>
///Specify maximum scale value of circular gauge
///<br/>maximum-number	default-null
///<br/><br/>
///Specify minimum scale value of circular gauge
///<br/>minimum-number	default-null
///<br/><br/>
///Specify minorIntervalValue of circular gauge
///<br/>minorIntervalValue-number	default-2
///<br/><br/>
///Specify opacity value of circular gauge
///<br/>opacity-number	default-1
///<br/><br/>
///Specify pointer cap of circular gauge
///<br/>pointerCap-any	default-Object
///<br/><br/>
///Specify cap backgroundColor of circular gauge
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specify cap borderColor of circular gauge
///<br/>borderColor-string	default-null
///<br/><br/>
///Specify pointerCap borderWidth value of circular gauge
///<br/>borderWidth-number	default-3
///<br/><br/>
///Specify cap interiorGradient value of circular gauge
///<br/>interiorGradient-any	default-null
///<br/><br/>
///Specify pointerCap Radius value of circular gauge
///<br/>radius-number	default-7
///<br/><br/>
///Specify pointers value of circular gauge
///<br/>pointers-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify backgroundColor for the pointer of circular gauge
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specify backNeedleLength of circular gauge
///<br/>backNeedleLength-number	default-10
///<br/><br/>
///Specify the border for pointers of circular gauge
///<br/>border-any	default-Object
///<br/><br/>
///Specify border color for pointer of circular gauge
///<br/>color-string	default-null
///<br/><br/>
///Specify border width for pointers of circular gauge
///<br/>width-number	default-1.5
///<br/><br/>
///Specify distanceFromScale value for pointers of circular gauge
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specify pointer gradients of circular gauge
///<br/>gradients-any	default-null
///<br/><br/>
///Specify pointer image of circular gauge.It is applicable for both marker as well as needle type pointers.
///<br/>imageUrl-string	default-NULL
///<br/><br/>
///Specify pointer length of circular gauge
///<br/>length-number	default-150
///<br/><br/>
///Specify marker Style value of circular gauge. See MarkerType
///<br/>markerType-ej.datavisualization.CircularGauge.MarkerType|string	default-Rectangle
///<br/><br/>
///Specify needle Style value of circular gauge. See NeedleType
///<br/>needleType-ej.datavisualization.CircularGauge.NeedleType|string	default-Triangle
///<br/><br/>
///Specify opacity value for pointer of circular gauge
///<br/>opacity-number	default-1
///<br/><br/>
///Specify pointer Placement value of circular gauge. See PointerPlacement
///<br/>placement-ej.datavisualization.CircularGauge.Placement|string	default-Near
///<br/><br/>
///Specify pointer value text of circular gauge.
///<br/>pointerValueText-any	default-Object
///<br/><br/>
///Specify pointer text angle of circular gauge.
///<br/>angle-number	default-0
///<br/><br/>
///Specify pointer text auto angle of circular gauge.
///<br/>autoAngle-boolean	default-false
///<br/><br/>
///Specify pointer value text color of circular gauge.
///<br/>color-string	default-#8c8c8c
///<br/><br/>
///Specify pointer value text distance from pointer of circular gauge.
///<br/>distance-number	default-20
///<br/><br/>
///Specify pointer value text font option of circular gauge.
///<br/>font-any	default-object
///<br/><br/>
///Specify pointer value text font family of circular gauge.
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Specify pointer value text font style of circular gauge.
///<br/>fontStyle-string	default-Bold
///<br/><br/>
///Specify pointer value text size of circular gauge.
///<br/>size-string	default-11px
///<br/><br/>
///Specify pointer value text opacity of circular gauge.
///<br/>opacity-number	default-1
///<br/><br/>
///enable pointer value text visibility of circular gauge.
///<br/>showValue-boolean	default-false
///<br/><br/>
///Specify showBackNeedle value of circular gauge
///<br/>showBackNeedle-boolean	default-false
///<br/><br/>
///Specify pointer type value of circular gauge. See PointerType
///<br/>type-ej.datavisualization.CircularGauge.PointerType|string	default-Needle
///<br/><br/>
///Specify value of the pointer of circular gauge
///<br/>value-number	default-null
///<br/><br/>
///Specify pointer width of circular gauge
///<br/>width-number	default-7
///<br/><br/>
///Specify scale radius of circular gauge
///<br/>radius-number	default-170
///<br/><br/>
///Specify ranges value of circular gauge
///<br/>ranges-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify backgroundColor for the ranges of circular gauge
///<br/>backgroundColor-string	default-#32b3c6
///<br/><br/>
///Specify border for ranges of circular gauge
///<br/>border-any	default-Object
///<br/><br/>
///Specify border color for ranges of circular gauge
///<br/>color-string	default-#32b3c6
///<br/><br/>
///Specify border width for ranges of circular gauge
///<br/>width-number	default-1.5
///<br/><br/>
///Specify distanceFromScale value for ranges of circular gauge
///<br/>distanceFromScale-number	default-25
///<br/><br/>
///Specify endValue for ranges of circular gauge
///<br/>endValue-number	default-null
///<br/><br/>
///Specify endWidth for ranges of circular gauge
///<br/>endWidth-number	default-10
///<br/><br/>
///Specify range gradients of circular gauge
///<br/>gradients-any	default-null
///<br/><br/>
///Specify opacity value for ranges of circular gauge
///<br/>opacity-number	default-null
///<br/><br/>
///Specify placement of circular gauge. See RangePlacement
///<br/>placement-ej.datavisualization.CircularGauge.Placement|string	default-Near
///<br/><br/>
///Specify size of the range value of circular gauge
///<br/>size-number	default-5
///<br/><br/>
///Specify startValue for ranges of circular gauge
///<br/>startValue-number	default-null
///<br/><br/>
///Specify startWidth of circular gauge
///<br/>startWidth-number	default-[Array.number] scale.ranges.startWidth = 10
///<br/><br/>
///Specify shadowOffset value of circular gauge
///<br/>shadowOffset-number	default-0
///<br/><br/>
///Specify showIndicators of circular gauge
///<br/>showIndicators-boolean	default-false
///<br/><br/>
///Specify showLabels of circular gauge
///<br/>showLabels-boolean	default-true
///<br/><br/>
///Specify showPointers of circular gauge
///<br/>showPointers-boolean	default-true
///<br/><br/>
///Specify showRanges of circular gauge
///<br/>showRanges-boolean	default-false
///<br/><br/>
///Specify showScaleBar of circular gauge
///<br/>showScaleBar-boolean	default-false
///<br/><br/>
///Specify showTicks of circular gauge
///<br/>showTicks-boolean	default-true
///<br/><br/>
///Specify scaleBar size of circular gauge
///<br/>size-number	default-6
///<br/><br/>
///Specify startAngle of circular gauge
///<br/>startAngle-number	default-115
///<br/><br/>
///Specify subGauge of circular gauge
///<br/>subGauges-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify subGauge Height of circular gauge
///<br/>height-number	default-150
///<br/><br/>
///Specify position for sub-gauge of circular gauge
///<br/>position-any	default-Object
///<br/><br/>
///Specify x-axis position for sub-gauge of circular gauge
///<br/>x-number	default-0
///<br/><br/>
///Specify y-axis position for sub-gauge of circular gauge
///<br/>y-number	default-0
///<br/><br/>
///Specify subGauge Width of circular gauge
///<br/>width-number	default-150
///<br/><br/>
///Specify sweepAngle of circular gauge
///<br/>sweepAngle-number	default-310
///<br/><br/>
///Specify ticks of circular gauge
///<br/>ticks-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specify the angle for the ticks of circular gauge
///<br/>angle-number	default-0
///<br/><br/>
///Specify tick color of circular gauge
///<br/>color-string	default-null
///<br/><br/>
///Specify distanceFromScale value for ticks of circular gauge
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specify tick height of circular gauge
///<br/>height-number	default-16
///<br/><br/>
///Specify tick placement of circular gauge. See TickPlacement
///<br/>placement-ej.datavisualization.CircularGauge.Placement|string	default-Near
///<br/><br/>
///Specify tick Style of circular gauge. See TickType
///<br/>type-ej.datavisualization.CircularGauge.LabelType|string	default-Major
///<br/><br/>
///Specify tick width of circular gauge
///<br/>width-number	default-3
///<br/><br/>
///Specify the theme of circular gauge.
///<br/>theme-string	default-flatlight
///<br/><br/>
///Specify tooltip option of circular gauge
///<br/>tooltip-Tooltip	default-object
///<br/><br/>
///enable showCustomLabelTooltip of circular gauge
///<br/>showCustomLabelTooltip-boolean	default-false
///<br/><br/>
///enable showLabelTooltip of circular gauge
///<br/>showLabelTooltip-boolean	default-false
///<br/><br/>
///Specify tooltip templateID of circular gauge
///<br/>templateID-string	default-false
///<br/><br/>
///Specifies the value of circular gauge.
///<br/>value-number	default-0
///<br/><br/>
///Specifies the width of circular gauge.
///<br/>width-number	default-360
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ColorPicker=function(){};
ej.ColorPicker.prototype={

disable:function(){
/// <summary>
/// Disables the color picker control
/// </summary>
},
enable:function(){
/// <summary>
/// Enable the color picker control
/// </summary>
},
getColor:function(){
/// <summary>
/// Gets the selected color in RGB format
/// </summary>
},
getValue:function(){
/// <summary>
/// Gets the selected color value as string
/// </summary>
},
hexCodeToRGB:function(){
/// <summary>
/// To Convert color value from hexCode to RGB
/// </summary>
},
hide:function(){
/// <summary>
/// Hides the ColorPicker popup, if in opened state.
/// </summary>
},
HSVToRGB:function(){
/// <summary>
/// Convert color value from HSV to RGB
/// </summary>
},
RGBToHEX:function(){
/// <summary>
/// Convert color value from RGB to HEX
/// </summary>
},
RGBToHSV:function(){
/// <summary>
/// Convert color value from RGB to HSV
/// </summary>
},
show:function(){
/// <summary>
/// Open the ColorPicker popup.
/// </summary>
},
};
jQuery.fn.ejColorPicker=function(){
this.data("ejColorPicker",new	ej.ColorPicker());
return this;
};
jQuery.fn.ejColorPicker = function (options) {
/// <summary><br/>
///The ColorPicker control provides you a rich visual interface for color selection. You can select the color from the professionally designed palettes or custom color. By clicking a point on the color, you can change the active color to the color that is located under the pointer.<br/><br/>
///The ColorPicker control allows to define the customized text to displayed in button elements. Using the property to achieve the customized culture values.
///<br/>buttonText-any	default-buttonText.apply= Apply, buttonText.cancel= Cancel,buttonText.swatches=Swatches
///<br/><br/>
///Allows to change the mode of the button. Please refer below to know available button mode
///<br/>buttonMode-ej.ButtonMode|string	default-ej.ButtonMode.Split
///<br/><br/>
///Specifies the number of columns to be displayed color palette model.
///<br/>columns-number	default-10
///<br/><br/>
///This property allows you to customize its appearance using user-defined CSS and custom skin options such as colors and backgrounds.
///<br/>cssClass-string	default-
///<br/><br/>
///This property allows to define the custom colors in the palette model.Custom palettes are created by passing a comma delimited string of HEX values or an array of colors.
///<br/>custom-Array&lt;any&gt;	default-empty
///<br/><br/>
///This property allows to embed the popup in the order of DOM element flow . When we set the value as true, the color picker popup is always in visible state.
///<br/>displayInline-boolean	default-false
///<br/><br/>
///This property allows to change the control in enabled or disabled state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///This property allows to enable or disable the opacity slider in the color picker control
///<br/>enableOpacity-boolean	default-true
///<br/><br/>
///It allows to define the characteristics of the ColorPicker control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the model type to be rendered initially in the color picker control. See below to get available ModelType
///<br/>modelType-ej.ColorPicker.ModelType|string	default-ej.ColorPicker.ModelType.Default
///<br/><br/>
///This property allows to change the opacity value .The selected color opacity will be adjusted by using this opacity value.
///<br/>opacityValue-number	default-100
///<br/><br/>
///Specifies the palette type to be displayed at initial time in palette model.There two types of palette model available in ColorPicker control. See below available Palette
///<br/>palette-ej.ColorPicker.Palette|string	default-ej.ColorPicker.Palette.BasicPalette
///<br/><br/>
///This property allows to define the preset model to be rendered initially in palette type.It consists of 12 different types of presets. Each presets have 50 colors. See below available Presets
///<br/>presetType-ej.ColorPicker.Presets|string	default-ej.ColorPicker.Presets.Basic
///<br/><br/>
///Allows to show/hides the apply and cancel buttons in ColorPicker control
///<br/>showApplyCancel-boolean	default-true
///<br/><br/>
///Allows to show/hides the clear button in ColorPicker control
///<br/>showClearButton-boolean	default-true
///<br/><br/>
///This property allows to provides live preview support for current cursor selection color and selected color.
///<br/>showPreview-boolean	default-true
///<br/><br/>
///This property allows to store the color values in custom list.The ColorPicker will keep up to 11 colors in a custom list.By clicking the add button, the selected color from picker or palette will get added in the recent color list.
///<br/>showRecentColors-boolean	default-false
///<br/><br/>
///Allows to show/hides the switcher button in ColorPicker control.It helps to switch palette or picker mode in colorpicker.
///<br/>showSwitcher-boolean	default-true
///<br/><br/>
///This property allows to shows tooltip to notify the slider value in color picker control.
///<br/>showTooltip-boolean	default-false
///<br/><br/>
///Specifies the toolIcon to be displayed in dropdown control color area.
///<br/>toolIcon-string	default-null
///<br/><br/>
///This property allows to define the customized text or content to displayed when mouse over the following elements. This property also allows to use the culture values.
///<br/>tooltipText-any	default-tooltipText: { switcher: Switcher, addbutton: Add Color, basic: Basic, monochrome: Mono Chrome, flatcolors: Flat Color, seawolf: Sea Wolf, webcolors: Web Colors, sandy: Sandy, pinkshades: Pink Shades, misty: Misty, citrus: Citrus, vintage: Vintage, moonlight: Moon Light, candycrush: Candy Crush, currentcolor: Current Color, selectedcolor: Selected Color }
///<br/><br/>
///Specifies the color value for color picker control, the value is in hexadecimal form with prefix of "#".
///<br/>value-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.DataManager=function(){};
ej.DataManager.prototype={

executeLocal:function(query){
/// <summary>
/// This method does not execute more than one operation at a time; it waits for one operation to complete, and then executes the next operation.
/// </summary>
/// <param name="query"	type="ej.Query">Sets the default query for the data source.</param>
},
executeQuery:function(query){
/// <summary>
/// The executeQuery property is used to process the data based on the query on Url Binding.
/// </summary>
/// <param name="query"	type="ej.Query">Sets the default query for the data source.</param>
},
insert:function(data, tableName){
/// <summary>
/// It is a method used to inserts a new record in the table.
/// </summary>
/// <param name="data"	type="any">json data or json array</param>
/// <param name="tableName"	type="string">name of the table</param>
},
remove:function(keyField, value, tableName){
/// <summary>
/// It is used to remove the data from the dataSource.
/// </summary>
/// <param name="keyField"	type="string">keyColumn to find the data</param>
/// <param name="value"	type="string">specified value for the keyField</param>
/// <param name="tableName"	type="string">name of the source table</param>
},
saveChanges:function(changes, key, tableName){
/// <summary>
/// This method is used to save the changes to the corresponding table. You can add a new record, edit an existing record, or delete a record by using this method.
/// </summary>
/// <param name="changes"	type="string"></param>
/// <param name="key"	type="string"></param>
/// <param name="tableName"	type="string"></param>
},
update:function(keyField, value, tableName){
/// <summary>
/// Updates existing record and saves the changes to the table.
/// </summary>
/// <param name="keyField"	type="string"></param>
/// <param name="value"	type="string"></param>
/// <param name="tableName"	type="string"></param>
},
};
jQuery.fn.ejDataManager=function(){
this.data("ejDataManager",new	ej.DataManager());
return this;
};
jQuery.fn.ejDataManager = function (options) {
/// <summary><br/>
///Communicates with data source and returns the desired result based on the Query provided.</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.DatePicker=function(){};
ej.DatePicker.prototype={

disable:function(){
/// <summary>
/// Disables the DatePicker control.
/// </summary>
},
enable:function(){
/// <summary>
/// Enable the DatePicker control, if it is in disabled state.
/// </summary>
},
getValue:function(){
/// <summary>
/// Returns the current date value in the DatePicker control.
/// </summary>
},
hide:function(){
/// <summary>
/// Close the DatePicker popup, if it is in opened state.
/// </summary>
},
show:function(){
/// <summary>
/// Opens the DatePicker popup.
/// </summary>
},
};
jQuery.fn.ejDatePicker=function(){
this.data("ejDatePicker",new	ej.DatePicker());
return this;
};
jQuery.fn.ejDatePicker = function (options) {
/// <summary><br/>
///Input field that display the DatePicker calendar as popup to select and set the date value<br/><br/>
///Used to allow or restrict the editing in DatePicker input field directly. By setting false to this API, You can only pick the date from DatePicker popup.
///<br/>allowEdit-boolean	default-true
///<br/><br/>
///allow or restrict the drill down to multiple levels of view (month/year/decade) in DatePicker calendar
///<br/>allowDrillDown-boolean	default-true
///<br/><br/>
///Sets the specified text value to the today button in the DatePicker calendar.
///<br/>buttonText-string	default-Today
///<br/><br/>
///Sets the root CSS class for Accordion theme, which is used customize.
///<br/>cssClass-string	default-
///<br/><br/>
///Formats the value of the DatePicker in to the specified date format. If this API is not specified, dateFormat will be set based on the current culture of DatePicker.
///<br/>dateFormat-string	default-MM/dd/yyyy
///<br/><br/>
///Specifies the header format of days in DatePicker calendar. See below to get available Headers options
///<br/>dayHeaderFormat-string | ej.DatePicker.Header	default-ej.DatePicker.Header.Min
///<br/><br/>
///Specifies the navigation depth level in DatePicker calendar. This option is not applied when start level view option is lower than depth level view. See below to know available levels in DatePicker Calendar
///<br/>depthLevel-string | ej.DatePicker.Level	default-
///<br/><br/>
///Allows to embed the DatePicker calendar in the page. Also associates DatePicker with div element instead of input.
///<br/>displayInline-boolean	default-false
///<br/><br/>
///Enables or disables the animation effect with DatePicker calendar.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Enable or disable the DatePicker control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Sustain the entire widget model of DatePicker even after form post or browser refresh
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Displays DatePicker calendar along with DatePicker input field in Right to Left direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Allows to enter valid or invalid date in input textbox and indicate as error if it is invalid value, when this API value is set to true. For false value, invalid date is not allowed to input field and corrected to valid date automatically, even if invalid date is given.
///<br/>enableStrictMode-boolean	default-false
///<br/><br/>
///Used  the required fields for special Dates in DatePicker in order to customize the special dates in a calendar.
///<br/>fields-Fields	default-null
///<br/><br/>
///Specifies the specials dates
///<br/>date-string	default-
///<br/><br/>
///Specifies the icon class to special dates.
///<br/>iconClass-string	default-
///<br/><br/>
///Specifies the tooltip to special dates.
///<br/>tooltip-string	default-
///<br/><br/>
///Specifies the header format to be displayed in the DatePicker calendar.
///<br/>headerFormat-string	default-MMMM yyyy
///<br/><br/>
///Specifies the height of the DatePicker input text.
///<br/>height-string	default-28px
///<br/><br/>
///HighlightSection is used to highlight currently selected date's month/week/workdays. See below to get available HighlightSection options
///<br/>highlightSection-string | ej.DatePicker.HighlightSection	default-none
///<br/><br/>
///Weekend  dates will be highlighted when this property is set to true.
///<br/>highlightWeekend-boolean	default-false
///<br/><br/>
///Specifies the HTML Attributes of the DatePicker.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Change the DatePicker calendar and date format based on given culture.
///<br/>locale-string	default-en-US
///<br/><br/>
///Specifies the maximum date in the calendar that the user can select.
///<br/>maxDate-string|Date	default-new Date(2099, 11, 31)
///<br/><br/>
///Specifies the minimum date in the calendar that the user can select.
///<br/>minDate-string|Date	default-new Date(1900, 00, 01)
///<br/><br/>
///Allows to toggles the read only state of the DatePicker. When the widget is readOnly, it doesn't allow your input.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///It allows to display footer in DatePicker calendar.
///<br/>showFooter-boolean	default-true
///<br/><br/>
///It allows to display/hides the other months days from the current month calendar in a DatePicker.
///<br/>showOtherMonths-boolean	default-true
///<br/><br/>
///Shows/hides the date icon button at right side of textbox, which is used to open or close the DatePicker calendar popup.
///<br/>showPopupButton-boolean	default-true
///<br/><br/>
///DatePicker input is displayed with rounded corner when this property is set to true.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Used to show the tooltip when hovering on the days in the DatePicker calendar.
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///Specifies the special dates in DatePicker.
///<br/>specialDates-any	default-null
///<br/><br/>
///Specifies the start day of the week in DatePicker calendar.
///<br/>startDay-number	default-0
///<br/><br/>
///Specifies the start level view in DatePicker calendar. See below available Levels
///<br/>startLevel-string | ej.DatePicker.Level	default-ej.DatePicker.Level.Month
///<br/><br/>
///Specifies the number of months to be navigate for one click of next and previous button in a DatePicker Calendar.
///<br/>stepMonths-number	default-1
///<br/><br/>
///Provides option to customize the tooltip format.
///<br/>tooltipFormat-string	default-ddd MMM dd yyyy
///<br/><br/>
///Sets the jQuery validation support to DatePicker Date value. See validation
///<br/>validationMessage-any	default-null
///<br/><br/>
///Sets the jQuery validation custom rules to the DatePicker. see validation
///<br/>validationRules-any	default-null
///<br/><br/>
///sets or returns the current value of DatePicker
///<br/>value-string|Date	default-null
///<br/><br/>
///Specifies the water mark text to be displayed in input text.
///<br/>watermarkText-string	default-Select date
///<br/><br/>
///Specifies the width of the DatePicker input text.
///<br/>width-string	default-160px
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.DateTimePicker=function(){};
ej.DateTimePicker.prototype={

disable:function(){
/// <summary>
/// Disables the DateTimePicker control.
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the DateTimePicker control.
/// </summary>
},
getValue:function(){
/// <summary>
/// Returns the current datetime value in the DateTimePicker.
/// </summary>
},
hide:function(){
/// <summary>
/// Hides or closes the DateTimePicker popup.
/// </summary>
},
setCurrentDateTime:function(){
/// <summary>
/// Updates the current system date value and time value to the DateTimePicker.
/// </summary>
},
show:function(){
/// <summary>
/// Shows or opens the DateTimePicker popup.
/// </summary>
},
};
jQuery.fn.ejDateTimePicker=function(){
this.data("ejDateTimePicker",new	ej.DateTimePicker());
return this;
};
jQuery.fn.ejDateTimePicker = function (options) {
/// <summary><br/>
///The DateTimePicker control is used to input the date and time with a specific format. It combines the DatePicker and TimePicker controls so that users can select the date and time with their desired format.<br/><br/>
///Displays the custom text for the buttons inside the DateTimePicker popup. when the culture value changed, we can change the buttons text based on the culture.
///<br/>buttonText-ButtonText	default-{ today: Today, timeNow: Time Now, done: Done, timeTitle: Time }
///<br/><br/>
///Sets the text for the Done button inside the datetime popup.
///<br/>done-string	default-
///<br/><br/>
///Sets the text for the Now button inside the datetime popup.
///<br/>timeNow-string	default-
///<br/><br/>
///Sets the header text for the Time dropdown.
///<br/>timeTitle-string	default-
///<br/><br/>
///Sets the text for the Today button inside the datetime popup.
///<br/>today-string	default-
///<br/><br/>
///Set the root class for DateTimePicker theme. This cssClass API helps to use custom skinning option for DateTimePicker control.
///<br/>cssClass-string	default-
///<br/><br/>
///Defines the datetime format displayed in the DateTimePicker. The value should be a combination of date format and time format.
///<br/>dateTimeFormat-string	default-M/d/yyyy h:mm tt
///<br/><br/>
///Specifies the header format of the datepicker inside the DateTimePicker popup. See DatePicker.Header
///<br/>dayHeaderFormat-ej.DatePicker.Header|string	default-ej.DatePicker.Header.Min
///<br/><br/>
///Specifies the drill down level in datepicker inside the DateTimePicker popup. See ej.DatePicker.Level
///<br/>depthLevel-ej.DatePicker.Level|string	default-
///<br/><br/>
///Enable or disable the animation effect in DateTimePicker.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///When this property is set to false, it disables the DateTimePicker control.
///<br/>enabled-boolean	default-false
///<br/><br/>
///Enables or disables the state maintenance of DateTimePicker.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Sets the DateTimePicker direction as right to left alignment.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///When enableStrictMode true it allows the value outside of the range also but it highlights the textbox with error class, otherwise it internally changed to the correct value.
///<br/>enableStrictMode-boolean	default-false
///<br/><br/>
///Specifies the header format to be displayed in the DatePicker calendar inside the DateTimePicker popup.
///<br/>headerFormat-string	default-MMMM yyyy
///<br/><br/>
///Defines the height of the DateTimePicker textbox.
///<br/>height-string|number	default-30
///<br/><br/>
///Specifies the HTML Attributes of the ejDateTimePicker
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Sets the time interval between the two adjacent time values in the time popup.
///<br/>interval-number	default-30
///<br/><br/>
///Defines the localization culture for DateTimePicker.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the maximum value to the DateTimePicker. Beyond the maximum value an error class is added to the wrapper element when we set true to enableStrictMode.
///<br/>maxDateTime-string|Date	default-new Date(12/31/2099 11:59:59 PM)
///<br/><br/>
///Sets the minimum value to the DateTimePicker. Behind the minimum value an error class is added to the wrapper element.
///<br/>minDateTime-string|Date	default-new Date(1/1/1900 12:00:00 AM)
///<br/><br/>
///Specifies the popup position of DateTimePicker.See below to know available popup positions
///<br/>popupPosition-string | ej.popupPosition	default-ej.DateTimePicker.Bottom
///<br/><br/>
///Indicates that the DateTimePicker value can only be read and canâ€™t change.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///It allows showing days in other months of DatePicker calendar inside the DateTimePicker popup.
///<br/>showOtherMonths-boolean	default-true
///<br/><br/>
///Shows or hides the arrow button from the DateTimePicker textbox. When the button disabled, the DateTimePicker popup opens while focus in the textbox and hides while focus out from the textbox.
///<br/>showPopupButton-boolean	default-true
///<br/><br/>
///Changes the sharped edges into rounded corner for the DateTimePicker textbox and popup.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the start day of the week in datepicker inside the DateTimePicker popup.
///<br/>startDay-number	default-1
///<br/><br/>
///Specifies the start level view in datepicker inside the DateTimePicker popup. See DatePicker.Level
///<br/>startLevel-ej.DatePicker.Level|string	default-ej.DatePicker.Level.Month or month
///<br/><br/>
///Specifies the number of months to navigate at one click of next and previous button in datepicker inside the DateTimePicker popup.
///<br/>stepMonths-number	default-1
///<br/><br/>
///Defines the time format displayed in the time dropdown inside the DateTimePicker popup.
///<br/>timeDisplayFormat-string	default-h:mm tt
///<br/><br/>
///We can drill down up to time interval on selected date with meridian details.
///<br/>timeDrillDown-TimeDrillDown	default-{ enabled: false, interval: 5, showMeridian: false, autoClose: true }
///<br/><br/>
///This is the field to show/hide the timeDrillDown in DateTimePicker.
///<br/>enabled-boolean	default-
///<br/><br/>
///Sets the interval time of minutes on selected date.
///<br/>interval-number	default-
///<br/><br/>
///Allows the user to show or hide the meridian with time in DateTimePicker.
///<br/>showMeridian-boolean	default-
///<br/><br/>
///After choosing the time, the popup will close automatically if we set it as true, otherwise we focus out the DateTimePicker or choose timeNow button for closing the popup.
///<br/>autoClose-boolean	default-
///<br/><br/>
///Defines the width of the time dropdown inside the DateTimePicker popup.
///<br/>timePopupWidth-string|number	default-100
///<br/><br/>
///Set the jquery validation error message in DateTimePicker.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Set the jquery validation rules in DateTimePicker.
///<br/>validationRules-any	default-null
///<br/><br/>
///Sets the DateTime value to the control.
///<br/>value-string|Date	default-
///<br/><br/>
///Defines the width of the DateTimePicker textbox.
///<br/>width-string|number	default-143
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Diagram=function(){};
ej.Diagram.prototype={

add:function(node){
/// <summary>
/// Add nodes and connectors to diagram at runtime
/// </summary>
/// <param name="node"	type="any">a JSON to define a node/connector or an array of nodes and connector</param>
},
addLabel:function(nodeName, newLabel){
/// <summary>
/// Add a label to a node at runtime
/// </summary>
/// <param name="nodeName"	type="string">name of the node to which label will be added</param>
/// <param name="newLabel"	type="any">JSON for the new label to be added</param>
},
addPhase:function(name, options){
/// <summary>
/// Add a phase to a swimlane at runtime
/// </summary>
/// <param name="name"	type="string">name of the swimlane to which the phase will be added</param>
/// <param name="options"	type="any">JSON object to define the phase to be added</param>
},
addPorts:function(name, ports){
/// <summary>
/// Add a collection of ports to the node specified by name
/// </summary>
/// <param name="name"	type="string">name of the node to which the ports have to be added</param>
/// <param name="ports"	type="Array&lt;any&gt;">a collection of ports to be added to the specified node</param>
},
addSelection:function(node, clearSelection){
/// <summary>
/// Add the specified node to selection list
/// </summary>
/// <param name="node"	type="any">the node to be selected</param>
/// <param name="clearSelection"	type="boolean">to define whether to clear the existing selection or not</param>
},
align:function(direction){
/// <summary>
/// Align the selected objects based on the reference object and direction
/// </summary>
/// <param name="direction"	type="string">to specify the direction towards which the selected objects are to be aligned("left","right",top","bottom")</param>
},
bringIntoView:function(rect){
/// <summary>
/// Bring the specified portion of the diagram content to the diagram viewport
/// </summary>
/// <param name="rect"	type="any">the rectangular region that is to be brought into diagram viewport</param>
},
bringToCenter:function(rect){
/// <summary>
/// Bring the specified portion of the diagram content to the center of the diagram viewport
/// </summary>
/// <param name="rect"	type="any">the rectangular region that is to be brought to the center of diagram viewport</param>
},
bringToFront:function(){
/// <summary>
/// Visually move the selected object over all other intersected objects
/// </summary>
},
clear:function(){
/// <summary>
/// Remove all the elements from diagram
/// </summary>
},
clearSelection:function(){
/// <summary>
/// Remove the current selection in diagram
/// </summary>
},
copy:function(){
/// <summary>
/// Copy the selected object to internal clipboard and get the copied object
/// </summary>
},
cut:function(){
/// <summary>
/// Cut the selected object from diagram to diagram internal clipboard
/// </summary>
},
exportDiagram:function(options){
/// <summary>
/// Export the diagram as downloadable files or as data
/// </summary>
/// <param name="options"	type="Diagram.Options">options to export the desired region of diagram to the desired formats.NameTypeDescriptionfileNamestringname of the file to be downloaded.formatstringformat of the exported file/data. See [File Formats](/js/api/global#fileformats).modestringto set whether to export diagram as a file or as raw data. See [Export Modes](/js/api/global#exportmodes).regionstringto set the region of the diagram to be exported. See [Region](/js/api/global#region).boundsobjectto export any custom region of diagram.marginobjectto set margin to the exported data.</param>
},
findNode:function(name){
/// <summary>
/// Read a node/connector object by its name
/// </summary>
/// <param name="name"	type="string">name of the node/connector that is to be identified</param>
},
fitToPage:function(mode, region, margin){
/// <summary>
/// Fit the diagram content into diagram viewport
/// </summary>
/// <param name="mode"	type="string">to set the mode of fit to command. See [Fit Mode](/js/api/global#fitmode)</param>
/// <param name="region"	type="string">to set whether the region to be fit will be based on diagram elements or page settings [Region](/js/api/global#region)</param>
/// <param name="margin"	type="any">to set the required margin</param>
},
group:function(){
/// <summary>
/// Group the selected nodes and connectors
/// </summary>
},
insertLabel:function(name, label, index){
/// <summary>
/// Insert a label into a node's label collection at runtime
/// </summary>
/// <param name="name"	type="string">name of the node to which the label has to be inserted</param>
/// <param name="label"	type="any">JSON to define the new label</param>
/// <param name="index"	type="number">index to insert the label into the node</param>
},
layout:function(){
/// <summary>
/// Refresh the diagram with the specified layout
/// </summary>
},
load:function(data){
/// <summary>
/// Load the diagram
/// </summary>
/// <param name="data"	type="any">JSON data to load the diagram</param>
},
moveForward:function(){
/// <summary>
/// Visually move the selected object over its closest intersected object
/// </summary>
},
nudge:function(direction, delta){
/// <summary>
/// Move the selected objects by either one pixel or by the pixels specified through argument
/// </summary>
/// <param name="direction"	type="string">specifies the direction to move the selected objects ("left","right",top","bottom")</param>
/// <param name="delta"	type="number">specifies the number of pixels by which the selected objects have to be moved</param>
},
paste:function(object, rename){
/// <summary>
/// Paste the selected object from internal clipboard to diagram
/// </summary>
/// <param name="object"	type="any">object to be added to diagram</param>
/// <param name="rename"	type="boolean">to define whether the specified object is to be renamed or not</param>
},
print:function(){
/// <summary>
/// Print the diagram as image
/// </summary>
},
redo:function(){
/// <summary>
/// Restore the last action that was reverted
/// </summary>
},
refresh:function(){
/// <summary>
/// Refresh the diagram at runtime
/// </summary>
},
remove:function(node){
/// <summary>
/// Remove either the given node/connector or the selected element from diagram
/// </summary>
/// <param name="node"	type="any">the node/connector to be removed from diagram</param>
},
removeSelection:function(node){
/// <summary>
/// Remove a particular object from selection list
/// </summary>
/// <param name="node"	type="any">the node/connector to be removed from selection list</param>
},
sameHeight:function(){
/// <summary>
/// Scale the selected objects to the height of the first selected object
/// </summary>
},
sameSize:function(){
/// <summary>
/// Scale the selected objects to the size of the first selected object
/// </summary>
},
sameWidth:function(){
/// <summary>
/// Scale the selected objects to the width of the first selected object
/// </summary>
},
save:function(){
/// <summary>
/// Returns the diagram as serialized JSON
/// </summary>
},
scrollToNode:function(node){
/// <summary>
/// Bring the node into view
/// </summary>
/// <param name="node"	type="any">the node/connector to be brought into view</param>
},
selectAll:function(){
/// <summary>
/// Select all nodes and connector in diagram
/// </summary>
},
sendBackward:function(){
/// <summary>
/// Visually move the selected object behind its closest intersected object
/// </summary>
},
sendToBack:function(){
/// <summary>
/// Visually move the selected object behind all other intersected objects
/// </summary>
},
spaceAcross:function(){
/// <summary>
/// Update the horizontal space between the selected objects as equal and within the selection boundary
/// </summary>
},
spaceDown:function(){
/// <summary>
/// Update the vertical space between the selected objects as equal and within the selection boundary
/// </summary>
},
startLabelEdit:function(node, label){
/// <summary>
/// Move the specified label to edit mode
/// </summary>
/// <param name="node"	type="any">node/connector that contains the label to be edited</param>
/// <param name="label"	type="any">to be edited</param>
},
undo:function(){
/// <summary>
/// Reverse the last action that was performed
/// </summary>
},
ungroup:function(){
/// <summary>
/// Ungroup the selected group
/// </summary>
},
update:function(options){
/// <summary>
/// Update diagram at runtime
/// </summary>
/// <param name="options"	type="any">JSON to specify the diagram properties that have to be modified</param>
},
updateConnector:function(name, options){
/// <summary>
/// Update Connectors at runtime
/// </summary>
/// <param name="name"	type="string">name of the connector to be updated</param>
/// <param name="options"	type="any">JSON to specify the connector properties that have to be updated</param>
},
updateLabel:function(nodeName, label, options){
/// <summary>
/// Update the given label at runtime
/// </summary>
/// <param name="nodeName"	type="string">the name of node/connector which contains the label to be updated</param>
/// <param name="label"	type="any">the label to be modified</param>
/// <param name="options"	type="any">JSON to specify the label properties that have to be updated</param>
},
updateNode:function(name, options){
/// <summary>
/// Update nodes at runtime
/// </summary>
/// <param name="name"	type="string">name of the node that is to be updated</param>
/// <param name="options"	type="any">JSON to specify the properties of node that have to be updated</param>
},
updatePort:function(nodeName, port, options){
/// <summary>
/// Update a port with its modified properties at runtime
/// </summary>
/// <param name="nodeName"	type="string">the name of node which contains the port to be updated</param>
/// <param name="port"	type="any">the port to be updated</param>
/// <param name="options"	type="any">JSON to specify the properties of the port that have to be updated</param>
},
updateSelectedObject:function(name){
/// <summary>
/// Update the specified node as selected object
/// </summary>
/// <param name="name"	type="string">name of the node to be updated as selected object</param>
},
updateSelection:function(showUserHandles){
/// <summary>
/// Update the selection at runtime
/// </summary>
/// <param name="showUserHandles"	type="boolean">to specify whether to show the user handles or not</param>
},
updateUserHandles:function(node){
/// <summary>
/// Update userhandles with respect to the given node
/// </summary>
/// <param name="node"	type="any">node/connector with respect to which, the user handles have to be updated</param>
},
updateViewPort:function(){
/// <summary>
/// Update the diagram viewport at runtime
/// </summary>
},
upgrade:function(data){
/// <summary>
/// Upgrade the diagram from old version
/// </summary>
/// <param name="data"	type="any">to be upgraded</param>
},
zoomTo:function(zoom){
/// <summary>
/// Used to zoomIn/zoomOut diagram
/// </summary>
/// <param name="zoom"	type="any">options to zoom the diagram(zoom factor, zoomIn/zoomOut)</param>
},
};
jQuery.fn.ejDiagram=function(){
this.data("ejDiagram",new	ej.Diagram());
return this;
};
jQuery.fn.ejDiagram = function (options) {
/// <summary><br/>
///The diagram control provides 2D surface to visualize the data as shapes, lines, text and images. It can be configured to DOM element such as DIV.<br/><br/>
///Defines the background color of diagram elements
///<br/>backgroundColor-string	default-transparent
///<br/><br/>
///Defines the path of the background image of diagram elements
///<br/>backgroundImage-string	default-
///<br/><br/>
///Defines how to align the background image over the diagram area.
///<br/>alignment-ej.datavisualization.Diagram.ImageAlignment |string	default-ej.datavisualization.Diagram.ImageAlignment.XMidYMid
///<br/><br/>
///Defines how the background image should be scaled/stretched
///<br/>scale-ej.datavisualization.Diagram.ScaleConstraints |string	default-ej.datavisualization.Diagram.ScaleConstraints.Meet
///<br/><br/>
///Sets the source path of the background image
///<br/>source-string	default-null
///<br/><br/>
///Sets the direction of line bridges.
///<br/>bridgeDirection-ej.datavisualization.Diagram.BridgeDirection|string	default-ej.datavisualization.Diagram.BridgeDirection.Top
///<br/><br/>
///Defines a set of custom commands and binds them with a set of desired key gestures.
///<br/>commandManager-CommandManager	default-
///<br/><br/>
///An object that maps a set of command names with the corresponding command objects
///<br/>commands-any	default-{}
///<br/><br/>
///A method that defines whether the command is executable at the moment or not.
///<br/>canExecute-Function	default-
///<br/><br/>
///A method that defines what to be executed when the key combination is recognized.
///<br/>execute-Function	default-
///<br/><br/>
///Defines a combination of keys and key modifiers, on recognition of which the command will be executed
///<br/>gesture-any	default-
///<br/><br/>
///Sets the key value, on recognition of which the command will be executed.
///<br/>key-ej.datavisualization.Diagram.Keys|string	default-ej.datavisualization.Diagram.Keys.None
///<br/><br/>
///Sets a combination of key modifiers, on recognition of which the command will be executed.
///<br/>keyModifiers-ej.datavisualization.Diagram.KeyModifiers|string	default-ej.datavisualization.Diagram.KeyModifiers.None
///<br/><br/>
///Defines any additional parameters that are required at runtime
///<br/>parameter-any	default-null
///<br/><br/>
///A collection of JSON objects where each object represents a connector
///<br/>connectors-Array&lt;Connectors&gt;	default-[]
///<br/><br/>
///To maintain additional information about connectors
///<br/>addInfo-any	default-null
///<br/><br/>
///Defines the width of the line bridges
///<br/>bridgeSpace-number	default-10
///<br/><br/>
///Enables or disables the behaviors of connectors.
///<br/>constraints-ej.datavisualization.Diagram.ConnectorConstraints|string	default-ej.datavisualization.Diagram.ConnectorConstraints.Default
///<br/><br/>
///Defines the radius of the rounded corner
///<br/>cornerRadius-number	default-0
///<br/><br/>
///Configures the styles of shapes
///<br/>cssClass-string	default-
///<br/><br/>
///Sets the horizontal alignment of the connector. Applicable, if the parent of the connector is a container.
///<br/>horizontalAlign-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Left
///<br/><br/>
///A collection of JSON objects where each object represents a label.
///<br/>labels-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables/disables the bold style
///<br/>bold-boolean	default-false
///<br/><br/>
///Sets the border color of the label
///<br/>borderColor-string	default-transparent
///<br/><br/>
///Sets the border width of the label
///<br/>borderWidth-number	default-0
///<br/><br/>
///Sets the fill color of the text area
///<br/>fillColor-string	default-transparent
///<br/><br/>
///Sets the font color of the text
///<br/>fontColor-string	default-black
///<br/><br/>
///Sets the font family of the text
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Defines the font size of the text
///<br/>fontSize-number	default-12
///<br/><br/>
///Sets the horizontal alignment of the label.
///<br/>horizontalAlignment-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Center
///<br/><br/>
///Enables/disables the italic style
///<br/>italic-boolean	default-false
///<br/><br/>
///To set the margin of the label
///<br/>margin-any	default-ej.datavisualization.Diagram.Margin()
///<br/><br/>
///Gets whether the label is currently being edited or not.
///<br/>mode-ej.datavisualization.Diagram.LabelEditMode|string	default-ej.datavisualization.Diagram.LabelEditMode.Edit
///<br/><br/>
///Sets the unique identifier of the label
///<br/>name-string	default-
///<br/><br/>
///Sets the fraction/ratio(relative to connector) that defines the position of the label
///<br/>offset-any	default-ej.datavisualization.Diagram.Point(0.5, 0.5)
///<br/><br/>
///Defines whether the label is editable or not
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Defines the angle to which the label needs to be rotated
///<br/>rotateAngle-number	default-0
///<br/><br/>
///Defines the label text
///<br/>text-string	default-
///<br/><br/>
///Defines how to align the text inside the label.
///<br/>textAlign-ej.datavisualization.Diagram.TextAlign|string	default-ej.datavisualization.Diagram.TextAlign.Center
///<br/><br/>
///Sets how to decorate the label text.
///<br/>textDecoration-ej.datavisualization.Diagram.TextDecorations|string	default-ej.datavisualization.Diagram.TextDecorations.None
///<br/><br/>
///Sets the vertical alignment of the label.
///<br/>verticalAlignment-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Center
///<br/><br/>
///Enables or disables the visibility of the label
///<br/>visible-boolean	default-true
///<br/><br/>
///Sets the width of the label(the maximum value of label width and the connector width will be considered as label width)
///<br/>width-number	default-50
///<br/><br/>
///Defines how the label text needs to be wrapped.
///<br/>wrapping-ej.datavisualization.Diagram.TextWrapping|string	default-ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow
///<br/><br/>
///Sets the stroke color of the connector
///<br/>lineColor-string	default-black
///<br/><br/>
///Sets the pattern of dashes and gaps used to stroke the path of the connector
///<br/>lineDashArray-string	default-
///<br/><br/>
///Defines the padding value to ease the interaction with connectors
///<br/>lineHitPadding-number	default-10
///<br/><br/>
///Sets the width of the line
///<br/>lineWidth-number	default-1
///<br/><br/>
///Defines the minimum space to be left between the bottom of parent bounds and the connector. Applicable, if the parent is a container.
///<br/>marginBottom-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the left of parent bounds and the connector. Applicable, if the parent is a container.
///<br/>marginLeft-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the right of parent bounds and the connector. Applicable, if the parent is a container.
///<br/>marginRight-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the top of parent bounds and the connector. Applicable, if the parent is a container.
///<br/>marginTop-number	default-0
///<br/><br/>
///Sets a unique name for the connector
///<br/>name-string	default-
///<br/><br/>
///Defines the transparency of the connector
///<br/>opacity-number	default-1
///<br/><br/>
///Defines the size and preview size of the node to add that to symbol palette. To explore palette item, refer Palette Item
///<br/>paletteItem-any	default-null
///<br/><br/>
///Sets the parent name of the connector.
///<br/>parent-string	default-
///<br/><br/>
///An array of JSON objects where each object represents a segment
///<br/>segments-Array&lt;any&gt;	default-[ { type:straight } ]
///<br/><br/>
///Sets the direction of orthogonal segment
///<br/>direction-string	default-
///<br/><br/>
///Describes the length of orthogonal segment
///<br/>length-number	default-undefined
///<br/><br/>
///Describes the end point of bezier/straight segment
///<br/>point-ej.datavisualization.Diagram.ConnectorsSourcePoint|string	default-Diagram.Point()
///<br/><br/>
///Defines the first control point of the bezier segment
///<br/>point1-ej.datavisualization.Diagram.ConnectorsSourcePoint|string	default-null
///<br/><br/>
///Defines the second control point of bezier segment
///<br/>point2-ej.datavisualization.Diagram.ConnectorsSourcePoint|string	default-null
///<br/><br/>
///Sets the type of the segment.
///<br/>type-ej.datavisualization.Diagram.Segments|string	default-ej.datavisualization.Diagram.Segments.Straight
///<br/><br/>
///Describes the length and angle between the first control point and the start point of bezier segment
///<br/>vector1-any	default-null
///<br/><br/>
///Describes the length and angle between the second control point and end point of bezier segment
///<br/>vector2-any	default-null
///<br/><br/>
///Defines the source decorator of the connector
///<br/>sourceDecorator-any	default-{ shape:arrow, width: 8, height:8, borderColor:black, fillColor:black }
///<br/><br/>
///Sets the border color of the source decorator
///<br/>borderColor-string	default-black
///<br/><br/>
///Sets the border width of the decorator
///<br/>borderWidth-number	default-1
///<br/><br/>
///Sets the fill color of the source decorator
///<br/>fillColor-string	default-black
///<br/><br/>
///Sets the height of the source decorator
///<br/>height-number	default-8
///<br/><br/>
///Defines the custom shape of the source decorator
///<br/>pathData-string	default-
///<br/><br/>
///Defines the shape of the source decorator.
///<br/>shape-ej.datavisualization.Diagram.DecoratorShapes|string	default-ej.datavisualization.Diagram.DecoratorShapes.Arrow
///<br/><br/>
///Defines the width of the source decorator
///<br/>width-number	default-8
///<br/><br/>
///Sets the source node of the connector
///<br/>sourceNode-string	default-
///<br/><br/>
///Defines the space to be left between the source node and the source point of a connector
///<br/>sourcePadding-number	default-0
///<br/><br/>
///Describes the start point of the connector
///<br/>sourcePoint-any	default-ej.datavisualization.Diagram.Point()
///<br/><br/>
///Defines the x-coordinate of a position
///<br/>x-number	default-0
///<br/><br/>
///Defines the y-coordinate of a position
///<br/>y-number	default-0
///<br/><br/>
///Sets the source port of the connector
///<br/>sourcePort-string	default-
///<br/><br/>
///Defines the target decorator of the connector
///<br/>targetDecorator-any	default-{ shape:arrow, width: 8, height:8, borderColor:black, fillColor:black }
///<br/><br/>
///Sets the border color of the decorator
///<br/>borderColor-string	default-black
///<br/><br/>
///Sets the color with which the decorator will be filled
///<br/>fillColor-string	default-black
///<br/><br/>
///Defines the height of the target decorator
///<br/>height-number	default-8
///<br/><br/>
///Defines the custom shape of the target decorator
///<br/>pathData-string	default-
///<br/><br/>
///Defines the shape of the target decorator.
///<br/>shape-ej.datavisualization.Diagram.DecoratorShapes|string	default-ej.datavisualization.Diagram.DecoratorShapes.Arrow
///<br/><br/>
///Defines the width of the target decorator
///<br/>width-number	default-8
///<br/><br/>
///Sets the target node of the connector
///<br/>targetNode-string	default-
///<br/><br/>
///Defines the space to be left between the target node and the target point of the connector
///<br/>targetPadding-number	default-0
///<br/><br/>
///Describes the end point of the connector
///<br/>targetPoint-ej.datavisualization.Diagram.ConnectorsSourcePoint|string	default-ej.datavisualization.Diagram.Point()
///<br/><br/>
///Sets the targetPort of the connector
///<br/>targetPort-string	default-
///<br/><br/>
///Defines the tooltip that should be shown when the mouse hovers over connector. For tooltip properties, refer Tooltip
///<br/>tooltip-any	default-null
///<br/><br/>
///To set the vertical alignment of connector (Applicable,if the parent is group).
///<br/>verticalAlign-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Top
///<br/><br/>
///Enables or disables the visibility of connector
///<br/>visible-boolean	default-true
///<br/><br/>
///Sets the z-index of the connector
///<br/>zOrder-number	default-0
///<br/><br/>
///Binds the custom JSON data with connector properties
///<br/>connectorTemplate-any	default-null
///<br/><br/>
///Enables/Disables the default behaviors of the diagram.
///<br/>constraints-ej.datavisualization.Diagram.DiagramConstraints|string	default-ej.datavisualization.Diagram.DiagramConstraints.All
///<br/><br/>
///An object to customize the context menu of diagram
///<br/>contextMenu-ContextMenu	default-
///<br/><br/>
///Defines the collection of context menu items
///<br/>items-Array&lt;any&gt;	default-[]
///<br/><br/>
///To set whether to display the default context menu items or not
///<br/>showCustomMenuItemsOnly-boolean	default-false
///<br/><br/>
///Configures the data source that is to be bound with diagram
///<br/>dataSourceSettings-DataSourceSettings	default-
///<br/><br/>
///Defines the data source either as a collection of objects or as an instance of ej.DataManager
///<br/>dataSource-any	default-null
///<br/><br/>
///Sets the unique id of the data source items
///<br/>id-string	default-
///<br/><br/>
///Defines the parent id of the data source item
///<br/>parent-string	default-&#39;&#39;
///<br/><br/>
///Describes query to retrieve a set of data from the specified datasource
///<br/>query-string	default-null
///<br/><br/>
///Sets the unique id of the root data source item
///<br/>root-string	default-
///<br/><br/>
///Describes the name of the table on which the specified query has to be executed
///<br/>tableName-string	default-null
///<br/><br/>
///Initializes the default values for nodes and connectors
///<br/>defaultSettings-DefaultSettings	default-{}
///<br/><br/>
///Initializes the default connector properties
///<br/>connector-any	default-null
///<br/><br/>
///Initializes the default properties of groups
///<br/>group-any	default-null
///<br/><br/>
///Initializes the default properties for nodes
///<br/>node-any	default-null
///<br/><br/>
///Sets the type of Json object to be drawn through drawing tool
///<br/>drawType-any	default-{}
///<br/><br/>
///Enables or disables auto scroll in diagram
///<br/>enableAutoScroll-boolean	default-true
///<br/><br/>
///Enables or disables diagram context menu
///<br/>enableContextMenu-boolean	default-true
///<br/><br/>
///Specifies the height of the diagram
///<br/>height-string	default-null
///<br/><br/>
///Customizes the undo redo functionality
///<br/>historyManager-HistoryManager	default-
///<br/><br/>
///A method that takes a history entry as argument and returns whether the specific entry can be popped or not
///<br/>canPop-Function	default-
///<br/><br/>
///A method that ends grouping the changes
///<br/>closeGroupAction-Function	default-
///<br/><br/>
///A method that removes the history of a recent change made in diagram
///<br/>pop-Function	default-
///<br/><br/>
///A method that allows to track the custom changes made in diagram
///<br/>push-Function	default-
///<br/><br/>
///Defines what should be happened while trying to restore a custom change
///<br/>redo-Function	default-null
///<br/><br/>
///A method that starts to group the changes to revert/restore them in a single undo or redo
///<br/>startGroupAction-Function	default-
///<br/><br/>
///Defines what should be happened while trying to revert a custom change
///<br/>undo-Function	default-
///<br/><br/>
///Automatically arranges the nodes and connectors in a predefined manner.
///<br/>layout-Layout	default-
///<br/><br/>
///Specifies the custom bounds to arrange/align the layout
///<br/>bounds-any	default-ej.datavisualization.Diagram.Rectangle()
///<br/><br/>
///Defines the fixed node with reference to which, the layout will be arranged and fixed node will not be repositioned
///<br/>fixedNode-string	default-
///<br/><br/>
///Customizes the orientation of trees/sub trees. For orientations, see Chart Orientations. For chart types, see Chart Types
///<br/>getLayoutInfo-any	default-null
///<br/><br/>
///Sets the space to be horizontally left between nodes
///<br/>horizontalSpacing-number	default-30
///<br/><br/>
///Defines the space to be left between layout bounds and layout.
///<br/>margin-any	default-ej.datavisualization.Diagram.Margin()
///<br/><br/>
///Defines how to horizontally align the layout within the layout bounds
///<br/>horizontalAlignment-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Center
///<br/><br/>
///Defines how to vertically align the layout within the layout bounds
///<br/>verticalAlignment-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Center
///<br/><br/>
///Sets the orientation/direction to arrange the diagram elements.
///<br/>orientation-ej.datavisualization.Diagram.LayoutOrientations|string	default-ej.datavisualization.Diagram.LayoutOrientations.TopToBottom
///<br/><br/>
///Sets the type of the layout based on which the elements will be arranged.
///<br/>type-ej.datavisualization.Diagram.LayoutTypes|string	default-ej.datavisualization.Diagram.LayoutTypes.None
///<br/><br/>
///Sets the space to be vertically left between nodes
///<br/>verticalSpacing-number	default-30
///<br/><br/>
///Defines the current culture of diagram
///<br/>locale-string	default-en-US
///<br/><br/>
///Array of JSON objects where each object represents a node
///<br/>nodes-Array&lt;Nodes&gt;	default-[]
///<br/><br/>
///Defines the type of BPMN Activity. Applicable, if the node is a bpmn activity.
///<br/>activity-ej.datavisualization.Diagram.BPMNActivity|string	default-ej.datavisualization.Diagram.BPMNActivity.Task
///<br/><br/>
///To maintain additional information about nodes
///<br/>addInfo-any	default-{}
///<br/><br/>
///Sets the border color of node
///<br/>borderColor-string	default-black
///<br/><br/>
///Sets the pattern of dashes and gaps to stroke the border
///<br/>borderDashArray-string	default-
///<br/><br/>
///Sets the border width of the node
///<br/>borderWidth-number	default-1
///<br/><br/>
///Defines whether the group can be ungrouped or not
///<br/>canUngroup-boolean	default-true
///<br/><br/>
///Array of JSON objects where each object represents a child node/connector
///<br/>children-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines whether the BPMN data object is a collection or not
///<br/>collection-boolean	default-false
///<br/><br/>
///Defines the distance to be left between a node and its connections(In coming and out going connections).
///<br/>connectorPadding-number	default-0
///<br/><br/>
///Enables or disables the default behaviors of the node.
///<br/>constraints-ej.datavisualization.Diagram.NodeConstraints|string	default-ej.datavisualization.Diagram.NodeConstraints.Default
///<br/><br/>
///Defines how the child objects need to be arranged(Either in any predefined manner or automatically). Applicable, if the node is a group.
///<br/>container-any	default-null
///<br/><br/>
///Defines the orientation of the container. Applicable, if the group is a container.
///<br/>orientation-string	default-vertical
///<br/><br/>
///Sets the type of the container. Applicable if the group is a container.
///<br/>type-ej.datavisualization.Diagram.ContainerType|string	default-ej.datavisualization.Diagram.ContainerType.Canvas
///<br/><br/>
///Defines the corner radius of rectangular shapes.
///<br/>cornerRadius-number	default-0
///<br/><br/>
///Configures the styles of shapes
///<br/>cssClass-string	default-
///<br/><br/>
///Sets the type of the BPMN Events. Applicable, if the node is a bpmn event.
///<br/>event-ej.datavisualization.Diagram.BPMNEvents|string	default-ej.datavisualization.Diagram.BPMNEvents.Start
///<br/><br/>
///Defines whether the node can be automatically arranged using layout or not
///<br/>excludeFromLayout-boolean	default-false
///<br/><br/>
///Defines the fill color of the node
///<br/>fillColor-string	default-white
///<br/><br/>
///Sets the type of the BPMN Gateway. Applicable, if the node is a bpmn gateway.
///<br/>gateway-ej.datavisualization.Diagram.BPMNGateways|string	default-ej.datavisualization.Diagram.BPMNGateways.None
///<br/><br/>
///Paints the node with a smooth transition from one color to another color
///<br/>gradient-any	default-
///<br/><br/>
///Paints the node with linear color transitions
///<br/>LinearGradient-any	default-
///<br/><br/>
///Defines the different colors and the region of color transitions
///<br/>stops-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the left most position(relative to node) of the rectangular region that needs to be painted
///<br/>x1-number	default-0
///<br/><br/>
///Defines the right most position(relative to node) of the rectangular region that needs to be painted
///<br/>x2-number	default-0
///<br/><br/>
///Defines the top most position(relative to node) of the rectangular region that needs to be painted
///<br/>y1-number	default-0
///<br/><br/>
///Defines the bottom most position(relative to node) of the rectangular region that needs to be painted
///<br/>y2-number	default-0
///<br/><br/>
///Paints the node with radial color transitions. A focal point defines the beginning of the gradient, and a circle defines the end point of the gradient.
///<br/>RadialGradient-any	default-
///<br/><br/>
///Defines the position of the outermost circle
///<br/>cx-number	default-0
///<br/><br/>
///Defines the outer most circle of the radial gradient
///<br/>cy-number	default-0
///<br/><br/>
///Defines the innermost circle of the radial gradient
///<br/>fx-number	default-0
///<br/><br/>
///Defines the innermost circle of the radial gradient
///<br/>fy-number	default-0
///<br/><br/>
///Defines the different colors and the region of color transitions.
///<br/>stops-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the color and a position where the previous color transition ends and a new color transition starts
///<br/>Stop-any	default-
///<br/><br/>
///Sets the color to be filled over the specified region
///<br/>color-string	default-
///<br/><br/>
///Sets the position where the previous color transition ends and a new color transition starts
///<br/>offset-number	default-0
///<br/><br/>
///Describes the transparency level of the region
///<br/>opacity-number	default-1
///<br/><br/>
///Defines the header of a swimlane/lane
///<br/>header-any	default-{ text: Title, fontSize: 11 }
///<br/><br/>
///Defines the height of the node
///<br/>height-number	default-0
///<br/><br/>
///Sets the horizontal alignment of the node. Applicable, if the parent of the node is a container.
///<br/>horizontalAlign-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Left
///<br/><br/>
///A read only collection of the incoming connectors/edges of the node
///<br/>inEdges-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines whether the sub tree of the node is expanded or collapsed
///<br/>isExpanded-boolean	default-true
///<br/><br/>
///Sets the node as a swimlane
///<br/>isSwimlane-boolean	default-false
///<br/><br/>
///A collection of objects where each object represents a label
///<br/>labels-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables/disables the bold style
///<br/>bold-boolean	default-false
///<br/><br/>
///Sets the border color of the label
///<br/>borderColor-string	default-transparent
///<br/><br/>
///Sets the border width of the label
///<br/>borderWidth-number	default-0
///<br/><br/>
///Sets the fill color of the text area
///<br/>fillColor-string	default-transparent
///<br/><br/>
///Sets the font color of the text
///<br/>fontColor-string	default-black
///<br/><br/>
///Sets the font family of the text
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Defines the font size of the text
///<br/>fontSize-number	default-12
///<br/><br/>
///Sets the horizontal alignment of the label.
///<br/>horizontalAlignment-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Center
///<br/><br/>
///Enables/disables the italic style
///<br/>italic-boolean	default-false
///<br/><br/>
///To set the margin of the label
///<br/>margin-any	default-ej.datavisualization.Diagram.Margin()
///<br/><br/>
///Gets whether the label is currently being edited or not.
///<br/>mode-ej.datavisualization.Diagram.LabelEditMode|string	default-ej.datavisualization.Diagram.LabelEditMode.Edit
///<br/><br/>
///Sets the unique identifier of the label
///<br/>name-string	default-
///<br/><br/>
///Sets the fraction/ratio(relative to node) that defines the position of the label
///<br/>offset-any	default-ej.datavisualization.Diagram.Point(0.5, 0.5)
///<br/><br/>
///Defines whether the label is editable or not
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Defines the angle to which the label needs to be rotated
///<br/>rotateAngle-number	default-0
///<br/><br/>
///Defines the label text
///<br/>text-string	default-
///<br/><br/>
///Defines how to align the text inside the label.
///<br/>textAlign-ej.datavisualization.Diagram.TextAlign|string	default-ej.datavisualization.Diagram.TextAlign.Center
///<br/><br/>
///Sets how to decorate the label text.
///<br/>textDecoration-ej.datavisualization.Diagram.TextDecorations|string	default-ej.datavisualization.Diagram.TextDecorations.None
///<br/><br/>
///Sets the vertical alignment of the label.
///<br/>verticalAlignment-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Center
///<br/><br/>
///Enables or disables the visibility of the label
///<br/>visible-boolean	default-true
///<br/><br/>
///Sets the width of the label(the maximum value of label width and the node width will be considered as label width)
///<br/>width-number	default-50
///<br/><br/>
///Defines how the label text needs to be wrapped.
///<br/>wrapping-ej.datavisualization.Diagram.TextWrapping|string	default-ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow
///<br/><br/>
///An array of objects where each object represents a lane. Applicable, if the node is a swimlane.
///<br/>lanes-Array&lt;any&gt;	default-[]
///<br/><br/>
///Allows to maintain additional information about lane
///<br/>addInfo-any	default-{}
///<br/><br/>
///An array of objects where each object represents a child node of the lane
///<br/>children-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the fill color of the lane
///<br/>fillColor-string	default-white
///<br/><br/>
///Defines the header of the lane
///<br/>header-any	default-{ text: Function, fontSize: 11 }
///<br/><br/>
///Defines the object as a lane
///<br/>isLane-boolean	default-false
///<br/><br/>
///Sets the unique identifier of the lane
///<br/>name-string	default-
///<br/><br/>
///Sets the orientation of the lane.
///<br/>orientation-string	default-vertical
///<br/><br/>
///Defines the minimum space to be left between the bottom of parent bounds and the node. Applicable, if the parent is a container.
///<br/>marginBottom-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the left of parent bounds and the node. Applicable, if the parent is a container.
///<br/>marginLeft-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the right of the parent bounds and the node. Applicable, if the parent is a container.
///<br/>marginRight-number	default-0
///<br/><br/>
///Defines the minimum space to be left between the top of parent bounds and the node. Applicable, if the parent is a container.
///<br/>marginTop-number	default-0
///<br/><br/>
///Defines the maximum height limit of the node
///<br/>maxHeight-number	default-0
///<br/><br/>
///Defines the maximum width limit of the node
///<br/>maxWidth-number	default-0
///<br/><br/>
///Defines the minimum height limit of the node
///<br/>minHeight-number	default-0
///<br/><br/>
///Defines the minimum width limit of the node
///<br/>minWidth-number	default-0
///<br/><br/>
///Sets the unique identifier of the node
///<br/>name-string	default-
///<br/><br/>
///Defines the position of the node on X-Axis
///<br/>offsetX-number	default-0
///<br/><br/>
///Defines the position of the node on Y-Axis
///<br/>offsetY-number	default-0
///<br/><br/>
///Defines the opaque of the node
///<br/>opacity-number	default-1
///<br/><br/>
///Defines the orientation of nodes. Applicable, if the node is a swimlane.
///<br/>orientation-string	default-vertical
///<br/><br/>
///A read only collection of outgoing connectors/edges of the node
///<br/>outEdges-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the minimum padding value to be left between the bottom most position of a group and its children. Applicable, if the group is a container.
///<br/>paddingBottom-number	default-0
///<br/><br/>
///Defines the minimum padding value to be left between the left most position of a group and its children. Applicable, if the group is a container.
///<br/>paddingLeft-number	default-0
///<br/><br/>
///Defines the minimum padding value to be left between the right most position of a group and its children. Applicable, if the group is a container.
///<br/>paddingRight-number	default-0
///<br/><br/>
///Defines the minimum padding value to be left between the top most position of a group and its children. Applicable, if the group is a container.
///<br/>paddingTop-number	default-0
///<br/><br/>
///Defines the size and preview size of the node to add that to symbol palette
///<br/>paletteItem-any	default-null
///<br/><br/>
///Defines whether the symbol should be drawn at its actual size regardless of precedence factors or not
///<br/>enableScale-boolean	default-true
///<br/><br/>
///Defines the height of the symbol
///<br/>height-number	default-0
///<br/><br/>
///Defines the margin of the symbol item
///<br/>margin-any	default-{ left: 4, right: 4, top: 4, bottom: 4 }
///<br/><br/>
///Defines the preview height of the symbol
///<br/>previewHeight-number	default-undefined
///<br/><br/>
///Defines the preview width of the symbol
///<br/>previewWidth-number	default-undefined
///<br/><br/>
///Defines the width of the symbol
///<br/>width-number	default-0
///<br/><br/>
///Sets the name of the parent group
///<br/>parent-string	default-
///<br/><br/>
///Sets the path geometry that defines the shape of a path node
///<br/>pathData-string	default-
///<br/><br/>
///An array of objects, where each object represents a smaller region(phase) of a swimlane.
///<br/>phases-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the header of the smaller regions
///<br/>label-any	default-null
///<br/><br/>
///Defines the line color of the splitter that splits adjacent phases.
///<br/>lineColor-string	default-#606060
///<br/><br/>
///Sets the dash array that used to stroke the phase splitter
///<br/>lineDashArray-string	default-3,3
///<br/><br/>
///Sets the lineWidth of the phase
///<br/>lineWidth-number	default-1
///<br/><br/>
///Sets the unique identifier of the phase
///<br/>name-string	default-
///<br/><br/>
///Sets the length of the smaller region(phase) of a swimlane
///<br/>offset-number	default-100
///<br/><br/>
///Sets the orientation of the phase
///<br/>orientation-string	default-horizontal
///<br/><br/>
///Sets the type of the object as phase
///<br/>type-string	default-phase
///<br/><br/>
///Sets the height of the phase headers
///<br/>phaseSize-number	default-0
///<br/><br/>
///Sets the ratio/ fractional value relative to node, based on which the node will be transformed(positioning, scaling and rotation)
///<br/>pivot-any	default-ej.datavisualization.Diagram.Points(0.5,0.5)
///<br/><br/>
///Defines a collection of points to draw a polygon. Applicable, if the shape is a polygon.
///<br/>points-Array&lt;any&gt;	default-[]
///<br/><br/>
///An array of objects where each object represents a port
///<br/>ports-Array&lt;any&gt;	default-[]
///<br/><br/>
///Sets the border color of the port
///<br/>borderColor-string	default-#1a1a1a
///<br/><br/>
///Sets the stroke width of the port
///<br/>borderWidth-number	default-1
///<br/><br/>
///Defines the space to be left between the port bounds and its incoming and outgoing connections.
///<br/>connectorPadding-number	default-0
///<br/><br/>
///Defines whether connections can be created with the port
///<br/>constraints-ej.datavisualization.Diagram.PortConstraints|string	default-ej.datavisualization.Diagram.PortConstraints.Connect
///<br/><br/>
///Sets the fill color of the port
///<br/>fillColor-string	default-white
///<br/><br/>
///Sets the unique identifier of the port
///<br/>name-string	default-
///<br/><br/>
///Defines the position of the port as fraction/ ratio relative to node
///<br/>offset-any	default-ej.datavisualization.Diagram.Point(0, 0)
///<br/><br/>
///Defines the path data to draw the port. Applicable, if the port shape is path.
///<br/>pathData-string	default-
///<br/><br/>
///Defines the shape of the port.
///<br/>shape-ej.datavisualization.Diagram.PortShapes|string	default-ej.datavisualization.Diagram.PortShapes.Square
///<br/><br/>
///Defines the size of the port
///<br/>size-number	default-8
///<br/><br/>
///Defines when the port should be visible.
///<br/>visibility-ej.datavisualization.Diagram.PortVisibility|string	default-ej.datavisualization.Diagram.PortVisibility.Default
///<br/><br/>
///Sets the angle to which the node should be rotated
///<br/>rotateAngle-number	default-0
///<br/><br/>
///Defines the opacity and the position of shadow
///<br/>shadow-any	default-ej.datavisualization.Diagram.Shadow()
///<br/><br/>
///Defines the angle of the shadow relative to node
///<br/>angle-number	default-45
///<br/><br/>
///Sets the distance to move the shadow relative to node
///<br/>distance-number	default-5
///<br/><br/>
///Defines the opaque of the shadow
///<br/>opacity-number	default-0.7
///<br/><br/>
///Sets the shape of the node. It depends upon the type of node.
///<br/>shape-ej.datavisualization.Diagram.BasicShapes|string	default-ej.datavisualization.Diagram.BasicShapes.Rectangle
///<br/><br/>
///Sets the source path of the image. Applicable, if the type of the node is image.
///<br/>source-string	default-
///<br/><br/>
///Defines the sub process of a BPMN Activity. Applicable, if the type of the bpmn activity is sub process.
///<br/>subProcess-any	default-ej.datavisualization.Diagram.BPMNSubProcess()
///<br/><br/>
///Defines whether the bpmn sub process is without any prescribed order or not
///<br/>adhoc-boolean	default-false
///<br/><br/>
///Sets the boundary of the BPMN process
///<br/>boundary-ej.datavisualization.Diagram.BPMNBoundary|string	default-ej.datavisualization.Diagram.BPMNBoundary.Default
///<br/><br/>
///Sets whether the bpmn subprocess is triggered as a compensation of a specific activity
///<br/>compensation-boolean	default-false
///<br/><br/>
///Defines the loop type of a sub process.
///<br/>loop-ej.datavisualization.Diagram.BPMNLoops|string	default-ej.datavisualization.Diagram.BPMNLoops.None
///<br/><br/>
///Defines the task of the bpmn activity. Applicable, if the type of activity is set as task.
///<br/>task-any	default-ej.datavisualization.Diagram.BPMNTask()
///<br/><br/>
///To set whether the task is a global task or not
///<br/>call-boolean	default-false
///<br/><br/>
///Sets whether the task is triggered as a compensation of another specific activity
///<br/>compensation-boolean	default-false
///<br/><br/>
///Sets the loop type of a bpmn task.
///<br/>loop-ej.datavisualization.Diagram.BPMNLoops|string	default-ej.datavisualization.Diagram.BPMNLoops.None
///<br/><br/>
///Sets the type of the BPMN task.
///<br/>type-ej.datavisualization.Diagram.BPMNTasks|string	default-ej.datavisualization.Diagram.BPMNTasks.None
///<br/><br/>
///Sets the id of svg/html templates. Applicable, if the node is html or native.
///<br/>templateId-string	default-
///<br/><br/>
///Defines the textBlock of a text node
///<br/>textBlock-any	default-null
///<br/><br/>
///Defines the tooltip that should be shown when the mouse hovers over node. For tooltip properties, refer Tooltip
///<br/>tooltip-any	default-null
///<br/><br/>
///Sets the type of BPMN Event Triggers.
///<br/>trigger-ej.datavisualization.Diagram.BPMNTriggers|string	default-ej.datavisualization.Diagram.BPMNTriggers.None
///<br/><br/>
///Defines the type of the node.
///<br/>type-ej.datavisualization.Diagram.Shapes|string	default-ej.datavisualization.Diagram.Shapes.Basic
///<br/><br/>
///Sets the vertical alignment of a node. Applicable, if the parent of a node is a container.
///<br/>verticalAlign-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Top
///<br/><br/>
///Defines the visibility of the node
///<br/>visible-boolean	default-true
///<br/><br/>
///Defines the width of the node
///<br/>width-number	default-0
///<br/><br/>
///Defines the z-index of the node
///<br/>zOrder-number	default-0
///<br/><br/>
///Binds the custom JSON data with node properties
///<br/>nodeTemplate-any	default-null
///<br/><br/>
///Defines the size and appearance of diagram page
///<br/>pageSettings-PageSettings	default-
///<br/><br/>
///Defines the maximum distance to be left between the object and the scroll bar to trigger auto scrolling
///<br/>autoScrollBorder-any	default-{ left: 15, top: 15, right: 15, bottom: 15 }
///<br/><br/>
///Sets whether multiple pages can be created to fit all nodes and connectors
///<br/>multiplePage-boolean	default-false
///<br/><br/>
///Defines the background color of diagram pages
///<br/>pageBackgroundColor-string	default-#ffffff
///<br/><br/>
///Defines the page border color
///<br/>pageBorderColor-string	default-#565656
///<br/><br/>
///Sets the border width of diagram pages
///<br/>pageBorderWidth-number	default-0
///<br/><br/>
///Defines the height of a page
///<br/>pageHeight-number	default-null
///<br/><br/>
///Defines the page margin
///<br/>pageMargin-number	default-24
///<br/><br/>
///Sets the orientation of the page.
///<br/>pageOrientation-ej.datavisualization.Diagram.PageOrientations|string	default-ej.datavisualization.Diagram.PageOrientations.Portrait
///<br/><br/>
///Defines the height of a diagram page
///<br/>pageWidth-number	default-null
///<br/><br/>
///Defines the scrollable area of diagram. Applicable, if the scroll limit is "limited".
///<br/>scrollableArea-any	default-null
///<br/><br/>
///Defines the scrollable region of diagram.
///<br/>scrollLimit-ej.datavisualization.Diagram.ScrollLimit|string	default-ej.datavisualization.Diagram.ScrollLimit.Infinite
///<br/><br/>
///Defines the draggable region of diagram elements.
///<br/>boundaryConstraints-ej.datavisualization.Diagram.BoundaryConstraints|string	default-ej.datavisualization.Diagram.BoundaryConstraints.Infinite
///<br/><br/>
///Enables or disables the page breaks
///<br/>showPageBreak-boolean	default-false
///<br/><br/>
///Defines the zoom value, zoom factor, scroll status and view port size of the diagram
///<br/>scrollSettings-ScrollSettings	default-
///<br/><br/>
///Allows to read the zoom value of diagram
///<br/>currentZoom-number	default-0
///<br/><br/>
///Sets the horizontal scroll offset
///<br/>horizontalOffset-number	default-0
///<br/><br/>
///Allows to extend the scrollable region that is based on the scroll limit
///<br/>padding-any	default-{left: 0, right: 0, top:0, bottom: 0}
///<br/><br/>
///Sets the vertical scroll offset
///<br/>verticalOffset-number	default-0
///<br/><br/>
///Allows to read the view port height of the diagram
///<br/>viewPortHeight-number	default-0
///<br/><br/>
///Allows to read the view port width of the diagram
///<br/>viewPortWidth-number	default-0
///<br/><br/>
///Defines the size and position of selected items and defines the appearance of selector
///<br/>selectedItems-SelectedItems	default-
///<br/><br/>
///A read only collection of the selected items
///<br/>children-Array&lt;any&gt;	default-[]
///<br/><br/>
///Controls the visibility of selector.
///<br/>constraints-ej.datavisualization.Diagram.SelectorConstraints|string	default-ej.datavisualization.Diagram.SelectorConstraints.All
///<br/><br/>
///Defines a method that dynamically enables/ disables the interaction with multiple selection.
///<br/>getConstraints-any	default-null
///<br/><br/>
///Sets the height of the selected items
///<br/>height-number	default-0
///<br/><br/>
///Sets the x position of the selector
///<br/>offsetX-number	default-0
///<br/><br/>
///Sets the y position of the selector
///<br/>offsetY-number	default-0
///<br/><br/>
///Sets the angle to rotate the selected items
///<br/>rotateAngle-number	default-0
///<br/><br/>
///Sets the angle to rotate the selected items. For tooltip properties, refer Tooltip
///<br/>tooltip-any	default-ej.datavisualization.Diagram.Tooltip()
///<br/><br/>
///A collection of frequently used commands that will be added around the selector
///<br/>userHandles-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the background color of the user handle
///<br/>backgroundColor-string	default-#2382c3
///<br/><br/>
///Sets the border color of the user handle
///<br/>borderColor-string	default-transparent
///<br/><br/>
///Defines whether the user handle should be added, when more than one element is selected
///<br/>enableMultiSelection-boolean	default-false
///<br/><br/>
///Sets the stroke color of the user handle
///<br/>pathColor-string	default-transparent
///<br/><br/>
///Defines the custom shape of the user handle
///<br/>pathData-string	default-
///<br/><br/>
///Defines the position of the user handle
///<br/>position-ej.datavisualization.Diagram.UserHandlePositions |string	default-ej.datavisualization.Diagram.UserHandlePositions.BottomCenter
///<br/><br/>
///Defines the size of the user handle
///<br/>size-number	default-8
///<br/><br/>
///Defines the interactive behaviors of the user handle
///<br/>tool-any	default-
///<br/><br/>
///Defines the visibility of the user handle
///<br/>visible-boolean	default-true
///<br/><br/>
///Sets the width of the selected items
///<br/>width-number	default-0
///<br/><br/>
///Enables or disables tooltip of diagram
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///Defines the gridlines and defines how and when the objects have to be snapped
///<br/>snapSettings-SnapSettings	default-
///<br/><br/>
///Enables or disables snapping nodes/connectors to objects
///<br/>enableSnapToObject-boolean	default-true
///<br/><br/>
///Defines the appearance of horizontal gridlines
///<br/>horizontalGridLines-any	default-
///<br/><br/>
///Defines the line color of horizontal grid lines
///<br/>lineColor-string	default-lightgray
///<br/><br/>
///Specifies the pattern of dashes and gaps used to stroke horizontal grid lines
///<br/>lineDashArray-string	default-
///<br/><br/>
///A pattern of lines and gaps that defines a set of horizontal gridlines
///<br/>linesInterval-Array&lt;any&gt;	default-[1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75]
///<br/><br/>
///Specifies a set of intervals to snap the objects
///<br/>snapInterval-Array&lt;any&gt;	default-[20]
///<br/><br/>
///Defines the angle by which the object needs to be snapped
///<br/>snapAngle-number	default-5
///<br/><br/>
///Defines the minimum distance between the selected object and the nearest object
///<br/>snapObjectDistance-number	default-5
///<br/><br/>
///Defines the appearance of horizontal gridlines
///<br/>verticalGridLines-any	default-
///<br/><br/>
///Defines the line color of horizontal grid lines
///<br/>lineColor-string	default-lightgray
///<br/><br/>
///Specifies the pattern of dashes and gaps used to stroke horizontal grid lines
///<br/>lineDashArray-string	default-
///<br/><br/>
///A pattern of lines and gaps that defines a set of horizontal gridlines
///<br/>linesInterval-Array&lt;any&gt;	default-[1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75]
///<br/><br/>
///Specifies a set of intervals to snap the objects
///<br/>snapInterval-Array&lt;any&gt;	default-[20]
///<br/><br/>
///Enables/Disables the interactive behaviors of diagram.
///<br/>tool-ej.datavisualization.Diagram.Tool|string	default-ej.datavisualization.Diagram.Tool.All
///<br/><br/>
///An object that defines the description, appearance and alignments of tooltips
///<br/>tooltip-Tooltip	default-null
///<br/><br/>
///Aligns the tooltip around nodes/connectors
///<br/>alignment-any	default-
///<br/><br/>
///Defines the horizontal alignment of tooltip.
///<br/>horizontal-ej.datavisualization.Diagram.HorizontalAlignment|string	default-ej.datavisualization.Diagram.HorizontalAlignment.Center
///<br/><br/>
///Defines the vertical alignment of tooltip.
///<br/>vertical-ej.datavisualization.Diagram.VerticalAlignment|string	default-ej.datavisualization.Diagram.VerticalAlignment.Bottom
///<br/><br/>
///Sets the margin of the tooltip
///<br/>margin-any	default-{ left: 5, right: 5, top: 5, bottom: 5 }
///<br/><br/>
///Defines whether the tooltip should be shown at the mouse position or around node.
///<br/>relativeMode-ej.datavisualization.Diagram.RelativeMode|string	default-ej.datavisualization.Diagram.RelativeMode.Object
///<br/><br/>
///Sets the svg/html template to be bound with tooltip
///<br/>templateId-string	default-
///<br/><br/>
///Specifies the width of the diagram
///<br/>width-string	default-null
///<br/><br/>
///Sets the factor by which we can zoom in or zoom out
///<br/>zoomFactor-number	default-0.2
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Dialog=function(){};
ej.Dialog.prototype={

close:function(){
/// <summary>
/// Closes the dialog widget dynamically.
/// </summary>
},
collapse:function(){
/// <summary>
/// Collapses the content area when it is expanded.
/// </summary>
},
destroy:function(){
/// <summary>
/// Destroys the Dialog widget.
/// </summary>
},
expand:function(){
/// <summary>
/// Expands the content area when it is collapsed.
/// </summary>
},
isOpen:function(){
/// <summary>
/// Checks whether the Dialog widget is opened or not. This methods returns Boolean value.
/// </summary>
},
maximize:function(){
/// <summary>
/// Maximizes the Dialog widget.
/// </summary>
},
minimize:function(){
/// <summary>
/// Minimizes the Dialog widget.
/// </summary>
},
open:function(){
/// <summary>
/// Opens the Dialog widget.
/// </summary>
},
pin:function(){
/// <summary>
/// Pins the dialog in its current position.
/// </summary>
},
restore:function(){
/// <summary>
/// Restores the dialog.
/// </summary>
},
unpin:function(){
/// <summary>
/// Unpins the Dialog widget.
/// </summary>
},
setTitle:function(Title){
/// <summary>
/// Sets the title for the Dialog widget.
/// </summary>
/// <param name="Title"	type="string">The title for the dialog widget.</param>
},
setContent:function(content){
/// <summary>
/// Sets the content for the Dialog widget dynamically.
/// </summary>
/// <param name="content"	type="string">The content for the dialog widget. It accepts both string and HTML string.</param>
},
focus:function(){
/// <summary>
/// Sets the focus on the Dialog widget.
/// </summary>
},
};
jQuery.fn.ejDialog=function(){
this.data("ejDialog",new	ej.Dialog());
return this;
};
jQuery.fn.ejDialog = function (options) {
/// <summary><br/>
///The Dialog control displays a Dialog window within a web page. The Dialog enables a message to be displayed, such as supplementary content like images and text, and an interactive content like forms.<br/><br/>
///Adds action buttons like close, minimize, pin, maximize in the dialog header.
///<br/>actionButtons-string[]	default-
///<br/><br/>
///Enables or disables draggable.
///<br/>allowDraggable-boolean	default-
///<br/><br/>
///Enables or disables keyboard interaction.
///<br/>allowKeyboardNavigation-boolean	default-
///<br/><br/>
///Customizes the Dialog widget animations. The Dialog widget can be animated while opening and closing the dialog. In order to customize animation effects, you need to set â€œenableAnimationâ€ as true. It contains the following sub properties.
///<br/>animation-any	default-
///<br/><br/>
///Closes the dialog widget on pressing the ESC key when it is set to true.
///<br/>closeOnEscape-boolean	default-
///<br/><br/>
///The selector for the container element. If the property is set, then dialog will append to the selected element and it is restricted to move only within the specified container element.
///<br/>containment-string	default-
///<br/><br/>
///The content type to load the dialog content at run time. The possible values are null, AJAX, iframe and image. When it is null (default value), the content inside dialog element will be displayed as content and when it is not null, the content will be loaded from the URL specified in the contentUrl property.
///<br/>contentType-string	default-
///<br/><br/>
///The URL to load the dialog content (such as AJAX, image, and iframe). In order to load content from URL, you need to set contentType as â€˜ajaxâ€™ or â€˜iframeâ€™ or â€˜imageâ€™.
///<br/>contentUrl-string	default-
///<br/><br/>
///The root class for the Dialog widget to customize the existing theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Enable or disables animation when the dialog is opened or closed.
///<br/>enableAnimation-boolean	default-
///<br/><br/>
///Enables or disables the Dialog widget.
///<br/>enabled-boolean	default-
///<br/><br/>
///Enable or disables modal dialog. The modal dialog acts like a child window that is displayed on top of the main window/screen and disables the main window interaction until it is closed.
///<br/>enableModal-boolean	default-
///<br/><br/>
///Allows the current model values to be saved in local storage or browser cookies for state maintenance when it is set to true.
///<br/>enablePersistence-boolean	default-
///<br/><br/>
///Allows the dialog to be resized. The dialog cannot be resized less than the minimum height, width values and greater than the maximum height and width.
///<br/>enableResize-boolean	default-
///<br/><br/>
///Displays dialog content from right to left when set to true.
///<br/>enableRTL-boolean	default-
///<br/><br/>
///The CSS class name to display the favicon in the dialog header. In order to display favicon, you need to setÂ showHeaderÂ as true since the favicon will be displayed in the dialog header.
///<br/>faviconCSS-string	default-
///<br/><br/>
///Sets the height for the dialog widget. It accepts both string and integer values. For example, it can accepts values like â€œautoâ€, â€œ100%â€, â€œ100pxâ€ as string type and â€œ100â€, â€œ500â€ as integer type. The unit of integer type value is â€œpxâ€.
///<br/>height-string|number	default-
///<br/><br/>
///Enable or disables responsive behavior.
///<br/>isResponsive-boolean	default-
///<br/><br/>
///Set the localization culture for Dialog Widget.
///<br/>locale-number	default-
///<br/><br/>
///Sets the maximum height for the dialog widget.
///<br/>maxHeight-number	default-
///<br/><br/>
///Sets the maximum width for the dialog widget.
///<br/>maxWidth-number	default-
///<br/><br/>
///Sets the minimum height for the dialog widget.
///<br/>minHeight-number	default-
///<br/><br/>
///Sets the minimum width for the dialog widget.
///<br/>minWidth-number	default-
///<br/><br/>
///Displays the Dialog widget at the given X and Y position.
///<br/>position-any	default-
///<br/><br/>
///Shows or hides the dialog header.
///<br/>showHeader-boolean	default-
///<br/><br/>
///The Dialog widget can be opened by default i.e. on initialization, when it is set to true.
///<br/>showOnInit-boolean	default-
///<br/><br/>
///Enables or disables the rounder corner.
///<br/>showRoundedCorner-boolean	default-
///<br/><br/>
///The selector for the container element. If this property is set, the dialog will be displayed (positioned) based on its container.
///<br/>target-string	default-
///<br/><br/>
///The title text to be displayed in the dialog header. In order to set title, you need to set showHeader as true since the title will be displayed in the dialog header.
///<br/>title-string	default-
///<br/><br/>
///Add or configure the tooltip text for actionButtons in the dialog header.
///<br/>tooltip-any	default-
///<br/><br/>
///Sets the height for the dialog widget. It accepts both string and integer values. For example, it can accepts values like â€œautoâ€, â€œ100%â€, â€œ100pxâ€ as string type and â€œ100â€, â€œ500â€ as integer type. The unit of integer type value is â€œpxâ€.
///<br/>width-string|number	default-
///<br/><br/>
///Sets the z-index value for the Dialog widget.
///<br/>zIndex-number	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.DigitalGauge=function(){};
ej.DigitalGauge.prototype={

destroy:function(){
/// <summary>
/// To destroy the digital gauge
/// </summary>
},
exportImage:function(fileName, fileType){
/// <summary>
/// To export Digital Gauge as Image
/// </summary>
/// <param name="fileName"	type="string">fileName for the Image</param>
/// <param name="fileType"	type="string">fileType for the Image</param>
},
getPosition:function(itemIndex){
/// <summary>
/// Gets the location of an item that is displayed on the gauge.
/// </summary>
/// <param name="itemIndex"	type="number">Position value of an item that is displayed on the gauge.</param>
},
getValue:function(itemIndex){
/// <summary>
/// ClientSideMethod getValue Gets the value of an item that is displayed on the gauge
/// </summary>
/// <param name="itemIndex"	type="number">Index value of an item that displayed on the gauge</param>
},
refresh:function(){
/// <summary>
/// Refresh the digital gauge widget
/// </summary>
},
setPosition:function(itemIndex, value){
/// <summary>
/// ClientSideMethod Set Position Sets the location of an item to be displayed in the gauge
/// </summary>
/// <param name="itemIndex"	type="number">Index value of the digital gauge item</param>
/// <param name="value"	type="any">Location value of the digital gauge</param>
},
setValue:function(itemIndex, value){
/// <summary>
/// ClientSideMethod SetValue Sets the value of an item to be displayed in the gauge.
/// </summary>
/// <param name="itemIndex"	type="number">Index value of the digital gauge item</param>
/// <param name="value"	type="string">Text value to be displayed in the gaugeS</param>
},
};
jQuery.fn.ejDigitalGauge=function(){
this.data("ejDigitalGauge",new	ej.DigitalGauge());
return this;
};
jQuery.fn.ejDigitalGauge = function (options) {
/// <summary><br/>
///The Digital gauge can be easily configured to the DOM element, such as div. you can create a digital gauge with a highly customizable look and feel.<br/><br/>
///Specifies the frame of the Digital gauge.
///<br/>frame-Frame	default-{backgroundImageUrl: null, innerWidth: 6, outerWidth: 10}
///<br/><br/>
///Specifies the URL of an image to be displayed as background of the Digital gauge.
///<br/>backgroundImageUrl-string	default-null
///<br/><br/>
///Specifies the inner width for the frame, when the background image has been set for the Digital gauge..
///<br/>innerWidth-number	default-6
///<br/><br/>
///Specifies the outer width of the frame, when the background image has been set for the Digital gauge.
///<br/>outerWidth-number	default-10
///<br/><br/>
///Specifies the height of the DigitalGauge.
///<br/>height-number	default-150
///<br/><br/>
///Specifies the resize option of the DigitalGauge.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specifies the items for the DigitalGauge.
///<br/>items-Items	default-null
///<br/><br/>
///Specifies the Character settings for the DigitalGauge.
///<br/>characterSettings-any	default-null
///<br/><br/>
///Specifies the CharacterCount value for the DigitalGauge.
///<br/>count-number	default-4
///<br/><br/>
///Specifies the opacity value for the DigitalGauge.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the value for spacing between the characters
///<br/>spacing-number	default-2
///<br/><br/>
///Specifies the character type for the text to be displayed.
///<br/>type-ej.datavisualization.DigitalGauge.CharacterType|string	default-ej.datavisualization.DigitalGauge.CharacterType.EightCrossEightDotMatrix
///<br/><br/>
///Enable/Disable the custom font to be applied to the text in the gauge.
///<br/>enableCustomFont-boolean	default-false
///<br/><br/>
///Set the specific font for the text, when the enableCustomFont is set to true
///<br/>font-any	default-null
///<br/><br/>
///Set the font family value
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Set the font style for the font
///<br/>fontStyle-ej.datavisualization.DigitalGauge.FontStyle|string	default-italic
///<br/><br/>
///Set the font size value
///<br/>size-string	default-11px
///<br/><br/>
///Set the location for the text, where it needs to be placed within the gauge.
///<br/>position-any	default-null
///<br/><br/>
///Set the horizontal location for the text, where it needs to be placed within the gauge.
///<br/>x-number	default-0
///<br/><br/>
///Set the vertical location for the text, where it needs to be placed within the gauge.
///<br/>y-number	default-0
///<br/><br/>
///Set the segment settings for the digital gauge.
///<br/>segmentSettings-any	default-null
///<br/><br/>
///Set the color for the text segments.
///<br/>color-string	default-null
///<br/><br/>
///Set the gradient for the text segments.
///<br/>gradient-any	default-null
///<br/><br/>
///Set the length for the text segments.
///<br/>length-number	default-2
///<br/><br/>
///Set the opacity for the text segments.
///<br/>opacity-number	default-0
///<br/><br/>
///Set the spacing for the text segments.
///<br/>spacing-number	default-1
///<br/><br/>
///Set the width for the text segments.
///<br/>width-number	default-1
///<br/><br/>
///Set the value for enabling/disabling the blurring effect for the shadows of the text
///<br/>shadowBlur-number	default-0
///<br/><br/>
///Specifies the color of the text shadow.
///<br/>shadowColor-string	default-null
///<br/><br/>
///Set the x offset value for the shadow of the text, indicating the location where it needs to be displayed.
///<br/>shadowOffsetX-number	default-1
///<br/><br/>
///Set the y offset value for the shadow of the text, indicating the location where it needs to be displayed.
///<br/>shadowOffsetY-number	default-1
///<br/><br/>
///Set the alignment of the text that is displayed within the gauge.See TextAlign
///<br/>textAlign-string	default-left
///<br/><br/>
///Specifies the color of the text.
///<br/>textColor-string	default-null
///<br/><br/>
///Specifies the text value.
///<br/>value-string	default-null
///<br/><br/>
///Specifies the matrixSegmentData for the DigitalGauge.
///<br/>matrixSegmentData-any	default-
///<br/><br/>
///Specifies the segmentData for the DigitalGauge.
///<br/>segmentData-any	default-
///<br/><br/>
///Specifies the themes for the Digital gauge. See Themes
///<br/>themes-string	default-flatlight
///<br/><br/>
///Specifies the value to the DigitalGauge.
///<br/>value-string	default-text
///<br/><br/>
///Specifies the width for the Digital gauge.
///<br/>width-number	default-400
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Draggable=function(){};
ej.Draggable.prototype={

_destroy:function(){
/// <summary>
/// destroy in the dragable.
/// </summary>
},
};
jQuery.fn.ejDraggable=function(){
this.data("ejDraggable",new	ej.Draggable());
return this;
};
jQuery.fn.ejDraggable = function (options) {
/// <summary><br/>
///Plugin to make any DOM element draggable.<br/><br/>
///If clone is specified.
///<br/>clone-boolean	default-false
///<br/><br/>
///Sets the offset of the dragging helper relative to the mouse cursor.
///<br/>cursorAt-any	default-{ top: -1, left: -2 }
///<br/><br/>
///Distance in pixels after mousedown the mouse must move before dragging should start. This option can be used to prevent unwanted drags when clicking on an element.
///<br/>distance-number	default-1
///<br/><br/>
///The drag area is used to restrict the dragging element bounds.
///<br/>dragArea-boolean	default-false
///<br/><br/>
///If specified, restricts drag start click to the specified element(s).
///<br/>handle-string	default-null
///<br/><br/>
///Used to group sets of draggable and droppable items, in addition to droppable's accept option. A draggable with the same scope value as a droppable will be accepted by the droppable.
///<br/>scope-string	default-&#39;default&#39;
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.DropDownList=function(){};
ej.DropDownList.prototype={

addItem:function(data){
/// <summary>
/// Adding a single item or an array of items into the DropDownList allows you to specify all the field attributes such as value, template, image URL, and HTML attributes for those items.
/// </summary>
/// <param name="data"	type="any|Array&lt;any&gt;"> this parameter should have field attributes with respect to mapped field attributes and it's corresponding values to fields</param>
},
checkAll:function(){
/// <summary>
/// This method is used to select all the items in the DropDownList.
/// </summary>
},
clearText:function(){
/// <summary>
/// Clears the text in the DropDownList textbox.
/// </summary>
},
destroy:function(){
/// <summary>
/// Destroys the DropDownList widget.
/// </summary>
},
disable:function(){
/// <summary>
/// This property is used to disable the DropDownList widget.
/// </summary>
},
disableItemsByIndices:function(index){
/// <summary>
/// This property disables the set of items in the DropDownList.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> disable the given index list items</param>
},
enable:function(){
/// <summary>
/// This property enables the DropDownList control.
/// </summary>
},
enableItemsByIndices:function(index){
/// <summary>
/// Enables an Item or set of Items that are disabled in the DropDownList
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> enable the given index list items if it's disabled</param>
},
getItemDataByValue:function(value){
/// <summary>
/// This method retrieves the items using given value.
/// </summary>
/// <param name="value"	type="string|number|any"> Return the whole object of data based on given value</param>
},
getListData:function(){
/// <summary>
/// This method is used to retrieve the items that are bound with the DropDownList.
/// </summary>
},
getSelectedItem:function(){
/// <summary>
/// This method is used to get the selected items in the DropDownList.
/// </summary>
},
getSelectedValue:function(){
/// <summary>
/// This method is used to retrieve the items value that are selected in the DropDownList.
/// </summary>
},
hidePopup:function(){
/// <summary>
/// This method hides the suggestion popup in the DropDownList.
/// </summary>
},
selectItemsByIndices:function(index){
/// <summary>
/// This method is used to select the list of items in the DropDownList through the Index of the items.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> select the given index list items</param>
},
selectItemByText:function(index){
/// <summary>
/// This method is used to select an item in the DropDownList by using the given text value.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> select the list items relates to given text</param>
},
selectItemByValue:function(index){
/// <summary>
/// This method is used to select an item in the DropDownList by using the given value.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> select the list items relates to given values</param>
},
showPopup:function(){
/// <summary>
/// This method shows the DropDownList control with the suggestion popup.
/// </summary>
},
unCheckAll:function(){
/// <summary>
/// This method is used to unselect all the items in the DropDownList.
/// </summary>
},
unselectItemsByIndices:function(index){
/// <summary>
/// This method is used to unselect the list of items in the DropDownList through Index of the items.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> unselect the given index list items</param>
},
unselectItemByText:function(index){
/// <summary>
/// This method is used to unselect an item in the DropDownList by using the given text value.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> unselect the list items relates to given text</param>
},
unselectItemByValue:function(index){
/// <summary>
/// This method is used to unselect an item in the DropDownList by using the given value.
/// </summary>
/// <param name="index"	type="string|number|Array&lt;any&gt;"> unselect the list items relates to given values</param>
},
};
jQuery.fn.ejDropDownList=function(){
this.data("ejDropDownList",new	ej.DropDownList());
return this;
};
jQuery.fn.ejDropDownList = function (options) {
/// <summary><br/>
///The DropDownList control provides a list of options to choose an item from the list. It can including other HTML elements such as images, textboxes, check box, radio buttons, and so on.<br/><br/>
///The cascading DropDownLists is a series of two or more DropDownLists in which each DropDownList is filtered according to the previous DropDownListâ€™s value.
///<br/>cascadeTo-string	default-null
///<br/><br/>
///Sets the case sensitivity of the search operation. It supports both enableFilterSearch and enableIncrementalSearch property.
///<br/>caseSensitiveSearch-boolean	default-false
///<br/><br/>
///Dropdown widget's style and appearance can be controlled based on 13 different default built-in themes.You can customize the appearance of the dropdown by using the cssClass property. You need to specify a class name in the cssClass property and the same class name is used before the class definitions wherever the custom styles are applied.
///<br/>cssClass-string	default-
///<br/><br/>
///This property is used to serve data from the data services based on the query provided. To bind the data to the dropdown widget, the dataSource property is assigned with the instance of the ej.DataManager.
///<br/>dataSource-any	default-null
///<br/><br/>
///Sets the separator when the multiSelectMode with delimiter option or checkbox is enabled with the dropdown. When you enter the delimiter value, the texts after the delimiter are considered as a separate word or query. The delimiter string is a single character and must be a symbol. Mostly, the delimiter symbol is used as comma (,) or semi-colon (;) or any other special character.
///<br/>delimiterChar-string	default-&#39;,&#39;
///<br/><br/>
///The enabled Animation property uses the easeOutQuad animation to SlideDown and SlideUp the Popup list in 200 and 100 milliseconds, respectively.
///<br/>enableAnimation-boolean	default-false
///<br/><br/>
///This property is used to indicate whether the DropDownList control responds to the user interaction or not. By default, the control is in the enabled mode and you can disable it by setting it to false.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies to perform incremental search for the selection of items from the DropDownList with the help of this property. This helps in selecting the item by using the typed character.
///<br/>enableIncrementalSearch-boolean	default-true
///<br/><br/>
///This property selects the item in the DropDownList when the item is entered in the Search textbox.
///<br/>enableFilterSearch-boolean	default-false
///<br/><br/>
///Saves the current model value to the browser cookies for state maintenance. While refreshing the DropDownList control page, it retains the model value and it is applied from the browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///This enables the resize handler to resize the popup to any size.
///<br/>enablePopupResize-boolean	default-false
///<br/><br/>
///Sets the DropDownList textbox direction from right to left align.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///This property is used to sort the Items in the DropDownList. By default, it sorts the items in an ascending order.
///<br/>enableSorting-boolean	default-false
///<br/><br/>
///Specifies the mapping fields for the data items of the DropDownList.
///<br/>fields-Fields	default-null
///<br/><br/>
///Used to group the items.
///<br/>groupBy-string	default-
///<br/><br/>
///Defines the HTML attributes such as ID, class, and styles for the item.
///<br/>htmlAttributes-any	default-
///<br/><br/>
///Defines the ID for the tag.
///<br/>id-string	default-
///<br/><br/>
///Defines the image attributes such as height, width, styles, and so on.
///<br/>imageAttributes-string	default-
///<br/><br/>
///Defines the imageURL for the image location.
///<br/>imageUrl-string	default-
///<br/><br/>
///Defines the tag value to be selected initially.
///<br/>selected-boolean	default-
///<br/><br/>
///Defines the sprite CSS for the image tag.
///<br/>spriteCssClass-string	default-
///<br/><br/>
///Defines the table name for tag value or display text while rendering remote data.
///<br/>tableName-string	default-
///<br/><br/>
///Defines the text content for the tag.
///<br/>text-string	default-
///<br/><br/>
///Defines the tag value.
///<br/>value-string	default-
///<br/><br/>
///When the enableFilterSearch property value is set to true, the values in the DropDownList shows the items starting with or containing the key word/letter typed in the Search textbox.
///<br/>filterType-ej.FilterType|string	default-ej.FilterType.Contains
///<br/><br/>
///Used to create visualized header for dropdown items
///<br/>headerTemplate-string	default-null
///<br/><br/>
///Defines the height of the DropDownList textbox.
///<br/>height-string|number	default-null
///<br/><br/>
///It sets the given HTML attributes for the DropDownList control such as ID, name, disabled, etc.
///<br/>htmlAttributes-any	default-null
///<br/><br/>
///Data can be fetched in the DropDownList control by using the DataSource, specifying the number of items.
///<br/>itemsCount-number	default-5
///<br/><br/>
///Defines the maximum height of the suggestion box. This property restricts the maximum height of the popup when resize is enabled.
///<br/>maxPopupHeight-string|number	default-null
///<br/><br/>
///Defines the minimum height of the suggestion box. This property restricts the minimum height of the popup when resize is enabled.
///<br/>minPopupHeight-string|number	default-null
///<br/><br/>
///Defines the maximum width of the suggestion box. This property restricts the maximum width of the popup when resize is enabled.
///<br/>maxPopupWidth-string|number	default-null
///<br/><br/>
///Defines the minimum height of the suggestion box. This property restricts the minimum height of the popup when resize is enabled.
///<br/>minPopupWidth-string|number	default-0
///<br/><br/>
///With the help of this property, you can make a single or multi selection with the DropDownList and display the text in two modes, delimiter and visual mode. In delimiter mode, you can separate the items by using the delimiter character such as comma (,) or semi-colon (;) or any other special character. In the visual mode, the items are showcased like boxes with close icon in the textbox.
///<br/>multiSelectMode-ej.MultiSelectMode|string	default-ej.MultiSelectMode.None
///<br/><br/>
///Defines the height of the suggestion popup box in the DropDownList control.
///<br/>popupHeight-string|number	default-152px
///<br/><br/>
///Defines the width of the suggestion popup box in the DropDownList control.
///<br/>popupWidth-string|number	default-auto
///<br/><br/>
///Specifies the query to retrieve the data from the DataSource.
///<br/>query-any	default-null
///<br/><br/>
///Specifies that the DropDownList textbox values should be read-only.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Specifies an item to be selected in the DropDownList.
///<br/>selectedIndex-number	default-null
///<br/><br/>
///Specifies the selectedItems for the DropDownList.
///<br/>selectedIndices-Array&lt;any&gt;	default-[]
///<br/><br/>
///Selects multiple items in the DropDownList with the help of the checkbox control. To achieve this, enable the showCheckbox option to true.
///<br/>showCheckbox-boolean	default-false
///<br/><br/>
///DropDownList control is displayed with the popup seen.
///<br/>showPopupOnLoad-boolean	default-false
///<br/><br/>
///DropDownList textbox displayed with the rounded corner style.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///When the enableSorting property value is set to true, this property helps to sort the items either in ascending or descending order
///<br/>sortOrder-ej.SortOrder|string	default-ej.sortOrder.Ascending
///<br/><br/>
///Specifies the targetID for the DropDownListâ€™s items.
///<br/>targetID-string	default-null
///<br/><br/>
///By default, you can add any text or image to the DropDownList item. To customize the item layout or to create your own visualized elements, you can use this template support.
///<br/>template-string	default-null
///<br/><br/>
///Defines the text value that is displayed in the DropDownList textbox.
///<br/>text-string	default-null
///<br/><br/>
///Sets the jQuery validation error message in the DropDownList
///<br/>validationMessage-any	default-null
///<br/><br/>
///Sets the jQuery validation rules in the Dropdownlist.
///<br/>validationRules-any	default-null
///<br/><br/>
///Specifies the value (text content) for the DropDownList control.
///<br/>value-string	default-null
///<br/><br/>
///Specifies a short hint that describes the expected value of the DropDownList control.
///<br/>watermarkText-string	default-null
///<br/><br/>
///Defines the width of the DropDownList textbox.
///<br/>width-string|number	default-null
///<br/><br/>
///The Virtual Scrolling feature is used to display a large amount of records in the DropDownList, that is, when scrolling, an AJAX request is sent to fetch some amount of data from the server dynamically. To achieve this scenario with DropDownList, set the allowVirtualScrolling to true. You can set the itemsCount property that represents the number of items to be fetched from the server on every AJAX request.
///<br/>virtualScrollMode-ej.VirtualScrollMode|string	default-normal
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Droppable=function(){};
ej.Droppable.prototype={

_destroy:function(){
/// <summary>
/// destroy in the Droppable.
/// </summary>
},
};
jQuery.fn.ejDroppable=function(){
this.data("ejDroppable",new	ej.Droppable());
return this;
};
jQuery.fn.ejDroppable = function (options) {
/// <summary><br/>
///Plugin to make any DOM element Droppable.<br/><br/>
///Used to accept the specified draggable items.
///<br/>accept-any	default-null
///<br/><br/>
///Used to group sets of droppable items, in addition to droppable's accept option. A draggable with the same scope value as a droppable will be accepted by the droppable.
///<br/>scope-string	default-&#39;default&#39;
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.FileExplorer=function(){};
ej.FileExplorer.prototype={

adjustSize:function(){
/// <summary>
/// Refresh the size of FileExplorer control.
/// </summary>
},
disableMenuItem:function(item){
/// <summary>
/// Disable the particular context menu item.
/// </summary>
/// <param name="item"	type="string|HTMLElement">Id of the menu item/ Menu element to be disabled </param>
},
disableToolbarItem:function(item){
/// <summary>
/// Disable the particular toolbar item.
/// </summary>
/// <param name="item"	type="string|HTMLElement">Id of the toolbar item/ Tool item element to be disabled </param>
},
enableMenuItem:function(item){
/// <summary>
/// Enable the particular context menu item.
/// </summary>
/// <param name="item"	type="string|HTMLElement">Id of the menu item/ Menu element to be Enabled </param>
},
enableToolbarItem:function(item){
/// <summary>
/// Enable the particular toolbar item
/// </summary>
/// <param name="item"	type="string|HTMLElement">Id of the tool item/ Tool item element to be Enabled </param>
},
refresh:function(){
/// <summary>
/// Refresh the content of the selected folder in FileExplorer control.
/// </summary>
},
removeToolbarItem:function(item){
/// <summary>
/// Remove the particular toolbar item.
/// </summary>
/// <param name="item"	type="string|HTMLElement">Id of the tool item/ tool item element to be removed </param>
},
};
jQuery.fn.ejFileExplorer=function(){
this.data("ejFileExplorer",new	ej.FileExplorer());
return this;
};
jQuery.fn.ejFileExplorer = function (options) {
/// <summary><br/>
///FileExplorer provides a Windows Explorer-like functionality for any web application. It allows end-users to browse, select and upload files or change the folder structure by renaming, moving and deleting files or folders. File and folder management capabilities are fully customizable and can be disabled when necessary.<br/><br/>
///Sets the URL of server side ajax handling method that handles file operation like Read, Remove, Rename, Create, Upload, Download, Copy and Move in FileExplorer.
///<br/>ajaxAction-string	default-
///<br/><br/>
///Specifies the data type of server side ajax handling method.
///<br/>ajaxDataType-string	default-json
///<br/><br/>
///By using ajaxSettings property, you can customize the ajax configurations. Normally you can customize the following option in ajax handling data, url, type, async, contentType, dataType and success. For upload, download and getImage API, you can only customize url.
///<br/>ajaxSettings-any	default-{ read: {}, createFolder: {}, remove: {}, rename: {}, paste: {}, getDetails: {}, download: {}, upload: {}, getImage: {}, search: {}}
///<br/><br/>
///The FileExplorer allows to select multiple files by enabling the allowMultiSelection property. You can perform multi selection by pressing the Ctrl key or Shift key.
///<br/>allowMultiSelection-boolean	default-true
///<br/><br/>
///Sets the root class for FileExplorer theme. This cssClass API allows to use custom skinning option for File Explorer control. By defining the root class by using this API, you have to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///Enables or disables the resize support in FileExplorer control.
///<br/>enableResize-boolean	default-false
///<br/><br/>
///Enables or disables the Right to Left alignment support in FileExplorer control.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Allows specified type of files only to display in FileExplorer control.
///<br/>fileTypes-string	default-.
///<br/><br/>
///By using filterSettings property, you can customize the search functionality of the search bar in FileExplorer control.
///<br/>filterSettings-FilterSettings	default-
///<br/><br/>
///Enables or disables to perform the filter operation with case sensitive.
///<br/>caseSensitiveSearch-boolean	default-false
///<br/><br/>
///Sets the search filter type. There are several filter types available such as "startswith", "contains", "endswith". See filterType.
///<br/>filterType-ej.FilterType|string	default-ej.FileExplorer.filterType.Contains
///<br/><br/>
///By using the gridSettings property, you can customize the grid behavior in the FileExplorer control.
///<br/>gridSettings-GridSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable the dynamic sorting behavior on grid data. Sorting can be done through clicking on particular column header.
///<br/>allowSorting-boolean	default-true
///<br/><br/>
///Gets or sets an object that indicates to render the grid with specified columns. You can use this property same as the column property in Grid control.
///<br/>columns-Array&lt;any&gt;	default-[{ field: name, headerText: Name, width: 30% }, { field: dateModified, headerText: Date Modified, width: 30% }, { field: type, headerText: Type, width: 15% }, { field: size, headerText: Size, width: 12%, textAlign: right, headerTextAlign: left }]
///<br/><br/>
///Specifies the height of FileExplorer control.
///<br/>height-string|number	default-400
///<br/><br/>
///Enables or disables the responsive support for FileExplorer control during the window resizing time.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Sets the file view type. There are three view types available such as Grid, Tile and Large icons. See layoutType.
///<br/>layout-ej.FileExplorer.layoutType|string	default-ej.FileExplorer.layoutType.Grid
///<br/><br/>
///Sets the culture in FileExplorer.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the maximum height of FileExplorer control.
///<br/>maxHeight-string|number	default-null
///<br/><br/>
///Sets the maximum width of FileExplorer control.
///<br/>maxWidth-string|number	default-null
///<br/><br/>
///Sets the minimum height of FileExplorer control.
///<br/>minHeight-string|number	default-250px
///<br/><br/>
///Sets the minimum width of FileExplorer control.
///<br/>minWidth-string|number	default-400px
///<br/><br/>
///The property path denotes the filesystem path that are to be explored. The path for the filesystem can be physical path or relative path, but it has to be relevant to where the Web API is hosted.
///<br/>path-string	default-
///<br/><br/>
///The selectedFolder is used to select the specified folder of FileExplorer control.
///<br/>selectedFolder-string	default-
///<br/><br/>
///The selectedItems is used to select the specified items (file, folder) of FileExplorer control.
///<br/>selectedItems-string|Array&lt;any&gt;	default-
///<br/><br/>
///Enables or disables the checkbox option in FileExplorer control.
///<br/>showCheckbox-boolean	default-true
///<br/><br/>
///Enables or disables the context menu option in FileExplorer control.
///<br/>showContextMenu-boolean	default-true
///<br/><br/>
///Enables or disables the footer in FileExplorer control. The footer element displays the details of the current selected files and folders. And also the footer having the switcher to change the layout view.
///<br/>showFooter-boolean	default-true
///<br/><br/>
///FileExplorer control is displayed with rounded corner when this property is set to true.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///FileExplorer control is rendered with thumbnail preview of images in Tile and LargeIcons layout when this property set to true.
///<br/>showThumbnail-boolean	default-true
///<br/><br/>
///Shows or disables the toolbar in FileExplorer control.
///<br/>showToolbar-boolean	default-true
///<br/><br/>
///Enables or disables the navigation pane in FileExplorer control. The navigation pane contains a tree view element that displays all the folders from the filesystem in a hierarchical manner. This is useful to a quick navigation of any folder in the filesystem.
///<br/>showNavigationPane-boolean	default-true
///<br/><br/>
///The tools property is used to configure and group required toolbar items in FileExplorer control.
///<br/>tools-any	default-{ creation: [NewFolder], navigation: [Back, Forward, Upward], addressBar: [Addressbar], editing: [Refresh, Upload, Delete, Rename, Download], copyPaste: [Cut, Copy, Paste], getProperties: [Details], searchBar: [Searchbar], layout: [Layout]}
///<br/><br/>
///The toolsList property is used to arrange the toolbar items in the FileExplorer control.
///<br/>toolsList-Array&lt;any&gt;	default-[layout, creation, navigation, addressBar, editing, copyPaste, getProperties, searchBar]
///<br/><br/>
///Gets or sets an object that indicates whether to customize the upload behavior in the FileExplorer.
///<br/>uploadSettings-UploadSettings	default-
///<br/><br/>
///Specifies the maximum file size allowed to upload. It accepts the value in bytes.
///<br/>maxFileSize-number	default-31457280
///<br/><br/>
///Enables or disables the multiple files upload. When it is enabled, you can upload multiple files at a time and when disabled, you can upload only one file at a time.
///<br/>allowMultipleFile-boolean	default-true
///<br/><br/>
///Enables or disables the auto upload option while uploading files in FileExplorer control.
///<br/>autoUpload-boolean	default-false
///<br/><br/>
///Specifies the width of FileExplorer control.
///<br/>width-string|number	default-850
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Gantt=function(){};
ej.Gantt.prototype={

addRecord:function(data, rowPosition){
/// <summary>
/// To add item in Gantt
/// </summary>
/// <param name="data"	type="any">Item to add in Gantt row.</param>
/// <param name="rowPosition"	type="string">Defines in which position the row wants to add</param>
},
setSplitterIndex:function(index){
/// <summary>
/// Positions the splitter by the specified column index.
/// </summary>
/// <param name="index"	type="number">Set the splitter position based on column index.</param>
},
cancelEdit:function(){
/// <summary>
/// To cancel the edited state of an item in Gantt
/// </summary>
},
collapseAllItems:function(){
/// <summary>
/// To collapse all the parent items in Gantt
/// </summary>
},
deleteItem:function(){
/// <summary>
/// To delete a selected item in Gantt
/// </summary>
},
destroy:function(){
/// <summary>
/// destroy the Gantt widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
expandAllItems:function(){
/// <summary>
/// To Expand all the parent items in Gantt
/// </summary>
},
expandCollapseRecord:function(taskId){
/// <summary>
/// To expand and collapse an item in Gantt using item's ID
/// </summary>
/// <param name="taskId"	type="number">Expand or Collapse a record based on task id.</param>
},
hideColumn:function(headerText){
/// <summary>
/// To hide the column by using header text
/// </summary>
/// <param name="headerText"	type="string">you can pass a header text of a column to hide</param>
},
indentItem:function(){
/// <summary>
/// To indent a selected item in Gantt
/// </summary>
},
openAddDialog:function(){
/// <summary>
/// To Open the dialog to add new task to the Gantt
/// </summary>
},
openEditDialog:function(){
/// <summary>
/// To Open the dialog to edit existing task to the Gantt
/// </summary>
},
outdentItem:function(){
/// <summary>
/// To outdent a selected item in Gantt
/// </summary>
},
saveEdit:function(){
/// <summary>
/// To save the edited state of an item in Gantt
/// </summary>
},
searchItem:function(searchString){
/// <summary>
/// To search an item with search string provided at the run time
/// </summary>
/// <param name="searchString"	type="string">you can pass a text to search in Gantt Control.</param>
},
setSplitterPosition:function(width){
/// <summary>
/// To set the grid width in Gantt
/// </summary>
/// <param name="width"	type="string">you can give either percentage or pixels value</param>
},
showColumn:function(headerText){
/// <summary>
/// To show the column by using header text
/// </summary>
/// <param name="headerText"	type="string">you can pass a header text of a column to show</param>
},
};
jQuery.fn.ejGantt=function(){
this.data("ejGantt",new	ej.Gantt());
return this;
};
jQuery.fn.ejGantt = function (options) {
/// <summary><br/>
///The Essential JavaScript Gantt control is designed to visualize and edit the project schedule, and track the project progress.<br/><br/>
///Specifies the fields to be included in the add dialog in Gantt
///<br/>addDialogFields-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables or disables the ability to resize column.
///<br/>allowColumnResize-boolean	default-false
///<br/><br/>
///Enables or Disables gantt chart editing in Gantt
///<br/>allowGanttChartEditing-boolean	default-true
///<br/><br/>
///Enables or Disables Keyboard navigation in Gantt
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Specifies enabling or disabling multiple sorting for Gantt columns
///<br/>allowMultiSorting-boolean	default-false
///<br/><br/>
///Enables or disables the interactive selection of a row.
///<br/>allowSelection-boolean	default-true
///<br/><br/>
///Enables or disables sorting. When enabled, we can sort the column by clicking on the column.
///<br/>allowSorting-boolean	default-false
///<br/><br/>
///Enable or disable predecessor validation. When it is true, all the task's start and end dates are aligned based on its predecessors start and end dates.
///<br/>enablePredecessorValidation-boolean	default-true
///<br/><br/>
///Specifies the baseline background color in Gantt
///<br/>baselineColor-string	default-#fba41c
///<br/><br/>
///Specifies the mapping property path for baseline end date in datasource
///<br/>baselineEndDateMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for baseline start date of a task in datasource
///<br/>baselineStartDateMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for sub tasks in datasource
///<br/>childMapping-string	default-
///<br/><br/>
///Specifies the background of connector lines in Gantt
///<br/>connectorLineBackground-string	default-
///<br/><br/>
///Specifies the width of the connector lines in Gantt
///<br/>connectorlineWidth-number	default-1
///<br/><br/>
///Specify the CSS class for Gantt to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Collection of data or hierarchical data to represent in Gantt
///<br/>dataSource-Array&lt;any&gt;	default-null
///<br/><br/>
///Specifies the dateFormat for Gantt , given format is displayed in tooltip , Grid .
///<br/>dateFormat-string	default-MM/dd/yyyy
///<br/><br/>
///Specifies the mapping property path for duration of a task in datasource
///<br/>durationMapping-string	default-
///<br/><br/>
///Specifies the duration unit for each tasks whether days or hours or minutes
///<br/>durationUnit-ej.Gantt.DurationUnit|string	default-ej.Gantt.DurationUnit.Day
///<br/><br/>
///Specifies the fields to be included in the edit dialog in Gantt
///<br/>editDialogFields-Array&lt;any&gt;	default-[]
///<br/><br/>
///Option to configure the splitter position.
///<br/>splitterSettings-SplitterSettings	default-
///<br/><br/>
///Specifies position of the splitter in Gantt , splitter can be placed either based on percentage values or pixel values.
///<br/>position-string	default-
///<br/><br/>
///Specifies the position of splitter in Gantt, based on column index in Gantt.
///<br/>index-string	default-
///<br/><br/>
///Specifies the editSettings options in Gantt.
///<br/>editSettings-EditSettings	default-
///<br/><br/>
///Enables or disables add record icon in Gantt toolbar
///<br/>allowAdding-boolean	default-false
///<br/><br/>
///Enables or disables delete icon in Gantt toolbar
///<br/>allowDeleting-boolean	default-false
///<br/><br/>
///Specifies the option for enabling or disabling editing in Gantt grid part
///<br/>allowEditing-boolean	default-false
///<br/><br/>
///Specifies the edit mode in Gantt, "normal" is for dialog editing ,"cellEditing" is for cell type editing
///<br/>editMode-string	default-normal
///<br/><br/>
///Enables or Disables enableAltRow row effect in Gantt
///<br/>enableAltRow-boolean	default-true
///<br/><br/>
///Enables or disables the collapse all records when loading the Gantt.
///<br/>enableCollapseAll-boolean	default-false
///<br/><br/>
///Enables or disables the contextmenu for Gantt , when enabled contextmenu appears on right clicking Gantt
///<br/>enableContextMenu-boolean	default-false
///<br/><br/>
///Indicates whether we can edit the progress of a task interactively in Gantt.
///<br/>enableProgressBarResizing-boolean	default-true
///<br/><br/>
///Enables or disables the option for dynamically updating the Gantt size on window resizing
///<br/>enableResize-boolean	default-false
///<br/><br/>
///Enables or disables tooltip while editing (dragging/resizing) the taskbar.
///<br/>enableTaskbarDragTooltip-boolean	default-true
///<br/><br/>
///Enables or disables tooltip for taskbar.
///<br/>enableTaskbarTooltip-boolean	default-true
///<br/><br/>
///Enables/Disables virtualization for rendering Gantt items.
///<br/>enableVirtualization-boolean	default-false
///<br/><br/>
///Specifies the mapping property path for end Date of a task in datasource
///<br/>endDateMapping-string	default-
///<br/><br/>
///Specifies whether to highlight the weekends in Gantt .
///<br/>highlightWeekends-boolean	default-true
///<br/><br/>
///Collection of holidays with date, background and label information to be displayed in Gantt.
///<br/>holidays-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies whether to include weekends while calculating the duration of a task.
///<br/>includeWeekend-boolean	default-true
///<br/><br/>
///Specify the locale for Gantt
///<br/>locale-string	default-en-US
///<br/><br/>
///Specifies the mapping property path for milestone in datasource
///<br/>milestoneMapping-string	default-
///<br/><br/>
///Specifies the background of parent progressbar in Gantt
///<br/>parentProgressbarBackground-string	default-
///<br/><br/>
///Specifies the background of parent taskbar in Gantt
///<br/>parentTaskbarBackground-string	default-
///<br/><br/>
///Specifies the mapping property path for parent task Id in self reference datasource
///<br/>parentTaskIdMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for predecessors of a task in datasource
///<br/>predecessorMapping-string	default-
///<br/><br/>
///Specifies the background of progressbar in Gantt
///<br/>progressbarBackground-string	default-
///<br/><br/>
///Specified the height of the progressbar in taskbar
///<br/>progressbarHeight-number	default-100
///<br/><br/>
///Specifies the template for tooltip on resizing progressbar
///<br/>progressbarTooltipTemplate-string	default-null
///<br/><br/>
///Specifies the template ID for customized tooltip for progressbar editing in Gantt
///<br/>progressbarTooltipTemplateId-string	default-null
///<br/><br/>
///Specifies the mapping property path for progress percentage of a task in datasource
///<br/>progressMapping-string	default-
///<br/><br/>
///It receives query to retrieve data from the table (query is same as SQL).
///<br/>query-any	default-null
///<br/><br/>
///Enables or Disables rendering baselines in Gantt , when enabled baseline is rendered in Gantt
///<br/>renderBaseline-boolean	default-false
///<br/><br/>
///Specifies the mapping property name for resource ID in resource Collection in Gantt
///<br/>resourceIdMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for resources of a task in datasource
///<br/>resourceInfoMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for resource name of a task in Gantt
///<br/>resourceNameMapping-string	default-
///<br/><br/>
///Collection of data regarding resources involved in entire project
///<br/>resources-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies whether rounding off the day working time edits
///<br/>roundOffDayworkingTime-boolean	default-true
///<br/><br/>
///Specifies the height of a single row in Gantt. Also, we need to set same height in the CSS style with class name e-rowcell.
///<br/>rowHeight-number	default-30
///<br/><br/>
///Specifies end date of the Gantt schedule. By default, end date will be rounded to its next Saturday.
///<br/>scheduleEndDate-string	default-null
///<br/><br/>
///Specifies the options for customizing schedule header.
///<br/>scheduleHeaderSettings-ScheduleHeaderSettings	default-
///<br/><br/>
///Specified the format for day view in schedule header
///<br/>dayHeaderFormat-string	default-ddd
///<br/><br/>
///Specified the format for Hour view in schedule header
///<br/>hourHeaderFormat-string	default-HH
///<br/><br/>
///Specifies the number of minutes per interval
///<br/>minutesPerInterval-ej.Gantt.minutesPerInterval|string	default-ej.Gantt.minutesPerInterval.Auto
///<br/><br/>
///Specified the format for month view in schedule header
///<br/>monthHeaderFormat-string	default-MMM
///<br/><br/>
///Specifies the schedule mode
///<br/>scheduleHeaderType-ej.Gantt.ScheduleHeaderType|string	default-ej.Gantt.ScheduleHeaderType.Week
///<br/><br/>
///Specified the background for weekends in Gantt
///<br/>weekendBackground-string	default-#F2F2F2
///<br/><br/>
///Specified the format for week view in schedule header
///<br/>weekHeaderFormat-string	default-ddd
///<br/><br/>
///Specified the format for year view in schedule header
///<br/>yearHeaderFormat-string	default-yyyy
///<br/><br/>
///Specifies start date of the Gantt schedule. By default, start date will be rounded to its previous Sunday.
///<br/>scheduleStartDate-string	default-null
///<br/><br/>
///Specifies the selected row index in Gantt
///<br/>selectedItem-number	default-null
///<br/><br/>
///Specifies the selected row Index in Gantt , the row with given index will highlighted
///<br/>selectedRowIndex-number	default--1
///<br/><br/>
///Enables or disables the column chooser.
///<br/>showColumnChooser-boolean	default-false
///<br/><br/>
///Specifies whether to show grid cell tooltip.
///<br/>showGridCellTooltip-boolean	default-true
///<br/><br/>
///Specifies whether to show grid cell tooltip over expander cell alone.
///<br/>showGridExpandCellTooltip-boolean	default-true
///<br/><br/>
///Specifies whether display task progress inside taskbar.
///<br/>showProgressStatus-boolean	default-true
///<br/><br/>
///Specifies whether to display resource names for a task beside taskbar.
///<br/>showResourceNames-boolean	default-true
///<br/><br/>
///Specifies whether to display task name beside task bar.
///<br/>showTaskNames-boolean	default-true
///<br/><br/>
///Specifies the size option of Gantt control.
///<br/>sizeSettings-SizeSettings	default-
///<br/><br/>
///Specifies the height of Gantt control
///<br/>height-string	default-450px
///<br/><br/>
///Specifies the width of Gantt control
///<br/>width-string	default-1000px
///<br/><br/>
///Specifies the sorting options for Gantt.
///<br/>sortSettings-SortSettings	default-
///<br/><br/>
///Specifies the sorted columns for Gantt
///<br/>sortedColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies splitter position in Gantt.
///<br/>splitterPosition-string	default-null
///<br/><br/>
///Specifies the mapping property path for start date of a task in datasource
///<br/>startDateMapping-string	default-
///<br/><br/>
///Specifies the options for striplines
///<br/>stripLines-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the background of the taskbar in Gantt
///<br/>taskbarBackground-string	default-
///<br/><br/>
///Specifies the template script for customized tooltip for taskbar editing in Gantt
///<br/>taskbarEditingTooltipTemplate-string	default-
///<br/><br/>
///Specifies the template Id for customized tooltip for taskbar editing in Gantt
///<br/>taskbarEditingTooltipTemplateId-string	default-
///<br/><br/>
///Specifies the template for tooltip on mouse action on taskbars
///<br/>taskbarTooltipTemplate-string	default-
///<br/><br/>
///Specifies the template id for tooltip on mouse action on taskbars
///<br/>taskbarTooltipTemplateId-string	default-
///<br/><br/>
///Specifies the mapping property path for task Id in datasource
///<br/>taskIdMapping-string	default-
///<br/><br/>
///Specifies the mapping property path for task name in datasource
///<br/>taskNameMapping-string	default-
///<br/><br/>
///Specifies the toolbarSettings options.
///<br/>toolbarSettings-ToolbarSettings	default-
///<br/><br/>
///Specifies the state of enabling or disabling toolbar
///<br/>showToolBar-boolean	default-true
///<br/><br/>
///Specifies the list of toolbar items to rendered in toolbar
///<br/>toolbarItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the tree expander column in Gantt
///<br/>treeColumnIndex-number	default-0
///<br/><br/>
///Specifies the weekendBackground color in Gantt
///<br/>weekendBackground-string	default-#F2F2F2
///<br/><br/>
///Specifies the working time schedule of day
///<br/>workingTimeScale-ej.Gantt.workingTimeScale|string	default-ej.Gantt.workingTimeScale.TimeScale8Hours
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Grid=function(){};
ej.Grid.prototype={

addIgnoreOnExport:function(propertyNames){
/// <summary>
/// Adds a grid model property which is to be ignored upon exporting.
/// </summary>
/// <param name="propertyNames"	type="Array&lt;any&gt;">Pass the array of parameters which need to be ignored on exporting </param>
},
addRecord:function(){
/// <summary>
/// Add a new record in grid control when allowAdding is set as true.
/// </summary>
},
addRecord:function(data, serverChange){
/// <summary>
/// Add a new record in grid control when allowAdding is set as true.
/// </summary>
/// <param name="data"	type="Array&lt;any&gt;">Pass the array of added Records</param>
/// <param name="serverChange"	type="Array&lt;any&gt;">optionalIf we pass serverChange as true, send post to server side for server action.</param>
},
batchCancel:function(){
/// <summary>
/// Cancel the modified changes in grid control when edit mode is &quot;batch&quot;.
/// </summary>
},
batchSave:function(){
/// <summary>
/// Save the modified changes to data source in grid control when edit mode is &quot;batch&quot;.
/// </summary>
},
cancelEdit:function(){
/// <summary>
/// Send a cancel request in grid.
/// </summary>
},
cancelEditCell:function(){
/// <summary>
/// Send a cancel request to the edited cell in grid.
/// </summary>
},
clearCellSelection:function(){
/// <summary>
/// It is used to clear all the cell selection.
/// </summary>
},
clearCellSelection:function(rowIndex, columnIndex){
/// <summary>
/// It is used to clear specified cell selection based on the rowIndex and columnIndex provided.
/// </summary>
/// <param name="rowIndex"	type="number">It is used to pass the row index of the cell</param>
/// <param name="columnIndex"	type="number">It is used to pass the column index of the cell.</param>
},
clearColumnSelection:function(index){
/// <summary>
/// It is used to clear all the row selection or at specific row selection based on the index provided.
/// </summary>
/// <param name="index"	type="number">optional If index of the column is specified then it will remove the selection from the particular column else it will clears all of the column selection</param>
},
clearFiltering:function(field){
/// <summary>
/// It is used to clear all the filtering done.
/// </summary>
/// <param name="field"	type="string"> If field of the column is specified then it will clear the  particular filtering column</param>
},
clearSearching:function(){
/// <summary>
/// Clear the searching from the grid
/// </summary>
},
clearSelection:function(index){
/// <summary>
/// Clear all the row selection or at specific row selection based on the index provided
/// </summary>
/// <param name="index"	type="number">optional If index of the row is specified then it will remove the selection from the particular row else it will clears all of the row selection</param>
},
clearSorting:function(){
/// <summary>
/// Clear the sorting from columns in the grid
/// </summary>
},
collapseAll:function(){
/// <summary>
/// Collapse all the group caption rows in grid
/// </summary>
},
collapseGroupDropArea:function(){
/// <summary>
/// Collapse the group drop area in grid
/// </summary>
},
columns:function(columnDetails, action){
/// <summary>
/// Add or remove columns in grid column collections
/// </summary>
/// <param name="columnDetails"	type="Array&lt;any&gt;|string">Pass array of columns or string of field name to add/remove the column in grid</param>
/// <param name="action"	type="string">optional Pass add/remove action to be performed. By default "add" action will perform</param>
},
dataSource:function(datasource, templateRefresh){
/// <summary>
/// Refresh the grid with new data source
/// </summary>
/// <param name="datasource"	type="Array&lt;any&gt;">Pass new data source to the grid</param>
/// <param name="templateRefresh"	type="boolean">optional When templateRefresh is set true, both header and contents get refreshed</param>
},
deleteRecord:function(fieldName, data){
/// <summary>
/// Delete a record in grid control when allowDeleting is set as true
/// </summary>
/// <param name="fieldName"	type="string">Pass the primary key field Name of the column</param>
/// <param name="data"	type="Array&lt;any&gt;">Pass the JSON data of record need to be delete.</param>
},
destroy:function(){
/// <summary>
/// Destroy the grid widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
editCell:function(index, fieldName){
/// <summary>
/// Edit a particular cell based on the row index and field name provided in &quot;batch&quot; edit mode.
/// </summary>
/// <param name="index"	type="number">Pass row index to edit particular cell</param>
/// <param name="fieldName"	type="string">Pass the field name of the column to perform batch edit</param>
},
endEdit:function(){
/// <summary>
/// Send a save request in grid.
/// </summary>
},
expandAll:function(){
/// <summary>
/// Expand all the group caption rows in grid.
/// </summary>
},
expandCollapse:function($target){
/// <summary>
/// Expand or collapse the row based on the row state in grid
/// </summary>
/// <param name="$target"	type="JQuery">Pass the target object to expand/collapse the row based on its row state</param>
},
expandGroupDropArea:function(){
/// <summary>
/// Expand the group drop area in grid.
/// </summary>
},
export:function(action, serverEvent, multipleExport, gridIds){
/// <summary>
/// Export the grid content to excel, word or PDF document.
/// </summary>
/// <param name="action"	type="string">Pass the controller action name corresponding to exporting</param>
/// <param name="serverEvent"	type="string">optionalASP server event name corresponding to exporting</param>
/// <param name="multipleExport"	type="boolean">optionalPass the multiple exporting value as true/false</param>
/// <param name="gridIds"	type="Array&lt;any&gt;">optionalPass the array of the gridIds to be filtered</param>
},
export:function(action, serverEvent, multipleExport){
/// <summary>
/// Export the grid content to excel, word or PDF document.
/// </summary>
/// <param name="action"	type="string">Pass the controller action name corresponding to exporting</param>
/// <param name="serverEvent"	type="string">optionalASP server event name corresponding to exporting</param>
/// <param name="multipleExport"	type="boolean">optionalPass the multiple exporting value as true/false</param>
},
filterColumn:function(fieldName, filterOperator, filterValue, predicate, matchcase, actualFilterValue){
/// <summary>
/// Send a filtering request to filter one column in grid.
/// </summary>
/// <param name="fieldName"	type="Array&lt;any&gt;">Pass the field name of the column</param>
/// <param name="filterOperator"	type="string">string/integer/dateTime operator</param>
/// <param name="filterValue"	type="string">Pass the value to be filtered in a column</param>
/// <param name="predicate"	type="string">Pass the predicate as and/or</param>
/// <param name="matchcase"	type="boolean">optional Pass the match case value as true/false</param>
/// <param name="actualFilterValue"	type="any">optionalactualFilterValue denote the filter object of current filtered columns.Pass the value to filtered in a column</param>
},
filterColumn:function(filterQueries){
/// <summary>
/// Send a filtering request to filter single or multiple column in grid.
/// </summary>
/// <param name="filterQueries"	type="Array&lt;any&gt;">Pass array of filterColumn query for performing filter operation</param>
},
getBatchChanges:function(){
/// <summary>
/// Get the batch changes of edit, delete and add operations of grid.
/// </summary>
},
getBrowserDetails:function(){
/// <summary>
/// Get the browser details
/// </summary>
},
getColumnByField:function(fieldName){
/// <summary>
/// Get the column details based on the given field in grid
/// </summary>
/// <param name="fieldName"	type="string">Pass the field name of the column to get the corresponding column object</param>
},
getColumnByHeaderText:function(headerText){
/// <summary>
/// Get the column details based on the given header text in grid.
/// </summary>
/// <param name="headerText"	type="string">Pass the header text of the column to get the corresponding column object</param>
},
getColumnByIndex:function(columnIndex){
/// <summary>
/// Get the column details based on the given column index in grid
/// </summary>
/// <param name="columnIndex"	type="number">Pass the index of the column to get the corresponding column object</param>
},
getColumnFieldNames:function(){
/// <summary>
/// Get the list of field names from column collection in grid.
/// </summary>
},
getColumnIndexByField:function(fieldName){
/// <summary>
/// Get the column index of the given field in grid.
/// </summary>
/// <param name="fieldName"	type="string">Pass the field name of the column to get the corresponding column index</param>
},
getContent:function(){
/// <summary>
/// Get the content div element of grid.
/// </summary>
},
getContentTable:function(){
/// <summary>
/// Get the content table element of grid
/// </summary>
},
getCurrentEditCellData:function(){
/// <summary>
/// Get the data of currently edited cell value in &quot;batch&quot; edit mode
/// </summary>
},
getCurrentIndex:function(){
/// <summary>
/// Get the current page index in grid pager.
/// </summary>
},
getCurrentViewData:function(){
/// <summary>
/// Get the current page data source of grid.
/// </summary>
},
getFieldNameByHeaderText:function(headerText){
/// <summary>
/// Get the column field name from the given header text in grid.
/// </summary>
/// <param name="headerText"	type="string">Pass header text of the column to get its corresponding field name</param>
},
getFilterBar:function(){
/// <summary>
/// Get the filter bar of grid
/// </summary>
},
getFilteredRecords:function(){
/// <summary>
/// Get the records filtered or searched in Grid
/// </summary>
},
getFooterContent:function(){
/// <summary>
/// Get the footer content of grid.
/// </summary>
},
getFooterTable:function(){
/// <summary>
/// Get the footer table element of grid.
/// </summary>
},
getHeaderContent:function(){
/// <summary>
/// Get the header content div element of grid.
/// </summary>
},
getHeaderTable:function(){
/// <summary>
/// Get the header table element of grid
/// </summary>
},
getHeaderTextByFieldName:function(field){
/// <summary>
/// Get the column header text from the given field name in grid.
/// </summary>
/// <param name="field"	type="string">Pass field name of the column to get its corresponding header text</param>
},
getHiddenColumnNames:function(){
/// <summary>
/// Get the names of all the hidden column collections in grid.
/// </summary>
},
getIndexByRow:function($tr){
/// <summary>
/// Get the row index based on the given tr element in grid.
/// </summary>
/// <param name="$tr"	type="JQuery">Pass the tr element in grid content to get its row index</param>
},
getPager:function(){
/// <summary>
/// Get the pager of grid.
/// </summary>
},
getPrimaryKeyFieldNames:function(){
/// <summary>
/// Get the names of primary key columns in Grid
/// </summary>
},
getRowByIndex:function(from, to){
/// <summary>
/// Get the rows(tr element) from the given from and to row index in grid
/// </summary>
/// <param name="from"	type="number">Pass the from index from which the rows to be returned</param>
/// <param name="to"	type="number">Pass the to index to which the rows to be returned</param>
},
getRowHeight:function(){
/// <summary>
/// Get the row height of grid.
/// </summary>
},
getRows:function(){
/// <summary>
/// Get the rows(tr element)of grid which is displayed in the current page.
/// </summary>
},
getScrollObject:function(){
/// <summary>
/// Get the scroller object of grid.
/// </summary>
},
getSelectedRecords:function(){
/// <summary>
/// Get the selected records details in grid.
/// </summary>
},
getVisibleColumnNames:function(){
/// <summary>
/// Get the names of all the visible column collections in grid
/// </summary>
},
gotoPage:function(pageIndex){
/// <summary>
/// Send a paging request to specified page in grid
/// </summary>
/// <param name="pageIndex"	type="number">Pass the page index to perform paging at specified page index</param>
},
groupColumn:function(fieldName){
/// <summary>
/// Send a column grouping request in grid.
/// </summary>
/// <param name="fieldName"	type="string">Pass the field Name of the column to be grouped in grid control</param>
},
hideColumns:function(headerText){
/// <summary>
/// Hide columns from the grid based on the header text
/// </summary>
/// <param name="headerText"	type="Array&lt;any&gt;|string">you can pass either array of header text of various columns or a header text of a column to hide</param>
},
print:function(){
/// <summary>
/// Print the grid control
/// </summary>
},
refreshBatchEditChanges:function(){
/// <summary>
/// It is used to refresh and reset the changes made in &quot;batch&quot; edit mode
/// </summary>
},
refreshContent:function(templateRefresh){
/// <summary>
/// Refresh the grid contents. The template refreshment is based on the argument passed along with this method
/// </summary>
/// <param name="templateRefresh"	type="boolean">optional When templateRefresh is set true, template and grid contents both are refreshed in grid else only grid content is refreshed</param>
},
refreshTemplate:function(){
/// <summary>
/// Refresh the template of the grid
/// </summary>
},
refreshToolbar:function(){
/// <summary>
/// Refresh the toolbar items in grid.
/// </summary>
},
removeSortedColumns:function(fieldName){
/// <summary>
/// Remove a column or collection of columns from a sorted column collections in grid.
/// </summary>
/// <param name="fieldName"	type="Array&lt;any&gt;|string">Pass array of field names of the columns to remove a collection of sorted columns or pass a string of field name to remove a column from sorted column collections</param>
},
render:function(){
/// <summary>
/// Creates a grid control
/// </summary>
},
reorderColumns:function(fromFieldName, toFieldName){
/// <summary>
/// Re-order the column in grid
/// </summary>
/// <param name="fromFieldName"	type="string">Pass the from field name of the column needs to be changed</param>
/// <param name="toFieldName"	type="string">Pass the to field name of the column needs to be changed</param>
},
resetModelCollections:function(){
/// <summary>
/// Reset the model collections like pageSettings, groupSettings, filterSettings, sortSettings and summaryRows.
/// </summary>
},
resizeColumns:function(column, width){
/// <summary>
/// Resize the columns by giving column name and width for the corresponding one.
/// </summary>
/// <param name="column"	type="string">Pass the column name that needs to be changed</param>
/// <param name="width"	type="string">Pass the width to resize the particular columns</param>
},
rowHeightRefresh:function(){
/// <summary>
/// Resolves row height issue when unbound column is used with FrozenColumn
/// </summary>
},
saveCell:function(){
/// <summary>
/// Save the particular edited cell in grid.
/// </summary>
},
saveCell:function(preventSaveEvent){
/// <summary>
/// We can prevent the client side cellSave event triggering by passing the preventSaveEvent argument as true.
/// </summary>
/// <param name="preventSaveEvent"	type="boolean">optionalIf we pass preventSaveEvent as true, it prevents the client side cellSave event triggering </param>
},
setDimension:function(height, width){
/// <summary>
/// Set dimension for grid with corresponding to grid parent.
/// </summary>
/// <param name="height"	type="number">Pass the height of the grid container</param>
/// <param name="width"	type="number">Pass the width of the grid container</param>
},
setWidthToColumns:function(){
/// <summary>
/// Send a request to grid to refresh the width set to columns
/// </summary>
},
search:function(searchString){
/// <summary>
/// Send a search request to grid with specified string passed in it
/// </summary>
/// <param name="searchString"	type="string">Pass the string to search in Grid records</param>
},
selectCells:function(rowCellIndexes){
/// <summary>
/// Select cells in grid.
/// </summary>
/// <param name="rowCellIndexes"	type="any">It is used to set the starting index of row and indexes of cells for that corresponding row for selecting cells.</param>
},
selectColumns:function(fromIndex){
/// <summary>
/// Select columns in grid.
/// </summary>
/// <param name="fromIndex"	type="number">It is used to set the starting index of column for selecting columns.</param>
},
selectColumns:function(columnIndex, toIndex){
/// <summary>
/// Select the specified columns in grid based on Index provided.
/// </summary>
/// <param name="columnIndex"	type="number">It is used to set the starting index of column for selecting columns.</param>
/// <param name="toIndex"	type="number">optionalIt is used to set the ending index of column for selecting columns.</param>
},
selectRows:function(fromIndex, toIndex){
/// <summary>
/// Select rows in grid.
/// </summary>
/// <param name="fromIndex"	type="number">It is used to set the starting index of row for selecting rows.</param>
/// <param name="toIndex"	type="number">It is used to set the ending index of row for selecting rows.</param>
},
selectRows:function(from, to, target){
/// <summary>
/// Select specified rows in grid based on Index provided.
/// </summary>
/// <param name="from"	type="Array&lt;any&gt;|number">It is used to set the starting index of row for selecting rows.</param>
/// <param name="to"	type="number">optionalIt is used to set the ending index of row for selecting rows.</param>
/// <param name="target"	type="any">optionalTarget element which is clicked.</param>
},
selectRows:function(rowIndexes){
/// <summary>
/// Select rows in grid.
/// </summary>
/// <param name="rowIndexes"	type="Array&lt;any&gt;">Pass array of rowIndexes for selecting rows</param>
},
setCellText:function(){
/// <summary>
/// Used to update a particular cell value.
/// </summary>
},
setCellValue:function(Index, fieldName, value){
/// <summary>
/// Used to update a particular cell value based on specified row Index and the fieldName.
/// </summary>
/// <param name="Index"	type="number">It is used to set the index for selecting the row.</param>
/// <param name="fieldName"	type="string">It is used to set the field name for selecting column.</param>
/// <param name="value"	type="any">It is used to set the value for the selected cell.</param>
},
setValidationToField:function(fieldName, rules){
/// <summary>
/// Set validation to a field during editing.
/// </summary>
/// <param name="fieldName"	type="string">Specify the field name of the column to set validation rules</param>
/// <param name="rules"	type="any">Specify the validation rules for the field</param>
},
showColumns:function(headerText){
/// <summary>
/// Show columns in the grid based on the header text
/// </summary>
/// <param name="headerText"	type="Array&lt;any&gt;|string">you can pass either array of header text of various columns or a header text of a column to show</param>
},
sortColumn:function(columnName, sortingDirection){
/// <summary>
/// Send a sorting request in grid.
/// </summary>
/// <param name="columnName"	type="string">Pass the field name of the column as columnName for which sorting have to be performed</param>
/// <param name="sortingDirection"	type="string">optional Pass the sort direction ascending/descending by which the column have to be sort. By default it is sorting in an ascending order</param>
},
startEdit:function($tr){
/// <summary>
/// Send an edit record request in grid
/// </summary>
/// <param name="$tr"	type="JQuery">Pass the tr- selected row element to be edited in grid</param>
},
ungroupColumn:function(fieldName){
/// <summary>
/// Un-group a column from grouped columns collection in grid
/// </summary>
/// <param name="fieldName"	type="string">Pass the field Name of the column to be ungrouped from grouped column collection</param>
},
updateRecord:function(fieldName, data){
/// <summary>
/// Update a edited record in grid control when allowEditing is set as true.
/// </summary>
/// <param name="fieldName"	type="string">Pass the primary key field Name of the column</param>
/// <param name="data"	type="Array&lt;any&gt;">Pass the edited JSON data of record need to be update.</param>
},
windowonresize:function(){
/// <summary>
/// It adapts grid to its parent element or to the browsers window.
/// </summary>
},
};
jQuery.fn.ejGrid=function(){
this.data("ejGrid",new	ej.Grid());
return this;
};
jQuery.fn.ejGrid = function (options) {
/// <summary><br/>
///The grid can be easily configured to the DOM element, such as div. you can create a grid with a highly customizable look and feel.<br/><br/>
///Gets or sets a value that indicates whether to customizing cell based on our needs.
///<br/>allowCellMerging-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic grouping behavior. Grouping can be done by drag on drop desired columns to gridâ€™s GroupDropArea. This can be further customized through â€œgroupSettingsâ€ property.
///<br/>allowGrouping-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable keyboard support for performing grid actions. selectionType â€“ Gets or sets a value that indicates whether to enable single row or multiple rows selection behavior in grid. Multiple selection can be done through by holding CTRL and clicking the grid rows
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic filtering behavior on grid. Filtering can be used to limit the records displayed using required criteria and this can be further customized through â€œfilterSettingsâ€ property
///<br/>allowFiltering-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the dynamic sorting behavior on grid data. Sorting can be done through clicking on particular column header.
///<br/>allowSorting-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable multi columns sorting behavior in grid. Sort multiple columns by holding CTRL and click on the corresponding column header.
///<br/>allowMultiSorting-boolean	default-false
///<br/><br/>
///This specifies the grid to show the paginated data. Also enables pager control at the bottom of grid for dynamic navigation through data source. Paging can be further customized through â€œpageSettingsâ€ property.
///<br/>allowPaging-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the columns reordering behavior in the grid. Reordering can be done through by drag and drop the particular column from one index to another index within the grid.
///<br/>allowReordering-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether the column is non resizable. Column width is set automatically based on the content or header text which is large.
///<br/>allowResizeToFit-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic resizable of columns. Resize the width of the columns by simply click and move the particular column header line
///<br/>allowResizing-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the rows reordering in Grid and drag & drop rows between multiple Grid.
///<br/>allowRowDragAndDrop-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the scrollbar in the grid and view the records by scroll through the grid manually
///<br/>allowScrolling-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic searching behavior in grid. Currently search box can be enabled through â€œtoolbarSettingsâ€
///<br/>allowSearching-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether user can select rows on grid. On enabling feature, selected row will be highlighted.
///<br/>allowSelection-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether the Content will wrap to the next line if the content exceeds the boundary of the Column Cells.
///<br/>allowTextWrap-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the multiple exporting behavior on grid data.
///<br/>allowMultipleExporting-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to define common width for all the columns in the grid.
///<br/>commonWidth-number	default-
///<br/><br/>
///Gets or sets a value that indicates to enable the visibility of the grid lines.
///<br/>gridLines-ej.Grid.GridLines|string	default-ej.Grid.GridLines.Both
///<br/><br/>
///This specifies the grid to add the grid control inside the grid row of the parent with expand/collapse options
///<br/>childGrid-any	default-null
///<br/><br/>
///Sets the clip mode for Grid cell as ellipsis or clipped content(both header and content)
///<br/>clipMode-ej.Grid.ClipMode|string	default-ej.Grid.ClipMode.Clip
///<br/><br/>
///Used to enable or disable static width settings for column. If the columnLayout is set as fixed, then column width will be static.
///<br/>columnLayout-ej.Grid.ColumnLayout|string	default-ej.Grid.ColumnLayout.Auto
///<br/><br/>
///Gets or sets an object that indicates to render the grid with specified columns
///<br/>columns-Array&lt;Columns&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to enable editing behavior for particular column.
///<br/>allowEditing-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic filtering behavior for particular column.
///<br/>allowFiltering-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic grouping behavior for particular column.
///<br/>allowGrouping-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic sorting behavior for particular column.
///<br/>allowSorting-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable dynamic resizable for particular column.
///<br/>allowResizing-boolean	default-true
///<br/><br/>
///Gets or sets an object that indicates to define a command column in the grid.
///<br/>commands-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets an object that indicates to define all the button options which are available in ejButton.
///<br/>buttonOptions-any	default-
///<br/><br/>
///Gets or sets a value that indicates to add the command column button. See unboundType
///<br/>type-ej.Grid.UnboundType|string	default-
///<br/><br/>
///Gets or sets a value that indicates to provide custom CSS for an individual column.
///<br/>cssClass-string	default-
///<br/><br/>
///Gets or sets a value that indicates the attribute values to the td element of a particular column
///<br/>customAttributes-any	default-
///<br/><br/>
///Gets or sets a value that indicates to bind the external datasource to the particular column when column editType as dropdownedit and also it is used to bind the datasource to the foreign key column while editing the grid. //Where data is array of JSON objects of text and value for the drop-down and array of JSON objects for foreign key column.
///<br/>dataSource-Array&lt;any&gt;	default-null
///<br/><br/>
///Gets or sets a value that indicates to display the specified default value while adding a new record to the grid
///<br/>defaultValue-string|number|boolean|Date	default-
///<br/><br/>
///Gets or sets a value that indicates to render the grid content and header with an HTML elements
///<br/>disableHtmlEncode-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to display a column value as checkbox or string
///<br/>displayAsCheckBox-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates to customize ejNumericTextbox of an editable column. See editingType
///<br/>editParams-any	default-
///<br/><br/>
///Gets or sets a template that displays a custom editor used to edit column values. See editTemplate
///<br/>editTemplate-any	default-null
///<br/><br/>
///Gets or sets a value that indicates to render the element(based on edit type) for editing the grid record. See editingType
///<br/>editType-ej.Grid.EditingType|string	default-ej.Grid.EditingType.String
///<br/><br/>
///Gets or sets a value that indicates to display the columns in the grid mapping with column name of the dataSource.
///<br/>field-string	default-
///<br/><br/>
///Gets or sets a value that indicates to define foreign key field name of the grid datasource.
///<br/>foreignKeyField-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to bind the field which is in foreign column datasource based on the foreignKeyField
///<br/>foreignKeyValue-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the format for the text applied on the column
///<br/>format-string	default-
///<br/><br/>
///Gets or sets a value that indicates to add the template within the header element of the particular column.
///<br/>headerTemplateID-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to display the title of that particular column.
///<br/>headerText-string	default-
///<br/><br/>
///This defines the text alignment of a particular column header cell value. See headerTextAlign
///<br/>headerTextAlign-ej.TextAlign|string	default-ej.TextAlign.Left
///<br/><br/>
///You can use this property to freeze selected columns in grid at the time of scrolling.
///<br/>isFrozen-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates the column has an identity in the database.
///<br/>isIdentity-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates the column is act as a primary key(read-only) of the grid. The editing is performed based on the primary key column
///<br/>isPrimaryKey-boolean	default-false
///<br/><br/>
///Used to hide the particular column in column chooser by giving value as false.
///<br/>showInColumnChooser-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enables column template for a particular column.
///<br/>template-boolean|string	default-false
///<br/><br/>
///Gets or sets a value that indicates to align the text within the column. See textAlign
///<br/>textAlign- ej.TextAlign|string	default-ej.TextAlign.Left
///<br/><br/>
///Sets the template for Tooltip in Grid Columns(both header and content)
///<br/>tooltip-string	default-
///<br/><br/>
///Gets or sets a value that indicates to specify the data type of the specified columns.
///<br/>type-string	default-
///<br/><br/>
///Gets or sets a value that indicates to define constraints for saving data to the database.
///<br/>validationRules-any	default-
///<br/><br/>
///Gets or sets a value that indicates whether this column is visible in the grid.
///<br/>visible-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates to define the width for a particular column in the grid.
///<br/>width-number	default-
///<br/><br/>
///Gets or sets an object that indicates whether to customize the context menu behavior of the grid.
///<br/>contextMenuSettings-ContextMenuSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to add the default context menu actions as a context menu items If enableContextMenu is true it will show all the items related to the target, if you want selected items from contextmenu you have to mention in the contextMenuItems
///<br/>contextMenuItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to add custom contextMenu items within the toolbar to perform any action in the grid
///<br/>customContextMenuItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to enable the context menu action in the grid.
///<br/>enableContextMenu-boolean	default-false
///<br/><br/>
///Used to get or set the subMenu to the corresponding custom context menu item.
///<br/>subContextMenu-Array&lt;any&gt;	default-
///<br/><br/>
///Used to get or set the corresponding custom context menu item to which the submenu to be appended.
///<br/>contextMenuItem-string	default-null
///<br/><br/>
///Used to get or set the sub menu items to the custom context menu item.
///<br/>subMenu-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to disable the default context menu items in the grid.
///<br/>disableDefaultItems-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to render the grid with custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Gets or sets the data to render the grid with records
///<br/>dataSource-any	default-null
///<br/><br/>
///This specifies the grid to add the details row for the corresponding master row
///<br/>detailsTemplate-string	default-null
///<br/><br/>
///Gets or sets an object that indicates whether to customize the editing behavior of the grid.
///<br/>editSettings-EditSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable insert action in the editing mode.
///<br/>allowAdding-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the delete action in the editing mode.
///<br/>allowDeleting-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the edit action in the editing mode.
///<br/>allowEditing-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the editing action while double click on the record
///<br/>allowEditOnDblClick-boolean	default-true
///<br/><br/>
///This specifies the id of the template. This template can be used to display the data that you require to be edited using the Dialog Box
///<br/>dialogEditorTemplateID-string	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to define the mode of editing See editMode
///<br/>editMode-ej.Grid.EditMode|string	default-ej.Grid.EditMode.Normal
///<br/><br/>
///This specifies the id of the template. This template can be used to display the data that you require to be edited using the External edit form
///<br/>externalFormTemplateID-string	default-null
///<br/><br/>
///This specifies to set the position of an External edit form either in the top-right or bottom-left of the grid
///<br/>formPosition-ej.Grid.FormPosition|string	default-ej.Grid.FormPosition.BottomLeft
///<br/><br/>
///This specifies the id of the template. This template can be used to display the data that you require to be edited using the Inline edit form
///<br/>inlineFormTemplateID-string	default-null
///<br/><br/>
///This specifies to set the position of an adding new row either in the top or bottom of the grid
///<br/>rowPosition-ej.Grid.RowPosition|string	default-ej.Grid.RowPosition.top
///<br/><br/>
///Gets or sets a value that indicates whether the confirm dialog has to be shown while saving or discarding the batch changes
///<br/>showConfirmDialog-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether the confirm dialog has to be shown while deleting record
///<br/>showDeleteConfirmDialog-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether the title for edit form is different from the primarykey column.
///<br/>titleColumn-string	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to display the add new form by default in the grid.
///<br/>showAddNewRow-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the alternative rows differentiation in the grid records based on corresponding theme.
///<br/>enableAltRow-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable the save action in the grid through row selection
///<br/>enableAutoSaveOnSelectionChange-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable mouse over effect on the corresponding column header cell of the grid
///<br/>enableHeaderHover-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to persist the grid model state in page using applicable medium i.e., HTML5 localStorage or cookies
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether the grid rows has to be rendered as detail view in mobile mode
///<br/>enableResponsiveRow-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable mouse over effect on corresponding grid row.
///<br/>enableRowHover-boolean	default-true
///<br/><br/>
///Align content in the grid control from right to left by setting the property as true.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///To Disable the mouse swipe property as false.
///<br/>enableTouch-boolean	default-true
///<br/><br/>
///Gets or sets an object that indicates whether to customize the filtering behavior of the grid
///<br/>filterSettings-FilterSettings	default-
///<br/><br/>
///Gets or sets a value that indicates to perform the filter operation with case sensitive in excel styled filter menu mode
///<br/>enableCaseSensitivity-boolean	default-false
///<br/><br/>
///This specifies the grid to starts the filter action while typing in the filterBar or after pressing the enter key. based on the filterBarMode. See filterBarMode
///<br/>filterBarMode-ej.Grid.FilterBarMode|string	default-ej.Grid.FilterBarMode.Immediate
///<br/><br/>
///Gets or sets a value that indicates whether to define the filtered columns details programmatically at initial load
///<br/>filteredColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to define the field name of the column to be filter.
///<br/>field-string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the filter condition to filtered column.
///<br/>operator-ej.FilterOperators|string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the predicate as and/or.
///<br/>predicate-string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the value to be filtered in a column.
///<br/>value-string|number	default-
///<br/><br/>
///This specifies the grid to show the filterBar or filterMenu to the grid records. See filterType
///<br/>filterType-ej.Grid.FilterType|string	default-ej.Grid.FilterType.FilterBar
///<br/><br/>
///Gets or sets a value that indicates the maximum number of filter choices that can be showed in the excel styled filter menu.
///<br/>maxFilterChoices-number	default-1000
///<br/><br/>
///This specifies the grid to show the filter text within the grid pager itself.
///<br/>showFilterBarMessage-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable the predicate options in the filtering menu
///<br/>showPredicate-boolean	default-false
///<br/><br/>
///Gets or sets an object that indicates whether to customize the grouping behavior of the grid.
///<br/>groupSettings-GroupSettings	default-
///<br/><br/>
///Gets or sets a value that customize the group caption format.
///<br/>captionFormat-string	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to enable animation button option in the group drop area of the grid.
///<br/>enableDropAreaAutoSizing-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to add grouped columns programmatically at initial load
///<br/>groupedColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to show the group drop area just above the column header. It can be used to avoid ungrouping the already grouped column using groupSettings.
///<br/>showDropArea-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to hide the grouped columns from the grid
///<br/>showGroupedColumn-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to show the group button image(toggle button)in the column header and also in the grouped column in the group drop area . It can be used to group/ungroup the columns by click on the toggle button.
///<br/>showToggleButton-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the close button in the grouped column which is in the group drop area to ungroup the grouped column
///<br/>showUngroupButton-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether the grid design has be to made responsive.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///This specifies to change the key in keyboard interaction to grid control
///<br/>keySettings-any	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to customizing the user interface (UI) as locale-specific in order to display regional data i.e. in a language and culture specific to a particular country or region.
///<br/>locale-string	default-en-US
///<br/><br/>
///Gets or sets a value that indicates whether to set the minimum width of the responsive grid while isResponsive property is true and enableResponsiveRow property is set as false.
///<br/>minWidth-number	default-0
///<br/><br/>
///Gets or sets an object that indicates whether to modify the pager default configuration.
///<br/>pageSettings-PageSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define which page to display currently in the grid
///<br/>currentPage-number	default-1
///<br/><br/>
///Gets or sets a value that indicates whether to pass the current page information as a query string along with the URL while navigating to other page.
///<br/>enableQueryString-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enables pager template for the grid.
///<br/>enableTemplates-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to define the number of pages displayed in the pager for navigation
///<br/>pageCount-number	default-8
///<br/><br/>
///Gets or sets a value that indicates whether to define the number of records displayed per page
///<br/>pageSize-number	default-12
///<br/><br/>
///Gets or sets a value that indicates whether to enables default pager for the grid.
///<br/>showDefaults-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to add the template as a pager template for grid.
///<br/>template-string	default-null
///<br/><br/>
///Get the value of total number of pages in the grid. The totalPages value is calculated based on page size and total records of grid
///<br/>totalPages-number	default-null
///<br/><br/>
///Get the value of total number of records which is bound to the grid. The totalRecordsCount value is calculated based on dataSource bound to the grid.
///<br/>totalRecordsCount-number	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to define the number of pages to print
///<br/>printMode-ej.Grid.PrintMode|string	default-ej.Grid.PrintMode.AllPages
///<br/><br/>
///Query the dataSource from the table for Grid.
///<br/>query-any	default-null
///<br/><br/>
///Gets or sets a value that indicates to render the grid with template rows. The template row must be a table row. That table row must have the JavaScript render binding format ({{:columnName}}) then the grid data source binds the data to the corresponding table row of the template.
///<br/>rowTemplate-string	default-null
///<br/><br/>
///Gets or sets an object that indicates whether to customize the drag and drop behavior of the grid rows
///<br/>rowDropSettings-RowDropSettings	default-
///<br/><br/>
///This specifies the grid to drop the grid rows only at particular target element.
///<br/>dropTargetID-any	default-null
///<br/><br/>
///This helps in mapping server-side action when rows are dragged from Grid.
///<br/>dragMapper-string	default-null
///<br/><br/>
///This helps in mapping server-side action when rows are dropped in Grid.
///<br/>dropMapper-string	default-null
///<br/><br/>
///Gets or sets an object that indicates whether to customize the searching behavior of the grid
///<br/>searchSettings-SearchSettings	default-
///<br/><br/>
///This specify the grid to search for the value in particular columns that is mentioned in the field.
///<br/>fields-any	default-[]
///<br/><br/>
///This specifies the grid to search the particular data that is mentioned in the key.
///<br/>key-string	default-
///<br/><br/>
///It specifies the grid to search the records based on operator.
///<br/>operator-string	default-contains
///<br/><br/>
///It enables or disables case-sensitivity while searching the search key in grid.
///<br/>ignoreCase-boolean	default-true
///<br/><br/>
///Gets a value that indicates whether the grid model to hold multiple selected records . selectedRecords can be used to displayed hold the single or multiple selected records using â€œselectedRecordsâ€ property
///<br/>selectedRecords-Array&lt;any&gt;	default-null
///<br/><br/>
///Gets or sets a value that indicates to select the row while initializing the grid
///<br/>selectedRowIndex-number	default--1
///<br/><br/>
///This property is used to configure the selection behavior of the grid.
///<br/>selectionSettings-SelectionSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable the toggle selection behavior for row, cell and column.
///<br/>enableToggle-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to add the default selection actions as a selection mode.See selectionMode
///<br/>selectionMode-ej.Grid.SelectionMode|string	default-[row]
///<br/><br/>
///The row selection behavior of grid. Accepting types are "single" and "multiple".
///<br/>selectionType-ej.Grid.SelectionType|string	default-ej.Grid.SelectionType.Single
///<br/><br/>
///Gets or sets an object that indicates whether to customize the scrolling behavior of the grid.
///<br/>scrollSettings-ScrollSettings	default-
///<br/><br/>
///This specify the grid to to view data that you require without buffering the entire load of a huge database
///<br/>allowVirtualScrolling-boolean	default-false
///<br/><br/>
///This specify the grid to enable/disable touch control for scrolling.
///<br/>enableTouchScroll-boolean	default-true
///<br/><br/>
///This specify the grid to freeze particular columns at the time of scrolling.
///<br/>frozenColumns-number	default-0
///<br/><br/>
///This specify the grid to freeze particular rows at the time of scrolling.
///<br/>frozenRows-number	default-0
///<br/><br/>
///This specify the grid to show the vertical scroll bar, to scroll and view the grid contents.
///<br/>height-number	default-0
///<br/><br/>
///This is used to define the mode of virtual scrolling in grid. See virtualScrollMode
///<br/>virtualScrollMode-ej.Grid.VirtualScrollMode|string	default-ej.Grid.VirtualScrollMode.Normal
///<br/><br/>
///This specify the grid to show the horizontal scroll bar, to scroll and view the grid contents
///<br/>width-number	default-250
///<br/><br/>
///This specify the scroll down pixel of mouse wheel, to scroll mouse wheel and view the grid contents.
///<br/>scrollOneStepBy-number	default-57
///<br/><br/>
///Gets or sets a value that indicates whether to enable column chooser on grid. On enabling feature able to show/hide grid columns
///<br/>showColumnChooser-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates stacked header should be shown on grid layout when the property â€œstackedHeaderRowsâ€ is set.
///<br/>showStackedHeader-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates summary rows should be shown on grid layout when the property â€œsummaryRowsâ€ is set
///<br/>showSummary-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to customize the sorting behavior of the grid.
///<br/>sortSettings-SortSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the direction and field to sort the column.
///<br/>sortedColumns-Array&lt;any&gt;	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the direction to sort the column.
///<br/>direction-string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to define the field name of the column to be sort
///<br/>field-string	default-
///<br/><br/>
///Gets or sets an object that indicates to managing the collection of stacked header rows for the grid.
///<br/>stackedHeaderRows-Array&lt;StackedHeaderRows&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to add stacked header columns into the stacked header rows
///<br/>stackedHeaderColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates the header text for the particular stacked header column.
///<br/>column-any	default-null
///<br/><br/>
///Gets or sets a value that indicates class to the corresponding stackedHeaderColumn.
///<br/>cssClass-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the header text for the particular stacked header column.
///<br/>headerText-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the text alignment of the corresponding headerText.
///<br/>textAlign-string	default-ej.TextAlign.Left
///<br/><br/>
///Gets or sets an object that indicates to managing the collection of summary rows for the grid.
///<br/>summaryRows-Array&lt;SummaryRows&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to show the summary value within the group caption area for the corresponding summary column while grouping the column
///<br/>showCaptionSummary-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to show the group summary value for the corresponding summary column while grouping a column
///<br/>showGroupSummary-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to show the total summary value the for the corresponding summary column. The summary row is added after the grid content.
///<br/>showTotalSummary-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to add summary columns into the summary rows.
///<br/>summaryColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates the text displayed in the summary column as a value
///<br/>customSummaryValue-string	default-null
///<br/><br/>
///This specifies summary column used to perform the summary calculation
///<br/>dataMember-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to define the target column at which to display the summary.
///<br/>displayColumn-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the format for the text applied on the column
///<br/>format-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the text displayed before the summary column value
///<br/>prefix-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the text displayed after the summary column value
///<br/>suffix-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the type of calculations to be performed for the corresponding summary column
///<br/>summaryType-ej.Grid.SummaryType|string	default-[]
///<br/><br/>
///Gets or sets a value that indicates to add the template for the summary value of dataMember given.
///<br/>template-string	default-null
///<br/><br/>
///This specifies the grid to show the title for the summary rows.
///<br/>title-string	default-
///<br/><br/>
///This specifies the grid to show the title of summary row in the specified column.
///<br/>titleColumn-string	default-null
///<br/><br/>
///Gets or sets an object that indicates whether to auto wrap the grid header or content or both
///<br/>textWrapSettings-TextWrapSettings	default-
///<br/><br/>
///This specifies the grid to apply the auto wrap for grid content or header or both.
///<br/>wrapMode-ej.Grid.WrapMode|string	default-ej.Grid.WrapMode.Both
///<br/><br/>
///Gets or sets an object that indicates whether to enable the toolbar in the grid and add toolbar items
///<br/>toolbarSettings-ToolbarSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to add custom toolbar items within the toolbar to perform any action in the grid
///<br/>customToolbarItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to enable toolbar in the grid.
///<br/>showToolbar-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to add the default editing actions as a toolbar items
///<br/>toolbarItems-ej.Grid.ToolBarItems|string	default-[]
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.GroupButton=function(){};
ej.GroupButton.prototype={

deselectItem:function(element){
/// <summary>
/// Remove the selection state of the specified the button element from the GroupButton
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
destroy:function(){
/// <summary>
/// Destroy the GroupButton widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the GroupButton control
/// </summary>
},
disableItem:function(element){
/// <summary>
/// Disable the specified button element from the ejGroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
enable:function(){
/// <summary>
/// Enables the disabled ejGroupButton control.
/// </summary>
},
enableItem:function(element){
/// <summary>
/// Enable the specified disabled button element from the ejGroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
getIndex:function(element){
/// <summary>
/// Returns the index value for specified button element in the GroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
getSelectedItem:function(element){
/// <summary>
/// This method returns the list of active state button elements from the GroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
hide:function(){
/// <summary>
/// Hides the GroupButton control
/// </summary>
},
hideItem:function(element){
/// <summary>
/// Hide the specified button element from the ejGroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
isDisabled:function(){
/// <summary>
/// Returns the disabled state of the specified element button element in GroupButton as Boolean.
/// </summary>
},
isSelected:function(){
/// <summary>
/// Returns the state of the specified button element as Boolean.
/// </summary>
},
selectItem:function(element){
/// <summary>
/// Public method used to select the specified button element from the ejGroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
show:function(){
/// <summary>
/// Shows the GroupButton control, if its hide.
/// </summary>
},
showItem:function(element){
/// <summary>
/// Show the specified hidden button element from the ejGroupButton control.
/// </summary>
/// <param name="element"	type="JQuery">Specific button element</param>
},
};
jQuery.fn.ejGroupButton=function(){
this.data("ejGroupButton",new	ej.GroupButton());
return this;
};
jQuery.fn.ejGroupButton = function (options) {
/// <summary><br/>
///The Essential JavaScript Group Button widget helps to display multiple buttons which are stacked together in a single line and used as a navigation component. Also it manages the checked/unchecked state for a set of buttons, since it supports radio and check button modes.<br/><br/>
///Sets the specified class to GroupButton wrapper element, which allows for custom skinning option in ejGroupButton control.
///<br/>cssClass-string	default-
///<br/><br/>
///Displays the ejGroupButton in Right to Left direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Used to enable or disable the ejGroupButton control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Sets the GroupButton behavior to works as Checkbox mode/ radio button mode based on the specified option.
///<br/>groupButtonMode-ej.GroupButtonMode | string	default-ej.GroupButtonMode.RadioButton
///<br/><br/>
///Used to sets the height of the ejGroupButton control.
///<br/>height-string|number	default-28
///<br/><br/>
///Defines the characteristics of the ejGroupButton control and extend the capability of an HTML element by adding specified attributes to element tag and by performing the related actions
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specify the orientation of the GroupButton. See below to get available orientations
///<br/>orientation-ej.Orientation|string	default-ej.Orientation.Horizontal
///<br/><br/>
///Sets the list of button elements to be selected. To enable this option groupButtonMode should be in â€œcheckboxâ€ mode.
///<br/>selectedItemIndex-number[]|string[]	default-[]
///<br/><br/>
///Sets the rounder corner to the GroupButton, if sets as true.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the size of the button. See available size
///<br/>size-ej.ButtonSize|string	default-ej.ButtonSize.Normal
///<br/><br/>
///Defines the width of the ejGroupButton control.
///<br/>width-string|number	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Kanban=function(){};
ej.Kanban.prototype={

addCard:function(primaryKey, card){
/// <summary>
/// Add a new card in Kanban control.If parameters are not given default dialog will be open
/// </summary>
/// <param name="primaryKey"	type="string">Pass the primary key field Name of the column</param>
/// <param name="card"	type="Array&lt;any&gt;">Pass the edited JSON data of card need to be add.</param>
},
clearSearch:function(){
/// <summary>
/// Method used for send a clear search request to Kanban.
/// </summary>
},
clearSelection:function(){
/// <summary>
/// It is used to clear all the card selection.
/// </summary>
},
collapseAll:function(){
/// <summary>
/// Collapse all the swimlane rows in Kanban.
/// </summary>
},
columns:function(columndetails, keyvalue, action){
/// <summary>
/// Add or remove columns in Kanban columns collections
/// </summary>
/// <param name="columndetails"	type="Array&lt;any&gt;|string">Pass array of columns or string of headerText to add/remove the column in Kanban</param>
/// <param name="keyvalue"	type="Array&lt;any&gt;|string">Pass array of columns or string of key value to add/remove the column in Kanban</param>
/// <param name="action"	type="string">optional Pass add/remove action to be performed. By default "add" action will perform</param>
},
cancelEdit:function(){
/// <summary>
/// Send a cancel request of add/edit card in Kanban
/// </summary>
},
destroy:function(){
/// <summary>
/// Destroy the Kanban widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
deleteCard:function(Key){
/// <summary>
/// Delete a card in Kanban control.
/// </summary>
/// <param name="Key"	type="string|number">Pass the key of card to be delete</param>
},
dataSource:function(datasource){
/// <summary>
/// Refresh the Kanban with new data source.
/// </summary>
/// <param name="datasource"	type="Array&lt;any&gt;">Pass new data source to the Kanban</param>
},
endEdit:function(){
/// <summary>
/// Send a save request in Kanban when any card is in edit/new add card state.
/// </summary>
},
toggleColumn:function(headerText){
/// <summary>
/// toggleColumn based on the headerText in Kanban.
/// </summary>
/// <param name="headerText"	type="any">Pass the header text of the column to get the corresponding column object</param>
},
toggleCard:function(key){
/// <summary>
/// Expand or collapse the card based on the state of target &quot;div&quot;
/// </summary>
/// <param name="key"	type="string|number">Pass the id of card to be toggle </param>
},
toggleSwimlane:function($div){
/// <summary>
/// Expand or collapse the swimlane row based on the state of target &quot;div&quot;
/// </summary>
/// <param name="$div"	type="any">Pass the div object to toggleSwimlane row based on its row state</param>
},
expandAll:function(){
/// <summary>
/// Expand all the swimlane rows in Kanban.
/// </summary>
},
getVisibleColumnNames:function(){
/// <summary>
/// Used for get the names of all the visible column name collections in Kanban.
/// </summary>
},
getScrollObject:function(){
/// <summary>
/// Get the scroller object of Kanban.
/// </summary>
},
getColumnByHeaderText:function(headerText){
/// <summary>
/// Get the column details based on the given header text in Kanban.
/// </summary>
/// <param name="headerText"	type="string">Pass the header text of the column to get the corresponding column object</param>
},
hideColumns:function(headerText){
/// <summary>
/// Hide columns from the Kanban based on the header text
/// </summary>
/// <param name="headerText"	type="Array&lt;any&gt;|string">you can pass either array of header text of various columns or a header text of a column to hide</param>
},
refreshTemplate:function(){
/// <summary>
/// Refresh the template of the Kanban
/// </summary>
},
refresh:function(templateRefresh){
/// <summary>
/// Refresh the Kanban contents.The template refreshment is based on the argument passed along with this method
/// </summary>
/// <param name="templateRefresh"	type="boolean">optional When templateRefresh is set true, template and Kanban contents both are refreshed in Kanban else only Kanban content is refreshed</param>
},
searchCards:function(searchString){
/// <summary>
/// Send a search request to Kanban with specified string passed in it.
/// </summary>
/// <param name="searchString"	type="string">Pass the string to search in Kanban card</param>
},
setValidationToField:function(name, rules){
/// <summary>
/// Method used for set validation to a field during editing.
/// </summary>
/// <param name="name"	type="string">Specify the name of the column to set validation rules</param>
/// <param name="rules"	type="any">Specify the validation rules for the field</param>
},
startEdit:function($div){
/// <summary>
/// Send an edit card request in Kanban.Parameter will be HTML element or primary key
/// </summary>
/// <param name="$div"	type="any">Pass the div selected row element to be edited in Kanban</param>
},
showColumns:function(headerText){
/// <summary>
/// Show columns in the Kanban based on the header text.
/// </summary>
/// <param name="headerText"	type="Array&lt;any&gt;|string">You can pass either array of header text of various columns or a header text of a column to show</param>
},
updateCard:function(key, data){
/// <summary>
/// Update a card in Kanban control based on key and JSON data given.
/// </summary>
/// <param name="key"	type="string">Pass the key field Name of the column</param>
/// <param name="data"	type="Array&lt;any&gt;">Pass the edited JSON data of card need to be update.</param>
},
};
jQuery.fn.ejKanban=function(){
this.data("ejKanban",new	ej.Kanban());
return this;
};
jQuery.fn.ejKanban = function (options) {
/// <summary><br/>
///The Kanban can be easily configured to the DOM element, such as div. you can create a Kanban with a highly customizable look and feel.<br/><br/>
///Gets or sets a value that indicates whether to enable allowDragAndDrop behavior on Kanban.
///<br/>allowDragAndDrop-boolean	default-true
///<br/><br/>
///To enable or disable the title of the card.
///<br/>allowTitle-boolean	default-false
///<br/><br/>
///Customize the settings for swimlane.
///<br/>swimlaneSettings-SwimlaneSettings	default-Object
///<br/><br/>
///To enable or disable items count in swimlane
///<br/>showCount-boolean	default-true
///<br/><br/>
///To enable or disable the column expand /collapse.
///<br/>allowToggleColumn-boolean	default-false
///<br/><br/>
///To enable Searching operation in Kanban.
///<br/>allowSearching-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable allowSelection behavior on Kanban.User can select card and the selected card will be highlighted on Kanban.
///<br/>allowSelection-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to allow card hover actions.
///<br/>allowHover-boolean	default-true
///<br/><br/>
///To allow keyboard navigation actions.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable the scrollbar in the Kanban and view the card by scroll through the Kanban manually.
///<br/>allowScrolling-boolean	default-false
///<br/><br/>
///Gets or sets an object that indicates whether to customize the context menu behavior of the Kanban.
///<br/>contextMenuSettings-ContextMenuSettings	default-Object
///<br/><br/>
///To enable Context menu , All default context menu will show.
///<br/>enable-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates the list of items needs to be disable from default context menu
///<br/>disableDefaultItems-Array&lt;any&gt;	default-array
///<br/><br/>
///Gets or sets a value that indicates whether to add custom contextMenu items
///<br/>customMenuItems-Array&lt;any&gt;	default-array
///<br/><br/>
///Sets context menu to target element.
///<br/>target-ej.Kanban.Target|string	default-ej.Kanban.Target.All
///<br/><br/>
///Gets the name to custom menu.
///<br/>text-string	default-null
///<br/><br/>
///Gets the template to render custom menu.
///<br/>template-string	default-null
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns.
///<br/>columns-Array&lt;Columns&gt;	default-array
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns header text.
///<br/>headerText-string	default-null
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns key.
///<br/>key-string|number	default-null
///<br/><br/>
///To set column collapse or expand state
///<br/>isCollapsed-boolean	default-false
///<br/><br/>
///To customize the column constraints whether the constraints contains minimum limit or maximum limit or both.
///<br/>constraints-any	default-object
///<br/><br/>
///It is used to specify the type whether the constraints based on column or swimlane.
///<br/>type-string	default-null
///<br/><br/>
///It is used to specify the minimum amount of card in particular column cell or swimlane cell can hold.
///<br/>min-number	default-null
///<br/><br/>
///It is used to specify the maximum amount of card in particular column cell or swimlane cell can hold.
///<br/>max-number	default-null
///<br/><br/>
///Gets or sets a value that indicates to add the template within the header element.
///<br/>headerTemplate-string	default-null
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns width.
///<br/>width-string|number	default-null
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns visible.
///<br/>visible-boolean	default-true
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified columns to show the add button.
///<br/>showAddButton-boolean	default-false
///<br/><br/>
///Gets or sets an object that indicates whether to Customize the card based on the Mapping Fields.
///<br/>cardSettings-CardSettings	default-Object
///<br/><br/>
///Gets or sets a value that indicates to add the template of card .
///<br/>template-string	default-null
///<br/><br/>
///To customize the card border color based on assigned task. Colors and corresponding values defined  here will be mapped with colorField mapped data source column.
///<br/>colorMapping-any	default-Object
///<br/><br/>
///Gets or sets a value that indicates whether to add customToolbarItems within the toolbar to perform any action in the Kanban.
///<br/>customToolbarItems-Array&lt;CustomToolbarItems&gt;	default-[]
///<br/><br/>
///Gets the template to render customToolbarItems.
///<br/>template-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to render the Kanban with custom theme.
///<br/>cssClass-string	default-null
///<br/><br/>
///Gets or sets the data to render the Kanban with card.
///<br/>dataSource-any	default-Object
///<br/><br/>
///Align content in the Kanban control from right to left by setting the property as true.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///To show Total count of cards in each column
///<br/>enableTotalCount-boolean	default-true
///<br/><br/>
///Get or sets an object that indicates whether to customize the editing behavior of the Kanban.
///<br/>editSettings-EditSettings	default-Object
///<br/><br/>
///Gets or sets a value that indicates whether to enable the editing action in cards of Kanban.
///<br/>allowEditing-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable the adding action in cards behavior on Kanban.
///<br/>allowAdding-boolean	default-false
///<br/><br/>
///This specifies the id of the template.which is require to be edited using the Dialog Box
///<br/>dialogTemplate-string	default-null
///<br/><br/>
///Get or sets an object that indicates whether to customize the editMode of the Kanban.
///<br/>editMode-ej.Kanban.EditMode|string	default-ej.Kanban.EditMode.Dialog
///<br/><br/>
///Get or sets an object that indicates whether to customize the editing fields of Kanban card.
///<br/>editItems-Array&lt;any&gt;	default-Array
///<br/><br/>
///It is used to map editing field in the card.
///<br/>field-string	default-null
///<br/><br/>
///It is used to set the particular editType in the card for editing.
///<br/>editType-ej.Kanban.EditingType|string	default-ej.Kanban.EditingType.String
///<br/><br/>
///Gets or sets a value that indicates to define constraints for saving data to the database.
///<br/>validationRules-any	default-Object
///<br/><br/>
///It is used to set the particular editparams in the card for editing.
///<br/>editParams-any	default-Object
///<br/><br/>
///It is used to specify defaultValue in the card.
///<br/>defaultValue-string|number	default-null
///<br/><br/>
///To customize field mappings for card , editing title and control key parameters
///<br/>fields-Fields	default-Object
///<br/><br/>
///The primarykey field is get as property of Kanban. And this will used for Drag and drop and editing mainly.
///<br/>primaryKey-string	default-null
///<br/><br/>
///To enable swimlane grouping based on the given key field.
///<br/>swimlaneKey-string	default-null
///<br/><br/>
///Priority field has been mapped data source field to maintain card priority
///<br/>priority-string	default-null
///<br/><br/>
///ContentField has been Mapped into card text.
///<br/>content-string	default-null
///<br/><br/>
///TagField has been Mapped into card tag.
///<br/>tag-string	default-null
///<br/><br/>
///Title Field has been Mapped to field in datasource for title content. If title field specified , card expand/collapse will be enabled with header and content section
///<br/>title-string	default-null
///<br/><br/>
///To customize the card has been Mapped into card color field.
///<br/>color-string	default-null
///<br/><br/>
///ImageUrlField has been Mapped into card image.
///<br/>imageUrl-string	default-null
///<br/><br/>
///To map datasource field for column values mapping
///<br/>keyField-string	default-null
///<br/><br/>
///When set to true, adapts the Kanban layout to fit the screen size of devices on which it renders.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to set the minimum width of the responsive Kanban while isResponsive property is true.
///<br/>minWidth-number	default-null
///<br/><br/>
///To customize the filtering behavior based on queries given.
///<br/>filterSettings-Array&lt;FilterSettings&gt;	default-array
///<br/><br/>
///Gets or sets an object of display name to filter queries.
///<br/>text-string	default-null
///<br/><br/>
///Gets or sets an object that Queries to perform filtering
///<br/>query-any	default-Object
///<br/><br/>
///Gets or sets an object of tooltip to filter buttons.
///<br/>description-string	default-null
///<br/><br/>
///ej Query to query database of Kanban.
///<br/>query-any	default-Object
///<br/><br/>
///To change the key in keyboard interaction to Kanban control.
///<br/>keySettings-any	default-Object
///<br/><br/>
///Gets or sets an object that indicates whether to customize the scrolling behavior of the Kanban.
///<br/>scrollSettings-ScrollSettings	default-Object
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified scroll height.
///<br/>height-string|number	default-null
///<br/><br/>
///Gets or sets an object that indicates to render the Kanban with specified scroll width.
///<br/>width-string|number	default-null
///<br/><br/>
///To allow the Kanban to freeze particular swimlane at the time of scrolling , until scroll reaches next swimlane and it continues.
///<br/>allowFreezeSwimlane-boolean	default-false
///<br/><br/>
///To customize the searching behavior of the Kanban.
///<br/>searchSettings-SearchSettings	default-Object
///<br/><br/>
///To customize the fields the searching operation can be perform.
///<br/>fields-Array&lt;any&gt;	default-Array
///<br/><br/>
///To customize the searching string.
///<br/>key-string	default-null
///<br/><br/>
///To customize the operator based on searching.
///<br/>operator-string	default-null
///<br/><br/>
///To customize the ignore case based on searching.
///<br/>ignoreCase-boolean	default-true
///<br/><br/>
///To allow customize selection type. Accepting types are "single" and "multiple".
///<br/>selectionType-ej.Kanban.SelectionType|string	default-ej.Kanban.SelectionType.Single
///<br/><br/>
///Gets or sets an object that indicates to managing the collection of stacked header rows for the Kanban.
///<br/>stackedHeaderRows-Array&lt;StackedHeaderRows&gt;	default-Array
///<br/><br/>
///Gets or sets a value that indicates whether to add stacked header columns into the stacked header rows.
///<br/>stackedHeaderColumns-Array&lt;any&gt;	default-Array
///<br/><br/>
///Gets or sets a value that indicates the headerText for the particular stacked header column.
///<br/>headerText-string	default-null
///<br/><br/>
///Gets or sets a value that indicates the column for the particular stacked header column.
///<br/>column-string	default-null
///<br/><br/>
///The tooltip allows to display card details in a tooltip while hovering on it.
///<br/>tooltipSettings-TooltipSettings	default-
///<br/><br/>
///To enable or disable the tooltip display.
///<br/>enable-boolean	default-false
///<br/><br/>
///To customize the tooltip display based on your requirements.
///<br/>template-string	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to customizing the user interface (UI) as locale-specific in order to display regional data i.e. in a language and culture specific to a particular country or region.
///<br/>locale-string	default-en-US
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.LinearGauge=function(){};
ej.LinearGauge.prototype={

destroy:function(){
/// <summary>
/// destroy the linear gauge all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
exportImage:function(){
/// <summary>
/// To export Image
/// </summary>
},
getBarDistanceFromScale:function(){
/// <summary>
/// To get Bar Distance From Scale in number
/// </summary>
},
getBarPointerValue:function(){
/// <summary>
/// To get Bar Pointer Value in number
/// </summary>
},
getBarWidth:function(){
/// <summary>
/// To get Bar Width in number
/// </summary>
},
getCustomLabelAngle:function(){
/// <summary>
/// To get CustomLabel Angle in number
/// </summary>
},
getCustomLabelValue:function(){
/// <summary>
/// To get CustomLabel Value in string
/// </summary>
},
getLabelAngle:function(){
/// <summary>
/// To get Label Angle in number
/// </summary>
},
getLabelPlacement:function(){
/// <summary>
/// To get LabelPlacement in number
/// </summary>
},
getLabelStyle:function(){
/// <summary>
/// To get LabelStyle in number
/// </summary>
},
getLabelXDistanceFromScale:function(){
/// <summary>
/// To get Label XDistance From Scale in number
/// </summary>
},
getLabelYDistanceFromScale:function(){
/// <summary>
/// To get PointerValue in number
/// </summary>
},
getMajorIntervalValue:function(){
/// <summary>
/// To get Major Interval Value in number
/// </summary>
},
getMarkerStyle:function(){
/// <summary>
/// To get MarkerStyle in number
/// </summary>
},
getMaximumValue:function(){
/// <summary>
/// To get Maximum Value in number
/// </summary>
},
getMinimumValue:function(){
/// <summary>
/// To get PointerValue in number
/// </summary>
},
getMinorIntervalValue:function(){
/// <summary>
/// To get Minor Interval Value in number
/// </summary>
},
getPointerDistanceFromScale:function(){
/// <summary>
/// To get Pointer Distance From Scale in number
/// </summary>
},
getPointerHeight:function(){
/// <summary>
/// To get PointerHeight in number
/// </summary>
},
getPointerPlacement:function(){
/// <summary>
/// To get Pointer Placement in String
/// </summary>
},
getPointerValue:function(){
/// <summary>
/// To get PointerValue in number
/// </summary>
},
getPointerWidth:function(){
/// <summary>
/// To get PointerWidth in number
/// </summary>
},
getRangeBorderWidth:function(){
/// <summary>
/// To get Range Border Width in number
/// </summary>
},
getRangeDistanceFromScale:function(){
/// <summary>
/// To get Range Distance From Scale in number
/// </summary>
},
getRangeEndValue:function(){
/// <summary>
/// To get Range End Value in number
/// </summary>
},
getRangeEndWidth:function(){
/// <summary>
/// To get Range End Width in number
/// </summary>
},
getRangePosition:function(){
/// <summary>
/// To get Range Position in number
/// </summary>
},
getRangeStartValue:function(){
/// <summary>
/// To get Range Start Value in number
/// </summary>
},
getRangeStartWidth:function(){
/// <summary>
/// To get Range Start Width in number
/// </summary>
},
getScaleBarLength:function(){
/// <summary>
/// To get ScaleBarLength in number
/// </summary>
},
getScaleBarSize:function(){
/// <summary>
/// To get Scale Bar Size in number
/// </summary>
},
getScaleBorderWidth:function(){
/// <summary>
/// To get Scale Border Width in number
/// </summary>
},
getScaleDirection:function(){
/// <summary>
/// To get Scale Direction in number
/// </summary>
},
getScaleLocation:function(){
/// <summary>
/// To get Scale Location in object
/// </summary>
},
getScaleStyle:function(){
/// <summary>
/// To get Scale Style in string
/// </summary>
},
getTickAngle:function(){
/// <summary>
/// To get Tick Angle in number
/// </summary>
},
getTickHeight:function(){
/// <summary>
/// To get Tick Height in number
/// </summary>
},
getTickPlacement:function(){
/// <summary>
/// To get getTickPlacement in number
/// </summary>
},
getTickStyle:function(){
/// <summary>
/// To get Tick Style in string
/// </summary>
},
getTickWidth:function(){
/// <summary>
/// To get Tick Width in number
/// </summary>
},
getTickXDistanceFromScale:function(){
/// <summary>
/// To get get Tick XDistance From Scale in number
/// </summary>
},
getTickYDistanceFromScale:function(){
/// <summary>
/// To get Tick YDistance From Scale in number
/// </summary>
},
scales:function(){
/// <summary>
/// Specifies the scales.
/// </summary>
},
setBarDistanceFromScale:function(){
/// <summary>
/// To set setBarDistanceFromScale
/// </summary>
},
setBarPointerValue:function(){
/// <summary>
/// To set setBarPointerValue
/// </summary>
},
setBarWidth:function(){
/// <summary>
/// To set setBarWidth
/// </summary>
},
setCustomLabelAngle:function(){
/// <summary>
/// To set setCustomLabelAngle
/// </summary>
},
setCustomLabelValue:function(){
/// <summary>
/// To set setCustomLabelValue
/// </summary>
},
setLabelAngle:function(){
/// <summary>
/// To set setLabelAngle
/// </summary>
},
setLabelPlacement:function(){
/// <summary>
/// To set setLabelPlacement
/// </summary>
},
setLabelStyle:function(){
/// <summary>
/// To set setLabelStyle
/// </summary>
},
setLabelXDistanceFromScale:function(){
/// <summary>
/// To set setLabelXDistanceFromScale
/// </summary>
},
setLabelYDistanceFromScale:function(){
/// <summary>
/// To set setLabelYDistanceFromScale
/// </summary>
},
setMajorIntervalValue:function(){
/// <summary>
/// To set setMajorIntervalValue
/// </summary>
},
setMarkerStyle:function(){
/// <summary>
/// To set setMarkerStyle
/// </summary>
},
setMaximumValue:function(){
/// <summary>
/// To set setMaximumValue
/// </summary>
},
setMinimumValue:function(){
/// <summary>
/// To set setMinimumValue
/// </summary>
},
setMinorIntervalValue:function(){
/// <summary>
/// To set setMinorIntervalValue
/// </summary>
},
setPointerDistanceFromScale:function(){
/// <summary>
/// To set setPointerDistanceFromScale
/// </summary>
},
setPointerHeight:function(){
/// <summary>
/// To set PointerHeight
/// </summary>
},
setPointerPlacement:function(){
/// <summary>
/// To set setPointerPlacement
/// </summary>
},
setPointerValue:function(){
/// <summary>
/// To set PointerValue
/// </summary>
},
setPointerWidth:function(){
/// <summary>
/// To set PointerWidth
/// </summary>
},
setRangeBorderWidth:function(){
/// <summary>
/// To set setRangeBorderWidth
/// </summary>
},
setRangeDistanceFromScale:function(){
/// <summary>
/// To set setRangeDistanceFromScale
/// </summary>
},
setRangeEndValue:function(){
/// <summary>
/// To set setRangeEndValue
/// </summary>
},
setRangeEndWidth:function(){
/// <summary>
/// To set setRangeEndWidth
/// </summary>
},
setRangePosition:function(){
/// <summary>
/// To set setRangePosition
/// </summary>
},
setRangeStartValue:function(){
/// <summary>
/// To set setRangeStartValue
/// </summary>
},
setRangeStartWidth:function(){
/// <summary>
/// To set setRangeStartWidth
/// </summary>
},
setScaleBarLength:function(){
/// <summary>
/// To set setScaleBarLength
/// </summary>
},
setScaleBarSize:function(){
/// <summary>
/// To set setScaleBarSize
/// </summary>
},
setScaleBorderWidth:function(){
/// <summary>
/// To set setScaleBorderWidth
/// </summary>
},
setScaleDirection:function(){
/// <summary>
/// To set setScaleDirection
/// </summary>
},
setScaleLocation:function(){
/// <summary>
/// To set setScaleLocation
/// </summary>
},
setScaleStyle:function(){
/// <summary>
/// To set setScaleStyle
/// </summary>
},
setTickAngle:function(){
/// <summary>
/// To set setTickAngle
/// </summary>
},
setTickHeight:function(){
/// <summary>
/// To set setTickHeight
/// </summary>
},
setTickPlacement:function(){
/// <summary>
/// To set setTickPlacement
/// </summary>
},
setTickStyle:function(){
/// <summary>
/// To set setTickStyle
/// </summary>
},
setTickWidth:function(){
/// <summary>
/// To set setTickWidth
/// </summary>
},
setTickXDistanceFromScale:function(){
/// <summary>
/// To set setTickXDistanceFromScale
/// </summary>
},
setTickYDistanceFromScale:function(){
/// <summary>
/// To set setTickYDistanceFromScale
/// </summary>
},
};
jQuery.fn.ejLinearGauge=function(){
this.data("ejLinearGauge",new	ej.LinearGauge());
return this;
};
jQuery.fn.ejLinearGauge = function (options) {
/// <summary><br/>
///The Linear gauge can be easily configured to the DOM element, such as div. you can create a linear gauge with a highly customizable look and feel.<br/><br/>
///Specifies the animationSpeed
///<br/>animationSpeed-number	default-500
///<br/><br/>
///Specifies the backgroundColor for Linear gauge.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the borderColor for Linear gauge.
///<br/>borderColor-string	default-null
///<br/><br/>
///Specifies the animate state
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specifies the animate state for marker pointer
///<br/>enableMarkerPointerAnimation-boolean	default-true
///<br/><br/>
///Specifies the can resize state.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specify frame of linear gauge
///<br/>frame-Frame	default-null
///<br/><br/>
///Specifies the frame background image URL of linear gauge
///<br/>backgroundImageUrl-string	default-null
///<br/><br/>
///Specifies the frame InnerWidth
///<br/>innerWidth-number	default-8
///<br/><br/>
///Specifies the frame OuterWidth
///<br/>outerWidth-number	default-12
///<br/><br/>
///Specifies the height of Linear gauge.
///<br/>height-number	default-400
///<br/><br/>
///Specifies the labelColor for Linear gauge.
///<br/>labelColor-string	default-null
///<br/><br/>
///Specifies the maximum value of Linear gauge.
///<br/>maximum-number	default-100
///<br/><br/>
///Specifies the minimum value of Linear gauge.
///<br/>minimum-number	default-0
///<br/><br/>
///Specifies the orientation for Linear gauge.
///<br/>orientation-string	default-Vertical
///<br/><br/>
///Specify labelPosition value of Linear gauge See OuterCustomLabelPosition
///<br/>outerCustomLabelPosition-ej.datavisualization.LinearGauge.OuterCustomLabelPosition|string	default-bottom
///<br/><br/>
///Specifies the pointerGradient1 for Linear gauge.
///<br/>pointerGradient1-any	default-null
///<br/><br/>
///Specifies the pointerGradient2 for Linear gauge.
///<br/>pointerGradient2-any	default-null
///<br/><br/>
///Specifies the read only state.
///<br/>readOnly-boolean	default-true
///<br/><br/>
///Specifies the scales
///<br/>scales-Array&lt;Scales&gt;	default-null
///<br/><br/>
///Specifies the backgroundColor of the Scale.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the scaleBar Gradient of bar pointer
///<br/>barPointers-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the backgroundColor of bar pointer
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the border of bar pointer
///<br/>border-any	default-null
///<br/><br/>
///Specifies the border Color of bar pointer
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border Width of bar pointer
///<br/>width-number	default-1.5
///<br/><br/>
///Specifies the distanceFromScale of bar pointer
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specifies the scaleBar Gradient of bar pointer
///<br/>gradients-any	default-null
///<br/><br/>
///Specifies the opacity of bar pointer
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the value of bar pointer
///<br/>value-number	default-null
///<br/><br/>
///Specifies the pointer Width of bar pointer
///<br/>width-number	default-width=30
///<br/><br/>
///Specifies the border of the Scale.
///<br/>border-any	default-null
///<br/><br/>
///Specifies the border color of the Scale.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border width of the Scale.
///<br/>width-number	default-1.5
///<br/><br/>
///Specifies the customLabel
///<br/>customLabels-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the label Color in customLabels
///<br/>color-number	default-null
///<br/><br/>
///Specifies the font in customLabels
///<br/>font-any	default-null
///<br/><br/>
///Specifies the fontFamily in customLabels
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Specifies the fontStyle in customLabels. See FontStyle
///<br/>fontStyle-ej.datavisualization.LinearGauge.FontStyle|string	default-Bold
///<br/><br/>
///Specifies the font size in customLabels
///<br/>size-string	default-11px
///<br/><br/>
///Specifies the opacity in customLabels
///<br/>opacity-string	default-0
///<br/><br/>
///Specifies the position in customLabels
///<br/>position-any	default-null
///<br/><br/>
///Specifies the position x in customLabels
///<br/>x-number	default-0
///<br/><br/>
///Specifies the y in customLabels
///<br/>y-number	default-0
///<br/><br/>
///Specifies the positionType in customLabels.See CustomLabelPositionType
///<br/>positionType-any	default-null
///<br/><br/>
///Specifies the textAngle in customLabels
///<br/>textAngle-number	default-0
///<br/><br/>
///Specifies the label Value in customLabels
///<br/>value-string	default-
///<br/><br/>
///Specifies the scale Direction of the Scale. See Directions
///<br/>direction-ej.datavisualization.LinearGauge.Direction|string	default-CounterClockwise
///<br/><br/>
///Specifies the indicator
///<br/>indicators-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the backgroundColor in bar indicators
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the border in bar indicators
///<br/>border-number	default-null
///<br/><br/>
///Specifies the border Color in bar indicators
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border Width in bar indicators
///<br/>width-number	default-1.5
///<br/><br/>
///Specifies the font of bar indicators
///<br/>font-any	default-null
///<br/><br/>
///Specifies the fontFamily of font in bar indicators
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Specifies the fontStyle of font in bar indicators. See FontStyle
///<br/>fontStyle-ej.datavisualization.LinearGauge.FontStyle|string	default-ej.datavisualization.LinearGauge.FontStyle.Bold
///<br/><br/>
///Specifies the size of font in bar indicators
///<br/>size-string	default-11px
///<br/><br/>
///Specifies the indicator Height of bar indicators
///<br/>height-number	default-30
///<br/><br/>
///Specifies the opacity in bar indicators
///<br/>opacity-number	default-NaN
///<br/><br/>
///Specifies the position in bar indicators
///<br/>position-any	default-null
///<br/><br/>
///Specifies the x position in bar indicators
///<br/>x-number	default-0
///<br/><br/>
///Specifies the y position in bar indicators
///<br/>y-number	default-0
///<br/><br/>
///Specifies the state ranges in bar indicators
///<br/>stateRanges-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the backgroundColor in bar indicators state ranges
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the borderColor in bar indicators state ranges
///<br/>borderColor-string	default-null
///<br/><br/>
///Specifies the endValue in bar indicators state ranges
///<br/>endValue-number	default-60
///<br/><br/>
///Specifies the startValue in bar indicators state ranges
///<br/>startValue-number	default-50
///<br/><br/>
///Specifies the text in bar indicators state ranges
///<br/>text-string	default-
///<br/><br/>
///Specifies the textColor in bar indicators state ranges
///<br/>textColor-string	default-null
///<br/><br/>
///Specifies the textLocation in bar indicators
///<br/>textLocation-any	default-null
///<br/><br/>
///Specifies the textLocation position in bar indicators
///<br/>x-number	default-0
///<br/><br/>
///Specifies the Y position in bar indicators
///<br/>y-number	default-0
///<br/><br/>
///Specifies the indicator Style of font in bar indicators
///<br/>type-ej.datavisualization.LinearGauge.IndicatorTypes|string	default-ej.datavisualization.LinearGauge.IndicatorType.Rectangle
///<br/><br/>
///Specifies the indicator Width in bar indicators
///<br/>width-number	default-30
///<br/><br/>
///Specifies the labels.
///<br/>labels-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the angle of labels.
///<br/>angle-number	default-0
///<br/><br/>
///Specifies the DistanceFromScale of labels.
///<br/>distanceFromScale-any	default-null
///<br/><br/>
///Specifies the xDistanceFromScale of labels.
///<br/>x-number	default--10
///<br/><br/>
///Specifies the yDistanceFromScale of labels.
///<br/>y-number	default-0
///<br/><br/>
///Specifies the font of labels.
///<br/>font-any	default-null
///<br/><br/>
///Specifies the fontFamily of font.
///<br/>fontFamily-string	default-Arial
///<br/><br/>
///Specifies the fontStyle of font.See FontStyle
///<br/>fontStyle-ej.datavisualization.LinearGauge.FontStyle|string	default-ej.datavisualization.LinearGauge.FontStyle.Bold
///<br/><br/>
///Specifies the size of font.
///<br/>size-string	default-11px
///<br/><br/>
///need to includeFirstValue.
///<br/>includeFirstValue-boolean	default-true
///<br/><br/>
///Specifies the opacity of label.
///<br/>opacity-number	default-0
///<br/><br/>
///Specifies the label Placement of label. See LabelPlacement
///<br/>placement-ej.datavisualization.LinearGauge.PointerPlacement|string	default-Near
///<br/><br/>
///Specifies the textColor of font.
///<br/>textColor-string	default-null
///<br/><br/>
///Specifies the label Style of label. See LabelType
///<br/>type-ej.datavisualization.LinearGauge.ScaleType|string	default-ej.datavisualization.LinearGauge.LabelType.Major
///<br/><br/>
///Specifies the unitText of label.
///<br/>unitText-string	default-
///<br/><br/>
///Specifies the unitText Position of label.See UnitTextPlacement
///<br/>unitTextPlacement-ej.datavisualization.LinearGauge.UnitTextPlacement|string	default-Back
///<br/><br/>
///Specifies the scaleBar Length.
///<br/>length-number	default-290
///<br/><br/>
///Specifies the majorIntervalValue of the Scale.
///<br/>majorIntervalValue-number	default-10
///<br/><br/>
///Specifies the markerPointers
///<br/>markerPointers-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the backgroundColor of marker pointer
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the border of marker pointer
///<br/>border-any	default-null
///<br/><br/>
///Specifies the border color of marker pointer
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border of marker pointer
///<br/>width-number	default-number
///<br/><br/>
///Specifies the distanceFromScale of marker pointer
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specifies the pointer Gradient of marker pointer
///<br/>gradients-any	default-null
///<br/><br/>
///Specifies the pointer Length of marker pointer
///<br/>length-number	default-30
///<br/><br/>
///Specifies the opacity of marker pointer
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the pointer Placement of marker pointer See PointerPlacement
///<br/>placement-ej.datavisualization.LinearGauge.PointerPlacement|string	default-Far
///<br/><br/>
///Specifies the marker Style of marker pointerSee MarkerType
///<br/>type-ej.datavisualization.LinearGauge.MarkerType|string	default-Triangle
///<br/><br/>
///Specifies the value of marker pointer
///<br/>value-number	default-null
///<br/><br/>
///Specifies the pointer Width of marker pointer
///<br/>width-number	default-30
///<br/><br/>
///Specifies the maximum of the Scale.
///<br/>maximum-number	default-null
///<br/><br/>
///Specifies the minimum of the Scale.
///<br/>minimum-number	default-null
///<br/><br/>
///Specifies the minorIntervalValue of the Scale.
///<br/>minorIntervalValue-number	default-2
///<br/><br/>
///Specifies the opacity of the Scale.
///<br/>opacity-number	default-NaN
///<br/><br/>
///Specifies the position
///<br/>position-any	default-null
///<br/><br/>
///Specifies the Horizontal position
///<br/>x-number	default-50
///<br/><br/>
///Specifies the vertical position
///<br/>y-number	default-50
///<br/><br/>
///Specifies the ranges in the tick.
///<br/>ranges-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the backgroundColor in the ranges.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the border in the ranges.
///<br/>border-any	default-null
///<br/><br/>
///Specifies the border color in the ranges.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the border width in the ranges.
///<br/>width-number	default-1.5
///<br/><br/>
///Specifies the distanceFromScale in the ranges.
///<br/>distanceFromScale-number	default-0
///<br/><br/>
///Specifies the endValue in the ranges.
///<br/>endValue-number	default-60
///<br/><br/>
///Specifies the endWidth in the ranges.
///<br/>endWidth-number	default-10
///<br/><br/>
///Specifies the range Gradient in the ranges.
///<br/>gradients-any	default-null
///<br/><br/>
///Specifies the opacity in the ranges.
///<br/>opacity-number	default-null
///<br/><br/>
///Specifies the range Position in the ranges. See RangePlacement
///<br/>placement-ej.datavisualization.LinearGauge.PointerPlacement|string	default-Center
///<br/><br/>
///Specifies the startValue in the ranges.
///<br/>startValue-number	default-20
///<br/><br/>
///Specifies the startWidth in the ranges.
///<br/>startWidth-number	default-10
///<br/><br/>
///Specifies the shadowOffset.
///<br/>shadowOffset-number	default-0
///<br/><br/>
///Specifies the showBarPointers state.
///<br/>showBarPointers-boolean	default-true
///<br/><br/>
///Specifies the showCustomLabels state.
///<br/>showCustomLabels-boolean	default-false
///<br/><br/>
///Specifies the showIndicators state.
///<br/>showIndicators-boolean	default-false
///<br/><br/>
///Specifies the showLabels state.
///<br/>showLabels-boolean	default-true
///<br/><br/>
///Specifies the showMarkerPointers state.
///<br/>showMarkerPointers-boolean	default-true
///<br/><br/>
///Specifies the showRanges state.
///<br/>showRanges-boolean	default-false
///<br/><br/>
///Specifies the showTicks state.
///<br/>showTicks-boolean	default-true
///<br/><br/>
///Specifies the ticks in the scale.
///<br/>ticks-Array&lt;any&gt;	default-Array
///<br/><br/>
///Specifies the angle in the tick.
///<br/>angle-number	default-0
///<br/><br/>
///Specifies the tick Color in the tick.
///<br/>color-string	default-null
///<br/><br/>
///Specifies the DistanceFromScale in the tick.
///<br/>distanceFromScale-any	default-null
///<br/><br/>
///Specifies the xDistanceFromScale in the tick.
///<br/>x-number	default-0
///<br/><br/>
///Specifies the yDistanceFromScale in the tick.
///<br/>y-number	default-0
///<br/><br/>
///Specifies the tick Height in the tick.
///<br/>height-number	default-10
///<br/><br/>
///Specifies the opacity in the tick.
///<br/>opacity-number	default-0
///<br/><br/>
///Specifies the tick Placement in the tick. See TickPlacement
///<br/>placement-ej.datavisualization.LinearGauge.PointerPlacement|string	default-Near
///<br/><br/>
///Specifies the tick Style in the tick. See TickType
///<br/>type-ej.datavisualization.LinearGauge.TicksType|string	default-MajorInterval
///<br/><br/>
///Specifies the tick Width in the tick.
///<br/>width-number	default-3
///<br/><br/>
///Specifies the scaleBar type .See ScaleType
///<br/>type-ej.datavisualization.LinearGauge.ScaleType|string	default-Rectangle
///<br/><br/>
///Specifies the scaleBar width.
///<br/>width-number	default-30
///<br/><br/>
///Specifies the theme for Linear gauge. See LinearGauge.Themes
///<br/>theme-ej.datavisualization.LinearGauge.Themes|string	default-flatlight
///<br/><br/>
///Specifies the tick Color for Linear gauge.
///<br/>tickColor-string	default-null
///<br/><br/>
///Specify tooltip options of linear gauge
///<br/>tooltip-Tooltip	default-false
///<br/><br/>
///Specify showCustomLabelTooltip value of linear gauge
///<br/>showCustomLabelTooltip-boolean	default-false
///<br/><br/>
///Specify showLabelTooltip value of linear gauge
///<br/>showLabelTooltip-boolean	default-false
///<br/><br/>
///Specify templateID value of linear gauge
///<br/>templateID-string	default-false
///<br/><br/>
///Specifies the value of the Gauge.
///<br/>value-number	default-0
///<br/><br/>
///Specifies the width of Linear gauge.
///<br/>width-number	default-150
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ListBox=function(){};
ej.ListBox.prototype={

addItem:function(listItem, index){
/// <summary>
/// Adds a given list items in the ListBox widget at a specified index. It accepts two parameters.
/// </summary>
/// <param name="listItem"	type="any|string">This can be a list item object (for JSON binding) or a string (for UL and LI rendering). Also we can the specify this as an array of list item object or an array of strings to add multiple items.</param>
/// <param name="index"	type="number">The index value to add the given items at the specified index. If index is not specified, the given items will be added at the end of the list.</param>
},
checkAll:function(){
/// <summary>
/// Checks all the list items in the ListBox widget. It is dependent on showCheckbox property.
/// </summary>
},
checkItemByIndex:function(index){
/// <summary>
/// Checks a list item by using its index. It is dependent on showCheckbox property.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be checked. If index is not specified, the given items will be added at the end of the list.</param>
},
checkItemsByIndices:function(indices){
/// <summary>
/// Checks multiple list items by using its index values. It is dependent on showCheckbox property.
/// </summary>
/// <param name="indices"	type="number[]">Index/Indices of the listbox items to be checked. If index is not specified, the given items will be added at the end of the list.</param>
},
disable:function(){
/// <summary>
/// Disables the ListBox widget.
/// </summary>
},
disableItem:function(text){
/// <summary>
/// Disables a list item by passing the item text as parameter.
/// </summary>
/// <param name="text"	type="string">Text of the listbox item to be disabled.</param>
},
disableItemByIndex:function(index){
/// <summary>
/// Disables a list Item using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be disabled.</param>
},
disableItemsByIndices:function(Indices){
/// <summary>
/// Disables set of list Items using its index values.
/// </summary>
/// <param name="Indices"	type="number[]|string">Indices of the listbox items to be disabled.</param>
},
enable:function(){
/// <summary>
/// Enables the ListBox widget when it is disabled.
/// </summary>
},
enableItem:function(text){
/// <summary>
/// Enables a list Item using its item text value.
/// </summary>
/// <param name="text"	type="string">Text of the listbox item to be enabled.</param>
},
enableItemByIndex:function(index){
/// <summary>
/// Enables a list item using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be enabled.</param>
},
enableItemsByIndices:function(indices){
/// <summary>
/// Enables a set of list Items using its index values.
/// </summary>
/// <param name="indices"	type="number[]|string">Indices of the listbox items to be enabled.</param>
},
getCheckedItems:function(){
/// <summary>
/// Returns the list of checked items in the ListBox widget. It is dependent on showCheckbox property.
/// </summary>
},
getSelectedItems:function(){
/// <summary>
/// Returns the list of selected items in the ListBox widget.
/// </summary>
},
getIndexByText:function(text){
/// <summary>
/// Returns an itemâ€™s index based on the given text.
/// </summary>
/// <param name="text"	type="string">The list item text (label)</param>
},
getIndexByValue:function(indices){
/// <summary>
/// Returns an itemâ€™s index based on the value given.
/// </summary>
/// <param name="indices"	type="string">The list itemâ€™s value</param>
},
getTextByIndex:function(){
/// <summary>
/// Returns an itemâ€™s text (label) based on the index given.
/// </summary>
},
getItemByIndex:function(){
/// <summary>
/// Returns a list itemâ€™s object using its index.
/// </summary>
},
getItemByText:function(text){
/// <summary>
/// Returns a list itemâ€™s object based on the text given.
/// </summary>
/// <param name="text"	type="string">The list item text.</param>
},
mergeData:function(data){
/// <summary>
/// Merges the given data with the existing data items in the listbox.
/// </summary>
/// <param name="data"	type="Array&lt;any&gt;">Data to merge in listbox.</param>
},
moveDown:function(){
/// <summary>
/// Selects the next item based on the current selection.
/// </summary>
},
moveUp:function(){
/// <summary>
/// Selects the previous item based on the current selection.
/// </summary>
},
refresh:function(refreshData){
/// <summary>
/// Refreshes the ListBox widget.
/// </summary>
/// <param name="refreshData"	type="boolean">Refreshes both the datasource and the dimensions of the ListBox widget when the parameter is passed as true, otherwise only the ListBox dimensions will be refreshed.</param>
},
removeAll:function(){
/// <summary>
/// Removes all the list items from listbox.
/// </summary>
},
removeSelectedItems:function(){
/// <summary>
/// Removes the selected list items from the listbox.
/// </summary>
},
removeItemByText:function(text){
/// <summary>
/// Removes a list item by using its text.
/// </summary>
/// <param name="text"	type="string">Text of the listbox item to be removed. </param>
},
removeItemByIndex:function(index){
/// <summary>
/// Removes a list item by using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be removed.</param>
},
selectAll:function(){
/// <summary>
/// 
/// </summary>
},
selectItemByText:function(text){
/// <summary>
/// Selects the list item using its text value.
/// </summary>
/// <param name="text"	type="string">Text of the listbox item to be selected.</param>
},
selectItemByValue:function(value){
/// <summary>
/// Selects list item using its value property.
/// </summary>
/// <param name="value"	type="string">Value of the listbox item to be selected.</param>
},
selectItemByIndex:function(index){
/// <summary>
/// Selects list item using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be selected.</param>
},
selectItemsByIndices:function(Indices){
/// <summary>
/// Selects a set of list items through its index values.
/// </summary>
/// <param name="Indices"	type="number|number[]">Index/Indices of the listbox item to be selected.</param>
},
uncheckAll:function(){
/// <summary>
/// Unchecks all the checked list items in the ListBox widget. To use this method showCheckbox property to be set as true.
/// </summary>
},
uncheckItemByIndex:function(index){
/// <summary>
/// Unchecks a checked list item using its index value. To use this method showCheckbox property to be set as true.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be unchecked.</param>
},
uncheckItemsByIndices:function(indices){
/// <summary>
/// Unchecks the set of checked list items using its index values. To use this method showCheckbox property must be set to true.
/// </summary>
/// <param name="indices"	type="number[]|string">Indices of the listbox item to be unchecked.</param>
},
unselectAll:function(){
/// <summary>
/// 
/// </summary>
},
unselectItemByIndex:function(index){
/// <summary>
/// Unselects a selected list item using its index value
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be unselected.</param>
},
unselectItemByText:function(text){
/// <summary>
/// Unselects a selected list item using its text value.
/// </summary>
/// <param name="text"	type="string">Text of the listbox item to be unselected.</param>
},
unselectItemByValue:function(value){
/// <summary>
/// Unselects a selected list item using its value.
/// </summary>
/// <param name="value"	type="string">Value of the listbox item to be unselected.</param>
},
unselectItemsByIndices:function(indices){
/// <summary>
/// Unselects a set of list items using its index values.
/// </summary>
/// <param name="indices"	type="number[]|string">Indices of the listbox item to be unselected.</param>
},
hideCheckedItems:function(){
/// <summary>
/// Hides all the checked items in the listbox.
/// </summary>
},
showItemByIndices:function(indices){
/// <summary>
/// Shows a set of hidden list Items using its index values.
/// </summary>
/// <param name="indices"	type="number[]|string">Indices of the listbox items to be shown.</param>
},
hideItemsByIndices:function(indices){
/// <summary>
/// Hides a set of list Items using its index values.
/// </summary>
/// <param name="indices"	type="number[]|string">Indices of the listbox items to be hidden.</param>
},
showItemsByValues:function(values){
/// <summary>
/// Shows the hidden list items using its values.
/// </summary>
/// <param name="values"	type="Array&lt;any&gt;">Values of the listbox items to be shown.</param>
},
hideItemsByValues:function(values){
/// <summary>
/// Hides the list item using its values.
/// </summary>
/// <param name="values"	type="Array&lt;any&gt;">Values of the listbox items to be hidden.</param>
},
showItemByValue:function(value){
/// <summary>
/// Shows a hidden list item using its value.
/// </summary>
/// <param name="value"	type="string">Value of the listbox item to be shown.</param>
},
hideItemByValue:function(value){
/// <summary>
/// Hide a list item using its value.
/// </summary>
/// <param name="value"	type="string">Value of the listbox item to be hidden.</param>
},
showItemByIndex:function(index){
/// <summary>
/// Shows a hidden list item using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be shown.</param>
},
hideItemByIndex:function(index){
/// <summary>
/// Hides a list item using its index value.
/// </summary>
/// <param name="index"	type="number">Index of the listbox item to be hidden.</param>
},
show:function(){
/// <summary>
/// 
/// </summary>
},
hide:function(){
/// <summary>
/// Hides the listbox.
/// </summary>
},
hideAllItems:function(){
/// <summary>
/// Hides all the listbox items in the listbox.
/// </summary>
},
showAllItems:function(){
/// <summary>
/// Shows all the listbox items in the listbox.
/// </summary>
},
};
jQuery.fn.ejListBox=function(){
this.data("ejListBox",new	ej.ListBox());
return this;
};
jQuery.fn.ejListBox = function (options) {
/// <summary><br/>
///The ListBox control provides a list of options for users to select from. It is capable of including other HTML elements such as images, textboxes, check box, and radio buttons and so on. It also supports data binding, template options, multi-select options, etc.<br/><br/>
///Enables/disables the dragging behavior of the items in ListBox widget.
///<br/>allowDrag-boolean	default-false
///<br/><br/>
///Accepts the items which are dropped in to it, when it is set to true.
///<br/>allowDrop-boolean	default-false
///<br/><br/>
///Enables or disables multiple selection.
///<br/>allowMultiSelection-boolean	default-false
///<br/><br/>
///Loads the list data on demand via scrolling behavior to improve the applicationâ€™s performance. There are two ways to load data which can be defined using â€œvirtualScrollModeâ€ property.
///<br/>allowVirtualScrolling-boolean	default-false
///<br/><br/>
///Enables or disables the case sensitive search for list item by typing the text (search) value.
///<br/>caseSensitiveSearch-boolean	default-false
///<br/><br/>
///Dynamically populate data of a list box while selecting an item in another list box i.e. rendering child list box based on the item selection in parent list box. This property accepts the id of the child ListBox widget to populate the data.
///<br/>cascadeTo-string	default-null
///<br/><br/>
///Set of list items to be checked by default using its index. It works only when the showCheckbox property is set to true.
///<br/>checkedIndices-Array&lt;any&gt;	default-null
///<br/><br/>
///The root class for the ListBox widget to customize the existing theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Contains the list of data for generating the list items.
///<br/>dataSource-any	default-null
///<br/><br/>
///Enables or disables the ListBox widget.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Enables or disables the search behavior to find the specific list item by typing the text value.
///<br/>enableIncrementalSearch-boolean	default-false
///<br/><br/>
///Allows the current model values to be saved in local storage or browser cookies for state maintenance when it is set to true.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Displays the ListBox widgetâ€™s content from right to left when enabled.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Mapping fields for the data items of the ListBox widget.
///<br/>fields-any	default-null
///<br/><br/>
///Defines the height of the ListBox widget.
///<br/>height-string	default-null
///<br/><br/>
///The number of list items to be shown in the ListBox widget. The remaining list items will be scrollable.
///<br/>itemsCount-number	default-null
///<br/><br/>
///The total number of list items to be rendered in the ListBox widget.
///<br/>totalItemsCount-number	default-null
///<br/><br/>
///The number of list items to be loaded in the list box while enabling virtual scrolling and when virtualScrollMode is set to continuous.
///<br/>itemRequestCount-number	default-5
///<br/><br/>
///Loads data for the listbox by default (i.e. on initialization) when it is set to true. It creates empty ListBox if it is set to false.
///<br/>loadDataOnInit-boolean	default-
///<br/><br/>
///The query to retrieve required data from the data source.
///<br/>query-ej.Query|string	default-ej.Query()
///<br/><br/>
///The list item to be selected by default using its index.
///<br/>selectedIndex-number	default-null
///<br/><br/>
///The list items to be selected by default using its indices. To use this property allowMultiSelection should be enabled.
///<br/>selectedIndices-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables/Disables the multi selection option with the help of checkbox control.
///<br/>showCheckbox-boolean	default-false
///<br/><br/>
///To display the ListBox container with rounded corners.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///The template to display the ListBox widget with customized appearance.
///<br/>template-string	default-null
///<br/><br/>
///Holds the selected items values and used to bind value to the list item using angularJS and knockoutJS.
///<br/>value-number	default-&#226;€œ&#226;€
///<br/><br/>
///Specifies the virtual scroll mode to load the list data on demand via scrolling behavior. There are two types of mode.
///<br/>virtualScrollMode-ej.VirtualScrollMode|string	default-
///<br/><br/>
///Defines the width of the ListBox widget.
///<br/>width-string	default-null
///<br/><br/>
///Specifies the targetID for the listbox items.
///<br/>targetID-string	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ListView=function(){};
ej.ListView.prototype={

addItem:function(item, index){
/// <summary>
/// To add item in the given index.
/// </summary>
/// <param name="item"	type="string">Specifies the item to be added in ListView</param>
/// <param name="index"	type="number">Specifies the index where item to be added</param>
},
checkAllItem:function(){
/// <summary>
/// To check all the items.
/// </summary>
},
checkItem:function(index){
/// <summary>
/// To check item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index of the item to be checked</param>
},
clear:function(){
/// <summary>
/// To clear all the list item in the control before updating with new datasource.
/// </summary>
},
deActive:function(index){
/// <summary>
/// To make the item in the given index to be default state.
/// </summary>
/// <param name="index"	type="number">Specifies the index to make the item to be in default state.</param>
},
disableItem:function(index){
/// <summary>
/// To disable item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to be disabled.</param>
},
enableItem:function(index){
/// <summary>
/// To enable item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to be enabled.</param>
},
getActiveItem:function(){
/// <summary>
/// To get the active item.
/// </summary>
},
getActiveItemText:function(){
/// <summary>
/// To get the text of the active item.
/// </summary>
},
getCheckedItems:function(){
/// <summary>
/// To get all the checked items.
/// </summary>
},
getCheckedItemsText:function(){
/// <summary>
/// To get the text of all the checked items.
/// </summary>
},
getItemsCount:function(){
/// <summary>
/// To get the total item count.
/// </summary>
},
getItemText:function(index){
/// <summary>
/// To get the text of the item in the given index.
/// </summary>
/// <param name="index"	type="string|number">Specifies the index value to get the text value.</param>
},
hasChild:function(index){
/// <summary>
/// To check whether the item in the given index has child item.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to check the item has child or not.</param>
},
hide:function(){
/// <summary>
/// To hide the list.
/// </summary>
},
hideItem:function(index){
/// <summary>
/// To hide item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to hide the item.</param>
},
isChecked:function(){
/// <summary>
/// To check whether item in the given index is checked.
/// </summary>
},
loadAjaxContent:function(item){
/// <summary>
/// To load the AJAX content while selecting the item.
/// </summary>
/// <param name="item"	type="string">Specifies the item to load the AJAX content.</param>
},
removeCheckMark:function(index){
/// <summary>
/// To remove the check mark either for specific item in the given index or for all items.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to remove the checkbox.</param>
},
removeItem:function(index){
/// <summary>
/// To remove item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to remove the item.</param>
},
selectItem:function(index){
/// <summary>
/// To select item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to select the item.</param>
},
setActive:function(index){
/// <summary>
/// To make the item in the given index to be active state.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to make the item in active state.</param>
},
show:function(){
/// <summary>
/// To show the list.
/// </summary>
},
showItem:function(index){
/// <summary>
/// To show item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to show the hided item.</param>
},
unCheckAllItem:function(){
/// <summary>
/// To uncheck all the items.
/// </summary>
},
unCheckItem:function(index){
/// <summary>
/// To uncheck item in the given index.
/// </summary>
/// <param name="index"	type="number">Specifies the index value to uncheck the item.</param>
},
};
jQuery.fn.ejListView=function(){
this.data("ejListView",new	ej.ListView());
return this;
};
jQuery.fn.ejListView = function (options) {
/// <summary><br/>
///The ListView widget builds interactive ListView interface. This control allows you to select an item from a list-like interface and display a set of data items in different layouts or views. Lists are used for displaying data, data navigation, result lists, and data entry.<br/><br/>
///Sets the root class for ListView theme. This cssClass API helps to use custom skinning option for ListView control. By defining the root class using this API, we need to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///Contains the list of data for generating the ListView items.
///<br/>dataSource-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies whether to load AJAX content while selecting item.
///<br/>enableAjax-boolean	default-false
///<br/><br/>
///Specifies whether to enable caching the content.
///<br/>enableCache-boolean	default-false
///<br/><br/>
///Specifies whether to enable check mark for the item.
///<br/>enableCheckMark-boolean	default-false
///<br/><br/>
///Specifies whether to enable the filtering feature to filter the item.
///<br/>enableFiltering-boolean	default-false
///<br/><br/>
///Specifies whether to group the list item.
///<br/>enableGroupList-boolean	default-false
///<br/><br/>
///Specifies to maintain the current model value to browser cookies for state maintenance. While refresh the page, the model value will get apply to the control from browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specifies the field settings to map the datasource.
///<br/>fieldSettings-any	default-
///<br/><br/>
///Specifies the text of the back button in the header.
///<br/>headerBackButtonText-string	default-null
///<br/><br/>
///Specifies the title of the header.
///<br/>headerTitle-string	default-Title
///<br/><br/>
///Specifies the height.
///<br/>height-number	default-null
///<br/><br/>
///Specifies whether to retain the selection of the item.
///<br/>persistSelection-boolean	default-false
///<br/><br/>
///Specifies whether to prevent the selection of the item.
///<br/>preventSelection-boolean	default-false
///<br/><br/>
///Specifies the query to execute with the datasource.
///<br/>query-any	default-null
///<br/><br/>
///Specifies whether need to render the control with the template contents.
///<br/>renderTemplate-boolean	default-false
///<br/><br/>
///Specifies the index of item which need to be in selected state initially while loading.
///<br/>selectedItemIndex-number	default-0
///<br/><br/>
///Specifies whether to show the header.
///<br/>showHeader-boolean	default-true
///<br/><br/>
///Specifies ID of the element contains template contents.
///<br/>templateId-boolean	default-false
///<br/><br/>
///Specifies the width.
///<br/>width-number	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Map=function(){};
ej.Map.prototype={

navigateTo:function(latitude, longitude, level){
/// <summary>
/// Method for navigating to specific shape based on latitude, longitude and zoom level.
/// </summary>
/// <param name="latitude"	type="number">Pass the latitude value for map</param>
/// <param name="longitude"	type="number">Pass the longitude value for map</param>
/// <param name="level"	type="number">Pass the zoom level for map</param>
},
pan:function(direction){
/// <summary>
/// Method to perform map panning
/// </summary>
/// <param name="direction"	type="string">Pass the direction in which map should be panned</param>
},
refresh:function(){
/// <summary>
/// Method to reload the map.
/// </summary>
},
refreshLayers:function(){
/// <summary>
/// Method to reload the shapeLayers with updated values
/// </summary>
},
refreshNavigationControl:function(navigation){
/// <summary>
/// Method to reload the navigation control with updated values.
/// </summary>
/// <param name="navigation"	type="any">Pass the navigation control instance</param>
},
zoom:function(level, isAnimate){
/// <summary>
/// Method to perform map zooming.
/// </summary>
/// <param name="level"	type="number">Pass the zoom level for map to be zoomed</param>
/// <param name="isAnimate"	type="boolean">Pass the boolean value to enable or disable animation while zooming</param>
},
};
jQuery.fn.ejMap=function(){
this.data("ejMap",new	ej.Map());
return this;
};
jQuery.fn.ejMap = function (options) {
/// <summary><br/>
///The map can be easily configured to the DOM element, such as div and can be created with a highly customized look and feel.<br/><br/>
///Specifies the background color for map
///<br/>background-string	default-white
///<br/><br/>
///Specifies the index of the map to determine the shape layer to be displayed
///<br/>baseMapIndex-number	default-0
///<br/><br/>
///Specify the center position where map should be displayed
///<br/>centerPosition-any	default-[0,0]
///<br/><br/>
///Enables or Disables the map animation
///<br/>enableAnimation-boolean	default-false
///<br/><br/>
///Enables or Disables the animation for layer change in map
///<br/>enableLayerChangeAnimation-boolean	default-false
///<br/><br/>
///Enables or Disables the map panning
///<br/>enablePan-boolean	default-true
///<br/><br/>
///Determines whether map need to resize when container is resized
///<br/>enableResize-boolean	default-true
///<br/><br/>
///Enables or Disables the Zooming for map.
///<br/>zoomSettings-ZoomSettings	default-
///<br/><br/>
///Enables or Disables the zooming of map
///<br/>enableZoom-boolean	default-true
///<br/><br/>
///Enables or Disables the zoom on selecting the map shape
///<br/>enableZoomOnSelection-boolean	default-false
///<br/><br/>
///Specifies the zoom factor for map zoom value.
///<br/>factor-number	default-1
///<br/><br/>
///Specifies the zoom level value for which map to be zoomed
///<br/>level-number	default-1
///<br/><br/>
///Specifies the minimum zoomSettings level of the map
///<br/>minValue-number	default-1
///<br/><br/>
///Specifies the maximum zoom level of the map
///<br/>maxValue-number	default-100
///<br/><br/>
///Enables or Disables the navigation control for map to perform zooming and panning on map shapes.
///<br/>navigationControl-NavigationControl	default-
///<br/><br/>
///Set the absolutePosition for navigation control
///<br/>absolutePosition-any	default-{x:0,y:0}
///<br/><br/>
///Specifies the navigation control template for map
///<br/>content-string	default-null
///<br/><br/>
///Set the dockPosition value for navigation control
///<br/>dockPosition-ej.datavisualization.Map.Position|string	default-centerleft
///<br/><br/>
///Enables or Disables the Navigation for handling zooming map
///<br/>enableNavigation-boolean	default-false
///<br/><br/>
///Set the orientation value for navigation control
///<br/>orientation-ej.datavisualization.Map.LabelOrientation|string	default-vertical
///<br/><br/>
///Layer for holding the map shapes
///<br/>layers-Array&lt;Layers&gt;	default-
///<br/><br/>
///to get the type of bing map.
///<br/>bingMapType-ej.datavisualization.Map.BingMapType|string	default-aerial
///<br/><br/>
///Specifies the bubble settings for map
///<br/>bubbleSettings-any	default-
///<br/><br/>
///Specifies the bubble Opacity value of bubbles for shape layer in map
///<br/>bubbleOpacity-number	default-0.9
///<br/><br/>
///Specifies the mouse hover color of the shape layer in map
///<br/>color-string	default-gray
///<br/><br/>
///Specifies the colorMappings of the shape layer in map
///<br/>colorMappings-any	default-null
///<br/><br/>
///Specifies the bubble color valuePath of the shape layer in map
///<br/>colorValuePath-string	default-null
///<br/><br/>
///Specifies the maximum size value of bubbles for shape layer in map
///<br/>maxValue-number	default-20
///<br/><br/>
///Specifies the minimum size value of bubbles for shape layer in map
///<br/>minValue-number	default-10
///<br/><br/>
///Specifies the showBubble visibility status map
///<br/>showBubble-boolean	default-true
///<br/><br/>
///Specifies the tooltip visibility status of the shape layer in map
///<br/>showTooltip-boolean	default-false
///<br/><br/>
///Specifies the bubble tooltip template of the shape layer in map
///<br/>tooltipTemplate-string	default-null
///<br/><br/>
///Specifies the bubble valuePath of the shape layer in map
///<br/>valuePath-string	default-null
///<br/><br/>
///Specifies the datasource for the shape layer
///<br/>dataSource-any	default-
///<br/><br/>
///Specifies the datapath of shape
///<br/>shapeDataPath-string	default-
///<br/><br/>
///Specifies the datapath of shape
///<br/>shapePropertyPath-string	default-
///<br/><br/>
///Enables or disables the shape mouse hover
///<br/>enableMouseHover-boolean	default-false
///<br/><br/>
///Enables or disables the shape selection
///<br/>enableSelection-boolean	default-true
///<br/><br/>
///}
///<br/>key-string	default-null
///<br/><br/>
///Options for enabling and configuring labelSettings labelPath, smartLabelSize, labelLength etc.,
///<br/>labelSettings-any	default-
///<br/><br/>
///enable or disable the enableSmartLabel property
///<br/>enableSmartLabel-boolean	default-false
///<br/><br/>
///set the labelLength property
///<br/>labelLength-number	default-&#39;2&#39;
///<br/><br/>
///set the labelPath property
///<br/>labelPath-string	default-null
///<br/><br/>
///The property specifies wheather to show labels or not.
///<br/>showLabels-boolean	default-false
///<br/><br/>
///set the smartLabelSize property
///<br/>smartLabelSize-ej.datavisualization.Map.LabelSize|string	default-fixed
///<br/><br/>
///Specifies the map type.
///<br/>layerType-ej.datavisualization.Map.LayerType|string	default-&#39;geometry&#39;
///<br/><br/>
///Options for enabling and configuring legendSettings position, height, width, mode, type etc.,
///<br/>legendSettings-any	default-
///<br/><br/>
///Determines whether the legend should be placed outside or inside the map bounds
///<br/>dockOnMap-boolean	default-false
///<br/><br/>
///Determines the legend placement and it is valid only when dockOnMap is true
///<br/>dockPosition-ej.datavisualization.Map.DockPosition|string	default-top
///<br/><br/>
///height value for legend setting
///<br/>height-number	default-0
///<br/><br/>
///to get icon value for legend setting
///<br/>icon-ej.datavisualization.Map.LegendIcons|string	default-rectangle
///<br/><br/>
///icon height value for legend setting
///<br/>iconHeight-number	default-20
///<br/><br/>
///icon Width value for legend setting
///<br/>iconWidth-number	default-20
///<br/><br/>
///set the orientation of legend labels
///<br/>labelOrientation-ej.datavisualization.Map.LabelOrientation|string	default-vertical
///<br/><br/>
///to get leftLabel value for legend setting
///<br/>leftLabel-string	default-null
///<br/><br/>
///to get mode of legend setting
///<br/>LegendMode-ej.datavisualization.Map.LegendMode|string	default-default
///<br/><br/>
///set the position of legend settings
///<br/>position-ej.datavisualization.Map.Position|string	default-topleft
///<br/><br/>
///x position value for legend setting
///<br/>positionX-number	default-0
///<br/><br/>
///y position value for legend setting
///<br/>positionY-number	default-0
///<br/><br/>
///to get rightLabel value for legend setting
///<br/>rightLabel-string	default-null
///<br/><br/>
///Enables or Disables the showLabels
///<br/>showLabels-boolean	default-false
///<br/><br/>
///Enables or Disables the showLegend
///<br/>showLegend-boolean	default-false
///<br/><br/>
///to get title of legend setting
///<br/>title-string	default-null
///<br/><br/>
///to get type of legend setting
///<br/>type-ej.datavisualization.Map.LegendType|string	default-layers
///<br/><br/>
///width value for legend setting
///<br/>width-number	default-0
///<br/><br/>
///Specifies the map items template for shapes.
///<br/>mapItemsTemplate-string	default-
///<br/><br/>
///Specify markers for shape layer.
///<br/>markers-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the map marker template for map layer.
///<br/>markerTemplate-string	default-null
///<br/><br/>
///Specify selectedMapShapes for shape layer
///<br/>selectedMapShapes-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the selection mode of the map. Accepted selection mode values are Default and Multiple.
///<br/>selectionMode-ej.datavisualization.Map.SelectionMode|string	default-default
///<br/><br/>
///Specifies the shape data for the shape layer
///<br/>shapeData-any	default-
///<br/><br/>
///Specifies the shape settings of map layer
///<br/>shapeSettings-any	default-
///<br/><br/>
///Enables or Disables the auto fill colors for shape layer in map. When this property value set to true, shapes will be filled with palette colors.
///<br/>autoFill-boolean	default-false
///<br/><br/>
///Specifies the colorMappings of the shape layer in map
///<br/>colorMappings-any	default-null
///<br/><br/>
///Specifies the shape color palette value of the shape layer in map. Accepted colorPalette values are palette1, palette2, palette3 and custompalette.
///<br/>colorPalette-ej.datavisualization.Map.ColorPalette|string	default-palette1
///<br/><br/>
///Specifies the shape color valuePath of the shape layer in map
///<br/>colorValuePath-string	default-null
///<br/><br/>
///Enables or Disables the gradient colors for map shapes.
///<br/>enableGradient-boolean	default-false
///<br/><br/>
///Specifies the shape fill color of the shape layer in map
///<br/>fill-string	default-#E5E5E5
///<br/><br/>
///Specifies the mouse over width of the shape layer in map
///<br/>highlightBorderWidth-number	default-1
///<br/><br/>
///Specifies the mouse hover color of the shape layer in map
///<br/>highlightColor-string	default-gray
///<br/><br/>
///Specifies the mouse over stroke color of the shape layer in map
///<br/>highlightStroke-string	default-#C1C1C1
///<br/><br/>
///Specifies the shape selection color of the shape layer in map
///<br/>selectionColor-string	default-gray
///<br/><br/>
///Specifies the shape selection stroke color of the shape layer in map
///<br/>selectionStroke-string	default-#C1C1C1
///<br/><br/>
///Specifies the shape selection stroke width of the shape layer in map
///<br/>selectionStrokeWidth-number	default-1
///<br/><br/>
///Specifies the shape stroke color of the shape layer in map
///<br/>stroke-string	default-#C1C1C1
///<br/><br/>
///Specifies the shape stroke thickness value of the shape layer in map
///<br/>strokeThickness-number	default-0.2
///<br/><br/>
///Specifies the shape valuePath of the shape layer in map
///<br/>valuePath-string	default-null
///<br/><br/>
///Shows or hides the map items.
///<br/>showMapItems-boolean	default-false
///<br/><br/>
///Shows or hides the tooltip for shapes
///<br/>showTooltip-boolean	default-false
///<br/><br/>
///Specifies the tooltip template for shapes.
///<br/>tooltipTemplate-string	default-
///<br/><br/>
///Specifies the URL template for the OSM type map.
///<br/>urlTemplate-string	default-&#39;http://a.tile.openstreetmap.org/level/tileX/tileY.png&#39;
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.MaskEdit=function(){};
ej.MaskEdit.prototype={

clear:function(){
/// <summary>
/// To clear the text in mask edit textbox control.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable the mask edit textbox control.
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the mask edit textbox control.
/// </summary>
},
get_StrippedValue:function(){
/// <summary>
/// To obtained the pure value of the text value, removes all the symbols in mask edit textbox control.
/// </summary>
},
get_UnstrippedValue:function(){
/// <summary>
/// To obtained the textbox value as such that, Just replace all '_' to ' '(space) in mask edit textbox control.
/// </summary>
},
};
jQuery.fn.ejMaskEdit=function(){
this.data("ejMaskEdit",new	ej.MaskEdit());
return this;
};
jQuery.fn.ejMaskEdit = function (options) {
/// <summary><br/>
///The MaskEdit control provides an easy and reliable way of collecting user input and displaying standard data in a specific format. Some common uses of the MaskEdit control are IP address editors, phone number editors, and Social Security number editors.<br/><br/>
///Specify the cssClass to achieve custom theme.
///<br/>cssClass-string	default-null
///<br/><br/>
///Specify the custom character allowed to entered in mask edit textbox control.
///<br/>customCharacter-string	default-null
///<br/><br/>
///Specify the state of the mask edit textbox control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specify the enablePersistence to mask edit textbox to save current model value to browser cookies for state maintains.
///<br/>enablePersistence-boolean	default-
///<br/><br/>
///Specifies the height for the mask edit textbox control.
///<br/>height-string	default-28 px
///<br/><br/>
///Specifies whether hide the prompt characters with spaces on blur. Prompt chars will be shown again on focus the textbox.
///<br/>hidePromptOnLeave-boolean	default-false
///<br/><br/>
///Specifies the list of html attributes to be added to mask edit textbox.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specify the inputMode for mask edit textbox control. See InputMode
///<br/>inputMode-ej.InputMode|string	default-ej.InputMode.Text
///<br/><br/>
///Specifies the input mask.
///<br/>maskFormat-string	default-null
///<br/><br/>
///Specifies the name attribute value for the mask edit textbox.
///<br/>name-string	default-null
///<br/><br/>
///Toggles the readonly state of the mask edit textbox. When the mask edit textbox is readonly, it doesn't allow your input.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Specifies whether the error will show until correct value entered in the mask edit textbox control.
///<br/>showError-boolean	default-false
///<br/><br/>
///MaskEdit input is displayed in rounded corner style when this property is set to true.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specify the text alignment for mask edit textbox control.See TextAlign
///<br/>textAlign-ej.TextAlign|string	default-left
///<br/><br/>
///Sets the jQuery validation error message in mask edit. This property works when the widget is present inside the form. Include jquery.validate.min.js plugin additionally.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Sets the jQuery validation rules to the MaskEdit. This property works when the widget is present inside the form. Include jquery.validate.min.js plugin additionally.
///<br/>validationRules-any	default-null
///<br/><br/>
///Specifies the value for the mask edit textbox control.
///<br/>value-string	default-null
///<br/><br/>
///Specifies the water mark text to be displayed in input text.
///<br/>watermarkText-string	default-null
///<br/><br/>
///Specifies the width for the mask edit textbox control.
///<br/>width-string	default-143pixel
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Menu=function(){};
ej.Menu.prototype={

disable:function(){
/// <summary>
/// Disables the Menu control.
/// </summary>
},
disableItem:function(itemtext){
/// <summary>
/// Specifies the Menu Item to be disabled by using the Menu Item Text.
/// </summary>
/// <param name="itemtext"	type="string">Specifies the Menu Item Text to be disabled.</param>
},
disableItembyID:function(itemid){
/// <summary>
/// Specifies the Menu Item to be disabled by using the Menu Item Id.
/// </summary>
/// <param name="itemid"	type="string|number">Specifies the Menu Item id to be disabled</param>
},
enable:function(){
/// <summary>
/// Enables the Menu control.
/// </summary>
},
enableItem:function(itemtext){
/// <summary>
/// Specifies the Menu Item to be enabled by using the Menu Item Text.
/// </summary>
/// <param name="itemtext"	type="string">Specifies the Menu Item Text to be enabled.</param>
},
enableItembyID:function(itemid){
/// <summary>
/// Specifies the Menu Item to be enabled by using the Menu Item Id.
/// </summary>
/// <param name="itemid"	type="string|number">Specifies the Menu Item id to be enabled.</param>
},
hide:function(){
/// <summary>
/// Hides the Context Menu control.
/// </summary>
},
hideItems:function(){
/// <summary>
/// Hides the specific items in Menu control.
/// </summary>
},
insert:function(item, target){
/// <summary>
/// Insert the menu item as child of target node.
/// </summary>
/// <param name="item"	type="any">Information about Menu item.</param>
/// <param name="target"	type="string|any">Selector of target node or Object of target node.</param>
},
insertAfter:function(item, target){
/// <summary>
/// Insert the menu item after the target node.
/// </summary>
/// <param name="item"	type="any">Information about Menu item.</param>
/// <param name="target"	type="string|any">Selector of target node or Object of target node.</param>
},
insertBefore:function(item, target){
/// <summary>
/// Insert the menu item before the target node.
/// </summary>
/// <param name="item"	type="any">Information about Menu item.</param>
/// <param name="target"	type="string|any">Selector of target node or Object of target node.</param>
},
remove:function(target){
/// <summary>
/// Remove Menu item.
/// </summary>
/// <param name="target"	type="any|Array&lt;any&gt;">Selector of target node or Object of target node.</param>
},
show:function(locationX, locationY, targetElement, event){
/// <summary>
/// To show the Menu control.
/// </summary>
/// <param name="locationX"	type="number">x co-ordinate position of context menu.</param>
/// <param name="locationY"	type="number">y co-ordinate position of context menu.</param>
/// <param name="targetElement"	type="any">target element</param>
/// <param name="event"	type="any">name of the event</param>
},
showItems:function(){
/// <summary>
/// Show the specific items in Menu control.
/// </summary>
},
};
jQuery.fn.ejMenu=function(){
this.data("ejMenu",new	ej.Menu());
return this;
};
jQuery.fn.ejMenu = function (options) {
/// <summary><br/>
///The Menu control supports displaying a Menu created from list items. The Menu is based on a hierarchy of UL and LI elements where the list items are rendered as sub-menu items.<br/><br/>
///To enable or disable the Animation while hover or click an menu items.See AnimationType
///<br/>animationType-ej.AnimationType|string	default-ej.AnimationType.Default
///<br/><br/>
///Specifies the target id of context menu. On right clicking the specified contextTarget element, context menu gets shown.
///<br/>contextMenuTarget-string	default-null
///<br/><br/>
///Specify the CSS class to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///To enable or disable the Animation effect while hover or click an menu items.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specifies the root menu items to be aligned center in horizontal menu.
///<br/>enableCenterAlign-boolean	default-false
///<br/><br/>
///Enable / Disable the Menu control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies the menu items to be displayed in right to left direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///When this property sets to false, the menu items is displayed without any separators.
///<br/>enableSeparator-boolean	default-true
///<br/><br/>
///Specifies the target which needs to be excluded. i.e., The context menu will not be displayed in those specified targets.
///<br/>excludeTarget-string	default-null
///<br/><br/>
///Fields used to bind the data source and it includes following field members to make data bind easier.
///<br/>fields-Fields	default-null
///<br/><br/>
///It receives the child data for the inner level.
///<br/>child-any	default-
///<br/><br/>
///It receives datasource as Essential DataManager object and JSON object.
///<br/>dataSource-any	default-
///<br/><br/>
///Specifies the hTML attributes to â€œliâ€ item list.
///<br/>htmlAttribute-string	default-
///<br/><br/>
///Specifies the id to menu items list
///<br/>id-string	default-
///<br/><br/>
///Specifies the image attribute to â€œimgâ€ tag inside items list.
///<br/>imageAttribute-string	default-
///<br/><br/>
///Specifies the image URL to â€œimgâ€ tag inside item list.
///<br/>imageUrl-string	default-
///<br/><br/>
///Adds custom attributes like "target" to the anchor tag of the menu items.
///<br/>linkAttribute-string	default-
///<br/><br/>
///Specifies the parent id of the table.
///<br/>parentId-string	default-
///<br/><br/>
///It receives query to retrieve data from the table (query is same as SQL).
///<br/>query-any	default-
///<br/><br/>
///Specifies the sprite CSS class to â€œliâ€ item list.
///<br/>spriteCssClass-string	default-
///<br/><br/>
///It receives table name to execute query on the corresponding table.
///<br/>tableName-string	default-
///<br/><br/>
///Specifies the text of menu items list.
///<br/>text-string	default-
///<br/><br/>
///Specifies the URL to the anchor tag in menu item list.
///<br/>url-string	default-
///<br/><br/>
///Specifies the height of the root menu.
///<br/>height-string|number	default-auto
///<br/><br/>
///Specifies the list of HTML attributes to be added to menu control.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the type of the menu. Essential JavaScript Menu consists of two type of menu, they are Normal Menu and Context Menu mode.See MenuType
///<br/>menuType-string|ej.MenuType	default-ej.MenuType.NormalMenu
///<br/><br/>
///Specifies the sub menu items to be show or open only on click.
///<br/>openOnClick-boolean	default-false
///<br/><br/>
///Specifies the orientation of normal menu. Normal menu can rendered in horizontal or vertical direction by using this API. See Orientation
///<br/>orientation-ej.Orientation|string	default-ej.Orientation.Horizontal
///<br/><br/>
///Specifies the main menu items arrows only to be shown if it contains child items.
///<br/>showRootLevelArrows-boolean	default-true
///<br/><br/>
///Specifies the sub menu items arrows only to be shown if it contains child items.
///<br/>showSubLevelArrows-boolean	default-true
///<br/><br/>
///Specifies position of pull down submenus that will appear on mouse over.See Direction
///<br/>subMenuDirection-string|ej.Direction	default-ej.Direction.Right
///<br/><br/>
///Specifies the title to responsive menu.
///<br/>titleText-string	default-Menu
///<br/><br/>
///Specifies the width of the main menu.
///<br/>width-string|number	default-auto
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.NavigationDrawer=function(){};
ej.NavigationDrawer.prototype={

close:function(){
/// <summary>
/// To close the navigation drawer control
/// </summary>
},
open:function(){
/// <summary>
/// To open the navigation drawer control
/// </summary>
},
toggle:function(){
/// <summary>
/// To Toggle the navigation drawer control
/// </summary>
},
};
jQuery.fn.ejNavigationDrawer=function(){
this.data("ejNavigationDrawer",new	ej.NavigationDrawer());
return this;
};
jQuery.fn.ejNavigationDrawer = function (options) {
/// <summary><br/>
///The Navigation Drawer is a sliding panel that displays the list of navigation options on demand. That is, by default, it is not visible but you can display it onto the left/right side of the screen by swiping or by clicking with desired target icon.<br/><br/>
///Specifies the contentId for navigation drawer, where the AJAX content need to updated
///<br/>contentId-string	default-null
///<br/><br/>
///Sets the root class for NavigationDrawer theme. This cssClass API helps to use custom skinning option for NavigationDrawer control. By defining the root class using this API, we need to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///Sets the Direction for the control. See Direction
///<br/>direction-ej.Direction|string	default-left
///<br/><br/>
///Sets the listview to be enabled or not
///<br/>enableListView-boolean	default-false
///<br/><br/>
///Specifies the listview items as an array of object.
///<br/>items-Array&lt;any&gt;	default-[]
///<br/><br/>
///Sets all the properties of listview to render in navigation drawer
///<br/>listViewSettings-any	default-
///<br/><br/>
///Specifies position whether it is in fixed or relative to the page. See Position
///<br/>position-string	default-normal
///<br/><br/>
///Specifies the targetId for navigation drawer
///<br/>targetId-string	default-
///<br/><br/>
///Sets the rendering type of the control. See Type
///<br/>type-string	default-overlay
///<br/><br/>
///Specifies the width of the control
///<br/>width-number	default-auto
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.OlapBase=function(){};
ej.OlapBase.prototype={

getJSONData:function(){
/// <summary>
/// This function gets the datasource, action and grid layout for rendering the PivotGrid.
/// </summary>
},
};
jQuery.fn.ejOlapBase=function(){
this.data("ejOlapBase",new	ej.OlapBase());
return this;
};
jQuery.fn.ejOlapBase = function (options) {
/// <summary><br/>
///Support has been provided in PivotGrid to load OLAP Cube information at client-side directly through XML/A.</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.OlapClient=function(){};
ej.OlapClient.prototype={

doAjaxPost:function(){
/// <summary>
/// Perform an asynchronous HTTP (AJAX) request.
/// </summary>
},
doPostBack:function(){
/// <summary>
/// Perform an asynchronous HTTP (FullPost) submit.
/// </summary>
},
};
jQuery.fn.ejOlapClient=function(){
this.data("ejOlapClient",new	ej.OlapClient());
return this;
};
jQuery.fn.ejOlapClient = function (options) {
/// <summary><br/>
///OlapClient is an ad hoc analysis tool that can be easily bound to any OLAP datasource to provide a visual presentation of the information retrieved from multidimensional data.<br/><br/>
///Allows the user to set the specific chart type for OlapChart.
///<br/>chartType-ej.olap.OlapChart.ChartTypes|string	default-ej.olap.OlapChart.ChartTypes.Column
///<br/><br/>
///Sets the mode to export the OLAP visualization components such as OlapChart and PivotGrid in OlapClient. Based on the option, either Chart or Grid or both gets exported.
///<br/>clientExportMode-string	default-ej.olap.OlapClient.ClientExportMode.ChartAndGrid
///<br/><br/>
///Specifies the CSS class to OlapClient to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Object utilized to pass additional information between client-end and service-end.
///<br/>customObject-any	default-{}
///<br/><br/>
///Allows the user to customize the widgets layout and appearance.
///<br/>displaySettings-DisplaySettings	default-{}
///<br/><br/>
///Letâ€™s the user to customize the display of OlapChart and PivotGrid widgets, either in tab view or in tile view.
///<br/>controlPlacement-ej.olap.OlapClient.ControlPlacement|string	default-ej.olap.OlapClient.ControlPlacement.Tab
///<br/><br/>
///Letâ€™s the user to set either Chart or Grid as the start-up widget.
///<br/>defaultView-ej.olap.OlapClient.DefaultView|string	default-ej.olap.OlapClient.DefaultView.Grid
///<br/><br/>
///Enables/disables the full screen view of OlapChart and PivotGrid in OlapClient.
///<br/>enableFullScreen-boolean	default-false
///<br/><br/>
///Enhances the space for PivotGrid and OlapChart, by hiding Cube Browser and Axis Element Builder.
///<br/>enableTogglePanel-boolean	default-false
///<br/><br/>
///Allows the user to enable OlapClientâ€™s responsiveness in the browser layout.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Sets the display mode (Only Chart/Only Grid/Both) in OlapClient.
///<br/>mode-ej.olap.OlapClient.DisplayMode|string	default-ej.olap.OlapClient.DisplayMode.ChartAndGrid
///<br/><br/>
///Allows the user to refresh the control on-demand and not during every UI operation.
///<br/>enableDeferUpdate-boolean	default-false
///<br/><br/>
///Enables/disables the visibility of measure group selector drop-down in Cube Browser.
///<br/>enableMeasureGroups-boolean	default-false
///<br/><br/>
///Sets the summary layout for PivotGrid. Following are the ways in which summary can be positioned: normal summary (bottom), top summary, no summary and excel-like summary.
///<br/>gridLayout-ej.PivotGrid.Layout|string	default-ej.PivotGrid.Layout.Normal
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Allows the user to set custom name for the methods at service-end, communicated during AJAX post.
///<br/>serviceMethodSettings-ServiceMethodSettings	default-{}
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating the entire report and widget, while changing the Cube.
///<br/>cubeChanged-string	default-CubeChanged
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for exporting.
///<br/>exportOlapClient-string	default-Export
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible to get the members, for the tree-view inside member-editor dialog.
///<br/>fetchMemberTreeNodes-string	default-FetchMemberTreeNodes
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for fetching the report names from the database.
///<br/>fetchReportList-string	default-FetchReportListFromDB
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating report while filtering members.
///<br/>filterElement-string	default-FilterElement
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for initializing OlapClient.
///<br/>initialize-string	default-InitializeClient
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for loading the report collection from the database.
///<br/>loadReport-string	default-LoadReportFromDB
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for retrieving the MDX query for the current report.
///<br/>mdxQuery-string	default-GetMDXQuery
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating the tree-view inside Cube Browser, while changing the measure group.
///<br/>measureGroupChanged-string	default-MeasureGroupChanged
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible to get the child members, on tree-view node expansion.
///<br/>memberExpand-string	default-MemberExpanded
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating report while dropping a node/SplitButton inside Axis Element Builder.
///<br/>nodeDropped-string	default-NodeDropped
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating report while removing SplitButton from Axis Element Builder.
///<br/>removeSplitButton-string	default-RemoveSplitButton
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for saving the report collection to database.
///<br/>saveReport-string	default-SaveReportToDB
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for toggling the elements in row and column axes.
///<br/>toggleAxis-string	default-ToggleAxis
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for any toolbar operation.
///<br/>toolbarServices-string	default-ToolbarOperations
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for updating report collection.
///<br/>updateReport-string	default-UpdateReport
///<br/><br/>
///Sets the title for OlapClient widget.
///<br/>title-string	default-null
///<br/><br/>
///Connects the service using the specified URL for any server updates.
///<br/>url-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Overview=function(){};
ej.Overview.prototype={

};
jQuery.fn.ejOverview=function(){
this.data("ejOverview",new	ej.Overview());
return this;
};
jQuery.fn.ejOverview = function (options) {
/// <summary><br/>
///Overview control allows you to see a preview or an overall view of the entire content of a Diagram. This helps you to look at the overall picture of a large Diagram and also to navigate, pan, or zoom, on a particular position of the page.<br/><br/>
///The sourceId property of overview should be set with the corresponding Diagram ID for you need the overall view.
///<br/>sourceID-string	default-null
///<br/><br/>
///Defines the height of the overview
///<br/>height-number	default-400
///<br/><br/>
///Defines the width of the overview
///<br/>width-number	default-250
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Pager=function(){};
ej.Pager.prototype={

gotoPage:function(){
/// <summary>
/// Send a paging request to specified page through the pagerControl.
/// </summary>
},
};
jQuery.fn.ejPager=function(){
this.data("ejPager",new	ej.Pager());
return this;
};
jQuery.fn.ejPager = function (options) {
/// <summary><br/>
///Custom Design for HTML Pager control.<br/><br/>
///Gets or sets a value that indicates whether to define the number of records displayed per page.
///<br/>pageSize-number	default-12
///<br/><br/>
///Gets or sets a value that indicates whether to define the number of pages displayed in the pager for navigation.
///<br/>pageCount-number	default-10
///<br/><br/>
///Gets or sets a value that indicates whether to define which page to display currently in pager.
///<br/>currentPage-number	default-1
///<br/><br/>
///Get or sets a value of total number of pages in the pager. The totalPages value is calculated based on page size and total records.
///<br/>totalPages-number	default-null
///<br/><br/>
///Get the value of total number of records which is bound to a data item.
///<br/>totalRecordsCount-number	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to pass the current page information as a query string along with the URL while navigating to other page.
///<br/>enableQueryString-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to customizing the user interface (UI) as locale-specific in order to display regional data i.e. in a language and culture specific to a particular country or region.
///<br/>locale-string	default-en-US
///<br/><br/>
///Align content in the pager control from right to left by setting the property as true.
///<br/>enableRTL-boolean	default-false
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PdfViewer=function(){};
ej.PdfViewer.prototype={

goToPage:function(){
/// <summary>
/// Navigates to the specific page in the PDF document. If the page is not available for the given pageNumber, PDF viewer retains the existing page in view.
/// </summary>
},
goToLastPage:function(){
/// <summary>
/// Navigates to the last page of the PDF document.
/// </summary>
},
goToFirstPage:function(){
/// <summary>
/// Navigates to the first page of PDF document.
/// </summary>
},
goToNextPage:function(){
/// <summary>
/// Navigates to the next page of the PDF document.
/// </summary>
},
goToPreviousPage:function(){
/// <summary>
/// Navigates to the previous page of the PDF document.
/// </summary>
},
showPageNavigationTools:function(){
/// <summary>
/// Shows/hides the page navigation tools in the toolbar
/// </summary>
},
showMagnificationTools:function(){
/// <summary>
/// Shows/hides the zoom tools in the tool bar.
/// </summary>
},
showToolbar:function(){
/// <summary>
/// Shows/hides the tool bar in the PDF viewer.
/// </summary>
},
load:function(){
/// <summary>
/// Loads the document with the filename and displays it in PDF viewer.
/// </summary>
},
fitToPage:function(){
/// <summary>
/// Scales the page to fit the page in the container in the control.
/// </summary>
},
fitToWidth:function(){
/// <summary>
/// Scales the page to fit the page width to the width of the container in the control.
/// </summary>
},
zoomIn:function(){
/// <summary>
/// Magnifies the page to the next value in the zoom drop down list.
/// </summary>
},
zoomOut:function(){
/// <summary>
/// Shrinks the page to the previous value in the magnification in the drop down list.
/// </summary>
},
zoomTo:function(){
/// <summary>
/// Scales the page to the specified percentage ranging from 50 to 400. If the given zoomValue is less than 50 or greater than 400; the PDF viewer scales the page to 50 and 400 respectively.
/// </summary>
},
};
jQuery.fn.ejPdfViewer=function(){
this.data("ejPdfViewer",new	ej.PdfViewer());
return this;
};
jQuery.fn.ejPdfViewer = function (options) {
/// <summary><br/>
///PDF viewer JS is visualization component to view PDF documents. It is powered by HTML5/JavaScript and provides various control customizations.<br/><br/>
///Specifies the locale information of the PDF viewer.
///<br/>locale-string	default-
///<br/><br/>
///Specifies the toolbar settings.
///<br/>toolbarSettings-ToolbarSettings	default-
///<br/><br/>
///Shows or hides the tooltip of the toolbar items.
///<br/>showToolTip-boolean	default-
///<br/><br/>
///Shows or hides the grouped items in the toolbar with the help of enum ej.PdfViewer.ToolbarItems
///<br/>toolbarItems-ej.PdfViewer.ToolbarItems|string	default-
///<br/><br/>
///Sets the PDF Web API service URL
///<br/>serviceUrl-string	default-
///<br/><br/>
///Gets the total number of pages in PDF document.
///<br/>pageCount-number	default-
///<br/><br/>
///Gets the number of the page being displayed in the PDF Viewer.
///<br/>currentPageNumber-number	default-
///<br/><br/>
///Gets the current zoom percentage of the PDF document in viewer.
///<br/>zoomPercentage-number	default-
///<br/><br/>
///Specifies the location of the supporting PDF service
///<br/>pdfService-ej.PdfViewer.PdfService|string	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PivotChart=function(){};
ej.PivotChart.prototype={

doAjaxPost:function(){
/// <summary>
/// Perform an asynchronous HTTP (AJAX) request.
/// </summary>
},
doPostBack:function(){
/// <summary>
/// Perform an asynchronous HTTP (FullPost) submit.
/// </summary>
},
exportPivotChart:function(){
/// <summary>
/// Exports the PivotChart to an appropriate format based on the parameter passed.
/// </summary>
},
renderChartFromJSON:function(){
/// <summary>
/// This function receives the JSON formatted datasource to render the PivotChart control.
/// </summary>
},
renderControlSuccess:function(){
/// <summary>
/// This function receives the update from service-end, which would be utilized for rendering the widget.
/// </summary>
},
};
jQuery.fn.ejPivotChart=function(){
this.data("ejPivotChart",new	ej.PivotChart());
return this;
};
jQuery.fn.ejPivotChart = function (options) {
/// <summary><br/>
///The PivotChart is a lightweight control that reads OLAP information and visualizes it in graphical format with the ability to drill up and down.<br/><br/>
///Sets the mode for the PivotChart widget for binding either OLAP or Relational data source.
///<br/>analysisMode-any	default-ej.PivotChart.AnalysisMode.Olap
///<br/><br/>
///Specifies the CSS class to PivotChart to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Options available to configure the properties of entire series. You can also override the options for specific series by using series collection.
///<br/>commonSeriesOptions-any	default-{}
///<br/><br/>
///Contains the serialized OlapReport at that instant, that is, current OlapReport.
///<br/>currentReport-string	default-&#226;€œ&#226;€
///<br/><br/>
///Initializes the data source for the PivotChart widget, when it functions completely on client-side.
///<br/>dataSource-DataSource	default-{}
///<br/><br/>
///Contains the database name as string type to fetch the data from the given connection string.
///<br/>catalog-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items to be arranged in column section of PivotChart.
///<br/>columns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Contains the respective Cube name as string type.
///<br/>cube-string	default-&#226;€œ&#226;€
///<br/><br/>
///Provides the raw data source for the PivotChart.
///<br/>data-any	default-null
///<br/><br/>
///Lists out the items to be arranged in row section of PivotChart.
///<br/>rows-Array&lt;any&gt;	default-[]
///<br/><br/>
///Lists out the items which supports calculation in PivotChart.
///<br/>values-Array&lt;any&gt;	default-[]
///<br/><br/>
///This holds the measures unique names to bind the measures from Cube.
///<br/>measures-Array&lt;any&gt;	default-[]
///<br/><br/>
///To set the axis name in-order to place the measures.
///<br/>axis-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items which supports filtering of values in PivotChart.
///<br/>filters-Array&lt;any&gt;	default-[]
///<br/><br/>
///Object utilized to pass additional information between client-end and service-end.
///<br/>customObject-any	default-{}
///<br/><br/>
///Allows the user to enable 3D view of PivotChart.
///<br/>enable3D-boolean	default-false
///<br/><br/>
///Allows the user to enable PivotChartâ€™s responsiveness in the browser layout.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Options available to customize the legend items and its title.
///<br/>legend-any	default-{}
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the mode for the PivotChart widget for binding data source either in server-side or client-side.
///<br/>operationalMode-any	default-ej.PivotChart.OperationalMode.ClientMode
///<br/><br/>
///This is a horizontal axis that contains options to configure axis and it is the primary x axis for all the series in series array. To override x axis for particular series, create an axis object by providing unique name by using name property and add it to axes array. Then, assign the name to the seriesâ€™s xAxisName property to link both axis and series.
///<br/>primaryXAxis-any	default-{}
///<br/><br/>
///This is a vertical axis that contains options to configure axis. This is the primary y axis for all the series in series array. To override y axis for particular series, create an axis object by providing unique name by using name property and add it to axes array. Then, assign the name to the seriesâ€™s yAxisName property to link both axis and series.
///<br/>primaryYAxis-any	default-{}
///<br/><br/>
///Allows the user to rotate the angle of PivotChart in 3D view.
///<br/>rotation-number	default-0
///<br/><br/>
///Allows the user to set custom name for the methods at service-end, communicated on AJAX post.
///<br/>serviceMethodSettings-ServiceMethodSettings	default-{}
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for drilling up/down operation in PivotChart.
///<br/>drillDown-string	default-DrillChart
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for exporting.
///<br/>exportPivotChart-string	default-Export
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for initializing PivotChart.
///<br/>initialize-string	default-InitializeChart
///<br/><br/>
///Options to customize the Chart size.
///<br/>size-any	default-{}
///<br/><br/>
///Connects the service using the specified URL for any server updates.
///<br/>url-string	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PivotGauge=function(){};
ej.PivotGauge.prototype={

doAjaxPost:function(){
/// <summary>
/// Perform an asynchronous HTTP (AJAX) request.
/// </summary>
},
refresh:function(){
/// <summary>
/// This function is used to refresh the PivotGauge at client-side itself.
/// </summary>
},
removeImg:function(){
/// <summary>
/// This function removes the KPI related images from PivotGauge.
/// </summary>
},
renderControlFromJSON:function(){
/// <summary>
/// This function receives the JSON formatted datasource to render the PivotGauge control.
/// </summary>
},
};
jQuery.fn.ejPivotGauge=function(){
this.data("ejPivotGauge",new	ej.PivotGauge());
return this;
};
jQuery.fn.ejPivotGauge = function (options) {
/// <summary><br/>
///The PivotGauge control is ideal for highlighting business critical Key Performance Indicator (KPI) information in executive dashboards and report cards. The PivotGauge let you present values against goals in a very intuitive manner.<br/><br/>
///Specifies the background color of pivot gauge.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Sets the number of column count to arrange the PivotGauge's.
///<br/>columnsCount-number	default-0
///<br/><br/>
///Specify the CSS class to PivotGauge to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Object utilized to pass additional information between client-end and service-end.
///<br/>customObject-any	default-{}
///<br/><br/>
///Initializes the data source for the PivotGauge widget, when it functions completely on client-side.
///<br/>dataSource-DataSource	default-{}
///<br/><br/>
///Contains the database name as string type to fetch the data from the given connection string.
///<br/>catalog-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items to be arranged in column section of PivotGauge.
///<br/>columns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Contains the respective Cube name as string type.
///<br/>cube-string	default-&#226;€œ&#226;€
///<br/><br/>
///Provides the raw data source for the PivotGauge.
///<br/>data-any	default-null
///<br/><br/>
///Lists out the items to be arranged in row section of PivotGauge.
///<br/>rows-Array&lt;any&gt;	default-[]
///<br/><br/>
///Lists out the items which supports calculation in PivotGauge.
///<br/>values-Array&lt;any&gt;	default-[]
///<br/><br/>
///This holds the measures unique names to bind the measures from Cube.
///<br/>measures-Array&lt;any&gt;	default-[]
///<br/><br/>
///To set the axis name in-order to place the measures.
///<br/>axis-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items which supports filtering of values in PivotGauge.
///<br/>filters-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables/disables tooltip visibility in PivotGauge.
///<br/>enableTooltip-boolean	default-false
///<br/><br/>
///Allows the user to enable PivotGaugeâ€™s responsiveness in the browser layout.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Allows the user to change the format of the label values in PivotGauge.
///<br/>labelFormatSettings-ej.olap.PivotGauge.NumberFormat|string	default-ej.olap.PivotGauge.NumberFormat.Default
///<br/><br/>
///Allows the user to change the number format of the label values in PivotGauge.
///<br/>numberFormat-ej.olap.PivotGauge.NumberFormat|string	default-ej.olap.PivotGauge.NumberFormat.Default
///<br/><br/>
///Allows you to change the position of a digit on the right-hand side of the decimal point for label value.
///<br/>decimalPlaces-number	default-5
///<br/><br/>
///Allows you to add a text at the beginning of the label.
///<br/>prefixText-string	default-
///<br/><br/>
///Allows you to add text at the end of the label.
///<br/>suffixText-string	default-
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the number of row count to arrange the PivotGauge's.
///<br/>rowsCount-number	default-0
///<br/><br/>
///Sets the scale values such as pointers, indicators, etc... for PivotGauge.
///<br/>scales-any	default-{}
///<br/><br/>
///Allows the user to set the custom name for the methods at service-end, communicated during AJAX post.
///<br/>serviceMethodSettings-ServiceMethodSettings	default-{}
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for initializing PivotGauge.
///<br/>initialize-string	default-InitializeGauge
///<br/><br/>
///Enables/disables the header labels in PivotGauge.
///<br/>showHeaderLabel-boolean	default-true
///<br/><br/>
///Connects the service using the specified URL for any server updates.
///<br/>url-string	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PivotGrid=function(){};
ej.PivotGrid.prototype={

doAjaxPost:function(){
/// <summary>
/// Perform an asynchronous HTTP (AJAX) request.
/// </summary>
},
doPostBack:function(){
/// <summary>
/// Perform an asynchronous HTTP (FullPost) submit.
/// </summary>
},
exportPivotGrid:function(){
/// <summary>
/// Exports the PivotGrid to an appropriate format based on the parameter passed.
/// </summary>
},
refreshPagedPivotGrid:function(){
/// <summary>
/// This function re-renders the PivotGrid on clicking the navigation buttons on PivotPager.
/// </summary>
},
renderControlFromJSON:function(){
/// <summary>
/// This function receives the JSON formatted datasource to render the PivotGrid control.
/// </summary>
},
};
jQuery.fn.ejPivotGrid=function(){
this.data("ejPivotGrid",new	ej.PivotGrid());
return this;
};
jQuery.fn.ejPivotGrid = function (options) {
/// <summary><br/>
///The PivotGrid control is easily configurable, presentation-quality business control that reads OLAP data from a Microsoft SQL Server Analysis Services database, an offline cube, XML/A or relational datasource.<br/><br/>
///Sets the mode for the PivotGrid widget for binding either OLAP or relational data source.
///<br/>analysisMode-any	default-ej.PivotGrid.AnalysisMode.Olap
///<br/><br/>
///Specifies the CSS class to PivotGrid to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Contains the serialized OlapReport at that instant.
///<br/>currentReport-string	default-&#226;€œ&#226;€
///<br/><br/>
///Initializes the data source for the PivotGrid widget, when it functions completely on client-side.
///<br/>dataSource-DataSource	default-{}
///<br/><br/>
///Contains the database name as string type to fetch the data from the given connection string.
///<br/>catalog-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items to be arranged in column section of PivotGrid.
///<br/>columns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Contains the respective Cube name as string type.
///<br/>cube-string	default-&#226;€œ&#226;€
///<br/><br/>
///Provides the raw data source for the PivotGrid.
///<br/>data-any	default-null
///<br/><br/>
///Lists out the items to be arranged in row section of PivotGrid.
///<br/>rows-Array&lt;any&gt;	default-[]
///<br/><br/>
///Lists out the items which supports calculation in PivotGrid.
///<br/>values-Array&lt;any&gt;	default-[]
///<br/><br/>
///This holds the measures unique names to bind the measures from Cube.
///<br/>measures-Array&lt;any&gt;	default-[]
///<br/><br/>
///To set the axis name in-order to place the measures.
///<br/>axis-string	default-&#226;€œ&#226;€
///<br/><br/>
///Lists out the items which supports filtering of values in PivotGrid.
///<br/>filters-Array&lt;any&gt;	default-[]
///<br/><br/>
///Used to bind the drilled members by default through report.
///<br/>drilledItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Object utilized to pass additional information between client-end and service-end.
///<br/>customObject-any	default-null
///<br/><br/>
///Allows the user to access each cell on right-click.
///<br/>enableCellContext-boolean	default-false
///<br/><br/>
///Enables the cell selection for a specified range of value cells.
///<br/>enableCellSelection-boolean	default-false
///<br/><br/>
///Collapses the Pivot Items along rows and columns by default.  It works only for relational data source.
///<br/>enableCollapseByDefault-boolean	default-false
///<br/><br/>
///Enables the display of grand total for all the columns.
///<br/>enableColumnGrandTotal-boolean	default-true
///<br/><br/>
///Allows the user to format a specific set of cells based on the condition.
///<br/>enableConditionalFormatting-boolean	default-false
///<br/><br/>
///Allows the user to refresh the control on-demand and not during every UI operation.
///<br/>enableDeferUpdate-boolean	default-false
///<br/><br/>
///Enables the display of GroupingBar allowing you to filter, sort and remove fields obtained from relational datasource.
///<br/>enableGroupingBar-boolean	default-false
///<br/><br/>
///Enables the display of grand total for rows and columns.
///<br/>enableGrandTotal-boolean	default-true
///<br/><br/>
///Allows the user to load PivotGrid using JSON data.
///<br/>enableJSONRendering-boolean	default-false
///<br/><br/>
///Enables rendering of PivotGrid widget along with the PivotTable Field List, which allows UI operation.
///<br/>enablePivotFieldList-boolean	default-true
///<br/><br/>
///Enables the display of grand total for all the rows.
///<br/>enableRowGrandTotal-boolean	default-true
///<br/><br/>
///Allows the user to view PivotGrid from right to left.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Allows the user to enable ToolTip option.
///<br/>enableToolTip-boolean	default-false
///<br/><br/>
///Allows the user to view large amount of data through virtual scrolling.
///<br/>enableVirtualScrolling-boolean	default-false
///<br/><br/>
///Allows the user to configure hyperlink settings of PivotGrid control.
///<br/>hyperlinkSettings-HyperlinkSettings	default-{}
///<br/><br/>
///Allows the user to enable/disable hyperlink for column header.
///<br/>enableColumnHeaderHyperlink-boolean	default-false
///<br/><br/>
///Allows the user to enable/disable hyperlink for row header.
///<br/>enableRowHeaderHyperlink-boolean	default-false
///<br/><br/>
///Allows the user to enable/disable hyperlink for summary cells.
///<br/>enableSummaryCellHyperlink-boolean	default-false
///<br/><br/>
///Allows the user to enable/disable hyperlink for value cells.
///<br/>enableValueCellHyperlink-boolean	default-false
///<br/><br/>
///This is used for identifying whether the member is Named Set or not.
///<br/>isNamedSets-boolean	default-false
///<br/><br/>
///Allows the user to enable PivotGridâ€™s responsiveness in the browser layout.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Contains the serialized JSON string which renders PivotGrid.
///<br/>jsonRecords-string	default-&#226;€œ&#226;€
///<br/><br/>
///Sets the summary layout for PivotGrid. Following are the ways in which summary can be positioned: normal summary (bottom), top summary, no summary and excel-like summary.
///<br/>layout-ej.PivotGrid.Layout|string	default-ej.PivotGrid.Layout.Normal
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the mode for the PivotGrid widget for binding data source either in server-side or client-side.
///<br/>operationalMode-any	default-ej.PivotGrid.OperationalMode.ClientMode
///<br/><br/>
///Allows the user to set custom name for the methods at service-end, communicated during AJAX post.
///<br/>serviceMethodSettings-ServiceMethodSettings	default-{}
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for drill up/down operation in PivotGrid.
///<br/>drillDown-string	default-DrillGrid
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for exporting.
///<br/>exportPivotGrid-string	default-Export
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for performing server-side actions on defer update.
///<br/>deferUpdate-string	default-DeferUpdate
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible to getting the values for the tree-view inside filter dialog.
///<br/>fetchMembers-string	default-FetchMembers
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for filtering operation in PivotGrid.
///<br/>filtering-string	default-Filtering
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for initializing PivotGrid.
///<br/>initialize-string	default-InitializeGrid
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for the server-side action, on dropping a node into Field List.
///<br/>nodeDropped-string	default-NodeDropped
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for the server-side action on changing the checked state of a node in Field List.
///<br/>nodeStateModified-string	default-NodeStateModified
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for performing paging operation in PivotGrid.
///<br/>paging-string	default-Paging
///<br/><br/>
///Allows the user to set the custom name for the service method that's responsible for sorting operation in PivotGrid.
///<br/>sorting-string	default-Sorting
///<br/><br/>
///Connects the service using the specified URL for any server updates.
///<br/>url-string	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PivotPager=function(){};
ej.PivotPager.prototype={

initPagerProperties:function(){
/// <summary>
/// This function initializes the page counts and page numbers for the PivotPager.
/// </summary>
},
};
jQuery.fn.ejPivotPager=function(){
this.data("ejPivotPager",new	ej.PivotPager());
return this;
};
jQuery.fn.ejPivotPager = function (options) {
/// <summary><br/>
///Support has been provided in PivotGrid to load and render large amount of data without any performance constraint through pager. The PivotPager widget is used to navigate between pages to view the paged information.<br/><br/>
///Contains the current page number in categorical axis.
///<br/>categoricalCurrentPage-number	default-1
///<br/><br/>
///Contains the total page count in categorical axis.
///<br/>categoricalPageCount-number	default-1
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the pager mode (Only Categorical Pager/Only Series Pager/Both) for the PivotPager.
///<br/>mode-ej.PivotPager.Mode|string	default-ej.PivotPager.Mode.Both
///<br/><br/>
///Contains the current page number in series axis.
///<br/>seriesCurrentPage-number	default-1
///<br/><br/>
///Contains the total page count in series axis.
///<br/>seriesPageCount-number	default-1
///<br/><br/>
///Contains the ID of the target element for which paging needs to be done.
///<br/>targetControlID-string	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.PivotSchemaDesigner=function(){};
ej.PivotSchemaDesigner.prototype={

doAjaxPost:function(){
/// <summary>
/// Perform an asynchronous HTTP (AJAX) request.
/// </summary>
},
};
jQuery.fn.ejPivotSchemaDesigner=function(){
this.data("ejPivotSchemaDesigner",new	ej.PivotSchemaDesigner());
return this;
};
jQuery.fn.ejPivotSchemaDesigner = function (options) {
/// <summary><br/>
///PivotSchemaDesigner, also known as PivotTable Field List, is automatically populated with fields from the bound datasource and allows end user to drag fields, filter them, and create pivot views at run-time.<br/><br/>
///Specifies the CSS class to PivotSchemaDesigner to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Object utilized to pass additional information between client-end and service-end.
///<br/>customObject-any	default-{}
///<br/><br/>
///For ASP.NET and MVC Wrapper, Pivots Schema Designer will be initialized and rendered empty initially. Once PivotGrid widget is rendered completely, Pivots Schema Designer will just be populated with data source by setting this property to â€œtrueâ€.
///<br/>enableWrapper-boolean	default-false
///<br/><br/>
///Allows the user to set the list of filters in filter section.
///<br/>filters-Array&lt;any&gt;	default-newArray()
///<br/><br/>
///Sets the height for PivotSchemaDesigner.
///<br/>height-string	default-&#226;€œ&#226;€
///<br/><br/>
///Allows the user to set the localized language for the widget.
///<br/>locale-string	default-en-US
///<br/><br/>
///Allows the user to set list of PivotCalculations in values section.
///<br/>pivotCalculations-Array&lt;any&gt;	default-newArray()
///<br/><br/>
///Allows the user to set the list of PivotItems in column section.
///<br/>pivotColumns-Array&lt;any&gt;	default-newArray()
///<br/><br/>
///Sets the Pivot control bound with this PivotSchemaDesigner.
///<br/>pivotControl-any	default-null
///<br/><br/>
///Allows the user to set the list of PivotItems in row section.
///<br/>pivotRows-Array&lt;any&gt;	default-newArray()
///<br/><br/>
///Allows the user to arrange the fields inside Field List of PivotSchemaDesigner.
///<br/>pivotTableFields-Array&lt;any&gt;	default-newArray()
///<br/><br/>
///Allows the user to set custom name for the methods at service-end, communicated during AJAX post.
///<br/>serviceMethod-ServiceMethod	default-{}
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for getting the values for the tree-view inside filter dialog.
///<br/>fetchMembers-string	default-FetchMembers
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for filtering operation in Field List.
///<br/>filtering-string	default-Filtering
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for the server-side action, on expanding members in Field List.
///<br/>memberExpand-string	default-MemberExpanded
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for the server-side action, on dropping a node into Field List.
///<br/>nodeDropped-string	default-NodeDropped
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for the server-side action on changing the checked state of a node in Field List.
///<br/>nodeStateModified-string	default-NodeStateModified
///<br/><br/>
///Allows the user to set the custom name for the service method thatâ€™s responsible for remove operation in Field List.
///<br/>removeButton-string	default-RemoveButton
///<br/><br/>
///Connects the service using the specified URL for any server updates.
///<br/>url-string	default-&#226;€œ&#226;€
///<br/><br/>
///Sets the width for PivotSchemaDesigner.
///<br/>width-string	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ProgressBar=function(){};
ej.ProgressBar.prototype={

destroy:function(){
/// <summary>
/// Destroy the progressbar widget
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the progressbar control
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the progressbar control
/// </summary>
},
getPercentage:function(){
/// <summary>
/// Returns the current progress value in percent.
/// </summary>
},
getValue:function(){
/// <summary>
/// Returns the current progress value
/// </summary>
},
};
jQuery.fn.ejProgressBar=function(){
this.data("ejProgressBar",new	ej.ProgressBar());
return this;
};
jQuery.fn.ejProgressBar = function (options) {
/// <summary><br/>
///The ProgressBar control is a graphical control element used to visualize the changing status of an extended operation.<br/><br/>
///Sets the root CSS class for ProgressBar theme, which is used customize.
///<br/>cssClass-string	default-null
///<br/><br/>
///When this property sets to false, it disables the ProgressBar control
///<br/>enabled-boolean	default-true
///<br/><br/>
///Save current model value to browser cookies for state maintains. While refresh the progressBar control page retains the model value apply from browser cookies
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Sets the ProgressBar direction as right to left alignment.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Defines the height of the ProgressBar.
///<br/>height-number|string	default-null
///<br/><br/>
///It allows to define the characteristics of the progressBar control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Sets the maximum value of the ProgressBar.
///<br/>maxValue-number	default-100
///<br/><br/>
///Sets the minimum value of the ProgressBar.
///<br/>minValue-number	default-0
///<br/><br/>
///Sets the ProgressBar value in percentage. The value should be in between 0 to 100.
///<br/>percentage-number	default-0
///<br/><br/>
///Displays rounded corner borders on the progressBar control.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Sets the custom text for the ProgressBar. The text placed in the middle of the ProgressBar and it can be customizable using the class 'e-progress-text'.
///<br/>text-string	default-null
///<br/><br/>
///Sets the ProgressBar value. The value should be in between min and max values.
///<br/>value-number	default-0
///<br/><br/>
///Defines the width of the ProgressBar.
///<br/>width-number|string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Query=function(){};
ej.Query.prototype={

addParams:function(key, value){
/// <summary>
/// Passes custom parameters to our API URL.
/// </summary>
/// <param name="key"	type="string"></param>
/// <param name="value"	type="string"></param>
},
clone:function(){
/// <summary>
/// clone is used to duplicate the data.
/// </summary>
},
execute:function(dataManager){
/// <summary>
/// It is used to execute the query on URL Binding
/// </summary>
/// <param name="dataManager"	type="any">json data or OData</param>
},
executeLocal:function(dataManager){
/// <summary>
/// It is used to execute the query on Local Binding
/// </summary>
/// <param name="dataManager"	type="any">json data</param>
},
expand:function(tables){
/// <summary>
/// expand is used to performs complex binding.
/// </summary>
/// <param name="tables"	type="string">name of the tables</param>
},
foreignKey:function(key){
/// <summary>
/// Relates two tables. A foreign key is a column or combination of columns which is used to establish and enforce a link between two tables.
/// </summary>
/// <param name="key"	type="string">primary key field name</param>
},
from:function(tableName){
/// <summary>
/// Specifies the name of table(s) to retrieve data.
/// </summary>
/// <param name="tableName"	type="string">name of the table</param>
},
group:function(fieldName){
/// <summary>
/// Groups records based on the given field name.
/// </summary>
/// <param name="fieldName"	type="string">name of the column</param>
},
hierarchy:function(query){
/// <summary>
/// Displays the records in hierarchical relationships. The foreign key is used to relate two tables.
/// </summary>
/// <param name="query"	type="ej.Query">query the json data</param>
},
page:function(pageIndex, pageSize){
/// <summary>
/// Retrieves records based on the given page index and size.
/// </summary>
/// <param name="pageIndex"	type="number">page number</param>
/// <param name="pageSize"	type="number">Number of rows in the page</param>
},
range:function(start, end){
/// <summary>
/// The range property is used to retrieve the records based on the given start and end index.
/// </summary>
/// <param name="start"	type="number">start index of json data</param>
/// <param name="end"	type="number">end index of json data</param>
},
requiresCount:function(){
/// <summary>
/// Specifies that the total number of records(count) is required in the result.
/// </summary>
},
search:function(fieldName, operator, value, ignoreCase){
/// <summary>
/// It is used to search the given search key value in JSON data
/// </summary>
/// <param name="fieldName"	type="string">name of the column</param>
/// <param name="operator"	type="string">conditional Operators</param>
/// <param name="value"	type="string">value to filter the field name</param>
/// <param name="ignoreCase"	type="boolean">on/off case sensitive.</param>
},
select:function(fieldName){
/// <summary>
/// Selects specified columns from the data source.
/// </summary>
/// <param name="fieldName"	type="string">name of the columns</param>
},
skip:function(nos){
/// <summary>
/// Skips the given count of records from the data source.
/// </summary>
/// <param name="nos"	type="number">number of records</param>
},
sortBy:function(fieldName){
/// <summary>
/// Sort items or records in an ordered sequence.
/// </summary>
/// <param name="fieldName"	type="string">name of the column</param>
},
sortByDesc:function(fieldName){
/// <summary>
/// Sort items or records in descending order.
/// </summary>
/// <param name="fieldName"	type="string">name of the column</param>
},
take:function(nos){
/// <summary>
/// Picks the given count of records from the top of the datasource.
/// </summary>
/// <param name="nos"	type="number">number of records</param>
},
using:function(dataManager){
/// <summary>
/// using is a method used to query the data manager.
/// </summary>
/// <param name="dataManager"	type="any">Pass new data source</param>
},
where:function(fieldName, operator, value, ignoreCase){
/// <summary>
/// It is used to filter records based on the filter condition.
/// </summary>
/// <param name="fieldName"	type="string">name of the column</param>
/// <param name="operator"	type="string">conditional Operators</param>
/// <param name="value"	type="string">value to filter the field name</param>
/// <param name="ignoreCase"	type="boolean">on/off case sensitive.</param>
},
};
jQuery.fn.ejQuery=function(){
this.data("ejQuery",new	ej.Query());
return this;
};
jQuery.fn.ejQuery = function (options) {
/// <summary><br/>
///Communicates with data source and returns the desired result based on the Query provided.</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RadialMenu=function(){};
ej.RadialMenu.prototype={

hide:function(){
/// <summary>
/// To hide the radialmenu
/// </summary>
},
hideMenu:function(){
/// <summary>
/// To hide the radialmenu items
/// </summary>
},
show:function(){
/// <summary>
/// To Show the radial menu
/// </summary>
},
showMenu:function(){
/// <summary>
/// To show menu items
/// </summary>
},
enableItemByIndex:function(){
/// <summary>
/// To enable menu item using index
/// </summary>
},
enableItemsByIndices:function(){
/// <summary>
/// To enable menu items using indices
/// </summary>
},
disableItemByIndex:function(){
/// <summary>
/// To disable menu item using index
/// </summary>
},
disableItemsByIndices:function(){
/// <summary>
/// To disable menu items using indices
/// </summary>
},
enableItem:function(){
/// <summary>
/// To enable menu item using item text
/// </summary>
},
disableItem:function(){
/// <summary>
/// To disable menu item using item text
/// </summary>
},
enableItems:function(){
/// <summary>
/// To enable menu items using item texts
/// </summary>
},
disableItems:function(){
/// <summary>
/// To disable menu items using item texts
/// </summary>
},
updateBadgeValue:function(){
/// <summary>
/// To update menu item badge value
/// </summary>
},
showBadge:function(){
/// <summary>
/// To show menu item badge
/// </summary>
},
hideBadge:function(){
/// <summary>
/// To hide menu item badge
/// </summary>
},
};
jQuery.fn.ejRadialMenu=function(){
this.data("ejRadialMenu",new	ej.RadialMenu());
return this;
};
jQuery.fn.ejRadialMenu = function (options) {
/// <summary><br/>
///$(element).ejRadialMenu()<br/><br/>
///To show the Radial in initial render.
///<br/>autoOpen-boolean	default-
///<br/><br/>
///Renders the back button Image for Radial using class.
///<br/>backImageClass-string	default-
///<br/><br/>
///Sets the root class for RadialMenu theme. This cssClass API helps to use custom skinning option for RadialMenu control. By defining the root class using this API, we need to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///To enable Animation for Radial Menu.
///<br/>enableAnimation-boolean	default-
///<br/><br/>
///Renders the Image for Radial using Class.
///<br/>imageClass-string	default-
///<br/><br/>
///Specify the items of radial menu
///<br/>items-Array&lt;Items&gt;	default-
///<br/><br/>
///Specify the URL of the frame background image for radial menu item.
///<br/>imageUrl-string	default-
///<br/><br/>
///Specifies the text of RadialMenu item.
///<br/>text-string	default-
///<br/><br/>
///Specifies the enable state of RadialMenu item.
///<br/>enabled-boolean	default-
///<br/><br/>
///specify the click event to corresponding image/text for performing some specific action.
///<br/>click-string	default-
///<br/><br/>
///Specifies radialmenu item badges.
///<br/>badge-any	default-
///<br/><br/>
///Specifies whether to enable radialmenu item badge or not.
///<br/>enabled-boolean	default-
///<br/><br/>
///Specifies the value of radial menu item badge.
///<br/>value-number	default-
///<br/><br/>
///Specifies the type of nested radial menu item.
///<br/>type-string	default-
///<br/><br/>
///Specifies the sliderSettings ticks for nested radial menu items.
///<br/>sliderSettings-any	default-
///<br/><br/>
///Specifies the sliderSettings ticks values of nested radial menu items.
///<br/>ticks-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the sliderSettings stroke Width value.
///<br/>strokeWidth-number	default-
///<br/><br/>
///Specifies the value of sliderSettings labelSpace .
///<br/>labelSpace-number	default-
///<br/><br/>
///Specifies the radius of radial menu
///<br/>radius-number	default-
///<br/><br/>
///To show the Radial while clicking given target element.
///<br/>targetElementId-string	default-
///<br/><br/>
///To set radial render position.
///<br/>position-any	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RadialSlider=function(){};
ej.RadialSlider.prototype={

show:function(){
/// <summary>
/// To show the radialslider
/// </summary>
},
hide:function(){
/// <summary>
/// To hide the radialslider
/// </summary>
},
};
jQuery.fn.ejRadialSlider=function(){
this.data("ejRadialSlider",new	ej.RadialSlider());
return this;
};
jQuery.fn.ejRadialSlider = function (options) {
/// <summary><br/>
///The RadialSlider provides an optimized interface for selecting a numeric value using a touch interface. Value is returned based on direct needle selection or needle move. It can also be customized as a full circle, half circle, or any portion of a circle, based on startAngle and endAngle<br/><br/>
///To show the RadialSlider in initial render.
///<br/>autoOpen-boolean	default-false
///<br/><br/>
///Sets the root class for RadialSlider theme. This cssClass API helps to use custom skinning option for RadialSlider control. By defining the root class using this API, we need to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///To enable Animation for Radial Slider.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Enable/Disable the Roundoff property of RadialSlider
///<br/>enableRoundOff-boolean	default-true
///<br/><br/>
///Specifies the endAngle value for radial slider circle.
///<br/>endAngle-number	default-360
///<br/><br/>
///Specifies the inline for label show or not on given radius.
///<br/>inline-boolean	default-false
///<br/><br/>
///Specifies innerCircleImageClass, using this property we can give images for center radial circle through CSS classes.
///<br/>innerCircleImageClass-string	default-null
///<br/><br/>
///Specifies the file name of center circle icon
///<br/>innerCircleImageUrl-string	default-null
///<br/><br/>
///Specifies the radius of radial slider
///<br/>radius-number	default-200
///<br/><br/>
///Specifies the  strokeWidth for customize the needle, outer circle and inner circle.
///<br/>strokeWidth-number	default-2
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RadioButton=function(){};
ej.RadioButton.prototype={

disable:function(){
/// <summary>
/// To disable the RadioButton
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the RadioButton
/// </summary>
},
};
jQuery.fn.ejRadioButton=function(){
this.data("ejRadioButton",new	ej.RadioButton());
return this;
};
jQuery.fn.ejRadioButton = function (options) {
/// <summary><br/>
///The RadioButton control allows you to choose an option to perform an action. This control allows you to select true/false.<br/><br/>
///Specifies the check attribute of the Radio Button.
///<br/>checked-boolean	default-false
///<br/><br/>
///Specify the CSS class to RadioButton to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the RadioButton control state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies the enablePersistence property for RadioButton while initialization. The enablePersistence API save current model value to browser cookies for state maintains. While refreshing the radio button control page the model value apply from browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specify the Right to Left direction to RadioButton
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the HTML Attributes of the Checkbox
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the id attribute for the Radio Button while initialization.
///<br/>id-string	default-null
///<br/><br/>
///Specify the idPrefix value to be added before the current id of the RadioButton.
///<br/>idPrefix-string	default-ej
///<br/><br/>
///Specifies the name attribute for the Radio Button while initialization.
///<br/>name-string	default-Sets id as name if it is null
///<br/><br/>
///Specifies the size of the RadioButton.
///<br/>size-ej.RadioButtonSize|string	default-small
///<br/><br/>
///Specifies the text content for RadioButton.
///<br/>text-string	default-
///<br/><br/>
///Set the jquery validation error message in radio button.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Set the jquery validation rules in radio button.
///<br/>validationRules-any	default-null
///<br/><br/>
///Specifies the value attribute of the Radio Button.
///<br/>value-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RangeNavigator=function(){};
ej.RangeNavigator.prototype={

_destroy:function(){
/// <summary>
/// destroy the range navigator widget
/// </summary>
},
};
jQuery.fn.ejRangeNavigator=function(){
this.data("ejRangeNavigator",new	ej.RangeNavigator());
return this;
};
jQuery.fn.ejRangeNavigator = function (options) {
/// <summary><br/>
///The range navigator can be easily configured to the DOM element, such as div. You can create a range navigator with a highly customizable look and feel.<br/><br/>
///Toggles the placement of slider exactly on the place it left or on the nearest interval.
///<br/>allowSnapping-boolean	default-false
///<br/><br/>
///Options for customizing the color, opacity and width of the chart border.
///<br/>border-Border	default-
///<br/><br/>
///Border color of rangenavigator. When enable the scrollbar, the default color will be set as "#B4B4B4".
///<br/>color-string	default-transparent
///<br/><br/>
///Opacity of the rangeNavigator border.
///<br/>opacity-number	default-1
///<br/><br/>
///Width of the RangeNavigator border.
///<br/>width-number	default-1
///<br/><br/>
///Specifies the data source for range navigator.
///<br/>dataSource-any	default-
///<br/><br/>
///Toggles the redrawing of chart on moving the sliders.
///<br/>enableDeferredUpdate-boolean	default-true
///<br/><br/>
///Enable the scrollbar option in the rangenavigator.
///<br/>enableScrollbar-boolean	default-false
///<br/><br/>
///Toggles the direction of rendering the range navigator control.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Sets a value whether to make the range navigator responsive on resize.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Options for customizing the labels colors, font, style, size, horizontalAlignment and opacity.
///<br/>labelSettings-LabelSettings	default-
///<br/><br/>
///Options for customizing the higher level labels in range navigator.
///<br/>higherLevel-any	default-
///<br/><br/>
///Options for customizing the border of grid lines in higher level.
///<br/>border-any	default-
///<br/><br/>
///Specifies the border color of grid lines.
///<br/>color-string	default-transparent
///<br/><br/>
///Specifies the border width of grid lines.
///<br/>width-string	default-0.5
///<br/><br/>
///Specifies the fill color of higher level labels.
///<br/>fill-string	default-transparent
///<br/><br/>
///Options for customizing the grid line colors, width, dashArray, border.
///<br/>gridLineStyle-any	default-
///<br/><br/>
///Specifies the color of grid lines in higher level.
///<br/>color-string	default-#B5B5B5
///<br/><br/>
///Specifies the dashArray of grid lines in higher level.
///<br/>dashArray-string	default-20 5 0
///<br/><br/>
///Specifies the width of grid lines in higher level.
///<br/>width-string	default-#B5B5B5
///<br/><br/>
///Specifies the intervalType for higher level labels. See IntervalType
///<br/>intervalType-ej.datavisualization.RangeNavigator.IntervalType|string	default-auto
///<br/><br/>
///Specifies the position of the labels to render either inside or outside of plot area
///<br/>labelPlacement-ej.datavisualization.RangeNavigator.LabelPlacement|string	default-outside
///<br/><br/>
///Specifies the position of the labels in higher level
///<br/>position-ej.datavisualization.RangeNavigator.Position|string	default-top
///<br/><br/>
///Options for customizing the style of higher level labels.
///<br/>style-any	default-
///<br/><br/>
///Options for customizing the font properties.
///<br/>font-any	default-
///<br/><br/>
///Specifies the label font color. Labels render with the specified font color.
///<br/>color-string	default-black
///<br/><br/>
///Specifies the label font family. Labels render with the specified font family.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the label font style. Labels render with the specified font style.
///<br/>fontStyle-string	default-Normal
///<br/><br/>
///Specifies the label font weight. Labels render with the specified font weight.
///<br/>fontWeight-string	default-regular
///<br/><br/>
///Specifies the label opacity. Labels render with the specified opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the label font size. Labels render with the specified font size.
///<br/>size-string	default-12px
///<br/><br/>
///Specifies the horizontal text alignment of the text in label.
///<br/>horizontalAlignment-string	default-middle
///<br/><br/>
///Toggles the visibility of higher level labels.
///<br/>visible-boolean	default-true
///<br/><br/>
///Options for customizing the labels in lower level.
///<br/>lowerLevel-any	default-
///<br/><br/>
///Options for customizing the border of grid lines in lower level.
///<br/>border-any	default-
///<br/><br/>
///Specifies the border color of grid lines.
///<br/>color-string	default-transparent
///<br/><br/>
///Specifies the border width of grid lines.
///<br/>width-string	default-0.5
///<br/><br/>
///Specifies the fill color of labels in lower level.
///<br/>fill-string	default-transparent
///<br/><br/>
///Options for customizing the grid lines in lower level.
///<br/>gridLineStyle-any	default-
///<br/><br/>
///Specifies the color of grid lines in lower level.
///<br/>color-string	default-#B5B5B5
///<br/><br/>
///Specifies the dashArray of gridLines in lowerLevel.
///<br/>dashArray-string	default-20 5 0
///<br/><br/>
///Specifies the width of grid lines in lower level.
///<br/>width-string	default-#B5B5B5
///<br/><br/>
///Specifies the intervalType of the labels in lower level.See IntervalType
///<br/>intervalType-ej.datavisualization.RangeNavigator.IntervalType|string	default-auto
///<br/><br/>
///Specifies the position of the labels to render either inside or outside of plot area. See LabelPlacement
///<br/>labelPlacement-ej.datavisualization.RangeNavigator.LabelPlacement|string	default-outside
///<br/><br/>
///Specifies the position of the labels in lower level.See Position
///<br/>position-ej.datavisualization.RangeNavigator.Position|string	default-bottom
///<br/><br/>
///Options for customizing the style of labels.
///<br/>style-any	default-
///<br/><br/>
///Options for customizing the font of labels.
///<br/>font-any	default-
///<br/><br/>
///Specifies the color of labels. Label text render in this specified color.
///<br/>color-string	default-black
///<br/><br/>
///Specifies the font family of labels. Label text render in this specified font family.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the font style of labels. Label text render in this specified font style.
///<br/>fontStyle-string	default-Normal
///<br/><br/>
///Specifies the font weight of labels. Label text render in this specified font weight.
///<br/>fontWeight-string	default-regular
///<br/><br/>
///Specifies the opacity of labels. Label text render in this specified opacity.
///<br/>opacity-string	default-12px
///<br/><br/>
///Specifies the size of labels. Label text render in this specified size.
///<br/>size-string	default-12px
///<br/><br/>
///Specifies the horizontal text alignment of the text in label.
///<br/>horizontalAlignment-string	default-middle
///<br/><br/>
///Toggles the visibility of labels in lower level.
///<br/>visible-boolean	default-true
///<br/><br/>
///Options for customizing the style of labels in range navigator.
///<br/>style-any	default-
///<br/><br/>
///Options for customizing the font of labels in range navigator.
///<br/>font-any	default-
///<br/><br/>
///Specifies the label color. This color is applied to the labels in range navigator.
///<br/>color-string	default-#FFFFFF
///<br/><br/>
///Specifies the label font family. Labels render with the specified font family.
///<br/>family-string	default-Segoe UI
///<br/><br/>
///Specifies the label font opacity. Labels render with the specified font opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the label font size. Labels render with the specified font size.
///<br/>size-string	default-1px
///<br/><br/>
///Specifies the label font style. Labels render with the specified font style..
///<br/>style-ej.datavisualization.RangeNavigator.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the label font weight
///<br/>weight-ej.datavisualization.RangeNavigator.FontWeight|string	default-regular
///<br/><br/>
///Specifies the horizontalAlignment of the label in RangeNavigator
///<br/>horizontalAlignment-ej.datavisualization.RangeNavigator.HorizontalAlignment|string	default-middle
///<br/><br/>
///This property is to specify the localization of range navigator.
///<br/>locale-string	default-en-US
///<br/><br/>
///Options for customizing the range navigator.
///<br/>navigatorStyleSettings-NavigatorStyleSettings	default-
///<br/><br/>
///Specifies the background color of range navigator.
///<br/>background-string	default-#dddddd
///<br/><br/>
///Options for customizing the border color and width of range navigator.
///<br/>border-any	default-
///<br/><br/>
///Specifies the border color of range navigator.
///<br/>color-string	default-transparent
///<br/><br/>
///Specifies the dash array of range navigator.
///<br/>dashArray-string	default-null
///<br/><br/>
///Specifies the border width of range navigator.
///<br/>width-number	default-0.5
///<br/><br/>
///Specifies the left side thumb template in range navigator we can give either div id or HTML string
///<br/>leftThumbTemplate-string	default-null
///<br/><br/>
///Options for customizing the major grid lines.
///<br/>majorGridLineStyle-any	default-
///<br/><br/>
///Specifies the color of major grid lines in range navigator.
///<br/>color-string	default-#B5B5B5
///<br/><br/>
///Toggles the visibility of major grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Options for customizing the minor grid lines.
///<br/>minorGridLineStyle-any	default-
///<br/><br/>
///Specifies the color of minor grid lines in range navigator.
///<br/>color-string	default-#B5B5B5
///<br/><br/>
///Toggles the visibility of minor grid lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the opacity of RangeNavigator.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the right side thumb template in range navigator we can give either div id or HTML string
///<br/>rightThumbTemplate-string	default-null
///<br/><br/>
///Specifies the color of the selected region in range navigator.
///<br/>selectedRegionColor-string	default-#EFEFEF
///<br/><br/>
///Specifies the opacity of Selected Region.
///<br/>selectedRegionOpacity-number	default-0
///<br/><br/>
///Specifies the color of the thumb in range navigator.
///<br/>thumbColor-string	default-#2382C3
///<br/><br/>
///Specifies the radius of the thumb in range navigator.
///<br/>thumbRadius-number	default-10
///<br/><br/>
///Specifies the stroke color of the thumb in range navigator.
///<br/>thumbStroke-string	default-#303030
///<br/><br/>
///Specifies the color of the unselected region in range navigator.
///<br/>unselectedRegionColor-string	default-#5EABDE
///<br/><br/>
///Specifies the opacity of Unselected Region.
///<br/>unselectedRegionOpacity-number	default-0.3
///<br/><br/>
///Contains the options for highlighting the range navigator on mouse over.
///<br/>highlightSettings-any	default-
///<br/><br/>
///Enable the highlight settings in range navigator.
///<br/>enable-boolean	default-false
///<br/><br/>
///To set the color to the highlight.
///<br/>color-string	default-null
///<br/><br/>
///To set the opacity to the highlight.
///<br/>opacity-number	default-0.5
///<br/><br/>
///Contains the border properties for highlighting rectangle.
///<br/>border-any	default-
///<br/><br/>
///To set the border color to the highlight.
///<br/>color-string	default-null
///<br/><br/>
///To set the border width to the highlight.
///<br/>width-number	default-1
///<br/><br/>
///Contains the options for selection the range navigator on mouse over.
///<br/>selectionSettings-any	default-
///<br/><br/>
///Enable the selection settings in range navigator.
///<br/>enable-boolean	default-false
///<br/><br/>
///To set the color to the selection.
///<br/>color-string	default-null
///<br/><br/>
///To set the opacity to the selection.
///<br/>opacity-number	default-0.5
///<br/><br/>
///Contains the border properties for selecting the rectangle.
///<br/>border-any	default-
///<br/><br/>
///To set the border color to the selection.
///<br/>color-string	default-null
///<br/><br/>
///To set the border width to the selection.
///<br/>width-number	default-1
///<br/><br/>
///Padding specifies the gap between the container and the range navigator.
///<br/>padding-string	default-0
///<br/><br/>
///If the range is not given explicitly, range will be calculated automatically.
///<br/>rangePadding-ej.datavisualization.RangeNavigator.RangePadding|string	default-none
///<br/><br/>
///Options for customizing the starting and ending ranges.
///<br/>rangeSettings-RangeSettings	default-
///<br/><br/>
///Specifies the ending range of range navigator.
///<br/>end-string	default-null
///<br/><br/>
///Specifies the starting range of range navigator.
///<br/>start-string	default-null
///<br/><br/>
///selectedData is for getting the data when the "rangeChanged" event trigger from client side.
///<br/>selectedData-any	default-
///<br/><br/>
///Options for customizing the start and end range values.
///<br/>selectedRangeSettings-SelectedRangeSettings	default-
///<br/><br/>
///Specifies the ending range of range navigator.
///<br/>end-string	default-null
///<br/><br/>
///Specifies the starting range of range navigator.
///<br/>start-string	default-null
///<br/><br/>
///Options for rendering scrollbar based on the start and end range values.
///<br/>scrollRangeSettings-ScrollRangeSettings	default-
///<br/><br/>
///Specifies the ending range of range navigator scrollbar and that should be greater than the rangenavigator datasource end value.
///<br/>end-string	default-null
///<br/><br/>
///Specifies the starting range of range navigator scrollbar and that should be less than the rangenavigator datasource start value.
///<br/>start-string	default-null
///<br/><br/>
///Contains property to customize the hight and width of range navigator.
///<br/>sizeSettings-SizeSettings	default-
///<br/><br/>
///Specifies height of the range navigator.
///<br/>height-string	default-null
///<br/><br/>
///Specifies width of the range navigator.
///<br/>width-string	default-null
///<br/><br/>
///By specifying this property the user can change the theme of the range navigator.
///<br/>theme-string	default-null
///<br/><br/>
///Options for customizing the tooltip in range navigator.
///<br/>tooltipSettings-TooltipSettings	default-
///<br/><br/>
///Specifies the background color of tooltip.
///<br/>backgroundColor-string	default-#303030
///<br/><br/>
///Options for customizing the font in tooltip.
///<br/>font-any	default-
///<br/><br/>
///Specifies the color of text in tooltip. Tooltip text render in the specified color.
///<br/>color-string	default-#FFFFFF
///<br/><br/>
///Specifies the font family of text in tooltip. Tooltip text render in the specified font family.
///<br/>family-string	default-Segoe UI
///<br/><br/>
///Specifies the font style of text in tooltip. Tooltip text render in the specified font style.
///<br/>fontStyle-string	default-ej.datavisualization.RangeNavigator.fontStyle.Normal
///<br/><br/>
///Specifies the opacity of text in tooltip. Tooltip text render in the specified opacity.
///<br/>opacity-number	default-1
///<br/><br/>
///Specifies the size of text in tooltip. Tooltip text render in the specified size.
///<br/>size-string	default-10px
///<br/><br/>
///Specifies the weight of text in tooltip. Tooltip text render in the specified weight.
///<br/>weight-string	default-ej.datavisualization.RangeNavigator.weight.Regular
///<br/><br/>
///Specifies the format of text to be displayed in tooltip.
///<br/>labelFormat-string	default-MM/dd/yyyy
///<br/><br/>
///Specifies the mode of displaying the tooltip. Neither to display the tooltip always nor on demand.
///<br/>tooltipDisplayMode-string	default-null
///<br/><br/>
///Toggles the visibility of tooltip.
///<br/>visible-boolean	default-true
///<br/><br/>
///Options for configuring minor grid lines, major grid lines, axis line of axis.
///<br/>valueAxisSettings-ValueAxisSettings	default-
///<br/><br/>
///Options for customizing the axis line.
///<br/>axisLine-any	default-
///<br/><br/>
///Toggles the visibility of axis line.
///<br/>visible-string	default-none
///<br/><br/>
///Options for customizing the font of the axis.
///<br/>font-any	default-
///<br/><br/>
///Text in axis render with the specified size.
///<br/>size-string	default-0px
///<br/><br/>
///Options for customizing the major grid lines.
///<br/>majorGridLines-any	default-
///<br/><br/>
///Toggles the visibility of major grid lines.
///<br/>visible-boolean	default-false
///<br/><br/>
///Options for customizing the major tick lines in axis.
///<br/>majorTickLines-any	default-
///<br/><br/>
///Specifies the size of the majorTickLines in range navigator
///<br/>size-number	default-0
///<br/><br/>
///Toggles the visibility of major tick lines.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies width of the major tick lines.
///<br/>width-number	default-0
///<br/><br/>
///If the range is not given explicitly, range will be calculated automatically. You can customize the automatic range calculation using rangePadding.
///<br/>rangePadding-string	default-none
///<br/><br/>
///Toggles the visibility of axis in range navigator.
///<br/>visible-boolean	default-false
///<br/><br/>
///You can plot data of type date time or numeric. This property determines the type of data that this axis will handle.
///<br/>valueType-ej.datavisualization.RangeNavigator.ValueType|string	default-datetime
///<br/><br/>
///Specifies the xName for dataSource. This is used to take the x values from dataSource
///<br/>xName-any	default-
///<br/><br/>
///Specifies the yName for dataSource. This is used to take the y values from dataSource
///<br/>yName-any	default-
///<br/><br/>
///This property determines the factor by which the axis is scaled. Value must be specified between 0 and 1.
///<br/>zoomSettings.zoomFactor-string	default-1
///<br/><br/>
///This property determines the starting position of the zoomed axis. Value must be specified between 0 and 1.
///<br/>zoomSettings.zoomPosition-string	default-0
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Rating=function(){};
ej.Rating.prototype={

destroy:function(){
/// <summary>
/// Destroy the Rating widget all events bound will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
getValue:function(){
/// <summary>
/// To get the current value of rating control.
/// </summary>
},
hide:function(){
/// <summary>
/// To hide the rating control.
/// </summary>
},
refresh:function(){
/// <summary>
/// User can refresh the rating control to identify changes.
/// </summary>
},
reset:function(){
/// <summary>
/// To reset the rating value.
/// </summary>
},
setValue:function(value){
/// <summary>
/// To set the rating value.
/// </summary>
/// <param name="value"	type="string|number">Specifies the rating value.</param>
},
show:function(){
/// <summary>
/// To show the rating control
/// </summary>
},
};
jQuery.fn.ejRating=function(){
this.data("ejRating",new	ej.Rating());
return this;
};
jQuery.fn.ejRating = function (options) {
/// <summary><br/>
///The Rating control provides an intuitive Rating experience that enables you to select a number of stars that represent a Rating. You can configure the item size, orientation and the number of displayed items in the Rating control. You can also customize the Rating star image by using custom CSS.<br/><br/>
///Enables the rating control with reset button.It can be used to reset the rating control value.
///<br/>allowReset-boolean	default-true
///<br/><br/>
///Specify the CSS class to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///When this property is set to false, it disables the rating control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Save current model value to browser cookies for state maintenance. While refresh the page Rating control values are retained.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specifies the height of the Rating control wrapper.
///<br/>height-string	default-null
///<br/><br/>
///Specifies the value to be increased while navigating between shapes(stars) in Rating control.
///<br/>incrementStep-number	default-1
///<br/><br/>
///Allow to render the maximum number of Rating shape(star).
///<br/>maxValue-number	default-5
///<br/><br/>
///Allow to render the minimum number of Rating shape(star).
///<br/>minValue-number	default-0
///<br/><br/>
///Specifies the orientation of Rating control. See Orientation
///<br/>orientation-ej.Orientation|string	default-ej.Rating.Orientation.Horizontal
///<br/><br/>
///Helps to provide more precise ratings.Rating control supports three precision modes - full, half, and exact. See Precision
///<br/>precision-ej.Rating.Precision|string	default-full
///<br/><br/>
///Interaction with Rating control can be prevented by enabling this API.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///To specify the height of each shape in Rating control.
///<br/>shapeHeight-number	default-23
///<br/><br/>
///To specify the width of each shape in Rating control.
///<br/>shapeWidth-number	default-23
///<br/><br/>
///Enables the tooltip option.Currently selected value will be displayed in tooltip.
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///To specify the number of stars to be selected while rendering.
///<br/>value-number	default-1
///<br/><br/>
///Specifies the width of the Rating control wrapper.
///<br/>width-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RecurrenceEditor=function(){};
ej.RecurrenceEditor.prototype={

closeRecurPublic:function(){
/// <summary>
/// Generates the recurrence rule with the options selected within the Recurrence Editor.
/// </summary>
},
recurrenceDateGenerator:function(recurrenceString, startDate){
/// <summary>
/// Generates the collection of date, that lies within the selected recurrence start and end date for which the recurrence pattern applies.
/// </summary>
/// <param name="recurrenceString"	type="string">It refers the recurrence rule.</param>
/// <param name="startDate"	type="any">It refers the start date of the recurrence.</param>
},
recurrenceRuleSplit:function(recurrenceRule, exDate){
/// <summary>
/// It splits and returns the recurrence rule string into object collection.
/// </summary>
/// <param name="recurrenceRule"	type="string">It refers recurrence rule for the recurrence editor.</param>
/// <param name="exDate"	type="string">It refers the appointment date of exdate</param>
},
};
jQuery.fn.ejRecurrenceEditor=function(){
this.data("ejRecurrenceEditor",new	ej.RecurrenceEditor());
return this;
};
jQuery.fn.ejRecurrenceEditor = function (options) {
/// <summary><br/>
///The Recurrence Editor includes the entire recurrence related information in a separate portable manner which can be either utilized as a separate widget or else can be embed within the appointment window of Scheduler to enable recurrence options within it. The recurrence rule can be easily generated based on the frequency selected. The customizations like changing the labels of the Recurrence Editor is also possible to achieve through its properties. The frequencies available are Never, Daily, Weekly, Monthly, Yearly and Every weekday.<br/><br/>
///Defines the collection of recurrence frequencies within Recurrence editor such as Never, Daily, Weekly, Monthly, Yearly and Every weekday.
///<br/>frequencies-Array&lt;any&gt;	default-[never, daily, weekly, monthly, yearly, everyweekday]
///<br/><br/>
///Sets the starting day of the week.
///<br/>firstDayOfWeek-string	default-null
///<br/><br/>
///When set to true, enables the spin button of numeric textboxes within the Recurrence editor.
///<br/>enableSpinners-boolean	default-true
///<br/><br/>
///Sets the start date of the recurrence. The Recurrence Editor initially displays the current date as its start date.
///<br/>startDate-any	default-new Date()
///<br/><br/>
///Sets the specific culture to the Recurrence Editor.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the date format for Recurrence Editor.
///<br/>dateFormat-string	default-
///<br/><br/>
///Sets the specific repeat type(frequency) on Recurrence Editor based on the index value provided. For example, setting the value 1 will initially set the repeat type as â€œDailyâ€ and display its related options.
///<br/>selectedRecurrenceType-number	default-0
///<br/><br/>
///Sets the minimum date limit to display on the datepickers defined within the Recurrence Editor. Setting minDate with specific date value disallows the datepickers within  Recurrence Editor to navigate beyond that date.
///<br/>minDate-any	default-new Date(1900, 01, 01)
///<br/><br/>
///Sets the maximum date limit to display on the datepickers used within the Recurrence Editor. Setting maxDate with specific date value disallows the datepickers within the Recurrence Editor to navigate beyond that date.
///<br/>maxDate-any	default-new Date(2099, 12, 31)
///<br/><br/>
///Accepts the custom CSS class name, that defines specific user-defined styles and themes to be applied on partial or complete elements of the Recurrence Editor.
///<br/>cssClass-string	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ReportViewer=function(){};
ej.ReportViewer.prototype={

exportReport:function(){
/// <summary>
/// Export the report to the specified format.
/// </summary>
},
fitToPage:function(){
/// <summary>
/// Fit the report page to the container.
/// </summary>
},
fitToPageHeight:function(){
/// <summary>
/// Fit the report page height to the container.
/// </summary>
},
fitToPageWidth:function(){
/// <summary>
/// Fit the report page width to the container.
/// </summary>
},
getDataSetNames:function(){
/// <summary>
/// Get the available datasets name of the rdlc report.
/// </summary>
},
getParameters:function(){
/// <summary>
/// Get the available parameters of the report.
/// </summary>
},
gotoFirstPage:function(){
/// <summary>
/// Navigate to first page of report.
/// </summary>
},
gotoLastPage:function(){
/// <summary>
/// Navigate to last page of the report.
/// </summary>
},
gotoNextPage:function(){
/// <summary>
/// Navigate to next page from the current page.
/// </summary>
},
gotoPageIndex:function(){
/// <summary>
/// Go to specific page index of the report.
/// </summary>
},
gotoPreviousPage:function(){
/// <summary>
/// Navigate to previous page from the current page.
/// </summary>
},
print:function(){
/// <summary>
/// Print the report.
/// </summary>
},
printLayout:function(){
/// <summary>
/// Apply print layout to the report.
/// </summary>
},
refresh:function(){
/// <summary>
/// Refresh the report.
/// </summary>
},
};
jQuery.fn.ejReportViewer=function(){
this.data("ejReportViewer",new	ej.ReportViewer());
return this;
};
jQuery.fn.ejReportViewer = function (options) {
/// <summary><br/>
///The ReportViewer is a visualization control to view Microsoft SSRS RDL/RDLC files on a web page and it is powered by HTML5/JavaScript. It has support to bind DataSources/Parameters to the Reports and also supports exporting, paging, zooming and printing the report.<br/><br/>
///Gets or sets the list of data sources for the RDLC report.
///<br/>dataSources-Array&lt;DataSources&gt;	default-[]
///<br/><br/>
///Gets or sets the name of the data source.
///<br/>name-string	default-empty
///<br/><br/>
///Gets or sets the values of data source.
///<br/>values-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables or disables the page cache of report.
///<br/>enablePageCache-boolean	default-false
///<br/><br/>
///Specifies the export settings.
///<br/>exportSettings-ExportSettings	default-
///<br/><br/>
///Specifies the export formats.
///<br/>exportOptions-ej.ReportViewer.ExportOptions|string	default-ej.ReportViewer.ExportOptions.All
///<br/><br/>
///Specifies the excel export format.
///<br/>excelFormat-ej.ReportViewer.ExcelFormats|string	default-ej.ReportViewer.ExcelFormats.Excel97to2003
///<br/><br/>
///Specifies the word export format.
///<br/>wordFormat-ej.ReportViewer.WordFormats|string	default-ej.ReportViewer.WordFormats.Doc
///<br/><br/>
///When set to true, adapts the report layout to fit the screen size of devices on which it renders.
///<br/>isResponsive-boolean	default-true
///<br/><br/>
///Specifies the locale for report viewer.
///<br/>locale-string	default-en-US
///<br/><br/>
///Specifies the page settings.
///<br/>pageSettings-PageSettings	default-
///<br/><br/>
///Specifies the print layout orientation.
///<br/>orientation-ej.ReportViewer.Orientation|string	default-null
///<br/><br/>
///Specifies the paper size of print layout.
///<br/>paperSize-ej.ReportViewer.PaperSize|string	default-null
///<br/><br/>
///Gets or sets the list of parameters associated with the report.
///<br/>parameters-Array&lt;Parameters&gt;	default-[]
///<br/><br/>
///Gets or sets the parameter labels.
///<br/>labels-Array&lt;any&gt;	default-null
///<br/><br/>
///Gets or sets the name of the parameter.
///<br/>name-string	default-empty
///<br/><br/>
///Gets or sets whether the parameter allows nullable value or not.
///<br/>nullable-boolean	default-false
///<br/><br/>
///Gets or sets the prompt message associated with the specified parameter.
///<br/>prompt-string	default-empty
///<br/><br/>
///Gets or sets the parameter values.
///<br/>values-Array&lt;any&gt;	default-[]
///<br/><br/>
///Enables and disables the print mode.
///<br/>printMode-boolean	default-false
///<br/><br/>
///Specifies the print option of the report.
///<br/>printOptions-ej.ReportViewer.PrintOptions|string	default-ej.ReportViewer.PrintOptions.Default
///<br/><br/>
///Specifies the processing mode of the report.
///<br/>processingMode-ej.ReportViewer.ProcessingMode|string	default-ej.ReportViewer.ProcessingMode.Remote
///<br/><br/>
///Specifies the render layout.
///<br/>renderMode-ej.ReportViewer.RenderMode|string	default-ej.ReportViewer.RenderMode.Default
///<br/><br/>
///Gets or sets the path of the report file.
///<br/>reportPath-string	default-empty
///<br/><br/>
///Gets or sets the reports server URL.
///<br/>reportServerUrl-string	default-empty
///<br/><br/>
///Specifies the report Web API service URL.
///<br/>reportServiceUrl-string	default-empty
///<br/><br/>
///Specifies the toolbar settings.
///<br/>toolbarSettings-ToolbarSettings	default-
///<br/><br/>
///Fires when user click on toolbar item in the toolbar.
///<br/>click-string	default-empty
///<br/><br/>
///Specifies the toolbar items.
///<br/>items-ej.ReportViewer.ToolbarItems|string	default-ej.ReportViewer.ToolbarItems.All
///<br/><br/>
///Shows or hides the toolbar.
///<br/>showToolbar-boolean	default-true
///<br/><br/>
///Shows or hides the tooltip of toolbar items.
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///Specifies the toolbar template ID.
///<br/>templateId-string	default-empty
///<br/><br/>
///Gets or sets the zoom factor for report viewer.
///<br/>zoomFactor-number	default-1
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Resizable=function(){};
ej.Resizable.prototype={

_destroy:function(){
/// <summary>
/// destroy in the Resizable.
/// </summary>
},
};
jQuery.fn.ejResizable=function(){
this.data("ejResizable",new	ej.Resizable());
return this;
};
jQuery.fn.ejResizable = function (options) {
/// <summary><br/>
///Plugin to make any DOM element Resizable.<br/><br/>
///Sets the offset of the resizing helper relative to the mouse cursor.
///<br/>cursorAt-any	default-{ top: -1, left: -2 }
///<br/><br/>
///Distance in pixels after mousedown the mouse must move before resizing should start. This option can be used to prevent unwanted drags when clicking on an element.
///<br/>distance-number	default-1
///<br/><br/>
///If specified, restricts resize start click to the specified element(s).
///<br/>handle-string	default-null
///<br/><br/>
///Sets the max height for resizing
///<br/>maxHeight-number	default-null
///<br/><br/>
///Sets the max width for resizing
///<br/>maxWidth-number	default-null
///<br/><br/>
///Sets the min Height for resizing
///<br/>minHeight-number	default-10
///<br/><br/>
///Sets the min Width for resizing
///<br/>minWidth-number	default-10
///<br/><br/>
///Used to group sets of resizeable items.
///<br/>scope-string	default-&#39;default&#39;
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Ribbon=function(){};
ej.Ribbon.prototype={

addContextualTabs:function(contextualTabSet, index){
/// <summary>
/// Adds contextual tab or contextual tab set dynamically in the ribbon control with contextual tabs object and index position. When index is null, ribbon contextual tab or contextual tab set is added at the last index.
/// </summary>
/// <param name="contextualTabSet"	type="any">contextual tab or contextual tab set object.</param>
/// <param name="index"	type="number">index of the contextual tab or contextual tab set, this is optional.</param>
},
addTab:function(tabText, ribbonGroups, index){
/// <summary>
/// Adds tab dynamically in the ribbon control with given name, tab group array and index position. When index is null, ribbon tab is added at the last index.
/// </summary>
/// <param name="tabText"	type="string">ribbon tab display text.</param>
/// <param name="ribbonGroups"	type="Array&lt;any&gt;">groups to be displayed in ribbon tab .</param>
/// <param name="index"	type="number">index of the ribbon tab,this is optional.</param>
},
addTabGroup:function(tabIndex, tabGroup, groupIndex){
/// <summary>
/// Adds tab group dynamically in the ribbon control with given tab index, tab group object and group index position. When group index is null, ribbon group is added at the last index.
/// </summary>
/// <param name="tabIndex"	type="number">ribbon tab index.</param>
/// <param name="tabGroup"	type="any">group to be displayed in ribbon tab .</param>
/// <param name="groupIndex"	type="number">index of the ribbon group,this is optional.</param>
},
addTabGroupContent:function(tabIndex, groupIndex, subGroupIndex, content, contentIndex){
/// <summary>
/// Adds group content dynamically in the ribbon control with given tab index, group index, sub group index, content and content index position. When content index is null, content is added at the last index.
/// </summary>
/// <param name="tabIndex"	type="number">ribbon tab index.</param>
/// <param name="groupIndex"	type="number">ribbon group index.</param>
/// <param name="subGroupIndex"	type="number">sub group index in the ribbon group,</param>
/// <param name="content"	type="any">content to be displayed in the ribbon group.</param>
/// <param name="contentIndex"	type="number">ribbon content index .this is optional.</param>
},
hideBackstage:function(){
/// <summary>
/// Hides the ribbon backstage page.
/// </summary>
},
collapse:function(){
/// <summary>
/// Collapses the ribbon tab content.
/// </summary>
},
destroy:function(){
/// <summary>
/// Destroys the ribbon widget. All the events bound using this._on are unbound automatically and the ribbon control is moved to pre-init state.
/// </summary>
},
expand:function(){
/// <summary>
/// Expands the ribbon tab content.
/// </summary>
},
getTabText:function(index){
/// <summary>
/// Gets text of the given index tab in the ribbon control.
/// </summary>
/// <param name="index"	type="number">index of the tab item.</param>
},
hideTab:function(text){
/// <summary>
/// Hides the given text tab in the ribbon control.
/// </summary>
/// <param name="text"	type="string">text of the tab item.</param>
},
isEnable:function(text){
/// <summary>
/// Checks whether the given text tab in the ribbon control is enabled or not.
/// </summary>
/// <param name="text"	type="string">text of the tab item.</param>
},
isVisible:function(text){
/// <summary>
/// Checks whether the given text tab in the ribbon control is visible or not.
/// </summary>
/// <param name="text"	type="string">text of the tab item.</param>
},
removeTab:function(index){
/// <summary>
/// Removes the given index tab item from the ribbon control.
/// </summary>
/// <param name="index"	type="number">index of tab item.</param>
},
setTabText:function(tabText, newText){
/// <summary>
/// Sets new text to the given text tab in the ribbon control.
/// </summary>
/// <param name="tabText"	type="string">current text of the tab item.</param>
/// <param name="newText"	type="string">new text of the tab item.</param>
},
showBackstage:function(){
/// <summary>
/// Displays the ribbon backstage page.
/// </summary>
},
showTab:function(text){
/// <summary>
/// Displays the given text tab in the ribbon control.
/// </summary>
/// <param name="text"	type="string">text of the tab item.</param>
},
};
jQuery.fn.ejRibbon=function(){
this.data("ejRibbon",new	ej.Ribbon());
return this;
};
jQuery.fn.ejRibbon = function (options) {
/// <summary><br/>
///The ribbon can be easily configured to the DOM element, such as div. You can create a ribbon with a highly customizable look and feel.<br/><br/>
///Enables the ribbon resize feature.
///<br/>allowResizing-boolean	default-false
///<br/><br/>
///Specifies the height, width, enableRTL, showRoundedCorner,enabled,cssClass property to the controls in the ribbon commonly andit will work only when those properties are not defined in buttonSettings and content defaults.
///<br/>buttonDefaults-any	default-object
///<br/><br/>
///Property to enable the ribbon quick access toolbar.
///<br/>showQAT-boolean	default-false
///<br/><br/>
///Sets custom setting to the collapsible pin in the ribbon.
///<br/>collapsePinSettings-CollapsePinSettings	default-Object
///<br/><br/>
///Sets tooltip for the collapse pin .
///<br/>toolTip-string	default-null
///<br/><br/>
///Specifies the custom tooltip for collapse pin.Refer to ejRibbon#tabs->groups->content->groups->customToolTip for its inner properties.
///<br/>customToolTip-any	default-Object
///<br/><br/>
///Sets custom setting to the expandable pin in the ribbon.
///<br/>expandPinSettings-ExpandPinSettings	default-Object
///<br/><br/>
///Sets tooltip for the expand pin.
///<br/>toolTip-string	default-null
///<br/><br/>
///Specifies the custom tooltip for expand pin.Refer to ejRibbon#tabs->groups->content->groups->customToolTip for its inner properties.
///<br/>customToolTip-any	default-Object
///<br/><br/>
///Specifies the application tab to contain application menu or backstage page in the ribbon control.
///<br/>applicationTab-ApplicationTab	default-Object
///<br/><br/>
///Specifies the ribbon backstage page items.
///<br/>backstageSettings-any	default-object
///<br/><br/>
///Specifies the display text of application tab.
///<br/>text-string	default-null
///<br/><br/>
///Specifies the height of ribbon backstage page.
///<br/>height-string|number	default-null
///<br/><br/>
///Specifies the width of ribbon backstage page.
///<br/>width-string|number	default-null
///<br/><br/>
///Specifies the ribbon backstage page with its tab and button elements.
///<br/>pages-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the id for ribbon backstage page's tab and button elements.
///<br/>id-string	default-null
///<br/><br/>
///Specifies the text for ribbon backstage page's tab header and button elements.
///<br/>text-string	default-null
///<br/><br/>
///Specifies the type for ribbon backstage page's contents. Set "ej.Ribbon.backStageItemType.tab" to render the tab or "ej.Ribbon.backStageItemType.button" to render the button.
///<br/>itemType-ej.Ribbon.itemType|string	default-ej.Ribbon.itemType.tab
///<br/><br/>
///Specifies the id of HTML elements like div, ul, etc., as ribbon backstage page's tab content.
///<br/>contentID-string	default-null
///<br/><br/>
///Specifies the separator between backstage page's tab and button elements.
///<br/>enableSeparator-boolean	default-false
///<br/><br/>
///Specifies the width of backstage page header that contains tabs and buttons.
///<br/>headerWidth-string|number	default-null
///<br/><br/>
///Specifies the ID of 'ul' list to create application menu in the ribbon control.
///<br/>menuItemID-string	default-null
///<br/><br/>
///Specifies the menu members, events by using the menu settings for the menu in the application tab.
///<br/>menuSettings-any	default-object
///<br/><br/>
///Specifies the application menu or backstage page. Specify the type of application tab as "ej.Ribbon.applicationTabType.menu" to render the application menu or "ej.Ribbon.applicationTabType.backstage" to render backstage page in the ribbon control.
///<br/>type-ej.Ribbon.applicationTabType|string	default-ej.Ribbon.applicationTabType.menu
///<br/><br/>
///Specifies the contextual tabs and tab set to the ribbon control with the background color and border color. Refer to the tabs section for adding tabs into the contextual tab and contextual tab set.
///<br/>contextualTabs-Array&lt;ContextualTabs&gt;	default-array
///<br/><br/>
///Specifies the backgroundColor of the contextual tabs and tab set in the ribbon control.
///<br/>backgroundColor-string	default-null
///<br/><br/>
///Specifies the borderColor of the contextual tabs and tab set in the ribbon control.
///<br/>borderColor-string	default-null
///<br/><br/>
///Specifies the tabs to present in the contextual tabs and tab set. Refer to the tabs section for adding tabs into the contextual tabs and tab set.
///<br/>tabs-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the index or indexes to disable the given index tab or indexes tabs in the ribbon control.
///<br/>disabledItemIndex-Array&lt;any&gt;	default-0
///<br/><br/>
///Specifies the index or indexes to enable the given index tab or indexes tabs in the ribbon control.
///<br/>enabledItemIndex-Array&lt;any&gt;	default-null
///<br/><br/>
///Specifies the index of the ribbon tab to select the given index tab item in the ribbon control.
///<br/>selectedItemIndex-number	default-1
///<br/><br/>
///Specifies the tabs and its groups. Also specifies the control details that has to be placed in the tab area in the ribbon control.
///<br/>tabs-Array&lt;Tabs&gt;	default-array
///<br/><br/>
///Specifies single group or multiple groups and its contents to each tab in the ribbon control.
///<br/>groups-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the alignment of controls in the groups in 'row' type or 'column' type. Value for row type is "ej.Ribbon.alignType.rows" and for column type is "ej.Ribbon.alignType.columns".
///<br/>alignType-ej.Ribbon.alignType|string	default-ej.Ribbon.alignType.rows
///<br/><br/>
///Specifies the Syncfusion button, split button, dropdown list, toggle button, gallery, custom controls to the groups in the ribbon control.
///<br/>content-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the height, width, type, isBig property to the controls in the group commonly.
///<br/>defaults-any	default-object
///<br/><br/>
///Specifies the controls such as Syncfusion button, split button, dropdown list, toggle button, gallery, custom controls in the subgroup of the ribbon tab .
///<br/>groups-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the Syncfusion button members, events by using this buttonSettings.
///<br/>buttonSettings-any	default-object
///<br/><br/>
///It is used to set the count of gallery contents in a row.
///<br/>columns-number	default-null
///<br/><br/>
///Specifies the custom items such as div, table, controls as custom controls with the type "ej.Ribbon.type.custom" in the groups.
///<br/>contentID-string	default-null
///<br/><br/>
///Specifies the CSS class property to apply styles to the button, split, dropdown controls in the groups.
///<br/>cssClass-string	default-null
///<br/><br/>
///Specifies the Syncfusion button and menu as gallery extra items.
///<br/>customGalleryItems-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the Syncfusion button members, events by using buttonSettings.
///<br/>buttonSettings-any	default-object
///<br/><br/>
///Specifies the type as ej.Ribbon.customItemType.menu or ej.Ribbon.customItemType.button to render Syncfusion button and menu.
///<br/>customItemType-ej.Ribbon.customItemType|string	default-ej.Ribbon.customItemType.button
///<br/><br/>
///Specifies the custom tooltip for gallery extra item's button. Refer to ejRibbon#tabs->groups->content->groups->customToolTip for its inner properties.
///<br/>customToolTip-any	default-object
///<br/><br/>
///Specifies the UL list id to render menu as gallery extra item.
///<br/>menuId-string	default-null
///<br/><br/>
///Specifies the Syncfusion menu members, events by using menuSettings.
///<br/>menuSettings-any	default-object
///<br/><br/>
///Specifies the text for gallery extra item's button.
///<br/>text-string	default-null
///<br/><br/>
///Specifies the tooltip for gallery extra item's button.
///<br/>toolTip-string	default-null
///<br/><br/>
///Provides custom tooltip for button, split button, dropdown list, toggle button, custom controls in the sub groups. Text and HTML support are also provided for title and content.
///<br/>customToolTip-any	default-Object
///<br/><br/>
///Sets content to the custom tooltip. Text and HTML support are provided for content.
///<br/>content-string	default-null
///<br/><br/>
///Sets icon to the custom tooltip content.
///<br/>prefixIcon-string	default-null
///<br/><br/>
///Sets title to the custom tooltip. Text and HTML support are provided for title and the title is in bold for text format.
///<br/>title-string	default-null
///<br/><br/>
///Specifies the Syncfusion dropdown list members, events by using this dropdownSettings.
///<br/>dropdownSettings-any	default-object
///<br/><br/>
///Specifies the separator to the control that is in row type group. The separator separates the control from the next control in the group. Set "true" to enable the separator.
///<br/>enableSeparator-boolean	default-false
///<br/><br/>
///Sets the count of gallery contents in a row, when the gallery is in expanded state.
///<br/>expandedColumns-number	default-null
///<br/><br/>
///Defines each gallery content.
///<br/>galleryItems-Array&lt;any&gt;	default-array
///<br/><br/>
///Specifies the Syncfusion button members, events by using buttonSettings.
///<br/>buttonSettings-any	default-object
///<br/><br/>
///Specifies the custom tooltip for gallery content. Refer to ejRibbon#tabs->groups->content->groups->customToolTip for its inner properties.
///<br/>customToolTip-any	default-object
///<br/><br/>
///Sets text for the gallery content.
///<br/>text-string	default-null
///<br/><br/>
///Sets tooltip for the gallery content.
///<br/>toolTip-string	default-null
///<br/><br/>
///Specifies the Id for button, split button, dropdown list, toggle button, gallery, custom controls in the sub groups.
///<br/>id-string	default-null
///<br/><br/>
///Specifies the size for button, split button controls. Set "true" for big size and "false" for small size.
///<br/>isBig-boolean	default-null
///<br/><br/>
///Sets the height of each gallery content.
///<br/>itemHeight-string|number	default-null
///<br/><br/>
///Sets the width of each gallery content.
///<br/>itemWidth-string|number	default-null
///<br/><br/>
///Specifies the Syncfusion split button members, events by using this splitButtonSettings.
///<br/>splitButtonSettings-any	default-object
///<br/><br/>
///Specifies the text for button, split button, toggle button controls in the sub groups.
///<br/>text-string	default-null
///<br/><br/>
///Specifies the Syncfusion toggle button members, events by using toggleButtonSettings.
///<br/>toggleButtonSettings-any	default-object
///<br/><br/>
///Specifies the tooltip for button, split button, dropdown list, toggle button, custom controls in the sub groups.
///<br/>toolTip-string	default-null
///<br/><br/>
///To add,show and hide controls in Quick Access toolbar.
///<br/>quickAccessMode-ej.Ribbon.quickAccessMode|string	default-ej.Ribbon.quickAccessMode.none
///<br/><br/>
///Specifies the type as "ej.Ribbon.type.button" or "ej.Ribbon.type.splitButton" or "ej.Ribbon.type.dropDownList" or "ej.Ribbon.type.toggleButton" or "ej.Ribbon.type.custom" or "ej.Ribbon.type.gallery" to render button, split, dropdown, toggle button, gallery, custom controls.
///<br/>type-ej.Ribbon.type|string	default-ej.Ribbon.type.button
///<br/><br/>
///Specifies the ID of custom items to be placed in the groups.
///<br/>contentID-string	default-null
///<br/><br/>
///Specifies the HTML contents to place into the groups.
///<br/>customContent-string	default-null
///<br/><br/>
///Specifies the group expander for groups in the ribbon control. Set "true" to enable the group expander.
///<br/>enableGroupExpander-boolean	default-false
///<br/><br/>
///Sets custom setting to the groups in the ribbon control.
///<br/>groupExpanderSettings-any	default-Object
///<br/><br/>
///Sets tooltip for the group expander of the group.
///<br/>toolTip-string	default-null
///<br/><br/>
///Specifies the custom tooltip for group expander.Refer to ejRibbon#tabs->groups->content->groups->customToolTip for its inner properties.
///<br/>customToolTip-any	default-Object
///<br/><br/>
///Specifies the text to the groups in the ribbon control.
///<br/>text-string	default-null
///<br/><br/>
///Specifies the custom items such as div, table, controls by using the "custom" type.
///<br/>type-string	default-null
///<br/><br/>
///Specifies the ID for each tab's content panel.
///<br/>id-string	default-null
///<br/><br/>
///Specifies the text of the tab in the ribbon control.
///<br/>text-string	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to customizing the user interface (UI) as locale-specific in order to display regional data i.e. in a language and culture specific to a particular country or region and  it will need to use the user's preference.
///<br/>locale-string	default-en-US
///<br/><br/>
///Specifies the width to the ribbon control. You can set width in string or number format.
///<br/>width-string|number	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Rotator=function(){};
ej.Rotator.prototype={

disable:function(){
/// <summary>
/// Disables the Rotator control.
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the Rotator control.
/// </summary>
},
getIndex:function(){
/// <summary>
/// This method is used to get the current slide index.
/// </summary>
},
gotoIndex:function(index){
/// <summary>
/// This method is used to move a slide to the specified index.
/// </summary>
/// <param name="index"	type="number">index of an slide</param>
},
pause:function(){
/// <summary>
/// This method is used to pause autoplay.
/// </summary>
},
play:function(){
/// <summary>
/// This method is used to move slides continuously (or start autoplay) in the specified autoplay direction.
/// </summary>
},
slideNext:function(){
/// <summary>
/// This method is used to move to the next slide from the current slide. If the current slide is the last slide, then the first slide will be treated as the next slide.
/// </summary>
},
slidePrevious:function(){
/// <summary>
/// This method is used to move to the previous slide from the current slide. If the current slide is the first slide, then the last slide will be treated as the previous slide.
/// </summary>
},
updateTemplateById:function(index, id){
/// <summary>
/// This method is used to update/modify the slide content of template rotator by using id based on index value.
/// </summary>
/// <param name="index"	type="number">index of an slide</param>
/// <param name="id"	type="string">id of a new updated slide</param>
},
};
jQuery.fn.ejRotator=function(){
this.data("ejRotator",new	ej.Rotator());
return this;
};
jQuery.fn.ejRotator = function (options) {
/// <summary><br/>
///The Rotator control displays a set of slides. Each slide may contain images or images with content, or content with user-defined transition between them.<br/><br/>
///Turns on keyboard interaction with the Rotator items. You must set this property to true to access the following keyboard shortcuts:
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Sets the animationSpeed of slide transition.
///<br/>animationSpeed-string|number	default-600
///<br/><br/>
///Specifies the animationType type for the Rotator Item. animationType options include slide, fastSlide, slowSlide, and other custom easing animationTypes.
///<br/>animationType-string	default-slide
///<br/><br/>
///Enables the circular mode item rotation.
///<br/>circularMode-boolean	default-true
///<br/><br/>
///Specify the CSS class to Rotator to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Specify the list of data which contains a set of data fields. Each data value is used to render an item for the Rotator.
///<br/>dataSource-any	default-null
///<br/><br/>
///Sets the delay between the Rotator Items move after the slide transition.
///<br/>delay-number	default-500
///<br/><br/>
///Specifies the number of Rotator Items to be displayed.
///<br/>displayItemsCount-string|number	default-1
///<br/><br/>
///Rotates the Rotator Items continuously without user interference.
///<br/>enableAutoPlay-boolean	default-false
///<br/><br/>
///Enables or disables the Rotator control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies right to left transition of slides.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Defines mapping fields for the data items of the Rotator.
///<br/>fields-Fields	default-null
///<br/><br/>
///Specifies a link for the image.
///<br/>linkAttribute-string	default-
///<br/><br/>
///Specifies where to open a given link.
///<br/>targetAttribute-string	default-
///<br/><br/>
///Specifies a caption for the image.
///<br/>text-string	default-
///<br/><br/>
///Specifies a caption for the thumbnail image.
///<br/>thumbnailText-string	default-
///<br/><br/>
///Specifies the URL for an thumbnail image.
///<br/>thumbnailUrl-string	default-
///<br/><br/>
///Specifies the URL for an image.
///<br/>url-string	default-
///<br/><br/>
///Sets the space between the Rotator Items.
///<br/>frameSpace-string|number	default-
///<br/><br/>
///Resizes the Rotator when the browser is resized.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specifies the number of Rotator Items to navigate on a single click (next/previous/play buttons). The navigateSteps property value must be less than or equal to the displayItemsCount property value.
///<br/>navigateSteps-string|number	default-1
///<br/><br/>
///Specifies the orientation for the Rotator control, that is, whether it must be rendered horizontally or vertically. See Orientation
///<br/>orientation-ej.Orientation|string	default-ej.Orientation.Horizontal
///<br/><br/>
///Specifies the position of the showPager in the Rotator Item. See PagerPosition
///<br/>pagerPosition-string|ej.Rotator.PagerPosition	default-outside
///<br/><br/>
///Retrieves data from remote data. This property is applicable only when a remote data source is used.
///<br/>query-string	default-null
///<br/><br/>
///If the Rotator Item is an image, you can specify a caption for the Rotator Item. The caption text for each Rotator Item must be set by using the title attribute of the respective tag. The caption cannot be displayed if multiple Rotator Items are present.
///<br/>showCaption-boolean	default-false
///<br/><br/>
///Turns on or off the slide buttons (next and previous) in the Rotator Items. Slide buttons are used to navigate the Rotator Items.
///<br/>showNavigateButton-boolean	default-true
///<br/><br/>
///Turns on or off the pager support in the Rotator control. The Pager is used to navigate the Rotator Items.
///<br/>showPager-boolean	default-true
///<br/><br/>
///Enable play / pause button on rotator.
///<br/>showPlayButton-boolean	default-false
///<br/><br/>
///Turns on or off thumbnail support in the Rotator control. Thumbnail is used to navigate between slides. Thumbnail supports only single slide transition You must specify the source for thumbnail elements through the thumbnailSourceID property.
///<br/>showThumbnail-boolean	default-false
///<br/><br/>
///Sets the height of a Rotator Item.
///<br/>slideHeight-string|number	default-
///<br/><br/>
///Sets the width of a Rotator Item.
///<br/>slideWidth-string|number	default-
///<br/><br/>
///Sets the index of the slide that must be displayed first.
///<br/>startIndex-string|number	default-0
///<br/><br/>
///Pause the auto play while hover on the rotator content.
///<br/>stopOnHover-boolean	default-false
///<br/><br/>
///The template to display the Rotator widget with customized appearance.
///<br/>template-string	default-null
///<br/><br/>
///Specifies the source for thumbnail elements.
///<br/>thumbnailSourceID-any	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.RTE=function(){};
ej.RTE.prototype={

createRange:function(){
/// <summary>
/// Returns the range object.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the RTE control.
/// </summary>
},
disableToolbarItem:function(){
/// <summary>
/// Disables the corresponding tool in the RTE ToolBar.
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the RTE control.
/// </summary>
},
enableToolbarItem:function(){
/// <summary>
/// Enables the corresponding tool in the toolbar when the tool is disabled.
/// </summary>
},
executeCommand:function(){
/// <summary>
/// Performs the action value based on the given command.
/// </summary>
},
focus:function(){
/// <summary>
/// Focuses the RTE control.
/// </summary>
},
getCommandStatus:function(){
/// <summary>
/// Gets the command status of the selected text based on the given comment in the RTE control.
/// </summary>
},
getDocument:function(){
/// <summary>
/// Gets the HTML string from the RTE control.
/// </summary>
},
getHtml:function(){
/// <summary>
/// Gets the HTML string from the RTE control.
/// </summary>
},
getSelectedHtml:function(){
/// <summary>
/// Gets the selected HTML string from the RTE control.
/// </summary>
},
getText:function(){
/// <summary>
/// Gets the content as string from the RTE control.
/// </summary>
},
hide:function(){
/// <summary>
/// Hides the RTE control.
/// </summary>
},
insertMenuOption:function(){
/// <summary>
/// Inserts new item to the target contextmenu node.
/// </summary>
},
pasteContent:function(){
/// <summary>
/// This method helps to insert/paste the content at the current cursor (caret) position or the selected content to be replaced with our text by passing the value as parameter to the pasteContent method in the Editor.
/// </summary>
},
refresh:function(){
/// <summary>
/// Refreshes the RTE control.
/// </summary>
},
removeMenuOption:function(){
/// <summary>
/// Removes the target menu item from the RTE contextmenu.
/// </summary>
},
removeToolbarItem:function(){
/// <summary>
/// Removes the given tool from the RTE Toolbar.
/// </summary>
},
selectAll:function(){
/// <summary>
/// Selects all the contents within the RTE.
/// </summary>
},
selectRange:function(){
/// <summary>
/// Selects the contents in the given range.
/// </summary>
},
setColorPickerType:function(){
/// <summary>
/// Sets the color picker model type rendered initially in the RTE control.
/// </summary>
},
setHtml:function(){
/// <summary>
/// Sets the HTML string from the RTE control.
/// </summary>
},
show:function(){
/// <summary>
/// Displays the RTE control.
/// </summary>
},
};
jQuery.fn.ejRTE=function(){
this.data("ejRTE",new	ej.RTE());
return this;
};
jQuery.fn.ejRTE = function (options) {
/// <summary><br/>
///Rich text editor is a component that help you to display or edit the content including tables, hyperlinks, paragraphs, lists, video, and images. The editor supports file and folder management using FileExplorer component.<br/><br/>
///Enables/disables the editing of the content.
///<br/>allowEditing-boolean	default-True
///<br/><br/>
///RTE control can be accessed through the keyboard shortcut keys.
///<br/>allowKeyboardNavigation-boolean	default-True
///<br/><br/>
///When the property is set to true, it focuses the RTE at the time of rendering.
///<br/>autoFocus-boolean	default-false
///<br/><br/>
///Based on the content size, its height is adjusted instead of adding the scrollbar.
///<br/>autoHeight-boolean	default-false
///<br/><br/>
///Sets the colorCode to display the color of the fontColor and backgroundColor in the font tools of the RTE.
///<br/>colorCode-any	default-[000000, FFFFFF, C4C4C4, ADADAD, 595959, 262626, 4f81bd, dbe5f1, b8cce4, 95b3d7, 366092, 244061, c0504d, f2dcdb, e5b9b7, d99694, 953734,632423, 9bbb59, ebf1dd, d7e3bc, c3d69b, 76923c, 4f6128, 8064a2, e5e0ec, ccc1d9, b2a2c7, 5f497a, 3f3151, f79646, fdeada, fbd5b5, fac08f,e36c09, 974806]
///<br/><br/>
///The number of columns given are rendered in the color palate popup.
///<br/>colorPaletteColumns-number	default-6
///<br/><br/>
///The number of rows given are rendered in the color palate popup.
///<br/>colorPaletteRows-number	default-6
///<br/><br/>
///Sets the root class for the RTE theme. This cssClass API helps the usage of custom skinning option for the RTE control by including this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///Enables/disables the RTE controlâ€™s accessibility or interaction.
///<br/>enabled-boolean	default-True
///<br/><br/>
///When the property is set to true, it returns the encrypted text.
///<br/>enableHtmlEncode-boolean	default-false
///<br/><br/>
///Maintain the values of the RTE after page reload.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Shows the resize icon and enables the resize option in the RTE.
///<br/>enableResize-boolean	default-True
///<br/><br/>
///Shows the RTE in the RTL direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Formats the contents based on the XHTML rules.
///<br/>enableXHTML-boolean	default-false
///<br/><br/>
///Enables the tab key action with the RichTextEditor content.
///<br/>enableTabKeyNavigation-boolean	default-True
///<br/><br/>
///Load the external CSS file inside Iframe.
///<br/>externalCSS-string	default-null
///<br/><br/>
///This API allows to enable the file browser support in the RTE control to browse, create, delete and upload the files in the specified current directory.
///<br/>fileBrowser-FileBrowser	default-null
///<br/><br/>
///This API is used to receive the server-side handler for file related operations.
///<br/>ajaxAction-string	default-
///<br/><br/>
///Specifies the file type extension shown in the file browser window.
///<br/>extensionAllow-string	default-
///<br/><br/>
///Specifies the directory to perform operations like create, delete and rename folder and files, and upload the selected files to the current directory.
///<br/>filePath-string	default-
///<br/><br/>
///Sets the fontName in the RTE.
///<br/>fontName-any	default-{text: Segoe UI, value: Segoe UI },{text: Arial, value: Arial,Helvetica,sans-serif },{text: Courier New, value: Courier New,Courier,Monospace },{text: Georgia, value: Georgia,serif },{text: Impact, value: Impact,Charcoal,sans-serif },{text: Lucida Console, value: Lucida Console,Monaco,Monospace },{text: Tahoma, value: Tahoma,Geneva,sans-serif },{text: Times New Roman, value: Times New Roman },{text: Trebuchet MS, value: Trebuchet MS,Helvetica,sans-serif },{text: Verdana, value: Verdana,Geneva,sans-serif}
///<br/><br/>
///Sets the fontSize in the RTE.
///<br/>fontSize-any	default-{ text: 1, value: 1 },{ text: 2 (10pt), value: 2 },{ text: 3 (12pt), value: 3 },{ text: 4 (14pt), value: 4 },{ text: 5 (18pt), value: 5 },{ text: 6 (24pt), value: 6 },{ text: 7 (36pt), value: 7 }
///<br/><br/>
///Sets the format in the RTE.
///<br/>format-string	default-{ text: Paragraph, value: &amp;lt;p&amp;gt;, spriteCssClass: e-paragraph },{ text: Quotation, value: &amp;lt;blockquote&amp;gt;, spriteCssClass: e-quotation },{ text: Heading 1, value: &amp;lt;h1&amp;gt;, spriteCssClass: e-h1 },{ text: Heading 2, value: &amp;lt;h2&amp;gt;, spriteCssClass: e-h2 },{ text: Heading 3, value: &amp;lt;h3&amp;gt;, spriteCssClass: e-h3 },{ text: Heading 4, value: &amp;lt;h4&amp;gt;, spriteCssClass: e-h4 },{ text: Heading 5, value: &amp;lt;h5&amp;gt;, spriteCssClass: e-h5 },{ text: Heading 6, value: &amp;lt;h6&amp;gt;, spriteCssClass: e-h6}
///<br/><br/>
///Defines the height of the RTE textbox.
///<br/>height-string|number	default-370
///<br/><br/>
///Specifies the HTML Attributes of the ejRTE.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Sets the given attributes to the iframe body element.
///<br/>iframeAttributes-any	default-{}
///<br/><br/>
///This API allows the image browser to support in the RTE control to browse, create, delete, and upload the image files to the specified current directory.
///<br/>imageBrowser-ImageBrowser	default-null
///<br/><br/>
///This API is used to receive the server-side handler for the file related operations.
///<br/>ajaxAction-string	default-
///<br/><br/>
///Specifies the file type extension shown in the image browser window.
///<br/>extensionAllow-string	default-
///<br/><br/>
///Specifies the directory to perform operations like create, delete and rename folder and files, and upload the selected images to the current directory.
///<br/>filePath-string	default-
///<br/><br/>
///Enables/disables responsive support for the RTE control toolbar items during the window resizing time.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Sets the culture in the RTE when you set the localization values are needs to be assigned to the corresponding text as follows.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the maximum height for the RTE outer wrapper element.
///<br/>maxHeight-string|number	default-null
///<br/><br/>
///Sets the maximum length for the RTE outer wrapper element.
///<br/>maxLength-number	default-7000
///<br/><br/>
///Sets the maximum width for the RTE outer wrapper element.
///<br/>maxWidth-string|number	default-null
///<br/><br/>
///Sets the minimum height for the RTE outer wrapper element.
///<br/>minHeight-string|number	default-280
///<br/><br/>
///Sets the minimum width for the RTE outer wrapper element.
///<br/>minWidth-string|number	default-400
///<br/><br/>
///Sets the name in the RTE. When the name value is not initialized, the ID value is assigned to the name.
///<br/>name-string	default-
///<br/><br/>
///Shows ClearAll icon in the RTE footer.
///<br/>showClearAll-boolean	default-false
///<br/><br/>
///Shows the clear format in the RTE footer.
///<br/>showClearFormat-boolean	default-true
///<br/><br/>
///Shows the Custom Table in the RTE.
///<br/>showCustomTable-boolean	default-True
///<br/><br/>
///Shows custom contextmenu with the RTE.
///<br/>showContextMenu-boolean	default-True
///<br/><br/>
///This API is used to set the default dimensions for the image and video. When this property is set to true, the image and video dialog displays the dimension option.
///<br/>showDimensions-boolean	default-false
///<br/><br/>
///Shows the FontOption in the RTE.
///<br/>showFontOption-boolean	default-True
///<br/><br/>
///Shows footer in the RTE. When the footer is enabled, it displays the HTML tag, word Count, character count, clear format, resize icon and clear all the content icons, by default.
///<br/>showFooter-boolean	default-false
///<br/><br/>
///Shows the HtmlSource in the RTE footer.
///<br/>showHtmlSource-boolean	default-false
///<br/><br/>
///When the cursor is placed or when the text is selected in the RTE, it displays the tag info in the footer.
///<br/>showHtmlTagInfo-boolean	default-True
///<br/><br/>
///Shows the toolbar in the RTE.
///<br/>showToolbar-boolean	default-True
///<br/><br/>
///Counts the total characters and displays it in the RTE footer.
///<br/>showCharCount-boolean	default-True
///<br/><br/>
///Counts the total words and displays it in the RTE footer.
///<br/>showWordCount-boolean	default-True
///<br/><br/>
///The given number of columns render the insert table pop.
///<br/>tableColumns-number	default-10
///<br/><br/>
///The given number of rows render the insert table pop.
///<br/>tableRows-number	default-8
///<br/><br/>
///Sets the tools in the RTE and gets the inner display order of the corresponding group element. Tools are dependent on the toolsList property.
///<br/>tools-Tools	default-formatStyle: [format],style: [bold, italic, underline, strikethrough],alignment: [justifyLeft, justifyCenter, justifyRight, justifyFull],lists: [unorderedList, orderedList],indenting: [outdent, indent],doAction: [undo, redo],links: [createLink,removeLink],images: [image],media: [video],tables: [createTable, addRowAbove, addRowBelow, addColumnLeft, addColumnRight, deleteRow, deleteColumn, deleteTable]],view:[&#226;€œfullScreen&#226;€,zoomIn,zoomOut],print:[print]
///<br/><br/>
///Specifies the alignment tools and the display order of this tool in the RTE toolbar.
///<br/>alignment-any	default-
///<br/><br/>
///Specifies the casing tools and the display order of this tool in the RTE toolbar.
///<br/>casing-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the clear tools and the display order of this tool in the RTE toolbar.
///<br/>clear-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the clipboard tools and the display order of this tool in the RTE toolbar.
///<br/>clipboard-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the edit tools and the displays tool in the RTE toolbar.
///<br/>edit-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the doAction tools and the display order of this tool in the RTE toolbar.
///<br/>doAction-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the effect of tools and the display order of this tool in RTE toolbar.
///<br/>effects-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the font tools and the display order of this tool in the RTE toolbar.
///<br/>font-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the formatStyle tools and the display order of this tool in the RTE toolbar.
///<br/>formatStyle-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the image tools and the display order of this tool in the RTE toolbar.
///<br/>images-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the indent tools and the display order of this tool in the RTE toolbar.
///<br/>indenting-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the link tools and the display order of this tool in the RTE toolbar.
///<br/>links-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the list tools and the display order of this tool in the RTE toolbar.
///<br/>lists-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the media tools and the display order of this tool in the RTE toolbar.
///<br/>media-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the style tools and the display order of this tool in the RTE toolbar.
///<br/>style-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the table tools and the display order of this tool in the RTE toolbar.
///<br/>tables-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the view tools and the display order of this tool in the RTE toolbar.
///<br/>view-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the print tools and the display order of this tool in the RTE toolbar.
///<br/>print-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the customOrderedList tools and the display order of this tool in the RTE toolbar.
///<br/>customOrderedList-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the name for customOrderedList item.
///<br/>name-string	default-
///<br/><br/>
///Specifies the title for customOrderedList item.
///<br/>tooltip-string	default-
///<br/><br/>
///Specifies the styles for customOrderedList item.
///<br/>css-string	default-
///<br/><br/>
///Specifies the text for customOrderedList item.
///<br/>text-string	default-
///<br/><br/>
///Specifies the list style for customOrderedList item.
///<br/>listStyle-string	default-
///<br/><br/>
///Specifies the image for customOrderedList item.
///<br/>listImage-string	default-
///<br/><br/>
///Specifies the customUnOrderedList tools and the display order of this tool in the RTE toolbar.
///<br/>customUnorderedList-Array&lt;any&gt;	default-
///<br/><br/>
///Specifies the name for customUnorderedList item.
///<br/>name-string	default-
///<br/><br/>
///Specifies the title for customUnorderedList item.
///<br/>tooltip-string	default-
///<br/><br/>
///Specifies the styles for customUnorderedList item.
///<br/>css-string	default-
///<br/><br/>
///Specifies the text for customUnorderedList item.
///<br/>text-string	default-
///<br/><br/>
///Specifies the list style for customUnorderedList item.
///<br/>listStyle-string	default-
///<br/><br/>
///Specifies the image for customUnorderedList item.
///<br/>listImage-string	default-
///<br/><br/>
///Specifies the list of groups and order of those groups displayed in the RTE toolbar.  The toolsList property is used to get the root group order and tools property is used to get the inner order of the corresponding groups displayed. When the value is not specified, it gets its default display order and tools.
///<br/>toolsList-Array&lt;any&gt;	default-[formatStyle, font, style, effects, alignment, lists, indenting, clipboard, doAction, clear, links, images, media, tables, casing,view, customTools,print,edit]
///<br/><br/>
///Gets the undo stack limit.
///<br/>undoStackLimit-number	default-50
///<br/><br/>
///The given string value is displayed in the editable area.
///<br/>value-string	default-null
///<br/><br/>
///Sets the jQuery validation rules to the Rich Text Editor.
///<br/>validationRules-any	default-null
///<br/><br/>
///Sets the jQuery validation error message to the Rich Text Editor.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Defines the width of the RTE textbox.
///<br/>width-string|number	default-786
///<br/><br/>
///Increases and decreases the contents zoom range in percentage
///<br/>zoomStep-string|number	default-0.05
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Schedule=function(){};
ej.Schedule.prototype={

deleteAppointment:function(data){
/// <summary>
/// This method is used to delete the appointment based on the guid value or the appointment data passed to it.
/// </summary>
/// <param name="data"	type="string|any">GUID value of an appointment element or an appointment object</param>
},
destroy:function(){
/// <summary>
/// Destroys the Schedule widget. All the events bound using this._on are unbound automatically and the control is moved to pre-init state.
/// </summary>
},
exportSchedule:function(action, serverEvent, id){
/// <summary>
/// Exports the appointments from the Schedule control.
/// </summary>
/// <param name="action"	type="string">It refers the controller action name to redirect. (For MVC)</param>
/// <param name="serverEvent"	type="string">It refers the server event name.(For ASP)</param>
/// <param name="id"	type="string|number">Pass the id of an appointment, in case if a single appointment needs to be exported. Otherwise, it takes the null value.</param>
},
filterAppointments:function(filterConditions){
/// <summary>
/// Searches and filters the appointments from appointment list of Schedule control.
/// </summary>
/// <param name="filterConditions"	type="Array&lt;any&gt;">Holds array of one or more conditional objects for filtering the appointments based on it.</param>
},
getAppointments:function(){
/// <summary>
/// Gets the complete appointment list of Schedule control.
/// </summary>
},
print:function(data){
/// <summary>
/// Prints the entire Scheduler or a single appointment based on the appointment data passed as an argument to it. Simply calling the print() method, without passing any argument will print the entire Scheduler.
/// </summary>
/// <param name="data"	type="any">Either accepts no arguments at all or else accepts an appointment object.</param>
},
refreshScroller:function(){
/// <summary>
/// Refreshes the Scroller of Scheduler while using it within some other controls or application.
/// </summary>
},
saveAppointment:function(appointmentObject){
/// <summary>
/// It is used to save the appointment. The appointment object is based on the argument passed to this method.
/// </summary>
/// <param name="appointmentObject"	type="any">appointment object which includes appointment details</param>
},
getSlotByElement:function(element){
/// <summary>
/// Retrieves the time slot information (start/end time and resource details) of the given element. The parameter is optional - as when no element is passed to it, the currently selected cell information will be retrieved. When multiple cells are selected in the Scheduler, it is not necessary to provide the parameter.
/// </summary>
/// <param name="element"	type="any">TD element object rendered as Scheduler work cell</param>
},
searchAppointments:function(searchString, field, operator, ignoreCase){
/// <summary>
/// Searches the appointments from the appointment list of Schedule control based on the provided search string in its argument list.
/// </summary>
/// <param name="searchString"	type="any|string">Defines the search word or the filter condition, based on which the appointments are filtered from the list.</param>
/// <param name="field"	type="string">Defines the field name on which the search is to be made.</param>
/// <param name="operator"	type="string|string">Defines the filterOperator value for the search operation.</param>
/// <param name="ignoreCase"	type="boolean">Defines the ignoreCase value for performing the search operation.</param>
},
refresh:function(){
/// <summary>
/// Refreshes the entire Schedule control.
/// </summary>
},
refreshAppointment:function(){
/// <summary>
/// Refreshes only the appointment elements within the Schedule control.
/// </summary>
},
};
jQuery.fn.ejSchedule=function(){
this.data("ejSchedule",new	ej.Schedule());
return this;
};
jQuery.fn.ejSchedule = function (options) {
/// <summary><br/>
///An Event calendar that manages the list of various activities like events/appointments.<br/><br/>
///When set to true, Schedule allows the appointments to be dragged and dropped at required time.
///<br/>allowDragAndDrop-boolean	default-true
///<br/><br/>
///When set to true, Scheduler allows interaction through keyboard shortcut keys.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///It includes the dataSource option and the fields related to Schedule appointments. The appointment fields within the appointmentSettings can accept both string and object type values. To apply validation rules on the appointment window fields, then the appointment fields needs to be defined with object type values.
///<br/>appointmentSettings-AppointmentSettings	default-
///<br/><br/>
///The dataSource option accepts either JSON object collection or DataManager (ej.DataManager) instance that contains Schedule appointments.
///<br/>dataSource-any|Array&lt;any&gt;	default-[]
///<br/><br/>
///It holds either the ej.Query() object or simply the query string that retrieves the specified records from the table.
///<br/>query-string	default-null
///<br/><br/>
///Assign the table name from where the records are to be fetched for the Schedule.
///<br/>tableName-string	default-null
///<br/><br/>
///Binds the id field name in dataSource to the id of Schedule appointments. It denotes the unique id assigned to appointments.
///<br/>id-string	default-null
///<br/><br/>
///Binds the name of startTime field in the dataSource with start time of the Schedule appointments. It indicates the date and Time when Schedule appointment actually starts.
///<br/>startTime-string	default-null
///<br/><br/>
///Binds the name of endTime field in dataSource with the end time of Schedule appointments. It indicates the date and time when Schedule appointment actually ends.
///<br/>endTime-string	default-null
///<br/><br/>
///Binds the name of subject field in the dataSource to appointment Subject. Indicates the Subject or title that gets displayed on Schedule appointments.
///<br/>subject-string	default-null
///<br/><br/>
///Binds the description field name in dataSource. It indicates the appointment description.
///<br/>description-string	default-null
///<br/><br/>
///Binds the name of recurrence field in dataSource. It indicates whether the appointment is a recurrence appointment or not.
///<br/>recurrence-string	default-null
///<br/><br/>
///Binds the name of recurrenceRule field in dataSource. It indicates the recurrence pattern associated with appointments.
///<br/>recurrenceRule-string	default-null
///<br/><br/>
///Binds the name of allDay field in dataSource. It indicates whether the appointment is an all-day appointment or not.
///<br/>allDay-string	default-null
///<br/><br/>
///Binds one or more fields in resource collection dataSource. It maps the resource field names with appointments denoting the resource of appointments actually belongs.
///<br/>resourceFields-string	default-null
///<br/><br/>
///Binds the name of categorize field in dataSource. It indicates the categorize value, red categorize, green, yellow and so on applied to the appointments.
///<br/>categorize-string	default-null
///<br/><br/>
///Binds the name of location field in dataSource. It indicates the appointment location.
///<br/>location-string	default-null
///<br/><br/>
///Binds the name of the priority field in dataSource. It indicates the priority, high, low, medium and none of the appointments.
///<br/>priority-string	default-null
///<br/><br/>
///Binds the name of start timezone field in dataSource. It indicates the timezone of appointment start date. When startTimeZone field is not mentioned, the appointment uses the Schedule timeZone or System timeZone.
///<br/>startTimeZone-string	default-null
///<br/><br/>
///Binds the name of end timezone field in dataSource. It indicates the timezone of appointment end date. When the endTimeZone field is not mentioned, the appointment uses the Schedule timeZone or System timeZone.
///<br/>endTimeZone-string	default-null
///<br/><br/>
///Template design that applies on the Schedule appointments. All the field names that are mapped from dataSource to the appropriate field properties within the appointmentSettings can be used within the template.
///<br/>appointmentTemplateId-string	default-null
///<br/><br/>
///Accepts the custom CSS class name that defines specific user-defined styles and themes to be applied for partial or complete elements of the Schedule.
///<br/>cssClass-string	default-
///<br/><br/>
///Sets various categorize colors to the Schedule appointments to differentiate it.
///<br/>categorizeSettings-CategorizeSettings	default-
///<br/><br/>
///When set to true, enables the multiple selection of categories to be applied for the appointments.
///<br/>allowMultiple-boolean	default-false
///<br/><br/>
///When set to true, enables the categories option to be applied for the appointments.
///<br/>enable-boolean	default-false
///<br/><br/>
///The dataSource option accepts either the JSON object collection or DataManager [ej.DataManager] instance that contains the categorize data.
///<br/>dataSource-Array&lt;any&gt;|any	default-
///<br/><br/>
///Binds id field name in the dataSource to id of category data.
///<br/>id-string	default-id
///<br/><br/>
///Binds text field name in the dataSource to category text.
///<br/>text-string	default-text
///<br/><br/>
///Binds color field name in the dataSource to category color.
///<br/>color-string	default-color
///<br/><br/>
///Binds fontColor field name in the dataSource to category font.
///<br/>fontColor-string	default-fontColor
///<br/><br/>
///Sets the height for Schedule cells.
///<br/>cellHeight-string	default-20px
///<br/><br/>
///Sets the width for Schedule cells.
///<br/>cellWidth-string	default-
///<br/><br/>
///Holds all options related to the context menu settings of Scheduler.
///<br/>contextMenuSettings-ContextMenuSettings	default-
///<br/><br/>
///When set to true, enables the context menu options available for the Schedule cells and appointments.
///<br/>enable-boolean	default-false
///<br/><br/>
///Contains all the default context menu options that are applicable for both Schedule cells and appointments. It also supports adding custom menu items to cells or appointment collection.
///<br/>menuItems-any	default-
///<br/><br/>
///All the appointment related context menu items are grouped under this appointment menu collection.
///<br/>appointment-Array&lt;any&gt;	default-
///<br/><br/>
///All the Scheduler cell related context menu items are grouped under this cells menu item collection.
///<br/>cells-Array&lt;any&gt;	default-
///<br/><br/>
///Sets current date of the Schedule. The Schedule displays initially with the date that is provided here.
///<br/>currentDate-any	default-new Date()
///<br/><br/>
///Sets current view of the Schedule. Schedule renders initially with the view that is specified here. The available views are day, week, workweek, month, agenda and custom view - from which any one of the required view can be set to the Schedule. It accepts both string or enum values. The enum values that are accepted by currentView(ej.Schedule.CurrentView) are as follows,
///<br/>currentView-string|ej.Schedule.CurrentView	default-ej.Schedule.CurrentView.Week
///<br/><br/>
///Sets the date format for Schedule.
///<br/>dateFormat-string	default-
///<br/><br/>
///When set to true, shows the previous/next appointment navigator button on the Scheduler.
///<br/>showAppointmentNavigator-boolean	default-true
///<br/><br/>
///When set to true, enables the resize behavior of appointments within the Schedule.
///<br/>enableAppointmentResize-boolean	default-true
///<br/><br/>
///When set to true, enables the loading of Schedule appointments based on your demand. With this load on demand concept, the data consumption of the Schedule can be limited.
///<br/>enableLoadOnDemand-boolean	default-false
///<br/><br/>
///Saves the current model value to browser cookies for state maintenance. When the page gets refreshed, Schedule control values are retained.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///When set to true, the Schedule layout and behavior changes as per the common RTL conventions.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Sets the end hour time limit to be displayed on the Schedule.
///<br/>endHour-number	default-24
///<br/><br/>
///To configure resource grouping on the Schedule.
///<br/>group-Group	default-
///<br/><br/>
///Holds the array of resource names to be grouped on the Schedule.
///<br/>resources-Array&lt;any&gt;	default-
///<br/><br/>
///Sets the height of the Schedule. Accepts both pixel and percentage values.
///<br/>height-string	default-1120px
///<br/><br/>
///To define the work hours within the Schedule control.
///<br/>workHours-WorkHours	default-
///<br/><br/>
///When set to true, highlights the work hours of the Schedule.
///<br/>highlight-boolean	default-true
///<br/><br/>
///Sets the start time to depict the start of working or business hour in a day.
///<br/>start-number	default-9
///<br/><br/>
///Sets the end time to depict the end of working or business hour in a day.
///<br/>end-number	default-18
///<br/><br/>
///When set to true, enables the Schedule to observe Daylight Saving Time for supported timezones.
///<br/>isDST-boolean	default-false
///<br/><br/>
///When set to true, adapts the Schedule layout to fit the screen size of devices on which it renders.
///<br/>isResponsive-boolean	default-true
///<br/><br/>
///Sets the specific culture to the Schedule.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the maximum date limit to display on the Schedule. Setting maxDate with specific date value disallows the Schedule to navigate beyond that date.
///<br/>maxDate-any	default-new Date(2099, 12, 31)
///<br/><br/>
///Sets the minimum date limit to display on the Schedule. Setting minDate with specific date value disallows the Schedule to navigate beyond that date.
///<br/>minDate-any	default-new Date(1900, 01, 01)
///<br/><br/>
///Sets the mode of Schedule rendering either in a vertical or horizontal direction. It accepts either string("vertical" or "horizontal") or enum values. The enum values that are accepted by orientation(ej.Schedule.Orientation) are as follows,
///<br/>orientation-string|ej.Schedule.Orientation	default-ej.Schedule.Orientation.Vertical
///<br/><br/>
///Holds all the options related to priority settings of the Schedule.
///<br/>prioritySettings-PrioritySettings	default-
///<br/><br/>
///When set to true, enables the priority options available for the Schedule appointments.
///<br/>enable-boolean	default-false
///<br/><br/>
///The dataSource option can accept the JSON object collection that contains the priority related data.
///<br/>dataSource-any|Array&lt;any&gt;	default-{% highlight js%}[{ text: None, value: none },{ text: High, value: high },{ text: Medium, value: medium },{ text: Low, value: low }]{% endhighlight %}
///<br/><br/>
///Binds text field name in the dataSource to prioritySettings text. These text gets listed out in priority field of the appointment window.
///<br/>text-string	default-text
///<br/><br/>
///Binds value field name in the dataSource to prioritySettings value. These field names usually accepts four priority values by default, high, low, medium and none.
///<br/>value-string	default-value
///<br/><br/>
///Allows priority field customization in the appointment window to add custom icons denoting the priority level for the appointments.
///<br/>template-string	default-null
///<br/><br/>
///When set to true, disables the interaction with the Schedule appointments, simply allowing the date and view navigation to occur.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Holds all the options related to reminder settings of the Schedule.
///<br/>reminderSettings-ReminderSettings	default-
///<br/><br/>
///When set to true, enables the reminder option available for the Schedule appointments.
///<br/>enable-boolean	default-false
///<br/><br/>
///Sets the timing, when the reminders are to be alerted for the Schedule appointments.
///<br/>alertBefore-number	default-5
///<br/><br/>
///Defines the specific start and end dates to be rendered in the Schedule control. To render such user-specified custom date ranges in the Schedule control, set the currentView property to customview.
///<br/>renderDates-RenderDates	default-null
///<br/><br/>
///Sets the start of custom date range to be rendered in the Schedule.
///<br/>start-any	default-null
///<br/><br/>
///Sets the end limit of the custom date range.
///<br/>end-any	default-null
///<br/><br/>
///Template design that applies on the Schedule resource header.
///<br/>resourceHeaderTemplateId-string	default-null
///<br/><br/>
///Holds all the options related to the resources settings of the Schedule. It is a collection of one or more resource objects, where the levels of resources are rendered on the Schedule based on the order of the resource data provided within this collection.
///<br/>resources-Array&lt;Resources&gt;	default-null
///<br/><br/>
///It holds the name of the resource field to be bound to the Schedule appointments that contains the resource Id.
///<br/>field-string	default-null
///<br/><br/>
///It holds the title name of the resource field to be displayed on the Schedule appointment window.
///<br/>title-string	default-null
///<br/><br/>
///A unique resource name that is used for differentiating various resource objects while grouping it in various levels.
///<br/>name-string	default-null
///<br/><br/>
///When set to true, allows multiple selection of resource names, thus creating multiple instances of same appointment for the selected resources.
///<br/>allowMultiple-string	default-null
///<br/><br/>
///It holds the field names of the resources to be bound to the Schedule and also the dataSource.
///<br/>resourceSettings-any	default-
///<br/><br/>
///The dataSource option accepts either JSON object collection or DataManager (ejDataManager) instance that contains the resources related data.
///<br/>dataSource-any|Array&lt;any&gt;	default-[]
///<br/><br/>
///Binds text field name in the dataSource to resourceSettings text. These text gets listed out in resources field of the appointment window.
///<br/>text-string	default-null
///<br/><br/>
///Binds id field name in the dataSource to resourceSettings id.
///<br/>id-string	default-null
///<br/><br/>
///Binds groupId field name in the dataSource to resourceSettings groupId.
///<br/>groupId-string	default-null
///<br/><br/>
///Binds color field name in the dataSource to resourceSettings color. The color specified here gets applied to the Schedule appointments denoting to the resource it belongs.
///<br/>color-string	default-null
///<br/><br/>
///Binds the starting work hour field name in the dataSource. It's optional, but providing it with some numeric value will set the starting work hour for specific resources.
///<br/>start-string	default-null
///<br/><br/>
///Binds the end work hour field name in the dataSource. It's optional, but providing it with some numeric value will set the end work hour for specific resources.
///<br/>end-string	default-null
///<br/><br/>
///Binds the resources working days field name in the dataSource. It's optional, and accepts the array of strings (week day names). When provided with specific collection of days (array of day names), only those days will render for the specific resources.
///<br/>workWeek-string	default-null
///<br/><br/>
///Binds appointmentClass field name in the dataSource. It applies custom CSS class name to appointments depicting to the resource it belongs.
///<br/>appointmentClass-string	default-null
///<br/><br/>
///When set to true, displays the all-day row cells on the Schedule.
///<br/>showAllDayRow-boolean	default-true
///<br/><br/>
///When set to true, displays the current time indicator on the Schedule.
///<br/>showCurrentTimeIndicator-boolean	default-true
///<br/><br/>
///When set to true, displays the header bar on the Schedule.
///<br/>showHeaderBar-boolean	default-true
///<br/><br/>
///When set to true, displays the location field additionally on Schedule appointment window.
///<br/>showLocationField-boolean	default-false
///<br/><br/>
///When set to true, displays the quick window for every single click made on the Schedule cells or appointments.
///<br/>showQuickWindow-boolean	default-true
///<br/><br/>
///Sets the start hour time range to be displayed on the Schedule.
///<br/>startHour-number	default-0
///<br/><br/>
///Sets either 12 or 24 hour time mode on the Schedule. It accepts either the string value("12" or "24") or the below mentioned enum values. The enum values that are accepted by timeMode(ej.Schedule.TimeMode) are as follows,
///<br/>timeMode-string|ej.Schedule.TimeMode	default-null
///<br/><br/>
///Sets the timezone for the Schedule.
///<br/>timeZone-string	default-null
///<br/><br/>
///Sets the collection of timezone items to be bound to the Schedule. Only the items bound to this property gets listed out in the timezone field of the appointment window.
///<br/>timeZoneCollection-TimeZoneCollection	default-
///<br/><br/>
///Sets the collection of timezone items to the dataSource that accepts either JSON object collection or DataManager (ej.DataManager) instance that contains Schedule timezones.
///<br/>dataSource-any	default-
///<br/><br/>
///Binds text field name in the dataSource to timeZoneCollection text. These text gets listed out in the timezone fields of the appointment window.
///<br/>text-string	default-text
///<br/><br/>
///Binds id field name in the dataSource to timeZoneCollection id.
///<br/>id-string	default-id
///<br/><br/>
///Binds value field name in the dataSource to timeZoneCollection value.
///<br/>value-string	default-value
///<br/><br/>
///Defines the view collection to be displayed on the Schedule. By default, it displays all the views namely, Day, Week, WorkWeek and Month.
///<br/>views-Array&lt;any&gt;	default-[Day, Week, WorkWeek, Month, Agenda]
///<br/><br/>
///Sets the width of the Schedule. Accepts both pixel and percentage values.
///<br/>width-string	default-100%
///<br/><br/>
///When set to true, Schedule allows the validation of recurrence pattern to take place before it is being assigned to the appointments. For example, when one of the instance of recurrence appointment is dragged beyond the next or previous instance of the same recurrence appointment, a pop-up is displayed with the validation message disallowing the drag functionality.
///<br/>enableRecurrenceValidation-boolean	default-true
///<br/><br/>
///Sets the week to display more than one week appointment summary.
///<br/>agendaViewSettings-AgendaViewSettings	default-
///<br/><br/>
///You can display the summary of multiple week's appointment by setting this value.
///<br/>daysInAgenda-number	default-7
///<br/><br/>
///You can customize the Date column display based on the requirement.
///<br/>dateColumnTemplateId-string	default-null
///<br/><br/>
///You can customize the time column display based on the requirement.
///<br/>timeColumnTemplateId-string	default-null
///<br/><br/>
///Sets specific day as the starting day of the week.
///<br/>firstDayOfWeek-string	default-null
///<br/><br/>
///Sets different day collection within workWeek view.
///<br/>workWeek-Array&lt;any&gt;	default-[Monday, Tuesday, Wednesday, Thursday, Friday]
///<br/><br/>
///Allows to pop-up appointment details in a tooltip while hovering over the appointments.
///<br/>tooltipSettings-TooltipSettings	default-
///<br/><br/>
///Enables or disables the tooltip display.
///<br/>enable-boolean	default-false
///<br/><br/>
///Template design that customizes the tooltip. All the field names that are mapped from dataSource to the appropriate field properties within the appointmentSettings can be accessed within the template.
///<br/>templateId-string	default-null
///<br/><br/>
///Holds all the options related to the time scale of Scheduler. The timeslots either major or minor slots can be customized with this property.
///<br/>timeScale-TimeScale	default-
///<br/><br/>
///When set to true, displays the time slots on the Scheduler.
///<br/>enable-boolean	default-true
///<br/><br/>
///When set with some specific value, defines the number of time divisions split per hour(as per value given for the majorTimeSlot). Those time divisions are meant to be the minor slots.
///<br/>minorSlotCount-number	default-2
///<br/><br/>
///Accepts the value in minutes. When provided with specific value, displays the appropriate time interval on the Scheduler
///<br/>majorSlot-number	default-60
///<br/><br/>
///Template design that customizes the timecells (minor slots) that are partitioned based on minorSlotCount. Accepts id value of the template defined for minor time slots.
///<br/>minorSlotTemplateId-string	default-null
///<br/><br/>
///Template design that customizes the timecells (major slots). Accepts id value of the template defined for major time slots.
///<br/>majorSlotTemplateId-string	default-null
///<br/><br/>
///When set to true, shows the delete confirmation dialog before deleting an appointment.
///<br/>showDeleteConfirmationDialog-boolean	default-true
///<br/><br/>
///Accepts the id value of the template layout defined for the all-day cells and customizes it.
///<br/>allDayCellsTemplateId-string	default-null
///<br/><br/>
///Accepts the id value of the template layout defined for the work cells and month cells.
///<br/>workCellsTemplateId-string	default-null
///<br/><br/>
///Accepts the id value of the template layout defined for the date header cells and customizes it.
///<br/>dateHeaderTemplateId-string	default-null
///<br/><br/>
///when set to false, allows the height of the work-cells to adjust automatically (either expand or collapse) based on the number of appointment count it has.
///<br/>showOverflowButton-boolean	default-true
///<br/><br/>
///Allows setting draggable area for the Scheduler appointments. Also, turns on the external drag and drop, when set with some specific external drag area name.
///<br/>appointmentDragArea-string	default-
///<br/><br/>
///When set to true, displays the other months days from the current month on the Schedule.
///<br/>showNextPrevMonth-boolean	default-true
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Scroller=function(){};
ej.Scroller.prototype={

destroy:function(){
/// <summary>
/// destroy the Scroller control, unbind the all ej control related events automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// User disables the Scroller control at any time.
/// </summary>
},
enable:function(){
/// <summary>
/// User enables the Scroller control at any time.
/// </summary>
},
isHScroll:function(){
/// <summary>
/// Returns true if horizontal scrollbar is shown, else return false.
/// </summary>
},
isVScroll:function(){
/// <summary>
/// Returns true if vertical scrollbar is shown, else return false.
/// </summary>
},
refresh:function(){
/// <summary>
/// User refreshes the Scroller control at any time.
/// </summary>
},
scrollX:function(){
/// <summary>
/// Scroller moves to given pixel in X (left) position. We can also specify the animation speed,in which the scroller has to move while re-positioning it.
/// </summary>
},
scrollY:function(){
/// <summary>
/// Scroller moves to given pixel in Y (top) position. We can also specify the animation speed,in which the scroller has to move while re-positioning it.
/// </summary>
},
};
jQuery.fn.ejScroller=function(){
this.data("ejScroller",new	ej.Scroller());
return this;
};
jQuery.fn.ejScroller = function (options) {
/// <summary><br/>
///The Scroller control has a sliding document whose position corresponds to a value. The document has text, HTML content or images. You can also customize the Scroller control by resizing the scrolling bar and changing the theme.<br/><br/>
///Set true to hides the scrollbar, when mouseout the content area.
///<br/>autoHide-boolean	default-false
///<br/><br/>
///Specifies the height and width of button in the scrollbar.
///<br/>buttonSize-number	default-18
///<br/><br/>
///Specifies to enable or disable the scroller
///<br/>enabled-boolean	default-true
///<br/><br/>
///Save current model value to browser cookies for state maintenance. While refresh the page Rating control values are retained.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Indicates the Right to Left direction to scroller
///<br/>enableRTL-boolean	default-undefined
///<br/><br/>
///Enables or Disable the touch Scroll
///<br/>enableTouchScroll-boolean	default-true
///<br/><br/>
///Specifies the height of Scroll panel and scrollbars.
///<br/>height-number	default-250
///<br/><br/>
///If the scrollbar has vertical it set as width, else it will set as height of the handler.
///<br/>scrollerSize-number	default-18
///<br/><br/>
///The Scroller content and scrollbars move left with given value.
///<br/>scrollLeft-number	default-0
///<br/><br/>
///While press on the arrow key the scrollbar position added to the given pixel value.
///<br/>scrollOneStepBy-number	default-57
///<br/><br/>
///The Scroller content and scrollbars move to top position with specified value.
///<br/>scrollTop-number	default-0
///<br/><br/>
///Indicates the target area to which scroller have to appear.
///<br/>targetPane-string	default-null
///<br/><br/>
///Specifies the width of Scroll panel and scrollbars.
///<br/>width-number	default-0
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Slider=function(){};
ej.Slider.prototype={

disable:function(){
/// <summary>
/// To disable the slider
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the slider
/// </summary>
},
getValue:function(){
/// <summary>
/// To get value from slider handle
/// </summary>
},
setValue:function(){
/// <summary>
/// To set value to slider handle
/// </summary>
},
};
jQuery.fn.ejSlider=function(){
this.data("ejSlider",new	ej.Slider());
return this;
};
jQuery.fn.ejSlider = function (options) {
/// <summary><br/>
///The Slider provides support to select a value from a particular range as well as selects a range value. The Slider has a sliding base on which the handles are moved. There are three types of Sliders such as default Slider, min-range Slider and range Slider.<br/><br/>
///Specifies the allowMouseWheel of the slider.
///<br/>allowMouseWheel-boolean	default-false
///<br/><br/>
///Specifies the animationSpeed of the slider.
///<br/>animationSpeed-number	default-500
///<br/><br/>
///Specify the CSS class to slider to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the animation behavior of the slider.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specifies the state of the slider.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specify the enablePersistence to slider to save current model value to browser cookies for state maintains
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specifies the Right to Left Direction of the slider.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the height of the slider.
///<br/>height-string	default-14
///<br/><br/>
///Specifies the HTML Attributes of the ejSlider.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the incremental step value of the slider.
///<br/>incrementStep-number	default-1
///<br/><br/>
///Specifies the distance between two major (large) ticks from the scale of the slider.
///<br/>largeStep-number	default-10
///<br/><br/>
///Specifies the ending value of the slider.
///<br/>maxValue-number	default-100
///<br/><br/>
///Specifies the starting value of the slider.
///<br/>minValue-number	default-0
///<br/><br/>
///Specifies the orientation of the slider.
///<br/>orientation-ej.Orientation|string	default-ej.orientation.Horizontal
///<br/><br/>
///Specifies the readOnly of the slider.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Specifies the rounded corner behavior for slider.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Shows/Hide the major (large) and minor (small) ticks in the scale of the slider.
///<br/>showScale-boolean	default-false
///<br/><br/>
///Specifies the small ticks from the scale of the slider.
///<br/>showSmallTicks-boolean	default-true
///<br/><br/>
///Specifies the showTooltip to shows the current Slider value, while moving the Slider handle or clicking on the slider handle of the slider.
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///Specifies the sliderType of the slider.
///<br/>sliderType-ej.slider.sliderType|string	default-ej.SliderType.Default
///<br/><br/>
///Specifies the distance between two minor (small) ticks from the scale of the slider.
///<br/>smallStep-number	default-1
///<br/><br/>
///Specifies the value of the slider. But it's not applicable for range slider. To range slider we can use values property.
///<br/>value-number	default-0
///<br/><br/>
///Specifies the values of the range slider. But it's not applicable for default and minRange sliders. we can use value property for default and minRange sliders.
///<br/>values-Array&lt;any&gt;	default-[minValue,maxValue]
///<br/><br/>
///Specifies the width of the slider.
///<br/>width-string	default-100%
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Sparkline=function(){};
ej.Sparkline.prototype={

};
jQuery.fn.ejSparkline=function(){
this.data("ejSparkline",new	ej.Sparkline());
return this;
};
jQuery.fn.ejSparkline = function (options) {
/// <summary><br/>
///Essential sparkline can be easily configured to the DOM element, such as div. You can create a Sparkline with highly customizable look and feel.<br/><br/>
///Background color of the plot area.
///<br/>background-string	default-transparent
///<br/><br/>
///Fill color for the sparkline series.
///<br/>fill-string	default-#33ccff
///<br/><br/>
///Border color of the series.
///<br/>stroke-string	default-null
///<br/><br/>
///Border width of the series.
///<br/>strokeWidth-number	default-1
///<br/><br/>
///Opacity of the series.
///<br/>opacity-number	default-1
///<br/><br/>
///Range band opacity of the series.
///<br/>bandOpacity-number	default-1
///<br/><br/>
///Color for series high point.
///<br/>highPointColor-string	default-null
///<br/><br/>
///Color for series low point.
///<br/>lowPointColor-string	default-null
///<br/><br/>
///Color for series start point.
///<br/>startPointColor-string	default-null
///<br/><br/>
///Color for series end point.
///<br/>endPointColor-string	default-null
///<br/><br/>
///Color for series negative point.
///<br/>negativePointColor-string	default-null
///<br/><br/>
///Start value of the range band.
///<br/>startRange-number	default-null
///<br/><br/>
///End value of the range band.
///<br/>endRange-number	default-null
///<br/><br/>
///Controls whether Sparkline has to be rendered as Canvas or SVG.Canvas rendering supports all functionalities in SVG rendering.
///<br/>enableCanvasRendering-boolean	default-false
///<br/><br/>
///Specifies the dataSource for the series. It can be an array of JSON objects or an instance of ej.DataManager.
///<br/>dataSource-any	default-null
///<br/><br/>
///Name of the property in the datasource that contains x value for the series.
///<br/>xName-string	default-null
///<br/><br/>
///Name of the property in the datasource that contains y value for the series.
///<br/>yName-string	default-null
///<br/><br/>
///Gap or padding for sparkline.
///<br/>padding-number	default-8
///<br/><br/>
///Specifies the type of the series to render in sparkline.
///<br/>type-ej.datavisualization.Sparkline.Type|string	default-line. See Type
///<br/><br/>
///Specifies the theme for Sparkline.
///<br/>theme-ej.datavisualization.Sparkline.Theme|string	default-Flatlight. See Theme
///<br/><br/>
///Options to customize the tooltip.
///<br/>tooltip-Tooltip	default-
///<br/><br/>
///Show/hides the tooltip visibility.
///<br/>visible-boolean	default-false
///<br/><br/>
///Custom template to the tooltip.
///<br/>template-string	default-
///<br/><br/>
///Options for customizing the border of the tooltip.
///<br/>border-any	default-
///<br/><br/>
///Border color of the tooltip.
///<br/>color-string	default-transparent
///<br/><br/>
///Border width of the tooltip.
///<br/>width-number	default-1
///<br/><br/>
///Options for customizing the font of the tooltip.
///<br/>font-any	default-
///<br/><br/>
///Font color of the text in the tooltip.
///<br/>color-string	default-#111111
///<br/><br/>
///Font Family for the tooltip.
///<br/>fontFamily-string	default-Segoe UI
///<br/><br/>
///Specifies the font Style for the tooltip.
///<br/>fontStyle-ej.datavisualization.Sparkline.FontStyle|string	default-Normal
///<br/><br/>
///Specifies the font weight for the tooltip.
///<br/>fontWeight-ej.datavisualization.Sparkline.FontWeight|string	default-Regular
///<br/><br/>
///Opacity for text in the tooltip.
///<br/>opacity-number	default-1
///<br/><br/>
///Font size for text in the tooltip.
///<br/>size-string	default-8px
///<br/><br/>
///Options for displaying and customizing marker for a data point.
///<br/>markerSettings-MarkerSettings	default-
///<br/><br/>
///Controls the visibility of the marker shape.
///<br/>visible-boolean	default-false
///<br/><br/>
///width of the marker shape.
///<br/>width-number	default-2
///<br/><br/>
///Color of the marker shape.
///<br/>color-string	default-#33ccff
///<br/><br/>
///Options for customizing the border of the marker shape.
///<br/>border-any	default-
///<br/><br/>
///Border color of the marker shape.
///<br/>color-string	default-transparent
///<br/><br/>
///Border width of the marker shape.
///<br/>width-number	default-null
///<br/><br/>
///Options to customize the Sparkline size.
///<br/>size-Size	default-
///<br/><br/>
///Height of the Sparkline. Height can be specified in either pixel or percentage.
///<br/>height-string	default-&#39;&#39;
///<br/><br/>
///Width of the Sparkline. Width can be specified in either pixel or percentage.
///<br/>width-string	default-&#39;&#39;
///<br/><br/>
///Options for customizing the color and width of the sparkline border.
///<br/>border-Border	default-
///<br/><br/>
///Border color of the sparkline.
///<br/>color-string	default-&#39;transparent&#39;
///<br/><br/>
///Width of the Sparkline border.
///<br/>width-number	default-1
///<br/><br/>
///Controls the visibility of the axis.
///<br/>showAxis-boolean	default-false
///<br/><br/>
///Options for customizing the color,dashArray and width of the axisLine.
///<br/>axisLine-AxisLine	default-
///<br/><br/>
///Color of the axis line.
///<br/>color-string	default-&#39;#111111&#39;
///<br/><br/>
///Width of the axis line.
///<br/>width-number	default-1
///<br/><br/>
///Dash array of the axis line.
///<br/>dashArray-number	default-1
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.SplitButton=function(){};
ej.SplitButton.prototype={

destroy:function(){
/// <summary>
/// destroy the split button widget all events bound using this._on will be unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable the split button
/// </summary>
},
enable:function(){
/// <summary>
/// To Enable the split button
/// </summary>
},
hide:function(){
/// <summary>
/// To Hide the list content of the split button.
/// </summary>
},
show:function(){
/// <summary>
/// To show the list content of the split button.
/// </summary>
},
};
jQuery.fn.ejSplitButton=function(){
this.data("ejSplitButton",new	ej.SplitButton());
return this;
};
jQuery.fn.ejSplitButton = function (options) {
/// <summary><br/>
///The Split button allows you to perform an action using clicking the button and choosing extra options from the dropdown button. The Split button also can display both text and images.<br/><br/>
///Specifies the arrowPosition of the Split or Dropdown Button.See arrowPosition
///<br/>arrowPosition-string|ej.ArrowPosition	default-ej.ArrowPosition.Right
///<br/><br/>
///Specifies the buttonMode like Split or Dropdown Button.See ButtonMode
///<br/>buttonMode-string|ej.ButtonMode	default-ej.ButtonMode.Split
///<br/><br/>
///Specifies the contentType of the Split Button.See ContentType
///<br/>contentType-string|ej.ContentType	default-ej.ContentType.TextOnly
///<br/><br/>
///Set the root class for Split Button control theme
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the disabling of Split Button if enabled is set to false.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies the enableRTL property for Split Button while initialization.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the height of the Split Button.
///<br/>height-string|number	default-&#226;€œ&#226;€
///<br/><br/>
///Specifies the HTML Attributes of the Split Button.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the imagePosition of the Split Button.See imagePositions
///<br/>imagePosition-string|ej.ImagePosition	default-ej.ImagePosition.ImageRight
///<br/><br/>
///Specifies the image content for Split Button while initialization.
///<br/>prefixIcon-string	default-
///<br/><br/>
///Specifies the showRoundedCorner property for Split Button while initialization.
///<br/>showRoundedCorner-string	default-false
///<br/><br/>
///Specifies the size of the Button. See ButtonSize
///<br/>size-string|ej.ButtonSize	default-ej.ButtonSize.Normal
///<br/><br/>
///Specifies the image content for Split Button while initialization.
///<br/>suffixIcon-string	default-
///<br/><br/>
///Specifies the list content for Split Button while initialization
///<br/>targetID-string	default-
///<br/><br/>
///Specifies the text content for Split Button while initialization.
///<br/>text-string	default-
///<br/><br/>
///Specifies the width of the Split Button.
///<br/>width-string|number	default-&#226;€œ&#226;€
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Splitter=function(){};
ej.Splitter.prototype={

addItem:function(content, property, index){
/// <summary>
/// To add a new pane to splitter control.
/// </summary>
/// <param name="content"	type="string">content of pane.</param>
/// <param name="property"	type="any">pane properties.</param>
/// <param name="index"	type="number">index of pane.</param>
},
collapse:function(paneIndex){
/// <summary>
/// To collapse the splitter control pane.
/// </summary>
/// <param name="paneIndex"	type="number">index number of pane.</param>
},
expand:function(paneIndex){
/// <summary>
/// To expand the splitter control pane.
/// </summary>
/// <param name="paneIndex"	type="number">index number of pane.</param>
},
refresh:function(){
/// <summary>
/// To refresh the splitter control pane resizing.
/// </summary>
},
removeItem:function(index){
/// <summary>
/// To remove a specified pane from the splitter control.
/// </summary>
/// <param name="index"	type="number">index of pane.</param>
},
};
jQuery.fn.ejSplitter=function(){
this.data("ejSplitter",new	ej.Splitter());
return this;
};
jQuery.fn.ejSplitter = function (options) {
/// <summary><br/>
///The Splitter is a layout control that enables you to divide a Web page into distinct areas by inserting resizable panes. You can create any number of Splitter panes and place them inside the Splitter control. The split bars are inserted automatically in between the adjacent panes.<br/><br/>
///Turns on keyboard interaction with the Splitter panes. You must set this property to true to access the keyboard shortcuts of ejSplitter.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Specify animation speed for the Splitter pane movement, while collapsing and expanding.
///<br/>animationSpeed-number	default-300
///<br/><br/>
///Specify the CSS class to splitter control to achieve custom theme.
///<br/>cssClass-string	default-&#226;€œ&#226;€
///<br/><br/>
///Specifies the animation behavior of the splitter.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Specifies the splitter control to be displayed in right to left direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specify height for splitter control.
///<br/>height-string	default-null
///<br/><br/>
///Specifies the HTML Attributes of the Splitter.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specify window resizing behavior for splitter control.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specify the orientation for splitter control. See orientation
///<br/>orientation-ej.Orientation|string	default-ej.orientation.Horizontal or &#226;€œhorizontal&#226;€
///<br/><br/>
///Specify properties for each pane like paneSize, minSize, maxSize, collapsible, resizable.
///<br/>properties-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specify width for splitter control.
///<br/>width-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Spreadsheet=function(){};
ej.Spreadsheet.prototype={

addCustomFormula:function(formulaName, functionName){
/// <summary>
/// This method is used to add custom formulas in Spreadsheet.
/// </summary>
/// <param name="formulaName"	type="string">Pass the name of the formula.</param>
/// <param name="functionName"	type="string">Pass the name of the function.</param>
},
addNewSheet:function(){
/// <summary>
/// This method is used to add a new sheet in the last position of the sheet container.
/// </summary>
},
clearAll:function(range){
/// <summary>
/// It is used to clear all the data and format in the specified range of cells in Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  If range is specified, then it will clear all content in the specified range else it will use the current selected range. </param>
},
clearAllFormat:function(range){
/// <summary>
/// This property is used to clear all the formats applied in the specified range in Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  If range is specified, then it will clear all format in the specified range else it will use the current selected range. </param>
},
clearBorder:function(range){
/// <summary>
/// Used to clear the applied border in the specified range in Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  If range is specified, then it will clear border in the specified range else it will use the current selected range.</param>
},
clearContents:function(range){
/// <summary>
/// This property is used to clear the contents in the specified range in Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  If the range is specified, then it will clear the content in the specified range else it will use the current selected range. </param>
},
clearRange:function(rangeName){
/// <summary>
/// This method is used to remove only the data in the range denoted by the specified range name.
/// </summary>
/// <param name="rangeName"	type="string">Pass the defined rangeSettings property name.</param>
},
clearRangeData:function(range, property, cells, skipHiddenRow, status, skipCell){
/// <summary>
/// It is used to remove data in the specified range of cells based on the defined property.
/// </summary>
/// <param name="range"	type="Array&lt;any&gt;|string">Optional.  If range is specified, it will clear data for the specified range else it will use the current selected range. </param>
/// <param name="property"	type="string">Optional.  If property is specified, it will remove the specified property in the range else it will remove default properties </param>
/// <param name="cells"	type="any">Optional. </param>
/// <param name="skipHiddenRow"	type="boolean">Optional.  If pass true, if you want to skip the hidden rows </param>
/// <param name="status"	type="any">Optional. Pass the status to perform undo and redo operation.</param>
/// <param name="skipCell"	type="any">Optional. It specifies whether to skip element processing or not.</param>
},
copySheet:function(fromIdx, toIdx, isCopySheet){
/// <summary>
/// This method is used to copy sheets in Spreadsheet.
/// </summary>
/// <param name="fromIdx"	type="number">Pass the sheet index that you want to copy.</param>
/// <param name="toIdx"	type="number">Pass the position index where you want to copy.</param>
/// <param name="isCopySheet"	type="boolean">Pass true,If you want to copy sheet or else it will move sheet.</param>
},
deleteEntireColumn:function(startCol, endCol){
/// <summary>
/// This method is used to delete the entire column which is selected.
/// </summary>
/// <param name="startCol"	type="number">Pass the start column index.</param>
/// <param name="endCol"	type="number">Pass the end column index.</param>
},
deleteEntireRow:function(startRow, endRow){
/// <summary>
/// This method is used to delete the entire row which is selected.
/// </summary>
/// <param name="startRow"	type="number">Pass the start row index.</param>
/// <param name="endRow"	type="number">Pass the end row index.</param>
},
deleteSheet:function(idx){
/// <summary>
/// This method is used to delete a particular sheet in the Spreadsheet.
/// </summary>
/// <param name="idx"	type="number">Pass the sheet index to perform delete action.</param>
},
deleteShiftLeft:function(startCell, endCell){
/// <summary>
/// This method is used to delete the selected cells and shift the remaining cells to left.
/// </summary>
/// <param name="startCell"	type="any">Row index and column index of the starting cell.</param>
/// <param name="endCell"	type="any">Row index and column index of the ending cell.</param>
},
deleteShiftUp:function(startCell, endCell){
/// <summary>
/// This method is used to delete the selected cells and shift the remaining cells up.
/// </summary>
/// <param name="startCell"	type="any">Row index and column index of the start cell.</param>
/// <param name="endCell"	type="any">Row index and column index of the end cell.</param>
},
editRange:function(rangeName, fn){
/// <summary>
/// This method is used to edit data in the specified range of cells based on its corresponding rangeSettings.
/// </summary>
/// <param name="rangeName"	type="string">Pass the defined rangeSettings property name.</param>
/// <param name="fn"	type="Function">Pass the function that you want to perform range edit.</param>
},
getActivationPanel:function(){
/// <summary>
/// This method is used to get the activation panel in the Spreadsheet.
/// </summary>
},
getActiveCell:function(sheetIdx){
/// <summary>
/// This method is used to get the active cell object in Spreadsheet. It will returns object which contains rowIndex and colIndex of the active cell.
/// </summary>
/// <param name="sheetIdx"	type="number">Optional.  If sheetIdx is specified, it will return the active cell object in specified sheet index else it will use the current sheet index</param>
},
getActiveCellElem:function(sheetIdx){
/// <summary>
/// This method is used to get the active cell element based on the given sheet index in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Optional.  If sheetIndex is specified, it will return the active cell element in specified sheet index else it will use the current active sheet index.</param>
},
getActiveSheetIndex:function(){
/// <summary>
/// This method is used to get the current active sheet index in Spreadsheet.
/// </summary>
},
getAutoFillElem:function(){
/// <summary>
/// This method is used to get the auto fill element in Spreadsheet.
/// </summary>
},
getCell:function(rowIdx, colIdx, sheetIdx){
/// <summary>
/// This method is used to get the cell element based on specified row and column index in the Spreadsheet.
/// </summary>
/// <param name="rowIdx"	type="number">Pass the row index.</param>
/// <param name="colIdx"	type="number">Pass the column index.</param>
/// <param name="sheetIdx"	type="number">Optional.  Pass the sheet index that you want to get cell.</param>
},
getDataSettings:function(sheetIdx){
/// <summary>
/// This method is used to get the data settings in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index.</param>
},
getFrozenColumns:function(sheetIdx){
/// <summary>
/// This method is used to get the frozen columns index in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index.</param>
},
getFrozenRows:function(sheetIdx){
/// <summary>
/// This method is used to get the frozen rowâ€™s index in Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index.</param>
},
getHyperlink:function(cell){
/// <summary>
/// This method is used to get the hyperlink data as object from the specified cell in Spreadsheet.
/// </summary>
/// <param name="cell"	type="HTMLElement">Pass the DOM element to get hyperlink</param>
},
getRange:function(startRIndex, startCIndex, endRIndex, endCIndex, sheetIdx){
/// <summary>
/// This method is used to get all cell elements in the specified range.
/// </summary>
/// <param name="startRIndex"	type="number">Pass the row index of the start cell.</param>
/// <param name="startCIndex"	type="number">Pass the column index of the start cell.</param>
/// <param name="endRIndex"	type="number">Pass the row index of the end cell.</param>
/// <param name="endCIndex"	type="number">Pass the column index of the end cell.</param>
/// <param name="sheetIdx"	type="number">Pass the index of the sheet.</param>
},
getRangeData:function(options){
/// <summary>
/// This method is used to get the data in specified range in Spreadsheet.
/// </summary>
/// <param name="options"	type="any">Optional.  Pass the range, property, sheetIdx, valueOnly in options. </param>
},
getRangeIndices:function(range){
/// <summary>
/// This method is used to get the range indices array based on the specified alpha range in Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Pass the alpha range that you want to get range indices.</param>
},
getSheet:function(sheetIdx){
/// <summary>
/// This method is used to get the sheet details based on the given sheet index in Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index to get the sheet object.</param>
},
getSheetElement:function(sheetIdx){
/// <summary>
/// This method is used to get the sheet content div element of Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index to get the sheet content.</param>
},
gotoPage:function(sheetIdx, newSheet){
/// <summary>
/// This method is used to send a paging request to the specified sheet Index in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index to perform paging at specified sheet index</param>
/// <param name="newSheet"	type="boolean">Pass 'true' to create a new sheet. If the specified sheet index is already exist, it navigate to that sheet else it create a new sheet.</param>
},
hideColumn:function(startCol, endCol){
/// <summary>
/// This method is used to hide the entire columns from the specified range (startCol, endCol) in Spreadsheet.
/// </summary>
/// <param name="startCol"	type="number">Index of the start column.</param>
/// <param name="endCol"	type="number">Index of the end column.</param>
},
hideFormulaBar:function(){
/// <summary>
/// This method is used to hide the formula bar in Spreadsheet.
/// </summary>
},
hideRow:function(startRow, endRow){
/// <summary>
/// This method is used to hide the rows, based on the specified row index in Spreadsheet.
/// </summary>
/// <param name="startRow"	type="number">Index of the start row.</param>
/// <param name="endRow"	type="number">Index of the end row.</param>
},
hideSheet:function(sheetIdx){
/// <summary>
/// This method is used to hide the sheet based on the specified sheetIndex or sheet name in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="string|number">Pass the sheet name or index that you want to hide.</param>
},
hideWaitingPopUp:function(){
/// <summary>
/// This method is used to hide the displayed waiting pop-up in Spreadsheet.
/// </summary>
},
insertEntireColumn:function(startCol, endCol){
/// <summary>
/// This method is used to insert a column before the active cell's column in the Spreadsheet.
/// </summary>
/// <param name="startCol"	type="number">Pass start column.</param>
/// <param name="endCol"	type="number">Pass end column.</param>
},
insertEntireRow:function(startRow, endRow){
/// <summary>
/// This method is used to insert a row before the active cell's row in the Spreadsheet.
/// </summary>
/// <param name="startRow"	type="number">Pass start row.</param>
/// <param name="endRow"	type="number">Pass end row.</param>
},
insertSheet:function(){
/// <summary>
/// This method is used to insert a new sheet to the left of the current active sheet.
/// </summary>
},
insertShiftBottom:function(startCell, endCell){
/// <summary>
/// This method is used to insert cells in the selected or specified range and shift remaining cells to bottom.
/// </summary>
/// <param name="startCell"	type="any">Row index and column index of the start cell.</param>
/// <param name="endCell"	type="any">Row index and column index of the end cell.</param>
},
insertShiftRight:function(startCell, endCell){
/// <summary>
/// This method is used to insert cells in the selected or specified range and shift remaining cells to right.
/// </summary>
/// <param name="startCell"	type="any">Row index and column index of the start cell.</param>
/// <param name="endCell"	type="any">Row index and column index of the end cell.</param>
},
import:function(importRequest){
/// <summary>
/// This method is used to import excel file manually by using form data.
/// </summary>
/// <param name="importRequest"	type="any">Pass the form data object to import files manually.</param>
},
lockCells:function(range, isLocked){
/// <summary>
/// This method is used to lock/unlock the range of cells in active sheet. Lock cells are activated only after the sheet is protected. Once the sheet is protected it is unable to lock/unlock cells.
/// </summary>
/// <param name="range"	type="string|Array&lt;any&gt;">Pass the alpha range cells or array range of cells.</param>
/// <param name="isLocked"	type="string">Optional.  By default is true. If it is false locked cells are unlocked.</param>
},
mergeAcrossCells:function(range, alertStatus){
/// <summary>
/// This method is used to merge cells by across in the Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  To pass the cell range or selected cells are process.</param>
/// <param name="alertStatus"	type="boolean">Optional.  If pass true it does not show alert.</param>
},
mergeCells:function(range, alertStatus){
/// <summary>
/// This method is used to merge the selected cells in the Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  To pass the cell range or selected cells are process.</param>
/// <param name="alertStatus"	type="boolean">Optional.  If pass true it does not show alert.</param>
},
moveSheet:function(fromIdx, toIdx){
/// <summary>
/// This method is used to move sheets in Spreadsheet.
/// </summary>
/// <param name="fromIdx"	type="number">Pass the sheet index that you want to move.</param>
/// <param name="toIdx"	type="number">Pass the position index where you want to move.</param>
},
protectSheet:function(isProtected){
/// <summary>
/// This method is used to protect or unprotect active sheet.
/// </summary>
/// <param name="isProtected"	type="boolean">Optional.   By default is true. If it is false active sheet is unprotected.</param>
},
refreshContent:function(sheetIdx){
/// <summary>
/// This method is used to refresh the content in Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the index of the sheet.</param>
},
refreshSpreadsheet:function(){
/// <summary>
/// This method is used to refresh the Spreadsheet.
/// </summary>
},
removeCustomFormula:function(formulaName, functionName){
/// <summary>
/// This method is used to remove custom formulae in Spreadsheet.
/// </summary>
/// <param name="formulaName"	type="string">Pass the name of the formula.</param>
/// <param name="functionName"	type="string">Pass the name of the function.</param>
},
removeHyperlink:function(range, isClearHLink, status, cells, skipHiddenRow){
/// <summary>
/// This method is used to remove the hyperlink from selected cells of current sheet.
/// </summary>
/// <param name="range"	type="string">Hyperlink remove from the specified range.</param>
/// <param name="isClearHLink"	type="boolean">Optional.  If it is true, It will clear link only not format.</param>
/// <param name="status"	type="boolean">Optional.  Pass the status to perform undo and redo operations.</param>
/// <param name="cells"	type="any">Optional.  Pass the cells that you want to remove hyperlink.</param>
/// <param name="skipHiddenRow"	type="boolean">Optional.  Pass true, if you want to skip the hidden rows.</param>
},
removeRange:function(rangeName){
/// <summary>
/// This method is used to remove the range data and its defined rangeSettings property based on the specified range name.
/// </summary>
/// <param name="rangeName"	type="string">Pass the defined rangeSetting property name.</param>
},
saveAsJSON:function(){
/// <summary>
/// This method is used to save JSON data in Spreadsheet.
/// </summary>
},
saveBatchChanges:function(sheetIdx){
/// <summary>
/// This method is used to save batch changes in Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index for Spreadsheet.</param>
},
setActiveCell:function(rowIdx, colIdx, sheetIdx){
/// <summary>
/// This method is used to set the active cell in the Spreadsheet.
/// </summary>
/// <param name="rowIdx"	type="number">Pass the row index.</param>
/// <param name="colIdx"	type="number">Pass the column index.</param>
/// <param name="sheetIdx"	type="number">Pass the index of the sheet.</param>
},
setActiveSheetIndex:function(sheetIdx){
/// <summary>
/// This method is used to set active sheet index for the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the active sheet index for Spreadsheet.</param>
},
setBorder:function(property, range){
/// <summary>
/// This method is used to set border for the specified range of cells in the Spreadsheet.
/// </summary>
/// <param name="property"	type="any">Pass the border properties that you want to set.</param>
/// <param name="range"	type="string">Optional.  If range is specified, it will set border for the specified range else it will use the selected range.</param>
},
setHyperlink:function(range, link, sheetIdx){
/// <summary>
/// This method is used to set the hyperlink in selected cells of the current sheet.
/// </summary>
/// <param name="range"	type="string">If range is specified, it will set the hyperlink in range of the cells.</param>
/// <param name="link"	type="any">Pass cellAddress or webAddress</param>
/// <param name="sheetIdx"	type="number">If we pass cellAddress then which sheet to be navigate in the applied link.</param>
},
setSheetFocus:function(){
/// <summary>
/// This method is used to set the focus to the Spreadsheet.
/// </summary>
},
setWidthToColumns:function(widthColl){
/// <summary>
/// This method is used to set the width for the columns in the Spreadsheet.
/// </summary>
/// <param name="widthColl"	type="Array&lt;any&gt;|any">Pass the cell index and width of the cells.</param>
},
sheetRename:function(sheetName){
/// <summary>
/// This method is used to rename the active sheet.
/// </summary>
/// <param name="sheetName"	type="string">Pass the sheet name that you want to change the current active sheet name.</param>
},
showActivationPanel:function(rangeName){
/// <summary>
/// This method is used to display the activationPanel for the specified range name.
/// </summary>
/// <param name="rangeName"	type="string">Pass the range name that you want to display the activation panel.</param>
},
showColumn:function(startColIdx, endColIdx){
/// <summary>
/// This method is used to show the hidden columns within the specified range in the Spreadsheet.
/// </summary>
/// <param name="startColIdx"	type="number">Index of the start column.</param>
/// <param name="endColIdx"	type="number">Index of the end column.</param>
},
showFormulaBar:function(){
/// <summary>
/// This method is used to show the formula bar in Spreadsheet.
/// </summary>
},
showRow:function(startRow, endRow){
/// <summary>
/// This method is used to show the hidden rows in the specified range in the Spreadsheet.
/// </summary>
/// <param name="startRow"	type="number">Index of the start row.</param>
/// <param name="endRow"	type="number">Index of the end row.</param>
},
showWaitingPopUp:function(){
/// <summary>
/// This method is used to show waiting pop-up in Spreadsheet.
/// </summary>
},
unfreezePanes:function(){
/// <summary>
/// This method is used to unfreeze the frozen rows and columns in the Spreadsheet.
/// </summary>
},
unhideSheet:function(sheetInfo){
/// <summary>
/// This method is used to unhide the sheet based on specified sheet name or sheet index.
/// </summary>
/// <param name="sheetInfo"	type="string|number">Pass the sheet name or index that you want to unhide.</param>
},
unmergeCells:function(range){
/// <summary>
/// This method is used to unmerge the selected range of cells in the Spreadsheet.
/// </summary>
/// <param name="range"	type="string">Optional.  If the range is specified, then it will un merge the specified range else it will use the current selected range.</param>
},
unWrapText:function(range){
/// <summary>
/// This method is used to unwrap the selected range of cells in the Spreadsheet.
/// </summary>
/// <param name="range"	type="Array&lt;any&gt;|string">Optional.  If the range is specified, then it will update unwrap in the specified range else it will use the current selected range.</param>
},
updateData:function(data, range){
/// <summary>
/// This method is used to update the data for the specified range of cells in the Spreadsheet.
/// </summary>
/// <param name="data"	type="any">Pass the cells data that you want to update.</param>
/// <param name="range"	type="Array&lt;any&gt;">Optional.  If range is specified, it will update data for the specified range  else it will use the current selected range. </param>
},
updateFormulaBar:function(){
/// <summary>
/// This method is used to update the formula bar in the Spreadsheet.
/// </summary>
},
updateRange:function(sheetIdx, settings){
/// <summary>
/// This method is used to update the range of cells based on the specified settings which we want to update in the Spreadsheet.
/// </summary>
/// <param name="sheetIdx"	type="number">Pass the sheet index that you want to update.</param>
/// <param name="settings"	type="any">Pass the dataSource, startCell and showHeader values as settings.</param>
},
updateUniqueData:function(data, range){
/// <summary>
/// This method is used to update the unique data for the specified range of cells in Spreadsheet.
/// </summary>
/// <param name="data"	type="any">Pass the  data that you want to update in the particular range</param>
/// <param name="range"	type="Array&lt;any&gt;|string">Optional.  If range is specified, it will update data for the specified range else it will use the current selected range.</param>
},
wrapText:function(range){
/// <summary>
/// This method is used to wrap the selected range of cells in the Spreadsheet.
/// </summary>
/// <param name="range"	type="Array&lt;any&gt;|string">Optional.  If the range is specified, then it will update wrap in the specified  range else it will use the current selected range.</param>
},
};
jQuery.fn.ejSpreadsheet=function(){
this.data("ejSpreadsheet",new	ej.Spreadsheet());
return this;
};
jQuery.fn.ejSpreadsheet = function (options) {
/// <summary><br/>
///The Spreadsheet can be easily configured to the DOM element, such as div. you can create a Spreadsheet with a highly customizable look and feel.<br/><br/>
///Gets or sets an active sheet index in the Spreadsheet. By defining this value, you can specify which sheet should be active in workbook.
///<br/>activeSheetIndex-number	default-1
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable auto rendering of cell type in the Spreadsheet.
///<br/>allowAutoCellType-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable auto fill feature in the Spreadsheet.
///<br/>allowAutoFill-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable auto sum feature in the Spreadsheet.
///<br/>allowAutoSum-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable cell format feature in the Spreadsheet. By enabling this, you can customize styles and number formats.
///<br/>allowCellFormatting-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable cell type feature in the Spreadsheet.
///<br/>allowCellType-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable chart feature in the Spreadsheet. By enabling this feature, you can create and customize charts in Spreadsheet.
///<br/>allowCharts-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable clipboard feature in the Spreadsheet. By enabling this feature, you can perform cut/copy and paste operations in Spreadsheet.
///<br/>allowClipboard-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable comment feature in the Spreadsheet. By enabling this, you can add/delete/modify comments in Spreadsheet.
///<br/>allowComments-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable Conditional Format feature in the Spreadsheet. By enabling this, you can apply formatting to the selected range of cells based on the provided conditions (Greater than, Less than, Equal, Between, Contains, etc.).Note: allowCellFormatting must be true while using conditional formatting.
///<br/>allowConditionalFormats-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable data validation feature in the Spreadsheet.
///<br/>allowDataValidation-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the delete action in the Spreadsheet. By enabling this feature, you can delete existing rows, columns, cells and sheet.
///<br/>allowDelete-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable drag and drop feature in the Spreadsheet.
///<br/>allowDragAndDrop-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the edit action in the Spreadsheet.
///<br/>allowEditing-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable filtering feature in the Spreadsheet. Filtering can be used to limit the data displayed using required criteria.
///<br/>allowFiltering-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable table feature in the Spreadsheet. By enabling this, you can render table in selected range.
///<br/>allowFormatAsTable-boolean	default-true
///<br/><br/>
///Get or sets a value that indicates whether to enable or disable format painter feature in the Spreadsheet. By enabling this feature, you can copy the format from the selected range and apply it to another range.
///<br/>allowFormatPainter-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable formula bar in the Spreadsheet.
///<br/>allowFormulaBar-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable freeze pane support in Spreadsheet. After enabling this feature, you can use freeze top row, freeze first column and freeze panes options.
///<br/>allowFreezing-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable hyperlink feature in the Spreadsheet. By enabling this feature, you can add hyperlink which is used to easily navigate to the cell reference from one sheet to another or a web page.
///<br/>allowHyperlink-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable import feature in the Spreadsheet. By enabling this feature, you can open existing Spreadsheet documents.
///<br/>allowImport-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the insert action in the Spreadsheet. By enabling this feature, you can insert new rows, columns, cells and sheet.
///<br/>allowInsert-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable keyboard navigation feature in the Spreadsheet.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable lock cell feature in the Spreadsheet.
///<br/>allowLockCell-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable merge feature in the Spreadsheet.
///<br/>allowMerging-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable resizing feature in the Spreadsheet. By enabling this feature, you can change the column width and row height by dragging its header boundaries.
///<br/>allowResizing-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable find and replace feature in the Spreadsheet. By enabling this, you can easily find and replace a specific value in the sheet or workbook. By using goto behavior, you can select and highlight all cells that contains specific data or data types.
///<br/>allowSearching-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable selection in the Spreadsheet. By enabling this feature, selected items will be highlighted.
///<br/>allowSelection-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable the sorting feature in the Spreadsheet.
///<br/>allowSorting-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable undo and redo feature in the Spreadsheet.
///<br/>allowUndoRedo-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable wrap text feature in the Spreadsheet. By enabling this, cell content can wrap to the next line, if the cell content exceeds the boundary of the cell.
///<br/>allowWrap-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates to define the width of the activation panel in Spreadsheet.
///<br/>apWidth-number	default-200
///<br/><br/>
///Gets or sets an object that indicates to customize the auto fill behavior in the Spreadsheet.
///<br/>autoFillSettings-AutoFillSettings	default-
///<br/><br/>
///This property is used to set fillType unit in Spreadsheet. It has five types which are CopyCells, FillSeries, FillFormattingOnly, FillWithoutFormatting and FlashFill.
///<br/>fillType-ej.Spreadsheet.AutoFillOptions|string	default-ej.Spreadsheet.AutoFillOptions.FillSeries
///<br/><br/>
///Gets or sets a value that indicates to enable or disable auto fill options in the Spreadsheet.
///<br/>showFillOptions-boolean	default-true
///<br/><br/>
///Gets or sets an object that indicates to customize the chart behavior in the Spreadsheet.
///<br/>chartSettings-ChartSettings	default-
///<br/><br/>
///Gets or sets a value that defines the chart height in Spreadsheet.
///<br/>height-number	default-220
///<br/><br/>
///Gets or sets a value that defines the chart width in the Spreadsheet.
///<br/>width-number	default-440
///<br/><br/>
///Gets or sets a value that defines the number of columns displayed in the sheet.
///<br/>columnCount-number	default-21
///<br/><br/>
///Gets or sets a value that indicates to define the common width for each column in the Spreadsheet.
///<br/>columnWidth-number	default-64
///<br/><br/>
///Gets or sets a value that indicates to render the spreadsheet with custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Gets or sets a value that indicates custom formulas in Spreadsheet.
///<br/>customFormulas-any	default-[]
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable context menu in the Spreadsheet.
///<br/>enableContextMenu-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable pivot table in the Spreadsheet.
///<br/>enablePivotTable-boolean	default-false
///<br/><br/>
///Gets or sets an object that indicates to customize the exporting behavior in Spreadsheet.
///<br/>exportSettings-ExportSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable save feature in Spreadsheet. By enabling this feature, you can save existing Spreadsheet.
///<br/>allowExporting-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates to define csvUrl for export to CSV format.
///<br/>csvUrl-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to define excelUrl for export to excel format.Note: User must specify allowExporting true while use this property.
///<br/>excelUrl-string	default-null
///<br/><br/>
///Gets or sets a value that indicates to define password while export to excel format.
///<br/>password-string	default-null
///<br/><br/>
///Gets or sets an object that indicates to customize the format behavior in the Spreadsheet.
///<br/>formatSettings-FormatSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable cell border feature in the Spreadsheet.
///<br/>allowCellBorder-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable decimal places in the Spreadsheet.
///<br/>allowDecimalPlaces-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable font family feature in Spreadsheet.
///<br/>allowFontFamily-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable import while initial loading.
///<br/>importOnLoad-boolean	default-false
///<br/><br/>
///Gets or sets an object that indicates to customize the import behavior in the Spreadsheet.
///<br/>importSettings-ImportSettings	default-
///<br/><br/>
///Sets import mapper to perform import feature in Spreadsheet.
///<br/>importMapper-string	default-
///<br/><br/>
///Sets import URL to access the online files in the Spreadsheet.
///<br/>importUrl-string	default-
///<br/><br/>
///Gets or sets a value that indicates to define password while importing in the Spreadsheet.
///<br/>password-string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to customizing the user interface (UI) as locale-specific in order to display regional data (i.e.) in a language and culture specific to a particular country or region.
///<br/>locale-string	default-en-US
///<br/><br/>
///Gets or sets an object that indicates to customize the picture behavior in the Spreadsheet.
///<br/>pictureSettings-PictureSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable picture feature in Spreadsheet. By enabling this, you can add pictures in Spreadsheet.
///<br/>allowPictures-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates to define height to picture in the Spreadsheet.
///<br/>height-number	default-220
///<br/><br/>
///Gets or sets a value that indicates to define width to picture in the Spreadsheet.
///<br/>width-number	default-440
///<br/><br/>
///Gets or sets an object that indicates to customize the print option in Spreadsheet.
///<br/>printSettings-PrintSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable page setup support for printing in Spreadsheet.
///<br/>allowPageSetup-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable page size support for printing in Spreadsheet.
///<br/>allowPageSize-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable print feature in the Spreadsheet.
///<br/>allowPrinting-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to define the number of rows to be displayed in the sheet.
///<br/>rowCount-number	default-20
///<br/><br/>
///Gets or sets a value that indicates to define the common height for each row in the sheet.
///<br/>rowHeight-number	default-20
///<br/><br/>
///Gets or sets an object that indicates to customize the scroll options in the Spreadsheet.
///<br/>scrollSettings-ScrollSettings	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable scrolling in Spreadsheet.
///<br/>allowScrolling-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable sheet on demand. By enabling this, it render only the active sheet element while paging remaining sheets are created one by one.
///<br/>allowSheetOnDemand-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable virtual scrolling feature in the Spreadsheet.
///<br/>allowVirtualScrolling-boolean	default-true
///<br/><br/>
///Gets or sets the value that indicates to define the height of spreadsheet.
///<br/>height-number|string	default-550
///<br/><br/>
///Gets or sets the value that indicates whether to enable or disable responsive mode in the Spreadsheet.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to set scroll mode in Spreadsheet. It has two scroll modes, Normal and Infinite.
///<br/>scrollMode-ej.Spreadsheet.scrollMode|string	default-ej.Spreadsheet.scrollMode.Infinite
///<br/><br/>
///Gets or sets the value that indicates to define the height off spreadsheet.
///<br/>width-number|string	default-1300
///<br/><br/>
///Gets or sets an object that indicates to customize the selection options in the Spreadsheet.
///<br/>selectionSettings-SelectionSettings	default-
///<br/><br/>
///Gets or sets a value that indicates to define active cell in spreadsheet.
///<br/>activeCell-string	default-
///<br/><br/>
///Gets or sets a value that indicates to define animation time while selection in the Spreadsheet.
///<br/>animationTime-number	default-0.001
///<br/><br/>
///Gets or sets a value that indicates to enable or disable animation while selection.Note: allowSelection must be true while using this property.
///<br/>enableAnimation-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to set selection type in Spreadsheet. It has three types which are Column, Row and default.
///<br/>selectionType-ej.Spreadsheet.SelectionType|string	default-ej.Spreadsheet.SelectionType.Default
///<br/><br/>
///Gets or sets a value that indicates to set selection unit in Spreadsheet. It has three types which are Single, Range and MultiRange.
///<br/>selectionUnit-ej.Spreadsheet.SelectionUnit|string	default-ej.Spreadsheet.SelectionUnit.MultiRange
///<br/><br/>
///Gets or sets a value that indicates to define the number of sheets to be created at the initial load.
///<br/>sheetCount-number	default-1
///<br/><br/>
///Gets or sets an object that indicates to customize the sheet behavior in Spreadsheet.
///<br/>sheets-Array&lt;Sheets&gt;	default-
///<br/><br/>
///Gets or sets a value that indicates to define column count in the Spreadsheet.
///<br/>colCount-number	default-21
///<br/><br/>
///Gets or sets a value that indicates to define column width in the Spreadsheet.
///<br/>columnWidth-number	default-64
///<br/><br/>
///Gets or sets the data to render the Spreadsheet.
///<br/>dataSource-any	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable field as column header in the Spreadsheet.
///<br/>fieldAsColumnHeader-boolean	default-false
///<br/><br/>
///Specifies the header styles for the datasource range in Spreadsheet.
///<br/>headerStyles-any	default-null
///<br/><br/>
///Specifies the primary key for the datasource in Spreadsheet.
///<br/>primaryKey-string	default-
///<br/><br/>
///Specifies the query for the datasource in Spreadsheet.
///<br/>query-any	default-null
///<br/><br/>
///Specifies single range or multiple range settings for a sheet in Spreadsheet.
///<br/>rangeSettings-Array&lt;any&gt;	default-
///<br/><br/>
///Gets or sets the data to render the Spreadsheet.
///<br/>dataSource-any	default-
///<br/><br/>
///Specifies the header styles for the datasource range in Spreadsheet.
///<br/>headerStyles-any	default-null
///<br/><br/>
///Specifies the primary key for the datasource in Spreadsheet.
///<br/>primaryKey-string	default-
///<br/><br/>
///Specifies the query for the datasource in Spreadsheet.
///<br/>query-any	default-null
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the datasource header in Spreadsheet.
///<br/>showHeader-boolean	default-false
///<br/><br/>
///Specifies the start cell for the datasource range in Spreadsheet.
///<br/>startCell-string	default-A1
///<br/><br/>
///Gets or sets a value that indicates to define row count in the Spreadsheet.
///<br/>rowCount-number	default-20
///<br/><br/>
///Sets a value that indicates to define sheet name in the Spreadsheet.
///<br/>sheetName-string	default-Sheet1
///<br/><br/>
///Gets or sets a value that indicates whether to show or hide grid lines in the Spreadsheet.
///<br/>showGridlines-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the datasource header in Spreadsheet.
///<br/>showHeader-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to show or hide headings in the Spreadsheet.
///<br/>showHeadings-boolean	default-true
///<br/><br/>
///Specifies the start cell for the datasource range in Spreadsheet.
///<br/>startCell-string	default-A1
///<br/><br/>
///Gets or sets a value that indicates whether to show or hide ribbon in the Spreadsheet.
///<br/>showRibbon-boolean	default-true
///<br/><br/>
///This is used to set the number of undo-redo steps in the Spreadsheet.
///<br/>undoRedoStep-number	default-20
///<br/><br/>
///Define the username for the Spreadsheet which is displayed in comment.
///<br/>userName-string	default-User Name
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.SymbolPalette=function(){};
ej.SymbolPalette.prototype={

};
jQuery.fn.ejSymbolPalette=function(){
this.data("ejSymbolPalette",new	ej.SymbolPalette());
return this;
};
jQuery.fn.ejSymbolPalette = function (options) {
/// <summary><br/>
///The symbol palette control allows to predefine the frequently used nodes and connectors and to drag and drop those nodes/connectors to drawing area<br/><br/>
///Defines whether the symbols can be dragged from palette or not
///<br/>allowDrag-boolean	default-true
///<br/><br/>
///Customizes the style of the symbol palette
///<br/>cssClass-string	default-e-symbolpalette
///<br/><br/>
///Defines the default properties of nodes and connectors
///<br/>defaultSettings-DefaultSettings	default-
///<br/><br/>
///Defines the default properties of the nodes
///<br/>node-any	default-null
///<br/><br/>
///Defines the default properties of the connectors
///<br/>connector-any	default-null
///<br/><br/>
///Sets the Id of the diagram, over which the symbols will be dropped
///<br/>diagramId-string	default-null
///<br/><br/>
///Sets the height of the palette headers
///<br/>headerHeight-number	default-30
///<br/><br/>
///Defines the height of the symbol palette
///<br/>height-number	default-400
///<br/><br/>
///Defines the height of the palette items
///<br/>paletteItemHeight-number	default-50
///<br/><br/>
///Defines the width of the palette items
///<br/>paletteItemWidth-number	default-50
///<br/><br/>
///An array of JSON objects, where each object represents a node/connector
///<br/>palettes-Array&lt;any&gt;	default-[]
///<br/><br/>
///Defines the preview height of the symbols
///<br/>previewHeight-number	default-100
///<br/><br/>
///Defines the offset value to be left between the mouse cursor and symbol previews
///<br/>previewOffset-any	default-(110, 110)
///<br/><br/>
///Defines the width of the symbol previews
///<br/>previewWidth-number	default-100
///<br/><br/>
///Enable or disable the palette item text
///<br/>showPaletteItemText-boolean	default-true
///<br/><br/>
///The width of the palette
///<br/>width-number	default-250
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Tab=function(){};
ej.Tab.prototype={

addItem:function(URL, displayLabel, index, cssClass, id){
/// <summary>
/// Add new tab items with given name, URL and given index position, if index null itâ€™s add last item.
/// </summary>
/// <param name="URL"	type="string">URL name / tab id.</param>
/// <param name="displayLabel"	type="string">Tab Display name.</param>
/// <param name="index"	type="number">Index position to placed , this is optional.</param>
/// <param name="cssClass"	type="string">specifies cssClass, this is optional.</param>
/// <param name="id"	type="string">specifies id of tab, this is optional.</param>
},
disable:function(){
/// <summary>
/// To disable the tab control.
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the tab control.
/// </summary>
},
getItemsCount:function(){
/// <summary>
/// This function get the number of tab rendered
/// </summary>
},
hide:function(){
/// <summary>
/// This function hides the tab control.
/// </summary>
},
hideItem:function(index){
/// <summary>
/// This function hides the specified item tab in tab control.
/// </summary>
/// <param name="index"	type="number">index of tab item.</param>
},
removeItem:function(index){
/// <summary>
/// Remove the given index tab item.
/// </summary>
/// <param name="index"	type="number">index of tab item.</param>
},
show:function(){
/// <summary>
/// This function is to show the tab control.
/// </summary>
},
showItem:function(index){
/// <summary>
/// This function helps to show the specified hidden tab item in tab control.
/// </summary>
/// <param name="index"	type="number">index of tab item.</param>
},
};
jQuery.fn.ejTab=function(){
this.data("ejTab",new	ej.Tab());
return this;
};
jQuery.fn.ejTab = function (options) {
/// <summary><br/>
///The Tab control is an interface where list of items are expanded from a single item. Each Tab panel defines its header text or header template, as well as a content template. Tab items are dynamically added and removed. Tabs can be loaded with AJAX content that is useful for building dashboards where space is limited.<br/><br/>
///Specifies the ajaxSettings option to load the content to the Tab control.
///<br/>ajaxSettings-AjaxSettings	default-
///<br/><br/>
///It specifies, whether to enable or disable asynchronous request.
///<br/>async-boolean	default-true
///<br/><br/>
///It specifies the page will be cached in the web browser.
///<br/>cache-boolean	default-false
///<br/><br/>
///It specifies the type of data is send in the query string.
///<br/>contentType-string	default-html
///<br/><br/>
///It specifies the data as an object, will be passed in the query string.
///<br/>data-any	default-{}
///<br/><br/>
///It specifies the type of data that you're expecting back from the response.
///<br/>dataType-string	default-html
///<br/><br/>
///It specifies the HTTP request type.
///<br/>type-string	default-get
///<br/><br/>
///Tab items interaction with keyboard keys, like headers active navigation.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Allow to collapsing the active item, while click on the active header.
///<br/>collapsible-boolean	default-false
///<br/><br/>
///Set the root class for Tab theme. This cssClass API helps to use custom skinning option for Tab control.
///<br/>cssClass-string	default-
///<br/><br/>
///Disables the given tab headers and content panels.
///<br/>disabledItemIndex-number[]	default-[]
///<br/><br/>
///Specifies the animation behavior of the tab.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///When this property is set to false, it disables the tab control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Enables the given tab headers and content panels.
///<br/>enabledItemIndex-number[]	default-[]
///<br/><br/>
///Save current model value to browser cookies for state maintains. While refresh the Tab control page the model value apply from browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Display Right to Left direction for headers and panels text of tab.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specify to enable scrolling for Tab header.
///<br/>enableTabScroll-boolean	default-false
///<br/><br/>
///The event API to bind the action for active the tab items.
///<br/>events-string	default-click
///<br/><br/>
///Specifies the position of Tab header as top, bottom, left or right. See below to get available Position
///<br/>headerPosition-string | ej.Tab.Position	default-top
///<br/><br/>
///Set the height of the tab header element. Default this property value is null, so height take content height.
///<br/>headerSize-string|number	default-null
///<br/><br/>
///Height set the outer panel element. Default this property value is null, so height take content height.
///<br/>height-string|number	default-null
///<br/><br/>
///Adjust the content panel height for given option (content, auto and fill), by default panels height adjust based on the content.See below to get available HeightAdjustMode
///<br/>heightAdjustMode-string | ej.Tab.HeightAdjustMode	default-content
///<br/><br/>
///Specifies to hide a pane of Tab control.
///<br/>hiddenItemIndex-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the HTML Attributes of the Tab.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///The idPrefix property appends the given string on the added tab item idâ€™s in runtime.
///<br/>idPrefix-string	default-ej-tab-
///<br/><br/>
///Specifies the Tab header in active for given index value.
///<br/>selectedItemIndex-number	default-0
///<br/><br/>
///Display the close button for each tab items. While clicking on the close icon, particular tab item will be removed.
///<br/>showCloseButton-boolean	default-false
///<br/><br/>
///Display the Reload button for each tab items.
///<br/>showReloadIcon-boolean	default-false
///<br/><br/>
///Tab panels and headers to be displayed in rounded corner style.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Set the width for outer panel element, if not itâ€™s take parent width.
///<br/>width-string|number	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.TagCloud=function(){};
ej.TagCloud.prototype={

insert:function(name){
/// <summary>
/// Inserts a new item into the TagCloud
/// </summary>
/// <param name="name"	type="string">Insert new item into the TagCloud</param>
},
insertAt:function(name, position){
/// <summary>
/// Inserts a new item into the TagCloud at a particular position.
/// </summary>
/// <param name="name"	type="string">Inserts a new item into the TagCloud</param>
/// <param name="position"	type="number">Inserts a new item into the TagCloud with the specified position</param>
},
remove:function(name){
/// <summary>
/// Removes the item from the TagCloud based on the name. It removes all the tags which have the corresponding name
/// </summary>
/// <param name="name"	type="string">name of the tag.</param>
},
removeAt:function(position){
/// <summary>
/// Removes the item from the TagCloud based on the position. It removes the tags from the the corresponding position only.
/// </summary>
/// <param name="position"	type="number">position of tag item.</param>
},
};
jQuery.fn.ejTagCloud=function(){
this.data("ejTagCloud",new	ej.TagCloud());
return this;
};
jQuery.fn.ejTagCloud = function (options) {
/// <summary><br/>
///The TagCloud allows the user to display a list of links or tags with a structured cloud format where the importance of the tags can differentiate with varied font sizes, colors, and styles.<br/><br/>
///Specify the CSS class to button to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///The dataSource contains the list of data to display in a cloud format. Each data contains a link URL, frequency to categorize the font size and a display text.
///<br/>dataSource-any	default-null
///<br/><br/>
///Sets the TagCloud and tag items direction as right to left alignment.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Defines the mapping fields for the data items of the TagCloud.
///<br/>fields-Fields	default-null
///<br/><br/>
///Defines the frequency number to categorize the font size.
///<br/>frequency-number	default-
///<br/><br/>
///Defines the HTML attributes for the anchor elements inside the each tag items.
///<br/>htmlAttributes-any	default-
///<br/><br/>
///Defines the tag value or display text.
///<br/>text-string	default-
///<br/><br/>
///Defines the URL link to navigate while click the tag.
///<br/>url-string	default-
///<br/><br/>
///Defines the format for the TagCloud to display the tag items.See Format
///<br/>format-string|ej.Format	default-ej.Format.Cloud
///<br/><br/>
///Sets the maximum font size value for the tag items. The font size for the tag items will be generated in between the minimum and maximum font size values.
///<br/>maxFontSize-string|number	default-40px
///<br/><br/>
///Sets the minimum font size value for the tag items. The font size for the tag items will be generated in between the minimum and maximum font size values.
///<br/>minFontSize-string|number	default-10px
///<br/><br/>
///Define the query to retrieve the data from online server. The query is used only when the online dataSource is used.
///<br/>query-any	default-null
///<br/><br/>
///Shows or hides the TagCloud title. When this set to false, it hides the TagCloud header.
///<br/>showTitle-boolean	default-true
///<br/><br/>
///Sets the title image for the TagCloud. To show the title image, the showTitle property should be enabled.
///<br/>titleImage-string	default-null
///<br/><br/>
///Sets the title text for the TagCloud. To show the title text, the showTitle property should be enabled.
///<br/>titleText-string	default-Title
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Editor=function(){};
ej.Editor.prototype={

destroy:function(){
/// <summary>
/// destroy the editor widgets all events are unbind automatically and bring the control to pre-init state.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable the corresponding Editors
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the corresponding Editors
/// </summary>
},
getValue:function(){
/// <summary>
/// To get value from corresponding Editors
/// </summary>
},
};
jQuery.fn.ejEditor=function(){
this.data("ejEditor",new	ej.Editor());
return this;
};
jQuery.fn.ejEditor = function (options) {
/// <summary><br/>
///NumericTextBox is used to display only numeric values. It has Spin buttons to increase or decrease the values in the Text Box.<br/><br/>
///Sets the root CSS class for Editors which allow us to customize the appearance.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the number of digits that should be allowed after the decimal point.
///<br/>decimalPlaces-number	default-0
///<br/><br/>
///Specifies the editor control state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specify the enablePersistence to editor to save current editor control value to browser cookies for state maintenance.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specifies the Right to Left Direction to editor.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///When enableStrictMode true it allows the value outside of the range also but it highlights the textbox with error class,otherwise it internally changed to the correct value.
///<br/>enableStrictMode-boolean	default-false
///<br/><br/>
///Specifies the number of digits in each group to the editor.
///<br/>groupSize-string	default-Based on the culture.
///<br/><br/>
///It provides the options to get the customized character to separate the digits. If not set, the separator defined by the current culture.
///<br/>groupSeparator-string	default-null
///<br/><br/>
///Specifies the height of the editor.
///<br/>height-number|string	default-30
///<br/><br/>
///It allows to define the characteristics of the Editors control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///The Editor value increment or decrement based an incrementStep value.
///<br/>incrementStep-number	default-1
///<br/><br/>
///Defines the localization culture for editor.
///<br/>locale-string	default-en-US
///<br/><br/>
///Specifies the maximum value of the editor.
///<br/>maxValue-number	default-Number.MAX_VALUE
///<br/><br/>
///Specifies the minimum value of the editor.
///<br/>minValue-number	default--(Number.MAX_VALUE) and 0 for Currency Textbox.
///<br/><br/>
///Specifies the name of the editor.
///<br/>name-string	default-Sets id as name if it is null.
///<br/><br/>
///Specifies the pattern for formatting positive values in editor.We have maintained some standard to define the negative pattern. you have to specify 'n' to place the digit in your pattern.ejTextbox allows you to define a currency or percent symbol where you want to place it.
///<br/>negativePattern-string	default-Based on the culture
///<br/><br/>
///Specifies the pattern for formatting positive values in editor.We have maintained some standard to define the positive pattern. you have to specify 'n' to place the digit in your pattern.ejTextbox allows you to define a currency or percent symbol where you want to place it.
///<br/>positivePattern-string	default-Based on the culture
///<br/><br/>
///Toggles the readonly state of the editor. When the Editor is readonly it doesn't allow user interactions.
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Specifies to Change the sharped edges into rounded corner for the Editor.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies whether the up and down spin buttons should be displayed in editor.
///<br/>showSpinButton-boolean	default-true
///<br/><br/>
///Enables decimal separator position validation on type .
///<br/>validateOnType-boolean	default-false
///<br/><br/>
///Set the jQuery validation error message in editor.
///<br/>validationMessage-any	default-null
///<br/><br/>
///Set the jQuery validation rules to the editor.
///<br/>validationRules-any	default-null
///<br/><br/>
///Specifies the value of the editor.
///<br/>value-number|string	default-null
///<br/><br/>
///Specifies the watermark text to editor.
///<br/>watermarkText-string	default-
///<br/><br/>
///Specifies the width of the editor.
///<br/>width-number|string	default-143
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Tile=function(){};
ej.Tile.prototype={

updateTemplate:function(name){
/// <summary>
/// Update the image template of tile item to another one.
/// </summary>
/// <param name="name"	type="string">UpdateTemplate by using id</param>
},
};
jQuery.fn.ejTile=function(){
this.data("ejTile",new	ej.Tile());
return this;
};
jQuery.fn.ejTile = function (options) {
/// <summary><br/>
///The Web Tiles are simple, opaque rectangles or squares and they are arrayed on the start screen in a grid-like pattern. Tapping or selecting a Tile, launches the app or does some other action that is represented by the Tile. Tiles are arranged in a group separated by columns that looks like a start screen of a device and it can be either static or live.<br/><br/>
///Section for badge specific functionalities and it represents the notification for tile items.
///<br/>badge-Badge	default-
///<br/><br/>
///Specifies whether to enable badge or not.
///<br/>enabled-boolean	default-false
///<br/><br/>
///Specifies maximum value for tile badge.
///<br/>maxValue-number	default-100
///<br/><br/>
///Specifies minimum value for tile badge.
///<br/>minValue-number	default-1
///<br/><br/>
///Specifies text instead of number for tile badge.
///<br/>text-string	default-null
///<br/><br/>
///Sets value for tile badge.
///<br/>value-number	default-1
///<br/><br/>
///Sets position for tile badge.
///<br/>position-ej.Tile.BadgePosition|string	default-&#226;€œbottomright&#226;€
///<br/><br/>
///Section for caption specific functionalities and it represents the notification for tile items.
///<br/>caption-Caption	default-
///<br/><br/>
///Specifies whether the tile text to be shown or hidden.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Changes the text of a tile.
///<br/>text-string	default-Text
///<br/><br/>
///It is used to align the text of a tile.
///<br/>alignment-ej.Tile.CaptionAlignment|string	default-normal
///<br/><br/>
///It is used to specify the caption position like Inner top,  inner bottom and outer.
///<br/>position-ej.Tile.CaptionPosition|string	default-Innerbottom
///<br/><br/>
///sets the icon instead of text.
///<br/>icon-string	default-null
///<br/><br/>
///Sets the root class for Tile theme. This cssClass API helps to use custom skinning option for Tile control. By defining the root class using this API, we need to include this root class in CSS.
///<br/>cssClass-string	default-
///<br/><br/>
///Saves current model value to browser cookies for state maintains. While refreshing the page retains the model value applies from browser cookies.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Customize the tile size height.
///<br/>height-number	default-null
///<br/><br/>
///Specifies Tile imageClass, using this property we can give images for each tile through CSS classes.
///<br/>imageClass-string	default-null
///<br/><br/>
///Specifies the position of tile image.
///<br/>imagePosition-ej.Tile.ImagePosition|string	default-center
///<br/><br/>
///Specifies the tile image in outside of template content.
///<br/>imageTemplateId-string	default-null
///<br/><br/>
///Specifies the URL of tile image.
///<br/>imageUrl-string	default-null
///<br/><br/>
///Section for liveTile specific functionalities.
///<br/>liveTile-LiveTile	default-
///<br/><br/>
///Specifies whether to enable liveTile or not.
///<br/>enabled-boolean	default-false
///<br/><br/>
///Specifies liveTile images in CSS classes.
///<br/>imageClass-string	default-null
///<br/><br/>
///Specifies liveTile images in templates.
///<br/>imageTemplateId-string	default-null
///<br/><br/>
///Specifies liveTile images in CSS classes.
///<br/>imageUrl-string	default-null
///<br/><br/>
///Specifies liveTile type for Tile. See orientation
///<br/>type-ej.Tile.liveTileType|string	default-flip
///<br/><br/>
///Specifies time interval between two successive liveTile animation
///<br/>updateInterval-number	default-2000
///<br/><br/>
///Sets the text to each living tile
///<br/>text-Array&lt;any&gt;	default-Null
///<br/><br/>
///Specifies the size of a tile.  See tileSize
///<br/>tileSize-ej.Tile.TileSize|string	default-small
///<br/><br/>
///Customize the tile size width.
///<br/>width-number	default-null
///<br/><br/>
///Sets the rounded corner to  tile.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Sets allowSelection to  tile.
///<br/>allowSelection-boolean	default-false
///<br/><br/>
///Sets the background color to  tile.
///<br/>backgroundColor-string	default-false
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.TimePicker=function(){};
ej.TimePicker.prototype={

disable:function(){
/// <summary>
/// Allows you to disable the TimePicker.
/// </summary>
},
enable:function(){
/// <summary>
/// Allows you to enable the TimePicker.
/// </summary>
},
getValue:function(){
/// <summary>
/// It returns the current time value.
/// </summary>
},
hide:function(){
/// <summary>
/// This method will hide the TimePicker control popup.
/// </summary>
},
setCurrentTime:function(){
/// <summary>
/// Updates the current system time in TimePicker.
/// </summary>
},
show:function(){
/// <summary>
/// This method will show the TimePicker control popup.
/// </summary>
},
};
jQuery.fn.ejTimePicker=function(){
this.data("ejTimePicker",new	ej.TimePicker());
return this;
};
jQuery.fn.ejTimePicker = function (options) {
/// <summary><br/>
///The TimePicker control for JavaScript allows users to select a time value. The available times can be restricted to a range by setting minimum and maximum time values. The TimePicker sets the time as a mask to prevent users from entering invalid values.<br/><br/>
///Sets the root CSS class for the TimePicker theme, which is used to customize.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the animation behavior in TimePicker.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///When this property is set to false, it disables the TimePicker control.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Save current model value to browser cookies for maintaining states. When refreshing the TimePicker control page, the model value is applied from browser cookies or HTML 5local storage.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Displays the TimePicker as right to left alignment.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///When the enableStrictMode is set as true it allows the value outside of the range and also indicate with red color border, otherwise it internally changed to the min or max range value based an input value.
///<br/>enableStrictMode-boolean	default-false
///<br/><br/>
///Specifies the list of time range to disable
///<br/>disableTimeRanges-any	default-{}
///<br/><br/>
///Defines the height of the TimePicker textbox.
///<br/>height-string|number	default-
///<br/><br/>
///Sets the step value for increment an hour value through arrow keys or mouse scroll.
///<br/>hourInterval-number	default-1
///<br/><br/>
///It allows to define the characteristics of the TimePicker control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Sets the time interval between the two adjacent time values in the popup.
///<br/>interval-number	default-30
///<br/><br/>
///Defines the localization info used by the TimePicker.
///<br/>locale-string	default-en-US
///<br/><br/>
///Sets the maximum time value to the TimePicker.
///<br/>maxTime-string	default-11:59:59 PM
///<br/><br/>
///Sets the minimum time value to the TimePicker.
///<br/>minTime-string	default-12:00:00 AM
///<br/><br/>
///Sets the step value for increment the minute value through arrow keys or mouse scroll.
///<br/>minutesInterval-number	default-1
///<br/><br/>
///Defines the height of the TimePicker popup.
///<br/>popupHeight-string|number	default-191px
///<br/><br/>
///Defines the width of the TimePicker popup.
///<br/>popupWidth-string|number	default-auto
///<br/><br/>
///Toggles the readonly state of the TimePicker
///<br/>readOnly-boolean	default-false
///<br/><br/>
///Sets the step value for increment the seconds value through arrow keys or mouse scroll.
///<br/>secondsInterval-number	default-1
///<br/><br/>
///shows or hides the drop down button in TimePicker.
///<br/>showPopupButton-boolean	default-true
///<br/><br/>
///TimePicker is displayed with rounded corner when this property is set to true.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Defines the time format displayed in the TimePicker.
///<br/>timeFormat-string	default-h:mm tt
///<br/><br/>
///Sets a specified time value on the TimePicker.
///<br/>value-string|Date	default-null
///<br/><br/>
///Defines the width of the TimePicker textbox.
///<br/>width-string|number	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.ToggleButton=function(){};
ej.ToggleButton.prototype={

destroy:function(){
/// <summary>
/// Allows you to destroy the ToggleButton widget.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable the ToggleButton to prevent all user interactions.
/// </summary>
},
enable:function(){
/// <summary>
/// To enable the ToggleButton.
/// </summary>
},
};
jQuery.fn.ejToggleButton=function(){
this.data("ejToggleButton",new	ej.ToggleButton());
return this;
};
jQuery.fn.ejToggleButton = function (options) {
/// <summary><br/>
///The Toggle Button allows you to perform the toggle option by using checked and unchecked state. This Toggle Button can be helpful to user to check their states. The Toggle Button control displays both text and images.<br/><br/>
///Specify the icon in active state to the toggle button and it will be aligned from left margin of the button.
///<br/>activePrefixIcon-string	default-
///<br/><br/>
///Specify the icon in active state to the toggle button and it will be aligned from right margin of the button.
///<br/>activeSuffixIcon-string	default-
///<br/><br/>
///Sets the text when ToggleButton is in active state i.e.,checked state.
///<br/>activeText-string	default-null
///<br/><br/>
///Specifies the contentType of the ToggleButton. See ContentType as below
///<br/>contentType-ej.ContentType|string	default-ej.ContentType.TextOnly
///<br/><br/>
///Specify the CSS class to the ToggleButton to achieve custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Specify the icon in default state to the toggle button and it will be aligned from left margin of the button.
///<br/>defaultPrefixIcon-string	default-
///<br/><br/>
///Specify the icon in default state to the toggle button and it will be aligned from right margin of the button.
///<br/>defaultSuffixIcon-string	default-
///<br/><br/>
///Specifies the text of the ToggleButton, when the control is a default state. i.e., unChecked state.
///<br/>defaultText-string	default-null
///<br/><br/>
///Specifies the state of the ToggleButton.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Save current model value to browser cookies for maintaining states. When refreshing the ToggleButton control page, the model value is applied from browser cookies or HTML 5local storage.
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Specify the Right to Left direction of the ToggleButton.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Specifies the height of the ToggleButton.
///<br/>height-number|string	default-28pixel
///<br/><br/>
///It allows to define the characteristics of the ToggleButton control. It will helps to extend the capability of an HTML element.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the image position of the ToggleButton.
///<br/>imagePosition-ej.ImagePosition|string	default-ej.ImagePosition.ImageLeft
///<br/><br/>
///Allows to prevents the control switched to checked (active) state.
///<br/>preventToggle-boolean	default-false
///<br/><br/>
///Displays the ToggleButton with rounded corners.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the size of the ToggleButton. See ButtonSize as below
///<br/>size-ej.ButtonSize|string	default-ej.ButtonSize.Normal
///<br/><br/>
///It allows to define the ToggleButton state to checked(Active) or unchecked(Default) at initial time.
///<br/>toggleState-boolean	default-false
///<br/><br/>
///Specifies the type of the ToggleButton. See ButtonType as below
///<br/>type-ej.ButtonType|string	default-ej.ButtonType.Button
///<br/><br/>
///Specifies the width of the ToggleButton.
///<br/>width-number|string	default-100pixel
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Toolbar=function(){};
ej.Toolbar.prototype={

deselectItem:function(element){
/// <summary>
/// Deselect the specified Toolbar item.
/// </summary>
/// <param name="element"	type="any">The element need to be deselected</param>
},
deselectItemByID:function(ID){
/// <summary>
/// Deselect the Toolbar item based on specified id.
/// </summary>
/// <param name="ID"	type="string">The ID of the element need to be deselected</param>
},
destroy:function(){
/// <summary>
/// Allows you to destroy the Toolbar widget.
/// </summary>
},
disable:function(){
/// <summary>
/// To disable all items in the Toolbar control.
/// </summary>
},
disableItem:function(element){
/// <summary>
/// Disable the specified Toolbar item.
/// </summary>
/// <param name="element"	type="any">The element need to be disabled</param>
},
disableItemByID:function(ID){
/// <summary>
/// Disable the Toolbar item based on specified item id in the Toolbar.
/// </summary>
/// <param name="ID"	type="string">The ID of the element need to be disabled</param>
},
enable:function(){
/// <summary>
/// Enable the Toolbar if it is in disabled state.
/// </summary>
},
enableItem:function(element){
/// <summary>
/// Enable the Toolbar item based on specified item.
/// </summary>
/// <param name="element"	type="any">The element need to be enabled</param>
},
enableItemByID:function(ID){
/// <summary>
/// Enable the Toolbar item based on specified item id in the Toolbar.
/// </summary>
/// <param name="ID"	type="string">The ID of the element need to be enabled</param>
},
hide:function(){
/// <summary>
/// To hide the Toolbar
/// </summary>
},
removeItem:function(element){
/// <summary>
/// Remove the item from toolbar, based on specified item.
/// </summary>
/// <param name="element"	type="any">The element need to be removed</param>
},
removeItemByID:function(ID){
/// <summary>
/// Remove the item from toolbar, based on specified item id in the Toolbar.
/// </summary>
/// <param name="ID"	type="string">The ID of the element need to be removed</param>
},
selectItem:function(element){
/// <summary>
/// Selects the item from toolbar, based on specified item.
/// </summary>
/// <param name="element"	type="any">The element need to be selected</param>
},
selectItemByID:function(ID){
/// <summary>
/// Selects the item from toolbar, based on specified item id in the Toolbar.
/// </summary>
/// <param name="ID"	type="string">The ID of the element need to be selected</param>
},
show:function(){
/// <summary>
/// To show the Toolbar.
/// </summary>
},
};
jQuery.fn.ejToolbar=function(){
this.data("ejToolbar",new	ej.Toolbar());
return this;
};
jQuery.fn.ejToolbar = function (options) {
/// <summary><br/>
///The Toolbar control supports displaying a list of tools within a web page. This control is capable of customizing toolbar items with any functionality by using enriched client-side methods. This control is composed of collection of unordered lists containing text and images contained into a div.<br/><br/>
///Sets the root CSS class for Toolbar control to achieve the custom theme.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies dataSource value for the Toolbar control during initialization.
///<br/>dataSource-any	default-null
///<br/><br/>
///Specifies the Toolbar control state.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Specifies enableRTL property to align the Toolbar control from right to left direction.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Allows to separate the each UL items in the Toolbar control.
///<br/>enableSeparator-boolean	default-false
///<br/><br/>
///Specifies the mapping fields for the data items of the Toolbar
///<br/>fields-string	default-null
///<br/><br/>
///Defines the group name for the item.
///<br/>group-string	default-
///<br/><br/>
///Defines the HTML attributes such as id, class, styles for the item to extend the capability.
///<br/>htmlAttributes-any	default-
///<br/><br/>
///Defines id for the tag.
///<br/>id-string	default-
///<br/><br/>
///Defines the image attributes such as height, width, styles and so on.
///<br/>imageAttributes-string	default-
///<br/><br/>
///Defines the imageURL for the image location.
///<br/>imageUrl-string	default-
///<br/><br/>
///Defines the sprite CSS for the image tag.
///<br/>spriteCssClass-string	default-
///<br/><br/>
///Defines the text content for the tag.
///<br/>text-string	default-
///<br/><br/>
///Defines the tooltip text for the tag.
///<br/>tooltipText-string	default-
///<br/><br/>
///Specifies the height of the Toolbar.
///<br/>height-number|string	default-28
///<br/><br/>
///Specifies whether the Toolbar control is need to be show or hide.
///<br/>hide-boolean	default-false
///<br/><br/>
///Enables/Disables the responsive support for Toolbar items during the window resizing time.
///<br/>isResponsive-boolean	default-false
///<br/><br/>
///Specifies the Toolbar orientation. See orientation
///<br/>orientation-ej.Orientation|string	default-Horizontal
///<br/><br/>
///Specifies the query to retrieve the data from the online server. The query is used only when the online dataSource is used.
///<br/>query-any	default-null
///<br/><br/>
///Displays the Toolbar with rounded corners.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Specifies the targetID for the toolbar control.
///<br/>targetID-string	default-null
///<br/><br/>
///Specifies the width of the Toolbar.
///<br/>width-number|string	default-
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Tooltip=function(){};
ej.Tooltip.prototype={

destroy:function(){
/// <summary>
/// Destroys the Tooltip control.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the Tooltip control.
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the Tooltip control.
/// </summary>
},
hide:function(effect, func){
/// <summary>
/// Hide the Tooltip popup.
/// </summary>
/// <param name="effect"	type="string"> optional Determines the type of effect that takes place when hiding the tooltip.</param>
/// <param name="func"	type="Function"> optional custom effect takes place when hiding the tooltip.</param>
},
show:function(effect, func, target){
/// <summary>
/// Shows the Tooltip popup for the given target element with the specifed effect.
/// </summary>
/// <param name="effect"	type="string">optionalDetermines the type of effect that takes place when showing the tooltip.</param>
/// <param name="func"	type="Function">optionalcustom effect takes place when showing the tooltip.</param>
/// <param name="target"	type="JQuery">optionalTooltip will be shown for the given element</param>
},
};
jQuery.fn.ejTooltip=function(){
this.data("ejTooltip",new	ej.Tooltip());
return this;
};
jQuery.fn.ejTooltip = function (options) {
/// <summary><br/>
///The Tooltip control will display a popup hint when the user hover/click/focus to the element.<br/><br/>
///Tooltip control can be accessed through the keyboard shortcut keys.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Specifies the animation behavior in  Tooltip. It contains the following sub properties.
///<br/>animation-Animation	default-
///<br/><br/>
///Determines the type of effect.
///<br/>effect-ej.Tooltip.effect|string	default-ej.Tooltip.Effect.None
///<br/><br/>
///Sets the animation speed in milliseconds.
///<br/>speed-number	default-4000
///<br/><br/>
///Sets the position related to target element, window, mouse or (x,y) co-ordinates.
///<br/>associate-ej.Tooltip.Associate|string	default-ej.Tooltip.Associate.Target
///<br/><br/>
///Specified the delay to hide Tooltip when closeMode is auto.
///<br/>autoCloseTimeout-number	default-4000
///<br/><br/>
///Specifies the closing behavior of Tooltip popup.
///<br/>closeMode-ej.Tooltip.CloseMode|string	default-ej.Tooltip.CloseMode.None
///<br/><br/>
///Sets the Tooltip in alternate position when collision occurs.
///<br/>collision-ej.Tooltip.Collision|string	default-ej.Tooltip.Collision.FlipFit
///<br/><br/>
///Specified the selector for the container element.
///<br/>containment-string	default-body
///<br/><br/>
///Specifies the text for Tooltip.
///<br/>content-string	default-null
///<br/><br/>
///Sets the root CSS class for Tooltip for the customization.
///<br/>cssClass-string	default-null
///<br/><br/>
///Enables or disables the Tooltip.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Sets the Tooltip direction from right to left.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Defines the height of the Tooltip popup.
///<br/>height-string|number	default-auto
///<br/><br/>
///Enables the arrow in Tooltip.
///<br/>isBalloon-boolean	default-true
///<br/><br/>
///defines various attributes of the Tooltip position
///<br/>position-Position	default-
///<br/><br/>
///Sets the Tooltip position against target.
///<br/>target-any	default-
///<br/><br/>
///Sets the Tooltip position against target based on horizontal(x) value.
///<br/>horizontal-string|number	default-center
///<br/><br/>
///Sets the Tooltip position against target based on vertical(y) value.
///<br/>vertical-string|number	default-top
///<br/><br/>
///Sets the arrow position again popup.
///<br/>stem-any	default-
///<br/><br/>
///Sets the arrow position again popup based on horizontal(x) value
///<br/>horizontal-string	default-center
///<br/><br/>
///Sets the arrow position again popup based on vertical(y) value
///<br/>vertical-string	default-bottom
///<br/><br/>
///Enables or disables rounded corner.
///<br/>showRoundedCorner-boolean	default-false
///<br/><br/>
///Shadow effect will be applied for the Tooltip wrapper.
///<br/>showShadow-boolean	default-false
///<br/><br/>
///Specified a selector for elements, within the container.
///<br/>target-string	default-null
///<br/><br/>
///The title text to be displayed in the Tooltip header.
///<br/>title-string	default-null
///<br/><br/>
///Specified the event action to show case the Tooltip.
///<br/>trigger-ej.Tooltip.Trigger|string	default-ej.Tooltip.Trigger.Hover
///<br/><br/>
///Defines the width of the Tooltip popup.
///<br/>width-string|number	default-auto
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.TreeGrid=function(){};
ej.TreeGrid.prototype={

clearSelection:function(index){
/// <summary>
/// To clear all the selection in TreeGrid
/// </summary>
/// <param name="index"	type="number">you can pass a row index to clear the row selection.</param>
},
collapseAll:function(){
/// <summary>
/// To collapse all the parent items in tree grid
/// </summary>
},
hideColumn:function(headerText){
/// <summary>
/// To hide the column by using header text
/// </summary>
/// <param name="headerText"	type="string">you can pass a header text of a column to hide.</param>
},
refresh:function(dataSource, query){
/// <summary>
/// To refresh the changes in tree grid
/// </summary>
/// <param name="dataSource"	type="Array&lt;any&gt;">Pass which data source you want to show in tree grid</param>
/// <param name="query"	type="any">Pass which data you want to show in tree grid</param>
},
freezePrecedingColumns:function(field){
/// <summary>
/// Freeze all the columns preceding to the column specified by the field name.
/// </summary>
/// <param name="field"	type="string">Freeze all Columns before this field column.</param>
},
freezeColumn:function(field, isFrozen){
/// <summary>
/// Freeze/unfreeze the specified column.
/// </summary>
/// <param name="field"	type="string">Freeze/Unfreeze this field column.</param>
/// <param name="isFrozen"	type="boolean">Decides to Freeze/Unfreeze this field column.</param>
},
saveCell:function(){
/// <summary>
/// To save the edited cell in TreeGrid
/// </summary>
},
search:function(searchString){
/// <summary>
/// To search an item with search string provided at the run time
/// </summary>
/// <param name="searchString"	type="string">you can pass a searchString to search the tree grid</param>
},
showColumn:function(headerText){
/// <summary>
/// To show the column by using header text
/// </summary>
/// <param name="headerText"	type="string">you can pass a header text of a column to show.</param>
},
sortColumn:function(columnName, columnSortDirection){
/// <summary>
/// To sorting the data based on the particular fields
/// </summary>
/// <param name="columnName"	type="string">you can pass a name of column to sort.</param>
/// <param name="columnSortDirection"	type="string">you can pass a sort direction to sort the column.</param>
},
};
jQuery.fn.ejTreeGrid=function(){
this.data("ejTreeGrid",new	ej.TreeGrid());
return this;
};
jQuery.fn.ejTreeGrid = function (options) {
/// <summary><br/>
///Custom Design for HTML TreeGrid control.<br/><br/>
///Enables or disables the ability to resize the column width interactively.
///<br/>allowColumnResize-boolean	default-false
///<br/><br/>
///Enables or disables the ability to drag and drop the row interactively to reorder the rows.
///<br/>allowDragAndDrop-boolean	default-false
///<br/><br/>
///Enables or disables the ability to filter the data on all the columns. Enabling this property will display a row with editor controls corresponding to each column. You can restrict filtering on particular column by disabling this property directly on that column instance itself.
///<br/>allowFiltering-boolean	default-false
///<br/><br/>
///Enables or disables keyboard navigation.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Enables or disables the ability to sort the rows based on multiple columns/fields by clicking on each column header. Rows will be sorted recursively on clicking the column headers.
///<br/>allowMultiSorting-boolean	default-false
///<br/><br/>
///Enables or disables the ability to select a row interactively.
///<br/>allowSelection-boolean	default-true
///<br/><br/>
///Enables or disables the ability to sort the rows based on a single field/column by clicking on that column header. When enabled, rows can be sorted only by single field/column.
///<br/>allowSorting-boolean	default-false
///<br/><br/>
///Specifies the id of the template that has to be applied for alternate rows.
///<br/>altRowTemplateID-string	default-
///<br/><br/>
///Specifies the mapping property path for sub tasks in datasource
///<br/>childMapping-string	default-
///<br/><br/>
///Option for adding columns; each column has the option to bind to a field in the dataSource.
///<br/>columns-Array&lt;Columns&gt;	default-
///<br/><br/>
///Enables or disables the ability to filter the rows based on this column.
///<br/>allowFiltering-boolean	default-false
///<br/><br/>
///Enables or disables the ability to sort the rows based on this column/field.
///<br/>allowSorting-boolean	default-false
///<br/><br/>
///Specifies the edit type of the column.
///<br/>editType-ej.TreeGrid.EditingType|string	default-ej.TreeGrid.EditingType.String
///<br/><br/>
///Specifies the name of the field from the dataSource to bind with this column.
///<br/>field-string	default-
///<br/><br/>
///Specifies the type of the editor control to be used to filter the rows.
///<br/>filterEditType-ej.TreeGrid.EditingType|string	default-ej.TreeGrid.EditingType.String
///<br/><br/>
///Header text of the column.
///<br/>headerText-string	default-null
///<br/><br/>
///Controls the visibility of the column.
///<br/>visible-boolean	default-true
///<br/><br/>
///Specifies the header template value for the column header
///<br/>headerTemplateID-string	default-
///<br/><br/>
///Specifies whether the column is frozen
///<br/>isFrozen-boolean	default-false
///<br/><br/>
///Enables or disables the ability to freeze/unfreeze the columns
///<br/>allowFreezing-boolean	default-false
///<br/><br/>
///Options for displaying and customizing context menu items.
///<br/>contextMenuSettings-ContextMenuSettings	default-
///<br/><br/>
///Option for adding items to context menu.
///<br/>contextMenuItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Shows/hides the context menu.
///<br/>showContextMenu-boolean	default-false
///<br/><br/>
///Specifies hierarchical or self-referential data to populate the TreeGrid.
///<br/>dataSource-Array&lt;any&gt;	default-null
///<br/><br/>
///Specifies whether to wrap the header text when it is overflown i.e., when it exceeds the header width.
///<br/>headerTextOverflow-string	default-none
///<br/><br/>
///Options for displaying and customizing the tooltip. This tooltip will show the preview of the row that is being dragged.
///<br/>dragTooltip-DragTooltip	default-
///<br/><br/>
///Specifies whether to show tooltip while dragging a row.
///<br/>showTooltip-boolean	default-true
///<br/><br/>
///Option to add field names whose corresponding values in the dragged row needs to be shown in the preview tooltip.
///<br/>tooltipItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Custom template for that tooltip that is shown while dragging a row.
///<br/>tooltipTemplate-string	default-null
///<br/><br/>
///Options for enabling and configuring the editing related operations.
///<br/>editSettings-EditSettings	default-
///<br/><br/>
///Enables or disables the button to add new row in context menu as well as in toolbar.
///<br/>allowAdding-boolean	default-true
///<br/><br/>
///Enables or disables the button to delete the selected row in context menu as well as in toolbar.
///<br/>allowDeleting-boolean	default-true
///<br/><br/>
///Enables or disables the ability to edit a row or cell.
///<br/>allowEditing-boolean	default-false
///<br/><br/>
///specifies the edit mode in TreeGrid , "cellEditing" is for cell type editing and "rowEditing" is for entire row.
///<br/>editMode-ej.TreeGrid.EditMode|string	default-ej.TreeGrid.EditMode.CellEditing
///<br/><br/>
///Specifies the position where the new row has to be added.
///<br/>rowPosition-ej.TreeGrid.RowPosition|string	default-top
///<br/><br/>
///Specifies whether to render alternate rows in different background colors.
///<br/>enableAltRow-boolean	default-true
///<br/><br/>
///Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.
///<br/>enableCollapseAll-boolean	default-false
///<br/><br/>
///Specifies whether to resize TreeGrid whenever window size changes.
///<br/>enableResize-boolean	default-false
///<br/><br/>
///Specifies whether to render only the visual elements that are visible in the UI. When you enable this property, it will reduce the loading time for loading large number of records.
///<br/>enableVirtualization-boolean	default-false
///<br/><br/>
///Specifies if the filtering should happen immediately on each key press or only on pressing enter key.
///<br/>filterBarMode-string	default-immediate
///<br/><br/>
///Specifies the name of the field in the dataSource, which contains the id of that row.
///<br/>idMapping-string	default-
///<br/><br/>
///Specifies the name of the field in the dataSource, which contains the parentâ€™s id. This is necessary to form a parent-child hierarchy, if the dataSource contains self-referential data.
///<br/>parentIdMapping-string	default-
///<br/><br/>
///Specifies ej.Query to select data from the dataSource. This property is applicable only when the dataSource is ej.DataManager.
///<br/>query-any	default-null
///<br/><br/>
///Specifies the height of a single row in tree grid. Also, we need to set same height in the CSS style with class name e-rowcell.
///<br/>rowHeight-number	default-30
///<br/><br/>
///Specifies the id of the template to be applied for all the rows.
///<br/>rowTemplateID-string	default-
///<br/><br/>
///Specifies the index of the selected row.
///<br/>selectedRowIndex-number	default--1
///<br/><br/>
///Specifies the type of selection whether to select single row or multiple rows.
///<br/>selectionType-ej.Gantt.SelectionType|string	default-ej.TreeGrid.SelectionType.Single
///<br/><br/>
///Controls the visibility of the menu button, which is displayed on the column header. Clicking on this button will show a popup menu. When you choose â€œColumnsâ€ item from this popup, a list box with column names will be shown, from which you can select/deselect a column name to control the visibility of the respective columns.
///<br/>showColumnChooser-boolean	default-false
///<br/><br/>
///Specifies whether to show tooltip when mouse is hovered on the cell.
///<br/>showGridCellTooltip-boolean	default-true
///<br/><br/>
///Specifies whether to show tooltip for the cells, which has expander button.
///<br/>showGridExpandCellTooltip-boolean	default-true
///<br/><br/>
///Options for setting width and height for TreeGrid.
///<br/>sizeSettings-SizeSettings	default-
///<br/><br/>
///Height of the TreeGrid.
///<br/>height-string	default-null
///<br/><br/>
///Width of the TreeGrid.
///<br/>width-string	default-null
///<br/><br/>
///Options for sorting the rows.
///<br/>sortSettings-SortSettings	default-
///<br/><br/>
///Option to add columns based on which the rows have to be sorted recursively.
///<br/>sortedColumns-Array&lt;any&gt;	default-[]
///<br/><br/>
///Options for displaying and customizing the toolbar items.
///<br/>toolbarSettings-ToolbarSettings	default-
///<br/><br/>
///Shows/hides the toolbar.
///<br/>showToolBar-boolean	default-false
///<br/><br/>
///Option to add items to the toolbar.
///<br/>toolbarItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the index of the column that needs to have the expander button. By default, cells in the first column contain the expander button.
///<br/>treeColumnIndex-number	default-0
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.TreeMap=function(){};
ej.TreeMap.prototype={

refresh:function(){
/// <summary>
/// Method to reload treemap with updated values.
/// </summary>
},
};
jQuery.fn.ejTreeMap=function(){
this.data("ejTreeMap",new	ej.TreeMap());
return this;
};
jQuery.fn.ejTreeMap = function (options) {
/// <summary><br/>
///The treemap can be easily configured to the DOM element, such as div and can be created with a highly customized look and feel.<br/><br/>
///Specifies the border brush color of the treemap
///<br/>borderBrush-string	default-white
///<br/><br/>
///Specifies the border thickness of the treemap
///<br/>borderThickness-number	default-1
///<br/><br/>
///Specifies the uniColorMapping settings of the treemap
///<br/>uniColorMapping-UniColorMapping	default-
///<br/><br/>
///Specifies the uniform color mapping of the treemap
///<br/>color-string	default-null
///<br/><br/>
///Specifies the desaturationColorMapping settings of the treemap
///<br/>desaturationColorMapping-DesaturationColorMapping	default-
///<br/><br/>
///Specifies the to value for desaturation color mapping
///<br/>to-number	default-0
///<br/><br/>
///Specifies the color for desaturationColorMapping
///<br/>color-string	default-null
///<br/><br/>
///Specifies the from value for desaturation color mapping
///<br/>from-number	default-0
///<br/><br/>
///Specifies the rangeMaximum value for desaturation color mapping
///<br/>rangeMaximum-number	default-0
///<br/><br/>
///Specifies the rangeMinimum value for desaturation color mapping
///<br/>rangeMinimum-number	default-0
///<br/><br/>
///Specifies the paletteColorMapping of the treemap
///<br/>paletteColorMapping-PaletteColorMapping	default-
///<br/><br/>
///Specifies the colors of the paletteColorMapping
///<br/>colors-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the color value path of the treemap
///<br/>colorValuePath-string	default-null
///<br/><br/>
///Specifies the datasource of the treemap
///<br/>dataSource-any	default-null
///<br/><br/>
///Specifies the dockPosition for legend
///<br/>dockPosition-ej.datavisualization.TreeMap.DockPosition|string	default-top
///<br/><br/>
///specifies the drillDown header color
///<br/>drillDownHeaderColor-string	default-&#39;null&#39;
///<br/><br/>
///specifies the drillDown selection color
///<br/>drillDownSelectionColor-string	default-&#39;#000000&#39;
///<br/><br/>
///Enable/Disable the drillDown for treemap
///<br/>enableDrillDown-boolean	default-false
///<br/><br/>
///Specifies whether treemap need to resize when container is resized
///<br/>enableResize-boolean	default-true
///<br/><br/>
///Specifies the group color mapping of the treemap
///<br/>groupColorMapping-Array&lt;GroupColorMapping&gt;	default-[]
///<br/><br/>
///Specifies the groupID for GroupColorMapping.
///<br/>groupID-string	default-null
///<br/><br/>
///Specifies the legend settings of the treemap
///<br/>legendSettings-LegendSettings	default-
///<br/><br/>
///Specifies the height for legend
///<br/>height-number	default-30
///<br/><br/>
///Specifies the width for legend
///<br/>width-number	default-100
///<br/><br/>
///Specifies the iconHeight for legend
///<br/>iconHeight-number	default-15
///<br/><br/>
///Specifies the iconWidth for legend
///<br/>iconWidth-number	default-15
///<br/><br/>
///Specifies the template for legendSettings
///<br/>template-string	default-null
///<br/><br/>
///Specifies the highlight border brush of treemap
///<br/>highlightBorderBrush-string	default-gray
///<br/><br/>
///Specifies the border thickness when treemap items is highlighted in the treemap
///<br/>highlightBorderThickness-number	default-5
///<br/><br/>
///Specifies the highlight border brush of treemap
///<br/>highlightGroupBorderBrush-string	default-gray
///<br/><br/>
///Specifies the border thickness when treemap items is highlighted in the treemap
///<br/>highlightGroupBorderThickness-number	default-5
///<br/><br/>
///Specifies whether treemap item need to highlighted on selection
///<br/>highlightGroupOnSelection-boolean	default-false
///<br/><br/>
///Specifies whether treemap item need to highlighted on selection
///<br/>highlightOnSelection-boolean	default-false
///<br/><br/>
///Specifies the items layout mode of the treemap. Accepted itemsLayoutMode values are Squarified, SliceAndDiceHorizontal, SliceAndDiceVertical and SliceAndDiceAuto
///<br/>itemsLayoutMode-ej.datavisualization.TreeMap.ItemsLayoutMode|string	default-Squarified
///<br/><br/>
///Specifies the leaf settings of the treemap
///<br/>leafItemSettings-LeafItemSettings	default-
///<br/><br/>
///Specifies the border brush color of the leaf item.
///<br/>borderBrush-string	default-white
///<br/><br/>
///Specifies the border thickness of the leaf item.
///<br/>borderThickness-number	default-1
///<br/><br/>
///Specifies the label template of the leaf item.
///<br/>itemTemplate-string	default-null
///<br/><br/>
///Specifies the label path of the leaf item.
///<br/>labelPath-string	default-null
///<br/><br/>
///Specifies the position of the leaf labels.
///<br/>labelPosition-ej.datavisualization.TreeMap.Position|string	default-center
///<br/><br/>
///Specifies the mode of label visibility
///<br/>labelVisibilityMode-ej.datavisualization.TreeMap.VisibilityMode|string	default-visible
///<br/><br/>
///Shows or hides the label of the leaf item.
///<br/>showLabels-boolean	default-false
///<br/><br/>
///Specifies the rangeColorMapping settings of the treemap
///<br/>rangeColorMapping-Array&lt;RangeColorMapping&gt;	default-[]
///<br/><br/>
///Specifies the color value for rangeColorMapping.
///<br/>color-string	default-null
///<br/><br/>
///specifies the gradient colors for th given range value
///<br/>gradientColors-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specifies the from value for rangeColorMapping.
///<br/>from-number	default--1
///<br/><br/>
///Specifies the legend label value for rangeColorMapping.
///<br/>legendLabel-string	default-null
///<br/><br/>
///Specifies the to value for rangeColorMapping.
///<br/>to-number	default--1
///<br/><br/>
///Specifies the selection mode of the treemap. Accepted selection mode values are Default and Multiple.
///<br/>groupSelectionMode-ej.datavisualization.TreeMap.groupSelectionMode|string	default-default
///<br/><br/>
///Specifies the legend visibility status of the treemap
///<br/>showLegend-boolean	default-false
///<br/><br/>
///Specifies whether treemap tooltip need to be visible
///<br/>showTooltip-boolean	default-false
///<br/><br/>
///Specifies the tooltip template of the treemap
///<br/>tooltipTemplate-string	default-null
///<br/><br/>
///Hold the treeMapItems to be displayed in treemap
///<br/>treeMapItems-Array&lt;any&gt;	default-[]
///<br/><br/>
///Specify levels of treemap for grouped visualization of data
///<br/>levels-Array&lt;Levels&gt;	default-[]
///<br/><br/>
///specifies the group background
///<br/>groupBackground-string	default-null
///<br/><br/>
///Specifies the group border color for tree map level.
///<br/>groupBorderColor-string	default-null
///<br/><br/>
///Specifies the group border thickness for tree map level.
///<br/>groupBorderThickness-number	default-1
///<br/><br/>
///Specifies the group gap for tree map level.
///<br/>groupGap-number	default-1
///<br/><br/>
///Specifies the group padding for tree map level.
///<br/>groupPadding-number	default-4
///<br/><br/>
///Specifies the group path for tree map level.
///<br/>groupPath-string	default-
///<br/><br/>
///Specifies the header height for tree map level.
///<br/>headerHeight-number	default-0
///<br/><br/>
///Specifies the header template for tree map level.
///<br/>headerTemplate-string	default-null
///<br/><br/>
///Specifies the mode of header visibility
///<br/>headerVisibilityMode-ej.datavisualization.TreeMap.VisibilityMode|string	default-visible
///<br/><br/>
///Specifies the position of the labels.
///<br/>labelPosition-ej.datavisualization.TreeMap.Position|string	default-center
///<br/><br/>
///Specifies the label template for tree map level.
///<br/>labelTemplate-string	default-null
///<br/><br/>
///Specifies the mode of label visibility
///<br/>labelVisibilityMode-ej.datavisualization.TreeMap.VisibilityMode|string	default-visible
///<br/><br/>
///Shows or hides the header for tree map level.
///<br/>showHeader-boolean	default-false
///<br/><br/>
///Shows or hides the labels for tree map level.
///<br/>showLabels-boolean	default-false
///<br/><br/>
///Specifies the weight value path of the treemap
///<br/>weightValuePath-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.TreeView=function(){};
ej.TreeView.prototype={

addNode:function(newNodeText, target){
/// <summary>
/// To add a Node or collection of nodes in TreeView. If target tree node is specified, then the given nodes are added as child of target tree node, otherwise nodes are added in TreeView.
/// </summary>
/// <param name="newNodeText"	type="string|any">New node text or JSON object</param>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
addNodes:function(collection, target){
/// <summary>
/// To add a collection of nodes in TreeView. If target tree node is specified, then the given nodes are added as child of target tree node, otherwise nodes are added in TreeView.
/// </summary>
/// <param name="collection"	type="any|Array&lt;any&gt;">New node details in JSON object</param>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
checkAll:function(){
/// <summary>
/// To check all the nodes in TreeView.
/// </summary>
},
checkNode:function(element){
/// <summary>
/// To check a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
collapseAll:function(){
/// <summary>
/// To collapse all the TreeView nodes.
/// </summary>
},
collapseNode:function(element){
/// <summary>
/// To collapse a particular node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node|object of TreeView node</param>
},
disableNode:function(element){
/// <summary>
/// To disable the node in the TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
enableNode:function(element){
/// <summary>
/// To enable the node in the TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
ensureVisible:function(element){
/// <summary>
/// To ensure that the TreeView node is visible in the TreeView. This method is useful if we need select a TreeView node dynamically.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
expandAll:function(){
/// <summary>
/// To expand all the TreeView nodes.
/// </summary>
},
expandNode:function(element){
/// <summary>
/// To expandNode particular node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
getCheckedNodes:function(){
/// <summary>
/// To get currently checked nodes in TreeView.
/// </summary>
},
getCheckedNodesIndex:function(){
/// <summary>
/// To get currently checked nodes indexes in TreeView.
/// </summary>
},
getNodeCount:function(){
/// <summary>
/// To get number of nodes in TreeView.
/// </summary>
},
getExpandedNodes:function(){
/// <summary>
/// To get currently expanded nodes in TreeView.
/// </summary>
},
getExpandedNodesIndex:function(){
/// <summary>
/// To get currently expanded nodes indexes in TreeView.
/// </summary>
},
getNodeByIndex:function(index){
/// <summary>
/// To get TreeView node by using index position in TreeView.
/// </summary>
/// <param name="index"	type="number">Index position of TreeView node</param>
},
getNode:function(element){
/// <summary>
/// To get TreeView node data such as id, text, parentId, selected, checked, expanded, level, childs and index.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
getNodeIndex:function(element){
/// <summary>
/// To get current index position of TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
getParent:function(element){
/// <summary>
/// To get immediate parent TreeView node of particular TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
getSelectedNode:function(){
/// <summary>
/// To get the currently selected node in TreeView.
/// </summary>
},
getSelectedNodeIndex:function(){
/// <summary>
/// To get the index position of currently selected node in TreeView.
/// </summary>
},
getText:function(element){
/// <summary>
/// To get the text of a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
getTreeData:function(){
/// <summary>
/// To get the updated datasource of TreeView after performing some operation like drag and drop, node editing, adding and removing node.
/// </summary>
},
getVisibleNodes:function(){
/// <summary>
/// To get currently visible nodes in TreeView.
/// </summary>
},
hasChildNode:function(element){
/// <summary>
/// To check a node having child or not.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
hide:function(){
/// <summary>
/// To show nodes in TreeView.
/// </summary>
},
hideNode:function(element){
/// <summary>
/// To hide particular node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
insertAfter:function(newNodeText, target){
/// <summary>
/// To add a Node or collection of nodes after the particular TreeView node.
/// </summary>
/// <param name="newNodeText"	type="string|any">New node text or JSON object</param>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
insertBefore:function(newNodeText, target){
/// <summary>
/// To add a Node or collection of nodes before the particular TreeView node.
/// </summary>
/// <param name="newNodeText"	type="string|any">New node text or JSON object</param>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isNodeChecked:function(element){
/// <summary>
/// To check the given TreeView node is checked or unchecked.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isChildLoaded:function(element){
/// <summary>
/// To check whether the child nodes are loaded of the given TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isDisabled:function(element){
/// <summary>
/// To check the given TreeView node is disabled or enabled.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isExist:function(element){
/// <summary>
/// To check the given node is exist in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isExpanded:function(element){
/// <summary>
/// To get the expand status of the given TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isSelected:function(element){
/// <summary>
/// To get the select status of the given TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
isVisible:function(element){
/// <summary>
/// To get the visibility status of the given TreeView node.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
loadData:function(URL, target){
/// <summary>
/// To load the TreeView nodes from the particular URL. If target tree node is specified, then the given nodes are added as child of target tree node, otherwise nodes are added in TreeView.
/// </summary>
/// <param name="URL"	type="string">URL location, the data returned from the URL will be loaded in TreeView</param>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
moveNode:function(sourceNode, destinationNode, index){
/// <summary>
/// To move the TreeView node with in same TreeView. The new poistion of given TreeView node will be based on destionation node and index position.
/// </summary>
/// <param name="sourceNode"	type="string|any">ID of TreeView node/object of TreeView node</param>
/// <param name="destinationNode"	type="string|any">ID of TreeView node/object of TreeView node</param>
/// <param name="index"	type="number">New index position of given source node</param>
},
refresh:function(){
/// <summary>
/// To refresh the TreeView
/// </summary>
},
removeAll:function(){
/// <summary>
/// To remove all the nodes in TreeView.
/// </summary>
},
removeNode:function(element){
/// <summary>
/// To remove a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
selectNode:function(element){
/// <summary>
/// To select a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
show:function(){
/// <summary>
/// To show nodes in TreeView.
/// </summary>
},
showNode:function(element){
/// <summary>
/// To show a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
unCheckAll:function(){
/// <summary>
/// To uncheck all the nodes in TreeView.
/// </summary>
},
uncheckNode:function(element){
/// <summary>
/// To uncheck a node in TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
unselectNode:function(element){
/// <summary>
/// To unselect the node in the TreeView.
/// </summary>
/// <param name="element"	type="string|any">ID of TreeView node/object of TreeView node</param>
},
updateText:function(target, newText){
/// <summary>
/// To edit or update the text of the TreeView node.
/// </summary>
/// <param name="target"	type="string|any">ID of TreeView node/object of TreeView node</param>
/// <param name="newText"	type="string">New text</param>
},
};
jQuery.fn.ejTreeView=function(){
this.data("ejTreeView",new	ej.TreeView());
return this;
};
jQuery.fn.ejTreeView = function (options) {
/// <summary><br/>
///The TreeView can be easily configured with the DOM element, such as div or ul. you can create a TreeView with a highly customizable look and feel.<br/><br/>
///Gets or sets a value that indicates whether to enable drag and drop a node within the same tree.
///<br/>allowDragAndDrop-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable drag and drop a node in inter ej.TreeView.
///<br/>allowDragAndDropAcrossControl-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to drop a node to a sibling of particular node.
///<br/>allowDropSibling-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to drop a node to a child of particular node.
///<br/>allowDropChild-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether to enable node editing support for TreeView.
///<br/>allowEditing-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates whether to enable keyboard support for TreeView actions like nodeSelection, nodeEditing, nodeExpand, nodeCollapse, nodeCut and Paste.
///<br/>allowKeyboardNavigation-boolean	default-true
///<br/><br/>
///Allow us to specify the parent and child nodes to get auto check while we check or uncheck a node.
///<br/>autoCheck-boolean	default-true
///<br/><br/>
///Allow us to specify the parent node to be retain in checked or unchecked state instead of going for indeterminate state.
///<br/>autoCheckParentNode-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates the checkedNodes index collection as an array. The given array index position denotes the nodes, that are checked while rendering TreeView.
///<br/>checkedNodes-Array&lt;any&gt;	default-[]
///<br/><br/>
///Sets the root CSS class for TreeView which allow us to customize the appearance.
///<br/>cssClass-string	default-
///<br/><br/>
///Gets or sets a value that indicates whether to enable or disable the animation effect while expanding or collapsing a node.
///<br/>enableAnimation-boolean	default-true
///<br/><br/>
///Gets or sets a value that indicates whether a TreeView can be enabled or disabled. No actions can be performed while this property is set as false
///<br/>enabled-boolean	default-true
///<br/><br/>
///Allow us to prevent multiple nodes to be in expanded state. If it set to false, previously expanded node will be collapsed automatically, while we expand a node.
///<br/>enableMultipleExpand-boolean	default-true
///<br/><br/>
///Sets a value that indicates whether to persist the TreeView model state in page using applicable medium i.e., HTML5 localStorage or cookies
///<br/>enablePersistence-boolean	default-false
///<br/><br/>
///Gets or sets a value that indicates to align content in the TreeView control from right to left by setting the property as true.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Gets or sets a array of value that indicates the expandedNodes index collection as an array. The given array index position denotes the nodes, that are expanded while rendering TreeView.
///<br/>expandedNodes-Array&lt;any&gt;	default-[]
///<br/><br/>
///Gets or sets a value that indicates the TreeView node can be expand or collapse by using the specified action.
///<br/>expandOn-string	default-dblclick
///<br/><br/>
///Gets or sets a fields object that allow us to map the data members with field properties in order to make the data binding easier.
///<br/>fields-Fields	default-null
///<br/><br/>
///It receives the child level or inner level data source such as Essential DataManager object and JSON object.
///<br/>child-any	default-
///<br/><br/>
///It receives Essential DataManager object and JSON object.
///<br/>dataSource-any	default-
///<br/><br/>
///Specifies the node to be in expanded state.
///<br/>expanded-boolean	default-
///<br/><br/>
///Its allow us to indicate whether the node has child or not in load on demand
///<br/>hasChild-boolean	default-
///<br/><br/>
///Specifies the html attributes to â€œliâ€ item list.
///<br/>htmlAttribute-any	default-
///<br/><br/>
///Specifies the id to TreeView node items list.
///<br/>id-string	default-
///<br/><br/>
///Specifies the image attribute to â€œimgâ€ tag inside items list
///<br/>imageAttribute-any	default-
///<br/><br/>
///Specifies the html attributes to â€œliâ€ item list.
///<br/>imageUrl-string	default-
///<br/><br/>
///If its true Checkbox node will be checked when rendered with checkbox.
///<br/>isChecked-boolean	default-
///<br/><br/>
///Specifies the link attribute to â€œaâ€ tag in item list.
///<br/>linkAttribute-any	default-
///<br/><br/>
///Specifies the parent id of the node. The nodes are listed as child nodes of the specified parent node by using its parent id.
///<br/>parentId-string	default-
///<br/><br/>
///It receives query to retrieve data from the table (query is same as SQL).
///<br/>query-any	default-
///<br/><br/>
///Allow us to specify the node to be in selected state
///<br/>selected-boolean	default-
///<br/><br/>
///Specifies the sprite CSS class to â€œliâ€ item list.
///<br/>spriteCssClass-string	default-
///<br/><br/>
///It receives the table name to execute query on the corresponding table.
///<br/>tableName-string	default-
///<br/><br/>
///Specifies the text of TreeView node items list.
///<br/>text-string	default-
///<br/><br/>
///Defines the height of the TreeView.
///<br/>height-string|number	default-Null
///<br/><br/>
///Specifies the HTML Attributes for the TreeView. Using this API we can add custom attributes in TreeView control.
///<br/>htmlAttributes-any	default-{}
///<br/><br/>
///Specifies the child nodes to be loaded on demand
///<br/>loadOnDemand-boolean	default-false
///<br/><br/>
///Gets or Sets a value that indicates the index position of a tree node. The particular index tree node will be selected while rendering the TreeView.
///<br/>selectedNode-number	default--1
///<br/><br/>
///Gets or sets a value that indicates whether to display or hide checkbox for all TreeView nodes.
///<br/>showCheckbox-boolean	default-false
///<br/><br/>
///By using sortSettings property, you can customize the sorting option in TreeView control.
///<br/>sortSettings-SortSettings	default-
///<br/><br/>
///Enables or disables the sorting option in TreeView control
///<br/>allowSorting-boolean	default-false
///<br/><br/>
///Sets the sorting order type. There are two sorting types available, such as "ascending", "descending".
///<br/>sortOrder-ej.sortOrder|string	default-ej.sortOrder.Ascending
///<br/><br/>
///Allow us to use custom template in order to create TreeView.
///<br/>template-string	default-null
///<br/><br/>
///Defines the width of the TreeView.
///<br/>width-string|number	default-Null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.Uploadbox=function(){};
ej.Uploadbox.prototype={

destroy:function(){
/// <summary>
/// The destroy method destroys the control and brings the control to a pre-init state. All the events of the Upload control is bound by using this._on unbinds automatically.
/// </summary>
},
disable:function(){
/// <summary>
/// Disables the Uploadbox control
/// </summary>
},
enable:function(){
/// <summary>
/// Enables the Uploadbox control
/// </summary>
},
};
jQuery.fn.ejUploadbox=function(){
this.data("ejUploadbox",new	ej.Uploadbox());
return this;
};
jQuery.fn.ejUploadbox = function (options) {
/// <summary><br/>
///The Uploadbox control supports uploading files into the designated server, regardless of the file format and size. The Uploadbox control helps you with the selection of files to upload to the server.<br/><br/>
///Enables the file drag and drop support to the Uploadbox control.
///<br/>allowDragAndDrop-boolean	default-false
///<br/><br/>
///Uploadbox supports both synchronous and asynchronous upload. This can be achieved by using the asyncUpload property.
///<br/>asyncUpload-boolean	default-true
///<br/><br/>
///Uploadbox supports auto uploading of files after the file selection is done.
///<br/>autoUpload-boolean	default-false
///<br/><br/>
///Sets the text for each action button.
///<br/>buttonText-ButtonText	default-{browse: Browse, upload: Upload, cancel: Cancel, close: Close}
///<br/><br/>
///Sets the text for the browse button.
///<br/>browse-string	default-
///<br/><br/>
///Sets the text for the cancel button.
///<br/>cancel-string	default-
///<br/><br/>
///Sets the text for the close button.
///<br/>Close-string	default-
///<br/><br/>
///Sets the text for the Upload button inside the dialog popup.
///<br/>upload-string	default-
///<br/><br/>
///Sets the root class for the Uploadbox control theme. This cssClass API helps to use custom skinning option for the Uploadbox button and dialog content.
///<br/>cssClass-string	default-
///<br/><br/>
///Specifies the custom file details in the dialog popup on initialization.
///<br/>customFileDetails-CustomFileDetails	default-{ title:true, name:true, size:true, status:true, action:true}
///<br/><br/>
///Enables the file upload interactions like remove/cancel in File details of the dialog popup.
///<br/>action-boolean	default-
///<br/><br/>
///Enables the name in the File details of the dialog popup.
///<br/>name-boolean	default-
///<br/><br/>
///Enables or disables the File size details of the dialog popup.
///<br/>size-boolean	default-
///<br/><br/>
///Enables or disables the file uploading status visibility in the dialog file details content.
///<br/>status-boolean	default-
///<br/><br/>
///Enables the title in File details for the dialog popup.
///<br/>title-boolean	default-
///<br/><br/>
///Specifies the actions for dialog popup while initialization.
///<br/>dialogAction-DialogAction	default-{ modal:false, closeOnComplete:false, content:null, drag:true}
///<br/><br/>
///Once uploaded successfully, the dialog popup closes immediately.
///<br/>closeOnComplete-boolean	default-
///<br/><br/>
///Sets the content container option to the Uploadbox dialog popup.
///<br/>content-string	default-
///<br/><br/>
///Enables the drag option to the dialog popup.
///<br/>drag-boolean	default-
///<br/><br/>
///Enables or disables the Uploadbox dialogâ€™s modal property to the dialog popup.
///<br/>modal-boolean	default-
///<br/><br/>
///Displays the Uploadbox dialog at the given X and Y positions. X: Dialog sets the left position value. Y: Dialog sets the top position value.
///<br/>dialogPosition-any	default-null
///<br/><br/>
///Property for applying the text to the Dialog title and content headers.
///<br/>dialogText-DialogText	default-{ title: Upload Box, name: Name, size: Size, status: Status}
///<br/><br/>
///Sets the uploaded fileâ€™s Name (header text) to the Dialog popup.
///<br/>name-string	default-
///<br/><br/>
///Sets the upload file Size (header text) to the dialog popup.
///<br/>size-string	default-
///<br/><br/>
///Sets the upload file Status (header text) to the dialog popup.
///<br/>status-string	default-
///<br/><br/>
///Sets the title text of the dialog popup.
///<br/>title-string	default-
///<br/><br/>
///The dropAreaText is displayed when the drag and drop support is enabled in the Uploadbox control.
///<br/>dropAreaText-string	default-Drop files or click to upload
///<br/><br/>
///Specifies the dropAreaHeight when the drag and drop support is enabled in the Uploadbox control.
///<br/>dropAreaHeight-number|string	default-100%
///<br/><br/>
///Specifies the dropAreaWidth when the drag and drop support is enabled in the Uploadbox control.
///<br/>dropAreaWidth-number|string	default-100%
///<br/><br/>
///Based on the property value, Uploadbox is enabled or disabled.
///<br/>enabled-boolean	default-true
///<br/><br/>
///Sets the right-to-left direction property for the Uploadbox control.
///<br/>enableRTL-boolean	default-false
///<br/><br/>
///Only the files with the specified extension is allowed to upload. This is mentioned in the string format.
///<br/>extensionsAllow-string	default-
///<br/><br/>
///Only the files with the specified extension is denied for upload. This is mentioned in the string format.
///<br/>extensionsDeny-string	default-
///<br/><br/>
///Sets the maximum size limit for uploading the file. This is mentioned in the number format.
///<br/>fileSize-number	default-31457280
///<br/><br/>
///Sets the height of the browse button.
///<br/>height-string	default-35px
///<br/><br/>
///Configures the culture data and sets the culture to the Uploadbox.
///<br/>locale-string	default-en-US
///<br/><br/>
///Enables multiple file selection for upload.
///<br/>multipleFilesSelection-boolean	default-true
///<br/><br/>
///You can push the file to the Uploadbox in the client-side of the XHR supported browsers alone.
///<br/>pushFile-any	default-null
///<br/><br/>
///Specifies the remove action to be performed after the file uploading is completed. Here, mention the server address for removal.
///<br/>removeUrl-string	default-
///<br/><br/>
///Specifies the save action to be performed after the file is pushed for uploading. Here, mention the server address to be saved.
///<br/>saveUrl-string	default-
///<br/><br/>
///Enables the browse button support to the Uploadbox control.
///<br/>showBrowseButton-boolean	default-true
///<br/><br/>
///Specifies the file details to be displayed when selected for uploading. This can be done when the showFileDetails is set to true.
///<br/>showFileDetails-boolean	default-true
///<br/><br/>
///Sets the name for the Uploadbox control. This API helps to Map the action in code behind to retrieve the files.
///<br/>uploadName-string	default-
///<br/><br/>
///Sets the width of the browse button.
///<br/>width-string	default-100px
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};
ej.WaitingPopup=function(){};
ej.WaitingPopup.prototype={

hide:function(){
/// <summary>
/// To hide the waiting popup
/// </summary>
},
refresh:function(){
/// <summary>
/// Refreshes the WaitingPopup control by resetting the pop-up panel position and content position
/// </summary>
},
show:function(){
/// <summary>
/// To show the waiting popup
/// </summary>
},
};
jQuery.fn.ejWaitingPopup=function(){
this.data("ejWaitingPopup",new	ej.WaitingPopup());
return this;
};
jQuery.fn.ejWaitingPopup = function (options) {
/// <summary><br/>
///The WaitingPopup control for JavaScript is a visual element that provides support for displaying a pop-up indicator over a target area and preventing the end userâ€™s interaction with the target area while loading.<br/><br/>
///Sets the root class for the WaitingPopup control theme
///<br/>cssClass-string	default-null
///<br/><br/>
///Enables or disables the default loading icon.
///<br/>showImage-boolean	default-true
///<br/><br/>
///Enables the visibility of the WaitingPopup control
///<br/>showOnInit-boolean	default-false
///<br/><br/>
///Loads HTML content inside the popup panel instead of the default icon
///<br/>template-any	default-null
///<br/><br/>
///Sets the custom text in the pop-up panel to notify the waiting process
///<br/>text-string	default-null
///</summary>
///<param name="options" type="Object">
///The widget configuration options
///</param>
};