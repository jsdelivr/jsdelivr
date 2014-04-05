<?php
/**
 * Displays the "Top Bar Left Widgets". This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

if (!suffusion_is_sidebar_empty(6)) {
?>
	<!-- #top-bar-left-widgets -->
	<div id="top-bar-left-widgets" class="warea">
<?php
	dynamic_sidebar('Top Bar Left Widgets');
?>
	</div>
	<!-- /#top-bar-left-widgets -->
<?php
}
