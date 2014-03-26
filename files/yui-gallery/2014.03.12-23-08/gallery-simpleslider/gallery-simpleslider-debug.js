YUI.add('gallery-simpleslider', function(Y) {

var NS = Y.namespace('apm'),

    SimpleSlider = function(o) {

        SimpleSlider.superclass.constructor.apply(this, arguments);

        var contentbox = Y.one(o.node),
            valuebox = contentbox.one('> div'),
            thumb = valuebox.one('> div');

        this.contentbox = contentbox;
        this.valuebox = valuebox;
        this.thumb = thumb;

        thumb.plug(Y.apm.Center);

        this.dd = new Y.DD.Drag({ 
            node: thumb 
        }).plug(Y.Plugin.DDConstrained, { 
            constrain2node: contentbox 
        });

    };

SimpleSlider.NAME = 'SimpleSlider';

SimpleSlider.ATTRS = {
    value: {
        value: [0, 0],
        readonly: true
    }
};

Y.extend(SimpleSlider, Y.Base, {

    center: function(e, halt) {

        var thumb = this.thumb,
            dd = thumb.dd;

        // move the center element to the position of the click
        thumb.apm_center.to(e);

        // set the event target to the thumb so we can invoke drag and drop on the thumb
        e.target = thumb;

        // delegate the mousedown so the user can continue to drag after the contentbox click
        dd._handleMouseDownEvent(e);

        // make a call to an internal drag method that will apply the constraints
        dd._alignNode([e.pageX, e.pageY]);

        if (halt) {
            dd._handleMouseUp(e);
        }

        return this;
    },

    render: function() {

        var thumb = this.thumb,
            dd = thumb.dd,
            contentbox = this.contentbox,
            valuebox = this.valuebox;

        // since we initiate a drag when we move the element when
        // the content box is clicked, we only need to update the
        // value on the drag event to capture both UI mechanics.
        dd.on('drag:drag', function(e) {
            var bgPos = valuebox.getXY(),
                center = thumb.apm_center.calc(),
                x =  center[0] - bgPos[0],
                y =  center[1] - bgPos[1];

            this.set('value', [x, y]);
        }, this);

        contentbox.on('mousedown', function(e) {
            this.center(e);
        }, this);

        return this;
    },

    update: function(value) {
        var region = this.thumb.get('region'),
            current = this.get('value'),
            offset = this.thumb.apm_center.offset(),
            diffX = current[0] - value[0] - offset[0],
            diffY = current[1] - value[1] - offset[0];

        return this.center({ 
            pageX: region.left - diffX, 
            pageY: region.top - diffY, 
            halt: function(){} 
        }, true);
    }

});

NS.SimpleSlider = SimpleSlider;


}, 'gallery-2010.02.19-03' ,{requires:['node-pluginhost','node-screen']});
