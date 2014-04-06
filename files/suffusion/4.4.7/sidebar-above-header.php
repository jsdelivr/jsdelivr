<?php
/**
 * Displays the Header Widgets. These appear at the same level as the header image. This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

$display = apply_filters('suffusion_can_display_widgets_above_header', true);
if (!$display) {
	return;
}
if (!suffusion_is_sidebar_empty(11)) {
?>
	<!-- #widgets-above-header -->
	<div id="widgets-above-header" class='warea fix'>
		<div class='col-control'>
<?php
	dynamic_sidebar('Widgets Above Header');
?>
		</div>
	</div>
	<!-- /#widgets-above-header -->
<?php
}
?>