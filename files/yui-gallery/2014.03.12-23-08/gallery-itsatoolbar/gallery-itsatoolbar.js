YUI.add('gallery-itsatoolbar', function (Y, NAME) {

/*jshint maxlen:225 */

'use strict';

/**
 * The Itsa Selectlist module.
 *
 * @module gallery-itsatoolbar
 */

/**
 * Editor Toolbar Plugin
 *
 *
 * @class ITSAToolbar
 * @extends Plugin.Base
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
var Lang = Y.Lang,
    NODE = Y.Node,

    ITSA_BTNNODE = "<button type='button' class='yui3-button'></button>",
    ITSA_BTNINNERNODE = "<span class='itsa-button-icon'></span>",
    ITSA_BTNPRESSED = 'yui3-button-active',
    ITSA_BTNACTIVE = 'itsa-button-active',
    ITSA_BTNINDENT = 'itsa-button-indent',
    ITSA_BUTTON = 'itsa-button',
    ITSA_BTNSYNC = 'itsa-syncbutton',
    ITSA_BTNTOGGLE = 'itsa-togglebutton',
    ITSA_BTNGROUP = 'itsa-buttongroup',
    ITSA_BTNCUSTOMFUNC = 'itsa-button-customfunc',
    ITSA_TOOLBAR_TEMPLATE = "<div class='itsatoolbar'></div>",
    ITSA_TOOLBAR_SMALL = 'itsa-buttonsize-small',
    ITSA_TOOLBAR_MEDIUM = 'itsa-buttonsize-medium',
    ITSA_CLASSEDITORPART = 'itsatoolbar-editorpart',
    ITSA_TMPREFNODE = "<img id='itsatoolbar-tmpref' />",
    // the src of ITSA_REFEMPTYCONTENT is a 1pixel transparent png in base64-code
    ITSA_REFEMPTYCONTENT = "<img class='itsatoolbar-tmpempty' src='data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2F"
                         +"yZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=' width=0 height=0>",
    ITSA_REFNODE = "<span id='itsatoolbar-ref'></span>",
    ITSA_REFSELECTION = 'itsa-selection-tmp',
    ITSA_FONTSIZENODE = 'itsa-fontsize',
    ITSA_FONTFAMILYNODE = 'itsa-fontfamily',
    ITSA_FONTCOLORNODE = 'itsa-fontcolor',
    ITSA_MARKCOLORNODE = 'itsa-markcolor',
    ITSA_IFRAMENODE = 'itsa-iframenode',
    ITSA_YOUTUBENODE = 'itsa-youtubenode',
    ITSA_IFRAMEBLOCKER = 'itsa-iframeblocker',
    ITSA_IFRAMEBLOCKER_CSS = '.itsa-iframeblocker {position: relative; z-index: 1; background-color:#FFF; opacity:0; filter:alpha(opacity=0;} .itsa-iframeblocker:hover {opacity:0.4; filter:alpha(opacity=40;}',
    ITSA_IFRAMEBLOCKER_TEMPLATE = '<span style="padding-left:{width}px; margin-right:-{width}px; padding-top:{height}px; " class="'+ITSA_IFRAMEBLOCKER+' {node}"></span>';

    // DO NOT make ITSA_IFRAMEBLOCKER_CSS position absolute! FF will append resizehandlers which we don't want

// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property editor
 * @type Y.EditorBase instance
 */

/**
 * Initial content of the editor
 * @property initialContent
 * @type String
 */

/**
 * Internal list that holds event-references
 * @property _eventhandlers
 * @private
 * @type Array
 */

/**
 * Reference to the Y-instance of the host-editor
 * @property editorY
 * @type YUI-instance
 */

/**
 * Reference to the editor's iframe-node
 * @property editorNode
 * @type Y.Node
 */

/**
 * Reference to the editor's container-node, in which the host-editor is rendered.<br>
 * This is in fact editorNode.get('parentNode')
 * @property containerNode
 * @type Y.Node
 */

/**
 * Reference to the toolbar-node.<br>
 * @property toolbarNode
 * @type Y.Node
 */

/**
 * Used internally to check if the toolbar should still be rendered after the editor is rendered<br>
 * To prevent rendering while it is already unplugged
 * @property _destroyed
 * @private
 * @type Boolean
 */

/**
 * Timer: used internally to clean up empty fontsize-markings<br>
 * @property _timerClearEmptyFontRef
 * @private
 * @type Object
 */

/**
 * Reference to a backup cursorposition<br>
 * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
 * Reference is made on a show-event of the selectlist.
 * @property _backupCursorRef
 * @private
 * @type Y.Node
 */

/**
 * ItsaDialogBox-Reference to a the custom internat getUrl-panel<br>
 * Will be created during initialization
 * @property _dialogPanelId
 * @private
 * @type int
 */

/**
 * Backup of the editors-value 'extracss'. Need to use internally, because the toolbar will add extra css of its own.<br>
 * @property _extracssBKP
 * @private
 * @type int
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_BOLD
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ITALIC
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNDERLINE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_LEFT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_CENTER
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_RIGHT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_JUSTIFY
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_SUBSCRIPT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_SUPERSCRIPT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_TEXTCOLOR
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_MARKCOLOR
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_INDENT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_OUTDENT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNORDEREDLIST
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ORDEREDLIST
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNDO
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_REDO
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_EMAIL
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_REMOVELINK
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_HYPERLINK
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_IMAGE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_IFRAME
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_FILE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_VIDEO
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_SAVE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_CANCEL
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_CLEAR
 * @type String
 */

Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {

        editor : null,
        editorY : null,
        editorNode : null,
        containerNode : null,
        toolbarNode : null,
        _destroyed : false,
        _timerClearEmptyFontRef : null,
        _backupCursorRef : null,
        _dialogPanelId : null,
        _extracssBKP : '',
        _eventhandlers : [],

        ICON_BOLD : 'itsa-icon-bold',
        ICON_ITALIC : 'itsa-icon-italic',
        ICON_UNDERLINE : 'itsa-icon-underline',
        ICON_ALIGN_LEFT : 'itsa-icon-alignleft',
        ICON_ALIGN_CENTER : 'itsa-icon-aligncenter',
        ICON_ALIGN_RIGHT : 'itsa-icon-alignright',
        ICON_ALIGN_JUSTIFY : 'itsa-icon-alignjustify',
        ICON_SUBSCRIPT : 'itsa-icon-subscript',
        ICON_SUPERSCRIPT : 'itsa-icon-superscript',
        ICON_TEXTCOLOR : 'itsa-icon-textcolor',
        ICON_MARKCOLOR : 'itsa-icon-markcolor',
        ICON_INDENT : 'itsa-icon-indent',
        ICON_OUTDENT : 'itsa-icon-outdent',
        ICON_UNORDEREDLIST : 'itsa-icon-unorderedlist',
        ICON_ORDEREDLIST : 'itsa-icon-orderedlist',
        ICON_UNDO : 'itsa-icon-undo',
        ICON_REDO : 'itsa-icon-redo',
        ICON_EMAIL : 'itsa-icon-email',
        ICON_HYPERLINK : 'itsa-icon-hyperlink',
        ICON_REMOVELINK : 'itsa-icon-removelink',
        ICON_IFRAME : 'itsa-icon-iframe',
        ICON_IMAGE : 'itsa-icon-image',
        ICON_FILE : 'itsa-icon-file',
        ICON_VIDEO : 'itsa-icon-video',
        ICON_SAVE : 'itsa-icon-save',
        ICON_CANCEL : 'itsa-icon-cancel',
        ICON_CLEAR : 'itsa-icon-clear',

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @param {Object} config The config-object.
         * @protected
        */
        initializer : function() {
            var instance = this;
            instance.editor = instance.get('host');
            // need to make sure we can use execCommand, so do not render before the frame exists.
            if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                instance.editor.on('ready', instance._render, instance);
            }
        },

        /**
         * Establishes the initial DOM for the toolbar. This method ia automaticly invoked once during initialisation.
         * It will invoke renderUI, bindUI and syncUI, just as within a widget.
         *
         * @method _render
         * @private
        */
        _render : function() {
            var instance = this;
            if (!instance._destroyed) {
                instance.editorY = instance.editor.getInstance();
                instance.editorNode = instance.editor.frame.get('node');
                instance.containerNode = instance.editorNode.get('parentNode');
                instance._clearAllTempReferences();
                instance.initialContent = instance.editor.get('content');
/*jshint expr:true */
                instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);
/*jshint expr:false */
                // make the iframeblocker work through css:
                instance._extracssBKP = instance.editor.get('extracss');
                instance.editor.set('extracss', instance._extracssBKP + ITSA_IFRAMEBLOCKER_CSS);
                instance.editor.plug(Y.Plugin.ExecCommand);
                instance._defineCustomExecCommands();
                instance._createUrlDialog();
                instance._createBlockerRefs();
                instance._renderUI();
                instance._bindUI();
                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object
                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!
                if (instance.get('initialFocus')) {
                    instance.editor.frame.focus(Y.bind(instance.sync, instance));
                }
            }
        },

        /**
         * Returns node at cursorposition<br>
         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.
         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.
         * @method _getCursorRef
         * @private
         * @param {Boolean} [selectionIfAvailable] do return the selectionnode if a selection is made. If set to false, then always just the cursornode will be returned.
         * Which means -in case of selection- that the cursornode exists as a last child of the selection. Default = false.
         * @return {Y.Node} created empty referencenode
        */
        _getCursorRef : function(selectionIfAvailable) {
            var instance = this,
                node,
                sel,
                out;
            // insert cursor and use that node as the selected node
            // first remove previous
            instance._removeCursorRef();
            sel = new instance.editorY.EditorSelection();
            if (!sel.isCollapsed && sel.anchorNode) {
                // We have a selection
                out = sel.getSelected();
                // a bug in Opera makes sel.getSelected()==='undefined. not bound to any nodes', even if there is a selection
                // we CANNOT use (typeof out === 'undefined'), because it IS a nodelist, but an empty one.
                if (out.size()===0) {
                    out = sel.anchorNode.all('[style],font[face]');
                    // even now, out.size can still be 0. !!!
                    // This is the case when you select exactly one tag, for instance an image.
                    // so we need to check for out.size()>0 before assinging out.item(0)
                }
                if (out.size()>0) {
                    node = out.item(0);
                }
            }
            // node only exist when selection is available
            if (node) {
                node.addClass(ITSA_REFSELECTION);
                node.insert(ITSA_REFNODE, 'after');
                if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}
            }
            else {
                instance.editor.focus();
                instance.execCommand('inserthtml', ITSA_REFNODE);
                node = instance.editorY.one('#itsatoolbar-ref');
            }
            return node;
        },

        /**
         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef
         * @method _removeCursorRef
         * @private
         * @param [masterNode] {Y.Node} node in which the references are removed. Leave empty to remove it from the Y.instance (default)
         * It is used when you want to clone the body-node in case of returning a 'clean' content through this.getContent()
        */
        _removeCursorRef : function(masterNode) {
            var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            // but before that: we might want to clear in in the masterNode instead of Y
            useY = masterNode || instance.editorY || Y;
            // first cleanup single referencenode
            node = useY.all('#itsatoolbar-ref');
            if (node) {node.remove();}
            node = useY.all('#itsatoolbar-tmpempty');
            if (node) {node.remove();}
            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions
            node = useY.all('.' + ITSA_REFSELECTION);
            if (node.size()>0) {
                node.each(function(node){
                    // NEED to trim, because node.replace(' ') throws an error !?!
                    if (Lang.trim(node.getHTML())==='') {
                        node.remove(false);
                    }
                    else {
                        node.replace(node.getHTML());
                    }
                });
            }
        },

        /**
         * Creates blocker spans above iframe-elements to make them clickable.
         * @method _createBlockerRefs
         * @private
        */
        _createBlockerRefs: function() {
            var instance = this,
                alliframes,
                regExp = /^http:\/\/www\.youtube\.com\/embed\/(\w+)/; // search for strings like http://www.youtube.com/embed/PHIaeHAcE_A&whatever
            // first remove old references, should they exists
            instance._clearBlockerRef();
            alliframes = instance.editorY.all('iframe');
            alliframes.each(
                function(node) {
                    var blocker,
                        width,
                        height;
                    width = node.get('width');
                    height = node.get('height');
                    blocker = Lang.sub(
                        ITSA_IFRAMEBLOCKER_TEMPLATE,
                        {
                            width: width || 315,
                            height: height || 420,
                            node: regExp.test(node.get('src') || '') ? ITSA_YOUTUBENODE : ITSA_IFRAMENODE
                        }
                    );
                    node.insert(blocker, 'before');
                },
                instance
            );
        },

        /**
         * Removes blocker spans that are created above iframe-elements to make them clickable.
         * @method _clearBlockerRef
         * @private
         * @param [masterNode] {Y.Node} node in which the references are removed. Leave empty to remove it from the Y.instance (default)
         * It is used when you want to clone the body-node in case of returning a 'clean' content through this.getContent()
        */
        _clearBlockerRef : function(masterNode) {
            var instance = this,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            // but before that: we might want to clear in in the masterNode instead of Y
            useY = masterNode || instance.editorY || Y;
            useY.all('.'+ITSA_IFRAMEBLOCKER).remove(false);
        },

        /**
         * Removes temporary created font-size-ref-Node that might have been created by inserting fontsizes
         * @method _clearEmptyFontRef
         * @private
         * @param [masterNode] {Y.Node} node in which the references are removed. Leave empty to remove it from the Y.instance (default)
         * It is used when you want to clone the body-node in case of returning a 'clean' content through this.getContent()
        */
        _clearEmptyFontRef : function(masterNode) {
            var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            // but before that: we might want to clear in in the masterNode instead of Y
            useY = masterNode || instance.editorY || Y;
            // first cleanup single referencenode
            node = useY.all('.itsatoolbar-tmpempty');
            if (node) {node.remove();}
            // next clean up all references that are empty
            node = useY.all('.itsa-fontsize');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-fontfamily');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-fontcolor');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-markcolor');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
        },

        /**
         * Sets the real editorcursor at the position of the tmp-node created by _getCursorRef<br>
         * Removes the cursor tmp-node afterward.
         * @method _setCursorAtRef
         * @private
        */
        _setCursorAtRef : function() {
            var instance = this,
                sel,
                node = instance.editorY.one('#itsatoolbar-ref');
            if (node) {
                instance.editor.focus();
                sel = new instance.editorY.EditorSelection();
                sel.selectNode(node);
                instance._removeCursorRef();
            }
            else {
                // even without '#itsatoolbar-ref' there might still be nodes that need to be cleaned up
                instance._removeCursorRef();
            }
        },

        /**
         * Creates a reference at cursorposition for backupusage<br>
         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
         * @method _createBackupCursorRef
         * @private
        */
        _createBackupCursorRef : function() {
            var instance = this;
            instance._backupCursorRef = instance._getCursorRef(true);
            return instance._backupCursorRef;
        },

        /**
         * Returns backupnode at cursorposition that is created by _createBackupCursorRef()<br>
         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
         * So descendenst of ItsaSelectlist should refer to this cursorref.
         * @method _getBackupCursorRef
         * @private
         * @return {Y.Node} created empty referencenode
        */
        _getBackupCursorRef : function() {
            var instance = this;
            return instance._backupCursorRef || instance._getCursorRef(true);
        },

        /**
         * Syncs the toolbar's status with the editor.<br>
         * @method sync
         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.
        */
        sync : function(e) {
            // syncUI will sync the toolbarstatus with the editors cursorposition
            var instance = this,
                cursorRef;
            if (!(e && e.changedNode)) {
                cursorRef = instance._getCursorRef(false);
                if (!e) {e = {changedNode: cursorRef};}
                else {e.changedNode = cursorRef;}
                Y.later(250, instance, instance._removeCursorRef);
            }
//            if (instance.toolbarNode) {instance.toolbarNode.fire('itsatoolbar:statusChange', e);}
            instance.fire('statusChange', e);
        },

        /**
         * Creates a new Button on the Toolbar. By default at the end of the toolbar.
         * @method addButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, or you want a custom Function to be executed, you must supply an object:<br>
         * <i>- [command]</i> (String): the execcommand<br>
         * <i>- [value]</i> (String): additional value
         * <i>- [customFunc]</i> (Function): reference to custom function: typicaly, this function will call editorinstance.itstoolbar.execCommand() by itsself
         * <i>- [context]]</i> (instance): the context for customFunc
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @return {Y.Node} reference to the created buttonnode
        */
        addButton : function(iconClass, execCommand, indent) {
            var instance = this,
                buttonNode,
                buttonInnerNode;
            buttonNode = NODE.create(ITSA_BTNNODE);
            buttonNode.addClass(ITSA_BUTTON);
            if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
            else if (Lang.isObject(execCommand)) {
                if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}
                if (Lang.isFunction(execCommand.customFunc)) {
                    buttonNode.addClass(ITSA_BTNCUSTOMFUNC);
                    buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);
                }
            }
            if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}
            buttonInnerNode = NODE.create(ITSA_BTNINNERNODE);
            buttonInnerNode.addClass(iconClass);
            buttonNode.append(buttonInnerNode);
            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist
            if (instance.toolbarNode) {instance.toolbarNode.append(buttonNode);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                instance.editor.on('ready', function(e, buttonNode){instance.toolbarNode.append(buttonNode);}, instance, buttonNode);
            }
            return buttonNode;
        },

        /**
         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>
         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button.
         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.
         * @method addSyncButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>
         * <i>- command</i> (String): the execcommand<br>
         * <i>- value</i> (String): additional value
         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.
         * This function should handle the responseaction to be taken.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the created buttonnode
        */
        addSyncButton : function(iconClass, execCommand, syncFunc, context, indent, position, isToggleButton) {
            var instance = this,
                buttonNode = instance.addButton(iconClass, execCommand, indent, position);
            if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}
            instance.addTarget(buttonNode);
            if (Lang.isFunction(syncFunc)) {buttonNode.on('*:statusChange', Y.bind(syncFunc, context || instance));}
            return buttonNode;
        },

        /**
         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.
         * @method addToggleButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>
         * <i>- command</i> (String): the execcommand<br>
         * <i>- value</i> (String): additional value
         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.
         * This function should handle the responseaction to be taken.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the created buttonnode
        */
        addToggleButton : function(iconClass, execCommand, syncFunc, context, indent, position) {
            var instance = this,
                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);
            buttonNode.addClass(ITSA_BTNTOGGLE);
            return buttonNode;
        },

        /**
         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.
         * Position is by default at the end of the toolbar.<br>
         * @method addButtongroup
         * @param {Array} buttons Should consist of objects with two fields:<br>
         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
         * <i>- command</i> (String): the execcommand that will be executed on buttonclick
         * <i>- [value]</i> (String) optional: additional value for the execcommand
         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)
         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
        */
        addButtongroup : function(buttons, indent, position) {
            var instance = this;
            if (instance.toolbarNode) {instance._addButtongroup(buttons, indent, position);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                instance.editor.on('ready', function(e, buttons, indent, position){instance._addButtongroup(buttons, indent, position);}, instance, buttons, indent, position);
            }
        },

        /**
         * Does the real action of addButtongroup, but assumes that the editor is rendered.<br>
         * therefore not to be called mannually, only by addButtongroup()
         * @method _addButtongroup
         * @private
         * @param {Array} buttons Should consist of objects with at least two fields:<br>
         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.<br>
         * <i>- command</i> (String): the execcommand that will be executed on buttonclick.<br>
         * <i>- [value]</i> (String) optional: additional value for the execcommand.<br>
         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton).<br>
         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance.
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
        */
        _addButtongroup : function(buttons, indent, position) {
            var instance = this,
                buttonGroup = Y.guid(),
                button,
                buttonNode,
                returnNode = null,
                execCommand,
                i;
            for (i=0; i<buttons.length; i++) {
                button = buttons[i];
                if (button.iconClass && button.command) {
                    if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}
                    else {execCommand = button.command;}
                    buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position ? position+i : null));
                    buttonNode.addClass(ITSA_BTNGROUP);
                    buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);
                    buttonNode.setData('buttongroup', buttonGroup);
                    instance.addTarget(buttonNode);
                    if (Lang.isFunction(button.syncFunc)) {buttonNode.on('*:statusChange', Y.bind(button.syncFunc, button.context || instance));}
                    if (!returnNode) {returnNode = buttonNode;}
                }
            }
            return returnNode;
        },
        /**
         * Creates a selectList on the Toolbar. By default at the end of the toolbar.
         * When fired, the event-object returnes with 2 fields:<br>
         * <i>- e.value</i>: value of selected item<br>
         * <i>- e.index</i>: indexnr of the selected item<br>.
         * CAUTION: when using a selectlist, you <u>cannot</u> use standard execCommands. That will not work in most browsers, because the focus will be lost. <br>
         * Instead, create your customexecCommand and use cursorrefference <i>_getBackupCursorRef()</i>: see example <i>_defineExecCommandFontFamily()</i>
         * @method addSelectList
         * @param {Array} items contains all the items. Should be either a list of (String), or a list of (Objects). In case of an Object-list, the objects should contain two fields:<br>
         * <i>- text</i> (String): the text shown in the selectlist<br>
         * <i>- returnValue</i> (String): the returnvalue of e.value<br>
         * In case a String-list is supplied, e.value will equal to the selected String-item (returnvalue==text)

         * @param {String | Object} execCommand ExecCommand that will be executed after a selectChange-event is fired. e.value will be placed as the second argument in editor.execCommand().<br>
         * You could provide a second 'restoreCommand', in case you need a different execCommand to erase some format. In that case you must supply an object with three fields:<br>
         * <i>- command</i> (String): the standard execcommand<br>
         * <i>- restoreCommand</i> (String): the execcommand that will be executed in case e.value equals the restore-value<br>
         * <i>- restoreValue</i> (String): when e.value equals restoreValue, restoreCommand will be used instead of the standard command


         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Object} [config] Object that will be passed into the selectinstance. Has with the following fields:<br>
         * <i>- listAlignRight</i> (Boolean): whether to rightalign the listitems. Default=false<br>
         * <i>- hideSelected</i> (Boolean): whether the selected item is hidden from the list. Default=false
         * @return {Y.ITSASelectlist} reference to the created object
        */
        addSelectlist : function(items, execCommand, syncFunc, context, indent, config) {
            var instance = this,
                selectlist;
            config = Y.merge(config, {items: items, defaultButtonText: ''});
            selectlist = new Y.ITSASelectList(config);
            selectlist.after('render', function(e, execCommand, syncFunc, context, indent){
                var instance = this,
                    selectlist = e.currentTarget,
                    buttonNode = selectlist.buttonNode;
                if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
                else {
                    if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                    if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}
                    if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}
                }
                if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}
                // instance.toolbarNode should always exist here
                instance.addTarget(selectlist);
                selectlist.on('show', instance._createBackupCursorRef, instance);
                selectlist.on('selectChange', instance._handleSelectChange, instance);
                if (Lang.isFunction(syncFunc)) {
                    selectlist.on('*:statusChange', Y.rbind(syncFunc, context || instance));
                }
                instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);
                instance.after('toolbarClick', function(e) {
                    var node = e.node;
                    if (node !== selectlist.buttonNode) {
                        selectlist.hideListbox();
                    }
                });
            }, instance, execCommand, syncFunc, context, indent);
            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist
            if (instance.toolbarNode) {selectlist.render(instance.toolbarNode);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                instance.editor.on('ready', function(){selectlist.render(instance.toolbarNode);}, instance);
            }
            return selectlist;
        },

        /**
         * Gets a clean-content of the editor, without any cursor/selection references
         * @method getContent
         * @return String clean-content
        */
        getContent: function() {
            var instance = this,
                editorY = instance.editorY,
                cloneNode = editorY && editorY.one('body').cloneNode(true);
            return (cloneNode && instance._clearAllTempReferences(cloneNode).getHTML()) || '';
        },

        /**
         * Cleans up bindings and removes plugin
         * @method _clearAllTempReferences
         * @private
         * @param [masterNode] {Y.Node} node in which the references are removed. Leave empty to remove it from the Y.instance (default)
         * It is used when you want to clone the body-node in case of returning a 'clean' content through this.getContent()
         * @return Y.Node only is masterNode is given as a parameter --> returns a clean masterNode
        */
        _clearAllTempReferences: function(masterNode) {
            var instance = this,
                useY, nodes;
            instance._removeCursorRef(masterNode);
            instance._clearEmptyFontRef(masterNode);
            instance._clearBlockerRef(masterNode);
            useY = masterNode || instance.editorY || Y;
            nodes = useY.all('#yui-ie-cursor');
            if (nodes) {nodes.remove();}
            nodes = useY.all('.yui-cursor');
            if (nodes) {nodes.remove();}
            nodes = useY.all('#itsatoolbar-tmpref');
            if (nodes) {nodes.remove();}
            return masterNode;
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
        */
        destructor : function() {
            var instance = this;
             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction
            instance._destroyed = true;
            if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}
            instance._clearAllTempReferences();
            instance.editor.set('extracss', instance._extracssBKP);
            Y.Array.each(
                instance._eventhandlers,
                function(item){
                    item.detach();
                }
            );
            if (instance.toolbarNode) {instance.toolbarNode.remove(true);}
            if (instance._dialogPanelId) {Y.Global.ItsaDialog.panelOptions.splice(instance._dialogPanelId, 1);}
        },

        // -- Private Methods ----------------------------------------------------------

        /**
         * Creates the toolbar in the DOM. Toolbar will appear just above the editor, or -when scrNode is defined-  it will be prepended within srcNode
         *
         * @method _renderUI
         * @private
        */
        _renderUI : function() {
            var instance = this,
                correctedHeight = 0,
                srcNode = instance.get('srcNode'),
                btnSize = instance.get('btnSize');
            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering
            instance.toolbarNode = NODE.create(ITSA_TOOLBAR_TEMPLATE);
            if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}
            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}
            if (srcNode) {
                srcNode.prepend(instance.toolbarNode);
            }
            else {
                instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);
                switch (instance.get('btnSize')) {
                    case 1:
                        correctedHeight = -40;
                    break;
                    case 2:
                        correctedHeight = -44;
                    break;
                    case 3:
                        correctedHeight = -46;
                    break;
                }
                correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10)
                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10)
                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10)
                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);
                instance.editorNode.set('height', correctedHeight);
                instance.editorNode.insert(instance.toolbarNode, 'before');
            }
            instance._initializeButtons();
        },

        /**
         * Binds events when there is a cursorstatus changes in the editor
         *
         * @method _bindUI
         * @private
        */
        _bindUI : function() {
            var instance = this,
                eventhandlers = instance._eventhandlers;
            eventhandlers.push(
                instance.editor.on('nodeChange', instance.sync, instance)
            );
            eventhandlers.push(
                instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance)
            );
            eventhandlers.push(
                instance.toolbarNode.on('click', function(e) {
                    var node = e.target;
                    e.stopPropagation();
                    if (node.hasClass('itsa-icon-selectdown') || node.hasClass('itsa-selectlist-selectedmain')) {
                        node = node.get('parentNode');
                    }
                    else if (node.get('parentNode').hasClass('itsa-selectlist-selectedmain')) {
                        node = node.get('parentNode').get('parentNode');
                    }
                    instance.fire('toolbarClick', {node: node}); // still need to close selectlists
                })
            );
            // TODO: shortcutfunctions
            //instance.editorY.on('keydown', Y.bind(instance._handleShortcutFn, instance));
        },

        /**
         * Not working yet. Handles shortcutfunctions (keyboard ctrl-bold etc)
         *
         * @method _handleShortcutFn
         * @private
        */
        _handleShortcutFn : function(e) {
            var instance = this;
            if (e.ctrlKey || e.metaKey) {
                switch (e.keyCode) {
                    case 66 :
                       e.halt(true);
                       instance.execCommand('bold');
                       instance.sync();
                       break;
                    case 73 :
                       e.halt(true);
                       instance.execCommand('italic');
                       instance.sync();
                       break;
                    case 85 :
                       e.halt(true);
                       instance.execCommand('underline');
                       instance.sync();
                       break;
                }
            }
        },

        /**
         * Creates a Y.Global.ItsaDialog.panel that can be called through method this.getUrl()
         *
         * @method _createUrlDialog
         * @private
        */
        _createUrlDialog: function() {
            var instance = this;
            instance._dialogPanelId = Y.Global.ItsaDialog.definePanel({
                iconClass: Y.Global.ItsaDialog.ICON_INFO,
                form: [
                    {name:'count', label:'{message}', value:'{count}'}
                ],
                buttons: {
                    footer: [
                        {name:'cancel', label:'Cancel', action:Y.Global.ItsaDialog.ACTION_HIDE},
                        {name:'removelink', label:'Remove link', action:Y.Global.ItsaDialog.ACTION_HIDE},
                        {name:'ok', label:'Ok', action:Y.Global.ItsaDialog.ACTION_HIDE, validation: true, isDefault: true}
                    ]
                }
            });
        },

        /**
         * Shows the Url-Panel with an inputfield and the buttons: <b>Cancel, Remove Link, Ok</b><br>
         * @method getUrl
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {String} [defaultmessage] showed inside the form-input.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {String} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getUrl: function(title, message, defaultmessage, callback, context, args, customButtons, customIconclass) {
            var instance = this,
                inputElement;
            inputElement = new Y.ITSAFORMELEMENT({
                name: 'value',
                type: 'input',
                value: defaultmessage,
                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-lastelement',
                marginTop: 10,
                initialFocus: true,
                selectOnFocus: true
            });
            Y.Global.ItsaDialog.showPanel(instance._dialogPanelId, title, message + '<br>' + inputElement.render(), callback, context, args, customButtons, customIconclass);
        },

        /**
         * Defines all custom execCommands
         *
         * @method _defineCustomExecCommands
         * @private
        */
        _defineCustomExecCommands : function() {
            var instance = this;
            instance._defineExecCommandHeader();
            instance._defineExecCommandFontFamily();
            instance._defineExecCommandFontSize();
            instance._defineExecCommandFontColor();
            instance._defineExecCommandMarkColor();
            instance._defineExecCommandHyperlink();
            instance._defineExecCommandRemoveHyperlink();
            instance._defineExecCommandMaillink();
            instance._defineExecCommandImage();
            instance._defineExecCommandIframe();
            instance._defineExecCommandYouTube();
            instance._defineExecSaveContent();
            instance._defineExecSetContent();
        },

        /**
         * Handling the buttonclicks for all buttons on the Toolbar within one eventhandler (delegated by the Toolbar-node)
         *
         * @method _handleBtnClick
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _handleBtnClick : function(e) {
            var instance = this,
                node = e.currentTarget;
            // only execute for .itsa-button, not for all buttontags
            if (node.hasClass(ITSA_BUTTON)) {
                if (node.hasClass(ITSA_BTNTOGGLE)) {
                    node.toggleClass(ITSA_BTNPRESSED);
                }
                else if (node.hasClass(ITSA_BTNSYNC)) {
                    node.toggleClass(ITSA_BTNACTIVE, true);
                }
                else if (node.hasClass(ITSA_BTNGROUP)) {
                    instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);
                    node.toggleClass(ITSA_BTNPRESSED, true);
                }
                if (!node.hasClass(ITSA_BTNCUSTOMFUNC)) {instance._execCommandFromData(node);}
            }
        },

        /**
         * Handling the selectChange event of a selectButton
         *
         * @method _handleSelectChange
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _handleSelectChange : function(e) {
            var selectButtonNode,
                restoreCommand,
                execCommand;
            selectButtonNode = e.currentTarget.buttonNode;
            restoreCommand = selectButtonNode.getData('restoreCommand');
            execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');
            this.execCommand(execCommand, e.value);
        },

        /**
         * Executes this.editor.exec.command with the execCommand and value that is bound to the node through Node.setData('execCommand') and Node.setData('execValue'). <br>
         * these values are bound during definition of addButton(), addSyncButton(), addToggleButton etc.
         *
         * @method _execCommandFromData
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _execCommandFromData: function(buttonNode) {
            var instance = this,
                execCommand,
                execValue;
            execCommand = buttonNode.getData('execCommand');
            execValue = buttonNode.getData('execValue');
            instance._createBackupCursorRef();
            instance.execCommand(execCommand, execValue);
        },

        /**
         * Performs a execCommand that will take into account the editors cursorposition<br>
         * This means that when no selection is made, the operation still works: you can preset an command this way.<br>
         * It also makes 'inserthtml' work with all browsers.
         *
         * @method execCommand
         * @param {String} command The execCommand
         * @param {String} [value] additional commandvalue
        */
        execCommand: function(command, value) {
            var instance = this,
                tmpnode;
            instance.editor.focus();
            if (command==='inserthtml') {
                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari
                // but inserting img does, which can replaced afterwards
                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements
                instance.editor._execCommand('createlink', '&nbsp;');
                instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);
                tmpnode = instance.editorY.one('#itsatoolbar-tmpref');
                tmpnode.replace(value);
            }
            else {instance.editor.exec.command(command, value);}
        },

        /**
         * Checks whether there is a selection within the editor<br>
         *
         * @method _hasSelection
         * @private
         * @return {Boolean} whether there is a selection
        */
        _hasSelection : function() {
            var instance = this,
                sel = new instance.editorY.EditorSelection();
            // use sel.anchorNode for all browsers except IE
            // IE must use sel.getSelected().size(), BUT that will create a selection first.
            // Within IE this wont lead to extra dom-code, but in other browsers that would lead to extra <span> elements.
            // Therefore, FIRST check sel.anchorNode and if that fails,  sel.getSelected().size()
            return (!sel.isCollapsed && (sel.anchorNode || (sel.getSelected().size()>0)));
        },

        /**
         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector
         *
         * @method _checkInbetweenSelector
         * @private
         * @param {String} selector The selector to check for
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection
         * @return {Boolean} whether node resides inbetween selector
        */
        _checkInbetweenSelector : function(selector, cursornode) {
            var instance = this,
                pattern = '<\\s*' + selector + '[^>]*>(.*?)<\\s*/\\s*' + selector  + '>',
                searchHeaderPattern = new RegExp(pattern, 'gi'),
                fragment,
                inbetween = false,
                refContent = instance.editorY.one('body').getHTML(),
                cursorid,
                cursorindex;
            cursorid = cursornode.get('id');
            cursorindex = refContent.indexOf(' id="' + cursorid + '"');
            if (cursorindex===-1) {cursorindex = refContent.indexOf(" id='" + cursorid + "'");}
            if (cursorindex===-1) {cursorindex = refContent.indexOf(" id=" + cursorid);}
            fragment = searchHeaderPattern.exec(refContent);
            while ((fragment !== null) && !inbetween) {
                inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));
                fragment = searchHeaderPattern.exec(refContent); // next search
            }
            return inbetween;
        },

        /**
         * Finds the headernode where the cursor, or selection remains in
         *
         * @method _getActiveHeader
         * @private
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.
         * @return {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.
        */
     _getActiveHeader : function(cursornode) {
            var instance = this,
                pattern,
                searchHeaderPattern,
                fragment,
                nodeFound,
                cursorid,
                nodetag,
                headingNumber = 0,
                returnNode = null,
                checkNode,
                endpos,
                refContent;
            if (cursornode) {
                // node can be a header right away, or it can be a node within a header. Check for both
                nodetag = cursornode.get('tagName');
                if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}
                if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                    returnNode = cursornode;
                }
                else {
                    cursorid = cursornode.get('id');
                    // first look for endtag, to determine which headerlevel to search for
                    pattern = ' id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h\\d>';
                    searchHeaderPattern = new RegExp(pattern, 'gi');
                    refContent = instance.editorY.one('body').getHTML();
                    fragment = searchHeaderPattern.exec(refContent);


                    if (fragment !== null) {
                        // search again, looking for the right headernumber
                        endpos = fragment.index+fragment[0].length-1;
                        headingNumber = refContent.substring(endpos-1, endpos);
                        pattern = '<\\s*h' + headingNumber + '[^>]*>(.*?)id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h' + headingNumber + '>';
                        searchHeaderPattern = new RegExp(pattern, 'gi');
                        fragment = searchHeaderPattern.exec(refContent); // next search
                        if (fragment !== null) {
                            nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);
                        }
                    }
                    if (nodeFound) {
                        checkNode = NODE.create(nodeFound);
                        returnNode = instance.editorY.one('#' + checkNode.get('id'));
                    }
                }
            }
            return returnNode;
        },

        /**
         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.
         *
         * @method _initializeButtons
         * @private
        */
        _initializeButtons : function() {
            var instance = this,
                i,
                item,
                items,
                bgcolor,
                bgcolors,
                buttons;

            // create fonffamily button
            if (instance.get('btnFontfamily')) {
                items = instance.get('fontFamilies');
                for (i=0; i<items.length; i++) {
                    item = items[i];
                    items[i] = {text: "<span style='font-family:"+item+"'>"+item+"</span>", returnValue: item};
                }
                instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {
                    var familyList = e.changedNode.getStyle('fontFamily'),
                        familyListArray = familyList.split(','),
                        activeFamily = familyListArray[0];
                    // some browsers place '' surround the string, when it should contain whitespaces.
                    // first remove them
                    if ((activeFamily.substring(0,1)==="'") || (activeFamily.substring(0,1)==='"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}
                    this.fontSelectlist.selectItemByValue(activeFamily, true, true);
                }, null, true, {buttonWidth: 145});
            }

            // create fontsize button
            if (instance.get('btnFontsize')) {
                items = [];
                for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}
                instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {
                    var fontSize = e.changedNode.getComputedStyle('fontSize'),
                        fontSizeNumber = parseFloat(fontSize),
                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);
                    // make sure not to display partial numbers
                    this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);
                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});
            }

            // create header button
            if (instance.get('btnHeader')) {
                items = [];
                items.push({text: 'No header', returnValue: 'none'});
                for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}
                instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {
                    var instance = this,
                        node = e.changedNode,
                        internalcall = (e.sender && e.sender==='itsaheading'),
                        activeHeader;
                    // prevent update when sync is called after heading has made changes. Check this through e.sender
                    if (!internalcall) {
                        activeHeader = instance._getActiveHeader(node);
                        instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);
                        instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());
                    }
                }, null, true, {buttonWidth: 96});
            }

            // create bold button
            if (instance.get('btnBold')) {
                instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {
                    var fontWeight = e.changedNode.getStyle('fontWeight');
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));
                }, null, true);
            }

            // create italic button
            if (instance.get('btnItalic')) {
                instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));
                });
            }

            // create underline button
            if (instance.get('btnUnderline')) {
                instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));
                });
            }

            // create align buttons
            if (instance.get('grpAlign')) {
                buttons = [
                    {
                        iconClass : instance.ICON_ALIGN_LEFT,
                        command : 'JustifyLeft',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_CENTER,
                        command : 'JustifyCenter',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_RIGHT,
                        command : 'JustifyRight',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));
                                    }
                    }
                ];
            // create justify button
                if (instance.get('btnJustify')) {
                    buttons.push({
                        iconClass : instance.ICON_ALIGN_JUSTIFY,
                        command : 'JustifyFull',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));
                                    }
                    });
                }
                instance.addButtongroup(buttons, true);
            }

            // create subsuperscript buttons
            if (instance.get('grpSubsuper')) {
                instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));
                }, null, true);
                instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));
                });
            }

            // create textcolor button
            if (instance.get('btnTextcolor')) {
                items = [];
                bgcolors = instance.get('colorPallet');
                for (i=0; i<bgcolors.length; i++) {
                    bgcolor = bgcolors[i];
                    items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {
                    var instance = this,
                        styleColor = e.changedNode.getStyle('color'),
                        hexColor = instance._filter_rgb(styleColor);
                    instance.colorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});
            }

            // create markcolor button
            if (instance.get('btnMarkcolor')) {
                items = [];
                bgcolors = instance.get('colorPallet');
                for (i=0; i<bgcolors.length; i++) {
                    bgcolor = bgcolors[i];
                    items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {
                    var instance = this,
                        styleColor = e.changedNode.getStyle('backgroundColor'),
                        hexColor = instance._filter_rgb(styleColor);
                    instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});
            }

            // create indent buttons
            if (instance.get('grpIndent')) {
                instance.addButton(instance.ICON_INDENT, 'indent', true);
                instance.addButton(instance.ICON_OUTDENT, 'outdent');
            }

            // create list buttons
            if (instance.get('grpLists')) {
                instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {
                    var instance = this,
                        node = e.changedNode;
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));
                }, null, true);
                instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {
                    var instance = this,
                        node = e.changedNode;
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));
                });
            }

            // create email button
            if (instance.get('btnEmail')) {
                instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {
                    var instance = this,
                        node = e.changedNode,
                        isLink,
                        isEmailLink;
                    isLink =  instance._checkInbetweenSelector('a', node);
                    if (isLink) {
                        // check if its a normal href or a mailto:
                        while (node && !node.test('a')) {node=node.get('parentNode');}
                        // be carefull: do not === /match() with text, that will fail
                        isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');
                    }
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));
                }, null, true);
            }

            // create hyperlink button
            if (instance.get('btnHyperlink')) {
                instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {
                    var instance = this,
                        posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',
                        node = e.changedNode,
                        isLink,
                        isFileLink = false,
                        href,
                        lastDot,
                        fileExt,
                        isHyperLink;
                    isLink =  instance._checkInbetweenSelector('a', node);
                        if (isLink) {
                            // check if its a normal href or a mailto:
                            while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            href = node.get('href');
                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            if (isHyperLink) {
                                lastDot = href.lastIndexOf('.');
                                if (lastDot!==-1) {
                                    fileExt = href.substring(lastDot)+'.';
                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));
                });
            }

            // create remove-hyperlink button
            if (instance.get('btnRemoveHyperlink')) {
                instance.addSyncButton(instance.ICON_REMOVELINK, 'itsaremovehyperlink', function(e) {
                    var instance = this,
                        node = e.changedNode;
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, instance._checkInbetweenSelector('a', node));
                });
            }

            // create image button
            if (instance.get('btnImage')) {
                instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));
                }, null, true);
            }

            // create video button
            if (instance.get('btnVideo')) {
                instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.hasClass(ITSA_YOUTUBENODE)));
                });
            }

            // create iframe button
            if (instance.get('btnIframe')) {
                instance.addSyncButton(instance.ICON_IFRAME, 'itsacreateiframe', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.hasClass(ITSA_IFRAMENODE)));
                },
                null, true);
            }

            // create clear button
            if (instance.get('btnClear')) {
                instance.addButton(instance.ICON_CLEAR, {command: 'mysetcontent', value: ''}, true);
            }

            // create save button
            if (instance.get('btnSave')) {
                instance.addButton(instance.ICON_SAVE, 'itsasavecontent', true);
            }

            // create cancel button
            if (instance.get('btnCancel')) {
                instance.addButton(instance.ICON_CANCEL, {command: 'mysetcontent', value: instance.initialContent}, true);
            }

            if (instance.get('btnFileSelect') && Y.ItsaFilePicker) {
//                instance.addButton(instance.ICON_EURO, {command: 'inserthtml', value: '&#8364;'}, true);
                instance.addSyncButton(
                    instance.ICON_FILE,
                    {   customFunc: Y.bind(
                            function() {
                                Y.ItsaFilePicker.getFile().then(
                                    function(response) {
                                        instance.execCommand('itsacreatehyperlink', instance.get('baseFileDir') + response.file.filename);
                                    }
                                );
                            },
                            instance
                        )
                    },
                    function(e) {
                        var instance = this,
                            posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',
                            node = e.changedNode,
                            isFileLink = false,
                            isLink,
                            href,
                            lastDot,
                            fileExt,
                            isHyperLink;
                        isLink =  instance._checkInbetweenSelector('a', node);
                        if (isLink) {
                            // check if its a normal href or a mailto:
                            while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            href = node.get('href');
                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            if (isHyperLink) {
                                lastDot = href.lastIndexOf('.');
                                if (lastDot!==-1) {
                                    fileExt = href.substring(lastDot)+'.';
                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                        e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);
                    }
                );
            }

            if (instance.get('grpUndoredo')) {
                instance.addButton(instance.ICON_UNDO, 'undo', true);
                instance.addButton(instance.ICON_REDO, 'redo');
            }

        },

        /**
        * Based on YUI2 rich-editor code
        * @private
        * @method _filter_rgb
        * @param String css The CSS string containing rgb(#,#,#);
        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00
        * @return String
        */
        _filter_rgb: function(css) {
            if (css.toLowerCase().indexOf('rgb') !== -1) {
                var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;

                if (rgb.length === 5) {
                    r = parseInt(rgb[1], 10).toString(16);
                    g = parseInt(rgb[2], 10).toString(16);
                    b = parseInt(rgb[3], 10).toString(16);

                    r = r.length === 1 ? '0' + r : r;
                    g = g.length === 1 ? '0' + g : g;
                    b = b.length === 1 ? '0' + b : b;

                    css = "#" + r + g + b;
                }
            }
            return css;
        },

        /**
        * Defines the execCommand itsaheading
        * @method _defineExecCommandHeader
        * @private
        */
        _defineExecCommandHeader : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsaheading: function(cmd, val) {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getBackupCursorRef(),
                            activeHeader = itsatoolbar._getActiveHeader(noderef),
                            headingNumber = 0,
                            node;
                        if (val==='none') {
                            // want to clear heading
                            if (activeHeader) {
                                activeHeader.replace("<p>"+activeHeader.getHTML()+"</p>");
                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox
                                itsatoolbar.headerSelectlist.set('disabled', true);
                            }
                        } else {
                            // want to add or change a heading
                            if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}
                            if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                                node = activeHeader || noderef;
                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches
                                node.replace("<"+val+" id='" + editorY.guid() + "'>"+node.getHTML()+"</"+val+">");
                            }
                        }
                        // do a toolbarsync, because styles will change.
                        // but do not refresh the heading-selectlist! Therefore e.sender is defined
                        itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});
                        // take some time to let the sync do its work before set and remove cursor
                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                   }
                });
            }
        },

        /**
        * Defines the execCommand itsafontfamily
        * @method _defineExecCommandFontFamily
        * @private
        */
        _defineExecCommandFontFamily : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontfamily: function(cmd, val) {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            // first cleaning up old fontsize
                            noderef.all('span').setStyle('fontFamily', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);
                            noderef.setStyle('fontFamily', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTFAMILYNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            noderef.replace("<span class='" + ITSA_FONTFAMILYNODE + "' style='font-family:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsafontsize
        * @method _defineExecCommandFontSize
        * @private
        */
        _defineExecCommandFontSize : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontsize: function(cmd, val) {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            parentnode,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            parentnode = noderef.get('parentNode');
                            if (Y.UA.webkit) {
                                parentnode.setStyle('lineHeight', '');
                            }
                            // first cleaning up old fontsize
                            noderef.all('span').setStyle('fontSize', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);
                            noderef.setStyle('fontSize', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTSIZENODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            noderef.replace("<span class='" + ITSA_FONTSIZENODE + "' style='font-size:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsafontcolor<br>
        * We need to overrule the standard color execCommand, because in IE the ItsaSelectlist will loose focus on the selection
        * @method _defineExecCommandFontColor
        * @private
        */
        _defineExecCommandFontColor : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontcolor: function(cmd, val) {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            // first cleaning up old fontcolors
                            noderef.all('span').setStyle('color', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);
                            noderef.setStyle('color', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            noderef.replace("<span class='" + ITSA_FONTCOLORNODE + "' style='color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsamarkcolor<br>
        * We need to overrule the standard hilitecolor execCommand, because in IE the ItsaSelectlist will loose focus on the selection
        * @method _defineExecCommandMarkColor
        * @private
        */
        _defineExecCommandMarkColor : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsamarkcolor: function(cmd, val) {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            // first cleaning up old fontbgcolors
                            noderef.all('span').setStyle('backgroundColor', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);
                            noderef.setStyle('backgroundColor', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_MARKCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            // remove the tmp-node placeholder
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            noderef.replace("<span class='" + ITSA_MARKCOLORNODE + "' style='background-color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsasavecontent<br>
        * @method _defineExecSaveContent
        * @private
        */
        _defineExecSaveContent : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsasavecontent: function() {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef;
                        noderef = itsatoolbar._getBackupCursorRef();

                        // save with clean content

                        // remove the tmp-node placeholder
                        itsatoolbar._setCursorAtRef();
                    }
                });
            }
        },


        /**
        * Defines the execCommand itsasavecontent<br>
        * @method _defineExecSetContent
        * @private
        */
        _defineExecSetContent : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsasetcontent) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsasetcontent: function(cmd, val) {
                        var editor = this.get('host'),
                            itsatoolbar = editor.itsatoolbar,
                            noderef;
                        noderef = itsatoolbar._getBackupCursorRef();

                        // save with clean content
                        editor.set('content', val);

                        // remove the tmp-node placeholder
                        itsatoolbar._setCursorAtRef();
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacretaehyperlink
        * @method _defineExecCommandHyperlink
        * @private
        */
        _defineExecCommandHyperlink : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsacreatehyperlink: function(cmd, val) {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            callFunc,
                            currentAnchorNode,
                            anchorNodeWithinSel,
                            currentHyperlink,
                            href,
                            noderefHTML,
                            wwwlink,
                            selectedText,
                            defaultHyperlink;
                        noderef = itsatoolbar._getBackupCursorRef();
                        // first we need to find out whether the cursor is within a current hyperlink, or a hyperlink is within selection
                        // If that is the case, then this hyperlink needs to be modified. Otherwise create a new hyperlink
                        anchorNodeWithinSel = noderef.one('a');
                        if (anchorNodeWithinSel || itsatoolbar._checkInbetweenSelector('a', noderef)) {
                            currentAnchorNode = anchorNodeWithinSel || noderef;
                            while (currentAnchorNode && (currentAnchorNode.get('tagName')!=='A')) {
                                currentAnchorNode = currentAnchorNode.get('parentNode');
                            }
                            if (currentAnchorNode) {
                                currentHyperlink = currentAnchorNode.get('href');
                            }
                        }
                        if (noderef.hasClass(ITSA_REFSELECTION)) {
                            selectedText = Lang.trim(Y.EditorSelection.getText(noderef));
                            noderefHTML = noderef.getHTML();
                            wwwlink = (selectedText.substr(0,4) === 'www.');
                            if ((selectedText.substr(0,7) === 'http://') || (selectedText.substr(0,8) === 'https://') || wwwlink) {
                                defaultHyperlink = (wwwlink ? 'http://' : '') + selectedText;
                            }
                        }
                        if (val) {
                            href = val.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            if (currentAnchorNode) {
                                currentAnchorNode.set('href', href);
                            }
                            else {
                                noderef.setHTML('<a href="' + href+ '" target="_blank">' + (noderefHTML || href) + '</a>'+ ITSA_REFNODE);
                                // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                // of ITSA_REF_NODE. Because we need to keep the innercontent
                                noderef.set('id', ITSA_REFSELECTION);
                                noderef.toggleClass(ITSA_REFSELECTION, true);
                            }
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Ask for hyperlink
                            // Which function to call? Only with button 'Remove link' when there is already an anchorlink
                            callFunc = currentAnchorNode ? Y.bind(itsatoolbar.getUrl, itsatoolbar) : Y.bind(Y.Global.ItsaDialog.getInput, Y.Global.ItsaDialog);
                            callFunc(
                                'Hyperlink',
                                'Enter here the link',
                                currentHyperlink || defaultHyperlink || 'http://',
                                function(e) {
                                    var itsatoolbar = this;
                                    if (e.buttonName==='ok') {
                                        href = e.value.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                                        if (currentAnchorNode) {
                                            currentAnchorNode.set('href', href);
                                        }
                                        else {
                                            noderef.setHTML('<a href="' + href+ '" target="_blank">' + (noderefHTML || href) + '</a>'+ ITSA_REFNODE);
                                            // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                            // of ITSA_REF_NODE. Because we need to keep the innercontent
                                            noderef.set('id', ITSA_REFSELECTION);
                                            noderef.toggleClass(ITSA_REFSELECTION, true);
                                        }
                                    }
                                    if (e.buttonName==='removelink') {
                                        if (currentAnchorNode.getHTML()==='') {
                                            currentAnchorNode.remove(false);
                                        }
                                        else {
                                            currentAnchorNode.replace(currentAnchorNode.getHTML());
                                        }
                                        itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                        // take some time to let the sync do its work before set and remove cursor
                                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                                    }
                                    else {
                                        itsatoolbar._setCursorAtRef();
                                    }
                                },
                                itsatoolbar
                            );
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacretaehyperlink
        * @method _defineExecCommandRemoveHyperlink
        * @private
        */
        _defineExecCommandRemoveHyperlink : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsaremovehyperlink) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsaremovehyperlink: function() {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            currentAnchorNode,
                            anchorNodeWithinSel;
                        noderef = itsatoolbar._getBackupCursorRef();
                        // first we need to find out whether the cursor is within a current hyperlink, or a hyperlink is within selection
                        // If that is the case, then this hyperlink needs to be modified. Otherwise create a new hyperlink
                        anchorNodeWithinSel = noderef.one('a');
                        if (anchorNodeWithinSel || itsatoolbar._checkInbetweenSelector('a', noderef)) {
                            currentAnchorNode = anchorNodeWithinSel || noderef;
                            while (currentAnchorNode && (currentAnchorNode.get('tagName')!=='A')) {
                                currentAnchorNode = currentAnchorNode.get('parentNode');
                            }
                            if (currentAnchorNode) {
                                if (currentAnchorNode.getHTML()==='') {
                                    currentAnchorNode.remove(false);
                                }
                                else {
                                    currentAnchorNode.replace(currentAnchorNode.getHTML());
                                }
                                itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                // take some time to let the sync do its work before set and remove cursor
                                Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                            }
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreatemaillink
        * @method _defineExecCommandMaillink
        * @private
        */
        _defineExecCommandMaillink : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreatemaillink: function(cmd, val) {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            callFunc,
                            currentAnchorNode,
                            anchorNodeWithinSel,
                            currentHyperlink,
                            href,
                            noderefHTML,
                            selectedText,
                            defaultHyperlink;
                        noderef = itsatoolbar._getBackupCursorRef();
                        // first we need to find out whether the cursor is within a current hyperlink, or a hyperlink is within selection
                        // If that is the case, then this hyperlink needs to be modified. Otherwise create a new hyperlink
                        anchorNodeWithinSel = noderef.one('a');
                        if (anchorNodeWithinSel || itsatoolbar._checkInbetweenSelector('a', noderef)) {
                            currentAnchorNode = anchorNodeWithinSel || noderef;
                            while (currentAnchorNode && (currentAnchorNode.get('tagName')!=='A')) {
                                currentAnchorNode = currentAnchorNode.get('parentNode');
                            }
                            if (currentAnchorNode) {
                                currentHyperlink = currentAnchorNode.get('href');
                                if (currentHyperlink.toLowerCase().substr(0,7)==='mailto:') {currentHyperlink = currentHyperlink.substr(7);}
                            }
                        }
                        if (noderef.hasClass(ITSA_REFSELECTION)) {
                            selectedText = Lang.trim(Y.EditorSelection.getText(noderef));
                            noderefHTML = noderef.getHTML();
                            if (selectedText.indexOf('@') !== -1) {
                                defaultHyperlink = selectedText;
                            }
                        }
                        if (val) {
                            href = 'mailto:' + val.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            if (currentAnchorNode) {
                                currentAnchorNode.set('href', href);
                            }
                            else {
                                noderef.setHTML('<a href="' + href+ '">' + (noderefHTML || href) + '</a>'+ ITSA_REFNODE);
                                // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                // of ITSA_REF_NODE. Because we need to keep the innercontent
                                noderef.set('id', ITSA_REFSELECTION);
                                noderef.toggleClass(ITSA_REFSELECTION, true);
                            }
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Ask for emaillink
                            // Which function to call? Only with button 'Remove link' when there is already an anchorlink
                            callFunc = currentAnchorNode ? Y.bind(itsatoolbar.getUrl, itsatoolbar) : Y.bind(Y.Global.ItsaDialog.getInput, Y.Global.ItsaDialog);
                            callFunc(
                                'Emaillink',
                                'Enter here the emailaddress',
                                currentHyperlink || defaultHyperlink || '',
                                function(e) {
                                    var itsatoolbar = this,
                                        href;
                                    if (e.buttonName==='ok') {
                                        href = 'mailto:' + e.value.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                                        if (currentAnchorNode) {
                                            currentAnchorNode.set('href', href);
                                        }
                                        else {
                                            noderef.setHTML('<a href="' + href+ '">' + (noderefHTML || href) + '</a>'+ ITSA_REFNODE);
                                            // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                            // of ITSA_REF_NODE. Because we need to keep the innercontent
                                            noderef.set('id', ITSA_REFSELECTION);
                                            noderef.toggleClass(ITSA_REFSELECTION, true);
                                        }
                                    }
                                    if (e.buttonName==='removelink') {
                                        if (currentAnchorNode.getHTML()==='') {
                                            currentAnchorNode.remove(false);
                                        }
                                        else {
                                            currentAnchorNode.replace(currentAnchorNode.getHTML());
                                        }
                                        itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                        // take some time to let the sync do its work before set and remove cursor
                                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                                    }
                                    else {
                                        itsatoolbar._setCursorAtRef();
                                    }
                                },
                                itsatoolbar
                            );
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreateimage
        * @method _defineExecCommandImage
        * @private
        */
        _defineExecCommandImage : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateimage: function(cmd, val) {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
//                            callFunc,
                            src,
                            wwwlink,
                            currentImageNode,
                            currentImagelink,
                            selectedText,
                            defaultImagelink;
                        noderef = itsatoolbar._getBackupCursorRef();
                        // first we need to find out whether the cursor is within a current hyperlink, or a hyperlink is within selection
                        // If that is the case, then this hyperlink needs to be modified. Otherwise create a new hyperlink
                        currentImageNode = noderef.one('img');
                        if (currentImageNode) {
                            currentImagelink = currentImageNode.get('src');
                        }

                        if (noderef.hasClass(ITSA_REFSELECTION)) {
                            selectedText = Lang.trim(Y.EditorSelection.getText(noderef));
                            wwwlink = (selectedText.substr(0,4) === 'www.');
                            if ((selectedText.substr(0,7) === 'http://') || (selectedText.substr(0,8) === 'https://') || wwwlink) {
                                defaultImagelink = (wwwlink ? 'http://' : '') + selectedText;
                            }
                        }
                        if (val) {
                            src = val.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            if (currentImageNode) {
                                currentImageNode.set('src', src);
                            }
                            else {
                                noderef.setHTML('<img src="' + src+ '" />' + ITSA_REFNODE);
                                // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                // of ITSA_REF_NODE. Because we need to keep the innercontent
                                noderef.set('id', ITSA_REFSELECTION);
                                noderef.toggleClass(ITSA_REFSELECTION, true);
                            }
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Which function to call? Only with button 'Remove link' when there is already an anchorlink
//                            callFunc = currentImageNode ? Y.bind(itsatoolbar.getUrl, itsatoolbar) : Y.bind(Y.Global.ItsaDialog.getInput, Y.Global.ItsaDialog);
                            Y.Global.ItsaDialog.getInput(
                                'Inline Image',
                                'Enter here the link to the image',
                                currentImagelink || defaultImagelink || 'http://',
                                function(e) {
                                    var itsatoolbar = this;
                                    if (e.buttonName==='ok') {
                                        src = e.value.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                                        if (currentImageNode) {
                                            currentImageNode.set('src', src);
                                        }
                                        else {
                                            noderef.setHTML('<img src="' + src+ '" />' + ITSA_REFNODE);
                                            // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                            // of ITSA_REF_NODE. Because we need to keep the innercontent
                                            noderef.set('id', ITSA_REFSELECTION);
                                            noderef.toggleClass(ITSA_REFSELECTION, true);
                                        }
                                    }
                                    if (e.buttonName==='removelink') {
                                        currentImageNode.remove(false);
                                        itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                        // take some time to let the sync do its work before set and remove cursor
                                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                                    }
                                    else {
                                        itsatoolbar._setCursorAtRef();
                                    }
                                },
                                itsatoolbar
                            );
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreateyoutube
        * @method _defineExecCommandYouTube
        * @private
        */
        _defineExecCommandYouTube : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateyoutube: function() {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            previousNode,
                            blockerNode,
                            callFunc,
                            regExp1 = /^http:\/\/www\.youtube\.com\/watch?v=(\w+)/, // search for strings like http://www.youtube.com/watch?v=PHIaeHAcE_A&whatever
                            regExp2 = /^http:\/\/youtu\.be\/(\w+)/, // search for strings like http://youtu.be/PHIaeHAcE_A&whatever
                            regExp3 = /^http:\/\/www\.youtube\.com\/embed\/(\w+)/, // search for strings like http://www.youtube.com/embed/PHIaeHAcE_A&whatever
                            regExp4 = /^v=(\w+)/, // search for strings like v=PHIaeHAcE_A&whatever
                            regExp5 = /^(\w+)$/, // search for strings like PHIaeHAcE_A&whatever
                            currentYouTubeNode,
                            currentYouTubeLink;
                        // BE CAREFULL: when manipulating: the selection surrounds the blockerdiv and the cursor is inbetween the blocker-div and the iframe!!!
                        noderef = itsatoolbar._getBackupCursorRef();
                        blockerNode = noderef.one('.'+ITSA_IFRAMEBLOCKER);
                        // Now check if you are manipulating an existing iframe-element:
                        if (blockerNode) {
                            // yes: a blockernode exists, so we are manipulating an existent iframe-element
                            currentYouTubeNode = noderef.next('iframe');
                            if (currentYouTubeNode) {
                                // First the most tricky part: We need to reset the position of JUST ITSA_REFNODE
                                previousNode = itsatoolbar.editorY.one('#itsatoolbar-ref');
                                previousNode.remove(false);
                                // now reposition the cursor
                                currentYouTubeNode.insert(ITSA_REFNODE, 'after');
                                // next: we read the src attribute
                                currentYouTubeLink = currentYouTubeNode.get('src');
                                // Try to extract the videoitem based on regExp1-regExp5
                                if (regExp1.test(currentYouTubeLink) || regExp2.test(currentYouTubeLink) || regExp3.test(currentYouTubeLink) || regExp4.test(currentYouTubeLink) || regExp5.test(currentYouTubeLink)) {
                                    currentYouTubeLink = RegExp.$1;
                                }
                            }
                        }
                        // Which function to call? Only with button 'Remove link' when there is already an anchorlink
                        callFunc = currentYouTubeNode ? Y.bind(itsatoolbar.getUrl, itsatoolbar) : Y.bind(Y.Global.ItsaDialog.getInput, Y.Global.ItsaDialog);
                        callFunc(
                            'Inline YouTube movie',
                            'Enter here the link to the youtube-movie',
                            currentYouTubeLink || 'http://youtu.be/PHIaeHAcE_A',
                            function(e) {
                                var itsatoolbar = this,
                                    src,
                                    videoitem,
                                    width = 420,
                                    height = 315;
                                if (e.buttonName==='ok') {
                                    src = e.value.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                                    // Try to extract the videoitem based on regExp1-regExp5
                                    if (regExp1.test(src) || regExp2.test(src) || regExp3.test(src) || regExp4.test(src) || regExp5.test(src)) {
                                        videoitem = RegExp.$1;
                                    }
                                    if (videoitem) {
                                        if (currentYouTubeNode) {
                                            currentYouTubeNode.set('src', 'http://www.youtube.com/embed/' + videoitem);
                                        }
                                        else {
                                            noderef.setHTML('<span style="padding-left:'+width+'px; margin-right:-'+width+'px; padding-top:'+height+'px; " class="'+ITSA_IFRAMEBLOCKER+' '+
                                                            ITSA_YOUTUBENODE+'"></span><iframe width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/' +
                                                            videoitem + '" frameborder="0" allowfullscreen></iframe>');
                                            // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                            // of ITSA_REF_NODE. Because we need to keep the innercontent
                                            noderef.set('id', ITSA_REFSELECTION);
                                            noderef.toggleClass(ITSA_REFSELECTION, true);
                                        }
                                    }
                                }
                                if (e.buttonName==='removelink') {
                                    if (currentYouTubeNode) {
                                        currentYouTubeNode.remove(false);
                                    }
                                    if (blockerNode) {
                                        blockerNode.remove(false);
                                    }
                                    itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                    // take some time to let the sync do its work before set and remove cursor
                                    Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                                }
                                else {
                                    itsatoolbar._setCursorAtRef();
                                }
                            },
                            itsatoolbar
                        );
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreateiframe
        * @method _defineExecCommandIframe
        * @private
        */
        _defineExecCommandIframe : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateiframe) {
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateiframe: function() {
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            blockerNode,
                            previousNode,
                            callFunc,
                            currentIframeNode,
                            currentIframeSrc;
                        noderef = itsatoolbar._getBackupCursorRef();
                        blockerNode = noderef.one('.'+ITSA_IFRAMEBLOCKER);
                        // Now check if you are manipulating an existing iframe-element:
                        if (blockerNode) {
                            // yes: a blockernode exists, so we are manipulating an existent iframe-element
                            currentIframeNode = noderef.next('iframe');
                            if (currentIframeNode) {
                                // First the most tricky part: We need to reset the position of JUST ITSA_REFNODE
                                previousNode = itsatoolbar.editorY.one('#itsatoolbar-ref');
                                previousNode.remove(false);
                                // now reposition the cursor
                                currentIframeNode.insert(ITSA_REFNODE, 'after');
                                // next: we read the src attribute
                                currentIframeSrc = currentIframeNode.get('src');
                            }
                        }
                        // Which function to call? Only with button 'Remove link' when there is already an anchorlink
                        callFunc = currentIframeNode ? Y.bind(itsatoolbar.getUrl, itsatoolbar) : Y.bind(Y.Global.ItsaDialog.getInput, Y.Global.ItsaDialog);
                        callFunc(
                            'Inline iframe',
                            'Enter here the source to the iframe',
                            currentIframeSrc || 'http://',
                            function(e) {
                                var itsatoolbar = this,
                                    width = 420,
                                    height = 315,
                                    src;
                                if (e.buttonName==='ok') {
                                    src = e.value.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                                    if (currentIframeNode) {
                                        currentIframeNode.set('src', src);
                                    }
                                    else {
                                        noderef.setHTML('<span style="padding-left:'+width+'px; margin-right:-'+width+'px; padding-top:'+height+'px; " class="'+ITSA_IFRAMEBLOCKER+' '+
                                                        ITSA_IFRAMENODE+'"></span><iframe width="'+width+'" height="'+height+'" src="' + src + '" frameborder="0"></iframe>');
                                        // even if there was no selection, we pretent if so AND change the id: we DON'T want the noderef have the id
                                        // of ITSA_REF_NODE. Because we need to keep the innercontent
                                        noderef.set('id', ITSA_REFSELECTION);
                                        noderef.toggleClass(ITSA_REFSELECTION, true);
                                    }
                                }
                                if (e.buttonName==='removelink') {
                                    if (currentIframeNode) {
                                        currentIframeNode.remove(false);
                                    }
                                    if (blockerNode) {
                                        blockerNode.remove(false);
                                    }
                                    itsatoolbar.sync({changedNode: editorY.one('#itsatoolbar-ref')});
                                    // take some time to let the sync do its work before set and remove cursor
                                    Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                                }
                                else {
                                    itsatoolbar._setCursorAtRef();
                                }
                            },
                            itsatoolbar
                        );
                    }
                });
            }
        }

    }, {
        NS : 'itsatoolbar',
        ATTRS : {

            /**
             * @description Defines whether keyboard-enter will lead to P-tag. Default=false (meaning that BR's will be created)
             * @attribute paraSupport
             * @type Boolean
            */
            paraSupport : {
                value: false,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description The sourceNode that holds the Toolbar. Could be an empty DIV.<br>
             * If not defined, than the Toolbar will be created just above the Editor.
             * By specifying the srcNode, one could create the Toolbar on top of the page, regardless of the Editor's position
             * @attribute srcNode
             * @type Y.Node
            */
            srcNode : {
                value: null,
                writeOnce: 'initOnly',
                setter: function(val) {
                    return Y.one(val);
                },
                validator: function(val) {
                    return Y.one(val);
                }
            },

            /**
             * @description The size of the buttons<br>
             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>
             * Default = 2
             * @attribute btnSize
             * @type int
            */
            btnSize : {
                value: 2,
                validator: function(val) {
                    return (Lang.isNumber(val) && (val>0) && (val<4));
                }
            },

            /**
             * @description The amount of headerlevels that can be selected<br>
             * Should be a value from 1-9<br>
             * Default = 6
             * @attribute headerLevels
             * @type int
            */
            headerLevels : {
                value: 6,
                validator: function(val) {
                    return (Lang.isNumber(val) && (val>0) && (val<10));
                }
            },

            /**
             * @description The fontfamilies that can be selected.<br>
             * Be aware to supply fontFamilies that are supported by the browser.<br>
             * Typically usage is the standard families extended by some custom fonts.<br>
             * @attribute fontFamilies
             * @type Array [String]
            */
            fontFamilies : {
                value: [
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Courier New',
                    'Lucida Console',
                    'Tahoma',
                    'Times New Roman',
                    'Trebuchet MS',
                    'Verdana'
                ],
                validator: function(val) {
                    return (Lang.isArray(val));
                }
            },

            /**
             * @description Whether the button fontfamily is available<br>
             * Default = true
             * @attribute btnFontfamily
             * @type Boolean
            */
            btnFontfamily : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button fontsize is available<br>
             * Default = true
             * @attribute btnFontsize
             * @type Boolean
            */
            btnFontsize : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button headers is available<br>
             * because this function doesn't work well on all browsers, it is set of by default.<br>
             * Is something to work on in fututr releases. It works within firefox though.
             * Default = false
             * @attribute btnHeader
             * @type Boolean
            */
            btnHeader : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button bold is available<br>
             * Default = true
             * @attribute btnBold
             * @type Boolean
            */
            btnBold : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button italic is available<br>
             * Default = true
             * @attribute btnItalic
             * @type Boolean
            */
            btnItalic : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button underline is available<br>
             * Default = true
             * @attribute btnUnderline
             * @type Boolean
            */
            btnUnderline : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group align is available<br>
             * Default = true
             * @attribute grpAlign
             * @type Boolean
            */
            grpAlign : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button justify is available<br>
             * will only be shown in combination with grpalign
             * Default = true
             * @attribute btnJustify
             * @type Boolean
            */
            btnJustify : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group sub/superscript is available<br>
             * Default = true
             * @attribute grpSubsuper
             * @type Boolean
            */
            grpSubsuper : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button textcolor is available<br>
             * Default = true
             * @attribute btnTextcolor
             * @type Boolean
            */
            btnTextcolor : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button markcolor is available<br>
             * Default = true
             * @attribute btnMarkcolor
             * @type Boolean
            */
            btnMarkcolor : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group indent is available<br>
             * Default = true
             * @attribute grpIndent
             * @type Boolean
            */
            grpIndent : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group lists is available<br>
             * Default = true
             * @attribute grpLists
             * @type Boolean
            */
            grpLists : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },
/*
            btnremoveformat : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },
            btnhiddenelements : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },
*/

            /**
             * @description Whether the group undo/redo is available<br>
             * Default = true
             * @attribute grpUndoredo
             * @type Boolean
            */
            grpUndoredo : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button email is available<br>
             * Default = true
             * @attribute btnEmail
             * @type Boolean
            */
            btnEmail : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button hyperlink is available<br>
             * Default = true
             * @attribute btnHyperlink
             * @type Boolean
            */
            btnHyperlink : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button remove-hyperlink is available<br>
             * Default = true
             * @attribute btnRemoveHyperlink
             * @type Boolean
            */
            btnRemoveHyperlink : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button image is available<br>
             * because this code needs to be developed in a better way, the function is disabled by default.<br>
             * It works in a simple way though.
             * Default = false
             * @attribute btnImage
             * @type Boolean
            */
            btnImage : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button iframe is available<br>
             * because not all iframe-options can be entered, the function is disabled by default.<br>
             * It does work, but you cannot specify the iframesize.
             * Default = false
             * @attribute btnIframe
             * @type Boolean
            */
            btnIframe : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button video is available<br>
             * Default = true
             * @attribute btnVideo
             * @type Boolean
            */
            btnVideo : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button save is available<br>
             * Will only fire a 'save'-event, the user should take the approperiate action himself.
             * If the attribute 'confirmSave' is set: then a confirmationmessage will appear before.
             * Default = false
             * @attribute btnSave
             * @type Boolean
            */
            btnSave : {
                value: false,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button 'filebrowser' is available<br>
             * Only visible if gallery-itsafilepicker is included.
             * Default = false
             * @attribute btnFileSelect
             * @type Boolean
            */
            btnFileSelect : {
                value: false,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            baseFileDir : {
                value : '',
                validator: function(val) {
                    return typeof val==='string';
                },
                getter: function(v) {
                    return (/\/$/).test(v) ? v : (v + '/');
                }
            },

            /**
             * @description Whether the button cancel is available<br>
             * Will restore the initial content and fire a 'cancel'-event, the user can take the approperiate action himself.<br>
             * If the attribute 'confirmCancel' is set: then a confirmationmessage will appear before.
             * Default = false
             * @attribute btnCancel
             * @type Boolean
            */
            btnCancel : {
                value: false,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button clear is available<br>
             * Will clear the editors content. If the attribute 'confirmClear' is set: then a confirmationmessage will appear before.
             * Default = false
             * @attribute btnClear
             * @type Boolean
            */
            btnClear : {
                value: false,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether a confirmationmessage is shown before saving the editors content<br>
             * Only to be used in combination with btnSave=true.
             * Default = true
             * @attribute confirmSave
             * @type Boolean
            */
            confirmSave : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether a confirmationmessage is shown before canceling the editors content<br>
             * Only to be used in combination with btnCancel=true.
             * Default = true
             * @attribute confirmCancel
             * @type Boolean
            */
            confirmCancel : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether a confirmationmessage is shown before cleaning the editors content<br>
             * Only to be used in combination with btnClear=true.
             * Default = true
             * @attribute confirmClear
             * @type Boolean
            */
            confirmClear : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether to set the focus on the editor once plugged in.
             * Default = true
             * @attribute initialFocus
             * @type Boolean
            */
            initialFocus : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },

            /**
             * @description The colorpallet to use<br>
             * @attribute colorPallet
             * @type Array (String)
            */
            colorPallet : {
                value : [
                    '#111111',
                    '#2D2D2D',
                    '#434343',
                    '#5B5B5B',
                    '#737373',
                    '#8B8B8B',
                    '#A2A2A2',
                    '#B9B9B9',
                    '#000000',
                    '#D0D0D0',
                    '#E6E6E6',
                    '#FFFFFF',
                    '#BFBF00',
                    '#FFFF00',
                    '#FFFF40',
                    '#FFFF80',
                    '#FFFFBF',
                    '#525330',
                    '#898A49',
                    '#AEA945',
                    '#7F7F00',
                    '#C3BE71',
                    '#E0DCAA',
                    '#FCFAE1',
                    '#60BF00',
                    '#80FF00',
                    '#A0FF40',
                    '#C0FF80',
                    '#DFFFBF',
                    '#3B5738',
                    '#668F5A',
                    '#7F9757',
                    '#407F00',
                    '#8A9B55',
                    '#B7C296',
                    '#E6EBD5',
                    '#00BF00',
                    '#00FF80',
                    '#40FFA0',
                    '#80FFC0',
                    '#BFFFDF',
                    '#033D21',
                    '#438059',
                    '#7FA37C',
                    '#007F40',
                    '#8DAE94',
                    '#ACC6B5',
                    '#DDEBE2',
                    '#00BFBF',
                    '#00FFFF',
                    '#40FFFF',
                    '#80FFFF',
                    '#BFFFFF',
                    '#033D3D',
                    '#347D7E',
                    '#609A9F',
                    '#007F7F',
                    '#96BDC4',
                    '#B5D1D7',
                    '#E2F1F4',
                    '#0060BF',
                    '#0080FF',
                    '#40A0FF',
                    '#80C0FF',
                    '#BFDFFF',
                    '#1B2C48',
                    '#385376',
                    '#57708F',
                    '#00407F',
                    '#7792AC',
                    '#A8BED1',
                    '#DEEBF6',
                    '#0000BF',
                    '#0000FF',
                    '#4040FF',
                    '#8080FF',
                    '#BFBFFF',
                    '#212143',
                    '#373E68',
                    '#444F75',
                    '#00007F',
                    '#585E82',
                    '#8687A4',
                    '#D2D1E1',
                    '#6000BF',
                    '#8000FF',
                    '#A040FF',
                    '#C080FF',
                    '#DFBFFF',
                    '#302449',
                    '#54466F',
                    '#655A7F',
                    '#40007F',
                    '#726284',
                    '#9E8FA9',
                    '#DCD1DF',
                    '#BF00BF',
                    '#FF00FF',
                    '#FF40FF',
                    '#FF80FF',
                    '#FFBFFF',
                    '#4A234A',
                    '#794A72',
                    '#936386',
                    '#7F007F',
                    '#9D7292',
                    '#C0A0B6',
                    '#ECDAE5',
                    '#BF005F',
                    '#FF007F',
                    '#FF409F',
                    '#FF80BF',
                    '#FFBFDF',
                    '#451528',
                    '#823857',
                    '#A94A76',
                    '#7F003F',
                    '#BC6F95',
                    '#D8A5BB',
                    '#F7DDE9',
                    '#C00000',
                    '#FF0000',
                    '#FF4040',
                    '#FF8080',
                    '#FFC0C0',
                    '#441415',
                    '#82393C',
                    '#AA4D4E',
                    '#800000',
                    '#BC6E6E',
                    '#D8A3A4',
                    '#F8DDDD',
                    '#BF5F00',
                    '#FF7F00',
                    '#FF9F40',
                    '#FFBF80',
                    '#FFDFBF',
                    '#482C1B',
                    '#855A40',
                    '#B27C51',
                    '#7F3F00',
                    '#C49B71',
                    '#E1C4A8',
                    '#FDEEE0'
                ],
                validator: function(val) {
                    return Lang.isArray(val) ;
                }

            }
        }
    }
);

}, 'gallery-2014.01.03-22-50', {
    "requires": [
        "plugin",
        "base-build",
        "node-base",
        "editor",
        "event-delegate",
        "event-custom",
        "cssbutton",
        "gallery-itsaselectlist",
        "gallery-itsadialogbox"
    ],
    "skinnable": true
});
