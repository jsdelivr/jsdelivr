YUI.add('gallery-bidi-textinput', function(Y) {

// Adds a plugin to text entry fields to change their bidi direction
// automatically based on the value entered by the user in the field. So if
// the user starts typing in Arabic in a left-to-right text entry box, the
// direction of the box will automatically switch to right-to-left, so the
// text could be displayed properly.
//
// This is mostly intended for text input boxes, although it will also work
// for TEXTAREAs. Usage in TEXTAREAs are not recommended except in cases
// where the textarea is limited to very short text, as multiline text with
// different bidi directions is not supported in TEXTAREAs. Use a
// bidi-enabled rich text editor like YUI3's 'editor-bidi' instead.

function BidiTextEntryPlugin() {
    BidiTextEntryPlugin.superclass.constructor.apply(this, arguments);
}

BidiTextEntryPlugin.NS = "bidiTextEntry";
BidiTextEntryPlugin.NAME = "bidiTextEntry";

Y.extend(BidiTextEntryPlugin, Y.Plugin.Base, {
    initializer: function () {
        this.afterHostEvent("valueChange", function (event) {
            var host = this.get("host"),
                direction = Y.Intl.detectDirection(event.newVal);
            
            host.setDirection(direction);
        });
    }
});

Y.namespace('Plugin');
Y.Plugin.BidiTextEntry = BidiTextEntryPlugin;
Y.Plugin.BidiTextInput = BidiTextEntryPlugin; // For backward compatibility


}, 'gallery-2010.09.22-20-15' ,{requires:['plugin','event-valuechange','gallery-intl-bidi','gallery-node-setdir']});
