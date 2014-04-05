<?php
/**
 * Page Navigation for Mosaic layout. This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Users can override this in a child theme.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */

global $suf_pagination_type, $suf_pagination_index, $suf_pagination_prev_next, $suf_pagination_show_all;
if (is_singular()) {
	return;
}
if (suffusion_show_page_nav()) {
	if (function_exists("wp_pagenavi")) {
		// If the user has wp_pagenavi installed, we will use that for pagination
		?>
			<div class="page-nav fix">
		<?php
				wp_pagenavi();
		?>
			</div><!-- page nav -->
		<?php
	}
	else {
?>
	<div class="mosaic-page-nav-left"><?php previous_posts_link('&nbsp;'); ?></div>
	<div class="mosaic-page-nav-right"><?php next_posts_link('&nbsp;'); ?></div>
<?php
	}
}
?>