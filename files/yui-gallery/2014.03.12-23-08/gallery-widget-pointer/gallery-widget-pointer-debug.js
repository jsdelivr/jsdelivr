YUI.add('gallery-widget-pointer', function (Y, NAME) {

/**
 * Extension enabling a Widget to have a pointer along a given edge.
 *
 * @module widget-pointer
 */
    var getCN = Y.ClassNameManager.getClassName,
        UPARROW = "up",
        DOWNARROW = "down",
        LEFTARROW = "left",
        RIGHTARROW = "right",
        POINTER = 'pointer',
        WIDGET = 'widget',

        CLASSES = {
            pointer: getCN(WIDGET, POINTER),
            above: getCN(WIDGET, POINTER, UPARROW),
            below: getCN(WIDGET, POINTER, DOWNARROW),
            left: getCN(WIDGET, POINTER, LEFTARROW),
            right: getCN(WIDGET, POINTER, RIGHTARROW)
        };

    /**
    Class extension that adds a pointer/arrow element to a widget.

    @class WidgetPointer
    **/
    function Pointer() {

        //  Widget method overlap
        Y.after(this._renderUIPointer, this, 'renderUI');
        Y.after(this._bindUIPointer, this, 'bindUI');
        Y.after(this._syncUIPointer, this, 'syncUI');
    }

    Pointer.ATTRS = {
        /**
        The alignment of the pointer. May be one of 'above', 'below', 'left' or
        'right', or an object with `node` and `placement` properties.

        @attribute pointerAlign
        @type String|Object
        @default 'above'
        **/
        pointerAlign: {
            valueFn: function () {
                return {
                    placement: 'above'
                };
            },
            setter: function (value) {
                return typeof value === 'string' ? {placement: value} : value;
            }
        }
    };

    /**
    Table of CSS class names used by this extension. Includes a base 'pointer'
    class and classes for each pointer direction.

    @property CLASSES
    @type Object
    @static
    **/
    Pointer.CLASSES = CLASSES;

    Pointer.prototype = {

        POINTER_TEMPLATE: '<div class="' + CLASSES.pointer + '"></div>',

        // --- Lifecycle ---

        initializer: function () {
            /**
            Pointer element. Usually an element with no width or height that
            uses a border to look like an arrow.

            @property _pointer
            @type Node
            @protected
            **/
            this._pointer = Y.Node.create(this.POINTER_TEMPLATE);
            /**
            Node to which the pointer sticks to. The pointer is always aligned
            so that one border touches the border of this box. Defaults to
            the bounding box of the widget. It can be changed to other elements
            of the widget.

            @property _pointerBox
            @type Node
            @protected
            **/
            if (!this._pointerBox) {
                this._pointerBox = this.get('boundingBox');
            }
        },

        destructor: function () {
            this._pointer.unplug(Y.Plugin.Align);
            this._pointer = this._pointerBox = null;
        },

        /**
        Render stage of the lifecycle for the widget's pointer.

        @method _renderUIPointer
        @protected
        **/
        _renderUIPointer: function () {
            var align = this.get('pointerAlign');

            this.get('boundingBox').prepend(this._pointer);
            this._pointer.plug(Y.Plugin.Align);

            if (align) {
                this._setPointerClassnames(align.placement);
            }
        },

        /**
        Bind stage of the lifecycle for the widget's pointer.

        @method _bindUIPointer
        @protected
        **/
        _bindUIPointer: function () {
            this.after('pointerAlignChange', this._afterPointerAlignChange);
        },

        /**
        Sync stage of the lifecycle for the widget's pointer.

        @method _syncUIPointer
        @protected
        **/
        _syncUIPointer: function () {
            var align = this.get('pointerAlign');
            this._uiSetPointerAlign(align.node, align.placement);
        },

        // --- Public API ---

        /**
        Aligns the pointer to a node and a specific direction. When passing a
        specific node, the pointer sticks to the border of the widget's bounding
        box but aligns in the other direction to the center of the provided node.

        This method may be called without attributes to sync the position of the
        pointer.

        @method alignPointer
        @param {Node|String} [node] Node or selector to the node to align to.
                        Defaults to the boundingBox of the widget
        @param {String} [placement] The orientation of the pointer. May be one
                        of 'above', 'below', 'left' or 'right'
        @chainable
        **/
        alignPointer: function (node, placement) {
            if (arguments.length) {
                node = Y.one(node) || this._pointerBox;

                this.set('pointerAlign', {
                    node: node,
                    placement: placement || node.getData('placement')
                });
            } else {
                this._syncUIPointer();
            }

            return this;
        },

        // --- Private methods ---

        /**
        Returns the correct CSS class name for each pointer direction.

        @method _getArrowType
        @param {String} placement Direction of the pointer
        @return {String} CSS classname
        @private
        **/
        _getArrowType: function (placement) {
            var arrowClass = '';

            switch (placement) {
                case "below":
                    arrowClass = CLASSES.above;
                    break;
                case "right":
                    arrowClass = CLASSES.left;
                    break;
                case "above":
                    arrowClass = CLASSES.below;
                    break;
                case "left":
                    arrowClass = CLASSES.right;
                    break;
                default:
                    Y.log("A correct placement parameter was not specified. Accepted placements are 'above', 'below', 'left' and 'right'.");
                    break;
            }
            
            return arrowClass;
        },

        /**
        Sets the correct position to the pointer node.
        Providing a node still keeps the pointer "stuck" to the pointer box,
        but it aligns the other coordinate to the center of the provided node.
        This means that the pointer node always has the fat border of the arrow
        in touch with the pointer box.

        @method _uiSetPointerAlign
        @param {Node} node Node to align the pointer to
        @param {String} placement Direction of the pointer
        @private
        **/
        _uiSetPointerAlign: function (node, placement) {
            var pointer = this._pointer,
                box = this._pointerBox,
                region = box.get('region');

            // Use a region instead of a node for alignment with Plugin.Align
            // This allows for changing some of the properties to match a
            // different alignment strategy
            // This changes the region in the axis opposite to the one
            // touching the pointer box
            if (node && box !== node) {
                Y.mix(region, node.get('region'), true,
                    (placement === 'above' || placement === 'below') ?
                    ['left', 'right', 'width'] :
                    ['top', 'bottom', 'height']
                );
            }

            switch (placement) {
                case "above":
                    pointer.align.to(region, "bc", "tc", true);
                    break;
                case "below":
                    pointer.align.to(region, "tc", "bc", true);
                    break;
                case "left":
                    pointer.align.to(region, "rc", "lc", true);
                    break;
                case "right":
                    pointer.align.to(region, "lc", "rc", true);
                    break;
                default:
                    Y.log("A correct alignment was not specified. Accepted alignments are 'above', 'below', 'left' and 'right'.");
                    break;
            }
        },

        /**
        Sets the correct classnames to the pointer element.

        @method _setPointerClassnames
        @param {String} placement New placement of the pointer
        @private
        **/
        _setPointerClassnames: function (placement) {
            this._pointer.set('className',
                CLASSES.pointer + " " + this._getArrowType(placement));
        },

        /**
        Syncs the classnames and position of the pointer after its align changes.

        @method _afterPointerAlignChange
        @param {EventFacade} e Facade for the pointerAlignChange event
        @private
        **/
        _afterPointerAlignChange: function (e) {
            var align = e.newVal;

            if (align) {
                this._setPointerClassnames(align.placement);
                this._uiSetPointerAlign(align.node, align.placement);
            }
        }
        
    };

    Y.WidgetPointer = Pointer;



}, '@VERSION@', {
    "requires": [
        "widget",
        "base-build",
        "align-plugin",
        "classnamemanager"
    ],
    "skinnable": true,
    "version": 0.1
});
