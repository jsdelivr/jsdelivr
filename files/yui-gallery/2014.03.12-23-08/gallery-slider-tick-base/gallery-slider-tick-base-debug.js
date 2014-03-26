YUI.add('gallery-slider-tick-base', function(Y) {

//Create a new slider base that supports rendering positioned tick marks along the rail

    // Create a new Y.ImageChart class that extends Y.CartesianChart.
    var VALUES = 'values';
    Y.SliderTickBase = Y.Base.create('gallery-slider-tick-base', Y.SliderBase, [
        
        ], {
            addTickMarks: function() {
                var values = this.get( VALUES );
                if(values) {
                    var rail = this.rail; //rail node

                    var thumbSize = this.thumb.getStyle( this._key.dim );
                    thumbSize = parseFloat( thumbSize ) || 15;

                    if(this.graphic == null) {
                        this.graphic = new Y.Graphic({render: rail});
                    }
                    this.graphic.removeAllShapes();


                    //draw a tick at every position
                    for(var i = 0; i<values.length; i++) {
                        var currentValue = values[i];
                        var currentPos = this._valueToOffset(currentValue) + (thumbSize / 2);
                        this._drawTickMark(currentPos, '#CDCDCD');
                    }

                }
            },

            _drawTickMark: function(currentPos, tickColor) {
                var tickHeight = 3;
                var topTickOffset = 2;
                var bottomTickOffset = 15;

                var topTickMark = this.graphic.addShape({
                    type: 'rect',
                        width: 1                                              ,
                        height: tickHeight,
                        x: currentPos,
                        y: topTickOffset
                    });
                topTickMark.set('stroke', { color: tickColor, weight: 1, opacity: 0.5 });
                topTickMark.set('fill', { color: tickColor, opacity: 0.5 });

                var bottomTickMark = this.graphic.addShape({
                    type: 'rect',
                    width: 1                                              ,
                    height: tickHeight,
                    x: currentPos,
                    y: bottomTickOffset
                });
                bottomTickMark.set('stroke', { color: tickColor, weight: 1, opacity: 0.5 });
                bottomTickMark.set('fill', { color: tickColor, opacity: 0.5 });
            }
        }, {
        ATTRS: {
            // Define widget attributes here (optional).
         }
        // Define static properties and methods here (optional).
    });    


}, 'gallery-2011.11.30-20-58' ,{requires:['node', 'slider-base', 'graphics'], skinnable:false});
