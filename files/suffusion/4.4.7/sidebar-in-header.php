<?php
/**
 * Displays the Widget Area Above Footer. This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

if (!suffusion_is_sidebar_empty(12)) {
?>
	<!-- #header-widgets -->
	<div id="header-widgets" class="warea">
<?php
	dynamic_sidebar('Header Widgets');
?>
	</div>
	<!-- /#header-widgets -->
<?php
}
