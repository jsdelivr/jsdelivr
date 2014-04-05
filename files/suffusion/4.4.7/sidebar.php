<?php
/**
 * Default (first) sidebar
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $sidebar_alignment, $suf_sidebar_alignment, $suf_wa_sb1_style, $suf_sidebar_1_def_widgets, $suf_sidebar_header;

if (is_page_template('1l-sidebar.php') || is_page_template('2l-sidebars.php') || (is_page_template('1l1r-sidebar.php') && $suf_sidebar_alignment == 'left')) {
	$sidebar_alignment = 'left';
}
else if (is_page_template('1r-sidebar.php') || is_page_template('2r-sidebars.php') || (is_page_template('1l1r-sidebar.php') && $suf_sidebar_alignment == 'right')) {
	$sidebar_alignment = 'right';
}
else if ($suf_sidebar_alignment == 'left') {
	$sidebar_alignment = 'left';
}
else if ($suf_sidebar_alignment == 'right') {
	$sidebar_alignment = 'right';
}
if ($suf_wa_sb1_style != 'tabbed') {
?>
<div class="dbx-group <?php echo $sidebar_alignment;?> <?php echo $suf_wa_sb1_style;?> warea" id="sidebar">
<?php
	if (!dynamic_sidebar()) {
		if ($suf_sidebar_1_def_widgets == 'show') {
			$before_after_args = array(
				'after_widget' => '</div></aside><!--widget end -->',
				'before_title' => '<h3 class="dbx-handle '.$suf_sidebar_header.'">',
				'after_title' => '</h3>'
			);

			$before_after_args['before_widget'] = '<!--widget start --><aside id="categories" class="dbx-box suf-widget widget_categories"><div class="dbx-content">';
			the_widget('WP_Widget_Categories', array('count' => 1), $before_after_args);
			$before_after_args['before_widget'] = '<!--widget start --><aside id="archives" class="dbx-box suf-widget widget_archive"><div class="dbx-content">';
			the_widget('WP_Widget_Archives', array('count' => 1), $before_after_args);
			$before_after_args['before_widget'] = '<!--widget start --><aside id="meta" class="dbx-box suf-widget"><div class="dbx-content">';
			the_widget('WP_Widget_Meta', array(), $before_after_args);
		}
	}
?>
</div><!--/sidebar -->
<?php
}
else {
?>
<div class="tabbed-sidebar tab-box-<?php echo $sidebar_alignment;?> <?php echo $sidebar_alignment;?> warea fix" id="sidebar">
	<ul class="sidebar-tabs">
<?php
	dynamic_sidebar();
?>
	</ul><!--/sidebar-tabs -->
</div><!--/sidebar -->
<?php
}
