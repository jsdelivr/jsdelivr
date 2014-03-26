YUI.add('gallery-widget-modalshim', function(Y) {

/**
 * 修复 Y.WidgetModality IE6 的问题
 */

function ModalShim(config) {
    Y.after(this._renderUIModalShim, this, '_renderUIModal');
    Y.after(this._syncUIModalShim, this, '_syncUIModal');
}

ModalShim.NAME = 'modal-shim';
ModalShim.ATTRS = {
    modalShim: {
        value: UA.ie === 6,
        validator: L.isBoolean
    }
};
ModalShim.CLASS_NAME = Widget.getClassName('modal', 'shim');
ModalShim.TEMPLATE = '<iframe class="' + ModalShim.CLASS_NAME + '" frameborder="0" title="Widget Modal Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>';

ModalShim.prototype = {
    _renderUIModalShim: function() {
        this._uiSetModalShim(this.get('modalShim'));
    },
    _syncUIModalShim: function() {
        this._uiSetModalShim(this.get('modalShim'));
    },
    _uiSetModalShim: function(enable) {
        if(enable) {
            this._renderModalShim();
            this._addModalShimResizeHandlers();
        } else {
            this._destroyModalShim();
        }
    },
    _renderModalShim: function() {
        var modalShimNode = this._modalShimNode,
            maskNode = this.get('maskNode');
        if( ! modalShimNode) {
            modalShimNode = this._modalShimNode = this._getModalShimTemplate();
            maskNode.prepend(modalShimNode);
            this.sizeModalShim();
        }
    },
    _addModalShimResizeHandlers: function() {
        this._modalShimHandles || (this._modalShimHandles = []);
        var handles = this._modalShimHandles,
            sizeModalShim = this.sizeModalShim;
        handles.push(this.after('visibleChange', sizeModalShim));
        handles.push(this.after('WidthChange', sizeModalShim));
        handles.push(this.after('HeightChange', sizeModalShim));
        handles.push(this.after('contentUpdate', sizeModalShim));
    },
    _detachModalShimHandlers: function() {
        var handlers = this._modalShimHandles, handle;
        if(handlers && handlers.length > 0) {
            while((handle = handlers.pop())) {
                handle.detach();
            }
        }
    },
    sizeModalShim: function() {
        var shim = this._modalShimNode,
        maskNode = this.get('maskNode');
        if(shim && this.get('visible')) {
            shim.setStyles({
                width: maskNode.get('offsetWidth') + 'px',
                height: maskNode.get('offsetHeight') + 'px'
            });
        }
    },
    _getModalShimTemplate: function() {
        return Node.create(ModalShim.TEMPLATE);
    },
    _destroyModalShim: function() {
        this._modalShimNode.remove(true);
        this._detachModalShimHandlers();
    }
};

Y.WidgetModalShim = ModalShim;




}, 'gallery-2012.09.26-20-36' ,{requires:['widget', 'widget-modality'], skinnable:true});
