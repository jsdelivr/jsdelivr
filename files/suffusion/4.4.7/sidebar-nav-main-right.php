<?php
/**
 * Displays the "Right Header Widgets". This sidebar can be overridden in child themes by creating a file of the same name.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage Sidebars
 */

global $suf_show_search;
if ($suf_show_search == "show" || !suffusion_is_sidebar_empty(3)) {	?>
	<!-- right-header-widgets -->
	<div id="right-header-widgets" class="warea">
	<?php
		if (!dynamic_sidebar('Right Header Widgets')) {
			global $suffusion_rhw_is_not_dynamic;
			$suffusion_rhw_is_not_dynamic = true;
			if ($suf_show_search == "show") {
				get_search_form();
			}
			$suffusion_rhw_is_not_dynamic = false;
		}
	?>
	</div>
	<!-- /right-header-widgets -->
<?php
}
