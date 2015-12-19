/*
 * This file has been commented to support Visual Studio Intellisense.
 * You should not use this file at runtime inside the browser--it is only
 * intended to be used only for design-time IntelliSense.  Please use the
 * standard jHtmlArea library for all production use.
 */

/*
* jHtmlArea 0.7.5 - WYSIWYG Html Editor jQuery Plugin
* Copyright (c) 2012 Chris Pietschmann
* http://jhtmlarea.codeplex.com
* Licensed under the Microsoft Reciprocal License (Ms-RL)
* http://jhtmlarea.codeplex.com/license
*/
(function($) {
    $.fn.htmlarea = function(options) {
        /// <summary>
        ///     1: (options) - Convert all TextArea DOM Elements to be displayed as jHtmlArea WYSIWYG Editors.
        ///     2: (string, arguments) - This function accepts a string containing the method name that you want to execute against the jHtmlArea object.
        /// </summary>
        /// <param name="options" type="Object">
        ///     1: options - The custom options you want applied to the jHtmlArea's that are created.
        ///     2: string - The name of the jHtmlArea object method to be executed. The results of the method call are then returned instead of the jQuery object.
        /// </param>
    };
    var jHtmlArea = window.jHtmlArea = function(elem, options) {
        /// <summary>
        ///     Converts the passed in TextArea DOM Element to a jHtmlArea WYSIWYG Editor.
        /// </summary>
        /// <param name="elem" type="TextArea DOM Element">
        ///     The TextArea DOM Element to be converted to a jHtmlArea WYSIWYG Editor. Required.
        /// </param>
        /// <param name="options" type="Object">
        ///     The custom options you want applied to the jHtmlArea that is created. Optional.
        /// </param>
        /// <field name="defaultOptions" Type="Object">
        ///     The Default Options that are used for configuring the jHtmlArea WYSIWYG Editor upon creation.
        /// </field>
        /// <returns type="jHtmlArea" />
    };
    jHtmlArea.fn = jHtmlArea.prototype = {
        
        // The current version of jHtmlArea being used
        jhtmlarea: "0.7.0",
        
        init: function(elem, options) {
            /// <summary>
            ///     Converts the passed in TextArea DOM Element to a jHtmlArea WYSIWYG Editor.
            /// </summary>
            /// <param name="elem" type="TextArea DOM Element">
            ///     Required. The TextArea DOM Element to be converted to a jHtmlArea WYSIWYG Editor.
            /// </param>
            /// <param name="options" type="Object">
            ///     Optional. The custom options you want applied to the jHtmlArea that is created.
            /// </param>
            /// <returns type="jHtmlArea" />
        },
        execCommand: function(a, b, c) {
            /// <summary>
            ///     Executes a command on the current document, current selection, or the given range.
            /// </summary>
            /// <param name="a" type="String">
            ///     Required. String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
            /// </param>
            /// <param name="b" type="Boolean">
            ///     Optional. Boolean that specifies one of the following values:
            ///     "false" = Default. Do not display a user interface. Must be combined with vValue, if the command requires a value. 
            ///     "true" = Display a user interface if the command supports one.
            /// </param>
            /// <param name="c" type="Object">
            ///     Optional. Variant that specifies the string, number, or other value to assign. Possible values depend on the command.
            /// </param>
        },
        ec: function(a, b, c) {
            /// <summary>
            ///     Executes a command on the current document, current selection, or the given range. An alias for the "execCommand" method.
            /// </summary>
            /// <param name="a" type="String">
            ///     Required. String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
            /// </param>
            /// <param name="b" type="Boolean">
            ///     Optional. Boolean that specifies one of the following values:
            ///     "false" = Default. Do not display a user interface. Must be combined with vValue, if the command requires a value. 
            ///     "true" = Display a user interface if the command supports one.
            /// </param>
            /// <param name="c" type="Object">
            ///     Optional. Variant that specifies the string, number, or other value to assign. Possible values depend on the command.
            /// </param>
        },
        queryCommandValue: function(a) {
            /// <summary>
            ///     Returns the current value of the document, range, or current selection for the given command.
            /// </summary>
            /// <param name="a" type="String">
            ///     Required. String that specifies a command identifier.
            /// </param>
            /// <returns type="Variant" />
        },
        qc: function(a) {
            /// <summary>
            ///     Returns the current value of the document, range, or current selection for the given command. An alias for the "queryCommandValue" method.
            /// </summary>
            /// <param name="a" type="String">
            ///     Required. String that specifies a command identifier.
            /// </param>
            /// <returns type="Variant" />
        },
        getSelectedHTML: function() {
            /// <summary>
            ///     Returns the HTML that is currently selected within the editor.
            /// </summary>
            /// <returns type="String" />
        },
        getSelection: function() {
            /// <summary>
            ///     Returns the Browser Selection object that represents the currently selected region of the editor.
            /// </summary>
            /// <returns type="Object" />
        },
        getRange: function() {
            /// <summary>
            ///     Returns the Browser Range object that represents the currently selected region of the editor. (This uses the "getSelection" method internally.)
            /// </summary>
            /// <returns type="Object" />
        },
        pasteHTML: function(html) {
            /// <summary>
            ///     Pastes HTML text into the editor, replacing any currently selected text and HTML elements.
            /// </summary>
            /// <param name="html" type="String">
            ///     The HTML text to paste/insert.
            /// </param>
        },
        cut: function() {
            /// <summary>
            ///     Copies the current selection to the clipboard and then deletes it.
            /// </summary>
        },
        copy: function() {
            /// <summary>
            ///     Copies the current selection to the clipboard.
            /// </summary>
        },
        paste: function() {
            /// <summary>
            ///     Overwrites the contents of the clipboard on the current selection.
            /// </summary>
        },
        bold: function() {
            /// <summary>
            ///     Toggles the current selection between bold and nonbold.
            /// </summary>
        },
        italic: function() {
            /// <summary>
            ///    Toggles the current selection between italic and nonitalic.
            /// </summary>
        },
        underline: function() {
            /// <summary>
            ///     Toggles the current selection between underlined and not underlined.
            /// </summary>
        },
        strikeThrough: function() {
        /// <summary>
        ///     If there is a selection and all of the characters are already striked, the strikethrough will be removed. Otherwise, all selected characters will have a line drawn through them.
        /// </summary>
        },
        image: function(url) {
            /// <summary>
            ///     This command will insert an image (referenced by url) at the insertion point.
            ///     If no URL is specified, a prompt will be displayed to the user.
            /// </summary>
            /// <param name="url" type="String">
            ///     The URL to the Image to be inserted. If no URL is specified, a prompt will be shown.
            /// </param>
        },
        removeFormat: function() {
            /// <summary>
            ///     Removes the formatting tags from the current selection.
            /// </summary>
        },
        link: function() {
            /// <summary>
            ///     Inserts a hyperlink on the current selection, or displays a dialog box enabling the user to specify a URL to insert as a hyperlink on the current selection.
            /// </summary>
        },
        unlink: function() {
            /// <summary>
            ///     Removes any hyperlink from the current selection.
            /// </summary>
        },
        orderedList: function() {
            /// <summary>
            ///     Converts the text selection into an ordered list.
            /// </summary>
        },
        unorderedList: function() {
            /// <summary>
            ///     Converts the text selection into an unordered list.
            /// </summary>
        },
        superscript: function() {
            /// <summary>
            ///     If there is a selection and all of the characters are already superscripted, the superscript will be removed.  Otherwise, all selected characters will be drawn slightly higher than normal text.
            /// </summary>
        },
        subscript: function() {
            /// <summary>
            ///     If there is a selection and all of the characters are already subscripted, the subscript will be removed.  Otherwise, all selected characters will be drawn slightly lower than normal text.
            /// </summary>
        },

        p: function() {
            /// <summary>
            ///     Sets the current block format tag to <P>.
            /// </summary>
        },
        h1: function() {
            /// <summary>
            ///     Sets the current block format tag to <H1>.
            /// </summary>
        },
        h2: function() {
            /// <summary>
            ///     Sets the current block format tag to <H2>.
            /// </summary>
        },
        h3: function() {
            /// <summary>
            ///     Sets the current block format tag to <H3>.
            /// </summary>
        },
        h4: function() {
            /// <summary>
            ///     Sets the current block format tag to <H4>.
            /// </summary>
        },
        h5: function() {
            /// <summary>
            ///     Sets the current block format tag to <H5>.
            /// </summary>
        },
        h6: function() {
            /// <summary>
            ///     Sets the current block format tag to <H6>.
            /// </summary>
        },
        heading: function(h) {
            /// <summary>
            ///     Sets the current block format tag to <H?> tag.
            ///     Example: Calling jHtmlArea.heading(2) will be the same as calling jHtmlArea.h2()
            /// </summary>
            /// <param name="h" type="Number">
            ///     The Number of Header (<H?>) tag to format the current block with.
            ///     For Example: Passing a 2 or "2" will cause the current block to be formatted with a <H2> tag.
            /// </param>
        },

        indent: function() {
            /// <summary>
            ///     Indents the selection or insertion point.
            /// </summary>
        },
        outdent: function() {
            /// <summary>
            ///     Outdents the selection or insertion point.
            /// </summary>
        },

        insertHorizontalRule: function() {
            /// <summary>
            ///     Inserts a horizontal rule at the insertion point (deletes selection).
            /// </summary>
        },

        justifyLeft: function() {
            /// <summary>
            ///     Justifies the selection or insertion point to the left.
            /// </summary>
        },
        justifyCenter: function() {
            /// <summary>
            ///     Centers the selection or insertion point. 
            /// </summary>
        },
        justifyRight: function() {
            /// <summary>
            ///     Right-justifies the selection or the insertion point.
            /// </summary>
        },

        increaseFontSize: function() {
            /// <summary>
            ///     Increases the Font Size around the selection or at the insertion point.
            /// </summary>
        },
        decreaseFontSize: function() {
            /// <summary>
            ///     Decreases the Font Size around the selection or at the insertion point.
            /// </summary>
        },

        forecolor: function(c) {
            /// <summary>
            ///     Changes a font color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument.
            /// </summary>
        },

        formatBlock: function(v) {
            /// <summary>
            ///     Sets the current block format tag.
            /// </summary>
        },

        showHTMLView: function() {
            /// <summary>
            ///     Shows the HTML/Source View (TextArea DOM Element) within the Editor and hides the WYSIWYG interface.
            /// </summary>
        },
        hideHTMLView: function() {
            /// <summary>
            ///     Hides the HTML/Source View (TextArea DOM Element) within the Editor and displays the WYSIWYG interface.
            /// </summary>
        },
        toggleHTMLView: function() {
            /// <summary>
            ///     Toggles between HTML/Source View (TextArea DOM Element) and the WYSIWYG interface within the Editor.
            /// </summary>
        },

        toHtmlString: function() {
            /// <summary>
            ///     Returns the HTML text contained within the editor.
            /// </summary>
            /// <returns type="String" />
        },
        toString: function() {
            /// <summary>
            ///     Return the Text contained within the editor, with all HTML tags removed.
            /// </summary>
            /// <returns type="String" />
        },

        updateTextArea: function() {
            /// <summary>
            ///     Forces the TextArea DOM Element to by sync'd with the contents of the HTML WYSIWYG Editor.
            /// </summary>
        },
        updateHtmlArea: function() {
            /// <summary>
            ///     Forces the HTML WYSIWYG Editor to be sync'd with the contents of the TextArea DOM Element.
            /// </summary>
        }
    };
    jHtmlArea.fn.init.prototype = jHtmlArea.fn;
})(jQuery);