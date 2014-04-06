<?php
/**
 * Page Navigation for Comments. This shows a numbered index or "Older Comments"/"Newer Comments" at the bottom of each page.
 * This file should not be loaded by itself, but should instead be included using get_template_part or locate_template.
 * Users can override this in a child theme.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */
global $suf_cpagination_type, $suf_cpagination_index, $suf_cpagination_prev_next, $suf_cpagination_show_all, $suf_show_track_ping, $suffusion_comment_types;
if ($suf_show_track_ping == 'show' || $suf_show_track_ping == 'hide') {
	$older = __("Older Comments", "suffusion");
	$newer = __("Newer Comments", "suffusion");
}
else {
	$comment_type = suffusion_get_comment_type_from_request();
	$type = isset($suffusion_comment_types[$comment_type]) ? $suffusion_comment_types[$comment_type] : $suffusion_comment_types['comment'];
	$older = sprintf(__('Older %1$s', 'suffusion'), $type);
	$newer = sprintf(__('Newer %1$s', 'suffusion'), $type);
}
if ($suf_cpagination_type == 'old-new') {
?>
<div class="navigation fix">
	<div class="alignleft"><?php previous_comments_link("&laquo; $older"); ?></div>
	<div class="alignright"><?php next_comments_link("$newer &raquo;"); ?></div>
</div>
<?php
}
else {
	// The user wants pagination
	global $wp_query, $cpage;
	$max_page = get_comment_pages_count();
	$prev_next = $suf_cpagination_prev_next == "show";
	$show_all = $suf_cpagination_show_all == "all";
	if (!$cpage && $max_page >= 1) {
		$current_page = $max_page;
	}
	else {
		$current_page = $cpage;
	}
	if ($max_page > 1) {
?>
	<div class="navigation fix">
		<div class="suf-page-nav fix">
<?php
		if ($suf_cpagination_index == "show") {
?>
			<span class="page-index"><?php printf(__('Page %1$s of %2$s', 'suffusion'), $current_page, $max_page); ?></span>
<?php
		}
		$comment_order = get_option('comment_order');
		if ($comment_order == 'asc') {
			$next_text = $newer." &raquo;";
			$prev_text = "&laquo; ".$older;
		}
		else {
			$prev_text = "&laquo; ".$newer;
			$next_text = $older." &raquo;";
		}
		echo paginate_comments_links(array(
			"base" => add_query_arg("cpage", "%#%"),
			"format" => '',
			"type" => "plain",
			"total" => $max_page,
			"current" => $current_page,
			"show_all" => $show_all,
			"end_size" => 2,
			"mid_size" => 2,
			"prev_next" => $prev_next,
			"next_text" => $next_text,
			"prev_text" => $prev_text,
		));
?>
		</div><!-- suf page nav -->
	</div><!-- page nav -->
<?php
	}
}
?>