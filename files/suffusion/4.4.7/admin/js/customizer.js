/**
 * Used by the theme customizer in the back-end.
 */
$j = jQuery.noConflict();

$j(document).ready(function() {
	$j('.dropdown-arrow').click(function() {
		var parent = $j(this).parents('.customize-control-suffusion-image');
		$j(parent).toggleClass('open');
		var library = $j(parent).find('.library');
		var list = $j(library).children('ul').children();
		if (typeof list != 'undefined' && list.length > 0) {
			$j(list[0]).toggleClass('library-selected');
			$j(library).children('.library-content').toggleClass('library-selected');
		}
	});

	$j('.customize-suffusion-image-picker a.thumbnail').click(function(e) {
		var selection = $j(this).data('customize-image-value');
		var source = $j(this).children('img').prop('src');
		var controller = $j(this).parents('.customize-suffusion-image-picker');
		if (selection) {
			$j(controller).find('.dropdown-content img').prop({src: source});
			$j(controller).find('.preview-text').html($j(this).prop('title'));
			e.preventDefault();
		}
	});
});

