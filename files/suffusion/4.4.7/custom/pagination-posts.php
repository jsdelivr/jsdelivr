<?php
/**
 * Page Navigation for posts. This shows a numbered index or "Older Posts"/"Newer Posts" at the bottom of each page.
 * This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
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
	else if ($suf_pagination_type == "numbered") {
		// The user doesn't have WP-PageNavi, but still wants pagination
		global $wp_query, $paged;
		$max_page = $wp_query->max_num_pages;
		$prev_next = $suf_pagination_prev_next == "show";
		$show_all = $suf_pagination_show_all == "all";
		if (!$paged && $max_page >= 1) {
			$current_page = 1;
		}
		else {
			$current_page = $paged;
		}
?>
	<div class="page-nav fix">
		<div class="suf-page-nav fix">
<?php
		if ($suf_pagination_index == "show") {
?>
			<span class="page-index"><?php printf(__('Page %1$s of %2$s', 'suffusion'), $current_page, $max_page); ?></span>
<?php
		}
		echo paginate_links(array(
			"base" => add_query_arg("paged", "%#%"),
			"format" => '',
			"type" => "plain",
			"total" => $max_page,
			"current" => $current_page,
			"show_all" => $show_all,
			"end_size" => 2,
			"mid_size" => 2,
			"prev_next" => $prev_next,
			"next_text" => __('Older Entries', 'suffusion'),
			"prev_text" => __('Newer Entries', 'suffusion'),
		));
?>
		</div><!-- suf page nav -->
	</div><!-- page nav -->
<?php
	}
	else {
?>
	<div class="page-nav fix">
		<span class="previous-entries"><?php next_posts_link('<span class="icon">&nbsp;</span>'.__('Older Entries', 'suffusion')); ?></span>
		<span class="next-entries"><?php previous_posts_link('<span class="icon">&nbsp;</span>'.__('Newer Entries', 'suffusion')); ?></span>
	</div><!-- page nav -->
<?php
	}
}
?>