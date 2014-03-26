YUI.add('gallery-radial-progress', function(Y) {

var isNumber = Y.Lang.isNumber,
    Aeach    = Y.Array.each,
    Widget;

Widget = Y.Base.create('radialProgress', Y.Widget, [], {
    graphic : null,
    outline : null,
    slice   : null,

    renderUI : function() {
        var contentBox = this.get('contentBox'),
            offset     = contentBox.getXY(),
            offsetX = offset[0],
            offsetY = offset[1],
            graphic = new Y.Graphic({ autoSize : true }),

            size    = this.get('size'),
            stops   = this.get('colorstops'),

            outline, slice;

        outline = this.outline = graphic.addShape({
            type   : Y.Circle,
            radius : size,
            x : offsetX,
            y : offsetY,
            stroke : {
                weight : 1,
                color  : stops[0].outline
            },
            fill : {
                color: stops[0].progress
            }
        });

        slice = this.slice = graphic.addShape({
            type   : "pieslice",
            radius : size - 1,
            startAngle : -90,
            x : offsetX + size, y : offsetY + size,
            fill : {
                color : stops[0].background
            },
            stroke : { weight : 0 }
        });

        graphic.render( contentBox );
        this.graphic = graphic;

        return this;
    },

    bindUI : function() {
        this.after('progressChange', this._updateProgress, this);
    },

    syncUI : function() {
        this._updateProgress();
    },

    increment : function(step) {
        if ( isNumber(step) && step > 0 ) {
            step = parseFloat(step, 10);
        } else {
            step = 1;
        }
        
        this.set('progress', this.get('progress') + step);
        return this;
    },

    decrement : function(step) {
        if ( isNumber(step) && step > 0 ) {
            step = parseFloat(step, 10);
        } else {
            step = 1;
        }
        
        this.set('progress', this.get('progress') - step);
        return this;
    },

    update : function(progress) {
        if ( isNumber(progress) ) {
            return this.set('progress', parseFloat(progress, 10));
        }
        throw "Invalid update, must pass in a number\n";
    },

    _updateProgress : function() {
        var outline  = this.outline,
            slice    = this.slice,
            stops    = this.get('colorstops'),
            progress = this.get('progress'),
            arc      = Math.ceil( progress * 3.6 ),
            stopFound = false;

        if ( arc > 360 || arc < -360 ) {
            return;
        }

        Aeach( stops, function(stop) {
            if ( arc >= stop.from && !stopFound ) {
                slice.set('fill', { 'color' : stop.progress });
                outline.set('fill', { 'color' : stop.background });
                outline.set('stroke', { weight: 1, color: stop.outline });
                stopFound = true;
                return;
            }
        });

        slice.set('arc', arc);

        if ( arc === 360 || arc === -360 ) {
            this.fire('complete');
        }
    }

}, {
    ATTRS : {
        progress : { value : 0 },
        size     : { value : 60 },
        colorstops : {
            value : [ { from: 0, background: '#eee', outline: '#ccc', progress: '#fff' } ]
        }
    }
});


Y.RadialProgress = Widget;


}, 'gallery-2012.07.18-13-22' ,{requires:['widget','base','graphics']});
