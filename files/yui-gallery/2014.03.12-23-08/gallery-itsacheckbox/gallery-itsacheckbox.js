YUI.add('gallery-itsacheckbox', function (Y, NAME) {

/**
 *
 * Class ITSACheckBox
 *
 *
 * Widget that replaces the standard html-checkbox.
 *
 * @module gallery-itsacheckbox
 * @extends Widget
 * @class ITSACheckbox
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var LANG = Y.Lang,
    YARRAY = Y.Array,
    Node = Y.Node,
    YUI3_ = 'yui3-',
    WIDGET_CLASS = YUI3_+'itsacheckbox',
    READONLY = 'readonly',
    READONLY_CLASS = WIDGET_CLASS + '-' + READONLY,
    PARENT_CLASS = 'itsa-widget-parent',
    LOADING_CLASS = WIDGET_CLASS + '-loading',
    RERENDER_CLASS = WIDGET_CLASS + '-rerender',
    HIDDEN_CLASS = WIDGET_CLASS + '-hidden',
    CREATED_CHECKBOX = WIDGET_CLASS + '-created-checkbox',
    OPTION = 'option',
    OPTION_WRAPPER = OPTION + 'wrapper',
    OPTION_CONTAINER = OPTION + 'container',
    OPTION_ON = OPTION + 'on',
    OPTION_BTN = OPTION + 'btn',
    OPTION_OFF = OPTION + 'off',
    ISIE = (Y.UA.ie>0),
    BOUNDINGBOX = 'boundingBox',
    BOOLEAN = 'boolean',
    STRING = 'string',
    WIDTH = 'width',
    HEIGHT = 'height',
    OFFSETWIDTH = 'offsetWidth',
    OFFSETHEIGHT = 'offsetHeight',
    BORDERRADIUS = 'borderRadius',
    PADDINGTOP = 'paddingTop',
    PADDINGBOTTOM = 'paddingBottom',
    PADDINGLEFT = 'paddingLeft',
    PADDINGRIGHT = 'paddingRight',
    MARGINLEFT = 'marginLeft',
    VALUECHANGE_EVT = 'valuechange',
    FOCUSSED = 'focussed',
    PX = 'px',
    LEFT = 'left',
    DISABLED = 'disabled',
    CHECKED = 'checked',
    CHANGE = 'Change',
    UNSELECTABLE = 'unselectable',
    DIVCLASS = '<div class="',
    ENDDIV = '</div>',
    STRINGTRUE = 'true',
    ONENTER = 'onenter',
    SUBMITONENTER = 'submit'+ONENTER,
    PRIMARYBTNONENTER = 'primarybtn'+ONENTER,
    DATA_ = 'data-',
    DATA_SUBMITONENTER = DATA_+SUBMITONENTER,
    DATA_PRIMARYBTNONENTER = DATA_+PRIMARYBTNONENTER,
    DATA_FOCUSNEXTONENTER = DATA_+'focusnext'+ONENTER,
    BOUNDINGBOX_TEMPLATE_NEWVERSION = DIVCLASS+YUI3_+'widget '+WIDGET_CLASS+' '+WIDGET_CLASS+'-content">'+ENDDIV,
    HTML_CHECKBOX_TEMPLATE = '<input id="{id}" type="checkbox" class="'+CREATED_CHECKBOX+'"{'+READONLY+'}{'+CHECKED+'}{'+DISABLED+'}>',
    TEMPLATE = '{htmlcheckbox}'+
               DIVCLASS+OPTION_WRAPPER+'">'+
                   DIVCLASS+OPTION_CONTAINER+'"{'+UNSELECTABLE+'}>'+
                       DIVCLASS+OPTION_ON+'">{'+OPTION_ON+'}'+ENDDIV+
                       DIVCLASS+OPTION_OFF+'">{'+OPTION_OFF+'}'+ENDDIV+
                       DIVCLASS+OPTION_BTN+'">'+ENDDIV+
                   ENDDIV+
               ENDDIV,
    PARSEINT = function(value) {
        return parseInt(value, 10);
    };




Y.ITSACheckbox = Y.Base.create('itsacheckbox', Y.Widget, [], {

        /**
         * @property {String} CONTENT_TEMPLATE
         * @public
         */
        CONTENT_TEMPLATE : null, // set contentBox===boundingBox will also make srcNode not to render inside boundingBox


        /**
         * The original srcNode when progresive enhancement is being used
         * @property _src
         * @type Node
         * @private
         */

        /**
         * Created hidden html-checkbox when no progresive enhancement is being used.
         * This way, its value can be used to send with a form using serialization.
         * @property _createdSrc
         * @type Node
         * @private
         */

        /**
         * Reference to the wrapperNode
         * @property _wrapperNode
         * @type Node
         * @private
         */

        /**
         * Reference to the containerNode
         * @property _containerNode
         * @type Node
         * @private
         */

        /**
         * Reference to the optionOnNode
         * @property _optionOnNode
         * @type Node
         * @private
         */

        /**
         * Reference to the optionOffNode
         * @property _optionOffNode
         * @type Node
         * @private
         */

        /**
         * Reference to the optionBtnNode
         * @property _optionBtnNode
         * @type Node
         * @private
         */

        /**
         * containerNode's x-position of the 'checked'-state
         * @property _onPosition
         * @type Int
         * @private
         */

        /**
         * x-position where the slider changes from 'unchecked' into 'checked'
         * @property _changePosition
         * @type Int
         * @private
         */



        /**
         * Reference to the parentnode of srcNode (input-element). Is used to check if a label-element is wrapping the html-checkbox
         * @property _srcParentNode
         * @type Y.Node
         * @private
         */

        /**
         * Flag to indicate if the original html-checkbox comes in front of the text: ONLY applyable when is wrapped by a label-element
         * @property _checkBoxBeforeText
         * @type Boolean
         * @private
         */

        /**
         * Backup-ref to the label-element - if applyable
         * @property _bkpLabel
         * @type Y.Node
         * @private
         */

        /**
         * @method initializer
         * @protected
         * @since 0.1
        */
        initializer : function() {
            var instance = this,
                boundingBox = instance.get(BOUNDINGBOX);
            // in case loadingclass is not added to the boundingBox, provide it here
            boundingBox.addClass(LOADING_CLASS);
            if (instance.get(READONLY)) {
                boundingBox.addClass(READONLY_CLASS);
            }
            instance._eventhandlers = [];
        },

        /**
         * Renders the checkbox-widget in the dom.
         *
         * @method renderUI
         * @since 0.1
        */
        renderUI : function() {
            var instance = this,
                boundingBox = instance.get(BOUNDINGBOX),
                src, bkpLabel, checkBoxInsideLabel, srcParentNode, checkBoxBeforeText;
            src = instance._src = instance.get('srcNode');
            if (src && (src.get('tagName')==='INPUT') && (src.getAttribute('type')==='checkbox')) {
              src.addClass(HIDDEN_CLASS);
                // Need to check if checkbox is inside a label-element --> due to HTML validation the widget CANNOT lie inside a label!
                instance._srcParentNode = srcParentNode = src.get('parentNode') || Y.one('body');
                checkBoxInsideLabel = (srcParentNode.get('tagName')==='LABEL');
                // in yui before 3.13.0 the boundingBox was created as a DIV behind srcNode
                // as from 3.13.0, boundingBox===srcNode
                if (boundingBox.get('tagName')==='INPUT') {
                    // as from 3.13.0
                    // no insert, because srcNode already is in the DOM
                    clonedNode = Node.create(BOUNDINGBOX_TEMPLATE_NEWVERSION);
                    if (!checkBoxInsideLabel) {
                        src.insert(clonedNode, 'after');
                    }
                    else {
                        instance._checkBoxBeforeText = checkBoxBeforeText = (srcParentNode.getHTML().toLowerCase().substr(0, 6)==='<label');
                        srcParentNode.insert(clonedNode, checkBoxBeforeText ? 'before' : 'after');
                        // now: mode the checkbox outside its parent labelnode:
                        srcParentNode.insert(src, 'after');
                    }
                    instance._set(BOUNDINGBOX, clonedNode); // redefine the boudingbox --> it has to be a node separate from srcNode
                    // Next, correct the classes that were added to the input-tag during initialization
                    src.removeClass(LOADING_CLASS);
                    src.removeClass(YUI3_+'widget');
                    src.removeClass(WIDGET_CLASS);
                    src.removeClass(WIDGET_CLASS+'-content');
                    if (instance.get(READONLY)) {
                        src.removeClass(READONLY_CLASS);
                    }
                }
                else {
                    // before 3.13.0
                    boundingBox.insert(src, 'before');
                }
                // now disable label-activity:
               bkpLabel = instance._bkpLabel = Y.one('label[for="'+src.get('id')+'"]');
/*jshint expr:true */
               bkpLabel && bkpLabel.removeAttribute('for');
/*jshint expr:false */
            }
            if (instance._parentNode) {
                instance._parentNode.addClass(PARENT_CLASS);
            }
            instance._setTemplate();
        },

        /**
         * Widget's bindUI-method. Binds events
         *
         * @method bindUI
         * @since 0.1
        */
        bindUI : function() {
            var instance = this,
                boundingBox = instance.get(BOUNDINGBOX),
                parentNode = instance._parentNode || boundingBox,
                boundingBoxDOMNode = parentNode.getDOMNode(),
                dd;

            instance.dd = dd = new Y.DD.Drag({
                node: instance._containerNode,
                lock: instance.get(DISABLED) || instance.get(READONLY)
            }).plug(Y.Plugin.DDConstrained, {
                constrain: instance._wrapperNode
            });

            dd.on('drag:end', function(e){
                var offset = (e.pageX-instance.get(BOUNDINGBOX).getX()),
                    // when at most right, the offset will be zero, otherwise it is negative
                    newChecked = (offset>-instance._changePosition),
                    currentChecked = instance.get(CHECKED);
                if (newChecked!==currentChecked) {
                    instance.set(CHECKED, newChecked);
                    // will also slide to the edge
                }
                else {
                    // return to the edgeposition
                    instance._goFinal(currentChecked);
                }
            });

            instance._eventhandlers.push(
                instance.after(CHECKED+CHANGE, function(e) {
                    var checked = e.newVal;
                    instance._goFinal(checked);
                    /**
                    * Fired when the checkbox changes its value<br />
                    * Listen for this event instead of 'checkedChange',
                    * because this event is also fired when the checkbox changes its 'disabled'-state
                    * (switching value null/boolean)
                    *
                    * @event valuechange
                    * @param e {EventFacade} Event Facade including:
                    * @param e.newVal {Boolean|null} New value of the checkbox; will be 'null' when is disabled.
                    * @param e.prevVal {Boolean|null} Previous value of the checkbox; will be 'null' when was disabled.
                    * @since 0.1
                    */
                    instance.fire(VALUECHANGE_EVT, e);
                    if (instance._src) {
                        instance._src.set(CHECKED, checked);
                        if (checked) {
                            instance._src.setAttribute(CHECKED, CHECKED);
                        }
                        else {
                            instance._src.removeAttribute(CHECKED);
                        }
                    }
                })
            );

            instance._eventhandlers.push(
                instance.after(
                    [OPTION_ON+CHANGE, OPTION_OFF+CHANGE],
                    Y.bind(instance._setDimensions, instance)
                )
            );

            instance._eventhandlers.push(
                instance.after(DISABLED+CHANGE, function(e) {
                    var disabled = e.newVal,
                        payload = Y.merge(e),
                        checked;
                    instance._forceCheckedVal = true;
                    checked = instance.get(CHECKED);
                    instance._forceCheckedVal = false;
                    dd.set('lock', disabled || instance.get(READONLY));
                    instance._goFinal(checked, true);
                    // now set up the right payload for the valuechange-event
                    if (disabled) {
                        payload.newVal = null;
                        payload.prevVal = checked;
                    }
                    else {
                        payload.newVal = checked;
                        payload.prevVal = null;
                    }
                    // no api-declaration of the event here --> this already is done with the checkedChange-event
                    instance.fire(VALUECHANGE_EVT, payload);
                    if (instance._src) {
                        if (disabled) {
                            instance._src.setAttribute(DISABLED, DISABLED);
                        }
                        else {
                            instance._src.removeAttribute(DISABLED);
                        }
                    }
                })
            );

            instance._eventhandlers.push(
                instance.after(READONLY+CHANGE, function(e) {
                    var readonly = e.newVal,
                        checked;
                    instance._forceCheckedVal = true;
                    checked = instance.get(CHECKED);
                    instance._forceCheckedVal = false;
                    boundingBox.toggleClass(READONLY_CLASS, readonly);
                    dd.set('lock', readonly || instance.get(DISABLED));
                    instance._goFinal(checked, true);
                    if (instance._src) {
                        if (readonly) {
                            instance._src.setAttribute(READONLY, READONLY);
                        }
                        else {
                            instance._src.removeAttribute(READONLY);
                        }
                    }
                })
            );

            instance._eventhandlers.push(
                instance._containerNode.on('tap', function() {
                    instance.focus();
                    instance.toggle();
                })
            );

            instance._eventhandlers.push(
                parentNode.on(
                    'blur',
                    Y.bind(instance.blur, instance)
                )
            );

            instance._eventhandlers.push(
                Y.after(
                    'rerenderCheckbox',
                    Y.bind(instance.syncUI, instance)
                )
            );

            instance._eventhandlers.push(
                instance.on(SUBMITONENTER+CHANGE, function(e) {
/*jshint expr:true */
                    e.newVal ? parentNode.setAttribute(DATA_SUBMITONENTER, STRINGTRUE) : parentNode.removeAttribute(DATA_SUBMITONENTER);
/*jshint expr:false */
                })
            );

            instance._eventhandlers.push(
                instance.on(PRIMARYBTNONENTER+CHANGE, function(e) {
/*jshint expr:true */
                    e.newVal ? parentNode.setAttribute(DATA_PRIMARYBTNONENTER, STRINGTRUE) : parentNode.removeAttribute(DATA_PRIMARYBTNONENTER);
/*jshint expr:false */
                })
            );

            // DO NOT use 'keypress' for Safari doesn't pass through the arrowkeys!
            instance._eventhandlers.push(
                Y.on('keydown', function(e) {
                    if (instance.get(FOCUSSED) || (boundingBoxDOMNode===Y.config.doc.activeElement)) {
                        var keyCode = e.keyCode;
                        e.preventDefault(); // prevent scrolling
                        if ((keyCode === 37) || (keyCode === 40)) {
                            instance.set(CHECKED, false);
                        }
                        else if ((keyCode === 39) || (keyCode === 38)) {
                            instance.set(CHECKED, true);
                        }
                        else if (keyCode === 32) {
                            instance.toggle();
                        }
                    }
                })
            );
        },

        /**
         * Convenience-method for setting the value of the checkbox to true.
         * You can look at the returnvalue to see if it succeeded.
         *
         * @method check
         * @return {Boolean | null} the value after trying to set it checked
         * @since 0.1
        */
        check : function() {
            var instance = this;
            instance.set(CHECKED, true);
            return instance.getValue();
        },

        /**
         * Convenience-method for getting the value of the checkbox.
         * You can also ask for widget.get('checked')
         *
         * @method getValue
         * @return {Boolean | null} current value, or null when disabled
         * @since 0.1
        */
        getValue : function() {
            return this.get(CHECKED);
        },

        /**
         * Widget's syncUI-method. Builds up the UI using the values of the current attributes.
         *
         * @method syncUI
         * @since 0.1
        */
        syncUI : function() {
            var instance = this;
            instance._setDimensions();
        },

        /**
         * Convenience-method for toggling the value of the checkbox.
         * You can look at the returnvalue to see if it succeeded.
         *
         * @method toggle
         * @return {Boolean} true when toggled succesfully, otherwise false.
         * @since 0.1
        */
        toggle : function() {
            var instance = this,
                prevVal = instance.get(CHECKED),
                newVal;
            if (instance.get(READONLY)) {
                return;
            }
            if (prevVal!==null) {
                instance.set(CHECKED, !prevVal);
                newVal = instance.get(CHECKED);
            }
            return (newVal!==prevVal);
        },

        /**
         * Convenience-method for setting the value of the checkbox to false.
         * You can look at the returnvalue to see if it succeeded.
         *
         * @method uncheck
         * @since 0.1
        */
        uncheck : function() {
            var instance = this;
            instance.set(CHECKED, false);
            return instance.getValue();
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            var instance = this,
                dd = instance.dd,
                checkBoxBeforeText = instance._checkBoxBeforeText,
                createdSrc = instance._createdSrc,
                bkpLabel = instance._bkpLabel,
                src = instance._src;
            instance._destroyAllNodes = true; // making always destroy nodes,
            if (dd) {
                dd.destroy();
            }
            instance._clearEventhandlers();
            if (createdSrc) {
                createdSrc.destroy();
            }
            else {
/*jshint expr:true */
                src && src.removeClass(HIDDEN_CLASS);
/*jshint expr:false */
            }
            if (instance._parentNode) {
                instance._parentNode.removeClass(PARENT_CLASS);
            }
            // now reset label-activity:
/*jshint expr:true */
            bkpLabel && bkpLabel.setAttribute('for', src.get('id'));
/*jshint expr:false */
            // now: replace the checkbox inside its parent labelnode
            if (typeof checkBoxBeforeText==='boolean') {
/*jshint expr:true */
                checkBoxBeforeText ? instance._srcParentNode.prepend(src) : instance._srcParentNode.append(src);
/*jshint expr:false */
            }
        },

        //------------------------------------------------------------------------------
        // --- private Methods ---------------------------------------------------------
        //------------------------------------------------------------------------------

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
        */
        _clearEventhandlers : function() {
            YARRAY.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        },

        /**
         * Moves the slider to its checked/unchecked place, using animation.
         *
         * @method _goFinal
         * @param checked {Boolean} checked/unchecked state which will slide to right/left
         * @param [force] {Boolean} whether to force movement, even if the state is disabled or readonly
         * @private
         * @since 0.1
        */
        _goFinal : function(checked, force) {
            var instance = this;
            if (checked) {
                instance._goRight(true, force);
            }
            else {
                instance._goLeft(true, force);
            }
        },

        /**
         * Moves the slider to the left (unchecked value).
         *
         * @method _goLeft
         * @param [animated] {Boolean} whether to animate movement (using transition)
         * @param [force] {Boolean} whether to force movement, even if the state is disabled or readonly
         * @private
         * @since 0.1
        */
        _goLeft : function(animated, force) {
            var instance = this,
                containerNode = instance._containerNode;
            if ((!instance.get(DISABLED) && !instance.get(READONLY)) || force) {
                if (animated) {
                    instance._moveAnimated(0);
                }
                else {
                    containerNode.setStyle(LEFT, '0');
                }
            }
        },

        /**
         * Moves the slider to the right (checked value).
         *
         * @method _goRight
         * @param [animated] {Boolean} whether to animate movement (using transition)
         * @param [force] {Boolean} whether to force movement, even if the state is disabled or readonly
         * @private
         * @since 0.1
        */
        _goRight : function(animated, force) {
            var instance = this,
                containerNode = instance._containerNode;
            if ((!instance.get(DISABLED) && !instance.get(READONLY)) || force) {
                if (animated) {
                    instance._moveAnimated(instance._onPosition);
                }
                else {
                    containerNode.setStyle(LEFT, instance._onPosition+PX);
                }
            }
        },

        /**
         * Moves the slider to the final location using transition.
         *
         * @method _moveAnimated
         * @param xpos {Int} final location (0 = most left = unchecked state)
         * @private
         * @since 0.1
        */
        _moveAnimated : function(xpos) {
            var instance = this;
            instance._containerNode.transition({
                easing: 'ease-in',
                duration: instance.get('duration'), // 0.75  seconds
                left: xpos+PX
            });
        },

        /**
         * Builds the dimensions (and option-values) of the widget.
         * is runned during syncUI() and when 'optionon' or 'optionoff' changes.
         *
         * @method _setDimensions
         * @private
         * @since 0.1
        */
        _setDimensions : function() {
            // We choosed to re-render the widget based on size-calculation.
            // This does lead to a small performancedecrease, but does make the widget's size fit at all circumstances
            // that is with different css, or different optionlabels.
            var instance = this,
                boundingBox = instance.get(BOUNDINGBOX),
                optionBtnNode, optionOnNode, optionOffNode, radiusleft, radiusright, height, btnNodeWidthHeight, leftIndentBtn, containerNode,
                heightOnNode, heightOffNode, previous, widthOnNode, widthOffNode, optionWidth, wrapperNode, heightBoundingBox, widthBoundingBox,
                btnBtnNodeBorderTop, btnBtnNodeBorderBottom, fireUpdateEvent, newBorderRadius;

            optionBtnNode = instance._optionBtnNode;
            optionOnNode = instance._optionOnNode;
            optionOffNode = instance._optionOffNode;
            wrapperNode = instance._wrapperNode;
            containerNode = instance._containerNode;
            //-------------------------------------------------------------
            boundingBox.addClass(RERENDER_CLASS);
            //-------------------------------------------------------------
            if (instance.get('rendered')) {
                fireUpdateEvent = true;
                optionOnNode.set('text', instance.get(OPTION_ON));
                optionOffNode.set('text', instance.get(OPTION_OFF));
            }
            //-------------------------------------------------------------
            // reset customized width
            containerNode.setStyle(WIDTH, '');
            optionOnNode.setStyle(WIDTH, '');
            optionOffNode.setStyle(WIDTH, '');
            optionBtnNode.setStyle(WIDTH, '');
            containerNode.setStyle(HEIGHT, '');
            optionOnNode.setStyle(HEIGHT, '');
            optionOffNode.setStyle(HEIGHT, '');
            optionBtnNode.setStyle(HEIGHT, '');
            optionOnNode.setStyle(PADDINGLEFT, '');
            optionOnNode.setStyle(PADDINGRIGHT, '');
            optionOnNode.setStyle(PADDINGTOP, '');
            optionOnNode.setStyle(PADDINGBOTTOM, '');
            optionOffNode.setStyle(PADDINGLEFT, '');
            optionOffNode.setStyle(PADDINGRIGHT, '');
            optionOffNode.setStyle(PADDINGTOP, '');
            optionOffNode.setStyle(PADDINGBOTTOM, '');
            //-------------------------------------------------------------
            // set all heights
            heightOnNode = optionOnNode.get(OFFSETHEIGHT);
            heightOffNode = optionOffNode.get(OFFSETHEIGHT);
            height = Math.max(heightOnNode, heightOffNode);
            radiusleft = Math.floor(height/2);
            radiusright = height - radiusleft; // when height is odd, then radiusright===radiusleft+1
            btnBtnNodeBorderTop = PARSEINT(optionBtnNode.getStyle('borderTopWidth'));
            btnBtnNodeBorderBottom = PARSEINT(optionBtnNode.getStyle('borderBottomWidth'));
            btnNodeWidthHeight = height-btnBtnNodeBorderTop-btnBtnNodeBorderBottom+PX;
            optionBtnNode.setStyle(HEIGHT, btnNodeWidthHeight);
            // also: redefine other paddings, so they are in pixels --> em would create digits
            optionOnNode.setStyle(PADDINGTOP, PARSEINT(optionOnNode.getStyle(PADDINGTOP))+PX);
            optionOnNode.setStyle(PADDINGBOTTOM, PARSEINT(optionOnNode.getStyle(PADDINGBOTTOM))+PX);
            optionOffNode.setStyle(PADDINGTOP, PARSEINT(optionOffNode.getStyle(PADDINGTOP))+PX);
            optionOffNode.setStyle(PADDINGBOTTOM, PARSEINT(optionOffNode.getStyle(PADDINGBOTTOM))+PX);
            optionOnNode.setStyle(HEIGHT, height-PARSEINT(optionOnNode.getStyle(PADDINGTOP))-PARSEINT(optionOnNode.getStyle(PADDINGBOTTOM))+PX);
            optionOffNode.setStyle(HEIGHT, height-PARSEINT(optionOffNode.getStyle(PADDINGTOP))-PARSEINT(optionOffNode.getStyle(PADDINGBOTTOM))+PX);
            // we must specify all height to prevent whitelines that are not colored
            //-------------------------------------------------------------
            // set all widths
            // first: add extra padding to on- and off-node to adjust for overlayed btnNode
            optionOnNode.setStyle(PADDINGRIGHT, PARSEINT(optionOnNode.getStyle(PADDINGRIGHT))+radiusleft+PX);
            optionOffNode.setStyle(PADDINGLEFT, PARSEINT(optionOffNode.getStyle(PADDINGLEFT))+radiusright+PX);
            // also: redefine other paddings, so they are in pixels --> em would create digits
            optionOnNode.setStyle(PADDINGLEFT, PARSEINT(optionOnNode.getStyle(PADDINGLEFT))+PX);
            optionOffNode.setStyle(PADDINGRIGHT, PARSEINT(optionOffNode.getStyle(PADDINGRIGHT))+PX);

            widthOnNode = optionOnNode.get(OFFSETWIDTH);
            widthOffNode = optionOffNode.get(OFFSETWIDTH);
            optionWidth = Math.max(widthOnNode, widthOffNode);

            // exactly define the widths to prevent rounderrors

            previous = widthOnNode - PARSEINT(optionOnNode.getStyle(PADDINGLEFT)) - PARSEINT(optionOnNode.getStyle(PADDINGRIGHT));
            optionOnNode.setStyle(WIDTH, previous+(optionWidth-widthOnNode)+PX);
            previous = widthOffNode - PARSEINT(optionOffNode.getStyle(PADDINGLEFT)) - PARSEINT(optionOffNode.getStyle(PADDINGRIGHT));
            optionOffNode.setStyle(WIDTH, previous+(optionWidth-widthOffNode)+PX);
            optionBtnNode.setStyle(WIDTH, btnNodeWidthHeight);

            leftIndentBtn = optionWidth-radiusleft;
            wrapperNode.setStyle(WIDTH, (3*optionWidth)-radiusleft+PX);
            containerNode.setStyle(WIDTH, (2*optionWidth)+PX);
            widthBoundingBox = optionWidth+radiusright+1;
            boundingBox.setStyle(WIDTH, widthBoundingBox+PX);
            //-------------------------------------------------------------
            // set all positions
            optionBtnNode.setStyle(MARGINLEFT, -radiusleft-optionWidth+PX);
            wrapperLeftPos = radiusleft-optionWidth;
            wrapperNode.setStyle(LEFT, wrapperLeftPos+PX);
            instance._onPosition = optionWidth-radiusleft;
            instance._changePosition = Math.round(-wrapperLeftPos/2);
            //-------------------------------------------------------------
            // set all radius --> those of the on-off node get 1 less, to prevent white pixels on the borderside
            optionBtnNode.setStyle(BORDERRADIUS, radiusleft+PX);
            newBorderRadius = radiusleft-1;
            optionOnNode.setStyle(BORDERRADIUS, newBorderRadius+PX+ ' 0 0 0');
            optionOffNode.setStyle(BORDERRADIUS, '0 ' + newBorderRadius+PX+ ' 0 0');
            heightBoundingBox = boundingBox.get(OFFSETHEIGHT);
            boundingBox.setStyle(BORDERRADIUS, Math.round(heightBoundingBox/2)+PX);
            //-------------------------------------------------------------
            if (instance.get(CHECKED)) {
                instance._goRight(false, true);
            }
            else {
                instance._goLeft(false, true);
            }
            boundingBox.removeClass(RERENDER_CLASS);
            if (fireUpdateEvent) {
                instance.fire('contentUpdate');
            }
        },

        /**
         * Renders the dom-structure of the widget (contentBox's innerHTML)
         *
         * @method _setTemplate
         * @private
         * @since 0.1
        */
        _setTemplate : function() {
            var instance = this,
                boundingBox = instance.get(BOUNDINGBOX),
                optionon = instance.get(OPTION_ON),
                optionoff = instance.get(OPTION_OFF),
                newCreatedSrcId, copyNode, optionOnNode, optionOffNode;
            if (!instance._src) {
                copyNode = instance._parentNode || boundingBox;
                newCreatedSrcId = copyNode.get('id')+'_checkbox';
            }
            boundingBox.setHTML(
                LANG.sub(
                    TEMPLATE,
                    {
                        htmlcheckbox: newCreatedSrcId ? LANG.sub(
                                                            HTML_CHECKBOX_TEMPLATE,
                                                                {
                                                                    id: newCreatedSrcId,
                                                                    readonly: (instance.get(READONLY) ? ' '+READONLY+'="'+READONLY+'"' : ''),
                                                                    checked: (instance.get(CHECKED) ? ' '+CHECKED+'="'+CHECKED+'"' : ''),
                                                                    disabled: (instance.get(DISABLED) ? ' '+DISABLED+'="'+DISABLED+'"' : '')
                                                                }
                                                            )
                                                       : '',
                        optionon: optionon,
                        optionoff: optionoff,
                        unselectable: (ISIE ? ' '+UNSELECTABLE+'=on' : '')
                    }
                )
            );
            if (newCreatedSrcId) {
                instance._createdSrc = instance._src = boundingBox.one('#'+newCreatedSrcId);
            }
            instance._wrapperNode = boundingBox.one('.'+OPTION_WRAPPER);
            instance._containerNode = boundingBox.one('.'+OPTION_CONTAINER);
            instance._optionOnNode = optionOnNode = boundingBox.one('.'+OPTION_ON);
            instance._optionOffNode = optionOffNode = optionOnNode.next();
            instance._optionBtnNode = optionOffNode.next();
            parentNode = copyNode || boundingBox;
            parentNode.setAttribute(DATA_FOCUSNEXTONENTER, STRINGTRUE);
/*jshint expr:true */
            instance.get(SUBMITONENTER) && parentNode.setAttribute(DATA_SUBMITONENTER, STRINGTRUE);
            instance.get(PRIMARYBTNONENTER) && parentNode.setAttribute(DATA_PRIMARYBTNONENTER, STRINGTRUE);
/*jshint expr:false */
        },

        /**
         * Checkes whether the srcNode is a valid checkbox-node.
         *
         * @method _srcNodeValidCheckbox
         * @param srcNode {Node} the srcNode which is passed through using progresive enhancement
         * @private
         * @return {Boolean} whether the nde is a valid node or not
         * @since 0.1
        */
        _srcNodeValidCheckbox : function(srcNode) {
            return ((srcNode.get('tagName')==='INPUT') && (srcNode.getAttribute('type')==='checkbox'));
        }

    }, {
        ATTRS : {
            /**
             * @description widget's value, can also be read by method getValue(). Returns 'null' when disabled.
             * @attribute checked
             * @default false
             * @type Boolean | null
            */
            checked : {
                value: false,
                validator: function(val) {
                    var instance = this,
                        blocked;
                    if (instance.get('rendered')) {
                        blocked = instance.get(DISABLED) || instance.get(READONLY);
                    }
                    return (typeof val === BOOLEAN) && !blocked;
                },
                getter: function(val) {
                    var instance = this;
                    return ((!instance.get(DISABLED) || instance._forceCheckedVal) ? val : null);
                }
            },

            /**
             * @description Transitiontime when the slider turns into its endposition.
             * @attribute duration
             * @default 0.15
             * @type Int
            */
            duration : {
                value: 0.15,
                validator: function(val) {
                    return typeof val === 'number';
                }
            },

            /**
             * @description Label of the 'ON'-state.
             * @default 'I'
             * @attribute optionon
             * @type String
            */
            optionon : {
                value: 'I',
                validator: function(val) {
                    return typeof val === STRING;
                }
            },

            /**
             * @description Label of the 'OFF'-state.
             * @attribute optionoff
             * @default 'O'
             * @type String
            */
            optionoff : {
                value: 'O',
                validator: function(val) {
                    return typeof val === STRING;
                }
            },

            /**
             * @description when part of ITSAViewModel, ITSAPanel or ITSAViewModelPanel, the primary-button
             * will be 'click-simulated' when 'enter' is pressed while the checkbox has focus
             *
             * @default false
             * @attribute primarybtnonenter
             * @type String
            */
            primarybtnonenter : {
                value: false,
                validator: function(val) {
                    return typeof val === BOOLEAN;
                }
            },

            /**
             * @description When readonly, the widget has a valid value, but cannot be altered.
             * @attribute readonly
             * @default false
             * @type Boolean
            */
            readonly : {
                value: false,
                validator: function(val) {
                    return typeof val === BOOLEAN;
                }
            },

            /**
             * @description when part of ITSAViewModel or ITSAViewModelPanel, the model will be submitted when 'enter'
             * is pressed while the checkbox has focus
             *
             * @default false
             * @attribute submitonenter
             * @type String
            */
            submitonenter : {
                value: false,
                validator: function(val) {
                    return typeof val === BOOLEAN;
                }
            }

        },
        HTML_PARSER: {
            checked: function (srcNode) {
                var checked =  srcNode.get(CHECKED);
                return (this._srcNodeValidCheckbox(srcNode) && checked);
            },
            readonly: function (srcNode) {
                var readonly = (srcNode.getAttribute(READONLY).toLowerCase()===READONLY);
                return (this._srcNodeValidCheckbox(srcNode) && readonly);
            },
            disabled: function (srcNode) {
                var disabled =  srcNode.get(DISABLED);
                return (this._srcNodeValidCheckbox(srcNode) && disabled);
            }
        }
    }
);

}, 'gallery-2014.02.20-23-55', {
    "requires": [
        "yui-base",
        "dd-ddm",
        "node-base",
        "dom-screen",
        "widget",
        "base-build",
        "dd-drag",
        "dd-constrain",
        "event-tap",
        "transition"
    ],
    "skinnable": true
});
