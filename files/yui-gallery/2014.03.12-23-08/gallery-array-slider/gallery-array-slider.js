YUI.add('gallery-array-slider', function(Y) {

//Create slider that supports an array of possible values
Y.ArraySlider = Y.Base.build( 'slider', Y.SliderTickBase,
	[ Y.SliderArrayRange, Y.ClickableRail ] );


}, 'gallery-2011.11.30-20-58' ,{requires:['gallery-slider-tick-base', 'clickable-rail', 'gallery-slider-array-range'], skinnable:false});
