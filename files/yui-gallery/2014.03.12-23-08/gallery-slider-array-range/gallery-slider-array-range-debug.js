YUI.add('gallery-slider-array-range', function(Y) {

// Create a new slider value range that supports an array of possible values

    // Constants for compression or performance
    var MIN    = 'min',
        MAX = 'max',
        VALUES = 'values',
        VALUE = 'value',
        round = Math.round;

    /**
     * @class SliderArrayRange
     */

    function SliderArrayRange() {
        this._initSliderArrayRange();
    }

    Y.SliderArrayRange = Y.mix( SliderArrayRange, {
        // Prototype properties and methods that will be added onto host class
        prototype: {

        _factor: 1,

        /**
        *  set up during the initializer phase.
        *
        * @method _initSliderValueRange
        * @protected
        */
        _initSliderArrayRange: function () {},

        /**
        * Override of stub method in SliderBase that is called at the end of
        * its bindUI stage of render().  Subscribes to internal events to
        * trigger UI and related state updates.
        *
        * @method _bindValueLogic
        * @protected
        */
        _bindValueLogic: function () {},

        /**
        * Move the thumb to appropriate position if necessary.  Also resets
        * the cached offsets and recalculates the conversion factor to
        * translate position to value.
        *
        * @method _syncThumbPosition
        * @protected
        */
        _syncThumbPosition: function () {
            //Y.log("syncThumbPosition");
            this._calculateFactor();
            this._setPosition( this.get( VALUE ) );
        },

        /**
        * Calculates and caches
        * (range between max and min) / (rail length)
        * for fast runtime calculation of position -&gt; value.
        *
        * @method _calculateFactor
        * @protected
        */
         _calculateFactor: function () {
            //Y.log("calculateFactor");
            var length = this.get( 'length' ),
            thumbSize = this.thumb.getStyle( this._key.dim ),
            vals = this.get( VALUES ),
            min = this.get( MIN ) ? this.get( MIN ) : 0,
            max = this.get( MAX ) ? this.get( MAX ) : vals.length - 1;
        
            // The default thumb width is based on Sam skin's thumb dimension.
            // This attempts to allow for rendering off-DOM, then attaching
            // without the need to call syncUI().  It is still recommended
            // to call syncUI() in these cases though, just to be sure.
            length = parseFloat( length ) || 150;
            thumbSize = parseFloat( thumbSize ) || 15;
            this._factor = ( max - min ) / ( length - thumbSize );
        },

        /**
        * Dispatch the new position of the thumb into the value setting
        * operations.
        *
        * @method _defThumbMoveFn
        * @param e { EventFacade } The host's thumbMove event
        * @protected
         */
        _defThumbMoveFn: function ( e ) {
            var previous = this.get( VALUE ),
            prevOffset = this._valueToOffset( previous ),
            value = this._offsetToValue( e.offset );

            // This test avoids duplication of this.set(..) if the origin
            // of this thumbMove is from slider.set('value',x);
            // slider.set() -> afterValueChange -> uiMoveThumb ->
            // fire(thumbMove) -> _defThumbMoveFn -> this.set()
            if ( prevOffset !== e.offset ) {
                this.set( VALUE, value, { positioned: true } );
                this._setPosition(value);
            }
        },

        /**
        * <p>Converts a pixel position into a value.  Calculates current
        * thumb offset from the leading edge of the rail multiplied by the
        * ratio of <code>(max - min) / (constraining dim)</code>.</p>
        *
        * <p>Override this if you want to use a different value mapping
        * algorithm.</p>
        *
        * @method _offsetToValue
        * @param offset { Number } X or Y pixel offset
        * @return { mixed } Value corresponding to the provided pixel offset
        * @protected
        */
        _offsetToValue: function ( offset ) {
            //Y.log("_offsetTovalue: " + offset);
            var value = round( offset * this._factor ) + this.get( MIN );
            var vals = this.get( VALUES );
            return (vals && vals[value]) ? vals[value] : this.get( MIN );
        },

        /**
        * Converts a value into a pixel offset for use in positioning
        * the thumb according to the reverse of the
        * <code>_offsetToValue( xy )</code> operation.
        *
        * @method _valueToOffset
        * @param val { Number } The value to map to pixel X or Y position
        * @return { Number } The pixel offset
        * @protected
        */
        _valueToOffset: function ( value ) {
            var offset = 0;
            var vals = this.get( VALUES );
            for(var i = 0; i<vals.length; i++) {
                if(vals[i] == value) {
                    offset = i;
                }
            }
            offset = round( ( offset - this.get( MIN ) ) / this._factor );
            //Y.log("valueToOffset: " + offset);
            return offset;
        },

        /**
        * Returns the current value.  Override this if you want to introduce
        * output formatting. Otherwise equivalent to slider.get( "value" );
        *
        * @method getValue
        * @return {Number}
        */
        getValue: function () {
            return this.get( VALUE );
        },

        /**
        * Updates the current value.  Override this if you want to introduce
        * input value parsing or preprocessing.  Otherwise equivalent to
        * slider.set( "value", v );
        *
        * @method setValue
        * @param val {Number} The new value
        * @return {Slider}
        * @chainable
        */
        setValue: function ( val ) {
            this.set( VALUE, val );
            this._syncThumbPosition();
        },

        setValues: function ( vals ) {
            //Y.log("setValues");
            var max = vals ? vals.length - 1 : 0;
            this.set(MIN, 0);
            this.set(MAX, max);
            this.set( VALUES, vals );
            this._syncThumbPosition();
        },

        getValues: function() {
            return this.get( VALUES );
        },

        /**
        * Verifies that the current value is within the min - max range.  If
        * not, value is set to either min or max, depending on which is
        * closer.
        *
        * @method _verifyValue
        * @protected
        */
        _verifyValue: function () {
            //Y.log("verifyValue");
            var value   = this.get( VALUE ),
            nearest = this._nearestValue( value );

            if ( value !== nearest ) {
                this.set( VALUE, nearest );
            }
        },


        /**
        * Positions the thumb in accordance with the translated value.
        *
        * @method _setPosition
        * @protected
        */
        _setPosition: function ( value ) {
            //Y.log("_setPosition: " + value);
             this._uiMoveThumb( this._valueToOffset( value ) );
        },


        /**
        * Restricts new values assigned to <code>value</code> attribute to be
        * between the configured <code>min</code> and <code>max</code>.
        * Rounds to nearest integer value.
        *
        * @method _setNewValue
        * @param value { Number } Value assigned to <code>value</code> attribute
        * @return { Number } Normalized and constrained value
        * @protected
        */
        _setNewValue: function ( value ) {
            //Y.log("setNewValue: " + value);
            var vals = this.get("values");
            var val = 0;
            for(var i = 0; i<vals.length; i++) {
                if(vals[i] == value) {
                    val = value;
                }
            }
            return val;
        },


        _setNewValues: function ( vals ) {
            this.set(MIN, 0);
            var max = vals ? vals.length - 1 : 0;
            this.set(MAX, max);
            return vals;
        },

        /**
        * Returns the nearest valid value to the value input.
        *
        * @method _nearestValue
        * @param value { mixed } Value to test against current array
        * @return { Number } Current min, max, or value if within array
        * @protected
        */
        _nearestValue: function ( value ) {
            var min = this.get( MIN ),
            max = this.get( MAX ),
            tmp = 0;

            for(tmp = min; tmp<max; tmp++) {
                if(tmp < value) {
                    continue;
                }
            }

            return tmp;
        }

    },

    /**
    * Attributes that will be added onto host class.
    *
    * @property ATTRS
    * @type {Object}
    * @static
    * @protected
    */
    ATTRS: {
        values: {
            value    :  [],
            setter: '_setNewValues'
        },

        /**
        * The value associated with the thumb's current position on the
        * rail. Defaults to the value inferred from the thumb's current
        * position. Specifying value in the constructor will move the
        * thumb to the position that corresponds to the supplied value.
        *
        * @attribute value
        * @type { Number }
        * @default (inferred from current thumb position)
        */
        value: {
            value : 0,
            setter: '_setNewValue'
        }
    }
}, true );


}, 'gallery-2011.11.30-20-58' ,{requires:['slider-base'], skinnable:false});
