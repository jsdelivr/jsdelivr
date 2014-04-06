<?php
/**
 * Displays the "Left Header Widgets". This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

if (!suffusion_is_sidebar_empty('8')) {?>
	<!-- left-header-widgets -->
	<div id="left-header-widgets" class='warea fix'>
	<?php
		dynamic_sidebar('Left Header Widgets');
	?>
	</div>
	<!-- /left-header-widgets -->
<?php
}
